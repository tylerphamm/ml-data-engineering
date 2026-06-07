"""Test chạy offline (không cần Docker hay khóa API) — kiểm tra phần thuần logic."""
from src.auth import security
from src.db import redis_cache
from src.rag.chunk import chunk_text, chunk_text_with_spans, count_tokens


# === Cắt đoạn =================================================================
def test_chunk_splits_long_text():
    text = "Câu mẫu về cơ sở dữ liệu. " * 300
    chunks = chunk_text(text, max_tokens=50, overlap=10)
    assert len(chunks) > 1
    assert all(c.strip() for c in chunks)


def test_chunk_overlap_keeps_context():
    text = " ".join(f"tu{i}" for i in range(200))
    chunks = chunk_text(text, max_tokens=40, overlap=10)
    assert sum(count_tokens(c) for c in chunks) >= count_tokens(text)


def test_chunk_empty_returns_empty():
    assert chunk_text("") == []
    assert chunk_text("   ") == []


def test_chunk_spans_have_increasing_positions():
    text = " ".join(f"tu{i}" for i in range(200))
    spans = chunk_text_with_spans(text, max_tokens=40, overlap=10)
    assert len(spans) > 1
    for piece, start, end in spans:
        assert piece.strip()
        assert 0 <= start <= end
    # char_start tăng dần giữa các đoạn liên tiếp
    starts = [s for _p, s, _e in spans]
    assert starts == sorted(starts)


# === Mật khẩu (bcrypt) =======================================================
def test_password_hash_roundtrip():
    h = security.hash_password("matkhau-tiếng-việt")
    assert h != "matkhau-tiếng-việt"  # không lưu thô
    assert security.verify_password("matkhau-tiếng-việt", h)
    assert not security.verify_password("sai-mat-khau", h)


# === JWT =====================================================================
def test_jwt_roundtrip_carries_sub_and_jti():
    token, jti, ttl = security.create_access_token("user-123")
    assert ttl > 0
    payload = security.decode_token(token)
    assert payload["sub"] == "user-123"
    assert payload["jti"] == jti


# === Khóa cache Redis (hàm thuần, không cần kết nối) =========================
def test_cache_key_is_deterministic_and_scoped():
    a = redis_cache.cache_key("ans", "user1", "Qdrant là gì?", 5)
    b = redis_cache.cache_key("ans", "user1", "Qdrant là gì?", 5)
    c = redis_cache.cache_key("ans", "user2", "Qdrant là gì?", 5)
    assert a == b           # cùng input → cùng key (cache hit được)
    assert a != c           # khác phạm vi (owner) → khác key
    assert a.startswith("ans:")
