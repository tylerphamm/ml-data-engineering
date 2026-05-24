export const pipelineStages = [
  {
    stage: "Lint & format",
    phase: "Code check",
    requirement: [
      "Tìm hiểu các lint framework để kiểm tra format trước khi setup CI.",
      "Python: dùng Ruff.",
      "JavaScript / TypeScript: dùng Prettier.",
    ],
    failFast: "format code bị lỗi",
  },
  {
    stage: "Unit test",
    phase: "Code check",
    requirement: [
      "Python: dùng pytest cho module xử lý chính.",
      "JavaScript / TypeScript: dùng Jest cho module xử lý chính.",
      "Có tối thiểu 5 test cho phần xử lý quan trọng nhất; pipeline báo lỗi ngay nếu có 1 test không pass.",
    ],
    failFast: "có test không pass",
  },
  {
    stage: "Build image",
    phase: "Packaging",
    requirement: [
      "Build image bằng Dockerfile đặt ở root repo.",
      "Đặt tên image rõ ràng theo dạng <tên-app>:<tag>.",
      "Không copy file .env hoặc password vào image.",
    ],
    failFast: "lệnh docker build báo lỗi",
  },
  {
    stage: "Security scan",
    phase: "Packaging",
    requirement: [
      "Dùng Trivy quét image và in output ra log CI.",
      "Chỉ dừng pipeline khi có CVE mức CRITICAL; HIGH chỉ cảnh báo.",
    ],
    failFast: "có CVE CRITICAL",
  },
  {
    stage: "Push registry",
    phase: "Packaging",
    requirement: [
      "Push image lên Docker Hub.",
      "Đăng nhập bằng secret lấy từ CI, không hard code username và password.",
    ],
    failFast: "đăng nhập hoặc push không thành công",
  },
  {
    stage: "Integration test",
    phase: "Deployment",
    requirement: [
      "Dùng docker compose để chạy app cùng database và cache giả lập.",
      "Gọi 1-2 endpoint chính bằng curl, kiểm tra trả về status 200.",
      "Dọn container sau khi test xong.",
    ],
    failFast: "endpoint không trả status 200",
  },
  {
    stage: "Deploy staging",
    phase: "Deployment",
    requirement: [
      "SSH vào server, pull image mới từ registry.",
      "Khởi động app bằng docker compose.",
      "Mở URL staging trong browser, thấy app hiển thị bình thường là pass.",
    ],
    failFast: "không truy cập được URL staging",
  },
  {
    stage: "Manual gate",
    phase: "Deployment",
    requirement: [
      "Pipeline tạm dừng và chờ duyệt qua GitHub Environment (Required reviewers).",
    ],
    failFast: "không có ai bấm duyệt",
  },
  {
    stage: "Deploy prod",
    phase: "Deployment",
    requirement: [
      "SSH vào server, pull image mới rồi khởi động lại bằng docker compose.",
      "Có script rollback đổi tag image về bản trước và khởi động lại app.",
      "Gọi 1 endpoint sau khi up xong để xác nhận app chạy bình thường.",
    ],
    failFast: "endpoint prod không trả status 200 sau deploy",
  },
];

export const deliverables = [
  "Sơ đồ pipeline chỉ rõ stage và nơi lưu secret.",
  "File DESIGN.md mô tả các thành phần chính của hệ thống và công nghệ sử dụng.",
];

export const groups = [
  {
    id: "nhom-1",
    number: 1,
    name: "Driver Drowsiness Detector",
    short: "Drowsiness",
    tone: "violet",
    assignees: [],
    summary:
      "Xây dựng hệ thống phát hiện tài xế buồn ngủ qua webcam. Tính các chỉ số EAR và MAR để xác định trạng thái buồn ngủ. Có backend HTTP và frontend web hiển thị cảnh báo realtime.",
    features: [
      {
        title: "Realtime Drowsiness Detection via WebSocket",
        description:
          "Frontend mở webcam và stream frame về backend qua WebSocket. Backend dùng face landmark để tính EAR (độ mở mắt) và MAR (mức ngáp), kết hợp với góc đầu. Trả về trạng thái alert / drowsy / sleeping kèm độ tin cậy.",
        constraints: [
          "Latency từ lúc client gửi frame đến lúc nhận trạng thái dưới 500 ms.",
          "Define và implement các lỗi có thể xảy ra trong quá trình phát hiện khuôn mặt và tính landmark.",
          "Frontend hiển thị trạng thái + confidence; UI hoạt động mượt mà.",
        ],
      },
      {
        title: "Trip History + Alert Dashboard",
        description:
          "Backend ghi log mỗi sự kiện cảnh báo vào database theo trip_id. Dashboard hiển thị timeline cảnh báo trong 1 chuyến đi, tổng số lần buồn ngủ và biểu đồ severity theo thời gian.",
        constraints: [
          "Database lưu tối thiểu 7 ngày log, có index theo timestamp.",
          "Có endpoint export CSV cho 1 chuyến đi tuỳ chọn.",
        ],
      },
      {
        title: "Multi-driver Account + Custom Alert Threshold",
        description:
          "Mỗi driver có account riêng. Hỗ trợ tuỳ chỉnh threshold EAR/MAR theo từng người vì mỗi người có đặc điểm khuôn mặt khác nhau. Khi cảnh báo, hệ thống phát sound + hiển thị visual alert.",
        constraints: [
          "Đăng nhập bằng email + password.",
          "Driver chỉnh sửa được threshold EAR/MAR và loại sound cảnh báo.",
          "Có chế độ test cho driver thử cảnh báo trước khi dùng thật.",
        ],
      },
    ],
  },
  {
    id: "nhom-2",
    number: 2,
    name: "Receipt OCR + Expense Tracker",
    short: "Receipts",
    tone: "amber",
    assignees: [],
    summary:
      "Xây dựng hệ thống quản lý chi tiêu cá nhân bằng cách upload ảnh hoá đơn. Dùng OCR pretrained để trích thông tin. Có backend HTTP và frontend web cho user xem lịch sử và thống kê.",
    features: [
      {
        title: "Upload Receipt + Auto-extract Fields",
        description:
          "User upload ảnh hoá đơn. Backend chạy OCR trên ảnh, parse text để trích 3 trường chính: tổng tiền, ngày, tên cửa hàng. Trả kết quả structured về frontend cho user verify và chỉnh sửa trước khi save vào database.",
        constraints: [
          "Hỗ trợ ảnh JPG/PNG, tối đa 5 MB.",
          "Trích được tối thiểu 3 trường: tổng tiền, ngày, tên cửa hàng với accuracy ≥70% trên 20 hoá đơn test.",
          "User edit được kết quả trích trước khi save.",
        ],
      },
      {
        title: "Expense History + Personal Analytics Dashboard",
        description:
          "Mỗi user có lịch sử hoá đơn đã upload. Dashboard hiển thị tổng chi tiêu theo tháng, biểu đồ theo category. Category do user gán tay hoặc auto-gán theo tên cửa hàng.",
        constraints: [
          "Hỗ trợ ≥5 category mặc định: food, transport, shopping, bills, other.",
          "Có biểu đồ pie theo category và line chart theo tháng.",
          "Export báo cáo CSV cho range thời gian tuỳ chọn.",
        ],
      },
      {
        title: "Monthly Budget + Alerts",
        description:
          "User set budget hàng tháng cho từng category. Backend tự cộng dồn chi tiêu và so với budget. Khi chi tiêu vượt ngưỡng cảnh báo, hệ thống gửi notification cho user.",
        constraints: [
          "Budget setting per category per month, user chỉnh sửa được bất cứ lúc nào.",
          "Cảnh báo khi chi tiêu vượt 50%, 80% và 100% budget.",
          "Có endpoint trả về status budget của 1 user trong tháng hiện tại.",
        ],
      },
    ],
  },
  {
    id: "nhom-3",
    number: 3,
    name: "Gesture DJ Mixer",
    short: "DJ mixer",
    tone: "crimson",
    assignees: [],
    summary:
      "Xây dựng hệ thống mixer nhạc điều khiển bằng cử chỉ tay qua webcam, dùng MediaPipe Hands pretrained để track keypoint. Có backend xử lý gesture realtime và frontend Web Audio API phát mix nhạc theo cử chỉ.",
    features: [
      {
        title: "Volume + Tempo Control by Gesture",
        description:
          "User dùng cử chỉ tay điều khiển volume (kéo tay lên/xuống) và tempo (kéo tay trái/phải). Hỗ trợ 2 track song song, mỗi tay điều khiển 1 track. Frontend phát nhạc realtime qua Web Audio API.",
        constraints: [
          "Tối thiểu 2 cử chỉ rõ ràng: control volume, control tempo.",
          "Latency từ gesture đến thay đổi âm thanh dưới 200 ms.",
          "User upload file MP3 hoặc WAV vào từng track.",
        ],
      },
      {
        title: "Track Switching + Crossfade",
        description:
          "Mỗi DJ có playlist gồm nhiều track. User chuyển track bằng cử chỉ vẫy phải/trái. Khi switch, có hiệu ứng crossfade mượt giữa 2 track.",
        constraints: [
          "Hỗ trợ playlist ≥5 track upload sẵn.",
          "Crossfade duration điều chỉnh được từ 1 đến 5 giây.",
          "UI hiển thị track đang chơi và waveform realtime.",
        ],
      },
      {
        title: "Mix Recording + Share",
        description:
          "User record session mix của mình thành file audio và lưu vào account. Có trang lịch sử các mix đã record, play lại trong browser. Mỗi mix có thể share qua link công khai.",
        constraints: [
          "Record được tối thiểu 5 phút mix mà không drop frame audio.",
          "File mix lưu dưới dạng MP3 hoặc WAV.",
          "Share link có thể access mà không cần đăng nhập.",
        ],
      },
    ],
  },
  {
    id: "nhom-4",
    number: 4,
    name: "Recipe Search by Food Photo",
    short: "Recipe search",
    tone: "teal",
    assignees: [],
    summary:
      "Xây dựng hệ thống tìm công thức nấu ăn bằng ảnh món ăn, dùng CLIP pretrained sinh embedding và lưu vào vector database. Backend match ảnh với công thức trong catalog. Có frontend web cho user search, browse và save favorite công thức.",
    features: [
      {
        title: "Search Recipe by Food Photo",
        description:
          "User chụp hoặc upload ảnh món ăn. Backend sinh embedding ảnh qua CLIP, tìm top-k công thức similar trong vector database. Trả về list công thức kèm ảnh thumbnail, tên món và độ similarity.",
        constraints: [
          "Vector database đã index sẵn ≥500 công thức có ảnh.",
          "Latency search end-to-end dưới 1 giây ở P95.",
          "Mỗi công thức trả về có đủ: tên, ảnh, nguyên liệu, hướng dẫn nấu.",
        ],
      },
      {
        title: "Favorite Recipes + Personal Cookbook",
        description:
          "User save công thức vào favorite. Trang cookbook cá nhân hiển thị các công thức đã save, group theo category. User add note riêng cho mỗi công thức.",
        constraints: [
          "Hỗ trợ ≥5 category mặc định, user tạo thêm category được.",
          "Note có thể edit và xoá.",
          "Có endpoint export cookbook ra PDF.",
        ],
      },
      {
        title: "Weekly Meal Planner + Shopping List",
        description:
          "User kéo thả các công thức đã save vào lịch tuần (7 ngày, 3 bữa). Hệ thống tự sinh shopping list bằng cách aggregate nguyên liệu từ tất cả công thức trong tuần.",
        constraints: [
          "UI calendar 7x3, hỗ trợ drag-drop công thức vào ô.",
          "Shopping list group nguyên liệu trùng, cộng dồn số lượng.",
          "Export meal plan ra PDF hoặc gửi qua email.",
        ],
      },
    ],
  },
];

export const sections = [
  { id: "ci-cd", label: "CI/CD", kind: "cicd" },
  ...groups.map((group) => ({
    id: group.id,
    label: `${group.number}. ${group.short ?? group.name}`,
    kind: "group",
    groupId: group.id,
  })),
];
