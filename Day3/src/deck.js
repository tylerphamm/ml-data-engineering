const slideDefinitions = [
  {
    section: "Khóa học",
    kicker: "Tổng quan",
    title: "Cơ sở dữ liệu cơ bản cho người mới",
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
      "Cơ sở dữ liệu là một tập hợp dữ liệu được tổ chức có hệ thống và lưu trữ điện tử, để dễ dàng truy cập, quản lý và cập nhật.",
    keyMessage:
      "Database giúp tổ chức dữ liệu để nhiều người và nhiều chương trình cùng truy cập nhanh, chính xác và an toàn.",
    hideKeyMessage: true,
    points: ["Có tổ chức", "Lưu điện tử", "Truy cập nhanh", "Cập nhật được"],
    details: [
      {
        label: "So sánh",
        text: "Hãy tưởng tượng một thư viện, sách không vứt lung tung mà được xếp theo kệ, theo thể loại, có mã số, database chính là cái thư viện đã được sắp xếp đó.",
      },
    ],
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
      "SQL và NoSQL không thay thế nhau mà bổ sung nhau, nhiều hệ thống dùng song song cả hai theo kiểu polyglot persistence.",
    points: ["Schema", "Mở rộng", "Nhất quán", "Truy vấn"],
    details: [
      { label: "SQL", text: "Bảng và schema cố định, tuân thủ ACID, mạnh ở truy vấn phức tạp với join, mở rộng theo chiều dọc." },
      { label: "NoSQL", text: "Schema linh hoạt dạng document, key-value, column hoặc graph, mở rộng theo chiều ngang, thường eventual consistency." },
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
      { label: "Document", logo: "mongodb", text: "Document JSON linh hoạt. Lab chạy MongoDB ở :27017, soi schema bằng Compass." },
      { label: "Key-Value", logo: "redis", text: "Cặp khóa–giá trị tra cứu cực nhanh. Lab chạy Redis ở :6379, xem bằng RedisInsight." },
      { label: "Column-family", text: "Tổ chức theo cột cho khối lượng lớn, ví dụ Cassandra, HBase (chỉ giới thiệu)." },
      { label: "Graph", logo: "neo4j", text: "Nút và cạnh, tối ưu duyệt quan hệ. Lab chạy Neo4j, mở Neo4j Browser :7474." },
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
      { label: "Vector", logo: "qdrant", text: "Tìm theo tương đồng ngữ nghĩa, lõi của RAG. Lab chạy Qdrant, dashboard :6333." },
      { label: "Time-series", logo: "influxdb", text: "Dữ liệu gắn mốc thời gian như IoT, giám sát. Lab chạy InfluxDB, UI :8086." },
      { label: "In-memory", logo: "redis", text: "Dữ liệu trong RAM, truy cập tức thì cho cache và session. Lab chạy Redis :6379." },
      { label: "Search", text: "Dùng inverted index cho tìm kiếm toàn văn và phân tích log trên khối lượng dữ liệu lớn." },
    ],
    layout: "concept",
    tone: "teal",
  },
  {
    section: "Concept",
    kicker: "Khả năng mở rộng",
    title: "Scaling, sharding và replication",
    body:
      "Khi dữ liệu và lượng truy cập tăng, ta cần mở rộng hệ thống, có thể nâng cấp một máy, thêm nhiều máy, chia nhỏ dữ liệu hoặc nhân bản dữ liệu.",
    keyMessage:
      "Vertical là nâng cấp một máy, horizontal là thêm máy, sharding chia dữ liệu nhiều máy, replication nhân bản dữ liệu để sẵn sàng cao.",
    hideKeyMessage: true,
    points: ["Vertical", "Horizontal", "Sharding", "Replication"],
    details: [
      { label: "Vertical", text: "Nâng cấp một máy chủ với thêm CPU và RAM, đơn giản nhưng có giới hạn, giống xây nhà cao hơn trên một mảnh đất." },
      { label: "Horizontal", text: "Thêm nhiều máy chủ, dung lượng gần như không giới hạn, giống mua thêm nhiều mảnh đất." },
      { label: "Sharding", text: "Chia dữ liệu thành các mảnh đặt trên nhiều máy, chọn sai shard key sẽ làm một máy quá tải." },
      { label: "Replication", text: "Tạo bản sao trên nhiều máy để tăng sẵn sàng và khả năng đọc, thường dùng kèm sharding." },
    ],
    layout: "flow",
    tone: "violet",
  },
  {
    section: "SQL",
    kicker: "CRUD cơ bản",
    title: "Câu lệnh SQL cơ bản",
    body: "",
    keyMessage:
      "Bốn thao tác CRUD tương ứng bốn câu lệnh SQL, SELECT đọc, INSERT thêm, UPDATE sửa và DELETE xóa dữ liệu.",
    hideKeyMessage: true,
    points: ["SELECT", "INSERT", "UPDATE", "DELETE"],
    details: [
      { label: "CRUD", text: "Create, Read, Update, Delete là bốn thao tác cơ bản với mọi dữ liệu." },
      { label: "WHERE", text: "Mệnh đề WHERE giới hạn các hàng được tác động, nên luôn cẩn thận khi UPDATE hoặc DELETE." },
    ],
    commands: [
      { label: "SELECT", code: "SELECT * FROM SinhVien WHERE Tuoi > 20;", result: "Đọc các sinh viên có tuổi lớn hơn 20." },
      { label: "INSERT", code: "INSERT INTO SinhVien (MaSV, Ten) VALUES ('SV01', 'An');", result: "Thêm một sinh viên mới vào bảng." },
      { label: "UPDATE", code: "UPDATE SinhVien SET Tuoi = 21 WHERE MaSV = 'SV01';", result: "Cập nhật tuổi của sinh viên SV01." },
      { label: "DELETE", code: "DELETE FROM SinhVien WHERE MaSV = 'SV01';", result: "Xóa sinh viên SV01 khỏi bảng." },
    ],
    layout: "command",
    tone: "db",
  },
  {
    section: "SQL",
    kicker: "Thực hành",
    title: "Thực hành nhanh với SQLite",
    body:
      "SQLite là CSDL nhúng gọn nhẹ chạy trong một file, không cần server, rất hợp để chạy thử câu lệnh SQL đầu tiên ngay trên máy.",
    keyMessage:
      "Với SQLite bạn có thể tạo bảng, thêm dữ liệu và truy vấn chỉ bằng vài lệnh trong terminal.",
    points: ["Mở SQLite", "Tạo bảng", "Thêm dữ liệu", "Truy vấn"],
    details: [
      { label: "SQLite", text: "CSDL nhúng nằm trong một file, phổ biến trên điện thoại, trình duyệt và ứng dụng nhỏ." },
      { label: "Lưu ý", text: "Toàn bộ dữ liệu nằm trong file truong.db, xóa file là mất dữ liệu, hãy thử trong thư mục riêng." },
    ],
    commands: [
      { label: "Mở database", code: "sqlite3 truong.db", result: "Tạo hoặc mở file truong.db và vào shell SQLite." },
      {
        label: "Tạo bảng",
        code: "CREATE TABLE SinhVien (MaSV TEXT PRIMARY KEY, Ten TEXT, Tuoi INTEGER);",
        result: "Tạo bảng SinhVien với khóa chính MaSV.",
      },
      { label: "Thêm dữ liệu", code: "INSERT INTO SinhVien VALUES ('SV01', 'An', 20);", result: "Thêm một bản ghi vào bảng SinhVien." },
      { label: "Truy vấn", code: "SELECT * FROM SinhVien;", result: "Hiển thị toàn bộ sinh viên vừa thêm." },
    ],
    layout: "command",
    tone: "teal",
  },
  {
    section: "Thực hành",
    kicker: "Hướng dẫn dùng",
    title: "Truy cập và dùng lab",
    body: "",
    keyMessage:
      "Bật lab bằng một lệnh rồi kết nối từng công cụ theo đúng host, cổng và tài khoản đã chuẩn bị sẵn cho buổi học.",
    hideKeyMessage: true,
    points: ["Bật lab", "Postgres", "MongoDB", "Vẽ ER"],
    commands: [
      { label: "Bật toàn bộ lab", code: "docker compose up -d", result: "Bật mọi database và công cụ web chỉ bằng một lệnh." },
      { label: "PostgreSQL qua DBeaver", code: "localhost:5432  ·  db: truong  ·  teacher / teach123", result: "Mở bảng SinhVien để xem cột, khóa và sơ đồ ER." },
      { label: "MongoDB qua Compass", code: "mongodb://teacher:teach123@localhost:27017/?authSource=admin", result: "Mở tab Schema để tự phân tích trường và kiểu." },
    ],
    details: [
      { label: "DrawDB", text: "Vẽ ER kéo-thả tại http://localhost:3000, sơ đồ đổi tức thì và xuất ra SQL." },
      { label: "ChartDB", text: "Sinh sơ đồ từ schema tại http://localhost:8080 để đối chiếu nhanh." },
    ],
    layout: "command",
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
      { label: "Cấu trúc và nhất quán", text: "Có cấu trúc rõ và cần ACID thì chọn SQL, phi cấu trúc và chấp nhận eventual thì cân nhắc NoSQL." },
      { label: "Mặc định", text: "Bắt đầu với PostgreSQL vì bao phủ quan hệ, JSON, vector qua pgvector, time-series và geospatial trong một hệ." },
      { label: "Chi phí và đội ngũ", text: "Cân nhắc license, hosting, bảo trì và kỹ năng đội ngũ, tránh dùng quá nhiều loại CSDL không cần thiết." },
    ],
    layout: "concept",
    tone: "db",
  },
  {
    section: "Wrap-up",
    kicker: "Tổng kết",
    title: "Tổng kết và học tiếp",
    body:
      "Sau buổi này bạn đã nắm các khái niệm nền tảng về cơ sở dữ liệu, phân biệt được các loại chính và biết cách bắt đầu chọn một CSDL.",
    keyMessage:
      "Hiểu database, DBMS, SQL và NoSQL là nền tảng để đi sâu vào thiết kế, tối ưu và vận hành dữ liệu.",
    hideKeyMessage: true,
    points: ["Khái niệm", "Phân loại", "SQL CRUD", "Cách chọn"],
    checklist: [
      "Phân biệt được database và DBMS",
      "Hiểu bảng, bản ghi, trường, khóa, index và ACID",
      "Phân biệt SQL với bốn loại NoSQL",
      "Viết được câu lệnh CRUD cơ bản với SQLite",
      "Chạy thử các loại DB thật trong lab Docker",
    ],
    roadmap: ["Thiết kế ER và chuẩn hóa", "Index và tối ưu truy vấn", "Transaction và CAP", "Vector DB cho AI"],
    layout: "closing",
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
