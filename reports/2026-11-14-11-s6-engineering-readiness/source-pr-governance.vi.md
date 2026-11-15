> **S6-0 current source status (14/11/2026):** MyDms [PR #1](https://github.com/chung6a8m/MyDms/pull/1) **MERGED** (`66e1609a7aaaa663894a5411a4f41c49ef4e9836`), `main` Public/MIT [recognized by GitHub](https://github.com/chung6a8m/MyDms/blob/main/LICENSE); [foundation main CI #43553550509](https://github.com/chung6a8m/MyDms/actions/runs/43553550509) **5/5 SUCCESS**. MyDms [B04 PR #3](https://github.com/chung6a8m/MyDms/pull/3) **MERGED** (`323e294b148fe8795b666c1efd73c43212efa5c6`), [B04 main CI #43554003740](https://github.com/chung6a8m/MyDms/actions/runs/43554003740) **6/6 SUCCESS** including public-only synthetic evidence validator. [Current source observation](s6-0-main-foundation-observation.json). **B04 private evidence store and actual QA/Ops/Security safety approval PENDING** ([MyDms Issue #4](https://github.com/chung6a8m/MyDms/issues/4)); **Gate A NOT_READY; B05/B06 NOT_STARTED; Gate B BLOCKED**; real EV-01..15 pending. Earlier banners below are snapshots, not current state.

> **Effective Owner Q01 v2 — 14/11/2026:** MyDms đã được Owner chuyển định hướng từ **Private/Proprietary sang Public/Open Source MIT**. [Hồ sơ thay đổi Q01](s6-0-owner-q01-mit-amendment.json) · [GitHub/CI observation](s6-0-mit-source-observation.json). [MyDms PR #1](https://github.com/chung6a8m/MyDms/pull/1) đã có LICENSE MIT trên source branch, [source CI #43552194768](https://github.com/chung6a8m/MyDms/actions/runs/43552194768) **SUCCESS (foundation only, 5 jobs)** tại `b4683f84248b`; **chưa merge MIT vào main**. B04 secure evidence/safety vẫn pending; Gate A/B BLOCKED; không TADR approval hay EV real. Các đoạn nói Q01 Private bên dưới là **historical** và bị thay thế bởi Q01 v2, không phải chính sách hiện hành.

> **Cập nhật thực thi B00–B04 (14/11/2026):** GitHub đã xác minh `chung6a8m/MyDms` **PRIVATE**; `main` và source bootstrap [MyDms PR #1](https://github.com/chung6a8m/MyDms/pull/1) Draft đã có. Candidate source SHA `b0e2434b4639e233e019edb12443206328233ad4`. [Initial CI run #43548426310](https://github.com/chung6a8m/MyDms/actions/runs/43548426310) **FAILURE với 4 jobs không chạy bước nào**; nguyên nhân runner/Actions chưa rõ, xem [MyDms Issue #2](https://github.com/chung6a8m/MyDms/issues/2). B01–B04 candidate/partial; B05/B06 NOT_STARTED; Gate A/B vẫn **BLOCKED**. [Source observation](s6-0-source-bootstrap-observation.json) ghi provenance; không có real runtime EV.

# S6 — Source repository and PR governance

**Cập nhật 14/11/2026:** PR #2 đã MERGED vào `main` (merge `ba6d526b518b877c1f2c9f04732273f9f33968c4`); PR #3 đã retarget base `main` và vẫn Draft. Các dòng về stacked branch dưới đây là *quy trình trước khi merge*, không còn là trạng thái hiện hành.

## 1. Repository source đã chọn, foundation chưa sẵn sàng

Repository nghiên cứu cung cấp S1–S5 policies/templates/evidence contracts, **không xác nhận có app runtime**. Owner đã chọn **D / `chung6a8m/MyDms`**, Q01 v2 Public MIT (supersedes Private/Proprietary), Q02 monorepo và Q03–Q08 theo [hồ sơ versioned](s6-0-owner-engineering-decisions.json). GitHub xác nhận repo Public, đã có `main`, source PR Draft và 5-job foundation CI SUCCESS trên HEAD mới; không có runtime E2E. [Source comparison](s6-0-source-repository-evaluation.vi.md) và [candidate JSON](s6-0-source-repository-decision.candidate.json) là lịch sử **trước Owner quyết định**, không phải current state. [Foundation plan](s6-0-foundation-bootstrap-plan.vi.md) đặt LICENSE MIT trên `main` sau merge và giữ raw evidence/credentials riêng; CI/environments/reviewers vẫn pending.

## 2. PR stack và ranh giới

1. **PR #2 R010:** Owner đã ký C′, R chỉ metadata; PR **đã merge thủ công vào main**. Final review COMMENT, không coi là sáu người độc lập; merge không cấp Product Verification.
2. **S6 Engineering Readiness PR:** Draft riêng, **base hiện tại `main`**, diff chỉ chứa tài liệu S6; kiểm lại CI trên HEAD mới trước review. Không merge tự động.
3. **Runtime PRs:** Tách theo S6-A..F tại source repo đã chọn, mỗi PR có TADR/AC/EV/source commit/build scope + tests, QA/Finance/Legal/Ops reviewer và safety plan.
4. **Product Verification / Tenant Go-Live:** làm trên bằng chứng thật theo mode, riêng PR merge, riêng release và riêng mode admission.

## 3. DoR chưa đáp ứng (không tự điền)

| Field | Hiện tại | Quyết định cần có |
|---|---|---|
| Source repo & branch controls | OWNER_SELECTED / PUBLIC_EMPTY / BRANCH_UNVERIFIED | Engineering chuyển Private, init main, CI/rules |
| Runtime stack / DB transaction | TADR-01 DESIGN_CANDIDATE | Technical + QA/Finance |
| Durability/ACK/sync | TADR-02 DESIGN_CANDIDATE | Engineering + QA |
| Invoice/Accounting provider & method | TADR-03, external unverified | Legal/Finance/Provider |
| DR/authority/Offline grants | TADR-04, thresholds UNSET | Security/Ops |
| Cutover Full Kho-01 | TADR-05, not rehearsed | Warehouse/Finance/IT |
| Pilot SLO/UX/RPO/RTO/retention | TADR-06, thresholds UNSET | QA/Ops/Tenant Owner |
| Devices/data/operations roster | NOT_COLLECTED | Authorized tenant roles |

## 4. Q07 solo merge vs Q08 technical review

Q07 Owner có thể merge PR bootstrap sau **applicable CI PASS**, không mặc định yêu cầu GitHub reviewer độc lập cho **mọi PR**. Tuy nhiên, tự merge không phải Technical/QA/Finance independent approval. Q08 chỉ mở technical spike B05/B06 trong sandbox đã phê duyệt sau Gate A; `TADR-01/02` chưa được review đúng vai trò thì Gate B **BLOCKED**. Không sử dụng CI synthetic/fake runner để nâng EV/Go-Live. Không thay C′ bằng source decisions.

## 5. Source PR acceptance

Every PR must tie approved C′, decision, specific TADR/AC/EV, negative tests and real evidence provenance. Contract changes require impact analysis and versioned Product ADR/Owner approval, not silent amendment of C′. Use environment and tenant-scope gates; preserve secure raw artifacts outside public repository.

## 6. Final review PR #2 P2 follow-up

Đã chuẩn bị **post-signoff R read-only validator** `s6-owner-acceptance-audit.mjs` để kiểm actual GitHub Owner/comment author/timestamp/SHA, sáu reviewerRefs, năm dispositions và CI trên C′. Cần exact-HEAD workflow PASS và QA review mới có thể đóng P2; S5 pre-signoff tests vẫn chỉ xác nhận unsigned candidates, **not signed R**. JSON alone cannot authenticate signatures. This improvement is nonblocking for manually verified document acceptance but should precede automation of future acceptances.

Do not self-merge this readiness PR, create source repos on assumption, certify EV, enable Mode Admission or cutover.
