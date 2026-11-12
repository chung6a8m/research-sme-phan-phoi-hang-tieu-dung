# R008 — Hồ sơ hóa đơn, chứng từ cấp xe và bảo vệ dữ liệu

- Mốc nghiên cứu và áp dụng: **12/11/2026**, Asia/Bangkok; kiểm tra nguồn trong phiên ngày 12/11/2026.
- Phạm vi: **BS-03**, phần thuế của BS-02 và phần pháp lý dữ liệu của BS-04 trong [B007](../../briefs/2026-11-12-07-kiem-chung-va-chot-dac-ta-mvp.md).
- Baseline: R007/B007 tại HEAD `d1ef1627f2b624bba2d01d32a3cf77eb35a7cf18`; giữ nguyên R006/R007 làm hồ sơ lịch sử.
- Loại đầu ra: **kết quả đối chiếu nguồn sơ cấp, đặc tả ứng viên và ca kiểm chứng có kết quả kỳ vọng**. Chưa có hồ sơ NPP, quyền API, sandbox, thiết bị hoặc giao dịch thật. Không ghi các ca đó là đã đạt.
- Mọi tên lệnh, trạng thái, ID mẫu và chính sách kỹ thuật trong phụ lục này là **thiết kế đề nghị của dự án**, trừ trường được ghi rõ là quan sát trong tài liệu provider. [Sổ nguồn và giới hạn](nguon-phap-ly.md).

## 1. Những kết luận đã khép ở mức nghiên cứu

1. **Có thể chuẩn bị một luồng A+B cụ thể mà không coi B là bị cấm khi ngoại tuyến.** Nghĩa vụ lập hóa đơn gắn với chuyển quyền/từng lần giao; tính hợp lệ của cơ chế lập ngoại tuyến phải được chứng minh theo hồ sơ người bán, loại hóa đơn và giải pháp sử dụng. Lưu nháp trong PWA không tự đáp ứng nghĩa vụ ấy. NĐ254/2026 Điều 9(1), (3); Phụ lục điểm 7. [PL01](nguon-phap-ly.md#pl01)
2. **Chứng từ cấp xe là một luồng riêng.** NĐ254 Điều 6(3)(đ) quy định xuất hàng bán lưu động dùng phiếu xuất kho kiêm vận chuyển nội bộ (PXKVCNB), khi bán lập hóa đơn điện tử. Điều 8(7) quản lý loại phiếu này như hóa đơn; một phiếu điều chuyển nội bộ do DMS tự đặt tên chưa chứng minh đã là chứng từ phù hợp. [PL01](nguon-phap-ly.md#pl01)
3. **Có hồ sơ áp dụng, ánh xạ trường và contract đủ để chuẩn bị adapter.** Phương án nghiên cứu là một adapter, một hồ sơ người bán được chấp nhận tại một thời điểm, định danh ý định bất biến, tra cứu trước khi gửi lại sau kết quả chưa rõ. Chưa chốt provider thương mại hay tuyên bố API đã đạt.
4. **Tiền hàng chuẩn phải đi cùng chứng từ chuẩn.** Bộ tính toán giả lập 8%/10% dùng để kiểm toán học; không xác nhận thuế suất SKU. `taxTreatment`, `taxRate`, giá tính thuế và mã provider là các trường riêng; tổng trên UI, sổ và hóa đơn phải đối chiếu từ cùng snapshot.
5. **Vai trò dữ liệu đi theo hoạt động thực tế.** NPP có thể là bên kiểm soát dữ liệu tác nghiệp; SaaS xử lý theo hợp đồng, đồng thời có vai trò khác với dữ liệu tài khoản hoặc thanh toán của chính mình. Cloud/provider không mặc nhiên cùng một vai trò cho mọi luồng. Luật91 Điều 2, 37; NĐ356 Điều 12. [PL03–PL04](nguon-phap-ly.md#pl03)
6. **Restore phải phục hồi nghĩa vụ hiện hành.** Quyền đã thu hồi, yêu cầu hạn chế/xóa đã được chấp nhận và hóa đơn đã phát hành phải được đối chiếu với nguồn ngoài phần backup bị lùi trước khi mở lại hệ thống. Luật91 Điều 14(3)–(5) là căn cứ chống khôi phục trái phép dữ liệu đã xóa; không buộc xóa chứng từ còn nghĩa vụ pháp lý. [PL03](nguon-phap-ly.md#pl03)
7. **Baseline thủ tục ngày 12/11 phải gồm NQ22/2026.** Nghị quyết đã có hiệu lực từ 29/04/2026; không chỉ là kế hoạch tương lai. Phần tương ứng của NĐ356 phải đọc cùng cơ chế phân cấp và đơn giản hóa trong NQ22. [PL05](nguon-phap-ly.md#pl05)
8. **NĐ392/2026 chưa có hiệu lực ngày nghiên cứu.** Từ 15/11/2026, thời hạn/cách tiếp nhận một số thủ tục thay đổi; hồ sơ đã được tiếp nhận trước đó có chuyển tiếp tại Điều 49(3). Không áp thời hạn mới cho mọi hồ sơ chỉ vì ngày chạy pilot nằm sau 15/11. [PL06](nguon-phap-ly.md#pl06)

## 2. Hồ sơ người bán–thuế–hóa đơn–provider

### 2.1. Một hồ sơ có phiên bản, chứng cứ và phạm vi

Đề xuất `InvoiceComplianceProfile`. Không dùng `tenantId` thay mã người bán. Mỗi hồ sơ lưu `profileId`, `version`, `effectiveFrom`, `effectiveTo`, `evidenceRefs`, `approvedBy`, `approvedAt`, `status`. Giá trị `status` là `DRAFT`, `REVIEWED`, `ADMITTED` hoặc `SUSPENDED`; thiếu thông tin bắt buộc thì giữ `DRAFT`, không điền giá trị mẫu vào môi trường thật.

| Nhóm | Trường phải có | Chứng cứ/kiểm soát và người chịu trách nhiệm |
|---|---|---|
| Chủ thể | `tenantId`, `sellerId`, tên pháp lý, MST, địa chỉ, chi nhánh/đơn vị xuất; người đại diện/ủy quyền | Hồ sơ đơn vị và phạm vi người ký; kế toán NPP kiểm. Profile MVP ứng viên theo Q01 là một người bán/tenant; nhiều người bán trong một tenant nằm ngoài profile, cần Owner mở lại phạm vi/Q01 trước khi hỗ trợ |
| Quyền sở hữu | `ownershipModel`, người sở hữu hàng, người bán, bên phải thu, bên thu hộ; hợp đồng gốc | Tách mua đứt bán lại với đại lý bán đúng giá hưởng hoa hồng. Chưa xác định thì không dùng chung workflow của nhà bán lại |
| Thuế | `vatMethod`, phạm vi trong nước/xuất khẩu, danh mục `skuTaxProfileId/version`, ngày hiệu lực | Phương pháp khấu trừ/direct ảnh hưởng loại hóa đơn; không suy từ nhãn SME hoặc FMCG |
| Loại và phương thức hóa đơn | `documentKind`, `invoiceMode` có mã/không mã/máy tính tiền, thông báo đăng ký được chấp nhận, mẫu/ký hiệu sử dụng | NĐ254 Điều 6, 8; kế toán kiểm đăng ký, trạng thái được sử dụng và mẫu hiện hành |
| Mốc giao | Quy tắc chuyển quyền A/B, bằng chứng giao, múi giờ; trường hợp giao nhiều lần | Hợp đồng và quy trình thực; không lấy ngày thu tiền hoặc ngày sync thay mốc chuyển quyền |
| Ủy nhiệm/ký | Bên lập, căn cứ ủy nhiệm nếu có; loại chữ ký, tham chiếu chứng thư, hạn hiệu lực, vai trò được ký | TT91 Điều 9 về ủy nhiệm; bí mật ký chỉ nằm trong cơ chế server/provider phù hợp |
| Vận chuyển | `transportDocumentProfileId`, mẫu PXKVCNB, hệ thống lập, người lập/kiểm/giữ/tra cứu; bằng chứng đăng ký | Bắt buộc xác định trước xuất hàng bán lưu động; có thể nằm ngoài DMS nhưng phải có đường bàn giao ở mục 4 |
| Provider | Tên dịch vụ, pháp nhân hợp đồng, `adapterVersion`, tài khoản của người bán, môi trường, phiên bản tài liệu được cấp | Không lấy public demo làm tài khoản dự án; không trộn API tạo nháp với API phát hành |
| Năng lực đã kiểm | Tạo/ ký/ cấp mã/ gửi CQT/tra cứu/điều chỉnh/PXK; idempotency, lookup window, callback authentication | Mỗi khả năng có `DOC_ONLY`, `SANDBOX_VERIFIED` hoặc `PRODUCTION_ADMITTED`, liên kết bằng chứng; không suy khả năng còn lại từ một endpoint |
| Tiền và mã thuế | `moneyProfileVersion`, quy tắc làm tròn, cấu hình tính của provider; `taxCodeMapVersion` | Kế toán và kỹ thuật đối chiếu cùng fixture; thay cấu hình phải tạo phiên bản mới |
| Ngoại lệ | Người trực, thời gian phản hồi nội bộ, kênh ngoài hệ thống, người quyết định xử lý sự cố | Có người cụ thể khi pilot; bảng vai trò trong nghiên cứu không được giả thành nhân sự đã nhận việc |

NĐ254 Điều 8(1)–(2) phân loại GTGT/bán hàng theo đối tượng và phương pháp thuế; Điều 6 quy định phương thức sử dụng. Đăng ký, ký và mẫu là dữ liệu áp dụng của người bán, không phải một lựa chọn giao diện tùy ý. [PL01](nguon-phap-ly.md#pl01), [PL02](nguon-phap-ly.md#pl02)

`SkuTaxProfile` tối thiểu gồm `skuId`, bản chất/phân loại hàng có chứng cứ, `taxTreatment`, `rate` nếu có, cách xác định giá tính thuế, căn cứ pháp luật và hồ sơ hàng, hiệu lực, người kiểm. Quà khuyến mại có giá tính thuế bằng 0 không đồng nghĩa thuế suất 0%; quà biếu/tặng có thể có giá tính thuế khác số tiền thu của khách. Phần giá tính thuế và hồ sơ khuyến mại kế thừa những điều đã đối chiếu tại [R006-L mục 5](../2026-11-11-06-ket-qua-nghien-cuu-mvp/hoa-don-va-tuan-thu.vi.md), không xác nhận chương trình hay SKU thật trong R008.

### 2.2. Cây quyết định áp dụng A/B

Đi theo thứ tự; một nhánh chưa có chứng cứ dừng **việc cho phép phát hành tự động của nhánh đó**, không xóa dữ liệu tác nghiệp đã xảy ra.

| Bước | Câu hỏi và nhánh | Kết quả cấu hình |
|---|---|---|
| 1 | NPP có mua và sở hữu hàng để bán lại? | Có: dùng mô hình nhà bán lại. Không/đại lý: xác định bên giao đại lý, người xuất hóa đơn và Điều 6(3)(d) trước khi nhập vào scope |
| 2 | Người bán và phương pháp VAT đã xác nhận? | Khấu trừ và hoạt động thuộc Điều 8(1): GTGT. Trực tiếp/trường hợp Điều 8(2): hóa đơn bán hàng. Nhánh xuất khẩu/phi thuế quan cần hồ sơ riêng |
| 3 | Phương thức được đăng ký và đủ điều kiện là gì? | Có mã/không mã/máy tính tiền theo Điều 6 và bằng chứng đăng ký. Bán theo xe không tự là máy tính tiền. Điều 6(1)(c) còn có trường hợp không bắt buộc chuyển sang máy tính tiền nếu đã đăng ký hình thức tại điểm a/b |
| 4 | Đây là chuyển kho/cấp xe hay giao bán? | Cấp xe bán lưu động: PXKVCNB, chưa tạo khoản phải thu bán hàng. Giao bán: hóa đơn theo từng mốc Điều 9. Thu nợ sau bán: chứng từ thu, không tạo hóa đơn bán lần hai |
| 5 | Ở mốc chuyển quyền, có kênh lập hóa đơn phù hợp đã kiểm chứng? | Có: luồng giao–lập theo hồ sơ. Chỉ có queue PWA: chưa đủ. Có cơ chế provider ngoại tuyến/cấp mã/MTT hợp lệ: đưa vào nhánh riêng sau kiểm chứng, không suy từ quảng cáo |
| 6 | Mất mạng/sự cố đã xảy ra trước hay sau giao thực tế? | Trước giao và không có kênh hợp lệ: dừng trước chuyển giao. Sau giao: ghi sự kiện thực, mở ngoại lệ, áp Điều 14 nếu có căn cứ, không lùi ngày để che lỗi |
| 7 | Giao sai, trả hay lỗi hóa đơn? | Phân loại theo TT91 Điều 10; trả hàng thông thường khác nhập sai nội dung; tạo chứng từ liên kết, giữ bản gốc |

Đây là cây áp dụng có điều kiện từ NĐ254 Điều 6, 8, 9, 14 và TT91 Điều 10. [PL01–PL02](nguon-phap-ly.md#pl01)

**Profile MVP ứng viên `INV-CAND-01`:** NPP mua đứt bán lại hàng trong nước; một `sellerId` đã xác minh cho mỗi tenant theo Q01 ứng viên trong [đặc tả](dac-ta-mvp-de-nghi.vi.md); nếu hồ sơ thật là khấu trừ và sử dụng hóa đơn có mã thì triển khai nhánh GTGT có mã; A+B dùng cùng contract; lập qua kênh online tại mốc chuyển quyền; PXKVCNB do provider hoặc hệ thống kế toán hiện hữu tạo với bàn giao bắt buộc; điều chỉnh trả có gốc; một adapter. Đây là phương án chuẩn bị cụ thể, **không phải kết luận mọi NPP đều phù hợp**. Nếu hồ sơ thật khác, thay profile trước khi nhập dữ liệu thử và trình Owner quyết định lại phạm vi nếu vượt Q01; không ép người bán đổi chế độ thuế để vừa ứng dụng.

## 3. Timeline lập–ký–gửi và phạm vi ngoại tuyến

### 3.1. Tách mốc pháp lý khỏi mốc kỹ thuật

| Mốc | Ý nghĩa/căn cứ | Trường và bằng chứng đề nghị |
|---|---|---|
| Chuẩn bị giao | A duyệt đơn hoặc B chọn hàng chưa tự là chuyển quyền; NĐ254 Điều 9(1) | `orderConfirmedAt`, snapshot giá/UoM/thuế; không đánh dấu đã lập hóa đơn |
| Xuất hàng bán lưu động | PXKVCNB theo Điều 6(3)(đ), 8(7); giữ liên kết lệnh điều động | `loadEventId`, `transportDocId`, người giao/nhận, bản chứng từ tra cứu được |
| Chuyển quyền/giao từng lần | Lập hóa đơn tại thời điểm chuyển sở hữu/quyền sử dụng, không phụ thuộc thu tiền; từng lần giao có khối lượng/giá trị tương ứng. Điều 9(1), (3) | `deliveryEventId`, `transferOccurredAt`, nguồn xác nhận; `invoiceIntentId` được tạo theo cùng sự kiện |
| Hóa đơn đã lập | Phải có bằng chứng của cơ chế lập đúng định dạng/nội dung; không suy từ DB insert hoặc HTTP 200. Điều 4(1), 10 | Dữ liệu gốc, số/ký hiệu khi áp dụng, ngày lập, dấu vết tạo từ hệ thống lập; `creationEvidenceRef` |
| Ký và gửi xin mã/đến CQT | Nếu hóa đơn đã lập có thời điểm ký khác lập: chậm nhất ngày làm việc tiếp theo đối với ký và gửi xin mã, hoặc chuyển dữ liệu hóa đơn không mã; ngoại lệ bảng tổng hợp/bảng chi tiết Điều 16. Phụ lục điểm 7 | `signedAt`, `taxSubmittedAt`, loại deadline và lịch ngày làm việc; không đổi thành hạn lập mới |
| Hóa đơn có mã đến người mua | Gửi ngay sau nhận hóa đơn có mã theo Điều 15(3) | `taxCodeReceivedAt`, `buyerDeliveryStatus`, chứng cứ gửi; cấp mã và người mua đã nhận là hai việc |
| Hóa đơn không mã thông thường | Chuyển đầy đủ nội dung; gửi người mua và đồng thời gửi CQT chậm nhất ngày làm việc tiếp theo kể từ lập. Điều 16(3)(a.3) | Kênh truyền, receipt CQT, nhật ký chuyển cho người mua |
| Máy tính tiền | Điều 8(9)(b) không bắt buộc chữ ký số; Điều 15(3) gửi dữ liệu CQT cuối ngày, có ngoại lệ dịch vụ riêng; Điều 10(4) về nội dung/giao cho người mua | Profile máy tính tiền riêng; không dùng deadline này cho hóa đơn thường |

Nguồn: bản ký NĐ254, nhất là trang PDF 11, 16, 21–27, 52, 54. [PL01](nguon-phap-ly.md#pl01)

Trong log lưu cả ngày lập trên chứng từ và các timestamp kỹ thuật. Nếu provider chỉ trả ngày, không bịa giờ/phút lập từ thời gian HTTP response. `recordedAt`, `providerAcceptedAt`, `observedAt` và `transferOccurredAt` có nghĩa riêng. Lệch đồng hồ thiết bị được đánh dấu và đối chiếu; không tự sửa sự kiện quá khứ thành giờ server. Trước giao chạy preflight đăng ký/chữ ký/kết nối/quyền; thao tác giao và lập thực hiện theo quy trình tại mốc chuyển quyền. Một lỗi phát sinh sau giao vẫn là ngoại lệ phải xử lý, dù preflight vừa thành công.

### 3.2. Ma trận phạm vi B khi mạng gián đoạn

| Điều kiện đã xác định | Hành vi MVP ứng viên | Bằng chứng để mở rộng |
|---|---|---|
| PWA offline; chưa chuyển hàng/tiền | Cho ghi nháp, quan sát, viếng thăm, chuẩn bị thông tin trong quyền đã cấp. Chưa thông báo hóa đơn đã lập | Không cần giả hóa đơn cho nháp |
| PWA mất data nhưng văn phòng/provider còn kênh nhận dữ liệu và lập đúng mốc | Có thể dùng quy trình điều phối có định danh chung; phải thống nhất nội dung thực giao, người lập và cách chuyển hóa đơn | Chạy INV-09 với thiết bị/kênh thật, đối chiếu timestamp và chứng từ |
| Có giải pháp thực sự lập ngoại tuyến theo hình thức đã đăng ký | Có thể xét cho phép bán trong phạm vi được chứng minh; theo dõi ký/truyền đúng hạn | Chứng cứ số/ký hiệu, nội dung không thể sửa âm thầm, cơ chế mã khi áp dụng, log lập/ký/gửi, xử lý trùng và ngày làm việc; xác nhận kế toán/provider |
| Chưa có kênh hợp lệ; chưa giao | Giữ tác vụ ở `WAITING_INVOICE_CHANNEL`, chuyển điểm có kết nối hoặc chờ điều phối trước giao | Đây là giới hạn vận hành của profile, không phải tuyên bố pháp luật cấm mọi bán offline |
| Đã thực tế giao/thu dù kênh lập bị lỗi | Ghi sự kiện thực và người thực hiện; tạo ngoại lệ có tuổi và owner; báo kế toán; đối chiếu điều kiện Điều 14 | Không rollback hàng/tiền đã thực tế chuyển; không ghi ngày hồi tố để làm ca đạt |
| Thu nợ cũ offline trong quyền được cấp | Có thể ghi chứng từ thu và phân bổ theo contract tiền; không phát sinh hóa đơn bán mới | Liên kết khoản phải thu gốc; thử retry một lần hiệu ứng |

**Sự cố không có một deadline chung.** NĐ254 Điều 14(1) yêu cầu liên hệ hỗ trợ đối với người dùng hóa đơn có mã; khoản 2 quy định dự phòng/thông báo và khả năng ủy quyền cấp mã khi hệ thống CQT lỗi; khoản 3 trách nhiệm provider; khoản 4 cho phép tạm chưa truyền hóa đơn không mã khi hệ thống thuế lỗi và truyền trong **2 ngày làm việc từ thông báo hoạt động lại**; khoản 5 quy định trường hợp bất khả kháng đủ điều kiện, lập/gửi trong **3 ngày làm việc từ khắc phục**, có sổ giao dịch và chứng cứ. Khoản 6 xử lý quá hạn do các nguyên nhân của Điều 14. Sóng yếu thông thường không tự chứng minh bất khả kháng, cũng không được loại trừ mọi sự cố mà chưa xét nguyên nhân. [PL01](nguon-phap-ly.md#pl01)

## 4. Cấp xe → vận chuyển → giao từng phần → trả/hàng dư

### 4.1. Trường chứng từ và định danh nối chuỗi

NĐ254 Phụ lục điểm 9(g) yêu cầu PXKVCNB thể hiện thông tin lệnh điều động, người nhận/người xuất, kho xuất/nơi nhận và phương tiện. Tên/địa chỉ người mua–bán trên biểu mẫu thể hiện các chủ thể/địa điểm tương ứng; **không thể hiện tiền thuế, thuế suất, tổng tiền thanh toán**. Không dùng mẫu hóa đơn bán điền khách là “xe” rồi tính VAT cho điều chuyển. [PL01](nguon-phap-ly.md#pl01)

`TransportDocumentRecord` đề nghị gồm: `transportDocId`, `sellerId`, `tripId`, `loadEventId`, loại phiếu, mẫu/ký hiệu/số, ngày lập, `movementOrderNo/date`, người ra lệnh, người xuất, người nhận, người vận chuyển và người lái nếu khác, kho xuất/nơi nhận, phương tiện/biển số, dòng SKU/UoM/số lượng, `sourceSystem`, `externalDocId`, `artifactRef/hash`, trạng thái, người kiểm và lúc kiểm. Số/ký hiệu thực lấy từ hệ thống có thẩm quyền; ID trong DMS không thay chúng.

### 4.2. Fixture lượng E2E-20, tách khỏi bộ tiền/thuế BS-02

Giả lập một SKU, đơn vị cơ sở là chai, kho chính đầu có 200; xe đầu 0; NPP sở hữu hàng. Khách dự kiến nhận 80, thực nhận hai lần 60/20; sau đó trả 5 có gốc. Số 80 là nhu cầu ban đầu: mỗi lần B ghi bán/giao theo lượng thực, không tạo khoản phải thu 80 trước khi giao. Không gán thuế suất hoặc người bán thật.

| Bước/ID | Chứng từ và sự kiện | Kho chính | Xe bán được | Xe cách ly | Kết quả hóa đơn/phải thu |
|---|---|---:|---:|---:|---|
| Đầu kỳ | `OPEN-20` | 200 | 0 | 0 | Không có bán mới |
| Cấp 100 | `LOAD-20`, lệnh `MOVE-20`, PXKVCNB `PXK-20-OUT`, chuyến `TRIP-20` | 100 | 100 | 0 | Điều chuyển; doanh thu/phải thu tăng **0** |
| Giao lần 1: 60 | `DEL-20-1`, nguồn hàng `LOAD-20`; ý định `INV-20-1` | 100 | 40 | 0 | Hóa đơn lượng 60 tại mốc lần giao 1 |
| Giao lần 2: 20 | `DEL-20-2`, ý định `INV-20-2` | 100 | 20 | 0 | Hóa đơn lượng 20; không đợi kết thúc chuyến mới lập 80 |
| Khách trả 5 từ lần 1 | `RET-20-1` → `DEL-20-1`/hóa đơn gốc; nhận vào cách ly chờ phân loại | 100 | 20 | 5 | Luồng điều chỉnh lượng/giá trị 5 theo hồ sơ trả; không sửa hóa đơn cũ |
| Đưa hàng về | Lệnh về `MOVE-20-BACK`, chứng từ vận chuyển về theo profile; `UNLOAD-20` nhận 20 tốt + 5 cách ly | 120 tốt + 5 cách ly | 0 | 0 | Hàng chưa bán quay về không tạo hóa đơn bán/credit. Trả khách đã có `RET-20-1`, không giảm phải thu lần hai |

Kết quả đối chiếu: cấp 100 − giao 80 + khách trả 5 − nhập lại 25 = xe 0; tổng tồn NPP cuối = 125; bán thuần = 75. Chuỗi chứng từ bán là 60 + 20 và chứng từ điều chỉnh phần trả 5, khác hai lần điều chuyển. **Phép cộng/trừ lượng này đã được tính trong nghiên cứu; E2E ứng dụng/provider chưa chạy.**

Trả hàng thông thường theo TT91 Điều 10(5)(c.1): người bán lập điều chỉnh; có nhánh thỏa thuận người mua lập hóa đơn trả lại. Hồ sơ trả phải đầy đủ. MVP ứng viên chọn nhánh người bán điều chỉnh có hóa đơn gốc; nhánh bên mua lập được tiếp nhận như chứng từ ngoài có kiểm tra, không tự động tạo thêm điều chỉnh phía bán. Sai hóa đơn và trả hàng dùng lý do/luồng riêng; máy tính tiền lập sai thuộc nhánh thay thế Điều 10(1)(c). [PL02](nguon-phap-ly.md#pl02)

Với lượt về, việc tạo lệnh/phiếu cho phần hàng vận chuyển về là đề xuất quy trình chứng từ nhằm đối chiếu đường về; không viện Điều 6(3)(đ) như một điều khoản quy định riêng mọi tình huống nhập lại. Kế toán chốt biểu mẫu/đăng ký phù hợp tuyến thực và nguồn hàng. Hàng còn trên xe qua ngày giữ nguyên chủ sở hữu/vị trí; không giả lập đã nhập kho chỉ để đóng ngày.

### 4.3. Bàn giao khi hóa đơn hoặc PXK nằm ngoài MVP

| Tác vụ | Người chịu trách nhiệm thực hiện | Dữ liệu/bằng chứng bắt buộc | Điều kiện nhận/đóng |
|---|---|---|---|
| Kho đề nghị cấp xe | Thủ kho | `tripId`, `loadEventId`, dòng lượng, lệnh điều động, người nhận/phương tiện | Kho chưa xác nhận xe rời khi chứng từ cần dùng còn thiếu |
| Lập PXKVCNB bên ngoài | Kế toán/người được phân công của NPP | `handoffId` trùng trên phiếu yêu cầu, ID nguồn, số/ký hiệu/ngày, dữ liệu gốc và bản đọc, người lập | Người kiểm đối chiếu seller, lượng, nơi đi/đến, trạng thái; giữ hash/link ổn định |
| Người giao giữ/tra cứu | Người giao; lái xe nhận thông tin cần thiết | Mã chứng từ và bản có thể xuất trình trong điều kiện tuyến, quyền xem giới hạn | Thử tra cứu thực tế trước xuất phát; link hết hạn không đủ |
| Phát hành hóa đơn bán | Kế toán hoặc luồng ký được ủy quyền | `invoiceIntentId`, `deliveryEventId`, snapshot hash, ID/số/ký hiệu ngoài và tiến trình CQT/người mua | Chỉ một bên có quyền phát hành cho cùng ý định; không bật song song manual và auto không khóa |
| Đối soát cuối chuyến | Kho + kế toán, điều phối theo ngoại lệ | Bảng cấp/bán/trả/dư, registry chứng từ, danh sách `UNKNOWN` hoặc thiếu | Kết thúc kiểm hàng không tự đóng ngoại lệ hóa đơn; có owner và trạng thái bền |
| Sửa/điều chỉnh | Kế toán | `correctionRequestId`, lý do, chứng từ gốc, loại xử lý, ID mới | Giữ lịch sử; nhận từ hệ thống ngoài không tạo lại nghiệp vụ tồn/thu/nợ |

Mỗi `ExternalDocumentHandoff` có `handoffId`, `responsibleRole`, người nhận thực khi pilot, `requestedAt`, `acceptedAt`, `externalSystem`, `externalId`, `evidenceRefs`, `verifiedBy`, `status` (`REQUESTED/ACCEPTED/RETURNED_WITH_DOCUMENT/VERIFIED/EXCEPTION`). Chưa nhận người thực thì trạng thái hồ sơ là chưa đủ admission; không dùng tên vai trò như bằng chứng đã có người làm. Thu hồi quyền người lập không xóa trách nhiệm đang mở: chuyển giao có dấu vết cho người khác.

## 5. Bằng chứng provider và lựa chọn tích hợp có điều kiện

### 5.1. Đã đọc được gì trong R008

| Provider/nguồn | Bằng chứng quan sát được | Sử dụng trong đặc tả và giới hạn |
|---|---|---|
| MISA meInvoice, trang tham số công khai trên `testapp.meinvoice.vn` | Đọc trực tiếp: ID hóa đơn/chi tiết, mẫu/ký hiệu, ngày, trạng thái; tiền hàng/chiết khấu/thuế/tổng; trường lệnh/địa điểm/người vận chuyển. [API01](nguon-phap-ly.md#api01) | Cơ sở ánh xạ dữ liệu và PXK. Ví dụ có ký hiệu/ngày cũ, không chứng minh phiên bản được hỗ trợ tháng 11/2026 hoặc sandbox dự án |
| MISA trang Help/API và tài liệu integration | Help/schema từng đọc ở R006 hiện có URL trả 403; một số trang `doc.meinvoice.vn` trả 404; chỉ mục còn nội dung. [API02](nguon-phap-ly.md#api02) | Ghi sự thay đổi mức truy cập. Không coi endpoint đã được xác nhận hoạt động hoặc dùng snippet làm bảo đảm retry |
| VNPT Invoice, mô tả SOAP công khai trên subdomain demo | Đọc danh sách operation và request/response mẫu `ImportAndPublishInvMTT32`, gồm `xmlInvData`, `pattern`, `serial`; trang chỉ trả mô tả, không gọi phát hành. [API03](nguon-phap-ly.md#api03) | Xác nhận có bề mặt tích hợp được tài liệu hóa. Chưa đọc được contract XML bên trong, chống trùng, số tiền, PXK hay quyền sử dụng demo |
| SInvoice, PDF kỹ thuật trên website Viettel Solutions | Đọc được các nhóm seller/buyer/items/tax/totals, `transactionUuid`, tham chiếu chứng từ gốc. [API04](nguon-phap-ly.md#api04) | Tài liệu có ví dụ 2017–2018 và điểm không nhất quán; dùng để đặt yêu cầu, không triển khai nguyên endpoint hay suy khả năng hiện tại |

**Lựa chọn đề nghị:** nếu NPP đã có provider đáp ứng INV/E2E-20, ưu tiên adapter cho provider đang dùng. Nếu chưa có ràng buộc, meInvoice là ứng viên đầu để lấy contract/sandbox vì có schema tiền và vận chuyển đọc được. Đây là thứ tự kiểm chứng dựa bằng chứng hiện có, không xếp hạng chất lượng/giá/thị phần. Không gọi API xác thực, đăng ký, thanh toán, ký hoặc gửi hóa đơn trong đợt này.

### 5.2. Đối chiếu tiền và mã thuế

Canonical snapshot trong [BS-02 — nghiệp vụ và số liệu](nghiep-vu-va-so-lieu.vi.md) là nguồn để so sánh; không cho provider tự thay tổng được chấp nhận mà không báo chênh lệch. Với VND ứng viên, quy tắc làm tròn theo dòng của fixture chỉ là **chính sách nghiên cứu cần kế toán/provider chấp nhận**, không phải điều luật bắt buộc mọi phần mềm phải làm cùng cách. Profile `SYNTHETIC-UNAPPROVED-v1` trong [kết quả tính](ket-qua-so-lieu.json) có `invoice_eligible=false`, `amount_quantum=1`, `ROUND_HALF_UP`, `tax_rounding_scope=line`; chưa dùng để phát hành hóa đơn thật.

| Nghĩa canonical | Trường quan sát trong meInvoice | Quy tắc adapter ứng viên |
|---|---|---|
| Dòng và lượng/UoM | `RefDetailID`, `Quantity`, `UnitName` | ID dòng gắn nguồn giao; lượng hóa đơn đúng UoM snapshot, không lấy quy đổi vừa sửa |
| Giá/tiền trước giảm | `UnitPrice`, `Amount`, `AmountOC` | Giá có thuế được tách theo profile trước mapping; phải xác minh semantic gross/net của version thực |
| Chiết khấu | `DiscountAmount`, `DiscountAmountOC` | Phân bổ theo dòng từ snapshot; không vừa giảm đơn giá vừa trừ thêm lần nữa |
| Thuế theo dòng | `VATRate`, `VATAmount`, `VATAmountOC` | Ánh xạ rate chỉ sau `taxTreatment`; không dùng một giá trị 0 chung cho 0%, không chịu thuế, không kê khai và quà có giá tính thuế 0 |
| Tổng hàng/giảm/thuế/thanh toán | `TotalSaleAmount`, `TotalDiscountAmount`, `TotalAmountWithoutVAT`, `TotalVATAmount`, `TotalAmount` và biến thể `OC` | So từng tổng với snapshot; VND tỷ giá 1 chỉ khi profile quy định. Không dùng ví dụ số trong docs làm fixture đúng |
| Giá sau thuế | `UnitAfterTax`, `AmountAfterTax`; có các alias tổng `WithVAT` | Không gửi đồng thời các alias chưa rõ ưu tiên; nếu bắt buộc thì phải đồng nhất và thử provider có tự tính lại không |
| Dòng khuyến mại | `IsPromotion` | Cờ hiển thị không tự chứng minh căn cứ thuế/khuyến mại; lưu chương trình/căn cứ riêng |

Trường có nguồn tại [API01](nguon-phap-ly.md#api01); phần quy tắc là thiết kế dự án. Trong dữ liệu đọc được, ví dụ của các alias tổng không tạo một bộ số nhất quán để sao chép. Vì vậy, admission của adapter cần bằng chứng XML/JSON **đã lập thực sự**, không chỉ response nhận request hoặc PDF preview.

`TaxCodeMap` lưu `provider`, `apiVersion`, `documentKind`, `canonicalTreatment`, `rate`, `providerCode`, cách biểu diễn null/không áp dụng, hiệu lực và evidence. Trong đợt này `providerCode` cho các nhánh đặc biệt vẫn **chưa được cấp/xác minh**; tuyệt đối không bịa `-1`, `-2`, `KCT` hoặc mã tương tự. Không cho publish SKU có mapping thiếu. Thuế suất 8%/10% trong fixture chỉ là input toán; không là mặc định danh mục hàng.

Ma trận tiền tối thiểu để admission: giá chưa VAT; giá đã VAT; nhiều rate trong một chứng từ; chiết khấu tổng phân về dòng; số lẻ gây phần dư; quà có căn cứ; trả một phần theo snapshot gốc; lặp phần trả đến hết. So lượng, tiền trước giảm, giảm, taxable base, thuế theo nhóm và tổng thanh toán. Nếu UI/sổ/provider của **cùng chứng từ/snapshot** khác 1 đồng, lưu chênh lệch và dừng phê duyệt profile tới khi xác định cách tính/rounding; không dùng tolerance để che khác quy tắc. Kỳ vọng là bằng nhau sau khi áp cùng quy tắc đã chọn, không phải khẳng định pháp luật cấm mọi sai số kỹ thuật 1 đồng.

Các số chuẩn phục vụ chuẩn bị request, lấy từ `multi_day.provider_projection_candidate` của bộ kết quả BS-02:

| Chứng từ giả lập | Tiền chưa thuế | Tiền thuế | Tổng | Ý nghĩa đối chiếu |
|---|---:|---:|---:|---|
| A1 | 442.682 | 38.366 | 481.048 | Nhiều dòng/mức đầu vào; kiểm cả nhóm thuế và tổng |
| R1, trả 11 đơn vị P từ A1 | −162.317 | −12.986 | −175.303 | Thành phần credit phân bổ từ dòng gốc; dấu âm là biểu diễn điều chỉnh đề nghị |
| A2, bán/giao tiếp 11 đơn vị P | 162.317 | 12.985 | 175.302 | Tính cho giao dịch mới; tiền thuế khác độ lớn R1 **1 đồng** là kỳ vọng của fixture, không là lỗi tự sửa |
| B1, giá đầu vào đã thuế | 90.000 | 9.000 | 99.000 | Phải giữ tổng đã thỏa thuận rồi tách base/VAT theo profile |

R1 và A2 không phải hai bản thể hiện của cùng chứng từ. Adapter giữ kết quả của từng nguồn, không ép chúng cùng tiền thuế chỉ vì cùng SKU/lượng. Các số trên và quà giả lập có base 0 vẫn **không có đủ căn cứ phát hành thật**; admission thuế/tiền/provider còn độc lập với kết quả toán học. [Bộ số liệu và phương pháp](nghiep-vu-va-so-lieu.vi.md)

## 6. Contract adapter: prepare, send, lookup, unknown, retry

### 6.1. Dữ liệu và quyền sở hữu hiệu ứng

`InvoiceIntent` có `invoiceIntentId`, `tenantId`, `sellerId`, `deliveryEventId` hoặc `correctionRequestId`, `sourceLineIds`, `documentKind`, `profileVersion`, `moneySnapshotId/hash`, `taxCodeMapVersion`, `clientReference`, `payloadHash`, chứng từ gốc nếu sửa/trả, người yêu cầu và deadline áp dụng. `clientReference` được sinh một lần cho ý định, không đổi do retry hoặc restore. Đổi nội dung sau gửi phải đi nhánh sửa sai; không thay payload dưới cùng khóa.

`ExternalEffectRegistry` giữ ít nhất `invoiceIntentId`, `clientReference`, `payloadHash`, `providerId`, trạng thái và evidence ngoài phạm vi rollback của DB tenant, theo [contract BS-04](offline-va-phuc-hoi.vi.md). Cùng một ý định chỉ có một executor được quyền phát hành, kể cả người thao tác trên giao diện provider. Thêm registry ngoài DB không tự tạo idempotency ở provider: vẫn cần lookup/đối soát và contract được thử.

### 6.2. Lệnh nội bộ, không phải tên endpoint provider

| Lệnh | Điều kiện và thay đổi hợp lệ | Kết quả/ai chịu trách nhiệm tiếp |
|---|---|---|
| `PrepareInvoice` | Kiểm profile, quyền, nguồn giao, mã thuế, tổng, chứng từ gốc. Lưu snapshot/hash, chưa gửi request gây phát hành | `READY` hoặc `BLOCKED` với lỗi cụ thể; kế toán xử lý lỗi hồ sơ, kỹ thuật xử lý mapping |
| `DispatchInvoice` | Khóa ý định; ghi bền request reference/hash và lần gửi trước gọi provider; chỉ từ `READY` hoặc retry được phép | `SENDING`; worker chịu trách nhiệm đến khi có kết quả/ngoại lệ bền |
| `RecordProviderResult` | Xác thực nguồn, đối chiếu tenant/seller/reference/hash; lưu từng phần tử và artifact | `RECONCILED` theo facts thu được, `REJECTED_CONFIRMED` hoặc `UNKNOWN`; HTTP 200 không đủ kết luận |
| `LookupInvoice` | Từ `SENDING` quá hạn phản hồi, `UNKNOWN`, callback thiếu hoặc restore; tra bằng khóa được provider hỗ trợ | `FOUND_MATCH`, `FOUND_CONFLICT`, `NOT_FOUND_UNCONFIRMED`, `NOT_ACCEPTED_CONFIRMED`, `LOOKUP_FAILED` |
| `RetrySameIntent` | Chỉ khi provider đã chứng minh replay cùng reference không tạo mới, hoặc có bằng chứng request cũ chắc chắn chưa được nhận và không còn xử lý | Gửi lại cùng reference/hash; lưu lý do cho phép. Không đổi reference để vượt lỗi trùng |
| `AttachExternalDocument` | Kế toán nhập kết quả đã lập bên ngoài sau khóa quyền phát hành tự động và kiểm đối chiếu | Gắn định danh/evidence, không tạo hàng/nợ/thu lần hai; mismatch vào ngoại lệ |
| `RequestAdjustmentOrReplacement` | Phân loại lỗi/trả, bằng chứng thỏa thuận/thông báo khi cần, ID gốc; ý định mới liên kết gốc | Không mutate XML gốc; điều chỉnh/thay thế theo profile và TT91 |

### 6.3. Trạng thái giao tiếp khác trạng thái pháp lý

`workflowStatus` chỉ mô tả trách nhiệm công việc: `BLOCKED → READY → SENDING`; kết quả đi `UNKNOWN`, `REJECTED_CONFIRMED` hoặc `RECONCILED`. `RECONCILED` nghĩa đã đối chiếu kết quả provider, **không tự nghĩa hóa đơn đã hoàn tất mọi nghĩa vụ**.

Lưu riêng các facts: `creationVerified`, ngày lập/evidence; `signatureRequired/signedAt`; `taxCodeRequired/codeReceivedAt`; `taxSubmissionStatus/receipt`; `buyerDeliveryStatus`; `originalDocumentRef` và `adjustmentChain`. Hóa đơn máy tính tiền có thể không cần chữ ký theo hồ sơ; một callback ký tới sau callback cấp mã không được làm mất fact đã biết. Xung đột facts được cách ly để kiểm, không tự chọn timestamp lớn hơn.

| Kết quả quan sát | Hành vi bắt buộc của thiết kế |
|---|---|
| Timeout sau gửi; không có ID provider | `UNKNOWN`; worker tra cứu và mở case có tuổi, owner, deadline. Client không được tự tạo ý định mới |
| Lookup trả không thấy/404 | Giữ `NOT_FOUND_UNCONFIRMED` nếu chưa có contract xác nhận tính đầy đủ/thời điểm; không suy chắc chưa phát hành |
| Tìm thấy đúng reference và payload/tiền | Gắn ID/artifact, khôi phục facts; không gửi lại phát hành |
| Tìm thấy cùng reference khác nội dung hoặc nhiều tài liệu bất thường | `FOUND_CONFLICT`; khóa gửi, kế toán/provider đối chiếu; không sửa history để chọn kết quả thuận tiện |
| Lỗi validation chắc chắn chưa phát hành | `REJECTED_CONFIRMED`; sửa hồ sơ theo cơ chế version được duyệt. Tách lỗi chắc chắn chưa nhận khỏi lỗi 5xx chưa rõ |
| Callback lặp/sai thứ tự | Xác thực, dedup theo ID/hash; update facts có kiểm soát; callback không làm tăng tồn/nợ/thu |
| Restore về trước khi gửi | Dừng dispatcher; đọc registry, lookup toàn bộ ý định có thể đã tạo hiệu ứng; chưa rõ thì giữ case. Không dùng DB cũ làm bằng chứng chưa phát hành |

Lịch lookup/backoff là cấu hình kỹ thuật, không thay deadline luật. Người trực được báo trước hạn ký/truyền và ngay khi quá hạn; số lần retry không quyết định ca đã được xử lý. `UNKNOWN` chỉ đóng khi có chứng cứ đối chiếu hoặc quyết định xử lý có trách nhiệm, không đóng vì hết số lần thử.

## 7. Bộ kiểm chứng mở rộng INV-01–09 và E2E-20

**Tất cả ca ứng dụng/provider dưới đây: CHƯA CHẠY.** Đã làm riêng: đọc nguồn/schema và tính lượng giả lập mục 4. Không dùng chúng để đánh dấu sandbox đạt.

Gói evidence mỗi lần chạy cần `testRunId`, hồ sơ/version/môi trường, người thực hiện, bước, thời gian UTC và múi giờ, input đã khử dữ liệu không cần thiết, intent/reference/hash, fault injection, response/lookup/callback, tài liệu đã lập, trạng thái CQT/người mua, đối chiếu sổ và verdict. Che credential, mã truy cập công khai và dữ liệu cá nhân trong bản báo cáo; giữ bản gốc ở phạm vi quyền phù hợp.

| Mã | Bước chạy cụ thể | Kết quả kỳ vọng | Evidence quyết định |
|---|---|---|---|
| INV-01 | A đặt 100, giao 60 rồi 40; B bán chịu một giao dịch; thu nợ sau; so sổ trước/sau từng mốc | Mỗi lần giao có hóa đơn lượng tương ứng; nhận đơn/cấp xe/thu nợ không tạo hóa đơn bán mới; phát hành không tăng phải thu lần hai | IDs giao–intent–hóa đơn, timestamp, bản gốc và ledger diff từng bước |
| INV-02 | Gửi; cắt response sau khi provider nhận; lookup ngay rồi lookup khi dữ liệu xuất hiện; khởi động lại worker | Giữ UNKNOWN khi chưa kết luận; tìm lại cùng ID; chỉ một hóa đơn. Thử thêm nhánh provider chắc chưa nhận | Proxy/fault log, reference/hash không đổi, toàn bộ lookup và số hóa đơn của seller |
| INV-03 | Gửi payload A; thử cùng reference payload B khác tiền; thử hai worker gửi đồng thời | Chặn tại adapter/hash; nếu kiểm provider thì ghi hành vi thật. Không sửa A và không phát hành B âm thầm | Hai payload hashes, lock/audit, response conflict, lookup kết quả |
| INV-04 | Nếu adapter hỗ trợ batch, gửi ba phần tử, phần giữa sai mapping; nếu không, gửi ba single tương ứng | Trạng thái riêng từng ý định; không coi cả batch đạt do HTTP 200; chỉ retry phần hợp lệ cho phép | Response từng phần tử, ba registry entries và chứng từ tồn tại. Nhánh batch được ghi N/A nếu MVP không hỗ trợ |
| INV-05 | Hết hạn/thu hồi quyền ký; đăng ký/mẫu không còn được dùng; quyền người lập bị thu hồi giữa chuẩn bị và gửi | Preflight hoặc provider từ chối có lý do; không hiển thị đã phát hành; lỗi sau giao có owner, không xóa giao thực | Evidence cấu hình trong test, log quyền/chữ ký, trạng thái UI và case ngoại lệ |
| INV-06 | Mất callback; callback lặp; thứ tự ký/cấp mã đảo; callback giả/khác tenant | Polling phục hồi; facts không lùi; callback sai bị chặn; không thêm hiệu ứng hàng/tiền | Log xác thực/dedup, lookup độc lập, ledger diff và tenant scope |
| INV-07 | (a) trả 2 rồi phần còn lại; (b) chiết khấu sau bán; (c) quà có/thiếu căn cứ; (d) sai tên khác sai số tiền; (e) máy tính tiền sai nếu profile dùng | Chọn đúng TT91 Điều 10; tham chiếu gốc và dấu tiền đúng; không gộp trả với nhập sai; không lấy cờ quà thay căn cứ VAT | Quyết định kế toán cho từng nhánh, hồ sơ trả/thỏa thuận/thông báo cần thiết, XML mới/gốc, so tiền–thuế |
| INV-08 | Backup trước gửi; phát hành xong ở provider; restore DB; replay lệnh cũ; thêm lệnh quyền đã thu hồi | Lookup nhận lại ID ngoài; không phát hành lần hai; quyền hiện hành được áp trước dispatcher | ExternalEffectRegistry trước/sau, registry provider, recoveryEpoch, log replay và access denial |
| INV-09 | Cắt mạng trước giao, tại mốc giao, sau gửi; thử kênh văn phòng; chỉ thử mode ngoại tuyến khi provider có hồ sơ cơ chế | Phân biệt nháp/đã lập; trước giao không có kênh thì dừng; sau giao giữ sự kiện/ngoại lệ; mode được mở chỉ khi có bằng chứng lập/ký/gửi đúng | Thiết bị/mạng thực, timestamp nguồn, bản gốc, deadline, sự cố Điều 14 nếu áp; không pass bằng backdate |
| E2E-20 | Chạy LOAD100→DEL60→DEL20→RET5→UNLOAD25 mục 4; thử PXK nằm ngoài; cắt mạng lúc cần xuất trình | Xe về 0; tồn tổng 125; chứng từ cấp/về có thể truy xuất, người giữ rõ; hóa đơn 60/20 và xử lý trả5; cấp/nhập xe không tạo doanh thu/nợ | Lệnh điều động/PXK gốc, handoff có người nhận, registry chứng từ, biên bản lượng, lookup ngoại tuyến/online và bảng đối chiếu |

**Mở rộng trong mỗi ca tiền:** chạy cùng fixture với giá đã/chưa VAT, nhiều mức giả lập, chiết khấu phân dòng và phần dư. Đối chiếu số gửi, số provider thực lập và số sổ; không chỉ so PDF. **Mở rộng trong mỗi ca thời gian:** giao hai ngày khác nhau, cuối ngày và trước kỳ nghỉ; tính deadline theo lịch ngày làm việc của profile, không cộng máy móc 24 giờ. **Mở rộng E2E-20:** hàng dư qua ngày chưa nhập, nhập thiếu có kiểm kê, trả từ chuyến cũ, đổi người giữ hàng và phiếu bị thiếu; mọi nhánh có owner và đường sửa, không ép số dư khớp bằng điều chỉnh không nguồn.

Admission của `INV-CAND-01` cần đồng thời: hồ sơ người bán/mẫu/thuế hợp lệ; một kênh lập A+B đã chứng minh; INV-02/03/08 không tạo trùng; tiền đối chiếu; chứng từ cấp xe/đường về tra được; ngoại lệ có người nhận. Không đủ một điều kiện thì giữ nhánh liên quan ở trạng thái chưa cho phép pilot giao dịch thật; phần lập nháp/chuẩn bị khác vẫn có thể tiếp tục.

## 8. Vai trò dữ liệu, lưu giữ và khôi phục

### 8.1. Ma trận hoạt động và vai trò ứng viên

| Hoạt động thực tế | NPP | SaaS | Bên khác và điều kiện |
|---|---|---|---|
| Quản lý khách, điểm bán, đơn/giao/thu của NPP | Thường quyết định mục đích/phương tiện, là bên kiểm soát hoặc kiểm soát và xử lý tùy cách vận hành | Bên xử lý nếu chỉ theo hợp đồng/chỉ dẫn | Hosting/backup có xử lý là bên xử lý tiếp trong chuỗi; `subprocessor` là nhãn quản trị hợp đồng, vẫn phải xác định vai trò theo Luật91 |
| Tài khoản người dùng, hỗ trợ, bảo mật dịch vụ | Quyết định ai được truy cập tenant và mục đích hỗ trợ nghiệp vụ | Có thể kiểm soát/kiểm soát và xử lý đối với mục đích an ninh, quản trị tài khoản của chính SaaS | Không suy mọi log thành dữ liệu tùy dùng; nêu mục đích, thời hạn và người nhận |
| Gửi dữ liệu lập hóa đơn | Người bán chịu trách nhiệm nội dung/hồ sơ và mục đích giao dịch | Xử lý theo lệnh; chỉ nhận phần cần cho tích hợp | Provider có vai trò theo hợp đồng và nghĩa vụ riêng. Nếu NPP ký trực tiếp, không tự gọi provider là subprocessor của SaaS |
| GPS/check-in nhân viên | Mục đích quản lý lao động phải rõ và hợp pháp | Xử lý nếu được giao; không tự khai thác vị trí cho mục đích khác | GPS gắn người là dữ liệu nhạy cảm; quyền vị trí browser chưa thay thông báo/đồng ý pháp lý |
| Phân tích liên tenant để quảng cáo/chấm điểm | Không mặc nhiên nằm trong mục đích tác nghiệp | Có thể phát sinh vai trò kiểm soát mới; chưa thuộc profile MVP này | Không mở chỉ vì dữ liệu đã lưu trên server |

Vai trò và hợp đồng dựa Luật91 Điều 2, 37; dữ liệu lao động/vị trí tại Điều 25, 31; NĐ356 Điều 4(1)(h), 6, 12. [PL03–PL04](nguon-phap-ly.md#pl03) Biểu mẫu `DataProcessingActivity` gồm bên quyết định mục đích, bên xử lý thực, mục đích/căn cứ, nhóm chủ thể/dữ liệu, receiver/subprocessor, địa điểm lưu/truy cập, quyền, retention, chuyển xuyên biên giới và điều khoản hợp đồng. Một hàng cho mỗi mục đích, không một dòng chung “SaaS có dữ liệu”.

### 8.2. Retention và yêu cầu xóa có ranh giới

NĐ254 Điều 5 yêu cầu an toàn/toàn vẹn và lưu theo pháp luật kế toán. NĐ174/2016 Điều 13(1) đặt mức **tối thiểu 10 năm** cho chứng từ dùng trực tiếp ghi sổ/lập báo cáo tài chính; Điều 15(1) tính từ cuối kỳ kế toán năm đối với nhóm này. Điều 12 có nhóm tài liệu không dùng trực tiếp ghi sổ/báo cáo tối thiểu 5 năm; không vì một file tên “phiếu kho” mà tự kết luận thuộc nhóm 5 năm. Điều 16 quy định tiêu hủy khi hết thời hạn và điều kiện liên quan. [PL01](nguon-phap-ly.md#pl01), [PL07](nguon-phap-ly.md#pl07)

| Lớp dữ liệu | Chính sách ứng viên/điểm khóa | Khi có yêu cầu xóa hoặc hết mục đích |
|---|---|---|
| Hóa đơn gốc, điều chỉnh, chứng từ trực tiếp ghi sổ | Phân loại `ACCOUNTING_10Y_MIN`; lưu XML/dữ liệu chuẩn, ký/mã/receipt và quan hệ gốc. Tính từ cuối kỳ kế toán năm; nghĩa vụ dài hơn/hold có ưu tiên | Giữ phần pháp luật cần; giới hạn truy cập và mục đích. Không dùng yêu cầu xóa liên hệ để sửa hóa đơn gốc |
| PXK/thu/chi và hồ sơ tác nghiệp | Kế toán xác định dùng trực tiếp ghi sổ hay chỉ quản lý; profile giữ 10 năm cho chuỗi dùng làm chứng cứ sổ, không hạ xuống 5 năm mặc định | Xóa bản sao cache thừa tách với bản chứng từ cần giữ |
| Danh bạ liên hệ/ảnh giao nhận không là hồ sơ kế toán bắt buộc | Lưu theo mục đích và nhu cầu khiếu nại có căn cứ; mỗi lớp có `retentionPolicyId`, trigger, duration, owner. Đề nghị chỉ nhập thông tin cần giao/thu, ảnh không bắt buộc có mặt/căn cước | Hết mục đích hoặc yêu cầu hợp lệ: xóa/khử nhận dạng; giữ phần bị hold có lý do và ngày xem lại |
| GPS/check-in | Ứng viên mặc định **tắt GPS liên tục**; nếu dùng check-in thì tách căn cứ và thời hạn ngắn do NPP duyệt, không kéo theo 10 năm của hóa đơn | Rút căn cứ áp dụng: ngừng mục đích tương ứng; dữ liệu đã thu xử lý theo quyết định hợp lệ, không giả địa chỉ giao dịch là GPS cần giữ |
| Hồ sơ vi phạm dữ liệu vị trí | NĐ356 Điều 29: ít nhất **5 năm kể từ khắc phục** | Giữ hồ sơ sự cố theo luật; không lấy thời hạn này làm lý do giữ toàn bộ lịch sử GPS |
| Cache PWA, log, backup, journal | Thời hạn theo mục đích/phạm vi phục hồi; không để backup thành bản lưu vô hạn ngoài chính sách. TTL quyền offline là giới hạn quyền, không thay retention luật | Tombstone/hạn chế áp vào đường đọc/job/replay; xóa vật lý theo quy trình; phục hồi phải áp lại quyết định trước mở dịch vụ |

Không có dữ liệu NPP để đặt một số ngày chung cho ảnh, GPS và liên hệ; đặc tả đã xác định **cách tính, lớp, trigger, chủ thể phê duyệt và hành vi khi thiếu policy**: không mở thu thập trường tùy chọn mới; giữ chứng từ bắt buộc theo lớp đã phân; hồ sơ cần policy khác ở `REVIEW_REQUIRED`. Đây là giới hạn cấu hình cụ thể, không phải chỉ viết “sẽ nghiên cứu retention”.

Luật91 Điều 14 cho phép/yêu cầu xóa trong các trường hợp luật định, đồng thời có ngoại lệ; khoản 3–4 ngăn khôi phục trái phép. Khi không thể xóa vì lý do chính đáng phải thông báo. Đề nghị `PrivacyActionLedger` ghi `requestId`, `tenantId`, `subjectRef`, `purpose`, `action`, `effectiveAt`, `legalBasisRef`, `scope`, `holdUntil/status`, `revision`. `subjectRef` giả danh vẫn cần bảo vệ, không coi đã hết là dữ liệu cá nhân. [PL03](nguon-phap-ly.md#pl03)

### 8.3. Contract yêu cầu dữ liệu và restore

| Loại yêu cầu hợp lệ | NĐ356 Điều 5: phản hồi thủ tục | Thực hiện thông thường / phải yêu cầu bên xử lý, thứ ba | Gia hạn tối đa một lần, có lý do/chứng minh |
|---|---:|---:|---:|
| Rút đồng ý, hạn chế, phản đối | 2 ngày làm việc | 15 / 20 ngày | 15 ngày |
| Xem, sửa, yêu cầu sửa, cung cấp | 2 ngày làm việc | 10 / 15 ngày đối với trường hợp cần bên xử lý/thứ ba chỉnh sửa | 10 ngày |
| Xóa | 2 ngày làm việc | 20 / 30 ngày theo trường hợp khoản 4 | 20 ngày |
| Yêu cầu biện pháp/giải pháp bảo vệ | 2 ngày làm việc | 15 ngày | 15 ngày |

Không đổi các chữ “ngày” trong điều khoản thành “ngày làm việc” hoặc dùng 72 giờ cho mọi yêu cầu. Thời hạn là theo yêu cầu đúng thủ tục và các ngoại lệ luật định; giới hạn ngừng xử lý theo Điều 19 phải được xác định chứ không từ chối chung. [PL04](nguon-phap-ly.md#pl04)

Runbook phối hợp [BS-04](offline-va-phuc-hoi.vi.md): (1) cách ly bản restore, chưa mở login/dispatcher/export; (2) lấy `AuthorityLedger`, `PrivacyActionLedger` và epoch mới từ nguồn không lùi cùng backup; (3) áp revoke/hạn chế/xóa/hold vào DB, object index, cache, queue và bản xuất; (4) với payload journal đã chứa dữ liệu bị hạn chế, bảo toàn phần chứng từ có căn cứ nhưng chặn mục đích đã bị dừng; (5) đối chiếu `ExternalEffectRegistry` và provider trước replay; (6) kiểm bằng tài khoản bị thu hồi, subject bị hạn chế/xóa và một chứng từ giữ theo luật; (7) mới mở dịch vụ, tiếp tục purge backup theo lịch và giữ chứng cứ thực hiện. Không hứa xóa từ xa tức thì trên máy đang mất mạng; lúc máy nối lại phải nhận trạng thái mới trước tiếp tục tác vụ theo contract quyền.

Ca E2E-19 về pháp lý phải có **ba đối tượng tách nhau**: người đã bị thu hồi quyền; liên hệ/GPS đã được quyết định xóa hoặc hạn chế; hóa đơn có nghĩa vụ lưu. Expected: người cũ không vào được, dữ liệu/mục đích bị dừng không sống lại, chứng từ giữ đúng lớp nhưng không trở thành danh bạ/marketing. Không dùng một lệnh “xóa khách” xóa cả lịch sử nợ hay hóa đơn.

## 9. Chuyển dữ liệu ra nước ngoài và thủ tục theo ngày

### 9.1. Kích hoạt từ cấu hình thực tế

Luật91 Điều 20(1) và NĐ356 Điều 17(1) bao gồm chuyển dữ liệu sang hệ thống lưu trữ ngoài Việt Nam, chuyển cho bên nhận ở nước ngoài, hoặc dùng nền tảng ngoài Việt Nam xử lý dữ liệu thu thập tại Việt Nam. NĐ356 còn nêu cloud của nhà cung cấp nước ngoài. Vì vậy, chỉ ghi “DB region Việt Nam” chưa đủ để kết luận không có chuyển xuyên biên giới. [PL03–PL04](nguon-phap-ly.md#pl03)

| Thành phần phải kê khai | Dữ liệu/cấu hình cần kiểm | Kết luận ứng viên |
|---|---|---|
| DB/replica/backup/object storage | Quốc gia máy chủ, pháp nhân cung cấp, replication, nơi sao lưu, khóa/quyền admin | Xác định theo cả lưu và xử lý/nhận; không suy từ tên nhà cung cấp |
| Log/APM/analytics/error tracker | Có tên/điện thoại/token/địa chỉ trong event không; nơi xử lý và người nhận | Nếu không cần, loại bỏ/redact trước gửi; dữ liệu giả danh có thể vẫn nhận diện được |
| Hỗ trợ, xuất file, email/provider hóa đơn | Ai ở đâu xem/tải; nhà thầu tiếp; URL/CDN/cache và log liên quan | Ghi bên nhận và mục đích, đối chiếu phạm vi hợp đồng |
| Dữ liệu nhân viên trên cloud | Có chỉ là dữ liệu người lao động của chính tổ chức không | Ngoại lệ hồ sơ chuyển tại Luật91 Điều 20(6)(b) có phạm vi; không tự bao gồm khách hàng/điểm bán hoặc mọi hoạt động của SaaS |

Mẫu `CrossBorderAssessmentTrigger` ghi `flowId`, nguồn/nhóm dữ liệu, bên chuyển/bên nhận, quốc gia/hạ tầng, mục đích, ngày bắt đầu thực, ngoại lệ được viện dẫn, evidence, kết luận và người ký. Chưa có cấu hình triển khai thì kết luận hiện tại là `UNDETERMINED`, chưa thể ghi “đã nộp” hoặc “được miễn”. Admission của cấu hình cụ thể yêu cầu hoàn thành bảng này; đây không phải yêu cầu mọi ứng dụng phải xin giấy phép chuyển dữ liệu.

### 9.2. Ma trận NĐ356 → NQ22 → NĐ392

Mốc phải lưu: `firstProcessedAt`, `firstTransferredAt`, `submittedAt`, **`receivedAt` của cơ quan**, loại hồ sơ và văn bản áp dụng. Ngày dự định pilot không thay ngày bắt đầu xử lý thật; nghiên cứu dùng dữ liệu tổng hợp/giả lập không được bịa thành ngày bắt đầu xử lý dữ liệu NPP.

| Thủ tục/phạm vi | Ngày 12/11/2026: Luật91 + NĐ356 đọc cùng NQ22 | Từ 15/11/2026: phần NĐ356 được NĐ392 sửa | Căn cứ |
|---|---|---|---|
| Hồ sơ tác động chuyển xuyên biên giới, khi thuộc diện | Lập hồ sơ, gửi trong 60 ngày từ bắt đầu chuyển; mẫu báo cáo 09 và thông báo 01a/01b. NQ22: Bộ Công an tiếp nhận/phân loại/chuyển CA tỉnh/thành theo địa bàn, quy mô, lĩnh vực; đánh giá 15 ngày, hoàn thiện thiếu/sai trong 30 ngày | Đầu mối chuyên trách thuộc Bộ CA tiếp nhận rồi phân loại/chuyển tỉnh theo tiêu chí Bộ trưởng; kết quả đạt/đạt cần bổ sung/không đạt trong **11 ngày làm việc**; mốc 60 và 30 ngày vẫn giữ | NĐ356 Đ18; NQ22 PL I.7 B.I; NĐ392 Đ43 |
| Hồ sơ tác động xử lý, theo vai trò/miễn trừ | NĐ356 Đ19, mẫu báo cáo 10, thông báo 02a/02b, 60 ngày; NQ22 PL I.7 B.II phân luồng Bộ CA→tỉnh; mốc đánh giá 15 ngày | NĐ392 Đ44: cổng DVCQG/trực tiếp/bưu chính tới cơ quan chuyên trách Bộ CA; phân loại/chuyển tỉnh; **11 ngày làm việc**, hoàn thiện **30 ngày** | Luật91 Đ21; NĐ356 Đ19; NQ22 PL I.7 B.II; NĐ392 Đ44 |
| Cập nhật hồ sơ | NĐ356 Đ20: định kỳ 6 tháng khi phát sinh thay đổi thuộc khoản 1; thay đổi khoản 2 cập nhật trong 10 ngày; mẫu 03a/03b. NQ22 B.III quy định tiếp nhận/phân cấp | NĐ392 Đ45 sửa kênh/đầu mối: Bộ CA và CA tỉnh theo thẩm quyền giải quyết; không đổi lịch 6 tháng/10 ngày ở khoản 1–2 | Luật91 Đ22; NĐ356 Đ20; NQ22 B.III; NĐ392 Đ45 |
| Cấp GCN đủ điều kiện dịch vụ xử lý, **chỉ nếu hoạt động thuộc diện** | NQ22 PL I.7 A.IV thành phần gồm đơn, chỉ định bộ phận/hợp đồng dịch vụ bảo vệ, đề án, giấy tờ chứng minh khác; không tiếp tục máy móc đòi bản sao ĐKDN theo bản NĐ356 gốc. Phần thời hạn NĐ356 Đ25(3)–(4): đánh giá 10 ngày; thông báo bổ sung/hoàn thiện trong 15 ngày; cấp trong 30 ngày từ nhận đủ hợp lệ | NĐ392 Đ46: bốn nhóm tài liệu với bằng cấp/chứng minh nhân sự theo Đ22(2)(c); đánh giá **8 ngày làm việc**, thông báo bổ sung/hoàn thiện **11 ngày làm việc**. Không sửa Đ25(4), nên không biến 8 ngày thành tổng thời hạn cấp GCN | NĐ356 Đ21–25; NQ22 A.IV; NĐ392 Đ46 |
| Cấp lại/cấp đổi GCN | NQ22 PL I.7 A.III gộp thủ tục; đơn; mốc 5 ngày làm việc | NĐ392 Đ47 sửa Đ26: đơn mẫu06 + giấy tờ chứng minh, lý do mất/hỏng/sai/thay đổi; 5 ngày làm việc | NQ22 A.III; NĐ392 Đ47 |

Nguồn đọc trực tiếp và ảnh kiểm: [PL03–PL06](nguon-phap-ly.md#pl03). **Giới hạn văn bản cần giữ:** NQ22 PL I.7 B.II có tiêu đề là hồ sơ *xử lý* nhưng hai đoạn sau dùng chữ *chuyển xuyên biên giới*; không âm thầm sửa trích dẫn. Bảng trên đọc theo tiêu đề, dẫn NĐ356 Điều 19 và thông báo mẫu02; khi nộp thực phải đối chiếu thủ tục công bố/đầu mối tiếp nhận cho loại hồ sơ, không từ lỗi chữ này kết luận được miễn hồ sơ xử lý.

**Hiệu lực/chuyển tiếp:** NQ22 Điều 6(1) quy định hiệu lực 29/04/2026 đến hết 01/03/2027 và phần tương ứng hết hiệu lực khi văn bản ban hành sau có hiệu lực trong khoảng luật định; khoản 2 ưu tiên quy định NQ22 khi khác văn bản liên quan. NĐ392 Điều 48 có hiệu lực 15/11/2026; Điều 49(3) quy định hồ sơ tác động xử lý/chuyển và cấp/cấp lại/cấp đổi GCN **đã được tiếp nhận trước ngày hiệu lực** thực hiện theo NĐ356. Vì vậy phải giữ receipt và route pháp lý trước sửa đổi; không tự áp thời hạn mới hoặc bắt nộp lại chỉ vì hồ sơ còn đang xử lý ngày 15/11. Với hồ sơ đã chịu NQ22 trước đó, ghi cả chuỗi văn bản và xác nhận route của cơ quan nhận khi chuyển tiếp, không tự khôi phục yêu cầu hồ sơ đã được cắt giảm. [PL05–PL06](nguon-phap-ly.md#pl05)

### 9.3. Sàng lọc hoạt động và miễn trừ trước khi đặt yêu cầu GCN

| Câu hỏi | Cách kết luận có điều kiện |
|---|---|
| NPP dùng phần mềm cho hoạt động nội bộ của mình, có cung cấp dịch vụ xử lý cho bên khác không? | Việc xử lý dữ liệu nội bộ không tự chứng minh đang kinh doanh dịch vụ xử lý. Nghĩa vụ bảo vệ/đánh giá có thể vẫn áp dụng theo vai trò |
| SaaS cung cấp và vận hành phần mềm tự động thay bên kiểm soát xử lý dữ liệu cá nhân? | Đây là nội dung NĐ356 Đ21(1); xử lý trực tuyến còn liên quan Đ21(3). Nếu mô hình/hợp đồng thực thuộc diện, rà điều kiện Đ22 và thủ tục Đ24–25 theo ngày. Không chỉ dựa nhãn “SaaS” để kết luận đã được miễn hoặc phải có GCN |
| Chỉ cung cấp mã/phần mềm, không nhận/vận hành xử lý dữ liệu? | Phải chứng minh luồng thực không có hosted processing, support copy, log chứa dữ liệu; chưa đủ kết luận chỉ từ câu mô tả hợp đồng |
| Có dựa miễn trừ doanh nghiệp nhỏ/khởi nghiệp/siêu nhỏ? | Luật91 Đ38 và NĐ356 Đ41 chỉ cho phạm vi nghĩa vụ được nêu; loại trừ kinh doanh dịch vụ xử lý, trực tiếp xử lý dữ liệu nhạy cảm hoặc quy mô tích lũy từ 100.000 chủ thể. GPS nhạy cảm làm phát sinh câu hỏi này ngay |
| Có subprocessor/cloud/provider? | Ghi vai trò, trách nhiệm, địa điểm, chuyển tiếp dữ liệu, hỗ trợ quyền/sự cố/xóa; không suy có giấy của vendor thì SaaS/NPP đã hoàn tất nghĩa vụ riêng |

NĐ392 Chương VII sửa thủ tục/đầu mối liên quan, không thay danh mục dịch vụ tại NĐ356 Điều 21 hoặc tự cấp phép cho MVP. Hồ sơ sàng lọc của dự án hiện là **chưa có pháp nhân/hợp đồng/cấu hình đủ để kết luận áp dụng GCN**; nghiên cứu đã xác định tiêu chí và đường xử lý của từng kết quả, không yêu cầu xin một giấy phép chưa xác định hoạt động. [PL04–PL06](nguon-phap-ly.md#pl04)

## 10. Biểu mẫu bàn giao để quyết định và chạy kiểm chứng

### A. Phiếu admission hóa đơn/vận chuyển

`profileId/version`; seller/MST và chứng cứ; ownership; phương pháp VAT; loại/mode/đăng ký/mẫu; mốc chuyển quyền A/B; danh mục thuế đã ký; tiền/rounding; provider/API/môi trường; chữ ký/ủy nhiệm; PXK hệ thống nào/người nào; kênh B khi mất mạng; retry/lookup đã chứng minh; ID run INV/E2E; ngoại lệ chưa đóng; kết luận phạm vi được phép; kế toán/Owner/kỹ thuật và ngày chấp nhận.

**Trạng thái điền được ở R008:** phương án `INV-CAND-01`, contract/ca thử đã chuẩn bị, schema có bằng chứng; các trường seller thật, đăng ký, SKU tax, credential, người pilot và test run **chưa có**. Kết luận hiện tại: đủ làm đầu vào chuẩn bị triển khai/spike có điều kiện; chưa admission giao dịch thật.

### B. Phiếu xử lý UNKNOWN hoặc chứng từ ngoài

`caseId`; `invoiceIntentId/handoffId`; seller/tenant; source event; payload hash; lần gửi cuối; facts đã xác minh; deadline pháp lý thuộc loại nào; lookup attempts/kết quả; owner hiện tại; hành động được phép tiếp; lý do cho phép retry hoặc cấm retry; document IDs/artifact; người kiểm; kết quả đóng và thời gian. Chỉ chuyển owner khi bên nhận xác nhận, không bỏ case khỏi trách nhiệm vì client đã nhận ACK.

### C. Phiếu quyết định dữ liệu

`activityId`; vai trò mỗi bên; dữ liệu/chủ thể/mục đích/căn cứ; có dữ liệu nhạy cảm không; subprocessor/địa điểm; transfer trigger; miễn trừ được viện dẫn và chứng cứ; retention class; quyết định GCN thuộc/không thuộc/chưa rõ kèm lý do; loại hồ sơ đánh giá; ngày bắt đầu/ngày nộp/ngày tiếp nhận; route luật theo ngày; receipt; người chịu trách nhiệm; thay đổi cấu hình phải rà lại.

### D. Phiếu quyền/xóa/hold/restore

`requestId`; người yêu cầu và xác minh tối thiểu; loại quyền; receivedAt/deadline; đối tượng/phạm vi/mục đích; căn cứ tiếp tục giữ phần nào; quyết định và thông báo; revision ngoài rollback; các bên nhận lệnh; trạng thái thực hiện từng nơi; backup expiry; kết quả chạy restore và người kiểm. Giữ bằng chứng tối thiểu cần thiết, tránh tạo một kho mới chứa toàn bộ dữ liệu đã quyết định xóa.

Các biểu mẫu là đầu ra sử dụng được của đợt nghiên cứu. Phần còn thiếu được chỉ đến **đúng chứng cứ và đúng quyết định có điều kiện**, không được thay bằng việc đọc thêm bài giới thiệu chung hoặc tự điền tên NPP/provider/biên bản nghiệm thu không tồn tại.
