# R010-S1-P02a — Product Policy Catalog v0.1: chuẩn cứng, default, profile và feature gates

- **Trạng thái Owner Policy:** đã có 9 PADR và 7 EVQ được Owner lựa chọn ngày 13/11/2026; [Decision Register](owner-decisions-and-evidence-gates.vi.md). R009 D-01–15 tiếp tục là `OWNER_DECIDED` ở phạm vi đã được ghi nhận; bảng dưới **không thay** nội dung gốc, chỉ biến từng BR thành contract sản phẩm gắn SOP, cấu hình và test.
- **Nguồn:** [R009 BR-01–24](../2026-11-13-09-mvp-specification-baseline/business-rules.vi.md), [Decision Register](../2026-11-13-09-mvp-specification-baseline/decision-register-and-adr.vi.md), [R009-TR](../2026-11-13-09-mvp-specification-baseline/traceability.vi.md). [SOP](sop-a-b-mixed.vi.md), [tenant profile](tenant-profile-schema.vi.md), [Product ADR](product-adrs.vi.md).
- **Thuật ngữ:** `L0` = bất biến sản phẩm không override; `L1` = default/cấu hình **bị giới hạn**; `L2` = yêu cầu khác chuẩn đi qua ADR/exception. `PRODUCT_DEFAULT_PROPOSED` không phải policy đã được duyệt.

## 1. 24 policy tương ứng 24 Business Rules của R009

| ID | R009 | Lớp | Điều sản phẩm phải bảo vệ và default/đề xuất | Quyền cấu hình, lỗi phải xử lý |
|---|---|---|---|---|
| POL-01 | BR-01 | L0 | Một legal seller/tenant và DB riêng; authorize tenant từ authority hiện hành | Không gộp tenant/pháp nhân; cross-tenant/revoked deny+audit |
| POL-02 | BR-02 | L0 | Customer là bên chịu nợ, 0..n Outlet; ShipTo snapshot chứng từ | Tenant chọn nguồn địa chỉ giao; không ép tạo Outlet hoặc viết lại lịch sử |
| POL-03 | BR-03 | L0 | A Confirm chỉ giữ hàng/terms; AR/doanh thu từ delivery đã xảy ra | L1 cho phép giao phần còn lại nhiều đợt; không tạo AR tại Confirm |
| POL-04 | BR-04 | L0 | Một chuyến có AReservation và BQuota tách, load/unload là transfer | L1 chọn mode theo chuyến; B không được ăn A hold, không tạo COGS khi load |
| POL-05 | BR-05 | L0 | Sau cutover **MVP độc quyền mọi biến động kho**, gồm ngoài wave | Không có chế độ 2 writer; legacy ghi được => P0 NO-GO |
| POL-06 | BR-06 | L0+L1 | Base UoM/conversion snapshot, lô/hạn FEFO theo profile, hàng trả cách ly | L1 bật lot/expiry theo SKU có ràng buộc; sai/không rõ lot => case, không âm thầm sửa |
| POL-07 | BR-07 | L0 | Moving-average vận hành SKU×StockLocation; source-cost returns/corrections, kỳ khóa | Không chuyển FIFO cost theo lô; phương pháp kế toán kỳ là kênh đối soát riêng |
| POL-08 | BR-08 | L0+L1 | Price/tax/rounding/UoM/terms snapshot theo policyVersion ở mốc hiệu lực | L1 price lists hữu hạn; không tái tính chứng từ posted theo master mới |
| POL-09 | BR-09 | L0+L1 | Quà theo mua ròng, giftHeld/delivered/returned/waived; waiver có phê duyệt | L1 threshold/program hữu hạn; không cho quà hai lần hoặc tự miễn |
| POL-10 | BR-10 | L0+L1 | Hạn nợ theo **từng delivery**, local businessDate + N từ terms snapshot tại A Confirm | L1 N/limit theo Customer/profile đã duyệt; không hồi tố terms |
| POL-11 | BR-11 | L0 | B SaleDeliveryReceipt compound, sale/delivery/receipt/alloc IDs khác nhau, commit atomic | Không tách partial ledger trong cùng command; occurredEvent lỗi lưu case |
| POL-12 | BR-12 | L0+L1 | B grant riêng; exposureConsumed=P−verifiedReceiptApplied−reservedCustomerCreditApplied, debit cùng T2 | L1 grant cap/TTL chỉ sau approval và proof; pending bank không giảm AR, hai writer tranh không âm |
| POL-13 | BR-13 | L0 | Ba ledger AR, employee custody, advance; ReceiptAllocation partial, handover/advance return cần cashier accept | Không tự bù chéo sổ; offer chưa đổi số; over-settlement deny/case |
| POL-14 | BR-14 | L0 | Credit dư theo receiptSource, allocate/refund có event riêng, chỉ refund disbursed mới giảm credit | Không âm credit/AR, không trả dư khi mới approve |
| POL-15 | BR-15 | L0+L1 | Một writer/trip, grant offline hữu hạn, change device/generation cần reconcile | L1 TTL/cap có bound kỹ thuật; không cấp lại grant trước reconciliation |
| POL-16 | BR-16 | L0 | Client journal đến receipt bền, durable inbox+dependency, same ID/hash idempotent | Không ACK khi chỉ có RAM, không bỏ event do mất HTTP ACK |
| POL-17 | BR-17 | L0 | Restore kiểm authority/privacy/epoch/external effects hiện hành; không hồi sinh revoke | Không tự unquarantine nếu thiếu registry, không tái phát hóa đơn |
| POL-18 | BR-18 | L0+L1 | Invoice intent từ delivery/chuyển quyền có nguồn; UNKNOWN lookup cùng ref | L1 chỉ bật mode/kênh đã được verify; B no-channel mặc định BLOCKED |
| POL-19 | BR-19 | L0+L1 | Accounting durable outbox, RECEIVED khác POSTED khác RECONCILED_OK/DIFF | L1 API/file adapter sau test; không suy ACK là đã cân kế toán |
| POL-20 | BR-20 | L0 | Return held/request chưa giảm AR hoặc tăng available; accept+received mới post, hàng cách ly | QA release riêng; return thiếu delivery source giữ case |
| POL-21 | BR-21 | L0 | Freeze→manifest→preview→đa bên approve→new writer toàn kho; after first effect forward correction | Không restore DB để rollback nghiệp vụ thật, không replay phiếu lịch sử |
| POL-22 | BR-22 | L0 | Visit completed no-order hợp lệ, có outcome/reason/observation | L1 lý do viếng thăm; không tạo sale 0đ/AR hoặc fake order |
| POL-23 | BR-23 | L0 | Báo cáo có asOf/pending/scope/n/N/source completeness | Không hiển thị unknown = zero confirmed hay báo real-time giả |
| POL-24 | BR-24 | L0 + tenant pilot profile | Mode gate độc lập, Wave 1 NPP-01 = 3A+3B+2 mixed/ngày, ≥5 ngày theo R009 | **Không áp số chuyến NPP-01 cho mọi tenant**; gate P0 không bị bypass bằng profile |

**Định nghĩa L0+L1:** phần invariant của BR là L0; chỉ tham số công khai ở profile nằm trong L1. Không dùng `feature flag` để bỏ các kiểm tra L0. Mọi `POL-xx` còn cần đưa vào acceptance trace và source code ở S3/S6.

## 2. Product defaults v1 — lựa chọn để đề nghị Owner

| Key/ID | Default/đề xuất cho profile mới | Phạm vi override và validation | Snapshot/evidence |
|---|---|---|---|
| CFG-01 `localization.currency` | `VND` cho archetype Việt Nam | MVP VND; đổi currency cần thiết kế multi-currency mới | currency, policyVersion |
| CFG-02 `localization.timezone` | `Asia/Ho_Chi_Minh` | IANA zone có chính sách chốt; ngày nghiệp vụ từ seller local date, không tin đồng hồ thiết bị | businessDate/timezoneSnapshot |
| CFG-03 `business.sellerProfileRef` | **Thiếu → BLOCKED production** | Mã hồ sơ seller/provider thật được kiểm tra, không dùng dữ liệu demo để xuất hóa đơn | sellerProfileVersion |
| CFG-04 `orders.a.partialsAllowed` | `true` | Không tắt bất biến hỗ trợ giao từng phần; có thể chọn giao một lần theo SOP | orderTerms/remaining |
| CFG-05 `orders.creditTermsDefaultDays` | `UNSET` (null, thiếu chính sách); không suy ra N=0 đã được chấp thuận | Được set N không âm theo Customer/Order; phải snapshot lúc confirm | termsSnapshotId |
| CFG-06 `orders.defaultCreditLimit` | `UNSET` (null, fail-closed); `APPROVED=0` phải có Finance approval | Tenant/Customer có credit approval; B grant không vượt phần đã reserve | creditRuleVersion |
| CFG-07 `trip.availableModes` | A/B_ONLINE/MIXED đều `DISABLED` khi tạo tenant; B_NO_CHANNEL `BLOCKED`; nhánh kênh thay thế khi PWA mất mạng deferred | Chuyển mode theo admission gate + evidence; không suy A đã PASS khi mới cấu hình | modeAdmissionDecisionId |
| CFG-08 `inventory.lotExpiryPolicy` | `SKU_PROFILE`, FEFO cho SKU có hạn dùng | Không được tắt trace lot đối với SKU cần lô; QA/quarantine khi return | lotPolicyVersion |
| CFG-09 `inventory.returnLocation` | `QUARANTINE` (logical code) | Phải map tới stock location hợp lệ trước nhập | locationSnapshot |
| CFG-10 `cost.operationalMethod` | `MOVING_AVG_SKU_LOCATION` theo D-04 | **Không override** trong MVP; kế toán cost kỳ ngoài DMS | sourceCostVersion |
| CFG-11 `price.ruleFamilies` | `LIST_PRICE, CUSTOMER_GROUP, FIXED/PERCENT_DISCOUNT, GIFT_THRESHOLD` | Không chạy scripting/rule tùy ý; priority/tie-break phải rõ, version/effective | priceSnapshot/discountAllocation |
| CFG-12 `price.roundingPolicy` | `DECIMAL_SOURCE_LINE_STABLE` (chiến lược tính ứng viên) | Chốt TADR với vendor/case cụ thể; không hard-code VAT 8/10 từ fixture | roundingProfileVersion |
| CFG-13 `cash.bankVerification` | `MANUAL_VERIFIED_OR_PROVIDER_FACT` | Chỉ fact được kiểm mới CONFIRMED; ảnh chuyển khoản = pending | verificationSource |
| CFG-14 `cash.handoverAcceptance` | `CASHIER_ACTUAL` | Không cho người offer tự accept; thiếu checker giữ pending/case | cashierAcceptanceId |
| CFG-15 `advance.partialSettlement` | `true` | Approved expense và cashier return độc lập, outstanding không âm | advanceEventIds |
| CFG-16 `offline.enabledModes` | `[]` (offline mặc định tắt); per mode/thiết bị/trip sau E2E, B alternative-channel deferred | Chỉ bật mode/thiết bị sau E2E và quyền grant, B no-channel vẫn BLOCKED | grantPolicyVersion/evidence |
| CFG-17 `offline.singleWriterPerTrip` | `true` | L0 **không cho override** | writerEpoch/installationId |
| CFG-18 `invoice.noChannelB` | `BLOCKED` | Chỉ đổi sau B-CASE/LEGAL-MEMO/INV-09, EV-10 hợp lệ; không có bypass bằng Owner flag | seller/legal/evidence refs |
| CFG-19 `accounting.deliveryMode` | `DISABLED_UNTIL_ADAPTER_VERIFIED` | API/FILE/MANUAL_REGISTER cần ID/hash, ghi nhận, lookup/read-back và đối soát đã test | mappingVersion/providerRef |
| CFG-20 `reporting.freshness` | `AS_OF_WITH_PENDING` | Có thể chọn refresh cadence, không được bỏ pending/asOf | reportSourceRevision |
| CFG-21 `ops.cutoverMode` | `CLEAN_FORWARD_ONLY` | Không dual-writer cùng kho; mở mode sau manifest/ký/legacy lock | cutoverApprovalRef |
| CFG-22 `pilot.waveProfile` | `TENANT_SPECIFIC` | NPP-01 8 chuyến/ngày ≥5 ngày theo R009; mỗi tenant khác chọn ngưỡng kèm Owner acceptance | EV-14/15 |
| CFG-23 `approvals.thresholds` | `UNSET` (thiếu thì hành vi cần duyệt giữ pending) | NPP điền nhóm quyền và ngưỡng; không tự chọn hạn mức bằng fixture | approvalPolicyVersion |
| CFG-24 `privacy.retentionPolicy` | `UNSET` ở production | Phải được tư vấn/cấu hình theo phạm vi dữ liệu thực; restore không hồi sinh quyền đã thu hồi | privacyPolicyVersion |

**PADR-02 đã chốt phương án 3:** UNSET khác APPROVED=0; cả hai đều không tự cấp tín dụng nhưng phải lưu nguồn phê duyệt/thiếu cấu hình đúng. Cập nhật Profile/JSON Schema/T02 và regression tương ứng. Một đơn A có điều khoản N>0 phải có snapshot và phê duyệt phù hợp, không dùng default làm thay quyền.

## 3. Chồng lớp cấu hình và precedence (đề xuất)

`ProductInvariants (L0) > ReleaseAdmission (gate theo mode) > TenantProfileVersion > Customer/Role/SKU/Program effective profile > TransactionSnapshot`.

- Khi tạo **giao dịch mới**, chọn policy theo thời điểm hiệu lực và assignment; nếu thiếu required parameter thì `BLOCKED/PENDING`. Tenant không thể thêm luật tự viết hoặc làm yếu invariant.
- Khi giao dịch đã **Confirm/Post**, snapshot các field liên quan tại mốc R009 định nghĩa (A terms tại Confirm; giá/thuế/UoM/discount theo loại sự kiện); không tính lại từ cấu hình đang hoạt động.
- Khi profile thay đổi, tạo version mới, `effectiveFrom`, actor/approver, affected docs/tests/migration; không sửa trực tiếp chứng từ đã post.
- Các trạng thái riêng: `DRAFT`, `REVIEW_PENDING`, `ACCEPTED`, `EFFECTIVE`, `SUPERSEDED`, `REJECTED`; đây là workflow **ứng viên**. `ACCEPTED` cấu hình không đồng nghĩa tính hợp pháp hay `TENANT_GO_LIVE_ACCEPTED`.
- Trong simulator chỉ dùng `SYNTHETIC_FIXTURE`; tenant production phải có `sellerProfileVersion`, `modeAdmissionDecisionId`, quyền và hồ sơ được phép sử dụng.

## 4. Bộ feature gate không được coi là giấy phép

| Feature/mode | Trạng thái đề xuất khi provision | Điều kiện đổi sang ENABLED |
|---|---|---|
| `A` | `DISABLED` tới khi tenant preflight | Tenant/Customer/warehouse/roles, invoice/legal theo giao dịch, cutover/offline gates tương ứng, AC/EV mode đạt |
| `B_ONLINE` | `DISABLED` | Verified valid invoice channel, B atomic/grant/stock/ledger, AC-09/11/12/14/15 + evidence tương ứng |
| `MIXED` | `DISABLED` | A và B scope cùng đạt, AC-03/09/19/21 mixed E2E, kho–cash–invoice đối soát |
| `B_NO_CHANNEL` | `BLOCKED` | Hồ sơ B-CASE-001/002/003, LEGAL-MEMO/INV-09 và EV-10 xác nhận đúng nghĩa vụ; không suy từ PWA offline |
| `OFFLINE_WRITE` | `DISABLED` | Per-device/grant/ledger/reservation/revoke/restore E2E verified; mode invoice độc lập |
| `PRODUCTION_CUTOVER` | `DISABLED` | EV-04/08/09/12, manifest/ký, legacy writer block toàn kho, forward recovery rehearsal |

Lưu mode admission record riêng `tenantId, mode, scope, profileVersion, buildSha, acIds, evRefs, legalRefs, decision, approver, acceptedAt`. Bật flag không làm AC/EV đã PASS hoặc hợp thức hóa giao dịch thật.

## 5. Cổng chính sách và nguồn sự thật khi thay đổi

1. Request thay đổi `policyKey/version` nêu business driver, `R009 D/BR` tác động, dữ liệu lịch sử và kế hoạch migration/forward correction.
2. Phân loại `CONFIGURE` nếu chỉ L1 hợp lệ; `ADOPT_STANDARD` nếu NPP đổi quy trình; `EXTENSION_CANDIDATE` khi cần ADR/AC mới; `BLOCKED` khi vi phạm L0/P0/pháp lý.
3. Không dùng extension để backdate hóa đơn, bỏ khóa writer, ghi nợ hai lần, hay phục hồi quyền đã revoke.
4. Review Owner quyết định **sản phẩm** trước khi code. Reviewer kế toán/provider/pháp lý xác nhận **tenant/legal** theo mode, không thay nhau.
5. Trace `POL → SOP → BR/DC/API/SM → AC/EV → build evidence`; kết quả kiểm cấu trúc tài liệu không thay E2E.

## 6. Quyết định Owner đã chọn; các tham số còn thiếu

Owner đã chọn các PADR liên quan CFG-05/06/07/11/12/16/18/19 và maker–checker; xem [register](owner-decisions-and-evidence-gates.vi.md). Các ngưỡng tiền thực, TTL/cap, SLO và privacy retention vẫn UNSET/TENANT_INPUT_REQUIRED cho đến phê duyệt đúng người. P0/Legal/Provider chưa có evidence thì chặn theo [EVQ Gates](evq-acceptance-gates.vi.md).

## 6. Những lựa chọn chờ Owner (lịch sử trước phỏng vấn)

- [Đã giải quyết] Approve hay sửa default CFG-05/06 (terms/limit 0), CFG-07 (thứ tự admission), CFG-11/12 (bounded price/rounding), CFG-16/18 (offline/no-channel), CFG-23 (approval threshold `UNSET`).
- Chốt quyền kiêm nhiệm và giới hạn maker/checker cho NPP ít nhân sự; thẩm quyền kế toán, kho, thủ quỹ.
- Chọn phạm vi module/cấu hình có thể điều chỉnh theo từng tenant mà không tạo logic riêng. Các câu hỏi này được ghi trong [Product ADR](product-adrs.vi.md), trạng thái `PROPOSED` chứ không giả nhận quyết định.

**Kết luận:** Bộ catalog BR-01–24 đã có lựa chọn Owner cấp policy; chưa có schema production/feature flags được triển khai hoặc bằng chứng Go-Live thực.
