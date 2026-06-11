"""Consumer Kafka: đọc topic theo consumer group, tự giữ offset.

Chạy:   python consumer.py [tên group, mặc định "analytics"]

Hai demo đáng thử:
1. Mở 2 terminal cùng group:   python consumer.py analytics
   → 3 partition được chia cho 2 consumer, mỗi sự kiện chỉ một người nhận.
2. Mở group mới:               python consumer.py bao-cao
   → đọc lại TOÀN BỘ sự kiện từ đầu log (replay) — điều RabbitMQ không làm được.
"""

import json
import sys

from confluent_kafka import Consumer

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")  # in được tiếng Việt trên console Windows

TOPIC = "page_views"


def main(group_id: str) -> None:
    consumer = Consumer(
        {
            "bootstrap.servers": "localhost:9092",
            "group.id": group_id,
            # Group chưa có offset thì bắt đầu từ sự kiện cũ nhất → demo replay.
            "auto.offset.reset": "earliest",
        }
    )
    consumer.subscribe([TOPIC])
    print(f"Consumer group '{group_id}' đang đọc topic '{TOPIC}'. Ctrl+C để thoát.")

    try:
        while True:
            msg = consumer.poll(1.0)
            if msg is None:
                continue
            if msg.error():
                print(f"Lỗi: {msg.error()}")
                continue
            event = json.loads(msg.value())
            print(f"[partition {msg.partition()} | offset {msg.offset():>3}] {event['user']} xem {event['page']}")
    except KeyboardInterrupt:
        pass
    finally:
        consumer.close()  # commit offset lần cuối rồi rời group


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "analytics")
