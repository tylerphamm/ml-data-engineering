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
    kicker: "Khái niệm nền",
    title: "Tiến trình và luồng",
    body:
      "Tiến trình là một chương trình đang chạy với bộ nhớ riêng, còn luồng là dòng thực thi bên trong tiến trình và dùng chung bộ nhớ đó.",
    keyMessage:
      "Tiến trình cách ly bộ nhớ nên an toàn nhưng đắt, luồng chia sẻ bộ nhớ nên rẻ nhưng dễ giẫm chân nhau; concurrency là xen kẽ, parallelism là chạy song song thật.",
    hideKeyMessage: true,
    points: ["Tiến trình", "Luồng", "Concurrency", "Parallelism"],
    details: [
      { label: "Tiến trình", text: "Một chương trình đang chạy với bộ nhớ riêng, một tiến trình chết không kéo theo tiến trình khác, nhưng tạo mới và trao đổi dữ liệu tốn kém." },
      { label: "Luồng", text: "Nhiều dòng thực thi trong cùng tiến trình, dùng chung biến nên trao đổi nhanh, đổi lại phải cẩn thận khi cùng sửa một dữ liệu." },
      { label: "Concurrency", text: "Xen kẽ nhiều việc trên một nhân, giống một đầu bếp đảo qua lại giữa ba món đang nấu." },
      { label: "Parallelism", text: "Nhiều việc chạy cùng lúc trên nhiều nhân, giống ba đầu bếp mỗi người nấu một món." },
    ],
    layout: "flow",
    tone: "py",
  },
  {
    section: "Concept",
    kicker: "Đặc thù của CPython",
    title: "GIL — khóa toàn cục của Python",
    body:
      "GIL (Global Interpreter Lock) là một khóa trong CPython khiến tại mỗi thời điểm chỉ một luồng được chạy bytecode Python, kể cả khi máy có nhiều nhân.",
    keyMessage:
      "Vì GIL, nhiều luồng không tăng tốc code tính toán thuần; lối thoát là multiprocessing, C extension như NumPy, hoặc bản free-threading của Python — thử nghiệm từ 3.13, chính thức từ 3.14.",
    points: ["GIL", "Một luồng chạy", "Nhả khi I/O", "Lối thoát"],
    details: [
      { label: "Hệ quả", text: "Việc tính toán thuần chạy 4 luồng không nhanh hơn 1 luồng, đôi khi còn chậm hơn vì các luồng tranh nhau khóa." },
      { label: "Vẫn cứu được I/O", text: "Luồng đang chờ mạng hay đĩa sẽ nhả GIL cho luồng khác chạy, nên threading vẫn tăng tốc mạnh các việc thiên về chờ." },
      { label: "Lối thoát", text: "Tính toán nặng thì dùng multiprocessing hoặc C extension như NumPy — vốn nhả GIL khi tính; Python còn có bản free-threading gỡ hẳn GIL, thử nghiệm từ 3.13 và chính thức từ 3.14." },
    ],
    visual: "gil",
    layout: "concept",
    tone: "orange",
  },
  {
    section: "Comparison",
    kicker: "Chẩn đoán trước, tối ưu sau",
    title: "I/O-bound và CPU-bound",
    body:
      "Trước khi chọn công cụ, hãy xác định nút nghẽn: chương trình đang chờ thứ gì đó bên ngoài, hay đang vắt kiệt CPU để tính toán.",
    keyMessage:
      "I/O-bound là chờ mạng, đĩa, database; CPU-bound là tính toán nặng; mỗi loại có lời giải tăng tốc hoàn toàn khác nhau.",
    points: ["I/O-bound", "CPU-bound", "Nút nghẽn", "Chọn công cụ"],
    details: [
      { label: "I/O-bound", text: "Phần lớn thời gian là chờ: gọi API, đọc ghi file, truy vấn database. CPU rảnh trong lúc chờ. Tăng tốc bằng threading hoặc asyncio." },
      { label: "CPU-bound", text: "Phần lớn thời gian là tính: xử lý ảnh, huấn luyện mô hình, parse dữ liệu lớn. CPU chạy kịch trần. Tăng tốc bằng multiprocessing." },
      { label: "Cách nhận biết", text: "Nhìn CPU khi chạy: CPU thấp mà chương trình vẫn chậm thường là I/O-bound, CPU chạm 100% là CPU-bound." },
      { label: "Ví dụ thực tế", text: "Crawl 1000 trang web là I/O-bound, resize 1000 tấm ảnh là CPU-bound, pipeline dữ liệu thường trộn cả hai." },
    ],
    layout: "comparison",
    tone: "py",
  },
  {
    section: "Toolbox",
    kicker: "Công cụ 1 — I/O",
    title: "Multithreading — nhiều luồng cho I/O",
    body:
      "Module threading tạo nhiều luồng trong một tiến trình; khi một luồng chờ mạng hay đĩa, luồng khác tiếp tục chạy nên tổng thời gian chờ giảm mạnh.",
    keyMessage:
      "Dùng ThreadPoolExecutor cho các tác vụ I/O song song; cẩn thận race condition khi nhiều luồng cùng sửa một biến — bảo vệ bằng Lock.",
    hideKeyMessage: true,
    points: ["Tạo pool luồng", "Nộp việc", "Chờ I/O xen kẽ", "Gom kết quả"],
    details: [
      { label: "ThreadPoolExecutor", text: "Cách hiện đại để chạy N việc trên một pool luồng: executor.map(fetch, urls) — gọn hơn nhiều so với tự tạo từng Thread." },
      { label: "Khi nào dùng", text: "Gọi nhiều API, tải nhiều file, truy vấn nhiều database cùng lúc — mọi thứ thiên về chờ." },
      { label: "Race condition", text: "Hai luồng cùng đọc–sửa–ghi một biến sẽ giẫm kết quả của nhau; bảo vệ vùng găng bằng threading.Lock." },
      { label: "Giới hạn", text: "Không tăng tốc tính toán thuần vì GIL; quá nhiều luồng tốn RAM và thời gian chuyển ngữ cảnh." },
    ],
    layout: "flow",
    tone: "teal",
  },
  {
    section: "Toolbox",
    kicker: "Công cụ 2 — CPU",
    title: "Multiprocessing — nhiều tiến trình cho CPU",
    body:
      "Mỗi tiến trình con có trình thông dịch và GIL riêng, nên N tiến trình tận dụng được N nhân CPU để chạy song song thật sự.",
    keyMessage:
      "Dùng ProcessPoolExecutor cho tính toán nặng; dữ liệu trao đổi giữa các tiến trình phải pickle nên chi phí khởi tạo và truyền dữ liệu không hề rẻ.",
    hideKeyMessage: true,
    points: ["Tạo pool tiến trình", "Chia việc", "Chạy song song N nhân", "Gom kết quả"],
    details: [
      { label: "ProcessPoolExecutor", text: "API giống hệt ThreadPoolExecutor, chỉ đổi loại pool — vì vậy nên học chuẩn chung concurrent.futures." },
      { label: "Khi nào dùng", text: "Xử lý ảnh, tính đặc trưng, nén giải nén, mô phỏng số — các việc khiến CPU chạy kịch trần." },
      { label: "Chi phí ẩn", text: "Tạo tiến trình chậm hơn tạo luồng; tham số và kết quả bị pickle để gửi qua lại, dữ liệu càng to càng tốn thời gian truyền." },
      { label: "Lưu ý Windows", text: "Code khởi chạy phải nằm trong khối if __name__ == '__main__' vì tiến trình con sẽ import lại module." },
    ],
    layout: "flow",
    tone: "violet",
  },
  {
    section: "Toolbox",
    kicker: "Công cụ 3 — I/O số lượng lớn",
    title: "Asyncio — một luồng, vạn kết nối",
    body:
      "Asyncio chạy mọi thứ trên một luồng với event loop: hàm async chủ động nhường quyền tại await, nên hàng nghìn tác vụ I/O xen kẽ nhau mà không tốn luồng.",
    keyMessage:
      "async/await là concurrency hợp tác: rẻ và mở rộng tốt nhất cho I/O, nhưng chỉ cần một dòng code blocking là cả event loop đứng hình.",
    hideKeyMessage: true,
    points: ["Event loop", "async def", "await nhường quyền", "gather kết quả"],
    details: [
      { label: "Event loop", text: "Người điều phối duy nhất: tác vụ nào sẵn sàng thì chạy tiếp, tác vụ nào đang chờ I/O thì gác lại." },
      { label: "Cú pháp", text: "async def định nghĩa coroutine, await chờ mà không chặn, asyncio.gather chạy nhiều coroutine cùng lúc." },
      { label: "Khi nào dùng", text: "Hàng nghìn kết nối đồng thời: web server như FastAPI, websocket, crawler lớn, gọi LLM API hàng loạt." },
      { label: "Cái bẫy", text: "time.sleep hay requests là blocking — phải dùng asyncio.sleep, httpx, aiohttp; cả thư viện cũng phải async." },
    ],
    layout: "flow",
    tone: "py",
  },
  {
    section: "Decision",
    kicker: "Bảng quyết định",
    title: "Chọn threading, multiprocessing hay asyncio",
    body:
      "Cùng một bài toán nghìn việc, ba công cụ cho chi phí và tốc độ rất khác nhau — chọn theo loại nút nghẽn và số lượng tác vụ.",
    keyMessage:
      "I/O với vài chục tác vụ chọn threading, I/O với hàng nghìn tác vụ chọn asyncio, CPU nặng chọn multiprocessing; ba công cụ có thể phối hợp trong một hệ thống.",
    points: ["Loại nút nghẽn", "Số tác vụ", "Chi phí", "Phối hợp"],
    table: {
      columns: ["Tiêu chí", "Threading", "Multiprocessing", "Asyncio"],
      rows: [
        ["Hợp với", "I/O-bound", "CPU-bound", "I/O-bound số lượng lớn"],
        ["Song song thật", "Không, vì GIL", "Có, N nhân CPU", "Không, một luồng xen kẽ"],
        ["Chi phí mỗi tác vụ", "Trung bình, ~MB cho mỗi luồng", "Cao, tiến trình + pickle", "Rất rẻ, vài KB mỗi coroutine"],
        ["Số tác vụ hợp lý", "Chục đến trăm", "Bằng số nhân CPU", "Hàng nghìn trở lên"],
        ["Ví dụ", "Tải 50 file", "Resize 10k ảnh", "Crawler 10k trang, chat server"],
      ],
    },
    layout: "table",
    tone: "py",
  },
  {
    section: "Scale out",
    kicker: "Vượt ra ngoài một máy",
    title: "Message queue — hàng đợi tin nhắn",
    body:
      "Khi một máy không còn đủ, ta tách hệ thống thành bên gửi việc (producer) và bên xử lý (consumer), nối với nhau bằng một hàng đợi tin nhắn đứng giữa.",
    keyMessage:
      "Queue tách rời các dịch vụ: producer không phải chờ consumer, hệ chịu được lúc quá tải, lỗi thì thử lại, và scale chỉ bằng cách thêm worker.",
    hideKeyMessage: true,
    points: ["Producer", "Broker", "Queue", "Consumer"],
    details: [
      { label: "Tách rời", text: "Web nhận yêu cầu xong trả lời ngay, việc nặng như gửi mail hay tạo embedding được đẩy vào queue cho worker làm sau." },
      { label: "Chịu tải", text: "Lúc cao điểm tin nhắn xếp hàng chờ chứ không đè sập consumer, hệ thống xử lý dần khi rảnh." },
      { label: "Tin cậy", text: "Tin nhắn chỉ bị xóa khi consumer xác nhận đã xử lý xong, worker chết giữa chừng thì việc quay lại hàng đợi." },
      { label: "Scale", text: "Cần xử lý nhanh hơn chỉ việc thêm consumer, broker tự chia việc — không phải sửa code producer." },
    ],
    layout: "flow",
    tone: "orange",
  },
  {
    section: "Scale out",
    kicker: "Smart broker",
    title: "RabbitMQ — bưu điện thông minh",
    body:
      "RabbitMQ là message broker truyền thống: nhận tin từ producer vào exchange, định tuyến vào đúng queue, đẩy cho consumer và xóa tin sau khi được xác nhận.",
    keyMessage:
      "RabbitMQ giỏi điều phối tác vụ: định tuyến linh hoạt, xác nhận từng tin, thử lại khi lỗi — lựa chọn chuẩn cho task queue như gửi mail, render, OCR.",
    points: ["Exchange", "Routing", "Ack", "Task queue"],
    details: [
      { label: "Exchange và routing", logo: "rabbitmq", text: "Producer gửi vào exchange; exchange dựa trên routing key để chuyển tin tới một hay nhiều queue — kiểu direct, fanout hoặc topic." },
      { label: "Ack và retry", text: "Consumer xử lý xong mới ack; chưa ack mà chết thì tin được giao lại cho worker khác — không mất việc, nhưng một việc có thể chạy hai lần (at-least-once) nên consumer phải idempotent." },
      { label: "Dùng khi", text: "Phân việc cho đội worker: gửi email, xuất báo cáo, xử lý ảnh — xong việc và ack thì tin mới biến mất khỏi queue." },
      { label: "Hệ sinh thái", text: "Nói giao thức AMQP, thư viện pika cho Python, và là broker mặc định của Celery." },
    ],
    layout: "concept",
    tone: "orange",
  },
  {
    section: "Scale out",
    kicker: "Distributed log",
    title: "Kafka — nhật ký sự kiện phân tán",
    body:
      "Kafka không xóa tin sau khi đọc: sự kiện được ghi nối tiếp vào topic chia thành nhiều partition, consumer tự giữ offset và đọc theo nhịp của riêng mình.",
    keyMessage:
      "Kafka là sổ ghi sự kiện: throughput cực lớn, nhiều nhóm consumer cùng đọc một dữ liệu, tua lại quá khứ để replay — nền tảng cho streaming và pipeline dữ liệu.",
    points: ["Topic", "Partition", "Offset", "Consumer group"],
    details: [
      { label: "Topic và partition", logo: "kafka", text: "Topic là dòng sự kiện, chia thành nhiều partition để ghi đọc song song; thứ tự chỉ được đảm bảo trong từng partition." },
      { label: "Offset và replay", text: "Tin không bị xóa khi đọc mà giữ theo thời hạn, ví dụ 7 ngày; consumer ghi nhớ offset và có thể tua về đọc lại từ đầu." },
      { label: "Consumer group", text: "Nhiều service cùng đọc một topic độc lập với nhau; trong một group, partition được chia đều cho các consumer để scale." },
      { label: "Dùng khi", text: "Thu thập log và clickstream, đồng bộ dữ liệu giữa các hệ, event sourcing, đầu vào cho xử lý realtime." },
    ],
    layout: "concept",
    tone: "slate",
  },
  {
    section: "Comparison",
    kicker: "Chọn đúng việc",
    title: "RabbitMQ và Kafka",
    body:
      "Cả hai đều đứng giữa producer và consumer nhưng triết lý ngược nhau: RabbitMQ đẩy từng việc và xóa khi xong, Kafka lưu dòng sự kiện cho nhiều bên đọc lại.",
    keyMessage:
      "Chọn RabbitMQ cho hàng đợi tác vụ cần routing và ack từng tin; chọn Kafka cho luồng sự kiện lớn cần replay; hệ thống lớn thường dùng cả hai.",
    points: ["Mô hình", "Lưu trữ", "Throughput", "Use case"],
    details: [
      { label: "RabbitMQ", logo: "rabbitmq", text: "Smart broker, dumb consumer: broker lo định tuyến, đẩy tin và xóa sau ack. Mạnh ở task queue, độ trễ thấp, routing linh hoạt." },
      { label: "Kafka", logo: "kafka", text: "Dumb broker, smart consumer: broker chỉ ghi log, consumer tự kéo theo offset. Mạnh ở throughput, replay và nhiều người cùng đọc." },
      { label: "Chọn RabbitMQ khi", text: "Phân phối việc cho worker, mỗi việc chỉ một worker nhận: gửi mail, thanh toán, tạo embedding theo yêu cầu." },
      { label: "Chọn Kafka khi", text: "Sự kiện sinh ra liên tục và nhiều bên cùng cần: log, metrics, clickstream, CDC, feature pipeline cho ML." },
    ],
    layout: "comparison",
    tone: "py",
  },
  {
    section: "Tổng kết",
    kicker: "Trước khi vào lab",
    title: "Tổng kết và thực hành",
    body:
      "Toàn bộ code minh họa nằm trong thư mục examples: ba script concurrency chạy ngay với Python chuẩn, hai demo broker chỉ cần Docker.",
    keyMessage:
      "Chẩn đoán nút nghẽn trước, chọn công cụ sau; lý thuyết chỉ đọng lại khi tự chạy ba script concurrency và hai demo broker trong thư mục examples.",
    hideKeyMessage: true,
    points: ["Checklist", "3 script concurrency", "2 demo broker"],
    checklist: [
      "Vì sao GIL khiến threading không tăng tốc được CPU-bound",
      "Chẩn đoán I/O-bound hay CPU-bound trước khi chọn công cụ",
      "Threading cho I/O, multiprocessing cho CPU, asyncio cho vạn kết nối",
      "Queue tách rời hệ thống — tin có thể giao lại nên worker phải idempotent",
      "RabbitMQ cho task queue, Kafka cho luồng sự kiện cần replay",
    ],
    roadmap: [
      "01_cpu_vs_io.py — tự thấy GIL qua số đo thời gian",
      "02_race_condition.py — mất dữ liệu thật, và Lock cứu thế nào",
      "03_asyncio_gather.py — 20 request trong thời gian của 1",
      "rabbitmq/ — 2 consumer chia việc, tắt một worker xem ack cứu task",
      "kafka/ — 2 group cùng đọc một topic, replay từ offset 0",
    ],
    layout: "closing",
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
