import assert from "node:assert/strict";
import {loadContract,validateContract} from "./s3-validate.mjs";
const source=loadContract();
assert.equal(validateContract(source).realE2eRuns,0);
const mutations=[
 ["missing_AC",d=>d.acceptance.cases.pop()],
 ["wrong_R009_EV",d=>d.acceptance.cases[0].evidenceIds=["EV-15"]],
 ["wrong_R009_BR",d=>d.acceptance.cases[0].businessRules=["BR-24"]],
 ["duplicate_EV",d=>d.evidence.records[1].evId=d.evidence.records[0].evId],
 ["promoted_evidence",d=>d.evidence.records[4].realVerification="INTEGRATION_VERIFIED"],
 ["gherkin_missing_negative",d=>d.features[0].text=d.features[0].text.replace("@negative @not_run_product","@positive @not_run_product")],
 ["gherkin_wrong_ev",d=>d.features[0].text=d.features[0].text.replace("@ev_01 @ev_09 @positive","@ev_15 @positive")],
 ["wrong_policy_link",d=>d.acceptance.cases[0].s1Trace.policyIds=["POL-24"]],
 ["orphan_data_contract",d=>d.acceptance.cases[0].s1Trace.dataContractIds.push("DC-99")],
 ["missing_decision_trace",d=>d.acceptance.cases[0].s1Trace.decisionIdsViaPolicy=[]],
 ["wrong_API_SM",d=>d.acceptance.cases[0].s1Trace.apiIds=["API-12"]],
 ["missing_fault",d=>d.fault.faults.pop()],
 ["bad_S2_fault",d=>d.fault.faults[0].acIds=["AC-10"]],
 ["no_channel_GO",d=>d.gates.gates.find(x=>x.mode==="B_NO_CHANNEL").decision="GO"],
 ["offline_enabled",d=>d.gates.gates.find(x=>x.mode==="OFFLINE_WRITE").defaultEnabled=true],
 ["mixed_without_B",d=>d.gates.gates.find(x=>x.mode==="MIXED").dependsOnModes=["A"]],
 ["example_false_test",d=>{d.example.runKind="REAL_SYSTEM";d.example.executionStatus="EXECUTED_UNREVIEWED"}],
 ["product_falsely_verified",d=>d.gates.productVerification="VERIFIED"],
 ["oracle_missing",d=>delete d.oracle["AC-19"]],
 ["B_CASE_missing",d=>d.gates.gates.find(x=>x.mode==="B_NO_CHANNEL").deferredEvidence.pop()]
];
for(const [name,mutation] of mutations){
  const copy=structuredClone(source);
  mutation(copy);
  assert.throws(()=>validateContract(copy),undefined,"must reject "+name);
}
console.log("PASS_S3_NEGATIVE_REGRESSION "+mutations.length+" CONTRACT_ONLY NOT_RUN_PRODUCT");

