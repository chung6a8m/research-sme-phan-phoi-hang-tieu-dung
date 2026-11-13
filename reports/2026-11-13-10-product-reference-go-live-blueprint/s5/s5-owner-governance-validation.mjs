import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const DIR=path.dirname(fileURLToPath(import.meta.url));
const json=p=>JSON.parse(fs.readFileSync(path.resolve(DIR,p),"utf8"));
const read=p=>fs.readFileSync(path.resolve(DIR,p),"utf8");
const check=(ok,why)=>{if(!ok)throw new Error("S5_OWNER_GOVERNANCE_CONTRACT_ERROR: "+why);};
const seq=(prefix,n)=>Array.from({length:n},(_,i)=>prefix+"-"+String(i+1).padStart(2,"0"));
const idsEqual=(actual,expected)=>Array.isArray(actual)&&actual.length===expected.length&&new Set(actual).size===actual.length&&[...actual].sort().join("|")===[...expected].sort().join("|");
const ownerQ=Array.from({length:20},(_,i)=>"Q"+String(i+1).padStart(2,"0"));
const p0=["G-STOCK","G-CUT","G-IDEMP","G-LEDGER","G-INV"];
const modes={A:"NO_GO_PENDING",B_ONLINE:"NO_GO_PENDING",MIXED:"NO_GO_PENDING",OFFLINE_WRITE:"DISABLED_PENDING",B_NO_CHANNEL:"BLOCKED",PRODUCTION_CUTOVER:"DISABLED_PENDING"};
const requiredSources=["owner-baseline-review-decisions.json","owner-baseline-review-decisions.vi.md","product-governance.vi.md","baseline-review-matrix.json","baseline-review-matrix.vi.md","outstanding-register.json","product-baseline-acceptance.schema.json","product-baseline-acceptance.example.json","product-extension-backlog-template.json","s5-owner-governance-validation.mjs","s5-owner-governance-regression.mjs","s5-owner-acceptance-schema-tests.py","product-baseline-snapshot-c.candidate.json","product-baseline-snapshot-c.schema.json","baseline-snapshot-c-readiness.vi.md","s5-snapshot-c-schema-tests.py"];
const expectedSemantics={
 Q01:"PRODUCT_VERIFIED",Q02:"commit C",Q03:"GitHub comment",Q04:"P0",Q05:"TADR",
 Q06:"S1–S5",Q07:"merge",Q08:"commit C",Q09:"Product/BA",Q10:"S5",
 Q11:"3 A + 3 B_ONLINE + 2 MIXED",Q12:"PR #1",Q13:"Baseline",Q14:"artifact",
 Q15:"build",Q16:"EV-14",Q17:"chặn",Q18:"Hotfix",Q19:"dry-run",Q20:"Product ADR"
};
export function loadOwnerGovernance(){
 return {
  decisions:json("owner-baseline-review-decisions.json"),matrix:json("baseline-review-matrix.json"),
  outstanding:json("outstanding-register.json"),acceptance:json("product-baseline-acceptance.example.json"),
  extension:json("product-extension-backlog-template.json"),snapshot:json("product-baseline-snapshot-c.candidate.json"),
  freeze:json("product-baseline-freeze.candidate.json"),
  evidence:json("../s3/evidence-register.json"),
  docs:{review:read("owner-baseline-review-decisions.vi.md"),governance:read("product-governance.vi.md"),matrix:read("baseline-review-matrix.vi.md"),snapshot:read("baseline-snapshot-c-readiness.vi.md")},
  sourcesPresent:Object.fromEntries(requiredSources.map(x=>[x,fs.existsSync(path.resolve(DIR,x))]))
 };
}
export function validateOwnerGovernance(d){
 const {decisions:q,matrix:m,outstanding:o,acceptance:a,extension:l,freeze:f,evidence:e,snapshot:s}=d;
 check(q.schemaVersion==="s5-owner-review-v1"&&q.recordKind==="OWNER_REVIEW_DECISIONS_IN_CHAT_NOT_BASELINE_APPROVAL","Q record not a signed approval");
 check(q.reviewDate==="2026-11-13"&&q.sourceType==="OWNER_INTERVIEW_CHAT"&&q.formalOwnerGitHubSignoff==="PENDING"&&q.signedBaselineCommitSha===null&&q.ownerApprovalRef===null,"Q interview not a GitHub signature");
 check(q.baselineTarget===f.baselineId,"Q target must equal freeze candidate");
 check(idsEqual(q.decisions.map(x=>x.decisionId),ownerQ),"20 unique Owner review decisions");
 for(const x of q.decisions){
  check(x.selectedOption===1&&x.decisionStatus==="OWNER_DECIDED_IN_CHAT"&&x.decisionDate==="2026-11-13"&&x.githubApprovalRef===null,"Owner chat decision status "+x.decisionId);
  check(x.rule.length>=35&&x.title.length>15&&x.affectedRefs.length>0&&x.rule.toLowerCase().includes(expectedSemantics[x.decisionId].toLowerCase()),"semantic decision trace "+x.decisionId);
  check(d.docs.review.includes("| **"+x.decisionId+"** |"),"Q Markdown missing "+x.decisionId);
 }
 for(const [k,token] of [["governance","Q20"],["governance","Q17"],["governance","Q19"],["matrix","PENDING_REVIEW"]])check(d.docs[k].includes(token),"governance document missing "+token);
 check(m.recordKind==="BASELINE_REVIEW_MATRIX_PRE_SIGNOFF"&&m.status==="REVIEW_NOT_COMPLETE"&&m.reviewedCommitSha===null&&m.ownerAcceptanceRef===null,"review matrix cannot be signed");
 check(m.targetBaseline===f.baselineId,"review target");
 const roles=["PRODUCT_BA","TECHNICAL","QA","FINANCE","LEGAL","OPERATIONS"];
 check(idsEqual(m.reviewers.map(x=>x.roleCode),roles)&&idsEqual(m.requiredRoleCodes,roles.slice(0,3))&&idsEqual(m.additionalMandatoryRoleCodesForQ09Cprime,roles.slice(3)),"Q09 six-role review coverage");
 const multi=m.ownerMultiRoleReviewPolicy;
 check(!!multi&&idsEqual(multi.roles,roles.slice(0,3))&&multi.singleOwnerMayPerformAllThree===true&&multi.independentReviewConfirmed===false&&multi.requiredSeparateReviewRefs===3&&multi.existingReviewRefs.length===0&&multi.status==="PENDING_ACTUAL_ROLE_REVIEW","Owner is not three independent reviewers");
 for(const r of m.reviewers){
  const required=m.requiredRoleCodes.includes(r.roleCode);
  check(r.participation===(required?"REQUIRED_BEFORE_OWNER_SIGNOFF":"REQUIRED_BY_Q09_SIGN02_BEFORE_OWNER_SIGNOFF"),"review participation "+r.roleCode);
  check(r.state==="PENDING_REVIEW"&&r.reviewerRef===null&&r.reviewedAt===null&&r.reviewEvidenceRefs.length===0&&r.findingRefs.length===0,"no fabricated review "+r.roleCode);
 }
 check(m.qualityGate.state==="NOT_EXECUTED_ON_FINAL_SNAPSHOT"&&m.qualityGate.checkedCommitSha===null&&m.qualityGate.candidateCommitSha===null&&m.qualityGate.ciRefs.length===0,"no fabricated final gate");
 check(o.recordKind==="OUTSTANDING_REGISTER_PENDING_INITIAL_SNAPSHOT_NOT_EVIDENCE"&&o.baselineTarget===f.baselineId&&o.status==="OPEN_NOT_PRODUCT_VERIFIED","outstanding cannot assert PASS");
 check(o.ownerGithubSignoffRef===null&&o.lastActualReviewRef===null&&o.realE2eRuns===0&&!o.productVerified&&!o.tenantGoLiveAccepted,"no false evidence/approval");
 check(idsEqual(o.nonWaivableP0,p0),"P0 five immutable gates");
 check(JSON.stringify(o.modeStates)===JSON.stringify(modes)&&JSON.stringify(o.modeStates)===JSON.stringify(f.modeState),"mode state cannot bypass freeze");
 const requiredIds=[...seq("TADR",6),...seq("EV",15),...p0,"B-CASE-001","B-CASE-002","B-CASE-003","LEGAL-MEMO","INV-09","TH-UX","TH-SLO","TH-COVERAGE","TH-CASE","TH-COST","TH-DATA","TH-RPO-RTO","TH-OFFLINE","TH-RETENTION"];
 check(idsEqual(o.registerEntries.map(x=>x.id),requiredIds),"outstanding missing/duplicate IDs");
 for(const x of o.registerEntries){
  check(x.ownerRole.length>3&&x.milestone.startsWith("S6-")&&x.requiredEvidence.length>20&&x.exitCriteria.length>20&&x.sourceRefs.length>0,"outstanding action fields "+x.id);
  check(x.evidenceRefs.length===0&&x.actualOwnerRef===null&&x.closedAt===null,"no real evidence/owner supplied "+x.id);
  if(x.id.startsWith("TADR-"))check(x.currentStatus==="DESIGN_CANDIDATE"&&x.sourceStatus==="DESIGN_CANDIDATE"&&x.kind==="TECHNICAL_DESIGN","TADR candidate "+x.id);
  if(x.id.startsWith("EV-")){
   const src=e.records.find(z=>z.evId===x.id);
   check(!!src&&x.sourceStatus===src.researchStatus&&x.currentStatus===(src.researchStatus==="MODEL_ONLY"?"MODEL_ONLY_REAL_PENDING":"EVIDENCE_PENDING"),"EV research vs real "+x.id);
   check(src.realExecutionStatus==="NOT_RUN"&&src.realVerification==="EVIDENCE_PENDING"&&src.acIds.every(id=>x.sourceRefs.includes(id)),"no real EV pass "+x.id);
  }
  if(p0.includes(x.id))check(x.priority==="P0_NON_WAIVABLE"&&x.currentStatus==="EVIDENCE_PENDING","P0 no waiver "+x.id);
  if(x.id.startsWith("TH-"))check(x.currentStatus==="UNSET"&&x.sourceStatus==="UNSET","no invented thresholds "+x.id);
  if(["B-CASE-001","B-CASE-002","B-CASE-003","LEGAL-MEMO"].includes(x.id))check(x.currentStatus==="EVIDENCE_PENDING","B evidence pending "+x.id);
  if(x.id==="INV-09")check(x.currentStatus==="NOT_RUN","INV-09 not run");
 }
 check(a.schemaVersion==="s5-owner-review-v1"&&a.recordKind==="PRODUCT_BASELINE_ACCEPTANCE_TEMPLATE_NOT_SIGNED"&&a.state==="PENDING_OWNER_SIGNATURE","sample must stay unsigned");
 check(a.snapshotCommitSha===null&&a.qualityGateRef===null&&a.ownerApproval.githubCommentUrl===null&&a.ownerApproval.githubLogin===null&&a.ownerApproval.githubCreatedAt===null&&a.ownerApproval.approvedSnapshotSha===null,"no fake C/SHA/comment/time");
 check(a.baselineId==="PRODUCT_BASELINE_V1"&&a.upstreamPrNumber===1&&a.sourcePrNumber===2&&a.scope==="PRODUCT_POLICY_AND_CONTRACT_ONLY","scope/stacking");
 check(a.reviewMatrixRef==="baseline-review-matrix.json"&&a.outstandingRegisterRef==="outstanding-register.json","separate registers");
 check(idsEqual(a.decisionRefs.ownerReview,ownerQ)&&idsEqual(a.decisionRefs.padr,seq("PADR",9))&&idsEqual(a.decisionRefs.evq,seq("EVQ",7)),"acceptance trace 20+16");
 check(a.productVerification==="PENDING"&&a.tenantGoLiveAcceptance==="PENDING"&&JSON.stringify(a.modeState)===JSON.stringify(modes),"no unsigned mode/tenant GO");
 check(l.recordKind==="PRODUCT_EXTENSION_BACKLOG_TEMPLATE_NOT_APPROVAL"&&l.sourceDecisionId==="Q20"&&l.defaultDisposition==="DEFER"&&l.entries.length===0,"L2 default backlog");
 check(idsEqual(l.allowedDispositions,["DEFER","PRODUCT_EXTENSION_REVIEW","REJECT_BLOCKED"])&&l.requireProductAdrForDevelopment&&!l.allowTenantFork&&!l.allowProductionFromBacklog&&l.requireOwnerApprovalForProductExtension,"no tenant fork or L2 autoGO");

 check(s.schemaVersion==="s5-snapshot-c-v1"&&s.recordKind==="PRODUCT_BASELINE_SNAPSHOT_C_PREPARATION_NOT_SIGNED"&&s.baselineId===f.baselineId,"Snapshot C must be unsigned candidate");
 check(s.sourcePrNumber===2&&s.baseBranch==="main"&&s.pr1Merge.prNumber===1&&s.pr1Merge.mergedIntoMain===true,"PR #1 must be merged and PR #2 based on main");
 check(s.pr1Merge.mergeCommitSha==="86850a7b4d515b8f14dd736cc9657e051c2ec588"&&s.upstreamReconciliationCommitSha==="0443705d4d5cd772a69eab9bf5b625e30a9c43a2","PR #1/PR #2 ancestry must be pinned");
 check(s.snapshotCommitSha===null&&s.commitShaResolution==="GITHUB_PR2_HEAD_SHA_AFTER_SNAPSHOT_COMMIT_CREATED","do not self-reference commit C");
 check(s.ownerApprovalRef===null&&s.ownerAcceptedAt===null&&s.acceptanceRecordRState==="NOT_CREATED","no fake Owner signature or commit R");
 check(s.finalSnapshotChecks==="PENDING_EXACT_COMMIT_C_CI"&&s.reviewMatrixState==="PENDING_ACTUAL_REVIEW","do not claim final CI or reviewer signoff from candidate");
 check(s.preSnapshotChecks.checkedSha===s.upstreamReconciliationCommitSha&&s.preSnapshotChecks.kind==="SYNTHETIC_CONTRACT_ONLY","pre-C CI bound to reconciled HEAD");
 check(idsEqual(s.preSnapshotChecks.runs.map(x=>x.name),["S2","S3","S4","S5"])&&s.preSnapshotChecks.runs.every(x=>x.result==="SUCCESS"&&x.url.endsWith(String(x.runId))),"4 pre-C workflow references must be real-pattern");
 check(s.scope.freezeInputBlobCount===f.reviewedInputBlobs.length&&s.scope.treeIdentity==="THE_GITHUB_COMMIT_C_HASH_CAPTURES_FULL_TREE_AT_APPROVAL","14 anchors are subset, C captures full Git tree");
 const requiredScope=["reports/2026-11-13-09-mvp-specification-baseline/**","reports/2026-11-13-10-product-reference-go-live-blueprint/**","briefs/2026-11-13-10-product-reference-go-live-blueprint.md","README.md"];
 check(requiredScope.every(p=>s.scope.baselinePaths.includes(p)),"C baseline must include R009/R010, B010 and README");
 check(s.scope.historicalModelEvidence==="R008_MODEL_ONLY_NOT_PRODUCT_VERIFICATION"&&s.productVerification==="PENDING"&&s.tenantGoLiveAcceptance==="PENDING","C never verifies product or tenant");
 check(JSON.stringify(s.modeState)===JSON.stringify(modes)&&JSON.stringify(s.modeState)===JSON.stringify(f.modeState),"Snapshot C cannot grant modes");
 check(d.docs.snapshot.includes("R009")&&d.docs.snapshot.includes("R010")&&d.docs.snapshot.includes("S5"),"Snapshot C readiness must describe scope and handoff");

 for(const p of requiredSources)check(d.sourcesPresent[p]===true&&f.sourceDocuments.includes(p),"S5 freeze candidate must enumerate governance source "+p);
 check(f.ownerAcceptance.state==="PENDING"&&f.baselineFreezeCommitSha===null&&f.productVerification==="PENDING"&&f.tenantGoLiveAcceptance==="PENDING","candidate still pending");
 return {status:"S5_OWNER_GOVERNANCE_CONTRACT_ONLY",ownerReviewDecisions:20,requiredReviewers:6,ownerCombinedRolesWithoutIndependence:3,outstanding:o.registerEntries.length,p0NonWaivable:5,githubOwnerSigned:false,realE2eRuns:0,productVerified:false,tenantGoLiveAccepted:false};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{console.log("PASS_S5_OWNER_GOVERNANCE_CONTRACT_ONLY "+JSON.stringify(validateOwnerGovernance(loadOwnerGovernance())));}
 catch(err){console.error(err.stack);process.exitCode=1;}
}
