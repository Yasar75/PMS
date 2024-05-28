//Note: Don't remove the variable leftMenuWrapper since that variable we are using as hook for cross frame origin when app is running in cloud

var MainNewEdit = false,
    isTstructPopup = false,
    traceSplitChar = "♦",
    traceSplitStr = "♦♦",
    expImpPopUp, IsFormDirty = false,
    leftMenuWrapper = "",
    isLeftMenuExists = "",
    leftMenuvText = "",
    isDashBoardClicked = false,
    currentTheme, fw_Menu_Unhover, fw_Menu_HoverDynamic,
    isPrintPDFClick = false,
    isSaveAndPrintClick = false,
    isSavePrintValues = [],
    isSuccessAlertInPopUp = false,
    isRefreshParentOnClose = false,
    isHomePageLoaded = false,
    ivCmdRefresh = "",
    mainSQLhintObj = {},
    AxUserPagesInfo = {},
    IsfieldaddInDesignMode = false,
    notifyJsonOldobj = "";
var colorArray = ['#999966', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
    '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
    '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
    '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
    '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
    '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'
];
var appLinkHistory = [], appLinkHistoryLabel = [], menuLabel;
var curPageIndex = 0, prevClickFlag = false, nextClickFlag = false, histListFlag = false;
var isTstructSplited = false;
var tstructCustomHTML = "";
var middle1URL = "";
var isMobile = isMobileDevice();
var tstAxpFileFlds = false;
var browserElapsTime = 0;
var isHybridAddressBarVisible = true;
var isBackClicked = false;

if (typeof (Storage) !== "undefined") {
    try {
        let appSessUrl = top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/"));
        
        if (hybridGUID) {
            localStorage["hybridGUID-" + appSessUrl] = hybridGUID;            
        } else if (localStorage["hybridGUID-" + appSessUrl]) {          
            hybridGUID = localStorage["hybridGUID-" + appSessUrl];            
        }

        if (hybridDeviceId) {
            localStorage["hybridDeviceId-" + appSessUrl] = hybridDeviceId;
        } else if (localStorage["hybridDeviceId-" + appSessUrl]) {
            hybridDeviceId = localStorage["hybridDeviceId-" + appSessUrl];
        }


    } catch (ex) {}    
    
    /** 
     * @description To check :
     * 1) The protocal of the site => "http:" or "https:".
     * 2) Address bar is visible or not in webview (hybrid).
     * @param {Boolean} isHybridAddressBarVisible
     */
    if (hybridGUID) {        
        try {
            let isHttps = window.location.protocol == 'https:';
            var fileUrl = `${window.location.origin}/.well-known/assetlinks.json`;
            if (isHttps && UrlExists(fileUrl)) {
                isHybridAddressBarVisible = false ;
            }
        } catch (error) {}    
    }
}

if(typeof axpProjectCaption!="undefined" && axpProjectCaption!=""){
    axUserOptions.axAppName.appName=axpProjectCaption;
}
var appGlobalVarsObject = {};
appGlobalVarsObject = new appGlobalObj();
/**
 * @description : Generate data to be reused here in this object and access it as global variable throughout application with hook as axSetOrChangeGlobalObjHook
 * @author Prashik
 * @date 2019-08-28
 * @class appGlobalObj
 */
function appGlobalObj() {
    //this.lcm = callParentNew("lcm");
    _this_ = this;
    this.lcm = lcm;
    this._CONSTANTS = new globalConstants();
    this.splitRatio = "1:1:auto",
    this.methods = {
        toggleCompressModeUI: function (element) {

            if(_this_._CONSTANTS.window == window){
                if((_thisdiv = $($.axpertUI.search.options?.staging?.div).parents(".header")) && _thisdiv.length > 0){
                    if(_this_._CONSTANTS.compressedMode){
                        _thisdiv.addClass("h-60px");
                    }else{
                        _thisdiv.removeClass("h-60px");
                    }
                }

                if((_thisdiv = $($.axpertUI.options.axpertUserSettings.staging.AxAppLogo.web.divParent)) && _thisdiv.length > 0){
                    if(_this_._CONSTANTS.compressedMode){
                        _thisdiv.removeClass("pt-9 pb-5").addClass("pt-6 pb-2");
                    }else{
                        _thisdiv.addClass("pt-9 pb-5").removeClass("pt-6 pb-2");
                    }
                }

                // if((_thisdiv = $($.axpertUI.options.navigation.backButton.div).parent()) && _thisdiv.length > 0 && _thisdiv.hasClass("content")){
                //     if(_this_._CONSTANTS.compressedMode){
                //         _thisdiv.removeClass("pt-7 px-7").addClass("pt-6 px-6");
                //     }else{
                //         _thisdiv.addClass("pt-7 px-7").removeClass("pt-6 px-6");
                //     }
                // }
            }

            if (_this_._CONSTANTS.compressedMode) {
                element.addClass("compressedModeUI");
                if (element.find('iframe').length > 0) {
                    $(element.find('iframe')).each(function (index, el) {
                        _this_.methods.toggleCompressModeUI($(el.contentDocument.body));
                    });

                }
            }
            else {
                element.removeClass("compressedModeUI");
                if (element.find('iframe').length > 0) {
                    $(element.find('iframe')).each(function (index, el) {
                        _this_.methods.toggleCompressModeUI($(el.contentDocument.body));
                    });
                }

            }
        }
    }
    // try {
    //     this = ((tempThis = axSetOrChangeGlobalObjHook(this)) && !$.isEmptyObject(tempThis) && tempThis || this)
    // } catch (ex) {}
}

/**
* @description : Generate constants to be reused and access it as global variable throughout application
* @author Prashik
* @date 2019-08-28
* @class globalConstants
*/
function globalConstants() {
    this.window = window;
    this.MALICIOUSNPUTDETECTED = "Invalid input detected, Please try again.";
    //this.compressedMode = compressedMode;
    this.isHybrid = hybridGUID && hybridGUID != "" ? true : false;
    this.isHybridAddressBarVisible = isHybridAddressBarVisible;
    this.bundles = {
        reportCss,
        reportJs
    };
    this.compressedMode = compressedMode;//getCompressedMode();
    this.showMenu = showMenu;
    this.menuConfiguration = {
        menuJson,
        alignment: "vertical",//just for info or any future usecase
        staging: {
            div: "#mainnav-menu",
            divParent: ".main-sidebar"
        }
    }
    this.cardsPage = {
        setCards: false,
        cards: []
    }
    this.colors = {
        get light(){
            return "#ffffff";
        },
        get white(){
            return this.light;
        },
        get dark(){
            return rgbToHex(getCssByAttr("class", "text-gray-900", "color"));
        },
        get black(){
            return this.dark;
        }
    }
    this.search = {
        staging: {
            div: "#globalSearchinp",
            divparent: ".search-bar"
        }
    }
    this.history = {
        staging: {
            div: ".histList",
            divParent: ""
        }
    }
    this.axpertUserSettings = {
        axUserOptions
    }
    this.navigation = {
        backButton: {
            div: ".appBackBtn"
        }
    }
}

function getCompressedMode() {
    var appUrl = top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/"));
    try{
        if (window.localStorage.getItem("compressedMode-" + appUrl) != null && window.localStorage.getItem("compressedMode-" + appUrl) != undefined) {
            return JSON.parse(window.localStorage.getItem("compressedMode-" + appUrl));
        }
    }
    catch{}
    return compressedMode;
}



function CheckIsUserLogged() {
    doPageUnload = "false";
    $("body").addClass("resetLoginBdy");
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
                    window.localStorage.removeItem("axpertLocalsession");
                    $("#btnResubmit").click();
                }
            },
            buttonB: {
                text: eval(callParent('lcm[280]')),
                btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                action: function () {
                    window.location.href = "./Signin.aspx";
                    disableBackDrop('destroy');
                }
            }
        },
        close: function () {
            ShowDimmer(true);
        },
        onOpenBefore: function () {
            $(".jconfirm-buttons button").each(function () {
                $(this).addClass('Custom_Case');
            });
        },
    });
}

function ToggleTrace(status) {

    var imgTrace = $("#imgTogTrace");
    var imgAlt = imgTrace[0].parentElement.childNodes[1].checked;
    var lnkTrc = $("#lnkTrace");

    if (!imgAlt) {
        imgTrace.attr("class", "switch slider round");
        imgTrace.attr("title", lcm[466]);
        lnkTrc.prop("disabled", true);
        status = "false";
    } else {
        status = "true";
        imgTrace.attr("class", "switch slider round");

        imgTrace.attr("title", lcm[465]);
        lnkTrc.prop("disabled", false);
    }
    try {
        ASB.WebService.UpdateTraceStatus(status, SuccessToggleTrace);
    } catch (exp) { }
}

function ToggleShowLog(status) {
    var imgTrace = $("#imgTogTrace");
    var imgAlt = imgTrace.parent().find("input").is(":checked");
    if (!imgAlt) {
        imgTrace.attr("title", lcm[466]);
        status = "false";
    } else {
        status = "true";
        imgTrace.attr("title", lcm[465]);
    }
    try {
        ASB.WebService.UpdateTraceStatus(status, SuccessToggleTrace);
    } catch (exp) { }
}

function SuccessToggleTrace(result, eventArgs) {
    if (result != "done")
        showAlertDialog("error", result);
}


function ClearCache() {
    try {
        ASB.WebService.ClearCache(SuccessCacheCallback);
    } catch (exp) { }
}

function SuccessCacheCallback(result, eventArgs) {
    showAlertDialog("success", result);
}

function signout(path) {
    if (typeof axOktaSessionInit != "undefined" && typeof axOktaLogOut != "undefined") {
        try {
            axOktaLogOut();
        } catch (ex) { }
    }
    var glType = gllangType;
    var isRTL = false;
    if (glType == "ar")
        isRTL = true;
    else
        isRTL = false;
    var msg = lcm[155];
    var signoutCB = $.confirm({
        theme: 'modern',
        title: msg,
        onContentReady: function () {
            disableBackDrop('bind');
        },
        backgroundDismiss: 'false',
        rtl: isRTL,
        escapeKey: 'buttonaB',
        content: lcm[27],
        buttons: {
            buttonA: {
                text: lcm[164],
                btnClass: 'btn btn-primary',
                action: function () {
                    signoutCB.close();
                    window.location.href = path;
                }
            },
            buttonaB: {
                text: lcm[192],
                btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                action: function () {
                    disableBackDrop('destroy');
                }
            }

        }
    });

}

function HideHelp() {
    var dvHelp = document.getElementById("divHelp");
    if (helpOpen) {
        helpOpen = false;
        dvHelp.style.display = "none";
    }
}

var traceWin;
function OpenLogFile() {
    var na = "../aspx/OpenLogFile.aspx";
    traceWin = displayBootstrapModalDialog("Logged File", "", "", true, na)
}

function OpenExecutionLogFile() {
    var na = "../aspx/ExecutionLogs.html";
    traceWin = displayBootstrapModalDialog("Execution Logs", 'md', '360px', true, na)
}

function ClosePopUps() {
    if (traceWin != null)
        traceWin.close();
    if (draftsWin != null && draftsWin != false)
        draftsWin.close();
    for (var k = 0; k < childWindowHandler.length; k++) {
        if (!childWindowHandler[k].closed) {
            childWindowHandler[k].close();
        }
    }
}

function ChangeTheme(themeColor) {
    if ($('#customizer').hasClass('panel-open')) {
        var theme = themeColor;
        document.getElementById("lbltheme").innerText = theme;
        var cssid = document.getElementsByTagName("link");
        for (var j = 0; j < cssid.length; j++) {

            if (cssid[j].type == 'text/css' && cssid[j].id == 'themecss') // search only css link
                cssid[j].href = "../App_Themes/" + theme + "/Stylesheet.min.css?v=23";
        }

        var targetArray = [document.getElementById("middle1"), document.getElementById("axpiframe")];
        targetArray.forEach(function (target) {
            var childcssid = target.contentWindow.document.getElementsByTagName("link");

            for (var j = 0; j < childcssid.length; j++) {
                if (childcssid[j].id == 'homeBuilderLink')
                    childcssid[j].href = "../App_Themes/" + theme + "/home_builder.min.css?v=4";
                if (childcssid[j].type == 'text/css' && childcssid[j].id == 'themecss') // search only css link
                    childcssid[j].href = "../App_Themes/" + theme + "/Stylesheet.min.css?v=23";
            }

            if (target.contentWindow.document.getElementById("frmcontent")) {
                var target1 = target.contentWindow.document.getElementById("frmcontent");
                var childcssid1 = target1.contentWindow.document.getElementsByTagName("link");

                for (var j = 0; j < childcssid1.length; j++) {

                    if (childcssid1[j].type == 'text/css' && childcssid1[j].id == 'themecss') // search only css link
                        childcssid1[j].href = "../App_Themes/" + theme + "/Stylesheet.min.css?v=23";
                }
            }
        });
    }
}

function ChangeToPresentTheme() {
    var theme = currentThemeColor;
    document.getElementById("lbltheme").innerText = theme;
    var cssid = document.getElementsByTagName("link");
    for (var j = 0; j < cssid.length; j++) {

        if (cssid[j].type == 'text/css' && cssid[j].id == 'themecss') // search only css link
            cssid[j].href = "../App_Themes/" + theme + "/Stylesheet.min.css?v=23";
    }

    var targetArray = [document.getElementById("middle1"), document.getElementById("axpiframe")];
    targetArray.forEach(function (target) {
        var childcssid = target.contentWindow.document.getElementsByTagName("link");

        for (var j = 0; j < childcssid.length; j++) {
            if (childcssid[j].id == 'homeBuilderLink')
                childcssid[j].href = "../App_Themes/" + theme + "/home_builder.min.css?v=4";
            if (childcssid[j].type == 'text/css' && childcssid[j].id == 'themecss') // search only css link
                childcssid[j].href = "../App_Themes/" + theme + "/Stylesheet.min.css?v=23";
        }

        if (target.contentWindow.document.getElementById("frmcontent")) {
            var target1 = target.contentWindow.document.getElementById("frmcontent");
            var childcssid1 = target1.contentWindow.document.getElementsByTagName("link");

            for (var j = 0; j < childcssid1.length; j++) {

                if (childcssid1[j].type == 'text/css' && childcssid1[j].id == 'themecss') // search only css link
                    childcssid1[j].href = "../App_Themes/" + theme + "/Stylesheet.min.css?v=23";
            }
        }
    });
}




function applyTheme(themeColor) {
    var txt = "";
    var trace = traceSplitStr + "GetChoicestoUpdateAppearance" + traceSplitChar;
    try {
        if (CheckSuccCallBackValidate())
            return;
        ASB.WebService.UpdateTheme(themeColor, trace, SucceededCallback);
        currentThemeColor = themeColor;

        var isFirefox = typeof InstallTrigger !== 'undefined'; //to get browser type
        if (!isFirefox && $('#customizer', window.parent.document).hasClass('panel-open')) {
            $('#customizer', window.parent.document).removeClass('panel-open');
        }

        var isIE = false || !!document.documentMode;
        var isChrome = !!window.chrome && !!window.chrome.webstore;
        if (isIE || isChrome)
            $('#themeIcon').focus();
        handleTabIndex();
        //location.reload();
    } catch (exp) {

    }
}

function SucceededCallback(result, eventArgs) {
    if (result == "") {
        return false;
    } else {
        var obj = JSON.stringify(result);
        if (obj.error) {
            ExecErrorMsg(obj.error);
        }
    }
}

///////////////////////////////// Print docs related functions/////////////////////////

///Function to display the print docs from the session along with their status
function DisplayPrintDocs() {
    try {
        ASB.WebService.GetPrintDocsHtml(SuccessGetPrintDocs);
    } catch (ex) {
        var execMess = ex.name + "^♠^" + ex.message;
        showAlertDialog("error", 2030, "client", execMess);
    }
}

var printDialogObj;
var prDialogStatus = "closed";
//Success Function called after DisplayPrintDocs.
function SuccessGetPrintDocs(result, eventArgs) {
    if (CheckSessionTimeout(result))
        return;
    if (result == "")
        result = "<label>" + lcm[28] + "</label>";
    else {
        var strResult = result.split('♣');
        var lnkPrint = $("#ankPrint");
        lnkPrint.text(strResult[0]);
        result = strResult[1];
    }
    $("#dvPrintDocs").html(result);
    prDialogStatus = "opened";
    printDialogObj = $("#dvPrintDocs").dialog({ title: "Print Docs", height: 300, width: 600, position: 'center', modal: true, close: function (event, ui) { prDialogStatus = "closed" } });
}

var printRowId;

function RemoveDoc(rowId, fileName) {
    printRowId = rowId;
    try {
        ASB.WebService.RemoveDoc(fileName, SuccessRemoveDoc);
    } catch (ex) {
        var execMess = ex.name + "^♠^" + ex.message;
        showAlertDialog("error", 2030, "client", execMess);
    }
}

function SuccessRemoveDoc(result, eventArgs) {
    if (CheckSessionTimeout(result))
        return;
    $("#" + printRowId).remove();
    SetPrintStatus(result);
}

//Function to open a file which is attached newly. 
function OpenDoc(fileName) {
    if (fileName != "") {
        var na = "./openfile.aspx?fpath=" + fileName;
        var left = (screen.width / 2) - (500 / 2);
        var top = (screen.height / 2) - (400 / 2);
        window.open(na, "SaveWindow", "width=500,height=400,scrollbars=yes,resizable=yes,top=" + top + ",left=" + left + "");
    }
}

var timer;

function RefreshPrintDocs() {
    try {
        ASB.WebService.RefreshPrintCount(SuccessPrintCount);
    } catch (ex) {
        var execMess = ex.name + "^♠^" + ex.message;
        showAlertDialog("error", 2030, "client", execMess);
    }
}

function SuccessPrintCount(result, eventArgs) {
    if (result != "") {
        SetPrintStatus(result);
        if (prInterval != "-1")
            timer = self.setInterval("UpdatePrintDocStatus()", parseInt(prInterval, 10));
    }
    DisplayPrintDocs();
}

function UpdatePrintDocStatus() {

    try {
        ASB.WebService.UpdateDocStatus(SuccessDocStatus);
    } catch (ex) {
        var execMess = ex.name + "^♠^" + ex.message;
        showAlertDialog("error", 2030, "client", execMess);
    }
}

function SuccessDocStatus(result, eventArgs) {
    if (CheckSessionTimeout(result))
        return;
    var strResult = result.substring(result.indexOf("(") + 1, result.indexOf(")"));
    var arrResult = strResult.split("-");
    if (arrResult.length > 1) {
        if (arrResult[0] == arrResult[1]) {
            timer = window.clearInterval(timer);
        }
    }
    SetPrintStatus(result);
    if (prDialogStatus == "opened")
        DisplayPrintDocs();
}

function SetPrintStatus(result) {
    var lnkPrint = $("#ankPrint");
    lnkPrint.text(result);
}

var SESSTIMEOUT = "SESSION_TIMEOUT";
var SESSMSG = "sess.aspx?msg=Your session is expired. Please login again.";

function CheckSessionTimeout(result) {

    if (result == SESSTIMEOUT) {
        if (window.opener && !window.opener.closed) {
            window.close();
            window.opener.location.reload();
        } else {
            try {
                document.location.href = SESSMSG;
            } catch (ex) {
                parent.parent.location.href = SESSMSG;
            }
        }
        return true;
    } else if (result == "Duplicate_session") {
        CheckSuccCallBackValidate();
        return true;
    } else if (result == appGlobalVarsObject._MALICIOUSNPUTDETECTED) {
        showAlertDialog("error", appGlobalVarsObject.lcm["449"]);
        AxWaitCursor(false);
        ShowDimmer(false);
        return true;
    }
    return false;
}


function ChangeDir(dir) {
    $("#form1").attr("dir", dir);
}

function ClearSession(e) {

    if (globalChange) {

        if (!confirm(lcm[29])) {
            if (e)
                e.preventDefault();
            else
                return false;
        } else {
            globalChange = false;
        }
    }

    dataRowIndex = -1;
    clickedColumn = "";
    isParentIview = false;
    tstructPop = false;
    listViewPage = "0";
    try {
        if (!isSessionCleared) {
            ASB.WebService.ClearNavigationSession();
            isSessionCleared = true;
        }
    } catch (ex) { }

}

function SetUnload(status) {
    doPageUnload = status;
}

//Main page on before unload- calling sgnout webservice to handle record lock
function BeforeWindowClose() {

    if (doPageUnload != "false") {
        try {
            sessionStorage.removeItem("homeJsonObj");
            sessionStorage.clear();
            var localSessionVal = parseInt(window.localStorage.getItem("axpertLocalsession"));
            //window.localStorage.setItem("axpertLocalsession", localSessionVal + 1);

            if (!localSessionVal || localSessionVal == 0) {
                var isExeSave=ExecutionTraceInterval(true);
                clearLocalStorage(['projInfo-', 'versionInfo-', 'langInfo-', 'hybridGUID-', 'hybridDeviceId-', 'compressedMode-', 'duplicateUser-', 'instanceName-'], true);
                window.localStorage.removeItem("axpertLocalsession");
                if(isExeSave)
                    ASB.WebService.SignOut();
            } else
                window.localStorage.setItem("axpertLocalsession", localSessionVal - 1);
        } catch (ex) { }
    } else
        doPageUnload = "true";
}

function createLocalSession() {

    if (window.localStorage.getItem("axpertLocalsession") == null)
        window.localStorage.setItem("axpertLocalsession", 0);
    else {
        var localSessionVal = parseInt(window.localStorage.getItem("axpertLocalsession"));
        window.localStorage.setItem("axpertLocalsession", localSessionVal + 1);
    }

}

function HideInfoDiv() {
    if ($("#dvMessage").is(':visible'))
        $("#dvMessage").hide();
}

var visibleAppSettings = 0; //total visible menu count for utilities menu
$(document).ready(function (event) {
    WireElapsTime(serverprocesstime, requestProcess_logtime);
    if (typeof axOktaSessionInit != "undefined" && typeof axOktaLogOut != "undefined") {
        try {
            axOktaSessionInit();
        } catch (ex) { }
    }
    try {
        AxBeforeMainReady();
    }
    catch (ex) {

    }

    if (axMenuReSize != undefined && axMenuReSize != "")
        AxAfterMainPageLoad();

    $('.main-sidebar').on('mouseleave', function () {
        if ($('body').hasClass('menu-hover') == true) {
            $('body').removeClass('menu-hover').addClass('sidebar-collapse');

            $(".treeview-menu").hide();
            $(".treeview.menu-open").removeClass("menu-open");
        }
    })

    try {
        // var qrcode = new QRCode("mainQRcodeWrapper", {
        //     text: `{"spath":"${encodeURI(mainRestDllPath.slice(0, -1))}","pname":"${mainProject}","notify_URI":"${encodeURI(nodeApi.substr(0, nodeApi.length - 5))}","p_url":"${encodeURI(mainPageUrl = window.location.href.toLowerCase()) && (webUrl = mainPageUrl.substr(0, mainPageUrl.indexOf("/aspx")))}"}`,
        //     width: 150,
        //     height: 150,
        //     colorDark: "#000000",
        //     colorLight: "#ffffff",
        //     correctLevel: QRCode.CorrectLevel.H
        // });
    } catch (ex) { }

    var buildModeAccessLength = PageBuilderAccess.length;
    let userRespArray = userResp.split(",");
    for (var i = 0; i < buildModeAccessLength; i++) {
        if ($.inArray(PageBuilderAccess[i], userRespArray) !== -1) {
            hasPageBuildAccess = true;
            break;
        }
    }

    // if(!enableTemplatization){
    createMenu(xmlMenuData);
    // }

    try {
        if (!enableTemplatization) {
            createAutoComplete(appGlobalVarsObject._CONSTANTS.search.staging.div);
        }
    } catch (ex) { }
    ShowDimmer(false);
    $('#middle1').on('load', function () {
        $(this).contents().find("html").on('click', function (event) {
            $("#Li1").removeClass("open");
            $("#liMulmenu").removeClass("open");
            $('.dropdown-toggle').parent().removeClass('open');
        });
        checkSuccessAxpertMsg();
    });



    //$(document).ready(function () {
    //    alert(5);

    //});
    window.onbeforeunload = BeforeWindowClose;

    //From 1
    createLocalSession();

    //from 7
    $("#homeIcon, #dashBoardIcon, #messagesIcon").on("click", function () {
        $(".wrapperForLeftMenuIcons span").removeClass("active");
        $(this).addClass("active");
    });
    // App.init();
    $("#sidemenu-leftt").click();
    // loadHome(true);
    $(".panelsWrapper ").css("display", "none");
    var idOfFrstElem = $(".leftPartAC .hideInClose .dropdown-menu li").first().find("a").attr("id");
    $(".leftPartAC .hideInClose .dropdown-toggle").html((($(".leftPartAC .hideInClose .dropdown-menu li").first().find("a").text())) + "&nbsp;<span class=\"icon-arrows-down\" style=\"margin:0px;position: relative;top: 4px;color:black\"></span><input type='hidden' value='" + idOfFrstElem + "' id='moduleSelctedVal' />");
    $(".leftPartAC .hideInClose .dropdown-toggle").attr("title", ($(".leftPartAC .hideInClose .dropdown-menu li").first().find("a").text()));
    $(".leftPartAC .hideInClose .dropdown-menu li").first().addClass("active");
    $("." + ($(".leftPartAC .hideInClose .dropdown-menu li").first().find("a").attr("id"))).css("display", "block");
    var firstelem = $(".leftPartAC .dropdown-menu li").first().find("a").text();
    $(".contentToShowOnHide .vertical-text").text(firstelem);

    // Moved to node api edited by sathish 
    //if ($("#hdndashBoardIcon").val() == "t") {
    //    $("#dashBoardIcon").show();
    //}
    //else {
    //    $("#dashBoardIcon").hide();
    //}

    if (!enableTemplatization) {
        loginToNodeAPI();
    }


    if ($("#hdnmessagesIcon").val() == "t") {
        $("#messagesIcon").show();
    } else {
        $("#messagesIcon").hide();
    }

    $("#messagesIcon").click(function (event) {
        var topPos = "";
        isCloudApp == "False" ? topPos = $(this)[0].offsetTop + 80 : topPos = $(this)[0].offsetTop + 22;
        $("#showMessagesDashBoard").css({ top: topPos, left: $(this)[0].offsetLeft }).toggle();
    });
    $("#closemsgDshBrd").click(function (event) {
        $("#showMessagesDashBoard").hide();
        $("#messagesIcon").removeClass('active');
        $("#homeIcon").addClass("active");
    });
    $("#messagesIcon").click(function (event) {
        if (!($('#showMessagesDashBoard').is(':visible'))) {
            $("#homeIcon").addClass("active");
            $("#messagesIcon").removeClass('active');
        }
    });

    $("body").click(
        function (e) {
            if (e.target.className !== "glyphicon glyphicon-comment active") {
                $("#showMessagesDashBoard").hide();
            }
            //            $(document).click();
        }
    );


    //var uName = '<%= Session["user"] %>';
    //var uOwner = '<%=Session["isowner"] %>'
    if (uName.toLowerCase() == 'admin' || uOwner.toLowerCase() == 'true') {
        $("#ExportImportCogIcon .adminSettings").show();
    } else
        $("#ExportImportCogIcon .adminSettings").hide();

    checkResolution();
    if ($(".leftPartAC .dropdown-menu li").length == 0) {
        $(".closeSidePanel").click();
        $("#leftMenuToggleBtn").hide();
        $("#leftVerticalText p").text(lcm[32]);
    }
    if (isCloudApp == "True") {
        $(".impExpHis").css({ 'right': '21px', 'top': '12px' });
        $("#dvNonCloudMenu").css("display", "none");
        $("#dvSelectedGlobalVar").css("top", "11px");

        $("#middle1").removeClass("middle1_isNotCloudApp");
        $("#middle1").addClass("middle1_isCloudApp");
        $(".leftPartAC").removeClass("middle1_isNotCloudApp");
        $(".leftPartAC").addClass("middle1_isCloudApp");
        $(".rightPartAC").removeClass("middle1_isNotCloudApp");
        $(".rightPartAC").addClass("middle1_isCloudApp");

        $(".ACmainwrapper").css("margin-top", "0px");
        $("#wrapperForMainNewData").css("top", "52px");
    } else {
        $(".impExpHis").css({ 'right': '29px', 'top': '68px' });
        $("#dvNonCloudMenu").css("display", "block");
        $("#dvSelectedGlobalVar").css("top", "73px");
        $("#dvSelectedGlobalVar").addClass("appGlobalParams")
        $("#middle1").removeClass("middle1_isCloudApp");
        $("#middle1").addClass("middle1_isNotCloudApp");
        $(".leftPartAC").removeClass("middle1_isCloudApp");
        $(".leftPartAC").addClass("middle1_isNotCloudApp");
        $(".rightPartAC").removeClass("middle1_isCloudApp");
        $(".rightPartAC").addClass("middle1_isNotCloudApp");

        $(".ACmainwrapper").css("margin-top", "0px");
        $("#exeiddownload").hide();
        $("#li_ConfigApp").hide();
        $("li2").hide();
        $("#wrapperForMainNewData").css("top", "109px");
    }

    $(".hidden767px .dropdown-menu .dropdown-submenu").first().find('a:first').remove();
    //Function call for newsfeed nd events
    //GetNewsfeed();
    //GetEventReminders();
    if ($("#draftsMessage").val() != "") {
        $("#draftmessagedv").css('display', 'block');
    }
    $(".tooltip").fadeOut(10000);
    if (gllangauge == "ARABIC") {
        $('.news_title').css("float", "right");
        $('.insructions_title').css("float", "right");
        $('.morquee').css("float", "right").css("width:80%");
        $('.news_title').prepend('<div class="trr"></div>');
        $('.insructions_title').prepend('<div class="tlr"></div>');
    } else {
        $('.news_title').prepend('<div class="tr"></div>');
        $('.insructions_title').prepend('<div class="tl"></div>');
        //Configuration Settings for Admin
        if (uName.toLowerCase() == 'admin') {
            $('#li_ConfigApp').css("display", "block");
            $("li2").show();
        }
    }

    $(".mainParentElements").click(function (e) {
        e.preventDefault();

        $(this).children(".child").toggle(500);
        $(".mainParent").css("border-bottom", "1px solid grey");
        $(this).find(".ar").toggleClass("arrowDown");
        $(this).find(".ar").toggleClass("arrow");

    });
    $("#leftVerticalText p").click(function () {
        $("#leftMenuToggleBtn").is(':visible') ? $("#leftMenuToggleBtn").click() : "";
    });
    if ($("#newMenuWrapper").length == 0) {
        //oldMenu
        //makeSearchCenter();
    } else {
        //newMenu
        if (!enableTemplatization) {
            createAutoComplete(appGlobalVarsObject._CONSTANTS.search.staging.div);
        }
    }
    focusTheParent(appGlobalVarsObject._CONSTANTS.search.staging.div, ".search-form");
    checkSuccessAxpertMsg();

    // from 2

    // if(!enableTemplatization){
    xmlMenuData = "";
    // }


    $("#hamburgerMenuIcon button").click(function () {
        $(this).parent().toggleClass("is-active");
        var container = $("#hamburgerMenuIcon");
        if (container.hasClass('fromResizeClose')) {
            container.removeClass('fromResizeClose');
            if (container.hasClass('menuOpened'))
                closeNav();
            else {
                $("#menuContentWrapper").hide();
                if ($(".hirarchy.clickable").length !== 0)
                    changeHirarchy('home');
                assignMenuKeyDownEvents("unbind");

            }
            return;
        }

        var windowWidth = $(window).outerWidth();
        if (windowWidth <= 767) {

            var menuContentWrapper = $("#mobileSidenav")
            if (menuContentWrapper.hasClass('firstClick')) {
                menuContentWrapper.removeClass('firstClick');
                var html = createMobileMenu(menuJson.root.parent, true);
                menuContentWrapper.html(html);
                openNav();
            } else {
                if ($("#hamburgerMenuIcon").hasClass('menuOpened'))
                    closeNav();
                else
                    openNav();
            }
        } else {
            var menuContentWrapper = $("#menuContentWrapper")
            menuContentWrapper.toggle();
            if (menuContentWrapper.hasClass('firstClick')) {
                menuContentWrapper.removeClass('firstClick');
                initializeMenu(menuJson.root.parent, true);
            } else {
                if (!menuContentWrapper.is(':visible')) {
                    //if ($(".hirarchy.clickable").length !== 0)
                    //    changeHirarchy('home');
                    assignMenuKeyDownEvents("unbind");
                } else
                    assignMenuKeyDownEvents("bind");
            }
        }
        // 
    });
    $("#mobileSearchBtn").click(function () {
        var elem = $(this);

        elem.find(".glyphicon").toggleClass('icon-basic-magnifier icon-arrows-remove');
        $("#newMenuSearch").toggleClass("customFocus").toggle();

    });


    // from 3

    var isIE = false || !!document.documentMode;
    if (isIE) {
        // to replace url which ends with '#' in the URL, otherwise once the page is loaded all hyperlinks(with href="javascript:void(0)") will be clicked automatically
        $(window).on('beforeunload', function () {
            window.location.replace("#");
            // slice off the remaining '#' in HTML5:    
            if (typeof window.history.replaceState == 'function') {
                history.replaceState({}, '', window.location.href.slice(0, -1));
            }
        });
    }

    //from 6

    // App.init();
    $("#sidemenu-leftt").click();
    //loadHome(true);

    // from 5

    //Function call for newsfeed nd events
    //GetNewsfeed();
    // GetEventReminders();
    $('.themeEvent').on('click mouseover mouseout focus blur keypress', function (event) {
        var isFirefox = typeof InstallTrigger !== 'undefined'; //to get browser type
        if (isFirefox && event.keyCode == 27) {
            handleTabIndex();
            $('#customizer').focus();

            return;
        }

        var eventType = event.type;
        var themeColor = event.currentTarget.className.replace(' themeEvent', '');

        if (eventType == 'mouseover' || eventType == 'focus') {
            if ($('#customizer').hasClass('panel-open'))
                // ChangeTheme(themeColor);
                if (eventType == 'focus') {
                    if ($('#customizer').hasClass('panel-open')) {
                        jQuery(document).bind("keydown.themePopupKD", function (event) {
                            //var elemntsToCheck = 'button[tabindex!="-1"],a[tabindex!="-1"],input[tabindex!="-1"],select[tabindex!="-1"],textarea[tabindex!="-1"]';
                            if (!event.shiftKey && event.keyCode == 9) {
                                if ($(document.activeElement)[0].className == $('.color-scheme li a').last()[0].className) {
                                    event.preventDefault()
                                    $('#' + $('.color-scheme li a').first()[0].id).focus();
                                }
                            } else if (event.shiftKey && event.keyCode == 9) {
                                if ($(document.activeElement)[0].className == $('.color-scheme li a').first()[0].className) {
                                    event.preventDefault()
                                    $('#' + $('.color-scheme li a').last()[0].id).focus();
                                }
                            }


                        })
                    } else
                        jQuery(document).unbind("keydown.themePopupKD");
                }
        } else if (eventType == 'mouseout' || eventType == 'blur') {
            //to display theme selector in IE
            var isIE = false || !!document.documentMode;
            if (isIE && event.keyCode == 13) {
                applyTheme(themeColor);
                setTimeout(function () {
                    $('#customizer').toggleClass('panel-open').focus();
                }, 150)
            }

            // ChangeToPresentTheme();
            if (eventType == 'blur')
                jQuery(document).unbind("keydown.themePopupKD");
        } else if (eventType == 'click' || eventType == 'keypress') {
            var isIE = false || !!document.documentMode;

            if (isIE) {
                if (eventType == "click" || event.keyCode == 13)
                    applyTheme(themeColor);
                if (event.keyCode == 27) {
                    // ChangeToPresentTheme();
                }
            } else if (isFirefox) {
                if (eventType == "click") {
                    applyTheme(themeColor);
                    setTimeout(function () {
                        $('#themeIcon').focus();
                        $('#customizer').toggleClass('panel-open');
                        handleTabIndex();
                    }, 50)
                } else if (event.keyCode == 13) {
                    setTimeout(function () {
                        applyTheme(themeColor);
                        $('#themeIcon').focus();
                        $('#customizer').toggleClass('panel-open');
                        handleTabIndex();
                    }, 150)
                }
            } else
                applyTheme(themeColor);
        }
    });
    $(document).on('click', '#themeIcon', function (event) {
        handleTabIndex();
        $('#customizer').focus();
    });
    var isIE = false || !!document.documentMode;
    $('#homeBuilderBtn').keydown(function (e) {
        if (isIE && e.keyCode == 13) {
            LoadIframe('HomeBuilder.aspx');
        }
    });
    $('#homeIcon').keydown(function (e) {
        if (isIE && e.keyCode == 13) {
            resetLeftMenu();
        }
    });
    $('#dashBoardIcon').keydown(function (e) {
        if (isIE && e.keyCode == 13) {
            ToogleLeftMenu('dashboardPanel', 'true', 'Dashboard', '');
        }
    });
    //to display theme selector in IE
    $('#themeIcon').keydown(function (e) {
        if (isIE && e.keyCode == 13) {
            $('#customizer').toggleClass('panel-open');
            handleTabIndex();
            if ($('#customizer').hasClass('panel-open')) {
                $('#customizer').focus();
            }
        }
    });

    // var theme = eval(callParent('currentThemeColor'));
    // $("#themecss").attr('href', "../App_Themes/" + theme + "/Stylesheet.min.css?v=23");
    if ($("#draftsMessage").val() != "") {
        $("#draftmessagedv").css('display', 'block');
    }
    $(".tooltip").fadeOut(10000);
    if (gllangauge == "ARABIC") {
        $('.news_title').css("float", "right");
        $('.insructions_title').css("float", "right");
        $('.morquee').css("float", "right").css("width:80%");


        $('.news_title').prepend('<div class="trr"></div>');
        $('.insructions_title').prepend('<div class="tlr"></div>');


    } else {
        $('.news_title').prepend('<div class="tr"></div>');
        $('.insructions_title').prepend('<div class="tl"></div>');
        //Configuration Settings for Admin
        if (uName.toLowerCase() == 'admin') {
            $('#li_ConfigApp').css("display", "block");
        }
    }

    if ($j(appGlobalVarsObject._CONSTANTS.search.staging.div).length) $j(appGlobalVarsObject._CONSTANTS.search.staging.div).focus();




    $("#appSettingsDropDown li").each(function () {
        if ($(this).css("display") != "none")
            visibleAppSettings++;
    })
    //hide utilities menu if user don't have access to any menu (Responsibilities, Import data, Export data, Import history, In-memory DB, Config app, Widget builder)
    if (visibleAppSettings > 0)
        $("#ExportImportCogIcon").show(); //show utilities menu option if user has access 
    else
        $("#ExportImportCogIcon").hide();

    //if(typeof PeriodicRCKey!="undefined" && PeriodicRCKey!="true")
    //PeriodicRefreshCache(); As per discussion with Unni & malakonda we are removing this feature and it will be handle in respective binaries.


    //$(".fa-list").click(function(){
    //    if($(".sidebar").hasClass("collapseMenu")){
    //        $(".sidebar").removeClass("collapseMenu");
    //    }
    //    else{
    //        $(".sidebar").addClass("collapseMenu");
    //    }
    //});


    $('.linkPrev').click(function () {
        prevbtn_click($(this));
    });
    $('.linkNext').click(function () {
        nextbtn_click($(this));
    });
    $(".axpSettings").click(function (e) {
        if (!$(e.target).hasClass("qrcoderel") && $("#qrCode").data("bs.popover")) {
            // createMobileQRcode("destroy");
        }
        if ($("#customizer").hasClass("panel-open")) {
            $("#customizer").removeClass("panel-open");
        }
    });
    $("#menuCollapse").click(function (e) {
        if ($("body").hasClass("sidebar-collapse")) {
            $("#menuCollapse").attr("title", "Collapse Menu");
            $('.sidebar').css('border-bottom', '1px solid #a7a5a5');
        }
        else {
            $("#menuCollapse").attr("title", "Expand Menu");
            $('.sidebar').css('border-bottom', 'none');
        }

        if ($('.mobile-search-inner').hasClass('slideup')) {
            $('.mobile-search-inner').removeClass('slideup').addClass('slidedown').slideDown();
        }
        if ($("body").hasClass("sidebar-collapse")) {
            AxAfterMainPageLoad();
            $("#menuCollapse").attr("title", "Collapse Menu");
        }
        else {
            AxAfterMainPageLoad("remove");
            $("#menuCollapse").attr("title", "Expand Menu");
            $('.treeview-menu').css('display', 'none');
        }
    });
    $('.treeview').click(function () {
        $('this').css('display', 'block');
    });
    $('.menuList').click(function () {
        var mLabel = $(this).find('span:first').text();
        if (mLabel) {
            menuLabel = mLabel.trim().toLowerCase();
        } else {
            menuLabel = "";
        }
    });
    $('.search-icon-chain').attr("title", "Starts With Keyword");

    $('.search-icon-chain').click(function () {

        if ($('.search-icon-chain').hasClass('icon-arrows-compress')) {
            $('.search-icon-chain').removeClass('icon-arrows-compress').addClass('icon-arrows-expand');
            $(this).attr("title", "Containing Keyword");
            GlobalSrchCondition = "StartsWith";

        }
        else {
            $('.search-icon-chain').removeClass('icon-arrows-expand').addClass('icon-arrows-compress');
            $(this).attr("title", "Starts With Keyword");
            GlobalSrchCondition = "Contains";
        }
        var srchText = $(appGlobalVarsObject._CONSTANTS.search.staging.div).val();
        if (srchText != "" && srchText.length > 1) {
            $(appGlobalVarsObject._CONSTANTS.search.staging.div).focus().autocomplete("search", srchText);
        }
    });

    try {

        AxAfterMainReady();
    }
    catch (ex) {

    }


    //ppn-AssignGloSrchScroll();

    if(typeof localStorUser!="undefined" && localStorUser=="true")
    {
        let appSessUrl = top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/"));
        //localStorage.setItem("unlmtUsername-" + appSessUrl, mainProject + "-" + mainUserName);
        localStorage.setItem("unlmtUsername-" + appSessUrl, mainProject);
    }
    $(appGlobalVarsObject._CONSTANTS.search.staging.div).attr('placeholder', lcm[397]);

    ExecTraceInterval();
});

function ExecTraceInterval()
{
    var execTraceInterval =5 * 60000;// parseInt(executionTraceTimeInt) * 60000;
    setInterval(ExecutionTraceInterval, execTraceInterval);
}

function AxAfterMainPageLoad(mCollapse) {
    if (mCollapse == undefined) {
        $(".content-wrapper, .main-footer").css("margin-left", axMenuReSize);
        $('.main-sidebar').css("width", axMenuReSize);
    }
    else {
        $(".content-wrapper, .main-footer").css('margin-left', '');
        $('.main-sidebar').css('width', '');
    }
}


function prevbtn_click(thisobject) {
    if (thisobject.hasClass('linkGray')) {
        return false;
    }

    appLinkHistoryLabel.pop();
    appLinkHistory.pop();
    
    // prevClickFlag = nextClickFlag = histListFlag = false;
    
    updateLinks(thisobject, 'prev');
}

function nextbtn_click(thisobject) {
    if (thisobject.hasClass('linkGray')) {
        return false;
    }

    // prevClickFlag = nextClickFlag = histListFlag = false;

    updateLinks(thisobject, 'next');
}


function ShowMore(filesrc) {
    $('#divSelectedGlo').show();
    $('#dvGloList').html('');
    var fileres = filesrc.split(',');
    for (var i = 0; i < fileres.length; i++) {
        if (fileres[i].toString() != " ") {
            var pathString = "'" + fileres[i] + "'";
            var linkpath = "<li> " + fileres[i] + "</li>";
            $('#dvGloList').append(linkpath);
        }
    }
    //$j("#lstGrdAttach").dialog({ title: "Attached Files", height: 'auto', width: 400, position: 'center', modal: true });
}

function SetFormDirty(status) {
    IsFormDirty = status;
    window.globalChange = status;
    if (typeof $("#middle1") != "undefined" && $("#middle1").attr("src").indexOf("tstruct.aspx") > -1 && tstAxpFileFlds == true) {
        tstAxpFileFlds = false;
        ASB.WebService.RemoveUnwantedAxpFiles();
    }
}

function handleTabIndex() {
    if ($('#customizer').hasClass('panel-open')) {
        $('#customizer').attr("tabindex", "0");
        var listItems = $("#options li a");
        listItems.each(function (idx, li) {
            $(li).attr("tabindex", "0");
        });
    } else {
        $('#customizer').attr("tabindex", "-1");
        var listItems = $("#options li a");
        listItems.each(function (idx, li) {
            $(li).attr("tabindex", "-1");
        });
    }
}

$(window).on("orientationchange", function () {
    var widthOfWindow = $(window).width();
    if (widthOfWindow <= 768) {
        $(".closeSidePanel").click();
    }
});

function LoadExportIframe(src) {
    if (window.globalChange) {
        if (confirm(lcm[31])) {
            SetFormDirty(false);
        } else {
            ShowDimmer(false);
            $(".closeSidePanel").click();
            return;
        }
    }

    var el = document.getElementById('middle1');
    // el.src = "";
    el.src = src;
    loadFrame();
    if (!$("#inner-page").is(":visible"))
        $("#inner-page").show();

}

function ToogleLeftMenu(wrapperId, isMenuExists, vText, frameToOpen) {
    isTstructPopup = false;
    //leftMenuWrapper = wrapperId;
    isLeftMenuExists = isMenuExists;
    leftMenuvText = vText;
    $("#leftVerticalText p").text(leftMenuvText)
    if ($("#leftMenuToggleBtn").hasClass('closeSidePanel'))
        var panelCurrentState = "opened";
    else
        var panelCurrentState = "closed";
    $(".hideInClose").hide();
    $(".leftPartAC .panelsWrapper").hide();
    if (isMenuExists == false) {
        $("#leftMenuToggleBtn").hide();
        $("#leftVerticalText p").text(vText).css("cursor", "default");
        if (panelCurrentState == "opened") {
            $("#leftMenuToggleBtn").click();
        }
        //$(".iconsContainer").css('left', '-9px');
        LoadExportIframe(frameToOpen);
    } else {
        $("#leftVerticalText p").css("cursor", "pointer");
        if (vText.toLowerCase() == "dashboard") {
            $(".closeSidePanel").click();
            isDashBoardClicked = false;
            loadFrame();
            splitfull();
            hideSplitButtons()
            document.getElementById('middle1').src = "../aspx/dashboard.aspx";
        }
        //$(".iconsContainer").css('left', '0px');
        $("#leftMenuToggleBtn").show();
        $("#" + wrapperId).show();
        $("#" + wrapperId + " .transactionsPanel ul.listUl li").first().find('a').click();
    }
}


//function to reset left menu
function resetLeftMenu(isDashBoard) {
    if (uName.toLowerCase() == 'admin' || uOwner.toLowerCase() == 'true') {
        $("#ExportImportCogIcon .adminSettings").show();
    } else
        $("#ExportImportCogIcon .adminSettings").hide();
    //$(".iconsContainer").css('left', '0px');
    $("#leftVerticalText p").css("cursor", "pointer");
    $(".panelsWrapper ").css("display", "none");

    if (leftMenuWrapper != "") {
        $("#leftVerticalText p").text(leftMenuvText);
        $("#" + leftMenuWrapper).hide();
    }

    if (window.globalChange) {
        if (confirm(lcm[31])) {
            SetFormDirty(false);
        } else {
            return;
        }
    } else if ($("#middle1")[0].contentWindow.designChanged != undefined && $("#middle1")[0].contentWindow.designChanged == true) {
        //isFunctionCalled = true;

        if (!confirm(lcm[31]))
            return;
    }

    if ($(".leftPartAC .dropdown-menu li").length == 0) {
        $(".closeSidePanel").click();
        $("#leftMenuToggleBtn").hide();
        $("#leftVerticalText p").text(lcm[32]);
    } else {
        var idOfFrstElem = $(".leftPartAC .hideInClose .dropdown-menu li.active").first().find("a").attr("id");
        $(".leftPartAC .hideInClose .dropdown-toggle").html((($(".leftPartAC .hideInClose .dropdown-menu li.active").first().find("a").text())) + "&nbsp;<span class=\"icon-arrows-down\" style=\"margin:0px;position: relative;top: 4px;\"></span><input type='hidden' value='" + idOfFrstElem + "' id='moduleSelctedVal' />");
        //$(".leftPartAC .hideInClose .dropdown-menu li").first().addClass("active");
        $(".contentToShowOnHide .vertical-text").html(($("#" + idOfFrstElem).text()));
        if ($("#leftMenuToggleBtn").hasClass('closeSidePanel'))
            $("." + ($(".leftPartAC .hideInClose .dropdown-menu li.active").first().find("a").attr("id"))).css("display", "block");
        $(".leftPartACHeader .dropdown").show();
        $("#leftMenuToggleBtn").show();
    }
    if ($("#leftMenuToggleBtn").hasClass('closeSidePanel'))
        $(".dropdown.hideInClose").show();
    else
        $(".dropdown.hideInClose").hide();

    leftMenuWrapper = "";
    isLeftMenuExists = "";
    leftMenuvText = "";

    gimportIsOpen = false;
    isDashBoardClicked = false;
    isTstructPopup = false;
    if (isDashBoard != "fromDashboard") {
        loadFrame();
        splitfull()
        hideSplitButtons();
        document.getElementById('middle1').src = $("#hdHomeUrl").val();
    }
}

function menuSellecter(idd) {
    //alert($("#"+idd).text());
    $(".leftPartAC .hideInClose .dropdown-toggle").html(($("#" + idd).text()) + "&nbsp;<span class=\"icon-arrows-down\" style=\"margin:0px;position: relative;top: 4px;color:black\"></span><input type='hidden' value='" + idd + "' id='moduleSelctedVal' />");
    $(".leftPartAC .hideInClose .dropdown-toggle").attr("title", $("#" + idd).text());
    $(".contentToShowOnHide .vertical-text").html(($("#" + idd).text()));
    $(".panelsWrapper ").css("display", "none");
    $("." + idd).css("display", "block");
    $(".leftPartAC .hideInClose .dropdown-menu li").removeClass("active");
    $(".leftPartAC .hideInClose .dropdown-menu #" + idd).parent().addClass("active");
}

function LoadIframe(src,isautoprocess=false) {
    try {
        if(!isBackClicked){
            var appUrl = top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/"));
            localStorage.removeItem("drilldownScrollInfo-" + appUrl);
        }else{
            isBackClicked = false;
        }
    } catch (ex) {}

    if($("#hdKeepMeDefaultUrl").val()!="")
    {
        src=$("#hdKeepMeDefaultUrl").val();
        isautoprocess=false;
        $("#hdKeepMeDefaultUrl").val('');
    }
    if(!isautoprocess){
        var pageProcessName;
        if(src.toLowerCase().indexOf("tstruct.aspx")>-1){
            pageProcessName="Tstruct load on menu click(post back)";
            GetCurrentTime(pageProcessName);
        }
        else if(src.toLowerCase().indexOf("iview.aspx")>-1){
            pageProcessName="Iview load on menu click(post back)";
            GetCurrentTime(pageProcessName);
        }
        else{
            pageProcessName="Page load";
            if(src == "loadhomepage" && (!$.axpertUI || !$.axpertUI.cardsPage || !$.axpertUI.cardsPage.options.setCards)){
                GetCurrentTime(pageProcessName);
            }
        }
    }    
    if (src == "loadhomepage") {
        if ($.axpertUI && $.axpertUI.cardsPage && $.axpertUI.cardsPage.options.setCards) {            
            $.axpertUI.cardsPage.activate(src);
            resetMainPageUI();
            return false;
        } else if($("#hdHomeUrl").val()) {
            src = $("#hdHomeUrl").val();
        } else {
            $("#middle1").attr("src", $("#hdHomeUrl").val());
            return false;
        }
        
    } else if ($.axpertUI && $.axpertUI.cardsPage) {
        $.axpertUI.cardsPage._showCardsFrame(false);
    }

    resetMainPageUI();
    //temp code start
    // $(".content .container-fluid .block-header").remove();

    // $(".content .container-fluid .card:not(.col-lg-12.col-md-12.col-sm-12.col-xs-12)").replaceWith(`
    //     <div class="splitter-wrapper">
    //         <div class="panel-container main-panel-container">
    //             <div class="panel-left panel-fisrt-part">
    //                 <div class="panel-left-inner">
    //                     <iframe id="middle1" name="middle1" class="card col-xs-12 col-sm-12 col-md-12 col-lg-12 searchOpened" src="" style="padding: 0px;" frameborder="0" scrolling="no" allowtransparency="True" width="100%">
    //                     </iframe>
    //                 </div>
    //             </div>
    //             <div class="splitter panel-splitter" id="drag-point" style="display: none;">
    //             </div>
    //             <div class="panel-right panel-second-part" id="divaxpiframe" style="display: none !important">
    //                 <div class="panel-right-inner">
    //                     <iframe id="axpiframe" name="axpiframe" class="card col-xs-12 col-sm-12 col-md-12 col-lg-12 searchOpened" src="" style="padding: 0px;" frameborder="0" scrolling="no" allowtransparency="True" width="100%" style="display: none;">
    //                     </iframe>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // `);

    //temp code end

    splitfull();
    isTstructSplited = false;
    var hideSRC = src.toLowerCase()
    if (appDiableSplit === "true" || hideSRC === "pagedesigner.aspx" || hideSRC === "responsibilities.aspx" || hideSRC === "workflownew.aspx" || hideSRC.indexOf("paramststruct.aspx") != -1)
        hideSplitButtons();
    else
        unhideSplitButtons();
    //untill interactive report phase-2 came need to add below code - ManiKanta

    try {
        AxOnLoadIframe()
    }
    catch (ex) { }
    if (src.indexOf("iviewInteractive") !== 1)
        src = src.replace("iviewInteractive", "iview");

    var btnContainer = $('#hamburgerMenuIcon');
    if (btnContainer.hasClass('is-active')) {

        btnContainer.find('button').click();
    }
    if (window.globalChange) {

        if (confirm(lcm[31])) {
            SetFormDirty(false);
        } else {
            return;
        }
    } else if ($("#middle1")[0].contentWindow.designChanged != undefined && $("#middle1")[0].contentWindow.designChanged == true) {


        if (!confirm(lcm[31]))
            return;
    }
    $("#dvSelectedGlobalVar").show();

    var el = "";
    let el2 = "";

    try {
        el2 = AxOnLoadMiddleIframe(src);
        if (el2 != undefined || el2 != "") {
            // el2.src = "";
            el2.src = '../../aspx/' + src;
        }

    }
    catch (ex) { }
    if (el2 === undefined || el2 === "") {

        el = document.getElementById('middle1');
        // el.src = "";
        GetProcessTime();
        if(src.indexOf('?')!=-1)
            el.src = src+"&hdnbElapsTime="+browserElapsTime;
        else
            el.src = src+"?hdnbElapsTime="+browserElapsTime;
    }




    if (src.indexOf('ivname') > -1) {
        loadFrame();
    }
    if (src.indexOf('tstruct.aspx') > -1) {
        loadFrame();
    }

    if (!$("#inner-page").is(":visible"))
        $("#inner-page").show();

    if (!$("#inner-page").is(":visible"))
        $("#inner-page").show();

    checkResolution();
    isTstructPopup = false;
    return false;
}

    function LoadIframeOnline(src) {
        //untill interactive report phase-2 came need to add below code - ManiKanta
        if (src.indexOf("iviewInteractive") !== 1)
            src = src.replace("iviewInteractive", "iview");

        var btnContainer = $('#hamburgerMenuIcon');
        if (btnContainer.hasClass('is-active')) {

            btnContainer.find('button').click();
        }
        if (window.globalChange) {

            if (confirm(lcm[31])) {
                SetFormDirty(false);
            } else {
                return;
            }
        } else if ($("#axpiframe")[0].contentWindow.designChanged != undefined && $("#axpiframe")[0].contentWindow.designChanged == true) {


            if (!confirm(lcm[31]))
                return;
        }
        $("#dvSelectedGlobalVar").show();
        var el = document.getElementById('axpiframe');
        $(".impExpHis").css({ 'right': '29px', 'top': '68px' });
        $("#dvNonCloudMenu").css("display", "block");
        $("#dvSelectedGlobalVar").css("top", "73px");
        $("#dvSelectedGlobalVar").addClass("appGlobalParams")
        $("#axpiframe").removeClass("middle1_isCloudApp");
        $("#axpiframe").addClass("middle1_isNotCloudApp");
        $(".leftPartAC").removeClass("middle1_isCloudApp");
        $(".leftPartAC").addClass("middle1_isNotCloudApp");
        $(".rightPartAC").removeClass("middle1_isCloudApp");
        $(".rightPartAC").addClass("middle1_isNotCloudApp");

        $(".ACmainwrapper").css("margin-top", "0px");
        $("#exeiddownload").hide();
        $("#li_ConfigApp").hide();
        $("li2").hide();
        $("#wrapperForMainNewData").css("top", "109px");
        el.style.display = "";
        // el.src = "";

        el.src = src;
        if (src.indexOf('ivname') > -1) {
            loadFrameOnline();
        }
        if (src.indexOf('tstruct.aspx') > -1) {
            loadFrameOnline();
        }

        if (!$("#inner-page").is(":visible"))
            $("#inner-page").show();

        if (!$("#inner-page").is(":visible"))
            $("#inner-page").show();

        checkResolution();
        isTstructPopup = false;
    }


    function loadHome(onLoad) {
        //if (isMobileDevice())
        //    $('#mobileMenuWrapper').html('');
        //new tab open
        var url = window.location.href.split(".aspx#");
        var firstChar = url[1] ? url[1].charAt(0) : "";
        if (onLoad && url.length > 1 && url[1] != "" && (firstChar === "t" || firstChar === "i" || firstChar === "p" || firstChar === "u")) {
            if (firstChar === "u") {
                try {
                    var storage = url[1].split('=')[1];
                    //local storage for new tab pageload is not used since it is loading duplicate pages when multiple new tabs are opened simultaneously.
                    if (storage == "local") {
                        if (typeof (Storage) !== "undefined") {
                            var loadUrl = localStorage["PageToLoad_" + mainProject];
                            if (loadUrl.indexOf("♠") > -1)
                                localStorage["PageToLoad_" + mainProject] = loadUrl.substring(loadUrl.indexOf("♠") + 1);
                            else
                                localStorage["PageToLoad_" + mainProject] = "";
                            loadUrl = loadUrl.split("♠")[0];
                            if (loadUrl != undefined && loadUrl != "")
                                LoadIframe(loadUrl);
                        }
                    } else if (storage == "sess") {
                        GetNewTabPageSess({
                            key: "PageToLoad",
                            cb: function (data) {
                                if (data.d != undefined) {
                                    var loadUrl = data.d;
                                    if (loadUrl != undefined && loadUrl != "")
                                        LoadIframe(loadUrl);
                                }
                            }
                        });
                    }
                } catch (ex) {
                    console.warn("Error in PageToLoad GetNewTabPageSess call : " + ex.message);
                }
            } else {
                var transId = url[1].substr(1);
                if (firstChar === "t") {
                    LoadIframe("tstruct.aspx?transid=" + transId + `&openerIV=${trsnsId}&isIV=false`);
                } else if (firstChar === "i") {
                    LoadIframe("iview.aspx?ivname=" + transId);
                } else if (firstChar === "p") {
                    LoadIframe("page.aspx?axpage_id=" + transId);
                }
            }
        } else {
            if (navigatePage == "") {
                $("#inner-page").hide();
            }
            else if(navigatePage.indexOf('ParamsTstruct.aspx') != -1 ){
                // displayBootstrapModalDialog('Application Params', 'lg', 'calc(100vh - 50px)', true,navigatePage,false,removePageHeaders)
                bootstrapDialogAppParamsShow();
            }
            else {
                $("#inner-page").show();
                $('.leftPartAC').css("display", "block");
                $('#dvSelectedGlobalVar').css("display", "inline-block");
                $("#rightDiv").addClass("rightPartAC");
                splitfull()
                hideSplitButtons();
                $("#middle1").attr("src", navigatePage);
                if (navigatePage == "../Portal/portal.aspx") {
                    loadFrame();
                }
            }
        }
    }
    var AxHelpIview;

    function ShowCustomHelp() {
        LoadIframe("iview.aspx?ivname=" + AxHelpIview);
    }
    var ivname;

    function loadFrame() {
        if (typeof $('#middle1')[0].contentWindow.ShowDimmer != "undefined") { $('#middle1')[0].contentWindow.ShowDimmer(false) };
        // $.LoadingOverlay("show", { "fixedBackgroundSize": "135px", "zIndex": 99999999 });
        $("body").addClass($.axpertUI.options.loader.parent.substr(1));
    }

    function loadFrameOnline() {
        if (typeof $('#axpiframe')[0].contentWindow.ShowDimmer != "undefined") { $('#axpiframe')[0].contentWindow.ShowDimmer(false) };
        $.LoadingOverlay("show", { "fixedBackgroundSize": "135px", "zIndex": 99999999 });
    }

    function closeFrame() {
        // $.LoadingOverlay("hide", true);
        $("body").removeClass($.axpertUI.options.loader.parent.substr(1));
    }

    function loadConfigPage(src) {

        LoadIframe(src);

    }


    var cm = null;
    document.onclick = new Function("show(null)")

    function getPos(el, sProp) {
        var iPos = 0
        while (el != null) {
            iPos += el["offset" + sProp]
            el = el.offsetParent
        }
        return iPos

    }

    function show(el, m) {
        $(".menu").parent().removeClass("selectedMenuMN")
        $(el).parent().addClass("selectedMenuMN");
        if (m) {
            m.style.display = '';
            m.style.pixelLeft = getPos(el, "Left")
            m.style.pixelTop = getPos(el, "Top") + el.offsetHeight
        }
        if ((m != cm) && (cm)) cm.style.display = 'none'
        cm = m
    }

    $(".visible767px").click(function (e) {
        e.stopPropagation();
    });

    function searchLoadIframe(type, src, getUrl = false) {
        var loadurl = "";
        var srcDtls = src.split('*♠*');
        if (type.toLowerCase() == "iview" || type.toLowerCase() == "iviewinteractive") {
            if (srcDtls[1] == "null" || !srcDtls[1])
                loadurl = 'iview.aspx?ivname=' + srcDtls[0];
            else {
                var qstr = GetGloSrchQueryString(srcDtls[1]);
                loadurl = 'ivtoivload.aspx?ivname=' + srcDtls[0] + qstr;
            }
        } else if (type.toLowerCase() == "tstruct") {
            if (srcDtls[1] == "null")
                loadurl = 'tstruct.aspx?transid=' + srcDtls[0] + `&openerIV=${srcDtls[0]}&isIV=false`;
            else {
                var qstr = GetGloSrchQueryString(srcDtls[1]);
                loadurl = 'tstruct.aspx?transid=' + srcDtls[0] + `&openerIV=${srcDtls[0]}&isIV=false` + qstr;
            }
        } else if (type.toLowerCase() == "page") {
            loadurl = 'page.aspx?axpage_id=' + srcDtls[0];
        } else if (type.toLowerCase() == "htmlpages") {
            loadurl = 'htmlPages.aspx?load=' + srcDtls[0];
        }        
        else if (type.toLowerCase() == "help") {
            ShowDimmer(false);
            if (srcDtls[1] != null && srcDtls[1] != undefined && srcDtls[1].split('~').length > 1){
                loadurl = 'help.aspx?' + srcDtls[1].split('~')[1];
            }    
        }

        if(getUrl){
            return loadurl;
        }

        if (loadurl != "") {
            if(loadurl.startsWith("help.aspx")){
                window.open(loadurl, '_blank');
            }
            else {
                resetLeftMenu('fromDashboard');
                LoadIframe(loadurl);
            }
        }

        return loadurl;
    }

    //paramStr will be in the format of ~p1=v1~p2=v2
    function GetGloSrchQueryString(srcDtls) {
        var splitChar = "~";
        var paramStr = srcDtls.split(splitChar);
        var qStr = "";
        if (paramStr.length > 1) {
            for (var i = 0; i < paramStr.length; i++) {
                if (paramStr[i] != "") {
                    var srcParams = paramStr[i].split("=");
                    qStr += "&" + srcParams[0] + "=" + CheckUrlSplChars(srcParams[1]);
                }
            }
        }

        return qStr;
    }

    function CheckUrlSplChars(value) {
        if (value == null) return;
        value = value.replace(/&amp;/g, "&");
        //value = value.replace(/%/g, "%25");
        //value = value.replace(/&/g, "%26");
        //value = value.replace(/'/g, "%27");
        //value = value.replace(/"/g, "%22");
        //value = value.replace(/#/g, "%23");
        //value = value.replace(/-/g, "%2D");
        //value = value.replace("/","%2F");
        //value = value.replace(/:/g, "%3A");
        //value = value.replace(/;/g, "%3B");
        //value = value.replace(/</g, "%3C");
        ////value = value.replace(/</g, "&lt;");
        //value = value.replace(/=/g, "%3D");
        //value = value.replace(/>/g, "%3E");
        //value = value.replace(/+/g, "%2B");

        //
        value = encodeURIComponent(value);
        return value;
    }

    //Function to validate '&' and other special characters
    function CheckSpCharsForXml(str) {
        var str = str;
        str = str.replace(/&/g, "&amp;");
        str = str.replace(/</g, "&lt;");
        str = str.replace(/>/g, "&gt;");
        str = str.replace(/'/g, "&apos;");
        str = str.replace(/"/g, '&quot;');
        //str = str.replace(/`/g, "&lsquo;")
        return str;
    }

    $(".visible767px").click(function (e) {
        e.stopPropagation();
    });

    function ShowHideSearchDimmer(action) {
        try {
            if (action == "show") {
                $("#gloSrchSpin").removeClass("hide").addClass("show fa-spin");
                $("#gloCondIcon").addClass("hide");
                $(appGlobalVarsObject._CONSTANTS.search.staging.divparent).find(".search-icon").addClass("pulser");
            }
            else {
                $("#gloSrchSpin").removeClass("show fa-spin").addClass("hide");
                $("#gloCondIcon").removeClass("hide");
                $(appGlobalVarsObject._CONSTANTS.search.staging.divparent).find(".search-icon").removeClass("pulser");
            }
        } catch (ex) { }
    }

    /*function makeSearchCenter() {
        //if($("#dvSelectedGlobalVar"))
        var widthOfRightPart = parseInt($("#rightDiv").css('width').replace("px", ""));
        var searchWidth = widthOfRightPart / 2; //here we can change the width of the search
        var topOfRightPart = $("#rightDiv")[0].offsetTop;
        var leftOfRightPart = $("#rightDiv")[0].offsetLeft;
        var leftOfSearch = ((widthOfRightPart / 2) - (searchWidth / 2));
        $("#wrapperForSearch .search-form").addClass('col-md-6 col-md-offset-3 col-lg-6 col-lg-offset-3 col-sm-8 col-sm-offset-2 col-xs-8 col-xs-offset-1');
        var searchHtml = $("#wrapperForSearch").html();
        $("#wrapperForSearch").remove();
        $("#rightDiv").prepend('<div id="wrapperForSearch">' + searchHtml + '<i title="Close" class="closeGLSearch icon-arrows-remove" onkeypress="handleKeyPress(event)" onclick="toggleGlobalSearch(\'close\')" tabindex="0"></i><div class="clearfix"></div></div>');
        if (!enableTemplatization) {
            createAutoComplete("#globalSearchinp");
        }
    }*/

    var gloSrchLimit = 1000;
    var gloSrchPageNo = 0;
    function createAutoComplete(autoComStage) {
        $(autoComStage).autocomplete({
            minLength: 2,
            autoFocus: true,
            source: function (request, response) {
                var txtInput = request.term.toLowerCase().trim();
                if (txtInput != "") {
                    var gbSearch = [];
                    var srchResult = "";
                    ShowHideSearchDimmer("show");
                    $.ajax({
                        url: 'mainnew.aspx/getGlobalSearchData',
                        type: 'POST',
                        cache: false,
                        async: true,
                        data: JSON.stringify({ keyword: txtInput, cond: GlobalSrchCondition }),
                        dataType: 'json',
                        contentType: "application/json",
                        success: function (data) {

                            //$(autoComStage).parent().removeClass("gopened");
                            gloSrchPageNo = 0;
                            if (data.d.indexOf("*♦*") != -1) {
                                var srchData = data.d.split("*♦*");
                                gloSrchLimit = srchData[0];
                                console.log("GlobalSearch RowCount-" + srchData[0]);
                                if (srchData.length > 1)
                                    srchResult = srchData[1];
                            }
                            else
                                srchResult = data.d;
                            if (srchResult == "Session Expired")
                                window.location = "../aspx/sess.aspx";


                            if (srchResult != "getting exception in code" && srchResult != "")
                                tblSearchData = $.parseJSON(srchResult);
                            else {
                                // var result = [{ label: lcm[0], value: response.term, link: "" }];
                                // response(result);
                                // ShowHideSearchDimmer("hide");
                                // return;
                            }

                            gbSearch = GetGLoSrchItems(tblSearchData);

                            if (gbSearch.length != 0) {
                                response($.map(gbSearch.slice(0, 100), function (item) {
                                    var itemDts = item.split('♣');
                                    return {
                                        label: itemDts[0],
                                        value: itemDts[0],
                                        link: itemDts[1]
                                    }
                                }))
                            } else {
                                // var result = [{ label: lcm[0], value: response.term, link: "" }];
                                // response(result);
                            }
                            // ShowHideSearchDimmer("hide");
                        },
                        error: function (xhr, ajaxOptions, thrownError) {
                            // ShowHideSearchDimmer("hide");
                            // console.log("Status" + xhr.status + "-Error-" + thrownError);
                        }
                    });
                }
            },
            focus: function (event, ui) {
                // window.pageIndex=0;
                event.preventDefault();
            },
            open: function (event, ui) {
                var dialog = $(this).closest('.ui-dialog');
                if (dialog.length > 0) {
                    $('.ui-autocomplete.ui-front').zIndex(dialog.zIndex() + 1);
                }
            },
            select: function (event, ui) {
                if (event.keyCode != 9) {
                    if (ui.item.label == lcm[0]) {
                        $(this).val('');
                        return false;
                    }
                    var searchType = ui.item.link.split('♦')[0];
                    searchLoadIframe(searchType, ui.item.link.split('♦')[1]);
                    if (searchType == "help") {
                        $(this).val('');
                        return false;
                    }
                    $(autoComStage).blur();
                    $("#GSclearBtn").hide();
                } else {
                    //$(this).val('');
                    return false;
                }
            },
            search: function (event, ui) {

            }
        }).data("ui-autocomplete")._renderItem = function (ul, item) {
            ul.addClass("cutsomautocomplete");
            var inner_html = '';
            var type = item.link.split('♦')[0];

            inner_html = GetSearchLiItem(type, item.label);

            return $("<li></li>")
                .data("ui-autocomplete-item", item)
                .append(inner_html)
                .appendTo(ul);
        };
    }

    function GetSearchLiItem(type, itemText) {
        var inner_html = "";
        var toolTip = itemText;
        if (itemText.length > 100)
            itemText = itemText.substr(0, 100) + "...";

        itemText = CheckSpCharsForXml(itemText);
        type = type.toLowerCase();
        //if (type == "iview" || type == "iviewinteractive") {
        //    inner_html = '<div title="' + toolTip + '"><span class="icon-iviewMenuBgIcn menuBgIcon"></span><span class="ellipsis gblSearch">' + itemText + '</span></div>';
        //} else if (type == "tstruct") {
        //    inner_html = '<div title="' + toolTip + '"><span class="icon-tstructMenuBgIcn menuBgIcon"></span><span class="ellipsis gblSearch">' + itemText + '</span></div>';
        //} else if (type == "page") {
        //    inner_html = '<div title="' + toolTip + '"><span class="icon-pageMenuBgIcn menuBgIcon"></span><span class="ellipsis gblSearch">' + itemText + '</span></div>';
        //} else if (type.toLowerCase() == "help") {
        //    inner_html = '<div title="' + toolTip + '"><span class="icon-helpMenuBgIcn menuBgIcon"></span><span class="ellipsis gblSearch">' + itemText + '</span></div>';
        //}
        //else {
        //    inner_html = '<div title="' + toolTip + '">' + itemText + '</div>';
        //}

        if (type == "iview" || type == "iviewinteractive") {
            inner_html = '<div title="' + toolTip + '"><i class="material-icons">view_list</i><span class="ellipsis gblSearch">' + itemText + '</span></div>';
        } else if (type == "tstruct") {
            inner_html = '<div title="' + toolTip + '"><i class="material-icons">assignment</i><span class="ellipsis gblSearch">' + itemText + '</span></div>';
        } else if (type == "page" || type == "htmlpages") {
            inner_html = '<div title="' + toolTip + '"><i class="material-icons">insert_drive_file</i><span class="ellipsis gblSearch">' + itemText + '</span></div>';
        } else if (type.toLowerCase() == "help") {
            inner_html = '<div title="' + toolTip + '"><i class="material-icons">live_help</i><span class="ellipsis gblSearch">' + itemText + '</span></div>';
        }
        else {
            inner_html = '<div title="' + toolTip + '">' + itemText + '</div>';
        }

        return inner_html;
    }

    function AssignGloSrchScroll() {
        try {
            $.extend($.ui.autocomplete.prototype, {

                _renderMenu: function (ul, items) {
                    //remove scroll event to prevent attaching multiple scroll events to one container element
                    $(ul).unbind("scroll");
                    var self = this;
                    self._scrollMenu(ul, items);
                },

                _scrollMenu: function (ul, items) {
                    var self = this;
                    var maxShow = 100;
                    var results = [];
                    var pages = Math.ceil(gloSrchLimit / maxShow);
                    results = items;

                    $(ul).scroll(function () {
                        if (isScrollbarBottom($(ul))) {
                            ++gloSrchPageNo;
                            if (gloSrchPageNo >= pages) return;
                            var pgSearchData = [];
                            var pSrchResult = "";
                            ShowHideSearchDimmer("show");
                            $.ajax({
                                type: "POST",
                                url: "Mainnew.aspx/GetMoreSearchData",
                                data: JSON.stringify({ pageIndex: gloSrchPageNo, pageSize: maxShow }),
                                contentType: "application/json; charset=utf-8",
                                async: true,
                                dataType: "json",
                                success: function (data) {
                                    var pageRCnt = 0;
                                    var res = data.d;
                                    if (data.d.indexOf("*♦*") != -1) {
                                        var srchData = data.d.split("*♦*");
                                        pageRCnt = srchData[0];
                                        console.log("GlobalSearch onscroll pageno = " + gloSrchPageNo + ", pgRowCnt=" + pageRCnt);
                                        if (srchData.length > 1)
                                            pSrchResult = srchData[1];
                                    }
                                    else
                                        pSrchResult = data.d;

                                    if (pSrchResult != "getting exception in code" && pSrchResult != "")
                                        tblSearchData = $.parseJSON(pSrchResult);
                                    else {
                                        var result = [{ label: lcm[0], value: response.term, link: "" }];
                                        response(result);
                                        ShowHideSearchDimmer("hide");
                                        return;
                                    }
                                    pgSearchData = GetGLoSrchItems(tblSearchData);

                                    if (pgSearchData.length == 0) {
                                        // do nothing
                                    }
                                    else {

                                        //append item to ul
                                        $.each(pgSearchData, function (index, item) {
                                            var itemDtls = item.split('♣');
                                            item = {
                                                label: itemDtls[0],
                                                value: itemDtls[0],
                                                link: itemDtls[1]
                                            }
                                            ul.addClass("cutsomautocomplete");
                                            var inner_html = '';
                                            var type = item.link.split('♦')[0];

                                            inner_html = GetSearchLiItem(type, item.label);
                                            return $("<li></li>")
                                                .data("ui-autocomplete-item", item)
                                                .append(inner_html)
                                                .appendTo(ul);

                                        });

                                        self.menu.refresh();
                                        //// size and position menu
                                        ul.show();
                                        self._resizeMenu();
                                        ul.position($.extend({
                                            of: self.element
                                        }, self.options.position));
                                        if (self.options.autoFocus) {
                                            self.menu.next(new $.Event("mouseover"));
                                        }
                                    }
                                    ShowHideSearchDimmer("hide");
                                },
                                error: function (xhr, ajaxOptions, thrownError) {
                                    ShowHideSearchDimmer("hide");
                                    console.log("Status" + xhr.status + "-Error-" + thrownError);
                                }
                            });
                        }
                    });

                    $.each(results, function (index, item) {
                        self._renderItem(ul, item);
                    });
                }

            });
        }
        catch (ex) {
            console.log("Exception in AssignGloSrchScroll" + ex.message);
        }
    }

    function GetGLoSrchItems(tblSearchData) {
        var gbSearch = [];
        var splitChar = "~";
        try {
            appGlobalVarsObject._CONSTANTS.search.listviewLoadSearch = JSON.parse(listviewLoadFromSearch.value);
        } catch (ex) {
        }
        $(tblSearchData.Table).each(function (iIndex, sElement) {
            // if (sElement.SEARCHTEXT != null && sElement.SEARCHTEXT.toLowerCase().indexOf(txtInput) >= 0) {
            if (getCaseInSensitiveJsonProperty(sElement, "SEARCHTEXT") != null) {
                var newParams = "";
                if (getCaseInSensitiveJsonProperty(sElement, "PARAMS")[0] != null && getCaseInSensitiveJsonProperty(sElement, "PARAMS")[0].indexOf(splitChar) > -1) {
                    //Params will come as ~p1=v1~p2=v2
                    var paramStr = getCaseInSensitiveJsonProperty(sElement, "PARAMS")[0].split(splitChar);
                    for (var i = 0; i < paramStr.length; i++) {
                        if (paramStr[i].toString() != "") {
                            var pStr = paramStr[i].toString().split("=");
                            if (pStr.length == 1) {
                                pStr[1] = pStr[0];
                                pStr[0] = "link";
                            }
                            newParams += splitChar + pStr[0] + "=" + CheckSpCharsForXml(pStr[1]);
                        }
                    }

                }
                gbSearch.push(getCaseInSensitiveJsonProperty(sElement, "SEARCHTEXT") + "♣" + getCaseInSensitiveJsonProperty(sElement, "HLTYPE") + "♦" + getCaseInSensitiveJsonProperty(sElement, "STRUCTNAME") + "*♠*" + newParams);
            }
        });
        return gbSearch;
    }

    function isScrollbarBottom(container) {
        var height = container.outerHeight();
        var scrollHeight = container[0].scrollHeight;
        var scrollTop = container.scrollTop();
        if (scrollTop >= scrollHeight - height) {
            return true;
        }
        return false;
    };

    /*function handleKeyPress(e) {
        var key = e.keyCode || e.which;
        if (key == 13) {
            toggleGlobalSearch('close');
        }
    }*/

    /*function toggleGlobalSearch(task) {
        if (task == 'open') {
            $("#middle1").addClass('searchOpened');
            if (isCloudApp == "True")
                $("#wrapperForMainNewData").animate({ top: "52px" }, 600);
            else
                $("#wrapperForMainNewData").animate({ top: "109px" }, 600);
            $("#wrapperForSearch").show('slow');
            setTimeout(function () {
                $("#showGLSearch").hide();
    
            }, 500);
    
        } else if (task == 'close') {
    
            if (isCloudApp == "True")
                $("#wrapperForMainNewData").animate({ top: "11px" }, 200);
            else
                $("#wrapperForMainNewData").animate({ top: "63px" }, 200);
            $("#wrapperForSearch").hide('fast');
            setTimeout(function () {
                $('#globalSearchinp').val("");
                $("#GSclearBtn").hide();
                $("#showGLSearch").show();
                $("#middle1").removeClass('searchOpened');
            }, 200);
        }
    }*/

    /*function SearchKeyPress(e) {
        var key = e.keyCode || e.which;
        if (key == 13) {
            toggleGlobalSearch('open');
        }
    }*/

    function focusTheParent(presentFld, parentFld) {
        $(document).on('focus', presentFld, function () {
            $(presentFld).parents(parentFld).addClass('focusTheField');
        });
        $(document).on('blur', presentFld, function () {
            $(presentFld).parents(parentFld).removeClass('focusTheField');
        });

    }

    $(document).on('keydown', appGlobalVarsObject._CONSTANTS.search.staging.div, function (e) {
        if (e.keyCode == 13) {
            $(appGlobalVarsObject._CONSTANTS.search.staging.div).val() == lcm[0] ? $(appGlobalVarsObject._CONSTANTS.search.staging.div).val("") : "";

            e.preventDefault();
            e.stopPropagation();
        }
    });

    $(document).on('keydown', '#GSclearBtn', function (e) {
        if (e.keyCode == 13 || e.keyCode == 32) {
            $(appGlobalVarsObject._CONSTANTS.search.staging.div).val("");
            $("#GSclearBtn").hide();
        }
    });

    //var stopBlurEvent = false;
    function checkResolution() {
        var widthOfWindow = $(window).width();
        if (widthOfWindow <= 1050) {
            $(".closeSidePanel").click();
        }
    }

    $(document).on('click', '.closeSidePanel', function () {
        $('.closeSidePanel').removeClass('closeSidePanel glyphicon-remove icon-arrows-circle-right').addClass('openSidePanel glyphicon-menu-hamburger icon-arrows-circle-left').attr('title', 'Expand');
        $(".ACmainwrapper .leftPartAC").css({ "width": "35px" });
        $(".ACmainwrapper .rightPartAC").removeClass("minRightPart").addClass("fullRightPart");
        $(".hideInClose").hide();

        setTimeout(function () {
            $("#showMessagesDashBoard").removeClass('sideOpen').addClass('sideclose');
            if (leftMenuWrapper != "") {
                $("#leftVerticalText p").text(leftMenuvText)
            }
            $(".contentToShowOnHide").show();
            setTimeout(function () {
                try {
                    frames["middle1"].OnMenuPanelChange("open");
                } catch (exception) { }
            }, 50)
        }, 200)

    });

    $(document).on('click', '.openSidePanel', function () {
        $(".menu").addClass('open');
        $(".contentToShowOnHide").hide();
        $('.openSidePanel').removeClass('openSidePanel glyphicon-menu-hamburger icon-arrows-circle-left').addClass('closeSidePanel glyphicon-remove icon-arrows-circle-right').attr('title', 'Collapse');
        $(".ACmainwrapper .leftPartAC").css({ "width": "280px" });
        var id = $("#moduleSelctedVal").val();
        $(".ACmainwrapper .rightPartAC").removeClass("fullRightPart").addClass("minRightPart");
        setTimeout(function () {
            if (leftMenuWrapper == "") {
                $(".hideInClose").show();
                menuSellecter(id);
            } else {
                $("#" + leftMenuWrapper).show();
            }
            $("#showMessagesDashBoard").removeClass('sideclose').addClass('sideOpen');
            setTimeout(function () {
                try {
                    frames["middle1"].OnMenuPanelChange("close");
                } catch (exception) { }
            }, 50)
        }, 200)

    });

    //global search
    $(document).on('focus', appGlobalVarsObject._CONSTANTS.search.staging.div, function (e) {
        try {
            AxOnLoadIframe()
        }
        catch (ex) { }
        if ($(this).val() == "")
            $("#GSclearBtn").hide();
        else
            $("#GSclearBtn").show();
    });
    $(document).on('blur', appGlobalVarsObject._CONSTANTS.search.staging.div, function (e) {
        if ($(this).val() == "")
            $("#GSclearBtn").hide();
        else
            $("#GSclearBtn").show();
    });

    $(document).on('keyup', appGlobalVarsObject._CONSTANTS.search.staging.div, function () {
        if ($(this).val() == "")
            $("#GSclearBtn").hide();
        else
            $("#GSclearBtn").show();
    });

    $(document).on('click', '#GSclearBtn', function () {
        $(appGlobalVarsObject._CONSTANTS.search.staging.div).val("");
        $("#GSclearBtn").hide();
    });

    var tblSearchData = []
    //getSearchData();
    //function getSearchData() {
    //    $.ajax({
    //        url: 'mainnew.aspx/getGlobalSearchData',
    //        type: 'POST',
    //        cache: false,
    //        async: false,
    //        dataType: 'json',
    //        contentType: "application/json",
    //        success: function (data) {
    //            if (data.d != "getting exception in code")
    //                tblSearchData = $.parseJSON(data.d);
    //        }
    //    });
    //}

    //function [20-15] if(last 5)==throw a popup
    var timeout = 0;
    var sessTimePopup = false;
    var lastFive = 5;
    var sessTime = 0;
    var lastInterval = false;
    var lastFiveSetTime = false;
    var createFiveMinTimeOut = false;
    var serSessTime = 0;
    var lastUpdated = false;
    //all in seconds
    function SessionExpireAlert(setTime, firstCall = true) {
        var OneSecInMS = 1000,
            FiveMinInMS = 300000,
            OneMinInMS = 60000;
        if (setTime != 'lastFive') {
            if (setTime) {
                if (firstCall)
                    serSessTime = sessTime = setTime;
                else if (!firstCall)
                    sessTime = setTime;
                setTime = setTime / 1000;
                timeout = setTime || timeout;
            } else {
                timeout = timeout - 300;
            }
        }

        if (timeout <= 300) {
            //show the alert

            if (!isLatestSession()) {
                window.location = "../aspx/sess.aspx";
                return;
            }
            var chk = checkLastUpdated();
            if (!lastUpdated) {
                return;
            }

            if (setTime == 'lastFive') {
                lastFive--;
                if (lastFive == 1) {
                    var seconds = 60;
                    lastInterval = setInterval(function () {
                        seconds--;
                        $("#seconds").text(seconds + " Seconds");
                        if (seconds == 0) {
                            chk = checkLastUpdated(true);
                            if (!lastUpdated) {
                                clearInterval(lastInterval);
                                return;
                            }
                            clearInterval(lastInterval);
                            window.location = "../aspx/sess.aspx";
                        }
                    }, OneSecInMS);
                } else {
                    $("#seconds").text(lastFive + " Mins");
                    if (lastFiveSetTime) {
                        clearTimeout(lastFiveSetTime);
                        lastFiveSetTime = null;
                    }
                    lastFiveSetTime = setTimeout(function () {
                        SessionExpireAlert('lastFive');
                    }, OneMinInMS);
                }
                return;
            }
            var glType = gllangType;
            var isRTL = false;
            if (glType == "ar")
                isRTL = true;
            else
                isRTL = false;
            sessTimePopup = $.confirm({
                theme: 'modern',
                closeIcon: false,
                title: lcm[154],
                rtl: isRTL,
                escapeKey: true,
                backgroundDismiss: false,
                onContentReady: function () {
                    disableBackDrop('bind', false);
                },
                content: '<div class="body">' + lcm[33] + '&nbsp;<span id="seconds" style="color:Red;">' + lcm[35] + '</span>&nbsp;<br />' + lcm[34] + '</div>',
                buttons: {
                    buttonA: {
                        btnClass: 'btn btn-primary',
                        text: lcm[282],
                        action: function () {
                            if (lastInterval)
                                clearInterval(lastInterval);
                            if (lastFiveSetTime) {
                                clearTimeout(lastFiveSetTime);
                                lastFiveSetTime = null;
                            }
                            if (!isLatestSession()) {
                                window.location = "../aspx/sess.aspx";
                                return;
                            }
                            ResetSession(true);
                            sessTimePopup.close();
                        }
                    },
                    buttontB: {
                        text: lcm[283],
                        btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                        action: function () {

                            disableBackDrop('destroy');
                            if (lastInterval) {
                                clearInterval(lastInterval);
                                lastInterval = null;
                            }
                            if (lastFiveSetTime) {
                                clearTimeout(lastFiveSetTime);
                                lastFiveSetTime = null;
                            }

                            window.location = "../aspx/sess.aspx";
                            return;

                        },
                    }

                }
            });
            if (lastFiveSetTime) {
                clearTimeout(lastFiveSetTime);
                lastFiveSetTime = null;
            }
            lastFiveSetTime = setTimeout(function () {
                SessionExpireAlert('lastFive');
            }, OneMinInMS);
        } else {
            if (createFiveMinTimeOut) {
                clearTimeout(createFiveMinTimeOut);
                createFiveMinTimeOut = null;
            }
            createFiveMinTimeOut = setTimeout(function () {
                SessionExpireAlert();
            }, FiveMinInMS)
        }
    }

        function ResetSession(isreconnect=false) {
            if (typeof keepAlive != "undefined" && keepAlive == "true")
                KeepSessionAlive(serSessTime);
            else {
                if(isreconnect){
                    var img = new Image(1, 1);
                    img.src = '../aspx/Reconnect.aspx';
                }
                //neeed to close earlier popup
                if (sessTimePopup != false)
                    sessTimePopup.close();
                lastFive = 5;
                if (createFiveMinTimeOut) {
                    clearTimeout(createFiveMinTimeOut);
                    createFiveMinTimeOut = null;
                }
                if (lastFiveSetTime) {
                    clearTimeout(lastFiveSetTime);
                    lastFiveSetTime = null;
                }
                SessionExpireAlert(serSessTime);
            }
        }

        var creatSATimeOut = false;
        function KeepSessionAlive(serSessATime) {
            if (serSessATime != "") {
                serSessTime = serSessATime;
                serSessATime = serSessATime - 30000;
            }
            if (creatSATimeOut) {
                clearTimeout(creatSATimeOut);
                creatSATimeOut = null;
            }
            creatSATimeOut = setInterval(function () {
                var currPageUrl= callParentNew("middle1", "id").src;
                currPageUrl=currPageUrl.substring(currPageUrl.length,currPageUrl.indexOf('/aspx/')+6);
                currPageUrl=currPageUrl.substring(0,currPageUrl.indexOf("&hdnbElapsTime="));

                $.ajax({
                    type: "POST",
                    url: "../WebService.asmx/KeepSignLastUpdated",
                    cache: false,
                    async: false,
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify({
                        AliveTime: serSessTime,currPageUrl:currPageUrl
                    }),
                    dataType: "json",
                    success: function (data) {
                        var sessExit = data.d;
                        if(sessExit=="web")
                        {
                            //window.location = "../aspx/sess.aspx?keepalive=true";                            
                            window.location = "../aspx/sess.aspx";                 
                            return;
                        }
                        else if (sessExit=="false")
                        {
                            window.location = "../aspx/sess.aspx";
                            return;
                        }
                        else
                        {
                            window.location = `../aspx/sess.aspx?hybridGUID=${hybridGUID}&deviceid=${hybridDeviceId}${sessExit}`;
                            return;
                        }
                       
                    }
                });
            }, serSessATime);
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~for new menu

        var itemsPerPage = 6;
        var itemsPerEachSet = 4; //all
        var itemSetsPerRow = 3;
        var singleLevelMenuItems = 6; //all
        var itemWordBreak = "ellipsis"; //ellipsis
        var menuTotalPages;
        var menuMaxLevel;
        var menuJson;
        var menuTemplate = "";
        var isOneLevelMenu = false;
        if (axMenuStyle === "custom") {
            itemsPerPage = axMenuPerView || 6;
            itemsPerEachSet = axSubMenuCnt || 4; //all
            itemSetsPerRow = axMenuCols || 3
            singleLevelMenuItems = axDirSubMenuCnt || 6; //all
            itemsPerPage = parseInt(itemsPerPage);
            if (itemsPerEachSet !== "all")
                itemsPerEachSet = parseInt(itemsPerEachSet);
            itemSetsPerRow = parseInt(itemSetsPerRow);
            if (singleLevelMenuItems !== "all")
                singleLevelMenuItems = parseInt(singleLevelMenuItems);
            itemWordBreak = axMenuWordWrap === "true" ? "" : "ellipsis";
        }


        menuTemplate += '<div class="col-md-' + (12 / itemSetsPerRow) + ' col-sm-6 menuSetCol">';
        menuTemplate += '<div class="menuSetWrapper">';
        menuTemplate += '<div title="{{head_title}}" class="menuTitle ' + itemWordBreak + '">{{head_title}}';
        menuTemplate += '<button type="button" class="noBg visible-xs MobileMenuOpenBtn pull-right"><span class="icon-arrows-down"></span></button>';
        menuTemplate += '</div>';
        menuTemplate += '<div class="menuSetContainer text-center">';
        menuTemplate += '<button title="Scroll Up" type="button" tabindex="-1" class="noBg upDownIcons upIcon"><span class="icon-arrows-up"></span></button>';
        menuTemplate += '<div class="menuSet text-left">';
        // menuTemplate += '<p class="menuSetItem"><a href=""><span class="icon-basic-flag2"></span> Sales3</a></p>';
        menuTemplate += '{{menuList}}';
        menuTemplate += '</div>';
        menuTemplate += '<button title="Scroll Down" type="button" tabindex="-1" class="noBg upDownIcons downIcon"><span class="icon-arrows-down"></span></button>';
        menuTemplate += '</div>';
        menuTemplate += '</div>';
        menuTemplate += '</div>';

        function initializeMenu(menuData, isFirstTime, initialHirarchy) {
            initialHirarchy = initialHirarchy ? initialHirarchy + "-" : "";
            menuMaxLevel = parseInt(menuJson.root.max);
            var menuDataLength = menuData.length;
            var menuHtml = "";
            var isDirectChild = false;
            var isDirectLink = false;

            if (!isFirstTime) {
                var isSubsetSingle = true;
                for (var j = 0; j < menuDataLength; j++) {
                    if (menuData[j].child) {
                        isSubsetSingle = false;
                        break;
                    }
                }

                if (!menuDataLength && menuData.child) {
                    isSubsetSingle = false;
                }

                if (isSubsetSingle) {
                    menuMaxLevel = 0;
                    isOneLevelMenu = true;
                } else {
                    isOneLevelMenu = false;
                }
            }

            if (menuMaxLevel > 0) {
                if (!menuDataLength && menuData.child) {
                    isDirectChild = true;
                }
                if (!menuDataLength && !menuData.child) {
                    isDirectLink = true;
                }
                if (!menuDataLength) {
                    menuDataLength = 1;
                }
                for (var i = 0; i < menuDataLength; i++) {
                    var iValtoAdd = i;
                    if (isDirectChild || isDirectLink) {
                        var presentNode = menuData;
                        iValtoAdd = "c";
                    } else {
                        var presentNode = menuData[i];
                    }
                    var presentTemplate = menuTemplate;
                    var childData = presentNode.child;
                    var hasChild = childData ? true : false;
                    var nodeName = presentNode.name;
                    if (!hasChild && presentNode.target === "")
                        continue;
                    nodeName = nodeName.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    presentTemplate = presentTemplate.replace(/{{head_title}}/g, nodeName);
                    if (hasChild) {
                        var childLength = childData.length;
                        var linkHtml = "";
                        if (childLength) {
                            for (var j = 0; j < childLength; j++) {
                                var presChild = childData[j];
                                var subChildData = presChild.child;
                                var hasSubChild = subChildData ? true : false;
                                var iconClass = presChild.img;
                                iconClass = getTheIcon(iconClass, presChild.target);
                                if (!hasSubChild) {
                                    linkHtml += '<p title="' + presChild.name + '" class="menuSetItem ' + itemWordBreak + '"><a class="' + itemWordBreak + '" onclick="LoadIframe(\'' + presChild.target + '\')" href="#' + getSmallMenuName(presChild.target) + '"><span class="icon-' + iconClass + '"></span><span class="' + itemWordBreak + ' menuName">' + presChild.name + '</span></a></p>';
                                } else {
                                    linkHtml += '<p title="' + presChild.name + '" onclick="openMenuLevel(\'' + initialHirarchy + iValtoAdd + '-' + j + '\',\'' + presChild.name + '\')" class="menuSetItem ' + itemWordBreak + ' hasSubChild"><a class="' + itemWordBreak + ' hasSubChild" href="javascript:void(0)"><span class="icon-' + iconClass + '"></span><span class="' + itemWordBreak + ' menuName">' + presChild.name + '</span><span class="hasSubChildIcon icon-arrows-right pull-right"></span></a></p>';
                                }
                            }
                        } else {
                            iconClass = getTheIcon(childData.img, childData.target);
                            var hasChild = childData.child;
                            var hirarchyToadd = "";
                            if (isDirectChild)
                                hirarchyToadd = initialHirarchy + 'c';
                            else
                                hirarchyToadd = initialHirarchy + iValtoAdd + '-' + 'c';
                            if (hasChild)
                                linkHtml += '<p title="' + childData.name + '" onclick="openMenuLevel(\'' + hirarchyToadd + '\',\'' + childData.name + '\')" class="menuSetItem ' + itemWordBreak + ' hasSubChild"><a class="' + itemWordBreak + ' hasSubChild" href="javascript:void(0)"><span class="icon-' + iconClass + '"></span> <span class="' + itemWordBreak + ' menuName">' + childData.name + '</span><span class="hasSubChildIcon icon-arrows-right pull-right"></span></a></p>';
                            else
                                linkHtml += '<p title="' + childData.name + '" class="menuSetItem ' + itemWordBreak + '"><a class="' + itemWordBreak + '" onclick="LoadIframe(\'' + childData.target + '\')" href="#' + getSmallMenuName(childData.target) + '"><span class="icon-' + iconClass + '"></span> <span class="' + itemWordBreak + ' menuName">' + childData.name + '</span></a></p>';
                        }
                        presentTemplate = presentTemplate.replace(/{{menuList}}/, linkHtml);
                    } else {
                        var iconClass = presentNode.img;
                        iconClass = getTheIcon(iconClass, presentNode.target);

                        linkHtml = '<p title="' + nodeName + '" class="menuSetItem"><a class="' + itemWordBreak + '" onclick="LoadIframe(\'' + presentNode.target + '\')" href="#' + getSmallMenuName(presentNode.target) + '"><span class="icon-' + iconClass + '"></span> <span class="' + itemWordBreak + ' menuName">' + nodeName + '</span></a></p>';
                        presentTemplate = presentTemplate.replace(/{{menuList}}/, linkHtml);
                    }
                    menuHtml += presentTemplate;
                }
                $("#menuContainer").html(menuHtml);


            } else {
                isOneLevelMenu = true;
                var j = "";
                var isOnlyData = false;
                if (!menuDataLength) {
                    menuDataLength = 1;
                    isOnlyData = true;
                }
                for (var i = 0; i < menuDataLength; i++) {
                    if (isOnlyData)
                        var presentData = menuData;
                    else
                        var presentData = menuData[i];
                    var presSingleLevelItems = singleLevelMenuItems
                    if (singleLevelMenuItems === "all")
                        presSingleLevelItems = menuData.length;

                    var totalItemsPerPage = presSingleLevelItems * itemSetsPerRow;

                    if (presentData.target != "") {
                        (j === "") ? (j = 0) : j++;
                        if (j % totalItemsPerPage === 0) {
                            //need to start new page for menu set
                            var pageNo = (j / totalItemsPerPage) + 1;
                            menuHtml += '<div class="mnuPagination" id="page' + pageNo + '" style="">';
                        }
                        if (j % presSingleLevelItems === 0) {
                            //need to start new menu set
                            menuHtml += '<div class="menuSetWrapper menuSetCol col-md-' + (12 / itemSetsPerRow) + '">';

                        }
                        var iconClass = presentData.img;
                        iconClass = getTheIcon(iconClass, presentData.target);
                        menuHtml += '<p title="' + presentData.name + '" class="menuSetItem"><a class="' + itemWordBreak + '" onclick="LoadIframe(\'' + presentData.target + '\')" href="#' + getSmallMenuName(presentData.target) + '"><span class="icon-' + iconClass + '"></span><span class="menuName ' + itemWordBreak + '">' + presentData.name + '</span></a></p>';


                        if (j % presSingleLevelItems === (presSingleLevelItems - 1)) {
                            //need to close new menu set
                            menuHtml += "</div>";
                        }
                        if (j % totalItemsPerPage === (totalItemsPerPage - 1)) {
                            //need to close the new page for menu set
                            menuHtml += "</div>";
                        }
                        if ((j + 1) === menuDataLength) {
                            //means data is over but divs wont close if count is less than expected so closing divs manually
                            if (j % presSingleLevelItems !== (totalItemsPerPage - 1))
                                menuHtml += "</div>";
                            if (j % totalItemsPerPage !== (totalItemsPerPage - 1))
                                menuHtml += "</div>";
                        }
                    }
                }
                $("#menuContainer").html(menuHtml);
            }
            if (gllangType === "ar")
                $("#mainMenuWrapper").addClass("menuRtl")
            else
                $("#mainMenuWrapper").removeClass("menuRtl")




            var menuWrapper = $("#menuContentWrapper");
            var allmenuSetCol = $("#menuContentWrapper .menuSetCol");
            var totalMenuCols = allmenuSetCol.length;
            menuTotalPages = Math.ceil(totalMenuCols / itemsPerPage);
            var resolution = $(window).width();
            if (!isOneLevelMenu) {
                if (resolution < 768) {
                    $(".menuSetContainer").hide();
                    $(".MobileMenuOpenBtn").on('click', function (event) {
                        $(this).find('span').toggleClass('icon-arrows-down icon-arrows-up')
                        $(this).parents('.menuSetWrapper').find('.menuSetContainer').toggle(300);
                        /* Act on the event */
                    });
                }
                // 969px -> sm
                //slice(x,y) x = (pageNo-1)*itemsPerPage , y = x+itemsPerPage;
                for (var i = 1; i <= menuTotalPages; i++) {
                    var start = (i - 1) * itemsPerPage;
                    var end = start + itemsPerPage;
                    var presentMenuSetCol = allmenuSetCol.slice(start, end);
                    presentMenuSetCol.wrapAll("<div class='mnuPagination' id='page" + i + "' />");
                }
            } else {
                menuTotalPages = $(".mnuPagination").length;
            }

            $(".mnuPagination").hide();
            $("#menuContentFooter .menuFooterPrev").hide();
            if (menuTotalPages > 1)
                $("#menuContentFooter .menuFooterNext").show().attr('onclick', 'showNextPrevMenu("next",2)');
            else
                $("#menuContentFooter .menuFooterNext").hide();
            $("#page1").show();
            if (!isOneLevelMenu) {
                var flowNxtIdx = 0;
                allmenuSetCol.each(function (index, el) {
                    var presentSet = $(this);
                    if (itemsPerPage === flowNxtIdx) {
                        flowNxtIdx = 0;
                    }
                    if (flowNxtIdx % itemSetsPerRow == 0) {
                        presentSet.addClass('flowNextRow');
                    }
                    flowNxtIdx++;
                    if (itemsPerEachSet !== "all") {
                        if (presentSet.find('.menuSet p').length > itemsPerEachSet) { ////need to change
                            presentSet.find('.downIcon').css('visibility', 'visible');
                            presentSet.find('.menuSet p:gt(' + (itemsPerEachSet - 1) + ')').hide();
                        }
                    }
                });
            }

            if (isFirstTime)
                assignMenuKeyDownEvents();
            $(".menuSetContainer  .upDownIcons").click(function (event) {
                var elem = $(this);
                if (elem.hasClass('downIcon')) {
                    var firstVisibleItem = elem.parent().find('.menuSet p:visible:first');
                    var firstUnVisbleItem = elem.parent().find('.menuSet p:visible:last').next()
                    firstVisibleItem.hide();
                    firstUnVisbleItem.show();
                    if (!firstUnVisbleItem.next().hasClass('menuSetItem')) {
                        elem.css('visibility', 'hidden');
                    }
                    // if(firstVisibleItem.prev().hasClass('menuSetItem')){
                    elem.parent().find('.upIcon').css('visibility', 'visible')
                    // }
                } else if (elem.hasClass('upIcon')) {
                    var firstVisibleItem = elem.parent().find('.menuSet p:visible:first').prev();
                    elem.parent().find('.menuSet p:visible:last').hide();
                    firstVisibleItem.show();
                    elem.parent().find('.downIcon').css('visibility', 'visible');
                    if (!firstVisibleItem.prev().hasClass('menuSetItem'))
                        elem.css('visibility', 'hidden');
                }
            });
        }

        function getTheIcon(iconClass, target, calledFrom) {
            var classToAdd = "";
            if (calledFrom === "fromMobile")
                classToAdd = "mobileMenu";
            // if (!iconClass || iconClass == "") {
            if (target.charAt(0) == 't')
                iconClass = 'tstructMenuBgIcn menuBgIcon ' + classToAdd;
            else if (target.charAt(0) == 'i')
                iconClass = 'iviewMenuBgIcn menuBgIcon ' + classToAdd;
            else if (target.charAt(0) == 'p')
                iconClass = 'pageMenuBgIcn menuBgIcon ' + classToAdd;
            else
                iconClass = 'linkMenuBgIcn menuBgIcon ' + classToAdd;
            // }
            return iconClass;
        }

        function getSmallMenuName(fullName) {
            var nameToSend = fullName;
            if (nameToSend) {
                if (fullName.indexOf("tstruct.aspx") !== -1) {
                    nameToSend = "t" + fullName.substr(fullName.indexOf("transid=") + 8);
                } else if (fullName.indexOf("page.aspx") !== -1) {
                    nameToSend = "p" + fullName.substr(fullName.indexOf("axpage_id=") + 10);
                } else {
                    nameToSend = "i" + fullName.substr(fullName.indexOf("ivname=") + 7);
                }
            }
            return nameToSend;
        }

        function assignMenuKeyDownEvents(task) {

            if (task == "unbind") {
                $(".activeItem").removeClass('activeItem');
                $(".menuSetItem,.menuFooter,#hirarchyContainer .clickable").off("mouseenter.onMouseEnter");
                $(document).off('keydown.MNUupDown');
                $(window).off('resize.windowRszEvt')
                return
            }

            $(window).on('resize.windowRszEvt', function () {
                var btnContainer = $('#hamburgerMenuIcon');
                if (btnContainer.hasClass('is-active')) {
                    btnContainer.addClass('fromResizeClose');
                    btnContainer.find('button').click();
                }
            });

            $(".menuSetItem:visible:first").addClass('activeItem');
            $(".menuSetCol:visible:first .upDownIcons").addClass('jump');
            $(".menuSetItem,.menuFooter,#hirarchyContainer .clickable").on("mouseenter.onMouseEnter", function (event) {
                $(".activeItem").removeClass('activeItem')
                $(this).addClass('activeItem')
                createButtonJumpAnim();
            });
            $(document).on('keydown.MNUupDown', function (e) {
                var keyCode = e.keyCode;
                var activeItem = $(".activeItem")
                switch (keyCode) {
                    case 40:
                        e.preventDefault();
                        var nextMenuItem = activeItem.next();
                        if (nextMenuItem.hasClass('menuSetItem')) {
                            activeItem.removeClass('activeItem');
                            if (nextMenuItem.is(':visible'))
                                nextMenuItem.addClass('activeItem')
                            else {
                                activeItem.parent().next().click();
                                nextMenuItem.addClass('activeItem')
                            }

                        }
                        break;
                    case 38:
                        e.preventDefault();
                        var prevMenuItem = activeItem.prev();
                        if (prevMenuItem.hasClass('menuSetItem')) {
                            activeItem.removeClass('activeItem');
                            if (prevMenuItem.is(':visible'))
                                prevMenuItem.addClass('activeItem')
                            else {
                                activeItem.parent().prev().click();
                                prevMenuItem.addClass('activeItem')
                            }

                        }
                        break;
                    case 9:
                    case 37:
                    case 39:
                        e.preventDefault();
                        if (keyCode == 39)
                            e.shiftKey = false;
                        else if (keyCode == 37)
                            e.shiftKey = true;
                        if (e.shiftKey) {
                            var footerHirarchy = $(".hirarchyContainer .hirarchy.clickable:last");
                            if (activeItem.hasClass('menuFooter')) {
                                //means its in footer next/prev button
                                var prevBtn = activeItem.prev();
                                if (prevBtn.hasClass('menuFooter') && prevBtn.is(':visible')) {
                                    prevBtn.addClass('activeItem')
                                } else {
                                    $(".mnuPagination:visible").find('.menuSetCol:visible:last .menuSetItem:visible:first').addClass('activeItem');
                                }
                            } else if (activeItem.hasClass('hirarchy')) {
                                //means its in footer hiirarchy
                                var footerVisibleButton = $("#menuContentFooter button:visible:last");
                                var prevHirarchy = activeItem.prevAll('.hirarchy').first();
                                if (prevHirarchy.length !== 0) {
                                    prevHirarchy.addClass('activeItem')
                                } else if (footerVisibleButton.length !== 0) {
                                    footerVisibleButton.addClass('activeItem')
                                } else {
                                    $(".mnuPagination:visible").find('.menuSetCol:visible:last .menuSetItem:visible:first').addClass('activeItem');
                                }
                            } else {
                                //means its in menu
                                var prevMenuSet = activeItem.parents(".menuSetCol").prev();
                                if (prevMenuSet.hasClass('menuSetCol'))
                                    prevMenuSet.find('.menuSetItem:visible:first').addClass('activeItem');
                                else {
                                    var footerBtn = $("#menuContentFooter button:visible:last");
                                    if (footerHirarchy.length > 0) {
                                        footerHirarchy.addClass('activeItem');
                                    } else if (footerBtn.length !== 0) {
                                        footerBtn.addClass('activeItem');
                                    } else {
                                        $(".mnuPagination:visible").find('.menuSetCol:visible:last .menuSetItem:visible:first').addClass('activeItem');
                                    }
                                    //activeItem.parents(".mnuPagination").find('.menuSetCol:visible:last .menuSetItem:visible:first').addClass('activeItem');
                                }
                            }
                        } else {
                            var footerHirarchy = $(".hirarchyContainer .hirarchy.clickable:first");
                            if (activeItem.hasClass('menuFooter')) {
                                var nextBtn = activeItem.next();
                                if (nextBtn.hasClass('menuFooter') && nextBtn.is(':visible')) {
                                    nextBtn.addClass('activeItem')
                                } else {
                                    if (footerHirarchy.length !== 0)
                                        footerHirarchy.addClass('activeItem');
                                    else
                                        $(".mnuPagination:visible").find('.menuSetItem:visible:first').addClass('activeItem');

                                }
                            } else if (activeItem.hasClass('hirarchy')) {
                                var nextHirarchy = activeItem.nextAll('.hirarchy').first();
                                if (nextHirarchy.hasClass('clickable')) {
                                    nextHirarchy.addClass('activeItem');
                                } else {
                                    $(".mnuPagination:visible").find('.menuSetItem:visible:first').addClass('activeItem');
                                }
                            } else {
                                var nextMenuSet = activeItem.parents(".menuSetCol").next();
                                if (nextMenuSet.hasClass('menuSetCol'))
                                    nextMenuSet.find('.menuSetItem:visible:first').addClass('activeItem')
                                else {
                                    var footerVisibleButton = $("#menuContentFooter button:visible:first")
                                    if (footerVisibleButton.length !== 0) {
                                        footerVisibleButton.addClass('activeItem')
                                    } else {
                                        if (footerHirarchy.length !== 0) {
                                            footerHirarchy.addClass('activeItem');
                                        } else
                                            $(".mnuPagination:visible").find('.menuSetItem:visible:first').addClass('activeItem');
                                    }


                                }
                            }
                        }
                        activeItem.removeClass('activeItem');
                        createButtonJumpAnim();
                        break;
                    case 13:
                        e.preventDefault();
                        if (activeItem.find('a').length != 0)
                            activeItem.find('a').click();
                        else
                            activeItem.click();
                        break;
                    case 27:
                        e.preventDefault();
                        $("#hamburgerMenuIcon button").click();
                        break;
                }
            });
        }

        function createButtonJumpAnim() {
            var activeItem = $(".activeItem")
            $("button.jump").removeClass('jump')
            if (!activeItem.hasClass('menuFooter')) {
                activeItem.parents('.menuSetContainer').find('button.upDownIcons').addClass('jump')
            }
        }

        function showNextPrevMenu(task, page) {
            $(".activeItem").removeClass('activeItem');
            $(".mnuPagination").hide();
            $("#page" + page).show();
            if (page > 1) {
                $("#hirarchyContainer,#hirarchyHome").show();
                $("#hirarchyHome").addClass('clickable');
                $(".menuSetItem,.menuFooter,#hirarchyContainer .clickable").off("mouseenter.onMouseEnter");
                $(".menuSetItem,.menuFooter,#hirarchyContainer .clickable").on("mouseenter.onMouseEnter", function (event) {
                    $(".activeItem").removeClass('activeItem')
                    $(this).addClass('activeItem')
                    createButtonJumpAnim();
                });
            }
            if (page == menuTotalPages) {
                $("#menuContentFooter .menuFooterNext").hide();
                $("#menuContentFooter .menuFooterPrev").attr('onclick', 'showNextPrevMenu("prev",' + (page - 1) + ')').show();
            } else if (page == 1) {
                if ($("#hirarchyContainer .hirarchySeperator").length === 0) { //seperator is there then its not a home page ===> Some Subset
                    $("#hirarchyContainer").html('<span id="hirarchyHome" title="Home" style="display: none;" onclick="changeHirarchy(\'home\')" class="hirarchy icon-basic-home"></span>').hide();
                }
                $("#menuContentFooter .menuFooterPrev").hide();
                $("#menuContentFooter .menuFooterNext").attr('onclick', 'showNextPrevMenu("prev",' + (page + 1) + ')').show();
            } else {
                $("#menuContentFooter .menuFooterNext").attr('onclick', 'showNextPrevMenu("prev",' + (page + 1) + ')').show();
                $("#menuContentFooter .menuFooterPrev").attr('onclick', 'showNextPrevMenu("prev",' + (page - 1) + ')').show();
            }
            $(".menuSetItem:visible:first").addClass('activeItem');
        }

        function createCustomMenu(page, html) {
            var lastPageLst = $(".mnuPagination:last");
            lastPageLst.append(html);
            lastPageLst.find('.menuSetCol:last').attr('page', page);

        }

        function openMenuLevel(hirarchy, name) {
            var pageNo = $(".mnuPagination:visible").attr('id').substr(4);
            $(".menuSetItem,.menuFooter,#hirarchyContainer .clickable").off("mouseenter");
            var hirarchyArray = hirarchy.split("-");
            var menuData = menuJson.root.parent;
            for (var i = 0; i < hirarchyArray.length; i++) {
                //

                if (hirarchyArray[i] == 'c') {
                    menuData = menuData.child;
                } else {
                    menuData = $.isArray(menuData) ? menuData[hirarchyArray[i]] : menuData.child[hirarchyArray[i]];

                    //menuData = menuData.child[hirarchyArray[i]]
                }
            }
            $("#hirarchyHome,#hirarchyContainer").show();
            // var menuData = menuJson.root.parent[hirarchy[0]].child[3].child;
            $("#hirarchyContainer .hirarchy").addClass('clickable');
            $("#hirarchyContainer .hirarchy:last").data('pageNo', pageNo)
            $("#hirarchyContainer").append('<span class="hirarchySeperator colorButton icon-arrows-right"></span><span onclick="changeHirarchy(\'sub\',\'' + hirarchy + '\',this)" title="' + name + '" class="hirarchy">' + name + '</span>');
            initializeMenu(menuData.child, false, hirarchy);
            assignMenuKeyDownEvents("unbind");
            assignMenuKeyDownEvents();
        }

        function changeHirarchy(task, hirarcy, elem) {
            if (task == "home") {
                initializeMenu(menuJson.root.parent);
                var pageNo = $("#hirarchyHome").data("pageNo");
                if (pageNo && pageNo != 1) {
                    showNextPrevMenu("next", parseInt(pageNo))
                    $("#hirarchyContainer").html('<span id="hirarchyHome" title="Home" data-pageNo="1" onclick="changeHirarchy(\'home\')" class="hirarchy clickable icon-basic-home"></span>');
                } else {
                    $("#hirarchyContainer").html('<span id="hirarchyHome" title="Home" style="display: none;" onclick="changeHirarchy(\'home\')" class="hirarchy icon-basic-home"></span>').hide();

                }

                assignMenuKeyDownEvents("unbind");
                assignMenuKeyDownEvents();
            } else {
                elem = $(elem);
                if (!elem.hasClass('clickable'))
                    return;
                var pageNo = elem.data("pageNo");
                var name = elem.text();
                elem.nextAll('span').remove();
                elem.prev().remove();
                elem.remove();
                openMenuLevel(hirarcy, name)
                if (pageNo && pageNo != 1) {
                    showNextPrevMenu("next", parseInt(pageNo))
                }
            }
        }

        // mobile related data
        function openNav() {
            $("#mobileSidenav").css('width', '250px');
            $("#hamburgerMenuIcon").addClass('menuOpened')
            $("#mainMobileData").addClass('mobileMenuOpened');
            document.body.style.backgroundColor = "rgba(0,0,0,0.4)";

            $(window).on('resize.windowRszEvt', function () {
                var btnContainer = $('#hamburgerMenuIcon');
                if (btnContainer.hasClass('is-active')) {
                    btnContainer.addClass('fromResizeClose');
                    btnContainer.find('button').click();
                }
            });
        }

        function closeNav() {
            $("#mobileSidenav").css('width', '0');
            $("#hamburgerMenuIcon").removeClass('menuOpened');
            $("#mainMobileData").removeClass('mobileMenuOpened');
            document.body.style.backgroundColor = "white";

            $(window).off('resize.windowRszEvt')
        }

        $(document).on('click', '.hasMobMenuChilds>.liWrapper', function (event) {
            event.stopPropagation();
            var elem = $(this);
            // var isElemClicked = elem.find('.liWrapper:first').hasClass('selected');
            var parentElem = elem.parents('ul').first();
            $(".hasMobMenuChilds .selected").removeClass('selected');
            if (parentElem.hasClass('subMenuList')) {
                parentElem.children('li').not(elem.parent()).toggle('medium');
            }
            if (elem.find('.moreMenuIcn').hasClass('icon-arrows-down')) {
                elem.addClass('selected');
            } else {
                var nextSubmenuList = elem.next();
                nextSubmenuList.find('ul.subMenuList.listOpened').removeClass('listOpened').hide();
                nextSubmenuList.find('li').show();
                nextSubmenuList.find('.icon-arrows-up').removeClass('icon-arrows-up').addClass('icon-arrows-down')
                if (parentElem.hasClass('subMenuList'))
                    parentElem.prev().addClass('selected')
            }

            elem.parent().find('ul.subMenuList:first').toggleClass('listOpened').toggle('medium');
            elem.find('.moreMenuIcn').toggleClass('icon-arrows-up icon-arrows-down');


        });

        function createMobileMenu(jsonData, isFirstTime) {
            var mobileHtml = "";
            if (isFirstTime) {
                mobileHtml += "<ul id='mainMobileMenuUl'>";
            } else {
                mobileHtml += '<ul class="subMenuList" style="display: none;">';
            }
            var jsonDataLength = jsonData.length;
            var isDirectChild = false;
            if (!jsonDataLength && jsonData.child) {
                isDirectChild = true;
                jsonDataLength = 1;
            }
            if (jsonDataLength) {
                for (var i = 0; i < jsonDataLength; i++) {
                    if (isDirectChild)
                        var presentData = jsonData;
                    else
                        var presentData = jsonData[i];
                    var hasChild = presentData.child;
                    var iconClass = presentData.img;
                    var name = presentData.name;
                    iconClass = getTheIcon(iconClass, presentData.target, "fromMobile");
                    if (hasChild) {
                        mobileHtml += '<li class="hasMobMenuChilds">';
                        mobileHtml += '<span class="liWrapper">';
                        mobileHtml += '<span class="icon-' + iconClass + ' mobIleMenuIcon"></span>';
                        mobileHtml += '<span class="mobilemenuTitle">' + name + '</span>';
                        mobileHtml += '<span class="icon-arrows-down moreMenuIcn"></span>';
                        mobileHtml += '</span>';
                        mobileHtml += createMobileMenu(hasChild);

                        mobileHtml += '</li>';
                    } else {
                        mobileHtml += ' <li onclick="LoadIframe(\'' + presentData.target + '\')" title="' + name + '"><span class="liWrapper"><span class="icon-' + iconClass + ' mobIleMenuIcon"></span><span class="mobilemenuTitle">' + name + '</span></span></li>';
                    }
                }
            } else {
                var iconClass = jsonData.img;
                var name = jsonData.name;
                iconClass = getTheIcon(iconClass, jsonData.target, "fromMobile");
                mobileHtml += ' <li onclick="LoadIframe(\'' + jsonData.target + '\')" title="' + name + '"><span class="liWrapper"><span class="icon-' + iconClass + ' mobIleMenuIcon"></span><span class="mobilemenuTitle">' + name + '</span></span></li>';
            }

            mobileHtml += "</ul>";
            return mobileHtml;
        }


        //~~~~~~~~~~~~~~~~~~~~~~End of new menu


        $(document).click(function (e) {


            if (!$(e.target).hasClass("qrcoderel") && $("#qrCode").data("bs.popover")) {
                // createMobileQRcode("destroy");
            }

            if ($("#middle1").contents().find(".remodal-close").length != 0 && top.$(".loadingoverlay").length == 0 && $(".jconfirm").length == 0) {
                //var popWindow = $($("#middle1").contents()[0]).find("#popupIframeRemodal")
                //if (popWindow != undefined) {
                //    if (!popWindow[0].contentWindow.IsFormDirty != undefined && !popWindow[0].contentWindow.IsFormDirty) {
                //        removeOverlayFromBody();
                //        $("#middle1").contents().find(".remodal-close").click();
                //    }
                //    else {
                //        var glType = eval(callParent('gllangType'));
                //        var isRTL = false;
                //        if (glType == "ar")
                //            isRTL = true;
                //        else
                //            isRTL = false;
                //        var ConfirmSaveCB = $.confirm({
                //            title: eval(callParent('lcm[155]')),
                //            onContentReady: function () {
                //                disableBackDrop('bind');
                //                //to display tooltips for Confirm & Cancel buttons
                //                $(".jconfirm-buttons button").each(function () {
                //                    var txt = $(this).text();
                //                    $(this).prop('title', txt.charAt(0).toUpperCase() + txt.slice(1))
                //                });
                //            },
                //            rtl: isRTL,
                //            backgroundDismiss: 'false',
                //            escapeKey: 'buttonB',
                //            content: eval(callParent('lcm[31]')),
                //            buttons: {
                //                buttonA: {
                //                    text: eval(callParent('lcm[164]')),
                //                    btnClass: 'hotbtn',
                //                    action: function () {
                //                        ConfirmSaveCB.close();
                //                        removeOverlayFromBody();
                //                        $("#middle1").contents().find(".remodal-close").click();
                //                    }
                //                },
                //                buttonB: {
                //                    text: eval(callParent('lcm[192]')),
                //                    btnClass: 'coldbtn',
                //                    action: function () {
                //                        disableBackDrop('destroy');
                //                    }
                //                }
                //            }
                //        });
                //    }
                //}
            } else if ($("#middle1").contents().find("#bootstrapModal .close").length != 0) {
                $("#middle1").contents().find("#bootstrapModal .close").click();
            } else if ($("#middle1").contents().find("#divAction #closeList").length != 0) {
                $("#middle1").contents().find("#divAction #closeList").click();
            } else if ($("#middle1").contents().find(".jconfirm-box .jconfirm-buttons .coldbtn").length != 0) {
                $("#middle1").contents().find(".jconfirm-box .jconfirm-buttons .coldbtn").click();
            } else if ($("#middle1").contents().find(".jconfirm-box .jconfirm-buttons .coldbtntiny").length != 0) {
                //preventing not closing existing confirm dialog if any popup opened & trying to open a new confirm dialog -- FYI AGI004147
                //$("#middle1").contents().find(".jconfirm-box .jconfirm-buttons .coldbtntiny").click();
            }


        });

        //add unclickable overlay css to header, footer & menusidebar when an remodal popup is opened 
        function addOverlayToBody() {
            $(callParentNew("mainNewPageBody")).find(".main-header, .main-sidebar, .main-footer").addClass("remodal-overlay-custom");
            if (!$(".button-splitter .split-btn").hasClass(".hide")) {
                $(".button-splitter").find(".split-btn, .split-btn-vertical").hide();
            }
        }

        //remove unclickable overlay css to header, footer & menusidebar when an remodal popup is closed
        function removeOverlayFromBody() {
            $(callParentNew("mainNewPageBody")).find(".main-header, .main-sidebar, .main-footer").removeClass("remodal-overlay-custom");
            if (!$(".button-splitter .split-btn").hasClass(".hide")) {
                $(".button-splitter").find(".split-btn, .split-btn-vertical").show();
            }
        }

        $(function () {
            $('#settingbtn, #settingdropdown, #ExportImportCogIcon').click(function () {
                // createMobileQRcode("destroy");
                $('#customizer', window.parent.document).removeClass('panel-open');
                handleTabIndex();
                if ($("#middle1").contents().find(".jconfirm-box .jconfirm-buttons .coldbtntiny").length != 0) {
                    $("#middle1").contents().find(".jconfirm-box .jconfirm-buttons .coldbtntiny").click();
                } else if ($("#middle1").contents().find(".jconfirm-box .jconfirm-buttons .coldbtn").length != 0) {
                    $("#middle1").contents().find(".jconfirm-box .jconfirm-buttons .coldbtn").click();
                } else if ($("#middle1").contents().find(".remodal-close").length != 0 && top.$(".loadingoverlay").length == 0) {
                    $("#middle1").contents().find(".remodal-close").click();
                } else if ($("#middle1").contents().find("#bootstrapModal .close").length != 0) {
                    $("#middle1").contents().find("#bootstrapModal .close").click();
                } else if ($("#middle1").contents().find("#divAction #closeList").length != 0) {
                    $("#middle1").contents().find("#divAction #closeList").click();
                }
            });
        });

        $(function () {
            "use strict";

            $(".panel-control").click(function (e) {

                $('#customizer').toggleClass('panel-open');
                e.preventDefault();
                handleTabIndex();
                //Initializing();
                if ($('#customizer').hasClass('panel-open')) {
                    $('#customizer').focus();
                }
            });
        });

        (function ($) {
            $.fn.downCount = function (options, callback) {
                var settings = $.extend({}, options);
            };
        });

        $(document).keyup(function (e) {
            if (e.which == 27) {
                if ($('#customizer').hasClass('panel-open')) {
                    $('#customizer', window.parent.document).removeClass('panel-open');
                    $("#themeIcon").focus();
                    handleTabIndex();
                }
            }
        });

        //Global params pop over
        $(function () {
            $('[data-toggle="popover"]').popover({
                container: 'body',
                html: true,
                content: function () {
                    var clone = $($(this).data('popover-content')).clone(true).removeClass('hide');
                    return clone;
                }
            })
        })


        var actionsClicked = "";
        //If Import/Export dialog is opened then user clicks on any dialog prevent it & opened once the Export/Import dialog is closed
        function checkIfAnyActionPerformed() {
            if (actionsClicked == "Change Password")
            displayBootstrapModalDialog('Change Password', 'md', '230px', true, '../aspx/cpwd.aspx?remark=chpwd', undefined, ()=>{
                $("#iFrameChangePassword").css("height", `${Math.ceil($("#iFrameChangePassword")[0].contentWindow.$("form").height())}px`)
            });
            else if (actionsClicked == "Trace File")
                OpenLogFile();
            actionsClicked = "";
        }
        //function for about us page
        function showAbout() {
            var modalExists = $('.modal').filter(".in").attr("data-confirm-leave") === "true";
            if (modalExists) {
                actionsClicked = "okay";
                iFrameId = $('.modal').filter(".in").attr("data-iframe-id");
                if (iFrameId != undefined)
                    window.frames[iFrameId].contentWindow.ConfirmLeave();
            } else {
                // displayBootstrapModalDialog('About Axpert Web', 'md', '300px', true, '../aspx/aboutUs.aspx', undefined, function () {
                let myModal = new BSModal("AboutAxpertWeb", "About Axpert Web", "<iframe src='../aspx/aboutUs.aspx'></iframe>", () => {
                    //shown callback
                    $(".btn-close").focus();
                    $("#btnClose").hide()
                }, () => {
                    //hide callback
                });

               // myModal.changeSize("300px");
                myModal.hideFooter();
                myModal.close();

                    //$("#iFrameAboutAxpertWeb").contents().find("#btnClose").focus();
                
            }
            setTimeout(function () { removeUnclickableMenuCssClass() }, 100)
        }
        //function for user manual
        function showUserManual(){
            var modalExists = $('.modal').filter(".in").attr("data-confirm-leave") === "true";
            if (modalExists) {
                actionsClicked = "okay";
                iFrameId = $('.modal').filter(".in").attr("data-iframe-id");
                if (iFrameId != undefined)
                    window.frames[iFrameId].contentWindow.ConfirmLeave();
            } else {
                displayBootstrapModalDialog('User Manual', 'md', '300px', true, '../aspx/UserManual.aspx', undefined, function () {

                    $("#iFrameAboutAxpertWeb").contents().find("#btnClose").focus();
                })
            }
            setTimeout(function () { removeUnclickableMenuCssClass() }, 100)
        }

        // function for developer work bench to be called from mainnewpage
        function showWorkBench(adUrl) {           
            if(adUrl!=""){
                doPageUnload = "false";
                // window.open(adUrl);
                var newWindow;
                try {
                    newWindow = window.open(adUrl);
                } catch (ex) {
                    showAlertDialog("warning", appGlobalVarsObject.lcm[356]);
                }
                doPageUnload = "true";
            }
        }

        //check if any Export/Import dialog is opened, if yes show Confirm dialog else display Change password dialog
        function showChangePasswordDialog() {
            var modalExists = $('.modal').filter(".in").attr("data-confirm-leave") === "true";
            if (modalExists) {
                actionsClicked = "Change Password";
                iFrameId = $('.modal').filter(".in").attr("data-iframe-id");
                if (iFrameId != undefined)
                    window.frames[iFrameId].contentWindow.ConfirmLeave();
            } else {
                displayBootstrapModalDialog('Change Password', 'md', '230px', true, '../aspx/cpwd.aspx?remark=chpwd', undefined, ()=>{
                    $("#iFrameChangePassword").css("height", `${Math.ceil($("#iFrameChangePassword")[0].contentWindow.$("form").height())}px`)
                })
            }
            setTimeout(function () { removeUnclickableMenuCssClass() }, 100)
        }

        //check if any Export/Import dialog is opened, if yes show Confirm dialog else display Trace file dialog
        function showTraceFileDialog() {
            var modalExists = $('.modal').filter(".in").attr("data-confirm-leave") === "true";
            if (modalExists) {
                actionsClicked = "Trace File";
                iFrameId = $('.modal').filter(".in").attr("data-iframe-id");
                if (iFrameId != undefined)
                    window.frames[iFrameId].contentWindow.ConfirmLeave();
            } else {
                OpenLogFile();
            }
            setTimeout(function () { removeUnclickableMenuCssClass() }, 100)
        }

        function showElTraceFileDialog(){
            var modalExists = $('.modal').filter(".in").attr("data-confirm-leave") === "true";
            if (modalExists) {
                actionsClicked = "Trace File";
                iFrameId = $('.modal').filter(".in").attr("data-iframe-id");
                if (iFrameId != undefined)
                    window.frames[iFrameId].contentWindow.ConfirmLeave();
            } else {
                OpenExecutionLogFile();
            }
            setTimeout(function () { removeUnclickableMenuCssClass() }, 100)
        }

        function showImportHistoryDialog() {
            displayBootstrapModalDialog('Import History', 'lg', '410px', true, 'iview.aspx?ivname=axpfinhs');
        }

        clearLocalStorage = function (exceptions, contains) {
            contains = contains || false;
            var storage = localStorage
            var keys = [];
            var exceptions = [].concat(exceptions) //prevent undefined

            //get storage keys
            $.each(localStorage, function (key, val) {
                keys.push(key);
            });

            //loop through keys
            for (i = 0; i < keys.length; i++) {
                var key = keys[i]
                var deleteItem = true
                //check if key excluded
                for (j = 0; j < exceptions.length; j++) {
                    var exception = exceptions[j];
                    if (key.indexOf(exception) > -1 && contains) { deleteItem = false; } else if (key == exception) { deleteItem = false; }
                }
                //delete key
                if (deleteItem) {
                    localStorage.removeItem(key)
                }
            }
        }

        function getAppSessionKey() {
            var appSess = "";
            $.ajax({
                type: "POST",
                url: "../WebService.asmx/GetSession",
                cache: false,
                async: false,
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify({ key: 'appsessionkey' }),
                dataType: "json",
                success: function (data) {
                    if (data.d != 'Session does not exist')
                        appSess = data.d;
                },
            });
            return appSess;
        }

        function isLatestSession() {
            //Checking for concurrent user. Returns true if valid session, false if invalid session
            var appSessKey = getAppSessionKey();
            var result = false;
            if (appSessKey == "")
                return false;
            if (nodeApi == "" || mainHomepagews=='true')
                return true;

            var json = {
                "appsession": {
                    "s": mainSessionId,
                    "axpapp": mainProject,
                    "appsessionkey": appSessKey,
                    "username": mainUserName
                }
            };
            var settings = {
                // "Content-Type": "application/json",
                "headers": {
                    "content-type": "application/x-www-form-urlencoded"
                },
                url: callParentNew('mainRestDllPath') + 'ASBDefineRest.dll/datasnap/rest/TASBDefineRest/VerifySessionValidity',
                "method": "POST",
                async: false,
                "data": JSON.stringify(json)
            }
            $.ajax(settings).done(function (response) {
                response = JSON.parse(response);
                if (response.result[0].status === "true") {
                    //ajaxCallObj.getNLSparameter();           
                    result = true;
                }
            });
            return result;
        }

        function updateSessionVar(key, val) {
            $.ajax({
                type: "POST",
                url: "../WebService.asmx/AddSessionPair",
                cache: false,
                async: false,
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify({ key: key, val: val }),
                dataType: "json",
                success: function (data) { },
            });
        }

        function getSessionValue(key) {
            var returnString = "";
            $.ajax({
                type: "POST",
                url: "../WebService.asmx/GetSessionValue",
                cache: false,
                async: false,
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify({ key }),
                        dataType: "json",
                success: function (data) {
                    if (data && data.d) {
                        returnString = data.d;
                    }
                },
            });
            return returnString;
        }


        function checkLastUpdated(lastSec) {
            $.ajax({
                type: "POST",
                url: "../WebService.asmx/CompareLastUpdated",
                cache: false,
                async: false,
                contentType: "application/json;charset=utf-8",
                //data: JSON.stringify({ key: lsdt }),
                dataType: "json",
                success: function (data) {
                    var spentTimeMS;
                    if (lastSec)
                        spentTimeMS = serSessTime;
                    else
                        spentTimeMS = serSessTime - (5 * 60000);
                    var actSpentTimeMS = data.d * 60000;
                    if (spentTimeMS <= actSpentTimeMS) {
                        lastUpdated = true;
                        return true;
                    } else {
                        //pause(excessTime, spentTime - newSessTime);
                        lastUpdated = false;
                        var pendingTimeMS = serSessTime - actSpentTimeMS;
                        var pendingTimeMin = Math.floor((pendingTimeMS / 1000 / 60) << 0);
                        var pauseTime = pendingTimeMin % 5;
                        var pauseTimeMS = pauseTime * 60000;
                        pause(pauseTimeMS, pendingTimeMS - pauseTimeMS)
                        return false;
                    }
                },
            });
        }

        function pause(pauseTime, newSessTimeMS) {

            //neeed to close earlier popup
            if (sessTimePopup != false)
                sessTimePopup.close();
            lastFive = 5;
            if (createFiveMinTimeOut) {
                clearTimeout(createFiveMinTimeOut);
                createFiveMinTimeOut = null;
            }
            if (lastFiveSetTime) {
                clearTimeout(lastFiveSetTime);
                lastFiveSetTime = null;
            }
            setTimeout(function () {
                SessionExpireAlert(newSessTimeMS, false);
            }, pauseTime)
        }

        // function createMobileQRcode(task) {
        //     if ($("#qrCode").data("bs.popover")) {
        //         $("#qrCode").popover('destroy');
        //         $('#qrCode').attr("title", "Mobile QR");
        //         return;
        //     }
        //     if (task === "destroy") {
        //         $('#qrCode').attr("title", "Mobile QR");
        //         return;
        //     }

        //     // $("#qrCode").popover({
        //     //     html: true,
        //     //     trigger: 'manual',
        //     //     placement: "bottom",
        //     //     content: function () {
        //     //         return $("#mainQRcodeWrapper").html();
        //     //     }
        //     // });

        //     $("#qrCode").popover('show');
        // }

        function getSQLHintObj() {
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": nodeApi + "getTstructs",
                "method": "POST",
                "headers": {
                    "content-type": "application/x-www-form-urlencoded"
                },
                "data": {
                    "session_id": mainSessionId,
                    "utl": utl,
                    "rty": userResp,
                    "authorization": nodeAccessToken,
                    "appSKey": appsessionKey
                }
            }

            $.ajax(settings).done(function (response) {
                if (response.status == true) {
                    var data = response.data;
                    if (data) {
                        data.forEach(presData => {
                            const [key, value] = presData;
                            if (!mainSQLhintObj[key]) {
                                mainSQLhintObj[key] = [];
                            }
                            mainSQLhintObj[key].push(value);
                        });

                    }
                } else {
                    console.warn(response);
                }
                // console.log(response);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.warn("Unable to connect to node server");
            });
        }

        function getAXUserPages() {
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": nodeApi + "getPublishedPages",
                "method": "POST",
                "headers": {
                    "content-type": "application/x-www-form-urlencoded"
                },
                "data": {
                    "session_id": mainSessionId,
                    "utl": utl,
                    "rty": userResp,
                    "authorization": nodeAccessToken,
                    "appSKey": appsessionKey,
                    "module": "page"
                }
            }

            $.ajax(settings).done(function (response) {
                let { metaData, data } = response;
                var cachedMetaData = AxUserPagesInfo.metaData;
                if (!cachedMetaData) {
                    cachedMetaData = {};
                    if (metaData) {
                        metaData.forEach(function (element, index) {
                            cachedMetaData[element.name] = index;
                        });
                    }
                }
                if (response.status == true) {
                    AxUserPagesInfo = { data, metaData: cachedMetaData }
                    createPagesForUser();
                } else {
                    AxUserPagesInfo = { metaData: cachedMetaData };
                    createPagesForUser();
                    console.warn(response);
                }
                // console.log(response);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.warn("Unable to connect to node server");
            });
        }

        function createPagesForUser({ calledFrom }) {
        if (calledFrom === "directLink") {
            //if (hasPageBuildAccess) {
            //    $(appGlobalVarsObject._CONSTANTS.axpertUserSettings.axUserOptions.pageBuilderBtn.div).show().data("processed", true);
            //} else {
            //    $(appGlobalVarsObject._CONSTANTS.axpertUserSettings.axUserOptions.pageBuilderBtn.div).hide().data("processed", true);
            //}
            return
        }

        let dropDownHtml = "";

        let { data: pages = [], metaData } = AxUserPagesInfo;

        pages.forEach((page, i) => {
            let title = page[metaData.TITLE];
            let pageId = page[metaData.PAGE_ID];
            dropDownHtml += `<li data-idx=${i} data-pageid=${pageId}><a href="javascript:void(0)" onclick="openUserPage({id:${pageId},template:${page[metaData.TEMPLATE]},title:'${title}'})">${title}</a></li>`
        });
        if (hasPageBuildAccess) {
            if (pages.length) {
                dropDownHtml += `<li class="divider"></li>`;
            }

            dropDownHtml += `<li><a href="javascript:void(0)" onclick="LoadIframe('PageDesigner.aspx');">Page Designer</a></li>`
        }

        $("#AxUserPages ul").html(dropDownHtml);
        if (pages.length !== 0 || hasPageBuildAccess) {
            $("#AxUserPages").show();
        }
    }

    function openUserPage({ id, template, title = "" }) {
    title = title.replace(/\+/g, '&#43').replace(/ /g, "+");
    LoadIframe(`page.aspx?axpage_id=${id}&axpage_t_id=${template}&axpage_title=${title}`);
}

function DoUtilitiesEvent(type) {
    switch (type) {
        case "Responsibilities":
            splitfull();
            LoadIframe('Responsibilities.aspx')
            break;
        case "ImportData":
           // displayBootstrapModalDialog('Import Data', 'lg', '410px', true, '../aspx/ImportNew.aspx', true);
            let myImportModal = new BSModal("ImportData", "Import Data", "<iframe src='../aspx/ImportNew.aspx'  class='vw-100 vh-100'></iframe>", () => {
                //shown callback
                $(".btn-close").focus();
               // $("#btnClose").hide()
            }, () => {
                //hide callback
            });

            myImportModal.changeSize("fullscreen");
            myImportModal.hideFooter();
            myImportModal.modalBody.classList.add("p-0");
            myImportModal.close();

            break;
        case "ExportData":
            //displayBootstrapModalDialog('Export Data', 'lg', '410px', true, '../aspx/ExportNew.aspx?action=export', true);
            let myModal = new BSModal("ExportData", "Export Data", "<iframe src='../aspx/ExportNew.aspx?action=export'   class='vw-100 vh-100'></iframe>", () => {
                //shown callback
                $(".btn-close").focus();
               // $("#btnClose").hide()
            }, () => {
                //hide callback
            });

            myModal.changeSize("fullscreen");
            myModal.hideFooter();
            myModal.modalBody.classList.add("p-0", "overflow-hidden");
            myModal.close();
            break;
        case "ImportHistory":
            displayBootstrapModalDialog('Import History', 'lg', '430px', true, 'iview.aspx?ivname=axpfinhs&importhistory=t', false);
            break;
        case "InMemoryDB":
            //displayBootstrapModalDialog('InMemory DB', 'lg', '440px', true, '../aspx/FastDataUtility.aspx', true);
            displayBootstrapModalDialog('InMemory DB', 'xxl', 'calc(100vh - 50px)', true, 'iview.aspx?ivname=inmemdb', false, removePageHeaders);
            break;
        case "WidgetBuilder":
            splitfull();
            ToogleLeftMenu('dashboardPanel', false, 'Dashboard', 'widgetBuilder.aspx');
            break;
        case "ConfigApp":
            displayBootstrapModalDialog('Global Settings', 'lg', '430px', true, '../aspx/Configuration.aspx', true, false, function () { UnlockConfigApp({ forceUnlock: false }); });
            break;
        case "Download":
            LoadIframe('AppDownload.aspx');
            break;
        case "AxpertLogs":
            displayBootstrapModalDialog('Axpert Logs', 'lg', '430px', true, '../aspx/AxpertLogs.aspx', true);
            break;
        case "Complaint":
            displayBootstrapModalDialog('Complaint', 'lg', '430px', true, '../aspx/Complaint.aspx', true);
            break;
    }
}

//to display import data dialog for any tstruct from iview/tstruct listview(by hyperlink)
function showCustomImportDlg(transid) {
    // displayBootstrapModalDialog('Import Data', 'lg', '410px', true, '../aspx/ImportNew.aspx?transid=' + transid, true);
    let myImportModal = new BSModal("ImportData", "Import Data", "<iframe src='../aspx/ImportNew.aspx?transid=" + transid+"' class='vw-100 vh-100'></iframe>", () => {
        //shown callback
        $(".btn-close").focus();
        // $("#btnClose").hide()
    }, () => {
        //hide callback
    });

    myImportModal.changeSize("fullscreen");
    myImportModal.hideFooter();
    myImportModal.modalBody.classList.add("p-0");
    myImportModal.close();

}

function createNewLeftMenu(menuConfiguration = {}) {
    let menuJson = menuConfiguration.menuJson;

let topMenuHTML = "";
try {

    topMenuHTML = AxCustomMenu({ menuJson })
    }
catch (ex) { }
if (topMenuHTML === "") {
    // $(menuConfiguration.staging.divParent).css("display", "block");
    const { root } = menuJson;
    if (root) {
        let finalHtml = "";
        let { parent: mainParent } = root;
        if (mainParent.length === undefined) {
            mainParent = [mainParent];
        }
        if (menuConfiguration.homePage) {
            mainParent = [JSON.parse(`{"target":"${menuConfiguration.homePage.url}","name":"Home","url":"","level":"0","oname":"","intview":"","icon":"${menuConfiguration.homePage.icon}"}`), ...mainParent]
        }
        mainParent.forEach(child => {
            finalHtml += childHTML({ childObj: child });
        });
        //debugger;
        $(menuConfiguration.staging.div).html(finalHtml);

    }

    function childHTML({ childObj }) {
        let finalHtml = "";
    let { child: childs } = childObj;
    if (childs && childs.length === undefined) {
        childs = [childs];
    }
    if (childs && childs.length) {
        finalHtml += `${menuConfiguration.menuTemplete.menuLi.opener}
                ${menuConfiguration.menuTemplete.menuLi.anchorGenerator(childObj)}
                ${menuConfiguration.menuTemplete.menuUl.opener}
            `;
        childs.forEach(child => {
            finalHtml += childHTML({ childObj: child })
        });
        finalHtml += `${menuConfiguration.menuTemplete.menuUl.closer}${menuConfiguration.menuTemplete.menuLi.closer}`;
        return finalHtml;
    } else {

        return `${menuConfiguration.menuTemplete.functionalLi.opener}
                ${menuConfiguration.menuTemplete.functionalLi.anchorGenerator(childObj, menuConfiguration.listviewAsDefault)}
                    ${menuConfiguration.menuTemplete.functionalLi.closer}`;
    }
}
}


}


function splithorizantal() {

    if ($('.split-btn-vertical i').hasClass('fa-times')) {
        $('.split-btn-vertical i').removeClass('fa-times').addClass('fa-sort');
        splitfull();
        return;
    }


    resetSplitter('horizantal');
    $('.panel-fisrt-part').removeClass('panel-left').addClass('panel-top');
    $('.panel-splitter').removeClass('splitter').addClass('splitter-horizontal');
    $('.panel-second-part').removeClass('panel-right').addClass('panel-bottom');
    $('.split-btn-vertical i').removeClass('fa-sort').addClass('fa-times');
    $('.main-panel-container').removeClass('panel-container').addClass('panel-container-vertical');
    $("#axpiframe").addClass("frameSplited");
    initializeSplitter('horizantal');
}

/**
 * @description Get Split Dimensions based on Configuration
 * @author Prashik + Aarti + Rekha
 * @date 2021-06-23
 * @param {string} [newWidth="1:1:auto" || newWidth="1:1:fixed"]
 * @returns 
 */
function getSplitWidth(newWidth = "1:1:auto") {
    var ratioNumber  = [];

    var splitRatioType = "auto";
    
    try {
        ratioNumber = newWidth.split(":");
        splitRatioType = ratioNumber[2] || splitRatioType;

        if (splitRatioType == "auto" && $("#middle1").data("splitRatio")) {
            $("#middle1").data("splitRatioType", splitRatioType);
            return $("#middle1").data("splitRatio");
        } else {
            $("#middle1").data("splitRatioType", splitRatioType);
        }
    } catch (e) {
        ratioNumber = ["1", "1", "auo"];
        $("#middle1").data("splitRatioType", splitRatioType);
    }
    
    return {split1: Math.floor(parseInt(ratioNumber[0]) / (parseInt(ratioNumber[0]) + parseInt((ratioNumber[1] || (100 - ratioNumber[0])))) * 100), get split2(){return 100 - this.split1 }, splitRatioType };
    }

function resetSplitter(calledFrom) {
    $('.panel-fisrt-part, .panel-splitter, .panel-second-part').show();
    $('.split-btn i').removeClass('fa-times').addClass('fa-sort');
    $('.split-btn-vertical i').removeClass('fa-times').addClass('fa-sort');
    if (calledFrom == "horizantal") {
        $('.panel-fisrt-part,.panel-second-part').css({ height: '50%', width: '100%' });
    } else {
        let split = getSplitWidth(appGlobalVarsObject.splitRatio);

        if (typeof split == "string") {
            $('.panel-fisrt-part').css({ width: split, height: '100%' });
        } else {
            $('.panel-fisrt-part').css({ width: split.split1 + "%", height: '100%' });
            $('.panel-second-part').css({ width:(100 - split.split2 + "%"), height: '100%' });
        }        
    }
}

    function splitvertical() {
        if ($('.split-btn i').hasClass('fa-times')) {
            $('.split-btn i').removeClass('fa-times').addClass('fa-sort');
            splitfull();
            return;
        }

        resetSplitter('vertical')
        $('.panel-fisrt-part').removeClass('panel-top').addClass('panel-left');
        $('.panel-splitter').removeClass('splitter-horizontal').addClass('splitter');
        $('.panel-second-part').removeClass('panel-bottom').addClass('panel-right');
        $('.main-panel-container').removeClass('panel-container-vertical').addClass('panel-container');
        $('.split-btn i').removeClass('fa-sort').addClass('fa-times');
        $("#axpiframe").addClass("frameSplited");
        initializeSplitter('vertical');
    }

    function splitfull() {

        if ($('.split-btn i').hasClass('fa-times'))
            $('.split-btn i').removeClass('fa-times').addClass('fa-sort');
        if ($('.split-btn-vertical i').hasClass('fa-times'))
            $('.split-btn-vertical i').removeClass('fa-times').addClass('fa-sort');
        $('.panel-fisrt-part').css({ width: '100%', height: '100%' });
        $('.panel-second-part, .panel-splitter').hide();
        /*let urlFrom = "";
        if (
            $("#axpiframe").hasClass("frameSplited") &&
            ((($("#middle1")[0].contentWindow.location.href.indexOf("iview.aspx") != -1) && (urlFrom = "href") && true) || ($("#middle1").attr("src").indexOf("iview.aspx") != -1 && (urlFrom = "src") && true)) &&
            findGetParameter("tstcaption", urlFrom == "href" ? $("#middle1")[0].contentWindow.location.href : $("#middle1").attr("src")) != null
        ) {
            isTstructSplited = true;
            $("#middle1")[0].contentWindow.location.href = $("#axpiframe").attr('src');
        }
        $("#axpiframe")[0].contentWindow.location.href = "";*/
        if ($("#axpiframe").hasClass("frameSplited") && $("#middle1").attr("src").indexOf("iview.aspx") != -1 && findGetParameter("tstcaption", $("#middle1").attr("src")) != null) {
            isTstructSplited = true;
            $("#middle1").attr("src", $("#axpiframe").attr('src'));
        }
        $("#axpiframe").attr("src", "");
        $("#axpiframe").removeClass("frameSplited");

    };
    function refreshMenu() {
        try {
            $.ajax({
                type: "POST",
                url: "../WebService.asmx/RefreshMenu",
                cache: false,
                async: false,
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function (data) {
                    if (data.d != "")
                        createMenu(data.d);


                },
            });

        } catch (ex) { }
    }

    function createMenu(xmlMenuData) {
        if (xmlMenuData != "") {
            xmlMenuData = xmlMenuData.replace(/&apos;/g, "'");
            var xml = parseXml(xmlMenuData)
            menuJson = JSON.parse(xml2json(xml, ""));
            appGlobalVarsObject._CONSTANTS.menuConfiguration.menuJson = menuJson;
            try {
                appGlobalVarsObject._CONSTANTS.menuConfiguration.listviewAsDefault = JSON.parse(listviewAsDefault.value);
            } catch (ex) {
            }
            if (!enableTemplatization) {
                appGlobalVarsObject._CONSTANTS.menuConfiguration.menuTemplete = {
                    menuUl: {
                        opener: `<ul class="treeview-menu">`,
                        closer: `</ul>`
                    }, menuLi: {
                        opener: `<li class="treeview">`,
                        closer: `</li>`,
                        anchorGenerator: function (childObj) {
                            return `<a href="javascript:void(0)" title="${childObj.name}">
                                <i class="icon-left-menu fa fa-folder" style="width:22px"></i>
                                <span>${childObj.name}</span>
                                <span class="pull-right-container">
                                <i class="fa fa-angle-down pull-right"></i>
                                </span>
                                </a>`;
                        }
                    }, functionalLi: {
                        opener: `<li class="treeview">`,
                        closer: `</li>`,
                        anchorGenerator: function (childObj) {
                            let iconClass = "";
                            try {
                                iconClass = AxCustomIcon(childObj)
                            }
                            catch (ex) { }
                            if (iconClass === "") {
                                if (childObj.target != undefined && childObj.target != "") {
                                    if (childObj.target.indexOf("tstruct.aspx") > -1) {
                                        iconClass = "fa fa-wpforms";
                                    } else if (childObj.target.indexOf("iview.aspx") > -1 || childObj.target.indexOf("iviewInteractive.aspx") > -1) {
                                        iconClass = "fa fa-table";
                                    }
                                    else {
                                        iconClass = "fa fa-file-text";
                                    }
                                }
                                else {
                                    iconClass = "fa fa-file-text";
                                }
                            }
                            return `<a class="menuList"  href="${childObj.target}" title=" ${childObj.name}" onclick="LoadIframe('${childObj.target}')">
                                <i class="icon-left-menu ${iconClass}" style="width:22px"></i>
                                <span>${childObj.name}</span>
                                </a>`;
                        }
                    }
                }
                createNewLeftMenu(appGlobalVarsObject._CONSTANTS.menuConfiguration);
            } else if (typeof $.axpertUI != "undefined" && appGlobalVarsObject._CONSTANTS.menuConfiguration.menuJson && appGlobalVarsObject._CONSTANTS.menuConfiguration.menuTemplete) {
                // debugger;
                $.axpertUI.leftSideBar.activate({ menuConfiguration: appGlobalVarsObject._CONSTANTS.menuConfiguration });
            }
            //if(appGlobalVarsObject._CONSTANTS.menuConfiguration.menuJson && appGlobalVarsObject._CONSTANTS.menuConfiguration.menuTemplete){
            //createNewLeftMenu(appGlobalVarsObject._CONSTANTS.menuConfiguration);
            // }
        }
        /*var i = 0;
        $(".icon-left-menu").each(function () {
            $(this).css('background-color', colorArray[i]);
            i++;
            if (i == 50) { i = 0 };
        });*/
        //var i = 0;
        //$(".icon-left-menu").each(function () {
        //    $(this).addClass('fa' + " " + iconArray[i]);
        //    i++;
        //    if (i == 16) { i = 0 };
        //});
    }

    function OpenOnPropertyBase(UrlToOpen, iframeId = "#axpiframe") {
        if ($(iframeId).hasClass("frameSplited") === false)
            splitvertical();
        $("#divaxpiframe").css("display", "block");
        $(iframeId).css("display", "block");
        if(UrlToOpen.indexOf("&AxSplit")==-1)
            UrlToOpen+="&AxSplit=true";
        GetProcessTime();
        // $(iframeId).attr('src', UrlToOpen+"&hdnbElapsTime="+ callParentNew("browserElapsTime"));
        try {
            $(iframeId)[0].contentWindow.location.href = UrlToOpen+"&hdnbElapsTime="+ callParentNew("browserElapsTime");
        } catch (ex) {}
    }

    function assocateIframe(directSplit) {
        let splitAsIview = false;
        if ($("#middle1").contents().find("#Panel1").length <= 0) {
            return;
        }

        let srcmiddle1 = frames['middle1'].window.location.href;
        if (window.navigator.userAgent.indexOf('MSIE ') != -1 || window.navigator.userAgent.indexOf('Trident/') != -1)
            srcmiddle1 = middle1URL || $("#middle1").attr('src').toLowerCase();

        if ($("#axpiframe").hasClass("frameSplited") === false) {
            if (srcmiddle1 != undefined && srcmiddle1 != "") {
                let srcmiddle1new = "";

                if (srcmiddle1.indexOf("tstruct.aspx") != -1) {
                    srcmiddle1new = srcmiddle1.replace("tstruct", "iview");
                    srcmiddle1new = srcmiddle1new.replace("transid", "ivname");
                    try {
                        srcmiddle1new += ("&tstcaption=" + $($("#middle1")[0].contentWindow.document).find("#breadcrumb-panel div.bcrumb span").text());
                    } catch (ex) { }
                }
                else if (srcmiddle1.indexOf("listiview.aspx") != -1) {
                    srcmiddle1new = srcmiddle1.replace("listiview", "tstruct");
                    srcmiddle1new = srcmiddle1new.replace("tid", "transid");
                }
                else if (srcmiddle1.indexOf("iview.aspx") != -1 || srcmiddle1.indexOf("ivtoivload.aspx") != -1) {
                    let key = $("#middle1").contents().find("#hdnKey").val();
                    try {
                        $.ajax({
                            type: "POST",
                            url: "../WebService.asmx/GetAssociatedTstruct",
                            data: JSON.stringify({ key: key }),
                            cache: false,
                            async: false,
                            contentType: "application/json;charset=utf-8",
                            dataType: "json",
                            success: function (data) {
                                if (data.d)
                                    srcmiddle1new = "tstruct.aspx?transid=" + data.d + `&openerIV=${data.d}&isIV=false`;

                                else if (srcmiddle1.indexOf("ivtoivload.aspx") != -1 || srcmiddle1.indexOf("iview.aspx") != -1) {
                                    //var middleGridview = $("#middle1").contents().find("#GridView1 a:first");
                                    var middleGridview;
                                    try {
                                        middleGridview = $(`<div>${$("#middle1", parent.document)[0].contentWindow.clickOnDemand($("#middle1", parent.document).contents().find("#GridView1 a:first"), false)}</div>`).find("a[data-url]:first");
                                    } catch (ex) {
                                        middleGridview = $("#middle1", parent.document).contents().find("#GridView1 a:first");
                                    }
                                    if (middleGridview != undefined && middleGridview.length > 0) {
                                        if (middleGridview.data("url") != undefined)
                                            srcmiddle1new = middleGridview.data("url");
                                        else if(middleGridview.attr("onclick").indexOf("clickOnDemand(") == 0){
                                            try {
                                                var dataURL = $(`<div>${$("#middle1", parent.document)[0].contentWindow.clickOnDemand(middleGridview, false)}</div>`).find("a[data-url]:first").data("url");

                                                if(dataURL){
                                                    srcmiddle1new = dataURL;
                                                }                                                
                                            } catch (ex) {}
                                        }
                                        else {
                                            var ivLink = ""; var isHref = false;
                                            if (middleGridview.attr("onclick") != undefined)
                                                ivlink = middleGridview.attr("onclick");
                                            else if (middleGridview.attr("href") != undefined) {
                                                ivlink = middleGridview.attr("href");
                                                isHref = true;
                                            }

                                            let isIviewtoIview = ivlink.replace("javascript:", "").replace(new RegExp("'", 'g'), "").split(",");
                                            if (isIviewtoIview != undefined && isIviewtoIview != "" && isIviewtoIview[0].indexOf("OpenIviewFromIv") != -1) {
                                                frames[0].window.OpenIviewFromIv(isIviewtoIview[0].replace("OpenIviewFromIv(", ""), isIviewtoIview[1], isIviewtoIview[2], "split");
                                                splitAsIview = true;
                                            }
                                            else if (isIviewtoIview[0].indexOf("OpenIviewFromIv") == -1 && isHref == true) {
                                                try {
                                                    var url = isIviewtoIview[0].substr(0, isIviewtoIview[0].indexOf("?"));
                                                    var params = isIviewtoIview[0].substr(isIviewtoIview[0].indexOf("&"));;
                                                    var ivName = isIviewtoIview[0].substr(isIviewtoIview[0].indexOf("=") + 1, 5);
                                                    frames[0].window.LoadTstFrmIview(url, params, ivName, "split");
                                                    // OpenOnPropertyBase(isIviewtoIview[0]);
                                                } catch (ex) { }
                                                splitAsIview = true;
                                            }
                                        }
                                    }
                                }
                            },
                        });

                    } catch (ex) { }

                }
                else if (srcmiddle1.indexOf("ivtstload.aspx") != -1) {
                    srcmiddle1new = srcmiddle1.replace("ivtstload", "listiview");
                    srcmiddle1new = srcmiddle1new.replace("tstname", "tid");
                }


                if (srcmiddle1new != undefined && srcmiddle1new != "") {
                    if (srcmiddle1new.indexOf("listiview.aspx") != -1) {
                        srcmiddle1new = srcmiddle1new.replace("listiview.aspx", "iview.aspx");
                        srcmiddle1new = srcmiddle1new.replace("?tid", "?ivname");
                        try {
                            srcmiddle1new += ("&tstcaption=" + $($("#middle1")[0].contentWindow.document).find("#breadcrumb-panel div.bcrumb span").text());
                        } catch (ex) { }
                    }
                    $("#divaxpiframe").css("display", "block");
                    $("#axpiframe").css("display", "block");
                    $("#axpiframe").addClass("frameSplited");

                    if (srcmiddle1.indexOf("tstruct.aspx") != -1) {
                        $("#axpiframe")[0].contentWindow.location.href = srcmiddle1+"&AxSplit=true";
                        $("#middle1")[0].contentWindow.location.href = srcmiddle1new+"&AxSplit=true";
                    }
                    else {
                        $("#axpiframe")[0].contentWindow.location.href = srcmiddle1new+"&AxSplit=true";
                    }

                    if (directSplit)
                        splitvertical();
                }
                else if (splitAsIview) {
                    $("#divaxpiframe").css("display", "block");
                    $("#axpiframe").css("display", "block");
                    splitvertical();
                    return;
                }
                else {
                    // $("#axpiframe").attr('src', "");
                    $("#axpiframe")[0].contentWindow.location.href = "about:blank";
                    //if (directSplit)
                    //    splitvertical();
                }


            } else {
                splitfull();
                return;
            }
        }

    }

    function hideSplitButtons() {
        $(".split-btn").addClass("hide")
        $(".split-btn-vertical").addClass("hide");
    }

    function unhideSplitButtons() {
        $(".split-btn").removeClass("hide")
        $(".split-btn-vertical").removeClass("hide");
    }

    function updateAppLinkObj(url, forceUnBlock = 0, isSplitFrame = false) {
        var isCustomURL = -1;
        try {
            isCustomURL = AxCustomLinks(url)
        }
        catch (ex) {

        }
        var tempSubDirectoryArray = window.location.pathname.toLowerCase().split("/");
        var tempSubDirectory = (tempSubDirectoryArray.slice(0, (tempSubDirectoryArray.indexOf("aspx") > -1 ? tempSubDirectoryArray.indexOf("aspx") : tempSubDirectoryArray.length)).reduce(function (joined, val) {
            if (val && joined == "")
                return joined + val;
            else
                return joined;
        }, "") || "");
        if (isCustomURL > -1)
            url = "../" + mainProject + url.substr(url.indexOf('/aspx/'));
        else if (url.toLowerCase().indexOf(tempCustomProjPath = (window.location.origin.toLowerCase() + "/" + tempSubDirectory + (tempSubDirectory && "/") + thmProj.toLowerCase() + "/aspx/")) > -1) {
            url = "../" + url.substr(url.toLowerCase().indexOf("/" + thmProj.toLowerCase() + "/aspx/") + 1);
        }
        else if (url.indexOf("/aspx/") > -1)
            url = url.substr(url.indexOf('/aspx/') + 6);
        var blockHistory = ["mainnew.aspx", "ivtstload.aspx", "ivtoivload.aspx", "err.aspx", "adminconsole.aspx", "configurationStudio.aspx"];
        if (!forceUnBlock && blockHistory.filter((val) => (url.indexOf('/aspx/') > -1 ? (url.substr(url.indexOf('/aspx/') + 6) == val) : (url.indexOf(val) > -1))).length > 0) {
            if (appLinkHistory.length > 1 && (typeof navigationshow=="undefined" || navigationshow=="true")) {
                $(appGlobalVarsObject._CONSTANTS.navigation.backButton.div).show();
            }
            histListFlag = false;
            return false;
        }

        // check the same url eg : page reload.
        if (appLinkHistory[appLinkHistory.length - 1] == url) {
            if (appLinkHistory.length > 1 && (typeof navigationshow=="undefined" || navigationshow=="true")) {
                $(appGlobalVarsObject._CONSTANTS.navigation.backButton.div).show();
            }
            if (appLinkHistory.length - 1 > curPageIndex) {
                curPageIndex++;
            }
            histListFlag = false;
            return false;
        }

        //if (findGetParameter("ivname", appLinkHistory[appLinkHistory.length - 1]) === (thisIvName = findGetParameter("ivname", url)) && thisIvName) {
        if (findGetParameter("ivname", appLinkHistory[curPageIndex]) === (thisIvName = findGetParameter("ivname", url)) && thisIvName) {
            if (appLinkHistory.length > 1 && (typeof navigationshow=="undefined" || navigationshow=="true")) {
                $(appGlobalVarsObject._CONSTANTS.navigation.backButton.div).show();
            }

            if((thisAxIvNav = findGetParameter("AxIvNav", url)) && thisAxIvNav == "true"){
                appLinkHistory[curPageIndex] = url;
            }

            prevClickFlag = nextClickFlag = histListFlag = false;

            return false;
        }

        // check for history List 
        if (histListFlag) {
            prevClickFlag = nextClickFlag = histListFlag = false;
            return false;
        }
        // check for Navigation link
        if (prevClickFlag) {
            prevClickFlag = nextClickFlag = histListFlag = false;
            return false;
        }
        // check for Navigation link
        if (nextClickFlag) {
            nextClickFlag = prevClickFlag = histListFlag = false;
            return false;
        }
        if (isSplitFrame && $("#axpiframe").hasClass("frameSplited")) {
            return false;
        }
        if (url) {
            if (appLinkHistory.length == 0) {
                appLinkHistory.push(url);
                if (appLinkHistory.length > 1 && (typeof navigationshow=="undefined" || navigationshow=="true")) {
                    $(appGlobalVarsObject._CONSTANTS.navigation.backButton.div).show();
                }
                if (menuLabel) {
                    appLinkHistoryLabel.push(menuLabel);
                } else {
                    if (isCustomURL === 1)
                        appLinkHistoryLabel.push(updateHisLabel(url.substr(url.indexOf('/aspx/') + 6)));
                    else
                        appLinkHistoryLabel.push(updateHisLabel(url));
                }
                return false;
            }
            if (appLinkHistory.length - 1 == curPageIndex) {
                appLinkHistory.push(url);
                if (appLinkHistory.length > 1 && (typeof navigationshow=="undefined" || navigationshow=="true")) {
                    $(appGlobalVarsObject._CONSTANTS.navigation.backButton.div).show();
                }
                curPageIndex = appLinkHistory.length - 1;
                $('.linkNext').addClass('linkGray');
                if (menuLabel) {
                    appLinkHistoryLabel.push(menuLabel);
                    menuLabel = "";
                } else {
                    if (isCustomURL === 1)
                        appLinkHistoryLabel.push(updateHisLabel(url.substr(url.indexOf('/aspx/') + 6)));
                    else
                        appLinkHistoryLabel.push(updateHisLabel(url));
                }
            } else {
                if (appLinkHistory[curPageIndex] === url) {
                    return false;
                }
                curPageIndex = curPageIndex + 1;
                if (!(findGetParameter("ivname", appLinkHistory[curPageIndex]) === (thisIvName = findGetParameter("ivname", url))) || (thisIvName == null)) {
                    appLinkHistory.splice(curPageIndex, 0, url);
                }
                if (appLinkHistory.length > 1 && (typeof navigationshow=="undefined" || navigationshow=="true")) {
                    $(appGlobalVarsObject._CONSTANTS.navigation.backButton.div).show();
                }
                if (menuLabel) {
                    appLinkHistoryLabel.splice(curPageIndex, 0, menuLabel);
                } else {
                    if (appLinkHistory.length == curPageIndex) {
                        if (isCustomURL === 1)
                            appLinkHistoryLabel.push(updateHisLabel(url.substr(url.indexOf('/aspx/') + 6)));
                        else
                            appLinkHistoryLabel.push(updateHisLabel(url));
                    } else {
                        if (isCustomURL === 1)
                            appLinkHistoryLabel.splice(curPageIndex, 0, updateHisLabel(url.substr(url.indexOf('/aspx/') + 6)));
                        else
                            appLinkHistoryLabel.splice(curPageIndex, 0, updateHisLabel(url));
                    }

                }

                //appLinkHistory.push(url);
                //if(appLinkHistory.length > 1){
                //$(appGlobalVarsObject._CONSTANTS.navigation.backButton.div).show();
                //}
            }
        }
        // curPageIndex = appLinkHistory.length-1;
        if (curPageIndex <= 0) {
            $('.linkPrev').addClass('linkGray');
            $('.linkNext').addClass('linkGray');
        } else {
            $('.linkPrev').removeClass('linkGray');
            $('.linkPrev').data('index', curPageIndex - 1).data('url', appLinkHistory[curPageIndex - 1]);
        }
        updateHistList();
        menuLabel = "";
        return false;
    }

        function updateHisLabel(url) {
            // iview.aspx?ivname=actptniv
            // tstruct.aspx?act=load&transid=wipad&recordid=1431110000848
            var str2 = "iview.aspx";
            var str3 = "tstruct.aspx";
            if (url.indexOf(str2) != -1 || url.toLowerCase().indexOf("ivtoivload.aspx") != -1) {
                // For Iview  

                var childPT = $('#middle1').contents().find('div#breadcrumb-panel').find('.bcrumb').find('.tstivCaption').text();
                if (findGetParameter("tstcaption", url) != null) {
                    childPT += " - Listview";
                }
                childPT = (url.indexOf(str2) > 0) ? childPT + " - " + url.slice(0, url.indexOf(str2)) : childPT;
                return (childPT) ? childPT : 'Title Not Found';
            } else if (url.indexOf(str3) != -1) {
                // For Tstruct
                var iFrameContents = $('#middle1').contents();
                var childPV = iFrameContents.find('input[type=text],textarea,select').filter(':visible:first');
                if (childPV && $.trim(childPV.val()) != "") {
                    childPT = " - " + childPV.val();
                } else {
                    var getChildLabel1 = getChildLabel(url);
                    if (getChildLabel1 != "") {
                        childPT = getChildLabel1;
                    } else {
                        childPT = " - New";
                    }
                }
                //var childPT = (childPV && $.trim(childPV.val()) != "") ? " - " +childPV.val(): " - New";
                return iFrameContents.find('div#breadcrumb-panel').find('.bcrumb').find('.tstivCaption').text() + childPT;
            } else if (url.indexOf('listIview.aspx') != -1) {
                var iFrameContents = $('#middle1').contents();
                return iFrameContents.find('div#breadcrumb-panel').find('.bcrumb').find('.tstivCaption').text() + ' - listview';
            } else {
                return url.slice(0, url.indexOf('.aspx'));
            }
        }

        function getChildLabel(url) {

            var spliturl = url.split('?');
            var urlparams = spliturl[1].split('&');
            var keyValue, childPT = '';
            for (var i = 0; i < urlparams.length; i++) {
                if (urlparams[i]) {
                    keyValue = urlparams[i].split('=');
                    if (keyValue[0] == 'recordid') {
                        childPT = keyValue[1];
                    }
                    if (keyValue[0] == 'theMode') {
                        childPT = childPT + ' - ' + keyValue[1];
                    }
                }
            }
            return childPT;
        }

        function updateHistList() {
            var histLi = "";
            var appLinkHLCount = appLinkHistoryLabel.length;
            var removeDuplicate = [];
            for (var i = appLinkHLCount - 1; i >= 0; --i) {
                if ($.inArray(appLinkHistory[i], removeDuplicate) === -1) {
                    removeDuplicate.push(appLinkHistory[i]);
                    histLi += '<li class="histLi histLi' + i + '" title="' + appLinkHistoryLabel[i] + '" onclick="histListFlag = true; LoadIframe(\'' + appLinkHistory[i] + '\')"> <a href="javascript:void(0);" style="text-decoration: none;">' + appLinkHistoryLabel[i] + '</a></li>';
                }
            }
            if (appLinkHistoryLabel.length >= 10) {
                histLi += '<li class="clearHisItem">Clear List</li>';
            }
            $(appGlobalVarsObject._CONSTANTS.history.staging.div).html(histLi);
        }

        function updateLinks(that, calledFrom) {
            prevClickFlag = nextClickFlag = false;
            var curIndex = that.data('index');
            var curURL = that.data('url');
            console.log('Next Link');
            var index;


            if (curIndex == 0) {
                $('.linkPrev').addClass('linkGray');
            }

            if (appLinkHistory.length - 1 == curIndex) {
                $('.linkNext').addClass('linkGray');
            }

            if (calledFrom == 'next') {
                curPageIndex++;
                index = curIndex + 1;
                nextClickFlag = true;
            } else {
                curPageIndex--;
                index = curIndex - 1;
                prevClickFlag = true;
            }



            that.data('index', index).data('url', appLinkHistory[index]);
            if (calledFrom == 'next') {
                $('.linkPrev').data('index', curPageIndex - 1).data('url', appLinkHistory[curPageIndex - 1]);
                $('.linkPrev').removeClass('linkGray');
            } else {
                $('.linkNext').data('index', curPageIndex + 1).data('url', appLinkHistory[curPageIndex + 1]);
                $('.linkNext').removeClass('linkGray');
            }

            //console.log('linkPrev == ',$('.linkPrev').data('index'));
            // console.log(curPageIndex);
            // console.log('linkNext == ',$('.linkNext').data('index'));
            menuLabel = "";
            isBackClicked = true;
            LoadIframe(appLinkHistory[curPageIndex]);
            if (curPageIndex == 0) {
                $(appGlobalVarsObject._CONSTANTS.navigation.backButton.div).hide();
            }
        }

        $(document).on('click', 'li.clearHisItem', function () {
            appLinkHistoryLabel = [];
            appLinkHistory = [];
            $(appGlobalVarsObject._CONSTANTS.navigation.backButton.div).hide();
            updateHistList();
            curPageIndex = 0;
            prevClickFlag = nextClickFlag = false;
            $('.linkPrev').addClass('linkGray');
            $('.linkNext').addClass('linkGray');
        });

        //Add for autosplit
        function autoSplitWindow() {
            let srcmiddle1 = frames['middle1'].window.location.href;
            if (srcmiddle1 != undefined && srcmiddle1 != "") {
                let srcmiddle1new = "";

                if (srcmiddle1.indexOf("tstruct.aspx") != -1) {
                    srcmiddle1new = srcmiddle1.replace("tstruct", "listiview");
                    srcmiddle1new = srcmiddle1new.replace("transid", "tid");
                }

            }
        }

        function initializeSplitter(calledsplitter) {
            $(".panel-fisrt-part").customResizable("destroy");
            if (calledsplitter == 'horizantal') {
                $(".panel-fisrt-part").customResizable({
                    handleSelector: ".splitter-horizontal",
                    resizeWidth: false,
                    onDragEnd: resizeEventForSplitter
                });
            } else {
                $(".panel-fisrt-part").customResizable({
                    handleSelector: ".splitter",
                    resizeHeight: false,
                    onDragEnd: resizeEventForSplitter
                });
            }
        
            function resizeEventForSplitter(e, $el, opt) {
                if ($("#axpiframe").is(":visible") && (!$("#middle1").data("splitRatioType") || $("#middle1").data("splitRatioType") == "auto")) {
                    $("#middle1").data("splitRatio", $("#middle1").css("width"));
                }
            }
        }
        function cloudSetupInit() {
            var glType = gllangType;
            var isRTL = false;
            var styleObj = {};
            if (glType == "ar") {
                isRTL = true;
                styleObj = { "color": "#fff", "opacity": "1", "position": "absolute", "top": "10px", "left": "20px" };
            }
            else {
                isRTL = false;
                styleObj = { "color": "#fff", "opacity": "1", "position": "absolute", "top": "10px", "right": "20px" };
            }
            $("#divModalCompanySetUp .modal-content .modal-body").css({ "padding": "0px" });
            $("#divModalCompanySetUp .modal-content .modal-header").hide();
            $("#divModalCompanySetUp .modal-content .modal-body").prepend($("#divModalCompanySetUp .modal-content #btnModalClose").detach());
            $("#divModalCompanySetUp .modal-content #btnModalClose").css(styleObj);

            $("#divModalCompanySetUp .modal-dialog").removeClass("modal-lg").css("width", "80%");
            $(callParentNew("iFrameCompanySetUp")).contents().find("#heightframe").css("cssText", "height:calc(100vh - 100px)!important");
            $(callParentNew("iFrameCompanySetUp")).on("load", function () {
                $(callParentNew("iFrameCompanySetUp")).contents().find("#heightframe").css("cssText", "height:calc(100vh - 100px)!important");
            });
            $("#divModalCompanySetUp .close").css("display", "none");
        }

        function loginToNodeAPI() {
            if (nodeApi) {
                //for getting nodeAccess token
                var settings = {
                    "async": false,
                    "crossDomain": true,
                    "url": nodeApi + "login",
                    "method": "POST",
                    "headers": {
                        "content-type": "application/x-www-form-urlencoded"
                    },
                    "data": {
                        "session_id": mainSessionId,
                        "utl": utl,
                        "username": mainUserName,
                        "appSKey": getAppSessionKey(),//appsessionKey,
                        "projName": mainProject,
                        "sPath": mainRestDllPath
                    }
                }

                $.ajax(settings).done(function (response) {
                    if (response.status == true) {
                        const middle1Window = $('#middle1')[0].contentWindow;
                        if (middle1Window) {
                            const { isHomeLoadStatus } = middle1Window;
                            if (isHomeLoadStatus) {
                                resetLeftMenu();
                            }
                        }


                        nodeAccessToken = response.data.access_token || '';

                        //getAXUserPages(); //currently not showing user pages in dropdown @manikanta
                        createPagesForUser({ calledFrom: "directLink" })

                        try {
                            $.ajax({
                                type: "POST",
                                url: "../WebService.asmx/SetNodeApineeds",
                                cache: false,
                                async: false,
                                contentType: "application/json;charset=utf-8",
                                data: JSON.stringify({ key: "nodeAccessToken", val: nodeAccessToken }),
                                dataType: "json",
                                success: function (data) {

                                },
                            });
                        } catch (e) { }
                        // getSQLHintObj();

                        /* var dashSettings = {
                             "async": true,
                             "crossDomain": true,
                             "url": nodeApi + "checkDashboard",
                             "method": "POST",
                             "headers": {
                                 "content-type": "application/x-www-form-urlencoded"
                             },
                             "data": {
                                 "session_id": mainSessionId,
                                 "utl": utl,
                                 "rty": userResp,
                                 "authorization": nodeAccessToken,
                                 "appSKey": appsessionKey
                             }
                         }
         
                         $.ajax(dashSettings).done(function (response) {
                             if (response.status == true) {
                                 if (response.data > 0) {
                                     $("#liDashBoardIcon").show();
                                 } else {
                                     $("#liDashBoardIcon").hide();
         
                                 }
                             } else {
                                 valSessByApi(response);
                                 showAlertDialog("error", response.errMsg);
                             }
                             // console.log(response);
                         }).fail(function (jqXHR, textStatus, errorThrown) {
                             showAlertDialog("error", 1000, "client");
                         });*/


                    }
                    // console.log(response);
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    showAlertDialog("error", 1000, "client");
                });
            }
        }

        function AdminConsoleOpenMenu(){

            let myModal = new BSModal("AdminConsole", "Admin Console", "<iframe src='../aspx/adminconsole.aspx' class='vw-100 vh-100' ></iframe>", () => {
                //shown callback
            }, () => {
                //hide callback
            });

            myModal.changeSize("fullscreen");
            myModal.hideFooter();
            myModal.hideHeader();
            myModal.modalBody.classList.add("p-0", "overflow-hidden");
            myModal.showFloatingClose();
        }

        function OpenConfigurationStudio(){

            let myModal = new BSModal("configStudio", "Axpert Configuration Studio", "<iframe src='../aspx/configurationStudio.aspx' class='vw-100 vh-100' ></iframe>", () => {
                //shown callback
            }, () => {
                //hide callback
            });

            myModal.changeSize("fullscreen");
            myModal.hideFooter();
            myModal.hideHeader();
            myModal.modalBody.classList.add("p-0", "overflow-hidden");
            myModal.showFloatingClose();
        }

        function AdminConsoleHidemenu()
        {
            $(callParentNew("mainNewPageBody")).removeClass("overlay-open");
            $(callParentNew("appBackBtn", "class")).hide();
            //$(".fullTempleteWrapper .search-bar").css('display', 'none');
        }

        function ExitAdminconsole() {
            $(callParentNew("mainNewPageBody")).addClass("overlay-open");
            if(typeof loadFrame!="undefined")
                loadFrame();
            if ($.axpertUI?.cardsPage?.options?.setCards) {            
                $.axpertUI.cardsPage.activate("loadhomepage");
                resetMainPageUI();
                // return false;
            } else {
                $("#middle1").attr("src", $("#hdHomeUrl").val());
            }
        }

function updateCompressedmode(option) {
    var appUrl = top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/"));
    if (typeof (storage) != undefined)
        window.localStorage.setItem("compressedMode-" + appUrl, option);
    appGlobalVarsObject._CONSTANTS.compressedMode = option;
    appGlobalVarsObject.methods.toggleCompressModeUI($('body'));
}

function fixUnloadOnWindowSelfDownloads(curWin) {
    curWin.onbeforeunload = function () {
        curWin.onbeforeunload = BeforeWindowClose;
    };
}

//notification
function Notificationhyperlink1(data) {
    // var myJSON = JSON.stringify(data)
    try {
        let thisMessageNode = JSON.parse(notifyJsonOldobj).filter(obj => obj.keyId == data)[0].data;
        if(thisMessageNode.indexOf("*$*") != -1){
            thisMessageNode.split("*$*").forEach(obj => {
                obj = JSON.parse(obj);
                if (obj.command) {
                    AssignLoadValues(JSON.stringify(obj), "Action", "");

                }
            });
        }else{
            let jsonMsg = JSON.parse(thisMessageNode);
            // let message = jsonMsg.msg.filter(msg => msg.message)[0].message;
            // let keyId = eachjsonvalue.keyId;
            let iviewName = jsonMsg.msg.filter(msg => msg.loaddata)[0].loaddata;
            LoadIframe(`ivtoivload.aspx?ivname=${iviewName}&redisLoadKey=${data}`);
        }
    } catch (error) {

    }

}

////message to show in notifications

function showNotificationMessage(message) {

    var notifyMessage;
    var notifyJsonarr = [];
    var OldjsonObj = notifyJsonOldobj != "" ? JSON.parse(notifyJsonOldobj) : [];
    var newjsonObj = JSON.parse(message);

    var oldKey = OldjsonObj.map(key => key.keyId);
    var newKey = newjsonObj.map(key => key.keyId)

    if ((oldKey.length == newKey.length) && oldKey.every(function (element, index) { return element === newKey[index]; })) {
        return;
    }
    else {
        Object.keys(newjsonObj).forEach(data => {
            if (oldKey.indexOf(newjsonObj[data].keyId) == -1) {

                notifyJsonarr.push(newjsonObj[data]);
            }
        });
        for (var i = 0; i < notifyJsonarr.length; i++) {
            var eachjsonvalue = notifyJsonarr[i];

            let timeMsg = eachjsonvalue.keyId
            if(eachjsonvalue.data.indexOf("*$*") != -1){
                let messages = eachjsonvalue.data.split("*$*");
                messages.forEach(msg => {
                    let jsonMsg = JSON.parse(msg);
                    if (jsonMsg.command) {
                        commandVal = jsonMsg.command[0].cmdval.toString();
                        fullcommandmsg = msg;
                        // fullcommandmsg = JSON.parse(fullcommandmsg);
                    }
                    if (jsonMsg.message) {
                        msgToshow = jsonMsg.message[0].msg;
                        genericNotiicationcreation(msgToshow, fullcommandmsg, timeMsg);

                    }
                });
            }else{
                try{
                    let jsonMsg = JSON.parse(eachjsonvalue.data);
                    let message = jsonMsg.msg.filter(msg => msg.message)[0].message;
                    let keyId = eachjsonvalue.keyId;

                    genericNotiicationcreation(message, JSON.stringify(jsonMsg), keyId);
                }catch(ex){}

                // if (jsonMsg.command) {
                //     commandVal = jsonMsg.command[0].cmdval.toString();
                //     fullcommandmsg = msg;
                //     // fullcommandmsg = JSON.parse(fullcommandmsg);
                // }
                // if (jsonMsg.message) {
                //     msgToshow = jsonMsg.message[0].msg;
                //     genericNotiicationcreation(msgToshow, fullcommandmsg, timeMsg);

                // }
            }
            notifyJsonOldobj = message;
        }
    }

    // }
}

function genericNotiicationcreation(msgToshow, JsonFullcomand, timeMsg) {
    var $panel = $("#notificationPanel");
    var notifyHyperlinkjson = "";
    var notifymsgToshow = "";
    if (JsonFullcomand) {

        notifymsgToshow = msgToshow.split("`");
        if(notifymsgToshow.length > 1)
            notifymsgToshow = notifymsgToshow[1];
        else
            notifymsgToshow = notifymsgToshow[0];

        notifyHyperlinkjson = JsonFullcomand.replace(/"/g, "\\\"");

        // notifymessage = "<a href='javascript:void(0);'  onclick='Notificationhyperlink1(" + timeMsg + ");' style='color:white;'>" + notifymsgToshow + "</a>";
        notifymessage = "<a href='javascript:void(0);'  onclick='Notificationhyperlink1(" + timeMsg + ");'>" + notifymsgToshow + "</a>";
    }
    else
        notifymessage = notifymsgToshow;

    setTimeout(function () {
        // $.bootstrapGrowl(notifymessage, {
        //     type: 'info',
        //     offset: { from: 'top', amount: 80 },
        //     align: 'right',
        //     width: 300,
        //     stackup_spacing: 30,
        //     allow_dismiss: false
        // });
        showAlertDialog("info", notifymessage);
    }, 0);

    // $("#notificationbar").find(".demo-settings").show();
    // if (JsonFullcomand) {
        // $("#notificationbar").find(".demo-settings").prepend("<div class =\"notificationtabs\"><span class=\"close\"  id='" + timeMsg + "' onclick=\"DeletenotifyDiv(this)\">&times;</span><a href=\"javascript:void(0)\"  onclick=\"Notificationhyperlink1(" + timeMsg + ");\" id=\"settingsGeneral\">" + notifymsgToshow + "</a><div class=\"clearfix\" ></div></div>");
        $("#notificationbar").find(".demo-settings").prepend(`
        <div class="d-flex align-items-center bg-hover-lighten py-3 px-9">
            <div class="symbol symbol-40px symbol-circle me-5">
                <span class="symbol-label">
                    <span class="material-icons material-icons-style material-icons-primary material-icons-1">
                        notifications
                    </span>
                </span>
            </div>
            <div class="mb-1 pe-3 flex-grow-1">
                <a id="settingsGeneral" ${JsonFullcomand ? `href="javascript:void(0);" onclick="Notificationhyperlink1(${timeMsg});"` : ``} class="settingsGeneral fs-6 text-dark text-hover-primary fw-bold d-flex flex-row-fluid">${notifymsgToshow}</a>
            </div>
            <div id='${timeMsg}' class="btn btn-icon text-hover-primary w-10px h-10px" onclick="DeletenotifyDiv(${JsonFullcomand ? `this` : ``})">
                <div class="material-icons material-icons-style material-icons-4">
                    close
                </div>
            </div>
        </div>
        `);

    // }

    // else {
    //     $("#notificationbar").find(".demo-settings").prepend("<div class =\"notificationtabs\"><span class=\"close\" id='" + timeMsg + "' onclick=\"DeletenotifyDiv()\">&times;</span><p id=\"settingsGeneral\">" + notifymsgToshow + "</p><div class=\"clearfix\"></div></div>");
    //     $("#notificationbar").find(".demo-settings").prepend(`
    //     <div class="d-flex align-items-center bg-hover-lighten py-3 px-9">
    //         <div class="symbol symbol-40px symbol-circle me-5">
    //             <span class="symbol-label">
    //                 <span class="material-icons material-icons-style material-icons-primary material-icons-1">
    //                     notifications
    //                 </span>
    //             </span>
    //         </div>
    //         <div class="mb-1 pe-3 flex-grow-1">
    //             <a href="javascript:void();" class="fs-6 text-dark text-hover-primary fw-bold d-flex flex-row-fluid">Excel Exported</a>
    //         </div>
    //         <div class="btn btn-icon text-hover-primary w-10px h-10px">
    //             <div class="material-icons material-icons-style material-icons-4">
    //                 close
    //             </div>
    //         </div>
    //     </div>
    //     `);
    // }

    // var notifyCount = $("#notifycount a").length + $("#notifycount p").length;
    var notifyCount = $("#notifycount .settingsGeneral").length;

    if (notifyCount > 0) {
        $panel?.find(".blinker")?.removeClass("d-none");
    //     if ($("#notifyCountcheck").is(':visible')) {
    //         $("#notifyCountcheck").text(notifyCount);
    //     }
    //     else {
    //         $("#notifyCountcheck").show();
    //         $("#notifyCountcheck").text(notifyCount);
    //     }

    }else{
        $panel?.find(".blinker")?.addClass("d-none");
    }

    // if ($('.right-notificationbar').hasClass('open'))
    //     $("#notifyCountcheck").hide();
}

function DeletenotifyDiv(e) {

    e.parentElement.style.display = 'none';
    e.parentElement.remove();
    notifydividentifier = e.getAttribute("id");

    try {
        $.ajax({
            url: 'mainnew.aspx/delNotificiationKeyfromRedis',
            type: 'POST',
            cache: false,
            async: true,
            data: JSON.stringify({
                key: notifydividentifier,
            }),
            dataType: 'json',
            contentType: "application/json",
            success: function (data) {
                var result = data.d;

            },
            error: function (error) {

            }
        });
    }
    catch (exp) {

    }
    return;
}

function CheckNotificiationStringinRedis() {
    try {
        $.ajax({
            url: 'mainnew.aspx/CheckNotificiationStringinRedis',
            type: 'POST',
            cache: false,
            async: true,
            data: JSON.stringify({
                key: "true",
            }),
            dataType: 'json',
            contentType: "application/json",
            success: function (data) {
                var result = data.d;
                if (result != "") {
                    showNotificationMessage(result);
                }
            },
            error: function (error) {

            }
        });
    }
    catch (exp) {

    }
}


function ExecutionTraceInterval(isSignOut=false) {
    var ExecutionLongText ="";
    let appSUrl = top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/"));
    if(typeof localStorage["ExecutionFullLog-"+appSUrl]!="undefined"){
        ExecutionLongText =localStorage["ExecutionFullLog-" + appSUrl]; 
        localStorage.setItem("ExecutionFullLog-" + appSUrl, ''); 

        ExecutionLongText= ExecutionLongText.replace(/♦/g, '\r\n');
    }
    if(ExecutionLongText!=""){
        try {
            $.ajax({
                url: 'mainnew.aspx/ExecutionTraceInterval',
                type: 'POST',
                cache: false,
                async: true,
                data: JSON.stringify({
                    ExecutionLongText:ExecutionLongText,isSingout:isSignOut
                }),
                dataType: 'json',
                contentType: "application/json",
                success: function (data) {
                    if(isSignOut)
                        ASB.WebService.SignOut();
                },
                error: function (error) {
                    if(isSignOut)
                        ASB.WebService.SignOut();
                }
            });
        }
        catch (exp) {
            if(isSignOut)
                ASB.WebService.SignOut();
        }
        return false;
    }
    else
        return true;
}

    function ExecutionTraceExceededQuota(strMsg) {
        try {
            var ExecutionLongText ="";
            let appSUrl = top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/"));     
            if(typeof localStorage["ExecutionFullLog-"+appSUrl]!="undefined"){
                ExecutionLongText =localStorage["ExecutionFullLog-" + appSUrl]; 
                localStorage.setItem("ExecutionFullLog-" + appSUrl, ''); 
                ExecutionLongText+=strMsg;
                ExecutionLongText= ExecutionLongText.replace(/♦/g, '\r\n');
            }
            if(ExecutionLongText!=""){           
                $.ajax({
                    url: 'mainnew.aspx/ExecutionTraceInterval',
                    type: 'POST',
                    cache: false,
                    async: true,
                    data: JSON.stringify({
                        ExecutionLongText:ExecutionLongText,isSingout:false
                    }),
                    dataType: 'json',
                    contentType: "application/json",
                    success: function (data) {
                    },
                    error: function (error) {
                    }
                });           
            }
        }
        catch (exp) {
        }
    }

    function ToggleMobileNotification(status) {
        var imgTrace = $("#spanMobileNotifi");
        var imgAlt = imgTrace.parent().find("input").is(":checked");
        if (!imgAlt) {
            imgTrace.attr("title", lcm[505]);
            status = "false";
        } else {
            status = "true";
            imgTrace.attr("title", lcm[506]);
        }
        try {
            ASB.WebService.GetHybridNotifiInfo(callParentNew("hybridGUID"),status, SuccessToggleMobileNotification);
        } catch (exp) { }
    }

    function SuccessToggleMobileNotification(result, eventArgs) {
        if (result != "done")
            showAlertDialog("error", result);     
    }

    function LocationInfoAPI()
    {
        if(callParentNew("hybridGUID")!="")
            ASB.WebService.SendNotificationFromFirebase(callParentNew("hybridGUID"),SuccessFcmNotification,OnNotifyException);
    }

    function SuccessFcmNotification(result, eventArgs)
    {
        AxWaitCursor(false);
        ShowDimmer(false);
    }

    function OnNotifyException(result)
    {
        AxWaitCursor(false);
        ShowDimmer(false);
    }


    function refreshVarParams(){
        try {
            $.ajax({
                type: "POST",
                url: "../WebService.asmx/GetNewGlobalVars",
                data: JSON.stringify({ lang: "" }),
                cache: false,
                async: false,
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function (data) {
                    if (data.d != "done")
                        showAlertDialog("error", data.d);
                },
            });

        } catch (ex) { }
    }
