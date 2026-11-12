# R009-TR — Ma trận truy vết Decision → BR → DC → API/SM → Acceptance → Evidence

Đây là chỉ mục **đầu vào để giao triển khai/review**; các mã đều được định nghĩa trong file tương ứng. `EV-xx` là yêu cầu bằng chứng, **không phải bằng chứng đã thu**. Với dữ liệu demo R008, ghi `MODEL_ONLY`; với PWA/SQL/provider/pilot thật, mặc định `NOT_RUN/EVIDENCE_PENDING`.

| Decision | Business Rule | Data Contract | API / State Machine | Acceptance Case | Evidence cần để hoàn tất |
|---|---|---|---|---|---|
| D-01 | BR-01 | DC-01, DC-17 | API-01, SM-09 | AC-01 | EV-01, EV-09 |
| D-02 | BR-02 | DC-02, DC-05 | API-02, SM-01 | AC-02 | EV-02 |
| D-03 | BR-03, BR-04 | DC-04, DC-05, DC-06 | API-02, API-03, API-04, SM-01, SM-02, SM-03 | AC-03 | EV-03 |
| D-04 | BR-06, BR-07, BR-20 | DC-03, DC-07, DC-12 | API-03, API-05, API-09, SM-04 | AC-05, AC-06 | EV-04, EV-07 |
| D-05 | BR-08, BR-09 | DC-08, DC-09 | API-02, API-04, API-05, API-06, SM-04, SM-05 | AC-07, AC-19 | EV-05, EV-06, EV-10, EV-11 |
| D-06 | BR-10, BR-12, BR-13, BR-14 | DC-09, DC-10, DC-11 | API-02, API-04, API-06, SM-01, SM-03, SM-05 | AC-08, AC-09, AC-10, AC-20, AC-21 | EV-06, EV-08 |
| D-07 | BR-11, BR-15, BR-16 | DC-04, DC-06, DC-13 | API-04, API-10, API-11, SM-03 | AC-09, AC-11, AC-12 | EV-08 |
| D-08 | BR-18 | DC-14 | API-07, SM-06 | AC-14 | EV-10 |
| D-09 | BR-16, BR-17 | DC-13, DC-14, DC-17 | API-01, API-10, API-11, SM-09 | AC-11, AC-13 | EV-08, EV-09 |
| D-10 | BR-21 | DC-16, DC-17 | API-09, API-11, SM-08, SM-09 | AC-16 | EV-12 |
| D-11 | BR-04, BR-05, BR-06, BR-24 | DC-03, DC-04, DC-16 | API-03, API-09, SM-02, SM-08 | AC-03, AC-04, AC-05, AC-18 | EV-03, EV-04, EV-12 |
| D-12 | BR-12, BR-13, BR-14 | DC-09, DC-10, DC-11 | API-04, API-06, SM-03, SM-05 | AC-09, AC-10, AC-20, AC-21 | EV-06, EV-08 |
| D-13 | BR-19 | DC-15 | API-08, SM-07 | AC-15 | EV-11 |
| D-14 | BR-15, BR-16, BR-17, BR-21 | DC-13, DC-16, DC-17 | API-09, API-10, API-11, SM-08, SM-09 | AC-11, AC-12, AC-13, AC-16 | EV-08, EV-09, EV-12 |
| D-15 | BR-22, BR-23, BR-24 | DC-18, DC-16 | API-12, SM-10 | AC-17, AC-18 | EV-13, EV-14, EV-15 |

## 1. Ma trận giới hạn phát hành theo nhánh

| Nhánh tính năng | Có thể giao phát triển? | Trước kích hoạt giao dịch thật |
|---|---|---|
| Tenant/customer/master data | Có | AC-01, AC-02; sample dữ liệu + phân quyền thật, EV-01, EV-02 |
| Kho-01 và cấp xe | Có | AC-03, AC-04, AC-05, EV-03, EV-04, EV-12; legacy writer **đã khóa toàn kho**, không chỉ wave |
| A giao/thu | Có | AC-03, AC-08, AC-10, AC-14, AC-15, AC-16 tương ứng + chứng từ/evidence thật |
| B online có kênh hóa đơn được xác minh | Có | AC-09, AC-11, AC-12, AC-14, AC-15 và kênh phát hành, test fault, cutover |
| B mất hoàn toàn kênh lập hóa đơn | Có thể phát triển nháp/recovery/test | **NO-GO** cho giao dịch thật cho tới EV-10/B-CASE/LEGAL-MEMO và INV-09 đạt |
| Mixed trip A+B | Có thể phát triển, thử trên môi trường | AC-03, AC-09, AC-19, AC-21 và toàn bộ stock/cash/invoice gates đạt trong điều kiện mixed |
| Pilot Wave 1 | Có thể chuẩn bị | EV-01–EV-14 theo phạm vi; 8 chuyến/ngày, ≥5 ngày với EV-15; không hạ scope Kho-01 |

## 2. Quy trình kiểm soát thay đổi khi code review

1. Mỗi PR source phải liệt kê `D/BR/DC/API/SM/AC` mà nó triển khai; không ghi `PASS` chỉ bằng ảnh màn hình hoặc unit test giả lập.
2. Khi thay đổi nghiệp vụ, review impact đến snapshot/history, ledger postings, invoice intent, outbox, offline replay, cutover, audit và permissions.
3. Với AC có test runner, ghi `testRunId, test code, commit SHA, environment, device/provider, fixtures, expected/actual, verdict, evidenceURI, reviewer`; mã EV chỉ là vị trí phải điền.
4. Kế toán và Owner xác nhận trên dữ liệu thật; không để dev tự xác nhận rủi ro pháp lý hoặc đóng P0 theo mô hình.
5. Các AC đang `MODEL_ONLY` chỉ được dùng làm oracle số liệu; cần chạy ứng dụng độc lập trước khi đổi status. Ma trận được kiểm tra bởi [validator](kiem-tra-truy-vet.py): tồn tại ID, không orphan và **mỗi BR của một dòng được ít nhất một AC trong dòng đó assert trực tiếp** (xem §1.3 của R009-AC); kiểm tra cấu trúc này không chứng minh ứng dụng đã PASS.
