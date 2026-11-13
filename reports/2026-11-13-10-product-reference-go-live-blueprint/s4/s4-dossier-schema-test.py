"""Validate draft operations dossier schema. Synthetic contract only, no operational evidence."""
import copy
import json
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
