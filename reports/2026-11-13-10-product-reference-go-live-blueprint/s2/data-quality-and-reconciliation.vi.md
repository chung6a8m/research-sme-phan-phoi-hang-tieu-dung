# R010-S2 — Kiểm soát chất lượng dữ liệu, số dư và preview reconciliation

**Phạm vi:** specification + model validation cho P03/P04. Nguồn [R009 Data Contracts](../../2026-11-13-09-mvp-specification-baseline/glossary-and-data-contracts.vi.md), [R009 BR](../../2026-11-13-09-mvp-specification-baseline/business-rules.vi.md), [R009 AC](../../2026-11-13-09-mvp-specification-baseline/acceptance-tests-and-evidence.vi.md), và [S2 dictionary](data-dictionary.json).

## 1. Ma trận điều kiện kiểm

| Gate | Quy tắc / mức kiểm hiện có | Lỗi điển hình | Bằng chứng Go-Live còn thiếu |
|---|---|---|---|
| DQ-01 | Schema headers, required, enum, money exact, date | HEADER_MISMATCH, REQUIRED, NUMERIC, DATE, ENUM | Schema ứng dụng thật |
| DQ-02 | Source ID/hash/tenant/batch | REQUIRED_META, SOURCE_HASH, SOURCE_ID_CONFLICT | Chứng từ nguồn thật, canonicalization contract |
| DQ-03 | Customer/Outlet ownership | FK_ORPHAN, TENANT_ORPHAN | Mapping NPP đã chấp nhận, ShipTo snapshot |
| DQ-04 | SKU/UoM/lot/FEFO | UOM_CONVERSION, STOCK_BALANCE | Kiểm SKU/lô/hạn & giấy tờ kho |
| DQ-05 | Số dư tồn chi tiết | Không âm; quantity/value theo source + location/status | Kiểm kê kho–xe/quarantine có chữ ký |
| DQ-06 | AR theo từng delivery/open item | openAmount≤originalGross, dueDate≥deliveryDate | Nợ và lịch sử thu đã đối chiếu |
| DQ-07 | CustomerCredit | Không tự bù AR âm; gắn receipt verified/creditSource | Bank/cash receipt nguồn thật |
| DQ-08 | Cash custody | Cashier acceptance độc lập, không trừ AR lần hai | Ký tiền giao/nhận và quỹ |
| DQ-09 | Advance | issued−approvedExpenses−cashierAcceptedReturns=outstanding≥0 | Ký tạm ứng/hoàn ứng/chi duyệt |
| DQ-10 | AReservation/BQuota | Không chồng nguồn; load xe chỉ transfer | Test mixed, stock invariant theo chuyến |
| DQ-11 | One-writer-trip | Một installation/grant nguồn/trip; no unknown B mode | PWA/SQL/thiết bị grant E2E |
| DQ-12 | Customer approval/credit grants | Không âm; bank pending không paid; không double reserve | Finance approval, concurrency AC-09 |
| DQ-13 | B no-channel gate | \`B_NO_CHANNEL\` chưa được mở trong dataset | LEGAL-MEMO/B-CASE/INV-09/EV-10 |
| DQ-14 | Accounting adapter | Mock-only ghi \`EVIDENCE_PENDING\`; RECEIVED≠POSTED≠RECONCILED | Adapter provider thật + cutoff reconciliation |
| DQ-15 | Legacy effects/cutover | Source external/dangling device UNKNOWN phải ghi case | Legacy writer lock **toàn kho**, EV-12 |
| DQ-16 | Restore/revoke/privacy | Không khôi phục quyền/bút toán/hóa đơn từ DB snapshot | Actual restore drill, external registry, EV-09 |
| DQ-17 | Chống trùng | Duplicate same ID/hash không post mới; khác hash conflict | API/SQL idempotency & fault injection |
| DQ-18 | Số liệu/báo cáo \`asOf\` | Không coi pending offline là 0 đã xác nhận | Observability n/N và đo SLA/pilot |
| DQ-19 | Bảo vệ dữ liệu | Dữ liệu fake không có MST, địa chỉ người thật; file thật riêng môi trường | Permission/retention/legal thực |
| DQ-20 | Phê duyệt | Dry-run chỉ kiểm kỹ thuật; \`canPost=false\` kể cả dữ liệu đúng | Owner/Kho/Kế toán/Thủ quỹ/IT approvals |

## 2. Công thức cần cân trước cutover

- Stock by SKU×location×lot×status: \`openingQty + received + transferredIn + acceptedReturns - delivered - transferredOut - writeOff = closingQty\`; không suy các chuyến offline pending là lượng 0.
- Giá trị: \`openingValue + inboundCost + eligibleCostAdj - postedCOGS - transferredValueOut + transferredValueIn = closingValue\` trên cùng phạm vi nguồn. Moving average DMS theo location; khác kế toán bình quân kỳ là *delta phải đối soát*, không ép bằng.
- A/B: \`load = heldForA + quotaForB\` theo manifest trên xe, không đếm trùng nguồn; A chưa giao sau trả xe vẫn held nếu chưa cancel nguồn.
- AR: mỗi open item \`originalGross - verifiedAllocations - acceptedCreditsOrReturns + sourceCorrections = openAmount\` theo nghĩa vụ và kỳ; không dùng tổng AR để hợp thức source line thiếu.
- Receipt/credit: \`confirmedReceipt = sum(actualAllocations) + availableCredit + actualRefunds\` theo đúng receipt source (trừ correction có version).
- Custody: \`cashActuallyCollected - cashierAcceptedHandovers - approvedActualPayouts/Corrections = custodyOutstanding\`; handover offered không thay sổ.
- Advance: \`issuedTotal - approvedExpenses - cashierAcceptedReturns = outstanding >= 0\`; phần offered chưa giảm.
- Accounting: mỗi event ID+hash có \`RECEIVED/POSTED/RECONCILED_OK|DIFF\` độc lập; không kết luận \`POSTED\` = đã đối soát.

**Giới hạn hiện tại:** công cụ S2 kiểm một số bất biến ở mức opening/template/fixture; chưa thực hiện transaction SQL xuyên event, accounting integration hoặc source-cost correction thật.

## 3. Quy trình xử lý lỗi không tự sửa

\`CSV upload → parse/column check → required/type/FK/source hash → balance preview → discrepancy list with owner → multi-party approvals → import code with transaction/idempotency → read-back reconciliation\`.

Lỗi hoặc unknown phải có \`sourceSystem,sourceRecordId,tenantCode,importBatchId,errorCode,expected,actual,actor,reviewer,fixReference\`. Không tự sửa số, bỏ dòng, gán 0 hoặc tự tạo mã khách/điểm bán khi không có nguồn. Sau business effect đầu tiên chỉ forward adjustment.

## 4. Bộ negative model đã thử trong quá trình soạn S2

| Case | Sai số đưa vào | Kỳ vọng mô hình |
|---|---|---|
| N-01 | Sửa customerLabel sau hash | SOURCE_HASH |
| N-02 | Outlet trỏ customer không tồn tại | FK_ORPHAN |
| N-03 | Advance outstanding không khớp | ADVANCE_BALANCE |
| N-04 | T14 tự ghi VERIFIED | GO_LIVE_CLAIM_UNVERIFIED (error; canPost=false) |
| N-05 | Quy đổi denominator bằng 0 | UOM_CONVERSION |
| N-06 | CSV có dấu phẩy/quote | Parse đúng không tách lệch cột |
| N-07 | Thiếu sourceHash/metadata | REQUIRED_META, không được bỏ qua |
| N-08 | Record tenant không có T01 nguồn | TENANT_ORPHAN |

Những phép thử này chỉ chạy trên **generator/validator logic**, không phải fault injection SQL, PWA, provider, browser. Gói F2 tạo **input** cho fault-injection thực ở S3/S6, chưa tự chạy 100% các loại lỗi trong hệ thống.

## Bổ sung sau review PR #2 — kiểm tra khóa và quyền theo chuyến

Kiểm tra định danh import phân biệt \`recordType=Txx\` để tránh xung đột giả giữa Customer/SKU cùng mã nguồn. Đối với tồn đầu kỳ, đối chiếu theo **document header + sourceLineId**, không khóa một document chỉ một line. T14 dùng \`caseId\` để ghi các gate/AC/EV cùng mode; không ghi trạng thái Go-Live bằng phép nhập CSV.

Kiểm tra \`Trip\` theo đúng ma trận:
- \`A\`: có AReservation, không có BQuota.
- \`B_ONLINE\`: có BQuota, không có AReservation.
- \`MIXED\`: có cả hai, vẫn tách riêng nguồn.
- \`B_NO_CHANNEL\`: vẫn chặn, không hợp thức hóa bằng metadata.

Cùng installation có thể dùng nhiều chuyến tuần tự; hai installation **trong một chuyến** bị chặn, grantId không được tái sử dụng ở chuyến khác. Xe máy nhân viên giao và lái là cùng người; xe tải có thể phân vai. Các ràng buộc này là structural checks; tính độc quyền trong SQL/PWA và phân quyền theo thời điểm thuộc S3/S6.

Đã có [26 ca regression](s2-regression-tests.mjs) gồm mã nguồn đa loại, source/line, multi-evidence, A/B/MIXED, writer reuse/concurrency giả lập, driver, thiếu metadata, FK, balance, CSV quoted/formula. Không coi chúng là fault injection hoặc E2E trên hệ thống thật.
