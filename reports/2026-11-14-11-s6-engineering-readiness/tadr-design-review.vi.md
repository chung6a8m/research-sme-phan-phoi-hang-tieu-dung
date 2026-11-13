# S6 — TADR-01..06: Design review queue

**Không chấp nhận kỹ thuật bằng cách suy ra từ Product Approval.** Sáu TADR trong R009/R010 hiện DESIGN_CANDIDATE; Engineering cần phương án, trade-off, reviewer, test contract và quyết định có phiên bản riêng trước khi dùng làm kiến trúc sản phẩm.

| ID | Câu hỏi kỹ thuật phải chốt | Reviewers | Exit evidence |
|---|---|---|---|
| **TADR-01 Transaction & Ledgers** | SQL schema/transaction/isolation cho stock MAIN/TRIP/lot, AR/custody/advance/CustomerCredit; moving average SKU×location, correction/period close | Engineering, Finance, QA | AC-03/06/09/10/20/21; EV-03/06/07, concurrency và per-source invariant |
| **TADR-02 Durability & Idempotency** | Canonical command/effect IDs+hash, durable inbox/outbox/ACK, retry, duplicate vs hash conflict, dependency/recovery worker | Engineering, QA | AC-09/11/12/15; EV-08/11; F-01/10/15 |
| **TADR-03 External Adapters** | Invoice seller/provider/channel, UNKNOWN lookup, API/FILE/MANUAL_REGISTER accounting, POSTED/read-back/reconciliation | Engineering, Legal, Provider, Finance | AC-14/15/19; EV-10/11; external ref/hash, duplicate prevention |
| **TADR-04 Authority & DR** | Epoch/generation anchor, revoke/PrivacyActionLedger, external effects outside TenantDB rollback; restore/losing device | Security, Ops, Legal, QA | AC-01/12/13; EV-01/08/09; F-06/14/22 |
| **TADR-05 Cutover & Recovery** | Full Kho-01 legacy writer fencing, opening manifest, late-source events, firstEffectId and forward-only recovery | Warehouse, IT, Finance, QA | AC-04/16; EV-04/12, C0..C8 actual rehearsal |
| **TADR-06 Quality & Pilot Metrics** | UX-01..08/n/N/coverage, product vs tenant SLO/threshold, severity, measured RPO/RTO and approvals before EV-14 | QA, Operations, Product, Tenant Owner | AC-17/18; EV-13/14/15, threshold approval before Pilot |

## Đầu ra cho mỗi quyết định thực

- TADR id/version, options considered, selection, rationale, alternatives rejected, risks, trade-off.
- Owner role, real signer and authority, approval URL/timestamp, affected BR/POL/SOP/DC/API/SM/AC/EV/gates, affected build/schema.
- Negative tests and evidence strategy; status DESIGN_CANDIDATE → REVIEWED/APPROVED **chỉ sau** dấu vết của người có thẩm quyền.
- Runtime tests, vendor contracts, legal/tenant approvals độc lập; TADR approval không biến EV thành PASS.
- Nếu ảnh hưởng Product L0/P0 hoặc commercial semantics, làm Product Change Control và Owner review C-new; không sửa C′ đã ký.

## Trình tự đề xuất

TADR-01/02 trước S6-A; TADR-03 trước B_ONLINE integration; TADR-04 trước Offline A/DR; TADR-05 trước cutover rehearsal; TADR-06 trước EV-14/Pilot. Không quyết định mặc định .NET/React/SQL/host/provider từ repo nghiên cứu này.

**Status hiện tại: 0/6 TADR approved** (đúng snapshot R).
