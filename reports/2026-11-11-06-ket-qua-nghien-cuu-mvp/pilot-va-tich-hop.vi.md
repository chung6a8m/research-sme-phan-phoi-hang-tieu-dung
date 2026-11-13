# Phân khúc, tích hợp và cách kiểm chứng giá trị MVP

Ngày nghiên cứu: **11/11/2026**, Asia/Bangkok. Phụ lục R006, thực hiện NC-01, phần tích hợp của NC-08 và NC-10 trong B005.

**Loại bằng chứng:** nghiên cứu tài liệu công khai, đối chiếu sản phẩm và thiết kế phương án. Chưa phỏng vấn doanh nghiệp, tuyển pilot, nhận file vận hành thật, thử giao diện với người dùng hoặc gọi API có tài khoản sandbox. Các tiêu chí, biểu mẫu và ngưỡng dưới đây là đề xuất dùng để thực hiện bước tiếp theo; không phải kết quả thực địa.

## 1. Phân khúc nên bắt đầu và căn cứ lựa chọn

### 1.1. Những gì tài liệu sản phẩm thực sự xác nhận

| Nguồn chính thức đã đọc | Quan sát có nguồn | Hệ quả thiết kế do nhóm nghiên cứu suy ra |
|---|---|---|
| MobiWork DMS, trang sản phẩm [M01](sources.md) | Nhà cung cấp mô tả pre-sales, van-sales, quản lý NPP/điểm bán và khuyến mại | Có cơ sở tham khảo hai cách bán A/B và nhu cầu dùng cùng dữ liệu hàng–giá; chưa chứng minh tỷ lệ NPP Việt Nam dùng từng cách |
| MISA AMIS CRM, Đơn hàng NPP [M02](sources.md) | Phân biệt doanh số bán tại NPP với doanh thu công ty; đơn NPP trong mô hình này không đồng bộ sang AMIS Kế toán | Không sao chép nguyên mô hình sell-out của hãng vào SaaS dành cho NPP sở hữu hàng và trực tiếp mang khoản phải thu |
| MISA AMIS Kho, Điều phối giao hàng [M03](sources.md) | Có điều phối từ phiếu xuất gắn đơn hoặc phiếu xuất độc lập; thông tin phương tiện và người giao | Đơn hàng, chứng từ xuất, lượt giao và chuyến cần có quan hệ rõ, không dùng một mã cho mọi đối tượng |
| MISA AMIS CRM, Trả hàng NPP [M04](sources.md) | Có đường nhập hàng trả khi không chọn đơn gốc | Trả không tham chiếu đơn là ngoại lệ cần giải quyết; quyền duyệt, giá hoàn và nguồn gốc hàng không thể suy tự động |

Các nguồn trên là bằng chứng về **cách nhà cung cấp mô tả sản phẩm**, không chứng minh sản phẩm hoạt động đúng trên thực địa, không cho biết thị phần, mức sẵn sàng trả phí hoặc mức tiết kiệm của MVP dự kiến. Không có dữ liệu để xếp hạng cạnh tranh về giá hay tuyên bố thị trường còn bỏ trống một chức năng.

### 1.2. Khuyến nghị phân khúc đầu tiên

Chọn **đơn vị phân phối hàng tiêu dùng đóng gói, tự sở hữu tồn hàng và bán cho các cửa hàng, có giao tuyến và công nợ, một đơn vị bán chịu trách nhiệm hóa đơn trong tenant**. Ưu tiên nơi chủ doanh nghiệp và người phụ trách kho/kế toán cùng tham gia kiểm chứng; đang phải nối dữ liệu đơn–giao–thu–nộp tiền qua nhiều bước; có cả A/B hoặc sẵn sàng cung cấp hai nhóm chuyến để nghiên cứu.

Đây là lựa chọn giảm số biến trong pilot, không phải kết luận phân khúc này đông nhất hoặc có khả năng trả phí cao nhất. Chưa đặt ngưỡng doanh thu, số SKU, số xe hoặc số người dùng vì chưa có dữ liệu vận hành và tải thiết bị. Thu những giá trị này trước khi chốt mục tiêu hiệu năng.

| Phương án phân khúc | Điểm thuận lợi cho kiểm chứng | Phức tạp cần xử lý | Khuyến nghị |
|---|---|---|---|
| NPP tự mua–bán hàng đóng gói, một đơn vị bán/MST | Theo được hàng thuộc ai, bên nào mang nợ, tiền ai đang giữ; A/B có chung lõi | Quy đổi, quà tặng, trả hàng, hạn dùng, hóa đơn đúng thời điểm | Ưu tiên tìm pilot |
| Đại lý bán đúng giá hưởng hoa hồng/ký gửi | Có bài toán tuyến và đối soát thật | Quyền sở hữu, giá, doanh thu và chứng từ giữa bên giao đại lý và đại lý khác mô hình mua–bán | Chưa chọn làm archetype đầu; chỉ nhận nếu tách và đặc tả được nghĩa vụ |
| Nhà sản xuất quản lý nhiều NPP/sell-out | Phù hợp theo dõi độ phủ và sản lượng tại điểm | Dữ liệu tồn/khách/nợ có thể thuộc NPP khác; dễ nhầm tenant với bên bán | Để sau đợt kiểm chứng NPP trực tiếp |
| Hàng có biến thể khối lượng, yêu cầu chuyên ngành hoặc chuỗi lạnh | Có thể có nhu cầu rõ | Đo lường, truy xuất, chất lượng, giao nhận và quy định bổ sung | Không đưa vào pilot đầu nếu chưa có người và dữ liệu xác minh |

Với hàng đóng gói có hạn dùng, không được mặc nhiên bỏ lô/hạn dùng. Nếu SKU pilot cần truy xuất hoặc FEFO, đưa thông tin này vào nhập–xuất–trả ngay; nếu chưa có mẫu dữ liệu để xử lý, loại SKU đó khỏi pilot có giới hạn rõ, không xóa nhu cầu bằng quyết định kỹ thuật.

### 1.3. Điều kiện chọn đơn vị pilot

Đơn vị vận hành pilot là doanh nghiệp sử dụng SaaS, không phải bản ghi `Customer` hay `Outlet` bên trong tenant. Hiện **chưa có đơn vị được xác nhận tham gia**.

Đề xuất phỏng vấn định tính 3–5 đơn vị, sau đó chọn 2–3 nơi đủ điều kiện. Số lượng này nhằm tìm khác biệt vận hành; không dùng để suy tỷ lệ toàn thị trường. Một đơn vị có thể kiểm chứng cả A/B. Nếu không có đơn vị đáp ứng B, giữ mục tiêu B và ghi khoảng trống bằng chứng thay vì đổi tên một quy trình A thành B.

Một ứng viên chỉ chuyển sang chuẩn bị pilot khi có đủ: người quyết định mua; người chốt số dư kho/nợ/tiền; người dùng tuyến; bộ chứng từ đã được phép dùng; danh sách thiết bị; cách lập hóa đơn hiện tại; khoảng thời gian quan sát; và trách nhiệm xử lý sai lệch. Ưu tiên nơi chấp nhận đối chiếu một chuyến thật từ mở đến đóng, kể cả trường hợp lỗi. Loại khỏi pilot đầu nếu yêu cầu bắt buộc vượt phạm vi như hợp nhất nhiều pháp nhân, ký gửi tổng quát hoặc giao bán hoàn toàn mất mạng nhưng chưa có phương án hóa đơn được xác minh.

## 2. Bộ thu thập bằng chứng có thể dùng ngay

### 2.1. Hồ sơ ứng viên và dữ liệu tối thiểu

Mỗi ứng viên dùng mã ẩn danh `NPP-01`; lưu người liên hệ và chứng từ thật ở nơi được cấp quyền, không đưa vào repository công khai. Hồ sơ nghiên cứu ghi:

| Nhóm | Trường cần lấy | Quyết định được hỗ trợ |
|---|---|---|
| Vận hành | Chủ sở hữu hàng; đơn vị xuất hóa đơn; A/B; số kho/xe; kiêm nhiệm giao–lái; chuyến kết hợp | Ánh xạ tenant và phân quyền; hỗ trợ chuyến hỗn hợp |
| Khối lượng | SKU đang bán; Customer/Outlet; dòng/đơn; đơn/chuyến; chuyến/ngày; đỉnh trong ngày | Dữ liệu thử và mục tiêu độ trễ, không lấy trung bình che đỉnh |
| Hàng | UoM; quy đổi; lô/hạn dùng; hàng tặng; trả/hỏng; phí mua | Chính sách tồn, giá vốn, FEFO và cách ly |
| Tiền | Hạn mức; nợ đầu kỳ; thu nhiều đơn; thu không chỉ định đơn; tiền giữ; tạm ứng | Ba loại số dư và thẩm quyền duyệt |
| Hóa đơn | Nhà cung cấp; loại hóa đơn; cách ký; ai lập; thời điểm; lỗi thường gặp | Chọn adapter và quy trình B khả thi |
| Thiết bị/mạng | Model, OS, trình duyệt, bản cài PWA; máy dùng chung; in/camera; mất mạng | Ma trận spike cần thực hiện |
| Mua và dùng | Ai trả phí; hệ thống đang dùng; chi phí thay đổi; điều kiện tiếp tục | Định vị sản phẩm và quyết định pilot |

Không tự đặt `0` cho trường chưa có; dùng `chưa thu thập`, kèm người cần hỏi. Mỗi nhận định phải gắn mã bằng chứng, vai trò, ngày, tài liệu/quan sát liên quan, phạm vi đồng ý sử dụng và mức tin cậy.

### 2.2. Kịch bản phỏng vấn và quan sát

Đề xuất một buổi 60–90 phút mỗi đơn vị, điều chỉnh theo khả năng tiếp cận; đây là kế hoạch, chưa thực hiện. Mở đầu bằng **một đơn hoặc chuyến vừa kết thúc**, sau đó đi theo các bước sau:

1. Người quyết định mua chỉ ra vấn đề gần nhất gây mất thời gian hoặc tiền, và ai chịu chi phí. Hỏi bằng ví dụ trước khi hỏi ngân sách hoặc tính năng muốn có.
2. Sales/người xử lý đơn cho xem cách chọn khách, điểm giao, giá, chiết khấu và quà. Lấy một lần giao thiếu và một lần đổi giá; xác định ai có quyền hứa giá.
3. Kho/người giao dựng lại số hàng đã giao nhận, quà, hàng trả, hỏng và tồn cuối chuyến. Kiểm tra điều chuyển có bị nhập thành doanh số ở sổ hiện tại hay không.
4. Kế toán đối chiếu một khoản thu: khách trả cho đơn nào, nhân viên giữ bao nhiêu, nộp quỹ khi nào; lấy ví dụ thu thừa, trả hàng sau thu và chi phí tuyến.
5. Theo dấu hóa đơn từ mốc chuyển giao đến ký/gửi, gồm cả bán lưu động, giao từng phần và trả. Xác định chứng từ vận chuyển đang dùng. Không nhận câu trả lời “cuối ngày xuất hết” như bằng chứng đủ tuân thủ.
6. Tái hiện mất mạng, mất máy, đổi người giao và đóng chuyến còn thiếu chứng từ. Ghi điều thực sự làm được và bước phải gọi điện/xử lý ngoài hệ thống.
7. Đo một tác vụ hiện tại và hỏi điều kiện để họ bỏ quy trình cũ. Ghi rõ khác biệt giữa ý định dùng, chấp thuận pilot và cam kết trả phí.

Đầu ra mỗi buổi gồm sơ đồ trách nhiệm ngắn, một chuỗi chứng từ đối chiếu được, danh sách ngoại lệ và các giả thuyết bị bác bỏ. Bằng chứng trái với phương án MVP phải giữ lại trong biên bản. Không quy mọi chênh lệch về “người dùng nhập sai”.

## 3. Kết quả khảo sát khả năng tích hợp hóa đơn

### 3.1. Bằng chứng API hiện có và giới hạn

| Phương án | Bằng chứng công khai ngày 11/11/2026 | Kết luận sử dụng được | Điều chưa được chứng minh |
|---|---|---|---|
| MISA meInvoice | Trang Help trực tiếp đọc được `PublishInvoiceData`, có mã client, mã tra cứu, trường callback và lỗi; tài liệu lấy theo ID cũng đọc được [I01–I02](sources.md) | Có mô hình dữ liệu để thiết kế ánh xạ định danh và đối chiếu; là ứng viên hợp lý cho spike đầu nếu pilot chưa ràng buộc nhà cung cấp | Quyền đối tác, API/version được hỗ trợ cho tài khoản thực, semantics retry, sandbox và hành vi pháp lý hiện hành |
| Tài liệu integration meInvoice v3 cũ | Máy tìm kiếm còn lập chỉ mục phần phát hành, tra cứu RefID, trạng thái; mở trực tiếp một số URL trả 404 [I03–I05](sources.md) | Dùng để hình thành câu hỏi kỹ thuật; có cảnh báo lỗi từng hóa đơn trong phản hồi batch | Không coi bản chỉ mục là hợp đồng endpoint đang chạy; không chép endpoint cũ vào đặc tả đã chốt |
| Viettel SInvoice | Trang chính thức chuyển sang trang SME/Tendoo; tìm thấy PDF chính thức hướng dẫn kết nối MISA nhưng lần mở PDF bị timeout [I06](sources.md) | Giữ trong danh sách nếu đơn vị pilot đang sử dụng; phải xin tài liệu và sandbox trực tiếp | Chưa xác nhận API phát hành/tra cứu/điều chỉnh, idempotency, callback hoặc vận hành offline |

Không dùng tài liệu API đăng trên tên miền đại lý hoặc bên tích hợp không xác minh làm bằng chứng chính thức của Viettel/VNPT. Lỗi truy cập tài liệu không chứng minh dịch vụ bị ngừng. Trang schema có copyright năm 2026 cũng không tự chứng minh tất cả endpoint đáp ứng quy định hóa đơn tại thời điểm pilot.

**Khuyến nghị:** MVP có một adapter cho một nhà cung cấp, dùng tài khoản hóa đơn của chính đơn vị bán. Nếu pilot đã có nhà cung cấp đáp ứng các ca bắt buộc, ưu tiên tiếp nối nhà cung cấp đó để giảm công chuyển đổi. Nếu chưa có ràng buộc, khảo sát sandbox meInvoice trước vì đã đọc được schema trên tên miền chính thức; chỉ chốt sau khi qua bảng kiểm bên dưới. Chưa có cơ sở để chọn bằng giá, độ ổn định hoặc mức hỗ trợ vì chưa có báo giá/hợp đồng hay đo thực tế.

### 3.2. Hợp đồng tích hợp MVP đề xuất

Đây là mô hình của sản phẩm đề xuất, không phải cam kết của API nhà cung cấp.

| Thành phần | Quy tắc đề xuất |
|---|---|
| Định danh | `tenant_id`, đơn vị bán/MST, `invoice_intent_id` bất biến, `business_event_id`/dòng giao, `provider_request_ref`, ID/số/ký hiệu hóa đơn do provider trả; không dùng số đơn làm khóa duy nhất cho mọi lần giao |
| Dữ liệu đầu vào | Snapshot bên bán/mua, hàng/UoM/quy đổi, tiền/chiết khấu/quà, mã xử lý thuế, mốc chuyển giao, loại chứng từ và tham chiếu điều chỉnh; danh tính người lập/duyệt |
| Trạng thái | Tách ý định lập, hồ sơ đủ/thiếu, đã gửi, chưa rõ kết quả, đã được provider nhận, **đã lập hóa đơn hợp lệ với `invoice_created_at`**, đã ký, đã có mã khi áp dụng, đã gửi CQT theo loại, và đã chuyển cho bên mua. Mốc lập hợp lệ cần bằng chứng riêng, không suy từ provider nhận request; không gom thành `success=true` |
| Chống trùng | Một ý định giữ một tham chiếu qua retry; khóa xử lý cùng ý định; lưu payload hash, receipt và lịch sử; sau timeout giữ trạng thái chưa rõ và tra bằng tham chiếu client ổn định. Lookup rỗng có thể do độ trễ, không tự chứng minh chưa phát hành; chỉ gửi lại khi contract idempotency hoặc cách xác định chưa nhận đã được kiểm chứng |
| Nhiều hóa đơn | Đọc kết quả từng phần tử; batch thành công ở tầng HTTP không đồng nghĩa mọi hóa đơn được lập/phát hành |
| Callback/tra cứu | Callback nếu được hỗ trợ phải xác thực và dedup; vẫn có polling/đối chiếu cho mất callback; không tin callback chỉ vì biết ID |
| Sửa/trả | Giữ nguyên chứng từ đã phát hành; tạo luồng điều chỉnh/thay thế và tham chiếu đúng theo kết luận pháp lý; không xóa để phát hành lại cùng nghiệp vụ |
| Lưu trữ | Giữ dữ liệu có cấu trúc và bằng chứng/định danh chứng từ gốc theo chính sách lưu trữ; bản PDF để đọc không tự thay mọi nghĩa vụ lưu hóa đơn điện tử |
| Bảo mật | Credential và quyền ký ở máy chủ/cơ chế provider, tách tenant, không đặt bí mật dùng chung trong IndexedDB của PWA |
| Khôi phục | Trước replay sau restore, đối chiếu provider theo tham chiếu ngoài DB; một hóa đơn ngoài hệ thống đã tồn tại không được phát hành thêm vì DB đã quay về thời điểm trước đó |

**Phân biệt thời điểm lập với thời điểm ký/gửi:** kết luận NĐ 254/2026 nằm trong [phụ lục pháp lý](hoa-don-va-tuan-thu.vi.md). Outbox và queue là cách chuyển dữ liệu đáng tin cậy; chúng không tự tạo ngoại lệ cho thời điểm lập hóa đơn. Lưu nháp giao dịch offline chưa được chứng minh là lập hóa đơn điện tử hợp lệ. Đối với B, ưu tiên kênh lập hóa đơn có kết nối tại thời điểm bán hoặc điều phối có đủ dữ liệu qua kênh khác đã xác minh. Module lập hóa đơn offline chỉ được đưa vào pilot sau khi provider và kế toán xác nhận tính phù hợp của quy trình, dữ liệu và mốc thời gian.

### 3.3. Bộ ca sandbox phải chạy trước quyết định triển khai

| Mã | Ca thử cần thực hiện | Bằng chứng chấp nhận |
|---|---|---|
| INV-01 | Bán đủ, bán chịu, giao A hai lần | Một nguồn giao đúng từng hóa đơn; khoản phải thu không tăng lần thứ hai do hóa đơn |
| INV-02 | Mất phản hồi ngay sau gửi, chưa có provider ID | Tra cứu bằng client reference ổn định; thử cả dữ liệu xuất hiện chậm. Giữ `unknown` khi chưa kết luận được; chỉ retry theo contract đã chứng minh không tạo thêm |
| INV-03 | Cùng tham chiếu nhưng payload khác | Lỗi/luồng xử lý rõ; không thay nội dung âm thầm |
| INV-04 | Batch có một phần tử lỗi | Trạng thái từng hóa đơn đúng; không đánh cả batch hoàn tất |
| INV-05 | Chữ ký hết hạn/hết quyền; đăng ký hóa đơn không hợp lệ | Có lỗi rõ và người xử lý; không cho nhân viên hiểu nhầm đã phát hành |
| INV-06 | Callback mất/lặp/đến sai thứ tự | Đối chiếu được; không tạo lại hiệu ứng nghiệp vụ |
| INV-07 | Trả một phần, chiết khấu, quà, hóa đơn sai | Tách ca trả hàng điều chỉnh với ca sửa lỗi; nếu dùng hóa đơn từ máy tính tiền, thử nhánh lập sai dùng thay thế theo TT91 Điều 10(1)(c). Mã loại chứng từ, tham chiếu, số tiền và thời điểm đúng với kế toán pilot |
| INV-08 | Restore DB sau khi provider đã phát hành | Hệ thống nhận lại định danh bên ngoài, không cấp một hóa đơn mới cho cùng ý định |
| INV-09 | B mất mạng trong lúc chuyển giao | Xác nhận có hoặc không có kênh lập đúng thời điểm; phân định mốc lập/ký/gửi; không dùng ngày hồi tố để làm ca “pass” |

Hiện tất cả INV-01–09 ở trạng thái **chưa chạy**. Tài liệu schema chỉ giúp chuẩn bị request và expected result, không phải kết quả sandbox.

## 4. Onboarding và chuyển số dư không ghi trùng

### 4.1. Chọn cách chuyển đổi

Khuyến nghị pilot đầu **chốt sạch chuyến đang chạy trước thời điểm chuyển đổi** nếu doanh nghiệp sắp xếp được. Sau kiểm kê và chốt tiền/nợ, mở chuyến mới trong MVP. Cách này giảm số trạng thái dở dang phải giải thích; không phải khẳng định doanh nghiệp luôn có thể ngừng hoạt động.

Nếu phải tiếp tục chuyến đang dở, nhập một manifest chuyển đổi được người phụ trách xác nhận: hàng đang ở kho/xe/cách ly; giữ chỗ cho A; phần B còn quyền bán; khoản phải thu chưa thanh toán; tiền nhân viên đã thu nhưng chưa nộp; tạm ứng; tiền khách ứng trước/thu chưa phân bổ; và hóa đơn đã lập cùng tham chiếu. Các mục đã xảy ra là **số dư/chứng từ ngoại hệ thống**, không chạy lại sự kiện giao/thu để tạo số dư mới.

### 4.2. Mẫu cấu trúc import và dòng minh họa

Mẫu dưới đây là đặc tả bảng nhập dữ liệu, chưa phải file của doanh nghiệp. Mã và số liệu đều giả lập. Có thể chuyển từng hàng định nghĩa thành sheet để thu mẫu thật; không đưa thông tin thật vào repo.

| Bảng | Cột bắt buộc và khóa | Dòng minh họa/kiểm tra |
|---|---|---|
| Sản phẩm | `sku_code`, tên, `base_uom`, bước lượng, theo lô/hạn dùng hay không | `SP-DEMO`, chai, bước 1; quy tắc thuế để kế toán chọn, không mặc định 0% |
| UoM | `sku_code`, `uom_code`, tử/mẫu quy đổi, hiệu lực, `version` | `SP-DEMO`, thùng, 12/1 chai, v1; không chấp nhận quy đổi 0/âm hoặc trùng phiên bản |
| Customer | `customer_code`, tên bên mua/nợ, loại, thông tin hóa đơn theo nhu cầu | `KH-01`, Bên mua mẫu; mã thuế thật không tự sinh từ mã khách |
| Outlet | `outlet_code`, `customer_code`, địa chỉ giao, trạng thái | `DB-01`, `KH-01`, địa chỉ giả lập; kiểm tra FK và điểm bán trùng |
| Tồn đầu | `location_code`, SKU, lô nếu cần, UoM gốc, lượng, tổng giá trị, mốc chốt | `KHO-01`, `SP-DEMO`, 120 chai, 1.200.000; không nhập giá bán làm giá vốn |
| Công nợ | `opening_item_id`, Customer, tham chiếu chứng từ, ngày phát sinh/hạn, còn phải thu | `AR-01`, `KH-01`, `EXT-001`, 400.000; không nhập tổng khách rồi lại nhập từng hóa đơn vào cùng sổ |
| Tiền thu hộ | `custody_id`, nhân viên, số tiền giữ, mốc chốt, tham chiếu | `CUST-01`, `NV-01`, 200.000; không ghi thêm giảm nợ khách |
| Tạm ứng | nhân viên, mã khoản, dư, chứng từ, mốc chốt | `ADV-01`, `NV-01`, 300.000; không trộn với tiền thu hộ |
| Hóa đơn ngoài hệ thống | đơn vị bán, provider, số/ký hiệu, external ID, chứng từ giao/nợ liên quan | Chỉ tham chiếu hóa đơn đã tồn tại; không gửi yêu cầu phát hành trong import |

Sổ đầu phải có khả năng biểu diễn tiền khách ứng trước, khoản thu chưa phân bổ và nghĩa vụ hoàn tiền; không ép mọi số dư vào “nợ dương”. Bản ghi đơn/chuyến dở cần ID ngoại hệ thống duy nhất và phần đã thực hiện, phần còn lại. Import dùng mã batch cùng khóa duy nhất `tenant + hệ thống nguồn + loại bản ghi + ID nguồn`, payload hash và trạng thái từng dòng/transaction. Batch ID đơn lẻ không đủ khi một phần đã ghi hoặc người dùng gửi lại cùng file bằng batch mới; nội dung khác dưới cùng khóa phải được xử lý rõ.

### 4.3. Quy trình chuyển đổi đề xuất

1. Chốt thời điểm và người chịu trách nhiệm từng loại số dư; sao lưu bản nguồn có quyền truy cập phù hợp. Ngừng cấp quyền và đóng băng writer/gói quyền cũ; thu manifest số thứ tự, command ID/hash, receipt và hàng đợi chưa gửi trước khi xác nhận snapshot. Máy không tiếp cận được phải ghi là ngoại lệ chuyển đổi cần giải quyết, không coi server chưa thấy lệnh là không có lệnh.
2. Nạp vào vùng xem thử; báo lỗi từng dòng, không tự chữa bằng quy tắc âm thầm. Kiểm tra mã trùng, quan hệ thiếu, UoM, tiền/lượng và chứng từ đã tồn tại.
3. Đối chiếu tổng theo SKU×địa điểm, Customer, nhân viên, quỹ/ngân hàng và loại số dư; xem cả số dòng và tổng tiền/lượng, không chỉ tổng chung.
4. Cho người phụ trách xác nhận biên bản trước khi ghi chính thức; ghi `cutover_at`, hash/version nguồn, batch và người duyệt.
5. Mở các chuyến mới với đời quyền/cutover epoch mới; kiểm thử một giao/thu/trả có kiểm soát; so với nguồn bằng chứng. Lệnh mang đời quyền cũ tới muộn phải đối chiếu manifest và số dư đã nhập trước khi xử lý, không tự ghi thêm hoặc phân trước/sau chỉ theo giờ máy. Quy trình cũ có thời điểm ngừng ghi rõ ràng để tránh hai sổ phát sinh không kiểm soát.
6. Nếu lỗi trước phát sinh mới, có thể bỏ batch theo điều kiện. Sau khi đã có giao dịch phụ thuộc, dùng điều chỉnh/đảo có duyệt; không xóa số dư nền tùy tiện.

Chưa có file thật và chữ ký đối chiếu nên chưa thể kết luận đơn vị nào sẵn sàng cutover.

## 5. Định nghĩa báo cáo và phép đo pilot

### 5.1. Báo cáo vận hành tối thiểu đề xuất

Mọi báo cáo ghi rõ thời điểm server cập nhật, chuyến còn mở và giao dịch chưa xác nhận. Server không thể biết chính xác mọi lệnh còn trên máy đang mất mạng; phải hiển thị số đã biết cùng trạng thái chưa xác nhận đầy đủ, không báo số 0 mang nghĩa “đã hết”.

| Báo cáo | Công thức/nguồn đề xuất | Tránh hiểu nhầm |
|---|---|---|
| Giá trị đơn xác nhận | Tổng tiền hàng theo dòng A/B đã xác nhận, trừ phần hủy; chọn rõ kỳ và trạng thái | Chưa giao không tự là doanh thu; B liên kết sự kiện đã giao riêng |
| Giá trị hàng giao thuần | Tiền dòng giao sau ưu đãi trừ giá trị trả/credit theo chính sách, tách thuế và quà | Đây là chỉ tiêu vận hành; thời điểm doanh thu kế toán cần chính sách riêng |
| Tồn và giá trị tồn | Tổng sổ lượng/giá trị theo SKU×địa điểm; phân biệt bán được, cách ly, giữ chỗ, khả dụng | Hàng trên xe vẫn thuộc đơn vị đến khi bán; hàng quan sát tại điểm bán không tự là tồn của NPP |
| Công nợ và tuổi nợ | Khoản phải thu còn mở sau phân bổ thu/credit; quá hạn theo `due_date` của từng khoản | Ngày phát hành hóa đơn không mặc nhiên là hạn trả; tiền thu hộ chưa nộp vẫn đã có thể giảm nợ khách |
| Tiền thu hộ nhân viên giữ | Số đầu + tiền thực thu khách + bàn giao nhận − hoàn khách được duyệt − nộp được bên nhận xác nhận − bàn giao đi được bên nhận xác nhận | Không gồm tạm ứng; không trừ chi phí tuyến âm thầm; không giảm nợ khách lần hai khi nộp quỹ |
| Ngoại lệ hóa đơn/đồng bộ | Ý định lập chưa hoàn tất, trạng thái chưa rõ, vi phạm thời điểm cần xử lý; lệnh thiếu ACK theo chuyến | Có người chịu trách nhiệm và tuổi ngoại lệ; không chỉ đếm tổng lỗi kỹ thuật |

### 5.2. Bộ KPI có mẫu số và cách đo

Hướng dẫn phương pháp của GOV.UK khuyến nghị kết hợp số đo giao dịch với quan sát người dùng, không chỉ dựa vào analytics [M05–M06](sources.md). Bộ KPI cụ thể dưới đây do nghiên cứu đề xuất cho NPP; chưa có baseline hay kết quả thực đo.

| Chỉ số | Công thức và mẫu số | Cách thu/điều kiện so sánh | Ngưỡng đề xuất |
|---|---|---|---|
| Thời gian xử lý A | Trung vị phút từ bắt đầu nhập đơn đến đủ điều kiện soạn/xuất giao; báo thêm số lần chờ/sửa | So cùng loại đơn, số dòng và điều kiện mạng; phân biệt thao tác với thời gian chờ | Mục tiêu cải thiện sau khi có baseline, chưa điền số đạt |
| Thời gian thao tác B | Trung vị phút từ bắt đầu lập giao dịch tại điểm đến hoàn tất ghi nhận bán/giao/thu của tác vụ được phép | So cùng loại giao dịch, số dòng, cách thu và điều kiện mạng; hàng đã cấp lên xe nên không dùng mốc chuyển kho; thời gian tới ACK đo riêng | Chốt sau baseline; không dùng ngưỡng A áp mặc nhiên cho B |
| Thời gian đóng chuyến | Thời điểm xác nhận đóng − bắt đầu đối soát; ghi riêng ngoại lệ tồn/tiền/hóa đơn | Cùng loại chuyến và độ lớn; báo số chuyến, trung vị và khoảng giá trị | Giả thuyết giảm 30%; không phải cam kết hay ngưỡng đã duyệt |
| Tác vụ hoàn thành không trợ giúp | Số lần đúng kết quả, không cần người dẫn thao tác / số lần thử đủ điều kiện | Báo từng vai trò/tác vụ, không gộp trung bình che người dùng thất bại | Đề xuất ≥90% khi mẫu đủ; luôn ghi n/N và lỗi nghiêm trọng |
| Đối soát đúng | Số chuyến đã đóng có lượng/tiền/nợ khớp chứng từ hoặc điều chỉnh được duyệt / chuyến đã đóng | Đối chiếu sổ, không hỏi cảm nhận; liệt kê giá trị chênh chưa giải thích | 0 chênh lệch chưa giải thích tại thời điểm nghiệm thu chuyến |
| Ghi trùng hiệu ứng | Số sự cố một nghiệp vụ tạo thêm tồn/nợ/thu/hóa đơn | Fault injection và log thực, phân biệt retry với sự kiện kinh doanh khác | 0 trong bộ ca bắt buộc; chưa chứng minh xác suất bằng 0 trong vận hành |
| Độ trễ sync | `server_committed_at − client_recorded_at`, chia điều kiện mạng | Đồng hồ máy có thể lệch; đo thêm thời gian từ kết nối lại đến ACK; báo số quan sát | Chốt sau spike trên tập thiết bị/data thực; không tự đặt SLA |
| Bao phủ sử dụng | Chuyến/đơn trong phạm vi được xử lý đầy đủ trên MVP / tổng chuyến/đơn đủ điều kiện | Ghi lý do bỏ qua, không loại ca lỗi khỏi mẫu số để tăng tỷ lệ | Thỏa thuận trước pilot |
| Công hỗ trợ | Phút hỗ trợ + phút sửa dữ liệu/đơn vị/tuần; số sự cố theo mức | Tính cả công của bên SaaS và người phụ trách NPP | Đủ để so với doanh thu dự kiến; chưa có giá bán để kết luận lãi |
| Tiếp tục/trả phí | Quyết định có điều kiện của người có quyền mua, ngày và lý do | Phân biệt phỏng vấn tích cực, dùng thử tiếp và đồng ý trả phí | Có quyết định rõ; không quy đổi lời khen thành doanh thu |

Mẫu nhỏ dùng để học và phát hiện lỗi. Chỉ số trước–sau có thể thay đổi vì mùa vụ, tuyến, danh mục hoặc nhân sự; ghi các yếu tố này, không kết luận quan hệ nhân quả chỉ từ một phần trăm cải thiện.

### 5.3. Tác vụ UX phải quan sát trên prototype/PWA

Đề xuất sáu tác vụ: tạo A có thùng/lốc và hai lần giao; B bán kèm quà và thu một phần; trả có gốc rồi hoàn tiền; tìm khoản thu chưa phân bổ; xử lý trạng thái “lưu trên máy” và “máy chủ xác nhận”; nộp tiền và đóng chuyến có một lệnh chưa gửi. Thử người giao kiêm lái và người giao riêng với lái; thử đổi tenant/máy dùng chung chỉ khi mô hình quyền cho phép.

Ghi kết quả thực của mỗi tác vụ, thời gian, bước yêu cầu trợ giúp và điều người dùng hiểu về hàng/tiền/hóa đơn. Màn hình chỉ hiện “thành công” mà người dùng không biết dữ liệu đang ở đâu là kết quả cần sửa, dù thao tác lưu cục bộ hoạt động. Chưa có prototype nên các tác vụ này **chưa được chạy**.

## 6. Quyết định có thể đưa ra sau đợt tài liệu này

Có thể chọn một archetype pilot, mô hình adapter một provider, bộ dữ liệu mở đầu, cách đo và các tiêu chí loại ca chưa kiểm soát. Chưa thể khẳng định nhu cầu được xác thực, chọn NPP cụ thể, định giá SaaS, cam kết lịch triển khai hoặc phê duyệt B hoàn toàn offline. Những việc còn lại đã được quy về bằng chứng cụ thể: người và chứng từ, tài khoản sandbox, thiết bị và kết quả ca thử, thay vì một yêu cầu chung “nghiên cứu thêm”.
