// JScript File
var traceSplitChar = "♦", traceSplitStr = "♦♦";

$j(document).ready(function () {
    checkSuccessAxpertMsg();
});

function CallPDFws() {
    $j("#pdf").css("disabled", "disabled");
    var fn = $j("#pdfFileName").find("option:selected").text();
    fType = document.f1.fname.value,
    trid = document.f1.transid.value,
    trace = traceSplitStr + "CreatePDF-" + fn + traceSplitChar;

    if (fn == "") {
        showAlertDialog("error", 3031, "client");
    }
    else {
        var fileName = rid + fn;
        var pdfXml = '<root axpapp="' + proj + '"  sessionid="' + sid + '"  formname="' + fn + '"  filename="' + fileName + '" transid="' + trid + '"  recordid="' + rid + '"   trace="' + trace + '">';


        try {
            if (fType == "pdf") {
                ASB.WebService.CreatePDF(pdfXml, window.opener.tstDataId, SuccChoices);
            }
            else {
                var fldArray = CloneArray(window.opener.ChangedFields);
                var fldRowArray = CloneArray(window.opener.ChangedFieldDbRowNo);
                var fldValArray = CloneArray(window.opener.ChangedFieldValues);
                var delArray = CloneArray(window.opener.DeletedDCRows);
                ASB.WebService.CreateFastReportPDF(fldArray, fldRowArray, fldValArray, delArray, pdfXml, window.opener.tstDataId, SuccChoices);
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
            window.location.href = scriptsPath + "Axpert/" + sid + "/" + cmdVal;
            window.resizeTo(900, 800);
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
