> **Effective Owner Q01 v2 — 14/11/2026:** MyDms đã được Owner chuyển định hướng từ **Private/Proprietary sang Public/Open Source MIT**. [Hồ sơ thay đổi Q01](s6-0-owner-q01-mit-amendment.json) · [GitHub/CI observation](s6-0-mit-source-observation.json). [MyDms PR #1](https://github.com/chung6a8m/MyDms/pull/1) đã có LICENSE MIT trên source branch, [source CI #43552194768](https://github.com/chung6a8m/MyDms/actions/runs/43552194768) **SUCCESS (foundation only, 5 jobs)** tại `b4683f84248b`; **chưa merge MIT vào main**. B04 secure evidence/safety vẫn pending; Gate A/B BLOCKED; không TADR approval hay EV real. Các đoạn nói Q01 Private bên dưới là **historical** và bị thay thế bởi Q01 v2, không phải chính sách hiện hành.

> **Cập nhật thực thi B00–B04 (14/11/2026):** GitHub đã xác minh `chung6a8m/MyDms` **PRIVATE**; `main` và source bootstrap [MyDms PR #1](https://github.com/chung6a8m/MyDms/pull/1) Draft đã có. Candidate source SHA `b0e2434b4639e233e019edb12443206328233ad4`. [Initial CI run #43548426310](https://github.com/chung6a8m/MyDms/actions/runs/43548426310) **FAILURE với 4 jobs không chạy bước nào**; nguyên nhân runner/Actions chưa rõ, xem [MyDms Issue #2](https://github.com/chung6a8m/MyDms/issues/2). B01–B04 candidate/partial; B05/B06 NOT_STARTED; Gate A/B vẫn **BLOCKED**. [Source observation](s6-0-source-bootstrap-observation.json) ghi provenance; không có real runtime EV.

# S6-0 — Foundation Bootstrap & Technical Spike plan (Owner Q01–Q08)

**Ngày:** 14/11/2026 · **Status:** `OWNER_DIRECTION_RECORDED / PLAN_ONLY / NOT_EXECUTED`.

**Đầu vào:** [8 quyết định Owner](s6-0-owner-engineering-decisions.json), [Issue #4](https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/issues/4), Product C′ `eb9c4b04e334530367b80ea4178edb4dd4a07491` và Acceptance R `e47c3feb44c02a0fdf46c35f6c4b2f57c4365470`. Không sửa các baseline này.

## A. Điều đã chọn và điều chưa đạt

- **Owner:** D / `chung6a8m/MyDms`, **Public/MIT (Q01 v2)**, monorepo; .NET 10 + SQL Server + React/TypeScript; Modular Monolith độc lập + database-per-tenant; Business Module-First / Clean Architecture; CI phân tầng; Solo Owner merge sau CI; hai cổng có spike trước TADR review.
- **GitHub tại lúc ghi nhận:** repo tồn tại, admin có quyền, **PUBLIC và rỗng** (branches `[]`, `main` chỉ là default-branch metadata). **Không được claim repo đã Private hoặc CI đã sẵn sàng.**
- **Chưa được chọn:** ORM/data access, migration engine, transaction isolation, UoW/concurrency, identity implementation, durable ACK protocol, hosting/cloud, provider/accounting runtime, retention/RPO/RTO; review theo TADR tương ứng.
- **Chưa có:** current branch/README/CI, private visibility verified, actual maintainer/role-scoped reviewers, branch rules, isolated environment, approved fault-safety plan, private evidence store, TADR technical approvals, real-system evidence. Không đồng nhất solo GitHub merge với independent reviewer signatures.

## B. Roadmap công việc thực thi (đề xuất — chưa chạy)

| ID | Phạm vi | Việc làm cụ thể | DoD kiểm chứng và dependency |
|---|---|---|---|
| **B00 — MIT source policy** | Repo governance | GitHub Public theo Q01 v2; thêm MIT LICENSE/NOTICE/README trên PR, review/merge trước khi khai MIT trên `main`; giữ secrets/data nhạy cảm ngoài Git | Source PR exact-HEAD CI PASS; Owner merge MIT rồi đối chiếu `main` và GitHub license metadata |
| **B01 — Source bootstrap** | Foundation | Sau B00, tạo `main`, README, `AGENTS.md`, `.editorconfig`, `.gitattributes`, `.gitignore`, `global.json`, `.slnx`, NuGet settings và workspace React/Vite/TS; skeleton API/Domain/Application/Infrastructure/Tests, không code nghiệp vụ thật | Fresh clone restore/build/typecheck PASS, source repo SHA và reproducible toolchain được lưu |
| **B02 — Architectural boundaries** | Product-first modular monolith | `src/server/Host`, `Platform/{Tenancy,Identity,Authorization,Auditing}`, `Modules/{Catalog,Customers,Inventory,Trips,Sales,Settlement,Integrations}`, `apps/{admin-web,field-pwa}`, `contracts`, `tests`; module folders là kiến nghị, chỉ tạo projects có nhu cầu. Public contracts không lộ EF/SQL/HTTP internals | Architecture tests cấm Domain→Infrastructure/API, frontend→database, module→foreign persistence; quyền ghi cross-module phải qua application coordinator/transaction design review |
| **B03 — CI layered** | GitHub Actions | PR: formatting, restore/build, TypeScript typecheck, unit, architecture, contracts; scoped SQL: disposable SQL Server instance, migration/smoke, transaction/idempotency, fail on skipped mandatory tests; milestone: API/Playwright/PWA/fault/recovery. Dùng pin dependency và secret tối thiểu | CI PASS đúng source SHA trên PR; không coi lint/synthetic PASS thay SQL/provider/browser evidence; xác thực runner/SQL version thực |
| **B04 — Safe test evidence** | QA/Ops/Security | Setup SQL test identity least privilege, synthetic fixtures, safe fault-injection allowlist, secure external artifact store; log/hash metadata `testRunId, buildSha, schemaVersion, mode, tenantId, fixtureHash, expected/actual, before/after ledger, artifactSha256, reviewer` | Có runbook, cleanup, access/retention, không chứa PII/credential thật trong Git; thiếu reviewer/actual giữ `NOT_RUN` hoặc `EXECUTED_UNREVIEWED` |
| **B05 — Spike TADR-01** | SQL sandbox, **không phải runtime chính thức** | Một transaction kiểm Stock MAIN/TRIP/lot + AR/custody/advance/CustomerCredit theo command/source line; lock/rollback/concurrency; moving-average SKU×location và correction; two-tenant isolation negative test | Reproducible SQL scripts/tests + actual diff theo source event, trade-offs/isolation/index/schema alternatives; failed cases giữ nguyên; không tuyên bố EV-03/06/07 PASS |
| **B06 — Spike TADR-02** | API/SQL sandbox, **không phải runtime chính thức** | Canonical command/effect ID + payload hash, durable inbox/outbox, commit-before-ACK, retry/lost HTTP response, same-key/different-hash conflict, concurrent claims, recovery replay | Test source SHA, DB rows/outcome, F-01/10/15 relevant cases, alternatives and failure analysis; không tự chuyển online test thành offline grant EV-08/09 |
| **B07 — Technical review** | TADR-01/02 | Engineering/Technical/QA và Finance với ledger review các artifacts/spikes, options, rejected alternatives, risks, source refs, CI/negative evidence; quyết định riêng có version+approval ref bởi người thật | `DESIGN_CANDIDATE` chỉ đổi sau review đúng thẩm quyền; khi chưa có reviewer, `BLOCKED_PENDING_REVIEW` dù Owner đã merge spike/CI |
| **B08 — Gate B assessment** | S6-0 → S6-A | Đối chiếu private repo, ownership, required CI, SQL test harness, evidence store, no P0 waiver, reviewer/TADR approvals và Owner authorization; ghi decision | `S6-0_READY_FOR_SOURCE_SLICE` chỉ sau gate pass và quyết định có căn cứ. Không tự mở mode/tenant Go-Live/Product Verified |

**Phụ thuộc:** B00 → B01 → B02/B03/B04 → B05/B06 (có thể song song sau khi safety prerequisites đạt) → B07 → B08. B05/B06 chỉ dùng dữ liệu synthetic và isolated nonproduction; không cấp production credentials. B00 là áp dụng MIT theo Q01 v2; vẫn ưu tiên bảo vệ dữ liệu và secrets ngoài mã nguồn.

## C. Cấu trúc gợi ý cho `MyDms`

```text
MyDms/
  MyDms.slnx
  src/server/Host/MyDms.Api/
  src/server/BuildingBlocks/
  src/server/Platform/{Tenancy,Identity,Authorization,Auditing}/
  src/server/Modules/{Catalog,Customers,Inventory,Trips,Sales,Settlement,Integrations}/
  apps/admin-web/
  apps/field-pwa/
  contracts/openapi/
  tests/{architecture,unit,integration-sql,api-e2e,pwa-e2e}/
  docs/{adr,evidence,runbooks}/
```

Đây là tree **dự kiến**, không phải bằng chứng đã tạo project. Domain/Application/Infrastructure/Contracts phân tầng **bên trong các module** và tách assemblies theo nhu cầu thực tế; giữ shared kernel nhỏ, không dựng microservices hoặc database riêng cho từng module. Tenant DB độc lập theo **tenant**, Platform DB riêng cho registry/authority/lifecycle; schema/index/ownership và transaction cross-module phải review TADR-01.

## D. Git governance theo Q07/Q08

- Feature branch + PR và CI tương ứng cho source; Owner được merge PR bootstrap sau CI theo solo workflow. Required checks/branch protection phụ thuộc khả năng thực tế của tài khoản GitHub và phải được xác minh, không giả định đã cấu hình.
- Không tự tạo approval giả của Technical, QA, Finance; `owner merge` khác `technical acceptance`. Nếu TADR chưa được phê duyệt, chỉ cho phép spike cô lập, không được đưa vào production runtime.
- Cần review dependency/license của mọi source tái sử dụng từ SaasOne/MyDmsVn, đặc biệt Orchard-specific code. Không kế thừa CI evidence/M5/Web evidence thành EV-01..15.
- PR #3 repository nghiên cứu vẫn Draft, chỉ chứa tài liệu S6 công khai, không commit source độc quyền, thông tin tenant thật, secrets hay raw evidence.

## E. Cổng nghiệm thu

**Gate A (conditional authorization):** Owner đã chấp thuận phương pháp bootstrap/spike; **chưa READY** cho chạy vì repo vẫn Public và sandbox chưa provision. Sau khi B00–B04 đủ bảo vệ mới chạy B05/B06.

**Gate B (authorization for S6-A product runtime):** TADR-01/02 review/approval thật, giải quyết blocker critical, isolated SQL/API suite có provenance, quyền truy cập và QA/Finance dispositions, Owner cho phép. **Hiện BLOCKED/PENDING.**

Giữ `G-STOCK/G-CUT/G-IDEMP/G-LEDGER/G-INV` **P0 nonwaivable**; `B_NO_CHANNEL=BLOCKED`; `OFFLINE_WRITE/PRODUCTION_CUTOVER=DISABLED_PENDING`; real EV-01..15 pending. `DOC_READY ≠ PRODUCT_VERIFIED ≠ TENANT_GO_LIVE_ACCEPTED`.
