# Thiết kế database — RAG Chatbot

Sơ đồ Mermaid (preview bằng VS Code hoặc GitHub).

## 1. PostgreSQL — nguồn sự thật (quan hệ)

```mermaid
erDiagram
    users ||--o{ conversations : "có"
    users ||--o{ documents : "sở hữu"
    users ||--o{ feedback : "gửi"
    conversations ||--o{ messages : "gồm"
    messages ||--o{ message_citations : "có"
    messages ||--o{ feedback : "nhận"
    documents ||--o{ chunks : "cắt thành"

    users {
        text id PK
        text email UK
        text password_hash
        text display_name
        text role
        timestamptz created_at
    }
    conversations {
        text id PK
        text user_id FK
        text title
        timestamptz created_at
        timestamptz updated_at
    }
    messages {
        text id PK
        text conversation_id FK
        text role
        text content
        text model
        int latency_ms
        int token_count
        timestamptz created_at
    }
    message_citations {
        text id PK
        text message_id FK
        text document_id
        text chunk_id
        text qdrant_point_id
        int rank
        real score
        text preview
    }
    feedback {
        text id PK
        text message_id FK
        text user_id FK
        text rating
        text reason
        text comment
        timestamptz created_at
    }
    documents {
        text id PK
        text source
        text title
        text owner_id FK
        timestamptz created_at
    }
    chunks {
        text id PK
        text document_id FK
        int ordinal
        int token_count
        text qdrant_point_id
        int char_start
        int char_end
    }
```

**Ghi chú thiết kế**
- `feedback`: UNIQUE(message_id, user_id) — mỗi người chỉ 1 đánh giá cho mỗi câu trả lời.
- `documents.owner_id`: cho phép NULL = tài liệu dùng chung (ON DELETE SET NULL).
- Mọi FK đều ON DELETE CASCADE (xoá user → xoá hội thoại → xoá tin nhắn → xoá citations/feedback).
- Liên kết mềm (không phải FK, dùng để JOIN/trỏ chéo): `message_citations.document_id → documents.id`, `message_citations.chunk_id → chunks.id`.
- `chunks.qdrant_point_id`, `message_citations.qdrant_point_id` trỏ sang point bên Qdrant.

## 2. Qdrant — vector store

```mermaid
flowchart TB
    subgraph KB["Collection kb_chunks (size 384, distance Cosine)"]
        P["1 point = 1 chunk"]
        P --> VEC["vector: 384 chiều"]
        P --> PAY["payload (JSON)"]
        PAY --> A["document_id — payload index, lọc theo tài liệu"]
        PAY --> B["owner_id — payload index, lọc theo user ('*' = dùng chung)"]
        PAY --> C["lang — payload index, lọc theo ngôn ngữ"]
        PAY --> D["created_at — epoch, lọc theo thời gian"]
        PAY --> E["chunk_id, ordinal, source, title"]
        PAY --> F["text — nội dung đoạn đưa vào ngữ cảnh"]
    end
```

**Ghi chú thiết kế**
- Số chiều vector (384) gắn với model embedding `paraphrase-multilingual-MiniLM-L12-v2`; đổi model là phải tạo lại collection + nạp lại.
- Payload mang các trường **lọc được** (có payload index): `document_id`, `owner_id`, `lang` → search giới hạn được phạm vi. Đây là điểm khác biệt: vector DB không chỉ lưu text.
- `text` nằm trong payload để ghép thẳng vào ngữ cảnh, khỏi quay lại Postgres.

## 3. Cầu nối Postgres ↔ Qdrant

```mermaid
flowchart LR
    subgraph PG["PostgreSQL"]
        CH["chunks.qdrant_point_id"]
        CIT["message_citations.qdrant_point_id"]
    end
    PT["Qdrant point.id"]
    CH -. "trỏ tới" .-> PT
    CIT -. "trỏ tới" .-> PT
```

Postgres giữ metadata + quan hệ; Qdrant giữ vector + đoạn text. `qdrant_point_id` là khóa nối hai bên: từ một citation/chunk trong Postgres tìm đúng point trong Qdrant và ngược lại.
