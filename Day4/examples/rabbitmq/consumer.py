"""Consumer (worker) RabbitMQ: nhận task từ queue, xử lý xong mới ack.

Chạy:   python consumer.py
Mở 2-3 terminal cùng chạy consumer để thấy broker chia việc cho các worker.
Thử Ctrl+C một worker giữa chừng: task chưa ack quay lại queue cho worker khác.
"""

import json
import random
import sys
import time

import pika

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")  # in được tiếng Việt trên console Windows

QUEUE = "tasks"


def handle(channel, method, properties, body) -> None:
    task = json.loads(body)
    print(f"Nhận task {task['task_id']}: gửi mail tới {task['email']} ...", end="", flush=True)
    time.sleep(random.uniform(0.5, 1.5))  # giả lập việc nặng
    print(" xong")

    # Ack SAU khi làm xong — worker chết trước dòng này thì task không bị mất.
    channel.basic_ack(delivery_tag=method.delivery_tag)


def main() -> None:
    connection = pika.BlockingConnection(pika.ConnectionParameters("localhost"))
    channel = connection.channel()
    channel.queue_declare(queue=QUEUE, durable=True)

    # Mỗi worker chỉ cầm 1 task một lúc → việc được chia đều, worker chậm không ôm đồm.
    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue=QUEUE, on_message_callback=handle)

    print("Worker sẵn sàng, đang chờ task. Ctrl+C để thoát.")
    try:
        channel.start_consuming()
    except KeyboardInterrupt:
        channel.stop_consuming()
        connection.close()


if __name__ == "__main__":
    main()
