# S5 — Owner Review Product Baseline v1: quyết định Q01–Q20

**Ngày phỏng vấn:** 13/11/2026 (không ghi giờ ký giả) · **Nguồn:** 20 lựa chọn của Owner trong hội thoại, tất cả phương án 1 · **Trạng thái:** `OWNER_DECIDED_IN_CHAT / FORMAL_GITHUB_SIGNOFF_PENDING`.

**Không đồng nghĩa:** việc lựa chọn chính sách Q01–Q20 không phải GitHub Owner Acceptance, CI production, Product Verification, Tenant Go-Live, legal/Finance/provider sign-off hay quyền mở mode. Bản máy đọc được: [owner-baseline-review-decisions.json](owner-baseline-review-decisions.json).

| ID | Phương án được chọn | Hệ quả ràng buộc | Trace chính |
|---|---|---|---|
| **Q01** | 1 — Chấp nhận Product Baseline v1 ở cấp chính sách và contract | Không tuyên bố PRODUCT_VERIFIED hay TENANT_GO_LIVE_ACCEPTED; TADR-01..06 vẫn DESIGN_CANDIDATE. | PADR-01, EVQ-01, TADR-01..06 |
| **Q02** | 1 — Đóng băng toàn bộ Product Baseline theo commit | Snapshot commit C bất biến. Policy/contract thay đổi cần impact assessment, regression, Owner review phiên bản mới; biên tập thuần túy qua technical review. | S1–S5, PRODUCT_BASELINE_V1_CANDIDATE |
| **Q03** | 1 — Owner xác nhận trực tiếp trên GitHub PR #2 | Chỉ GitHub comment do Owner thực sự đăng với SHA rõ ràng mới là approvalRef; không ký thay hoặc tự đặt timestamp. | PR-2, OWNER_ACCEPTANCE |
| **Q04** | 1 — Outstanding Register vận hành độc lập | P0 không miễn trừ; giữ đúng trạng thái TADR/EV/B-CASE/LEGAL/INV-09, có role owner, exit criteria, evidence và milestone S6. | EV-01..15, G-STOCK, G-CUT, G-IDEMP, G-LEDGER, G-INV |
| **Q05** | 1 — S6 triển khai theo từng vertical slice, TADR độc lập | TADR liên quan phải review trước khi coi là chốt; triển khai/code/test không mặc nhiên đạt product verification. | TADR-01..06, S6-A..F |
| **Q06** | 1 — Quality Gate nghiêm ngặt trước Owner sign-off | Đối chiếu S1–S5, hashes, trace, non-waivable contracts và CI synthetic trên commit C; không cần giả lập bằng chứng runtime. | S1–S5, S5-CI, BASELINE_REVIEW_MATRIX |
| **Q07** | 1 — Merge PR tài liệu độc lập với S6 | Chỉ merge thủ công sau Owner sign-off, PR review/CI/stacking đạt; không cần chờ toàn bộ E2E thật. | PR-2, S6 |
| **Q08** | 1 — Hai commit: C snapshot và R acceptance record | Owner ký rõ commit C; commit R chỉ ghi record/comment thực, không sửa nội dung contract đã duyệt. | BASELINE_SNAPSHOT_C, ACCEPTANCE_RECORD_R |
| **Q09** | 1 — Review chuyên môn trước Owner sign-off | Product/BA, Technical, QA kiểm tài liệu/contract; Finance/Legal/Ops đúng phần có thẩm quyền, không bịa người ký/review. | S1–S5, BASELINE_REVIEW_MATRIX |
| **Q10** | 1 — Product Baseline độc lập với Tenant Adoption | S5 khảo sát 24 câu và 30 OPS theo từng NPP; gap L0/L1/L2/BLOCKED; không lấy synthetic làm field evidence. | S5, OPS-01..30, PADR-01 |
| **Q11** | 1 — Thử nghiệm từng mode sớm, giữ Pilot NPP-01 D-15 | Sandbox/UAT không tính EV-15; Pilot chính thức NPP-01 giữ 3 A + 3 B_ONLINE + 2 MIXED/ngày >=5 ngày; quyền kho toàn Kho-01. | R009-D-15, EV-14, EV-15, G-STOCK |
| **Q12** | 1 — Hoàn tất PR #1 trước khi freeze PR #2 | Merge PR #1 theo quy trình riêng, retarget PR #2 về main, xem lại diff/trace/CI rồi mới tạo C. | PR-1, PR-2 |
| **Q13** | 1 — Baseline bất biến, evidence và outstanding living registers | EV/TADR hoàn thành không làm baseline tự đổi; thay đổi ngữ nghĩa contract phải qua change control. | OUTSTANDING_REGISTER, EVIDENCE_REGISTER |
| **Q14** | 1 — Evidence metadata an toàn trong repo, artifact gốc lưu riêng | Chỉ metadata không nhạy cảm có thể công khai; log/hóa đơn/sổ/PII/credentials vào secure artifact store phân quyền, hash và audit/retention phù hợp. | EV-01..15, SECURE_ARTIFACT_STORE |
| **Q15** | 1 — Reverification theo thay đổi và phạm vi evidence | Evidence gắn build/tenant/profile/mode/device/provider khi có; impact assessment AC/EV; không tự kế thừa PASS hay admission. | EVQ-01, EVQ-04, PADR-03 |
| **Q16** | 1 — Quản trị ngưỡng hai cấp Product/Tenant | Product duyệt định nghĩa/giới hạn, QA/Engineering/Ops đo đề xuất, Tenant Owner duyệt ngưỡng pilot trong phạm vi; ghi n/N/SLO trước EV-14. | EV-14, EV-15, TADR-06 |
| **Q17** | 1 — Đình chỉ theo phạm vi rủi ro và Re-admission | P0 hoặc evidence không hợp lệ phải chặn quyền ghi trong phạm vi rủi ro; phục hồi cần test/evidence và approval mới, offline grant không thu hồi tức thì khi mất mạng. | PADR-03, G-IDEMP, EV-08, EV-09 |
| **Q18** | 1 — Emergency Change có kiểm soát | Hotfix không đổi contract qua review/test/release/re-admission; sửa Product Contract phải có Owner decision và version mới, không miễn P0. | INCIDENT, CHANGE_CONTROL, EVQ-02 |
| **Q19** | 1 — Nâng cấp per-tenant với compatibility/migration kiểm soát | Version API/schema/CSV, dry-run, canary, đối soát, forward recovery; không suy credit APPROVED=0 từ dữ liệu cũ chưa có approval. | PADR-02, S2, TADR-05 |
| **Q20** | 1 — L2 vào backlog trước, Product Extension cần phê duyệt | Không fork lõi; cần nhu cầu có nguồn, tái sử dụng, impact analysis, Product ADR/AC/EV, Owner approval và version mới để phát triển. | PADR-01, GAP_DISPOSITION, EXTENSION_BACKLOG |

## Ranh giới chấp thuận và các điều kiện bắt buộc

- **Q01/Q06:** Cho phép chuẩn hóa Product Policy và contract; phải có review chuyên môn, trace S1–S5, synthetic CI tại đúng commit được trình ký, không có blocker contract mở. TADR/E2E thật có thể đang pending.
- **Q02/Q03/Q08/Q12:** Hoàn tất/merge PR #1 trước; retarget PR #2; tạo commit **C** đóng băng nội dung; Owner **tự** comment phê duyệt C trên PR #2; commit **R** sau đó chỉ ghi hồ sơ bằng URL/timestamp thật, không sửa nội dung contract thuộc C. Không điền trước SHA/comment/người ký.
- **Q04/Q13/Q14/Q15:** Outstanding Register và Evidence Register sống độc lập; metadata công khai phải được rà soát tránh PII/tenant secrets; artifact nhạy cảm lưu riêng; PASS lịch sử không được kế thừa ngoài scope.
- **Q05/Q07:** Triển khai S6 theo từng slice và review TADR liên quan; PR tài liệu có thể merge khi đủ điều kiện mà không chờ Product Verification, không bật production.
- **Q09/Q10/Q11/Q16:** Product/BA, Technical, QA review theo vai trò trước Owner sign-off; Tenant Adoption riêng; thử sandbox/UAT sớm không tính EV-15; Pilot NPP-01 vẫn 3A+3B_ONLINE+2MIXED/ngày × ≥5 ngày và độc quyền writer toàn Kho-01; SLO/threshold n/N được duyệt trước EV-14.
- **Q17/Q18/Q19/Q20:** Suspend và re-admission theo nguy cơ; emergency hotfix không được lách L0/P0; migration per-tenant có đối soát; L2 mặc định backlog, thêm năng lực Product bằng ADR/AC/EV và Owner approval có phiên bản.

## Quy tắc thay đổi quyết định

- Chỉ trạng thái `OWNER_DECIDED_IN_CHAT` đã có căn cứ trong hội thoại; `approvalRef`, `acceptedAt`, SHA commit C và các reviewer sign-off tiếp tục chưa có.
- Thay đổi chính sách đã chọn phải lập decision revision / impact analysis; không sửa lịch sử R009 hoặc ghi lại PADR/EVQ thành quyết định mới.
- Việc Q01–Q20 cùng chọn phương án 1 **không** có nghĩa 20 gate hệ thống đã đạt. Nguồn truth runtime là Evidence Register có testRunId/build/scope/actual và independent review.

## Hồ sơ kèm theo

- [product-governance.vi.md](product-governance.vi.md): quy tắc cụ thể cho change, evidence, re-admission, emergency, release và extension.
- [baseline-review-matrix.vi.md](baseline-review-matrix.vi.md): vai trò review, tiêu chí và pending.
- [outstanding-register.json](outstanding-register.json): dependency, owner role, exit criteria và trạng thái chưa hoàn thành.
- [product-baseline-acceptance.schema.json](product-baseline-acceptance.schema.json): schema bản ghi acceptance có điều kiện; ví dụ luôn unsigned.
