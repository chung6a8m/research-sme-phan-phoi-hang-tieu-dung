# R010-S1-TR — Truy vết Product Standard → R009 → Acceptance/Evidence

- **Trạng thái:** `STRUCTURAL_TRACE_DRAFT`; các mã D/BR/DC/API/SM/AC/EV là ID của [R009](../2026-11-13-09-mvp-specification-baseline/report.vi.md), SOP/POL/PADR là **ứng viên S1**. Có trace **không** nghĩa API/DB/thiết bị đã test hoặc Owner đã ký.
- **Nguồn gốc mapping:** [R009-TR](../2026-11-13-09-mvp-specification-baseline/traceability.vi.md). Các bảng S1 giúp dev và Product review tác động, không thay ma trận R009.
- **Tài liệu:** [SOP-01–12](sop-a-b-mixed.vi.md), [POL-01–24](product-policy-catalog.vi.md), [Roles/Approvals](role-and-approval-matrix.vi.md), [PADR-01–09](product-adrs.vi.md), [Tenant Profile](tenant-profile-schema.vi.md).

## 1. 15 quyết định R009 → tài liệu sản phẩm S1

| Decision | Policy IDs (S1) | SOP IDs (S1) | PADR candidate liên quan | Cần giữ mức bằng chứng |
|---|---|---|---|---|
| D-01 | POL-01, POL-17 | SOP-01, SOP-09, SOP-11 | PADR-01, PADR-03 | OWNER_DECIDED ở tenant/authority; seller thực pending |
| D-02 | POL-02 | SOP-01, SOP-02 | PADR-01 | Customer/Outlet/ShipTo master NPP pending |
| D-03 | POL-03, POL-04, POL-11 | SOP-02, SOP-03, SOP-04 | PADR-01, PADR-03 | Mixed E2E pending |
| D-04 | POL-06, POL-07, POL-20 | SOP-05, SOP-06 | PADR-04 | Cost accounting mapping pending |
| D-05 | POL-08, POL-09, POL-20 | SOP-06 | PADR-04, PADR-05 | VAT/provider/price profile thực pending |
| D-06 | POL-10, POL-12, POL-13, POL-14 | SOP-02, SOP-07, SOP-08 | PADR-02, PADR-05 | Terms/limit/số dư NPP pending |
| D-07 | POL-11, POL-15, POL-16 | SOP-03, SOP-09 | PADR-03, PADR-07 | E2E offline pending |
| D-08 | POL-18 | SOP-03, SOP-09, SOP-10 | PADR-03, PADR-07 | B-CASE/LEGAL-MEMO/EV-10 P0 pending |
| D-09 | POL-16, POL-17 | SOP-09, SOP-11 | PADR-07 | Revoke/restore actual pending |
| D-10 | POL-21 | SOP-11 | PADR-08 | Cutover manifest và ký pending |
| D-11 | POL-04, POL-05, POL-06, POL-24 | SOP-04, SOP-05, SOP-11 | PADR-08 | Legacy writer lock toàn kho pending |
| D-12 | POL-12, POL-13, POL-14 | SOP-07, SOP-08 | PADR-05 | Quỹ/custody/advance NPP pending |
| D-13 | POL-19 | SOP-10 | PADR-06 | Accounting provider/posted/reconciled pending |
| D-14 | POL-15, POL-16, POL-17, POL-21 | SOP-09, SOP-11 | PADR-07, PADR-08 | Fault injection/source restore pending |
| D-15 | POL-22, POL-23, POL-24 | SOP-04, SOP-12 | PADR-09 | 3A+3B+2mixed, ≥5 ngày chỉ profile NPP-01 |

## 2. Mỗi BR-01–24 có một chính sách gốc, SOP thực hiện và test oracle

| BR | POL | SOP | Data Contract | API/SM (nguồn R009) | Acceptance/Evidence (nguồn R009) |
|---|---|---|---|---|---|
| BR-01 | POL-01 | SOP-01, SOP-09, SOP-11 | DC-01, DC-17 | API-01, SM-09 | AC-01; EV-01, EV-09 |
| BR-02 | POL-02 | SOP-01, SOP-02 | DC-02, DC-05 | API-02, SM-01 | AC-02; EV-02 |
| BR-03 | POL-03 | SOP-02, SOP-04 | DC-05 | API-02, SM-01 | AC-03; EV-03 |
| BR-04 | POL-04 | SOP-02, SOP-03, SOP-04, SOP-05 | DC-04 | API-03, SM-02 | AC-03; EV-03 |
| BR-05 | POL-05 | SOP-05, SOP-11 | DC-03, DC-16 | API-09, SM-08 | AC-04; EV-04, EV-12 |
| BR-06 | POL-06 | SOP-05, SOP-06 | DC-03, DC-12 | API-03, API-05, SM-04 | AC-05; EV-04, EV-05 |
| BR-07 | POL-07 | SOP-05, SOP-06 | DC-07 | API-03, API-05, SM-04 | AC-06; EV-07 |
| BR-08 | POL-08 | SOP-01, SOP-02, SOP-06 | DC-08 | API-02, SM-01 | AC-19; EV-05, EV-10 |
| BR-09 | POL-09 | SOP-06 | DC-08 | API-05, SM-04 | AC-07; EV-05 |
| BR-10 | POL-10 | SOP-02, SOP-07 | DC-09 | API-02, SM-01 | AC-08; EV-06 |
| BR-11 | POL-11 | SOP-03, SOP-04, SOP-09 | DC-06 | API-04, SM-03 | AC-09; EV-06, EV-08 |
| BR-12 | POL-12 | SOP-03, SOP-04, SOP-07, SOP-09 | DC-06, DC-09 | API-04, SM-03 | AC-09; EV-06, EV-08 |
| BR-13 | POL-13 | SOP-03, SOP-07, SOP-08 | DC-09, DC-10, DC-11 | API-06, SM-05 | AC-10, AC-20, AC-21; EV-06 |
| BR-14 | POL-14 | SOP-06, SOP-07 | DC-09 | API-06, SM-05 | AC-19, AC-21; EV-06 |
| BR-15 | POL-15 | SOP-03, SOP-04, SOP-09 | DC-04, DC-13 | API-04, API-11, SM-03 | AC-12; EV-08 |
| BR-16 | POL-16 | SOP-09, SOP-11 | DC-13 | API-10, API-11, SM-09 | AC-11; EV-08 |
| BR-17 | POL-17 | SOP-01, SOP-09, SOP-11 | DC-17 | API-01, API-11, SM-09 | AC-13; EV-09 |
| BR-18 | POL-18 | SOP-02, SOP-03, SOP-09, SOP-10 | DC-14 | API-07, SM-06 | AC-14; EV-10 |
| BR-19 | POL-19 | SOP-10 | DC-15 | API-08, SM-07 | AC-15; EV-11 |
| BR-20 | POL-20 | SOP-05, SOP-06 | DC-12 | API-05, SM-04 | AC-05, AC-19; EV-04, EV-05 |
| BR-21 | POL-21 | SOP-05, SOP-11 | DC-16 | API-09, SM-08 | AC-16; EV-12 |
| BR-22 | POL-22 | SOP-12 | DC-18 | API-12, SM-10 | AC-17; EV-13 |
| BR-23 | POL-23 | SOP-08, SOP-12 | DC-18 | API-12, SM-10 | AC-18; EV-14 |
| BR-24 | POL-24 | SOP-04, SOP-12 | DC-18 | API-12, SM-10 | AC-18; EV-14, EV-15 |

## 3. Acceptance/readiness mapping

| Cổng sản phẩm | S1 policy + SOP | R009 evidence (chưa PASS) |
|---|---|---|
| Tenant/master/access | POL-01, POL-02, POL-17; SOP-01/09/11 | AC-01/02/13; EV-01/02/09 |
| A order/delivery/terms | POL-03, POL-04, POL-08, POL-10; SOP-02 | AC-02/03/08/14; EV-02/03/06/10 |
| B online sale/credit/receipt | POL-11/12/13/14/15/16/18; SOP-03/07/09/10 | AC-09/10/11/12/14/15/21; EV-06/08/10/11 |
| Mixed stock/ledger | POL-04/05/11/12/13/24; SOP-04/05/07/08 | AC-03/04/09/18/19/21; EV-03/04/06/14/15 |
| Return/price/gift/cost | POL-06/07/08/09/20; SOP-05/06 | AC-05/06/07/19; EV-04/05/07/10/11 |
| Offline/revoke/restore | POL-15/16/17; SOP-09/11 | AC-11/12/13/16; EV-08/09/12 |
| Provider/accounting | POL-18/19; SOP-10 | AC-14/15; EV-10/11 |
| Cutover/pilot/visit | POL-05/21/22/23/24; SOP-11/12 | AC-04/16/17/18; EV-04/12/13/14/15 |

**Ghi chú:** Cổng B no-channel vẫn NO-GO khi thiếu hồ sơ; không thể tích `POL-18` và suy cấp phép thật. NPP-01 có ngưỡng 8 chuyến/ngày ≥5 ngày theo D-15, NPP khác phải có pilot profile và Owner acceptance riêng. R009 `MODEL_ONLY` không chuyển thành `PRODUCT_VERIFIED` bằng trace.

## 4. Kiểm cấu trúc và giới hạn

[Validator S1](kiem-tra-s1.py) kiểm tra 15 Decision, 24 BR↔24 POL, 12 SOP, 9 PADR, liên kết file và tập ID tham chiếu; **không** chạy ứng dụng, JSON Schema validator ngoài, E2E hay ký quyết định. Kiểm tra phát triển/acceptance thực sẽ thực hiện tại S3/S6. Khi BR/POL thay đổi phải cập nhật trace, SOP, role matrix, schema, AC/EV và migration impact.
