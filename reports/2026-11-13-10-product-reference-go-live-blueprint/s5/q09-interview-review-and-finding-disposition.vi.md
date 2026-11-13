# Q09 — Phỏng vấn review và Finding Disposition cho Product Baseline v1 Candidate C'

**Nguồn review:** PR #2 commit C `4e2e4626208b52c6d09ebe3722b2a4462f6f6112`; đây là bản gốc bất biến. **Trạng thái:** `CONTRACT_FIX_CANDIDATE_NOT_SIGNED`. SHA C' phải lấy từ GitHub sau khi commit, không tự nhúng SHA của commit vào nội dung.

## 1. Kết quả phỏng vấn, không phải chữ ký

- 12/12 Product/BA `PBA-01..12`, 15/15 Technical `TECH-01..15`, 10/10 QA `QA-01..10`: Owner đã chọn phương án 1 cho từng câu trong chat; tổng 37 lựa chọn.
- `Q09-SIGN-01=2`: Owner kiêm PRODUCT_BA/TECHNICAL/QA; cần **ba review records thực, trên cùng SHA**, ghi rõ không có nhân sự reviewer độc lập (`independentReviewer=false`). Chat không thay reviewRef GitHub.
- `Q09-SIGN-02=1`: FINANCE, LEGAL, OPERATIONS phải có reviewer chuyên môn thực trên contract liên quan.
- `Q09-SIGN-03=1`: đóng contract blockers bằng chỉnh sửa và regression trước khi Owner sign-off; không miễn P0/P1 làm sai ngữ nghĩa.

## 2. Danh sách findings và exit criteria (severity đề xuất, chưa phải GitHub review)

| ID | Mức đề xuất | Phát hiện trên C | Thay đổi contract ứng viên C' | Kiểm chứng để đóng |
|---|---|---|---|---|
| PBA-02 | P1-CONTRACT | Credit UNSET thiếu nhánh bán thu ngay | POL-03/CFG-06, SOP-02/07, AC-08 | Cash-only verified không cấp tín dụng, bán chịu khi UNSET bị chặn; tiền thực có nguồn |
| PBA-03 | P1-CONTRACT | Hàng trả thực tế và quà chưa thu hồi chưa tách settlement | POL-09/20, SOP-06, AC-07/19 | Physical receipt→QUARANTINE; AR/credit/refund pending tới khi gift recovered/waived có checker; Legal/Tax xét adjustment độc lập |
| PBA-09 | P1-CONTRACT | Giá A Confirm chưa khóa rõ mọi lần giao | POL-08, SOP-02, AC-02/19 | Giá/discount giữ theo Confirm; amendment chỉ phần chưa giao, có source/version/approval |
| TECH-08 | P1-CONTRACT | Mixed Online đòi EV-08 unscoped | S3 mode gates, scoped EV-08 online/Offline, AC-11, validator/regression | A/B/Mixed online chứng minh G-IDEMP riêng; OFFLINE_WRITE real-device E2E vẫn disabled; Mixed E2E không bị bỏ |
| TECH-11 | P1-SECURITY-CONTRACT | File/export đã cấp URL trước revoke thiếu rõ hạn hiệu lực | POL-01/17 clarification, Role/RACI, AC-01 | Authorize lúc phục vụ hoặc URL expiry giới hạn được duyệt, support grant audit; không mặc nhiên revoke tức thì |

Các mức độ trên cần reviewer xác nhận. Mọi dữ liệu trong S3 chỉ là AC/Gherkin và **synthetic tests**, không phải EV đã đạt.

## 3. DoD bắt buộc cho Candidate C'

1. Đối chiếu `D→BR→POL/SOP→DC/API/SM→AC/EV` hai chiều; cập nhật source/blobs, toàn bộ phạm vi Git snapshot.
2. QA regression dương/âm: credit UNSET cash-only; gift physical vs commercial; A Confirm price; online G-IDEMP EV-08 scoped ở A/B/Mixed nhưng không yêu cầu full Offline; Offline EV-08/09 riêng; revoked file/export guard. P0 không waive; B_NO_CHANNEL BLOCKED; EV-14 trước EV-15.
3. Chạy S1–S5 CI trên đúng SHA C', kiểm 14 blob anchors và upstream R009 không bị sửa. Chỉ ghi `SYNTHETIC_CI_VERIFIED`, không `PRODUCT_VERIFIED`.
4. Sáu reviewer roles PRODUCT_BA, TECHNICAL, QA, FINANCE, LEGAL, OPERATIONS phải có reviewRef, reviewedAt, reviewedCommitSha, scope, findings disposition thực. Owner kiêm ba vai trò nhưng không tự tuyên bố independent review; chuyên gia Finance/Legal/Ops ký đúng thẩm quyền.
5. Chỉ sau khi contract blockers được khép và reviewers thật hoàn tất, Owner **tự** comment PR #2 chấp nhận full SHA, rồi mới commit R tham chiếu URL/timestamp thật. Không auto-merge hoặc cấp mode.

## 4. Trạng thái không được nâng

`DOC_READY_CANDIDATE != OWNER_BASELINE_ACCEPTED != PRODUCT_VERIFIED != TENANT_GO_LIVE_ACCEPTED`.

TADR-01..06 `DESIGN_CANDIDATE`; EV-01..15 real `EVIDENCE_PENDING`/`MODEL_ONLY_REAL_PENDING`; B-CASE-001..003 và LEGAL-MEMO `EVIDENCE_PENDING`, INV-09 `NOT_RUN`. P0 `G-STOCK/G-CUT/G-IDEMP/G-LEDGER/G-INV` không waive; A/B_ONLINE/MIXED `NO_GO_PENDING`; `OFFLINE_WRITE/PRODUCTION_CUTOVER DISABLED_PENDING`; `B_NO_CHANNEL BLOCKED`.

NPP-01 Pilot vẫn 3 A + 3 B_ONLINE + 2 MIXED/ngày, ít nhất 5 ngày có độ bao phủ đại diện; quyền stock writer thuộc toàn Kho-01.
