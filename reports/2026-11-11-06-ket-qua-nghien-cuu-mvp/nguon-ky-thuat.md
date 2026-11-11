# Nguồn kỹ thuật — NC-07/NC-09

- Phụ lục sử dụng: [PWA và vận hành tenant](pwa-va-van-hanh-tenant.vi.md).
- **Ngày thực sự tra cứu các nguồn dưới đây: 11/11/2026.** Ngày này không phải ngày xuất bản hay ngày thử nghiệm.
- Phương pháp: đọc tài liệu API/engine, dữ liệu tương thích của Web Platform DX, tiêu chuẩn HTTP và hướng dẫn trực tiếp của đơn vị phát triển/cung cấp; đối chiếu với B005/R005. Các mục là diễn giải ngắn, không chép nguyên văn.
- Đây là nguồn về khả năng/cơ chế, không thay thế phép thử sản phẩm, đánh giá bảo mật, báo giá hoặc khảo sát NPP. Nguồn PostgreSQL/AWS không ghi nhận việc dự án đã chọn các nền tảng đó.
- Các URL `current` PostgreSQL được truy cập trả nội dung nhãn phiên bản **18**; ghi rõ phiên bản này để việc kiểm tra lại không phụ thuộc mã phiên bản “mới nhất”. Không suy từ banner phát hành sang phiên bản sản xuất phù hợp dự án.

## T01 — MDN: Background Synchronization API

- URL: <https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API>.
- Ngày kiểm tra: 11/11/2026. Vị trí: `Limited availability`, `Concepts and usage`.
- Hỗ trợ: API trì hoãn tác vụ qua Service Worker khi có kết nối; không có độ phủ đồng đều.
- Giới hạn: không quy định SLA gửi lệnh của ứng dụng, không chứng minh đồng bộ sau khóa/tắt máy.

## T02 — Web Platform DX: Background sync

- URL: <https://web-platform-dx.github.io/web-features-explorer/features/background-sync/>.
- Ngày kiểm tra: 11/11/2026. Vị trí: `Browser support`.
- Hỗ trợ: dữ liệu liệt kê Chrome/Chrome Android/Edge hỗ trợ; Firefox/Firefox Android/Safari/iOS chưa hỗ trợ.
- Giới hạn: ma trận nền tảng, không phải thử máy pilot; không suy rằng mọi browser mang nhãn Chrome đều dùng cùng engine ở mọi hệ điều hành.

## T03 — WebKit: Updates to Storage Policy

- URL: <https://webkit.org/blog/14403/updates-to-storage-policy/>.
- Ngày kiểm tra: 11/11/2026. Xuất bản: 10/08/2023. Vị trí: `Storage Quota`, `Storage Eviction`, `Storage API`.
- Hỗ trợ: quota/eviction và persistence của WebKit; Home Screen là một yếu tố xét cấp.
- Giới hạn: chính sách engine tại phạm vi nêu trong bài; không bảo đảm dung lượng thực hoặc chống mất dữ liệu do người dùng/mất máy. Không dùng tỷ lệ quota làm thông số dung lượng MVP.

## T04 — MDN và Web Platform DX: Service Worker

- URL API: <https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API>.
- URL tương thích: <https://web-platform-dx.github.io/web-features-explorer/features/service-workers/>.
- Ngày kiểm tra: 11/11/2026. Vị trí: MDN `Service worker concepts and usage`, `Download, install and activate`; DX `Status`/`Browser support`.
- Hỗ trợ: yêu cầu secure context và cơ chế worker/cache; khả năng nền tảng được hỗ trợ rộng.
- Giới hạn: không chứng minh ứng dụng đã cache đủ hoặc worker sẽ chạy liên tục. Hai URL là hai tài liệu riêng, cùng phục vụ một hàng ma trận.

## T05 — MDN và Web Platform DX: IndexedDB

- URL API: <https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API>.
- URL tương thích: <https://web-platform-dx.github.io/web-features-explorer/features/indexeddb/>.
- Ngày kiểm tra: 11/11/2026. Vị trí: MDN `Key concepts and usage`; DX `Browser support`.
- Hỗ trợ: kho đối tượng có transaction, phạm vi origin; dữ liệu tương thích các họ browser chính.
- Giới hạn: cùng origin không phải cách ly tenant; có API không bảo đảm journal của dự án bền vững.

## T06 — MDN: IDBTransaction

- URL: <https://developer.mozilla.org/en-US/docs/Web/API/IDBTransaction>.
- Ngày kiểm tra: 11/11/2026. Vị trí: `Transaction failures`, `Firefox durability guarantees`.
- Hỗ trợ: transaction có thể lỗi vì quota/I/O/crash; tài liệu nêu giới hạn durability trên Firefox.
- Giới hạn: không suy cùng hành vi chi tiết cho mọi engine; không lấy `complete` làm bằng chứng backup hay cam kết không mất điện.

## T07 — MDN: StorageManager.persist()

- URL: <https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist>.
- Ngày kiểm tra: 11/11/2026. Vị trí: mô tả phương thức, `Return value`, `Exceptions`.
- Hỗ trợ: yêu cầu persistence trả boolean; browser có thể không chấp nhận.
- Giới hạn: cần kiểm tra thực tế mỗi môi trường; persistence không thay thế bản sao trên server.

## T08 — MDN: Navigator.onLine

- URL: <https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine>.
- Ngày kiểm tra: 11/11/2026. Vị trí: phần mô tả heuristic kết nối.
- Hỗ trợ: online có thể chỉ phản ánh mạng cục bộ; không đủ kết luận server truy cập được.
- Giới hạn: không phải giao thức kiểm tra sức khỏe backend.

## T09 — Google/web.dev: The service worker lifecycle

- URL: <https://web.dev/articles/service-worker-lifecycle>.
- Ngày kiểm tra: 11/11/2026. Vị trí: `The intent`, `Skip the waiting phase`.
- Hỗ trợ: ép worker mới có thể trộn với trang phiên bản cũ; cần thiết kế tương thích nâng cấp.
- Giới hạn: hướng dẫn nền tảng, không xác nhận migration của dự án; không chọn Workbox/framework.

## T10 — MDN: Using IndexedDB

- URL: <https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB>.
- Ngày kiểm tra: 11/11/2026. Vị trí: `Version changes while a web app is open in another tab`.
- Hỗ trợ: kết nối cũ có thể chặn nâng phiên bản; cần xử lý `onblocked`/đóng kết nối.
- Giới hạn: ví dụ API không phải thuật toán chuyển schema nghiệp vụ hay bằng chứng queue không mất.

## T11 — IETF RFC 9110: HTTP Semantics

- URL: <https://www.rfc-editor.org/rfc/rfc9110.html#name-idempotent-methods>.
- Ngày kiểm tra: 11/11/2026. Vị trí: §9.2.2 `Idempotent Methods`.
- Hỗ trợ: phân biệt hiệu ứng idempotent và điều kiện retry phương thức không mặc định idempotent.
- Giới hạn: không quy định command receipt, hash, thời gian giữ khóa hoặc chống trùng hóa đơn của dự án; đó là hợp đồng đề nghị bổ sung.

## T12 — PostgreSQL 18: Transactions

- URL đã đọc: <https://www.postgresql.org/docs/current/tutorial-transactions.html>.
- Ngày kiểm tra: 11/11/2026. Vị trí: §3.4, giải thích atomicity/commit.
- Hỗ trợ: nhóm nhiều cập nhật trong một transaction và khả năng quan sát sau commit.
- Giới hạn: không tạo transaction chung với browser/provider; mức bảo vệ thực tế còn phụ thuộc cấu hình T17.

## T13 — PostgreSQL 18: Transaction Isolation

- URL đã đọc: <https://www.postgresql.org/docs/current/transaction-iso.html>.
- Ngày kiểm tra: 11/11/2026. Vị trí: §13.2; bảng các anomaly và `Serializable Isolation Level`.
- Hỗ trợ: mức isolation khác nhau; xung đột có thể yêu cầu retry transaction.
- Giới hạn: nguồn cơ chế, không tự chọn mức isolation hay chứng minh ứng dụng không bán vượt tồn.

## T14 — AWS Prescriptive Guidance: Transactional outbox pattern

- URL: <https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html>.
- Ngày kiểm tra: 11/11/2026. Vị trí: `Intent`, `Issues and considerations`, `Implementation`.
- Hỗ trợ: xử lý khoảng hở dual write DB–thông điệp; consumer vẫn phải xử lý duplicate/order.
- Giới hạn: hướng dẫn nhà cung cấp; không chứng minh exactly-once end-to-end, không chốt AWS hoặc microservices.

## T15 — PostgreSQL 18: pg_dump

- URL đã đọc: <https://www.postgresql.org/docs/current/app-pgdump.html>.
- Ngày kiểm tra: 11/11/2026. Vị trí: `Description`.
- Hỗ trợ: export nhất quán một DB; global roles/tablespaces cần xử lý riêng; tài liệu cảnh báo không mặc định dùng dump làm toàn bộ chiến lược backup production.
- Giới hạn: không bao gồm file ngoài DB hoặc giao dịch chỉ có trên thiết bị; chưa chạy dump/restore.

## T16 — PostgreSQL 18: Continuous Archiving and PITR

- URL đã đọc: <https://www.postgresql.org/docs/current/continuous-archiving.html>.
- Ngày kiểm tra: 11/11/2026. Vị trí: §25.3, phần đầu và `Note`.
- Hỗ trợ: base backup + chuỗi WAL; phục hồi vật lý toàn cluster; logical dump không dùng làm base cho WAL replay.
- Giới hạn: không chứng minh managed service cụ thể có restore tenant riêng; quy trình cluster tạm là đề xuất áp dụng, phải diễn tập và tính chi phí.

## T17 — PostgreSQL 18: Write Ahead Log

- URL: <https://www.postgresql.org/docs/18/runtime-config-wal.html>.
- Ngày kiểm tra: 11/11/2026. Vị trí: §19.5, `fsync`, `synchronous_commit`, bảng 19.1.
- Hỗ trợ: mức chờ ghi bền/replica ảnh hưởng durability; cấu hình bất đồng bộ có cửa sổ mất transaction vừa được báo commit.
- Giới hạn: không có cấu hình triển khai để kiểm tra; không suy một tham số tạo RPO bằng 0 trước mọi thảm họa hoặc lần restore.

## T18 — OWASP: Multi Tenant Security Cheat Sheet

- URL: <https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html>.
- Ngày kiểm tra: 11/11/2026. Vị trí: `Tenant Identification & Context Management`; bảng `Database Isolation Strategies`.
- Hỗ trợ: tenant selector từ client cần xác minh; database riêng còn phụ thuộc credential và các đường truy cập.
- Giới hạn: hướng dẫn an ninh, không chứng nhận cách ly hệ thống hoặc kết luận pháp lý. Ma trận thao tác và runbook dự án là đề nghị theo B005/R003.

## T19 — WebKit: Web Push for Web Apps on iOS and iPadOS

- URL: <https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/>.
- Ngày kiểm tra: 11/11/2026. Xuất bản: 16/02/2023. Vị trí: `Web Push for Web Apps added to the Home Screen`.
- Hỗ trợ: điều kiện Home Screen, phiên bản 16.4 và thao tác trực tiếp xin quyền được WebKit mô tả.
- Giới hạn: không phải ma trận mọi browser hiện nay; push không chứng minh trạng thái giao dịch. Tính năng chưa được chọn làm điều kiện MVP.

## Bằng chứng chưa có

Chưa có kiểm kê/phiên bản máy NPP, log spike, kết quả thử trình duyệt bằng ứng dụng dự án, số đo storage/thời gian sync, cấu hình database, báo giá cloud, quyền API hóa đơn, diễn tập hai tenant/migration/restore hoặc dữ liệu pilot. Các bảng tình huống và số dư minh họa là **thiết kế kiểm tra**, không phải kết quả đã đạt. Các nguồn trên không được dùng để suy ra mức phổ biến nghiệp vụ tại NPP Việt Nam.
