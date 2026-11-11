# Hướng dẫn làm việc trong repository nghiên cứu

## Vai trò repository và quyền ghi

Repository `chung6a8m/research-sme-phan-phoi-hang-tieu-dung` là **đích lưu kết quả nghiên cứu**, không chỉ là nguồn để đọc. Chủ dự án đã xác nhận ngày 11/11/2026 rằng trợ lý có thể ghi research report file và tự tổ chức thư mục, tên file.

Trong phạm vi các yêu cầu nghiên cứu của dự án, khi có báo cáo hoàn thành, lưu nội dung vào repo và cập nhật mục lục. Không chỉ truyền URL repo cho công cụ nghiên cứu rồi coi như công cụ đã ghi file. Không cần hỏi lại cách đặt tên từng file/thư mục khi đã có quy ước phù hợp.

Quyền này áp dụng cho tài liệu nghiên cứu trong repo này; không tự suy rộng thành quyền đổi mã nguồn, sửa repo khác, xóa tài liệu, merge PR hoặc thay đổi cấu hình bảo vệ repository.

## Quy ước lưu trữ

- `reports/YYYY-MM-DD-NN-chu-de/report.vi.md`: báo cáo nghiên cứu đầy đủ bằng tiếng Việt.
- `reports/YYYY-MM-DD-NN-chu-de/sources.md`: xuất xứ, nguồn tham khảo, ngày kiểm tra nếu thực sự đã kiểm tra, cùng giới hạn bằng chứng.
- `briefs/YYYY-MM-DD-NN-chu-de.md`: đề bài/phạm vi nghiên cứu; luôn phân biệt với kết quả.
- Chỉ bổ sung phụ lục hoặc thư mục khác khi có nội dung thực tế; không dựng sẵn nhiều thư mục rỗng.
- Tên đường dẫn dùng chữ thường không dấu, dấu gạch nối; văn bản mới dùng UTF-8 và LF. Giữ nguyên nội dung các bản nhập nguyên văn.

## Bảo toàn nội dung và bằng chứng

Đọc README và nội dung hiện có trước khi sửa. Với báo cáo có sẵn hoặc tài liệu do người dùng cung cấp, giữ nguyên cách tổ chức, thuật ngữ, cảnh báo và mức độ chi tiết; ghi chú biên tập bên ngoài bản gốc. Không âm thầm bổ sung kiến thức, sửa khẳng định hoặc gán nguồn mới cho nội dung cũ.

Với nghiên cứu mới, phân biệt dữ liệu có nguồn, tuyên bố của nhà cung cấp, suy luận, giả định và quyết định của chủ dự án. Không bịa số liệu, URL, ngày truy cập, kết quả phỏng vấn, báo giá hoặc trạng thái hoàn thành. Nguồn nhà cung cấp không tự chứng minh mức độ phổ biến của nghiệp vụ trên toàn thị trường.

Giữ các báo cáo cũ như bản ghi lịch sử. Nếu có nghiên cứu cập nhật, tạo đợt mới và liên kết tới đợt trước; không mặc nhiên coi mọi đề xuất trong báo cáo là quyết định đã phê duyệt.

## Bối cảnh sản phẩm đã được xác nhận

Chủ dự án chọn MVP ban đầu về quản trị nhà phân phối, đơn hàng, kho, hóa đơn điện tử, thu tiền/công nợ và báo cáo. Ứng dụng đặt hàng cho nhân viên thị trường dùng **PWA thay native app**. Câu hỏi nghiên cứu tiếp theo tập trung vào các cách thức vận hành nghiệp vụ phổ biến tại Việt Nam và mức độ phù hợp với lựa chọn PWA.

Không suy ra rằng chủ dự án đã chốt mọi kiến trúc, công nghệ, tích hợp hoặc tính năng nâng cao từng được gợi ý trong báo cáo tổng quan.

## Kiểm tra và bàn giao

Sau khi ghi, kiểm tra lại file, đường dẫn, liên kết nội bộ và commit/nhánh đích bằng công cụ GitHub. Cập nhật README với trạng thái đúng. Báo lại file và commit hoặc PR đã thực sự tồn tại; không tự merge PR nếu chưa được yêu cầu.

Nếu chưa nhận được báo cáo đầy đủ, chỉ lưu đề bài hoặc nội dung đã có và nêu rõ phần chưa lưu. Nếu không có quyền ghi, cung cấp file có thể tải xuống và nói rõ chưa commit. Không cam kết tự ghi trong nền hoặc giao kết quả sau khi phiên đã kết thúc.
