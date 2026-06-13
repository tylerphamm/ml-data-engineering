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
    body: "Hình dung: một ngôi nhà là một process, mỗi người nấu trong nhà là một thread, mỗi bước nấu ăn là một việc cần làm.",
    keyMessage:
      "Mỗi ngôi nhà có bếp riêng, mỗi người trong nhà dùng chung bếp đó; một người làm xen kẽ nhiều bước là concurrency, nhiều người cùng nấu một lúc là parallelism.",
    hideKeyMessage: true,
    points: ["Process", "Thread", "Concurrency", "Parallelism"],
    details: [
      {
        label: "Process",
        text: "Một ngôi nhà — có bếp và kho riêng, không dùng chung với nhà khác.",
        example: "Chrome chạy ở một nhà, Word ở nhà khác, nên Chrome có sập thì Word vẫn chạy bình thường.",
      },
      {
        label: "Thread",
        text: "Một người nấu trong nhà; nhiều người ở chung một nhà thì dùng chung bếp và kho.",
        example: "Hai người trong cùng một nhà cùng mở một tủ lạnh thì lấy đồ nhanh nhưng dễ va vào nhau.",
      },
      {
        label: "Concurrency",
        text: "Một người làm nhiều bước nấu xen kẽ — không cùng lúc, mà nhảy qua lại đủ nhanh.",
        example: "Một người vừa trông nồi canh vừa thái rau, canh sắp trào thì quay lại ngó nồi.",
      },
      {
        label: "Parallelism",
        text: "Nhiều người cùng nấu thật sự một lúc — muốn vậy phải có đủ người.",
        example: "Hai người cùng vào bếp, người đun canh người chiên trứng, nên hai món xong cùng lúc.",
      },
    ],
    callout: {
      type: "insight",
      title: "Concurrency khác Parallelism",
      lines: [
        "Một người nhảy qua lại giữa các bước nấu là concurrency. Nhiều người cùng nấu một lúc là parallelism.",
        "Lưu ý ở Python: nhiều người chung một nhà vẫn không nấu song song được (luật một con dao ở phần sau); muốn song song thật phải thuê nhiều nhà.",
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
    kicker: "Chọn cái nào",
    title: "Multithreading vs Multiprocessing vs Asyncio",
    body: "Không có công cụ hoàn hảo, chỉ có công cụ hợp với từng việc.",
    keyMessage:
      "Việc phải chờ mà ít thì thêm người, việc phải chờ mà cực nhiều thì một người khéo, việc tính toán nặng thì thuê thêm nhà.",
    points: ["Loại việc", "Cùng lúc thật?", "Cái giá", "Chọn sao"],
    table: {
      columns: ["Tiêu chí", "Multithreading", "Multiprocessing", "Asyncio"],
      rows: [
        ["Hợp với việc gì", "Việc phải chờ", "Việc tính toán nặng", "Rất nhiều việc phải chờ"],
        ["Cùng lúc thật?", "Không — chỉ một con dao", "Có — nhiều nhà, nhiều dao", "Không — một người xoay cực nhanh"],
        ["Mỗi đơn vị tốn", "Mỗi người vài MB", "Mỗi nhà vài chục MB", "Mỗi việc rất nhẹ"],
        ["10.000 việc", "Cần hàng chục GB, máy nghẽn", "Không kham nổi", "Chỉ vài chục MB"],
        ["Chia sẻ dữ liệu", "Dễ — chung bếp, nhưng phải cẩn thận", "Khó — bếp riêng, phải gửi qua lại", "Rất dễ — chỉ một người"],
        ["Dễ vấp phải", "Giành nhau dữ liệu, kẹt lẫn nhau", "Tốn bộ nhớ, trao đổi rắc rối", "Một việc không nhường là kẹt hết"],
      ],
    },
    decision: [
      { cond: "Việc tính toán nặng — xử lý ảnh, mô hình, video?", pick: "Multiprocessing" },
      { cond: "Việc phải chờ, số lượng ít (dưới 100)?", pick: "Multithreading" },
      { cond: "Việc phải chờ, số lượng hàng nghìn?", pick: "Asyncio" },
    ],
    examples: [
      "Tải 50 tập tin từ mạng về thì chọn Multithreading.",
      "Thu nhỏ 10.000 tấm ảnh thì chọn Multiprocessing.",
      "Thu thập 10.000 trang web thì chọn Asyncio.",
      "Huấn luyện một mô hình thì chọn Multiprocessing.",
      "Gửi 5.000 email thì chọn Asyncio hoặc Multithreading.",
    ],
    layout: "table",
    tone: "py",
  },
  {
    section: "Mở rộng",
    kicker: "Vượt ra ngoài một máy",
    title: "Message Queue",
    body: "Khi một máy không gánh nổi nữa, ta tách bên giao việc và bên làm việc ra, nối với nhau bằng một hàng đợi ở giữa.",
    keyMessage:
      "Hàng đợi tách rời hệ thống: bên giao việc thả việc vào rồi đi tiếp, bên làm việc lấy ra xử lý dần — nhờ vậy chịu được lúc đông, không sợ mất việc, và muốn nhanh hơn chỉ cần thêm người làm.",
    hideKeyMessage: true,
    points: ["Người gửi", "Người điều phối", "Hàng đợi", "Người làm"],
    steps: [
      { title: "Người gửi", sub: "phục vụ bàn — ghi phiếu việc" },
      { title: "Người điều phối", sub: "quản lý — nhận và sắp phiếu" },
      { title: "Hàng đợi", sub: "dây chuyền phiếu — giữ theo thứ tự" },
      { title: "Người làm", sub: "bếp — lấy phiếu ra làm dần" },
    ],
    scenario: {
      title: "Tình huống: nhà hàng và dây chuyền phiếu gọi món",
      lines: [
        { mark: "bad", text: "Không có dây chuyền: phục vụ chạy thẳng vào bếp, bếp đang bận thì đứng chờ, khiến khách ngoài kia đợi mãi." },
        { mark: "good", text: "Có dây chuyền: phục vụ ghim phiếu lên dây rồi quay ra tiếp khách, bếp lấy phiếu làm dần theo thứ tự." },
        { mark: "plain", text: "Hàng đợi tin nhắn chính là cái dây chuyền phiếu gọi món đó." },
      ],
    },
    details: [
      {
        label: "Tách rời",
        text: "Bên gửi không cần biết bên làm là ai, bao nhiêu người, đang khỏe hay đang nghỉ.",
        example: "Trang web chỉ việc thả đơn vào hàng đợi rồi đi tiếp, nên web có sập thì email xác nhận vẫn được gửi đi.",
      },
      {
        label: "Chịu được lúc đông",
        text: "Lúc việc đổ về dồn dập, hàng đợi giữ lại để bên làm xử lý từ từ chứ không bị đè sập.",
        example: "Đêm khuyến mãi khách dồn về rất đông, hệ thống làm không kịp nên hàng đợi giữ phần còn lại chờ tới lượt, nhờ vậy web không sập.",
      },
      {
        label: "Không mất việc",
        text: "Nếu người làm gặp sự cố giữa chừng, việc không biến mất mà quay lại hàng đợi cho người khác làm.",
        example: "Nếu việc gửi email bị lỗi, nó sẽ quay lại hàng đợi và được thử gửi lại cho tới khi xong.",
      },
      {
        label: "Dễ mở rộng",
        text: "Muốn làm nhanh hơn thì thêm người làm, không phải sửa gì ở bên gửi.",
        example: "Khi gửi email bị chậm, bạn chỉ cần thêm vài người làm nữa, còn phía web vẫn giữ nguyên.",
      },
    ],
    layout: "tool",
    tone: "orange",
  },
  {
    section: "Mở rộng",
    kicker: "Người điều phối thông minh",
    title: "RabbitMQ",
    body: "RabbitMQ là người điều phối thông minh: nó nhận việc rồi tự đưa tới đúng người làm, làm xong và xác nhận thì việc mới biến mất.",
    keyMessage:
      "RabbitMQ giỏi chia việc: tự đưa từng việc tới đúng người, làm xong mới xóa, ai gục giữa chừng thì giao lại cho người khác — hợp để giao việc cho một đội thợ.",
    hideKeyMessage: true,
    points: ["Phân loại", "Đưa đúng chỗ", "Xác nhận", "Giao việc"],
    scenario: {
      title: "Tình huống: hệ thống đặt hàng trên mạng",
      lines: [
        { mark: "plain", text: "Khách đặt hàng, trang web gửi một tin báo vào RabbitMQ." },
        { mark: "plain", text: "Tin 'đã đặt hàng' được đưa tới người gửi email xác nhận và người trừ kho hàng." },
        { mark: "plain", text: "Tin 'đã giao hàng' lại được đưa tới người nhắn tin báo khách — mỗi loại tin tới đúng người lo việc đó." },
      ],
    },
    details: [
      {
        label: "Đưa đúng người",
        logo: "rabbitmq",
        text: "Người gửi không gửi thẳng cho thợ, mà gửi qua người điều phối; người này nhìn loại việc rồi chuyển tới đúng nhóm thợ.",
        example: "Tin 'đã đặt hàng' được chuyển cho cả người gửi email lẫn người trừ kho.",
      },
      {
        label: "Làm xong mới xóa",
        text: "Thợ làm xong mới báo 'đã xong' thì việc mới được xóa; nếu thợ gục giữa chừng, việc được giao lại cho thợ khác.",
        example: "Một thợ chết máy khi đang gửi dở, việc lập tức được giao cho thợ thứ hai gửi lại.",
      },
      {
        label: "Khi nào dùng",
        text: "Hợp để giao việc cho một đội thợ, mỗi việc chỉ một người làm là xong.",
        example: "Chẳng hạn bạn giao cho thợ gửi email, xuất báo cáo hay xử lý video, mỗi việc chỉ làm một lần rồi thôi.",
      },
      {
        label: "Một việc có thể chạy hai lần",
        text: "Vì việc được giao lại khi có trục trặc, một việc đôi khi chạy hai lần, nên người làm phải lường trước điều đó.",
        example: "Gửi nhầm hai email giống nhau thì phiền, nên thợ cần kiểm tra trước khi gửi.",
      },
    ],
    tags: [
      "Điều phối thông minh — tự đưa việc tới đúng chỗ",
      "Giao việc — mỗi việc một người làm",
      "Dễ mở rộng — thêm thợ là xong",
    ],
    layout: "broker",
    tone: "orange",
  },
  {
    section: "Mở rộng",
    kicker: "Cuốn sổ ghi sự kiện",
    title: "Kafka",
    body: "Kafka không xóa tin sau khi đọc mà ghi lại như một cuốn sổ; ai cần thì tự đọc theo nhịp của mình và có thể lật lại đọc từ đầu.",
    keyMessage:
      "Kafka như một cuốn sổ ghi sự kiện: chịu được lượng tin cực lớn, nhiều nhóm cùng đọc một nguồn một cách độc lập, và có thể lật lại quá khứ để đọc lại — hợp cho dòng sự kiện liên tục.",
    hideKeyMessage: true,
    points: ["Cuốn sổ", "Chia trang", "Đánh dấu trang", "Nhiều nhóm đọc"],
    scenario: {
      title: "Tình huống: theo dõi lượt xem của một sàn bán hàng",
      lines: [
        { mark: "plain", text: "Mỗi lần khách bấm xem một sản phẩm, một dòng được ghi vào cuốn sổ 'lượt xem'." },
        { mark: "plain", text: "Nhóm thống kê đọc để dựng báo cáo, nhóm gợi ý đọc để cập nhật gợi ý, nhóm lưu trữ đọc để cất vào kho." },
        { mark: "plain", text: "Cùng một dòng ghi, ba nhóm đọc độc lập, mỗi nhóm tự nhớ mình đã đọc tới đâu." },
      ],
    },
    details: [
      {
        label: "Cuốn sổ và các trang",
        logo: "kafka",
        text: "Mỗi loại sự kiện là một cuốn sổ; sổ được chia thành nhiều trang để nhiều người cùng ghi đọc một lúc.",
        example: "Sổ 'lượt xem' chia thành 3 trang thì ghi đọc nhanh gấp ba.",
      },
      {
        label: "Đánh dấu và đọc lại",
        text: "Mỗi dòng có số thứ tự; người đọc tự nhớ mình đọc tới dòng nào và có thể lật về đọc lại từ đầu.",
        example: "Báo cáo bị sai thì chỉ cần lật về đầu sổ, đọc lại toàn bộ của hôm qua.",
      },
      {
        label: "Nhiều nhóm cùng đọc",
        text: "Người đọc trong cùng một nhóm chia nhau các trang; nhiều nhóm khác nhau thì đọc hoàn toàn độc lập.",
        example: "Ba người trong nhóm thống kê mỗi người đọc một trang để chia việc cho nhanh.",
      },
      {
        label: "Khi nào dùng",
        text: "Hợp khi sự kiện sinh ra liên tục và nhiều nơi cùng cần đọc một nguồn.",
        example: "Chẳng hạn bạn theo dõi lượt khách bấm xem, gom nhật ký hệ thống, hay nối dữ liệu giữa nhiều bộ phận.",
      },
    ],
    tags: [
      "Chỉ ghi thêm — như một cuốn sổ",
      "Giữ lại để đọc lại — không xóa sau khi đọc",
      "Nhiều nhóm đọc — mỗi nhóm một nhịp riêng",
    ],
    layout: "broker",
    tone: "slate",
  },
  {
    section: "So sánh",
    kicker: "Chọn đúng việc",
    title: "RabbitMQ vs Kafka",
    body: "Hai công cụ, hai bài toán khác nhau.",
    keyMessage:
      "Làm xong là thôi, không cần đọc lại thì chọn RabbitMQ; cần đọc lại hoặc nhiều nơi cùng đọc thì chọn Kafka.",
    points: ["Kiểu làm", "Đọc lại được?", "Sức chứa", "Dùng cho"],
    table: {
      columns: ["Tiêu chí", "RabbitMQ", "Kafka"],
      rows: [
        ["Kiểu làm", "Tự đưa việc tới đúng thợ", "Chỉ ghi vào sổ, ai cần tự đọc"],
        ["Sau khi đọc", "Làm xong là xóa", "Vẫn giữ lại, mặc định 7 ngày"],
        ["Đọc lại được?", "Không — việc đã xóa", "Có — lật về đọc lại"],
        ["Một tin tới nhiều nơi", "Phải nối thêm cho từng nơi", "Nhiều nhóm tự đọc độc lập"],
        ["Sức chứa", "Hàng chục nghìn tin mỗi giây", "Hàng trăm nghìn đến hàng triệu tin mỗi giây"],
        ["Dùng cho", "Giao việc cho đội thợ", "Dòng sự kiện liên tục, thống kê"],
      ],
    },
    choose: [
      {
        title: "Chọn RabbitMQ khi",
        items: [
          "Bạn giao việc cho thợ: gửi email, xuất báo cáo, xử lý video",
          "Mỗi việc chỉ làm một lần rồi thôi",
          "Bạn cần tự động đưa việc tới đúng người",
          "Việc nhỏ, làm xong là xóa",
        ],
      },
      {
        title: "Chọn Kafka khi",
        items: [
          "Bạn cần đọc lại dữ liệu cũ để kiểm tra hay thống kê",
          "Nhiều bộ phận cùng đọc một nguồn dữ liệu",
          "Lượng tin cực lớn, dồn về liên tục",
          "Bạn dựng dòng sự kiện chảy qua nhiều bước",
        ],
      },
    ],
    callout: {
      type: "insight",
      title: "Câu hỏi quyết định",
      lines: ["Làm xong rồi, bạn có cần đọc lại không? Không cần thì chọn RabbitMQ, cần thì chọn Kafka."],
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
