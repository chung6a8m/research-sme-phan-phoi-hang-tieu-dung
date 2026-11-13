# S3 CONTRACT ONLY — Gherkin outline; NO STEP DEFINITIONS/REAL E2E RESULT.
# Backend/PWA/SQL/provider bindings and environment testRunIds are required in S6.
Feature: Visit, pilot, pricing, advance and customer credit
  Các kịch bản dưới đây là expected behavior, không phải bằng chứng hệ thống đã chạy.

  @ac_17 @ev_13 @positive @not_run_product
  Scenario: S3-AC17-P — Visit không sinh order giả
    Given Sales được phân tuyến tới Customer nhưng không có nhu cầu đặt
    When Ghi no-order visit và reason/observation rồi sync
    Then Visit có source/ACK; không sinh order 0đ, AR hoặc stock; báo cáo n/N
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

  @ac_17 @ev_13 @negative @not_run_product
  Scenario: S3-AC17-N — Visit không sinh order giả (negative/fault)
    Given Visit hoàn thành nhưng offline ACK bị mất
    When Retry đồng bộ hoặc thử tự tạo order giả để đếm visit
    Then Visit chỉ ghi đúng một lần, không tạo transaction giả
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

  @ac_18 @ev_14 @ev_15 @positive @not_run_product
  Scenario: S3-AC18-P — Pilot readiness và coverage theo mode
    Given NPP-01 profile 3A+3B_ONLINE+2MIXED mỗi ngày trong ít nhất 5 ngày có các gate đủ
    When Thu log chuyến, UX-01..08, n/N, asOf, case age, SLO và support cost
    Then Chỉ nghiệm thu từng mode khi EV-14 trước pilot và EV-15 sau pilot có chữ ký/threshold
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

  @ac_18 @ev_14 @ev_15 @negative @not_run_product
  Scenario: S3-AC18-N — Pilot readiness và coverage theo mode (negative/fault)
    Given Một mode chưa được admitted hoặc thiếu mẫu số, target SLO và ngưỡng trước pilot
    When Thử dùng F1 synthetic/CI thành pilot PASS hoặc ký chung tất cả mode
    Then NO_GO_PENDING; không tự chọn threshold, không coi 8 chuyến fixture là vận hành thật
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

  @ac_19 @ev_05 @ev_06 @ev_10 @ev_11 @positive @not_run_product
  Scenario: S3-AC19-P — Pricing Decimal và partial return
    Given AC-19 oracle P/Q với VAT input synthetic 8/10 và discount10001; invoiceEligible=false
    When Tính exclusive/inclusive theo stableLineId; trả P1/3 sau khi đã thu đủ, refund được duyệt20000
    Then Exclusive net289999 VAT25134 gross315133; inclusive net290797 VAT25202 gross315999; credit49600 sau refund
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

  @ac_19 @ev_05 @ev_06 @ev_10 @ev_11 @negative @not_run_product
  Scenario: S3-AC19-N — Pricing Decimal và partial return (negative/fault)
    Given Thứ tự P/Q bị đổi, có partial return cùng nguồn hoặc adapter làm tròn lệch
    When Thử tính bằng float, double-apply VAT, duplicate refund, hoặc thay nguồn lineId
    Then Giữ line-stable rounding, không trùng, không xuất hóa đơn thật từ VAT fixture
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

  @ac_20 @ev_06 @positive @not_run_product
  Scenario: S3-AC20-P — Advance settlement nhiều lần
    Given Advance A1 phát 500000, expense duyệt300000; sổ Customer đứng riêng
    When Offer hoàn200000 rồi cashier accept100000 hai lần
    Then Outstanding 500000→200000→200000→100000→0, không thay AR/custody khách
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

  @ac_20 @ev_06 @negative @not_run_product
  Scenario: S3-AC20-N — Advance settlement nhiều lần (negative/fault)
    Given Chưa có cashier acceptance hoặc expense/return vượt outstanding
    When Thử offer trừ nợ, self-accept, duplicate receipt và âm outstanding
    Then Offer không làm thay sổ; âm/self-accept/duplicate bị chặn
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

  @ac_21 @ev_06 @positive @not_run_product
  Scenario: S3-AC21-P — Receipt allocation và CustomerCredit
    Given AR140000 hai items, receipt R1 cash60000 verified, custody ban đầu0
    When Allocate20000 rồi15000, offer handover50000, cashier accept50000
    Then AR105000, credit25000, custody10000, quỹ50000; từng event không âm
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

  @ac_21 @ev_06 @negative @not_run_product
  Scenario: S3-AC21-N — Receipt allocation và CustomerCredit (negative/fault)
    Given Receipt từ ngân hàng đang pending hoặc hai allocation tranh cùng credit25k
    When Thử apply bank pending, refund trước actual payout hoặc dùng credit vượt dư
    Then Không giảm AR/premature refund, không âm credit, replay idempotent
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

