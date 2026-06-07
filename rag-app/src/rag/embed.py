"""Embedding (đa ngôn ngữ, chạy local qua fastembed; đổi sang OpenAI được).

Câu hỏi đi vào nhiều lần thường giống nhau → cache vector trong Redis (emb:*)
để khỏi tính lại. Ingest thì gọi theo lô cho nhanh.
"""
from src.config import settings
from src.db import redis_cache

_BATCH = 100
_openai = None
_fastembed = None


def _get_openai():
    global _openai
    if _openai is None:
        from openai import OpenAI

        _openai = OpenAI(api_key=settings.openai_api_key)
    return _openai


def _get_fastembed():
    global _fastembed
    if _fastembed is None:
        from fastembed import TextEmbedding

        _fastembed = TextEmbedding(model_name=settings.embed_model)
    return _fastembed


def embed_texts(texts):
    """Embedding theo lô (dùng khi ingest tài liệu)."""
    texts = list(texts)
    if settings.embed_provider == "fastembed":
        return [vec.tolist() for vec in _get_fastembed().embed(texts)]

    # OpenAI
    client = _get_openai()
    out = []
    for i in range(0, len(texts), _BATCH):
        batch = texts[i : i + _BATCH]
        resp = client.embeddings.create(model=settings.embed_model, input=batch)
        out.extend(item.embedding for item in resp.data)
    return out


def embed_query(text: str):
    """Embedding 1 câu hỏi, có cache Redis (hot path khi hỏi lặp lại)."""
    cached = redis_cache.get_embedding(text, settings.embed_model)
    if cached is not None:
        return cached
    vector = embed_texts([text])[0]
    redis_cache.set_embedding(text, settings.embed_model, vector)
    return vector
