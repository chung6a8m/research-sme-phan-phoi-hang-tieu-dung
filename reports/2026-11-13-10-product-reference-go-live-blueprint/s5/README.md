# S5/P07 — Tenant Adoption, Gap Assessment & Product Baseline v1 candidate

**Trạng thái:** `S5_CONTRACT_PREPARED / OWNER_BASELINE_ACCEPTANCE_PENDING` · 13/11/2026 · PR #2 · chỉ nghiên cứu/contract.

S5 dùng **Product-First**: L0 bất biến, L1 cấu hình hữu hạn, L2 cần ADR/AC/EV được review; NPP không tự fork lõi. Tài liệu này không tạo NPP data, chữ ký, trạng thái `DOC_READY_APPROVED` hay `PRODUCT_VERIFIED`.

| File | Mục đích |
|---|---|
| `archetypes.json` | 4 archetype giả thuyết phục vụ khảo sát, **không** là kết luận đã nghiên cứu thực địa |
| `questionnaire.json` và `questionnaire-responses.example.json` | 24 câu hỏi, ánh xạ POL/CFG-01..24, OPS-01..30, ví dụ hoàn toàn UNANSWERED |
| `gap-assessment-template.csv` | Ma trận làm việc 30 OPS, tất cả UNASSESSED, không phải evidence hoặc điều kiện GO |
| `gap-disposition-policy.json` | Quy tắc ADOPT_STANDARD / CONFIGURE_L1 / EXTENSION_CANDIDATE_L2 / BLOCKED |
| `tenant-adoption-profile.schema.json` và `.example.json` | Tình trạng đánh giá tenant, tham chiếu gap ID và hồ sơ S4, không có gate/signer |
| `product-pilot-contract.json` | Product Pilot Contract dùng chung: UX, EV-14 → EV-15, SLO, n/N, mode-level |
| `tenant-pilot-profile.schema.json` và `npp-01-pilot-blueprint.example.json` | Tenant Pilot Profile NPP-01 theo R009 D-15, **chỉ kế hoạch**, chưa có số liệu/thẩm quyền |
| `product-baseline-freeze.schema.json` và `product-baseline-freeze.candidate.json` | Snapshot manifest tài liệu S1–S5, 16 Owner decisions và các pending; chưa có Owner acceptance record |
| `gap-assessment-and-adoption.vi.md` | Phương pháp phỏng vấn, phân loại, trace và escalations |
| `baseline-freeze-and-s6-handoff.vi.md` | Checklist chốt baseline ứng viên và bàn giao development S6 |

## Owner Review Q01–Q20 — Consolidation chuẩn bị, KHÔNG phải sign-off

Owner đã chọn phương án 1 cho cả Q01–Q20 trong hội thoại ngày 13/11/2026. Quyết định mức chính sách: `OWNER_DECIDED_IN_CHAT`; **GitHub baseline acceptance vẫn PENDING**. Chỉ tạo hồ sơ/synthetic checks, không sinh commit C/R, không gán reviewer hoặc timestamp giả.

| Artifact | Mục đích |
|---|---|
| [owner-baseline-review-decisions.vi.md](owner-baseline-review-decisions.vi.md), [records JSON](owner-baseline-review-decisions.json) | 20 quyết định, nguồn, lựa chọn, tác động và trace Q01–Q20 |
| [product-governance.vi.md](product-governance.vi.md) | Freeze/change control, evidence, re-admission, emergency, per-tenant migration, threshold và L2 |
| [baseline-review-matrix.vi.md](baseline-review-matrix.vi.md), [matrix JSON](baseline-review-matrix.json) | Product/BA, Technical, QA bắt buộc trước Owner sign-off; Finance/Legal/Ops theo phạm vi; mọi review PENDING |
| [outstanding-register.json](outstanding-register.json) | TADR-01..06, EV-01..15, năm gate P0, B-CASE/LEGAL/INV-09, threshold UNSET; không chứng nhận PASS |
| [product-baseline-acceptance.schema.json](product-baseline-acceptance.schema.json), [unsigned example](product-baseline-acceptance.example.json) | Contract cho hồ sơ ký ở commit R sau Owner comment; schema **không chứng minh tác giả GitHub hay tính xác thực** |
| [product-extension-backlog-template.json](product-extension-backlog-template.json) | Q20: L2 mặc định DEFER, không fork tenant hoặc tự mở mode |
| [owner governance validator](s5-owner-governance-validation.mjs), [negative regression](s5-owner-governance-regression.mjs), [acceptance schema tests](s5-owner-acceptance-schema-tests.py) | Chặn fake approval/CI/reviewer/EV/P0/threshold/L2 bằng synthetic tests |

**Trình tự theo Q12/Q08:** review và merge PR #1 → retarget PR #2 vào main → kiểm S1–S5/final reviewers và chuẩn bị commit C toàn-tree → Owner tự đăng GitHub comment xác nhận C khi reviewer/QA gates đủ → commit R chỉ lưu acceptance record thật → review/merge riêng. Những nội dung Bước A được ghi ở đây là lịch sử trước khi tạo Snapshot C; hồ sơ ký R vẫn chưa tồn tại.

**Q11:** Cho phép sandbox/UAT từng mode; không tính là EV-15. Pilot NPP-01 vẫn 3A+3B_ONLINE+2MIXED/ngày × ≥5 ngày; writer độc quyền toàn Kho-01 khi cutover. Các mode production vẫn NO_GO/PENDING.

**Nguồn gap thực** là `../s4/tenant-operations-dossier.schema.json` với `TENANT_DISCOVERY_GAP_NOT_GATE_APPROVAL`; `discoveryGaps[]` được lưu ở S4, không tạo bản sao song song. S5 `gapDecisions[]` chỉ tham chiếu `gapId` đó để đề xuất disposition.

**Không suy diễn:** requestedModes ≠ admittedModes; EV-14 trước Pilot ≠ EV-15 sau Pilot; Pilot của NPP-01 không thành template toàn ngành; P0 không waive; B_NO_CHANNEL luôn BLOCKED; offline A yêu cầu E2E riêng; toàn Kho-01 phải độc quyền ghi sau cutover.

Các ví dụ synthetic không được dùng làm dữ liệu NPP thật. S6 mới thực thi PWA/API/SQL/provider/accounting, kiểm thử thiết bị/offline/restore/cutover và xin Product Verification/Tenant Go-Live độc lập.

**Versioned freeze candidate:** `reviewedInputBlobs[]` khóa 14 blob nguồn R009/S1–S4, CI phát hiện drift. Manifest không khóa chính nó và không thay được `ownerAcceptance` thực; `baselineFreezeCommitSha` vẫn null cho tới quyết định phiên bản mới có căn cứ.

**CI kết quả S5:** [validation-results.vi.md](validation-results.vi.md) ghi GitHub Actions và các giới hạn không thể thay bằng synthetic checks.

## Chuẩn bị Snapshot C sau khi PR #1 merge và PR #2 retarget main

- PR #1 đã merge vào `main`: [merge commit 86850a7b4d51](https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/commit/86850a7b4d515b8f14dd736cc9657e051c2ec588). PR #2 đã đồng bộ với `main` bằng [0443705d](https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/commit/0443705d4d5cd772a69eab9bf5b625e30a9c43a2).
- [Snapshot C candidate](product-baseline-snapshot-c.candidate.json), [schema](product-baseline-snapshot-c.schema.json), [readiness & QA handoff](baseline-snapshot-c-readiness.vi.md), [negative schema tests](s5-snapshot-c-schema-tests.py) chuẩn bị scope toàn-tree và quy trình ký; `snapshotCommitSha=null` trong chính file candidate để tránh self-reference. SHA GitHub của **commit chứa snapshot** là C sau khi commit được push.
- CI S2–S5 sau retarget về main ở [0443705d](https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/commit/0443705d4d5cd772a69eab9bf5b625e30a9c43a2) đã SUCCESS (synthetic/contract). **CI tại C và reviewer thật** vẫn phải được kiểm trước Owner sign-off; không tự chuyển matrix `PENDING_REVIEW` thành PASS.
- **Không phải Acceptance Record R:** mẫu `product-baseline-acceptance.example.json` vẫn chưa ký, chưa có GitHub Owner comment, và các mode/EV/TADR vẫn pending. PR #2 tiếp tục Draft, không tự merge.

## Q09 interview findings và candidate C' (chưa sign-off)

[Báo cáo Q09 và disposition](q09-interview-review-and-finding-disposition.vi.md) ghi 37 lựa chọn qua phỏng vấn, năm contract findings và điều kiện review. Commit C gốc: `4e2e4626208b52c6d09ebe3722b2a4462f6f6112`; candidate C' là một commit mới, không tạo Owner approval hoặc Acceptance Record R từ phỏng vấn. Các TADR/EV/tenant/provider/legal vẫn pending.
