# B011 — S6 Engineering Readiness: Source implementation & real evidence

**Ngày:** 14/11/2026. **Trạng thái:** PLAN_ONLY / NOT_EXECUTED.

## Nguồn được phê duyệt

PR #2 đã có Owner Acceptance ở phạm vi Product Policy/Contract v1. Snapshot C′: eb9c4b04e334530367b80ea4178edb4dd4a07491. Commit R metadata: e47c3feb44c02a0fdf46c35f6c4b2f57c4365470. Hệ thống PWA/API/SQL/provider/accounting chưa được xác nhận chạy E2E thực, không có Tenant Go-Live.

## Mục tiêu

- S6-0: chọn repository source, owners, environment và CI; gắn AC/EV/fixture/testRunId/artifact store vào source, thiết kế safety plan.
- S6-A..F: triển khai vertical slice theo handoff R010; review TADR-01..06 riêng, build/test thực qua PWA/API/SQL/provider/accounting; chỉ kết luận theo đúng build/tenant/mode/reviewer.
- NPP-01 D-15: Pilot 3 A + 3 B_ONLINE + 2 MIXED mỗi ngày trong ít nhất 5 ngày đại diện; toàn Kho-01 chỉ một stock writer sau cutover, kể cả off-wave.
- EV-14 ký trước Pilot, EV-15 dựa trên kết quả Pilot thật. B_NO_CHANNEL BLOCKED; Offline Write và Production Cutover vẫn disabled pending. Không miễn P0.

## Ranh giới

Repository nghiên cứu cung cấp policy, fixtures, test/evidence contract, không phải source runtime được chứng nhận. Không tự chọn stack/database/provider/tenant data hay nhân sự. Đề án S6 làm trên nhánh và PR riêng, phụ thuộc PR #2 được merge trước khi gắn baseline vào source repo. Không tự merge, cấp mode hoặc Go-Live.

## Definition of Done (chỉ gói chuẩn bị)

Có roadmap/phụ thuộc S6-0/A..F, TADR queue, test/evidence/Go-NoGo matrix, source PR policy, machine-readable tasks và validator negative. Mọi phase vẫn PLANNED_NOT_EXECUTED; không tạo claim product/tenant verified từ docs.

Báo cáo: [S6 Engineering Readiness](../reports/2026-11-14-11-s6-engineering-readiness/README.md).
