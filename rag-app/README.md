# RAG Chatbot — PostgreSQL + Redis + Qdrant

Một hệ thống **RAG Chatbot** tối giản, minh bạch (không LangChain/LlamaIndex) — dùng để **dạy cách thiết kế dữ liệu đúng cho AI**: mỗi database một việc, **không phải cái gì cũng nhét chunk**.

Có đăng nhập, lịch sử hội thoại, trích dẫn nguồn và human feedback (👍/👎).

> **Mặc định chạy LOCAL MIỄN PHÍ:** embedding đa ngôn ngữ qua `fastembed` (hỗ trợ tiếng Việt, không cần khóa API), **LLM tắt** — câu trả lời là các đoạn tài liệu liên quan nhất kèm trích dẫn. Bật sinh câu trả lời bằng Ollama/OpenAI rất dễ (xem cuối file).

## Mỗi database một việc (trọng tâm thiết kế)

| Dữ liệu | Lưu ở | Vì sao | Ghi chú |
|---|---|---|---|
| Tài khoản, mật khẩu (hash) | **PostgreSQL** | cần quan hệ + toàn vẹn (ACID) | `users` |
| Hội thoại, tin nhắn | **PostgreSQL** | lịch sử, truy vết, phân tích | `conversations`, `messages` |
| Trích dẫn (câu trả lời ↔ chunk) | **PostgreSQL** | JOIN về tài liệu để hiện nguồn | `message_citations` |
| Feedback 👍/👎 | **PostgreSQL** | dữ liệu eval/RLHF, cần tổng hợp | `feedback` |
| Metadata tài liệu/chunk | **PostgreSQL** | liệt kê/xoá/đếm, vị trí ký tự | `documents`, `chunks` |
| Embedding + text chunk | **Qdrant** | tìm theo ngữ nghĩa, **lọc payload** | collection `kb_chunks` |
| Cache câu trả lời | **Redis** | trả ngay, đỡ tốn LLM | key `ans:*`, có TTL |
| Cache embedding | **Redis** | khỏi tính lại vector | key `emb:*`, TTL dài |
| Phiên đăng nhập (token) | **Redis** | tra nhanh, **tự hết hạn**, logout thật | key `session:*` |
| Rate limit | **Redis** | đếm nguyên tử `INCR` | key `rl:*` |

Nguyên tắc: **Postgres = nguồn sự thật** (mất là mất tài khoản & lịch sử); **Qdrant = truy hồi ngữ nghĩa**; **Redis = tốc độ & điều phối** (mất Redis app vẫn đúng, chỉ chậm hơn).

## Một câu hỏi đi qua đâu

```
Người dùng hỏi
  → Redis  : kiểm tra phiên (session) + rate limit
  → Postgres: lưu lượt user, lấy N lượt gần nhất làm ngữ cảnh
  → Redis  : có cache câu trả lời? (HIT → trả ngay)
  → Qdrant : embedding câu hỏi → search top-k (lọc theo owner)
  → LLM    : sinh trả lời (hoặc trả thẳng đoạn khi LLM tắt)
  → Postgres: lưu lượt trợ lý + citations
  → Redis  : lưu cache câu trả lời
Sau đó: 👍/👎 → Postgres (feedback)
```

## Chạy

### 1. Bật hạ tầng (3 database + UI xem chúng)
```powershell
cd D:\Code\ml-data-engineering\rag-app
docker compose up -d
```

### 2. Cài thư viện & chạy server (mặc định local, KHÔNG cần khóa)
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn src.main:app --reload --port 8000
```
**Giao diện chat: http://localhost:8000** — đăng ký → đăng nhập → hỏi đáp. Tài liệu API: http://localhost:8000/docs.

### 3. Nạp dữ liệu mẫu & thử cả luồng (auth → ingest → chat → feedback)
```powershell
python scripts/seed_sample.py
```

> Đổi model embedding ⇒ phải **ingest lại** (vector cũ không so khớp được). Nếu trước đây dùng collection `documents`, hãy nạp lại vào `kb_chunks`.

## Xem 3 database bằng giao diện
| Database | Vai trò | UI |
|---|---|---|
| **PostgreSQL** | users/conversations/messages/feedback/documents | **pgweb** → http://localhost:8085 |
| **Qdrant** | vector của từng chunk + payload lọc được | **Dashboard** → http://localhost:6333/dashboard |
| **Redis** | session, cache, rate-limit | **RedisInsight** → http://localhost:5540 (host `redis`, port 6379) |

## API chính
| Nhóm | Endpoint |
|---|---|
| Auth | `POST /api/auth/register` · `/login` · `/logout` · `GET /api/auth/me` |
| Hội thoại | `GET/POST /api/conversations` · `GET/PATCH/DELETE /api/conversations/{id}` |
| Chat | `POST /api/conversations/{id}/messages` |
| Feedback | `POST /api/messages/{id}/feedback` |
| Tri thức | `POST /api/documents` · `POST /api/documents/file` · `GET /api/documents` · `DELETE /api/documents/{id}` |
| Health | `GET /api/health` |

## Test (offline, không cần Docker/khóa)
```powershell
pip install -r requirements.txt
pytest -q
```

## Bật sinh câu trả lời (tuỳ chọn)
Sửa `.env`:
- **Ollama (local, miễn phí):** cài Ollama, `ollama pull llama3.1`, đặt `LLM_PROVIDER=ollama`, `LLM_MODEL=llama3.1`. Embedding giữ nguyên fastembed → **không phải ingest lại**.
- **OpenAI:** đặt `OPENAI_API_KEY`, `LLM_PROVIDER=openai`, `LLM_MODEL=gpt-4o-mini`.

## Bảo mật
- `.env` đã được `.gitignore`. **Đổi `JWT_SECRET`** (≥32 ký tự) trong môi trường thật.
- Nếu khóa OpenAI từng bị lộ, hãy **thu hồi/đổi khóa** trên dashboard OpenAI.
