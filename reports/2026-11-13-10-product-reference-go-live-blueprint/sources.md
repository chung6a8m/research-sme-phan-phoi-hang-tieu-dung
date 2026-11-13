# R010-S — Nguồn và giới hạn

**Ngày:** 13/11/2026.

Đã đọc trực tiếp trên nhánh PR #1: R009 report, decision register, business rules, glossary/data contracts, API/state machines, acceptance/evidence, implementation/pilot plan, NPP-01 gap summary; R009 kế thừa R008. Đề bài lấy từ yêu cầu Owner ngày 13/11/2026.

R010 là **suy luận và đề xuất thiết kế** dựa trên R009, không phải số liệu khảo sát mới, phỏng vấn NPP khác, xác nhận nghiệp vụ NPP-01 hoặc kết luận pháp lý. Các default L0/L1/L2, mục tiêu S0–S6, P01–P08, catalog T01–T14 và quy mô F0/F1/F2 đều là phương án đề xuất cần review. Các con số oracle AC-03/19/20/21 kế thừa mẫu R009, không phải kết quả test triển khai.

Chưa kiểm chứng mức thuế hiện hành, API/khả năng vendor cụ thể, chưa thử PWA/SQL/browser/thiết bị, chưa có số dư NPP thật được phép dùng, cutover, ký xác nhận hay pilot. B-CASE/LEGAL-MEMO, EV-01–15 giữ trạng thái chưa chứng minh theo R009. Không tự đánh dấu PASS hoặc Go-Live cho bất kỳ nhánh/mode nào.

Mọi bản phát hành tiếp theo cần giữ nhãn riêng cho OWNER_DECIDED, PRODUCT_DEFAULT_PROPOSED, SYNTHETIC_FIXTURE, EVIDENCE_PENDING và chứng cứ được xác minh theo build/testRunId/evidenceRef/reviewer.

## Bổ sung S1/P01–P02 (13/11/2026)

Đã đối chiếu trực tiếp R009 Decision Register/ADR, BR-01–24, DC-01–18, API-01–12/SM-01–10, traceability, AC-01–21 và EV-01–15 để biên soạn SOP-01–12, POL-01–24, CFG-01–24, 9 Product ADR, logical tenant profile và trace R010-S1. **Không sử dụng phỏng vấn NPP mới hoặc nguồn bên ngoài để suy ra các default.** Cách tổ chức Product-First, threshold 0/0, thứ tự mode admission, bounded pricing, role/action mapping, tenant schema, trạng thái UI và ngưỡng preflight là **đề xuất thiết kế** của đợt mới, không phải kết luận phổ biến từ thị trường hay quyết định Owner đã ký.

Schema/example chỉ là `DESIGN_CANDIDATE` và `SYNTHETIC_FIXTURE`; thiếu seller profile, tax profile, provider thực là cố ý. Không dùng `tenant-profile.example.json` để phát hành hóa đơn/credit grant hoặc làm bằng chứng production. JSON Schema không tự kiểm được legal, role approval hay release admission.

Xem [S1 structural check](s1-validation-results.vi.md) để biết những gì đã kiểm và những gì **chưa chạy**. B-CASE/LEGAL-MEMO, EV-01–15, release/pilot và Owner acceptance theo R009 vẫn cần chứng cứ độc lập.
