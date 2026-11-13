# R010-S1-P01c — Ma trận vai trò, quyền và luồng phê duyệt

- **Trạng thái:** `ROLE_MODEL_PROPOSED`; là quyền nghiệp vụ dự kiến, không phải cấu hình RBAC đã triển khai hoặc phép thử an ninh PASS.
- **Nguồn:** [R009-D](../2026-11-13-09-mvp-specification-baseline/decision-register-and-adr.vi.md), [R009-BR](../2026-11-13-09-mvp-specification-baseline/business-rules.vi.md), [R009-G](../2026-11-13-09-mvp-specification-baseline/glossary-and-data-contracts.vi.md). Quy trình: [12 SOP](sop-a-b-mixed.vi.md). Quy tắc: [P01–P24](product-policy-catalog.vi.md).

## 1. Cấu trúc quyền bắt buộc

`effectivePermission = productCapability ∩ currentTenantMembership ∩ activeRole ∩ assignmentScope ∩ recordState ∩ currentGrant/policyVersion ∩ deviceScope(if offline)`.

- Kiểm trên server đối với mọi đọc/ghi, lookup/file/export; quyền menu/UI ẩn không thay thế kiểm soát backend.
- Mỗi actor chỉ thao tác trong tenant đang được xác minh; Subscriber trả tiền SaaS không tự có quyền vào tenant. Admin/support xuyên tenant phải có cơ chế grant kiểm toán và quyền hiện hành, không lấy trực tiếp TenantDB cũ sau restore.
- Quyền theo **hành vi và trạng thái** thay vì chức danh: xe máy người giao kiêm lái, xe tải có thể giao và lái riêng. Driver *không* tự được bán hàng, nhận tiền, xem công nợ hoặc ký nộp quỹ.
- Một người có nhiều role chỉ khi cấu hình/assignment và kiểm soát xung đột đã duyệt; không được tự phê duyệt chính source mình tạo nếu policy yêu cầu checker khác. Phê duyệt nhánh hóa đơn/tuân thủ cần chức năng/nhà cung cấp/người có thẩm quyền thực, không được miễn bằng role tuỳ ý.
- ID role, capability và status dưới đây là **logical names**; table/API/claims là `DESIGN_CANDIDATE`.

## 2. Role catalogue

| Role | Phạm vi quyền đề nghị | Không được mặc định |
|---|---|---|
| OWNER | Duyệt profile và quyết định vận hành/go-no-go; xem evidence có kiểm soát | Không tự làm reviewer pháp lý/provider hoặc xóa P0 |
| TENANT_ADMIN | Quản lý master, membership/role/assignment và đề xuất cấu hình | Không post trực tiếp ledger hay override quyền ngoài tenant |
| SALES | Visit, tạo/chỉnh A draft, đề nghị trả, giao dịch được phân công | Không tự cashier accept, không tự thay AR posted, không override giá |
| WAREHOUSE | Stock/count/lot, A hold/B quota, trip load/unload; manager duyệt chứng từ điều chỉnh | Không tự thừa nhận đã giao, khách đã thanh toán hoặc viết kế toán |
| TRIP_WRITER | Chỉ một installation/grant cho Trip; ghi giao A, B compound, cash actual, journal | Không dùng quota A cho B, không tự nâng hạn mức/grant |
| DRIVER | Xác nhận vận chuyển/xe và lộ trình theo assignment | Không mặc định là trip writer hoặc collector |
| CASHIER | Đếm/xác nhận đã nhận cash handover, cash advance return và quỹ | Không tự sinh receipt khách/giảm AR khi nộp quỹ |
| ACCOUNTANT | Verify bank, receipt allocation, AR/credit, cost reconciliation, accounting outbox | Không tuyên bố `POSTED` là `RECONCILED_OK`, không tự tạo fact vendor |
| APPROVER | Phê duyệt discount ngoài default, gift waiver, return/refund, stock adjustments theo scope | Không phê duyệt chứng từ chính mình tạo khi requires distinct reviewer |
| OPS_SUPPORT | Điều tra outbox/inbox/case/restore, chẩn đoán data freshness, thu evidence | Không có quyền nghiệp vụ/PII mặc định; support grant cần duyệt/audit |
| QA_AUDITOR | Đọc evidence/synthetic fixture trong scope, kiểm acceptance | Không post giao dịch thật chỉ vì cần chạy test |

Trong SME ít người, role có thể kiêm nhưng phải duy trì nguồn sự thật, audit, điều kiện người ký và phân nhiệm tối thiểu theo approval class. Đây là **phương án cần Owner chấp nhận**, không tuyên bố mọi NPP đã đủ nhân sự tách nhiệm vụ.

## 3. Action–capability matrix (đề xuất)

**Ký hiệu:** `E` = được thực hiện khi scope/state hợp lệ; `A` = được phê duyệt/accept khi là checker đúng thẩm quyền; `R` = chỉ đọc trong scope; `-` = không có quyền mặc định. Quyền thực còn phụ thuộc tenant grants và feature gate.

| Hành vi | SALES | WAREHOUSE | TRIP_WRITER | DRIVER | CASHIER | ACCOUNTANT | APPROVER | TENANT_ADMIN |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Cập nhật Customer/Outlet và ShipTo nháp | E | - | R | - | - | R | - | E |
| A Order tạo/confirm (theo hạn mức) | E | R | R | - | - | R | A* | - |
| A reserve/B quota; load/unload | R | E | R | R | - | R | A* | - |
| B sale + delivery + actual receipt trên trip | - | - | E | - | - | R | - | - |
| Visit/return request | E | - | E* | - | - | R | - | - |
| Return accept/QA release | R | E* | R | - | - | R | A | - |
| Thay giá/waiver/discount exception | - | - | - | - | - | R | A | E* |
| Verify bank / phân bổ receipt / customer credit | R | - | R | - | R | E | A* | - |
| Cash handover OFFER | E* | - | E | - | - | R | - | - |
| Cash handover ACCEPT | - | - | - | - | A | R | - | - |
| Advance issue / approve expense | - | - | - | - | R | E* | A | - |
| Advance cash return OFFER/ACCEPT | - | - | E* | - | A | R | - | - |
| Refund REQUEST / approve / disburse | E* | - | - | - | E* | E* | A | - |
| Invoice/accounting queue & reconcile | - | - | - | - | - | E | A* | - |
| Cutover writer lock, opening approve | - | E* | - | - | R | E* | A* | - |
| Configure membership/profile | - | - | - | - | - | - | A* | E |
| Revoke/restore/handle exception | - | - | - | - | - | R | A* | - |

`E*`/ `A*`: cần assignment/phân quyền phụ và workflow xác nhận độc lập. Bảng không mặc định mỗi NPP tách hết cá nhân; **không** có ý nghĩa TENANT_ADMIN được ký quyết định pháp lý hay Operations được tự chấp nhận chứng cứ.

## 4. RACI cho bàn giao và ký duyệt

| Quyết định/đối soát | Responsible (làm) | Accountable (chịu trách nhiệm) | Consulted / xác nhận khác | Evidence bắt buộc |
|---|---|---|---|---|
| Customer/pricing/terms profile | Admin/Sales | Tenant owner | Sales manager/Accountant | profileVersion, nguồn, hiệu lực |
| Cấp xe và phân tách A/B | Warehouse | Warehouse manager | Trip writer | manifest, held/quota, lot và ký nhận |
| Handover tiền thu hộ | Trip writer/Cashier | Cashier manager | Accountant | offered vs accepted amounts, source, người giao/nhận |
| Advance issue/settlement | Accountant/Cashier | Finance approver | Employee | issue, approval, expense/return acceptance IDs |
| Waiver/quà/return/refund | Sales/Returns operator | Policy approver | Warehouse/Accountant | nguồn giao, snapshot, approval/disbursement |
| Invoice/legal seller profile | Accounting/Invoice ops | LegalSeller authorized rep | Provider/legal adviser phù hợp | hồ sơ seller, policy thời điểm, kết quả provider |
| Reconciliation posting | Accountant | Accounting owner | Integration ops | source IDs, cutoff, actual receipt/POSTED/diff |
| Cutover opening | Warehouse + Accountant + IT | Tenant owner | Cashier + trip owner | manifest, writer audit, xác nhận đa bên |
| Restore/authority/privacy | Security/Ops | Tenant owner | Legal/privacy officer khi áp dụng | audit, current authority, external registry |
| Pilot admission A/B/mixed | QA/Ops | Product Owner và tenant authority theo phạm vi | Warehouse/Accounting/provider | AC/EV, testRunId, device, n/N, Go/No-Go |

## 5. Approval classes và quy tắc thay đổi

| Approval class | Trigger | Checker, guard và outcome |
|---|---|---|
| AP-01 CREDIT_OVERRIDE | Vượt credit limit/terms cho A hoặc B theo policy | Đề xuất checker Finance/Sales supervisor; nếu không có approval, không post intent vượt quyền |
| AP-02 STOCK_ADJUST | Stock count lệch, write-off, quarantine release | Warehouse manager + nguồn kiểm kê; sau cutover chỉ writer MVP, correction có source |
| AP-03 PRICE_DISCOUNT | Giá ngoại lệ, giảm ngoài tập auto | Pricing approver; nếu ngoài tập hữu hạn, case/extension thay vì chạy rule động |
| AP-04 GIFT_WAIVER | Miễn thu hồi quà khách đang giữ | Approver khác người đề xuất, lưu giftHeld/waivedHeld và nguồn; không tăng entitlement |
| AP-05 RETURN_REFUND | Hàng trả và hoàn CustomerCredit | Return accept/QA riêng; refund approved **và actual disbursement** mới đổi credit |
| AP-06 CASH_ACCEPT | Tiền nộp quỹ, hoàn ứng | Cashier **người nhận thực** xác nhận; không cho người giao tự accept |
| AP-07 ADVANCE_EXPENSE | Duyệt chi tạm ứng | Finance approver có nguồn; ReturnOffer chưa giảm outstanding |
| AP-08 CUTOVER_GO | Freeze, opening import, writer switch/forward recovery | Warehouse+Accountant+Cashier+IT+Owner theo manifest; không bỏ off-wave stock |
| AP-09 MODE_RELEASE | Mở A, B online, B no-channel, mixed | Product/tenant owner theo AC/EV và legal/provider gate; **B no-channel không bypass** |
| AP-10 RESTORE_REOPEN | Mở lại sau restore/sự cố quyền | Security/Ops kiểm authority hiện hành/privacy/external effect, rồi approver được phân quyền |

**Policy đề xuất:** mọi approval lưu `approvalId,scope,sourceId,proposerId,approverId,authorityVersion,policyVersion,decision,reason,acceptedAt,evidenceRef`. Ngưỡng tiền và số cấp duyệt là `TENANT_INPUT_REQUIRED` (không đặt mặc định giả như luật). Nếu thiếu checker bắt buộc, giao dịch ở pending/case cho tới khi phân công, không tự giảm cấp kiểm soát.

## 6. Lỗi âm tính & acceptance liên quan

- Revoked membership/role vẫn truy cập sau restore; cross-tenant lookup/file; support đọc PII không grant ⇒ deny/audit; AC-01/13, EV-01/09.
- Hai writer cùng trip, cùng người dùng trên installation khác; đổi driver thành trip writer mà không grant ⇒ deny/reconcile; AC-12, EV-08.
- Cash collector tự accept, Cashier accept vượt offer, advance nhân viên tự xác nhận ⇒ không chuyển sổ; AC-10/20, EV-06.
- Gift waiver khi không có source, refund approved chưa disburse, stock trả thẳng available ⇒ chặn/case; AC-05/07/19, EV-05/06.
- Owner tick `B_NO_CHANNEL` mà EV-10 chưa có ⇒ blocked không kích hoạt; AC-14, EV-10.
- Admin đổi policy cho giao dịch posted ⇒ không hồi tố, cần correction/version; AC-08/19, EV-05/06.

**Status:** toàn bộ role/approval class là đề xuất S1, việc chạy test và cấu hình IAM thực thuộc S3/S6; các approval của Owner/NPP chưa được ghi nhận trong tài liệu này.
