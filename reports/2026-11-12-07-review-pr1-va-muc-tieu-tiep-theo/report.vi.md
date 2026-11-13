# R007 — Review PR #1 và mục tiêu nghiên cứu tiếp theo để đạt MVP

- Ngày review: **12/11/2026**, múi giờ Asia/Bangkok.
- Repository: **chung6a8m/research-sme-phan-phoi-hang-tieu-dung**.
- PR: [#1 — Phân tích khoảng trống và mục tiêu nghiên cứu để đạt MVP](https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/pull/1).
- **HEAD được review: f267819bfa6a1587cacd8ace58265b9c0db93b71**; base main: 2ce5ff38401fdc30774a6524d95014bd6bb45440. Kết luận về dòng tài liệu bên dưới gắn với HEAD này, trước commit bổ sung R007.
- Phạm vi: 13 file thay đổi của PR, trọng tâm R005/B005 và toàn bộ R006; đối chiếu yêu cầu/quyết định lịch sử khi cần.
- Loại kết quả: **review tài liệu, tái tính số liệu giả lập và đề xuất mục tiêu nghiên cứu**. Không phải kiểm thử sản phẩm, khảo sát NPP hoặc nghiệm thu pilot.
- Đề bài tiếp theo: [B007 — Kiểm chứng và chốt đặc tả MVP](../../briefs/2026-11-12-07-kiem-chung-va-chot-dac-ta-mvp.md). [Nguồn và bằng chứng review](sources.md).

## 1. Kết luận và quyết định sử dụng tài liệu

**PR #1 đã tạo được nền nghiên cứu có giá trị để chốt quyết định và chuẩn bị đặc tả. Chưa đủ làm bộ đặc tả cuối cùng để giao triển khai toàn bộ MVP, và chưa đủ điều kiện chạy pilot thật.** Đây cũng phù hợp với giới hạn R006 tự công bố; không phải phát hiện rằng tác giả đã giả vờ hoàn thành khảo sát hay pilot.

R005 xác định vấn đề; B005 giao mười mục tiêu; R006 đã chuyển phần lớn câu hỏi thành phương án, ví dụ số, contract và kế hoạch kiểm chứng. Bước tiếp theo nên là **một đợt khép kín quy tắc, kiểm chứng rủi ro và hợp nhất đặc tả**, với đầu ra và điều kiện kết thúc cụ thể. Không có căn cứ mở một vòng khảo sát thị trường tổng quan khác hoặc mở rộng danh sách module.

Review xác nhận bốn điểm cần sửa/làm rõ trước khi dùng R006 làm đặc tả: khôi phục quyền và yêu cầu dữ liệu sau restore; quà đã thu hồi trong chuỗi giao–trả–giao tiếp; phần dư giá vốn trả từng phần; và nghĩa vụ gửi lại lệnh đang chờ phụ thuộc. Những khoảng trống khác được đưa vào mục tiêu bổ sung, không biến mọi việc chưa làm thành lỗi của PR.

| Mức sẵn sàng | Đánh giá tại HEAD review |
|---|---|
| Lưu trữ kết quả nghiên cứu tài liệu | Có thể giữ như kết quả nghiên cứu có giới hạn, kèm ghi chú R007 |
| Khóa chính sách sản phẩm | Chưa: Q01–Q10 của R006 vẫn là đề nghị; cần quyết định có người chịu trách nhiệm |
| Giao triển khai lõi hàng–tiền–đồng bộ | Cần giải quyết findings và có quy tắc/ca nghiệm thu tương ứng |
| Pilot với giao dịch thật | Chưa: thiếu đơn vị, dữ liệu, thiết bị, sandbox, diễn tập và nghiệm thu |
| Chứng minh giá trị thương mại của MVP | Chưa: chỉ có phương pháp đo, chưa có kết quả dùng hoặc trả phí |

Đây là đánh giá sử dụng tài liệu, không phải thao tác phê duyệt/merge PR. Không gán phần trăm hoàn thành MVP khi repo chưa có sản phẩm và bằng chứng vận hành.

## 2. Những phần PR đã giải quyết và cần kế thừa

| Chủ đề | Kết quả đã có trong R006 | Phần thực sự còn phải làm |
|---|---|---|
| NC-01, phân khúc | Archetype NPP tự mua–bán, tiêu chí chọn và bộ hỏi/quan sát | Xác nhận một đơn vị phù hợp, chứng từ, khối lượng, vấn đề ưu tiên và baseline |
| NC-02, thuật ngữ | Phân biệt Subscriber/Tenant/đơn vị bán/Customer/Outlet; quan hệ tùy chọn; phân quyền | Đối chiếu với hồ sơ thực và Owner chốt; chuyển thành dữ liệu/màn hình/chứng từ nhất quán |
| NC-03, A/B | Ma trận sự kiện, tách hàng xe với hàng bán, trạng thái đơn/giao/thu/hóa đơn | Bảng chuyển trạng thái đầy đủ; ngoại lệ có cách xử lý; luồng viếng thăm không phát sinh đơn |
| NC-04, UoM/tồn/giá vốn | Phương pháp đề nghị, quy đổi snapshot, cách ly, phí mua/khóa kỳ; số liệu mẫu | Phần dư giá vốn, các chu kỳ tiếp theo, dữ liệu lô/quy cách và xác nhận kế toán |
| NC-05, giá/ưu đãi | Tập rule hữu hạn, snapshot, giao từng phần và xử lý trả quà | Chuỗi giao–trả–giao tiếp, quà ròng và ngoại lệ đã được duyệt |
| NC-06, tiền/nợ | Ba sổ, thu thừa, phân bổ, hoàn, nộp quỹ không giảm nợ lần hai | Điều khoản/hạn trả, ảnh hưởng tới tín dụng, bộ số liệu sau thuế và các lệnh kết hợp bán–thu |
| NC-07, PWA | Quyền hữu hạn, chống lặp/cạnh tranh, writer, giữ sự kiện đã xảy ra | Contract receipt hoàn chỉnh; tải xuống đồng bộ; kiểm chứng thiết bị thật |
| NC-08, hóa đơn | Ma trận pháp lý, phân biệt lập/ký/gửi, trạng thái unknown, INV-01–09 | Chọn hồ sơ áp dụng/provider; kiểm chứng cả chứng từ vận chuyển; tính/đối chiếu tiền sau thuế |
| NC-09, vận hành | Cách ly toàn chuỗi, migration, phục hồi sau ACK, mô hình chi phí | Quyền/xóa/hạn chế sau restore, nguồn đời phục hồi, diễn tập và chi phí thực |
| NC-10, sử dụng/giá trị | Import/cutover, sáu tác vụ UX, KPI có mẫu số | File thật, prototype, ngưỡng theo baseline, dữ liệu sử dụng và chi phí hỗ trợ |

Căn cứ: [bảng hoàn thành R006](../2026-11-11-06-ket-qua-nghien-cuu-mvp/report.vi.md), [nghiệp vụ](../2026-11-11-06-ket-qua-nghien-cuu-mvp/nghiep-vu-va-so-lieu.vi.md), [kỹ thuật](../2026-11-11-06-ket-qua-nghien-cuu-mvp/pwa-va-van-hanh-tenant.vi.md), [pilot](../2026-11-11-06-ket-qua-nghien-cuu-mvp/pilot-va-tich-hop.vi.md).

Tiếp tục giữ các lựa chọn đã có: **A+B, PWA, quy tắc nhân sự xe máy/xe tải, mỗi tenant một DB, hóa đơn điện tử trong phạm vi**. Không suy ra Owner đã chọn phương pháp giá vốn, một pháp nhân/tenant, chuyến hỗn hợp, một writer/chuyến hoặc nhà cung cấp tích hợp.

## 3. Findings trên tài liệu tại HEAD review

P1/P2 dưới đây là ưu tiên sửa **tài liệu/contract**: P1 cần khép trước khi chấp nhận thiết kế liên quan; P2 cần làm rõ trước khi khóa quy tắc và ca nghiệm thu. Repo không có mã ứng dụng để kết luận có lỗ hổng hay lỗi chạy thực tế.

### F01 — P1: Restore chưa đưa quyền hiện hành và yêu cầu xóa/hạn chế vào điều kiện mở lại tenant

**Vị trí:** [R006-T dòng 190–195][f01-tech]; đối chiếu [R006-L dòng 132–148][f01-legal] và R006-T dòng 159.

Phụ lục tuân thủ yêu cầu áp lại yêu cầu xóa/hạn chế và quyền mới sau restore. Runbook kỹ thuật hiện đối chiếu hàng–nợ–tiền, receipt/outbox/file, tác động ngoài và tăng recoveryEpoch, nhưng chưa chỉ rõ nguồn quyền/yêu cầu dữ liệu hiện hành hoặc bước áp lại trước khi mở tenant.

**Tình huống có điều kiện:** backup t0 còn quyền nhân viên U; t1 thu hồi membership U và xử lý hợp lệ một yêu cầu hạn chế/xóa; t2 restore về t0. Nếu membership và trạng thái đó nằm trong DB bị lùi, đăng nhập mới của U có thể lại vượt qua kiểm tra membership. Đổi recoveryEpoch chỉ vô hiệu đời quyền cũ; nó không tự sửa quyền vừa phục hồi.

**Cần bổ sung:** nguồn quyền và nhật ký yêu cầu dữ liệu độc lập với phạm vi rollback, hoặc cách đối chiếu có thẩm quyền tương đương; áp lại trước mở truy cập. Kiểm tra đăng nhập mới, quyền hỗ trợ, file/export/cache và gói offline. Chỉ áp lại yêu cầu hợp lệ, có xét nghĩa vụ giữ chứng từ; không đề nghị xóa mù dữ liệu kế toán.

**Tiêu chí kiểm chứng:** restore sau thu hồi quyền và hạn chế/xóa hợp lệ không khôi phục quyền/dữ liệu cũ; hóa đơn ngoài DB vẫn chỉ có một; tenant còn lại không đổi.

### F02 — P2: Công thức quà giao tiếp chưa tính quà đã được khách trả lại

**Vị trí:** [R006-B dòng 191–202][f02].

Quyền hưởng đã tính theo lượng mua giao ròng, nhưng vế trừ dùng quà đã giao mà chưa định nghĩa trừ quà đã thu hồi và ảnh hưởng của ngoại lệ được duyệt.

Ví dụ đơn A còn phần chưa giao, áp dụng mua 10 tặng 1; hàng trả đã được chấp nhận thương mại và nhận lại, không phải chỉ giữ hộ chờ xét:

| Sự kiện | Mua ròng khách giữ | Quà khách giữ |
|---|---:|---:|
| Giao 20 mua + 2 quà | 20 | 2 |
| Chấp nhận và nhận lại 11 mua + 2 quà | 9 | 0 |
| Giao tiếp 11 hàng mua | 20 | 0 |

Quyền hưởng sau bước cuối là 2 quà. Nếu trừ 2 quà từng giao, công thức cho 0; nếu trừ quà ròng khách giữ thì cần giao 2. Đây là phản ví dụ cho cách đọc trực tiếp công thức, chưa phải kết quả engine.

**Cần bổ sung:** đại lượng mua ròng; quà ròng; quà cần giao thêm; quà cần thu hồi; quà đã thu hồi; phần miễn thu hồi đã được duyệt. Phần âm là nghĩa vụ xử lý riêng, không phải số lượng quà giao âm. Giữ chính sách không tự biến quà thành nợ mới.

**Tiêu chí kiểm chứng:** quà đã trả không bị trừ lần nữa, ngoại lệ đã xử lý không bị thu hồi lặp, kết quả giải thích được từ cả lịch sử giao–trả.

### F03 — P2: Giá vốn trả từng phần chưa có quy tắc phân bổ phần dư

**Vị trí:** [R006-B dòng 152–168][f03]. Dòng 202 có quy tắc phần dư cho tiền bán khi trả, nhưng chưa phát biểu tương ứng cho giá vốn.

Tồn 3 đơn vị trị giá 10.000 đồng; xuất 2 theo ROUND_HALF_UP tạo giá vốn 6.667, còn 3.333. Nếu chia giá vốn nguồn 6.667/2 rồi làm tròn riêng hai lần trả một đơn vị đã được chấp nhận, mỗi lần 3.334, tổng nhập trả 6.668. Đủ 3 đơn vị đã quay lại nhưng giá trị thành 10.001. Nếu lấy bình quân chưa làm tròn rồi làm tròn riêng có thể thiếu 1 đồng. Decimal không tự giải quyết lựa chọn phân bổ.

**Cần bổ sung:** lượng và tổng giá vốn nguồn; lượng/giá trị đã hoàn; phần còn được hoàn; cách phân bổ tích lũy và phần dư của lần trả cuối. Một ứng viên cho nguồn xuất q đơn vị, giá trị C: giá trị hoàn lũy kế tới lượng k là ROUND_HALF_UP(C × k/q); mỗi lần nhận phần chênh với lượng đã hoàn trước đó, cùng kiểm soát không vượt nguồn. Đây là phương án để kế toán/Owner xem xét, chưa được phê duyệt.

Với ví dụ trên, có thể hoàn 3.334 rồi 3.333, tổng đúng 6.667. Nếu nguồn đã có điều chỉnh giá vốn, phải xác định tập giá trị nguồn áp dụng và chứng từ điều chỉnh tương ứng.

**Tiêu chí kiểm chứng:** hoàn đủ lượng trả lại đúng tổng giá vốn được phép hoàn; không tạo/mất giá trị vì chia nhỏ chứng từ. Không yêu cầu các chuỗi xuất hàng có diễn biến nhập khác nhau phải có giá vốn từng lần giống nhau.

### F04 — P2: Phản hồi chờ phụ thuộc chưa xác định rõ ai giữ trách nhiệm gửi lại

**Vị trí:** [R006-T dòng 100–123][f04].

Contract cho phép lưu chờ phụ thuộc hoặc chỉ trả mã chờ. Client được yêu cầu lưu receipt trước khi đánh dấu hết việc cần gửi, nhưng chưa có bảng quy định receipt nào chứng minh server đã lưu bền toàn bộ payload.

**Tình huống:** lệnh C tới trước P; server trả awaiting_dependency nhưng không lưu C; client dừng retry sau khi lưu receipt. Khi P tới, server không có C để tiếp tục. Journal có thể còn, nên chưa thể khẳng định mất vĩnh viễn; tuy vậy C có thể rơi khỏi lịch xử lý cho đến khi đối soát.

**Cần chọn rõ một trong hai:** chờ phụ thuộc đã tiếp nhận bền và server chịu trách nhiệm chạy lại; hoặc chưa tiếp nhận bền và client tiếp tục retry. Tách hoàn thành truyền dữ liệu khỏi hoàn thành nghiệp vụ: recorded_exception có thể đã nhận bền nhưng vẫn phải hiện là chưa giải quyết.

**Tiêu chí kiểm chứng:** C tới trước P, server khởi động lại, client mở lại; cuối cùng C được xử lý đúng một lần hoặc có ngoại lệ bền truy được, không bị bỏ khỏi trách nhiệm.

### Ghi chú biên tập PR

Mô tả PR tại thời điểm review còn giới thiệu đợt R005/B005 và bốn file, trong khi HEAD đã có R006 và 13 file thay đổi. Nên cập nhật khi bàn giao PR để người review biết phạm vi thực; đây là vấn đề mục lục/mô tả, không phải lỗi nghiệp vụ. R007 lưu findings riêng, giữ R001–R006 như hồ sơ lịch sử theo AGENTS.md.

## 4. Khoảng trống còn lại có tác động đến MVP

### 4.1. Chưa có một bản đặc tả hiện hành có thể giao cho người triển khai

Bảng Q01–Q10 đã nêu đúng các quyết định phải ra. Phần thiếu là một nguồn hiện hành nối **quyết định → phạm vi → dữ liệu → quy tắc → tác vụ → bằng chứng nghiệm thu**. Nếu chỉ đưa toàn bộ R001–R006 cho người triển khai, họ vẫn phải tự chọn giữa đề xuất mới, bản lịch sử và phần chưa duyệt.

Cần ma trận Must/giới hạn/xử lý thủ công/để sau theo các công việc thực tế. Giới hạn sản phẩm phải nêu hành vi: ví dụ chỉ nhận yêu cầu trả offline rồi duyệt online, thay vì chỉ ghi có chức năng trả hàng.

### 4.2. Chu kỳ tiền/nợ vẫn cần lựa chọn có số liệu đầy đủ

R006 đã công bố fixture trước lớp thuế. Không coi đây là lỗi che giấu; nhưng chưa thể dùng fixture ấy làm nghiệm thu hóa đơn hoặc khoản phải thu thật.

Cần thêm giá có/chưa gồm thuế, các nhóm xử lý thuế đã được kế toán xác nhận, chiết khấu toàn đơn phân về dòng, trả sau thu và điều chỉnh hóa đơn; mỗi số truy được từ UI sang sổ và dữ liệu provider. Không tự chọn thuế suất cho SKU chưa có hồ sơ.

Hạn trả đang được giả định ở báo cáo tuổi nợ và phân bổ theo hạn đến trước, nhưng chưa có quy tắc tạo due_date cho khoản mới. Đơn giao ngày 1 và ngày 8 với điều khoản 7 ngày có thể ra hai hạn 8/15 hoặc hạn chung theo hợp đồng; cần chọn rõ, snapshot điều khoản, không thay khoản cũ khi sửa Customer.

### 4.3. Một ngày mẫu chưa chứng minh chu kỳ vận hành tiếp theo

R006 có E01 nhập hàng và E16 điều chỉnh; không thiếu hoàn toàn nghiệp vụ kho. Cần dùng ví dụ nhiều ngày để nối nhập bổ sung, số dư xe qua ngày, kiểm kê trong lúc còn quyền offline, trả từ chuyến đã đóng, phí mua biết muộn và kỳ khóa.

Phải xác định ranh giới DMS–kế toán: dữ liệu nào do hệ thống nào quyết định; xuất/nhập bằng gì; điều chỉnh truyền theo định danh nào; ai đối chiếu chênh lệch. Điều này không đòi xây phân hệ mua hàng/phải trả hay ERP đầy đủ. Trả nhà cung cấp hoặc bao bì luân chuyển chỉ vào phạm vi nếu chứng từ pilot chứng minh là điều kiện vận hành.

### 4.4. Vòng công việc nhân viên thị trường còn mỏng hơn lõi đơn/chuyến

[B002](../../briefs/2026-11-11-02-nghiep-vu-mvp-pwa.md) đã bao gồm điểm bán được phân công, viếng thăm, tình trạng hàng và yêu cầu trả. R006 giữ thuật ngữ và quyền nhưng sáu tác vụ UX tập trung vào bán/giao/tiền.

Cần có đường đi độc lập: mở danh sách điểm bán → đến điểm không phát sinh đơn → ghi lý do/tình trạng hàng/yêu cầu trả → theo dõi kết quả xử lý. Dữ liệu quan sát tại điểm không được biến thành tồn sở hữu NPP. Phạm vi vị trí/ảnh chỉ theo nhu cầu có căn cứ; không suy thành yêu cầu GPS nền.

### 4.5. Hóa đơn cần chứng minh luồng đủ từ lúc xe nhận hàng

INV-01–09 bao phủ tốt phát hành, lỗi, trả và restore. Cần bổ sung đường chứng từ khi cấp hàng lên xe để bán lưu động, vì R006-L đã nêu phiếu xuất kho kiêm vận chuyển nội bộ ở dòng 35 nhưng bảng sandbox chưa có ca riêng. NĐ254 Điều 6(3)(đ) và Điều 8(7) là căn cứ cần đối chiếu cho trường hợp này; bản ký đã được đọc tại các trang liên quan [W01](sources.md#w01).

Có thể chọn provider hoặc hệ thống ngoài xử lý chứng từ ấy, nhưng phải có định danh, người lập, thời điểm, cách lấy bản hợp lệ và đối chiếu lượng. Không tự mở thêm nhiều adapter trước khi biết pilot đang dùng gì.

### 4.6. Đồng bộ xuống và các quyết định vận hành chưa thành hợp đồng có thể thử

R006 đã có envelope, cursor và version, nhưng còn cần quy tắc tải snapshot/delta, xóa bằng tombstone, đổi cursor và kích hoạt gói quyền. Ngắt mạng giữa tải giá/UoM/quyền không được tạo một gói phiên bản trộn được phép bán; resync không được xóa journal chưa ACK.

Một ID phiếu thu riêng không nhất thiết là command riêng. Cần viết ca compound sale–receipt: bán 100, thu 100, hạn mức chịu bằng 0; hoặc bán 100, thu 60, tiêu quyền chịu 40. Đây là câu cần đặc tả, chưa có bằng chứng rằng R006 chắc chắn xử lý sai.

### 4.7. Bằng chứng thực địa, chi phí và giá trị vẫn là đầu việc mở đã biết

R006 thẳng thắn ghi chưa tuyển pilot, chưa có thiết bị/sandbox, chưa có báo giá hay baseline. Những việc này phải **thực hiện tiếp**, không đổi tên thành phát hiện mới.

Cần chọn một hồ sơ pilot cụ thể, có người chốt kho/nợ/hóa đơn; đo khối lượng/đỉnh tải và độ mất mạng; nhận dữ liệu được phép; có người làm đối soát và hỗ trợ. Chi phí phải tính cả nhập dữ liệu, xử lý ngoại lệ và hỗ trợ, không chỉ app/database. Chưa đủ dữ liệu để đưa lịch hay giá SaaS đáng tin cậy.

### 4.8. Hồ sơ tuân thủ pilot cần theo dõi cả văn bản sửa đổi và ngày áp dụng

Đợt review bổ sung Nghị quyết 22/2026/NQ-CP và Nghị định 392/2026/NĐ-CP vào chuỗi nguồn về thủ tục bảo vệ dữ liệu cá nhân. NĐ392 ban hành ngày 20/10/2026, có hiệu lực **15/11/2026**, nên chưa được coi là quy định đang có hiệu lực tại ngày review 12/11/2026. Các phần được kiểm tra và giới hạn được ghi tại [W02](sources.md#w02), [W03](sources.md#w03).

Đây là yêu cầu cập nhật nguồn/thủ tục trước pilot, không phải kết luận rằng R006 đã áp sai một thời hạn cụ thể. Với hoạt động và hồ sơ thực tế, lập bảng ngày xử lý/nộp → quy định áp dụng → đầu mối/kênh nộp → thành phần/thời hạn → điều khoản chuyển tiếp. Không biến việc đọc văn bản thành kết luận SaaS đã hoàn tất nghĩa vụ hoặc cần một giấy phép chưa được xác định là áp dụng.

## 5. Sáu mục tiêu bổ sung được đề nghị

Mã BS dưới đây là gói làm việc nối vào NC-01–NC-10, không phải sáu module mới. Tất cả mới là **đề xuất chưa được Owner phê duyệt**.

### BS-01 — Khóa phạm vi và đặc tả hiện hành của MVP

**Nối NC-01/02/03/10. Mục đích:** người triển khai không phải tự quyết định nghiệp vụ từ nhiều bản nghiên cứu.

**Đầu ra:** danh mục quyết định dùng Q01–Q10; glossary/mô hình thống nhất; bảng chức năng có giới hạn; ma trận vai trò; sơ đồ tác vụ A/B và viếng thăm không đơn; truy vết từ yêu cầu tới ca nghiệm thu. Nêu rõ bên nợ, nơi nhận, người giữ hàng/tiền và chủ thể lập hóa đơn.

**Cách làm:** hợp nhất tài liệu trước; sau đó walkthrough với đơn vị pilot và Owner. Mỗi quyết định ghi phương án, bằng chứng, người quyết định, trạng thái và ảnh hưởng nếu trì hoãn.

**Đủ khi:** không còn quyết định ngầm làm thay đổi hàng/tiền/schema ở phần chuẩn bị xây; từng yêu cầu đầu vào có triển khai, giới hạn hoặc quyết định hoãn rõ. Thiếu bằng chứng thì ghi giả định có phạm vi, không ghi thành đã xác nhận.

### BS-02 — Hoàn thiện bộ quy tắc và số dư nghiệm thu xuyên suốt

**Nối NC-03/04/05/06/08. Mục đích:** một lịch sử giao dịch cho một kết quả tính được và giải thích được.

**Đầu ra:** bộ dữ liệu nhiều SKU/UoM, giao nhiều lần, trả/quà, giá vốn số lẻ, thuế theo hồ sơ đã chọn, hạn trả, thu/hoàn và chuyển ngày; bảng đầu vào/kết quả sau từng sự kiện; phép tính tái lập.

**Các ca bắt buộc bổ sung:** F02/F03; tiền có dư phân bổ và hoàn không trùng; điều khoản đổi sau phát sinh; bán thu ngay không cần hạn mức chịu theo chính sách đã chọn; phí mua muộn và trả từ kỳ/chuyến cũ; số tiền UI/sổ/provider đối chiếu được.

**Đủ khi:** người phụ trách kế toán và người triển khai tính độc lập ra cùng số lượng, giá vốn, tiền/thuế, khoản phải thu/có dư và tuổi nợ. Đối chiếu ở từng bước, không chỉ làm cho tổng cuối ngày cân.

### BS-03 — Chứng minh B và hóa đơn/chứng từ vận chuyển vận hành được trên tuyến

**Nối NC-07/08. Mục đích:** quyết định phạm vi B có thể đưa vào pilot trong điều kiện mạng thật.

**Đầu ra:** hồ sơ người bán/loại hóa đơn; một phương án provider; timeline giao–lập–ký–gửi; contract lookup/retry; chứng từ cấp xe; log INV-01–09 và ca bổ sung cho vận chuyển.

**Cách làm:** dùng dữ liệu giả lập trước, tài khoản được cấp quyền và thiết bị thuộc tập hỗ trợ; gây lỗi ở các thời điểm cụ thể. Xác minh kết quả theo từng hóa đơn/chứng từ, gồm trạng thái chưa rõ và dữ liệu xuất hiện chậm. Ghi rõ giới hạn online/offline được chứng minh.

**Đủ khi:** có một phương án thực hiện được trong mô hình pilot, không lập trùng hoặc hiểu nhầm nháp là hóa đơn; đường mất mạng trước/sau giao có trách nhiệm xử lý. Khi chưa chứng minh được fully offline, giới hạn B theo kết quả thật; không loại B khỏi mục tiêu đã chọn.

### BS-04 — Chốt và thử contract dữ liệu offline, ACK và phục hồi

**Nối NC-07/09, phối hợp NC-06. Mục đích:** không bỏ sót trách nhiệm xử lý và không phục hồi sai quyền/sự kiện.

**Đầu ra:** bảng receipt và retry giải F04; đơn vị transaction bán–giao–thu; bootstrap/delta và gói quyền; runbook restore hợp nhất F01; nguồn recoveryEpoch không bị tái dùng khi restore backup cũ; bằng chứng thiết bị/hai tenant; bảng nghĩa vụ dữ liệu áp dụng theo ngày pilot và bên chịu trách nhiệm.

**Đủ khi:** qua các ca đảo phụ thuộc, mất ACK, hai lệnh tranh quyền, tải gói dở, nâng app khi có queue, restore sau hóa đơn và sau thu hồi quyền. Ghi rõ dữ liệu chỉ ở máy nào vẫn không thể khôi phục. Người vận hành thực hiện runbook và đo RPO/RTO theo phạm vi đã thống nhất; không chỉ review thiết kế.

### BS-05 — Khép chu kỳ kho, ranh giới kế toán và xử lý ngoại lệ

**Nối NC-03/04/06/08/09/10. Mục đích:** MVP tiếp tục vận hành sau ngày đầu mà không phải duy trì hai sổ phát sinh không kiểm soát.

**Đầu ra:** chuỗi ít nhất hai ngày minh họa và một ca sau khóa kỳ; quy tắc kiểm kê khi chuyến mở; nhận hàng/điều chỉnh có trách nhiệm; bảng nguồn dữ liệu có thẩm quyền DMS–kế toán–provider; một mẫu xuất/nhập tối thiểu có định danh và cách sửa sai.

**Cách làm:** đi theo chứng từ của pilot, xác định phần xử lý trong MVP và phần chuyển ngoài hệ thống. Mỗi ngoại lệ có người nhận, dữ liệu cần xem, hành động hợp lệ và điều kiện đóng. Thử tác vụ của kho/kế toán/người giao, kể cả thiếu hàng/tiền và không tìm được nguồn trả.

**Đủ khi:** lượng/giá trị/nợ/tiền không sinh lại khi chuyển ngày, import lại hoặc điều chỉnh; báo cáo truy về chứng từ; có đường sửa sai thực hiện được. Không mặc nhiên thêm phải trả nhà cung cấp, kế toán tổng hợp hay workflow nhiều cấp.

### BS-06 — Xác nhận pilot, khả năng sử dụng và chi phí phục vụ

**Hoàn tất phần bằng chứng mở của NC-01/10 và chi phí NC-09. Mục đích:** biết MVP có đáng triển khai và có thể phục vụ được hay không.

**Trước xây/pilot:** hồ sơ ứng viên đủ A/B; chứng từ/file mở đầu được phép; danh sách thiết bị; baseline theo tác vụ; thử prototype có cả viếng thăm không đơn; kế hoạch cutover, đào tạo, hỗ trợ và đo. Cỡ mẫu cũ 3–5 nơi khám phá/2–3 pilot là đề xuất, không điều kiện số lượng bắt buộc; một nơi đủ A/B có thể kiểm chứng phạm vi hẹp với giới hạn rõ.

**Trong/sau pilot:** số chuyến/đơn đủ điều kiện, tỷ lệ hoàn thành, lỗi/chênh lệch, thời gian đóng chuyến, phút hỗ trợ, quyết định tiếp tục/trả phí của người có quyền mua. Tách sự hài lòng khỏi cam kết trả phí.

**Đủ khi:** trước pilot có dữ liệu và ngưỡng đã thống nhất; sau pilot có kết quả n/N, chi phí phục vụ và quyết định kinh doanh. Không ghi hoàn thành cả mục chỉ vì đã có form khảo sát hoặc công thức KPI.

## 6. Các tình huống mới để nối vào bộ E2E hiện có

Đây là **đề nghị ca nghiệm thu**, không phải kết quả đã chạy trên ứng dụng.

| Mã tiếp nối | Tình huống | Kết quả cần xác định/kiểm chứng |
|---|---|---|
| E2E-13 | Giao 20+2 quà → chấp nhận/nhận trả 11+2 → giao tiếp 11 | Quyền quà theo lượng mua và quà ròng; không thiếu quà hoặc thu hồi lặp |
| E2E-14 | Xuất 2 từ tồn 3/10.000; trả từng đơn vị | Tổng giá vốn hoàn đúng 6.667; tổng tồn trở lại 10.000 |
| E2E-15 | Giao hai lần, điều khoản 7 ngày, đổi điều khoản khách sau đó | Hai khoản/hạn trả theo thỏa thuận đã chọn; lịch sử không bị đổi |
| E2E-16 | B bán/thu 100/100 và 100/60; retry/đảo phụ thuộc | Quyền chịu tiêu 0 hoặc 40 theo giao dịch đã chấp nhận; thu chỉ một lần |
| E2E-17 | Lệnh con tới trước cha, server restart, client mở lại | Có chủ thể chịu retry/tiếp tục; một kết quả hoặc ngoại lệ bền |
| E2E-18 | Ngắt mạng lúc tải snapshot/giá/UoM/quyền | Không kích hoạt phiên bản trộn; resync giữ lệnh chưa ACK |
| E2E-19 | Restore sau thu hồi quyền, hạn chế/xóa hợp lệ và phát hành hóa đơn | Áp quyền/yêu cầu mới, không phát hành lại; epoch không lặp |
| E2E-20 | Cấp xe bán lưu động, giao từng phần, hàng dư về | Có chứng từ vận chuyển phù hợp và đường đối chiếu, không coi cấp xe là doanh thu |
| E2E-21 | Ngày 2 nhập thêm/kiểm kê khi chuyến mở; trả từ chuyến/kỳ cũ | Không giải phóng quyền chưa biết; điều chỉnh có nguồn và kỳ phù hợp |
| E2E-22 | Viếng thăm không đơn, ghi quan sát hàng và yêu cầu trả | Có kết quả tác vụ riêng; không ghi vào tồn sở hữu NPP |

Hai phản ví dụ số học E2E-13/14 đã được tính độc lập trong review. Điều đó chỉ xác nhận phép tính phân tích; không nâng trạng thái các ca ứng dụng thành đã đạt.

## 7. Trình tự và điều kiện dừng nghiên cứu

Đề nghị ưu tiên **BS-01 + BS-02**, đồng thời thu đầu vào cho **BS-03** vì kết quả hóa đơn/mạng có thể đổi giới hạn vận hành B. **BS-04** đi cùng các chính sách đã chọn, **BS-05** nối sang vận hành thực tế. **BS-06** bắt đầu ngay từ tuyển/đo baseline và chỉ kết thúc phần giá trị sau pilot.

| Chuyển bước | Bằng chứng đủ để chuyển |
|---|---|
| Từ nghiên cứu sang phát triển lõi | Quyết định ảnh hưởng dữ liệu/tiền/tồn có chủ; findings có cách giải; đặc tả/fixture nhất quán; giới hạn đã công bố |
| Từ bản phát triển sang pilot | Thiết bị/provider/chứng từ vận chuyển đã kiểm chứng; import/đối chiếu; quyền/restore; người xử lý ngoại lệ; quy mô và tiêu chí đã thống nhất |
| Từ pilot sang kết luận MVP có giá trị | Phạm vi A/B thực sự được dùng, số dư giải thích được, kết quả tác vụ/KPI và chi phí có mẫu số, người mua có quyết định rõ |

Có thể triển khai một phần độc lập khi chính sách và ca nghiệm thu của phần đó đã đủ. Không cần đợi mọi cuộc phỏng vấn mới làm mọi việc; cũng không dùng một spike thành công để phê duyệt toàn bộ chính sách.

**Điều kiện dừng một nhánh nghiên cứu:** đã có câu trả lời cho quyết định cụ thể, ví dụ có kết quả kỳ vọng, giới hạn hỗ trợ và người chấp nhận. Nếu câu trả lời phụ thuộc chứng từ/thiết bị/provider chưa có, ghi rõ phụ thuộc và phần việc có thể làm trước; không tiếp tục đọc nguồn chung để thay bằng chứng còn thiếu.

## 8. Hướng đề nghị Owner xem xét sau review

Giữ các quyết định đầu vào, xem Q01–Q10 của R006 như danh sách cần chốt. Ưu tiên quyết định phạm vi pilot, cách tính giá vốn và tiền, giới hạn B theo khả năng hóa đơn, một writer hay mô hình khác đã kiểm chứng, và ranh giới công việc kế toán.

Đề xuất tiếp tục bằng B007 để tạo **bản đặc tả MVP hiện hành + bộ số liệu/ca nghiệm thu + kế hoạch kiểm chứng có đầu vào rõ**. Chưa chuyển B007 thành active roadmap phát triển hoặc ghi các giả định thành quyết định Owner.

Giới hạn review: đối chiếu tài liệu tại commit nêu trên; kiểm tra số học; kiểm tra chọn lọc nguồn chính thức. Không khẳng định đã kiểm toán toàn bộ pháp lý, có tài khoản sandbox, có dữ liệu NPP, đã chạy ứng dụng hay đã có người chấp thuận pilot.

[f01-tech]: https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/blob/f267819bfa6a1587cacd8ace58265b9c0db93b71/reports/2026-11-11-06-ket-qua-nghien-cuu-mvp/pwa-va-van-hanh-tenant.vi.md#L190-L195
[f01-legal]: https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/blob/f267819bfa6a1587cacd8ace58265b9c0db93b71/reports/2026-11-11-06-ket-qua-nghien-cuu-mvp/hoa-don-va-tuan-thu.vi.md#L132-L148
[f02]: https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/blob/f267819bfa6a1587cacd8ace58265b9c0db93b71/reports/2026-11-11-06-ket-qua-nghien-cuu-mvp/nghiep-vu-va-so-lieu.vi.md#L191-L202
[f03]: https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/blob/f267819bfa6a1587cacd8ace58265b9c0db93b71/reports/2026-11-11-06-ket-qua-nghien-cuu-mvp/nghiep-vu-va-so-lieu.vi.md#L152-L168
[f04]: https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/blob/f267819bfa6a1587cacd8ace58265b9c0db93b71/reports/2026-11-11-06-ket-qua-nghien-cuu-mvp/pwa-va-van-hanh-tenant.vi.md#L100-L123
