# R009-PLAN — Kế hoạch triển khai MVP Specification Baseline v1 và pilot NPP-01

- **Ngày lập:** 13/11/2026; đây là execution plan **đề xuất**, chưa phải commit triển khai source hay lịch được NPP cam kết.
- **Nguồn:** [NPP-01](npp-01-tong-hop-quyet-dinh-va-khoang-trong-mvp-2026-11-12.vi.md), [D/ADR](decision-register-and-adr.vi.md), [traceability](traceability.vi.md), [AC/EV](acceptance-tests-and-evidence.vi.md) và hồ sơ [R008](../2026-11-12-08-khep-quy-tac-va-dac-ta-mvp/report.vi.md).
- **Chìa khóa:** D → BR → DC → API/SM → AC → EV; mỗi PR phải chỉ rõ đường này. Không thêm module DMS trước khi khép scope P0/P1.

## 1. Năm đợt và deliverables

| Đợt / mục tiêu | Work package | Deliverable/DoD để qua đợt | Trạng thái |
|---|---|---|---|
| **1. Baseline** | WP-01 Sổ quyết định + glossary, BR, DC, API/SM, AC/EV, trace | Có tài liệu phiên bản, link đúng, trạng thái chốt/pending minh bạch; Owner review nội dung trước khi khóa baseline | **Tài liệu đã soạn**, `OWNER_REVIEW_PENDING` |
| **2. Dữ liệu và tích hợp NPP-01** | WP-02 Seller/accounting/provider profile, data sample + permission; WP-03 inventory writer lock + cost mapping | Có mẫu dữ liệu được phép dùng, contract đối tác, sơ đồ mọi đường ghi Kho-01; proof/case chưa đạt không bị ngụy trang | `NOT_STARTED` ngoài nghiên cứu |
| **3. Vertical Slice A+B E2E** | WP-04 tenant/master; WP-05 inventory/order/trip; WP-06 sale/receipt/AR/custody/advance/return; WP-07 offline; WP-08 invoice/accounting outbox | Actual E2E trên PWA, API, SQL và adapters; AC có testRunId/ledger diff; negative paths/case queue có owner | `NOT_STARTED` |
| **4. Cutover rehearsal + Go/No-Go** | WP-09 manifest/preview/approval/import/writer release, restore/fault drills | EV-04/08/09/12 và các gate pháp lý/tích hợp theo mode; xác nhận ký đa bên, forward recovery; No-Go nơi P0 pending | `NOT_STARTED` |
| **5. Wave 1 đo thực** | WP-10 8 chuyến/ngày × ≥5 ngày, all Kho-01 writes on MVP; observe UX/SLO/support cost | EV-15, n/N, đối soát theo cutoff, case owners, mode-specific decision signed | `NOT_STARTED` |

**Giới hạn:** Đợt 2 **không đóng** B-CASE chỉ bằng việc tìm hiểu kỹ thuật; giữ `EVIDENCE_PENDING` cho tới khi có seller profile, văn bản/đối chiếu áp dụng NPP và thử kênh thực. Có thể hoàn thành phần A/stock/offline/test và B online đã chứng minh mà không tuyên bố B no-channel được phép.

## 2. Backlog kỹ thuật theo thứ tự phụ thuộc

| ID | Ưu tiên | Đầu việc giao phát triển | DoR trước khi nhận PR | DoD/AC/EV |
|---|---|---|---|---|
| DEV-01 | P0 | Tenant identity/authority, DB isolation, business seller profile | D-01, DC-01/17; TADR auth | AC-01/EV-01; test quyền sau revoke/restore |
| DEV-02 | P0 | SKU/UoM/lot/stock ledger, A reserve/B quota, one writer Kho-01 toàn phạm vi | D-03/11, seller/supply sample, legacy write inventory | AC-03/04/05; EV-03/04 |
| DEV-03 | P0 | A order–confirm–partial delivery, due per installment | D-02/03/06, BR-03/10, DC-05/09 | AC-02/03/08; EV-02/03/06 |
| DEV-04 | P0 | B sale–delivery–receipt transaction, three ledgers, customer credit | BR-11/12/13/14, transaction TADR và grant limits | AC-09/10; EV-06/08 |
| DEV-05 | P0 | Offline journal/inbox/ACK/dependency/idempotency/one writer/restore | R008-T, DC-13/17, TADR-02/04 | AC-11/12/13; EV-08/09 |
| DEV-06 | P0 | Cutover preview/import + full writer lock + Forward Recovery | Manifest/cutoff/owner/source registry, device inventory | AC-04/10/16; EV-04/12 |
| DEV-07 | P0 mode B | Invoice intent/external registry, seller/provider preflight, B-CASE gate | EV-10 hồ sơ thật để *mở nhánh giao dịch*; phát triển adapter/test có thể sớm hơn | AC-14; INV-01–09 real, B-CASE/LEGAL-MEMO theo phạm vi |
| DEV-08 | P1 | Accounting Durable Outbox; adapter API/webhook/lookup hoặc file register và reconciliation | Accounting system actual contract, mapping + accounting approver | AC-15; EV-11 |
| DEV-09 | P1 | Moving-average cost + source-return adjustments + period-cost reconciliation | D-04, sample cost data, accounting rules | AC-06/07; EV-07 |
| DEV-10 | P1 | Returns/quarantine, pricing/gifts/waiver, visits/no-order, ops queue/metrics | D-05, source/approval policy, fixtures/test tasks | AC-05/07/17; EV-05/13 |
| DEV-11 | P1 | Cutover/production readiness: runbooks, monitoring, backups & restore drill, hardening | Infra topology, RPO/RTO, key/registry policies, target devices | EV-08/09/12/14 |
| DEV-12 | P2 | Baseline usability/cost and willingness-to-pay measurement | Cohort/owners/tasks/prepilot baseline | EV-13/15, no invented payback |

Không suy việc tài liệu có lời giải thành kỹ thuật Done. Có thể chia PR theo Vertical Slice, nhưng mỗi slice phải giữ toàn vẹn ledger, idempotency và evidence của nó; không để phần nợ/chứng từ chờ vô thời hạn “sẽ xử lý sau”.

## 3. Vai trò xác nhận và phân công theo phạm vi

| Vai trò | Cần chấp nhận/ghi nhận |
|---|---|
| Product Owner | Policy D, phạm vi các mode, tiêu chí đo, ngoại lệ được phép; cuối cùng Go/No-Go. |
| Kế toán NPP | AR/terms/receipt allocation, cost accounting chính thức, phương pháp export/import, invoice seller/provider, reconciliation. |
| Thủ quỹ/người quản lý tiền | Custody/handover, tiền thiếu, advance/hoàn ứng, chứng từ ký nhận. |
| Kho và trưởng chuyến | Kho-01 toàn phạm vi, lô/FEFO, A reserve/B quota, kiểm kê, trip/vehicle manifest và mở/đóng writer. |
| IT/ops/QA | PWA devices, SQL/inbox/outbox/backup, fault injection, legacy writer block và artifact evidence. |
| Provider/tư vấn pháp lý có thẩm quyền | Seller profile, B-case lập hóa đơn đúng mốc, sandbox/ngoại lệ và văn bản áp dụng. Không thay bằng suy luận dev. |
| Nhân viên giao/bán thực tế | Thử task, offline UX, chứng từ giấy/ngoại lệ, quy tắc xe máy/xe tải. |

## 4. Go-Live cutover checklist bắt buộc

1. **Preflight source:** danh sách mọi writer Kho-01, bao gồm legacy DB/UI/API/import/job/thiết bị offline và hoạt động ngoài wave; chốt thời điểm freeze; người chịu trách nhiệm từng nguồn.
2. **Manifest:** hàng Kho-01 theo SKU×location×lot×status, hàng trên xe, A hold/B quota, Customer open AR+credit, custody, advance, invoice/external links, đơn/chuyến dở, tất cả installation journal/receipt/epoch.
3. **Kiểm kê & đối chiếu:** số lượng/số dòng/hash, tiền, nợ, ký nhận đa bên. Trường hợp máy không liên lạc có case chờ; không coi “không thấy” = “không tồn tại”.
4. **Import preview:** reject/mismatch ID/hash, FK/UoM thiếu, duplicates, amount not balanced; không im lặng sửa. Opening từ lịch sử không replay phiếu thu/giao cũ.
5. **Post/open:** chỉ sau chữ ký mới mở writer mới và chặn write cũ toàn phạm vi; một business event đã phát sinh = `FORWARD_ONLY`.
6. **Diễn tập:** replay crash, offline cũ đến muộn, phát hành hóa đơn rồi restore, quyền revoked, tiền thiếu, stock ngoài wave; có evidence và owner case.
7. **Mode admission:** A, B online, B no-channel và mixed có quyết định riêng, kiểm EV-10/EV-12 theo mode; không ép full A+B Go-Live khi B no-channel P0.

## 5. Mẫu pilot Wave 1 và tiêu chí đo

**Thiết kế được Owner chọn:** mỗi ngày 3 chuyến A + 3 chuyến B + 2 chuyến A+B, quan sát **tối thiểu 5 ngày**. Chuyến mixed không được coi đã nghiệm thu nếu trước đó chỉ thử chuyến riêng. Nếu mode B no-channel chưa được chấp nhận, không đưa giao dịch thật ở nhánh đó vào pilot; thay đổi kịch bản/coverage cần Owner ghi rõ, không đổi số lượng đã thống nhất ngầm.

Đo theo `cohort/date/tripType/device/network condition`:
- n/N chuyến hoàn tất và n/N chứng từ đã đồng bộ; latency từ `occurred`→`acceptedDurably`→`posted`→`reconciled`.
- Chênh hàng theo SKU×location×lot, A held/B quota; chênh AR, custody, advance, tiền nộp và sổ kế toán theo cutoff.
- Hóa đơn `UNKNOWN`, timeout, bằng chứng lập đúng mốc, đối chiếu provider, case tuổi và owner.
- Task times/no-order visits, retry cần can thiệp, lỗi browser/thiết bị, giờ mất mạng, số lần cần hotline/sửa dữ liệu.
- Chi phí phục vụ mỗi tenant: nhân sự hỗ trợ/triển khai, hạ tầng, provider/integration, case remediation; đo dữ liệu thực, không mặc định tỷ lệ lời SaaS từ báo cáo tổng quan.

**Ngưỡng chấp nhận số cụ thể:** phải được Owner và người chịu trách nhiệm nghiệp vụ ký trước pilot theo `EV-14`; R009 không tự phát minh SLA hay tỷ lệ thành công. Một metric thiếu mẫu số/coverage chỉ báo **chưa đủ dữ liệu**, không là PASS.

## 6. Definition of Ready / Done cho một PR source

**DoR:** link D/BR/DC/API/SM/AC; Owner policy status; payload/source IDs, authority, transaction boundary, exact failure semantics; fixtures expected, môi trường test, phần dependency/case người nhận. Nếu hóa đơn/seller không có hồ sơ, chỉ nhận PR nháp/test/adapter không kích hoạt B no-channel thật.

**DoD:** code+contract tests trên source HEAD; concurrency/retry/crash/regression theo affected BR; bảo vệ tenant/permission; không làm thay đổi history/giá/nợ sau post; evidence references và residual risks; migration/forward correction nếu có; reviewer ký AC theo phạm vi, không self-accept legal/finance.

## 7. Handoff và trạng thái đóng gói tài liệu

- Repo hiện tại vẫn là **repository nghiên cứu/đặc tả**, không phải app source repository.
- Đợt 1 cung cấp **tài liệu ứng viên v1**. Không có commit source/test integration/pilot thực trong R009.
- Những việc cần xác nhận tiếp: Owner duyệt baseline policy/technical boundaries, NPP cung cấp data/seller/provider/legacy write inventory, kế toán xác nhận period cost và outbox, ops cung cấp hạ tầng/thiết bị/restore requirements.
- B-CASE và LEGAL-MEMO giữ pending cho tới khi có hồ sơ; không viết “đã khép” chỉ vì báo cáo đã được commit vào PR.
