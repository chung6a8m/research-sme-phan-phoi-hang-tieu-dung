/* Regression for S2 CSV/schema/ledger projections; never writes to any DMS database. */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import {fileURLToPath} from "node:url";
import {spawnSync} from "node:child_process";
const root=path.dirname(fileURLToPath(import.meta.url));
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),"r010-s2-regression-"));
const dict=JSON.parse(fs.readFileSync(path.join(root,"data-dictionary.json"),"utf8"));
const specs=Object.fromEntries(dict.tables.map(x=>[x.id,x]));
const esc=v=>/[",\r\n]/.test(v)?'"'+v.replaceAll('"','""')+'"':v;
function call(args){
 const p=spawnSync(process.execPath,args,{encoding:"utf8",maxBuffer:16*1024*1024});
 if(p.error||![0,2].includes(p.status))throw Error("Unexpected process status: "+(p.error??p.stderr));
 return p;
}
function modify(dir,id,index,changes,withHash=true){
 const spec=specs[id],file=path.join(dir,id+"-"+spec.name+".csv");
 const lines=fs.readFileSync(file,"utf8").trimEnd().split("\n"),headers=lines[0].split(",");
 // Generated synthetic inputs are simple CSV; the edit may introduce quotes/commas.
 const cells=lines[index+1].split(",");
 if(cells.length!==headers.length)throw Error("Unexpected fixture CSV input shape "+id);
 const row=Object.fromEntries(headers.map((h,i)=>[h,cells[i]]));
 Object.assign(row,changes);
 if(withHash){
  const business=spec.fields.map(f=>String(row[f.name]??""));
  const provenance=["tenantCode","schemaVersion","sourceSystem","sourceRecordId","importBatchId"].map(k=>String(row[k]??""));
  row.sourceHash=crypto.createHash("sha256").update(business.concat(provenance).join("|"),"utf8").digest("hex");
 }
 lines[index+1]=headers.map(k=>esc(String(row[k]??""))).join(",");
 fs.writeFileSync(file,lines.join("\n")+"\n","utf8");
}
function field(dir,id,index,key){
 const spec=specs[id],file=path.join(dir,id+"-"+spec.name+".csv");
 const lines=fs.readFileSync(file,"utf8").split("\n");
 return lines[index+1].split(",")[lines[0].split(",").indexOf(key)];
}
let cases=0;
function check(name,edit,expected=null){
 const dir=path.join(tmp,"case-"+String(++cases).padStart(2,"0"));
 fs.cpSync(path.join(tmp,"generated","fixtures","F0"),dir,{recursive:true});
 edit(dir);
 const p=call([path.join(root,"s2-import-dry-run.mjs"),dir]),out=JSON.parse(p.stdout);
 if(expected===null ? p.status!==0||out.errors.length!==0 : !out.errors.some(x=>x.code===expected))
  throw Error(name+": expected "+(expected??"STRUCTURAL_PASS_ONLY")+"; actual "+JSON.stringify(out.errors.slice(0,10)));
 if(out.canPost!==false)throw Error("Dry run must never permit post");
 console.log("PASS",name,expected??"STRUCTURAL_PASS_ONLY");
}
try{
 const generator=call([path.join(root,"s2-data-tool.mjs"),"generate",path.join(tmp,"generated")]);
 if(generator.status!==0)throw Error("Generator unexpectedly failed");
 check("F0 baseline",()=>{});
 check("same source id across different record types",d=>modify(d,"T04",0,{sourceRecordId:field(d,"T02",0,"sourceRecordId")}));
 check("duplicate source id inside same type",d=>modify(d,"T02",1,{sourceRecordId:field(d,"T02",0,"sourceRecordId")}),"SOURCE_ID_CONFLICT");
 check("T05 multiple opening-stock lines per document",()=>{});
 check("T05 duplicate source line",d=>modify(d,"T05",1,{sourceLineId:field(d,"T05",0,"sourceLineId")}),"DUPLICATE_BUSINESS_KEY");
 check("T14 multiple cases per mode",()=>{});
 check("T14 duplicate case id",d=>modify(d,"T14",1,{caseId:field(d,"T14",0,"caseId")}),"DUPLICATE_BUSINESS_KEY");
 check("mixed missing AReservation",d=>modify(d,"T11",2,{aReservationRef:""}),"TRIP_MODE");
 check("B_ONLINE carrying AReservation",d=>modify(d,"T11",1,{aReservationRef:"INVALID-A"}),"TRIP_MODE");
 check("A carrying BQuota",d=>modify(d,"T11",0,{bQuotaRef:"INVALID-B"}),"TRIP_MODE");
 check("same writer installation on sequential trips",d=>modify(d,"T11",1,{writerInstallationId:field(d,"T11",0,"writerInstallationId")}));
 check("different writers on one trip",d=>modify(d,"T11",1,{tripCode:field(d,"T11",0,"tripCode")}),"SECOND_WRITER");
 check("grant reused across trips",d=>modify(d,"T11",1,{grantId:field(d,"T11",0,"grantId")}),"GRANT_REUSE");
 check("tenant missing requested B/mixed",d=>modify(d,"T01",0,{requestedModes:"A"}),"MODE_NOT_REQUESTED");
 check("tenant duplicate mode token",d=>modify(d,"T01",0,{requestedModes:"A|A"}),"MODE_SET_INVALID");
 check("motorbike driver differs from delivery operator",d=>modify(d,"T11",0,{driverEmployeeCode:"OTHER-EMP"}),"DRIVER_ASSIGNMENT");
 check("truck can have separate driver",()=>{});
 check("CSV cannot claim GO",d=>modify(d,"T14",0,{decision:"GO"}),"GO_LIVE_CLAIM_UNVERIFIED");
 check("source hash tampered",d=>modify(d,"T02",0,{customerLabel:"TAMPERED"},false),"SOURCE_HASH");
 check("orphan Customer FK",d=>modify(d,"T03",0,{customerCode:"UNKNOWN-CUSTOMER"}),"FK_ORPHAN");
 check("advance arithmetic",d=>modify(d,"T10",0,{outstanding:"1"}),"ADVANCE_BALANCE");
 check("invalid UoM denominator",d=>modify(d,"T04",0,{conversionDenominator:"0"}),"UOM_CONVERSION");
 check("quoted comma and double-quote",d=>modify(d,"T02",0,{customerLabel:'SYNTH, "QUOTE"'}));
 check("missing source hash",d=>modify(d,"T02",0,{sourceHash:""},false),"REQUIRED_META");
 check("orphan tenant",d=>modify(d,"T03",0,{tenantCode:"UNKNOWN-TENANT"}),"TENANT_ORPHAN");
 check("spreadsheet formula injection",d=>modify(d,"T02",0,{customerLabel:"=1+1"}),"FORMULA_INJECTION");
 console.log("PASS_S2_REGRESSION_MODEL_ONLY",cases);
} finally {fs.rmSync(tmp,{recursive:true,force:true});}
