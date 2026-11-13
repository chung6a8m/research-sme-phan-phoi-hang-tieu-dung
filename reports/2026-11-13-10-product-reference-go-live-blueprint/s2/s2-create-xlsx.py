#!/usr/bin/env python3
"""Generate S2 Excel input sheets from data-dictionary.json via artifact_tool.
Template only; never imports to a production database or represents Go-Live evidence.
Usage: python s2-create-xlsx.py /absolute/path/S2_NPP_Import_Templates.xlsx
"""
import json
import sys
from pathlib import Path
from artifact_tool import Workbook, SpreadsheetFile

HERE=Path(__file__).resolve().parent
DICTIONARY=json.loads((HERE/"data-dictionary.json").read_text(encoding="utf-8"))
OUT=Path(sys.argv[1]) if len(sys.argv)>1 else HERE/"S2_NPP_Import_Templates.xlsx"
NAMES={"T01":"Tenant","T02":"Customers","T03":"Outlets","T04":"Products","T05":"Stock","T06":"Prices","T07":"AR","T08":"Credit","T09":"Custody","T10":"Advance","T11":"Trips","T12":"Cutover","T13":"Adapter","T14":"Evidence"}
HEADER={"fill":"#0E2B42","font":{"bold":True,"color":"#FFFFFF"},"row_height":28}
META={"fill":"#17698B","font":{"bold":True,"color":"#FFFFFF"},"row_height":28}
wb=Workbook.create()
home=wb.worksheets.add("00 START")
home.merge_cells("A1:H2")
home.get_range("A1").values=[["S2 — DMS / NPP IMPORT TEMPLATES"]]
home.get_range("A1:H2").format=HEADER
home.merge_cells("A3:H3")
home.get_range("A3").values=[["SYNTHETIC REFERENCE ONLY • DRY-RUN REQUIRED • NOT GO-LIVE ACCEPTANCE"]]
home.get_range("A3:H3").format={"fill":"#FFF2D5","font":{"bold":True,"color":"#764100"}}
home.get_range("A5:B12").values=[
 ["Step","Instruction"],
 ["01","Read Data Dictionary; assign an owner to each template."],
 ["02","Enter beneath exact headers and preserve code IDs as text."],
 ["03","Amounts: VND integers; quantities: decimal base UoM; dates ISO."],
 ["04","Do not fabricate sourceHash, seller identity or approvals."],
 ["05","Export CSV UTF-8 and run s2-import-dry-run.mjs before approval."],
 ["06","Reconcile stock, AR, credit, custody, advance and pending devices."],
 ["07","Template and model results are not legal, provider or pilot evidence."],
]
home.get_range("A5:B5").format=META
home.get_range("A5:A12").format.column_width=10
home.get_range("B5:B12").format.column_width=82
home.get_range("B6:B12").format.wrap_text=True
home.get_range("D5:G5").values=[["ID","Data sheet","Rows entered","Owner"]]
home.get_range("D5:G5").format=META
for col,width in [("D",12),("E",23),("F",20),("G",27)]:
    home.get_range(f"{col}5:{col}20").format.column_width=width

dictionary_rows=[]
for rowno,t in enumerate(DICTIONARY["tables"],6):
    name=t["id"]+" "+NAMES[t["id"]]
    sh=wb.worksheets.add(name)
    columns=[f["name"] for f in t["fields"]]+DICTIONARY["commonFields"]
    sh.get_range_by_indexes(0,0,1,len(columns)).values=[columns]
    sh.get_range_by_indexes(0,0,1,len(columns)).format=HEADER
    sh.get_range_by_indexes(0,len(t["fields"]),1,len(DICTIONARY["commonFields"])).format=META
    sh.freeze_panes.freeze_rows(1)
    for i,col in enumerate(columns):
        sh.get_range_by_indexes(0,i,1,1).format.column_width=min(40,max(19,len(col)+4))
        field=next((f for f in t["fields"] if f["name"]==col),None)
        if field and field.get("allowed"):
            sh.get_range_by_indexes(1,i,200,1).data_validation={"rule":{"type":"list","values":field["allowed"]}}
        if col.endswith(("Code","Id","Ref")) or col in ("tenantCode","sourceHash","sourceRecordId","importBatchId","schemaVersion"):
            sh.get_range_by_indexes(1,i,20,1).set_number_format("@")
    home.get_range(f"D{rowno}:E{rowno}").values=[[t["id"],name]]
    home.get_range(f"F{rowno}").formulas=[[f"=COUNTA('{name}'!A2:A501)"]]
    home.get_range(f"G{rowno}").values=[[t["owner"]]]
    for f in t["fields"]:
        dictionary_rows.append([t["id"],name,f["name"],f["type"],"Yes" if f["required"] else "No",f.get("ref") or "",t["owner"],f.get("sample") or ""])
    for col in DICTIONARY["commonFields"]:
        dictionary_rows.append([t["id"],name,col,"source metadata","Yes","",t["owner"],""])
data=wb.worksheets.add("Data Dictionary")
data.get_range("A1:H1").values=[["Template","Sheet","Field","Type","Required","Reference","Owner","Synthetic example"]]
data.get_range("A1:H1").format=HEADER
data.get_range_by_indexes(1,0,len(dictionary_rows),8).values=dictionary_rows
for i,width in enumerate([12,22,29,20,12,32,25,39]):
    data.get_range_by_indexes(0,i,1,1).format.column_width=width
data.freeze_panes.freeze_rows(1)
OUT.parent.mkdir(parents=True,exist_ok=True)
SpreadsheetFile.export_xlsx(wb).save(str(OUT))
print(f"XLSX_TEMPLATE_CREATED {OUT}; tables={len(DICTIONARY['tables'])}; dictionaryRows={len(dictionary_rows)}")
