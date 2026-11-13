# S4-P06 — Monitoring, xử lý sự cố và hypercare sau cutover

**Trạng thái:** đề xuất vận hành, `NOT_LIVE_MONITORED`. Ngưỡng latency, tỷ lệ hoàn tất, độ tuổi case, backlog, RPO/RTO, SLA support, thời gian trực và retention **chưa được chốt**, giữ `UNSET` cho đến EV-14.

## 1. Bản đồ quan sát (không chỉ "API healthy")

| Tín hiệu và mẫu số | Nguồn thật cần kết nối khi triển khai | Khi có nghi vấn |
|---|---|---|
| Writer lock `accepted/denied` theo UI/API/job/import/direct SQL/offline và off-wave | SQL audit, legacy job config, token/epoch, warehouseId=Kho-01 | Một write legacy hợp lệ sau C6 ⇒ P0, STOP |
| Kho MAIN/TRIP/lot/quarantine/A held/B quota, pending sync theo trip | Warehouse ledger theo source line, trip/grant/device | Diff không giải thích ⇒ ngừng mode liên quan, kiểm source |
| AR/CustomerCredit/custody/cash fund/advance, cash offered vs cashier accepted | Ba sổ ledger + bank verified + cashier acceptance | Không self-accept hoặc đánh tiền chưa xác minh là paid |
| Outbox/inbox retry, owner of durable ACK, duplicate hash conflicts, oldest pending | PWA journal/IndexedDB, server DurableInbox, SQL, queue | Ghi ID/race/epoch, tránh tự replay bằng ID mới |
| Invoice intent/request/UNKNOWN/issued/signed/submitted/delivered | Provider lookup + external registry, theo seller/mode | B_ONLINE không có channel ⇒ WAITING_INVOICE_CHANNEL; không xuất hóa đơn trùng |
| Accounting RECEIVED/POSTED/RECONCILED_OK/DIFF per source | Adapter API/FILE/MANUAL_REGISTER + read-back và cutoff | POSTED ≠ RECONCILED_OK, giữ open case |
| Privacy/membership/revoke/restore anchor | Registry hiện hành ngoài rollback, IAM/Security audit | Bất kỳ quyền hồi sinh ⇒ P0, quarantine |
| Pilot visits/UX/coverage, support workload, latency per operation | Device tested, 8 UX scripts, n/N theo mode/day | Hiển thị `asOf` và completeness, không suy số thiếu là 0 |

Dashboard/Daily close cần `asOf`, n/N source completeness, last sync, pending-by-age, case owner/next action; cho phép `CLOSED_WITH_OPEN_CASES` với reason rõ, không che giấu backlog. Không làm báo cáo doanh thu hay nợ "reconciled" nếu external evidence chưa đủ.

## 2. Triage và phản ứng

- **P0 safety/data integrity:** legacy còn ghi kho, double posting/invoice, mất hiệu ứng hàng/tiền, giao B không kênh hợp lệ, ledger âm/mất cân, revoked authority/PII hồi sinh, opening bị sai, restore/replay không kiểm soát. **Dừng writer/mode liên quan, lập incident ngay, chủ trì Ops/IT + Warehouse/Finance/Legal/Security tùy loại; P0 không waiver**.
- **P1 impact:** backlog/kênh provider gián đoạn nhưng đã có fence và không xảy ra hiệu ứng mất kiểm soát, thiếu evidence chưa đe dọa bất biến ngay, training thiết bị làm chậm. Có thể dùng **P1 exception** chỉ khi Scope + Owner + expiry + mitigation + compensating controls + reviewer rõ; không thay trạng thái evidence.
- **P2:** UX/tài liệu/đào tạo không ảnh hưởng an toàn hay nguồn ghi; theo backlog. **Phân loại theo tác động thực**, không tự hạ P0 vì thiếu tài nguyên.

Quy trình `INC-01..06`: (01) Detect/clock time zone và scope; (02) Declare severity + Incident Commander/Owner, dừng đường ghi cần thiết; (03) Preserve hashed timeline/source refs/actor/environment; (04) Triage warehouse–ledger–external registry–devices, áp stop/fence; (05) Correct forward có AP/Finance checker, read-back và regression có chủ; (06) Reopen theo AP-09/10 sau evidence/đồng ý đúng thẩm quyền, lập postmortem có action owner. Không chạy fault production để tái hiện lỗi.

## 3. Playbooks để đội trực xử lý

| Hiện tượng | Hành động đầu tiên | Tuyệt đối tránh | AC/EV/F |
|---|---|---|---|
| Provider timeout/UNKNOWN | Query invoiceRef/seller+hash, đưa ca vào queue owner | Cấp invoice ID mới để gửi lại | AC-14, EV-10, F-04 |
| Accounting POSTED nhưng lệch | Freeze affected source, lấy receipt/posted/read-back line và bridge | Gắn `RECONCILED_OK` khi thiếu diff | AC-15/19, EV-11, F-15 |
| Cashier chưa nhận nộp quỹ | Giữ offer và custody, chờ người nhận kiểm tiền | Cho collector tự accept | AC-10/20, EV-06, F-05 |
| Bank transfer pending | Giữ AR/CustomerCredit chưa giảm, verify ngân hàng | Dựa vào ảnh chuyển khoản | AC-21, EV-06, F-09 |
| Journal offline/ACK loss | Check durable server receipt + device/giấy, giữ case nếu xảy ra physical | Đánh dropped/replay lệnh khác ID | AC-11/12, EV-08/09, F-01/10 |
| Legacy writer lộ | Dừng toàn kho nếu còn quyền, bật investigation và AP-08 re-eval | Giữ legacy song song theo wave | AC-04/16, EV-04/12, F-07 |
| Restore trước revoke/privacy | Quarantine, so current external ledger, deny stale tokens | Dùng authority từ SQL snapshot | AC-13, EV-09, F-06/22 |
| Mixed chỉ A đạt | Dừng nhánh B/Mixed, không cấp BQuota | Tự suy MIXED GO | AC-03, EV-03/10 |

## 4. Hypercare & pilot observation

Trước EV-14: chỉ định incident commander, shift roster, Ops/Warehouse/Finance/Cashier/QA/provider contacts, môi trường, thiết bị, runbook và kênh hỗ trợ; cho nhân viên diễn tập 8 UX, giao tiếp lost-device, paper recovery, nộp tiền và hàng trả. Ký ngưỡng n/N/SLO/age/latency và các phương án đo **trước khi chạy**; hiện `UNSET`.

Trong pilot: mẫu NPP-01 theo D-15 là 3A + 3B_ONLINE + 2MIXED/ngày × ít nhất 5 ngày có đủ mode admitted, thống kê ngày/role/device/trip, các hoạt động kho ngoài wave, completion-rate có mẫu số, issue, hỗ trợ và chi phí. EV-15 chỉ được review **sau** pilot đã chạy thật; không lấy ngày giả lập F1 hoặc CI thay.

Daily checkpoint có owner Warehouse, Finance, Ops, Product QA: kiểm kho/ba sổ/external/bank, backlog/UNKNOWN, các ca `CLOSED_WITH_OPEN_CASES`, next action/expiry và update decision theo mode. Sau hypercare, chỉ chuyển steady state khi criteria đã ký thực và các P0 đóng bằng evidence.

## 5. Hồ sơ incident và dữ liệu nhạy cảm

Mỗi case phải có caseId, tenant/mode/trip/source IDs, detection/occurredAt (claim vs trusted time), severity, actor, reviewer độc lập, firstEffectId nếu có, timeline, current state, delta/event snapshots, artifact URI+SHA256, classification/retention, các quyết định Stop/Resume và follow-up owner. Không đưa PII, khóa bảo mật hay tài khoản provider vào PR công khai. Support cross-tenant chỉ dùng grant hiện hành được kiểm toán, không đọc dữ liệu từ snapshot đã revoke.
