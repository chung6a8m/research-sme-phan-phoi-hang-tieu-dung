# S4-P06 — Tenant onboarding, opening/cutover và các cổng vận hành

**Tình trạng:** runbook ứng viên, **chưa chạy production rehearsal**, chưa có số dư NPP thật hoặc chữ ký. Thực hiện theo SOP-01, SOP-05, SOP-11, AP-08/09, EVQ-01..07, AC-04/13/16, EV-02/04/09/12/14. **Mọi thời điểm cutover, số liệu, hostname, đường chạy lệnh và người ký phải điền theo hệ thống thật.**

## 1. Phạm vi, nguồn kiểm tra và lệnh cấm

Tenant có một seller và một nguồn ghi tồn kho sau cutover. Với NPP-01, **toàn Kho-01** (MAIN/TRIP/lot/quarantine/ngoài Wave 1) thuộc quyền ghi mới; 8 chuyến Pilot **không** là giới hạn của kho. Có thể chuyển chức năng/scope người dùng từng wave, nhưng không chia chủ quyền stock giữa legacy và MVP. Mọi StockIn, StockOut, Transfer, Return, Adjust, Import, API, Job, offline sync đều phải có đường ghi đã kiểm và bị chặn ở legacy.

`requestedModes` trong T01/Profile chỉ là nhu cầu; không là `admittedModes`. A/B_ONLINE/MIXED cần Product Verification + Tenant Gate theo mode; MODE admission tách Cutover Gate. Finance credit `UNSET` fail-closed khác `APPROVED=0`, không sinh nợ mặc định.

## 2. C0–C8 (điền bằng chứng thực tế vào dossier trước khi ký)

| Bước | Người điều phối / checkpoint bắt buộc | Nếu chưa đạt |
|---|---|---|
| **C0 — Nhận tenant** | Tenant Owner xác nhận seller/tenant, Kho-01, timezone, profileVersion, danh sách role/ủy quyền, kiểm soát tách maker–checker; Data Owner duyệt nguồn và quyền sử dụng T01–T14 | `NO_GO_PENDING`, không import production |
| **C1 — Legal/adapter preflight** | Legal/Finance xác nhận seller và thuế theo SKU/thời điểm; provider/kênh hóa đơn A/B_ONLINE, nguồn tra cứu UNKNOWN; accounting API/FILE/MANUAL_REGISTER, privacy, môi trường sandbox thật | Không bật mode thiếu G-INV/EV-10/11; không dùng dữ liệu demo |
| **C2 — Inventory mọi writer và devices** | IT + Kho liệt kê old UI/API/DB direct/job/import/middleware/offline devices/queue/file, scheduled & off-wave; device journal/epoch, trip holder/installation, in-flight invoices/accounting; bằng chứng từng đường ghi | **P0 G-STOCK NO-GO** nếu còn đường không kiểm/chưa khóa được |
| **C3 — Cutoff/freeze** | Owner ấn định `cutoffAt` cùng timezone và thời điểm khóa; cảnh báo dừng ghi, quét journal pending; chụp snapshot có hash, backup & kiểm thử đọc; danh mục giao dịch chưa hoàn tất có owner | Không freeze tùy tiện; pending sync không được coi bằng 0 |
| **C4 — Opening preview & reconcile** | Import T01–T14 phiên bản phù hợp, sourceRecordId/sourceHash, dry-run không post; đối soát stock MAIN/TRIP/lot/quarantine/hold/quota, AR từng open item, CustomerCredit, Custody, Fund, Advance, chi phí và external registry; lưu delta/source line | Sai lệch mở case + source, **không** sửa CSV để triệt sai lệch |
| **C5 — Đa bên chấp thuận** | Kho (tồn lô/xe), Finance/Kế toán (AR/credit/advance/cost), Thủ quỹ (cash/custody), IT (backup/writer map), Tenant Owner (AP-08) ký **trên cùng snapshot hash + cutoff**; QA xác nhận trace test | Thiếu bất kỳ chữ ký áp dụng hoặc nhập lại file sau ký ⇒ quay C4 |
| **C6 — Writer fencing/switch** | IT đóng mọi đường writer legacy **trên toàn Kho-01**, thử thao tác chặn ở từng UI/API/job/import/offline route; kiểm tra user/credential/token, drain/case pending journal; bật new writer có một generation/epoch, không dual-writer | Bất kỳ old writer nào còn ghi hoặc stale device không được xử lý ⇒ **STOP P0** |
| **C7 — First effect boundary** | Sau C5/C6 và gate mode, ghi nhận `firstEffectId`, external refs, timestamp từ runtime **ngay trước/sau** nghiệp vụ đầu tiên; tiếp tục theo dõi kho, ba sổ và hóa đơn; không backdate | Nếu chưa có first effect, có thể hủy switch theo kế hoạch được phê duyệt sau khi xác minh **không có** effect bên ngoài |
| **C8 — Stabilize/handoff** | Reconcile nguồn MAIN/TRIP/lot, AR/Custody/Advance/credit, invoice/provider, accounting RECEIVED/POSTED/RECONCILED, device backlog và các hoạt động off-wave; giao support/incident owner, daily close có asOf/n/N | Sau first effect **FORWARD_RECOVERY_ONLY**; không restore DB để xóa nghiệp vụ/hóa đơn thật |

### Nguồn manifest và bằng chứng

- T05: opening stock theo SKU × kho/xe × lot/UoM, quarantine/FEFO; T07/T08: AR/CustomerCredit; T09/T10: custody/advance; T11: employee/driver/delivery/trip/grant; T12: invoice ngoài, device pending journal, legacy source hash; T13: provider/accounting adapter; T14: caseId + AC/EV/gate **không phải quyết định GO**.
- Cặp đối soát **before/after từng event/source line** bao gồm opening, AReservation/BQuota độc lập, moving-average vận hành và cầu nối giá vốn kỳ; không tái phát sale/receipt lịch sử để tạo opening.
- `AP-08 CUTOVER_GO` là phê duyệt người có thẩm quyền trên manifest thực; **không** suy từ file chuẩn CSV hoặc việc chạy thành công dry-run.

## 3. Writer-path inventory thực địa (mẫu bắt buộc điền)

| Đường ghi | Chứng minh đầu ra bị chặn sau freeze | Owner xác nhận |
|---|---|---|
| Legacy UI/web/mobile tại kho và ngoài Wave | Thử create/update/void stock, chứng minh không commit | IT + Warehouse |
| Legacy API/service integrations, direct SQL, service accounts | Log/deny policy + kiểm before/after SQL bằng test được phép | IT/Security |
| Scheduled jobs, imports, batch files, ETL, third-party | Cấu hình disable/revoke + log no-write dù job retry | IT + Integration owner |
| Offline device/app còn queue và thiết bị thất lạc | Epoch/grant revocation/fencing + outstanding journal/case reconcile | Ops + QA/Security |
| Data fix/stock adjust/returns ngoài pilot | Nhập duy nhất qua MVP approved writer, source/approval audit | Warehouse + Finance |

**Không coi checklist này là bằng chứng**. Mỗi dòng cần environment, time, testRunId, build SHA, artifact hash, signer. Một đường "không phát hiện" không tương đương "đã khóa".

## 4. Go/No-Go theo mode

| Mode | Điều kiện trước khi ký AP-09 | Quyết định ban đầu |
|---|---|---|
| A | Product EV/AC + cutover/stock/ledger/invoice A + pilot readiness EV-14 | `NO_GO_PENDING` |
| B_ONLINE | A/B common gates + B atomic/credit/quota và kênh hóa đơn B online hợp lệ | `NO_GO_PENDING` |
| MIXED | Gate A + B_ONLINE + Mixed E2E độc lập (không kế thừa từ A), A held/B quota tách | `NO_GO_PENDING` |
| OFFLINE_WRITE | Grant theo tenant/mode/trip/installation, một writer/trip; EV-08/09 real device ACK/revoke/restore; invoice B riêng | `DISABLED_PENDING` |
| B_NO_CHANNEL | Ngoài MVP; B-CASE-001..003/LEGAL-MEMO pending, INV-09 NOT_RUN | `BLOCKED` |
| PRODUCTION_CUTOVER | EV-04/12, full warehouse writer lock + AP-08 rehearsal | `DISABLED_PENDING` |

P0 không thể được miễn, kể cả Owner. P1 exception phải có scope, người chịu trách nhiệm, thời hạn, biện pháp bù và hồ sơ duyệt, **không đổi Evidence FAILED/PENDING thành PASS**.

## 5. Dừng và chuyển sang Forward Recovery

- **Trước effect đầu tiên:** dừng an toàn, giữ snapshot/đếm event, xác minh invoice/bank/accounting **không** đã phát hiệu ứng ngoài DB và device chưa giao thực; chỉ khi đủ xác nhận mới thực hiện kế hoạch abort được phê duyệt. Không suy "chưa thấy ACK" là "chưa có effect".
- **Sau effect đầu tiên:** ngừng phát giao dịch mới ở mode bị ảnh hưởng, cách ly ca, lập issue với `sourceRecordId/firstEffectId` và bảng diff; không restore về trạng thái giả không từng giao hàng/tiền; sửa bằng correction/reversal có nguồn, post qua writer MVP và đối soát external trước reopen.
- Late legacy/device commands phải vào quarantine/occurredEvent case khi hàng/tiền thực đã giao; phân biệt intent chưa thực hiện (reject) với event đã xảy ra (reconcile), không backdate hoặc ghi trùng.
- C8 bàn giao on-call/backup contacts, evidence index, thiết bị/role và các open cases có owner/nextAction/expiry; daily close có thể `CLOSED_WITH_OPEN_CASES` kèm asOf và completeness, không báo "sạch" nếu thiếu journal.

**Tài liệu liên quan:** [DR/recovery](backup-restore-and-recovery.vi.md), [P08 preflight](preflight-seller-provider-accounting-privacy.vi.md), [RACI/mẫu ký](raci-training-signoff.vi.md), [S3 test execution](../s3/test-execution-and-handoff.vi.md).
