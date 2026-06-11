"""Asyncio: một luồng duy nhất xử lý 20 "request" cùng lúc.

Chạy:   python 03_asyncio_gather.py

Điều cần quan sát:
- Tuần tự: 20 request x 0.3s = ~6s.
- asyncio.gather: ~0.3s — trong lúc một request chờ, event loop chạy request khác.
- Bẫy blocking: lỡ dùng time.sleep (hoặc requests) thì cả event loop đứng hình.
"""

import asyncio
import sys
import time

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")  # in được tiếng Việt trên console Windows

N_REQUESTS = 20
DELAY = 0.3


async def fake_request(i: int) -> int:
    """Giả lập một lần gọi API: await nhường quyền cho event loop trong lúc chờ."""
    await asyncio.sleep(DELAY)
    return i


async def blocking_request(i: int) -> int:
    """Phiên bản viết SAI: time.sleep chặn cả luồng, event loop không chạy được ai khác."""
    time.sleep(DELAY)
    return i


async def main() -> None:
    print(f"{N_REQUESTS} request, mỗi request chờ {DELAY}s\n")

    start = time.perf_counter()
    for i in range(N_REQUESTS):
        await fake_request(i)
    print(f"  Tuần tự (await từng cái):       {time.perf_counter() - start:>5.2f}s")

    start = time.perf_counter()
    await asyncio.gather(*(fake_request(i) for i in range(N_REQUESTS)))
    print(f"  asyncio.gather (chạy đồng thời): {time.perf_counter() - start:>5.2f}s")

    start = time.perf_counter()
    await asyncio.gather(*(blocking_request(i) for i in range(5)))
    print(f"  Bẫy blocking (5 cái, time.sleep):{time.perf_counter() - start:>5.2f}s  <- không hề đồng thời!")

    print(
        "\nKết luận: asyncio chỉ nhanh khi MỌI THỨ đều await được —"
        "\ndùng asyncio.sleep thay time.sleep, httpx/aiohttp thay requests."
    )


if __name__ == "__main__":
    asyncio.run(main())
