#!/usr/bin/env python3
"""Kiểm tra cấu trúc truy vết R009, không phải test ứng dụng hay nghiệm thu nghiệp vụ.

Chạy từ repo root:
    python reports/2026-11-13-09-mvp-specification-baseline/kiem-tra-truy-vet.py
"""

from collections import Counter
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parent

FILE_BY_TYPE = {
    "D": "decision-register-and-adr.vi.md",
    "BR": "business-rules.vi.md",
    "DC": "glossary-and-data-contracts.vi.md",
    "API": "api-and-state-machines.vi.md",
    "SM": "api-and-state-machines.vi.md",
    "AC": "acceptance-tests-and-evidence.vi.md",
    "EV": "acceptance-tests-and-evidence.vi.md",
}
DECLARATION_REGEX = {
    "D": r"^\|\s*(D-\d{2})\s*\|",
    "BR": r"^\|\s*(BR-\d{2})\s*\|",
    "DC": r"^\|\s*(DC-\d{2})\s*\|",
    "API": r"^\|\s*(API-\d{2})\s*\|",
    "SM": r"^\|\s*(SM-\d{2})\s+\(",
    "AC": r"^\|\s*(AC-\d{2})\s+—",
    "EV": r"^\|\s*(EV-\d{2})\s*\|",
}

class TraceError(Exception):
    pass


def require(condition: bool, reason: str) -> None:
    if not condition:
        raise TraceError(reason)


def read(name: str) -> str:
    return (ROOT / name).read_text(encoding="utf-8")


def split_cells(line: str) -> list[str]:
    require(line.startswith("|") and line.endswith("|"), f"Hàng bảng không hợp lệ: {line[:100]}")
    # Chỉ | chưa escape là dấu ngăn cột, không cắt các enum \| trong code span.
    protected = re.sub(r"\\\|", "\uFFF0", line)
    return [cell.strip().replace("\uFFF0", "|") for cell in protected[1:-1].split("|")]


def ids(cell: str, allowed: tuple[str, ...], location: str) -> list[str]:
    tokens = [value.strip() for value in cell.split(",")]
    require(tokens and all(tokens), f"{location}: ID trống")
    require(len(tokens) == len(set(tokens)), f"{location}: ID lặp: {tokens}")
    for token in tokens:
        require(re.fullmatch(r"(?:D|BR|DC|API|SM|AC|EV)-\d{2}", token) is not None,
                f"{location}: ID thiếu tiền tố/viết tắt: {token!r}")
        require(token.split("-")[0] in allowed,
                f"{location}: sai loại ID: {token!r}, mong đợi {allowed}")
    return tokens


def declaration_sets() -> dict[str, set[str]]:
    declared: dict[str, set[str]] = {}
    for kind, name in FILE_BY_TYPE.items():
        content = read(name)
        if kind == "D":
            # Bảng sourceRef phía sau lặp D-xx để truy vết; không phải khai báo mới.
            content = content.split("## 1. Decision Register", 1)[1].split("### 1.1.", 1)[0]
        matches = re.findall(DECLARATION_REGEX[kind], content, flags=re.MULTILINE)
        duplicates = [key for key, count in Counter(matches).items() if count > 1]
        require(not duplicates, f"{kind}: khai báo trùng {duplicates}")
        require(bool(matches), f"{kind}: không có khai báo")
        declared[kind] = set(matches)
    return declared


def acceptance_assertions() -> tuple[dict[str, set[str]], dict[str, set[str]]]:
    acceptance = read("acceptance-tests-and-evidence.vi.md")
    direct = acceptance.split("### 1.3. AC → BR được assert trực tiếp", 1)
    require(len(direct) == 2, "Thiếu ma trận assertion AC→BR")
    direct = direct[1].split("### 1.4.", 1)[0]

    ac_to_br: dict[str, set[str]] = {}
    for line in direct.splitlines():
        if not re.match(r"^\|\s*AC-\d{2}\s*\|", line):
            continue
        columns = split_cells(line)
        require(len(columns) == 3, f"Ma trận AC→BR sai cột: {line}")
        ac = ids(columns[0], ("AC",), "Assertion AC")[0]
        require(ac not in ac_to_br, f"AC→BR lặp: {ac}")
        ac_to_br[ac] = set(ids(columns[1], ("BR",), f"{ac} BR"))
        require(bool(columns[2]), f"{ac} thiếu assertion")
    require(ac_to_br, "Không có assertion AC→BR")

    ac_to_ev: dict[str, set[str]] = {}
    table = acceptance.split("| AC | Given", 1)
    require(len(table) == 2, "Thiếu bảng acceptance chính")
    table = table[1].split("### 1.1.", 1)[0]
    for line in table.splitlines():
        if not re.match(r"^\|\s*AC-\d{2}\s+—", line):
            continue
        columns = split_cells(line)
        require(len(columns) == 5, f"AC bảng chính sai số cột: {line[:120]}")
        match = re.match(r"^(AC-\d{2})\s+—", columns[0])
        require(match is not None, f"AC có tên sai chuẩn: {columns[0]}")
        ac = match.group(1)
        require(ac not in ac_to_ev, f"AC lặp trong bảng chính: {ac}")
        require(all(columns[1:4]), f"{ac} thiếu Given/When/Then")
        ac_to_ev[ac] = set(ids(columns[4], ("EV",), f"{ac} EV"))
    return ac_to_br, ac_to_ev


def check() -> None:
    declared = declaration_sets()
    trace = read("traceability.vi.md")
    section = trace.split("| Decision | Business Rule |", 1)
    require(len(section) == 2, "Không tìm thấy bảng trace")
    section = section[1].split("## 1. Ma trận giới hạn", 1)[0]
    row_lines = [line for line in section.splitlines() if re.match(r"^\|\s*D-\d{2}\s*\|", line)]
    require(len(row_lines) == len(declared["D"]), "Số dòng trace không bằng số quyết định")

    row_columns = [("D",), ("BR",), ("DC",), ("API", "SM"), ("AC",), ("EV",)]
    used: dict[str, set[str]] = {kind: set() for kind in declared}
    ac_to_br, ac_to_ev = acceptance_assertions()
    require(set(ac_to_br) == declared["AC"],
            f"Thiếu/thừa AC assertion: {sorted(set(ac_to_br) ^ declared['AC'])}")
    require(set(ac_to_ev) == declared["AC"],
            f"Thiếu/thừa AC bảng chính: {sorted(set(ac_to_ev) ^ declared['AC'])}")

    for line in row_lines:
        cells = split_cells(line)
        require(len(cells) == 6, f"Bảng trace sai số cột: {line[:100]}")
        values = [
            ids(cell, allowed, f"trace {cells[0]}, cột {index + 1}")
            for index, (cell, allowed) in enumerate(zip(cells, row_columns))
        ]
        for tokens in values:
            for token in tokens:
                kind = token.split("-")[0]
                require(token in declared[kind], f"{cells[0]} tham chiếu ID không tồn tại: {token}")
                used[kind].add(token)

        decision = values[0][0]
        brs = set(values[1])
        acs = set(values[4])
        evs = set(values[5])
        for br in brs:
            require(any(br in ac_to_br[ac] for ac in acs),
                    f"{decision} liên kết {br} nhưng không có AC trực tiếp assert rule")
        for ac in acs:
            require(bool(ac_to_br[ac] & brs),
                    f"{decision} liên kết {ac} nhưng không assert BR nào trong cùng dòng")
            require(bool(ac_to_ev[ac] & evs),
                    f"{decision} liên kết {ac} nhưng không nêu EV nào của AC trong cùng dòng")

    for kind in declared:
        orphan = declared[kind] - used[kind]
        require(not orphan, f"{kind}: ID không nằm trong trace: {sorted(orphan)}")
    require(len(used["D"]) == len(row_lines), "D trùng trong các dòng trace")
    print("R009 TRACE STRUCTURE: PASS (tài liệu, không phải product verification)")
    print(", ".join(f"{kind}={len(declared[kind])}" for kind in FILE_BY_TYPE))
    print(f"trace rows={len(row_lines)}; all AC have explicit BR assertions and EV mapping")
    print("Status product/PWA/SQL/provider/pilot: NOT_RUN/EVIDENCE_PENDING")


if __name__ == "__main__":
    try:
        check()
    except (TraceError, OSError, UnicodeError) as err:
        print(f"R009 TRACE STRUCTURE: FAIL: {err}", file=sys.stderr)
        sys.exit(1)
