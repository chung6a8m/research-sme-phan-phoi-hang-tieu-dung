# R010 — EVQ Acceptance Gates v1 (policy Owner-decided; evidence pending)

Căn cứ [Owner Decision Register](owner-decisions-and-evidence-gates.vi.md) và R009 [AC/EV](../2026-11-13-09-mvp-specification-baseline/acceptance-tests-and-evidence.vi.md). Không đánh đồng quyết định Owner với ProductVerification/TenantGoLive.

## 1. Cổng và tiêu chí Go/No-Go

| Gate P0 | Kiểm chứng bắt buộc |
|---|---|
| G-STOCK | Mọi đường ghi legacy của toàn Kho-01 (gồm ngoài Wave 1) bị khóa; EV-04/12 |
| G-CUT | Opening/manifests được đối soát và ký, rehearsal/Forward Recovery; EV-12 |
| G-IDEMP | Không mất/ghi trùng effect; ACK bền, retry, revoke/restore nếu offline; EV-08/09 |
| G-LEDGER | Ba sổ, CustomerCredit, hàng, giá/cost nguồn đúng, không âm hoặc mất cân; EV-05/06/07/11 theo phạm vi |
| G-INV | Seller/provider/tax và kênh hóa đơn được chứng minh cho A/B_ONLINE; B_NO_CHANNEL blocked; EV-10 |

P0 FAIL hoặc chưa có bằng chứng trong phạm vi ⇒ NO-GO phạm vi đó. P1 không phá L0 và không chặn gate có thể được Owner chấp nhận với scope, expiresOn, owner, compensating control, remediation, reviewer và evidence; không chuyển FAIL/PENDING thành PASS.

## 2. Ma trận EVQ

| EVQ | AC/EV | Điều kiện thực thi bắt buộc |
|---|---|---|
| EVQ-01 | EV-01..15 | Product QA/Engineering xác nhận build/test run; Tenant Owner/Finance/Kho/Legal/provider ký phần đúng thẩm quyền, riêng mode. |
| EVQ-02 | Các P0/P1 | P0 không miễn, P1 exception timebox; quy tắc GO/NO-GO theo tenant/build/mode/scope. |
| EVQ-03 | AC-04/16, EV-04/12 | Full warehouse writer lock, opening nguồn/ký, old device events, first effect/forward repair. |
| EVQ-04 | AC-09/11/12/13, EV-08/09 | Real device/browser/PWA/SQL durable ACK, quota/concurrency, revoke, restore, lost device, occurredEvent case. |
| EVQ-05 | AC-14, EV-10 | A/B_ONLINE channel verified, provider UNKNOWN lookup and PXK; B alternative channel deferred; B_NO_CHANNEL blocked. |
| EVQ-06 | AC-06/07/09/10/15/19/20/21, EV-05/06/07/11 | Source-level qty/net/VAT/gross, AR/custody/advance/credit; period cost delta; API/FILE/MANUAL_REGISTER evidence POSTED vs RECONCILED. |
| EVQ-07 | AC-17/18, EV-13/14/15 | UX-01..08, task completion, 3A+3B_ONLINE+2MIXED/day × ≥5 days NPP-01, n/N, latency, case age, support cost; threshold signed before EV-14. |

## 3. Trạng thái bằng chứng giữ nguyên

| Nguồn | Trạng thái nguồn | Runtime status |
|---|---|---|
| EV-01..04 | EVIDENCE_PENDING | Chưa có |
| EV-05..09 | MODEL_ONLY từ nghiên cứu | Real E2E pending |
| EV-10 | EVIDENCE_PENDING | B-CASE/LEGAL-MEMO pending; INV-09 NOT_RUN |
| EV-11..15 | EVIDENCE_PENDING | Chưa có |

Run evidence phải có testRunId, AC/EV, commitSha/buildVersion, environment, tenant/mode/profile, device/provider version, fault injection, expected/actual, delta từng sổ, reviewer và evidence URI. Không cho ghi GO/VERIFIED bằng CSV T14. SLO định lượng = UNSET đến khi Owner và Operations/Finance duyệt trước Pilot.

**Hiện tại:** A/B_ONLINE/MIXED NO_GO/PENDING; OFFLINE_WRITE và PRODUCTION_CUTOVER DISABLED/PENDING; B_NO_CHANNEL BLOCKED. Quy trình tài liệu không mở feature flags hoặc ký Go-Live.
