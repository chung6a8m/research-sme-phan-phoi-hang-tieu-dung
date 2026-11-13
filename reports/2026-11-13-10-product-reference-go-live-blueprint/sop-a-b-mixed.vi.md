# R010-S1-P01b — SOP chuẩn cho 12 tình huống vận hành MVP

**Trạng thái:** `S1_DOCUMENTED_REVIEW_PENDING` — **quy trình đề xuất** trên nền [R009-BR](../2026-11-13-09-mvp-specification-baseline/business-rules.vi.md), không phải bằng chứng tác vụ sản phẩm đã chạy.

**Cách đọc:** mỗi SOP gồm kích hoạt (trigger), vai trò thực hiện/kiểm soát, thứ tự **hành vi nghiệp vụ** (không áp đặt UI hay endpoint đã triển khai), điểm commit, các bất biến và ca lỗi. Các tên field/API nếu xuất hiện chỉ là logical contract ở [R009-API/SM](../2026-11-13-09-mvp-specification-baseline/api-and-state-machines.vi.md). Phân quyền chi tiết: [Role Matrix](role-and-approval-matrix.vi.md); trạng thái chính sách: [Policy Catalog](product-policy-catalog.vi.md).

## SOP-01 — Tạo tenant, danh mục và phân công nhiệm vụ

- **Trigger:** tenant mới/demo sandbox hoặc chuẩn bị vận hành trước ca; **Responsible:** Tenant admin; **Accountable:** Tenant owner; **Validate:** Ops/QA + kế toán cho seller profile.
- **Đầu vào:** tenant code, seller profile có trạng thái, roles/assignments, Customer, Outlet tùy chọn, kho/xe, SKU/UoM/lot, chính sách giá/tín dụng và thiết bị.
- **Các bước:** (1) tạo tenant với database riêng, thiết lập cấu hình version; (2) xác minh authority và membership hiện hành trước bất kỳ dữ liệu tenant; (3) đăng ký SKU/UoM, stock location, nhân sự/xe; (4) tạo Customer là bên chịu nợ, 0..n Outlet, địa chỉ ShipTo từ Customer/Outlet hoặc nhập độc lập vào chứng từ; (5) cấu hình roles/grant và kiểm xung đột quyền; (6) chạy preflight với report lỗi FK/duplicate/thiếu seller/tuân thủ; (7) chỉ mở mode đạt gate và log snapshot.
- **Kết quả:** cấu hình có `profileVersion/effectiveAt/approver`, data nguồn hợp lệ, chưa phát sinh công nợ/kho vì tạo master.
- **Ngoại lệ/NO-GO:** không có seller đủ hồ sơ, thiếu quyền, profile đổi sau khi đã post → giữ trạng thái blocked/draft; không hồi tố lịch sử khi đổi Outlet hay giá. **Trace:** D-01/02, BR-01/02/08/17; DC-01/02/03/17; API-01/02; AC-01/02, EV-01/02.

## SOP-02 — Module A: đơn đặt trước và giao từng phần

- **Trigger:** Sales nhận yêu cầu đặt trước; **Responsible:** Sales và Warehouse/Delivery operator; **Accountable:** Sales supervisor; **Verify:** Accountant cho AR.
- **Các bước:** (1) tạo A Order ở DRAFT với Customer bắt buộc, ShipToSnapshot, SKU/UoM, price/tax/terms `policyVersion`; (2) kiểm hạn nợ/hạn mức và tồn khả dụng, không ghi AR khi mới đặt; (3) Confirm, giữ AReservation theo line/lot/location, snapshot terms N ngày; (4) lập manifest/chuyến và transfer kho→xe theo A hold, không tạo sale/COGS; (5) nhận chứng từ giao một phần thực tế `deliveryId/sourceLineId`, lượng không vượt phần còn lại; (6) post hiệu ứng hàng/giá vốn/AR theo *phần đã giao* và tạo invoice intent phù hợp; (7) lặp các lần giao tới hết hoặc close remainder có nguồn; (8) thu/đối soát theo SOP-07/10.
- **Kết quả:** `remainingQty` và A hold riêng, mỗi delivery có AR open item/dueDate tính theo local business date + N snapshot; thay terms master không đổi order đã Confirm.
- **Ngoại lệ:** Customer không có Outlet vẫn hợp lệ; stock thiếu giữ pending/replan chứ không âm; giao ngoài quyền thành occurredEvent/case; unfulfilled không gán fulfilled. **Trace:** D-02/03/06, BR-02/03/04/08/10/18; DC-04/05/09/14; API-02/03/07; SM-01; AC-02/03/08/14, EV-02/03/06/10.

## SOP-03 — Module B: bán theo xe có kênh hóa đơn hợp lệ

- **Trigger:** trip B đã được cấp hàng/quota và seller/provider channel đã qua preflight; **Responsible:** Delivery/sales trip writer; **Accountable:** Trip supervisor; **Verify:** Warehouse/Cashier/Accountant.
- **Các bước:** (1) prepare BQuota và load xe trên stock transfer (không ghi doanh thu); (2) cấp một writer/trip và quyền theo stock/credit grant có thời hạn; (3) tại Customer/ShipTo xác định hàng thực giao, giá/discount snapshot, receipt được xác minh cash hoặc bank; (4) tạo **một compound business command** SaleDeliveryReceipt với saleId, deliveryId, receiptId, allocation IDs riêng; (5) trong transaction kiểm BQuota, credit grant và credit nguồn đã reserve rồi commit *cùng lúc* stock/COGS/AR/receipt/custody/outbox; (6) phát invoice intent từ delivery, thực thi theo kênh đã được chứng minh; (7) đồng bộ và đối soát trước close/unload.
- **Kết quả:** `newAR = P - R_applied - C_applied`, grant giảm bằng creditExposureConsumed, cash custody tăng bằng **toàn bộ cash thực nhận**; hóa đơn và kế toán có state riêng.
- **Ngoại lệ:** B no-channel và chưa có LEGAL-MEMO/B-CASE/INV-09 → `WAITING_INVOICE_CHANNEL`, **không giao thật**; nếu hàng/tiền đã trao ngoài quy trình thì ghi occurredEvent/case, không backdate; ngân hàng chưa xác minh không coi paid; sai quota/grant hay duplicate giữ đúng hiệu ứng một lần. **Trace:** D-03/06/07/08, BR-04/11/12/13/15/16/18; DC-04/06/09/13/14; API-03/04/07; SM-02/03/06; AC-03/09/11/12/14, EV-03/06/08/10.

## SOP-04 — Mixed trip A+B: phân bổ và đóng một chuyến hỗn hợp

- **Trigger:** warehouse chuẩn bị cùng xe có A đã reserve và nhu cầu B quota; **Responsible:** Warehouse manager/Trip writer; **Accountable:** Tenant operations owner.
- **Các bước:** (1) khóa phiên xuất kho, xác định AReservation theo order và BQuota theo SKU/lot; (2) phân bổ lượng *không chồng nhau* trên nguồn stock; (3) load xe bằng transfer chứng từ, hai pool A/B giữ ledger độc lập; (4) giao A theo source order/delivery; B sale+delivery+receipt theo SOP-03, **không bán A hold bằng quota B**; (5) khi xe về phân loại A còn giữ, B còn dư, trả/quarantine, custody, grant và journal chưa sync; (6) thu hồi grant/release hold còn dư chỉ sau đối soát; (7) close `CLOSED` hoặc `CLOSED_WITH_OPEN_CASES` có owner, không xóa pending.
- **Kết quả:** bảo toàn tổng `MAIN + TRIP + sold/delivered` và nguồn cost, AR/custody/advance; A chưa giao vẫn là held với source; B dư trở về available sau kiểm đủ.
- **Ngoại lệ:** hai command tranh quota, mất ACK, thiếu thiết bị, provider UNKNOWN hoặc cash chênh → kho/ledger không “tự cân” bằng adjustment vô nguồn; blocked mode không được lén mở trong mixed. **Trace:** D-03/11/15, BR-03/04/05/11/12/23/24; DC-03/04/06/16; API-03/04/09; SM-02/03; AC-03/04/09/18; EV-03/04/06/14/15.

## SOP-05 — Kho, nhập/xuất ngoài wave và giá vốn

- **Trigger:** nhập nhà cung cấp, cấp xe, chuyển kho, kiểm kê/điều chỉnh hoặc hàng ngoài pilot; **Responsible:** Warehouse; **Accountable:** Warehouse manager; **Verify:** Cost accountant cho kỳ/chênh.
- **Các bước:** (1) định danh `sourceDocumentId/lineId`, SKU, baseUoM/conversion snapshot, location, lot/expiry/status; (2) kiểm FEFO cho hàng yêu cầu lô/hạn; (3) post stock movement theo source/transaction; (4) với transfer MAIN→TRIP, chuyển lượng/giá trị mà **không** ghi bán, COGS hoặc AR; (5) với sale/delivery post giá vốn moving average theo SKU×location và source version; (6) với return áp lũy kế giá trị nguồn, giữ hàng trong quarantine; (7) đối chiếu cùng kế toán giá vốn bình quân kỳ, đưa delta/cost muộn thành adjustment có kỳ và quyền; (8) ghi mọi biến động **toàn kho**, kể cả off-wave.
- **Kết quả:** không âm/nhân đôi stock, giá vốn không âm thầm đổi khi kỳ khóa; các dòng có costBasisSnapshot/adjustment link.
- **Ngoại lệ:** legacy UI/API/job/import/thiết bị offline vẫn ghi được sau cutover = **P0 NO-GO**; lot hết hạn hoặc conversion sai → quarantine/case; chi phí muộn không viết lại kỳ khóa. **Trace:** D-04/10/11, BR-04/05/06/07/20/21; DC-03/07/12/16; API-03/05/09; AC-04/05/06/16, EV-04/07/12.

## SOP-06 — Pricing, quà khuyến mại và hàng trả

- **Trigger:** lập/giao bán với bảng giá, nhận trả hàng hoặc quà; **Responsible:** Sales/Returns clerk; **Accountable:** Pricing/Returns approver.
- **Các bước:** (1) chọn rule có thời hạn, phạm vi Customer group/SKU, price mode inclusive/exclusive và version; snapshot khi chốt theo chính sách; (2) áp discount thuộc tập hữu hạn, dùng Decimal và phân bổ phần dư ổn định theo sourceLineId, không phụ thuộc thứ tự UI; (3) tính quà `floor(netQualifiedPurchases / threshold)`, đối chiếu `giftHeld=delivered-acceptedBack`; (4) nếu hoàn trả, tạo ReturnRequest/HELD với delivery source; không giảm AR hoặc cộng available khi mới giữ; (5) sau nhận/duyệt thương mại post ReturnAcceptance giá trị/lượng lũy kế, vào quarantine; QA quyết định release hoặc dispose riêng; (6) waiver quà miễn thu hồi cần nguồn/role/approval; (7) hoàn credit/refund theo SOP-07 nếu đã thu đủ.
- **Kết quả:** sum net/VAT/gross từng line khớp tổng, không double gift/return/refund, cost trả đúng nguồn, posted snapshot không tính lại từ master mới.
- **Ngoại lệ:** thiếu delivery source, return vượt lượng nguồn, price rule xung đột/ngoài scope, tax chưa verified hoặc waiver không duyệt → blocked/case; hóa đơn điều chỉnh phụ thuộc profile pháp lý và provider. **Trace:** D-04/05, BR-06/07/08/09/14/20; DC-07/08/12; API-05/06/07; SM-04/05/06; AC-05/06/07/19; EV-05/06/07/10/11.

## SOP-07 — Thu khách, phân bổ nợ, tiền dư và hoàn trả

- **Trigger:** nhận tiền mặt hoặc có bằng chứng ngân hàng cần xác minh; **Responsible:** Collector/AR clerk; **Accountable:** Finance/Accountant; **Verify:** Cashier ở bước nhận tiền thực khi có handover.
- **Các bước:** (1) tạo receipt `PENDING` với nguồn và paymentMethod; (2) xác nhận `CONFIRMED` **chỉ** khi tiền mặt đã thực nhận hoặc ngân hàng verified; (3) nếu cash, tăng custody theo *confirmedAmount*, không theo số phân bổ; (4) phân bổ một receipt thành nhiều `allocationId` cho open AR items, mỗi lần có source/idempotency và khóa số dư; (5) phần chưa phân bổ là CustomerCredit theo `creditSourceId`, không tạo AR âm; (6) credit application cho khoản nợ khác giữ reservation/atomic allocation; (7) hoàn dư phải `requested → approved → disbursed`, chỉ actual disbursement mới giảm credit; (8) theo dõi AR còn mở/due theo delivery và event source.
- **Kết quả:** `confirmedAmount = allocations + availableCredit + actuallyRefunded` theo cùng nguồn (trừ correction hợp lệ), credit/AR không âm; tiền đang pending không giảm AR/custody.
- **Ngoại lệ:** ảnh chuyển khoản chưa verified, hai allocation tranh cùng khoản, refund vượt available, retry cùng source ID → giữ pending/reject trước hành vi hoặc case khi đã chi thực, không double-post. **Trace:** D-06/12, BR-10/12/13/14; DC-09/10; API-06; SM-05; AC-08/09/10/21, EV-06.

## SOP-08 — Nộp quỹ, tạm ứng/hoàn ứng và đối chiếu cuối ngày

- **Trigger:** trip về, người giữ tiền báo nộp hoặc hoàn advance; **Responsible:** Collector/Employee và Cashier; **Accountable:** Cashier manager/Finance.
- **Các bước:** (1) tính custody từ receipt cash confirmed; (2) lập CashHandover `OFFERED` với số, người giao/nhận, nguồn; **không đổi custody** khi mới offer; (3) thủ quỹ kiểm đếm, ký `CASHIER_ACCEPTED` theo phần **đã nhận**, chuyển custody→fund một lần; thiếu tiền lập discrepancy case; (4) với advance, tạo `ISSUED` có nguồn; approved expense giảm outstanding; ReturnOffer chưa giảm, CashierAcceptAdvanceReturn mới giảm, có thể nhiều đợt; (5) đối chiếu theo nhân viên/nguồn từng sổ AR, custody, advance, quỹ và posting kế toán; (6) cuối ngày duyệt pending/reconciled_diff/case owner, không tự kết sổ dữ liệu chưa sync.
- **Kết quả:** `advanceOutstanding = issued - approvedExpenses - cashierAcceptedReturns >= 0`; nộp quỹ **không trừ AR lần hai**, advance không được tự bù custody.
- **Ngoại lệ:** thiếu chữ ký cashier, chênh actual, over-settle, nhân viên tự accept, retry → không ghi quỹ/advance sai; mở case nguồn. **Trace:** D-06/12, BR-13/14/23; DC-09/10/11; API-06/12; SM-05; AC-10/20/21, EV-06/14.

## SOP-09 — PWA offline: writer, grant, durable ACK và phục hồi lệnh

- **Trigger:** cấp chuyến hoặc mất kết nối trước/trong nghiệp vụ được phép offline; **Responsible:** Trip writer + Sync service; **Accountable:** Ops/Security.
- **Các bước:** (1) preflight tenant authority/assignment/one writer/grant có TTL, quyền hàng/quota và credit budget được server reserve; (2) PWA giữ journal bền gồm commandId, payloadHash, document/source IDs, local sequence/dependsOn, actor/installation/epoch, occurredAtClaim; (3) khi sync, server nhận vào DurableInbox và trả `acceptedDurably=true` chỉ sau khi đã nhận trách nhiệm lưu bền; (4) client giữ payload/journal cho tới receipt bền, theo dõi receipt revisions/terminal; (5) server xử lý dependency, idempotency và lỗi cạnh tranh, không từ chối sự kiện **đã thực xảy ra** như ý định chưa làm; (6) khi mất máy/revoke/restore, làm recovery handshake/đối chiếu source/authority/external effect trước cấp grant khác.
- **Kết quả:** cùng ID/hash chỉ một effect; same ID khác hash conflict; `acceptedDurably` khác `POSTED` khác `businessResolved`; quyền hết hạn không hồi sinh qua restore.
- **Ngoại lệ:** intent chưa thực hiện bị reject khi grant invalid; hàng/tiền thực đã trao thì ghi `recorded_exception` có case; không tiếp tục B no-channel thật nếu chưa có kênh hóa đơn được chứng minh. **Trace:** D-07/09/14, BR-11/12/15/16/17/18; DC-13/17; API-04/10/11; SM-03/09; AC-09/11/12/13, EV-08/09/10.

## SOP-10 — Hóa đơn và đồng bộ kế toán

- **Trigger:** delivery/sale hay return/điều chỉnh hợp lệ đã phát sinh; **Responsible:** Invoice service/Accounting operator; **Accountable:** Finance/Legal seller.
- **Các bước:** (1) sinh InvoiceIntent từ delivery/sự kiện chuyển quyền hàng hóa thực tế theo hồ sơ pháp lý phù hợp, không từ cấp xe hay thu nợ cũ; (2) preflight seller, tax/SKU, thời điểm pháp lý, provider/kênh và reference/hash; (3) gửi cùng effect ID, nếu timeout/UNKNOWN phải lookup trước retry, không phát hóa đơn mới bằng ID khác; (4) lưu facts riêng: prepared/created/signed/submitted/delivered theo provider và nghĩa vụ áp dụng; (5) đẩy event nguồn vào Durable AccountingOutbox; (6) phân biệt `RECEIVED` → `POSTED` → `RECONCILED_OK|DIFF` theo source line/cutoff; (7) sửa sai bằng correction/reversal link, không ghi đè invoice/ledger gốc.
- **Kết quả:** invoice/adapter không nhân đôi, khi POSTED chênh còn RECONCILED_DIFF, có owner; version mapping provider/accounting đầy đủ.
- **Ngoại lệ:** thiếu LEGAL-MEMO/B-CASE cho B no-channel, provider UNKNOWN, reconciliation mismatch, partner webhook/lookup thiếu → mode/case blocked theo EV, không báo compliance PASSED bằng mock. **Trace:** D-08/13, BR-18/19; DC-14/15; API-07/08; SM-06/07; AC-14/15/19, EV-10/11.

## SOP-11 — Opening, cutover và forward recovery

- **Trigger:** tenant chuyển từ hệ thống cũ hoặc cần khôi phục sau sự cố; **Responsible:** Warehouse/Accounting/IT ops; **Accountable:** Tenant owner; **Signatories:** kho, thủ quỹ, kế toán, IT theo phạm vi.
- **Các bước:** (1) lập manifest theo stock MAIN/TRIP/lot/quarantine, A hold/B quota, AR từng open item, CustomerCredit, custody/advance, hóa đơn ngoài, đơn/chuyến dở và device journal/epoch; (2) inventory mọi legacy writer ở UI/API/DB/job/import/offline **toàn kho**; (3) freeze, kiểm kê/snapshot với cutoff có timezone và owner; (4) import preview theo source/hash, báo chênh, lấy phê duyệt đa bên; (5) post opening không replay sale/receipt lịch sử, khóa writer cũ toàn bộ; (6) enable writer mới sau gate; (7) sau business effect đầu tiên chỉ forward correction/adjustment có source; (8) khi restore, quarantine, đối chiếu authority revocation/privacy/external registry/journal rồi mới reopen.
- **Kết quả:** chỉ một source of truth, số dư được ký; external effect không tự nhân đôi khi restore; case chưa sync được nhận diện, không coi là 0.
- **Ngoại lệ:** một đường legacy ghi được, thiết bị mất liên lạc không có reconciliation, khoản số dư chưa duyệt, ảnh hưởng hóa đơn ngoài chưa lookup → P0 NO-GO; không rollback tenant DB để xóa hiệu ứng thật. **Trace:** D-09/10/11/14, BR-05/16/17/21/23; DC-16/17; API-09/11; SM-08/09; AC-04/13/16, EV-04/09/12.

## SOP-12 — Viếng thăm, quan sát vận hành và admission mode/pilot

- **Trigger:** nhân viên đến Customer/Outlet hoặc hết ca cần báo cáo, xem xét mở mode; **Responsible:** Sales/Trip supervisor/Ops; **Accountable:** Tenant owner.
- **Các bước:** (1) ghi visit theo assignment với Customer và Outlet nếu có; (2) chọn kết quả có đơn/không đơn/không viếng thăm, reason/observation/return request riêng; không tạo sale 0 đồng; (3) sync với journal và receipt khi offline hợp lệ; (4) báo cáo stock/AR/visit/trip với `asOf`, n/N completeness và pending journal; (5) đối chiếu hoạt động ngoài wave, invoice UNKNOWN và case owner; (6) chuẩn bị checklist preflight EV-01..EV-14, ngưỡng Owner duyệt; (7) quyết định mở A, B online, B no-channel, mixed **riêng** sau evidence; ghi pilot run n/N theo profile NPP, không coi profile 8 chuyến/ngày là chuẩn mọi tenant.
- **Kết quả:** visit không đơn hợp lệ; dashboard rõ pending/unknown; chỉ mode qua gate mới được mở giao dịch thật.
- **Ngoại lệ:** chưa đủ n/N hoặc chưa đạt gate P0 → `NO_GO/PENDING` theo mode; không suy EV-15 hoặc sản phẩm PASS chỉ từ tài liệu. **Trace:** D-15, BR-22/23/24; DC-18; API-12; SM-10; AC-17/18, EV-13/14/15.

## Bàn giao giữa SOP và hậu quả sai

| Bàn giao | Nguyên tắc soát trước khi nhận | Vi phạm phải làm |
|---|---|---|
| Warehouse → trip writer | Manifest, quota/hold, lot/expiry, grant, thiết bị và người ký | Không release chuyến, mở case |
| Trip writer → Warehouse | Hàng dư/return/quarantine, journal pending và đối chiếu source | Không tự nhả hold/quota từ số chưa sync |
| Collector → Cashier | CashHandover offered cùng receipt nguồn và actual counting | Không giảm custody hoặc tăng quỹ khi chưa accept |
| Sales/Returns → Accounting | Invoice/cost/return/credit có document/sourceLineId và policyVersion | Không post lại theo batch ID mới |
| DMS → provider/accounting | External ref/hash bất biến, lookup/reconcile state riêng | UNKNOWN hoặc DIFF có người nhận, không auto PASS |
| Ops → Owner Go/No-Go | Evidence có `testRunId`, build, actor, cutoff, n/N và open cases | Giữ NO-GO cho phạm vi thiếu chứng cứ |

**Tài liệu này hoàn thành phần thiết kế SOP S1, không tự xác nhận 12 SOP đã được thử với người dùng.** Trong S3/S6 cần biến từng bước thành acceptance scenarios và evidence thật theo [R009-AC](../2026-11-13-09-mvp-specification-baseline/acceptance-tests-and-evidence.vi.md).

## Addendum Owner 13/11/2026 — phạm vi MVP và các gate kiểm chứng

- SOP-02/07: PADR-02 đặt credit policy mặc định UNSET/fail-closed; khác APPROVED=0 có Finance approval; snapshot terms cho A Confirm chỉ từ policy hợp lệ.
- SOP-03/04: B trong MVP là B_ONLINE; MIXED A+B_ONLINE, AReservation/BQuota tách; B dùng kênh hóa đơn thay thế khi PWA mất mạng DEFERRED, B_NO_CHANNEL BLOCKED. Không biến dữ liệu PWA offline thành hóa đơn hợp lệ.
- SOP-05/11: EVQ-03 G-STOCK/G-CUT P0 toàn Kho-01, legacy writers UI/API/import/job/offline bị khóa, opening ký và Forward Recovery diễn tập thực trước production.
- SOP-06/07/08/10: EVQ-06 yêu cầu data/ledger source-level, giá/thuế/rounding snapshot, CustomerCredit, Custody/Advance độc lập; kế toán API/FILE/MANUAL_REGISTER có evidence tương đương và đối soát, POSTED chưa phải RECONCILED.
- SOP-09: OFFLINE_WRITE mặc định DISABLED; một writer/trip, per-device/mode E2E, revoke/restore/recovery; B alternative-channel deferred. Đã thực giao nhưng lỗi quyền phải giữ occurredEvent/case, không tự post.
- SOP-12: EVQ-07 phải có 8 bài UX, asOf, n/N, support/incident/case data; SLO/threshold định lượng do Owner/Finance/Ops ký trước EV-14, EV-15 là kết quả Pilot thật.

[Owner Decision Register](owner-decisions-and-evidence-gates.vi.md) / [EVQ Acceptance Gates](evq-acceptance-gates.vi.md) là phần bổ sung theo version; SOP trước đây là ứng viên thiết kế, không phải hệ thống đã qua test.
