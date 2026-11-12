# R009-D — Sổ quyết định có phiên bản và ADR v1

- Baseline: `MVP-NPP01-v1.0-draft`, tạo 13/11/2026.
- Nguồn Owner: nội dung chọn Q01–Q06 trong hội thoại ngày 12/11/2026; bản tổng hợp NPP-01 ghi tiếp các nguyên tắc kho/offline/kế toán/cutover/pilot. [Nguồn và giới hạn](sources.md).
- `OWNER_DECIDED` = chính sách Owner đã chọn; **không** chứng nhận implementation, hồ sơ NPP thực, kỹ thuật API hoặc tuân thủ pháp lý.
- `DESIGN_CANDIDATE` = phương án R008 hoặc cụ thể hóa kỹ thuật R009; cần chốt riêng trong thiết kế.
- `EVIDENCE_PENDING` = khả năng/số liệu của NPP, provider, hệ thống, pháp lý chưa được chứng minh.
- Người chấp nhận: “Chủ dự án (quyết định trong trao đổi)” chỉ ở các chính sách được ghi nhận; **không thay bằng tên/chữ ký của NPP hoặc kế toán**.

## 1. Decision Register

| ID | R008/Q | Quyết định sản phẩm áp dụng v1 | Phạm vi đã quyết | Phần chưa chốt/điều kiện |
|---|---|---|---|---|
| D-01 | Q01 | Một đơn vị bán/tenant, tenant-per-database; phân biệt bên thuê SaaS và bên vận hành giao dịch | `OWNER_DECIDED` | Legal seller/MST, hàng thuộc sở hữu NPP-01: hồ sơ thực pending. |
| D-02 | Q02 | Customer chịu nợ; 0..n Outlet; ShipTo snapshot theo chứng từ | `OWNER_DECIDED` | Source ID, các quan hệ điểm bán lịch sử cần sample dữ liệu. |
| D-03 | Q03 | Hỗ trợ A, B và chuyến A+B với allocation độc lập; có thể thử chuyến riêng trước | `OWNER_DECIDED` | Mixed chưa được nghiệm thu; pre-release gate theo E2E. |
| D-04 | Q04 | Bình quân di động SKU × địa điểm tồn cho sổ vận hành; lô/FEFO, kỳ khóa, hoàn nguồn lũy kế | `OWNER_DECIDED` ở phương pháp vận hành | Kế toán bình quân kỳ vẫn là giá vốn kế toán chính thức; mapping điều chỉnh chưa xác nhận. |
| D-05 | Q05 | Pricing tự động hữu hạn, snapshot, quà theo mua ròng, waiver miễn thu hồi có duyệt/nguồn | `OWNER_DECIDED` | Chi tiết chương trình, quy tắc VAT/hóa đơn theo SKU/provider chưa chứng minh. |
| D-06 | Q06 | Ba sổ phải thu–tiền giữ hộ–tạm ứng; hạn trả theo lần giao + N ngày, snapshot terms | `OWNER_DECIDED` | N từng khách/chứng từ, quy trình duyệt hoàn ứng, thu tiền thực cần xác nhận NPP. |
| D-07 | Q07 | Một writer/chuyến; offline grant hữu hạn; ghi nhật ký bền và xử lý phục hồi chống trùng | `OWNER_DECIDED` ở nguyên tắc | TTL, cấp lại quyền, canonicalization, storage/transaction, RPO/RTO là `DESIGN_CANDIDATE`. |
| D-08 | Q08 | Hóa đơn A/B nằm trong MVP; B không được mở đầy đủ offline chỉ nhờ PWA lưu được đơn | `OWNER_DECIDED` ở phạm vi và gate | Hồ sơ B-CASE, tư vấn pháp lý NPP, phương án lập đúng thời điểm, provider/kênh còn `EVIDENCE_PENDING`. |
| D-09 | Q09 | Tách quyền hiện hành, dấu vết phục hồi và tác động bên ngoài ra khỏi rollback tenant; không khôi phục quyền đã thu hồi | `OWNER_DECIDED` ở nguyên tắc phục hồi | Sơ đồ deploy/bảo mật, đời epoch, retention, kế hoạch DR là `DESIGN_CANDIDATE`. |
| D-10 | Q10 | Cutover sạch, freeze/snapshot/đối soát đa bên; sau tác động đầu tiên không nghiệp vụ-rollback | `OWNER_DECIDED` | Cutover manifest thật, người ký, điều kiện/cửa sổ chuyển đổi pending. |
| D-11 | M05/M14 | MVP là writer kho chính cho **mọi** biến động Kho-01 sau cutover, gồm ngoài wave | `OWNER_DECIDED` | Legacy lock, đường ghi tồn, permission và thiết bị offline chưa test. |
| D-12 | M10–M12 | Thu khách, nộp quỹ, tạm ứng và hoàn/chi phải độc lập; không trừ nợ lần hai | `OWNER_DECIDED` | Profile tiền mặt/ngân hàng và ký nhận, đối soát thực pending. |
| D-13 | M13/M17 | Durable Outbox kế toán, dedup, webhook + API lookup; tiếp nhận–`POSTED`–đối soát là ba gate | `OWNER_DECIDED` ở contract nghiệp vụ | API kế toán thực, semantics `POSTED`, reconciliation file/receipt pending. |
| D-14 | M17–M19 | Một source of truth trong cutover, forward recovery, journal/ID bất biến; quyền truy cập restore phải đối chiếu hiện hành | `OWNER_DECIDED` ở policy | Fault-injection E2E trên hệ thật pending. |
| D-15 | M22 | Wave 1: 8 chuyến/ngày = 3 A + 3 B + 2 A+B, quan sát ít nhất 5 ngày; nghiệm thu theo rủi ro | `OWNER_DECIDED` | Danh sách người/chuyến, lịch/ngưỡng đo, hồ sơ giấy và kết quả vận hành chưa có. |

**Quy tắc đọc:** D-07–D-10 trong R008-SPEC là Q ứng viên trước phỏng vấn. R009 chỉ ghi `OWNER_DECIDED` ở phần **nguyên tắc** được bản tổng hợp NPP-01 ghi nhận; toàn bộ chi tiết kỹ thuật R008 chưa được thăng cấp. Không gán ngày hoặc chữ ký phê duyệt cho các sub-contract khi không có biên bản riêng.

## 2. ADR v1 (đóng băng quyết định nghiệp vụ, không đóng băng kỹ thuật)

### ADR-001 — Ranh giới một người bán và bên nợ

- **Status:** `OWNER_DECIDED`; liên quan D-01/D-02.
- **Context:** Bên thuê SaaS, doanh nghiệp/NPP, đại lý, Customer, Outlet từng bị dùng lẫn lộn.
- **Decision:** Tenant là ranh giới dữ liệu của một đơn vị bán; Customer là đối tác chịu nghĩa vụ tiền; Outlet là điểm thực địa tùy chọn; ShipTo lưu snapshot.
- **Consequences:** Customer không Outlet vẫn được giao theo địa chỉ snapshot. Đổi chủ Outlet không viết lại lịch sử. Không tự hỗ trợ nhiều pháp nhân bán trong tenant.
- **Pending:** Mapping MST, source ID thực và quyền quản lý dữ liệu theo hợp đồng.

### ADR-002 — Một chuyến A+B, quyền hàng tách biệt

- **Status:** `OWNER_DECIDED`; D-03/D-11.
- **Decision:** Trip có cùng người quản lý/custody nhưng reservation A và quota B phải có balance riêng; cấp xe không phải bán. Writer/chuyến duy nhất trong lúc offline.
- **Consequences:** Cần đối soát cấp, giao, dư và trả trước khi release quyền; quyền B không được ăn hàng đã reserve A.
- **Pending:** E2E chuyến mixed, legacy writer lock cho Kho-01 toàn phạm vi.

### ADR-003 — Hai phương pháp giá vốn có trách nhiệm khác nhau

- **Status:** `OWNER_DECIDED` về lựa chọn phương pháp; D-04.
- **Decision:** MVP ghi vận hành bằng bình quân di động SKU × location; kế toán hiện tại tính bình quân kỳ và vẫn là nguồn giá vốn kế toán chính thức.
- **Consequences:** DMS không lấy trị giá tính theo lô mua để tự nhận đang dùng FIFO cost; các khác biệt tồn/giá vốn/điều chỉnh được chuyển thành reconciliation có nguồn và kỳ.
- **Pending:** Cost mapping, phí mua biết muộn và bút toán điều chỉnh do kế toán phê duyệt.

### ADR-004 — Ba sổ tiền, không bù trừ ngầm

- **Status:** `OWNER_DECIDED`; D-06/D-12.
- **Decision:** AR Customer, custody nhân viên và advance là các ledger độc lập; thu/nộp/tạm ứng/hoàn có event/source riêng. Terms có snapshot tại xác nhận A, hạn phát sinh theo mỗi lần giao.
- **Consequences:** Handover không trừ AR lần nữa; ảnh chuyển khoản chưa xác minh không phải paid. Dư có nguồn, hoàn tiền có duyệt.
- **Pending:** Ký nhận tiền mặt, giới hạn nợ, chính sách bank settlement NPP.

### ADR-005 — Offline custody và recovery

- **Status:** `OWNER_DECIDED` ở bất biến; `DESIGN_CANDIDATE` ở cấu trúc store/API; D-07/D-09.
- **Decision:** Một writer/chuyến, journal bền tới ACK bền; idempotent command gốc; ngoại lệ cho event đã xảy ra; restore gate đọc authority hiện hành/registry tác động ngoài.
- **Consequences:** Không hứa “exactly once” bằng HTTP retry hoặc tenant DB backup. R008-T là mẫu contract để implement/spike.
- **Pending:** Transaction durability, storage isolation, TTL, restore/revoke trên browser/SQL/provider.

### ADR-006 — Hóa đơn và kế toán là hai trục độc lập

- **Status:** `OWNER_DECIDED` ở cổng nghiệp vụ; `EVIDENCE_PENDING` B fully offline; D-08/D-13.
- **Decision:** Intent hóa đơn từ sự kiện chuyển quyền, không phải từ cấp xe/thu nợ; UNKNOWN không phát lại với ID khác; accounting outbox có receipt/posted/reconciliation riêng.
- **Consequences:** `POSTED` kế toán không đủ khép đối soát; điện thoại offline không chứng minh hóa đơn hợp lệ. Phạm vi B no-channel bị chặn.
- **Pending:** Chọn provider, seller profile, sandbox, B-CASE-001/002/003, LEGAL-MEMO, contract kế toán.

### ADR-007 — Cutover sạch và Forward Recovery

- **Status:** `OWNER_DECIDED`; D-10/D-11/D-14.
- **Decision:** Snapshot + kiểm kê + freeze/manifest đủ hàng xe, nợ, custody, advance, hóa đơn ngoài, thiết bị chưa sync; sau sự kiện hiệu lực đầu tiên, sửa bằng adjustment/reversal có nguồn chứ không rollback nguồn sự thật.
- **Consequences:** Toàn bộ Kho-01 phải chuyển writer cùng lúc dù chỉ 8 chuyến dùng PWA. Mất máy/chuyến chưa sync là ngoại lệ có chủ xử lý, không suy bằng 0.
- **Pending:** Diễn tập trên system thật, ký nhận đa bên.

### ADR-008 — Wave 1 theo gate rủi ro

- **Status:** `OWNER_DECIDED`; D-15.
- **Decision:** 3 A + 3 B + 2 A+B mỗi ngày, tối thiểu 5 ngày quan sát, kiểm riêng từng mode và các điều kiện P0.
- **Consequences:** Không giảm scope dữ liệu kho theo số chuyến pilot. Nếu một mode không qua gate, không mở mode đó trên giao dịch thật; không quy đổi thành Pilot PASS chung.
- **Pending:** Chuyến/người/địa bàn, đường chứng từ, baseline, SLA/metric denominator, evidence và Owner Go/No-Go.

## 3. Kỹ thuật còn phải quyết bằng ADR triển khai

| Mã | Câu hỏi cần chốt | Không được tự mặc định |
|---|---|---|
| TADR-01 | Thiết kế bảng, index và transaction boundary của kho, ba sổ, nguồn giá vốn | Tên bảng trong R009 không phải schema phát hành. |
| TADR-02 | Canonicalization/hash, ID generator, receipt durability/worker scheduling và store ngoài rollback | Script mô hình R008 chưa phải thư viện sản phẩm. |
| TADR-03 | Provider hóa đơn và accounting adapter; webhook auth/lookup/retry, khóa hiệu ứng ngoài | Không chọn vendor dựa trên mẫu public. |
| TADR-04 | Epoch, revoked grant, support access, PrivacyActionLedger, GenerationAnchor, RPO/RTO | Một DB riêng không đủ DR hoặc quyền. |
| TADR-05 | Cutover runbook thật, legacy lock, opening import, backup recovery và ký nhận | Không rollback giao dịch thật bằng restore DB. |
| TADR-06 | Nhiệm vụ người dùng/metric, ngưỡng nghiệm thu trước Wave 1 | Không chốt ngưỡng/SLA không có dữ liệu. |

## 4. Mẫu cập nhật quyết định

Khi thay đổi, ghi tối thiểu: `decisionId`, `version`, `oldDecision`, `newDecision`, `businessScope`, `proposer`, `ownerApprover`, `acceptedAt` (chỉ khi có bằng chứng), `reason`, `affected BR/DC/API/SM/AC/EV`, `migrationPlan`, `rollbackOrForwardRecovery`. Quyết định mới không được xóa phiên bản cũ.
