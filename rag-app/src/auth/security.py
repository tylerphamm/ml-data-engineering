"""Mật khẩu (bcrypt) và token đăng nhập (JWT).

Mật khẩu KHÔNG bao giờ lưu thô — chỉ lưu hash bcrypt trong Postgres.
JWT mang `sub` (user_id) + `jti` (id phiên). `jti` được lưu trong Redis để
có thể đăng xuất thật: xoá session là token coi như vô hiệu dù chưa hết hạn.
"""
import uuid
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt

from src.config import settings

# bcrypt giới hạn 72 byte → cắt cho an toàn (tiếng Việt nhiều byte hơn 1/ký tự).
_MAX_BCRYPT_BYTES = 72


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8")[:_MAX_BCRYPT_BYTES], bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode("utf-8")[:_MAX_BCRYPT_BYTES], password_hash.encode("utf-8"))
    except (ValueError, TypeError):
        return False


def create_access_token(user_id: str):
    """Trả (token, jti, ttl_sec). jti dùng để theo dõi phiên trong Redis."""
    jti = str(uuid.uuid4())
    ttl_sec = settings.access_token_ttl_min * 60
    now = datetime.now(timezone.utc)
    payload = {
        "sub": user_id,
        "jti": jti,
        "iat": now,
        "exp": now + timedelta(seconds=ttl_sec),
    }
    token = jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)
    return token, jti, ttl_sec


def decode_token(token: str) -> dict:
    """Giải mã + kiểm tra chữ ký và hạn dùng. Ném jwt.PyJWTError nếu sai/hết hạn."""
    return jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
