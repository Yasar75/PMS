/////////////////////////////////
//BY MANIKANTA ~ 16th Dec 2017 //
/////////////////////////////////

//DWR
var structureParams = {};
var ivTstData = {};
const widgetClickedValue = {};
let sqlParamsInfo = {};
let querymetaDataInfo = {};
let iviewInfo = {};
const defaultPageSize = 10;
let redisUtl = callParentNew("redisutl");
//parent.redisUtl;
let database_type = "oracle"; //oracle,mysql,mariadb,ms sql,mssql
var mainUserName = parent.mainUserName;
var maxRssFeed = 10;
var rowMaxCount = 10;
var shortIviewCol = 5;
var shortIviewRows = 5;
var chartColorCount = 10;
var ax_language = parent.gllangType;
var ax_language_full = parent.gllangauge;
var ax_direction = ax_language === "ar" ? "rtl" : "ltr";
var nls_paramter = [];
var mainProjName = parent.mainProject;
var currentUserName = parent.mainUserName;
var mainRestDllPath = "";
if(parent.mainRestDllPath != undefined)
     mainRestDllPath = parent.mainRestDllPath;
else
    mainRestDllPath = callParentNew("restdllPath");
//parent.mainRestDllPath;
var apiBase = "";
if(parent.nodeApi != undefined)
     apiBase = parent.nodeApi;
else
    apiBase = callParentNew("nodeAPI");
 var sId = "";
if(parent.mainSessionId != undefined)
     sId = parent.mainSessionId;
else
    sId = callParentNew("sid");
var utls = "";
if(parent.utl != undefined)
     utls = parent.utl;
else
    utls = callParentNew("utl");
//var userResps = "";
if(parent.userResp != undefined)
    var userResps = parent.userResp;
else
    userResps = callParentNew("userResps");
//var userroles = "";
if(parent.AxUserRoles != undefined) 
    var userroles =parent.AxUserRoles;
else
    userroles =callParentNew("userroles");//parent.AxUserRoles;
var dummytstructText = eval(callParent('lcm[119]'));
var widgetMetaData, jsonMetaData;
const globalVarsKeyValueObject = createGlobalVars({ keyValObj: true });
var isMobile = isMobileDevice();

isMobile && $("body").addClass("isMobile");

// dont change the below configuration fields order once decided
var chartConfiguration = {
    "3columns": {
        charts: ["area", "line", "bar", "stacked-bar", "column", "stacked-column", "stacked-percentage-column"],
        fieldsCount: 3,
        fields: ["Data Label", "X-axis Label", "Value~fun"],
        type: ["*", "*", "n"]
    },
    "3columnsNumeric": {
        charts: ["scatter-plot"],
        fieldsCount: 3,
        fields: ["Data Label", "X-axis Data~fun", "Y-axis data~fun"],
        type: ["*", "n", "n"]
    },
    "2columns": {
        charts: ["pie", "semi-donut", "donut"],
        fieldsCount: 2,
        fields: ["Xaxis Label", "Value~fun"],
        type: ["*", "n"]
    },
    "4columns": {
        charts: ["stacked-group-column"],
        fieldsCount: 4,
        fields: ["Data Label", "Xaxis Label", "Group Column", "Value~fun"],
        type: ["*", "*", "*", "n"]
    },
    "4columnsNumeric": {
        charts: ["scatter-plot-3D"],
        fieldsCount: 4,
        fields: ["Data Label", "X-axis Data~fun", "Y-axis Data~fun", "Z-axis Data~fun"],
        type: ["*", "n", "n", "n"]
    }
};


const chartTypeConfiguration = (function () {
    let chartTypeConfig = {};
    for (config in chartConfiguration) {
        const { charts } = chartConfiguration[config];
        charts.forEach(chart => {
            chartTypeConfig[chart] = config;
        });
    }
    return chartTypeConfig;
})();


const globalMessages = {
    "invalidDecimalVal": "Please enter a valid decimal value.",
    "invalidColWidth": "Please enter a valid column width.",
    "noCaption": "Please enter the caption.",
    "invalidName": "Please enter a valid name.",
    "multipleHypParams": "Parameter name should not be duplicate.",
    "noTypeSelected": "Please select the type.",
    "validStructureName": "Please enter a valid structure name.",
}




if (typeof initialTemplate !== "undefined")
    var presTemplateObj = initialTemplate;



var inheritsFrom = function (child, parent) {
    child.prototype = Object.create(parent.prototype);
};
var primaryApiSettings = function () {

    let presModule = "home";
    if (typeof isPageBuilder !== "undefined" && isPageBuilder) {
        presModule = "page";
    }


    return {
        "async": true,
        "crossDomain": true,
        "method": "POST",
        "headers": {
            "content-type": "application/x-www-form-urlencoded"
        },
        "data": {
            "session_id": sId,
            "utl": utls,
            "username": mainUserName,
            "authorization":callParentNew("nodeAccessToken"), //parent.nodeAccessToken,
            "appSKey": appsessionKey,
            "module": presModule
        }
    }
}


class MainAjaxCalls {

    getIviewData(iviewName) {
        var settings = primaryApiSettings();
        settings.url = apiBase + "getIview";
        settings.data.iview = iviewName.substr(1);
        settings.data.noCol = "3";

        $.ajax(settings).done(function (response) {
            $("#" + iviewName + "Wrapper .cardContentLoader").remove();
            if (response.status == true) {
                var colData = response.data;
                $("#" + iviewName + "Wrapper .cardContentData").html(getDummyIviewData(response, 4));
            } else {
                $("#" + iviewName + "Wrapper .card-content.iview ").css('padding', '0');
                $("#" + iviewName + "Wrapper .cardContentData").html('<div class="card-content card-image imageCard"><img src="../images/builder/iview.png" /></div>');
                filterErrorMessageAndShow(response);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            onAjaxFailure();
        });
    }

    getIviewDataNew({ target = "", calledFrom, customParams = "", isPagination = false, page,ivHid }) {
        let ivName = target.substr(1);
        if (target === "C__dynamic") {
            ivName = $("#C__dynamicWrapper").data('dwidgetid').substr(1);
        }
        if(typeof isWebServiceCall!="undefined" && isWebServiceCall=="true")
        {
            if(calledFrom==="refreshWidget")
            {
                ajaxCallObj.getIndividualWidgetDetail({ rtId: ivHid,rwidgetId:target, rwidgetType: "iview"});
                return;
            }
            var ivData=wsQueryData[ivHid];
            if (typeof ivData!="undefined") {
                $("#" + target + "Wrapper .cardContentLoader").remove();

                if (!iviewInfo[ivName]) {
                    iviewInfo[ivName] = {}
                }
                const iviewInfoObj = iviewInfo[ivName];

                if (!isPagination) {
                    //const ivParams = response.params || [];
                    //if (ivParams && ivParams.length) {
                    //    ivParams.forEach(param => {
                    //        if (!sqlParamsInfo[param]) {
                    //            sqlParamsInfo[param] = [];
                    //        }
                    //        if ($.inArray(target, sqlParamsInfo[param]) === -1) {
                    //            sqlParamsInfo[param].push(target);
                    //        }
                    //    });
                    //    iviewInfoObj.params = ivParams;
                    //} else {
                    //params are not available ==> no need to filter button
                    if (calledFrom === "dependency") {
                        $(`#C__dynamicWrapper .widgetFooterHoverButtons .flipNShowParams`).hide();
                    } else {
                        $(`#${target}Wrapper .widgetFooterHoverButtons .flipNShowParams`).hide();
                    }
                    //}
                }
                const data = ivData.data;
                const metaData= ivData.iviewmetaData;


                if (calledFrom === "onParamChange" || calledFrom === "customParameters") {
                    delete iviewInfoObj.dataReachedMax;
                }

                //iviewInfoObj.pageSize = response.pageSize === null ? defaultPageSize : response.pageSize;
                //iviewInfoObj.pageNo = response.pageNo || 1;

                //if (isPagination && page === "next" && data.length < iviewInfoObj.pageSize) {
                //    iviewInfoObj.dataReachedMax = true;
                //}
                if (isPagination && data.length === 0) {
                    return;
                }

                var tableHtml = createTableHtml({ data, metaData, calledFrom: "iviewData" })

                querymetaDataInfo[target] = metaData.reduce((array, { name }) => {
                    return [...array, name]
                }, []);

                if ((calledFrom === "dependency") || (target === "C__dynamic")) {
                    resetTheFlippedContainer({ container: $("#C__dynamicWrapper") });
                    $("#C__dynamicWrapper .card-content").removeClass('noScroll').html(`<div class="dynamicContentCard">${tableHtml}</div>`);
                    $("#C__dynamicWrapper .card-content .dynamicContentCard").mCustomScrollbar({
                        axis: "yx", // vertical and horizontal scrollbar
                        theme: "minimal-dark",
                        scrollInertia: 500,
                        autoExpandScrollbar: false,
                        updateOnContentResize: true
                    });
                    if (!isPagination) {
                        $("#C__dynamicWrapper").data('dwidgetid', `${target === "C__dynamic" ? "i" + ivName : target}`);
                    }
                    ajaxCallObj.getIviewHyperLink({ ivName, isDynamicWidget: true,calledFrom:'undefined',ivData:ivData.sqldata,ivmetaData:ivData.hlmetaData });
                } else {
                    resetTheFlippedContainer({ container: $("#" + target + "Wrapper") });
                    $("#" + target + "Wrapper .cardContentData").html(tableHtml);
                    if (presBuiildMode === "homeRun") {
                        let calledFrom = isPagination ? "pagination" : "";
                        ajaxCallObj.getIviewHyperLink({ ivName,isDynamicWidget:false, calledFrom,ivData:ivData.sqldata,ivmetaData:ivData.hlmetaData  });
                    }
                }

            } else {
                // ajaxCallObj.getIviewData(target);
                filterErrorMessageAndShowWs("no data found","warning");
            }
        }
        else{
            var settings = primaryApiSettings();
            settings.url = apiBase + "getIviewData";

            let ivObj = iviewInfo[ivName];
            if (isPagination) {
                settings.data.page_size = ivObj.pageSize;
                let pageNo = parseInt(ivObj.pageNo || 1);
                if (page === "next") {
                    if (ivObj.dataReachedMax) {
                        return;
                    }
                    pageNo = pageNo + 1;
                } else {
                    if (pageNo === 1)
                        return;
                    else {
                        pageNo = pageNo - 1;
                    }
                    ivObj.dataReachedMax = false;
                    //bcz page no is 1 no need to go back
                }
                settings.data.page_no = pageNo;
            }
            if (!customParams) {
                customParams = ivObj ? (ivObj.oldParamValues || {}) : {};
            }

            settings.data.pValue = { ...globalVarsKeyValueObject, ...customParams };
            settings.data.iv_name = ivName;
            $.ajax(settings).done(function (response) {
                if (response.status == true) {
                    $("#" + target + "Wrapper .cardContentLoader").remove();

                    if (!iviewInfo[ivName]) {
                        iviewInfo[ivName] = {}
                    }
                    const iviewInfoObj = iviewInfo[ivName];

                    if (!isPagination) {
                        const ivParams = response.params || [];
                        if (ivParams && ivParams.length) {
                            ivParams.forEach(param => {
                                if (!sqlParamsInfo[param]) {
                                    sqlParamsInfo[param] = [];
                                }
                                if ($.inArray(target, sqlParamsInfo[param]) === -1) {
                                    sqlParamsInfo[param].push(target);
                                }
                            });
                            iviewInfoObj.params = ivParams;
                        } else {
                            //params are not available ==> no need to filter button
                            if (calledFrom === "dependency") {
                                $(`#C__dynamicWrapper .widgetFooterHoverButtons .flipNShowParams`).hide();
                            } else {
                                $(`#${target}Wrapper .widgetFooterHoverButtons .flipNShowParams`).hide();
                            }

                        }
                    }
                    const { data, metaData } = response;

                    if (calledFrom === "onParamChange" || calledFrom === "customParameters") {
                        delete iviewInfoObj.dataReachedMax;
                    }

                    iviewInfoObj.pageSize = response.pageSize === null ? defaultPageSize : response.pageSize;
                    iviewInfoObj.pageNo = response.pageNo || 1;

                    if (isPagination && page === "next" && data.length < iviewInfoObj.pageSize) {
                        iviewInfoObj.dataReachedMax = true;
                    }
                    if (isPagination && data.length === 0) {
                        return;
                    }

                    var tableHtml = createTableHtml({ data, metaData, calledFrom: "iviewData" })

                    querymetaDataInfo[target] = metaData.reduce((array, { name }) => {
                        return [...array, name]
                    }, []);

                    if ((calledFrom === "dependency") || (target === "C__dynamic")) {
                        resetTheFlippedContainer({ container: $("#C__dynamicWrapper") });
                        $("#C__dynamicWrapper .card-content").removeClass('noScroll').html(`<div class="dynamicContentCard">${tableHtml}</div>`);
                        $("#C__dynamicWrapper .card-content .dynamicContentCard").mCustomScrollbar({
                            axis: "yx", // vertical and horizontal scrollbar
                            theme: "minimal-dark",
                            scrollInertia: 500,
                            autoExpandScrollbar: false,
                            updateOnContentResize: true
                        });
                        if (!isPagination) {
                            $("#C__dynamicWrapper").data('dwidgetid', `${target === "C__dynamic" ? "i" + ivName : target}`);
                        }
                        ajaxCallObj.getIviewHyperLink({ ivName, isDynamicWidget: true });
                    } else {
                        resetTheFlippedContainer({ container: $("#" + target + "Wrapper") });
                        $("#" + target + "Wrapper .cardContentData").html(tableHtml);
                        if (presBuiildMode === "homeRun") {
                            let calledFrom = isPagination ? "pagination" : "";
                            ajaxCallObj.getIviewHyperLink({ ivName, calledFrom });
                        }
                    }

                } else {
                    ajaxCallObj.getIviewData(target);
                    //filterErrorMessageAndShow(response);
                }
            }).fail(function (jqXHR, textStatus, errorThrown) {
                onAjaxFailure();
            });
        }
    }

    getIviewHyperLink({ ivName, isDynamicWidget, calledFrom,ivData,ivmetaData }) {
        if(typeof isWebServiceCall!="undefined" && isWebServiceCall=="true")
        {
            if (iviewInfo[ivName]) {
                const ivHyperLinkInfoObj = iviewInfo[ivName].hyperlink_params;
                if (ivHyperLinkInfoObj) {
                    for (var id in ivHyperLinkInfoObj) {
                        let hyperlink = ivHyperLinkInfoObj[id];
                        createIvWidgetHyperlink({ ivName, hyperlink, calledFrom: "cache", isDynamicWidget });
                    }
                    return
                }
            }

            if (typeof ivData!="undefined") {
                const data=ivData;
                const metaData = ivmetaData;
                if (data && data.length) {
                    if (!metaDataCacher.ivHyperLink) {
                        let cachedMetaData = metaDataCacher.ivHyperLink = {};
                        metaData.forEach((meta, idx) => {
                            cachedMetaData[meta.name] = idx;
                        });
                    }
                    if (!iviewInfo[ivName]) {
                        iviewInfo[ivName] = {}
                    }
                    if (!iviewInfo[ivName].hyperlink_params) {
                        iviewInfo[ivName].hyperlink_params = {}
                    }

                    const ivHyperLinkInfoObj = iviewInfo[ivName].hyperlink_params;
                    const metaInfo = metaDataCacher.ivHyperLink;

                    data.forEach(hyperlink => {
                        createIvWidgetHyperlink({ ivName, hyperlink, isDynamicWidget });
                    });
                }

            } 
        }
        else{
            if (iviewInfo[ivName]) {
                const ivHyperLinkInfoObj = iviewInfo[ivName].hyperlink_params;
                if (ivHyperLinkInfoObj) {
                    for (var id in ivHyperLinkInfoObj) {
                        let hyperlink = ivHyperLinkInfoObj[id];
                        createIvWidgetHyperlink({ ivName, hyperlink, calledFrom: "cache", isDynamicWidget });
                    }
                    return
                }
            }

            var settings = primaryApiSettings();
            settings.url = apiBase + "getIviewHyperLink";
            settings.data.iv_name = ivName;
            $.ajax(settings).done(function (response) {
                if (response.status == true) {
                    const { data, metaData } = response;
                    if (data && data.length) {
                        if (!metaDataCacher.ivHyperLink) {
                            let cachedMetaData = metaDataCacher.ivHyperLink = {};
                            metaData.forEach((meta, idx) => {
                                cachedMetaData[meta.name] = idx;
                            });
                        }
                        if (!iviewInfo[ivName]) {
                            iviewInfo[ivName] = {}
                        }
                        if (!iviewInfo[ivName].hyperlink_params) {
                            iviewInfo[ivName].hyperlink_params = {}
                        }

                        const ivHyperLinkInfoObj = iviewInfo[ivName].hyperlink_params;
                        const metaInfo = metaDataCacher.ivHyperLink;

                        data.forEach(hyperlink => {
                            createIvWidgetHyperlink({ ivName, hyperlink, isDynamicWidget });
                        });
                    }

                } else {
                    filterErrorMessageAndShow(response);
                }
            }).fail(function (jqXHR, textStatus, errorThrown) {
                onAjaxFailure();
            });
        }
    }

    fireMySql(sql, targetId, isEncrypted, calledFromParam,csqlHid) {
        if(typeof isWebServiceCall!="undefined" && isWebServiceCall=="true")
        {
            // let trId=targetId.replace("C__sql","").replace("Wrapper","");
            if(calledFromParam==="refreshWidget"){
                if(targetId.indexOf("C__mytsk")>-1)
                    ajaxCallObj.getIndividualWidgetDetail({ rtId: csqlHid,rwidgetId:targetId, rwidgetType: "custom__mytsk"});
                else
                    ajaxCallObj.getIndividualWidgetDetail({ rtId: csqlHid,rwidgetId:targetId, rwidgetType: "custom__sql"});
                return;
            }

            var sqlData=wsQueryData[csqlHid];
            if (typeof sqlData!="undefined") {
                var data = sqlData.data;
                var metaData = sqlData.sqlmetaData;
                const presWidgetData = homeJsonObj.jsonContent.jsonData[targetId];

                if (calledFromParam == "myTasks" || targetId.indexOf("C__mytsk")>-1) {
                    createMyTaskData(sqlData, targetId);
                    return
                }

                const dependencyDataExists = presWidgetData.dep ? "-dependency" : "";

                if (calledFromParam === undefined || calledFromParam === "prpShtUpdateSql" || calledFromParam === "onSQLWidgetLoad") {
                    parseSqlForParams({ sql, pushIntoParamsInfo: true, widgetId: targetId });
                    querymetaDataInfo[targetId] = metaData.reduce((array, { name }) => {
                        return [...array, name]
                    }, []);
                }

                var tableHtml = createTableHtml({ data, metaData, calledFrom: `fireSQL${dependencyDataExists}` });
                $("#" + targetId + " .sqlContentCard").html(tableHtml);

                //if its called from sql widget in page builder then,
                //initial column props need to be added
                if (presBuiildMode === "homeBuild" && isPageBuilder && calledFromParam !== "onSQLWidgetLoad") {
                    addInitialColumnPropsForTheWidget({ widgetId: targetId, calledFrom: calledFromParam, metaData });
                } else if (presBuiildMode === "homeRun" && isPageBuilder) {
                    applyColumnPropertiesForWidgets({ widgetId: targetId })
                }
            } else {
                $("#" + targetId + " .sqlContentCard").html("<p>no data found</p>");
                $("#" + targetId).addClass('errorOccured');

                if (typeof changeWidgetStatus != 'undefined')
                    changeWidgetStatus('saveFailed', targetId);

                //filterErrorMessageAndShow("no data found","warning",);
            }
        }
        else{
            isEncrypted = isEncrypted || false;
            var calledFrom = "ssql";

            const presWidgetData = homeJsonObj.jsonContent.jsonData[targetId];
            if (!sql || calledFromParam === "parameterChanges") {
                sql = presWidgetData.sql;
            }

            if (!isEncrypted) {
                sql = validateTheSql(sql)
            } else {
                calledFrom = "";
            }
            var maxDataReq = "";
            if (calledFromParam != "myTasks") {
                maxDataReq = rowMaxCount;
            }
            if (presBuiildMode === "homeRun") {
                maxDataReq = "";
            }
            var globalVariables = createGlobalVars() || "";

            if (isEncrypted)
                globalVariables = "";

            var settings = primaryApiSettings();
            settings.url = apiBase + "getQuery";
            settings.data.q = sql
            settings.data.isEncrypted = isEncrypted;
            settings.data.rowMaxCount = maxDataReq;
            settings.data.pValue = globalVarsKeyValueObject;
            settings.data.calledFrom = calledFrom;
            settings.data.dateFormat = nls_paramter['nls_date_format'];


            if (presWidgetData && presWidgetData.c === "Custom__sql" && calledFromParam !== "prpShtUpdateSql" && (presWidgetData.cwd === "Y" || presWidgetData.cwd === true)) {
                if (calledFromParam === "refreshWidget") {
                    settings.data.rwd = true;
                }
                //settings.data.rwd = refreshWidget; //is Refresh Widget Data
                settings.data.cwd = true; //is Cache Widget Data
                settings.data.cei = parseInt(presWidgetData.cei || 0) || 0; //cacheRefreshTime
                settings.data.cwk = getTheCacheKey({ widgetId: presWidgetData.ctg, sql: sql }); //Cache Widget key
                settings.data.rUtl = redisUtl; //reddis utl
            }

            $.ajax(settings).done(function (response) {
                if (response.status == true) {
                    var data = response.data;
                    var metaData = response.metaData;
                    if (calledFromParam == "myTasks") {
                        createMyTaskData(response, targetId);
                        return
                    }

                    const dependencyDataExists = presWidgetData.dep ? "-dependency" : "";

                    if (calledFromParam === undefined || calledFromParam === "prpShtUpdateSql" || calledFromParam === "onSQLWidgetLoad") {
                        parseSqlForParams({ sql, pushIntoParamsInfo: true, widgetId: targetId });
                        querymetaDataInfo[targetId] = metaData.reduce((array, { name }) => {
                            return [...array, name]
                        }, []);
                    }

                    var tableHtml = createTableHtml({ data, metaData, calledFrom: `fireSQL${dependencyDataExists}` });
                    $("#" + targetId + " .sqlContentCard").html(tableHtml);

                    //if its called from sql widget in page builder then,
                    //initial column props need to be added
                    if (presBuiildMode === "homeBuild" && isPageBuilder && calledFromParam !== "onSQLWidgetLoad") {
                        addInitialColumnPropsForTheWidget({ widgetId: targetId, calledFrom: calledFromParam, metaData });
                    } else if (presBuiildMode === "homeRun" && isPageBuilder) {
                        applyColumnPropertiesForWidgets({ widgetId: targetId })
                    }
                } else {
                    $("#" + targetId + " .sqlContentCard").html("<p>" + response.errMsg + "</p>");
                    //createMainObj(response, targetId, "error");
                    $("#" + targetId).addClass('errorOccured');

                    if (typeof changeWidgetStatus != 'undefined')
                        changeWidgetStatus('saveFailed', targetId);

                    filterErrorMessageAndShow(response);
                }
            }).fail(function (jqXHR, textStatus, errorThrown) {
                onAjaxFailure();
            });
        }
    }

    getIndividualWidgetDetail({ rtId,rwidgetId, rwidgetType})
    {
        $.ajax({
            type: "POST",
            url: "../WidgetWebService.asmx/GetIndividualWidgetDetail",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({
                widgetIds: rtId,tPageId:tempPageId,widGetType:rwidgetType,ivName:rwidgetId,ivPageSize:'0'
            }),
            async: true,
            cache: false,
            success: function (response) {
                if(response.d.gwdData!== ""){
                    wsQueryData= $.parseJSON(response.d.gwdData);
                    if(rwidgetType ==="widget")
                        ajaxCallObj.getAxpertWidgetDetails({ tId: rwidgetId, widgetId: rwidgetId.substr(6),wgHid:rtId });
                    else if(rwidgetType==="iview")
                        ajaxCallObj.getIviewDataNew({ target:rwidgetId,calledFrom:'undefined',customParams:'',isPagination:false,page:'undefined',ivHid:rtId });
                    else
                        ajaxCallObj.fireMySql("", rwidgetId, "", "onSQLWidgetLoad",rtId)
                }
                else
                {
                    filterErrorMessageAndShowWs("no data found","warning");
                }
            },
            failure: function (response) {
                onAjaxFailure();
            }
        });
    }

    getAxpertWidgetDetails({ tId = "", widgetId, calledFrom, refreshWidget = false, cacheWidget = false, widgetSQL = "", cacheRefreshTime = 0, customParams = {},wgHid="" }) {
        if(typeof isWebServiceCall!="undefined" && isWebServiceCall=="true"){
        cacheWidget = (cacheWidget === "Y" || cacheWidget === true)
        refreshWidget = (refreshWidget === "Y" || refreshWidget === true)
        
        if (!widgetId) {
            widgetId = parseInt(tId.substr(6) || 0)//widget777
        }
        var paramCalldFrom = "home";
        if (presBuiildMode === "homeRun") {
            paramCalldFrom = "homeRun";
        }

        if (presBuiildMode === "widgetBuild")
            var targetId = "axWidget" + widgetId;
        else
            var targetId = tId + "Wrapper";

        if (calledFrom === "customParameters") {
            resetTheFlippedContainer({ container: $("#" + targetId) });
        }
        if(refreshWidget)
        {
            ajaxCallObj.getIndividualWidgetDetail({ rtId: wgHid,rwidgetId:tId, rwidgetType: "widget"});
            return;
        }

        var sqlWgData=wsQueryData[wgHid];
        if (typeof sqlWgData!="undefined" && typeof sqlWgData.data[0]!="undefined") {
            if (!widgetMetaData) {
                widgetMetaData = {};
                var dataMetaData = sqlWgData.datametaData;
                var dataMetaDataLength = dataMetaData.length;
                for (var i = 0; i < dataMetaDataLength; i++) {
                    widgetMetaData[dataMetaData[i].name] = i;
                }
            }

            if (presBuiildMode === "homeBuild") {
                var cachedMetaData = querymetaDataInfo[widgetId] = [];
                sqlWgData.sqlmetaData.forEach(({ name }) => {
                    cachedMetaData.push(name);
                });
            }
            let presWidgetSQL = sqlWgData.data[widgetMetaData["SQLTEXT"]];
            let paramsOfWidget = [];
            if (calledFrom !== "dependency" && calledFrom !== "customParameters") {
                paramsOfWidget = parseSqlForParams({ sql: presWidgetSQL, pushIntoParamsInfo: true, widgetId });
            }
            if (presBuiildMode === "homeRun" && isPageBuilder) {
                if (paramsOfWidget.length) {
                    homeJsonObj.jsonContent.jsonData[targetId].wParams = paramsOfWidget;
                } else if (calledFrom !== "dependency" && calledFrom !== "customParameters") {
                    $(`#${targetId} .widgetFooterHoverButtons .flipNShowParams`).hide();
                }
            }

            if (sqlWgData.sqldata && sqlWgData.sqldata.length === 0) {
                $("#" + targetId + " .cardContentLoader").remove();
                $("#" + targetId + " .cardContentData").html('<p class="center-align">No data found.</p>');
                if (presBuiildMode !== "widgetBuild") {
                    homeJsonObj.jsonContent.jsonData[targetId].wsql = presWidgetSQL;
                    homeJsonObj.jsonContent.jsonData[targetId].wtyp = sqlWgData.data[widgetMetaData["CHARTTYPE"]];
                    var widgetInfo = sqlWgData.data;
                    return
                }
            }

            if (presBuiildMode === "widgetBuild") {
                newWidgetData = true;
                $("#" + targetId).removeClass('errorOccured');
                createMainObj(sqlWgData, targetId, tId);
            } else {
                createAxpertWidget(sqlWgData, targetId, calledFrom);
            }
        } else {
            if (presBuiildMode === "widgetBuild") {
                createMainObj(sqlWgData, targetId, "error");
                $("#" + targetId).addClass('errorOccured');
            }
            if (typeof changeWidgetStatus != 'undefined')
                changeWidgetStatus('saveFailed', targetId);

            $("#" + targetId + " .cardContentLoader").remove();

            $("#" + targetId + " .cardContentData").html(`<div class="reloadWidgetWrapper"><p>No data found.</p><button type="button" onclick="ajaxCallObj.getAxpertWidgetDetails({widgetId:'${widgetId}',calledFrom:'new'})" class="reloadBtn themeButton cutsomColorbtn icon-refresh btn-floating waves-effect waves-light " style="margin-bottom: 10px;font-size: 23px;"></button></div>`);
            //filterErrorMessageAndShow(sqlWgData);
        }

    }else{
    cacheWidget = (cacheWidget === "Y" || cacheWidget === true)
        refreshWidget = (refreshWidget === "Y" || refreshWidget === true)

        if (calledFrom === "refreshWidget" || cacheWidget) {
            let presWidgetData = homeJsonObj.jsonDataa[tId + "Wrapper"];
            if (presBuiildMode === "homeBuild" && isPageBuilder) {
                widgetSQL = presWidgetData.wsql;
            } else {
                widgetSQL = presWidgetData.sql;
            }
            cacheRefreshTime = parseInt(presWidgetData.cei || 0) || 0;
        }

        if (!widgetId) {
            widgetId = parseInt(tId.substr(6) || 0)//widget777
        }


        var globalVariables = createGlobalVars() || "";

        var paramCalldFrom = "home";
        if (presBuiildMode === "homeRun") {
            paramCalldFrom = "homeRun";
        }

        if (presBuiildMode === "widgetBuild") {
            paramCalldFrom = "widget";
            if (!widgetTableData.apiCalledFor) widgetTableData.apiCalledFor = [];
            var apiCalledFor = widgetTableData.apiCalledFor;
            if ($.inArray(widgetId, apiCalledFor) === -1) {
                apiCalledFor.push(widgetId)
            }
        }
        var settings = primaryApiSettings();
        settings.url = apiBase + "getwidgetdetails";
        settings.data.widget_id = widgetId;
        settings.data.calledFrom = paramCalldFrom;
        settings.data.pValue = { ...globalVarsKeyValueObject, ...customParams };
        settings.data.rowMaxCount = rowMaxCount;

        settings.data.rwd = refreshWidget; //is Refresh Widget Data
        settings.data.cwd = cacheWidget; //is Cache Widget Data
        settings.data.cei = cacheRefreshTime; //cacheRefreshTime
        settings.data.cwk = getTheCacheKey({ widgetId, sql: widgetSQL }); //Cache Widget key
        settings.data.rUtl = redisUtl; //reddis utl

        settings.data.dateFormat = nls_paramter['nls_date_format'];

        $.ajax(settings).done(function (response) {
            // console.log(response);
            if (presBuiildMode === "widgetBuild")
                var targetId = "axWidget" + widgetId;
            else
                var targetId = tId + "Wrapper";

            if (calledFrom === "customParameters") {
                resetTheFlippedContainer({ container: $("#" + targetId) });
            }

            if (response.status == true) {

                if (presBuiildMode !== "widgetBuild" && response.statusCode === 404) {
                    $("#" + targetId + " .cardContentLoader").remove();
                    $("#" + targetId + " .cardContentData").html('<p class="center-align">Widget not found.</p>');
                    return
                }

                var data = response;
                if (!widgetMetaData) {
                    widgetMetaData = {};
                    var dataMetaData = data.datametaData;
                    var dataMetaDataLength = dataMetaData.length;
                    for (var i = 0; i < dataMetaDataLength; i++) {
                        widgetMetaData[dataMetaData[i].name] = i;
                    }
                }

                if (presBuiildMode === "homeBuild") {
                    var cachedMetaData = querymetaDataInfo[widgetId] = [];
                    data.querymetaData.forEach(({ name }) => {
                        cachedMetaData.push(name);
                    });
                }
                let presWidgetSQL = data.data[widgetMetaData["SQLTEXT"]];
                let paramsOfWidget = [];
                if (calledFrom !== "dependency" && calledFrom !== "customParameters") {
                    paramsOfWidget = parseSqlForParams({ sql: presWidgetSQL, pushIntoParamsInfo: true, widgetId });
                }
                if (presBuiildMode === "homeRun" && isPageBuilder) {
                    if (paramsOfWidget.length) {
                        homeJsonObj.jsonContent.jsonData[targetId].wParams = paramsOfWidget;
                    } else if (calledFrom !== "dependency" && calledFrom !== "customParameters") {
                        $(`#${targetId} .widgetFooterHoverButtons .flipNShowParams`).hide();
                    }
                }

                if (response.queryData && response.queryData.length === 0) {
                    $("#" + targetId + " .cardContentLoader").remove();
                    $("#" + targetId + " .cardContentData").html('<p class="center-align">No data found.</p>');
                    if (presBuiildMode !== "widgetBuild") {
                        homeJsonObj.jsonContent.jsonData[targetId].wsql = presWidgetSQL;
                        homeJsonObj.jsonContent.jsonData[targetId].wtyp = data.data[widgetMetaData["CHARTTYPE"]];
                        var widgetInfo = data.data;
                        return
                    }
                }

                if (presBuiildMode === "widgetBuild") {
                    newWidgetData = true;
                    $("#" + targetId).removeClass('errorOccured');
                    createMainObj(response, targetId, tId);
                } else {
                    createAxpertWidget(response, targetId, calledFrom);
                }
            } else {
                if (presBuiildMode === "widgetBuild") {
                    createMainObj(response, targetId, "error");
                    $("#" + targetId).addClass('errorOccured');
                }
                if (typeof changeWidgetStatus != 'undefined')
                    changeWidgetStatus('saveFailed', targetId);

                $("#" + targetId + " .cardContentLoader").remove();

                $("#" + targetId + " .cardContentData").html(`<div class="reloadWidgetWrapper"><p>${response.errMsg}</p><button type="button" onclick="ajaxCallObj.getAxpertWidgetDetails({widgetId:'${widgetId}',calledFrom:'new'})" class="reloadBtn themeButton cutsomColorbtn icon-refresh btn-floating waves-effect waves-light " style="margin-bottom: 10px;font-size: 23px;"></button></div>`);
                filterErrorMessageAndShow(response);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            onAjaxFailure();
        });
    }
}


getTypeDetails(type) {
    var typeToSend = type;
    if (type === "i") {
        typeToSend = "i,n";
    }
    var settings = primaryApiSettings();
    settings.url = apiBase + "detailprovider";
    settings.data.pname = typeToSend;

    $.ajax(settings).done(function (response) {
        if (response.status == true) {
            // crateAutoCompleteFld("#ivColHypStName",curCacheData)
            var data = response.data;
            var dataLength = data.length;
            var tmpObj = {};
            for (var i = 0; i < dataLength; i++) {
                var presFld = data[i];
                tmpObj[presFld[0]] = presFld[1];
            }
            ivTstData[type] = tmpObj;
            crateAutoCompleteFld("#ivColHypStName", tmpObj)
        } else {
            filterErrorMessageAndShow(response);
        }
        // console.log(response);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        onAjaxFailure();
    });
}

getStructureParams(iName) {
    var settings = primaryApiSettings();
    settings.url = apiBase + "paramprovider";
    settings.data.rawname = iName;

    $.ajax(settings).done(function (response) {
        resetIvHyperlinks();
        if (response.status == true) {
            var data = response.data;
            if (data) {
                var tmpObj = {};
                $.each(data, function (index, value) {
                    tmpObj[value[1]] = value[0];
                });
                structureParams[iName] = tmpObj;
                crateAutoCompleteFld("#ivColHyPName0", tmpObj);
            }
        } else {
            filterErrorMessageAndShow(response);
        }
        // console.log(response);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        onAjaxFailure();
    });
}

fireRssFeed(url, targetId, calledFrom) {

    var template = "";
    template += '<div class="carousel-item {white-text}" href="#one!">';
    template += '   <div class="rssImagePane {customRssImage}">';
    template += ' <img src="{teaserImage}">';
    template += ' </div>';

    if (presBuiildMode === "homeBuild") {
        template += ' <div class="rssDetailsPane {imgAvailable}">';
    } else {
        template += ' <div onclick="performDirectAction(\'link\',\'{url}\')" class="rssDetailsPane {imgAvailable}">';
    }

    template += '<div class="positionMeDown">';
    template += ' <h6 class="rssFedTitle">{title}</h6>';
    template += ' <p class="rssFeedDesc beige-text">{shortBody}</p>';
    template += ' <p class="rssFeedDate">{date}</p>';
    template += ' </div>';
    template += ' </div>';
    template += ' </div>';

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": apiBase + "rssfeed?q=" + url,
        "method": "GET",
    }

    $.ajax(settings).done(function (response) {
        if (response.status == true) {
            var dataToLoad = response.data;
            var dataToLoadLgth = dataToLoad.length;
            if (maxRssFeed < dataToLoadLgth)
                dataToLoadLgth = maxRssFeed;
            var corusalHtml = "";
            for (var i = 0; i < dataToLoadLgth; i++) {
                var presentData = dataToLoad[i];
                var presentTemlate = template;
                var imagePath = "../images/builder/rss.png";
                presentData = parseRssFeed(presentData);
                var origin = presentData.origin;
                if (origin) {
                    var imageSrc = presentData.image;

                    if (imageSrc) {
                        let imageWidth = parseInt(presentData.imageWidth);
                        imagePath = imageSrc;
                        if (imageWidth > 150) {
                            presentTemlate = presentTemlate.replace(/{customRssImage}/, "");
                            presentTemlate = presentTemlate.replace(/{imgAvailable}/, "imgAvailable");
                            presentTemlate = presentTemlate.replace(/{white-text}/, "white-text");
                        } else {
                            presentTemlate = presentTemlate.replace(/{customRssImage}/, "customRssImage");
                        }
                    } else {
                        presentTemlate = presentTemlate.replace(/{customRssImage}/, "customRssImage");
                    }

                } else {
                    presentTemlate = presentTemlate.replace(/{customRssImage}/, "customRssImage");
                }

                if (presBuiildMode === "homeRun") {
                    presentTemlate = presentTemlate.replace(/{url}/, presentData.link).replace(/{teaserImage}/, imagePath).replace(/{title}/, presentData.title).replace(/{shortBody}/, presentData.content).replace(/{date}/, presentData.published);
                } else {
                    presentTemlate = presentTemlate.replace(/{url}/, "javascript:void(0)").replace(/{teaserImage}/, imagePath).replace(/{title}/, presentData.title).replace(/{shortBody}/, presentData.content).replace(/{date}/, presentData.published)
                }
                corusalHtml += presentTemlate;
            }
            var targetCorElem = $("#" + targetId + " .carousel");
            if (targetCorElem.hasClass('initialized')) {
                targetCorElem.removeClass('initialized')
            }
            if (corusalHtml != "") {
                targetCorElem.addClass('corusalAdded').html(corusalHtml);
                targetCorElem.carousel({ fullWidth: true });
            } else {
                targetCorElem.html("<p>No feed available</p>");
            }
        } else {
            $("#" + targetId + " .carousel").removeClass('corusalAdded').html(response.errMsg);
            filterErrorMessageAndShow(response);
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        onAjaxFailure();
    });
}

getNLSparameter() {
    /*var settings = primaryApiSettings();
    settings.url = apiBase + "getSessionDBParams";
    $.ajax(settings).done(function(response) {
        if (response.status == true) {
            $.each(response.data, function(i, row) {
                if (row[0].toUpperCase() == 'NLS_DATE_FORMAT') {
                    nls_paramter[row[0].toLowerCase()] = row[1];*/
    if (presBuiildMode === "homeBuild") {
        ajaxCallObj.getOnLoadData();
    } else if (presBuiildMode === "homeRun") {

        // if its pageBuilder(PageRunner) then no need to get savedTabs instead need to get the
        // tab data directly selected by user
        if (typeof isPageBuilder !== "undefined" && isPageBuilder) {
            //let { metaData } = parent.AxUserPagesInfo;

            metaDataCacher.tabData = {
                PAGE_ID: 0,
                TEMPLATE: 2,
                TITLE: 1
            }

            var parts = window.location.search.substr(1).split("&");

            var $_GET = {
                pageParams: {},
                extraParams: {}
            };
            for (var i = 0; i < parts.length; i++) {
                var temp = parts[i].split("=");
                let key = decodeURIComponent(temp[0]);
                let value = decodeURIComponent(temp[1]);
                value = value.replace(/\+/g, ' ').replace(/&#43/g, "+");
                if (key.indexOf("axpage_") === 0) {
                    $_GET.pageParams[key] = value;
                } else {
                    globalVarsKeyValueObject[key] = value;
                    $_GET.extraParams[key] = value;
                }
            }
            const { axpage_id: pageId, axpage_title: pageTitle, axpage_t_id: pageTemplate } = $_GET.pageParams;

            if ((pageId || pageTitle) && typeof isWebServiceCall!="undefined" && isWebServiceCall=="true") {                
                var resdata=GetHomePageWS("PAGE",pageTitle==undefined?'':pageTitle,pageId==undefined?'':pageId);
                if(resdata!=="" && resdata.ppData!==""){
                    var ppData= $.parseJSON(resdata.ppData);
                    var ptData= $.parseJSON(resdata.ptData);
                    var pwData= $.parseJSON(resdata.pwData);
                    if(resdata.gwdData!=="")
                        wsQueryData= $.parseJSON(resdata.gwdData);

                    if (pageId && pageTitle && pageTemplate) {
                        homeJsonObj.jsonContent.pageData = {
                            [pageId]: {
                                tabData: [pageId, pageTitle, pageTemplate]
                            }
                        };
                        ajaxCallObj.getTabData(pageId, pageId,undefined,pwData);
                        $("#HPBdesignerCanvas .title").text(pageTitle);
                    } else {
                        if (pageId || pageTitle) {
                            if(typeof parent.templateInfo === "undefined" || parent.templateInfo.length === 0)
                                ajaxCallObj.getTmplateInfo(pageTemplate,ptData);
                            ajaxCallObj.getPageInfo({
                                pageId: pageId,
                                title: pageTitle,
                                wspiData:ppData,
                                cb: function ({ pageId, pageTitle, pageTemplate, isDefault = "N", widgetGroups = "N" }) {
                                    homeJsonObj.jsonContent.pageData = {
                                        [pageId]: {
                                            tabData: [pageId, pageTitle, pageTemplate, isDefault, widgetGroups]
                                        }
                                    };
                                    ajaxCallObj.getTabData(pageId, pageId,undefined,pwData);
                                    $("#HPBdesignerCanvas .title").text(pageTitle);
                                }
                        });
                    } else {
                    ajaxCallObj.getSavedTabs();
                }
            }
        }
        else{
            filterErrorMessageAndShowWs("no data found","warning");
        }
    }
    else{
        if (pageId && pageTitle && pageTemplate) {
            homeJsonObj.jsonContent.pageData = {
                [pageId]: {
                    tabData: [pageId, pageTitle, pageTemplate]
                }
            };
            ajaxCallObj.getTabData(pageId, pageId);
            $("#HPBdesignerCanvas .title").text(pageTitle);
        } else {
            if (pageId || pageTitle) {
                if(typeof parent.templateInfo === "undefined" || parent.templateInfo.length === 0)
                    ajaxCallObj.getTmplateInfo(pageTemplate);
                ajaxCallObj.getPageInfo({
                    pageId: pageId,
                    title: pageTitle,
                    wspiData:'',
                    cb: function ({ pageId, pageTitle, pageTemplate, isDefault = "N", widgetGroups = "N" }) {
                        homeJsonObj.jsonContent.pageData = {
                            [pageId]: {
                                tabData: [pageId, pageTitle, pageTemplate, isDefault, widgetGroups]
                            }
                        };
                        ajaxCallObj.getTabData(pageId, pageId);
                        $("#HPBdesignerCanvas .title").text(pageTitle);
                    }
            });
        } else {
                ajaxCallObj.getSavedTabs();
    }
}
}

//for local only
// ajaxCallObj.getSavedTabs(true);

} else {
    ajaxCallObj.getSavedTabs(true);
}



} else if (presBuiildMode === "widgetBuild") {
    ajaxCallObj.getTstructs();
    ajaxCallObj.getAllGroups();
    ajaxCallObj.getAllResponsibilities();
    if (isEmptyObject(parent.mainSQLhintObj)) {
        ajaxCallObj.getHintsForCodeMirror();
    } else {
        codeMirrorHintObj = parent.mainSQLhintObj;
    }

    ajaxCallObj.getDetails();
}
/*}
});
} else {
filterErrorMessageAndShow(response);
}
}).fail(function(jqXHR, textStatus, errorThrown) {
onAjaxFailure();
});*/
}



isPageValid() {   
    var result = { status: false, errMsg: '' };
    if(typeof isWebServiceCall!="undefined" && isWebServiceCall=="true")
    {
        result.status = true;
        return result;
    }
    var json = {
        "appsession": {
            "s": sId,
            "axpapp": parent.mainProject,
            "appsessionkey": appsessionKey,
            "username": mainUserName
        }
    };
    var settings = {
        // "Content-Type": "application/json",
        "headers": {
            "content-type": "application/x-www-form-urlencoded"
        },
        url: mainRestDllPath + 'ASBDefineRest.dll/datasnap/rest/TASBDefineRest/VerifySessionValidity',
        "method": "POST",
        async: false,
        "data": JSON.stringify(json)
    }
    $.ajax(settings).done(function (response) {
        response = JSON.parse(response);
        if (response.result[0].status === "true") {
            //ajaxCallObj.getNLSparameter();
            result.status = true;
        } else {
            result.errMsg = JSON.stringify(response);
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        //onAjaxFailure();
        result.errMsg = "Internal server error. Configuration Failed.";
    });
    return result;
}

clearRedisData(arrayOfKeys) {
    if (arrayOfKeys && arrayOfKeys.length) {

        var settings = primaryApiSettings();
        settings.url = apiBase + "clearkeys";
        settings.data.rKey = JSON.stringify(arrayOfKeys); //keys to clear
        settings.data.rUtl = redisUtl; //reddis utl

        $.ajax(settings).done(function (response) {
            if (response.status == false) {
                filterErrorMessageAndShow(response);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            onAjaxFailure();
        });
    }
}
}


function getDummyIviewData(iviewData, tbodyCount) {
    var htmlToReturn = "";
    var theadHtml = "";
    var tbodyHtml = "";

    if (iviewData) {
        var headData = iviewData.metaData;
        var headDataLength = headData.length;
        var bodyData = iviewData.data;
        var bodyDataLength = bodyData.length;
        var exceptionColumns = ['axrowtype', 'rowno', 'axp__font', 'pivotghead', 'docid', 'docdate'];
        var orgHeadDataLth = headDataLength;

        if (headDataLength < shortIviewCol)
            headDataLength = headDataLength;
        else
            headDataLength = shortIviewCol;

        if (bodyDataLength < shortIviewRows)
            tbodyCount = bodyDataLength;
        else
            tbodyCount = shortIviewRows;

        var headersAdded = 0;
        var excptHeadCols = [];
        for (var i = 0; i < orgHeadDataLth; i++) {
            var presHdName = headData[i].name;
            presHdName = presHdName.toLowerCase();
            if (presHdName.indexOf("axp_") === 0 || presHdName.indexOf("hide_") === 0 || $.inArray(presHdName, exceptionColumns) !== -1) {
                excptHeadCols.push(i)
                continue;
            }
            presHdName = makeMeInitCap(presHdName);
            headersAdded++;
            theadHtml += "<th>" + presHdName + "</th>";
            if (headersAdded >= headDataLength) break;

        }
        for (var j = 0; j < tbodyCount; j++) {
            tbodyHtml += "<tr>";
            for (var i = 0; i < orgHeadDataLth; i++) {
                if ($.inArray(i, excptHeadCols) !== -1) continue;
                var presData = bodyData[j][i];
                tbodyHtml += "<td>" + presData + "</td>";
            }
            tbodyHtml += "</tr>";
        }
    } else {
        theadHtml = "<th>th1</th><th>th2</th><th>th3</th>";
        for (var i = 0; i < shortIviewRows; i++) {
            tbodyHtml += "<tr>";
            for (var j = 0; j < 3; j++) {
                tbodyHtml += "<td>td" + i + j + "</td>";
            }
            tbodyHtml += "</tr>";
        }
    }
    htmlToReturn += '<table class="iviewSmallShot">';
    htmlToReturn += '<thead>';
    htmlToReturn += theadHtml;
    htmlToReturn += '</thead>';
    htmlToReturn += '<tbody>';
    htmlToReturn += tbodyHtml;
    htmlToReturn += '</tbody>';
    htmlToReturn += '</table>';
    return htmlToReturn;
}

function addEventsAfterWidgetCreated(widgetId) {
    var cardContent = $("#" + widgetId + " .card-content");
    if (cardContent.hasClass('widget')) {
        if (cardContent.find('.smallKpiTableWrapper').length) {
            cardContent.find('.smallKpiTableWrapper').mCustomScrollbar({
                axis: "yx", // vertical and horizontal scrollbar
                theme: "minimal-dark",
                scrollInertia: 500,
                autoExpandScrollbar: false,
                updateOnContentResize: true
            });
        }
        return;
    }

    let wrapperToScroll = $("#" + widgetId + " .card-content:not('.card-image,.noScroll,.rssFeedCard,.mtskContentCard')");
    if (!wrapperToScroll.data('mCS')) {
        wrapperToScroll.mCustomScrollbar({
            axis: "yx", // vertical and horizontal scrollbar
            theme: "minimal-dark",
            scrollInertia: 500,
            autoExpandScrollbar: false,
            updateOnContentResize: true
        });
    }

}

function createAxpertWidget(data, targetId, calledFrom) {   
    enableSlick = typeof enableSlick == "undefined" ? false : enableSlick;
    let isDependencyWidget = false;
    if(typeof isWebServiceCall!="undefined" && isWebServiceCall=="true"){
        if (presBuiildMode !== "widgetBuild") {
            if (!widgetMetaData) {
                widgetMetaData = {};
                var dataMetaData = data.datametaData;
                var dataMetaDataLength = dataMetaData.length;
                for (var i = 0; i < dataMetaDataLength; i++) {
                    widgetMetaData[dataMetaData[i].name] = i;
                }
            }
            var widgetInfo = data.data[0];
            var qryData = data.sqldata;
            var qryMetaData = data.sqlmetaData;
            var widgetType = widgetInfo[widgetMetaData["WIDGET_TYPE"]].toLowerCase();
            var sqlQuery = widgetInfo[widgetMetaData["SQLTEXT"]];
            if (presBuiildMode === "homeBuild") {
                homeJsonObj.jsonContent.jsonData[targetId].wsql = sqlQuery;
                homeJsonObj.jsonContent.jsonData[targetId].wtyp = widgetInfo[widgetMetaData["CHARTTYPE"]];
            } else {
                isDependencyWidget = homeJsonObj.jsonContent.jsonData[targetId].dep ? true : false;
            }
            var wId = targetId.substr(8);
        } else {
            var qryData = data.qrData;
            var qryMetaData = data.qrMData;
            var widgetType = data.type.toLowerCase();
            var wId = targetId.substr(8);
        }
    }
    else{
        if (presBuiildMode !== "widgetBuild") {
            if (!widgetMetaData) {
                widgetMetaData = {};
                var dataMetaData = data.datametaData;
                var dataMetaDataLength = dataMetaData.length;
                for (var i = 0; i < dataMetaDataLength; i++) {
                    widgetMetaData[dataMetaData[i].name] = i;
                }
            }
            var widgetInfo = data.data;
            var qryData = data.queryData;
            var qryMetaData = data.querymetaData;
            var widgetType = widgetInfo[widgetMetaData["WIDGET_TYPE"]].toLowerCase();
            var sqlQuery = widgetInfo[widgetMetaData["SQLTEXT"]];
            if (presBuiildMode === "homeBuild") {
                homeJsonObj.jsonContent.jsonData[targetId].wsql = sqlQuery;
                homeJsonObj.jsonContent.jsonData[targetId].wtyp = widgetInfo[widgetMetaData["CHARTTYPE"]];
            } else {
                isDependencyWidget = homeJsonObj.jsonContent.jsonData[targetId].dep ? true : false;
            }
            var wId = targetId.substr(8);
        } else {
            var qryData = data.qrData;
            var qryMetaData = data.qrMData;
            var widgetType = data.type.toLowerCase();
            var wId = targetId.substr(8);
        }
    }
    var parsedHyperLink = parseHyperLink(qryMetaData, qryData[0]);

    if (widgetType == "table" || widgetType == "kpi") {
        var plotData = qryData;
        var plotDataLength = plotData.length;
        var widgetColumns = qryMetaData;
        var widgetColumnsLength = widgetColumns.length;
        if (presBuiildMode === "widgetBuild") {
            var tableAttrs = data.attr;
            if (tableAttrs) {
                tableAttrs = JSON.parse(tableAttrs);
            } else {
                tableAttrs = {};
            }
            var kpiBgColor = tableAttrs.kpiColor || "blue";
            var showKpiTtl = tableAttrs.shwKpiTtl ? true : false;
        } else {
            var kpiBgColor = "blue";
            var showKpiTtl = false;
        }

        var hyperLinkCol = parsedHyperLink ? parsedHyperLink.i : false; //new
        var kpiTtlHtml = "";


        var defaultIcon = "icon-cube";
        if (presBuiildMode !== "widgetBuild" && calledFrom != "addInitialDataCall") {
            kpiBgColor = homeJsonObj.jsonDataa[targetId].kpiColor || "blue";
            defaultIcon = homeJsonObj.jsonDataa[targetId].ic || "icon-cube";
        }


        var presTtl = "";
        if (presBuiildMode === "widgetBuild")
            presTtl = data.title;
        else
            presTtl = widgetInfo[widgetMetaData["TITLE"]];

        if (showKpiTtl) {
            var kpiTtlHtml = `<div class ='kpiHeader'><span class=${defaultIcon} kpittlIcn'></span><span class='kpiTtl'>${presTtl}</span></div>`;
        } else if (presBuiildMode === "widgetBuild") {
            showKpiTtl = true;
            var kpiTtlHtml = `<div style='display:none;' class ='kpiHeader'><span class='${defaultIcon} kpittlIcn'></span><span class='kpiTtl'>${presTtl}</span></div>`;
        }

        var htmlToAdd = "";
        var hiddenCols = checkForHiddenColumns(widgetColumns);
        var actualWidgetColumnLength = widgetColumnsLength - hiddenCols.length; //subtracting hidden columns
        actualWidgetColumnLength = hyperLinkCol === false ? actualWidgetColumnLength : (actualWidgetColumnLength - 1); //new
        if (actualWidgetColumnLength == 1 && plotDataLength == 1) {
            if (widgetColumnsLength === 1) {
                var colName = widgetColumns[0].name;
                var plotName = plotData[0][0];
            } else {
                for (var i = 0; i < widgetColumnsLength; i++) {
                    var presColName = widgetColumns[i].name.toLowerCase();
                    if (presColName.indexOf("axphide_") === -1 && presColName !== "link") {
                        var colName = presColName;
                        var dataExistsCol = i;
                        var plotName = plotData[0][i];
                        break;
                    }
                }
            }
            colName = makeMeInitCap(colName);
            plotName = customizeData(plotName);
            if (colName.indexOf("axphide_") === -1 && colName.indexOf("axphideh_") === -1) {
                htmlToAdd += '<p class="head">' + colName + '</p>';
            }

            if (hyperLinkCol === false)
                colName.indexOf("axphidec_") === -1 ? htmlToAdd += '<span class="card-title"><h2 class="singleKPIvalue" style="margin:0;">' + plotName + '</h2></span>' : htmlToAdd += "";
            else {
                var link = getTheHyperLink(plotData[0][hyperLinkCol], parsedHyperLink, plotName, dataExistsCol);
                colName.indexOf("axphidec_") === -1 ? htmlToAdd += '<span class="card-title"><h2 class="singleKPIvalue" style="margin:0;">' + link + '</h2></span>' : htmlToAdd += "";
            }
            htmlToAdd += '<span class="' + defaultIcon + ' kpiImage ' + (kpiBgColor == "white" ? "blue-grey-text" : "") + '"></span>';
            // kpiTtlHtml
            htmlToAdd += '<p class="kpiTitle">' + presTtl + '</p>';
            htmlToAdd = `<div data-kpicolor = "${kpiBgColor}" class="kpiCard card colorMe ${kpiBgColor}">${kpiTtlHtml}<div class="card-content ${isDependencyWidget ? "dependentWidget" : ""} singleCellKPI smallKpi ${(kpiBgColor == "white" ? "black-text" : "white-text")}">${htmlToAdd}</div></div>`;
        } else if (hiddenCols.length === 0 && plotDataLength == 1) {
            htmlToAdd += `  <table class="${isDependencyWidget ? "dependentWidget" : ""} kpiSingleRow"><tbody>`;
            var actualWidgetColumnLength = hyperLinkCol === false ? widgetColumnsLength : (widgetColumnsLength - 1);
            if (actualWidgetColumnLength > 3) {
                for (var i = 0; i < 3; i++) {
                    colName = widgetColumns[i].name;
                    colName = makeMeInitCap(colName);
                    htmlToAdd += "<tr>";
                    htmlToAdd += "<td>";
                    htmlToAdd += '<p class="head">' + colName + '</p>';
                    if (hyperLinkCol === false)
                        colName.indexOf("axphidec_") === -1 ? htmlToAdd += '<p class="val">' + customizeData(plotData[0][i]) + '</p>' : htmlToAdd += "";
                    else {
                        var link = getTheHyperLink(plotData[0][hyperLinkCol], parsedHyperLink, customizeData(plotData[0][i]), i);
                        colName.indexOf("axphidec_") === -1 ? htmlToAdd += '<p class="val">' + link + '</p>' : htmlToAdd += "";
                    }
                    htmlToAdd += "</td>";
                    if (plotData[0][i + 3] != undefined) {
                        htmlToAdd += "<td>";
                        htmlToAdd += '<p class="head">' + makeMeInitCap(widgetColumns[i + 3].name) + '</p>';
                        colName = widgetColumns[i + 3].name;
                        if (hyperLinkCol === false)
                            colName.indexOf("axphidec_") === -1 ? htmlToAdd += '<p class="val">' + customizeData(plotData[0][i + 3]) + '</p>' : htmlToAdd += "";
                        else {
                            var link = getTheHyperLink(plotData[0][hyperLinkCol], parsedHyperLink, customizeData(plotData[0][i + 3]), i + 3);
                            colName.indexOf("axphidec_") === -1 ? htmlToAdd += '<p class="val">' + link + '</p>' : htmlToAdd += "";
                        }
                        htmlToAdd += "</td>";
                    } else {
                        htmlToAdd += "<td>";
                        htmlToAdd += "</td>";
                    }
                    htmlToAdd += "</tr>";
                }
                addEventsAfterWidgetCreated(targetId);
            } else {
                for (var i = 0; i < actualWidgetColumnLength; i++) {
                    htmlToAdd += "<tr><td>";
                    htmlToAdd += '<p class="head">' + makeMeInitCap(widgetColumns[i].name) + '</p>';
                    if (hyperLinkCol === false)
                        htmlToAdd += '<p class="val">' + customizeData(plotData[0][i]) + '</p>';
                    else {
                        var link = getTheHyperLink(plotData[0][hyperLinkCol], parsedHyperLink, customizeData(plotData[0][i]), i);
                        htmlToAdd += '<p class="val">' + link + '</p>';
                    }

                    htmlToAdd += "</tr></td>";
                }
            }
            htmlToAdd += '</tbody></table>';
            htmlToAdd += '<span class="' + defaultIcon + ' kpiImage ' + (kpiBgColor == "white" ? "blue-grey-text hide" : "") + '"></span>';
            htmlToAdd = '<div data-kpicolor = "' + kpiBgColor + '" class="kpiCard card colorMe ' + kpiBgColor + '">' + kpiTtlHtml + ' <div class="card-content smallKpi ' + (kpiBgColor == "white" ? "black-text" : "white-text") + '">' + htmlToAdd + '</div></div>';
            addEventsAfterWidgetCreated(targetId);
        } else {
            var headerHtml = "<thead><tr>";
            for (var i = 0; i < widgetColumnsLength; i++) {
                var colName = widgetColumns[i].name;
                colName = makeMeInitCap(colName);
                if (hyperLinkCol !== false && i === hyperLinkCol) continue //new
                if (colName.indexOf("axphide_") !== -1) {
                    headerHtml += "<th style='display:none;'></th>";
                } else {
                    colName.indexOf("axphideh_") === -1 ? headerHtml += "<th>" + colName + "</th>" : headerHtml += "<th></th>";
                }
            }
            headerHtml += "</tr></thead>";
            var bodyHtml = "<tbody>";
            for (var j = 0; j < plotDataLength; j++) {
                var presentRow = plotData[j];
                bodyHtml += "<tr>"
                for (var i = 0; i < widgetColumnsLength; i++) {
                    var colName = widgetColumns[i].name;
                    colName = makeMeInitCap(colName);
                    if (hyperLinkCol !== false && i === hyperLinkCol) continue //new
                    if (colName.indexOf("axphide_") !== -1) {
                        bodyHtml += "<td style='display:none;'></td>";
                    } else {
                        if (hyperLinkCol === false)
                            colName.indexOf("axphidec_") === -1 ? bodyHtml += "<td>" + customizeData(presentRow[i]) + "</td>" : bodyHtml += "<td></td>";
                        else {
                            var link = getTheHyperLink(presentRow[hyperLinkCol], parsedHyperLink, customizeData(presentRow[i]), i);
                            colName.indexOf("axphidec_") === -1 ? bodyHtml += "<td>" + link + "</td>" : bodyHtml += "<td></td>";
                        }

                    }

                }
                bodyHtml += "</tr>"
            }
            bodyHtml += "</tbody>";
            htmlToAdd = `<div data-kpicolor = '${kpiBgColor}' class="kpiCard card colorMe ${kpiBgColor}">${kpiTtlHtml}<div class="card-content smallKpi ${(kpiBgColor == "white" ? "black-text" : "white-text")}"><div class="smallKpiTableWrapper"><table class='${isDependencyWidget ? "dependentWidget" : ""} kpiTable fullKPItable kpiPTable'>${headerHtml + bodyHtml}</table></div><span class='${defaultIcon} kpiImage ${(kpiBgColor == "white" ? "grey-text text-lighten-3 hide" : "")}'></span></div>`;
        }

        $("#" + targetId + " .cardContentLoader").remove();
        $("#" + targetId + " .cardContentData").addClass('maxHeight').html(htmlToAdd);
        if (enableSlick) {
            $("#" + targetId + " .cardContentData").find(".singleCellKPI").parents(".cardContentMainWrapper").css({"border-radius": "15px", "height": "initial"}).prev(".cardTitleWrapper").hide();
        }
        $("#" + targetId + " .card-content:first").css("padding", 0);
        if (presBuiildMode !== "widgetBuild" && calledFrom == "addInitialDataCall") {
            homeJsonObj.updateDataInJson(targetId, "kpiColor", "blue");
            ChangePropertySheet("kpiWidgetAdded");
        }
        addEventsAfterWidgetCreated(targetId);
    } else if (widgetType == "chart") {
        $("#" + targetId + " .cardContentLoader").remove();
        $("#" + targetId + " .cardContentData").addClass('maxHeight');
        if (presBuiildMode === "widgetBuild") {
            var chartType = data.cType;
            var title = data.title;
            var attributes = data.attr;
        } else {
            var chartType = widgetInfo[widgetMetaData["CHARTTYPE"]];
            var title = widgetInfo[widgetMetaData["TITLE"]];
            var attributes = widgetInfo[widgetMetaData["ATTRIBUTES"]];
        }

        var contTargetId = "#" + targetId + " .cardContentData"
        var height = parseInt($(targetId).css("height"));
        if (!$(targetId).is(':visible')) {
            $(targetId).addClass('setChartHeight');
        }
        var metaLth = qryMetaData.length;

        var attrs = {};
        if (attributes) {
            attributes = JSON.parse(attributes);
            if (typeof attributes.shwLgnd != "undefined" && enableSlick) {
                attributes.shwLgnd = false;
            }
        } else {
            attributes = {};
        }
        //below div is not using for widget builder need to check
        var heightOfDiv = $("#" + targetId + " .card-content").outerHeight()
        var objToSend = {
            target: contTargetId,
            data: qryData,
            type: chartType,
            title: title,
            height: heightOfDiv,
            isCompressed: true,
            attr: attributes,
            metaData: qryMetaData,
            hyperLink: parsedHyperLink
        }

        createAgileChart(objToSend);

    } else if (widgetType === "iview") {
        $("#" + targetId + " .cardContentLoader").remove();
        $("#" + targetId + " .cardContentData").addClass('maxHeight').html('<img class="ivDummyImg" src="../images/builder/iview.png" alt="Iview">');

    }

    if (enableSlick) {
        var type = "";

        if(widgetType == "kpi" && typeof actualWidgetColumnLength != "undefined" && actualWidgetColumnLength == 1 && typeof plotDataLength != "undefined" && plotDataLength == 1){
            type = "smallkpi"
        } else {
            type = widgetType
        }
        groupWidgets(type, targetId);
    }

}
function customizeData(plotName) {
    if (plotName && typeof plotName === "string") {
        plotName = plotName.replace(/__\^__/g, ":");
    }
    return plotName;
}

function parseHyperLink(metaData, data) {
    try {
        var dataMetaDataLength = metaData.length;
        var isHyperLinkExists = false;
        var parsedHyperLink = {};
        for (var i = 0; i < dataMetaDataLength; i++) {
            var presCol = metaData[i].name;
            if (presCol.toLowerCase() === "link") {
                isHyperLinkExists = true;
                parsedHyperLink.i = i;
                break;
            }
        }
        if (isHyperLinkExists) {
            var hyperlinkData = data[parsedHyperLink.i];
            hyperlinkData = hyperlinkData.split("~");
            var parsedData = parsedHyperLink.data = {};
            var hyperlinkDataLth = hyperlinkData.length;
            for (var i = 0; i < hyperlinkDataLth; i++) {
                var presntLink = hyperlinkData[i]; //h1=icarsiview(car_model=audi^car_manufacture=08-NOV-16)$target=inline;
                presntLink = presntLink.split("$"); //widget can open inline for page builder
                let targetTypeToOpen = presntLink[1];
                presntLink = presntLink[0];
                var frstEqIndx = presntLink.indexOf("=");
                var presParseObj = {};
                var column = presntLink.substring(0, frstEqIndx).replace(/ /g, '').replace('h', '');
                var linkData = presntLink.substring(frstEqIndx + 1);
                presParseObj.col = column;
                var frstBrIndex = linkData.indexOf("(");
                if (frstBrIndex !== -1) {
                    presParseObj.isParams = frstBrIndex;
                    var targetData = linkData.substring(0, frstBrIndex).replace(/ /g, '');
                    var params = "&";
                } else {
                    presParseObj.isParams = false;
                    var targetData = linkData;
                    var params = "";
                }

                var targetType = targetData.substr(0, 1);
                var targetId = targetData.substring(1);
                var linkStr = "";
                if (targetType === "i") {
                    linkStr = "ivtoivload.aspx?ivname=" + targetId + params;
                } else if (targetType === "t") {
                    linkStr = "tstruct.aspx?transid=" + targetId + params;
                }
                presParseObj.url = linkStr;
                parsedData["col" + column] = presParseObj;
            }
            return parsedHyperLink;

        } else {
            return false;
        }
    } catch (e) {
        console.log("Error while parsing hyperlink : " + e);
        return false;
    }
}


function getTheHyperLink(linkData, linkObj, cap, colIndex) {

    if (agileChartsObj.mode === "build") {
        return cap;
    }
    var linkDataObj = linkObj.data;
    colIndex = colIndex + 1;
    if (linkDataObj && linkDataObj["col" + colIndex]) {
        var linkObjData = linkDataObj["col" + colIndex];
        var params = linkObjData.isParams;
        var paramStr = "";
        if (params !== false) {
            linkData = linkData.split("~");
            var linkObjDataLth = linkData.length;
            for (var i = 0; i < linkObjDataLth; i++) {
                var presLink = linkData[i].trim();
                var frstEqIndx = presLink.indexOf("=");
                if (presLink.substr(0, frstEqIndx) === "h" + colIndex) {
                    linkData = presLink;
                } else {
                    continue;
                }
            }
            paramStr = linkData.substring(linkData.indexOf("(") + 1, linkData.lastIndexOf(")"));
            paramStr = paramStr.replace(/\^/g, "&");
        }
        return "<a class='" + (enableSlick ? "" : "whiteLink") + "' href='javascript:void(0);' onclick=\"javascript:parent.LoadIframe('" + linkObjData.url + paramStr + "');\">" + cap + "</a>";
    } else {
        return cap;
    }
}

function checkForHiddenColumns(colsArray) {
    var colArrayLth = colsArray.length;
    var hiddenCols = [];
    for (var i = 0; i < colArrayLth; i++) {
        var presentCol = colsArray[i].name.toLowerCase();
        if (presentCol.indexOf("axphide_") !== -1)
            hiddenCols.push(i);
    }
    return hiddenCols;
}

function parseRssFeed(feed) {
    var pubDate = feed.published;
    feed.published = moment(pubDate).format('MMMM Do YYYY, h:mm:ss a');

    try {
        var elem = $(feed.content);
        var origin = feed.feed.source;
        //yahoo feed
        feed.content = elem.text().substr(0, 120) + "...";
        feed.image = "";
        for (var i = 0; i < elem.length; i++) {
            var presentElem = $(elem[i]);
            var localName = presentElem[0].localName;
            if (localName == "img") {
                var width = parseInt(presentElem.attr('width'));
                if (width > 10) {
                    feed.image = presentElem.attr("src");
                    feed.imageWidth = presentElem.attr("width");
                    break;
                }
            } else if (presentElem.find('img').length != 0) {
                feed.imageWidth = presentElem.find('img').attr("width");
                if (!feed.imageWidth) {
                    feed.imageWidth = 151;
                }
                if (parseInt(feed.imageWidth) > 10) {
                    var imgSrc = presentElem.find('img').attr("src");
                    if (imgSrc.trim().indexOf("http") !== 0) {
                        imgSrc = "https:" + imgSrc;
                    }
                    feed.image = imgSrc;
                    break;
                }
            }
        }
        // if (elem.find('img').length != 0) {
        //     feed.image = elem.find('img').attr("src");
        //     feed.imageHeight = elem.find('img').attr("height");
        // } else
        //     feed.image = "";

        if (origin.indexOf("yahoo.com") !== -1) {
            feed.origin = "yahoo";
        } else {
            feed.origin = "someImageFeed";
        }
        return feed;

    } catch (e) {
        feed.content = feed.content.substr(0, 120) + "...";
        return feed;
    }
}

function makeMeInitCap(name) {
    if (name && name != "") {
        name = customizeData(name);
        if (name.toLowerCase().indexOf("axphide") !== -1) {
            return name.toLowerCase();
        }
        name = name.replace(/_/g, " ");
        var capitalizedString = name.toLowerCase().replace(/\b[a-z]/g, function (letter) {
            return letter.toUpperCase();
        });
        return capitalizedString;
    } else {
        return name;
    }
}

function createMyTaskData(response, targetId) {
    if (presBuiildMode === "homeRun")
        myTaskDetails = response;

    var template = "";
    template += '<div class="carousel-item {white-text}">';
    template += '   <div class="rssImagePane {customRssImage}">';
    template += ' <img src="{teaserImage}">';
    template += ' </div>';
    template += ' <div class="rssDetailsPane {imgAvailable}">';
    template += '<div class="positionMeDown">';
    template += ' <h6 class="rssFedTitle">{title}</h6>';
    template += ' <p class="rssFeedDesc beige-text">{shortBody}</p>';
    template += ' <p class="rssFeedDate mttskAdded">Due Date : {dueDate}</p>';
    template += ' <p class="rssFeedDate mttskAdded">Created Date : {createdDate}</p>';
    template += ' </div>';
    template += ' </div>';
    template += ' </div>';
    if (response.data) {
        var dataToLoad = response.data;
        var dataToLoadLgth = dataToLoad.length;
        if (maxRssFeed < dataToLoadLgth)
            dataToLoadLgth = maxRssFeed;
        var corusalHtml = "";
        for (var i = 0; i < dataToLoadLgth; i++) {
            var presentData = dataToLoad[i];
            var presentTemlate = template;
            var imagePath = "../images/Builder/workflow.png";

            presentTemlate = presentTemlate.replace(/{customRssImage}/, "customRssImage").replace(/{teaserImage}/, imagePath).replace(/{title}/, presentData[0]).replace(/{shortBody}/, presentData[1]).replace(/{dueDate}/, presentData[5]).replace(/{createdDate}/, presentData[2]);
            corusalHtml += presentTemlate;
        }
        var targetCorElem = $("#" + targetId + " .sqlContentCard");
        if (targetCorElem.hasClass('initialized')) {
            targetCorElem.removeClass('initialized')
        }
        if (corusalHtml != "") {
            targetCorElem.addClass('corusalAdded').html(corusalHtml);
            targetCorElem.carousel({ fullWidth: true });
        } else {
            targetCorElem.html("<p>No Data Found.</p>");
        }
    } else {
        $("#" + targetId + " .sqlContentCard").removeClass('corusalAdded').html(response.errMsg);
    }

}

function createGlobalVars({ onlyKeys, keyValObj } = {}) {
    let finalValToReturn = "";

if (onlyKeys)
    finalValToReturn = [];
else if (keyValObj)
    finalValToReturn = {};

try {
    var globalArray = globalVars.split(";");
    var globalArrayLth = globalArray.length;

    for (var i = 0; i < globalArrayLth; i++) {
        var presKey = globalArray[i];
        var presVal = presKey.split("=")[1];
        if (presVal) {
            presVal = presVal.replace(/"/g, "");
            if (onlyKeys)
                finalValToReturn.push(presVal.split("~")[0].trim().toLowerCase())
            else if (keyValObj) {
                let [key, val] = presVal.split("~");
                finalValToReturn[key.trim().toLowerCase()] = val.trim();
            } else
                finalValToReturn += presVal.replace("~", ":") + "~";
        }
    }
} catch (e) {
    console.log("error in global vars rendering:" + e)
}

return finalValToReturn;
}

function htmlEntity(type, string) {
    if (type == "encode") {
        string = string.replace(/'/g, "&apos;");
        string = string.replace(/"/g, "&quot;");
        string = string.replace(/</g, "&lt;");
        string = string.replace(/>/g, "&gt;");
    } else if (type == "decode") {
        string = string.replace(/&apos;/g, "'");
        string = string.replace(/&quot;/g, '"');
        string = string.replace(/&lt;/g, '<');
        string = string.replace(/&gt;/g, '>');
    }
    return string;
}

/**
 * To filter the error message for unnecessary things coming for node or any webservice
 * @param  {String} msg  Msg we want to show
 * @param  {String} type Msg type if we didnt send by default it will take "warning"
 * @return {null}
 */
function filterErrorMessageAndShow(resp, type) {
    callParentNew("closeFrame()","function");
    valSessByApi(resp);
    const msgType = type || "warning";
    const msg = (resp.errMsg || "no data found").toLowerCase();

    if (msg.indexOf("no data found") === -1 && msg.indexOf("no record found") === -1 && msg.indexOf("non query column") === -1 && msg.indexOf("null required") === -1 && msg.indexOf("required hasparams") === -1)
        showAlertDialog(msgType, msg);
}

function filterErrorMessageAndShowWs(resp, type) {
    callParentNew("closeFrame()","function");
    const msgType = type || "warning";
    const msg = (resp || "no data found").toLowerCase();
    showAlertDialog(msgType, msg);
}


/**
 * Function to handle all the regular expressions based on type
 * @param  {string} type based on this type different regex will be tested
 * @param  {string} value Value to te tested
 * @return {Boolean}      returns true if regex test passed or false
 */
function testRegex(type, value) {
    var regex = "";
    if (type === "specialCharsOnly") {
        regex = /^[^\'"~`!@#$%^&*()\-{}\[\]\\|;:><?\/.,+]*$/g;
    } else if (type === "validName") {
        regex = /^[a-zA-Z0-9][a-zA-Z0-9 ,.'_-]{0,}$/;
    } else if (type === "validNameNotStartWithNumber") {
        regex = /^[a-zA-Z][a-zA-Z0-9 ,.'_-]{0,}$/;
    } else if (type === "validNameWithoutSpace") {
        regex = /^[a-zA-Z][a-zA-Z0-9_-]{0,}$/;
    } else if (type == "noSpecialCharactersAndNotStartingWithNumber") {
        regex = /^[a-zA-Z][a-zA-Z0-9_]{0,}$/;
    }

    if (regex != "") {
        return regex.test(value);
    } else {
        return false;
    }
}

/**
 * to validate the sql or to trim the ";" and some others
 * @param  {String} sql SQL need to parse
 * @return {String}     The parsed SQL
 */
function validateTheSql(sql) {
    if (sql != "") {
        var sql = sql.trim();
        var lastChar = sql.substr(-1);
        if (lastChar === ";") {
            sql = sql.slice(0, -1);
        }
    }

    return sql;
}

function makeMePositive(elem, minVal, defaultVal) {
    elem = $(elem);
    var elemVal = elem.val();
    var parsedNumVal = parseInt(elemVal);
    minVal = minVal || 0;
    defaultVal = defaultVal || minVal;
    if ((parsedNumVal != 0 && !parsedNumVal) || (elemVal < minVal)) {
        elem.val(defaultVal);
    }
}

function isValidNumber(val, minVal) {
    minVal = minVal || 0;
    if (isNaN(val) || (val < minVal)) {
        return false;
    }
    return true;
}


function materialModalEventsHandler(task) {
    if (task === "bind") {
        $(".modal-overlay").off('click.modalOutSideClck');
        $(".modal-overlay").on('click.modalOutSideClck', function (event) {
            customCloseModal()
        });
        $(document).off('keyup.modalEscClose');
        $(document).on('keyup.modalEscClose', function (e) {
            if (e.keyCode === 27) { // ESC key
                customCloseModal();
            }
        });
    } else if (task === "unbind") {
        if ($(".modal-overlay").length <= 1) {
            $(document).off('keyup.modalEscClose');
            $(".modal-overlay").off('click.modalOutSideClck');
        } else {
            var $body = $('body');
            var oldWidth = $body.innerWidth();
            $body.css('overflow', 'hidden');
            $body.width(oldWidth);
        }
    }
}

function customCloseModal() {
    var openedModals = $(".modal.open");
    var tmpOvNum = -1;
    var topModal;
    for (var i = openedModals.length - 1; i >= 0; i--) {
        var presModal = $(openedModals[i]);
        var overLayNum = presModal.data("overlayId");
        if (overLayNum) {
            overLayNum = parseInt(overLayNum.substr(-1));
            if (overLayNum > tmpOvNum) {
                tmpOvNum = overLayNum;
                topModal = presModal;
            }
        }
    }
    if (validateModalBeforeClose(topModal)) {
        topModal.modal("close");
    } else {
        createConfirmBox("onWizardClose", widgetMessages.unsavedChanges)
    }

}

function validateModalBeforeClose(modal) {
    var modalId = modal.attr('id')
    if (modalId === "wizardModal") {
        if (presWizardData.isDirty) {
            return false;
        }

    }
    return true;
}


function tabFocusEventHandler({ task, parentId, parentElem, loopInsideParent, notOf = "" }) {

    if (!parentElem && parentId) {
        parentElem = $("#" + parentId);
    }
if (task === "unbind") {
    $(document).off("keydown.loopingInsideParent" + parentElem.data('loopingkey'));
    parentElem.removeData('loopingkey');
    return;
}
let uniqueKey = Date.now();
var allFocusableElems = "a:visible,input:enabled,select:enabled,button:enabled,textarea:enabled";
var allFocusableElemsList = parentElem.find(allFocusableElems).not(`${notOf}`);
allFocusableElemsList.first().focus();
if (loopInsideParent) {
    var firstFocusableElem = allFocusableElemsList.first();
    var lastFocusableElem = allFocusableElemsList.last();
    parentElem.data('loopingkey', uniqueKey);
    $(document).off("keydown.loopingInsideParent" + uniqueKey);
    $(document).on("keydown.loopingInsideParent" + uniqueKey, function (event) {
        if (!event.shiftKey && event.keyCode == 9) {
            //tab key
            if ($(document.activeElement)[0] == lastFocusableElem[0]) {
                event.preventDefault()
                firstFocusableElem.focus();
            }
        } else if (event.shiftKey && event.keyCode == 9) {
            //tab key + shift
            if ($(document.activeElement)[0] == firstFocusableElem[0]) {
                event.preventDefault();
                lastFocusableElem.focus();
            }
        }
    })
}
}

function focusOnFrtstFld({ container, notOf = "" }) {
    const allFocusableElems = "a:visible,input:enabled,select:enabled,button:enabled,textarea:enabled";
container = $(container)
container.find(allFocusableElems).not(`${notOf}`).first().focus();
}

function getObjPassByValue(obj) {
    return Object.create(obj);
}


function materialToolTip(msg) {
    var tooltip = '<a class="themeTextColor tooltipped" data-position="bottom" data-delay="50" data-tooltip="' + msg + '"><span class="icon-question-circle"></span></a>';
    return tooltip;
}


jQuery.fn.getOuterHTML = function () {
    return jQuery('<div />').append(this.eq(0).clone()).html();
};

jQuery.expr[':'].icontains = function (a, i, m) {
    return jQuery(a).text().toUpperCase()
        .indexOf(m[3].toUpperCase()) >= 0;
};

Array.prototype.removeByValue = function () {
    var what, a = arguments,
        L = a.length,
        ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

function redirectPage(flag) {
    if (flag)
        valSessByApi({ statusCode: 401, errMsg: "not a valid session" });
}

/**
 * To parse the sql and get parameter names
 * @param  {String} sql The sql which we want to parse
 * @return {array}     All the param names from sql
 */
function parseSqlForParams({ sql, onlyValues, pushIntoParamsInfo = false, widgetId }) {
    var regex = /(:)\s*\w+/g;
var finalParams = [];
var match;
while (match = regex.exec(sql)) {
    if (match) {
        var presParam = match[0] || "";
        presParam = presParam.trim();
        var presParam = presParam.indexOf(':') == 0 ? presParam.substring(1) : presParam;
        if (onlyValues) {
            finalParams.push(globalVarsKeyValueObject[presParam] || "");
        } else if (pushIntoParamsInfo) {
            presParam = presParam.trim();
            if (!sqlParamsInfo[presParam]) {
                sqlParamsInfo[presParam] = [];
            }
            if ($.inArray(widgetId, sqlParamsInfo[presParam]) === -1) {
                sqlParamsInfo[presParam].push(widgetId);
            }
            finalParams.push(presParam);
        } else {
            if ($.inArray(presParam, finalParams) === -1)
                finalParams.push(presParam.trim())
        }
    }
}
return finalParams;
}

function getTheCacheKey({ widgetId, sql }) {
    //db~proj_name~language~module_name~widget_id~parameter_values
    //select * from axusers where name=:username
    let keySeperator = "~";
    let dbtype = database_type.replace(" ", "").substr(0, 3);

    let moduleCode = presBuiildMode;
    switch (presBuiildMode) {
        case "homeBuild":
            moduleCode = "hbs";
            break;
        case "homeRun":
            moduleCode = "hbp";
            break;
        default:
            moduleCode = "";
            break;
    }

    let cacheKey = dbtype + keySeperator + mainProjName + keySeperator + ax_language + keySeperator + moduleCode + keySeperator + widgetId + keySeperator + parseSqlForParams({ sql, onlyValues: true }).join("~");
    return cacheKey;
}


function createDependencyPopup(data) {
    let dependencyObject = [];
    if (data) {
        dependencyObject = homeJsonObj.jsonContent.jsonData[data].dep;
    }
    let [firstRowParam, firstRowFldType] = dependencyObject[0] || ["", ""]
    const target = $("#propertySheet").data('target');
    //target = widget210Wrapper => substring of widget(6) to indexof "Wrapper";

    const presentWidgetData = homeJsonObj.jsonContent.jsonData[target];
    let widgetType = presentWidgetData.c;
    let valueHtml = "";
    let flds = [];
    if (widgetType === "widget") {
        const widgetId = target.substring(6, target.indexOf("Wrapper"));
        if (presentWidgetData.wtyp) {
            flds = chartConfiguration[chartTypeConfiguration[presentWidgetData.wtyp]].fields || [];
        } else {
            //means kpi need to show table columns
            flds = querymetaDataInfo[widgetId] || [];
        }

    } else if (widgetType === "iview") {
        flds = querymetaDataInfo[presentWidgetData.tg] || [];
    } else if (widgetType === "Custom__sql") {
        flds = querymetaDataInfo[presentWidgetData.ctg + "Wrapper"] || [];
    }
    flds.forEach(fld => {
        fld = fld.split("~")[0];
        valueHtml += `<option ${firstRowFldType === fld ? "selected" : ""} value="${fld}">${fld}</option>`;
    });
    let paramHtml = "";
    for (param in sqlParamsInfo) {
        paramHtml += `<option ${firstRowParam === param ? "selected" : ""} value="${param}">${param}</option>`;
    }

    let popupHtml = `<div class="container" id="dependencyWidgetSelectionMain">
        <div class="row headerRow">
            <div class="col m10">
                <div class="col s6">
                    Parameter
                </div>
                <div class="col s6">
                    Value
                </div>
            </div>
        </div>
        <div class="row eachParamWrapper">
            <div class="col m10">
                <div class="input-field col s6 slctFld">
                    <select>
                        <option value="" disabled selected>Choose Paramter</option>
                        ${paramHtml}
                    </select>
                </div>
                <div class="input-field col s6 slctFld">
                    <select>
                        <option value="" disabled selected>Choose value</option>
                        ${valueHtml}
                    </select>
                </div>
            </div>
            <div class="col m2">
                <button onclick="addDeleteNewRow(this,'add')" class="waves-effect waves-light addBtn customSmallBtn btn-flat"><span class="icon-plus"></span></button>
                <button onclick="addDeleteNewRow(this,'delete')" class="waves-effect waves-light removeBtn customSmallBtn btn-flat"><span class="icon-cross2"></span></button>
            </div>
        </div>
    </div>`;

    let modalHtml = ` <div id="dependencyModal" class="modal modal-fixed-footer">
                        <div class="modal-content">
                            <h5 style="margin:0" class="extraModelttl">Parameter Mapping</h5>
                          ${popupHtml}
                        </div>
                        <div class="modal-footer">
                        <button title="Create" onclick="createWidgetDepedency('${target}')" type="button" style="" class="wizardPrevNxtBtns waves-effect btn themeButton cutsomColorbtn modal-action modal-close">Ok</button>
                        <button style="margin-right: 4px;" onclick="" type="button" title="Cancel" class="right cancelButton waves-effect btn modal-action modal-close">Cancel</button>
                        </div>
                      </div>`;

    $("body").append(modalHtml);
    $('#dependencyModal').modal({
        ready(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
            if (dependencyObject && dependencyObject.length > 1) {
                dependencyObject.forEach((dependency, index) => {
                    if (index === 0) return; //already handling while creating first row
                    let lastRow = $("#dependencyWidgetSelectionMain .eachParamWrapper:last");
                    lastRow.find(".customSmallBtn.addBtn").click();
                    lastRow = $("#dependencyWidgetSelectionMain .eachParamWrapper:last");
                    lastRow.find('select:first').val(dependency[0]);
                    lastRow.find('select:last').val(dependency[1]);
                });
            }
            $("#dependencyWidgetSelectionMain .slctFld select").material_select();

        },
        complete() {
            $("#dependencyModal").remove();
        }
    });
    $('#dependencyModal').modal('open');

}

function addDeleteNewRow(elem, task) {
    elem = $(elem);
    var maxIndex = $("#dependencyWidgetSelectionMain").data('index') || 1;
    if (task === "add") {
        var mainParent = elem.parents('.eachParamWrapper');
        var presFld = $("<div class='eachParamWrapper row'>" + mainParent.html() + "</div>").insertAfter(mainParent);
        presFld = $(presFld);
        presFld.find('.slctFld').each(function (index, el) {
            let presElem = $(this);
            let selctHtml = '<select>' + presElem.find('select').html() + '</select>';
            presElem.html(selctHtml);
            presElem.find('select').val("").material_select();

        });
        $("#dependencyWidgetSelectionMain").data('index', maxIndex + 1);
    } else if (task === "delete") {
        if (elem.parents('.eachParamWrapper').index() === 1) return
        elem.parents('.eachParamWrapper').remove();
        $("#dependencyWidgetSelectionMain").data('index', maxIndex - 1);
    }
}

function createWidgetDepedency(target) {
    // TODO need to have some validations for now we are omiting the rows which are not filled
    let depObj = [];
    $("#dependencyWidgetSelectionMain .eachParamWrapper").each(function (index, el) {
        const presRow = $(this);
        let key = presRow.find('select:first').val();
        let value = presRow.find('select:last').val();
        if (key !== "" && key !== null && value !== "" && value !== null) {
            depObj.push([key, value]);
        }
    });
    homeJsonObj.updateDataInJson(target, "dep", depObj);
    $("#parameterMappingBtn").text(depObj.join("~")).attr('onclick', `createDependencyPopup('${target}')`);
}

function paramChangedUpdateWidget(params) {
    if (params) {
        if (typeof params === "String") {
            params = [params];
        }
        if (params.length) {
            params.forEach(param => {
                const dependentWidgets = sqlParamsInfo[param];
                if (dependentWidgets) {
                    dependentWidgets.forEach(widgetId => {
                        if (widgetId.toString().charAt(0) === "i") {
                            //means an iview
                            ajaxCallObj.getIviewDataNew({ target: widgetId, calledFrom: "onParamChange" });
                        } else if (widgetId.toString().indexOf("C__sql") === 0) {
                            ajaxCallObj.fireMySql("", widgetId, "", "parameterChanges","");
                        } else {
                            ajaxCallObj.getAxpertWidgetDetails({ tId: "widget" + widgetId, widgetId: widgetId, calledFrom: "dependency" });
                        }
                    });
                }
            });
        }
    }
}

$(document).on('click', '.dependentWidget.fullKPItable tbody tr, .dependentWidget.iviewTable tbody tr ,.dependentWidget.singleCellKPI,.dependentWidget.kpiSingleRow,.dependentWidget.sqlTable tbody tr', function (event) {

    if (presBuiildMode === "homeBuild") {
        return
    }

    let elem = $(this);
    let calledFrom = "fullTable";
    let isDynamicWidget = false;

    let mainWidgetElement = elem.parents('.ui-state-default');

    if (elem.hasClass('singleCellKPI')) {
        calledFrom = "singleCellKPI";
    } else if (elem.hasClass('kpiSingleRow')) {
        calledFrom = "kpiSingleRow";
    } else if (elem.parents('table').hasClass("iviewTable")) {
        calledFrom = "iviewTable";
    }

    if (mainWidgetElement.data("type") === "Custom__dynamic") {
        isDynamicWidget = true;
    }

    let changedParams = [];
    let target = mainWidgetElement.data("target");
    const clickedWidgetDetails = homeJsonObj.jsonContent.jsonData[target + "Wrapper"];
    const dependencyData = clickedWidgetDetails.dep;
    let iviewHyperlinkExists = false;


    if (target.indexOf("C__sql") === 0) {
        calledFrom = "sqlWidget";
        const clickeElemIdx = event.target.cellIndex;
        const columnName = mainWidgetElement.find(`table thead th:eq(${clickeElemIdx})`).data('name');
        const columnProps = (clickedWidgetDetails.cols || {})[columnName];
        if (columnProps && columnProps.hyperLink) {
            iviewHyperlinkExists = true;
            openHyperLinkInDynamicWidget({ obj: columnProps.hyperLink, clickedElem: elem, event, clickedWidgetTarget: target, calledFrom: "sqlWidget" });
        }
    }



    if (calledFrom === "iviewTable") {
        const clickeElemIdx = event.target.cellIndex;
        let hyperlinkInfo = "";
        if (isDynamicWidget) {
            let targetType = mainWidgetElement.data('widgettype');
            if (targetType === "i") {
                target = mainWidgetElement.data('widgetid');
                hyperlinkInfo = iviewInfo[`${target}`].hyperlink_params;
            }
        } else {
            hyperlinkInfo = iviewInfo[`${target.substr(1)}`].hyperlink_params;
        }
        if (hyperlinkInfo && hyperlinkInfo[clickeElemIdx]) {
            hyperlinkInfo = hyperlinkInfo[clickeElemIdx];
            iviewHyperlinkExists = true;
            openHyperLinkInDynamicWidget({ obj: hyperlinkInfo, clickedElem: elem, event, clickedWidgetTarget: target });
        }
    }


    if (!iviewHyperlinkExists && dependencyData && dependencyData.length) {
        let cardColumnName = "";
        if (calledFrom === "singleCellKPI") {
            cardColumnName = (elem.find(".head").text() || "").toLowerCase()
        }
        dependencyData.forEach(dependency => {
            const [key, columnName] = dependency;
            let valueToUpdate = "";
            if (calledFrom === "fullTable" || calledFrom === "iviewTable" || calledFrom === "sqlWidget") {
                const headerIndex = elem.parents('table').find(`thead th:icontains('${makeMeInitCap(columnName)}')`).index();
                if (headerIndex !== -1) {
                    if (calledFrom === "iviewTable") {
                        let hyperlinkInfo = "";
                        if (isDynamicWidget) {
                            hyperlinkInfo = iviewInfo[`${target}`].hyperlink_params;
                        } else {
                            hyperlinkInfo = iviewInfo[`${target.substr(1)}`].hyperlink_params;
                        }
                        if (hyperlinkInfo && hyperlinkInfo[headerIndex]) {
                            hyperlinkInfo = hyperlinkInfo[headerIndex];
                        }
                    }
                    valueToUpdate = elem.find(`td:eq(${headerIndex})`).text()
                }
            } else if (calledFrom === "singleCellKPI") {
                if (cardColumnName === columnName.toLowerCase()) {
                    valueToUpdate = elem.find('.singleKPIvalue').text() || "";
                } else {
                    return;
                }
            } else if (calledFrom === "kpiSingleRow") {
                valueToUpdate = elem.find(`.head:icontains('${columnName}')`).next().text() || "";
            }
            globalVarsKeyValueObject[key] = valueToUpdate;
            changedParams.push(key);
        });
        paramChangedUpdateWidget(changedParams);
    }
})


function openHyperLinkInDynamicWidget({ obj = {}, clickedElem, clickedWidgetTarget, event, url, calledFrom }) {
    const dynamicWidget = $("#C__dynamicWrapper");
    if (dynamicWidget.length) {
        clearDynamicWidget();

        if (calledFrom === "sqlWidget") {
            let strcutName = obj.sname;
            var targetType = strcutName.charAt(0);
            var targetId = strcutName.substr(1);
            var isNew = obj.load === "F";
            var params = obj.p;
            if (obj.ssName.charAt(0) === ":") {
                //Some times user will give ':' directly in strucurename
                targetType = ":";
                targetId = obj.ssName.substr(1);
            }
        } else {
            var { targetType, targetId, isNew, params } = obj;
        }

        if (targetType === ":") {
            const dynamicTargetIdx = clickedElem.parents('table').find('thead th').filter(function () {
                return $(this).text().toLowerCase() == targetId;
            }).index();
            if (dynamicTargetIdx === "-1") {
                return;
            }
            let dynamicTargetValue = clickedElem.find(`td:eq(${dynamicTargetIdx})`).text().toString();
            targetType = dynamicTargetValue.charAt(0);
            targetId = dynamicTargetValue.substr(1);
        }

        if (calledFrom === "widgetLink") {
            let [pageName, params] = url.split("?");
            if (pageName === "ivtoivload.aspx") {
                params = params.split("&");
                let ivName = "";
                let temporaryParams = {};

                params.forEach((param, index) => {
                    if (index === 0) {
                        ivName = param.split("=")[1];
                    } else {
                        let [key, value] = param.split("=");
                        temporaryParams[key] = value;
                    }
                });

                dynamicWidget.data('widgetid', ivName)
                dynamicWidget.data('widgettype', "i");
                ajaxCallObj.getIviewDataNew({ target: "i" + ivName, calledFrom: "dependency", customParams: temporaryParams });
            } else {

                if (url) {
                    dynamicWidget.data('widgettype', "t");
                    try {
                        dynamicWidget.data('widgetid', url.split("?")[1].split("&")[0].split("=")[1])
                    } catch (e) {
                        console.log(e);
                    }

                    dynamicWidget.find('.card-content').html(`<iframe id="homePageDynamicFrame" name="homePageDynamicFrame" frameborder="0" scrolling="no" class="" allowtransparency="True" height="100%" width="100%" src="${url}"></iframe>`);
                }
            }
            return
        } else {
            dynamicWidget.data('widgetid', targetId)
            dynamicWidget.data('widgettype', targetType)
        }

        let baseUrl = ""; //need to be empty for production instance

        //means open new tstruct or open that iview

        if (targetType === "t") {
            let finalUrl = `ivtstload.aspx?tstname=${targetId}&`;
            let recordIdAsParam = false;
            finalUrl += parseTheParams();

            if (!isNew && (!params || (params && !params.length))) {
                let clickedCell = $(event.target);
                let paramName = clickedCell.parents('table').find(`thead th:eq(${clickedCell.index()})`).text().toLowerCase();
                let paramValue = clickedCell.text();
                finalUrl += `${paramName}=${paramValue}&`
            }

            if (isNew) {
                finalUrl += "hltype=open&"
            } else {
                finalUrl += "hltype=load&"
            }

            if (recordIdAsParam) {
                finalUrl += "torecid=true&";
            } else {
                finalUrl += "torecid=false&";
            }
            finalUrl = finalUrl.slice(0, -1);
            dynamicWidget.find('.widgetFooterHoverButtons').addClass('hide');
            dynamicWidget.find('.card-content').html(`<iframe data-called-elemnt-id='${clickedWidgetTarget}' id="homePageDynamicFrame" name="homePageDynamicFrame" frameborder="0" scrolling="no" class="" allowtransparency="True" height="100%" width="100%" src="${baseUrl + finalUrl}"></iframe>`);
        } else if (targetType === "i") {
            dynamicWidget.find('.widgetFooterHoverButtons').removeClass('hide');
            let customParams = parseTheParams();
            ajaxCallObj.getIviewDataNew({ target: "i" + targetId, calledFrom: "dependency", customParams });
        }

        function parseTheParams() {
            let finalData = "";
            if (targetType === "i") {
                finalData = {};
            }
            if (params && params.length) {
                let headerRow = clickedElem.parents('table').find('thead tr');
                params.forEach(param => {
                    if (calledFrom === "sqlWidget") {
                        var { n: paramName, v: valueCol } = param;
                    } else {
                        var [paramName, valueCol] = param;
                    }


                    // const headerIdx = headerRow.find(`th:icontains('${valueCol.replace(":", "")}')`).index();
                    const headerIdx = headerRow.find(`th[data-name='${valueCol.replace(":", "")}']`).index();
                    let paramValue = "";
                    if (headerIdx !== -1) {
                        paramValue = clickedElem.find(`td:eq(${headerIdx})`).text();
                    }
                    if (paramName.toLowerCase() === "recordid") {
                        recordIdAsParam = true;
                    }
                    if (targetType === "i") {
                        finalData[paramName] = paramValue;
                    } else if (targetType === "t") {
                        finalData += `${paramName}=${paramValue}&`;
                    }


                });
            }

            return finalData;
        }

    }
}

function createTableHtml({ data, metaData, calledFrom }) {
    var dataLength = data.length;
    var metaDataLength = metaData.length;
    var html = "";

    if (calledFrom !== "iviewData" && metaDataLength == 1) {
        for (var i = 0; i < dataLength; i++) {
            var presData = customizeData(data[i][0]);
            html += presData + "<br>";
        }
    } else {
        var headerHtml = "<thead><tr>";
        let invalidColumnNames = ["axphide_", "axrnum"];
        let invalidColumns = [];

        for (var i = 0; i < metaDataLength; i++) {
            let { name } = metaData[i];
            name = name.toLowerCase();
            if ($.inArray(name, invalidColumnNames) === -1 && name.indexOf("axphide_") !== 0) {
                if (name.indexOf("axphideh_") === 0) {
                    headerHtml += "<th></th>";
                } else {
                    headerHtml += "<th data-name='" + (name.toLowerCase()) + "' >" + makeMeInitCap(name) + "</th>";
                }
            } else {
                invalidColumns.push(i);
            }
        }
        headerHtml += "</tr></thead>";
        var bodyHtml = "<tbody>";
        for (var i = 0; i < dataLength; i++) {
            bodyHtml += "<tr>";
            for (var j = 0; j < metaDataLength; j++) {
                if ($.inArray(j, invalidColumns) === -1) {
                    var presData = customizeData(data[i][j]);
                    bodyHtml += "<td>" + presData + "</td>";
                }
            }
            bodyHtml += "</tr>";
        }

        let extraClassToAdd = "";
        if (calledFrom === "fireSQL-dependency") {
            extraClassToAdd = "themeTable dependentWidget sqlTable"
        } else if (calledFrom === "iviewData" || calledFrom === "fireSQL") {
            extraClassToAdd = "themeTable dependentWidget iviewTable"
        }
        html = `<table class='iviewSmallShot ${extraClassToAdd}'>${headerHtml + bodyHtml}</table>`;
    }

    return html;
}

/**
 * To search the tabulat text based on keyword
 * @author ManiKanta
 * @Date   2018-08-27T15:30:14+0530
 * @param  {Object/id}                 options.table       Can be a JQUERY or javascript object or table id to search
 * @param  {String}                 options.keyword     The keyword to search in table
 * @param  {Numeric}                 options.columnIndex The column to search the data (undefined === search all the data)
 * @param  {Boolean}                 options.reset       If its true show the complete table
 * @param  {Boolean}                 options.ignoreCase  If true case will be ignored
 * @return {}                                     
 */
function searchTheTableData({ table, keyword, columnIndex, reset, ignoreCase = true }) {
    if (typeof table === "string") {
        if (table.charAt(0) !== "#" || table.charAt(0) !== "#") {
            table = $("#" + table);
        } else {
            table = $(table);
        }
    } else if (typeof table === "object") {
        table = $(table);
    }

if (table[0].nodeName === "TABLE") {
    table.find(`tbody tr`).show();
    if (keyword === "" || reset) {
        return;
    } else {
        table.find(`tbody tr`).hide();
        let searchString = 'tbody td';
        if (columnIndex !== undefined && columnIndex !== "") {
            searchString += `:nth-child(${parseInt(columnIndex || 1)})`
        }
        searchString += `:${ignoreCase ? "i" : ""}contains('${keyword}')`;
        table.find(searchString).parent('tr').show();
    }
}

}


function clearDynamicWidget() {
    const customWidget = $("#C__dynamicWrapper");
    customWidget.removeData("dwidgetid");
}

function resetTheFlippedContainer({ container }) {
    if (container.find('.widgetINParamsCloseIcon').length) {
        tabFocusEventHandler({ task: "unbind", parentElem: container.find('.flipper-back') })
        container.find(".flip-container").removeClass('hover');
        container.removeClass('flippedBack');
        container.find('.flipper-back').mCustomScrollbar("destroy");
        container.find('.flipper-back').html("");
    }
}

/**
 * Meta data coming from node will be in format like {name:meta1}
 * To convert that to an obj which will give idx of meta ==> {meta1:0,meta2;1}
 * @author ManiKanta
 * @Date   2018-09-28T12:21:45+0530
 * @param  {Array}                  metaData Array of objects of metadata
 * @return {[type]}                          [description]
 */
function reduceTheMetaData(metaData = []) {
    let idx = 0;
    return metaData.reduce((obj, { name }) => {
        obj[name] = idx;
        idx++;
        return obj;
    }, {});
}

    /**
     * To reload the widget at any point of time
     * Using in page builder when tstruct is saved calling from tstruct page
     * @author ManiKanta
     * @Date   2018-09-28T12:20:27+0530
     * @param  {String}                 options.widgetTarget Target of the widget=>without wrapper
     * @return {null}                                      
     */
    function reloadTheWidget({ widgetTarget }) {
    const widget = $("#" + widgetTarget + "Wrapper");
    if (widget.length) {
        const widgetType = widget.data('type');
        if (widgetType === "iview") {
            ajaxCallObj.getIviewDataNew({ target: widgetTarget, calledFrom: "onParamChange" });
        } else if (widgetType === "widget") {
            ajaxCallObj.getAxpertWidgetDetails({ tId: widgetTarget, calledFrom: "dependency" });
        }
    }
}

/**
 * Method to be called on ever ajaxcall failure
 * @author ManiKanta
 * @Date   2018-09-28T13:30:04+0530
 * @return {[type]}                  [description]
 */
function onAjaxFailure() {
    callParentNew("closeFrame()","function");
    showAlertDialog("error", "Internal server error. Please check your node server is running.");
}


/**
 * To create extra modal popup in wizard popup
 * @param  {String} type    For conditions
 * @param  {Object/String} details For extra info to access based on condition
 * @return {null}         No return
 */
function createExtraModel({ type, details, metaData, calledFrom }) {
    var idOfModel = "extraMdl" + type;
    var modelHtml = "";
    // modelHtml += '<a class="waves-effect waves-light btn modal-trigger" href="#modal1">Modal</a>';
    modelHtml += '<div id="' + idOfModel + '" class="modal modal-fixed-footer">';
    modelHtml += '<div class="modal-content">';
    modelHtml += '<h4 class="extraModelttl">{{headTiltle}}</h4>';
    modelHtml += '{{columnSelection}}'
    modelHtml += '{{body}}';
    modelHtml += '</div>';
    modelHtml += '<div class="modal-footer">';
    modelHtml += '<button title="Apply" onclick="applyTheModalData({{extraColAppCb}})" class="waves-effect btn themeButton cutsomColorbtn">Apply</button>';
    modelHtml += '<button title="Cancel" class="modal-action modal-close cancelButton waves-effect btn">Cancel</button>';
    modelHtml += '</div>';
    modelHtml += '</div>';
    var modelBodyHtml = "";
    var headTitle = "";
    var extraColAppCb = "";
    if (type === "col") {
        let presObjVals = {};
        let presColName = "";
        if (presBuiildMode === "widgetBuild") {
            var clickedElem = $(details);
            var originalIndexPost = clickedElem.data('original');
            extraColAppCb = "'" + idOfModel + "','" + originalIndexPost + "','cols'";
            presObjVals = presWizardData.iviews.cols[originalIndexPost];
            presColName = clickedElem.text();
        } else {
            // presObjVals
            const widgetId = getActiveWidgetId();
            // extraColAppCb = "'" + idOfModel + "','','cols'";
            extraColAppCb = `'${idOfModel}','${widgetId}','cols'`;
            const widgetColProps = homeJsonObj.jsonContent.jsonData[widgetId].cols;
            const colName = ($("#modalColumnSelector").val() || metaData[0] || "").toLowerCase();
            if (widgetColProps && widgetColProps[colName]) {
                presObjVals = widgetColProps[colName];
            }
        }
        var nxtPrevBts = '<span style="float: right;"><button title="Previous Column" class="waves-effect waves-light btn-flat "><span class="icon-chevron-left"></span></button><button title="Next Column" class="waves-effect waves-light btn-flat "><span class="icon-chevron-right"></span></button></span>';
        headTitle = presColName + " Properties";
        modelBodyHtml += '<div class="container1">';
        modelBodyHtml += '<div class="row">';
        modelBodyHtml += '<div class="col s12">';
        modelBodyHtml += '<div class="row">';
        modelBodyHtml += '<div class="col s12">';
        modelBodyHtml += '<ul class="tabs materialTabs">';
        if (presBuiildMode !== "homeBuild") { //need to remove once column props are implemented in page designer
            modelBodyHtml += '<li class="tab"><a class="active" href="#ivColProp">Properties</a></li>';
        }
        modelBodyHtml += '<li class="tab"><a href="#ivColLink">Hyperlink</a></li>';
        modelBodyHtml += '<li style="display:none" class="tab"><a href="#ivColCf">Conditional Format</a></li>';
        modelBodyHtml += '</ul>';
        modelBodyHtml += '</div>';
        modelBodyHtml += `<div style="display:${presBuiildMode === "homeBuild" ? 'none' : 'block'}" id="ivColProp">`;
        modelBodyHtml += '<div class="row">';
        modelBodyHtml += '<div class="input-field col s12 m6">';
        modelBodyHtml += '<input disabled id="ivColPropName" value="' + presObjVals.name + '" class="themeMaterialInp" type="text">';
        modelBodyHtml += '<label for="ivColPropName">Name</label>';
        modelBodyHtml += '</div>';
        modelBodyHtml += '<div class="input-field col s12 m6">';
        var presDtpSel = presObjVals.dtype;
        var isDeciDisabeld = presDtpSel === "Numeric" ? "" : "disabled"
        modelBodyHtml += '<input ' + isDeciDisabeld + ' maxlength="10" id="ivColPropDcml" value="' + presObjVals.decimal + '" class="themeMaterialInp" type="text">';
        modelBodyHtml += '<label for="ivColPropDcml">Decimal</label>';
        modelBodyHtml += '</div>';
        modelBodyHtml += '<div class="input-field col s12 m6">';
        modelBodyHtml += '<input maxlength="50" id="ivColPropCptn" value="' + presObjVals.caption + '" class="themeMaterialInp mandatoryFld" type="text">';
        modelBodyHtml += '<label for="ivColPropCptn">Caption<sup>*</sup></label>';
        modelBodyHtml += '</div>';
        modelBodyHtml += '<div class="input-field col s12 m6">';
        modelBodyHtml += '<input maxlength="10" id="ivColPropClWdth" value="' + presObjVals.width + '" class="themeMaterialInp" type="text">';
        modelBodyHtml += '<label for="ivColPropClWdth">Column Width</label>';
        modelBodyHtml += '</div>';
        modelBodyHtml += '<div class="input-field col s12 m6">';
        modelBodyHtml += '<select id="ivColPropDtTypeSel" class="materialSelect">';
        modelBodyHtml += '<option value="" disabled selected>Choose your option</option>';


        modelBodyHtml += (presDtpSel === "Character") ? '<option selected value="Character">Character</option>' : '<option value="Character">Character</option>';
        modelBodyHtml += (presDtpSel === "Numeric") ? '<option selected value="Numeric">Numeric</option>' : '<option value="Numeric">Numeric</option>';
        modelBodyHtml += (presDtpSel === "Date/Time") ? '<option selected value="Date/Time">Date</option>' : '<option value="Date">Date</option>';

        modelBodyHtml += '</select>';
        modelBodyHtml += '<label>Data Type</label>';
        modelBodyHtml += '</div>';
        modelBodyHtml += '<div class="input-field col s12 m6">';
        modelBodyHtml += '<select id="ivColPropAlign" class="materialSelect">';
        modelBodyHtml += '<option value="" disabled selected>Choose your option</option>';
        var presAlgnTp = presObjVals.align;

        modelBodyHtml += (presAlgnTp === "Left") ? '<option selected value="Left">Left</option>' : '<option value="Left">Left</option>';
        modelBodyHtml += (presAlgnTp === "Right") ? '<option selected value="Right">Right</option>' : '<option value="Right">Right</option>';
        modelBodyHtml += (presAlgnTp === "Center") ? '<option selected value="Center">Center</option>' : '<option value="Center">Center</option>';

        // modelBodyHtml += '<option value="Left">Left</option>';
        // modelBodyHtml += '<option value="Right">Right</option>';
        var isNumeric = presDtpSel === "Numeric" ? "" : "display:none;";
        modelBodyHtml += '</select>';
        modelBodyHtml += '<label>Alignment</label>';
        modelBodyHtml += '</div>';
        modelBodyHtml += '</div>';
        modelBodyHtml += '<div class="row" id="ivColPrpsCheckBox">';
        modelBodyHtml += '<p style="' + isNumeric + '" class="ivChckBx ivColPropNumData">';
        var isChecked = presObjVals.rtotal === "T" ? "checked" : "";
        modelBodyHtml += '<input ' + isChecked + ' type="checkbox" id="ivColRnTtl" />';
        modelBodyHtml += '<label for="ivColRnTtl">Running Total</label>';
        modelBodyHtml += '</p>';
        modelBodyHtml += '<p style="' + isNumeric + '" class="ivChckBx ivColPropNumData">';
        isChecked = presObjVals.disptotal === "T" ? "checked" : "";
        modelBodyHtml += '<input ' + isChecked + ' type="checkbox" id="ivColDsTtl" />';
        modelBodyHtml += '<label for="ivColDsTtl">Display Total</label>';
        modelBodyHtml += '</p>';
        modelBodyHtml += '<p style="' + isNumeric + '" class="ivChckBx ivColPropNumData">';
        isChecked = presObjVals.applycomma === "T" ? "checked" : "";
        modelBodyHtml += '<input ' + isChecked + ' type="checkbox" id="ivColAppCom" />';
        modelBodyHtml += '<label for="ivColAppCom">Apply Comma</label>';
        modelBodyHtml += '</p>';
        modelBodyHtml += '<p class="ivChckBx">';
        isChecked = presObjVals.norepeat === "T" ? "checked" : "";
        modelBodyHtml += '<input ' + isChecked + ' type="checkbox" id="ivColNRpt" />';
        modelBodyHtml += '<label for="ivColNRpt">No Repeat</label>';
        modelBodyHtml += '</p>';
        modelBodyHtml += '<p style="' + isNumeric + '" class="ivChckBx ivColPropNumData">';
        isChecked = presObjVals.zerooff === "T" ? "checked" : "";
        modelBodyHtml += '<input ' + isChecked + ' type="checkbox" id="ivColZrOf" />';
        modelBodyHtml += '<label for="ivColZrOf">Zero Off</label>';
        modelBodyHtml += '</p>';
        modelBodyHtml += '<p class="ivChckBx">';
        isChecked = presObjVals.hidden === "T" ? "checked" : "";
        modelBodyHtml += '<input ' + isChecked + ' type="checkbox" id="ivColIsHid" />';
        modelBodyHtml += '<label for="ivColIsHid">Hidden</label>';
        modelBodyHtml += '</p>';
        modelBodyHtml += '</div>';
        modelBodyHtml += '</div>';

        let hypData = "";
        var isHypExists = false;
        if (presBuiildMode === "widgetBuild") {
            let presObjHypNames = presWizardData.extraData.hyperlinks;
            if (presObjHypNames) {
                var presIndex = presObjHypNames[presObjVals.name]
                if (presIndex !== undefined) {
                    isHypExists = true;
                    hypData = presWizardData.iviews.hyperlinks[presIndex];
                }
            }
        } else if (presBuiildMode === "homeBuild" && isPageBuilder) {
            hypData = presObjVals.hyperLink;
            if (hypData) {
                isHypExists = true;
            }
        }



        modelBodyHtml += '<div id="ivColLink">';
        modelBodyHtml += '<div class="row">';
        modelBodyHtml += '<div class="input-field col s12">';
        if (isHypExists) {

            modelBodyHtml += '<input maxlength="10" value=' + hypData.hname + ' id="ivColHypName" class="themeMaterialInp" type="text">';
        } else {
            modelBodyHtml += '<input maxlength="10" id="ivColHypName" class="themeMaterialInp" type="text">';
        }

        modelBodyHtml += '<label for="ivColHypName">Name</label>';
        modelBodyHtml += '</div>';
        modelBodyHtml += '<div class="input-field col s12 m6">';
        modelBodyHtml += '<select id="ivColPropTypeSel" class="materialSelect">';
        modelBodyHtml += '<option value="" disabled selected>Choose your option</option>';
        var frstChar = "";
        if (isHypExists) {
            frstChar = hypData.sname.substr(0, 1)
        }
        isChecked = frstChar === "i" ? "selected" : "";
        modelBodyHtml += '<option ' + isChecked + ' value="i">Iview</option>';
        isChecked = frstChar === "t" ? "selected" : "";
        modelBodyHtml += '<option ' + isChecked + ' value="t">Tstruct</option>';
        // isChecked = frstChar === "p" ? "selected" : "";
        // modelBodyHtml += '<option ' + isChecked + ' value="p">Page</option>';
        modelBodyHtml += '</select>';
        modelBodyHtml += '<label>Type</label>';
        modelBodyHtml += '</div>';
        modelBodyHtml += '<div class="input-field col s12 m6">';
        if (isHypExists) {
            modelBodyHtml += '<input data-key=' + hypData.sname.substr(1) + ' value="' + hypData.ssName + '" id="ivColHypStName" class="themeMaterialInp" type="text">';
        } else {
            modelBodyHtml += '<input id="ivColHypStName" class="themeMaterialInp" type="text">';
        }
        modelBodyHtml += '<label for="ivColHypStName">Structure Name</label>';
        modelBodyHtml += '</div>';
        modelBodyHtml += '<div class="input-field col s12 m6">';
        modelBodyHtml += '<select id="ivColPropAction" class="materialSelect">';
        modelBodyHtml += '<option value="" disabled>Choose your option</option>';
        //edit => load(t)
        var isLoad = "";
        if (isHypExists) {
            isLoad = hypData.load;
        }
        isChecked = isLoad === "T" ? "selected" : "";
        modelBodyHtml += '<option ' + isChecked + ' value="edit">Edit</option>';
        isChecked = isLoad === "F" ? "selected" : "";
        modelBodyHtml += '<option ' + isChecked + ' value="new">New</option>';
        modelBodyHtml += '</select>';
        modelBodyHtml += '<label>Action</label>';
        modelBodyHtml += '</div>';
        var isPop = "F";
        var isRefresh = "";
        if (isHypExists) {
            isPop = hypData.pop;
            isRefresh = hypData.refresh;
        }
        modelBodyHtml += '<p class="ivChckBx">';
        isChecked = isPop === "T" ? "checked" : "";
        modelBodyHtml += '<input ' + isChecked + ' type="checkbox" id="ivHypOpntp" />';
        modelBodyHtml += '<label for="ivHypOpntp">Open as popup</label>';
        modelBodyHtml += '</p>';
        isChecked = isRefresh === "T" ? "checked" : "";
        if (isRefresh === "")
            modelBodyHtml += '<p style="display:none;" class="ivChckBx">';
        else
            modelBodyHtml += '<p class="ivChckBx">';
        modelBodyHtml += '<input ' + isChecked + ' type="checkbox" id="ivHyprpoc" />';
        modelBodyHtml += '<label for="ivHyprpoc">Refresh Parent on close</label>';
        modelBodyHtml += '</p>';
        modelBodyHtml += '</div>';
        modelBodyHtml += '<div id="ivColHypPramWrapper" class="row">';
        if (isHypExists) {
            var paramData = hypData.p;
            if (paramData.length === 0) {
                paramData = [{ n: "", v: "", nn: "", vv: "" }];
            }
        } else {
            var paramData = [{ n: "", v: "", nn: "", vv: "" }]
        }


        modelBodyHtml += createHyperlinkParamHtml({ paramData });


        // var paramDtLth = paramData.length;
        // for (var i = 0; i < paramDtLth; i++) {
        //     var presPobj = paramData[i];
        //     modelBodyHtml += '<div class="cloneParent">';
        //     modelBodyHtml += '<div class="input-field col s5">';
        //     modelBodyHtml += '<input data-key = "' + presPobj.n + '" value="' + presPobj.nn + '" id="ivColHyPName' + i + '" class="cloneChangeId themeMaterialInp" data-idkey="ivColHyPName" type="text">';
        //     modelBodyHtml += '<label for="ivColHyPName' + i + '">Parameter Name</label>';
        //     modelBodyHtml += '</div>';
        //     modelBodyHtml += '<div class="input-field col s5">';
        //     modelBodyHtml += '<input data-key = "' + presPobj.v + '" value="' + presPobj.vv + '" id="ivColHypVal' + i + '" class="cloneChangeId themeMaterialInp" data-idkey="ivColHypVal" type="text">';
        //     modelBodyHtml += '<label for="ivColHypVal' + i + '" >Value</label>';
        //     modelBodyHtml += '</div>';
        //     modelBodyHtml += '<div class="col s2 ivColAdDelWrapper">';

        //     if (paramDtLth - 1 == i)
        //         modelBodyHtml += '<button onclick="genericCloneTheRow(this,\'add\',\'ivColHyp\')" data-index="' + i + '" class="waves-effect waves-light addBtn btn-flat"><span class="icon-plus"></span></button>';
        //     else
        //         modelBodyHtml += '<button style="display:none" onclick="genericCloneTheRow(this,\'add\',\'ivColHyp\')" data-index="' + i + '" class="waves-effect waves-light addBtn btn-flat"><span class="icon-plus"></span></button>';

        //     if (paramDtLth === 1)
        //         modelBodyHtml += '<button style="display:none" onclick="genericCloneTheRow(this,\'delete\',\'ivColHyp\')" data-index="' + i + '" class="waves-effect waves-light delBtn btn-flat"><span class="icon-cross2"></span></button>';
        //     else
        //         modelBodyHtml += '<button onclick="genericCloneTheRow(this,\'delete\',\'ivColHyp\')" data-index="' + i + '" class="waves-effect waves-light delBtn btn-flat"><span class="icon-cross2"></span></button>';
        //     modelBodyHtml += '</div>';
        //     modelBodyHtml += '</div>';

        // }

        modelBodyHtml += '</div>';
        modelBodyHtml += '</div>';

        // Conditional format related stuff

        modelBodyHtml += '<div id="ivColCf" class="col s12">';
        modelBodyHtml += '<div class="row">';
        modelBodyHtml += '<div class="cloneParent">';
        modelBodyHtml += '<div class="input-field col s8">';
        modelBodyHtml += '<input id="ivColHyPExp1" class="cloneChangeId themeMaterialInp" data-idkey="ivColHyPExp" type="text">';
        modelBodyHtml += '<label for="ivColHyPExp1">Expression</label>';
        modelBodyHtml += '</div>';
        modelBodyHtml += '<div class="col s4 ivColAdDelWrapper">';
        modelBodyHtml += '<button onclick="createExtraModel({type:\'font\',details:this})" class="cutsomColorbtn themeButton waves-effect waves-light btn" title="Font Settings" style="text-transform: capitalize;padding: 0 15px;line-height:0;"><span class="icon-sigma"></span></button>';
        modelBodyHtml += '<button onclick="genericCloneTheRow(this,\'add\')" data-index="1" class="waves-effect addBtn waves-light btn-flat"><span class="icon-plus"></span></button>';
        modelBodyHtml += '<button style="display:none" onclick="genericCloneTheRow(this,\'delete\')" data-index="1" class="waves-effect delBtn waves-light btn-flat"><span class="icon-cross2"></span></button>';

        modelBodyHtml += '</div></div></div></div></div></div></div></div>';

    } else if (type === "param") {
        headTitle = "Parameter Details";
        var parentElem = $(details).parents(".ivEchPramWrapper");
        var parentElmIndex = parentElem.index();
        extraColAppCb = "'" + idOfModel + "','" + parentElmIndex + "','params'";
        modelBodyHtml += getModalHTML({ type, details, idOfModel });
    } else if (type === "font") {
        headTitle = "Font Selector";
        extraColAppCb = "'" + idOfModel + "','" + details + "','font-cf'";
        modelBodyHtml += getModalHTML({ type, details, idOfModel });
    }
    modelHtml = modelHtml.replace("{{body}}", modelBodyHtml);
    modelHtml = modelHtml.replace("{{headTiltle}}", headTitle);
    modelHtml = modelHtml.replace("{{extraColAppCb}}", extraColAppCb);

    if (presBuiildMode === "homeBuild" && isPageBuilder) {
        let columSelectionHTML = "";
        if (metaData && metaData.length) {
            columSelectionHTML += `<div id="modelColumnChanger"><label>Column</label>
                                    <select class="materialSelect" id="modalColumnSelector">`;
            metaData.forEach(header => {
                header = header.toLowerCase();
                columSelectionHTML += `<option value="${header}">${header}</option>`
            });
            columSelectionHTML += `</select></div>`;
        }

        //       <label>Browser Select</label>
        // <select class="browser-default">
        //   <option value="" disabled selected>Choose your option</option>
        //   <option value="1">Option 1</option>
        //   <option value="2">Option 2</option>
        //   <option value="3">Option 3</option>
        // </select>


        modelHtml = modelHtml.replace("{{columnSelection}}", columSelectionHTML);
    } else {
        modelHtml = modelHtml.replace("{{columnSelection}}", "");
    }


    if (type === "font") {
        $("#fontModelComp").html(modelHtml);
        var fontData = $(details).data('value');
        if (fontData) {
            fontData = fontData.split(",");
            var isChecked;
            $("#fontSelect").val(fontData[0]);
            $("#fontSize").val(fontData[6]);
            $("#custom").spectrum("set", fontData[4])
            isChecked = fontData[1] === "t" ? true : false;
            $("#fontBold").prop('checked', isChecked);
            isChecked = fontData[2] === "t" ? true : false;
            $("#fontItalic").prop('checked', isChecked);
            isChecked = fontData[3] === "t" ? true : false;
            $("#fontUdr").prop('checked', isChecked);
            isChecked = fontData[5] === "t" ? true : false;
            $("#fontStr").prop('checked', isChecked);
        }
    } else {
        $("#extraModelComp").html(modelHtml);
    }
    $('#' + idOfModel).modal({
        dismissible: false,
        ready: function (modal, trigger) {
            tabFocusEventHandler({ task: 'bind', parentId: idOfModel, loopInsideParent: true });
            $('#' + idOfModel + ' ul.materialTabs').tabs();
            $("#ivColPropAction").val($("#ivColPropAction option[selected]").val()).material_select("destroy");
            $("#ivColPropAction").material_select();
            materialModalEventsHandler("bind");
        },
        complete: function () {
            tabFocusEventHandler({ task: 'unbind', parentId: idOfModel });
            materialModalEventsHandler("unbind");
            $("#" + idOfModel).remove();

        } // Callback for Modal close
    });
    $('#' + idOfModel).modal('open');

    if (type === "font") {
        afterModalIsCreated({ idOfModel, type })
    } else if (type === "col") {
        $("#ivColPropDtTypeSel").on('change', function (e) {
            var selctdVal = $(this).val().toLowerCase();
            if (selctdVal === "numeric") {
                $("#ivColPrpsCheckBox .ivColPropNumData").show();
                $("#ivColPropDcml").prop('disabled', false)
            } else {
                $("#ivColPrpsCheckBox .ivColPropNumData").hide();
                $("#ivColPropDcml").prop('disabled', true)
            }

        });

        $("#ivHypOpntp").on('change', function (e) {
            if ($(this).is(':checked')) {
                $("#ivHyprpoc").parent().show();
            } else {
                $("#ivHyprpoc").parent().hide();
            }

        });

        $("#ivColPropTypeSel").on('change', function (e) {
            if ($(this).hasClass('manualTrigger')) {
                $(this).removeClass('manualTrigger');
                var typeVal = $("#ivColPropTypeSel").val();
                var key = $("#ivColHypStName").data('key');
                var iName = typeVal + key;
                var cachedObj = structureParams[iName];
                if (cachedObj)
                    crateAutoCompleteFld("#ivColHyPName0", cachedObj);
            } else {
                $("#ivColHypStName").val("").data('key', undefined);
                resetIvHyperlinks();
            }

            var selctdVal = $(this).val().toLowerCase();
            var curCacheData = ivTstData[selctdVal];
            if (!curCacheData) {
                ajaxCallObj.getTypeDetails(selctdVal)
            } else {
                crateAutoCompleteFld("#ivColHypStName", curCacheData)
            }
            if (selctdVal === "i") {
                $("#ivColPropAction").val("edit").addClass('disabled').prop("disabled", true).material_select()
            } else {
                $("#ivColPropAction").val("").removeClass('disabled').prop("disabled", false).material_select()
            }
        });

        if (isHypExists) {
            $("#ivColPropTypeSel").addClass('manualTrigger').change();

            var typeVal = $("#ivColPropTypeSel").val();
            var key = $("#ivColHypStName").data('key');
            var iName = typeVal + key;
            var cachedObj = structureParams[iName];
            $("#ivColHypPramWrapper .cloneParent [id^='ivColHyPName']").each(function (index, el) {
                crateAutoCompleteFld("#" + $(this).attr('id'), cachedObj);
            });
        }


        if (presBuiildMode === "homeBuild" && isPageBuilder) {
            $("#modalColumnSelector").on('change', function (e) {
                changeTheModalPopUpValues({ newValue: $(this).val(), idOfModel: idOfModel });
            });
        }

    } else if (type === "param") {
        $("#ivPropType").on('change', function (e) {
            var selctdVal = $(this).val().toLowerCase();
            if (selctdVal === "numeric") {
                $("#ivPropdcml").prop('disabled', false)
            } else {
                $("#ivPropdcml").prop('disabled', true)
            }

        });
    }

    $('#' + idOfModel + ' .materialSelect').material_select("destroy");
    $('#' + idOfModel + ' .materialSelect').material_select();
    Materialize.updateTextFields();
}


/**
 * will be called when the modal clicked on apply. If everything is valid need to close modal based on id passed
 * Moving from widgetbuilder.js, since page is also using similar functionality of column props in SQL widget
 * @author ManiKanta
 * @Date   2018-10-05T15:55:36+0530
 * @param  {String}                 idOfModel Id of the modal
 * @param  {Number}                 index     Column index/widgetId in pageBuilder
 * @param  {String}                 type      Type of the modal
 * @return {}                           
 */
function applyTheModalData(idOfModel, index, type) {

    if (!doModalValidationsOnClose({ type, index })) {
        return false;
    }
    if (type === "cols") {
        var dataToadd = {};
        const colName = $("#ivColPropName").val();
        dataToadd.name = colName;
        dataToadd.decimal = $("#ivColPropDcml").val() || "0";
        dataToadd.caption = $("#ivColPropCptn").val();
        dataToadd.width = $("#ivColPropClWdth").val();
        dataToadd.dtype = $("#ivColPropDtTypeSel").val();
        dataToadd.align = $("#ivColPropAlign").val();
        dataToadd.norepeat = $("#ivColNRpt").is(":checked") ? "T" : "F";
        dataToadd.hidden = $("#ivColIsHid").is(":checked") ? "T" : "F";
        if (dataToadd.dtype === "Numeric") {
            dataToadd.rtotal = $("#ivColRnTtl").is(":checked") ? "T" : "F";
            dataToadd.disptotal = $("#ivColDsTtl").is(":checked") ? "T" : "F";
            dataToadd.applycomma = $("#ivColAppCom").is(":checked") ? "T" : "F";
            dataToadd.zerooff = $("#ivColZrOf").is(":checked") ? "T" : "F";
        } else {
            dataToadd.rtotal = "F";
            dataToadd.disptotal = "F";
            dataToadd.applycomma = "F";
            dataToadd.zerooff = "F";
        }

        var hypName = $("#ivColHypName").val();
        if (hypName !== "") {
            //means hyperlink exists
            var hypData = dataToadd.hyperLink = {};
            hypData.source = dataToadd.name;
            hypData.hname = $("#ivColHypName").val();
            hypData.sname = $("#ivColPropTypeSel").val() + $("#ivColHypStName").data("key");
            hypData.ssName = $("#ivColHypStName").val();
            hypData.load = $("#ivColPropAction").val() === "edit" ? "T" : "F";
            hypData.pop = $("#ivHypOpntp").is(":checked") ? "T" : "F";
            hypData.refresh = $("#ivHyprpoc").is(":checked") ? "T" : "F";
            var hypParamData = dataToadd.hyperLink.p = [];
            $("#ivColHypPramWrapper .cloneParent").each(function (index, el) {
                var elem = $(this);
                var nameElem = elem.find('input[id^="ivColHyPName"]');
                var valElem = elem.find('input[id^="ivColHypVal"]');
                var name = nameElem.data("key");
                var value = valElem.data("key");
                if (name && value) {
                    hypParamData.push({ n: name, v: value, nn: nameElem.val(), vv: valElem.val() });
                }
            });
        }

        if (presBuiildMode === "widgetBuild") {
            dataToadd.index = $("div[data-original=" + index + "]").index();
            createUpdateIvJsonData("cols", dataToadd, index, false);
        } else {
            homeJsonObj.jsonContent.jsonData[index].cols[colName] = dataToadd;
            homeJsonObj.updateDataInJson(index);
            // homeJsonObj.updateDataInJson($(this).parents('#propertySheet').data('target'), "cols", dataToadd);
        }
    } else if (type.indexOf("font") === 0 || type === "params") {
        applyTheExtraColPropsForIview({ idOfModel, index, type });
    }
    $('#' + idOfModel).modal('close');
}

/**
 * When click on apply in the modal this fn will be called for validation part if its sends false then modal wont close
 * @author ManiKanta
 * @Date   2018-10-08T10:29:58+0530
 * @param  {String}                 options.type  Modal type
 * @param  {index}                  options.index Some extra info for widgetbuilder
 * @return {Boolean}                              Need to send true or false
 */
function doModalValidationsOnClose({ type, index }) {
    if (type === "cols") {
        var decimalVal = $("#ivColPropDcml").val();
        if (!isValidNumber(decimalVal)) {
            $("#ivColPropDcml").focus();
            showAlertDialog("warning", globalMessages.invalidDecimalVal);
            return false;
        }
        var colWidthVal = $("#ivColPropClWdth").val();
        if (!isValidNumber(colWidthVal)) {
            $("#ivColPropClWdth").focus();
            showAlertDialog("warning", globalMessages.invalidColWidth);
            return false;
        }
        if ($("#ivColPropCptn").val() === "") {
            showAlertDialog("warning", globalMessages.noCaption);
            $("#ivColPropCptn").focus();
            return false;
        }
        var enteredHypVal = $("#ivColHypName").val();
        if (enteredHypVal !== "" || $("a[href='#ivColLink']").hasClass("active")) {
            if (enteredHypVal === "" || !testRegex("validNameWithoutSpace", enteredHypVal)) {
                showAlertDialog("warning", globalMessages.invalidName);
                $("#ivColHypName").focus();
                return false;
            }



            //for hyperlink name duplicate check
            //Cuurently working for widgetbuilder need TODO logic for page builder(In page builder name doesnt matter for now)
            if (presBuiildMode === "widgetBuild") {
                index = index || "";
                var colName = $(".ciColWrapper[data-original=" + index + "]").text();
                if (presWizardData.extraData.hyperlinks) {
                    index = presWizardData.extraData.hyperlinks[colName];
                    if (index !== undefined) {
                        index = parseInt(index);
                    }
                    var hypData = presWizardData.iviews.hyperlinks;
                    for (var i = 0; i < hypData.length; i++) {
                        if (i === index) {
                            continue;
                        }
                        var presHypName = hypData[i].hname.toLowerCase();
                        if (presHypName === enteredHypVal.toLowerCase()) {
                            showAlertDialog("warning", widgetMessages.hypNameExists);
                            $("#ivColHypName").focus();
                            return false;
                        }
                    }
                }
            }

            //for hyperlink multiple param should not be same
            var hypNames = [];
            var errorMsg = false;
            $("#ivColHypPramWrapper .cloneParent [id^='ivColHyPName']").each(function (index, el) {
                var elem = $(this);
                var param = elem.data('key');
                if (param) {
                    if ($.inArray(param, hypNames) !== -1) {
                        errorMsg = globalMessages.multipleHypParams;
                        elem.focus();
                        return false;
                    } else {
                        hypNames.push(param);
                    }
                }
            });

            if (errorMsg !== false) {
                showAlertDialog("warning", errorMsg);
                return false;
            }

            if ($("#ivColPropTypeSel").val() === "" || $("#ivColPropTypeSel").val() === null) {
                showAlertDialog("warning", globalMessages.noTypeSelected);
                $("#ivColPropTypeSel").parent().find('input').click();
                return false;
            }
            if (!$("#ivColHypStName").data("key") || $("#ivColHypStName").val() === "") {
                showAlertDialog("warning", globalMessages.validStructureName);
                $("#ivColHypStName").focus();
                return false;
            }
            //need to validate hyperlink Params - TO_DO -
        }
    }

    if (presBuiildMode === "widgetBuild") {
        return doTheIviewValidations(type, index);
    }
    //if it comes here no errors 
    return true;
}

/**
 * Will be called when column selection dropdown changes in column props modal popup
 * @author ManiKanta
 * @Date   2018-10-08T13:17:42+0530
 * @param  {String}                 options.newValue New column name
 * @return {}                                  
 */
function changeTheModalPopUpValues({ newValue, idOfModel }) {
    let newValueObj = {};
    if (presBuiildMode === "homeBuild" && isPageBuilder) {
        let widgetID = getActiveWidgetId();
        newValueObj = homeJsonObj.jsonContent.jsonData[widgetID].cols[newValue] || {};
    }
    if (presBuiildMode === "homeBuild" && isPageBuilder) {
        resetIvHyperlinks({ allData: true });
        $("#ivColPropName").val(newValueObj.name);
        $("#ivColPropCptn").val(newValueObj.caption);
        $("#ivColPropDcml").val(newValueObj.decimal);
        $("#ivColPropClWdth").val(newValueObj.width);
        $("#ivColPropDtTypeSel").val(newValueObj.dtype);
        $("#ivColPropAlign").val(newValueObj.align);

        if (newValueObj.dtype === "Numeric") {
            $("#ivColPrpsCheckBox .ivColPropNumData").show();
            let isChecked = false;
            isChecked = newValueObj.rtotal === "T";
            $("#ivColRnTtl").prop('checked', isChecked);
            isChecked = newValueObj.disptotal === "T";
            $("#ivColDsTtl").prop('checked', isChecked);
            isChecked = newValueObj.applycomma === "T";
            $("#ivColAppCom").prop('checked', isChecked);
            isChecked = newValueObj.zerooff === "T";
            $("#ivColZrOf").prop('checked', isChecked);
        } else {
            $("#ivColPrpsCheckBox .ivColPropNumData").hide();
        }
        isChecked = newValueObj.norepeat === "T";
        $("#ivColNRpt").prop('checked', isChecked);
        isChecked = newValueObj.hidden === "T";
        $("#ivColIsHid").prop('checked', isChecked);

        const hyperLinkData = newValueObj.hyperLink;
        if (hyperLinkData) {
            $("#ivColHypName").val(hyperLinkData.hname);
            const structure = hyperLinkData.sname;
            $("#ivColPropTypeSel").val(structure.charAt(0));
            $("#ivColHypStName").data('key', structure.charAt(0)).val(hyperLinkData.ssName);
            let action = hyperLinkData.load === "T" ? "edit" : "new";
            $("#ivColPropAction").val(action);
            let isPopUp = hyperLinkData.pop === "T";
            $("#ivHypOpntp").prop('checked', isPopUp);
            isChecked = hyperLinkData.refresh === "T";
            $("#ivHyprpoc").prop('checked', isChecked);
            if (isPopUp) {
                $("#ivHyprpoc").parent('.ivChckBx').show();
            } else {
                $("#ivHyprpoc").parent('.ivChckBx').hide();
            }

            if (hyperLinkData.p) {
                let hyperLinkHTML = createHyperlinkParamHtml({ paramData: hyperLinkData.p });
                $("#ivColHypPramWrapper").html(hyperLinkHTML);
            }
        }


        $('#' + idOfModel + ' .materialSelect').material_select("destroy");
        $('#' + idOfModel + ' .materialSelect').material_select();
        Materialize.updateTextFields();
    }
}


function genericCloneTheRow(elem, task, keyPoint, parent) {
    parent = parent || "cloneParent";
    // var parentEl = $("."+parent);
    elem = $(elem);
    var parentHtml = elem.parents("." + parent);
    if (task === "add") {
        var index = elem.data('index');
        var indexToAdd = index + 1;

        parentHtml.find('.addBtn').hide();
        parentHtml.find('.delBtn').show();
        var html = "<div class='" + parent + "'>" + parentHtml.html() + "</div>";
        var presHtml = $(html).insertAfter(parentHtml);
        presHtml.find('.cloneChangeId').each(function (index, el) {
            var presEl = $(this);
            var key = presEl.data('idkey');
            presEl.attr('id', key + indexToAdd);
            var presNextEl = presEl.next();
            if (presNextEl && presNextEl[0] && presNextEl[0].nodeName === "LABEL") {
                presNextEl.attr('for', key + indexToAdd);
            }
        });
        presHtml.find('.addBtn,.delBtn').data('index', indexToAdd).show();

        if (keyPoint === "ivColHyp") {
            presHtml.find('input').val("").removeData('key').data("key", null);
            var id = presHtml.find('[id^="ivColHyPName"]').removeClass('valSelected').attr('id');
            var typeVal = $("#ivColPropTypeSel").val();
            var key = $("#ivColHypStName").data('key');
            var iName = typeVal + key;
            var cachedObj = structureParams[iName];
            crateAutoCompleteFld("#" + id, cachedObj);
        }

        // elem.data('index', indexToAdd);
        // elem.next('.delbtn')
    } else if (task === "delete") {
        var superParent = parentHtml.parent();
        parentHtml.remove();
        var remElems = superParent.find('.' + parent);
        if (remElems.length === 1) {
            superParent.find('.delBtn').hide();
            superParent.find('.addBtn').show();
        } else {
            remElems.last().find('.addBtn,.delBtn').show();
        }
    }
}

/**
 * To reset the iview params when ever type is changed
 * @return {null}
 */
function resetIvHyperlinks({ allData } = {}) {
    var hypHtml = "";
    hypHtml += '<div class="cloneParent">';
    hypHtml += '<div class="input-field col s5">';
    hypHtml += '<input value="" id="ivColHyPName0" class="cloneChangeId themeMaterialInp" data-idkey="ivColHyPName" type="text">';
    hypHtml += '<label for="ivColHyPName0" class="">Parameter Name</label>';
    hypHtml += '</div>';
    hypHtml += '<div class="input-field col s5">';
    hypHtml += '<input value="" id="ivColHypVal0" class="cloneChangeId themeMaterialInp" data-idkey="ivColHypVal" type="text">';
    hypHtml += '<label for="ivColHypVal0">Value</label>';
    hypHtml += '</div>';
    hypHtml += '<div class="col s2 ivColAdDelWrapper">';
    hypHtml += '<button onclick="genericCloneTheRow(this,\'add\',\'ivColHyp\')" data-index="0" class="waves-effect waves-light addBtn btn-flat"><span class="icon-plus"></span></button>';
    hypHtml += '<button style="display:none" onclick="genericCloneTheRow(this,\'delete\',\'ivColHyp\')" data-index="0" class="waves-effect waves-light delBtn btn-flat"><span class="icon-cross2"></span></button>';
    hypHtml += '</div>';
    hypHtml += '</div>';
    $("#ivColHypPramWrapper").html(hypHtml);

    if (allData) {
        $("#ivColHypName,#ivColPropAction").val("");
        $("#ivColHypStName").val("").data('key', undefined);
        $("#ivColPropTypeSel").val("");
        $("#ivHypOpntp,#ivHyprpoc").prop('checked', false);
        $("#ivHyprpoc").parent('.ivChckBx').hide();
    }


}

/**
 * In SQL widget to apply the column properties once its rendered(Hyperlinks as well)
 * @author ManiKanta
 * @Date   2018-10-09T09:51:00+0530
 * @param  {String}                 options.widgetId   ID of the widget
 * @param  {Object}                 options.columnInfo All the column properties
 * @return {}                                    
 */
function applyColumnPropertiesForWidgets({ widgetId, columnInfo }) {
    if (!columnInfo) {
        columnInfo = homeJsonObj.jsonDataa[widgetId].cols;
    }

    if (columnInfo) {
        const widgetElement = $("#" + widgetId);
        for (column in columnInfo) {
            let presColumnData = columnInfo[column];
            // widgetElement
            if (presColumnData.hyperLink) {
                //means column have hyperlink
                const tableColumn = widgetElement.find('table thead th[data-name="' + column + '"]');
                widgetElement.find(`tbody td:nth-child(${tableColumn.index() + 1})`).addClass('hyperlinkCell');
            }
        }
    }
}


/**
 * In column modal popup to create hyperlink parameters
 * @author ManiKanta
 * @Date   2018-10-08T17:04:00+0530
 * @param  {Array}                  options.paramData Array of paramdata
 * @return {String}                                   HTML code of parameter HTML
 */
function createHyperlinkParamHtml({ paramData = [] }) {
    let modelBodyHtml = "";
    var paramDtLth = paramData.length;
    for (var i = 0; i < paramDtLth; i++) {
        var presPobj = paramData[i];
        modelBodyHtml += '<div class="cloneParent">';
        modelBodyHtml += '<div class="input-field col s5">';
        modelBodyHtml += '<input data-key = "' + presPobj.n + '" value="' + presPobj.nn + '" id="ivColHyPName' + i + '" class="cloneChangeId themeMaterialInp" data-idkey="ivColHyPName" type="text">';
        modelBodyHtml += '<label for="ivColHyPName' + i + '">Parameter Name</label>';
        modelBodyHtml += '</div>';
        modelBodyHtml += '<div class="input-field col s5">';
        modelBodyHtml += '<input data-key = "' + presPobj.v + '" value="' + presPobj.vv + '" id="ivColHypVal' + i + '" class="cloneChangeId themeMaterialInp" data-idkey="ivColHypVal" type="text">';
        modelBodyHtml += '<label for="ivColHypVal' + i + '" >Value</label>';
        modelBodyHtml += '</div>';
        modelBodyHtml += '<div class="col s2 ivColAdDelWrapper">';

        if (paramDtLth - 1 == i)
            modelBodyHtml += '<button onclick="genericCloneTheRow(this,\'add\',\'ivColHyp\')" data-index="' + i + '" class="waves-effect waves-light addBtn btn-flat"><span class="icon-plus"></span></button>';
        else
            modelBodyHtml += '<button style="display:none" onclick="genericCloneTheRow(this,\'add\',\'ivColHyp\')" data-index="' + i + '" class="waves-effect waves-light addBtn btn-flat"><span class="icon-plus"></span></button>';

        if (paramDtLth === 1)
            modelBodyHtml += '<button style="display:none" onclick="genericCloneTheRow(this,\'delete\',\'ivColHyp\')" data-index="' + i + '" class="waves-effect waves-light delBtn btn-flat"><span class="icon-cross2"></span></button>';
        else
            modelBodyHtml += '<button onclick="genericCloneTheRow(this,\'delete\',\'ivColHyp\')" data-index="' + i + '" class="waves-effect waves-light delBtn btn-flat"><span class="icon-cross2"></span></button>';
        modelBodyHtml += '</div>';
        modelBodyHtml += '</div>';

    }
    return modelBodyHtml;
}

function crateAutoCompleteFld(fld, dataToAdd, focusElem) {
    var elem = $(fld);
    focusElem = focusElem === undefined ? true : focusElem;
    if (fld === "#ivColHypStName") {
        var onComp = function (val) {
            var typeVal = $("#ivColPropTypeSel").val();
            var key = $(fld).data('key');
            var iName = typeVal + key;
            var cachedObj = structureParams[iName];
            resetIvHyperlinks();
            if (cachedObj) {
                crateAutoCompleteFld("#ivColHyPName0", cachedObj);
            } else {
                ajaxCallObj.getStructureParams(iName);
            }
        }
    } else if (fld === "#searchPage") {
        var onComp = function (val) {
            if ($("#HPBtabsHaeder .pageTab a.active").attr("title") != val && changesTracker("pageChange", undefined, val)) {
                parent.loadFrame();
                $('#sortable').empty();
                $('.pageTab').hide();
                $('.pageTab').find('a').removeClass('active');
                $('#pageTab' + searchPageData[val]).show();
                $('ul.tabs').tabs('select_tab', 'tab' + searchPageData[val]);
                $('#searchPage').val('');
            } else {
                $('#searchPage').val('');
            }
        }
    } else {
        var onComp = function (val) { }
    }
    elem.autocomplete({
        isKeyImage: false,
        data: dataToAdd,
        limit: 20,
        onAutocomplete: function (val) {
            onComp(val)
        },
        minLength: 0,
    })
    if (focusElem)
        elem.focus();

    if (fld.indexOf("ivColHyPName") === 1) {
        var id = elem.parents(".cloneParent").find("[id^='ivColHypVal']").removeClass('valSelected').attr('id');
        let finalMetaInfo = {};
        if (presBuiildMode === "widgetBuild") {
            if (!presWizardData.extraData.isMetaParsed) {
                var metaInfo = presWizardData.extraData.metaData;
                if (metaInfo) {
                    $.each(metaInfo, function (index, value) {
                        finalMetaInfo[makeMeInitCap(value.name)] = ":" + value.name.toLowerCase();
                    });
                    presWizardData.extraData.isMetaParsed = true;
                    presWizardData.extraData.metaData = finalMetaInfo
                }
            } else {
                finalMetaInfo = presWizardData.extraData.metaData;
            }
        } else if (presBuiildMode === "homeBuild") {
            const presWidgetId = getActiveWidgetId();
            const metaData = querymetaDataInfo[presWidgetId];
            //TOD0 ---need to cache like in widget builder instead of looping everytime
            metaData.forEach(meta => {
                finalMetaInfo[makeMeInitCap(meta)] = ":" + meta.toLowerCase();
            });
        }

        crateAutoCompleteFld("#" + id, finalMetaInfo, false);
    }

}

function createIvWidgetHyperlink({ calledFrom, ivName, hyperlink, isDynamicWidget }) {
    const ivHyperLinkInfoObj = iviewInfo[ivName].hyperlink_params;
    const metaInfo = metaDataCacher.ivHyperLink;
    let fldName = "";
    let target = "";
    let targetTable = "";
    if (calledFrom === "cache") {
        fldName = hyperlink.fldName;
        target = hyperlink.targetId;
    } else {
        fldName = hyperlink[metaInfo["HYPSOURCE"]];
        target = hyperlink[metaInfo["SNAME"]];
    }

    if (isDynamicWidget) {
        targetTable = $(`#C__dynamicWrapper .dynamicContentCard table`);
    } else {
        targetTable = $(`#i${ivName}Wrapper .cardContentData table`);
    }
    let fldIdx = targetTable.find(`thead th:icontains('${makeMeInitCap(fldName)}')`).index();
    targetTable.find(`tbody td:nth-child(${fldIdx + 1})`).addClass('hyperlinkCell');
    if (calledFrom !== "cache") {
        if (fldIdx !== -1) {
            if (!ivHyperLinkInfoObj[fldIdx]) {
                ivHyperLinkInfoObj[fldIdx] = {
                    fldName,
                    targetType: target.substr(0, 1),
                    targetId: target.substr(1),
                    isPopup: hyperlink[metaInfo["POPUP"]] === "T" ? true : false,
                    isRefresh: hyperlink[metaInfo["HYPREFRESH"]] === "T" ? true : false,
                    isNew: hyperlink[metaInfo["LOADNAME"]] === "F" ? true : false,
                    params: []
                }
            }
            let paramKey = hyperlink[metaInfo["FIELD"]];
            let paramValue = hyperlink[metaInfo["PARVALUE"]];
            if (paramValue && paramKey) {
                let paramKeyValuePair = [paramKey, paramValue];
                ivHyperLinkInfoObj[fldIdx].params.push(paramKeyValuePair);
            }
        }

    }
}



function isEmptyObject(obj) {
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
}

/**
 * @description: Slick Widgets Grouping
 * @author Prashik
 * @date 2020-02-05
 * @param {*} type: Type of widget
 * @param {*} targetId: Identifier of widget
 */
function groupWidgets(type, targetId) {
    var groupLimit = isMobile ? 2 : 4;
    var containerDiv = "";
    var targetDiv = "";
    var title = "";
    var isIview = false;
    var targetIview = "";
    switch (type) {
        case "smallkpi":     
            containerDiv = $(".smallKpiDiv");
            targetDiv = $("#" + targetId);
            title = "KPI";
            break;
        case "table" :
        case "kpi" :   
            containerDiv = $(".kpiDiv");
            targetDiv = $("#" + targetId);
            title = "Big KPI";
            break;
        case "chart":
        case "widget":
            containerDiv = $(".widgetDiv");
            targetDiv = $("#" + targetId);
            title = "Widgets";
            break;
        case "iview":
        case "Custom__sql" :
            containerDiv = $(".iviewDiv").removeClass("hide").show();
            targetDiv = $("#" + targetId + "Wrapper");

            var classList = targetDiv.attr("class") || "";
            targetDiv.removeClass(getClassStartingWith(classList, "s")).addClass("s12");
            targetDiv.removeClass(getClassStartingWith(classList, "m")).addClass("m12");
            targetDiv.removeClass(getClassStartingWith(classList, "l")).addClass("l12");

            targetDiv.find(".cardContentMainWrapper").css({"border-radius": "15px"});
            
            title = targetDiv.find(".cardTitleWrapper").hide().find(".cardTitle").hide().text();

            isIview = true;  
            
            containerDiv.append(`<div id="${"slick" + targetId + "Wrapper"}"></div>`);
            containerDiv = $(`${"#slick" + targetId + "Wrapper"}`);

            try {
                if (type != "Custom__sql") {
                    targetIview = $("#" + targetId + "Wrapper").data("target");
                } else {
                    targetIview = homeJsonObj.jsonDataa[targetId + "Wrapper"].tg;
                }
            } catch (ex) { }
            targetIview = targetIview && targetIview.length > 0 ? targetIview.substr(1) : targetIview;
            break;
        case "tstruct" :
            containerDiv = $(".tstructDiv");
            targetDiv = $("#" + targetId + "Wrapper");
            title = "Tstructs";
            break;
        case "Custom__html" :
        case "Custom__txt" :
        case "Custom__img" :
        case "Custom__rss" :
        case "Custom__mytsk" :
        case "Custom__dynamic" :
            containerDiv = $(".customDiv");
            targetDiv = $("#" + targetId + "Wrapper");
            title = "Custom";
            break;   
            // default:
            //     break;
    }

    if (containerDiv && targetDiv && title) {
        containerDiv.append(targetDiv.detach()).removeClass("hide").show(); 
        targetDiv.attr("data-wrapper-type", type);
        if(!containerDiv.find(`.slickDivTitle`).length){
            containerDiv.prepend(

            `
            <div class="slickDivTitle">
                <label>${title}</label>
                <a class="slickViewAll" href="javascript:void(0);" title="View All" onclick="$(this).hide();$(this).next().show();$(this).parent().nextAll().show();" style="">
                    <span>View All</span>
                </a>
                <a class="slickHideAll" href="javascript:void(0);" title="Hide" onclick="$(this).hide();$(this).prev().show();$(this).parent().nextAll(':gt(${groupLimit - 1})').hide();" style="display: none;">
                    <span>Hide</span>
                </a>
            </div>
            `
            );
        }
        if (containerDiv.children(`:not(.slickDivTitle)`).length > groupLimit) {
            targetDiv.hide();
            containerDiv.find(`.slickDivTitle`).find(".slickViewAll").show();
        } else if (isIview && targetIview) {
            containerDiv.find(`.slickDivTitle`).find(".slickViewAll").attr("onclick", `callParentNew('LoadIframe')('iview.aspx?ivname=${targetIview}')`);
        }
        else {
            containerDiv.find(`.slickDivTitle`).find(".slickViewAll").hide();
        }
        
    }
    
}
