"""So sánh tuần tự / ThreadPoolExecutor / ProcessPoolExecutor trên hai loại tác vụ.

Chạy:   python 01_cpu_vs_io.py

Điều cần quan sát:
- Tác vụ I/O-bound: threading nhanh hơn hẳn tuần tự (luồng chờ thì nhả GIL).
- Tác vụ CPU-bound: threading KHÔNG nhanh hơn (GIL), multiprocessing mới nhanh.
"""

import sys
import time
from concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")  # in được tiếng Việt trên console Windows

N_TASKS = 6
WORKERS = 4


def io_task(n: int) -> int:
    """Giả lập gọi API mất 0.5 giây: toàn bộ thời gian là chờ, CPU rảnh."""
    time.sleep(0.5)
    return n


def cpu_task(n: int) -> int:
    """Tính toán thuần: CPU bận 100%, GIL không được nhả trong lúc tính."""
    total = 0
    for i in range(5_000_000):
        total += i * i
    return total


def benchmark(label: str, fn, executor_cls=None) -> None:
    start = time.perf_counter()
    if executor_cls is None:
        for i in range(N_TASKS):
            fn(i)
    else:
        with executor_cls(max_workers=WORKERS) as pool:
            list(pool.map(fn, range(N_TASKS)))
    elapsed = time.perf_counter() - start
    print(f"  {label:<34}{elapsed:>7.2f}s")


def main() -> None:
    print(f"{N_TASKS} tác vụ, pool {WORKERS} worker\n")

    print("I/O-bound — mỗi tác vụ chờ 0.5s (giả lập gọi API):")
    benchmark("Tuần tự", io_task)
    benchmark("ThreadPoolExecutor", io_task, ThreadPoolExecutor)
    benchmark("ProcessPoolExecutor", io_task, ProcessPoolExecutor)

    print("\nCPU-bound — mỗi tác vụ là 5 triệu phép nhân cộng:")
    benchmark("Tuần tự", cpu_task)
    benchmark("ThreadPoolExecutor (kẹt GIL)", cpu_task, ThreadPoolExecutor)
    benchmark("ProcessPoolExecutor", cpu_task, ProcessPoolExecutor)

    print(
        "\nKết luận: chẩn đoán nút nghẽn trước, chọn công cụ sau —"
        "\nI/O-bound dùng threading (hoặc asyncio), CPU-bound dùng multiprocessing."
    )


# Bắt buộc trên Windows/macOS: tiến trình con import lại module này,
# thiếu guard sẽ đệ quy tạo tiến trình vô hạn.
if __name__ == "__main__":
    main()
