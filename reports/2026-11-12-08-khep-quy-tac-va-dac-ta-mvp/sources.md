# R008-S — Nguồn, phương pháp và phạm vi kiểm chứng

- Ngày nghiên cứu/kiểm tra nguồn: **12/11/2026**, Asia/Bangkok.
- Kết quả: [R008](report.vi.md); yêu cầu đầu vào: [R007](../2026-11-12-07-review-pr1-va-muc-tieu-tiep-theo/report.vi.md), [B007](../../briefs/2026-11-12-07-kiem-chung-va-chot-dac-ta-mvp.md).
- Phân biệt: nội dung nguồn; suy luận thiết kế; dữ liệu giả lập; kết quả chạy mô hình; quyết định Owner; bằng chứng ngoài hệ thống.

## 1. Xuất xứ và phạm vi thay đổi

| Thuộc tính | Giá trị |
|---|---|
| Repository | `chung6a8m/research-sme-phan-phoi-hang-tieu-dung` |
| PR | [#1](https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/pull/1), draft/open lúc bắt đầu |
| Branch | `research/2026-11-11-mvp-research-goals` |
| HEAD đầu vào | `d1ef1627f2b624bba2d01d32a3cf77eb35a7cf18` |
| Tree đầu vào | `cceabbc4dcb3848f070a5ff638d99812f3170bb0` |
| Kiểm tra snapshot | 25 blob nội dung local khớp remote HEAD trước khi sửa |
| Yêu cầu người dùng | Thực hiện research để khắc phục/bổ sung theo R007 của PR #1 |
| Tổ chức đầu ra | Một đợt R008; cập nhật README và trạng thái thực hiện B007; giữ báo cáo R001–R007 |

Quyền ghi nghiên cứu theo [AGENTS.md](../../AGENTS.md) và yêu cầu hiện tại. Không gán việc yêu cầu thực hiện nghiên cứu thành việc chấp nhận Q01–Q10, SLA, provider hoặc nghiệm thu MVP.

## 2. Cách nghiên cứu và phối hợp

Ba phần chuyên môn được thực hiện song song trên cùng baseline: nghiệp vụ/số liệu, offline/phục hồi, hóa đơn/dữ liệu. Phần tổng hợp xây đặc tả ứng viên và hồ sơ pilot/bàn giao, đối chiếu các giao diện chung như SaleDeliveryReceipt, terms snapshot, source revision, trạng thái hóa đơn và quyền sau restore.

Quy tắc mới được viết thành kết quả có trường dữ liệu, trạng thái, trách nhiệm, ví dụ và điều kiện kiểm chứng. Khi chưa có đầu vào thực tế, kết luận dừng đúng ở tài liệu/mô hình; không điền giả người dùng, tài khoản test, provider đã chọn, số liệu thị trường hoặc ngưỡng được chấp nhận.

Các nguồn ERP/DB/browser là bằng chứng về khả năng và cách thiết kế được tài liệu hóa, không chứng minh một phương pháp đã phổ biến ở mọi NPP Việt Nam hoặc sản phẩm dự án đã triển khai đúng. Nguồn pháp luật được đọc theo phần áp dụng, ngày hiệu lực và giới hạn cụ thể trong sổ nguồn chuyên đề.

## 3. Sổ nguồn chuyên đề

| Sổ nguồn | Phần có nguồn/kiểm tra | Giới hạn đọc kết quả |
|---|---|---|
| [Nguồn nghiệp vụ](nguon-nghiep-vu.md) | Liên kết nguồn giá vốn, điều chỉnh, terms, Decimal, tính tiền đã gồm thuế và schema tiền provider | Phân bổ lũy kế/waiver/anchor ngày giao là đề xuất dự án, không tự thành chuẩn pháp lý hoặc policy kế toán |
| [Nguồn kỹ thuật](nguon-ky-thuat.md) | IndexedDB/lifecycle/eviction, HTTP/JCS, DB/WAL/PITR, outbox, cách ly và trạng thái | Đọc spec/docs không kiểm chứng fsync, isolation, crypto hoặc cách ly deployment |
| [Nguồn pháp lý/provider](nguon-phap-ly.md) | Văn bản hóa đơn/dữ liệu, bản ký điều khoản, tài liệu schema/provider, ngày hiệu lực và truy cập | Không có sandbox/certification/khảo sát hồ sơ doanh nghiệp; không suy giấy phép áp dụng trước khi xác định hoạt động |

Người tổng hợp mở độc lập các nguồn trọng yếu: Microsoft về exact source cost và terms; schema meInvoice; PostgreSQL PITR; metadata/bản ký NĐ254, NQ22 và metadata NĐ392; phương pháp GOV.UK bên dưới. Các phần PDF được kiểm tra qua hình trang cụ thể được nêu trong sổ pháp lý. Không tuyên bố mọi URL lịch sử R001–R007 đã được kiểm tra lại toàn bộ.

## 4. Nguồn phương pháp cho BS-06

### P01

**GOV.UK Service Manual — Using moderated usability testing.**

- URL: https://www.gov.uk/service-manual/user-research/using-moderated-usability-testing
- Đã mở trang; phần mục tiêu/bài thử, chỉ dẫn trung lập, quan sát và sử dụng dữ liệu phù hợp.
- Dùng làm căn cứ phương pháp quan sát người dùng làm tác vụ, ghi trợ giúp/lỗi và tách nhận xét khỏi kết quả. Bộ UX-01–08, dữ liệu và vai trò là đề xuất riêng cho dự án.
- Không dùng số buổi/cỡ mẫu trong hướng dẫn làm điều kiện bắt buộc hay bằng chứng đại diện thị trường NPP.

### P02

**GOV.UK Service Manual — Measuring completion rate.**

- URL: https://www.gov.uk/service-manual/measuring-success/measuring-completion-rate
- Đã mở trang; phần tử số/mẫu số, điểm bắt đầu/kết thúc, save-and-return và hỗ trợ.
- Dùng để yêu cầu định nghĩa cohort, không bỏ các lần thất bại khi tính tỷ lệ và nối các lần quay lại bằng ID. Chỉ số hoàn thành tác vụ độc lập được tách với hoàn thành có trợ giúp và bao phủ sử dụng.
- Không chuyển quy định báo cáo của dịch vụ công Anh thành nghĩa vụ của sản phẩm này.

### P03

**GOV.UK Service Manual — Measuring cost per transaction.**

- URL: https://www.gov.uk/service-manual/measuring-success/measuring-cost-per-transaction
- Đã mở trang; phần tổng chi phí bao gồm hỗ trợ, mẫu số giao dịch hoàn tất, phân bổ chi phí chia sẻ và baseline.
- Dùng làm căn cứ phải công bố phạm vi chi phí và mẫu số. Công thức phục vụ SaaS/tenant và việc tách contribution khỏi lợi nhuận công ty là thiết kế phân tích cho dự án.
- Chưa có báo giá, công thực tế hoặc doanh thu nên chưa có kết quả đơn giá/lợi nhuận của MVP.

## 5. Bằng chứng tính toán và mô hình

### 5.1. Nghiệp vụ

Nguồn thực thi: [kiem-chung-so-lieu.py](kiem-chung-so-lieu.py); đầu ra: [ket-qua-so-lieu.json](ket-qua-so-lieu.json).

```bash
python3 kiem-chung-so-lieu.py --output ket-qua-so-lieu.json
```

Kết quả đã chạy: **91 kiểm tra đạt, 0 không đạt, 18 mốc dữ liệu**. Phạm vi gồm quà ròng/waiver, residual cost, source adjustment, terms/múi giờ, tiền/thuế/chiết khấu, compound credit, nhiều ngày và mô hình export chống lặp trong bộ nhớ. Đây là phép tính tham chiếu, không là engine sản phẩm hoặc bằng chứng kế toán/provider đã xác nhận.

Tax profile được đánh dấu `SYNTHETIC-UNAPPROVED`, `invoice_eligible=false`. 8%/10% là tham số để thử công thức; giả định quà có taxable base bằng 0 trong một ví dụ không chứng minh thuế suất 0% hoặc đủ điều kiện khuyến mại. Thiếu hồ sơ thật phải được xử lý trong profile áp dụng trước phát hành.

### 5.2. Đồng bộ và phục hồi

Nguồn thực thi: [kiem-chung-giao-thuc.py](kiem-chung-giao-thuc.py); đầu ra: [ket-qua-giao-thuc.json](ket-qua-giao-thuc.json).

```bash
python3 kiem-chung-giao-thuc.py --output ket-qua-giao-thuc.json
```

Kết quả đã chạy: **14.942 trường hợp hữu hạn, 269.729 kiểm tra điều kiện, 12 nhóm**, gồm bốn đối chứng sai có chủ ý được phát hiện. JSON lưu thời điểm chạy, phiên bản Python, hash script, phạm vi/giả định và các lớp chưa kiểm chứng. Số trường hợp là hoán vị/biến thể trong mô hình, không là số thiết bị, người dùng, giao dịch production hoặc tất cả đầu vào có thể có.

Mô hình dùng JSON round-trip để mô tả dữ liệu bền sau restart và assignment nguyên tử để mô tả transaction. Authority, recovery journal và generation anchor được giả định đúng/độc lập với tenant rollback. Vì vậy, các kết quả có ý nghĩa đối với tính nhất quán của contract trong mô hình, không chứng minh triển khai disk, DB concurrency, IndexedDB, mạng, mật mã hoặc PITR thật.

### 5.3. Ví dụ cutover và kiểm tra tài liệu

CUT-01 trong [pilot/bàn giao](pilot-va-ban-giao.vi.md) minh họa opening AR 140.000/custody 60.000; thu mới 20.000 rồi nộp 50.000 dẫn tới AR 120.000/custody 30.000/quỹ tăng 50.000. Phép tính được đối chiếu; chưa có importer để chứng minh retry/cutover trong ứng dụng. CUT-02 và E2E-22 là đặc tả và expected result, chưa chạy UX/sản phẩm.

Kiểm tra bàn giao bao gồm UTF-8/LF, đường dẫn/liên kết nội bộ, trạng thái giả định/bằng chứng, tính thống nhất các tên contract và đối chiếu blob với baseline/remote khi commit. Không dùng kiểm tra Markdown hoặc chạy mô hình để nâng mức sẵn sàng pilot.

Đã có một vòng review độc lập trên working snapshot R008, đọc các phụ lục và chạy lại cả hai script. Kết quả số học khớp từng byte; kết quả giao thức khớp ngoài timestamp, hash script khớp. Vòng review yêu cầu bổ sung J2 lưu đầy đủ quyết định/bút toán gốc thay vì chỉ ID/hash, tách phục hồi posted với queued và sửa vị trí tham chiếu W3C IDBDatabase thành §4.4. Các đoạn đã được sửa và đọc lại; không còn finding Critical/Important/Minor chưa xử lý đối với việc bàn giao **kết quả nghiên cứu**.

Người tổng hợp cũng chạy lại hai script và tính độc lập bảo toàn lượng/giá trị/chi phí/tiền/nợ tại cả 18 snapshot, phép điều chỉnh nguồn, lượng E2E-20 và tiền CUT-01. Mô hình giao thức chưa chạy toàn bộ rollback ledger rồi tái dựng posting plan; việc bổ sung contract phục hồi không được tính thêm như một ca sản phẩm đã đạt.

## 6. Sổ trạng thái bằng chứng

| Nhãn dùng trong R008 | Ý nghĩa | Không được suy thành |
|---|---|---|
| SOURCE_CHECKED / đối chiếu tài liệu | Đã đọc phần nguồn nêu cụ thể | Vendor đã thực hiện đúng trong tài khoản pilot |
| PROPOSED / ứng viên | Nghiên cứu chọn và giải thích một phương án | Owner đã phê duyệt hoặc mọi doanh nghiệp đều áp dụng |
| ARITHMETIC_MODEL_VERIFIED_ONLY | Số học và mô hình nghiệp vụ đã chạy đúng expected result của fixture | Thuế của SKU thật, engine, kiểm toán hoặc kế toán đã xác nhận |
| MODEL_VERIFIED | Mô hình giao thức hữu hạn đạt các bất biến được kiểm | DB/browser/network/key/restore thật đã kiểm chứng |
| PREPARED / đã chuẩn bị | Có input/steps/expected/evidence cần thu | Ca sandbox/UX/pilot đã chạy |
| EXTERNAL_EVIDENCE_PENDING | Thiếu người, dữ liệu, tài khoản hoặc môi trường ngoài | Có thể bỏ qua điều kiện đó để tuyên bố MVP ready |

## 7. Những việc chưa có bằng chứng

Chưa có phỏng vấn/quan sát mới; NPP và hồ sơ pháp lý/thuế thật; dữ liệu mở đầu được duyệt; tài khoản sandbox được cấp quyền; hóa đơn hoặc chứng từ vận chuyển test đã phát hành; thiết bị/browser được chạy; DB/hạ tầng và diễn tập khôi phục; chấp nhận Owner/kế toán; prototype với người dùng; chi phí hỗ trợ/báo giá; kết quả dùng và quyết định trả phí.

Đây là các giới hạn có tác động đến kết luận đã xác định trong B007. R008 thực hiện toàn bộ phần có thể làm bằng tài liệu/phân tích/mô hình trong phiên; không đánh dấu hoàn thành phần phụ thuộc đầu vào chưa có hoặc hứa sẽ chạy ngầm sau khi kết thúc.
