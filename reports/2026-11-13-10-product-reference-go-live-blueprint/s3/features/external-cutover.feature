# S3 CONTRACT ONLY — Gherkin outline; NO STEP DEFINITIONS/REAL E2E RESULT.
# Backend/PWA/SQL/provider bindings and environment testRunIds are required in S6.
Feature: Invoice, accounting and full-warehouse cutover
  Các kịch bản dưới đây là expected behavior, không phải bằng chứng hệ thống đã chạy.

  @ac_14 @ev_10 @positive @not_run_product
  Scenario: S3-AC14-P — Hóa đơn delivery A và B_ONLINE
    Given Seller/profile/provider và kênh A hoặc B_ONLINE đã qua gate môi trường thử
    When A giao 60+40 từng delivery, B bán/thu, provider timeout UNKNOWN
    Then Invoice intent gắn delivery thực, lookup cùng external ref, không duplicate
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

  @ac_14 @ev_10 @negative @not_run_product
  Scenario: S3-AC14-N — Hóa đơn delivery A và B_ONLINE (negative/fault)
    Given B mất cả PWA và kênh hóa đơn hợp lệ; B-CASE/LEGAL-MEMO/INV-09 pending
    When Thử chuyển B_NO_CHANNEL thành allowed hoặc backdate sau giao thật
    Then BLOCKED theo EVQ-05; physical event nếu xảy ra phải giữ case, không giả PASS
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

  @ac_15 @ev_11 @positive @not_run_product
  Scenario: S3-AC15-P — Outbox accounting đối soát theo source
    Given Ba event có source ID/hash và mapping version; adapter API FILE hoặc MANUAL_REGISTER kiểm soát
    When Gửi lặp, webhook mất, lookup status RECEIVED POSTED rồi đối soát từng line
    Then Effect không trùng; POSTED khác RECONCILED_OK; lệch số thành RECONCILED_DIFF
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

  @ac_15 @ev_11 @negative @not_run_product
  Scenario: S3-AC15-N — Outbox accounting đối soát theo source (negative/fault)
    Given Adapter báo POSTED với net/VAT/gross sai hoặc import thủ công thiếu source
    When Thử tự đánh dấu RECONCILED_OK chỉ dựa vào POSTED
    Then Không pass reconciliation; cần correction ID mới và Finance review
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

  @ac_16 @ev_04 @ev_12 @positive @not_run_product
  Scenario: S3-AC16-P — Cutover opening và Forward Recovery
    Given Có manifest mở sổ kho xe AR custody advance, invoice ngoài, unsynced journal và chữ ký
    When Freeze preview import once, khóa legacy toàn kho, nhận late legacy sau first effect
    Then Opening cân và signed; sau first effect chỉ source correction forward
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

  @ac_16 @ev_04 @ev_12 @negative @not_run_product
  Scenario: S3-AC16-N — Cutover opening và Forward Recovery (negative/fault)
    Given Late legacy event tới sau khi MVP đã tạo effect đầu tiên
    When Thử rollback DB về snapshot hoặc replay source cũ như bán mới
    Then Chặn rollback và duplicate, tạo forward adjustment/case có owner
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

