#!/usr/bin/env python3
"""R010 S1 structural lint only. This is NOT a product, legal, provider or pilot test."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
R009 = HERE.parent / "2026-11-13-09-mvp-specification-baseline"
DOCS = {
    "scope": HERE / "product-scope-and-personas.vi.md",
    "sop": HERE / "sop-a-b-mixed.vi.md",
    "roles": HERE / "role-and-approval-matrix.vi.md",
    "policy": HERE / "product-policy-catalog.vi.md",
    "profile": HERE / "tenant-profile-schema.vi.md",
    "adr": HERE / "product-adrs.vi.md",
    "trace": HERE / "s1-traceability.vi.md",
    "report": HERE / "report.vi.md",
    "source_d": R009 / "decision-register-and-adr.vi.md",
    "source_br": R009 / "business-rules.vi.md",
    "source_dc": R009 / "glossary-and-data-contracts.vi.md",
    "source_api": R009 / "api-and-state-machines.vi.md",
    "source_ac": R009 / "acceptance-tests-and-evidence.vi.md",
}
ISSUES: list[str] = []


def ids(pattern: str, content: str) -> set[str]:
    return set(re.findall(pattern, content, flags=re.MULTILINE))


def expect(condition: bool, reason: str) -> None:
    if not condition:
        ISSUES.append(reason)


def read_file(path: Path) -> str:
    if not path.is_file():
        ISSUES.append(f"Missing file: {path}")
        return ""
    data = path.read_bytes()
    expect(b"\r" not in data, f"CR found in {path}")
    expect(data.endswith(b"\n"), f"Missing trailing newline: {path}")
    return data.decode("utf-8")


texts = {key: read_file(path) for key, path in DOCS.items()}
decision_ids = ids(r"^\| (D-\d{2}) \|", texts["source_d"])
business_ids = ids(r"^\| (BR-\d{2}) \|", texts["source_br"])
dc_ids = ids(r"^\| (DC-\d{2}) \|", texts["source_dc"])
api_ids = ids(r"^\| (API-\d{2}) \|", texts["source_api"])
sm_ids = ids(r"^\| (SM-\d{2}) \(", texts["source_api"])
ac_ids = ids(r"^\| (AC-\d{2}) —", texts["source_ac"])
ev_ids = ids(r"^\| (EV-\d{2}) \|", texts["source_ac"])

sop_ids = ids(r"^## (SOP-\d{2}) —", texts["sop"])
padr_ids = ids(r"^## (PADR-\d{2}) —", texts["adr"])
policy_rows = re.findall(r"^\| (POL-\d{2}) \| (BR-\d{2}) \|", texts["policy"], re.MULTILINE)
trace_br_rows = re.findall(r"^\| (BR-\d{2}) \| (POL-\d{2}) \|([^\n]+)", texts["trace"], re.MULTILINE)
trace_d_rows = re.findall(r"^\| (D-\d{2}) \|([^\n]+)", texts["trace"], re.MULTILINE)
expected_sop = {f"SOP-{i:02d}" for i in range(1, 13)}
expected_padr = {f"PADR-{i:02d}" for i in range(1, 10)}
expected_pol = {f"POL-{i:02d}" for i in range(1, 25)}

expect(len(decision_ids) == 15, f"Expected R009 15 decisions, got {len(decision_ids)}")
expect(len(business_ids) == 24, f"Expected R009 24 BR, got {len(business_ids)}")
expect(sop_ids == expected_sop, f"SOP mismatch: missing {expected_sop-sop_ids}, extra {sop_ids-expected_sop}")
expect(padr_ids == expected_padr, f"PADR mismatch: missing {expected_padr-padr_ids}")
expect(len(policy_rows) == 24, f"Expected 24 policy rows, got {len(policy_rows)}")
expect({r[0] for r in policy_rows} == expected_pol, "POL-01..24 not all defined")
expect({r[1] for r in policy_rows} == business_ids, "POL->BR coverage mismatch")
expect(all(pol[4:] == br[3:] for pol, br in policy_rows), "POL must match BR index 1-to-1")
expect(len(trace_br_rows) == 24, f"Expected 24 trace BR rows, got {len(trace_br_rows)}")
expect({r[0] for r in trace_br_rows} == business_ids, "Trace misses R009 BR")
expect({r[1] for r in trace_br_rows} == expected_pol, "Trace misses S1 POL")
expect(len(trace_d_rows) == 15, f"Expected 15 trace D rows, got {len(trace_d_rows)}")
expect({r[0] for r in trace_d_rows} == decision_ids, "Trace misses R009 D")

used_sop: set[str] = set()
used_padr: set[str] = set()
for br, pol, tail in trace_br_rows:
    expect(pol[4:] == br[3:], f"{br} maps wrong policy: {pol}")
    refs = {
        "SOP": ids(r"SOP-\d{2}", tail),
        "DC": ids(r"DC-\d{2}", tail),
        "API": ids(r"API-\d{2}", tail),
        "SM": ids(r"SM-\d{2}", tail),
        "AC": ids(r"AC-\d{2}", tail),
        "EV": ids(r"EV-\d{2}", tail),
    }
    # The tail begins with SOP, then DC, API/SM and AC/EV columns.
    for kind, found in refs.items():
        expect(bool(found), f"{br}: missing {kind} reference")
    for kind, found, known in [
        ("SOP", refs["SOP"], sop_ids), ("DC", refs["DC"], dc_ids),
        ("API", refs["API"], api_ids), ("SM", refs["SM"], sm_ids),
        ("AC", refs["AC"], ac_ids), ("EV", refs["EV"], ev_ids),
    ]:
        expect(found <= known, f"{br}: unknown {kind} IDs {found-known}")
    used_sop |= refs["SOP"]

for dec, tail in trace_d_rows:
    refs = ids(r"POL-\d{2}", tail)
    sop = ids(r"SOP-\d{2}", tail)
    padr = ids(r"PADR-\d{2}", tail)
    expect(bool(refs) and refs <= expected_pol, f"{dec}: policy refs invalid")
    expect(bool(sop) and sop <= sop_ids, f"{dec}: SOP refs invalid")
    expect(bool(padr) and padr <= padr_ids, f"{dec}: PADR refs invalid")
    used_padr |= padr
expect(used_sop == sop_ids, f"Some SOP not traced: {sop_ids-used_sop}")
expect(used_padr == padr_ids, f"Some PADR not traced to D: {padr_ids-used_padr}")

# Local paths only; fragments/anchors do not determine file existence.
for key in ("scope", "sop", "roles", "policy", "profile", "adr", "trace"):
    here = DOCS[key]
    for target in re.findall(r"\[[^]]+\]\(([^)]+)\)", texts[key]):
        path = target.split("#")[0]
        if not path or "://" in path or path.startswith(("mailto:", "#")):
            continue
        expect((here.parent / path).resolve().is_file(), f"{here.name}: broken local link {target}")

schema_path = HERE / "tenant-profile.schema.json"
example_path = HERE / "tenant-profile.example.json"
for path in (schema_path, example_path):
    expect(path.is_file(), f"Missing {path.name}")

if schema_path.is_file() and example_path.is_file():
    schema = json.loads(schema_path.read_text(encoding="utf-8"))
    example = json.loads(example_path.read_text(encoding="utf-8"))
    expect(schema.get("$schema") == "https://json-schema.org/draft/2020-12/schema",
           "Schema draft should be 2020-12")
    expect(schema.get("additionalProperties") is False, "Root schema must reject extra props")
    expect(set(schema["required"]) <= set(example), "Example missing required root properties")
    expect(example["lifecycle"] == "DRAFT", "Synthetic example must stay DRAFT")
    expect(example["provenance"] == "SYNTHETIC_FIXTURE", "Example provenance unsafe")
    expect(example["legalSeller"]["sellerProfileRef"] is None, "Example must not invent sellerRef")
    expect(example["invoice"]["noChannelBPolicy"] == "BLOCKED", "B no-channel not blocked")
    expect(not example["offline"]["requested"], "Offline example unexpectedly activated")
    try:
        from jsonschema import Draft202012Validator
    except ImportError:
        print("JSON_SCHEMA_VALIDATION_NOT_RUN: install optional package jsonschema to check schema/instance")
    else:
        try:
            Draft202012Validator.check_schema(schema)
            validator = Draft202012Validator(schema)
            validator.validate(example)
            # Owner PADR-02: an explicit approved zero has a different meaning from UNSET.
            from copy import deepcopy
            approved_zero = deepcopy(example)
            approved_zero["customerPolicy"] = {
                "creditPolicyStatus": "APPROVED",
                "defaultPaymentTermsDays": 0,
                "defaultCreditLimitVnd": 0,
                "creditApprovalPolicyRef": "SYNTHETIC-REF-NOT-REAL-APPROVAL",
            }
            validator.validate(approved_zero)  # schema only; NOT Finance sign-off
            def must_fail(instance: dict, reason: str) -> None:
                if validator.is_valid(instance):
                    raise AssertionError("Schema allowed unsafe credit/offline state: " + reason)
            invalid_unset_zero = deepcopy(example)
            invalid_unset_zero["customerPolicy"]["defaultCreditLimitVnd"] = 0
            must_fail(invalid_unset_zero, "UNSET with silently approved zero")
            invalid_approved_missing_signature = deepcopy(approved_zero)
            invalid_approved_missing_signature["customerPolicy"]["creditApprovalPolicyRef"] = None
            must_fail(invalid_approved_missing_signature, "APPROVED without reference")
            invalid_approved_missing_terms = deepcopy(approved_zero)
            invalid_approved_missing_terms["customerPolicy"]["defaultPaymentTermsDays"] = None
            must_fail(invalid_approved_missing_terms, "APPROVED without terms")
            invalid_offline_without_ttl = deepcopy(example)
            invalid_offline_without_ttl["offline"]["requested"] = True
            invalid_offline_without_ttl["offline"]["requestedModes"] = ["A"]
            must_fail(invalid_offline_without_ttl, "Offline enabled without TTL/cap")
            print("PASS_SCHEMA_NEGATIVE_OWNER_POLICY 4; approved zero SYNTHETIC_ONLY")
            print("JSON_SCHEMA_VALIDATED: Draft 2020-12 schema and synthetic example")
        except Exception as exc:
            ISSUES.append(f"JSON Schema validation failed: {exc}")

if ISSUES:
    for issue in ISSUES:
        print("FAIL:", issue, file=sys.stderr)
    sys.exit(1)
print(f"PASS S1_DOC_STRUCTURE: D={len(decision_ids)}, BR={len(business_ids)}, POL={len(policy_rows)}, SOP={len(sop_ids)}, PADR={len(padr_ids)}, BR_TRACE={len(trace_br_rows)}")
print("NOT_CHECKED: product code, PWA/API/SQL, devices, provider, legal facts, NPP evidence, Go-Live")
