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

## 9. Kết quả triển khai S1/P01–P02 trong PR #2 (13/11/2026)

**Tình trạng:** `S1_DOCUMENTED_REVIEW_PENDING`. Các cấu phần tài liệu S1 đã được **soạn và commit**, còn **Owner Product Baseline acceptance, sản phẩm thực thi và tenant Go-Live đều chưa đạt**. Trạng thái `S0` trong §8 là ghi nhận tại **commit khởi tạo** trước khi S1 được bổ sung.

| Gói | Tài liệu hiện có | Phạm vi đã soạn | Việc còn chờ |
|---|---|---|---|
| P01 — Product Standard | [Scope & personas](product-scope-and-personas.vi.md) | Phân khúc giả định, thuật ngữ, persona, chu trình ngày và ranh giới sản phẩm | Owner xác nhận định hướng product-first |
| P01 — Workflows/SOP | [SOP-01–12](sop-a-b-mixed.vi.md) | Tenant/master, A, B online, mixed, kho/cost, pricing/return, receipt/credit, custody/advance, offline, invoice/accounting, cutover, visit/pilot | UAT hành vi thật, UI/workflow mapping trong source PR |
| P01 — Roles/RACI | [Role & approvals](role-and-approval-matrix.vi.md) | 11 role logic, action matrix, 10 approval classes và phân nhiệm | Owner/Finance ký trường hợp kiêm nhiệm, permission implementation |
| P02 — Policies | [POL-01–24 / CFG-01–24](product-policy-catalog.vi.md) | Mỗi BR có POL, bất biến L0 và bounded default L1, feature gate riêng mode | Owner review defaults, tài liệu thuế/provider thực, TADR |
| P02 — Tenant Profile | [Logical schema](tenant-profile-schema.vi.md), [JSON Schema](tenant-profile.schema.json), [synthetic draft example](tenant-profile.example.json) | Profile version, metadata/fields/validation shape; ví dụ không có seller thật và không activate mode | Code/DB validation, tenant identity/evidence, import S2 |
| P02 — Product ADR | [PADR-01–09](product-adrs.vi.md) | Alternatives, consequences, câu hỏi Owner theo từng chủ đề | **Tất cả PADR vẫn `PROPOSED_FOR_OWNER_REVIEW`** |
| P01+P02 — Trace | [S1 D/BR→POL/SOP→AC/EV](s1-traceability.vi.md), [validator](kiem-tra-s1.py) | Mapping 15 D, 24 BR↔POL, 12 SOP, 9 PADR; kiểm cấu trúc bằng script | Runtime evidence S3/S6 chưa chạy |

**Vùng chưa tự nhận đã khép:** không tạo dữ liệu thực NPP-01, hợp đồng seller/provider, JSON Schema production, DDL/OpenAPI, ứng dụng PWA/backend, diễn tập writer lock/restore/cutover, kiểm thử accounting/invoice hoặc Owner approval. B no-channel/LEGAL-MEMO/EV-10 vẫn `EVIDENCE_PENDING`. **Không có phát hành mode thực chỉ bằng thay đổi tenant profile.**

### Cổng kiểm chất lượng S1

1. Chạy `python reports/2026-11-13-10-product-reference-go-live-blueprint/kiem-tra-s1.py` trên checkout có R009 và R010; đối chiếu cấu trúc D15/BR24/POL24/SOP12/PADR9, link và JSON schema/example. Đây chỉ là **structural validation**.
2. Product Owner review PADR-01/03 trước khi đóng băng chuẩn; Finance/warehouse/ops review PADR-02/04/05/06/07/08/09 và các default CFG.
3. Nếu approved, tạo decision record có version, scope, approver và acceptedAt thật; không sửa lịch sử R009.
4. Bàn giao S2 template T01–T14 và fixtures F0/F1/F2 từ catalog/schema; S3 nối AC/evidence nhưng không dùng checker tài liệu thay system test.

**Kết quả kiểm cấu trúc:** [R010-S1-VAL](s1-validation-results.vi.md) ghi 15 D/24 BR/24 POL/12 SOP/9 PADR được kiểm trace và 140 liên kết nội bộ không lỗi trên HEAD `e2de94e` bằng đọc GitHub. **Chưa chạy trực tiếp script Python hoặc CI**, không suy đã qua product/legal/pilot tests.

**Đánh dấu checklist §8:** P01/P02 **đã có tài liệu ứng viên**, chưa đạt điều kiện **Owner Product Baseline acceptance**. P03–P08 tiếp tục chưa triển khai. Ghi nhận kết quả chạy kiểm tra thực tế riêng sau khi kiểm.

## 10. Triển khai S2 Data Foundation (13/11/2026)

**Tình trạng:** \`S2_ARTIFACTS_IMPLEMENTED_SYNTHETIC_CI_VERIFIED / OWNER_REVIEW_PENDING\`. Các checklist S0/S1 ở phần trước là ghi nhận lịch sử tại thời điểm đó; gói P03/P04 sau đây **đã tạo file thực và qua mô hình/CI synthetic**, không được đánh đồng với \`DOC_READY\` được Owner chấp nhận.

| Gói | Tài liệu/đầu ra đã commit | Ranh giới |
|---|---|---|
| P03 Data Templates | [S2 README](s2/README.md), [Data Dictionary](s2/data-dictionary.json), 14 CSV header \`s2/templates/blank/\`, [examples](s2/examples.json) | Mẫu giả, chưa có số liệu nhập NPP |
| P03 Import/Dry-run | [CSV/Excel onboarding guide](s2/import-template-guide.vi.md), [non-writing validator](s2/s2-import-dry-run.mjs), [Excel builder](s2/s2-create-xlsx.py) | Chỉ parse/FK/hash/số học mẫu; không ghi DB; binary XLSX cung cấp trong cuộc trò chuyện, không commit |
| P04 Fixtures | [F0/F1/F2](s2/fixtures/), [manifest](s2/fixture-manifest.json), [generator](s2/s2-data-tool.mjs) | Seed cố định, \`MODEL_ONLY\`, không có hiện thực kho/vận hành |
| P04 Expected & scenarios | [AC-03/19/20/21](s2/golden-oracles.json), [343 chuyến độc lập](s2/trip-scenarios.json), [fault catalogue](s2/fault-case-catalog.csv) | Mỗi trip dùng opening snapshot độc lập; không tạo sổ kho cộng dồn |
| Quality | [Data Quality](s2/data-quality-and-reconciliation.vi.md), [validation results](s2/validation-results.vi.md), [GitHub workflow](../../.github/workflows/s2-synthetic-validation.yml) | GitHub Actions Node synthetic success; thiếu test PWA/API/SQL và bằng chứng NPP |

**CI:** https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/actions/runs/43359872306 (**success** tại lần kiểm). Không dùng \`MODEL_ONLY\` hoặc \`SYNTHETIC_CI_VERIFIED\` làm \`PRODUCT_VERIFIED\`, \`PILOT_VERIFIED\` hay ký \`GO\`.

**Handoff S3:** bổ sung acceptance BDD, seeded concurrency/fault injection trên code thật, R009 AC-01–21/EV-01–15, actual ledger diff và trạng thái mode-specific. **S1 PADR-01–09 vẫn \`PROPOSED_FOR_OWNER_REVIEW\`**; tất cả cổng P0 NPP/hóa đơn/writer/cutover giữ nguyên.


## 11. Chủ dự án chốt 9 PADR + 7 EVQ ngày 13/11/2026

- [Owner Decision Register](owner-decisions-and-evidence-gates.vi.md) có 16 lựa chọn rõ ràng và phạm vi của từng quyết định; [EVQ Acceptance Gates](evq-acceptance-gates.vi.md) có matrix P0/P1, bằng chứng và Go/No-Go.
- PADR-02 dùng UNSET/fail-closed thay default 0/0; đã sửa Product Policy và Tenant Profile schema/example, mẫu/validator S2 cần đồng bộ theo version.
- EVQ-05 chọn **phương án 2**: A/B_ONLINE/MIXED với B online cho MVP; nhánh B có kênh thay thế lúc PWA mất mạng deferred; B_NO_CHANNEL blocked, EV-10/B-CASE/LEGAL-MEMO/INV-09 vẫn pending.
- EVQ-01–07 giữ hai cổng chứng minh, P0 không miễn, P1 ngoại lệ có hạn, writer toàn kho/cutover E2E, offline theo device/mode, accounting source reconciliation và pilot UX/SLO/n/N ký trước EV-14.
- Những dòng OWNER_REVIEW_PENDING hoặc S0/S1/S2 proposed trong phần trên là snapshot tại lúc soạn trước phỏng vấn; quyết định Owner bây giờ đã có, nhưng không suy rằng tài liệu đã DOC_READY hoặc ứng dụng đã PRODUCT_VERIFIED.
- TADR-01..06 tiếp tục DESIGN_CANDIDATE. S3–S6, provider/Finance/legal, tenant data, EV-01..15 vẫn chưa có E2E/Go-Live evidence. PR giữ Draft, không tự merge hay mở gate.

## 12. Triển khai S3/P05 Acceptance & Quality (13/11/2026)

**Trạng thái:** `S3_CONTRACT_VALIDATED_SYNTHETIC_CI / NOT_RUN_PRODUCT`. P05 được soạn đầy đủ ở cấp **BDD/evidence/test contract** trong [R010-S3](s3/README.md), không phải nghiệm thu hệ thống thật. Các snapshot S0/S1/S2 ở các mục trước vẫn giữ nguyên để bảo toàn diễn tiến.

| Đầu ra | File đã commit | Kết quả/ranh giới |
|---|---|---|
| AC/trace đầy đủ | [acceptance-matrix.json](s3/acceptance-matrix.json) | AC-01..21 nối R009 direct BR/EV và S1 D/POL/SOP/DC/API/SM/PADR qua policy; 21/21 không orphan |
| BDD positive/negative | [Gherkin features](s3/features/) | 42 scenarios P/N, 2 mỗi AC; `STEPS_UNBOUND`, `NOT_RUN_PRODUCT` |
| Fault injection | [fault-injection-matrix.json](s3/fault-injection-matrix.json) | F-01..22; F-01..10 kế thừa S2; crash/ACK/race/restore/legacy/cutover/provider/accounting/pilot đều **chưa chạy runtime** |
| EV và Go/No-Go | [evidence-register.json](s3/evidence-register.json), [mode-gates.json](s3/mode-gates.json) | EV-01..15 real pending; EV-05..09 historical `MODEL_ONLY`; A/B_ONLINE/MIXED NO_GO_PENDING; OFFLINE_WRITE/cutover DISABLED_PENDING; B_NO_CHANNEL BLOCKED |
| Evidence contract | [JSON Schema](s3/evidence-run.schema.json), [NOT_RUN sample](s3/evidence-run.example.json), [handoff](s3/test-execution-and-handoff.vi.md) | Quan sát `EXECUTED_UNREVIEWED` không tự cấp Product Verification, tenant GO hoặc chữ ký; P0 không miễn trừ |
| Quality gate | [validator](s3/s3-validate.mjs), [negative regression](s3/s3-regression.mjs), [schema negative](s3/s3-evidence-schema-test.py), [workflow](../../.github/workflows/s3-acceptance-contract-validation.yml) | Structural/contract validation, không chạy PWA/API/SQL/provider/actual fault |

**CI evidence:** [GitHub Actions S3 run 43396658093](https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/actions/runs/43396658093) báo SUCCESS trên commit `b8e0acd7216c`; log gồm `PASS_S3_CONTRACT_ONLY` (21 AC, 15 EV, 42 Gherkin, 22 fault, 6 mode), `PASS_S3_NEGATIVE_REGRESSION 20`, `PASS_S3_SCHEMA_DRAFT202012_NEGATIVES 10`, `realE2eRuns:0`. [S3 validation log](s3/validation-results.vi.md) lưu nguồn kiểm. S2 synthetic CI trên cùng HEAD cũng SUCCESS; không tổng hợp hai kết quả thành product/runtime PASS.

**Bàn giao S4/S5/S6:** S4 viết onboarding/cutover/DR/legal/privacy/provider/accounting preflight từ matrix, S5 tenant gap/adoption và profile có người ký, S6 tạo step bindings thực trong source repo và chạy PWA/API/SQL/browser/provider/accounting, full Kho-01 writer lock, fault drills, actual ledger diff, EV-14 readiness trước EV-15 pilot. Chưa có Product Verification, Tenant Go-Live Acceptance, B-CASE/LEGAL-MEMO/INV-09 hoặc SLO thresholds được ký. TADR-01..06 vẫn `DESIGN_CANDIDATE`; PR #2 giữ Draft.

## 13. Triển khai S4/P06/P08 Operations & Preflight (13/11/2026)

**Trạng thái tại thời điểm commit tài liệu:** `OPERATIONS_CONTRACT_PREPARED / NOT_EXECUTED`. S4 đáp ứng mục tiêu **soạn runbook, preflight và hồ sơ vận hành ứng viên**, chưa diễn tập hoặc được bên NPP/Legal/Finance ký. Không thay đổi S3 evidence hoặc trạng thái mode.

| Gói | Artifact | Phạm vi triển khai |
|---|---|---|
| P06 | [S4 README](s4/README.md), [onboarding/cutover](s4/tenant-onboarding-and-cutover.vi.md) | Chuỗi C0–C8, opening/khóa writer **toàn Kho-01**, manifest T01–T14, nguồn ký AP-08, firstEffectId/forward-only; tách mode admission AP-09 |
| P06 | [DR/restore](s4/backup-restore-and-recovery.vi.md), [monitoring/incident/hypercare](s4/monitoring-incident-hypercare.vi.md) | DR-01..08, external effects/authority/privacy sau restore, incident P0/P1, per-source ledger/UNKNOWN, asOf/n/N, EV-14 readiness vs EV-15 pilot |
| P06+P08 | [RACI, training, mẫu ký](s4/raci-training-signoff.vi.md), [legal/provider/accounting/privacy preflight](s4/preflight-seller-provider-accounting-privacy.vi.md) | Role/SoD + AP-08/09/10, invoice A/B_ONLINE, B_NO_CHANNEL blocked, API/FILE/MANUAL_REGISTER, privacy/retention còn thiếu người ký |
| Hợp đồng máy đọc | [30 operational controls](s4/operational-controls.json), [dossier schema](s4/tenant-operations-dossier.schema.json), [placeholder](s4/tenant-operations-dossier.example.json) | OPS-01..30 truy vết S3 AC/EV/gate/mode; không chứa hồ sơ Go-Live thật, signoff hoặc evidence thực |
| Chất lượng | [validator](s4/s4-validate.mjs), [negative regression](s4/s4-regression.mjs), [JSON Schema negative tests](s4/s4-dossier-schema-test.py), [GitHub Actions](../../.github/workflows/s4-operations-contract-validation.yml) | Chỉ contract/trace/safety check; GitHub CI nếu PASS không là cutover rehearsal hay Product/Tenant acceptance |

**Ranh giới:** NPP-01 vẫn chưa có opening/cutover/revoke/restore/seller/provider/accounting/UX E2E và chữ ký. EV-01..15 vẫn real pending; EV-05..09 MODEL_ONLY nghiên cứu; B-CASE/LEGAL-MEMO EVIDENCE_PENDING, INV-09 NOT_RUN. Không tự đặt RPO/RTO, SLO/threshold, retention, pháp lý/thuế, nhà cung cấp hoặc tên người ký. OFFLINE_WRITE và PRODUCTION_CUTOVER DISABLED_PENDING; A/B_ONLINE/MIXED NO_GO_PENDING; B_NO_CHANNEL BLOCKED. TADR-01..06 DESIGN_CANDIDATE. S5 nhận gap/dossier theo tenant; S6 mới thực thi DR/cutover, thu testRunId, product verification và mode Go/No-Go độc lập.
