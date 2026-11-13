# S4-P06/P08 — RACI, đào tạo và mẫu hồ sơ phê duyệt

**Trạng thái:** `ROLE_DESIGN / NO_ACTUAL_SIGNOFFS`. Đây là mẫu phân công để S5 điền người/ủy quyền thật, không tự gán tên người ký hay ngày. Chi tiết role theo [S1 role/approval matrix](../role-and-approval-matrix.vi.md).

## 1. Ma trận thực hiện và độc lập checker

| Hoạt động | Responsible | Accountable / checker phải độc lập khi bắt buộc | Bằng chứng |
|---|---|---|---|
| Tenant/master/profile & customer credit | Tenant Admin/Data owner/Sales | Tenant Owner, Finance (credit approval) | Profile version, source, approved-zero vs UNSET |
| Seller/thuế/hóa đơn | Invoice/Accounting ops | Seller representative + Legal/Tax + Provider theo scope | Seller contract, legal review, invoice actual |
| Kho/xe/lot/hold/quota & off-wave | Warehouse/Trip writer | Warehouse manager | Source manifests, FEFO/quarantine, one writer trip |
| Tiền khách/offer nộp quỹ/hoàn ứng | Collector/Trip writer | **Cashier là người thực nhận**, Finance checker | Offered vs accepted, receipt/source IDs, audit |
| Opening cutover AP-08 | Warehouse + Accounting + Cashier + IT | **Tenant Owner** sau xác nhận đa bên; QA kiểm test | Snapshot SHA, cutoff, FULL Kho-01 writer lock |
| Fault/restore AP-10 | IT/Ops/Security | Tenant authorized approver; Legal/privacy nếu liên quan | Restore log, current authority/PII/external IDs |
| Product verification | Engineering + Product QA | Product authorized approver, phạm vi build/mode | PWA/API/SQL/provider real evidence, testRunId |
| Mode release AP-09 & Pilot EV-14/15 | Ops/QA/Sales | Product Owner + Tenant Owner trong hai cấp khác nhau, Finance/Warehouse/Legal theo gate | Go/No-Go per mode, n/N, approved thresholds, signed refs |
| Support/incident | Ops on-call + functional owner | Incident Commander + Tenant Owner cho reopen | Timeline, source diff, P0/P1, case owner/expiry |

Một người có thể kiêm nhiều role nhưng **không** làm maker và checker cho cùng action khi bắt buộc tách; delegation phải có scope/version và người được ủy quyền thực sự đủ thẩm quyền. Thiếu độc lập ⇒ `PENDING/CASE`. NPP phân công khác bảng chuẩn phải có role mapping và SoD check riêng.

## 2. Training rehearsal theo chức năng

| Nhóm | Bài diễn tập cần chứng minh trên thiết bị/sandbox thật | Evidence/handoff |
|---|---|---|
| Kho/xe | Cấp A hold/B quota, lot/FEFO, mixed load, off-wave import/adjust, trả hàng quarantine, ký nhận | Stock trip/MAIN diff, source hash, checkpoint |
| Sales/Delivery/Driver | 8 UX tasks, visit no-order, A partial delivery, B_ONLINE channel guard, mixed, mất kết nối, paper occurredEvent | Video/log được phép, testRunId, role assignment |
| Cashier/Finance | CashHandover offer/accept, bank pending, AR allocation/Credit, Advance return/expenses, P1 correction | Ba sổ before/after, checker ID |
| Accounting/provider | Invoice idempotency UNKNOWN lookup, API/FILE/MANUAL_REGISTER, POSTED vs RECONCILED_DIFF | External refs, read-back, case/escalation |
| IT/Security/Ops | Writer-lock legacy all paths, restore/revoke/privacy, generation anchors, device-lost, support least privilege | F-01..22 relevant, DR report, incident runbook |

Training register (chưa có dữ liệu thật): `tenantId, personRole, assignmentVersion, deviceId, scenarioId, executionDate, environment, trainerId, observerId, actualOutcome, testRunId, artifactHash, reworkOwner`. Không gắn `TRAINED` nếu chỉ phát tài liệu; cần observed success theo ngưỡng được duyệt.

## 3. Template hồ sơ để người có thẩm quyền ký riêng (không ký trong repo này)

| Trường cần điền | Nội dung / nguồn |
|---|---|
| Tenant, mode, warehouse scope, requested/admitted | `tenantId`, `profileVersion`, `mode`; Kho-01 full scope |
| Change/freeze/switch | `changeId`, `cutoffAt` cùng timezone, `firstEffectId` hoặc xác nhận no-effect bằng nguồn |
| Build/contract | Product build SHA, DB/schema, providerVersion, mappingVersion, legal/seller/privacy versions |
| Opening/cutover | T05/T07..T13 source manifest hash, balance per source, custody cash count, legacy writer path test links |
| Run evidence | S3 `testRunId`, AC/EV/F-IDs, artifacts URI+SHA256, actual/expected, reviewer |
| P0/P1 | Gate P0/pass evidence per scope; P1 exceptions có owner, scope, expiresOn, mitigation và independent review |
| Preflight | Seller/legal/tax/provider/accounting/privacy check ID + signer + thời điểm thực |
| Decision | `NO_GO_PENDING`/`DISABLED_PENDING`/`BLOCKED` khi chưa đủ; nếu xem xét GO thì thực hiện **quy trình phê duyệt độc lập của S6**, không ghi vào dossier mẫu |
| Signers | Warehouse, Accountant/Finance, Cashier, IT/Security, Legal/Provider (nếu áp dụng), Tenant Owner, Product QA/Product Owner đúng phần |

**Mẫu ghi nhận ý kiến:** "Phạm vi được kiểm: [tenant/mode/build/warehouse/cutoff]. Source hashes: [...]. Kết quả từng gate: [...]. P0 mở: [...]. P1 exceptions: [...]. Tôi xác nhận *chỉ* phần thẩm quyền [role] với evidence [URI/hash], ký tại [actual timestamp]." Đây là **mẫu trống**, không phải chữ ký.

## 4. Trình tự phê duyệt và escalation

1. QA kiểm `Product Verification` trên build cụ thể; không thay evidence thực bằng S3/S4 synthetic CI.
2. Tenant Warehouse/Accountant/Cashier/IT/Legal/provider cung cấp hồ sơ theo phạm vi; Tenant Owner xem C5/C6/DR/tenant profile trước mode admission.
3. EV-14 phải ký **trước** Pilot với UX-01..08, thiết bị/nhân sự, denominators n/N, SLO thresholds, support roster/incident owner. Tất cả threshold hiện `UNSET`.
4. Sau EV-14 mới chạy pilot NPP-01 theo D-15 khi mode admitted; EV-15 review actual 5+ ngày theo coverage và severity. Thiếu coverage/threshold ⇒ `NO_GO_PENDING`, không kết luận pass.
5. Nếu incident/restore/later P0, dừng scope, AP-10 và mode re-admission phải có independent acceptance; **AP-08 không mặc nhiên chấp thuận AP-09**.

**S5/S6 cần hoàn thiện:** danh sách tên/ủy quyền thật, consent, privacy/legal memo, RPO/RTO/SLO, vận hành provider, device matrix, incident contacts, nghĩa vụ pháp lý và chữ ký. Trên PR #2 không có các thông tin đó.
