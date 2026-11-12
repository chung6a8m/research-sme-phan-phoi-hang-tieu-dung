# NPP-01 — Tổng hợp quyết định và khoảng trống MVP (đánh giá ngày 12/11/2026)

> **Xuất xứ và mức tin cậy:** Bản Markdown **biên tập/tái lập ngày 13/11/2026** từ nội dung bản tổng hợp NPP-01 do người dùng cung cấp trong ngữ cảnh dự án (tệp `Phỏng vấn quyết định Q01.txt`, 143 dòng), kết hợp đối chiếu R008 tại PR #1. Không phải bản sao nguyên byte của tệp Markdown đầy đủ từng được dẫn tên `NPP-01_tong-hop-quyet-dinh-va-khoang-trong-MVP_2026-11-12.vi.md`. Bản nguồn được cung cấp là bản tóm lược, không chứa nguyên văn biên bản, từng câu hỏi và hồ sơ chứng cứ bên ngoài.
>
> **Phạm vi:** Quyết định nghiên cứu/phỏng vấn đến Mục 202; trạng thái bằng chứng tính đến 12/11/2026. Văn bản này không tự chứng nhận tuân thủ pháp luật, khả năng của hệ thống kế toán/provider hay kết quả pilot.
>
> **Kết luận:** Đủ quyết định nền tảng để lập đặc tả MVP v1 và bắt đầu triển khai theo gate; **chưa đủ bằng chứng Go-Live A+B**.

## 1. Phân loại trạng thái

| Trạng thái | Ý nghĩa và điều không được suy diễn |
|---|---|
| `OWNER_DECIDED` | Chính sách đã được chủ dự án chọn trong phỏng vấn; không đồng nghĩa phần mềm đã triển khai hoặc NPP thực tế đã ký nghiệm thu. |
| `DESIGN_CANDIDATE` | Contract, schema, API, phương pháp kỹ thuật được R008 đề nghị; cần review/chốt khi triển khai. |
| `EVIDENCE_PENDING` | Thiếu hồ sơ hay thử nghiệm ngoài mô hình; giữ gate tương ứng đóng. |
| `RESEARCH_MODEL_VERIFIED` | Chỉ có số học/script/mô hình hữu hạn trong R008; **không** bằng chứng sản phẩm, trình duyệt, SQL, thiết bị, provider. |
| `PRODUCT_VERIFIED`, `PILOT_VERIFIED` | Chỉ được gắn khi có bản chạy thật, môi trường, người xác nhận, kết quả và evidence ID. Hiện chưa ghi nhận. |

## 2. Những quyết định nền tảng đã ghi nhận

| Nhóm | Chính sách đã chọn | Ranh giới bằng chứng |
|---|---|---|
| Người bán và tenant | Một đơn vị bán/tenant; mỗi tenant một database; đối tượng bên thuê SaaS không đồng nhất với tenant. | Hồ sơ pháp nhân, người xuất hóa đơn và nguồn sở hữu thực của NPP cần xác nhận. |
| Khách và điểm bán | Customer là bên chịu nợ, có 0..n Outlet; ShipTo là snapshot nơi giao trên chứng từ, không ép Outlet giả. | Mapping mã khách, quan hệ điểm bán theo hiệu lực và dữ liệu import cần đối chiếu. |
| Luồng giao dịch | A đặt trước rồi giao; B bán theo xe; hỗ trợ một chuyến A+B có phân bổ hàng và quyền riêng. | Chuyến riêng có thể thử trước; hỗn hợp chỉ mở sau E2E/đối soát. |
| Nhân sự | Xe máy: người giao kiêm lái; xe tải: có thể một người giao và một lái riêng. | Vai trò lái xe không tự cấp quyền bán, thu hoặc xem nợ. |
| Kho | SKU/UoM/lô/FEFO; hàng trả cách ly; sau cutover MVP là nơi ghi nhận biến động kho chính của Kho-01, **kể cả công việc ngoài Wave 1**. | Độc quyền ghi phải thử cả hệ thống cũ, import, thiết bị mất mạng và mọi đường ghi. |
| Giá vốn | Bình quân di động theo SKU × địa điểm tồn là sổ giá vốn vận hành MVP; kế toán hiện tại bình quân kỳ là nguồn giá vốn kế toán chính thức. | Chênh giữa hai phương pháp cần contract/đối soát cuối kỳ; không ép hai số bằng nhau. |
| Giá và ưu đãi | Tập quy tắc tự động có giới hạn; snapshot; quà theo mua ròng/quà khách còn giữ; miễn thu hồi quà có duyệt/nguồn. | Thuế, profile SKU và cách phản ánh chứng từ cần kế toán/provider xác nhận. |
| Công nợ và tiền | Ba sổ khác nhau: phải thu Customer, tiền nhân viên giữ hộ, tạm ứng; hạn trả theo mỗi lần giao + N ngày, snapshot terms. | Thu/nộp/tạm ứng/hoàn dư không được bù nhau ngầm. |
| Offline | Một writer/chuyến, quyền hữu hạn, journal bền, ACK/restore chống trùng, chứng từ giấy xử lý như event thực có đối chiếu. | TTL, RPO/RTO, thiết bị, trình duyệt và hạ tầng chưa thử thực. |
| Hóa đơn B | **Không mở bán B khi mất hoàn toàn kênh lập hóa đơn hợp lệ chỉ bằng giả định PWA offline**. | `B-CASE-001/002/003` và `LEGAL-MEMO` vẫn `EVIDENCE_PENDING`; không coi mặc nhiên được miễn/hậu kiểm. |
| Kế toán | Durable Outbox + chống trùng; webhook và API tra cứu; ba kết quả tiếp nhận, ghi sổ, đối soát độc lập. | `POSTED` của hệ thống kế toán không đồng nghĩa `RECONCILED_OK`; API thực chưa kiểm thử. |
| Cutover | Kiểm kê/snapshot, freeze, đồng thuận nhiều bên, ưu tiên cutover sạch; sau sự kiện có hiệu lực đầu tiên dùng Forward Recovery/điều chỉnh có nguồn, không rollback nghiệp vụ. | Số dư, thiết bị chưa sync, hóa đơn đã lập và ghi kho ngoài wave phải cùng phạm vi đối soát. |
| Pilot | Wave 1: 8 chuyến/ngày (3 A, 3 B, 2 A+B), quan sát ít nhất 5 ngày; nghiệm thu theo rủi ro và evidence. | Chưa có đo thực, dữ liệu thật được phép dùng, ngưỡng SLA hoặc phê duyệt Go-Live. |

Các mô tả ở bảng này là **quyết định sản phẩm ở mức chính sách**. Những đề xuất chi tiết R008 không tự trở thành quyết định chỉ nhờ được nhắc trong bảng; xem [sổ quyết định và ADR](decision-register-and-adr.vi.md).

## 3. Danh mục 15 gói khoảng trống cần khép

Bản tổng hợp đầu vào nêu **10 nhóm khoảng trống** (5 P0, 4 P1, 1 P2). Bảng dưới **tách biên tập thành 15 gói công việc có owner/evidence** để giao triển khai; không trình bày việc tách này như 15 mục nguyên văn có sẵn trong nguồn.

| ID | Ưu tiên | Khoảng trống và điều kiện đóng | Người/đơn vị cần xác nhận | Evidence tối thiểu |
|---|---|---|---|---|
| GAP-01 | P0 | Kênh lập hóa đơn B khi mất liên lạc có hồ sơ hợp lệ; chưa chứng minh thì NO-GO nhánh đó. | Kế toán NPP, tư vấn pháp lý phù hợp, provider | B-CASE, LEGAL-MEMO, INV-09, chứng từ/timeline thực |
| GAP-02 | P0 | MVP là writer kho duy nhất trên toàn Kho-01, gồm ngoài Wave 1. | Kho, IT NPP, Owner | Sơ đồ mọi đường ghi + thử chặn legacy/thiết bị/off-wave |
| GAP-03 | P0 | Lệnh offline có ACK bền, chống trùng, dependency, journal và phục hồi đúng. | Backend, PWA, vận hành | E2E-17–19 trên máy/SQL/network thật |
| GAP-04 | P0 | Cutover đối soát đầy đủ lượng/giá trị kho–xe, nợ, tiền, ngoại lệ và thiết bị chưa đồng bộ. | Kho, kế toán, thủ quỹ, IT, Owner | Manifest, nguồn/đích, biên bản ký, diễn tập Forward Recovery |
| GAP-05 | P0 | A+B không làm mất/trùng hàng, công nợ, thu hộ, chứng từ qua lỗi/crash/restore. | QA, kho, kế toán | Ledger before/after, fault injection, E2E-02/03/16/19/21 |
| GAP-06 | P1 | Baseline chính thức: quyết định → rule → data → API/state → test → evidence. | Product Owner, nghiệp vụ, kỹ thuật | Baseline version, ADR, ma trận truy vết và approvals rõ |
| GAP-07 | P1 | Tích hợp kế toán có durable outbox, nhận/POSTED/đối soát và kiểm soát nhập thủ công. | Kế toán, team tích hợp | Contract đã xác nhận, ACK/lookup/webhook, reconciliation batch |
| GAP-08 | P1 | Chênh giá vốn di động và bình quân kỳ có contract cuối kỳ. | Kế toán giá thành | Mapping nguồn, phí muộn, kỳ khóa, bảng điều chỉnh mẫu |
| GAP-09 | P1 | Bộ dữ liệu/chứng từ NPP-01 có nguồn, quyền sử dụng và mapping import. | Owner dữ liệu/Kho/Kế toán | Catalog, số dư, ID, kiểm tra trùng/hash, chữ ký đối chiếu |
| GAP-10 | P1 | Thiết bị PWA và UX offline được thử với nhiệm vụ thực tế. | Nhân viên giao/bán, QA | Thiết bị, phiên bản browser, điều kiện mạng, bài task và lỗi |
| GAP-11 | P1 | Đời quyền/restore, privacy action và external invoice registry có thẩm quyền hiện hành. | Security, vận hành, kiểm soát dữ liệu | Revocation/restore drill, audit, dữ liệu ngoài rollback |
| GAP-12 | P1 | Quy tắc hóa đơn A/B và chứng từ cấp xe theo hồ sơ seller/provider thực. | Kế toán NPP, provider | Seller profile, sandbox, INV-01–09, external document links |
| GAP-13 | P1 | Runbook hỗ trợ pilot, ngoại lệ có người nhận và rehearsal sự cố. | Vận hành, QA, Owner | Case queue, runbook, n/N, giờ phát sinh/đóng, rehearsal |
| GAP-14 | P2 | Hiệu quả tác vụ so baseline và mức sẵn sàng dùng/trả phí. | Owner, người dùng pilot | Mẫu đo, kết quả thực, cohort, n/N |
| GAP-15 | P2 | Chi phí phục vụ/tenant và khả năng mở rộng sau Wave 1. | Owner sản phẩm/vận hành | Tài nguyên, công hỗ trợ, sự cố, chi phí theo kỳ thực |

### Các lưu ý chặn hiểu nhầm

1. **Wave sử dụng ≠ phạm vi kho:** dù chỉ 8 chuyến/ngày dùng PWA trong pilot, tất cả biến động Kho-01 từ cutover phải đi qua MVP; không chạy đồng thời hai nguồn ghi kho.
2. **Truyền xong ≠ ghi sổ ≠ đối soát:** ACK bền lệnh offline không bảo đảm tác động nghiệp vụ đã được chấp nhận; hệ thống kế toán báo `POSTED` không thay kết quả đối soát.
3. **Đã giao thật ≠ có thể từ chối/rollback sự thật:** nếu hết quyền, ghi ngoại lệ bền, không xóa hàng/tiền thực tế hoặc ghi ngày hồi tố để hợp thức.
4. **Chưa có chứng cứ B-CASE là gate đóng**, không phải yêu cầu dừng mọi phát triển A, quản lý kho, công nợ hoặc adapter.

## 4. Lộ trình 5 đợt và cổng kiểm soát

| Đợt | Đầu ra kiểm chứng | Điều kiện không được suy diễn |
|---|---|---|
| 1 — Baseline | Sổ quyết định, ADR, glossary, rule/data/API/SM, AC/evidence registry. | Có tài liệu không phải sản phẩm PASS. |
| 2 — NPP-01/integration | Dữ liệu mẫu có quyền, hợp đồng API thật, chi phí kỳ, kiểm quyền ghi. | B-CASE tạm `EVIDENCE_PENDING`, không tuyên bố đã khép. |
| 3 — Vertical Slice A+B | Phát hàng, giao/bán, thu, sổ, outbox, ngoại lệ và test lỗi trên thành phần thật. | Test script R008 không thay integration E2E. |
| 4 — Cutover & Go/No-Go | Diễn tập freeze/import, độc quyền kho, chống trùng và forward recovery. | P0 chưa đóng → không mở đường giao dịch thật liên quan. |
| 5 — Wave 1 | 3 A + 3 B + 2 mixed chuyến/ngày ≥5 ngày có số đo theo rủi ro. | Không mở rộng chỉ theo cảm giác hoặc demo. |

Đợt 1 được chuyển thành các file thực thi trong [R009](report.vi.md). Các đợt 2–5 là **kế hoạch**, không đánh dấu hoàn thành.

## 5. Quyết định hiện thời và hành động tiếp theo

- **GO để viết đặc tả và phát triển có kiểm soát; NO-GO để chạy thật A+B toàn phạm vi** tại mốc đánh giá.
- Chốt hợp đồng và owner theo [sổ quyết định](decision-register-and-adr.vi.md), thực thi theo [kế hoạch](implementation-and-pilot-plan.vi.md).
- Trước review/merge các vertical slice, yêu cầu mã `D → BR → DC → API/SM → AC → EV`, bằng chứng sản phẩm phù hợp và ghi rõ phạm vi mới có thể mở.
