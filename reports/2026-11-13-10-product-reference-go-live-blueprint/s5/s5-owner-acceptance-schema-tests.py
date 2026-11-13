#!/usr/bin/env python3
"""Contract-only schema negative tests. No Owner GitHub signature is created/verified."""
import argparse
import copy
import json
from pathlib import Path
from jsonschema import Draft202012Validator, FormatChecker

DIR = Path(__file__).resolve().parent
def read(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))

SCHEMA = read(DIR / "product-baseline-acceptance.schema.json")
Draft202012Validator.check_schema(SCHEMA)
VALIDATOR = Draft202012Validator(SCHEMA, format_checker=FormatChecker())
EXAMPLE = read(DIR / "product-baseline-acceptance.example.json")
def must_reject(name, mutate):
    d=copy.deepcopy(EXAMPLE)
    mutate(d)
    if VALIDATOR.is_valid(d):
        raise AssertionError("Unsafe mutation accepted by schema: " + name)

def validate_unsigned(record):
    errors = list(VALIDATOR.iter_errors(record))
    if errors:
        raise ValueError("Acceptance contract has schema errors: " + ",".join(x.validator for x in errors))
    # Schema cannot authenticate a GitHub comment. Do NOT accept signed claims from local JSON.
    if record["recordKind"] != "PRODUCT_BASELINE_ACCEPTANCE_TEMPLATE_NOT_SIGNED" or record["state"] != "PENDING_OWNER_SIGNATURE":
        raise ValueError("SIGNED_RECORD_REQUIRES_INDEPENDENT_GITHUB_AUTHENTICITY_AND_COMMIT_C_REVIEW")
    return True

def run_tests():
    validate_unsigned(EXAMPLE)
    negatives=[
        ("fake_state",lambda d:d.update(state="OWNER_BASELINE_ACCEPTED")),
        ("fake_signed_kind",lambda d:d.update(recordKind="PRODUCT_BASELINE_ACCEPTANCE_RECORD")),
        ("fake_snapshot_sha",lambda d:d.update(snapshotCommitSha="a"*40)),
        ("fake_comment",lambda d:d["ownerApproval"].update(githubCommentUrl="https://github.com/chung6a8m/research-sme-phan-phoi-hang-tieu-dung/pull/2#issuecomment-999999")),
        ("fake_login",lambda d:d["ownerApproval"].update(githubLogin="someone")),
        ("fake_timestamp",lambda d:d["ownerApproval"].update(githubCreatedAt="2026-11-13T19:57:00+07:00")),
        ("fake_approved_sha",lambda d:d["ownerApproval"].update(approvedSnapshotSha="a"*40)),
        ("fake_quality_gate",lambda d:d.update(qualityGateRef="FAKE")),
        ("false_product_verified",lambda d:d.update(productVerification="VERIFIED")),
        ("false_tenant_go",lambda d:d.update(tenantGoLiveAcceptance="ACCEPTED")),
        ("false_B_go",lambda d:d["modeState"].update(B_NO_CHANNEL="GO")),
        ("offline_write_enabled",lambda d:d["modeState"].update(OFFLINE_WRITE="ADMITTED")),
        ("missing_Q20",lambda d:d["decisionRefs"]["ownerReview"].pop()),
        ("duplicate_Q",lambda d:d["decisionRefs"]["ownerReview"].__setitem__(1,"Q01")),
        ("missing_PADR",lambda d:d["decisionRefs"]["padr"].pop()),
        ("missing_EVQ",lambda d:d["decisionRefs"]["evq"].pop()),
        ("invalid_upstream",lambda d:d.update(upstreamPrNumber=2)),
        ("invalid_scope",lambda d:d.update(scope="PRODUCTION_GO_LIVE")),
        ("wrong_outstanding_link",lambda d:d.update(outstandingRegisterRef="missing.json")),
        ("delete_approval",lambda d:d.pop("ownerApproval")),
    ]
    for name,mutate in negatives:must_reject(name,mutate)
    print("PASS_S5_OWNER_ACCEPTANCE_SCHEMA_POSITIVE 1 UNSIGNED_ONLY")
    print("PASS_S5_OWNER_ACCEPTANCE_SCHEMA_NEGATIVES "+str(len(negatives))+" NOT_OWNER_SIGNOFF")
if __name__=="__main__":
    parser=argparse.ArgumentParser(description="Read-only unsigned acceptance contract checks")
    parser.add_argument("--acceptance",type=Path)
    args=parser.parse_args()
    if args.acceptance:
        validate_unsigned(read(args.acceptance))
        print("VALID_UNSIGNED_TEMPLATE_ONLY_NOT_OWNER_ACCEPTED")
    else:
        run_tests()
