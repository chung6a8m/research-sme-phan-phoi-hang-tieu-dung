# S5 — Product Baseline v1 candidate & S6 handoff

## Một bản đóng băng ứng viên, không phải chữ ký

`product-baseline-freeze.candidate.json` là **đề nghị đóng băng** tập tài liệu S1–S5: PADR-01..09, EVQ-01..07 `OWNER_DECIDED_IN_CHAT`, không suy quyết định này thành Product Verification, Tenant acceptance hay vendor/legal sign-off.

**Trước khi đánh dấu Product Baseline v1 OWNER_ACCEPTED:** reviewer đối chiếu phiên bản repo/commit cố định, hashes và trace `D → BR → POL/CFG/SOP → DC/API/SM → AC/EV → test/evidence`; kiểm đủ 24 POL/CFG, 12 SOP, 14 data templates, 21 AC/15 EV/42 BDD/22 faults, 30 OPS, S5 gap/pilot; review P1/P0 open; Owner ghi approvalRef/timestamp có căn cứ. **Không tự đặt acceptedAt, approver hay freeze SHA**. Sau phê duyệt mới tạo bản record bất biến ở commit mới theo workflow kiểm soát.

## Bàn giao triển khai S6: thứ tự khuyến nghị

| Giai đoạn | Điều phải xây và kiểm chứng bằng source thật | Bằng chứng |
|---|---|---|
| S6-A | TADR-01/02, transaction/ledger/idempotency/tenant authority, API/DB test harness; một writer kho và chuyến | AC-01/03/04/09/10/11, EV-01/03/04/06/08 |
| S6-B | Module A online E2E: order-confirm, giao nhiều lần, kho/AR/custody, seller/invoice/accounting adapter | EV-02/04/05/06/07/10/11 |
| S6-C | B_ONLINE có provider channel verified, BQuota/credit ledger/atomicity; MIXED E2E độc lập, không dùng A hold làm BQuota | EV-03/05/06/10/11 |
| S6-D | Offline A theo mode/device/trip, journal/ACK/replay/revoke/restore và F-01..22 sandbox | EV-08/09, TADR-02/04 |
| S6-E | Cutover C0..C8, legacy writer lock **toàn Kho-01**, opening đa bên ký, recovery và legal/privacy preflight | EV-04/09/10/11/12 |
| S6-F | EV-14 readiness có UX-01..08, ngưỡng SLO+n/N ký **trước** pilot; Pilot EV-15 thực ≥5 ngày, Go/No-Go mode riêng | EV-13/14/15 |

TADR-01..06 hiện `DESIGN_CANDIDATE`; các ngưỡng RPO/RTO, latency/UX, retention, vendor/Finance/legal/tenant signatures còn `UNSET` hoặc `EVIDENCE_PENDING`. `B_NO_CHANNEL` BLOCKED, nhánh B alternative-channel khi PWA mất kết nối DEFERRED. P0 không được Owner waive, P1 chỉ exception có hạn và bù trừ kiểm soát.

**Definition of Done S5/P07 tài liệu:** S5 artifacts/schema/test/trace CI đạt; dataset synthetic thể hiện `UNANSWERED`/no-admission; sourceRefs và gapId liên thông S4; freeze manifest là candidate, không giả signed. **Bàn giao S6 ≠ xác nhận software đã triển khai.**

## Reviewed-source anchors (hợp đồng chống sửa âm thầm)

Manifest baseline ứng viên lưu **14 Git blob SHA** cho các đầu vào R009/S1/S2/S3/S4 trọng yếu đã review, gắn `parentReviewedHead=967e7b9`. CI tính lại Git blob ID từ nội dung byte hiện hành và phải thất bại nếu khác; nếu upstream thay đổi, cần đánh giá tác động, cập nhật manifest/trace/acceptance và tạo đề nghị review Owner mới, **không tự cho rằng đã phê duyệt phiên bản mới**. Git blob SHA là định danh nội dung, không phải chữ ký số hay bằng chứng legal/provider.

## Owner Review Q01–Q20 — chuẩn bị hồ sơ, chưa tạo commit C/R

- [Owner Decision Consolidation](owner-baseline-review-decisions.vi.md): đủ Q01..20 đều chọn phương án 1; `OWNER_DECIDED_IN_CHAT` chỉ là nguồn chọn chính sách.
- [Product Governance](product-governance.vi.md): Q13..20 quy định living evidence, artifact store, impact-based reverification, suspend/re-admit, emergency change, migration per tenant, L2 backlog.
- [Review Matrix](baseline-review-matrix.vi.md): Product/BA, Technical, QA reviewer thật + Finance/Legal/Ops theo scope; hiện tất cả pending, không giả source signoff.
- [Outstanding Register](outstanding-register.json): snapshot pending gồm TADR/EV/P0/Legal/B/threshold; review cho S6 thực hiện theo milestone và evidence độc lập.
- [Unsigned acceptance schema/example](product-baseline-acceptance.schema.json): chỉ chuẩn bị hợp đồng, không được điền approvalRef/timestamp/SHA trước GitHub Owner comment.

**Dependency Q12:** PR #1 phải hoàn tất merge trước, PR #2 retarget về main và đánh giá lại diff/upstream hash. Trên HEAD thực, S1–S5 quality gate phải được review rồi mới chốt snapshot **C** toàn bộ cây. Owner ký C bằng comment GitHub trực tiếp; commit **R** ghi nguồn thật, không thay đổi hợp đồng đã ký. Git commit R không tự nhúng chính SHA R vào nội dung.

**Bảo vệ trạng thái:** snapshot candidate chưa được ký, Product Verification/Tenant Go-Live vẫn PENDING, TADR-01..06 DESIGN_CANDIDATE, EV-01..15 real pending, B_NO_CHANNEL BLOCKED. Test governance chỉ chạy contract/synthetic; không mở mode.
