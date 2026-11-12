# R008-SPEC — Đặc tả MVP hợp nhất để xem xét chấp nhận

- Ngày: **12/11/2026**, Asia/Bangkok.
- Đầu vào: [R007](../2026-11-12-07-review-pr1-va-muc-tieu-tiep-theo/report.vi.md), [B007](../../briefs/2026-11-12-07-kiem-chung-va-chot-dac-ta-mvp.md), baseline PR #1 `d1ef1627f2b624bba2d01d32a3cf77eb35a7cf18`.
- **Trạng thái: bản đặc tả đề nghị sau nghiên cứu, chưa được Owner/người phụ trách nghiệp vụ chấp nhận toàn bộ.** Yêu cầu thực hiện nghiên cứu cho phép xây phương án và kiểm chứng mô hình; không tự chuyển phương án thành quyết định sản phẩm.
- Đây là nguồn đọc hợp nhất trong R008. Các quy tắc chuyên sâu nằm ở [nghiệp vụ](nghiep-vu-va-so-lieu.vi.md), [offline/phục hồi](offline-va-phuc-hoi.vi.md), [hóa đơn/dữ liệu](hoa-don-va-du-lieu.vi.md), [pilot/bàn giao](pilot-va-ban-giao.vi.md). [Tổng hợp kết quả](report.vi.md).

## 1. Mục tiêu, phạm vi và cách áp dụng

MVP phục vụ NPP tự mua–bán hàng tiêu dùng đóng gói: quản lý đúng hàng thuộc NPP ở kho/xe, đơn/giao A và bán B, nghĩa vụ thanh toán, tiền người thu đang giữ, hóa đơn và các tác vụ ngoài thị trường. Cần nối được một giao dịch từ người dùng đến chứng từ/sổ và xử lý ngoại lệ, kể cả lúc mạng gián đoạn.

**Đã được chủ dự án xác nhận từ trước:** A — đặt trước rồi giao; B — bán theo xe; PWA; mỗi tenant một DB; xe máy người giao đồng thời là người lái, xe tải có thể tách hai người; hóa đơn điện tử trong phạm vi. Các lựa chọn chi tiết ở §3 là đề nghị nghiên cứu. Căn cứ lịch sử: [README tại baseline](https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/blob/d1ef1627f2b624bba2d01d32a3cf77eb35a7cf18/README.md), [R002-D01](../2026-11-11-02-nghiep-vu-mvp-pwa/quyet-dinh-va-thuat-ngu.vi.md), [R003](../2026-11-11-03-deep-research-mvp-kien-truc/report.vi.md).

Khi một phần R008 được chấp nhận, ghi `decision_id`, phiên bản, phạm vi, người/ngày chấp nhận và các ngoại lệ. Chỉ phạm vi đó trở thành đặc tả triển khai. Trước thời điểm này, có thể dùng số liệu/mô hình để so sánh phương án, nhưng không tự khóa schema hoặc hứa SLA cho khách.

Trong bản ứng viên này, quy tắc chuyên sâu R008 giải thích/bổ sung điểm tương ứng của R006. Khi chưa có quy tắc mới, tham chiếu nội dung R006 được nêu rõ; không hợp nhất bằng cách âm thầm sửa hồ sơ cũ. Nếu hai phần R008 xung đột, phải giải trước khi chuyển phần đó sang triển khai.

## 2. Các bất biến cần bảo vệ

| Mã | Bất biến đề nghị | Hệ quả thực thi |
|---|---|---|
| I01 | Một tác động nghiệp vụ có định danh ổn định, chỉ ghi sổ một lần | Retry cùng ID/hash trả lại kết quả; payload khác không ghi đè |
| I02 | Chuyển hàng kho–xe không phải bán hàng | Chuyển lượng/giá trị giữa địa điểm, chưa tạo phải thu hoặc doanh số |
| I03 | Hàng giữ cho A không bị B tiêu mất | Phân bổ A và quyền B cùng trừ một nguồn lượng, không đếm trùng |
| I04 | Customer là bên chịu nợ, ShipTo/Outlet là nơi giao | Đổi chủ/địa chỉ điểm bán không đổi lịch sử bên nợ |
| I05 | Giá, quy đổi, terms và phân bổ tiền đã ghi giữ được nguồn/phiên bản | Không tính lại chứng từ cũ từ danh mục hiện tại |
| I06 | Nhận giữ hộ chưa phải nhận trả sở hữu hoặc giảm nợ | Chỉ chấp nhận thương mại và nhận lại theo quy tắc mới phát sinh tác động tương ứng |
| I07 | Tổng trả không vượt lượng/giá trị nguồn được phép hoàn | Dùng lượng/giá trị lũy kế, phiên bản điều chỉnh và phần dư |
| I08 | Thu tiền, nộp tiền và tạm ứng là các tác động khác nhau | Thu có thể giảm nợ; nộp quỹ không giảm nợ lần hai; chi tuyến không tự trừ thu hộ |
| I09 | Hóa đơn không tạo lại khoản phải thu đã phát sinh từ giao hàng | Liên kết khoản/dòng, trạng thái lập/ký/gửi độc lập |
| I10 | Mỗi lệnh chưa xong có chủ thể chịu trách nhiệm tiếp tục | Durable receipt hoặc client retry, không có trạng thái rơi giữa hai bên |
| I11 | Restore không tự phục hồi quyền, yêu cầu dữ liệu hoặc tác động ngoài đã thay đổi | Đối chiếu nguồn hiện hành trước mở lại, đời quyền không lặp |
| I12 | Báo cáo không coi dữ liệu chưa đồng bộ là số 0 đã xác nhận | Hiển thị mốc cập nhật, chuyến/gói quyền chưa chốt và ngoại lệ |

Đây là yêu cầu cần kiểm chứng khi xây sản phẩm. Mô hình nghiên cứu chỉ kiểm tra một tập trường hợp và giả định được nêu trong từng phụ lục.

## 3. Sổ quyết định Q01–Q10 sau nghiên cứu

Các hàng dưới đều ở trạng thái **PROPOSED**. Không điền người/ngày chấp nhận khi chưa có xác nhận thực tế. `Research authorized: 12/11/2026` là trạng thái khác với `Product policy accepted`.

| Q | Phương án đề nghị sau R008 | Lý do và đánh đổi | Điều kiện/đầu vào cần chấp nhận |
|---|---|---|---|
| Q01 | Một đơn vị bán/MST trong một tenant, nhiều kho/xe; archetype tự mua–bán | Giữ rõ chủ hàng/nợ/hóa đơn; chưa xử lý hàng hãng gửi bán nhiều chủ | Hồ sơ đơn vị pilot, người sở hữu hàng và bên xuất hóa đơn |
| Q02 | Subscriber khác Tenant; Customer có 0..n Outlet; giao lưu ShipTo snapshot | Không cần Outlet giả; giữ quan hệ chủ điểm theo hiệu lực; import cần mã bên nợ rõ | Owner/vận hành đối chiếu chứng từ và dữ liệu khách |
| Q03 | Một mô hình chứng từ cho A/B; hỗ trợ chuyến hỗn hợp bằng phân bổ riêng | Cả A/B giữ trong MVP; pilot có thể chạy chuyến riêng trước, nhưng không coi đã thử hỗn hợp | Kho/người giao chấp nhận phân bổ; chạy E2E-02 trước mở mixed mode |
| Q04 | Bình quân di động theo SKU×địa điểm; lô/FEFO theo SKU; khóa kỳ; hoàn nguồn lũy kế | Phù hợp mục tiêu sổ lượng/giá trị; không cung cấp giá vốn theo từng lô mua nếu không bổ sung phương pháp | Kế toán xác nhận chính sách, số đầu, phí mua và quyền điều chỉnh |
| Q05 | Pricing hữu hạn, snapshot; quà theo mua ròng/quà đang giữ; miễn thu hồi có nguồn; tiền/thuế theo profile | Dễ giải thích, có phần dư kiểm tra được; không hỗ trợ cộng dồn tùy ý hoặc tự suy thuế hàng tặng | Bán hàng/kế toán duyệt rule và hồ sơ thuế/provider thực |
| Q06 | Ba sổ tiền; tạm ứng tối thiểu cấp–duyệt chi–hoàn; khoản mới có due_date snapshot | Tránh bù thu hộ vào chi tuyến; cần tác vụ xác nhận tiền thực nhận | Người phụ trách tiền/nợ duyệt terms, phân bổ và hoàn |
| Q07 | Một writer/chuyến; SaleDeliveryReceipt atomic; quyền offline hữu hạn, không tự nạp lại từ thu nợ cũ | Giảm cạnh tranh; thay writer phải đối chiếu phần việc cũ; dữ liệu đã xảy ra được tiếp nhận dạng ngoại lệ khi hết quyền | Vận hành chấp nhận giới hạn thiết bị/thời gian và quy trình ngoại lệ |
| Q08 | Một provider đầu tiên; đủ chứng từ cấp xe; B có kênh lập đúng thời điểm được xác minh | Chưa chọn tên vendor trước hồ sơ pilot; tài liệu public chưa chứng minh chạy offline hoặc retry an toàn | Kế toán/provider xác nhận hồ sơ, sandbox và khả năng tra cứu/chứng từ |
| Q09 | Durable inbox; authority quyền/yêu cầu dữ liệu/đời phục hồi ngoài phạm vi tenant rollback; mở lại có đối chiếu | Tăng phần vận hành control plane, không biến DB riêng thành bảo đảm khôi phục | Chọn ngân sách, retention, RPO/RTO, TTL; diễn tập thiết bị và hạ tầng |
| Q10 | Cutover có freeze/manifest và nguồn đối chiếu; đo baseline theo tác vụ, chi phí đủ công hỗ trợ | Cần người và dữ liệu thực tế, không kết luận giá trị từ demo | Pilot xác nhận đầu vào, người chịu trách nhiệm, ngưỡng và lịch phù hợp |

Ngoài Q01–Q10, các giá trị triển khai như TTL, thời gian giữ journal, cỡ gói tải và RPO/RTO phải nằm trong configuration/profile có phiên bản. Không dùng một con số minh họa trong mô hình làm cam kết vận hành.

## 4. Ma trận khả năng MVP

`Online` nghĩa là bước ghi chính thức cần server/authority hiện hành; `Offline có quyền` là chỉ trong grant/gói hợp lệ; `Ghi nhận` là lưu thông tin/sự kiện, chưa đồng nghĩa duyệt hoặc ghi sổ. Tất cả là phạm vi ứng viên Q01–Q10.

| ID | Công việc và người dùng | Khả năng/giới hạn đề nghị | Tình huống vượt giới hạn |
|---|---|---|---|
| M01 | Thiết lập đơn vị bán/tenant, quyền — Owner/quản trị | Online; không cho bên trả phí tự xem tenant khác | Thiếu quyền/authority: chưa mở truy cập |
| M02 | SKU, UoM, lô, mã vạch, giá — quản lý/kho | Online phiên bản hóa; offline chỉ đọc snapshot đã cấp | Quy cách mới chưa cấp: lưu yêu cầu, không tự quy đổi |
| M03 | Customer/Outlet/ShipTo — sales/quản lý | Khách/điểm được phân công; địa chỉ giao snapshot | Khách chưa được xác minh: nháp/yêu cầu tạo online trước giao dịch cần quyền |
| M04 | Đặt A — sales | Nháp/yêu cầu có thể offline; giá/tín dụng/giữ hàng được xác nhận theo chính sách | Không hứa đã giữ hàng chỉ vì đã lưu nháp |
| M05 | Soạn/cấp chuyến — kho/người giao | Online đối chiếu lượng/lô, A-reservation/B-quota, chứng từ cấp xe, writer | Thiếu hàng/chứng từ: chưa release; ghi lý do và phương án |
| M06 | Bán B — nhân viên được giao quyền | Offline có quyền hàng/giá/tín dụng và kênh hóa đơn đáp ứng hồ sơ; sale/giao/thu cùng command | Ngoài quyền trước bán: xin xử lý online; việc đã xảy ra: hồ sơ ngoại lệ bền |
| M07 | Giao A từng phần — người giao | Ghi đúng lượng thực và nguồn đơn; hủy hoặc giao phần còn lại riêng | Giao thiếu không sửa lịch sử; hàng xe vẫn đối chiếu |
| M08 | Yêu cầu/nhận trả — sales/người giao/quản lý | Offline ghi nhận yêu cầu/giữ hộ; chấp nhận thương mại và ghi giảm theo quyền online trong baseline | Không có nguồn: giữ hộ chờ xác minh; không tự giảm nợ hoặc nhập hàng bán được |
| M09 | Giá/ưu đãi/quà — bán hàng/kế toán | Rule hữu hạn đã cấp; quà ròng, waiver có nguồn; snapshot đủ giải thích | Ngoài rule: xin duyệt; không sửa tiền khách đã trả lúc sync |
| M10 | Thu, phân bổ, hoàn — người thu/kế toán | Tiền mặt thực nhận hoặc ngân hàng đã xác minh; dư thành customer credit; hoàn có nguồn/quyền | Ảnh chuyển khoản chưa xác minh: pending, chưa trừ nợ/tiêu quyền như tiền đã nhận |
| M11 | Giữ/nộp/bàn giao tiền — người thu/thủ quỹ | Bên nhận xác nhận; nộp/bàn giao không giảm nợ lần hai | Thiếu tiền: ngoại lệ và chứng cứ; không tự tạo khoản bồi hoàn |
| M12 | Tạm ứng — kế toán/nhân viên | Cấp, duyệt chi, hoàn dư tách thu hộ | Chưa duyệt chi: không tự khấu trừ thu hộ hoặc ghi chi phí |
| M13 | Hóa đơn/chứng từ vận chuyển — kế toán/tích hợp | Adapter một provider, trạng thái riêng; UNKNOWN phải tra cứu | Không rõ đã lập: không tự đổi ID phát hành; có người xử lý |
| M14 | Nhập/điều chỉnh/kiểm kê — kho/kế toán | Online, có nguồn/phê duyệt; không kiểm kê bằng cách xóa quyền offline chưa chốt | Chuyến chưa đủ dữ liệu: khoanh vùng/đối chiếu, không kết luận chênh cuối |
| M15 | Báo cáo kho/nợ/tiền — quản lý/kế toán | Đến mốc server biết; truy về chứng từ, số chưa đồng bộ được biểu thị | Không báo số thời gian thực chính xác khi có máy chưa kết nối |
| M16 | Viếng thăm không đơn — sales | Offline ghi kết quả, lý do, quan sát và yêu cầu trả; không bắt tạo đơn 0 đồng | Điểm không ghé được: kết quả riêng; không tự đánh dấu đã giao |
| M17 | Import/cutover/bàn giao kế toán — người phụ trách | Preview/validate/approve/post; idempotent theo ID nguồn; opening không phát lại sale/receipt | Cùng ID khác payload hoặc có giao dịch phụ thuộc: điều chỉnh có duyệt |
| M18 | Quyền/restore/hỗ trợ — vận hành | Đối chiếu authority hiện hành, đời quyền mới; support được cấp đúng phạm vi/thời hạn | Authority không xác minh được: tenant chưa mở lại |
| M19 | Đồng bộ và dữ liệu xuống — PWA/server | Durable receipt, retry có chủ; atomic snapshot activation, journal tách khỏi projection | Gói tải dở: giữ gói cũ nếu còn hợp lệ, không bán bằng gói trộn |
| M20 | Giá vốn và hoàn nguồn — kế toán | Snapshot nguồn, phân bổ lũy kế, version điều chỉnh; khóa kỳ | Không xác định giá vốn nguồn: chưa tự nhập theo giá bán/bình quân hiện tại |
| M21 | Yêu cầu dữ liệu/audit — NPP/SaaS theo vai trò | Quy trình áp dụng theo loại dữ liệu/ngày, giữ bằng chứng, tái áp sau restore | Xung đột giữ chứng từ/xóa: hạn chế phần cần thiết và xử lý có thẩm quyền |
| M22 | Đo tác vụ và phục vụ pilot — Owner/vận hành | Cohort, n/N, tác vụ/loại mạng, chi phí trợ giúp có dữ liệu | Thiếu baseline/người dùng: chưa kết luận hiệu quả/trả phí |

Trong phạm vi ứng viên này, tối ưu tuyến tự động, nhiều pháp nhân/tenant, hãng quản lý sell-out, trả nhà cung cấp đầy đủ, sổ cái/phải trả, khuyến mại cộng dồn tùy ý và writer đồng thời không phải điều kiện mặc định của MVP. Chỉ mở rộng khi chứng từ/quy trình pilot chứng minh là điều kiện cần và Owner thay phạm vi.

## 5. Dữ liệu và định danh cần thống nhất

### 5.1. Bên giao dịch và nguồn sở hữu

| Nhóm | Quan hệ/ràng buộc đề nghị |
|---|---|
| Subscriber → Tenant → BusinessOperator | Một bên thuê có thể phụ trách nhiều tenant; mỗi tenant một DB và một đơn vị bán theo Q01; thanh toán SaaS không cấp quyền dữ liệu |
| Customer → Outlet → ShipTo snapshot | Customer có thể không có Outlet; Outlet có quan hệ chủ quản theo hiệu lực; chứng từ giữ bên nợ và địa chỉ lúc phát sinh |
| Employee/User/Assignment | Người chịu trách nhiệm khác tài khoản; assignment nêu vai trò, chuyến/tuyến, hiệu lực; xe tải người lái riêng không tự có quyền bán/thu |
| Trip/Vehicle/StockLocation | Trip là phiên công việc; xe là tài sản; StockLocation là nơi giữ lượng/giá trị; biển số không là khóa chứng từ |
| Order → Delivery → Receivable | Nhiều lần giao; phải thu phát sinh theo phần giao được chấp nhận và chính sách, không theo việc tạo hóa đơn lần nữa |
| ReturnLine → DeliveryLine | Mỗi dòng trả có một nguồn; phiếu có thể gồm nhiều nguồn; giới hạn lượng/tiền/giá vốn còn được trả |
| Receipt → Allocation → Receivable | Một phiếu thuộc một Customer, có thể phân bổ nhiều khoản; phần chưa phân bổ là có dư, không ép thành nợ âm không có nguồn |
| InvoiceIntent/ExternalDocumentLink | Nối legal seller/provider/reference/document type với dòng giao/điều chỉnh; trạng thái pháp lý riêng |
| Visit/Observation/ReturnRequest | Một Visit có 0..n quan sát và yêu cầu; không tự tạo StockMovement hay Delivery |

Thuật ngữ NPP/đại lý biểu thị vai trò/kênh; không dùng tên gọi để suy quyền sở hữu hoặc cách xuất hóa đơn. Chi tiết glossary kế thừa [R006-B §2](../2026-11-11-06-ket-qua-nghien-cuu-mvp/nghiep-vu-va-so-lieu.vi.md), với các quy tắc mới R008 nêu cụ thể.

### 5.2. Trường chung của chứng từ/sự kiện

`tenantId`, `businessOperatorId`, `businessEventId`, các `documentId/lineId`, `sourceDocumentId/sourceLineId`, `commandId`, `payloadHash`, `occurredAt`, `recordedAt`, `businessDate`, `actorId/assignmentId`, `reasonCode`, `policyVersion`, `postingPeriod`, `reversalOf/adjustmentOf` khi có.

Giờ thiết bị là bằng chứng được ghi nhận, không là thẩm quyền duy nhất để phân trước/sau cutover hoặc quyết định quyền. Mọi tiền có currency/precision/profile; lượng có UoM gốc, bước hợp lệ và hệ số snapshot. Không dùng số thực nhị phân cho kết quả tiền cần tái lập.

Các snapshot bắt buộc theo loại: giá/ưu đãi/quà, UoM, terms/due date, số tiền trước thuế–thuế–sau thuế, phân bổ giảm giá, nguồn giá vốn và lượng/giá trị đã hoàn; pháp lý/provider profile. Dòng chứng từ đã ghi không được thay bằng lookup danh mục hiện tại.

## 6. Chuyển trạng thái và tác động được phép

Tên trạng thái dưới là quy ước nghiệp vụ ứng viên; khi triển khai cần ánh xạ sang enum/API duy nhất cùng contract kỹ thuật. Không gộp trạng thái đơn, giao, tiền, hóa đơn và truyền dữ liệu vào một cờ `completed`.

| Đối tượng/chuyển bước | Điều kiện | Tác động/điều chưa được suy ra |
|---|---|---|
| Đơn A: nháp → yêu cầu → xác nhận | Bên mua/nơi nhận, giá/terms, quyền tín dụng và hàng được xác nhận theo policy | Snapshot; xác nhận không tự tạo doanh số/tiền |
| Đơn A: xác nhận → giao một phần → hết phần còn lại | Mỗi delivery tham chiếu nguồn; tổng giao/hủy phần chưa giao hợp lệ | Mỗi delivery tạo tác động tương ứng; không sửa lần giao trước |
| Chuyến: chuẩn bị → release | Bàn giao lượng/lô, allocation/grant, writer và chứng từ vận chuyển phù hợp | Hàng đổi nơi giữ, chưa phát sinh bán hàng |
| Chuyến: hoạt động → đối soát | Ngừng cấp công việc mới, thu manifest và dữ liệu thiết bị | Chưa tự giải phóng phần quyền chưa biết |
| Chuyến: đối soát → đóng | Hàng/tiền đã chuyển hoặc được người chịu trách nhiệm xác nhận; dữ liệu đầy đủ hoặc ngoại lệ được bàn giao hợp lệ | Đóng chuyến không tự chữa thiếu tiền, hoàn tất hóa đơn hoặc xóa nghĩa vụ đang mở |
| Trả: yêu cầu/giữ hộ → chấp nhận thương mại + nhận lại | Có nguồn, quyền duyệt, lượng/tiền/giá vốn xác định | Nhập cách ly và giảm nghĩa vụ theo rule; không tự cho bán lại |
| Trả: cách ly → bán được/loại bỏ | Kiểm tra chất lượng và chứng từ điều chuyển/loại bỏ có người duyệt | Không thay đổi giảm nợ khách lần hai |
| Receipt: ghi nhận → confirmed → allocated | Tiền thực nhận hoặc ngân hàng đã xác minh; Customer/source hợp lệ | Giảm khoản nợ/có dư đúng một lần; pending chưa được coi như tiền đã nhận |
| Handover: đề nghị nộp → bên nhận xác nhận | Đối chiếu thực nhận và chênh lệch | Chuyển custody; không chạy lại allocation khách |
| Hoàn: đề nghị → duyệt → đã chi | Có số dư/nguồn cho phép hoàn và nguồn tiền thực chi | Giảm customer credit/custody tương ứng; retry không chi/ghi lần hai |
| InvoiceIntent: chuẩn bị → gửi → kết quả hoặc UNKNOWN | Hồ sơ/mapping hợp lệ; ID và nội dung đóng băng | UNKNOWN phải tra cứu theo contract; không đổi ID rồi phát hành lại tùy ý |
| Đồng bộ: local journal → durable receipt → resolved/exception | Payload được lưu bền trước receipt; nghĩa vụ xử lý được phân rõ | Nhận bền không đồng nghĩa đã được duyệt nghiệp vụ |

Đóng chuyến có ngoại lệ chỉ bàn giao trách nhiệm vận hành và giữ nghĩa vụ mở; không được dùng để bỏ qua thời điểm lập hóa đơn hoặc hợp thức hóa số dư. Nếu thiếu bằng chứng thiết bị làm sai ranh giới quyền/tồn, phải giữ phần tài nguyên chưa xác định bị khóa theo [contract offline](offline-va-phuc-hoi.vi.md).

## 7. Phân quyền và giao diện tác vụ tối thiểu

| Vai trò | Tác vụ chủ yếu | Thông tin phải thấy khi xử lý |
|---|---|---|
| Sales | Điểm bán, viếng thăm, đơn A, yêu cầu trả | Phân công, giá/gói hiện hành, đã lưu máy/đã gửi/đang xử lý, lý do chưa chấp nhận |
| Kho | Nhập, soạn, cấp/nhận hàng xe, kiểm kê/cách ly | Tồn bán được/giữ A/quyền B/cách ly/giữ hộ; nguồn chênh lệch |
| Người giao/bán | Manifest A/B, giao, bán, thu, ghi nhận trả | Quyền còn, giá/terms, chứng từ cần thiết, trạng thái journal/ngoại lệ |
| Lái xe riêng | Phân công/lộ trình/bàn giao được cấp | Không tự thấy toàn bộ nợ hoặc được quyền thu/bán |
| Kế toán/thủ quỹ | Nợ, phân bổ/hoàn, nhận nộp, hóa đơn, kỳ | Ba sổ riêng, tiền pending/confirmed, source, phần chưa sync, deadline theo hồ sơ |
| Owner/quản lý | Chính sách, phê duyệt và báo cáo | Quyết định ảnh hưởng số dư, ngoại lệ có tuổi/người xử lý và dữ liệu thiếu |
| Vận hành SaaS | Migration/restore/hỗ trợ được cấp | Tenant đúng phạm vi, mục đích/thời hạn hỗ trợ, audit và điều kiện mở lại |

Một người có thể kiêm vai trò theo Q01/Q07, nhưng hành động vẫn ghi vai trò và định danh người thực hiện. Quyền tự duyệt hoặc hỗ trợ truy cập dữ liệu không được suy từ danh xưng Owner/Administrator; phải được định nghĩa trong policy.

Thông điệp PWA tối thiểu phân biệt: **đã lưu trên thiết bị**, **server đã nhận**, **chờ xử lý**, **đã ghi nhận nghiệp vụ**, **cần đối soát**. Người dùng thấy công việc/lý do và cách tiếp tục; các trường epoch/cursor/hash dành cho chẩn đoán, không là bước mà nhân viên phải tự hiểu để bán hàng.

## 8. Truy vết yêu cầu → quy tắc → ca nghiệm thu

`E2E-01–12` kế thừa R006/B005; `13–22` từ R007. Trạng thái chạy và phạm vi bằng chứng xem báo cáo R008; bảng dưới không tự xác nhận PASS sản phẩm.

| Yêu cầu | Quy tắc/nguồn đọc chính | Ca nghiệm thu tối thiểu |
|---|---|---|
| M01/M03, bên nợ/tenant | §3/5, Q01/Q02; contract cách ly | E2E-01, 12, 19 |
| M02/M05/M07, UoM/cấp/giao | §2 I02/I03/I05; nghiệp vụ R008 | E2E-02, 04, 05, 21 |
| M04/M07, A và terms | Snapshot terms/giá; giao từng phần | E2E-01, 06, 15 |
| M06/M10, B bán–thu | SaleDeliveryReceipt; credit confirmed/reserved | E2E-03, 07, 08, 16 |
| M08/M09/M20, trả/quà/giá vốn | F02/F03; nguồn và phần dư | E2E-05, 06, 13, 14, 21 |
| M10/M11/M12, nợ/thu hộ/tạm ứng | Ba sổ; đối chiếu trước/sau; hoàn có nguồn | E2E-03, 06, 16, 21 |
| M13, hóa đơn/vận chuyển | Seller/provider profile, INV-01–09 và bổ sung vận chuyển | E2E-11, 19, 20 |
| M14/M17, chu kỳ/cutover | Manifest, opening/external link, idempotent import/export | E2E-02, 10, 21; ca cutover trong phụ lục pilot |
| M15/M22, số liệu/giá trị | Mốc biết dữ liệu, KPI theo cohort, chi phí có mẫu số | E2E-10, 21; bài đo UX/pilot |
| M16, viếng thăm không đơn | Visit/Observation/ReturnRequest riêng | E2E-22 |
| M18/M21, quyền/restore/dữ liệu | F01, authority, legal request, restore runbook | E2E-12, 19 |
| M19, ACK/downsync | F04, durable inbox, snapshot activation | E2E-07, 08, 09, 10, 17, 18 |

Trước khi triển khai mỗi phần, chuyển hàng tương ứng thành acceptance test có dữ liệu cụ thể, kết quả tính được và phạm vi hỗ trợ. Các chương trình nghiên cứu R008 có thể làm đầu vào kiểm tra, nhưng phải đối chiếu ứng dụng độc lập và thử tích hợp thực tế.
