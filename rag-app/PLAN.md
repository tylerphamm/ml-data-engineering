# PLAN — RAG Chatbot (Postgres + Redis + Qdrant)

> Hệ thống RAG Chatbot làm **bản tham chiếu dạy thiết kế dữ liệu cho AI**: auth, lịch sử hội thoại, trích dẫn, human feedback. Hạ tầng đúng 3 database + UI xem chúng. Mặc định chạy local miễn phí (embedding đa ngôn ngữ, LLM tắt).

## 1. Mục tiêu
Chatbot hỏi đáp tài liệu: **đăng nhập → hội thoại có lịch sử → truy hồi ngữ nghĩa → trả lời kèm nguồn → feedback**. Quan trọng nhất: thể hiện rõ **mỗi database một việc**, không nhét mọi thứ thành chunk.

## 2. Phân vai dữ liệu (cốt lõi)
- **PostgreSQL — nguồn sự thật (quan hệ, ACID):** `users`, `conversations`, `messages`, `message_citations`, `feedback`, `documents`, `chunks` (chỉ metadata + vị trí ký tự). Mọi thứ cần JOIN / toàn vẹn / tổng hợp.
- **Qdrant — truy hồi ngữ nghĩa:** collection `kb_chunks`, mỗi point = 1 chunk (vector + payload). Payload mang **trường lọc được** `owner_id`, `document_id`, `lang`, `created_at` → search có phạm vi (đa người dùng / đa ngôn ngữ / theo thời gian). Có **payload index** cho các trường này.
- **Redis — tốc độ & điều phối (không phải nguồn sự thật):** `session:*` (phiên, logout thật), `rl:*` (rate limit bằng `INCR`+`EXPIRE`), `ans:*` (cache câu trả lời, TTL), `emb:*` (cache embedding, TTL dài).

## 3. Kiến trúc một request chat
`session+rate-limit (Redis)` → `lưu user msg + lấy lịch sử (Postgres)` → `cache? (Redis)` → `embed + search lọc (Qdrant)` → `LLM (none/ollama/openai)` → `lưu assistant msg + citations (Postgres)` → `cache (Redis)`. Feedback 👍/👎 → Postgres.

## 4. Tech stack
- Python 3.11 + FastAPI + Uvicorn, Pydantic.
- Auth: `bcrypt` (hash mật khẩu) + `PyJWT` (token có `jti`) + session trong Redis.
- `qdrant-client`, `redis`, `psycopg[binary]` + `psycopg-pool`.
- Embedding: `fastembed` đa ngôn ngữ (`paraphrase-multilingual-MiniLM-L12-v2`, 384 chiều); đổi sang OpenAI được.
- Cắt đoạn bằng `tiktoken`; `pypdf` đọc PDF. Không dùng framework RAG nặng (cho minh bạch).
- Frontend: HTML/CSS/JS thuần (không build), FastAPI phục vụ tĩnh.

## 5. Cấu trúc thư mục
```
rag-app/
├── docker-compose.yml        # postgres, redis, qdrant + pgweb, redisinsight
├── .env(.example)            # cấu hình AI + hạ tầng + JWT/rate-limit
├── src/
│   ├── config.py             # pydantic-settings
│   ├── main.py               # mount router + serve SPA
│   ├── auth/                 # security.py, deps.py, router.py
│   ├── db/                   # postgres.py (schema+CRUD), redis_cache.py
│   ├── vector/qdrant_store.py# payload + search có lọc
│   ├── rag/                  # chunk, embed (cache), llm (history-aware), pipeline
│   ├── chat/router.py        # hội thoại + lượt chatbot
│   └── api/                  # documents_router, feedback_router, health
├── static/                   # index.html, styles.css, app.js (giao diện chat)
├── scripts/seed_sample.py    # auth → ingest → chat → feedback
└── tests/test_smoke.py       # offline: chunk, bcrypt, jwt, cache_key
```

## 6. Schema Postgres (rút gọn)
```
users(id, email UNIQUE, password_hash, display_name, role, created_at)
conversations(id, user_id→users, title, created_at, updated_at)
messages(id, conversation_id→conversations, role, content, model, latency_ms, token_count, created_at)
message_citations(id, message_id→messages, document_id, chunk_id, qdrant_point_id, rank, score, preview)
feedback(id, message_id→messages, user_id→users, rating CHECK(up/down), reason, comment, created_at, UNIQUE(message_id,user_id))
documents(id, source, title, owner_id→users NULL, created_at)
chunks(id, document_id→documents, ordinal, token_count, qdrant_point_id, char_start, char_end)
```

## 7. Ngoài phạm vi (làm sau nếu cần)
Reranker, hybrid search (BM25), streaming token (SSE), hàng đợi ingest bất đồng bộ, dashboard phân tích feedback, đóng app vào container.
