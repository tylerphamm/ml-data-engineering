"""Cắt văn bản thành đoạn theo số token, có overlap để không mất ngữ cảnh ở mép."""
import tiktoken

from src.config import settings

_enc = tiktoken.get_encoding("cl100k_base")


def chunk_text_with_spans(text: str, max_tokens: int | None = None, overlap: int | None = None):
    """Trả list[(đoạn, char_start, char_end)] — vị trí ký tự để lưu metadata vào Postgres."""
    max_tokens = max_tokens or settings.chunk_max_tokens
    overlap = overlap or settings.chunk_overlap
    tokens = _enc.encode(text or "")
    if not tokens:
        return []

    step = max(1, max_tokens - overlap)
    spans = []
    for start in range(0, len(tokens), step):
        window = tokens[start : start + max_tokens]
        char_start = len(_enc.decode(tokens[:start]))
        raw = _enc.decode(window)
        piece = raw.strip()
        if piece:
            spans.append((piece, char_start, char_start + len(raw)))
        if start + max_tokens >= len(tokens):
            break
    return spans


def chunk_text(text: str, max_tokens: int | None = None, overlap: int | None = None):
    """Chỉ trả về danh sách đoạn (dùng cho test và nơi không cần vị trí)."""
    return [piece for piece, _start, _end in chunk_text_with_spans(text, max_tokens, overlap)]


def count_tokens(text: str) -> int:
    return len(_enc.encode(text or ""))
