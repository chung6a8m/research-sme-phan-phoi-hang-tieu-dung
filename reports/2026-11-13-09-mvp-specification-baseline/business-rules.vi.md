# R009-BR — Business Rules MVP NPP-01

Mỗi quy tắc áp dụng theo [sổ quyết định](decision-register-and-adr.vi.md), có contract ở [R009-G](glossary-and-data-contracts.vi.md), state/interface ở [R009-API](api-and-state-machines.vi.md) và [AC](acceptance-tests-and-evidence.vi.md). Các quy tắc chính sách đã được Owner chọn; khi nêu thuật toán/chuỗi API cụ thể thì đó vẫn là **ứng viên triển khai có kiểm thử bắt buộc**, không phải sản phẩm đã PASS.

| ID | Quy tắc và bất biến cần bảo vệ | Vi phạm phải xử lý |
|---|---|---|
| BR-01 | Một tenant là một business seller và database riêng; đối chiếu membership/assignment theo tenant trước đọc/ghi; Subscriber billing không cấp dữ liệu tự động. | Chặn truy cập/mở case, audit cross-tenant; không “lọc UI” thay isolation. |
| BR-02 | Customer (bên chịu nợ) tách Outlet tùy chọn và ShipTo snapshot; chuyển/đổi Outlet không đổi bên nợ lịch sử. | Nháp thiếu customer/shipTo hợp lệ không post. |
| BR-03 | A order xác nhận không tự tạo doanh thu/AR/thu; mỗi delivery đã thực giao/được chấp nhận phát sinh effect của phần giao, phần còn lại giữ/hủy có nguồn. | Không gán hoàn tất chỉ vì tạo đơn; giao nhiều lần không vượt nguồn. |
| BR-04 | Trip A+B dùng AReservation và BQuota riêng trên cùng nguồn hàng; A đã giữ không bán B, không đếm trùng stock. Cấp kho→xe là transfer, không là sale. | Thiếu hàng/grant/chứng từ vận chuyển: chặn release, không tạo AR giả. |
| BR-05 | Sau cutover mọi biến động Kho-01, kể cả ngoài Wave 1, có **duy nhất writer MVP** và chứng từ nguồn; writer cũ phải bị khóa ở DB/API/UI/import/batch/offline. | Chặn go-live đến khi chứng minh tất cả đường ghi không song song. |
| BR-06 | UoM quy đổi/step snapshot, lot/expiry và FEFO theo SKU; hàng trả đã nhận phải vào cách ly, không về available trước QA/duyệt. | Mismatch định lượng/lot/FEFO cần case, không sửa bằng số không nguồn. |
| BR-07 | Sổ vận hành moving average SKU×StockLocation; giá vốn xuất và phần hoàn tính theo giá trị/phiên bản nguồn; điều chỉnh kỳ mới không viết lại kỳ đã khóa. Kế toán bình quân kỳ đối chiếu riêng. | Không ép chênh kế toán bằng correction trống nguồn. |
| BR-08 | Giá/chiết khấu/tax profile/rounding/uom và terms được snapshot khi nhận nghiệp vụ theo policy; không tái tính chứng từ đã post từ bảng giá mới. | Rule ngoài scope cần duyệt, cấm sửa âm thầm net/gross/thuế. |
| BR-09 | Quà giao thêm: `entitlement=floor(netQualifiedPurchases / threshold)` theo chương trình; `giftHeld=giftDelivered-giftAcceptedBack`; `giftToDeliver=max(0,entitlement-giftHeld)`. Quà miễn thu hồi khách vẫn giữ, **không tăng entitlement**. | Waiver có source, scope, amount và duyệt; trả lại quà đã waiver cập nhật giftHeld/waivedHeld cùng lượng; không cấp quà hai lần. |
| BR-10 | Hạn nợ từng delivery = ngày giao hợp lệ tại đơn vị bán + N ngày từ snapshot terms của A order lúc confirm; thay terms Customer sau đó không đổi nợ cũ. Amendment nguồn riêng cho phần chưa giao. | Không gộp mọi delivery cùng một hạn mặc định. |
| BR-11 | B sale/giao/thu **cùng một compound command** `SaleDeliveryReceipt` với saleId, deliveryId, receiptId và allocationIds riêng; transaction tất cả hoặc không có effect. | Nếu đã trao hàng/tiền nhưng không post, lưu `recorded_exception` có trách nhiệm; không bỏ sự thật. |
| BR-12 | Trong compound, `R_applied=min(P,verifiedReceiptAllocatedToThisSale)`, `C_applied=min(P-R_applied,reservedCustomerCreditAppliedToThisSale)`, `newReceivable=creditExposureConsumed=P-R_applied-C_applied`, `grantCreditRemaining'=grantCreditRemaining-creditExposureConsumed` trong **cùng T2** với AR, customer-credit allocation và hàng. Tách rõ `creditExposureConsumed` (quyền bán chịu) với `customerCreditApplied` (có dư khách đã reserve). `grantInitial=grantRemaining+ΣcreditExposureConsumed` trong thời gian quyền còn giữ; không vừa giữ toàn reservation online vừa cộng AR mới lần nữa. | Bất kỳ tổng âm/vượt grant, credit không reserve, bank chưa xác minh, tranh cùng quota hoặc retry không được ghi partial/double consume; thu nợ cũ không tự nạp quyền offline hoặc giải phóng reservation trước đối soát. |
| BR-13 | Ba ledger độc lập: AR Customer, custody tiền nhân viên, advance nhân viên. Receipt đã xác nhận có thể **phân bổ từng phần** cho nhiều open items; phần chưa phân bổ thành CustomerCredit có nguồn, không AR âm. Handover chỉ đổi custody→quỹ sau **thủ quỹ chấp nhận** và không trừ AR lần nữa. Advance giữ `outstanding=Σissued-ΣapprovedExpenses-ΣcashierAcceptedReturns≥0`; nhiều lần duyệt chi/hoàn là event riêng, không tự bù custody/AR. | Mỗi event có ID/source và idempotency; chi chờ duyệt, hoàn chưa thủ quỹ xác nhận, tiền báo chuyển khoản pending không đổi sổ; quá quyết toán/thiếu tiền mở case. |
| BR-14 | Dư Customer từ receipt confirmed chưa phân bổ là CustomerCredit theo `creditSourceId`; `confirmedAmount=ΣallocationsToAR+availableCustomerCredit+ΣapprovedAndDisbursedRefunds` (sau correction có source). Dùng credit để trả nợ khác tạo allocationId, giảm credit và AR đúng một lần; hoàn có phê duyệt + thực chi, không giảm credit khi mới request. | Credit không âm, không allocate/refund vượt dư; retry và receipt pending không nhân đôi credit/custody/AR. |
| BR-15 | Offline chỉ trong grant còn hiệu lực và một writer/trip; quản lý quantity/credit reservation chung; thay thiết bị/generation đòi reconciliation trước cấp quyền mới. | Sự kiện đã xảy ra ngoài quyền xử lý qua recovery exception; không biến intent chưa làm thành post. |
| BR-16 | Client giữ journal cho tới receipt chấp nhận bền. Server ACK `acceptedDurably=true` chỉ sau khi giữ payload bền và nhận custody. Retry cùng ID/hash trả receipt cũ; ID giống khác hash trả conflict. | `awaiting_dependency` do server sở hữu và có worker/deadline; không được mất trong RAM. |
| BR-17 | Restore không phục hồi quyền revoked, privacy request hoặc tác động ngoài. Generation không tái sử dụng; external invoice có identity/hash cố định qua rollback và phải lookup trước retry. | Authority không sẵn có: khóa tenant/writer cho tới đối chiếu. |
| BR-18 | Hóa đơn gắn transfer/delivery, tách preparation/creation/signing/tax submission/buyer delivery; cấp xe hoặc thu nợ cũ không tạo invoice bán mới. UNKNOWN không được phát mới bằng ID mới. | B offline không có kênh lập hợp lệ: trước giao giữ `WAITING_INVOICE_CHANNEL`; đã thực giao ghi event/case và báo kế toán, không backdate. |
| BR-19 | Accounting outbox có event+hash bền, retry cùng khóa; tách `RECEIVED` / `POSTED` / `RECONCILED_OK\|DIFF`. Chỉ khép đối soát khi đầy đủ chứng từ, cutoff, số dòng/lượng/tiền/AR/cost và xử lý diff. | ACK/webhook thất lạc phải lookup hoặc import register; không tạo bút toán từ batch ID mới. |
| BR-20 | Trả: `request/held` không giảm nợ; chấp nhận thương mại và thực nhận mới tính lượng/tiền/cost hoàn theo lũy kế giá trị nguồn; hàng cách ly. | Không xác minh được delivery source: giữ hộ & case, không nhập hàng sẵn bán. |
| BR-21 | Cutover gồm freeze, kiểm kê, manifest thiết bị, import preview, ký đối soát đa bên và mở writer mới. Sau tác động nghiệp vụ đầu tiên, **Forward Recovery** bằng chứng từ có nguồn; không rollback sổ đã phát sinh. | Legacy receipt đến muộn phải so source/hash với opening, không post lần hai. |
| BR-22 | Visit có thể hoàn thành không đơn: kết quả/lý do/quan sát/return request riêng; không tạo sale 0 đồng, delivery hoặc stock movement. | Không ép nhân viên lập đơn giả để đóng viếng thăm. |
| BR-23 | Không bao giờ suy dữ liệu chưa đồng bộ là “0 đã xác nhận”; báo cáo gắn `asOf`, pending trip, exception và phạm vi nguồn. | Chặn báo cáo realtime không đủ freshness evidence. |
| BR-24 | Pilot Wave 1 có 3A+3B+2 mixed/ngày trong ≥5 ngày **chỉ sau khi gate theo nhánh đạt**; scope dữ liệu Kho-01 là toàn kho, không phải 8 chuyến. | Có bất kỳ P0 chặn nào thì NO-GO phạm vi liên quan; không tự mở rộng. |

## 2. Tiền, quà và hoàn nguồn: ví dụ AC chuẩn

### BR-09 — Giao, trả, giao và waiver

Fixture **giả lập** R008-F02: mua 20 nhận 2 quà; trả được chấp nhận và thực nhận 11 mua + 2 quà; sau đó giao tiếp 11 mua. Khi mua ròng = 20, quà đang giữ = 0, cần giao thêm 2. Nếu 2 quà được miễn thu hồi và khách vẫn giữ, `giftHeld=2`, không giao thêm khi quyền mua ròng trở lại 20. Chỉ mở waiver khi role có duyệt, `waiverId` và nguồn quà được liên kết. Các con số 10/1 chỉ là fixture của chương trình mẫu, không áp dụng tự động mọi khuyến mại.

### BR-07/20 — Hoàn tiền/giá vốn không mất phần dư

Giá trị nguồn 6.667 cho 2 đơn vị; trả 1 lần đầu hoàn 3.334, lần hai 3.333. Nếu sau trả một phần nguồn sửa thành 6.768, điều chỉnh phần đã hoàn +50 và hoàn phần còn lại 3.384; tổng giá trị hoàn 6.768 (theo R008-B). Trong sản phẩm cần test đồng thời/khóa nguồn và posting adjustment kỳ; mô hình tính chưa chứng minh transaction SQL.

### BR-10 — Terms từ lần giao

A xác nhận 7 ngày: giao 01/11/2026 và 08/11/2026 có hạn 08/11 và 15/11. Thay mặc định Customer thành 14 ngày không hồi tố đơn đã xác nhận; đơn mới giao 08/11 có hạn 22/11. Ngày lấy theo timezone được chính sách NPP xác nhận, không đơn giản cộng 168 giờ qua mọi DST/timezone.

### BR-11/12/13 — Một bán và thu

P=100: nhận tiền mặt xác nhận R=100 → AR mới 0, custody tăng 100. R=60 → AR 40, custody tăng 60. Khách báo chuyển khoản chưa xác minh → R=0, AR 100, custody 0. Cùng event không được ghi AR hai lần khi lập hóa đơn hoặc gửi kế toán. Tất cả giá trị là fixture đơn vị tiền giả lập.

### BR-12/15 — Grant/reservation là một ledger, không được cộng hai lần

- `P` = gross được chấp nhận; `R_applied` = verified receipt thực phân bổ vào **chính sale**; `customerCreditApplied=C_applied` = CustomerCredit **đã server giữ riêng** cho grant và được phân bổ vào chính sale; `creditExposureConsumed=P-R_applied-C_applied`. Nếu khách nộp nhiều hơn P, phần dư đi vào CustomerCredit có nguồn, không cho `R_applied>P` hay âm AR. `R_applied+C_applied≤P`.
- Ledger quyền của mỗi `(tenant,trip,customer,grant)`: `grantCreditInitial=grantCreditRemaining+ΣcreditExposureConsumed` từ thời điểm cấp đến trước release có chứng từ; `0≤grantCreditRemaining≤grantCreditInitial`. Mỗi `creditExposureConsumed` gắn saleId/commandId, một lần. CustomerCredit đã reserve có `creditSourceId` và số dư riêng, giảm đúng `C_applied`. **Không** gọi cả hai là `creditConsumed`.
- Ngân sách tín dụng được reserve ở server từ pool chung **trước** chuyến: khi bán chịu 40, phần held cho grant chuyển 40 thành receivable thực, còn 60 ở grant nếu cấp 100. Hệ thống không được tính `held=100` và *cộng thêm* `newAR=40` vào exposure hạn mức. Ví dụ R008-T §5.2: P=100, R=60, C=0 ⇒ AR mới 40, `creditExposureConsumed=40`, grant còn 60; R=100 ⇒ tiêu 0, grant vẫn giữ 100 **cho tới online reconcile/release**, không tự giải phóng.
- **Transaction T2:** lock/version-check remaining grant, CustomerCredit reservation, hàng B quota/AR source và command dedup; kiểm budget sau mọi command, rồi đồng thời ghi toàn sale/delivery/receipt/allocations, ledgers, quyền, outbox, audit. Hai command khác ID tranh cùng budget: chỉ một được chấp nhận nếu tổng vượt, command còn lại không có hiệu ứng một phần. Retry cùng ID/hash nhận đúng receipt/values cũ, không trừ grant lần hai. Khi intent chưa thực hiện bị từ chối thì không tiêu; nếu thực tế đã giao/thu ngoài grant, giữ occurredEvent/case để đối soát chứ không bịa `AR=0`.
- **Release:** khi đóng chuyến đã đối soát toàn bộ writer/devices/events mới có event `grantRelease` online cho số dư chưa tiêu. Thu nợ cũ, thu đủ tiền tại quầy và hàng trả về xe chưa phải sự kiện release quyền tự động.

### BR-13/14 — Sổ thu, dư khách và tạm ứng nhiều lần

- Receipt `confirmed` có `confirmedAmount` và nhiều `ReceiptAllocation` khác ID; tổng phân bổ không vượt số xác nhận. Phần còn lại là CustomerCredit khả dụng từ cùng nguồn, chỉ được dùng bằng allocation/refund riêng. `pendingBankEvidence` không là receipt confirmed. Cash custody tăng theo tiền mặt **nhận thực**, không phụ thuộc lượng đã phân bổ AR; bank settlement không được ghi thành tiền nhân viên giữ.
- Handover `offered` chưa giảm custody; `cashierAccepted` chuyển đúng giá trị đã xác nhận sang quỹ một lần. Handover discrepancy mở case, không tự chấp nhận số nhân viên khai hoặc giảm AR.
- Advance là sổ khác: `advanceOutstanding=issuedTotal-approvedExpenseTotal-cashierAcceptedAdvanceReturns`; duyệt chi và hoàn tiền có thể xen kẽ, mỗi lần có source/version/approval độc lập. Trả về 200.000 có thể là hai lần 100.000; trước thủ quỹ ký nhận thì vẫn outstanding, không tạo receipt khách và không giảm custody thu hộ.
- Fixture và negative/retry/over-settlement tương ứng xem [AC-09/10/20/21](acceptance-tests-and-evidence.vi.md).

## 3. Kỳ khóa và sửa sai

- Không mutate nguồn/giá trị của `posted` khi đã có descendant hoặc kỳ khóa; dùng `adjustmentOf/reversalOf`, nguồn quyết định, actor/approval và kỳ có quyền.
- Khi phí mua biết muộn, chia theo nguồn tồn và các nguồn đã xuất hợp lệ; nếu khác phương pháp giá vốn kế toán, xuất reconciliation rõ delta.
- Khi đồng bộ trễ, ưu tiên bảo toàn event gốc và cách phân loại ý định/sự kiện thực; hiệu ứng kế toán cần phân kỳ bằng decision/approval, không chỉ đổi ngày thiết bị.

## 4. Phân định quy tắc được chọn với thiết kế còn mở

BR-01–BR-24 là mục tiêu kiểm soát nghiệp vụ. Cấu trúc table, distributed locking, chuẩn serial hóa hash, câu lệnh HTTP, worker, preflight provider, timezone profile cụ thể, thuế suất và thresholds triển khai **chưa được nghiệm thu**. Không dùng ngôn ngữ “đã triển khai” khi mới có R008 model.
