# S5 — Candidate Snapshot C: Readiness & Approval Handoff

**Loại hồ sơ:** `PRODUCT_BASELINE_SNAPSHOT_C_PREPARATION_NOT_SIGNED`. Đây là hồ sơ chuẩn bị phiên bản để Owner review, không phải kết quả Owner sign-off hoặc Verification. [Machine-readable candidate](product-baseline-snapshot-c.candidate.json) và [schema](product-baseline-snapshot-c.schema.json).

## 1. Thứ tự phụ thuộc đã kiểm chứng

- PR #1 / R009 đã merge vào `main` bằng merge commit [86850a7b4d515b8f14dd736cc9657e051c2ec588](https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/commit/86850a7b4d515b8f14dd736cc9657e051c2ec588), giữ ancestry.
- PR #2 / R010 đã được đồng bộ với merge commit bằng [0443705d4d5cd772a69eab9bf5b625e30a9c43a2](https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/commit/0443705d4d5cd772a69eab9bf5b625e30a9c43a2) và retarget `main`. PR #2 tiếp tục `Draft`, không tự merge.
- Sau retarget, **S2–S5 synthetic CI** trên commit này đã thành công; đó là evidence của contract/tooling trước Snapshot C, không phải actual E2E hoặc review chuyên môn.

| Workflow | Pre-snapshot checked commit | Kết quả |
|---|---|---|
| S2 | `0443705d4d5c` | [SUCCESS](https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/actions/runs/43437293918) — SYNTHETIC |
| S3 | `0443705d4d5c` | [SUCCESS](https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/actions/runs/43437295589) — SYNTHETIC |
| S4 | `0443705d4d5c` | [SUCCESS](https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/actions/runs/43437294211) — SYNTHETIC |
| S5 | `0443705d4d5c` | [SUCCESS](https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/actions/runs/43437294163) — SYNTHETIC |

## 2. Snapshot scope và chứng cứ toàn cây

**Commit C được định nghĩa là commit Git cuối của cây tài liệu Product Baseline v1**, gồm R009 đã merge, toàn bộ R010 S1–S5, B010, README và workflows kiểm chứng tương ứng. SHA của commit C xác định bên ngoài nội dung C (trong PR #2), tránh tự tham chiếu vòng. 14 Git blob anchors trong `product-baseline-freeze.candidate.json` bảo vệ các upstream contracts quan trọng; SHA commit C mới bảo vệ cả cây tài liệu đang được đề nghị duyệt.

**Scope nêu rõ:**
- `reports/2026-11-13-09-mvp-specification-baseline/**`
- `reports/2026-11-13-10-product-reference-go-live-blueprint/**`
- `briefs/2026-11-13-10-product-reference-go-live-blueprint.md`
- `README.md`
- `.github/workflows/s2-synthetic-validation.yml`
- `.github/workflows/s3-acceptance-contract-validation.yml`
- `.github/workflows/s4-operations-contract-validation.yml`
- `.github/workflows/s5-adoption-baseline-contract-validation.yml`

R008 model/synthetic là tài liệu lịch sử và oracle tham khảo, không phải chứng cứ Product Verification. Các file khác có trong Git commit không vì thế trở thành policy mới được Owner phê duyệt.

## 3. Quality Gate trước Owner comment theo Q06/Q09

1. Chạy S1–S5 tại **đúng SHA commit C**; kiểm R009 trace và nguồn, S1 policy/PADR/EVQ, S2 schema/CSV/fixture, S3 AC/EV/mode, S4 OPS/gates, S5 Q01–Q20/40 outstanding/14 anchors. CI PASS chỉ là technical/synthetic gate.
2. Product/BA, Technical và QA reviewer có thẩm quyền phải ghi reviewRef thật, phạm vi, findings và kết luận trên **commit C**, không suy từ sample JSON. Finance/Legal/Ops khi phạm vi cần; chữ ký NPP/provider/Finance actual runtime vẫn ở gate riêng.
3. P0/P1 contract-blocking findings phải khép trước Owner approval; các runtime EV, TADR, legal/provider/pilot pending chỉ được giữ rõ trong Outstanding Register.
4. Trước khi đề xuất Owner comment, xác nhận PR HEAD vẫn bằng C, branch `base=main`, không có conflict, quality gate liên quan đạt và không có thay đổi policy/contract sau review.
5. Owner tự comment trong PR #2 chấp nhận full SHA C, scope Product policy/contract; chỉ **sau comment đó** mới tạo commit R với approval URL/timestamp có căn cứ. Bất kỳ content drift contract sau C đòi C mới/Owner review lại.

## 4. Các trường pending có chủ ý

- `baselineFreezeCommitSha=null` ở **candidate** và `snapshotCommitSha=null` trong file này là thiết kế để tránh tự bịa SHA C. SHA thực phải lấy từ GitHub commit đã push.
- `baseline-review-matrix.json` vẫn `PENDING_REVIEW` cho các reviewer, không có người ký giả.
- `product-baseline-acceptance.example.json` vẫn `PENDING_OWNER_SIGNATURE` và **chưa có commit R**.
- TADR-01..06 `DESIGN_CANDIDATE`; EV-01..15 thực chưa PASS; B-CASE, LEGAL-MEMO `EVIDENCE_PENDING`, INV-09 `NOT_RUN`.
- A/B_ONLINE/MIXED `NO_GO_PENDING`, OFFLINE_WRITE/CUTOVER `DISABLED_PENDING`, B_NO_CHANNEL `BLOCKED`. Không đổi NPP-01 D-15.

## 5. Bàn giao sau commit C

GitHub comment dùng để báo commit C SHA và link run quality gate đúng HEAD; đây là thông tin **chuẩn bị phê duyệt**, không phải Owner signature. Chỉ khi có reviewers/Quality Gate đủ thật mới mời Owner phê duyệt trực tiếp. PR #2 giữ Draft, không merge đến khi có acceptance record và review cuối.
