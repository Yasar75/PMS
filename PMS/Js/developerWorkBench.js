var isDWB = true;
var heightOfToolbar = 0;
var dwbTitle = 0;
var hightofmiddle1 = 0;
var isSuccessAlertInPopUp = false;
var isRefreshParentOnClose = false;
var mainSqlHintObj = {};
var tstAxpFileFlds = false;
$(document).ready(function () {
    window.onbeforeunload = BeforeWindowClose;
    createLocalSession();

    LoadIframeDwb("ivtoivload.aspx?ivname=Formn");

    $('#developerLogout').click(function () {
        var x = window.location.href;
        var path = x.substring(0, x.lastIndexOf('/'));
        window.location.replace(path + '/mainnew.aspx');
    });

    $(".loadForms").click(function () {
        LoadIframeDwb("ivtoivload.aspx?ivname=Formn");
    });

    $(".axwidgets").click(function () {
        //LoadIframeDwb("widgetbuilder.aspx");
        LoadIframeDwb("PageDesigner.aspx");
        $("#btn_opentstr").hide(); //css("display", "none");
        $(".dwbwidget").closest("li").show() //dwbwidget
        // btn_dwbwidget
        //ToogleLeftMenu('dashboardPanel', false, 'Dashboard', 'widgetBuilder.aspx');
        $(".developerbreadcrumbTitle").text('Page Builder');
    });
    //if ($('#middle1').attr('src') == "widgetbuilder.aspx") {
    //    $(".developerbreadcrumbTitle").text('Widget Builder');
    //};

    // axwidgets
    $(".axwizard").click(function () {
        LoadIframeDwb("wizardsetting_new.aspx");
        $(".developerbreadcrumbTitle").text('Wizard Setting');
    });

    $(".arrangeMenu").click(function () {
        LoadIframeDwb("ArrangeMenu.aspx");
        $(".developerbreadcrumbTitle").text('Arrange Menu');
    });

    $(".dbScript").click(function () {
        LoadIframeDwb("AxDBScript.aspx");
        $(".developerbreadcrumbTitle").text('DB Console');
    });
    $(".axpertAPI").click(function () {
        LoadIframeDwb("axpertAPI.aspx");
        $(".developerbreadcrumbTitle").text('Axpert API');
    });
    //$("#WorkFlow").click(function () {
    //    LoadIframeDwb("workflownew.aspx");
    //    $(".developerbreadcrumbTitle").text('WorkFlow');
    //});
    $("#WorkFlow").hide();

    // toolbar buttons outside iframe //
    var frmnm = '';
    $("#middle1").on('load', function () {
        if ($("#middle1").contents().find('.tstivCaption').text() != "") {
            frmnm = getParamsValuefrmName();
            if (frmnm.length > 0)
            { frmnm = ' - ' + frmnm; }

            $(".developerbreadcrumbTitle").text($("#middle1").contents().find('.tstivCaption').text() + frmnm);
        }

        if ($('#middle1').attr('src') == "AxDBScript.aspx") {
            $('.developerWorkBenchToolbar').hide();
            // if ($('.developerWorkBenchToolbar').is(":visible")) {
            //     heightOfToolbar = $(".developerWorkBenchToolbar").outerHeight(true);
            // }
            // if ($('.developerbreadcrumb-panel').is(":visible")) {
            //     dwbTitle = $('.developerbreadcrumb-panel').outerHeight(true);
            // }

            // hightofmiddle1 = Math.round($(window).height()) - (heightOfToolbar - dwbTitle + 158);
            // $('#dvMiddle1').css("height", hightofmiddle1);
        }
        else if ($('#middle1').attr('src') == "axpertAPI.aspx") {
            $('.developerWorkBenchToolbar').hide();
        }
        else if ($('#middle1').attr('src') == "wizardsetting_new.aspx") {
            $('.developerWorkBenchToolbar').hide();
            // if ($('.developerWorkBenchToolbar').is(":visible")) {
            //     heightOfToolbar = $(".developerWorkBenchToolbar").outerHeight(true);
            // }
            if ($('.developerbreadcrumb-panel').is(":visible")) {
                dwbTitle = $('.developerbreadcrumb-panel').outerHeight(true);
            }
        }
        else if ($('#middle1').attr('src') == "ArrangeMenu.aspx") {
            $('.developerWorkBenchToolbar').show();
            $(".dwbiconsUl").hide();
            $('#ArrangeMtb').show();
            // $('#Formstb').hide();
        }
        else if ($('#middle1').attr('src').toLowerCase().indexOf("?ivname=flist") > -1) {
            $('.developerWorkBenchToolbar').show();
            $(".dwbiconsUl").hide();
            $("#iviewListToolbar").show();
            $('.developerWorkBenchToolbar').hide();
        }
        else if ($('#middle1').attr('src') == "PageDesigner.aspx") {
            $('.developerWorkBenchToolbar').show();
            $(".dwbiconsUl").hide();
            $('#wbtb').show();
        }
        else if ($('#middle1').attr('src') == "tstruct.aspx?transid=axstc") {
            $('.developerWorkBenchToolbar').show();
            $(".dwbiconsUl").hide();
        }
        else if ($('#middle1').attr('src').toLowerCase().indexOf("tstruct.aspx?transid=sect") > -1 || $('#middle1').attr('src').toLowerCase().indexOf("iview.aspx?ivname=sect") > -1) {
            if ($('#middle1').contents().find('#form1').attr('action').indexOf('./iview.aspx') > -1) {                
                $(".developerWorkBenchToolbar").show();
                $(".dwbiconsUl").hide();
                $("#htmlPagesIvToolBar").show();
            }
            else{
                $(".developerWorkBenchToolbar").show();
                $(".dwbiconsUl").hide();
            }
        }
        else {
            $('.developerWorkBenchToolbar').show();
            // $('#ArrangeMtb').hide();
            $(".dwbiconsUl").hide();
            $('#ArrangeMtb').hide();
            $('#Formstb').show();
            $.each($('#Formstb').children('li'), function (i, e) {
                var btnID = $(e).children('a').attr('id');

                if (btnID.trim() == 'btn_opentstr' && frmnm == '') {
                    $(e).show();
                    return true;
                }
                else if (btnID.trim() != 'btn_opentstr' && frmnm != '') {
                    $(e).show();
                    return true;
                }
                else {
                    $(e).hide();
                }
            });

        }
        // setMiddle1Height();
    });
    getMainSqlHintObj();

    $('html').on('click', '.btntoolbar', function () {
       var stype = $(this).data("pgtype");
       var name = $(".developerbreadcrumbTitle").text().substring($(".developerbreadcrumbTitle").text().indexOf('(') + 1, $(".developerbreadcrumbTitle").text().length - 1)
       createPopupdesign('ToolbarManager.aspx?stype=' + stype + '&name=' + name + '','',"85vw","85vh");

    });

});

function setMiddle1Height() {
    //  $(".right-section").css({ "height": $(".left-section").outerHeight(true)});
    var rightSecHeight = 0;
    try {
        rightSecHeight = $(".left-section").outerHeight(true);
    } catch (ex) { }

    var brdcmHeight = 0;
    try {
        $(".developerbreadcrumb-panel").is(':visible') ? brdcmHeight = $(".developerbreadcrumb-panel").outerHeight(true) : "";
    } catch (ex) { }
    var toolBarHeight = 0;
    try {
        $(".developerWorkBenchToolbar").is(':visible') ? toolBarHeight = $(".developerWorkBenchToolbar").outerHeight(true) : "";
    } catch (ex) { }
    var hightOfMiddl1 = rightSecHeight - (brdcmHeight + toolBarHeight);
    $('#middle1').css({ "height": hightOfMiddl1 });
}

function getParamsTstURL() {
    var paramString = $("#middle1").contents().find("#hdnparamValues").val();
    var designTstName = '';
    typeof paramString == "string" && paramString.replace(/¿/g, '♣').split('♣').forEach((v, i) => {
        if (v) {
            var splitVal = v.split("~");

            if (CheckSpecialCharsInStr(splitVal[0]) == 'tstname') {
                designTstName = CheckSpecialCharsInStr(splitVal[1]);
            }
        }
    });
    var pURL = `tstruct.aspx?act=open&transid=${designTstName}&theMode=design&AxPop=true`;
    return pURL;
}
function getParamsValuefrmName() {
    var paramString = $("#middle1").contents().find("#hdnparamValues").val();
    var returnArray = '';
    typeof paramString == "string" && paramString.replace(/¿/g, '♣').split('♣').forEach((v, i) => {
        if (v) {
            var splitVal = v.split("~");

            if (CheckSpecialCharsInStr(splitVal[0]) == 'captitle')
            { returnArray = CheckSpecialCharsInStr(splitVal[1]) }
            //returnArray[CheckSpecialCharsInStr(splitVal[0])] = CheckSpecialCharsInStr(splitVal[1].toString()).replace(/&amp;grave;/g, '~');
        }
    });
    return returnArray;
}
function LoadTstFrmDesign() {
    var srcUrl = getParamsTstURL();
    var navigationType = '';
    var parFrm = $j("#axpiframe", parent.document);
    if ((navigationType == undefined || navigationType == "") && parFrm.hasClass("frameSplited"))
        navigationType = "split"

    try {
        srcUrl = loadTstUrlReWrite(srcUrl) || srcUrl;
    } catch (ex) { }

    if (navigationType === "split") {
        ShowDimmer(false);
        //OpenOnPropertyBase(srcUrl);
        callParentNew(`OpenOnPropertyBase(${srcUrl})`, 'function');

    }
    else if (navigationType === "popup") {
        LoadPopPage(srcUrl)
    }
    else if (navigationType === "default" || navigationType == "") {
        ReloadIframe(srcUrl);
    }
    else if (navigationType === "newpage") {
        popupFullPage(srcUrl)
    }


}
//Popup form design without Parent Devendra
function LoadPopPageDesign() {

    loadPop = createPopupdesign(getParamsTstURL());

}
function createPopupdesign(iframeSource, isRefreshSelect, width, height) {
    iframeHtmlSrc = iframeSource
    htmlContent = '<div id="axpertPopupWrapper" style="width:90vw;height:80vh;top:100px;left:34px;" class="remodal" data-remodal-id="axpertPopupModal"><button data-remodal-action="close" class="remodal-close remodalCloseBtn icon-basic-remove" title="Close"></button><div style="height:100%;" id="iframeMarkUp"></div></div>';
    $("head").append(htmlContent);
    var options = { "closeOnOutsideClick": true, "hashTracking": false, "closeOnEscape": true };
    var inst = $('[data-remodal-id=axpertPopupModal]:not(.remodal-is-initialized):not(.remodal-is-closed):eq(0)').remodal(options);
    if (inst && inst.state != "opened")
        inst.open();

    return inst;

}

//Main page on before unload- calling sgnout webservice to handle record lock
function BeforeWindowClose() {
    if (doPageUnload != "false") {
        try {
            var appUrl = top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/"));
            sessionStorage.removeItem("homeJsonObj");
            sessionStorage.clear();
            var localSessionVal = parseInt(window.localStorage.getItem("axpertLocalsession-" + appUrl));
            if (!localSessionVal || localSessionVal == 0) {
                //localStorage.clear();
                clearLocalStorage(['projInfo-', 'versionInfo-', 'langInfo-', 'hybridGUID-', 'compressedMode-'], true);
                window.localStorage.removeItem("axpertLocalsession-" + appUrl);
                ASB.WebService.SignOut();
            } else
                window.localStorage.setItem("axpertLocalsession-" + appUrl, localSessionVal - 1);
        } catch (ex) { }
    } else
        doPageUnload = "true";
}

function createLocalSession() {
    var appUrl = top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/"));
    if (window.localStorage.getItem("axpertLocalsession-" + appUrl) == null)
        window.localStorage.setItem("axpertLocalsession-" + appUrl, 0);
    else {
        var localSessionVal = parseInt(window.localStorage.getItem("axpertLocalsession-" + appUrl));
        window.localStorage.setItem("axpertLocalsession-" + appUrl, localSessionVal + 1);
    }

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

function LoadIframeDwb(src) {
    splitfullDwb();
    isTstructSplited = false;
    try {
        AxOnLoadIframe()
    }
    catch (ex) { }
    if (src.indexOf("iviewInteractive") !== 1)
        src = src.replace("iviewInteractive", "iview");

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
        el.src = src;
    }
    isTstructPopup = false;
    return false;
}

function splitfullDwb() {
    $('.panel-fisrt-partdwb').css({ width: '100%', float: 'left' });
    $('.panel-second-partdwb').hide();
    if ($("#axpiframe").hasClass("frameSplited") && $("#middle1").attr("src").indexOf("iview.aspx") != -1 && findGetParameter("tstcaption", $("#middle1").attr("src")) != null) {
        isTstructSplited = true;
        $("#middle1").attr("src", $("#axpiframe").attr('src'));
    }
    $("#axpiframe").attr("src", "");
    $("#axpiframe").removeClass("frameSplited");

};

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
                            if (data.d != "")
                                srcmiddle1new = "tstruct.aspx?transid=" + data.d;

                            else if (srcmiddle1.indexOf("ivtoivload.aspx") != -1 || srcmiddle1.indexOf("iview.aspx") != -1) {
                                var middleGridview = $("#middle1", parent.document).contents().find("#GridView1 a:first");
                                if (middleGridview != undefined && middleGridview.length > 0) {
                                    if (middleGridview.data("url") != undefined)
                                        srcmiddle1new = middleGridview.data("url");
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
                    $("#axpiframe").attr('src', srcmiddle1 + "&AxSplit=true");
                    $("#middle1").attr('src', srcmiddle1new + "&AxSplit=true");
                }
                else {
                    $("#axpiframe").attr('src', srcmiddle1new + "&AxSplit=true");
                }

                if (directSplit)
                    resetSplitter('vertical');
            }
            else if (splitAsIview) {
                $("#divaxpiframe").css("display", "block");
                $("#axpiframe").css("display", "block");
                resetSplitter('vertical');
                return;
            }
            else {
                $("#axpiframe").attr('src', "");
            }

        } else {
            splitfullDwb();
            return;
        }
    }
}

//Add for autosplit
function autoSplitWindow() {
    let srcmiddle1 = frames['middle1'].window.location.href;
    if (srcmiddle1 != undefined && srcmiddle1 != "") {
        let srcmiddle1new = "";

        if (srcmiddle1.indexOf("tstruct.aspx") != -1) {
            srcmiddle1new = srcmiddle1.replace("tstruct", "listiview");
            srcmiddle1new = srcmiddle1new.replace("transid", "tid"); l
        }
    }
}
//---------------------New Added from main.js-------------------
function OpenOnPropertyBase(UrlToOpen) {
    if ($("#axpiframe").hasClass("frameSplited") === false)
        splitvertical();
    $("#divaxpiframe").css("display", "block");
    $("#axpiframe").css("display", "block");
    if (UrlToOpen.indexOf("&AxSplit") == -1)
        UrlToOpen += "&AxSplit=true";
    $("#axpiframe").attr('src', UrlToOpen);
}

function splitvertical() {
    if ($('.split-btn i').hasClass('fa-times')) {
        $('.split-btn i').removeClass('fa-times').addClass('fa-sort');
        splitfullDwb();
        return;
    }

}

function initializeSplitter(calledsplitter) {
    $(".panel-fisrt-part").customResizable("destroy");
    if (calledsplitter == 'horizantal') {
        $(".panel-fisrt-part").customResizable({
            handleSelector: ".splitter-horizontal",
            resizeWidth: false

        });
    } else {
        $(".panel-fisrt-part").customResizable({
            handleSelector: ".splitter",
            resizeHeight: false
        });
    }

}
//--------------------------------------END																

function resetSplitter(calledFrom) {
    $('.panel-fisrt-partdwb, .panel-second-partdwb').show();
    if (calledFrom == "horizantal") {
        $('.panel-fisrt-partdwb,.panel-second-partdwb').css({ height: '50%', width: '100%' });
    } else {
        $('.panel-fisrt-partdwb').css({ width: '250px', position: 'absolute', left: '0px' });
        $('.panel-second-partdwb').css({ position: 'absolute', left: '250px', width: 'calc(100vw - 370px)' });
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

// to trigger dwb toolbar buttons //
$(document).on("click", ".dwbBtn", function () {
    var dwbbtnid = $(this).attr("id");
    var dwbbtntext = $(this).text();

    if ($("#middle1").contents().find("#" + dwbbtnid).length != 0) {
        $($("#middle1").contents().find("#" + dwbbtnid)).trigger('click');
    }
    else if ($("#middle1").contents().find("#popupIframeRemodal").contents().find("li [id='" + dwbbtnid + "']").length != 0) {
        $($("#middle1").contents().find("#popupIframeRemodal").contents().find("li [id='" + dwbbtnid + "']")).trigger('click');
    }
    else if ($("#middle1").contents().find('li:not([style*="display: none"])').filter(function () {
        return /Save/i.test($(this).text());
    }).length != 0) {
        $($("#middle1").contents().find('li:not([style*="display: none"]) a').filter(function () {
            return /Save/i.test($(this).text());
        })).trigger('click');
    }
    else if ($("#middle1").contents().find("#popupIframeRemodal").contents().find('li:not([style*="display: none"])').filter(function () {
        return /Save/i.test($(this).text());
    }).length != 0) {
        $($("#middle1").contents().find("#popupIframeRemodal").contents().find('li:not([style*="display: none"]) a').filter(function () {
            return /Save/i.test($(this).text());
        })).trigger('click');
    }
});

// appglobalvarsobject function //
var appGlobalVarsObject = {};
appGlobalVarsObject = new appGlobalObj();

function appGlobalObj() {
    _this = this;
    this.lcm = lcm;
    this._CONSTANTS = new globalConstants();
    this.methods = {
        toggleCompressModeUI: function (element) {

            if (_this._CONSTANTS.compressedMode) {
                element.addClass("compressedModeUI");
                if (element.find('iframe').length > 0) {
                    $(element.find('iframe')).each(function (index, el) {
                        _this.methods.toggleCompressModeUI($(el.contentDocument.body));
                    });

                }
            }
            else {
                element.removeClass("compressedModeUI");
                if (element.find('iframe').length > 0) {
                    $(element.find('iframe')).each(function (index, el) {
                        _this.methods.toggleCompressModeUI($(el.contentDocument.body));
                    });
                }

            }
        }
    }
}

function globalConstants() {
    this.MALICIOUSNPUTDETECTED = "Invalid input detected, Please try again.";
    this.isHybrid = hybridGUID && hybridGUID != "" ? true : false;
    this.compressedMode = getCompressedMode();
}

function getCompressedMode() {
    var appUrl = top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/"));
    if (window.localStorage.getItem("compressedMode-" + appUrl) != null && window.localStorage.getItem("compressedMode-" + appUrl) != undefined) {
        return JSON.parse(window.localStorage.getItem("compressedMode-" + appUrl));
    }
    else {
        return compressedMode;
    }
}

//Function to show the dimmer on the background.
function ShowDimmer(status) {

    DimmerCalled = true;
    var dv = $j("#waitDiv");

    if (dv.length > 0 && dv != undefined) {
        if (status == true) {
            closeParentFrame();
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
function getMainSqlHintObj() {
    if (SQLHintObj != "") {
        hintObj = JSON.parse(SQLHintObj);
        if (typeof hintObj["result"]["row"] != "undefined" && hintObj["result"]["row"].length != 0) {
            $.each(hintObj["result"]["row"], function (index, value) {
                if (mainSqlHintObj[value["table_name"]]) { mainSqlHintObj[value["table_name"]].push(value["column_name"]); } else { mainSqlHintObj[value["table_name"]] = [value["column_name"]] }
            });
        }
    }
}

function SetFormDirty(status) {
    IsFormDirty = status;
    window.globalChange = status;
    if (typeof $("#middle1") != "undefined" && $("#middle1").attr("src").indexOf("tstruct.aspx") > -1 && tstAxpFileFlds == true) {
        tstAxpFileFlds = false;
        ASB.WebService.RemoveUnwantedAxpFiles();
    }
}

function loadFrame() {
    if (typeof $('#middle1')[0].contentWindow.ShowDimmer != "undefined") { $('#middle1')[0].contentWindow.ShowDimmer(false) };
    $.LoadingOverlay("show", { "fixedBackgroundSize": "135px", "zIndex": 99999999 });
}

function loadFrameOnline() {
    if (typeof $('#axpiframe')[0].contentWindow.ShowDimmer != "undefined") { $('#axpiframe')[0].contentWindow.ShowDimmer(false) };
    $.LoadingOverlay("show", { "fixedBackgroundSize": "135px", "zIndex": 99999999 });
}

function closeFrame() {
    $.LoadingOverlay("hide", true);
}
