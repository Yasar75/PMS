// JScript File
var X;
var Y;
var arrPages = new Array();
var arrStruc = new Array();
var arrRes = new Array();
var arrRoles = new Array();
var NewTree = new Array();
var DivId;
var StrDtID;
var saved = false;
var UserEditfld = null;
var isEnterPressed = false;
var updatedRecord = false;
//function stoSvar(a, b, c, d) {

//    proj = a;
//    proj = CheckSpecialCharsInXml(proj);
//    user = b;
//    user = CheckSpecialCharsInXml(user);
//    nsid = c;
//    tst = CheckSpecialCharsInXml(tst);
//    trace = d;
//    trace = CheckSpecialCharsInXml(trace);
//}

//function addOption(selectObject, optionText, optionValue) {
//    try {
//        var optionObject = new Option(optionText, optionValue)
//        var optionRank = selectObject.options.length
//        selectObject.options[optionRank] = optionObject
//    }
//    catch (err)
//    { ShowErrorMsg(err.message); }
//}

//function resetWin() {
//    window.close();
//}



function alphanumeric(alphane) {
    var numaric = alphane;
    for (var j = 0; j < numaric.length; j++) {
        var alphaa = numaric.charAt(j);
        var hh = alphaa.charCodeAt(0);
        if ((hh > 47 && hh < 58) || (hh > 64 && hh < 91) || (hh > 96 && hh < 123)) {
        }
        else {
            return false;
        }
    }
    return true;
}

function disableEnterKey(e) {
    var key;
    if (window.event)
        key = window.event.keyCode;     //IE
    else
        key = e.which;     //firefox

    if (key == 13)
        return false;
    else
        return true;
}

//Function to validate '&' and other special characters
function CheckSpecialCharsInXml(str) {
    var str = str;
    str = str.replace(/&/g, "&amp;");
    str = str.replace(/</g, "&lt;");
    str = str.replace(/>/g, "&gt;");
    str = str.replace(/'/g, "&apos;");
    str = str.replace(/"/g, '&quot;');
    return str;
}

//function findPosX(obj) {
//    var curleft = 0;
//    if (obj.offsetParent) {
//        while (obj.offsetParent) {
//            curleft += obj.offsetLeft
//            obj = obj.offsetParent;
//        }
//    }
//    else if (obj.x)
//        curleft += obj.x;
//    return curleft;
//}
//function findPosY(obj) {
//    var curtop = 0;
//    if (obj.offsetParent) {
//        while (obj.offsetParent) {
//            curtop += obj.offsetTop
//            obj = obj.offsetParent;
//        }
//    }
//    else if (obj.y)
//        curtop += obj.y;
//    return curtop;
//}
//function FindPos() {
//    var img = document.getElementById("btnGetRoles");
//    X = findPosX(img);
//    Y = findPosY(img);
//}

//function ShowRoles() {
//    // FindPos();

//    var dvRoles = $j("#divAddRoles");
//    dvRoles.show();
//}

//function HideRoles() {
//    var dvRoles = $j("#taskListPopUp");
//    dvRoles.hide();
//}

//function ShowAddPanel() {
//    var pnl = $j("#pnlAddRes");
//    pnl.show();
//}

//function HideAddPanel() {
//    var pnl = $j("#pnlAddRes");
//    pnl.show();
//}

//function ShowAddUser(dvid) {
//    if (dvid == "") {
//        dvid = DivId;
//    }
//    else {
//        DivId = dvid;
//    }
//    var div = $j("#" + dvid);
//    div.show();
//    SetGoCall('Add');
//}

//function HideAddUser(dvid) {
//    if (dvid == "") {
//        dvid = DivId;
//    }
//    else {
//        DivId = dvid;
//    }
//    var div = $j("#" + dvid);
//    div.hide();
//}

//function CallSearch() {
//    var divSrc = $j("#searchCtrl");
//    var originalDivHTML = "";
//    if (originalDivHTML == "")
//        originalDivHTML = divSrc.html();
//    title = "";
//    width = 500;
//    var addHeader = '<table style="width:' + width + 'px" class="GridHead">' +
//	            '<tr><td ondblclick="void(0);" onmouseover="over=true;" onmouseout="over=false;" style="cursor:move;height:18px">' + title + '</td>' +
//	            '<td style="width:18px" align="right"><a href="javascript:hiddenFloatingDiv(\'' + searchCtrl + '\');SetAutoComplete();void(0);">' +
//	            '<img alt="Close..." title="Close..." src="../AxpImages/icons/close-button.png" border="0"></a></td></tr></table>';


//    // add to your div an header
//    divSrc.html(addHeader + originalDivHTML);


//    divSrc.css("display", "block");
//    X = screen.width / 4;
//    Y = screen.height / 4;
//    divSrc.css("left", Y + 'px');
//    divSrc.css("top", X + 'px');
//}

//function CallFillGrid() {
//    $j("#btnReEdFill").click();
//}


//function CallGo(btn) {
//    //clear filter text
//    var filterId = "";
//    filterId = btn.substring(3, 5);
//    if (filterId == "Re") {
//        $j("#txtRePlFilter").val("");
//    }
//    else if (filterId == "Ro") {
//        $j("#txtRoPlFilter").val("");
//    }
//    else if (filterId == "Us") {
//        $j("#txtUsPlFilter").val("");
//    }
//    X = undefined;
//    Y = undefined;
//    $j("#" + btn).click();
//}

//function SetGoCall(val) {
//    if (allUsersSrcWin && !allUsersSrcWin.closed)
//        allUsersSrcWin.close();
//    $j("#hdnIsSearched").val(val);
//}

function SetAutoComplete() {
    var txt = document.getElementById("txtReSePages");
    if (txt != undefined) {
        new actb(txt, arrPages);
    }
    var txt1 = document.getElementById("txtReSeStruct");
    if (txt1 != undefined) {
        new actb(txt1, arrStruc);
    }

    var txt2 = document.getElementById("txtRoSePages");
    if (txt2 != undefined) {
        new actb(txt2, arrPages);
    }
    var txt3 = document.getElementById("txtRoSeStruct");
    if (txt3 != undefined) {
        new actb(txt3, arrStruc);
    }

    var txt4 = document.getElementById("txtUsSePages");
    if (txt4 != undefined) {
        new actb(txt4, arrPages);
    }
    var txt5 = document.getElementById("txtUsSeStruct");
    if (txt5 != undefined) {
        new actb(txt5, arrStruc);
    }
    var txt6 = document.getElementById("txtRoSeResp");
    if (txt6 != undefined) {
        new actb(txt6, arrRes);
    }
    var txt7 = document.getElementById("txtUsSeResp");
    if (txt7 != undefined) {
        new actb(txt7, arrRes);
    }
    var txt8 = document.getElementById("txtUsSeRoles");
    if (txt8 != undefined) {
        new actb(txt8, arrRoles);
    }
}

function openChildwintst(tname) {
    ShowDimmer(true);
    var selRolecb = $j("#txtReEditResp");
    var selRole = selRolecb.val();
    parent.displayBootstrapModalDialog("User Access", "md", "400px", true, 'useraccess.aspx?transid=' + tname + '&role=' + selRole, true);
    //var newWindow = window.open('useraccess.aspx?transid=' + tname + '&role=' + selRole, 'Access', 'width=530,height=500,resizable=yes');
    //newWindow.focus();
    //if (!newWindow.closed) { newWindow.focus() }
    //return false;
}

function openChildwiniv(iname) {
    ShowDimmer(true);
    var selRolecb = $j("#txtReEditResp");
    var selRole = selRolecb.val();
    parent.displayBootstrapModalDialog("User Access", "md", "380px", true, 'useracciview.aspx?iname=' + iname + '&role=' + selRole, true);
    //var newWindow = window.open('useracciview.aspx?iname=' + iname + '&role=' + selRole, 'Access', 'width=530,height=500,resizable=yes');
    //newWindow.focus();
    //if (!newWindow.closed) { newWindow.focus() }
    //return false;
}

function client_OnTreeNodeChecked(event) {
    var obj;
    if (window.event == undefined) {

        obj = event.target;
    }
    else {
        obj = window.event.srcElement;
    }
    var treeNodeFound = false;
    var checkedState;

    if (obj.tagName == "INPUT" && obj.type == "checkbox") {
        var treeNode = obj;
        checkedState = treeNode.checked;
        if (checkedState == true || checkedState == false) {
            if (hdnTree == "") {
                hdnTree += treeNode.parentElement.children[1].innerText;
            }
            else {
                hdnTree += "~" + treeNode.parentElement.children[1].innerText;
            }
            NewTree.push(treeNode.parentElement.children[1].innerText);
        }

        do {
            obj = obj.parentElement;
        } while (obj.tagName != "TABLE")
        var parentTreeLevel = obj.rows[0].cells.length;
        var parentTreeNode = obj.rows[0].cells[0];
        var tables = obj.parentElement.getElementsByTagName("TABLE");
        var numTables = tables.length
        if (numTables >= 1) {
            for (i = 0; i < numTables; i++) {
                if (tables[i] == obj) {
                    treeNodeFound = true;
                    i++;
                    if (i == numTables) {
                        return;
                    }
                }
                if (treeNodeFound == true) {
                    window.parent.globalChange = true;
                    var childTreeLevel = tables[i].rows[0].cells.length;
                    if (childTreeLevel > parentTreeLevel) {
                        var cell = tables[i].rows[0].cells[childTreeLevel - 1];
                        var inputs = cell.getElementsByTagName("INPUT");
                        inputs[0].checked = checkedState;
                    }
                    else {
                        return;
                    }
                }
            }
        }
    }
}

function ValidateDate(Rindx, celno) {

    var grd = document.getElementById("grdUsRoles");
    Rindx = Rindx + 1;
    var now = new Date();
    var curMnt = now.getMonth();
    curMnt = curMnt + 1;
    var Currentdt = curMnt + "/" + now.getDate() + "/" + now.getFullYear();
    if (Rindx == "NaN") {
        var txtStrdt = grd.rows[Rindx].cells[celno].childNodes[0];

        if (txtStrdt.value != undefined && txtStrdt.value != "") {
            if (celno == 2) {
                var strDt = txtStrdt.value;
                if (dateString == "dd/mm/yyyy") {
                    var strDts = strDt.toString().split("/");
                    strDt = strDts[1] + "/" + strDts[0] + "/" + strDts[2];
                }
                if (Date.parse(strDt) < Date.parse(Currentdt)) {
                    ShowErrorMsg(eval(callParent('lcm[88]')));
                    txtStrdt.value = "";
                    txtStrdt.focus();
                }
            }
            else {
                var txtStrDt = grd.rows[Rindx].cells[2].childNodes[0];
                var txtEndDt = grd.rows[Rindx].cells[celno].childNodes[0];
                var strDt = txtStrDt.value;
                var EndDt = txtEndDt.value;
                if (dateString == "dd/mm/yyyy") {
                    var strDts = strDt.toString().split("/");
                    strDt = strDts[1] + "/" + strDts[0] + "/" + strDts[2];
                    var EndDts = EndDt.toString().split("/");
                    EndDt = EndDts[0] + "/" + EndDts[0] + "/" + EndDts[2];
                }

                if (Date.parse(strDt) > Date.parse(EndDt)) {
                    ShowErrorMsg(eval(callParent('lcm[89]')));
                    txtEndDt.value = "";
                    txtEndDt.focus();
                }
            }
        }
    }
}

function ValidateResp() {
    var lblNodenotFound = $j("#lblNodenotFound");
    if (lblNodenotFound.length > 0) {
        lblNodenotFound.text("");
    }
    var txtSrchNode = $j("#txtSearchNode");
    txtSrchNode.val("");

    var respName = $j("#txtReEditResp");
    if (respName.val() == "") {
        showAlertDialog("warning", eval(callParent('lcm[90]')));
        respName.focus();
        return false;
    }
    else if (CheckAlphaNumeric(respName.val())) {
        showAlertDialog("warning", eval(callParent('lcm[91]')));
        respName.focus();
        return false;
    }
    else if (IsTreeChecked() == false) {
        showAlertDialog("warning", eval(callParent('lcm[92]')));
        $("#treeEditResn0").focus();
        return false;
    }
    else {
        $("#treeEditRes tbody tr td a").each(function () {
            href = $(this).prop("href");
            if (href.indexOf("javascript:openChildwiniv") != -1) {
                if ($(this).siblings().first().is(":checked")) {
                    $("[href=\"" + href + "\"]").siblings().attr("checked", true)
                }
            }
            else if (href.indexOf("javascript:openChildwintst") != -1) {
                if ($(this).siblings().first().is(":checked")) {
                    $("[href=\"" + href + "\"]").siblings().attr("checked", true)
                }
            }
        })

        ShowDimmer(true);
        return true;
    }
}

function CheckAlphaNumeric(str) {
    if (!/^[a-zA-Z0-9_]+$/.test(str))
        return true;
    else
        return false;
}

//<Module>   TStruct     </Module>
//<Author>   Naveen   </Author>
//<Description> Function to toggle the cursor style. </Description>
function AxWaitCursor(act) {
    if (act) {
        document.body.style.cursor = 'wait';
    }
    else {
        document.body.style.cursor = 'arrow';
        document.body.style.cursor = 'default';
    }
}

function IsTreeChecked() {
    var TreeView = document.getElementById("treeEditRes")
    var checkboxs = TreeView.getElementsByTagName("input")

    for (i = 0; i < checkboxs.length; i++) {
        if (checkboxs[i].type == "checkbox"
            && checkboxs[i].checked) {
            return true;
        }
    }
    return false;
}

function ValidateRole() {
    var txtRole = $j("#txtRoEditRole");

    if (txtRole.val() == "") {
        ShowErrorMsg(eval(callParent('lcm[93]')));
        return false;
    }
    else if (CheckAlphaNumeric(txtRole.val())) {
        ShowErrorMsg(eval(callParent('lcm[94]')));
        txtRole.focus();
        return false;
    }
    else if (IsRoleChecked() == false) {
        ShowErrorMsg(eval(callParent('lcm[95]')));
        return false;
    }
    else {
        return true;
    }

}

function IsRoleChecked() {
    var chkLstRoEd = document.getElementById("chkLstRoEd");
    var checkboxs = chkLstRoEd.getElementsByTagName("input");
    var i = 0;
    for (i = 0; i < checkboxs.length; i++) {
        if (checkboxs[i].type == "checkbox"
            && checkboxs[i].checked) {
            return true;
        }
    }
    return false;
}

function ValidateUser() {
    var username = $j("#txtUsAdName");
    if (username.val() == "") {

        ShowErrorMsg(eval(callParent('lcm[96]')))
        username.focus();
        UserEditfld = $j("#txtUsAdName");
        isEnterPressed = false;
        return false;
    }
    else if (CheckAlphaNumeric(username.val())) {
        ShowErrorMsg(eval(callParent('lcm[97]')));
        username.focus();
        UserEditfld = $j("#txtUsAdName");
        isEnterPressed = false;
        return false;
    }

    var newsw = $j("#txtUsAdsw");
    var consw = $j("#txtUsAdConsw");
    var emailw = $j("#txtUsAdEmail");

    if (newsw.val() == "") {
        ShowErrorMsg(eval(callParent('lcm[98]')));
        newsw.focus();
        UserEditfld = $j("#txtUsAdsw");

        return false;

    }

    else if (consw.val() == "") {
        ShowErrorMsg(eval(callParent('lcm[99]')));
        newsw.focus();
        UserEditfld = $j("#txtUsAdConsw");
        return false;

    }
    else if (newsw.val() != consw.val()) {
        ShowErrorMsg(eval(callParent('lcm[100]')));
        UserEditfld = $j("#txtUsAdsw");

        newsw.focus();
        return false;
    }
    else if ($j("#pwdExpiryDays").val() && (isNaN($j("#pwdExpiryDays").val()) || !$j("#pwdExpiryDays").val().match(/^\d+$/))) {
        ShowErrorMsg(eval(callParent('lcm[101]')));
        $j("#pwdExpiryDays").val('');
        UserEditfld = $j("#pwdExpiryDays");
        return false;
    }
    else if (emailw.val() == "") {
        ShowErrorMsg(eval(callParent('lcm[102]')));
        UserEditfld = $j("#txtUsAdEmail");
        emailw.focus();
        return false;

    }
    else if (echeck(emailw.val()) == false) {

        UserEditfld = $j("#txtUsAdEmail");
        emailw.focus();

        return false;

    }
    else if (IsRoleAdded() == false) {
        ShowErrorMsg(eval(callParent('lcm[103]')));
        UserEditfld = $j("#grdUsRoles_ctl02_ddlUsRole");
        return false;
    }

    else {
        var swhash = $j("#sw000F0");
        newsw.val(swhash.val());
        consw.val(swhash.val());
    }
    UserEditfld = $j("#grdUsRoles_ctl02_ddlUsRole");
    return true;

}

function IsRoleAdded() {
    var grdRoles = document.getElementById("grdUsRoles");
    if (grdRoles == null)
        return false;

    var Rcnt = grdRoles.rows.length;
    if (Rcnt == 0) {

        return false;
    }
    else if (Rcnt == 2) {

        var selectedRole = "";
        var roles = grdRoles.rows[1].cells[1].getElementsByTagName("select")[0];
        if (roles != undefined) {
            selectedRole = roles.options[roles.selectedIndex].value;
        }
        if (selectedRole == "") {
            return false;
        }
        else
            return true;
    }
    return true;
}


/**
* DHTML email validation script. Courtesy of SmartWebby.com (http://www.smartwebby.com/dhtml/)
*/

function echeck(str) {

    var at = "@"
    var dot = "."
    var lat = str.indexOf(at)
    var lstr = str.length
    var ldot = str.indexOf(dot)

    if (str == "") {
        return true;
    }
    if (str.indexOf(at) == -1) {
        ShowErrorMsg(eval(callParent('lcm[104]')))
        return false;
    }

    if (str.indexOf(at) == -1 || str.indexOf(at) == 0 || str.indexOf(at) == lstr) {
        ShowErrorMsg(eval(callParent('lcm[104]')))
        return false;
    }

    if (str.indexOf(dot) == -1 || str.indexOf(dot) == 0 || str.indexOf(dot) == lstr) {
        ShowErrorMsg(eval(callParent('lcm[104]')))
        return false;
    }

    if (str.indexOf(at, (lat + 1)) != -1) {
        ShowErrorMsg(eval(callParent('lcm[104]')))
        return false
    }

    if (str.substring(lat - 1, lat) == dot || str.substring(lat + 1, lat + 2) == dot) {
        ShowErrorMsg(eval(callParent('lcm[104]')))
        return false
    }

    if (str.indexOf(dot, (lat + 2)) == -1) {
        ShowErrorMsg(eval(callParent('lcm[104]')))
        return false
    }

    if (str.indexOf(" ") != -1) {
        ShowErrorMsg(eval(callParent('lcm[104]')))
        return false
    }


    return true
}

function ValidateEmail() {
    var emailID = $j("#txtUsAdEmail");

    if ((emailID.val() == null) || (emailID.val() == "")) {
    }
    if (echeck(emailID.val()) == false) {
        emailID.val("");
        UserEditfld = $j("#txtUsAdEmail");
        emailID.focus()
        return false
    }
    return true
}


/**
* DHTML phone number validation script. Courtesy of SmartWebby.com (http://www.smartwebby.com/dhtml/)
*/

// Declaring required variables
var digits = "0123456789";
// non-digit characters which are allowed in phone numbers
var phoneNumberDelimiters = "()- ";
// characters which are allowed in international phone numbers
// (a leading + is OK)
var validWorldPhoneChars = phoneNumberDelimiters + "+";
// Minimum no of digits in an international phone no.
var minDigitsInIPhoneNumber = 10;

function isInteger(s) {
    var i;
    for (i = 0; i < s.length; i++) {
        // Check that current character is number.
        var c = s.charAt(i);
        if (((c < "0") || (c > "9"))) return false;
    }
    // All characters are numbers.
    return true;
}
function trim(s) {
    var i;
    var returnString = "";
    // Search through string's characters one by one.
    // If character is not a whitespace, append to returnString.
    for (i = 0; i < s.length; i++) {
        // Check that current character isn't whitespace.
        var c = s.charAt(i);
        if (c != " ") returnString += c;
    }
    return returnString;
}
function stripCharsInBag(s, bag) {
    var i;
    var returnString = "";
    // Search through string's characters one by one.
    // If character is not in bag, append to returnString.
    for (i = 0; i < s.length; i++) {
        // Check that current character isn't whitespace.
        var c = s.charAt(i);
        if (bag.indexOf(c) == -1) returnString += c;
    }
    return returnString;
}

function checkInternationalPhone(strPhone) {
    var bracket = 3
    strPhone = trim(strPhone)
    if (strPhone.indexOf("+") > 1) return false
    if (strPhone.indexOf("-") != -1) bracket = bracket + 1
    if (strPhone.indexOf("(") != -1 && strPhone.indexOf("(") > bracket) return false
    var brchr = strPhone.indexOf("(")
    if (strPhone.indexOf("(") != -1 && strPhone.charAt(brchr + 2) != ")") return false
    if (strPhone.indexOf("(") == -1 && strPhone.indexOf(")") != -1) return false
    s = stripCharsInBag(strPhone, validWorldPhoneChars);
    if (strPhone == "") {
        return true;
    }
    else {
        return (isInteger(s) && s.length >= minDigitsInIPhoneNumber);
    }
}

//function ValidatePhoneNumber() {
//    var Phone = $j("#txtUsPhNum");
//    if ((Phone.val() == null) || (Phone.val() == "")) {
//    }
//    if (checkInternationalPhone(Phone.val()) == false) {
//        ShowErrorMsg("Please Enter a Valid Phone Number")
//        Phone.val("");
//        Phone.focus()
//        return false
//    }
//    return true
//}


function HideErrDiv(dvId) {
    var dv = $j("#" + dvId);
    if (dv.length > 0) {
        dv.hide();
    }
}

//To validate a mobile number 
// it will validate 0-9 numbers.
//function ValidateMobileNo(objMobileNo) {
//    if (objMobileNo.value != "") {
//        var incomingString = objMobileNo.value;
//        if (incomingString.length > 15 || incomingString.search(/[^0-9\-()+]/g) != -1 || incomingString.length < 10) {
//            ShowErrorMsg('Please enter valid mobile number');
//            objMobileNo.focus();
//            objMobileNo.value = "";
//            return false;
//        }
//        else
//            return true;
//    }
//}

//Function to close the popup div after get the success result from aws.
function CheckForUnsavedChanges() {

    if (window.parent.globalChange == true) {
        var msg1 = document.getElementById("lblDisErrMsg");
        if (msg1.innerText == "" || msg1.innerText == 'undefined' || navigator.userAgent.indexOf("Firefox")) {
            ShowConfirmMessage("resp");
        }

        HideBackgroundFade();
    }
    window.parent.globalChange = false;
}

function hiddenFloatingDiv(divId, source, message) {

    if (allUsersSrcWin && !allUsersSrcWin.closed)
        allUsersSrcWin.close();

    var msg = $j("#dvPopErrMsg");
    var errorMsg = $j("#lblDisErrMsg");
    HideBackgroundFade();
    if (document.title == "Users") {
        isUserEditMode = false;
        if (message != "success")
            CheckForUnsavedChangesUser();
        else
            window.parent.globalChange = false;
        var msg = document.getElementById("lblDisErrMsg");
        if (msg && msg.innerText != "" && source != "close")
            return;
    }
    else if (document.title == "Responsibility") {
        if (message != "success")
            CheckForUnsavedChanges();
        else
            window.parent.globalChange = false;
        errorMsg.text("");
        msg.hide();
    }
    else if (document.title == "Roles") {
        if (message != "success")
            CheckForUnsavedChangesRole();
        else
            window.parent.globalChange = false;
        errorMsg.text("");
        msg.hide();
    }
    if (!saved) {
        document.getElementById(divId).innerHTML = originalDivHTML;
        document.getElementById(divId).style.visibility = 'hidden';
        document.getElementById('dimmer').style.visibility = 'hidden';
        DivID = "";
        document.body.style.cursor = 'default';
        HideBackgroundFade();
    }
    else {
        AxWaitCursor(true);
        ShowBackgroundFade();
    }
    saved = false;
}

//function MakeDirty() {
//    window.parent.globalChange = true;
//}

//function ValidateCopy() {
//    var grd = document.getElementById("grdReList");
//    var Rcnt = grd.rows.length;
//    var i = 0;
//    var Chkd = 0;
//    for (i = 1; i <= Rcnt - 1; i++) {
//        var chk = grd.rows[i].cells[0].childNodes[0].checked;
//        if (chk == true)
//            Chkd++;
//        if (Chkd > 1) {
//            break;
//        }
//    }
//    if (Chkd > 1) {
//        ShowErrorMsg("Please select one Responsibility to copy.");
//    }
//    else if (Chkd == 0) {
//        ShowErrorMsg("Please select a Responsibility to copy.");
//    }
//    else {
//        displayEditWindow('dvEditResp', 'Add/Edit Responsibility', 'Show', 'Resp');
//    }
//}


////Function to force user to save "unsaved changes" on page unload()btnRoEdSave 
//function CheckForUnsavedChangesRole() {
//    if (window.parent.globalChange == true) {
//        var msg1 = document.getElementById("lblDisErrMsg");
//        if (msg1.innerText == "" || msg1.innerText == 'undefined' || navigator.userAgent.indexOf("Firefox")) {
//            ShowConfirmMessage("role");
//        }

//        HideBackgroundFade();
//    }
//    window.parent.globalChange = false;
//}
////function CapRespChkBxEvent() {
////    window.parent.globalChange = true;
////}
//function CapUserChangeEvent() {
//    window.parent.globalChange = true;
//}

//Function to force user to save "unsaved changes" on page unload() btnUsAdSave
//function CheckForUnsavedChangesUser() {
//    if (window.parent.globalChange == true) {
//        var msg1 = document.getElementById("lblDisErrMsg");
//        if (msg1.innerText == "" || msg1.innerText == 'undefined' || navigator.userAgent.indexOf("Firefox") != -1) {
//            ShowConfirmMessage("user");
//        }

//        HideBackgroundFade();
//    }
//    window.parent.globalChange = false;
//}
//function ShowConfirmMessage(param) {
//    if (navigator.userAgent.indexOf("Firefox") == -1 || navigator.userAgent.indexOf("chrome") == -1) {
//        var cutMess = eval(callParent('lcm[105]'));
//        var glType = eval(callParent('gllangType'));
//        var isRTL = false;
//        if (glType == "ar")
//            isRTL = true;
//        else
//            isRTL = false;
//        var ShowConfirmMessageCB = $.confirm({
//            title: eval(callParent('lcm[155]')),
//            onContentReady: function () {
//                disableBackDrop('bind');
//            },
//            backgroundDismiss: 'false',
//            rtl: isRTL,
//            escapeKey: 'buttonB',
//            content: cutMess,
//            buttons: {
//                buttonA: {
//                    text: eval(callParent('lcm[164]')),
//                    btnClass: 'hotbtn',
//                    action: function () {
//                        ShowConfirmMessageCB.close();
//                        if (param == "user")
//                            $j("#btnUsAdSave").click();
//                        else if (param == "role")
//                            $j("#btnRoEdSave").click();
//                        else if (param == "resp")
//                            $j("#btnReEdSave").click();
//                        saved = true;
//                    }
//                },
//                buttonB: {
//                    text: eval(callParent('lcm[192]')),
//                    btnClass: 'coldbtn',
//                    action: function () {
//                        disableBackDrop('destroy');

//                    },
//                }
//            }
//        });

//    }
//}

//function UpdateHiddenFieldValue() {
//    var active = $j("#chkUsAdAct").is(':checked');
//    $j("#checkBoxDefaultValue").val(active);
//}

//function EffectOtherCheckBoxes() {
//    if ($j('#chkLstRoEd_0').is(':checked')) {
//        window.parent.globalChange = true;
//        $j('#dvResList :checkbox').attr('disabled', true);
//        $j('#dvResList :checkbox').attr('checked', false);
//        $j('#chkLstRoEd_0').attr('checked', true);
//    } else {
//        $j('#dvResList :checkbox').attr('disabled', false);
//    }
//    $j('#chkLstRoEd_0').attr('disabled', false);
//}
//function HideBackgroundFade() {
//    var divMsgBoxBackGroundId = "CoverBackGround";
//    var divBackGround = "<div id=" + divMsgBoxBackGroundId + " class=\"msgBoxBackGround\"></div>";
//    var divMsgBoxBackGround;
//    divMsgBoxBackGround = $j("#" + divMsgBoxBackGroundId);
//    divMsgBoxBackGround.fadeOut(0);
//    setTimeout(function () { divMsgBoxBackGround.remove(); }, 0);
//    $j("#CoverBackGround").css({ display: "none" })
//    $j("#CoverBackGround").hide();
//    $j("#CoverBackGround").hide();
//    BackgroundIsShown = false;
//    document.body.style.cursor = 'default';
//}

//function SelectSingleRadiobutton(rdbtnid, gridId) {
//    //var rdBtn = document.getElementById(rdbtnid);
//    var rdBtnList = $j("#" + gridId + "input[type=radio]:checked");
//    for (i = 1; i < rdBtnList.length; i++) {
//        if (rdBtnList[i].type == "radio" && rdBtnList[i].id != rdbtnid) {
//            rdBtnList[i].checked = false;
//        }
//    }
//}
//Function to show the dimmer on the background.

function ShowDimmer(status) {
    DimmerCalled = true;
    var dv = $j("#waitDiv");
    if (dv.length > 0 && dv != undefined) {
        if (status == true) {

            var currentfr = $j("#middle1", parent.document);
            if (currentfr) {
                //  dv.height(currentfr.height());
                dv.width(currentfr.width());
            }
            dv.show();
            document.onkeydown = function EatKeyPress() { return false; }
        }
        else {
            dv.hide();
            document.onkeydown = function EatKeyPress() { if (DimmerCalled == true) { return true; } }
        }
    }
    else {

        //TODO:Needs to be tested
        if (window.opener != undefined) {

            dv = $j("#waitDiv", window.opener.document);
            if (dv.length > 0) {
                if (status == true)
                    dv.show();
                else
                    dv.hide();
            }
        }
    }
    DimmerCalled = false;
}

function ValidatePswdExpDays() {
    if ($j("#pwdExpiryDays").val() && (isNaN($j("#pwdExpiryDays").val()) || !$j("#pwdExpiryDays").val().match(/^\d+$/))) {
        ShowErrorMsg(eval(callParent('lcm[101]')));
        $j(".msgButton").focus();
        $j("input.msgButton").click(function (e) {
            e.preventDefault();
            $j("#pwdExpiryDays").focus();
            $j("#pwdExpiryDays").val('');
        });
    }
}


//function BindEventFirefox() {
//    var myEvent = window.attachEvent || window.addEventListener;
//    var chkevent = window.attachEvent ? 'onbeforeunload' : 'beforeunload'; /// make IE7, IE8 compitable
//    myEvent(chkevent, function (e) { // For >=IE7, Chrome, Firefox
//        var confirmationMessage = 'Are you sure to leave the page?';  // a space
//        if ((navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Chrome") != -1) && window.parent.globalChange == true)
//            (e || window.event).returnValue = confirmationMessage;
//        if ((navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Chrome") != -1) && window.parent.globalChange == true)
//            return confirmationMessage;
//    });
//}
var curSearchIndex = 0, curSearchCount = 0;
$(document).ready(function () {
    // ChangeTheme(window);
    bindModalCloseEvent();
    try {
        callParentNew("middle1", "id").contentWindow.ShowDimmer(false);//disable loading dimmer in Responsibility page        
    } catch (ex) { }

    try {
        callParentNew("middle1", "id").contentWindow.axpiframeac.ShowDimmer(false);
    } catch (ex) { }

    $("#lblResponsibility").text(eval(callParent('lcm[224]')));
    $("#txtSearchNode").attr("placeholder", eval(callParent('lcm[350]')));
    $("#spnTreeHeading").text(eval(callParent('lcm[316]')));
    $("#searchclear").attr("title", eval(callParent('lcm[318]')));
    $("#searchPrevPages").attr("title", eval(callParent('lcm[163]')));
    $("#searchNextPages").attr("title", eval(callParent('lcm[162]')));
    $("#btnReEdSave").prop({ 'value': eval(callParent('lcm[200]')), 'title': eval(callParent('lcm[200]')) });
    $("#btnClose").prop({ 'value': eval(callParent('lcm[249]')), 'title': eval(callParent('lcm[249]')) });

    respAction = $("#hdnAction").val();
    window.parent.document.getElementById('iFrameAddResponsibility');
    modalHeader = eval(callParent("divModalHeader", "id") + ".getElementById('divModalHeader')");
    modalHeader.innerText = (respAction == "Add" ? eval(callParent('lcm[314]')) : eval(callParent('lcm[168]'))) + " " + eval(callParent('lcm[224]'));

    //if any change make it field dirty
    $('input[type="text"], input[type="radio"], input[type="checkbox"], select').not("#txtSearchNode").each(function (key) {
        $(this).change(function () {
            $(this).addClass('dirty');
        });
    });

    tabFocusEvent('txtReEditResp', 'btnClose');

    $("#rdbStatusList label").addClass("lbl-status");

    $('#txtSearchNode').focusin(function () {
        $(".search-form").addClass("focusTheField")
    }).focusout(function () {
        $(".search-form").removeClass("focusTheField")
    });

    //search entire treeview node on keypress
    $("#txtSearchNode").keyup(function (e) {
        curSearchCount = 0;
        curSearchIndex = 0;
        $('#dvEditResp td').removeClass("search-highlight")
        var searchTxt = $("#txtSearchNode").val();
        if (searchTxt != "")
            searchNode(searchTxt);
        else
            $('#dvEditResp td').removeClass("search-highlight");
        if (searchTxt.length > 0) {
            $("#searchclear").show();

        }
        else {
            $('#dvEditResp td a, #dvEditResp td span').removeClass("filter-a");
            $("#searchclear,#searchNextPages, #searchPrevPages, #lblSearchRecMsg").hide();
        }
    });

    $('#txtSearchNode').on('keydown', function (e) {
        if (e.which == 13) {
            //$("#searchNextPages").click();
            //setTimeout(function () {
            //    $('#txtSearchNode').focus();
            //},100)
            e.preventDefault();
        }
    });

    //treenode search - focus on next search found element
    $("#searchNextPages").click(function () {
        if (curSearchCount == curSearchIndex)
            curSearchIndex = 0;
        ($(".search-highlight").eq(curSearchIndex).find("a").length > 0) ? ($(".search-highlight").eq(curSearchIndex).find("a").focus()) : ($(".search-highlight").eq(curSearchIndex).find("span").focus());
        setCurrentSearchInfo();
        curSearchIndex++;
    })

    //treenode search - focus on prev search found element
    $("#searchPrevPages").click(function () {
        if (curSearchIndex == 0)
            curSearchIndex = curSearchCount;
        curSearchIndex--;
        ($(".search-highlight").eq(curSearchIndex).find("a").length > 0) ? ($(".search-highlight").eq(curSearchIndex).find("a").focus()) : ($(".search-highlight").eq(curSearchIndex).find("span").focus());
        setCurrentSearchInfo();
    })

    //TreeView search(Tstructs/Iviews) - clear icon click - reset the TreeView
    $("#searchclear").click(function () {
        $("#txtSearchNode").val("").focus();
        $('#dvEditResp td').removeClass("search-highlight");
        $('#dvEditResp td a, #dvEditResp td span').removeClass("filter-a")
        $(this).hide();
        $("#searchNextPages, #searchPrevPages, #lblSearchRecMsg").hide();
        $(".treenode-content").animate({ scrollTop: 0 }, "fast");
    });

    //to set hyperlink option(display access rights window) for Tstruct/Iview pages
    $("#treeEditRes tbody tr td img").each(function () {
        var imgType = $(this).prop("alt");
        if (imgType == "TStruct" || imgType == "IView") {
            if (imgType == "TStruct")
                $(this).prop("title", "TStruct").css("height", "16px");
            else
                $(this).prop("title", "IView").css("height", "17px");
            $(this).parent().next().find("input[type='checkbox']").after($(this));
            $(this).css("margin", "0px 2px 4px -3px");
            var href = $(this).attr("href");
            if (href != undefined)
                $(this).next().contents().unwrap().wrap('<a href="' + href + '"></a>');
        }
    });

    //to display Ttstruct/Iview icon after after checkbox for a TreeView node
    $("#treeEditRes tbody tr td a img").each(function () {
        var imgType = $(this).prop("alt");
        if (imgType == "TStruct" || imgType == "IView") {
            if (imgType == "TStruct")
                $(this).prop("title", "TStruct").css("height", "16px");
            else
                $(this).prop("title", "IView").css("height", "17px");
            $(this).parent().parent().next().find("input[type='checkbox']").after($(this));
            $(this).parent().css({ "margin-right": "2px", "margin-left": "0px" });
        }
    });

    //if any Tstruct/Iview is unchecked/checked from Pages nodes then associated Tstruct is unchecked/checked from Tsturct/Iview node
    $("#treeEditRes tbody tr td input[type='checkbox']").change(function () {
        checked = $(this).is(":checked");
        id = $(this).attr("id");
        href = $(this).siblings().next().attr("href");
        if (checked) {
            $("[href=\"" + href + "\"]").siblings().closest("input[type='checkbox']").not("#" + id).prop("checked", true);//find associated Tstruct/Iview using href 
        }
        else {
            if (typeof $(this).attr("title") == "undefined")
                $("[href=\"" + href + "\"]").siblings().closest("input[type='checkbox']").not("#" + id).prop("checked", false);
        }
    });

    if (parent.gllangType == "ar") {
        $("#treeEditRes input[type='checkbox']").siblings().closest("a,span").css("margin-right", "5px");
    }
})

//to show no of records found & current record info
//eg: 5/100
function setCurrentSearchInfo() {
    msg = (curSearchIndex + 1) + " / " + curSearchCount;
    $("#lblSearchRecMsg").text(msg);

    if (curSearchCount > 0)
        expandAllTreeNodes();
}

function clearResponsibility() {
    $("#txtReEditResp").val("");
    $("#ddlStatus").val("Active");
    $("#treeEditRes input[type='checkbox']").prop("checked", false);
}
var hdnTree = "", isFormDirty = false;

//to search entire Treeview nodes 
function searchNode(searchTxt) {
    var searchFound = false;
    if (searchTxt != "") {
        var tree = document.getElementById('treeEditRes');
        var links = tree.querySelectorAll('a,span');
        var keysrch = $("#txtSearchNode").val();
        var re = new RegExp('^.*' + keysrch + '.*$', 'i');
        for (var i = 0, j = links.length; i < j; i++) {
            if (re.test($(links[i]).text())) {
                if (!searchFound)
                    searchFound = true;
                $(links[i]).parent().addClass("search-highlight");
                $(links[i]).addClass("filter-a").attr("tabindex", "0");
                curSearchCount++;
            }
            else
                $(links[i]).removeClass("filter-a");
        }
        if (!searchFound) {
            $("#searchNextPages, #searchPrevPages, #lblSearchRecMsg").hide();
            $('#dvEditResp td a, #dvEditResp td span').removeClass("filter-a")
            $('#dvEditResp td').removeClass("search-highlight")
            showAlertDialog("warning", "No pages found");
        }
        else {
            $("#searchNextPages, #searchPrevPages, #lblSearchRecMsg").show();
            setCurrentSearchInfo();
            //($(".search-highlight").eq(0).find("a").length > 0) ? ($(".search-highlight").eq(0).find("a").focus()) : ($(".search-highlight").eq(0).find("span").focus());
            $('#txtSearchNode').focus();
            expandAllTreeNodes();
        }
    }
    else {
        showAlertDialog("warning", "Please enter Responsibility name to search");
        $('a,span').removeClass("search-highlight")
        $("#txtSearchNode").focus();
    }
}

function expandAllTreeNodes() {
    $("#treeEditRes div").show(); //if search node is found, then expand all treenodes
    $("#treeEditRes a").each(function () {
        if ($(this).attr("href").indexOf('javascript:TreeView_ToggleNode') > -1)
            $(this).find("img").attr("src", treeEditRes_Data.images[5])
    });
}

//bind Modal dialog close button event
function bindModalCloseEvent() {
    $("#btnClose").on('click', function (e) {
        if (checkIfFormChanges()) {
            ConfirmLeave();
        }
        else
            parent.closeModalDialog();
    });
}

//refresh grid in Responsibility page once Responsibility is updated
function bindResponsibilityGrid() {
    parent.document.getElementById("middle1").contentWindow.bindGridData("");
    window.parent.globalChange = false; //reset page level global change after saving responsibility
}

//tab foucus method for individual wizard tab by passing first & last focus ids once tab is loaded
function tabFocusEvent(firstFocusId, lastFocusId) {
    modalButton = eval(callParent("btnModalClose", "id") + ".getElementById('btnModalClose')");
    if (modalButton.className.indexOf("firstFocusable") == -1)
        modalButton.className += " firstFocusable";
    //$(".lastFocusable").removeClass("lastFocusable");
    $("#" + lastFocusId).addClass("lastFocusable");
    $(".lastFocusable").on('keydown.tabRot', function (e) {
        if ((e.which === 9 && !e.shiftKey)) {
            e.preventDefault();
            modalButton.focus();
        }
    });

    modalButton.addEventListener('keydown', function (e) {
        if ((e.which === 9 && e.shiftKey)) {
            e.preventDefault();
            $(".lastFocusable").focus();
        }
    });
    setTimeout(function () {
        $("#" + firstFocusId).focus();
    }, 300)
}

//to check if the form is dirty before closing the dialog
function checkIfFormChanges() {
    $('input[type="text"], input[type="radio"], input[type="checkbox"], select').each(function (key) {
        if (!isFormDirty && $(this).hasClass('dirty')) {
            isFormDirty = true;
        }
    });
    return isFormDirty;
}

//to display confirm dialog while unloading the form only if form inputs changes
function ConfirmLeave() {
    if ($(".jconfirm").length > 0) {
        $(".jconfirm").remove();
    }
    else {
        var ConfirmSaveCB = $.confirm({
            theme: 'modern',
            title: eval(callParent('lcm[155]')),
            onContentReady: function () {
                disableBackDrop('bind');
                //to display tooltips for Confirm & Cancel buttons
                $(".jconfirm-buttons button").each(function () {
                    var txt = $(this).text();
                    $(this).prop('title', txt.charAt(0).toUpperCase() + txt.slice(1))
                });
                $(".jconfirm-buttons .hotbtn").focus(); //to focus on Confirm button once dialog is opened
            },
            backgroundDismiss: 'false',
            escapeKey: 'cancel',
            content: eval(callParent('lcm[319]')),
            buttons: {
                confirm: {
                    text: eval(callParent('lcm[164]')),
                    btnClass: 'btn btn-primary',
                    action: function () {
                        ConfirmSaveCB.close();
                        parent.closeModalDialog();
                        parent.checkIfAnyActionPerformed();
                        window.parent.globalChange = false; //reset page level global change after closing add/edit responsibility dialog
                    }
                },
                cancel: {
                    text: eval(callParent('lcm[192]')),
                    btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                    action: function () {
                        disableBackDrop('destroy');
                        parent.actionsClicked = "";
                    },
                }
            }
        });
    }
}

function ChangeTheme() {
    //var theme = $j("#DropDownList1 option:selected", window.parent.document).text();
    var theme = "";
    theme = eval(callParent('currentThemeColor'));
    if (theme != "") {
        $j("#themecss").attr('href', "../App_Themes/" + theme + "/Stylesheet.min.css?v=23");
    }
    else {
        var themeref = "";
        if (window.opener) {
            themeref = $j("#themecss", window.opener.document).attr("href");
            if (themeref != "") {
                $j("#themecss").attr("href", themeref);
            }
        }
        if (parent.parent.document) {
            themeref = $j("#themecss", parent.parent.document).attr("href");
            if (themeref != "") {
                $j("#themecss").attr("href", themeref);
            }
        }
        if (themeref == "" || themeref == undefined) {
            themeref = "../App_Themes/" + axTheme + "/Stylesheet.min.css?v=23";
            $j("#themecss").attr("href", themeref);
        }
    }
}

