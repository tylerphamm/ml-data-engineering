"""Kiểm tra sức khỏe 3 database."""
from fastapi import APIRouter

from src.db import postgres, redis_cache
from src.vector import qdrant_store

router = APIRouter(prefix="/api", tags=["health"])


@router.get("/health")
def health():
    stores = {}
    for name, fn in (("postgres", postgres.ping), ("redis", redis_cache.ping), ("qdrant", qdrant_store.ping)):
        try:
            fn()
            stores[name] = "ok"
        except Exception as e:  # noqa: BLE001 - báo cáo trạng thái từng store
            stores[name] = f"error: {e}"
    return {"ok": all(v == "ok" for v in stores.values()), "stores": stores}
