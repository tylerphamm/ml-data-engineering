"""Cấu hình đọc từ .env (pydantic-settings). Mọi tham số tập trung một chỗ."""
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

_ENV = Path(__file__).resolve().parent.parent / ".env"  # rag-app/.env (đọc được dù chạy từ thư mục nào)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=str(_ENV), extra="ignore")

    # --- AI provider ---
    # Mặc định CHẠY LOCAL MIỄN PHÍ: embedding đa ngôn ngữ (hỗ trợ tiếng Việt), LLM tắt.
    embed_provider: str = "fastembed"  # fastembed | openai
    embed_model: str = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    embed_dim: int = 384
    llm_provider: str = "none"  # none | ollama | openai
    llm_model: str = "gpt-4o-mini"
    openai_api_key: str = ""
    ollama_host: str = "http://localhost:11434"

    # --- Hạ tầng (khớp docker-compose) ---
    postgres_url: str = "postgresql://rag:rag@localhost:5432/rag"
    redis_url: str = "redis://localhost:6379/0"
    qdrant_url: str = "http://localhost:6333"
    qdrant_collection: str = "kb_chunks"

    # --- Tham số RAG ---
    cache_ttl: int = 3600  # TTL cache câu trả lời (giây)
    embed_cache_ttl: int = 604800  # TTL cache embedding (7 ngày)
    chunk_max_tokens: int = 400
    chunk_overlap: int = 80
    retrieve_top_k: int = 5
    history_turns: int = 6  # số lượt hội thoại gần nhất đưa vào ngữ cảnh LLM

    # --- Auth / bảo mật ---
    jwt_secret: str = "dev-secret-doi-trong-production-toi-thieu-32-ky-tu"
    jwt_algorithm: str = "HS256"
    access_token_ttl_min: int = 720  # vòng đời token (phút) = 12 giờ

    # --- Rate limit (chống lạm dụng / bảo vệ ngân sách LLM) ---
    rate_limit_max: int = 30  # số tin nhắn tối đa mỗi cửa sổ
    rate_limit_window_sec: int = 60  # độ dài cửa sổ (giây)


settings = Settings()
