# S6-0 — Đánh giá repository source chính thức cho Product DMS

**Ngày rà soát:** 14/11/2026 · **Kết luận:** `SOURCE_REPOSITORY_DECISION_CANDIDATE / OWNER_APPROVAL_PENDING`. PR #2 đã merge vào `main` bằng `ba6d526b518b877c1f2c9f04732273f9f33968c4`; Product Baseline C′ và Acceptance Record R đã được ghi nhận, chỉ phạm vi tài liệu.

## 1. Các nguồn đã mở trực tiếp

| Phương án | Source đã kiểm | Khả năng tái sử dụng | Điều thiếu hoặc xung đột với Product C′ |
|---|---|---|---|
| A — Triển khai ngay trong [MyDmsVn](https://github.com/chung6a8m/MyDmsVn) + [ReactWebUI](https://github.com/chung6a8m/MyDmsVn.ReactWebUI) | README, plans và HttpHost | Đã có một phần Sales/Inventory, cơ chế ghi nhận giao dịch, UI nhập liệu compact, SQL test/evidence | Backend net48 với phạm vi dự án hiện hữu; chưa chứng minh mô hình SaaS DMS multi-tenant và Module A/B_ONLINE/MIXED, PWA offline theo C′; nhập chung có nguy cơ làm xung đột roadmap/release |
| B — Dùng nguyên [SaasOne](https://github.com/chung6a8m/SaasOne) làm repo DMS | README, roadmap v1.3, verification M5 | .NET 10, Orchard Core, DB-per-tenant, identity, authorization, Orders/Approvals, SQL/CI có evidence M5 | SaasOne là **nền dùng chung**, UX chính MVC/Razor; chưa có FMCG stock/AR/custody/advance, B_ONLINE provider, Mixed, offline PWA; đưa sản phẩm cụ thể vào repo nền làm giảm tính tái sử dụng |
| C — Khởi tạo từ [dotnet-starter-kit](https://github.com/chung6a8m/dotnet-starter-kit) | README, MIT LICENSE | .NET 10 modular monolith, React, API, multi-tenant, migration/testing và các thành phần tiện ích | Framework chính dùng Postgres; mức tích hợp/độ phức tạp lớn, nghiệp vụ và P0 phải tự xây; kiểm tra license, security và độ tương thích trước khi sao chép |
| D — **Repository source mới dành riêng cho sản phẩm DMS** | Đề xuất tổ chức source, **chưa tạo repo** | Tách Product C′ khỏi các roadmap đang triển khai; một nơi quản lý domain/API/PWA/đối soát và E2E; có thể dùng lại code/packages **theo lựa chọn có review** | Cần bootstrap hạ tầng/CI/tenant authority/nhập dữ liệu, lựa chọn công nghệ TADR và xác nhận Owner, không được gắn trạng thái `READY` từ mẫu |

**Nguồn dữ liệu:** các README mặc định trên GitHub tại thời điểm rà soát và các tài liệu kế hoạch/verification liên kết. Các kết quả lịch sử của MyDmsVn hoặc SaasOne **không tự chuyển thành EV-01..15** của Product Baseline C′.

## 2. Khuyến nghị source-repository strategy

**Ưu tiên D: tạo một repository source DMS độc lập**, rồi đối chiếu kỹ thuật để tái sử dụng có chọn lọc.

- Repo mới **chỉ là kiến nghị**, chưa có tên được Owner duyệt, chưa có URL/GitHub ID và **chưa được tạo**. Tên minh họa `chung6a8m/FmcgDmsVn` không phải locator của một repo đã tồn tại. Visibility (private/public), license, người có quyền admin/maintainer và branch protection đều **UNSET**.
- Cấu trúc khuyến nghị MVP: một product application repository dùng chung cho domain/application/API, frontend điều hành và PWA mobile, schema/migrations, test harness và acceptance evidence metadata. Cần review lựa chọn monorepo so với frontend repo riêng trước khi tạo.
- Nên **đánh giá SaasOne như nền tảng/thư viện hoặc kiến trúc tham khảo** vì đã có DB-per-tenant, Identity và cơ chế audit; không mặc định clone nguyên Orchard CMS hoặc đưa nghiệp vụ FMCG vào chính repo SaasOne.
- **MyDmsVn/MyDmsVn.ReactWebUI** là nguồn tham khảo mẫu thao tác Sales/Inventory, grid/lookup, idempotency test và recovery, không được bê các trạng thái release hay business rule cũ thay cho C′.
- **FullStackHero starter kit** chỉ là benchmark/template alternative (phải review migration/license, Postgres vs SQL Server, surface security); không mặc định dùng do được quảng bá là production-ready.
- TADR-01/02 cùng Technical/QA phải chốt transaction boundary, SQL/provider, identity/offline durability trước khi biến đề xuất thành kiến trúc thực. Ưu tiên thử một vertical slice G-IDEMP + 3 ledger với source thực để xác nhận feasibility.

## 3. Điều kiện chốt `SOURCE_REPOSITORY_SELECTED`

Cần **Owner ra quyết định có phiên bản** (S6-0-REPO-01), ghi:
1. Chọn A/B/C/D; nếu D thì tên chính xác, visibility/license, quyền Owner/Admin và có thể tạo repository; nếu A/B/C thì nguyên tắc tách sản phẩm khỏi nền tảng hiện có.
2. Ranh giới sản phẩm: Product C′ là nguồn chuẩn nghiệp vụ; backend/frontend/PWA/API/database/test và S6 evidence ở repo nào, có thể có companion repo nếu được review.
3. Technical review chọn bootstrap có trade-offs thực (SaasOne reuse, FullStackHero hoặc clean base); lộ trình upgrade/migrations, tenant data isolation, artifacts và chi phí bảo trì.
4. Chỉ sau khi GitHub xác nhận repo tồn tại, có branch/CI/owners thực và safety plan, chuyển `sourceRepository` từ `NOT_SELECTED` sang **actual owner/name**. Không coi tên dự kiến hoặc việc tạo README là triển khai S6-A.

**Tại thời điểm hồ sơ này:** Đã thu thập bằng chứng và đề xuất phương án D. Trạng thái vẫn `OWNER_DECISION_PENDING / REPO_NOT_CREATED / S6_RUNTIME_NOT_STARTED` để bảo vệ đúng quy trình S6-0.
