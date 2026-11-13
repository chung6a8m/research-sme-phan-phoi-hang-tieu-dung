# S4-P06 — Backup/restore, authority, idempotency và Forward Recovery

**Trạng thái:** `DR_RUNBOOK_DESIGN / NOT_REHEARSED`. Chỉ chạy drill trong môi trường cô lập và đã được owner phê duyệt kế hoạch an toàn; đây **không** phải lệnh restore production hoặc cam kết SLA/RPO/RTO.

## 1. Thiết kế ranh giới khôi phục

TenantDB snapshot **không** chứa toàn bộ sự thật hiện hành. Cần có nguồn đáng tin cậy **nằm ngoài miền rollback** hoặc cơ chế đối chiếu độc lập tương đương cho: membership/role/grant revoke & epoch/generation anchor, PrivacyActionLedger (xóa/hạn chế/xử lý quyền), durable server inbox/outbox/receipt ownership, PWA journal/paper source từ thiết bị, invoice provider ref+status (kể cả UNKNOWN), accounting POSTED+reconciliation và các hiệu ứng ngân hàng/quỹ thực.

**TADR-04/05 là DESIGN_CANDIDATE**: chưa có kiến trúc thực tế chứng minh các registry trên tồn tại. Chưa biết nguồn → `BLOCKED`, tuyệt đối không coi restore chỉ SQL là đủ.

## 2. Backup readiness (trước C3, và kiểm tra định kỳ)

1. IT ghi rõ tenant/database/schemaVersion/build SHA, backup location, key custody, encryption, time zone, cutoff, backup job state, retention và người có quyền phục hồi; không để secrets/PII vào GitHub.
2. Đề xuất RPO/RTO, cadence backup, thời hạn lưu, mức dữ liệu hợp lệ, trách nhiệm diễn tập và tiêu chí đo, để Owner/IT/Finance phê duyệt — **tất cả hiện là `UNSET`**, không mặc định PASS.
3. Kiểm chứng **khả năng đọc/khôi phục** trên sandbox hợp lệ, so checksum, đối chiếu count và sample source lines; lưu runId/log/hash và reviewer. Backup `SUCCESS` không chứng minh restore đúng hoặc không mất hiệu ứng bên ngoài.
4. Lưu S2 opening manifest/cutoff (T05/T07..T13), external registry extracts và device list ngoài snapshot; gán owner cho pending/UNKNOWN.
5. Chuẩn bị quyền khóa writer/quarantine, chuyển hướng client, thông báo đối tác và phương án dừng nếu restore fail.

## 3. DR-01..DR-08 — Trình tự drill / sự cố

| Bước | Kiểm soát cần chứng minh | Nếu không đạt |
|---|---|---|
| DR-01 Detect & declare | Ops xác định severity, tenant/mode, impacted writer, firstEffectId, nguồn báo; Incident Commander tuyên bố quarantine | Không truy cập/ghi vào tenant ảnh hưởng vô hạn định |
| DR-02 Fence writers | Chặn writer cũ/mới không kiểm soát, vô hiệu grant/epoch phù hợp, ghi nhận in-flight & journal/outbox; bảo vệ external registry | Không mở tiếp ca; case cho physical event đã xảy ra |
| DR-03 Snapshot current facts | Chụp tenant + authority/revoke/privacy/current generation + invoices/posted accounting/bank + source journal từ những nguồn không rollback | Thiếu nguồn ngoài ⇒ `BLOCKED` reopen |
| DR-04 Restore isolated | Phục hồi backup vào vùng cách ly; ghi backupId, checksum, `restoreTo`, SQL/schema/build, log của restore; không đổi live DNS/tokens khi chưa review | Restore chưa chứng minh không được nhận traffic nghiệp vụ |
| DR-05 Reconcile identities & external | Dùng authority và PrivacyActionLedger **hiện hành**, không từ snapshot; lookup invoice UNKNOWN theo same external ref/hash, accounting POSTED/RECONCILED, bank/cash; so sánh source-line trước/sau | Revoked token/consent hồi sinh, duplicate invoice/posting ⇒ P0 STOP |
| DR-06 Replay safely | Durable inbox/outbox có commandId/effectId/payloadHash/idempotency; same ID+hash một effect, mismatch conflict; dependency + ACK lost kiểm; unowned physical event → incident/case | Không cấp lại writer/grant do thiếu journal hoặc server durable copy |
| DR-07 Balance & approve | Warehouse/Finance/Cashier so MAIN/TRIP/hold/quota, AR/Credit/custody/advance; IT/Security kiểm generation/revoke/privacy; QA test F-01/06/07/10/14/16/22, AP-10 checker ký | Sai source hoặc khoản UNKNOWN ⇒ tiếp tục cách ly |
| DR-08 Reopen narrowly | Tenant Owner/đúng approver theo AP-10 xét từng scope/mode, evidence link và giờ hiện hành; khôi phục service qua writer đã admit, theo dõi C8/hypercare | Không tự đánh `GO` khi có API healthy |

## 4. Các tình huống không được tự chữa bằng replay

| Tình huống | Tác vụ an toàn | Trace |
|---|---|---|
| DB đã COMMIT nhưng HTTP ACK bị mất | Lookup durable receipt/commandId trước retry; same ID/hash không thêm effect | F-01, AC-11/12, EV-08 |
| Thiết bị/role bị revoke sau snapshot | Authority hiện hành thắng snapshot; deny stale grant, ghi physical occurredEvent/case | F-06/14, EV-01/09 |
| Invoice provider trả UNKNOWN | Lookup theo immutable intent/external ref/hash, không tự phát lại invoice bằng ID mới | F-04/22, EV-10 |
| Accounting POSTED ngoài TenantDB | Read-back provider/partner theo source line; không tạo chứng từ POSTED lần hai | F-15/22, EV-11 |
| Writer legacy còn ghi được | Khóa toàn Kho-01, không xem là P1 waiver hay chỉ chặn 8 trip | F-07/16, EV-04/12 |
| Journal trước khi durable ACK bị mất | Case/reconstruct từ server durable và giấy/device nguồn; không drop effect thật | F-10/14, EV-08/09 |
| Hoàn/điều chỉnh kỳ đã khóa | Correction có nguồn/kỳ đúng; không sửa historical ledger hoặc backdate | F-08, EV-07 |

## 5. Hồ sơ kết quả drill bắt buộc

Ghi `testRunId`, environment, build/DB schema, source snapshot SHA256, backup/restore IDs, timestamps & timezone, measured RPO/RTO (không tự chốt target), wallet/key custody reviewer theo policy bảo mật, **bảng diff trước/sau từng sổ**, pending journal/UNKNOWN, external read-back, roles & signingRefs. Đính bằng chứng dạng sanitized + hash/retention theo [S3 evidence-run](../s3/evidence-run.schema.json). Phân biệt `EXECUTED_UNREVIEWED` với QA và Tenant Owner acceptance.

Không tắt trực tiếp network hoặc phát hành hóa đơn thật để "test" nếu chưa có quyền/plan. S4 chỉ mô tả procedure; S6 phải gắn đúng service names/commands/checkpoint DB và thu F-xx thật.

**Điều kiện cuối:** restore chưa chứng minh được revocation/privacy/external effect thì `NO_GO_PENDING` cho reopen. Sau firstEffectId chỉ sửa xuôi có nguồn, không rollback business transaction đã xảy ra.
