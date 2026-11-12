# R008-T — Contract ứng viên cho offline, ACK và phục hồi

- Phiên bản: **BS04-C1**, 12/11/2026, Asia/Bangkok.
- Căn cứ: [R007, F01/F04 và E2E-17/18/19](../2026-11-12-07-review-pr1-va-muc-tieu-tiep-theo/report.vi.md), [B007, BS-04](../../briefs/2026-11-12-07-kiem-chung-va-chot-dac-ta-mvp.md), [R006-T](../2026-11-11-06-ket-qua-nghien-cuu-mvp/pwa-va-van-hanh-tenant.vi.md); snapshot repo HEAD `d1ef1627f2b624bba2d01d32a3cf77eb35a7cf18`.
- Liên kết quy tắc: [đặc tả hợp nhất đề nghị](dac-ta-mvp-de-nghi.vi.md), [số liệu/nghiệp vụ](nghiep-vu-va-so-lieu.vi.md), [hóa đơn và dữ liệu](hoa-don-va-du-lieu.vi.md), [nguồn kỹ thuật K01–K13](nguon-ky-thuat.md).
- **Mức kết quả:** có contract cụ thể và mô hình trạng thái đã thực thi; **chưa có ứng dụng, thử browser/thiết bị, kiểm tra durability DB, diễn tập restore thật, sandbox provider hoặc pilot**. “PHẢI/KHÔNG ĐƯỢC” bên dưới là quy tắc bắt buộc *nếu Owner chấp nhận BS04-C1*, không phải quyết định đã duyệt.

## 1. Phương án được đề nghị và phần đã khép

**Chọn durable inbox cho lệnh chờ phụ thuộc.** Khi server ACK `awaiting_dependency`, server đã nhận trách nhiệm giữ nguyên payload và tiếp tục xử lý. `nonaccepted` không chuyển trách nhiệm khỏi client. Một receipt chờ hoặc ngoại lệ không được hiển thị như đã ghi sổ/đã giải quyết.

**Chọn nguồn quyền, yêu cầu dữ liệu và đời phục hồi nằm ngoài rollback tenant.** Restore không mở lại tenant bằng membership trong backup. Mọi đường đọc, ghi, file, export, hỗ trợ và job phải qua đối chiếu hiện hành trước mở lại; đăng nhập mới cũng phải bị chặn nếu membership đã thu hồi. Khi không xác lập được nguồn có thẩm quyền, tenant ở trạng thái khóa.

Giữ quyết định **mỗi tenant một database**, A+B và PWA. Control plane, RecoveryJournal, GenerationAnchor, một writer/chuyến, thời gian offline và mức lưu bền ở đây đều là **phương án để Owner cân nhắc**, không biến nghiên cứu thành phê duyệt hạ tầng. Database riêng vẫn cần kiểm tra đường API, object storage, job và cache; tenant do client gửi chỉ là selector, không phải bằng chứng được quyền. Cơ sở kiểm soát tenant: [K13](nguon-ky-thuat.md#k13--owasp-multi-tenant-application-security).

| Finding/gap | Quy tắc thay cho chỗ còn mơ hồ | Bằng chứng đợt này | Điều chưa được kết luận |
|---|---|---|---|
| F04 | Bảng custody/ACK ở §4; hai store lưu bền trước ACK; worker bền, deadline và ngoại lệ có chủ | Mô hình đảo cha–con, duplicate, restart, lỗi trước/sau commit | Backend thật chịu lỗi lưu trữ và chạy lại đúng |
| F01 | Authority/Privacy ledger ngoài restore; gate đóng ở §9–10; fresh login dùng quyền hiện hành | Mô hình gate và phản ví dụ chỉ đổi epoch | Restore thật không làm lộ dữ liệu/quyền trên mọi thành phần |
| Downsync | Snapshot/delta/tombstone kích hoạt bằng một pointer transaction; outbox riêng | Hoán vị gói tải, ngắt trước/sau activation, hàng đợi còn nguyên | IndexedDB/Service Worker/migration trên thiết bị |
| Tiêu tín dụng | Một command `SaleDeliveryReceipt`, nhiều ID chứng từ; chỉ tiêu phần phải thu mới đã chấp nhận | 100/100 → 0, 100/60 → 40; chưa xác minh chuyển khoản không được trừ | Quy tắc kế toán/thuế theo hồ sơ NPP và SQL thực tế |
| Hóa đơn sau restore | Khóa hiệu ứng ổn định không đổi theo epoch; UNKNOWN phải đối chiếu | Mô hình giữ một external invoice ID | Provider và kênh lập hóa đơn đúng thời điểm đã kiểm chứng |

## 2. Bất biến và nơi có thẩm quyền

### 2.1. Bất biến dùng để nghiệm thu

| Mã | Bất biến bắt buộc của BS04-C1 |
|---|---|
| OFF-01 | Mỗi lệnh đã lưu cục bộ còn ở hàng đợi cần gửi, hoặc đã có payload bền do server nhận trách nhiệm; không có khoảng “cả hai bên đều thôi xử lý”. |
| OFF-02 | `(tenantId, commandId)` chỉ gắn một payload hash. Retry không sinh ID mới; hiệu ứng nghiệp vụ có khóa nguồn duy nhất độc lập với số lần request. |
| OFF-03 | Một lần bán–giao–thu được chấp nhận tạo đầy đủ các hiệu ứng đã khai báo hoặc không ghi hiệu ứng nào. Sự kiện đã xảy ra nhưng chưa ghi sổ phải còn nguyên trong ngoại lệ. |
| OFF-04 | Hàng và tín dụng trong grant không âm; hai command ID khác nhau vẫn phải tranh cùng tài nguyên bằng kiểm soát transaction. |
| OFF-05 | Restore không tự cấp lại membership, support access, mục đích xử lý dữ liệu hoặc grant đã bị thu hồi. Không có nguồn hiện hành thì không mở truy cập. |
| OFF-06 | Không tái dùng recovery generation, writer generation hoặc installation namespace đã bị retire; token cũ không trở thành hợp lệ chỉ vì restore counter. |
| OFF-07 | `activeBundle`, cursor, giá/UoM/quyền và tombstone chỉ đổi như một thế hệ nhất quán; không kích hoạt gói thiếu/trộn. |
| OFF-08 | Bootstrap/rebase/upgrade không xóa hoặc sửa payload outbox chưa hoàn tất. Không phục hồi số dư grant bằng cách bỏ qua lệnh cục bộ. |
| OFF-09 | Hóa đơn/tác động ngoài đã xảy ra không bị tạo lại chỉ vì DB hoặc outbox bị lùi. Không dùng epoch mới làm khóa phát hành mới. |
| OFF-10 | Quyền xóa/hạn chế và nghĩa vụ giữ hồ sơ được áp theo loại dữ liệu/mục đích; giữ chứng từ không tự cho phép dùng lại dữ liệu đã bị hạn chế cho mục đích khác. |

### 2.2. Phân vùng dữ liệu ứng viên

| Thành phần logic | Nội dung/nguồn có thẩm quyền | Độc lập với phạm vi phục hồi nào? |
|---|---|---|
| `TenantDB` riêng | Chứng từ, sổ hàng/nợ/tiền, inbox, receipt projection, outbox, projection quyền | Là đối tượng có thể restore; bản membership trong đây không có thẩm quyền sau restore |
| `AuthorityLedger` | Membership hiện hành theo tenant/subject, vai trò, `membershipRevision`, thu hồi device/grant, support grant, trạng thái tenant | Ngoài rollback TenantDB; ghi thay đổi có revision tăng và audit |
| `PrivacyActionLedger` | Yêu cầu đã xác minh, quyết định xóa/hạn chế, mục đích, phạm vi, legal hold, bằng chứng thực hiện | Ngoài rollback TenantDB và các bản dữ liệu được yêu cầu xử lý |
| `GenerationAnchor` | `authorityLineageId`, high-water mark epoch, namespace/writer đã retire, dấu vết thay root tin cậy | Ngoài **cả rollback control plane**; có phương án khôi phục thảm họa riêng |
| `RecoveryJournal` | Payload chuẩn hóa được mã hóa theo tenant, hash, lịch sử acceptance/receipt, quyết định ghi sổ gốc và toàn bộ posting plan với số tiền/lượng/nguồn/ID hiệu ứng, chứng cứ phục hồi | Ngoài rollback TenantDB; là bản ghi phục hồi, không phải sổ số dư nghiệp vụ thay TenantDB |
| `ExternalEffectRegistry` | Khóa hóa đơn/tác động ngoài, hash, trạng thái `reserved/submitting/unknown/issued/failed_final`, provider ID, artifacts | Ngoài rollback TenantDB; tra cứu provider là bằng chứng bổ sung |
| `ObjectManifest` | Tenant/chứng từ sở hữu file, object version, digest, trạng thái upload/xóa/hold | Phải đối chiếu với phiên bản file thực và PrivacyActionLedger, không chỉ restore DB reference |

Đây là **các trách nhiệm logic**, không bắt buộc bảy microservice. Có thể gom thành ít dịch vụ có transaction nội bộ và phân quyền phù hợp. Tuy nhiên, tạo nhiều bảng/DB trên cùng một bản backup rồi rollback cùng nhau **không tạo độc lập phục hồi**. RecoveryJournal làm tăng bản sao dữ liệu cá nhân, chi phí và phạm vi cần bảo vệ; ledger quyền không được trở thành bản sao liên hệ/ảnh không cần thiết.

API xác thực danh tính trước, xác minh tenant membership/service scope hiện hành rồi mới chọn connection. Identity provider chứng minh người đăng nhập là ai, không tự chứng minh họ còn thuộc tenant. Luồng worker và tài khoản hỗ trợ có danh tính/phạm vi riêng; không dùng service account toàn quyền như cách bỏ qua quyền đã thu hồi. Đây là áp dụng thiết kế của dự án, tham chiếu nguyên tắc ở [K13](nguon-ky-thuat.md#k13--owasp-multi-tenant-application-security).

## 3. Command, receipt và điểm nhận trách nhiệm

### 3.1. Envelope BS04-C1

| Trường | Hình thức và quy tắc |
|---|---|
| `protocolVersion`, `payloadSchemaVersion` | `BS04-C1`, số phiên bản schema; server công bố dải nhận được. Payload schema cũ không được âm thầm sửa dưới cùng ID. |
| `tenantId`, `commandId` | Tenant opaque; command ID gồm namespace installation được cấp một lần và `localSequence`. Uniqueness xuyên mọi recovery epoch. Không lấy giờ máy làm khóa duy nhất. |
| `commandType`, `kind` | Ví dụ `SaleDeliveryReceipt`; `kind=intent` hoặc `occurredEvent`. Khai báo “đã xảy ra” không tự làm giao dịch hợp lệ. |
| `payloadHash`, `canonicalizationVersion` | SHA-256 trên nội dung bất biến theo JCS/RFC8785 và schema đã khóa; lưu bytes chuẩn hóa. Bỏ token đăng nhập, attempt ID và transport metadata khỏi phần băm. |
| `originalActorId`, `installationId`, `installationIncarnationId`, `tripId` | Danh tính thực hiện ban đầu và installation đã cấp; người gửi phục hồi được ghi riêng ở `submittedBy`, không viết lại tác giả sự kiện. |
| `sourceRecoveryEpoch`, `writerEpoch`, `offlineGrantId`, `grantHash` | Gói quyền nguồn; đối chiếu generation hiện hành. Đổi epoch không được biến payload cũ thành lệnh mới. |
| `localSequence`, `dependsOn[]` | Số tăng trong installation; dependency gồm `commandId` và kết quả yêu cầu `posted`. Không dùng timestamp hoặc thứ tự đến HTTP để suy quan hệ. |
| `expectedResourceVersions`, `policyVersions`, `bundleId` | Phiên bản nguồn kho/grant/chứng từ, UoM, giá, ưu đãi, điều khoản liên quan. Server kiểm lại, không tin result tính trên máy. |
| `saleId`, `deliveryId`, `receiptId`, `allocationIds[]` | ID tài liệu riêng, tạo ổn định một lần; nullable nếu tài liệu tương ứng không có. Không đồng nhất một command với một số chứng từ duy nhất. |
| `occurredAtClaim`, `lastOnlineAnchorId`, `elapsedSinceAnchorMs` | Thời điểm lời khai và chứng cứ clock; không tự biến thành giờ đáng tin cậy. |
| `payload` | Khách/điểm bán, dòng hàng, quy đổi, giá/thuế theo snapshot, thu và phân bổ, nguồn credit, lý do/chứng từ. Tiền và đại lượng chính xác là chuỗi decimal/integer có schema, không dùng floating point để quyết định số dư. |
| `attachments[]` | Object ID, tenant, hash, MIME, dung lượng, trạng thái và mức bắt buộc. Nhận envelope không đồng nghĩa ảnh đã upload. |

JCS là cơ sở đề nghị tạo biểu diễn ổn định; phải khóa schema số/chuỗi và xử lý JSON trùng tên trường. Hàm hash nhỏ của mô hình ở §11 chỉ dùng integer/ASCII, **không phải thư viện JCS để đưa vào sản phẩm**. [K08](nguon-ky-thuat.md#k08--rfc-8785-json-canonicalization-scheme)

**Payload mismatch:** cùng `(tenantId, commandId)`, khác hash → `409 idempotency_payload_mismatch`, `acceptedDurably=false` đối với *payload mới*. Giữ receipt/payload gốc nguyên vẹn; không ghi sổ hoặc ghi đè. Client giữ cả dấu vết lỗi, chặn auto retry biến thể và chuyển người phụ trách. Nếu biến thể mô tả sự kiện thực khác, chỉ được tạo hồ sơ phục hồi mới sau xác minh, liên kết ID xung đột để tránh ghi hai lần. Không trả payload gốc cho người không còn quyền đọc.

### 3.2. Bảng ACK và người giữ trách nhiệm — đóng F04

`acceptedDurably=true` là ACK truyền dữ liệu. `commandTerminal` nghĩa là trạng thái xử lý command đã kết thúc; `businessResolved` nghĩa là nghiệp vụ liên quan đã được xử lý, chưa bao hàm trạng thái pháp lý hóa đơn. HTTP status không thay các trường này; ngữ nghĩa retry của HTTP không tự tạo dedup nghiệp vụ. [K07](nguon-ky-thuat.md#k07--rfc-9110-http-semantics)

| Receipt/trạng thái | Payload được server giữ bền? | Command terminal / nghiệp vụ resolved | Ai chịu trách nhiệm tiếp theo? | Client được làm gì? |
|---|---|---|---|---|
| `locally_saved` | Chưa biết/chưa gửi | Không / không | Client + người giữ thiết bị | Giữ nguyên journal, gửi khi có phiên hợp lệ; hiển thị chỉ lưu trên máy |
| `transport_unknown` | Có thể đã lưu, chưa có receipt tin cậy | Không / không | Client tiếp tục tra/retry; server vẫn phải xử lý nếu đã nhận | Không đổi ID; không xóa journal |
| `nonaccepted` | **Không xác nhận nhận bền payload này** | Không / không | Client; lỗi quyền cần người có quyền phục hồi | Retry lỗi tạm bằng ID cũ; lỗi cấu trúc/quyền chuyển xử lý. Không đánh dấu truyền xong |
| `accepted_queued` | **Có**, full canonical payload trong inbox và RecoveryJournal | Không / không | Server inbox worker | Lưu receipt cục bộ bền rồi có thể dừng gửi lặp payload; còn poll/status và giữ dấu vết |
| `awaiting_dependency` | **Có**, cùng bảo đảm `accepted_queued` | Không / không | **Server** giữ việc chờ, đánh thức khi cha xong, deadline và escalation | Không phải tự gửi lại con để kích hoạt; phải gửi cha còn thiếu nếu journal có; UI hiển thị chờ |
| `posted` | Có; kết quả/ID hiệu ứng đã được lưu và archive | Có / có cho phần sổ đã chấp nhận | Server outbox, vận hành/kế toán theo trạng thái hóa đơn riêng | Hiển thị ghi sổ; không suy hóa đơn đã phát hành hay chuyến đã đóng |
| `rejected_unexecuted` | Có; lý do và payload/metadata theo retention | Có / có đối với **intent chưa xảy ra** | Người dùng sửa ý định bằng command mới nếu còn muốn thực hiện | Không retry nguyên lệnh để chờ đổi kết quả; giữ liên kết bản bị từ chối |
| `recorded_exception` | **Có**, nguyên sự kiện thực và hồ sơ ngoại lệ | Có / **không** | Vai trò xử lý ngoại lệ được giao, SLA vận hành và kiểm soát đóng chuyến | Dừng gửi lặp payload nhưng tiếp tục thấy chưa đối soát; không coi hàng/tiền đã vào sổ |

Không dùng `rejected_unexecuted` cho việc đã giao/thu/nhận trả chỉ vì grant hết hạn, dependency thất bại hoặc quyền đổi. Phải có đường `recorded_exception` được xác thực. Nếu người cũ đã mất membership, API thường trả nonaccepted/403; payload vẫn ở máy, người có quyền thu hồi dữ liệu/đối soát nhập qua kênh recovery. Không mở API vô danh để “bảo toàn sự kiện”.

Receipt tối thiểu gồm `receiptId, tenantId, commandId, payloadHash, acceptedDurably, payloadStored, commandTerminal, businessResolved, state, reasonCode, receiptRevision, acceptedAt, updatedAt, sourceRecoveryEpoch, currentRecoveryEpoch, durabilityClass, statusCursor, missingDependencies[], effectIds[], documentIds[], exceptionCaseId, assignedRole, nextAction, retryAfterMs`. Khi phục hồi, thêm `materializationState=present/recovery_pending/reconstructed` và `recoveryCaseId`; trạng thái phục hồi projection không viết lại kết quả lịch sử. `receiptRevision` chỉ tăng; quyết định xử lý ngoại lệ là command mới tham chiếu case và sự kiện gốc, không thay nội dung receipt lịch sử.

Ví dụ receipt chờ bền: `acceptedDurably=true`, `payloadStored=true`, `state=awaiting_dependency`, `commandTerminal=false`, `businessResolved=false`, `missingDependencies=[P]`, `assignedRole=server_inbox_worker`. Receipt này không được phát nếu hệ thống chỉ giữ C trong RAM.

### 3.3. API và phục hồi trạng thái

| Interface ứng viên | Hợp đồng |
|---|---|
| `POST /v1/commands` | Nhận envelope; cùng ID/hash trả trạng thái hiện tại, không tạo lệnh mới. Xác thực/tenant/giới hạn payload trước tiếp nhận. |
| `GET /v1/commands/{id}/receipt` và batch receipt lookup | Tra theo ID/hash nguồn, có phân quyền. `unknown` là không tìm thấy ở phạm vi tra, **không** là bằng chứng chưa từng ghi sổ. |
| `GET /v1/receipt-changes?cursor=...` | Dòng thay đổi receipt theo tenant/installation được phép; cursor generation riêng với data cursor. Advance sau khi lưu bền trang kết quả. |
| `POST /v1/recovery/handshake` | Gửi epoch nguồn, danh mục ID/hash/sequence và receipts của máy; server trả hiện hành, lệnh thiếu, đã biết, conflict, case phục hồi. |
| `POST /v1/trips/{id}/prepare-close` / `confirm-close` | Chốt manifest sequence và ID/hash, đối chiếu đủ dữ liệu/ngoại lệ trước giải phóng grant. |

`unknown` ở epoch còn mở → gửi lại đúng ID/payload. `unknown`, `cursor_expired` hoặc mismatch sau restore → bắt tay phục hồi, không blind replay như lệnh mới. Status stream mất trang hoặc đổi generation phải tải status snapshot và tra mọi ID còn mở; không đánh dấu “xong hết” bằng cách nhảy cursor. Không dùng data cursor để suy mọi command tới trước nó đã được server nhận.

## 4. Transaction, crash và dependency

### 4.1. Luồng tiếp nhận có custody bền

1. Xác thực người gửi, tenant/current membership/service scope; kiểm schema/kích thước, grant/namespace và hash. Tra khóa dedup ở RecoveryJournal/inbox. Khóa tenant ở trạng thái restore thì chỉ endpoint recovery có scope mới được dùng.
2. **J1:** ghi canonical payload, hash, source epoch, acceptance record vào RecoveryJournal độc lập bằng thao tác idempotent; xác nhận lưu bền theo cấu hình được nghiệm thu. Journal mã hóa, phân quyền theo tenant; log thường không chứa payload.
3. **T1:** insert inbox với unique `(tenantId,commandId)` và dependency graph vào TenantDB. Không cần gửi HTTP response từ giữa transaction. Nếu J1 đã thành công mà T1 chưa thành công, reconciler phải dựng lại inbox từ J1; client vẫn giữ retry vì chưa nhận ACK.
4. Chỉ sau J1+T1 mới trả `accepted_queued`/`awaiting_dependency` với ACK nhận bền. Không thể xác định ghi bền có xảy ra không → response/mất phản hồi thuộc `transport_unknown`; không hứa “chưa nhận gì” sau một write chưa rõ kết quả.
5. **T2:** worker khóa inbox, grant/resource rows và phiên bản tài nguyên; kiểm dependency, quyền thực thi hiện hành, trạng thái tenant, nguồn chứng từ; ghi toàn bộ chứng từ/sổ, tiêu grant, terminal receipt, audit và server outbox trong **một transaction TenantDB**. Không gọi provider trong T2.
6. **J2:** archive terminal receipt, quyết định ghi sổ gốc, toàn bộ posting plan (số lượng/giá trị, allocation, giá vốn/phần dư, snapshot điều khoản/thuế/giá, resource versions, ID và thứ tự commit), effect IDs/hash và kế hoạch tác động ngoài. Lưu đủ giá trị quyết định, không chỉ ID trỏ tới snapshot có thể mất khi restore. Chỉ khi J2 bền mới trả receipt terminal được xác nhận và cho phép dispatch tác động ngoài. Barrier này áp cho **mọi đường POST response, GET/batch receipt lookup, status stream, UI projection và webhook**, không riêng response đầu tiên. Crash giữa T2–J2 được reconciler đọc commit T2 còn tồn tại rồi hoàn tất J2, không chạy lại effects; mất cả bằng chứng T2 theo nhánh `recovery_pending` ở §10.

Đây là giao thức nhiều bước có recovery; **không gọi J1/T1/T2/J2 là một distributed transaction nguyên tử**. J1 mồ côi phải có scan/worker, đo backlog và owner. Nếu journal không sẵn sàng, dừng ACK nhận bền; server không được hạ âm thầm xuống “DB-only ACK”. Lợi ích là trách nhiệm ACK còn ngoài rollback tenant; giá phải trả là độ trễ, phụ thuộc thêm và chi phí bảo vệ bản sao.

| Điểm lỗi | Dữ liệu/bước còn lại | Chủ trách nhiệm và kết quả cho phép |
|---|---|---|
| Trước J1, xác nhận chưa ghi | Client journal còn | `nonaccepted`, client retry; chưa hiệu ứng |
| Sau J1, trước T1 | RecoveryJournal có payload | Server recovery tạo inbox; client chưa ACK vẫn retry cùng ID |
| Sau T1, mất ACK | Hai bản nhận bền có payload | Server tiếp tục; client lookup/retry dedup |
| Trong T2 trước commit | Toàn bộ effect transaction abort | Server retry transaction đầy đủ; không có nửa phiếu thu/nửa xuất kho |
| Sau T2, trước J2/ACK terminal | Tenant có effects/receipt, journal có payload | Hoàn tất J2 từ commit; không dispatch ngoài trước J2 |
| Sau J2, mất ACK hoặc worker restart | Terminal history đủ | Trả cùng kết quả nguồn, worker outbox tiếp tục có dedup |
| Restore về trước T2 | Inbox/receipts projection có thể thiếu | Dừng auto replay; đối chiếu journal, ngoài hệ thống và source versions theo §10; khôi phục có kiểm soát bằng ID cũ |

Khóa uniqueness thêm `(sourceCommandId,effectKind,effectOrdinal)` và ID chứng từ nguồn để đường import/recovery không nhân đôi. Khi serialization conflict, retry **toàn T2** với cùng command ID. Độ bền commit và mức isolation cần bằng chứng cấu hình/test; mô tả transaction không tự chứng minh fsync/replica hoặc chống mọi cạnh tranh. [K09–K10](nguon-ky-thuat.md#k09--postgresql-18-transaction-isolation)

### 4.2. Dependency graph có kết thúc hoặc case bền

| Trường hợp | Quy tắc BS04-C1 |
|---|---|
| Con tới trước cha | Persist con, `awaiting_dependency`, lưu `missingDependencies`, index theo parent ID; khi cha posted, worker bền được đánh thức; scan sau restart sửa việc bỏ lỡ notification. |
| Cha đã `rejected_unexecuted` | Con intent → rejected; con occurredEvent → recorded_exception. Không coi reject của cha là phép xóa sự kiện con. |
| Cha `recorded_exception` hoặc chưa resolved | Không xem như posted. Con chuyển ngoại lệ/reject theo kind với reason `dependency_failed`; case có quan hệ để người xử lý xem đủ chuỗi. |
| Tự tham chiếu, cycle A→B→A | Phát hiện graph khi tiếp nhận và trước thực thi; không chờ vô hạn. Mọi node cycle được gắn `dependency_cycle`; physical event vẫn bền. |
| Cha không bao giờ tới | Deadline ứng viên **24 giờ từ acceptedAt server**; quá hạn chuyển rejected/recorded_exception, giao điều phối chuyến. Đây là ngưỡng escalation nghiên cứu, không phải thời hạn pháp luật. |
| Cha tới sau deadline | Receipt terminal cũ không tự sống lại. Resolve bằng command được duyệt, tham chiếu event/case/cha; vẫn dùng khóa nguồn chống trùng. |
| Thiếu ảnh bắt buộc | Event envelope được ACK bền, file có receipt riêng; vào `awaiting_evidence` trong case hoặc giữ queued theo policy. Không hứa ảnh đã lưu nếu chưa hash/commit object. |
| Queue quá tải/schema không nhận được | Nonaccepted trước admission, nêu retry/đường recovery. Đã nhận bền thì không bỏ việc vì quota worker; backlog có cảnh báo/owner. |

Retry transport đề nghị 1–2–4–8… tới 60 giây, có jitter và tôn trọng `Retry-After`, đồng thời cho sync thủ công khi mở app/foreground. Sau durable ACK, client poll trạng thái; server scan accepted/dependency cả khi không có client. Các khoảng trên là cấu hình ứng viên; không hứa browser sẽ chạy timer lúc app bị đóng. Background Sync chỉ là hỗ trợ, không phải đường duy nhất. [K04](nguon-ky-thuat.md#k04--mdn-background-synchronization-api)

### 4.3. Giữ receipt, tombstone và trạng thái cục bộ

Không garbage-collect payload đang `accepted_queued`/`awaiting_dependency` hoặc case chưa có handover chịu trách nhiệm. Sau terminal, payload/chứng từ giữ theo lịch đã được kế toán/phụ trách dữ liệu xác nhận; tối thiểu đủ phục vụ các backup còn được phép restore và case còn mở. Nếu yêu cầu pháp lý buộc giảm dữ liệu, ledger ghi action/redaction và hạn chế phục hồi, không xóa âm thầm receipt rồi để lệnh cũ được nhận như mới.

Khóa dedup rút gọn chỉ giữ phần cần thiết: namespace/command ID, hash hoặc dấu chống trùng phù hợp, trạng thái, ID nguồn và record retire. Đây vẫn có thể là dữ liệu liên kết cá nhân, không tự gọi là ẩn danh. Một namespace chỉ được xóa các khóa lẻ sau khi **đã retire bền ở authority**, mọi API/recovery chặn tiếp nhận mới từ namespace đó, backup/restore giữ deny rule. ID/epoch retired không tái dùng. Vì vậy đến muộn sau thời hạn lưu trả `retired_namespace/recovery_required`, không tự tạo hiệu ứng mới.

Client lưu receipt vào cùng journal namespace bền trước khi gỡ khỏi tập cần truyền. Giữ bản gốc đến chốt chuyến/biên bản đối soát và theo lịch dữ liệu được duyệt; `recorded_exception` vẫn là tác vụ mở. Logout/đổi tenant phải khóa vùng đọc của người cũ, không gắn queue sang tenant mới. Nếu cần xóa dữ liệu trên máy có queue chưa ACK, trước hết bàn giao qua kênh recovery được phép hoặc ghi rõ mất dữ liệu và xử lý chứng từ; không báo “đã sync” chỉ để dọn storage.

## 5. Bán–giao–thu và ba sổ tiền

### 5.1. Chọn một command, nhiều chứng từ

`SaleDeliveryReceipt` (có thể gọi `SaleBundle` trong mô hình khái niệm) chứa một giao dịch B với sale/delivery/receipt/allocation riêng. T2 commit đồng thời: chứng từ bán; dòng xuất/COGS theo nguồn; khoản phải thu; phiếu thu hợp lệ và phân bổ; số tiền nhân viên đang giữ; tiêu hàng/tín dụng; receipt/outbox/audit. Tax event liên kết delivery; trạng thái hóa đơn riêng theo [R008-L](hoa-don-va-du-lieu.vi.md).

Không bẻ sale/giao/thu cùng lúc thành ba command mạng độc lập rồi hy vọng cuối cùng số dư sẽ đúng. Nếu thu tiền thực sự xảy ra sau, dùng command thu riêng với receipt ID riêng và allocation tham chiếu khoản phải thu đã có. Thu/nộp/hoàn/có dư là các nghiệp vụ khác nhau; nộp tiền không tạo khoản khách trả lần hai. Chi tiết ledger và rounding ở [phụ lục nghiệp vụ](nghiep-vu-va-so-lieu.vi.md).

### 5.2. Phần quyền tín dụng thực tiêu

Gọi `P` là tổng phải thanh toán của sale sau các quy tắc tiền/thuế đã được chấp nhận, `R` là tiền **đã được chấp nhận và phân bổ vào chính sale này trong T2**, `C` là có dư khách đã được server **dành riêng cho grant** và được dùng trong T2. Điều kiện `0 ≤ R + C ≤ P`; số nhận vượt P được xử lý có dư riêng, không làm phải thu âm.

`newReceivable = P − R − C`; `creditConsumed = newReceivable`; `grantCreditRemaining' = grantCreditRemaining − creditConsumed`.

Nếu R/C không hợp lệ, thiếu chứng cứ hoặc chưa reserve, không tự đưa vào công thức. Lời khai khách chuyển khoản chưa đối chiếu chỉ là pending payment evidence, không phải R. Thu nợ cũ giảm khoản cũ khi được ghi sổ nhưng **không tự nạp lại quyền offline**; cả credit mới phát sinh và tồn trả đều cần phân bổ online nếu muốn dùng lại.

| Trường hợp giả lập, P=100 | R | C đã reserve | Phải thu mới / tín dụng tiêu | Tiền nhân viên nhận/giữ | Grant còn, nếu ban đầu 100 |
|---|---:|---:|---:|---:|---:|
| Thu đủ tiền mặt 100 | 100 | 0 | **0** | 100 | 100 |
| Thu tiền mặt 60 | 60 | 0 | **40** | 60 | 60 |
| Khách báo chuyển khoản 100, chưa xác minh | 0 | 0 | 100 | 0 | 0 |
| Thu 60 và dùng 20 có dư đã reserve | 60 | 20 | 20 | 60 | 80 |
| Nhận 120, phân vào sale 100 | 100 | 0 | 0 | 120; có dư riêng 20 | 100 |
| Nhận 60 nhưng chưa phân vào sale này | 0 | 0 | 100 | 60; chưa phân bổ 60 | 0 |

Ví dụ 100/100 không tiêu quyền chịu không có nghĩa trả lại toàn bộ grant cho người khác: phần reservation chưa dùng vẫn dành cho thiết bị cho tới đối soát/release online. Trong ví dụ 100/60, `phải thu mới 40 + grant còn 60 = reservation ban đầu 100`; không vừa giữ 100 reservation vừa cộng 40 nợ. Các số là fixture đơn vị tiền thống nhất, **không giả định thuế suất hay quy trình NPP cụ thể**.

Khi validation không cho ghi toàn bundle nhưng hàng/tiền đã trao, lưu nguyên lượng/tiền khai báo trong `recorded_exception`, hiện ở danh sách **đã khai báo thực tế/chưa vào sổ**, chặn đóng chuyến thông thường. Không giảm số tiền người thực hiện khai đã nhận về 0 để cân sổ. Người có quyền quyết định correction/suspense/hoàn/bù bằng command có nguồn và audit; chỉ khi có chứng từ xử lý thì các sổ mới đổi. Bảo toàn sự kiện không đồng nghĩa tự công nhận mọi lời khai là hợp lệ.

## 6. Quyền offline hữu hạn và storage trên máy

### 6.1. Grant ứng viên

Grant được ký và gắn `tenantId, originalActorId, installationIncarnationId, tripId, writerEpoch, sourceRecoveryEpoch, grantId, permittedCommands, allocatedStock, creditByCustomer, reservedCustomerCreditRefs, policyVersions, bundleHash, issuedAtServer, newCommitNotAfter, maxLocalSequence, reconcileBy`. Hàng, tiền, số lệnh cụ thể phải được cấp từ chuyến/phạm vi đã được duyệt, không dùng budget vô hạn.

**Thời hạn ứng viên để thử: tối đa 8 giờ từ lần cấp/xác minh online**, ngắn hơn nếu kết thúc ca/gói giá sớm hơn. `newCommitNotAfter` dừng cam kết mới; `reconcileBy` là hạn đưa vào đối soát, không là hạn xóa sự kiện. Đề nghị đối soát trong vòng 24 giờ, quá hạn chuyển điều phối; tới muộn vẫn có intake recovery. Hai con số 8h/24h chỉ là cấu hình khởi đầu để Owner/vận hành thử với tuyến thật; thay đổi cần revision policy, không sửa grant cũ.

Thiết bị dùng mốc server và thời gian trôi qua để phát hiện lệch, không tin giờ lịch do người dùng sửa. Sau khởi động lại, mất monotonic anchor, lùi giờ hoặc không chứng minh còn hiệu lực → dừng giao dịch mới và yêu cầu online; vẫn giữ event đã xảy ra. Nhiều tab phải chia cùng sequence/reservation transaction. Bản sao installation hoặc máy bị can thiệp không được coi là một thiết bị đáng tin chỉ nhờ `deviceId`.

**Thu hồi offline không tức thì:** server từ chối ngay các yêu cầu mới mà nó xác định đã mất quyền; máy đang mất mạng có thể chưa nhận thu hồi. Client tuân thủ contract hết quyền mới tối đa cuối lease 8h, hoặc sớm hơn khi biết revoke; mã độc, đồng hồ bị can thiệp, bản sao dữ liệu, ảnh chụp màn hình và hàng/tiền ngoài đời không được bảo đảm bởi TTL. Không thể tuyên bố xóa/thu hồi dữ liệu từ xa trên máy chưa kết nối. Người cầm máy có thể vẫn hành động vật lý ngoài phần mềm; intake ngoại lệ phải tồn tại.

Quyền hết hạn/thu hồi **không giải phóng tự động** hàng hoặc hạn mức còn dành, vì có thể còn sự kiện chưa gửi. Thay writer online bình thường cần manifest đóng writer cũ; mất máy phải kiểm đếm/thu chứng từ và chốt phần chưa biết trước cấp lại. Một writer là giới hạn ứng viên của B, không đổi vai lái xe/người giao đã chọn.

### 6.2. Local transaction và mất dữ liệu không cứu được

Trước một cam kết mới, client phải commit cùng transaction IndexedDB: immutable payload/outbox, tăng localSequence, trừ reservation cục bộ và lưu document IDs. Chỉ báo “đã lưu trên máy” sau completion; lỗi quota/abort → không xác nhận có bản ghi và không cho phần mềm tạo cam kết mới. Nếu việc đã xảy ra bên ngoài, dùng biên bản/đường phục hồi, không giả vờ rollback việc thực tế.

`durability=strict` và xin persistent storage là biện pháp giảm rủi ro cần thử, không là lời hứa khôi phục sau mất máy/xóa storage. W3C 3.0 đang là Working Draft và mô tả durability dưới dạng hint; MDN nêu quota/eviction, cùng khả năng transaction bị abort khi đóng browser. [K01–K03](nguon-ky-thuat.md#k01--w3c-indexed-database-api-30), [K06](nguon-ky-thuat.md#k06--mdn-using-indexeddb)

Phần chỉ tồn tại ở máy, chưa có durable server ACK, có thể mất hoàn toàn. Sao lưu server không bao phủ phần này. UI cần hiển thị số lệnh chưa ACK, lần sync cuối, lỗi storage và công việc đối soát; ảnh nặng không được chiếm hết dung lượng cần cho journal. Dữ liệu offline giảm theo tuyến/mục đích; namespace tenant/user giảm lỗi ứng dụng nhưng không bảo vệ trước XSS cùng origin.

## 7. Bootstrap, snapshot, delta, tombstone và nâng app

### 7.1. Gói nhất quán

Manifest `bundleId, tenantId, subjectScope, sourceRecoveryEpoch, schemaVersion, baseCursor, targetCursor, snapshotVersion, membershipRevision, privacyRevision, grantId/grantHash, catalogVersion, uomVersion, priceVersion, promotionVersion, termsVersion, parts[{id,hash,bytes,required}], objectRefs, tombstoneWatermark, createdAtServer, activationNotAfter, manifestHash/signature` là bất biến. Mọi trang dữ liệu mang đúng bundle/part/version; grant chỉ dùng với bundle digest tương ứng.

Server chụp snapshot nghiệp vụ nhất quán tại watermark và bảo đảm dải delta tiếp nối không có lỗ. Những phần ngoài TenantDB dùng revision authority đã kiểm tra và activation ticket ràng buộc manifest; nếu revision thay đổi trong lúc chuẩn bị, tạo manifest mới hoặc khóa kích hoạt tới khi xác minh lại. Không dùng thời gian tải của từng request như phép nối version.

| Bước client | Hành vi và điều kiện activation |
|---|---|
| 1. Handshake | Xác thực hiện hành, kiểm epoch/schema và quyền tải; tải manifest và lease/ticket. Old epoch → recovery handshake trước bootstrap. |
| 2. Stage | Tải vào namespace generation mới; kiểm hash/part ID, đủ dependency giá/UoM/grant/tombstone. Chưa thay active pointer hoặc cursor. |
| 3. Validate | Đủ mọi part bắt buộc; cùng tenant/subject/epoch; refs và version khớp; gói chưa hết activation lease; reconcile với receipt/grant consumption của local outbox. |
| 4. Activate | Một transaction IndexedDB đổi `activeBundlePointer`, `dataCursor`, revision và trạng thái grant/overlay nhất quán. Dữ liệu lớn đã stage từ trước, không phải copy mọi blob trong transaction này. |
| 5. Clean | Chỉ xóa staging bỏ dở và generation projection cũ không còn tham chiếu. Không xóa outbox/receipt store hoặc chứng cứ cần giữ. |

Delta áp vào staged copy từ **đúng baseCursor**, có upsert và tombstone, rồi activate cùng quy tắc. Trang thiếu, sai hash, target lùi, base không khớp hoặc cursor đã hết hạn → bỏ phần staging lỗi và bootstrap/rebase; active bundle cũ vẫn dùng trong lease còn hợp lệ, hết lease thì chỉ xem trạng thái được phép/không cam kết mới.

`CacheStorage`/object blobs không tự cùng transaction với IndexedDB. File bắt buộc phải có bản đã kiểm hash theo ID nội dung trước activation; pointer chỉ tham chiếu phần hoàn tất. File tùy chọn được ghi rõ chưa có, không làm client hiểu toàn gói đầy đủ. Không dựa vào đổi cache name để giả định đã xóa mọi dữ liệu nhạy cảm.

### 7.2. Tombstone và hàng đợi khi rebase

Tombstone chứa entity ID/type, deletion/restriction revision, scope/purpose và sequence; không cần phát toàn lý do nhạy cảm xuống máy. Tải snapshot mới phải loại bản ghi bị tombstone trước activation. Server giữ tombstone đủ tới khi mọi cursor còn hợp lệ đã vượt watermark; khi phải compact, **vô hiệu toàn bộ cursor cũ bị ảnh hưởng** và yêu cầu bootstrap. Không gửi delta thiếu tombstone cho cursor chưa thấy xóa.

Outbox là journal độc lập với projection dữ liệu. Snapshot mới phải có receipt/source consumption markers đủ để biết command nào đã vào base. Overlay chỉ trừ những lệnh chưa được base bao hàm; một command mất ACK nhưng đã có trong snapshot không được trừ hai lần. Không chứng minh được → khóa tạo giao dịch mới và đối chiếu ID/hash, không lấy số dư mới rồi cấp lại quyền đã dùng.

Lệnh gốc tham chiếu khách bị xóa/hạn chế vẫn giữ phần chứng cứ được phép theo PrivacyActionLedger trong vùng hạn chế; không tái tạo khách trong master để hợp thức hóa queue. Lệnh epoch cũ ở trạng thái `recovery_required`; adapter/nhập lại chỉ qua người có quyền. UI và file cache của người bị thu hồi không được hiện vì “outbox cần giữ”.

### 7.3. App/schema update có queue

Server hỗ trợ payload schema được công bố và giữ adapter đã kiểm chứng cho queue còn mở. Nâng schema cục bộ phải copy/verify payload digest, sequence, receipts và reservations trước switch; không reserialize rồi cập nhật hash dưới cùng ID. Upgrade bị tab cũ chặn thì giữ bản dùng được, yêu cầu đóng tab sau khi lưu, không xóa DB. Worker mới chỉ được kích hoạt ngay nếu tương thích với trang/schema cũ; bản vá khẩn cấp có thể dừng tạo mới nhưng phải giữ intake dữ liệu cũ. Những rủi ro lifecycle/`onblocked` có cơ sở nền tảng ở [K05–K06](nguon-ky-thuat.md#k05--googlewebdev-the-service-worker-lifecycle); flow của dự án **chưa được chạy trên browser**.

## 8. Generation không lặp và hóa đơn ngoài lần restore

### 8.1. Không reset epoch từ backup

`recoveryEpoch = authorityLineageId + tenantRestoreSequence`. GenerationAnchor cấp sequence bằng compare-and-append bền, kiểm lớn hơn mọi high-water đã quan sát trước khi ký/công bố. Writer/install/grant IDs cũng mang namespace có registry/retire rule; không tạo đời mới bằng counter nằm trong TenantDB được restore. Token/grant/cursor/cache key phải bind đầy đủ tenant, lineage, epoch, purpose và quyền, không chỉ một số epoch đơn lẻ.

Nếu control plane restore về counter cũ, nguồn anchor độc lập vẫn cấp sequence tiếp theo. Nếu bản control plane cho biết high-water **cao hơn anchor**, coi là không nhất quán: dừng cấp, điều tra và đối chiếu, không chọn số thấp hơn. Việc dùng random UUID mới chỉ giảm xác suất trùng, không thay bằng chứng quyền hiện hành, fencing và quyền thu hồi.

Thảm họa cả control plane/anchor: **không xác lập được authoritative high-water và quyền thì fail closed**. Phương án khôi phục là tái lập từ bản sao/chứng cứ độc lập đã xác minh; hoặc nghi thức lập authority lineage/root khóa mới do người có quyền phê duyệt, làm mọi verifier/gateway/worker chỉ tin root mới, retire toàn lineage cũ và đối chiếu đầy đủ quyền/privacy/effects. Phải chứng minh root mới khác root cũ và không còn đường cũ phát token/dispatch. Nếu mất cả chứng cứ để xác nhận các điều đó, không tự mở tenant. BS04-C1 không tuyên bố có sẵn hạ tầng anchor hay nghi thức này.

### 8.2. Hiệu ứng hóa đơn

Khóa `invoiceIntentId/clientReference` phải ổn định theo bên bán pháp lý + tax/supply event + phiên bản chứng từ/correction relationship. **Không thêm recoveryEpoch để tạo khóa mới sau restore.** Payload hash đổi dưới cùng intent → conflict, kế toán quyết định sửa/thay thế đúng luồng; không phát sinh lại “bản gốc”.

Trước call provider, worker ghi ExternalEffectRegistry bền với intent/hash và generation dispatch. Freeze/restore phải dừng dispatcher, thu hồi fencing lease và kiểm các call đang bay; request cũ có thể đã tới provider nên fence nội bộ không đủ kết luận chưa phát hành. Sau timeout/crash, đặt `unknown` và tra lookup/callback/artifacts theo key cũ. `not_found` tạm thời hoặc provider không có lookup tin cậy **không** cho phép đổi reference rồi phát lại. Chỉ retry theo hợp đồng idempotency và bằng chứng negative-final đã kiểm chứng của provider; còn mơ hồ thì khóa hiệu ứng, giao kế toán/provider đối chiếu.

Outbox vẫn cần consumer chịu duplicate; nó không tạo exactly-once end-to-end. [K12](nguon-ky-thuat.md#k12--aws-prescriptive-guidance-transactional-outbox) Restore phải liên kết invoice đã issued vào tài liệu được tái dựng, giữ provider ID/artifacts, không gửi lại vì outbox restored thiếu. Chính sách đúng thời điểm lập hóa đơn và điều kiện B mất mạng theo [R008-L](hoa-don-va-du-lieu.vi.md); mô hình offline không cấp ngoại lệ pháp luật.

## 9. Quyền và yêu cầu dữ liệu hiện hành — đóng F01

### 9.1. Các bản ghi tối thiểu

`AuthorityLedger`: `tenantId, subjectId/serviceId, membershipRevision, roles/scopes, status, effectiveAt, revokedAt, device/grantRevocations, supportGrantId/expiry, authorizationAuditRef`. TenantDB chỉ giữ projection đã đối chiếu. Phiên đăng nhập mới và cũ đều kiểm revision/current authorization; restore không được dùng membership ở backup làm fallback khi authority không hoạt động.

`PrivacyActionLedger`: `requestId, tenantId, subjectRef, purpose, action, scope/entitySelectors, verifiedBy, legalBasisRef, effectiveAt, revision, retentionClass, legalHoldRef/holdUntil, decisionStatus, executionStatusByStore, evidenceRefs`. Phân biệt yêu cầu nhận được với quyết định hợp lệ và hành động thực thi; chỉ áp đúng action được xác minh, không xóa mọi thứ vì một cờ “delete=true”. Ledger chứa định danh tối thiểu; bản scan/ảnh yêu cầu có retention và quyền riêng.

Thu hồi membership server phải ngăn admission mới theo revision ngay khi authority công bố. Lệnh đã admission trước thời điểm revoke không tự bị xóa; worker kiểm lại quyền nhạy cảm/thu hồi grant trước xử lý. Intent không còn được phép → rejected; event đã xảy ra → exception, người phục hồi có quyền tiếp nhận. Việc hoàn tất request đang chạy phải có quy tắc fencing/drain và audit: **chỉ báo thu hồi hoàn tất sau khi đường đang chạy/cached authorization được chặn theo phạm vi cam kết**. Không giả định atomic transaction xuyên authority–TenantDB; lỗi cập nhật fence giữ tenant/subject ở `revoke_pending` và chặn mở thêm, không trả thành công giả.

### 9.2. Áp dụng ngoài database

| Bề mặt | Điều phải làm trước mở lại tenant hoặc kết luận hoàn tất hành động |
|---|---|
| API và fresh login | Kiểm current membership, session/device/grant revocation; user bị thu hồi không đọc được dù có đăng nhập mới hợp lệ ở identity provider |
| Cache server/CDN/PWA | Invalidate hoặc đổi namespace theo epoch + auth/privacy revision; kiểm không phục vụ cache cũ qua route khác; thiết bị offline ghi là chưa xác nhận purge |
| File/object versions | Đối chiếu manifest và overlays xóa/hold; quyền cả upload, download, version cũ và link. Personal file dùng đường kiểm quyền hiện hành, tránh long-lived public URL |
| Export/job | Hủy job chưa phát, vô hiệu link tải/bản export còn quản lý, quét output phục hồi. Bản người nhận đã tải không thể được coi là xóa chỉ bằng xóa link; có danh sách thông báo/thu hồi và tình trạng xác nhận |
| Support access | Revoke session/JIT grant cũ, giữ audit; cấp lại quyền hỗ trợ mới có lý do/phạm vi/thời hạn và kiểm tenant hiện hành |
| Logs, analytics, tickets, RecoveryJournal | Áp hạn chế/redaction theo phạm vi hợp lệ; không dùng bản journal hoặc backup làm đường đọc dữ liệu đã bị hạn chế |
| Replay, webhook, invoice worker | Trước execute kiểm tenant active, current generation/service scope, privacy purpose và effects registry; callback không tự khôi phục dữ liệu bị xóa |

### 9.3. Retention khác với cho phép sử dụng

Chứng từ cần giữ theo nghĩa vụ pháp lý/hold có thể còn tồn tại trong vùng truy cập hạn chế; không dùng lý do giữ hóa đơn để tiếp tục GPS, marketing hoặc xem liên hệ không còn mục đích. Dữ liệu được xóa hợp lệ ở t1 nhưng còn trong backup t0 phải bị overlay trước mở đọc/replay ở t2. Backup được bảo vệ, có vòng đời và restore procedure, không phải bản sao tự do cho hỗ trợ tra cứu.

Trường hợp chưa kết luận căn cứ giữ/xóa: giữ trạng thái hạn chế và giao người phụ trách dữ liệu/pháp chế quyết định; không khai yêu cầu đã hoàn tất bằng cách đổi cờ trong TenantDB. Phân loại, thời hạn và nguồn pháp luật theo [R008-L](hoa-don-va-du-lieu.vi.md). Không đặt chung một TTL kỹ thuật cho hóa đơn, GPS, ảnh, receipts và hồ sơ lao động.

Thiết bị bị thu hồi đang offline được ghi `purge_pending/ack_unknown`; ngừng cấp/renew grant, giảm dữ liệu có thể tải mới, cảnh báo vận hành thu hồi máy/chứng từ. TTL chỉ ràng buộc client tuân thủ và cam kết mới, không bảo đảm erasure trên thiết bị mất kiểm soát. Kênh phục hồi queue phải nhận dữ liệu do người có thẩm quyền bàn giao, không cho nhân viên đã mất quyền mở cache để tự xử lý.

## 10. Runbook restore có evidence gate

Runbook là quy trình **đề nghị để thực thi và ký biên bản**, không phải biên bản đã chạy. Dùng incident ID và tenant cụ thể, không ảnh hưởng routing/backup tenant khác. PostgreSQL PITR vật lý có phạm vi cluster; nếu chọn stack đó, phục hồi cluster cô lập rồi trích tenant là phương án cần đo, không mặc định DB riêng có PITR riêng. [K11](nguon-ky-thuat.md#k11--postgresql-18-continuous-archiving-and-pitr)

| Gate / người chịu trách nhiệm | Thao tác và điều kiện qua | Bằng chứng phải lưu |
|---|---|---|
| G0 — Vận hành/kỹ thuật | Đưa tenant `restoring`; dừng API thông thường, grant mới, export/job/dispatcher; drain/fence call đang bay; giữ bản hiện tại điều tra | Incident, routing/fence generation, danh sách in-flight, thời điểm freeze, baseline tenant đối chứng |
| G1 — Người phụ trách quyền/dữ liệu | Đọc AuthorityLedger và PrivacyActionLedger **hiện hành**, xác minh revision/hash/checkpoint; liệt kê revoke/restriction/delete/hold sau điểm backup | Bản manifest có thẩm quyền, người xác nhận, mốc hiện hành; thiếu/mâu thuẫn → **dừng, không mở** |
| G2 — Vận hành DB | Restore sang vùng cô lập; kiểm schema/checksum, chứng từ/số dư, file manifest, inbox/receipt/outbox, khoảng dữ liệu mất | Backup ID/restore point, checksum/tổng kiểm, lỗi, thời gian; không gọi backup successful là restore đạt |
| G3 — Kỹ thuật + phụ trách dữ liệu | Reconcile membership và privacy overlay vào dữ liệu restored; xử lý cache/file/export/support/log/journal; giữ hồ sơ hợp lệ trong vùng hạn chế | Đếm đối tượng trước/sau theo từng surface; `purge_pending` thiết bị/bản ngoài; thử fresh login bị thu hồi, quyền hỗ trợ cũ và URL/file/export cũ |
| G4 — Kế toán + kỹ thuật | So RecoveryJournal/receipts với DB: đã ACK nhưng thiếu, chưa rõ T2, version conflict, attachments thiếu; đối chiếu provider registry/artifacts | Danh sách ID/hash, kết quả lookup, số dư ba sổ, mọi UNKNOWN và case có chủ; không blind replay |
| G5 — Người được quyền phục hồi | Tái dựng command/effects có bằng chứng bằng ID nguồn cũ; `recoveryApplyId` riêng làm audit, không ID bán/hóa đơn mới; sự kiện chưa rõ giữ ngoại lệ | Danh mục duyệt replay/không replay, chứng cứ nội bộ/ngoài, trước–sau số dư, original receipt còn nguyên và recovery status riêng |
| G6 — Authority operator | Cấp epoch mới từ GenerationAnchor; retire epoch/cursor/grant/dispatch lease cũ; dựng bundle mới, invalidate auth/data cache | New generation anchor proof, old-token denial, counter không lặp qua restore controlplane; mismatch → dừng |
| G7 — Vận hành + kế toán + phụ trách quyền | Chạy matrix hai tenant, fresh login/token cũ, file/export/support/job, duplicate command, snapshot interrupted và invoice unknown; đối chiếu phần thiếu | Log có correlation ID, số dư/digest, thiết bị/build/config; chủ ký kết quả và ngoại lệ cụ thể |
| G8 — Vận hành | Chỉ mở routing/read/write/dispatch/cấp grant sau G0–G7 đủ; client cũ recovery handshake; theo dõi backlog/ngoại lệ | Quyết định reopen có scope, người ký, thời gian thực đo, danh sách chưa phục hồi và đầu mối |

**Phân biệt ba loại phục hồi, không chạy lại mọi command qua policy mới:**

| Chứng cứ hiện có | Cách phục hồi |
|---|---|
| Đã `posted` và J2/receipt terminal bền | Khôi phục **quyết định và các bút toán gốc** theo posting plan, source IDs và thứ tự nguồn; không tái tính theo giá/thuế/giá vốn/quyền hiện tại, không reject lịch sử chỉ vì người thực hiện sau đó đã nghỉ. Người phục hồi có quyền hiện hành phê duyệt việc tái dựng; actor gốc vẫn bị thu hồi quyền truy cập. |
| Chỉ accepted/queued, chưa có quyết định ghi sổ | Không giả định đã posted. Kiểm quyền thực thi hiện hành, grant và snapshot được phép của sự kiện; không đủ điều kiện thì rejected cho intent hoặc recorded_exception cho physical event. Không âm thầm tái định giá việc đã giao. |
| Có dấu T2 từng commit nhưng J2 thiếu, DB bị lùi và không đủ chứng cứ kết quả gốc | `recovery_pending`; giữ dữ liệu/ID và case, đối chiếu nguồn độc lập. Không tự đánh dấu chưa từng làm rồi xử lý lại theo policy hiện tại. Ghi rõ phần chưa tái dựng và chặn tác động ngoài/đóng đối soát tương ứng. |

Privacy overlay vẫn áp trước mở đọc đối với **cả ba nhánh**; khôi phục bút toán cần giữ không tái mở mục đích xử lý hoặc membership cũ. Mô hình §11 **chưa chạy toàn bộ rollback ledger rồi tái dựng posting plan**; chỉ kiểm custody, gate và registry trong phạm vi công bố.

Nếu có lỗi sau mở thử, quay lại `restoring`/read restricted và fence generation hiện tại; không rollback authority/PrivacyActionLedger về bản cũ để làm các gate “khớp”. Tiền/hàng đã trao và hóa đơn đã issued tiếp tục là sự kiện cần đối chiếu.

**RPO/RTO phải tách bốn phạm vi:** dữ liệu đã có durable server ACK; lệnh chỉ có trên máy; file chưa upload; hiệu ứng provider ngoài backup. Thiết kế J1/J2 chỉ nói vị trí nhận trách nhiệm và yêu cầu lưu bền, không tự chứng minh RPO bằng 0 khi mất cả miền phục hồi. Chưa có phép đo RTO/RPO hoặc chi phí của hạ tầng ứng viên; kết quả này không chọn SLA bán cho khách.

### E2E-19 cụ thể để diễn tập

T0 chụp backup khi U còn membership, thông tin liên hệ còn trong DB/cache/file/export và support grant còn hiệu lực. T1 thu hồi U, thực hiện xóa/hạn chế hợp lệ một trường liên hệ nhưng giữ hóa đơn theo hồ sơ retention; phát hành invoice `I1`, ghi ledger ngoài rollback. T2 restore TenantDB về T0. Kết quả bắt buộc trước reopen: U đăng nhập mới vẫn không vào tenant; support grant/link cũ bị chặn; contact không xuất hiện qua các surface thuộc quyền kiểm soát; `I1` còn một bản và được relink; generation mới không trùng; tenant đối chứng không đổi. Thiết bị mất mạng/bản export đã tải ghi đúng “chưa xác minh xóa”, không ký hoàn tất toàn bộ erasure bằng phép thử server.

## 11. Kết quả mô hình đã chạy và giới hạn

### 11.1. Lệnh thực thi và kết quả

Mô hình chỉ dùng Python stdlib, tiền mẫu là integer, “lưu bền/restart” được biểu diễn bằng JSON round-trip; một assignment biểu diễn commit nguyên tử. Chạy tại thư mục gốc repo:

```bash
python3 reports/2026-11-12-08-khep-quy-tac-va-dac-ta-mvp/kiem-chung-giao-thuc.py
```

Kết quả thực tế, exit code **0**, Python **3.12.14**, lần chạy ghi trong JSON là **2026-11-12T00:05:25.388659+00:00**:

```text
MODEL_VERIFIED scenarios=14942 assertions=269729 suites=12 negative_controls=4
```

Mã: [kiem-chung-giao-thuc.py](kiem-chung-giao-thuc.py). Kết quả máy đọc: [ket-qua-giao-thuc.json](ket-qua-giao-thuc.json), có SHA-256 của mã chạy, số lượng mỗi nhóm, giả định và phần chưa kiểm. Các con số là kích thước không gian kiểm tra hữu hạn, không phải xác suất an toàn hay số giao dịch pilot.

| Nhóm | Số kịch bản | Phạm vi thực sự quan sát trong mô hình |
|---|---:|---|
| Cha/con/duplicate/restart + lỗi tại 9 điểm | 3.240 | 120 thứ tự sự kiện × 9 lỗi × 3 mức thu; không mất custody, một bộ effect |
| Dependency fail/cycle/timeout | 10 | Intent reject, physical event vào exception, cha đến muộn không hồi sinh terminal |
| Payload mismatch | 4 | Không ghi đè original payload/effects ở cả waiting và posted |
| Bundle bán–giao–thu | 7 | Sáu số dư kỳ vọng độc lập và một phân bổ không có tiền hỗ trợ |
| Hai ID tranh credit | 120 | Một command được ghi 70/100, command còn lại thành ngoại lệ, quyền còn 30; thao tác **tuần tự hóa** trong model |
| Snapshot/delta/tombstone | 1.445 | 1.440 thứ tự/cut trước–sau activation và 5 part sai version; outbox không bị thay |
| Upgrade/old cursor | 5 | Giữ payload cũ, khóa tạo mới trong nhánh không tương thích; cursor epoch cũ yêu cầu bootstrap |
| Restore và gate có/mất authority | 10.080 | 7! thứ tự gate × 2 tình trạng authority; không mở trước đủ gate, fresh login U bị chặn |
| Controlplane disaster/generation | 8 | Anchor không lùi theo counter backup; counter bất nhất hoặc mất authority bị khóa |
| Local save/lease | 14 | Local transaction abort không tiêu grant; ví dụ 8 giờ/restart/revoke nhận được; cũng cho thấy cửa sổ revoke offline |
| Provider UNKNOWN | 5 | Mô hình registry chỉ link I1 hoặc giữ unknown, không blind send mới |
| Negative controls | 4 | Cố ý tái hiện ACK không persist, chỉ đổi epoch, trộn version và tiêu gross credit khi đã thu đủ; invariant phát hiện cả bốn |
| **Tổng** | **14.942** | **MODEL_VERIFIED — không phải E2E sản phẩm đạt** |

### 11.2. Truy vết các ca cũ và mới

| Ca | Điều kiện/kết quả kỳ vọng cụ thể | Trạng thái bằng chứng |
|---|---|---|
| E2E-03/06 | Sale=100, nhận/phân bổ 60: AR40/cash60/credit tiêu40; nộp tiền chỉ đổi người giữ, trả/hoàn theo chứng từ nguồn | Bundle số dư có MODEL_VERIFIED; nghiệp vụ nhiều ngày/thuế/trả xem phụ lục nghiệp vụ; nộp thực chưa chạy |
| E2E-07 | Commit rồi mất ACK, retry cùng ID/hash; receipt lookup và effects không tăng | MODEL_VERIFIED cho state model; HTTP/DB thật chưa chạy |
| E2E-08 | Hai ID tranh quyền, khóa/transaction không cho tiêu vượt | MODEL_VERIFIED cho thứ tự tuần tự; concurrency/isolation SQL thật **chưa thử** |
| E2E-09 | Grant/giá/quyền đổi, clock không tin được: không sửa giao dịch cũ, sự kiện ngoài quyền có case | Một số nhánh clock/lease/exception MODEL_VERIFIED; thiết bị và chính sách giá thực chưa chạy |
| E2E-10 | Writer mất mạng không có lastSequence/manifest thì không đóng bình thường; mất máy phải kiểm đếm và chốt ngoại lệ | Đã có contract; **chưa thực thi trong model toàn luồng đóng chuyến hoặc thiết bị** |
| E2E-11 | Provider đã nhận nhưng timeout; giữ key và tra I1 trước retry | Registry model giữ một I1; provider thật **chưa chạy** |
| E2E-12 | Hai tenant mã SKU giống nhau; restore tenant A không đổi B hoặc mở đường file/cache sai | Digest tenant đối chứng chỉ là MODEL_VERIFIED; **chưa kiểm cách ly ứng dụng** |
| E2E-17 | C tới trước P; server/client restart; lỗi trước persist không ACK; cha fail/cycle/timeout thành kết quả bền | MODEL_VERIFIED cho các hoán vị/nhánh công bố, không mất custody |
| E2E-18 | Tải giá/UoM/grant/tombstone dở; crash trước/sau pointer commit; rebase giữ outbox; tab cũ chặn upgrade | Pointer/version/outbox model đã kiểm; browser/IDB/cache/schema migration thật **chưa chạy** |
| E2E-19 | T0 backup, T1 revoke/privacy/I1, T2 restore; current authority, generation mới, fresh login/file/export/support gates | Gate và invoice registry model đã kiểm; **chưa restore một DB/object thật, chưa đo RPO/RTO** |

Model chứng minh các bất biến giữ trong những trạng thái/nhánh đã mã hóa **với giả định atomicity và các ledger độc lập đúng**. Không có model checker cho mọi payload/đa thread; không kiểm cryptography, mất điện, fsync, race ở database, dữ liệu browser bị xóa, network vô hạn, chất lượng tài khoản provider, quy định áp dụng hoặc thao tác người vận hành. Các nhánh upgrade/privacy/fence là mô hình logic giản lược; số phép hoán vị gate không chứng minh implementation purge hay access-control thực tế.

## 12. Điều kiện chấp nhận contract và chuyển sang thử thật

Owner cần chọn/chấp nhận rõ: custody durable inbox và chi phí RecoveryJournal; nguồn current authority/privacy và GenerationAnchor; một writer; TTL 8h/ngưỡng escalation 24h ứng viên; giới hạn offline theo điều kiện hóa đơn; RPO/RTO theo từng loại dữ liệu; người xử lý ngoại lệ và retention. Khi chưa chấp nhận, đây là **baseline ứng viên có thể review**, không phải thay đổi cấu hình sản phẩm.

Kỹ thuật có thể dùng BS04-C1 để xây spike gồm local save, hai client tranh grant, receive/restart, staged downsync và restore gate; vận hành/kế toán/phụ trách dữ liệu phải cùng chạy runbook. Bằng chứng tối thiểu gồm build/schema/config, OS/browser/device, payload/receipt/IDs, thao tác gây lỗi, số dư trước/sau, lưu bền độc lập được kiểm, provider trace và người ký. [K01–K13](nguon-ky-thuat.md) chỉ hỗ trợ thiết kế phép thử, không thay bằng chứng.

Kết luận nhánh BS-04: **đã có lời giải cụ thể cho F01/F04 và mô hình phản ví dụ–bất biến tái lập; chưa đóng toàn bộ BS-04 hoặc sẵn sàng pilot**. Thiếu đầu vào thật không được điền thành “đạt”; có thể giữ phạm vi B ở chế độ đã kiểm chứng hoặc dừng cam kết mới khi điều kiện quyền/storage/hóa đơn chưa đáp ứng.
