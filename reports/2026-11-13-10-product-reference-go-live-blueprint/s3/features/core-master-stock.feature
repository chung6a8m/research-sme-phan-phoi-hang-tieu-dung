# S3 CONTRACT ONLY — Gherkin outline; NO STEP DEFINITIONS/REAL E2E RESULT.
# Backend/PWA/SQL/provider bindings and environment testRunIds are required in S6.
Feature: Tenant, Customer, Mixed, warehouse, cost, gift, due-date
  Các kịch bản dưới đây là expected behavior, không phải bằng chứng hệ thống đã chạy.

  @ac_01 @ev_01 @ev_09 @positive @not_run_product
  Scenario: S3-AC01-P — Tenant isolation và revoke
    Given Hai tenant có DB tách biệt, membership user chỉ hợp lệ ở tenant A
    When API/lookup/file đọc và ghi được gọi đúng tenant với authority hiện hành
    Then Không rò row hoặc file sang tenant B, có audit danh tính và nguồn
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

  @ac_01 @ev_01 @ev_09 @negative @not_run_product
  Scenario: S3-AC01-N — Tenant isolation và revoke (negative/fault)
    Given Snapshot tenant B cũ hơn thời điểm revoke một membership
    When Restore snapshot rồi thử dùng user đã bị revoke hoặc user A truy cập tenant B
    Then 403 hoặc denied, tenant giữ khóa cho tới khi đối chiếu authority ngoài DB
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

  @ac_02 @ev_02 @positive @not_run_product
  Scenario: S3-AC02-P — Customer không cần Outlet và ShipTo snapshot
    Given Customer C1 có 0 Outlet và địa chỉ giao S1 hợp lệ
    When Xác nhận A rồi giao hai lần, thay đổi master sau giao
    Then Customer vẫn chịu AR; ShipTo, giá và terms của mỗi delivery là snapshot
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

  @ac_02 @ev_02 @negative @not_run_product
  Scenario: S3-AC02-N — Customer không cần Outlet và ShipTo snapshot (negative/fault)
    Given Master Customer hoặc Outlet bị chỉnh sửa sau delivery
    When Thử cập nhật hồi tố debtor, ShipTo hoặc buộc sinh Outlet giả
    Then Snapshot chứng từ bất biến; không tạo Outlet giả và không đổi AR lịch sử
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

  @ac_03 @ev_03 @ev_04 @ev_06 @ev_07 @ev_08 @ev_11 @positive @not_run_product
  Scenario: S3-AC03-P — Mixed A+B cân từng mốc T0–T6
    Given MAIN 100 đơn vị cost 1000, A hold40, B quota30, xe nhận70; kênh B_ONLINE hợp lệ
    When Giao B20 thu200, giao A25, cashier accept200, trả xe A15+B10
    Then Từng mốc khớp S2 AC-03: MAIN55, TRIP0, COGS450, AR A375/B100, fund200, A hold15
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

  @ac_03 @ev_03 @ev_04 @ev_06 @ev_07 @ev_08 @ev_11 @negative @not_run_product
  Scenario: S3-AC03-N — Mixed A+B cân từng mốc T0–T6 (negative/fault)
    Given B quota còn 30 trước bán và có hai cạnh tranh trên cùng grant
    When Thử B31, hai lệnh B20 tranh quota, crash trước commit và mất ACK sau commit
    Then Rejection không đổi sổ; tối đa một effect, không âm quota, replay không sinh invoice/AR lần hai
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

  @ac_04 @ev_04 @ev_12 @positive @not_run_product
  Scenario: S3-AC04-P — Một writer kho toàn Kho-01
    Given Đã inventory/manifest toàn Kho-01 gồm off-wave; biết legacy UI API job import và máy offline
    When Đóng băng toàn bộ writer cũ rồi ghi receipt/adjustment/off-wave bằng MVP
    Then Chỉ MVP ghi được stock; mọi biến động off-wave có source và đối soát
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

  @ac_04 @ev_04 @ev_12 @negative @not_run_product
  Scenario: S3-AC04-N — Một writer kho toàn Kho-01 (negative/fault)
    Given Sau cutover một legacy path hoặc thiết bị offline vẫn có quyền write
    When Thử UI/API/job/import/replay legacy trên bất kỳ SKU và phạm vi off-wave
    Then Bất kỳ write thành công tạo P0 FAIL, không chấp nhận chỉ khóa 8 chuyến
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

  @ac_05 @ev_04 @ev_05 @positive @not_run_product
  Scenario: S3-AC05-P — UoM FEFO lot và quarantine
    Given SKU có thùng và lẻ conversion/step; hai lot khác hạn; delivery có source
    When Giao bằng FEFO rồi ghi nhận hàng trả qua custody và QA
    Then BaseQty/lot/expiry snapshot đúng; quarantine riêng, chỉ QA release mới tăng available
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

  @ac_05 @ev_04 @ev_05 @negative @not_run_product
  Scenario: S3-AC05-N — UoM FEFO lot và quarantine (negative/fault)
    Given Hàng trả đang giữ hộ chưa kiểm đếm hoặc lot đã hết hạn
    When Thử cho hàng vào available hoặc giảm AR trước khi nhận và duyệt trả
    Then Không đổi available hoặc AR; giữ source và case cho ngoại lệ
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

  @ac_06 @ev_07 @positive @not_run_product
  Scenario: S3-AC06-P — Moving average và kỳ kế toán khóa
    Given Cost source 6667 cho 2 đơn vị; kỳ đã khóa; chênh nguồn late cost tổng 6768
    When Trả một phần, điều chỉnh +50, hoàn chi phí còn lại theo source
    Then Hoàn 3334 + 50 + 3384 = 6768; không sửa kỳ cũ; bridge DMS vs period costing có source
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

  @ac_06 @ev_07 @negative @not_run_product
  Scenario: S3-AC06-N — Moving average và kỳ kế toán khóa (negative/fault)
    Given Kỳ cũ đã khóa và accounting báo khác phương pháp giá vốn
    When Thử ghi đè original delivery cost hoặc mutate kỳ quá khứ
    Then Chỉ correction có source/version và recon delta, không overwrite
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

  @ac_07 @ev_05 @positive @not_run_product
  Scenario: S3-AC07-P — Quà ròng và waiver được duyệt
    Given Net sale 20 mua được 2 quà; sau trả 11 mua và 2 quà rồi giao 11 mua
    When Recompute entitlement và ghi giao quà bù theo net delivered
    Then Trả đủ 2 quà thì cấp lại 2; waiver giữ quà có duyệt thì không cấp thêm
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

  @ac_07 @ev_05 @negative @not_run_product
  Scenario: S3-AC07-N — Quà ròng và waiver được duyệt (negative/fault)
    Given Đã giữ 2 quà chưa hoàn hoặc thiếu waiver approval
    When Thử cấp tiếp 2 quà, retry cùng source hoặc miễn thu hồi không người duyệt
    Then Chặn cấp trùng và không thay lịch sử quà khi thiếu approval
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

  @ac_08 @ev_06 @positive @not_run_product
  Scenario: S3-AC08-P — Hạn nợ theo delivery snapshot
    Given Order A chốt N=7, hai delivery 01/11 và 08/11, Customer master đổi N=14
    When Phát sinh hai AR open items và order mới sau đổi terms
    Then Due dates lần lượt 08/11, 15/11; order mới 22/11, đúng timezone
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

  @ac_08 @ev_06 @negative @not_run_product
  Scenario: S3-AC08-N — Hạn nợ theo delivery snapshot (negative/fault)
    Given Terms master thay đổi khi AR cũ chưa tất toán
    When Thử tính lại hạn cũ theo N=14 hoặc cấp nợ khi creditPolicy UNSET
    Then AR cũ không đổi; UNSET fail-closed và không đồng nghĩa approved-zero
    And phải lưu source IDs, before/after ledger, testRunId, fault marker và artifact hash khi E2E thật được chạy

