# R010-S1-P01a — Phạm vi sản phẩm chuẩn, chân dung vai trò và luồng sử dụng

- **Baseline:** R009 tại HEAD của PR #1; đợt S1/P01 trong PR #2.
- **Trạng thái:** `S1_DOCUMENTED_REVIEW_PENDING`. Đây là **product design proposal**, không phải sản phẩm đã chạy, số liệu khảo sát hay chấp thuận mới của Owner.
- **Truy vết:** [R009-D](../2026-11-13-09-mvp-specification-baseline/decision-register-and-adr.vi.md), [R009-G](../2026-11-13-09-mvp-specification-baseline/glossary-and-data-contracts.vi.md), [R009-BR](../2026-11-13-09-mvp-specification-baseline/business-rules.vi.md), [R009-TR](../2026-11-13-09-mvp-specification-baseline/traceability.vi.md); [SOP](sop-a-b-mixed.vi.md), [policy](product-policy-catalog.vi.md).

## 1. Tuyên bố sản phẩm

DMS chuẩn cho nhà phân phối FMCG Việt Nam quy mô SME, **Product-First**: một cách làm chuẩn có kiểm soát, cấu hình theo tenant khi ranh giới cho phép, có danh sách khoảng cách nghiệp vụ để NPP chủ động đổi cách vận hành. Chạy web quản trị và **PWA cho nhân viên ngoài hiện trường** theo quyết định nguồn; không thay PWA thành native mặc định. Mỗi tenant một database và một người bán `LegalSeller/BusinessOperator`. `Subscriber` là bên mua dịch vụ, **không phải** `Customer` của NPP. `Customer` chịu công nợ, có 0..n `Outlet`; `ShipTo` snapshot trên chứng từ; `Trip` và `StockLocation` không đồng nhất với xe/nhân sự.

**Vấn đề giải quyết:** một chuỗi hàng–đơn–giao/bán–tiền–nợ–hóa đơn–kế toán có nguồn và trạng thái đối soát; người vận hành thấy rõ pending, exception và độ mới dữ liệu thay vì coi chưa sync = 0.

**Vùng sử dụng chính:** Module A đặt trước/giao sau (có giao từng phần); Module B bán theo xe (nhánh có kênh hóa đơn hợp lệ); Trip A+B với hàng AReservation và BQuota độc lập. Hàng trả, quà, hạn nợ, ba sổ, PWA offline có giới hạn, nhập tồn ngoài wave, cutover và outbox nằm trong MVP theo R009. B không có kênh lập hóa đơn khi mất liên lạc là **NO-GO cho giao dịch thật** cho đến khi EV-10/B-CASE/LEGAL-MEMO đạt; PWA ghi offline không tự hợp thức hóa hóa đơn.

## 2. Archetype để thiết kế, không phải chân dung đã khảo sát

| Mã | Giả định mô hình NPP | Cách dùng sản phẩm chuẩn | Không suy đoán |
|---|---|---|---|
| ARCH-A | NPP nhận đơn trước, giao chuyến sau | A order → reserve → load → delivery từng phần → AR/receipt → invoice/outbox | Không khẳng định mọi NPP bán chịu hoặc có Outlet |
| ARCH-B | NPP cho nhân viên mang hàng xe để bán tại điểm bán | B quota → load → sale/delivery/receipt → close/reconcile; online invoice channel hợp lệ | Không tự bật B no-channel hoặc tự ghi paid khi có ảnh chuyển khoản |
| ARCH-M | NPP vừa giao đơn đặt trước vừa bán linh hoạt trên một chuyến | AReservation và BQuota trên cùng trip, writer duy nhất, đối chiếu hàng–tiền theo nguồn | Chuyến hỗn hợp không được nạp quota B từ phần hàng A đã giữ |

Archetype là công cụ thiết kế để tổ chức S2 và thử nghiệm NPP khác; không phải số liệu tỷ lệ thị trường.

## 3. Người dùng, mục tiêu và ranh giới trách nhiệm

| Persona/role gợi ý | Mục tiêu công việc | Quyền/nguyên tắc phân định |
|---|---|---|
| Product/tenant owner | Phê duyệt profile, mode, cutover và các ngoại lệ có hồ sơ | Không thể tự biến gate pháp lý chưa đạt thành PASS |
| Tenant admin | Quản lý nhân sự/role/kho/điểm bán và cấu hình trong quyền | Không được chỉnh lịch sử đã post hoặc cấp quyền vượt sản phẩm |
| Sales/đặt hàng | Tạo visit, Customer/ShipTo, A order, cập nhật yêu cầu trả | Không tự nhận hàng đã giao, tiền đã nộp hay invoice đã hợp lệ |
| Warehouse clerk/manager | Nhập hàng, giữ A, quota B, cấp/thu hồi chuyến, lô/FEFO, kiểm kê | Có trách nhiệm **toàn Kho-01**, kể cả phần ngoài pilot |
| Delivery operator / trip writer | Nhận hàng, giao A, bán B trong grant, nhận tiền có nguồn, đồng bộ journal | **Một writer/trip**; lái xe riêng không tự có quyền bán/thu |
| Driver | Vận chuyển và xác nhận sự kiện vận chuyển được giao | Xe máy có thể kiêm giao/lái; xe tải có thể tách; quyền theo assignment |
| Cashier | Xác nhận đã thực nhận tiền nộp và hoàn advance, chênh lệch | Offer chưa phải acceptance; không trừ AR hai lần |
| Accountant/AR clerk | Xác minh bank, phân bổ receipt, theo dõi AR/credit/cost và đối soát outbox | `RECEIVED`, `POSTED`, `RECONCILED` khác nhau |
| Pricing/returns approver | Duyệt waiver quà, trả hàng, refund và giá ngoại lệ trong policy | Không tự bỏ qua nguồn giao hoặc ghi hàng trả thẳng available |
| Ops/support/QA | Xử lý dependency/offline, quyền, restore, incidents và evidence | Support không mặc nhiên có quyền đọc dữ liệu/ghi sổ sản xuất |

Một cá nhân có thể kiêm vai trò nếu assignment và kiểm soát phân nhiệm được chấp nhận **theo chính sách tenant**; khi cần maker–checker, cùng một cá nhân không được tự duyệt giao dịch chính mình. [Ma trận quyền](role-and-approval-matrix.vi.md) là **đề xuất phân vai**, chưa phải hệ thống RBAC đã implement.

## 4. Bản đồ thao tác một ngày (chuẩn mục tiêu)

| Mốc | Tác vụ nguồn | Chứng từ/kết quả | Đơn vị đối soát |
|---|---|---|---|
| Trước chuyến | Kiểm hồ sơ seller/role/thiết bị; stock available/lot/FEFO; A hold, B quota; chuẩn bị trip | `TripManifest`, `AReservation`, `BQuota`, `WriterGrant` | Warehouse + trip owner |
| Trên chuyến | A giao nhiều đợt; B sale/delivery/receipt, viếng thăm không đơn; nhận tiền/chứng từ thực, journal | Delivery/source IDs, receipt/custody, invoice intent; exception riêng nếu offline quá quyền | Delivery operator + Sales |
| Khi về | Unload hàng dư, hàng trả vào cách ly, đối chiếu hold/quota; offer nộp quỹ/hoàn advance | Stock transfers, quarantine, handover offers, advance offers | Warehouse + Cashier |
| Đối soát cuối ngày | Cashier nhận thực; accountant phân bổ AR/credit và kiểm invoice/outbox, posted/reconciled, giá vốn chênh | Báo cáo asOf, custody/advance balance, mismatch list, exception owner | Accountant + Ops |
| Đóng vận hành | Kiểm journal/device chưa sync, provider UNKNOWN, cutover/opening liên quan và case chưa đóng | `CLOSED` hoặc `CLOSED_WITH_OPEN_CASES` có người nhận; dashboard n/N | Tenant owner + Operations |

Không tự chốt chứng từ chưa đồng bộ bằng số 0, không tự xóa case để đóng chuyến. Chuyến không làm thay sự thật về hóa đơn/kế toán.

## 5. Phân loại phạm vi

**In-scope của S1 design:** 12 SOP [SOP-01–12](sop-a-b-mixed.vi.md), hành vi tác vụ/điểm kiểm soát, role/approval, invariant/default/feature gate, cấu hình tenant phiên bản, Product ADR dự thảo và ma trận truy vết.

**Out-of-scope của S1:** xây UI/API/database, đặt tên endpoint phát hành chính thức, file import S2, dữ liệu NPP thật, chạy AC, hợp đồng provider/thuế, ký Go-Live, nâng trạng thái EV hoặc thay đổi những quyết định Owner đã ghi trong R009.

**Deferred ngoài MVP R009:** nhiều người bán/pháp nhân trong một tenant, ký gửi nhiều chủ, ERP/sổ cái hoàn chỉnh, hoàn trả nhà cung cấp toàn diện, tối ưu tuyến tự động, AI và multi-writer. Nếu NPP cần, ghi `STANDARD_ADOPT` / `CONFIGURE` / `EXTENSION_CANDIDATE` / `BLOCKED`, không fork sản phẩm.

## 6. Các chỉ số nên đo khi có sản phẩm (không có số thực ở S1)

Đo n/N đơn giao đúng nguồn, n/N chuyến kết thúc và đồng bộ, tồn/giá trị theo kho/xe/lô, AR theo kỳ hạn, receipt unallocated, custody/advance đối soát, `UNKNOWN` invoice, `RECONCILED_DIFF` kế toán, thời gian thao tác, support ticket và n/N visit không đơn. Mỗi chỉ số có `asOf`, nguồn, mẫu số, tenant/mode và độ đầy đủ offline; **chưa đặt ngưỡng SLA** từ số liệu giả lập.

## 7. Cổng chấp nhận tài liệu

Owner cần xem xét chính sách mới ở [Product ADR](product-adrs.vi.md) và từng `PRODUCT_DEFAULT_PROPOSED` trước khi chuyển sang `PRODUCT_DEFAULT_ACCEPTED`. S1 chỉ chứng minh tài liệu đã được biên soạn/đối chiếu, không chứng minh hành vi chạy thật. S2 thiết kế template dựa trên [tenant profile logical schema](tenant-profile-schema.vi.md) và phải giữ nguyên source/event identity.
