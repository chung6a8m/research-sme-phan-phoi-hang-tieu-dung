# R006 — Kết quả nghiên cứu bổ sung để chốt đặc tả MVP

- Ngày nghiên cứu: **11/11/2026**, múi giờ Asia/Bangkok.
- Đề bài: [B005 — Nghiên cứu bổ sung đạt MVP](../../briefs/2026-11-11-05-nghien-cuu-bo-sung-dat-mvp.md).
- Trạng thái: **đã thực hiện nghiên cứu tài liệu, đối chiếu nguồn sơ cấp, xây phương án và kiểm tra bộ số liệu giả lập**. Chưa có khảo sát doanh nghiệp, spike thiết bị, sandbox hóa đơn, diễn tập hệ thống hoặc pilot; chưa nghiệm thu toàn bộ B005.
- Các phương án mới là **khuyến nghị cần Owner quyết định**, không phải chính sách sản phẩm đã phê duyệt. Yêu cầu thực hiện research và commit vào PR #1 không tự biến những phương án này thành quyết định.
- [Nguồn, phương pháp và giới hạn bằng chứng](sources.md).

## 1. Kết luận chính

MVP có thể được thu gọn thành **một ngày vận hành khép kín của NPP tự mua–bán hàng đóng gói**: chuẩn bị danh mục/số dư, nhập hàng, A đặt trước–giao sau, B bán theo xe, ghi nhận giao/trả/quà, thu tiền và tiền đang giữ, hóa đơn, đối soát. Điểm cần giải quyết trước khi phát triển rộng là tính nhất quán giữa **sự kiện ngoài đời, chứng từ, hàng–nợ–tiền, dữ liệu offline và hóa đơn**.

Đợt nghiên cứu này đưa ra bảy kết luận làm cơ sở chốt đặc tả:

1. **Giữ cả A/B và cùng lõi chứng từ.** Tách lượng hàng giữ cho A khỏi lượng B được quyền bán; xe là phương tiện, chuyến là phiên vận hành, hàng trên xe vẫn thuộc đơn vị bán. Đơn, lượt giao, khoản thu và hóa đơn có trạng thái riêng.
2. **Dùng ba sổ trách nhiệm tiền.** Phải thu/tiền có dư của Customer, tiền nhân viên đang giữ và tạm ứng nhân viên là ba đối tượng khác nhau. Thu của khách giảm nghĩa vụ khách một lần; nộp tiền về quỹ chỉ chuyển người giữ.
3. **Khuyến nghị một phương pháp giá vốn: bình quân di động theo SKU × địa điểm tồn**, cùng UoM có phiên bản và chính sách khóa kỳ. FEFO là cách chọn lô hàng, không phải phương pháp tính giá vốn. Trả có gốc hoàn giá vốn xuất gốc; tiền hoàn theo giá bán/ưu đãi gốc.
4. **Offline B cần quyền hữu hạn và bảo toàn sự kiện đã xảy ra.** Một thiết bị ghi chính/chuyến, hàng/tín dụng được phân bổ trước, snapshot giá có phiên bản; không xóa hoặc tái định giá âm thầm một lần đã giao/thu vì dữ liệu trung tâm thay đổi.
5. **Khả năng offline kỹ thuật chưa đủ để cho phép B bán hoàn toàn mất mạng.** NĐ 254/2026 quy định thời điểm lập hóa đơn theo chuyển giao và từng lần giao; bán lưu động có yêu cầu lập khi bán. Quy định ký/gửi khác thời điểm lập không đồng nghĩa cho chờ cuối ngày mới lập. Cần kênh lập đúng thời điểm đã xác minh trước pilot. [Nguồn pháp lý L](nguon-phap-ly.md).
6. **Mỗi tenant một DB vẫn cần thiết kế vận hành và phục hồi toàn chuỗi.** API/file/cache/job/PWA đều phải đúng tenant; restore phải đối chiếu giao dịch đã ACK và hóa đơn đã tồn tại ngoài DB trước khi replay.
7. **Chưa có bằng chứng nhu cầu và giá trị thực địa.** Đã chuẩn bị archetype, bộ hỏi/quan sát, cấu trúc import, công thức KPI và điều kiện chọn pilot; chưa thể kết luận đơn vị nào mua, giá nào phù hợp hoặc giảm được bao nhiêu thời gian.

Các kết luận về kiến trúc và quy tắc ở mục 1–4/6 là phương án của dự án, dựa trên phân tích nguồn và bất biến nghiệp vụ; không gán cho nhà cung cấp hoặc luật một lựa chọn thiết kế mà họ không quy định.

## 2. Bộ tài liệu kết quả

| Tài liệu | Nội dung có thể dùng để chốt quyết định/đặc tả |
|---|---|
| [Nghiệp vụ và bộ số liệu](nghiep-vu-va-so-lieu.vi.md) | Glossary/quan hệ/quyền; ma trận 16 sự kiện; A/B, UoM, giá vốn, pricing, quà/trả; ba sổ tiền; số dư kỳ vọng và phép tính tái lập |
| [PWA và vận hành tenant](pwa-va-van-hanh-tenant.vi.md) | Ma trận trình duyệt; quyền offline; contract lệnh/ACK; chống lặp/cạnh tranh; đóng chuyến; cách ly, migration, backup/restore và biến chi phí |
| [Hóa đơn và tuân thủ](hoa-don-va-tuan-thu.vi.md) | Văn bản hiện hành theo điều/khoản; giao từng phần, bán chịu, bán lưu động, trả/khuyến mại; dữ liệu cá nhân và giới hạn áp dụng |
| [Phân khúc, pilot và tích hợp](pilot-va-tich-hop.vi.md) | So sánh mô hình NPP; hồ sơ ứng viên/quan sát; bằng chứng API; contract tích hợp/9 ca sandbox; import/cutover, báo cáo và KPI |
| [Sổ nguồn tổng](sources.md) | Xuất xứ, phạm vi kiểm chứng, nguồn nội bộ, nguồn sản phẩm/API và liên kết sổ B/T/L |

## 3. Mức hoàn thành theo mười mục tiêu B005

“Có phương án” khác với “đã được Owner chọn”, và khác với “đã chạy trên sản phẩm”. Bảng dưới ghi rõ phần thực sự làm được trong đợt tài liệu.

| Mục tiêu | Kết quả đã có | Bằng chứng cần bổ sung để đạt điều kiện kết thúc B005 |
|---|---|---|
| NC-01 Phân khúc/pilot | Đối chiếu workflow nhà cung cấp; chọn archetype khuyến nghị; điều kiện tuyển và bộ thu thập bằng chứng | Phỏng vấn/quan sát; quy mô và baseline thật; đơn vị tham gia, người quyết định mua và người đối soát |
| NC-02 Thuật ngữ/mô hình | Glossary, quan hệ tùy chọn, vai trò và quyền; phân biệt bên thuê SaaS/tenant/đơn vị bán/Customer/Outlet | Kiểm tra với chứng từ của NPP, trường hợp đổi chủ điểm bán, kiêm nhiệm; Owner duyệt ràng buộc |
| NC-03 A/B | Luồng, trạng thái độc lập, ma trận tác động/đảo, bàn giao và ngoại lệ | Dựng lại một ngày/chuyến thật và đối chiếu với người chịu trách nhiệm |
| NC-04 UoM/tồn/giá vốn | So sánh FIFO–bình quân; khuyến nghị một phương pháp; làm tròn, quà/trả, khóa kỳ; số liệu giả lập đã tính | SKU/quy đổi/lô/phí mua thật; kế toán xác nhận; hệ thống cho kết quả như oracle |
| NC-05 Giá/ưu đãi | Tập rule tối thiểu, thứ tự, loại trừ/cộng dồn, snapshot, giao thiếu và trả | Bảng giá/chương trình thực, hồ sơ khuyến mại và dữ liệu thuế; Owner duyệt tập hỗ trợ |
| NC-06 Công nợ/tiền | Ba sổ, phân bổ/thu thừa/hoàn, nộp quỹ/bàn giao, tạm ứng tối thiểu; số dư kỳ vọng | Phiếu thu/nộp/sao kê/tạm ứng; quyền duyệt; xác nhận chính sách với kế toán |
| NC-07 PWA | Khảo sát API trình duyệt; contract quyền offline, idempotency, cạnh tranh, giữ sự kiện và đóng chuyến | Spike trên thiết bị pilot, mất mạng/quota/restart/thu hồi quyền, fault injection; giới hạn offline được chọn |
| NC-08 Hóa đơn/thuế | Đọc văn bản hiện hành, lập ma trận áp dụng; khảo sát tài liệu API và ca lỗi; phát hiện điều kiện B offline | Loại hóa đơn/SKU/đơn vị thực; tài khoản và contract provider; sandbox; kế toán xác nhận cách vận hành |
| NC-09 Tenant/ops | Runbook đề xuất và mô hình chi phí; cách ly toàn chuỗi; phục hồi sau ACK; phân loại dữ liệu | Diễn tập hai tenant/migration/restore, RPO/RTO thực đo; vai trò và hồ sơ dữ liệu cá nhân áp dụng |
| NC-10 Onboarding/giá trị | Mẫu cấu trúc import, cutover có manifest, bộ tác vụ, công thức báo cáo/KPI | File thật, thử prototype, baseline; sau triển khai mới có dữ liệu dùng/chi phí/tiếp tục trả phí |

## 4. Các quyết định thiết kế được nghiên cứu sâu

### 4.1. Chọn đúng người dùng và chủ thể mang hàng/nợ

MobiWork công bố cả pre-sales/van-sales; MISA có workflow đơn NPP, điều phối từ nhiều nguồn và trả không gắn đơn. Tuy vậy, mô hình sell-out giúp hãng theo dõi doanh số tại NPP không đồng nhất với phần mềm của NPP trực tiếp sở hữu hàng và mang khoản phải thu. [M01–M04](sources.md).

Do đó, đề xuất pilot đầu lấy **NPP tự mua–bán**, một đơn vị bán/MST trong tenant, nhiều kho/xe. `Customer` là bên chịu nợ; có thể không có Outlet hoặc có nhiều Outlet. Khi giao phải có địa chỉ nhận cụ thể, có snapshot trên chứng từ. `Dealer`/`Distributor` là vai trò thương mại, không tự quyết định hàng thuộc ai. `SaaSSubscriber` là bên ký/trả phí SaaS, khác với khách mua hàng trong sổ vận hành.

Không bắt mọi Customer có một Outlet giả và không gộp mọi giao dịch tại một điểm thành một bên nợ. Đổi chủ điểm bán giữ lịch sử bên nợ cũ; hàng quan sát tại Outlet phục vụ viếng thăm không được cộng vào tồn sở hữu NPP.

### 4.2. A/B khép kín theo sự kiện, không theo một trạng thái “hoàn tất”

Đơn A có thể giao nhiều lần và còn nợ sau khi đóng phần giao. B cần cùng dữ liệu khách/hàng/giá nhưng tạo bán–giao tại điểm. Chuyến hỗn hợp A+B là khả năng mô hình khuyến nghị: hàng giữ A và hàng tự do B có ngân sách riêng. Pilot đầu có thể chạy chuyến riêng để giảm thao tác; cả hai module vẫn thuộc MVP.

Mốc ghi nợ vận hành gắn với giao/chuyển giao được chấp nhận. Hóa đơn liên kết đến nghiệp vụ này và có lifecycle riêng; tạo hóa đơn không tạo thêm nợ. Trả, hoàn tiền và sửa hóa đơn cũng là các bước có liên kết, không suy một hành động tự hoàn tất mọi bước khác.

Một lần giao hoặc thu ngoài đời có thể đến server muộn, sau khi kỳ khóa hay nhân viên hết quyền. Hệ thống phải có hồ sơ ngoại lệ giữ sự thật, chứng cứ và người chịu trách nhiệm, trong khi ngăn ghi sổ/phát hành tự động sai. Đây là giới hạn cần bổ sung cho nhận định “đơn offline chỉ là yêu cầu” trong R003: phù hợp A chưa giao, chưa đủ cho B đã giao/thu. R003 được giữ nguyên như bản lịch sử.

### 4.3. Khóa UoM, giá vốn và rule thương mại trước khi làm báo cáo lãi

Nguồn Microsoft mô tả đơn vị tồn gốc/đơn vị thay thế và độ chính xác; ERPNext mô tả cả FIFO và bình quân bị ảnh hưởng bởi thay đổi giao dịch quá khứ. [B01, B03](nguon-nghiep-vu.md). Cách áp dụng được khuyến nghị:

- Một UoM gốc mỗi SKU; quy đổi và giá theo quy cách có phiên bản. Lưu lượng nhập, lượng gốc, hệ số và giá đã dùng trên dòng chứng từ.
- Bình quân di động theo SKU×địa điểm; chuyển kho giữ nguyên tổng giá trị, hàng tặng vẫn giảm lượng và có chi phí, trả có nguồn dùng giá vốn xuất gốc.
- Lô/hạn dùng phục vụ chọn hàng và truy xuất; khu cách ly tách khỏi tồn bán được. Không dùng “hàng tặng có giá bán bằng 0” để suy giá vốn/thuế bằng 0.
- Xuất hết lấy toàn bộ giá trị còn lại để lượng và giá trị cùng về 0. Phí mua biết muộn và lệnh muộn sau khóa kỳ có chứng từ điều chỉnh/phê duyệt, không sửa lịch sử âm thầm.

Pricing MVP đề nghị: ưu tiên giá Customer → nhóm → kênh → mặc định; một chiết khấu dòng theo hợp đồng và tối đa một khoản toàn đơn; một khuyến mại chính trên cùng phạm vi SKU, giảm tiền/% hoặc mua X tặng Y, có cờ cho phép cùng chiết khấu. Rule trùng cấp/hiệu lực phải xử lý trước công bố. Có snapshot, cách phân bổ và lý do tính ra số tiền để nhân viên giải thích được.

Giá A khóa ở mốc xác nhận được chọn; B dùng gói giá có quyền/phiên bản trước chuyến. Giao thiếu/đổi/trả dùng lượng giao và phân bổ gốc; chính sách thu hồi quà/tiền khi trả phải công bố trước. Không chờ đến sync để thay lại khoản đã giao dịch với khách.

### 4.4. Bộ số liệu giả lập đã kiểm tra được gì?

[Phụ lục nghiệp vụ](nghiep-vu-va-so-lieu.vi.md) có bộ tính xuyên suốt, dùng chai/lốc 6/thùng 12, hai lần nhập khác giá, phí mua, chuyến hỗn hợp, quà, trả và ba sổ tiền. Đây là **oracle của quy tắc đề nghị**, không phải dữ liệu NPP hay kết quả engine đã triển khai. Tiền trong ví dụ là lớp tiền hàng minh họa trước xử lý thuế; không mặc định thuế suất 0% và không dùng làm hóa đơn thật.

| Mốc trong ví dụ | Số dư/quan hệ kỳ vọng |
|---|---|
| Nhập tổng 240 chai, gồm phí mua | Giá trị 2.640.000 đồng; bình quân 11.000 đồng/chai |
| Cấp chuyến 126 chai | 26 giữ cho A; 100 dành B; chỉ chuyển địa điểm, không tạo doanh số |
| Sau giao A/B, hàng tặng và một lần trả | Còn 165 chai toàn đơn vị: 152 bán được, 13 cách ly; giá trị 1.815.000 đồng |
| Giá trị hàng đã ra ròng | 825.000 đồng; cộng giá trị tồn bằng 2.640.000 đồng |
| Tiền hàng thuần sau trả | 957.000 = phải thu còn 342.000 + tiền thu hộ ròng 235.000 + chuyển khoản 380.000 |
| Nhân viên nộp 235.000 đồng | Thu hộ còn 0; quỹ tăng 235.000; phải thu không giảm lần hai |
| Tạm ứng | 300.000 cấp − 180.000 chi duyệt − 120.000 hoàn = 0; độc lập với tiền thu khách |

Giá trị của ví dụ là phát hiện ngay thiết kế ghi trùng nợ, ghi thiếu quà, nhầm tiền nộp quỹ với tiền trả nợ hoặc bỏ giá vốn khi trả. Bước tiếp theo là thay bằng dữ liệu được phép của pilot và chạy chính những bất biến này trên ứng dụng.

### 4.5. Offline: giải quyết quyền trước, đồng bộ sau

Tài liệu MDN ghi Background Synchronization còn hạn chế độ phủ; WebKit mô tả storage có thể bị eviction và persistence có điều kiện. Vì thế phải có sync khi ứng dụng mở/foreground và thao tác chủ động; không phụ thuộc việc trình duyệt tự gửi nền hoặc coi cài PWA là có backup. [T01–T07](nguon-ky-thuat.md).

Đề nghị một installation ghi chính/chuyến, khác với số người giao/lái. Gói quyền quy định hàng, phần tín dụng từng khách không chồng chuyến khác, phiên bản giá, thời hạn và loại hành động. Hết hạn không tự thu hồi ngân sách về quỹ chung vì có thể còn giao dịch chưa gửi. Trả hàng offline chưa kiểm tra không tự tăng tồn được bán; chuyển khoản do khách báo chưa tự là tiền đã về.

Lệnh có ID bất biến, hash, nguồn, thứ tự/phụ thuộc và phiên bản quyền. Server ACK `posted` chỉ sau commit bền của receipt, các hiệu ứng liên quan và outbox; receipt `recorded_exception` chỉ xác nhận lưu sự kiện để xử lý, chưa đồng nghĩa ghi sổ. Retry cùng ID/hash trả kết quả cũ; hai ID khác nhau tranh hàng/tín dụng cần kiểm soát cạnh tranh riêng. Outbox giúp chuyển tác động sau commit nhưng không tự bảo đảm đúng một lần tại provider. [T11–T14](nguon-ky-thuat.md).

Đóng chuyến yêu cầu writer ngừng tạo mới, chốt sequence/manifest, gửi đủ, đối soát hàng–tiền và nhận ACK đóng. Mất máy cần hồ sơ ngoại lệ; màn hình server “không có lệnh chờ” không chứng minh máy đã gửi hết. Những nguyên tắc này cũng áp dụng vào cutover và restore.

### 4.6. Hóa đơn: phải cập nhật baseline pháp lý và kiểm chứng provider

Đã kiểm tra bản ký NĐ **254/2026/NĐ-CP**, TT **91/2026/TT-BTC** và chuỗi văn bản liên quan ở [phụ lục pháp lý](hoa-don-va-tuan-thu.vi.md). Không tiếp tục dùng NĐ 123/2020 và 70/2025 như toàn bộ baseline hiện hành tại ngày nghiên cứu.

Đối với luồng bán hàng trong phạm vi nghiên cứu, NĐ 254 Điều 9(1)/(3) gắn thời điểm lập với chuyển quyền sở hữu/quyền sử dụng hàng và từng lần giao; Điều 6(3)(đ) xử lý hàng bán lưu động; điểm 7 Phụ lục phân biệt mốc lập với ký/gửi. **Biên nhận, nháp hoặc event PWA chưa được chứng minh là hóa đơn điện tử hợp lệ.** Mất mạng thường xuyên trên tuyến cũng không tự trở thành trường hợp bất khả kháng của Điều 14. [L — NĐ 254](nguon-phap-ly.md).

Khuyến nghị MVP ban đầu có kênh lập hóa đơn online/điều phối đúng thời điểm áp dụng. B hoàn toàn offline chỉ mở sau khi có giải pháp provider phù hợp được xác minh. Nếu chưa chuyển giao mà không có kênh, dừng trước mốc đó. Nếu thực tế đã giao/thu, vẫn ghi sự kiện đúng và giao kế toán xử lý ngoại lệ; không xóa lịch sử hoặc ghi lùi thời gian để tạo vẻ tuân thủ.

Đã tìm được schema meInvoice đọc trực tiếp; một số tài liệu integration cũ còn trong chỉ mục nhưng mở trả 404. Chưa có sandbox nên chưa chốt contract retry/lookup hay xác nhận khả năng offline. Khuyến nghị một provider đầu tiên theo đơn vị pilot; nếu không có ràng buộc, ưu tiên khảo sát meInvoice trước vì có bằng chứng schema, **không phải đã chứng minh ưu việt hơn về giá/chất lượng**. [I01–I06](sources.md).

Một yêu cầu then chốt: sau timeout, tra cứu rỗng có thể do xử lý chưa xong. Phải xác minh lookup theo client reference ổn định hoặc idempotency contract, kể cả độ trễ xuất hiện. Khi chưa biết provider đã nhận chưa, giữ `unknown`, không phát hành lại tùy ý.

### 4.7. Tenant, khôi phục và dữ liệu cá nhân

Giữ quyết định mỗi tenant một DB. R006 bổ sung cách định tuyến tin cậy, credential tối thiểu, phạm vi file/cache/job/PWA, schema registry, migration có điều kiện dừng và quyền hỗ trợ có audit. Không chốt stack/cloud mới.

Tài liệu PostgreSQL cho thấy logical dump một DB và PITR toàn cluster là hai cơ chế khác nhau. Nếu chọn mô hình này, khôi phục riêng tenant từ PITR có thể cần cluster tạm rồi trích DB. Đây là ví dụ kỹ thuật để yêu cầu diễn tập thực, không phải quyết định chọn PostgreSQL. [T15–T17](nguon-ky-thuat.md).

Restore có thể làm DB quên lệnh đã ACK trong khi hóa đơn ngoài hệ thống vẫn tồn tại. Cần chế độ phục hồi, đối chiếu journal/receipt/thiết bị/provider, đổi `recoveryEpoch`, khóa replay tự động và mở lại sau xác nhận. Chưa có cơ sở hứa RPO bằng 0; phải phân biệt dữ liệu server đã ACK với dữ liệu chỉ ở máy.

Luật 91/2025/QH15 và NĐ 356/2025 là một phần baseline dữ liệu cá nhân. Định vị và mô hình SaaS xử lý dữ liệu thay khách cần được phân loại đúng; không mặc định mọi SME được miễn nghĩa vụ. Phụ lục pháp lý phân biệt nghĩa vụ đã thấy trong văn bản với việc áp dụng còn cần xác nhận cho mô hình cụ thể. Chưa có nhu cầu GPS nền liên tục được kiểm chứng nên không đưa chức năng đó vào điều kiện MVP.

## 5. Danh mục quyết định đề nghị Owner chốt

Các quyết định đã có vẫn giữ: A+B, PWA, phân vai xe máy/xe tải, mỗi tenant một DB và phạm vi hóa đơn–kho–công nợ–báo cáo. Bảng sau là **quyết định mới được chuẩn bị để xem xét**, chưa phê duyệt.

| Mã | Khuyến nghị | Vì sao cần chốt trước triển khai | Người cung cấp bằng chứng/kiểm tra |
|---|---|---|---|
| Q01 | NPP tự mua–bán hàng đóng gói; một đơn vị bán/MST mỗi tenant | Quyết định hàng/nợ/hóa đơn thuộc ai; tránh lẫn mô hình hãng/sell-out | Owner + ứng viên pilot |
| Q02 | Customer 0..n Outlet; địa chỉ nhận snapshot; Subscriber khác Tenant | Ảnh hưởng dữ liệu lõi và import; khó đổi sau phát sinh | Owner + vận hành/kế toán |
| Q03 | Hỗ trợ mô hình A+B chung chuyến bằng hai phần phân bổ; pilot có thể dùng chuyến riêng | Tránh B tiêu hàng đã hứa A; giữ scope cả hai module | Vận hành + kỹ thuật |
| Q04 | Bình quân di động theo SKU×địa điểm; FEFO/lô theo SKU; khóa kỳ | Giá vốn và số dư cần nhất quán ngay từ import | Kế toán + Owner |
| Q05 | Tập pricing/ưu đãi hữu hạn ở §4.3; giá A/B snapshot; chính sách trả/quà công bố trước | Thay đổi tiền, tín dụng, quà và hóa đơn | Bán hàng + kế toán |
| Q06 | Ba sổ tiền; tạm ứng mức cấp–duyệt chi–hoàn dư | B005 yêu cầu quyết định phạm vi; không để chi tuyến tự trừ thu hộ | Owner + kế toán |
| Q07 | Một writer/chuyến; quyền offline hữu hạn; ngoài quyền giữ hồ sơ ngoại lệ | Tồn/tín dụng có thể bị nhiều lệnh tiêu đồng thời | Owner + vận hành + kỹ thuật |
| Q08 | Một provider; B có kênh lập hóa đơn đúng thời điểm; fully offline có điều kiện | Ràng buộc sản phẩm và vận hành tuyến; không chỉ là API task | Kế toán + provider + Owner |
| Q09 | RPO/RTO, đời quyền sau restore, cửa sổ lưu receipt/journal và quyền hỗ trợ | Quyết định chi phí và mức phục hồi cam kết được | Owner + kỹ thuật/vận hành |
| Q10 | Cutover có chốt writer/manifest; thỏa thuận KPI và trách nhiệm pilot | Tránh ghi lại số dư cũ; biết thế nào là có giá trị | NPP pilot + Owner |

Không chọn số giờ offline, mức tín dụng, thời gian lưu dữ liệu hoặc SLA bằng phỏng đoán. Những con số này phải nối với dữ liệu tuyến, yêu cầu pháp lý và năng lực vận hành; điều đó không ngăn chốt cấu trúc quyền và luồng lỗi từ bây giờ.

## 6. Backlog kiểm chứng và điều kiện chuyển bước

### 6.1. Đối chiếu bộ E2E của B005

| Tình huống | Đầu ra nghiên cứu đã chuẩn bị | Kiểm chứng còn phải chạy |
|---|---|---|
| E2E-01 Customer nhiều Outlet, giao A nhiều lần | Quan hệ bên nợ/địa chỉ/lượt giao, quyền xe tải, nợ và hóa đơn riêng | Dữ liệu/chứng từ pilot; tác vụ trên prototype |
| E2E-02, 04, 05 hàng xe/UoM/giá vốn | Quy tắc lượng, giữ A, B tự do, quà, giá trị chuyển/hoàn; ví dụ số và làm tròn/xuất hết | Engine khớp số dư kỳ vọng với UoM/lô/giá thật |
| E2E-03, 06 thu/nộp, giao thiếu/trả/ưu đãi | Ba sổ và số liệu xuyên suốt; chính sách trả/quà; liên kết chứng từ | Kế toán duyệt và chạy lại tình huống có thuế/hóa đơn phù hợp |
| E2E-07, 08 mất ACK/cạnh tranh | Envelope, receipt, atomic transaction, reservation và unique effects | Gây lỗi có kiểm soát, hai ID khác nhau tranh hàng/tín dụng |
| E2E-09, 10 giá/quyền đổi, đóng khi máy offline | Bảo toàn sự kiện, gói hữu hạn, handshake và đóng ngoại lệ | Thiết bị thật, restart, đổi quyền/mất máy và nâng phiên bản |
| E2E-11 provider nhận mất phản hồi | Client reference, trạng thái unknown, bảng INV-01–09 | Sandbox provider với độ trễ lookup, lỗi từng phần tử và sửa/trả |
| E2E-12 đổi tenant/restore | Ma trận cách ly, runbook, recovery epoch và đối chiếu tác động ngoài | Hai tenant cùng mã danh mục, lỗi migration và restore sau ACK |

### 6.2. Thứ tự ưu tiên sau nghiên cứu

**Bước 1 — Chốt phần làm thay đổi mô hình và tìm bằng chứng thực địa.** Xem Q01–Q08 cùng một đơn vị có người chốt kho/nợ/hóa đơn. Thu mẫu chứng từ, thiết bị và hình thức lập hóa đơn trước khi biến phương án thành schema/backlog cố định.

**Bước 2 — Thử ba rủi ro có khả năng buộc thay đổi cách vận hành:** B và hóa đơn đúng thời điểm; quyền/ACK/đóng chuyến trên thiết bị; restore sau tác động ngoài. Làm các spike có dữ liệu/expected result từ R006, lưu log và số dư, không chỉ quay màn hình đường thuận lợi.

**Bước 3 — Chuyển phương án đã duyệt thành đặc tả triển khai.** Mỗi yêu cầu nối tới quyết định, chứng từ, source, quy tắc và E2E tương ứng. Dùng bộ số liệu làm oracle; làm rõ thuế, trạng thái ngoại lệ và người xử lý. Không cần xây nhiều microservice hay tối ưu tuyến để giải quyết các câu hỏi này.

**Bước 4 — Chuẩn bị và chạy pilot có giới hạn.** Import/đối chiếu số dư, khóa lệnh cũ, tập huấn thao tác, diễn tập khôi phục và bố trí hỗ trợ. Đo baseline rồi kết quả trên cùng loại tác vụ; báo n/N, thời gian, chênh lệch và công hỗ trợ. Chỉ sau đó mới kết luận về sử dụng tiếp/trả phí.

Giả thuyết giảm 30% thời gian đối soát hoặc ngưỡng 90% hoàn thành tác vụ là **đề xuất để thống nhất trước đo**, không phải kết quả, cam kết hoặc benchmark ngành. Chưa đủ đầu vào để đưa lịch xây/pilot hoặc chi phí đáng tin cậy; đợt nghiên cứu không tạo giả các con số này.

## 7. Bàn giao và giới hạn cuối đợt

R006 đã chuyển B005 từ danh sách câu hỏi thành các phương án có đánh đổi, hợp đồng hành vi, số dư kỳ vọng, ma trận pháp lý và ca kiểm chứng. Các báo cáo cũ được giữ nguyên; README và B005 được cập nhật để người đọc tìm được kết quả mới và biết đúng mức hoàn thành.

**Đủ cơ sở xem xét/chốt các quyết định và chuẩn bị đặc tả/spike. Chưa đủ để tuyên bố MVP đã sẵn sàng pilot hoặc toàn bộ B005 đã nghiệm thu.** Phần thiếu được định danh cụ thể: đơn vị và chứng từ thật, phê duyệt chính sách, thiết bị/sandbox, dữ liệu mở đầu, kết quả diễn tập và số đo sử dụng. Không có phỏng vấn, báo giá, test thiết bị hay giao dịch hóa đơn thật được thực hiện trong đợt này.
