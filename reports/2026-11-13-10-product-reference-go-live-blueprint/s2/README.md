# R010-S2 — Data Foundation P03/P04: kết quả triển khai

**Ngày:** 13/11/2026. **Trạng thái:** \`S2_ARTIFACTS_IMPLEMENTED_SYNTHETIC_CI_VERIFIED\`, **Product Owner review pending**. Đây là bộ tài liệu, template và mô hình tổng hợp, không phải \`DOC_READY\` do Owner ký, \`PRODUCT_VERIFIED\` hoặc \`TENANT_GO_LIVE_ACCEPTED\`.

## 1. Sản phẩm bàn giao

| Gói | File thực có trong PR #2 | Nội dung |
|---|---|---|
| P03 | [data-dictionary.json](data-dictionary.json) | 14 template T01–T14, trường, kiểu, required, tham chiếu FK, enum, owner, ví dụ giả lập |
| P03 | [templates/blank/](templates/blank/) | **14 CSV UTF-8/LF** chứa header chính xác; không chứa dữ liệu thực hay record được duyệt |
| P03 | [examples.json](examples.json) | 1–2 bản ghi mẫu/tập T01–T14 từ F0, mang \`SYNTHETIC_S2\` |
| P03 | [s2-import-dry-run.mjs](s2-import-dry-run.mjs) | Trình đọc CSV hỗ trợ dấu phẩy/dấu ngoặc kép, kiểm schema/metadata/hash/FK/số dư, **không ghi database** |
| P03 | [s2-create-xlsx.py](s2-create-xlsx.py) | Script tái tạo workbook Excel bằng artifact_tool; workbook mẫu đã được tạo riêng ở cuộc trò chuyện, **chưa commit binary XLSX** |
| P04 | [fixtures/F0.json](fixtures/F0.json), [F1.json](fixtures/F1.json), [F2.json](fixtures/F2.json) | Bộ dữ liệu giả lập quy mô smoke/reference/volume, đa tenant tách nguồn |
| P04 | [golden-oracles.json](golden-oracles.json) | Expected oracle AC-03/19/20/21 kế thừa R009, có trạng thái \`MODEL_ONLY\` |
| P04 | [trip-scenarios.json](trip-scenarios.json) | 343 trường hợp chuyến độc lập liên kết SKU, trip, Customer, tồn/cost, AR/custody |
| P04 | [fixture-manifest.json](fixture-manifest.json) | Seed và SHA-256 của các file fixture/source trong gói; không phải chữ ký/evidence pháp lý |
| P04 | [s2-data-tool.mjs](s2-data-tool.mjs), [s2-trip-scenarios.mjs](s2-trip-scenarios.mjs) | Công cụ Node.js để tái lập/kiểm dữ liệu và các mô hình trước–sau |
| QA | [.github/workflows/s2-synthetic-validation.yml](../../../.github/workflows/s2-synthetic-validation.yml) | GitHub Actions chạy Node validation/CSV dry-run và lưu báo cáo kỹ thuật |

Đọc [hướng dẫn nhập liệu](import-template-guide.vi.md), [quy tắc chất lượng/đối soát](data-quality-and-reconciliation.vi.md), [kịch bản giả lập](reference-scenarios.vi.md) và [kết quả kiểm chứng](validation-results.vi.md). Các ví dụ chỉ mô phỏng, không có người ký xác nhận NPP.

## 2. Phạm vi định lượng

| Dataset | Tenant | SKU | Customer | Outlet | Trip | Thuộc tính bắt buộc |
|---|---:|---:|---:|---:|---:|---|
| F0 — Smoke | 1 | 12 | 6 | 4 | 3 (A/B/mixed) | Ít nhất 2 Customer không Outlet; hàng và nguồn ledger |
| F1 — Reference | 1 | 50 | 40 | 55 | 40 | 8 chuyến/ngày × 5 ngày, 3A+3B+2mixed theo **mẫu NPP-01** |
| F2 — Volume/Fault | 3 | 360 | 240 | 300 | 300 | 3 tenant ID độc lập; chuyến/thiết bị/trạng thái synthetic |

- \`F1\` chỉ mô phỏng **hình dạng** kế hoạch NPP-01; không được coi đã vận hành pilot thực tế.
- \`F2\` là đầu vào cho kiểm thử tải/lỗi trong S3/S6, **không phải benchmark throughput** hoặc bằng chứng tenant isolation ở SQL.
- Các file \`trip-scenarios.json\` được kiểm toán theo **snapshot mở riêng từng scenario**; không được cộng 343 scenario thành một sổ tồn kho tuần tự. Oracle AC-03 lớn (A40/B30) cũng là scenario tách biệt với các scenario đơn giản.
- DMS price/cost example không phải bảng giá thực, thuế suất giả lập AC-19 8%/10% không được dùng như thuế suất mặc định.

## 3. Tái tạo và kiểm tra

Cần Node.js >=20 để chạy script. Trong repository checkout, đặt:

\`\`\`bash
S2=reports/2026-11-13-10-product-reference-go-live-blueprint/s2
node "$S2/s2-data-tool.mjs" validate "$S2"
node "$S2/s2-trip-scenarios.mjs" validate "$S2"
node "$S2/s2-import-dry-run.mjs" --self-test
node "$S2/s2-data-tool.mjs" generate /tmp/s2-generated
node "$S2/s2-import-dry-run.mjs" /tmp/s2-generated/fixtures/F0 --report /tmp/s2-dry-run.json
\`\`\`

Công cụ \`generate\` xuất 14 CSV cho mỗi F0/F1/F2 và 14 CSV mẫu ví dụ từ F0 vào thư mục được yêu cầu. Các \`.json\` fixture chuẩn đã commit, mã hóa giá trị nguồn trong chuỗi và có manifest để tái lập. \`preview\` cũ trong \`s2-data-tool.mjs\` đã vô hiệu để tránh parser CSV đơn giản; dùng \`s2-import-dry-run.mjs\` với quote parsing chặt.

Với Python có \`artifact_tool\`:

\`\`\`bash
python "$S2/s2-create-xlsx.py" /tmp/S2_NPP_Import_Templates.xlsx
\`\`\`

Workbook này là form hỗ trợ nhập liệu và tra từ điển; **không thay đầu ra kiểm tra CSV/dữ liệu**. Người dùng không được bấm \`GO\` từ file mẫu hay coi example provider là thật.

## 4. Trạng thái chất lượng và cổng còn mở

- Kết quả mô hình và Node CI synthetic: **PASS** theo [báo cáo S2](validation-results.vi.md). Hash canonical, FK, source, balances và expected AC được kiểm trên mẫu giả lập.
- S1 Product ADR (PADR-01..09) vẫn \`PROPOSED_FOR_OWNER_REVIEW\`; S2 không phê chuẩn default/config mới.
- \`B-CASE/LEGAL-MEMO/EV-10\`, writer độc quyền toàn kho, offline/revoke/restore E2E, cutover, mapping nhà cung cấp kế toán và ký số dư NPP thật vẫn **PENDING**.
- \`P03\` đã có template CSV + generator Excel + validator dry-run; \`P04\` đã có fixture/model/reconciliation checks. Cả hai **chưa đủ** để tuyên bố \`TENANT_GO_LIVE_ACCEPTED\`.

**Đánh giá:** S2 có thể bàn giao làm đầu vào S3 test/acceptance và S5 onboarding gap. NPP thật phải được phép dùng dữ liệu và ký xác nhận riêng trước bất kỳ import production nào.
