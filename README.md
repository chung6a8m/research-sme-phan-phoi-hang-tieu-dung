# Nghiên cứu hệ thống cho doanh nghiệp phân phối hàng tiêu dùng tại Việt Nam

Repository này là **nơi lưu kết quả nghiên cứu của dự án**, không chỉ là nguồn tài liệu để đọc khi nghiên cứu. Nội dung chính là báo cáo nghiên cứu bằng tiếng Việt, nguồn tham khảo, giới hạn của bằng chứng và các đề bài nghiên cứu tiếp theo; không phải repository mã nguồn ứng dụng.

Theo xác nhận của chủ dự án ngày **11/11/2026**, trợ lý được phép ghi các báo cáo nghiên cứu vào repository và chủ động tổ chức thư mục, tên file phù hợp.

## Mục lục

| Mã | Tài liệu | Trạng thái |
|---|---|---|
| R001 | [Tổng quan hệ sinh thái SaaS cho SME phân phối FMCG Việt Nam](reports/2026-11-11-01-tong-quan/report.vi.md) | Bản dịch tiếng Việt đã có trong cuộc trao đổi; lưu nguyên văn, chưa kiểm chứng lại các nguồn. |
| R001-S | [Xuất xứ, nguồn tham khảo và giới hạn của R001](reports/2026-11-11-01-tong-quan/sources.md) | Thông tin lưu trữ và các URL lấy từ báo cáo gốc trong cuộc trao đổi. |
| B002 | [Đề bài nghiên cứu nghiệp vụ MVP và PWA tại Việt Nam](briefs/2026-11-11-02-nghiep-vu-mvp-pwa.md) | Đề bài; đã liên kết tới báo cáo kết quả R002 được nhập từ file đính kèm. |
| R002 | [Nghiệp vụ nhà phân phối FMCG và MVP PWA — báo cáo đầy đủ](reports/2026-11-11-02-nghiep-vu-mvp-pwa/report.vi.md) | Đã lưu nguyên văn toàn bộ file `deep-research-report (1).md`; đã đối chiếu mã kiểm tra nội dung, chưa kiểm chứng lại các nhận định. |
| R002-S | [Xuất xứ bản lưu và giới hạn bằng chứng của R002](reports/2026-11-11-02-nghiep-vu-mvp-pwa/sources.md) | Thông tin file nguồn, mã kiểm tra, phạm vi nội dung và giới hạn của lần nhập. |

## Cấu trúc

```text
README.md
AGENTS.md
reports/
  2026-11-11-01-tong-quan/
    report.vi.md
    sources.md
  2026-11-11-02-nghiep-vu-mvp-pwa/
    report.vi.md
    sources.md
briefs/
  2026-11-11-02-nghiep-vu-mvp-pwa.md
```

- `reports/`: kết quả nghiên cứu đã có, tổ chức theo đợt nghiên cứu.
- `briefs/`: yêu cầu và phạm vi nghiên cứu; không trình bày đề bài như kết quả đã hoàn thành.
- `AGENTS.md`: hướng dẫn cho trợ lý nghiên cứu và ghi kết quả vào repository.

Tên thư mục báo cáo theo mẫu `YYYY-MM-DD-NN-chu-de`; báo cáo chính là `report.vi.md`. Nội dung dùng tiếng Việt, tên đường dẫn dùng chữ thường không dấu và dấu gạch nối. File văn bản mới dùng UTF-8 và LF; bản nhập nguyên văn ưu tiên giữ nguyên nội dung nguồn.

## Phạm vi được chủ dự án xác nhận

Chủ dự án lựa chọn MVP ban đầu tập trung vào quản trị nhà phân phối, đơn hàng, kho, hóa đơn điện tử, thu tiền/công nợ và báo cáo cơ bản. Ứng dụng đặt hàng cho nhân viên thị trường sử dụng **PWA thay cho ứng dụng di động native**.

Báo cáo R001 là bản ghi lịch sử trước lựa chọn PWA. Giữ nguyên phần kiến trúc/ứng dụng di động trong báo cáo đó để bảo toàn nội dung; không xem các đề xuất lịch sử là quyết định mới. Đề bài B002 ghi nhận lựa chọn hiện tại và yêu cầu nghiên cứu cách vận hành nghiệp vụ tại Việt Nam.

Kết quả nghiên cứu của đợt B002 đã được lưu tại [R002](reports/2026-11-11-02-nghiep-vu-mvp-pwa/report.vi.md) theo toàn bộ file đính kèm do chủ dự án cung cấp. Giữ riêng đề bài và báo cáo; việc nhập đầy đủ file không đồng nghĩa với kiểm chứng hoặc nghiệm thu mọi nội dung nghiên cứu.

## Quy tắc sử dụng kết quả

Phân biệt dữ liệu có nguồn, tuyên bố của nhà cung cấp, suy luận, giả định và lựa chọn đã được chủ dự án xác nhận. Việc lưu báo cáo không đồng nghĩa với kiểm chứng toàn bộ nội dung hoặc phê duyệt mọi đề xuất. Các thông tin thị trường, giá, pháp lý và khả năng công nghệ phải được ghi rõ ngày và mức độ xác minh khi nghiên cứu mới.

Khi ghi kết quả, cập nhật mục lục và báo lại đường dẫn file cùng commit hoặc pull request thực tế. Không coi việc chỉ đưa URL repo vào yêu cầu nghiên cứu là đã lưu báo cáo.
