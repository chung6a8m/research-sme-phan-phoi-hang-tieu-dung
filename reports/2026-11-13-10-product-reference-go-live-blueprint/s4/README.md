# S4 — Operations P06/P08: hồ sơ vận hành, cutover và preflight

**Phiên bản:** `s4-v1` · **13/11/2026** · **Trạng thái:** `OPERATIONS_CONTRACT_PREPARED / NOT_EXECUTED`. S4 là **bản thiết kế/handoff** để đội NPP, Product, IT, Finance và Legal sử dụng khi triển khai; **không** phải biên bản kiểm chứng NPP thật, không thay quyết định Owner, không tự mở production.

## 1. Các artifact

| Gói | Tài liệu | Giá trị bàn giao |
|---|---|---|
| P06 | [Tenant onboarding & cutover](tenant-onboarding-and-cutover.vi.md) | Chuỗi C0–C8, freeze/opening, writer lock toàn Kho-01, first effect, abort/forward recovery, mode-specific handoff |
| P06 | [Backup, restore & forward recovery](backup-restore-and-recovery.vi.md) | Backup/DR rehearsal, authority ngoài rollback, device journal, external registry, điều kiện reopen |
| P06 | [Monitoring, incident & hypercare](monitoring-incident-hypercare.vi.md) | Tín hiệu, P0/P1 triage, case/owner, incident timeline, daily close và pilot observation |
| P06 | [RACI, training và mẫu ký](raci-training-signoff.vi.md) | Maker–checker, roster/đào tạo, phê duyệt AP-08/09/10, EV-14/15, hồ sơ sự kiện |
| P08 | [Seller/provider/legal/accounting/privacy preflight](preflight-seller-provider-accounting-privacy.vi.md) | Các điều kiện doanh nghiệp/pháp lý/chứng từ/đối tác trước khi cho phép A, B_ONLINE, MIXED, restore và xử lý dữ liệu |
| P06+P08 | [operational-controls.json](operational-controls.json) | Danh sách kiểm soát OPS-01..30, severity/role/evidence/AC/EV/gate/mode; tất cả chưa đánh giá |
| P06+P08 | [tenant-operations-dossier.schema.json](tenant-operations-dossier.schema.json), [example](tenant-operations-dossier.example.json) | Contract hồ sơ **nháp không có quyết định GO**; evidence/chữ ký được chứng minh độc lập |
| QA | [s4-validate.mjs](s4-validate.mjs), [s4-regression.mjs](s4-regression.mjs), [s4-dossier-schema-test.py](s4-dossier-schema-test.py) | Trace/bất biến/negative checks, không phải chạy E2E |
 
Nguồn: [SOP-01/03/04/05/09/10/11/12](../sop-a-b-mixed.vi.md), [RACI/AP-01..10](../role-and-approval-matrix.vi.md), [EVQ](../evq-acceptance-gates.vi.md), [S2 templates T01..T14](../s2/README.md), [S3 AC/EV/modes/faults](../s3/README.md), R009 D-01..15 và AC-01..21.

## 2. Ranh giới và trình tự không được đánh đồng

`OWNER_DECIDED_IN_CHAT ≠ DOC_READY ≠ PRODUCT_VERIFIED ≠ TENANT_GO_LIVE_ACCEPTED`. S4 chỉ giúp chuẩn bị `DOC_READY`; gate sản phẩm đòi build/step bindings/testRunId thật, gate tenant đòi người ký và hồ sơ riêng. JSON/CSV, CI hoặc checklist không có khả năng phát hành `GO`.

- MVP: A, B_ONLINE, MIXED A+B_ONLINE (**MIXED phụ thuộc A và B_ONLINE + E2E riêng**). OFFLINE_WRITE chỉ theo thiết bị/mode/chuyến đã đạt EV-08/09; mặc định DISABLED. `B_NO_CHANNEL` BLOCKED; nhánh B sử dụng kênh thay thế khi PWA mất mạng DEFERRED.
- P0 `G-STOCK/G-CUT/G-IDEMP/G-LEDGER/G-INV` **không miễn trừ**. Writer cũ phải khóa mọi đường vào **toàn Kho-01** dù pilot chỉ 8 chuyến/ngày; first production effect là ranh giới không rollback nghiệp vụ.
- EV-01..15 giữ `EVIDENCE_PENDING` ở mức runtime; EV-05..09 có `MODEL_ONLY` lịch sử. B-CASE-001/002/003 và LEGAL-MEMO `EVIDENCE_PENDING`, INV-09 `NOT_RUN`. Không tự giả chữ ký, RPO/RTO, SLO, thời hạn lưu dữ liệu, chính sách thuế hoặc nguồn API đã xác thực.
- EV-14 (readiness **trước pilot**) khác EV-15 (kết quả **sau pilot**). NPP-01 D-15: 3A+3B_ONLINE+2MIXED/ngày × ≥5 ngày đại diện chỉ khi từng mode admitted; tenant khác có Pilot Profile độc lập.

## 3. Cách chạy kiểm tra tài liệu

Trên checkout có Node.js 22 và Python 3.12:

```sh
S4=reports/2026-11-13-10-product-reference-go-live-blueprint/s4
node "$S4/s4-validate.mjs"
node "$S4/s4-regression.mjs"
python -m pip install 'jsonschema>=4.20,<5'
python "$S4/s4-dossier-schema-test.py"
```

Tất cả chỉ là `S4_CONTRACT_VALIDATED_NOT_OPERATIONAL_EVIDENCE`. Hãy chạy drill trên môi trường cô lập có authorization, sao lưu và kế hoạch dừng riêng ở S6, rồi nộp evidence theo [S3 evidence-run.schema.json](../s3/evidence-run.schema.json) và hồ sơ tenant có chữ ký.

## 4. Handoff

S5 dùng dossier/gap-control theo tenant để xác định người ký, source thực, ngưỡng còn UNSET và scope. S6 gắn workflow thật, thu artifact có hash/testRunId/SHA build, chạy negative tests F-01..22, cutover rehearsal rồi mới xin Product Verification và Tenant Go-Live Acceptance. Không đọc `tenant-operations-dossier.example.json` như dữ liệu NPP-01.

## 5. Evidence CI structural — không phải nghiệm thu thật

[GitHub Actions run 43399848506](https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/actions/runs/43399848506) **SUCCESS** trên `8a7049a0`: 30 OPS controls (22 P06/8 P08), 15 EV, 5 gate P0, **20 negative regression**, **17 JSON Schema negatives**. Báo cáo chi tiết [validation-results.vi.md](validation-results.vi.md). `realOperationalDrills:0`, `tenantSignoffs:0`; các giá trị GO/verification không thay đổi.
