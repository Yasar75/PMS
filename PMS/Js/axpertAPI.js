// // $(document).ready(function () {
// //     // $('html').on('click', '#btnSubmitParams', function () {
// //     //     if (validateParamFields()) {
// //     //         var paramJson = {};
// //     //         $.each($("[id^='divModal']").find('input'), function (i, e) {
// //     //             if ($(this).attr("id") != "btnSubmitParams") {
// //     //                 var key = $(this).attr("id");
// //     //                 var value = $(this).val()
// //     //                 paramJson[key] = value;
// //     //             }
// //     //         });
// //     //         constructIviewRequestJson(paramJson);
// //     //         closeModalDialog();
// //     //     }
// //     // });

// //     // $('#btnapi').on('click',function(){
// //     //     // $.ajax({
// //     //     //     url: "../api/getiview",
// //     //     //     type: "POST",
// //     //     //     cache: false,
// //     //     //     async: false,
// //     //     //     data: '{ "name": "loview1", "axpapp": "dwbpostgres", "s": "36232.211713.785920", "pageno": "1", "pagesize": "100", "sqlpagination": "true", "params": "{}"}',
// //     //     //     contentType: "application/json",
// //     //     //     success: function (data) {
// //     //     //         result=data.d;
// //     //     //     },
// //     //     //     failure: function () {
// //     //     //         showAlertDialog("error", "Error while getting apiresult.");
// //     //     //     },
// //     //     //     error: function () {
// //     //     //         showAlertDialog("error", "Error while getting apiresult.");
// //     //     //     }
// //     //     // });

// //     //     var xhttp = new XMLHttpRequest();
// //     // xhttp.onreadystatechange = function() {
// //     //      if (this.readyState == 4 && this.status == 200) {
// //     //          alert(this.responseText);
// //     //      }
// //     // };
// //     // xhttp.open("POST", "../../aspx/axinterface.aspx/GetIViewDat", true);
// //     // xhttp.setRequestHeader("Content-type", "application/json");
// //     // xhttp.send("{ivName: 'formn', ivParams: '', pageNo: '1', recsPerPage: '1'}");

// //     // });
// // });
// function validateParamFields(){
//     var validate = true;
//     $.each($("[id^='divModal']").find('input'), function (i, e) {
//         if ($(this).attr("id") != "btnSubmitParams") {  
//              if($(this).val() == ""){
//                  showAlertDialog("warning",$(this).data("pcaption") + " field can not be empty");
//                  validate = false;
//                     return ;
//              }
//         }
//     });
//     return validate;
// }
function selectedActionChanged() {
    var action = $("#ddlActions").val();
    $("select#ddlTstruct, select#ddlIview, select#ddlSQL").prop('selectedIndex', 0);
    // $("select#ddlIview").prop('selectedIndex', 0);
    // $("select#ddlSQL").prop('selectedIndex', 0);
    clearFields();
    switch (action) {
        case "Login":
           // $("#loginParams").removeClass("hide");
            $("#apiUrl").html("<span class='url1'>URL </span>: <span class='url2'>" + $('#hdnScriptPath').val() +"ASBMenuRest.dll/datasnap/rest/TASBMenuREST/login</span>");
            getLoginApiInfo();
            break;
        case "Submit data":
         //   $("#sbmtdataParams").removeClass("hide");
            $("#apiUrl").html("<span class='url1'>URL </span>: <span class='url2'> " + $('#hdnScriptPath').val() +"ASBTStructRest.dll/datasnap/rest/TASBTStruct/savedata</span>");
    }
}
function selectedTstructChanged() {
    //  var selectedTst=$("#ddlTstruct").val();
    clearFields();
    if ($("select#ddlTstruct").prop('selectedIndex') != 0) {
       // $("#sbmtdataParams").removeClass("hide");
        $("#apiUrl").html("<span class='url1'>URL </span>: <span class='url2'>" + $('#hdnScriptPath').val() +"ASBTStructRest.dll/datasnap/rest/TASBTStruct/savedata</span>");
    }
}
function selectedIviewChanged() {
    clearFields();
    // if ($("select#ddlIview").prop('selectedIndex') == 0) {
    //     clearFields();
    //     return false;
    // }
    if ($("select#ddlIview").prop('selectedIndex') != 0) {
        $("select#ddlSQL").prop('selectedIndex', 0);
       // $("#getIvewParams").removeClass("hide");
        $("#apiUrl").html(" <span class='url1'>URL </span>: <span class='url2'>" + $('#hdnScriptPath').val() +"AsbIViewRest.dll/datasnap/rest/TASBIViewREST/getiview</span>");
        var ivName = $('#ddlIview').val();
       
            constructIviewRequestJson(ivName);
    }
}
function selectedSQLChanged() {
    // if ($("select#ddlSQL").prop('selectedIndex') == 0) {
    //     clearFields();
    //     return false;
    // }
    clearFields();
    if ($("select#ddlSQL").prop('selectedIndex') != 0) {
        $("select#ddlIview").prop('selectedIndex', 0);
        $("#getChoiceParams").removeClass("hide");
        $("#apiUrl").html("<span class='url1'>URL </span>: <span class='url2'>" + $('#hdnScriptPath').val() + "api/getchoices/</span>");
        $("#dvInputString").html('{ "getchoices": { "axpapp": "' + callParentNew("mainProject") + '", "seed": "1983", "s": "' + sessionID + '", "sql": "' + $("#ddlSQL").val() + '", "direct": "false", "params": "" } }');
        $("#dvResponseString").html("{'result': [{ 'result': { 'row': [{ }] } }] }");
    }

}



function getIviewParams(ivName) {
    var paramJson={};
    $.ajax({
        url: "axpertAPI.aspx/getIviewParams",
        type: "POST",
        cache: false,
        async: false,
        data: JSON.stringify({ ivName }),
        contentType: "application/json",
        success: function (data) {
            try{
            ParamNameJSON = JSON.parse(data.d);
            }catch(ex){}
            if (typeof ParamNameJSON != "undefined" && ParamNameJSON["result"] && typeof ParamNameJSON["result"]["row"] != "undefined" && ParamNameJSON["result"]["row"].length != 0) {
                var colName = ParamNameJSON["result"]["fields"][0]["name"]
                $.each(ParamNameJSON["result"]["row"], function (i, e) {
                    var key = e[colName];
                    var value = "Param_value";
                    paramJson[key] = value;
                });
               
           // showParamdialog(ParamNameJSON);
            }
        },
        failure: function () {
            showAlertDialog("error", "Error while getting paramList.");
        },
        error: function () {
            showAlertDialog("error", "Error while getting paramList.");
        }
    });
    return paramJson;
}

// function showParamdialog(ParamNameJSON) {
//     var htmlToShow = "";
//     var height = 20;
//     // htmlToShow += ' <div class="form-group">';
//     // htmlToShow += '<label for="pageno">pageno</label>';
//     // htmlToShow += '<span class="red">*</span>';
//     // htmlToShow += '<input required id="pageno" type="text" class="form-control fldNme dialogInptFld" >';
//     // htmlToShow += '</div>';
//     // htmlToShow += ' <div class="form-group">';
//     // htmlToShow += '<label for="pagesize">pagesize</label>';
//     // htmlToShow += '<span class="red">*</span>';
//     // htmlToShow += '<input required id="pagesize" type="text" class="form-control fldNme dialogInptFld">';
//     // htmlToShow += '</div>';
//     // htmlToShow += ' <div class="form-group">';
//     // htmlToShow += '<label for="sqlPagination">pagesize</label>';
//     // htmlToShow += '<select class="form-control dialogSlctFld" id="sqlPagination">';
//     // htmlToShow += '<option value="true">True</option>';
//     // htmlToShow += '<option value="false">False</option>'
//     // htmlToShow += ' </select>';
//     // htmlToShow += '</div>';
//     if (typeof ParamNameJSON["result"]["row"] != "undefined" && ParamNameJSON["result"]["row"].length != 0) {

//         $.each(ParamNameJSON["result"]["row"], function (i, e) {
//             height += 80;
//             htmlToShow += ' <div class="form-group">';
//             htmlToShow += '<label for="' + e.pname + '">' + e.pcaption + '</label>';
//             htmlToShow += '<span class="red">*</span>';
//             htmlToShow += '<input required id="' + e.pname + '" data-pcaption="' + e.pcaption + '" type="text" class="form-control fldNme dialogInptFld" >';
//             htmlToShow += '</div>';
//         });
//         htmlToShow += '<input type="submit" name="Submit" value="Submit" id="btnSubmitParams" class="btn btn-primary">';
//         displayBootstrapModalDialog("Parameters", "sm", height + "px", false, htmlToShow, "", "", "");
//     }

// }

function constructIviewRequestJson(ivName) {
    var paramJson ={};
    if ($('#hdnParamIviewList').val().indexOf(ivName) != -1) {
     paramJson =   getIviewParams(ivName);
    }
    $('#dvInputString').html('{ "getiview": { "name": "' + ivName + '", "axpapp": "' + callParentNew("mainProject") + '", "s": "' + sessionID + '", "pageno": "1", "pagesize": "100", "sqlpagination": "true", "params": ' + JSON.stringify(paramJson) + '} }');

    $('#dvResponseString').html('<div class="dvName" >On success :</div><div class="dvContent">{"headrow": { "rowno": { "hide": "true" }, "axrowtype": { "hide": "true", "width": "80", "dec": "0", "type": "c" }, "axp__font": { "axp__font": "axp__fontdetails", "hide": "true", "width": "80", "dec": "0", "type": "c" }, "column1": { "column1": "Sr. No.", "width": "54", "dec": "0", "align": "Center", "ordno": "1", "runningtotal": "False", "type": "n", "hide": "false" }, "emp": { "emp": "emp", "width": "80", "dec": "0", "align": "Left", "ordno": "2", "runningtotal": "False", "type": "c", "hlink": "ttotal", "pop": "True", "hltype": "load", "map": "emp=:emp", "hide": "false" }, "dep": { "dep": "dep", "width": "80", "dec": "0", "align": "Left", "ordno": "3", "runningtotal": "False", "type": "c", "hlaction": "act1", "hlink": "ttotal", "pop": "True", "hltype": "open", "map": "dep=:dep", "hide": "false" }, "sal": { "sal": "sal", "width": "80", "dec": "2", "align": "Center", "ordno": "4", "runningtotal": "False", "type": "n", "hlink": "iAccept", "pop": "True", "hltype": "load", "map": "employeename=:emp", "hide": "false" }, "reccount": "3", "pagesize": "0", "totalrows": "2", "datarows": "2" }, "row": [{ "rowno": "1", "column1": "1", "emp": "rohit", "dep": "marketing", "sal": "12,345.78", "total1id": "1110220000004", "e": "rohit" }, { "rowno": "2", "column1": "2", "emp": "pawan", "dep": "testing", "sal": "7,778.78", "total1id": "1108880000000", "e": "pawan" }], "GrandTotal": [{ "rowno": "3", "axrowtype": "4", "column1": "820", "emp": "", "dep": "", "sal": "7,97,671.40", "total1id": "44820370000374", "e": "" }] }</div><div class="dvName" >On failure :</div><div class="dvContent">{​​​​​​​​"result":[{​​​​​​​​"error":"Sessionid not specified in call to webservice getIView"}​​​​​​​​]}</div>');
}


function getLoginApiInfo() {
    $("#dvInputString").html('{"login": { "axpapp": "' + callParentNew("mainProject") + '", "username": "' + callParentNew("mainUserName") + '", "password": "PASSWORD", "seed": "1983", "other": "chrome", "trace": "true" } }');


    $("#dvResponseString").html('<div class="dvName" >On success :</div><div class="dvContent">{"result": { "status": "Success", "s": " ' + sessionID + ' ", "ugroup": "default,designer", "uroles": "default,default", "EMAIL": "virat@agile-labs.com" }}</div><div class="dvName" >On failure :</div><div class="dvContent">{"result":[{"error":{"status":"Failed","msg":"Invalid username or password"}}]}</div>');

}

function createSubmitDataAPIinfo(TstFldJsonString, tstDCInfo) {
    var tempfldJSON = JSON.parse(TstFldJsonString);
    var tstDCJSON = JSON.parse(tstDCInfo);
    var TstFldJsonArr = [];
    var dccnt = 1;
    var smpGridrcrd = '[{"rowno":"001","text":"0","columns":{}},{"rowno":"002","text":"0","columns":{}}]';
    var smpNongrdRcrd = '[{"rowno":"001","text":"0","columns":{}}]';
    // $.each(tempfldJSON["result"]["row"], function (i, e) {
    //     if (e.fname != null)
    //         TstFldJson[e.fname] = "FIELD_VALUE";
    //     else
    //         TstFldJson[e.FNAME] = "FIELD_VALUE";
    // });
    $.each(tstDCJSON["result"]["row"], function (i, e) {
        var tempjson = {};
        var dcName = e.dname;
        if (e.asgrid.toLowerCase() == 't')
            tempjson["axp_recid" + dccnt] =JSON.parse(smpGridrcrd);
        else
            tempjson["axp_recid" + dccnt] = JSON.parse(smpNongrdRcrd);
        $.each(tempfldJSON["result"]["row"], function (ind, ele) {
            if (ele.dcname == dcName) {
                if (ele.fname != null)
                    tempjson["axp_recid" + dccnt][0].columns[ele.fname] = "FIELD_VALUE";
                else
                    tempjson["axp_recid" + dccnt][0].columns[ele.FNAME] = "FIELD_VALUE";
            }
        });
        TstFldJsonArr.push(tempjson);
        dccnt++;
    })
    $("#dvInputString").html('{ "savedata": { "axpapp": "' + callParentNew("mainProject") + '", "transid": "' + $("select#ddlTstruct").val() + '","s":"' + sessionID + '", "changedrows": { "dc2": " * ", "dc3": " * " }, "trace": "true", "recordid": "0", "recdata":  ' + JSON.stringify(TstFldJsonArr) + ' } }');
    $("#dvResponseString").html('{"message": [{ "msg": "' + $("#ddlTstruct option:selected").text() + ' Saved", "recordid": "1690220000000" }] }');
    $("#dvResponseString").html('<div class="dvName" >On success :</div><div class="dvContent">{"message": [{ "msg": "' + $("#ddlTstruct option:selected").text() + ' Saved", "recordid": "1690220000000" }] }</div><div class="dvName" >On failure :</div><div class="dvContent">{"result": [{"error": {"status": "Failed","msg": "Sessionid not specified in call to webservice savedata" } }] }</div>');

}
function clearFields() {
    $("#dvInputString").html("")
    $("#dvResponseString").html("")
    $("#apiUrl").html("")
    $("#loginParams").addClass("hide");
    $("#sbmtdataParams").addClass("hide");
    $("#getIvewParams").addClass("hide");
    $("#getChoiceParams").addClass("hide");
}
