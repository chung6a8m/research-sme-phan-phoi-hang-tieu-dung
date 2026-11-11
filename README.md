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
| R002-D01 | [Lựa chọn mô hình A/B, nhân sự giao hàng và quy chuẩn thuật ngữ](reports/2026-11-11-02-nghiep-vu-mvp-pwa/quyet-dinh-va-thuat-ngu.vi.md) | Đã ghi lựa chọn A/B và quy tắc xe máy/xe tải của chủ dự án; glossary, ERD và ràng buộc chi tiết là đề xuất thiết kế. |
| R003 | [MVP và kiến trúc giải pháp — Tổng hợp Deep Research](reports/2026-11-11-03-deep-research-mvp-kien-truc/report.vi.md) | Bản biên tập đã có; ghi quyết định mỗi tenant một database. UoM, giá vốn, công nợ, pricing và kiến trúc chi tiết còn là đề xuất. |
| R004 | [Glossary, ERD khái niệm và kịch bản nghiệp vụ MVP](reports/2026-11-11-04-deep-research-erd-nghiep-vu/report.vi.md) | Bản biên tập đã có; glossary/ERD/trạng thái và phạm vi chi tiết chưa nghiệm thu; một số nguồn chưa đủ URL/điều khoản. |
| R005 | [Khoảng trống và mục tiêu nghiên cứu bổ sung để đạt MVP](reports/2026-11-11-05-khoang-trong-va-muc-tieu-mvp/report.vi.md) | Đã phân tích R001–R004 và đối chiếu một số nguồn sơ cấp; đề xuất 10 mục tiêu nghiên cứu, chưa thực hiện khảo sát/spike/pilot. |
| R005-S | [Nguồn và giới hạn bằng chứng của R005](reports/2026-11-11-05-khoang-trong-va-muc-tieu-mvp/sources.md) | Baseline, nguồn đã đọc, phạm vi kiểm chứng và những việc chưa thực hiện. |
| B005 | [Đề bài nghiên cứu bổ sung để chốt đặc tả và pilot MVP](briefs/2026-11-11-05-nghien-cuu-bo-sung-dat-mvp.md) | Đề xuất chưa triển khai/chưa được Owner phê duyệt; không phải active roadmap phát triển hoặc kết quả hoàn thành nghiên cứu. |

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
    quyet-dinh-va-thuat-ngu.vi.md
  2026-11-11-03-deep-research-mvp-kien-truc/
    report.vi.md
  2026-11-11-04-deep-research-erd-nghiep-vu/
    report.vi.md
  2026-11-11-05-khoang-trong-va-muc-tieu-mvp/
    report.vi.md
    sources.md
briefs/
  2026-11-11-02-nghiep-vu-mvp-pwa.md
  2026-11-11-05-nghien-cuu-bo-sung-dat-mvp.md
```

- `reports/`: kết quả nghiên cứu đã có, tổ chức theo đợt nghiên cứu.
- `briefs/`: yêu cầu và phạm vi nghiên cứu; không trình bày đề bài như kết quả đã hoàn thành.
- `AGENTS.md`: hướng dẫn cho trợ lý nghiên cứu và ghi kết quả vào repository.

Tên thư mục báo cáo theo mẫu `YYYY-MM-DD-NN-chu-de`; báo cáo chính là `report.vi.md`. Nội dung dùng tiếng Việt, tên đường dẫn dùng chữ thường không dấu và dấu gạch nối. File văn bản mới dùng UTF-8 và LF; bản nhập nguyên văn ưu tiên giữ nguyên nội dung nguồn.

## Phạm vi được chủ dự án xác nhận

Chủ dự án lựa chọn MVP ban đầu tập trung vào quản trị nhà phân phối, đơn hàng, kho, hóa đơn điện tử, thu tiền/công nợ và báo cáo cơ bản. Ứng dụng đặt hàng cho nhân viên thị trường sử dụng **PWA thay cho ứng dụng di động native**.

Báo cáo R001 là bản ghi lịch sử trước lựa chọn PWA. Giữ nguyên phần kiến trúc/ứng dụng di động trong báo cáo đó để bảo toàn nội dung; không xem các đề xuất lịch sử là quyết định mới. Đề bài B002 ghi nhận lựa chọn hiện tại và yêu cầu nghiên cứu cách vận hành nghiệp vụ tại Việt Nam.

Kết quả nghiên cứu của đợt B002 đã được lưu tại [R002](reports/2026-11-11-02-nghiep-vu-mvp-pwa/report.vi.md) theo toàn bộ file đính kèm do chủ dự án cung cấp. Giữ riêng đề bài và báo cáo; việc nhập đầy đủ file không đồng nghĩa với kiểm chứng hoặc nghiệm thu mọi nội dung nghiên cứu.

Ngày **11/11/2026**, chủ dự án chọn **Module A — đặt trước rồi giao** và **Module B — bán theo xe** trong R002. Khi giao bằng xe máy, nhân viên giao hàng đồng thời là người lái xe; khi giao bằng xe tải, có thể có một người giao hàng và một người lái xe. Chủ dự án cũng yêu cầu chuẩn hóa các cụm từ khách hàng/customer, điểm bán, đại lý, NPP, doanh nghiệp và tenant.

[Phụ lục R002-D01](reports/2026-11-11-02-nghiep-vu-mvp-pwa/quyet-dinh-va-thuat-ngu.vi.md) ghi lựa chọn A/B và đề xuất thuật ngữ, phân vai, ERD để dùng khi viết đặc tả tiếp theo. Chỉ phần lựa chọn được nêu rõ là chủ dự án đã xác nhận; tên thực thể, ràng buộc dữ liệu và các chính sách bổ sung vẫn là đề xuất. R002 và phụ lục tiếp tục được giữ nguyên làm bản ghi lịch sử.

**Cập nhật theo R003 ngày 11/11/2026:** multi-tenant đã chọn **mỗi tenant một database**. Các câu còn để mở cách tách database trong tài liệu trước đó phản ánh thời điểm cũ. Ánh xạ doanh nghiệp–tenant–bên thuê SaaS, chính sách chuyến kết hợp A/B, phương pháp giá vốn và các quy tắc chi tiết khác vẫn cần xác minh/chốt.

[R005](reports/2026-11-11-05-khoang-trong-va-muc-tieu-mvp/report.vi.md) đối chiếu các báo cáo hiện có và đề xuất mục tiêu bổ sung về phân khúc/pilot, mô hình dữ liệu, A/B, UoM/giá vốn, giá/khuyến mại, công nợ/đối soát, PWA offline, hóa đơn, vận hành tenant và onboarding/đo giá trị. Đây là phân tích và đề xuất; không tự phê duyệt glossary, schema, chính sách nghiệp vụ hoặc lịch triển khai. Hóa đơn điện tử tiếp tục thuộc phạm vi ban đầu dù danh sách MVP trong R004 chưa liệt kê lại hạng mục này.

## Quy tắc sử dụng kết quả

Phân biệt dữ liệu có nguồn, tuyên bố của nhà cung cấp, suy luận, giả định và lựa chọn đã được chủ dự án xác nhận. Việc lưu báo cáo không đồng nghĩa với kiểm chứng toàn bộ nội dung hoặc phê duyệt mọi đề xuất. Các thông tin thị trường, giá, pháp lý và khả năng công nghệ phải được ghi rõ ngày và mức độ xác minh khi nghiên cứu mới.

Khi ghi kết quả, cập nhật mục lục và báo lại đường dẫn file cùng commit hoặc pull request thực tế. Không coi việc chỉ đưa URL repo vào yêu cầu nghiên cứu là đã lưu báo cáo.
