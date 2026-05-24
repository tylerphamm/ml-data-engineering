export const pipelineStages = [
  {
    stage: "Lint & format",
    phase: "Code check",
    requirement: [
      "Python: Black (line-length 88) + Ruff (rule E / F / I / B), cấu hình ở pyproject.toml.",
      "JS/TS: Prettier (printWidth 100, singleQuote) + ESLint, cấu hình ở .prettierrc và .eslintrc.",
      "CI chạy chế độ --check (không auto-fix); commit hooks là tuỳ chọn.",
    ],
    failFast: "code không đúng style",
  },
  {
    stage: "Unit test",
    phase: "Code check",
    requirement: [
      "Chạy toàn bộ unit test của module logic chính.",
      "Coverage tối thiểu 60%; báo cáo coverage được upload làm artifact.",
      "Test phải deterministic — không phụ thuộc network thật hoặc thời gian thực.",
    ],
    failFast: "test fail hoặc coverage tụt dưới 60%",
  },
  {
    stage: "Build image",
    phase: "Packaging",
    requirement: [
      "Dùng multi-stage Dockerfile để tách build deps khỏi runtime.",
      "Image final ≤ 800 MB; chạy bằng user non-root.",
      "Không nhúng secret hoặc .env; build args public-only.",
    ],
    failFast: "image quá lớn, chạy root, hoặc có secret",
  },
  {
    stage: "Security scan",
    phase: "Packaging",
    requirement: [
      "Quét image bằng Trivy hoặc Grype ngay sau build.",
      "Báo cáo CVE phân loại theo mức (LOW / MEDIUM / HIGH / CRITICAL).",
      "Cho phép HIGH/CRITICAL chỉ khi có ignore-list kèm lý do trong repo.",
    ],
    failFast: "có CVE HIGH hoặc CRITICAL chưa whitelist",
  },
  {
    stage: "Push registry",
    phase: "Packaging",
    requirement: [
      "Push image đã pass scan lên ECR/GHCR/Docker Hub.",
      "Gắn 2 tag mỗi lần push: <git-sha-ngắn> và latest.",
      "Credential lấy từ secret store của CI, không hard-code.",
    ],
    failFast: "credential sai hoặc push bị từ chối",
  },
  {
    stage: "Integration test",
    phase: "Deployment",
    requirement: [
      "Spin up DB và cache phụ thuộc bằng docker compose ephemeral.",
      "Chạy smoke test bộ API thật (≥ 5 endpoint chính), assert status 2xx và payload schema.",
      "Tear down hết container trước khi job kết thúc.",
    ],
    failFast: "smoke test không trả 2xx hoặc schema sai",
  },
  {
    stage: "Deploy staging",
    phase: "Deployment",
    requirement: [
      "SSH/agent kéo image về EC2 staging và khởi động bằng docker compose.",
      "Health check /healthz phải pass trong vòng 60 giây.",
      "Log container được tail và đẩy về CloudWatch (hoặc tương đương).",
    ],
    failFast: "health check fail trong 60 giây",
  },
  {
    stage: "Manual gate",
    phase: "Deployment",
    requirement: [
      "Pipeline pause chờ approval qua GitHub Environment hoặc Jenkins input.",
      "Tối thiểu 1 reviewer khác committer phải approve.",
      "Approval timeout 24 giờ; quá hạn coi như reject.",
    ],
    failFast: "không có ai approve hoặc quá 24 giờ",
  },
  {
    stage: "Deploy prod",
    phase: "Deployment",
    requirement: [
      "Rolling update hoặc blue-green, không downtime > 5 giây.",
      "Health check prod pass trên ≥ 2 chu kỳ liên tiếp trước khi cắt traffic.",
      "Có script rollback tự động về tag cũ khi health check fail.",
    ],
    failFast: "health check prod fail hoặc rollback chạy",
  },
  {
    stage: "Notify",
    phase: "Notify",
    requirement: [
      "Gửi message tới Slack/Discord/Email khi deploy xong hoặc fail.",
      "Message ghi rõ: commit-sha, môi trường, thời lượng, link tới run.",
    ],
    failFast: "—",
  },
];

export const deliverables = [
  "Sơ đồ pipeline chỉ rõ stage, artifact đi qua từng bước và nơi lưu secret.",
  "File THREAT-MODEL.md ngắn với tối thiểu 3 mối đe doạ chính và biện pháp giảm thiểu.",
  "File ROLLBACK.md với lệnh cụ thể để rollback về tag cũ trong vài phút.",
];

export const groups = [
  {
    id: "nhom-1",
    number: 1,
    name: "Phân loại cảm xúc",
    short: "Emotion",
    tone: "violet",
    assignees: [],
    summary:
      "Hệ thống nhận diện cảm xúc từ ảnh và video bằng mô hình phân loại trên khuôn mặt, có backend HTTP và frontend web cho upload ảnh cùng livestream camera.",
    features: [
      {
        title: "Multi-modal Emotion Fusion: Khuôn mặt + Giọng nói",
        description:
          "Thêm nhánh xử lý âm thanh song song với khuôn mặt. Stream micro vào một mô hình Speech Emotion Recognition trên window 2 giây có overlap. Sau đó fusion với output video stream để cho ra một emotion score chung kèm độ tin cậy.",
        constraints: [
          "Đồng bộ timestamp audio và video frame trong khoảng vài trăm ms.",
          "Khi 1 trong 2 modality bị thiếu, pipeline vẫn trả kết quả thay vì crash.",
          "Latency end-to-end dưới 1 giây ở P95.",
        ],
      },
      {
        title: "Emotion Drift Monitoring + Online Retraining",
        description:
          "Mỗi prediction được log kèm confidence. Có dashboard theo dõi phân phối kết quả theo tuần. Khi có dấu hiệu lệch nhiều so với lúc train thì trích sample khó ra storage, mở UI cho người gắn nhãn lại và retrain.",
        constraints: [
          "Có sơ đồ data flow từ inference log đến retrain và promote, có điểm dừng (kill-switch).",
          "Schema feedback DB ghi nhận ai gắn nhãn và khi nào.",
          "Model mới chỉ promote khi accuracy trên holdout không tụt quá 3% so với bản hiện tại.",
        ],
      },
      {
        title: "Multi-tenant Analytics Dashboard",
        description:
          "Mỗi tổ chức đăng ký 1 workspace riêng. Mỗi workspace có RBAC, heatmap cảm xúc theo lớp hoặc ca, biểu đồ xu hướng theo ngày và alert khi tỷ lệ negative vượt threshold.",
        constraints: [
          "Privacy: không lưu ảnh khuôn mặt raw quá 14 ngày, chỉ giữ embedding kèm metadata.",
          "Mỗi tenant có dữ liệu riêng và có RBAC cơ bản.",
          "Có test kiểm tra 2 tenant không thấy được dữ liệu của nhau.",
        ],
      },
    ],
  },
  {
    id: "nhom-2",
    number: 2,
    name: "Hệ thống nhận diện biển số xe thông minh",
    short: "License plate",
    tone: "amber",
    assignees: [],
    summary:
      "Hệ thống detect xe và slot trống bằng object detection, có dynamic calibration theo độ phân giải camera, backend HTTP và dashboard hiển thị trạng thái bãi.",
    features: [
      {
        title: "Nhận diện biển số + Vehicle Registry + Billing",
        description:
          "Sau khi detect xe, crop biển số rồi đưa vào OCR phù hợp biển Việt Nam. Match kết quả vào DB xe đăng ký, ghi log entry và exit, tính phí gửi theo bảng giá có thể cấu hình.",
        constraints: [
          "Hậu xử lý OCR bằng whitelist ký tự và so khớp với danh sách xe đã đăng ký.",
          "Cùng xe trong nhiều khung liên tiếp chỉ tạo 1 session, tránh ghi trùng phí.",
          "Báo cáo thử nghiệm tối thiểu 10 ảnh tự chụp với điều kiện khó như ánh sáng yếu hoặc xe khuất một phần biển.",
        ],
      },
      {
        title: "Multi-camera Fusion + Cross-frame Tracking",
        description:
          "Nhiều camera quay cùng 1 bãi từ các góc khác nhau. Stream qua message queue thay vì HTTP trực tiếp. Track xuyên khung và xuyên camera, không đếm trùng khi xe di chuyển giữa các zone.",
        constraints: [
          "Có cơ chế đồng bộ frame giữa các camera và mô tả cách bù khi 1 camera mất kết nối tạm thời.",
          "Map pixel của frame về sơ đồ 2D của bãi để biết xe đang ở zone nào.",
          "Throughput tối thiểu 2 camera ở 5 FPS xử lý song song.",
        ],
      },
      {
        title: "Predictive Availability + Slot Recommendation",
        description:
          "Một model time-series dự đoán độ trống của bãi ở các mốc 15, 30 và 60 phút tới dựa trên lịch sử và thời tiết. User hỏi tới sau bao nhiêu phút thì bãi còn không, hệ thống trả về xác suất kèm slot gợi ý.",
        constraints: [
          "Feature engineering với các yếu tố thời gian và thời tiết, có giải thích lựa chọn feature.",
          "Có dashboard so sánh prediction với thực tế để theo dõi sai số theo tuần.",
          "Latency query phía user dưới 500 ms khi cache hit.",
        ],
      },
    ],
  },
  {
    id: "nhom-3",
    number: 3,
    name: "Hand Gesture",
    short: "Hand gesture",
    tone: "crimson",
    assignees: [],
    summary:
      "Hệ thống nhận diện và sử dụng cử chỉ tay từ webcam. Đề tài này không có codebase nền sẵn nên cần đầu tư nhiều hơn cho phần thiết kế trước khi triển khai.",
    features: [
      {
        title: "Vietnamese Sign Language Translator dạng streaming",
        description:
          "Stream webcam đi qua một mô hình trích keypoint cơ thể, sau đó đưa vào một temporal model để dịch sang câu tiếng Việt có ngữ pháp đúng. Có thể thêm TTS nếu còn thời gian.",
        constraints: [
          "Streaming với sliding window có overlap, không xử lý theo từng đoạn rời.",
          "Latency dưới 1 giây ở P95 từ kết thúc cử chỉ đến hiển thị câu dịch.",
          "Dataset tự thu tối thiểu 50 câu của 1 đến 2 người ký, kèm annotation guideline.",
        ],
      },
      {
        title: "Multi-user Gesture Collaborative 3D Workspace",
        description:
          "Nhiều user mỗi người 1 webcam cùng vào 1 phòng, dùng cử chỉ xoay, scale, di chuyển hoặc vẽ trên đối tượng 3D chung trong browser. Không truyền video, chỉ truyền pose keypoint giữa các client.",
        constraints: [
          "Có cơ chế xử lý khi 2 user cùng thao tác với 1 object cùng lúc.",
          "UX cho người dùng biết tay nào của ai đang điều khiển object nào.",
          "Scale test với 2 user cùng phòng, FPS tối thiểu 15.",
        ],
      },
      {
        title: "Adaptive Gesture Authentication",
        description:
          "User đăng ký gesture passphrase là chuỗi 3 đến 5 cử chỉ trong không gian 3D. Model học pattern theo người. Mỗi lần đăng nhập: kiểm tra liveness, so với template trong DB và cập nhật template khi có drift nhẹ.",
        constraints: [
          "Threat model với tối thiểu 2 kịch bản tấn công và biện pháp giảm thiểu tương ứng.",
          "Khi auth fail nhiều lần liên tiếp, có cơ chế lock và fallback an toàn.",
          "Performance một lần auth end-to-end dưới 3 giây.",
        ],
      },
    ],
  },
  {
    id: "nhom-4",
    number: 4,
    name: "Fashion Visual Search Engine",
    short: "Fashion search",
    tone: "teal",
    assignees: [],
    summary:
      "Hệ thống tìm sản phẩm thời trang bằng ảnh: sinh embedding cho ảnh và lưu vào vector database, có e-commerce features như giỏ hàng, brand dashboard và phân quyền.",
    features: [
      {
        title: "Hybrid Text + Image Search bằng mô hình đa modal",
        description:
          "Cho phép user kết hợp ảnh và text trong cùng 1 query. Swap mô hình embedding sang một mô hình đa modal, reindex toàn bộ vector database. Hỗ trợ weighting giữa image và text.",
        constraints: [
          "Có feature flag để A/B test giữa model cũ và model mới trước khi cắt hẳn sang.",
          "Latency search end-to-end dưới 1 giây ở P95.",
          "Evaluation Recall@10 trên tập đánh giá tối thiểu 50 query có ground-truth tự build.",
        ],
      },
      {
        title: "Federated Learning Personalized Recommendation",
        description:
          "Lịch sử người dùng train một model nhỏ trên thiết bị. Client gửi update đã thêm noise về server, server tổng hợp thành model toàn cục. Không lưu raw behavior trên server.",
        constraints: [
          "Model client-side có dung lượng nhỏ và chạy được trên thiết bị thông thường.",
          "Có cơ chế thêm noise vào update để bảo vệ thông tin cá nhân.",
          "Server có cơ chế kiểm tra cơ bản với client update bất thường.",
        ],
      },
      {
        title: "Inventory-aware Re-ranking + Sponsored Slot",
        description:
          "Khi user search, kết quả được re-rank theo stock, margin, brand bid, mùa và độ đa dạng thương hiệu. Brand dashboard mới hiển thị CTR, conversion theo slot và lịch sử bid.",
        constraints: [
          "Learning-to-rank cơ bản dựa trên click log đã được làm sạch.",
          "Feature store cập nhật stock, margin và bid trong vòng vài giây.",
          "Latency tổng của similarity search, rerank và auction dưới 500 ms ở P95.",
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
