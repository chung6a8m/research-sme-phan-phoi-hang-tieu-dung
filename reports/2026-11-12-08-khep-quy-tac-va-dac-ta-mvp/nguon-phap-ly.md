# R008 — Sổ nguồn hóa đơn, provider và dữ liệu

Phục vụ [Hồ sơ hóa đơn, chứng từ cấp xe và bảo vệ dữ liệu](hoa-don-va-du-lieu.vi.md). Ngày nghiên cứu/kiểm tra **12/11/2026**; mốc áp dụng của báo cáo 12/11/2026 Asia/Bangkok. Hiệu lực văn bản được ghi riêng. Chỉ những phần nêu dưới đây được đánh dấu đã kiểm tra lại; các nguồn kế thừa R006 được dẫn rõ, không tự nhận đã rà toàn bộ pháp luật hoặc mọi điều khoản hiện hành.

## Phương pháp và giới hạn chung

- Dùng nguồn cơ quan ban hành/Cổng Chính phủ/Công báo và tài liệu trên tên miền nhà cung cấp. Tìm kiếm pháp lý dùng tra cứu nguồn nhà nước, đối chiếu bản ký; không dùng bài tổng hợp của đại lý thay luật/API.
- PDF quét đọc bằng OCR rồi kiểm ảnh trang trọng yếu. Trang PDF trong sổ bắt đầu từ **1**, không nhầm với số trang in của phụ lục hoặc `pageno` bắt đầu từ 0.
- NĐ254, TT91, Luật91, NĐ356 được mở lại URL bản ký; sử dụng bản tải và OCR/ảnh còn trong workspace từ R006 để đọc chọn lọc. NQ22/NĐ392 tải trực tiếp mới trong phiên R008 và đọc trang liên quan. Bản NĐ392 lớn 20.033.783 byte khiến trình đọc web trả lỗi giới hạn dung lượng; tải trực tiếp thành công, nên không chỉ dựa metadata.
- Đây là nghiên cứu tài liệu. Không đăng ký tài khoản, xác thực API, ký/phát hành/truyền hóa đơn, nộp hồ sơ hoặc lấy dữ liệu NPP. Public demo/documentation không là sandbox được cấp cho dự án.
- Mẫu/ID và fixture trong báo cáo là thiết kế/giả lập; thuế suất 8%/10% chỉ phục vụ kiểm toán học. Không xác định SKU thực, quy mô miễn trừ, người bán pháp lý hoặc quyền ký.

## PL01

**Nghị định 254/2026/NĐ-CP — hóa đơn điện tử, chứng từ điện tử.** Ban hành 30/06/2026; hiệu lực 01/07/2026.

- [Metadata Chính phủ](https://vanban.chinhphu.vn/?docid=218689&pageid=27160&typegroupid=4).
- [Bản ký PDF, 55 trang](https://datafiles.chinhphu.vn/cpp/files/vbpq/2026/7/254-ndcp.signed.pdf).
- Đã đọc lại phần liên quan: Điều 4(1), (3), (5); Điều 5; Điều 6(1), (3)(d), (đ); Điều 7(8); Điều 8(1), (2), (7), (9); Điều 9(1), (3); Điều 10; Điều 14–16; Phụ lục điểm 7 và 9(g). Kiểm ảnh trang 11, 52, 54 để xác minh bán lưu động, hạn ký/gửi và nội dung PXKVCNB; đối chiếu OCR các trang 8–16, 21–27.
- Kết luận dùng: xuất hàng bán lưu động dùng PXKVCNB; khi bán lập hóa đơn; cấp xe không tự là bán; mỗi lần giao lập tương ứng; tách ngày lập/ký/gửi; cơ chế có mã/không mã/máy tính tiền khác nhau; các nhánh sự cố có điều kiện khác nhau.
- Phụ lục điểm **9(g)** nằm trang PDF **54**, số trang in phụ lục **7**. Không nhầm nó với “Điều 9 khoản g”. Phụ lục điểm **7** về ký/gửi nằm trang PDF **52**.
- Điều 43(1)–(2) về hiệu lực/bãi bỏ là cơ sở R006 đã đối chiếu: không dùng NĐ123/2020/NĐ70/2025 làm baseline độc lập sau 01/07/2026. Đã tra cứu sửa đổi gần mốc R008 trên nguồn nhà nước, chưa tìm thấy văn bản sửa những điều dùng; không bảo đảm rà hết mọi hướng dẫn ngành.
- Giới hạn: chưa có hợp đồng chuyển quyền, đăng ký hóa đơn hoặc tài liệu về cơ chế offline/cấp mã của provider áp dụng cho người bán cụ thể. Không suy mất mạng nào cũng thuộc bất khả kháng.

## PL02

**Thông tư 91/2026/TT-BTC — hướng dẫn hóa đơn, chứng từ theo Luật Quản lý thuế và NĐ254.** Ban hành 30/06/2026; hiệu lực 01/07/2026.

- [Metadata](https://vanban.chinhphu.vn/?classid=1&docid=219006&orggroupid=4&pageid=27160).
- [Bản ký PDF](https://datafiles.chinhphu.vn/cpp/files/vbpq/2026/7/91-btc.signed.pdf).
- Mở lại bản ký; đọc chọn lọc Điều 9, Điều 10, đặc biệt khoản 1(a)–(c), khoản 5(b), (c.1) và khoản 6; trang PDF 17–22. R006 đã đọc Điều 24–25 về chuyển tiếp/hiệu lực; R008 không nhận là rà lại mọi biểu mẫu 97 trang.
- Dùng cho: ủy nhiệm; phân loại sai tên/địa chỉ khác sai nội dung trọng yếu; máy tính tiền sai áp thay thế; trả một phần/toàn bộ thông thường do người bán điều chỉnh, có nhánh các bên thỏa thuận người mua lập hóa đơn trả; phải có hồ sơ chứng từ trả; giữ gốc và chuỗi sửa.
- Giới hạn: chưa có thỏa thuận, chương trình chiết khấu hay hồ sơ người mua thực; không mặc định mọi nhánh đều được adapter tự động hóa.

## PL03

**Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15.** Ban hành 26/06/2025; hiệu lực 01/01/2026.

- [Metadata Chính phủ](https://vanban.chinhphu.vn/?classid=1&docid=214590&pageid=27160&typegroupid=3).
- [Bản ký PDF, 23 trang](https://datafiles.chinhphu.vn/cpp/files/vbpq/2025/7/91qh.signed.pdf).
- Mở lại bản ký, đọc lại Điều 14(1)–(5), Điều 19–22, 37–39 qua bản OCR; đối chiếu những phần vai trò/đồng ý/lao động/vị trí Điều 2–4, 9, 25, 31 đã có trong R006.
- Dùng cho: vai trò theo hoạt động, hợp đồng bên xử lý, giới hạn quyền xóa và cấm khôi phục trái phép, hồ sơ tác động xử lý/chuyển, ngoại lệ cloud dữ liệu lao động của chính tổ chức, cập nhật hồ sơ, miễn trừ có điều kiện và chuyển tiếp hồ sơ/đồng ý cũ.
- Đọc riêng Luật Điều 21(3): bên xử lý lập/lưu hồ sơ theo thỏa thuận; khi xác định nghĩa vụ thủ tục phải đọc cùng NĐ356 Điều 19 và vai trò thực, không dùng một dòng chung để kết luận mọi bên có cùng bộ hồ sơ.
- Giới hạn: chưa có cấu hình, pháp nhân, mục đích/hợp đồng thực; không kết luận toàn bộ dữ liệu khách được xử lý không cần đồng ý hoặc dự án đã được miễn đánh giá.

## PL04

**Nghị định 356/2025/NĐ-CP — hướng dẫn Luật Bảo vệ dữ liệu cá nhân.** Ban hành 31/12/2025; hiệu lực 01/01/2026. Đây là văn bản nền phải đọc cùng PL05 tại ngày nghiên cứu và phần sửa PL06 khi có hiệu lực.

- [Metadata Chính phủ](https://vanban.chinhphu.vn/?classid=1&docid=216387&pageid=27160).
- [Bản ký PDF, 71 trang](https://datafiles.chinhphu.vn/cpp/files/vbpq/2026/01/356-nd.signed.pdf).
- Mở lại bản ký; đọc lại Điều 5 (trang PDF 3–5), Điều 17–20 (17–22), Điều 21–25 (23–26), Điều 41–42 (36–37); kế thừa Điều 4(1)(h), 6, 12 và 29 đã kiểm trong R006.
- Dùng cho: thời hạn quyền dữ liệu; chuyển ra nước ngoài/cloud và hồ sơ; danh mục dịch vụ xử lý, điều kiện/GCN; miễn trừ/100.000 chủ thể; giữ hồ sơ sự cố vị trí 5 năm từ khắc phục; mã hóa và trách nhiệm cloud.
- Kiểm số ngày: phản hồi thủ tục 2 **ngày làm việc**; nhiều thời hạn thực hiện/gia hạn ở Điều 5 ghi **ngày**, không chuyển thành ngày làm việc. R008 đọc các nhánh riêng, không thay bằng “72 giờ cho mọi yêu cầu”.
- Giới hạn: các mốc thủ tục nguyên bản ở Điều 18–20/25–26 không được dùng đơn độc bỏ qua NQ22 hoặc NĐ392; chưa đối chiếu quy trình tiếp nhận công bố với một hồ sơ thực.

## PL05

**Nghị quyết 22/2026/NQ-CP — cắt giảm, phân cấp, đơn giản hóa thủ tục và điều kiện kinh doanh thuộc phạm vi Bộ Công an.** Ban hành 29/04/2026; Điều 6 quy định hiệu lực từ 29/04/2026 đến hết 01/03/2027, cùng cơ chế hết hiệu lực từng phần tương ứng khi văn bản ban hành sau có hiệu lực trong khoảng nêu tại điều.

- [Metadata Chính phủ](https://vanban.chinhphu.vn/?classid=1&docid=217978&orggroupid=2&pageid=27160).
- [Bản ký PDF, 36 trang](https://datafiles.chinhphu.vn/cpp/files/vbpq/2026/4/22-nqcp.signed.pdf).
- Tải mới, OCR các trang đầu/đoạn liên quan; đọc Điều 3(7), 4, 5, 6; Phụ lục I.7 A.III–IV và B.I–III ở trang PDF 25–27. Xem ảnh trang PDF 3, 26, 27 để kiểm nội dung/thời hạn và khác biệt số trang in.
- Dùng cho: gộp cấp lại/cấp đổi GCN, thành phần hồ sơ cấp; tiếp nhận/phân loại/chuyển hồ sơ tác động từ Bộ Công an sang Công an tỉnh/thành theo địa bàn/quy mô/lĩnh vực; mẫu 01/02/03, mốc 60/30/15 ngày; quan hệ ưu tiên và chuyển tiếp theo ngày tiếp nhận/dấu bưu chính.
- **Lỗi diễn đạt quan sát trực tiếp:** Phụ lục I.7 B.II, trang PDF 27/số trang in 23, tiêu đề và đoạn đầu nói hồ sơ tác động *xử lý* nhưng các đoạn sau dùng cụm *chuyển xuyên biên giới*; B.III cũng dẫn Điều 18 trong một đoạn về cập nhật. Không sửa âm thầm bản nguồn. Đặc tả tách loại hồ sơ và yêu cầu đối chiếu thủ tục được công bố khi nộp thật.
- Giới hạn: đọc các phần bảo vệ dữ liệu liên quan, không suy mọi thủ tục thuộc Phụ lục I.7 đều áp dụng cho SaaS FMCG; không coi NQ22 chỉ là đề xuất chưa có hiệu lực.

## PL06

**Nghị định 392/2026/NĐ-CP — sửa đổi các nghị định liên quan thủ tục, điều kiện đầu tư kinh doanh trong lĩnh vực an ninh, trật tự.** Ban hành 20/10/2026; hiệu lực **15/11/2026**, nên chưa áp dụng tại 12/11/2026.

- [Metadata Chính phủ](https://vanban.chinhphu.vn/?classid=1&docid=220055&pageid=27160&typegroupid=4).
- [Công báo](https://congbao.chinhphu.vn/van-ban/nghi-dinh-so-392-2026-nd-cp-470847.htm).
- [Bản ký PDF, 48 trang](https://datafiles.chinhphu.vn/cpp/files/vbpq/2026/10/392_2026_nd-cp_20102026-signed.signed.pdf).
- Web reader trả lỗi quá giới hạn dung lượng; đã tải trực tiếp thành công và dùng Poppler/OCR tiếng Việt. Đọc Chương VII Điều 42–47 ở trang PDF 31–34, Điều 48–49 ở trang 34–35; xem ảnh 31 và 33 để kiểm **11 ngày làm việc**, **8 ngày làm việc**, Điều 45 sửa đúng **khoản 3** Điều 20 (OCR từng nhận sai số 3).
- Thay đổi dùng: Điều 43 sửa NĐ356 Điều 18(4)–(6); Điều 44 sửa Điều 19(4)–(6); Điều 45 sửa Điều 20(3); Điều 46 sửa Điều 25(1),(3); Điều 47 thay Điều 26. Điều 42 thêm phối hợp Bộ Quốc phòng trong phạm vi dữ liệu/quốc phòng nêu trong điều, không là thủ tục chung của mọi NPP.
- Điều 49(3), trang 35: hồ sơ tác động xử lý/chuyển, cấp/cấp đổi/cấp lại GCN đã được tiếp nhận trước hiệu lực thực hiện theo NĐ356. Báo cáo giữ ngày nhận và chuỗi NQ22 cho route chuyển tiếp, không suy mọi hồ sơ đang chờ phải làm lại hoặc áp mốc mới.
- Giới hạn: không đọc/áp tất cả phần vũ khí/con dấu/ngành nghề khác; không tuyên bố GCN của SaaS là bắt buộc khi chưa xác định hoạt động thuộc NĐ356 Điều 21.

## PL07

**Nghị định 174/2016/NĐ-CP — quy định chi tiết Luật Kế toán; đọc Điều 12–16 trong 02/VBHN-BTC ngày 14/01/2019.** NĐ174 ban hành 30/12/2016, hiệu lực 01/01/2017; bản hợp nhất gồm sửa NĐ151/2018 và không có hiệu lực độc lập thay văn bản được hợp nhất.

- [Metadata NĐ174](https://vanban.chinhphu.vn/default.aspx?docid=187897&pageid=27160).
- [Bản hợp nhất chính thức trên Công báo, PDF có văn bản đọc được](https://congbao.chinhphu.vn/tai-ve-van-ban-so-02-vbhn-btc-28196-25394).
- [Thuộc tính bản hợp nhất trên CSDL văn bản pháp luật](https://vbpl.moj.gov.vn/botaichinh/Pages/vbpq-thuoctinh-hopnhat.aspx?ItemID=139746).
- Đã đọc Điều 12–16 trực tiếp từ PDF: nhóm không trực tiếp ghi sổ/BCTC tối thiểu 5 năm; nhóm trực tiếp ghi sổ/BCTC tối thiểu 10 năm, dài hơn nếu pháp luật khác quy định; mốc tính từ cuối kỳ kế toán năm đối với nhóm tương ứng; tiêu hủy theo quyết định/điều kiện và quy trình.
- Rà thêm nguồn nhà nước năm 2026 vẫn dẫn NĐ174, chưa thấy sửa các điều lưu trữ được dùng. Không coi mục “không có văn bản sửa đổi” của một trang chỉ mục là chứng minh tuyệt đối; không áp toàn bộ phần hành nghề kế toán của bản hợp nhất cũ cho hoạt động hiện tại.
- Dùng cùng NĐ254 Điều 5 và Luật91 Điều 14 để phân biệt giữ chứng từ bắt buộc với xóa liên hệ/GPS không còn mục đích. Chưa có danh mục tài liệu NPP nên chưa phân loại thực tế từng file.

## API01

**MISA meInvoice — trang tham số hóa đơn/chi tiết/PXK công khai.**

- [Trang đọc trực tiếp](https://testapp.meinvoice.vn/api/v2/content/invoicev3parameter.html).
- Đọc trực tiếp trong R008: nhóm ID/mẫu/ký hiệu/ngày/trạng thái, tiền trước/sau thuế, chiết khấu, chi tiết dòng và trường lệnh/địa điểm/người vận chuyển. Hỗ trợ xây ánh xạ và ca thử; không phải kết quả gọi API.
- Giới hạn: ví dụ có năm 2019; các ví dụ tổng và alias không đồng nhất thành một invoice fixture. Không lấy enum/mẫu cũ, số thuế mẫu hoặc trường “đã phát hành” làm xác nhận tính hợp lệ của giao dịch 2026. Không thấy bảo đảm idempotency, lookup visibility hay quy tắc rounding bắt buộc của contract được cấp.

## API02

**MISA meInvoice — Help và tài liệu integration, khả năng truy cập thay đổi.**

- [PublishInvoiceData](https://app.meinvoice.vn/api/v2/Help/ResourceModel?modelName=PublishInvoiceData).
- [GET SAInvoice/Get/id](https://app.meinvoice.vn/api/v2/Help/Api/GET-SAInvoice-Get-id).
- [Help](https://app.meinvoice.vn/api/v2/Help).
- [Đẩy hóa đơn GTGT/bán hàng](https://doc.meinvoice.vn/webapi/Webapp/HDGTGT.html).
- R006 ghi từng đọc trực tiếp hai trang Help đầu; mở lại trong R008 trả **403**. Trang `doc.meinvoice.vn` nêu trên trả **404**; search index có schema/op khác nhưng không nâng thành contract chạy thật. Đây là kết quả truy cập của phiên, không kết luận API đã ngừng.
- R008 dùng API01 để mô tả trường quan sát, chỉ dùng API02 nêu giới hạn và nhu cầu hợp đồng tài liệu version được cấp. Không bịa endpoint mới để vượt lỗi truy cập.

## API03

**VNPT Invoice — mô tả SOAP công khai tại subdomain demo.**

- [Danh sách operation](https://sfv-tt78admindemo.vnpt-invoice.com.vn/PublishService.asmx).
- [Mô tả ImportAndPublishInvMTT32](https://sfv-tt78admindemo.vnpt-invoice.com.vn/PublishService.asmx?op=ImportAndPublishInvMTT32).
- [Tài liệu trên tên miền VNPT xác nhận hệ thống dùng miền vnpt-invoice.com.vn](https://camnang.vnpt.vn/ckfinder/userfiles/files/Mau_Cong_van_thong_bao_khach_hang_ve_viec_thuc_hien_gia_h%E1%BA%A1n_SSL.pdf) — chỉ dùng xác minh liên hệ miền, không là tài liệu API 2026.
- Đọc trực tiếp operation và request/response SOAP 1.1/1.2 mẫu; các trường ngoài gồm account/credential placeholders, XML, pattern/serial và convert. Chưa submit, chưa dùng credential và chưa phát hành.
- Giới hạn: mô tả public của một demo không chứng minh quyền truy cập, version hiện hành, XML money/tax contract, phân loại lỗi, retry, callback, PXK hoặc offline. Chỉ xác nhận có bề mặt tích hợp được tài liệu hóa.

## API04

**Viettel SInvoice — PDF Technical webservice trên website Viettel Solutions.**

- [PDF kỹ thuật](https://viettelsolution.com.vn/uploads/tai%20lieu/Technical_webservice_Sinvoice_en.pdf).
- Đọc trực tiếp PDF có text; mục 2.1.1, mô tả nhóm dữ liệu và field `transactionUuid`; mục 2.1.2–3 về lấy file; các đoạn tham chiếu điều chỉnh/thay thế và tổng/thuế. Không tái sử dụng thông tin cá nhân minh họa trong tài liệu làm dữ liệu dự án.
- Giới hạn: ví dụ cũ 2017–2018; mô tả header nhận JSON/XML có điểm đảo và phần nháp/phát hành có tên đường dẫn trùng trong tài liệu. Không chép endpoint/auth hoặc semantics lỗi vào production spec. `transactionUuid` tồn tại không đủ chứng minh gửi lặp an toàn; không thấy bằng chứng offline hoặc contract đang cấp tháng 11/2026.

## Nguồn kế thừa, không đánh dấu đã rà toàn bộ trong R008

- [R006 sổ nguồn pháp lý L03–L05, L07–L10](../2026-11-11-06-ket-qua-nghien-cuu-mvp/nguon-phap-ly.md): VAT giá tính thuế/chiết khấu/quà; pháp luật khuyến mại; khái niệm đại lý. R008 dùng kết luận phân biệt và yêu cầu hồ sơ, không chốt lại mức thuế/hạn mức/chương trình thực.
- [R006 hóa đơn](../2026-11-11-06-ket-qua-nghien-cuu-mvp/hoa-don-va-tuan-thu.vi.md) và [pilot/API](../2026-11-11-06-ket-qua-nghien-cuu-mvp/pilot-va-tich-hop.vi.md): giữ INV-01–09, bổ sung bước/kết quả/evidence và E2E-20.
- [R007](../2026-11-12-07-review-pr1-va-muc-tieu-tiep-theo/report.vi.md), [R007 nguồn](../2026-11-12-07-review-pr1-va-muc-tieu-tiep-theo/sources.md), [B007](../../briefs/2026-11-12-07-kiem-chung-va-chot-dac-ta-mvp.md): phạm vi BS-03/04 và finding restore. R007 và nguồn giữ nguyên; B007 chỉ cập nhật trạng thái thực hiện và liên kết R008.

## Bằng chứng chưa có và giới hạn kết luận

Chưa có người bán/NPP/nhân sự pilot thật được chỉ định; hợp đồng/chuyển quyền/ủy nhiệm; đăng ký hóa đơn/chữ ký/mẫu; phân loại SKU/thuế/chương trình; account/version API được cấp; sandbox/fault injection/tuyến; cấu hình dữ liệu/subprocessor/crossborder; hồ sơ đánh giá hay receipt cơ quan; kết luận áp dụng GCN. Các thiếu vắng này được đặt vào **trường hồ sơ, nhánh quyết định và điều kiện admission cụ thể** trong phụ lục, không được biến thành kết quả đã hoàn tất.

Phép tính lượng E2E-20 thực hiện trong nghiên cứu xác nhận bảo toàn 200 đơn vị ban đầu → bán thuần 75 → tồn 125, xe 0 sau nhập 25. Đây là kiểm số học độc lập của ví dụ, không xác nhận hệ thống hoặc chứng từ đã được tạo.
