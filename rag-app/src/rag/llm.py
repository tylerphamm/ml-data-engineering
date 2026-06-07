"""Sinh câu trả lời từ ngữ cảnh truy hồi + lịch sử hội thoại.

Provider đổi qua .env:
  • none   → KHÔNG gọi LLM, trả thẳng các đoạn Qdrant tìm được (mặc định, miễn phí).
  • ollama → LLM chạy local qua Ollama (OpenAI-compatible API).
  • openai → gpt-4o-mini của OpenAI (cần OPENAI_API_KEY).
Lịch sử hội thoại được đưa vào để trả lời mạch lạc theo ngữ cảnh trước đó.
"""
from src.config import settings

_client = None

_SYSTEM = (
    "Bạn là trợ lý trả lời CHỈ dựa trên NGỮ CẢNH được cung cấp. "
    "Nếu ngữ cảnh không chứa câu trả lời, hãy nói rõ 'Tôi không tìm thấy trong tài liệu.' "
    "Trả lời ngắn gọn, bằng tiếng Việt, và nêu số [Nguồn] đã dùng."
)


def _get_client():
    global _client
    if _client is None:
        from openai import OpenAI

        if settings.llm_provider == "ollama":
            _client = OpenAI(base_url=settings.ollama_host.rstrip("/") + "/v1", api_key="ollama")
        else:
            _client = OpenAI(api_key=settings.openai_api_key)
    return _client


def _format_passages(contexts) -> str:
    return "\n\n".join(f"[Nguồn {i + 1}] {c}" for i, c in enumerate(contexts))


def generate(question: str, contexts, history=None) -> str:
    if not contexts:
        return "Tôi không tìm thấy trong tài liệu."

    if settings.llm_provider == "none":
        # Không dùng LLM — trả thẳng đoạn liên quan nhất do Qdrant tìm theo vector.
        return "Các đoạn liên quan nhất (Qdrant tìm theo độ tương đồng):\n\n" + _format_passages(contexts[:3])

    messages = [{"role": "system", "content": _SYSTEM}]
    for turn in history or []:  # lịch sử cũ→mới (đã giới hạn số lượt ở pipeline)
        if turn.get("role") in ("user", "assistant"):
            messages.append({"role": turn["role"], "content": turn["content"]})
    messages.append(
        {"role": "user", "content": f"Ngữ cảnh:\n{_format_passages(contexts)}\n\nCâu hỏi: {question}"}
    )

    resp = _get_client().chat.completions.create(
        model=settings.llm_model,
        messages=messages,
        temperature=0.2,
    )
    return resp.choices[0].message.content.strip()
