# R008 — Khép quy tắc và bổ sung đặc tả MVP theo review PR #1

- Ngày thực hiện: **12/11/2026**, Asia/Bangkok.
- Repo/PR: [chung6a8m/research-sme-phan-phoi-hang-tieu-dung — PR #1](https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/pull/1).
- Baseline: **`d1ef1627f2b624bba2d01d32a3cf77eb35a7cf18`**, nhánh `research/2026-11-11-mvp-research-goals`.
- Yêu cầu: thực hiện nghiên cứu để khắc phục/bổ sung theo [R007](../2026-11-12-07-review-pr1-va-muc-tieu-tiep-theo/report.vi.md) và sáu mục tiêu [B007](../../briefs/2026-11-12-07-kiem-chung-va-chot-dac-ta-mvp.md).
- Trạng thái: **đã thực hiện nghiên cứu tài liệu, xây đặc tả ứng viên và chạy kiểm chứng số học/mô hình**. Chưa có chấp nhận chính sách toàn bộ, sản phẩm, thiết bị/provider hoặc pilot thật.
- [Nguồn, cách kiểm chứng và giới hạn](sources.md).

## 1. Kết quả chính

**R008 đã đưa bốn findings của R007 thành quy tắc khắc phục cụ thể, bổ sung một đặc tả MVP hợp nhất và bộ kết quả kỳ vọng có thể tái lập.** Phần cần quyết định hoặc kiểm chứng bằng người dùng, thiết bị, hạ tầng và provider được xác định theo đầu vào cụ thể; không tiếp tục mô tả chúng như các câu hỏi nghiên cứu chung.

Các phương án chính được đề nghị:

1. Quà giao thêm tính từ quyền hưởng theo mua ròng và **quà khách còn giữ**; quà được miễn thu hồi vẫn là quà đang giữ, không cộng thêm quyền hưởng.
2. Hoàn giá vốn/tiền theo **phân bổ lũy kế và giá trị nguồn**, có version điều chỉnh; chia nhỏ trả không tạo hoặc mất giá trị.
3. Khoản phải thu mới có **terms snapshot và due_date rõ ràng**; A khóa terms lúc xác nhận đơn, mỗi lần giao dùng ngày giao địa phương làm mốc theo phương án đề nghị.
4. Bán–giao–thu trong một command nghiệp vụ, với các ID chứng từ riêng; tiền đã nhận và phân bổ vào cùng lần bán làm giảm phần cần quyền chịu, tiền ngân hàng pending không được tính như tiền đã nhận.
5. `awaiting_dependency` là **server đã tiếp nhận bền và chịu trách nhiệm tiếp tục**. Phản hồi chưa tiếp nhận bền phải giữ trách nhiệm retry ở client. Hoàn thành truyền dữ liệu khác hoàn thành nghiệp vụ.
6. Restore chỉ mở lại sau khi đối chiếu quyền/yêu cầu dữ liệu hiện hành, đời quyền không lặp, sự kiện đã ACK và tác động ngoài như hóa đơn; không chỉ đổi epoch rồi mở DB cũ. Giao dịch đã ghi sổ được tái dựng theo quyết định/bút toán gốc đã lưu đủ giá trị ngoài rollback; lệnh chỉ đang chờ mới xét điều kiện thực thi hiện hành.
7. Tập khả năng MVP có giới hạn cụ thể, gồm viếng thăm không đơn, chu kỳ nhiều ngày, cutover và bàn giao kế toán; các số thuế minh họa được chặn dùng làm hồ sơ phát hành thật.

Các kết luận này là **đề nghị có bằng chứng nghiên cứu**, không ghi thay người có quyền phê duyệt chính sách. A+B, PWA, nhân sự xe máy/xe tải, DB-per-tenant và hóa đơn vẫn là đầu vào đã chọn từ trước.

## 2. Bộ tài liệu kết quả và thứ tự đọc

| Tài liệu | Nội dung mới có thể sử dụng |
|---|---|
| [Đặc tả MVP đề nghị](dac-ta-mvp-de-nghi.vi.md) | 12 bất biến, Q01–Q10, 22 nhóm khả năng, quan hệ dữ liệu, trạng thái, vai trò và truy vết E2E |
| [Nghiệp vụ và số liệu](nghiep-vu-va-so-lieu.vi.md) | F02/F03, terms, tiền/thuế, quà, cấp/quay vòng hàng, phí muộn, kỳ khóa và kết quả nhiều ngày |
| [Offline và phục hồi](offline-va-phuc-hoi.vi.md) | F01/F04, durable receipt, nguồn phục hồi, compound transaction, downsync, giới hạn offline và runbook |
| [Hóa đơn và dữ liệu](hoa-don-va-du-lieu.vi.md) | Hồ sơ áp dụng, cấp xe/vận chuyển, adapter/state, nguồn provider thực, thủ tục theo ngày và vai trò xử lý dữ liệu |
| [Pilot và bàn giao](pilot-va-ban-giao.vi.md) | Hồ sơ pilot cần nhận, viếng thăm không đơn, 8 bài UX, cutover/import/export, ngoại lệ, KPI và công thức chi phí |
| [Script số liệu](kiem-chung-so-lieu.py) / [kết quả](ket-qua-so-lieu.json) | Phép tính Decimal tái lập, fixture và kiểm tra kỳ vọng; dữ liệu hoàn toàn giả lập |
| [Script giao thức](kiem-chung-giao-thuc.py) / [kết quả](ket-qua-giao-thuc.json) | Mô hình hữu hạn, hoán vị sự kiện/lỗi và đối chứng; không chạy PWA/DB/provider thật |
| [Nguồn tổng](sources.md) và nguồn chuyên đề | Mốc nguồn, phần đã đọc, suy luận thiết kế, giới hạn và cách đọc bằng chứng |

Người quyết định phạm vi nên đọc đặc tả → bảng Q → ví dụ tiền/hàng → giới hạn hóa đơn/offline. Người triển khai dùng quy tắc, dữ liệu và ca mong đợi như đầu vào, sau đó xây kiểm thử ứng dụng độc lập.

## 3. Khắc phục bốn findings của R007

| Finding | Quy tắc khắc phục trong R008 | Bằng chứng đã có | Phần còn cần để chấp nhận triển khai |
|---|---|---|---|
| F01 — quyền/yêu cầu dữ liệu sau restore | Authority và nhật ký xử lý dữ liệu ngoài phạm vi rollback; nguồn đời phục hồi không lặp; khóa truy cập trong suốt đối chiếu; xử lý cả đăng nhập mới, file/cache/support | Contract, runbook, mô hình gate restore và đối chứng epoch-only sai | Chọn cơ chế/hạ tầng, diễn tập quyền/restore/dữ liệu ngoài thực tế |
| F02 — quà trả lại bị trừ lần nữa | `E=floor(mua_ròng/10)`, `G=quà_giao−quà_đã_nhận_trả`; giao thêm `max(0,E−G)`; miễn thu hồi W còn giữ chỉ giảm nghĩa vụ thu hồi | Chuỗi giao–trả–giao, miễn/nhận lại quà miễn và chu kỳ tiếp theo đã tính | Sales/kế toán chấp nhận policy, engine/UX thực hiện đúng |
| F03 — phần dư giá vốn | Giá trị hoàn lũy kế `round(C×k/q)`; mỗi lần nhận chênh lệch; tổng không vượt C; nguồn đổi version có bút toán chênh riêng | 6.667 hoàn thành 3.334+3.333; nhiều cách chia; nguồn điều chỉnh và fixture kỳ sau | Kế toán duyệt, engine đồng thời/khóa nguồn và mapping kế toán |
| F04 — mất chủ thể retry | Durable inbox/journal trước ACK; trạng thái chờ phụ thuộc có server worker/timeout/exception; client nonaccepted phải retry và luôn giữ journal theo policy | Mô hình reorder/duplicate/restart/failure/cycle/timeout; đối chứng nonpersistent ACK bị phát hiện | Kiểm storage durability, transaction/queue, browser restart, network thực |

**Kết luận trạng thái:** các khoảng trống tài liệu đã có phương án khắc phục và bằng chứng ở lớp mô hình. Chưa gắn trạng thái “đã sửa sản phẩm”, “đã nghiệm thu” hoặc “đã tuân thủ” khi chưa có các bước tương ứng.

### 3.1. Quà ròng và miễn thu hồi

Đơn A còn phần giao tiếp: giao 20 mua+2 quà; chấp nhận và nhận lại 11 mua+2 quà; giao tiếp 11 mua. Mua ròng là 20, quà đang giữ 0, cần giao thêm 2. Việc chỉ nhận giữ hộ không giảm mua ròng/quà ròng.

Nếu thay vì nhận lại quà, người có quyền miễn thu hồi 2 quà, khách vẫn giữ 2. Khi mua ròng trở lại 20 thì không giao thêm. Waiver có nguồn quà/scope/version; nếu khách trả lại quà đã miễn, giảm đồng thời lượng đang giữ và lượng miễn còn giữ. Chính sách này tránh cộng quà miễn vào quyền hưởng hoặc dùng một waiver cũ để miễn mọi lần về sau.

### 3.2. Hoàn nguồn và kỳ khóa

Nguồn xuất 2 đơn vị trị giá 6.667: trả lần đầu 3.334, lần cuối 3.333. Nếu giá vốn nguồn được điều chỉnh thành 6.768 sau lần trả đầu, phần điều chỉnh cho lượng đã nhận trả là 50; lần trả còn lại 3.384. Tổng 3.334+50+3.384=6.768. Chênh lệch được ghi bằng chứng từ/version mới theo kỳ cho phép, không sửa âm thầm kỳ khóa.

## 4. Kết quả theo sáu mục tiêu BS

| Mục tiêu | Đã thực hiện trong đợt R008 | Điều chưa thể kết luận |
|---|---|---|
| BS-01 — đặc tả hiện hành | Hợp nhất bản ứng viên, chọn phương án đề nghị cho Q01–Q10, ma trận M01–M22, trạng thái/role/truy vết | Chưa được Owner/nghiệp vụ chấp nhận; chưa biến thành schema phát triển cố định |
| BS-02 — quy tắc/số liệu | Hoàn quà/giá vốn/terms/thuế giả lập; nhiều SKU/UoM/ngày; chạy script và lưu JSON | Chưa có hồ sơ thuế/SKU thật hoặc kế toán/provider xác nhận; chưa chạy engine |
| BS-03 — hóa đơn/vận chuyển | Kiểm nguồn luật và tài liệu provider công khai; định nghĩa profile, adapter/state và đường chứng từ cấp xe; ca sandbox chi tiết | Chưa có tài khoản được cấp, chưa gọi sandbox/provider, chưa chứng minh B fully offline |
| BS-04 — offline/phục hồi | Contract ACK/restore/downsync/compound; mô hình hữu hạn và đối chứng; runbook có gate | Chưa chạy thiết bị/DB/filesystem/provider thật; chưa đo RPO/RTO hoặc kiểm cách ly hạ tầng |
| BS-05 — chu kỳ/kế toán | Fixture nhiều ngày + sau kỳ khóa, phí muộn, kiểm kê trong phạm vi; contract import/export và đường ngoại lệ | Chưa có chứng từ thật, importer/kế toán hoặc đối soát vận hành thật |
| BS-06 — pilot/giá trị | Tiêu chí tuyển, hồ sơ dữ liệu, bài UX, KPI/cost và điều kiện cutover được soạn đầy đủ | Chưa có người tham gia/baseline/usage/cost/trả phí, nên chưa kết luận giá trị thương mại |

Không quy đổi bảng này thành một tỷ lệ % hoàn thành MVP. Bằng chứng tài liệu, mô hình, thiết bị/tích hợp và pilot là các lớp khác nhau.

## 5. Bộ số liệu mới giải quyết được gì?

Các mã hàng, số lượng, đơn giá, terms, mức thuế 8%/10% và cách xử lý quà đều là **đầu vào giả lập**. Chúng không xác nhận thuế suất hoặc đủ điều kiện khuyến mại cho SKU thật. JSON đánh dấu `invoice_eligible=false`; hồ sơ thật chưa được xác nhận thì không phát hành theo fixture này.

Fixture dùng nhiều SKU/UoM, A giao nhiều lần, B giá đã gồm thuế, chiết khấu có phần dư, trả/quà, thu/hoàn, nhận tiền vào quỹ/ngân hàng, nhập ngày tiếp theo, phí mua biết muộn và trả từ nguồn đã điều chỉnh sau kỳ khóa. Sau mỗi mốc có số lượng/giá trị/nợ/tiền để đối chiếu.

| Mốc/tổng đã tái lập | Kết quả giả lập |
|---|---:|
| Cuối ngày 2: giá trị tồn | 1.307.000 |
| Cuối ngày 2: tiền hàng ròng + thuế | 532.682 + 47.365 = 580.047 |
| Cuối ngày 2: tiền + phải thu | 460.000 + 120.047 = 580.047 |
| Phí mua muộn 6.001: vào tồn + chi phí nguồn A + chi phí nguồn B | 4.401 + 1.000 + 600 = 6.001 |
| Nhận trả 2 đơn vị Q từ giá vốn nguồn version mới | Giá vốn 40.400; giá trị giảm nghĩa vụ 64.926 |
| Sau điều chỉnh/trả: tồn + chi phí = tổng giá trị hàng đầu vào | 1.351.801 + 352.200 = 1.704.001 |
| Sau điều chỉnh/trả: tiền hàng ròng + thuế = tiền + phải thu | 473.658 + 41.463 = 460.000 + 55.121 = 515.121 |

Nguồn số và toàn bộ mốc: [JSON số liệu](ket-qua-so-lieu.json). Phần hoàn giá vốn, phân bổ chiết khấu và tiền/thuế được kiểm tra riêng để tổng cuối đúng không che lỗi trung gian. Phương pháp chính thức vẫn cần kế toán chấp nhận và provider đối chiếu.

### Hạn trả và tiền bán–thu

Theo phương án terms: A snapshot 7 ngày khi xác nhận; giao ngày 01/11 và 08/11 tạo hạn 08/11 và 15/11. Đổi Customer thành 14 ngày không đổi đơn cũ; đơn mới giao 08/11 có hạn 22/11. Nếu đổi phần chưa giao của đơn cũ thì phải có amendment phiên bản rõ.

Compound bán 100/thu tiền đã xác nhận 100 tạo phải thu còn 0, tiêu quyền chịu 0. Bán 100/thu 60 tạo phần còn 40. Chuyển khoản đang chờ xác minh không được trừ như tiền đã nhận. Tiền có dư của khách chỉ tham gia offline nếu đã được server dành riêng trong grant; thu khoản nợ cũ không tự nạp lại quyền chịu offline.

## 6. Hóa đơn, vận chuyển và cập nhật pháp lý

R008 chọn cách làm theo **hồ sơ người bán + loại hóa đơn + phương thức lập + provider**, không suy một cơ chế dùng cho mọi NPP. Cần tách thời điểm lập với ký/gửi; đường bán B được mở theo khả năng lập hợp lệ thực sự được chứng minh, không chỉ vì PWA lưu được một bản nháp.

NĐ254/2026/NĐ-CP có quy định liên quan bán lưu động và phiếu xuất kho kiêm vận chuyển nội bộ. R008 bổ sung chu trình cấp xe–bán từng phần–hàng dư về và contract khi một hệ thống ngoài chịu trách nhiệm lập chứng từ. Không coi cấp hàng lên xe là bán hoặc tạo nợ [PL01](nguon-phap-ly.md#pl01).

Tài liệu public meInvoice có các trường định danh, tổng/dòng tiền–thuế và thông tin phiếu xuất kho; R008 dùng chúng để xây mapping cần kiểm tra. Tài liệu schema và ví dụ không chứng minh retry/idempotency, độ trễ tra cứu, loại chứng từ tài khoản được đăng ký hoặc việc API đang đáp ứng hồ sơ pilot. Các kết luận provider được giới hạn trong [phụ lục hóa đơn/dữ liệu](hoa-don-va-du-lieu.vi.md).

Đợt này cũng phân biệt thủ tục tại ngày nghiên cứu và văn bản sắp có hiệu lực: NQ22/2026/NQ-CP nằm trong chuỗi đang cần đối chiếu; NĐ392/2026/NĐ-CP có hiệu lực **15/11/2026**, sau ngày nghiên cứu **12/11/2026**, kèm quy định chuyển tiếp. Bảng hồ sơ phải xét ngày hoạt động/tiếp nhận, vai trò xử lý, thành phần/kênh nộp và cơ quan xử lý; không chỉ dẫn lại NĐ356 mà bỏ chuỗi sửa đổi. Không tự kết luận SaaS cần giấy chứng nhận khi chưa xác định hoạt động thuộc phạm vi [nguồn pháp lý](nguon-phap-ly.md).

## 7. E2E-13–22 đã được bổ sung đến lớp nào?

| Ca | Kết quả R008 | Trạng thái bằng chứng |
|---|---|---|
| 13 — quà giao–trả–giao | Quà ròng, miễn có nguồn, quà miễn trả lại | Số học/mô hình đã chạy; ứng dụng chưa chạy |
| 14 — phần dư giá vốn | Hoàn nguồn lũy kế, nhiều cách chia và source adjustment | Số học đã chạy; kế toán/engine chưa xác nhận |
| 15 — terms/hạn trả | Snapshot theo đơn/giao, đổi khách, amendment, biên múi giờ | Số học đã chạy; chính sách chưa chấp nhận |
| 16 — bán–thu kết hợp | 100/100, 100/60, pending bank, reserved credit | Số học/mô hình đã chạy; transaction thực chưa chạy |
| 17 — lệnh con trước cha | Durable ownership, restart/retry/cycle/timeout | Mô hình hữu hạn đã chạy; network/storage thật chưa chạy |
| 18 — gói tải dở | Snapshot activation, version/cursor/tombstone, giữ queue | Mô hình đã chạy; IndexedDB/Service Worker/device chưa chạy |
| 19 — restore quyền/dữ liệu/hóa đơn | Gate authority, đời không lặp, tái áp request, external lookup | Mô hình đã chạy; PITR/restore/key/provider thật chưa chạy |
| 20 — chứng từ cấp xe | Hồ sơ và state/ownership, ca provider, số hàng/chứng từ | Đối chiếu tài liệu và expected result; sandbox chưa chạy |
| 21 — chu kỳ tiếp theo/kỳ cũ | Nhiều ngày, phí muộn, count có phạm vi, trả source version | Số học đã chạy; nhập/kho/kế toán thật chưa chạy |
| 22 — viếng thăm không đơn | Visit/Observation/ReturnRequest tách khỏi hàng/nợ | Đặc tả + bài UX; chưa có prototype/người dùng để thử |

Các ca E2E-01–12 được nối vào ma trận yêu cầu của đặc tả; không xóa lịch sử hoặc nâng trạng thái các ca cũ chỉ vì đã có mô hình mới.

## 8. Cách chạy lại và đọc bằng chứng

Từ thư mục R008, chạy bằng Python 3 có thư viện chuẩn:

```bash
python3 kiem-chung-so-lieu.py --output ket-qua-so-lieu.json
python3 kiem-chung-giao-thuc.py --output ket-qua-giao-thuc.json
```

Script số liệu có đầu ra giả lập tái lập; script giao thức ghi thời điểm chạy và hash nguồn. Phải đọc phần `assumptions`/`not_tested` cùng kết quả. Các số lượng trường hợp/kiểm tra trong JSON là phạm vi hữu hạn của mô hình, không là tỷ lệ tin cậy của sản phẩm hoặc kết quả load test.

Mô hình giao thức giả định thao tác ghi bền/transaction và authority đúng theo định nghĩa, dùng JSON round-trip và bước atomic trong bộ nhớ để kiểm tra logic. Vì vậy nó giúp phát hiện mất chủ thể xử lý, kích hoạt phiên bản trộn hoặc phục hồi quyền sai trong mô hình, nhưng không chứng minh fsync, isolation, an toàn mật mã, browser lifecycle hoặc RPO/RTO của triển khai.

Riêng phục hồi giao dịch đã ghi sổ, R008 có contract lưu đầy đủ quyết định và posting plan trước khi công bố kết quả terminal. Mô hình hiện chưa thực hiện toàn bộ chu trình rollback ledger rồi tái dựng các bút toán đó; phần này vẫn cần spike và diễn tập riêng, ngoài các phép kiểm gate/registry đã chạy.

## 9. Quyết định tiếp theo đã đủ cụ thể để xem xét

Phần có thể tiếp tục từ tài liệu đã được chuyển thành đặc tả và ca tính. Trước khi giao triển khai một phần, cần chấp nhận các hàng Q ảnh hưởng phần đó và ánh xạ requirement–test; không cần chờ đủ kết quả thương mại mới xây mọi thứ.

Để mở các phần chưa thể kiểm chứng trong đợt này, cần năm nhóm đầu vào:

1. **Một hồ sơ NPP và vai trò phụ trách** đủ A/B, chủ hàng/bên xuất hóa đơn và người quyết định.
2. **Mẫu dữ liệu/chứng từ được phép sử dụng:** SKU/UoM/lô, giá/ưu đãi, terms, nhập–giao–trả–thu, số dư và kỳ khóa.
3. **Hồ sơ seller/provider và tài khoản test được cấp quyền**, gồm hóa đơn/chứng từ cấp xe và kênh lập trong điều kiện tuyến.
4. **Tập thiết bị/mạng/hạ tầng thử**, người thực hiện diễn tập và mục tiêu phục hồi theo ngân sách.
5. **Người chấp nhận chính sách và ngưỡng pilot**, để số liệu/contract trở thành điều kiện thực thi thay vì giả định nghiên cứu.

Kết thúc đợt R008 ở mức **đặc tả ứng viên + bằng chứng số học/mô hình + hồ sơ kiểm chứng ngoài hệ thống đã chuẩn bị**. Những điều kiện thiếu ở trên không được thay bằng đọc thêm nguồn tổng quát hoặc gán nhãn “MVP ready”.
