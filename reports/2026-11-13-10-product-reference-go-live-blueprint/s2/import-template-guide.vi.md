# R010-S2 — Hướng dẫn template CSV/Excel và import dry-run

**Status:** \`TEMPLATE_IMPLEMENTED_SYNTHETIC_ONLY\`; xem [S2 README](README.md), [Data Dictionary](data-dictionary.json), [S1 Tenant Profile](../tenant-profile-schema.vi.md) và [R009-G](../../2026-11-13-09-mvp-specification-baseline/glossary-and-data-contracts.vi.md). Dữ liệu và mã trong ví dụ là giả lập, không phải chứng từ hoặc hồ sơ NPP-01.

## 1. Danh mục nhập và thứ tự đề xuất

| Mẫu | Nội dung | Thứ tự nhập | Cần đối soát/chứng minh |
|---|---|---:|---|
| T01 | Tenant/seller profile | 1 | Bên bán hợp pháp, hồ sơ thuế/provider; không suy từ Subscriber |
| T02 | Customer chịu nợ | 2 | Mã ổn định, trạng thái, terms, hạn mức; Customer có thể không Outlet |
| T04 | SKU và quy đổi UoM | 3 | Quy đổi >0, base unit/step, lô/hạn dùng theo SKU |
| T03 | Outlet/địa chỉ mẫu | 4 | Ownership Customer theo hiệu lực; ShipTo sẽ snapshot trên chứng từ |
| T05 | Kho/xe/lô, số dư và trị giá | 5 | StockLocation, lot/expiry, quarantine, writer độc quyền; nguồn kiểm kê |
| T06 | Giá và chương trình | 6 | Quy tắc hữu hạn, effective dates, snapshot, đối chiếu tax profile riêng |
| T07 | Opening AR từng giao | 7 | Open item, due date, nguồn delivery/đã thu; không replay lịch sử |
| T08 | CustomerCredit đầu kỳ | 8 | Receipt đã xác minh và credit source, không bù AR âm |
| T09 | Custody nhân viên đầu kỳ | 9 | Ai giữ tiền, quỹ đã nhận bao nhiêu, cutoff và ký nhận |
| T10 | Advance đầu kỳ | 10 | Issued−ApprovedExpense−CashierAcceptedReturn=Outstanding≥0 |
| T11 | Nhân sự/xe/chuyến/grant | 11 | Một writer/trip, AReservation/BQuota riêng, không tự cấp quyền lái xe |
| T12 | Cutover/thiết bị/ngoại hiệu ứng | 12 | Legacy writer paths, pending journal, invoice/provider unknown |
| T13 | Accounting/provider adapter | 13 | MappingVersion, lookup/receipt/posted/reconciled thật — mock không thay đủ điều kiện |
| T14 | Trạng thái AC/EV/case | 14 | Ban đầu \`NO_GO/NOT_RUN\`; chỉ thay qua evidence workflow độc lập |

Các file CSV **blank** trong [templates/blank/](templates/blank/) chỉ chứa header. Hàng ví dụ đọc tại [examples.json](examples.json) hoặc chạy \`generate\` để có CSV ví dụ; không copy vào tenant production. Workbook Excel có thể sinh từ [s2-create-xlsx.py](s2-create-xlsx.py), là biểu mẫu để nhập chứ không phải kết quả validated.

## 2. Quy tắc định dạng và định danh

- CSV: UTF-8/LF, header đúng thứ tự từ [Data Dictionary](data-dictionary.json). Bộ dry-run nhận field quote chuẩn CSV \`"a,b"\` và dấu nháy kép escaped; loại bỏ BOM nếu có nhưng không tự sửa dữ liệu.
- Mã ID: lưu **text** để không mất số 0 đầu; không cho formula injection \`=\`, \`+\`, \`@\` hay tab khi nhập từ spreadsheet.
- Tiền: nguyên đồng VND, số nguyên không âm, không tự làm tròn float. Số lượng \`qtyBase\` dùng decimal theo base UoM; đơn vị quy đổi và unitStep phải hợp lệ.
- Ngày: ISO \`YYYY-MM-DD\` cho business date theo timezone seller; phân biệt ngày tạo/sự kiện, ngày post và \`occurredAtClaim\` như R009. Đừng dùng thời gian máy làm căn cứ pháp lý duy nhất.
- Bắt buộc mọi dòng có \`tenantCode, schemaVersion, sourceSystem, sourceRecordId, sourceHash, importBatchId\` để truy nguồn/cutover. \`schemaVersion=s2-v1\` là **schema giả lập/thiết kế**, không là schema production.
- \`sourceHash\`: SHA-256 từ các cột nghiệp vụ theo thứ tự dictionary rồi nối \`tenantCode|schemaVersion|sourceSystem|sourceRecordId|importBatchId\`. Dùng chuẩn UTF-8 và canonicalization version có ADR trước import thật. **Không bịa hash hoặc bỏ lỗi để qua validation**.
- Cùng \`sourceRecordId\` khác hash: conflict/chặn; cùng ID/hash trong cùng batch cũng cần xử lý duplicate có chủ, không tạo effect mới. Danh tính thuộc namespace tenant+sourceSystem+recordType(Txx); T05 còn có khóa dòng theo sourceDocumentId+sourceLineId.

## 3. Quy trình vận hành nhập liệu đề nghị

1. NPP cung cấp danh mục/số dư có quyền sử dụng, ghi hệ thống nguồn, cutoff và owner. Kiểm dữ liệu cá nhân theo quyền và retention trước khi chia sẻ.
2. Map mã nguồn sang Customer/Outlet/SKU/UoM/location/lot, công nợ từng open item, custody/advance **từng người**. Không dùng aggregate tổng để lấp dòng bị thiếu nguồn.
3. Chuẩn bị CSV theo 14 headers. Không đưa file có customerName/số điện thoại/địa chỉ thực vào repo nghiên cứu hoặc fixture công khai.
4. Chạy \`node s2-import-dry-run.mjs <csv-folder> --report /abs/path/report.json\`; công cụ chỉ đọc/kiểm kỹ thuật, **canPost=false** và luôn liệt kê blocker Go-Live.
5. Sửa các lỗi \`HEADER_MISMATCH\`, \`REQUIRED_META\`, \`SOURCE_HASH\`, \`FK_ORPHAN\`, \`DUPLICATE_BUSINESS_KEY\`, \`AR_BALANCE\`, \`ADVANCE_BALANCE\`, \`CUSTODY_BALANCE\`, v.v. Mọi sửa nguồn phải có người chịu trách nhiệm và lý do.
6. Đối chiếu nhiều bên mở kho–xe/lô/quarantine, A hold/B quota, AR/CustomerCredit, custody, advance, external invoice effects và các journal chưa sync; **pending không được biến thành zero**.
7. Chỉ sau review/approval riêng mới đi vào **import preview/commit** của sản phẩm sẽ triển khai trong code repo; script S2 không có kết nối DB hay quyền post.
8. Sau sự kiện có hiệu lực đầu tiên phải dùng forward correction có nguồn, không rollback nghiệp vụ bằng restore DB.

## 4. Giới hạn dry-run cần hiểu

- \`STRUCTURAL_PASS_ONLY\` là đúng cột, kiểu, FK, hash, số học đầu kỳ ở phạm vi validator; **không** có nghĩa seller/provider/kế toán hay thực tế tồn kho đã xác minh.
- Các hồ sơ \`B_NO_CHANNEL\` luôn cần B-CASE/LEGAL-MEMO/INV-09/EV-10; không kích hoạt chỉ nhờ điền T14 \`GO\`.
- \`sourceHash\` trong schema ứng viên chưa phải chuẩn canonical hóa xuyên hệ thống được duyệt; nguồn ngoài ASCII phải có TADR và kiểm tương thích trước source PR.
- Mẫu T14 là **evidence request/case register**, không phải cách nhập trạng thái PASS thực hiện từ Excel.
- File XLSX do script tạo chỉ là giao diện nhập và từ điển; import runtime, permission, SQL transaction, cutover, provider, backup/restore và SLO thuộc S3–S6.

## 5. Ví dụ câu lệnh

\`\`\`bash
S2=reports/2026-11-13-10-product-reference-go-live-blueprint/s2
node "$S2/s2-data-tool.mjs" generate /tmp/s2-data
node "$S2/s2-import-dry-run.mjs" /tmp/s2-data/fixtures/F0 --report /tmp/s2-preview.json
node "$S2/s2-import-dry-run.mjs" --self-test
node "$S2/s2-regression-tests.mjs"
python "$S2/s2-create-xlsx.py" /tmp/S2_NPP_Import_Templates.xlsx
\`\`\`

**Chú ý:** CI và script thuần mẫu chỉ chạy được với dữ liệu giả lập hiện có. Tổ chức import NPP thật phải có approval, hoàn thiện các contract thực và triển khai code import có transaction/idempotency, không dùng script nghiên cứu để ghi production.

## Bổ sung sau review PR #2 — ánh xạ template mới

- **T01:** biểu diễn nhiều mode CSV bằng một chuỗi phân tách \`|\` (ví dụ \`A|B_ONLINE|MIXED\`) rồi chuẩn hóa thành \`["A","B_ONLINE","MIXED"]\` cho S1 JSON Schema. Giá trị chỉ là requested, không tự mở feature/mode gate.
- **T05:** \`sourceDocumentId\` là chứng từ/biên bản đầu kỳ có thể có nhiều line; \`sourceLineId\` là định danh bắt buộc của từng line. Không dùng \`sourceDocumentId\` làm unique key toàn template. Kết hợp namespace tenant/sourceSystem; giữ riêng \`sourceRecordId\` phục vụ chống nhập lại.
- **T11:** \`vehicleKind=MOTORBIKE|TRUCK\`, \`deliveryEmployeeCode\` là người giao hàng và writer nghiệp vụ dự kiến, \`driverEmployeeCode\` là người lái xe. Xe máy cùng người, xe tải cho phép người khác; role/TripAssignment/WriterGrant thực vẫn phải có grant theo thời điểm, không cấp quyền chỉ nhờ CSV. Một writer mỗi Trip **không phải** một Trip cho mỗi installation.
- **T14:** có \`caseId\`; có thể có nhiều gate/AC/EV trên cùng mode. Nhập \`GO\`/\`VERIFIED\` bằng CSV sẽ tạo lỗi \`GO_LIVE_CLAIM_UNVERIFIED\`; phải có workflow evidence độc lập.
- **A/B:** A chỉ cho \`aReservationRef\`; B_ONLINE chỉ cho \`bQuotaRef\`; MIXED bắt buộc cả hai và B_NO_CHANNEL chưa được phép tạo chuyến giao dịch.

**Hành động khi nâng bản mẫu:** loại bỏ file CSV/XLSX tạo trước lần sửa các header T05/T11/T14 hoặc chuyển đổi có kiểm soát theo [data dictionary](data-dictionary.json). Sinh lại template bằng các công cụ hiện tại; không tự suy \`sourceLineId\`, nhân viên lái xe hay quyết định Go-Live khi thiếu chứng từ.

## Migration s2-v2 — Owner decisions 13/11/2026
- T02 adds creditPolicyStatus (UNSET/APPROVED) and creditApprovalRef. UNSET requires blank terms/limit/ref; approved zero is separate and needs a Finance approval reference.
- All 14 templates now use schemaVersion=s2-v2. Do not import s2-v1 as v2 without explicit migration, source rehash, review and approval. Never manufacture zero/approval from unknown v1 data.
- T13 adds MANUAL_REGISTER as structural adapter type, not a product-posted method. Requires source IDs, maker/checker, actual read-back/POSTED and Finance reconciliation evidence.
- B scope: A/B_ONLINE/MIXED with B online; B alternative invoice channel when PWA offline deferred; B_NO_CHANNEL BLOCKED. T01 requested != admitted, T14 is never an approval signature.
- Synthetic approved-zero sample approvalRef is NOT real Finance evidence.
