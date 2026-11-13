# R010-S — Nguồn và giới hạn

**Ngày:** 13/11/2026.

Đã đọc trực tiếp trên nhánh PR #1: R009 report, decision register, business rules, glossary/data contracts, API/state machines, acceptance/evidence, implementation/pilot plan, NPP-01 gap summary; R009 kế thừa R008. Đề bài lấy từ yêu cầu Owner ngày 13/11/2026.

R010 là **suy luận và đề xuất thiết kế** dựa trên R009, không phải số liệu khảo sát mới, phỏng vấn NPP khác, xác nhận nghiệp vụ NPP-01 hoặc kết luận pháp lý. Các default L0/L1/L2, mục tiêu S0–S6, P01–P08, catalog T01–T14 và quy mô F0/F1/F2 đều là phương án đề xuất cần review. Các con số oracle AC-03/19/20/21 kế thừa mẫu R009, không phải kết quả test triển khai.

Chưa kiểm chứng mức thuế hiện hành, API/khả năng vendor cụ thể, chưa thử PWA/SQL/browser/thiết bị, chưa có số dư NPP thật được phép dùng, cutover, ký xác nhận hay pilot. B-CASE/LEGAL-MEMO, EV-01–15 giữ trạng thái chưa chứng minh theo R009. Không tự đánh dấu PASS hoặc Go-Live cho bất kỳ nhánh/mode nào.

Mọi bản phát hành tiếp theo cần giữ nhãn riêng cho OWNER_DECIDED, PRODUCT_DEFAULT_PROPOSED, SYNTHETIC_FIXTURE, EVIDENCE_PENDING và chứng cứ được xác minh theo build/testRunId/evidenceRef/reviewer.
