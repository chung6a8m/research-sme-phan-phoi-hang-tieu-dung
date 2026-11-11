# R005 — Khoảng trống và mục tiêu nghiên cứu bổ sung để đạt MVP

- Ngày phân tích: **11/11/2026**, múi giờ Asia/Bangkok.
- Repository được phân tích: **chung6a8m/research-sme-phan-phoi-hang-tieu-dung**, nhánh main tại commit **2ce5ff38401fdc30774a6524d95014bd6bb45440**.
- Loại tài liệu: **phân tích tài liệu hiện có và đề xuất chương trình nghiên cứu tiếp theo**.
- Trạng thái: đã rà soát tài liệu và đối chiếu một số nguồn sơ cấp; **các mục tiêu NC-01–NC-10 là đề xuất chưa triển khai và chưa được Owner phê duyệt**. Không phải báo cáo đã phỏng vấn doanh nghiệp, đã thử PWA hay đã nghiệm thu MVP.
- Liên quan: [đề bài B005](../../briefs/2026-11-11-05-nghien-cuu-bo-sung-dat-mvp.md), [nguồn và giới hạn bằng chứng](sources.md).

## 1. Kết luận và đích nghiên cứu

Repo đã đủ để xác định hướng sản phẩm: phục vụ nhà phân phối FMCG, hỗ trợ đặt trước rồi giao (A) và bán theo xe (B), PWA cho nhân viên thị trường, tồn kho, công nợ, hóa đơn điện tử và báo cáo. Khoảng trống chính hiện nay là **quy tắc vận hành chưa khép kín, bằng chứng thực địa chưa có trong repo, và các đề xuất giữa báo cáo chưa thống nhất**.

Đợt nghiên cứu tiếp theo nên tạo đủ cơ sở để trả lời: **một nhà phân phối thuộc phân khúc đầu tiên có thể chạy trọn ngày kinh doanh bằng MVP, đối chiếu được hàng–tiền–công nợ–hóa đơn, và xử lý được các ngoại lệ thường gặp hay chưa?**

Chuỗi cần nghiên cứu bao gồm đưa danh mục và số dư vào hệ thống; nhận hàng bổ sung; phân công điểm bán/viếng thăm; lập đơn A hoặc cấp hàng lên xe B; tính giá và ưu đãi; giao hàng, hàng tặng và trả hàng; ghi nhận tiền/công nợ; bàn giao tiền/hàng; lập hoặc điều chỉnh hóa đơn đúng trường hợp; và đối soát cuối ngày. Tồn đầu kỳ chỉ giúp khởi động; MVP vẫn cần cách ghi nhận nhập hàng để vận hành những ngày tiếp theo.

Đây là **định nghĩa đích MVP được đề xuất**, không tuyên bố sản phẩm đã đạt đích. Cần phân biệt ba kết quả: đủ cơ sở viết đặc tả, đủ điều kiện triển khai pilot, và đã có bằng chứng MVP mang lại giá trị cho đơn vị pilot.

## 2. Nền quyết định phải giữ

### 2.1. Những lựa chọn và yêu cầu đầu vào

| Nội dung | Căn cứ và cách sử dụng |
|---|---|
| Module A — đặt trước rồi giao; Module B — mang hàng theo xe để bán tại điểm | [R002-D01, mục 1–2](../2026-11-11-02-nghiep-vu-mvp-pwa/quyet-dinh-va-thuat-ngu.vi.md) và [R003, Quyết định đã chốt](../2026-11-11-03-deep-research-mvp-kien-truc/report.vi.md). Hai mô hình đều thuộc MVP; A/B không tự đồng nghĩa với hai dịch vụ hoặc hai ứng dụng. |
| PWA cho nhân viên thị trường | [B002, Yêu cầu trực tiếp của chủ dự án](../../briefs/2026-11-11-02-nghiep-vu-mvp-pwa.md). Nghiên cứu cách đáp ứng trong ràng buộc PWA. |
| Xe máy: một nhân viên kiêm giao hàng và lái xe; xe tải có thể cùng người hoặc hai người | R002-D01, mục 1 và 4. Phương tiện không quyết định mô hình bán A/B; chức danh không tự cấp quyền thu tiền/sửa giá. |
| Mỗi tenant một database | R003, Quyết định đã chốt. Đây là quyết định mới hơn đoạn còn để mở trong README/R002-D01 tại baseline. Còn phải đặc tả ánh xạ đơn vị kinh doanh–tenant–bên thuê SaaS và cách vận hành database. |
| Đơn hàng, kho, hóa đơn điện tử, thu tiền/công nợ, báo cáo cơ bản | B002, Phạm vi MVP làm đầu vào. Việc một báo cáo mới không liệt kê lại hóa đơn điện tử không tự loại bỏ hạng mục này. |
| Chuẩn hóa thuật ngữ; làm rõ UoM, giá vốn, công nợ nhân viên, giá/chiết khấu/khuyến mại | R002-D01, R003 và R004 có nội dung tương ứng. Đây là yêu cầu làm rõ nghiệp vụ; việc nêu chủ đề chưa phê duyệt toàn bộ phạm vi tính năng, thuật toán hoặc chính sách chi tiết. |

### 2.2. Những điều chưa được chốt

Chưa có đủ căn cứ để coi các lựa chọn sau là quyết định của Owner: FIFO hay bình quân di động; một tenant có bao nhiêu pháp nhân; mọi đơn bắt buộc có điểm bán; cho phép trả hàng không có đơn gốc; nhiều thiết bị đồng thời bán từ một kho xe; chuyến kết hợp A/B; thứ tự áp giá/chiết khấu/khuyến mại; phạm vi cộng dồn và ngân sách khuyến mại; nhà cung cấp hóa đơn; framework/backend/cloud; số đơn vị và ngưỡng thành công của pilot.

Không lấy quyết định từ một dự án phần mềm khác để điền các khoảng trống của repo nghiên cứu này.

## 3. Đánh giá hiện trạng và các điểm cần giải quyết

| Mã | Bằng chứng trong repo | Tác động tới MVP |
|---|---|---|
| G01 | [R001, mục 14](../2026-11-11-01-tong-quan/report.vi.md) nói rõ chưa có kết quả phỏng vấn. [R002-S](../2026-11-11-02-nghiep-vu-mvp-pwa/sources.md) ghi bản nguồn không có URL, lần nhập không kiểm chứng/phỏng vấn/kiểm thử. | Có định hướng và giả thuyết; chưa có bằng chứng rằng đúng phân khúc đầu tiên sẽ dùng và trả phí. |
| G02 | R003/R004 tồn tại ở baseline nhưng README chưa lập mục lục. README/R002-D01 còn để mở tách database; R003 đã ghi mỗi tenant một database. | Người đọc có thể dùng quyết định cũ hoặc nghiên cứu lại điều đã chốt. Cần mục lục và chỉ dẫn đọc theo thời điểm, giữ nguyên báo cáo lịch sử. |
| G03 | R002-D01 tách Tenant khỏi SaaSSubscriber; R003/R004 có chỗ gọi Tenant là khách thuê SaaS. R004 ERD bắt buộc Outlet cho đơn, trong khi R002-D01 cho phép trường hợp không gắn điểm bán; R004 yêu cầu đơn gốc cho trả hàng, R003 còn để mở chính sách này. | Glossary và cardinality chưa thể chuyển thẳng thành schema. Cần lựa chọn có ví dụ nghiệp vụ, không ghép cơ học các ERD. |
| G04 | R003 xem đơn offline là yêu cầu chờ server xác nhận và có thể tái định giá; Module B trong R002-D01/R004 có hàng đã giao, tiền đã nhận tại điểm. | Với B, từ chối hoặc đổi giá lúc sync không tự giải quyết được sự kiện đã xảy ra. Đây là khoảng trống ảnh hưởng đồng thời nghiệp vụ, trải nghiệm và kiến trúc. |
| G05 | R002-D01 yêu cầu tách trạng thái đơn/giao/thu tiền/hóa đơn; R004 có chuỗi trạng thái tổng quát nhưng thiếu bảng tác động từng sự kiện lên hàng và tiền. | Chưa biết chính xác lúc nào giữ hàng, ghi xuất bán, phát sinh nợ, ghi tiền nhân viên giữ, đảo/điều chỉnh và đóng chuyến. |
| G06 | R003 đề cập engine khuyến mại với cộng dồn, loại trừ, giới hạn và ngân sách; R004 để ngân sách/giới hạn phức tạp sau MVP. | Phạm vi pricing dễ tăng mạnh. Cần chốt tập quy tắc nhỏ dựa trên chương trình thực tế của pilot, vẫn có khuyến mại tự động. |
| G07 | Hóa đơn điện tử có trong B002 và Must-have R002, nhưng không được liệt kê trong đoạn MVP R004. US3 của R002 còn gộp duyệt đơn với sinh hóa đơn. | Cần khôi phục truy vết phạm vi và xác định trigger theo trường hợp pháp lý; không dùng duyệt đơn như trigger mặc định cho mọi giao dịch. |
| G08 | R002 xếp xử lý xung đột PWA hoàn thiện vào Should-have; R002-D01/R003 đã nêu chống lặp và kiểm tra quyền. | Các tình huống có thể gây sai hàng/tiền phải có cách xử lý ngay trong MVP. Chống gửi lặp không giải quyết được hai giao dịch khác nhau cùng dùng một lượng hàng/hạn mức. |
| G09 | R003/R004 có ví dụ UoM, FIFO/bình quân, thu hộ đúng số học nhưng còn mở phương pháp giá vốn, trả hàng, làm tròn và mốc công nợ. | Cần bộ ví dụ liên hoàn có kết quả mong đợi, bao phủ nhập–chuyển–bán–tặng–trả–điều chỉnh; các phép tính đơn lẻ chưa đủ để nghiệm thu. |
| G10 | R002 đề xuất 2–3 “khách hàng đại lý nhỏ”, giảm 30–50% thủ tục và hài lòng ≥80%; R002-D01 đã chỉ ra cần phân biệt đơn vị vận hành pilot và Customer/Outlet. | Chưa rõ ai là người mua SaaS, mẫu đo, số liệu trước pilot, mẫu số và thời gian đo. Đây là mục tiêu giả định, chưa phải kết quả hay ngưỡng đã duyệt. |

R004 cũng chưa biểu diễn đầy đủ Trip, điểm dừng và dòng giao nhận, dù R002-D01 đã yêu cầu một chuyến nhiều điểm dừng và một đơn có thể giao qua nhiều chuyến. Đây là việc cần hoàn thiện mô hình khái niệm theo kịch bản, chưa phải kết luận phải tạo một bảng SQL cho mọi khái niệm.

**Đánh giá:** tài liệu đủ để tổ chức đợt xác minh có trọng tâm. Chưa có căn cứ định lượng “đã hoàn thành bao nhiêu phần trăm MVP” hoặc cam kết hoàn thành trong 0–3 tháng.

## 4. Mười mục tiêu nghiên cứu bổ sung

P0 dưới đây là vấn đề cần giải quyết trước khi khóa đặc tả phần lõi chịu ảnh hưởng. P1 là nội dung phải được thiết kế sớm và chứng minh trước pilot. Ký hiệu này là **đề xuất ưu tiên nghiên cứu**, không phải severity của lỗi phần mềm.

### NC-01 — Chọn phân khúc đầu tiên và đơn vị vận hành pilot

**Mục tiêu:** xác định MVP phục vụ ai, thay công việc nào và giá trị nào đáng trả phí. Ưu tiên P0.

Khảo sát nhà phân phối mua hàng để bán lại, ngành hàng cụ thể, lô/hạn dùng, số kho/xe/nhân viên, số đơn và dòng đơn/ngày, số SKU/UoM, mức độ bán chịu, chương trình khuyến mại, thời gian mất mạng và phần mềm kế toán/hóa đơn đang dùng. Tách người quyết định mua SaaS, người vận hành và khách hàng mua hàng của NPP. Làm rõ “đại lý” là cách gọi thương mại hay quan hệ bán hộ/ký gửi có quyền sở hữu khác.

Đề xuất bắt đầu bằng **3–5 đơn vị NPP để khám phá định tính**, có đại diện A và B; lựa chọn **2–3 đơn vị vận hành pilot** sau khi xác định độ phù hợp và khả năng tham gia. Đây là cỡ mẫu làm việc đề xuất, không đại diện thống kê và chưa phải danh sách đã tuyển. Nếu nguồn lực chỉ đủ một đơn vị, phải ghi rõ độ bao phủ A/B và phần chưa kiểm chứng.

**Bằng chứng/đầu ra:** hồ sơ phân khúc; ma trận chọn pilot; ghi chép phỏng vấn theo vai trò; mẫu chứng từ được phép sử dụng và đã loại dữ liệu nhận diện; số liệu hiện tại về nhập lại đơn, sai giá, chốt chuyến và thu tiền; ba vấn đề ưu tiên; nhu cầu mua và chi phí triển khai sơ bộ.

**Đủ khi:** xác định được đơn vị vận hành, người quyết định, người dùng, quy trình chính, lý do thay đổi và người đối chiếu nghiệp vụ. “Có 2–3 điểm bán dùng thử” không thay thế việc có NPP thực sự quản lý hàng và tiền trong pilot.

### NC-02 — Thống nhất thuật ngữ, ranh giới dữ liệu và trách nhiệm

**Mục tiêu:** có một mô hình nghiệp vụ thống nhất để viết UI, API và chứng từ. Ưu tiên P0.

Chốt Customer là bên mua/chịu công nợ; Outlet là điểm hoạt động/giao nhận; địa chỉ xuất hóa đơn và địa chỉ nhận là các thông tin theo mục đích; Dealer/Distributor là vai trò thương mại. Đối chiếu Tenant, đơn vị kinh doanh và bên thuê SaaS; quyết định rõ số đơn vị/pháp nhân trong một tenant của MVP, trong khi vẫn giữ mỗi tenant một database.

Giải quyết các cardinality khác nhau giữa R002-D01/R004: đơn không có Outlet; một Customer nhiều Outlet; Outlet đổi chủ; trả hàng không có chứng từ gốc; một đơn nhiều lần giao. Phân biệt tuyến kế hoạch, chuyến thực tế, điểm dừng, lần giao và dòng giao.

Lập ma trận người bán–giao–lái–thu–nhận tiền–đối soát; tách nhân viên, tài khoản đăng nhập và quyền thao tác. Xe máy kiêm giao/lái và xe tải có thể hai người là ràng buộc đầu vào đã chốt, không đặt lại thành câu hỏi khảo sát.

**Bằng chứng/đầu ra:** glossary chuẩn; ERD khái niệm có mô tả quan hệ; ma trận quyền theo hành động/phạm vi; ví dụ một khách ba điểm bán, đổi chủ điểm bán, NPP cấp dưới cũng thuê SaaS, đổi người giữa chuyến.

**Đủ khi:** mọi màn hình và chứng từ trong hai luồng dùng cùng nghĩa; bên chịu nợ, bên xuất hóa đơn, nơi nhận, người giữ hàng/tiền và phạm vi dữ liệu đều xác định được. Những lựa chọn còn mở được ghi riêng, không ẩn trong sơ đồ.

### NC-03 — Khép kín quy trình A/B và danh mục ngoại lệ

**Mục tiêu:** mô tả trọn một ngày hoạt động với đầu vào, bước bàn giao, tác động lên sổ và cách sửa sai. Ưu tiên P0.

Theo dõi ít nhất một chu trình A và một chuyến B thực tế từ chuẩn bị tới đối soát. Với A: nhận/duyệt/giữ hàng, chia chuyến, giao từng phần, từ chối, thu ngay hoặc bán chịu, giao tiếp phần còn lại. Với B: cấp hàng, bán/tặng/trả tại điểm, cấp bổ sung, kiểm đếm, trả kho hoặc chuyển số dư sang chuyến sau. Làm rõ chuyến có kết hợp giao đơn A và bán thêm B hay không; nếu có phải phân biệt hàng đã phân đơn với lượng được bán tự do.

Cho mỗi sự kiện, ghi ai được làm, điều kiện trước, trạng thái sau, số lượng/giá trị bị tác động, chứng từ nguồn, khả năng offline và thao tác đảo/điều chỉnh. Trạng thái đơn, giao, tồn, công nợ, thu tiền và hóa đơn phải có quan hệ rõ; không cần ép chúng về một trạng thái “completed”.

**Bằng chứng/đầu ra:** sơ đồ nghiệp vụ A/B; bảng chuyển trạng thái; ma trận sự kiện–chứng từ–sổ; danh mục ngoại lệ có người xử lý; danh sách báo cáo cuối chuyến.

**Đủ khi:** có thể diễn lại A/B cùng giao thiếu, hủy sau khi soạn, trả hàng, đổi người/xe, chênh lệch tiền/hàng và lệnh sync muộn mà không cần quyết định ngầm. Hàng điều chuyển lên xe chưa bị tính là đã bán và không bị trừ kho nguồn hai lần.

### NC-04 — Khóa UoM, tồn kho và phương pháp giá vốn

**Mục tiêu:** số lượng và giá trị hàng có thể đối chiếu từ chứng từ đến báo cáo. Ưu tiên P0.

Thu danh mục SKU thực, mã vạch nếu cần, thùng/lốc/chai hoặc kg/gói, hệ số quy đổi, độ chính xác, giá theo UoM và các trường hợp thay quy cách. Chốt snapshot quy đổi trên chứng từ; không mặc định giá thùng bằng số chai nhân giá chai. Xác định nhu cầu lô/hạn dùng và hàng cách ly ngay theo ngành hàng pilot; không mặc định đây là tính năng nâng cao được bỏ sau.

So sánh FIFO và bình quân di động bằng dữ liệu của pilot rồi chọn một phương pháp cho phạm vi MVP; ghi quy tắc áp dụng theo doanh nghiệp/kho/SKU. Phân biệt phương pháp giá vốn với cách chọn hàng xuất thực tế theo hạn dùng. Làm rõ số dư đầu kỳ, nhập bổ sung, phí mua/chiết khấu nhập, điều chuyển, hàng tặng, hàng hỏng, trả có/không đơn gốc, làm tròn, khóa kỳ và lệnh gửi muộn. Tách tồn thực có, tồn đã giữ, tồn khả dụng và hàng đang giao/cách ly theo nhu cầu thực tế.

**Bằng chứng/đầu ra:** quyết định phương pháp và giới hạn; quy tắc UoM/sổ tồn; bộ dữ liệu tính tay; các ví dụ mở kỳ–nhập–bán–trả–đóng kỳ. Không triển khai cả hai engine giá vốn chỉ để tránh lựa chọn.

**Đủ khi:** từ cùng đầu vào, kế toán và người triển khai tính ra cùng số lượng/giá trị; chuyển kho không tự sinh lãi/lỗ; giá trị tồn về 0 được xử lý có quy tắc; dữ liệu gửi muộn không sửa âm thầm kỳ đã khóa.

### NC-05 — Chốt bảng giá, chiết khấu và khuyến mại tự động tối thiểu

**Mục tiêu:** mọi dòng bán và hàng tặng đều giải thích được giá và ưu đãi đã áp dụng. Ưu tiên P0.

Thu các bảng giá và chương trình thực của pilot để quyết định mức cần hỗ trợ: giá theo khách/nhóm/kênh/UoM; thời gian hiệu lực; giá đã gồm thuế hay chưa; quyền sửa giá; chiết khấu dòng và toàn đơn; mua X tặng Y; giảm phần trăm hoặc số tiền. Chốt thứ tự áp dụng, cộng dồn/loại trừ, làm tròn và phân bổ giảm giá xuống dòng khi cần trả một phần.

Nghiên cứu điều kiện chương trình theo số lượng quy đổi, theo dòng hay toàn đơn, nhiều SKU, quà hết hàng, trả bớt hàng làm mất điều kiện, thay đổi giá trong lúc offline và nguồn tài trợ khuyến mại nếu ảnh hưởng đối soát. Tách snapshot lúc tạo đơn, cam kết lúc xác nhận/giao và kết quả server; việc tính lại không được âm thầm thay số tiền của giao dịch B đã hoàn tất tại điểm.

Đề xuất khởi đầu bằng tập quy tắc nhỏ có tự động tính/thêm quà và giải thích kết quả; ngân sách toàn hệ thống, tích điểm và engine cấu hình tổng quát chỉ vào MVP khi là điều kiện bắt buộc của pilot. Đây là đề xuất giới hạn độ phức tạp, chưa phải quyết định loại tính năng.

**Bằng chứng/đầu ra:** bảng quyết định pricing; các loại chương trình MVP; ma trận cộng dồn; ví dụ có số liệu, gồm mua 9/10/20 và các biến thể UoM/giao thiếu/trả bớt/giá đổi.

**Đủ khi:** cùng dữ liệu và phiên bản chính sách cho cùng kết quả; từng ưu đãi có lý do; truy ra được phân bổ trên dòng bán, quà, tiền thu và giá trị hàng trả. Không còn quy tắc phụ thuộc tùy ý vào thứ tự người dùng thêm dòng.

### NC-06 — Khép kín công nợ, thu hộ và tạm ứng nhân viên

**Mục tiêu:** phân biệt khách đang nợ, nhân viên đang giữ tiền và khoản nhân viên phải quyết toán. Ưu tiên P0.

Chốt thời điểm ghi khoản phải thu, hạn thanh toán và hạn mức; các khoản đã giữ theo đơn có tính vào hạn mức không; thu trước/thu một phần; một lần thu trả nhiều đơn; một đơn được thu nhiều lần; chuyển khoản trực tiếp; khách trả hàng sau khi đã thanh toán; hoàn tiền hoặc cấn trừ. Xác định bước xác thực khoản thu và trách nhiệm khi có tranh chấp.

Với nhân viên: tách tiền thu hộ, tiền nộp quỹ/ngân hàng, tiền bàn giao cho đồng nghiệp, tạm ứng, chi phí được phép quyết toán, thiếu/thừa tiền và khoản bồi hoàn sau khi được xác định. Không tự bù trừ hoặc kết luận mọi chênh lệch là nợ phải thu của nhân viên.

**Bằng chứng/đầu ra:** mô hình tách ba loại số dư và cách liên kết; quy tắc phân bổ thanh toán; biểu mẫu bàn giao/đối soát; dữ liệu cuối ngày có kết quả tính tay. Phải thu khách và tiền thu hộ thuộc vòng đối soát lõi. Nghiên cứu phải đưa ra quyết định phạm vi tạm ứng/hoàn ứng; chỉ xây phần này trong MVP ở mức đã được xác nhận, không tự mở rộng thành phân hệ quyết toán chi phí đầy đủ.

**Đủ khi:** ví dụ giao 1.000.000 đồng, thu tiền mặt 600.000 đồng thể hiện khách còn nợ 400.000 đồng và nhân viên giữ 600.000 đồng. Khi nộp quỹ, tiền nhân viên giữ giảm nhưng nợ khách không giảm thêm lần nữa. Bán chịu, khách chuyển khoản thẳng và hoàn tiền không bị gộp thành doanh số bằng tiền nhân viên phải nộp.

### NC-07 — Xác minh PWA và thiết kế quyền giao dịch khi offline

**Mục tiêu:** PWA hỗ trợ được A/B trong điều kiện mất mạng đã xác định, với trạng thái rõ và số liệu đối soát được. Ưu tiên P0; thử nghiệm thiết bị trước khi chốt cam kết khả năng offline.

Lập ma trận từng thao tác: chỉ xem dữ liệu, lưu nháp, nhận đơn chờ xác nhận, giao hàng/thu tiền theo quyền đã cấp trước, hoặc bắt buộc online. Chốt thời gian offline, số danh mục/ảnh/lệnh cần lưu, số thiết bị trên chuyến, phiên bản danh mục/giá, phạm vi tồn/hạn mức được sử dụng và cách phát hiện dữ liệu cũ.

**Phân biệt trọng yếu:** A offline có thể ghi yêu cầu chưa cam kết giao hàng; B có thể đã thực hiện giao hàng/nhận tiền. Với B, phải bảo toàn sự kiện thực tế, xác định quyền giao dịch trước chuyến và luồng xử lý ngoại lệ; phản hồi rejected/conflict đơn thuần chưa đủ.

Giả thuyết thiết kế nên kiểm chứng sớm: một thiết bị ghi chính cho một kho xe/chuyến, hàng cấp rõ ràng, bộ giá/khuyến mại có phiên bản và thời hạn. Đây chưa là quyết định đã chốt. Một thiết bị không tự giải quyết hạn mức khách hàng dùng ở nhiều chuyến; cần phân bổ quyền/hạn mức trước hoặc yêu cầu online cho phần vượt quyền. Nếu pilot bắt buộc nhiều thiết bị bán đồng thời, nghiên cứu phân chia quyền sử dụng hàng thay vì chỉ kiểm tra tồn khi sync.

Nguồn MDN xác nhận Background Sync có độ phủ trình duyệt hạn chế; tài liệu WebKit/MDN mô tả quota và nguy cơ mất dữ liệu lưu trữ web [T01–T03](sources.md). Vì vậy phải kiểm chứng trên thiết bị thực, hỗ trợ đồng bộ khi mở app/thao tác chủ động và hiển thị số lệnh chưa lên server. Chuyển từ PWA cài đặt sang tab web không tự cứu giao dịch đã mất trong dữ liệu cục bộ.

**Bằng chứng/đầu ra:** ma trận thao tác/thiết bị; đặc tả outbox và phản hồi; quy tắc idempotency/version; thiết kế xử lý xung đột; kết quả spike có log và phiên bản thiết bị/trình duyệt.

**Đủ khi:** minh họa được mất phản hồi sau khi server đã ghi, gửi lặp, lệnh sai thứ tự, hai lệnh khác nhau tranh tồn/tín dụng, đóng app/mở lại, đầy hoặc mất lưu trữ, hết phiên/thu hồi quyền, đổi tenant, đổi thiết bị và đóng chuyến khi còn lệnh chưa gửi. Không tuyên bố bảo đảm khôi phục mọi giao dịch chưa đồng bộ nếu thiết bị hoặc toàn bộ dữ liệu cục bộ đã mất.

### NC-08 — Xác minh hóa đơn, thuế/khuyến mại và ranh giới tích hợp

**Mục tiêu:** biết rõ MVP phát sinh chứng từ gì, lúc nào và qua hệ thống nào cho đối tượng pilot. Ưu tiên P0 với thiết kế nghiệp vụ; tích hợp và quy trình vận hành phải đạt trước pilot thật.

Hóa đơn điện tử vẫn thuộc phạm vi đã chọn. Chọn một nhà cung cấp phù hợp dữ liệu và nghiệp vụ của pilot để khảo sát tài liệu/API và môi trường thử. Xác định dữ liệu bên mua, loại hóa đơn, thời điểm lập, ký/phát hành, trả kết quả, tra cứu, điều chỉnh/thay thế, giao từng phần, hàng tặng, chiết khấu, trả hàng và sự cố kết nối. Phân biệt biên nhận/giao nhận tại điểm với hóa đơn pháp lý.

Đối chiếu trường hợp thực tế với điều/khoản, ngày hiệu lực và văn bản hướng dẫn. Ngày 11/11/2026 đã kiểm tra hồ sơ chính thức của **Nghị định 254/2026/NĐ-CP** và **Thông tư 91/2026/TT-BTC**, cùng ghi hiệu lực từ 01/07/2026 [L01–L02](sources.md). Đây mới là xác nhận văn bản và mốc hiệu lực, chưa phải kiểm chứng đầy đủ cách áp dụng. Nghiên cứu phải khóa quy tắc cụ thể; không dùng nhãn “VAT 0% cho mọi hàng tặng” hoặc “duyệt đơn là phát hành hóa đơn” làm mặc định.

Phân biệt phần DMS lưu sổ vận hành với phần mềm kế toán giữ sổ kế toán; xác định hệ thống nào làm nguồn cho giá vốn, công nợ, hóa đơn và cách đối chiếu. Quyết định mức xuất/nhập dữ liệu kế toán tối thiểu, chưa tự mở rộng thành thay thế toàn bộ ERP.

**Bằng chứng/đầu ra:** ma trận tình huống–quy định–trường dữ liệu–hành vi; nguồn điều/khoản; hợp đồng tích hợp; mẫu chứng từ đã đối chiếu với kế toán; kết quả thử tạo/tra cứu/xử lý sai và khôi phục khi nhà cung cấp không trả phản hồi.

**Đủ khi:** xác định được người chịu trách nhiệm và cách xử lý các trường hợp của pilot; gửi lại yêu cầu không phát hành trùng; sự cố nhà cung cấp và giao dịch B offline có quy trình đáp ứng thời điểm chứng từ. Sandbox thành công không tự chứng minh quy trình vận hành hợp pháp.

### NC-09 — Chứng minh vận hành SaaS với mỗi tenant một database

**Mục tiêu:** tenant hoạt động độc lập, dữ liệu đúng phạm vi và khôi phục được theo nhu cầu pilot. Thiết kế P0; bằng chứng vận hành P1 trước pilot.

Giữ quyết định tenant-per-database. Nghiên cứu khởi tạo tenant, định tuyến từ danh tính đã xác thực, người có nhiều tenant, quản lý quyền, migration nhiều database, lỗi nâng cấp giữa chừng, backup/restore từng tenant, ngừng/xuất dữ liệu và hỗ trợ vận hành. Xác định mục tiêu mất dữ liệu cho phép và thời gian phục hồi bằng nhu cầu thực tế thay vì tự đặt con số. Khung câu hỏi về vòng đời dữ liệu tham khảo [T04](sources.md).

Cách ly còn bao gồm file/ảnh, cache, job nền, log, export, đường dẫn tải xuống và dữ liệu PWA. Cần biết quyền nhân viên hỗ trợ được cấp ra sao và hành động hỗ trợ được lưu vết thế nào. Khôi phục database phải xem xét lệnh trên thiết bị và hóa đơn/thanh toán đã đi ra hệ thống ngoài, tránh tái xử lý sự kiện đã thực hiện.

Lập danh mục dữ liệu cá nhân thực sự thu thập, mục đích, người được xem, thời gian giữ, xử lý mất máy và yêu cầu của chủ thể dữ liệu. Hồ sơ chính thức Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 ghi hiệu lực 01/01/2026 [L03](sources.md); việc xác định nghĩa vụ áp dụng và văn bản hướng dẫn là công việc phải thực hiện tiếp, không suy từ tên luật sang một yêu cầu lưu trữ cố định.

**Bằng chứng/đầu ra:** quyết định kiến trúc vận hành nhỏ gọn; mô hình quyền; runbook tạo/nâng cấp/khôi phục/xuất dữ liệu; dữ liệu phân loại và truy cập; ước tính chi phí mỗi tenant gồm DB, backup, file, hóa đơn và hỗ trợ.

**Đủ khi:** có bài diễn tập hai tenant với mã danh mục giống nhau, người dùng đổi tenant, file/job đúng phạm vi, migration thất bại có cách xử lý, khôi phục riêng một tenant và đối chiếu giao dịch đã đồng bộ. Không cần dựng Kubernetes hoặc nhiều microservice để hoàn thành nghiên cứu này.

### NC-10 — Xác minh khả năng đưa vào sử dụng và giá trị pilot

**Mục tiêu:** người dùng có thể bắt đầu làm việc, xử lý lỗi và đo được lợi ích. Thiết kế P0/P1; chứng minh trong pilot.

Nghiên cứu đưa Excel danh mục, UoM, Customer/Outlet, tồn và công nợ đầu kỳ vào hệ thống; kiểm tra trùng/sai, xem thử trước ghi nhận, đối chiếu sau nhập và sửa lỗi có truy vết. Chốt thời điểm chuyển sang hệ thống mới, cách kết thúc việc ghi song song và trách nhiệm hỗ trợ. Quyết định chốt sạch trước chuyển đổi hay nhập có kiểm soát các đơn/chuyến đang dở, hàng trên xe, tiền đã thu chưa nộp và tham chiếu hóa đơn; có tổng đối chiếu và người xác nhận để tránh ghi lại hàng, nợ hoặc tiền đã phát sinh.

Thử quy trình giao diện với sales, kho/kế toán và nhân viên giao: tìm mặt hàng theo mã/tên, đổi UoM, nhìn thấy hàng tặng/tổng tiền, lưu đơn, hiểu “đã lưu trên máy” và “server đã nhận”, tìm lệnh lỗi, nộp tiền và đóng chuyến. Chứng từ in/chia sẻ, camera, định vị tại lượt viếng thăm và quan sát hàng tại điểm chỉ đặc tả theo nhu cầu đã quan sát; không biến quan sát tồn tại Outlet thành tồn sở hữu của NPP.

Định nghĩa công thức báo cáo: doanh số đặt, đã giao, doanh thu thuần, hàng tặng/trả, tồn xe/kho, tuổi nợ tính từ hạn nào, tiền nhân viên giữ và số giao dịch chưa đồng bộ. Mỗi tổng hợp phải truy được chứng từ; dữ liệu chưa đồng bộ cần được thể hiện khi đọc báo cáo.

**Bằng chứng/đầu ra:** mẫu import; checklist chuyển đổi; prototype và ghi chép thử theo tác vụ; tài liệu hướng dẫn ngắn; baseline trước pilot; bảng KPI có công thức/mẫu số/thời gian đo; phản hồi người quyết định mua và chi phí phục vụ.

**Đủ để chốt kế hoạch trước pilot khi:** có mẫu import và quy trình đối chiếu số dư; người dùng đã thử tác vụ trên prototype; có baseline, công thức KPI, ngưỡng cần thống nhất, kế hoạch đào tạo/hỗ trợ và người đánh giá.

**Phần đánh giá sau khi triển khai pilot:** người dùng hoàn thành tác vụ cốt lõi theo ngưỡng đã thống nhất; một ngày A/B chốt được hàng–tiền–nợ; có số liệu trước/sau và quyết định tiếp tục sử dụng. Phần này nằm ngoài đợt khám phá để chốt đặc tả. Có thể lấy giảm 30% thời gian xử lý/đối soát làm giả thuyết ban đầu để kiểm chứng, nhưng không ghi là cam kết hay tiêu chí Owner đã duyệt. Với mẫu nhỏ, báo cáo cả số người/tác vụ thực tế thay vì chỉ tỷ lệ phần trăm.

## 5. Phương pháp và thứ tự thực hiện đề xuất

### 5.1. Ba loại bằng chứng cần kết hợp

| Cách làm | Trả lời được | Không thay thế được |
|---|---|---|
| Đọc tài liệu nhà cung cấp, API chính thức, tiêu chuẩn và văn bản pháp luật | Khả năng tích hợp, giới hạn công nghệ, yêu cầu có nguồn; tham khảo cách hệ thống khác biểu diễn nghiệp vụ | Mức phổ biến và mức sẵn sàng chi trả của NPP mục tiêu |
| Phỏng vấn có tình huống, quan sát kho/chuyến, đối chiếu chứng từ và số liệu | Quy trình thật, ngoại lệ, trách nhiệm, thời gian xử lý và nhu cầu của phân khúc | Độ ổn định của PWA trên thiết bị hoặc tính đúng của engine chưa thử |
| Prototype, tính tay, spike PWA/tích hợp/khôi phục | Hành vi có thể quan sát, số liệu tái lập, giới hạn và rủi ro triển khai | Kết quả kinh doanh của pilot thực tế |

Một cuộc phỏng vấn nên đi theo một đơn hoặc chuyến gần đây: xem chứng từ gốc và cách xử lý lỗi; tránh chỉ hỏi người được phỏng vấn có thích danh sách tính năng không. Thu cả trường hợp không thành công. Không gửi dữ liệu nhận diện hoặc dữ liệu thương mại nhạy cảm vào repo công khai.

### 5.2. Bốn đợt có đầu ra rõ

| Đợt | Nội dung | Điều kiện kết thúc |
|---|---|---|
| 1. Xác lập nền quyết định | Hợp nhất chỉ dẫn đọc tài liệu, NC-01/02; nhận mẫu chứng từ, quy mô và thiết bị | Phân khúc, người tham gia, phần đã chốt/phần mở, glossary làm việc và phạm vi pilot có nguồn |
| 2. Khóa quy tắc hàng–tiền | NC-03/04/05/06, đồng thời NC-08 về các mốc hóa đơn | Quy trình A/B, số liệu mẫu, ma trận ghi sổ và tập quy tắc MVP không còn mâu thuẫn trọng yếu |
| 3. Thử các rủi ro khó đảo ngược | NC-07; tích hợp NC-08; vận hành NC-09; thử tác vụ NC-10 | Có bằng chứng cho B offline, chống lặp, tình huống sai/thiếu dữ liệu, hóa đơn và phục hồi |
| 4. Chốt đặc tả và kế hoạch pilot | Hợp nhất kết quả thành đặc tả, backlog có tiêu chí, kế hoạch nhập liệu/đào tạo/đo | Owner quyết định phạm vi; mỗi yêu cầu truy được nguồn, ví dụ và ca nghiệm thu; lịch pilot phù hợp nguồn lực |

Có thể chạy song song việc khảo sát API/thiết bị với thu thập chứng từ. Chỉ chốt logic đồng bộ và sổ sau khi thống nhất sự kiện nghiệp vụ. Bốn đợt trên phục vụ chốt đặc tả và kế hoạch pilot; việc đo kết quả sử dụng/trả phí của NC-10 tiếp tục sau khi có sản phẩm và triển khai pilot. Nếu chưa tiếp cận được NPP, vẫn hoàn thành được chuẩn hóa tài liệu, danh sách giả thuyết, khảo sát nguồn và thiết kế thử; các kết luận thực địa phải giữ trạng thái chưa xác minh.

Đề xuất bố trí một đợt khám phá ngắn khoảng **2–3 tuần làm việc** nếu đã có đơn vị tham gia, người phụ trách kế toán và thiết bị/API thử. Đây là giả định tổ chức; không bao gồm thời gian chờ tuyển pilot, thủ tục nhà cung cấp, phát triển sản phẩm hoặc thời gian pilot. Nên dừng mỗi nhánh nghiên cứu khi đã đủ trả lời quyết định của nó, tránh mở rộng thành khảo sát toàn ngành.

## 6. Phạm vi tối thiểu và cách kiểm soát mở rộng

### 6.1. Nội dung phải có đường xử lý trong MVP đề xuất

- Danh mục và số dư đầu kỳ, nhập hàng bổ sung, UoM, Customer/Outlet, kho và xe.
- Hai luồng A/B, phân công và danh sách điểm bán; ghi nhận viếng thăm/tình trạng hàng/yêu cầu trả theo phạm vi B002.
- Giá, chiết khấu và khuyến mại tự động trong tập quy tắc đã được chọn.
- Xuất/điều chuyển/giao thiếu/trả/cách ly/điều chỉnh có truy vết; phương pháp giá vốn đã quyết định.
- Công nợ khách, thu tiền, tiền nhân viên giữ và bàn giao/đối soát. Chức năng tạm ứng/hoàn ứng theo mức được khảo sát và Owner xác nhận; mô hình phải phân biệt khoản này với tiền thu hộ ngay cả khi chưa đưa cả quy trình vào MVP.
- Hóa đơn điện tử theo phạm vi đã chọn; báo cáo cơ bản truy được chứng từ.
- PWA với khả năng offline/sync và xử lý ngoại lệ được mô tả trung thực; mỗi tenant một database, quyền truy cập, backup/restore và hỗ trợ pilot.

### 6.2. Nội dung chưa có lý do ưu tiên trước MVP

Đề xuất để sau, trừ khi bằng chứng pilot cho thấy là điều kiện bắt buộc: AI/dự báo; tối ưu tuyến tự động; theo dõi GPS liên tục nền; CRM/telesales riêng; cổng Customer tự đặt; tự động đọc Zalo; tích hợp nhiều ERP/sàn/thanh toán; kế toán tổng hợp đầy đủ; loyalty; ngân sách/cộng dồn khuyến mại tổng quát; hợp nhất nhiều pháp nhân; hệ thống báo cáo tùy biến sâu.

Nhập đơn nhận qua điện thoại/Zalo vẫn có thể thuộc A mà chưa cần tích hợp Zalo. Tối ưu tuyến để sau không có nghĩa bỏ danh sách điểm bán được phân công. Khuyến mại nâng cao để sau không có nghĩa bỏ tự động tính/thêm quà. Lô/hạn dùng và chứng từ pháp lý phải quyết định theo ngành hàng/giao dịch, không xếp sau chỉ vì có vẻ phức tạp.

## 7. Bộ tình huống xuyên suốt để kiểm tra kết quả nghiên cứu

Đây là **đề xuất bài kiểm tra đặc tả và pilot tương lai**, chưa được chạy trên sản phẩm.

| Mã | Tình huống | Kết quả phải giải thích/tái lập được |
|---|---|---|
| E2E-01 | Một Customer có ba Outlet; A giao hai lần, xe tải hai người | Đúng bên nợ, đúng nơi nhận, truy từng dòng giao và người thực hiện; không nhân đôi đơn hay khoản phải thu |
| E2E-02 | B nhận 100 đơn vị gốc, bán 60, tặng 5, trả kho 35 | Tồn xe bằng 0; điều chuyển không tạo doanh thu; hàng tặng có phát sinh tồn và xử lý giá trị theo chính sách |
| E2E-03 | B giao 1.000.000 đồng, thu 600.000 đồng, nộp quỹ sau | Khách còn nợ 400.000 đồng; tiền đang giữ chuyển từ nhân viên về quỹ; không ghi thêm khoản thanh toán cho khách |
| E2E-04 | Một thùng 12 chai, một lốc 6 chai; mua bằng nhiều UoM, giá thùng riêng | Số lượng quy đổi đúng; giá, khuyến mại và làm tròn theo quy tắc; đổi quy cách sau không sửa chứng từ cũ |
| E2E-05 | Hai lần nhập khác giá, xuất, chuyển xe, tặng, trả và về tồn 0 | Phương pháp đã chọn cho cùng giá vốn/số dư khi tính tay và chạy hệ thống; phí mua/làm tròn được giải thích |
| E2E-06 | Đơn có chiết khấu/quà, giao thiếu rồi trả bớt hàng | Tiền hoàn/cấn trừ, giá trị hàng, quà và hóa đơn xử lý theo chính sách thống nhất |
| E2E-07 | Server ghi thành công nhưng mất phản hồi; gửi lại cùng lệnh | Một hiệu ứng nghiệp vụ; trả đúng kết quả cũ; cùng ID khác nội dung được báo xung đột |
| E2E-08 | Hai lệnh khác nhau dùng cùng hàng xe hoặc hạn mức khách | Có cơ chế quyền/phân bổ/kiểm tra thích hợp; không coi idempotency là giải pháp cho cạnh tranh tài nguyên |
| E2E-09 | B đã giao/thu offline, sau đó giá đổi hoặc người dùng bị thu hồi quyền | Bảo toàn sự kiện và trách nhiệm; có người xử lý ngoại lệ, không tự xóa lịch sử hoặc âm thầm đổi số tiền |
| E2E-10 | Đóng chuyến trong khi một máy mất mạng hoặc có lệnh chưa gửi | Cách xác nhận đủ dữ liệu và xử lý thiếu máy được mô tả; trạng thái “không có lệnh trên server” không tự chứng minh máy đã gửi hết |
| E2E-11 | Hóa đơn đã được nhà cung cấp nhận nhưng mất phản hồi | Tra cứu/đối chiếu trước khi phát hành lại; không tạo trùng; giữ liên kết nghiệp vụ và trạng thái ngoài hệ thống |
| E2E-12 | Đổi tenant; sau đó khôi phục riêng DB tenant cũ và sync lại | Đúng phạm vi dữ liệu; các tác động ngoài DB và lệnh đã xử lý được đối chiếu; không làm lại giao dịch đã hoàn tất |

Các ví dụ số lượng, số tiền và cỡ mẫu trong R005 là minh họa/đề xuất, không phải dữ liệu doanh nghiệp đã khảo sát.

## 8. Khi nào coi là đủ để chuyển bước?

### 8.1. Đủ cơ sở triển khai

Có phạm vi MVP được Owner quyết định; glossary và mô hình không mâu thuẫn; ma trận ghi sổ A/B; UoM/giá vốn/pricing/công nợ có ví dụ; hợp đồng xử lý offline và mốc hóa đơn; yêu cầu vận hành tenant; các giới hạn và ngoại lệ được ghi rõ; backlog có nguồn và tiêu chí nghiệm thu. Những chính sách làm thay đổi schema hoặc tiền/tồn không được để người viết code tự suy.

### 8.2. Đủ điều kiện chạy pilot thật

Có kết quả thử trên thiết bị và tích hợp đã chọn; đối chiếu dữ liệu mở đầu; tài khoản/quyền; quy trình backup/restore; hướng dẫn/hỗ trợ; cách xử lý giao dịch offline và lỗi hóa đơn; ngưỡng dữ liệu/hiệu năng theo quy mô khảo sát; người chịu trách nhiệm đối soát. Không coi một bản demo chạy đường thuận lợi là đã đạt điều kiện này.

### 8.3. MVP tạo được giá trị được kiểm chứng

Đơn vị vận hành xử lý được phạm vi đơn/chuyến đã thống nhất bằng A/B; các ca kiểm tra trọng yếu không ghi trùng hay để chênh lệch hàng/tiền không giải thích được; có đo thời gian/tỷ lệ thao tác trước–sau với mẫu số rõ; người dùng hiểu trạng thái đồng bộ; người quyết định mua có quyết định tiếp tục hoặc trả phí với điều kiện cụ thể. Mọi ngoại lệ chấp nhận phải được ghi rõ phạm vi/người quyết định, không được trình bày thành kết quả đã kiểm chứng.

## 9. Bộ đầu ra cần có sau nghiên cứu bổ sung

1. Hồ sơ phân khúc và pilot, chứng từ đã loại dữ liệu nhận diện, bằng chứng phỏng vấn/quan sát.
2. Danh mục quyết định hiện hành; glossary; mô hình khái niệm và ma trận quyền.
3. Luồng A/B, trạng thái, ngoại lệ và ma trận tác động hàng–tiền–nợ–hóa đơn.
4. Bộ quy tắc và dữ liệu tính tay cho UoM, giá vốn, giá/ưu đãi, công nợ và đối soát.
5. Đặc tả offline/sync và báo cáo thử thiết bị/tích hợp/khôi phục.
6. Ma trận tuân thủ theo trường hợp, mô tả ranh giới kế toán/hóa đơn, nguồn điều/khoản.
7. Đặc tả MVP, backlog có truy vết, kế hoạch nhập liệu/đào tạo/pilot và KPI có baseline.

Các đầu ra trên là mục tiêu của B005. Trong lượt R005 chỉ hoàn thành phân tích khoảng trống, đề xuất mục tiêu và đề bài; chưa tạo giả các biên bản phỏng vấn, ADR đã duyệt, kết quả spike hay bằng chứng pilot.
