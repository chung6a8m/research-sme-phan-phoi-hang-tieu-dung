# S6 — Roadmap thực thi và kiểm chứng (active, chưa chạy)

**Căn cứ:** R009 implementation plan; R010 S5 handoff, S3 AC/EV/Fault, S4 Ops/P08, Owner Acceptance C′. Đây là work queue **PLANNED_NOT_EXECUTED**, không phải quyết định kỹ thuật TADR cuối cùng.

## 0. S6-0 — Engineering intake

- Xác nhận PR #2 merge/manual review/branch policy trước khi tích hợp source baseline. Product C′ immutable, R chỉ metadata.
- Owner/Engineering chọn source repository thực tế, maintainer, test pipeline, execution environment; không tự gán repo từ dự án khác.
- Dựng sandbox test/CI, dataset tổng hợp có quyền, secure artifact store, log/ledger checkpoints, reviewer matrix, secrets isolation.
- Đưa TADR-01/02 vào design review; chưa chốt database, hosting, identity, sync, provider hoặc accounting adapter bằng suy đoán.
- P2: validator hậu phê duyệt R bằng read-only cross-check với actual GitHub comment/sha/CI/reviewer refs, không dùng JSON tự chứng thực.
- **DoD:** source repo/environment/roles và policy test safety được phê duyệt; S6 runtime work được phép mở PR trong môi trường kiểm soát, chưa Product Verified.

## 1. Vertical slice roadmap

| Stage | Scope source/test | TADR / AC / EV | Điều kiện để tiến |
|---|---|---|---|
| **S6-A Foundation** | Tenant authority, transaction/stock and 3-ledger, durable inbox/outbox, ACK/replay/concurrency, scoped Online G-IDEMP | TADR-01/02; AC-01/03/04/09/10/11; EV-01/03/04/06/08 | Chứng minh per-event/source-line SQL/API, không tự cấp Offline Write |
| **S6-B A Online** | Order Confirm giá thương mại khóa, multiple partial delivery, terms/due theo lần giao; return/quarantine/gift, moving average SKU×location; invoice/accounting | AC-02/04/05/06/07/08/19; EV-02/04/05/06/07/10/11 | Kiểm từng source document và Finance review, không tự coi invoice fixture là pháp lý |
| **S6-C B_ONLINE + MIXED** | B sale/delivery/receipt atomic, BQuota/credit, provider channel verified, UNKNOWN lookup; accounting POSTED vs RECONCILED; Mixed E2E độc lập | TADR-03; AC-03/09/14/15/19/20/21; EV-03/05/06/10/11 | A hold không dùng thay BQuota, B_NO_CHANNEL BLOCKED |
| **S6-D Offline A** | Per-mode/device/trip grant TTL/epoch, durable PWA journal, loss/replay/revoke/restore/PrivacyActionLedger; F-01..22 scoped | TADR-02/04; AC-01/11/12/13/17; EV-08/09 | Real-device E2E riêng; Offline Write vẫn DISABLED cho đến mode admission |
| **S6-E Cutover** | C0..C8, opening manifest/signer, legacy writer lock toàn Kho-01 bao gồm off-wave/UI/API/job/import/DB/offline, Forward Recovery | TADR-04 (DR/authority scope) + TADR-05; AC-04/10/13/16; EV-04/09/10/11/12 | Multi-party approval và rehearsal; no rollback sau firstEffectId |
| **S6-F Pilot** | TADR-06 UX-01..08, approved SLO/coverage n/N, EV-14 trước Pilot, EV-15 sau 5+ ngày với 3A/3B_ONLINE/2MIXED/ngày | AC-17/18; EV-13/14/15 | Go/No-Go theo mode độc lập Product Verification/Tenant Acceptance |

**Dependencies:** A sau S6-0; B sau A; C sau A+B; D sau A (có thể song song B/C); E sau A+B+C, TADR-04 (recovery/authority scope) và TADR-05, **không phụ thuộc hoàn thành Offline A S6-D**; E vẫn kiểm kê/khóa mọi legacy offline device, queue và grant trên toàn Kho-01, có EV-09 restore/revoke cần thiết. F sau B+C+E và EV-14 đã đủ scope. B alternative channel khi PWA mất mạng DEFERRED. G-STOCK, G-CUT, G-IDEMP, G-LEDGER, G-INV nonwaivable.

## 2. Definition of Ready cho source PR

1. Repository/branch/maintainer, mode/build/tenant scope, reviewed TADR và affected D/BR/POL/SOP/DC/API/SM/AC/EV đã ghi.
2. Định nghĩa expected actual per-source line/ledger và source IDs, negative concurrency/failure cases, fixture hash.
3. Data source được phép sử dụng, safety plan cho fault injection/provider, sandbox, secrets/PII policy, secure artifacts.
4. Không có business semantic drift so với C′; nếu cần thay contract phải qua Product ADR/Owner version mới.
5. P0 dependencies/trạng thái blocked và người chịu trách nhiệm được công bố, không ẩn trong demo.

## 3. Definition of Done cho source PR

1. Code+schema/migration+API/PWA/SQL/provider integration, unit/integration/E2E tests theo AC/EV, có negative và concurrency/restore/replay.
2. Real-system evidence testRunId/build/tenant/mode/environment, actual/expected từng bước, source ledger diff trước/sau, artifact SHA256 và reviewer approval có thẩm quyền.
3. Khi evidence chưa được QA/Finance/Legal/Ops xác nhận, để NOT_RUN/BLOCKED/EXECUTED_UNREVIEWED, không tự chuyển EV PASS.
4. P0 không miễn; P1 exception phải scope/timebox/owner/mitigation/compensatingControls/reviewer/approvalRef.
5. Merge source ≠ Product Verification ≠ Tenant Go-Live; mode admission và cutover có workflow độc lập.

## 4. Handoff per milestone

- **S6-0:** source repo, TADR queue, CI/harness, policies, secure artifact store.
- **S6-A:** atomic ledgers, tenant authority, online G-IDEMP real-system runs.
- **S6-B:** A per-delivery/price/cost/returns evidence.
- **S6-C:** B_ONLINE/Mixed invoice & accounting external evidence.
- **S6-D:** offline device/journal/restore evidence theo grant riêng.
- **S6-E:** C0..C8 full Kho-01 stock writer fencing evidence.
- **S6-F:** EV-14 pre-pilot evidence, EV-15 actual pilot and mode-level Go/No-Go.

Máy đọc được: [s6-work-items.json](s6-work-items.json). Bảy stage hiện đều PLANNED_NOT_EXECUTED.
