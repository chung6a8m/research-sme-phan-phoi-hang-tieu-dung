#!/usr/bin/env python3
"""Schema and negative tests for prepared Snapshot C. This never authenticates Owner signatures."""
import copy
import json
from pathlib import Path
from jsonschema import Draft202012Validator

ROOT=Path(__file__).resolve().parent
def read(name):
    return json.loads((ROOT / name).read_text(encoding="utf-8"))

schema=read("product-baseline-snapshot-c.schema.json")
candidate=read("product-baseline-snapshot-c.candidate.json")
Draft202012Validator.check_schema(schema)
validator=Draft202012Validator(schema)
assert validator.is_valid(candidate), "Prepared C candidate must be schema valid"
negatives=[
 ("fake_C_sha",lambda d:d.update(snapshotCommitSha="a"*40)),
 ("fake_owner_url",lambda d:d.update(ownerApprovalRef="https://github.com/fake")),
 ("fake_owner_timestamp",lambda d:d.update(ownerAcceptedAt="2026-11-13T12:00:00Z")),
 ("fake_R",lambda d:d.update(acceptanceRecordRState="CREATED")),
 ("fake_verified",lambda d:d.update(productVerification="VERIFIED")),
 ("fake_tenant_go",lambda d:d.update(tenantGoLiveAcceptance="ACCEPTED")),
 ("B_unblocked",lambda d:d["modeState"].update(B_NO_CHANNEL="GO")),
 ("offline_admitted",lambda d:d["modeState"].update(OFFLINE_WRITE="ADMITTED")),
 ("not_main",lambda d:d.update(baseBranch="staging")),
 ("fake_merge",lambda d:d["pr1Merge"].update(mergedIntoMain=False)),
 ("wrong_pr1",lambda d:d["pr1Merge"].update(mergeCommitSha="b"*40)),
 ("no_s1_s5",lambda d:d["scope"].update(baselinePaths=[])),
 ("no_anchor",lambda d:d["scope"].update(freezeInputBlobCount=0)),
 ("synthetic_becomes_real",lambda d:d["preSnapshotChecks"].update(kind="PRODUCT_VERIFIED")),
 ("fake_final_ci",lambda d:d.update(finalSnapshotChecks="PASS")),
 ("fake_QA",lambda d:d.update(reviewMatrixState="PASS")),
]
for name,change in negatives:
    sample=copy.deepcopy(candidate)
    change(sample)
    assert not validator.is_valid(sample), f"Unsafe snapshot mutation allowed: {name}"
print("PASS_S5_SNAPSHOT_C_SCHEMA_POSITIVE 1 PREPARED_ONLY")
print(f"PASS_S5_SNAPSHOT_C_SCHEMA_NEGATIVES {len(negatives)} NOT_OWNER_SIGNOFF")
