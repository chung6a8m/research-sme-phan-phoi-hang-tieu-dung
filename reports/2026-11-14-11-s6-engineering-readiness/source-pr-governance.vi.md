# S6 — Source repository and PR governance

## 1. Chưa xác định repository source

Repository nghiên cứu cung cấp S1–S5 policies/templates/evidence contracts, **không xác nhận có app runtime**. Engineering/Owner/QA phải chọn source repo chính thức, môi trường CI, maintainer/reviewer, provider sandbox, data protection trước S6-A. Không tự mặc định MyDmsVn hay các repo đã từng dùng cho dự án khác là sản phẩm NPP mới.

## 2. PR stack và ranh giới

1. **PR #2 R010:** Owner đã ký C′, R chỉ metadata. PR vẫn Draft, final review COMMENT, không auto-merge. Human/branch protection review và merge thủ công theo Q07.
2. **S6 Engineering Readiness PR:** Draft riêng từ R, base là branch PR #2 để thấy diff chỉ chứa tài liệu S6. Sau khi PR #2 merge, retarget và kiểm lại CI/diff trên main.
3. **Runtime PRs:** Tách theo S6-A..F tại source repo đã chọn, mỗi PR có TADR/AC/EV/source commit/build scope + tests, QA/Finance/Legal/Ops reviewer và safety plan.
4. **Product Verification / Tenant Go-Live:** làm trên bằng chứng thật theo mode, riêng PR merge, riêng release và riêng mode admission.

## 3. DoR chưa đáp ứng (không tự điền)

| Field | Hiện tại | Quyết định cần có |
|---|---|---|
| Source repo & branch controls | NOT_SELECTED | Owner + Engineering |
| Runtime stack / DB transaction | TADR-01 DESIGN_CANDIDATE | Technical + QA/Finance |
| Durability/ACK/sync | TADR-02 DESIGN_CANDIDATE | Engineering + QA |
| Invoice/Accounting provider & method | TADR-03, external unverified | Legal/Finance/Provider |
| DR/authority/Offline grants | TADR-04, thresholds UNSET | Security/Ops |
| Cutover Full Kho-01 | TADR-05, not rehearsed | Warehouse/Finance/IT |
| Pilot SLO/UX/RPO/RTO/retention | TADR-06, thresholds UNSET | QA/Ops/Tenant Owner |
| Devices/data/operations roster | NOT_COLLECTED | Authorized tenant roles |

## 4. Source PR acceptance

Every PR must tie approved C′, decision, specific TADR/AC/EV, negative tests and real evidence provenance. Contract changes require impact analysis and versioned Product ADR/Owner approval, not silent amendment of C′. Use environment and tenant-scope gates; preserve secure raw artifacts outside public repository.

## 5. Final review PR #2 P2 follow-up

A read-only **post-signoff R authenticity/semantic validator** should compare actual GitHub comment author/timestamp/SHA, six reviewerRefs, five dispositions and CI on C′ and R; S5 pre-signoff tests intentionally validate unsigned candidates, **not signed R**. JSON alone cannot authenticate signatures. This improvement is nonblocking for manually verified document acceptance but should precede automation of future acceptances.

Do not self-merge this readiness PR, create source repos on assumption, certify EV, enable Mode Admission or cutover.
