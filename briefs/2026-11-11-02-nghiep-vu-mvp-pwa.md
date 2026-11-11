# B002 — Đề bài nghiên cứu nghiệp vụ MVP và PWA tại Việt Nam

- Ngày ghi nhận: **11/11/2026**.
- Loại tài liệu: **đề bài nghiên cứu**, không phải báo cáo kết quả.
- Trạng thái lưu trữ: **đã nhập đầy đủ file báo cáo đính kèm** của đợt này vào repository dưới mã R002; chưa kiểm chứng lại nội dung nghiên cứu.
- Kết quả: [R002 — Nghiệp vụ nhà phân phối FMCG và MVP PWA — báo cáo đầy đủ](../reports/2026-11-11-02-nghiep-vu-mvp-pwa/report.vi.md).
- Xuất xứ và kiểm tra toàn vẹn: [R002-S](../reports/2026-11-11-02-nghiep-vu-mvp-pwa/sources.md).
- Bối cảnh: [báo cáo tổng quan R001](../reports/2026-11-11-01-tong-quan/report.vi.md), mục 9 về MVP ban đầu.

## Yêu cầu trực tiếp của chủ dự án

> Tôi muốn làm MVP ban đầu như đề xuất. Nhưng mục "Ứng dụng đặt hàng trên di động" thì tôi muốn dùng PWA. Và tôi cần bạn research bộ nghiệp vụ như vậy thì ở Việt Nam đang có cách thức phổ biến nào?

Chủ dự án cũng xác nhận repo này được dùng để **ghi kết quả sau nghiên cứu**; trợ lý được tự tổ chức thư mục và tên file. Toàn bộ đầu ra chính dùng tiếng Việt.

## Phạm vi MVP làm đầu vào

| Thành phần | Phạm vi từ đề xuất được chọn |
|---|---|
| Cổng quản trị nhà phân phối | Quản lý sản phẩm, giá bán, nhà phân phối hoặc đại lý và xem báo cáo. |
| **PWA đặt hàng cho nhân viên thị trường** | Xem điểm bán được phân công, tạo đơn ngoại tuyến, ghi nhận viếng thăm, tình trạng hàng hóa và yêu cầu trả hàng, sau đó đồng bộ. |
| Đơn hàng và hóa đơn | Phê duyệt, kết nối phát hành hóa đơn điện tử, ghi nhận thanh toán và khoản phải thu. |
| Tồn kho | Theo dõi tồn theo kho, cảnh báo bổ sung hàng, nhận hàng và lấy hàng cơ bản. |
| Báo cáo | Doanh số theo khu vực hoặc nhà phân phối, khách hàng quan trọng và tuổi nợ. |

Mục tiêu là liên thông việc đặt hàng, theo dõi và đối soát đang thực hiện qua Excel, giấy tờ hoặc ứng dụng nhắn tin. Mốc 0–3 tháng là khung MVP từ đề xuất trước, không phải cam kết tiến độ đã kiểm chứng.

## Câu hỏi nghiên cứu

Những mục dưới đây là hướng khảo sát, **chưa phải kết luận về mức độ phổ biến hoặc phạm vi triển khai đã chốt**.

1. Nhà phân phối SME Việt Nam vận hành đặt trước rồi giao, bán hàng trên xe, nhận đơn qua điện thoại/Zalo, bán trực tiếp và khách tự đặt như thế nào? Có bằng chứng nào cho mức độ phổ biến theo nhóm doanh nghiệp/ngành hàng?
2. Ai phụ trách bán hàng, duyệt đơn, xuất kho, giao nhận, thu tiền và đối soát? Chứng từ nào được lập, chuyển giao và dùng để chốt từng công đoạn?
3. Quy tắc giá theo khách hàng, đơn vị tính/quy đổi, chiết khấu, hàng tặng, hạn mức nợ, thanh toán một phần, đổi trả, lô/hạn dùng, kiểm kê và giao thiếu khác nhau thế nào?
4. Có những trạng thái và ngoại lệ nào cần tách giữa đơn hàng, tồn kho, giao hàng, hóa đơn và công nợ? Những thao tác nào được làm ngoại tuyến, những thao tác nào phải chờ kiểm tra trên máy chủ?
5. PWA đáp ứng ra sao trên thiết bị Android/iOS thực tế: cài đặt, dữ liệu cục bộ, đồng bộ khi mở lại, camera, vị trí, thông báo và giới hạn chạy nền? Phải kiểm chứng bằng tài liệu chính thức và thử nghiệm phù hợp, không mặc định tương đương native.
6. DMS/SFA và phần mềm bán buôn tại Việt Nam mô tả các nghiệp vụ trên thế nào? Phân biệt tài liệu sản phẩm với quan sát doanh nghiệp, khảo sát độc lập và trường hợp triển khai được mô tả.
7. Phần nào nên thuộc MVP, phần nào là tùy chọn hoặc để sau? Giả thuyết nào cần phỏng vấn và thử nghiệm trước khi chốt yêu cầu?

## Đầu ra cần lưu khi có kết quả

Báo cáo tiếng Việt cần nêu các mô hình nghiệp vụ, luồng xử lý và ngoại lệ; ma trận vai trò/chứng từ; mức phù hợp và giới hạn PWA; đề xuất ưu tiên MVP; nguồn tham khảo và kế hoạch kiểm chứng. Phân biệt đề xuất thiết kế với kết quả nghiên cứu thực tế.

Khi đã có báo cáo đầy đủ, tạo thư mục tương ứng trong `reports/` theo quy ước README, lưu báo cáo cùng nguồn và cập nhật mục lục. Không tạo file báo cáo giả để biểu thị nghiên cứu đã hoàn thành khi mới chỉ có đề bài.

## Kết quả đã lưu

Ngày **11/11/2026**, đã bổ sung [toàn văn báo cáo R002](../reports/2026-11-11-02-nghiep-vu-mvp-pwa/report.vi.md) từ file `deep-research-report (1).md` do chủ dự án cung cấp. Báo cáo giữ đủ các phần về cách vận hành nghiệp vụ, bốn mô hình bán hàng, vai trò/chứng từ, phần mềm tại Việt Nam, PWA, đề xuất MVP và pháp lý.

B002 được giữ lại làm đề bài để truy xuất yêu cầu ban đầu; **nội dung kết quả nghiên cứu nằm ở R002, không chỉ ở bản đề bài này**. [Tài liệu xuất xứ R002-S](../reports/2026-11-11-02-nghiep-vu-mvp-pwa/sources.md) ghi mã kiểm tra và giới hạn bằng chứng. Trạng thái đã lưu đủ file nguồn không tự xác nhận mọi câu hỏi nghiên cứu đã được kiểm chứng hoặc mọi đề xuất đã được phê duyệt.
