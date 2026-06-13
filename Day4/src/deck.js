const slideDefinitions = [
  {
    section: "Khóa học",
    kicker: "Tổng quan",
    title: "High-Performance Python",
    body: "",
    keyMessage:
      "Python chỉ nhanh khi chọn đúng cách chạy nhiều việc: thêm người cho việc phải chờ, thuê thêm nhà cho việc tính toán nặng, một người khéo cho hàng vạn việc nhỏ, và hàng đợi khi vượt ra ngoài một máy.",
    hideKeyMessage: true,
    hideEyebrow: true,
    points: ["GIL", "Multithreading", "Multiprocessing", "Asyncio", "Message Queue"],
    details: [
      { label: "Mục tiêu", text: "Hiểu vì sao Python chậm ở đâu, tăng tốc bằng cách nào, và khi nào phải tách hệ thống ra bằng hàng đợi." },
      { label: "Cách học", text: "Mỗi ý đều đi kèm một phép so sánh đời thường để bạn hình dung được ngay." },
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
    title: "GIL",
    body: "GIL (Global Interpreter Lock) là một khóa trong Python khiến mỗi thời điểm chỉ cho một thread chạy, dù process có nhiều thread trong đó.",
    keyMessage:
      "Mỗi process chỉ cho một thread chạy Python tại một thời điểm; vì thế thêm thread không giúp việc tính toán nặng, nhưng vẫn rất lợi cho việc phải chờ.",
    hideKeyMessage: true,
    points: ["GIL là gì", "Vì sao có", "Hệ quả", "Khi nào không sao"],
    details: [
      {
        label: "GIL là gì",
        text: "Mỗi thời điểm chỉ một thread được chạy bytecode Python, dù trong process có bao nhiêu thread đi nữa.",
        example: "Tám thread cùng chạy Python thực ra phải xếp hàng, lần lượt từng cái một.",
      },
      {
        label: "Vì sao có",
        text: "GIL giúp Python quản lý bộ nhớ đơn giản và an toàn khi nhiều thread dùng chung dữ liệu.",
        example: "Đổi lại sự an toàn đó, các thread không thể cùng chạy Python song song.",
      },
      {
        label: "Hệ quả",
        text: "Việc tính toán nặng chạy nhiều thread không nhanh hơn một thread, vì vẫn phải xếp hàng qua GIL.",
        example: "Bốn thread cùng tính toán nặng vẫn chậm gần như chỉ một thread.",
      },
      {
        label: "Khi nào không sao",
        text: "Khi thread đang chờ các tác vụ I/O, nó nhả GIL cho thread khác chạy, nên multithreading vẫn khá có lợi khi process phải chờ.",
        example: "Trong lúc một thread chờ mạng, các thread khác vẫn tranh thủ chạy tiếp.",
      },
    ],
    callout: {
      type: "insight",
      title: "Lối thoát",
      lines: ["Muốn tính toán song song trong Python, chúng ta hãy dùng nhiều process (multiprocessing) vì mỗi process có GIL riêng."],
    },
    layout: "cards",
    tone: "orange",
  },
  {
    section: "Công cụ",
    kicker: "Việc phải chờ",
    title: "Multithreading",
    body: "Nhiều thread cùng chạy trong một process; khi một thread phải chờ I/O thì thread khác tranh thủ chạy tiếp.",
    keyMessage:
      "Cách này hợp với việc phải chờ (I/O): thread này chờ thì thread kia chạy; nhưng vì GIL, nó không giúp việc tính toán nặng nhanh hơn.",
    hideKeyMessage: true,
    points: ["Tạo nhóm thread", "Giao việc", "Chờ thì chạy tiếp", "Gom kết quả"],
    steps: [
      { title: "Tạo nhóm thread", sub: "tạo sẵn một nhóm nhiều thread" },
      { title: "Giao việc", sub: "chia các tác vụ cho từng thread" },
      { title: "Chờ thì chạy tiếp", sub: "thread này chờ mạng thì thread khác chạy" },
      { title: "Gom kết quả", sub: "thu kết quả khi tất cả xong" },
    ],
    scenario: {
      title: "Tình huống: tải 50 tập tin từ trên mạng về",
      lines: [
        { mark: "bad", text: "Nếu làm tuần tự, phải tải xong tập tin này mới sang tập tin kia, 50 tập tin mất khoảng 50 phút." },
        { mark: "good", text: "Dùng 10 thread cùng tải, thread nào chờ mạng thì thread khác tải tiếp, nên chỉ mất khoảng 5 phút." },
      ],
    },
    details: [
      {
        label: "Tạo nhóm thread",
        text: "Bạn chỉ cần báo số thread cần dùng, Python lo phần chia tác vụ cho chúng.",
        example: "Một nhóm 10 thread cùng xử lý 10 tác vụ một lúc.",
      },
      {
        label: "Khi nào dùng",
        text: "Hợp với việc phải chờ bên ngoài: gọi mạng, đọc ghi tập tin, truy vấn dữ liệu.",
        example: "Chẳng hạn khi bạn gọi 100 API hoặc đọc 20 tập tin cùng một lúc.",
      },
      {
        label: "Giành nhau dữ liệu",
        text: "Nhiều thread cùng sửa một biến một lúc thì kết quả sẽ sai; phải cho chúng làm lần lượt bằng khóa.",
        example: "Hai thread cùng cộng vào một biến đếm có thể làm mất một lần cộng.",
      },
      {
        label: "Giới hạn — GIL",
        text: "Vì GIL, mỗi lúc chỉ một thread chạy Python; thêm thread chỉ lợi khi có thread đang chờ.",
        example: "Việc tính toán nặng chạy nhiều thread vẫn không nhanh hơn.",
      },
    ],
    callout: {
      type: "warning",
      title: "Giới hạn của GIL",
      lines: ["Vì GIL, mỗi thời điểm chỉ một thread chạy bytecode Python — thêm thread không làm việc tính toán nặng nhanh hơn."],
    },
    layout: "tool",
    tone: "teal",
  },
  {
    section: "Công cụ",
    kicker: "Việc tính toán nặng",
    title: "Multiprocessing",
    body: "Tạo nhiều process riêng, mỗi process có GIL riêng, nên chúng thật sự chạy song song trên nhiều nhân CPU.",
    keyMessage:
      "Cách này cho việc tính toán nặng: mỗi process có GIL riêng nên chạy song song thật; đổi lại tốn bộ nhớ và phải truyền dữ liệu qua lại giữa các process.",
    hideKeyMessage: true,
    points: ["Tạo nhiều process", "Chia việc", "Chạy song song", "Gom kết quả"],
    steps: [
      { title: "Tạo process", sub: "tạo số process bằng số nhân CPU" },
      { title: "Chia việc", sub: "mỗi process nhận một phần dữ liệu" },
      { title: "Chạy song song", sub: "các process chạy thật sự cùng lúc" },
      { title: "Gom kết quả", sub: "thu kết quả từ các process" },
    ],
    scenario: {
      title: "Tình huống: thu nhỏ 10.000 tấm ảnh",
      lines: [
        { mark: "bad", text: "Nếu xử lý tuần tự thì mất khoảng 100 phút." },
        { mark: "bad", text: "Dùng nhiều thread cũng không nhanh hơn, vì GIL chỉ cho một thread chạy Python mỗi lúc." },
        { mark: "good", text: "Dùng 8 process trên máy 8 nhân, mỗi process lo hơn một nghìn tấm, nên chỉ còn khoảng 12 phút." },
      ],
    },
    details: [
      {
        label: "Mỗi process một GIL",
        text: "Mỗi process có trình thông dịch và GIL riêng, nên nhiều process chạy Python song song thật sự.",
        example: "Nên đặt số process bằng đúng số nhân CPU của máy.",
      },
      {
        label: "Khi nào dùng",
        text: "Hợp với việc luôn phải tính toán: xử lý ảnh, huấn luyện mô hình, dựng video.",
        example: "Chẳng hạn khi bạn thu nhỏ 10.000 tấm ảnh hoặc dựng một đoạn video dài.",
      },
      {
        label: "Cái giá phải trả",
        text: "Mỗi process tốn bộ nhớ riêng; dữ liệu truyền qua lại giữa các process phải đóng gói nên mất thời gian.",
        example: "Mỗi process ngốn vài chục MB, nên 100 process tốn tới hàng GB bộ nhớ.",
      },
      {
        label: "Lưu ý trên Windows",
        text: "Phải đặt phần khởi chạy trong khối bảo vệ ở đầu chương trình, nếu không process con sẽ tự nhân lên.",
        example: "Thiếu khối bảo vệ này, mỗi process con lại tạo thêm process, cứ thế lặp mãi.",
      },
    ],
    callout: {
      type: "warning",
      title: "Tốn bộ nhớ, không chung dữ liệu",
      lines: ["Mỗi process có bộ nhớ riêng, không thấy dữ liệu của nhau — muốn trao đổi phải gửi qua một kênh trung gian."],
    },
    layout: "tool",
    tone: "violet",
  },
  {
    section: "Công cụ",
    kicker: "Hàng vạn việc phải chờ",
    title: "Asyncio",
    body: "Chạy mọi việc trên một thread duy nhất với một vòng điều phối (event loop); gặp chỗ phải chờ thì việc đó nhường lượt cho việc khác.",
    keyMessage:
      "Asyncio xử lý hàng nghìn việc chờ trên một thread; mạnh nhất khi có rất nhiều việc phải chờ, nhưng chỉ một việc không chịu nhường là cả vòng điều phối đứng lại.",
    hideKeyMessage: true,
    points: ["Vòng điều phối", "Đánh dấu việc", "Tạm nhường", "Gom kết quả"],
    steps: [
      { title: "Vòng điều phối", sub: "việc nào xong phần chờ thì được chạy tiếp" },
      { title: "Đánh dấu việc", sub: "đánh dấu việc có thể tạm nhường" },
      { title: "Tạm nhường", sub: "gặp chỗ chờ thì nhường lượt cho việc khác" },
      { title: "Gom kết quả", sub: "chạy nhiều việc cùng lúc, gom khi xong" },
    ],
    scenario: {
      title: "Tình huống: thu thập 10.000 trang web cùng lúc",
      lines: [
        { mark: "bad", text: "Nếu mỗi trang cần một thread thì phải có 10.000 thread, không máy nào gánh nổi." },
        { mark: "good", text: "Asyncio chỉ dùng một thread mà vẫn theo dõi cả 10.000 trang cùng lúc, máy vẫn nhẹ nhàng." },
      ],
    },
    details: [
      {
        label: "Vòng điều phối",
        text: "Đây là bộ điều phối trung tâm, quyết định việc nào được chạy tiếp khi nó đã sẵn sàng.",
        example: "Một thread theo dõi 10 yêu cầu mạng, yêu cầu nào có dữ liệu về thì xử lý trước.",
      },
      {
        label: "Cách làm",
        text: "Bạn đánh dấu việc nào có thể tạm nhường, rồi giao một loạt việc và chờ tất cả cùng xong.",
        example: "Bạn giao 50 yêu cầu mạng một lúc rồi đợi cả 50 cùng trả về.",
      },
      {
        label: "Khi nào dùng",
        text: "Hợp khi có cực nhiều việc mà phần lớn thời gian chỉ là chờ I/O.",
        example: "Chẳng hạn một chat server phải giữ 50.000 kết nối cùng một lúc.",
      },
      {
        label: "Cạm bẫy",
        text: "Một việc tính toán liên tục, không chịu nhường, sẽ chặn cả vòng điều phối — nên mọi thư viện đều phải hỗ trợ bất đồng bộ.",
        example: "Một lệnh tải kiểu cũ (đồng bộ) sẽ chặn cả vòng điều phối, phải đổi sang thư viện bất đồng bộ.",
      },
    ],
    callout: {
      type: "tip",
      title: "Thư viện đồng bộ sẽ chặn vòng điều phối",
      lines: ["Chỉ một việc không chịu nhường là cả vòng điều phối đứng lại — phải đổi mọi thư viện sang loại bất đồng bộ."],
    },
    layout: "tool",
    tone: "py",
  },
  {
    section: "So sánh",
    kicker: "Góc nhìn ML/AI",
    title: "Multithreading vs Multiprocessing vs Asyncio",
    body: "",
    keyMessage:
      "Nhìn từ góc ML/AI: chờ mạng vừa phải thì Multithreading, tính toán nặng thì Multiprocessing, phục vụ API hay gọi API số lượng lớn thì Asyncio.",
    points: ["Loại task", "GIL", "Overhead", "Chọn cho ML/AI"],
    table: {
      columns: ["Tiêu chí", "🧵 Multithreading", "🏭 Multiprocessing", "⚡ Asyncio"],
      rows: [
        ["Loại task ML/AI", "I/O-bound (vừa phải)", "CPU-bound / chuẩn bị dữ liệu", "I/O-bound (siêu nhiều) / serving"],
        ["Ảnh hưởng GIL", "✅ Bị chặn (chỉ xen kẽ)", "❌ Vượt qua (đa nhân thật)", "✅ Bị chặn (1 thread duy nhất)"],
        ["Overhead", "Trung bình (tạo thread)", "Nặng (copy bộ nhớ mỗi process)", "Rất nhẹ (coroutine ~2KB)"],
        ["Chia sẻ dữ liệu", "Dễ (cùng bộ nhớ)", "Khó (Queue / Shared Memory)", "Rất dễ (cùng thread)"],
        ["Khi nào chọn trong ML/AI?", "🌐 Gọi API LLM vừa phải (batch < 100), truy vấn DB lấy feature", "🧠 Train CPU (XGBoost, Sklearn), resize/augment ảnh, PyTorch DataLoader", "🚀 Phục vụ API (FastAPI), gọi 10K+ API LLM, crawl dữ liệu huấn luyện"],
      ],
    },
    layout: "table",
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
    body: "RabbitMQ là người điều phối thông minh: Producer gửi tin vào Exchange, Exchange theo luật định tuyến đưa tin tới đúng Queue, rồi Consumer lấy ra xử lý.",
    keyMessage:
      "RabbitMQ giỏi chia việc: tự đưa từng tin tới đúng queue, làm xong mới xóa, ai gục giữa chừng thì giao lại — hợp để giao việc cho một đội worker.",
    hideKeyMessage: true,
    points: ["Exchange", "Định tuyến", "Queue", "Dùng khi"],
    visual: "rabbitmq",
    details: [
      {
        label: "Exchange định tuyến",
        text: "Producer gửi qua Exchange; Exchange nhìn loại tin để đưa tới đúng Queue — kiểu Direct, Topic hay Fanout (gửi cho tất cả).",
      },
      {
        label: "Không mất việc",
        text: "Worker xử lý xong mới xác nhận (ACK); lỡ hỏng giữa chừng thì tin được giao lại cho worker khác.",
      },
      {
        label: "Mỗi việc một worker",
        text: "Một tin chỉ do một worker xử lý rồi xong — hợp để giao việc: gửi email, xuất báo cáo, xử lý ảnh.",
      },
      {
        label: "Dùng khi",
        text: "Cần giao việc cho đội worker, định tuyến linh hoạt và chắc chắn không mất việc.",
      },
    ],
    layout: "diagram",
    tone: "orange",
  },
  {
    section: "Mở rộng",
    kicker: "Cuốn sổ ghi sự kiện",
    title: "Kafka",
    body: "Kafka ghi luồng sự kiện phân tán: Producer ghi tin vào Topic, mỗi Topic chia thành nhiều Partition trải trên các Broker; Consumer đọc theo offset và đọc lại được.",
    keyMessage:
      "Kafka giữ lại sự kiện cho nhiều nhóm cùng đọc và đọc lại được; chịu được lượng tin cực lớn — hợp cho dòng sự kiện liên tục và phân tích.",
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
        text: "Mỗi tin có số thứ tự (offset); Consumer tự nhớ đã đọc tới đâu và có thể tua lại đọc từ đầu.",
      },
      {
        label: "Nhiều nhóm cùng đọc",
        text: "Nhiều nhóm Consumer đọc cùng một Topic độc lập với nhau; trong một nhóm thì chia nhau các Partition.",
      },
      {
        label: "Dùng khi",
        text: "Dòng sự kiện lớn, nhiều nơi cùng đọc, cần đọc lại và throughput cực cao.",
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
      "RabbitMQ giao việc rồi xóa và định tuyến linh hoạt; Kafka giữ lại sự kiện cho nhiều nơi cùng đọc, đọc lại được và throughput cực cao.",
    points: ["Triết lý", "Replay", "Routing", "Throughput"],
    table: {
      columns: ["Tiêu chí", "🐇 RabbitMQ", "📡 Kafka"],
      rows: [
        ["Triết lý thiết kế", "Smart Broker — Consumer chỉ việc nhận", "Dumb Broker — Consumer tự kéo dữ liệu"],
        ["Vòng đời message", "Xóa sau khi ACK (giao xong là hết)", "Giữ lại theo retention (mặc định 7 ngày)"],
        ["Replay (đọc lại)", "❌ Không — đã đọc là mất", "✅ Có — đổi offset, đọc lại từ đầu"],
        ["Mô hình Consumer", "1 message do 1 worker xử lý", "Nhiều nhóm đọc cùng một message"],
        ["Routing", "Linh hoạt (Exchange: Direct, Topic, Fanout)", "Đơn giản (theo Topic & Partition)"],
        ["Throughput", "~10K – 50K msg/giây", "~100K – 1M+ msg/giây"],
        ["Thứ tự message", "Đảm bảo trong 1 Queue", "Đảm bảo trong 1 Partition"],
      ],
    },
    layout: "table",
    tone: "py",
  },
  {
    section: "So sánh",
    kicker: "Khi nào dùng",
    title: "RabbitMQ vs Kafka — khi nào dùng?",
    body: "",
    keyMessage:
      "Chọn RabbitMQ để giao việc cho worker xử lý một lần; chọn Kafka cho dòng sự kiện lớn, nhiều nơi cùng đọc và cần đọc lại.",
    points: ["RabbitMQ", "Kafka", "Khi nào dùng"],
    visual: "rvk",
    choose: [
      {
        title: "Dùng RabbitMQ khi",
        items: [
          "Giao việc cho worker — mỗi việc xử lý đúng một lần (gửi email, render video).",
          "Cần định tuyến phức tạp, đưa một tin tới nhiều hàng đợi.",
          "Xử lý xong là xong, không cần đọc lại dữ liệu cũ.",
        ],
      },
      {
        title: "Dùng Kafka khi",
        items: [
          "Có dòng sự kiện lớn, nhiều hệ thống cùng đọc (clickstream, IoT).",
          "Cần đọc lại (replay) — chạy lại pipeline từ đầu trên cùng tập dữ liệu.",
          "Throughput cực cao, đổ dữ liệu xuống kho dữ liệu (Data Lake).",
        ],
      },
    ],
    layout: "showcase",
    tone: "slate",
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
