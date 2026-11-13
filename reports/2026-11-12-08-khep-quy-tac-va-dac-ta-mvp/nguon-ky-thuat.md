# Nguồn kỹ thuật — R008 / BS-04

- Phụ lục sử dụng: [Offline, ACK và phục hồi](offline-va-phuc-hoi.vi.md).
- Ngày thực sự truy cập: **12/11/2026, Asia/Bangkok**; phiên tra cứu trải qua 11–12/11 theo UTC. Đây là ngày đọc, không phải ngày phát hành hay ngày kiểm thử sản phẩm.
- Chỉ dùng nguồn trực tiếp của đơn vị duy trì API/tiêu chuẩn/database hoặc tổ chức công bố hướng dẫn. PostgreSQL, AWS và cơ chế canonicalization là ví dụ/cơ sở thiết kế, **không phải lựa chọn stack đã được Owner chấp nhận**.
- Đọc các mục ghi bên dưới qua nội dung web; không tuyên bố đọc toàn bộ tiêu chuẩn dài. Tìm kiếm bổ sung đối chiếu trạng thái Working Draft của IndexedDB. Không có khảo sát thiết bị hoặc phép thử provider trong hoạt động đọc nguồn này.
- Quy tắc inbox, thời gian 8 giờ/24 giờ, authority ngoài restore, các gate và mô hình là **suy luận/thiết kế R008**, không phải quy định sẵn của nguồn.

## K01 — W3C: Indexed Database API 3.0

- URL đã đọc: <https://www.w3.org/TR/IndexedDB/>. Bản gắn phiên bản: <https://www.w3.org/TR/2026/WD-IndexedDB-3-20261030/>.
- Trạng thái trang đã đọc: **Working Draft, 30/10/2026**, chưa là Recommendation. Kiểm: phần Status; §2.7 Transactions, durability hint; §2.7.1–2 về vòng đời/lập lịch; §4.4 IDBDatabase transaction.
- Hỗ trợ: transaction có phạm vi object store; `strict`/`relaxed` là durability hint. Không bảo đảm lưu cục bộ là bản sao lưu, không xác nhận engine/thiết bị pilot thực hiện đúng yêu cầu của ứng dụng.
- Phạm vi R008: nhóm sequence–reservation–outbox cục bộ và activation pointer; chưa kiểm implementation.
<!-- browser_refs: turn23view0, turn25view5, turn43search0, turn43search1 -->

## K02 — MDN: IDBDatabase.transaction()

- URL: <https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase/transaction>.
- Kiểm: Parameters, `options.durability`, `strict`/`relaxed`/`default`, Exceptions.
- Hỗ trợ: cách yêu cầu transaction và hint durability. Không dùng API này để hứa dữ liệu chống mất máy, xóa storage hoặc lỗi phần cứng; phải xác minh trên phiên bản triển khai.
<!-- browser_refs: turn23view1, turn25view6 -->

## K03 — MDN: Storage quotas and eviction criteria

- URL: <https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria>.
- Kiểm: cách chia theo origin; best-effort/persistent; quota, eviction và `QuotaExceededError`.
- Hỗ trợ: quota và cơ chế xóa tùy browser; persistence không ngăn người dùng xóa. Không suy quota công bố thành dung lượng bảo đảm của máy pilot. Không lấy namespace ứng dụng làm ranh giới bảo mật giữa tenant trong cùng origin.
<!-- browser_refs: turn23view2, turn25view7, turn37view10 -->

## K04 — MDN: Background Synchronization API

- URL: <https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API>.
- Kiểm: Limited availability; Concepts and usage; secure context.
- Hỗ trợ: có cơ chế gửi hoãn qua Service Worker nhưng chưa có độ phủ đồng đều. Không cung cấp SLA chạy nền hoặc xác nhận sync của ứng dụng.
<!-- browser_refs: turn25view4, turn37view9 -->

## K05 — Google/web.dev: The service worker lifecycle

- URL: <https://web.dev/articles/service-worker-lifecycle>.
- Kiểm: updating; waiting; Skip the waiting phase; cảnh báo `skipWaiting()` và cache theo origin.
- Hỗ trợ: worker mới có thể điều khiển trang phiên bản cũ khi ép kích hoạt. Chính sách giữ hàng đợi/migration của R008 phải được thử riêng.
<!-- browser_refs: turn25view0, turn37view7 -->

## K06 — MDN: Using IndexedDB

- URL: <https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB>.
- Kiểm: Version changes while a web app is open in another tab; Warning about browser shutdown; transaction cơ bản.
- Hỗ trợ: upgrade có thể bị connection/tab cũ chặn; đóng trình duyệt không phải cơ hội chắc chắn để ghi mọi dữ liệu cuối cùng. Không chứng minh adapter payload cũ của dự án.
<!-- browser_refs: turn43view1 -->

## K07 — RFC 9110: HTTP Semantics

- URL: <https://www.rfc-editor.org/rfc/rfc9110.html#name-idempotent-methods>.
- Kiểm: §9.2.2 Idempotent Methods; đọc khái niệm và retry sau lỗi kết nối. Bản công bố 06/2022.
- Hỗ trợ: ngữ nghĩa idempotent của phương thức HTTP. Command key, hash, durable inbox và vòng đời receipt là contract riêng R008; HTTP 202 tự nó không chứng minh lưu payload hoặc ghi sổ.
<!-- browser_refs: turn23view5, turn37view2 -->

## K08 — RFC 8785: JSON Canonicalization Scheme

- URL: <https://www.rfc-editor.org/rfc/rfc8785.html>.
- Kiểm: Status; §3.1–3.2; Appendix D — Big Numbers. Bản **Informational**, 06/2020, không gọi là Internet Standard.
- Hỗ trợ: biểu diễn JSON xác định để băm/ký; ràng buộc số và chuỗi. R008 đề nghị tiền/số lượng chính xác ở dạng chuỗi có schema. Python `json.dumps(sort_keys=True)` trong mô hình **không** là implementation JCS đầy đủ.
<!-- browser_refs: turn43view0 -->

## K09 — PostgreSQL 18: Transaction Isolation

- URL: <https://www.postgresql.org/docs/18/transaction-iso.html>.
- Kiểm: §13.2, bảng isolation; Serializable Isolation Level và retry sau serialization failure.
- Hỗ trợ: mức isolation có bảo đảm khác nhau; ứng dụng cần xử lý retry transaction. Không chứng minh một câu `SELECT` rồi `UPDATE` của dự án đã loại mọi cạnh tranh; mô hình dùng thao tác tuần tự.
<!-- browser_refs: turn23view4, turn25view9 -->

## K10 — PostgreSQL 18: Write Ahead Log

- URL: <https://www.postgresql.org/docs/18/runtime-config-wal.html>.
- Kiểm: §19.5.1 `fsync`, `synchronous_commit`, bảng 19.1.
- Hỗ trợ: cấu hình commit/đồng bộ ảnh hưởng bảo đảm lưu bền tại local/standby. Không suy `fsync` hoặc một mode riêng lẻ thành RPO=0 sau mọi thảm họa hay restore lùi chủ động.
<!-- browser_refs: turn23view3, turn25view8, turn37view1 -->

## K11 — PostgreSQL 18: Continuous Archiving and PITR

- URL: <https://www.postgresql.org/docs/18/continuous-archiving.html>.
- Kiểm: §25.3, phần giới thiệu và Note về base backup/WAL, phạm vi cluster, logical dump.
- Hỗ trợ: phục hồi vật lý theo chuỗi WAL ở phạm vi cluster; không tự đồng nghĩa PITR riêng từng tenant DB. Cách phục hồi cluster cô lập rồi trích tenant cần diễn tập thực tế.
<!-- browser_refs: turn25view3, turn37view4 -->

## K12 — AWS Prescriptive Guidance: Transactional outbox

- URL: <https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html>.
- Kiểm: Intent; Motivation; Issues and considerations — duplicate messages; Implementation.
- Hỗ trợ: tránh khoảng hở ghi DB–gửi message; phía nhận vẫn cần chịu duplicate. Không bảo đảm exactly-once với provider hóa đơn, không quyết định dùng AWS/microservices.
<!-- browser_refs: turn25view2, turn37view3 -->

## K13 — OWASP: Multi-Tenant Application Security

- URL: <https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html>.
- Kiểm: Tenant Identification & Context Management; Cache & Session Isolation; Tenant-Aware Asynchronous Work; File Storage & Blob Isolation; Tenant Backup Restore.
- Hỗ trợ: tenant selector phải gắn với danh tính và membership/service authorization hiện hành; cách ly phải bao phủ cache, file và job. Không phải chứng nhận an ninh cho thiết kế R008.
<!-- browser_refs: turn25view1, turn37view6, turn37view8 -->

## Nguồn nội bộ và mức bằng chứng

- Đọc `AGENTS.md`, README, [R007](../2026-11-12-07-review-pr1-va-muc-tieu-tiep-theo/report.vi.md), [B007](../../briefs/2026-11-12-07-kiem-chung-va-chot-dac-ta-mvp.md), [R006-T](../2026-11-11-06-ket-qua-nghien-cuu-mvp/pwa-va-van-hanh-tenant.vi.md) và phần dữ liệu/retention trong [R006-L](../2026-11-11-06-ket-qua-nghien-cuu-mvp/hoa-don-va-tuan-thu.vi.md), snapshot HEAD `d1ef1627f2b624bba2d01d32a3cf77eb35a7cf18`.
- Baseline pháp lý mới và chuỗi sửa đổi/hiệu lực: [R008-L](hoa-don-va-du-lieu.vi.md), cùng sổ nguồn pháp lý của đợt R008. Phụ lục kỹ thuật không tự đặt thời hạn giữ/xóa chứng từ thành quy định pháp luật.
- Có thực thi [mô hình Python](kiem-chung-giao-thuc.py) và [kết quả JSON](ket-qua-giao-thuc.json); ý nghĩa `MODEL_VERIFIED` và hạn chế ở phụ lục chính. Những trạng thái xuất hiện trong kết quả mô hình không phải log backend/provider hay biên bản diễn tập.
- Chưa có build PWA, bảng thiết bị, cấu hình DB, log mất điện, RPO/RTO đo, hai tenant thật, recovery infrastructure hoặc provider credentials. Các tài liệu nguồn không thay thế các bằng chứng đó.
