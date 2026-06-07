"""Human feedback (👍/👎) cho câu trả lời của trợ lý.

Lưu vào Postgres vì đây là dữ liệu cần tổng hợp/phân tích lâu dài (eval, RLHF),
không phải dữ liệu tạm. Một người chỉ có 1 đánh giá cho mỗi câu trả lời (upsert).
"""
import uuid
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from src.auth.deps import get_current_user
from src.db import postgres

router = APIRouter(prefix="/api/messages", tags=["feedback"])


class FeedbackIn(BaseModel):
    rating: Literal["up", "down"]
    reason: str | None = None
    comment: str | None = None


@router.post("/{message_id}/feedback")
def submit_feedback(message_id: str, body: FeedbackIn, user: dict = Depends(get_current_user)):
    owner = postgres.get_message_owner(message_id)
    if owner is None:
        raise HTTPException(404, "Không tìm thấy tin nhắn.")
    if owner != user["id"]:
        raise HTTPException(403, "Bạn không có quyền đánh giá tin nhắn này.")
    postgres.upsert_feedback(
        str(uuid.uuid4()), message_id, user["id"], body.rating, body.reason, body.comment
    )
    return {"ok": True, "rating": body.rating}
