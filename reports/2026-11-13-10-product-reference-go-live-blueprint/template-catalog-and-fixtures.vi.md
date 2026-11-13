# R010-F — Blueprint template nhập liệu & bộ fixture giả lập

**Trạng thái:** TEMPLATE_CATALOG_PROPOSED. Đây là danh mục trường và kịch bản **để tạo** template/fixture sau; chưa có file XLSX/CSV, import validator hoặc bộ seed hoàn chỉnh.

**Ràng buộc:** [R009 logical Data Contracts](../2026-11-13-09-mvp-specification-baseline/glossary-and-data-contracts.vi.md) và [R009 acceptance oracle](../2026-11-13-09-mvp-specification-baseline/acceptance-tests-and-evidence.vi.md). Tất cả dữ liệu mẫu đều là **giả lập** và không dùng MST, địa chỉ, PII hoặc chứng từ NPP thật.

## 1. Template catalogue T01–T14

| Mã | File/nhóm dữ liệu sẽ tạo | Cột tối thiểu và validator |
|---|---|---|
| T01 | tenant-profile | tenantCode, legalSellerRef, warehouseCode, currency, timezone, modeFlags, profileVersion; seller thật cần verify |
| T02 | customers | customerCode, customerLabel giả lập, type, status, creditTermsDays, creditLimit; Customer được có 0 Outlet |
| T03 | outlets/ship-to | outletCode, customerCode, effectiveFrom/To, addressSample; ShipTo phải snapshot trên chứng từ |
| T04 | products/uom | skuCode, baseUom, salesUom, conversion, unitStep, lot/expiry flags; conversion dương, ID unique |
| T05 | opening-stock-lots | skuCode, location, lot, expiry, status, qtyBase, totalCost, sourceId; tách MAIN/TRIP/quarantine |
| T06 | prices/promotions | ruleId, customerGroup, skuCode, priceMode, unitPrice, discount, effectiveDates, gift/waiver rule; VAT profile thật pending |
| T07 | opening-AR | customerCode, sourceDocument/line, deliveryDate, dueDate, gross, openAmount; không gộp mất open item |
| T08 | opening-customer-credit | customerCode, receiptSourceId, availableAmount, reservedAmount, verificationRef; credit không âm |
| T09 | opening-custody/fund | employeeCode, custodySourceId, amountHeld, cashierAcceptanceRef, cutoff; offer không phải quỹ nhận |
| T10 | opening-advance | employeeCode, advanceId, issued, approvedExpenses, cashierAcceptedReturns, outstanding; độc lập AR/custody |
| T11 | staff/vehicle/trips/grants | actorId, role, vehicleCode, tripId, mode, writerInstallation, AReservation/BQuota/grantRef; 1 writer/trip |
| T12 | cutover-external-manifest | legacySystem/ID/hash, invoiceEffectRef, pendingDeviceJournal, owner/case; UNKNOWN không coi là zero |
| T13 | invoice/accounting-adapter-profile | sellerProfile, providerType, mappingVersion, sent/received/posted/reconciled receipt, lookup; sandbox evidence bắt buộc |
| T14 | acceptance/evidence/cases | tenant, mode, AC/EV/gate, buildSha, testRunId, expected/actual, reviewer, evidenceUri, status, blockerOwner |

## 2. Format dữ liệu và quy tắc nhập

- Mỗi template có dictionary: fieldName, type, required, enum/reference, uniquenessScope, sample, validation, errorCode, owner, schemaVersion.
- Khóa mã để ở dạng string (không mất số 0 đầu). Tiền dùng Decimal/đồng nguyên và roundingProfile; lượng có baseUom+conversionSnapshot, local date/timezone rõ; không tin thời gian client tuyệt đối.
- Dữ liệu có sourceSystem, sourceRecordId, sourceHash và importBatchId để retry không tạo hiệu ứng trùng.
- Import pipeline đề xuất: parse → schema/FK validate → dry-run số dư → report discrepancy có chủ xử lý → approve → commit once → reconciliation receipt.
- Chỉ dùng sample synthetic ở DEMO_SANDBOX; không xuất hóa đơn, posting thật. B-CASE/LEGAL-MEMO và mọi chữ ký NPP vẫn pending.

## 3. Ba cấp bộ số liệu

| Bộ | Giả định thiết kế (không phải benchmark) | Mục đích |
|---|---|---|
| F0 Smoke | 1 tenant, 1 kho, 12 SKU, 6 Customer, 2 xe, 3 chuyến A/B/mixed | FK/import/AR/kho/thu/credit/advance/one-writer |
| F1 Reference | 1 tenant, 50 SKU, 40 Customer, 55 Outlet, 8 chuyến/ngày × 5 ngày | Đa ngày, nhiều lần giao/thu, quà, trả, cost, reconciliation |
| F2 Volume/Fault | ≥3 tenant DB, seed tăng được, crash/offline/restore/duplicate/grant concurrency | Isolation/fault/recovery và capacity study sau này |

## 4. Golden oracle liên kết R009

**AC-03 mixed:** tồn MAIN 100 đơn vị, cost 1.000 (tiền giả lập), hold A40, quota B30; load70 (MAIN30/TRIP70); B giao20/cash200 → AR_B100/custody200/COGS_B200; A giao25 → AR_A375/COGS_A250; thủ quỹ nhận200 → custody0/quỹ200, không giảm AR lần nữa; xe về trả A15+B10 → MAIN55/TRIP0, giữ A15, total COGS450. Không coi hàng chưa giao là bán.

**AC-20 và AC-21:** advance issued500.000, approved expense300.000, offer return200.000 vẫn outstanding200.000, cashier accept 100.000 hai lần → 0. Cash receipt60.000 có AR140.000, phân bổ20.000+15.000 → AR105.000, credit25.000; handover offer50.000 không đổi custody, cashier acceptance mới giảm.

**AC-19/AC-07:** oracle net/VAT/gross, phân bổ discount, trả từng phần, quà ròng/waiver giữ nguyên giá trị nguồn; demo tax inputs không là mức thuế mặc định hay invoice-eligible.

**Validator mục tiêu:** no orphan, source/document id unique/hash consistent; stock by location+status and cost ledger balanced; A hold/B quota, AR/credit/custody/advance nonnegative; no double-post after retry; restore không tái kích hoạt quyền, invoice effect; source references xuyên template/fixture/AC/EV; seed/checksum và expected state sau từng event.

## 5. NPP onboarding từ template

NPP nhận blank template + data dictionary + synthetic example + validation diagnostics + reconciliation report + danh sách gap. Gap được xử lý: theo chuẩn, dùng cấu hình, yêu cầu Product ADR, hoặc blocked; không sửa hệ thống riêng theo thói quen chưa được rà soát. Pilot profile NPP-01 8 chuyến/ngày chỉ là một trường hợp, không áp đặt mọi tenant.

**Chưa hoàn thành:** tạo file CSV/XLSX, fake-data generator, validator, đo tải hay kiểm API thực.
