# Nguồn nghiệp vụ và hồ sơ kiểm tra số liệu — NC-02–NC-06

- Ngày đọc/đối chiếu: **11/11/2026**.
- Báo cáo sử dụng: [Nghiệp vụ và số liệu](nghiep-vu-va-so-lieu.vi.md).
- Phương pháp đã thực hiện: đọc tài liệu dự án; tìm kiếm và đọc trích xuất tài liệu chính thức; so sánh phương án thiết kế; lập dữ liệu tổng hợp; kiểm tra phép tính bằng Python Decimal.
- Phân loại: tài liệu ERP là nguồn sơ cấp cho hành vi do nhà cung cấp mô tả; GS1 là nguồn tổ chức tiêu chuẩn cho cấp đóng gói. Không có dữ liệu thị trường hoặc thực địa được suy ra từ các nguồn này.

## 1. Nguồn sơ cấp được sử dụng

### B01 — Microsoft Business Central: Set up units of measure

- URL: <https://learn.microsoft.com/en-us/dynamics365/business-central/inventory-how-setup-units-of-measure>.
- Đã đọc: 11/11/2026; trang mở được phần nội dung dù có dòng điều hướng thông báo đăng nhập. Trang hiển thị cập nhật 07/04/2026.
- Phần dùng: phần giới thiệu; “To set up multiple item units of measure”; trường “Quantity Rounding Precision”.
- Sự kiện được hỗ trợ: đơn vị tồn gốc, đơn vị thay thế và hệ số theo mặt hàng; có cấu hình độ chính xác lượng.
- Giới hạn: hướng dẫn Business Central; không xác nhận quy cách thùng/lốc hoặc độ chính xác hàng cân của NPP pilot. Snapshot và chính sách từ chối phần chai là đề xuất dự án.

### B02 — GS1 US: Packaging Level Definitions

- URL: <https://www.help.gs1us.org/packaging-level>.
- Đã đọc: 11/11/2026; mở và đọc bảng cấp đóng gói.
- Phần dùng: “Packaging Level Definitions”, các hàng “Each”, “Inner Pack”, “Case”, “Mixed Case”.
- Sự kiện được hỗ trợ: bao gói có các cấp khác nhau; danh tính mã hàng cần gắn đúng cấp bao gói.
- Giới hạn: trang giải thích trong GS1 US Data Hub, không phải hướng dẫn pháp lý về mã vạch tại Việt Nam; không dùng để kết luận mọi cấp bao gói nội bộ đều phải có GTIN hoặc phải mua dịch vụ GS1.

### B03 — ERPNext: FIFO and Moving Average

- URL: <https://docs.frappe.io/erpnext/fifo-and-moving-average>.
- Đã đọc: 11/11/2026; đọc nội dung qua kết quả tìm kiếm chính thức, sau đó mở URL trực tiếp được.
- Phần dùng: “2. FIFO”, “3. Moving Average”, “5. The shared limitation: backdated entries trigger reposting”.
- Sự kiện được hỗ trợ: FIFO dùng lớp giá nhập; bình quân di động sử dụng lượng/giá trị còn và nhập mới; thay đổi quá khứ có thể phải tính lại giao dịch sau trong ERPNext.
- Giới hạn: phần bình luận về chuẩn mực/thuế và sự phù hợp ngành là nhận định nhà cung cấp, không dùng làm kết luận cho Việt Nam. FIFO về giá trị không đồng nghĩa đúng lô vật lý/FEFO. Việc chọn bình quân theo địa điểm là đề xuất MVP, không quyết định Owner.

### B04 — Microsoft Business Central: Managing inventory costs

- URL: <https://learn.microsoft.com/en-us/dynamics365/business-central/finance-manage-inventory-costs>.
- Đã đọc: 11/11/2026; nội dung mở được.
- Phần dùng: bảng tác vụ “Define inventory periods”; “Exact Cost Reversing Mandatory”; “Adjust item costs”.
- Sự kiện được hỗ trợ: có khóa kỳ tồn, áp hàng trả vào lần xuất gốc và điều chỉnh chi phí tới các giao dịch liên quan.
- Giới hạn: không khẳng định toàn bộ cơ chế tính lại Business Central cần có trong MVP. Cách xử lý phí mua muộn bằng chứng từ điều chỉnh được duyệt là giới hạn thiết kế của nghiên cứu.

### B05 — Odoo 19.0: FEFO removal

- URL: <https://www.odoo.com/documentation/19.0/applications/inventory_and_mrp/inventory/shipping_receiving/removal_strategies/fefo.html>.
- Đã đọc: 11/11/2026, **qua nội dung được công cụ tìm kiếm trích xuất từ trang Odoo chính thức**. Các lần mở URL trực tiếp bị timeout; không ghi nhận đã kiểm tra giao diện Odoo.
- Phần dùng: “Enabling the FEFO removal strategy”, “Removal date”, “Workflow”.
- Sự kiện được hỗ trợ: FEFO chọn hàng theo ngày cần đưa ra khỏi kho; cần dữ liệu lô/ngày để vận hành.
- Giới hạn: không suy FIFO giá vốn từ FEFO; không áp công thức ngày hết hạn dựa ngày nhập cho hàng đã có nhãn hạn thực tế. Tài liệu không chứng minh mức độ cần FEFO của từng ngành hàng pilot.

### B06 — ERPNext: Pricing Rule

- URL: <https://docs.frappe.io/erpnext/pricing-rule>.
- Đã đọc: 11/11/2026; mở và đọc phần nội dung sau mục lục.
- Phần dùng: “Before you begin”; “Important fields and what they mean”; “Choose the pricing result”; “Product discounts”.
- Sự kiện được hỗ trợ: quy tắc có thể đổi giá, giảm tiền/tỷ lệ hoặc thêm hàng tặng, với điều kiện và ưu tiên.
- Giới hạn: không lấy toàn bộ tính năng ERPNext làm yêu cầu MVP. Thứ tự Customer–nhóm–kênh–mặc định, giới hạn cộng dồn, tính quà theo lượng giao và xử lý thiếu quà đều là đề xuất của nghiên cứu.

### B07 — ERPNext: Payment Entry

- URL: <https://docs.frappe.io/erpnext/payment-entry>.
- Đã đọc: 11/11/2026; mở, đọc mục nghiệp vụ và các câu hỏi về phân bổ.
- Phần dùng: “Why use a Payment Entry?”; “How a Payment Entry affects the ledger”; “Can one Payment Entry settle several invoices for the same party?”.
- Sự kiện được hỗ trợ: có thu một phần, tiền chưa phân bổ, một phiếu phân bổ nhiều khoản cùng bên; chuyển nội bộ và thu khách là các sự kiện khác nhau.
- Giới hạn: sổ công nợ vận hành đề nghị ở mốc giao/chuyển giao không phải bản sao chu trình invoice-first của ERPNext. Nguồn không xác định thời điểm kế toán/hóa đơn Việt Nam hoặc quyền thu của nhân viên.

### B08 — Frappe HR: Employee Advance

- URL: <https://docs.frappe.io/hr/employee-advance>.
- Đã đọc: 11/11/2026; mở và đọc phần tạo, phê duyệt, chi tiền, quyết toán/hoàn.
- Phần dùng: “Employee Advance Submission”; “Make Payment Entry”; “Adjust Advances on Expense Claim”; “Return Amount”; lưu ý hành vi sổ v16.
- Sự kiện được hỗ trợ: yêu cầu tạm ứng tách với khoản đã chi; có liên kết quyết toán và hoàn tiền chưa dùng.
- Giới hạn: không đưa toàn bộ HR/kế toán chi phí vào MVP. Không suy rằng tiền thu hộ là tạm ứng hoặc khoản chênh lệch tự động là nợ nhân viên.

## 2. Tài liệu dự án đã đối chiếu

| Tài liệu | Vai trò trong nghiên cứu |
|---|---|
| [AGENTS.md](../../AGENTS.md) và [README](../../README.md) | Quy tắc bảo toàn lịch sử, trạng thái bằng chứng và phạm vi dự án |
| [B005](../../briefs/2026-11-11-05-nghien-cuu-bo-sung-dat-mvp.md) | Các câu hỏi NC-02–NC-06 và yêu cầu ví dụ có số dư |
| [D01](../2026-11-11-02-nghiep-vu-mvp-pwa/quyet-dinh-va-thuat-ngu.vi.md) | Quyết định A/B, nhân sự xe máy/xe tải; glossary đề xuất trước |
| [R003](../2026-11-11-03-deep-research-mvp-kien-truc/report.vi.md) | Quyết định tenant-per-database; yêu cầu giá vốn/UoM/công nợ/pricing |
| [R004](../2026-11-11-04-deep-research-erd-nghiep-vu/report.vi.md) | Mô hình khái niệm và ví dụ cần hợp nhất |
| [R005](../2026-11-11-05-khoang-trong-va-muc-tieu-mvp/report.vi.md) | Khoảng trống, E2E-01–E2E-12 và việc phân biệt nghiên cứu với pilot |

Các tài liệu cũ không được sửa trong nhánh nghiên cứu nghiệp vụ này. Nhận định chưa xác minh của báo cáo cũ không được biến thành bằng chứng mới bằng cách đặt thêm URL bên cạnh.

## 3. Hồ sơ kiểm tra số học đã thực hiện

### 3.1. Phạm vi và kết quả

Ngày 11/11/2026 chạy Python với `decimal.Decimal` để tính bộ ví dụ mục 7 và dùng `assert` đối chiếu các tổng. Không kết nối cơ sở dữ liệu, ERP, PWA hoặc nhà cung cấp hóa đơn; đây **không phải kiểm thử sản phẩm**.

| Đẳng thức đã đối chiếu | Kết quả |
|---|---|
| Giá trị hai lần nhập / tổng lượng | 2.640.000 / 240 = 11.000 |
| Hai lần giao A | 151.200 + 100.800 = 252.000 |
| B1 bán/trả/thu/hoàn | 300.000 − 165.000 − 200.000 + 65.000 = 0 |
| B2 bán sau giảm / nợ | 570.000 / 270.000 |
| Tồn cuối kho chính + cách ly | 152 + 13 = 165 |
| Giá trị nhập = tồn cuối + chi phí hàng ròng | 2.640.000 = 1.815.000 + 825.000 |
| Tiền bán ròng = nợ + thu hộ ròng + chuyển khoản | 957.000 = 342.000 + 235.000 + 380.000 |
| Tạm ứng còn phải quyết toán | 300.000 − 180.000 − 120.000 = 0 |
| Giảm tiền toàn đơn | 10.001 = 6.667 + 3.334 |

Kết quả chạy: các assertion trọng yếu đạt. Các con số tiền là trước lớp thuế theo giả định riêng của fixture. Dữ liệu không phải baseline kinh doanh; không chứng minh hợp lệ pháp lý của hàng tặng, thuế hoặc thời điểm lập hóa đơn.

### 3.2. Đoạn tính tái lập các tổng chính

Đây là mô tả phép tính nghiên cứu, không phải mã triển khai được đề nghị cho sản phẩm.

```python
from decimal import Decimal as D

stock_in = D(120) * 10000 + D(1380000) + 60000
average = stock_in / 240
a = (D(12) + 8) * (D(168000) / 12) * (1 - D('0.10'))
b1 = D(20) * 15000
b2 = D(40) * 15000 * (1 - D('0.05'))
credit = D(11) * 15000
refund = D(200000) - (b1 - credit)
ar = (a - 100000 - 80000) + (b1 - credit - 200000 + refund) + (b2 - 300000)
employee_cash = D(100000) + 200000 - refund
bank = D(80000) + 300000
net_sales = a + b1 + b2 - credit
main_qty = D(240) - 126 + (126 - 22 - 66)
quarantine_qty = D(11) + 2
ending_value = (main_qty + quarantine_qty) * average
cost_out = (D(20) + 60 - 11 + 2 + 6 - 2) * average
assert (average, ar, employee_cash, bank) == (11000, 342000, 235000, 380000)
assert (main_qty, quarantine_qty, ending_value) == (152, 13, 1815000)
assert stock_in == ending_value + cost_out == 2640000
assert net_sales == ar + employee_cash + bank == 957000
assert D(300000) - 180000 - 120000 == 0
```

## 4. Ranh giới bằng chứng

**Đã có:** tham chiếu chính thức, lựa chọn có đánh đổi, mô hình quan hệ, ma trận sự kiện/quyền, quy tắc tính và ví dụ cân bằng. **Chưa có:** danh mục/quy cách thật, phương pháp kế toán của pilot, hợp đồng giá/đổi trả, phiếu thu/nộp thật, quyết định Owner, kiểm thử engine hoặc ngày kinh doanh thực tế.

Phần pháp lý/hóa đơn và kiểm chứng offline thuộc nghiên cứu NC-07–NC-09. Nghiên cứu này cung cấp dữ liệu đầu vào nghiệp vụ; không dùng tài liệu ERP nước ngoài làm căn cứ áp dụng quy định Việt Nam.
