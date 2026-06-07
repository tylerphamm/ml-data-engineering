const slideDefinitions = [
  {
    section: "Khóa học",
    kicker: "Tổng quan",
    title: "Cơ sở dữ liệu cho ứng dụng AI",
    body: "",
    keyMessage:
      "Cơ sở dữ liệu là nơi lưu trữ dữ liệu có tổ chức, còn DBMS là phần mềm quản lý nó, hai nhóm lớn ngày nay là SQL quan hệ và NoSQL.",
    hideKeyMessage: true,
    hideEyebrow: true,
    points: ["Database", "SQL", "NoSQL", "Cách chọn"],
    details: [
      { label: "Mục tiêu", text: "Hiểu database là gì, phân biệt các loại chính và biết khi nào dùng loại nào." },
      { label: "Cách học", text: "Mỗi khái niệm đi kèm một phép so sánh đời thường hoặc câu lệnh SQL ngắn." },
    ],
    visual: "cover",
    layout: "cover",
    tone: "db",
  },
  {
    section: "Concept",
    kicker: "Khái niệm nền",
    title: "Cơ sở dữ liệu là gì",
    body:
      "Cơ sở dữ liệu là một tập hợp dữ liệu được tổ chức và lưu trữ điện tử, có thể dễ dàng truy cập, quản lý và cập nhật.",
    keyMessage:
      "Database giúp tổ chức dữ liệu để nhiều người và nhiều chương trình cùng truy cập nhanh, chính xác và an toàn.",
    hideKeyMessage: true,
    points: ["Có tổ chức", "Lưu điện tử", "Truy cập nhanh", "Cập nhật được"],
    visual: "library",
    layout: "concept",
    tone: "db",
  },
  {
    section: "Concept",
    kicker: "Phân biệt",
    title: "Database và DBMS khác nhau thế nào",
    body:
      "Database là chính dữ liệu đã được tổ chức, còn DBMS là phần mềm đứng giữa người dùng và dữ liệu để tạo, đọc, cập nhật, xóa và bảo vệ dữ liệu đó.",
    keyMessage:
      "Database là dữ liệu, DBMS là phần mềm quản lý dữ liệu, ví dụ DBMS gồm MySQL, PostgreSQL, Oracle và MongoDB.",
    points: ["Database", "DBMS", "Trung gian", "Bảo vệ dữ liệu"],
    details: [
      { label: "Database", text: "Là kho dữ liệu đã được tổ chức, giống kho sách trong thư viện." },
      { label: "DBMS", text: "Là người thủ thư cùng hệ thống mượn trả, bạn yêu cầu và phần mềm tìm giúp, ví dụ MySQL hoặc PostgreSQL." },
    ],
    visual: "store",
    layout: "concept",
    tone: "teal",
  },
  {
    section: "Concept",
    kicker: "Động lực",
    title: "Vì sao không chỉ dùng Excel",
    body:
      "File phẳng và Excel khó xử lý khi dữ liệu lớn và nhiều người dùng cùng lúc, trong khi database được thiết kế để nhiều chương trình và nhiều loại người dùng cùng sử dụng.",
    keyMessage:
      "Database hỗ trợ truy cập đồng thời, tránh trùng lặp, đảm bảo tính toàn vẹn, truy vấn nhanh và phân quyền bảo mật.",
    points: ["Nhiều người dùng", "Tránh trùng lặp", "Toàn vẹn", "Phân quyền"],
    details: [
      { label: "Excel và file", text: "Phù hợp dữ liệu nhỏ, một người dùng, dễ sai lệch khi nhiều người sửa cùng lúc." },
      { label: "Database", text: "Cho nhiều người và nhiều ứng dụng cùng truy cập, kiểm soát toàn vẹn và bảo mật dữ liệu." },
    ],
    visual: "table",
    layout: "concept",
    tone: "orange",
  },
  {
    section: "Concept",
    kicker: "Cấu trúc dữ liệu",
    title: "Bảng, bản ghi, trường",
    body:
      "Trong CSDL quan hệ, dữ liệu nằm trong các bảng có hàng và cột, hãy hình dung một bảng SinhVien giống một sheet Excel đã được chuẩn hóa.",
    keyMessage:
      "Bảng là cấu trúc hàng cột, mỗi bản ghi là một hàng, mỗi trường là một cột mô tả một thuộc tính.",
    hideKeyMessage: true,
    points: ["Bảng", "Bản ghi", "Trường", "Schema"],
    details: [
      { label: "Bảng", text: "Cấu trúc hàng cột giống một sheet Excel, ví dụ bảng SinhVien lưu danh sách sinh viên." },
      { label: "Bản ghi", text: "Một hàng trong bảng, tương ứng một sinh viên cụ thể với đầy đủ thuộc tính." },
      { label: "Trường", text: "Một cột trong bảng, là một thuộc tính như MaSV, Ten hoặc Tuoi." },
      { label: "Schema", text: "Bản thiết kế quy định tên bảng, tên cột và kiểu dữ liệu, SQL định trước còn NoSQL thường linh hoạt hơn." },
    ],
    layout: "flow",
    tone: "db",
  },
  {
    section: "Concept",
    kicker: "Quan hệ và tốc độ",
    title: "Khóa chính, khóa ngoại, index",
    body:
      "Khóa giúp định danh và liên kết các bảng với nhau, còn index giúp tìm kiếm nhanh mà không phải đọc toàn bộ bảng.",
    keyMessage:
      "Khóa chính định danh duy nhất mỗi bản ghi, khóa ngoại tạo quan hệ giữa các bảng, index giúp truy vấn nhanh hơn.",
    hideKeyMessage: true,
    points: ["Khóa chính", "Khóa ngoại", "Index", "Quan hệ"],
    details: [
      { label: "Khóa chính", text: "Cột định danh duy nhất mỗi bản ghi và không trùng lặp, ví dụ MaSV trong bảng SinhVien." },
      { label: "Khóa ngoại", text: "Cột trỏ tới khóa chính của bảng khác để tạo quan hệ, ví dụ DiemThi có MaSV trỏ về SinhVien." },
      { label: "Index", text: "Cấu trúc giúp tìm kiếm nhanh, giống mục lục cuối sách, tra mục lục để nhảy đến đúng trang thay vì đọc từng trang." },
      { label: "Quan hệ", text: "Liên kết giữa các bảng nhờ khóa chính và khóa ngoại, ví dụ một sinh viên có nhiều điểm thi là quan hệ một nhiều." },
    ],
    layout: "flow",
    tone: "violet",
  },
  {
    section: "Comparison",
    kicker: "Hai trường phái",
    title: "SQL và NoSQL",
    body:
      "SQL dùng schema cố định và đảm bảo nhất quán mạnh cho dữ liệu có cấu trúc, NoSQL dùng schema linh hoạt và mở rộng ngang tốt cho dữ liệu thay đổi nhanh và quy mô lớn.",
    keyMessage:
      "SQL và NoSQL không thay thế nhau mà bổ sung nhau, nhiều hệ thống dùng song song cả hai, mỗi loại lo phần việc nó giỏi nhất.",
    points: ["Schema", "Mở rộng", "Nhất quán", "Truy vấn"],
    details: [
      { label: "SQL", text: "Bảng và schema cố định, đảm bảo dữ liệu luôn chính xác, mạnh ở truy vấn phức tạp với join, mở rộng theo chiều dọc." },
      { label: "NoSQL", text: "Schema linh hoạt dạng document, key-value, column hoặc graph, mở rộng theo chiều ngang, nhất quán có thể trễ một chút." },
      { label: "Dùng SQL khi", text: "Dữ liệu có cấu trúc rõ ràng, cần giao dịch chính xác như ngân hàng, CRM hoặc kế toán." },
      { label: "Dùng NoSQL khi", text: "Dữ liệu phi cấu trúc, thay đổi nhanh, cần mở rộng lớn như mạng xã hội, IoT hoặc big data." },
    ],
    layout: "comparison",
    tone: "db",
  },
  {
    section: "Concept",
    kicker: "Phân loại NoSQL",
    title: "Bốn loại NoSQL",
    body:
      "NoSQL nghĩa là Not Only SQL, gồm bốn nhóm chính, mỗi nhóm giải một bài toán khác nhau về cách lưu và truy cập dữ liệu.",
    keyMessage:
      "Bốn loại NoSQL phổ biến là document, key-value, column-family và graph, chọn theo cách dữ liệu được truy cập.",
    hideKeyMessage: true,
    points: ["Document", "Key-Value", "Column", "Graph"],
    details: [
      { label: "Document", logo: "mongodb", text: "Lưu document JSON linh hoạt, schema không cố định, ví dụ MongoDB, CouchDB." },
      { label: "Key-Value", logo: "redis", text: "Cặp khóa–giá trị tra cứu cực nhanh khi biết khóa, ví dụ Redis, DynamoDB." },
      { label: "Column-family", text: "Tổ chức theo cột cho khối lượng lớn, ví dụ Cassandra, HBase." },
      { label: "Graph", logo: "neo4j", text: "Lưu dạng nút và cạnh, tối ưu duyệt quan hệ, ví dụ Neo4j cho mạng xã hội." },
    ],
    layout: "flow",
    tone: "violet",
  },
  {
    section: "Concept",
    kicker: "Loại chuyên biệt",
    title: "CSDL chuyên biệt cho từng bài toán",
    body:
      "Ngoài SQL và NoSQL còn nhiều loại chuyên biệt sinh ra cho một mẫu dữ liệu cụ thể, nổi bật nhất gần đây là vector database phục vụ AI.",
    keyMessage:
      "Vector, time-series, in-memory và search là các loại chuyên biệt, mỗi loại tối ưu cho một kiểu workload riêng.",
    points: ["Vector", "Time-series", "In-memory", "Search"],
    details: [
      { label: "Vector", logo: "qdrant", text: "Lưu embedding và tìm theo tương đồng ngữ nghĩa, lõi của RAG, ví dụ Qdrant, Milvus." },
      { label: "Time-series", text: "Tối ưu cho dữ liệu gắn mốc thời gian như IoT và giám sát, ví dụ InfluxDB, Prometheus." },
      { label: "In-memory", logo: "redis", text: "Dữ liệu trong RAM, truy cập tức thì cho cache và session, ví dụ Redis, Memcached." },
      { label: "Search", text: "Dùng inverted index cho tìm kiếm toàn văn và phân tích log trên khối lượng dữ liệu lớn." },
    ],
    layout: "concept",
    tone: "teal",
  },
  {
    section: "Concept",
    kicker: "Quyết định thiết kế",
    title: "Chọn CSDL cho dự án",
    body:
      "CSDL là quyết định khó thay đổi nhất trong stack vì di chuyển dữ liệu rất tốn kém, nên chọn dựa trên mẫu truy cập và workload chứ không dựa trên độ hot.",
    keyMessage:
      "Người mới nên mặc định bắt đầu với PostgreSQL trừ khi có lý do cụ thể đo lường được để không dùng.",
    points: ["Workload", "Cấu trúc", "Nhất quán", "Mở rộng"],
    details: [
      { label: "Workload", text: "Quan trọng nhất, xác định nghiêng về giao dịch hay phân tích, đọc nhiều hay ghi nhiều." },
      { label: "Cấu trúc và nhất quán", text: "Có cấu trúc rõ và cần dữ liệu thật chính xác thì chọn SQL, phi cấu trúc và chấp nhận nhất quán trễ một chút thì cân nhắc NoSQL." },
      { label: "Mặc định", text: "Bắt đầu với PostgreSQL vì bao phủ quan hệ, JSON, vector qua pgvector, time-series và geospatial trong một hệ." },
      { label: "Chi phí và đội ngũ", text: "Cân nhắc license, hosting, bảo trì và kỹ năng đội ngũ, tránh dùng quá nhiều loại CSDL không cần thiết." },
    ],
    layout: "concept",
    tone: "db",
  },
  {
    section: "AI Data Design",
    kicker: "Bài toán",
    title: "RAG Chatbot cần lưu những gì",
    body:
      "Một chatbot RAG thật không chỉ có chunk. Nó phải lưu tài khoản, lịch sử hội thoại, tri thức để truy hồi, và dữ liệu vận hành như cache hay phản hồi của người dùng.",
    keyMessage:
      "RAG Chatbot có nhiều loại dữ liệu rất khác nhau, nếu nhét tất cả vào một kho thì vừa chậm vừa sai mô hình.",
    points: ["Tài khoản", "Hội thoại", "Tri thức", "Phản hồi"],
    details: [
      { label: "Người dùng & phiên", text: "Tài khoản, mật khẩu đã hash, phiên đăng nhập — cần đúng tuyệt đối và bảo mật." },
      { label: "Hội thoại & tin nhắn", text: "Lịch sử từng lượt hỏi đáp, để xem lại và đưa ngữ cảnh cho mô hình." },
      { label: "Tri thức", text: "Tài liệu được cắt thành chunk, tạo embedding để tìm theo ngữ nghĩa." },
      { label: "Vận hành", text: "Cache câu trả lời, rate-limit, và phản hồi 👍/👎 để đánh giá chất lượng." },
    ],
    layout: "concept",
    tone: "db",
  },
  {
    section: "AI Data Design",
    kicker: "Nguyên tắc",
    title: "Mỗi database một việc",
    body:
      "Chọn kho lưu theo CÁCH dữ liệu được truy cập, không theo độ hot. RAG Chatbot dùng song song ba kho, mỗi kho mạnh ở một việc.",
    keyMessage:
      "Postgres giữ sự thật quan hệ, Qdrant lo truy hồi ngữ nghĩa, Redis lo tốc độ và điều phối — ba việc khác nhau.",
    points: ["Quan hệ", "Vector", "Key-value", "Theo truy cập"],
    details: [
      { label: "PostgreSQL — quan hệ", text: "Nguồn sự thật: dữ liệu cần JOIN, ràng buộc toàn vẹn và lưu chính xác tuyệt đối." },
      { label: "Qdrant — vector", logo: "qdrant", text: "Truy hồi theo độ tương đồng ngữ nghĩa, có lọc theo metadata." },
      { label: "Redis — key-value", logo: "redis", text: "Cache, phiên, rate-limit: tra cứu cực nhanh trong RAM, tự hết hạn theo TTL." },
      { label: "Chọn theo mẫu truy cập", text: "Hỏi: cần JOIN? cần gần nghĩa? cần nhanh và tạm? Câu trả lời quyết định kho lưu." },
    ],
    layout: "comparison",
    tone: "db",
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
