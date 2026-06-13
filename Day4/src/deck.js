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
        "Concurrency là luân phiên thật nhanh giữa nhiều việc trên một nhân; parallelism là chạy thật sự cùng lúc trên nhiều nhân.",
        "Lưu ý ở Python: nhiều thread trong một process vẫn không chạy Python song song được (luật một con dao ở phần sau); muốn song song thật phải dùng nhiều process.",
      ],
    },
    layout: "cards",
    tone: "py",
  },
  {
    section: "Khái niệm",
    kicker: "Đặc thù của Python",
    title: "GIL — một con dao mỗi nhà",
    body: "GIL (Global Interpreter Lock) là luật của Python: trong mỗi ngôi nhà chỉ có một con dao, nên dù có bao nhiêu người, mỗi lúc cũng chỉ một người được cầm dao để nấu.",
    keyMessage:
      "Mỗi process chỉ cho một thread chạy Python tại một thời điểm; vì thế thêm thread không giúp việc tính toán nặng, nhưng vẫn rất lợi cho việc phải chờ.",
    hideKeyMessage: true,
    points: ["Một con dao", "Vì sao có luật", "Hệ quả", "Khi nào không sao"],
    details: [
      {
        label: "Một con dao mỗi nhà",
        text: "Trong mỗi ngôi nhà chỉ có đúng một con dao; ai muốn nấu cũng phải cầm con dao đó.",
        example: "Nhà có 5 người nhưng chỉ một con dao, nên mỗi lúc chỉ một người thái được.",
      },
      {
        label: "Vì sao có luật này",
        text: "Để nhiều người dùng chung bếp mà không giẫm chân nhau, Python cho mỗi lúc chỉ một người cầm dao cho an toàn.",
        example: "Giống một bếp nhỏ chỉ kê vừa một cái thớt, nên mọi người đành phải làm lần lượt.",
      },
      {
        label: "Hệ quả",
        text: "Vì mỗi lúc chỉ một người thái được, thêm người vào nhà không làm việc tính toán nặng nhanh hơn.",
        example: "Bốn người cùng phải thái rau nhưng chỉ một con dao, nên vẫn lâu như một người làm.",
      },
      {
        label: "Khi nào không sao",
        text: "Nếu công việc phần lớn là đứng chờ, người đang chờ nhường dao cho người khác nên thêm người vẫn lợi.",
        example: "Một người chờ nồi sôi liền đưa dao cho người kia thái rau, cả bếp không ai phải rảnh tay.",
      },
    ],
    callout: {
      type: "insight",
      title: "Lối thoát",
      lines: ["Muốn nhiều người thật sự nấu cùng một lúc, hãy thuê thêm nhà — mỗi nhà có con dao riêng, đó chính là multiprocessing."],
    },
    layout: "cards",
    tone: "orange",
  },
  {
    section: "Công cụ",
    kicker: "Việc phải chờ",
    title: "Multithreading",
    body: "Thêm nhiều người vào cùng một nhà — khi một người đứng chờ (chờ nồi sôi, chờ lò nướng) thì người khác tranh thủ làm bước khác.",
    keyMessage:
      "Cách này hợp với việc phải chờ: người này chờ thì người kia làm tiếp; nhưng vì cả nhà chỉ có một con dao, nó không giúp việc tính toán nặng nhanh hơn.",
    hideKeyMessage: true,
    points: ["Gọi thêm người", "Giao việc", "Chờ thì làm tiếp", "Gom kết quả"],
    steps: [
      { title: "Gọi thêm người", sub: "gọi thêm nhiều người vào cùng một nhà" },
      { title: "Giao việc", sub: "chia các bước nấu cho từng người" },
      { title: "Chờ thì làm tiếp", sub: "ai chờ nồi sôi thì người khác thái rau" },
      { title: "Gom kết quả", sub: "dọn các món ra khi mọi người xong" },
    ],
    scenario: {
      title: "Tình huống: tải 50 tập tin từ trên mạng về",
      lines: [
        { mark: "bad", text: "Nếu làm một mình, bạn phải tải xong tập tin này mới sang tập tin kia, 50 tập tin mất khoảng 50 phút." },
        { mark: "good", text: "Nếu có 10 người cùng tải, ai phải chờ mạng thì người khác tải tiếp, nên chỉ mất khoảng 5 phút." },
      ],
    },
    details: [
      {
        label: "Gọi thêm người",
        text: "Bạn chỉ cần báo cần bao nhiêu người, Python lo phần chia việc cho họ.",
        example: "Bạn gọi thêm 10 người vào nhà để cùng nhau làm một lúc.",
      },
      {
        label: "Khi nào dùng",
        text: "Hợp với việc phải chờ bên ngoài: lấy dữ liệu trên mạng, đọc ghi tập tin, tra cứu dữ liệu.",
        example: "Chẳng hạn khi bạn gọi tới 100 nơi lấy dữ liệu hoặc đọc 20 tập tin cùng một lúc.",
      },
      {
        label: "Giành nhau dữ liệu",
        text: "Nhiều người cùng sửa một thứ một lúc thì kết quả sẽ sai; phải cho từng người làm lần lượt.",
        example: "Hai người cùng nêm muối vào một nồi mà không hỏi nhau, thế là canh mặn gấp đôi.",
      },
      {
        label: "Giới hạn của Python",
        text: "Trong một nhà, mỗi lúc chỉ một người được cầm dao; thêm người chỉ lợi khi có người đang đứng chờ.",
        example: "Khi ai cũng phải thái rau liên tục, cả nhà chỉ có một con dao nên thêm người cũng vô ích.",
      },
    ],
    callout: {
      type: "warning",
      title: "Luật một con dao mỗi nhà (GIL)",
      lines: ["Trong một ngôi nhà, mỗi lúc chỉ một người được cầm dao, nên thêm người không làm việc tính toán nặng nhanh hơn."],
    },
    layout: "tool",
    tone: "teal",
  },
  {
    section: "Công cụ",
    kicker: "Việc tính toán nặng",
    title: "Multiprocessing",
    body: "Thuê thêm nhà — mỗi nhà có người và dao riêng, nên nhiều người thật sự nấu cùng một lúc, vượt qua được luật một con dao.",
    keyMessage:
      "Cách này cho việc tính toán nặng: mỗi nhà một con dao riêng nên nhiều người cùng làm thật sự; đổi lại mỗi nhà phải sắm bếp riêng (tốn bộ nhớ) và đưa đồ qua lại giữa các nhà hơi mất công.",
    hideKeyMessage: true,
    points: ["Thuê thêm nhà", "Chia việc", "Cùng làm một lúc", "Gom kết quả"],
    steps: [
      { title: "Thuê thêm nhà", sub: "thuê số nhà bằng số nhân CPU" },
      { title: "Chia việc", sub: "mỗi nhà nhận một phần nguyên liệu" },
      { title: "Cùng làm một lúc", sub: "các nhà cùng nấu thật sự một lúc" },
      { title: "Gom kết quả", sub: "đóng gói món gửi về nhà chính" },
    ],
    scenario: {
      title: "Tình huống: thu nhỏ 10.000 tấm ảnh",
      lines: [
        { mark: "bad", text: "Nếu một người làm hết thì mất khoảng 100 phút." },
        { mark: "bad", text: "Thêm người vào cùng một nhà cũng không nhanh hơn, vì cả nhà chỉ có một con dao." },
        { mark: "good", text: "Thuê 8 nhà cùng làm, mỗi nhà lo hơn một nghìn tấm, nên chỉ còn khoảng 12 phút." },
      ],
    },
    details: [
      {
        label: "Thuê thêm nhà",
        text: "Mỗi nhà có một con dao riêng, nên luật một con dao chỉ áp trong từng nhà.",
        example: "Bạn nên thuê số nhà bằng đúng số nhân CPU của máy.",
      },
      {
        label: "Khi nào dùng",
        text: "Hợp với việc luôn phải động tay tính toán: xử lý ảnh, huấn luyện mô hình, dựng video.",
        example: "Chẳng hạn khi bạn thu nhỏ 10.000 tấm ảnh hoặc dựng một đoạn video dài.",
      },
      {
        label: "Cái giá phải trả",
        text: "Mỗi nhà phải sắm bếp và kho riêng nên tốn bộ nhớ; đưa đồ qua lại giữa các nhà phải đóng gói.",
        example: "Mỗi nhà ngốn vài chục MB, nên thuê 100 nhà thì tốn tới hàng GB bộ nhớ.",
      },
      {
        label: "Lưu ý trên Windows",
        text: "Phải đặt phần khởi chạy vào một chỗ bảo vệ ở đầu chương trình, nếu không các nhà sẽ tự nhân lên.",
        example: "Thiếu phần bảo vệ này, mỗi nhà con lại đi thuê thêm nhà, cứ thế nhân lên mãi.",
      },
    ],
    callout: {
      type: "warning",
      title: "Tốn bộ nhớ, không chung kho",
      lines: ["Mỗi nhà có kho riêng, không thấy đồ của nhau — muốn trao đổi phải gửi qua một kênh trung gian."],
    },
    layout: "tool",
    tone: "violet",
  },
  {
    section: "Công cụ",
    kicker: "Hàng vạn việc phải chờ",
    title: "Asyncio",
    body: "Vẫn một người trong một nhà, nhưng cực khéo: bắc nồi lên bếp rồi quay sang bước khác, không cần thuê thêm ai.",
    keyMessage:
      "Đây là một người trông hàng nghìn nồi cùng lúc: mạnh nhất khi có rất nhiều việc phải chờ, nhưng chỉ cần một bước đứng yên không nhường là cả bếp đình trệ.",
    hideKeyMessage: true,
    points: ["Người điều phối", "Nhận việc", "Tạm nhường", "Gom kết quả"],
    steps: [
      { title: "Người điều phối", sub: "ai xong phần chờ thì cho làm tiếp" },
      { title: "Nhận việc", sub: "đánh dấu bước nấu có thể tạm nhường" },
      { title: "Tạm nhường", sub: "bắc nồi lên bếp rồi quay sang bước khác" },
      { title: "Gom kết quả", sub: "trông nhiều nồi cùng lúc, gom khi chín" },
    ],
    scenario: {
      title: "Tình huống: thu thập 10.000 trang web cùng lúc",
      lines: [
        { mark: "bad", text: "Nếu mỗi trang cần một người thì phải có 10.000 người, không máy nào gánh nổi." },
        { mark: "good", text: "Một người cực khéo có thể trông cả 10.000 trang cùng lúc mà máy vẫn nhẹ nhàng." },
      ],
    },
    details: [
      {
        label: "Người điều phối",
        text: "Đây là người quán xuyến chung, quyết định bước nào được làm tiếp khi nó đã sẵn sàng.",
        example: "Một người trông 10 nồi cùng lúc, nồi nào sôi thì xử nồi đó trước.",
      },
      {
        label: "Cách làm",
        text: "Bạn đánh dấu việc nào có thể tạm nhường, rồi giao một loạt việc và chờ tất cả cùng xong.",
        example: "Bạn giao 50 việc một lúc rồi đợi cả 50 cùng hoàn thành.",
      },
      {
        label: "Khi nào dùng",
        text: "Hợp khi có cực nhiều việc mà phần lớn thời gian chỉ là ngồi chờ.",
        example: "Chẳng hạn một phòng chat phải giữ 50.000 người kết nối cùng một lúc.",
      },
      {
        label: "Cạm bẫy",
        text: "Một bước phải làm liên tục, không chịu nhường, sẽ khiến cả bếp đứng lại — nên mọi việc đều phải biết nhường.",
        example: "Một lệnh tải kiểu cũ bắt người nấu đứng chờ, nên phải đổi sang loại biết nhường việc.",
      },
    ],
    callout: {
      type: "tip",
      title: "Việc kiểu cũ sẽ giữ chân người nấu",
      lines: ["Chỉ một việc không chịu nhường là cả bếp đình trệ — phải đổi mọi công cụ sang loại biết nhường việc."],
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
    body: "Hàng đợi tin nhắn (message queue) là nơi trung chuyển đứng giữa: bên gửi (Producer) thả việc vào hàng đợi, bên nhận (Consumer) lấy ra xử lý dần, nên hai bên không cần biết hay chờ nhau.",
    keyMessage:
      "Hàng đợi tách rời hệ thống: bên gửi thả việc vào rồi đi tiếp, bên nhận lấy ra xử lý dần — nhờ vậy chịu được lúc đông, không sợ mất việc, và muốn nhanh hơn chỉ cần thêm người nhận.",
    hideKeyMessage: true,
    points: ["Producer", "Hàng đợi", "Consumer", "Tác dụng"],
    visual: "messagequeue",
    details: [
      {
        label: "Tách rời",
        text: "Bên gửi không cần biết bên nhận là ai, có bao nhiêu, đang khỏe hay đang nghỉ.",
      },
      {
        label: "Chịu được lúc đông",
        text: "Lúc việc đổ về dồn dập, hàng đợi giữ lại để bên nhận xử lý từ từ chứ không bị đè sập.",
      },
      {
        label: "Không mất việc",
        text: "Nếu bên nhận gặp sự cố giữa chừng, việc không biến mất mà quay lại hàng đợi cho người khác làm.",
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
