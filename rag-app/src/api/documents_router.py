"""Quản trị tri thức (knowledge base): nạp / liệt kê / xoá tài liệu.

Mặc định nạp vào KHO DÙNG CHUNG (shared=True → owner_id NULL) để cả lớp cùng hỏi.
Đặt shared=False để nạp tài liệu riêng của người dùng (minh hoạ đa người dùng).
"""
import io

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from pydantic import BaseModel
from pypdf import PdfReader

from src.auth.deps import get_current_user
from src.db import postgres
from src.rag import pipeline
from src.vector import qdrant_store

router = APIRouter(prefix="/api/documents", tags=["documents"])


class IngestText(BaseModel):
    text: str
    title: str | None = None
    source: str | None = None
    shared: bool = True


@router.post("")
def ingest_text(body: IngestText, user: dict = Depends(get_current_user)):
    owner = None if body.shared else user["id"]
    try:
        return pipeline.ingest(
            body.text,
            source=body.source or body.title or "text",
            title=body.title,
            owner_id=owner,
        )
    except ValueError as e:
        raise HTTPException(400, str(e))


@router.post("/file")
async def ingest_file(
    file: UploadFile = File(...),
    shared: bool = True,
    user: dict = Depends(get_current_user),
):
    data = await file.read()
    name = file.filename or "upload"
    if name.lower().endswith(".pdf"):
        reader = PdfReader(io.BytesIO(data))
        text = "\n".join(page.extract_text() or "" for page in reader.pages)
    else:
        text = data.decode("utf-8", errors="ignore")
    if not text.strip():
        raise HTTPException(400, "Không trích xuất được nội dung từ file.")
    owner = None if shared else user["id"]
    return pipeline.ingest(text, source=name, title=name, owner_id=owner)


@router.get("")
def list_documents(user: dict = Depends(get_current_user)):
    return postgres.list_documents(owner_id=user["id"])


@router.delete("/{document_id}")
def delete_document(document_id: str, user: dict = Depends(get_current_user)):
    doc = postgres.get_document(document_id)
    if doc is None:
        raise HTTPException(404, "Không tìm thấy tài liệu.")
    # Xoá được nếu: là chủ sở hữu, hoặc tài liệu dùng chung, hoặc admin.
    if doc["owner_id"] not in (None, user["id"]) and user.get("role") != "admin":
        raise HTTPException(403, "Bạn không có quyền xoá tài liệu này.")
    postgres.delete_document(document_id)              # Postgres (metadata)
    qdrant_store.delete_by_document(document_id)        # Qdrant (vector)
    return {"deleted": document_id}
