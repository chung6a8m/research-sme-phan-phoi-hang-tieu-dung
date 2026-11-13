# S3 — Quy trình thực thi P05, gắn source S6 và thu evidence

**Trạng thái:** `S3_CONTRACT_CANDIDATE / NOT_RUN_PRODUCT`. Căn cứ [R009 AC/EV](../../2026-11-13-09-mvp-specification-baseline/acceptance-tests-and-evidence.vi.md), [EVQ](../evq-acceptance-gates.vi.md) và [S2](../s2/README.md). Gói này định nghĩa expected/negative test; không có source PWA/API/SQL/provider thật trong repository nghiên cứu.

## 1. Chuỗi kiểm chứng

1. **Đầu vào có phiên bản:** khóa `acId`, `scenarioId`, `evIds`, policy/profile version, tenant/mode, fixture hash, source IDs và build SHA. T01 `requestedModes` không là Mode Admission; T14 CSV không có quyền tuyên bố GO/VERIFIED.
2. **Source bindings:** Engineering/QA viết step definitions cho 42 Gherkin từ `features/*.feature` trong source repo, thực thi qua PWA/browser/IndexedDB, API, SQL transaction/ledger, invoice provider và accounting adapter. Chưa có bindings thì `NOT_RUN_PRODUCT`, không ghi `PASS` hoặc coi thử model là product test.
3. **Instrument trước/khi/sau command:** immutable commandId/effectId/sourceRecordId/payloadHash; SQL ledger MAIN/TRIP/hold/quota/cost, AR, CustomerCredit, custody, fund, advance; durable inbox/outbox/receipt, invoice external registry, accounting POSTED/reconciliation. Lấy **before/after từng bước**, chứng từ và tài khoản source line; tổng cuối không đủ.
4. **Điều kiện chạy fault:** môi trường test cô lập/controlled sandbox, owner cho phép, kịch bản phục hồi, nguồn dữ liệu được phép dùng, trace đối tác; không tự tắt mạng, ghi vào kho hoặc phát hành hóa đơn production. Fault matrix F-01..22 ghi injection point và expected invariant, toàn bộ `NOT_RUN_PRODUCT`.
5. **Kiểm after-restart/restore:** SQL commit trước/after ACK, concurrent grant, chỉ một writer trip, legacy writer lock toàn Kho-01 kể cả off-wave, external effect ngoài TenantDB snapshot, revoke, PrivacyActionLedger, GenerationAnchor. Nếu physical event xảy ra trước khi bị từ chối, lưu durable case/source (không làm mất hàng/tiền).
6. **Observation record:** tạo file mới theo [evidence-run.schema.json](evidence-run.schema.json), có `REAL_SYSTEM`, `testRunId`, commit SHA 40 ký tự, build, environment, device, `fixtureHash`, IDs, expected/actual, ledger checkpoints, artifact URI+SHA256, masking/retention và blockers; `EXECUTED_UNREVIEWED` chỉ chứng minh *có bản ghi*, không tự xác nhận đúng.
7. **Review và gate độc lập:** QA/Engineering review run; Finance/Kho/Ops/Legal/provider phê duyệt phần thẩm quyền, Product Owner chốt Product Verification theo build/mode. Tenant Go-Live Acceptance lại cần hồ sơ NPP/mode, cutover/opening, pilot và chữ ký. JSON Schema hợp lệ hoặc reviewer `APPROVED` một observation **không đồng nghĩa** Product/Tenant gate PASS.
8. **P0/P1:** bất kỳ P0 chưa được chứng minh trong scope ⇒ `NO_GO_PENDING`; P1 chỉ exception có Owner/scope/expiry/mitigation/compensating control, không đổi `FAILED` hay `EVIDENCE_PENDING` thành PASS.

## 2. Bản đồ runtime cần kiểm

| Nhóm | AC/EV | Hệ thống và checkpoints thật |
|---|---|---|
| Tenant/master/restore | AC-01/02/13; EV-01/02/09 | API/SQL tenant scope, lookup/file/object, membership revoke, privacy action ngoài rollback, generation anchor |
| A/B/Mixed kho | AC-03/04/05/08/09/16; EV-03/04/06/08/12 | SQL atomicity, MAIN/TRIP và hold/quota, source lot, writer lock old UI/API/job/import/offline, mọi off-wave stock |
| Giá/return/cost | AC-06/07/19; EV-05/07/10/11 | Decimal line-stable, fee/cost correction nguồn, locked period bridge, return, refund actual, external line read-back |
| Ba sổ và credit | AC-09/10/20/21; EV-06 | AR/custody/advance/CustomerCredit từng item, offer vs cashier accept độc lập, grant credit UNSET vs approved-zero |
| Offline/journal | AC-11/12/13/17; EV-08/09/13 | PWA IndexedDB, airplane mode, SQL durable inbox, ACK mất, dependency/cycle, device writer và revoke |
| Hóa đơn/kế toán | AC-14/15; EV-10/11 | A/B_ONLINE seller & channel, provider UNKNOWN lookup cùng ref, outbox, RECEIVED/POSTED/RECONCILED_DIFF, manual register |
| UX/Pilot | AC-17/18; EV-13/14/15 | UX-01..08 người dùng/thiết bị thực, ngưỡng SLO ký **trước** Pilot, log n/N, defect/case/support cost |

**Quyết định EVQ-05:** B_ONLINE chỉ giao bán khi kênh invoice hợp lệ đã được chứng minh; nhánh B dùng alternative channel khi PWA mất mạng bị hoãn. `B_NO_CHANNEL` luôn `BLOCKED` trong MVP, B-CASE-001/002/003 và LEGAL-MEMO `EVIDENCE_PENDING`, INV-09 `NOT_RUN`. Chỉ kiểm behavior bị chặn, không thử giao hàng thật bất hợp lệ.

**S2 AC-19:** VAT đầu vào 8%/10% chỉ là fixture `MODEL_ONLY`, `invoiceEligible=false`; không dùng làm mức thuế NPP thực. Oracle của AC-03/19/20/21 phải kiểm từng event và từng source line trên runtime, không cộng 343 scenario S2 thành sổ kho thực.

## 3. Quy tắc riêng cho Pilot và cutover

- EV-14 = chuẩn bị Pilot: được ký sau khi P0 theo mode đã đạt, có thiết bị, runbook, trained roles, case owner và SLO/UX threshold/denominator được phê duyệt; nếu threshold `UNSET`, chưa thể kết luận readiness.
- EV-15 = kết quả Pilot thật: NPP-01 giữ nguyên D-15 **3A + 3B_ONLINE + 2MIXED/ngày × ít nhất 5 ngày đại diện**, nếu từng mode đã admitted; đo n/N, asOf, latency, age case, chi phí hỗ trợ, lỗi và stock off-wave Kho-01. F1 fixture chỉ tái hiện *hình dạng* kế hoạch, không là Pilot thực.
- G-STOCK: phải khóa mọi writer old UI, API, job, import và offline client cho **toàn Kho-01**. G-CUT: opening kho/xe/AR/custody/advance/external manifest có chữ ký, late event có source, sau first effect chỉ Forward Recovery, không rollback ledger/ngoại hiệu ứng.
- Không tự điền số SLA/timeout/RPO/RTO hoặc business sign-off. Product release, integration, tenant và Pilot dùng hồ sơ riêng, theo mode.

## 4. Phân loại kết quả và handoff

| Loại | Khi nào dùng | Không suy diễn |
|---|---|---|
| `S3_CONTRACT_VALIDATED_NOT_PRODUCT_TEST` | CI chạy lint trace, 42 Gherkin, negative regression, JSON Schema | Không có testRunId hay hệ thống thật |
| `NOT_RUN` | Chưa có real-system execution/step definitions | Không thay thành `BLOCKED` chỉ vì chưa viết runner |
| `BLOCKED` | Có hành động kiểm có chủ nhưng môi trường/dependency chưa cho chạy, ghi owner/rủi ro | Không phải PASS hoặc P1 waiver |
| `FAILED` | System run khác invariant | P0 phải NO-GO; đính source artifacts |
| `EXECUTED_UNREVIEWED` | Chạy runtime có log và actual | Không tự `PRODUCT_VERIFIED` |
| `PRODUCT_VERIFIED` / `TENANT_GO_LIVE_ACCEPTED` | Quyết định độc lập sau review đầy đủ và chữ ký đúng scope | Không xuất hiện như status trong file observation |

**S4** tiếp nhận fault/run matrix để soạn cutover/DR/support/legal preflight; **S5** dùng mode gates cho tenant gap assessment; **S6** tạo source bindings, chạy test thật và kiểm chứng TADR-01..06. Trên PR #2 không thay mã hệ thống, không nhập NPP thật, không tạo phê duyệt provider/legal và không merge hay bật production.

