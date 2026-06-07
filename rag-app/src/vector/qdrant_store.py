"""Qdrant = vector store cho truy hồi NGỮ NGHĨA — KHÔNG phải nguồn sự thật.

Mỗi point = 1 chunk: vector + payload. Payload KHÔNG chỉ chứa text:
nó còn mang các trường LỌC ĐƯỢC (document_id, owner_id, lang, created_at) để
search có thể giới hạn phạm vi (theo người dùng, theo tài liệu, theo ngôn ngữ,
theo thời gian). Đây là điểm khác biệt: "không phải cái gì cũng nhét chunk".
owner_id = "*" nghĩa là tài liệu dùng chung cho mọi người.
"""
from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    FieldCondition,
    Filter,
    MatchAny,
    MatchValue,
    PointStruct,
    VectorParams,
)

from src.config import settings

SHARED = "*"  # giá trị owner_id cho tài liệu dùng chung

_client = QdrantClient(url=settings.qdrant_url)


def ensure_collection():
    names = [c.name for c in _client.get_collections().collections]
    if settings.qdrant_collection not in names:
        _client.create_collection(
            collection_name=settings.qdrant_collection,
            vectors_config=VectorParams(size=settings.embed_dim, distance=Distance.COSINE),
        )
    # Đánh index payload cho các trường dùng để LỌC → search có điều kiện mới nhanh.
    for field in ("owner_id", "document_id", "lang"):
        try:
            _client.create_payload_index(
                collection_name=settings.qdrant_collection,
                field_name=field,
                field_schema="keyword",
            )
        except Exception:  # noqa: BLE001 - index đã tồn tại thì bỏ qua
            pass


def upsert_chunks(items):
    """items: list[{point_id, vector, payload}]"""
    points = [
        PointStruct(id=it["point_id"], vector=it["vector"], payload=it["payload"])
        for it in items
    ]
    _client.upsert(collection_name=settings.qdrant_collection, points=points)


def owner_filter(owner_id: str | None) -> Filter | None:
    """Lọc phạm vi: tài liệu của chính user HOẶC tài liệu dùng chung ('*')."""
    if owner_id is None:
        return None
    return Filter(
        must=[FieldCondition(key="owner_id", match=MatchAny(any=[owner_id, SHARED]))]
    )


def search(vector, top_k: int, owner_id: str | None = None):
    """Tìm top-k đoạn gần nghĩa nhất, có thể giới hạn theo owner (đa người dùng)."""
    res = _client.query_points(
        collection_name=settings.qdrant_collection,
        query=vector,
        limit=top_k,
        with_payload=True,
        query_filter=owner_filter(owner_id),
    )
    return [{"id": h.id, "score": h.score, "payload": h.payload} for h in res.points]


def delete_by_document(document_id: str):
    _client.delete(
        collection_name=settings.qdrant_collection,
        points_selector=Filter(
            must=[FieldCondition(key="document_id", match=MatchValue(value=document_id))]
        ),
    )


def ping():
    _client.get_collections()
    return True
