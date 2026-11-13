# NC-02–NC-06 — Kết quả nghiên cứu nghiệp vụ và bộ số liệu MVP

- Ngày nghiên cứu: **11/11/2026**.
- Phạm vi: [B005](../../briefs/2026-11-11-05-nghien-cuu-bo-sung-dat-mvp.md), đọc cùng [R005](../2026-11-11-05-khoang-trong-va-muc-tieu-mvp/report.vi.md), [R003](../2026-11-11-03-deep-research-mvp-kien-truc/report.vi.md), [R004](../2026-11-11-04-deep-research-erd-nghiep-vu/report.vi.md) và [D01](../2026-11-11-02-nghiep-vu-mvp-pwa/quyet-dinh-va-thuat-ngu.vi.md).
- Loại bằng chứng: tài liệu sơ cấp, phân tích phương án, **dữ liệu synthetic và kiểm tra bằng Python Decimal**. Chưa có thực địa hoặc kiểm thử sản phẩm.
- Trạng thái: kết quả desk research đã thực hiện. Các quy tắc dưới đây là **đề xuất để Owner quyết định**, chưa phải chính sách đã duyệt hay bằng chứng hoàn thành toàn bộ B005. [Hồ sơ nguồn và giới hạn](nguon-nghiep-vu.md).

## 1. Kết quả và phương án khuyến nghị

Đề nghị MVP dùng một hệ thống chứng từ cho A và B; quản lý hàng theo địa điểm giữ, công nợ theo Customer, trách nhiệm tiền theo người thực sự nhận. **Bình quân di động** là phương án giá vốn đề nghị, tính theo SKU và địa điểm tồn; FEFO chọn lô xuất theo hạn dùng. Giá bán, quy đổi, ưu đãi và giá vốn đã xuất phải có bản chụp trên chứng từ. Một lần thu tiền chỉ làm giảm nghĩa vụ khách một lần; nộp quỹ chỉ chuyển người giữ tiền.

Tài liệu ERP bên dưới là bằng chứng về thiết kế sản phẩm, **không chứng minh mức phổ biến tại NPP Việt Nam**.

| Quyết định nghiên cứu đưa ra | Phương án đề nghị | Đánh đổi phải chấp nhận |
|---|---|---|
| Đơn vị vận hành | Một tenant có một đơn vị bán/MST, nhiều kho/xe; giữ mỗi tenant một DB | Chưa hợp nhất nhiều pháp nhân trong một tenant |
| Chuyến A/B | Mô hình hỗ trợ chung chuyến; tách lượng giữ cho A khỏi tồn tự do B | Pilot đầu có thể dùng chuyến riêng để giảm thao tác; cả A/B vẫn trong MVP |
| Giá vốn | Bình quân di động theo SKU × địa điểm tồn | Không cung cấp biên lợi nhuận theo giá mua riêng từng lô |
| Giá/ưu đãi | Bảng giá có thứ tự; chiết khấu xác định; một khuyến mại chính trên phạm vi áp dụng | Chưa có ngân sách hoặc cộng dồn toàn thị trường |
| Tiền nhân viên | Ba sổ: khách, thu hộ, tạm ứng; tạm ứng có cấp–duyệt chi–hoàn dư tối thiểu | Chưa thay thế phân hệ chi phí/kế toán đầy đủ |

## 2. NC-02 — Thuật ngữ, quan hệ và trách nhiệm

### 2.1. Glossary làm việc

Đây là quy ước của dự án, kế thừa và làm rõ D01; không phải định nghĩa pháp lý của mọi hợp đồng phân phối.

| Khái niệm | Nghĩa và ranh giới đề nghị |
|---|---|
| `BusinessOperator` — đơn vị vận hành | Chủ thể bán hàng, sở hữu hàng và theo dõi nghĩa vụ thanh toán; hồ sơ thông tin xuất hóa đơn riêng |
| `SaaSSubscriber` — bên thuê dịch vụ | Bên ký/chi trả hợp đồng SaaS; không phải Customer mua hàng của NPP; có thể phụ trách nhiều tenant |
| `Tenant` | Ranh giới dữ liệu/quyền/cấu hình SaaS; một DB theo quyết định đã có, được gắn với bên thuê dịch vụ |
| `Customer` — khách hàng | Bên mua/chịu nghĩa vụ thanh toán trong sổ của đơn vị vận hành; không phải tài khoản người dùng hoặc chỉ người tiêu dùng cuối |
| `Outlet` — điểm bán | Cơ sở của Customer để viếng thăm, giao/bán hàng; không tự có sổ nợ độc lập |
| `ShipTo` — nơi nhận | Địa chỉ thực tế trên lần giao. Có thể là Outlet, kho nhận hoặc địa chỉ khác; lưu bản chụp địa chỉ |
| `Distributor` — NPP | Vai trò thương mại; đơn vị vận hành, Customer hay Supplier đều có thể là NPP |
| `Dealer` — đại lý | Nhãn kênh. Phải ghi thêm bản chất mua đứt/bán hộ; không suy quyền sở hữu hàng từ tên gọi |
| `Supplier` | Bên cung cấp hàng/dịch vụ mua; có thể cùng chủ thể ngoài đời với một Customer nhưng hai vai trò giao dịch riêng |
| `SKU`, `UoM`, mã vạch | SKU nhận diện mặt hàng quản lý; UoM chỉ đơn vị giao dịch/tồn; mã vạch ánh xạ SKU và quy cách, không thay thế cả hai |
| `Trip`, `Vehicle`, `StockLocation` | Chuyến là phiên vận hành; xe là tài sản/phương tiện; địa điểm tồn là nơi giữ hàng. Không dùng biển số làm khóa chứng từ |
| `Employee`, `User`, `Assignment` | Người chịu trách nhiệm, tài khoản đăng nhập và phân công theo vai trò/thời gian là ba khái niệm riêng |

GS1 phân biệt cấp đóng gói như từng đơn vị, lốc và thùng; vì vậy việc ánh xạ mã quét cần có cấp bao gói. Đây là tham chiếu cho danh mục, không có nghĩa mọi khách pilot phải triển khai GS1 Data Hub [B02](https://www.help.gs1us.org/packaging-level).

### 2.2. Bản mô hình khái niệm đề nghị

| Quan hệ | Ràng buộc MVP |
|---|---|
| SaaSSubscriber → Tenant | 1 → 1..n; mỗi tenant có một bên thuê phụ trách tại một thời điểm; không suy quyền xem chéo dữ liệu chỉ từ quan hệ trả phí |
| Tenant → đơn vị vận hành → kho | 1 → 1 → nhiều; nhiều đơn vị bán trong một tenant để sau |
| Customer → Outlet | 1 → 0..n; Outlet có đúng một Customer chủ quản tại một thời điểm |
| Đơn → Customer / Outlet | Đúng một Customer; Outlet có thể vắng. Đơn giao hàng phải có ShipTo đủ thông tin trước xuất chuyến |
| Đơn → lần giao | 1 → 0..n; mỗi dòng giao tham chiếu dòng đơn. B tạo đơn và lần giao trong cùng giao dịch nghiệp vụ |
| Chuyến → lần giao / phân công | Một chuyến có nhiều lần giao và nhiều vai trò; xe máy người giao = người lái, xe tải có thể khác |
| Địa điểm tồn → biến động | Dòng biến động xác định SKU, UoM gốc, lô nếu quản lý, lượng, giá trị và chứng từ nguồn |
| Dòng trả → dòng giao gốc | Tối đa một nguồn cho mỗi dòng trả; một phiếu có thể gom nhiều nguồn. Tổng trả không vượt lượng còn được trả |
| Phiếu thu → phân bổ khoản phải thu | Một Customer/phiếu, nhiều phân bổ; một khoản phải thu được trả nhiều lần; có tiền chưa phân bổ |
| Giao/điều chỉnh → hóa đơn | Có bảng liên kết dòng và lượng/tiền đã lập; trạng thái hóa đơn riêng, không tạo lại khoản phải thu vận hành |

Không bắt buộc mọi Customer có Outlet giả. Khi đổi chủ một điểm bán, chấm dứt quan hệ cũ và lập quan hệ mới; chứng từ lịch sử giữ bên nợ cũ. Gộp danh mục trùng không được tự chuyển nghĩa vụ thanh toán.

### 2.3. Ma trận quyền tối thiểu

| Hành động | Người thực hiện | Kiểm soát đề nghị |
|---|---|---|
| Nhập đơn/ghi viếng thăm | Sales được phân công | Chỉ khách/tuyến được cấp; ghi nguồn đơn |
| Duyệt bán chịu, sửa giá ngoài chính sách | Quản lý bán hàng/Owner | Hạn mức và lý do; không mặc nhiên cấp quyền cho sales |
| Nhập, soạn, cấp hàng | Thủ kho; người nhận chuyến xác nhận | Chứng từ bàn giao lượng/lô, người giao–nhận |
| Xác nhận giao, bán B | Người giao/bán được phân công | Một thiết bị có quyền ghi cho mỗi chuyến theo đề xuất NC-07 |
| Thu tiền tại điểm | Người có quyền thu | Người lái riêng không tự có quyền thu hoặc thiết bị ghi thứ hai |
| Nhận tiền nộp quỹ | Thủ quỹ/kế toán | Xác nhận thực nhận, không chỉ dựa vào người nộp bấm nút |
| Duyệt trả, giảm nợ, thiếu/thừa | Quản lý nghiệp vụ và kế toán theo loại | Lý do, chứng từ gốc, dấu vết phê duyệt |
| Khóa/mở kỳ, điều chỉnh giá trị | Kế toán/Owner được cấp quyền | Ghi người duyệt và phạm vi bị ảnh hưởng |

Một người có thể kiêm vai trò; hệ thống vẫn ghi vai trò từng hành động. Tự duyệt cần Owner cho phép.

## 3. NC-03 — Khép kín A/B, trả và sự kiện ghi sổ

### 3.1. Luồng và trạng thái

**A:** nháp → gửi yêu cầu → xác nhận giá/tín dụng → giữ hàng → cấp chuyến → giao thực tế → xử lý phần còn lại. Khi giao thiếu, tạo lần giao tiếp hoặc hủy lượng chưa giao; không sửa lượng giao cũ. Khi hàng lên xe, ghi chuyển địa điểm giữ và duy trì phân bổ cho đơn A. Bán B không được sử dụng lượng này trừ khi quản lý giải phóng phân bổ.

**B:** mở chuyến → nhận hàng/quyền bán/gói giá → bán và giao tại điểm → nhận tiền nếu có → nhận trả/đổi theo chứng từ → kiểm đếm → bàn giao hàng, tiền → đóng chuyến. B đã giao/thu offline là sự kiện đã xảy ra; xung đột khi đồng bộ phải có người xử lý, không xóa giao dịch hoặc đổi số khách đã trả.

**Trả:** ghi yêu cầu và tình trạng hàng → đối chiếu nguồn → chấp nhận thương mại → nhận vào cách ly → ghi giảm nghĩa vụ khách → kiểm tra để bán lại/loại bỏ. Nếu nhận hàng trước khi quyết định chấp nhận, theo dõi là hàng giữ hộ chờ xác minh; chưa đưa vào tồn sở hữu hoặc khả dụng.

| Trục trạng thái | Mốc kết thúc và nguyên tắc |
|---|---|
| Đơn | Đóng khi mọi lượng đã giao hoặc hủy phần chưa giao; không đòi khách trả hết nợ |
| Giao | Đã giao đủ/thiếu/từ chối, sau đó đã đối soát; lưu lượng nhận thực tế |
| Tiền thu | Đã ghi nhận → được server tiếp nhận → đã bàn giao/đối soát; phân biệt trạng thái lưu máy |
| Chuyến | Đang mở → đang đối soát → đóng; phải kiểm tra dữ liệu thiết bị, tồn và tiền |
| Hóa đơn | Chờ xử lý/đã gửi/đã xác nhận/lỗi/cần điều chỉnh; tách khỏi đơn và thanh toán |

Các trạng thái trên không gia hạn thời điểm lập hóa đơn. B offline chỉ được đưa vào pilot khi có kênh/quy trình lập hóa đơn đáp ứng thời điểm áp dụng; lưu hàng đợi đến cuối ngày không tự đáp ứng điều kiện này. Đọc cùng [nghiên cứu hóa đơn và tuân thủ](hoa-don-va-tuan-thu.vi.md).

Đổi người/xe giữa chuyến phải có bàn giao hàng và tiền; lịch phân công mới không viết lại actor cũ. Hủy sau khi cấp hàng là giải phóng phân bổ và chuyển hàng về, chưa phải trả hàng từ khách. Giao rồi mới đổi hàng là trả cũ cộng bán mới có liên kết, không ghi âm thầm một chênh lệch ròng.

### 3.2. Ma trận sự kiện–sổ–đầu vào hóa đơn

`Sổ KH` dưới đây là số phải thu trừ số dư có của Customer; khi trình bày UI phải tách nợ và có dư. Các mốc hóa đơn chỉ là **tín hiệu nghiệp vụ cho NC-08 xác định nghĩa vụ, thời điểm và cách lập**, không phải kết luận pháp lý.

| Sự kiện/chứng từ đã được chấp nhận | Tồn sở hữu | Sổ KH | Tiền thu hộ/tạm ứng | Tín hiệu cho hóa đơn |
|---|---|---|---|---|
| E01 Nhập hàng nhà cung cấp | + lượng, + giá trị mua được duyệt | Không | Không | Lưu tham chiếu chứng từ mua |
| E02 Xác nhận/giữ đơn A | Không đổi; tăng lượng giữ | Chỉ giữ hạn mức, chưa ghi nợ | Không | Chuẩn bị dữ liệu bên mua |
| E03 Cấp hàng/chuyển kho | − nguồn, + đích cùng giá trị | Không | Không | Kiểm tra yêu cầu chứng từ điều chuyển theo NC-08 |
| E04 Giao/chuyển giao hàng bán | − hàng thực giao; ghi giá vốn | + tiền giao thực tế | Không tự phát sinh thu tiền | Sự kiện xét nghĩa vụ lập hóa đơn |
| E05 Giao hàng tặng | − hàng quà, có giá vốn | Không tăng tiền thương mại | Không | Giữ loại dòng, chương trình, lượng; không gán thuế suất mặc định |
| E06 Hủy lượng chưa giao | Giải phóng giữ; hàng trên xe vẫn phải về kho/bàn giao | Không ghi giảm nợ chưa từng phát sinh | Không | Đối chiếu chứng từ đã có nếu có |
| E07 Chấp nhận khách trả | + cách ly theo giá vốn gốc | − số được chấp nhận giảm | Chưa hoàn tiền tự động | Xét điều chỉnh/chứng từ liên quan |
| E08 Giảm giá sau giao | Không đổi lượng | − khoản giảm được duyệt | Không | Xét điều chỉnh giá trị |
| E09 Thu tiền mặt khách | Không | − tiền thu; dư thành có dư | + người thực giữ | Liên kết thanh toán; không tạo doanh số lần nữa |
| E10 Chuyển khoản trực tiếp đã xác minh | Không | − tiền đã nhận | Thu hộ không đổi; ngân hàng + | Liên kết thanh toán |
| E11 Nộp quỹ đã được nhận | Không | Không | Thu hộ −; quỹ + | Không tạo hóa đơn bán mới |
| E12 Bàn giao tiền giữa nhân viên | Không | Không | Người giao −, người nhận + | Không |
| E13 Hoàn tiền khách | Không | + để giảm số dư có; không tạo nợ mới tùy ý | Tiền người/quỹ chi − | Liên kết khoản trả/giảm/thu trước |
| E14 Cấp tạm ứng | Không | Không | Tạm ứng +; quỹ/ngân hàng − | Chứng từ chi riêng |
| E15 Duyệt chi/hoàn dư tạm ứng | Không | Không | Tạm ứng −; hoàn dư làm quỹ + | Tham chiếu chứng từ chi, không hóa đơn bán |
| E16 Điều chỉnh tồn/đóng chuyến | Điều chỉnh có duyệt; đóng chuyến tự nó không đổi tồn | Không tự đổi nợ | Không tự bù tiền thiếu | Rà soát ngoại lệ liên quan |

Chứng từ đã ghi sổ sửa bằng đảo/điều chỉnh liên kết nguồn. Việc chuyển trạng thái “đã xác minh”, “đã nộp” hay “đã lập hóa đơn” không chạy lại tác động E04/E09. Một mã nghiệp vụ phải truy được toàn bộ tác động hàng–nợ–tiền và kết quả xử lý ngoài hệ thống.

Đóng chuyến cần: đủ dữ liệu thiết bị hoặc hồ sơ ngoại lệ được nhận trách nhiệm; tồn đã chuyển về/đã bàn giao chuyến sau; tiền thu đã nộp hoặc chuyển thành khoản đang giữ được xác nhận; chênh lệch có người xử lý. Không tự kết luận thiếu hàng/tiền là khoản nhân viên phải bồi hoàn.

## 4. NC-04 — UoM, tồn và giá vốn

### 4.1. Quy đổi và chất lượng tồn

Microsoft cho phép một đơn vị tồn gốc và các đơn vị thay thế có hệ số, đồng thời có độ chính xác lượng để xử lý quy đổi [B01](https://learn.microsoft.com/en-us/dynamics365/business-central/inventory-how-setup-units-of-measure). Quy tắc đề nghị cho MVP:

| Nội dung | Quy tắc cụ thể |
|---|---|
| Quy đổi | Mỗi SKU một UoM gốc; hệ số dương theo SKU/quy cách. `q_gốc = q_giao_dịch × hệ_số_snapshot` |
| Độ chính xác | Hàng chai/gói nguyên chiếc: lượng gốc nguyên; hàng cân nếu hỗ trợ: cấu hình bước, ví dụ 0,001 kg. Không tự làm tròn một phần chai |
| Thay quy cách | Tạo phiên bản có hiệu lực; chứng từ cũ giữ hệ số và mã quy cách cũ |
| Giá theo UoM | Có bảng giá thùng/lốc/chai riêng. Thiếu giá thì báo thiếu hoặc dùng quy tắc chuyển giá đã cấu hình rõ |
| Lượng có thể bán | Tồn bán được trừ giữ A và quyền đã cấp khác; không cộng cách ly, hết hạn hoặc hàng khách gửi chờ xét |
| Lô/hạn dùng | Bắt buộc theo SKU/ngành hàng yêu cầu; xuất lưu lô thực tế. Cảnh báo/chặn quá hạn và ngưỡng còn hạn được cấu hình |

Odoo FEFO chọn hàng theo ngày cần đưa ra khỏi kho và cần dữ liệu lô/ngày; đó là cơ chế chọn hàng [B05](https://www.odoo.com/documentation/19.0/applications/inventory_and_mrp/inventory/shipping_receiving/removal_strategies/fefo.html). **Đề xuất:** dùng hạn thực tế trên hàng; có thể trừ số ngày tối thiểu còn hạn theo khách. Không suy hạn dùng từ ngày nhập nếu nhãn hàng có ngày sản xuất/hết hạn riêng. FEFO vẫn dùng được cùng bình quân di động.

### 4.2. Chọn một phương pháp giá vốn

ERPNext mô tả FIFO theo lớp nhập và bình quân di động theo giá trị/lượng hiện có; cả hai chịu ảnh hưởng khi sửa giao dịch quá khứ [B03](https://docs.frappe.io/erpnext/fifo-and-moving-average). So sánh dưới đây là đánh giá thiết kế cho dự án:

| Lựa chọn | Lợi ích trong MVP | Chi phí/giới hạn | Kết luận |
|---|---|---|---|
| FIFO | Truy được lớp giá nhập dùng cho lần xuất | Phải duy trì lớp còn lại qua chuyển kho, trả, sửa phí mua; FIFO tài chính không tự bảo đảm xuất đúng hạn | Chọn nếu pilot bắt buộc đối chiếu kế toán theo FIFO; cần thay quyết định trước nhập số dư |
| Bình quân di động | Một số lượng và giá trị cộng dồn mỗi SKU/địa điểm; dễ trình bày phép tính | Không biểu diễn giá mua thực từng lô; nhập/sửa muộn vẫn cần chính sách | **Khuyến nghị cho MVP**, không triển khai đồng thời hai engine |

Phạm vi tính đề nghị là **SKU × StockLocation**; khu cách ly là địa điểm riêng, lô không tạo lớp giá vốn riêng. Kho chuyến tách khỏi kho chính giúp nhập hàng tại kho chính không âm thầm đổi giá vốn hàng đã cấp chuyến. Chuyển kho lấy giá trị xuất nguồn làm giá trị nhập đích, không sinh lãi/lỗ; bình quân đích có thể thay đổi nếu đã có hàng.

Với số lượng `Q`, giá trị `V`: sau nhập `q, v`, bình quân mới bằng `(V + v)/(Q + q)`; xuất `x` lấy `V × x/Q`, làm tròn đến 1 VND bằng `ROUND_HALF_UP`. Dùng Decimal/phân số; số lẻ hiển thị không thay số gốc. Khi xuất hết `Q`, lấy **toàn bộ V còn lại**, bảo đảm lượng/giá trị bằng 0. Đợt nhập tiếp tạo giá vốn mới.

### 4.3. Mua, trả, làm tròn và khóa kỳ

| Trường hợp | Phương án vận hành MVP |
|---|---|
| Số dư đầu | Nhập lượng và giá trị theo SKU/địa điểm/lô; kế toán xác nhận tổng; không tự tạo doanh số hoặc nợ khách |
| Giá trị nhập | Giá mua sau giảm thương mại cộng chi phí mua được phân bổ; thành phần thuế theo chính sách kế toán, không hardcode |
| Phí mua nhiều SKU | Mặc định phân bổ theo giá mua thuần từng dòng, duyệt trước ghi nhận. Chênh làm tròn phân bổ theo phần dư lớn nhất, thứ tự mã dòng khi hòa |
| Phí biết muộn | Chứng từ điều chỉnh nêu riêng phần vào tồn và phần vào chi phí hàng đã xuất, do kế toán duyệt; không tự dồn toàn bộ vào tồn còn hoặc sửa phiếu nhập cũ. MVP chưa tự chạy lại lịch sử kỳ khóa |
| Trả có nguồn | Nhập cách ly theo giá vốn của lượng giao gốc; tiền giảm theo giá bán/chiết khấu gốc, hai giá này khác nhau |
| Trả không có nguồn trong hệ thống | Nhận giữ hộ chờ xét; kế toán đối chiếu chứng từ ngoài hệ thống và duyệt lượng, giá trị, tiền giảm. Không tự lấy giá bán hoặc bình quân hiện tại làm “giá gốc” |
| Hàng tặng/hỏng | Có xuất lượng và giá trị, phân loại chi phí riêng; không dùng đơn giá bán bằng 0 để cho giá vốn bằng 0 |
| Tồn âm | Chặn giao dịch mới vượt quyền tồn; trường hợp đã giao thực tế nhưng sync xung đột vào hồ sơ ngoại lệ, không xóa sự kiện |
| Kỳ đã khóa | Giữ ngày thực tế, ngày tiếp nhận, thứ tự ghi sổ. Lệnh muộn cần điều chỉnh kỳ mở có phê duyệt hoặc thủ tục mở lại kỳ riêng |

Business Central có cơ chế áp trả hàng về giao dịch xuất gốc, khóa kỳ tồn và điều chỉnh chi phí đến giao dịch liên quan [B04](https://learn.microsoft.com/en-us/dynamics365/business-central/finance-manage-inventory-costs).

Với B offline, thứ tự sự kiện trong chuyến và phụ thuộc cấp hàng phải được bảo toàn. Không sắp lại toàn bộ sổ chỉ bằng đồng hồ điện thoại. Báo cáo trước đồng bộ ghi rõ chưa đủ dữ liệu; sai lệch giá vốn kỳ khóa không được “chữa” bằng thay snapshot thương mại hoặc xóa phiếu thu.

## 5. NC-05 — Bảng giá, chiết khấu và khuyến mại

ERPNext phân biệt đổi giá, giảm tiền/tỷ lệ và thêm hàng tặng; điều kiện có thể dùng khách, mặt hàng, lượng, giá trị, thời gian và ưu tiên [B06](https://docs.frappe.io/erpnext/pricing-rule). MVP đề nghị chọn tập nhỏ sau:

| Bước | Quy tắc được chọn |
|---|---|
| 1. Giá cơ sở | SKU + UoM + tiền tệ + thời gian; ưu tiên giá riêng Customer → nhóm → kênh → mặc định. Cùng cấp trùng hiệu lực thì chặn công bố cấu hình |
| 2. Chiết khấu thương mại | Một mức dòng theo hợp đồng và tối đa một khoản toàn đơn; cho % hoặc số tiền, không vượt giá trị đủ điều kiện |
| 3. Khuyến mại | Một chương trình chính cho cùng phạm vi SKU: giảm tiền/% **hoặc** mua X tặng Y; có cờ cho phép cùng chiết khấu hợp đồng |
| 4. Cộng dồn | Mặc định không chồng hai khuyến mại; giải quyết bằng ưu tiên đã duyệt, không tùy thứ tự thêm dòng |
| 5. Phân bổ | Giảm toàn đơn phân bổ về dòng bán đủ điều kiện; dòng quà không nhận phân bổ giảm tiền |
| 6. Giải thích | Lưu giá trước/sau, ID/phiên bản quy tắc, lượng đủ điều kiện, lý do bỏ chương trình, người duyệt ngoại lệ |

MVP vẫn tự tính tiền/thêm quà. Hoãn tích điểm, ngưỡng nhiều đơn, ngân sách chung và hoàn tiền nhà cung cấp; chỉ lưu nguồn tài trợ, chưa tự tạo phải thu nhà cung cấp.

**Thời điểm cam kết:** A nháp dùng giá tham khảo; khi xác nhận lưu snapshot và chỉ đổi bằng phiên bản đơn được chấp nhận. B dùng gói giá có phiên bản/thời hạn/quyền trước chuyến. Giao dịch B đã hoàn tất giữ số lượng/giá/tiền thực tế; nếu vượt quyền thì xử lý ngoại lệ. Tái kiểm tra giá khi sync không đồng nghĩa được tự thay giá đã bán.

**Giao từng phần:** giữ giá thỏa thuận theo đơn vị gốc của dòng; khuyến mại lượng tính trên **lượng bán đã giao lũy kế của đơn**, trừ lượng trả, không trên lượng đặt chưa giao. Quà lần này = tổng quyền hưởng hiện tại trừ quà đã giao. Nếu giá thùng 168.000/12 chai, giao thiếu một phần thùng theo thỏa thuận vẫn phân bổ 14.000/chai; không đổi sang giá lẻ mới 15.000.

| Tình huống mua 10 tặng 1 | Kết quả đề nghị |
|---|---|
| Giao 9 / 10 / 20 chai mua | Quà 0 / 1 / 2 chai |
| Một thùng 12 chai mua | Một quà; không tính “một thùng” là một chai |
| Giao lần đầu 9, lần sau 11 cùng đơn | Quà lần đầu 0, lần sau 2; tổng không phụ thuộc chia dòng |
| Quà không đủ | Báo thiếu và chọn giao tiếp/đổi thỏa thuận có duyệt; không âm thầm xóa quà hoặc hứa vượt tồn được cấp |
| Đã mua 20, trả 11 | Còn 9 chai mua nên quyền quà còn 0; đề nghị thu hồi 2 quà đã giao |
| Khách không trả đủ quà | Lập ngoại lệ; quản lý chấp nhận chi phí hoặc thỏa thuận khác được duyệt. Không tự phát sinh giá bán quà/phải thu mới |

Khoản giảm tiền làm tròn một lần đến 1 VND bằng `ROUND_HALF_UP`, rồi phân bổ ổn định xuống dòng. Giảm 10.001 cho hai dòng cơ sở 200.000 và 100.000: phân bổ **6.667 và 3.334**, tổng vẫn 10.001. Trả từng phần dùng tiền gốc đã phân bổ; lần trả cuối nhận phần dư, không vượt tiền dòng gốc. Đảo chứng từ giữ đúng đối số gốc. Điều kiện thuế/quyền đổi trả do NC-08 xác định.

## 6. NC-06 — Công nợ, thu hộ và tạm ứng

ERPNext cho phép thanh toán một phần, phân bổ một phiếu cho nhiều hóa đơn cùng bên và giữ khoản chưa phân bổ [B07](https://docs.frappe.io/erpnext/payment-entry). Đề xuất sổ vận hành của dự án:

| Sổ | Phát sinh và công thức |
|---|---|
| Khách hàng | Đầu kỳ + tiền giao được chấp nhận − giảm/trả − thu khách + hoàn tiền; trình bày riêng dư nợ và dư có |
| Thu hộ theo nhân viên | Đầu kỳ + tiền thực thu + bàn giao nhận − hoàn được duyệt − nộp đã nhận − bàn giao đi |
| Tạm ứng theo nhân viên | Đầu kỳ + đã cấp − chi được duyệt − hoàn dư; không lấy số thu hộ để bù tự động |

Nợ vận hành ghi tại sự kiện giao/chuyển giao được chấp nhận, sau khi đối chiếu định nghĩa pháp lý của trường hợp; không chờ trạng thái tích hợp hóa đơn. Đây không phải tuyên bố thời điểm ghi nhận doanh thu kế toán. Khi phát hành hóa đơn, liên kết số đã ghi, không cộng thêm nợ.

Hạn mức xét trên Customer qua mọi Outlet: nợ đang mở + giá trị cam kết chưa giao + quyền bán chịu offline đã cấp, trừ khoản có dư được phép sử dụng. Khi giao, chuyển phần cam kết thành nợ; không cộng cả hai. Một thiết bị/chuyến không giải quyết việc cùng khách mua chịu ở nhiều chuyến: phải phân bổ quyền tín dụng hoặc yêu cầu online khi vượt phần được cấp.

| Ngoại lệ tiền | Xử lý đề nghị |
|---|---|
| Một phiếu trả nhiều khoản | Nhân viên chọn khoản; đề nghị phân bổ theo hạn đến trước, người có quyền xác nhận. Tổng phân bổ không vượt tiền thực nhận |
| Thu trước/thu thừa | Ghi có dư Customer; phân bổ sau bằng chứng từ liên kết; không tạo nợ âm khó hiểu trên một đơn |
| Khách báo đã chuyển khoản | Lưu thông tin đang chờ xác minh; chỉ giảm nợ chính thức sau kiểm tra chứng cứ ngân hàng phù hợp |
| Thu tiền mặt | Người được quyền thu ghi biên nhận; đối soát quỹ sau không trì hoãn hoặc lặp lại lần giảm nợ đã ghi |
| Tiền nộp chưa được nhận | Vẫn nằm ở người giao hoặc trạng thái bàn giao chờ xác nhận, không tự biến mất khỏi trách nhiệm giữ |
| Chênh lệch | Lập hồ sơ thiếu/thừa; chỉ ghi khoản bồi hoàn khi được xác định và phê duyệt; không sửa số khách đã trả |
| Hoàn khách | Liên kết khoản có dư/phiếu trả, xác định nguồn chi và người nhận; không dùng hủy phiếu thu để mô tả tiền đã thực sự hoàn |

Ví dụ phân bổ độc lập: thu 250.000, khoản A còn 150.000 và B còn 200.000; phân bổ 150.000 + 100.000, B còn 100.000. Nhân viên giữ 250.000, không phải tổng giá trị hai khoản nợ.

**Phạm vi tạm ứng đề nghị:** có yêu cầu, duyệt, cấp thực tế, ghi khoản chi/chứng từ tham chiếu, duyệt quyết toán, hoàn dư và báo cáo số chưa quyết toán. Frappe HR tách yêu cầu tạm ứng khỏi chi tiền, rồi liên kết quyết toán/hoàn phần chưa dùng [B08](https://docs.frappe.io/hr/employee-advance). MVP chỉ cần sổ và các bước tối thiểu này; chưa xây payroll, công tác phí nhiều cấp hoặc tự nhận dạng hóa đơn. Nhân viên không tự lấy tiền thu khách trả chi phí chuyến; nếu Owner cho phép, phải có hai chứng từ chuyển nguồn và quyết toán có duyệt.

## 7. Bộ dữ liệu tổng hợp xuyên suốt và kết quả đã kiểm tra

### 7.1. Giả định minh họa

**Toàn bộ dữ liệu dưới đây là synthetic, không phải số liệu NPP.** Tiền là VND **trước lớp thuế**, nhằm kiểm tra cơ học sổ hàng–nợ–tiền. Ví dụ cố ý chưa mô hình hóa khoản thuế, không có nghĩa hàng bán/quà chịu VAT 0%; không dùng trực tiếp để phát hành hóa đơn. Phải thu thực khi triển khai phải gồm thành phần thuế đã xác định.

Một SKU P: chai gốc; lốc = 6 chai; thùng = 12 chai. Đầu hàng/nợ/thu hộ bằng 0. Customer A có ba Outlet; đơn A giao Outlet A1. Chuyến xe tải T có N1 giao/thu và N2 lái; chỉ N1 là người ghi giao dịch trên thiết bị chính. Customer B1/B2 khác Customer A. Quà là cùng SKU P; quy tắc mua 10 tặng 1, cho phép cùng mức chiết khấu nêu rõ dưới đây.

### 7.2. Nhập, giá và giao/trả

| Chứng từ | Dữ liệu | Kết quả |
|---|---|---|
| N01 | Nhập 120 chai × 10.000 | 120 chai; giá trị 1.200.000 |
| N02 | Nhập 120 chai; tiền mua thuần 1.380.000 + phí mua 60.000 | Tổng 240 chai; 2.640.000; bình quân 11.000 |
| T01 | Cấp T 126 chai: giữ A 26 = 24 mua + 2 quà; B tự do 100 | Kho chính 114, T 126; tổng giá trị không đổi |
| A01 | Đặt 2 thùng giá 168.000/thùng; chiết khấu 10% | Giá cơ sở 14.000/chai; sau giảm 12.600/chai |
| A-D1 | Giao 12 mua + 1 quà; thu tiền mặt 100.000 | Tiền giao 151.200 |
| A-D2 | Giao tiếp 8 mua + 1 quà; hủy 4 chưa giao; nhận chuyển khoản 80.000 | Tiền giao 100.800; tổng A 252.000, còn nợ 72.000 |
| B-S1 | B1 mua 20 chai × 15.000 + 2 quà; thu 200.000 tiền mặt | Bán 300.000; nợ trước trả 100.000 |
| B-S2 | B2 mua 40 × 15.000, chiết khấu 5%, + 4 quà; chuyển khoản 300.000 | Bán 570.000; còn nợ 270.000 |
| B-R1 | B1 trả 11 mua + 2 quà, nhận vào cách ly | Giảm tiền 165.000; phục hồi giá trị hàng 13 × 11.000 = 143.000 |
| B-F1 | B1 đã trả 200.000, chỉ giữ 9 mua trị giá 135.000 | Hoàn 65.000 từ N1; B1 hết nợ/có dư |

Quà A tính theo lượng thực giao lũy kế: 12 được 1, 20 được 2; không tặng trước cho 24 chai đặt. B1 còn 9 chai nên trả lại toàn bộ 2 quà. Hàng trả chưa được bán tiếp khi đang cách ly.

### 7.3. Đối chiếu cuối chuyến

| Chỉ tiêu | Phép tính | Số dư/kết quả |
|---|---|---|
| Hàng bán được trên T | 126 − 22 giao A − 66 giao B | 38 chai: 4 giải phóng A + 34 B |
| Hàng cách ly trên chuyến | 11 hàng mua trả + 2 quà trả | 13 chai |
| Bàn giao hàng về | 38 vào kho chính, 13 vào khu cách ly | T về 0; kho chính 152, cách ly 13 |
| Tồn sở hữu | 240 − 20 − 2 − 60 − 6 + 11 + 2 | 165 chai, giá trị **1.815.000** |
| Giá vốn hàng bán ròng | (20 + 60 − 11) × 11.000 | 759.000 |
| Chi phí hàng tặng ròng | (2 + 6 − 2) × 11.000 | 66.000 |
| Bảo toàn giá trị | 1.815.000 + 759.000 + 66.000 | **2.640.000**, bằng tổng nhập |
| Tiền bán ròng | 252.000 + 300.000 + 570.000 − 165.000 | **957.000** |
| Nợ cuối | 72.000 A + 0 B1 + 270.000 B2 | **342.000** |
| Thu hộ N1 trước nộp | 100.000 + 200.000 − 65.000 | **235.000** |
| Chuyển khoản trực tiếp | 80.000 + 300.000 | **380.000** |
| Đối chiếu tiền–nợ | 342.000 + 235.000 + 380.000 | **957.000**, bằng tiền bán ròng |
| Nộp quỹ | Quỹ xác nhận nhận 235.000 | Thu hộ N1 về 0; nợ khách vẫn 342.000 |

Tạm ứng riêng N1: cấp 300.000, chi được duyệt 180.000, hoàn dư 120.000 ⇒ số cần quyết toán **0**. Khoản hoàn 120.000 không phải tiền bán hàng. Nếu bàn giao 100.000 tiền thu hộ cho N2 trước nộp, N1 giữ 135.000/N2 giữ 100.000; tổng vẫn 235.000, không thay nợ khách.

### 7.4. Các biên số học bổ sung

| Ca | Kết quả kỳ vọng |
|---|---|
| 2 lốc + 3 chai | 15 chai; chứng từ cũ giữ hệ số 6 nếu danh mục lốc đổi sau |
| FIFO so với bình quân | Nhập 10 × 8.000 + 10 × 10.000, xuất 12: FIFO 100.000; bình quân 108.000 |
| Trả sau khi giá vốn đổi | Nhập 5 × 10.000 + 5 × 12.000, xuất 8 ở 11.000; nhập 3 × 16.000 ⇒ kho còn 5/70.000. Trả 2 của lần xuất cũ ⇒ cách ly 2/22.000, không phải 28.000 |
| Nhập lại hàng cách ly đã đạt | Chuyển 2/22.000 vào kho 5/70.000 ⇒ 7/92.000. Xuất hết lấy đúng 92.000; lượng/giá trị về 0. Nhập mới 1 × 15.000 ⇒ bình quân 15.000 |
| E2E-02 của R005, fixture riêng | Nhận 100, bán 60, tặng 5, trả kho 35 ⇒ 0. Số quà này là dữ liệu kiểm đếm riêng, không chạy quy tắc 10 tặng 1 của bộ chính |
| E2E-03 của R005, fixture riêng | Giao 1.000.000, thu 600.000 ⇒ nợ 400.000, giữ 600.000; nộp 600.000 ⇒ giữ 0, nợ vẫn 400.000 |

Ngày 11/11/2026 đã chạy kiểm tra các đẳng thức trọng yếu bằng Python `Decimal`, gồm bảo toàn lượng/giá trị, khoản trả/hoàn, ba số dư và phân bổ 10.001; các assertion đã đạt. Đây chỉ là **kiểm chứng phép tính của dữ liệu minh họa**, chưa chạy engine giá, PWA, tích hợp hóa đơn hay sản phẩm MVP.

## 8. Điểm cần quyết định và bằng chứng còn thiếu

| Người cần quyết định | Nội dung đã có phương án | Bằng chứng còn cần trước vận hành thật |
|---|---|---|
| Owner | Một đơn vị bán/tenant; A+B chung chuyến với hai vùng quyền tồn; tạm ứng tối thiểu | Phạm vi pháp nhân, cách phân công, nhu cầu chuyến kết hợp của đơn vị pilot |
| Owner + kế toán | Bình quân di động theo địa điểm, giá vốn trả gốc, phí mua/khóa kỳ | Phương pháp kế toán thực tế, dữ liệu số dư và phí mua, yêu cầu đối chiếu |
| Quản lý bán + Owner | Ưu tiên giá, tập khuyến mại, giao thiếu/trả quà | Bảng giá/chương trình và thỏa thuận thương mại thật |
| Kế toán + vận hành | Mốc nợ vận hành, xác minh tiền, cấp/chi/hoàn ứng | Chứng từ thu/nộp/hoàn; quy tắc thời điểm hóa đơn theo NC-08 |

Các phương án đã đủ cụ thể để Owner quyết định; chưa có bằng chứng thực địa hoặc nghiệm thu pilot.
