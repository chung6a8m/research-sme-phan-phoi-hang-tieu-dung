# Nghiên cứu hệ thống cho doanh nghiệp phân phối hàng tiêu dùng tại Việt Nam

Repository này là **nơi lưu kết quả nghiên cứu của dự án**, không chỉ là nguồn tài liệu để đọc khi nghiên cứu. Nội dung chính là báo cáo nghiên cứu bằng tiếng Việt, nguồn tham khảo, giới hạn của bằng chứng và các đề bài nghiên cứu tiếp theo; không phải repository mã nguồn ứng dụng.

Theo xác nhận của chủ dự án ngày **11/11/2026**, trợ lý được phép ghi các báo cáo nghiên cứu vào repository và chủ động tổ chức thư mục, tên file phù hợp.

## Mục lục

| Mã | Tài liệu | Trạng thái |
|---|---|---|
| R001 | [Tổng quan hệ sinh thái SaaS cho SME phân phối FMCG Việt Nam](reports/2026-11-11-01-tong-quan/report.vi.md) | Bản dịch tiếng Việt đã có trong cuộc trao đổi; lưu nguyên văn, chưa kiểm chứng lại các nguồn. |
| R001-S | [Xuất xứ, nguồn tham khảo và giới hạn của R001](reports/2026-11-11-01-tong-quan/sources.md) | Thông tin lưu trữ và các URL lấy từ báo cáo gốc trong cuộc trao đổi. |
| B002 | [Đề bài nghiên cứu nghiệp vụ MVP và PWA tại Việt Nam](briefs/2026-11-11-02-nghiep-vu-mvp-pwa.md) | Đề bài; đã liên kết tới báo cáo kết quả R002 được nhập từ file đính kèm. |
| R002 | [Nghiệp vụ nhà phân phối FMCG và MVP PWA — báo cáo đầy đủ](reports/2026-11-11-02-nghiep-vu-mvp-pwa/report.vi.md) | Đã lưu nguyên văn toàn bộ file `deep-research-report (1).md`; đã đối chiếu mã kiểm tra nội dung, chưa kiểm chứng lại các nhận định. |
| R002-S | [Xuất xứ bản lưu và giới hạn bằng chứng của R002](reports/2026-11-11-02-nghiep-vu-mvp-pwa/sources.md) | Thông tin file nguồn, mã kiểm tra, phạm vi nội dung và giới hạn của lần nhập. |
| R002-D01 | [Lựa chọn mô hình A/B, nhân sự giao hàng và quy chuẩn thuật ngữ](reports/2026-11-11-02-nghiep-vu-mvp-pwa/quyet-dinh-va-thuat-ngu.vi.md) | Đã ghi lựa chọn A/B và quy tắc xe máy/xe tải của chủ dự án; glossary, ERD và ràng buộc chi tiết là đề xuất thiết kế. |
| R003 | [MVP và kiến trúc giải pháp — Tổng hợp Deep Research](reports/2026-11-11-03-deep-research-mvp-kien-truc/report.vi.md) | Bản biên tập đã có; ghi quyết định mỗi tenant một database. UoM, giá vốn, công nợ, pricing và kiến trúc chi tiết còn là đề xuất. |
| R004 | [Glossary, ERD khái niệm và kịch bản nghiệp vụ MVP](reports/2026-11-11-04-deep-research-erd-nghiep-vu/report.vi.md) | Bản biên tập đã có; glossary/ERD/trạng thái và phạm vi chi tiết chưa nghiệm thu; một số nguồn chưa đủ URL/điều khoản. |
| R005 | [Khoảng trống và mục tiêu nghiên cứu bổ sung để đạt MVP](reports/2026-11-11-05-khoang-trong-va-muc-tieu-mvp/report.vi.md) | Đã phân tích R001–R004 và đối chiếu một số nguồn sơ cấp; đề xuất 10 mục tiêu nghiên cứu, chưa thực hiện khảo sát/spike/pilot. |
| R005-S | [Nguồn và giới hạn bằng chứng của R005](reports/2026-11-11-05-khoang-trong-va-muc-tieu-mvp/sources.md) | Baseline, nguồn đã đọc, phạm vi kiểm chứng và những việc chưa thực hiện. |
| B005 | [Đề bài nghiên cứu bổ sung để chốt đặc tả và pilot MVP](briefs/2026-11-11-05-nghien-cuu-bo-sung-dat-mvp.md) | Owner đã yêu cầu thực hiện; có kết quả nghiên cứu tài liệu R006. Chưa hoàn tất bằng chứng thực địa/thử nghiệm/pilot; chính sách chi tiết vẫn cần quyết định. |
| R006 | [Kết quả nghiên cứu bổ sung để chốt đặc tả MVP](reports/2026-11-11-06-ket-qua-nghien-cuu-mvp/report.vi.md) | Đã đối chiếu nguồn sơ cấp, xây phương án và kiểm tra bộ số liệu giả lập; ghi mức hoàn thành cả 10 mục tiêu B005. Chưa nghiệm thu toàn bộ B005 hoặc sẵn sàng pilot. |
| R006-B | [Nghiệp vụ, quy tắc và bộ số liệu](reports/2026-11-11-06-ket-qua-nghien-cuu-mvp/nghiep-vu-va-so-lieu.vi.md) | Glossary/quan hệ/quyền, A/B, UoM/giá vốn, giá/ưu đãi, ba sổ tiền và phép tính tái lập; là phương án đề nghị. |
| R006-T | [PWA và vận hành mỗi tenant một database](reports/2026-11-11-06-ket-qua-nghien-cuu-mvp/pwa-va-van-hanh-tenant.vi.md) | Khả năng trình duyệt, quyền offline, ACK/đóng chuyến, cách ly/migration/restore; chưa chạy spike/diễn tập. |
| R006-L | [Hóa đơn và tuân thủ](reports/2026-11-11-06-ket-qua-nghien-cuu-mvp/hoa-don-va-tuan-thu.vi.md) | Đối chiếu văn bản hiện hành theo điều/khoản, thời điểm hóa đơn, khuyến mại và dữ liệu cá nhân; áp dụng cụ thể cần xác nhận trước pilot. |
| R006-P | [Phân khúc, pilot và tích hợp](reports/2026-11-11-06-ket-qua-nghien-cuu-mvp/pilot-va-tich-hop.vi.md) | Archetype, bằng chứng API, ca sandbox, cấu trúc import/cutover, tác vụ và công thức KPI; chưa có khảo sát hay kết quả pilot. |
| R006-S | [Nguồn và giới hạn bằng chứng](reports/2026-11-11-06-ket-qua-nghien-cuu-mvp/sources.md) | Sổ nguồn tổng, sản phẩm/API và liên kết nguồn nghiệp vụ/kỹ thuật/pháp lý, ghi rõ tài liệu chỉ đọc được qua chỉ mục hoặc lỗi truy cập. |
| R007 | [Review PR #1 và mục tiêu nghiên cứu tiếp theo để đạt MVP](reports/2026-11-12-07-review-pr1-va-muc-tieu-tiep-theo/report.vi.md) | Review tại HEAD `f267819`; bốn điểm cần khép trong tài liệu/contract, sáu mục tiêu tiếp nối và E2E-13–22. Chưa là kiểm thử sản phẩm hoặc nghiệm thu pilot. |
| R007-S | [Nguồn và phép kiểm tra của review PR #1](reports/2026-11-12-07-review-pr1-va-muc-tieu-tiep-theo/sources.md) | Mốc review, nguồn chọn lọc, phép tái tính và phản ví dụ, giới hạn bằng chứng. |
| B007 | [Kiểm chứng và chốt đặc tả MVP](briefs/2026-11-12-07-kiem-chung-va-chot-dac-ta-mvp.md) | Owner đã yêu cầu nghiên cứu; có kết quả R008 về đặc tả ứng viên và mô hình. Chưa đủ bằng chứng ngoài hệ thống hoặc chấp nhận chính sách để nghiệm thu toàn bộ. |
| R008 | [Khép quy tắc và bổ sung đặc tả MVP theo review PR #1](reports/2026-11-12-08-khep-quy-tac-va-dac-ta-mvp/report.vi.md) | Thực hiện R007/B007: phương án khắc phục F01–04, kết quả theo BS-01–06 và E2E-13–22; tách tài liệu/mô hình khỏi sản phẩm/pilot. |
| R008-SPEC | [Đặc tả MVP hợp nhất để xem xét chấp nhận](reports/2026-11-12-08-khep-quy-tac-va-dac-ta-mvp/dac-ta-mvp-de-nghi.vi.md) | 12 bất biến, Q01–Q10, 22 nhóm khả năng, dữ liệu/trạng thái/vai trò và truy vết; vẫn là phương án đề nghị. |
| R008-B | [Quy tắc hàng–tiền và chu kỳ nhiều ngày](reports/2026-11-12-08-khep-quy-tac-va-dac-ta-mvp/nghiep-vu-va-so-lieu.vi.md) | Quà ròng/miễn, phần dư giá vốn, terms, tiền/thuế giả lập, phí muộn/kỳ khóa; script và JSON tái lập. |
| R008-T | [Offline, ACK và phục hồi](reports/2026-11-12-08-khep-quy-tac-va-dac-ta-mvp/offline-va-phuc-hoi.vi.md) | Durable inbox, quyền/dữ liệu sau restore, downsync, compound command và runbook; mô hình hữu hạn đã chạy, chưa thử hạ tầng/thiết bị thật. |
| R008-L | [Hồ sơ hóa đơn, vận chuyển và dữ liệu](reports/2026-11-12-08-khep-quy-tac-va-dac-ta-mvp/hoa-don-va-du-lieu.vi.md) | Nguồn hiện hành/sắp hiệu lực, schema provider, profile/state/mapping và ca sandbox; chưa chạy provider hoặc xác nhận hồ sơ NPP. |
| R008-P | [Pilot, viếng thăm và bàn giao](reports/2026-11-12-08-khep-quy-tac-va-dac-ta-mvp/pilot-va-ban-giao.vi.md) | Hồ sơ tuyển/đầu vào, visit không đơn, 8 bài UX, cutover/import/export, ngoại lệ/KPI/cost; chưa có người dùng hoặc dữ liệu pilot. |
| R008-S | [Nguồn và phạm vi kiểm chứng R008](reports/2026-11-12-08-khep-quy-tac-va-dac-ta-mvp/sources.md) | Sổ nguồn chuyên đề, lệnh chạy, số liệu/mô hình, trạng thái bằng chứng và giới hạn. |
| B010 | [Đề bài Product Reference Baseline & Go-Live Blueprint](briefs/2026-11-13-10-product-reference-go-live-blueprint.md) | Đề bài cho chuẩn sản phẩm đa NPP, template và Go-Live gates; chưa là kết quả triển khai. |
| R010 | [Lộ trình Product Reference Baseline & Go-Live Blueprint](reports/2026-11-13-10-product-reference-go-live-blueprint/report.vi.md) | Đã lập S0 roadmap; P01–P08 chưa thực hiện, mọi default mới là đề xuất. |
| R010-F | [Template catalogue và fixture blueprint](reports/2026-11-13-10-product-reference-go-live-blueprint/template-catalog-and-fixtures.vi.md) | Thiết kế T01–T14/F0–F2 giả lập; chưa có file nhập liệu máy đọc được. |
| R010-S1-P01 | [Phạm vi sản phẩm và personas](reports/2026-11-13-10-product-reference-go-live-blueprint/product-scope-and-personas.vi.md) | S1 đã soạn, `S1_DOCUMENTED_REVIEW_PENDING`; định hướng product-first, chưa Owner approve. |
| R010-S1-SOP | [12 quy trình vận hành chuẩn A/B/mixed và xử lý ngoại lệ](reports/2026-11-13-10-product-reference-go-live-blueprint/sop-a-b-mixed.vi.md) | S1 đã soạn; SOP là ứng viên, chưa thử nghiệm UX/E2E. |
| R010-S1-ROLE | [Role/RACI và 10 approval classes](reports/2026-11-13-10-product-reference-go-live-blueprint/role-and-approval-matrix.vi.md) | Ma trận quyền logical, chưa RBAC sản phẩm hoặc ký phân nhiệm NPP. |
| R010-S1-POL | [24 Product Policies + 24 key cấu hình](reports/2026-11-13-10-product-reference-go-live-blueprint/product-policy-catalog.vi.md) | Bám BR-01–24; các default mới là `PRODUCT_DEFAULT_PROPOSED`. |
| R010-S1-TP | [Tenant Profile logical schema](reports/2026-11-13-10-product-reference-go-live-blueprint/tenant-profile-schema.vi.md), [JSON Schema](reports/2026-11-13-10-product-reference-go-live-blueprint/tenant-profile.schema.json), [ví dụ synthetic](reports/2026-11-13-10-product-reference-go-live-blueprint/tenant-profile.example.json) | Schema `DESIGN_CANDIDATE`, ví dụ DRAFT không dùng production. |
| R010-S1-ADR | [9 Product ADR ứng viên](reports/2026-11-13-10-product-reference-go-live-blueprint/product-adrs.vi.md) | PADR-01–09 đang `PROPOSED_FOR_OWNER_REVIEW`, không thay quyết định R009. |
| R010-S2 | [S2 — Data Foundation P03/P04](reports/2026-11-13-10-product-reference-go-live-blueprint/s2/README.md) | 14 CSV blank + dictionary/example + F0/F1/F2 + 343 trip model + Node checks; **synthetic CI success**, Owner pending. |
| R010-S2-IMPORT | [Hướng dẫn nhập CSV/Excel và dry-run](reports/2026-11-13-10-product-reference-go-live-blueprint/s2/import-template-guide.vi.md) | CSV + Excel generator và non-writing validator; không là import/cutover thật. |
| R010-S2-QUALITY | [Kiểm chất lượng/đối soát](reports/2026-11-13-10-product-reference-go-live-blueprint/s2/data-quality-and-reconciliation.vi.md) | Ràng buộc opening/kho–tiền–nợ; Go-Live blocker độc lập. |
| R010-S2-SCENARIO | [Kịch bản F0/F1/F2 và oracle](reports/2026-11-13-10-product-reference-go-live-blueprint/s2/reference-scenarios.vi.md) | Các ca và expected giả lập, không phải fault injection thật. |
| R010-S2-VAL | [Báo cáo kiểm chứng S2](reports/2026-11-13-10-product-reference-go-live-blueprint/s2/validation-results.vi.md) | Model checks và GitHub Actions success; chưa product/pilot verified. |
| R010-S1-VAL | [Kết quả kiểm cấu trúc S1](reports/2026-11-13-10-product-reference-go-live-blueprint/s1-validation-results.vi.md) | Đã đối chiếu ID/truy vết/link/JSON qua GitHub; không phải kiểm chứng ứng dụng hoặc Owner approval. |
| R010-S1-TR | [Truy vết S1](reports/2026-11-13-10-product-reference-go-live-blueprint/s1-traceability.vi.md) và [validator](reports/2026-11-13-10-product-reference-go-live-blueprint/kiem-tra-s1.py) | Cấu trúc D/BR→POL/SOP→AC/EV; không phải kiểm thử ứng dụng. |
| R010-S | [Nguồn và giới hạn bằng chứng R010](reports/2026-11-13-10-product-reference-go-live-blueprint/sources.md) | Tách kế thừa R009 với giả định sản phẩm và chứng cứ thực chưa có. |
| R009 | [MVP Specification Baseline v1 — NPP-01](reports/2026-11-13-09-mvp-specification-baseline/report.vi.md) | Đã lập bản baseline theo quyết định Owner sau R008; chính sách có trạng thái, đặc tả là draft, chưa có nghiệm thu hệ thống/Go-Live. |
| R009-RAW | [Phỏng vấn quyết định Q01.txt — nguyên văn](reports/2026-11-13-09-mvp-specification-baseline/sources/npp-01-interview-summary-2026-11-12.original.txt) | Đã bảo toàn 10.280 byte nguồn tóm lược và SHA-256 trong R009-S; **không phải** transcript Q01–Q10 hoặc báo cáo Markdown đầy đủ từng dẫn. |
| R009-NPP | [Tổng hợp quyết định và khoảng trống NPP-01](reports/2026-11-13-09-mvp-specification-baseline/npp-01-tong-hop-quyet-dinh-va-khoang-trong-mvp-2026-11-12.vi.md) | Bản biên tập lại từ tóm lược ngày 12/11/2026, không phải bản sao byte của file Markdown đầy đủ; phân rã thành 15 gói khoảng trống và gate. |
| R009-D | [Decision Register và ADR](reports/2026-11-13-09-mvp-specification-baseline/decision-register-and-adr.vi.md) | D-01–15; phân biệt chính sách đã chọn với kỹ thuật ứng viên và evidence còn thiếu. |
| R009-G | [Glossary & Data Contracts](reports/2026-11-13-09-mvp-specification-baseline/glossary-and-data-contracts.vi.md) | DC-01–18: tenant, seller, Customer/Outlet/ShipTo, kho, tiền, offline, invoice, accounting, cutover, authority. |
| R009-BR | [Business Rules v1](reports/2026-11-13-09-mvp-specification-baseline/business-rules.vi.md) | BR-01–24; bất biến kho–giao–thu–nợ–giá vốn–khuyến mại–offline–kế toán. |
| R009-API | [API & State Machines v1](reports/2026-11-13-09-mvp-specification-baseline/api-and-state-machines.vi.md) | API-01–12, SM-01–10 ở mức contract ứng viên, không phải endpoint đã phát hành. |
| R009-TR | [Ma trận truy vết D→BR→DC→API/SM→AC→EV](reports/2026-11-13-09-mvp-specification-baseline/traceability.vi.md) | Full IDs, kiểm tra assertions rule↔AC và evidence, mode-specific readiness. |
| R009-VAL | [Script kiểm tra truy vết](reports/2026-11-13-09-mvp-specification-baseline/kiem-tra-truy-vet.py) | Lint tài liệu: IDs, orphan, AC→BR trực tiếp và evidence; không chứng minh sản phẩm PASS. |
| R009-AC | [Acceptance Tests & Evidence Register](reports/2026-11-13-09-mvp-specification-baseline/acceptance-tests-and-evidence.vi.md) | AC-01–21 (bổ sung pricing/VAT, partial advance, partial receipt) và EV-01–15; `MODEL_ONLY/NOT_RUN`; B-CASE vẫn pending. |
| R009-PLAN | [Kế hoạch 5 đợt và Wave 1](reports/2026-11-13-09-mvp-specification-baseline/implementation-and-pilot-plan.vi.md) | WP-01–10, DEV-01–12, cutover và 8 chuyến/ngày × ≥5 ngày; chưa triển khai sản phẩm hoặc pilot thật. |
| R009-S | [Xuất xứ và giới hạn R009](reports/2026-11-13-09-mvp-specification-baseline/sources.md) | Phân biệt tóm lược nguồn, quyết định Owner, mô hình R008 và các điều còn cần xác minh. |

## Cấu trúc

```text
README.md
AGENTS.md
reports/
  2026-11-11-01-tong-quan/
    report.vi.md
    sources.md
  2026-11-11-02-nghiep-vu-mvp-pwa/
    report.vi.md
    sources.md
    quyet-dinh-va-thuat-ngu.vi.md
  2026-11-11-03-deep-research-mvp-kien-truc/
    report.vi.md
  2026-11-11-04-deep-research-erd-nghiep-vu/
    report.vi.md
  2026-11-11-05-khoang-trong-va-muc-tieu-mvp/
    report.vi.md
    sources.md
  2026-11-11-06-ket-qua-nghien-cuu-mvp/
    report.vi.md
    sources.md
    nghiep-vu-va-so-lieu.vi.md
    nguon-nghiep-vu.md
    pwa-va-van-hanh-tenant.vi.md
    nguon-ky-thuat.md
    hoa-don-va-tuan-thu.vi.md
    nguon-phap-ly.md
    pilot-va-tich-hop.vi.md
  2026-11-12-07-review-pr1-va-muc-tieu-tiep-theo/
    report.vi.md
    sources.md
  2026-11-12-08-khep-quy-tac-va-dac-ta-mvp/
    report.vi.md
    dac-ta-mvp-de-nghi.vi.md
    nghiep-vu-va-so-lieu.vi.md
    offline-va-phuc-hoi.vi.md
    hoa-don-va-du-lieu.vi.md
    pilot-va-ban-giao.vi.md
    sources.md
    nguon-nghiep-vu.md
    nguon-ky-thuat.md
    nguon-phap-ly.md
    kiem-chung-so-lieu.py
    ket-qua-so-lieu.json
    kiem-chung-giao-thuc.py
    ket-qua-giao-thuc.json
  2026-11-13-09-mvp-specification-baseline/
    report.vi.md
    npp-01-tong-hop-quyet-dinh-va-khoang-trong-mvp-2026-11-12.vi.md
    decision-register-and-adr.vi.md
    glossary-and-data-contracts.vi.md
    business-rules.vi.md
    api-and-state-machines.vi.md
    traceability.vi.md
    kiem-tra-truy-vet.py
    acceptance-tests-and-evidence.vi.md
    implementation-and-pilot-plan.vi.md
    sources.md
    sources/
      npp-01-interview-summary-2026-11-12.original.txt
briefs/
  2026-11-11-02-nghiep-vu-mvp-pwa.md
  2026-11-11-05-nghien-cuu-bo-sung-dat-mvp.md
  2026-11-12-07-kiem-chung-va-chot-dac-ta-mvp.md
```

- `reports/`: kết quả nghiên cứu đã có, tổ chức theo đợt nghiên cứu.
- `briefs/`: yêu cầu và phạm vi nghiên cứu; không trình bày đề bài như kết quả đã hoàn thành.
- `AGENTS.md`: hướng dẫn cho trợ lý nghiên cứu và ghi kết quả vào repository.

Tên thư mục báo cáo theo mẫu `YYYY-MM-DD-NN-chu-de`; báo cáo chính là `report.vi.md`. Nội dung dùng tiếng Việt, tên đường dẫn dùng chữ thường không dấu và dấu gạch nối. File văn bản mới dùng UTF-8 và LF; bản nhập nguyên văn ưu tiên giữ nguyên nội dung nguồn.

## Phạm vi được chủ dự án xác nhận

Chủ dự án lựa chọn MVP ban đầu tập trung vào quản trị nhà phân phối, đơn hàng, kho, hóa đơn điện tử, thu tiền/công nợ và báo cáo cơ bản. Ứng dụng đặt hàng cho nhân viên thị trường sử dụng **PWA thay cho ứng dụng di động native**.

Báo cáo R001 là bản ghi lịch sử trước lựa chọn PWA. Giữ nguyên phần kiến trúc/ứng dụng di động trong báo cáo đó để bảo toàn nội dung; không xem các đề xuất lịch sử là quyết định mới. Đề bài B002 ghi nhận lựa chọn hiện tại và yêu cầu nghiên cứu cách vận hành nghiệp vụ tại Việt Nam.

Kết quả nghiên cứu của đợt B002 đã được lưu tại [R002](reports/2026-11-11-02-nghiep-vu-mvp-pwa/report.vi.md) theo toàn bộ file đính kèm do chủ dự án cung cấp. Giữ riêng đề bài và báo cáo; việc nhập đầy đủ file không đồng nghĩa với kiểm chứng hoặc nghiệm thu mọi nội dung nghiên cứu.

Ngày **11/11/2026**, chủ dự án chọn **Module A — đặt trước rồi giao** và **Module B — bán theo xe** trong R002. Khi giao bằng xe máy, nhân viên giao hàng đồng thời là người lái xe; khi giao bằng xe tải, có thể có một người giao hàng và một người lái xe. Chủ dự án cũng yêu cầu chuẩn hóa các cụm từ khách hàng/customer, điểm bán, đại lý, NPP, doanh nghiệp và tenant.

[Phụ lục R002-D01](reports/2026-11-11-02-nghiep-vu-mvp-pwa/quyet-dinh-va-thuat-ngu.vi.md) ghi lựa chọn A/B và đề xuất thuật ngữ, phân vai, ERD để dùng khi viết đặc tả tiếp theo. Chỉ phần lựa chọn được nêu rõ là chủ dự án đã xác nhận; tên thực thể, ràng buộc dữ liệu và các chính sách bổ sung vẫn là đề xuất. R002 và phụ lục tiếp tục được giữ nguyên làm bản ghi lịch sử.

**Cập nhật theo R003 ngày 11/11/2026:** multi-tenant đã chọn **mỗi tenant một database**. Các câu còn để mở cách tách database trong tài liệu trước đó phản ánh thời điểm cũ. Ánh xạ doanh nghiệp–tenant–bên thuê SaaS, chính sách chuyến kết hợp A/B, phương pháp giá vốn và các quy tắc chi tiết khác vẫn cần xác minh/chốt.

[R005](reports/2026-11-11-05-khoang-trong-va-muc-tieu-mvp/report.vi.md) đối chiếu các báo cáo hiện có và đề xuất mục tiêu bổ sung về phân khúc/pilot, mô hình dữ liệu, A/B, UoM/giá vốn, giá/khuyến mại, công nợ/đối soát, PWA offline, hóa đơn, vận hành tenant và onboarding/đo giá trị. Đây là phân tích và đề xuất; không tự phê duyệt glossary, schema, chính sách nghiệp vụ hoặc lịch triển khai. Hóa đơn điện tử tiếp tục thuộc phạm vi ban đầu dù danh sách MVP trong R004 chưa liệt kê lại hạng mục này.

**Kết quả thực hiện B005 ngày 11/11/2026:** [R006](reports/2026-11-11-06-ket-qua-nghien-cuu-mvp/report.vi.md) và bốn phụ lục bổ sung nguồn đã kiểm tra, phương án MVP cụ thể, số dư giả lập, contract offline/restore, ma trận pháp lý và tiêu chí kiểm chứng. Đợt này phát hiện cần phân biệt offline ghi nhận giao dịch với khả năng lập hóa đơn đúng thời điểm; một DB riêng cũng chưa bảo đảm replay an toàn sau restore. Giữ các bản R001–R005 nguyên trạng để theo dõi diễn tiến. R006 chưa thay thế phỏng vấn NPP, sandbox/thiết bị, diễn tập hoặc bằng chứng sử dụng/trả phí của pilot.

**Review PR #1 ngày 12/11/2026:** [R007](reports/2026-11-12-07-review-pr1-va-muc-tieu-tiep-theo/report.vi.md) ghi nhận nền nghiên cứu đã có, tái tính fixture chính và nêu bốn điểm cần khép: quyền/yêu cầu dữ liệu sau restore, quà ròng sau giao–trả–giao, phần dư giá vốn trả từng phần và trách nhiệm sau receipt chờ phụ thuộc. [B007](briefs/2026-11-12-07-kiem-chung-va-chot-dac-ta-mvp.md) đề xuất sáu gói việc để hợp nhất đặc tả và tạo bằng chứng với dữ liệu/thiết bị/provider/pilot. R006 tiếp tục là hồ sơ nghiên cứu, chưa là đặc tả đã nghiệm thu; các chính sách chi tiết và mục tiêu tiếp nối chưa được tự động coi là Owner đã phê duyệt.

**Thực hiện nghiên cứu tiếp nối ngày 12/11/2026:** theo yêu cầu Owner, [R008](reports/2026-11-12-08-khep-quy-tac-va-dac-ta-mvp/report.vi.md) khép bốn findings ở lớp quy tắc/contract ứng viên, bổ sung bộ số liệu nhiều ngày và mô hình giao thức có kết quả chạy, hồ sơ hóa đơn/chứng từ cấp xe, đặc tả hợp nhất và công cụ chuẩn bị pilot. Việc thực hiện B007 đã được yêu cầu; các phương án sản phẩm trong R008 vẫn cần chấp nhận theo phạm vi. Chưa có thiết bị/provider/NPP/pilot để thay bằng chứng mô hình bằng nghiệm thu thực tế. R001–R007 giữ nguyên như lịch sử; đặc tả đề nghị mới nằm tại R008-SPEC.

**Baseline NPP-01 ngày 13/11/2026:** [R009](reports/2026-11-13-09-mvp-specification-baseline/report.vi.md) hợp nhất những chính sách Owner đã chọn sau R008 thành Decision Register/ADR, glossary, rule/data/API/state, acceptance/evidence và roadmap triển khai. Các kỹ thuật chi tiết vẫn là ứng viên review; `B-CASE-001/002/003`, `LEGAL-MEMO`, quyền ghi kho độc quyền, offline/cutover và pilot thật vẫn cần chứng cứ trước Go-Live. Tài liệu NPP-01 kèm theo được biên tập từ bản tóm lược hiện có, không được gắn nhãn bản gốc nguyên văn.

**Blueprint sản phẩm ngày 13/11/2026:** [R010](reports/2026-11-13-10-product-reference-go-live-blueprint/report.vi.md) đề xuất bộ chuẩn đa NPP và [catalog dữ liệu nhập/fixture](reports/2026-11-13-10-product-reference-go-live-blueprint/template-catalog-and-fixtures.vi.md). S0 mới là kế hoạch/đề bài, không khẳng định P01–P08, sản phẩm hay Go-Live đã xong. R009/NPP-01 giữ nguyên lịch sử.

**Bổ sung S1/P01–P02 ngày 13/11/2026:** [R010 §9](reports/2026-11-13-10-product-reference-go-live-blueprint/report.vi.md) đã có bộ SOP/roles/policies/schema/ADR và trace ứng viên trên PR #2. **S1 đã soạn tài liệu, chờ Owner review**; không coi default giả lập là chính sách đã duyệt, chưa tạo fixture/import S2 hoặc evidence Go-Live.

**Bổ sung S2/P03–P04 ngày 13/11/2026:** [R010-S2](reports/2026-11-13-10-product-reference-go-live-blueprint/s2/README.md) hiện có các bộ template CSV, dictionary, F0/F1/F2, trip projections, import dry-run, script tạo Excel và CI mô hình. Đây là `S2_ARTIFACTS_IMPLEMENTED_SYNTHETIC_CI_VERIFIED` **chờ review**, không phải sản phẩm Go-Live. Workbook Excel mẫu được tạo trong phiên chat và script tái tạo đã vào PR; binary XLSX chưa commit. Các mệnh đề S0/S1 cũ phản ánh thời điểm tạo tương ứng.

## Quy tắc sử dụng kết quả

Phân biệt dữ liệu có nguồn, tuyên bố của nhà cung cấp, suy luận, giả định và lựa chọn đã được chủ dự án xác nhận. Việc lưu báo cáo không đồng nghĩa với kiểm chứng toàn bộ nội dung hoặc phê duyệt mọi đề xuất. Các thông tin thị trường, giá, pháp lý và khả năng công nghệ phải được ghi rõ ngày và mức độ xác minh khi nghiên cứu mới.

Khi ghi kết quả, cập nhật mục lục và báo lại đường dẫn file cùng commit hoặc pull request thực tế. Không coi việc chỉ đưa URL repo vào yêu cầu nghiên cứu là đã lưu báo cáo.
