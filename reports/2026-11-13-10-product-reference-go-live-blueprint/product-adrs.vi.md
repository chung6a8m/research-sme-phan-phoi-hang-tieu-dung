# R010-S1-P02c — Product ADR Register (ứng viên quyết định)

**Trạng thái toàn bộ PADR-01–09:** `PROPOSED_FOR_OWNER_REVIEW` tại ngày 13/11/2026. **Không** có chữ ký Owner/điều kiện pháp lý NPP mới; đây không phải bản thay thế [ADR-001–008](../2026-11-13-09-mvp-specification-baseline/decision-register-and-adr.vi.md) đã ghi mức `OWNER_DECIDED` riêng. Không dùng các PADR để tự sửa R009.

**Quy tắc acceptance:** một PADR chỉ chuyển `ACCEPTED` sau record `decisionId,version,approver,acceptedAt,scope,alternatives,reason,affectedD/BR/DC/API/SM/AC/EV,migration/testEvidence`. Nếu đổi D-01–D-15, phải có quyết định Owner **mới**, không sửa bản lịch sử R009. Nếu phụ thuộc nhà cung cấp/pháp lý, vẫn `EVIDENCE_PENDING` dù PADR về UX được chấp nhận.

## PADR-01 — Product-first thay vì sao chép quy trình riêng NPP-01

- **Context:** R009 xuất phát từ quyết định NPP-01; nhiều hồ sơ đầu kỳ/provider/chữ ký chưa có. Sản phẩm mục tiêu phục vụ nhiều NPP.
- **Decision candidate:** duy trì một golden path A/B/mixed; các yêu cầu NPP phân loại `ADOPT_STANDARD`, `CONFIGURE`, `EXTENSION_CANDIDATE`, `BLOCKED`; chỉ L1 configurable, L0 không bypass.
- **Alternatives:** (A) tùy biến/fork theo từng NPP (không đề nghị), (B) trì hoãn phát triển đến khi đủ hồ sơ NPP-01 (không đề nghị).
- **Consequences:** giảm biến thể lõi và dễ test; một số NPP phải thay đổi nghiệp vụ/thói quen. Cần công cụ onboarding gap và governance. Không cam kết phù hợp mọi NPP trước khảo sát.
- **Owner question:** chấp thuận triết lý Product-First và quy trình giải quyết ngoại lệ? **Trace:** D-01–15, BR-01–24, P01/P02, S5.

## PADR-02 — Default tín dụng bảo thủ và điều khoản theo lần giao

- **Context:** R009 chốt dueDate từng delivery từ terms snapshot A, offline grant phải reserve credit; N thực tế/hạn mức từng NPP chưa có.
- **Decision candidate:** profile mới gợi ý `defaultPaymentTermsDays=0`, `defaultCreditLimitVnd=0` tới khi Finance/Owner cấu hình; với A bán chịu cần terms/approval snapshot; B credit grant có budget trước.
- **Alternatives:** tự cho nợ N=7/14 hoặc hạn mức ngầm theo nhóm Customer, rủi ro cấp tín dụng chưa được ký.
- **Consequences:** an toàn khi chưa có dữ liệu, nhưng gây block cho NPP có tập quán bán chịu; phải có onboarding template/approval cụ thể. Không thay nghĩa vụ cũ.
- **Owner question:** giữ 0/0 mặc định hay dùng `UNSET` bắt buộc chọn? **Trace:** D-06, BR-10/12/13, DC-09, AC-08/09, EV-06, CFG-05/06.

## PADR-03 — Mode admission độc lập với tenant config

- **Context:** B online/offline và mixed cần bằng chứng khác nhau, feature flag không phải bằng chứng.
- **Decision candidate:** TenantProfile chỉ lưu `requestedModes`; admission service độc lập giữ `mode/scope/profileVersion/build/AC/EV/approver/evidence` và server chặn mode chưa admitted. Default provisioning tất cả mode disabled; demo sandbox riêng, không có transacting production.
- **Alternatives:** `enabled=true` do tenant admin tự sửa; một cờ `MVP_READY` cho tất cả mode.
- **Consequences:** nhiều bước preflight hơn nhưng không vô tình mở B no-channel; yêu cầu trạng thái chuẩn riêng ở API/UI và audit. **B no-channel đã bị R009 giữ NO-GO**, không phải quyết định mới của PADR.
- **Owner question:** chấp thuận release gating per-mode (đề nghị)? **Trace:** D-08/15, BR-18/24, AC-14/18, EV-10/14/15, CFG-07/16/18.

## PADR-04 — Bounded pricing và lựa chọn chiến lược làm tròn

- **Context:** D-05 chọn quy tắc tự động hữu hạn và quà ròng; R009 AC-19 có oracle Decimal/discount/inclusive/exclusive nhưng mapping provider/thuế thực pending.
- **Decision candidate:** MVP hỗ trợ `LIST_PRICE`, `CUSTOMER_GROUP`, fixed/percent discount và gift threshold có điều kiện; priority/rounding policy version, line-stable allocation; không dùng expression engine tùy ý.
- **Alternatives:** tất cả chương trình khuyến mại tùy biến kiểu script hoặc chỉ nhập giá tay.
- **Consequences:** test và audit dễ hơn; chính sách phức tạp phải vào backlog/exception. Kế toán/provider/legal vẫn duyệt tax & mapping từng tenant, không dùng 8%/10% fixture làm default.
- **Owner question:** chấp thuận danh sách families và cơ chế override giới hạn? **Trace:** D-05, BR-08/09/20, DC-08, AC-07/19, EV-05/10/11, CFG-11/12.

## PADR-05 — Luồng phê duyệt và kiêm nhiệm cho SME

- **Context:** SME có thể có một nhân viên kiêm nhiều vai trò; R009 yêu cầu Cashier thực nhận, waiver duyệt, return cách ly và cutover đa bên xác nhận.
- **Decision candidate:** capability theo action + assignment; role có thể kiêm nhưng approval class bắt buộc có checker đủ thẩm quyền. Người nộp không tự accept tiền; người tạo refund/waiver không tự duyệt theo policy; audit nguyên nguồn.
- **Alternatives:** role theo chức danh/nhóm màn hình; cho OWNER/admin bỏ hết điều kiện checker.
- **Consequences:** cần thiết kế delegation/backup approver và pending queue; NPP rất nhỏ có thể cần tổ chức lại trách nhiệm, không đương nhiên hợp thức hóa việc một người ký tất cả.
- **Owner question:** chọn mức bắt buộc phân nhiệm, hình thức chứng nhận thay thế nào phải qua review nghiệp vụ/pháp lý? **Trace:** D-06/12, BR-09/13/14/20/21, AC-07/10/16/20/21, EV-05/06/12.

## PADR-06 — Tách ACK, business effects và đối soát trên UI

- **Context:** R009 bắt buộc receipt bền/ledger/outbox và accounting nhiều gate độc lập; người dùng có thể nhầm `đã gửi` với `đã xong`.
- **Decision candidate:** UI hành vi hiển thị rõ `CHƯA_GỬI / SERVER_ĐÃ_GIỮ / NGHIỆP_VỤ_ĐÃ_POST / CHỜ_HÓA_ĐƠN / KẾ_TOÁN_ĐÃ_GHI / ĐỐI_SOÁT_OK|DIFF / CASE` dưới dạng projections, không một cờ chung `synced`.
- **Alternatives:** dùng duy nhất success toast/sync icon để báo hoàn tất.
- **Consequences:** tăng trạng thái hiển thị nhưng tránh thu/ghi trùng khi retry; tiêu chí UX S3 cần kiểm trên PWA. Không yêu cầu đổi state machine gốc đã chốt.
- **Owner question:** phê duyệt contract UX/trạng thái hay cần rút gọn nhãn? **Trace:** D-07/13/14, BR-16/18/19/23, API-10/12, AC-11/15/17, EV-08/11/13.

## PADR-07 — Offline được cấp riêng cho mode/thiết bị, không bật mặc định

- **Context:** PWA offline cần durable journal, one writer/grant/restore; B no-channel phụ thuộc hóa đơn pháp lý.
- **Decision candidate:** `offline.requested=false` cho tenant mới; chỉ enable khi thiết bị/browser/SQL/revoke/recovery E2E pass, policy TTL/budget được phê duyệt và mode invoice đủ gate. Không dùng `offlineEnabled` để mở B no-channel.
- **Alternatives:** bật offline cho mọi mode/thiết bị từ lúc tạo tenant.
- **Consequences:** triển khai ban đầu nghiêng online, giảm rủi ro dữ liệu/kênh hóa đơn; phải có thiết bị và kịch bản thực mới chấp nhận offline.
- **Owner question:** chấp thuận không bật offline mặc định, ngưỡng TTL/cap để TADR tiếp tục? **Trace:** D-07/08/09, BR-15/16/17/18, AC-11/12/13/14, EV-08/09/10.

## PADR-08 — Daily close và dữ liệu chưa đồng bộ

- **Context:** trip có thể có hàng/tiền thực mà command chưa lên server; R009 BR-23 cấm đồng nhất unknown với zero.
- **Decision candidate:** daily close theo `asOf` và `sourceCompleteness`, pending trip/device/provider, số dư stock/AR/custody/advance; `CLOSED_WITH_OPEN_CASES` chỉ khi có owner/next action, không biến zero-diff giả thành PASS.
- **Alternatives:** đóng cưỡng bức khi hết giờ/đánh dấu mọi pending = 0.
- **Consequences:** cần case queue và giám sát thật; không làm mất sự thật vì mạng yếu. Thực thi đo UX/ops trong S3/S6.
- **Owner question:** đồng ý quy định show pending và owner khi close? **Trace:** D-10/11/14/15, BR-05/21/23/24, AC-16/18, EV-12/14/15.

## PADR-09 — Phân biệt pilot NPP-01 và standard product rollout

- **Context:** D-15 lựa chọn Wave 1 NPP-01 3 A + 3 B + 2 mixed/ngày trong ≥5 ngày. Các NPP khác có loại xe, số chuyến và cơ cấu khác.
- **Decision candidate:** model sản phẩm chỉ cố định điều kiện an toàn và dữ liệu cần thu, **không** cố định kích thước pilot 8 chuyến; profile NPP-01 riêng vẫn giữ đúng D-15 đến khi Owner sửa có phiên bản.
- **Alternatives:** bắt tất cả NPP chạy 8 chuyến hoặc bỏ yêu cầu NPP-01 đã chọn.
- **Consequences:** rollout linh hoạt nhưng acceptance phải có denominator/coverage được Owner duyệt trước mỗi pilot, không có PASS tự động.
- **Owner question:** chấp thuận cách tách Product Pilot Contract vs Tenant Pilot Profile? **Trace:** D-15, BR-23/24, AC-18, EV-14/15.

## 2. Các kỹ thuật còn giữ DESIGN_CANDIDATE (không chốt trong S1)

| R009 TADR | Việc cần đội source quyết định | Không được hiểu PADR đã triển khai |
|---|---|---|
| TADR-01 | Schema/index/transaction isolation các ledger và moving-average | SOP không phải SQL transaction |
| TADR-02 | Idempotency canonicalization/hash, durable inbox/outbox, receipts và retry worker | Báo cáo S1 chưa fault-inject |
| TADR-03 | Provider invoice/accounting adapter, webhook/lookup/manual register | Không có hợp đồng nhà cung cấp |
| TADR-04 | Authority/Privacy/Generation ledger ngoài rollback, RPO/RTO và store | Một DB/tenant không đủ bảo đảm restore |
| TADR-05 | Cutover writer lock mọi đường ghi, opening import/preview và Forward Recovery | Không có thử legacy writer NPP-01 |
| TADR-06 | SLO/metric/pilot threshold và Owner acceptance | Không áp SLA tưởng tượng từ fixture |

## 3. Hàng đợi quyết định

| Mức | PADR | Quyết định chặn bước nào? | Khuyến nghị hiện thời |
|---|---|---|---|
| P0 trước Product Baseline acceptance | 01/03 | Chuẩn product, ranh giới config, gate mode | Giữ PROPOSED, cần Owner review |
| P1 trước source UI/API | 02/04/05/06/07 | Default credit/pricing/roles/states/offline | Code có thể spike bằng candidate, không activate giao dịch thật |
| P1 trước pilot plan | 08/09 | Daily close, n/N/tenant profile | Review cùng Operations/Finance |

**Quy tắc đóng S1:** đã tạo và trace được 9 PADR, **không** đánh dấu ACCEPTED nếu chưa có quyết định Owner. R009 `OWNER_DECIDED` vẫn giữ nguyên ở phạm vi nguồn; mọi yếu tố thực tế/legal vẫn `EVIDENCE_PENDING`.
