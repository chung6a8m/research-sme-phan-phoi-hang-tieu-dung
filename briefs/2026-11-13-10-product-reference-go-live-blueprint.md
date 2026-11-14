# B010 — Đề bài Product Reference Baseline & Go-Live Blueprint

**Ngày:** 13/11/2026. **Trạng thái:** Đề bài nghiên cứu/thiết kế, chưa phải bộ hồ sơ đã hoàn thành hay Go-Live.

## Mục tiêu

Kế thừa toàn bộ R009 từ PR #1, hình thành một sản phẩm DMS chuẩn dùng chung cho nhiều nhà phân phối, không phụ thuộc việc NPP-01 hoàn tất mọi dữ liệu và xác nhận thực tế. NPP-01 được onboarding vào mô hình chuẩn; điều chỉnh hoạt động hoặc sử dụng cấu hình có kiểm soát thay vì buộc sản phẩm mô phỏng mọi ngoại lệ sẵn có.

Tạo bộ tài liệu đủ để **giao phát triển, kiểm thử, triển khai thử và chuẩn bị Go-Live**, gồm: workflow tiêu chuẩn, catalog chính sách/default, template dữ liệu nhập, fixture giả lập và oracle, SOP và RACI, acceptance/evidence, hướng dẫn tích hợp, cutover và vận hành.

## Ranh giới

- Kế thừa các quyết định D-01–D-15 và bất biến BR-01–24 của R009; thay đổi bằng Product ADR/Owner acceptance, không sửa ngược lịch sử.
- Giữ MVP một người bán/tenant, một database/tenant, PWA, Module A/B/mixed, kho/UoM/lot, giá vốn vận hành, chính sách giá hữu hạn, AR–custody–advance, hóa đơn và outbox kế toán.
- Phân loại: bất biến không cấu hình; default có phiên bản; cấu hình được phép; ngoại lệ cần phê duyệt.
- Không tự chọn nhà cung cấp hóa đơn/kế toán; không khẳng định đúng thuế suất, pháp lý hoặc dữ liệu thật của NPP.
- Bán B khi không có kênh lập hóa đơn hợp lệ mặc định BLOCKED đến khi B-CASE, LEGAL-MEMO và thử nghiệm đạt. Một writer kho cho toàn phạm vi sau cutover.
- Không thêm ERP đầy đủ, multi-seller, AI, tối ưu tuyến hoặc multi-writer trong MVP.

## Bàn giao mục tiêu P01–P08 (chưa hoàn thành)

P01 quy trình và SOP theo vai trò; P02 chính sách mặc định, schema tenant profile/feature gate; P03 data dictionary và mẫu CSV/XLSX + import; P04 reference fixtures deterministic; P05 acceptance/negative test/evidence; P06 onboarding/cutover/DR/support; P07 gap assessment NPP; P08 seller/provider/legal/accounting preflight.

## Định nghĩa kết quả

DOC_READY chỉ xác nhận chất lượng đặc tả và bộ template/fixture. PRODUCT_VERIFIED yêu cầu build, PWA/API/DB, test, evidence thật. TENANT_GO_LIVE_ACCEPTED phải có pháp lý, dữ liệu đầu kỳ đối soát, khóa writer cũ, diễn tập, pilot và chữ ký theo từng tenant/mode. Không đồng nhất ba mức.

Xem [R010 lộ trình](../reports/2026-11-13-10-product-reference-go-live-blueprint/report.vi.md). Commit khởi tạo chỉ lập **S0 roadmap và catalog**, chưa hoàn thành P01–P08.
