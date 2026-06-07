"""Redis trong RAG Chatbot — KHÔNG phải nguồn sự thật, mà là tầng tốc độ & điều phối.

Bốn vai trò minh hoạ trong file này (mỗi vai trò một tiền tố key + TTL riêng):
  • session:<jti>        → phiên đăng nhập, tự hết hạn theo vòng đời token (logout = xoá key)
  • rl:<user>:<bucket>   → đếm rate-limit bằng INCR (thao tác nguyên tử), EXPIRE theo cửa sổ
  • ans:<hash>           → cache câu trả lời RAG để trả ngay, đỡ tốn LLM/embedding
  • emb:<hash>           → cache vector embedding của một đoạn text để khỏi tính lại
Không có cái nào ở đây là dữ liệu gốc: mất Redis thì app vẫn đúng, chỉ chậm hơn.
"""
import hashlib
import json
import time

import redis

from src.config import settings

_client = redis.from_url(settings.redis_url, decode_responses=True)


def cache_key(prefix: str, *parts) -> str:
    raw = "|".join(str(p) for p in parts)
    return f"{prefix}:" + hashlib.sha256(raw.encode("utf-8")).hexdigest()


# --- Cache câu trả lời RAG (TTL ngắn) ---------------------------------------
def get_json(key: str):
    val = _client.get(key)
    return json.loads(val) if val else None


def set_json(key: str, value, ttl: int | None = None):
    _client.set(key, json.dumps(value, ensure_ascii=False), ex=ttl or settings.cache_ttl)


# --- Cache embedding (TTL dài) ----------------------------------------------
def get_embedding(text: str, model: str):
    raw = _client.get(cache_key("emb", model, text))
    return json.loads(raw) if raw else None


def set_embedding(text: str, model: str, vector):
    _client.set(
        cache_key("emb", model, text),
        json.dumps(vector),
        ex=settings.embed_cache_ttl,
    )


# --- Phiên đăng nhập (logout thật = xoá session, token coi như vô hiệu) ------
def add_session(jti: str, user_id: str, ttl_sec: int):
    _client.set(f"session:{jti}", user_id, ex=ttl_sec)


def session_active(jti: str) -> bool:
    return _client.exists(f"session:{jti}") == 1


def revoke_session(jti: str):
    _client.delete(f"session:{jti}")


# --- Rate limit theo user (fixed window bằng INCR + EXPIRE) ------------------
def rate_limit_hit(user_id: str):
    """Trả (allowed, remaining, reset_sec). INCR là nguyên tử nên đếm chính xác kể cả nhiều request song song."""
    window = settings.rate_limit_window_sec
    now = int(time.time())
    bucket = now // window
    key = f"rl:{user_id}:{bucket}"
    count = _client.incr(key)
    if count == 1:
        _client.expire(key, window)
    allowed = count <= settings.rate_limit_max
    remaining = max(0, settings.rate_limit_max - count)
    reset_sec = window - (now % window)
    return allowed, remaining, reset_sec


def ping():
    return _client.ping()
