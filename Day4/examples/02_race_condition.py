"""Race condition: nhiều luồng cùng đọc–sửa–ghi một biến dùng chung.

Chạy:   python 02_race_condition.py

GIL chỉ đảm bảo mỗi thời điểm một luồng chạy bytecode, KHÔNG đảm bảo
chuỗi "đọc → tính → ghi" của bạn là nguyên tử. Luồng có thể bị tạm dừng
ngay giữa lúc đọc và lúc ghi, làm mất bản cập nhật của luồng khác.
"""

import sys
import threading

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")  # in được tiếng Việt trên console Windows

N_THREADS = 4
N_INCREMENTS = 200_000

# Ép CPython đổi luồng thật dày để race condition lộ ra nhanh hơn.
sys.setswitchinterval(1e-6)

counter = 0
lock = threading.Lock()


def get_counter() -> int:
    """Bước đọc — trong code thật đây là đọc từ cache, từ DB, từ file..."""
    return counter


def set_counter(value: int) -> None:
    """Bước ghi — tách khỏi bước đọc, giống getter/setter trong code thật."""
    global counter
    counter = value


def unsafe_worker() -> None:
    for _ in range(N_INCREMENTS):
        current = get_counter()   # đọc...
        set_counter(current + 1)  # ...luồng khác có thể đã ghi xong trước ta → mất lượt của nó


def safe_worker() -> None:
    for _ in range(N_INCREMENTS):
        with lock:                # vùng găng: mỗi lúc chỉ một luồng đi qua cả đọc lẫn ghi
            set_counter(get_counter() + 1)


def run(worker, label: str) -> None:
    global counter
    counter = 0
    threads = [threading.Thread(target=worker) for _ in range(N_THREADS)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()

    expected = N_THREADS * N_INCREMENTS
    lost = expected - counter
    print(f"  {label:<22} kỳ vọng {expected:>9,} | thực tế {counter:>9,} | mất {lost:,} lượt")


def main() -> None:
    print(f"{N_THREADS} luồng, mỗi luồng cộng {N_INCREMENTS:,} lần\n")
    run(unsafe_worker, "Không khóa:")
    run(safe_worker, "Có threading.Lock:")
    print("\nKết luận: dữ liệu dùng chung giữa các luồng phải được bảo vệ bằng Lock,")
    print("hoặc tốt hơn — thiết kế để các luồng không cùng ghi vào một chỗ.")


if __name__ == "__main__":
    main()
