# R010-S2 — Reference Scenarios F0/F1/F2 và oracle nguồn

**Đối chiếu:** [R009 AC-03/19/20/21](../../2026-11-13-09-mvp-specification-baseline/acceptance-tests-and-evidence.vi.md), [R010-S1 SOP](../sop-a-b-mixed.vi.md), [F0/F1/F2](fixtures/) và [trip-scenarios.json](trip-scenarios.json). Tất cả giá trị là \`MODEL_ONLY\`, không có \`testRunId\` chạy sản phẩm.

## 1. Ba dataset có seed

| Dataset | Seed | Thành phần | Mục tiêu tái lập |
|---|---:|---|---|
| F0 | 101 | 1 tenant; 12 SKU; 6 Customer; 4 Outlet; 2 xe; 3 chuyến A/B/mixed | Smoke nhập liệu, FK/cân đầu kỳ, approval trạng thái |
| F1 | 202 | 1 tenant; 50 SKU; 40 Customer; 55 Outlet; 8 chuyến/ngày×5 ngày = 40 | Mẫu hình pilot NPP-01, **không** là pilot đã xảy ra |
| F2 | 303 | 3 tenant; tổng 360 SKU; 240 Customer; 300 Outlet; 300 chuyến | Tenant prefix, FK isolation mô hình và nguồn kịch bản lỗi |

Mỗi record có \`schemaVersion/sourceSystem/sourceRecordId/sourceHash/importBatchId\`. \`sourceHash\` được tính theo SHA-256 canonical input để phát hiện sửa/tái nhập sai; manifest ghi SHA-256 các bundle. Đơn vị tiền/địa chỉ/hồ sơ seller là giả lập; \`T13 MOCK_ONLY\` và \`T14 NO_GO/NOT_RUN\`.

## 2. Bốn bộ oracle dựa trực tiếp R009

| Case | Chuỗi cần kiểm | Expected không được đổi |
|---|---|---|
| AC-03 — Mixed | MAIN100 @ cost1000; giữ A40+B30; load70; B giao20/thu200; A giao25; nhận nộp200; return A15+B10 | Cuối MAIN55, TRIP0, COGS450, AR_A375, AR_B100, custody0, quỹ200, A held15 |
| AC-19 — Decimal/discount/VAT/return | Giảm 10.001 trên P/Q, hai price modes; VAT 8%/10% **số giả lập**; trả P1/3 và refund 20.000 | EXCLUSIVE gross315.133; INCLUSIVE gross315.999; credit69.600→49.600 |
| AC-20 — Advance partial | Issued500.000, expenseApproved300.000, offer200.000, cashier accept100.000 hai lần | Outstanding 500k→200k→200k→100k→0; offer không thay ledger |
| AC-21 — Receipt allocation | AR140.000, cash receipt60.000, phân bổ20.000 rồi15.000, offer handover50.000 và accept | AR105.000; CustomerCredit25.000; custody10.000, quỹ50.000 sau accept |

Bộ oracle chứa **expected values** để S3 tạo independent automated tests. Không có kết quả gửi hóa đơn, provider, accounting, thuế real SKU hoặc business approval.

## 3. 343 trip projection đơn lẻ

Mỗi một trong 343 scenario theo một \`Trip\` giả lập có mã, source Warehouse/Customer/SKU, loại A/B/mixed, loading/reservation A và B quota, delivered/sold, cash receipt, AR và moving-average COGS. \`s2-trip-scenarios.mjs\` cho phép tái tạo và xác minh quantity/value conservation, source links và numeric balances.

**Quan trọng:** mỗi scenario sử dụng **opening snapshot riêng**. Cùng một SKU có thể dùng trong AC-03 và trong trip scenario đơn giản, **nhưng không được cộng hai kết quả** như hai lần bán thật. Tất cả \`invoiceEligible=false\` và \`providerFact=NOT_TESTED\`.

## 4. Fault/use-case candidates cho S3/S6

| Case | Kỳ vọng trong app thực | AC/EV kế thừa |
|---|---|---|
| F-01 Lost ACK sau business commit | Retry cùng source không nhân đôi stock/receipt | AC-11 / EV-08 |
| F-02 2 writer/trip | Chỉ writer hợp lệ được post, side effects không ghi phần | AC-12 / EV-08 |
| F-03 Grant exhausted cạnh tranh B | Một command commit, command khác deny/case | AC-09 / EV-06/08 |
| F-04 Provider invoice timeout/UNKNOWN | Lookup cùng ref/hash, không tạo hóa đơn mới bằng ID khác | AC-14 / EV-10 |
| F-05 Cash offer chưa cashier accept | Custody/quỹ giữ nguyên | AC-10/20/21 / EV-06 |
| F-06 Restore sau revoked member | Không hồi sinh quyền hoặc privacy action | AC-13 / EV-09 |
| F-07 Legacy writer sau cutover | P0 NO-GO toàn kho, kể cả off-wave | AC-04/16 / EV-04/12 |
| F-08 Cost refund và kỳ khóa | Reversal có source, không mutate kỳ đã khóa | AC-06/19 / EV-07 |
| F-09 Bank pending / refund chưa disbursed | Không giảm AR hoặc credit trước xác nhận | AC-09/19/21 / EV-06 |
| F-10 Missing offline journal | Không suy pending thành zero, có case/recovery | AC-11/16/18 / EV-08/12/15 |

Các fault candidate là **bộ đề nghị kiểm thử**, chưa chạy fault injection trên PWA/API/SQL. S3 cần thiết kế \`testRunId/buildSha/env/expected/actual\` và S6 mới tạo evidence sản phẩm.
