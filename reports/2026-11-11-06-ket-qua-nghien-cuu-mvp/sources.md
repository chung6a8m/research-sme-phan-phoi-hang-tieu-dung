# Nguồn, phương pháp và giới hạn bằng chứng — R006

Ngày nghiên cứu/kiểm tra: **11/11/2026**, múi giờ Asia/Bangkok. Đề bài: [B005](../../briefs/2026-11-11-05-nghien-cuu-bo-sung-dat-mvp.md). Kết quả: [báo cáo tổng hợp](report.vi.md).

## 1. Cách đọc bằng chứng

R006 gồm nghiên cứu nguồn công khai, đối chiếu tài liệu repo và thiết kế phương án MVP. Phân biệt năm loại thông tin:

1. **Quyết định Owner đã xác nhận:** chỉ lấy từ chỉ dẫn dự án/bản ghi trong repo; không gán trạng thái này cho đề xuất mới.
2. **Thông tin có nguồn sơ cấp:** luật/bản ký, tài liệu nền tảng, tài liệu nhà cung cấp; chỉ kết luận trong phạm vi nội dung đã đọc.
3. **Tuyên bố của nhà cung cấp:** mô tả chức năng do chính nhà cung cấp công bố; chưa kiểm tra sản phẩm hoặc suy rộng thị trường.
4. **Suy luận/khuyến nghị:** cách áp dụng nguồn vào hoàn cảnh dự án, lựa chọn và đánh đổi; cần chủ dự án quyết định.
5. **Ví dụ giả lập/kế hoạch thử:** bộ số liệu để kiểm tra quy tắc, tiêu chí, biểu mẫu; không phải dữ liệu doanh nghiệp hoặc kết quả phần mềm.

Đã dùng nguồn chính thức cho kỹ thuật và văn bản cơ quan nhà nước cho pháp lý. Không dùng bài đại lý/reseller làm hợp đồng API; không dùng trang chỉ có metadata để suy mọi nghĩa vụ pháp lý. Với PDF bản ký khó trích xuất, đã đối chiếu bằng OCR và ảnh trang tại những điều khoản được dẫn trong phụ lục pháp lý. Nguồn chỉ truy cập được qua chỉ mục tìm kiếm được ghi riêng, không đổi thành “đã mở toàn văn”.

## 2. Danh mục nguồn theo chuyên đề

| Nhóm | Sổ nguồn | Phạm vi |
|---|---|---|
| B | [Nguồn nghiệp vụ](nguon-nghiep-vu.md) | UoM, giá vốn, giá/ưu đãi, thu tiền và tạm ứng; vị trí tham chiếu trong tài liệu ERP chính thức |
| T | [Nguồn kỹ thuật](nguon-ky-thuat.md) | Trình duyệt/PWA, transaction, outbox, backup/restore và vận hành |
| L | [Nguồn pháp lý](nguon-phap-ly.md) | Hóa đơn, thuế/khuyến mại, dữ liệu cá nhân; điều/khoản, hiệu lực và giới hạn áp dụng |
| M | M01–M06 bên dưới | Bằng chứng mô hình sản phẩm trong nước và phương pháp đo tác vụ |
| I | I01–I06 bên dưới | Tài liệu tích hợp hóa đơn thực sự tìm/đọc được và hạn chế truy cập |

Các mã B/T/L trong tài liệu phải tra đúng sổ nguồn tương ứng, không trộn với mã cùng tên của R005.

## 3. Baseline nội bộ được đối chiếu

| Mã | Tài liệu | Vai trò trong R006 |
|---|---|---|
| R0 | [AGENTS.md](../../AGENTS.md) và [README](../../README.md) | Quyền lưu kết quả, quy ước, các quyết định đã có và yêu cầu bảo toàn lịch sử |
| R1 | [R001](../2026-11-11-01-tong-quan/report.vi.md) và [R002](../2026-11-11-02-nghiep-vu-mvp-pwa/report.vi.md) | Bối cảnh nghiên cứu đã nhập; không mặc nhiên xác nhận lại mọi nguồn/nhận định cũ |
| R2 | [D01](../2026-11-11-02-nghiep-vu-mvp-pwa/quyet-dinh-va-thuat-ngu.vi.md) | A/B, PWA, giao/lái; phân biệt quyết định và mô hình đề xuất |
| R3 | [R003](../2026-11-11-03-deep-research-mvp-kien-truc/report.vi.md) | Mỗi tenant một DB; đối chiếu nhận định offline/giá cần giới hạn theo A chưa giao và B đã thực hiện |
| R4 | [R004](../2026-11-11-04-deep-research-erd-nghiep-vu/report.vi.md) | Glossary/ERD và trạng thái làm việc, chưa phải đặc tả được nghiệm thu |
| R5 | [R005](../2026-11-11-05-khoang-trong-va-muc-tieu-mvp/report.vi.md) và [B005](../../briefs/2026-11-11-05-nghien-cuu-bo-sung-dat-mvp.md) | Mười mục tiêu và E2E-01–12; chuẩn để ghi phần đã nghiên cứu/phần chưa có bằng chứng |

Không chỉnh sửa R001–R005 trong đợt này để giữ rõ diễn tiến. Yêu cầu ngày 11/11/2026 của Owner là thực hiện nghiên cứu B005 và commit vào PR #1; yêu cầu đó không tự phê duyệt mọi chính sách sản phẩm được đề nghị trong R006.

## 4. Nguồn M — sản phẩm, phân khúc và phép đo

### M01 — MobiWork DMS

- URL: https://mobiwork.vn/
- Đã mở trang chính thức; phần quản lý nhân viên ngoài thị trường, bán hàng theo xe, NPP/điểm bán và khuyến mại.
- Hỗ trợ nhận định: nhà cung cấp mô tả cả pre-sales và van-sales, quản lý điểm bán và tự động ưu đãi.
- Giới hạn: tuyên bố sản phẩm/marketing; không kiểm tra chức năng thực, không dùng làm thống kê số NPP hay hiệu quả tài chính. Không lấy các con số quảng bá làm baseline pilot.

### M02 — MISA AMIS CRM: Đơn hàng nhà phân phối

- URL: https://helpcrm.misa.vn/kb/don-hang-nha-phan-phoi/
- Đã mở; đoạn giới thiệu mô hình đơn NPP và phân biệt doanh số với doanh thu; trang ghi cập nhật 30/08/2023.
- Hỗ trợ nhận định: workflow này theo dõi bán hàng ở NPP, không đồng nghĩa hóa đơn/doanh thu của công ty; có ranh giới với AMIS Kế toán.
- Giới hạn: mô hình nghiệp vụ của sản phẩm, không phải quy tắc kế toán cho mọi NPP. R006 dùng để chỉ ra cần phân định bên sở hữu hàng và bên mang nợ.

### M03 — MISA AMIS Kho: Điều phối giao hàng

- URL: https://helpamis.misa.vn/amis-kho-hang/kb/dieu-phoi-giao-hang/
- Đã mở; các phần điều phối phiếu xuất gắn đơn và phiếu xuất độc lập; thông tin phương tiện/người giao.
- Hỗ trợ nhận định: điều phối không chỉ xuất phát từ một loại đơn; dữ liệu giao nhận có trách nhiệm và phương tiện riêng.
- Giới hạn: không chứng minh phần mềm đáp ứng toàn bộ A/B/offline của dự án.

### M04 — MISA AMIS CRM: Trả hàng nhà phân phối

- URL: https://helpcrm.misa.vn/kb/tra-hang-nha-phan-phoi/
- Đã mở; phần thêm trả hàng, chọn đơn gốc hoặc chọn hàng khi không gắn đơn.
- Hỗ trợ nhận định: tài liệu sản phẩm có đường cho trường hợp không tham chiếu đơn gốc.
- Giới hạn: không xác nhận giá hoàn, xử lý thuế hoặc quyền duyệt phù hợp với MVP. Các quy tắc ấy trong R006 là đề xuất riêng.

### M05 — GOV.UK: Measuring the success of your service

- URL: https://www.gov.uk/service-manual/measuring-success/measuring-the-success-of-your-service
- Đã mở; mục Measuring transactions và Measuring an end-to-end journey.
- Hỗ trợ phương pháp: kết hợp metrics với nghiên cứu người dùng và nguồn dữ liệu khác; đo cả tác vụ/chặng dịch vụ phù hợp.
- Giới hạn: không phải benchmark cho ngành phân phối Việt Nam; không cung cấp mục tiêu giảm 30% hoặc ngưỡng 90% cho dự án.

### M06 — GOV.UK: Usability benchmarking a website or whole service

- URL: https://www.gov.uk/service-manual/measuring-success/usability-benchmarking-a-website-or-whole-service
- Đã mở; phần Choosing tasks to test, What to measure và Running future rounds.
- Hỗ trợ phương pháp: tác vụ thực tế có kết quả đúng rõ và có thể lặp lại để so sánh.
- Giới hạn: số người, thời gian và ngưỡng pilot trong R006 do nhóm đề xuất; chưa có thử nghiệm người dùng.

## 5. Nguồn I — tích hợp hóa đơn

### I01 — meInvoice: PublishInvoiceData

- URL: https://app.meinvoice.vn/api/v2/Help/ResourceModel?modelName=PublishInvoiceData
- **Đã mở trực tiếp** ngày 11/11/2026; nội dung schema đọc được.
- Trường quan sát: `RefID`, `TransactionID`, nội dung đã ký, callback và trường lỗi. Chỉ dùng để đối chiếu cách định danh/trả kết quả.
- Giới hạn: chưa xác nhận đây là contract tích hợp được cấp cho tenant/đối tác hiện tại; sự hiện diện trường callback không chứng minh semantics giao nhận hoặc xác thực. Chưa gọi API phát hành.

### I02 — meInvoice: GET SAInvoice/Get/{id}

- URL: https://app.meinvoice.vn/api/v2/Help/Api/GET-SAInvoice-Get-id
- **Đã mở trực tiếp**; mô tả lấy master/detail theo ID và kiểu phản hồi.
- Hỗ trợ: có tài liệu lookup theo định danh; câu hỏi đối chiếu có cơ sở để làm việc với nhà cung cấp.
- Giới hạn: endpoint này không tự chứng minh toàn bộ cơ chế tra cứu giao dịch chưa rõ kết quả của API phát hành khác; phải xác minh ID/phạm vi/version trên sandbox.

### I03 — meInvoice integration: tra cứu theo RefID và trạng thái

- URL được tìm thấy:
  - https://doc.meinvoice.vn/api/Document/GetInvoiceInRefid.html
  - https://doc.meinvoice.vn/api/Document/InvoiceStatus.html
- Máy tìm kiếm trả nội dung đã lập chỉ mục; mở trực tiếp bằng công cụ nghiên cứu ngày 11/11/2026 trả **404**.
- Bản chỉ mục mô tả tra cứu định danh và nhiều trạng thái hóa đơn/thuế; dùng để lập câu hỏi và thiết kế ma trận trạng thái, không dùng để khóa endpoint sản xuất.
- Giới hạn: không xác định lý do lỗi truy cập, thời điểm thay đổi tài liệu hoặc phiên bản API hiện hỗ trợ. Không suy “API ngừng hoạt động” từ lỗi trang tài liệu.

### I04 — meInvoice integration: phát hành

- URL: https://doc.meinvoice.vn/api/Document/InvoicePublishing.html
- Nội dung được đọc qua kết quả tìm kiếm chính thức đã lập chỉ mục, chưa xác nhận mở trực tiếp thành công.
- Bản chỉ mục mô tả bước tạo/ký/phát hành, lỗi từng hóa đơn trong batch và trường hợp trùng tham chiếu. R006 dùng để đề xuất ca thử phản hồi từng phần tử và timeout.
- Giới hạn: chưa xác nhận semantics retry/idempotency của version provider sẽ cấp; không tái sử dụng ví dụ thuế suất hoặc endpoint cũ làm dữ liệu chuẩn 2026.

### I05 — meInvoice: hướng dẫn môi trường và trang thử

- URLs:
  - https://doc.meinvoice.vn/api/intro.html — có nội dung trong chỉ mục; mở trực tiếp trả 404.
  - https://doc.meinvoice.vn/webapi/intro.html — nội dung đọc từ chỉ mục, mô tả đẩy nháp và ký/phát hành trên web.
  - https://testapp.meinvoice.vn/api/v2/content/apitest.html — mở được shell Swagger nhưng không có đủ đặc tả trong nội dung đọc được.
- Hỗ trợ: có bằng chứng nhà cung cấp từng công bố các luồng kết nối khác nhau; cần chọn đúng loại tích hợp thay vì trộn API đẩy nháp với API phát hành.
- Giới hạn: không dùng thông tin này để tuyên bố đã có sandbox được cấp, ký số hoạt động hoặc tương thích quy định mới.

### I06 — Viettel SInvoice: tài liệu và khả năng truy cập

- Trang: https://sinvoice.viettel.vn/ — lần mở chuyển hướng tới https://sme.viettel.vn/landing-page?alias=SINVOICE, nội dung đọc được hạn chế.
- PDF chính thức tìm được: https://sinvoice.viettel.vn/download/soft/tai_lieu_huong_dan_tich_hop_pmkt_misa.pdf — kết quả tìm kiếm nêu hướng dẫn kết nối MISA/SInvoice; mở PDF lần này bị **timeout**, chưa đọc đầy đủ.
- Hỗ trợ: xác định đầu mối và nhu cầu xin tài liệu phù hợp; không đủ để kết luận endpoint hoặc tính năng API hiện tại.
- Giới hạn: không thay bằng tài liệu có tên tương tự trên website reseller; không xác nhận khả năng offline, retry, lookup, điều chỉnh hay chi phí.

## 6. Việc chưa thực hiện và cách tiếp tục có bằng chứng

- Chưa phỏng vấn, quan sát kho/chuyến, tuyển pilot hoặc có chứng từ thực tế được phép sử dụng.
- Chưa có baseline năng suất, mức sẵn sàng trả phí, báo giá SaaS/cloud/provider hoặc kết quả pilot.
- Chưa chạy PWA trên thiết bị thật, thử UX, API có tài khoản, fault injection, migration, cách ly tenant hoặc restore.
- Bộ số liệu nghiệp vụ là giả lập; phép tính tái lập chỉ kiểm chứng tính nhất quán của ví dụ, không chứng minh phần mềm đã được triển khai/kiểm thử.
- Pháp lý đã được đối chiếu ở mức văn bản và tình huống; cách áp dụng cho ngành hàng, loại hình NPP, hóa đơn/provider và vai trò xử lý dữ liệu cụ thể cần người chịu trách nhiệm xác nhận trước pilot.

Các khoảng trống này được đánh dấu trong từng phụ lục và bảng NC-01–NC-10 của báo cáo. Không gán trạng thái hoàn thành toàn bộ B005 chỉ vì đã có tài liệu nghiên cứu.
