

var globalRndNum = "";
var isPwdAlphaNumeric = false;
var alphaNumericRegEx =/^[a-zA-Z0-9_]+$/g;
  //  /^.*(?=.*\d)(?=.*[A-Za-z])(?=.*\W).*$/g;
var alphaNumericRegExbasedonkey = /^.*(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*$/g;
function ValidatePassword(obj) {
    if (typeof PasswordprotectKEY != "undefined" && PasswordprotectKEY == true)
        alphaNumericRegEx = alphaNumericRegExbasedonkey;
    globalRndNum = "";
    var validatePwd = document.getElementById("pwdlength");
    var nPwd = document.getElementById("newPwd");
    var cPwd = document.getElementById("confirmPwd");
    var ePw = document.getElementById("existingPwd");

    var passRegEx = RegExp(alphaNumericRegEx);

    if (ePw.value == "") {
        showAlertDialog("warning", 1002, "client"); displayAlertMsgOnParent();
        ePw.focus();
        return false;
    }
    else if (nPwd.value.length < validatePwd.value || cPwd.value.length < validatePwd.value) {
        showAlertDialog("warning", 1003, "client", validatePwd.value); displayAlertMsgOnParent();
        nPwd.focus();
        cPwd.focus();
        return false;
    }
    else if (isEmptyOrSpaces(nPwd.value) == true) {
        showAlertDialog("warning", 5005, "client"); displayAlertMsgOnParent();
        nPwd.focus();
        return false;
    }
    else if (nPwd.value == ePw.value) {
        showAlertDialog("warning", 1004, "client"); displayAlertMsgOnParent();
        nPwd.value = "";;
        document.getElementById("confirmPwd").value = "";
        nPwd.focus();
        return false;
    }
    else if (nPwd.value != "" && cPwd.value != "") {
        if (nPwd.value != cPwd.value) {
            showAlertDialog("warning", 1005, "client"); displayAlertMsgOnParent();
            nPwd.value = "";
            cPwd.value = "";
            document.getElementById("newPwd").value = "";
            document.getElementById("confirmPwd").value = "";
            nPwd.focus();
            return false;

        }
        else if (typeof PasswordprotectKEY != "undefined" && PasswordprotectKEY == true && !passRegEx.test(nPwd.value)) {
            showAlertDialog("error", eval(callParent('lcm[487]'))); displayAlertMsgOnParent();
            nPwd.focus();
            return false;
        }

        else if (isPwdAlphaNumeric && !passRegEx.test(nPwd.value)) {
            
            showAlertDialog("error", eval(callParent('lcm[450]'))); displayAlertMsgOnParent();
            nPwd.focus();
            return false;
        }
    }
    else if (nPwd.value == "") {
        showAlertDialog("warning", 1006, "client"); displayAlertMsgOnParent();
        nPwd.focus();
        return false;
    }
    else if (cPwd.value == "") {
        showAlertDialog("warning", 1007, "client"); displayAlertMsgOnParent();
        cPwd.focus();
        return false;

    }
    $("#hdncheckMsg").val("true");
    document.getElementById("existingPwd").value = "";
    document.getElementById("newPwd").value = "";
    document.getElementById("confirmPwd").value = "";
    //On changing the pwd, if the main page has the pwd expiry div then hide it.
    if ($j("#dvMessage", window.parent.document).is(':visible'))
        $j("#dvMessage", window.parent.document).hide();

    return true;

}

function md5auth(a) {
    var hash = "";
    var newhash = "";
    if (a == "") {
    }
    else {
        hash = MD5(a);
        var newhash = xor_str(hash, document.getElementById("swee000F0"));
        newhash = Base64.encode(newhash);
    }

    return newhash;
}

function md5authNew(a) {
    var hash = "";
    var newhash = "";
    if (a == "") {
    }
    else {
        if ($("#npwdHidden").length != -1)
            $("#npwdHidden").val(a);
        hash = MD5(a);
        $("#npwdHiddenMd5").val(hash);
    }

    return hash;
}


// For New Pwd
var currField = "";
function md5auth2(a) {
    var pwdLength = 8;
    try {
        pwdLength = parseInt(document.getElementById("pwdlength").value, 10);
    }
    catch (exp) { }
    var hash = "";
    if ((a.value != "") && (a.value.length < pwdLength)) {
        var cutMsg = eval(callParent('lcm[72]'));
        ShowErrorMsg(cutMsg.replace('{0}', pwdLength));
        $j(".msgButton").focus();
        $j("input.msgButton").click(function (e) {
            e.preventDefault();
            if (a.name == "swn")
            { document.f1.sw000F0.value = hash; currField = ""; document.f1.swn.focus(); }
            else if (a.name == "swc")
            { document.f1.swc000F0.value = hash; currField = ""; document.f1.swc.focus(); }
            else
                $j("#" + a.name).focus();
        });
        a.value = "";
        return false;
    }
    else if (a.value != "" && isPwdAlphaNumeric) {
        var alphaNum = alphaNumericRegEx;
        if (!a.value.match(alphaNum)) {
            var cutMsg = eval(callParent('lcm[69]'));
            ShowErrorMsg(cutMsg);
            $j(".msgButton").focus();
            $j("input.msgButton").click(function (e) {
                e.preventDefault();
                if (a.name == "swn")
                { document.f1.sw000F0.value = hash; currField = ""; document.f1.swn.focus(); }
                else if (a.name == "swc")
                { document.f1.swc000F0.value = hash; currField = ""; document.f1.swc.focus(); }
                else
                    $j("#" + a.name).focus();
            });
            a.value = "";
            return false;
        }
    }
    currField = "";
    return true;
}

function DoMD5(a) {

    var hash = "";
    if (a.value != "") {
        hash = MD5(a.value);
        var newhash = xor_str(hash, a);
        newhash = Base64.encode(newhash);
        if (a.name == "swn")
        { document.f1.sw000F0.value = newhash; }
        else if (a.name == "swc")
        { document.f1.swc000F0.value = newhash; }
        else if (a.name == "txtUsAdsw") {
            document.getElementById("sw000F0").value = hash;
        }
        currField = "";
    }
    currField = "";
}

function md5auth1(fldObj) {

    if (currField == "") {
        currField = fldObj.name;
    }

    if (currField == fldObj.name) {
        if (md5auth2(fldObj))
            DoMD5(fldObj);
    }
}

function isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
}


function xor_str(hash, txtObj) {

    var to_enc = hash;
    var randomnumber = 0;
    while (randomnumber == 0) {
        randomnumber = Math.floor(Math.random() * 10);
    }

    if (txtObj.name == "swc" || txtObj.name == "swn") {
        if (globalRndNum == "")
            globalRndNum = randomnumber;
        else
            randomnumber = globalRndNum;
    }

    var xor_key = randomnumber;
    var the_res = ""; //the result will be here
    for (i = 0; i < to_enc.length; ++i) {
        the_res += String.fromCharCode(xor_key ^ to_enc.charCodeAt(i));
    }
    the_res = xor_key + the_res;

    return the_res;
}

var Base64 = {

    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = Base64._utf8_encode(input);
        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
    this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
    this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
        }
        return output;
    },

    // private method for UTF-8 encoding
    _utf8_encode: function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }

        return utftext;
    }
}

function DefaultTheme() {
    var cssid = document.getElementsByTagName("link");
    for (var j = 0; j < cssid.length; j++) {
        if (cssid[j].type == 'text/css' && cssid[j].id == 'themecss') // search only css link
            if (cssid[j].href.indexOf("Themes//StyleSheet") != -1) {
                cssid[j].href = "../App_Themes/Blue/Stylesheet.min.css?v=23";
            }
    }
}
//////
function handleError() {
    $j('#lnkAddUser').dblclick(function () {
        document.body.style.cursor = 'wait';
    });
}
$j("#calendar table tr:nth-child(2)").click(function () {
    CapUserChangeEvent();
});
function EndRequestHandler(sender, args) {
    if (args.get_error() == undefined) {
        var hdn = $j("#hdnIsSearched").val();
        var ErrMessageToDisplay = $j("#userErr");
        var SuccessMessageToDisplay = $j("#userSuccess");
        if (hdn == "Edit") {
            displayEditWindow('dvAddEditUser', 'Add/Edit Users', 'show', 'User');
            //TODO:The wait cursor should be added for the users and role tab also
            document.body.style.cursor = 'default';
        }
        else if (hdn == "Add") {
            ShowAddUser('');
            AxWaitCursor(false);
            document.getElementById("hdnIsSearched").value = '';
        }
        else if (hdn == "Delete") {
            displayEditWindow('', '', '', '');
            if (ErrMessageToDisplay.val() != undefined && ErrMessageToDisplay.val() != "") {
                ShowErrorMsg(ErrMessageToDisplay.val());
                HideBackgroundFade();
            }
            if (SuccessMessageToDisplay.val() != undefined && SuccessMessageToDisplay.val() != "") {
                ShowSuccessMsg(SuccessMessageToDisplay.val());
                $j("input.msgButton").click(function (e) {
                    e.preventDefault();
                    hiddenFloatingDiv('dvAddEditUser', 'close', 'success');
                });
            }
        }
        else if (hdn == "DeleteUserRole") {
            AxWaitCursor(true);
            displayEditWindow('dvAddEditUser', 'Add/Edit Users', 'show', 'User');
            document.body.style.cursor = 'default';
            if (ErrMessageToDisplay.val() != undefined && ErrMessageToDisplay.val() != "") {
                ShowErrorMsg(ErrMessageToDisplay.val());
                adjustwin(window, 700);
                if (!$j("#dvAddEditUser").is(':visible'))
                    displayEditWindow('dvAddEditUser', 'Add/Edit Users', 'show', 'User');
            }
            if (SuccessMessageToDisplay.val() != undefined && SuccessMessageToDisplay.val() != "") {
                ShowSuccessMsg(SuccessMessageToDisplay.val());
                $j("input.msgButton").click(function (e) {
                    e.preventDefault();
                    hiddenFloatingDiv('dvAddEditUser', 'close', 'success');
                });
            }
            AxWaitCursor(false);
        }
        else if (hdn == "AddUser") {
            AxWaitCursor(true);
            displayEditWindow('dvAddEditUser', 'Add/Edit Users', 'show', 'User');
            $j("#grdUsRoles_ctl02_ddlUsRole").val('');
            $j("#chkShowUsers").prop("checked", false);
            $j("#chkShowWorkflow").prop("checked", false);
            $j("#chkAvailImport").prop("checked", false);
            $j("#chkAvailExport").prop("checked", false);
            $j("#chkAvailBuild").prop("checked", false);
            $j("#chkAvailAxManager").prop("checked", false);
            $j("#chkAvailSync").prop("checked", false);
            $j("#chkUsAdAct").prop("checked", true);
            document.body.style.cursor = 'default';
            if (ErrMessageToDisplay.val() != undefined && ErrMessageToDisplay.val() != "") {
                ShowErrorMsg(ErrMessageToDisplay.val());
                adjustwin(window, 700);
                if (!$j("#dvAddEditUser").is(':visible'))
                    displayEditWindow('dvAddEditUser', 'Add/Edit Users', 'show', 'User');
            }
            if (SuccessMessageToDisplay.val() != undefined && SuccessMessageToDisplay.val() != "") {
                ShowSuccessMsg(SuccessMessageToDisplay.val());
                $j("input.msgButton").click(function (e) {
                    e.preventDefault();
                    hiddenFloatingDiv('dvAddEditUser', 'close', 'success');
                });
            }
            AxWaitCursor(false);
        }
        else if (hdn == "AddRole") {
            displayEditWindow('', '', '', '');
            if (ErrMessageToDisplay.val() != undefined && ErrMessageToDisplay.val() != "") {
                ShowErrorMsg(ErrMessageToDisplay.val());
                adjustwin(window, 700);
                if (!$j("#dvAddEditUser").is(':visible'))
                    displayEditWindow('dvAddEditUser', 'Add/Edit Users', 'show', 'User');
            }
        }
        else if (hdn == "SaveUser") {
            displayEditWindow('', '', '', '');
            document.body.style.cursor = 'default';
            if (ErrMessageToDisplay.val() != undefined && ErrMessageToDisplay.val() != "") {
                ShowErrorMsg(ErrMessageToDisplay.val());
                adjustwin(window, 700);
                if (!$j("#dvAddEditUser").is(':visible'))
                    displayEditWindow('dvAddEditUser', 'Add/Edit Users', 'show', 'User');
            }
            if (SuccessMessageToDisplay.val() != undefined && SuccessMessageToDisplay.val() != "") {
                ShowSuccessMsg(SuccessMessageToDisplay.val());
                $j("input.msgButton").click(function (e) {
                    e.preventDefault();
                    hiddenFloatingDiv('dvAddEditUser', 'close', 'success');
                });
            }
        }
        else if (hdn == "Search") {
            if (!$j("#dvAddEditUser").is(':visible'))
                hiddenFloatingDiv('dvAddEditUser', 'close', 'success');
            if (ErrMessageToDisplay.val() != undefined && ErrMessageToDisplay.val() != "") {
                ShowErrorMsg(ErrMessageToDisplay.val());
            }
            if (SuccessMessageToDisplay.val() != undefined && SuccessMessageToDisplay.val() != "") {
                ShowSuccessMsg(SuccessMessageToDisplay.val());
                $j("input.msgButton").click(function (e) {
                    e.preventDefault();
                    hiddenFloatingDiv('dvAddEditUser', 'close', 'success');
                });
            }
        }
        ShowDimmer(false);
        $j("input.msgButton").click(function (e) {
            e.preventDefault();
            if (UserEditfld != null) {
                $j(UserEditfld.selector).focus();
            }
            if (!$j("#dvAddEditUser").is(':visible'))
                hiddenFloatingDiv('dvAddEditUser', 'close', 'success');
        });
        $j("#userSuccess").val('');
        $j("#userErr").val('');
        $j("#hdnIsSearched").val('');
        document.body.style.cursor = 'default';
    }
    else {
        AxWaitCursor(false);
        ShowDimmer(false);
        document.body.style.cursor = 'default';
        window.location.href = window.location.href;
    }
}

function load() {
    Sys.WebForms.PageRequestManager.getInstance().add_endRequest(EndRequestHandler);
}


$j(document).ready(function () {
    //loadCustJsLang();
    typeof LoadDate != "undefined" && LoadDate();
    typeof BindEventFirefox != "undefined" && BindEventFirefox();

    typeof checkSuccessAxpertMsg != "undefined" && checkSuccessAxpertMsg();
});

function LoadDate() {
    if (typeof Parameters != "undefined") {
        for (var i = 0; i < Parameters.length; i++) {

            var parameter = Parameters[i].split("~");
            if (parameter[0] == "Culture") {
                dtCulture = parameter[1];
            }
        }
        dtFormat = GetDateFormat(dtCulture);
        dateString = dtFormat;
    }
}

try {
    var hdnTree = document.getElementById("hdnTreeSelVal").value;
} catch (ex) { }

$j(document).keypress(function (event) {
    if (event.keyCode == 13 && isUserEditMode == true && !event.shiftKey) {
        event.preventDefault();
        if (UserEditfld == null) {

            $j("#btnUsAdSave").click();


        }
        else {

            $j(".msgButton").click();
            $j(UserEditfld.selector).focus();
            UserEditfld = null;


        }

        return false;
    }

});
