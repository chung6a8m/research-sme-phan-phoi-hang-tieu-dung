/* R010 S2 CSV dry-run: parse quoted UTF-8, validate schema/FK/hash, never post to database. Node.js 20+. */
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';
function parseCSV(text){
 if(text.charCodeAt(0)===0xFEFF)text=text.slice(1);
 const rows=[];let row=[],v="",quoted=false,afterQuote=false;
 for(let i=0;i<text.length;i++){
  const ch=text[i];
  if(quoted){if(ch==='"'&&text[i+1]==='"'){v+='"';i++;}else if(ch==='"'){quoted=false;afterQuote=true;}else v+=ch;continue;}
  if(afterQuote){if(ch===','||ch==='\r'||ch==='\n'){afterQuote=false;}else throw Error("TRAILING_AFTER_QUOTE offset="+i);}
  if(ch===','){row.push(v);v="";}else if(ch==='\n'){row.push(v);rows.push(row);row=[];v="";}else if(ch==='\r'){if(text[i+1]!=='\n')throw Error("BARE_CR offset="+i);}else if(ch==='"'){if(v!=="")throw Error("STRAY_QUOTE offset="+i);quoted=true;}else v+=ch;
 }
 if(quoted)throw Error("UNCLOSED_QUOTE");if(v!==""||row.length){row.push(v);rows.push(row);}
 if(!rows.length)throw Error("EMPTY_CSV");const headers=rows.shift();if(new Set(headers).size!==headers.length)throw Error("DUPLICATE_HEADER");
 return {headers,rows:rows.filter(r=>!(r.length===1&&r[0]==="")).map((r,i)=>{if(r.length!==headers.length)throw Error("CSV_COLUMN_COUNT row="+(i+2));return Object.fromEntries(headers.map((name,j)=>[name,r[j]]));})};
}
function importPreview(tables,dict,digest){
 const issues=[],warnings=[],counts={},refs={},ids=new Map();
 const error=(code,template,row,field,detail)=>issues.push({code,template,row,field,detail});
 const warn=(code,template,row,field,detail)=>warnings.push({code,template,row,field,detail});
 for(const spec of dict.tables){
  const entries=tables[spec.id]||[];counts[spec.id]=entries.length;refs[spec.id]={};
  for(const [i,r] of entries.entries()){
   const number=i+2;
   for(const key of dict.commonFields){
     const val=String(r[key]??"");
     if(!val)error("REQUIRED_META",spec.id,number,key,"Missing provenance field");
     if(key==="sourceHash"&&val&&!/^[a-f0-9]{64}$/.test(val))error("SOURCE_HASH_FORMAT",spec.id,number,key,"Expected 64 hex");
     if(key==="schemaVersion"&&val!==dict.schemaVersion)error("SCHEMA_VERSION",spec.id,number,key,"Unknown schema");
   }
   for(const f of spec.fields){
    const value=String(r[f.name]??"");
    if(f.required&&!value)error("REQUIRED",spec.id,number,f.name,"Missing required input");
    if(!value)continue;
    if(f.allowed&&!f.allowed.includes(value))error("ENUM",spec.id,number,f.name,value);
    if(["int","money"].includes(f.type)&&(!/^\d+$/.test(value)||!Number.isSafeInteger(+value)))error("NUMERIC",spec.id,number,f.name,value);
    if(f.type==="decimal"&&!/^\d+(\.\d+)?$/.test(value))error("DECIMAL",spec.id,number,f.name,value);
    if(f.type==="date"&&(!/^\d{4}-\d{2}-\d{2}$/.test(value)||Number.isNaN(Date.parse(value))||new Date(value).toISOString().slice(0,10)!==value))error("DATE",spec.id,number,f.name,value);
    if(f.type==="sha256"&&!/^[0-9a-f]{64}$/.test(value))error("SHA256",spec.id,number,f.name,"Not 64 hex");
    if(f.type==="code"&&!/^[\p{L}\p{N}_.-]+$/u.test(value))error("CODE",spec.id,number,f.name,"Unexpected characters");
    if(f.type==="modes"){const a=value.split("|");if(new Set(a).size!==a.length||a.some(x=>!["A","B_ONLINE","MIXED","B_NO_CHANNEL"].includes(x)))error("MODE_SET_INVALID",spec.id,number,f.name,"Modes must be unique allowed tokens joined by |");}
    if(/^[=+@\t\r]/.test(value))error("FORMULA_INJECTION",spec.id,number,f.name,"Unsafe spreadsheet input");
   }
   const business=spec.fields.filter(f=>!dict.commonFields.includes(f.name));
   const canonical=business.map(f=>String(r[f.name]??"")).concat(["tenantCode","schemaVersion","sourceSystem","sourceRecordId","importBatchId"].map(k=>String(r[k]??""))).join("|");
   if(r.sourceHash&&digest(canonical)!==r.sourceHash)error("SOURCE_HASH",spec.id,number,"sourceHash","Does not match canonical data");
   const idKey=(r.tenantCode||"")+"|"+(r.sourceSystem||"")+"|"+spec.id+"|"+(r.sourceRecordId||"");
   if(ids.has(idKey))error(ids.get(idKey)===r.sourceHash?"DUPLICATE_REPLAY_IN_BATCH":"SOURCE_ID_CONFLICT",spec.id,number,"sourceRecordId",idKey);
   else ids.set(idKey,r.sourceHash);
   for(const f of spec.fields){
    if(!["tenantCode","customerCode","skuCode","outletCode","sourceDocumentId","ruleId","openItemId","creditSourceId","custodySourceId","advanceId","tripCode","legacyId","adapterCode","mode"].includes(f.name))continue;
    if(f.ref)continue;
    (refs[spec.id][f.name] ||= new Set()).add((r.tenantCode||"")+"|"+String(r[f.name]??""));
   }
  }
 }
 for(const spec of dict.tables)for(const [i,r] of (tables[spec.id]||[]).entries()){
  const n=i+2;
  const owningTenant=(tables.T01||[]).some(t=>t.tenantCode===r.tenantCode);
  if(!owningTenant)error("TENANT_ORPHAN",spec.id,n,"tenantCode","Missing tenant profile");
  const naturalKey={T02:"customerCode",T03:"outletCode",T04:"skuCode",T05:"sourceSystem|sourceDocumentId|sourceLineId",T06:"ruleId",T07:"openItemId",T08:"creditSourceId",T09:"custodySourceId",T10:"advanceId",T11:"tripCode",T12:"legacyId",T13:"adapterCode",T14:"caseId"}[spec.id];
  if(naturalKey){
    const cols=naturalKey.split("|");const duplicates=(tables[spec.id]||[]).filter(x=>x.tenantCode===r.tenantCode&&cols.every(k=>x[k]===r[k]));
    if(duplicates.length>1)error("DUPLICATE_BUSINESS_KEY",spec.id,n,naturalKey,String(r[naturalKey]||""));
  }
  if(spec.id==="T05"&&+r.qtyBase===0&&+r.totalCost!==0)error("STOCK_BALANCE",spec.id,n,"totalCost","Zero quantity with nonzero value");
  for(const f of spec.fields)if(f.ref){const [other,key]=f.ref.split(".");if(!refs[other]?.[key]?.has((r.tenantCode||"")+"|"+String(r[f.name]??"")))error("FK_ORPHAN",spec.id,n,f.name,f.ref);}
  if(spec.id==="T04"&&(+r.conversionNumerator<=0||+r.conversionDenominator<=0||+r.quantityStep<=0))error("UOM_CONVERSION",spec.id,n,"conversionDenominator","Must be >0");
  if(spec.id==="T07"&&(+r.openAmount>+r.originalGross||r.dueDate<r.deliveryDate))error("AR_BALANCE",spec.id,n,"openAmount","Open AR > original or due before delivery");
  if(spec.id==="T09"&&+r.acceptedToFund>+r.amountHeld)error("CUSTODY_BALANCE",spec.id,n,"acceptedToFund","Fund acceptance > held");
  if(spec.id==="T10"&&+r.outstanding!==+r.issued-(+r.approvedExpenses)-(+r.cashierAcceptedReturns))error("ADVANCE_BALANCE",spec.id,n,"outstanding","Issued - expenses - accepted returns must equal outstanding");
  if(spec.id==="T11"){
    const a=Boolean(r.aReservationRef),b=Boolean(r.bQuotaRef);
    if(r.mode==="B_NO_CHANNEL"||(r.mode==="A"&&(!a||b))||(r.mode==="B_ONLINE"&&(a||!b))||(r.mode==="MIXED"&&(!a||!b)))error("TRIP_MODE",spec.id,n,"mode","A only AReservation; B only BQuota; mixed both; no-channel blocked");
    const profile=(tables.T01||[]).find(t=>t.tenantCode===r.tenantCode);
    if(profile&&!String(profile.requestedModes).split("|").includes(r.mode))error("MODE_NOT_REQUESTED",spec.id,n,"mode","Not requested in T01; admission is separate");
    if((tables.T11||[]).some(t=>t!==r&&t.tenantCode===r.tenantCode&&t.tripCode===r.tripCode&&t.writerInstallationId!==r.writerInstallationId))error("SECOND_WRITER",spec.id,n,"writerInstallationId","Two installations on same trip");
    if((tables.T11||[]).some(t=>t!==r&&t.tenantCode===r.tenantCode&&t.grantId===r.grantId))error("GRANT_REUSE",spec.id,n,"grantId","Grant reused on two trips");
    if(r.vehicleKind==="MOTORBIKE"&&r.deliveryEmployeeCode!==r.driverEmployeeCode)error("DRIVER_ASSIGNMENT",spec.id,n,"driverEmployeeCode","Motorbike delivery and driver identical; truck may split");
  }
  if(spec.id==="T13"&&r.evidenceStatus==="VERIFIED_EXTERNALLY")warn("PROVIDER_CLAIM_NEEDS_HUMAN_EVIDENCE",spec.id,n,"evidenceStatus","Not verified by dry run");
  if(spec.id==="T14"&&(r.decision==="GO"||r.status==="VERIFIED"))error("GO_LIVE_CLAIM_UNVERIFIED",spec.id,n,"decision","CSV cannot verify Go-Live; signed evidence workflow required");
 }
 for(const id of ["T01","T02","T04","T05"])if((counts[id]||0)===0)error("REQUIRED_DATA_EMPTY",id,0,"","Tenant bootstrap data missing");
 const blocked=["MANUAL_NPP_DATA_AUTHORIZATION","SELLER_TAX_AND_PROVIDER_LEGAL_PREFLIGHT","FULL_WAREHOUSE_WRITER_LOCK_AFTER_CUTOVER","PWA_API_SQL_RESTORE_E2E","AR_CUSTODY_ADVANCE_MULTI_PARTY_RECONCILIATION","MODE_SPECIFIC_OWNER_GO_NO_GO"];
 return {result:"DRY_RUN_ONLY",technicalStatus:issues.length?"FAIL":"STRUCTURAL_PASS_ONLY",canPost:false,counts,errors:issues,warnings,goLiveBlockers:blocked,remark:"No tenant DB writes or legal/financial approval performed"};
}
const scriptDir=path.dirname(fileURLToPath(import.meta.url));
const digest=s=>crypto.createHash('sha256').update(s,'utf8').digest('hex');
const cmd=process.argv[2]||'--help';
if(cmd==='--self-test'){const r=parseCSV('a,b\n"hello, ""world""",x\n');if(r.rows[0].a!=='hello, "world"')throw Error('quoted CSV self test');let broken=false;try{parseCSV('a,b\n"bad,x\n');}catch(e){broken=true;}if(!broken)throw Error('must reject unclosed quote');console.log('PASS_CSV_PARSE_SELF_TEST');process.exit(0);}
if(cmd==='--help'){console.log('Usage: node s2-import-dry-run.mjs <csv-directory> [--report /tmp/report.json]');process.exit(0);}
const dict=JSON.parse(fs.readFileSync(path.join(scriptDir,'data-dictionary.json'),'utf8')),tables={},preErrors=[];
for(const spec of dict.tables){
 const input=path.join(path.resolve(cmd),spec.id+'-'+spec.name+'.csv'),expected=spec.fields.map(f=>f.name).concat(dict.commonFields);
 if(!fs.existsSync(input)){preErrors.push({code:'FILE_MISSING',template:spec.id,path:input});tables[spec.id]=[];continue;}
 try{const parsed=parseCSV(fs.readFileSync(input,'utf8'));if(parsed.headers.join('\u0000')!==expected.join('\u0000'))preErrors.push({code:'HEADER_MISMATCH',template:spec.id,expected,actual:parsed.headers});tables[spec.id]=parsed.rows;}
 catch(e){preErrors.push({code:'CSV_PARSE',template:spec.id,detail:String(e)});tables[spec.id]=[];}
}
const result=importPreview(tables,dict,digest);result.errors.unshift(...preErrors);if(preErrors.length)result.technicalStatus='FAIL';
result.inputDirectory=path.resolve(cmd);
const output=JSON.stringify(result,null,2)+'\n';
const reportIndex=process.argv.indexOf('--report');
if(reportIndex>=0){const file=process.argv[reportIndex+1];if(!file||!path.isAbsolute(file))throw Error('Report path must be an absolute path');fs.writeFileSync(file,output,'utf8');}
process.stdout.write(output);process.exit(result.errors.length?2:0);
