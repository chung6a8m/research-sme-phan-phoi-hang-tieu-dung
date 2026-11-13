# R009-AC — Acceptance Tests, Evidence Register và Go/No-Go Gates v1

- **Trạng thái toàn bộ AC đối với ứng dụng thật:** `NOT_RUN`. Các oracle R008 đã chạy mô hình thì ghi `MODEL_ONLY`; oracle số dư AC-03/20/21 mới viết là **EXPECTED_ORACLE, chưa chạy trên hệ thống thật**; không chuyển thành `PRODUCT_PASS` hoặc `PRODUCT_VERIFIED`.
- **Nguyên tắc:** Given/When/Then dưới đây định nghĩa **kết quả kỳ vọng**, không mô tả điều đã chạy. Mỗi kết quả phải được so trên tài liệu và các ledger ở từng bước, không chỉ tổng cuối.
- **Danh tính:** `AC-xx` = ca nghiệm thu; `EV-xx` = nhóm evidence cần thu; `B-CASE-xxx` = hồ sơ mở riêng, không tự điền PASS.
- Kế thừa expected result R008 [số liệu](../2026-11-12-08-khep-quy-tac-va-dac-ta-mvp/nghiep-vu-va-so-lieu.vi.md), [offline](../2026-11-12-08-khep-quy-tac-va-dac-ta-mvp/offline-va-phuc-hoi.vi.md), [hóa đơn](../2026-11-12-08-khep-quy-tac-va-dac-ta-mvp/hoa-don-va-du-lieu.vi.md) và [cutover](../2026-11-12-08-khep-quy-tac-va-dac-ta-mvp/pilot-va-ban-giao.vi.md).

## 1. Test cases với kết quả độc lập có thể kiểm tra

| AC | Given (đầu vào/tiền điều kiện) | When (hành vi/fault) | Then (kết quả bắt buộc) | Evidence |
|---|---|---|---|---|
| AC-01 — Tenant isolation | 2 tenant A/B, user A không có membership B; restore B từ snapshot cũ trước revoke | Query/read/write B bằng user A hoặc user B đã revoked | 403/denied, không trả row/file/lookup B; restore phải dùng authority hiện hành, không revive membership | EV-01, EV-09 |
| AC-02 — Customer 0 Outlet | C1 không Outlet, có ShipTo S1; sau giao đổi địa chỉ/quan hệ Outlet | Confirm Order A, giao từng phần; sửa master Customer/Outlet | C1 vẫn là debtor; delivery giữ S1 snapshot, price/terms tại mốc; không tạo Outlet giả | EV-02 |
| AC-03 — Chuyến A+B phân bổ | Kho 100 SKU X cost10/đv; giữ A40/B30, cấp xe70; price15/đv; grant B credit100; có kênh hóa đơn B hợp lệ trong fixture (không thay EV-10) | Thử B31 fail; B20 hợp lệ nhận cash200; A giao25 chưa thu; handover200; trả xe A15+B10; inject crash/retry giữa các effect | Oracle số chi tiết tại §1.1: sau load kho30/xe70/COGS0/AR0; sau B: xe50/COGS200/AR_B100/custody200/grant0; sau A: xe25/COGS450/AR_A375; cuối kho55, xe0, A reserved15, fund200, AR tổng475; không partial/duplicate | EV-03, EV-04, EV-06, EV-07, EV-08, EV-11 |
| AC-04 — Kho-01 toàn phạm vi | Wave1 chỉ 8 chuyến nhưng Kho-01 còn nhập/điều chỉnh/xuất khác; legacy có UI/API/job/offline client | Freeze rồi cutover, thử từng write path cũ và nghiệp vụ ngoài wave | Chỉ MVP ghi được biến động; off-wave phải có record trên MVP; một đường legacy độc lập còn ghi được = **P0 FAIL** | EV-04, EV-12 |
| AC-05 — UoM/lô/trả | SKU có thùng/lẻ, step, 2 lô khác expiry; đơn trả nguồn giao cũ | Giao FEFO, quy đổi, nhận giữ hộ, chấp nhận trả/QA | Tồn chính xác UoM chuẩn; lot/expiry snapshot; giữ hộ không tăng available/giảm AR; nhận trả vào quarantine, QA release riêng | EV-04, EV-05 |
| AC-06 — Giá vốn và kỳ | 2 đơn vị cost source 6.667, trả một phần; nguồn chỉnh 6.768 khi kỳ cũ đã khóa | Trả từng phần, ghi điều chỉnh nguồn và đối soát phương pháp kế toán kỳ | Hoàn 3.334 + điều chỉnh 50 + hoàn 3.384 = 6.768, không mutate kỳ cũ; DMS moving average và accounting period có bảng chênh có nguồn | EV-07 |
| AC-07 — Quà ròng/waiver | Fixture mua 20 nhận 2 quà, nhận trả 11 mua+2 quà, giao tiếp 11 mua; nhánh khác waiver 2 quà còn giữ | Recompute entitlement, nhận lại quà/waiver, retry | Nhánh nhận đủ quà: giao thêm 2; nhánh miễn thu hồi còn giữ: không giao thêm; waiver duyệt/nguồn; không double gift | EV-05 |
| AC-08 — Terms per delivery | A xác nhận N=7; giao 01/11 và 08/11; sau đó đổi master C thành N=14 | Tạo 2 AR open items; tạo order mới giao 08/11 | Due date lần lượt 08/11 và 15/11; nợ lịch sử không đổi; order mới có hạn 22/11 theo snapshot; timezone đúng | EV-06 |
| AC-09 — SaleDeliveryReceipt atomic/grant | Mỗi nhánh reset grant100, sale P100 và physical stock đủ; R/C được xác minh hoặc giữ riêng theo nguồn | R=100, R=60, bank pending, R=60+C=20; thu thừa120; hai command P80 cùng tranh grant100, crash/retry T2 | Cụ thể tại §1.2: `creditExposureConsumed=P-R_applied-customerCreditApplied`; R60/C0 → AR40/grant60/custody60, R100 → AR0/grant100, R60/C20 → AR20/grant80/credit giảm20; R120 chỉ phân100/credit mới20; 2×80 không thể đều commit, không double AR/hold | EV-06, EV-08 |
| AC-10 — Ba sổ/cash handover | Opening AR140.000/custody60.000 từ invoice200.000 và receipt60.000 đã apply; advance riêng | Thu/allocate mới20.000; handover offer50.000 rồi thủ quỹ accept; retry import/handover; kiểm advance riêng tại AC-20 | AR120.000, custody30.000, quỹ+50.000 **chỉ sau cashier acceptance**; trước accept custody80.000; advance không bù custody, receipt cũ không trừ AR lần nữa | EV-06, EV-12 |
| AC-11 — Durable ACK, dependency và duplicate | Client journal C phụ thuộc P, server nhận C trước, ngắt kết nối/crash, thử cùng ID với payload khác | Sync/restart/replay/missing dependency/cycle | `awaiting_dependency` có server durable owner; cùng ID/hash một effect; ID khác hash 409; không có lệnh bị cả client/server bỏ; cycle/deadline thành case | EV-08 |
| AC-12 — Grant/writer/offline event đã xảy ra | Trip T có 1 writer, grant hết hạn hoặc revoke; hàng/tiền đã trao offline, có bản giấy | Sync muộn, thay thiết bị hoặc second writer, restore/handshake | Từ chối intent chưa làm; giữ occurredEvent qua case bền và custody; không cấp writer mới không đối soát; event giấy có source ID không post trùng | EV-08, EV-09 |
| AC-13 — Restore authority và ngoại hiệu ứng | Đã revoke user, nhận yêu cầu hạn chế dữ liệu, invoice provider đã phát hành; restore TenantDB trước các sự kiện | Mở hệ, replay outbox/invoice/command | Tenant khóa tới authority/ledger/external lookup; không revive revoke, không mất privacy action, không phát hành invoice lại; generation mới không trùng | EV-09, EV-10 |
| AC-14 — Hóa đơn A/B và nhánh B no-channel | Có seller profile được duyệt, kênh online được thử; B tắt toàn bộ data/kênh văn phòng; test timeout sau gửi | A giao 60+40, B bán/thu, provider UNKNOWN, mất mạng trước/tại/sau giao | Hóa đơn gắn từng delivery; cấp xe/thu nợ không tạo hóa đơn mới; UNKNOWN tra same ref; B **không giao thật khi no-channel chưa có B-CASE/LEGAL-MEMO và INV-09**; nếu đã giao thật, giữ case, không backdate | EV-10 |
| AC-15 — Accounting outbox/reconciliation | 3 event với source ID/hash, accounting nhận lặp và 1 event được `POSTED` có số sai; webhook mất | Retry, lookup, import thủ công theo registry, đối soát cutoff | Một source effect không bị ghi hai lần; `RECEIVED` riêng `POSTED` riêng; posting lệch → `RECONCILED_DIFF`; sửa bằng correction ID mới, không “cân tổng” | EV-11 |
| AC-16 — Cutover/Forward Recovery | Kho-01 + xe, nợ/custody/advance, hóa đơn ngoài, lệnh chưa sync có manifest; batch opening có source ID | Preview, freeze, post, kích hoạt writer mới, legacy event tới muộn, phát sinh hiệu lực đầu tiên rồi thử rollback | Từng loại số dư khớp và ký; old writer bị khóa; lệnh cũ same source không phát lại; sau effect đầu tiên chỉ forward adjustment, không rollback sổ/ngoại hiệu ứng | EV-04, EV-12 |
| AC-17 — Visit without order | Sales được phân công Customer/Outlet, không có nhu cầu đặt | Ghi kết quả không đơn/lý do/quan sát/yêu cầu trả rồi sync | Visit completed có source và offline ACK; không sinh đơn 0đ, AR, stock movement; báo cáo visit có n/N | EV-13 |
| AC-18 — Wave 1 đầy đủ | Cả EV-01..EV-14 theo mode đạt, Kho-01 writer duy nhất, lịch/case owner/measurement plan | Vận hành 3 A + 3 B + 2 mixed chuyến/ngày trong ≥5 ngày đại diện, kể cả off-wave stock | Có chuyến/loại thực, số lần lỗi, open cases, chênh số dư, coverage, task time, support cost, SLA theo mẫu số; Owner ký Go/No-Go **riêng từng mode**, không dùng demo thay dữ liệu | EV-14, EV-15 |
| AC-19 — Pricing/discount/VAT/return oracle | `SYNTHETIC-UNAPPROVED-v1` (không đủ điều kiện phát hành thật); P thuế input8%, Q10%; giảm tổng10.001; cả giá chưa/gồm thuế, q_P=3 khi trả | Chạy Decimal, phân bổ residual, nhập thứ tự dòng khác nhau; trả P từng phần **sau khi đã thu đủ**, hoàn 20.000 có duyệt; so UI/ledger/outbox với provider/accounting mapping được xác nhận riêng | Exclusive: P net193.333/VAT15.467/gross208.800, Q net96.666/VAT9.667/gross106.333, tổng315.133. Inclusive: P net193.865/VAT15.509/gross209.374, Q net96.932/VAT9.693/gross106.625, tổng315.999. Trả P1/3: net64.444/VAT5.156/gross69.600; credit69.600 → refund thực20.000 → credit49.600; không mất phần dư/ghi đôi | EV-05, EV-06, EV-10, EV-11 |
| AC-20 — Advance partial settlement | Advance A1 phát500.000, sổ AR/custody khách đứng riêng | Duyệt chi300.000; offer hoàn200.000; thủ quỹ accept100.000 hai đợt, retry mỗi event; thử duyệt/hoàn vượt dư, sai actor/handover discrepancy | Outstanding A1: 500.000→200.000→200.000 (offer)→100.000→0; tổng duyệt+hoàn=500.000, âm bị chặn; không sửa AR/custody khách, thủ quỹ chưa ký không quyết toán, không mất event | EV-06 |
| AC-21 — Receipt partial allocation/customer credit | Customer AR 140.000 có 2 open items, receipt cash R1=60.000 được xác nhận, custody ban đầu0 | Phân bổ20.000 rồi15.000 vào hai open items, handover offer50.000/accept50.000, refund request phần dư và retry; hai allocation cạnh tranh | AR 140.000→120.000→105.000; credit từ R1 60.000→40.000→25.000; custody +60.000→+10.000 sau cashier accept, quỹ+50.000; pending bank không giảm AR/tạo credit; refund chỉ giảm credit khi actual disbursed và có approval | EV-06 |

### 1.1. AC-03 — Oracle độc lập cho chuyến hỗn hợp A+B (số giả lập)

Giả định không dùng để áp thuế/định giá thật: **một SKU X**, tồn và giá trị MAIN ban đầu **100 đơn vị × 10 = 1.000**; giá bán P=15/đơn vị, không discount/VAT trong fixture này; Customer A/B độc lập, B thu 200 đã xác nhận, 100 còn phải thu với grant offline ban đầu 100; kênh lập hóa đơn B đã được xác minh trong cấu hình thử, **không suy rằng EV-10 đã đạt ngoài đời**. A order 40, giữ 40; B quota 30; load 70 theo chứng từ chuyển kho. Giá vốn moving-average 10 tại cả MAIN/TRIP, không lấy 15 làm giá vốn.

| Mốc/event (sau commit) | MAIN qty/cost | TRIP A/B qty/cost | A hold / B quota còn | AR_A / AR_B | Custody / Quỹ | COGS lũy kế | Grant credit B còn |
|---|---:|---:|---:|---:|---:|---:|---:|
| T0 trước cấp | 100 / 1.000 | 0 / 0 | 40 (ở MAIN) / 30 (planned) | 0 / 0 | 0 / 0 | 0 | 100 |
| T1 chuyển 70 lên xe | 30 / 300 | 40+30 / 700 | 40 / 30 | 0 / 0 | 0 / 0 | 0 | 100 |
| T2 B thử bán 31, rejected | 30 / 300 | 40+30 / 700 | 40 / 30 | 0 / 0 | 0 / 0 | 0 | 100 |
| T3 B bán/giao 20, cash receipt 200 | 30 / 300 | 40+10 / 500 | 40 / 10 | 0 / 100 | 200 / 0 | 200 | 0 |
| T4 A giao 25, chưa thu | 30 / 300 | 15+10 / 250 | 15 / 10 | 375 / 100 | 200 / 0 | 450 | 0 |
| T5 thủ quỹ xác nhận nộp 200 | 30 / 300 | 15+10 / 250 | 15 / 10 | 375 / 100 | 0 / 200 | 450 | 0 |
| T6 xe về, unload A15+B10 | 55 / 550 | 0 / 0 | A15 tái giữ tại MAIN / B0 | 375 / 100 | 0 / 200 | 450 | 0 |

**Assertions:** mọi mốc `MAIN.qty+TRIP.qty+qtySoldOrDelivered=100`, giá trị `MAIN.cost+TRIP.cost+COGS=1.000`; A40 không được bán bằng quota B. T3 `15×20=300`, receipt200 nên `AR_B=100`, custody200, `creditExposureConsumed=100`, grant0. T4 `15×25=375` là AR_A, còn **15 đơn vị A chưa giao** phải giữ reservation có nguồn sau khi trả về MAIN; không tự coi order fulfilled. T6 stock55=15 A hold +40 available, 10 B còn dư trả lại free, không tạo sale/AR cho 25 hàng chưa bán. Tiền được thủ quỹ nhận tại T5 **không** trừ thêm AR_B. COGS A=250 và B=200 phải có source theo delivery/moving-average của TRIP, không đổi khi đặt/giữ hoặc load/unload.

**Fault/retry oracle (E2E-02/03/16/20/21):** sau T2/giữa T3, cắt T2 SQL trước commit ⇒ tất cả ledger vẫn như T2, không có bán B nửa chừng. Sau commit T3 nhưng trước ACK/receipt terminal, retry **cùng** `commandId, saleId, deliveryId, receiptId, allocationIds` ⇒ đúng T3 một lần; T4/T5/T6 không làm B bán lại, không nhả A hold sai. Hai command khác ID cùng tranh B quota30 (ví dụ mỗi command 20) ⇒ một thành công, command còn lại không được commit âm quota; grant/stock được khóa trong một transaction. Crash ở outbox/invoice adapter chỉ được retry **effect ID gốc**, không làm phát lại AR/cost/receipt hoặc lập hóa đơn mới bằng ID khác. Nếu giao vật lý đã xảy ra mà T3 bị từ chối vì grant hết hạn, lưu `recorded_exception` và đối soát, **không** được tuyên bố tồn/AR đã post hay pass ca trên. Các mốc phải chạy lại trên PWA/API/SQL/provider có `testRunId` trước khi đóng EV-03/04/06/07/08/11; bảng này **chỉ là EXPECTED_ORACLE, NOT_RUN trên sản phẩm**.

### 1.2. AC-09/19/20/21 — Oracle grant, Decimal, cash/advance

**Grant credit offline (AC-09, mỗi dòng bắt đầu grant100 và stock đủ; đơn vị tiền giả lập, không cộng các dòng như một chuyến):**

| Gross P | Receipt verified R_applied | CustomerCredit đã reserve C_applied | New AR = creditExposureConsumed | GrantRemaining sau T2 | Cash custody delta | CustomerCredit phát sinh |
|---:|---:|---:|---:|---:|---:|---:|
| 100 | 100 | 0 | 0 | 100 | +100 | 0 |
| 100 | 60 | 0 | 40 | 60 | +60 | 0 |
| 100 | 0 (bank pending) | 0 | 100 | 0 | 0 | 0 |
| 100 | 60 | 20 | 20 | 80 | +60 | 0 (credit reserve cũ giảm 20) |
| 100 | 100 từ cash120 | 0 | 0 | 100 | +120 | +20 |

Trong nhánh P80,R0,C0 với grant100, hai command khác ID tranh cùng budget: chỉ một `POSTED` (remaining20), command kia phải fail/case tùy intent/occurred, **không** remaining âm hoặc sinh 160 AR. Retry cùng ID/hash sau ACK mất giữ nguyên remaining20; không vừa báo reservation online100 **cộng** AR80. Grant chưa dùng không tự nhả sau nhánh thu100; chỉ `grantRelease` sau đối soát online và xác minh journal/custody.

**Pricing/discount/VAT (AC-19, R008-B §5 đã có oracle `MODEL_ONLY` bằng Decimal; toàn bộ ví dụ VND nguyên đồng, `ROUND_HALF_UP`, `invoice_eligible=false`):**

| Price mode | Dòng | Base trước giảm | Discount allocated | Net | VAT (input rate) | Gross sau giảm |
|---|---|---:|---:|---:|---:|---:|
| Chưa VAT | P | 200.000 | 6.667 | 193.333 | 15.467 (8%) | 208.800 |
| Chưa VAT | Q | 100.000 | 3.334 | 96.666 | 9.667 (10%) | 106.333 |
| **Chưa VAT — Tổng** | | 300.000 | **10.001** | **289.999** | **25.134** | **315.133** |
| Gồm VAT | P | 216.000 | 6.626 | 193.865 | 15.509 (8%) | 209.374 |
| Gồm VAT | Q | 110.000 | 3.375 | 96.932 | 9.693 (10%) | 106.625 |
| **Gồm VAT — Tổng** | | 326.000 | **10.001** | **290.797** | **25.202** | **315.999** |

Giảm toàn đơn D10.001 phân bổ theo **largest remainder**; sắp xếp dòng P/Q ngược nhau không đổi kết quả; tie-break là `stableLineId`, không phải thứ tự UI. Giá đã gồm thuế: trừ discount trên gross từng dòng **rồi tách net/VAT**, không nhân VAT lần hai. Giá chưa thuế: trừ discount trước khi tính VAT từng dòng. Input 8%/10% là *số thử*, không là mức thuế được phê duyệt cho SKU thực.

**Trả từng phần và hoàn tiền sau khi đã thu đủ (AC-19):** P có `q=3, N=193.333, VAT=15.467, gross=208.800`; trả 1 đơn vị cho ra net64.444 + VAT5.156 = gross69.600; trả các đơn vị tiếp: (64.445,5.155,69.600) và (64.444,5.156,69.600) nên phần nguồn cộng về **193.333/15.467/208.800**. Nếu toàn hóa đơn trước đó đã được trả đủ, khoản trả đã chấp nhận tạo CustomerCredit **69.600** (AR không âm), không tự chi tiền; refund 20.000 *chỉ sau approve+actual disburse* còn credit **49.600**, receipt gốc không bị xóa và không tăng AR. Trả/hoàn retry cùng ID không nhân đôi.

**Dữ liệu mapping bắt buộc trước nghiệm thu:** UI, DMS `AR/credit/return`, invoice intent/outbox và accounting event phải dùng `sourceLineId,priceMode,discountAllocation,net,vat,gross,returnOf,mappingVersion` và giữ đúng expected **từng dòng + tổng**. Provider/accounting sandbox phải trả/read-back đúng source/line/discount/net/VAT/gross/tài liệu điều chỉnh hoặc khai báo `BLOCKED` nếu profile/schema không thể biểu đạt; không giả định alias provider hoặc tự làm tròn khác để “khớp” tổng. **R008 model = MODEL_ONLY; AC-19/20/21 là đặc tả, không được gắn `PRODUCT_VERIFIED` khi chưa có run độc lập có build SHA, environment và evidence.**

**Settlement (AC-20/21):** advance issue500.000 → duyệt expense300.000 → offer return200.000 (chưa thay sổ) → thủ quỹ accept100.000 ×2 ⇒ outstanding `500.000,200.000,200.000,100.000,0`. Receipt R1 confirmed cash60.000 trên AR140.000: allocations20.000 +15.000 ⇒ AR `140.000→120.000→105.000`, CustomerCredit từ R1 `60.000→40.000→25.000`. Custody nhân viên +60.000; offer handover50.000 không giảm; thủ quỹ accept50.000 ⇒ custody10.000, quỹ+50.000. Event over-settlement (expense/return/alloc/refund vượt outstanding/credit), hai command tranh cùng balance, thiếu cashier signer và retry phải giữ không âm/không duplicate/case có nguồn.

### 1.3. AC → BR được assert trực tiếp (để lint và review theo hành vi)

| AC | Business Rules trực tiếp kiểm | Assertion cốt lõi cần có trong test |
|---|---|---|
| AC-01 | BR-01, BR-17 | Chặn cross-tenant và không hồi sinh quyền sau restore |
| AC-02 | BR-02, BR-03, BR-08 | Customer/ShipTo và snapshot sau đổi master |
| AC-03 | BR-03, BR-04, BR-07, BR-11, BR-12, BR-13 | A+B bán B hợp lệ, cost/AR/custody/grant và hàng dư theo từng bước |
| AC-04 | BR-05, BR-21 | Kho-01 writer độc quyền mọi nguồn ngoài wave |
| AC-05 | BR-06, BR-20 | UoM/lot và hàng trả cách ly có nguồn |
| AC-06 | BR-07, BR-20 | Hoàn chi phí lũy kế và kỳ khóa |
| AC-07 | BR-09 | Quà ròng, waiver và idempotency |
| AC-08 | BR-10 | Due-date per delivery từ terms snapshot |
| AC-09 | BR-11, BR-12, BR-13, BR-15, BR-16 | Debit grant T2 và retry/competing quota |
| AC-10 | BR-13, BR-14 | Handover thủ quỹ, ba sổ, không giảm AR lần hai |
| AC-11 | BR-16 | ACK bền/custody/dependency và chống trùng |
| AC-12 | BR-15, BR-16 | Writer/grant hết hạn và event đã xảy ra |
| AC-13 | BR-17, BR-18 | Restore authority và external effect |
| AC-14 | BR-18 | Hóa đơn A/B, không backdate hoặc phát lại unknown |
| AC-15 | BR-19 | Outbox/POSTED/reconciliation khác nhau |
| AC-16 | BR-21 | Cutover đủ opening và forward-only |
| AC-17 | BR-22 | Visit không đơn, không ghi sale giả |
| AC-18 | BR-05, BR-23, BR-24 | Wave coverage và source freshness/gate |
| AC-19 | BR-08, BR-14, BR-20 | Decimal discount/VAT từng dòng, return/credit/refund và adapter mapping |
| AC-20 | BR-13 | Advance partial, cashier acknowledgement, outstanding không âm |
| AC-21 | BR-13, BR-14 | Receipt multi allocation, customer credit và custody độc lập |

### 1.4. Negative/boundary tests tối thiểu kèm mỗi AC

- Cùng source ID khác hash; callback/command duplicate; response mất sau commit; restart giữa outbox và ACK; hai writer tranh quyền; restore DB trước external effect.
- Dòng giao thiếu/mã UoM sai, lô hạn thấp, trả nhiều lần/vượt nguồn, tiền đang pending, thu thừa/hoàn rồi chi lại, chênh giá vốn sau kỳ khóa.
- Giao lúc cuối ngày, đổi timezone/cấu hình policy, thay terms giữa đơn và giao, thiết bị sai giờ, chuyến kéo dài nhiều ngày, thiếu manifest giấy.
- Quyền bị revoke khi máy offline, support grant hết hạn, test tenant cross-reference/file/object, xóa/hạn chế dữ liệu trước restore.
- Nếu test không thể dựng với bản sản phẩm, ghi `BLOCKED` + dependency/owner, không đánh dấu `PASS` bằng script đơn lẻ.

## 2. Evidence Register (điền sau khi chạy thực)

| EV | Cần thu và người xác nhận cuối | Trạng thái tại 13/11/2026 |
|---|---|---|
| EV-01 | Tenant isolation, membership revocation, admin/support access và audit; security/Owner | `EVIDENCE_PENDING` |
| EV-02 | Dữ liệu Customer/Outlet/ShipTo NPP có quyền dùng, mapping và snapshot trước/sau; sales/data owner | `EVIDENCE_PENDING` |
| EV-03 | Một chuyến mixed gồm manifest, A40/B30, B20 hợp lệ, A25, return25; đối soát warehouse/trip/hold/quota/AR/custody/cost **từng bước** và fault/retry; kho/sales | `EVIDENCE_PENDING` |
| EV-04 | Tồn Kho-01 toàn phạm vi, test old UI/API/import/jobs/offline blocked, UoM/lot/quarantine; kho/IT | `EVIDENCE_PENDING` |
| EV-05 | Pricing/discount/VAT inclusive/exclusive, largest remainder, quà/waiver, partial return và refund; so line & total trên engine; sales/kế toán | `MODEL_ONLY` (R008), real pending |
| EV-06 | Ledger AR/custody/advance, receipt multi-allocation/credit, grant credit, terms, thủ quỹ accept và partial advance/refund; từng bước; kế toán/thủ quỹ | `MODEL_ONLY` (R008), real pending |
| EV-07 | Giá vốn vận hành vs kỳ chính thức, chi phí muộn, returns and adjustments; kế toán giá vốn | `MODEL_ONLY` (R008), real pending |
| EV-08 | PWA IndexedDB, online/offline, crash/retry, durable inbox/receipt, concurrency; QA/backend | `MODEL_ONLY` (R008), real pending |
| EV-09 | Restore/revoke/privacy/GenerationAnchor/RecoveryJournal/external registry drill; security/ops | `MODEL_ONLY` (R008), real pending |
| EV-10 | Seller/provider/legal memo, phiếu cấp xe, INV-01–09, B-CASE-001/002/003, no-channel; kế toán/provider/legal | **`EVIDENCE_PENDING` — P0 cho B fully offline** |
| EV-11 | Accounting import/API, webhook/lookup/manual register; so net/VAT/gross/discount/return theo source line + mappingVersion, POSTED và reconciliation signed; kế toán/IT | `EVIDENCE_PENDING` |
| EV-12 | Cutover manifest/multi-party sign, opening balances, legacy lock, first event, Forward Recovery; Owner/kho/kế toán | `EVIDENCE_PENDING` — P0 |
| EV-13 | Visit no-order, 8 bài task UX, thiết bị/mạng thực, người dùng/personal data scope; sales/QA | `EVIDENCE_PENDING` |
| EV-14 | Wave 1 readiness checklist, staff/role, thiết bị, runbooks, SLO thresholds, case owners, hỗ trợ; Owner/ops | `EVIDENCE_PENDING` |
| EV-15 | Nhật ký ≥5 ngày: 3A+3B+2 mixed/ngày nếu mode được mở, tất cả biến động Kho-01, n/N, chi phí/incident/defects/case closures và Owner decision | `EVIDENCE_PENDING` |

**Hồ sơ B-CASE và LEGAL-MEMO:**

| Hồ sơ | Tình trạng | Không được làm |
|---|---|---|
| `B-CASE-001`, `B-CASE-002`, `B-CASE-003` | `EVIDENCE_PENDING` | Không điền kết quả thử giả, không tuyên bố provider hỗ trợ offline. |
| `LEGAL-MEMO` về seller/profile/kênh/ngoại lệ áp dụng | `EVIDENCE_PENDING` | Không tự dùng R008 nghiên cứu chung như xác nhận áp dụng cho NPP thực. |
| `INV-09` thử mạng và mốc lập hóa đơn trên điều kiện thật | `NOT_RUN` | Không mở nhánh B no-channel, không backdate giao dịch đã xảy ra. |

## 3. Mẫu record kết quả bắt buộc cho từng lần test

`testRunId`, `acId`, `evId`, `commitSha`, `buildVersion`, `environment` (`LOCAL|PROTECTED_CI|INTEGRATION|PILOT`), `tenant/sellerProfileVersion`, `device/os/browser`, `provider/accountingAdapterVersion`, `schemaVersion`, `fixtureHash`, `faultInjection`, `startedAt/endedAt`, `expected`, `actual`, `ledgerDiffBeforeAfter`, `documentIds`, `decision`, `reviewer`, `evidenceUri`, `masking/retention`, `blockers`.

**Status dùng thống nhất:** `NOT_RUN`, `MODEL_ONLY`, `LOCAL_VERIFIED`, `INTEGRATION_VERIFIED`, `PROTECTED_CI_VERIFIED`, `PILOT_VERIFIED`, `BLOCKED`, `FAILED`, `OWNER_ACCEPTED_EXCEPTION`. Các trạng thái `OWNER_ACCEPTED_EXCEPTION` không tự biến điều kiện pháp luật/P0 không được miễn thành `PASS`.

## 4. Quy tắc Go/No-Go v1

- **Go để đặc tả/implement/test:** được tiến hành từ baseline này với các phần `OWNER_DECIDED`, giữ technical contract ở `DESIGN_CANDIDATE` cho tới review.
- **No-Go giao dịch thật liên quan nếu bất kỳ P0 còn mở:** B full-offline nếu EV-10 chưa đủ; kho nếu EV-04/EV-12 chưa đủ; offline nếu EV-08/09 chưa đủ; A+B nếu EV-03/06/12 chưa chứng minh tính toàn vẹn.
- **Mode-specific:** A, B có kênh hóa đơn hợp lệ, B không kênh, mixed được đánh giá riêng. Không bắt mọi phát triển dừng vì một mode bị No-Go, nhưng không hạ gate bằng cách đặt tên khác.
- **Pilot readiness != pilot success:** trước Wave 1 cần EV-14 + cổng P0 theo phạm vi; hoàn thành pilot còn cần EV-15 với ≥5 ngày đo thực. Nếu lịch pilot thực không đạt đủ chuyến đại diện, ghi phạm vi thiếu thay vì suy ra kết quả.
- Quyết định cuối có `decisionId, scope, evidenceRefs, openRisks, exceptionApprover, acceptedAt` của người có quyền. Không có hồ sơ → `NO_GO/PENDING`, không tự gắn sign-off.
