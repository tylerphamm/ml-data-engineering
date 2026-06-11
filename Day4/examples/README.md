# Day 4 — Code minh họa: Python hiệu năng cao & Message Queue

Mỗi script gắn với một slide trong bài giảng. Phần 1 chạy ngay không cần cài gì; phần 2 cần Docker và hai thư viện trong `requirements.txt`.

## Yêu cầu

- Python 3.10+ (script 01–03 chỉ dùng thư viện chuẩn)
- Docker + Docker Compose (cho RabbitMQ và Kafka)
- `pip install -r requirements.txt` (chỉ cần cho phần message queue)

## Phần 1 — Concurrency trên một máy (không cần cài gì)

| Script | Minh họa cho slide | Điều rút ra |
|---|---|---|
| `01_cpu_vs_io.py` | GIL, I/O-bound vs CPU-bound | Threading chỉ nhanh hơn với I/O; CPU-bound phải dùng multiprocessing |
| `02_race_condition.py` | Multithreading | GIL không cứu bạn khỏi race condition — dữ liệu dùng chung phải có Lock |
| `03_asyncio_gather.py` | Asyncio | `gather` chạy 20 request trong thời gian của 1; một dòng blocking giết cả event loop |

```bash
python 01_cpu_vs_io.py
python 02_race_condition.py
python 03_asyncio_gather.py
```

## Phần 2 — RabbitMQ: task queue có ack

```bash
cd rabbitmq
docker compose up -d          # broker + web UI tại http://localhost:15672 (guest/guest)
python producer.py 10         # đẩy 10 task "gửi email" vào queue rồi thoát ngay
python consumer.py            # worker nhận việc — mở 2-3 terminal để thấy chia việc
```

Thí nghiệm nên làm:

1. Chạy producer trước, consumer sau — task nằm chờ trong queue, không mất (buffer).
2. Mở 2 consumer rồi chạy `python producer.py 10` — broker chia việc vòng tròn cho từng worker (`prefetch_count=1`).
3. Ctrl+C một consumer đang xử lý dở — task chưa ack quay lại queue cho worker còn lại (tin cậy nhờ ack).

## Phần 3 — Kafka: distributed log có replay

```bash
cd kafka
docker compose up -d          # Kafka một node, chế độ KRaft, topic mặc định 3 partition
python producer.py 20         # ghi 20 sự kiện "xem trang", key theo user
python consumer.py analytics  # group "analytics" đọc từ đầu log
```

Thí nghiệm nên làm:

1. Mở 2 terminal cùng chạy `python consumer.py analytics` — 3 partition chia cho 2 consumer, mỗi sự kiện chỉ một người trong group nhận (scale).
2. Chạy `python consumer.py bao-cao` — group mới đọc lại toàn bộ sự kiện từ offset 0 (replay), điều RabbitMQ không làm được.
3. Nhìn cột partition trong output: sự kiện của cùng một user luôn nằm cùng partition vì producer gửi key theo user.

## Dọn dẹp

```bash
docker compose down -v        # chạy trong thư mục rabbitmq/ và kafka/
```
