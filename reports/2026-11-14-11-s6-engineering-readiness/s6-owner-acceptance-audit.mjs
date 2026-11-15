// Read-only independent audit of signed Acceptance Record R. Not Product Verification.
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const dir=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../2026-11-13-10-product-reference-go-live-blueprint/s5/acceptance-record-r");
const read=(n)=>JSON.parse(fs.readFileSync(path.join(dir,n),"utf8"));
const a=read("product-baseline-acceptance.record.json"),m=read("baseline-review-matrix.json"),f=read("findings-disposition.json"),g=read("quality-gate.json"),o=read("outstanding-register.json");
const repo="chung6a8m/research-sme-phan-phoi-hang-tieu-dung",C="eb9c4b04e334530367b80ea4178edb4dd4a07491",R="e47c3feb44c02a0fdf46c35f6c4b2f57c4365470";
const roles=["PRODUCT_BA","TECHNICAL","QA","FINANCE","LEGAL","OPERATIONS"],findings=["PBA-02","PBA-03","PBA-09","TECH-08","TECH-11"];
const modes={A:"NO_GO_PENDING",B_ONLINE:"NO_GO_PENDING",MIXED:"NO_GO_PENDING",OFFLINE_WRITE:"DISABLED_PENDING",B_NO_CHANNEL:"BLOCKED",PRODUCTION_CUTOVER:"DISABLED_PENDING"};
const p0=["G-STOCK","G-CUT","G-IDEMP","G-LEDGER","G-INV"];
const fail=(x,s)=>{if(!x)throw Error("SIGNED_R_AUDIT: "+s);};
const eq=(x,y)=>JSON.stringify(x)===JSON.stringify(y);
const cid=(url)=>{const match=/^https:\/\/github\.com\/chung6a8m\/research-sme-phan-phoi-hang-tieu-dung\/pull\/2#issuecomment-(\d+)$/.exec(url||"");fail(match,"invalid PR comment URL");return Number(match[1]);};
function check(A,M,F,G,O){
 fail(A.recordKind==="PRODUCT_BASELINE_ACCEPTANCE_RECORD"&&A.state==="OWNER_BASELINE_ACCEPTED"&&A.scope==="PRODUCT_POLICY_AND_CONTRACT_ONLY","owner baseline signed scope");
 fail(A.snapshotCommitSha===C&&A.ownerApproval.approvedSnapshotSha===C&&A.ownerApproval.githubLogin==="chung6a8m","approved C sha and author");
 fail(cid(A.ownerApproval.githubCommentUrl)===6866595994&&A.ownerApproval.githubCreatedAt==="2026-11-13T22:33:42Z","Owner comment metadata");
 fail(A.decisionRefs.ownerReview.length===20&&A.decisionRefs.padr.length===9&&A.decisionRefs.evq.length===7,"Q/PADR/EVQ coverage");
 fail(A.reviewMatrixRef==="baseline-review-matrix.json"&&A.qualityGateRef==="quality-gate.json"&&A.outstandingRegisterRef==="outstanding-register.json","acceptance record refs");
 fail(A.productVerification==="PENDING"&&A.tenantGoLiveAcceptance==="PENDING"&&eq(A.modeState,modes),"no illicit mode admission");
 fail(M.recordKind==="BASELINE_REVIEW_MATRIX_POST_SIGNOFF_METADATA_ONLY"&&M.status==="REVIEW_COMPLETE_FOR_DOCUMENT_SCOPE"&&M.reviewedCommitSha===C&&M.ownerAcceptanceRef===A.ownerApproval.githubCommentUrl,"six-role matrix header");
 fail(M.reviewers.length===6&&eq(M.reviewers.map(x=>x.roleCode),roles),"six role identities");
 fail(new Set(M.reviewers.map(x=>x.reviewerRef)).size===6,"reviewer URLs must be distinct");
 for(const r of M.reviewers){
  fail(cid(r.reviewerRef)>0&&r.reviewerGitHubLogin==="chung6a8m"&&r.reviewedCommitSha===C&&r.reviewedAt,"reviewer ref / time");
  fail(r.state==="REVIEW_ACCEPTED_FOR_DOCUMENT_SCOPE"&&r.decision==="REVIEW_ACCEPTED_FOR_DOCUMENT_SCOPE"&&r.independentReviewer===false,"role scope/independence");
  fail(r.reviewMode===(roles.indexOf(r.roleCode)<3?"OWNER_MULTIROLE":"DELEGATED_SIGNATURE"),"role delegation");
  if(r.reviewMode==="DELEGATED_SIGNATURE")fail(r.authorityBasis.includes("NOT_INDEPENDENTLY_VERIFIED"),"delegation was not independently verified");
 }
 fail(F.approvedSnapshotCommitSha===C&&F.ownerApprovalRef===A.ownerApproval.githubCommentUrl&&eq(F.findings.map(x=>x.id),findings),"five finding IDs/Owner link");
 fail(F.allFiveDocumentScopeClosed===true&&F.runtimeFindingsClosed===false,"document findings cannot imply runtime verified");
 for(const x of F.findings){
  fail(x.disposition==="CLOSED_FOR_DOCUMENT_SCOPE"&&x.realSystemVerification==="EVIDENCE_PENDING_NOT_RUNTIME_CLOSED","finding is not runtime evidence");
  fail(x.roles.length===x.reviewerRefs.length&&x.roles.every((role,i)=>{const r=M.reviewers.find(y=>y.roleCode===role);return r&&r.reviewerRef===x.reviewerRefs[i]&&r.findingRefs.includes(x.id);}),"reviewerRef/findings join");
 }
 fail(G.checkedCommitSha===C&&G.result==="SYNTHETIC_CONTRACT_CI_SUCCESS"&&G.runs.length===4&&eq(G.runs.map(x=>x.stage),["S2","S3","S4","S5"]),"CI evidence class");
 for(const x of G.runs)fail(x.headSha===C&&x.conclusion==="SUCCESS"&&x.evidenceClass==="SYNTHETIC_CONTRACT_ONLY","CI must not be promoted to real E2E");
 fail(O.registerEntries.length===40&&O.acceptanceSnapshotCommitSha===C&&eq(O.modeStates,modes)&&eq(O.nonWaivableP0,p0),"40 outstanding and five P0");
 fail(O.realE2eRuns===0&&!O.productVerified&&!O.tenantGoLiveAccepted,"outstanding evidence still pending");
 for(const x of O.registerEntries){
  fail(x.closedAt===null&&x.actualOwnerRef===null&&x.evidenceRefs.length===0,"source evidence has not been collected");
  if(x.id.startsWith("TADR-"))fail(x.currentStatus==="DESIGN_CANDIDATE","TADR not approved");
  if(x.id.startsWith("EV-"))fail(["EVIDENCE_PENDING","MODEL_ONLY_REAL_PENDING"].includes(x.currentStatus),"EV still pending");
 }
 return {status:"LOCAL_SIGNED_R_CONSISTENCY_PASS_NOT_GITHUB_AUTHENTICATION",roles:6,findings:5,syntheticRuns:4,outstanding:40};
}
const local=check(a,m,f,g,o);
if(process.argv.includes("--self-test")){
 const cases=[
  ["fake_sha",d=>d[0].snapshotCommitSha="a".repeat(40)],
  ["fake_owner_ref",d=>d[0].ownerApproval.githubCommentUrl="https://example.com/fake"],
  ["independent",d=>d[1].reviewers[0].independentReviewer=true],
  ["duplicate_reviewer",d=>d[1].reviewers[1].reviewerRef=d[1].reviewers[0].reviewerRef],
  ["missing_finding",d=>d[2].findings.pop()],
  ["runtime_finding",d=>d[2].runtimeFindingsClosed=true],
  ["synthetic_becomes_real",d=>d[3].runs[0].evidenceClass="REAL_E2E"],
  ["p0_waiver",d=>d[4].nonWaivableP0.pop()],
  ["ev_fake_pass",d=>d[4].registerEntries.find(x=>x.id==="EV-01").currentStatus="PASS"],
  ["mode_unblocked",d=>d[0].modeState.B_NO_CHANNEL="GO"]];
 for(const [id,mutate] of cases){const d=[a,m,f,g,o].map(x=>structuredClone(x));mutate(d);let blocked=false;try{check(...d);}catch{blocked=true;}fail(blocked,"negative case escaped "+id);}
 console.log("PASS_SIGNED_R_NEGATIVE_CASES "+cases.length);
}
if(process.argv.includes("--github")){
 fail(!!process.env.GITHUB_TOKEN,"GITHUB_TOKEN missing for live GitHub authenticity audit");
 const api=async p=>{const r=await fetch("https://api.github.com/repos/"+repo+"/"+p,{headers:{Authorization:"Bearer "+process.env.GITHUB_TOKEN,Accept:"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28","User-Agent":"S6-Signed-R-Auditor"}});fail(r.ok,"GitHub status "+r.status+" at "+p);return await r.json();};
 const upstream=await api("pulls/2");fail(upstream.merged===true&&upstream.merge_commit_sha==="ba6d526b518b877c1f2c9f04732273f9f33968c4","upstream PR2 merge provenance");
 const commit=await api("commits/"+R);fail(commit.sha===R&&commit.parents.length===1&&commit.parents[0].sha===C,"R parent must be Cprime");
 const urls=[a.ownerApproval.githubCommentUrl,...m.reviewers.map(x=>x.reviewerRef)];
 const comments=await Promise.all(urls.map(x=>api("issues/comments/"+cid(x))));
 const s=comments[0];
 fail(s.html_url===urls[0]&&s.user.login==="chung6a8m"&&s.created_at===a.ownerApproval.githubCreatedAt,"Owner GitHub author/timestamp");
 for(const v of ["## OWNER_BASELINE_ACCEPTANCE","decision: OWNER_BASELINE_ACCEPTED","scope: PRODUCT_POLICY_AND_CONTRACT_ONLY","approvedSnapshotSha: "+C])fail(s.body.includes(v),"Owner comment missing "+v);
 for(let i=0;i<6;i++){
  const r=m.reviewers[i],c=comments[i+1];fail(c.html_url===r.reviewerRef&&c.user.login==="chung6a8m"&&c.created_at===r.reviewedAt,"review comment GitHub author/time");
  for(const v of ["roleCode: "+r.roleCode,"reviewMode: "+r.reviewMode,"reviewedCommitSha: "+C,"decision: REVIEW_ACCEPTED_FOR_DOCUMENT_SCOPE"])fail(c.body.includes(v),"review body role "+r.roleCode+" missing "+v);
 }
 for(const x of g.runs){
  const run=await api("actions/runs/"+x.runId);
  fail(run.head_sha===C&&run.status==="completed"&&run.conclusion==="success","CI run not matched to Cprime");
 }
 console.log(JSON.stringify({status:"LIVE_GITHUB_AUTHENTICITY_VERIFIED_DOCUMENT_ONLY",approvedSha:C,approvalRef:urls[0],reviewerCount:6,ciCount:4,productVerified:false,tenantGoLiveAccepted:false}));
}else console.log(JSON.stringify(local));
