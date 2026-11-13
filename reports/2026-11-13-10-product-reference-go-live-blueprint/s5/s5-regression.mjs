import assert from "node:assert/strict";
import {load,validate} from "./s5-validate.mjs";
const original=load();
assert.equal(validate(original).realTenantAssessments,0);
const failures=[
 ["missing_question",d=>d.questionnaire.questions.pop()],
 ["duplicate_question",d=>d.questionnaire.questions[1].questionId=d.questionnaire.questions[0].questionId],
 ["missing_policy",d=>d.questionnaire.questions[0].policyIds=[]],
 ["missing_configuration",d=>d.questionnaire.questions[0].configurationIds=[]],
 ["orphan_ops",d=>d.questionnaire.questions[0].controlIds=["OPS-99"]],
 ["missing_control_coverage",d=>d.questionnaire.questions.forEach(q=>q.controlIds=q.controlIds.filter(x=>x!=="OPS-30"))],
 ["fake_tenant_answer",d=>d.answers.answers[0].answer="invented fact"],
 ["duplicate_answer",d=>d.answers.answers[1].questionId=d.answers.answers[0].questionId],
 ["fake_questionnaire_collected",d=>d.questionnaire.questions[0].answerState="SOURCE_REVIEWED"],
 ["archetype_falsely_validated",d=>d.archetypes.status="FIELD_VERIFIED"],
 ["unbounded_L1_go",d=>d.rules.actions[1].allowProductionFromDocument=true],
 ["P0_gate_waived",d=>d.rules.p0NeverWaivable.pop()],
 ["B_no_channel_unblocked",d=>d.rules.bNoChannel="ALLOWED"],
 ["tenant_mismatch",d=>d.adoption.tenantId="TENANT-OTHER"],
 ["profile_mismatch",d=>d.adoption.profileVersion="vOther"],
 ["fake_admitted_mode",d=>d.adoption.admittedModes=["B_ONLINE"]],
 ["offline_enabled",d=>d.adoption.offlineWriteEnabled=true],
 ["missing_gap",d=>d.adoption.gapDecisions=[]],
 ["mismatched_gap_action",d=>d.adoption.gapDecisions[0].action="CONFIGURE_L1"],
 ["wrong_gap_control",d=>d.adoption.gapDecisions[0].relatedControlIds=["OPS-04"]],
 ["fake_gap_owner_approval",d=>d.adoption.gapDecisions[0].ownerDecisionRef="FAKE"],
 ["pilot_contract_fake_threshold",d=>d.pilotContract.thresholdApprovalRef="fake"],
 ["pilot_no_blocked_mode",d=>d.pilotContract.blockedModes=[]],
 ["pilot_mixed_missing",d=>d.pilot.requestedModes=["A","B_ONLINE"]],
 ["pilot_wrong_B_count",d=>d.pilot.plannedDailyTrips.B_ONLINE=4],
 ["pilot_fewer_days",d=>d.pilot.minimumRepresentativeDays=4],
 ["pilot_stock_scope_partial",d=>d.pilot.warehouseOffWaveIncluded=false],
 ["pilot_ev14_pre_signed",d=>d.pilot.ev14.thresholdApprovalRef="FAKE"],
 ["pilot_ev15_faked",d=>d.pilot.ev15.status="PASS"],
 ["pilot_unapproved_metric",d=>d.pilot.thresholds.latency="150ms"],
 ["baseline_fake_owner_acceptance",d=>d.freeze.ownerAcceptance.acceptedAt="2026-11-13T17:30+07:00"],
 ["baseline_fake_sha",d=>d.freeze.baselineFreezeCommitSha="a".repeat(40)],
 ["baseline_product_verified",d=>d.freeze.productVerification="VERIFIED"],
 ["baseline_missing_tadr",d=>d.freeze.tadrStatus.pop()],
 ["baseline_ev_promoted",d=>d.s3Ev.records[0].realVerification="PASS"],
 ["baseline_fake_B_go",d=>d.freeze.modeState.B_NO_CHANNEL="GO"],
 ["manifest_missing_source",d=>d.sources[d.freeze.sourceDocuments[0]]=false],
 ["source_decisions_missing",d=>d.decisions="NOTHING"],
 ["S5_doc_missing",d=>d.docs["README.md"]="short"]
];
for(const [name,change] of failures){
 const draft=structuredClone(original);
 change(draft);
 assert.throws(()=>validate(draft),undefined,"mutation must be rejected: "+name);
}
console.log("PASS_S5_NEGATIVE_REGRESSION "+failures.length+" SYNTHETIC_CONTRACT_ONLY");
