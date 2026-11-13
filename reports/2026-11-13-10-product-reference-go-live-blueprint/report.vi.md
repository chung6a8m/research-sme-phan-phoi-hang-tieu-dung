# R010 — Product Reference Baseline & Go-Live Blueprint: lộ trình đề xuất v0.1

**Ngày:** 13/11/2026. **Status:** ROADMAP_PROPOSED. Đây là lộ trình tài liệu và chuẩn bị sản phẩm, không phải chứng nhận nghiệm thu hay Go-Live.

**Đầu vào được đọc:** [R009](../2026-11-13-09-mvp-specification-baseline/report.vi.md), [Decision/ADR](../2026-11-13-09-mvp-specification-baseline/decision-register-and-adr.vi.md), [BR](../2026-11-13-09-mvp-specification-baseline/business-rules.vi.md), [DC](../2026-11-13-09-mvp-specification-baseline/glossary-and-data-contracts.vi.md), [API/SM](../2026-11-13-09-mvp-specification-baseline/api-and-state-machines.vi.md), [AC/EV](../2026-11-13-09-mvp-specification-baseline/acceptance-tests-and-evidence.vi.md), [Pilot Plan](../2026-11-13-09-mvp-specification-baseline/implementation-and-pilot-plan.vi.md). Đề bài ở [B010](../../briefs/2026-11-13-10-product-reference-go-live-blueprint.md).

## 1. Kết luận chiến lược

Chuyển từ **NPP-01 chi phối quy trình** sang **Product-First, Opinionated DMS**: phần lõi là chuẩn chung, tenant chỉ cấu hình những tham số hữu hạn. NPP-01 là đối tượng onboarding, không phải nguồn duy nhất quyết định cách bán hàng, lập chuyến, thu tiền hay ghi kho của tất cả nhà phân phối.

R009 đã có 15 quyết định (D-01–15), 24 BR, 18 DC, 12 API, 10 State Machines, 21 AC và 15 nhóm evidence. Khoảng trống lớn ở cấp sản phẩm là: (a) SOP và default profile chưa định nghĩa thành quy trình sử dụng ngay; (b) chưa có template nhập liệu máy đọc được; (c) chưa có bộ tenant giả lập xuyên suốt; (d) thiếu onboarding/gap assessment đa NPP; (e) cần phát biểu cổng release và Go-Live tách bạch.

**Không chờ NPP-01:** quyết định cách hệ thống chuẩn xử lý và tạo dữ liệu giả lập đủ để phát triển. **Không thể giả lập thay thế:** seller/provider/legal profile, số dư thực và chữ ký, độc quyền writer, E2E thiết bị/provider/SQL, restore và pilot thật.

## 2. Ba tầng quyết định sản phẩm

| Tầng | Phạm vi | Ví dụ |
|---|---|---|
| L0 — Product invariants | Không tắt hoặc override theo tenant | Một seller/tenant & database-per-tenant; Customer chịu nợ khác Outlet/ShipTo; event/source bất biến, không double-post; AReservation khác BQuota; ba sổ AR/custody/advance; only-one-stock-writer; posted adjustment phải có nguồn; quyền restore kiểm authority hiện hành |
| L1 — Product defaults và bounded configuration | Định nghĩa mặc định + phạm vi cấu hình + effective/version | Hạn nợ N ngày theo delivery, giá theo nhóm và thời điểm, quy tắc quà hữu hạn, kho/xe/role, điều kiện UoM/lot/FEFO, lịch đối soát, trường xuất hóa đơn, accounting adapter đã verified, credit limit và approvals |
| L2 — Business exception | Có yêu cầu, owner, source, quyết định và test riêng | NPP đổi thao tác theo chuẩn; dùng profile; tạo backlog extension/ADR; hoặc BLOCKED do vượt scope/an toàn/pháp lý |

Những gì đã OWNER_DECIDED trong R009 được giữ nguyên trong phạm vi ghi nhận. Default đề nghị mới gắn PRODUCT_DEFAULT_PROPOSED cho tới khi Owner duyệt; dữ liệu giả lập mang SYNTHETIC_FIXTURE; hợp đồng kế toán/provider và tuân thủ từng NPP là EVIDENCE_PENDING cho tới khi kiểm chứng.

## 3. Phạm vi chuẩn v1 và gợi ý default

| Nghiệp vụ | Golden path đề xuất | Ranh giới |
|---|---|---|
| Tenant | Một người bán hợp pháp, một tenant/DB; hồ sơ seller/profile version | Không tự định danh pháp nhân theo tên Subscriber |
| Khách hàng | Customer 0..n Outlet; ShipTo snapshot ngay chứng từ | Không bắt tạo Outlet giả |
| Module A | Order xác nhận giữ A; nhiều delivery; AR theo thực giao; due date delivery + N | Confirm order không tự tạo sale/AR |
| Module B | B bán/giao/thu một compound command; ưu tiên B có kênh hóa đơn online hợp lệ | No-channel B mặc định DISABLED; B-CASE/LEGAL-MEMO pending |
| Mixed A+B | Cùng trip, hai quota/hold riêng, writer đơn độc, load/unload là chuyển kho | Chỉ mở sau E2E mixed & đối soát |
| Kho & giá vốn | SKU/UoM/lot/FEFO, hàng trả cách ly, moving average theo SKU × location; kế toán có phương pháp kỳ riêng | Chi phí trả/điều chỉnh giữ giá trị nguồn; không coi xuất xe là COGS |
| Giá & quà | Price snapshot, discount hữu hạn, quà theo mua ròng, waiver phải duyệt | VAT theo SKU/seller/pháp luật thực; không áp thuế từ fixture mẫu |
| Tiền & tín dụng | Phải thu, tiền giữ hộ, tạm ứng tách sổ; receipt verified, credit dư, cashier accept handover | Bank pending không là paid; không trừ AR khi nộp quỹ |
| Offline PWA | Một writer/trip, grant hữu hạn, bền journal/inbox/receipt, exception thực giao quá quyền | TTL, browser durability và restore phải E2E, không tuyên bố offline trên mọi mode |
| Hóa đơn/kế toán | Intent từ giao dịch thực, provider UNKNOWN cần lookup; outbox và RECEIVED/POSTED/RECONCILED khác nhau | Mock chỉ là test, chưa thay vendor/legal sign-off |
| Cutover | Snapshot + import preview + kiểm kê/đa bên duyệt, khóa mọi legacy writer toàn kho, forward recovery sau effect đầu tiên | Pilot 8 chuyến không giới hạn phạm vi dữ liệu kho |

Những số lượng và lịch pilot NPP-01 (3 A + 3 B + 2 mixed mỗi ngày, tối thiểu 5 ngày) thuộc **pilot profile NPP-01**, không phải constraint sản phẩm áp đặt mọi tenant.

## 4. Lộ trình S0–S6

| Chặng | Nội dung công việc | Deliverable và gate | Phụ thuộc NPP thật |
|---|---|---|---|
| **S0 — Kickoff** | B010, R010, catalog template/fixture, nguồn/giới hạn và nhánh PR mới từ HEAD PR #1 | Ranh giới sản phẩm/tenant/evidence và backlog rõ, chỉ đánh dấu roadmap done | Không |
| **S1 — Product Standard** | P01 SOP A/B/mixed, kho–thu–nợ–returns–visit; P02 default/policy catalog, roles/approvals, ADR | Mỗi BR có workflow, policyVersion, owner, override boundary, negative behavior; không sửa R009 ngầm | Không để soạn; cần Owner approve mới khóa |
| **S2 — Data Foundation** | P03 template nhập liệu CSV/XLSX có data dictionary/validator; P04 fixture deterministic F0/F1/F2, import dry-run và oracle | Không orphan, FK/source IDs đúng, số dư xuyên sổ cân, có seed/checksum | Không để làm mẫu |
| **S3 — Acceptance & Quality** | P05 BDD/Gherkin scenarios, AC→fixture/test mapping, concurrency/retry/restore/cutover negative cases, evidence schema | AC-01–21 và EV-01–15 có kịch bản/đầu ra và run mẫu; không gọi MODEL_ONLY là product test | Không để viết; có để chạy E2E |
| **S4 — Operations** | P06 onboarding/cutover/backup-restore/monitoring/support/hypercare; P08 seller/invoice/accounting/privacy preflight | Runbook, RACI, danh sách cổng legal/provider/stock/offline và mẫu ký | Không để viết; có để chấp nhận |
| **S5 — Adoption and Freeze** | P07 NPP gap matrix và profile, tổng duyệt Product Baseline v1 candidate | Chọn tuân chuẩn / cấu hình / extension / blocked; Owner chấp nhận chính sách, chốt version | Chỉ phần NPP thật |
| **S6 — Build/Release/Pilot** | Source PR, API/DB/PWA real tests, vendor sandbox, production preflight, cutover rehearsal, pilot và quyết định mode-specific | PRODUCT_VERIFIED và TENANT_GO_LIVE_ACCEPTED có testRunId, commit, environment, evidence, chữ ký | Có, bắt buộc |

**Đề xuất thực thi:** S1 và S2 có thể song song sau S0; S3 dùng bộ fixture S2; S4 soạn trước khi API thực xong nhưng không được ký PASS; S5 tách product approval khỏi acceptance NPP. S6 là một chương trình triển khai riêng, không tự hoàn thành vì tài liệu đã có. Kế hoạch thời gian chi tiết chỉ lập khi có team/nguồn lực; không tự cam kết mốc Go-Live.

## 5. Backlog gói tài liệu P01–P08

| Gói | Nhóm tài liệu đích | DoD tối thiểu |
|---|---|---|
| P01 | Product scope, personas, A/B/mixed SOP, role/permission/approval matrix, daily close | Tác vụ đầu-cuối, actor, data/source, handoff và ngoại lệ |
| P02 | Versioned product policy catalog, tenant profile schema, feature gates, Product ADR | Hard invariants vs configurable vs extension minh bạch |
| P03 | Data dictionary, mẫu Excel/CSV theo domain, import schema, validation/errors, dry-run reconciliation | Cột bắt buộc, sample, FK/enum, nguồn, không tự sửa record sai |
| P04 | Smoke/reference/volume fixtures, deterministic generator, expected ledger timeline, manifest/checksum | Kịch bản tái lập, không mất phần dư hay double-post |
| P05 | Test matrix, positive/negative Gherkin, oracle, evidence record, validator truy vết | D/BR/DC/API/SM/AC/EV → policy/template/test/gate, không orphan |
| P06 | Tenant onboarding, cutover, backup/restore, support triage, incident/hypercare và training | RACI, preflight, freeze, first effect/forward correction và mode decision |
| P07 | NPP archetype, questionnaire/gap assessment, tenant adoption profile | Không biến việc riêng NPP-01 thành mặc định toàn sản phẩm |
| P08 | Invoice seller/provider/legal preflight, accounting adapter & reconciliation, privacy checklist | Trường cần người có thẩm quyền xác nhận; không tự gắn VERIFIED |

Danh mục cột và bộ số liệu gợi ý đã được phác trong [R010-F](template-catalog-and-fixtures.vi.md). **Chưa có các file template/fixture hoàn chỉnh trong S0.**

## 6. Fixture tiêu chuẩn đề xuất

- **F0 Smoke:** 1 tenant, 1 kho, 12 SKU, 6 Customer (ít nhất 2 không Outlet), 2 xe, 3 trip A/B/mixed; xác nhận nhập danh mục, source ID, trừ tồn, AR, custody, tạm ứng.
- **F1 Reference:** 1 tenant, 1 kho, 50 SKU, 40 Customer, 55 Outlet, 8 trip/ngày × 5 ngày; kịch bản có giao nhiều lần, thu phân bổ, hàng trả, quà, công nợ, báo cáo asOf; **quy mô giả định để thiết kế dữ liệu**, không chứng minh throughput.
- **F2 Volume/Fault:** nhiều tenant DB tách biệt, seed có thể tăng, tranh quyền/grant, thiết bị rớt mạng, server restart, restore, source conflict; chưa có benchmark thực.

Giữ oracle R009 cho AC-03: MAIN 100 đơn vị, value 1.000, A giữ 40/B quota 30, B giao 20/cash 200, A giao 25, cuối AR_A 375/AR_B 100, custody sau nộp 0, COGS 450, tổng hàng tồn 55 sau xe về. Giữ AC-19 giá/discount/VAT/partial return; AC-20 advance 500.000 duyệt chi 300.000 hoàn 2×100.000; AC-21 receipt 60.000 phân bổ 20.000+15.000, credit 25.000. Mọi số liệu là **synthetic/model**; rate VAT minh họa không được xuất hóa đơn thật.

## 7. Ba loại 'sẵn sàng' không được đánh đồng

1. **DOC_READY:** policy, SOP, template, fixture/validator, test matrix và runbook qua review tài liệu; độc lập input NPP-01.
2. **PRODUCT_RELEASE_CANDIDATE:** có build/CI, test PWA + API + DB + provider/accounting adapter theo scope, concurrency/retry/restore/integration evidence thật. Một script số học không đủ.
3. **TENANT_GO_LIVE_ACCEPTED:** seller/tax/provider hợp lệ; dữ liệu thật được phép dùng; opening balances theo nguồn được ký; chỉ một writer toàn kho; thiết bị chưa sync có case; DR và cutover rehearsal; pilot đủ coverage và người có quyền Go/No-Go **riêng A, B online, B no-channel, mixed**.

Các gate bất biến **G-INV** (hóa đơn B no-channel), **G-STOCK** (writer toàn kho), **G-IDEMP** (offline/replay), **G-CUT** (opening và forward recovery), **G-LEDGER** (AR/custody/advance, đối soát kế toán) là P0 theo scope. Đề xuất yêu cầu 0 double-post, 0 mất cân ledger trong golden tests, 0 P0 mở trong mode được bật và đầy đủ sign-off số dư cutover. Đây là **ngưỡng đề xuất Owner duyệt**, không phải kết quả/chuẩn hiệu năng đã được đo.

## 8. Tiêu chí đóng PR tài liệu hoàn chỉnh

- [ ] P01 và P02 có product policy, SOP, approval/version, mapped R009 D/BR không mâu thuẫn ngầm.
- [ ] P03 có file template thực, data dictionary, import dry-run và lỗi mẫu.
- [ ] P04 có fixture file/seed/checksum, validator và expected ledger theo từng event.
- [ ] P05 mapping AC-01–21, EV-01–15, negative/concurrency/restore/cutover scenarios.
- [ ] P06 có đầy đủ runbook, RACI, training, monitoring, support, cutover/forward recovery, gate theo mode.
- [ ] P07 có form onboarding/gap NPP và cách xử lý khi lệch chuẩn.
- [ ] P08 có preflight hồ sơ legal/provider/accounting/privacy, chưa tự biến pending thành signed.
- [ ] Owner product-baseline acceptance có record độc lập (khi thực sự ký); link/format/trace validators pass.
- [ ] Có handoff sang source repo và nêu rõ DOC_READY **không** phải PRODUCT_VERIFIED hoặc TENANT_GO_LIVE_ACCEPTED.

**Tại commit khởi tạo:** chỉ hoàn thành **S0**, các checklist P01–P08 đều chưa triển khai. Không có bằng chứng NPP-01, E2E, legal sign-off hoặc Go-Live được tạo trong R010.
