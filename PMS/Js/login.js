/// <reference path="../ThirdParty/fingerprintjs/FingerprintJS.js" />
var arrProjects = new Array();
var arrLangs = new Array();
var appUrl = "";
var errField = "";
var browserElapsTime = 0;
var proj = "";
var language = "english";

function GetSchemaDetails() {
    var regId = document.getElementById("AxRegId").value;
    try {
        ASB.WebService.GetSchemas(regId, SucceededCallback);
    }
    catch (exp) {

    }
}

function SucceededCallback(result, eventArgs) {
    //parse the result and get the schemas
    //The schema name and alias name will be in the format schemaname^aliasname~schemaname^aliasname
    //TODO: if no schemas defined display message :- No projects published.
    var strData = result.split("~");
    var ddlSchema = $j("#AxSchema");
    if (strData.length == 1 && strData[0] == "") return;
    ddlSchema.empty();
    for (var i = 0; i < strData.length; i++) {
        if (strData[i] != "") {
            var strSchemas = strData[i].split("^");
            var optText = "";
            optText = "<option value='" + strSchemas[0] + "'>" + strSchemas[1] + "</option>";
            ddlSchema.append(optText);
        }
    }

    if (strData.length == 1) ddlSchema[0].selectedIndex = 0;
    $j("#hdnApp").val(ddlSchema.find("option:selected").text());
}

function CheckIsulmtUser() {
    var appUrlUser = top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/"));
    var unlmtUsername = typeof localStorage["unlmtUsername-" + appUrlUser] != "undefined" ? localStorage["unlmtUsername-" + appUrlUser] : "";
    //if ($j('#axSelectProj').val() + "-" + $j("#axUserName").val() == unlmtUsername)
    if ($j('#axSelectProj').val() == unlmtUsername && !isMobile)
        return true;
    else
        return false;
}
function CheckWindowsBtn() {
    var isServercall = chkLoginForm();
    var content = "true";
    if (isServercall != false && isServercall != undefined) {
        $("#WindowCloneBtn").click();
    }
}

// JScript File
function chkLoginForm() {
    GetCurrentTime('Login');
    proj = $j('#axSelectProj').val();
    if ($j('#axLanguage').val() != null || $j('#axLanguage').val() != undefined)
        language = $j('#axLanguage').val().toLowerCase();
    $("#hdnProjName").val(proj);
    $("#hdnProjLang").val(language);
    if ($j('#axSelectProj').is(':visible') && !ValidateProject()) { return false; }
    if ($j('#axLanguage').is(':visible') && !ValidateLanguage()) { return false; }

    var valProj = $j('#axSelectProj').is(':visible') && !$j('#axSelectProj').val() || $j('#axSelectProj').val().toLowerCase() == "select project";
    var valLang = $j('#axLanguage').is(':visible') && !$j('#axLanguage').val();
    if (valProj) {
        showAlertDialog("error", 1008, "client");
        $j("#axSelectProj").focus();
        errField = 'axSelectProj';
        return false;
    }
    else if (!usercheck($j("#axUserName").val())) {
        return false;
    }
    else if (valLang) {
        showAlertDialog("error", 1009, "client");
        $j("#axLanguage").focus();
        errField = 'axLanguage';
        return false;
    }
    else if (valProj == false) {
        try {
            return axAfterInstanceName();
        } catch (ex) {
            if (CheckIsulmtUser()) {
                if (!CheckIsDuplicateUser())
                    return false;
            } else {
                GetProcessTime();
                $("#browserElapsTime").val(browserElapsTime);
                return true;
            }
        }
    }
    else {
        if (CheckIsulmtUser()) {
            if (!CheckIsDuplicateUser())
                return false;
        } else {
            GetProcessTime();
            $("#browserElapsTime").val(browserElapsTime);

            return true;
        }
    }
}

function SetFocus() {
    if ($j('#axSelectProj').is(':visible') && $j('#axSelectProj').val() == "") {
        $j('#axSelectProj').parents(".field-wrapper").addClass("hasValue");
        $j('#axSelectProj').focus();
    }
    else {
        if ($j("#axUserName").length > 0)
            $j("#axUserName").focus();
        else
            $j("#axPassword").focus();
    }
}

function usercheck(a) {
    var userTxt = $j("#axUserName");
    if (a == "") {
        showAlertDialog("error", 1010, "client");
        userTxt.val("");
        userTxt.focus();
        errField = 'axUserName';
        return false;
    }
    else if (!alphanumeric(a)) {
        showAlertDialog("error", 1013, "client");
        userTxt.val("");
        userTxt.focus();
        errField = 'axUserName';
        return false;
    }
    else if ($j("#axPassword").val() == "") {
        showAlertDialog("error", 1011, "client");
        $j("#axPassword").focus();
        errField = 'axPassword';
        return false;
    }
    else {
        return true;
    }
}

function alphanumeric(alphane) {
    var numaric = alphane;
    for (var j = 0; j < numaric.length; j++) {
        var alphaa = numaric.charAt(j);
        var hh = alphaa.charCodeAt(0);
        if ((hh > 47 && hh < 58) || (hh > 64 && hh < 91) || (hh > 96 && hh < 123) || alphaa == '_' || alphaa == '-' || alphaa == '.' || alphaa == '@') { }
        else {
            return false;
        }
    }
    return true;
}

function IsValidEmail(Email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(Email);
}


function ForgotPwd() {
    if ($j('#axSelectProj').is(':visible') && !ValidateProject()) { return false; };
    var un = $j("#txtName").val();
    var hdnproj = $j('#axSelectProj').val();
    var valproj = $j('#axSelectProj').is(':visible') && !$j('#axSelectProj').val() || $j('#axSelectProj').val().toLowerCase() == "select project";
    if (valproj) {
        showAlertDialog("error", 1008, "client");
        $j("#axSelectProj").focus();
        errField = 'axSelectProj';
        return false;
    }

    if (!un) {
        showAlertDialog("error", 1010, "client");
        $j("#txtName").focus();
        errField = 'txtName';
        return false;
    }

    var emailID = $j("#txtMl");
    if ((emailID.val() == null) || (emailID.val() == "")) {
        showAlertDialog("error", 1015, "client");
        emailID.focus();
        errField = 'txtMl';
        return false;
    }
    else if (!IsValidEmail(emailID.val())) {
        showAlertDialog("error", 1014, "client");
        emailID.focus();
        errField = 'txtMl';
        return false;
    }

    $j("#hdnUsrName").val($j("#txtName").val());
    $j("#hdnMl").val($j("#txtMl").val());
    $j("#hdnProj").val(hdnproj);
    $j("#btnReset").trigger("click");
    $('#txtMl').parents().find('.field-wrapper').addClass('hasValue');
    return false;
}

//Function to check for Email.
function CheckEmail(email) {

    var regex = new RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+.[a-zA-Z]{2,4}$");
    return regex.test(email);
}

function AddLanguages() {
    var newarr = [capitalizeFirstLetter(language)];
    if ($j('#axLanguage').length) {
        var axLang = $j("#hdnLangs").val();
        arrLangs = axLang.toLowerCase().split(",");
        $j('#axLanguage').val("");

        if (arrLangs.length < 1) {
            $("#axLanguage").select2({
                data: newarr
            })
            $j("#axLangFld").hide();
            $j("#axLangFld").addClass("hide");
        }
        else if (arrLangs.length == 1) {
            if (arrLangs[0] != "") {
                $("#axLanguage").select2({
                    data: arrLangs
                });
                $('#axLanguage').trigger('change');
                $j("#axLangFld").hide();
                $j("#axLangFld").addClass("hide");
            }
            else {
                $("#axlanguage").select2({
                    data: newarr
                });
                $('#axLanguage').trigger('change');
                $j("#axLangFld").hide();
                $j("#axLangFld").addClass("hide");
            }
        }
        else {
            $j("#axLangFld").show();
            $j("#axLangFld").removeClass("hide");
            $("#axLanguage option[value='english']").remove();
            var newArr = arrLangs.map(capitalizeFirstLetter)
            $("#axLanguage").select2({
                data: newArr
            });
            var localStorageLang = "";
            try {
                if (typeof (Storage) !== "undefined") {
                    localStorageLang = localStorage["langInfo-" + appUrl];
                    if (typeof localStorageLang == "undefined") {
                        localStorageLang = "";
                    }
                }
            } catch (e) {
                //console.log("LocalStorage not Suported");
            }
            if (localStorageLang != "" && arrLangs.indexOf(localStorageLang.toLowerCase()) > -1 && $j('#axLanguage').length > 0) {
                $j('#axLanguage').val(localStorageLang).trigger('change');
            } else {
                try {
                    $j('#axLanguage').val(apitalizeFirstLetter(arrLangs[0])).trigger('change');
                } catch (ex) {
                    $j('#axLanguage').val(capitalizeFirstLetter(arrLangs[0])).trigger('change');
                }
            }
        }
    }
}

$j(document).ready(function () {
    $("a[title ~= 'BotDetect']").removeAttr("style");
    $("a[title ~= 'BotDetect']").removeAttr("href");
    $("a[title ~= 'BotDetect']").css('visibility', 'hidden');

    $('#txtMl').focusout(function () {
        $('#txtMl').parents().find('.field-wrapper').addClass('hasValue');
    });
    if (typeof keepMeAutoLogin != "undefined" && keepMeAutoLogin == "true") {
        $(".page-loader-wrapper").show();
    }
    try {
        GetLoginErrorMsg();
    } catch (ex) { }

    try {
        axBeforePageload();
    }
    catch (ex) {

    }
    if (typeof axOktaSessionInit != "undefined" && typeof axOktaSessionValidate != "undefined" && typeof axOktaLogin != "undefined" && typeof oktadomain != "undefined" && oktadomain != "") {
        try {
            axOktaSessionInit();
        } catch (ex) { }
    }

    try {
        axLoginLoadStart();
    } catch (ex) { }

    appUrl = top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/"));

    if (typeof (Storage) !== "undefined") {
        try {
            if (history.length <= 2 && localStorage["hybridGUID-" + appUrl]) {
                localStorage.removeItem("hybridGUID-" + appUrl);
            }

            if (history.length <= 2 && localStorage["hybridDeviceId-" + appUrl]) {
                localStorage.removeItem("hybridDeviceId-" + appUrl);
            }

        } catch (ex) { }

        try {
            if (hybridGUID) {
                $j("#hdnHybridGUID").val(localStorage["hybridGUID-" + appUrl] = hybridGUID);
            } else if (localStorage["hybridGUID-" + appUrl]) {
                $j("#hdnHybridGUID").val(hybridGUID = localStorage["hybridGUID-" + appUrl]);
            }

            if (hybridDeviceId) {
                $j("#hdnHybridDeviceId").val(localStorage["hybridDeviceId-" + appUrl] = hybridDeviceId);
            } else if (localStorage["hybridDeviceId-" + appUrl]) {
                $j("#hdnHybridDeviceId").val(hybridDeviceId = localStorage["hybridDeviceId-" + appUrl]);
            }
        } catch (ex) { }

        try {
            localStorage.removeItem("duplicateUser-" + appUrl);
            localStorage.removeItem("instanceName-" + appUrl);
        } catch (ex) { }
    }

    {
        if ($('#SigninTemplate').html().trim() != "") {
            if (!$('template.templateAgContent').prev().is(".templateRendered")) {
                renderTemplete('template.templateAgContent');
            }
            setTimeout(() => {
                $(".axCustomLoginControl").each((ind, elm) => {
                    let elmId = $(elm).data("id");
                    if (elmId) {
                        let controlElem = $(`#${elmId}`);
                        if (controlElem) {
                            if ($(elm).is("input:text,input:password,select")) {
                                $(elm).val(controlElem.val());

                                $(elm).off("keyup.custom,change.custom").on("keyup.custom,change.custom", function (e) {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    controlElem.val($(elm).val()).trigger(e.type);
                                });
                            } else if ($(elm).is("input:checkbox")) {
                                $(elm).prop("checked", controlElem.prop("checked"));

                                $(elm).off("change.custom").on("change.custom", function (e) {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    controlElem.prop("checked", $(elm).prop("checked")).trigger(e.type);
                                });
                            } else if ($(elm).is("a,button")) {
                                $(elm).off("click.custom").on("click.custom", function (e) {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    controlElem.trigger(e.type);
                                });
                            }
                        }
                    }
                });
            }, 0);
        }
    }

    $(".field-wrapper .field-placeholder").on("click", function () {
        $(this).closest(".field-wrapper").find("input").focus();
    });
    $(".field-wrapper input").on("click", function () {
        $(this).closest(".field-wrapper").addClass('hasValue');
    });
    if (isMobileDevice()) {
        $(".card.login-inner").append("<button type=\"button\" id=\"axpertMob\" value=\"axpertMobile\" class=\"hybridAppSettingBtn\" onclick=\"ok.performClick(this.value);\"><i class=\"fa fa-cog\"></i></button>");
        let custommoblogoexist = false;
        if (diFileInfo != "") {
            $j("#main_body").removeAttr("style");
            var imageUrl = "./../images/Custom/" + diFileInfo;
            $j("#main_body").css({ "background-image": "url(" + imageUrl + ")", "background-size": "cover", "height": "100vh" });
            custommoblogoexist = true;
        }
        if (custommoblogoexist == false) {
            $j("#main_body").removeAttr("style");
            var imageUrl = "./../AxpImages/login-img.png";
            $j("#main_body").css({ "background-image": "url(" + imageUrl + ")", "background-size": "cover", "height": "100vh" });
        }

    }
    if (typeof ok == 'undefined') {
        $j("#axpertMob").hide();
    }
    else {
        $j("#axpertMob").show();
    }

    if (typeof $j("#hdnAxProjs").val() != "undefined")
        arrProjects = $j("#hdnAxProjs").val().replace("Select Project,", "").replace("Select Project", "").split(",");
    $("#axSelectProj").select2({
        data: arrProjects
    })
    $('#axSelectProj').trigger('change');
    $("#axLanguage option[value='english']").remove();
    var newArr = arrLangs.map(capitalizeFirstLetter)
    $("#axLanguage").select2({
        data: newArr
    })

    $('#axSelectProj').on('change', function (e) {

        GetProjLang();
    }
    )
    $('#axSelectProj').css("background-color", "#e8f0fe");

    if ($j("#axpertVer").length > 0) {
        getVersionDetails();
    }
    AddLanguages();

    if (arrProjects.length < 1) {
        $j("#selectProj").hide();
    }
    else if (arrProjects.length == 1) {
        $j('#axSelectProj').val(arrProjects[0]).parents("field-wrapper").addClass("hasValue");
        $j("#selectProj").hide();
        setProjectNeeds(arrProjects[0]);
    }
    else {
        // createProjectListAutoComplete();
    }

    if ($j("#hdnProj").length && $j("#hdnProj").val() != "") {
        $j("#axSelectProj").val($j("#hdnProj").val()).parents("field-wrapper").addClass("hasValue");
    }
    var localStorageProj = "";
    try {
        if (typeof (Storage) !== "undefined") {
            localStorageProj = localStorage["projInfo-" + appUrl];
            if (typeof localStorageProj == "undefined") {
                localStorageProj = "";
            }
        }
    } catch (e) {
        //console.log("LocalStorage not Suported");
    }
    if (localStorageProj != "" && arrProjects.indexOf(localStorageProj) > -1 && arrProjects.length > 1 && $j('#axSelectProj').length > 0) {
        $j("#axSelectProj").val(localStorageProj).parents("field-wrapper").addClass("hasValue");
        $("#axSelectProj").select2().select2('val', localStorageProj);
        setProjectNeeds(localStorageProj, false);
    } else {
        setProjectImages(localStorageProj)
    }

    SetFocus();
    //GetProjLang();
    GetProjCopyRightTxt();

    $("#axSelectProj, #axUserName, #axPassword, #axLanguage, #txtName, #txtMl").on('keyup keypress blur change', function () {
        if ($(this).attr('id') == errField && $(this).val()) {
            HideErrorMsg();
            errField = "";
        }
    });
    if ((typeof isOfficeSSO != "undefined" && isOfficeSSO == "") && typeof axOktaSessionInit != "undefined" && typeof axOktaSessionValidate != "undefined" && typeof axOktaLogin != "undefined" && typeof oktadomain != "undefined" && oktadomain != "") {
        try {
            axOktaSessionValidate();
        } catch (ex) { }
    }
    KTApp.init();
    $("#axSelectProj, #axUserName, #axPassword, #axLanguage, #txtName, #txtMl").on('keyup', function () {
        var value = $.trim($(this).val());
        if (value) {
            $(this).closest(".field-wrapper").addClass("hasValue");
        } else {
            $(this).closest(".field-wrapper").removeClass("hasValue");
        }
        if ($j('#axSelectProj').is(':visible') && $j('#axSelectProj').val() != "")
            $j('#axSelectProj').closest(".field-wrapper").addClass("hasValue");
        if ($j('#axLanguage').is(':visible') && $j('#axLanguage').val() != "")
            $j('#axLanguage').closest(".field-wrapper").addClass("hasValue");
    });

    $(".field-wrapper input").each(function () {
        var value = $.trim($(this).val());
        if (value) {
            $(this).closest(".field-wrapper").addClass("hasValue");
        } else {
            $(this).closest(".field-wrapper").removeClass("hasValue");
        }
    });

    $j("#hdnMobDevice").val(isMobileDevice() == true ? "True" : "False");

    $j("#hdnTimeZone").val(`tz~${Intl.DateTimeFormat().resolvedOptions()?.timeZone || ""}~${(new Date()).getTimezoneOffset()}`);

    GetBrowserUId();

    if (typeof keepMeAutoLogin != "undefined" && keepMeAutoLogin == "true") {
        HybridAutoSignin();
    }

    try {
        $("#hdnbtforLogin").val(bst);
    } catch (ex) { }

    try {
        axLoginLoadFinish();
    } catch (ex) { }
});



var myVersionJSON;
var versionInfoFile = "../versionInfo.json";
function getVersionDetails() {
    $.ajax({
        url: versionInfoFile,
        type: "GET",
        cache: false,
        statusCode: {
            404: function () {
                $.getJSON(versionInfoFile, function (json) {
                    //If File Dont Exist
                });
            }
        },
        success: function (json) {
            var data = { value: json };
            myVersionJSON = data.value;
            setVersionInfo();
        }
    });
}

function setVersionInfo() {

    var currentVerion = "10.0.0.0";
    var subVersion = "";
    currentVerion = myVersionJSON.version;
    if (myVersionJSON.subVersion) {
        subVersion = "_" + myVersionJSON.subVersion.toString();
    }
    var finalVersion = "";
    finalVersion = "Version " + currentVerion + subVersion;
    $j("#axpertVer").text(finalVersion);
}

function OpenForgotPwd() {
    var valProj = $j('#axSelectProj').is(':visible') && !$j('#axSelectProj').val() || $j('#axSelectProj').val().toLowerCase() == "select project";
    if (valProj) {
        showAlertDialog("error", 1008, "client");
        $j("#axSelectProj").focus();
        errField = 'axSelectProj';
        return false;
    }
    else if (valProj == false && $j('#axSelectProj').val() == "") {
        try {
            return axAfterInstanceName();
        } catch (ex) {
            return false;
        }
    }
    var hdnproj = $j('#axSelectProj').val();
    if (hdnproj != "")
        window.document.location.href = "ForgotPassword.aspx?proj=" + hdnproj + "";
}

function HideErrorMsg() {
    hideAlertDialog('');
}

function GetProjLang() {
    if (typeof isUserLang != "undefined" && isUserLang == "") {
        $.ajax({
            type: "POST",
            url: "signin.aspx/GetCurrLang",
            // data: '{name: "' + $j('#axSelectProj').val() + '" }', 
            data: '{name: "' + $("#hdnProjName").val() + '" }',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: OnSuccess,
            failure: function (response) {
                showAlertDialog("error", response.d);
            }
        });
    }
}

function OnSuccess(response) {
    var result = "";
    result = response.d;
    if (result != "" && result.toUpperCase() != "ENGLISH") {
        $j("#axLangFld").show();
        $j("#axLangFld").removeClass("hide");
    }
    else {
        $j("#axLangFld").hide();
        $j("#axLangFld").addClass("hide");
    }
    //$j("#hdnLangs").val(response.d);
    AddLanguages();
    /*    GetProjCopyRightTxt();*/
}

function GetProjCopyRightTxt() {
    if (isPowerBy == "") {
        $.ajax({
            type: "POST",
            url: "signin.aspx/GetCurrCopyRightTxt",
            data: '{name: "' + (typeof $j('#axSelectProj') == "undefined" ? $j('#hdnProjName').val() : $j('#axSelectProj').val()) + '", lang: "' + ($j("#hdnLangs").val() == "" ? language : $j("#hdnLangs").val()) + '" }',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: OnSuccessCopyRight,
            failure: function (response) {
                showAlertDialog("error", response.d);
            }
        });
    }
}
function OnSuccessCopyRight(result) {
    if (result.d != "") {
        copyRightTxt = result.d;
        $j("#dvCopyRight").html(copyRightTxt);
    }

}

function ValidateProject() {
    var strProj = $j('#axSelectProj').val();
    try {
        if (strProj == null) {
            $j('#axSelectProj').val("");
            showAlertDialog("error", 1016, "client");
            $j("#axSelectProj").focus();
            errField = 'axSelectProj';
            return false;
        }
        if (strProj.length) {
            var isValidProj = false;
            for (k in arrProjects) {
                if (arrProjects[k].toLowerCase() == strProj.toLowerCase()) {
                    isValidProj = true;
                    break;
                }
            }
            if (strProj.toLowerCase() == "select project" || !isValidProj) {
                $j('#axSelectProj').val("");
                showAlertDialog("error", 1016, "client");
                $j("#axSelectProj").focus();
                errField = 'axSelectProj';
                return false;
            }
        }
        return true;
    }
    catch (ex) { };
}

function ValidateLanguage() {
    var strLang = $j('#axLanguage').val();
    if (strLang.length) {
        var isValidLang = false;
        for (k in arrLangs) {
            if (arrLangs[k].toLowerCase() == strLang.toLowerCase()) {
                isValidLang = true;
                break;
            }
        }
        if (!isValidLang) {
            $j('#axLanguage').val("");
            showAlertDialog("error", 1017, "client");
            $j("#axLanguage").focus();
            errField = 'axLanguage';
            return false;
        }
    }
    return true;
}

function createProjectListAutoComplete() {
    $("#axSelectProj").autocomplete({
        minLength: 0,
        selectFirst: true,
        autoFocus: true,
        source: function (request, response) {

            var arrProjSearch = new Array;
            for (k in arrProjects) {
                if (arrProjects[k].toLowerCase().indexOf(request.term.toLowerCase()) >= 0) {
                    arrProjSearch.push(arrProjects[k]);
                }
            }

            if (arrProjSearch.length != 0) {
                response($.map(arrProjSearch, function (item) {
                    return {
                        label: item, value: item, link: ""
                    }
                }))
            }
            else {
                var result = [{ label: lcm[0], value: response.term, link: "" }];
                response(result);
            }
        },

        open: function (event, ui) {
            var dialog = $(this).closest('.ui-dialog');
            if (dialog.length > 0) {
                $('.ui-autocomplete.ui-front').zIndex(dialog.zIndex() + 1);
            }
        },

        select: function (event, ui) {

            if (ui.item.label == lcm[0]) {
                $(this).val('');
                return false;
            }
            else {
                $(this).val(ui.item.label);
            }
            setProjectNeeds(ui.item.label);
            HideErrorMsg();
        },
        forceChange() {
            setProjectNeeds($(this).val());
        }
    });
}

function createLanguageAutoComplete() {
    $("#axLanguage").autocomplete({
        minLength: 0,
        selectFirst: true,
        autoFocus: true,
        source: function (request, response) {
            var arrLangSearch = new Array;
            for (k in arrLangs) {
                if (arrLangs[k].toLowerCase().indexOf(request.term.toLowerCase().trim()) >= 0) {
                    arrLangSearch.push(capitalizeFirstLetter(arrLangs[k]));
                }
            }

            if (arrLangSearch.length != 0) {
                response($.map(arrLangSearch, function (item) {
                    return {
                        label: item, value: item, link: ""
                    }
                }))
            }
            else {
                var result = [{ label: lcm[0], value: response.term, link: "" }];
                response(result);
            }
        },

        open: function (event, ui) {
            var dialog = $(this).closest('.ui-dialog');
            if (dialog.length > 0) {
                $('.ui-autocomplete.ui-front').zIndex(dialog.zIndex() + 1);
            }
        },

        select: function (event, ui) {
            if (ui.item.label == lcm[0]) {
                $(this).val('');
                return false;
            }
            else {
                $(this).val(ui.item.label);
                try {
                    if (typeof (Storage) !== "undefined") {
                        localStorage["langInfo-" + appUrl] = ui.item.label;
                    }
                } catch (e) {
                    //console.log("LocalStorage not Suported");
                }
            }

            $("#axLanguage").blur();
            //GetProjCopyRightTxt();
        }
    });
}

function capitalizeFirstLetter(status) {
    return status.charAt(0).toUpperCase() + status.slice(1);
}

function office365SsoFinalise(userid, username, proj) {
    if (typeof proj != "undefined") {
        $("#hdnAxProjs").val(proj);
    }
    let staySignedIn = "";
    try {
        staySignedIn = localStorage.getItem("staySignedIn");
        localStorage.removeItem("staySignedIn");
    }
    catch (ex) { }
    if (window.location.href.indexOf("?") > -1)
        window.location.href = window.location.href + "&ssotype=office365&ismobile=" + (isMobileDevice() == true ? "True" : "False") + "&code=" + (userid + "*$*" + username) + "&ssin=" + staySignedIn;
    else
        window.location.href = window.location.href + "?ssotype=office365&ismobile=" + (isMobileDevice() == true ? "True" : "False") + "&code=" + (userid + "*$*" + username) + "&ssin=" + staySignedIn;
    return false;
}

function oktaSsoFinalise(userid, username, proj) {
    if (typeof proj != "undefined") {
        $("#hdnAxProjs").val(proj);
    }
    let staySignedIn = "";
    try {
        staySignedIn = localStorage.getItem("staySignedIn");
        localStorage.removeItem("staySignedIn");
    }
    catch (ex) { }
    if (window.location.href.indexOf("?") > -1)
        window.location.href = window.location.href + "&ssotype=okta&ismobile=" + (isMobileDevice() == true ? "True" : "False") + "&code=" + (userid + "*$*" + username) + "&ssin=" + staySignedIn;
    else
        window.location.href = window.location.href + "?ssotype=okta&ismobile=" + (isMobileDevice() == true ? "True" : "False") + "&code=" + (userid + "*$*" + username) + "&ssin=" + staySignedIn;
    return false;
}

function Office365Init() {
    if (typeof signedin != "undefined")
        localStorage.setItem("staySignedIn", signedin.checked);
    else
        localStorage.setItem("staySignedIn", "false");
    axOffice365SessionInit();
    ssoLogin();
}

function CheckIsUserLogged() {
    var isUserLogged = $.confirm({
        theme: 'modern',
        closeIcon: false,
        title: 'Security Alert',
        escapeKey: 'buttonB',
        onContentReady: function () {
            disableBackDrop('bind');
        },
        content: eval(callParent('lcm[311]')),
        buttons: {
            buttonA: {
                text: eval(callParent('lcm[279]')),
                btnClass: 'btn btn-primary',
                action: function () {
                    $(".jconfirm-buttons button").each(function () {
                        $(this).attr('disabled', true);
                        $(this).addClass('confdisable');
                    });
                    $j("#mobDevice").val(isMobileDevice() == true ? "True" : "False");
                    $j("#duplicateUser").val("true");
                    $j("#hbtforDupLogin").val(bst);
                    $j("#btnSubmitUser").click();
                }
            },
            buttonB: {
                text: eval(callParent('lcm[280]')),
                btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                action: function () {
                    window.location.href = "./signin.aspx";
                    disableBackDrop('destroy');
                }
            }
        },
        onOpenBefore: function () {
            $(".jconfirm-buttons button").each(function () {
                $(this).addClass('Custom_Case');
            });
        },
    });
}

function CheckIsDuplicateUser() {
    var isUserulmt = $.confirm({
        theme: 'modern',
        closeIcon: false,
        title: 'Security Alert',
        escapeKey: 'buttonB',
        onContentReady: function () {
            disableBackDrop('bind');
        },
        content: eval(callParent('lcm[311]')),
        buttons: {
            buttonA: {
                text: eval(callParent('lcm[279]')),
                btnClass: 'btn btn-primary',
                action: function () {
                    var appUrlUser = top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/"));
                    localStorage.removeItem("unlmtUsername-" + appUrlUser);
                    GetProcessTime();
                    $("#browserElapsTime").val(browserElapsTime);
                    $j("#btnSubmit").click();
                }
            },
            buttonB: {
                text: eval(callParent('lcm[280]')),
                btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                action: function () {
                    window.location.href = "./signin.aspx";
                    disableBackDrop('destroy');
                }
            }
        },
        onOpenBefore: function () {
            $(".jconfirm-buttons button").each(function () {
                $(this).addClass('Custom_Case');
            });
        },
    });
}

function SetInstance(insName, SessId, boolVal, requestProcess_logtime, serverprocesstime) {
    GetCurrentTime('Login');

    WireElapsTime(serverprocesstime, requestProcess_logtime);
    let appSessUrl = top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/"));
    if (boolVal == "true") {
        localStorage.setItem("duplicateUser-" + appSessUrl, insName + "-" + SessId);
        localStorage.setItem("instanceName-" + appSessUrl, insName);
    } else {
        localStorage.setItem("duplicateUser-" + appSessUrl, insName + "-" + SessId);
    }
    GetProcessTime();
    //GetTotalElapsTime();
    $('#form2').prepend('<input type="hidden" id="hdnbrowserElapsTime" name="hdnbrowserElapsTime" value="' + browserElapsTime + '" />');
}

function chkSSOLogin() {
    $("#axUserName").removeAttr("required");
    $("#axPassword").removeAttr("required");
    return true;
}

function SetLoginErrorMsg(msg) {
    let applnUrl = top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/"));
    localStorage["lnmsg-" + applnUrl] = msg;
    if (top.window.location.href.indexOf('?InternalSSO=') > -1)
        top.window.location.href = applnUrl + "/aspx/signin.aspx";
    else
        top.window.location.href = top.window.location.href;
}

function GetLoginErrorMsg() {
    let applnUrl = top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/"));
    let lnmsg = localStorage["lnmsg-" + applnUrl];
    if (localStorage["lnmsg-" + applnUrl])
        localStorage.removeItem("lnmsg-" + applnUrl);
    if (typeof lnmsg != "undefined" && lnmsg != "")
        showAlertDialog('error', lnmsg);
}

function HybridAutoSignin() {
    $("#hdnbtforLogin").val(bst);
    $j("#axPassword").val(keepMeAutoPwd);
    $j("#btnSubmit").click();
}

function setProjectNeeds(proj, addLocalStorage = true) {
    if (addLocalStorage) {
        try {
            if (typeof (Storage) !== "undefined") {
                localStorage["projInfo-" + appUrl] = proj;
            }
        } catch (e) {
            //console.log("LocalStorage not Suported");
        }
    }

    let gsLink = $("#customGlobalStyles");

    if (gsLink && gsLink.data("proj") != proj) {
        var url = "../" + proj + "/customGlobalStyles.css";
        $.ajax({
            url,
            type: 'HEAD',
            success() {
                let tStamp = (new Date().getTime());
                gsLink.replaceWith("<link id=\"customGlobalStyles\" data-proj=\"" + proj + "\" href=\"../" + proj + "/customGlobalStyles.css?v=" + tStamp + "\" rel=\"stylesheet\" />");
                localStorage["customGlobalStylesExist-" + appUrl] = tStamp;
            },
            error() {
                gsLink.replaceWith("<link id=\"customGlobalStyles\" data-proj=\"" + proj + "\" href=\"\" rel=\"stylesheet\" />");
                localStorage["customGlobalStylesExist-" + appUrl] = false;
            }
        });

        setProjectImages(proj);
    }

    let customStylesLink = ["customIviewNewUi", "customTstructNewUi", "customAxpertUI", "customCompressedTstruct"];

    try {
        $(customStylesLink).each((ind, elem) => {
            var url = `../${proj}/${elem}.css`;
            $.ajax({
                url,
                type: 'HEAD',
                success() {
                    let tStamp = (new Date().getTime());
                    localStorage[`${elem}Exist-${appUrl}`] = tStamp;
                },
                error() {
                    localStorage[`${elem}Exist-${appUrl}`] = false;
                }
            });
        });
    } catch (ex) { }

}

function setProjectImages(proj) {
    let logoImage = `../images/loginlogo.png`;
    let webBgImage = `../AxpImages/login-img.png`;
    let mobBgImage = `../AxpImages/login-img.png`;

    let logoImageDiv = $('.form-title img');
    let webBgImageDiv = $("body");
    let mobBgImageDiv = $("body");

    if (proj) {
        getProjectAppLogo(proj, async = true,
            (success) => {
                if (success?.d) {
                    let { logo, webbg, mobbg } = JSON.parse(success.d);

                    if (webbg && !mobbg) {
                        mobbg = webbg
                    }

                    logoImageDiv.prop("src", logo ? `${logo}?v=${(new Date().getTime())}` : logoImage);
                    if (!isMobile) {
                        webBgImageDiv.css("background", `url(${webbg ? (`${webbg}?v=${(new Date().getTime())}`) : webBgImage}) ${webbg ? `no-repeat center center fixed` : `no-repeat fixed bottom`}`).css("background-size", "cover");
                    } else {
                        mobBgImageDiv.css("background", `url(${mobbg ? (`${mobbg}?v=${(new Date().getTime())}`) : mobBgImage}?v=${(new Date().getTime())}) ${mobbg ? `no-repeat center center fixed` : `no-repeat fixed bottom`}`).css("background-size", "cover");
                    }
                } else {
                    logoImageDiv.prop("src", logoImage);
                    if (!isMobile) {
                        webBgImageDiv.css("background", `url(${webBgImage}) no-repeat fixed bottom`).css("background-size", "cover");
                    } else {
                        mobBgImageDiv.css("background", `url(${mobBgImage}?v=${(new Date().getTime())}) no-repeat fixed bottom `).css("background-size", "cover");
                    }
                }
            },
            (error) => {
                logoImageDiv.prop("src", logoImage);
                if (!isMobile) {
                    webBgImageDiv.css("background", `url(${webBgImage}) no-repeat fixed bottom`).css("background-size", "cover");
                } else {
                    mobBgImageDiv.css("background", `url(${mobBgImage}?v=${(new Date().getTime())}) no-repeat fixed bottom`).css("background-size", "cover");
                }
            }
        );
    } else {
        logoImageDiv.prop("src", logoImage);
        if (!isMobile) {
            webBgImageDiv.css("background", `url(${webBgImage}) no-repeat fixed bottom`).css("background-size", "cover");
        } else {
            mobBgImageDiv.css("background", `url(${mobBgImage}?v=${(new Date().getTime())}) no-repeat fixed bottom`).css("background-size", "cover");
        }
    }
}

function OpenNewConnection() {
    var hdnproj = $j('#axSelectProj').val();
    if (hdnproj != "")
        window.document.location.href = "Config.aspx?proj=" + hdnproj + "";
    else
        window.document.location.href = "Config.aspx";
}

function KeepMeSigninConfirm(usrList) {
    var dvHtml = `<div class="container-fluid"><div class="row userNameGroup">`;
    $.each(usrList.split(","), function (ind, val) {
        dvHtml += `<div class="userNameList" onclick="loginKeepSigninUser('` + val + `');"><span class="material-icons userNameIcon">account_circle</span><span class="userNameText">` + val + `</span></div>`;
    });
    dvHtml += `<div class="userNameList" onclick="loginKeepSigninUser('Loginwithanotheruser');"><span class="material-icons userNameIcon">person_add_alt</span><span class="userNameText">Login with another user</span></div>`;
    dvHtml += `</div></div>`;
    var KeepMeSignin = $.confirm({
        theme: 'modern',
        closeIcon: false,
        title: 'Select UserName to continue login',
        escapeKey: 'buttonB',
        onContentReady: function () {
            disableBackDrop('bind');
        },
        boxWidth: "450px",
        useBootstrap: false,
        content: dvHtml,
        buttons: {
            buttonA: {
                text: "",
                btnClass: 'd-none'
            },
            buttonB: {
                text: "",
                btnClass: 'd-none'
            }
        },
        onOpenBefore: function () {
            $(".jconfirm-buttons button").each(function () {
                $(this).addClass('Custom_Case');
            });
        },
    });

}

function loginKeepSigninUser(selectedUser) {
    $(".page-loader-wrapper").show();
    if (selectedUser == "Loginwithanotheruser") {
        let curHref = window.document.location.href;
        if (curHref.indexOf('?') > -1)
            curHref += "&keepmesignin=false";
        else
            curHref += "?keepmesignin=false";
        window.document.location.href = curHref;
    } else {
        $.ajax({
            url: 'Signin.aspx/loginKeepSigninUser',
            type: 'POST',
            cache: false,
            async: true,
            data: JSON.stringify({
                usrName: selectedUser, hdnBwsrid: $("#hdnBwsrid").val()
            }),
            dataType: 'json',
            contentType: "application/json",
            success: function (data) {
                if (data.d != "") {
                    var jVal = JSON.parse(data.d);
                    if (jVal != "") {
                        $j('#axSelectProj').val(jVal.axSelectProj);
                        $j('#hdnProjName').val(jVal.axSelectProj);
                        $j('#axLanguage').val(jVal.axLanguage);
                        $("#hdnProjLang").val(jVal.axLanguage);
                        $j("#axUserName").val(jVal.axUserName);
                        $("#hdnPuser").val(jVal.KeepMeAutoPwd);
                        $j("#hdnLastOpenpage").val(jVal.hdnLastOpenpage);
                        $("#signedin").prop("checked", jVal.signedin);
                        $("#hdnbtforLogin").val(bst);
                        if (jVal.ssotype == "")
                            $j("#btnSubmit").click();
                        else if (jVal.ssotype == "windows")
                            $j("#WindowsBtn").click();
                        else if (jVal.ssotype == "saml")
                            $j("#SamlBtn").click();
                        else if (jVal.ssotype == "ga")
                            $j("#GoogleBtn").click();
                        else if (jVal.ssotype == "fb")
                            $j("#FacebookBtn").click();
                        else if (jVal.ssotype == "of365")
                            $j("#Office365Btn").click();
                        else if (jVal.ssotype == "ot")
                            $j("#OktaBtn").click();
                    }
                    else
                        showAlertDialog("error", callParentNew('lcm')[518]);
                }
                else {
                    showAlertDialog("error", callParentNew('lcm')[518]);
                }
            }, error: function (error) {
                showAlertDialog("error", callParentNew('lcm')[518]);
            }
        });
    }
}



function KeepSigninWebDetails() {
    $.ajax({
        url: 'Signin.aspx/KeepSigninWebDetailsNew',
        type: 'POST',
        cache: false,
        async: true,
        data: JSON.stringify({
            hdnBwsrid: $("#hdnBwsrid").val()
        }),
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            if (data.d != "") {
                var jVal = JSON.parse(data.d);
                if (jVal != "" && typeof jVal.userlist == "undefined") {
                    $j('#axSelectProj').val(jVal.axSelectProj);
                    $j('#hdnProjName').val(jVal.axSelectProj);
                    $j('#axLanguage').val(jVal.axLanguage);
                    $("#hdnProjLang").val(jVal.axLanguage);
                    $j("#axUserName").val(jVal.axUserName);
                    $("#hdnPuser").val(jVal.KeepMeAutoPwd);
                    $j("#hdnLastOpenpage").val(jVal.hdnLastOpenpage);
                    $("#signedin").prop("checked", jVal.signedin);
                    $("#hdnbtforLogin").val(bst);
                    if (jVal.ssotype == "")
                        $j("#btnSubmit").click();
                    else if (jVal.ssotype == "windows")
                        $j("#WindowsBtn").click();
                    else if (jVal.ssotype == "saml")
                        $j("#SamlBtn").click();
                    else if (jVal.ssotype == "ga")
                        $j("#GoogleBtn").click();
                    else if (jVal.ssotype == "fb")
                        $j("#FacebookBtn").click();
                    else if (jVal.ssotype == "of365")
                        $j("#Office365Btn").click();
                    else if (jVal.ssotype == "ot")
                        $j("#OktaBtn").click();
                }
                else if (jVal != "" && typeof jVal.userlist != "undefined") {
                    KeepMeSigninConfirm(jVal.userlist);
                }
            }
        }, error: function (error) {
        }
    });
}

function GetBrowserUId() {
    // Initialize the agent at application startup.
    const fpPromise = import('../ThirdParty/fingerprintjs/FingerprintJS.min.js')
        .then(FingerprintJS => FingerprintJS.load())

    // Get the visitor identifier when you need it.
    fpPromise
        .then(fp => fp.get())
        .then(result => {
            // This is the visitor identifier:
            const visitorId = result.visitorId
            var brName = "";
            if (jQBrowser.chrome) {
                brName = "chrome";
            } else if (jQBrowser.safari) {
                brName = "safari";
            } else if (jQBrowser.opera) {
                brName = "opera";
            } else if (jQBrowser.mozilla) {
                brName = "mozilla";
            }
            else if (jQBrowser.msie) {
                brName = "msie";
            }
            else if (jQBrowser.msedge) {
                brName = "msedge";
            }
            $("#hdnBwsrid").val(visitorId + "-" + brName);
            if (typeof KeepMeAutoLoginWeb != "undefined" && KeepMeAutoLoginWeb == "true") {
                KeepSigninWebDetails();
            }
        });
}

/*New code */
function chkLoginFormHiden() {
    $("#btnSubmit").click();
}
function chkLoginFormNew() {
    GetCurrentTime('Login');
    if ($j('#axLanguage').val() != null || $j('#axLanguage').val() != undefined)
        language = $j('#axLanguage').val().toLowerCase();
    $("#hdnProjLang").val(language);
    if ($j('#axLanguage').is(':visible') && !ValidateLanguage()) { return false; }
    var valLang = $j('#axLanguage').is(':visible') && !$j('#axLanguage').val();
    if (valLang) {
        showAlertDialog("error", 1009, "client");
        $j("#axLanguage").focus();
        errField = 'axLanguage';
        return false;
    } else if (!usercheckNew()) {
        return false;
    }
    else {
        if (CheckIsulmtUser()) {
            if (!CheckIsDuplicateUser())
                return false;
        } else {
            try {
                let _clLocale = Intl.DateTimeFormat().resolvedOptions().locale;
                let _clTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
                let _cldt = (new Date()).toLocaleString().replace(",", "");
                let _clDetails = _clLocale + "*" + _clTimezone + "^" + $("#hdnProjLang").val() + "*" + _cldt;
                $("#hdnClientDt").val(_clDetails);
            } catch (ex) { }
            GetProcessTime();
            $("#browserElapsTime").val(browserElapsTime);
            return true;
        }
    }
}

function usercheckNew() {
    if ($j("#axPassword").val() == "") {
        showAlertDialog("error", 1011, "client");
        $j("#axPassword").focus();
        errField = 'axPassword';
        return false;
    }
    else {
        if (typeof $j("#axPassword").val() != "undefined")
            $("#hdnPuser").val($j("#axPassword").val());
        return true;
    }
}

function chkNextForm() {
    let proj = $j('#axSelectProj').val();
    $("#hdnProjName").val(proj);
    if ($j('#axSelectProj').is(':visible') && !ValidateProject()) { return false; }
    var valProj = $j('#axSelectProj').is(':visible') && !$j('#axSelectProj').val() || $j('#axSelectProj').val().toLowerCase() == "select project";
    if (valProj) {
        showAlertDialog("error", 1008, "client");
        $j("#axSelectProj").focus();
        errField = 'axSelectProj';
        return false;
    }
    else if (!usercheck($j("#axUserName").val())) {
        return false;
    }
    else if (valProj == false) {
        try {
            return axAfterInstanceName();
        } catch (ex) {
            if (CheckIsulmtUser()) {
                if (!CheckIsDuplicateUser())
                    return false;
            } else {
                GetProcessTime();
                $("#browserElapsTime").val(browserElapsTime);
                return true;
            }
        }
    }
    else {
        if (CheckIsulmtUser()) {
            if (!CheckIsDuplicateUser())
                return false;
        } else {
            GetProcessTime();
            $("#browserElapsTime").val(browserElapsTime);
            return true;
        }
    }
}

function OpenForgotPwdNew() {
    var valProj = $j('#hdnProjName').val();
    if (valProj == "") {
        showAlertDialog("error", 1008, "client");
        $j("#axSelectProj").focus();
        errField = 'axSelectProj';
        return false;
    }
    else if (valProj == false && $j('#hdnProjName').val() == "") {
        try {
            return axAfterInstanceName();
        } catch (ex) {
            return false;
        }
    }
    var hdnproj = $j('#hdnProjName').val();
    if (hdnproj != "")
        window.document.location.href = "ForgotPassword.aspx?proj=" + hdnproj + "";
}

function backToMainDiv() {
    window.document.location.href = window.document.location.href;
}