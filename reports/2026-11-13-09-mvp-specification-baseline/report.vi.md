# R009 — MVP Specification Baseline v1 cho NPP-01

- **Ngày tạo:** 13/11/2026 (Asia/Bangkok).
- **Đầu vào:** R008-SPEC cùng các phụ lục trong PR #1; bản tổng hợp quyết định NPP-01 đánh giá 12/11/2026; các quyết định Owner ghi nhận sau R008.
- **Tính chất:** Baseline **chính sách và đặc tả thiết kế ban đầu để giao triển khai/review**, chưa là nghiệm thu xây dựng, tuân thủ pháp lý hay Pilot Go-Live.
- **Trạng thái chung:** `SPEC_BASELINE_V1_DRAFT`. Các chính sách được chủ dự án chọn ghi `OWNER_DECIDED`; chi tiết kỹ thuật chưa được phê duyệt ghi `DESIGN_CANDIDATE`; kết quả ngoài nghiên cứu ghi `EVIDENCE_PENDING`.
- **Lưu ý xuất xứ:** Bản Markdown tổng hợp NPP-01 được biên tập lại từ tệp tóm lược hiện có, không phải bản sao nguyên byte của báo cáo đầy đủ trong cuộc trò chuyện trước.

## 1. Kết luận ngắn

R008 đã có các mô hình/fixture và đề nghị Q01–Q10. Sau phỏng vấn, nhiều chính sách cốt lõi đã được chọn; vì vậy không để mọi lựa chọn ở `PROPOSED` như bản lịch sử R008. R009 chuyển chúng thành contract có ID và cổng nghiệm thu. **Không cập nhật lịch sử R008 theo hướng coi mọi phần đã được phê duyệt hoặc kiểm chứng.**

**Có thể triển khai:** dữ liệu đa tenant, danh mục, A, B trong phạm vi được kiểm soát, chuyến hỗn hợp có phân bổ, kho, ba sổ, outbox, offline và xử lý ngoại lệ. **Chưa được kích hoạt giao dịch thật trong điều kiện thiếu bằng chứng:** nhánh B mất hoàn toàn kênh lập hóa đơn, quyền ghi kho chưa độc quyền, cutover chưa đối soát, restore/offline chưa E2E.

## 2. Bộ tài liệu v1 và thứ tự đọc

| Mã | File | Đầu ra |
|---|---|---|
| R009-NPP | [Tổng hợp quyết định/khoảng trống NPP-01](NPP-01_tong-hop-quyet-dinh-va-khoang-trong-MVP_2026-11-12.vi.md) | Nguồn chính sách, trạng thái 15 gói khoảng trống và các gate. |
| R009-D | [Sổ quyết định và ADR](decision-register-and-adr.vi.md) | Chọn/chưa chọn, trạng thái, scope, giả định và ngoại lệ. |
| R009-G | [Glossary và Data Contract](glossary-and-data-contracts.vi.md) | Định danh, ràng buộc dữ liệu, snapshot và authority. |
| R009-BR | [Business Rules](business-rules.vi.md) | Các bất biến/normative rules đủ để viết logic/test. |
| R009-API | [API và State Machines](api-and-state-machines.vi.md) | Lệnh/sự kiện, ACK, status và chuyển bước theo vai trò. |
| R009-TR | [Ma trận truy vết](traceability.vi.md) | `Decision → BR → DC → API/SM → AC → EV`. |
| R009-AC | [Acceptance và sổ evidence](acceptance-tests-and-evidence.vi.md) | Ca Given/When/Then, mức bằng chứng và No-Go gate. |
| R009-PLAN | [Kế hoạch triển khai và pilot](implementation-and-pilot-plan.vi.md) | Slices, trách nhiệm, dependency, DoR/DoD, 5 đợt. |
| R009-S | [Nguồn và giới hạn](sources.md) | Xuất xứ, phần kế thừa, việc chưa được xác nhận. |

R009 là tài liệu **mới** thay vì sửa ngược báo cáo lịch sử. R008-SPEC vẫn là bằng chứng thiết kế ứng viên gốc, không phải bản đã nghiệm thu. Khi xung đột, quyết định Owner ghi rõ trong R009 ưu tiên về *chính sách*, nhưng phương pháp kỹ thuật chưa có bằng chứng phải đi qua review/ADR và kiểm thử.

## 3. Tiêu chuẩn thay đổi baseline

- Mỗi quyết định có ID/phiên bản, phạm vi, mốc xác nhận, link xuất xứ và `status`.
- Thay đổi `OWNER_DECIDED` phải có Owner acceptance/ADR mới; không đổi im lặng qua refactor schema, UI hay script.
- Khi business rule đổi, cập nhật đồng thời data snapshot, API/state, AC, affected evidence và kế hoạch migrate.
- `AC_PASS` chỉ khi có `testRunId`, commit/build/thiết bị (nếu áp), dữ liệu và actual result; demo/số học R008 ghi `MODEL_ONLY`.
- Trước Go-Live thực phải có quyết định độc lập cho từng luồng A, B có kết nối, B mất kênh hóa đơn và mixed; không dùng một cờ `MVP_READY`.

## 4. Phạm vi loại trừ mặc định

Không đưa vào baseline: nhiều người bán/pháp nhân trong cùng tenant, hàng ký gửi nhiều chủ, ERP/sổ cái đầy đủ, phần mềm kế toán thay thế, trả nhà cung cấp toàn diện, tối ưu tuyến tự động, AI, multi-writer đồng thời và chương trình ưu đãi bất kỳ. Có yêu cầu mới phải qua change control, không tự tăng MVP.

## 5. Cổng ngay sau commit tài liệu

1. Review/accept tính đầy đủ của từng chính sách `OWNER_DECIDED` và giới hạn được nêu (không phải ký nhận Go-Live).
2. Giao technical ADR còn `DESIGN_CANDIDATE` để chọn schema/API/workflow trong các PR source.
3. Thu dữ liệu nguồn, seller/provider profile, môi trường thiết bị và kế toán NPP-01.
4. Chạy test hiện thực, nhập evidence, xử lý các gate P0; **B-CASE giữ pending** cho đến khi có hồ sơ kiểm chứng.
