# S5/P07 — Quy trình khảo sát NPP và phân loại gap

## Quy trình đề xuất (không phải biên bản đã phỏng vấn)

1. **Xác định quyền sử dụng dữ liệu:** Tenant Owner/Data Owner đồng ý phạm vi, mã tenant, nguồn và người tham gia trước khi thu dữ liệu. Thông tin pháp lý, khách hàng, PII, hoá đơn thật và credentials không đưa lên repo công khai.
2. **Phỏng vấn theo vai trò:** dùng 24 câu hỏi từ `questionnaire.json`; mỗi câu thu trạng thái `UNANSWERED` / `ANSWERED_UNVERIFIED` / `SOURCE_REVIEWED`, người cung cấp, nguồn chứng minh và blocker. **Không được tự chuyển thành verified từ câu trả lời.**
3. **Đối chiếu đúng contract:** Product L0/POL-01..24, L1/CFG-01..24 và S4 OPS-01..30. Ghi `discoveryGaps[]` trên tenant dossier S4 kèm source, scope mode, owner, next action. `requestedModes` chỉ là đề nghị, admission riêng server-side.
4. **Disposition qua S5:** `ADOPT_STANDARD` khi NPP đổi SOP để tuân L0; `CONFIGURE_L1` nếu thuộc giới hạn CFG và profile/version được duyệt; `EXTENSION_CANDIDATE_L2` nếu cần BR/TADR/ADR/AC/EV mới mà không phá L0; `BLOCKED` nếu phá L0, P0, thiếu căn cứ bắt buộc hoặc yêu cầu B_NO_CHANNEL. Không dùng exception P1 để bỏ P0.
5. **Đối soát và xếp việc:** mỗi `gapDecisions[].gapId` phải tồn tại trong S4 dossier cùng tenant/profile, classification, OPS/mode và source; product Owner xem extension, chức năng Finance/Legal/Security/Kho duyệt phần trách nhiệm của họ khi cần.
6. **Hồ sơ riêng cho Pilot:** Product Pilot Contract chung và Tenant Pilot Profile riêng. Với NPP-01 giữ 3A+3B_ONLINE+2MIXED/ngày ≥5 ngày có đại diện; **8 chuyến không khoanh vùng quyền ghi stock**. Toàn Kho-01 gồm ngoài Wave phải ở một writer sau cutover.
7. **Go/No-Go đúng giai đoạn:** DOC_READY_CANDIDATE có thể bàn giao source, không có nghĩa OWNER_ACCEPTED, PRODUCT_VERIFIED, EV-14 PASS hay Tenant Go-Live. S6 thực hiện E2E, QA, cutover và Pilot trên hệ thống thật.

## Tiêu chí ưu tiên gap

- **P0**: seller/legal/channel chưa chứng minh, tồn tại writer legacy toàn kho, double-post/invoice, lost or reversed ledger, revoke/PrivacyActionLedger hồi sinh, thiếu opening/cutover/source; không waive, mode tương ứng NO_GO.
- **P1**: quy trình hỗ trợ, UX và vận hành có kiểm soát nếu không phá bất biến; đề xuất exception qua dossier S4 có owner, phạm vi, expiry, mitigation, checker; **không biến FAIL/PENDING thành PASS**.
- **P2**: convenience, dịch vụ bổ sung hoặc L2 không chặn lõi; đưa backlog cùng liên kết source, không tự cam kết phát triển.

## Kết quả cần lấy từ NPP-01 (hiện chưa có)

Seller/tax/provider contract, dữ liệu T01..T14 có nguồn, sơ đồ UI/API/job/import/offline writer toàn Kho-01, hàng trên xe, công nợ và ba sổ, vai trò/checker và driver/delivery, policy retention, cost bridge, accounting adapter, danh sách thiết bị, UX/SLO thresholds, n/N và support roster, kế hoạch cutover/Forward Recovery. Mọi giá trị chưa được cung cấp đều giữ `UNSET`/`EVIDENCE_PENDING`.

## Bảo mật

Lưu hồ sơ NPP thật trong kênh kiểm soát truy cập riêng; repo nghiên cứu chỉ chứa schema/tài liệu và ví dụ được gắn `SYNTHETIC`. Không có yêu cầu NPP-01 đã được phỏng vấn hoặc signed trong PR #2.
