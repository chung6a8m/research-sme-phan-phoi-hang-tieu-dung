#!/usr/bin/env python3
"""Draft 2020-12 evidence record schema negative cases: synthetic only."""
import copy
import json
from pathlib import Path
from jsonschema import Draft202012Validator

base = Path(__file__).resolve().parent
schema = json.loads((base / "evidence-run.schema.json").read_text(encoding="utf-8"))
sample = json.loads((base / "evidence-run.example.json").read_text(encoding="utf-8"))
Draft202012Validator.check_schema(schema)
validator = Draft202012Validator(schema)
assert not list(validator.iter_errors(sample)), "NOT_RUN sample must be schema valid"

changes = {
  "fake_placeholder_success": lambda d: d.update(executionStatus="EXECUTED_UNREVIEWED"),
  "fake_placeholder_actual": lambda d: d.update(actual="PASSED"),
  "fake_placeholder_artifact": lambda d: d["artifacts"].append({"kind":"log","uri":"https://invalid.example/test","sha256":"0"*64,"classification":"REDACTED"}),
  "missing_source": lambda d: d.pop("scenarioId"),
  "fake_go": lambda d: d.update(executionStatus="TENANT_GO_LIVE_ACCEPTED"),
  "fake_real_run": lambda d: d.update(runKind="REAL_SYSTEM",executionStatus="EXECUTED_UNREVIEWED"),
  "unexpected_approved_field": lambda d: d.update(ownerSigned=True),
  "bad_ac": lambda d: d.update(acId="AC-22"),
  "bad_ev": lambda d: d.update(evIds=["EV-16"]),
  "duplicate_ev": lambda d: d.update(evIds=["EV-03","EV-03"])
}
for name, mutate in changes.items():
    d=copy.deepcopy(sample)
    mutate(d)
    assert list(validator.iter_errors(d)), f"Unsafe record accepted: {name}"
print(f"PASS_S3_SCHEMA_DRAFT202012_NEGATIVES {len(changes)} CONTRACT_ONLY")

