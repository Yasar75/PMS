function ChangeTheme(iframewindow, fromDraft) {
    if (iframewindow != undefined) {
        var framename = iframewindow.name;
        framename = framename.toLowerCase();
        if ((framename.substring(0, 7) == "openpop") || (framename.substring(0, 7) == "loadpop") || (framename.substring(0, 7) == "ivewPop") || (framename == "savewindow") || (framename.substring(0, 7) == "mypopup")) {
            framename = "MyPopUp";
        }
        if ((iframewindow.name != "MyPopUp") && (framename != "MyPopUp") && (framename != "fileupload")) {

            var theme = eval(callParent('currentThemeColor'));
            $j("#themecss").attr('href', "../App_Themes/" + theme + "/Stylesheet.min.css?v=23");
            if (theme == "") {
                if (fromDraft) {
                    theme = $j("#themecss", window.opener.document).attr("href");
                    $j("#themecss").attr("href", theme);
                }
                else {

                    if (window.parent.document)
                        theme = $j("#themecss", window.parent.document).attr("href");
                    else
                        theme = $j("#themecss", window.opener.document).attr("href");
                    $j("#themecss").attr("href", theme);
                }
            }

        }
        else {

            var themeref = "";
            try {
                themeref = $j("#themecss", window.opener.document).attr("href");
            }
            catch (ex) {
                themeref = $j("#themecss", window.parent.document).attr("href");
            }

            if (themeref != "") {
                $j("#themecss").attr("href", themeref);
            }
        }
    }
}

function ShowChngPwd() {
    var dvCpwd = document.getElementById("dvcpwd");
    if (dvCpwd != undefined) {
        dvCpwd.style.display = "block";
    }
}

function ShowEditPro() {
    var hidDiv = document.getElementById("DisProfile");
    var shDiv = document.getElementById("EditProfile");

    if (hidDiv != undefined && shDiv != undefined) {
        hidDiv.style.display = "none";
        shDiv.style.display = "block";
    }
}

function load() {
    Sys.WebForms.PageRequestManager.getInstance().add_endRequest(EndRequestHandler);
}

function SetHdn(hdnval) {
    var hdn = document.getElementById("hdnStatus");
    hdn.value = hdnval;
}
// JScript File

//var xmlObj = new ActiveXObject("Microsoft.XMLDOM");
var xmlObj;
function SetTstProps(project, userName, transId, sessionId, roleName, traceVal) {
    proj = project;
    proj = CheckSpecialCharsInXml(proj);
    user = userName;
    user = CheckSpecialCharsInXml(user);
    tst = transId;
    tst = CheckSpecialCharsInXml(tst);
    sid = sessionId;
    sid = CheckSpecialCharsInXml(sid);
    trace = traceVal;
    trace = CheckSpecialCharsInXml(trace);
}

function loadParent(recid, transid) {

    window.opener.location.href = "tstruct.aspx?transid=" + transid + "&recordid=" + recid;
    window.close();
}

function adjustwin(iframeWindow, hgt) {
    //as we are using fixed frame heights we dont need to adjust the frame - need to remove every calling fn
    //For now returning the code -- MANIKANTA
    return
    var framename = iframeWindow.name;

    var nweFrm = $j("#middle1", parent.document);

    if (nweFrm.length > 0) {
        var winHgt = $j(window.document.body).height();
        if (parseInt(winHgt, 10) < 400)
            nweFrm.height("400");
        else
            nweFrm.height($j(window.document.body).height());

        if (document.title == "Responsibility")
            nweFrm.height(hgt != undefined ? hgt : "600");
        else if (document.title == "Roles")
            nweFrm.height(hgt != undefined ? hgt : "600");
        else if (document.title == "Users")
            nweFrm.height(hgt != undefined ? hgt : "600");

        //nweFrm.width($j(window.document.body).width());
    }
}

//filename will beUserName + "-" + transid + "~" + dataTime
function LoadDraft(fileName) {
    if (fileName.indexOf('~') != -1 && fileName.indexOf('-') != -1) {
        var transid = fileName.split('-')[1].split('~')[0];
        var ifrm = window.opener.$j("#middle1");
        ifrm.attr("src", "../aspx/tstruct.aspx?transid=" + transid + "&axpdraftid=" + fileName);
        window.opener.parent.globalChange = true;
    }
    else {
        showAlertDialog("error", 1034, "client");
        DeleteDraft(fileName);
    }
    this.close();
}

//Function to delete a draft from the folder.
function DeleteDraft(fileName) {
    var confrmMsg = eval(callParent('lcm[67]'));
    if (!confirm(confrmMsg))
        return;

    AxWaitCursor(true);
    try {
        ASB.WebService.DeleteDraft(fileName, SuccessDeleteDrafts);
    }
    catch (exp) {
        AxWaitCursor(false);
        var execMess = exp.name + "^♠^" + exp.message;
        showAlertDialog("error", 2030, "client", execMess);
    }

}

function SuccessDeleteDrafts(result, eventArgs) {
    AxWaitCursor(false);
    if (result.substring(0, 5) != "error:") {
        $j("#dvDrafts").html(result);
    }
    else
        showAlertDialog("error", result);
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

function UpdateWinVar() {
    try {
        // window.opener.draftsWin = null;
    }
    catch (ex) {
    }
}


////AxManager Page Start
function ConfirmSave() {
    if (document.title == "AxManager") {
        var cutMsg = eval(callParent('lcm[68]'));
        var glType = eval(callParent('gllangType'));
        var isRTL = false;
        if (glType == "ar")
            isRTL = true;
        else
            isRTL = false;
        var ConfirmSaveCB = $.confirm({
            theme: 'modern',
            title: eval(callParent('lcm[155]')),
            onContentReady: function () {
                disableBackDrop('bind');
            },
            backgroundDismiss: 'false',
            escapeKey: 'buttonB',
            rtl: isRTL,
            content: cutMsg,
            buttons: {
                buttonA: {
                    text:eval(callParent('lcm[164]')),
                    btnClass: 'btn btn-primary',
                    action: function () {
                        ConfirmSaveCB.close();
                        $j("#cnfSave").click();
                    }
                },
                buttonB: {
                    text: eval(callParent('lcm[192]')),
                    btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                    action: function () {
                        disableBackDrop('destroy');
                    }
                }
            }
        });

    }
}

function ClearAxManagerData() {
    if (document.title == "AxManager") {
        window.location.href = window.location.href;
        return false;
    }
}

//To make autocomplete work and handle the focus
function FillAxManager() {
    var allProjs = $j("#axAvailableProj").val().split(',');
    $j("#projName").autocomplete({
        source: allProjs
    });

    $j("#projName").keydown(function (event) {
        var charCode = (event.which) ? event.which : event.keyCode;
        if (charCode == 9 || charCode == 13) {
            $j("#projName").blur();
        }
    });

    if ($j("#usrName").val)
        $j("#submit").focus();

    $j("#projName").blur(function (event) {
        if ($j("#projName").val()) {
            $j("#clientConName").val("");
            $j("#usrName").val("");
            $j("#autofillProjDetails").click();
        }
        else
            $j('#dBase').focus();
    });
}
//To validate if all the fields are filled before connect or delete
function ValidateAxManager(isDelete) {
    if (!$j('#projName').val()) {
        showAlertDialog("warning", 1035, "client");
        return false;
    }
    else if (!$j('#clientConName').val()) {
        showAlertDialog("warning", 1036, "client");
        return false;
    }
    else if (!$j('#usrName').val()) {
        showAlertDialog("warning", 1037, "client");
        return false;
    }
    else {
        if (isDelete) {
            var glType = eval(callParent('gllangType'));
            var isRTL = false;
            if (glType == "ar")
                isRTL = true;
            else
                isRTL = false;
            var ValidateAxManagerCB = $.confirm({
                theme: 'modern',
                title: eval(callParent('lcm[155]')),
                onContentReady: function () {
                    disableBackDrop('bind');
                },
                backgroundDismiss: 'false',
                escapeKey: 'buttonB',
                rtl: isRTL,
                content: 'Do you really want to delete project: ' + $j('#projName').val(),
                buttons: {
                    buttonA: {
                        text: eval(callParent('lcm[164]')),
                        btnClass: 'btn btn-primary',
                        action: function () {
                            ValidateAxManagerCB.close();
                            return true;
                        }
                    },
                    buttonB: {
                        text: eval(callParent('lcm[192]')),
                        btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                        action: function () {
                            disableBackDrop('destroy');
                            return false;
                        }
                    }
                }
            });

        }
    }
}
////AxManager Page End
