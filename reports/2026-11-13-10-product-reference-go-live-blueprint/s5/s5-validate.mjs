import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const DIR=path.dirname(fileURLToPath(import.meta.url));
const read=p=>fs.readFileSync(path.resolve(DIR,p),"utf8");
const json=p=>JSON.parse(read(p));
const check=(ok,msg)=>{if(!ok)throw new Error("S5_CONTRACT_ERROR: "+msg);};
const seq=(prefix,n)=>Array.from({length:n},(_,i)=>prefix+"-"+String(i+1).padStart(2,"0"));
const sorted=a=>[...a].sort().join("|");
const same=(a,b)=>sorted(a)===sorted(b);
const modeSet=["A","B_ONLINE","MIXED"];
const statusSet={A:"NO_GO_PENDING",B_ONLINE:"NO_GO_PENDING",MIXED:"NO_GO_PENDING",OFFLINE_WRITE:"DISABLED_PENDING",B_NO_CHANNEL:"BLOCKED",PRODUCTION_CUTOVER:"DISABLED_PENDING"};

export function load(){
 const freeze=json("product-baseline-freeze.candidate.json");
 return {
  questionnaire:json("questionnaire.json"),answers:json("questionnaire-responses.example.json"),
  archetypes:json("archetypes.json"),rules:json("gap-disposition-policy.json"),
  adoption:json("tenant-adoption-profile.example.json"),pilotContract:json("product-pilot-contract.json"),
  pilot:json("npp-01-pilot-blueprint.example.json"),freeze,
  s4:json("../s4/tenant-operations-discovery.example.json"),s4Controls:json("../s4/operational-controls.json"),
  s4Schema:json("../s4/tenant-operations-dossier.schema.json"),s3Gates:json("../s3/mode-gates.json"),
  s3Ev:json("../s3/evidence-register.json"),
  policy:read("../product-policy-catalog.vi.md"),
  decisions:read("../owner-decisions-and-evidence-gates.vi.md"),
  r009Pilot:read("../../2026-11-13-09-mvp-specification-baseline/implementation-and-pilot-plan.vi.md"),
  docs:Object.fromEntries(["README.md","gap-assessment-and-adoption.vi.md","baseline-freeze-and-s6-handoff.vi.md"].map(x=>[x,read(x)])),
  sources:Object.fromEntries(freeze.sourceDocuments.map(p=>[p,fs.existsSync(path.resolve(DIR,p))]))
 };
}
export function validate(d){
 const {questionnaire:q,answers,archetypes,rules,adoption,pilotContract:pc,pilot,freeze:f,s4,s4Controls:ops,s3Gates:gate,s3Ev}=d;
 for(const x of [q,answers,archetypes,rules,adoption,pc,pilot,f])check(x.schemaVersion==="s5-v1","s5 schema version");
 check(q.recordKind==="PRODUCT_ADOPTION_QUESTIONNAIRE_NOT_TENANT_EVIDENCE"&&q.status==="QUESTION_BANK_PREPARED","questionnaire cannot claim field evidence");
 const qs=q.questions;
 check(qs.length===24&&same(qs.map(x=>x.questionId),seq("Q",24)),"24 unique questions");
 check(same(qs.flatMap(x=>x.policyIds),seq("POL",24)),"24 POL coverage exactly once");
 check(same(qs.flatMap(x=>x.configurationIds),seq("CFG",24)),"24 CFG coverage exactly once");
 check(same([...new Set(qs.flatMap(x=>x.controlIds))],seq("OPS",30)),"all 30 OPS controlled by questionnaire");
 for(const item of qs){
  check(item.answerState==="NOT_COLLECTED"&&item.prompt.length>35&&item.requestedRoles.length>0&&item.controlIds.length>0,"question must not claim collected "+item.questionId);
  check(item.expectedEvidenceClass==="AUTHORIZED_TENANT_SOURCE_OR_SIGNED_REVIEW","question requires independent source "+item.questionId);
  check(item.controlIds.every(id=>ops.controls.some(o=>o.controlId===id)),"question orphan OPS "+item.questionId);
  for(const id of [...item.policyIds,...item.configurationIds])check(d.policy.includes(id),"question orphan policy/config "+id);
 }
 check(answers.recordKind==="SYNTHETIC_UNANSWERED_QUESTIONNAIRE_NOT_EVIDENCE"&&answers.tenantId===s4.tenantId&&answers.profileVersion===s4.profileVersion,"synthetic responses tenant/profile match S4");
 check(answers.answers.length===24&&same(answers.answers.map(a=>a.questionId),qs.map(a=>a.questionId)),"24 answer IDs exactly once");
 for(const a of answers.answers)check(a.state==="UNANSWERED"&&a.answer===null&&a.sourceRefs.length===0&&a.respondentRole===null&&a.reviewerRef===null,"responses must not invent evidence");
 check(archetypes.recordKind==="PRODUCT_ARCHETYPES_FOR_DESIGN_ONLY"&&archetypes.status==="NOT_FIELD_VALIDATED"&&archetypes.archetypes.length===4,"archetypes are hypotheses");
 check(archetypes.archetypes.some(x=>x.id==="ARCH-MIXED"&&x.modes.includes("MIXED")),"Mixed archetype");
 check(rules.recordKind==="GAP_DISPOSITION_RULES_NOT_APPROVAL","dispositions not admission");
 check(same(rules.actions.map(x=>x.code),["ADOPT_STANDARD","CONFIGURE_L1","EXTENSION_CANDIDATE_L2","BLOCKED"]),"4 disposition classes");
 check(same(rules.actions.map(x=>x.s4Classification),["L0_STANDARD","L1_CONFIGURATION","L2_EXTENSION_CANDIDATE","BLOCKED"]),"S4 disposition bijection");
 check(rules.actions.every(x=>x.allowProductionFromDocument===false),"no mode admission from gap");
 check(same(rules.p0NeverWaivable,gate.nonWaivableP0)&&same(rules.p0NeverWaivable,ops.nonWaivableP0),"five P0 gates cannot waive");
 check(rules.bNoChannel==="BLOCKED"&&rules.realEvidenceCannotBeSynthesized===true,"B no channel blocked");
 const s4Levels=d.s4Schema.properties.discoveryGaps.items.properties.classification.enum;
 check(same(s4Levels,rules.actions.map(x=>x.s4Classification)),"disposition mismatches S4 schema");
 check(adoption.recordKind==="TENANT_ADOPTION_CANDIDATE_NOT_APPROVAL"&&adoption.baselineCandidateId===f.baselineId,"adoption is candidate");
 check(adoption.tenantId===s4.tenantId&&adoption.profileVersion===s4.profileVersion&&adoption.tenantId===answers.tenantId,"adoption/S4/questionnaire refer to same tenant/version");
 check(adoption.sourceRefs.s4Dossier==="../s4/tenant-operations-discovery.example.json"&&adoption.sourceRefs.questionnaire==="questionnaire-responses.example.json","synthetic dossier/answer reference");
 check(same(adoption.requestedModes,s4.scope.requestedModes)&&adoption.admittedModes.length===0&&s4.scope.admittedModes.length===0&&!adoption.offlineWriteEnabled,"no admitted mode/offline");
 check([adoption.ownerAcceptanceRef,adoption.productVerificationRef,adoption.tenantGoLiveAcceptanceRef].every(x=>x===null),"no fake approvals");
 check(adoption.readiness.ev14==="NOT_RUN"&&adoption.readiness.ev15==="NOT_RUN"&&adoption.readiness.legacyWriterInventory==="NOT_COLLECTED","discovery not pilot");
 const gapIds=s4.discoveryGaps.map(x=>x.gapId);
 check(same(adoption.gapDecisions.map(x=>x.gapId),gapIds),"every discovery gap must be dispositioned once");
 for(const candidate of adoption.gapDecisions){
  const source=s4.discoveryGaps.find(x=>x.gapId===candidate.gapId);
  const policy=rules.actions.find(x=>x.code===candidate.action);
  check(!!source&&!!policy&&source.classification===policy.s4Classification,"gap classification mismatch "+candidate.gapId);
  check(same(source.controlIds,candidate.relatedControlIds),"gap control scope mismatch "+candidate.gapId);
  check(candidate.ownerReviewStatus==="PENDING_OWNER"&&candidate.ownerDecisionRef===null,"gap never self accepted");
  check(candidate.relatedPolicyIds.every(id=>qs.some(x=>x.policyIds.includes(id))),"gap related POL orphan");
  check(candidate.relatedCfgIds.every(id=>qs.some(x=>x.configurationIds.includes(id))),"gap related CFG orphan");
 }
 check(pc.recordKind==="PRODUCT_PILOT_CONTRACT_NOT_TENANT_ACCEPTANCE"&&pc.kind==="TENANT_AGNOSTIC","pilot contract must be reusable");
 check(same(pc.mvpModes,modeSet)&&same(pc.blockedModes,["B_NO_CHANNEL"]),"Product Pilot allowed modes");
 check(same(pc.sourceDecisions,["PADR-09","EVQ-01","EVQ-02","EVQ-07"]),"Pilot decision trace");
 check(pc.thresholdApprovalRef===null&&pc.actualPilotEvidenceRefs.length===0,"Product Pilot contract must not assert acceptance");
 check(pc.metricDefinitions.length===7&&pc.metricDefinitions.filter(x=>x.threshold==="UNSET").length===6,"metric thresholds pending");
 check(pc.principles.some(x=>x.includes("EV-14"))&&pc.principles.some(x=>x.includes("EV-15"))&&pc.principles.some(x=>x.includes("entire warehouse")),"common pilot contract");
 check(pilot.recordKind==="TENANT_PILOT_BLUEPRINT_NOT_ACCEPTED"&&pilot.tenantReference==="NPP-01"&&pilot.sourceDecision==="R009-D-15","NPP-01 D15 anchor");
 check(pilot.warehouseCode==="Kho-01"&&pilot.entireWarehouseStockScope===true&&pilot.warehouseOffWaveIncluded===true,"Kho-01 full stock scope");
 check(same(pilot.requestedModes,modeSet)&&pilot.admittedModes.length===0,"pilot modes not admitted");
 check(pilot.plannedDailyTrips.A===3&&pilot.plannedDailyTrips.B_ONLINE===3&&pilot.plannedDailyTrips.MIXED===2&&pilot.minimumRepresentativeDays>=5,"NPP D15 3+3+2 >=5");
 check(pilot.ev14.status==="NOT_RUN"&&pilot.ev15.status==="NOT_RUN"&&pilot.ev14.thresholdApprovalRef===null&&pilot.ev15.actualRunsRef===null,"Pilot stages never auto passed");
 check(same(pilot.uxScripts,Array.from({length:8},(_,i)=>"UX-0"+(i+1))),"eight UX tasks");
 check(Object.values(pilot.thresholds).every(x=>x==="UNSET"),"no fabricated thresholds");
 check(pilot.productVerificationRef===null&&pilot.tenantAcceptanceRef===null&&pilot.ownerApprovalRef===null,"no false tenant pilot signoffs");
 check(same(pilot.deferred,["B-CASE-001","B-CASE-002","B-CASE-003","LEGAL-MEMO","INV-09"]),"deferred B evidence preserved");
 check(d.r009Pilot.includes("3 A + 3 B + 2")&&d.r009Pilot.includes("5 ngày"),"R009 pilot historical decision drift");
 check(f.recordKind==="PRODUCT_BASELINE_FREEZE_CANDIDATE_NOT_OWNER_APPROVAL"&&f.status==="FREEZE_CANDIDATE_REVIEW_PENDING"&&f.productDocReadiness==="DOC_READY_CANDIDATE_ONLY","baseline not owner-approved");
 check(f.baselineFreezeCommitSha===null&&f.ownerAcceptance.state==="PENDING"&&f.ownerAcceptance.approvalRef===null&&f.ownerAcceptance.acceptedAt===null&&f.ownerAcceptance.acceptedBy===null,"no fake freeze signoff");
 check(f.decisionStatus==="OWNER_DECIDED_IN_CHAT"&&same(f.productDecisionIds,seq("PADR",9))&&same(f.evidenceGateDecisionIds,seq("EVQ",7)),"16 decisions versioned");
 check(f.tadrStatus.length===6&&same(f.tadrStatus.map(x=>x.tadrId),seq("TADR",6))&&f.tadrStatus.every(x=>x.status==="DESIGN_CANDIDATE"),"TADR-01..06 still design candidates");
 check(f.productVerification==="PENDING"&&f.tenantGoLiveAcceptance==="PENDING"&&f.s6HandoffStatus==="PREPARED_NOT_EXECUTED","no product/tenant verification");
 check(f.sourceDocuments.length>=15&&f.sourceDocuments.every(p=>d.sources[p]===true),"missing source manifest file");
 check(same(f.unresolved.evidenceIds,seq("EV",15))&&same(f.unresolved.bCases,["B-CASE-001","B-CASE-002","B-CASE-003"])&&f.unresolved.legalMemo==="EVIDENCE_PENDING"&&f.unresolved.inv09==="NOT_RUN","unresolved evidence preserved");
 check(same(Object.keys(f.modeState),Object.keys(statusSet)),"six mode states");
 for(const [k,v] of Object.entries(statusSet))check(f.modeState[k]===v&&gate.gates.some(x=>x.mode===k&&x.decision===v),"frozen mode unauthorized "+k);
 check(s3Ev.status==="NO_REAL_EVIDENCE_COLLECTED"&&s3Ev.records.length===15&&s3Ev.records.every(x=>x.realExecutionStatus==="NOT_RUN"&&x.realVerification==="EVIDENCE_PENDING"),"S5 must not promote S3 evidence");
 for(const tok of ["PADR-09","EVQ-05","EVQ-07","UNSET","B_NO_CHANNEL"])check(d.decisions.includes(tok),"Owner decision source drift "+tok);
 for(const [p,s] of Object.entries(d.docs))check(s.length>800&&s.includes("S5")&&s.includes("S6"),"S5 doc missing handoff "+p);
 return {status:"S5_CONTRACT_VALIDATED_NOT_TENANT_EVIDENCE",questions:qs.length,policyCoverage:24,controlCoverage:30,archetypes:4,dispositions:4,linkedGaps:gapIds.length,productModes:3,pilotRunsPerDay:8,pilotMinimumDays:pilot.minimumRepresentativeDays,baselineSourceDocuments:f.sourceDocuments.length,realTenantAssessments:0,ownerBaselineAccepted:false,productVerified:false,tenantGoLiveAccepted:false};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const result=validate(load());
  if(process.argv[2]==="--report"&&process.argv[3])fs.writeFileSync(process.argv[3],JSON.stringify(result,null,2)+"\n");
  console.log("PASS_S5_CONTRACT_ONLY "+JSON.stringify(result));
 }catch(e){console.error(e.stack);process.exitCode=1;}
}
