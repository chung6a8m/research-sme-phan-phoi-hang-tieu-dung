# R005 — Nguồn và giới hạn bằng chứng

## 1. Xuất xứ và phạm vi

- Yêu cầu: phân tích kết quả nghiên cứu ban đầu trong repo và đề xuất mục tiêu nghiên cứu bổ sung để đạt MVP.
- Ngày thực hiện: **11/11/2026**, Asia/Bangkok.
- Baseline đọc: nhánh main, commit **2ce5ff38401fdc30774a6524d95014bd6bb45440** của repository chung6a8m/research-sme-phan-phoi-hang-tieu-dung.
- Phương pháp: đọc các báo cáo/đề bài/phụ lục và quy ước repo; đối chiếu mâu thuẫn và phần còn mở; kiểm tra phép tính minh họa; đọc một số tài liệu kỹ thuật và hồ sơ văn bản chính thức.
- Sản phẩm: [phân tích R005](report.vi.md) và [đề bài B005](../../briefs/2026-11-11-05-nghien-cuu-bo-sung-dat-mvp.md). Đề xuất nghiên cứu không phải kết quả đã triển khai các mục tiêu đó.

## 2. Tài liệu nội bộ đã đọc

Các liên kết dưới đây cố định tại baseline để phân biệt tài liệu đã đọc với các cập nhật về sau.

| Mã | Tài liệu | Dùng làm căn cứ |
|---|---|---|
| I01 | [README](https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/blob/2ce5ff38401fdc30774a6524d95014bd6bb45440/README.md) và [AGENTS](https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/blob/2ce5ff38401fdc30774a6524d95014bd6bb45440/AGENTS.md) | Phạm vi ban đầu, mục lục, quyền ghi báo cáo, bảo toàn bản lịch sử, cách phân biệt đề xuất và quyết định. |
| I02 | [R001](https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/blob/2ce5ff38401fdc30774a6524d95014bd6bb45440/reports/2026-11-11-01-tong-quan/report.vi.md) và [R001-S](https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/blob/2ce5ff38401fdc30774a6524d95014bd6bb45440/reports/2026-11-11-01-tong-quan/sources.md) | Khung sản phẩm, giả thuyết phân khúc/định giá, MVP, kế hoạch phỏng vấn và các giới hạn nguồn. Không tái sử dụng số liệu thị trường chưa kiểm chứng làm kết luận mới. |
| I03 | [B002](https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/blob/2ce5ff38401fdc30774a6524d95014bd6bb45440/briefs/2026-11-11-02-nghiep-vu-mvp-pwa.md) | Yêu cầu PWA, phạm vi đơn hàng/kho/hóa đơn/công nợ/báo cáo, câu hỏi nghiên cứu và giới hạn mốc thời gian. |
| I04 | [R002](https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/blob/2ce5ff38401fdc30774a6524d95014bd6bb45440/reports/2026-11-11-02-nghiep-vu-mvp-pwa/report.vi.md) và [R002-S](https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/blob/2ce5ff38401fdc30774a6524d95014bd6bb45440/reports/2026-11-11-02-nghiep-vu-mvp-pwa/sources.md) | Mô hình A/B, user stories, PWA, kế hoạch pilot, nhận định pháp lý và trạng thái chưa kiểm chứng của bản nhập. |
| I05 | [R002-D01](https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/blob/2ce5ff38401fdc30774a6524d95014bd6bb45440/reports/2026-11-11-02-nghiep-vu-mvp-pwa/quyet-dinh-va-thuat-ngu.vi.md) | Lựa chọn A/B, nhân sự giao/lái, đề xuất glossary, ba nhóm sơ đồ, nguyên tắc hàng/tiền và các quyết định còn mở tại thời điểm tài liệu được ghi. |
| I06 | [R003 — MVP và kiến trúc](https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/blob/2ce5ff38401fdc30774a6524d95014bd6bb45440/reports/2026-11-11-03-deep-research-mvp-kien-truc/report.vi.md) | Quyết định mới hơn về mỗi tenant một database; UoM, giá vốn, ba sổ tiền, pricing, PWA và câu hỏi cần xác minh. Đây là bản biên tập từ tài liệu đính kèm. |
| I07 | [R004 — ERD và nghiệp vụ](https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/blob/2ce5ff38401fdc30774a6524d95014bd6bb45440/reports/2026-11-11-04-deep-research-erd-nghiep-vu/report.vi.md) | Glossary/ERD/trạng thái đề xuất, phép tính, phạm vi MVP/hậu MVP và cảnh báo nguồn chưa đủ chi tiết. Bản nghiên cứu nguồn được tài liệu mô tả là không truy cập repo khi nghiên cứu. |

Tất cả tài liệu nội bộ trên đã được đọc ngày 11/11/2026. Không coi việc chúng nằm trong repo là bằng chứng đã được người dùng phê duyệt toàn bộ nội dung.

## 3. Nguồn kỹ thuật sơ cấp đã đọc

| Mã | Nguồn | Ngày đọc | Nội dung hỗ trợ và giới hạn |
|---|---|---|---|
| T01 | [MDN — Background Synchronization API](https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API) | 11/11/2026 | Trang ghi mức hỗ trợ hạn chế. Dùng làm căn cứ cần phương án đồng bộ khi mở app/thao tác chủ động. Không phải kiểm thử trên thiết bị pilot. |
| T02 | [MDN — Storage quotas and eviction criteria](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria) | 11/11/2026 | Lưu trữ mặc định best-effort, chính sách theo origin, dung lượng và khả năng dữ liệu bị xóa. Căn cứ thiết kế thử lỗi lưu trữ và cách ly dữ liệu cục bộ ở tầng ứng dụng. |
| T03 | [WebKit — Updates to Storage Policy](https://webkit.org/blog/14403/updates-to-storage-policy/) | 11/11/2026 | Bài ngày 10/08/2023 mô tả chính sách từ Safari/WebKit 17, quota là giới hạn trên và persistence không mặc nhiên được bảo đảm. Không dùng con số quota làm lời hứa dung lượng hay độ bền trên mọi máy. |
| T04 | [Microsoft — Architectural approaches for storage and data in multitenant solutions](https://learn.microsoft.com/en-us/azure/architecture/guide/multitenant/approaches/storage-data) | 11/11/2026 | Tham khảo các câu hỏi về isolation, phiên bản schema, backup/restore và vận hành dữ liệu. Không lựa chọn Azure, nhà cung cấp DB hoặc topology triển khai thay chủ dự án. |

Các phương án một thiết bị ghi chính/chuyến, phân bổ quyền sử dụng hàng/hạn mức và bài diễn tập restore trong R005 là **suy luận/đề xuất thiết kế của đợt phân tích**, không được mô tả như khuyến nghị đã được các nguồn trên xác nhận riêng cho dự án.

## 4. Nguồn pháp lý chính thức đã kiểm tra có giới hạn

| Mã | Nguồn | Ngày đọc | Điều đã xác nhận trong lượt này |
|---|---|---|---|
| L01 | [Công báo Chính phủ — Nghị định 254/2026/NĐ-CP](https://congbao.chinhphu.vn/van-ban/nghi-dinh-so-254-2026-nd-cp-469957/66826.htm) | 11/11/2026 | Hồ sơ chính thức ghi văn bản về hóa đơn điện tử/chứng từ điện tử; ban hành 30/06/2026, hiệu lực 01/07/2026. |
| L02 | [Công báo Chính phủ — Thông tư 91/2026/TT-BTC](https://congbao.chinhphu.vn/van-ban/thong-tu-so-91-2026-tt-btc-470171/67424.htm) | 11/11/2026 | Hồ sơ chính thức ghi hướng dẫn liên quan Luật Quản lý thuế và Nghị định 254/2026; ban hành 30/06/2026, hiệu lực 01/07/2026. |
| L03 | [Cổng văn bản Chính phủ — Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15](https://vanban.chinhphu.vn/?classid=1&docid=214590&pageid=27160&typegroupid=3) | 11/11/2026 | Hồ sơ chính thức ghi ngày ban hành 26/06/2025 và hiệu lực 01/01/2026. |

Đây là kiểm tra tên, chủ đề và mốc hiệu lực tại hồ sơ chính thức. **Chưa đọc/đối chiếu đầy đủ toàn bộ điều khoản, các văn bản liên quan, sửa đổi và từng loại giao dịch của pilot.** Không trình bày danh sách trên là toàn bộ bộ quy định áp dụng. Không đưa ra thuế suất cho một mặt hàng hoặc kết luận thời điểm phát hành cho từng giao dịch cụ thể trong R005. NC-08/NC-09 yêu cầu công việc xác minh đó ở đợt sau.

## 5. Những việc chưa thực hiện

- Chưa phỏng vấn, đi tuyến, quan sát kho hay nhận dữ liệu vận hành của một NPP trong lượt này.
- Chưa thử PWA/IndexedDB/sync, thiết bị, API hóa đơn, backup/restore hoặc tenant isolation.
- Chưa nghiệm thu glossary, ERD, phương pháp giá vốn, chính sách giá, phạm vi chương trình khuyến mại hay mô hình một thiết bị/chuyến.
- Chưa chọn đơn vị pilot, nhà cung cấp hóa đơn, stack triển khai, mức giá SaaS hoặc lịch phát triển.
- Chưa xác nhận KPI giảm 30–50%, hài lòng ≥80% hay các cỡ mẫu/khung thời gian đề xuất bằng dữ liệu thực.

R005 giữ nguyên các báo cáo nguồn. README được cập nhật để người đọc thấy R003/R004 và phân biệt quyết định tenant-per-database mới hơn với trạng thái lịch sử. Việc bổ sung R005/B005 không tự phê duyệt thiết kế hoặc mở rộng phạm vi MVP.
