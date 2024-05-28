$(()=>{
    $(".adminMainLeft .menu-link[onclick]:first").click();
})
function LoadIframeac(src) {
    // ShowDimmer(true);
    //splitfullDwb();
    isTstructSplited = false;
    try {
        AxOnLoadIframe();
    }
    catch (ex) { }
    if (src.indexOf("iviewInteractive") !== 1)
        src = src.replace("iviewInteractive", "iview");

    if (window.globalChange) {
        if (confirm(appGlobalVarsObject.lcm[31])) {
            SetFormDirty(false);
        } else {
            return;
        }
    } else if ($("#axpiframeac")[0].contentWindow.designChanged != undefined && $("#axpiframeac")[0].contentWindow.designChanged == true) {

        if (!confirm(appGlobalVarsObject.lcm[31]))
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
        el = document.getElementById('axpiframeac');
        // el.src = "";
        el.src = src;
    }

    isTstructPopup = false;
    return false;
}

function SetFormDirty(status) {
    IsFormDirty = status;
    window.globalChange = status;
    if (typeof $("#axpiframeac") != "undefined" && $("#axpiframeac").attr("src").indexOf("tstruct.aspx") > -1 && typeof tstAxpFileFlds != "undefined" && tstAxpFileFlds == true) {
        tstAxpFileFlds = false;
        ASB.WebService.RemoveUnwantedAxpFiles();
    }
}
function loadFrameAc() {
    if (typeof $('#axpiframeac')[0].contentWindow.ShowDimmer != "undefined") { $('#axpiframeac')[0].contentWindow.ShowDimmer(false) };
    $("body").addClass($.axpertUI.options.loader.parent.substr(1));
}

function closeFrameAc() {
    $("body").removeClass($.axpertUI.options.loader.parent.substr(1));
}

/////////////////////////////////////////
var navigationshow = callParentNew("navigationshow");
var thmProj = callParentNew("thmProj");
var mainProject = callParentNew("mainProject");
var isBackClicked = false;
var appLinkHistory = [], appLinkHistoryLabel = [], menuLabel;
var curPageIndex = 0, prevClickFlag = false, nextClickFlag = false, histListFlag = false;

$(document).ready(function (event) {
    $(appGlobalVarsObject._CONSTANTS.navigation.backButton.div).hide();
});

$('.linkPrev').click(function () {
    prevbtn_click($(this));
});
$('.linkNext').click(function () {
    nextbtn_click($(this));
});

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
                histLi += '<li class="histLi histLi' + i + '" title="' + appLinkHistoryLabel[i] + '" onclick="histListFlag = true; LoadIframeac(\'' + appLinkHistory[i] + '\')"> <a href="javascript:void(0);" style="text-decoration: none;">' + appLinkHistoryLabel[i] + '</a></li>';
            }
        }
        if (appLinkHistoryLabel.length >= 10) {
            histLi += '<li class="clearHisItem">Clear List</li>';
        }
        // $(appGlobalVarsObject._CONSTANTS.history.staging.div).html(histLi);
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
        LoadIframeac(appLinkHistory[curPageIndex]);
        if (curPageIndex == 0) {
            $(appGlobalVarsObject._CONSTANTS.navigation.backButton.div).hide();
            //.appBackBtn
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