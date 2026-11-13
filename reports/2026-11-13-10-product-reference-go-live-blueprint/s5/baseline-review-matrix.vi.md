# S5 — Baseline Review Matrix (Q06/Q09)

**Status: `PENDING_REVIEW` trên commit cuối sẽ trình ký.** Ma trận này ghi nghĩa vụ review, **không** ghi rằng một người hay tổ chức đã ký. Bản máy đọc được: [baseline-review-matrix.json](baseline-review-matrix.json).

| Vai trò | Trước Owner baseline sign-off | Kiểm tra bắt buộc | Trạng thái |
|---|---|---|---|
| PRODUCT_BA — Product/BA | REQUIRED_BEFORE_OWNER_SIGNOFF | S1/PADR/EVQ Q01..Q20, 24 POL/CFG, 12 SOP, D→BR→DC/API/SM→AC/EV; tenant-adoption and pilot boundaries | `PENDING_REVIEW` |
| TECHNICAL — Technical | REQUIRED_BEFORE_OWNER_SIGNOFF | Schema/CSV/validators, transaction boundaries pending TADR, source anchor consistency, read-only S3/S4, mode and cutover policies | `PENDING_REVIEW` |
| QA — QA | REQUIRED_BEFORE_OWNER_SIGNOFF | S1-S5 synthetic CI on final HEAD, negative regression, 14 reviewed blobs, S5 whole-tree snapshot plan, outstanding vs evidence semantics | `PENDING_REVIEW` |
| FINANCE — Finance | REQUIRED_BY_Q09_SIGN02_BEFORE_OWNER_SIGNOFF | Credit UNSET/approved-zero, accounting, ledger, cost bridge; actual tenant accounting signoff independent | `PENDING_REVIEW` |
| LEGAL — Legal/Tax | REQUIRED_BY_Q09_SIGN02_BEFORE_OWNER_SIGNOFF | Seller/provider/legal invoice channel, privacy; B-CASE and LEGAL-MEMO remain PENDING | `PENDING_REVIEW` |
| OPERATIONS — Operations/Security | REQUIRED_BY_Q09_SIGN02_BEFORE_OWNER_SIGNOFF | Warehouse writer/DR/offline thresholds/incident/cutover/pilot; real rehearsal and tenant signatures pending | `PENDING_REVIEW` |

## Definition of Done cho review chuyên môn

1. Product/BA xác nhận 16 PADR/EVQ, 20 Q, R009/R010, 24 POL/CFG, 12 SOP, các state/permission boundary và D→BR→DC/API/SM→AC/EV. Không để conflict policy/contract có tính chặn.
2. Technical xác nhận tenant profile/schema, S2 data dictionary/templates/CSV/fixtures, S3/4/5 contracts và TADR vẫn ở đúng trạng thái chưa chốt. Kiểm sự nhất quán credit UNSET/APPROVED=0 và A/B_ONLINE/MIXED.
3. QA kiểm full HEAD commit/stacking sau PR #1, hash và source refs, CI S1–S5, regression âm, P0 gate semantics, review findings P0/P1 còn mở. Chỉ ghi doc readiness khi đã kiểm.
4. Finance/Legal/Ops tham gia nếu nội dung policy/contract thay đổi thuộc thẩm quyền; actual seller/provider/legal/accounting/cutover/pilot approval được giữ trong EV/tenant gates riêng, không được đại diện bằng review tài liệu.
5. Mỗi record review có reviewerRef, reviewedAt lấy từ thực tế, scope/build/document version, finding disposition và link bằng chứng. Các trường chưa có phải giữ null/PENDING.
6. Chỉ sau khi cả ba reviewer bắt buộc hoàn tất và các reviewer điều kiện cần thiết thực sự được xem xét mới trình Owner comment commit C. Owner acceptance không được suy từ CI hoặc file tự khai.

## Trách nhiệm khác sau sign-off

- `TADR-01..06` là DESIGN_CANDIDATE; Engineering đề xuất, Technical/QA review theo từng vertical slice.
- Product Verification per build/mode dùng testRunId/PWA/API/SQL/provider/accounting thật; Tenant Go-Live đòi chữ ký Finance/Warehouse/Legal/Operations/Owner theo gate.
- Các mục `P1_OWNER_ACCEPTED_EXCEPTION` không biến FAILED/PENDING thành PASS; P0 không bao giờ waiver.

## Owner Q09-SIGN-01/02/03 — Candidate C' chưa ký

- Owner kiêm Product/BA, Technical, QA nhưng không đại diện ba người độc lập; phải có ba reviewRef đúng SHA, scope và conclusion riêng. `SIGN-01=2`.
- Finance, Legal/Tax, Operations/Security bắt buộc review hợp đồng thuộc thẩm quyền trước Owner ký. `SIGN-02=1`.
- P0/P1 contract blockers phải được sửa, kiểm chứng S1–S5 trên SHA candidate mới, sau đó review lại theo tác động. `SIGN-03=1`.
- Tất cả reviewer vẫn `PENDING_REVIEW`, không tự điền người ký/timestamp/reviewRef. Product Verification và Tenant Go-Live là gate độc lập.
