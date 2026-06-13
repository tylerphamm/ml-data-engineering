const slideDefinitions = [
  {
    section: "Khóa học",
    kicker: "Tổng quan",
    title: "High-Performance Python",
    body: "",
    keyMessage:
      "Python chỉ nhanh khi chọn đúng mô hình chạy đồng thời: threading cho I/O, multiprocessing cho CPU, asyncio cho hàng vạn kết nối, và message queue khi vượt ra ngoài một máy.",
    hideKeyMessage: true,
    hideEyebrow: true,
    points: ["GIL", "Threading", "Multiprocessing", "Asyncio", "Message Queue"],
    details: [
      { label: "Mục tiêu", text: "Hiểu vì sao Python chậm ở đâu, tăng tốc bằng công cụ nào, và khi nào phải tách hệ thống bằng hàng đợi tin nhắn." },
      { label: "Cách học", text: "Mỗi khái niệm đi kèm phép so sánh đời thường và một script chạy được trong thư mục examples." },
    ],
    visual: "cover",
    layout: "cover",
    tone: "py",
  },
  {
    section: "Concept",
    kicker: "Khái niệm",
    title: "Processes and Threads",
    body: "Hiểu đúng khái niệm nền tảng trước khi chọn công cụ.",
    keyMessage:
      "Process cách ly bộ nhớ, thread chia sẻ bộ nhớ; concurrency là xen kẽ trên một nhân, parallelism là chạy thật sự cùng lúc trên nhiều nhân.",
    hideKeyMessage: true,
    points: ["Process", "Thread", "Concurrency", "Parallelism"],
    details: [
      {
        label: "Process",
        text: "Một chương trình đang chạy, có bộ nhớ riêng biệt, không chia sẻ với process khác.",
        example: "Chrome là 1 process, Word là 1 process khác — Chrome crash không ảnh hưởng Word.",
      },
      {
        label: "Thread",
        text: "Đơn vị thực thi nhỏ nhất bên trong process; các thread chia sẻ bộ nhớ với nhau.",
        example: "Trong Chrome: thread tải trang, thread render UI — cùng dùng bộ nhớ của tab.",
      },
      {
        label: "Concurrency",
        text: "Xử lý nhiều việc xen kẽ nhau, không nhất thiết cùng lúc — một người nhảy qua lại đủ nhanh.",
        example: "1 đầu bếp luân phiên: canh đang đun thì sang chiên trứng, rồi quay lại canh.",
      },
      {
        label: "Parallelism",
        text: "Thật sự làm nhiều việc cùng lúc — cần nhiều nhân CPU.",
        example: "2 đầu bếp: một người nấu canh, một người chiên trứng — xong cùng lúc.",
      },
    ],
    callout: {
      type: "insight",
      title: "Concurrency ≠ Parallelism",
      lines: [
        "Concurrency: 1 nhân luân phiên nhanh — tạo cảm giác cùng lúc. Parallelism: N nhân — thật sự cùng lúc.",
      ],
    },
    layout: "cards",
    tone: "py",
  },
  {
    section: "Toolbox",
    kicker: "Toolbox 1 — I/O-bound",
    title: "Multithreading",
    body: "Nhiều thread trong một process — khi một thread chờ I/O thì thread khác chạy tiếp.",
    keyMessage:
      "Threading dành cho I/O-bound: thread chờ I/O thì thread khác chạy; GIL khiến nó vô dụng với việc nặng CPU.",
    hideKeyMessage: true,
    points: ["Tạo pool", "Giao việc", "Chờ I/O xen kẽ", "Gom kết quả"],
    steps: [
      { title: "Tạo pool", sub: "ThreadPoolExecutor(max_workers=10)" },
      { title: "Giao việc", sub: "submit / map cho từng việc" },
      { title: "Chờ I/O xen kẽ", sub: "A chờ DB, B gọi API, C đọc file" },
      { title: "Gom kết quả", sub: "future.result() thu hoạch" },
    ],
    scenario: {
      title: "Tình huống: download 50 file PDF từ server",
      lines: [
        { mark: "bad", text: "Tuần tự: tải xong file 1 mới sang file 2 — 50 phút." },
        { mark: "good", text: "Threading: 10 thread cùng tải, thread chờ network thì thread khác chạy — ~5 phút." },
      ],
      code: `from concurrent.futures import ThreadPoolExecutor

urls = [f"https://example.com/file{i}.pdf" for i in range(50)]

with ThreadPoolExecutor(max_workers=10) as pool:
    results = pool.map(download_pdf, urls)`,
    },
    details: [
      {
        label: "ThreadPoolExecutor",
        text: "API chuẩn trong concurrent.futures; max_workers là số thread.",
        example: "ThreadPoolExecutor(max_workers=10)",
      },
      {
        label: "Khi nào dùng",
        text: "I/O-bound: gọi API, đọc ghi file, query database, download.",
        example: "Tải 50 file, gọi 100 API, đọc 20 file CSV.",
      },
      {
        label: "Race condition",
        text: "Nhiều thread ghi chung một biến → kết quả sai; bảo vệ bằng threading.Lock().",
        example: "2 thread cùng counter += 1 → mất một lần tăng.",
      },
      {
        label: "Giới hạn — GIL",
        text: "GIL khiến mỗi thời điểm chỉ một thread chạy bytecode Python; thread chỉ hữu ích khi chờ I/O.",
        example: "Chờ network: tốt — tính toán nặng: không.",
      },
    ],
    callout: {
      type: "warning",
      title: "GIL — Global Interpreter Lock",
      lines: ["Mỗi thời điểm chỉ một thread chạy Python bytecode — multithreading không tăng tốc việc nặng CPU."],
    },
    layout: "tool",
    tone: "teal",
  },
  {
    section: "Toolbox",
    kicker: "Toolbox 2 — CPU-bound",
    title: "Multiprocessing",
    body: "Tạo N process riêng biệt → vượt GIL → tận dụng N nhân CPU thật sự.",
    keyMessage:
      "Multiprocessing vượt GIL bằng N process trên N nhân; đổi lại tốn RAM và phải pickle dữ liệu qua lại.",
    hideKeyMessage: true,
    points: ["Tạo pool", "Chia việc", "Chạy song song", "Gom kết quả"],
    steps: [
      { title: "Tạo pool", sub: "ProcessPoolExecutor — N process = N nhân" },
      { title: "Chia việc", sub: "mỗi process nhận một phần dữ liệu" },
      { title: "Chạy song song", sub: "mỗi process một nhân CPU, thật sự cùng lúc" },
      { title: "Gom kết quả", sub: "kết quả pickle về process chính" },
    ],
    scenario: {
      title: "Tình huống: resize 10.000 ảnh 4K → 1080p",
      lines: [
        { mark: "bad", text: "Tuần tự: 1 nhân xử lý hết — 100 phút." },
        { mark: "bad", text: "Threading: GIL chặn, vẫn 1 nhân — không nhanh hơn." },
        { mark: "good", text: "Multiprocessing: 8 nhân, mỗi nhân ~1.250 ảnh — ~12 phút." },
      ],
      code: `from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

def main():
    images = list(Path("photos").glob("*.jpg"))
    with ProcessPoolExecutor(max_workers=8) as pool:
        return pool.map(resize_image, images)

if __name__ == "__main__":
    main()`,
    },
    details: [
      {
        label: "ProcessPoolExecutor",
        text: "API giống ThreadPoolExecutor nhưng tạo process, mỗi process có bộ nhớ riêng.",
        example: "max_workers nên bằng số nhân CPU.",
      },
      {
        label: "Khi nào dùng",
        text: "CPU-bound: xử lý ảnh, tính toán nặng, ML, transform dữ liệu.",
        example: "Resize 10K ảnh, tính π, encode video.",
      },
      {
        label: "Chi phí",
        text: "Process tốn RAM riêng, tạo/hủy chậm hơn thread; dữ liệu qua lại phải pickle.",
        example: "1 process vài chục MB — 100 process là hàng GB.",
      },
      {
        label: "Lưu ý Windows",
        text: "Code khởi chạy phải nằm trong if __name__ == '__main__' vì process con import lại module.",
        example: "Thiếu guard này → spawn vô hạn.",
      },
    ],
    callout: {
      type: "warning",
      title: "Tốn RAM, không chia sẻ biến",
      lines: ["Mỗi process là bản sao bộ nhớ riêng — giao tiếp qua multiprocessing.Queue hoặc Manager()."],
    },
    layout: "tool",
    tone: "violet",
  },
  {
    section: "Toolbox",
    kicker: "Toolbox 3 — I/O số lượng lớn",
    title: "Asyncio",
    body: "Một thread duy nhất, event loop điều phối — không tạo thread, không tạo process.",
    keyMessage:
      "Asyncio chạy hàng vạn coroutine trên một thread; mạnh nhất cho I/O số lượng lớn nhưng cả hệ thư viện phải async.",
    hideKeyMessage: true,
    points: ["Event loop", "async def", "await", "gather"],
    steps: [
      { title: "Event loop", sub: "vòng lặp chính điều phối tất cả" },
      { title: "async def", sub: "khai báo coroutine" },
      { title: "await", sub: "gặp I/O thì nhường quyền cho task khác" },
      { title: "gather", sub: "chạy nhiều coroutine, gom kết quả" },
    ],
    scenario: {
      title: "Tình huống: crawl 10.000 trang web cùng lúc",
      lines: [
        { mark: "bad", text: "Threading: 10.000 thread, mỗi thread một stack riêng (hàng chục GB không gian địa chỉ) và OS nghẽn vì context-switch." },
        { mark: "good", text: "Asyncio: 1 thread, 10.000 coroutine — chỉ vài chục MB." },
      ],
      code: `import asyncio, aiohttp

async def fetch(session, url):
    async with session.get(url) as resp:
        return await resp.text()

async def main():
    async with aiohttp.ClientSession() as s:
        tasks = [fetch(s, u) for u in urls]
        return await asyncio.gather(*tasks)

asyncio.run(main())`,
    },
    details: [
      {
        label: "Event loop",
        text: "Trái tim của asyncio: quyết định coroutine nào được chạy tiếp.",
        example: "Giảng viên gọi lần lượt — ai đang nghĩ thì hỏi người khác.",
      },
      {
        label: "Cú pháp",
        text: "async def khai báo, await chờ không chặn, asyncio.gather chạy song song.",
        example: "results = await asyncio.gather(*tasks)",
      },
      {
        label: "Khi nào dùng",
        text: "I/O-bound số lượng lớn: crawler, chat server, API gateway.",
        example: "Crawl 10K trang, WebSocket 50K kết nối.",
      },
      {
        label: "Cạm bẫy",
        text: "Một dòng blocking chặn cả event loop — thư viện cũng phải async.",
        example: "requests.get() chặn hết → dùng aiohttp.",
      },
    ],
    callout: {
      type: "tip",
      title: "Thư viện đồng bộ sẽ chặn event loop",
      lines: ["Thay requests, psycopg2 bằng bản async: aiohttp, asyncpg, aiomysql, aioredis."],
    },
    layout: "tool",
    tone: "py",
  },
  {
    section: "Decision",
    kicker: "Bảng quyết định",
    title: "Threading vs Multiprocessing vs Asyncio",
    body: "Không có công cụ hoàn hảo, chỉ có công cụ phù hợp.",
    keyMessage:
      "I/O ít task chọn threading, I/O hàng nghìn task chọn asyncio, CPU nặng chọn multiprocessing.",
    points: ["Loại task", "Song song", "Chi phí", "Quyết định"],
    table: {
      columns: ["Tiêu chí", "Threading", "Multiprocessing", "Asyncio"],
      rows: [
        ["Loại task", "I/O-bound", "CPU-bound", "I/O-bound số lượng lớn"],
        ["Song song thật?", "Không — GIL, chỉ xen kẽ", "Có — N process, N nhân", "Không — 1 thread xen kẽ cực nhanh"],
        ["Đơn vị", "Thread (~8 MB stack ảo)", "Process (vài chục MB)", "Coroutine (vài KB)"],
        ["10.000 task", "Hàng chục GB địa chỉ ảo, nghẽn context-switch", "Không khả thi", "Vài chục MB"],
        ["Chia sẻ dữ liệu", "Dễ — chung bộ nhớ, cần Lock", "Khó — bộ nhớ riêng, phải pickle", "Rất dễ — một thread"],
        ["Rủi ro", "Race condition, deadlock", "Tốn RAM, IPC phức tạp", "Thư viện phải async"],
      ],
    },
    decision: [
      { cond: "Tính toán nặng — ảnh, ML, encode?", pick: "Multiprocessing" },
      { cond: "Chờ I/O, ít task (< 100)?", pick: "Threading" },
      { cond: "Chờ I/O, hàng nghìn task?", pick: "Asyncio" },
    ],
    examples: [
      "Download 50 file PDF → Threading",
      "Resize 10.000 ảnh → Multiprocessing",
      "Crawl 10.000 trang web → Asyncio",
      "Train model ML → Multiprocessing",
      "Gửi 5.000 email → Asyncio / Threading",
    ],
    layout: "table",
    tone: "py",
  },
  {
    section: "Scale out",
    kicker: "Vượt ra ngoài một máy",
    title: "Message Queue",
    body: "Khi một máy không đủ sức — Producer và Consumer nối với nhau qua hàng đợi.",
    keyMessage:
      "Queue tách rời hệ thống: producer thả việc rồi đi tiếp, consumer xử lý theo nhịp của mình — chịu tải, tin cậy, dễ mở rộng.",
    hideKeyMessage: true,
    points: ["Producer", "Broker", "Queue", "Consumer"],
    steps: [
      { title: "Producer", sub: "phục vụ bàn — tạo message" },
      { title: "Broker", sub: "quản lý dây chuyền — nhận và điều phối" },
      { title: "Queue", sub: "dây chuyền phiếu — lưu theo thứ tự" },
      { title: "Consumer", sub: "bếp — lấy và xử lý" },
    ],
    scenario: {
      title: "Nhà hàng và dây chuyền phiếu order",
      lines: [
        { mark: "bad", text: "Không có hàng đợi: phục vụ chạy vào bếp, bếp bận thì đứng chờ — khách đợi mãi." },
        { mark: "good", text: "Có hàng đợi: phục vụ ghim phiếu vào dây chuyền rồi đi tiếp; bếp lấy phiếu theo thứ tự, xong rung chuông." },
        { mark: "plain", text: "Message queue chính là dây chuyền phiếu order đó." },
      ],
    },
    details: [
      {
        label: "Tách rời",
        text: "Producer không cần biết consumer là ai, bao nhiêu, sống hay chết.",
        example: "Web đẩy order vào queue — web crash, email vẫn gửi.",
      },
      {
        label: "Chịu tải",
        text: "Request dồn dập thì queue chứa lại, consumer xử lý từ từ.",
        example: "Black Friday 10K order/phút — xử lý 1K/phút, không sập.",
      },
      {
        label: "Tin cậy",
        text: "Consumer crash thì message không mất, restart xử lý tiếp.",
        example: "Gửi email lỗi → message về queue → retry.",
      },
      {
        label: "Mở rộng",
        text: "Thêm consumer mà không phải sửa producer.",
        example: "Email chậm → thêm 5 worker, web giữ nguyên.",
      },
    ],
    layout: "tool",
    tone: "orange",
  },
  {
    section: "Scale out",
    kicker: "Smart broker",
    title: "RabbitMQ",
    body: "Smart broker — dumb consumer: broker quyết định message đi đâu.",
    keyMessage:
      "RabbitMQ là smart broker: exchange route message theo routing key, ack đảm bảo at-least-once — chuẩn cho task queue.",
    hideKeyMessage: true,
    points: ["Exchange", "Routing", "Ack", "Task queue"],
    scenario: {
      title: "Hệ thống đặt hàng online",
      lines: [
        { mark: "plain", text: "User đặt hàng → web (producer) gửi message vào exchange order_events." },
        { mark: "plain", text: "order.created → email_queue (gửi xác nhận) + inventory_queue (trừ kho)." },
        { mark: "plain", text: "order.shipped → notification_queue (bắn SMS) — exchange nhìn routing key để phân phối." },
      ],
    },
    details: [
      {
        label: "Exchange & routing",
        logo: "rabbitmq",
        text: "Producer gửi qua exchange; exchange dựa routing key route đến đúng queue — direct, topic, fanout.",
        example: "order.created → email + inventory.",
      },
      {
        label: "Ack & retry",
        text: "Xử lý xong mới ack; crash thì message giao lại cho worker khác — at-least-once, consumer phải idempotent.",
        example: "Worker chết giữa chừng → worker 2 xử lý lại.",
      },
      {
        label: "Khi nào dùng",
        text: "Task queue — giao việc cho worker, mỗi message một consumer xử lý.",
        example: "Gửi email, tạo PDF, xử lý video, sync data.",
      },
      {
        label: "Hệ sinh thái",
        text: "Giao thức AMQP; Python dùng pika; Celery lấy RabbitMQ làm broker mặc định.",
        example: "pip install pika — Celery + RabbitMQ.",
      },
    ],
    tags: [
      "Smart broker — exchange route message",
      "Task queue — 1 message, 1 worker xử lý",
      "Scale out — thêm worker dễ dàng",
    ],
    layout: "broker",
    tone: "orange",
  },
  {
    section: "Scale out",
    kicker: "Distributed log",
    title: "Kafka",
    body: "Dumb broker — smart consumer: broker chỉ lưu, consumer tự quyết định đọc gì.",
    keyMessage:
      "Kafka là distributed log: message giữ lại để replay, consumer group cho nhiều hệ thống đọc độc lập — chuẩn cho event streaming.",
    hideKeyMessage: true,
    points: ["Topic", "Partition", "Offset", "Consumer group"],
    scenario: {
      title: "Clickstream analytics cho e-commerce",
      lines: [
        { mark: "plain", text: "User click 'Xem sản phẩm' → event vào topic user_clicks, chia 3 partition." },
        { mark: "plain", text: "Group Analytics ra báo cáo realtime; group Recommendation cập nhật model; group Warehouse đổ vào BigQuery." },
        { mark: "plain", text: "1 event — 3 hệ thống đọc độc lập, mỗi consumer group tự giữ offset." },
      ],
    },
    details: [
      {
        label: "Topic & partition",
        logo: "kafka",
        text: "Topic là dòng message; partition chia nhỏ để phân tán, mỗi partition là một log tuần tự.",
        example: "user_clicks 3 partition → throughput ×3.",
      },
      {
        label: "Offset & replay",
        text: "Message có số thứ tự (offset); consumer tự nhớ vị trí, có thể tua lại đọc từ đầu.",
        example: "Analytics bug → reset offset 0, xử lý lại hôm qua.",
      },
      {
        label: "Consumer group",
        text: "Consumer trong group chia nhau partition; một partition chỉ một consumer trong group đọc.",
        example: "3 consumer — mỗi người 1 partition, scale song song.",
      },
      {
        label: "Khi nào dùng",
        text: "Event streaming, log, analytics realtime, data pipeline — nhiều hệ cùng đọc một data.",
        example: "Clickstream, IoT sensor, audit log, CDC.",
      },
    ],
    tags: [
      "Dumb broker — chỉ append log",
      "Event stream — giữ message để replay",
      "Nhiều consumer — các group đọc độc lập",
    ],
    layout: "broker",
    tone: "slate",
  },
  {
    section: "Comparison",
    kicker: "Chọn đúng việc",
    title: "RabbitMQ vs Kafka",
    body: "Công cụ khác nhau, bài toán khác nhau.",
    keyMessage:
      "Xử lý xong không cần đọc lại → RabbitMQ; cần replay hoặc nhiều hệ cùng đọc → Kafka.",
    points: ["Triết lý", "Replay", "Throughput", "Use case"],
    table: {
      columns: ["Tiêu chí", "RabbitMQ", "Kafka"],
      rows: [
        ["Triết lý", "Smart broker, dumb consumer", "Dumb broker, smart consumer"],
        ["Message sau khi đọc", "Ack xong là xóa", "Giữ lại — mặc định 7 ngày"],
        ["Replay", "Không — message đã xóa", "Có — tua lại offset"],
        ["1 message → N hệ thống", "Phải bind thêm queue", "Consumer group đọc độc lập"],
        ["Throughput", "Hàng chục nghìn msg/s", "Hàng trăm nghìn đến hàng triệu msg/s"],
        ["Use case chính", "Task queue, giao việc worker", "Event streaming, analytics, log"],
      ],
    },
    choose: [
      {
        title: "Chọn RabbitMQ khi",
        items: [
          "Giao việc cho worker: email, report, video",
          "Mỗi message xử lý một lần rồi xóa",
          "Cần routing linh hoạt: direct, topic, fanout",
          "Combo phổ biến: Celery + RabbitMQ",
        ],
      },
      {
        title: "Chọn Kafka khi",
        items: [
          "Cần replay dữ liệu: analytics, audit",
          "Nhiều hệ thống đọc cùng một data",
          "Throughput cực cao: hàng triệu event/giây",
          "Điển hình: clickstream, CDC, data pipeline",
        ],
      },
    ],
    callout: {
      type: "insight",
      title: "Câu hỏi quyết định",
      lines: ["Message xử lý xong có cần đọc lại không? Không → RabbitMQ. Có → Kafka."],
    },
    layout: "versus",
    tone: "py",
  },
];

export const slides = slideDefinitions;

export function clampSlideIndex(index) {
  return Math.min(Math.max(index, 0), slides.length - 1);
}

export function getNextSlideIndex(index) {
  return clampSlideIndex(index + 1);
}

export function getPreviousSlideIndex(index) {
  return clampSlideIndex(index - 1);
}

export function getSlideIndexForKey(index, event) {
  const isSpace = event.key === " " || event.key === "Spacebar" || event.code === "Space";
  const isNext = isSpace || event.key === "ArrowRight" || event.key === "PageDown";
  const isPrevious = event.key === "ArrowLeft" || event.key === "PageUp";

  if (isNext) return getNextSlideIndex(index);
  if (isPrevious) return getPreviousSlideIndex(index);
  if (event.key === "Home") return 0;
  if (event.key === "End") return slides.length - 1;

  return clampSlideIndex(index);
}
