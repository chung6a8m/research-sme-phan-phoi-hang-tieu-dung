#!/usr/bin/env python3
"""S5/P07 schema and semantic checks. Never creates product/tenant acceptance.

Default: only synthetic positive + negative contract regressions.
--adoption requires --dossier and --answers; --pilot/--freeze/--answers are read-only.
No PII, field answers, or secret values are printed.
"""
import argparse
import copy
import json
from pathlib import Path
from jsonschema import Draft202012Validator

ROOT = Path(__file__).resolve().parent

def read(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))

FILES = {
    "answers": ("questionnaire-response.schema.json", "questionnaire-responses.example.json"),
    "adoption": ("tenant-adoption-profile.schema.json", "tenant-adoption-profile.example.json"),
    "pilot": ("tenant-pilot-profile.schema.json", "npp-01-pilot-blueprint.example.json"),
    "freeze": ("product-baseline-freeze.schema.json", "product-baseline-freeze.candidate.json"),
}
SCHEMAS = {key: read(ROOT / spec[0]) for key,spec in FILES.items()}
SAMPLES = {key: read(ROOT / spec[1]) for key,spec in FILES.items()}
for name, schema in SCHEMAS.items():
    Draft202012Validator.check_schema(schema)
VALIDATORS = {name: Draft202012Validator(schema) for name,schema in SCHEMAS.items()}
Q = read(ROOT / "questionnaire.json")
S4 = read(ROOT / "../s4/tenant-operations-discovery.example.json")
S4_SCHEMA = read(ROOT / "../s4/tenant-operations-dossier.schema.json")
S4_CONTROLS = {x["controlId"]:x for x in read(ROOT / "../s4/operational-controls.json")["controls"]}
DISPOSITION = read(ROOT / "gap-disposition-policy.json")
MAP_S4 = {x["code"]:x["s4Classification"] for x in DISPOSITION["actions"]}
DECISIONS = {x["questionId"] for x in Q["questions"]}
ALLOWED_MODES = {"A","B_ONLINE","MIXED"}
EXPECTED_EV = {f"EV-{i:02d}" for i in range(1,16)}

def unique_values(xs):
    return len(xs)==len(set(xs))

def semantic(kind, record, dossier=None, answers=None):
    """Cross-file correctness beyond Draft 2020-12. Acceptance still separate."""
    failures=[]
    if kind=="answers":
        records=record.get("answers",[])
        if len(records)!=24 or {x.get("questionId") for x in records}!=DECISIONS or not unique_values([x.get("questionId") for x in records]):
            failures.append("Q-01..24 must appear exactly once")
        if record.get("recordKind")=="SYNTHETIC_UNANSWERED_QUESTIONNAIRE_NOT_EVIDENCE" and any(x.get("state")!="UNANSWERED" for x in records):
            failures.append("Synthetic responses must remain unanswered")
    elif kind=="adoption":
        if dossier is None or answers is None:
            failures.append("S4 dossier and answers are required for adoption validation")
        else:
            if list(Draft202012Validator(S4_SCHEMA).iter_errors(dossier)):
                failures.append("S4 dossier schema invalid")
            if errors("answers",answers):
                failures.append("Linked questionnaire invalid")
            if dossier.get("recordKind") not in ("TENANT_DISCOVERY_GAP_NOT_GATE_APPROVAL","TENANT_EVIDENCE_COLLECTION_NOT_GATE_APPROVAL"):
                failures.append("S4 dossier must be tenant-scoped")
            if (record.get("tenantId"),record.get("profileVersion"))!=(dossier.get("tenantId"),dossier.get("profileVersion")):
                failures.append("adoption tenant/profile mismatches S4")
            if (record.get("tenantId"),record.get("profileVersion"))!=(answers.get("tenantId"),answers.get("profileVersion")):
                failures.append("adoption tenant/profile mismatches questionnaire")
            if set(record.get("requestedModes",[]))!=set(dossier.get("scope",{}).get("requestedModes",[])):
                failures.append("requested modes inconsistent with S4")
            if dossier.get("scope",{}).get("admittedModes") or record.get("admittedModes"):
                failures.append("S5 cannot issue mode admission")
            gaps=dossier.get("discoveryGaps",[])
            mapping={x.get("gapId"):x for x in gaps}
            decisions=record.get("gapDecisions",[])
            ids=[x.get("gapId") for x in decisions]
            if len(ids)!=len(gaps) or len(set(ids))!=len(ids) or set(ids)!=set(mapping):
                failures.append("all S4 gapIds need exactly one disposition")
            for g in decisions:
                src=mapping.get(g.get("gapId"))
                if not src:
                    continue
                if MAP_S4.get(g.get("action"))!=src.get("classification"):
                    failures.append("S4 classification vs S5 disposition mismatch")
                if set(g.get("relatedControlIds",[]))!=set(src.get("controlIds",[])):
                    failures.append("S4 control IDs mismatch S5 gap")
                if not set(g.get("relatedControlIds",[])).issubset(S4_CONTROLS):
                    failures.append("unknown OPS in gap")
                if g.get("ownerDecisionRef") is not None:
                    failures.append("S5 gap cannot self-approve Owner")
                if src.get("classification")=="BLOCKED" and g.get("action")!="BLOCKED":
                    failures.append("blocked S4 case cannot become CONFIGURE_L1")
            if "B_NO_CHANNEL" in record.get("requestedModes",[]) and not any(x.get("action")=="BLOCKED" for x in decisions):
                failures.append("B_NO_CHANNEL request must remain blocked")
    elif kind=="pilot":
        if record.get("tenantReference")=="NPP-01":
            plan=record.get("plannedDailyTrips",{})
            if (plan.get("A"),plan.get("B_ONLINE"),plan.get("MIXED"))!=(3,3,2) or record.get("minimumRepresentativeDays",0)<5:
                failures.append("NPP-01 D-15 must remain 3A+3B_ONLINE+2MIXED/day for >=5 days")
            if record.get("warehouseCode")!="Kho-01" or not record.get("warehouseOffWaveIncluded"):
                failures.append("stock authority covers all Kho-01 including off-wave")
        if record.get("admittedModes") or record.get("ownerApprovalRef") is not None or record.get("tenantAcceptanceRef") is not None:
            failures.append("pilot plan cannot admit modes or sign tenant acceptance")
        if record.get("ev14",{}).get("status")!="NOT_RUN" or record.get("ev15",{}).get("status")!="NOT_RUN":
            failures.append("EV14/EV15 need real workflow, not candidate")
        if set(record.get("requestedModes",[]))-ALLOWED_MODES:
            failures.append("B_NO_CHANNEL is not MVP pilot scope")
        if set(record.get("deferred",[]))!={"B-CASE-001","B-CASE-002","B-CASE-003","LEGAL-MEMO","INV-09"}:
            failures.append("deferred B evidence missing")
    elif kind=="freeze":
        if record.get("ownerAcceptance",{}).get("state")!="PENDING" or record.get("baselineFreezeCommitSha") is not None:
            failures.append("candidate cannot claim Owner acceptance or signed freeze")
        if record.get("productVerification")!="PENDING" or record.get("tenantGoLiveAcceptance")!="PENDING":
            failures.append("documentation freeze cannot verify product/tenant")
        if set(record.get("unresolved",{}).get("evidenceIds",[]))!=EXPECTED_EV:
            failures.append("all EV-01..15 must stay pending in candidate")
        if record.get("modeState",{}).get("B_NO_CHANNEL")!="BLOCKED":
            failures.append("blocked mode cannot be released")
        paths=record.get("sourceDocuments",[])
        if len(set(paths))!=len(paths) or any(not (ROOT / p).resolve().is_file() for p in paths):
            failures.append("freeze sources must exist and be unique")
        if record.get("parentReviewedHead")!="967e7b9239060c242c183cd1c6a1434467edf08b":
            failures.append("S1–S4 reviewed source reference changed without versioning")
    return failures

def errors(kind, record, dossier=None, answers=None):
    shape=[f"{e.json_path}: {e.validator}" for e in VALIDATORS[kind].iter_errors(record)]
    return shape + semantic(kind,record,dossier,answers) if not shape else shape

def must_pass(kind,record,dossier=None,answers=None):
    found=errors(kind,record,dossier,answers)
    assert not found, f"synthetic positive invalid for {kind}: {found}"

def run_tests():
    for kind in FILES:
        must_pass(kind,SAMPLES[kind],S4,SAMPLES["answers"])
    # All examples are synthetic or pending and are never persisted as NPP evidence.
    negatives=[
       ("answers","missing_q",lambda d:d["answers"].pop()),
       ("answers","duplicate_q",lambda d:d["answers"][1].update(questionId=d["answers"][0]["questionId"])),
       ("answers","fake_synthetic_answer",lambda d:d["answers"][0].update(state="ANSWERED_UNVERIFIED",answer="faked")),
       ("answers","fake_review",lambda d:d["answers"][0].update(state="SOURCE_REVIEWED_NOT_GATE")),
       ("answers","fake_evidence",lambda d:d["answers"][0]["sourceRefs"].append("synthetic://not-source")),
       ("adoption","fake_go",lambda d:d["admittedModes"].append("A")),
       ("adoption","fake_approval",lambda d:d.update(ownerAcceptanceRef="FAKE")),
       ("adoption","fake_product_verified",lambda d:d.update(productVerificationRef="FAKE")),
       ("adoption","wrong_tenant",lambda d:d.update(tenantId="OTHER")),
       ("adoption","wrong_profile",lambda d:d.update(profileVersion="OTHER")),
       ("adoption","remove_gap",lambda d:d["gapDecisions"].clear()),
       ("adoption","duplicate_gap",lambda d:d["gapDecisions"].append(copy.deepcopy(d["gapDecisions"][0]))),
       ("adoption","blocked_to_L1",lambda d:d["gapDecisions"][0].update(action="CONFIGURE_L1")),
       ("adoption","wrong_OPS",lambda d:d["gapDecisions"][0].update(relatedControlIds=["OPS-04"])),
       ("adoption","unknown_OPS",lambda d:d["gapDecisions"][0].update(relatedControlIds=["OPS-99"])),
       ("pilot","wrong_B_count",lambda d:d["plannedDailyTrips"].update(B_ONLINE=4)),
       ("pilot","missing_MIXED",lambda d:d["requestedModes"].remove("MIXED")),
       ("pilot","short_pilot",lambda d:d.update(minimumRepresentativeDays=4)),
       ("pilot","partial_stock",lambda d:d.update(warehouseOffWaveIncluded=False)),
       ("pilot","B_no_channel",lambda d:d["requestedModes"].append("B_NO_CHANNEL")),
       ("pilot","fake_EV14",lambda d:d["ev14"].update(status="PASS")),
       ("pilot","fake_EV15",lambda d:d["ev15"].update(status="PASS")),
       ("pilot","fake_threshold",lambda d:d["thresholds"].update(latency="120ms")),
       ("pilot","fake_owner_signature",lambda d:d.update(ownerApprovalRef="FAKE")),
       ("pilot","missing_B_CASE",lambda d:d["deferred"].pop()),
       ("freeze","fake_owner",lambda d:d["ownerAcceptance"].update(state="ACCEPTED")),
       ("freeze","fake_freeze_sha",lambda d:d.update(baselineFreezeCommitSha="a"*40)),
       ("freeze","fake_product_verification",lambda d:d.update(productVerification="VERIFIED")),
       ("freeze","missing_decision",lambda d:d["productDecisionIds"].pop()),
       ("freeze","missing_EV",lambda d:d["unresolved"]["evidenceIds"].pop()),
       ("freeze","B_GO",lambda d:d["modeState"].update(B_NO_CHANNEL="GO")),
       ("freeze","missing_document",lambda d:d["sourceDocuments"].append("ghost.md")),
       ("freeze","duplicate_source",lambda d:d["sourceDocuments"].append(d["sourceDocuments"][0])),
    ]
    for kind,name,change in negatives:
        doc=copy.deepcopy(SAMPLES[kind])
        change(doc)
        assert errors(kind,doc,S4,SAMPLES["answers"]),f"Unsafe {kind}/{name} mutation accepted"
    print("PASS_S5_SCHEMA_DRAFT202012_POSITIVES 4 SYNTHETIC_ONLY")
    print(f"PASS_S5_SCHEMA_AND_SEMANTIC_NEGATIVES {len(negatives)} CONTRACT_ONLY")
    return len(negatives)

def cli():
    parser=argparse.ArgumentParser(description="Read-only S5 contract validation; never grants product/tenant approval")
    parser.add_argument("--answers",type=Path)
    parser.add_argument("--adoption",type=Path)
    parser.add_argument("--dossier",type=Path)
    parser.add_argument("--pilot",type=Path)
    parser.add_argument("--freeze",type=Path)
    options=parser.parse_args()
    provided=[k for k in ("answers","adoption","pilot","freeze") if getattr(options,k)]
    if not provided:
        run_tests()
        return
    if options.adoption and (not options.dossier or not options.answers):
        parser.error("--adoption requires --dossier FILE and --answers FILE")
    if options.dossier and not options.adoption:
        parser.error("--dossier must accompany --adoption")
    dossier=read(options.dossier) if options.dossier else None
    answer_record=read(options.answers) if options.answers else None
    for kind in provided:
        document=read(getattr(options,kind))
        found=errors(kind,document,dossier,answer_record)
        if found:
            for issue in found:
                # Never print user-entered data values
                print("S5_INVALID: "+kind+" "+issue)
            raise SystemExit(2)
    print("S5_RECORD_CONTRACT_VALID_NOT_OWNER_APPROVED_NOT_PRODUCT_OR_TENANT_VERIFIED")

if __name__=="__main__":
    cli()
