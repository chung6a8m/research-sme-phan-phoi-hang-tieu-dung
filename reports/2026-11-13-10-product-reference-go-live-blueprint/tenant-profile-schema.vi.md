# R010-S1-P02b — Tenant Profile Contract v0.1 (logical schema, proposal)

- **Trạng thái:** Product policy đã được Owner chọn, còn schema/DTO/OpenAPI/DDL là `DESIGN_CANDIDATE`; chi tiết trường/schema là đề xuất để S2 tạo template/import, không phải DTO/OpenAPI/DDL đã phát hành.
- **File máy đọc được:** [tenant-profile.schema.json](tenant-profile.schema.json) và [tenant-profile.example.json](tenant-profile.example.json) là **ví dụ schema + profile synthetic `DRAFT`**, không phải profile của NPP-01; không có seller thật, hóa đơn thật hoặc chữ ký.
- **Nguồn:** [R009-G/DC-01–18](../2026-11-13-09-mvp-specification-baseline/glossary-and-data-contracts.vi.md), [R009-D](../2026-11-13-09-mvp-specification-baseline/decision-register-and-adr.vi.md), [POL/CFG-01–24](product-policy-catalog.vi.md).

## 1. Phân tách ba nguồn cấu hình và hiệu lực

1. **ProductPolicy (ngoài quyền chỉnh của tenant):** bất biến L0, thuật toán ledger, logic một writer, trạng thái và tham chiếu AC/EV. Tenant **không có key** để tắt BR-01/05/11/13/16/17/18/21.
2. **TenantProfile (phiên bản chỉnh được trong L1):** seller profile *tham chiếu*, timezone/currency, requestedModes, mặc định terms/limit, price families, lot/quarantine, kênh bank, thông số offline **đề nghị**, adapter references và approval refs. Trường nào chưa có chứng cứ phải lưu `null`/`EVIDENCE_PENDING`, không tự điền ID thật.
3. **ModeAdmission/Authority/Evidence (nguồn kiểm soát ngoài cấu hình tenant):** release từng mode theo build/test, seller/provider/LEGAL-MEMO, cutover/writer, quyền hiện hành, revoke/restore. **Không ghi một cờ `enabled=true` trong TenantProfile để tự mở giao dịch thật.** Feature gate là kết quả kiểm riêng có thẩm quyền, cần `decisionId,scope,profileVersion,buildSha,acIds,evRefs,approver,acceptedAt`.

`effectiveConfiguration` cho **lệnh mới** đọc product invariants và gate trước, sau đó profile effective của tenant, program/role/customer/sku cùng thời điểm; khi post, snapshot thông số theo policy của R009. Với **lệnh đã post**, historical snapshot/source là căn cứ; profile mới không cập nhật lại số tiền/hạn/giá hoặc writer epoch.

## 2. Data dictionary ở mức tenant profile

| JSON path (logical) | Required | Kiểu/bound và proposed default | Xác nhận/căn cứ |
|---|---|---|---|
| `schemaVersion`, `profileId`, `tenantCode`, `version` | Có | string + integer tăng dần, tenantCode ổn định; không đổi tenant identity | Admin/Ops |
| `lifecycle`, `effectiveFrom`, `provenance` | Có | DRAFT/REVIEW_PENDING/ACCEPTED/EFFECTIVE/SUPERSEDED; ISO date; SYNTHETIC_FIXTURE/TENANT_INPUT | Có review record thực mới EFFECTIVE |
| `legalSeller.sellerProfileRef`, `.evidenceStatus` | Có, ref nullable | Ref do NPP cung cấp; EVIDENCE_PENDING hoặc VERIFIED_EXTERNALLY, không chứa MST giả | LegalSeller/Accountant/provider; data/finance |
| `localization.currency/timezone` | Có | VND / Asia/Ho_Chi_Minh đề xuất cho VN | Business operator, policy effective date |
| `requestedModes[]` | Có | unique A/B_ONLINE/MIXED/B_NO_CHANNEL; chỉ là **yêu cầu kích hoạt**, không phải quyết định | Admission gate riêng |
| `customerPolicy.creditPolicyStatus` / `.defaultPaymentTermsDays` | Có | `UNSET` + null ở DRAFT; `APPROVED` + integer 0..365 có Finance approval | Finance + snapshot A Confirm |
| `customerPolicy.defaultCreditLimitVnd` | Có | null khi `UNSET`; integer >=0 kể cả approved zero khi `APPROVED`, không tự cấp chịu | Finance approval + grant reservation |
| `customerPolicy.creditApprovalPolicyRef` | Có, nullable | Mã approval profile của tenant | Finance |
| `inventory.lotPolicy` / `returnQuarantineLocationCode` | Có | SKU_PROFILE; mã location có FK khi onboarding, cách ly bắt buộc cho return | Warehouse/QA |
| `prices.allowedRuleFamilies[]` | Có | enum giới hạn: LIST_PRICE, CUSTOMER_GROUP, FIXED_DISCOUNT, PERCENT_DISCOUNT, GIFT_THRESHOLD | Product default; pricing approver |
| `prices.roundingProfileRef`, `.taxProfileRef` | Có, nullable | Chưa có nghĩa chưa được bán/hóa đơn thật trong scope yêu cầu | Finance/provider/legal |
| `cash.bankVerificationPolicy` | Có | VERIFIED_MANUAL_OR_PROVIDER_FACT, không coi ảnh là confirmed | Finance/cashier |
| `cash.cashierAcceptanceRequired` | Có | `true` const (đề xuất representation của L0) | Độc lập người offer |
| `offline.requested` / `requestedModes[]` | Có | `false` / `[]` cho profile mẫu | Ops grant/device acceptance |
| `offline.grantTtlMinutes`, `.maxCreditExposureVnd` | Có | null/null trong DRAFT; nếu requested thì cần TTL và cap không âm đã duyệt, mode vẫn cần evidence | TADR offline + EV-08/09 |
| `invoice.providerProfileRef`, `.noChannelBPolicy` | Có | nullable; noChannelBPolicy = `BLOCKED` **bất biến mẫu** | B-CASE/LEGAL-MEMO/EV-10; không tự bypass |
| `accounting.adapterProfileRef`, `.deliveryMode` | Có | nullable; `DISABLED_UNTIL_VERIFIED` | EV-11 + Finance |
| `operations.cutoverMode`, `.reportingMode` | Có | `CLEAN_FORWARD_ONLY`, `AS_OF_WITH_PENDING` (const) | D-10/11/14, BR-21/23 |
| `operations.privacyRetentionProfileRef` | Có, nullable | Không đặt số ngày khi chưa có input/căn cứ pháp lý | Privacy/Legal |
| `approvals.thresholdProfileRef` | Có, nullable | Thiếu thì ngăn hành vi đòi phê duyệt chưa cấu hình | Tenant Owner/Finance |
| `approval.requestedBy`, `approvedBy`, `acceptedAt` | Có, các field nullable trừ requestedBy | Trường trong profile không thay chữ ký/approval record bên ngoài | Owner approval workflow |

**JSON Schema chỉ kiểm cấu trúc, enum và một số ràng buộc đơn giản.** Không thể xác minh profile pháp lý, quyền hiện hành, approval maker/checker, FK vào DB tenant, giá vốn, trạng thái invoice hoặc kiểm toán cutover. Validation tầng service/gate vẫn bắt buộc.

## 3. Những ràng buộc liên trường cần kiểm trên server

- Nếu `lifecycle=EFFECTIVE`, phải có approval record độc lập, seller/policy refs đã verified khi scope đòi hỏi; `approvedBy` trong JSON không đủ.
- Nếu `requestedModes` chứa B_ONLINE/MIXED: seller invoice channel, B atomic/grant/quota, accounting/stock gate tương ứng phải đạt trước **admission**.
- Nếu yêu cầu B_NO_CHANNEL: yêu cầu vẫn có thể lưu để khảo sát, **admission luôn BLOCKED** cho đến B-CASE/LEGAL-MEMO/INV-09/EV-10 đủ chứng cứ; schema/profile không thể override.
- Nếu offline `requested=true`: `grantTtlMinutes>0`, allowance chỉ trong bound TADR, writer installation khác không được share grant; kiểm PWA/SQL/device/restore E2E trước bật.
- Khi sales price/tax/roundingRef thiếu: có thể dùng DRAFT hoặc DEMO_SANDBOX, không phát sinh invoice/sale thật.
- `creditPolicyStatus=UNSET` yêu cầu terms/limit/approvalRef là null, không tự bán chịu. `APPROVED` yêu cầu terms/limit integer không âm và approvalRef; ngay cả `0` cũng khác `UNSET`. Runtime phải xác minh approval record, không tin JSON.
- Kho phải mapping stock location/quarantine, UoM/lot/FEFO và legacy write lock **toàn kho** tại cutover; không cho demo fixtures làm opening chính thức.
- Mọi `profileVersion` thay đổi phải sinh audit/impact review/migration notes. Không hồi tố posted AR/invoice/COGS.

## 4. Luồng chuyển phiên bản đề xuất

`DRAFT → REVIEW_PENDING → ACCEPTED → EFFECTIVE → SUPERSEDED` hoặc `REJECTED` nếu không đạt. `ACCEPTED` chỉ nói **chính sách tenant** được duyệt ở cấp được phép; không nghĩa `PRODUCT_VERIFIED` hoặc `TENANT_GO_LIVE_ACCEPTED`.

Mỗi lần cập nhật ghi: `profileId,previousVersion,version,effectiveFrom,changedFields,changeReason,requester,approver,evidenceRef,affectedSOP/POL,upgradePlan,sourceMapping,recordedAt`. Pending offline và external effects luôn cần reconciliation độc lập.

## 5. Ví dụ và negative scenarios dùng khi S2/S3

- Demo profile `DRAFT`, sellerRef=null, modes requested=[A], creditStatus=UNSET, credit limit=null, bank verify, noChannelB=BLOCKED, offline requested=false → **hợp lệ về schema**, không có nghĩa đã được phép Go-Live.
- creditLimit=-1, termsDays=-3, UNSET nhưng điền 0 hoặc approval, APPROVED thiếu approvalRef, duplicated modes, enable noChannelB theo flag tự ý, timezone sai, currency khác VND ở MVP → schema reject.
- profile có `approvedBy` nhưng thiếu external admission evidence, B_ONLINE seller chưa verify, legacy writer còn hoạt động → reject admission dù JSON Schema pass.
- đưa customer group/discount/tax sang phiên bản mới khi delivery đã post → không làm thay amount snapshot nguồn cũ.
- thiết bị cũ offline gửi source trùng sau cutover → idempotent/exception theo R009, không giải quyết bằng sửa profile.

**Bàn giao cho S2:** tạo template T01 và mapping/validation từ schema này, làm thêm các profile SKU, Customer, role, invoice và accounting riêng; **không biến một file tenant-profile.json thành nơi chứa tất cả transaction/authority/evidence**.

## Bổ sung Owner 13/11/2026

- [Owner Decision Register](owner-decisions-and-evidence-gates.vi.md): PADR-02 UNSET khác APPROVED=0; chưa được duyệt thì fail-closed, không tự tạo khoản credit.
- EVQ-05: MVP A/B_ONLINE/MIXED với B online; B dùng kênh thay thế khi PWA mất mạng deferred, B_NO_CHANNEL BLOCKED; requested không đồng nghĩa admitted.
- Offline grant và accounting API/FILE/MANUAL_REGISTER chỉ kích hoạt sau evidence và approval độc lập; cấu hình trong JSON không phát hành quyền.
