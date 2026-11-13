# S3 — P05 Acceptance & Quality: BDD, trace, fault and evidence contracts

**Phiên bản:** `s3-v1` · **Ngày soạn:** 13/11/2026 · **Phạm vi:** R010 PR #2 · **Trạng thái thực thi:** `CONTRACT_PREPARED / NOT_RUN_PRODUCT`.

S3 hoàn thành **thiết kế kịch bản và hợp đồng evidence**. Không có source PWA/API/SQL/invoice provider/accounting adapter thật trong repository nghiên cứu này; Gherkin hiện **chưa có step definitions**, chưa chạy E2E/chaos/cutover/DR và không tạo chứng cứ production. Chỉ kiểm tra **tính đầy đủ và nhất quán cấu trúc** bằng Node/CI; sau đó S6 mới có thể chạy trên build thật.

## Artifact và hợp đồng

| File | Ý nghĩa |
|---|---|
| [acceptance-matrix.json](acceptance-matrix.json) | Đủ AC-01..21; D/BR/POL/SOP/DC/API/SM/PADR/EV, mode, S2 fixture/oracle, gate, positive/negative scenario |
| [features/](features/) | 42 Gherkin scenarios (P/N cho mỗi AC) dưới dạng **contract unbound** |
| [fault-injection-matrix.json](fault-injection-matrix.json) | 22 điểm fault; F-01..10 nối S2 fault catalog, F-11..22 bổ sung SQL race, replay, restore, B_NO_CHANNEL, pilot |
| [evidence-register.json](evidence-register.json) | EV-01..15, riêng researchStatus `MODEL_ONLY` và runtime `NOT_RUN`; vai trò ký/thu bằng chứng |
| [mode-gates.json](mode-gates.json) | A, B_ONLINE, MIXED, OFFLINE_WRITE, B_NO_CHANNEL và PRODUCTION_CUTOVER; tất cả không được tự GO |
| [test-execution-and-handoff.vi.md](test-execution-and-handoff.vi.md) | Quy trình chạy, quan sát trạng thái, triage, mapping source S6 |
| [evidence-run.schema.json](evidence-run.schema.json) | JSON Schema cho evidence record từng lần chạy; **schema valid không xác thực sự thật của evidence** |
| [evidence-run.example.json](evidence-run.example.json) | Mẫu `NOT_RUN` giả lập, không có chữ ký/commit runtime |
| [s3-validate.mjs](s3-validate.mjs), [s3-regression.mjs](s3-regression.mjs) | Lint trace R009/R010, scenario P/N, EV, gate, oracle, mẫu record và negative mutation |

**Cách chạy trên checkout repo** (Node.js 22, không yêu cầu package install):

```sh
S3=reports/2026-11-13-10-product-reference-go-live-blueprint/s3
node "$S3/s3-validate.mjs"
node "$S3/s3-regression.mjs"
```

Kết quả PASS nếu có chỉ là `S3_CONTRACT_VALIDATED`, **không** `PRODUCT_VERIFIED` hoặc `TENANT_GO_LIVE_ACCEPTED`. CI không được dùng artifact synthetic để viết evidence thật.

## Chính sách đã chọn và ranh giới

- PADR-02: credit terms/limit `UNSET` không phải approved zero; mọi grant khi chưa được Finance phê duyệt phải fail-closed.
- EVQ-05: MVP hỗ trợ A, B_ONLINE, MIXED A+B_ONLINE; Offline A cần E2E theo mode/device, không biến B_NO_CHANNEL thành A; nhánh B cần kênh thay thế khi PWA mất kết nối **deferred**.
- Một writer trip và **một writer kho toàn Kho-01** sau cutover, kể cả hoạt động ngoài Wave 1; thiếu đường khóa nào là P0.
- Tách `OWNER_DECIDED_IN_CHAT`, `DOC_READY`, `PRODUCT_VERIFIED`, `TENANT_GO_LIVE_ACCEPTED`. EV-05..09 đang `MODEL_ONLY` từ nghiên cứu, chưa chứng minh trên runtime.
- EV-14 là điều kiện *trước* pilot; EV-15 là dữ liệu *sau* pilot (NPP-01 3A+3B_ONLINE+2MIXED/ngày trong >=5 ngày khi mode đủ gate). SLO/UX threshold tiếp tục `UNSET` cho tới khi phê duyệt thực.
- B-CASE-001/002/003 và LEGAL-MEMO `EVIDENCE_PENDING`, INV-09 `NOT_RUN`; không auto-pass hóa đơn hay ghi sổ kế toán chỉ bằng mock.

## Handoff

Implementation bindings, testRunId, actual per-event ledger, browser/device, DB concurrency, provider/accounting sandbox, privacy/revoke/restore drills, full-warehouse legacy lock và chữ ký NPP là **S6/tenant evidence pending**. S4 sử dụng schema/runbook này để viết preflight/cutover, S5 dùng mode/gap contract; không kích hoạt production từ tài liệu hoặc CSV T14.

Nguồn: [R009 AC/EV](../../2026-11-13-09-mvp-specification-baseline/acceptance-tests-and-evidence.vi.md), [R010 EVQ](../evq-acceptance-gates.vi.md), [S2 oracles](../s2/golden-oracles.json) và [S2 faults](../s2/fault-case-catalog.csv).

## CI synthetic S3 — 13/11/2026

[S3 workflow run 43396658093](https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/actions/runs/43396658093) trên HEAD `b8e0acd7216c`: **SUCCESS** cho trace 21 AC/15 EV/42 BDD/22 faults/6 mode, 20 negative regression và 10 JSON Schema negatives. `realE2eRuns=0`, `NOT_RUN_PRODUCT`. Xem [validation results](validation-results.vi.md); không dùng kết quả CI này làm EV thực hoặc GO.

## Hardening S3 sau review F1/F2/F4

- `pilotStartRequiredEvIds` của A/B_ONLINE/MIXED bắt buộc EV-14 (readiness trước Pilot); `productionGoLiveRequiredEvIds` thêm EV-15 (kết quả sau Pilot). `requiredEvIds` là alias legacy của pha PILOT_START, **không dùng để kết luận Go-Live**. B_ONLINE có EV-02, MIXED kế thừa A/B_ONLINE và EV-03; OFFLINE_WRITE cần EV-08/09 riêng theo mode/device/trip.
- Evidence schema hỗ trợ `PRE_EXECUTION_BLOCKER` khi chưa chạy test: `BLOCKED`, testRunId và thời gian thực thi null, lý do blocker bắt buộc. Khi `REAL_SYSTEM/FAILED` phải có actual và artifact. CI schema/semantic chỉ tạo synthetic fixtures trong bộ test, không tạo evidence thật.
- Semantic validator ngoài JSON Schema đối chiếu AC ↔ scenario/EV/mode/fixture/fault; CI trigger khi upstream EVQ/SOP/POL/RACI thay đổi. S6 cần thực thi tương đương ở evidence intake.

### Read-only evidence intake (schema + semantic)

Trên máy có `jsonschema>=4.20,<5`, có thể chạy `python s3/s3-evidence-schema-test.py --record /secure/path/observation.json` để kiểm các quan hệ AC/scenario/EV/mode/fixture/fault của một file mới. Thành công chỉ in `S3_RECORD_CONTRACT_VALID_NOT_PRODUCT_VERIFIED`, không xác minh artifact tồn tại hoặc người ký/issuer.
