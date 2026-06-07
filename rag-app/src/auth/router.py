"""Endpoint xác thực: đăng ký, đăng nhập, đăng xuất, xem hồ sơ."""
import uuid

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr, Field

from src.auth import security
from src.auth.deps import get_current_user
from src.db import postgres, redis_cache

router = APIRouter(prefix="/api/auth", tags=["auth"])


class RegisterIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=72)
    display_name: str | None = None


class LoginIn(BaseModel):
    email: EmailStr
    password: str


def _public_user(user: dict) -> dict:
    return {
        "id": user["id"],
        "email": user["email"],
        "display_name": user.get("display_name"),
        "role": user.get("role", "user"),
    }


def _issue_token(user_id: str) -> dict:
    token, jti, ttl = security.create_access_token(user_id)
    redis_cache.add_session(jti, user_id, ttl)
    return {"access_token": token, "token_type": "bearer", "expires_in": ttl}


@router.post("/register")
def register(body: RegisterIn):
    if postgres.email_exists(body.email):
        raise HTTPException(409, "Email đã được đăng ký.")
    user_id = str(uuid.uuid4())
    display = (body.display_name or body.email.split("@")[0]).strip()
    postgres.create_user(user_id, body.email, security.hash_password(body.password), display)
    user = postgres.get_user_by_id(user_id)
    return {**_issue_token(user_id), "user": _public_user(user)}


@router.post("/login")
def login(body: LoginIn):
    user = postgres.get_user_by_email(body.email)
    if user is None or not security.verify_password(body.password, user["password_hash"]):
        raise HTTPException(401, "Email hoặc mật khẩu không đúng.")
    return {**_issue_token(user["id"]), "user": _public_user(user)}


@router.post("/logout")
def logout(user: dict = Depends(get_current_user)):
    redis_cache.revoke_session(user["jti"])  # xoá phiên trong Redis → token vô hiệu
    return {"ok": True}


@router.get("/me")
def me(user: dict = Depends(get_current_user)):
    return {"user": _public_user(user)}
