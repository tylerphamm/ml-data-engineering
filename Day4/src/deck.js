const slideDefinitions = [
  {
    section: "Khóa học",
    kicker: "Tổng quan",
    title: "High-Performance Python",
    body: "",
    keyMessage:
      "Python chỉ nhanh khi chọn đúng cách chạy nhiều việc: multithreading cho việc phải chờ, multiprocessing cho việc tính toán nặng, asyncio cho hàng vạn việc I/O, và message queue khi vượt ra ngoài một máy.",
    hideKeyMessage: true,
    hideEyebrow: true,
    points: ["GIL", "Multithreading", "Multiprocessing", "Asyncio", "Message Queue"],
    details: [
      { label: "Mục tiêu", text: "Hiểu vì sao Python chậm ở đâu, tăng tốc bằng cách nào, và khi nào phải tách hệ thống ra bằng hàng đợi." },
      { label: "Cách học", text: "Mỗi công cụ đi kèm khái niệm gọn, khi nào dùng, và dẫn chứng thực tế." },
    ],
    visual: "cover",
    layout: "cover",
    tone: "py",
  },
  {
    section: "Khái niệm",
    kicker: "Nền tảng",
    title: "Processes and Threads",
    body: "",
    keyMessage:
      "Process là một chương trình đang chạy với vùng nhớ riêng; thread là luồng thực thi bên trong process và dùng chung vùng nhớ đó; concurrency là xen kẽ, parallelism là chạy thật sự cùng lúc.",
    hideKeyMessage: true,
    points: ["Process", "Thread", "Concurrency", "Parallelism"],
    details: [
      {
        label: "Process",
        text: "Một chương trình đang chạy, có vùng nhớ riêng tách biệt, không dùng chung với chương trình khác.",
        example: "Chrome và Word là hai process riêng, nên Chrome có treo thì Word vẫn chạy bình thường.",
      },
      {
        label: "Thread",
        text: "Một luồng thực thi bên trong process; nhiều thread trong cùng một process dùng chung vùng nhớ với nhau.",
        example: "Trong Chrome, một thread lo tải dữ liệu còn một thread lo vẽ giao diện, cả hai dùng chung bộ nhớ của tab đó.",
      },
      {
        label: "Concurrency",
        text: "Xử lý nhiều việc xen kẽ nhau, không nhất thiết cùng lúc, mà luân phiên đủ nhanh để các việc cùng tiến triển.",
        example: "Điện thoại vừa tải ứng dụng vừa phát nhạc; một nhân xử lý luân phiên nhanh nên bạn thấy như chạy cùng lúc.",
      },
      {
        label: "Parallelism",
        text: "Thực sự làm nhiều việc cùng một lúc — cần nhiều nhân CPU để chạy song song thật sự.",
        example: "Máy 8 nhân chia video thành 8 phần, mỗi nhân nén một phần cùng lúc nên xong nhanh hơn hẳn.",
      },
    ],
    callout: {
      type: "insight",
      title: "Concurrency khác Parallelism",
      lines: [
        "Concurrency là chạy nhiều việc cùng lúc trên một nhân; parallelism là chạy thật sự cùng lúc trên nhiều nhân.",
        "Lưu ý ở Python: nhiều thread trong một process vẫn không chạy Python song song được; muốn song song thật phải dùng nhiều process.",
      ],
    },
    layout: "cards",
    tone: "py",
  },
  {
    section: "Khái niệm",
    kicker: "Đặc thù của Python",
    title: "GIL — khóa toàn cục của Python",
    body: "",
    keyMessage:
      "GIL khiến mỗi thời điểm chỉ một thread chạy bytecode Python; threading không tăng tốc việc tính toán nặng nhưng vẫn lợi cho việc phải chờ.",
    hideKeyMessage: true,
    points: ["Khái niệm", "Ảnh hưởng", "Lối thoát"],
    details: [
      {
        label: "Khái niệm",
        text: "GIL là khóa toàn cục trong Python: mỗi thời điểm chỉ cho một thread chạy bytecode Python, dù process có nhiều thread đi nữa.",
      },
      {
        label: "Ảnh hưởng",
        text: "Việc tính toán nặng chạy nhiều thread không nhanh hơn vì các thread phải xếp hàng qua GIL; nhưng khi thread chờ I/O thì nó nhả GIL, nên multithreading vẫn lợi cho việc phải chờ.",
      },
    ],
    callout: {
      type: "insight",
      title: "Lối thoát",
      lines: ["Muốn tính toán song song thật sự, hãy dùng multiprocessing — mỗi process có GIL riêng."],
    },
    layout: "cards",
    tone: "orange",
  },
  {
    section: "Công cụ",
    kicker: "Việc phải chờ",
    title: "Multithreading",
    body: "",
    keyMessage:
      "Nhiều thread trong một process; hợp cho việc phải chờ I/O, nhưng vì GIL không tăng tốc việc tính toán nặng.",
    hideKeyMessage: true,
    points: ["Khái niệm", "Khi nào dùng", "Giới hạn"],
    details: [
      {
        label: "Khái niệm",
        text: "Nhiều thread cùng chạy trong một process và dùng chung bộ nhớ; khi một thread phải chờ I/O thì thread khác tranh thủ chạy tiếp.",
      },
      {
        label: "Khi nào dùng",
        text: "Khi việc phần lớn là chờ bên ngoài: gọi mạng/API, đọc ghi tập tin, truy vấn dữ liệu.",
        example: "Chẳng hạn tải 50 tập tin hoặc gọi 100 API cùng một lúc.",
      },
    ],
    callout: {
      type: "warning",
      title: "Giới hạn — GIL",
      lines: ["Vì GIL, multithreading không làm việc tính toán nặng nhanh hơn — việc nặng CPU hãy dùng multiprocessing."],
    },
    layout: "cards",
    tone: "teal",
  },
  {
    section: "Công cụ",
    kicker: "Việc tính toán nặng",
    title: "Multiprocessing",
    body: "",
    keyMessage:
      "Nhiều process, mỗi cái một GIL riêng nên chạy song song thật trên nhiều nhân; hợp cho việc tính toán nặng, đổi lại tốn bộ nhớ.",
    hideKeyMessage: true,
    points: ["Khái niệm", "Khi nào dùng", "Cái giá"],
    details: [
      {
        label: "Khái niệm",
        text: "Tạo nhiều process riêng, mỗi process có trình thông dịch và GIL riêng, nên chúng thật sự chạy song song trên nhiều nhân CPU.",
      },
      {
        label: "Khi nào dùng",
        text: "Khi việc luôn phải tính toán nặng: xử lý ảnh, huấn luyện mô hình, dựng video.",
        example: "Chẳng hạn resize 10.000 tấm ảnh trên máy 8 nhân.",
      },
    ],
    callout: {
      type: "warning",
      title: "Cái giá phải trả",
      lines: ["Mỗi process tốn bộ nhớ riêng và phải đóng gói dữ liệu khi truyền qua lại giữa các process."],
    },
    layout: "cards",
    tone: "violet",
  },
  {
    section: "Công cụ",
    kicker: "Hàng vạn việc phải chờ",
    title: "Asyncio",
    body: "",
    keyMessage:
      "Một thread với vòng điều phối xử lý hàng nghìn việc chờ; hợp cho rất nhiều việc I/O, nhưng một việc không nhường là cả vòng điều phối đứng lại.",
    hideKeyMessage: true,
    points: ["Khái niệm", "Khi nào dùng", "Cạm bẫy"],
    details: [
      {
        label: "Khái niệm",
        text: "Chạy mọi việc trên một thread duy nhất với một vòng điều phối; gặp chỗ phải chờ thì việc đó nhường lượt cho việc khác.",
      },
      {
        label: "Khi nào dùng",
        text: "Khi có cực nhiều việc mà phần lớn thời gian chỉ là chờ I/O: crawler, chat server, API gateway.",
        example: "Chẳng hạn crawl 10.000 trang web hoặc giữ 50.000 kết nối cùng lúc.",
      },
    ],
    callout: {
      type: "tip",
      title: "Cạm bẫy",
      lines: ["Một việc đồng bộ không chịu nhường sẽ chặn cả vòng điều phối — mọi thư viện phải hỗ trợ bất đồng bộ."],
    },
    layout: "cards",
    tone: "py",
  },
  {
    section: "Mở rộng",
    kicker: "Vượt ra ngoài một máy",
    title: "Message Queue",
    body: "Hàng đợi tin nhắn là nơi trung chuyển các event, trong đó bên gửi (Producer) sẽ để các task vào hàng đợi, bên nhận (Consumer) lấy ra xử lý dần các task đó.",
    keyMessage:
      "Hàng đợi tách rời hệ thống: bên gửi thả việc vào rồi đi tiếp, bên nhận lấy ra xử lý dần — nhờ vậy chịu được lúc đông, không sợ mất việc, và muốn nhanh hơn chỉ cần thêm người nhận.",
    hideKeyMessage: true,
    points: ["Producer", "Hàng đợi", "Consumer", "Tác dụng"],
    visual: "messagequeue",
    details: [
      {
        label: "Decouple hai bên service",
        text: "Bên gửi không cần biết bên nhận là ai, có bao nhiêu task đang được thực thi, đang được chạy tốt hay service bên đó đã dừng.",
      },
      {
        label: "Nâng cao khả năng chịu tải",
        text: "Những lúc có các task được gửi về bên nhận liên tục, hàng đợi giữ lại để bên nhận xử lý từ từ để tránh bị sập hệ thống.",
      },
      {
        label: "Không làm mất task chưa xử lý",
        text: "Nếu bên nhận gặp sự cố giữa chừng, task không biến mất mà được giữ lại trong hàng đợi.",
      },
      {
        label: "Dễ mở rộng",
        text: "Muốn làm nhanh hơn thì thêm người nhận, không phải sửa gì ở bên gửi.",
      },
    ],
    layout: "diagram",
    tone: "orange",
  },
  {
    section: "Mở rộng",
    kicker: "Người điều phối thông minh",
    title: "RabbitMQ",
    body: "RabbitMQ là công nghệ điều phối thông minh: Producer gửi tin vào Exchange, Exchange theo luật định tuyến đưa tin tới đúng Queue, rồi Consumer lấy ra xử lý.",
    keyMessage:
      "RabbitMQ giỏi chia việc: tự đưa từng tin tới đúng queue, làm xong mới xóa, ai gục giữa chừng thì giao lại — hợp để giao việc cho một đội worker.",
    hideKeyMessage: true,
    points: ["Exchange", "Định tuyến", "Queue", "Dùng khi"],
    visual: "rabbitmq",
    details: [
      {
        label: "Exchange định tuyến",
        text: "Producer gửi qua Exchange, Exchange sẽ nhìn loại event được nhận để đưa tới đúng 1 trong các queue như Direct, Topic hay Fanout",
      },
      {
        label: "Tránh bị mất task",
        text: "Worker sau khi xử lý xong mới xác nhận đã hoàn thành công việc, lỡ task bị fail thì task sẽ được giao lại cho worker khác.",
      },
      {
        label: "Mỗi việc một worker",
        text: "Một task chỉ do một worker xử lý rồi xong, có thể phân task gửi email, xuất báo cáo, xử lý ảnh cho các worker khác nhau.",
      },
      {
        label: "Dùng khi",
        text: "Cần giao việc cho đội worker, định tuyến linh hoạt và giảm thiểu khả năng làm mất task.",
      },
    ],
    layout: "diagram",
    tone: "orange",
  },
  {
    section: "Mở rộng",
    kicker: "Cuốn sổ ghi sự kiện",
    title: "Kafka",
    body: "Kafka ghi luồng sự kiện phân tán: Producer ghi task vào trong các Topic, mỗi Topic chia thành nhiều Partition trải trên các Broker; Consumer đọc theo offset và đọc lại được.",
    keyMessage:
      "Kafka giữ lại sự kiện cho nhiều nhóm cùng đọc và đọc lại được các sự kiện, chịu được lượng tin cực lớn, phù hợp cho dòng sự kiện streaming và analytics.",
    hideKeyMessage: true,
    points: ["Topic", "Partition", "Offset", "Dùng khi"],
    visual: "kafka",
    details: [
      {
        label: "Topic & Partition",
        text: "Mỗi Topic chia thành nhiều Partition để ghi đọc song song, trải trên nhiều Broker trong Cluster.",
      },
      {
        label: "Offset & đọc lại",
        text: "Mỗi task hoặc event đều có số thứ tự (offset), Consumer có thể tự lưu lại offset đã đọc tới đâu và có thể đọc từ đầu.",
      },
      {
        label: "Nhiều nhóm cùng đọc",
        text: "Nhiều nhóm Consumer đọc cùng một Topic độc lập với nhau; trong một nhóm thì chia nhau các Partition.",
      },
      {
        label: "Dùng khi",
        text: "Dòng sự kiện lớn, liên tục, nhiều consumer cùng đọc dữ liệu, cần đọc lại và throughput cực cao.",
      },
    ],
    layout: "diagram",
    tone: "slate",
  },
  {
    section: "So sánh",
    kicker: "Bảng so sánh",
    title: "RabbitMQ vs Kafka",
    body: "",
    keyMessage:
      "Xử lý xong là xóa thì chọn RabbitMQ; cần lưu lại, đọc lại được và tốc độ cực cao thì chọn Kafka.",
    points: ["Mục đích", "Lưu trữ", "Tốc độ", "Dùng khi nào"],
    table: {
      columns: ["Tiêu chí", "RabbitMQ", "Kafka"],
      rows: [
        ["Mục đích chính", "Chuyển tin nhắn từ người gửi đến người nhận nhanh nhất.", "Lưu luồng sự kiện để nhiều người cùng đọc và phân tích."],
        ["Cách hoạt động", "Trạm trung tâm thông minh: tự tìm đường, đẩy tin tới đúng người nhận.", "Trạm bị động: chỉ ghi chép dữ liệu, người nhận tự đến lấy."],
        ["Lưu trữ dữ liệu", "Xóa ngay sau khi người nhận xác nhận đã lấy.", "Giữ lại theo thời gian (vd 7 ngày), kể cả khi đã đọc xong."],
        ["Cách gửi tin", "Rất linh hoạt: gửi 1 người, 1 nhóm, hoặc theo điều kiện.", "Đơn giản: gửi vào một Topic, ai quan tâm thì vào lấy."],
        ["Thứ tự tin nhắn", "Khó giữ đúng thứ tự khi nhiều người cùng nhận.", "Giữ đúng thứ tự trong cùng một luồng."],
        ["Đọc lại dữ liệu", "Không thể (tin đã bị xóa khỏi hệ thống).", "Đọc lại thoải mái (dữ liệu vẫn còn lưu trữ)."],
        ["Tốc độ xử lý", "Vừa phải (~chục nghìn tin/giây).", "Siêu tốc (~hàng triệu tin/giây)."],
        [
          "Dùng khi nào?",
          "• Giao tiếp giữa các hệ thống (A gửi, B xử lý)\n• Xử lý xong là xóa, không cần lưu vết\n• Tác vụ nền: gửi email, tính hóa đơn, đẩy thông báo",
          "• Lưu lại mọi thứ đã xảy ra để phân tích sau\n• Xử lý dữ liệu siêu tốc, liên tục (stream)\n• Real-time: theo dõi hành vi user, ghi log, thống kê",
        ],
      ],
    },
    layout: "table",
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
