# S6-0 — Intake checklist và bàn giao source execution

**Status:** `PARTIALLY_PREPARED / OWNER_SOURCE_SELECTION_PENDING`; Product C′ được Owner chấp nhận ở cấp policy/contract, PR #2 merged vào main 14/11/2026. Không nhận bằng chứng runtime.

## 1. Trạng thái công việc có nguồn

| Gate | Trạng thái tại 14/11 | Nguồn và hành động còn lại |
|---|---|---|
| PR #2 merge upstream | **VERIFIED** | [PR #2](https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/pull/2), merge `ba6d526b518b877c1f2c9f04732273f9f33968c4` |
| PR #3 retarget `main` | **VERIFIED** | [PR #3](https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/pull/3), chỉ file S6 |
| Product C′ Owner Acceptance | **VERIFIED DOCUMENT_ONLY** | [Comment #6866595994](https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/pull/2#issuecomment-6866595994), Acceptance R |
| Source-repository shortlist/recommendation | **PREPARED** | [Đánh giá phương án](s6-0-source-repository-evaluation.vi.md), đề xuất repo mới |
| Owner source repository selection | **PENDING** | Owner xác nhận `S6-0-REPO-01`, tên/visibility/ownership/license |
| Source repo thực / branch + branch rules | **NOT_CREATED / NOT_VERIFIED** | Tạo repo sau quyết định, kiểm GitHub URL, branch protection/CI |
| Engineering/QA/Ops/Security/Finance owners | **UNASSIGNED** | Phân công người cụ thể, thẩm quyền và reviewer thay thế/độc lập khi bắt buộc |
| Test environment/PWA devices/SQL/provider sandbox | **NOT_PROVISIONED** | Thiết lập môi trường cô lập, nhà cung cấp được phép, dữ liệu synthetic/permission |
| Secure evidence store/retention/audit | **NOT_CONFIGURED** | Chỉ metadata/hash trên public repo, source artifact bí mật lưu riêng |
| TADR-01/02 review | **DESIGN_CANDIDATE** | Tech/QA/Finance review trade-offs và test harness, không mặc nhiên phê duyệt |
| Five P0/G-IDEMP/G-LEDGER test authorization | **NOT_RUN** | F-01..22 controlled sandbox, per-build/mode source ledger diff |

## 2. Chuỗi thực thi S6-0

- **I0 — Repository decision:** Owner chọn phương án và xác nhận tên, license/visibility; Engineering giới thiệu source layout/branch policy. Không có quyền tự dùng một repo trùng tên chưa kiểm chứng.
- **I1 — Foundation selection & TADR:** Sau quyết định Repo, lập TADR-01/02, giao Technical/QA/Finance/Operations review; không làm Product policy override.
- **I2 — Harness setup:** CI restore/build/test/reproducible dependencies, API/SQL test environment, PWA browsers/IndexedDB devices, provider/accounting sandbox (chưa khởi chạy production).
- **I3 — Source/provenance:** canonical C′ + R anchors, no silent contract changes, testRunId/buildSha/mode/tenant/seller/fixtureHash/ledgerDiff + artifact URI/SHA256, reviewer.
- **I4 — Security:** authorization, least privilege, masking, secrets storage, client offline grant, writer identity, DR external registry and owner-accepted safety plan.
- **I5 — Gate:** Một handoff review/CI xác nhận các điều trên mới được chuyển `S6-0=READY_FOR_SOURCE_SLICE`; **không** tự chuyển Product Verified/Tenant Go-Live.

## 3. Cổng chặn áp dụng ngay

`sourceRepository=NOT_SELECTED`, `S6-0=PLANNED_NOT_EXECUTED`, `realE2eRuns=0`, `TADR-01..06=DESIGN_CANDIDATE`, `EV-01..15=EVIDENCE_PENDING/MODEL_ONLY_REAL_PENDING`. B_NO_CHANNEL BLOCKED; OFFLINE_WRITE và PRODUCTION_CUTOVER disabled pending; năm P0 không miễn trừ.

Đầu ra của đợt này **là đánh giá và hồ sơ chuẩn bị**, không phải gán "đã xây dựng MVP".
