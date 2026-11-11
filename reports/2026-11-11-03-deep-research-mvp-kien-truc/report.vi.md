# Đặc tả MVP và kiến trúc giải pháp — Tổng hợp Deep Research

> Nguồn: tài liệu đính kèm `deep-research-report (3).md`. Đây là bản biên tập đưa vào repository, không phải bản sao nguyên văn. Các nội dung chưa được người dùng chốt được đánh dấu là **đề xuất**. Đọc cùng [báo cáo nghiệp vụ nền](../2026-11-11-02-nghiep-vu-mvp-pwa/report.vi.md).

## Quyết định đã chốt

- Chỉ triển khai **Module A** (đặt trước, giao sau) và **Module B** (vansales/bán theo xe) cho MVP.
- Giao xe máy: nhân viên giao hàng đồng thời là lái xe. Giao xe tải: có thể bố trí nhân viên giao hàng và lái xe khác nhau.
- Phải chuẩn hóa khái niệm customer/khách hàng, điểm bán, đại lý, NPP, doanh nghiệp, tenant; không đồng nhất các khái niệm.
- Multi-tenant: **mỗi tenant một database**.

## Đơn vị tính và đóng gói

**Đề xuất:** mỗi SKU có một đơn vị tồn kho gốc và tập quy đổi theo SKU: chai, lốc, thùng, pallet. Ghi số lượng chứng từ theo đơn vị giao dịch và số lượng quy đổi sang đơn vị gốc; chụp lại hệ số quy đổi tại thời điểm xác nhận chứng từ.

**Bất biến:** hệ số > 0, số lượng quy đổi phải chính xác trong độ chính xác được cấu hình; không sử dụng số thực nhị phân để tính tiền/số lượng; không cho sửa hệ số lịch sử làm thay đổi chứng từ đã ghi sổ. Thiếu quy đổi thì từ chối xác nhận dòng chứng từ.

**Kiểm thử:** 1 thùng = 12 chai; 2 lốc (6 chai/lốc) + 3 chai = 15 chai. Giá thùng có thể độc lập với giá chai; không tự giả định giá bán luôn tuyến tính theo đơn vị.

## Giá vốn tồn kho

**Đề xuất cần ADR:** hỗ trợ mô hình dữ liệu đủ để mở rộng FIFO và bình quân di động, nhưng MVP chỉ nên chọn **một** phương pháp vận hành cho từng doanh nghiệp và không cho đổi tùy tiện giữa kỳ. Báo cáo nghiên cứu nêu cả FIFO và moving average, chưa có quyết định cuối cùng.

- Mỗi phát sinh nhập/xuất/chuyển kho/điều chỉnh/trả hàng tạo bút toán tồn kho có chứng từ nguồn và dấu thời gian.
- Không cho xuất vượt tồn khả dụng tại thời điểm ghi sổ trên server; đơn offline chỉ là yêu cầu chờ xác nhận.
- Khi số lượng về 0, phải đối soát giá trị tồn về 0 theo chính sách làm tròn; đợt nhập tiếp theo hình thành giá vốn mới.
- Trả hàng phải liên kết giao dịch gốc khi có thể, phục hồi giá trị theo giá vốn gốc theo chính sách được chốt; hàng hỏng/cận date đi vào trạng thái/kho cách ly, không tự tăng tồn bán được.
- Kiểm kê/điều chỉnh bắt buộc có lý do, người thực hiện và phê duyệt nếu vượt ngưỡng.

**Kiểm thử giá vốn:** nhập 5 chai × 10.000đ và 5 chai × 12.000đ; bán 8 chai: FIFO = 86.000đ, bình quân = 88.000đ. Phải kiểm tra cả trả hàng, chuyển kho, điều chỉnh và nhập sau khi tồn bằng 0.

## Công nợ khách hàng, thu hộ và tạm ứng nhân viên

**Đề xuất:** tách ba sổ nghiệp vụ:
1. **Phải thu khách hàng**: khoản khách còn nợ doanh nghiệp.
2. **Tiền nhân viên đang giữ/thu hộ**: đã thu của khách nhưng chưa nộp về quỹ/ngân hàng.
3. **Tạm ứng/hoàn ứng nhân viên**: khoản doanh nghiệp ứng cho nhân viên và chứng từ quyết toán.

Không đồng nhất doanh số với tiền mặt phải nộp: bán chịu, chuyển khoản trực tiếp, hàng trả và chiết khấu đều có thể làm khác biệt. Phiếu thu phải liên kết khách hàng, đơn/hóa đơn (nếu có), người thu, phương thức thanh toán, ca/tuyến và trạng thái nộp tiền. Sai lệch đối soát phải có lý do và phê duyệt, không âm thầm sửa lịch sử.

**Kiểm thử:** giao hàng 1.000.000đ, nhân viên thu tiền mặt 600.000đ, khách còn nợ 400.000đ; nhân viên đang giữ 600.000đ cho tới khi nộp quỹ. Không được diễn giải nộp 1.000.000đ từ nhân viên nếu nhân viên chỉ thu 600.000đ.

## Bảng giá, chiết khấu, khuyến mại tự động

**Đề xuất:** bảng giá theo SKU/UoM, khách hoặc nhóm khách, kênh và khoảng hiệu lực; có thứ tự ưu tiên rõ (giá riêng khách > nhóm khách > kênh > mặc định, nếu được duyệt). Lưu snapshot giá và phiên bản chính sách trên đơn đã xác nhận.

Tách:
- **Giá niêm yết/bảng giá**: giá cơ sở trước ưu đãi.
- **Chiết khấu thương mại**: giảm giá theo chính sách/thoả thuận.
- **Khuyến mại**: quy tắc điều kiện/phần thưởng, có thể tự động thêm hàng tặng hoặc giảm tiền.

Engine khuyến mại phải xác định được chương trình đủ điều kiện, thứ tự áp dụng, khả năng cộng dồn, nhóm loại trừ, giới hạn số lần và ngân sách; kết quả có thể giải thích/audit. Khi nhiều chương trình xung đột, dùng quy tắc đã cấu hình (ví dụ ưu đãi tốt nhất), không tự ý cộng dồn.

**Kiểm thử:** mua 10 tặng 1 tự thêm dòng quà khi đủ điều kiện; mua 9 không được tặng. Hai chương trình loại trừ nhau không cùng áp dụng. Đơn offline phải được server tái định giá/kiểm tra điều kiện khi đồng bộ nếu dữ liệu giá đã thay đổi, với quy trình thông báo xung đột.

## PWA offline-first

**Đề xuất:** cache tài nguyên ứng dụng qua Service Worker, lưu dữ liệu nghiệp vụ và outbox ở IndexedDB. Mỗi lệnh gửi có idempotency key; server kiểm tra version và quyền, trả trạng thái accepted/rejected/conflict. Retry không tạo trùng đơn hoặc thu tiền. Không coi Background Sync/Periodic Sync là bảo đảm trên mọi trình duyệt; phải có nút đồng bộ thủ công và chỉ báo dữ liệu cũ.

## Tenant-per-database

Control plane quản lý tenant, định tuyến kết nối DB theo danh tính đã xác thực; không tin tenant ID do client tự gửi. Mỗi tenant có DB, vòng đời migration/backup/restore và kiểm thử cô lập riêng. Tách vai trò `tenant` (khách thuê SaaS) khỏi `customer` (đối tác mua hàng của tenant).

## Pháp lý và câu hỏi cần xác minh

Các nhận định về thủ tục khuyến mại, hóa đơn điện tử, thuế suất hàng tặng và bảo vệ dữ liệu cần đối chiếu văn bản còn hiệu lực và trường hợp giao dịch cụ thể. **Không mặc định mọi khuyến mại đều phải đăng ký; không mặc định hàng tặng có thuế suất VAT 0%.** Không dùng các ví dụ trong báo cáo làm logic thuế cứng.

**Cần chốt trước khi code:** phương pháp giá vốn; đơn vị tính cho SKU bán lẻ theo khối lượng; quy tắc làm tròn; cách xử lý hàng trả không có đơn gốc; thời điểm ghi nhận công nợ; thứ tự giá/chiết khấu/khuyến mại; cơ chế xung đột offline.

## Nguồn tham khảo trong nghiên cứu

- Microsoft Business Central — [Item units of measure](https://learn.microsoft.com/en-us/dynamics365/business-central/inventory-how-setup-units-of-measure).
- Oracle NetSuite — [Promotion stacking rules](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_1497967237.html).
- AWS — [Multi-tenant SaaS architecture](https://aws.amazon.com/isv/resources/5-multi-tenant-saas-architecture/).
- Luật Thương mại 36/2005/QH11 và các văn bản hướng dẫn/sửa đổi liên quan (cần xác minh hiệu lực).
