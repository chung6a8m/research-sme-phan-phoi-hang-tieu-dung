#!/usr/bin/env python3
"""Synthetic-only schema and cross-contract regression for S3 execution records."""
import copy
import json
from pathlib import Path
from jsonschema import Draft202012Validator

BASE = Path(__file__).resolve().parent
def load(name):
    return json.loads((BASE / name).read_text(encoding="utf-8"))
schema = load("evidence-run.schema.json")
sample = load("evidence-run.example.json")
acceptance = {x["acId"]: x for x in load("acceptance-matrix.json")["cases"]}
faults = {x["faultId"]: x for x in load("fault-injection-matrix.json")["faults"]}
Draft202012Validator.check_schema(schema)
validator = Draft202012Validator(schema)

def semantic_errors(record):
    """Reject references belonging to a different AC/mode/scenario/fault."""
    problems = []
    ac = acceptance.get(record.get("acId"))
    if ac is None:
        return ["unknown AC"]
    if record.get("scenarioId") not in ac["scenarioIds"]:
        problems.append("scenario is not assigned to AC")
    if not set(record.get("evIds", [])).issubset(set(ac["evidenceIds"])):
        problems.append("EVs are not assigned to AC")
    if record.get("mode") not in ac["modes"]:
        problems.append("mode is not assigned to AC")
    fixture = record.get("fixtureId")
    if fixture in ("F0", "F1", "F2") and fixture not in ac["fixtureRefs"]:
        problems.append("fixture not assigned to AC")
    if record.get("faultId") is not None:
        fault = faults.get(record["faultId"])
        if fault is None or record["acId"] not in fault["acIds"]:
            problems.append("fault not assigned to AC")
        elif not set(record["evIds"]).intersection(fault["evIds"]):
            problems.append("fault not related to EV")
    return problems

def valid(record):
    return not list(validator.iter_errors(record)) and not semantic_errors(record)

assert valid(sample), "placeholder"
blocker = copy.deepcopy(sample)
blocker.update(runKind="PRE_EXECUTION_BLOCKER", executionStatus="BLOCKED")
assert valid(blocker), "PRE_EXECUTION_BLOCKER before any runtime test"

def synthetic_real_record():
    record = copy.deepcopy(sample)
    record.update(
        runKind="REAL_SYSTEM", executionStatus="FAILED",
        testRunId="SYNTHETIC_NOT_A_REAL_TEST",
        startedAt="2000-01-01T00:00:00Z", endedAt="2000-01-01T00:00:01Z",
        actual="SYNTHETIC_ONLY: intentional failure for schema check"
    )
    record["runtime"].update(
        repository="synthetic/no-repository", commitSha="a" * 40,
        buildVersion="synthetic-only", environment="INTEGRATION"
    )
    record["artifacts"] = [
        {"kind":"log", "uri":"synthetic://contract-test-not-evidence",
         "sha256":"a"*64, "classification":"REDACTED"}
    ]
    record["review"]["state"] = "AWAITING_REVIEW"
    return record

failure = synthetic_real_record()
assert valid(failure), "synthetic FAILED record shape"
unreviewed = copy.deepcopy(failure)
unreviewed["executionStatus"] = "EXECUTED_UNREVIEWED"
assert valid(unreviewed), "synthetic UNREVIEWED record shape"

cases = [
    ("fake_placeholder_success", sample, lambda d: d.update(executionStatus="EXECUTED_UNREVIEWED")),
    ("fake_placeholder_actual", sample, lambda d: d.update(actual="PASSED")),
    ("fake_placeholder_artifact", sample, lambda d: d["artifacts"].append({"kind":"log", "uri":"synthetic://not-real", "sha256":"0"*64, "classification":"REDACTED"})),
    ("missing_scenario", sample, lambda d: d.pop("scenarioId")),
    ("fake_go", sample, lambda d: d.update(executionStatus="TENANT_GO_LIVE_ACCEPTED")),
    ("fake_runtime", sample, lambda d: d.update(runKind="REAL_SYSTEM",executionStatus="EXECUTED_UNREVIEWED")),
    ("unexpected_owner_signed", sample, lambda d: d.update(ownerSigned=True)),
    ("bad_ac", sample, lambda d: d.update(acId="AC-22")),
    ("bad_ev", sample, lambda d: d.update(evIds=["EV-16"])),
    ("duplicate_ev", sample, lambda d: d.update(evIds=["EV-03","EV-03"])),
    ("blocker_missing_reason", blocker, lambda d: d.update(blockers=[])),
    ("blocker_fake_started_at", blocker, lambda d: d.update(startedAt="2000-01-01T00:00:00Z")),
    ("blocker_fake_artifact", blocker, lambda d: d.update(artifacts=[{"kind":"log","uri":"synthetic://not-real","sha256":"0"*64,"classification":"REDACTED"}])),
    ("failed_missing_actual", failure, lambda d: d.update(actual=None)),
    ("failed_missing_artifact", failure, lambda d: d.update(artifacts=[])),
    ("unreviewed_missing_actual", unreviewed, lambda d: d.update(actual=None)),
    ("wrong_scenario", failure, lambda d: d.update(scenarioId="S3-AC04-P")),
    ("wrong_ev_mapping", failure, lambda d: d.update(evIds=["EV-01"])),
    ("wrong_mode_mapping", failure, lambda d: d.update(mode="B_NO_CHANNEL")),
    ("wrong_fault_mapping", failure, lambda d: d.update(faultId="F-22")),
]
for name, source, mutate in cases:
    record = copy.deepcopy(source)
    mutate(record)
    assert not valid(record), "Unsafe S3 record accepted: " + name
print(f"PASS_S3_SCHEMA_AND_SEMANTIC_NEGATIVES {len(cases)} CONTRACT_ONLY")
print("PASS_S3_IN_MEMORY_POSITIVES 4 SYNTHETIC_NOT_REAL_EVIDENCE")
