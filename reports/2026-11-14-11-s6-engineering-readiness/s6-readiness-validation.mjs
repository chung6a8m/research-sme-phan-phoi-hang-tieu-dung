// S6 engineering readiness plan validator (PLAN_ONLY, read-only).
// Run: node reports/2026-11-14-11-s6-engineering-readiness/s6-readiness-validation.mjs [--self-test]
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const DIR=path.dirname(fileURLToPath(import.meta.url));
const read=p=>JSON.parse(fs.readFileSync(path.resolve(DIR,p),"utf8"));
const fail=(condition,message)=>{if(!condition)throw new Error("S6_PLAN_CONTRACT: "+message);};
const phases=["S6-0","S6-A","S6-B","S6-C","S6-D","S6-E","S6-F"];
const p0=["G-STOCK","G-CUT","G-IDEMP","G-LEDGER","G-INV"];
const modes={A:"NO_GO_PENDING",B_ONLINE:"NO_GO_PENDING",MIXED:"NO_GO_PENDING",OFFLINE_WRITE:"DISABLED_PENDING",B_NO_CHANNEL:"BLOCKED",PRODUCTION_CUTOVER:"DISABLED_PENDING"};
const root="../2026-11-13-10-product-reference-go-live-blueprint/";
export function validate(plan,acceptance,outstanding,acMatrix,evRegister,repoDecision){
 fail(plan.recordKind==="S6_IMPLEMENTATION_ROADMAP_PLAN_NOT_EXECUTION"&&plan.scope==="ENGINEERING_HANDOFF_AND_QUALITY_PLAN_ONLY","cannot claim implementation");
 fail(acceptance.state==="OWNER_BASELINE_ACCEPTED"&&acceptance.scope==="PRODUCT_POLICY_AND_CONTRACT_ONLY","Owner document baseline not accepted");
 fail(plan.upstream.ownerAcceptedSnapshotSha===acceptance.snapshotCommitSha&&plan.upstream.ownerAcceptedSnapshotSha===acceptance.ownerApproval.approvedSnapshotSha&&plan.upstream.metadataCommitR==="e47c3feb44c02a0fdf46c35f6c4b2f57c4365470","wrong approved baseline identity");
 fail(plan.upstream.ownerApprovalRef===acceptance.ownerApproval.githubCommentUrl&&plan.upstream.pr2MergeRequiredBeforeSourceBaselineIntegration===true,"upstream approval/merge dependency missing");
 fail(plan.sourceRepository==="NOT_SELECTED"&&plan.sourceRepoSelectionStatus==="BLOCKED_FOR_RUNTIME_START"&&plan.personnelAssignmentsStatus==="PENDING_REAL_ASSIGNMENT","fabricated source repo/personnel");
 fail(plan.upstream.pr2Merged===true&&plan.upstream.pr2MergeCommitSha==="ba6d526b518b877c1f2c9f04732273f9f33968c4"&&plan.upstream.s6ReadinessPullRequestBase==="main","PR2 merge/PR3 retarget identity drift");
 fail(plan.sourceRepositoryRecommendation==="NEW_DEDICATED_FMCG_DMS_SOURCE_REPOSITORY"&&plan.sourceRepositoryRecommendationStatus==="DECISION_CANDIDATE_OWNER_PENDING"&&plan.sourceRepositoryDecisionRef==="s6-0-source-repository-decision.candidate.json","source recommendation must not imply approved repository");
 fail(repoDecision.recordKind==="SOURCE_REPOSITORY_DECISION_CANDIDATE_NOT_OWNER_APPROVAL"&&repoDecision.decisionId==="S6-0-REPO-01"&&repoDecision.status==="OWNER_DECISION_PENDING","source decision not yet signed");
 fail(repoDecision.recommendedOption==="D"&&repoDecision.candidates.length===4&&repoDecision.ownerSelectedOption===null&&repoDecision.ownerApprovalRef===null&&repoDecision.actualSourceRepository===null&&repoDecision.repositoryCreated===false,"source repo was not created or selected");
 fail(plan.statuses.plan==="PREPARED_NOT_EXECUTED"&&plan.statuses.realE2eRuns===0&&plan.statuses.realEvidenceCreated===false&&plan.statuses.tadrApprovedCount===0&&plan.statuses.modeAdmissionGranted===false,"false runtime/evidence status");
 fail(plan.statuses.productVerification==="PENDING"&&plan.statuses.tenantGoLiveAcceptance==="PENDING","false product or tenant acceptance");
 fail(JSON.stringify(plan.modeStates)===JSON.stringify(modes)&&JSON.stringify(outstanding.modeStates)===JSON.stringify(modes),"mode promotion outside gate");
 fail(JSON.stringify(plan.nonWaivableP0)===JSON.stringify(p0)&&JSON.stringify(outstanding.nonWaivableP0)===JSON.stringify(p0),"non-waivable P0 missing");
 fail(JSON.stringify(plan.allowedMvpModes)===JSON.stringify(["A","B_ONLINE","MIXED"]),"MVP scope altered");
 fail(plan.pilot.daily.A===3&&plan.pilot.daily.B_ONLINE===3&&plan.pilot.daily.MIXED===2&&plan.pilot.minimumRepresentativeDays>=5&&plan.pilot.entireWarehouseStockScope==="Kho-01"&&plan.pilot.offWaveIncluded&&plan.pilot.ev14BeforeEv15&&plan.pilot.thresholdsStatus==="UNSET","NPP-01 D15/EV14/EV15 drift");
 fail(plan.phases.length===7&&JSON.stringify(plan.phases.map(x=>x.id))===JSON.stringify(phases),"S6 phases/order incomplete");
 const evSet=new Set(evRegister.records.map(x=>x.evId)),acSet=new Set(acMatrix.cases.map(x=>x.acId)),outSet=new Set(outstanding.registerEntries.map(x=>x.id));
 fail(evSet.size===15&&acSet.size===21&&outstanding.registerEntries.length===40,"upstream S3/outstanding coverage drift");
 for(const [id,state] of Object.entries(plan.tadrStates)){fail(outSet.has(id)&&state==="DESIGN_CANDIDATE","unreviewed TADR unexpectedly approved "+id);}
 fail(Object.keys(plan.tadrStates).length===6,"TADR count");
 for(const row of plan.phases){
   fail(row.status==="PLANNED_NOT_EXECUTED"&&row.deliverables.length>0&&row.exitCriteria.length>0&&row.owners.length>0,"phase claims execution or no DoD "+row.id);
   for(const dep of row.dependsOn)fail(phases.indexOf(dep)>=0&&phases.indexOf(dep)<phases.indexOf(row.id),"invalid phase dependency "+row.id);
   for(const id of row.tadrIds)fail(outSet.has(id)&&plan.tadrStates[id]==="DESIGN_CANDIDATE","unknown TADR "+id);
   for(const id of row.evIds)fail(evSet.has(id)&&outSet.has(id),"unknown EV "+id);
   for(const id of row.acIds)fail(acSet.has(id),"unknown AC "+id);
   for(const id of row.gateIds)fail(p0.includes(id),"unknown P0 "+id);
 }
 const cut=plan.phases.find(x=>x.id==="S6-E");
 fail(!!cut&&!cut.dependsOn.includes("S6-D")&&cut.tadrIds.includes("TADR-04")&&cut.tadrIds.includes("TADR-05"),"online MVP cutover must not depend on optional full offline implementation, while DR design remains mandatory");
 fail(plan.phases[0].realSystemEvidenceRequired===false&&plan.phases.slice(1).every(x=>x.realSystemEvidenceRequired===true),"source evidence boundary weakened");
 fail(plan.backlogControls.some(x=>x.id==="S6-P2-ACCEPTANCE-AUTHENTICITY"&&x.severity==="P2"&&x.status==="FOLLOW_UP"),"signed R validation follow-up missing");
 fail(plan.artifacts.actualEvidence==="NOT_COLLECTED"&&plan.artifacts.externalApprovals==="NOT_COLLECTED","fabricated evidence");
 return {status:"PASS_S6_PLAN_CONTRACT_ONLY",phases:plan.phases.length,realE2eRuns:0,verifiedProduct:false,verifiedTenant:false,openTadrs:6,upstreamOutstanding:outstanding.registerEntries.length,p0:p0.length};
}
const plan=read("s6-work-items.json"),acceptance=read(root+"s5/acceptance-record-r/product-baseline-acceptance.record.json"),outstanding=read(root+"s5/acceptance-record-r/outstanding-register.json"),acMatrix=read(root+"s3/acceptance-matrix.json"),evRegister=read(root+"s3/evidence-register.json");
const repoDecision=read("s6-0-source-repository-decision.candidate.json");
const result=validate(plan,acceptance,outstanding,acMatrix,evRegister,repoDecision);
if(process.argv.includes("--self-test")){
 const cases=[
  ["fake_prod_go",p=>p.statuses.productVerification="VERIFIED"],
  ["fake_mode_admitted",p=>p.modeStates.B_NO_CHANNEL="GO"],
  ["fake_real_run",p=>p.statuses.realE2eRuns=1],
  ["missing_P0",p=>p.nonWaivableP0.pop()],
  ["ev14_ev15_inverted",p=>p.pilot.ev14BeforeEv15=false],
  ["fake_tadr_accepted",p=>p.tadrStates["TADR-01"]="APPROVED"],
  ["bad_accepted_sha",p=>p.upstream.ownerAcceptedSnapshotSha="a".repeat(40)],
  ["fake_source_selected",p=>p.sourceRepository="some-imaginary-repo"],
  ["wrong_merge_sha",p=>p.upstream.pr2MergeCommitSha="a".repeat(40)],
  ["cutover_falsely_requires_offline_feature",p=>p.phases.find(x=>x.id==="S6-E").dependsOn.push("S6-D")]
 ];
 for(const [id,edit] of cases){const copy=structuredClone(plan);edit(copy);let rejected=false;try{validate(copy,acceptance,outstanding,acMatrix,evRegister,repoDecision);}catch{rejected=true;}fail(rejected,"negative case not rejected "+id);}
 const candidate=structuredClone(repoDecision);
 candidate.ownerSelectedOption="D";
 let incorrectlyApproved=false;try{validate(plan,acceptance,outstanding,acMatrix,evRegister,candidate);incorrectlyApproved=true;}catch{}
 fail(!incorrectlyApproved,"unsigned source repository cannot pretend Owner approval");
 console.log("PASS_S6_PLAN_NEGATIVES "+(cases.length+1));
}
console.log(JSON.stringify(result));
