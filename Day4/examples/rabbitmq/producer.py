"""Producer RabbitMQ: đẩy task "gửi email" vào queue rồi thoát ngay.

Chạy:   python producer.py [số task, mặc định 10]

Điểm cần thấy: producer KHÔNG chờ ai xử lý — đẩy vào queue xong là trả lời
người dùng được ngay. Việc nặng để worker làm sau (decouple).
"""

import json
import sys

import pika

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")  # in được tiếng Việt trên console Windows

QUEUE = "tasks"


def main(n: int) -> None:
    connection = pika.BlockingConnection(pika.ConnectionParameters("localhost"))
    channel = connection.channel()

    # durable=True: queue sống sót khi broker restart.
    channel.queue_declare(queue=QUEUE, durable=True)

    for i in range(1, n + 1):
        task = {"task_id": i, "email": f"user{i}@example.com"}
        channel.basic_publish(
            exchange="",  # exchange mặc định: routing_key = tên queue
            routing_key=QUEUE,
            body=json.dumps(task),
            properties=pika.BasicProperties(delivery_mode=2),  # tin bền, không mất khi restart
        )
        print(f"Đã gửi task {i}: gửi mail tới {task['email']}")

    connection.close()
    print(f"\nXong — {n} task đang nằm trong queue '{QUEUE}' chờ worker.")
    print("Xem queue tại http://localhost:15672 (guest/guest).")


if __name__ == "__main__":
    main(int(sys.argv[1]) if len(sys.argv) > 1 else 10)
