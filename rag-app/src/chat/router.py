"""Hội thoại + lượt chatbot. Đây là nơi thấy rõ 4 database phối hợp trong 1 request:

  Redis (rate-limit) → Postgres (lưu lượt user + lấy lịch sử) → Redis (cache)
  → Qdrant (truy hồi) → LLM → Postgres (lưu lượt assistant + citations).
"""
import uuid

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from src.auth.deps import get_current_user
from src.config import settings
from src.db import postgres, redis_cache
from src.rag import pipeline

router = APIRouter(prefix="/api/conversations", tags=["chat"])

_DEFAULT_TITLE = "Cuộc trò chuyện mới"


class CreateConversationIn(BaseModel):
    title: str | None = None


class RenameIn(BaseModel):
    title: str = Field(min_length=1, max_length=200)


class MessageIn(BaseModel):
    content: str = Field(min_length=1, max_length=4000)
    top_k: int | None = Field(default=None, ge=1, le=10)


def _ensure_owner(conv_id: str, user: dict) -> dict:
    conv = postgres.get_conversation(conv_id)
    if conv is None:
        raise HTTPException(404, "Không tìm thấy hội thoại.")
    if conv["user_id"] != user["id"]:
        raise HTTPException(403, "Bạn không có quyền với hội thoại này.")
    return conv


@router.get("")
def list_conversations(user: dict = Depends(get_current_user)):
    return postgres.list_conversations(user["id"])


@router.post("")
def create_conversation(body: CreateConversationIn, user: dict = Depends(get_current_user)):
    conv_id = str(uuid.uuid4())
    title = (body.title or _DEFAULT_TITLE).strip()[:200] or _DEFAULT_TITLE
    postgres.create_conversation(conv_id, user["id"], title)
    return {"id": conv_id, "title": title}


@router.get("/{conv_id}")
def get_conversation(conv_id: str, user: dict = Depends(get_current_user)):
    _ensure_owner(conv_id, user)
    ratings = postgres.feedback_for_conversation(conv_id, user["id"])
    messages = []
    for m in postgres.list_messages(conv_id):
        item = dict(m)
        if m["role"] == "assistant":
            item["citations"] = postgres.list_citations(m["id"])
            item["feedback"] = ratings.get(m["id"])
        messages.append(item)
    return {"id": conv_id, "messages": messages}


@router.patch("/{conv_id}")
def rename_conversation(conv_id: str, body: RenameIn, user: dict = Depends(get_current_user)):
    _ensure_owner(conv_id, user)
    postgres.rename_conversation(conv_id, body.title.strip()[:200])
    return {"ok": True}


@router.delete("/{conv_id}")
def delete_conversation(conv_id: str, user: dict = Depends(get_current_user)):
    _ensure_owner(conv_id, user)
    postgres.delete_conversation(conv_id)
    return {"ok": True}


@router.post("/{conv_id}/messages")
def send_message(conv_id: str, body: MessageIn, user: dict = Depends(get_current_user)):
    conv = _ensure_owner(conv_id, user)

    # 1) Rate limit (Redis) — chặn lạm dụng / bảo vệ ngân sách LLM.
    allowed, remaining, reset = redis_cache.rate_limit_hit(user["id"])
    if not allowed:
        raise HTTPException(429, f"Bạn gửi quá nhanh. Thử lại sau {reset}s.")

    content = body.content.strip()

    # 2) Lấy lịch sử TRƯỚC khi thêm câu hỏi hiện tại (Postgres).
    history = postgres.recent_messages(conv_id, settings.history_turns)

    # 3) Lưu lượt người dùng (Postgres).
    user_msg_id = str(uuid.uuid4())
    postgres.insert_message(user_msg_id, conv_id, "user", content)

    # 4) RAG: cache(Redis) → Qdrant(lọc theo owner) → LLM.
    result = pipeline.answer(content, history=history, top_k=body.top_k, owner_id=user["id"])

    # 5) Lưu lượt trợ lý + citations (Postgres).
    asst_id = str(uuid.uuid4())
    postgres.insert_message(
        asst_id, conv_id, "assistant", result["answer"],
        model=result.get("model"), latency_ms=result.get("latency_ms"),
    )
    postgres.insert_citations([
        (str(uuid.uuid4()), asst_id, s["document_id"], s["chunk_id"],
         s["qdrant_point_id"], s["rank"], s["score"], s["preview"])
        for s in result["sources"]
    ])

    # Tự đặt tiêu đề hội thoại theo câu hỏi đầu tiên.
    if conv["title"] == _DEFAULT_TITLE:
        postgres.rename_conversation(conv_id, content[:50])
    else:
        postgres.touch_conversation(conv_id)

    return {
        "user_message": {"id": user_msg_id, "role": "user", "content": content},
        "message": {
            "id": asst_id,
            "role": "assistant",
            "content": result["answer"],
            "model": result.get("model"),
            "citations": result["sources"],
            "feedback": None,
        },
        "debug": {
            "cached": result["cached"],
            "retrieved": result.get("retrieved", len(result["sources"])),
            "latency_ms": result.get("latency_ms"),
            "rate_remaining": remaining,
        },
    }
