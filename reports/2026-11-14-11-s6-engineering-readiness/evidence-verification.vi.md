# S6 — Evidence and mode-specific Go/No-Go gates

Nguồn: R010 S3 acceptance-matrix/evidence-run.schema/evidence-register/mode-gates, S4 preflight/cutover/RACI, S5 pilot. Gói này **không** tạo bằng chứng runtime.

## 1. Các cấp bảo đảm tách biệt

1. **OWNER_BASELINE_ACCEPTED:** Document/Product Policy & Contract đã được ký tại C′.
2. **SYNTHETIC_CONTRACT_CI:** lint/JSON/fixture/BDD checks; không chứng minh sản phẩm đang chạy.
3. **REAL_SYSTEM_EXECUTED_UNREVIEWED:** Có build và testRunId thật, actual/expected/ledger source trace, chưa được role approver chấp thuận.
4. **PRODUCT_VERIFIED:** QA/Product reviewer kiểm theo build/mode với AC/EV và P0; cần quyết định riêng.
5. **TENANT_GO_LIVE_ACCEPTED:** Seller/Legal/Finance/Warehouse/Operations/provider, cutover, pilot và Tenant Owner quyết định riêng theo mode.

Không tự nâng cấp 1→4→5 bằng commit hay CI. Chạy fault F-01..22 trong môi trường đã phê duyệt, không tự phát hành hóa đơn production.

## 2. Hồ sơ S3 evidence bắt buộc

- testRunId, build/commit/schema SHA, environment, tenant/mode/device/trip/epoch/source IDs, fixture hash.
- AC/EV/scenario/Fault ID, expected/actual **từng event**, trước/sau MAIN/TRIP/hold/quota/lot/cost, AR/Credit/custody/advance/fund.
- Invoice provider external ref/hash, UNKNOWN lookup/read-back, accounting RECEIVED/POSTED/RECONCILED; receipt/cashier acceptance.
- Artifacts URI+SHA256 trong kho bí mật có audit/retention, reviewer và timestamp thực, anonymization/PII policy. Không commit hóa đơn/khách hàng/keys thật lên GitHub.
- FAIL/BLOCKED/NOT_RUN phải giữ nguyên; evidence JSON schema hoặc T14 CSV không có quyền tự khai PASS.

## 3. Mode matrix

| Mode | Điều kiện phải chứng minh thực | Hiện tại |
|---|---|---|
| A | Five P0 theo scope, A invoice channel hợp pháp, stock/AR/cost/returns, G-IDEMP **online** scoped | NO_GO_PENDING |
| B_ONLINE | Atomic B sale/receipt/credit, BQuota, kênh hóa đơn verified ngay lúc giao, UNKNOWN lookup, ledger/accounting | NO_GO_PENDING |
| MIXED | A + B_ONLINE đủ gate, Mixed E2E độc lập, A hold và BQuota không chồng nhau | NO_GO_PENDING |
| OFFLINE_WRITE | EV-08/09 real-device/journal/grant/TTL/revoke/restore riêng; không kế thừa Online G-IDEMP | DISABLED_PENDING |
| B_NO_CHANNEL | Ngoài MVP; B-CASE-001/002/003, LEGAL-MEMO pending, INV-09 NOT_RUN | BLOCKED |
| PRODUCTION_CUTOVER | Opening/signer/legacy writer khóa **toàn Kho-01**, DR và EV-04/12 | DISABLED_PENDING |

P0 G-STOCK/G-CUT/G-IDEMP/G-LEDGER/G-INV **nonwaivable**. P1 exception yêu cầu owner/scope/expiry/mitigation/compensating controls/actual signed refs; không đổi FAILED/PENDING thành PASS.

## 4. EV-14 trước EV-15

- EV-14 Pilot readiness: approved SLO/UX threshold và n/N, nhân lực/training/devices, legal/provider/Finance readiness, full Kho-01 cutover P0 per mode. Hiện threshold UNSET; không tự điền.
- EV-15: Chỉ sau Pilot thật, NPP-01 3A+3B_ONLINE+2MIXED/ngày trong ít nhất 5 ngày đại diện; đo actual coverage/cases, discrepancy, latency, support cost và mode/tenant decision.
- Pilot Wave 1 là 8 chuyến/ngày **nhưng không giới hạn phạm vi dữ liệu kho**. Writer độc quyền trên toàn Kho-01 kể cả ngoài wave.
- Sau firstEffectId, recovery phải forward-only có source; restore không hồi sinh revoked rights/PrivacyActionLedger hoặc phát trùng external invoices.

**Status:** zero real E2E; EV-01..15 pending, B_NO_CHANNEL BLOCKED, không có Tenant Go-Live.
