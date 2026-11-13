/* S2 synthetic per-trip projection: independent opening for each scenario, no real posting. */
import fs from 'node:fs';import path from 'node:path';
function scenariosFor(pack){
 const records=[],groups={};
 for(const trip of pack.tables.T11)(groups[trip.tenantCode] ||= []).push(trip);
 for(const [tenant,trips] of Object.entries(groups)){
  const stocks=pack.tables.T05.filter(x=>x.tenantCode===tenant),prices=pack.tables.T06.filter(x=>x.tenantCode===tenant),customers=pack.tables.T02.filter(x=>x.tenantCode===tenant);
  const firstMixed=trips.find(t=>t.mode==="MIXED");let ix=1;
  for(let k=0;k<trips.length;k++){
   const trip=trips[k],sidx=trip.tripCode===firstMixed?.tripCode?0:ix++,stock=stocks[sidx],price=prices[sidx];
   if(!stock||!price)throw Error("Insufficient SKU "+trip.tripCode);
   const aReservation=trip.mode==="A"?10:trip.mode==="MIXED"?8:0,bQuota=trip.mode==="A"?0:12,aDelivered=trip.mode==="B_ONLINE"?0:6,bSold=trip.mode==="A"?0:7;
   const loadQty=aReservation+bQuota,deliveredQty=aDelivered+bSold,unitCost=Number(stock.totalCost)/Number(stock.qtyBase),unitPrice=Number(price.unitPrice);
   if(!Number.isInteger(unitCost))throw Error("Unit cost inconsistent");
   const collectedCash=bSold?3*unitPrice:0;
   const mainQtyAfter=Number(stock.qtyBase)-deliveredQty,mainValueAfter=Number(stock.totalCost)-unitCost*deliveredQty;
   records.push({scenarioId:"S2-"+trip.tripCode,tenantCode:tenant,tripCode:trip.tripCode,mode:trip.mode,skuCode:stock.skuCode,customerCode:customers[k%customers.length].customerCode,serviceDate:trip.serviceDate,
   modelState:"MODEL_ONLY",invoiceEligible:false,providerFact:"NOT_TESTED",sourceDocumentId:stock.sourceDocumentId,openingMainQty:Number(stock.qtyBase),openingMainValue:Number(stock.totalCost),movingAvgUnitCost:unitCost,unitPrice,
   aReservation,bQuota,loadedQty:loadQty,aDeliveredQty:aDelivered,bSoldQty:bSold,returnedA:aReservation-aDelivered,returnedB:bQuota-bSold,
   mainQtyAfter,mainValueAfter,tripQtyAfter:0,tripValueAfter:0,cogs:unitCost*deliveredQty,
   arA:aDelivered*unitPrice,arB:bSold*unitPrice-collectedCash,cashCustody:collectedCash,cashierFund:0,unallocatedAReservation:aReservation-aDelivered,
   availableMainAfter:mainQtyAfter-(aReservation-aDelivered),
   eventIds:{load:trip.tripCode+"-LOAD",deliveryA:aDelivered?trip.tripCode+"-DEL-A":null,saleB:bSold?trip.tripCode+"-SALE-B":null,receiptB:collectedCash?trip.tripCode+"-RCPT-B":null,unload:trip.tripCode+"-UNLOAD"},
   confidence:"SYNTHETIC_ORACLE_NOT_SYSTEM_TEST"});
  }
 }
 return records;
}
function validateScenarios(packs,all){
 const errors=[],seen=new Set();
 for(const pack of packs){
 const rows=all.datasets[pack.dataset];
 if(rows.length!==pack.tables.T11.length)errors.push(pack.dataset+": trip count");
 for(const x of rows){
  if(seen.has(x.scenarioId))errors.push("duplicate "+x.scenarioId);seen.add(x.scenarioId);
  const t=pack.tables.T11.find(y=>y.tripCode===x.tripCode&&y.tenantCode===x.tenantCode),stock=pack.tables.T05.find(y=>y.skuCode===x.skuCode&&y.tenantCode===x.tenantCode);
  if(!t||!stock||!pack.tables.T02.some(y=>y.customerCode===x.customerCode&&y.tenantCode===x.tenantCode))errors.push(x.scenarioId+": orphan");
  if(x.aReservation+x.bQuota!==x.loadedQty)errors.push(x.scenarioId+": allocation");
  if(x.openingMainQty!==x.mainQtyAfter+x.aDeliveredQty+x.bSoldQty+x.tripQtyAfter)errors.push(x.scenarioId+": qty");
  if(x.openingMainValue!==x.mainValueAfter+x.cogs+x.tripValueAfter)errors.push(x.scenarioId+": cost");
  if(x.unallocatedAReservation!==x.returnedA||x.loadedQty-x.aDeliveredQty-x.bSoldQty!==x.returnedA+x.returnedB)errors.push(x.scenarioId+": returns");
  if(x.availableMainAfter!==x.mainQtyAfter-x.unallocatedAReservation||x.availableMainAfter<0)errors.push(x.scenarioId+": available");
  if(x.arA+x.arB+x.cashCustody!==(x.aDeliveredQty+x.bSoldQty)*x.unitPrice)errors.push(x.scenarioId+": AR/cash");
  if(x.invoiceEligible||x.providerFact!=="NOT_TESTED"||x.modelState!=="MODEL_ONLY")errors.push(x.scenarioId+": fake provider");
  if(x.mode==="A"&&(x.bQuota!==0||x.bSoldQty!==0)||x.mode==="B_ONLINE"&&(x.aReservation!==0||x.aDeliveredQty!==0))errors.push(x.scenarioId+": mode");
  if(x.cogs!==x.movingAvgUnitCost*(x.aDeliveredQty+x.bSoldQty))errors.push(x.scenarioId+": cogs");
  if(x.tenantCode!==t?.tenantCode||x.sourceDocumentId!==stock?.sourceDocumentId)errors.push(x.scenarioId+": source");
 }}
 return errors;
}
const root=path.resolve(process.argv[3]||'.'),cmd=process.argv[2]||'help',packs=['F0','F1','F2'].map(k=>JSON.parse(fs.readFileSync(path.join(root,'fixtures',k+'.json'),'utf8')));
const model={schemaVersion:'s2-scenarios-v1',status:'MODEL_ONLY',basis:'R009 BR-03/04/07/11/12/13; S2 synthetic trip simulation; oracle AC03 separate isolated',note:'Each scenario resets its own synthetic opening snapshot, NOT a chronological tenant stock ledger. No verified invoice or accounting effects.',datasets:Object.fromEntries(packs.map(p=>[p.dataset,scenariosFor(p)]))},target=path.join(root,'trip-scenarios.json');
if(cmd==='generate'){fs.writeFileSync(target,JSON.stringify(model,null,2)+'\n','utf8');console.log('GENERATED',Object.values(model.datasets).reduce((n,x)=>n+x.length,0));}
else if(cmd==='validate'){const existing=JSON.parse(fs.readFileSync(target,'utf8')),issues=validateScenarios(packs,existing);if(JSON.stringify(existing)!==JSON.stringify(model))issues.push('REGEN_MISMATCH');const fake=JSON.parse(JSON.stringify(existing));fake.datasets.F0[0].arA++;if(!validateScenarios(packs,fake).some(x=>x.includes('AR/cash')))issues.push('NEGATIVE_FAILED');if(issues.length){console.error(issues.slice(0,25));process.exit(1);}console.log('PASS_SCENARIOS_MODEL_ONLY',Object.values(model.datasets).reduce((n,x)=>n+x.length,0));}
else console.log('node s2-trip-scenarios.mjs generate|validate <s2-root>');
