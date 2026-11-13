# S5/P07 — Tenant Adoption, Gap Assessment & Product Baseline v1 candidate

**Trạng thái:** `S5_CONTRACT_PREPARED / OWNER_BASELINE_ACCEPTANCE_PENDING` · 13/11/2026 · PR #2 · chỉ nghiên cứu/contract.

S5 dùng **Product-First**: L0 bất biến, L1 cấu hình hữu hạn, L2 cần ADR/AC/EV được review; NPP không tự fork lõi. Tài liệu này không tạo NPP data, chữ ký, trạng thái `DOC_READY_APPROVED` hay `PRODUCT_VERIFIED`.

| File | Mục đích |
|---|---|
| `archetypes.json` | 4 archetype giả thuyết phục vụ khảo sát, **không** là kết luận đã nghiên cứu thực địa |
| `questionnaire.json` và `questionnaire-responses.example.json` | 24 câu hỏi, ánh xạ POL/CFG-01..24, OPS-01..30, ví dụ hoàn toàn UNANSWERED |
| `gap-disposition-policy.json` | Quy tắc ADOPT_STANDARD / CONFIGURE_L1 / EXTENSION_CANDIDATE_L2 / BLOCKED |
| `tenant-adoption-profile.schema.json` và `.example.json` | Tình trạng đánh giá tenant, tham chiếu gap ID và hồ sơ S4, không có gate/signer |
| `product-pilot-contract.json` | Product Pilot Contract dùng chung: UX, EV-14 → EV-15, SLO, n/N, mode-level |
| `tenant-pilot-profile.schema.json` và `npp-01-pilot-blueprint.example.json` | Tenant Pilot Profile NPP-01 theo R009 D-15, **chỉ kế hoạch**, chưa có số liệu/thẩm quyền |
| `product-baseline-freeze.schema.json` và `product-baseline-freeze.candidate.json` | Snapshot manifest tài liệu S1–S5, 16 Owner decisions và các pending; chưa có Owner acceptance record |
| `gap-assessment-and-adoption.vi.md` | Phương pháp phỏng vấn, phân loại, trace và escalations |
| `baseline-freeze-and-s6-handoff.vi.md` | Checklist chốt baseline ứng viên và bàn giao development S6 |

**Nguồn gap thực** là `../s4/tenant-operations-dossier.schema.json` với `TENANT_DISCOVERY_GAP_NOT_GATE_APPROVAL`; `discoveryGaps[]` được lưu ở S4, không tạo bản sao song song. S5 `gapDecisions[]` chỉ tham chiếu `gapId` đó để đề xuất disposition.

**Không suy diễn:** requestedModes ≠ admittedModes; EV-14 trước Pilot ≠ EV-15 sau Pilot; Pilot của NPP-01 không thành template toàn ngành; P0 không waive; B_NO_CHANNEL luôn BLOCKED; offline A yêu cầu E2E riêng; toàn Kho-01 phải độc quyền ghi sau cutover.

Các ví dụ synthetic không được dùng làm dữ liệu NPP thật. S6 mới thực thi PWA/API/SQL/provider/accounting, kiểm thử thiết bị/offline/restore/cutover và xin Product Verification/Tenant Go-Live độc lập.

**Versioned freeze candidate:** `reviewedInputBlobs[]` khóa 14 blob nguồn R009/S1–S4, CI phát hiện drift. Manifest không khóa chính nó và không thay được `ownerAcceptance` thực; `baselineFreezeCommitSha` vẫn null cho tới quyết định phiên bản mới có căn cứ.
