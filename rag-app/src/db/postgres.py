"""Postgres trong RAG Chatbot = NGUỒN SỰ THẬT (quan hệ, giao dịch).

Đây là nơi lưu mọi thứ cần JOIN, cần toàn vẹn, cần tổng hợp/phân tích:
  users → conversations → messages → message_citations
                                   └→ feedback (👍/👎 của con người, dùng để eval)
  documents → chunks (CHỈ metadata: text & vector nằm ở Qdrant)
Mất Redis hay Qdrant thì dựng lại được; mất Postgres là mất tài khoản & lịch sử.
"""
from psycopg.rows import dict_row
from psycopg_pool import ConnectionPool

from src.config import settings

pool = ConnectionPool(
    conninfo=settings.postgres_url,
    min_size=1,
    max_size=5,
    open=False,
    kwargs={"row_factory": dict_row},
)
_opened = False

_STATEMENTS = [
    """
    CREATE TABLE IF NOT EXISTS users (
        id            TEXT PRIMARY KEY,
        email         TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        display_name  TEXT,
        role          TEXT NOT NULL DEFAULT 'user',
        created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS conversations (
        id         TEXT PRIMARY KEY,
        user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title      TEXT NOT NULL DEFAULT 'Cuộc trò chuyện mới',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS messages (
        id              TEXT PRIMARY KEY,
        conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        role            TEXT NOT NULL,
        content         TEXT NOT NULL,
        model           TEXT,
        latency_ms      INT,
        token_count     INT,
        created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS message_citations (
        id              TEXT PRIMARY KEY,
        message_id      TEXT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
        document_id     TEXT,
        chunk_id        TEXT,
        qdrant_point_id TEXT,
        rank            INT,
        score           REAL,
        preview         TEXT
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS feedback (
        id         TEXT PRIMARY KEY,
        message_id TEXT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
        user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        rating     TEXT NOT NULL CHECK (rating IN ('up', 'down')),
        reason     TEXT,
        comment    TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        UNIQUE (message_id, user_id)
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS documents (
        id         TEXT PRIMARY KEY,
        source     TEXT,
        title      TEXT,
        owner_id   TEXT REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS chunks (
        id              TEXT PRIMARY KEY,
        document_id     TEXT REFERENCES documents(id) ON DELETE CASCADE,
        ordinal         INT,
        token_count     INT,
        qdrant_point_id TEXT,
        char_start      INT,
        char_end        INT
    )
    """,
    # Migration nhẹ: bổ sung cột cho bảng documents/chunks đã tạo từ phiên bản cũ.
    "ALTER TABLE documents ADD COLUMN IF NOT EXISTS owner_id TEXT REFERENCES users(id) ON DELETE SET NULL",
    "ALTER TABLE chunks ADD COLUMN IF NOT EXISTS char_start INT",
    "ALTER TABLE chunks ADD COLUMN IF NOT EXISTS char_end INT",
    # Index: tra cứu theo khóa ngoại là mẫu truy cập chính → đánh index cho nhanh.
    "CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id, updated_at DESC)",
    "CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at)",
    "CREATE INDEX IF NOT EXISTS idx_citations_message ON message_citations(message_id)",
    "CREATE INDEX IF NOT EXISTS idx_feedback_message ON feedback(message_id)",
    "CREATE INDEX IF NOT EXISTS idx_chunks_document ON chunks(document_id)",
]


def connect():
    global _opened
    if not _opened:
        pool.open()
        _opened = True


def init_schema():
    connect()
    with pool.connection() as conn:
        for stmt in _STATEMENTS:
            conn.execute(stmt)


# === USERS ==================================================================
def create_user(user_id: str, email: str, password_hash: str, display_name: str):
    connect()
    with pool.connection() as conn:
        conn.execute(
            "INSERT INTO users (id, email, password_hash, display_name) VALUES (%s, %s, %s, %s)",
            (user_id, email, password_hash, display_name),
        )


def get_user_by_email(email: str):
    connect()
    with pool.connection() as conn:
        return conn.execute("SELECT * FROM users WHERE email = %s", (email,)).fetchone()


def get_user_by_id(user_id: str):
    connect()
    with pool.connection() as conn:
        return conn.execute(
            "SELECT id, email, display_name, role, created_at FROM users WHERE id = %s",
            (user_id,),
        ).fetchone()


def email_exists(email: str) -> bool:
    connect()
    with pool.connection() as conn:
        return conn.execute("SELECT 1 FROM users WHERE email = %s", (email,)).fetchone() is not None


# === CONVERSATIONS =========================================================
def create_conversation(conv_id: str, user_id: str, title: str):
    connect()
    with pool.connection() as conn:
        conn.execute(
            "INSERT INTO conversations (id, user_id, title) VALUES (%s, %s, %s)",
            (conv_id, user_id, title),
        )


def list_conversations(user_id: str):
    connect()
    with pool.connection() as conn:
        return conn.execute(
            "SELECT c.id, c.title, c.created_at, c.updated_at, "
            "       (SELECT count(*) FROM messages m WHERE m.conversation_id = c.id) AS messages "
            "FROM conversations c WHERE c.user_id = %s ORDER BY c.updated_at DESC",
            (user_id,),
        ).fetchall()


def get_conversation(conv_id: str):
    connect()
    with pool.connection() as conn:
        return conn.execute("SELECT * FROM conversations WHERE id = %s", (conv_id,)).fetchone()


def rename_conversation(conv_id: str, title: str):
    connect()
    with pool.connection() as conn:
        conn.execute(
            "UPDATE conversations SET title = %s, updated_at = now() WHERE id = %s",
            (title, conv_id),
        )


def touch_conversation(conv_id: str):
    connect()
    with pool.connection() as conn:
        conn.execute("UPDATE conversations SET updated_at = now() WHERE id = %s", (conv_id,))


def delete_conversation(conv_id: str):
    connect()
    with pool.connection() as conn:
        conn.execute("DELETE FROM conversations WHERE id = %s", (conv_id,))


# === MESSAGES ==============================================================
def insert_message(message_id, conversation_id, role, content, model=None, latency_ms=None, token_count=None):
    connect()
    with pool.connection() as conn:
        conn.execute(
            "INSERT INTO messages (id, conversation_id, role, content, model, latency_ms, token_count) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s)",
            (message_id, conversation_id, role, content, model, latency_ms, token_count),
        )


def list_messages(conversation_id: str):
    connect()
    with pool.connection() as conn:
        return conn.execute(
            "SELECT id, role, content, model, latency_ms, token_count, created_at "
            "FROM messages WHERE conversation_id = %s ORDER BY created_at",
            (conversation_id,),
        ).fetchall()


def recent_messages(conversation_id: str, limit: int):
    """Lấy N lượt gần nhất (cũ→mới) để dựng ngữ cảnh hội thoại cho LLM."""
    connect()
    with pool.connection() as conn:
        rows = conn.execute(
            "SELECT role, content FROM messages WHERE conversation_id = %s "
            "ORDER BY created_at DESC LIMIT %s",
            (conversation_id, limit),
        ).fetchall()
    return list(reversed(rows))


def get_message_owner(message_id: str):
    """Trả user_id sở hữu message (qua conversation) để kiểm tra quyền feedback."""
    connect()
    with pool.connection() as conn:
        row = conn.execute(
            "SELECT c.user_id FROM messages m JOIN conversations c ON c.id = m.conversation_id "
            "WHERE m.id = %s",
            (message_id,),
        ).fetchone()
    return row["user_id"] if row else None


# === CITATIONS =============================================================
def insert_citations(rows):
    """rows: list[(id, message_id, document_id, chunk_id, qdrant_point_id, rank, score, preview)]"""
    if not rows:
        return
    connect()
    with pool.connection() as conn, conn.cursor() as cur:
        cur.executemany(
            "INSERT INTO message_citations "
            "(id, message_id, document_id, chunk_id, qdrant_point_id, rank, score, preview) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
            rows,
        )


def list_citations(message_id: str):
    """JOIN sang documents để lấy luôn tên nguồn — minh hoạ thế mạnh quan hệ của Postgres."""
    connect()
    with pool.connection() as conn:
        return conn.execute(
            "SELECT mc.document_id, mc.chunk_id, mc.qdrant_point_id, mc.rank, mc.score, "
            "       mc.preview, d.source, d.title "
            "FROM message_citations mc "
            "LEFT JOIN documents d ON d.id = mc.document_id "
            "WHERE mc.message_id = %s ORDER BY mc.rank",
            (message_id,),
        ).fetchall()


# === FEEDBACK ==============================================================
def upsert_feedback(feedback_id, message_id, user_id, rating, reason=None, comment=None):
    connect()
    with pool.connection() as conn:
        conn.execute(
            "INSERT INTO feedback (id, message_id, user_id, rating, reason, comment) "
            "VALUES (%s, %s, %s, %s, %s, %s) "
            "ON CONFLICT (message_id, user_id) DO UPDATE "
            "SET rating = EXCLUDED.rating, reason = EXCLUDED.reason, "
            "    comment = EXCLUDED.comment, created_at = now()",
            (feedback_id, message_id, user_id, rating, reason, comment),
        )


def feedback_for_conversation(conversation_id: str, user_id: str):
    """Map message_id → rating của user, để UI tô đậm nút 👍/👎 đã chọn."""
    connect()
    with pool.connection() as conn:
        rows = conn.execute(
            "SELECT f.message_id, f.rating FROM feedback f "
            "JOIN messages m ON m.id = f.message_id "
            "WHERE m.conversation_id = %s AND f.user_id = %s",
            (conversation_id, user_id),
        ).fetchall()
    return {r["message_id"]: r["rating"] for r in rows}


# === DOCUMENTS / CHUNKS (chỉ metadata) =====================================
def insert_document(doc_id: str, source: str, title: str, owner_id: str | None = None):
    connect()
    with pool.connection() as conn:
        conn.execute(
            "INSERT INTO documents (id, source, title, owner_id) VALUES (%s, %s, %s, %s)",
            (doc_id, source, title, owner_id),
        )


def insert_chunks(rows):
    """rows: list[(id, document_id, ordinal, token_count, qdrant_point_id, char_start, char_end)]"""
    connect()
    with pool.connection() as conn, conn.cursor() as cur:
        cur.executemany(
            "INSERT INTO chunks (id, document_id, ordinal, token_count, qdrant_point_id, char_start, char_end) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s)",
            rows,
        )


def list_documents(owner_id: str | None = None):
    """Tài liệu user thấy được: của chính họ HOẶC kho dùng chung (owner_id IS NULL)."""
    connect()
    sql = (
        "SELECT d.id, d.source, d.title, d.owner_id, d.created_at, "
        "       (SELECT count(*) FROM chunks c WHERE c.document_id = d.id) AS chunks "
        "FROM documents d "
    )
    params = ()
    if owner_id is not None:
        sql += "WHERE d.owner_id = %s OR d.owner_id IS NULL "
        params = (owner_id,)
    sql += "ORDER BY d.created_at DESC"
    with pool.connection() as conn:
        return conn.execute(sql, params).fetchall()


def get_document(doc_id: str):
    connect()
    with pool.connection() as conn:
        return conn.execute("SELECT * FROM documents WHERE id = %s", (doc_id,)).fetchone()


def delete_document(document_id: str):
    connect()
    with pool.connection() as conn:
        conn.execute("DELETE FROM documents WHERE id = %s", (document_id,))


def ping():
    connect()
    with pool.connection() as conn:
        conn.execute("SELECT 1")
    return True
