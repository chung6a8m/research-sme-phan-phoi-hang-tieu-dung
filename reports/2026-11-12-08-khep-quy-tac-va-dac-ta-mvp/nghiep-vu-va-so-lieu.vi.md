# R008-B — Quy tắc hàng–tiền, khép F02/F03 và chu kỳ nhiều ngày

- Ngày thực hiện: **12/11/2026, Asia/Bangkok**. Các giao dịch có ngày tháng dưới đây đều là dữ liệu giả lập, gồm cả tình huống tháng 12 trong tương lai so với ngày nghiên cứu.
- Phạm vi: phần tài liệu và mô hình số học của **BS-02, BS-05**, phối hợp BS-01/03/04; kế thừa [R006-B](../2026-11-11-06-ket-qua-nghien-cuu-mvp/nghiep-vu-va-so-lieu.vi.md), giải [R007 F02/F03 và E2E-13–16/21](../2026-11-12-07-review-pr1-va-muc-tieu-tiep-theo/report.vi.md).
- Đầu vào được giữ: A+B, PWA, quy tắc nhân sự xe máy/xe tải, mỗi tenant một DB, kho–hóa đơn–thu/nợ. Không bổ sung kế toán tổng hợp, phải trả nhà cung cấp hoặc ERP.
- **Trạng thái: phương án nghiên cứu có phép tính đã chạy; chưa được Owner, kế toán, provider phê duyệt. Không phải kết quả engine, thiết bị, sandbox hoặc pilot.** Phần nghiệp vụ này không tự phê duyệt Q04–Q08.
- Bằng chứng tái lập: [script Python](kiem-chung-so-lieu.py), [JSON kết quả thực chạy](ket-qua-so-lieu.json), [nguồn và giới hạn](nguon-nghiep-vu.md). Script chỉ dùng thư viện chuẩn, Decimal và mô hình trong bộ nhớ.

## 1. Kết quả cần chuyển vào đặc tả

**F02 được giải bằng quà ròng còn ở khách; F03 được giải bằng số hoàn lũy kế từ tổng giá vốn nguồn.** Hai quy tắc không cần chờ dữ liệu thị trường để phát biểu đầy đủ. Những phần phụ thuộc hồ sơ thuế, chuẩn kế toán và provider vẫn có cổng xác nhận riêng.

| Mã quy tắc ứng viên | Mặc định đề nghị | Phương án khác và đánh đổi | Người cần chấp nhận trước áp dụng thật |
|---|---|---|---|
| BR-01 | Quyền quà theo lượng mua giao ròng trong cùng đơn/chương trình phiên bản; quà miễn vẫn tính trong quà còn giữ | Miễn trở thành quyền quà bổ sung là một chính sách khác, dễ giao thêm quà khi mua lại; không dùng ngầm | Bán hàng + Owner |
| BR-02 | Hoàn giá vốn theo chênh lệch mục tiêu lũy kế, giới hạn lượng/giá trị nguồn | Phân bổ một lần xuống từng đơn vị có thể tương đương nhưng cần thứ tự đơn vị ổn định; không làm tròn riêng đơn giá × từng phiếu | Kế toán + Owner |
| BR-03 | Điều khoản A khóa khi xác nhận đơn; từng lần giao chụp lại và lấy ngày giao địa phương + N ngày lịch | Hạn chung theo hợp đồng, tháng chốt hoặc ngày hóa đơn chỉ mở bằng profile được duyệt; thay anchor đổi tuổi nợ | Bán hàng + kế toán |
| BR-04 | VND nguyên đồng khi ghi nhận, ROUND_HALF_UP; giảm toàn đơn chia theo phần dư lớn nhất; VAT theo dòng của từng lần giao | Tính VAT theo tổng nhóm thuế có thể khác vài đồng; cần một profile và bộ kỳ vọng khác, không chạy đồng thời tùy màn hình | Kế toán + provider |
| BR-05 | Một compound bán–giao–thu được chấp nhận trọn bộ; quyền chịu tiêu theo phần còn phải thu của chính lần bán | Tách receipt thành command phụ thuộc làm tăng trạng thái chờ; phải chứng minh không kiểm tra hạn mức trước khi xét receipt | Owner + kỹ thuật |
| BR-06 | Kiểm kê theo địa điểm có hàng rào ghi; chuyến đang mở giữ nguyên trách nhiệm quyền | Dừng toàn bộ kho/xe dễ giải thích hơn nhưng gián đoạn vận hành; kiểm kê online toàn đơn vị cần thu đủ journal trước | Thủ kho + vận hành |
| BR-07 | Phí mua muộn/nguồn cũ xử lý bằng điều chỉnh có liên kết vào kỳ mở | Mở lại kỳ và tính lại chuỗi cần quy trình kế toán riêng; chưa đưa engine hồi tố tự động vào MVP | Kế toán |
| BR-08 | DMS xuất sự kiện bất biến, kế toán ghi nhận/import có mã chống trùng; sửa bằng sự kiện đảo/điều chỉnh | Gõ lại thủ công chỉ dùng có sổ đối chiếu import và người chịu trách nhiệm; không mặc định là tích hợp đã đủ | Kế toán + người triển khai |

Những lựa chọn trên là suy luận thiết kế của dự án. Tài liệu Microsoft/Frappe chỉ cung cấp tham chiếu về liên kết giá vốn nguồn, điều khoản và thành phần tiền; chúng không chứng minh chính sách phổ biến ở NPP Việt Nam hay thay thế hồ sơ áp dụng tại Việt Nam. [NB01–NB05](nguon-nghiep-vu.md#1-nguon-so-cap-da-doc)

## 2. F02 — Quà ròng, quà đã trả và phần miễn thu hồi

### 2.1. Mốc chấp nhận và phạm vi tính

Đề nghị một phạm vi quyền quà gồm `tenantId + customerId + orderId + promotionVersion + qualifyingSkuGroup + giftSku`. Hai đơn khác nhau không tự cộng lượng với nhau. UoM được đổi về đơn vị gốc bằng snapshot trước khi xét ngưỡng. Trả của đơn cũ tiếp tục dùng chương trình đã chụp; không áp chương trình hiện tại.

**Mặc định MVP: quyết định chấp nhận trả cuối cùng được ghi online sau khi đã kiểm tra hàng nhận.** Các trạng thái tách biệt:

| Trạng thái trả | Ảnh hưởng lượng mua/quà ròng và tiền | Ảnh hưởng kho |
|---|---|---|
| `requested` / được phép mang về kiểm tra | Chưa giảm mua, quà hoặc phải thu | Chưa nhập tồn sở hữu |
| `custody_received_pending_review` | Chưa giảm thương mại; vẫn ghi đủ biên nhận giữ hàng | Sổ giữ hộ chờ xét, tách khỏi tồn sở hữu/bán được |
| `accepted` | Một lần giảm mua/quà theo nguồn và tạo khoản giảm đã duyệt | Một lần chuyển từ giữ hộ sang tồn sở hữu cách ly theo giá vốn được phép hoàn |
| `rejected` | Không sinh khoản giảm | Bàn giao lại khách bằng chứng từ; không xóa lịch sử đã giữ hộ |

Không dùng trạng thái “đã nhận hàng về” để suy rằng đã chấp nhận giảm tiền. Chính sách chấp nhận thương mại trước khi thực nhận là phương án khác, cần thêm hàng đang thu hồi và thời điểm ghi nhận riêng; chưa thuộc luồng tự động mặc định này. Trường hợp đã cam kết ngoài đời vẫn phải giữ hồ sơ ngoại lệ, không làm mất sự thật.

### 2.2. Đại lượng và công thức

Trong một phạm vi/phiên bản chương trình mua X tặng Y:

- `P = mua_đã_giao − mua_đã_chấp_nhận_trả`: lượng mua ròng.
- `E = floor(P / X) × Y`: quyền quà theo lượng mua hiện tại.
- `G = quà_đã_giao − quà_đã_chấp_nhận_nhận_trả`: lượng quà ròng khách đang giữ theo sổ thương mại. Quà đang giữ hộ chờ xét chưa giảm G.
- `W = lượng quà đã miễn thu hồi, còn ở khách, có liên kết tới lần giao quà cụ thể`: tập con của G, không phải một khoản quà cấp thêm.
- **Quà cần giao thêm `D = max(0, E − G)`.**
- **Quà cần xử lý thu hồi `R = max(0, G − E − W)`.** Không sinh dòng giao âm.

`G` đã bao gồm `W`. Vì vậy không lấy `E − (G − W)` để tính quà giao thêm: công thức đó sẽ quên rằng khách vẫn đang giữ các quà đã miễn. Đồng thời không cộng W vào E. Khi E tăng lại, các quà còn giữ tiếp tục đáp ứng E; nghĩa vụ miễn chỉ bảo vệ lượng quà được chỉ định khỏi lần thu hồi về sau trong cùng phạm vi.

Sổ miễn tối thiểu: `waiverId`, `sourceGiftIssueId`, `sourceReturnDecisionId`, số lượng, phạm vi chương trình, phiên bản chính sách, người duyệt, lý do, thời điểm, bằng chứng và lượng đã được khách trả về sau. Một waiver không vượt nghĩa vụ R chưa xử lý hoặc lượng quà chưa miễn còn giữ. Waiver đã duyệt không bị mở lại chỉ vì chạy lại máy tính quyền quà. Sửa sai phải có quyết định bù/đảo riêng; cùng ID khác nội dung là xung đột.

Nếu khách tự trả quà đã miễn, xác định lượng thuộc waiver đó rồi **giảm cả G và W**. Không giữ W lơ lửng để miễn cho quà giao mới. Khách không trả quà không tự tạo khoản bán quà hoặc phải thu mới. Trạng thái thiếu quà/miễn, trách nhiệm thu hồi và lịch hẹn nằm riêng; việc khách trả đủ hàng mua không tự đóng nghĩa vụ quà.

### 2.3. Ca F02 và ca miễn thu hồi đã chạy

| Sự kiện cùng đơn, X=10/Y=1 | P | E | G | W | Cần giao D | Cần thu hồi R |
|---|---:|---:|---:|---:|---:|---:|
| Giao 20 mua + 2 quà | 20 | 2 | 2 | 0 | 0 | 0 |
| Chỉ yêu cầu/giữ hộ 11 mua + 2 quà | 20 | 2 | 2 | 0 | 0 | 0 |
| Chấp nhận trả 11 mua + 2 quà | 9 | 0 | 0 | 0 | 0 | 0 |
| Giao tiếp 11 mua | 20 | 2 | 0 | 0 | **2** | 0 |
| Giao 2 quà đó | 20 | 2 | 2 | 0 | 0 | 0 |

Một nhánh khác: khách trả 11 hàng mua nhưng giữ 2 quà → `P=9,E=0,G=2,R=2`. Duyệt miễn 2 → `W=2,R=0`. Sau giao tiếp 11 mua → `P=20,E=2,G=2,W=2,D=0,R=0`; không giao dư 2 quà. Khách sau đó tự trả một quà đã miễn → `G=1,W=1,D=1`. Ca tiếp tục tạo quà mới và giảm quyền chỉ miễn phần nguồn còn lại: `P=10,E=1,G=3,W=1,R=1`. Script đối chiếu đủ các trạng thái này trong `gift_cases`.

**Giao diện cần trình bày:** “Đủ điều kiện 2; đang giữ 2; đã trả 1; được miễn còn giữ 1; cần giao 0; cần thu hồi 0”, kèm nút xem lịch sử nguồn. Không dùng một cột “quà đã giao” cho cả lượng lũy kế, lượng ròng và lượng được miễn.

## 3. F03 — Hoàn giá vốn tích lũy và nguồn đã điều chỉnh

### 3.1. Quy tắc giá trị nguồn

Microsoft Business Central mô tả liên kết trả hàng về lần xuất để đảo đúng chi phí nguồn và chuyển thay đổi chi phí tới các giao dịch chịu chi phí. Đây là căn cứ tham khảo cho yêu cầu liên kết; thuật toán phần dư dưới đây là phương án của dự án, không được gán là thuật toán Microsoft. [NB01, NB02](nguon-nghiep-vu.md#nb01--microsoft-item-application)

Mỗi dòng xuất nguồn lưu `sourceIssueLineId`, `q_source`, `C_original`, các điều chỉnh giá vốn đã duyệt, `costVersion`, `q_returned`, `C_returned_recognized`. Giá trị nguồn hiệu lực `C` là tổng giá vốn gốc và các điều chỉnh liên kết đã có hiệu lực, không phải bình quân tồn hiện tại.

Với q nguồn và tổng giá trị C, lượng trả lũy kế k:

`target(k) = ROUND_HALF_UP(C × k / q)`

`cost_return_this = target(k_new) − C_returned_recognized_before`

Điều kiện: `0 ≤ k_old < k_new ≤ q`; kiểm tra/ghi lượng trả cùng một ranh giới nhất quán. Sau ghi, `C_returned_recognized = target(k_new)`. Khi trả đủ `k=q`, mục tiêu bằng C nên phần cuối tự nhận phần dư. Không tính lại C bằng “đơn giá nguồn đã làm tròn × lượng trả”; cũng không hoàn theo bình quân kho nhận.

| Mốc phản ví dụ R007 | Lượng tồn | Giá trị tồn | Giá vốn/hoàn |
|---|---:|---:|---:|
| Ban đầu | 3 | 10.000 | — |
| Xuất 2 | 1 | 3.333 | Xuất 6.667 |
| Trả 1 lần đầu | 2 | 6.667 | Hoàn 3.334 |
| Trả 1 lần sau | 3 | **10.000** | Hoàn **3.333**; tổng hoàn 6.667 |

Làm tròn riêng hai phần `6.667/2` sẽ hoàn 6.668, gây thừa 1. Script lưu cả phản ví dụ và kết quả sửa. Các cách chia nguồn 7 đơn vị/10.001 đồng thành `[1,1,1,4]`, `[2,3,2]` hoặc `[7]` đều hoàn đúng 10.001. Điều đó không buộc mọi lịch nhập–xuất khác nhau phải có cùng giá vốn từng lần.

### 3.2. Nguồn thay đổi sau khi đã trả một phần

Ví dụ nguồn 2 đơn vị có giá vốn v1=6.667; đã trả 1, ghi 3.334. Điều chỉnh giá vốn nguồn +101 → v2=6.768. Mục tiêu của lượng đã trả theo v2 là `round(6.768/2)=3.384`, nên cần chứng từ điều chỉnh thêm **50** cho phần đã trả; **51** thuộc phần giá vốn còn ở giao dịch xuất. Lần trả đơn vị cuối là **3.384**. Tổng `3.334 + 50 + 3.384 = 6.768`.

Không sửa âm thầm phiếu trả cũ. Cần `SourceCostAdjustment` và phân bổ nhận chi phí. Nếu hàng đã trả còn trong cách ly, điều chỉnh vào đúng giá trị cách ly; nếu đã chuyển/bán tiếp, phải xác định bên nhận chi phí thực tế bằng liên kết hoặc kế toán duyệt phân bổ. Không tự cộng vào một địa điểm đã hết hàng. Khi chưa có phân bổ đáng tin cậy, giữ điều chỉnh chờ kế toán; không công bố giá vốn là đã đối soát.

Một cập nhật cost version và lần trả đồng thời phải dùng cùng phiên bản đã khóa/kiểm tra; retry giữ chính phiên bản/kết quả đã ghi, điều chỉnh đến sau là sự kiện mới. Cấm `C_returned > C_effective` sau khi đã áp đủ điều chỉnh tương ứng; điều chỉnh giảm chi phí có thể tạo giá trị bù âm có kiểm soát, không phải lượng trả âm. Script R008 kiểm tra nhánh tăng +101; nhánh giảm và nhiều chuỗi chuyển/bán sau trả là ca engine cần bổ sung khi triển khai.

## 4. Hạn trả: snapshot theo thỏa thuận, anchor từng lần giao

Tài liệu Business Central cho thấy điều khoản trên chứng từ có thể khác mặc định Customer và dùng ngày chứng từ để tính hạn; nguồn không quy định phải dùng ngày giao cho dự án này. **Anchor ngày giao là lựa chọn nghiên cứu đề nghị** phù hợp sổ công nợ vận hành gắn với giao được chấp nhận. [NB03](nguon-nghiep-vu.md#nb03--microsoft-payment-terms)

Snapshot cần chứa: `termsId/version`, `anchorType=accepted_delivery_local_date`, `calendarDays`, `businessTimezone`, `dueDate`, `orderCommitmentVersion`, người chấp thuận ngoại lệ và nguồn thỏa thuận. Ngày đến hạn là kiểu date, không lấy giờ điện thoại hoặc ngày sync thay ngày giao. VND/7 ngày là tham số mẫu, không điều khoản mặc định cho mọi khách.

1. A xác nhận đơn: chụp điều khoản đã thỏa thuận. Mỗi delivery/khoản phải thu sao chép điều khoản đó, tính `dueDate = local_date(occurredAt, businessTimezone) + N ngày lịch`.
2. Đổi Customer T7→T14 chỉ ảnh hưởng đơn mới. Phần chưa giao của đơn A đã xác nhận vẫn T7.
3. Muốn đổi phần chưa giao của A: amendment có phiên bản, người duyệt và ngày hiệu lực; chỉ áp delivery tương lai. Muốn gia hạn khoản đã có: chứng từ đổi lịch trả có lý do, giữ due date gốc và lịch sử; không chạy lại tự động.
4. B dùng điều khoản của giao dịch/gói quyền đã cấp. Thời điểm nhận ACK không dời due date; `recorded_exception` chưa có khoản ghi sổ phải hiện riêng, không biến thành khoản nợ đã xác nhận.
5. `daysPastDue = max(0, asOfLocalDate − dueDate)` với số ngày lịch. Ngay ngày due date là đến hạn, chưa có một ngày quá hạn; cuối tuần/ngày lễ không tự dời nếu chưa có quy tắc được duyệt. Có dư chưa phân bổ hiển thị riêng, không giả định tự xóa mọi khoản quá hạn.

| Ca E2E-15 | Điều khoản chụp | Ngày giao | Hạn trả | Quá hạn tại 16/11 |
|---|---|---|---|---:|
| A lần 1 | T7-v1 | 01/11 | 08/11 | 8 ngày |
| A lần 2; Customer đã đổi T14 ngày 04/11 | T7-v1 | 08/11 | **15/11** | 1 ngày |
| Đơn mới sau đổi Customer | T14-v2 | 08/11 | 22/11 | 0 ngày |
| Nhánh thay thế: amendment 10 ngày cho phần còn lại | T10-amendment | 08/11 | 18/11 | 0 ngày |

Ca múi giờ: giao `2026-11-01T18:30:00Z` thuộc 02/11 tại UTC+07, T7 ra 09/11. Không lấy ngày UTC 01/11 để ra 08/11. Hợp đồng có ngày chốt chung hoặc lịch làm việc sẽ là profile khác; không triển khai âm thầm bằng cách nhập một số N có ý nghĩa khác.

## 5. Chuẩn tiền, chiết khấu, thuế và trả sau thu

### 5.1. Profile thử và hợp đồng dữ liệu

Profile **`SYNTHETIC-UNAPPROVED-v1`** chỉ dùng xác minh số học. `8%` và `10%` là đầu vào của phép tính, **không phải kết luận thuế suất của P/Q ngoài đời**. Profile có `invoice_eligible=false`, `owner/accountant/provider_approved=false`. Tax treatment cần enum riêng (`taxed`, các loại xử lý khác sau khi có hồ sơ), tách với `rate`; null/không xác định không được biến thành 0%.

| Thành phần | Quy tắc ứng viên |
|---|---|
| Tiền tệ/độ chính xác | VND, số tiền đã ghi là nguyên đồng; đầu vào dùng decimal string/integer. Script precision 50, chặn trộn float |
| Làm tròn | ROUND_HALF_UP tại ranh giới quy định; không phụ thuộc hàm round mặc định của ngôn ngữ |
| Giá | Một chứng từ dùng một `priceMode` có/chưa gồm thuế; nhiều thuế suất có thể cùng chứng từ. Không trộn hai cách hiểu của cùng cột đơn giá |
| Dòng | `quantityBase`, `uomSnapshot`, `listAmount`, `lineDiscount`, `orderDiscountAllocated`, `netAmount`, `taxTreatment`, `rate`, `vatAmount`, `grossAmount` |
| Snapshot | `pricingVersion`, `promotionVersion`, `taxProfileId/version`, quy tắc làm tròn, nguồn phê duyệt, mốc giao, quan hệ dòng đơn/dòng nguồn |
| Tổng | `netTotal=sum(netAmount)`, `vatTotal=sum(vatAmount)`, `grossTotal=netTotal+vatTotal`; tổng nhóm thuế cộng dòng đã ghi, không tự tính lại thuế lần hai |
| Quà trong fixture | Giá thương mại 0; **giả định mô phỏng** taxable base 0, rate input 0,08, VAT 0. Đây không phải khẳng định “quà chịu thuế suất 0%” hoặc mọi chương trình hợp lệ |
| Chi phí nhập | Giá trị vốn đã cho, giả định tách phần VAT đầu vào có thể khấu trừ; script không xác định khả năng khấu trừ hay xây sổ VAT đầu vào/AP |

Python mô tả Decimal, `quantize` và ROUND_HALF_UP; thư viện chỉ thực hiện cách làm tròn đã chọn, không quyết định chính sách kế toán. [NB04](nguon-nghiep-vu.md#nb04--python-decimal)

### 5.2. Thứ tự tính và phần dư chiết khấu

Mặc định giá chưa thuế: tính tiền dòng và giảm dòng; xác định các dòng đủ điều kiện; làm tròn tổng giảm toàn đơn một lần; chia xuống dòng theo tỷ trọng tiền còn đủ điều kiện trước thuế; sau đó mới tính VAT của từng dòng. Giá đã gồm thuế: tỷ trọng và khoản giảm nằm trên tiền đã gồm thuế; sau khi chia giảm mới tách net/VAT. Không dùng cùng số tiền giảm cho hai basis rồi cho rằng hai hóa đơn phải giống nhau.

Với tổng giảm D và trọng số bᵢ, phần chính xác `dᵢ*=D×bᵢ/Σb`. Lấy phần nguyên sàn; số đồng còn lại cộng cho các dòng có phần lẻ lớn nhất; hòa thì theo `stableLineId` tăng dần. Không dựa thứ tự dòng hiện trên màn hình. Dòng quà không nhận phân bổ. D không vượt tổng cơ sở đủ điều kiện; tổng cơ sở bằng 0 mà D>0 là dữ liệu sai. Chiết khấu %, giảm số tiền và điều kiện cộng dồn vẫn theo tập hữu hạn R006; không mở engine khuyến mại tùy ý.

| Ca độc lập | Cơ sở dòng P/Q | Giảm P/Q | Net P/Q | VAT P/Q | Tổng phải trả |
|---|---|---|---|---|---:|
| Chưa thuế; giảm 10.001 | 200.000 / 100.000 | 6.667 / 3.334 | 193.333 / 96.666 | 15.467 / 9.667 | **315.133** |
| Đã gồm thuế; giảm 10.001 | 216.000 / 110.000 | 6.626 / 3.375 | 193.865 / 96.932 | 15.509 / 9.693 | **315.999** |

Thuế suất nhập mẫu là 8% cho P, 10% cho Q. Với giá exclusive: `VAT=round(net×r)`, `gross=net+VAT`. Với giá inclusive: `net=round(gross/(1+r))`, `VAT=gross−net`. Giữ gross khách đã thỏa thuận; không làm tròn net và VAT độc lập rồi cộng ra một gross khác. Tài liệu Frappe có ví dụ tách giá gồm thuế và phân bổ giảm; profile trên được dự án chọn riêng, không tuyên bố sao chép toàn bộ thuật toán Frappe. [NB05](nguon-nghiep-vu.md#nb05--frappe-gia-gom-thue-va-giam-toan-bo)

**Đơn A giao nhiều lần:** giảm toàn đơn phân về các dòng đơn khi xác nhận; phần giảm dòng giao lần này là chênh lệch mục tiêu lũy kế theo lượng đã giao trên dòng đơn. Lần cuối nhận phần dư. Thuế được tính tại từng delivery theo profile của giao dịch đó. Trả hàng không tự tái tính ngưỡng giảm tiền trên toàn lịch sử; dùng tiền đã phân nguồn. Nếu hợp đồng yêu cầu thu hồi một mức giảm khi trả, phải có điều chỉnh thương mại đã được duyệt riêng; không để engine tự phát sinh nợ sau trả. Hủy phần chưa giao không tự dồn giảm của phần đó vào hàng đã giao.

### 5.3. Trả từng phần dùng các thành phần nguồn

Tách hai nguồn: giá vốn hoàn theo §3; khoản giảm thương mại theo dòng giao nguồn đã chấp nhận. Với dòng q đơn vị, net N và VAT T đã ghi:

`net_return_cumulative(k)=round(N×k/q)`; `vat_return_cumulative(k)=round(T×k/q)`.

Lần trả mới nhận chênh với phần đã hoàn; `gross_return = net_return + vat_return`. **Không làm tròn gross độc lập lần thứ ba**, không lấy thuế suất hiện tại hoặc giá hiện tại tính lại. Nếu nguồn từng có giảm giá/điều chỉnh thuế, cần phiên bản giá trị nguồn hiệu lực và giới hạn đã hoàn tương tự giá vốn; phần tăng/giảm riêng có liên kết. Lượng trả, net/VAT đã giảm và tiền đã hoàn là ba đại lượng riêng.

Ví dụ dòng P có N=193.333, T=15.467, q=3:

| Lần trả 1 đơn vị | Net giảm | VAT giảm | Tổng giảm |
|---|---:|---:|---:|
| 1 | 64.444 | 5.156 | 69.600 |
| 2 | 64.445 | 5.155 | 69.600 |
| 3 | 64.444 | 5.156 | 69.600 |
| Cộng | **193.333** | **15.467** | **208.800** |

Ca biên mô phỏng N=1,T=1,q=2 làm cách phân thành phần trả gross=2 rồi 0; nếu làm tròn gross riêng thì ra 1 rồi 1 và không khớp thành phần ở từng lần. Đây là đánh đổi có thật của profile bảo toàn thành phần: cần kế toán/provider xác nhận lượng và giá trị rất nhỏ hoặc chọn profile phân bổ khác trước áp dụng. Bộ dữ liệu không chứng minh provider chấp nhận các con số đó.

Trả sau khi đã thu tạo khoản có thể giảm nợ hoặc số dư có. **Hoàn tiền là chứng từ riêng**, không xóa receipt gốc; chỉ chi từ số dư có còn được hoàn và nguồn tiền có quyền, giữ `refundId`, `creditSourceId`, người nhận, phương thức, trạng thái thực chi. Phân bổ có dư vào khoản khác cũng phải có `allocationId`; không chỉ trừ hai số trên màn hình rồi bỏ dấu vết. Retry cùng định danh không chi lần hai; nếu trạng thái tiền ngoài hệ thống chưa rõ thì treo tra soát, không tự hoàn lại.

### 5.4. Đối chiếu UI–sổ–provider

UI đọc chính các thành phần đã chụp; sổ công nợ tăng bằng gross đã chấp nhận; outbox lấy cùng snapshot để lập dữ liệu hóa đơn. Chỉ tạo hóa đơn không làm tăng phải thu lần nữa. Provider có thể có tên trường tương ứng net/discount/VAT/total; tài liệu meInvoice công khai có những trường này nhưng chưa đủ xác nhận cách làm tròn, alias, mã thuế đặc biệt hoặc hành vi update hiện hành. [NB06](nguon-nghiep-vu.md#nb06--meinvoice-schema-cong-khai)

| Chứng từ tiền trong ca nhiều ngày | Net | VAT | Gross | Dấu ở sổ KH |
|---|---:|---:|---:|---|
| A1: giao P20, Q5 | 442.682 | 38.366 | 481.048 | Tăng |
| R1: trả P11/20 nguồn A1-P | 162.317 | 12.986 | 175.303 | Giảm |
| A2: giao tiếp P11 | 162.317 | 12.985 | 175.302 | Tăng |
| B1: Q3 giá đã gồm thuế | 90.000 | 9.000 | 99.000 | Tăng |
| R2: Q2/5 nguồn A1-Q | 59.024 | 5.902 | 64.926 | Giảm |

**R1 và A2 chênh VAT 1 đồng dù cùng lượng P11:** R1 hoàn đúng phân bổ VAT nguồn A1; A2 là lần giao mới và tính VAT tại lần đó. Đây là kết quả mong đợi của profile, không chỉnh về cùng số bằng cách phá một nguồn. Ca sandbox phải gửi/đọc lại đúng các thành phần và quan hệ gốc/điều chỉnh. Không dùng `TotalAmountWithVAT` như alias đã bảo đảm khi tài liệu mẫu còn mơ hồ. Nếu provider không hỗ trợ cách biểu diễn dự kiến, dừng phát hành tự động để chốt mapping/profile; không thay số trên sổ mà thiếu điều chỉnh được duyệt.

## 6. Bán–giao–thu trong một compound và quyền bán chịu

Đơn vị chấp nhận là một command bao gồm đơn B, delivery, các dòng tồn/giá vốn, khoản phải thu, receipt, phân bổ receipt vào chính lần bán, tác động người giữ tiền, ngân sách tín dụng và outbox. Chứng từ vẫn có ID riêng. Sổ của một tenant ghi toàn bộ hoặc không ghi phần nào trong nhánh được chấp nhận; receipt không phải ACK của provider hóa đơn. Tính nguyên tử ở server và retry nằm trong contract kỹ thuật, chưa được script số học chứng minh.

Với gross bán S, receipt đã đủ điều kiện phân bổ R và số có dư cũ đã được server giữ riêng C:

`R_applied=min(S,R)`; `C_applied=min(S−R_applied,C)`; **`creditConsumed=S−R_applied−C_applied`**.

| Ca | S | Receipt tính được | Có dư được giữ riêng | Quyền chịu tiêu | Có dư mới |
|---|---:|---:|---:|---:|---:|
| Bán/thu đủ | 100 | 100 | 0 | **0** | 0 |
| Thu một phần | 100 | 60 | 0 | **40** | 0 |
| Khách chỉ báo đã chuyển 100 | 100 | 0 | 0 | **100** | 0 |
| Thu thừa | 100 | 120 | 0 | 0 | 20 |
| Thu 60, có dư 40 được giữ riêng | 100 | 60 | 40 | 0 | 0 |

Tiền mặt do người được quyền thu xác nhận là sự kiện thu khách; không cần đợi nộp quỹ mới giảm nợ. Chuyển khoản chờ xác minh không được dùng như tiền đã nhận. Receipt trong compound được phân bổ vào chính lần bán theo cam kết thu tại điểm, không tự bị chính sách “hạn cũ trước” kéo sang nợ khác rồi bất ngờ tiêu hạn mức của lần bán mới. Nếu khách yêu cầu trả nợ cũ, phải chỉ rõ phân bổ; phần bán mới còn chịu được tính lại.

Mức tiêu 0 không bỏ qua kiểm tra khách/người bán/quyền hàng/điều kiện hóa đơn hoặc quy tắc cấm bán đã duyệt. Không yêu cầu hạn mức bán chịu 100 chỉ vì gross100 nếu đã chấp nhận receipt100 trong cùng compound. Thu nợ cũ offline không tự cấp lại hạn mức chung hoặc quyền đã cấp cho chuyến khác; có dư cũ chỉ dùng nếu được giữ riêng trong grant hoặc xác nhận online. Ngoài quyền nhưng thực tế đã giao/thu phải ghi bền ngoại lệ giữ cả hai sự kiện, không bỏ receipt để làm cho kiểm tra tín dụng “đúng”.

## 7. Bộ dữ liệu nhiều SKU/UoM và 18 mốc số dư

### 7.1. Danh mục và giả định có phạm vi

P: chai gốc, lốc 6, thùng 12. Q: gói gốc, lốc 5, thùng 10. Các hệ số có snapshot v1; chưa mô hình hàng cân hoặc đổi quy cách giữa kỳ. MAIN, TRIP-T1 và QUARANTINE là ba địa điểm riêng. Giá vốn bình quân di động theo SKU×địa điểm; xuất hết lấy toàn bộ giá trị còn. Không dùng lần nhập ngày 2 ở MAIN đổi giá vốn hàng đã cấp T1.

Customer C-A có đơn A P31×15.000 trước thuế và Q5×30.000 trước thuế; giảm toàn đơn 10.001 chia P7.562/Q2.439. Giao P20 lần đầu nhận giảm4.879, phần P11 tiếp nhận giảm2.683. P có chương trình mua10 tặng1 cùng đơn. C-B mua Q3 giá33.000/gói đã gồm thuế. Hai khách chịu nợ độc lập; N1 giữ tiền rồi nộp thủ quỹ. A dùng T7; B1 trả ngay theo thỏa thuận mẫu. Các khoản còn nợ chưa chứng minh khách thật chấp nhận điều khoản.

T1 có thể qua ngày nhưng phải còn phân công, manifest và grant hợp lệ theo chính sách đã duyệt. Ca giả lập coi quyền được phép tiếp tục, **không xác nhận quyền offline luôn dài hơn một ngày**. Các bước ACK/đóng chuyến ở đây là giả định đầu vào của phép tính, chưa là kiểm chứng trên thiết bị.

### 7.2. Chuỗi sự kiện và số dư tại từng mốc

Tiền trong bảng là VND; “chi phí hàng/lệch kho” gồm giá vốn bán, quà và hao hụt đã được duyệt. Tồn giữ hộ chưa xét không nằm trong giá trị sở hữu. Mỗi dòng nêu trạng thái **sau** sự kiện; trạng thái trước là dòng ngay trên. JSON có cả lượng/giá trị từng SKU×địa điểm tại mọi mốc.

| Mốc/ngày | Sự kiện | Giá trị tồn | Chi phí hàng/lệch kho lũy kế | Phải thu | Có dư KH | N1 giữ | Thủ quỹ giữ |
|---|---|---:|---:|---:|---:|---:|---:|
| M01, 01/11 | Nhập P60=600.000, Q30=600.000 | 1.200.000 | 0 | 0 | 0 | 0 | 0 |
| M02, 01/11 | Cấp T1 P36/Q10, chỉ chuyển hàng | 1.200.000 | 0 | 0 | 0 | 0 | 0 |
| M03, 01/11 | A1 P20+2 quà, Q5; gross481.048 | 880.000 | 320.000 | 481.048 | 0 | 0 | 0 |
| M04, 01/11 | Thu RC1 500.000 | 880.000 | 320.000 | 0 | 18.952 | 500.000 | 0 |
| M05, 01/11 | Giữ hộ trả P11+2 quà, chưa xét | 880.000 | 320.000 | 0 | 18.952 | 500.000 | 0 |
| M06, 01/11 | Chấp nhận R1: cách lyP13/130.000; giảm175.303 | 1.010.000 | 190.000 | 0 | 194.255 | 500.000 | 0 |
| M07, 01/11 | Hoàn RF1 100.000 | 1.010.000 | 190.000 | 0 | 94.255 | 400.000 | 0 |
| M08, 01/11 | Nộp quỹ350.000, T1 còn mở | 1.010.000 | 190.000 | 0 | 94.255 | 50.000 | 350.000 |
| M09, 02/11 | Chuyển ngày, không tạo chứng từ số dư mới | 1.010.000 | 190.000 | 0 | 94.255 | 50.000 | 350.000 |
| M10, 02/11 | Nhập MAIN P24/288.000, Q10/210.000 | 1.508.000 | 190.000 | 0 | 94.255 | 50.000 | 350.000 |
| M11, 02/11 | Kiểm kê MAIN thiếuP1, duyệt11.000; T1 còn mở | 1.497.000 | 201.000 | 0 | 94.255 | 50.000 | 350.000 |
| M12, 02/11 | A2 P11+2 quà, gross175.302; phân bổ có dư94.255 | 1.367.000 | 331.000 | 81.047 | 0 | 50.000 | 350.000 |
| M13, 02/11 | B1 Q3 gross99.000, compound thu60.000 | 1.307.000 | 391.000 | 120.047 | 0 | 110.000 | 350.000 |
| M14, 02/11 | T1 chuyển dư P1/10.000, Q2/40.000 về MAIN | 1.307.000 | 391.000 | 120.047 | 0 | 110.000 | 350.000 |
| M15, 02/11 | Nộp110.000, đóng T1 theo manifest giả định | 1.307.000 | 391.000 | 120.047 | 0 | 0 | 460.000 |
| M16, 30/11 | Khóa kỳ; giả định không có phát sinh khác 03–30/11 | 1.307.000 | 391.000 | 120.047 | 0 | 0 | 460.000 |
| M17, 01/12 | Phí mua Q biết muộn6.001: tồn4.401, giá vốn1.600 | 1.311.401 | 392.600 | 120.047 | 0 | 0 | 460.000 |
| M18, 02/12 | R2 trảQ2 từ A1/T1/kỳ cũ, cost40.400; giảm64.926 | **1.351.801** | **352.200** | **55.121** | 0 | 0 | **460.000** |

Ở M12, `ALLOC-A2` dùng đúng94.255 có dư còn lại, để A2 nợ81.047. Tại M18, nguồn A1 đã được thanh toán: R2 tạo khoản có dư64.926 rồi `ALLOC-R2-A2` phân vào A2; A2 còn16.121, C-B còn39.000. Script mô hình hóa tổng KH và ghi định danh phân bổ; chưa xây subledger khoản/receipt thực. Nộp quỹ M08/M15 không giảm phải thu lần hai.

### 7.3. Số lượng cuối và phần giá vốn nguồn điều chỉnh

| Địa điểm cuối M18 | P lượng/giá trị | Q lượng/giá trị |
|---|---|---|
| MAIN | 48 / 527.000 | 32 / 654.401 |
| TRIP-T1 | 0 / 0 | 0 / 0 |
| QUARANTINE | 13 / 130.000 | 2 / 40.400 |
| Tổng | **61 / 657.000** | **34 / 694.801** |

P nhập84; khách giữ mua20+quà2, thiếu kiểm kê1, nên còn61. Q nhập40; bán8 rồi nhận trả2, nên còn34. Tồn cách ly có giá trị nhưng không tăng quyền bán.

Phí muộn6.001 tham chiếu lô nhập Q30 ở M01. Trong lịch sử mẫu không có xuất từ MAIN sau khi trộn lần nhập mới; xác định được 22 đơn vị nguồn cũ còn MAIN, 5 đã xuất A1 và 3 đã xuất B1. Phân bổ đã duyệt theo ba bên nhận chi phí ra4.401/1.000/600. Đây là trường hợp có đường phân bổ rõ, **không phải quy tắc lấy lượng lô FIFO để thay bình quân cho mọi lịch sử**. Trường hợp trộn/chuyển/xuất phức tạp cần kế toán cung cấp bản phân bổ được đối chiếu, hoặc mở rộng engine sau quyết định riêng.

Nguồn A1-Q từ100.000 thành101.000 cho q5. Trả2 ở M18 dùng `round(101.000×2/5)=40.400`, không dùng bình quân MAIN `654.401/32`. Giá bán/VAT nguồn A1 không đổi theo phí mua; giảm thương mại64.926 là một phép tính độc lập.

### 7.4. Các bất biến đã đối chiếu thực tế trong mô hình

- Mỗi mốc: **tổng giá trị nhập/điều chỉnh nguồn = tồn sở hữu + chi phí bán/quà/lệch kho ròng**.
- Mỗi mốc: **tiền bán ròng gồm VAT = phải thu − có dư KH + tổng tiền đang giữ đã thu ròng**. Khách C-A/C-B tách riêng, không bù chéo.
- Sau ngày2: `532.682 + 47.365 = 580.047 = 120.047 + 460.000`.
- Sau M18: `473.658 + 41.463 = 515.121 = 55.121 + 460.000`.
- Giá trị cuối: `1.704.001 = 1.351.801 + 352.200`; tồn0 tại xe có giá trị0; chuyển ngày và chuyển địa điểm không sinh doanh số.
- Hoàn nguồn F03 đúng6.667 hoặc6.768 sau điều chỉnh; miễn quà không tạo quyền quà mới; giảm10.001 được phân đủ10.001.

Script kiểm tra các đẳng thức ở **cả 18 mốc**, ngoài các kết quả số đã ghi cứng để bắt lỗi công thức. Không chứng minh nghiệp vụ ngoài đời, giao diện hoặc xử lý đồng thời chỉ bằng việc tổng cân.

## 8. Chu kỳ kho, kỳ khóa và kiểm kê khi chuyến còn mở

### 8.1. Kiểm kê có phạm vi

Chọn `countSessionId`, địa điểm/SKU/lô, `ledgerWatermark`, người đếm/người duyệt và hàng rào ghi. Mặc định kiểm kê MAIN bằng cách tạm dừng xuất/nhập/chuyển của chính phạm vi đó trong cửa sổ đếm; các xe có phạm vi tách biệt tiếp tục theo quyền đã cấp. Ghi hàng đang bàn giao dở về một phía theo biên bản, tránh cả hai bên cùng nhận là tồn.

M11 MAIN cóP48=528.000 trước đếm, thựcP47; chênh−1 lấy bình quân11.000, chứng từ loss11.000. Q30 không lệch. T1 còn mở với lượng và quyền riêng; không lấy con số đếm MAIN suy ra xe mất hàng, không thu hồi ngân sách xe chỉ vì hết ngày hoặc hết hạn grant. Nếu lệnh của xe/chuyển hàng có thể tác động vào phạm vi đang đếm, phải chờ watermark/manifest tương ứng hoặc tách khỏi phạm vi kết luận; chưa đủ thì phiên đếm chưa được duyệt.

Đếm chính TRIP-T1 đòi người ghi ngừng tạo mới, gửi đủ journal hoặc mở ngoại lệ mất thiết bị, bàn giao hàng/tiền và đối chiếu manifest. “Server không thấy queue” không đủ chứng minh hàng trên xe đã đầy đủ dữ liệu. Lệnh thực tế xảy ra trước thời điểm đếm nhưng tới sau không tự chèn làm sai số dư đã khóa; đưa vào hồ sơ đối chiếu chênh, giữ thời điểm thực và người quyết định điều chỉnh.

### 8.2. Nhận hàng và phí biết muộn

Phiếu nhận tối thiểu có nguồn ngoài/nhà cung cấp, mã chứng từ nguồn, người giao–nhận, SKU/quy cách/lô/lượng, thời điểm, giá trị được chấp nhận và tình trạng chất lượng. Kế toán có thể cung cấp giá vốn tạm/giá vốn duyệt theo profile đã thống nhất; báo cáo cần phân biệt tạm và đã đối soát. Nhận vật lý chưa rõ giá trị không được tùy lấy giá bán hoặc bình quân hiện tại làm giá mua; giữ hàng chờ xác nhận giá trị/quyền bán theo quyết định được duyệt. Không tạo AP từ phiếu nhận trong phạm vi này.

Phí biết muộn cần `costAdjustmentId`, nguồn nhập, tổng phí, căn cứ phân bổ, recipient entries, số vào tồn/chi phí, version và người duyệt. M17 ghi kỳ12 đang mở; báo cáo tháng11 đã khóa vẫn có snapshot1.307.000 và liên kết bản điều chỉnh phát sinh tháng12. Giữ `occurredAt`, `receivedAt`, `postingDate`, kỳ nguồn liên quan và lý do; không lùi ngày ghi để che xử lý muộn.

Business Central có điều chỉnh chi phí và chuyển ngày ghi điều chỉnh sang kỳ mở trong những trường hợp khóa kỳ. R008 dùng đó như tham chiếu cho thiết kế append-only/kỳ mở; chưa kết luận hạch toán cụ thể của doanh nghiệp Việt Nam phải dùng đúng phương án này. [NB02](nguon-nghiep-vu.md#nb02--microsoft-cost-adjustment)

### 8.3. Trả từ chuyến/kỳ đã đóng

Đóng chuyến không hủy khả năng tìm nguồn. R2 tham chiếu A1-Q, T1, phiên bản giá/thuế và costv2, phát sinh tại kỳ mở. Không mở lại quyền offline của T1; không thêm hàng vào xe cũ; nhận vào cách ly hiện tại và tạo giảm/điều chỉnh đúng nguồn. Nếu thiếu nguồn, chỉ nhận giữ hộ, người phụ trách đối chiếu chứng từ ngoài rồi duyệt nguồn chuyển đổi/giá trị; không dùng “trả không đơn” để cho tự hoàn tiền ngay.

## 9. Ranh giới DMS–kế toán–provider và xuất/nhập chống trùng

### 9.1. Nguồn có thẩm quyền theo loại dữ liệu

| Dữ liệu/quyết định | Nơi có thẩm quyền đề nghị | DMS giữ gì và đối chiếu gì |
|---|---|---|
| Giao thực tế, hàng xe, lượng trả nhận, thu/nộp thực tế | Chứng từ vận hành DMS đã chấp nhận và người chịu trách nhiệm | Nhật ký không sửa ngầm; thời điểm/actor/source và trạng thái ngoại lệ |
| Danh mục SKU/UoM/Customer dùng vận hành | DMS sau import/cutover được duyệt | Mapping mã kế toán/provider; không nhập lặp thành khách hoặc SKU mới |
| Tax treatment, tính vốn được phép, tài khoản kế toán, kỳ khóa, phân bổ phí | Kế toán/người có thẩm quyền theo hồ sơ áp dụng | Profile/version/decision; DMS tính theo bản đã được chấp nhận, không tự duyệt |
| Sổ công nợ và người giữ tiền vận hành | DMS cho các sự kiện trong phạm vi đã cutover | Số phát sinh, phân bổ, có dư/hoàn; đối chiếu sổ kế toán, không gọi là sổ cái pháp định |
| Sổ cái, AP, ngân hàng đầy đủ, khai/báo cáo thuế | Hệ thống kế toán ngoài MVP | Tham chiếu/ACK/chênh lệch, không sao chép mọi module |
| Số/ký hiệu, kết quả phát hành, mã tra cứu và bản hóa đơn hợp lệ | Kết quả đã được xác nhận của hệ thống hóa đơn/provider theo luồng áp dụng | Mapping bất biến về sự kiện DMS; unknown/failed/issued riêng, không cộng lại nợ |
| Chứng từ vận chuyển | Hệ thống/người được chọn trong hồ sơ hóa đơn | ID/bản chứng từ/trạng thái, lượng cấp xe và đối chiếu hàng về; không suy từ phiếu chuyển nội bộ trong DMS là đã hợp lệ |

Kế toán không sửa phát sinh DMS qua một file import tổng tồn/tiền hàng ngày. Nếu có chênh, tạo hồ sơ có chủ và chứng từ điều chỉnh được duyệt. Mở sổ đầu kỳ là chế độ cutover riêng; không chạy lại mỗi ngày rồi cộng thêm lần nữa.

### 9.2. Mẫu export tối thiểu ứng viên

Đề nghị gói CSV UTF-8 có manifest JSON hoặc một payload JSON tương đương. Đây là contract logic, **chưa phải định dạng đã được phần mềm kế toán nào chấp nhận**. Các trường ID/timestamp phải là text; tiền ghi số nguyên VND, không mất số 0 đầu mã.

| Nhóm trường | Nội dung tối thiểu |
|---|---|
| Gói | `schemaVersion`, `batchId`, `tenantId`, `businessOperatorId`, thời điểm tạo, dải sequence/watermark, số dòng, tổng net/VAT/gross/value theo loại, hash file |
| Định danh sự kiện | `externalEventId` ổn định, `sourceDocumentId`, `sourceLineId`, `eventType`, `eventVersion`, `payloadHash` |
| Ngày/quan hệ | `occurredAt`, `receivedAt`, `postingDate`, `sourcePeriod`, `reversalOf`/`adjustmentOf`, source cost/tax version |
| Đối tượng | Customer/SKU/UoM/địa điểm/mã ánh xạ, lượng gốc + hệ số snapshot; dữ liệu người liên hệ chỉ nếu bên nhận cần |
| Tiền/sổ | List/discount/net/VAT/gross; cost value riêng; số thu, phân bổ và người giữ nguồn/đích theo event type |
| Tích hợp | ID hóa đơn/provider nếu đã có; status; `externalAccountingVoucherId` và import receipt khi được nhận |

Các hàng mẫu thực có trong `export_reference_case.rows` của JSON:

| externalEventId | Loại/nguồn | Net | VAT | Gross |
|---|---|---:|---:|---:|
| `TENANT-DEMO:INV-M03-P:1` | Sale A1-P | 295.121 | 23.610 | 318.731 |
| `TENANT-DEMO:INV-M03-Q:1` | Sale A1-Q | 147.561 | 14.756 | 162.317 |
| `TENANT-DEMO:RET-M06-P:1` | Credit R1-P, nguồn A1-P | −162.317 | −12.986 | −175.303 |

Manifest và các dòng receipt/stock/value chưa xuất thành file adapter thật trong đợt này; bảng trên xác định trường bắt buộc để triển khai sau khi chọn phần mềm nhận. Không gọi ba hàng mẫu là bộ export hoàn chỉnh cho pilot.

### 9.3. Quy tắc nhận lại và sửa sai

1. Bên nhận hoặc cầu nối import phải duy trì registry `(tenantId, externalEventId) → payloadHash, status, externalVoucherId`. **Cùng ID/hash nhận lại không tạo thêm phát sinh; cùng ID khác hash vào xung đột, không overwrite.** DMS giữ receipt theo từng event; batch có thể thành công một phần.
2. Mất phản hồi không tạo ID mới; tra cứu registry/biên nhận bằng ID cũ. Nếu hệ thống kế toán không hỗ trợ lookup/import idempotent, cần registry và thao tác kiểm soát ở cầu nối hoặc sổ import do kế toán xác nhận. Không hứa “exactly once” chỉ vì DMS có batchId.
3. Đổi một phát sinh đã nhận: event đảo/chênh mới, ID mới, liên kết gốc. Không gửi lại một dòng cũ với số mới. Điều chỉnh giá vốn và điều chỉnh VAT khác loại event, không trộn.
4. File nhập ngược chỉ mang mapping/receipt/phiếu điều chỉnh được kế toán duyệt thuộc danh mục cho phép. Không nhận một dòng `totalAR` rồi viết đè toàn sổ hoặc đổi sự kiện giao thực tế.
5. Đóng đối soát khi số dòng/ID, số lượng, net/VAT/gross, giá trị kho/giá vốn, nợ/có dư và tiền theo custodian khớp phạm vi cutoff; các unknown/chênh có hồ sơ chưa đóng. Phân biệt thiếu do cutoff với số sai; không dùng bút toán “cân tổng” không có nguồn.

Mô hình trong bộ nhớ nạp lại ba dòng hai lần còn đúng3 ID, nhận ra cùng ID/số khác là xung đột. **Chưa import vào phần mềm kế toán thật, chưa gây lỗi mạng hay chứng minh transaction của hệ thống nhận.**

## 10. Ngoại lệ có người nhận và điều kiện đóng

Một hồ sơ dùng `exceptionId`, loại, mức ảnh hưởng, nguồn/snapshot/ảnh hoặc chứng từ cần thiết, người nhận, hạn xử lý đã thống nhất, trạng thái và quyết định. Không gán sẵn thời hạn SLA không có người chấp nhận.

| Ngoại lệ | Người nhận | Dữ liệu phải xem | Hành động hợp lệ | Chỉ đóng khi |
|---|---|---|---|---|
| Khách thiếu quà phải trả | Quản lý bán hàng | Lịch sử P/E/G/W, điều kiện chương trình, nguồn quà | Thu hồi có biên nhận; waiver theo nguồn; thỏa thuận khác có duyệt | Nghĩa vụ được xử lý đủ, không tự tạo nợ |
| Trả thiếu nguồn | Kế toán + kho | Hàng đã nhận, chứng từ ngoài, Customer thực | Giữ hộ; ghép nguồn hoặc chứng từ chấp nhận có giá trị duyệt | Lượng/tiền/cost có căn cứ, người nhận tiền xác định |
| Thiếu hàng khi đếm/chốt xe | Kho + vận hành | Manifest, journal, chuyển hàng, count scope/watermark | Đếm lại; tiếp nhận lệnh muộn; adjustment được duyệt | Chênh có nguồn/quyết định; không tự thành nợ nhân viên |
| Thiếu tiền nộp | Thủ quỹ + kế toán | Receipt khách, hoàn, bàn giao tiền, tiền thực | Nhận phần thực nộp; hồ sơ thiếu riêng | Trách nhiệm phần còn lại rõ; không phục hồi nợ khách đã trả |
| Phí muộn/kỳ khóa | Kế toán | Chứng từ phí, nguồn, cost recipients, kỳ áp dụng | Điều chỉnh kỳ mở; hoặc thủ tục mở kỳ có phê duyệt | Tổng phân bổ đủ, source version/khóa kỳ đối chiếu được |
| Provider tính khác net/VAT/gross | Kế toán + tích hợp | Snapshot UI/sổ, payload, bản trả về | Xác minh mapping/profile; chứng từ điều chỉnh được duyệt nếu cần | Không còn lệch chưa giải thích, không ghi hai khoản nợ |
| Thu ngân hàng chưa rõ | Kế toán/đối soát | Thông tin chuyển, sao kê được phép, reference | Xác nhận hoặc từ chối có lý do; giữ pending trước đó | Chỉ một receipt được ghi cho tiền thực nhận |
| Export trùng/xung đột/unknown | Kế toán + vận hành tích hợp | ID/hash/import receipt/external voucher | Tra cứu; retry nguyên payload; event sửa mới | Bên nhận xác nhận số phát sinh đúng và có liên kết |
| Lệnh ngoài quyền nhưng đã giao/thu | Vận hành + kế toán | Gói quyền/giá, journal, sự kiện thực, hàng/tiền/hóa đơn | Ghi bền ngoại lệ; quyết định ghi sổ/điều chỉnh trong kỳ phù hợp | Hàng, tiền, nợ và nghĩa vụ ngoài hệ thống đều có người xử lý |

## 11. Bằng chứng chạy và điều kiện hoàn tất BS-02/BS-05

Lệnh thực chạy từ root repo:

```bash
python3 reports/2026-11-12-08-khep-quy-tac-va-dac-ta-mvp/kiem-chung-so-lieu.py --output reports/2026-11-12-08-khep-quy-tac-va-dac-ta-mvp/ket-qua-so-lieu.json
```

Kết quả thực tế: **91 checks PASS, 18 event snapshots; exit code 0**. JSON sinh từ script, không gõ lại kết quả vào file. Hash và phạm vi kiểm tra ghi trong [hồ sơ nguồn](nguon-nghiep-vu.md#3-bang-chung-chay-so-hoc).

| Yêu cầu R007/B007 | Phần đã có trong R008-B | Phần chưa được chứng minh |
|---|---|---|
| F02/E2E-13 | Quy tắc G/W, trạng thái accepted, hai chuỗi quà và kết quả tính | Engine, UX giải thích, điều kiện thương mại được Owner duyệt |
| F03/E2E-14 | Công thức tích lũy, phản ví dụ, phân mảnh trả, nguồn đã điều chỉnh | Ghi đồng thời/version lock; hạch toán/cost lineage phức tạp |
| E2E-15 | Hạn từng delivery, giữ terms snapshot, đổi Customer/amendment/múi giờ | Thỏa thuận thật, báo cáo tuổi nợ ở sản phẩm |
| E2E-16 | 100/100=0;100/60=40; ngân hàng pending/có dư giữ riêng | Atomic transaction/retry/concurrency của server và thiết bị |
| BS-02 tiền/thuế | Inclusive/exclusive, giảm phần dư, hoàn source components, receipt/refund, số từng bước | Hồ sơ thuế thật, kế toán tính độc lập, provider round trip và điều chỉnh hóa đơn |
| BS-05/E2E-21 | Hai ngày + kỳ khóa, phí muộn/trả nguồn cũ, count scope, export ID/hash, exception owners | Chứng từ pilot, thao tác kho/kế toán thực, import vào hệ thống kế toán được chọn |

**Điều kiện nghiệm thu tiếp theo:** kế toán và người triển khai tính độc lập ra đúng bộ số hoặc ghi một profile sửa được phê duyệt với bộ số mới; Owner chấp nhận các chính sách ảnh hưởng quà/tiền/tín dụng; provider xác nhận hợp đồng tính/điều chỉnh; sản phẩm chạy các ca cùng định danh và giữ số dư trung gian. Chỉ khi đó mới chuyển từng phần từ `arithmetic/model verified` sang `approved` hoặc `product verified`. B007 yêu cầu người phụ trách kế toán và triển khai cùng đối chiếu; việc script của đợt nghiên cứu chạy thành công chưa hoàn tất điều kiện đó.
