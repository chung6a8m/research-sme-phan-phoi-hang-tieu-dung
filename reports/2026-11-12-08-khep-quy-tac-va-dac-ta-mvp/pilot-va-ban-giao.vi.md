# R008-P — Hồ sơ pilot, tác vụ thị trường và bàn giao vận hành

- Ngày: **12/11/2026**, Asia/Bangkok; thực hiện phần nghiên cứu BS-01/05/06 của [B007](../../briefs/2026-11-12-07-kiem-chung-va-chot-dac-ta-mvp.md).
- Kết quả đã tạo: tiêu chí tuyển, hồ sơ đầu vào, quy tắc viếng thăm, bài đo tác vụ, contract cutover/bàn giao, phép đo và công thức chi phí.
- **Chưa tuyển hoặc liên hệ NPP; chưa nhận dữ liệu thật, chạy prototype với người dùng hoặc đo pilot.** Các hàng trạng thái chưa có dữ liệu được giữ đúng là chưa có. Không có danh sách người liên hệ hay giá/khối lượng giả làm dữ liệu thị trường.
- Đọc cùng [đặc tả đề nghị](dac-ta-mvp-de-nghi.vi.md), [nghiệp vụ/số liệu](nghiep-vu-va-so-lieu.vi.md), [offline/phục hồi](offline-va-phuc-hoi.vi.md), [hóa đơn/dữ liệu](hoa-don-va-du-lieu.vi.md).

## 1. Hồ sơ pilot ứng viên và cách quyết định phù hợp

Đề nghị pilot đầu nằm trong archetype một đơn vị bán tự sở hữu hàng mua–bán, vận hành A và B, có người xác nhận kho/nợ/hóa đơn và có quyền cung cấp dữ liệu cần thiết. Một NPP đủ tình huống có thể kiểm chứng phạm vi hẹp; chưa thể suy thành đại diện toàn bộ thị trường.

| Thuộc tính cần xác nhận | Bằng chứng cần nhận | Kết quả nếu không phù hợp |
|---|---|---|
| Chủ hàng/bên bán/bên nợ | Một bộ nhập–cấp xe–giao–thu–hóa đơn đã khử dữ liệu không cần thiết | Nếu nhiều chủ hàng/ký gửi là bắt buộc, xem lại Q01 trước khi đưa vào phạm vi |
| Có A và B | Chứng từ một ca giao nhiều lần và một chuyến bán xe, kể cả ngoại lệ | Nếu chỉ A hoặc B, chỉ kết luận pilot cho phần đã dùng; phần còn lại vẫn chưa được kiểm chứng |
| Có người chốt số | Vai trò kho, người giao, kế toán/thu quỹ, người quyết định mua | Chưa có người chịu trách nhiệm thì chưa lên lịch cutover |
| Thiết bị/mạng có thể quan sát | Thiết bị/OS/browser/version, dung lượng trống, cách cài PWA, tuyến/đoạn mất mạng | Nếu ngoài tập hỗ trợ đã thử, bổ sung spike trước khi hứa hỗ trợ |
| Hồ sơ hóa đơn/provider | SellerProfile, tài khoản test được cấp quyền, cách cấp xe/lập hóa đơn hiện tại | Thiếu kênh lập đúng hồ sơ: chưa mở bán B tại điều kiện đó |
| Dữ liệu đầu đủ nguồn | Danh mục, số dư, terms, chứng từ dở, file đối chiếu có người duyệt | Thiếu nguồn thì preview/làm sạch; chưa post opening |
| Quyền sử dụng dữ liệu nghiên cứu | Mục đích, phạm vi, người được xem, thời hạn/cách giữ, người cấp quyền | Không sao chép dữ liệu không cần thiết vào repo nghiên cứu |
| Khả năng hỗ trợ/đo | Người trực hỗ trợ, cách ghi thời gian/chênh lệch, người duyệt ngưỡng | Chưa kết luận thương mại từ demo không có người dùng |

Trạng thái hiện tại cho mọi thuộc tính trên: **chưa có hồ sơ pilot để xác minh**. Nguồn tài liệu sản phẩm hoặc phương pháp nghiên cứu không thay bằng chứng này.

### Hồ sơ đầu vào tối thiểu

Mỗi pilot tạo một `pilotId` và hồ sơ có phiên bản; không cần công bố dữ liệu nhận diện thật trong repo.

| Nhóm trường | Nội dung phải điền từ thực tế |
|---|---|
| Đơn vị/người chịu trách nhiệm | seller identity, loại hình/thuế, chủ hàng, người quyết định và người chốt từng loại số |
| Quy mô và đỉnh tải | SKU, UoM/lô, Customer/Outlet, kho/xe, chuyến/ngày, dòng/đơn, số thiết bị hoạt động đồng thời; khoảng thấp–cao và nguồn đo |
| Tình huống | A/B, giao nhiều lần, trả có/không nguồn, hàng tặng, cách thu/nộp, tạm ứng, kiểm kê, phí muộn |
| Mạng/thiết bị | Loại máy/OS/browser, cách sử dụng PWA, mất mạng điển hình/tối đa đã quan sát, giờ làm việc/chuyển máy |
| Hệ thống hiện tại | Nguồn kho/nợ/tiền, phần mềm kế toán, provider hóa đơn, mã nguồn chứng từ và export được phép |
| Mục tiêu và đo | Vấn đề ưu tiên, baseline theo tác vụ, phạm vi đủ điều kiện, ngưỡng/ngoại lệ được thống nhất trước đo |
| Thử/cutover | Tài khoản test, dữ liệu mẫu đã khử nhận diện, mốc chốt, người duyệt manifest, cách rollback/điều chỉnh |

## 2. Bộ câu hỏi cần đi cùng chứng từ

Mỗi câu trả lời ghi `evidenceId`, vai trò người trả lời, ngày quan sát, loại nguồn (nói/quan sát/chứng từ/số đo), quyết định bị ảnh hưởng và phần còn mâu thuẫn. Một lời kể không tự bằng chứng cho mọi nhân viên/tuyến.

| Câu hỏi cụ thể | Vật chứng/thao tác cần quan sát | Quyết định bị ảnh hưởng |
|---|---|---|
| Lần gần nhất một đơn A giao thiếu được xử lý thế nào? | Đơn, hai lần giao/hủy còn lại, tiền/nợ/hóa đơn tương ứng | Q03, Q05, terms và split delivery |
| Chuyến B gần nhất mất mạng lúc nào, hóa đơn được lập qua đâu? | Mốc giao/lập/ký/gửi, thiết bị và kết quả tra cứu | Q07/Q08, phạm vi B |
| Khi khách trả cả hàng mua và quà, ai quyết định và quà thiếu xử lý thế nào? | Nguồn giao, biên bản chấp nhận, quà thu hồi/miễn, tiền hoàn | F02/Q05 |
| Hai lần trả nhỏ có được đối chiếu đúng giá vốn nguồn không? | Dòng nguồn, số tiền/giá vốn phân bổ, điều chỉnh kỳ | F03/Q04 |
| Đổi điều khoản khách ảnh hưởng đơn đã nhận nhưng chưa giao ra sao? | Hợp đồng/terms, ngày giao, hạn trả trên sổ hiện tại | Q06/due_date |
| Ai được xác nhận tiền chuyển khoản, nộp quỹ và hoàn khách? | Bằng chứng ngân hàng, phiếu giao/nhận, ba số dư riêng | Q06 và compound command |
| Kho kiểm kê khi xe chưa về như thế nào? | Địa điểm được đếm, hàng giữ A, quota B, chênh lệch được duyệt | BS-05, không nhả quyền offline |
| Nhân viên đến điểm nhưng không bán được ghi nhận ở đâu? | Danh sách được phân công, lý do, quan sát hàng/yêu cầu trả | M16/E2E-22 |
| Dữ liệu nào kế toán nhập lại sau chốt ngày? | File xuất/nhập, ID chứng từ, lỗi trùng và ai sửa | Q10, ranh giới hệ thống |
| Lần gần nhất một người nghỉ việc/mất máy, dữ liệu và quyền xử lý thế nào? | Mốc thu hồi, máy/gói quyền còn hoạt động, quy trình hỗ trợ | Q07/Q09/F01 |
| Công việc nào khiến người dùng phải nhờ hỗ trợ nhiều nhất? | Ticket/cuộc gọi theo tác vụ và số phút sửa | BS-06, chi phí phục vụ |

## 3. Quy tắc viếng thăm không phát sinh đơn — E2E-22

### 3.1. Luồng ứng viên

Danh sách điểm được phân công → chọn điểm → ghi một lần viếng thăm → kết quả có đơn/không đơn/không gặp/không thể tiếp cận → quan sát/yêu cầu trả tùy tình huống → lưu máy → đồng bộ → theo dõi yêu cầu chưa được giải quyết.

Không bắt người dùng tạo đơn 0 đồng để hoàn thành viếng thăm. Một visit có thể liên kết nhiều đơn hoặc không có đơn; một yêu cầu trả vẫn có vòng xử lý riêng sau khi visit kết thúc.

| Dữ liệu | Quy tắc ứng viên |
|---|---|
| `visitId`, `assignmentId`, `employeeId`, `customerId`, `outletId` | ID ổn định; snapshot quan hệ tại thời điểm ghi; tenant và phân công được kiểm tra khi sync |
| `startedAt`, `endedAt`, `recordedAt`, `serverReceivedAt` | Giữ dấu thời gian và nguồn; không coi đồng hồ máy hoặc GPS là bằng chứng duy nhất |
| `outcome`, `reasonCode`, ghi chú | Outcome hữu hạn; no-order có lý do phù hợp; ghi chú chỉ cần dữ liệu công việc |
| `orderIds` | Tùy chọn, không tạo/chỉnh đơn tự động; outcome có đơn chỉ khi có tham chiếu phù hợp |
| `observations` | SKU/tình trạng/số lượng ước tính/đơn vị nếu cần; đánh dấu quan sát, không là tồn sở hữu NPP |
| `returnRequestIds` | Link yêu cầu; chưa tự chấp nhận thương mại/nhập kho/giảm nợ |
| Vị trí/ảnh | Chỉ bật theo nhu cầu đã chấp nhận và hồ sơ dữ liệu; không mặc định GPS nền hoặc chụp người tại điểm |
| `syncStatus`/ngoại lệ | Người dùng biết đã lưu máy, đã nhận, đang xét hoặc cần xử lý; hết assignment không xóa ghi nhận công việc đã xảy ra |

### 3.2. Kết quả kỳ vọng

Với một visit `V-DEMO-01`, outcome `NO_ORDER`, quan sát 4 chai trên kệ và một yêu cầu trả 2 chai: có một Visit, một Observation và một ReturnRequest; **chưa có** Order, Delivery, StockMovement, Receivable hoặc InvoiceIntent phát sinh chỉ từ việc đóng Visit. Khi người có quyền chấp nhận yêu cầu trả và nhận hàng, tác động trả có ID riêng, tham chiếu yêu cầu/nguồn giao.

Retry `visitId` với cùng hash không tạo visit thứ hai; sửa nội dung sau ghi cần revision có nguồn, không ghi đè lịch sử. Ca này đã có quy tắc và expected result; chưa chạy trên prototype/ứng dụng hoặc với sales thật.

## 4. Bài đo tác vụ trên prototype và sản phẩm

Hướng dẫn GOV.UK về moderated usability testing đề nghị quan sát người dùng thực hiện nhiệm vụ có mục tiêu rõ, dùng chỉ dẫn trung lập và tách kết quả quan sát khỏi cảm nhận. Nghiên cứu này vận dụng phương pháp, không dùng nó làm benchmark NPP Việt Nam [P01](sources.md#p01).

| Bài | Vai trò và lời giao nhiệm vụ | Điều kiện/kết quả cần quan sát |
|---|---|---|
| UX-01 | Sales: “Khách đặt mặt hàng theo thùng và chai, giao hai lần. Hãy ghi nhu cầu và cho biết phần nào đã được xác nhận.” | Đúng Customer/ShipTo/UoM; phân biệt nháp và giữ hàng; không cần người dẫn bấm hộ |
| UX-02 | Người bán B: “Khách lấy hàng và trả một phần tiền. Hãy hoàn thành giao dịch trong điều kiện được cấp.” | Sale/giao/thu đúng; phần chịu 40 trong ca 100/60; pending ngân hàng không thành đã thu |
| UX-03 | Người giao/quản lý: “Khách trả hàng kèm quà của lần giao trước. Hãy tiếp nhận và xử lý đúng vai trò.” | Giữ hộ/chấp nhận/cách ly/hoàn nguồn phân biệt; không tự hoàn vượt số nguồn |
| UX-04 | Kho: “Soạn xe có hàng đã giữ cho A và hàng để bán B; xử lý một mặt hàng thiếu.” | Không dùng hàng A cho B; biết phần chưa được cấp và chứng từ còn thiếu |
| UX-05 | Thủ quỹ: “Nhận tiền nhân viên nộp; số thực nhận khác số đề nghị.” | Chỉ số thực nhận xác nhận; chênh có người xử lý; nợ khách không giảm lần hai |
| UX-06 | Kế toán: “Lần phát hành chưa có kết quả. Hãy xác định chứng từ đã tồn tại hay còn cần xử lý.” | Tra cứu trạng thái; không phát hành lại bằng ID mới tùy ý |
| UX-07 | Sales: “Điểm bán hôm nay không đặt hàng; ghi tình trạng hàng và yêu cầu trả.” | E2E-22, không đơn 0 đồng/không tăng tồn NPP |
| UX-08 | Người đối soát: “Chốt chuyến còn một máy chưa gửi đủ dữ liệu và một khoản tiền chưa nộp.” | Nhận biết dữ liệu thiếu, không kết luận số 0; bàn giao ngoại lệ đúng người |

Mỗi bài ghi trạng thái sản phẩm/phiên bản, loại thiết bị, điều kiện mạng, input, kết quả mong đợi và cách bắt đầu/kết thúc. Không tính ca thử thiếu màn hình hoặc chưa có backend thành người dùng thất bại; đánh dấu `not_testable` riêng. Khi bài đã đủ điều kiện, lỗi ứng dụng hoặc bỏ cuộc phải nằm trong mẫu số phù hợp, không xóa để làm đẹp tỷ lệ.

Phiếu ghi cho từng lần: `sessionId`, vai trò ẩn danh, `taskId`, phiên bản, bắt đầu/kết thúc, kết quả `independent/assisted/failed/abandoned/not_testable`, loại trợ giúp, lỗi gây sai hàng/tiền/hóa đơn, bước dừng, ghi chú, `evidenceId`. Thời gian thao tác và chờ mạng/server tách riêng. Sau bài hỏi người dùng hiểu trạng thái và sẽ làm gì tiếp, không chỉ hỏi có thích giao diện hay không.

## 5. Contract cutover và bàn giao dữ liệu

### 5.1. Nguồn có thẩm quyền và lớp số dư đầu

Đề nghị một thời điểm chốt `cutoverAt` kèm `cutoverId/version`, freeze writer/gói cũ, manifest và người duyệt. Ưu tiên đóng sạch chuyến khi khả thi. Nếu còn chuyến dở, phải nhập phần còn lại đã được đối chiếu; không dùng giờ máy để tự quyết định lệnh thuộc trước/sau chốt.

| Loại nhập | Nguồn/khóa | Tác động mở đầu | Không được phát lại |
|---|---|---|---|
| Danh mục/quy đổi | source system + record ID + effective version | Tạo bản đồ mã; giữ quy cách/precision | Không suy quan hệ từ tên gần giống |
| Tồn kho/xe/cách ly | source ID + location + SKU + lot + status | Lượng và tổng giá trị đầu; giữ A/B thể hiện riêng, không cộng lần nữa | Không chạy lại phiếu mua/bán lịch sử để tạo số dư |
| Phải thu | open-item source ID + Customer + due date/terms | Chỉ phần còn phải thu; khoản có dư riêng | Không nhập tổng khách cùng chi tiết rồi cộng cả hai |
| Customer credit/nghĩa vụ hoàn | source receipt/credit/refund ID | Ghi số dư có nguồn và phần đã dành riêng | Không tự coi mọi số âm là tiền có thể chi hoàn |
| Tiền thu hộ/tạm ứng | employee + source custody/advance ID | Hai loại số dư riêng | Không chạy lại thu tiền đã nằm trong số dư nợ |
| Đơn/chuyến dở | source document/line ID + manifest | Phần đã làm tham chiếu ngoại hệ thống; phần còn làm có quyền mới | Không gửi lại toàn bộ lịch sử giao/thu |
| Hóa đơn/chứng từ ngoài | legal seller + provider + document identity | Liên kết/tra cứu chứng từ đã có | Import không tự phát hành |

Khóa chống nhập trùng là `tenant + sourceSystem + recordType + sourceRecordId` cùng payload hash canonical và phiên bản, không chỉ `batchId`. Cùng khóa/cùng payload trả kết quả đã có; cùng khóa/khác payload cần xét thay thế trước post hoặc chứng từ điều chỉnh sau post. Chuyển file sang batch mới không vượt được khóa nguồn.

### 5.2. Quy trình và điểm có thể quay lui

1. **Chuẩn bị:** lập danh sách nguồn, owner, cutover phạm vi, export cuối và quyền xử lý dữ liệu; chụp trạng thái gói quyền/thiết bị.
2. **Freeze:** ngừng phát sinh nguồn cũ trong phạm vi; thu manifest journal/receipt và hàng–tiền. Máy không liên lạc được là ngoại lệ phải nhận trách nhiệm, chưa được coi không có sự kiện.
3. **Preview:** parse/validate dòng, map mã, phát hiện ID trùng/hash khác, FK thiếu, quy đổi không hợp lệ, tổng không khớp, nguồn hóa đơn đã có. Không sửa dữ liệu âm thầm.
4. **Đối chiếu:** tổng và số dòng theo SKU×location×status, Customer/open-item, employee/custody/advance, cash/bank, document count/link; người phụ trách ký nhận bằng hệ thống/quy trình được chấp nhận.
5. **Post opening:** transaction/batch có trạng thái từng phần, retry an toàn; ghi `cutoverId`, source hashes, mapping version và người duyệt.
6. **Mở writer mới:** epoch/assignment/gói mới; lệnh cũ tới muộn vào đối chiếu manifest, chưa tự ghi thêm.
7. **Theo dõi đầu kỳ:** đối soát giao/thu/trả đầu tiên và ca ngoại lệ; journal/source cũ giữ theo policy, không xóa để “dọn sạch”.

Trước khi có phát sinh phụ thuộc, có thể hủy batch trong trạng thái cho phép và có audit. Sau khi đã có phát sinh mới hoặc hóa đơn/tác động ngoài, sửa bằng chứng từ điều chỉnh có nguồn. Restore database không phải cách đảo hóa đơn đã phát hành.

### 5.3. Hai ví dụ đối chiếu để làm ca nghiệm thu

**CUT-01 — Không thu lần hai khi nhập số dư.** Ví dụ giả lập: hóa đơn lịch sử 200.000, đã thu 60.000, còn phải thu 140.000; nhân viên đang giữ 60.000. Import tạo opening AR 140.000 và custody 60.000, chỉ liên kết hóa đơn/thu lịch sử. Nếu replay phiếu thu 60.000 sẽ làm AR còn 80.000 và sai. Sau cutover thu mới 20.000 thì AR 120.000, custody 80.000. Khi quỹ nhận 50.000: custody 30.000, quỹ tăng 50.000, AR vẫn 120.000. Import lại cùng nguồn không đổi số.

**CUT-02 — Lệnh cũ đến sau.** Manifest ghi delivery `EXT-D1` đã nằm trong opening AR và nguồn hàng đã trừ. Lệnh cùng business source tới muộn phải liên kết kết quả lịch sử, không ghi thêm. Nếu không xác định được nguồn hoặc hash khác, giữ hồ sơ đối soát với người phụ trách, không tự chọn “lệnh mới” vì server lần đầu thấy command ID đó.

Đây là dữ liệu và expected result được thiết kế trong nghiên cứu; chưa chạy importer của sản phẩm. Số học CUT-01 có thể kiểm tra độc lập, nhưng phép cộng/trừ không chứng minh cơ chế transaction hoặc chống trùng đã triển khai.

## 6. Ranh giới DMS–kế toán–provider và sửa sai

MVP không cần trở thành sổ cái để bàn giao dữ liệu có kiểm soát. Đề nghị DMS giữ sự kiện vận hành và nguồn sổ phụ; kế toán giữ kết quả ghi sổ pháp định theo chính sách doanh nghiệp; provider giữ trạng thái/chứng từ điện tử do provider xác nhận. Lựa chọn thẩm quyền cụ thể phải được kế toán pilot chấp nhận.

| Dữ liệu | Bên đề nghị quyết định | Bàn giao/đối chiếu |
|---|---|---|
| Lượng giao/nhận/giữ, trách nhiệm custody | DMS + chứng từ được người phụ trách xác nhận | Event/document/line IDs, quantity/value, source, actor, date |
| Giá vốn vận hành và điều chỉnh | DMS theo Q04; kế toán xác nhận phương pháp/period | Original cost + adjustment version + allocation, không chỉ tổng giá trị cuối |
| Hạch toán tài khoản/thuế cuối kỳ | Hệ thống/người phụ trách kế toán | Export có mốc/phạm vi; nhận ack/import ID, chênh lệch và correction link |
| Hóa đơn/chứng từ điện tử | Provider/hệ thống lập được chọn | External ID, status, reference/hash và link tài liệu; DMS không tự tạo số đã phát hành |
| Quyền hỗ trợ/yêu cầu dữ liệu sau restore | Authority hiện hành theo contract + bên có thẩm quyền | Version/sequence/evidence, có kiểm soát phạm vi dữ liệu |

Mẫu record bàn giao tối thiểu: `tenantId`, `legalSellerId`, `exportId`, `eventId`, `documentType/id/lineId`, `sourceId`, `businessDate`, `postingPeriod`, Customer, SKU/UoM/qty khi có, `net/tax/gross/cost`, `currency`, trạng thái, `externalInvoiceId`, `reversalOf/adjustmentOf`, `payloadHash`, `mappingVersion`. Trường không áp dụng phải phân biệt với số 0. Dữ liệu tiền cụ thể xem [nghiệp vụ](nghiep-vu-va-so-lieu.vi.md).

Retry export cùng event/hash không tạo dòng thứ hai ở bên nhận; nếu bên nhận chỉ hỗ trợ file thủ công, lập import register và ack file để người phụ trách kiểm tra trước nạp lại. Khả năng này chưa được coi là API tự động nếu phần mềm kế toán không có contract tương ứng. Sửa lỗi bằng revision/correction link, không phát lại cả file cũ như một tập sự kiện mới.

## 7. Hàng đợi ngoại lệ có trách nhiệm

| Ngoại lệ | Người nhận đầu tiên | Hành động hợp lệ và điều kiện đóng |
|---|---|---|
| Lệnh chờ cha/ACK không rõ | Đồng bộ/vận hành; người nghiệp vụ khi cần | Tra receipt/dependency; giữ chủ thể retry; một kết quả hoặc ngoại lệ bền có người xử lý |
| Giao/thu đã xảy ra ngoài quyền | Quản lý nghiệp vụ + kế toán | Bảo toàn bằng chứng, xác minh và ghi điều chỉnh có nguồn; không đổi số tiền khách đã trả |
| Trả thiếu nguồn/quà thiếu | Người phụ trách trả | Giữ hộ/xác minh; chấp nhận/từ chối/waiver đúng scope; có kết quả thông báo người yêu cầu |
| Kiểm kê khi còn gói quyền mở | Kho + người quản lý chuyến | Chốt phạm vi đếm, manifest và lượng đang giữ; không giải phóng quyền chưa biết |
| Tiền nộp thiếu | Thủ quỹ + người giao | Xác nhận thực nhận, chứng cứ chênh, người theo dõi; không tự suy bồi hoàn |
| Hóa đơn UNKNOWN | Kế toán + provider support được phép | Lookup/reference/tra cứu chính thức; không đổi ID phát hành tùy ý |
| Import/export khác hash | Người phụ trách dữ liệu/kế toán | Dừng dòng ảnh hưởng, đối chiếu nguồn/mapping, sửa bằng version/adjustment |
| Restore không có authority hiện hành | Vận hành + người quản lý quyền | Giữ tenant khóa, khôi phục/đối chiếu authority; mở lại có bằng chứng |

Hồ sơ ngoại lệ gồm ID, loại, chứng từ/source, trạng thái, người đang chịu trách nhiệm, thời điểm bắt đầu/cập nhật, phần tài nguyên bị giữ, bước tiếp theo, bằng chứng và người đóng. Deadline nghiệp vụ/pháp lý lấy từ profile đã xác định; không dùng một SLA minh họa cho mọi loại.

## 8. Phép đo pilot và quy tắc đọc kết quả

GOV.UK phân biệt điểm bắt đầu/kết thúc giao dịch, mẫu số gồm các lần dở/thất bại và việc nối lần quay lại với lần bắt đầu; chi phí cần tính tổng nguồn lực theo cùng phạm vi [P02](sources.md#p02), [P03](sources.md#p03). Dưới đây là thiết kế phép đo riêng của dự án; không nhập nghĩa vụ báo cáo dịch vụ công của Anh vào pilot NPP.

| Chỉ số | Tử số/mẫu số hoặc cách tính | Cách tránh kết luận sai |
|---|---|---|
| Hoàn thành tác vụ độc lập | Lần đúng kết quả không trợ giúp / lần thử đủ điều kiện bắt đầu | Báo thêm assisted/failed/abandoned/not_testable; n/N theo vai trò/bài |
| Bao phủ sử dụng | Chuyến/đơn trong phạm vi xử lý đủ trên MVP / tổng chuyến/đơn đủ điều kiện | Ca lỗi/bỏ qua vẫn có lý do trong mẫu; không chỉ đếm người đã chọn dùng |
| Thời gian A/B | Trung vị thao tác và thời gian chờ riêng; số quan sát và khoảng | So cùng số dòng/loại giao/thu/mạng; không gộp A/B tùy ý |
| Đóng chuyến | Từ bắt đầu đối soát đến kết quả đóng/bàn giao ngoại lệ; báo tuổi ngoại lệ còn mở | Đóng có ngoại lệ chưa bằng đối soát hoàn tất |
| Đúng số | Chênh lượng/giá trị/nợ/custody theo nguồn và số chuyến đã đối chiếu | 0 chênh chưa giải thích là điều kiện ca nghiệm thu, không suy xác suất lỗi tương lai bằng 0 |
| Ghi trùng | Số incident thêm tác động nghiệp vụ / giao dịch và khoảng quan sát | Retry request không là incident nếu không sinh tác động mới |
| Đồng bộ | Từ kết nối lại ổn định đến durable receipt/resolution; phân trạng thái | Không trừ hai đồng hồ khác nhau rồi coi là độ trễ chính xác; server chưa biết queue offline |
| Hóa đơn | Ý định đủ điều kiện có chứng từ đúng hồ sơ / tổng ý định đủ điều kiện; UNKNOWN và vi phạm mốc riêng | Đã gửi HTTP chưa bằng đã lập hoặc ký/gửi đúng hồ sơ |
| Hỗ trợ | Phút bên SaaS và NPP cho hướng dẫn/sửa dữ liệu/đối soát; số incident | Tách onboarding một lần, công định kỳ và công lỗi; giữ công trợ giúp trong chi phí |
| Tiếp tục/trả phí | Quyết định của người có quyền mua, phạm vi/giá/điều kiện nếu có | “Dễ dùng” không phải cam kết trả phí; chưa có quyết định thì ghi chưa có |

Chốt cohort và cửa sổ đo trước khi bắt đầu; ca offline quay lại phải nối bằng ID ổn định. Trình bày baseline và pilot theo nhóm có thể so sánh, n/N, trung vị/khoảng và chênh lệch chưa giải thích. Mẫu nhỏ dùng để tìm lỗi và xác định điều kiện vận hành; chưa suy ra hiệu quả chung cho thị trường.

Ngưỡng cải thiện thời gian/tỷ lệ tác vụ của R006 là giả thuyết để thỏa thuận. R008 không thay bằng ngưỡng ngành tưởng tượng. Các bất biến tiền/hàng/định danh trong ca nghiệm thu phải đúng; ngưỡng hiệu suất, hỗ trợ và thương mại lấy từ baseline, năng lực và quyết định thực tế.

## 9. Mô hình chi phí để điền bằng dữ liệu thật

Tách ba lớp: chi phí khởi tạo, chi phí phục vụ định kỳ và chi phí phát triển chung. Không kết luận lãi chỉ bằng chi phí database.

Với một tenant trong tháng, công thức ứng viên:

`C_phuc_vu = C_DB_compute + C_storage_backup + C_shared_allocated + C_invoice + C_observability + C_support + C_operations + C_onboarding_amortized`

Trong đó `C_support = (phút hướng dẫn + sửa dữ liệu + đối soát do nhà cung cấp chịu)/60 × đơn giá giờ đầy đủ`; công của NPP ghi riêng để tính hiệu quả khách hàng, tránh vừa tính trong giá SaaS vừa cộng như chi phí nhà cung cấp. Chi phí onboarding được trình bày cả tổng thực tế và phần phân bổ theo kỳ giả định rõ.

`Contribution = doanh thu thuần theo phạm vi − C_phuc_vu`. Đây chưa là lợi nhuận công ty vì chưa phân bổ toàn bộ phát triển, bán hàng và chi phí chung khác. `Cost_per_completed_trip = tổng chi phí theo phạm vi / số chuyến hoàn tất theo định nghĩa`, ghi N và loại chuyến. Không so NPP khác loại chỉ bằng một tỷ số.

| Đầu vào | Nguồn phải thu | Trạng thái hiện tại |
|---|---|---|
| DB/backup/storage theo tenant và mức tải | Đo tài nguyên/cấu hình, bảng giá gói được chọn | Chưa chọn hạ tầng/báo giá thực tế |
| Provider hóa đơn/chứng từ | Hợp đồng/báo giá và sản lượng thuộc gói | Chưa có báo giá/tài khoản pilot |
| Phút onboarding và hỗ trợ | Nhật ký tác vụ theo role/incident | Chưa có ca thật |
| Đơn giá nhân sự và giá bán | Dữ liệu kinh doanh của bên vận hành SaaS | Chưa được cung cấp |
| Số chuyến/giao dịch và tỷ lệ sử dụng | Cohort/nhật ký pilot | Chưa có pilot |

Khi có đầu vào, so ít nhất ba kịch bản khối lượng/hỗ trợ thấp–điển hình–cao lấy từ dữ liệu; chi phí DB-per-tenant có thể có bậc cấu hình, không mặc định tuyến tính. Chưa có số liệu thì giữ công thức, không điền số rồi gọi là dự báo đã xác nhận.

## 10. Trạng thái bằng chứng và các điều kiện tiếp theo

| Lớp bằng chứng | Đã có trong đợt này | Còn thiếu trước kết luận tương ứng |
|---|---|---|
| Quy tắc/expected result | Candidate spec, tác vụ, cutover, mẫu dữ liệu và công thức | Chấp nhận Q01–Q10/phạm vi bởi người có trách nhiệm |
| Số học/mô hình | Các chương trình/JSON trong R008 theo phạm vi mỗi script | Đối chiếu kế toán và engine sản phẩm độc lập |
| Thiết bị/provider/hạ tầng | Contract và ca cần chạy | Tài khoản test được cấp quyền, thiết bị, triển khai thử, log và diễn tập |
| UX/cutover | Bài đo, manifest, điểm quay lui và ngoại lệ | Prototype/bản phát triển, người dùng, file thật và biên bản đối chiếu |
| Giá trị/kinh tế | Thiết kế đo và công thức phục vụ | Baseline, sử dụng thực, thời gian/cost và quyết định người mua |

Đầu vào ưu tiên để mở phần việc tiếp: một hồ sơ NPP/role đủ A+B; mẫu SKU/UoM/terms/chứng từ đã khử nhận diện; hồ sơ seller/provider và quyền sandbox; danh sách thiết bị/mạng; người chấp nhận quyết định. Nghiên cứu đã chuẩn bị được tài liệu để làm việc với các đầu vào đó. Chưa có chúng không cản việc hoàn thiện rule/model, nhưng cản tuyên bố đã kiểm chứng ngoài hệ thống hoặc đã đạt MVP.
