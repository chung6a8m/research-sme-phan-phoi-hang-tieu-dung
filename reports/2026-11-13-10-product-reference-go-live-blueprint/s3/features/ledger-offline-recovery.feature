# S3 CONTRACT ONLY — Gherkin outline; NO STEP DEFINITIONS/REAL E2E RESULT.
# Backend/PWA/SQL/provider bindings and environment testRunIds are required in S6.
Feature: Sale/grant, three ledgers, journal, writer, restore
  Các kịch bản dưới đây là expected behavior, không phải bằng chứng hệ thống đã chạy.

  @ac_09 @ev_06 @ev_08 @positive @not_run_product
  Scenario: S3-AC09-P — SaleDeliveryReceipt atomic và grant
    Given Grant 100 và stock đủ; receipt được xác minh; B_ONLINE có kênh invoice hợp lệ
    When Đăng sale100 R60 hoặc R60+C20 trong compound transaction
    Then R60 tạo AR40/custody60/grant60; R60+C20 tạo AR20/grant80; cùng command replay một effect
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

  @ac_09 @ev_06 @ev_08 @negative @not_run_product
  Scenario: S3-AC09-N — SaleDeliveryReceipt atomic và grant (negative/fault)
    Given Hai command khác ID cùng dùng grant100 để ghi P80 khi không thu
    When Chạy đồng thời 2 command, crash trước commit và thử replay ACK mất
    Then Chỉ một command commit, remaining20; không hai AR80 hoặc stock âm
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

  @ac_10 @ev_06 @ev_12 @positive @not_run_product
  Scenario: S3-AC10-P — Ba sổ và cashier handover
    Given AR140000 và custody60000 từ receipt cũ đã apply; advance ở sổ khác
    When Allocate thêm20000, handover offer50000, rồi cashier khác người accept
    Then AR120000; custody80000 trước accept và 30000 sau, fund +50000; advance không tự đổi
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

  @ac_10 @ev_06 @ev_12 @negative @not_run_product
  Scenario: S3-AC10-N — Ba sổ và cashier handover (negative/fault)
    Given Chỉ có offer hoặc người giao tiền tự bấm accept
    When Thử giảm custody và tự ký handover trong cùng vai
    Then Không giảm custody khi chưa có cashier acceptance độc lập
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

  @ac_11 @ev_08 @positive @not_run_product
  Scenario: S3-AC11-P — Durable ACK và dependency inbox
    Given Online scope EV-08/ONLINE_IDEMPOTENCY có durable inbox C phụ thuộc P, không cấp offline device grant
    When Server nhận C trước P, restart, nhận P rồi replay C cùng ID/hash ở online scope
    Then awaiting_dependency có durable owner; ACK sau commit; một effect đúng dependency và không tự bật OFFLINE_WRITE
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

  @ac_11 @ev_08 @negative @not_run_product
  Scenario: S3-AC11-N — Durable ACK và dependency inbox (negative/fault)
    Given Client mất ACK sau server commit hoặc gửi cùng ID khác payload
    When Retry cũ và phát lại ID với hash mới; tạo vòng dependency
    Then Replay đúng hash không double-post, khác hash trả 409, cycle vào case
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

  @ac_12 @ev_08 @ev_09 @positive @not_run_product
  Scenario: S3-AC12-P — Một writer trip và occurred event
    Given Trip có writerInstallation duy nhất, grant có TTL, có nguồn biên bản sự kiện đã xảy ra
    When Offline giao thực tế trước khi grant hết hạn, về mạng muộn và trình source giấy
    Then Intent mới bị từ chối nhưng occurred event vào durable case/custody đối soát
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

  @ac_12 @ev_08 @ev_09 @negative @not_run_product
  Scenario: S3-AC12-N — Một writer trip và occurred event (negative/fault)
    Given Second writer hoặc quyền đã revoked trên một thiết bị mất đồng bộ
    When Thử cấp writer thứ hai hoặc commit giao vượt TTL mà không ghi ngoại lệ
    Then Không cấp quyền song song; không bỏ mất physical event hay tự post effect
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

  @ac_13 @ev_09 @ev_10 @positive @not_run_product
  Scenario: S3-AC13-P — Restore không hồi sinh authority hoặc invoice
    Given Authority đã revoke, PrivacyActionLedger và provider invoice effect nằm ngoài TenantDB snapshot
    When Restore DB cũ rồi reconcile authority, registry, invoice lookup, generation
    Then Revoke/privacy còn hiệu lực, không invoice lại, tenant không mở trước reconciliation
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

  @ac_13 @ev_09 @ev_10 @negative @not_run_product
  Scenario: S3-AC13-N — Restore không hồi sinh authority hoặc invoice (negative/fault)
    Given TenantDB snapshot được chụp trước revoke và invoice phát hành
    When Restore rồi thử login/replay outbox trước recovery gate
    Then Denied/held, external effect tra cùng reference, không bịa reissue
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

