var xlresult;
var xlGridfieldNames;
var xlDcNo;




$(() => {
    $("#excelimport").click(function () {
      
        
        var crvalue = "";
       
        var arrImportcrValue = [];
        var arrImportrecID = [];
        var arrImportgridValues = [];
        var keyimport = "";
        var valueimport = "";
        for (var l = 1; l < xlresult.length; l++) {
            crvalue += "i" + l + ",";
           
            arrImportrecID.push({ n: xlGridfieldNames[0], v: "0", r: l.toString(), t: "s" });
           
            for (var k = 0; k < xlresult[l].length; k++) {
                valueimport = typeof xlresult[l][k] != "undefined" ? xlresult[l][k] : "";
                keyimport = xlresult[0][k];
                       
                if (valueimport != "")
                    valueimport = valueimport.toString();
                arrImportgridValues.push({ n: keyimport, v: valueimport, r: l.toString(), t: "s" });
            }
        }
        crvalue = crvalue.slice(0, -1);
        arrImportcrValue.push({ n: "DC" + xlDcNo, v: xlDcNo, cr: crvalue, t: "dc", hasdatarows: "yes" });
        var xlFinalimport = [];
        xlFinalimport = xlFinalimport.concat(arrImportcrValue, arrImportrecID, arrImportgridValues);
        callParentNew("AxActiveDc=", xlDcNo);
       // TabDCs = [];
       
        if (callParentNew("gridDummyRowVal").length > 0) {
            callParentNew("gridDummyRowVal").map(function (v) {
                if (v.split("~")[0] == xlDcNo)
                    callParentNew("gridDummyRowVal").splice($.inArray(v, callParentNew("gridDummyRowVal")), 1);
            });
        }
        parent.ExecData(xlFinalimport, "LoadData", true);
        callParentNew("closeModalDialog()", "function");
        var rowCount = xlresult.length - 1;
        var rowno = "";
        for (var k = 1; k <= rowCount; k++) {
            if (k <= 9){
                 rowno = "00" + k;
            }
            else if (k > 9 && k <= 99) {
                rowno = "0" + k;
            }
            else {
                rowno = k;
            }
            for (var i = 0; i < xlGridfieldNames.length; i++) {
                var fldName = xlGridfieldNames[i] + rowno + "F" + xlDcNo;
                parent.EvaluateExpressions(fldName);
            }
        }
    });
})


$j(document).ready(function () {
    $('#excelfile').bind({
        change: function (e){
            var filename = $("#excelfile").val();
            var fName = filename.toString().split("\\");
            filename = fName[fName.length - 1]
            // $("#noFile").text(filename.replace("C:\\fakepath\\", ""));
            $("#noFile").text(filename);
            var file = e.target.files[0];
            var files = e.target.files, f = files[0];
            var FR = new FileReader();
            FR.onload = function (e) {
                var data = new Uint8Array(e.target.result);
                var workbook = XLSX.read(data, { type: 'array',cellDates: true, dateNF: 'dd/mm/yyyy;@' });
                var firstSheet = workbook.Sheets[workbook.SheetNames[0]];//
                var result = XLSX.utils.sheet_to_json(firstSheet, { header: 1, raw: false });
                if (result.length == 0) {
                    showAlertDialog("error", eval(callParent('lcm[509]')));
                    return;
                }
                var dcNo = window.location.href.split('=')[1];
                var gridFieldNames = callParentNew('GetGridFields(' + dcNo + ')', 'function');
                var check = gridFieldNames.some(r=>result[0].includes(r));
                if (!check) {
                    showAlertDialog("error", eval(callParent('lcm[510]')));
                    return;
                }
                else {
                    if (result[1].length == 0) {
                        showAlertDialog("error", eval(callParent('lcm[511]')));
                        return;
                    }
                    else {
                        xlresult = result;
                        xlGridfieldNames = gridFieldNames;
                        xlDcNo = dcNo;
                    }
                }
            };
        
            FR.readAsArrayBuffer(file);
        }
        })
})
