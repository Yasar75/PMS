
function AxGetGlobalVar() {
    var jsonVal = "";
    $.ajax({
        url: top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/") + 6) + 'axinterface.aspx/GetGlobalVar',
        type: 'POST',
        cache: false,
        async: false,
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            if (data.d != "") {
                jsonVal = JSON.parse(data.d);
            }
            else {
                jsonVal = "";
            }
        },
        error: function (error) {
            jsonVal = error;
        }
    });
    return jsonVal;
}

function AxSubmitData(transId, RecordId = "0") {
    var jsonVal = "";
    $.ajax({
        url: top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/") + 6) + 'axinterface.aspx/TstructSaveData',
        type: 'POST',
        cache: false,
        async: false,
        data: JSON.stringify({
            TransId: transId,
            RecordId
        }),
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            jsonVal = data.d;
        },
        error: function (error) {
            jsonVal = error;
        }
    });
    return jsonVal;
}

function AxLoadDataJSON(transId, recordId) {
    var jsonVal = "";
    $.ajax({
        url: top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/") + 6) + 'axinterface.aspx/LoadDataJSON',
        type: 'POST',
        cache: false,
        async: false,
        data: JSON.stringify({
            TransId: transId, RecordId: recordId
        }),
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            jsonVal = data.d;
        },
        error: function (error) {
            jsonVal = error;
        }
    });
    return jsonVal;
}

function AxGetIViewParams(iviewName) {
    var jsonVal = "";
    $.ajax({
        url: top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/") + 6) + 'axinterface.aspx/GetIViewParams',
        type: 'POST',
        cache: false,
        async: false,
        data: JSON.stringify({
            IviewName: iviewName
        }),
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            jsonVal = data.d;
        },
        error: function (error) {
            jsonVal = error;
        }
    });
    return jsonVal;
}

function AxGetIView(iviewName) {
    var jsonVal = "";
    $.ajax({
        url: top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/") + 6) + 'axinterface.aspx/GetIViewData',
        type: 'POST',
        cache: false,
        async: false,
        data: JSON.stringify({
            ivName: iviewName
        }),
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            jsonVal = data.d;
        },
        error: function (error) {
            jsonVal = error;
        }
    });
    return jsonVal;
}

function AxGetWidgetData(widgetId) {
    var jsonVal = "";
    $.ajax({
        url: top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/") + 6) + 'axinterface.aspx/GetWidgetData',
        type: 'POST',
        cache: false,
        async: false,
        data: JSON.stringify({
            widgetId: widgetId
        }),
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            jsonVal = data.d;
        },
        error: function (error) {
            jsonVal = error;
        }
    });
    return jsonVal;
}

function AxFormLoadData(transId, searchVars) {
    var jsonVal = "";
    $.ajax({
        url: top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/") + 6) + 'axinterface.aspx/FormLoadData',
        type: 'POST',
        cache: false,
        async: false,
        data: JSON.stringify({
            TransId: transId, SearchVars: searchVars
        }),
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            jsonVal = data.d;
        },
        error: function (error) {
            jsonVal = error;
        }
    });
    return jsonVal;
}

function AxGetValue(transId, fieldName, dcNo, rowNo) {
    var jsonVal = "";
    $.ajax({
        url: top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/") + 6) + 'axinterface.aspx/GetValue',
        type: 'POST',
        cache: false,
        async: false,
        data: JSON.stringify({
            TransId: transId, FieldName: fieldName, DcNo: dcNo, RowNo: rowNo
        }),
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            jsonVal = data.d;
        },
        error: function (error) {
            jsonVal = error;
        }
    });
    return jsonVal;
}

function AxGetRowCount(transId, dcNo) {
    var jsonVal = "";
    $.ajax({
        url: top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/") + 6) + 'axinterface.aspx/GetRowCount',
        type: 'POST',
        cache: false,
        async: false,
        data: JSON.stringify({
            TransId: transId, DcNo: dcNo
        }),
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            jsonVal = data.d;
        },
        error: function (error) {
            jsonVal = error;
        }
    });
    return jsonVal;
}

function AxGetRowData(transId, dcNo, rowNo) {
    var jsonVal = "";
    $.ajax({
        url: top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/") + 6) + 'axinterface.aspx/GetRowData',
        type: 'POST',
        cache: false,
        async: false,
        data: JSON.stringify({
            TransId: transId, DcNo: dcNo, RowNo: rowNo
        }),
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            jsonVal = data.d;
        },
        error: function (error) {
            jsonVal = error;
        }
    });
    return jsonVal;
}

function AxSetValue(transId, fieldName, dcNo, rowNo, value) {
    var jsonVal = "";
    $.ajax({
        url: top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/") + 6) + 'axinterface.aspx/SetValue',
        type: 'POST',
        cache: false,
        async: false,
        data: JSON.stringify({
            TransId: transId, FieldName: fieldName, DcNo: dcNo, RowNo: rowNo, Value: value
        }),
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            jsonVal = data.d;
        },
        error: function (error) {
            jsonVal = error;
        }
    });
    return jsonVal;
}

function AxClearData(transId) {
    var jsonVal = "";
    $.ajax({
        url: top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/") + 6) + 'axinterface.aspx/ClearData',
        type: 'POST',
        cache: false,
        async: false,
        data: JSON.stringify({
            TransId: transId
        }),
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            jsonVal = data.d;
        },
        error: function (error) {
            jsonVal = error;
        }
    });
    return jsonVal;
}

function AxLoadData(transId, recordId) {
    var jsonVal = "";
    $.ajax({
        url: top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/") + 6) + 'axinterface.aspx/LoadData',
        type: 'POST',
        cache: false,
        async: false,
        data: JSON.stringify({
            TransId: transId, RecordId: recordId
        }),
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            jsonVal = data.d;
        },
        error: function (error) {
            jsonVal = error;
        }
    });
    return jsonVal;
}

function AxSetParamValue(iViewName, paramName, paramValue) {
    var jsonVal = "";
    $.ajax({
        url: top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/") + 6) + 'axinterface.aspx/SetParamValue',
        type: 'POST',
        cache: false,
        async: false,
        data: JSON.stringify({
            IViewName: iViewName, ParamName: paramName, ParamValue: paramValue
        }),
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            jsonVal = data.d;
        },
        error: function (error) {
            jsonVal = error;
        }
    });
    return jsonVal;
}

function AxCallAction(actionName, actionType, sName, ivSelectedRows) {
    var jsonVal = "";
    $.ajax({
        url: top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/") + 6) + 'axinterface.aspx/CallAction',
        type: 'POST',
        cache: false,
        async: false,
        data: JSON.stringify({
            ActionName: actionName, ActionType: actionType, SName: sName, IsScript: false, IvSelectedRows: ivSelectedRows
        }),
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            jsonVal = data.d;
        },
        error: function (error) {
            jsonVal = error;
        }
    });
    return jsonVal;
}

function AxCallScript(scriptName, scriptType, sName, ivSelectedRows) {
    var jsonVal = "";
    $.ajax({
        url: top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/") + 6) + 'axinterface.aspx/CallAction',
        type: 'POST',
        cache: false,
        async: false,
        data: JSON.stringify({
            ActionName: scriptName, ActionType: scriptType, SName: sName, IsScript: true, IvSelectedRows: ivSelectedRows
        }),
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            jsonVal = data.d;
        },
        error: function (error) {
            jsonVal = error;
        }
    });
    return jsonVal;
}

/**
 * @description : Get SQL Data Asynchronously
 * @author Prashik
 * @date 2021-01-21
 * @param {*} sqlNames : comma separated sql names available as part of axdirectsql table
 * @param {*} [sqlParams=[]] : array of strings : currently inmplemented(can be passed empty)
 * @Example
 *  returnedData = AxAsyncGetSqlData("sql1,sql2", []);
 */
function AxGetSqlData(sqlNames, sqlParams = []) {
    typeof sqlParams == "function" ? (sqlParams = []) : "";
    sqlParams = typeof sqlParams == "string" ? sqlParams.split(",").filter(val=>val != "") : sqlParams;
    var jsonVal = "";
    $.ajax({
        url: top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/") + 6) + 'axinterface.aspx/GetCustomSql',
        type: 'POST',
        cache: false,
        async: false,
        data: JSON.stringify({
            sqlNames,
            sqlParams
        }),
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            jsonVal = data.d;
        },
        error: function (error) {
            jsonVal = error;
        }
    });
    return jsonVal;
}

/**
 * @description : Get SQL Data Asynchronously
 * @author Prashik
 * @date 2021-01-21
 * @param {*} sqlNames : comma separated sql names available as part of axdirectsql table
 * @param {*} [sqlParams=[]] : array of strings : currently inmplemented(can be passed empty)
 * @param {*} [successCB=() => { }] : Asynchronous Anonymous Success Callback Function
 * @param {*} [errorCB=() => { }] : Asynchronous Anonymous Error Callback Function
 * @Example
 *  AxAsyncGetSqlData("sql1,sql2", [], (success)=>{perform success operation here}, (error)=>{perform error operation here});
 */
function AxAsyncGetSqlData(sqlNames, sqlParams = [], successCB = () => { }, errorCB = () => { }) {
    typeof sqlParams == "function" ? (sqlParams = []) : "";
    sqlParams = typeof sqlParams == "string" ? sqlParams.split(",").filter(val=>val != "") : sqlParams;
    var jsonVal = "";
    $.ajax({
        url: top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/") + 6) + 'axinterface.aspx/GetCustomSql',
        type: 'POST',
        cache: false,
        async: true,
        data: JSON.stringify({
            sqlNames,
            sqlParams
        }),
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            if (successCB && typeof successCB == "function") {
                successCB(data.d || data);
            }
        },
        error: function (error) {
            if (errorCB && typeof successCB == "function") {
                errorCB(error);
            }
        }
    });
}

/**
 * @description : Get API Data Synchronously
 * @author Prashik
 * @date 2022-06-03
 * @param {*} apiNames : comma separated api names
 * @param {*} apiType : sql(defined custom sql)/axpert(defined in api defination)
 * @param {*} [cacheInfo=[]] : whether to cache api or not with unique id:
 *    [{
         "id": "uniqueCacheIdentifier",
         "cachedata": "check true/false",
         "cachedTime": "lastCacheTimeInLongFormat(ddMMyyyyHHmm)",
         "autorefresh": "autoRefreshTimeInMinutes"
 *    }]
 * @Example
 *  returnedData = AxGetApiData("api1,api2", []);
 */
 function AxGetApiData(apiNames = "", apiType = "axpert", cacheInfo = []) {
    typeof cacheInfo == "function" ? (cacheInfo = []) : "";
    // cacheInfo = typeof cacheInfo == "string" ? cacheInfo.split(",").filter(val=>val != "") : cacheInfo;
    var jsonVal = "";
    $.ajax({
        url:  top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/") + 1) + 'WebService.asmx/CallApiDefinations',
        type: 'POST',
        cache: false,
        async: false,
        data: JSON.stringify({
            api: apiNames,
            type: apiType,
            cacheInfo: typeof cacheInfo == "object" ? JSON.stringify(cacheInfo) : cacheInfo
        }),
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            jsonVal = data.d;
        },
        error: function (error) {
            jsonVal = error;
        }
    });
    return jsonVal;
}

/**
 * @description : Get API Data Asynchronously
 * @author Prashik
 * @date 2022-06-03
 * @param {*} apiNames : comma separated api names
 * @param {*} apiType : sql(defined custom sql)/axpert(defined in api defination)
 * @param {*} [cacheInfo=[]] : whether to cache api or not with unique id:
 *    [{
         "id": "uniqueCacheIdentifier",
         "cachedata": "check true/false",
         "cachedTime": "lastCacheTimeInLongFormat(ddMMyyyyHHmm)",
         "autorefresh": "autoRefreshTimeInMinutes"
 *    }]
 * @param {*} [successCB=() => { }] : Asynchronous Anonymous Success Callback Function
 * @param {*} [errorCB=() => { }] : Asynchronous Anonymous Error Callback Function
 * @Example
 *  AxAsyncGetApiData("api1,api2", [], (success)=>{perform success operation here}, (error)=>{perform error operation here});
 */
function AxAsyncGetApiData(apiNames = "", apiType = "axpert", cacheInfo = [], successCB = () => { }, errorCB = () => { }) {
    typeof cacheInfo == "function" ? (cacheInfo = []) : "";
    // cacheInfo = typeof cacheInfo == "string" ? cacheInfo.split(",").filter(val=>val != "") : cacheInfo;
    var jsonVal = "";
    $.ajax({
        url: top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/") + 1) + 'WebService.asmx/CallApiDefinations',
        type: 'POST',
        cache: false,
        async: true,
        data: JSON.stringify({
            api: apiNames,
            type: apiType,
            cacheInfo: typeof cacheInfo == "object" ? JSON.stringify(cacheInfo) : cacheInfo
        }),
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            if (successCB && typeof successCB == "function") {
                successCB(data.d || data);
            }
        },
        error: function (error) {
            if (errorCB && typeof successCB == "function") {
                errorCB(error);
            }
        }
    });
}

/**
 * @description : Function to plot HighChart Widgets similar to Axpert Web
 * @author Prashik
 * @date 2021-01-21
 * @param {*} widgetType : line, bar, stacked-bar, column, stacked-column, stacked-percentage-column, area, pie, semi-donut, donut, stacked-group-column, scatter-plot, scatter-plot-3D, funnel.
 * @param {*} widgetJqObj : jquery div object there chart is to be plotted
 * @param {*} data : data receiived form AxAsyncGetSqlData / AxGetSqlData Webservices as per sql query
 * @param {*} sqlmetaData : sqlmetaData received form AxAsyncGetSqlData / AxGetSqlData Webservices as per sql query
 *      If valid / supported metadata data properties are coming in by default in sql metadata response for available chart types as listed below then metadata and highcharts data property mapping will not happen:
 *          "data_label"
 *          "x_axis"
 *          "link"
 *          "value"
 *          "group_column"
 *          "x_axis_data"
 *          "y_axis_data"
 *          "z_axis_data"
 *      Otherwise following metadata indexes will be automatically considered based on their chart type for metadata and data property mapping
 *          "line" / "bar" / "stacked-bar" / "column" / "stacked-column" / "stacked-percentage-column" / "area"
                    0: "data_label"
                    1: "x_axis"
                    2: "value" (number)
                    3: "link"
 *          "pie" / "semi-donut" / "donut"
                    0: "data_label"
                    1: "value" (number)
                    2: "link"
 *          "stacked-group-column"
                    0: "data_label"
                    1: "x_axis"
                    2: "group_column"
                    3: "value"
                    4: "link"
 *          "scatter-plot" / "scatter-plot-3D"
                    0: "data_label"
                    1: "x_axis_data"
                    2: "y_axis_data"
                    3: "z_axis_data"
 *          "funnel"
                    0: "data_label"
                    1: "value"
 * @param {*} attributes : optional object literal parameter if available, will implement given functionalities
 *      Following are the object properties that can be passed to this object:
 *          xAxisL: x axis title
 *          yAxisL: y axis title
 *          shwLgnd: property to show legent information or not, this property will be forced as false if enableSlick is true / enabled
 *          gradClrChart(boolean): draw gradient color chart
 *          cck("pallet1":default / "pallet2" / "pallet3" / "pallet4" / "avacado" / "darkGreen" / "grid" / "sand" / "skies" / "sunset" / "custom"): chart color preset name 
 *          cccv: if cck is "custom" then specify hexa-decimal color codes spearated by comma
 *          shwChartVal(boolean): data label to be shown or not
 *          threeD("create" / "remove"): enable or disable 3d charts
 *          shwVal(boolean): show or hide pointe value
 *          exposeAPI(boolean): false
 * @param {*} enableSlick : optional boolean parameter if true will enable minimal charts ui
 * @references
 *      Following files are required to be referred in custom html along with AxInterface.js:
            <script src="../../Js/Jquery-2.2.2.min.js" type="text/javascript"></script>
            <script src="../../Js/common.min.js?v=118" type="text/javascript"></script>
            <script src="../../Js/AxInterface.min.js?v=10" type="text/javascript"></script>
            <script src="../../ThirdParty/Highcharts/highcharts.js"></script>
            <script src="../../ThirdParty/Highcharts/highcharts-3d.js"></script>
            <script src="../../ThirdParty/Highcharts/highcharts-more.js"></script>
            <script src="../../ThirdParty/Highcharts/highcharts-exporting.js"></script>
            <script src="../../Js/high-charts-functions.min.js?v=20"></script>
 */
function AxPlotHighChartWidgets(widgetType, widgetJqObj, data, sqlmetaData, attributes = {}, enableSlick = true) {
    if (typeof $ == "undefined" || typeof Highcharts == "undefined" || typeof callParentNew == "undefined") {
        throw "required files are not referred";
        return;
    }

    enableSlick = typeof enableSlick == "undefined" ? true : enableSlick;
    presBuiildMode = typeof presBuiildMode == "undefined" ? "" : presBuiildMode;
    var parsedHyperLink = parseHyperLink(sqlmetaData, data[0]);

    window.enableSlick = enableSlick;

    if (attributes) {
        if(typeof attributes == "string"){
            try{
                attributes = JSON.parse(attributes);
            }catch(ex){
                attributes = {};
            }
        }
        if (typeof attributes.shwLgnd != "undefined" && enableSlick) {
            attributes.shwLgnd = false;
        }
    } else {
        attributes = {};
    }

    var objToSend = {
        target: $(widgetJqObj)[0],
        data: data,
        type: widgetType || "pie",
        title: "",
        height: $(widgetJqObj).height(),
        isCompressed: true,
        attr: attributes,
        metaData: sqlmetaData,
        hyperLink: parsedHyperLink
    }

    if(typeof objToSend.data.length != "undefined" && objToSend.data.length > 0){
        createAgileChart(objToSend);
    }else{
        $(objToSend.target).html("No Data Found");
    }
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
                presParseObj.isPop = (presntLink?.slice(0, 1) || "") == "p";
                var column = presntLink.substring(0, frstEqIndx).replace(/ /g, '').replace('h', '').replace('p', '');
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
                    linkStr = "tstruct.aspx?transid=" + targetId + params + `&openerIV=${targetId}&isIV=false`;
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

    // <a class='whiteLink' href='javascript:void(0);' onclick=\"javascript:parent.LoadIframe('" + htpLinkData.url + paramLink + "');javascript:parent.resetLeftMenu('fromDashboard');\">" + plotData[0][i + 3] + "</a>
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
                if (presLink.substr(0, frstEqIndx) === "h" + colIndex || presLink.substr(0, frstEqIndx) === "p" + colIndex) {
                    linkData = presLink;
                } else {
                    continue;
                }
            }
            paramStr = linkData.substring(linkData.indexOf("(") + 1, linkData.lastIndexOf(")"));
            paramStr = paramStr.replace(/\^/g, "&");
        }
        if(linkObjData.isPop){
            return "<a class='whiteLink' href='javascript:void(0);' onclick=\"javascript:createPopup('" + linkObjData.url + paramStr + "');\">" + cap + "</a>";
        }else{
            return "<a class='whiteLink' href='javascript:void(0);' onclick=\"javascript:AxLoadUrl('" + linkObjData.url + paramStr + "');\">" + cap + "</a>";
        }
    } else {
        return cap;
    }
}

function customizeData(plotName) {
    if (plotName && typeof plotName === "string") {
        plotName = plotName.replace(/__\^__/g, ":");
    }
    return plotName;
}

/**
 * @description : Load given url in main iframe
 * @author Prashik
 * @date 2021-01-21
 * @param {*} url : url of the page to be loaded
 * @Files
 *  Following files are required to be referred in custom html along with AxInterface.js:
 *      <script src="../../Js/Jquery-2.2.2.min.js" type="text/javascript"></script>
 *      <script src="../../Js/common.min.js?v=118" type="text/javascript"></script>
 * 
 */
function AxLoadUrl(url) {
    if (typeof $ == "undefined" || typeof callParentNew == "undefined") {
        throw "required files are not referred";
        return;
    }

    if (typeof LoadIframe == "undefined") {
        window.LoadIframe = callParentNew("LoadIframe");
    }

    LoadIframe(url);
}

/**
 * @description : Get menu json array for given page names
 * @author Prashik
 * @date 2022-05-27
 * @param {*} pages : comma separated page names 
 * @Files
 *  Following files are required to be referred in custom html along with AxInterface.js:
 *      <script src="../../ThirdParty/lodash.min.js" type="text/javascript"></script>
 *      <script src="../../ThirdParty/deepdash.min.js" type="text/javascript"></script>
 *      <script src="../../Js/common.min.js?v=118" type="text/javascript"></script>
 * 
 */
 function AxGetMenus(pages) {
    if (typeof _ == "undefined" || typeof _.findDeep == "undefined") {
        throw "required files are not referred";
        return;
    }

    let finalMenuObj = {};
    
    let menuJson = callParentNew("menuJson");
    
    pages.split(",").map(pageName => pageName.trim()).forEach(pageName => {
        try {
            let menuArray = [];
            if (pageName) {
                var pageObj = _.findDeep(
                    menuJson,
                    (value, key, parent) => {
                        if (key == 'oname' && value == pageName) return true;
                    }
                )?.parent;
                if (pageObj) {
                    if (!pageObj.target) {
                        menuArray = pageObj.child || [];
                    } else {
                        menuArray = pageObj;
                    }
                    if (typeof menuArray.length == "undefined") {
                        menuArray = [menuArray];
                    }
                }

                if (menuArray.length > 0) {
                    menuArray = menuArray.filter(menu => {
                        return menu.target ? true : false;
                    });
                }
            }

            // return menuArray;
            finalMenuObj[pageName] = menuArray;
        } catch (ex) {
            menuArray = [];
            // return menuArray;
            finalMenuObj[pageName] = menuArray;
        }
    });

    return finalMenuObj;
}

function AxDeleteRecord(TransId, RecordId){
    var jsonVal = "";
    $.ajax({
        url: top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/") + 6) + 'axinterface.aspx/TstructDeleteRecord',
        type: 'POST',
        cache: false,
        async: false,
        data: JSON.stringify({
            TransId, RecordId
        }),
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            jsonVal = data.d;
        },
        error: function (error) {
            jsonVal = error;
        }
    });
    return jsonVal;
}

function AxGetRecordId(TransId, Datas = []){
    var jsonVal = "";
    $.ajax({
        url: top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/") + 6) + 'axinterface.aspx/GetTstructRecordId',
        type: 'POST',
        cache: false,
        async: false,
        data: JSON.stringify({
            TransId, Datas
        }),
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            jsonVal = data.d;
        },
        error: function (error) {
            jsonVal = error;
        }
    });
    return jsonVal;
}
