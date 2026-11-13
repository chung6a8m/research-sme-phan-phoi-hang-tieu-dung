import assert from "node:assert/strict";
import {loadOwnerGovernance,validateOwnerGovernance} from "./s5-owner-governance-validation.mjs";
const initial=loadOwnerGovernance();
assert.equal(validateOwnerGovernance(initial).ownerReviewDecisions,20);
const negatives=[
 ["Q_missing",d=>d.decisions.decisions.pop()],
 ["Q_duplicate",d=>d.decisions.decisions[1].decisionId="Q01"],
 ["Q_not_owner_option",d=>d.decisions.decisions[19].selectedOption=2],
 ["Q_fake_signature",d=>d.decisions.ownerApprovalRef="https://fake.invalid/signoff"],
 ["Q_fake_sha",d=>d.decisions.signedBaselineCommitSha="a".repeat(40)],
 ["Q_17_semantic_drift",d=>d.decisions.decisions[16].rule="Được tuỳ ý vận hành tiếp dù đang có P0 rủi ro."],
 ["Q17_missing_md",d=>d.docs.review=d.docs.review.replace("| **Q17** |","| **OTHER** |")],
 ["matrix_missing_QA",d=>d.matrix.reviewers.pop()],
 ["matrix_false_QA_PASS",d=>d.matrix.reviewers[2].state="PASS"],
 ["matrix_fake_QA_reviewer",d=>d.matrix.reviewers[2].reviewerRef="fake"],
 ["matrix_fake_ci",d=>d.matrix.qualityGate.ciRefs.push("fake")],
 ["matrix_false_checked_head",d=>d.matrix.qualityGate.checkedCommitSha="a".repeat(40)],
 ["outstanding_missing_TADR",d=>d.outstanding.registerEntries.shift()],
 ["outstanding_missing_EV",d=>d.outstanding.registerEntries=d.outstanding.registerEntries.filter(x=>x.id!=="EV-10")],
 ["outstanding_duplicate_EV",d=>d.outstanding.registerEntries.push(structuredClone(d.outstanding.registerEntries.find(x=>x.id==="EV-10")))],
 ["outstanding_fake_EV_PASS",d=>d.outstanding.registerEntries.find(x=>x.id==="EV-08").currentStatus="PASS"],
 ["outstanding_fake_P0_waiver",d=>d.outstanding.nonWaivableP0.pop()],
 ["outstanding_fake_B_GO",d=>d.outstanding.modeStates.B_NO_CHANNEL="GO"],
 ["outstanding_fake_real_e2e",d=>d.outstanding.realE2eRuns=1],
 ["outstanding_fake_evidence_ref",d=>d.outstanding.registerEntries[0].evidenceRefs.push("fake")],
 ["outstanding_fake_threshold",d=>d.outstanding.registerEntries.find(x=>x.id==="TH-RPO-RTO").currentStatus="15m"],
 ["outstanding_fake_owner",d=>d.outstanding.registerEntries[0].actualOwnerRef="fake"],
 ["acceptance_fake_status",d=>d.acceptance.state="OWNER_BASELINE_ACCEPTED"],
 ["acceptance_fake_comment",d=>d.acceptance.ownerApproval.githubCommentUrl="https://github.com/fake"],
 ["acceptance_fake_C_sha",d=>d.acceptance.snapshotCommitSha="a".repeat(40)],
 ["acceptance_fake_QA",d=>d.acceptance.productVerification="PASS"],
 ["acceptance_fake_tenant_GO",d=>d.acceptance.tenantGoLiveAcceptance="ACCEPTED"],
 ["acceptance_missing_Q20",d=>d.acceptance.decisionRefs.ownerReview.pop()],
 ["acceptance_B_GO",d=>d.acceptance.modeState.B_NO_CHANNEL="GO"],
 ["L2_autoGO",d=>d.extension.allowProductionFromBacklog=true],
 ["L2_fork",d=>d.extension.allowTenantFork=true],
 ["L2_skip_ADR",d=>d.extension.requireProductAdrForDevelopment=false],
 ["L2_fake_approved_item",d=>d.extension.entries.push({extensionId:"FAKE"})],
 ["freeze_fake_signature",d=>d.freeze.ownerAcceptance.state="ACCEPTED"],
 ["freeze_source_missing",d=>d.freeze.sourceDocuments=d.freeze.sourceDocuments.filter(x=>x!=="product-governance.vi.md")],
 ["governance_doc_missing",d=>d.docs.governance="short"]
];
for(const [name,mutate] of negatives){
 const draft=structuredClone(initial);
 mutate(draft);
 assert.throws(()=>validateOwnerGovernance(draft),undefined,"unsafe mutation must fail: "+name);
}
console.log("PASS_S5_OWNER_GOVERNANCE_NEGATIVES "+negatives.length+" SYNTHETIC_ONLY_NOT_OWNER_SIGNOFF");
