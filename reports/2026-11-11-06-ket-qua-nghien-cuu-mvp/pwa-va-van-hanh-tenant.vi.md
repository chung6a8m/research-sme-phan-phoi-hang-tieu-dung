# NC-07/NC-09 — PWA, quyền offline và vận hành mỗi tenant một database

- Ngày nghiên cứu tài liệu: **11/11/2026**.
- Trạng thái: **kết quả desk research và thiết kế đề nghị; chưa được Owner phê duyệt; chưa có spike, kiểm thử thiết bị, diễn tập restore hoặc pilot**.
- Đầu vào: [B005](../../briefs/2026-11-11-05-nghien-cuu-bo-sung-dat-mvp.md), [R005](../2026-11-11-05-khoang-trong-va-muc-tieu-mvp/report.vi.md), [D01](../2026-11-11-02-nghiep-vu-mvp-pwa/quyet-dinh-va-thuat-ngu.vi.md), [R003](../2026-11-11-03-deep-research-mvp-kien-truc/report.vi.md).
- Nguồn kỹ thuật, vị trí đã đọc và giới hạn: [T01–T19](nguon-ky-thuat.md). Mã T trong phụ lục này thuộc sổ nguồn riêng đó.

## 1. Kết quả và ranh giới kết luận

PWA có các cơ chế cần để xây luồng offline, nhưng tài liệu nền tảng không chứng minh ứng dụng của dự án vận hành an toàn trên máy pilot. Điểm cần chốt trước hết là **quyền giao dịch**, không phải chọn thư viện đồng bộ. B có thể đã giao hàng/nhận tiền trong khi mất mạng; server phải tiếp nhận sự kiện thực tế và trách nhiệm xử lý, kể cả khi không thể ghi sổ tự động.

Giữ nguyên A+B, PWA thay native, tenant-per-database và phân vai xe máy/xe tải. **Toàn bộ hợp đồng, ngưỡng, trạng thái và phương án dưới đây là đề xuất.** PostgreSQL được dùng làm ví dụ có tài liệu công khai về transaction/restore; AWS chỉ là nguồn mô tả outbox, không phải quyết định chọn database, cloud hoặc framework.

Cần giới hạn cách áp dụng hai câu trong R003: “đơn offline chỉ là yêu cầu chờ xác nhận” và “tái định giá khi đồng bộ” phù hợp với **A chưa giao**. Chúng không đủ cho B đã giao/thu. Phụ lục này bổ sung phương án xử lý, không sửa bản lịch sử và không tự phê duyệt chính sách giá/tín dụng.

**Điều kiện [NC-08](hoa-don-va-tuan-thu.vi.md):** B offline chỉ được pilot giao/thu khi có kênh lập hóa đơn đúng thời điểm áp dụng đã xác minh: online hoặc khả năng offline của nhà cung cấp được kiểm chứng. Không dùng mất mạng thường xuyên hoặc chờ sync/cuối chuyến làm căn cứ trì hoãn. Chưa giao mà thiếu kênh phù hợp thì dừng chuyển quyền hàng; đã giao/thu thực tế thì giữ sự kiện và chuyển kế toán xử lý ngoại lệ.

## 2. Khả năng trình duyệt: bằng chứng hiện có

Ma trận là **đối chiếu tài liệu**, không phải kết quả chạy trên thiết bị. “Có” nghĩa là nền tảng có cơ chế, còn phiên bản tối thiểu được hỗ trợ phải chọn sau khi kiểm kê máy pilot.

| Khả năng | Chrome trên Android | Safari/PWA Home Screen trên iOS | Firefox/desktop để đối chiếu | Hệ quả đề nghị |
|---|---|---|---|---|
| Service Worker, IndexedDB | Có trong các bản hỗ trợ được nguồn liệt kê | Có trong các bản hỗ trợ được nguồn liệt kê | Có | Cache ứng dụng và journal cục bộ khả thi về mặt API; cần HTTPS [T04–T05]. |
| Background Sync một lần | Có | Nguồn ghi chưa hỗ trợ | Firefox chưa hỗ trợ; Chromium desktop có | Đồng bộ khi mở app, quay lại foreground và nút chủ động là đường bắt buộc [T01–T02]. |
| Xin persistent storage | Có API; có thể bị từ chối | WebKit có API và cơ chế xét cấp | Có API trên bản hỗ trợ | Kiểm tra giá trị trả về; không coi “đã cài PWA” là bản sao lưu [T03, T07]. |
| Web Push | Không dùng làm điều kiện MVP | WebKit mô tả Home Screen từ iOS/iPadOS 16.4, cần thao tác xin quyền | Ngoài đường giao dịch cốt lõi | Có thông báo không chứng minh đã sync hoặc đã ghi sổ [T19]. |
| Tiếp tục chạy khi khóa màn hình/đóng app | Không có bằng chứng dự án | Không có bằng chứng dự án | Không có bằng chứng dự án | Không hứa thời hạn gửi nền; yêu cầu người dùng mở app để hoàn tất. |

WebKit mô tả best-effort mặc định, eviction theo origin và cấp persistence theo heuristic; quota công bố là giới hạn trên, không phải dung lượng được đặt chỗ [T03]. `navigator.onLine` chỉ là gợi ý kết nối, không chứng minh API của dự án truy cập được [T08].

Đề nghị PWA hiển thị số lệnh chưa có ACK, lần sync thành công, tuổi dữ liệu và lỗi cần xử lý. Chỉ báo “đã lưu trên máy” sau khi transaction cục bộ hoàn tất. IndexedDB vẫn có lỗi quota/I/O và giới hạn durability được tài liệu nêu; không cam kết cứu dữ liệu nếu máy hoặc toàn bộ storage mất [T06]. Ảnh đính kèm cần hạn mức riêng, ưu tiên journal giao dịch khi dung lượng thấp; thiếu dung lượng thì chặn tạo cam kết mới trước khi giao hàng/thu tiền.

## 3. So sánh phương án offline

| Phương án | Lợi ích | Giới hạn/đánh đổi | Đề nghị |
|---|---|---|---|
| Chỉ nháp offline, online mới cam kết | Luật đơn giản; kiểm tra dữ liệu tập trung | B không hoạt động khi mất mạng nếu đã cần giao/thu | Dùng cho A chưa giao và thao tác nhạy cảm. |
| Quyền hữu hạn cấp trước, một thiết bị ghi chính/chuyến | Có thể giao/thu trong giới hạn đã dành | Cần phân bổ hàng/tín dụng, journal và đối soát | **Ứng viên cho B MVP**, phải được duyệt và thử. |
| Nhiều thiết bị bán offline trên cùng lượng hàng | Thuận tiện nếu pilot yêu cầu | Phải chia quyền sử dụng hàng/tín dụng riêng hoặc có điều phối; xử lý bàn giao phức tạp | Chưa chọn; không coi idempotency là đủ. |

Không có phương án nào bảo đảm đồng thời hoạt động vô hạn khi mất mạng, thu hồi quyền tức thì và biết chính xác giao dịch ở mọi thiết bị. Đề nghị giảm phạm vi quyền và giữ bằng chứng, thay vì hứa đồng bộ sẽ giải quyết mọi xung đột.

## 4. Quyền offline hữu hạn cho chuyến

Đề nghị server cấp một **gói quyền offline** sau khi đăng nhập và bàn giao online: tenant, chuyến, người, installation thiết bị, thế hệ quyền (`writerEpoch`), loại thao tác, hàng được dùng, tín dụng từng khách, phiên bản giá/UoM/khuyến mại, giới hạn số giao dịch, thời điểm phải kết nối lại. Gói có dấu xác thực của server; client không tự tăng quyền.

Tách hạn tạo sự kiện với hạn đối soát; lệnh đến server muộn không tự chứng minh sự kiện được tạo ngoài hạn.

Một chuyến chỉ có một installation ghi giao dịch hàng/tiền. Xe tải vẫn có thể hai người; lái xe có tài khoản/quyền phù hợp, không mặc nhiên trở thành người ghi thứ hai. Trong cùng installation, cập nhật số thứ tự, trừ quyền cục bộ và thêm journal phải cùng transaction để hai tab không cùng tiêu một lượng. Một `deviceId` không chứng minh chống sao chép thiết bị; bản sao dữ liệu hoặc can thiệp client vẫn là rủi ro phải phát hiện/đối soát.

**Hàng:** cấp riêng theo chuyến, SKU, đơn vị gốc và trạng thái hàng; lô nếu chính sách yêu cầu. Hàng A đã phân giao không tự chuyển thành tồn B. Bán và tặng đều tiêu quyền hàng. Hàng khách trả mặc định chờ kiểm tra, không tự bổ sung quyền bán offline. Bổ sung hàng/chuyển writer phải online và có bàn giao.

**Tín dụng:** server dành hạn mức cho từng cặp khách–gói quyền, bao gồm mọi chuyến; phần B không chồng với reservation của A hoặc nhân viên khác. Điều kiện đề nghị khi cấp mới:

`Hạn mức khách − Phải thu đã ghi − Tổng tín dụng còn được dành ≥ Phần cấp thêm`.

Khi ghi một khoản bán chịu hợp lệ, chuyển phần quyền đã tiêu thành phải thu trong cùng transaction; không vừa giữ nguyên reservation vừa cộng nợ. Tiền thu offline, hàng trả hoặc chuyển khoản chưa xác minh không tự giải phóng quyền cho chuyến khác. Khách chưa có quyền tín dụng chỉ được dùng phương thức đã duyệt khác hoặc chờ online; một writer/chuyến không giải quyết cạnh tranh giữa các chuyến.

**Giá:** gói mang bản giá và tập quy tắc hỗ trợ, thời hạn áp dụng, UoM, làm tròn, quà và ngân sách đã phân bổ. Giao dịch lưu đầu vào/kết quả/snapshot; thay giá trung tâm không tự sửa giao dịch đã thực hiện theo gói hợp lệ. Khi hết hạn, client dừng giao dịch mới; A nháp có thể nhận báo giá mới để người dùng xác nhận. B ngoài quyền phải vào ngoại lệ, không âm thầm tăng tiền khách phải trả.

**Thời gian:** giờ thiết bị chỉ là lời khai. Dùng mốc server lần cuối và khoảng thời gian trôi qua để phát hiện lệch giờ; sau khởi động lại hoặc khi không chứng minh được khoảng hiệu lực thì yêu cầu online trước cam kết mới. Cách này không tạo đồng hồ đáng tin cậy trên thiết bị bị can thiệp. Hết hạn gói **không** tự trả hàng/tín dụng về quỹ khả dụng: có thể còn sự kiện chưa gửi. Chỉ giải phóng sau đối soát hoặc xử lý ngoại lệ có phê duyệt.

Thời gian offline, số lệnh, giới hạn tiền/hàng và độ lệch giờ cho phép cần Owner cùng vận hành/kế toán chốt từ tuyến thật. Chưa có số đo để đặt con số mặc định.

## 5. Ma trận thao tác đề nghị

| Thao tác | Offline được làm gì | Điều kiện/ý nghĩa khi sync |
|---|---|---|
| Xem danh mục, tuyến, số dư | Xem bản đã tải | Gắn thời điểm và phiên bản; số dư không phải bảo đảm hiện thời. |
| A tạo/sửa yêu cầu chưa giao | Lưu nháp, gửi yêu cầu | Chưa giữ hàng/tín dụng; giá mới cần xác nhận trước cam kết. |
| Duyệt đơn, phân hàng, đổi giá/chính sách | Chưa cho phép | Online; kiểm tra quyền và cạnh tranh trên server. |
| A xác nhận giao trong phân giao sẵn | Ghi sự kiện thực tế nếu được cấp quyền | Không trừ kho nguồn lần hai; vượt phân giao vào ngoại lệ. |
| B bán, giao, tặng | Trong hàng và giá đã cấp | Ghi một giao dịch với các hiệu ứng liên kết. |
| Thu tiền mặt | Trong quyền thu, khách/chứng từ xác định | Phiếu thu có ID riêng; ghi giảm nợ một lần. |
| Ghi khách báo chuyển khoản | Lưu thông tin chờ đối chiếu | Không tự xác nhận tiền ngân hàng đã về. |
| Nhận hàng trả | Lưu nhận thực tế, lý do, tham chiếu | Chờ xử lý chất lượng/giá trị; không tự bán lại hay hoàn tín dụng. |
| Hoàn tiền, sửa chứng từ đã ghi, điều chỉnh tồn | Lưu yêu cầu/ghi nhận sự việc | Quyết định online có thẩm quyền; dùng chứng từ bù/đảo. |
| Nhận thêm hàng, chuyển writer/tenant | Chưa cho phép trong chuyến offline | Bàn giao và phân quyền online; bảo toàn hàng đợi cũ. |
| Lập/ký/gửi/điều chỉnh hóa đơn | Chỉ qua kênh NC-08 đã kiểm chứng | Theo từng mốc áp dụng; biên nhận tại điểm không tự là hóa đơn. |
| Nộp tiền, đóng chuyến | Lập bản kê dự kiến | Đối chiếu và ACK server mới xác nhận hoàn tất. |

Các dòng “chưa cho phép” là hạn chế **hành động mới trên phần mềm**. Nếu việc ngoài đời đã xảy ra, vẫn phải có đường tiếp nhận chứng cứ và xử lý trách nhiệm.

## 6. Hợp đồng client/server đủ để đặc tả MVP

### 6.1. Lệnh, sự kiện và ACK

Phân biệt `intent` (yêu cầu chưa thực hiện) với `occurredEvent` (khai báo đã giao/thu/nhận trả). Không tự chuyển loại chỉ để vượt kiểm tra. Đề nghị envelope khái niệm sau; tên trường chưa khóa API/framework:

| Nhóm | Trường tối thiểu | Quy tắc |
|---|---|---|
| Định danh | `commandId`, `commandType`, `payloadSchemaVersion`, `payloadHash` | ID tạo một lần; hash của nội dung chuẩn hóa; retry giữ nguyên. |
| Phạm vi | `tenantRef`, `actorId`, `installationId`, `tripId` | Server xác minh từ danh tính/quyền; trường client chỉ để đối chiếu. |
| Thứ tự | `writerEpoch`, `localSequence`, `dependsOn[]`, `expectedVersion` | Quan hệ phụ thuộc rõ; không dựa vào giờ máy để sắp xếp. |
| Quyền | `offlineGrantId`, `policyVersions`, `recoveryEpoch` | Xác minh gói quyền và đời dữ liệu server. |
| Sự kiện | thời điểm khai báo, khách/điểm giao, dòng hàng/UoM, giá, tiền, chứng từ nguồn | Snapshot bất biến; tiền/số lượng dùng biểu diễn chính xác. |
| Đính kèm | ID, hash, loại và trạng thái upload | Không gắn nhầm file tenant; biết chứng cứ nào còn thiếu. |

Client cần các chức năng gửi lệnh, tra trạng thái theo ID, kéo thay đổi theo cursor và chuẩn bị/xác nhận đóng chuyến. `HTTP 200/202` không tự tương đương “đã ghi sổ”. Receipt ứng dụng gồm ID/hash, tenant, trạng thái, ID chứng từ/hiệu ứng, phiên bản server, recovery epoch và lý do/cách xử lý.

Các trạng thái đề nghị: `locally_saved`, `awaiting_dependency`, `posted`, `recorded_exception`, `rejected_unexecuted`. Hai trạng thái đầu chưa chứng minh sổ server đã cập nhật; `recorded_exception` chỉ xác nhận sự kiện được lưu bền để xử lý. UI phải chỉ rõ khoản nào chưa đối soát. Quyết định xử lý ngoại lệ là lệnh mới tham chiếu sự kiện gốc; giữ receipt ban đầu và lịch sử xử lý. Người gửi phục hồi có thể khác người thực hiện; lưu cả hai, không gán lại lịch sử cho người nhập.

### 6.2. Chống lặp và transaction

RFC 9110 phân biệt ngữ nghĩa idempotent và điều kiện retry; dùng POST hoặc đặt header không tự làm giao dịch an toàn [T11]. Hợp đồng đề nghị:

1. Xác thực người gọi/tenant; tra khóa duy nhất `(tenant, commandId)`. Cùng ID, cùng hash trả receipt đã lưu và trạng thái xử lý hiện tại; khác hash trả xung đột, không ghi thêm.
2. Với lệnh mới, khóa/kiểm tra phiên bản các tài nguyên bị tiêu. Hai ID khác nhau vẫn tranh cùng hàng/hạn mức; phải có kiểm soát cạnh tranh, không chỉ dedup. Nguồn transaction/isolation minh họa atomicity và khả năng phải retry toàn transaction khi có xung đột [T12–T13].
3. Trong **một transaction tenant DB**, ghi receipt, chứng từ, hiệu ứng kho–phải thu–tiền đang giữ, tiêu reservation, audit và server outbox. Ràng buộc duy nhất trên ID hiệu ứng/chứng từ nguồn ngăn ghi trùng khi đường xử lý khác chạy lại. Nếu thất bại thì không ACK `posted`.
4. Commit theo cấu hình durability đã nghiệm thu, rồi trả ACK. Client lưu receipt bền trước khi đánh dấu hết việc cần gửi; không xóa ngay dấu vết phục vụ đối soát/restore. Durability cấu hình thực tế ảnh hưởng cam kết sau ACK [T17].
5. Worker gửi outbox bằng ID hiệu ứng ổn định, ghi trạng thái gửi/tra cứu. Mẫu outbox giải quyết khoảng hở ghi DB–gửi thông điệp nhưng vẫn có thể phát lặp [T14]; không suy ra đúng một lần tại nhà cung cấp hóa đơn.

Ví dụ thiết kế theo E2E-03: B giao 1.000.000 đồng, thu 600.000 đồng → phải thu còn 400.000 đồng, nhân viên giữ 600.000 đồng, tồn xe giảm đúng hàng đã giao. Gửi lại cùng lệnh không đổi các số này. Nộp 600.000 đồng về quỹ chỉ chuyển trách nhiệm giữ tiền, không tạo lần thanh toán khách thứ hai. Đây là ví dụ tính tay, **chưa phải kết quả phần mềm**.

Receipt/tombstone chống lặp phải tồn tại bao trùm cửa sổ nhận lệnh muộn, thời gian lưu backup và vòng đối soát đã chọn; không dùng TTL tùy tiện rồi coi lệnh cũ là mới. Lệnh từ chuyến/epoch đã đóng vào luồng tra cứu hoặc ngoại lệ, không tự phát sinh giao dịch mới.

### 6.3. Các lỗi bắt buộc có đường xử lý

| Tình huống | Hành vi đề nghị và bất biến |
|---|---|
| Server commit, mất ACK | Giữ lệnh trên máy; tra cứu/gửi lại cùng ID. Không tạo ID mới vì timeout. |
| Lệnh con tới trước lệnh cha | Lưu chờ phụ thuộc hoặc trả mã chờ; không ghi một phần sổ. Công bố lệnh còn thiếu và giới hạn hàng đợi. |
| Hai thao tác cùng tiêu quyền | Trừ quyền bằng transaction cục bộ và server; kiểm tra version/khóa. Không áp dụng last-write-wins cho hàng/tiền. |
| Giá/quyền thay đổi sau B đã giao | Giữ nguyên khai báo và snapshot. Gói hợp lệ xử lý theo chính sách đã cấp; ngoài gói lưu ngoại lệ có người chịu trách nhiệm. |
| Phiên hết hạn | Đăng nhập lại rồi gửi nguyên lệnh; không bỏ queue, không tự cấp quyền offline mới. |
| Người bị thu hồi quyền | Chặn giao dịch mới khi server biết. Sự kiện cũ đi qua người có quyền phục hồi/đối soát; không mở API nhập vô danh để né kiểm soát. Offline không nhận thu hồi tức thì. |
| Đồng hồ lệch, gói hết hạn | Không tin thời điểm khai báo để hợp thức hóa; dừng cam kết mới nếu không xác minh được, giữ sự kiện đã xảy ra để duyệt. |
| Lỗi quota, app bị đóng | Thất bại ghi cục bộ phải hiện rõ. Nếu journal còn thì tiếp tục từ nó; nếu mất thì dùng quy trình chứng từ/đối soát, không hứa tự phục hồi. |
| Gói lệnh cũ gặp schema mới | Giữ payload gốc; adapter được kiểm thử hoặc giữ nguyên chờ xử lý. Không sửa nội dung dưới cùng command ID. |
| Nhà cung cấp hóa đơn nhận, mất phản hồi | Đánh dấu chưa rõ kết quả; tra mã tham chiếu ổn định trước khi phát lại. Nếu API không cho đối chiếu đáng tin cậy, dừng tự động và giao kế toán xử lý. |

Service Worker mới có thể điều khiển trang cũ khi ép `skipWaiting`; nâng IndexedDB còn có thể bị tab cũ chặn [T09–T10]. Đề nghị hoãn thay phiên bản ảnh hưởng schema khi có queue/chuyến đang mở; server công bố dải schema tương thích. Bản vá khẩn cấp có thể chặn việc mới nhưng phải giữ đường nhận dữ liệu cũ. Không “sửa lỗi” bằng xóa storage/đăng xuất khi còn chứng từ chưa ACK.

## 7. Đóng chuyến và thay/mất thiết bị

Đóng chuyến cần trao đổi hai chiều, không suy từ “server không còn lệnh”:

1. Server yêu cầu chuẩn bị đóng, ngừng cấp thêm quyền. Installation ghi chính chuyển sang chế độ không tạo giao dịch mới, chốt `lastSequence` và danh mục ID/hash của journal.
2. Đồng bộ tới mốc đó; server kiểm tra chuỗi liên tục, phụ thuộc, chứng từ, file bắt buộc và ngoại lệ. Thiết bị nhận danh sách thiếu, gửi lại; receipt xác nhận cùng mốc.
3. Người có trách nhiệm xác nhận kiểm đếm, hàng trả, tiền thực nộp, tiền chưa nộp và chênh lệch. Server đóng với phiên bản điều kiện; giải phóng quyền còn lại chỉ sau quyết định này.

Đóng phần hàng/tiền không đồng nghĩa hoàn tất hóa đơn. Giữ riêng trạng thái đối soát vật lý và lập/ký/gửi; chứng từ còn vướng phải có người xử lý theo mốc áp dụng. Không diễn giải trạng thái chờ thành được phép cuối chuyến mới lập hóa đơn.

Thiết bị mất mạng không trả mốc thì chuyến “chờ đối soát”, chưa hoàn tất. Mất máy cần khóa gói/quyền server, ghi sự cố, kiểm kê hàng/tiền và thu chứng từ; một người có thẩm quyền duyệt kết thúc ngoại lệ với dữ liệu còn thiếu được liệt kê. Máy cũ quay lại phải tải vào vùng đối soát, không được viết tiếp như chuyến đang mở.

Thay writer thông thường yêu cầu máy cũ chốt mốc, máy mới nhận gói epoch mới online. Trường hợp mất máy không thể chứng minh đã gửi hết: không cấp lại toàn bộ hàng/tín dụng dựa trên số dư server; phải kiểm đếm và xử lý phần chưa biết trước. Tăng epoch chỉ chặn server chấp nhận lệnh mới cũ, không ngăn người cầm máy thực hiện việc ngoài đời.

## 8. Vận hành tenant-per-database

### 8.1. Phương án và phạm vi cách ly

| Cách bố trí, đều giữ database riêng | Đánh đổi | Đề nghị nghiên cứu tiếp |
|---|---|---|
| Nhiều tenant DB trên dịch vụ/cluster được quản trị | Chia sẻ chi phí nền; chung tài nguyên và miền sự cố | Ứng viên pilot nếu đáp ứng cách ly/restore/giới hạn tải. |
| Một instance riêng mỗi tenant | Dễ dành tài nguyên và tách lịch nâng cấp; chi phí nền lớn hơn | Dành cho yêu cầu được chứng minh. |
| Tự vận hành máy chủ database | Chủ động cấu hình; đội dự án chịu vá lỗi, backup, trực sự cố | Chỉ chọn khi có năng lực và chi phí nhân sự được tính đủ. |

OWASP yêu cầu gắn tenant context với danh tính/quyền được server xác minh [T18]. Đề nghị control plane giữ ánh xạ tenant–DB, secret reference, schema version, trạng thái hoạt động/restore; không chứa sổ nghiệp vụ thay tenant DB. Tài khoản đa tenant phải chọn tenant và được kiểm tra membership mỗi yêu cầu nhạy cảm.

| Thành phần | Hợp đồng cách ly đề nghị |
|---|---|
| API/DB | Connection theo tenant đã xác minh; credential tối thiểu; không fallback sang DB mặc định. |
| File/export | Object thuộc tenant và chứng từ; kiểm tra quyền khi tạo link/tải; tham chiếu phiên bản file phục vụ restore. |
| Cache | Key chứa tenant, quyền và phiên bản khi kết quả phụ thuộc chúng; xóa/invalidate sau restore. |
| Job/webhook | Tenant gắn từ producer tin cậy; worker xác minh lại, dùng credential đúng; không tin tenant do callback tự khai. |
| PWA | Namespace dữ liệu theo tenant/người/installation; đổi tenant không đổi nhãn queue cũ; không hiển thị cache người trước. |
| Hỗ trợ/log | Quyền hỗ trợ có phạm vi, thời hạn, lý do và audit; log tránh payload nhạy cảm; export phục vụ đúng tenant. |

Namespace trong một origin chỉ là kiểm soát ứng dụng, không tạo cách ly trước mã độc/XSS cùng origin. Chính sách thiết bị dùng chung, dữ liệu offline tối thiểu và xử lý mất máy cần thống nhất với phụ lục dữ liệu cá nhân.

### 8.2. Runbook tối thiểu đề nghị

**Tạo tenant:** tạo bản ghi provisioning có ID ổn định; tạo DB/credential, schema đã kiểm tra, vùng file và backup; kiểm tra định tuyến hai chiều; chỉ đánh dấu active khi hoàn tất. Retry provisioning không tạo hai doanh nghiệp hay hai bộ số dư.

**Migration:** quản lý phiên bản/checksum trong từng DB và registry; khóa migration một tenant; thử bản sao dữ liệu và một tenant mẫu trước khi chạy theo lô. Mỗi bước có trạng thái/chỉ tiêu đối chiếu. Ưu tiên thêm cấu trúc trước, chuyển dữ liệu rồi mới loại cấu trúc cũ khi hết client cũ. Lỗi một DB phải dừng tenant đó rõ ràng; ứng dụng biết dải schema hỗ trợ, không ép chạy cùng phiên bản nếu chưa tương thích. Không coi mọi DDL đều rollback được trên mọi DBMS; không tự restore DB để “undo migration” khi đã có giao dịch mới.

**Theo dõi:** số tenant sai schema; queue lâu chưa ACK; gói quyền quá hạn chưa đối soát; lỗi outbox/hóa đơn; dung lượng/pool kết nối; backup gần nhất có kiểm chứng; thời gian phục hồi thực đo. Mỗi cảnh báo có người tiếp nhận và hành động, chưa đặt SLA khi chưa có năng lực trực.

**Xuất/ngừng tenant:** khóa cấp quyền mới, thu hồi integration credential, xử lý chuyến/queue còn mở, xuất chứng từ và tham chiếu file có kiểm tra tổng; retention/xóa theo chính sách được duyệt, không tự chọn thời hạn pháp lý.

## 9. Backup/restore và giao dịch đã ACK

RPO là mức mất dữ liệu được chấp nhận; RTO là thời gian phục hồi cần đạt. Cần tách RPO **server đã ACK** với giao dịch **chỉ có trên máy**. Backup server không bao phủ phần chưa sync.

Ví dụ PostgreSQL: `pg_dump` xuất nhất quán một DB và không bao gồm mọi đối tượng toàn cluster [T15]. PITR dùng base backup/WAL phục hồi cả cluster; muốn lấy riêng tenant thường phải phục hồi cluster tạm rồi trích DB cần dùng [T16]. Đây là một lý do phải thử thời gian/chi phí restore riêng, không coi “DB riêng” tự đồng nghĩa “PITR riêng”.

Đề nghị runbook:

1. Đưa tenant vào chế độ phục hồi, dừng ghi và dispatch tác động ngoài; lưu bản hiện tại phục vụ điều tra, chọn điểm phục hồi và ghi incident ID.
2. Phục hồi sang DB cô lập; đối chiếu schema, tổng kho/nợ/tiền, receipt, outbox và manifest file. Bản backup thành công chưa chứng minh restore thành công.
3. So sánh với nhật ký ACK/hiệu ứng giữ ngoài phạm vi rollback tenant, journal thiết bị và trạng thái nhà cung cấp. Hóa đơn đã phát hành không biến mất khi DB lùi thời gian.
4. Tăng `recoveryEpoch`, vô hiệu cursor/cache/gói quyền cũ. Client có epoch cũ phải bắt tay phục hồi; không tự gửi lại tất cả như lệnh mới.
5. Lệnh đã ACK nhưng thiếu trong DB được tái dựng có kiểm soát với ID cũ, chứng cứ và hiệu ứng ngoài được đối chiếu; không phát hành lại hóa đơn chỉ vì outbox thiếu. Chưa rõ thì giữ ngoại lệ, phân người xử lý.
6. Đối chiếu có người vận hành/kế toán xác nhận rồi mới đổi định tuyến, mở ghi và cấp quyền offline mới; lưu thời gian thực đo cùng lượng dữ liệu chưa khôi phục.

**Khoảng hở cần quyết định:** copy journal ra ngoài bằng outbox bất đồng bộ vẫn có thể chưa kịp lưu khi sự cố xảy ra. ACK sau commit DB không tự hứa RPO bằng 0 khi cố ý restore về trước. Đề nghị MVP có journal/receipt phục hồi độc lập với lần rollback tenant, theo dõi độ trễ và cơ chế dừng replay như trên; Owner phải chấp nhận RPO cụ thể. Nếu yêu cầu mọi ACK đều phục hồi được, phải bổ sung mức lưu bền/nhân bản đồng bộ thích hợp và chứng minh trước pilot, kể cả cửa sổ commit–journal–ACK. Không tuyên bố đạt bằng thiết kế trên giấy.

## 10. Mô hình chi phí vận hành tối thiểu

Chưa có báo giá hoặc tải pilot, nên chưa tính tiền/tenant. Với kỳ tháng, đề nghị thu các biến:

`C = C_app + C_DB_nền + C_nền_vận_hành + Σ(C_DB_i + C_backup_i + C_file_i + C_network_i + C_hóa_đơn_i + C_hỗ_trợ_i) + C_diễn_tập`.

| Nhóm | Biến phải đo/điền giá từ báo giá phù hợp |
|---|---|
| Tải | Tenant hoạt động; người đồng thời; chuyến/ngày; dòng/lệnh; ảnh và retention; đỉnh sync cuối ngày. |
| Database | CPU/RAM/IO, GB dữ liệu/index/WAL, số kết nối/pool, dự phòng và mức durability. |
| Backup/restore | Dung lượng giữ, số bản/địa điểm, journal phục hồi, cluster tạm, giờ diễn tập. |
| File/network | GB lưu, request, băng thông tải/sync/export, versioning và truy xuất backup. |
| Tích hợp/hỗ trợ | Phí hóa đơn/chữ ký theo hợp đồng; giờ onboarding, đối soát lỗi, hỗ trợ/tháng × đơn giá nhân sự. |

Chi phí trung bình `C/N` không bằng chi phí tăng thêm một tenant; bước tăng instance hoặc nhân sự có thể làm chi phí nhảy bậc. Cần tách chi phí cố định, biến đổi và một lần. Chọn dịch vụ/stack sau khi so báo giá cùng RPO/RTO và tải, không chỉ so giá lưu trữ.

## 11. Bằng chứng còn thiếu và điều kiện chuyển bước

| Bài thử đề nghị | Kết quả phải quan sát | Trạng thái |
|---|---|---|
| Android/iOS thật, foreground/khóa máy/khởi động lại; quota/persistence | Không báo đã gửi khi chưa ACK; queue và cảnh báo đúng | Chưa chạy. |
| E2E-07/08: mất ACK, hai ID tranh hàng/tín dụng, đảo thứ tự | Một hiệu ứng; không tiêu trùng quyền; lệnh phụ thuộc không ghi một phần | Chưa chạy. |
| E2E-09/10: giá/quyền thay đổi, clock skew, mất writer | Sự kiện B không mất; đóng chuyến cần mốc hoặc ngoại lệ được duyệt | Chưa chạy. |
| Nâng app/schema khi có queue và tab cũ | Giữ payload/ID; nhận được phiên bản cũ; không xóa journal | Chưa chạy. |
| E2E-11/12: provider nhận mất ACK, restore sau ACK | Không phát lại tác động ngoài; đối chiếu được dữ liệu thiếu | Chưa chạy. |
| Hai tenant có cùng mã SKU/khách; lỗi migration một tenant | API/file/cache/job/PWA đúng phạm vi; tenant kia tiếp tục đúng | Chưa chạy. |

Mỗi bằng chứng cần thiết bị/OS/browser/build, dữ liệu đầu vào, log correlation ID, số dư trước/sau và kết quả quan sát. Chủ vận hành cung cấp tuyến/máy; kế toán quyết định quyền tiền/tín dụng và xử lý chứng từ; kỹ thuật chịu contract/diễn tập; **Owner phê duyệt giới hạn offline, một writer, RPO/RTO và ngoại lệ đóng chuyến**. Đợt này đã hoàn thành phần tra cứu và đề nghị hợp đồng; chưa đủ kết luận NC-07/NC-09 đã nghiệm thu hoặc sẵn sàng pilot.
