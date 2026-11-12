# R008 — Nguồn nghiệp vụ và bằng chứng số học

- Báo cáo sử dụng: [R008-B](nghiep-vu-va-so-lieu.vi.md).
- Ngày đọc: **12/11/2026 theo Asia/Bangkok**. Một phần lượt mở tương ứng 11/11/2026 cuối ngày UTC; không coi ngày trên dữ liệu giả lập là ngày đã vận hành thực.
- Phương pháp: đọc baseline dự án; mở trực tiếp các trang sơ cấp dưới đây; phân tích phương án; lập mô hình Decimal bằng thư viện chuẩn; thực chạy và lưu JSON. Không phỏng vấn NPP, không đăng nhập ERP/provider, không chạy hệ thống kế toán, PWA hoặc sandbox hóa đơn.

<a id="1-nguon-so-cap-da-doc"></a>

## 1. Nguồn sơ cấp đã đọc

<a id="nb01--microsoft-item-application"></a>

### NB01 — Microsoft Item application

- URL: <https://learn.microsoft.com/en-us/dynamics365/business-central/design-details-item-application>.
- Đã mở trực tiếp nội dung ngày 12/11/2026; trang có thông báo đăng nhập ở điều hướng nhưng phần nội dung đọc được.
- Phần thực đọc: giới thiệu quantity/value entry và liên kết cost source/recipient; “Inventory Decrease”; “Fixed Application”, đặc biệt ví dụ sales return liên kết sales shipment.
- Thông tin dùng: sản phẩm có liên kết trả hàng về lần xuất để mang giá trị nguồn sang giao dịch trả. Đây là bằng chứng hành vi thiết kế của Business Central.
- Không suy ra: công thức `round(C*k/q)` là công thức Microsoft; bình quân theo địa điểm của dự án đã được chuẩn mực Việt Nam chấp nhận; mọi NPP dùng phương pháp này. Các quy tắc phần dư, phiên bản nguồn và acceptance trong R008 là đề xuất của dự án.

<a id="nb02--microsoft-cost-adjustment"></a>

### NB02 — Microsoft Cost adjustment

- URL: <https://learn.microsoft.com/en-us/dynamics365/business-central/design-details-cost-adjustment>.
- Đã mở trực tiếp ngày 12/11/2026.
- Phần thực đọc: mục đích chuyển cost changes từ nguồn tới bên nhận; “Detecting the adjustment”; “Manual versus automatic cost adjustment”, gồm value entries bù điều chỉnh/làm tròn và trường hợp kỳ khóa dùng kỳ mở tiếp theo.
- Thông tin dùng: phí/giá mua biết muộn có thể tác động hàng đã xuất, cần liên kết và đối chiếu; nguồn mô tả điều chỉnh kỳ mở trong các tình huống khóa kỳ của sản phẩm.
- Không suy ra: tự động nhập toàn bộ phí vào tồn còn là đúng; mọi chế độ kế toán Việt Nam bắt buộc ngày ghi giống sản phẩm; MVP phải xây engine hồi tố đầy đủ. Phân bổ 6.001 trong fixture là giả định có đường nguồn rõ, chưa có kế toán phê duyệt.

<a id="nb03--microsoft-payment-terms"></a>

### NB03 — Microsoft Payment terms

- URL: <https://learn.microsoft.com/en-us/dynamics365/business-central/finance-payment-terms>.
- Đã mở trực tiếp ngày 12/11/2026; trang hiển thị “Last updated on 2025-05-02”.
- Phần thực đọc: phần mở đầu, “To set up payment terms”, “Audit changes to payment terms”.
- Thông tin dùng: điều khoản có công thức hạn; mặc định từ Customer/Vendor có thể thay trên chứng từ, ngày chứng từ được dùng trong cơ chế của sản phẩm; có audit thay đổi.
- Giới hạn quyết định: **nguồn dùng ngày chứng từ, không xác nhận ngày giao là bắt buộc**. R008 chọn ngày giao địa phương làm anchor cho công nợ vận hành, khóa thỏa thuận tại đơn A và giữ bản chụp từng khoản. N ngày lịch, amendment và quy tắc không đổi khoản cũ là đề xuất cần người chịu trách nhiệm chấp nhận.

<a id="nb04--python-decimal"></a>

### NB04 — Python Decimal

- URL: <https://docs.python.org/3/library/decimal.html>.
- Đã mở nội dung/tra mục trực tiếp ngày 12/11/2026; phần đầu công cụ hiển thị Python 3.15.2 documentation. Script dùng các API Decimal ổn định có trong runtime hiện có, không yêu cầu cài 3.15.
- Phần thực đọc: “Quick-start tutorial”, cảnh báo tạo Decimal từ float, `FloatOperation`, `quantize`, “Rounding modes”, định nghĩa ROUND_HALF_UP.
- Thông tin dùng: số decimal có precision/rounding cấu hình; float truyền vào có thể giữ giá trị nhị phân; ROUND_HALF_UP xử lý trường hợp nửa theo phía xa 0.
- Giới hạn: Decimal không tự chọn điểm làm tròn hoặc phân bổ phần dư. Precision50, nguyên VND, largest remainder và mục tiêu trả lũy kế là chính sách ứng viên của R008.

<a id="nb05--frappe-gia-gom-thue-va-giam-toan-bo"></a>

### NB05 — Frappe giá gồm thuế và giảm toàn bộ

- URL mở được: <https://docs.frappe.io/calculation-in-case-of-tax-inclusive-item-price-and-additional-discount-on-grand-total>.
- Đã mở trực tiếp ngày 12/11/2026. Trang nằm dưới “Erpnext v13 user manual en”, hiển thị cập nhật tương đối “10 months ago”; không chuyển con số tương đối thành ngày cập nhật chính xác.
- Phần thực đọc: ví dụ, “Step1: Calculation without additional discount”, “Step2: Calculation with additional discount”.
- Thông tin dùng: ví dụ tách thành phần net/thuế trong giá gồm thuế và chia tác động khoản giảm vào các thành phần.
- Giới hạn: ví dụ bằng ngoại tệ, có shipping; không là chuẩn VAT Việt Nam hay bằng chứng engine ERPNext hiện tại. Fixture R008 không có phí vận chuyển đầu ra; các thuật toán nguyên đồng/per-line/source return là đề nghị riêng.
- URL thử có đoạn `/erpnext/` trả lỗi không truy cập được; không dùng lượt lỗi đó làm chứng cứ đã đọc nội dung.

<a id="nb06--meinvoice-schema-cong-khai"></a>

### NB06 — meInvoice schema công khai

- URL mở được: <https://testapp.meinvoice.vn/api/v2/content/invoicev3parameter.html>.
- Đã mở trực tiếp ngày 12/11/2026, đọc “Hóa đơn” và các trường/quan hệ nguồn; đối chiếu mục “Chi tiết Hóa đơn” trong phối hợp nghiên cứu hóa đơn.
- Phần dùng: `RefID`, `RefDetailID`, số tiền hàng/chiết khấu/VAT/tổng, `PaymentExpirationDate`, thông tin chứng từ gốc/điều chỉnh. Những trường này cho biết hướng mapping cần làm; không chứng minh endpoint sản xuất, quy tắc chữ ký hay xử lý lặp.
- Giới hạn: ví dụ số trong các alias tổng tiền không nhất quán; chưa xác nhận tự tính tiền, precision thật, mã tax treatment, lookup hay hỗ trợ các số điều chỉnh từ fixture. **Không coi có schema công khai là đã chọn/kiểm chứng provider.**
- URL thử <https://doc.meinvoice.vn/api/Document/InvoiceInfo.html> trả **404** khi mở trực tiếp trong đợt này; kết quả tìm kiếm còn thấy trường không biến thành contract đã đọc. Nguồn 404 chỉ được lưu như giới hạn truy cập.

## 2. Baseline và xuất xứ các quyết định

| Tài liệu đã đọc | Vai trò |
|---|---|
| [AGENTS.md](../../AGENTS.md), [README](../../README.md) | Quyền lưu nghiên cứu, giữ lịch sử và phân biệt kết quả với phê duyệt |
| [R007](../2026-11-12-07-review-pr1-va-muc-tieu-tiep-theo/report.vi.md) | Phản ví dụ F02/F03, sáu gói bổ sung, E2E-13–22 |
| [B007](../../briefs/2026-11-12-07-kiem-chung-va-chot-dac-ta-mvp.md) | BS-02/05 và điều kiện kế toán/người triển khai tính độc lập |
| [R006-B](../2026-11-11-06-ket-qua-nghien-cuu-mvp/nghiep-vu-va-so-lieu.vi.md), [nguồn nghiệp vụ R006](../2026-11-11-06-ket-qua-nghien-cuu-mvp/nguon-nghiep-vu.md) | UoM, bình quân, giá/ưu đãi, ba sổ tiền và giới hạn fixture trước thuế |
| [R006 tổng](../2026-11-11-06-ket-qua-nghien-cuu-mvp/report.vi.md) | Quyết định đã có và Q01–Q10 còn đề nghị |

Baseline repo nhận để nghiên cứu: HEAD `d1ef1627f2b624bba2d01d32a3cf77eb35a7cf18` của PR #1. R007 đã review HEAD cũ `f267819bfa6a1587cacd8ace58265b9c0db93b71`; không ghi R008 như đã review mã ứng dụng ở HEAD mới. Các file lịch sử không được sửa trong phần việc nghiệp vụ R008.

Mọi số liệu kinh doanh, thuế suất thử, chi phí, hạn trả và ngày giao ở R008-B/JSON do đợt nghiên cứu dựng. Chưa có danh mục SKU thật, hóa đơn thật, hợp đồng trả/quà hoặc lựa chọn phương pháp kế toán của pilot. Không dùng tài liệu nước ngoài làm căn cứ pháp lý Việt Nam. Phần hồ sơ pháp lý/provider được nghiên cứu riêng trong R008; số học không phê duyệt khả năng phát hành hóa đơn.

<a id="3-bang-chung-chay-so-hoc"></a>

## 3. Bằng chứng chạy số học

### 3.1. Lệnh và đầu ra

Thực chạy ngày 12/11/2026 bằng `python3` trong repo, không mạng/thư viện ngoài:

```bash
python3 reports/2026-11-12-08-khep-quy-tac-va-dac-ta-mvp/kiem-chung-so-lieu.py --output reports/2026-11-12-08-khep-quy-tac-va-dac-ta-mvp/ket-qua-so-lieu.json
```

Đầu ra đã quan sát:

```text
R008 arithmetic/model: 91 checks PASS; 18 event snapshots; product/pilot/approvals NOT verified.
JSON: reports/2026-11-12-08-khep-quy-tac-va-dac-ta-mvp/ket-qua-so-lieu.json
SHA256: 5048da97c49789cfe6cce3e3eed8c3967850396fbda2cfa164174f330c0a8c93
```

Exit code **0**; runtime thực tế **Python 3.12.14**. Đã chạy lại và đối chiếu JSON giống từng byte; đã kiểm tra UTF-8/LF, liên kết nội bộ và anchor của hai tài liệu nghiệp vụ. JSON deterministic, không có timestamp chạy thay đổi mỗi lần. Các trường `owner_approved`, `accountant_approved`, `provider_approved`, `product_tested`, `pilot_performed` đều false. `evidence_status=ARITHMETIC_MODEL_VERIFIED_ONLY`.

### 3.2. Phạm vi đã đối chiếu

| Nhóm | Đối chiếu cụ thể |
|---|---|
| F02 | Trả đã chấp nhận, quà ròng, giao tiếp cần2; miễn2 không thu hồi lặp; tăng quyền không giao dư; trả quà miễn giảm G/W; quà mới không được miễn vô hạn |
| F03 | Sai số hoàn6.668 được tái hiện; cách mới3.334+3.333=6.667; nguồn tăng101 phân50/51; nhiều cách chia7 đơn vị đều hoàn10.001 |
| Terms | Giao01/08 theo7ngày ra08/15; Customer đổi14ngày chỉ đơn mới ra22; tuổi nợ và mốc đổi ngày UTC+07 |
| Tiền/thuế | Largest remainder, hòa theoID, inclusive/exclusive, bảo toàn net/VAT khi trả từng phần, ca biên gross không tính độc lập |
| Compound | 100/100→0,100/60→40; pending bank không tính receipt; thu thừa/có dư giữ riêng |
| Nhiều ngày | 18 snapshots; tại từng bước cân giá trị hàng và bán–nợ–tiền; chuyển ngày không tạo lại số dư; nhập MAIN không đổi giá xe; phí muộn và trả từ kỳ/chuyến cũ |
| Export mô hình | Ba ID nhận hai lần vẫn3; cùng ID đổi số bị nhận diện xung đột; không import vào hệ thống thật |

`91` là số kiểm tra số học/so sánh trong script, không là91 test sản phẩm,91 kịch bản người dùng hoặc tỷ lệ đáp ứng MVP. Một số kiểm tra là bất biến lặp ở18 mốc; không lấy số lượng này làm thước đo bao phủ toàn bộ yêu cầu.

### 3.3. Phần chưa kiểm chứng

- Quyết định thương mại của Owner; xác nhận số độc lập của kế toán và người triển khai; chuẩn pháp lý áp cho SKU/quà thực.
- Database transaction, cạnh tranh, hash canonicalization xuyên hệ thống, retry sau crash, downsync, thiết bị/browser, provider response và restore.
- Phí giảm/giá vốn điều chỉnh qua nhiều lần chuyển và bán lại hàng trả; engine phải có ca riêng trước hỗ trợ tự động.
- Tính hợp lệ hoặc thời điểm của hóa đơn, chứng từ vận chuyển, khả năng provider chấp nhận precision/source returns; hồ sơ thực tế kỳ khóa.
- Quy trình nhận hàng/kiểm kê/import bằng người dùng thật, phần mềm kế toán được chọn, danh mục và số dư pilot.

BS-02/05 có phương án và phép tính để người có trách nhiệm xem xét; điều kiện hoàn tất theo B007 chưa được thay bằng việc tạo biểu mẫu hoặc chạy mô hình.
