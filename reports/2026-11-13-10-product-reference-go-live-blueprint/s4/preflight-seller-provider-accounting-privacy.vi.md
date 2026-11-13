# S4-P08 — Preflight seller / invoice provider / accounting / legal / privacy

**Trạng thái:** `PREFLIGHT_TEMPLATE / EVIDENCE_PENDING`, không phải ý kiến pháp lý, chưa xác nhận tên vendor, loại hóa đơn, tỷ lệ VAT, nội dung hóa đơn, thẩm quyền đại diện hay phân vùng dữ liệu NPP. Theo PADR-03/06/07, EVQ-01/05/06 và SOP-03/10. Nguồn cuối cùng cần **Legal/Tax, seller, Finance, provider và người phụ trách dữ liệu thực** xác nhận trên phiên bản rõ ràng.

## 1. Cổng pháp nhân, seller và hóa đơn — trước A/B_ONLINE

| Mã preflight | Câu hỏi bắt buộc / bằng chứng | Người có quyền xác nhận | Fail-closed |
|---|---|---|---|
| PF-INV-01 | Ai là **seller pháp lý** của từng tenant? Thông tin định danh/mã số thuế/ủy quyền/địa chỉ và phiên bản hồ sơ? Có đúng một seller/tenant trong MVP? | Tenant seller authorized rep + Legal/Finance | Seller ref thiếu/nhầm ⇒ chưa phát hành |
| PF-INV-02 | Căn cứ hiệu lực theo loại giao dịch A/B, thời điểm bắt buộc lập hóa đơn, sự kiện giao/nhận, xử lý trả/điều chỉnh, chữ ký/truyền dữ liệu? | Legal/Tax reviewer | Không suy nghĩa vụ từ PWA log |
| PF-INV-03 | SKU/UoM/nhóm hàng/thuế suất/bán quà/discount và hiệu lực được ai duyệt? Lưu snapshot giá/thuế/version theo source line? | Finance/Tax + Data Owner | Fixture VAT 8%/10% **không** là default production |
| PF-INV-04 | Hợp đồng/ủy quyền provider, sandbox và production tenant credentials (được lưu bí mật), mapping seller, version API, trạng thái hóa đơn, endpoint lookup/webhook/failover? | Seller + Provider + IT | Không coi mock pass là vendor verified |
| PF-INV-05 | Chứng minh request ID/hash ↔ invoice reference, timeout/UNKNOWN read-back, idempotency, không phát trùng, corrective/reversal có nguồn, delivery vs order/receipt? | Provider + QA + Finance | UNKNOWN => case, lookup trước retry |
| PF-INV-06 | B_ONLINE có kênh hóa đơn **hợp lệ tại thời điểm thực giao**? Trường hợp PWA mất mạng nhưng provider vẫn online phải tách device connectivity với invoice channel readiness; nếu không có chứng cứ thì xử lý thế nào? | Legal/Provider + Ops | `WAITING_INVOICE_CHANNEL`, không hoàn tất giao bán B |
| PF-INV-07 | B-CASE-001/002/003, LEGAL-MEMO, INV-09 hiện thế nào? Việc bán B alternative channel khi PWA mất mạng đã được phê duyệt riêng chưa? | Legal, Seller, Product Owner | `B_NO_CHANNEL BLOCKED`; alternative channel DEFERRED, không "chốt hộ" |

**Không định nghĩa pháp lý theo suy đoán:** cần tài liệu quy phạm, hiệu lực và hình thức giao dịch cụ thể với reviewer rõ. Chỉ Product quyết định phạm vi, không thể thay Legal/provider acceptance bằng product approval. Cụm "đã gửi provider", "đã cấp số", "đã ký", "đã phát hành", "đã giao hóa đơn" có thể có state khác; không gộp về một boolean `issued`.

## 2. Kế toán, ba sổ, giá vốn — cổng có kiểm chứng riêng

| Mã | Cần lấy bằng chứng | Người xác nhận |
|---|---|---|
| PF-ACC-01 | Adapter API/FILE/`MANUAL_REGISTER` nào được sử dụng, mappingVersion, source ID/hash, file manifest/checksum, receipt/read-back/lookup và replay policy? T13 là cấu hình ứng viên, không là adapter đã chạy | IT/Accounting adapter owner |
| PF-ACC-02 | Kiểm trạng thái `RECEIVED` (tiếp nhận), `POSTED` (ghi sổ), `RECONCILED_OK/DIFF` (đối soát), correction link; mỗi trạng thái có nguồn log/read-back và cutoff? | Accountant + Finance |
| PF-ACC-03 | Đối chiếu source-line qty/net/VAT/gross, AR/CustomerCredit/custody/advance, cash accepted, refund actually disbursed; không netting ba sổ để che thiếu hụt | Finance + Cashier |
| PF-ACC-04 | Giá vốn vận hành moving average theo SKU × vị trí, kế toán chính thức có thể bình quân kỳ; có bridge delta, review close period, adjustment chứng từ mới? | Cost Accountant + Finance |
| PF-ACC-05 | MANUAL_REGISTER: người nhập và người kiểm khác nhau, số đăng ký/chứng từ nguồn và posting proof, không coi upload file là POSTED hoặc manual tick là reconciled | Finance authorized approver |
| PF-ACC-06 | Tình huống provider unavailable/UNKNOWN, đồng bộ trễ, POSTED nhưng DIFF, file nhập lại và late external event có case/owner và testRunId thực? | QA + Finance + IT |

**Không** phát hành `PRODUCT_VERIFIED` chỉ vì sandbox adapter nhận request. EV-11 cần thực chứng POSTED/reconciliation; P0 G-LEDGER không được miễn. Phân biệt bank VERIFIED và ảnh chuyển khoản; Cashier phải thực nhận để chấp nhận handover/return.

## 3. Quyền riêng tư và điều hành dữ liệu

| Mã | Kiểm soát phải xác minh | Reviewer |
|---|---|---|
| PF-PRI-01 | Data controller/processor và bên nhận dữ liệu, mục đích/phạm vi dữ liệu/nhân viên/khách, cơ sở xử lý hợp lệ, thông báo/đồng ý nơi áp dụng, source evidence | Tenant Data Owner + Legal/privacy officer |
| PF-PRI-02 | Dữ liệu nhạy cảm/PII trong Customer/Outlet/ShipTo/ảnh/GPS/receipt, tenant isolation, least privilege, cross-tenant support approval/audit, redaction dữ liệu test | Security + Tenant Data Owner |
| PF-PRI-03 | Retention/deletion/export/rights request/legal hold/incident notice/cross-border hoặc storage assessment **theo luật áp dụng**, contract, version; CFG-24 mặc định `UNSET` | Legal/privacy officer |
| PF-PRI-04 | Restore không hồi sinh quyền bị revoke hoặc privacy action; current authority/PrivacyActionLedger/generation ngoài rollback và audit; drill F-06/22 | Security/Ops + Legal |
| PF-PRI-05 | Key/secrets, encryption, backup access, provider DPA/audit, mất thiết bị, incident timeline, verified deletion, access logs/retention proof | Security + Provider IT |

Không đưa danh tính thật, chứng từ thật, API keys, PII hoặc legal memo chưa được phép vào fixture công khai. Nếu chưa được người có thẩm quyền duyệt thời hạn lưu/xử lý dữ liệu, trạng thái preflight là `EVIDENCE_PENDING`, không tự gán một số ngày.

## 4. Điều kiện theo mode và hồ sơ ký

- **A:** seller + legal invoice trigger, master/tax snapshot, provider A, G-INV/EV-10, kho/cutover/ledger, EV-14; PWA offline chỉ khi grant riêng đã kiểm.
- **B_ONLINE:** các điều kiện chung + provider invoice channel *đang sẵn sàng và được chứng minh*, BQuota/credit grant, source-line atomic command; khi channel mất thì hold, không giao tiếp B bằng "offline enable".
- **MIXED:** chỉ khi A và B_ONLINE đủ gate **và** Mixed E2E độc lập; A hold và B quota riêng, receipt/stock/cost và invoice theo nhánh.
- **OFFLINE_WRITE:** mặc định DISABLED; thiết bị, trip, grant/TTL/limit/epoch/restore có test EV-08/09 riêng. Không được suy quyền hóa đơn B từ PWA write.
- **B_NO_CHANNEL:** ngoài phạm vi MVP, `BLOCKED`; B-CASE-001/002/003/LEGAL-MEMO `EVIDENCE_PENDING`, INV-09 `NOT_RUN`.
- **PRODUCTION_CUTOVER:** còn `DISABLED_PENDING` cho đến writer lock toàn Kho-01, opening đa bên ký, rehearsal và EV-04/12 đạt.

Mỗi hồ sơ thực có tenant/mode, sellerProfileVersion, tax/legal reference, provider/version, accounting adapter/mappingVersion, privacy policy version, applicability effectiveAt, testRunId, actual external receipt/hash, checker ID, authority, signedAt và status. **Không có điều nào trong file này xác nhận hồ sơ đó đã tồn tại.** Dữ liệu để nhập trong S5/S6 phải bảo mật và có quy trình phê duyệt độc lập; T14 và dossier S4 chỉ là checklist, không phát hành mode gate.
