# S5 — Product Governance v1 (Owner Review Q01–Q20)

**Chính sách Owner đã lựa chọn trong chat 13/11/2026; trạng thái tài liệu triển khai `DRAFT_CONTRACT_ALIGNMENT`.** Formal baseline approval phải chờ PR #1, Q06 quality gate, commit C và comment thật của Owner; đây không phải runtime/E2E verification.

## 1. Precedence và lớp phạm vi

Thứ tự ưu tiên: `L0_INVARIANT → MODE_ADMISSION → NON_WAIVABLE_P0 → TENANT_L1 → L2_REVIEW`. Không có cờ cấu hình cho phép bỏ L0, P0, maker–checker, hóa đơn có căn cứ hay stock writer độc quyền. P1 chỉ ngoại lệ có owner/scope/timebox/mitigation/compensating control/reviewer/approvalRef, không đổi FAIL/PENDING thành PASS.

Product modes của MVP: `A`, `B_ONLINE`, `MIXED` (B phải online trong mixed). Offline A có grant theo thiết bị/chuyến sau EV-08/09; nhánh B cần kênh thay thế khi PWA mất mạng là deferred; `B_NO_CHANNEL=BLOCKED`. NPP-01 Pilot 3A+3B_ONLINE+2MIXED/ngày ≥5 ngày, nhưng cả Kho-01 đều chịu một stock writer sau cutover.

## 2. Lifecycle commit C/R và Change Control (Q01–Q03/Q06–Q08/Q12–Q13)

1. PR #1 R009 được review và merge riêng; PR #2 retarget về `main`, đối chiếu ngữ nghĩa upstream và chạy lại validators.
2. Hợp nhất Q01–Q20 và Review Matrix, xóa lỗi contract blocking; chạy S1–S5 CI trên HEAD định ký; tạo **commit C** là snapshot của toàn bộ cây Product Baseline, không chỉ 14 blob anchors.
3. Owner tự comment trên PR #2 nêu full SHA C và phạm vi policy/contract; lấy URL GitHub + author + actual timestamp từ GitHub, không bịa.
4. Commit **R** lưu acceptance record tham chiếu C, review/evidence pending và comment thật; không sửa contract của C. SHA R là metadata sau commit, không tự tham chiếu chính nó trong nội dung.
5. Nếu thay đổi sau C là **EDITORIAL_ONLY**, technical review và giữ dấu vết, xác minh không đổi ý nghĩa contract; nếu có **POLICY_CONTRACT_CHANGE** phải impact assessment, regression, candidate C mới và Owner ký lại. Evidence updates, TADR, tenant L1 đổi riêng có version, không sửa C.
6. PR tài liệu chỉ merge thủ công sau khi branch stacking, owner record, reviewer và CI lại đạt. Merge PR không cấp mode hoặc chuyển verification status.

## 3. Chức năng review (Q09)

Product/BA kiểm Product Scope, 16 PADR/EVQ và 20 Q, 24 POL/CFG, 12 SOP và D→BR→DC/API/SM→AC/EV; Technical kiểm S1/S2/S3/S4/S5 contract và TADR boundary; QA kiểm source hashes, schema/validator/negative regression, gate semantics và actual HEAD CI. Finance/Legal/Ops review khi scope yêu cầu; các chữ ký về seller/provider, accounting, cutover, tenant và Pilot là **gate riêng**. Không tự điền names, timestamps, review refs hoặc PASS.

## 4. Outstanding và Evidence Registry (Q04/Q13–Q15)

Freeze C giữ ảnh chụp trạng thái tại thời điểm duyệt; `outstanding-register.json` là **bản khởi tạo pending**, cập nhật theo chu kỳ S6 bằng hồ sơ versioned độc lập. Evidence kết quả runtime phải có `testRunId`, build SHA, mode/tenant/profile scope, environment/OS/browser/device/provider khi liên quan, actual/expected, artifacts digest, reviewer and disposition. CI model/synthetic không thể thay thế E2E.

Repository nghiên cứu công khai chỉ chứa **metadata được phép công khai, đã kiểm tra không có PII/identifiers nhạy cảm**; tránh client IDs, địa chỉ, hóa đơn, raw ledger diff, credentials, bearer tokens, raw traces. Store gốc có kiểm soát truy cập theo tenant/role, access audit, retention và integrity hash do Security/Legal/tenant chính thức review. Thiếu artifact hoặc build/scope thay đổi ⇒ đánh giá lại độ hiệu lực; không xóa PASS lịch sử và không tự nâng trạng thái hiện hành.

## 5. Suspension / Re-admission và Emergency Change (Q17–Q18)

`ADMITTED → SUSPENDED → REVALIDATION_REQUIRED → RE_ADMITTED` là vòng đời policy đề xuất, **chưa phải state machine đã code**. Khi P0 hoặc evidence hết hiệu lực, chặn thao tác ghi trong phạm vi rủi ro; nếu không thể loại trừ shared component thì phạm vi đình chỉ rộng hơn. Offline revoke phụ thuộc TTL/grant và kiểm chứng thực, không tuyên bố thu hồi tức thì khi mất mạng.

Incident phải bảo toàn historical events, external effects và counter/authority ngoài rollback. Technical hotfix không đổi policy có review Engineering/QA/Security/Ops, impact AC/EV, release approval và re-admission. Hotfix sửa Product Contract cần Owner approval, baseline version và revalidation; không có emergency bypass P0. After-first-effect chỉ Forward Recovery, không khôi phục DB cũ để xóa lịch sử đã có hiệu lực.

## 6. Threshold/Product–Tenant authority (Q10–Q11/Q16)

Product Owner chốt định nghĩa metric, L0 và phạm vi giới hạn; Engineering/QA/Ops đo/đề xuất; Tenant Owner cùng người có thẩm quyền duyệt threshold cho pilot, cụ thể theo mode/profile/version và n/N. Những số UX, SLO, case age, support cost, RPO/RTO/retention và offline TTL/cap chưa có input phải tiếp tục `UNSET`. EV-14 readiness phải có approval thực **trước** Pilot; EV-15 chỉ dựa dữ liệu Pilot thật **sau** quá trình đo; sandbox/UAT không cộng vào EV-15.

## 7. Compatibility và migration (Q19)

Nâng cấp từng tenant có phiên bản API/schema/CSV, expand–migrate–contract khi khả thi, dry-run/mapping/backup/đối soát nguồn, canary và rollback plan trước first business effect. Không biến tín dụng `UNSET` thành `APPROVED=0` nếu thiếu Finance approval. Sau firstEffect áp dụng Forward Recovery. Mỗi build/mode phải đánh giá lại admission và impact EV; không tự áp dụng tất cả NPP.

## 8. L2 Product Extension (Q20)

`EXTENSION_CANDIDATE_L2` luôn bắt đầu bằng backlog có tenant source/gapId, nhu cầu nhiều tenant nếu có căn cứ, khả năng tái sử dụng, chi phí, rủi ro, affected D/BR/POL/CFG/SOP/DC/API/SM/AC/EV. Phân loại `DEFER`, `PRODUCT_EXTENSION_REVIEW`, `REJECT_BLOCKED`; việc nhận nghiên cứu không phải Owner phê duyệt phát triển. Khi triển khai cần Product ADR mới, QA acceptance, version và Owner decision; không fork lõi tenant hay thay đổi MVP v1 âm thầm.

## 9. Ranh giới kết luận

`DOC_READY_CANDIDATE ≠ OWNER_BASELINE_ACCEPTED ≠ PRODUCT_VERIFIED ≠ TENANT_GO_LIVE_ACCEPTED`. Cho phép S6 vertical slice bắt đầu nghiên cứu/code, nhưng Production A/B_ONLINE/MIXED vẫn `NO_GO_PENDING`; OFFLINE_WRITE và CUTOVER `DISABLED_PENDING`; B_NO_CHANNEL `BLOCKED`. TADR-01..06 vẫn DESIGN_CANDIDATE. Không dùng policy này làm sign-off ngoài phạm vi Product.
