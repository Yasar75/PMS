const templateInfo = {

    // templateId : 

};

const templateImagePath = "../images/TemplateImages/";
const metaDataCacher = {};
const searchPageData = {};
var isWebServiceCall=typeof homepagews=="undefined"?"false": homepagews;
var tempPageId;
var wsQueryData=[];
var isWidgetGroup = "N";
var enableSlick = false;

const slickTabObj = {
    cf: [
        {
            ht: (isMobileDevice() ? "120px" : undefined), 
            wd: "l3 m3 s6", 
            br: "15px",  
            tr:  { 
                html: "#TITLE_NAME#"
            }

        }
    ]         
} 

const slickWidObj = {//default slick/wg widgets properties
    fb:"hide",
    ic:"icon-camera",
    icc:"#000000",
    tc:"#000000",
    tbc:"#ffffff",
    bc:"#000000",
    bbc:"#ffffff", 
    kpiColor:"white",
    // cdb : "hide"
}

$("#HPBtabsHaeder").off('click.tabss').on('click.tabss', 'a', function(e) {
    const targetElemParent = $(e.target).parent();
    const elem = $(this);
    const isMyPage = elem.data('ismyhomepage');
    const tabId = elem.data('tid');
    const publishTabId = elem.data('ptid');



    if (elem.hasClass('newTab')) {
        recreateHomePage({ data: "newTab", tabId });
        elem.removeClass('newTab');
        return false;
    }

    if (presBuiildMode !== "homeRun") {
        if (targetElemParent.length && (targetElemParent.hasClass('deleteTab') || $(e.target).hasClass('deleteTab') )) {
            // means we need to delete the tab
            createConfirmBox("deleteTab", parent.lcm[9], tabId);
            e.stopImmediatePropagation();
            return false;
        }

        if (!elem.hasClass('active')) {
            if (!changesTracker("pageChange")) {
                e.stopImmediatePropagation();
                return false;
            }
        }
    }

    if (presBuiildMode === "homeBuild" && isAccessable) {
        if (isMyPage) {
            toggleToolBxInBuilder("hide");
        } else {
            toggleToolBxInBuilder("show");
        }
    }

    if (elem.hasClass('firstClick')) {
        elem.removeClass('firstClick');
        ajaxCallObj.getTabData(tabId, publishTabId, isMyPage);
    } else if (elem.hasClass('newTab')) {
        //need to open the property sheet of the page
        elem.removeClass('newTab');
        recreateHomePage({ data: "newTab", tabId });
        if (presBuiildMode !== "homeRun") {
            openProprtySht("page", tabId);
        }
    } else if (presBuiildMode !== "homeRun" && elem.hasClass('active')) {
        openProprtySht("page", tabId)
    } else {
        ajaxCallObj.getTabData(tabId, publishTabId, isMyPage);
    }
});

function GetHomePageWS(module,title,pageid)
{
    var wsData;
    $.ajax({
        type: "POST",
        url: "../WidgetWebService.asmx/GetHomePageDetail",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({
            module: module,title:title,pageid:pageid
        }),
        async: false,
        cache: false,
        success: function (response) {
            wsData= response.d;
        },
        failure: function (response) {
            onAjaxFailure();
        }
    });
    return wsData;
}

class HomePage extends MainAjaxCalls {
    getTabData(tabId, publishTabId, isMyPage,pwData) {
        if(isWebServiceCall=="true")
        {
            if (isPageBuilder) {
                sqlParamsInfo = {};
            } else {
                var { data: cachedData, widgetOrder } = homeJsonObj.jsonContent.pageData[tabId];

                if (cachedData) {
                    recreateHomePage({ data: cachedData, tabId, isMyPage, widgetOrder });
                    return;
                }
            }

            var metaData = pwData.metaData;
            if (metaData) {
                var cachedMetaData = metaDataCacher.widgetData = {};
                metaData.forEach(function(element, index) {
                    cachedMetaData[element.name] = index;
                });
            }
            if (pwData.data) {
                const cacheTabDataTo = homeJsonObj.jsonContent.pageData[tabId];
                cacheTabDataTo.data = pwData.data;
                let userWidgetOrder = pwData.user_widgets && pwData.user_widgets[0] ? JSON.parse(pwData.user_widgets[0]) : "";
                cacheTabDataTo.widgetOrder = userWidgetOrder;
                recreateHomePage({ data: pwData.data, tabId, isMyPage, widgetOrder: userWidgetOrder });
            } else {
                clearThePreviousHomePage();
                //filterErrorMessageAndShow(pwData);
            }

        }
        else{
            if (isPageBuilder) {
                sqlParamsInfo = {};
            } else {
                var { data: cachedData, widgetOrder } = homeJsonObj.jsonContent.pageData[tabId];

                if (cachedData) {
                    recreateHomePage({ data: cachedData, tabId, isMyPage, widgetOrder });
                    return;
                }
            }

            var settings = primaryApiSettings();
            settings.url = apiBase + "getPageWidgets";
            settings.async=false;
            settings.data.hp_id = tabId;
            if (publishTabId) {
                settings.data.p_hp_id = publishTabId;
            }

            let type;
            if (presBuiildMode === "homeBuild") {
                type = "saved";
                if (!isAccessable)
                    type = "publish";
            } else if (presBuiildMode === "homeRun") {
                type = "publish";
            }
            settings.data.type = type;

            $.ajax(settings).done(function(response) {
                var metaData = response.metaData;
                if (metaData) {
                    var cachedMetaData = metaDataCacher.widgetData = {};
                    metaData.forEach(function(element, index) {
                        cachedMetaData[element.name] = index;
                    });
                }
                if (response.status) {
                    const cacheTabDataTo = homeJsonObj.jsonContent.pageData[tabId];
                    cacheTabDataTo.data = response.data;
                    let userWidgetOrder = response.user_widgets && response.user_widgets[0] ? JSON.parse(response.user_widgets[0]) : "";
                    cacheTabDataTo.widgetOrder = userWidgetOrder;
                    recreateHomePage({ data: response.data, tabId, isMyPage, widgetOrder: userWidgetOrder });
                } else {
                    clearThePreviousHomePage();
                    filterErrorMessageAndShow(response);
                }
            }).fail(function(jqXHR, textStatus, errorThrown) {
                onAjaxFailure();
            });
        }
       // parent.closeFrame();
        callParentNew("closeFrame()","function");
    }

    getSavedTabs(onlyPrivate) {
        if(isWebServiceCall=== "true")
        {
            var resdata= GetHomePageWS('','','');
            if(resdata!=="" && resdata.ppData!==""){
                var ppData= $.parseJSON(resdata.ppData);
                var ptData= $.parseJSON(resdata.ptData);
                var pwData= $.parseJSON(resdata.pwData);
                if(resdata.gwdData!=="")
                    wsQueryData= $.parseJSON(resdata.gwdData);
                var data = ppData.data[0];
                var metaData = ppData.metaData;
                if (metaData) {
                    var cachedMetaData = metaDataCacher.tabData = {};
                    metaData.forEach(function(element, index) {
                        cachedMetaData[element.name] = index;
                    });
                }

                if (presBuiildMode === "homeRun" && isPageBuilder) {
                    let pageId =tempPageId= data[cachedMetaData.PAGE_ID];
                    let pageTitle = data[cachedMetaData.TITLE];
                    let pageTemplate = data[cachedMetaData.TEMPLATE];
                    let pageIsDefault = data[cachedMetaData.IS_DEFAULT];
                    let pageWidgetGroups = data[cachedMetaData.WIDGET_GROUPS];

                    homeJsonObj.jsonContent.pageData = {
                        [pageId]: {
                            tabData: [pageId, pageTitle, pageTemplate, pageIsDefault, pageWidgetGroups]
                        }
                    };
                    if(pageId){
                        if(typeof parent.templateInfo === "undefined" || parent.templateInfo.length === 0)
                            ajaxCallObj.getTmplateInfo(pageTemplate,ptData);
                        ajaxCallObj.getTabData(pageId, pageId,undefined ,pwData);
                    }
                    $("#HPBdesignerCanvas .title").text(pageTitle);
                    return
                }
            }
            //else{
            //    filterErrorMessageAndShowWs("no data found","warning");
            //}
        }else{
            var settings = primaryApiSettings();
            settings.data.rty = userResps.toString();
            settings.data.rls = userroles.toString();
            if (onlyPrivate) {
                settings.url = apiBase + "getPriPagePublish";
            } else {
                if (presBuiildMode === "homeRun") {
                    settings.url = apiBase + "getPublishedPages";
                } else {
                    settings.url = apiBase + "getSavedPages";
                }
            }
            $.ajax(settings).done(function(response) {
                if (onlyPrivate) {
                    ajaxCallObj.getSavedTabs();
                }
                var data = response.data;
                var metaData = response.metaData;
                if (metaData) {
                    var cachedMetaData = metaDataCacher.tabData = {};
                    metaData.forEach(function(element, index) {
                        cachedMetaData[element.name] = index;
                    });
                }

                if (presBuiildMode === "homeRun" && isPageBuilder) {
                    //createPagesForUser(response.data, cachedMetaData);
                    let pageId = data[cachedMetaData.PAGE_ID];
                    let pageTitle = data[cachedMetaData.TITLE];
                    let pageTemplate = data[cachedMetaData.TEMPLATE];
                    let pageIsDefault = data[cachedMetaData.IS_DEFAULT];
                    let pageWidgetGroups = data[cachedMetaData.WIDGET_GROUPS];

                    homeJsonObj.jsonContent.pageData = {
                        [pageId]: {
                            tabData: [pageId, pageTitle, pageTemplate, pageIsDefault, pageWidgetGroups]
                        }
                    };
                    if(pageId){
                        //    ajaxCallObj.getTabData(pageId, pageId);
                        if(typeof parent.templateInfo === "undefined" || parent.templateInfo.length === 0)
                            ajaxCallObj.getTmplateInfo(pageTemplate);
                        ajaxCallObj.getTabData(pageId, pageId);
                        //if(jQBrowser.mozilla)
                        //    $(".heightOfcardContentMainWrapper.cardContentMainWrapper").css("margin-top","33px");
                    }
                    $("#HPBdesignerCanvas .title").text(pageTitle);
                    return
                }


                if (response.status) {

                    var finalTabHtml = "",
                        myTabHtml = "";
                    var chacheTabs = homeJsonObj.jsonContent.pageData;
                    if (!chacheTabs) {
                        chacheTabs = homeJsonObj.jsonContent.pageData = {};
                    }

                    if (data) {
                        for (var i = 0; i < data.length; i++) {
                            var presTab = data[i];
                            var tabId = presTab[cachedMetaData.PAGE_ID];
                            const tabName = presTab[cachedMetaData.TITLE];
                            searchPageData[tabName] = i;
                            let isPublished = "";
                            let isPrivate = "";

                            /**
                             * So the idea when a person having home build then the tabs in the home build + the tabs 
                             * which user have access should come i.e.,
                             * Tab 1 is created for sales,marketting
                             * when a user logged in who has home build access and sales resposibilty 
                             * then tab 1 need to come in home build + user tabs also need to come so user can change view
                             * For that we need to clone that tab details twice
                             * instea of maintaing two times the data in object
                             * Let keep the keyname something like clone+id and point to the original Obj
                             * For that will use a variable needToClone which will tell user must get both tabs then will clone that tab twice
                             * 
                             *
                             * @ManiKanta 24th Apr 2018
                             */
                            let needToClone = false;

                            chacheTabs[tabId] = {
                                tabData: presTab
                            };
                            if (presBuiildMode !== "homeRun") {
                                var publishedTabId = presTab[cachedMetaData.PARENT_PAGE_ID];
                                var resps = presTab[cachedMetaData.RESPONSIBILITY];
                                var status = "save";
                                isPublished = presTab[cachedMetaData.IS_PUBLISH] === "N" ? "notPublished" : "";
                                isPrivate = presTab[cachedMetaData.IS_PRIVATE];
                                if (isPublished === "") {
                                    status = "published";
                                    status = isPrivate === "Y" ? "private" : status;
                                } else {
                                    isDataPublished = "N"
                                }
                                if (!isPageBuilder) {
                                    if (status !== "save") {
                                        if (isPrivate !== "Y") {
                                            if (resps) {
                                                resps = resps.split(",");
                                                resps.forEach(responsibility => {
                                                    if (responsibility != "") {
                                                        if ($.inArray(responsibility, alreadyUsedResp) === -1) {
                                                            alreadyUsedResp.push(responsibility);
                                                        }
                                                        if ($.inArray(responsibility, userResps) !== -1) {
                                                            //means this is mytab for user
                                                            needToClone = true;
                                                        }
                                                    }
                                                });
                                            }
                                        } else {
                                            //means its a private tab then its mytab-:) so we can clone
                                            needToClone = true;
                                        }
                                    }
                                }
                                allTabNames.push(tabName)

                            }

                            let delteBtnHtml = "",
                                tabStatus = "";
                            if (presBuiildMode === "homeBuild") {
                                if (isAccessable) {
                                    delteBtnHtml = '<button class="deleteTab waves-effect waves-red btn-flat"><span class="icon-cross"></span></button>';
                                    tabStatus = changePageStatus(status, "onlyHtml");
                                }

                                if (needToClone) {
                                    chacheTabs[`cache${tabId}`] = {
                                        tabData: tabId
                                    };

                                    //if user dont have build mode access then need to show mytabs or else hide them

                                    myTabHtml += `<li style="display:${isAccessable ? 'none' : 'inherit'};" id="pageTab_cache${i}" class="tab myPageTab pageTab col s2"><a data-ptid = ${publishedTabId} data-ismyhomepage=true data-tid=${tabId} data-status="${isPublished}" href="#tab_clone${i}">${changePageStatus("myPage", "onlyHtml")}<span class="tabTitle">${tabName}</span></a></li>`;

                                }

                            }
                            if (presBuiildMode === "homeRun") {
                                finalTabHtml += '<li id="pageTab' + i + '" class="tab pageTab col s2"><a data-ptid = ' + tabId + '  data-tid=' + tabId + ' data-ismyhomepage=true data-status="' + isPublished + '" href="#tab' + i + '">' + tabStatus + '<span class="tabTitle">' + tabName + '</span>' + delteBtnHtml + '</a></li>';
                            } else {
                                if (isAccessable) {
                                    var displayNone =  (i>0) ? "none" : "inherit" ;
                                    finalTabHtml += '<li style="display:'+ displayNone +'" id="pageTab' + i + '" class="tab pageTab col s6"><a data-ptid = ' + publishedTabId + '  data-tid=' + tabId + ' data-status="' + isPublished + '" href="#tab' + i + '" title ="'+ tabName +'">' + tabStatus + '<span class="tabTitle">' + tabName + '</span>' + delteBtnHtml + '</a></li>';
                                }
                            }



                        }
                    }
                    $("#HPBtabsHaeder").prepend(myTabHtml + finalTabHtml);
                    $("#HPBtabsHaeder").show();
                    recreateTheHeaderTabs();
                    $("#HPBtabsHaeder .pageTab:visible a:first").addClass('firstClick').click();
                } else {
                    filterErrorMessageAndShow(response);
                }

            }).fail(function(jqXHR, textStatus, errorThrown) {
                onAjaxFailure();
            });
        }
       // parent.closeFrame();
        callParentNew("closeFrame()","function");
    }

    getTmplateInfo(templateId,ptData) {
        if(isWebServiceCall=="true")
        {
            const templates = ptData.data;
            let templateListHtml = "";
            let templateSelctorHtml = "";

            templates.forEach((template, idx) => {
                let [templateId, templateName, templateJson] = template;
                templateJson = JSON.parse(templateJson.replace(/\\"/g, "\\\\\""));
                templateInfo[templateId] = templateJson
                if (presBuiildMode !== "homeRun") {
                    templateSelctorHtml += '<div class="center templateIconWrapper">';
                    templateSelctorHtml += `<a data-tmpid = ${templateId} title="${templateName}" class="iconAnchr hoverFocusThemeColor ${idx === 0 ? 'createTick' : ''}" href="javascript:void(0)">`;
                    templateSelctorHtml += `<img src="${templateImagePath + (templateJson.img || "theme1.png")}" alt="">`;
                    templateSelctorHtml += `<p>${templateName}</p>`;
                    templateSelctorHtml += '</a>';
                    templateSelctorHtml += '</div>';
                    //~~~~~~~~~~~~~~~~~
                    templateListHtml += '<li>';
                    templateListHtml += `<a data-tmpid = ${templateId} title="${templateName}" href="#!"> `;
                    templateListHtml += `<span>${templateName}</span>`;
                    templateListHtml += `<img src="${templateImagePath + (templateJson.img || "theme1.png")}" alt="">`;
                    templateListHtml += '</a>';
                    templateListHtml += '<span class="clear"></span>';
                    templateListHtml += '</li>';
                }

            });
            parent.templateInfo = templateInfo;
            $("#hpbPageTemplateSelector .templateWrapper").html(templateSelctorHtml);
            $("#prpShtTmpFropDwn").html(templateListHtml);
        }else{
            var settings = primaryApiSettings();
            settings.async = false;
            settings.url = apiBase + "getPageTemplates";
            if(templateId != 'undefined'){         
                settings.data.tId = templateId;   
            }

            $.ajax(settings).done(function(response) {
                //console.log(response);
                if (response.status) {
                    const templates = response.data;
                    let templateListHtml = "";
                    let templateSelctorHtml = "";

                    templates.forEach((template, idx) => {
                        let [templateId, templateName, templateJson] = template;
                        templateJson = JSON.parse(templateJson);
                        templateInfo[templateId] = templateJson
                        if (presBuiildMode !== "homeRun") {
                            templateSelctorHtml += '<div class="center templateIconWrapper">';
                            templateSelctorHtml += `<a data-tmpid = ${templateId} title="${templateName}" class="iconAnchr hoverFocusThemeColor ${idx === 0 ? 'createTick' : ''}" href="javascript:void(0)">`;
                            templateSelctorHtml += `<img src="${templateImagePath + (templateJson.img || "theme1.png")}" alt="">`;
                            templateSelctorHtml += `<p>${templateName}</p>`;
                            templateSelctorHtml += '</a>';
                            templateSelctorHtml += '</div>';
                            //~~~~~~~~~~~~~~~~~
                            templateListHtml += '<li>';
                            templateListHtml += `<a data-tmpid = ${templateId} title="${templateName}" href="#!"> `;
                            templateListHtml += `<span>${templateName}</span>`;
                            templateListHtml += `<img src="${templateImagePath + (templateJson.img || "theme1.png")}" alt="">`;
                            templateListHtml += '</a>';
                            templateListHtml += '<span class="clear"></span>';
                            templateListHtml += '</li>';
                        }

                    });

                    parent.templateInfo = templateInfo;

                    $("#hpbPageTemplateSelector .templateWrapper").html(templateSelctorHtml);
                    $("#prpShtTmpFropDwn").html(templateListHtml);

                } else {
                    filterErrorMessageAndShow(response);
                }
            }).fail(function(jqXHR, textStatus, errorThrown) {
                onAjaxFailure();
            });
        }
    }

    getPageInfo({ pageId, title,wspiData, cb }) {
        if(isWebServiceCall=="true")
        {
            if (wspiData.data[0]!="") {
                const metaInfo = reduceTheMetaData(wspiData.metaData);
                metaDataCacher.tabData = {
                    PAGE_ID: metaInfo["PAGE_ID"],
                    TEMPLATE: metaInfo["TEMPLATE"],
                    TITLE: metaInfo["TITLE"],
                    IS_DEFAULT: metaInfo["IS_DEFAULT"],
                    WIDGET_GROUPS: metaInfo["WIDGET_GROUPS"]
                }
                if (cb && typeof cb === "function") {
                    const  data  = wspiData.data[0];
                    cb({ pageId: data[metaInfo["PAGE_ID"]], pageTitle: data[metaInfo["TITLE"]], pageTemplate: data[metaInfo["TEMPLATE"]], isDefault: (data[metaInfo["IS_DEFAULT"]] || "N"), widgetGroups: (data[metaInfo["WIDGET_GROUPS"]] || "N") });
                }
            } else {
                filterErrorMessageAndShowWs("no data found","warning");
            }
        }
        else{
            var settings = primaryApiSettings();
            settings.url = apiBase + "getPageInfo";
            settings.data.name = title;
            settings.data.page_id = pageId;

            $.ajax(settings).done(function(response) {
                if (response.status == true) {
                    const metaInfo = reduceTheMetaData(response.metaData);
                    metaDataCacher.tabData = {
                        PAGE_ID: metaInfo["PAGE_ID"],
                        TEMPLATE: metaInfo["TEMPLATE"],
                        TITLE: metaInfo["TITLE"],
                        IS_DEFAULT: metaInfo["IS_DEFAULT"],
                        WIDGET_GROUPS: metaInfo["WIDGET_GROUPS"]
                    }
                    if (cb && typeof cb === "function") {
                        const { data } = response;
                        cb({ pageId: data[metaInfo["PAGE_ID"]], pageTitle: data[metaInfo["TITLE"]], pageTemplate: data[metaInfo["TEMPLATE"]], isDefault: (data[metaInfo["IS_DEFAULT"]] || "N"), widgetGroups: (data[metaInfo["WIDGET_GROUPS"]] || "N") });
                    }
                } else {
                    filterErrorMessageAndShow(response);
                }
            }).fail(function(jqXHR, textStatus, errorThrown) {
                onAjaxFailure();
            });
        }
    }
}



function recreateHomePage({ data, tabId, isMyPage, widgetOrder }) {
    clearThePreviousHomePage();
    $("#sortable").data("t_id", tabId);
    if (data === "newTab") {
        return;
    }
    const jsonMetaData = metaDataCacher.widgetData;
    var dataLth = data.length;
    var jsonOrder = homeJsonObj.jsonContent.jsonOrder;
    for (var i = 0; i < dataLth; i++) {
        var presData = data[i]; //IS_PRIVATE
        var target = presData[jsonMetaData["TARGET"]];
        var isPrivate = presData[jsonMetaData["IS_PRIVATE"]];
        var isDeleted = presData[jsonMetaData["IS_DELETED"]];
        var isPublished = presData[jsonMetaData["IS_PUBLISH"]];
        var targetId = target + "Wrapper";
        var idInArray = $.inArray(targetId, jsonOrder);

        if (presBuiildMode === "homeBuild") {
            if (isDataPublished !== "N" && isPublished === "N") {
                isDataPublished = "N";
            }
            if (isDeleted !== "Y" && isPrivate === "Y" && idInArray !== -1) {
                jsonOrder[idInArray] = "";
                idInArray = -1;
            }
        }


        if (idInArray === -1) {
            if (isDeleted === "Y") {
                targetId = presData[jsonMetaData["WIDGET_ID"]] + "Wrapper~D";
                deletedLstArray.push(targetId);
            } else {
                jsonOrder.push(targetId);
            }

            var jsonData = presData[jsonMetaData["CONTENT"]];
            if(isWebServiceCall=="true"){
                jsonData=jsonData.replace(/\t/g, "")
                jsonData = jsonData ? JSON.parse(jsonData.replace(/\\"/g, "\\\\\"").replace(new RegExp("\\n", "g"), "")) : {};
            }
            else
                jsonData = jsonData ? JSON.parse(jsonData) : {};
            jsonData.hid = presData[jsonMetaData["WIDGET_ID"]];
            jsonData.pid = presData[jsonMetaData["PARENT_WIDGET_ID"]];
            jsonData.isRespChanged = "N";
            if (targetId.indexOf("C__") !== -1)
                jsonData.ctg = target;
            if (isPublished === "N") {
                jsonData.pid = null;
            } else {
                jsonData.pid = presData[jsonMetaData["PARENT_WIDGET_ID"]];
            }
            jsonData.isU = "N";
            homeJsonObj.jsonContent.jsonData[targetId] = jsonData;
        }

    }
    homeJsonObj.jsonDataa = homeJsonObj.jsonContent.jsonData;
    var presTemplate = getTheTemplat(tabId);
    createHomeWidgets(homeJsonObj.jsonContent, presTemplate, isMyPage, widgetOrder);

}


function clearThePreviousHomePage() {
    var presTabId = $("#sortable").data("t_id");
    if (presTabId) {
        if (presBuiildMode === "homeBuild") {
            closeProprtySht();
            $("#HPBToolBox li.collection-item.widgetCreated").removeClass('widgetCreated').draggable("enable");
            $("#HPBToolBox li.collection-item.createBadge").removeClass('createBadge').data("count", null).removeAttr('data-count');
            menuSelectedList = [];
            deletedLstArray = [];
            isDataPublished = "Y";
        }
        $("#sortable").html("");
        homeJsonObj.jsonContent.length = 0;
        homeJsonObj.jsonContent.jsonData = {};
        homeJsonObj.jsonContent.customWidget = {};
        homeJsonObj.jsonContent.jsonOrder = [];
        isChangesMade = false;
    }

}


function createHomeWidgets(jsonContent, presTemplate, isMyPage, widgetOrd) {
    if(presBuiildMode === "homeRun" || presBuiildMode === "homeBuild"){
        try {
            if(presBuiildMode === "homeRun"){
                isWidgetGroup = jsonContent.pageData[Object.keys(jsonContent.pageData)[0]].tabData[metaDataCacher.tabData["WIDGET_GROUPS"]] || "N";
            } else {
                isWidgetGroup = jsonContent.pageData[$("#HPBtabsHaeder .pageTab a.active").data('tid')].tabData[metaDataCacher.tabData["WIDGET_GROUPS"]];
            }
        } catch (ex) { }
        enableSlick = ((presTemplate.name == "basic") && (isWidgetGroup == 'Y') && (presBuiildMode === "homeRun"))? true : false;
    }   
    var jsonData = jsonContent.jsonData;
    var jsonLength = jsonContent.length;
    var customWidgetInfo = jsonContent.customWidget;
    var jsonOrder = jsonContent.jsonOrder;
    if (isMyPage && widgetOrd) {
        //need to take this order
        jsonOrder = sortTheArrayBasedOnUserWidgetOrder(jsonOrder, widgetOrd);
    }
    var jsonOrderLength = jsonOrder.length;
    for (var i = 0; i < jsonOrderLength; i++) {
        let isWidgetHidden = false;
        var key = jsonOrder[i];
        if (presBuiildMode === "homeBuild" && isMyPage && widgetOrd) {
            //then some keys will start with __hide__(8 Chars) since that widget is hidde for user but still need to show in buildMode As blur
            if (key.indexOf("__hide__") === 0) {
                isWidgetHidden = true;
                key = key.substr(8);
            }
        }

        if (jsonData.hasOwnProperty(key)) {
            var presentWidget = jsonData[key];
            if(enableSlick){
                presentWidget = $.extend(true, jsonData[key], slickWidObj);
            }
            var type = presentWidget.c;
            var homeWidgetId = presentWidget.tg;
            var targetId;
            var targetType;
            var widgStatus = presentWidget.pid ? (presentWidget.ip === "Y" ? "private" : "published") : "save";
            if (presBuiildMode === "homeRun") {
                targetType = {};
                presentWidget.ctg ? (targetId = presentWidget.ctg, targetType.t = presentWidget.tgt, targetType.tg = presentWidget.tg) : (targetId = presentWidget.tg, targetType.t = presentWidget.c, targetType.tg = presentWidget.tg);
            } else {
                presentWidget.ctg ? targetId = presentWidget.ctg : targetId = presentWidget.tg;
            }
            let liveWidgetId = "";
            let isExpanding = false;
            let isRefreshableWidget = false;
            let paginationButtons = false;
            let breadCrumb = false;
            let filterButton = false;
            let widgetSearch = false;
            let typeOfWidget = presentWidget.c;

            if (presBuiildMode === "homeRun") {
                if (presentWidget.cwd === "Y" || presentWidget.cwd === true) {
                    isRefreshableWidget = true;
                }

                if (typeOfWidget === "Custom__mytsk") {
                    isExpanding = "myTsk";
                }



                if (typeof isPageBuilder !== "undefined" && isPageBuilder) {
                    if (typeOfWidget === "tstruct") {
                        if (presentWidget.dl === "Y") {
                            liveWidgetId = presentWidget.tg.substr(1);
                            isExpanding = true;
                        }
                    }

                    if (typeOfWidget === "Custom__dynamic") {
                        isExpanding = true;
                    }

                    if (typeOfWidget === "iview" || typeOfWidget === "Custom__dynamic") {
                        paginationButtons = true;
                        widgetSearch = true;
                    }

                    if (typeOfWidget === "Custom__sql") {
                        // paginationButtons = true;
                        widgetSearch = true;
                    }

                    if (typeOfWidget === "iview" || typeOfWidget === "widget" || typeOfWidget === "Custom__dynamic") {
                        filterButton = typeOfWidget;
                    }
                }
            }
            if(enableSlick){
                presTemplate = $.extend(true, presTemplate, slickTabObj);
            }
            var panelHtml = getPanelHtml({
                targetType,
                isWidgetHidden,
                isMyPage,
                templateObj: presTemplate,
                idx: i,
                type: typeOfWidget,
                title: presentWidget.tl,
                target: targetId,
                isFirstTime: "",
                scenaRio: widgStatus,
                calledFrom: "builder",
                liveWidgetId,
                isRefreshableWidget,
                paginationButtons,
                breadCrumb,
                isExpanding,
                flipCard: filterButton,
                widgetSearch,
                hid:presentWidget.hid,
            });

            $("#hpbDsgnrcnvsWrapper #sortable.mainWidgetAddedWrapper").append(panelHtml);
            var createdWidget = $("#" + key);
            if (presentWidget.tr == "hide") {
                createdWidget.find('.cardTitleWrapper').hide();
                createdWidget.find('.card-content').addClass('titleRemoved');
                createdWidget.find('.cardContentMainWrapper').addClass('mainTitleRemoved');
                var htToAdd = createdWidget.find('.heightOfcardContentMainWrapper').outerHeight() + createdWidget.find('.cardTitleWrapper').outerHeight();
                createdWidget.find('.heightOfcardContentMainWrapper').css('height', htToAdd + "px");
            } else {
                createdWidget.find('.cardTitleWrapper i:first').css('color', presentWidget.icc).attr('class', presentWidget.ic);
                createdWidget.find('.cardTitleWrapper .cardTitle').css('color', presentWidget.tc).text(presentWidget.tl);
                createdWidget.find('.cardTitleWrapper').css('background-color', presentWidget.tbc);
            }
            if (presentWidget.fb === "hide") {
                createdWidget.find('.runtimeActionWrapper').hide();
            }
            // if (presentWidget.cdb === "hide") {
            //     createdWidget.find('.highcharts-contextbutton').hide();
            // }

            createdWidget.find('.fixed-action-btn .btn-floating').css('background-color', presentWidget.fbc);
            createdWidget.find('.fixed-action-btn .btn-floating i').css('color', presentWidget.fc);
            createdWidget.find('.cardContentMainWrapper').css('background-color', presentWidget.bbc);
            createdWidget.find('.cardContentMainWrapper').css('color', presentWidget.bc);
            if (type == "tstruct") {
                var tstructDesc = presentWidget.dc || dummytstructText;
                createdWidget.find('.card-content p').text(tstructDesc);
                if (presBuiildMode === "homeBuild") {
                    $("#toolBarLsttstruct li[data-target='" + presentWidget.tg + "']").draggable("disable").addClass('widgetCreated');
                    menuSelectedList.push(presentWidget.tg);
                }
                if (presentWidget.ig)
                    createdWidget.find('.card-image img').attr('src', imageBase + presentWidget.ig);
                if (presentWidget.ir === "false")
                    createdWidget.find('.card-image img').addClass('nonResp');
                //image need to add
            } else if (type == "iview") {
                if (isPageBuilder) {
                    ajaxCallObj.getIviewDataNew({ target: presentWidget.tg,calledFrom:'undefined',customParams:'',isPagination:false,page:'undefined',ivHid:presentWidget.hid });
                } else {
                    ajaxCallObj.getIviewData(presentWidget.tg);
                }
                if (presBuiildMode === "homeBuild") {
                    $("#toolBarLstiview li[data-target='" + presentWidget.tg + "']").addClass('widgetCreated').draggable("disable");
                    menuSelectedList.push(presentWidget.tg);
                }
            } else if (type == "widget") {
                ajaxCallObj.getAxpertWidgetDetails({ tId: presentWidget.tg, widgetId: presentWidget.wid, cacheWidget: presentWidget.cwd, widgetSQL: presentWidget.wsql,wgHid: presentWidget.hid });
                if (presBuiildMode === "homeBuild") {
                    $("#toolBarLstwidget li[data-widgetid='" + presentWidget.wid + "']").addClass('widgetCreated').draggable("disable");
                    menuSelectedList.push(presentWidget.wid);
                }
            } else if (presentWidget.ctg || type == "Custom__rss") {
                if (presBuiildMode === "homeBuild") {
                    var targetLiElem = $(".customWidgetsUl li[data-type='" + presentWidget.c + "']");
                    var dataCount = targetLiElem.attr('data-count');
                    if (targetLiElem.data('multiselect') !== false) {
                        if (!dataCount)
                            targetLiElem.addClass('createBadge').attr('data-count', 1);
                        else
                            targetLiElem.addClass('createBadge').attr('data-count', parseInt(dataCount) + 1);
                    } else {
                        targetLiElem.addClass('widgetCreated').draggable("disable");
                    }
                }

                homeWidgetId = presentWidget.ctg;
                if (presentWidget.c == "Custom__html") {
                    createdWidget.find('.htmlContentCard').html(presentWidget.html);
                } else if (presentWidget.c == "Custom__txt") {
                    createdWidget.find('.card-content p').text(presentWidget.txt);
                } else if (presentWidget.c == "Custom__img") {
                    if (presentWidget.ig){
                        createdWidget.find('.card-image img').attr('src', imageBase + presentWidget.ig);
                    }
                    if (presentWidget.ir === "false"){
                        createdWidget.find('.card-image img').addClass('nonResp');
                    }
                } else if (presentWidget.c == "Custom__sql" && presentWidget.sql) {                   
                    ajaxCallObj.fireMySql(presentWidget.sql, key, "", "onSQLWidgetLoad",presentWidget.hid);
                } else if (presentWidget.c == "Custom__rss" && presentWidget.tg) {
                    ajaxCallObj.fireRssFeed(presentWidget.tg, key);
                } else if (presentWidget.c == "Custom__mytsk") {
                    ajaxCallObj.fireMySql(myTaskString, key, true, "myTasks",presentWidget.hid);
                }

            }
            //widgetCreated
            addEventsAfterWidgetCreated(homeWidgetId + "Wrapper");
            if(enableSlick){
                groupWidgets(type, targetId);
            }
        }
    }

    if (presBuiildMode === "homeBuild") {
        for (var customWid in customWidgetInfo) {
            if (customWidgetInfo.hasOwnProperty(customWid)) {
                if (customWidgetInfo[customWid])
                    $(".customWidgetsUl li[data-type='Custom__" + customWid + "']").data('target', "C__" + customWid + (parseInt(customWidgetInfo[customWid]) + 1));
            }
        }
        addDragableEvents();
    }

}

function sortTheArrayBasedOnUserWidgetOrder([...jsonOrder], widgetOrder) {
    const finalArray = [];
    widgetOrder.forEach(widget => {
        const { id, isHidden } = widget;
        jsonOrder.removeByValue(id);
        if (!isHidden) {
            finalArray.push(id);
        } else if (presBuiildMode === "homeBuild") {
            finalArray.push("__hide__" + id);
        }
    });
    return $.merge(finalArray, jsonOrder);
}


function getTheTemplat(pageSavedId) {
    pageSavedId = pageSavedId || $("#HPBtabsHaeder .pageTab a.active").data('tid');
    const tabCacheData = homeJsonObj.jsonContent.pageData[pageSavedId];
    let templateId = 1;
    if (tabCacheData && tabCacheData.tabData) {
        if (tabCacheData.changedTabData) {
            templateId = tabCacheData.changedTabData.tmp || tabCacheData.tabData[metaDataCacher.tabData["TEMPLATE"]];
        } else {
            templateId = tabCacheData.tabData[metaDataCacher.tabData["TEMPLATE"]];
        }

    }
    return parent.templateInfo[templateId];
}

function recreateTheHeaderTabs() {
    $('#HPBtabsHaeder').tabs({
        shrinkTabs: true
        // navigation: {
        //     visibleTabs: 6,
        //     previousButtonIcon: "icon-chevron-left",
        //     nextButtonIcon: "icon-chevron-right"
        // },
    });
}
