import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const DIR=path.dirname(fileURLToPath(import.meta.url));
const read=p=>fs.readFileSync(path.join(DIR,p),"utf8");
const json=p=>JSON.parse(read(p));
const check=(ok,msg)=>{if(!ok)throw Error("S4_CONTRACT_ERROR: "+msg);};
const sorted=xs=>[...xs].sort().join("|");
const seq=(p,n)=>Array.from({length:n},(_,i)=>p+"-"+String(i+1).padStart(2,"0"));
const DOCS=[
 "README.md","tenant-onboarding-and-cutover.vi.md","backup-restore-and-recovery.vi.md",
 "monitoring-incident-hypercare.vi.md","preflight-seller-provider-accounting-privacy.vi.md",
 "raci-training-signoff.vi.md"
];
export function load(){
 return {c:json("operational-controls.json"),d:json("tenant-operations-dossier.example.json"),
 schema:json("tenant-operations-dossier.schema.json"),discovery:json("tenant-operations-discovery.example.json"),
 modes:json("../s3/mode-gates.json"),ac:json("../s3/acceptance-matrix.json"),
 ev:json("../s3/evidence-register.json"),fault:json("../s3/fault-injection-matrix.json"),
 upstream:{policy:read("../product-policy-catalog.vi.md"),sop:read("../sop-a-b-mixed.vi.md"),role:read("../role-and-approval-matrix.vi.md"),evq:read("../evq-acceptance-gates.vi.md")},
  docs:Object.fromEntries(DOCS.map(f=>[f,read(f)]))};
}
export function validate(x){
 const c=x.c.controls,d=x.d,g=x.modes.gates,E=x.ev.records,A=x.ac.cases,F=x.fault.faults;
 check(x.c.schemaVersion==="s4-v1"&&x.d.schemaVersion==="s4-v1","S4 version");
 check(x.c.kind==="OPERATIONS_CONTROL_CATALOG_NOT_A_GOLIVE_DECISION" && x.c.status==="NOT_EVALUATED","catalog cannot issue GO");
 check(c.length===30 && sorted(c.map(o=>o.controlId))===sorted(seq("OPS",30)),"OPS-01..30 unique");
 check(c.filter(o=>o.package==="P06").length===22 && c.filter(o=>o.package==="P08").length===8,"P06/P08 counts");
 check(sorted(x.c.nonWaivableP0)===sorted(x.modes.nonWaivableP0),"five nonwaivable gates match S3");
 check(x.modes.productVerification==="PENDING"&&x.modes.tenantGoLiveAcceptance==="PENDING","S3 approval pending");
 check(x.ev.status==="NO_REAL_EVIDENCE_COLLECTED","S3 evidence is still pending");
 const modeIds=g.map(z=>z.mode),evIds=E.map(z=>z.evId),acIds=A.map(z=>z.acId),faultIds=F.map(z=>z.faultId);
 check(sorted(evIds)===sorted(seq("EV",15)) && sorted(acIds)===sorted(seq("AC",21)),"S3 trace source");
 check(x.schema.$schema==="https://json-schema.org/draft/2020-12/schema","JSON Schema standard");
 for(const o of c){
  check(o.assessmentStatus==="NOT_EVALUATED","control cannot self-certify "+o.controlId);
  check(["P06","P08"].includes(o.package)&&["P0","P1"].includes(o.severity),"package/severity "+o.controlId);
  check(o.title.length>8&&o.requiredEvidence.length>15&&o.failureAction.length>15,"missing proof/failure action "+o.controlId);
  check(o.requiredRoles.length>0&&o.appliesToModes.length>0&&o.evIds.length>0&&o.acIds.length>0,"missing roles/trace "+o.controlId);
  check(o.appliesToModes.every(id=>modeIds.includes(id)),"unknown mode "+o.controlId);
  check(o.evIds.every(id=>evIds.includes(id)) && o.acIds.every(id=>acIds.includes(id)),"dangling AC/EV "+o.controlId);
  check(o.gateIds.every(id=>x.c.nonWaivableP0.includes(id)),"dangling P0 gate "+o.controlId);
  check(!o.failureAction.includes("GO_APPROVED"),"unsupported GO claim "+o.controlId);
 }
 for(const gate of x.c.nonWaivableP0)check(c.some(o=>o.severity==="P0"&&o.gateIds.includes(gate)),"P0 coverage "+gate);
 for(const id of evIds)check(c.some(o=>o.evIds.includes(id)),"missing EV trace "+id);
 const op=id=>c.find(o=>o.controlId===id);
 check(op("OPS-05").requiredEvidence.includes("UI/API/SQL/job/import/ETL/offline") && op("OPS-05").gateIds.includes("G-STOCK"),"whole warehouse path inventory");
 check(op("OPS-08").evIds.includes("EV-03") && op("OPS-08").appliesToModes.includes("MIXED"),"mixed source ledger EV-03 trace");
 check(op("OPS-13").severity==="P0" && op("OPS-13").gateIds.includes("G-STOCK"),"legacy writer fence P0");
 check(op("OPS-14").failureAction.includes("Forward-only"),"first business effect must be irreversible");
 check(op("OPS-18").appliesToModes.includes("OFFLINE_WRITE") && op("OPS-18").evIds.includes("EV-08"),"offline real device gate");
 check(op("OPS-21").evIds.includes("EV-14") && op("OPS-21").requiredEvidence.includes("Signed"),"pilot thresholds before readiness");
 check(op("OPS-22").evIds.includes("EV-15") && op("OPS-22").requiredEvidence.includes(">=5"),"pilot after execution");
 check(op("OPS-25").appliesToModes.includes("B_NO_CHANNEL") && op("OPS-25").failureAction.includes("WAITING_INVOICE_CHANNEL"),"B no-channel fail closed");
 check(op("OPS-27").requiredEvidence.includes("manual") && op("OPS-28").failureAction.includes("POSTED not RECONCILED_OK"),"accounting/manual reconciliation");
 check(op("OPS-29").requiredEvidence.includes("retention") && op("OPS-30").requiredEvidence.includes("F-06/F-22"),"privacy/revoke/restore");
 for(const [id,expected] of Object.entries({A:"NO_GO_PENDING",B_ONLINE:"NO_GO_PENDING",MIXED:"NO_GO_PENDING",OFFLINE_WRITE:"DISABLED_PENDING",B_NO_CHANNEL:"BLOCKED",PRODUCTION_CUTOVER:"DISABLED_PENDING"})){
  const m=g.find(a=>a.mode===id), e=d.modeDecisions.find(a=>a.mode===id);
  check(m&&e&&m.decision===expected&&e.decision===expected&&e.admissionRecordRef===null,"mode still pending "+id);
 }
 check(g.length===6&&d.modeDecisions.length===6 && new Set(d.modeDecisions.map(z=>z.mode)).size===6,"6 mode decisions unique");
 check(g.find(m=>m.mode==="B_NO_CHANNEL").inMvp===false && g.find(m=>m.mode==="B_NO_CHANNEL").defaultEnabled===false,"B no-channel deferred");
 check(g.find(m=>m.mode==="OFFLINE_WRITE").defaultEnabled===false&&g.find(m=>m.mode==="MIXED").dependsOnModes.join("|")==="A|B_ONLINE","offline/Mixed admission");
 for(const e of E){
  check(e.realExecutionStatus==="NOT_RUN" && e.realVerification==="EVIDENCE_PENDING","no real S3 evidence "+e.evId);
  const historic=["EV-05","EV-06","EV-07","EV-08","EV-09"].includes(e.evId)?"MODEL_ONLY":"EVIDENCE_PENDING";
  check(e.researchStatus===historic,"research evidence unchanged "+e.evId);
 }
 check(d.recordKind==="UNEXECUTED_TEMPLATE_NOT_GATE_APPROVAL"&&d.tenantId===null&&d.profileVersion===null&&d.createdAt===null,"template only");
 check(d.scope.entireWarehouseStockScope===true && d.scope.requestedModes.length===0 && d.scope.admittedModes.length===0,"full stock/no auto admission");
 check(d.runtime.commitSha===null && d.runtime.environment===null,"no fake build/environment");
 check(d.cutover.stage==="NOT_STARTED"&&d.cutover.firstEffectId===null&&d.cutover.openingApprovalRef===null&&d.cutover.forwardRecoveryOnly===true,"no fake cutover/rollback");
 check(d.signoffs.length===0&&d.evidenceIndex.length===0&&d.openCases.length===0,"no fabricated signoffs/evidence/cases");
 check(d.readiness.evId==="EV-14"&&d.readiness.state==="NOT_RUN"&&d.readiness.thresholdApprovalRef===null&&d.readiness.denominatorPlanRef===null,"EV14 no false readiness");
 check(d.pilot.evId==="EV-15"&&d.pilot.state==="NOT_RUN"&&d.pilot.actualRunsRef===null,"EV15 no false pilot");
 check(d.assessments.length===30&&sorted(d.assessments.map(a=>a.controlId))===sorted(c.map(o=>o.controlId)),"dossier matches controls");
 for(const a of d.assessments)check(a.status==="NOT_EVALUATED"&&a.evidenceRefs.length===0&&a.reviewer===null&&a.reviewedAt===null,"unexecuted dossier assessment "+a.controlId);
 check(sorted(d.deferredEvidence.map(z=>z.id))===sorted(["B-CASE-001","B-CASE-002","B-CASE-003","LEGAL-MEMO","INV-09"]),"deferred record set");
 for(const e of d.deferredEvidence)check(e.state===(e.id==="INV-09"?"NOT_RUN":"EVIDENCE_PENDING"),"deferred still pending "+e.id);

  // F3/F4/F6 — keep discovery pre-runtime and never treat dossier as admission authority.
  check(d.discoveryGaps.length===0 && d.p1Exceptions.length===0,"blank placeholder cannot contain gaps or exceptions");
  const discovery=x.discovery;
  check(discovery.recordKind==="TENANT_DISCOVERY_GAP_NOT_GATE_APPROVAL" &&
    discovery.tenantId==="SYNTHETIC_ONLY_NOT_NPP_01" &&
    discovery.runtime.commitSha===null && discovery.runtime.environment===null,"discovery cannot invent runtime");
  check(discovery.scope.admittedModes.length===0 && discovery.signoffs.length===0 &&
    discovery.evidenceIndex.length===0 && discovery.modeDecisions.every(z=>z.admissionRecordRef===null),"discovery cannot claim approval");
  check(discovery.discoveryGaps.length===1 && discovery.discoveryGaps[0].status==="OPEN_UNVERIFIED" &&
    discovery.discoveryGaps[0].controlIds.every(id=>c.some(z=>z.controlId===id)) &&
    new Set(discovery.discoveryGaps[0].controlIds).size===discovery.discoveryGaps[0].controlIds.length,"discovery gap trace/status/unique controls");
  check(discovery.p1Exceptions.length===0 && d.assessments.length===30,"no self-approved P1 exceptions");
  check(x.schema.properties.recordKind.enum.includes("TENANT_DISCOVERY_GAP_NOT_GATE_APPROVAL") &&
    x.schema.properties.discoveryGaps?.type==="array" && x.schema.properties.p1Exceptions?.type==="array","dossier gap/P1 schema");
  // F5: follow upstream changes with path filters and assert essential policy links.
  for(const token of ["POL-02","POL-17","UNSET"])check(x.upstream.policy.includes(token),"S4 policy drift "+token);
  for(const token of ["SOP-03","SOP-09","SOP-11"])check(x.upstream.sop.includes(token),"S4 SOP drift "+token);
  for(const token of ["AP-08","AP-09","maker"])check(x.upstream.role.includes(token),"S4 RACI drift "+token);
  for(const token of ["EVQ-05","EVQ-07","B_ONLINE","B_NO_CHANNEL"])check(x.upstream.evq.includes(token),"S4 EVQ drift "+token);
 const needed={
  "tenant-onboarding-and-cutover.vi.md":["Kho-01","C0","C8","firstEffectId","AP-08","FORWARD_RECOVERY_ONLY","B_NO_CHANNEL"],
  "backup-restore-and-recovery.vi.md":["DR-01","DR-08","PrivacyActionLedger","UNKNOWN","F-22","UNSET"],
  "monitoring-incident-hypercare.vi.md":["CLOSED_WITH_OPEN_CASES","asOf","RECONCILED_OK","EV-14","EV-15"],
  "preflight-seller-provider-accounting-privacy.vi.md":["PF-INV-01","PF-ACC-01","PF-PRI-01","B-CASE-001","MANUAL_REGISTER","EVIDENCE_PENDING"],
  "raci-training-signoff.vi.md":["AP-08","AP-09","AP-10","EV-14","EV-15","maker"],
  "README.md":["P06","P08","NOT_EXECUTED","PRODUCT_VERIFIED","B_NO_CHANNEL"]
 };
 for(const [doc,tokens] of Object.entries(needed)){
  check(x.docs[doc]?.length>1200,"missing/empty S4 document "+doc);
  for(const t of tokens)check(x.docs[doc].includes(t),"S4 document "+doc+" missing "+t);
 }
 return {status:"S4_CONTRACT_VALIDATED_NOT_OPERATIONAL_EVIDENCE",controls:c.length,p06:22,p08:8,evReferences:evIds.length,gateTypes:x.c.nonWaivableP0.length,realOperationalDrills:0,tenantSignoffs:0,productVerified:false,tenantGoLiveAccepted:false};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const r=validate(load());
  if(process.argv[2]==="--report"&&process.argv[3])fs.writeFileSync(process.argv[3],JSON.stringify(r,null,2)+"\n");
  console.log("PASS_S4_CONTRACT_ONLY "+JSON.stringify(r));
 }catch(e){console.error(e.stack);process.exitCode=1;}
}
