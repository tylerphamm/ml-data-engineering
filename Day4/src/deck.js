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
    body: "Hình dung: một ngôi nhà là một process, mỗi người nấu trong nhà là một thread, mỗi bước nấu ăn là một task.",
    keyMessage:
      "Process cách ly bộ nhớ, thread chia sẻ bộ nhớ; concurrency là một người xen kẽ nhiều bước, parallelism là nhiều người nấu thật sự cùng lúc.",
    hideKeyMessage: true,
    points: ["Process", "Thread", "Concurrency", "Parallelism"],
    details: [
      {
        label: "Process",
        text: "Một ngôi nhà — có bếp và kho riêng (bộ nhớ riêng), không dùng chung với nhà khác.",
        example: "Chrome một nhà, Word một nhà khác — bếp nhà này cháy không lan sang nhà kia.",
      },
      {
        label: "Thread",
        text: "Một người nấu trong nhà; nhiều người chung một nhà thì dùng chung bếp và kho.",
        example: "Hai người cùng thò tay vào một tủ lạnh — nhanh, nhưng dễ va vào nhau.",
      },
      {
        label: "Concurrency",
        text: "Một người làm nhiều bước nấu xen kẽ — không cùng lúc, mà nhảy qua lại đủ nhanh.",
        example: "Đang chờ nồi canh sôi thì quay sang thái rau, rau xong lại ngó nồi canh.",
      },
      {
        label: "Parallelism",
        text: "Nhiều người cùng nấu thật sự một lúc — cần đủ người (nhiều nhân CPU).",
        example: "Hai người: một người đun canh, một người chiên trứng — xong cùng lúc.",
      },
    ],
    callout: {
      type: "insight",
      title: "Concurrency ≠ Parallelism",
      lines: [
        "Một người nhảy qua lại giữa các bước nấu = concurrency. Nhiều người cùng nấu một lúc = parallelism.",
        "Lưu ý Python: nhiều người chung một nhà vẫn không nấu Python song song (luật một con dao — xem slide sau); muốn song song thật phải thuê nhiều nhà (multiprocessing).",
      ],
    },
    layout: "cards",
    tone: "py",
  },
  {
    section: "Toolbox",
    kicker: "Toolbox 1 — I/O-bound",
    title: "Multithreading",
    body: "Thêm nhiều người vào cùng một nhà — khi một người đứng chờ (nồi sôi, lò nướng) thì người khác tranh thủ làm bước khác.",
    keyMessage:
      "Threading dành cho I/O-bound: người này chờ thì người kia làm tiếp; GIL khiến nó vô dụng với việc nặng CPU.",
    hideKeyMessage: true,
    points: ["Tạo pool", "Giao việc", "Chờ I/O xen kẽ", "Gom kết quả"],
    steps: [
      { title: "Tạo pool", sub: "ThreadPoolExecutor — gọi thêm người vào nhà" },
      { title: "Giao việc", sub: "chia bước nấu cho từng người" },
      { title: "Chờ I/O xen kẽ", sub: "ai chờ nồi sôi thì người khác thái rau" },
      { title: "Gom kết quả", sub: "future.result() — dọn ra khi xong" },
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
        text: "API chuẩn trong concurrent.futures; max_workers là số người (thread).",
        example: "ThreadPoolExecutor(max_workers=10) — 10 người cùng làm.",
      },
      {
        label: "Khi nào dùng",
        text: "I/O-bound: gọi API, đọc ghi file, query database, download.",
        example: "Việc nào cũng phải chờ — chờ nước sôi, chờ lò nướng, chờ cơm chín.",
      },
      {
        label: "Race condition",
        text: "Nhiều người sửa chung một thứ → kết quả sai; phân lượt bằng threading.Lock().",
        example: "Hai người cùng nêm muối vào một nồi → nồi mặn gấp đôi.",
      },
      {
        label: "Giới hạn — GIL",
        text: "Trong một nhà chỉ một người được cầm dao (chạy Python) tại một thời điểm; thêm người chỉ lợi khi có người đang chờ.",
        example: "Ai cũng phải thái liên tục (tính toán) → chỉ một dao, thêm người vô ích.",
      },
    ],
    callout: {
      type: "warning",
      title: "GIL — luật một con dao mỗi nhà",
      lines: ["Trong một process, mỗi thời điểm chỉ một thread chạy được Python bytecode — thêm thread không tăng tốc việc nặng CPU."],
    },
    layout: "tool",
    tone: "teal",
  },
  {
    section: "Toolbox",
    kicker: "Toolbox 2 — CPU-bound",
    title: "Multiprocessing",
    body: "Thuê thêm nhà — mỗi nhà có người và dao riêng, nên nhiều người thật sự nấu cùng lúc, vượt được luật GIL.",
    keyMessage:
      "Multiprocessing vượt GIL bằng N nhà (process) trên N nhân; đổi lại mỗi nhà sắm bếp riêng (tốn RAM) và phải đóng gói đồ gửi qua lại (pickle).",
    hideKeyMessage: true,
    points: ["Tạo pool", "Chia việc", "Chạy song song", "Gom kết quả"],
    steps: [
      { title: "Tạo pool", sub: "ProcessPoolExecutor — thuê N nhà = N nhân" },
      { title: "Chia việc", sub: "mỗi nhà nhận một phần nguyên liệu" },
      { title: "Chạy song song", sub: "N nhà cùng thái, cùng nấu thật sự" },
      { title: "Gom kết quả", sub: "đóng gói món gửi về nhà chính (pickle)" },
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
        text: "API giống ThreadPoolExecutor nhưng tạo process; mỗi nhà có dao riêng nên luật GIL chỉ áp trong từng nhà.",
        example: "max_workers nên bằng số nhân CPU.",
      },
      {
        label: "Khi nào dùng",
        text: "CPU-bound: xử lý ảnh, tính toán nặng, ML, transform dữ liệu.",
        example: "Việc luôn cần dao: thái, băm, giã liên tục.",
      },
      {
        label: "Chi phí",
        text: "Mỗi nhà sắm bếp + kho riêng (tốn RAM), tạo chậm hơn; trao nguyên liệu giữa các nhà phải đóng gói (pickle).",
        example: "1 nhà vài chục MB — 100 nhà là hàng GB.",
      },
      {
        label: "Lưu ý Windows",
        text: "Code khởi chạy phải nằm trong if __name__ == '__main__' vì nhà con (process) import lại module.",
        example: "Thiếu guard này → mỗi nhà con lại thuê thêm nhà, cứ thế vô tận.",
      },
    ],
    callout: {
      type: "warning",
      title: "Tốn RAM, không chung kho",
      lines: ["Mỗi nhà (process) có kho riêng — muốn trao đồ phải gửi qua multiprocessing.Queue hoặc Manager()."],
    },
    layout: "tool",
    tone: "violet",
  },
  {
    section: "Toolbox",
    kicker: "Toolbox 3 — I/O số lượng lớn",
    title: "Asyncio",
    body: "Vẫn một người trong một nhà, nhưng cực khéo: bắc nồi lên bếp rồi quay sang bước khác, không thuê thêm ai.",
    keyMessage:
      "Asyncio là một người trông hàng nghìn nồi cùng lúc: mạnh nhất cho I/O số lượng lớn, nhưng một bước đứng yên (blocking) là cả bếp đình trệ.",
    hideKeyMessage: true,
    points: ["Event loop", "async def", "await", "gather"],
    steps: [
      { title: "Event loop", sub: "người điều phối — ai xong phần chờ thì làm tiếp" },
      { title: "async def", sub: "đánh dấu bước nấu có thể tạm nhường" },
      { title: "await", sub: "bắc nồi lên bếp rồi quay sang bước khác" },
      { title: "gather", sub: "trông nhiều nồi cùng lúc, gom khi chín" },
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
        text: "Trái tim của asyncio: quyết định bước nấu nào được làm tiếp.",
        example: "Một người trông 10 nồi: nồi nào sôi thì xử nồi đó, còn lại để đó.",
      },
      {
        label: "Cú pháp",
        text: "async def khai báo, await chờ không chặn, asyncio.gather chạy song song.",
        example: "results = await asyncio.gather(*tasks)",
      },
      {
        label: "Khi nào dùng",
        text: "I/O-bound số lượng lớn: crawler, chat server, API gateway.",
        example: "Hàng nghìn nồi đều chủ yếu là chờ (chờ sôi, chờ hầm).",
      },
      {
        label: "Cạm bẫy",
        text: "Một bước phải khuấy liên tục, không chịu nhường (blocking) là cả bếp đình trệ — thư viện cũng phải async.",
        example: "requests.get() đứng chờ → dùng aiohttp.",
      },
    ],
    callout: {
      type: "tip",
      title: "Thư viện đồng bộ sẽ giữ chân người nấu",
      lines: ["Một lời gọi đồng bộ (requests, psycopg2) chặn cả bếp — thay bằng bản async: aiohttp, asyncpg, aiomysql, aioredis."],
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
