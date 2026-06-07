"""Điểm vào FastAPI cho RAG Chatbot.

Khởi tạo schema Postgres + collection Qdrant khi bật, mount các router và phục vụ
giao diện chat tĩnh (không cần build).
"""
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from src.api.documents_router import router as documents_router
from src.api.feedback_router import router as feedback_router
from src.api.health import router as health_router
from src.auth.router import router as auth_router
from src.chat.router import router as chat_router
from src.db import postgres
from src.vector import qdrant_store

_STATIC = Path(__file__).resolve().parent.parent / "static"


@asynccontextmanager
async def lifespan(app: FastAPI):
    postgres.connect()
    postgres.init_schema()
    qdrant_store.ensure_collection()
    yield


app = FastAPI(title="RAG Chatbot", version="0.2.0", lifespan=lifespan)

# API trước, mount tĩnh sau (route /api/* được ưu tiên hơn static ở "/").
app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(documents_router)
app.include_router(feedback_router)
app.include_router(health_router)

# Giao diện chat: phục vụ index.html ở "/" và các asset (app.js, styles.css).
app.mount("/", StaticFiles(directory=_STATIC, html=True), name="ui")
