"""Dependency lấy người dùng hiện tại từ Bearer token + kiểm tra phiên Redis."""
import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from src.auth import security
from src.db import postgres, redis_cache

_bearer = HTTPBearer(auto_error=False)


def get_current_user(creds: HTTPAuthorizationCredentials | None = Depends(_bearer)) -> dict:
    if creds is None:
        raise HTTPException(401, "Cần đăng nhập (thiếu token).")
    try:
        payload = security.decode_token(creds.credentials)
    except jwt.PyJWTError:
        raise HTTPException(401, "Token không hợp lệ hoặc đã hết hạn.")

    jti = payload.get("jti")
    if not jti or not redis_cache.session_active(jti):
        raise HTTPException(401, "Phiên đã đăng xuất hoặc hết hạn.")

    user = postgres.get_user_by_id(payload.get("sub"))
    if user is None:
        raise HTTPException(401, "Người dùng không tồn tại.")

    user["jti"] = jti
    return user
