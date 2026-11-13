# R009-API — Command/API contract và State Machines v1 (ứng viên triển khai)

**Mục đích:** Chuyển các BR/DC thành interface có thể giao phát triển và review. **Tất cả URL, enum, payload dưới đây là `DESIGN_CANDIDATE`, chưa phải OpenAPI đã triển khai.** Các API offline `/v1/commands`, `/receipt`, `/recovery/handshake` kế thừa ví dụ ở [R008-T](../2026-11-12-08-khep-quy-tac-va-dac-ta-mvp/offline-va-phuc-hoi.vi.md); tên vendor accounting/hóa đơn chỉ là action nội bộ, không đặt giả endpoint provider.

## 1. Quy ước chung

- Mọi command xác thực `identity + current tenant membership + role/assignment + scope` trước chọn TenantDB, có `tenantId`, `commandId`, `schemaVersion`, `payloadHash`, `expectedVersion`, `actor`, `businessSourceId`. Retry cùng ID/hash không tạo effect mới; cùng ID khác hash trả `409 idempotency_payload_mismatch`.
- `intent` chưa xảy ra có thể bị từ chối không ghi sổ; `occurredEvent` đã xảy ra (giao/thu/nhận trả) nếu không hợp lệ phải giữ `recorded_exception` có owner/evidence, không xóa log vật lý.
- `acceptedDurably` (custody truyền dữ liệu) khác `commandTerminal` (command đã có kết quả cuối) khác `businessResolved` (nghiệp vụ đã xử lý) và khác `invoiceLegalFacts` hoặc `accountingReconciled`.
- `asOf` và `sourceCompleteness` đi cùng query kho/nợ/tiền, không dùng `0` thay pending offline.
- Tất cả mutation đối với nguồn đã post phải tạo ID/version mới có `adjustmentOf/reversalOf` và audit. Không cho client gửi một field `status=posted` để tự ghi sổ.

## 2. Catalogue interface

| API | Giao diện logic/route ứng viên | Guard và effect tối thiểu | Status/evidence phải trả |
|---|---|---|---|
| API-01 | `ResolveTenantContext(subject, tenant)` | Current membership, role/assignment và tenant state từ authority hiện hành | `authorized\|denied\|authority_unavailable`, revision; không trả data tenant khác |
| API-02 | `Create/ConfirmAOrder`, `RecordADelivery` | Customer/ShipTo/terms/giá snapshots, A reservation, nhiều lần giao với khóa nguồn | Order ID, delivery IDs, remaining qty, AR effect IDs, policy version |
| API-03 | `Prepare/ReleaseTrip`, `Load/UnloadStock`, `Prepare/ConfirmTripClose` | Kho-01 writer, chứng từ cấp xe, A reservation/B quota, one writer, manifest; close phải đối soát | Trip revision, load IDs, grant/bundle, missing device events, custody/exception |
| API-04 | `POST /v1/commands` cho `SaleDeliveryReceipt` B và lệnh offline khác | Kiểm grant và cạnh tranh stock/credit; một transaction sale+delivery+AR+receipt+custody/outbox/audit | Durable Receipt schema §3; documentIds/effectIds ổn định |
| API-05 | `RecordReturnRequest`, `AcceptReturn`, `ReleaseQuarantine` | Liên kết nguồn giao; request/held chưa giảm nợ; accept+received tính lũy kế; QA riêng | Return/source/version, quantities, AR/cost adjustment IDs, quarantine state |
| API-06 | `ConfirmPayment`, `AllocateReceipt(partial)`, `ApplyCustomerCredit`, `AcceptCashHandover`, `AdvanceIssue`, `ApproveAdvanceExpense`, `OfferAdvanceReturn`, `CashierAcceptAdvanceReturn`, `Approve/DisburseRefund` | Verified payment rồi mới mở phân bổ; credit theo source; thủ quỹ xác nhận hai loại nhận tiền khác nhau; advance partial và over-settlement guards | Receipt confirmed/allocated/credit remaining, AR/custody/fund/advance deltas với event IDs/version, case khi chênh |
| API-07 | `PrepareInvoice`, `DispatchInvoice`, `LookupInvoice`, `RecordProviderResult`, `AttachExternalDocument` | Intent từ delivery, legal profile, provider reference/hash bất biến; registry ngoài rollback | WorkflowStatus và legal facts độc lập, UNKNOWN/lookup/actual provider ID |
| API-08 | `QueueAccountingEvent`, `DeliverAccountingEvent`, `ReceiveAccountingAck`, `LookupPosting`, `ReconcileAccountingBatch` | Durable outbox, line dedup; kế toán adapter thực quyết phương thức API/file | `RECEIVED`, `POSTED`, `RECONCILED_OK\|DIFF` độc lập + ID/hash/totals |
| API-09 | `ImportPreview/Approve/CommitOpening`, `FreezeLegacy`, `ActivateWriter`, `RecordForwardCorrection` | Manifest, source hash, đa bên ký; old writer khóa toàn Kho-01 | Cutover state, nguồn/chênh/số dư, prior writer status |
| API-10 | `GET /v1/commands/{id}/receipt`, `GET /v1/receipt-changes?cursor=` | Cấp theo tenant/scope; receipt revisions không mất sự kiện khi cursor cũ/hết hạn | State, owner, nextAction, changed cursor, recovery generation |
| API-11 | `POST /v1/recovery/handshake` và `ReconcileRestore` | So ID/hash/sequence+epoch; authority/Privacy/Generation/Registry hiện hành; reopen gate | Known/missing/conflict IDs, recoveryCase, allowed/new grants only after review |
| API-12 | `RecordVisitOutcome`, `QueryOperationalAsOf`, `RecordPilotMeasurement` | Visit no-order hợp lệ; báo pending device/exception; đo task có cohort/denominator | Visit status, `asOf`, n/N, task timings, support tickets |

**Định nghĩa tối thiểu sự kiện qua adapter kế toán:** `businessEventId, documentId, lineId, source, seller, customer, sku/uom/qty, net/tax/gross/cost/currency, postingPeriod, eventType, reversalOf, payloadHash, mappingVersion`. Không gọi đây là contract của phần mềm kế toán thật đến khi đối tác xác nhận.

## 3. Offline receipt contract chuẩn bị implement

`Receipt { receiptId, tenantId, commandId, payloadHash, acceptedDurably, payloadStored, commandTerminal, businessResolved, state, reasonCode, receiptRevision, acceptedAt, updatedAt, sourceRecoveryEpoch, currentRecoveryEpoch, durabilityClass, missingDependencies[], effectIds[], documentIds[], exceptionCaseId, assignedRole, nextAction, retryAfterMs, statusCursor }`.

| State | Ai còn trách nhiệm? | Chuyển hợp lệ |
|---|---|---|
| `locally_saved` | Client giữ journal | Send/retry ID gốc → `transport_unknown\|nonaccepted\|accepted_queued` |
| `transport_unknown` | Client query/retry, server nếu thực đã nhận thì tiếp tục | Known receipt → trạng thái server; unknown trong recovery phải handshake |
| `nonaccepted` | Client/nhân sự phục hồi quyền | Có thể retry lỗi tạm bằng cùng ID, không đánh dấu đồng bộ |
| `accepted_queued` | Server giữ payload bền, inbox worker | `awaiting_dependency\|posted\|recorded_exception\|rejected_unexecuted` |
| `awaiting_dependency` | Server worker + deadline/case | Cha xong → thực thi; cycle/timeout → ngoại lệ bền |
| `posted` | Server tiếp tục các outbox/ledger external | Chỉ kết luận sổ tương ứng; không suy hóa đơn/kế toán xong |
| `rejected_unexecuted` | Terminal cho intent chưa xảy ra | Nếu muốn làm lại tạo command mới rõ source, không overwrite |
| `recorded_exception` | Người được phân công xử lý sự kiện đã xảy ra | Reconcile/adjust bằng command mới có nguồn, không xóa sự kiện |

**ACK gate:** chỉ phát `acceptedDurably=true` khi payload canonical đã bền ở đủ nơi contract quy định (inbox và recovery journal) và việc worker tiếp tục được bảo đảm; mô hình R008 không chứng minh fsync/SQL thật. Client phải lưu receipt trước khi dừng gửi payload, giữ dấu vết theo retention policy.

## 4. State machines nghiệp vụ

| SM | Trạng thái chính | Lệnh/chuyển và guard | Điều tuyệt đối không suy ra |
|---|---|---|---|
| SM-01 (A Order) | `DRAFT → REQUESTED → CONFIRMED → PARTIALLY_DELIVERED → FULFILLED\|CLOSED_WITH_REMAINDER` | Confirm snapshot terms/price và reservation; từng `RecordADelivery` giảm remaining, tạo source AR; cancel remaining có source | Order CONFIRMED không tạo AR; Fulfilled không tự xác nhận hóa đơn/kế toán |
| SM-02 (Trip A+B) | `PREPARING → RELEASED → ACTIVE → RECONCILING → CLOSED\|CLOSED_WITH_OPEN_CASES` | Release sau stock/lot/manifest/transport doc/grant; đóng khi thiết bị/stock/cash hoặc case có người nhận; release phần chưa biết cần sync | Không dùng CLOSED để xóa thiếu tiền/UNKNOWN invoice; mixed test phải đạt trước |
| SM-03 (Sale B compound) | `LOCAL_INTENT/LOCAL_OCCURRED → DURABLY_ACCEPTED → POSTED\|EXCEPTION` | SaleDeliveryReceipt giữ sale, delivery, receipt, allocations với IDs riêng; một commit; nguồn grant/price/customer hợp lệ | Invoice là state machine khác; đã giao nhưng hết quyền không thể bị xóa |
| SM-04 (Return) | `REQUESTED → HELD → ACCEPTED_AND_RECEIVED → QUARANTINED → RELEASED_TO_AVAILABLE\|DISPOSED` | Accept có delivery source và value cumulative; QA release do người có quyền | HELD chưa giảm AR; ACCEPTED không tự đưa tồn sang available |
| SM-05 (Receipt/Custody/Advance) | Receipt: `PENDING → CONFIRMED` + các `ALLOCATION_PARTIAL/FULL`/`CUSTOMER_CREDIT/REFUND` event; custody: `HANDOVER_OFFERED → CASHIER_ACCEPTED\|DISCREPANCY_CASE`; advance: `OPEN → PARTIALLY_SETTLED → SETTLED` | Không phải các nhánh kết thúc loại trừ: receipt nhận một lần, phân bổ nhiều lần; advance nhận nhiều approval expense và cashier-accepted return, tính outstanding sau từng event | Không tính tiền pending; không cho credit/advance âm; handover/return không trừ AR lần hai hoặc tự quyết toán khi chưa ký nhận |
| SM-06 (Invoice) | `BLOCKED → READY → SENDING → UNKNOWN\|REJECTED_CONFIRMED\|RECONCILED` + legal facts | UNKNOWN lookup same reference/hash; facts `creationVerified,signedAt,taxCodeReceivedAt,taxSubmissionStatus,buyerDeliveryStatus` độc lập | RECONCILED adapter không tự nghĩa hoàn thành hết nghĩa vụ |
| SM-07 (Accounting) | `QUEUED → SENT\|TRANSPORT_UNKNOWN → RECEIVED → POSTED → RECONCILED_OK\|RECONCILED_DIFF` | Transport retry/lookup giữ event ID; `POSTED` cần partner ack; reconciliation theo cutoff/IDs/lượng/tiền | Nhận HTTP/ACK chưa đồng nghĩa đã ghi sổ; POSTED chưa khớp |
| SM-08 (Cutover) | `PREPARING → FROZEN → PREVIEWED → APPROVED → OPENING_POSTED → NEW_WRITER_ACTIVE → FORWARD_ONLY` | Manifest + reconciliation + signatures; chỉ từ APPROVED được mở writer; từ first effective event chỉ correction | Restore hoặc revert DB không đảo tác động ngoài/giao dịch sau cutover |
| SM-09 (Restore) | `QUARANTINED → AUTHORITY_CHECK → JOURNAL_REPLAY_CHECK → EXTERNAL_LOOKUP → RECONCILED → OPEN` | Current permission/privacy/epoch/source/posting/effect registry; không thể xác minh → giữ khóa | Không replay hóa đơn hoặc revive user revoked từ DB backup |
| SM-10 (Visit) | `PLANNED → STARTED → COMPLETED_NO_ORDER\|COMPLETED_WITH_ORDER\|NOT_VISITED` | Reason/observation/return request riêng; 0..n attachments | Completed no-order không phát sinh sale 0, delivery hoặc tồn |

### 4.1. SM-05 — Bốn chuỗi event độc lập và các số dư quyết toán

| Stream | Event/guard bắt buộc | Dữ liệu sau event (ứng viên) |
|---|---|---|
| Receipt/AR | `PaymentConfirmed` chỉ khi cash đã nhận thực hoặc bank verified; `ReceiptAllocated(allocId,openItemId,amount)` có thể lặp với ID khác; `CustomerCreditApplied`/Refund có source riêng | `confirmedAmount=allocatedToAR+availableCustomerCredit+actualRefunded`; từng `AROpenItem≥0`, `CustomerCredit≥0`; trạng thái `PARTIALLY_ALLOCATED` có thể đồng tồn tại với credit |
| Custody/handover | `CashCollected(receiptId)` tăng custody nếu cash; `CashHandoverOffered` không thay ledger; `CashHandoverAccepted(handoverId,cashierId)` chuyển custody→fund; chênh vào case | `custodyDelta=-cashierAcceptedAmount` khi accepted; khách không bị trừ AR lần hai |
| Advance | `AdvanceIssued` tăng `outstanding`; `AdvanceExpenseApproved` giảm; `AdvanceReturnOffered` **không** giảm; `AdvanceReturnAcceptedByCashier` mới giảm, có thể thực hiện nhiều đợt xen kẽ | `outstanding=Σissued−ΣapprovedExpense−ΣcashierAcceptedAdvanceReturn≥0`; `SETTLED` iff outstanding=0 và không còn pending discrepancy |
| Refund customer credit | `RefundRequested/Approved` không tự chi; `RefundDisbursed` có authority/cash proof và creditSource, idempotent | `creditRemaining` giảm đúng phần đã chi, không sửa receipt source; không thành AdvanceReturn |

**Kiểm soát nguyên tử:** mỗi event có `eventId,sourceId,payloadHash,actorId,authorityVersion,recordedAt`, idempotent theo ID/hash; lock nguồn `receiptId/openItemId/customerCreditSourceId/advanceId/cashCustodyId` khi cập nhật. Phần đã xử lý không bị replay bởi retry/restore; callback thủ quỹ không trùng effect. Đồng thời hai phân bổ/chi/hoàn cùng nguồn vượt balance: chỉ một commit hợp lệ, phần còn lại `rejected_unexecuted` nếu chưa xảy ra hoặc `recorded_exception` nếu tiền thực đã trao. Không bù AR với advance hay custody chỉ để bảng cân.

**Ví dụ hợp lệ (giả lập):** advance phát 500.000, duyệt chi 300.000, thủ quỹ nhận lại 100.000 và 100.000 → outstanding theo từng mốc `500.000 → 200.000 → 100.000 → 0`. Receipt cash đã xác nhận 60.000, phân bổ 20.000 rồi 15.000 vào hai AR nguồn, credit còn `40.000 → 25.000`; custody vẫn tăng 60.000 cho tới khi handover thực. Xem [AC-20/21](acceptance-tests-and-evidence.vi.md).

## 5. Cơ chế chặn và ngoại lệ xuyên state machine

| Tình huống | Kết quả/chủ thể |
|---|---|
| Grant hết hạn trước sale chưa giao | Từ chối `intent` chưa xảy ra, xin quyền online; không hứa giữ tồn. |
| Grant hết hạn nhưng đã giao/thu thực | `recorded_exception`, giữ lượng/tiền khai báo và người phụ trách đối soát; không backdate. |
| Server đã ACK `awaiting_dependency` rồi restart | Server tiếp tục theo inbox bền, không đẩy nghĩa vụ quay lại client. |
| Provider timeout sau gửi invoice | `UNKNOWN`, lookup theo clientReference, khóa phát hành duplicate. |
| Kế toán trả `POSTED` nhưng tổng chênh | `RECONCILED_DIFF` với source IDs, không hiển thị kết thúc. |
| Restore DB trước lần phát hành hóa đơn | Khóa dispatcher, đối chiếu ExternalEffectRegistry + provider, không tái phát hành. |
| Legacy kho tiếp tục có quyền ghi sau cutover | NO-GO dữ liệu Kho-01, không “giới hạn pilot” như cách bỏ qua. |

## 6. Ranh giới triển khai

Trước khi PR source nhận trạng thái Ready: chốt OpenAPI/schema + transaction diagram + state/role matrix trong TADR; có contract tests, concurrency tests, simulated-crash và E2E. Endpoint/table ở đây là ngôn ngữ giao tiếp giữa business và dev, chưa có bằng chứng chạy.
