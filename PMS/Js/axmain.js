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


    } catch (ex) { }

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
                isHybridAddressBarVisible = false;
            }
        } catch (error) { }
    }
}

if (typeof axpProjectCaption != "undefined" && axpProjectCaption != "") {
    axUserOptions.axAppName.appName = axpProjectCaption;
}
var appGlobalVarsObject = {};
appGlobalVarsObject = new appGlobalObj();

function appGlobalObj() {
    //this.lcm = callParentNew("lcm");
    _this_ = this;
    this.lcm = lcm;
    this._CONSTANTS = new globalConstants();
    this.splitRatio = "1:1:auto",
        this.methods = {
            toggleCompressModeUI: function (element) {

                //if (_this_._CONSTANTS.window == window) {
                //    if ((_thisdiv = $($.axpertUI.search.options?.staging?.div).parents(".header")) && _thisdiv.length > 0) {
                //        if (_this_._CONSTANTS.compressedMode) {
                //            _thisdiv.addClass("h-60px");
                //        } else {
                //            _thisdiv.removeClass("h-60px");
                //        }
                //    }

                //    if ((_thisdiv = $($.axpertUI.options.axpertUserSettings.staging.AxAppLogo.web.divParent)) && _thisdiv.length > 0) {
                //        if (_this_._CONSTANTS.compressedMode) {
                //            _thisdiv.removeClass("pt-9 pb-5").addClass("pt-6 pb-2");
                //        } else {
                //            _thisdiv.addClass("pt-9 pb-5").removeClass("pt-6 pb-2");
                //        }
                //    }

                //    if ((_thisdiv = $($.axpertUI.options.navigation.backButton.div).parent()) && _thisdiv.length > 0 && _thisdiv.hasClass("content")) {
                //        if (_this_._CONSTANTS.compressedMode) {
                //            _thisdiv.removeClass("pt-7 px-7").addClass("pt-6 px-6");
                //        } else {
                //            _thisdiv.addClass("pt-7 px-7").removeClass("pt-6 px-6");
                //        }
                //    }
                //}

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
}

function getCompressedMode() {
    var appUrl = top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/"));
    try {
        if (window.localStorage.getItem("compressedMode-" + appUrl) != null && window.localStorage.getItem("compressedMode-" + appUrl) != undefined) {
            return JSON.parse(window.localStorage.getItem("compressedMode-" + appUrl));
        } else {
            updateCompressedmode(compressedMode);
        }
    }
    catch { }
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

var SESSTIMEOUT = "SESSION_TIMEOUT";
var SESSMSG = "axmain.aspx";

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
                var isExeSave = ExecutionTraceInterval(true);
                clearLocalStorage(['projInfo-', 'versionInfo-', 'langInfo-', 'hybridGUID-', 'hybridDeviceId-', 'compressedMode-', 'duplicateUser-', 'instanceName-'], true);
                window.localStorage.removeItem("axpertLocalsession");
                if (isExeSave)
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

    try {
        AxAfterMainPageLoad();
    } catch (ex) { }

    $('.main-sidebar').on('mouseleave', function () {
        if ($('body').hasClass('menu-hover') == true) {
            $('body').removeClass('menu-hover').addClass('sidebar-collapse');

            $(".treeview-menu").hide();
            $(".treeview.menu-open").removeClass("menu-open");
        }
    })

    //var buildModeAccessLength = PageBuilderAccess.length;
    //let userRespArray = userResp.split(",");
    //for (var i = 0; i < buildModeAccessLength; i++) {
    //    if ($.inArray(PageBuilderAccess[i], userRespArray) !== -1) {
    //        hasPageBuildAccess = true;
    //        break;
    //    }
    //}

    ShowDimmer(false);
    $('#middle1').on('load', function () {
        $(this).contents().find("html").on('click', function (event) {
            $("#Li1").removeClass("open");
            $("#liMulmenu").removeClass("open");
            $('.dropdown-toggle').parent().removeClass('open');
        });
        checkSuccessAxpertMsg();
    });

    createLocalSession();

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
        }
    );

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
    if (typeof isCloudApp != "undefined" && isCloudApp == "True") {
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
    checkSuccessAxpertMsg();


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


    var isIE = false || !!document.documentMode;
    $('#homeBuilderBtn').keydown(function (e) {
        if (isIE && e.keyCode == 13) {
            LoadIframe('HomeBuilder.aspx');
        }
    });
    $('#homeIcon').keydown(function (e) {
        if (isIE && e.keyCode == 13) {
            //resetLeftMenu();
        }
    });
    //$('#dashBoardIcon').keydown(function (e) {
    //    if (isIE && e.keyCode == 13) {
    //        ToogleLeftMenu('dashboardPanel', 'true', 'Dashboard', '');
    //    }
    //});
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

    $("#appSettingsDropDown li").each(function () {
        if ($(this).css("display") != "none")
            visibleAppSettings++;
    })
    //hide utilities menu if user don't have access to any menu (Responsibilities, Import data, Export data, Import history, In-memory DB, Config app, Widget builder)
    if (visibleAppSettings > 0)
        $("#ExportImportCogIcon").show(); //show utilities menu option if user has access 
    else
        $("#ExportImportCogIcon").hide();

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

    try {

        AxAfterMainReady();
    }
    catch (ex) {

    }

    if (typeof localStorUser != "undefined" && localStorUser == "true") {
        let appSessUrl = top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/"));
        localStorage.setItem("unlmtUsername-" + appSessUrl, mainProject);
    }

    ExecTraceInterval();

    if ($("#hdHomeUrl").val() != "") {
        LoadIframe('loadhomepage', true);
    }
});

function ExecTraceInterval() {
    var execTraceInterval = 5 * 60000;// parseInt(executionTraceTimeInt) * 60000;
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
    updateLinks(thisobject, 'prev');
}

function nextbtn_click(thisobject) {
    if (thisobject.hasClass('linkGray')) {
        return false;
    }
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
    el.src = src;
    loadFrame();
    if (!$("#inner-page").is(":visible"))
        $("#inner-page").show();

}

function LoadIframe(src, isautoprocess = false) {
    if ($("#hdKeepMeDefaultUrl").val() != "") {
        src = $("#hdKeepMeDefaultUrl").val();
        isautoprocess = false;
        $("#hdKeepMeDefaultUrl").val('');
    }
    if (!isautoprocess) {
        var pageProcessName;
        if (src.toLowerCase().indexOf("tstruct.aspx") > -1) {
            pageProcessName = "Tstruct load on menu click(post back)";
            GetCurrentTime(pageProcessName);
        }
        else if (src.toLowerCase().indexOf("iview.aspx") > -1) {
            pageProcessName = "Iview load on menu click(post back)";
            GetCurrentTime(pageProcessName);
        }
        else {
            pageProcessName = "Page load";
            if (src == "loadhomepage" && (!$.axpertUI || !$.axpertUI.cardsPage || !$.axpertUI.cardsPage.options.setCards)) {
                GetCurrentTime(pageProcessName);
            }
        }
    }
    if (src == "loadhomepage") {
        if ($.axpertUI && $.axpertUI.cardsPage && $.axpertUI.cardsPage.options.setCards) {
            $.axpertUI.cardsPage.activate(src);
            resetMainPageUI();
            return false;
        } else if ($("#hdHomeUrl").val()) {
            src = $("#hdHomeUrl").val();
        } else {
            $("#middle1").attr("src", $("#hdHomeUrl").val());
            return false;
        }

    } else if ($.axpertUI && $.axpertUI.cardsPage) {
        $.axpertUI.cardsPage._showCardsFrame(false);
    }

    resetMainPageUI();

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
        if (src.indexOf('?') != -1)
            el.src = src + "&hdnbElapsTime=" + browserElapsTime;
        else
            el.src = src + "?hdnbElapsTime=" + browserElapsTime;
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
                LoadIframe("tstruct.aspx?transid=" + transId + `&openerIV=${transId}&isIV=false`);
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
        else if (navigatePage.indexOf('ParamsTstruct.aspx') != -1) {
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
    if (typeof $('#middle1')[0].contentWindow.ShowDimmer != "undefined") {
        $('#middle1')[0].contentWindow.ShowDimmer(false)
    };
    //$("body").addClass($.axpertUI.options.loader.parent.substr(1));
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

function CheckUrlSplChars(value) {
    if (value == null) return;
    value = value.replace(/&amp;/g, "&");
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

function focusTheParent(presentFld, parentFld) {
    $(document).on('focus', presentFld, function () {
        $(presentFld).parents(parentFld).addClass('focusTheField');
    });
    $(document).on('blur', presentFld, function () {
        $(presentFld).parents(parentFld).removeClass('focusTheField');
    });

}

//var stopBlurEvent = false;
function checkResolution() {
    var widthOfWindow = $(window).width();
    if (widthOfWindow <= 1050) {
        $(".closeSidePanel").click();
    }
}
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
                        window.location = window.location
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

                        window.location = window.location;
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

function ResetSession(isreconnect = false) {
    if (typeof keepAlive != "undefined" && keepAlive == "true")
        KeepSessionAlive(serSessTime);
    else {
        if (isreconnect) {
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
        var currPageUrl = callParentNew("middle1", "id").src;
        currPageUrl = currPageUrl.substring(currPageUrl.length, currPageUrl.indexOf('/aspx/') + 6);
        currPageUrl = currPageUrl.substring(0, currPageUrl.indexOf("&hdnbElapsTime="));

        $.ajax({
            type: "POST",
            url: "../WebService.asmx/KeepSignLastUpdated",
            cache: false,
            async: false,
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                AliveTime: serSessTime, currPageUrl: currPageUrl
            }),
            dataType: "json",
            success: function (data) {
                var sessExit = data.d;
                if (sessExit == "web") {
                    window.location = window.location;
                    return;
                }
                else if (sessExit == "false") {
                    window.location = window.location;
                    return;
                }
                else {
                    window.location = window.location;
                    return;
                }

            }
        });
    }, serSessATime);
}



$(document).click(function (e) {


    if (!$(e.target).hasClass("qrcoderel") && $("#qrCode").data("bs.popover")) {
        // createMobileQRcode("destroy");
    }

    if ($("#middle1").contents().find(".remodal-close").length != 0 && top.$(".loadingoverlay").length == 0 && $(".jconfirm").length == 0) {
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
        displayBootstrapModalDialog('Change Password', 'md', '230px', true, '../aspx/cpwd.aspx?remark=chpwd');
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
function showUserManual() {
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
    if (adUrl != "") {
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
        displayBootstrapModalDialog('Change Password', 'md', '230px', true, '../aspx/cpwd.aspx?remark=chpwd')
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

function showElTraceFileDialog() {
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

function createPagesForUser({ calledFrom }) {
    if (calledFrom === "directLink") {
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
            //ToogleLeftMenu('dashboardPanel', false, 'Dashboard', 'widgetBuilder.aspx');
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
    let myImportModal = new BSModal("ImportData", "Import Data", "<iframe src='../aspx/ImportNew.aspx?transid=" + transid + "' class='vw-100 vh-100'></iframe>", () => {
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

function getSplitWidth(newWidth = "1:1:auto") {
    var ratioNumber = [];

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

    return { split1: Math.floor(parseInt(ratioNumber[0]) / (parseInt(ratioNumber[0]) + parseInt((ratioNumber[1] || (100 - ratioNumber[0])))) * 100), get split2() { return 100 - this.split1 }, splitRatioType };
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
            $('.panel-second-part').css({ width: (100 - split.split2 + "%"), height: '100%' });
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
                //if (data.d != "")
                //    createMenu(data.d);
            },
        });

    } catch (ex) { }
}

function OpenOnPropertyBase(UrlToOpen, iframeId = "#axpiframe") {
    if ($(iframeId).hasClass("frameSplited") === false)
        splitvertical();
    $("#divaxpiframe").css("display", "block");
    $(iframeId).css("display", "block");
    if (UrlToOpen.indexOf("&AxSplit") == -1)
        UrlToOpen += "&AxSplit=true";
    GetProcessTime();
    // $(iframeId).attr('src', UrlToOpen+"&hdnbElapsTime="+ callParentNew("browserElapsTime"));
    try {
        $(iframeId)[0].contentWindow.location.href = UrlToOpen + "&hdnbElapsTime=" + callParentNew("browserElapsTime");
    } catch (ex) { }
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
                                    else if (middleGridview.attr("onclick").indexOf("clickOnDemand(") == 0) {
                                        try {
                                            var dataURL = $(`<div>${$("#middle1", parent.document)[0].contentWindow.clickOnDemand(middleGridview, false)}</div>`).find("a[data-url]:first").data("url");

                                            if (dataURL) {
                                                srcmiddle1new = dataURL;
                                            }
                                        } catch (ex) { }
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
                    $("#axpiframe")[0].contentWindow.location.href = srcmiddle1 + "&AxSplit=true";
                    $("#middle1")[0].contentWindow.location.href = srcmiddle1new + "&AxSplit=true";
                }
                else {
                    $("#axpiframe")[0].contentWindow.location.href = srcmiddle1new + "&AxSplit=true";
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
                $("#axpiframe")[0].contentWindow.location.href = "about:blank";

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
    var blockHistory = ["axmain.aspx", "ivtstload.aspx", "ivtoivload.aspx", "err.aspx"];
    if (!forceUnBlock && blockHistory.filter((val) => (url.indexOf('/aspx/') > -1 ? (url.substr(url.indexOf('/aspx/') + 6) == val) : (url.indexOf(val) > -1))).length > 0) {
        if (appLinkHistory.length > 1 && (typeof navigationshow == "undefined" || navigationshow == "true")) {
            $(appGlobalVarsObject._CONSTANTS.navigation.backButton.div).show();
        }
        histListFlag = false;
        return false;
    }

    // check the same url eg : page reload.
    if (appLinkHistory[appLinkHistory.length - 1] == url) {
        if (appLinkHistory.length > 1 && (typeof navigationshow == "undefined" || navigationshow == "true")) {
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
        if (appLinkHistory.length > 1 && (typeof navigationshow == "undefined" || navigationshow == "true")) {
            $(appGlobalVarsObject._CONSTANTS.navigation.backButton.div).show();
        }

        if ((thisAxIvNav = findGetParameter("AxIvNav", url)) && thisAxIvNav == "true") {
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
            if (appLinkHistory.length > 1 && (typeof navigationshow == "undefined" || navigationshow == "true")) {
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
            if (appLinkHistory.length > 1 && (typeof navigationshow == "undefined" || navigationshow == "true")) {
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
            if (appLinkHistory.length > 1 && (typeof navigationshow == "undefined" || navigationshow == "true")) {
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

function AdminConsoleOpenMenu() {

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

function OpenConfigurationStudio() {

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

function AdminConsoleHidemenu() {
    $(callParentNew("mainNewPageBody")).removeClass("overlay-open");
    $(callParentNew("appBackBtn", "class")).hide();
    //$(".fullTempleteWrapper .search-bar").css('display', 'none');
}

function ExitAdminconsole() {
    $(callParentNew("mainNewPageBody")).addClass("overlay-open");
    if (typeof loadFrame != "undefined")
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
        if (thisMessageNode.indexOf("*$*") != -1) {
            thisMessageNode.split("*$*").forEach(obj => {
                obj = JSON.parse(obj);
                if (obj.command) {
                    AssignLoadValues(JSON.stringify(obj), "Action", "");

                }
            });
        } else {
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
            if (eachjsonvalue.data.indexOf("*$*") != -1) {
                let messages = eachjsonvalue.data.split("*$*");
                messages.forEach(msg => {
                    let jsonMsg = JSON.parse(msg);
                    if (jsonMsg.command) {
                        commandVal = jsonMsg.command[0].cmdval.toString();
                        fullcommandmsg = msg;
                    }
                    if (jsonMsg.message) {
                        msgToshow = jsonMsg.message[0].msg;
                        genericNotiicationcreation(msgToshow, fullcommandmsg, timeMsg);

                    }
                });
            } else {
                try {
                    let jsonMsg = JSON.parse(eachjsonvalue.data);
                    let message = jsonMsg.msg.filter(msg => msg.message)[0].message;
                    let keyId = eachjsonvalue.keyId;

                    genericNotiicationcreation(message, JSON.stringify(jsonMsg), keyId);
                } catch (ex) { }
            }
            notifyJsonOldobj = message;
        }
    }
}

function genericNotiicationcreation(msgToshow, JsonFullcomand, timeMsg) {
    var $panel = $("#notificationPanel");
    var notifyHyperlinkjson = "";
    var notifymsgToshow = "";
    if (JsonFullcomand) {

        notifymsgToshow = msgToshow.split("`");
        if (notifymsgToshow.length > 1)
            notifymsgToshow = notifymsgToshow[1];
        else
            notifymsgToshow = notifymsgToshow[0];

        notifyHyperlinkjson = JsonFullcomand.replace(/"/g, "\\\"");
        notifymessage = "<a href='javascript:void(0);'  onclick='Notificationhyperlink1(" + timeMsg + ");'>" + notifymsgToshow + "</a>";
    }
    else
        notifymessage = notifymsgToshow;

    setTimeout(function () {
        showAlertDialog("info", notifymessage);
    }, 0);
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
    var notifyCount = $("#notifycount .settingsGeneral").length;

    if (notifyCount > 0) {
        $panel?.find(".blinker")?.removeClass("d-none");

    } else {
        $panel?.find(".blinker")?.addClass("d-none");
    }
}

function DeletenotifyDiv(e) {

    e.parentElement.style.display = 'none';
    e.parentElement.remove();
    notifydividentifier = e.getAttribute("id");

    try {
        $.ajax({
            url: 'axmain.aspx/delNotificiationKeyfromRedis',
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
            url: 'axmain.aspx/CheckNotificiationStringinRedis',
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


function ExecutionTraceInterval(isSignOut = false) {
    var ExecutionLongText = "";
    let appSUrl = top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/"));
    if (typeof localStorage["ExecutionFullLog-" + appSUrl] != "undefined") {
        ExecutionLongText = localStorage["ExecutionFullLog-" + appSUrl];
        localStorage.setItem("ExecutionFullLog-" + appSUrl, '');

        ExecutionLongText = ExecutionLongText.replace(/♦/g, '\r\n');
    }
    if (ExecutionLongText != "") {
        try {
            $.ajax({
                url: 'axmain.aspx/ExecutionTraceInterval',
                type: 'POST',
                cache: false,
                async: true,
                data: JSON.stringify({
                    ExecutionLongText: ExecutionLongText, isSingout: isSignOut
                }),
                dataType: 'json',
                contentType: "application/json",
                success: function (data) {
                    if (isSignOut)
                        ASB.WebService.SignOut();
                },
                error: function (error) {
                    if (isSignOut)
                        ASB.WebService.SignOut();
                }
            });
        }
        catch (exp) {
            if (isSignOut)
                ASB.WebService.SignOut();
        }
        return false;
    }
    else
        return true;
}

function ExecutionTraceExceededQuota(strMsg) {
    try {
        var ExecutionLongText = "";
        let appSUrl = top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/"));
        if (typeof localStorage["ExecutionFullLog-" + appSUrl] != "undefined") {
            ExecutionLongText = localStorage["ExecutionFullLog-" + appSUrl];
            localStorage.setItem("ExecutionFullLog-" + appSUrl, '');
            ExecutionLongText += strMsg;
            ExecutionLongText = ExecutionLongText.replace(/♦/g, '\r\n');
        }
        if (ExecutionLongText != "") {
            $.ajax({
                url: 'axmain.aspx/ExecutionTraceInterval',
                type: 'POST',
                cache: false,
                async: true,
                data: JSON.stringify({
                    ExecutionLongText: ExecutionLongText, isSingout: false
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
        ASB.WebService.GetHybridNotifiInfo(callParentNew("hybridGUID"), status, SuccessToggleMobileNotification);
    } catch (exp) { }
}

function SuccessToggleMobileNotification(result, eventArgs) {
    if (result != "done")
        showAlertDialog("error", result);
}

function LocationInfoAPI() {
    if (callParentNew("hybridGUID") != "")
        ASB.WebService.SendNotificationFromFirebase(callParentNew("hybridGUID"), SuccessFcmNotification, OnNotifyException);
}

function SuccessFcmNotification(result, eventArgs) {
    AxWaitCursor(false);
    ShowDimmer(false);
}

function OnNotifyException(result) {
    AxWaitCursor(false);
    ShowDimmer(false);
}


function refreshVarParams() {
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

function authError(errMsg) {
    $("#desc").text(errMsg);
    $("#divAuthError").removeClass("d-none");
    $(".content").addClass("d-none");
}