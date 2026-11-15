# S6 — Business-first execution cho solo developer

Ngày: 15/11/2026. Loại thay đổi: **điều chỉnh thứ tự thực thi**, không sửa Product Baseline C′, Acceptance R hay Q08 Gate A/B.

## Quyết định tổ chức công việc

Owner đồng ý chuyển trọng tâm sang code nghiệp vụ. Tách hai luồng có thể tiến hành song song:

| Luồng | Làm ngay | Bị chặn khi nào | Kết quả đánh giá |
|---|---|---|---|
| BUSINESS DEVELOPMENT | Sales.Domain, model, state transition thuần, pure functions, xUnit/negative tests, UI mock dùng synthetic data, prototype nhập liệu không ghi thật | Runtime API/SQL/ledger/stock posting chưa được phép trước Gate B | BUILD/UNIT VERIFIED khi CI đúng HEAD PASS, tuyệt đối không tự ghi EV PASS |
| SAFETY / VERIFICATION | Hoàn thiện B04, chọn đúng một restricted evidence provider, sandbox/role/safety review | B05/B06 chạy fault/concurrency/ACK test chỉ sau Gate A; S6-A runtime chỉ sau Gate B | Gate A/B và bằng chứng real theo hồ sơ độc lập |

**Không có đường vòng:** source code/domain unit tests không tương đương B05/B06; business runtime, SQL stock/AR, provider, in/outbox, HTTP write, mode admission, cutover không được kích hoạt trước gate tương ứng. Không suy diễn công việc chuẩn bị hay CI synthetic là real E2E.

## Milestone triển khai

### BD-01 — Module A Domain First (thực thi mở PR)

- Repository: https://github.com/chung6a8m/MyDms
- PR mã nguồn: https://github.com/chung6a8m/MyDms/pull/11
- Nhánh: feature/2026-11-15-module-a-domain-first
- Phạm vi: in-memory AOrder, Customer/Outlet/ShipTo, Confirm snapshot commercial/terms/credit, simulated partial delivery per source line và per-delivery due dates; unit/negative tests.
- Chủ yếu trace BR-02/03/08/10, DC-05/09, SM-01, SOP-02.
- Trạng thái tại lúc tạo tài liệu: SOURCE PR DRAFT, CI chạy/chờ kết quả; không ghi test PASS khi chưa đối chiếu run.
- Ranh giới: quote/rounding là candidate, không tính thuế thật, không AR/stock post.

### BD-02 — Sau review BD-01

- Củng cố test độ bao phủ theo nguồn nghiệp vụ, bổ sung pure logic cho rule snapshot, state transition và policy validation có lợi ích trực tiếp.
- Có thể làm UI draft/prototype cho đơn A với dữ liệu synthetic không cấp mode và không gọi business write API.
- Không mở đợt framework/host/microservice/cloud rộng mới.

### SV-01 — Gate A tối thiểu theo B04 hiện có

- Chọn **một** restricted evidence store phù hợp tài chính solo dev; không tự chọn AWS chỉ vì PR #9 đã có template.
- Xác minh account/access denied, encryption, audit, retention, restore, dữ liệu synthetic/public boundary, cô lập sandbox và cleanup.
- Tổ chức các review thực Technical/QA/Ops/Security; Finance khi đánh giá rủi ro Gate A cần. Một người kiêm nhiều vai trò phải ghi rõ, không dựng reviewer độc lập giả.
- Cấp Owner Gate A authorization riêng chỉ sau khi đạt chứng cứ; không tự nâng trạng thái.
- Trạng thái hiện hành: Issue #4 OPEN, Gate A NOT_READY.

### SV-02 — B05/B06 (sau Gate A)

- B05: TADR-01 SQL atomic stock/AR/custody/advance/cost; B06: TADR-02 durable inbox/outbox/replay/lost ACK với synthetic, disposable environment.
- B07 actual TADR-01/02 Technical/QA, Finance cho ledger; B08 Owner Gate B authorization riêng trước S6-A runtime.
- G-STOCK, G-CUT, G-IDEMP, G-LEDGER, G-INV không miễn trừ.

### BD-03 — Từ Gate B: S6-A rồi A Online E2E

- Sau Gate B, kết nối Sales domain với runtime có authority, stock reservation và credit headroom, transaction/ledger, idempotency và source IDs; không dựa vào simulator để ghi sổ.
- Sau S6-A, hoàn thành A Online E2E: order → confirm/hold → trip load → multiple deliveries → verified receipt/AR → invoice intent/accounting/reconciliation theo điều kiện riêng.
- Tiếp theo: B_ONLINE, MIXED A+B_ONLINE; Offline A tách nhánh; B_NO_CHANNEL/alternative offline invoice channel vẫn BLOCKED/DEFERRED.

## Ranh giới trạng thái bắt buộc

- C′ = eb9c4b04e334530367b80ea4178edb4dd4a07491, R = e47c3feb44c02a0fdf46c35f6c4b2f57c4365470 bất biến.
- Product Baseline đã Owner Accepted ở mức chính sách/contract; Product Verification/Tenant Go-Live chưa được cấp.
- TADR-01..06 DESIGN_CANDIDATE; EV-01..15 real pending; S6-A..F runtime vẫn PLANNED.
- Gate A NOT_READY, B05/B06 NOT_STARTED, Gate B BLOCKED; OFFLINE_WRITE/CUTOVER DISABLED.
- Không đổi Q08, không chuyển mode trạng thái và không xóa P0 khi làm Business Development.

## Handoff cụ thể

Ưu tiên review PR #11 bằng CI đúng HEAD và check yêu cầu business; nếu có finding thì sửa tại PR. Song song, Owner chọn phương án kho restricted evidence khi thật sự cần Gate A. Không yêu cầu cấu hình cloud/hạ tầng enterprise trước khi review domain code.

Tài liệu này bổ sung lộ trình S6 hiện có, không thay đổi thứ tự điều kiện S6-A..F hay Definition of Done cho runtime.
