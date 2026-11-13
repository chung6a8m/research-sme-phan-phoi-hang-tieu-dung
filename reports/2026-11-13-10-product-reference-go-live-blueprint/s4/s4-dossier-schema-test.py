"""Validate draft operations dossier schema. Synthetic contract only, no operational evidence."""
import copy
import json
import sys
from pathlib import Path
from jsonschema import Draft202012Validator

HERE=Path(__file__).resolve().parent
schema=json.loads((HERE/"tenant-operations-dossier.schema.json").read_text(encoding="utf-8"))
example=json.loads((HERE/"tenant-operations-dossier.example.json").read_text(encoding="utf-8"))
Draft202012Validator.check_schema(schema)
validator=Draft202012Validator(schema)
assert not list(validator.iter_errors(example)), "Baseline placeholder schema invalid"

tests=[]
def reject(name, fn):
    e=copy.deepcopy(example)
    fn(e)
    assert list(validator.iter_errors(e)), "Schema failed to reject "+name
    tests.append(name)

reject("mode_go", lambda e: e["modeDecisions"][0].update(decision="GO"))
reject("admission_record", lambda e: e["modeDecisions"][0].update(admissionRecordRef="signed"))
reject("offline_go", lambda e: e["modeDecisions"][3].update(decision="NO_GO_PENDING"))
reject("cutover_forward_only_false", lambda e: e["cutover"].update(forwardRecoveryOnly=False))
reject("first_effect_without_reconciled_cutover", lambda e: e["cutover"].update(firstEffectId="E-1"))
reject("first_effect_stage_without_manifest", lambda e: e["cutover"].update(stage="POST_FIRST_EFFECT"))
reject("fake_signoff_in_template", lambda e: e["signoffs"].append({"role":"Owner","signoffRef":"f","signer":"x","at":"now","scope":"all"}))
reject("fake_evidence_in_template", lambda e: e["evidenceIndex"].append({"evId":"EV-12","testRunId":"x","artifactUri":"x","sha256":"0"*64,"classification":"REDACTED"}))
reject("promotion_of_assessment", lambda e: e["assessments"][0].update(status="REVIEWED_EVIDENCE_NOT_GATE"))
reject("missing_assessment", lambda e: e["assessments"].pop())
reject("fake_pilot", lambda e: e["pilot"].update(state="EXECUTED_UNREVIEWED",observedDays=5))
reject("missing_pilot_threshold", lambda e: e["readiness"].update(state="EXECUTED_UNREVIEWED"))
reject("deferred_B_case_promoted", lambda e: e["deferredEvidence"][0].update(state="PASS"))
reject("deferred_INV09_promoted", lambda e: e["deferredEvidence"][-1].update(state="EVIDENCE_PENDING"))
reject("unknown_schema_property", lambda e: e.update(tenantGoLiveAccepted=True))
reject("invalid_build_sha", lambda e: e["runtime"].update(commitSha="abc"))
reject("unsafe_stock_scope", lambda e: e["scope"].update(entireWarehouseStockScope=False))

print("PASS_S4_SCHEMA_DRAFT202012_NEGATIVES",len(tests),"PLACEHOLDER_ONLY_NOT_GO_LIVE")

# F3/F4/F6: semantic validation of a NEW dossier, not just the placeholder.
from datetime import datetime

discovery = json.loads((HERE/"tenant-operations-discovery.example.json").read_text(encoding="utf-8"))
controls = {item["controlId"]: item for item in json.loads((HERE/"operational-controls.json").read_text(encoding="utf-8"))["controls"]}
modes = json.loads((HERE/"../s3/mode-gates.json").read_text(encoding="utf-8"))
mode_ids = [x["mode"] for x in modes["gates"]]
deferred_ids = ["B-CASE-001","B-CASE-002","B-CASE-003","LEGAL-MEMO","INV-09"]

def semantic_issues(d):
    """No self-certification; validate referential and uniqueness constraints."""
    issues = []
    seen_controls = [x["controlId"] for x in d.get("assessments", [])]
    if sorted(seen_controls) != sorted(controls):
        issues.append("30 unique OPS controls must be assessed once")
    decision_modes = [x["mode"] for x in d.get("modeDecisions", [])]
    if sorted(decision_modes) != sorted(mode_ids):
        issues.append("six distinct mode decisions required")
    deferred = [x["id"] for x in d.get("deferredEvidence", [])]
    if sorted(deferred) != sorted(deferred_ids):
        issues.append("deferred B-CASE/legal/INV09 references required")
    if d.get("scope",{}).get("admittedModes",[]):
        issues.append("dossier is not a mode-admission authority")
    gaps = d.get("discoveryGaps", [])
    if len({x["gapId"] for x in gaps}) != len(gaps):
        issues.append("duplicate gapId")
    for gap in gaps:
        if not set(gap["controlIds"]).issubset(controls):
            issues.append("unknown gap control")
        if len(set(gap["controlIds"])) != len(gap["controlIds"]):
            issues.append("duplicate control within gap")
    exceptions = d.get("p1Exceptions", [])
    if len({x["exceptionId"] for x in exceptions}) != len(exceptions):
        issues.append("duplicate exceptionId")
    for exception in exceptions:
        if any(control_id not in controls or controls[control_id]["severity"] != "P1" for control_id in exception["controlIds"]):
            issues.append("P1 exception cannot waive P0")
        if not set(exception["modeScope"]).issubset(["A","B_ONLINE","MIXED","OFFLINE_WRITE"]):
            issues.append("P1 exception cannot open blocked mode/cutover")
        if exception["state"] == "OWNER_ACCEPTED_EXCEPTION_NOT_GATE_PASS":
            try:
                accepted = datetime.fromisoformat(exception["acceptedAt"].replace("Z","+00:00"))
                expires = datetime.fromisoformat(exception["expiresAt"].replace("Z","+00:00"))
                if not accepted.tzinfo or not expires.tzinfo or expires <= accepted:
                    issues.append("accepted P1 expiry must be after signed acceptance")
            except (ValueError, TypeError, AttributeError):
                issues.append("accepted P1 requires valid ISO timestamps")
    return issues

def valid_complete(d):
    return not list(validator.iter_errors(d)) and not semantic_issues(d)

# Read-only intake: no mode admission, no external signature verification.
if len(sys.argv) > 1:
    if len(sys.argv) != 3 or sys.argv[1] != "--dossier":
        raise SystemExit("Usage: python s4-dossier-schema-test.py --dossier /secure/path/dossier.json")
    record = json.loads(Path(sys.argv[2]).read_text(encoding="utf-8"))
    errors = [f"schema failure at {e.json_path}: {e.validator}" for e in validator.iter_errors(record)]
    if not errors:
        errors = semantic_issues(record)
    if errors:
        for message in errors:
            print("S4_DOSSIER_INVALID: " + message)
        raise SystemExit(2)
    print("S4_DOSSIER_CONTRACT_VALID_NOT_TENANT_ACCEPTED")
    raise SystemExit(0)

assert valid_complete(example), "blank dossier must be valid"
assert valid_complete(discovery), "S5 synthetic-only discovery must be valid"

collection = copy.deepcopy(discovery)
collection["recordKind"] = "TENANT_EVIDENCE_COLLECTION_NOT_GATE_APPROVAL"
collection["runtime"]["commitSha"] = "a" * 40
collection["runtime"]["environment"] = "SYNTHETIC_TEST_ONLY"
assert valid_complete(collection), "S6 collection contract shape, in-memory only"

accepted = copy.deepcopy(collection)
accepted["p1Exceptions"] = [{
    "exceptionId": "SYNTHETIC_ONLY_P1_001", "severity":"P1",
    "controlIds":["OPS-19"], "modeScope":["A"],
    "state":"OWNER_ACCEPTED_EXCEPTION_NOT_GATE_PASS", "owner":"SYNTHETIC_NOT_A_PERSON",
    "expiresAt":"2000-02-01T00:00:00Z", "mitigation":"SYNTHETIC mitigation only",
    "compensatingControls":["SYNTHETIC checker review"],
    "remediation":"SYNTHETIC corrective action", "reviewer":"SYNTHETIC_NOT_A_SIGNER",
    "approvalRef":"SYNTHETIC_NOT_AN_APPROVAL", "acceptedAt":"2000-01-01T00:00:00Z",
    "evidenceRefs":["synthetic://not-evidence"]
}]
assert valid_complete(accepted), "in-memory-only P1 example is structurally valid"

negative_semantic = [
    ("discovery_missing_tenant",discovery,lambda d:d.update(tenantId=None)),
    ("discovery_fake_runtime",discovery,lambda d:d["runtime"].update(commitSha="a"*40)),
    ("discovery_fake_admission",discovery,lambda d:d["scope"].update(admittedModes=["A"])),
    ("discovery_fake_signoff",discovery,lambda d:d["signoffs"].append({"role":"Owner","signoffRef":"x","signer":"x","at":"now","scope":"A"})),
    ("discovery_fake_pilot",discovery,lambda d:d["pilot"].update(state="EXECUTED_UNREVIEWED")),
    ("discovery_accepted_exception",discovery,lambda d:d["p1Exceptions"].extend(accepted["p1Exceptions"])),
    ("duplicate_assessment_control",collection,lambda d:d["assessments"][1].update(controlId=d["assessments"][0]["controlId"])),
    ("duplicate_mode_decision",collection,lambda d:d["modeDecisions"][1].update(mode=d["modeDecisions"][0]["mode"])),
    ("duplicate_deferred_case",collection,lambda d:d["deferredEvidence"][1].update(id=d["deferredEvidence"][0]["id"])),
    ("duplicate_gap_id",collection,lambda d:d["discoveryGaps"].append(copy.deepcopy(d["discoveryGaps"][0]))),
    ("unknown_gap_control",collection,lambda d:d["discoveryGaps"][0].update(controlIds=["OPS-99"])),
    ("duplicate_gap_control",collection,lambda d:d["discoveryGaps"][0].update(controlIds=["OPS-25","OPS-25"])),
    ("P1_targeting_P0",accepted,lambda d:d["p1Exceptions"][0].update(controlIds=["OPS-13"])),
    ("P1_using_B_NO_CHANNEL",accepted,lambda d:d["p1Exceptions"][0].update(modeScope=["B_NO_CHANNEL"])),
    ("P1_missing_approval_ref",accepted,lambda d:d["p1Exceptions"][0].update(approvalRef=None)),
    ("P1_missing_reviewer",accepted,lambda d:d["p1Exceptions"][0].update(reviewer=None)),
    ("P1_missing_expiry",accepted,lambda d:d["p1Exceptions"][0].update(expiresAt=None)),
    ("P1_missing_mitigation",accepted,lambda d:d["p1Exceptions"][0].update(mitigation=None)),
    ("P1_missing_compensation",accepted,lambda d:d["p1Exceptions"][0].update(compensatingControls=[])),
    ("P1_expiry_before_acceptance",accepted,lambda d:d["p1Exceptions"][0].update(expiresAt="1999-01-01T00:00:00Z")),
    ("P1_duplicate_exception",accepted,lambda d:d["p1Exceptions"].append(copy.deepcopy(d["p1Exceptions"][0]))),
]
for name, source, mutate in negative_semantic:
    record=copy.deepcopy(source)
    mutate(record)
    assert not valid_complete(record), "Unsafe S4 dossier accepted: " + name

print(f"PASS_S4_SEMANTIC_NEGATIVES {len(negative_semantic)} CONTRACT_ONLY")
print("PASS_S4_IN_MEMORY_POSITIVES 4 SYNTHETIC_ONLY_NOT_EVIDENCE")
