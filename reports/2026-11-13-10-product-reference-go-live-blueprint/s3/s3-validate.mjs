import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const DIR=path.dirname(fileURLToPath(import.meta.url));
const read=p=>fs.readFileSync(path.join(DIR,p),"utf8");
const json=p=>JSON.parse(read(p));
const ids=(p,n)=>Array.from({length:n},(_,i)=>p+"-"+String(i+1).padStart(2,"0"));
const sorted=xs=>[...xs].sort().join("|");
const check=(condition,description)=>{if(!condition)throw Error("S3_CONTRACT_ERROR "+description);};

export function loadContract(){
  const feat=path.join(DIR,"features");
  return {
    acceptance:json("acceptance-matrix.json"),
    evidence:json("evidence-register.json"),
    fault:json("fault-injection-matrix.json"),
    gates:json("mode-gates.json"),
    schema:json("evidence-run.schema.json"),
    example:json("evidence-run.example.json"),
    features:fs.readdirSync(feat).filter(n=>n.endsWith(".feature")).sort().map(n=>({name:n,text:fs.readFileSync(path.join(feat,n),"utf8")})),
    r009:read("../../2026-11-13-09-mvp-specification-baseline/acceptance-tests-and-evidence.vi.md"),
    s1Trace:read("../s1-traceability.vi.md"),
    oracle:json("../s2/golden-oracles.json"),
    policy:read("../product-policy-catalog.vi.md"),
    sop:read("../sop-a-b-mixed.vi.md"),
    evq:read("../evq-acceptance-gates.vi.md"),
    s2Faults:read("../s2/fault-case-catalog.csv")
  };
}
export function validateContract(d){
  const A=d.acceptance.cases, E=d.evidence.records, F=d.fault.faults, M=d.gates.gates;
  for(const x of [d.acceptance,d.evidence,d.fault,d.gates])check(x.schemaVersion==="s3-v1","version mismatch");
  check(d.acceptance.status==="NOT_RUN_PRODUCT" && d.fault.status==="NOT_RUN_PRODUCT","runtime falsely passed");
  check(d.evidence.status==="NO_REAL_EVIDENCE_COLLECTED","real evidence falsely claimed");
  check(sorted(A.map(x=>x.acId))===sorted(ids("AC",21)),"AC-01..21 required");
  check(sorted(E.map(x=>x.evId))===sorted(ids("EV",15)),"EV-01..15 required");
  check(sorted(F.map(x=>x.faultId))===sorted(ids("F",22)),"F-01..22 required");
  const sourceAC=d.r009.split("### 1.1.")[0].split("\n").filter(x=>x.startsWith("| AC-"));
  const sourceBR=d.r009.split("### 1.3.")[1].split("### 1.4.")[0].split("\n").filter(x=>x.startsWith("| AC-"));
  const sourceEV=d.r009.split("## 2. Evidence Register")[1].split("## 3.")[0].split("\n").filter(x=>x.startsWith("| EV-"));
  check(sourceAC.length===21 && sourceBR.length===21 && sourceEV.length===15,"R009 source must have 21 AC, 15 EV and direct BR links");

  const s1BR=d.s1Trace.split("\n").filter(l=>l.startsWith("| BR-"));
  const s1D=d.s1Trace.split("\n").filter(l=>l.startsWith("| D-"));
  check(s1BR.length===24 && s1D.length===15,"S1 trace BR24/D15");
  const tokens=(s,re)=>[...new Set(s.match(re)||[])].sort();
  const brRef=new Map(s1BR.map(line=>{
    const c=line.split("|").map(x=>x.trim());
    return [c[1],{pol:tokens(c[2],/POL-\d{2}/g),sop:tokens(c[3],/SOP-\d{2}/g),dc:tokens(c[4],/DC-\d{2}/g),api:tokens(c[5],/API-\d{2}/g),sm:tokens(c[5],/SM-\d{2}/g)}];
  }));
  const decisionRefs=s1D.map(line=>{
    const c=line.split("|").map(x=>x.trim());
    return {id:c[1],pol:tokens(c[2],/POL-\d{2}/g),padrs:tokens(c[4],/PADR-\d{2}/g)};
  });
  const union=values=>[...new Set(values)].sort();
  const expectedS1=ac=>{
    const refs=ac.businessRules.map(br=>brRef.get(br));
    check(refs.every(Boolean),"orphan BR in S1 "+ac.acId);
    const policies=union(refs.flatMap(x=>x.pol));
    const decisions=decisionRefs.filter(d=>d.pol.some(p=>policies.includes(p)));
    return {
      derivation:"VIA_R009_DIRECT_BR_AND_S1_BR_TO_POLICY_TO_DECISION",
      policyIds:policies,sopIds:union(refs.flatMap(x=>x.sop)),
      dataContractIds:union(refs.flatMap(x=>x.dc)),apiIds:union(refs.flatMap(x=>x.api)),
      stateMachineIds:union(refs.flatMap(x=>x.sm)),
      decisionIdsViaPolicy:union(decisions.map(x=>x.id)),
      productAdrIdsViaPolicy:union(decisions.flatMap(x=>x.padrs))
    };
  };

  for(const ac of A){
    check(ac.productExecutionStatus==="NOT_RUN" && ac.implementationStatus==="STEPS_UNBOUND","unbound product test must be NOT_RUN "+ac.acId);
    const q09Req={"AC-01":"TECH-11","AC-02":"PBA-09","AC-07":"PBA-03","AC-08":"PBA-02","AC-11":"TECH-08","AC-19":"PBA-03"};
    if(q09Req[ac.acId])check(ac.q09SemanticAcceptance?.findingRefs.includes(q09Req[ac.acId])&&ac.q09SemanticAcceptance.requiredSemanticChecks.length>=2,"Q09 semantic AC missing "+ac.acId);
    check(sorted(ac.scenarioIds)===sorted(["S3-"+ac.acId.replace("-","")+"-P","S3-"+ac.acId.replace("-","")+"-N"]),"P/N scenarios "+ac.acId);
    check(ac.modes.length>0 && ac.fixtureRefs.length>0 && ac.evidenceIds.length>0,"incomplete AC "+ac.acId);
    check(ac.gateIds.every(x=>d.gates.nonWaivableP0.includes(x)),"unknown P0 gate "+ac.acId);
    const line=sourceAC.find(x=>x.startsWith("| "+ac.acId+" —"));
    const brLine=sourceBR.find(x=>x.startsWith("| "+ac.acId+" |"));
    check(!!line && !!brLine,"AC missing in R009 "+ac.acId);
    check(sorted(ac.evidenceIds)===sorted([...new Set((line.split("|").at(-2)||"").match(/EV-\d\d/g)||[])]),"EV mismatch with R009 "+ac.acId);
    check(sorted(ac.businessRules)===sorted([...new Set(brLine.match(/BR-\d\d/g)||[])]),"BR mismatch with R009 "+ac.acId);
    check(ac.evidenceIds.every(ev=>E.some(e=>e.evId===ev)),"orphan EV "+ac.acId);
    check(JSON.stringify(ac.s1Trace)===JSON.stringify(expectedS1(ac)),"S1 D/POL/SOP/DC/API/SM/PADR trace "+ac.acId);
  }
  for(const ev of E){
    check(sourceEV.some(x=>x.startsWith("| "+ev.evId+" |")),"source evidence missing "+ev.evId);
    const historical=["EV-05","EV-06","EV-07","EV-08","EV-09"].includes(ev.evId)?"MODEL_ONLY":"EVIDENCE_PENDING";
    check(ev.researchStatus===historical,"research status changed "+ev.evId);
    check(ev.realExecutionStatus==="NOT_RUN" && ev.realVerification==="EVIDENCE_PENDING","runtime evidence falsely promoted "+ev.evId);
    check(sorted(ev.acIds)===sorted(A.filter(x=>x.evidenceIds.includes(ev.evId)).map(x=>x.acId)),"inverse AC/EV mapping "+ev.evId);
    check(ev.requiredRoles.length>0 && ev.requiredRecords.includes("testRunId"),"EV lacks reviewer/run contract "+ev.evId);
  }
  const scenarios=[];
  for(const feat of d.features){
    check(feat.text.startsWith("# S3 CONTRACT ONLY"),"contract-only disclaimer missing "+feat.name);
    const blocks=feat.text.split(/\n(?=  @ac_\d\d\b)/).slice(1);
    for(const b of blocks){
      const tag=b.split("\n")[0], id=(tag.match(/@ac_(\d\d)/)||[])[1];
      const sid=(b.match(/^\s*Scenario:\s*(S3-AC\d\d-[PN])/m)||[])[1];
      const positive=tag.includes("@positive"),negative=tag.includes("@negative");
      check(!!id && !!sid && positive!==negative && tag.includes("@not_run_product"),"invalid scenario tags "+feat.name);
      check(sid==="S3-AC"+id+"-"+(positive?"P":"N"),"scenario ID mismatch "+sid);
      check(/^\s*Given \S/m.test(b) && /^\s*When \S/m.test(b) && /^\s*Then \S/m.test(b),"missing Gherkin steps "+sid);
      const ac=A.find(a=>a.acId==="AC-"+id);
      check(!!ac,"orphan scenario "+sid);
      const tags=[...tag.matchAll(/@ev_(\d\d)/g)].map(x=>"EV-"+x[1]);
      check(sorted(tags)===sorted(ac.evidenceIds),"scenario EV tags incorrect "+sid);
      scenarios.push(sid);
    }
  }
  check(new Set(scenarios).size===42 && scenarios.length===42 && sorted(scenarios)===sorted(A.flatMap(a=>a.scenarioIds)),"42 unique P/N Gherkin scenarios required");
  const s2=d.s2Faults.trim().split("\n").slice(1);
  check(s2.length===10,"S2 fault catalog 10 cases required");
  const s2map=new Map(s2.map(line=>{const a=line.split(",");return [a[0],{ac:a[3],ev:a[4]}]}));
  for(const f of F){
    check(f.executionStatus==="NOT_RUN_PRODUCT" && f.requiresApprovedSafetyPlan===true,"fault not safely pending "+f.faultId);
    check(f.acIds.length>0 && f.evIds.length>0 && f.targets.length>0 && !!f.requiredArtifacts,"incomplete fault "+f.faultId);
    check(f.acIds.every(x=>A.some(a=>a.acId===x)) && f.evIds.every(x=>E.some(e=>e.evId===x)),"orphan fault "+f.faultId);
    const origin=s2map.get(f.faultId);
    if(origin)check(f.sourceS2CaseId===f.faultId && f.acIds.includes(origin.ac) && f.evIds.includes(origin.ev),"S2 fault trace "+f.faultId);
    else check(f.sourceS2CaseId===null,"new fault must not claim S2 source "+f.faultId);
  }
  for(const id of ["AC-03","AC-19","AC-20","AC-21"]){
    check(d.oracle[id]?.status==="MODEL_ONLY","S2 oracle cannot be promoted "+id);
    check(A.find(a=>a.acId===id).fixtureRefs.includes("S2:"+id),"S2 oracle missing trace "+id);
  }
  check(sorted(M.map(x=>x.mode))===sorted(["A","B_ONLINE","MIXED","OFFLINE_WRITE","B_NO_CHANNEL","PRODUCTION_CUTOVER"]),"mode list");
  for(const m of M){
    check(m.requiredEvIds?.every(x=>E.some(e=>e.evId===x)),"mode dangling EV "+m.mode);
    check(!["GO","VERIFIED","ACCEPTED"].includes(m.decision),"mode falsely accepted "+m.mode);
  }
  const mode=id=>M.find(x=>x.mode===id);
  check(mode("B_NO_CHANNEL").decision==="BLOCKED" && mode("B_NO_CHANNEL").inMvp===false && mode("B_NO_CHANNEL").defaultEnabled===false,"B no-channel forbidden");
  check(sorted(mode("B_NO_CHANNEL").deferredEvidence)===sorted(["B-CASE-001","B-CASE-002","B-CASE-003","LEGAL-MEMO","INV-09"]),"B-CASE/legal/INV09 must remain pending");
  check(mode("OFFLINE_WRITE").decision==="DISABLED_PENDING" && mode("OFFLINE_WRITE").defaultEnabled===false && sorted(mode("OFFLINE_WRITE").requiredEvIds)===sorted(["EV-08","EV-09"]),"offline default is disabled");
  check(mode("PRODUCTION_CUTOVER").decision==="DISABLED_PENDING" && mode("PRODUCTION_CUTOVER").entireWarehouseWriterLockRequired===true,"full-warehouse cutover gate");
  check(sorted(mode("MIXED").dependsOnModes)===sorted(["A","B_ONLINE"]) && mode("MIXED").independentMixedE2ERequired===true,"Mixed admission cannot inherit A alone");
  check(["A","B_ONLINE","MIXED"].every(n=>mode(n).decision==="NO_GO_PENDING"),"MVP production requires evidence");
  check(d.gates.evidenceThresholds==="UNSET" && d.gates.productVerification==="PENDING" && d.gates.tenantGoLiveAcceptance==="PENDING","unapproved thresholds/verification");

  // F1: pilot readiness is not production Go-Live; do not lose inherited Mixed evidence.
  const commonEv=["EV-01","EV-02","EV-04","EV-05","EV-06","EV-07","EV-09","EV-10","EV-11","EV-12","EV-13","EV-14"];
  for(const id of ["A","B_ONLINE","MIXED"]){
    const m=mode(id),pilot=id==="MIXED"?[...commonEv,"EV-03"]:commonEv;
    check(sorted(m.requiredEvIds||[])===sorted(pilot),"legacy requiredEvIds is only PILOT_START "+id);
    check(sorted(m.pilotStartRequiredEvIds||[])===sorted(pilot),"PILOT_START completeness "+id);
    check(sorted(m.productionGoLiveRequiredEvIds||[])===sorted([...pilot,"EV-15"]),"PRODUCTION_GO_LIVE requires EV-15 "+id);
    check(!m.pilotStartRequiredEvIds.includes("EV-15") && m.productionGoLiveRequiredEvIds.includes("EV-14"),"EV14 before EV15 "+id);
  }
  for(const id of ["A","B_ONLINE","MIXED"]){
    const m=mode(id),scope=m.onlineIdempotencyEvidenceScope;
    const acs=id==="A"?["AC-11"]:id==="MIXED"?["AC-03","AC-09","AC-11"]:["AC-09","AC-11"];
    check(!!scope&&scope.evId==="EV-08"&&scope.evidenceScope==="ONLINE_IDEMPOTENCY_DURABLE_ACK_CONCURRENCY"&&sorted(scope.acIds||[])===sorted(acs)&&scope.gateId==="G-IDEMP"&&scope.realSystemEvidenceRequired===true&&scope.requiresFullOfflineDeviceE2E===false&&scope.confersOfflineWriterGrant===false&&m.gateIds.includes("G-IDEMP"),"online scope EV08/G-IDEMP missing or full offline improperly required "+id);
  }
  check(!mode("MIXED").requiredEvIds.includes("EV-08")&&!mode("MIXED").pilotStartRequiredEvIds.includes("EV-08")&&!mode("MIXED").productionGoLiveRequiredEvIds.includes("EV-08"),"Mixed online cannot require unscoped full EV08");
  check(sorted(d.gates.conditionalEvidenceWhenOfflineWrite?.requiredEvIds||[])===sorted(["EV-08","EV-09"])&&d.gates.conditionalEvidenceWhenOfflineWrite?.defaultDisabled===true&&d.gates.conditionalEvidenceWhenOfflineWrite?.requiredEvidenceScope==="OFFLINE_DEVICE_JOURNAL_REVOKE_RESTORE"&&mode("OFFLINE_WRITE").requiredEvidenceScope==="OFFLINE_DEVICE_JOURNAL_REVOKE_RESTORE"&&mode("OFFLINE_WRITE").requiresEV08AndEV09RealDeviceE2E===true,"offline requires EV08/09 separate real device evidence");
  check(d.gates.phasePolicy?.pilotStart?.includes("EV-14")&&d.gates.phasePolicy?.productionGoLive?.includes("EV-15"),"phase policy text missing");
  // F5: CI watches S1/EVQ changes; contract also verifies upstream reference presence.
  for(const id of new Set(A.flatMap(x=>x.s1Trace.policyIds)))check(d.policy.includes(id),"orphan policy in upstream "+id);
  for(const id of new Set(A.flatMap(x=>x.s1Trace.sopIds)))check(d.sop.includes(id),"orphan SOP in upstream "+id);
  for(const id of ["EVQ-05","EVQ-07","B_ONLINE","B_NO_CHANNEL","EV-14","EV-13/14/15"])check(d.evq.includes(id),"upstream EVQ drift "+id);
  for(const id of ["PBA-02","PBA-03","PBA-09","TECH-08","TECH-11"])check(d.policy.includes(id),"missing Q09 policy clarification "+id);
  check(d.sop.includes("COMMERCIAL_SETTLEMENT_POSTED")&&d.sop.includes("CASH_ON_DELIVERY"),"physical return/credit UNSET contract clarification missing");
  check(d.schema.$schema==="https://json-schema.org/draft/2020-12/schema","schema draft");
  const e=d.example;
  check(e.runKind==="PLACEHOLDER" && e.executionStatus==="NOT_RUN" && e.testRunId===null && e.actual===null && e.artifacts.length===0 && e.review.state==="NOT_SUBMITTED","example must remain placeholder");
  check(A.some(a=>a.acId===e.acId && a.scenarioIds.includes(e.scenarioId) && sorted(a.evidenceIds)===sorted(e.evIds)),"sample AC/EV/scenario mismatch");
  return {status:"S3_CONTRACT_VALIDATED_NOT_PRODUCT_TEST",acCount:A.length,evCount:E.length,gherkinCount:scenarios.length,faultCount:F.length,modes:M.length,realE2eRuns:0,ownerVerification:"PENDING"};
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try {
    const result=validateContract(loadContract());
    if(process.argv[2]==="--report" && process.argv[3])fs.writeFileSync(process.argv[3],JSON.stringify(result,null,2)+"\n");
    console.log("PASS_S3_CONTRACT_ONLY "+JSON.stringify(result));
  }catch(err){console.error(err.stack);process.exitCode=1;}
}

