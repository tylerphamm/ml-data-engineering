"""Producer Kafka: ghi sự kiện "người dùng xem trang" vào topic.

Chạy:   python producer.py [số sự kiện, mặc định 20]

Điểm cần thấy: key = tên user, nên sự kiện của CÙNG một user luôn rơi vào
CÙNG một partition — thứ tự theo user được đảm bảo dù topic có 3 partition.
"""

import json
import sys
import time

from confluent_kafka import Producer

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")  # in được tiếng Việt trên console Windows

TOPIC = "page_views"


def delivery_report(err, msg) -> None:
    if err is not None:
        print(f"Gửi lỗi: {err}")
    else:
        print(f"Đã ghi partition {msg.partition()} offset {msg.offset()}: {msg.value().decode()}")


def main(n: int) -> None:
    producer = Producer({"bootstrap.servers": "localhost:9092"})
    users = ["an", "binh", "chi", "dung"]

    for i in range(n):
        event = {"user": users[i % len(users)], "page": f"/bai-viet/{i}", "ts": time.time()}
        producer.produce(
            TOPIC,
            key=event["user"],  # cùng key → cùng partition → giữ thứ tự theo user
            value=json.dumps(event),
            callback=delivery_report,
        )
        producer.poll(0)

    producer.flush()
    print(f"\nXong — {n} sự kiện đã nằm trong log của topic '{TOPIC}'.")
    print("Sự kiện KHÔNG biến mất sau khi được đọc: consumer group mới có thể đọc lại từ đầu.")


if __name__ == "__main__":
    main(int(sys.argv[1]) if len(sys.argv) > 1 else 20)
