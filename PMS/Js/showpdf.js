// JScript File
var traceSplitChar = "♦", traceSplitStr = "♦♦";

function CallPDFws() {
    $j("#pdf").css("disabled", "disabled");
    var fn = $j("#pdfFName").find("option:selected").text(), fType = $j("#pdfFName").find("option:selected").val(), fTypeArr = fType.split('$');
    fType = fTypeArr[0];
    var trid = transid, trace = traceSplitStr + "CreatePDF-" + fn + traceSplitChar;
    if (fn == "") {
        showAlertDialog("error", 2057, "client");
    }
    else {
        var fileName = recordid + fn;
        var pdfXml = '<root axpapp="' + proj + '"  sessionid="' + sid + '"  formname="' + fn + '"  filename="' + fileName + '" transid="' + trid + '"  recordid="' + recordid + '"   trace="' + trace + '">';

        try {
            if (fType == "pdf") {
                ASB.WebService.CreatePDF(pdfXml, tstDataId, SuccChoices);
            }
            else {
                var fldArray = CloneArray(ChangedFields),
                 fldRowArray = CloneArray(ChangedFieldDbRowNo),
                 fldValArray = CloneArray(ChangedFieldValues),
                 delArray = CloneArray(DeletedDCRows),
                 fldArray = new Array(),
                 fldRowArray = new Array(),
                 fldValArray = new Array(),
                 delArray = new Array();

                ASB.WebService.CreateFastReportPDF(fldArray, fldRowArray, fldValArray, delArray, pdfXml, tstDataId, SuccChoices);
            }
        }
        catch (exp) {
            AxWaitCursor(false);
            showAlertDialog("error", exp.message);
        }
    }
}

function CloneArray(srcArray) {
    var destArray = new Array();
    for (var i = 0; i < srcArray.length; i++)
        destArray.push(srcArray[i]);
    return destArray;
}

///Function to toggle the cursor style.
function AxWaitCursor(act) {
    if (act) {
        $j("body").css('cursor', 'wait');
    }
    else {
        $j("body").css('cursor', 'arrow');
        $j("body").css('cursor', 'default');
    }
}

function SuccChoices(result, eventArgs) {
    if (CheckSessionTimeout(result))
        return;
    result = result.replace('\n', " ");
    var myJson = $j.parseJSON(result);
    var ErroMsgJsonObj = myJson.error
    if (ErroMsgJsonObj != undefined) {
        errorMsg = ErroMsgJsonObj[0].msg;
        showAlertDialog("error", errorMsg);
    }
    else {
        cmdJson = myJson.command
        if (cmdJson != undefined) {
            cmdName = cmdJson[0].cmd;
            cmdVal = cmdJson[0].cmdval;

            var hdnPath = $j("#hdnScriptspath");
            var scriptsPath = "";
            if (hdnPath.length > 0)
                scriptsPath = hdnPath.val();
            window.open(scriptsPath + "Axpert/" + sid + "/" + cmdVal, '_self', 'width=900,height=800');
            window.moveTo(screen.width / 6, screen.height / 6);
        }
    }
}

function InStrPath(strSearch) {
    var charSearchFor = "\\";
    strSearch = strSearch.toLowerCase();
    var ki = strSearch.indexOf("axpert");

    strSearch = strSearch.substring(0, ki);
    var sPos = new Array();
    var h = 1;

    for (i = 0; i < strSearch.length; i++) {

        if (charSearchFor == Mid(strSearch, i, 1)) {

            sPos[h] = i;
            h = h + 1;
        }
    }

    var fRes = 0;
    for (m = 1; m < h - 1; m++) {

        fRes = sPos[m];
    }
    return fRes;
}

function Mid(str, start, len) {

    // Make sure start and len are within proper bounds
    if (start < 0 || len < 0) return "";
    var iEnd, iLen = String(str).length;
    if (start + len > iLen)
        iEnd = iLen;
    else
        iEnd = start + len;
    return String(str).substring(start, iEnd);
}

var SESSTIMEOUT = "SESSION_TIMEOUT";
function CheckSessionTimeout(result) {

    if (result == SESSTIMEOUT) {
        if (window.opener && !window.opener.closed) {
            window.close();
            window.opener.location.reload();
        }
        else {
            parent.parent.location.href = "Signin.aspx?msg=Your session is expired. Please login again.";
        }
        return true;
    }
    else if (result == "Duplicate_session") {
        CheckSuccCallBackValidate();
        return true;
    } else if (result == appGlobalVarsObject._CONSTANTS.MALICIOUSNPUTDETECTED) {
        showAlertDialog("error", appGlobalVarsObject.lcm["449"]);
        AxWaitCursor(false);
        ShowDimmer(false);
        return true;
    }
    return false;
}

//tPDF.js code
// global variables
var isMozilla, objDiv = null, originalDivHTML = "", DivID = "", over = false, addHeader = "";
function EndRequestHandler(sender, args) {
    if (args.get_error() == undefined) {
        if ($j("#goval").length > 0) {
            var gov = $j("#goval");
            if (gov.val() == "go") {
                FillDiv("Show");
                $j("#searstr").val(DecodeUrlSplChars($j("#hdnSearchStr").val()));
                gov.val("d");
            }
        }
        ShowDimmer(false);

        var ExportToHtml = $j("#hdnHtml");
        var fileName = $j("#hdnFilename");
        if (ExportToHtml.val() == "Save") {
            showAlertDialog("success", 2028, "client", fileName.val());
            ExportToHtml.val("");
        }
    }
    else {
        showAlertDialog("error", 2029, "client", args.get_error().message);
    }
}

function displaypdfdiv(divId, title) {

    $j("#" + divId).show();
    $j("#" + divId).addClass('Pagebody Bordercolor');
    $j("#dvPDFDocList").css("display", "block");

    Resizewindow();
}


function ClosePdfDiv() {
    $j("#dvPDFDocList").css("display", "none");
}

function displayFloatingDiv(divId, title) {

    DivID = divId;
    document.getElementById('dimmer').style.display = "block";
    var addHeader = '<table style="width:300px;" class="Headerbg Popcap"><tr><td ondblclick="void(0);" onmouseover="over=true;" onmouseout="over=false;" style="cursor:move;height:18px">' + title + '</td><td style="width:18px" align="right"><a href="javascript:hiddenFloatingDiv(\'' + divId + '\');void(0);"><img alt="Close" title="Close" src="images/crossimg.PNG" border="0"></a></td></tr></table>';
    var columnstxt = '<table style="width:300px;" class="Pagebody"><tr class="Mainbody selectAll"><td><input type="checkbox" onclick="javascript:togglesrchselect();" id="searchall" name="searchall" value="Select All" >Select/Unselect all columns </td></tr>';
    for (var i = 0; i < document.getElementById("s1").options.length; i++) {
        var selected = "";
        if (document.getElementById("s1").selectedIndex == i) selected = "checked";
        columnstxt += '<tr><td><input type="checkbox" id="search' + i + '" name="search' + i + '" value="' + document.getElementById("s1").options[i].text + '" ' + selected + '>' + document.getElementById("s1").options[i].text + '</td></tr>';
    }
    columnstxt += '</table>';
    var addFooter = '<table style="width:300px;" class="Headerbg"><tr><td align="right" valign="middle"><a href="javascript:hiddenFloatingDiv(\'' + divId + '\');void(0);"><img alt="Ok" title="Ok" src="images/ok.PNG" border="0"></a></td><td align="left" valign="middle">&nbsp;<a href="javascript:hiddenFloatingDiv(\'' + divId + '\');void(0);"><img alt="Cancel" title="Cancel" src="images/cancel.PNG" border="0"></a></td></tr></table>';
    document.getElementById(divId).innerHTML = addHeader + columnstxt + addFooter;
    document.getElementById(divId).className = 'dimming Bordercolor';
    document.getElementById(divId).style.display = "block";
    document.getElementById('dimmer').style.height = document.body.scrollHeight;

}

function hiddenFloatingDiv(divId) {

    document.getElementById(divId).style.display = "none";
    document.getElementById('dimmer').style.display = 'none';
    DivID = "";
    Resizewindow();
}

function Resizewindow() {
    var closeimg = document.getElementById("closeimg");
}

function PopupfadeTo(obj, opacity) {

    obj = $j("#" + obj.id);
    if (opacity <= 100) {
        if (opacity < 0) {
            opacity = 100;
            document.body.style.cursor = 'default';
        }
        else {
            document.body.style.cursor = 'Hand';
            opacity = 65;
        }
        SetOpacity(obj, opacity);
    }
}

