/////////////////
//By MANIKANTA //
/////////////////

var isHomeLoadStatus = "notYetLoaded";
if (typeof isPageBuilder === "undefined") {
    isPageBuilder = false;
}
var rssSlideTime = 3000; //in milli seconds
var rssRefreshData = {};
var homeBuilderJson = {};
var homeJsonObj,ajaxCallObj,cachedJson,myTaskDetails;
// var enableLocalStorage = true; //currently not using caching because of some complex logics
var orderJsonData = {};
var localLangFile = {};
var presBuiildMode = "homeRun";
var userResps = parent.userResp.split(',');
//inheritsFrom(MakeHBAjaxCall, MainAjaxCalls);
inheritsFrom(MakeHBAjaxCall, HomePage);
ajaxCallObj = new MakeHBAjaxCall();
homeJsonObj = new HomeBuilderJsonObj();
var isValidPage = ajaxCallObj.isPageValid();
//if (callParentNew("nodeAccessToken")) {
if (callParentNew("nodeApi") || (typeof homepagews!="undefined" && homepagews=="true")) {
    if (isValidPage && isValidPage.status) {
        ajaxCallObj.getNLSparameter();
    } else {
        if (isValidPage.errMsg == "{\"result\":[{\"status\":\"false\",\"msg\":\"Session Authentication failed...\"}]}") {
            setTimeout(function () {
                $.ajax({
                    type: "POST",
                    url: `${encodeURI(mainPageUrl = window.location.href.toLowerCase()) && (webUrl = mainPageUrl.substr(0, mainPageUrl.indexOf("/aspx")))}/WebService.asmx/GetSession`,
                    cache: false,
                    async: false,
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify({ key: 'appsessionkey' }),
                    dataType: "json",
                    success: function (data) {
                        if (data.d != 'Session does not exist') {
                            appsessionKey = data.d;
                            isValidPage = ajaxCallObj.isPageValid();
                            if (isValidPage && isValidPage.status) {
                                ajaxCallObj.getNLSparameter();
                            } else {
                                if (isValidPage && isValidPage.errMsg) {
                                    showAlertDialog("error", isValidPage.errMsg);
                                } else {
                                    redirectPage(true);
                                }
                            }
                        }
                        else
                            showAlertDialog("error", "Session Authentication failed...");
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        isValidPage = ajaxCallObj.isPageValid();
                        if (isValidPage && isValidPage.status) {
                            ajaxCallObj.getNLSparameter();
                        } else {
                            if (isValidPage && isValidPage.errMsg) {
                                showAlertDialog("error", isValidPage.errMsg);
                            } else {
                                redirectPage(true);
                            }
                        }
                    }
                });
            }, 200);
        }
        else {
            if (isValidPage && isValidPage.errMsg) {
                showAlertDialog("error", isValidPage.errMsg);
            } else {
                redirectPage(true);
            }
        }
    }
}else{
    callParentNew("closeFrame()", "function");
}
var theme = eval(callParent('currentThemeColor'));
theme = theme || "default";
$("#homeBuilderLink").attr('href', "../App_Themes/" + theme + "/home_builder.min.css?v=4");

jQuery(document).ready(function ($) {
    WireElapsTime(serverprocesstime, requestProcess_logtime);
    parent.closeFrame();
    var showBuildMode = parent.hasPageBuildAccess;
    $("body").attr('dir', ax_direction);
    $("body").addClass("mtextDir" + ax_direction);
    handleLanguageSupprt();
    if (isPageBuilder && showBuildMode) {
        $("#buildMode").show();
    }
    $(callParentNew("splitIcon", "id")).addClass("hide");
    $(callParentNew("spiltHeading", "class")).addClass("hide");
    GetProcessTime();
    GetTotalElapsTime();
});

$(document).on('click', '.htmlContentCard a', function (event) {
    event.preventDefault();
    var href = $(this).attr('href');
    window.open(href, "_blank");
});




function handleLanguageSupprt() {
    if (ax_language != "en") {
        var presLanArray = parent.lcm;
        localLangFile["new"] = presLanArray[244] || "New";
        localLangFile["pdf"] = presLanArray[241] || "PDF";
        localLangFile["print"] = presLanArray[242] || "Print";
        localLangFile["excel"] = presLanArray[243] || "Excel";
        localLangFile["listview"] = presLanArray[245] || "List View";
        $("#HPBdesignerCanvas .hpbHeaderTitle .title").text(presLanArray[240]);
    } else {
        localLangFile["new"] = "New";
        localLangFile["pdf"] = "PDF";
        localLangFile["print"] = "Print";
        localLangFile["excel"] = "Excel";
        localLangFile["listview"] = "List View";
    }
}

$(document).on('click', '#sortable .ui-state-default .cardClick', function(event) {
    var elem = $(this);
    var targetElem = "";
    targetElem = elem.parents('.ui-state-default');
    var type = targetElem.data('type');
    if (type != "widget") {
        var idOfTarget = targetElem.attr('id');
        var jsonObj = homeJsonObj.jsonDataa[idOfTarget];
        var type = jsonObj.c;
        if (type == "tstruct" || (jsonObj.tgt && jsonObj.tgt == "tstruct")) {
            var transId = jsonObj.tg;
            transId = transId.substr(1);
            parent.LoadIframe("tstruct.aspx?transid=" + transId);
        } else if (jsonObj.tgt && jsonObj.tgt == "iview") {
            var iviewName = jsonObj.tg;
            iviewName = iviewName.substr(1);
            parent.LoadIframe('ivtoivload.aspx?ivname=' + iviewName);
        } else if (type.indexOf("Custom__") !== -1 && jsonObj.tgt != "none") {
            if (jsonObj.tgt == "url")
                window.open(jsonObj.tg, "_blank");
        }
    }
});


$(document).on('click', '.runtimeActionBtn', function(event) {
    var elem = $(this)
    var parentElem = elem.parent();
    $(".runtimeActionWrapper.active").not(parentElem).each(function(index, el) {
        $(this).removeClass('active');
        $(this).find('ul.floatingBtnMenu li a').css({ transform: 'scaleY(0.4) scaleX(0.4) translateY(40px) translateX(0px)', opacity: 0 })
    });
});


//json related functions
function HomeBuilderJsonObj() {

    this.jsonContent = {};
    this.jsonContent.length = 0;
    this.jsonContent.jsonData = {};
    this.jsonContent.customWidget = {};
    this.jsonContent.jsonOrder = [];
    this.jsonContent.pageData = {};
    this.jsonDataa = this.jsonContent.jsonData;
}

//json related functions~End



//ajaxCalls
function MakeHBAjaxCall() {
    this.onLoadObj = {};
    this.getPublishedData = function() {
        isHomeLoadStatus = "loading";
        var settings = primaryApiSettings();
        settings.url = apiBase + "getHomeBuildPublish";
        settings.data.rty = userResps.toString();
        $.ajax(settings).done(function(response) {
            if (response.status == true) {
                isHomeLoadStatus = "loaded";
                if (!jsonMetaData) {
                    jsonMetaData = {};
                    var metaData = response.metaData;
                    var metaLth = metaData.length;
                    for (var i = 0; i < metaLth; i++) {
                        var presMeta = metaData[i].name;
                        jsonMetaData[presMeta] = i;
                    }
                }
                var data = response.data;
                var dataLth = data.length;
                var mainOrderObj = {};
                var jsonOrder = homeJsonObj.jsonContent.jsonOrder = [];
                orderJsonData["userResps"] = [];
                orderJsonData["admin"] = [];
                orderJsonData["others"] = [];
                var tempObj = {};
                for (var i = 0; i < dataLth; i++) {
                    var presData = data[i]; //IS_PRIVATE
                    var target = presData[jsonMetaData["TARGET"]];
                    var isPrivate = presData[jsonMetaData["IS_PRIVATE"]];
                    var isPublished = presData[jsonMetaData["IS_PUBLISH"]];
                    var resp = presData[jsonMetaData["RESPONSIBILITY"]];
                    var isMain = false;
                    resp = resp.split(",");
                    var targetId = target + "Wrapper";
                    var idInArray = $.inArray(targetId, jsonOrder);
                    var isUserPrivateWidget = false;
                    var presGroup = "";
                    if (isPrivate === "Y") {
                        var createdBy = presData[jsonMetaData["CREATED_BY"]];
                        if (currentUserName === createdBy) {
                            isUserPrivateWidget = true;
                            resp = ["userRep"]; //hook to setting one resp to avoid unnecessary looping for private widgs
                        } else {
                            continue;
                        }
                    }

                    //check for my tasks since my task need not to be repeated
                    if (target.indexOf("C__mytsk") !== -1) {
                        //means my task widget
                        targetId = "C__mytskWrapper";
                        // target
                        idInArray = $.inArray(targetId, jsonOrder);
                        target = "C__mytsk";
                    }

                    for (var j = 0; j < resp.length; j++) {
                        var presResp = resp[j];
                        if (isUserPrivateWidget || ($.inArray(presResp, userResps) !== -1)) {
                            var orderObj = orderJsonData["userResps"];
                            presGroup = 3;
                        } else if (presResp === "default") {
                            var orderObj = orderJsonData["admin"];
                            presGroup = 2;
                        } else {
                            var orderObj = orderJsonData["others"];
                            presGroup = 1;
                        }

                        if (!tempObj[targetId]) {
                            tempObj[targetId] = presGroup
                        } else {
                            isMain = presGroup > tempObj[targetId]
                        }
                        orderObj.push(targetId);
                    }

                    if (isPrivate === "Y" && idInArray !== -1) {
                        jsonOrder[idInArray] = "";
                        idInArray = -1;
                    }

                    if (isMain || idInArray === -1) {
                        jsonOrder.push(targetId);
                        var jsonData = presData[jsonMetaData["CONTENT"]];
                        jsonData = jsonData ? JSON.parse(jsonData) : {};
                        jsonData.hid = presData[jsonMetaData["HOMEBUILD_ID"]];
                        jsonData.pid = presData[jsonMetaData["PARENT_HOMEBUILD_ID"]];
                        if (targetId.indexOf("C__") !== -1)
                            jsonData.ctg = target;
                        homeJsonObj.jsonContent.jsonData[targetId] = jsonData;
                    }
                }
                var finalArray = $.merge($.merge(orderJsonData.userResps, orderJsonData.admin), orderJsonData.others);
                var jsonOrder = homeJsonObj.jsonContent.jsonOrder = jQuery.unique(finalArray);
                homeJsonObj.jsonDataa = homeJsonObj.jsonContent.jsonData;
                createHomeWidgets(homeJsonObj.jsonContent);
            } else {
                filterErrorMessageAndShow(response);
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            onAjaxFailure();
        });
    }


}


//ajaxCalls~End


/**
 * Function trigered once all the widgets are created
 * @return {null} 
 */
function onAllWidgetsCreated() {
    setInterval(function() {
        $("div[data-type='Custom__rss'] .rssFeedCard  .carousel").carousel('next');
    }, rssSlideTime);

    if (!jQuery.isEmptyObject(rssRefreshData)) {
        for (var refreshKey in rssRefreshData) {

            var refreshTime = parseInt(refreshKey) * 60 * 1000; //min to milliseconds
            setInterval(function() {
                var data = rssRefreshData[refreshKey];
                for (var i = 0; i < data.length; i++) {
                    var presData = data[i];
                    ajaxCallObj.fireRssFeed(presData[1], presData[0]);
                    // alert(presData[1])
                }
            }, refreshTime)
        }
    }
}


/**
 * When user click on action Btn On widget This function will handle those actions based on conditions
 * @param  {String} task For different type of tasks(Conditions)
 * @param  {String} tid  TransId/IviewName etc...
 * @return {null}      Just execute the action
 */
function performDirectAction(task, tid, title = " ") {
    //DONT change window.open to createPopup function //MANIKANTA~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    switch (task) {
        case "listiview":
            //window.document.location.href = "./listIview.aspx?tid=" + tid;
            window.document.location.href = `./iview.aspx?ivname=${tid}&tstcaption=${title}`;
            break;
        case "tstruct":
            parent.LoadIframe("tstruct.aspx?transid=" + tid);
            break;
        case "link":
            window.open(tid, "_blank");
            break;
        case "iview-print":
            var left = (screen.width / 2) - (840 / 2);
            var top = (screen.height / 2) - (600 / 2);
            var na = "../aspx/htmliv.aspx?ivname=" + tid + "&ivtype=iview&ivKey=&params=&isPrint=true&AxFromhome=True";
            var htmlPop = window.open(na, "_blank");
            break;
        case "iview-pdf":
            var left = (screen.width / 2) - (840 / 2);
            var top = (screen.height / 2) - (600 / 2);
            var na = "../aspx/pdfiview.aspx?ivname=" + tid + "&ivtype=iview&ivKey=&params=&AxFromhome=True";;
            window.open(na, "_self", "width=840,height=600,scrollbars=yes,top=" + top + ",left=" + left + "");
            break;
        case "iview-excel":
            var left = (screen.width / 2) - (840 / 2);
            var top = (screen.height / 2) - (600 / 2);
            var na = "../aspx/excelweb.aspx?ivname=" + tid + "&ivtype=iview&params=&AxFromhome=True";
            window.open(na, "_self", "width=840,height=600,scrollbars=yes,top=" + top + ",left=" + left + "");
            break;
        default:
            // statements_def
            break;
    }
}




    /**    
     * When user click on zoom button for mhy task below function will create the detailed task details using datatable
     * @return {null} Just create the datatable with data
     */
    function createMyTaskDeatiledData() {
        if(typeof isWebServiceCall!="undefined" && isWebServiceCall=="true")
        {
            myTaskDetails;
            var tableHtml = "";
            var tableBodyHtml = "";
            var tableHeadHtml = "";
            var headData = myTaskDetails.sqlmetaData;
            var headDataLength = headData.length;
            var bodyData = myTaskDetails.data;
            var bodyDataLength = bodyData.length;
            tableHeadHtml += "<tr>";
            for (var i = 0; i < headDataLength; i++) {
                var presentHeader = headData[i];
                presentHeader = presentHeader.name;
                if (presentHeader.toLowerCase() != "sname" && presentHeader.toLowerCase() != "recordid") {
                    tableHeadHtml += "<th>" + presentHeader + "</th>";
                }
            }
            tableHeadHtml += "</tr>";

            for (var j = 0; j < bodyDataLength; j++) {

                var presentBody = bodyData[j];
                tableBodyHtml += "<tr>";
                for (var k = 0; k < headDataLength; k++) {

                    if (k != 3 && k != 4) { //for skipping recordid and transid
                        var headerTxt = presentBody[k] || "";
                        headerTxt = makeMeInitCap(headerTxt);
                        if (k == 1) {
                            var url = 'tstruct.aspx?transid=' + presentBody[3] + "&recordid=" + presentBody[4];
                            tableBodyHtml += "<td><a  onclick=\"javascript:parent.LoadIframe('" + url + "')\" href='javascript:void(0)'>" + headerTxt + "</a></td>";
                        }
                        else
                            tableBodyHtml += "<td>" + headerTxt + "</td>";
                    }
                }
                tableBodyHtml += "</tr>";

            }


            var tableHtml = "<table class='themeTable'><thead>" + tableHeadHtml + "</thead><tbody>" + tableBodyHtml + "</tbody></table>"

            $("#zoomDummyLayout .sqlContentCard").html(tableHtml);
            $.fn.dataTable.moment('DD/MM/YYYY');
            var cutMsg = eval(callParent('lcm[0]'));
            $("#zoomDummyLayout .sqlContentCard table").DataTable({
                dom: "<'#mainSearchFldSpn'f<'icon-magnifier searchIcon'>><'#dataLength'l>tip",
                language: {
                    search: "_INPUT_",
                    searchPlaceholder: "Search...",
                    "lengthMenu": "Show _MENU_ rows",
                    "emptyTable": cutMsg
                    // "zeroRecords": "Nothing found - sorry",
                    // "info": "Showing page _PAGE_ of _PAGES_",
                    // "infoEmpty": "No records available",
                    // "infoFiltered": "(filtered from _MAX_ total records)"
                },
                scrollY: 'calc(100vh - 293px)',
                scrollCollapse: true
            });

            $(".dataTables_length select").addClass('browser-default')
        }
        else{
            myTaskDetails;
            var tableHtml = "";
            var tableBodyHtml = "";
            var tableHeadHtml = "";
            var headData = myTaskDetails.metaData;
            var headDataLength = headData.length;
            var bodyData = myTaskDetails.data;
            var bodyDataLength = bodyData.length;
            tableHeadHtml += "<tr>";
            for (var i = 0; i < headDataLength; i++) {
                var presentHeader = headData[i];
                presentHeader = presentHeader.name;
                if (presentHeader.toLowerCase() != "sname" && presentHeader.toLowerCase() != "recordid") {
                    tableHeadHtml += "<th>" + presentHeader + "</th>";
                }
            }
            tableHeadHtml += "</tr>";

            for (var j = 0; j < bodyDataLength; j++) {

                var presentBody = bodyData[j];
                tableBodyHtml += "<tr>";
                for (var k = 0; k < headDataLength; k++) {

                    if (k != 3 && k != 4) { //for skipping recordid and transid
                        var headerTxt = presentBody[k] || "";
                        headerTxt = makeMeInitCap(headerTxt);
                        if (k == 1) {
                            var url = 'tstruct.aspx?transid=' + presentBody[3] + "&recordid=" + presentBody[4];
                            tableBodyHtml += "<td><a  onclick=\"javascript:parent.LoadIframe('" + url + "')\" href='javascript:void(0)'>" + headerTxt + "</a></td>";
                        }
                        else
                            tableBodyHtml += "<td>" + headerTxt + "</td>";
                    }
                }
                tableBodyHtml += "</tr>";

            }


            var tableHtml = "<table class='themeTable'><thead>" + tableHeadHtml + "</thead><tbody>" + tableBodyHtml + "</tbody></table>"

            $("#zoomDummyLayout .sqlContentCard").html(tableHtml);
            $.fn.dataTable.moment('DD/MM/YYYY');
            var cutMsg = eval(callParent('lcm[0]'));
            $("#zoomDummyLayout .sqlContentCard table").DataTable({
                dom: "<'#mainSearchFldSpn'f<'icon-magnifier searchIcon'>><'#dataLength'l>tip",
                language: {
                    search: "_INPUT_",
                    searchPlaceholder: "Search...",
                    "lengthMenu": "Show _MENU_ rows",
                    "emptyTable": cutMsg
                    // "zeroRecords": "Nothing found - sorry",
                    // "info": "Showing page _PAGE_ of _PAGES_",
                    // "infoEmpty": "No records available",
                    // "infoFiltered": "(filtered from _MAX_ total records)"
                },
                scrollY: 'calc(100vh - 293px)',
                scrollCollapse: true
            });

            $(".dataTables_length select").addClass('browser-default')
        }
    }


    /**
     * If we add zoom property for widget below function can be used to set some conditions and write logics what to di after zoom
     * @param  {String} targetId WidgetId
     * @param  {String} task     Conditions
     * @return {null}          
     */
    function zoomInTheWidget(targetId, task) {
        var targetElem = $("#" + targetId);
        var targetElemOffset = targetElem.offset();
        let widthClasees = targetElem.data("widthclass") || "m4 l3"
        $(`<div id="zoomDummyLayout"><div class="blurTheWholeScreen"></div><div class="expandingContent"></div><div class="dummyWidget col s12 ${widthClasees}  ui-state-default"></div></div>`).insertBefore(targetElem);
        targetElem.find('.titleLessCardTitleClear i').toggleClass('icon-expand icon-contract');
        targetElem.find('.titleLessCardTitleClear').attr({ 'onclick': 'zoomOutTheWidget("' + targetId + '", "' + task + '")', "title": "Collapse" });
        targetElem.css({
            width: targetElem.outerWidth() + "px",
            height: targetElem.outerHeight() + "px",
            top: targetElemOffset.top + "px",
            left: targetElemOffset.left + "px",
        });
        var detachedElem = targetElem.detach();
        $("#zoomDummyLayout .expandingContent").html(detachedElem);

        setTimeout(function() {
            $("#zoomDummyLayout .expandingContent .ui-state-default").addClass('expandMe')
            $("#zoomDummyLayout .blurTheWholeScreen").addClass('expand')

        }, 10)
        if (task == "myTsk") {
            targetElem.find('.mtskContentCard').html("<div class='sqlContentCard'></div>");
            setTimeout(function() {
                createMyTaskDeatiledData();
            }, 700)
        }
    }

    /**
     * Similar to zoom in but opposite reset the widget back when zoom out
     * @param  {String} targetId WidgetId
     * @param  {String} task     Conditions
     * @return {null}          
     */
    function zoomOutTheWidget(targetId, task) {
        var targetElem = $("#" + targetId);
        if (task == "myTsk")
            targetElem.find('.mtskContentCard').html("<div data-indicators='true' class='carousel carousel-slider center corusalAdded sqlContentCard'></div>");
        $("#zoomDummyLayout .expandingContent .ui-state-default").removeClass('expandMe');
        $("#zoomDummyLayout .blurTheWholeScreen").removeClass('expand')
        setTimeout(function() {
            var detachedElem = $("#zoomDummyLayout .expandingContent .ui-state-default").detach();
            $(detachedElem).insertAfter($("#zoomDummyLayout"));
            $("#zoomDummyLayout").remove();
            targetElem.removeAttr('style');
            targetElem.find('.titleLessCardTitleClear i').toggleClass('icon-expand icon-contract');
            targetElem.find('.titleLessCardTitleClear').attr({ 'onclick': 'zoomInTheWidget("' + targetId + '", "' + task + '")', "title": "Expand" });
            if (task == "myTsk") {
                createMyTaskData(myTaskDetails, targetId)
            }

        }, 400)
    }

    function modifyTheMsgForInvSess(msg) {
        //    msg = response.errMsg;
        if (msg.toLowerCase() == "not a valid session") {
            msg = eval(callParent('lcm[124]'));
        }

        return msg;
    }
    /**
     * To show the filter by fliping the widget so that user will enter the values manually
     * @author ManiKanta
     * @Date   2018-08-30T11:39:45+0530
     * @param  {String}                 options.target target widget to show filters
     * @return {}                                
     */
    function flipAndshowFlitersInWidget({ target = "" }) {
    let dynamicWidget = false;
    let widgetTargetId = "";
    let dynamicWidgetType = "";
    if (target === "C__dynamic") {
        dynamicWidget = true;
        target = $("#C__dynamicWrapper").data("dwidgetid");
        dynamicWidgetType = $("#C__dynamicWrapper").data('widgettype');
        widgetTargetId = "C__dynamicWrapper";
    } else {
        widgetTargetId = target + "Wrapper";
    }
    const widgetElement = $("#" + widgetTargetId);

    if (widgetElement.find('.widgetINParamsCloseIcon').length) {
        resetTheFlippedContainer({ container: widgetElement })
        return;
    }

    const targetType = widgetElement.data("type");
    let paramsArray = [];
    if (targetType === "iview" || dynamicWidgetType === "i") {
        target = target.substr(1); //removing the first character which is 'i'(iview) always
        const iviewObject = iviewInfo[target] || {};
        paramsArray = iviewObject.params;
    } else if (targetType === "widget") {
        paramsArray = homeJsonObj.jsonContent.jsonData[widgetTargetId].wParams || [];
    }

    if (paramsArray && paramsArray.length) {
        let iviewParamHTML = `<button title='close' onclick='flipAndshowFlitersInWidget({ target : "${widgetElement.data('target')}"})' class='widgetINParamsCloseIcon waves-effect waves-light btn-flat' type='button'><i class='icon-cross'></i></button>`;
        // iviewParamsArray = ["asdf", "rewwe", "dghdg", "wevew", "powerjwe", "irnro", "ewvwwe", "weonfeo", "wefwefo"]
        paramsArray.forEach((param, idx) => {
            iviewParamHTML +=
                ` <div style="display:none;" class="row inputfldRow">
                    <div class="input-field col s12">
                      <input id="param${idx}" data-name=${param} class="widgetParameter" type="text">
                      <label for="param${idx}">${param}</label>
                    </div>
                  </div>`;
        });

        if (dynamicWidget) {
            targetToSend = "C__dynamic";
        } else if (targetType === "widget") {
            targetToSend = target;
        } else if (targetType === "iview") {
            targetToSend = "i" + target;
        }

        let btnWrapperCustomClass = "";
        if (widgetElement.outerWidth() > 600) {
            btnWrapperCustomClass += " right-align"
        }else{
            btnWrapperCustomClass += " center-align"
        }

        iviewParamHTML += `<div class="row customParamBtnWrapper ${btnWrapperCustomClass}"><button onclick="applyCustomParametersForWidget({ target: '${targetToSend}', targetType:'${targetType}' });" type="button" class="waves-effect waves-light themeButton applyButton btn">Apply</button></div>`

        const flipContainer = widgetElement.find('.flip-container');
        flipContainer.find('.flipper-back').html(iviewParamHTML);
        flipContainer.find('.widgetParameter').on('keydown', function(e) {
            if (e.keyCode === 13) {
                const parentElem = $(e.currentTarget).parents('.ui-state-default');
                applyCustomParametersForWidget({ target: parentElem.data("target"), targetType:parentElem.data("type") });
            }
        });

        //since the animation will take one second to complete
        setTimeout(function() {
            flipContainer.find('.inputfldRow').show('fast');
            flipContainer.find('.flipper-back').mCustomScrollbar({
                axis: "yx", // vertical and horizontal scrollbar
                theme: "minimal-dark",
                scrollInertia: 500,
                autoExpandScrollbar: false,
                updateOnContentResize: true
            });
            tabFocusEventHandler({task:"bind", parentElem:flipContainer.find('.flipper-back'), loopInsideParent:true, notOf:".widgetINParamsCloseIcon"});
        }, 550)

        flipContainer.addClass('hover');
        widgetElement.addClass('flippedBack');
    } else {
        showAlertDialog("warning", "No parameters");
    }
}



function applyCustomParametersForWidget({ target, targetType }) {
    let widget = $("#" + target + "Wrapper");
    let widgetData = {};
    widget.find('.flipper-back .widgetParameter').each(function(index, el) {
        let presElem = $(this);
        let value = presElem.val();
        if (value !== "") {
            widgetData[presElem.data('name')] = value;
        }
    });

    if (targetType === "Custom__dynamic" || targetType === "iview") {
        let iviewName = "";
        if (targetType === "Custom__dynamic") {
            iviewName = $("#C__dynamicWrapper").data("dwidgetid").substr(1);
        } else {
            iviewName = target.substr(1);
        }
        if (iviewInfo[iviewName]) {
            iviewInfo[iviewName].oldParamValues = widgetData;
        }
        ajaxCallObj.getIviewDataNew({ target, customParams: widgetData, calledFrom: 'customParameters' });
    } else if (targetType === "widget") {
        ajaxCallObj.getAxpertWidgetDetails({ tId: target, customParams: widgetData, widgetId: target.substr(6), calledFrom: "customParameters" });
    }
}


function createInlineWidgetSearch({ target }) {
    const widget = $("#" + target + "Wrapper");
    const oldInlineWidgetSrch = widget.find('.inlineWidgetSearch');

    if (oldInlineWidgetSrch.length > 0) {
        if (!oldInlineWidgetSrch.is(':visible')) {
            oldInlineWidgetSrch.show();
            oldInlineWidgetSrch.find('.mainSrchFld').focus();
        }
        return
    }

    const targetType = widget.data('type');
    if (targetType === "iview" || targetType === "Custom__sql" || (targetType === "Custom__dynamic" && widget.data('widgettype') === "i")) {
        let searchHTML = "";

        let metaData = [];
        if (targetType === "Custom__sql") {
            metaData = querymetaDataInfo[target + "Wrapper"];
        } else {
            metaData = querymetaDataInfo[target];
        }


        let invalidColumnNames = ["axphide_", "axrnum"];
        let optionsHTML = "";
        metaData.forEach((element, index) => {
            if ($.inArray(element.toLowerCase(), invalidColumnNames) === -1) {
                optionsHTML += `<option value="${index + 1}">${element.toLowerCase()}</option>`
            }
        });

        let widgetInnerWidth = (widget.width() || 100) - 25//removing padding

        searchHTML = `<div class="inlineWidgetSearch" style="width:${widgetInnerWidth}px">
                <div class="columnSelection">
                    <select onchange="onInlineSearchColumnSelectionChange({widgetId:'${target+"Wrapper"}'})" class="browser-default">
                        <option value="" selected>All</option>
                        ${optionsHTML}
                    </select>
                </div>
                <div class="mainSearchWrapper">
                    <input class="mainSrchFld" onkeyup="onInpChangeSearchTheTable({widgetId:'${target+"Wrapper"}',event:event})" type="text" />
                    <span class="iconsWrapper">
                        <button type="button" title="Close" onclick="closeInlineWidgetSearch({widgetId:'${target+"Wrapper"}'})" class="waves-effect waves-light btn-flat"><span class="icon-cross"></span></button>
                    </span>
                </div>
            </div>`;


        let insertBeforeElem = "";

        if (targetType === "Custom__sql") {
            insertBeforeElem = widget.find('.sqlContentCard table');
        }else{
            insertBeforeElem = widget.find('.flipper-front .cardContentData table')
        }

        $(searchHTML).insertBefore(insertBeforeElem);
        widget.find('select').material_select();
        widget.find('.mainSrchFld').focus();
        widget.find('.inlineWidgetSearch .dropdown-content').css('min-width', widgetInnerWidth+"px");
    }
}

function closeInlineWidgetSearch({widgetId}) {
    const widget = $("#" + widgetId);
    widget.find('.inlineWidgetSearch').hide();
}

function onInlineSearchColumnSelectionChange({widgetId}){
    const widget = $("#" + widgetId);
    const srchFld = widget.find('.mainSearchWrapper input');
    if (srchFld.val() !== ""){
        onInpChangeSearchTheTable({widgetId});
    }
    srchFld.focus();
}

function onInpChangeSearchTheTable({widgetId,event = {}}) {
    if (event.keyCode === 27) {
        closeInlineWidgetSearch({widgetId});
        return
    }
    const widget = $("#" + widgetId);
    const table= widget.find('table');
    const keyword = widget.find('.mainSearchWrapper input').val();
    const columnIndex = widget.find('.columnSelection select').val();
    searchTheTableData({ table, keyword, columnIndex });
}
