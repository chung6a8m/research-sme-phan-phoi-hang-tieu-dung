# R010-S2-VAL — Biên bản validation và giới hạn bằng chứng

**Giai đoạn:** S2 P03/P04, 13/11/2026. Nguồn [S2 README](README.md), [dictionary](data-dictionary.json), [fixtures](fixtures/), [trip scenarios](trip-scenarios.json), [oracles](golden-oracles.json).

## 1. Kết quả đã có

| Nhóm | Kết quả | Phương pháp |
|---|---|---|
| Định danh template | **14/14** template CSV header + field dictionary | Sinh/đối chiếu cấu trúc trong Code Mode |
| Fixture F0 | 1 tenant, 12 SKU, 6 Customer, 4 Outlet, 3 chuyến | Generator/validator pure functions |
| Fixture F1 | 1 tenant, 50 SKU, 40 Customer, 55 Outlet, 40 chuyến | Generator/validator pure functions |
| Fixture F2 | 3 tenant, 360 SKU, 240 Customer, 300 Outlet, 300 chuyến | Generator/validator pure functions |
| Source checks | SHA-256 known vector, row source hash, FK, required, AR/advance/custody, mode flags | Model validation |
| Oracle AC-03/19/20/21 | **4/4** conservation/numeric examples | Model validation; kế thừa expected R009 |
| Per-trip scenarios | **343/343** độc lập; conservation qty/cost, AR+cash, source refs | Model projection + negative mutation |
| Negative cases | **26/26** ca CLI regression source type/line, T14, A/B/MIXED, writer/driver, hash/FK/money/csv và Go-Live claims | Node synthetic CSV dry-run regression, không có product effects |
| GitHub Actions | **SUCCESS** trên commit `f85ec2e` (run #10) | Python S1 lint + JSON Schema 2020-12, Node S2 bundle/trip và 26 regressions |
| Excel template (trong cuộc trò chuyện) | Workbook 15 sheets đã tạo với artifact_tool; ZIP integrity và 14 sheet headers có kiểm tra | Local artifact build; **binary chưa commit trong PR** |
| Excel generator trong repo | \`s2-create-xlsx.py\` có mã tạo Workbook từ dictionary | Đã commit script; **không có bằng chứng đã chạy script này trong CI** |

**CI run kiểm chứng phần sửa:** https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/actions/runs/43369871144 (commit `f85ec2e`, 26 cases) — phần docs bổ sung không tạo bằng chứng Go-Live.

## 2. What passed vs what has not

- \`SYNTHETIC_CI_VERIFIED\`: đúng syntax/parser/metadata, tính toán theo số giả, template và regenerate checksum trong phạm vi bài kiểm GitHub.
- \`MODEL_ONLY\`: các giá trị expected và 343 trip projections độc lập. Không có hệ thống DMS thực tế ghi/đọc lại ledger hay chạy UI.
- \`EVIDENCE_PENDING\`: seller/tax profile, provider điện tử, hóa đơn B mất kênh, kế toán POSTED/RECONCILED, NPP source data, permission/privacy, writer lock toàn kho, offline PWA và restore/cutover signed.
- \`OWNER_REVIEW_PENDING\`: Product ADR S1, policy default, mẫu biểu và các giả định/cấu hình cần Owner chấp nhận trước Product Baseline v1.

**Không được suy diễn:** CI pass ≠ PWA/API/SQL verified; sample cash/AR balance ≠ cashier/finance signed; CSV preview pass ≠ import thật; file Excel có dropdown ≠ chứng cứ Go-Live.

## 3. Handoff sang S3

S3 nên mở Gherkin/test matrix cho AC-01..21 và EV-01..15, dùng fixtures hiện có làm *test input*. Tập trung negative cases idempotency, competing writes, split A/B, restore revoke, invoice UNKNOWN, cutoff/cost adjustment và trạng thái n/N. S3 phải ghi \`testRunId,commitSha,buildVersion,environment,tenant,fixtureHash,actual/expected,reviewer,evidenceURI\`; tất cả số liệu thực còn \`NOT_RUN\` cho đến khi có kết quả.

**Đề nghị quyết định:** chấp nhận **S2 hoàn thành phạm vi tài liệu/data tooling**, vẫn giữ PR Draft và giao S3; không ký thay NPP hoặc Owner. Báo cáo chỉ xác nhận những checks nêu rõ ở trên.

## Bổ sung sau review PR #2 — trạng thái bằng chứng

Run #10 xác nhận **JSON_SCHEMA_VALIDATED**, **PASS S1_DOC_STRUCTURE** (D15/BR24/POL24/SOP12/PADR9), **PASS_SCENARIOS_MODEL_ONLY 343** và **PASS_S2_REGRESSION_MODEL_ONLY 26**. S2 generator/dry-run trên fixture tái tạo cũng thành công. Các test này kiểm mô hình/CSV/metadata, **không** kiểm SQL/PWA, provider/legal, tenant data approval, restore/cutover hoặc pilot.

Các lỗi mở được xử lý trong contract kiểm thử: source namespace liên loại, T05 nhiều dòng một document, T14 nhiều evidence case/mode, ma trận A/B/MIXED, ràng buộc một writer/trip không cấm thiết bị tái sử dụng, T01 requestedModes đa giá trị, và tách delivery/driver trong T11. Trạng thái Product ADR vẫn đề nghị Owner review, không tự chuyển \`ACCEPTED\`.
