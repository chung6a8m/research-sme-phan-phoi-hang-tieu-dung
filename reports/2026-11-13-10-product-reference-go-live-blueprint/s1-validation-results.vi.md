# R010-S1-VAL — Biên bản kiểm tra cấu trúc tài liệu S1 (không phải E2E)

- **Ngày:** 13/11/2026.
- **Branch:** `research/2026-11-13-product-reference-go-live-blueprint`.
- **HEAD đã đọc:** `e2de94e423b846a0d48afac7528c5852530e6a78` (sau commit nội dung S1, trước sửa câu chữ/ghi báo cáo kiểm tra).
- **Phương pháp:** đọc trực tiếp các file từ GitHub connector, kiểm tra ID/trace, links từ git tree cùng HEAD, JSON parse và một **subset** các thuộc tính JSON Schema (type/const/enum/required/minimum/unique). Chưa chạy lệnh `python .../kiem-tra-s1.py` từ checkout hoặc `jsonschema.Draft202012Validator` trên CI.
- **Kết quả:** `STRUCTURAL_CHECK_PASS` với điều kiện/giới hạn dưới đây; chưa phải `DOC_READY` được Owner chấp nhận.

| Nhóm kiểm | Kết quả tại HEAD được đọc |
|---|---|
| R009 nguồn | 15 D, 24 BR, 18 DC, 12 API, 10 SM, 21 AC, 15 EV có ID |
| S1 artifacts | 12 SOP, 24 POLICY (POL-01–24 đối chiếu BR-01–24 từng ID), 9 PADR |
| Trace | 15 dòng D→POL/SOP/PADR; 24 dòng BR→POL/SOP/DC/API/SM/AC/EV; không thiếu ID hoặc tham chiếu sang ID không tồn tại |
| Coverage | Tất cả SOP-01–12 và PADR-01–09 đều có dòng D/BR tham chiếu |
| Links | 140 liên kết tương đối kiểm tra trên 17 file Markdown/JSON/sources được đọc: 0 liên kết đích file không tồn tại |
| JSON profile | JSON parse thành công; tất cả root/nested required key; enum/type/const/min/max/unique subset đúng; example `DRAFT`+`SYNTHETIC_FIXTURE`, seller null, B no-channel BLOCKED, offline requested false |
| PR boundary | PR #2 còn `Draft`, base là nhánh PR #1; tài liệu nguồn R009 không nằm trong danh sách file thay đổi S1 |

**Đây là phép kiểm theo tập con**, không cam kết validator Python hay toàn bộ JSON Schema Draft 2020-12 đã chạy; khi checkout có thư viện `jsonschema`, chạy `python reports/2026-11-13-10-product-reference-go-live-blueprint/kiem-tra-s1.py` để kiểm đầy đủ ở mức schema/instance. Structural linter kiểm **liên kết và tính toàn vẹn khai báo**, không kiểm business correctness của code.

**Chưa chạy:** unit/integration tests ứng dụng, PWA/browser/IndexedDB, API/SQL, hóa đơn/provider, accounting adapter, crash/replay/restore, P0 writer lock/cutover, test UX native, luật/thuế áp dụng NPP, pilot hoặc ký Go-Live.

**Open review:** PADR-01–09 `PROPOSED_FOR_OWNER_REVIEW`; CFG default `PRODUCT_DEFAULT_PROPOSED`; tenant-specific evidence và Product Owner acceptance **PENDING**. Giữ riêng các gate `DOC_READY`, `PRODUCT_RELEASE_CANDIDATE` và `TENANT_GO_LIVE_ACCEPTED`.
