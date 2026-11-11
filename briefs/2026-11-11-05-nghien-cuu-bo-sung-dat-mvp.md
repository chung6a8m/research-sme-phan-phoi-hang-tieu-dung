# B005 — Đề bài nghiên cứu bổ sung để chốt đặc tả và pilot MVP

- Ngày: **11/11/2026**.
- Trạng thái: **đề xuất mục tiêu và cách tổ chức nghiên cứu; chưa triển khai, chưa được Owner phê duyệt**.
- Căn cứ: [R005 — Phân tích khoảng trống và mục tiêu](../reports/2026-11-11-05-khoang-trong-va-muc-tieu-mvp/report.vi.md) và [nguồn R005](../reports/2026-11-11-05-khoang-trong-va-muc-tieu-mvp/sources.md).
- R005 là kết quả phân tích đề bài lần này; **không phải kết quả hoàn thành B005**.

## 1. Mục đích

Tạo đủ bằng chứng và quyết định để xây MVP vận hành được một ngày kinh doanh của nhà phân phối FMCG mục tiêu: danh mục/số dư/nhập hàng, A/B, giá/ưu đãi, giao/trả, hàng trên xe, tiền/công nợ, hóa đơn và đối soát. Mỗi chủ đề phải kết thúc bằng quyết định cần ra, dữ liệu/ví dụ, giới hạn hỗ trợ và tiêu chí nghiệm thu.

## 2. Các lựa chọn đầu vào

- A đặt trước rồi giao và B bán theo xe đều thuộc MVP.
- PWA cho nhân viên thị trường; nghiên cứu trong ràng buộc này.
- Xe máy: một người kiêm giao và lái. Xe tải: có thể một người hoặc người giao/người lái khác nhau.
- Mỗi tenant một database đã được ghi là quyết định chốt tại R003; không nghiên cứu lại shared database như thể chưa có quyết định.
- Giữ hóa đơn điện tử trong phạm vi ban đầu cùng đơn hàng, tồn, thu tiền/công nợ và báo cáo.
- Cần chuẩn hóa Customer/Outlet/Dealer/Distributor/Business/Tenant; phân biệt tiền thu hộ, phải thu khách và tạm ứng nhân viên.

Giá vốn, chi tiết glossary/ERD, chuyến kết hợp A/B, số thiết bị ghi, quy tắc giá/ưu đãi, phạm vi tạm ứng/hoàn ứng, nhà cung cấp tích hợp và lịch pilot còn phải xác minh/chốt. Không suy từ dự án khác sang dự án này.

## 3. Mục tiêu và đầu ra bắt buộc của nghiên cứu

| Mã | Mục tiêu | Bằng chứng cần thu | Đầu ra/điều kiện kết thúc |
|---|---|---|---|
| NC-01 | Chọn phân khúc và đơn vị vận hành pilot | Phỏng vấn theo vai trò, dữ liệu quy mô, chứng từ, baseline, quyết định mua | Hồ sơ phân khúc; ứng viên pilot; công việc cần thay; người phụ trách; kế hoạch kiểm chứng A/B |
| NC-02 | Khóa thuật ngữ, mô hình và trách nhiệm | Khách nhiều điểm bán, địa chỉ giao khác, trả không đơn gốc, phân công thực tế | Glossary/ERD nhất quán; quan hệ tùy chọn rõ; ma trận quyền/hành động; quyết định ánh xạ đơn vị–tenant |
| NC-03 | Khép kín A/B và ngoại lệ | Quan sát từ mở tới đóng chuyến; chuỗi chứng từ giao đủ/thiếu/trả/hủy/đổi người | Ma trận sự kiện–chứng từ–sổ–quyền–đảo; trạng thái; ngoại lệ có người xử lý |
| NC-04 | Khóa UoM, tồn và giá vốn | SKU/quy đổi, phiếu nhập, phí mua, sổ kho, lô/hạn dùng, trả/điều chỉnh | Một phương pháp vận hành MVP được chọn; chính sách UoM/làm tròn; dữ liệu tính tay và số dư kỳ vọng |
| NC-05 | Chốt giá, chiết khấu, khuyến mại tự động tối thiểu | Bảng giá và chương trình thật; ví dụ giao thiếu, đổi giá, hết quà, trả bớt | Tập quy tắc hỗ trợ; thứ tự/cộng dồn/loại trừ; snapshot; kết quả có thể giải thích |
| NC-06 | Khép kín công nợ và tiền nhân viên | Phiếu thu/nộp, phân bổ nhiều đơn, tạm ứng/hoàn ứng, sao kê đã ẩn danh | Tách ba loại số dư; quyết định phạm vi chức năng tạm ứng/hoàn ứng; ghi giảm nợ một lần; bàn giao/bù trừ/ngoại lệ có quy tắc |
| NC-07 | Xác minh PWA và quyền giao dịch offline | Thiết bị/trình duyệt pilot, tình huống mất mạng/lưu trữ/quyền, nhiều lệnh cạnh tranh | Ma trận thao tác; giới hạn offline; spike; chống lặp toàn hiệu ứng; xử lý B đã giao/thu; điều kiện đóng chuyến |
| NC-08 | Xác minh hóa đơn, thuế/khuyến mại và tích hợp | Văn bản theo điều/khoản; kế toán pilot; tài liệu API và sandbox phù hợp | Ma trận giao dịch–quy định–dữ liệu; nhà cung cấp/phương án; kết quả thử lỗi/retry; ranh giới kế toán |
| NC-09 | Xác minh vận hành tenant-per-database | Nhu cầu quyền/dữ liệu cá nhân; bài diễn tập hai tenant, migration, restore | Runbook; yêu cầu mất dữ liệu/thời gian phục hồi; cách ly API/file/cache/job/PWA; đối chiếu dữ liệu sau restore |
| NC-10 | Xác minh onboarding, UX và giá trị pilot | Trước pilot: file import, thử prototype, baseline. Trong/sau pilot: thời gian, chi phí hỗ trợ, phản hồi người mua | Trước pilot: checklist chuyển đổi và kế hoạch đo. Sau triển khai: bằng chứng sử dụng và quyết định tiếp tục/trả phí |

Chi tiết và bộ tình huống E2E-01–E2E-12 nằm trong R005. Mọi ngưỡng/cỡ mẫu là đề xuất cho đến khi được quyết định rõ.

## 4. Tổ chức thu thập bằng chứng

Đề xuất khám phá định tính tại 3–5 NPP, đủ đại diện A/B; chọn 2–3 đơn vị vận hành pilot sau đó. Bao phủ người quyết định mua, xử lý/duyệt đơn, kho, kế toán công nợ/hóa đơn, sales, người giao/lái và người nhận hàng phù hợp. Một người có thể kiêm vai trò nhưng ghi nhận trách nhiệm ở từng bước.

Theo một đơn/chuyến có thật từ đầu tới cuối và một số trường hợp lỗi; đối chiếu chứng từ, số lượng và tiền. Lấy baseline ngay trước khi thử giải pháp. Đối thủ và tài liệu nhà cung cấp chỉ hỗ trợ câu hỏi/cách biểu diễn; không dùng thay bằng chứng NPP thực tế.

Checklist chuyển đổi phải quyết định chốt sạch hay nhập có kiểm soát các đơn/chuyến đang dở, tồn trên xe, tiền đã thu chưa nộp và tham chiếu hóa đơn; tổng đối chiếu được người phụ trách xác nhận để không ghi lại hàng/nợ/tiền đã phát sinh.

Không công khai dữ liệu cá nhân hoặc dữ liệu thương mại nhạy cảm trong repo. Dùng dữ liệu đã được phép và loại thông tin nhận diện; ghi nguồn, vai trò, ngày thu và giới hạn suy rộng.

Phần có thể thực hiện bằng tài liệu/web: hợp nhất thuật ngữ làm việc, tìm nguồn sơ cấp, khảo sát API, thiết kế phương án và kịch bản. Phỏng vấn/quan sát cần người tham gia và chứng từ; spike cần môi trường/thiết bị; pilot cần sản phẩm và tổ chức vận hành. Khi chưa có đầu vào, ghi rõ chưa xác minh, không tạo kết quả giả.

## 5. Trình tự và điểm quyết định

1. Chọn phân khúc/pilot và giải quyết mâu thuẫn tài liệu hiện hành; xác định số liệu đầu vào.
2. Chốt ma trận A/B, UoM/giá vốn, pricing, công nợ và các mốc hóa đơn bằng bộ ví dụ xuyên suốt.
3. Thử PWA/offline, tích hợp hóa đơn và khôi phục tenant; thử tác vụ/onboarding với người dùng.
4. Tổng hợp thành đặc tả MVP, backlog có tiêu chí và kế hoạch pilot có baseline.

Thiết kế offline phụ thuộc chính sách nghiệp vụ. Tra cứu API/thiết bị có thể chạy song song; không dùng việc spike thành công để tự phê duyệt chính sách bán chịu hoặc giá. Bốn bước trên kết thúc ở đặc tả và kế hoạch pilot; phần đánh giá giá trị sử dụng/trả phí của NC-10 tiếp tục sau khi có sản phẩm và triển khai pilot, ngoài đợt khám phá.

Khung khám phá 2–3 tuần làm việc trong R005 là giả định khi có sẵn người tham gia và công cụ thử, không phải cam kết lịch. Ước lượng phát triển/pilot chỉ chốt sau khi làm rõ nguồn lực và phụ thuộc.

## 6. Cách trình bày kết quả

Mỗi mục tiêu cần có: câu hỏi; căn cứ đã có; phương pháp và mẫu; kết quả quan sát được; nguồn sơ cấp nếu áp dụng; lựa chọn và đánh đổi; phương án đề nghị; người cần quyết định; giới hạn; tình huống và số dư mong đợi.

Tách riêng quyết định Owner, dữ liệu khảo sát, nhận định nhà cung cấp, kết quả thử nghiệm và đề xuất. Có thể giao nghiên cứu theo từng nhóm, nhưng phải dùng chung thuật ngữ và bộ ví dụ A/B.

Lưu các báo cáo đã hoàn thành theo quy ước AGENTS.md, cập nhật mục lục và bằng chứng. Chỉ tạo file có nội dung thực; không dựng sẵn cây ADR/spec/evidence rỗng. Những đề xuất chưa được duyệt giữ đúng trạng thái, không ghi thành active roadmap triển khai.
