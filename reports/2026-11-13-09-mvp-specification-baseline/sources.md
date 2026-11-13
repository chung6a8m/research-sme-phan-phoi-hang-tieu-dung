# R009-S — Xuất xứ, đối chiếu và giới hạn bằng chứng

## 0. Tệp gốc được bảo toàn

- **SRC-NPP-01:** [Phỏng vấn quyết định Q01.txt — bản nguyên văn](sources/npp-01-interview-summary-2026-11-12.original.txt). Nguồn là tệp Project do người dùng cung cấp, tiêu đề thực tế **“Tổng hợp quyết định và đánh giá khoảng trống MVP — NPP-01”**, ngày đánh giá 12/11/2026. Lưu nguyên nội dung UTF-8 (10.280 byte; LF; 143 ký tự xuống dòng, 144 dòng logic), **không sửa các thành phần trình bày, URL sandbox cũ hay nội dung**. SHA-256 trên *bytes đầu vào*: `3205b94dfbd0057b9dd11c9e309f7b40dfd496e25d218ebce927d8c0a7078038`; kiểm tra khi nhập: nội dung đọc lại trên nhánh PR trùng chuỗi UTF-8 nguồn.
- Bản [R009-NPP](npp-01-tong-hop-quyet-dinh-va-khoang-trong-mvp-2026-11-12.vi.md) là **bản biên tập độc lập**, không thay thế SRC-NPP-01. Tệp nguyên văn là **bản tóm lược**, không phải tệp Markdown đầy đủ `NPP-01_tong-hop-quyet-dinh-va-khoang-trong-MVP_2026-11-12.vi.md` từng được nhắc, cũng không phải transcript phỏng vấn đầy đủ.
- Định vị dẫn chứng: `SRC-NPP-01:L52–L59` nêu nhóm chính sách, `L65–L76` nêu khoảng trống, `L80–L82` nêu ranh giới Kho-01/kế toán, `L84–L111` nêu kế hoạch/gate. Xem [bản đồ từng D](decision-register-and-adr.vi.md#11-truy-vết-quyết-định-đến-nguồn-có-thể-kiểm-tra).
- **Không có trong tệp gốc:** nội dung hỏi–đáp nguyên văn Q01–Q10/Mục 153–202, hồ sơ xác nhận của NPP/provider, script kết quả ứng dụng; các quyết định Q01–Q06 được dẫn từ hội thoại, Q07–Q10 không thể gắn trực tiếp với một dòng hỏi trong file tóm lược.

## 1. Nguồn thực sự sử dụng

1. **SRC-NPP-01** được lưu nguyên văn như trên; chứa các nhận định tóm lược và kế hoạch. Cấu trúc hiển thị giao diện và link sandbox cũ là một phần của tệp nguyên văn; R009-NPP biên tập sang Markdown thuần **trong file khác**.
2. **Các lựa chọn Owner trong cuộc phỏng vấn ngày 12/11/2026** được nhắc trong bối cảnh hội thoại dự án: Q01–Q06, cùng các chính sách cấp cao ở NPP-01. Đây là quyết định về phạm vi sản phẩm, **không phải xác nhận kỹ thuật hoặc vận hành của đơn vị NPP thực**. Biên bản chi tiết từng mục 153–202 không được cung cấp nguyên văn trong lần ghi repo này.
3. **R008-SPEC:** [Đặc tả MVP ứng viên](../2026-11-12-08-khep-quy-tac-va-dac-ta-mvp/dac-ta-mvp-de-nghi.vi.md), 12 bất biến, Q01–Q10, M01–M22, E2E-01–22.
4. **R008-B:** [Nghiệp vụ/số liệu](../2026-11-12-08-khep-quy-tac-va-dac-ta-mvp/nghiep-vu-va-so-lieu.vi.md), quà ròng, F03 hoàn nguồn, terms, tiền/thuế, giá vốn và chuyển kỳ.
5. **R008-T:** [Offline/ACK/restore](../2026-11-12-08-khep-quy-tac-va-dac-ta-mvp/offline-va-phuc-hoi.vi.md), contract `BS04-C1` và mô hình hữu hạn.
6. **R008-L:** [Hóa đơn/chứng từ/dữ liệu](../2026-11-12-08-khep-quy-tac-va-dac-ta-mvp/hoa-don-va-du-lieu.vi.md), profile seller/provider, trạng thái và INV-01–09.
7. **R008-P:** [Pilot/bàn giao](../2026-11-12-08-khep-quy-tac-va-dac-ta-mvp/pilot-va-ban-giao.vi.md), cutover, accounting export/import, visit, hỗ trợ và KPI.
8. **R008-S:** [Đối chiếu nguồn và giới hạn nghiên cứu](../2026-11-12-08-khep-quy-tac-va-dac-ta-mvp/sources.md).

## 2. Ranh giới chính xác

- **Đã lưu nguyên văn tệp tóm lược đầu vào SRC-NPP-01**, nhưng **không có** bản Markdown đầy đủ mang tên `NPP-01_tong-hop-quyet-dinh-va-khoang-trong-MVP_2026-11-12.vi.md`. File R009-NPP là bản biên tập, không tuyên bố byte-identical với bản đầy đủ chưa có.
- R008 đã có mô hình số học và giao thức chạy; không có bằng chứng NPP, dữ liệu thật, PWA/DB/provider/thuế/thiết bị/pilot thật. R009 **không chạy lại** các script và không nâng cấp evidence.
- Những pháp quy được nêu trong R008-L là đối chiếu nghiên cứu tại 12/11/2026, không phải ý kiến tư vấn pháp lý riêng cho NPP-01. R009 không tự kiểm tra cập nhật văn bản mới hoặc tuyên bố cơ chế B offline hợp lệ.
- Tên đường dẫn API, bảng dữ liệu, schema, SLA, ngưỡng đo trong R009 là **candidate contract** khi chưa có ADR kỹ thuật/verification; việc Owner chốt nghiệp vụ không tự biến chúng thành interface đã triển khai.
- `B-CASE-001`, `B-CASE-002`, `B-CASE-003`, `LEGAL-MEMO` và cổng pháp lý B full-offline: `EVIDENCE_PENDING`. Không tạo chứng cứ, chữ ký hoặc pass giả.
- Các ca AC trong R009 là **expected result dùng để triển khai/test**. Mặc định `NOT_RUN` cho hệ thống thực; dùng `MODEL_ONLY` riêng khi có kiểm chứng R008 tương ứng. Oracle bổ sung trong R009 và phép kiểm định ma trận chỉ là **document-level verification**, không tự nâng thành `PRODUCT_VERIFIED`.
