# R007-S — Nguồn, phép kiểm tra và giới hạn của review PR #1

- Ngày kiểm tra: **12/11/2026**, Asia/Bangkok; tương ứng phiên làm việc bắt đầu ngày 11/11/2026 UTC.
- Báo cáo: [R007](report.vi.md).
- Đề bài tiếp nối: [B007](../../briefs/2026-11-12-07-kiem-chung-va-chot-dac-ta-mvp.md).
- Phạm vi kết luận: tài liệu nghiên cứu và các phản ví dụ phân tích; không có mã ứng dụng, giao dịch thật hoặc nghiệm thu pilot trong lần review này.

## 1. Mốc tài liệu được review

| Thuộc tính | Giá trị đã đối chiếu |
|---|---|
| Repository | `chung6a8m/research-sme-phan-phoi-hang-tieu-dung` |
| Pull request | [PR #1](https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/pull/1) |
| Trạng thái lúc đọc | Open, draft; chưa merge |
| Nhánh | `research/2026-11-11-mvp-research-goals` |
| HEAD được review | `f267819bfa6a1587cacd8ace58265b9c0db93b71` |
| Base main | `2ce5ff38401fdc30774a6524d95014bd6bb45440` |
| Tree tại HEAD | `a918a4256ae0e5af485bf7c89fa1a6a6342ecf55` |
| Thay đổi của PR tại mốc này | 13 file, gồm README, R005/B005 và bộ R006 |
| Kiểm tra snapshot | Nội dung 22 file được theo dõi trong snapshot khớp blob SHA của remote HEAD |

Đã đọc diff/phạm vi file thay đổi và nội dung hiện hành; dùng báo cáo lịch sử để phân biệt yêu cầu đã chọn với đề xuất. Nhận xét dòng trong R007 gắn với HEAD trên. Commit thêm R007 sẽ làm HEAD của PR thay đổi; không dùng HEAD mới để giả định rằng các findings đã được sửa trong R006.

Theo [AGENTS.md](../../AGENTS.md), báo cáo mới được lưu vào repo và cập nhật mục lục. R001–R006 và các brief cũ được giữ như hồ sơ lịch sử. Việc lưu review không đồng nghĩa phê duyệt/merge PR hoặc chốt chính sách thay Owner.

## 2. Nguồn nội bộ và cách dùng

| Mã | Tài liệu | Cách dùng trong review |
|---|---|---|
| D01 | [README tại HEAD](https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/blob/f267819bfa6a1587cacd8ace58265b9c0db93b71/README.md) và [AGENTS](../../AGENTS.md) | Quyền lưu nghiên cứu, bối cảnh đã xác nhận, quy tắc bảo toàn tài liệu |
| D02 | [B002](../../briefs/2026-11-11-02-nghiep-vu-mvp-pwa.md), [R002-D01](../2026-11-11-02-nghiep-vu-mvp-pwa/quyet-dinh-va-thuat-ngu.vi.md), [R003](../2026-11-11-03-deep-research-mvp-kien-truc/report.vi.md) | A/B, nhân sự giao hàng, PWA, DB/tenant; yêu cầu viếng thăm/tình trạng hàng/yêu cầu trả |
| D03 | [R005](../2026-11-11-05-khoang-trong-va-muc-tieu-mvp/report.vi.md), [B005](../../briefs/2026-11-11-05-nghien-cuu-bo-sung-dat-mvp.md) | Mười mục tiêu nghiên cứu và điều kiện hoàn tất ban đầu |
| D04 | [R006 tổng hợp](../2026-11-11-06-ket-qua-nghien-cuu-mvp/report.vi.md) | Mức hoàn thành, Q01–Q10, các giới hạn bằng chứng và E2E-01–12 |
| D05 | [R006-B](../2026-11-11-06-ket-qua-nghien-cuu-mvp/nghiep-vu-va-so-lieu.vi.md), [nguồn nghiệp vụ](../2026-11-11-06-ket-qua-nghien-cuu-mvp/nguon-nghiep-vu.md) | Mô hình, quy tắc, số liệu, F02/F03, hạn trả và khả năng nối nhiều ngày |
| D06 | [R006-T](../2026-11-11-06-ket-qua-nghien-cuu-mvp/pwa-va-van-hanh-tenant.vi.md), [nguồn kỹ thuật](../2026-11-11-06-ket-qua-nghien-cuu-mvp/nguon-ky-thuat.md) | F01/F04, downsync, compound command, nguồn epoch sau restore và ca kiểm chứng |
| D07 | [R006-L](../2026-11-11-06-ket-qua-nghien-cuu-mvp/hoa-don-va-tuan-thu.vi.md), [nguồn pháp lý](../2026-11-11-06-ket-qua-nghien-cuu-mvp/nguon-phap-ly.md) | Yêu cầu áp lại quyền/dữ liệu sau restore, chứng từ cấp xe và nguồn luật cần cập nhật |
| D08 | [R006-P](../2026-11-11-06-ket-qua-nghien-cuu-mvp/pilot-va-tich-hop.vi.md), [sổ nguồn tổng](../2026-11-11-06-ket-qua-nghien-cuu-mvp/sources.md) | Phân khúc, INV-01–09, import/cutover, sáu tác vụ UX và KPI; phân biệt kế hoạch với kết quả |

Các nguồn nằm trong R006 không tự được coi là đã kiểm tra lại toàn bộ trong R007. Review kiểm tra chọn lọc nguồn ngoài bên dưới và đối chiếu nội bộ trực tiếp.

## 3. Nguồn ngoài đã kiểm tra chọn lọc

### W01

**Nghị định 254/2026/NĐ-CP về hóa đơn, chứng từ điện tử.**

- [Trang metadata của Chính phủ](https://vanban.chinhphu.vn/?docid=218689&pageid=27160&typegroupid=4).
- [Bản ký PDF](https://datafiles.chinhphu.vn/cpp/files/vbpq/2026/7/254-ndcp.signed.pdf).
- Đã mở metadata và bản ký; đọc hình các trang PDF 11, 16, 52 liên quan. Metadata ghi ban hành 30/06/2026, hiệu lực 01/07/2026.
- Phần sử dụng: Điều 6 khoản 3 điểm đ về bán hàng lưu động và chứng từ xuất hàng vận chuyển; Điều 8 khoản 7 về quản lý loại chứng từ ấy; Điều 9 về thời điểm lập/giao từng phần; quy định lập–ký–gửi trong phụ lục liên quan.
- Suy luận cho MVP: bảng kiểm chứng provider phải bao gồm đường chứng từ khi cấp xe, hoặc chỉ rõ hệ thống/bên ngoài chịu trách nhiệm. Thời hạn ký/gửi không tự chứng minh có thể lùi thời điểm lập hóa đơn.
- Giới hạn: không kết luận mọi loại người bán, hàng hóa hoặc hình thức offline dùng cùng một hồ sơ áp dụng. Không tuyên bố đã rà soát mọi điều khoản của văn bản.

### W02

**Nghị quyết 22/2026/NQ-CP về cắt giảm, phân cấp, đơn giản hóa thủ tục trong phạm vi quản lý của Bộ Công an.**

- [Trang metadata](https://vanban.chinhphu.vn/?classid=1&docid=217978&orggroupid=2&pageid=27160).
- [Bản ký PDF](https://datafiles.chinhphu.vn/cpp/files/vbpq/2026/4/22-nqcp.signed.pdf).
- Đã mở metadata/bản ký; review phần phụ lục về bảo vệ dữ liệu cá nhân, gồm thành phần thủ tục và đầu mối tiếp nhận/phân cấp. Nhóm review đọc các trang PDF 24–27; người tổng hợp kiểm tra hình trang 26.
- Cách dùng: bổ sung chuỗi nguồn khi xác định thủ tục thực tế theo hoạt động của pilot. Không coi việc thiếu URL trong R006 tự nó chứng minh một nghĩa vụ hoặc thời hạn đã bị áp sai.
- Giới hạn: chưa có cấu hình xử lý dữ liệu, hợp đồng hoặc ngày nộp hồ sơ của một pilot cụ thể; chưa kết luận tất cả thủ tục đều áp dụng cho SaaS.

### W03

**Nghị định 392/2026/NĐ-CP sửa đổi các nghị định về thủ tục hành chính, điều kiện đầu tư kinh doanh trong lĩnh vực an ninh, trật tự.**

- [Trang metadata](https://vanban.chinhphu.vn/?classid=1&docid=220055&pageid=27160&typegroupid=4).
- [Bản ký PDF](https://datafiles.chinhphu.vn/cpp/files/vbpq/2026/10/392_2026_nd-cp_20102026-signed.signed.pdf).
- Metadata ghi ban hành **20/10/2026**, hiệu lực **15/11/2026**. Văn bản chưa có hiệu lực tại ngày review **12/11/2026**.
- Nhóm review đọc phần sửa đổi NĐ356/2025/NĐ-CP ở Chương VII và phần hiệu lực/chuyển tiếp; người tổng hợp kiểm tra hình trang PDF 31, 34, gồm Điều 42–43 và 47–49 ở các phần hiển thị tương ứng.
- Cách dùng: đưa thay đổi sắp có hiệu lực vào checklist pháp lý trước pilot, xét ngày hoạt động/nộp và điều khoản chuyển tiếp. Không dùng nó làm căn cứ hiện hành trước ngày có hiệu lực.
- Giới hạn: không chuyển nội dung thủ tục thành yêu cầu giấy phép/đăng ký sản phẩm nếu chưa xác định vai trò và hoạt động thực tế.

### W04

**MDN — Background Synchronization API.**

- [Tài liệu của MDN](https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API).
- Đã mở trang; trạng thái hỗ trợ được ghi là limited availability, chưa thuộc Baseline vì một số trình duyệt phổ biến chưa hỗ trợ.
- Cách dùng: củng cố yêu cầu kiểm chứng trên tập thiết bị/trình duyệt thật; không thay thế thử nghiệm PWA, IndexedDB, vòng đời app hoặc khả năng khôi phục dữ liệu.
- Không suy ra rằng mọi PWA đều thiếu offline hoặc phải đổi sang native.

## 4. Phép kiểm tra số học đã thực hiện

### 4.1. Fixture chính R006

Đã chạy lại đoạn Python Decimal trong R006-S nghiệp vụ và tính lại độc lập các tổng chính:

| Đại lượng | Kết quả |
|---|---:|
| Tồn cuối: kho chính + cách ly | 152 + 13 = 165 đơn vị |
| Giá trị tồn cuối | 1.815.000 đồng |
| Giá vốn hàng mua đã giao ròng | 759.000 đồng |
| Giá vốn quà ròng | 66.000 đồng |
| Tổng giá trị hàng đầu vào | 2.640.000 đồng |
| Doanh số ròng của fixture trước thuế | 957.000 đồng |
| Phải thu còn lại | 342.000 đồng |
| Tiền nhân viên giữ sau hoàn | 235.000 đồng |
| Tiền đã vào ngân hàng | 380.000 đồng |

Hai phương trình cân: 1.815.000 + 759.000 + 66.000 = 2.640.000; 342.000 + 235.000 + 380.000 = 957.000. Đây là số giả lập của R006, không phải số liệu NPP hoặc bằng chứng engine đã chạy.

### 4.2. Phản ví dụ F02/F03

- **F02:** hàng trả đã được chấp nhận thương mại và nhận lại; mua ròng sau chuỗi giao–trả–giao là 20; quà ròng khách giữ là 0. Quyền mua 10 tặng 1 là 2. Trừ quà từng giao cho 0 cần giao thêm; trừ quà ròng cho 2. Kết quả phụ thuộc cách định nghĩa đại lượng mà tài liệu chưa khóa.
- **F03:** giá vốn nguồn 6.667 chia cho 2 rồi làm tròn độc lập cho 6.668 khi trả đủ. Phân bổ tích lũy cho 3.334 + 3.333 = 6.667. Đây là một phương án minh họa để xem xét, không tự chốt chính sách giá vốn.

Đoạn dưới tái lập cả fixture và phản ví dụ; đã chạy các assertion. Nó là phép tính nghiên cứu, không phải mã triển khai sản phẩm.

```python
from decimal import Decimal as D, ROUND_HALF_UP

def vnd(value):
    return value.quantize(D("1"), rounding=ROUND_HALF_UP)

# Fixture R006, trước thuế.
stock_in = D(120) * 10000 + D(1380000) + 60000
average = stock_in / 240
a = (D(12) + 8) * (D(168000) / 12) * (1 - D("0.10"))
b1 = D(20) * 15000
b2 = D(40) * 15000 * (1 - D("0.05"))
credit = D(11) * 15000
refund = D(200000) - (b1 - credit)
ar = (a - 100000 - 80000) + (b1 - credit - 200000 + refund) + (b2 - 300000)
employee_cash = D(100000) + 200000 - refund
bank = D(80000) + 300000
net_sales = a + b1 + b2 - credit
main_qty = D(240) - 126 + (126 - 22 - 66)
quarantine_qty = D(11) + 2
ending_value = (main_qty + quarantine_qty) * average
purchased_cost = (D(20) + 60 - 11) * average
gift_cost = (D(2) + 6 - 2) * average
assert (main_qty, quarantine_qty, ending_value) == (152, 13, 1815000)
assert (purchased_cost, gift_cost) == (759000, 66000)
assert stock_in == ending_value + purchased_cost + gift_cost == 2640000
assert (ar, employee_cash, bank) == (342000, 235000, 380000)
assert net_sales == ar + employee_cash + bank == 957000

# F02: đơn A còn phần chưa giao; hàng trả đã được chấp nhận/nhận lại.
# Chưa có ngoại lệ miễn thu hồi.
net_purchased = 20 - 11 + 11
gifts_delivered, gifts_returned = 2, 2
entitlement = net_purchased // 10
literal_due = max(0, entitlement - gifts_delivered)
net_due = max(0, entitlement - (gifts_delivered - gifts_returned))
assert (literal_due, net_due) == (0, 2)

# F03: nguồn xuất q=2 có giá trị C=6667; hai lần trả đã được chấp nhận.
initial_value, initial_qty = D(10000), D(3)
q = D(2)
c = vnd(initial_value * q / initial_qty)
remaining_value = initial_value - c
independent_returns = vnd(c / q) + vnd(c / q)
first_return = vnd(c * D(1) / q)
second_return = vnd(c * D(2) / q) - first_return
assert (c, remaining_value, independent_returns) == (6667, 3333, 6668)
assert remaining_value + independent_returns == 10001
assert (first_return, second_return) == (3334, 3333)
assert first_return + second_return == c
assert remaining_value + first_return + second_return == initial_value
print("PASS: R006 balances; F02 gift counterexample; F03 residual allocation")
```

Không yêu cầu giá vốn từng lần phải bất biến trước mọi thứ tự nhập/xuất khác nhau. Phép kiểm tra chỉ yêu cầu tổng giá trị hoàn không vượt hoặc thiếu giá vốn nguồn được phép hoàn do chia nhỏ chứng từ trả.

## 5. Cách diễn giải findings và đề xuất

- F01 là thiếu bước/nguồn thẩm quyền trong runbook, với tình huống membership hoặc trạng thái yêu cầu dữ liệu bị rollback. Không khẳng định repo có lỗ hổng chạy thật.
- F02/F03 là phản ví dụ được quy tắc chưa đầy đủ cho phép; không phủ nhận các tổng chính R006 đã cân.
- F04 là chưa rõ trách nhiệm sau receipt. Journal có thể giữ lại payload; không khẳng định lệnh chắc chắn mất vĩnh viễn.
- Độc lập ID phiếu thu không chứng minh bắt buộc tách transaction/command. Ca bán–thu và hạn mức được đưa vào mục tiêu đặc tả, không gán thành bug.
- Đã có nhận hàng/điều chỉnh trong R006, và fixture trước thuế được công bố rõ. Nghiên cứu thêm nối chu kỳ và thuế là hoàn thiện bằng chứng, không sửa một tuyên bố che giấu.
- BS-01–06 và E2E-13–22 là **đề nghị tiếp nối** NC-01–10, chưa là quyết định Owner hoặc kết quả nghiệm thu.

## 6. Giới hạn còn lại

Không có phỏng vấn/quan sát mới, hồ sơ SKU thật, hợp đồng giá/đổi trả, dữ liệu nhập thật, tài khoản sandbox do pilot cấp, thử thiết bị, diễn tập restore, kết quả UX, báo giá hoặc quyết định mua. Không kiểm toán toàn bộ pháp lý và không xác nhận nghĩa vụ cụ thể của một doanh nghiệp chưa được chọn.

Mức ưu tiên P1/P2 là ưu tiên khép tài liệu/contract, không phải phân loại sự cố bảo mật đã xảy ra. Những thiếu hụt thực địa mà R006 đã nêu được giữ đúng là công việc mở; review không mô tả chúng như tác giả đã tuyên bố hoàn thành.
