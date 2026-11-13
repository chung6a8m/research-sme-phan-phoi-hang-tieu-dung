# R010 — Owner Decision Register v1 (13/11/2026)

**Nguồn:** 16 câu trả lời phê duyệt rõ ràng của Owner trong chuỗi phỏng vấn PADR/EVQ ngày 13/11/2026. **Loại hồ sơ:** quyết định chính sách Product + tiêu chí nghiệm thu, không phải kết quả chạy test hoặc chữ ký Finance/Legal/Provider.

**Trạng thái:** OWNER_DECIDED_IN_CHAT. ownerDecisionDate = 2026-11-13; approver = Owner của dự án, xác nhận bằng câu trả lời trong hội thoại. Không bịa acceptedAt có giờ phút, chữ ký số hoặc thời điểm ký riêng chưa có chứng cứ. Khi lập acceptance record có chữ ký/timestamp riêng phải bổ sung nguồn thật và version mới.

## 1. Product ADR đã lựa chọn

| decisionId | Phương án | Chính sách được Owner chấp nhận | Trace chính |
|---|---|---|---|
| PADR-01 | 1 | Product-First; L0 bất biến, L1 cấu hình giới hạn, L2 exception có kiểm soát. | POL-01..24 / S5 |
| PADR-02 | 3 | Credit terms/limit mặc định UNSET và fail-closed; APPROVED=0 phải có nguồn phê duyệt, không đồng nhất hai trạng thái. | CFG-05/06, T02, AC-08/09, EV-06 |
| PADR-03 | 1 | Mode admission riêng server-side theo build/tenant/profile/scope/AC/EV; requested không tự mở mode. | CFG-07/16/18, EV-10/14 |
| PADR-04 | 1 | Năm price families hữu hạn, Decimal, phân bổ line-stable, ngoại lệ có duyệt. | CFG-11/12, EV-05/10/11 |
| PADR-05 | 1 | Kiêm nhiệm role được phép; maker–checker độc lập theo approval class. | AP-01..10, EV-06/12 |
| PADR-06 | 1 | Hiển thị độc lập local/sync durable, business post, invoice, accounting, reconciliation, case; UI theo role. | BR-16/18/19/23, EV-08/11/13 |
| PADR-07 | 1 | Offline mặc định tắt, grant theo mode/trip/device, TTL/cap do Ops phê duyệt sau E2E. | CFG-16/17/18, EV-08/09/10 |
| PADR-08 | 1 | Daily close có CLOSED_WITH_OPEN_CASES, asOf/sourceCompleteness/n/N, owner và next action. | POL-23, EV-12/14/15 |
| PADR-09 | 1 | Product Pilot Contract + Tenant Pilot Profile, D-15 NPP-01 giữ 3A+3B+2Mixed/ngày ≥5 ngày. | CFG-22, EV-14/15 |

## 2. EVQ — Quyết định về tiêu chí kiểm chứng, không phải evidence PASS

| decisionId | Phương án | Chính sách được Owner chấp nhận | Evidence/gate giữ pending |
|---|---|---|---|
| EVQ-01 | 1 | Hai cổng Product Verification và Tenant Go-Live Acceptance, phê duyệt per-mode. | EV-01..15 |
| EVQ-02 | 1 | P0 không miễn; P1 exception có scope/timebox/owner/compensating control, không nâng FAILED/PENDING lên PASS. | G-STOCK/G-CUT/G-IDEMP/G-LEDGER/G-INV |
| EVQ-03 | 1 | Cutover sạch toàn Kho-01; legacy writer khóa, opening ký, Forward Recovery; test E2E. | EV-04/12 |
| EVQ-04 | 1 | Offline E2E theo mode/device/browser/OS: journal/ACK, replay, revoke, lost-device, restore. | EV-08/09/10 |
| EVQ-05 | 2 | MVP A, B_ONLINE và MIXED dùng B_ONLINE; hoãn nhánh B cần kênh hóa đơn thay thế lúc PWA mất mạng; B_NO_CHANNEL BLOCKED. | EV-10/B-CASE/LEGAL-MEMO/INV-09 |
| EVQ-06 | 1 | Ba sổ, CustomerCredit, giá/cost và kế toán E2E; API/FILE/MANUAL_REGISTER phải trace/verify/reconcile. | EV-05/06/07/11 |
| EVQ-07 | 1 | Pilot risk-based, UX-01..08, n/N/SLO/coverage; ngưỡng ký trước EV-14, EV-15 đo thực. | EV-13/14/15 |

## 3. Ranh giới quyết định

- Product Approval: quyết định 9 PADR/7 EVQ, có phiên bản và phạm vi; cho phép chuẩn hóa policy, phát triển và kiểm thử.
- DOC_READY: tài liệu/CFG/schema/SOP/trace và synthetic validator qua review; không phải chứng nhận ứng dụng.
- Product Verification: cần testRunId, buildSha, PWA/API/SQL/thiết bị/provider/accounting, actual/expected, concurrency/replay/recovery, người xác nhận.
- Tenant Go-Live: seller/tenant/mode/scope, legal/Finance/provider, cutover/one-writer, opening ký, pilot đạt theo ngưỡng đã duyệt; chỉ mở các mode đạt gate.
- Owner không được miễn P0 hoặc yêu cầu pháp lý. P1 exception hợp lệ cần exceptionId, scope, owner, expiry, compensating control, remediation, reviewer và decision. OWNER_ACCEPTED_EXCEPTION không làm evidence FAIL/PENDING thành PASS.

## 4. Những hệ quả cần cập nhật đồng bộ

- PADR-02 là thay đổi khác đề xuất 0/0 cũ. UNSET nghĩa thiếu chính sách; fail-closed như credit limit 0 nhưng khác APPROVED=0 có approval; cập nhật CFG-05/06, TenantProfile, T02, template/validator/fixture.
- EVQ-05 là ranh giới MVP: A và B_ONLINE, MIXED dùng B_ONLINE; B sử dụng kênh hóa đơn thay thế lúc PWA mất mạng deferred; B_NO_CHANNEL BLOCKED. Không suy bán B offline là trái pháp luật nói chung; chỉ thiếu evidence để mở phạm vi này.
- Offline A chỉ được mở sau EV-08/09 E2E theo thiết bị/mode. Không dùng offlineEnabled để tự mở B invoice branch.
- NPP-01 D-15 không thay đổi: 3A+3B_ONLINE+2MIXED/ngày, ít nhất 5 ngày nếu mode tương ứng đủ gate; thay mẫu Pilot phải có Owner version riêng trước khi chạy.
- Pricing giữ rule families hữu hạn/Decimal, cost DMS bình quân di động SKU×location và kế toán bình quân kỳ; adapter API/FILE/MANUAL_REGISTER phải cùng immutable source IDs/POSTED/reconciliation.

## 5. TADR và điều kiện hệ thống thật chưa đạt

| TADR | Việc kỹ thuật chưa được chốt | Evidence |
|---|---|---|
| TADR-01 | SQL schema/transaction/locking kho và ba sổ, moving average, source corrections | EV-03/06/07 |
| TADR-02 | Hash/idempotency, durable inbox/outbox, ACK, retry, dependency, recovery journal | EV-08/11 |
| TADR-03 | Invoice A/B_ONLINE và accounting API/FILE/MANUAL_REGISTER; provider UNKNOWN/lookup | EV-10/11 |
| TADR-04 | Revocation/Privacy/Generation ngoài rollback, RPO/RTO, restore | EV-01/08/09 |
| TADR-05 | Full legacy writer inventory, opening/preview/lock/Forward Recovery | EV-04/12 |
| TADR-06 | UX/SLO/n/N/case age, metrics và ngưỡng ký trước Pilot | EV-13/14/15 |

**Status:** TADR-01..06 vẫn DESIGN_CANDIDATE. EV-01..15 vẫn EVIDENCE_PENDING hoặc MODEL_ONLY/real pending theo R009; B-CASE-001/002/003 và LEGAL-MEMO EVIDENCE_PENDING, INV-09 NOT_RUN. Không có test thật/seller/provider/pilot được chứng nhận bởi quyết định trong file này.

Xem [EVQ Acceptance Gates](evq-acceptance-gates.vi.md) và [R009 Acceptance/Evidence](../2026-11-13-09-mvp-specification-baseline/acceptance-tests-and-evidence.vi.md).
