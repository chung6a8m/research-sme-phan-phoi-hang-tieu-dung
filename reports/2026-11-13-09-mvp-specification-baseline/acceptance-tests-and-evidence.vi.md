# R009-AC — Acceptance Tests, Evidence Register và Go/No-Go Gates v1

- **Trạng thái toàn bộ AC đối với ứng dụng thật:** `NOT_RUN`. Một số ca có phép tính/mô hình tương ứng R008 (`MODEL_ONLY`), **không** chuyển thành `PRODUCT_PASS`.
- **Nguyên tắc:** Given/When/Then dưới đây định nghĩa **kết quả kỳ vọng**, không mô tả điều đã chạy. Mỗi kết quả phải được so trên tài liệu và các ledger ở từng bước, không chỉ tổng cuối.
- **Danh tính:** `AC-xx` = ca nghiệm thu; `EV-xx` = nhóm evidence cần thu; `B-CASE-xxx` = hồ sơ mở riêng, không tự điền PASS.
- Kế thừa expected result R008 [số liệu](../2026-11-12-08-khep-quy-tac-va-dac-ta-mvp/nghiep-vu-va-so-lieu.vi.md), [offline](../2026-11-12-08-khep-quy-tac-va-dac-ta-mvp/offline-va-phuc-hoi.vi.md), [hóa đơn](../2026-11-12-08-khep-quy-tac-va-dac-ta-mvp/hoa-don-va-du-lieu.vi.md) và [cutover](../2026-11-12-08-khep-quy-tac-va-dac-ta-mvp/pilot-va-ban-giao.vi.md).

## 1. Test cases với kết quả độc lập có thể kiểm tra

| AC | Given (đầu vào/tiền điều kiện) | When (hành vi/fault) | Then (kết quả bắt buộc) | Evidence |
|---|---|---|---|---|
| AC-01 — Tenant isolation | 2 tenant A/B, user A không có membership B; restore B từ snapshot cũ trước revoke | Query/read/write B bằng user A hoặc user B đã revoked | 403/denied, không trả row/file/lookup B; restore phải dùng authority hiện hành, không revive membership | EV-01, EV-09 |
| AC-02 — Customer 0 Outlet | C1 không Outlet, có ShipTo S1; sau giao đổi địa chỉ/quan hệ Outlet | Confirm Order A, giao từng phần; sửa master Customer/Outlet | C1 vẫn là debtor; delivery giữ S1 snapshot, price/terms tại mốc; không tạo Outlet giả | EV-02 |
| AC-03 — Chuyến A+B phân bổ | Kho 100 đơn vị cùng SKU; reserve A=40, quota B=30; xe nhận 70 | B bán 31 hoặc xin bán 40 đã dành A, đồng thời A giao 25; về xe nhận phần dư | B không thể tiêu phần A; B tối đa 30; stock tổng không âm/không trùng, mọi movement source-linked. Load không tạo AR | EV-03, EV-04 |
| AC-04 — Kho-01 toàn phạm vi | Wave1 chỉ 8 chuyến nhưng Kho-01 còn nhập/điều chỉnh/xuất khác; legacy có UI/API/job/offline client | Freeze rồi cutover, thử từng write path cũ và nghiệp vụ ngoài wave | Chỉ MVP ghi được biến động; off-wave phải có record trên MVP; một đường legacy độc lập còn ghi được = **P0 FAIL** | EV-04, EV-12 |
| AC-05 — UoM/lô/trả | SKU có thùng/lẻ, step, 2 lô khác expiry; đơn trả nguồn giao cũ | Giao FEFO, quy đổi, nhận giữ hộ, chấp nhận trả/QA | Tồn chính xác UoM chuẩn; lot/expiry snapshot; giữ hộ không tăng available/giảm AR; nhận trả vào quarantine, QA release riêng | EV-04, EV-05 |
| AC-06 — Giá vốn và kỳ | 2 đơn vị cost source 6.667, trả một phần; nguồn chỉnh 6.768 khi kỳ cũ đã khóa | Trả từng phần, ghi điều chỉnh nguồn và đối soát phương pháp kế toán kỳ | Hoàn 3.334 + điều chỉnh 50 + hoàn 3.384 = 6.768, không mutate kỳ cũ; DMS moving average và accounting period có bảng chênh có nguồn | EV-07 |
| AC-07 — Quà ròng/waiver | Fixture mua 20 nhận 2 quà, nhận trả 11 mua+2 quà, giao tiếp 11 mua; nhánh khác waiver 2 quà còn giữ | Recompute entitlement, nhận lại quà/waiver, retry | Nhánh nhận đủ quà: giao thêm 2; nhánh miễn thu hồi còn giữ: không giao thêm; waiver duyệt/nguồn; không double gift | EV-05 |
| AC-08 — Terms per delivery | A xác nhận N=7; giao 01/11 và 08/11; sau đó đổi master C thành N=14 | Tạo 2 AR open items; tạo order mới giao 08/11 | Due date lần lượt 08/11 và 15/11; nợ lịch sử không đổi; order mới có hạn 22/11 theo snapshot; timezone đúng | EV-06 |
| AC-09 — SaleDeliveryReceipt atomic | P=100, grant credit=100; nhánh R=100, R=60, chuyển khoản pending R=0; cắt DB giữa T2 | Post/retry cùng ID, chạy hai lệnh khác ID tranh 1 quota | R=100 → AR0/custody100, R=60 → AR40/custody60, pending → AR100/custody0; transaction không partial; grant/qty không âm, retry không tăng đôi | EV-06, EV-08 |
| AC-10 — Ba sổ/cash handover | Opening AR140.000 và custody60.000 từ historical invoice200.000/thu60.000; có advance tách | Thu mới20.000; nộp quỹ50.000; retry import và nộp; duyệt chi/hoàn ứng | AR120.000, custody30.000, quỹ+50.000; advance không bù custody; import/retry không trừ AR lịch sử lần nữa | EV-06, EV-12 |
| AC-11 — Durable ACK, dependency và duplicate | Client journal C phụ thuộc P, server nhận C trước, ngắt kết nối/crash, thử cùng ID với payload khác | Sync/restart/replay/missing dependency/cycle | `awaiting_dependency` có server durable owner; cùng ID/hash một effect; ID khác hash 409; không có lệnh bị cả client/server bỏ; cycle/deadline thành case | EV-08 |
| AC-12 — Grant/writer/offline event đã xảy ra | Trip T có 1 writer, grant hết hạn hoặc revoke; hàng/tiền đã trao offline, có bản giấy | Sync muộn, thay thiết bị hoặc second writer, restore/handshake | Từ chối intent chưa làm; giữ occurredEvent qua case bền và custody; không cấp writer mới không đối soát; event giấy có source ID không post trùng | EV-08, EV-09 |
| AC-13 — Restore authority và ngoại hiệu ứng | Đã revoke user, nhận yêu cầu hạn chế dữ liệu, invoice provider đã phát hành; restore TenantDB trước các sự kiện | Mở hệ, replay outbox/invoice/command | Tenant khóa tới authority/ledger/external lookup; không revive revoke, không mất privacy action, không phát hành invoice lại; generation mới không trùng | EV-09, EV-10 |
| AC-14 — Hóa đơn A/B và nhánh B no-channel | Có seller profile được duyệt, kênh online được thử; B tắt toàn bộ data/kênh văn phòng; test timeout sau gửi | A giao 60+40, B bán/thu, provider UNKNOWN, mất mạng trước/tại/sau giao | Hóa đơn gắn từng delivery; cấp xe/thu nợ không tạo hóa đơn mới; UNKNOWN tra same ref; B **không giao thật khi no-channel chưa có B-CASE/LEGAL-MEMO và INV-09**; nếu đã giao thật, giữ case, không backdate | EV-10 |
| AC-15 — Accounting outbox/reconciliation | 3 event với source ID/hash, accounting nhận lặp và 1 event được `POSTED` có số sai; webhook mất | Retry, lookup, import thủ công theo registry, đối soát cutoff | Một source effect không bị ghi hai lần; `RECEIVED` riêng `POSTED` riêng; posting lệch → `RECONCILED_DIFF`; sửa bằng correction ID mới, không “cân tổng” | EV-11 |
| AC-16 — Cutover/Forward Recovery | Kho-01 + xe, nợ/custody/advance, hóa đơn ngoài, lệnh chưa sync có manifest; batch opening có source ID | Preview, freeze, post, kích hoạt writer mới, legacy event tới muộn, phát sinh hiệu lực đầu tiên rồi thử rollback | Từng loại số dư khớp và ký; old writer bị khóa; lệnh cũ same source không phát lại; sau effect đầu tiên chỉ forward adjustment, không rollback sổ/ngoại hiệu ứng | EV-04, EV-12 |
| AC-17 — Visit without order | Sales được phân công Customer/Outlet, không có nhu cầu đặt | Ghi kết quả không đơn/lý do/quan sát/yêu cầu trả rồi sync | Visit completed có source và offline ACK; không sinh đơn 0đ, AR, stock movement; báo cáo visit có n/N | EV-13 |
| AC-18 — Wave 1 đầy đủ | Cả EV-01..EV-14 theo mode đạt, Kho-01 writer duy nhất, lịch/case owner/measurement plan | Vận hành 3 A + 3 B + 2 mixed chuyến/ngày trong ≥5 ngày đại diện, kể cả off-wave stock | Có chuyến/loại thực, số lần lỗi, open cases, chênh số dư, coverage, task time, support cost, SLA theo mẫu số; Owner ký Go/No-Go **riêng từng mode**, không dùng demo thay dữ liệu | EV-14, EV-15 |

### 1.1. Negative/boundary tests tối thiểu kèm mỗi AC

- Cùng source ID khác hash; callback/command duplicate; response mất sau commit; restart giữa outbox và ACK; hai writer tranh quyền; restore DB trước external effect.
- Dòng giao thiếu/mã UoM sai, lô hạn thấp, trả nhiều lần/vượt nguồn, tiền đang pending, thu thừa/hoàn rồi chi lại, chênh giá vốn sau kỳ khóa.
- Giao lúc cuối ngày, đổi timezone/cấu hình policy, thay terms giữa đơn và giao, thiết bị sai giờ, chuyến kéo dài nhiều ngày, thiếu manifest giấy.
- Quyền bị revoke khi máy offline, support grant hết hạn, test tenant cross-reference/file/object, xóa/hạn chế dữ liệu trước restore.
- Nếu test không thể dựng với bản sản phẩm, ghi `BLOCKED` + dependency/owner, không đánh dấu `PASS` bằng script đơn lẻ.

## 2. Evidence Register (điền sau khi chạy thực)

| EV | Cần thu và người xác nhận cuối | Trạng thái tại 13/11/2026 |
|---|---|---|
| EV-01 | Tenant isolation, membership revocation, admin/support access và audit; security/Owner | `EVIDENCE_PENDING` |
| EV-02 | Dữ liệu Customer/Outlet/ShipTo NPP có quyền dùng, mapping và snapshot trước/sau; sales/data owner | `EVIDENCE_PENDING` |
| EV-03 | Một chuyến mixed gồm manifest, allocation A/B, phiếu giao/bán/quà và đối soát dòng; kho/sales | `EVIDENCE_PENDING` |
| EV-04 | Tồn Kho-01 toàn phạm vi, test old UI/API/import/jobs/offline blocked, UoM/lot/quarantine; kho/IT | `EVIDENCE_PENDING` |
| EV-05 | Pricing/promo/gift/waiver với SKU/thuế thật + test engine; sales/kế toán | `MODEL_ONLY` (R008), real pending |
| EV-06 | Ledger AR/custody/advance, terms/thu thực với đối soát từng bước; kế toán/thủ quỹ | `MODEL_ONLY` (R008), real pending |
| EV-07 | Giá vốn vận hành vs kỳ chính thức, chi phí muộn, returns and adjustments; kế toán giá vốn | `MODEL_ONLY` (R008), real pending |
| EV-08 | PWA IndexedDB, online/offline, crash/retry, durable inbox/receipt, concurrency; QA/backend | `MODEL_ONLY` (R008), real pending |
| EV-09 | Restore/revoke/privacy/GenerationAnchor/RecoveryJournal/external registry drill; security/ops | `MODEL_ONLY` (R008), real pending |
| EV-10 | Seller/provider/legal memo, phiếu cấp xe, INV-01–09, B-CASE-001/002/003, no-channel; kế toán/provider/legal | **`EVIDENCE_PENDING` — P0 cho B fully offline** |
| EV-11 | Accounting import/API, webhook/lookup/manual register, POSTED và reconciliation signed; kế toán/IT | `EVIDENCE_PENDING` |
| EV-12 | Cutover manifest/multi-party sign, opening balances, legacy lock, first event, Forward Recovery; Owner/kho/kế toán | `EVIDENCE_PENDING` — P0 |
| EV-13 | Visit no-order, 8 bài task UX, thiết bị/mạng thực, người dùng/personal data scope; sales/QA | `EVIDENCE_PENDING` |
| EV-14 | Wave 1 readiness checklist, staff/role, thiết bị, runbooks, SLO thresholds, case owners, hỗ trợ; Owner/ops | `EVIDENCE_PENDING` |
| EV-15 | Nhật ký ≥5 ngày: 3A+3B+2 mixed/ngày nếu mode được mở, tất cả biến động Kho-01, n/N, chi phí/incident/defects/case closures và Owner decision | `EVIDENCE_PENDING` |

**Hồ sơ B-CASE và LEGAL-MEMO:**

| Hồ sơ | Tình trạng | Không được làm |
|---|---|---|
| `B-CASE-001`, `B-CASE-002`, `B-CASE-003` | `EVIDENCE_PENDING` | Không điền kết quả thử giả, không tuyên bố provider hỗ trợ offline. |
| `LEGAL-MEMO` về seller/profile/kênh/ngoại lệ áp dụng | `EVIDENCE_PENDING` | Không tự dùng R008 nghiên cứu chung như xác nhận áp dụng cho NPP thực. |
| `INV-09` thử mạng và mốc lập hóa đơn trên điều kiện thật | `NOT_RUN` | Không mở nhánh B no-channel, không backdate giao dịch đã xảy ra. |

## 3. Mẫu record kết quả bắt buộc cho từng lần test

`testRunId`, `acId`, `evId`, `commitSha`, `buildVersion`, `environment` (`LOCAL|PROTECTED_CI|INTEGRATION|PILOT`), `tenant/sellerProfileVersion`, `device/os/browser`, `provider/accountingAdapterVersion`, `schemaVersion`, `fixtureHash`, `faultInjection`, `startedAt/endedAt`, `expected`, `actual`, `ledgerDiffBeforeAfter`, `documentIds`, `decision`, `reviewer`, `evidenceUri`, `masking/retention`, `blockers`.

**Status dùng thống nhất:** `NOT_RUN`, `MODEL_ONLY`, `LOCAL_VERIFIED`, `INTEGRATION_VERIFIED`, `PROTECTED_CI_VERIFIED`, `PILOT_VERIFIED`, `BLOCKED`, `FAILED`, `OWNER_ACCEPTED_EXCEPTION`. Các trạng thái `OWNER_ACCEPTED_EXCEPTION` không tự biến điều kiện pháp luật/P0 không được miễn thành `PASS`.

## 4. Quy tắc Go/No-Go v1

- **Go để đặc tả/implement/test:** được tiến hành từ baseline này với các phần `OWNER_DECIDED`, giữ technical contract ở `DESIGN_CANDIDATE` cho tới review.
- **No-Go giao dịch thật liên quan nếu bất kỳ P0 còn mở:** B full-offline nếu EV-10 chưa đủ; kho nếu EV-04/EV-12 chưa đủ; offline nếu EV-08/09 chưa đủ; A+B nếu EV-03/06/12 chưa chứng minh tính toàn vẹn.
- **Mode-specific:** A, B có kênh hóa đơn hợp lệ, B không kênh, mixed được đánh giá riêng. Không bắt mọi phát triển dừng vì một mode bị No-Go, nhưng không hạ gate bằng cách đặt tên khác.
- **Pilot readiness != pilot success:** trước Wave 1 cần EV-14 + cổng P0 theo phạm vi; hoàn thành pilot còn cần EV-15 với ≥5 ngày đo thực. Nếu lịch pilot thực không đạt đủ chuyến đại diện, ghi phạm vi thiếu thay vì suy ra kết quả.
- Quyết định cuối có `decisionId, scope, evidenceRefs, openRisks, exceptionApprover, acceptedAt` của người có quyền. Không có hồ sơ → `NO_GO/PENDING`, không tự gắn sign-off.
