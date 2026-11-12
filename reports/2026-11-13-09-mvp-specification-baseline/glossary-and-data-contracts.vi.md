# R009-G — Glossary, mô hình sở hữu và Data Contract v1

**Phạm vi:** Quan hệ và trường bắt buộc ở mức *logical contract*. Không phải DDL, OpenAPI đã phát hành hoặc mapping dữ liệu NPP đã xác nhận. Kế thừa [R008-SPEC §5](../2026-11-12-08-khep-quy-tac-va-dac-ta-mvp/dac-ta-mvp-de-nghi.vi.md) và các lựa chọn [D-01–D-15](decision-register-and-adr.vi.md).

## 1. Thuật ngữ chuẩn

| Thuật ngữ | Nghĩa duy nhất trong MVP | Không đồng nhất với |
|---|---|---|
| `Subscriber` | Bên ký/trả phí dịch vụ SaaS; quan hệ hợp đồng vận hành nền tảng | Customer mua hàng của NPP; Tenant. |
| `Tenant` | Ranh giới cô lập dữ liệu/cấu hình (một database/tenant) của một đơn vị bán trong MVP | Hàng đại lý, Outlet, cùng một người dùng ở nhiều tenant. |
| `BusinessOperator` / `LegalSeller` | NPP là đơn vị mua–bán và có nghĩa vụ xuất chứng từ/hóa đơn trong tenant | Subscriber nếu hợp đồng thuê hộ; nhà sản xuất; đại lý. |
| `NPP` | Nhà phân phối, một vai trò thương mại; chỉ trở thành `BusinessOperator` khi chính là bên vận hành tenant | Bất kỳ Customer gọi là NPP. |
| `Customer` | Một đối tác mua và chịu nợ/nhận credit trước NPP; id ổn định | Điểm bán hoặc địa chỉ giao; nhân viên. |
| `Outlet` | Điểm bán thực địa tùy chọn của Customer (`0..n`); quan hệ chủ có hiệu lực từ/đến | Bên chịu nợ mặc định; ShipTo. |
| `ShipTo` | Thông tin nơi giao được snapshot cho từng Order/Delivery | Một Outlet bắt buộc phải tồn tại. |
| `Đại lý` | Vai trò/kênh thương mại, có thể là Customer hoặc Outlet theo hồ sơ thực | Loại legal seller, quan hệ sở hữu suy từ tên gọi. |
| `SKU` | Mặt hàng tồn kho có UoM chuẩn, profile lô/hạn và trạng thái | Một số mã barcode hoặc một lô mua. |
| `StockLocation` | Nơi giữ lượng/giá trị: kho, xe hoặc vùng cách ly theo thiết kế | Tên xe/biển số hoặc nhân viên. |
| `Trip` | Phiên vận hành cấp/giữ/giao/bán/thu/đối soát gắn với nhân sự và xe | Xe; chứng từ cấp xe; toàn ngày kế toán. |
| `Writer` | Installation/assignment độc quyền viết offline cho một trip trong grant | Lái xe theo chức danh; bất kỳ thiết bị đăng nhập. |
| `Custody` | Trách nhiệm giữ hàng hoặc tiền theo người/bên được giao, có chứng từ bàn giao | Quyền sở hữu hàng, chi phí/tạm ứng, Customer AR. |
| `SourceDocument` | Chứng từ/sự kiện gốc có định danh bền để truy vết | Request HTTP, batch import hay invoice provider ID. |
| `BusinessEvent` | Tác động nghiệp vụ ghi một lần theo khóa nguồn | Một lần sync/retry, một lần export file. |

## 2. Nguyên tắc định danh và thẩm quyền

1. Mỗi record giao dịch mang `tenantId`, `businessOperatorId` theo loại, `eventId` hoặc `documentId/lineId`, `sourceId/sourceLineId`, `actorId`, `policyVersion`, `occurredAtClaim`, `recordedAt`, `businessDate`, `postingPeriod` (khi ghi sổ), `reversalOf/adjustmentOf` (nếu có).
2. Cấu trúc số tiền gồm `currency`, `amountDecimal` hoặc integer minor unit, `roundingProfileVersion`. Không dùng IEEE floating point để quyết số dư. Lượng có `quantityDecimal`, `baseUomId`, `uomConversionSnapshot`, `unitStep`.
3. Mọi câu lệnh có `commandId`, `payloadHash`, `schemaVersion`, `sourceNamespace`; một khóa không được gắn hai payload khác nhau. Các ID hiệu ứng bên ngoài không được tái sinh sau restore.
4. `recordedAt` do server ghi và `occurredAtClaim` do người dùng/thiết bị khai khác nhau. Đồng hồ máy không phải nguồn duy nhất quyết định trước/sau cutover hoặc quyền offline.
5. Không derive giá, tiền, thuế, hạn nợ hay người chịu trách nhiệm lịch sử từ danh mục hiện tại; dùng snapshot có version tại mốc chấp nhận.

## 3. Logical Data Contracts

| DC | Aggregate/tập trường bắt buộc tối thiểu | Ràng buộc/nguồn sự thật |
|---|---|---|
| DC-01 | `Subscriber`, `Tenant`, `BusinessOperator`, `LegalSellerProfile`; seller identity/tax profile version | Một người bán/tenant; membership không suy từ subscriber billing; DB tách tenant. |
| DC-02 | `Customer(id, status)`, `Outlet(id, customerOwnershipEffectiveFrom/To)`, `ShipToSnapshot` | Customer 0..n Outlet; mỗi chứng từ giữ customerId và ShipTo đúng lúc tạo. |
| DC-03 | `SKU`, `Uom`, `UomConversionSnapshot`, `Lot(expiry)`, `StockLocation` | Qty chuẩn và lô/FEFO; lot không tự quyết moving average cost. |
| DC-04 | `Trip`, `TripAssignment`, `Vehicle`, `TripManifest`, `AReservation`, `BQuota`, `WriterGrant` | Cấp kho→xe chưa tạo AR; A/B sử dụng cùng nguồn lượng nhưng phân quyền riêng; 1 writer/trip. |
| DC-05 | `AOrder`, `OrderLine`, `OrderTermsSnapshot`, `Delivery`, `DeliveryLine` | Nhiều delivery/order; số đã giao và phần chưa giao có nguồn, không sửa lịch sử. |
| DC-06 | `Sale`, `SaleLine`, `Delivery`, `Receipt`, `Allocation`, `SaleDeliveryReceiptBundle`, `creditExposureConsumed`, `customerCreditApplied` | Một compound command B có effect IDs riêng; debit grant/CustomerCredit và AR/custody/stock cùng transaction, không double consume. |
| DC-07 | `StockMovement`, `CostBasisSnapshot`, `CostPosting`, `SourceCostVersion`, `CostAdjustment` | SKU×location moving-average; nguồn giá vốn xuất và điều chỉnh giữ version; kỳ khóa không mutate. |
| DC-08 | `PriceRuleVersion`, `DiscountAllocation`, `GiftEntitlement`, `GiftHolding`, `GiftReturn`, `GiftWaiver` | Snapshot giá/thuế/quà theo giao dịch; waiver có nguồn, người duyệt, scope và số quà còn giữ. |
| DC-09 | `ReceivableOpenItem`, `CustomerCredit(creditSourceId,availableAmount)`, `TermSnapshot`, `DueDate`, `ReceiptAllocation(allocationId,receiptId,openItemId,amount)`, `CreditReservation(grantId,sourceId,remaining)` | AR theo Customer/delivery; hạn theo local date + N; receipt confirmed hỗ trợ nhiều phân bổ, phần chưa phân bổ là credit có nguồn; credit đã reserve không ghi trùng/không âm. |
| DC-10 | `CashCustodyLedger`, `CashHandover(offeredAmount,acceptedAmount)`, `CashHandoverAcceptance(cashierId,acceptedAt,sourceId)`, `CashShortageCase`, `CashierFundLedger` | Chỉ actual money thuộc custody; accepted handover chuyển tiền tới quỹ đúng một lần, không trừ AR lần hai; chênh có case. |
| DC-11 | `AdvanceLedger(issuedTotal,approvedExpenseTotal,cashierAcceptedReturns,outstanding)`, `AdvanceIssue`, `AdvanceExpenseApproval`, `AdvanceReturnOffer`, `AdvanceReturnAcceptance`, `AdvanceSettlementEvent` | Mỗi event có source/idempotency; `outstanding=issuedTotal-approvedExpenseTotal-cashierAcceptedReturns≥0`; quyết toán nhiều phần, confirm thủ quỹ; không bù custody/AR. |
| DC-12 | `ReturnRequest`, `ReturnCustody`, `ReturnAcceptance`, `ReturnSourceLine`, `QuarantineStock` | Giữ hộ không làm giảm AR; nhận trả có nguồn, giới hạn giá trị/lượng; cách ly trước tái bán. |
| DC-13 | `OfflineCommandEnvelope`, `ClientJournal`, `DurableInbox`, `Receipt`, `Dependency`, `ExceptionCase` | ID/hash bất biến, status revision tăng; chưa ACK bền journal vẫn giữ; event đã xảy ra không bị reject như nháp. |
| DC-14 | `InvoiceIntent`, `LegalSellerProfile`, `ExternalEffectRegistry`, `ProviderFact`, `ExternalDocumentLink` | Intent tham chiếu delivery/correction; external ID/ref/hash giữ ngoài DB tenant rollback; pháp lý khác transport. |
| DC-15 | `AccountingOutboxEvent`, `AccountingDeliveryAttempt`, `ExternalReceipt`, `PostingFact`, `ReconciliationBatch`, `CorrectionLink` | Ba chiều nhận bền–ghi sổ–đối soát; line-level dedup theo event/source, không batch alone. |
| DC-16 | `CutoverManifest`, `OpeningRecord`, `LegacySourceLink`, `CutoverApproval`, `ForwardCorrection` | Khóa nguồn import: tenant+sourceSystem+recordType+sourceRecordId+hash; opening không replay sale/receipt lịch sử. |
| DC-17 | `AuthorityLedger`, `PrivacyActionLedger`, `GenerationAnchor`, `RecoveryJournal`, `ObjectManifest` | Trách nhiệm logic độc lập với tenant restore; store/scope là technical candidate theo R008-T. |
| DC-18 | `Visit`, `Observation`, `VisitOutcome`, `ReturnRequest`, `PilotMeasurement` | Visit có thể không đơn; không tạo sale 0 đồng/tồn hay AR; KPI có cohort và n/N. |

### DC-13 — Envelope offline bắt buộc đối chiếu R008-T

Dự kiến sử dụng `protocolVersion, payloadSchemaVersion, tenantId, commandId, canonicalizationVersion, payloadHash, commandType, kind(intent|occurredEvent), originalActorId, installationId, installationIncarnationId, tripId, sourceRecoveryEpoch, writerEpoch, offlineGrantId, grantHash, localSequence, dependsOn[], expectedResourceVersions, policyVersions, bundleId, documentIds[], occurredAtClaim, lastOnlineAnchorId, payload, attachments[]`. Không tin chữ ký/ID/giờ máy đơn lẻ để chấp nhận quyền. **Tên trường chi tiết là ứng viên R008, chưa phải OpenAPI đã chốt.**

### DC-09/11 — Phân bổ thu từng phần và quyết toán advance

- Receipt: `receiptId, customerId, paymentMethod, verifiedAt, confirmedAmount, allocationIds[], unallocatedCreditSourceId, cashCustodyEffectId?, bankSettlementRef?`. Một nguồn thanh toán có nhiều allocations theo `openItemId` và nhiều thời điểm; `sum(allocations)+availableCustomerCredit+sum(actualRefunds)=confirmedAmount` theo cùng source (trừ correction có version). Refund và credit application không sửa/bỏ receipt gốc. Pending bank không là nguồn receipt confirmed.
- Advance: mỗi `advanceId` có issued amount, expense approvals đã duyệt và cashier-accepted returns liên kết. `AdvanceReturnOffer` từ nhân viên chưa đổi ledger; `AdvanceReturnAcceptance` từ thủ quỹ là điều kiện tạo returned amount. `outstanding` không âm; muốn thay quyết định phải có correction/reversal source mới, không overwrite event đã post.
- Grant: `OfflineCreditGrantLedger(grantId,customerId,initialAmount,remaining,consumptionEventIds[],reservationStatus)` và `CustomerCreditReservation(sourceId,remaining)` là **hai loại nguồn**. `creditExposureConsumed` từ grant khác `customerCreditApplied` từ credit có sẵn; cả hai phải cùng version/transaction với sale/AR. Việc giải phóng phần chưa tiêu cần evidence reconciliation; không suy từ gross đã thu.

### DC-15 — Accounting Outbox/Receipt ứng viên

- Event bất biến: `tenantId, businessEventId, sourceDocumentId/lineId, eventType, amount/currency, qty/uom, net/tax/gross/cost, policyVersion, payloadHash, exportRevision, createdAt, postingPeriod`.
- Lần gửi: `deliveryAttemptId, idempotencyKey` ổn định, transport `SENT/UNKNOWN/RETRY` có log; không làm mới `businessEventId` khi timeout.
- Kế toán xác nhận 3 fact riêng: `RECEIVED` (tiếp nhận), `POSTED` (ghi sổ/đã nhập), `RECONCILED_OK|RECONCILED_DIFF` (đối soát với DMS theo cutoff). `POSTED` không hàm ý khớp công nợ/kho/thuế.
- Với file thủ công: import register, ID/hash từng dòng, signed receipt và lookup do người có quyền xác nhận thay API tự động; không giả webhook nếu không hỗ trợ.

### DC-16 — Opening manifest không được gộp tổng sai

Import tách: hàng tại kho/xe (SKU×location×status/lot), AR open items (Customer + due source), customer credit, custody từng người, advance từng người, đơn/chuyến dở, hóa đơn ngoài và device/commands chưa sync. Khi opening AR đã phản ánh phiếu thu lịch sử, liên kết receipt cũ mà **không replay** để giảm AR lần nữa.

## 4. Authority Matrix — ai là nguồn có thẩm quyền

| Dữ liệu/sự kiện | Nguồn vận hành trong MVP | Ranh giới ngoài MVP / cần đối soát |
|---|---|---|
| Kho/xe/lô/quyền A+B sau cutover | **MVP writer độc quyền Kho-01**; các nghiệp vụ ngoài wave cũng ghi tại đây. | Hệ thống cũ chỉ đọc/nhận data qua đường kiểm soát; kiểm bằng thử chặn tất cả đường ghi. |
| Customer AR và receipt allocation | Ledger vận hành MVP | Kế toán kiểm posting chính thức, reconciliation. |
| Custody và advance | Hai ledger riêng trong MVP; bên nhận tiền/được cấp tiền ký nhận | Quỹ/ngân hàng/kế toán xác minh thực nhận và closing. |
| Giá vốn moving average | MVP vận hành theo location | Giá vốn kế toán theo kỳ là số kế toán chính thức; chênh có source. |
| Hóa đơn đã lập và trạng thái hợp lệ | Provider/kênh lập được xác minh + registry; DMS giữ intent/link | Không dùng trạng thái gửi HTTP để suy hóa đơn đã lập. |
| Membership, revoke, quyền support, privacy request sau restore | Authority hiện hành ngoài rollback của TenantDB | Hệ thống phục hồi phải đọc/replay toàn bộ trước mở quyền. |

## 5. Data-quality gates

- **DQ-01:** không có orphan sourceId, duplicate documentId khác payload hoặc hàng không xác định owner/địa điểm.
- **DQ-02:** số lượng, quy đổi, giá trị, kỳ và dueDate được tính bằng Decimal/profile, số sau mỗi event truy được.
- **DQ-03:** snapshot/customer/source đầy đủ với các giao dịch đã ghi; thay danh mục không đổi số cũ.
- **DQ-04:** manifest chứa cả thiết bị offline không báo hết queue; unknown không được mặc định không có giao dịch.
- **DQ-05:** các case privacy/retention có căn cứ và owner; dữ liệu giữ bắt buộc không được dùng cho mục đích đã bị hạn chế.
