# R009-S — Xuất xứ, đối chiếu và giới hạn bằng chứng

## 1. Nguồn thực sự sử dụng

1. **Nội dung do người dùng cung cấp trong Project:** `Phỏng vấn quyết định Q01.txt`, tài liệu tóm lược 143 dòng, nhan đề “Tổng hợp quyết định và đánh giá khoảng trống MVP — NPP-01”, ghi ngày 12/11/2026. Nội dung nêu các quyết định kho–tiền–công nợ, offline, kế toán, cutover, 8 chuyến/ngày và 10 nhóm khoảng trống. Bản tham chiếu có thành phần trình bày giao diện, link sandbox cũ; R009 biên tập sang Markdown thuần để lưu repo.
2. **Các lựa chọn Owner trong cuộc phỏng vấn ngày 12/11/2026** được nhắc trong bối cảnh hội thoại dự án: Q01–Q06, cùng các chính sách cấp cao ở NPP-01. Đây là quyết định về phạm vi sản phẩm, **không phải xác nhận kỹ thuật hoặc vận hành của đơn vị NPP thực**. Biên bản chi tiết từng mục 153–202 không được cung cấp nguyên văn trong lần ghi repo này.
3. **R008-SPEC:** [Đặc tả MVP ứng viên](../2026-11-12-08-khep-quy-tac-va-dac-ta-mvp/dac-ta-mvp-de-nghi.vi.md), 12 bất biến, Q01–Q10, M01–M22, E2E-01–22.
4. **R008-B:** [Nghiệp vụ/số liệu](../2026-11-12-08-khep-quy-tac-va-dac-ta-mvp/nghiep-vu-va-so-lieu.vi.md), quà ròng, F03 hoàn nguồn, terms, tiền/thuế, giá vốn và chuyển kỳ.
5. **R008-T:** [Offline/ACK/restore](../2026-11-12-08-khep-quy-tac-va-dac-ta-mvp/offline-va-phuc-hoi.vi.md), contract `BS04-C1` và mô hình hữu hạn.
6. **R008-L:** [Hóa đơn/chứng từ/dữ liệu](../2026-11-12-08-khep-quy-tac-va-dac-ta-mvp/hoa-don-va-du-lieu.vi.md), profile seller/provider, trạng thái và INV-01–09.
7. **R008-P:** [Pilot/bàn giao](../2026-11-12-08-khep-quy-tac-va-dac-ta-mvp/pilot-va-ban-giao.vi.md), cutover, accounting export/import, visit, hỗ trợ và KPI.
8. **R008-S:** [Đối chiếu nguồn và giới hạn nghiên cứu](../2026-11-12-08-khep-quy-tac-va-dac-ta-mvp/sources.md).

## 2. Ranh giới chính xác

- Không có bản sao nguyên văn file Markdown đầy đủ mang tên `NPP-01_tong-hop-quyet-dinh-va-khoang-trong-MVP_2026-11-12.vi.md` ở đầu vào hiện hành; file cùng tên trong R009 là **bản biên tập/tái lập**, không tuyên bố byte-identical.
- R008 đã có mô hình số học và giao thức chạy; không có bằng chứng NPP, dữ liệu thật, PWA/DB/provider/thuế/thiết bị/pilot thật. R009 **không chạy lại** các script và không nâng cấp evidence.
- Những pháp quy được nêu trong R008-L là đối chiếu nghiên cứu tại 12/11/2026, không phải ý kiến tư vấn pháp lý riêng cho NPP-01. R009 không tự kiểm tra cập nhật văn bản mới hoặc tuyên bố cơ chế B offline hợp lệ.
- Tên đường dẫn API, bảng dữ liệu, schema, SLA, ngưỡng đo trong R009 là **candidate contract** khi chưa có ADR kỹ thuật/verification; việc Owner chốt nghiệp vụ không tự biến chúng thành interface đã triển khai.
- `B-CASE-001`, `B-CASE-002`, `B-CASE-003`, `LEGAL-MEMO` và cổng pháp lý B full-offline: `EVIDENCE_PENDING`. Không tạo chứng cứ, chữ ký hoặc pass giả.
- Các ca AC trong R009 là **expected result dùng để triển khai/test**. Mặc định `NOT_RUN` cho hệ thống thực; dùng `MODEL_ONLY` riêng khi có kiểm chứng R008 tương ứng.
