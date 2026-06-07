"""Hai luồng chính của RAG: ingest() nạp tài liệu và answer() trả lời hội thoại.

Đây là nơi 3 database phối hợp:
  ingest  → Qdrant (vector + payload)  + Postgres (metadata documents/chunks)
  answer  → Redis (cache) → Qdrant (search có lọc) → LLM → trả lời + citations
Việc LƯU tin nhắn/citations vào Postgres do chat/router.py đảm nhiệm.
"""
import time
import uuid

from src.config import settings
from src.db import postgres, redis_cache
from src.rag import chunk, embed, llm
from src.vector import qdrant_store


def ingest(text: str, source: str = "upload", title: str | None = None,
           owner_id: str | None = None, lang: str = "vi"):
    spans = chunk.chunk_text_with_spans(text)
    if not spans:
        raise ValueError("Tài liệu rỗng sau khi cắt đoạn.")

    pieces = [s[0] for s in spans]
    vectors = embed.embed_texts(pieces)
    doc_id = str(uuid.uuid4())
    created_at = int(time.time())
    owner_payload = owner_id or qdrant_store.SHARED  # None = dùng chung cho mọi người

    items, chunk_rows = [], []
    for i, ((piece, c_start, c_end), vec) in enumerate(zip(spans, vectors)):
        point_id = str(uuid.uuid4())
        chunk_id = str(uuid.uuid4())
        items.append(
            {
                "point_id": point_id,
                "vector": vec,
                "payload": {
                    "document_id": doc_id,
                    "chunk_id": chunk_id,
                    "ordinal": i,
                    "text": piece,
                    "source": source,
                    "title": title or source,
                    "owner_id": owner_payload,  # trường LỌC ĐƯỢC (đa người dùng)
                    "lang": lang,               # trường LỌC ĐƯỢC (đa ngôn ngữ)
                    "created_at": created_at,    # trường LỌC ĐƯỢC (theo thời gian)
                },
            }
        )
        chunk_rows.append((chunk_id, doc_id, i, chunk.count_tokens(piece), point_id, c_start, c_end))

    qdrant_store.upsert_chunks(items)
    postgres.insert_document(doc_id, source, title or source, owner_id)
    postgres.insert_chunks(chunk_rows)
    return {"document_id": doc_id, "chunks": len(pieces)}


def answer(question: str, history=None, top_k: int | None = None, owner_id: str | None = None):
    """Trả lời 1 câu hỏi. Trả về answer + sources(citations) + cờ cached + latency_ms.

    Cache câu trả lời theo (phạm vi owner + câu hỏi + top_k). Khi LLM tắt (mặc định),
    câu trả lời chỉ phụ thuộc truy hồi nên cache là chính xác. Khi bật LLM sinh
    theo lịch sử, muốn chặt chẽ có thể thêm trạng thái hội thoại vào khóa cache.
    """
    top_k = top_k or settings.retrieve_top_k
    started = time.perf_counter()

    scope = owner_id or "shared"
    key = redis_cache.cache_key("ans", scope, question, top_k)
    cached = redis_cache.get_json(key)
    if cached:
        cached["cached"] = True
        cached["latency_ms"] = int((time.perf_counter() - started) * 1000)
        return cached

    qvec = embed.embed_query(question)
    hits = qdrant_store.search(qvec, top_k, owner_id=owner_id)

    contexts = [h["payload"]["text"] for h in hits]
    sources = [
        {
            "document_id": h["payload"].get("document_id"),
            "chunk_id": h["payload"].get("chunk_id"),
            "qdrant_point_id": h["id"],
            "source": h["payload"].get("source"),
            "title": h["payload"].get("title"),
            "score": round(h["score"], 4),
            "preview": h["payload"]["text"][:200],
            "rank": i,
        }
        for i, h in enumerate(hits)
    ]

    answer_text = llm.generate(question, contexts, history=history)
    result = {
        "answer": answer_text,
        "sources": sources,
        "model": settings.llm_model if settings.llm_provider != "none" else "retrieval-only",
        "cached": False,
        "retrieved": len(hits),
    }
    redis_cache.set_json(key, result)
    result["latency_ms"] = int((time.perf_counter() - started) * 1000)
    return result
