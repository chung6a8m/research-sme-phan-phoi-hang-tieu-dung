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
export function validate(plan,acceptance,outstanding,acMatrix,evRegister,repoDecision,ownerDecision,sourceObs,q01Amendment,currentObs){
 fail(plan.recordKind==="S6_IMPLEMENTATION_ROADMAP_PLAN_NOT_EXECUTION"&&plan.scope==="ENGINEERING_HANDOFF_AND_QUALITY_PLAN_ONLY","cannot claim implementation");
 fail(acceptance.state==="OWNER_BASELINE_ACCEPTED"&&acceptance.scope==="PRODUCT_POLICY_AND_CONTRACT_ONLY","Owner document baseline not accepted");
 fail(plan.upstream.ownerAcceptedSnapshotSha===acceptance.snapshotCommitSha&&plan.upstream.ownerAcceptedSnapshotSha===acceptance.ownerApproval.approvedSnapshotSha&&plan.upstream.metadataCommitR==="e47c3feb44c02a0fdf46c35f6c4b2f57c4365470","wrong approved baseline identity");
 fail(plan.upstream.ownerApprovalRef===acceptance.ownerApproval.githubCommentUrl&&plan.upstream.pr2MergeRequiredBeforeSourceBaselineIntegration===true,"upstream approval/merge dependency missing");
 fail(plan.sourceRepository==="chung6a8m/MyDms"&&plan.sourceRepoSelectionStatus==="OWNER_DECIDED_SOURCE_BOOTSTRAP_PR_DRAFT"&&plan.personnelAssignmentsStatus==="PENDING_REAL_ASSIGNMENT","owner-selected repo must not imply provisioned personnel or runtime");
 fail(plan.upstream.pr2Merged===true&&plan.upstream.pr2MergeCommitSha==="ba6d526b518b877c1f2c9f04732273f9f33968c4"&&plan.upstream.s6ReadinessPullRequestBase==="main","PR2 merge/PR3 retarget identity drift");
 fail(plan.sourceRepositoryRecommendation==="NEW_DEDICATED_FMCG_DMS_SOURCE_REPOSITORY"&&plan.sourceRepositoryRecommendationStatus==="OWNER_SELECTED_D"&&plan.sourceRepositoryDecisionRef==="s6-0-owner-engineering-decisions.json"&&plan.ownerEngineeringDecisionsRef===plan.sourceRepositoryDecisionRef,"selected repository must trace to Owner Q01..Q08");
 fail(repoDecision.recordKind==="SOURCE_REPOSITORY_DECISION_CANDIDATE_NOT_OWNER_APPROVAL"&&repoDecision.decisionId==="S6-0-REPO-01"&&repoDecision.status==="OWNER_DECISION_PENDING","historical pre-Owner candidate was altered");
 fail(repoDecision.recommendedOption==="D"&&repoDecision.candidates.length===4&&repoDecision.ownerSelectedOption===null&&repoDecision.ownerApprovalRef===null&&repoDecision.actualSourceRepository===null&&repoDecision.repositoryCreated===false,"historical pre-Owner candidate is no longer frozen");
 fail(ownerDecision.recordKind==="OWNER_INTERVIEW_CHOICES_NOT_TECHNICAL_ADR_APPROVAL"&&ownerDecision.status==="OWNER_DECIDED_IN_CHAT_RECORDED_FOR_S6_0_PLANNING"&&ownerDecision.scope==="ENGINEERING_DIRECTION_FOR_S6_0_ONLY","Owner engineering direction not contract-only");
 fail(ownerDecision.approvedProductBaseline.immutableSnapshotSha===plan.upstream.ownerAcceptedSnapshotSha&&ownerDecision.approvedProductBaseline.acceptanceMetadataCommitR===plan.upstream.metadataCommitR,"Owner decision changed immutable C-prime/R");
 fail(ownerDecision.sourceRepo.selectedOption==="D"&&ownerDecision.sourceRepo.repository===plan.sourceRepository&&ownerDecision.sourceRepo.githubRepositoryId===1457279467&&ownerDecision.sourceRepo.existsVerified===true,"actual Owner-selected repository mismatch");
 fail(ownerDecision.sourceRepo.targetVisibility==="private"&&ownerDecision.sourceRepo.observedVisibilityAtDecision==="public"&&ownerDecision.sourceRepo.bootstrapStatus==="REPOSITORY_EMPTY_NO_BRANCH"&&ownerDecision.sourceRepo.branchActuallyExists===false,"fabricated private/bootstrap readiness");
 // Prior Private record is historical; Q01-v2 MIT/public is the effective source policy.
 fail(plan.sourceRepositoryVisibilityCurrent==="public"&&plan.sourceRepositoryVisibilityTarget==="public"&&plan.sourceRepositoryBootstrapStatus==="BOOTSTRAP_PR_DRAFT_FOUNDATION_CI_PASS_MIT_PENDING_MAIN"&&plan.sourceRepositoryObservationRef==="s6-0-source-bootstrap-observation.json"&&plan.sourceRepositoryCurrentObservationRef==="s6-0-mit-source-observation.json","current public MIT source observation missing");
 fail(sourceObs.recordKind==="REPO_AND_CI_OBSERVATION_NOT_PRODUCT_VERIFICATION"&&sourceObs.sourceRepository===plan.sourceRepository&&sourceObs.githubRepoId===1457279467&&sourceObs.githubVisibility==="private","unverified private repository");
 fail(sourceObs.bootstrapPullRequest==="https://github.com/chung6a8m/MyDms/pull/1"&&sourceObs.sourcePrDraft===true&&sourceObs.sourcePrMerged===false,"source PR merge/review fabricated");
 fail(sourceObs.ciObservedResult==="FAILURE_WITH_ZERO_EXECUTED_STEPS"&&sourceObs.ciFailedJobs.length===4&&sourceObs.actualDotnetBuilds===0&&sourceObs.actualSqlFixtures===0,"CI failure cannot be promoted to runtime testing");
 fail(sourceObs.gateA==="BLOCKED_PENDING_CI_RUNNER_AND_SAFE_SANDBOX"&&sourceObs.gateB==="BLOCKED_PENDING_REAL_TADR_REVIEW_AND_OWNER_AUTHORIZATION"&&sourceObs.productVerified===false&&sourceObs.tenantGoLiveAccepted===false,"source observation falsely elevated an acceptance gate");
 fail(q01Amendment.recordKind==="OWNER_Q01_LICENSE_POLICY_AMENDMENT_IN_CHAT_NOT_TECHNICAL_ADR_APPROVAL"&&q01Amendment.decisionId==="Q01"&&q01Amendment.version===2&&q01Amendment.supersedes.code==="PRIVATE_PROPRIETARY_SOURCE"&&q01Amendment.effectivePolicy.openSource===true&&q01Amendment.effectivePolicy.licenseSpdxId==="MIT"&&q01Amendment.effectivePolicy.sourceVisibility==="public","Q01 v2 effective MIT decision missing");
 fail(q01Amendment.effectivePolicy.repository===plan.sourceRepository&&q01Amendment.effectivePolicy.retainsPreviousQ02ToQ08===true&&q01Amendment.productVerified===false&&q01Amendment.tenantGoLiveAccepted===false,"Q01 license amendment cannot change product or tenant approval");
 fail(plan.sourceRepoLicenseAmendmentRef==="s6-0-owner-q01-mit-amendment.json"&&plan.sourceRepositoryLicense==="MIT"&&plan.sourceRepositoryLicenseState==="LICENSE_ON_PR_BRANCH_NOT_YET_MAIN","MIT source policy not linked or falsely merged");
 fail(currentObs.recordKind==="CURRENT_SOURCE_GITHUB_AND_FOUNDATION_CI_NOT_PRODUCT_VERIFICATION"&&currentObs.ownerEffectiveQ01Ref===plan.sourceRepoLicenseAmendmentRef&&currentObs.githubRepo===plan.sourceRepository&&currentObs.githubVisibility==="public"&&currentObs.selectedLicense==="MIT","GitHub current source differs from MIT decision");
 fail(currentObs.sourceCommitSha==="b4683f84248ba7f580c54c91022216101e1d747a"&&currentObs.ciHeadSha===currentObs.sourceCommitSha&&currentObs.ciRunStatus==="SUCCESS"&&currentObs.ciVerifiedJobs.length===5&&currentObs.sqlInfraSmokePassed===true,"source foundation CI attribution/coverage missing");
 fail(currentObs.sourcePRDraft===true&&currentObs.sourcePRMerged===false&&currentObs.licenseMergedIntoMain===false&&currentObs.mainBranchLegacyProprietaryReadmeStillPresent===true,"falsely claimed MIT merged into main");
 fail(currentObs.sqlBusinessE2eRuns===0&&currentObs.sandboxApprovedForFaultInjection===false&&currentObs.secureEvidenceStore==="NOT_CONFIGURED"&&currentObs.gateA===plan.gates.gateA&&currentObs.productVerified===false&&currentObs.tenantGoLiveAccepted===false,"source CI cannot imply spike admission or product verification");
 const choices=ownerDecision.decisions||[];
 fail(choices.length===8&&JSON.stringify(choices.map(x=>x.id))===JSON.stringify(["Q01","Q02","Q03","Q04","Q05","Q06","Q07","Q08"])&&JSON.stringify(choices.map(x=>x.selectedOption))===JSON.stringify([1,1,1,1,1,1,3,1]),"Owner interview selection drift");
 fail(ownerDecision.ownerSource.ownerGitHubSignoffForQ01ToQ08==="NOT_SEPARATELY_ATTESTED_ON_GITHUB","invented authenticated Owner GitHub signature");
 fail(ownerDecision.gates.gateA.ready===false&&ownerDecision.gates.gateB.ready===false&&ownerDecision.gates.gateB.ownerDirection==="PENDING","Gate A/B cannot self-pass");
 fail(plan.gates.gateA==="BLOCKED_PENDING_B04_SECURE_EVIDENCE_AND_SAFETY_REVIEW"&&plan.gates.gateB==="BLOCKED_PENDING_TADR_REVIEW_AND_OWNER_RUNTIME_AUTHORIZATION","fake foundation/runtime admission");
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
const ownerDecision=read("s6-0-owner-engineering-decisions.json");
const sourceObs=read("s6-0-source-bootstrap-observation.json");
const q01Amendment=read("s6-0-owner-q01-mit-amendment.json");
const currentObs=read("s6-0-mit-source-observation.json");
const result=validate(plan,acceptance,outstanding,acMatrix,evRegister,repoDecision,ownerDecision,sourceObs,q01Amendment,currentObs);
if(process.argv.includes("--self-test")){
 const cases=[
  ["fake_prod_go",p=>p.statuses.productVerification="VERIFIED"],
  ["fake_mode_admitted",p=>p.modeStates.B_NO_CHANNEL="GO"],
  ["fake_real_run",p=>p.statuses.realE2eRuns=1],
  ["missing_P0",p=>p.nonWaivableP0.pop()],
  ["ev14_ev15_inverted",p=>p.pilot.ev14BeforeEv15=false],
  ["fake_tadr_accepted",p=>p.tadrStates["TADR-01"]="APPROVED"],
  ["bad_accepted_sha",p=>p.upstream.ownerAcceptedSnapshotSha="a".repeat(40)],
  ["fake_repo_retarget",p=>p.sourceRepository="some-imaginary-repo"],
  ["fake_gate_B",p=>p.gates.gateB="AUTHORIZED"],
  ["fake_private_reversion",p=>p.sourceRepositoryVisibilityCurrent="private"],
  ["wrong_merge_sha",p=>p.upstream.pr2MergeCommitSha="a".repeat(40)],
  ["cutover_falsely_requires_offline_feature",p=>p.phases.find(x=>x.id==="S6-E").dependsOn.push("S6-D")]
 ];
 for(const [id,edit] of cases){const copy=structuredClone(plan);edit(copy);let rejected=false;try{validate(copy,acceptance,outstanding,acMatrix,evRegister,repoDecision,ownerDecision,sourceObs,q01Amendment,currentObs);}catch{rejected=true;}fail(rejected,"negative case not rejected "+id);}
 const candidate=structuredClone(repoDecision);
 candidate.ownerSelectedOption="D";
 let incorrectlyApproved=false;try{validate(plan,acceptance,outstanding,acMatrix,evRegister,candidate,ownerDecision,sourceObs,q01Amendment,currentObs);incorrectlyApproved=true;}catch{}
 fail(!incorrectlyApproved,"historical candidate must remain an unsigned candidate");
 const forged=structuredClone(ownerDecision);forged.decisions[6].selectedOption=1;
 let rejectedForged=false;try{validate(plan,acceptance,outstanding,acMatrix,evRegister,repoDecision,forged,sourceObs,q01Amendment,currentObs);}catch{rejectedForged=true;}
 fail(rejectedForged,"false Q07 Owner selection not rejected");
 const fakeCi=structuredClone(sourceObs);fakeCi.ciObservedResult="SUCCESS";
 let ciRejected=false;try{validate(plan,acceptance,outstanding,acMatrix,evRegister,repoDecision,ownerDecision,fakeCi,q01Amendment,currentObs);}catch{ciRejected=true;}
 fail(ciRejected,"historical unexecuted private-repo CI cannot be promoted to SUCCESS");
 const fakeLicense=structuredClone(q01Amendment);fakeLicense.effectivePolicy.licenseSpdxId="GPL-3.0";
 let rejectedLicense=false;try{validate(plan,acceptance,outstanding,acMatrix,evRegister,repoDecision,ownerDecision,sourceObs,fakeLicense,currentObs);}catch{rejectedLicense=true;}
 fail(rejectedLicense,"Q01 v2 MIT amendment bypassed");
 const fakeCurrent=structuredClone(currentObs);fakeCurrent.licenseMergedIntoMain=true;
 let rejectedMain=false;try{validate(plan,acceptance,outstanding,acMatrix,evRegister,repoDecision,ownerDecision,sourceObs,q01Amendment,fakeCurrent);}catch{rejectedMain=true;}
 fail(rejectedMain,"proposed MIT license incorrectly promoted to main");
 console.log("PASS_S6_PLAN_NEGATIVES "+(cases.length+5));
}
console.log(JSON.stringify(result));
