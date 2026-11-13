# R006 — Hóa đơn, thuế, khuyến mại và bảo vệ dữ liệu

- Mốc pháp lý nghiên cứu: **11/11/2026**, theo ngày của đề bài, múi giờ Asia/Bangkok.
- Phạm vi: NC-08 và phần dữ liệu cá nhân của NC-09 trong [B005](../../briefs/2026-11-11-05-nghien-cuu-bo-sung-dat-mvp.md); nhà phân phối FMCG Việt Nam, A đặt trước/giao sau, B bán theo xe, nhân viên dùng PWA.
- Trạng thái: nghiên cứu tài liệu sơ cấp và đề xuất đặc tả. **Chưa xác nhận với kế toán NPP, chưa thử API/thiết bị, chưa diễn tập sự cố hoặc pilot.** Các lựa chọn vận hành dưới đây cần được chốt với đơn vị thực tế.
- Nguồn, điều khoản, trang bản ký và giới hạn truy cập: [Sổ nguồn pháp lý](nguon-phap-ly.md). Ký hiệu L01–L12 dẫn đến nguồn đó.

## 1. Kết luận ảnh hưởng trực tiếp đến MVP

**Giữ A, B, PWA và hóa đơn điện tử trong phạm vi; B hoàn toàn ngoại tuyến chưa đủ điều kiện đưa vào pilot nếu chưa chứng minh được cách lập hóa đơn đúng thời điểm.** NĐ254/2026/NĐ-CP Điều 9(1), (3) gắn hóa đơn bán hàng hóa với chuyển quyền sở hữu/quyền sử dụng và từng lần giao. Phụ lục điểm 7 cho thời hạn ký/gửi trong một số trường hợp hóa đơn **đã lập**; không biến một đơn hàng lưu cục bộ thành hóa đơn và không cho phép tự lùi ngày lập sau đồng bộ. Đây là căn cứ pháp lý; đánh giá chưa sẵn sàng pilot là suy luận áp dụng vào thiết kế hiện có. [L01](nguon-phap-ly.md#l01)

Căn cứ hóa đơn hiện hành là **NĐ254/2026**, có hiệu lực 01/07/2026, và **TT91/2026/TT-BTC**, cùng ngày hiệu lực. NĐ254 Điều 43 bãi bỏ NĐ123/2020, Điều 1 NĐ41/2022 và NĐ70/2025; TT91 Điều 25 bãi bỏ TT32/2025. Vì vậy, hướng dẫn dựa riêng trên 123/70/32 chỉ còn giúp hiểu lịch sử và chuyển tiếp, không đủ để chốt MVP tháng 11/2026. [L01](nguon-phap-ly.md#l01), [L02](nguon-phap-ly.md#l02)

Hai cập nhật khác cần đưa vào đặc tả: khuyến mại phải đọc NĐ81/2018 đã sửa đến **NĐ239/2026**, cùng hạn mức tại TT39/2025/TT-BCT; bảo vệ dữ liệu phải đọc **Luật91/2025/QH15 và NĐ356/2025**, thay vì tiếp tục dùng NĐ13/2023. Các kết luận dưới đây không xác định thuế suất cho SKU chưa có thông tin hoặc thay kết luận áp dụng của kế toán/pháp chế. [L07–L09](nguon-phap-ly.md#l07), [L11–L12](nguon-phap-ly.md#l11)

## 2. Chốt chủ thể và loại hóa đơn trước khi lập ma trận

Phải tách ba thuộc tính: **người bán pháp lý**, **loại hóa đơn** và **phương thức sử dụng hóa đơn**. Theo NĐ254 Điều 8, doanh nghiệp tính VAT theo phương pháp khấu trừ sử dụng hóa đơn GTGT trong các trường hợp tương ứng; phương pháp trực tiếp sử dụng hóa đơn bán hàng. Có mã, không có mã và khởi tạo từ máy tính tiền là trục phân loại khác, theo đối tượng, điều kiện và đăng ký tại Điều 6. Bán trên xe không tự quyết định phải dùng máy tính tiền. Đối tượng bán lẻ trực tiếp người tiêu dùng cần rà Điều 6(1)(c), kể cả quy định không bắt buộc chuyển đổi nếu đã đăng ký loại có mã/không có mã thuộc trường hợp được nêu. [L01](nguon-phap-ly.md#l01)

Tên gọi “đại lý” trong danh mục khách hàng không chứng minh quan hệ đại lý pháp lý. Luật Thương mại Điều 166, 170 phân biệt hoạt động hưởng thù lao cho bên giao đại lý và quyền sở hữu hàng của bên giao. NĐ254 Điều 6(3)(d) có cơ chế chứng từ cho đại lý bán đúng giá hưởng hoa hồng, khác nhà bán lại mua đứt hàng. Trước cấu hình, kế toán phải xác nhận hợp đồng, chủ hàng, người bán xuất hóa đơn, bên thu tiền, bên chịu nợ và thuế đối với hoa hồng. Không suy từ trường `Dealer` ra quyền sở hữu hoặc cách xuất hóa đơn. [L10](nguon-phap-ly.md#l10), [L01](nguon-phap-ly.md#l01)

Đề xuất hồ sơ cấu hình mỗi Business: tên/MST/địa chỉ pháp lý, phương pháp thuế, đăng ký sử dụng hóa đơn, mẫu/ký hiệu, ủy nhiệm nếu có, kênh ký và người chịu trách nhiệm. Tenant là đơn vị cách ly dữ liệu đã được lựa chọn; chưa có căn cứ coi mọi tenant luôn tương đương đúng một người bán pháp lý.

## 3. Ma trận giao dịch → thời điểm, chứng từ, dữ liệu

Ma trận áp dụng cho mua bán FMCG thông thường. “Hóa đơn bán” dưới đây là loại GTGT/bán hàng phù hợp hồ sơ người bán và phương thức đã đăng ký. Thời điểm chuyển quyền cần đối chiếu hợp đồng và thực tế giao nhận; dấu bấm “giao xong” không tự thay định nghĩa pháp lý.

| Giao dịch | Quy tắc và điều kiện áp dụng | Dữ liệu/kiểm soát đề nghị |
|---|---|---|
| A nhận đơn, chưa giao | Chưa tự phát sinh mốc lập hóa đơn hàng hóa chỉ vì duyệt đơn; mốc theo chuyển quyền. NĐ254 Đ9(1) | Tách đơn, giữ hàng, xuất vận chuyển và giao nhận; kế toán chốt mốc chuyển quyền |
| A giao đủ hoặc B bán tại điểm | Lập hóa đơn khi chuyển quyền sở hữu/quyền sử dụng, dù đã thu tiền hay chưa. Đ9(1) | Số lượng thực giao, thời điểm thực tế, người bán/người mua, địa chỉ nhận và địa chỉ hóa đơn, giá/ưu đãi đã chốt |
| Giao nhiều lần | Mỗi lần giao lập hóa đơn cho lượng/giá trị giao tương ứng. Đ9(3) | Một đơn liên kết nhiều lần giao và hóa đơn; không tự đợi đủ đơn |
| Bán chịu, thu nợ sau | Bán chịu không hoãn lập hóa đơn. Lần thu nợ không phải lần bán mới. Đ9(1) | Công nợ, phân bổ tiền và hóa đơn độc lập; không xuất lặp khi thu |
| Nhận trước/đặt cọc mua hàng hóa | Với hàng hóa thông thường chưa chuyển quyền, không lấy thời điểm thu tiền làm mốc hóa đơn theo Đ9(1). Quy tắc thu tiền trước của dịch vụ tại Đ9(2) không được áp sang hàng hóa | Phiếu thu/chứng từ thanh toán, mục đích tiền, hợp đồng, số dư nhận trước; kế toán xác nhận bản chất khoản tiền |
| Kho → xe để bán lưu động | Đ6(3)(đ): dùng phiếu xuất kho kiêm vận chuyển nội bộ; khi bán lập hóa đơn. Đ7(8) có ngoại lệ cho luân chuyển nội bộ để tiếp tục kinh doanh | Chủ sở hữu không đổi, kho đi/xe nhận, người giữ hàng, số lượng và chứng từ; không biến điều chuyển thành doanh thu |
| Hàng gửi đại lý đúng giá/hoa hồng | Đ6(3)(d) cho các cách chứng từ theo điều kiện, gồm hóa đơn hoặc phiếu xuất kho hàng gửi bán đại lý; khi bán có nghĩa vụ hóa đơn và đối chiếu tương ứng | Chỉ bật sau xác nhận hợp đồng/cơ chế; không áp kỳ bảng kê đại lý để gom mọi hóa đơn khách hàng |
| Hàng mẫu, quà, khuyến mại | Nghĩa vụ lập hóa đơn theo Đ4(1), trừ trường hợp miễn cụ thể; cách tính VAT phụ thuộc bản chất, mục 5 dưới đây | Dòng hàng vật lý, chương trình/căn cứ, lượng quà và giá tính thuế riêng |
| Chiết khấu theo lượng/doanh số sau bán | TT91 Đ10(5)(b): điều chỉnh trên lần mua cuối/kỳ sau trong giới hạn giá trị hóa đơn, hoặc hóa đơn điều chỉnh kèm bảng kê | Liên kết hóa đơn gốc, phân bổ tiền/thuế; không âm thầm đổi doanh thu lịch sử |
| Trả một phần/toàn bộ, đổi làm thay đổi giá trị | TT91 Đ10(5)(c.1): người bán lập hóa đơn điều chỉnh, trừ thỏa thuận người mua lập hóa đơn trả hàng | Biên nhận hàng, hóa đơn gốc, lượng/giá/thuế trả, hoàn tiền/cấn nợ; tránh hai bên cùng lập cho một lần trả |
| Sai hóa đơn hoặc sự cố | Phân loại sai sót theo TT91 Đ10; sự cố theo NĐ254 Đ14; không dùng một thao tác “hủy” cho mọi tình huống | Quy trình ở mục 4 và 6; lưu lịch sử và người xử lý |

Căn cứ của bảng: [L01](nguon-phap-ly.md#l01), [L02](nguon-phap-ly.md#l02). Hủy đơn trước giao, giao thiếu trước lập hóa đơn và nhận trả sau bán là ba sự kiện khác nhau; thiết kế đề nghị không tạo hóa đơn số không để “hủy” một đơn chưa phát sinh bán.

## 4. B, PWA và giới hạn ngoại tuyến

### 4.1. Phân biệt lập, ký, cấp mã và truyền dữ liệu

NĐ254 Điều 9 quy định mốc **lập**. Phụ lục điểm 7 quy định khi ngày ký khác ngày lập, việc ký và gửi cơ quan thuế cấp mã, hoặc chuyển dữ liệu hóa đơn không có mã, chậm nhất ngày làm việc tiếp theo tính từ thời điểm lập, trừ các trường hợp dữ liệu tổng hợp/chi tiết được nêu. Điều 15–16 còn quy định trách nhiệm gửi người mua và truyền dữ liệu theo phương thức sử dụng. Không rút gọn thành “mọi giao dịch được xuất cuối ngày” hoặc “có 24 giờ để lập”. [L01](nguon-phap-ly.md#l01)

Điều 9(5) có trường hợp người bán không có phần mềm lập tự động bán hàng trong ca đêm được lập chậm nhất ngày làm việc tiếp theo; đây là điều kiện cụ thể, không phải miễn trừ ngoại tuyến. Các trường hợp đối soát tại Điều 9(4) cũng không tạo ngoại lệ chung cho phân phối FMCG. Kế toán phải xác nhận căn cứ nếu muốn dùng ngoại lệ. [L01](nguon-phap-ly.md#l01)

Đề xuất lưu riêng thời gian giao dịch thực tế, lập hóa đơn, ký, gửi, nhận mã, gửi người mua; kèm thời gian thiết bị và thời gian máy chủ tiếp nhận. Khi nhà cung cấp trả kết quả không rõ sau timeout, tra cứu bằng mã tham chiếu trước khi phát hành lại. Khóa nội dung bản đã lập, lưu bản gốc và quan hệ điều chỉnh/thay thế. Đây là yêu cầu thiết kế cần kiểm chứng với API, chưa phải khả năng đã xác nhận của nhà cung cấp.

### 4.2. Sự cố có các đường xử lý khác nhau

| Tình huống | NĐ254 Đ14 | Áp dụng vào vận hành |
|---|---|---|
| Người bán không sử dụng được hóa đơn có mã | Khoản 1: liên hệ cơ quan thuế/nhà cung cấp; trong khi xử lý, có nhu cầu thì đến cơ quan thuế để sử dụng hóa đơn có mã | Phương án hỗ trợ và đầu mối thực tế phải chuẩn bị trước chuyến |
| Hệ thống cấp mã cơ quan thuế lỗi | Khoản 2: hệ thống dự phòng, thông báo công khai; có thể ủy quyền nhà cung cấp đủ điều kiện | Giữ thông báo, phạm vi/thời gian ảnh hưởng; không tự cấp mã |
| Nhà cung cấp lỗi | Khoản 3: nhà cung cấp thông báo, phối hợp hỗ trợ và khắc phục | Lưu ticket/thông báo; yêu cầu kênh lập được nhà cung cấp hỗ trợ |
| Hệ thống thuế chưa nhận dữ liệu không có mã | Khoản 4: tạm chưa truyền trong thời gian thông báo; gửi trong 2 ngày làm việc từ thông báo khôi phục | Chỉ là nhánh tương ứng loại không có mã, không miễn lập |
| Bất khả kháng đúng điều kiện | Khoản 5: trong 3 ngày làm việc sau khắc phục thực hiện lập/gửi; ghi sổ và giữ chứng cứ. Khoản 6 xử lý chậm do các nguyên nhân trên | Cần chứng cứ và đánh giá áp dụng; mất mạng dự kiến trên tuyến không mặc nhiên thỏa điều kiện |

Nguồn: [L01](nguon-phap-ly.md#l01), trang PDF 24–25. Không cam kết rằng mọi vùng sóng yếu hoặc lỗi thiết bị là bất khả kháng; cũng không loại bỏ khả năng một sự cố cụ thể thuộc Điều 14 khi có căn cứ.

### 4.3. Phương án đề nghị cho pilot

Ưu tiên B có kênh lập hóa đơn tại mốc chuyển quyền: thiết bị có kết nối hoặc nhân sự văn phòng nhận thông tin qua kênh còn hoạt động và lập đúng thời điểm. Chốt vai trò người xác nhận lượng hàng, kế toán/ủy quyền lập và cách giao hóa đơn. Nếu muốn lập ngay trên thiết bị khi mất mạng, phải chứng minh với nhà cung cấp và kế toán rằng hệ thống thực sự **lập hóa đơn hợp lệ**, bảo toàn số/nội dung và đáp ứng ký/truyền theo loại đã đăng ký; bản nháp hoặc bản ghi outbox chưa đủ bằng chứng.

Khi chưa có kênh hợp lệ và chưa chuyển giao, tạm dừng trước bước bán/giao theo quy trình đã thống nhất. Nếu hàng/tiền đã thực tế chuyển, PWA vẫn phải ghi nhận sự kiện vào hàng đợi ngoại lệ, lưu chứng cứ và báo người chịu trách nhiệm; không xóa giao dịch, lùi thời gian hoặc tạo mã giả để làm đẹp trạng thái. Kế toán quyết định xử lý trên căn cứ sự cố. Điều kiện đóng chuyến là mọi ngoại lệ có chủ xử lý và đối chiếu, không tự coi đồng bộ thành công đồng nghĩa hóa đơn hợp lệ.

## 5. Thuế và khuyến mại: không gán thuế suất 0% cho dòng miễn phí

### 5.1. Phân biệt giá tính thuế và thuế suất

| Bản chất | Căn cứ giá tính VAT | Hệ quả cấu hình |
|---|---|---|
| Quà biếu/tặng thông thường | Giá của hàng cùng loại/tương đương tại thời điểm phát sinh, theo NĐ181 Đ6(1), với ngoại lệ luật định | Không tự lấy giá thu tiền bằng 0 làm giá tính thuế bằng 0 |
| Hàng khuyến mại đúng pháp luật thương mại | Giá tính thuế bằng 0 theo Đ6(2), trừ hình thức giảm giá áp quy tắc giá đã giảm | Giá tính thuế 0 **khác** thuế suất 0%; lưu căn cứ chương trình |
| Gọi là khuyến mại nhưng không đúng pháp luật | Xử lý kê khai, tính thuế như biếu/tặng theo Đ6(2) | Nhãn “free” không đủ; phải kiểm điều kiện chương trình |
| Giảm giá/chiết khấu thương mại | Giá bán đã giảm/chiết khấu, chưa có VAT, theo Đ6(2), Đ14(2); chứng từ chiết khấu sau kỳ theo TT91 Đ10(5)(b) | Tách giảm giá tức thời với quyết toán doanh số; phân bổ theo dòng/thuế tương ứng |
| Luân chuyển/tiêu dùng nội bộ phục vụ kinh doanh thuộc ngoại lệ | NĐ181 Đ6(1)(a),(b) có trường hợp không phải tính, nộp VAT | Không gộp với hàng bán thuế suất 0%, hàng không chịu thuế hoặc mọi khoản biếu/tặng |

Nguồn: [L03–L05](nguon-phap-ly.md#l03), [L02](nguon-phap-ly.md#l02). Đã kiểm tra sửa đổi NĐ359/2025 và NĐ144/2026; các văn bản này không thay hai quy tắc Đ6/Đ14 dùng trong bảng. Tuy vậy, loại hàng, khâu kinh doanh và bên mua có thể thay kết quả: NĐ359 bổ sung cơ chế riêng cho một số nông sản. Vì thiếu SKU, phân loại hàng, hồ sơ người bán và thời điểm áp dụng ưu đãi thuế, báo cáo **không xác định bộ thuế suất dùng cho pilot**.

Đề xuất danh mục thuế có hiệu lực theo thời gian, tách chế độ thuế/thuế suất/giá tính thuế và căn cứ. Ví dụ kiểm chứng “mua 10 tặng 1” phải giữ 11 đơn vị xuất kho; kế toán xác nhận chương trình hợp pháp trước khi giá tính thuế của đơn vị tặng được xử lý theo cơ chế khuyến mại. Không dùng ví dụ đó để kết luận mức VAT của SKU.

### 5.2. Thủ tục và hạn mức hiện hành

NĐ239/2026 có hiệu lực 26/06/2026; VBHN55/VBHN-BCT giúp đọc NĐ81/2018 sau sửa đổi 128/2024 và 239/2026. Theo Điều 17 hiện hành, hàng mẫu, tặng hàng, giảm giá, phiếu mua hàng và khách hàng thường xuyên thuộc các hình thức được miễn **thông báo**; cuộc thi có thưởng Điều 12 phải thông báo tối thiểu 3 ngày làm việc, trừ ngoại lệ như tổng giải/quà dưới 100 triệu đồng hoặc chỉ qua các kênh trực tuyến đúng danh mục. PWA nội bộ của nhân viên không tự biến chương trình thành trường hợp miễn dành cho sàn/website/ứng dụng khuyến mại trực tuyến. [L07–L08](nguon-phap-ly.md#l07)

Miễn thông báo không đồng nghĩa miễn mọi điều kiện. May rủi Điều 13 và hình thức khác thuộc khoản 9 Điều 92 Luật Thương mại cần **đăng ký và được xác nhận trước khi thực hiện**, theo Điều 19. Một tỉnh: Sở Công Thương đối với may rủi; từ hai tỉnh hoặc hình thức khác: Bộ Công Thương. Đây là lý do đề nghị chưa mở tự động hình thức may rủi trong MVP khi chưa có hồ sơ chương trình. [L08](nguon-phap-ly.md#l08)

NĐ239 Điều 11 bãi bỏ Điều 6, 7 và khoản 5 Điều 10 của NĐ81: không tiếp tục dẫn hai điều cũ làm căn cứ hạn mức hoặc coi giới hạn 120 ngày cũ vẫn còn. **TT39/2025 Điều 3–4** quy định hạn mức giá trị khuyến mại và giảm giá. Mốc thông thường 50% có ngoại lệ khác nhau cho hạn mức từng đơn vị, toàn chương trình, chương trình tập trung và từng hình thức. Tặng không kèm mua theo Điều 9(2) có ngoại lệ khác tặng kèm mua Điều 9(1). Không hardcode 50% cho mọi chương trình hoặc tự áp 100% vì có ngày lễ. [L07](nguon-phap-ly.md#l07), [L09](nguon-phap-ly.md#l09)

Hồ sơ chương trình đề nghị giữ: người tổ chức/tài trợ, hình thức pháp lý, thời gian/địa bàn, điều kiện hưởng, hàng được khuyến mại và hàng dùng khuyến mại, căn cứ giá trước chương trình, ngân sách/hạn mức, thủ tục phải làm hoặc lý do miễn, chứng cứ xác nhận nếu cần, phiên bản thể lệ và duyệt kế toán. Kiểm cả hàng bị hạn chế/cấm khuyến mại tại Điều 5 hiện hành; “FMCG” không tự bảo đảm mọi SKU đều được khuyến mại. Miễn thủ tục vẫn phải lưu căn cứ để bảo vệ cách tính VAT.

## 6. Sai sót, trả hàng và lưu trữ hóa đơn

TT91 Điều 10(1) yêu cầu phân loại trước xử lý. Sai tên/địa chỉ/số tiền bằng chữ nhưng không sai MST, số tiền, thuế suất, tiền thuế, hàng hóa thuộc điểm (a): thông báo người mua và cơ quan thuế theo mẫu, không lập lại. Sai nội dung trọng yếu thuộc điểm (b): điều chỉnh hoặc thay thế, tham chiếu hóa đơn cũ; với người mua kinh doanh/tổ chức phải có văn bản thỏa thuận lỗi trước xử lý theo điều kiện điều khoản, trừ ngoại lệ được nêu. Người tiêu dùng cá nhân áp đường thông báo. Riêng hóa đơn **từ máy tính tiền lập sai** thuộc điểm (c) dùng thay thế, không mặc định chọn điều chỉnh như hóa đơn thường. [L02](nguon-phap-ly.md#l02)

Trả hàng là nhánh Điều 10(5)(c), cần chứng từ trả và đối chiếu nghĩa vụ thuế; không đồng nhất với phát hiện hóa đơn nhập sai. Đổi hàng làm thay đổi giá trị nằm trong quy định trả hàng; các ca đổi không đổi giá trị hoặc trả không tìm thấy hóa đơn gốc cần kế toán xác định hồ sơ trước khi tự động hóa. Sau khi đã chọn điều chỉnh/thay thế cho lỗi, lần sửa tiếp áp hình thức lần đầu theo Điều 10(6)(a). Không sửa trực tiếp XML cũ. [L02](nguon-phap-ly.md#l02)

NĐ254 Điều 5 yêu cầu an toàn, toàn vẹn, đầy đủ, không bị thay đổi và lưu theo thời hạn pháp luật kế toán. Đề xuất giữ dữ liệu hóa đơn gốc theo định dạng áp dụng, kết quả mã/ký, bản thể hiện, liên kết chứng từ và nhật ký; chỉ lưu PDF không chứng minh đầy đủ nghĩa vụ. Thời hạn cụ thể theo từng loại hồ sơ phải được kế toán xác nhận, không đặt cùng một thời hạn tùy ý cho hóa đơn, GPS và log. [L01](nguon-phap-ly.md#l01)

## 7. Dữ liệu cá nhân trong PWA và vận hành tenant

### 7.1. Vai trò, mục đích và dữ liệu tối thiểu

Luật91 Điều 2, 37 yêu cầu xác định bên kiểm soát, bên xử lý hoặc bên kiểm soát và xử lý theo hoạt động thực tế. Giả định làm việc: NPP quyết định mục đích dữ liệu khách/nhân viên; SaaS xử lý theo hợp đồng. Với dữ liệu tài khoản/thanh toán phục vụ hoạt động riêng của SaaS, vai trò có thể khác. Cần hợp đồng, luồng dữ liệu và phạm vi ủy quyền trước khi kết luận; mỗi tenant một database không giải quyết thay việc này. [L11](nguon-phap-ly.md#l11)

| Nhóm dữ liệu | Căn cứ cần xác nhận | Đề xuất tối thiểu cho MVP |
|---|---|---|
| Tên/số điện thoại người liên hệ, địa chỉ giao | Dữ liệu cá nhân nếu nhận diện cá nhân; mục đích giao/thu tiền khác quảng cáo. Đ19(1)(d) chỉ áp khi thực sự cần thực hiện thỏa thuận với chủ thể theo luật | Ghi mục đích/nguồn; chỉ cấp người phụ trách; không tự nhập toàn bộ danh bạ điện thoại |
| Nhân viên, phân công, lịch sử tác nghiệp | Đ25 về tuyển dụng/quản lý lao động; giám sát kỹ thuật phải được biết và hợp pháp | Thông báo rõ; quản lý theo vai trò; không dùng dữ liệu công việc cho mục đích mới chưa có căn cứ |
| GPS/check-in gắn cá nhân | Dữ liệu nhạy cảm theo NĐ356 Đ4(1)(h); Luật91 Đ31 yêu cầu điều kiện theo dõi vị trí | Ưu tiên check-in theo sự kiện, không mặc định theo dõi liên tục/ngoài ca; tách đồng ý và cho biết dữ liệu nhạy cảm |
| Chứng từ hóa đơn/thu tiền | Có thể chứa tên, địa chỉ, tài khoản; giữ để thực hiện nghĩa vụ pháp lý với phạm vi phù hợp | Giảm dữ liệu không cần; hạn chế xuất file và hỗ trợ truy cập; lưu/xóa theo loại hồ sơ |
| Ảnh giao nhận/log hỗ trợ | Ảnh có mặt người, số điện thoại, địa chỉ vẫn là dữ liệu cá nhân; ảnh căn cước là dữ liệu nhạy cảm theo NĐ356 Đ4 | Không yêu cầu căn cước/mặt người nếu không cần; che dữ liệu trong ticket và dữ liệu nghiên cứu |

Nguồn: Luật91 Đ3–4, 9, 19, 25, 31 và NĐ356 Đ3–6. [L11](nguon-phap-ly.md#l11), [L12](nguon-phap-ly.md#l12). Đồng ý phải tự nguyện, rõ mục đích, kiểm chứng được; quyền vị trí của trình duyệt không tự thay thông báo và bằng chứng đồng ý hợp pháp. Lưu phiên bản nội dung, chủ thể, thời điểm, mục đích đồng ý/rút lại; không dùng ô tích sẵn hoặc coi im lặng là đồng ý.

### 7.2. Hồ sơ đánh giá, chuyển ra nước ngoài và điều kiện dịch vụ

Luật91 Điều 21 quy định hồ sơ đánh giá tác động xử lý, lưu và gửi trong 60 ngày từ ngày đầu xử lý đối với chủ thể có nghĩa vụ; bên xử lý lập/lưu theo thỏa thuận. Điều 20 và NĐ356 Điều 17–20 quy định chuyển xuyên biên giới, gồm lưu trữ/xử lý trên hạ tầng ngoài Việt Nam. Phải kiểm luồng database, backup, object storage, support, log và analytics. Ngoại lệ hồ sơ chuyển cho việc lưu dữ liệu người lao động của chính tổ chức trên cloud theo Điều 20(6)(b) không miễn mọi nghĩa vụ và không bao phủ dữ liệu khách hàng. [L11](nguon-phap-ly.md#l11), [L12](nguon-phap-ly.md#l12)

Không tự áp miễn trừ vì khách là SME. Luật91 Điều 38 và NĐ356 Điều 41 loại trừ khỏi ưu đãi tương ứng doanh nghiệp kinh doanh dịch vụ xử lý, trực tiếp xử lý dữ liệu nhạy cảm hoặc đạt quy mô tích lũy từ 100.000 chủ thể. Thu GPS khiến điều kiện dữ liệu nhạy cảm phải được rà ngay, dù số nhân viên nhỏ. [L11–L12](nguon-phap-ly.md#l11)

Một vấn đề cần kết luận pháp chế trước pilot thương mại: NĐ356 Điều 21 liệt kê dịch vụ cung cấp/vận hành phần mềm tự động thay mặt bên kiểm soát xử lý dữ liệu, xử lý trực tuyến và nền tảng vị trí; Điều 22–25 quy định điều kiện và giấy chứng nhận. Mô hình SaaS dự kiến có dấu hiệu thuộc phạm vi cần xem xét. Chưa đủ dữ liệu hợp đồng/pháp nhân để khẳng định áp dụng hay miễn; phải xác nhận nghĩa vụ và tình trạng đáp ứng, không mặc nhiên bỏ qua vì gọi sản phẩm là phần mềm quản trị. [L12](nguon-phap-ly.md#l12)

### 7.3. Quyền, lưu giữ và sự cố

Theo NĐ356 Điều 5, phản hồi thủ tục yêu cầu hợp lệ trong **2 ngày làm việc**. Thời hạn thực hiện thông thường khác nhau: xem/sửa/cung cấp 10 ngày; rút đồng ý/hạn chế/phản đối 15 ngày; xóa 20 ngày. Trường hợp phải yêu cầu bên xử lý/bên thứ ba có các mốc 15/20/30 ngày tương ứng; gia hạn một lần theo điều kiện, có thông báo và lý do. Không dùng “72 giờ cho mọi yêu cầu dữ liệu” từ cách hiểu cũ. Thiết kế cần phân loại yêu cầu và lịch xử lý; xóa vẫn phải xét nghĩa vụ pháp lý/ngoại lệ tại Luật91 Điều 14, 19. [L11](nguon-phap-ly.md#l11), [L12](nguon-phap-ly.md#l12)

Đề xuất lịch lưu riêng cho GPS, ảnh, liên hệ, hồ sơ lao động, chứng từ và log; mục đích hoàn thành thì xóa/ẩn danh theo chính sách có căn cứ. Nhân viên nghỉ việc: thu hồi truy cập và xử lý dữ liệu theo Điều 25, không xóa mù chứng từ còn nghĩa vụ lưu. PWA cần xóa cache theo tài khoản/tenant và thu hồi phiên; dữ liệu trên thiết bị mất mạng cần cơ chế hết hạn phù hợp, không hứa có thể xóa từ xa tức thì. Restore backup phải áp lại yêu cầu xóa/hạn chế và quyền mới, tránh phục hồi dữ liệu đã bị loại hợp pháp. Đây là đề xuất vận hành, chưa diễn tập.

NĐ356 Điều 12 yêu cầu hợp đồng cloud rõ luồng/vai trò/bảo mật, quyền dữ liệu và thời hạn; khoản 4 yêu cầu mã hóa khi lưu/truyền, phân quyền chặt. Đề nghị kiểm cả file, job, cache, bản sao, log và truy cập hỗ trợ ngoài database. Sự cố có tiêu chí tại Luật91 Điều 23 phải thông báo cơ quan chuyên trách trong 72 giờ từ phát hiện; bên xử lý thông báo kịp thời bên kiểm soát. Với vi phạm dữ liệu vị trí, NĐ356 Điều 29 còn yêu cầu thông báo chủ thể bị ảnh hưởng không quá 72 giờ, báo cơ quan có thẩm quyền, lưu hồ sơ vi phạm tối thiểu 5 năm từ khắc phục. [L11](nguon-phap-ly.md#l11), [L12](nguon-phap-ly.md#l12)

## 8. Điều kiện chốt đặc tả và bằng chứng cần có

| Người quyết định/kiểm chứng | Kết quả phải có trước pilot liên quan |
|---|---|
| Kế toán NPP + người chịu trách nhiệm kinh doanh | Người bán pháp lý, hợp đồng đại lý/mua bán, phương pháp thuế/đăng ký hóa đơn; mốc chuyển quyền A/B; danh mục thuế SKU và chương trình thật |
| Kế toán + nhà cung cấp hóa đơn + đội kỹ thuật | Chứng minh kênh lập đúng thời điểm khi giao; dữ liệu ký/cấp mã/truyền; phân biệt timeout với chưa phát hành; nhánh lỗi/trả/chiết khấu theo loại hóa đơn |
| Owner vận hành + kế toán | Quy trình B mất mạng, dừng trước giao, xử lý giao/thu đã xảy ra; đầu mối và chứng cứ sự cố; đối chiếu cuối chuyến |
| Pháp chế + người phụ trách dữ liệu | Vai trò/hợp đồng, căn cứ GPS/liên hệ, miễn trừ có áp dụng không, hồ sơ đánh giá/chuyển, điều kiện kinh doanh dịch vụ xử lý, thời hạn lưu và quy trình quyền/sự cố |
| Đội kỹ thuật + vận hành | Bằng chứng thử cách ly, xóa/hạn chế, restore, cache PWA; quyền hỗ trợ và diễn tập thông báo sự cố |

Bộ tình huống nghiệm thu đề nghị: giao đơn 100 đơn vị thành 60/40 tạo hai mốc hóa đơn; bán chịu rồi thu không tạo hóa đơn bán lần hai; chuyển kho lên xe không tăng doanh thu; timeout sau phát hành không tạo trùng; mất mạng trước/sau giao đi đúng hai nhánh; quà hợp pháp và quà thông thường có giá tính thuế đúng căn cứ; trả 2 đơn vị chỉ điều chỉnh phần được chấp nhận; hóa đơn máy tính tiền sai đi nhánh thay thế; rút GPS ngừng mục đích tương ứng; restore không khôi phục quyền hoặc dữ liệu đã bị loại. **Đây là kết quả kỳ vọng để thử, chưa phải biên bản đạt.**

Phần pháp lý của NC-08/NC-09 đã có cơ sở để viết đặc tả có điều kiện; chưa thể đóng hai mục tiêu vì còn thiếu quyết định kế toán/pháp chế theo NPP, hợp đồng nhà cung cấp và bằng chứng kỹ thuật. Giới hạn cập nhật, nguồn chỉ đọc metadata, và nội dung chưa xác minh toàn văn được ghi riêng trong [sổ nguồn](nguon-phap-ly.md).
