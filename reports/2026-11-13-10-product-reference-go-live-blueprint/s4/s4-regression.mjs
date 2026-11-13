import assert from "node:assert/strict";
import {load,validate} from "./s4-validate.mjs";
const source=load(),clone=()=>structuredClone(source);
assert.equal(validate(source).realOperationalDrills,0);
const mutations=[
 ["missing_control",d=>d.c.controls.pop()],
 ["duplicate_control",d=>d.c.controls[1].controlId=d.c.controls[0].controlId],
 ["promoted_assessment",d=>d.c.controls[0].assessmentStatus="PASS"],
 ["dangling_EV",d=>d.c.controls[0].evIds=["EV-99"]],
 ["dangling_gate",d=>d.c.controls[0].gateIds=["G-OVERRIDE"]],
 ["no_writer_fence",d=>d.c.controls.find(c=>c.controlId==="OPS-13").gateIds=[]],
 ["first_effect_rollback",d=>d.c.controls.find(c=>c.controlId==="OPS-14").failureAction="Rollback to clean previous state"],
 ["unprotected_B_no_channel",d=>d.c.controls.find(c=>c.controlId==="OPS-25").appliesToModes=["B_ONLINE"]],
 ["accounting_POSTED_auto_OK",d=>d.c.controls.find(c=>c.controlId==="OPS-28").failureAction="POSTED automatically reconciled"],
 ["fake_doc_GO",d=>d.d.modeDecisions.find(m=>m.mode==="A").decision="GO"],
 ["offline_enabled",d=>d.modes.gates.find(m=>m.mode==="OFFLINE_WRITE").defaultEnabled=true],
 ["mixed_without_B",d=>d.modes.gates.find(m=>m.mode==="MIXED").dependsOnModes=["A"]],
 ["fake_s3_ev",d=>d.ev.records[10].realVerification="PASS"],
 ["fake_dossier_approval",d=>d.d.signoffs.push({role:"Owner",signoffRef:"FAKE",at:"now",scope:"all",signer:"someone"})],
 ["pilot_without_readiness",d=>d.d.pilot.state="EXECUTED_UNREVIEWED"],
 ["B_CASE_false_PASS",d=>d.d.deferredEvidence[0].state="PASS"],
 ["missing_threshold",d=>d.c.controls.find(c=>c.controlId==="OPS-21").requiredEvidence="Ready without evidence"],
 ["missing_privacy",d=>d.c.controls.find(c=>c.controlId==="OPS-30").evIds=[]],
 ["hidden_stock_scope",d=>d.d.scope.entireWarehouseStockScope=false],
 ["mutated_S4_runbook",d=>d.docs["backup-restore-and-recovery.vi.md"]="not a runbook"]
];
for(const [name,mut] of mutations){
 const d=clone();mut(d);
 assert.throws(()=>validate(d),undefined,"must reject "+name);
}
console.log("PASS_S4_NEGATIVE_REGRESSION "+mutations.length+" CONTRACT_ONLY NOT_EXECUTED");
