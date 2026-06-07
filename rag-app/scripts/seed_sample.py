"""Nạp sẵn kho tri thức demo để dùng ngay (không phải tự nhập tài liệu).

Idempotent: mỗi lần chạy sẽ RESET kho tri thức + hội thoại của tài khoản demo rồi
nạp lại đúng bộ tài liệu dưới đây. Sau khi chạy, đăng nhập là hỏi đáp được luôn.

Yêu cầu: server đang chạy (uvicorn) và 3 database (docker compose) đã bật.
Chạy:  python scripts/seed_sample.py
Tài khoản demo:  demo@example.com / demo123456
"""
import json
import os
import urllib.error
import urllib.request

BASE = os.environ.get("RAG_BASE", "http://localhost:8000")
USER = {"email": "demo@example.com", "password": "demo123456", "display_name": "Học viên demo"}

DOCS = [
    {
        "title": "Cơ sở dữ liệu là gì",
        "text": (
            "Cơ sở dữ liệu (database) là tập hợp dữ liệu được tổ chức và lưu trữ điện tử để "
            "nhiều người và nhiều chương trình cùng truy cập nhanh, chính xác và an toàn. "
            "DBMS (hệ quản trị cơ sở dữ liệu) là phần mềm đứng giữa người dùng và dữ liệu để "
            "tạo, đọc, cập nhật, xóa và bảo vệ dữ liệu, ví dụ PostgreSQL, MySQL, MongoDB. "
            "So với Excel, database hỗ trợ truy cập đồng thời, tránh trùng lặp, đảm bảo toàn vẹn "
            "và phân quyền bảo mật."
        ),
    },
    {
        "title": "SQL và NoSQL",
        "text": (
            "SQL là cơ sở dữ liệu quan hệ: dữ liệu nằm trong bảng có schema cố định, tuân thủ "
            "giao dịch ACID, mạnh ở truy vấn phức tạp với JOIN, thường mở rộng theo chiều dọc. "
            "NoSQL có schema linh hoạt, mở rộng theo chiều ngang, hợp với dữ liệu thay đổi nhanh "
            "và quy mô lớn, thường chấp nhận eventual consistency. "
            "Dùng SQL khi cần chính xác như ngân hàng, kế toán; dùng NoSQL khi dữ liệu phi cấu "
            "trúc, cần mở rộng lớn. Nhiều hệ thống dùng song song cả hai (polyglot persistence)."
        ),
    },
    {
        "title": "Bốn loại NoSQL",
        "text": (
            "NoSQL nghĩa là Not Only SQL, gồm bốn nhóm chính. Document lưu document JSON linh hoạt "
            "như MongoDB. Key-Value lưu cặp khóa và giá trị, tra cứu cực nhanh khi biết khóa, "
            "như Redis hay DynamoDB. Column-family tổ chức theo cột cho khối lượng lớn như "
            "Cassandra. Graph lưu dạng nút và cạnh, tối ưu duyệt quan hệ như Neo4j. "
            "Chọn loại nào tùy theo cách dữ liệu được truy cập."
        ),
    },
    {
        "title": "PostgreSQL",
        "text": (
            "PostgreSQL là cơ sở dữ liệu quan hệ mã nguồn mở mạnh mẽ, lưu dữ liệu theo bảng có "
            "khóa chính, khóa ngoại và index. Nó hỗ trợ giao dịch ACID nên phù hợp làm nguồn sự "
            "thật cho tài khoản, đơn hàng, lịch sử. PostgreSQL còn hỗ trợ JSON, full-text search, "
            "geospatial và vector qua tiện ích pgvector. Người mới thường được khuyên bắt đầu với "
            "PostgreSQL trừ khi có lý do đo lường được để không dùng."
        ),
    },
    {
        "title": "Redis",
        "text": (
            "Redis là cơ sở dữ liệu key-value chạy trong bộ nhớ (RAM) nên truy cập cực nhanh và "
            "mỗi khóa có thể đặt thời gian sống TTL để tự hết hạn. Trong một ứng dụng, Redis "
            "thường làm cache để trả kết quả ngay, lưu phiên đăng nhập (session), giới hạn tốc độ "
            "(rate limit) bằng lệnh INCR nguyên tử, và hàng đợi công việc. Redis là tầng tốc độ, "
            "không phải nguồn sự thật: mất Redis thì hệ thống vẫn đúng, chỉ chậm hơn."
        ),
    },
    {
        "title": "Vector database và Qdrant",
        "text": (
            "Vector database lưu các embedding (vector số) và tìm theo độ tương đồng ngữ nghĩa "
            "thay vì khớp từ khóa. Qdrant là một vector database phổ biến: mỗi điểm gồm vector và "
            "payload đi kèm. Payload chứa các trường lọc được như document_id, owner_id, ngôn ngữ, "
            "thời gian, nhờ đó tìm kiếm có thể giới hạn phạm vi theo người dùng hay tài liệu. "
            "Vector database là thành phần lõi để truy hồi tri thức trong hệ thống RAG."
        ),
    },
    {
        "title": "RAG là gì",
        "text": (
            "RAG (Retrieval-Augmented Generation) ghép truy hồi thông tin với mô hình ngôn ngữ. "
            "Tài liệu được cắt thành đoạn (chunk), chuyển thành embedding và lưu trong vector "
            "database. Khi có câu hỏi, hệ thống tìm các đoạn gần nghĩa nhất rồi đưa vào ngữ cảnh "
            "cho mô hình sinh câu trả lời. Nhờ vậy câu trả lời bám dữ liệu thật, có trích dẫn "
            "nguồn và giảm bịa đặt."
        ),
    },
    {
        "title": "RAG Chatbot lưu dữ liệu ở đâu",
        "text": (
            "Một RAG Chatbot dùng ba kho lưu, mỗi kho một việc. PostgreSQL là nguồn sự thật: "
            "tài khoản, hội thoại, tin nhắn, trích dẫn và phản hồi của người dùng. Qdrant lưu "
            "embedding và đoạn văn bản để truy hồi theo ngữ nghĩa. Redis lo cache câu trả lời, "
            "phiên đăng nhập và giới hạn tốc độ. Đặt đúng dữ liệu vào đúng kho giúp hệ thống vừa "
            "nhanh, vừa chính xác, vừa dễ mở rộng — không phải cái gì cũng lưu thành chunk."
        ),
    },
]

SAMPLE_QUESTION = "Một RAG Chatbot nên lưu dữ liệu ở những database nào?"


def call(path, payload=None, tok=None, method=None):
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    headers = {"Content-Type": "application/json"}
    if tok:
        headers["Authorization"] = "Bearer " + tok
    req = urllib.request.Request(BASE + path, data=data, headers=headers,
                                 method=method or ("POST" if data else "GET"))
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read())


def main():
    # 1) Đăng ký (hoặc đăng nhập nếu đã có).
    try:
        auth = call("/api/auth/register", USER)
        print("registered:", USER["email"])
    except urllib.error.HTTPError as e:
        if e.code == 409:
            auth = call("/api/auth/login", {"email": USER["email"], "password": USER["password"]})
            print("logged in:", USER["email"])
        else:
            raise
    tok = auth["access_token"]

    # 2) Reset cho sạch (xoá tài liệu + hội thoại cũ của tài khoản demo).
    for d in call("/api/documents", tok=tok):
        call(f"/api/documents/{d['id']}", tok=tok, method="DELETE")
    for c in call("/api/conversations", tok=tok):
        call(f"/api/conversations/{c['id']}", tok=tok, method="DELETE")
    print("reset: đã xoá tài liệu & hội thoại cũ")

    # 3) Nạp bộ tài liệu (kho dùng chung cho mọi người).
    total = 0
    for d in DOCS:
        r = call("/api/documents", {**d, "shared": True}, tok=tok)
        total += r["chunks"]
        print("  ingest:", d["title"], "->", r["chunks"], "chunk")
    print(f"đã nạp {len(DOCS)} tài liệu, {total} chunk")

    # 4) Tạo sẵn một hội thoại mẫu để thấy ngay là hỏi đáp được.
    conv = call("/api/conversations", {}, tok=tok)
    ans = call(f"/api/conversations/{conv['id']}/messages", {"content": SAMPLE_QUESTION}, tok=tok)
    print("\nQ:", SAMPLE_QUESTION)
    print("A:", ans["message"]["content"][:240])

    print("\nXong! Đăng nhập", USER["email"], "/", USER["password"], "là dùng được ngay.")


if __name__ == "__main__":
    main()
