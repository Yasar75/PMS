// global variables
var isMozilla;
var objDiv = null;
var originalDivHTML = "";
var DivID = "";
var over = false;
var addHeader = "";

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
    let myModal = new BSModal("modalPdfDocument", "PDF Documents", $j("#" + divId).html(), () => {
        //shown callback
    }, () => {
        //hide callback
    });
    myModal.scrollableDialog();
    myModal.okBtn.innerText = "Print";
    myModal.okBtn.setAttribute("onClick", "CallPDFws()");
}


function ClosePdfDiv() {
    $j("#dvPDFDocList").css("display", "none");
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


// JScript File
var traceSplitChar = "♦";
var traceSplitStr = "♦♦";

function CallPDFws() {
    $j("#pdf").css("disabled", "disabled");

    var fn = $j("#pdfFName").find("option:selected").text();
    var fType = $j("#pdfFName").find("option:selected").val();
    var fTypeArr = fType.split('$');
    fType = fTypeArr[0];
    var trid = transid;
    var trace = traceSplitStr + "CreatePDF-" + fn + traceSplitChar;
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
                var fldArray = CloneArray(ChangedFields);
                var fldRowArray = CloneArray(ChangedFieldDbRowNo);
                var fldValArray = CloneArray(ChangedFieldValues);
                var delArray = CloneArray(DeletedDCRows);
                var fldArray = new Array();
                var fldRowArray = new Array();
                var fldValArray = new Array();
                var delArray = new Array();

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
            let myModal = new BSModal("modalPdfDoc", "PDF Documents", "<iframe class='col-12 h-100' src='" + scriptsPath + "Axpert/" + sid + "/" + cmdVal + "'></iframe>", () => {
                //shown callback
            }, () => {
                //hide callback
            });
            myModal.changeSize("fullscreen");
            myModal.hideFooter();
            myModal.hideHeader();
            myModal.showFloatingClose();
            myModal.modalBody.classList.add('p-0');
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
