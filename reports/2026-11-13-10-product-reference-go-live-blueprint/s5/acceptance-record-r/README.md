# Product Baseline v1 — Acceptance Record R

**Approved:** `OWNER_BASELINE_ACCEPTED` at **`PRODUCT_POLICY_AND_CONTRACT_ONLY`** scope. This is a metadata-only, post-signoff record, not a product/tenant verification or production authorization.

| Record | Source |
|---|---|
| Frozen Product Contract C′ | [`eb9c4b04e334530367b80ea4178edb4dd4a07491`](https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/commit/eb9c4b04e334530367b80ea4178edb4dd4a07491) |
| Owner Acceptance | [PR #2 comment #6866595994](https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/pull/2#issuecomment-6866595994), `chung6a8m`, GitHub `created_at=2026-11-13T22:33:42Z` |
| Q09/Q06 reconciliation | [PR #2 comment #6861241541](https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/pull/2#issuecomment-6861241541) |
| Acceptance JSON | [product-baseline-acceptance.record.json](product-baseline-acceptance.record.json), governed by [existing schema](../product-baseline-acceptance.schema.json) |
| Six reviewerRef with actual timestamps | [baseline-review-matrix.json](baseline-review-matrix.json) |
| Five findings `CLOSED_FOR_DOCUMENT_SCOPE` | [findings-disposition.json](findings-disposition.json) |
| Four successful exact-C′ CI runs | [quality-gate.json](quality-gate.json), synthetic/contract only |
| Forty pending S6 items | [outstanding-register.json](outstanding-register.json), acceptance-time snapshot only |

## Source and immutable boundary

Owner explicitly signed C′, Q01–Q20, PADR-01..09 and EVQ-01..07. The Owner GitHub comment — not the metadata record, AI or commit R — is the signature. This pack holds the actual URL, author and GitHub timestamp, not an invented signedAt. R does not self-embed its own SHA.

The **historical pre-signoff candidate files in `../` remain unchanged**, including `baseline-review-matrix.json`, `product-baseline-acceptance.example.json`, `product-baseline-freeze.candidate.json` and `outstanding-register.json`. Their deliberately PENDING values are required by S5 anti-fake-approval regression tests. This folder contains the reconciled *post-signoff* metadata; references from the acceptance JSON resolve to files **in this folder**. No Product Contract/S1–S5 rules, schema, source anchors or validation scripts were modified by R.

## Limits and continuing gates

Six records represent six **role-scoped reviews, not six independent individuals**. One connected Owner GitHub identity posted them via AI on explicit Owner instruction. Owner performed PRODUCT_BA/TECHNICAL/QA roles; FINANCE/LEGAL/OPERATIONS used **Owner-attested consultation and delegation** without independently verified specialist signatures/authorization records. Actual tenant Finance/Legal/Operations/provider/security approvals remain separate.

`OWNER_BASELINE_ACCEPTED != PRODUCT_VERIFIED != TENANT_GO_LIVE_ACCEPTED`. TADR-01..06 `DESIGN_CANDIDATE`; EV-01..15 real `EVIDENCE_PENDING`/`MODEL_ONLY_REAL_PENDING`; zero real E2E evidence in this snapshot. Five P0 gates G-STOCK/G-CUT/G-IDEMP/G-LEDGER/G-INV remain nonwaivable. B-CASE-001..003 / LEGAL-MEMO pending, INV-09 NOT_RUN. A/B_ONLINE/MIXED NO_GO_PENDING; OFFLINE_WRITE/PRODUCTION_CUTOVER DISABLED_PENDING; B_NO_CHANNEL BLOCKED.

R provides no merge authorization, Mode Admission, Product Verification, cutover or Tenant Go-Live. A semantic change to C′ requires a separate controlled candidate, CI and review.
