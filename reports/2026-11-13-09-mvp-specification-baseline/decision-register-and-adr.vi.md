# R009-D — Sổ quyết định có phiên bản và ADR v1

- Baseline: `MVP-NPP01-v1.0-draft`, tạo 13/11/2026.
- Nguồn Owner: Q01–Q06 là lựa chọn trong hội thoại ngày 12/11/2026 (chưa có transcript nguyên văn lưu repo); phần còn lại được ghi trong **bản tóm lược nguyên văn** [SRC-NPP-01](sources/npp-01-interview-summary-2026-11-12.original.txt). Đây không phải biên bản hỏi–đáp đầy đủ Mục 153–202. Xem [mức mạnh chứng cứ theo từng D](#11-truy-vết-quyết-định-đến-nguồn-có-thể-kiểm-tra) và [nguồn/giới hạn](sources.md).
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
| D-07 | NPP-summary | Một writer/chuyến; offline grant hữu hạn; ghi nhật ký bền và xử lý phục hồi chống trùng | `OWNER_DECIDED` ở nguyên tắc | TTL, cấp lại quyền, canonicalization, storage/transaction, RPO/RTO là `DESIGN_CANDIDATE`. |
| D-08 | NPP-summary | Hóa đơn A/B nằm trong MVP; B không được mở đầy đủ offline chỉ nhờ PWA lưu được đơn | `OWNER_DECIDED` ở phạm vi và gate | Hồ sơ B-CASE, tư vấn pháp lý NPP, phương án lập đúng thời điểm, provider/kênh còn `EVIDENCE_PENDING`. |
| D-09 | NPP-summary | Tách quyền hiện hành, dấu vết phục hồi và tác động bên ngoài ra khỏi rollback tenant; không khôi phục quyền đã thu hồi | `OWNER_DECIDED` ở nguyên tắc phục hồi | Sơ đồ deploy/bảo mật, đời epoch, retention, kế hoạch DR là `DESIGN_CANDIDATE`. |
| D-10 | NPP-summary | Cutover sạch, freeze/snapshot/đối soát đa bên; sau tác động đầu tiên không nghiệp vụ-rollback | `OWNER_DECIDED` | Cutover manifest thật, người ký, điều kiện/cửa sổ chuyển đổi pending. |
| D-11 | M05/M14 | MVP là writer kho chính cho **mọi** biến động Kho-01 sau cutover, gồm ngoài wave | `OWNER_DECIDED` | Legacy lock, đường ghi tồn, permission và thiết bị offline chưa test. |
| D-12 | M10–M12 | Thu khách, nộp quỹ, tạm ứng và hoàn/chi phải độc lập; không trừ nợ lần hai | `OWNER_DECIDED` | Profile tiền mặt/ngân hàng và ký nhận, đối soát thực pending. |
| D-13 | M13/M17 | Durable Outbox kế toán, dedup, webhook + API lookup; tiếp nhận–`POSTED`–đối soát là ba gate | `OWNER_DECIDED` ở contract nghiệp vụ | API kế toán thực, semantics `POSTED`, reconciliation file/receipt pending. |
| D-14 | M17–M19 | Một source of truth trong cutover, forward recovery, journal/ID bất biến; quyền truy cập restore phải đối chiếu hiện hành | `OWNER_DECIDED` ở policy | Fault-injection E2E trên hệ thật pending. |
| D-15 | M22 | Wave 1: 8 chuyến/ngày = 3 A + 3 B + 2 A+B, quan sát ít nhất 5 ngày; nghiệm thu theo rủi ro | `OWNER_DECIDED` | Danh sách người/chuyến, lịch/ngưỡng đo, hồ sơ giấy và kết quả vận hành chưa có. |

**Quy tắc đọc:** Các nhãn Q07–Q10 và M05–M22 là tham chiếu lịch sử/khung hỏi của R008 và hội thoại, **không phải vị trí câu hỏi hay trích dẫn nguyên văn trong SRC-NPP-01**. D-07–D-15 mang `OWNER_DECIDED` **chỉ ở nguyên tắc ghi trong tóm lược**, với `sourceStrength=SUMMARY_ONLY`; chưa có transcript để xác minh từng mệnh đề chi tiết. Cần Owner rà soát/nhận phiên bản cụ thể trước khi khóa baseline cho source PR. Chi tiết R008/định lượng, pháp lý và các TADR giữ `DESIGN_CANDIDATE/EVIDENCE_PENDING`. Không tự gán chữ ký hay xác nhận của NPP/thủ quỹ/kế toán.

### 1.1. Truy vết quyết định đến nguồn có thể kiểm tra

`SRC-NPP-01:Lx-Ly` chỉ **dòng trong tệp nguyên văn** tại [R009/source](sources/npp-01-interview-summary-2026-11-12.original.txt), không phải số thứ tự Mục phỏng vấn. `CHAT-Q01..Q06` là phát biểu chọn phương án của Owner trong hội thoại dự án nhưng chưa lưu transcript nguyên byte; không được giả làm dòng trong SRC. R008 là mô hình/ứng viên, không phải bằng chứng Owner ký duyệt.

| D | sourceRef/vị trí | Phạm vi lời chọn có thể khẳng định | Mức nguồn và còn thiếu |
|---|---|---|---|
| D-01 | CHAT-Q01; SRC-NPP-01:L52 | Một bên bán/tenant và ranh giới seller | CHAT_REPORTED + SUMMARY; hồ sơ pháp nhân/chủ hàng thực pending |
| D-02 | CHAT-Q02; SRC-NPP-01:L52 | Customer 0..n Outlet, ShipTo snapshot | CHAT_REPORTED + SUMMARY; mapping nguồn chưa có |
| D-03 | CHAT-Q03; SRC-NPP-01:L52,L71 | A+B phân bổ riêng, có thể thử chuyến riêng trước | CHAT_REPORTED + SUMMARY; mixed E2E chưa chạy |
| D-04 | CHAT-Q04; SRC-NPP-01:L54 | Bình quân di động SKU×location cho vận hành; kế toán bình quân kỳ | CHAT_REPORTED + SUMMARY; hạch toán/chênh kỳ còn mở |
| D-05 | CHAT-Q05; R008-B §5 (ứng viên thuật toán) | Pricing hữu hạn, quà ròng, waiver có duyệt | CHAT_REPORTED; bản tóm lược không chứa quy tắc tính/tax chi tiết; cần transcript/profile |
| D-06 | CHAT-Q06; SRC-NPP-01:L55 | Ba sổ và hạn theo mỗi delivery + N ngày | CHAT_REPORTED + SUMMARY; không có hồ sơ hạn/phiếu thu NPP |
| D-07 | SRC-NPP-01:L56,L69 | Một writer, grant hữu hạn, journal/recovery chống trùng | SUMMARY_ONLY; Q07 nguyên văn/TTL/durability chưa có |
| D-08 | SRC-NPP-01:L67,L82 | B fully-offline là P0 phải chứng minh; gate NO-GO khi chưa có bằng chứng | SUMMARY_ONLY; Q08 nguyên văn, B-CASE/LEGAL-MEMO pending, không kết luận ngoại lệ pháp lý |
| D-09 | SRC-NPP-01:L56,L69 | Phục hồi chống trùng và authority không hồi sinh quyền | SUMMARY_ONLY + R008-T ứng viên; Q09/epoch/DR chưa có chứng cứ hệ thật |
| D-10 | SRC-NPP-01:L58,L70 | Cutover đối soát, snapshot, Forward Recovery | SUMMARY_ONLY; Q10/manifest và ký xác nhận NPP pending |
| D-11 | SRC-NPP-01:L68,L80 | Writer MVP độc quyền **toàn Kho-01**, cả ngoài Wave 1 | SUMMARY_ONLY; chưa thử chặn đường ghi hệ cũ |
| D-12 | SRC-NPP-01:L55,L82 | Phải thu, custody, advance tách sổ; handover không trừ AR lần hai | SUMMARY_ONLY; chứng từ thủ quỹ/chi duyệt NPP pending |
| D-13 | SRC-NPP-01:L57,L82 | Outbox và ba gate tiếp nhận–POSTED–đối soát | SUMMARY_ONLY; webhook/API kế toán thật pending |
| D-14 | SRC-NPP-01:L58,L69-L71 | Restore/cutover giữ sự thật và nguồn hiệu ứng ngoài | SUMMARY_ONLY; chưa có fault-injection E2E thực |
| D-15 | SRC-NPP-01:L59,L111 | Wave1 3A+3B+2 mixed/ngày, tối thiểu 5 ngày | SUMMARY_ONLY; lịch, tập người, kết quả thực pending |

**Điều kiện khóa baseline:** giữ các chính sách này làm giả định Owner ở mức đã chọn để viết đặc tả; không chuyển các cụ thể hóa R008/R009 hoặc kết quả pilot thành `OWNER_DECIDED` chỉ bởi liên kết. Nếu Owner bổ sung transcript/biên bản, cập nhật sourceRef và version, không sửa tệp nguồn nguyên văn.

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
