# B007 — Đề xuất nghiên cứu tiếp nối để kiểm chứng và chốt đặc tả MVP

- Ngày lập: **12/11/2026**, Asia/Bangkok.
- Căn cứ: [review PR #1 — R007](../reports/2026-11-12-07-review-pr1-va-muc-tieu-tiep-theo/report.vi.md), tại HEAD `f267819bfa6a1587cacd8ace58265b9c0db93b71`.
- Kế thừa: [B005](2026-11-11-05-nghien-cuu-bo-sung-dat-mvp.md) và [kết quả R006](../reports/2026-11-11-06-ket-qua-nghien-cuu-mvp/report.vi.md).
- **Trạng thái: đề xuất mục tiêu tiếp nối để Owner xem xét.** Chưa là active roadmap phát triển, chưa có lịch/chi phí hoặc pilot được cam kết; không ghi chính sách trong R006 thành quyết định đã duyệt.

## 1. Mục đích và đầu vào giữ nguyên

Biến nền nghiên cứu hiện có thành **đặc tả MVP hiện hành, bộ số liệu/ca nghiệm thu và bằng chứng đủ để quyết định triển khai, pilot**. Không mở lại khảo sát thị trường tổng quát nếu không trả lời một quyết định cụ thể.

Giữ A — đặt trước rồi giao, B — bán theo xe; PWA; nhân sự xe máy/xe tải đã chọn; mỗi tenant một DB; phạm vi quản trị NPP, đơn, kho, hóa đơn, thu/nợ và báo cáo. Chưa tự chốt một pháp nhân/tenant, một writer/chuyến, giá vốn, chuyến hỗn hợp hoặc provider.

Phân biệt ba loại đầu ra: phân tích có thể làm từ tài liệu; quyết định cần Owner/người phụ trách nghiệp vụ; bằng chứng phải có dữ liệu/thiết bị/provider/pilot. Không ghi hoàn thành loại sau chỉ bằng biểu mẫu hay thiết kế.

## 2. Sáu mục tiêu và điều kiện hoàn tất

### BS-01 — Hợp nhất phạm vi, quyết định và đặc tả hiện hành

**Nối:** NC-01/02/03/10. **Giải quyết:** người triển khai phải tự lựa chọn giữa tài liệu lịch sử, giả định và quyết định chưa duyệt.

**Công việc:**

1. Lập sổ Q01–Q10: câu hỏi, phương án, dữ liệu còn thiếu, người chốt, trạng thái và ngày quyết định.
2. Ma trận khả năng theo vai trò và A/B: hỗ trợ, giới hạn, chuyển xử lý thủ công, để sau. Viết hành vi cho trường hợp không hỗ trợ.
3. Hợp nhất thuật ngữ, mô hình dữ liệu/nguồn chứng từ và chuyển trạng thái; nối yêu cầu đến quy tắc và ca nghiệm thu.
4. Thêm luồng điểm bán/viếng thăm không đơn, quan sát hàng và yêu cầu trả; tách quan sát khỏi tồn sở hữu NPP.

**Đầu ra:** một đặc tả hiện hành có phiên bản, decision log, ma trận khả năng/role và bảng truy vết. Tài liệu lịch sử giữ nguyên.

**Đủ khi:** quyết định tác động tới dữ liệu, hàng, tiền, hóa đơn và offline có người chấp nhận; không còn hai quy tắc đang cùng được coi là hiện hành cho cùng một trường hợp. Giới hạn đã được thể hiện trong tác vụ, không chỉ để ở ghi chú cuối báo cáo.

### BS-02 — Hoàn thiện quy tắc và bộ kết quả kỳ vọng tính độc lập

**Nối:** NC-03/04/05/06/08. **Giải quyết:** F02/F03, hạn trả và thiếu lớp tiền/thuế đủ dùng cho nghiệm thu hóa đơn.

**Công việc:** xây dữ liệu nhiều SKU/UoM, giao–trả–giao, quà ròng/miễn thu hồi, giá vốn số lẻ/phần dư, điều khoản trả, thu/hoàn/phân bổ, giá có/chưa gồm thuế, chiết khấu phân về dòng và phí mua biết muộn. Thuế suất/cách xử lý thuế lấy từ hồ sơ được kế toán xác nhận.

**Đầu ra:** bảng trước/sau mỗi sự kiện, định danh nguồn và tính toán tái lập; kết quả E2E-13/14/15/16 và các ca tiền/thuế liên quan. Phân biệt sổ phải thu, tiền thu và giữ/nộp tiền.

**Đủ khi:** kế toán và người triển khai tính độc lập ra cùng lượng, giá trị, tiền/thuế, nợ/có dư và tuổi nợ; chia nhỏ trả hàng không tạo/mất giá vốn; thay điều khoản Customer không viết lại khoản cũ. Tính đúng cuối ngày chưa đủ nếu trung gian sai.

### BS-03 — Kiểm chứng hóa đơn và chứng từ cấp xe trong điều kiện tuyến thật

**Nối:** NC-07/08. **Giải quyết:** phạm vi B và khả năng hợp lệ của quy trình khi mạng gián đoạn.

**Đầu vào cần có:** hồ sơ người bán, loại hóa đơn, các SKU đại diện, provider/tài khoản được phép, thiết bị và thông tin mạng của tuyến. Trước khi có các đầu vào này chỉ chuẩn bị contract và ca thử, chưa đánh dấu đã kiểm chứng.

**Công việc:** lập timeline giao–lập–ký–gửi; chạy INV-01–09 và ca chứng từ cấp xe E2E-20; kiểm tra timeout/unknown/lookup/retry, giao nhiều lần, trả sau phát hành và restore. Xác định ai lập/lưu/tra cứu chứng từ nếu dùng hệ thống ngoài MVP.

**Đầu ra:** hồ sơ áp dụng, log có định danh đã khử dữ liệu không cần thiết, giới hạn online/offline được chứng minh, trách nhiệm ngoại lệ và quyết định một phương án tích hợp.

**Đủ khi:** có phương án dùng được cho pilot; không phát hành trùng; không coi bản nháp là hóa đơn; cấp xe có chứng từ và đối chiếu được. Nếu chưa chứng minh B hoàn toàn offline, nêu giới hạn vận hành cụ thể để giữ mục tiêu B trong phạm vi đã kiểm chứng.

### BS-04 — Chốt và thử contract offline, ACK, quyền và phục hồi

**Nối:** NC-07/09, phối hợp NC-06. **Giải quyết:** F01/F04, downsync và nguồn đời quyền sau restore.

**Công việc:**

1. Bảng receipt xác định payload đã lưu bền hay chưa, ai retry, kết quả nghiệp vụ còn mở hay đã xong.
2. Chọn ranh giới transaction cho bán–giao–thu; quy tắc tiêu quyền chịu theo phần phải thu được chấp nhận.
3. Snapshot/delta/tombstone, cursor và gói quyền nhất quán; resync giữ journal chưa ACK.
4. Runbook restore đối chiếu quyền/yêu cầu dữ liệu hiện hành từ nguồn không bị lùi cùng backup hoặc cơ chế tương đương; nguồn recoveryEpoch không lặp; đối chiếu tác động ngoài như hóa đơn.
5. Xác định vai trò xử lý dữ liệu, thời hạn giữ, đầu mối và thủ tục áp dụng theo ngày pilot; cập nhật chuỗi nguồn nêu trong R007.
6. Thử trên tập thiết bị đã chọn, ít nhất hai tenant cho kiểm tra cách ly; đo phạm vi RPO/RTO, nêu dữ liệu chỉ tồn tại trên thiết bị và không thể phục hồi từ server.

**Đầu ra:** contract có trạng thái/chủ thể chịu trách nhiệm, log các ca E2E-17/18/19 và các ca cũ liên quan, runbook do người vận hành thực hiện.

**Đủ khi:** không có lệnh bị bỏ khỏi trách nhiệm sau ACK, không kích hoạt gói phiên bản trộn, không phục hồi quyền đã bị thu hồi hoặc xử lý lại tác động ngoài không hợp lệ; phần mất dữ liệu không thể bảo vệ được phải được công bố và có giới hạn vận hành tương ứng.

### BS-05 — Khép chu kỳ kho, bàn giao kế toán và xử lý ngoại lệ

**Nối:** NC-03/04/06/08/09/10. **Giải quyết:** ngày thứ hai và giai đoạn sau khóa kỳ chưa được minh họa đủ.

**Công việc:** ít nhất hai ngày dữ liệu minh họa và một ca từ kỳ đã khóa; nhận hàng/điều chỉnh/kiểm kê khi chuyến còn mở; hàng dư xe, trả từ chuyến cũ, phí muộn; bảng DMS–kế toán–provider xác định nguồn có thẩm quyền, định danh và cách sửa sai. Mỗi ngoại lệ có vai trò nhận, dữ liệu cần xem, hành động hợp lệ và điều kiện đóng.

**Đầu ra:** quy trình vận hành theo chứng từ, E2E-21, một mẫu xuất/nhập tối thiểu và đối chiếu; danh sách việc làm trong MVP hoặc chuyển ra ngoài có người chịu trách nhiệm.

**Đủ khi:** chuyển ngày, nhập lại hoặc điều chỉnh không nhân đôi hàng/nợ/tiền; kiểm kê không giải phóng nhầm quyền còn offline; kho/kế toán/người giao thực hiện được đường sửa sai. Không tự thêm phải trả nhà cung cấp, kế toán tổng hợp hoặc nhiều cấp duyệt.

### BS-06 — Xác nhận pilot, sử dụng và chi phí phục vụ

**Hoàn tất phần còn mở:** NC-01/10, chi phí NC-09. **Giải quyết:** thiếu đầu vào/đo lường thực tế, đã được R006 công bố.

**Giai đoạn trước pilot:** xác định đơn vị đủ tình huống A/B, người quyết định/người phụ trách, file/chứng từ được phép, thiết bị, baseline và tác vụ; thử prototype gồm E2E-22; dry-run import/cutover, đào tạo và hỗ trợ. Ngưỡng chọn theo baseline và mục tiêu đã thống nhất, không tự bịa tỷ lệ đạt.

**Giai đoạn trong/sau pilot:** kết quả n/N cho chuyến/tác vụ đủ điều kiện, chênh lệch, thời gian đóng chuyến, phút hỗ trợ/đơn vị, chi phí hạ tầng/tích hợp/nhập dữ liệu, ý định tiếp tục và quyết định trả phí của người có quyền mua.

**Đầu ra:** hồ sơ tuyển/đo, báo cáo UX/cutover, dashboard hoặc bảng kết quả pilot, mô hình chi phí có dữ liệu và quyết định tiếp tục/điều chỉnh.

**Đủ khi:** đầu vào và ngưỡng được chấp nhận trước pilot; kết quả và chi phí đo được sau pilot. Một nơi có A/B có thể kiểm chứng phạm vi hẹp, nhưng không được suy rộng thành đại diện toàn thị trường. Không ghi hoàn tất chỉ bằng bảng hỏi hoặc công thức KPI.

## 3. Thứ tự thực hiện được đề nghị

| Bước | Công việc | Có thể làm ngay từ tài liệu | Phụ thuộc trước khi kết luận |
|---|---|---|---|
| 1 | BS-01 + BS-02 | Ma trận phạm vi, sổ quyết định, quy tắc còn thiếu, fixture mở rộng | Owner, kế toán, hồ sơ điều khoản/SKU |
| Song song bước 1 | Chuẩn bị BS-03 và tuyển/đo đầu vào BS-06 | Ca thử, mẫu hồ sơ và baseline | NPP, provider, tuyến, người tham gia được xác nhận |
| 2 | BS-03 + BS-04 sau lựa chọn chính sách liên quan | Contract, runbook, mô hình lỗi | Sandbox, thiết bị, môi trường thử, dữ liệu/tác động ngoài mô phỏng được |
| 3 | BS-05 + phần UX/cutover BS-06 | Chuỗi số liệu, bảng bàn giao và mẫu import/export | Chứng từ thật, prototype/bản phát triển, người vận hành |
| 4 | Pilot và phần giá trị BS-06 | Thiết kế đo và quy trình hỗ trợ | Bản phát triển đạt tiêu chí pilot, sự tham gia và số liệu thực tế |

Không ấn định thời lượng trước khi biết đầu vào và quyết định còn mở. Có thể triển khai phần độc lập khi đặc tả và ca nghiệm thu của phần đó đủ, không cần đợi hoàn tất mọi nhánh nghiên cứu.

## 4. Bộ bàn giao cần tạo sau khi thực hiện B007

1. Đặc tả hiện hành, decision log và ma trận truy vết yêu cầu → quy tắc → dữ liệu/tác vụ → ca nghiệm thu.
2. Bộ dữ liệu tính độc lập, gồm các ca mới [E2E-13–22 trong R007](../reports/2026-11-12-07-review-pr1-va-muc-tieu-tiep-theo/report.vi.md), có trạng thái chuẩn bị/đã chạy/đạt/chưa đạt và bằng chứng.
3. Báo cáo kiểm chứng hóa đơn, vận chuyển, offline và restore; phạm vi hỗ trợ/ngoại lệ.
4. Hồ sơ cutover/pilot, baseline, kết quả, chi phí phục vụ và quyết định kinh doanh khi có dữ liệu.
5. Sổ nguồn, giả định, hạn chế, ngày kiểm tra và công việc chưa hoàn thành.

## 5. Điều kiện chuyển bước và dừng nghiên cứu

- **Sang phát triển lõi:** quyết định tác động dữ liệu/hàng/tiền có chủ; F01–04 có cách giải; đặc tả và kết quả kỳ vọng nhất quán.
- **Sang pilot:** provider/thiết bị/chứng từ vận chuyển được thử; import và số dư đối chiếu; quyền/restore; người xử lý ngoại lệ; quy mô và tiêu chí được xác nhận.
- **Kết luận MVP có giá trị:** A/B thực sự được dùng, số dư giải thích được, kết quả tác vụ và chi phí có mẫu số, người mua có quyết định rõ.

Dừng một nhánh khi đã trả lời quyết định, có ví dụ/kết quả kỳ vọng, giới hạn và người chấp nhận. Nếu phụ thuộc đầu vào chưa có, ghi đúng phụ thuộc và việc có thể làm trước. Đọc thêm nguồn chung không thay cho chứng từ, thiết bị, sandbox hoặc kết quả sử dụng còn thiếu.
