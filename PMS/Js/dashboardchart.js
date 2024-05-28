/*
*
*
BY MANI KANTA
*
*
*/
var apiBase = parent.nodeApi;
// var apiBase = "http://14.192.17.154:3015/api/";
var sId = parent.mainSessionId;
var username = parent.mainUserName;
var utls = parent.utl;
var nls_paramter = [];
var tstructData = {};
var tstructTables = {};
var tstructTableCols = {};
var groups = [];
var selectedCols = [];
var widgetType = "";
var mainSqlCM, tableSqlCm, updateSqlCM;
var codeMirrorHintObj = {};
var updateObj = {};
var widgetMetaData, deleteCnfrmBx, presentView = "widget",
    dataTableApi;
var newWidgetData = false;
var widgetTableData = {};
var theme = eval(callParent('currentThemeColor'));;
theme = theme || "default";
$j("#homeBuilderLink").attr('href', "../App_Themes/" + theme + "/home_builder.min.css?v=4");



// dont change the below configuration fields order once decided
var chartConfiguration = {
    "3columns": {
        fieldsCount: 3,
        fields: ["Data Label", "Xaxis Label", "Value~fun"],
        type: ["*", "*", "n"]
    },
    "2columns": {
        fieldsCount: 2,
        fields: ["Xaxis Label", "Value~fun"],
        type: ["*", "n"]
    },
    "4columns": {
        fieldsCount: 4,
        fields: ["Data Label", "Xaxis Label", "Group Column", "Value~fun"],
        type: ["*", "*", "*", "n"]
    }
};

var ajaxCallObj = new AjaxCallObj();
var isValidPage = ajaxCallObj.isPageValid();
if(isValidPage){
    //ajaxCallObj.getNLSparameter();
    makeWidgetpanel();
}else{
    valSessByApi({statusCode : 401, errMsg : "not a valid session"});
}
function htmlEntity(type, string) {
    if (type == "encode") {
        string = string.replace(/'/g, "&apos;");
        string = string.replace(/"/g, "&quot;");
    } else if (type == "decode") {
        string = string.replace(/&apos;/g, "'");
        string = string.replace(/&quot;/g, '"');
    }
    return string;
}


function makeWidgetpanel() {
    $j.ajax({
        "async": true,
        "crossDomain": true,
        "url": apiBase + "getdashboardwidgets",
        "method": "POST",
        "headers": {
            "content-type": "application/x-www-form-urlencoded"
        },
        "data": {
            "session_id": sId,
            "utl": utls,
            "rty": userResps,
            "username": username,
            "authorization": parent.nodeAccessToken,
            "appSKey": appsessionKey
        },
        success: function (data) {
            if (!data.status) {
                valSessByApi(data);
                //alert("Getting Widgets error : " + data.errmsg);
                return false;
            }
          
            var querymetaData = data.querymetaData;
            for (i = 0; i < querymetaData.length; i++) {
                mappingdata[querymetaData[i]['name']] = i;
            }

            if (data.data == 0) {
                $j(".leftPartODshBrd").addClass("leftPartODshBrdFull");
                $j("#qlbox").addClass("quickLinksPanel");
                $j("#divtaskfull").addClass("tasksPanel");
                $j("#divmesfull").addClass("messagesPanel");
                $j(".rightPartODshBrd").addClass("none");
            }
            else {
                var tblCharts = data.data, tblChartslength = data.data.length;
                var menuCount = 1;
                var tableCount = {};
                var dataMeta = {};
                widgetGroup = [];
                for (i = 0; i < tblChartslength; i++) {
                    dataMeta['SUB_TYPE'] = tblCharts[i][mappingdata.SUB_TYPE];
                    dataMeta['WIDGET_TYPE'] = tblCharts[i][mappingdata.WIDGET_TYPE];                    
                    dataMeta['WIDGET_ID'] = tblCharts[i][mappingdata.WIDGET_ID];
                    dataMeta['TITLE'] = tblCharts[i][mappingdata.TITLE];
                    chartUid += dataMeta.WIDGET_ID + ";";
                    var tabid = renameTheTabId(dataMeta.SUB_TYPE);
                    if ($.inArray(tabid, widgetGroup) == -1) {                        
                        if (menuCount == 1)
                            $(".listUlDb").append("<li class=\"tab col s2\"><a class=\"active\" href=\"" + "#" + tabid + "\" title=\"" + dataMeta.SUB_TYPE + "\">" + dataMeta.SUB_TYPE + "</a></li>");
                        else
                            $(".listUlDb").append("<li class=\"tab col s2 firstTimeTab\"><a href=\"" + "#" + tabid + "\" title=\"" + dataMeta.SUB_TYPE + "\">" + dataMeta.SUB_TYPE + "</a></li>");
                        $("#divDetailsLinks").append('<div id="' + tabid + '" class="widgetgroup"></div>');
                        menuCount++;
                    }
                    $('ul.tabs').tabs();
                    widgetGroup.push(tabid);
                    $("#divDetailsLinks #" + tabid).append(getPanelHtml(dataMeta.WIDGET_TYPE, dataMeta.TITLE, dataMeta.WIDGET_ID, "dashboard"));
                    if (dataMeta.WIDGET_TYPE == 'table' || dataMeta.WIDGET_TYPE == 'kpi')
                        tableWidgetsCount[tabid] = (tableWidgetsCount.hasOwnProperty(tabid)) ? tableWidgetsCount[tabid]+1 : 1;
                   // tableWidgetsCount[dataMeta.SUB_TYPE] = tableCount;
                }
                var tar = $('.listUlDb .active').attr('href').substr(1);
                adjustTheKpis(tar);
                makeshowwidget(tar);
                $("#" + tar + " .wgtBtn").each(function () {
                    chartResize($(this), "reflow");
                });
            }
        }
    });
}

function gradientClick(task, color) {
    var checkHtml = '<div class="gradientSelected"><span class="icon-check"></span></div>';
    if (task == "colorClick") {
        $(".gradientPalletWrapper").toggle('medium');
        var colorC = $("#gradientPicker a").data('color');
        $(".gradientPalletWrapper .pallet ." + colorC).append(checkHtml);
        return;
    } else if (task == "colorPick") {
        $(".gradientSelected").remove();
        var targetId = $("#propertySheet").data('target');
        $(".gradientPalletWrapper .pallet ." + color).append(checkHtml);
        $("#gradientPicker").attr('class', 'colorMe ' + color + ' center-align');
        $("#gradientPicker a").data('color', color).text(color);
        updateObj.attrs = { kpiColor: color };
        $("#" + targetId).find('.kpiCard').attr('class', 'kpiCard card colorMe ' + color);
        $("#" + targetId).find('.colorMe').data('kpicolor', color);


    }
}


//get tstructs
function AjaxCallObj() {
    this.getTstructs = function (type) {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": apiBase + "getTstructs",
            "method": "POST",
            "headers": {
                "content-type": "application/x-www-form-urlencoded"
            },
            "data": {
                "session_id": sId,
                "utl": utls,
                "dname": 'dc1',
                "username": username,
                "authorization": parent.nodeAccessToken,
                "appSKey": appsessionKey
            }
        }

        $.ajax(settings).done(function (response) {
            if (response.status == true) {
                var data = response.data;
                if (data) {
                    var dataLength = data.length;
                    for (var i = 0; i < dataLength; i++) {
                        var presentTst = data[i];
                        tstructData[presentTst[1]] = presentTst[0];
                    }

                    $('input#widgetTstructName').autocomplete({
                        isKeyImage: false,
                        data: tstructData,
                        limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
                        onAutocomplete: function (val) {
                            // Callback function when value is autcompleted.
                            var transId = $('input#widgetTstructName').data('key');
                            if (transId) {
                                var tableData = tstructTables[transId];
                                if (!tableData) {
                                    // tableData = [];
                                    ajaxCallObj.getTstructTables(transId);
                                } else {
                                    $('input#widgetTstrctColumn').autocomplete("destroy");
                                    $('input#widgetTstrctColumn').autocomplete({
                                        isKeyImage: false,
                                        data: tableData,
                                        limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
                                        onAutocomplete: function (val) {
                                            // Callback function when value is autcompleted.
                                            var transId = $('input#widgetTstructName').data('key');
                                            var dcNumSelected = $('input#widgetTstrctColumn').data('key');
                                            var dcName = dcNumSelected.split("__~__")[0];
                                            if (dcNumSelected) {
                                                if (tstructTableCols[transId + dcName]) {
                                                    showTheTableRemainigData(transId + dcName);
                                                    createSqlForTableData();
                                                } else {
                                                    ajaxCallObj.getTableCols(transId, dcNumSelected);
                                                }
                                            }
                                        },
                                        minLength: 0, // The minimum length of the input for the autocomplete to start. Default: 1.
                                    }).prop('disabled', false).focus();
                                }
                            } else {
                                showAlertDialog("warning", "Please select tstruct.");
                            }
                        },
                        minLength: 0, // The minimum length of the input for the autocomplete to start. Default: 1.
                    });

                }
            } else {
                valSessByApi(response);
                showAlertDialog("error", response.errMsg);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            showAlertDialog("error", "Unable to connect node server.");
        });
    }
    this.getTstructTables = function (tstruct) {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": apiBase + "getTtable",
            "method": "POST",
            "headers": {
                "content-type": "application/x-www-form-urlencoded"
            },
            "data": {
                "session_id": sId,
                "utl": utls,
                "tstruct": tstruct,
                "username": username,
                "authorization": parent.nodeAccessToken,
                "appSKey": appsessionKey
            }
        }

        $.ajax(settings).done(function (response) {
            if (response.status == true) {
                var data = response.data;
                if (data) {
                    var dataLength = data.length;
                    var tmpObj = {};
                    for (var i = 0; i < dataLength; i++) {
                        var presentTstTbl = data[i];
                        tmpObj[presentTstTbl[1]] = presentTstTbl[2] + "__~__" + presentTstTbl[0];
                        // (dcNames[tstruct]) ? dcNames[tstruct][presentTstTbl[3]] = presentTstTbl[0]: dcNames[tstruct] = {
                        //     [presentTstTbl[3]]: presentTstTbl[0] };
                    }
                    tstructTables[tstruct] = tmpObj;
                    $('input#widgetTstrctColumn').autocomplete({
                        isKeyImage: false,
                        data: tmpObj,
                        limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
                        onAutocomplete: function (val) {
                            // Callback function when value is autcompleted.
                            var dcNumSelected = $('input#widgetTstrctColumn').data('key');
                            var dcName = dcNumSelected.split("__~__")[0];
                            if (dcNumSelected) {
                                // $('#widgetTableRemData').show();
                                var transId = $('input#widgetTstructName').data('key');
                                ajaxCallObj.getTableCols(transId, dcNumSelected);

                                if (tstructTableCols[transId + dcName]) {
                                    showTheTableRemainigData(transId + dcName);
                                    createSqlForTableData();
                                } else {
                                    ajaxCallObj.getTableCols(transId, dcNumSelected);
                                }
                                // createSqlForTableData();
                            }
                        },
                        minLength: 0, // The minimum length of the input for the autocomplete to start. Default: 1.
                    }).prop('disabled', false).focus();
                }
            } else {
                valSessByApi(response);
                showAlertDialog("error", response.errMsg);
            }
            // console.log(response);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            showAlertDialog("error", "Unable to connect node server.");
        });
    }

   /* this.getNLSparameter = function () {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": apiBase + "getSessionDBParams",
            "method": "POST",
            "headers": {
                "content-type": "application/x-www-form-urlencoded"
            },
            "data": {
                "session_id": sId,
                "utl": utls,
                "username": username,
                "authorization": parent.nodeAccessToken,
                "appSKey": appsessionKey
            }
        }

        $.ajax(settings).done(function (response) {
            if (response.status == true) {
                $.each(response.data, function (i, row) {
                    if (row[0].toUpperCase() == 'NLS_DATE_FORMAT') {
                        nls_paramter[row[0].toLowerCase()] = row[1];
                        //makeWidgetpanel();//ajaxCallObj.getDetails();
                    }
                });
            }
            else {
                valSessByApi(response);
            }
        });
    }*/


    this.getTableCols = function (transId, dcName) {
        dcName = dcName.split("__~__")[0];
        // var dcName = dcNames[transId][dcNum];
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": apiBase + "getTableCols",
            "method": "POST",
            "headers": {
                "content-type": "application/x-www-form-urlencoded"
            },
            "data": {
                "session_id": sId,
                "utl": utls,
                "tstruct": transId,
                "tablename": dcName,
                "username": username,
                "authorization": parent.nodeAccessToken,
                "appSKey": appsessionKey
            }
        }

        $.ajax(settings).done(function (response) {
            if (response.status == true) {
                var data = response.data;
                var tmpObj = {};
                var numObj = {};
                if (data) {
                    var dataLength = data.length;
                    for (var i = 0; i < dataLength; i++) {
                        var presentCol = data[i];
                        var caption = presentCol[1];
                        var fldName = presentCol[0];
                        var type = presentCol[2];
                        tmpObj[caption] = fldName + "__~__" + type;
                        if (type === "n") {
                            numObj[caption] = fldName + "__~__" + type;
                        }
                    }
                    tstructTableCols[transId + dcName] = { all: tmpObj };
                    tstructTableCols[transId + dcName]["num"] = numObj;
                    showTheTableRemainigData(transId + dcName);
                    createSqlForTableData();
                }
            } else {
                valSessByApi(response);
                showAlertDialog("error", response.errMsg);
            }
            // console.log(response);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            showAlertDialog("error", "Unable to connect node server.");
        });
    }

    this.getAllGroups = function () {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": apiBase + "getWidgetGroup",
            "method": "POST",
            "headers": {
                "content-type": "application/x-www-form-urlencoded"
            },
            "data": {
                "session_id": sId,
                "utl": utls,
                "username": username,
                "authorization": parent.nodeAccessToken,
                "appSKey": appsessionKey
            }
        }

        $.ajax(settings).done(function (response) {
            if (response.status == true) {
                var data = response.data;
                var tmpObj = {};
                if (data) {
                    groups = data;
                }
                for (var i = 0; i < groups.length; i++) {
                    tmpObj[groups[i]] = groups[i];
                }
                $("#widgetGroupsInp").autocomplete({
                    isKeyImage: false,
                    data: tmpObj,
                    limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
                    onAutocomplete: function (val) {
                    },
                    minLength: 0, // The minimum length of the input for the autocomplete to start. Default: 1.
                });
            } else {
                valSessByApi(response);
                showAlertDialog("error", response.errMsg);
            }
            // console.log(response);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            showAlertDialog("error", "Unable to connect node server.");
        });
    }
   
    this.isValidQuery = function (sql, calledFrom) {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": apiBase + "getQuery",
            "method": "POST",
            "headers": {
                "content-type": "application/x-www-form-urlencoded"
            },
            "data": {
                "session_id": sId,
                "utl": utls,
                "q": sql,
                "isStriked": true,
                "username": username,
                "authorization": parent.nodeAccessToken,
                "appSKey": appsessionKey
            }
        }

        $.ajax(settings).done(function (response) {
            if (response.status == true) {
                if (calledFrom === "update") {
                    var widgetId = $("#propertySheet").data("target").substr(8);
                    var changedQry = updateSqlCM.getDoc().getValue();
                    updateObj.sql = changedQry;
                    $("#prpShtTxtBx").val(changedQry);
                    $("#customTxtAreaWrapperBg").hide();
                    $("#customTxtAreaWrapper").removeClass('centerMe').removeAttr('style');
                } else {
                    $("#isValidSQl").val("true").data('err', "");
                    if ($("#wizardNextbtn").hasClass('iAmClicked'))
                        $("#wizardNextbtn").removeClass('iAmClicked').click();
                }

            } else {
                if (calledFrom === "update") {

                } else {
                    if ($("#wizardNextbtn").hasClass('iAmClicked'))
                        $("#wizardNextbtn").removeClass('iAmClicked');
                    $("#isValidSQl").val("false").data('err', response.errMsg);
                }
                valSessByApi(response);
                showAlertDialog("error", response.errMsg);
            }
            // console.log(response);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            showAlertDialog("error", "Unable to connect node server.");
        });
    }

    this.getHintsForCodeMirror = function () {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": apiBase + "getTstructs",
            "method": "POST",
            "headers": {
                "content-type": "application/x-www-form-urlencoded"
            },
            "data": {
                "session_id": sId,
                "utl": utls,
                "username": username,
                "authorization": parent.nodeAccessToken,
                "appSKey": appsessionKey
            }
        }

        $.ajax(settings).done(function (response) {
            if (response.status == true) {
                var data = response.data;
                if (data) {
                    $.each(data, function (index, value) {
                        if (codeMirrorHintObj[value[0]]) { codeMirrorHintObj[value[0]].push(value[1]); } else { codeMirrorHintObj[value[0]] = [value[1]] }
                    });

                }
            } else {
                valSessByApi(response);
                showAlertDialog("error", response.errMsg);
            }
            // console.log(response);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            showAlertDialog("error", "Unable to connect node server.");
        });
    }    
    this.getDetails = function (jsonString, type) {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": apiBase + "getWidgets",
            "method": "POST",
            "headers": {
                "content-type": "application/x-www-form-urlencoded"
            },
            "data": {
                "session_id": sId,
                "utl": utls,
                "username": username,
                "authorization": parent.nodeAccessToken,
                "appSKey": appsessionKey
            }
        }

        $.ajax(settings).done(function (response) {
            if (response.status == true) {
                var data = response.data;
                if (data) {
                    var dataLength = data.length;
                    var widgetTableDataArr = widgetTableData.data = [];
                    var cachtitle = widgetTableData.title = {};
                    var cachType = widgetTableData.type = {};
                    for (var i = 0; i < dataLength; i++) {
                        var presentData = data[i]; //title,widget_id,widget_type
                        var title = presentData[0]
                        var widgetId = presentData[1]
                        var widgeType = presentData[2]
                        $("#widgetPanelWrapper").append(getPanelHtml(widgeType, title, widgetId)); //(type, title, target)
                        cachtitle["w" + widgetId] = title;
                        cachType["w" + widgetId] = widgeType;
                        widgetTableDataArr.push({ "id": widgetId, "title": title, "widget_type": widgeType });
                        ajaxCallObj.getAxpertWidgetDetails(widgetId);
                    }

                }

            } else {
                valSessByApi(response);
                showAlertDialog("error", response.errMsg);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            showAlertDialog("error", "Unable to connect node server.");
        });
    }

    this.getAxpertWidgetDetails = function (widgetId, pValue) {
        var pValue = (typeof pValue !== "undefined" && pValue) ? pValue : null;
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": apiBase + "getwidgetdetails",
            "method": "POST",
            "headers": {
                "content-type": "application/x-www-form-urlencoded"
            },
            "data": {
                "session_id": sId,
                "widget_id": widgetId,
                "pValue":pValue,
                "utl": utls,
                "calledFrom": 'widget',
                "dateFormat": '',//nls_paramter['nls_date_format'],
                "username": username,
                "authorization": parent.nodeAccessToken,
                "appSKey": appsessionKey
            }
        }

        $.ajax(settings).done(function (response) {
            var targetId = "axWidget" + widgetId;
            if (response.status == true) {
                if (response.queryData && response.queryData.length === 0) {
                    
                    
                    var data = response;
                    if (!widgetMetaData) {
                        widgetMetaData = {};
                        var dataMetaData = data.datametaData;
                        var dataMetaDataLength = dataMetaData.length;
                        for (var i = 0; i < dataMetaDataLength; i++) {
                            widgetMetaData[dataMetaData[i].name] = i;
                        }
                    }
                    var widgetInfo = data.data;
                    if (widgetTableData.qry) {
                        var widgetQryData = widgetTableData.qry
                        var widgetAttrData = widgetTableData.attr
                        var widgetRolesData = widgetTableData.roles
                    } else {
                        var widgetQryData = widgetTableData.qry = {};
                        var widgetAttrData = widgetTableData.attr = {};
                        var widgetRolesData = widgetTableData.roles = {};
                    }
                    if (presentView == "widget")
                        newWidgetData = false;
                    widgetQryData["w" + widgetId] = widgetInfo[widgetMetaData["SQLTEXT"]];
                    widgetAttrData["w" + widgetId] = widgetInfo[widgetMetaData["ATTRIBUTES"]];
                    widgetRolesData["w" + widgetId] = widgetInfo[widgetMetaData["ROLES"]];
                    var tableAttrs = widgetTableData.attr["w" + widgetId];
                    if (tableAttrs) {
                        tableAttrs = JSON.parse(tableAttrs);
                    } else {
                        tableAttrs = {};
                    }

                    $("#" + targetId + " .cardContentLoader").remove();
                    $("#" + targetId + " .wrapperForWidgets").html('<div class="kpiCard"><div class="valign-wrapper" style="height: 100%;"><p class="center-align" style="width: 100%;">No data found.</p></div></div>');

                    
                    $("#" + targetId + " .card-content:first").css("padding", 0);
                    return
                }
                newWidgetData = true;
                createAxpertWidget(response, targetId);
            } else {
                valSessByApi(response);
                $("#" + targetId + " .cardContentLoader").remove();
                $("#" + targetId + " .wrapperForWidgets").html('<div class="reloadWidgetWrapper"><p>' + response.errMsg + '</p><button type="button" onclick="ajaxCallObj.getAxpertWidgetDetails(\'' + widgetId + '\')" class="reloadBtn cutsomColorbtn icon-refresh btn-floating waves-effect waves-light " style="margin-bottom: 10px;font-size: 23px;"></button></div>');
               
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            showAlertDialog("error", "Unable to connect node server.");
        });
    }

    this.isPageValid = function () {
        var result = false;
        var json = {
            "appsession": {
                "s": sId,
                "axpapp": parent.mainProject,
                "appsessionkey": appsessionKey,
                "username": parent.mainUserName
            }
        };
        var settings = {
           // "Content-Type": "application/json",
            "headers": {
                "content-type": "application/x-www-form-urlencoded"
            },
            url: parent.mainRestDllPath + 'ASBDefineRest.dll/datasnap/rest/TASBDefineRest/VerifySessionValidity',
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
}



function createAxpertWidget(data, targetId) {
    enableSlick = typeof enableSlick == "undefined" ? false : enableSlick;
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
    var parsedHyperLink = parseHyperLink(qryMetaData, qryData[0]);



    if (widgetTableData.qry) {
        var widgetQryData = widgetTableData.qry
        var widgetAttrData = widgetTableData.attr
        var widgetRolesData = widgetTableData.roles
    } else {
        var widgetQryData = widgetTableData.qry = {};
        var widgetAttrData = widgetTableData.attr = {};
        var widgetRolesData = widgetTableData.roles = {};
    }
    var widgetType = widgetInfo[widgetMetaData["WIDGET_TYPE"]].toLowerCase();
    var wId = targetId.substr(8);
    widgetQryData["w" + wId] = widgetInfo[widgetMetaData["SQLTEXT"]];
    widgetAttrData["w" + wId] = widgetInfo[widgetMetaData["ATTRIBUTES"]];
    widgetRolesData["w" + wId] = widgetInfo[widgetMetaData["ROLES"]];
    if (presentView == "widget")
        newWidgetData = false;
    if (widgetType == "table" || widgetType == "kpi") {
        var plotData = qryData;
        var plotDataLength = plotData.length;
        var widgetColumns = qryMetaData;
        var widgetColumnsLength = widgetColumns.length;
        var tableAttrs = widgetTableData.attr["w" + wId];
        if (tableAttrs) {
            tableAttrs = JSON.parse(tableAttrs);
        } else {
            tableAttrs = {};
        }
        var kpiTtlHtml = "";
        var kpittlClass = "";
        var presTtl = widgetInfo[widgetMetaData["TITLE"]];

        var hyperLinkCol = parsedHyperLink ? parsedHyperLink.i : false; //new
        var kpiBgColor = tableAttrs.kpiColor || "blue";
        var showKpiTtl  = tableAttrs.shwKpiTtl ? true : false;
        var defaultIcon = "icon-cube";
        var htmlToAdd = "";
        var hiddenCols = checkForHiddenColumns(widgetColumns);
           if (showKpiTtl) {
               kpiTtlHtml = "<div class ='kpiHeader'><span class='" + defaultIcon + " kpittlIcn'></span><span class='kpiTtl'>" + presTtl + "</span></div>"
               kpittlClass = "kpiTtlExsts";
             }
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
                colName.indexOf("axphidec_") === -1 ? htmlToAdd += '<span class="card-title"><h2 style="margin:0;">' + customizeData(plotName) + '</h2></span>' : htmlToAdd += "";
            else {
                var link = getTheHyperLink(plotData[0][hyperLinkCol], parsedHyperLink, customizeData(plotName), dataExistsCol);
                colName.indexOf("axphidec_") === -1 ? htmlToAdd += '<span class="card-title"><h2 style="margin:0;">' + link + '</h2></span>' : htmlToAdd += "";
            }

            //htmlToAdd += '<span class="card-title"><h2 style="margin:0;">' + plotData[0] + '</h2></span>';
            htmlToAdd += '<span class="' + defaultIcon + ' kpiImage"></span>';
            htmlToAdd += '<p class="kpiTitle">' + presTtl + '</p>';
            htmlToAdd = '<div data-kpicolor = "' + kpiBgColor + '" class="kpiCard card colorMe ' + kpiBgColor + '">' + kpiTtlHtml + ' <div class="card-content smallKpi ' + kpittlClass + ' white-text">' + htmlToAdd + '</div></div>';

        } else if (hiddenCols.length === 0 && plotDataLength == 1) {
            htmlToAdd += '  <table class="kpiSingleRow"><tbody>';
            var actualWidgetColumnLength = hyperLinkCol === false ? widgetColumnsLength : (widgetColumnsLength - 1);
            if (actualWidgetColumnLength > 3) {
                for (var i = 0; i < 3; i++) {
                    colName = widgetColumns[i].name;
                    colName = makeMeInitCap(colName);
                    htmlToAdd += "<tr>";
                    htmlToAdd += "<td>";
                    htmlToAdd += '<p class="head">' + colName + '</p>';
                    if (hyperLinkCol === false)
                        colName.indexOf("axphidec_") === -1 ? htmlToAdd += '<p class="val">' + plotData[0][i] + '</p>' : htmlToAdd += "";
                    else {
                        var link = getTheHyperLink(plotData[0][hyperLinkCol], parsedHyperLink, plotData[0][i], i);
                        colName.indexOf("axphidec_") === -1 ? htmlToAdd += '<p class="val">' + link + '</p>' : htmlToAdd += "";
                    }
                    //htmlToAdd += '<p class="val">' + plotData[0][i] + '</p>';
                    htmlToAdd += "</td>";
                    if (plotData[0][i + 3] != undefined) {
                        colName = widgetColumns[i + 3].name;
                        colName = makeMeInitCap(colName);
                        htmlToAdd += "<td>";
                        htmlToAdd += '<p class="head">' + colName + '</p>';
                        if (hyperLinkCol === false)
                            colName.indexOf("axphidec_") === -1 ? htmlToAdd += '<p class="val">' + plotData[0][i + 3] + '</p>' : htmlToAdd += "";
                        else {
                            var link = getTheHyperLink(plotData[0][hyperLinkCol], parsedHyperLink, plotData[0][i + 3], i + 3);
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
                        htmlToAdd += '<p class="val">' + plotData[0][i] + '</p>';
                    else {
                        var link = getTheHyperLink(plotData[0][hyperLinkCol], parsedHyperLink, plotData[0][i], i);
                        htmlToAdd += '<p class="val">' + link + '</p>';
                    }
                    htmlToAdd += "</tr></td>";
                }
            }
            htmlToAdd += '</tbody></table>';
            htmlToAdd += '<span class="' + defaultIcon + ' kpiImage"></span>';

            htmlToAdd = '<div data-kpicolor = "' + kpiBgColor + '" class="kpiCard card colorMe ' + kpiBgColor + '"> ' + kpiTtlHtml + '<div class="card-content smallKpi ' + kpittlClass + ' white-text">' + htmlToAdd + '</div></div>';
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
                            colName.indexOf("axphidec_") === -1 ? bodyHtml += "<td>" + presentRow[i] + "</td>" : bodyHtml += "<td></td>";
                        else {
                            var link = getTheHyperLink(presentRow[hyperLinkCol], parsedHyperLink, presentRow[i], i);
                            colName.indexOf("axphidec_") === -1 ? bodyHtml += "<td>" + link + "</td>" : bodyHtml += "<td></td>";
                        }

                    }

                }
                bodyHtml += "</tr>"
            }
            bodyHtml += "</tbody>";
            htmlToAdd = "<div data-kpicolor = '" + kpiBgColor + "' class=\"kpiCard card colorMe " + kpiBgColor + "\">"+kpiTtlHtml+" <div class=\"card-content smallKpi " + kpittlClass + " white-text\"><div class=\"smallKpiTableWrapper\"><table class='kpiTable kpiPTable'>" + headerHtml + bodyHtml + "</table></div><span class='" + defaultIcon + " kpiImage'></span></div>";
        }

        $("#" + targetId + " .cardContentLoader").remove();
        $("#" + targetId + " .card-content").html(htmlToAdd);
        $("#" + targetId + " .card-content:first").css("padding", 0);
        addEventsAfterWidgetCreated(targetId);
    } else if (widgetType == "chart") {
        $("#" + targetId + " .cardContentLoader").remove();
        $("#" + targetId + " .wrapperForWidgets").addClass('maxHeight');
        var chartType = widgetInfo[widgetMetaData["CHARTTYPE"]];
        var title = widgetInfo[widgetMetaData["TITLE"]];
        var targetId = "#" + targetId + " .wrapperForWidgets"
        var height = parseInt($(targetId).css("height"));
        if (!$(targetId).is(':visible')) {
            $(targetId).addClass('setChartHeight');
        }
        var metaLth = qryMetaData.length;
        var attributes = widgetInfo[widgetMetaData["ATTRIBUTES"]];
        var attrs = {};
        if (attributes) {
            attributes = JSON.parse(attributes);
        } else {
            attributes = {};
        }
        var objToSend = {
            target: targetId,
            data: qryData,
            type: chartType,
            title: title,
            height: height,
            isCompressed: false,
            attr: attributes,
            metaData: qryMetaData,
            hyperLink: parsedHyperLink
        }
        createAgileChart(objToSend);

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
                var presntLink = hyperlinkData[i]; //h1=icarsiview(car_model=vijay^car_manufacture=08-NOV-16);
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
                    // var paramData = linkData.substring(0,frstBrIndex).replace(/ /g,'');
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
                // parsedData
            }
            return parsedHyperLink;

        } else {
            return false;
        }
    } catch (e) {
        // statements
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
                if (presLink.substr(0, frstEqIndx) === "h" + colIndex) {
                    linkData = presLink;
                } else {
                    continue;
                }
            }
            paramStr = linkData.substring(linkData.indexOf("(") + 1, linkData.lastIndexOf(")"));
            paramStr = paramStr.replace(/\^/g, "&");
        }
        return "<a class='whiteLink' href='javascript:void(0);' onclick=\"javascript:parent.LoadIframe('" + linkObjData.url + paramStr + "');\">" + cap + "</a>";
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



function addEventsAfterWidgetCreated(widgetId) {
    $("#" + widgetId + " .smallKpiTableWrapper").first().mCustomScrollbar({
        axis: "yx", // vertical and horizontal scrollbar
        theme: "minimal-dark",
        scrollInertia: 500,
        autoExpandScrollbar: false,
        updateOnContentResize: true
    });
}



$('input#widgetTstrctColumn,#widgetTstructName').on('keyup', function (e) {
    if ((e.which <= 111 && e.which >= 48) || e.which == 8 || e.which == 46) {
        var elem = $(this);
        elem.removeData('key');
        elem.data('key', undefined);
        if (elem.attr('id') === "widgetTstructName") {
            $('#widgetTableRemData').hide();
            $("#widgetTstrctColumn").data('key', undefined).val("").removeClass('valSelected').removeData('key').prop('disabled', true);
        } else {
            if (tableSqlCm)
                tableSqlCm.getDoc().setValue(" ");
            $('#widgetTableRemData').hide();
            selectedCols = [];
        }
    }

});



function getPanelHtml(type, title, targetId, calledFrom) {
    var calledFrom = (typeof calledFrom !== "undefined" && calledFrom) ? calledFrom : null;
    var iconClass = "icon-paper-plane";
    switch (type) {
        case "tstruct":
            iconClass = "icon-register";
            break;
        case "iview":
            iconClass = "icon-clipboard-user";
            break;
        case "widget":
            iconClass = "icon-cube"
            break;
        case "Custom__html":
            iconClass = "icon-pencil5";
            break;
        case "Custom__sql":
            iconClass = "icon-cloud-database";
            break;
        case "Custom__rss":
            iconClass = "icon-wifi";
            break;
        case "Custom__txt":
            iconClass = "icon-feather3";
            break;
        case "Custom__img":
            iconClass = "icon-picture2";
            break;
        case "Custom__mytsk":
            iconClass = "icon-envelope-open";
            break;
        default:
            iconClass = "icon-paper-plane";
            break;
    }
    // if(type == "tstruct")

    var htmlToReturn = "";
    var l3 = (!calledFrom) ? 'l3' : '';
    if (type == "table" || type == "kpi") {
        type = "table";
    }
    htmlToReturn += '<div id="axWidget' + targetId + '" data-id=' + targetId + ' data-val="' + title.toLowerCase() + '" data-type="' + type + '" class="col s12 m4 ' + l3 + ' widgetWrapper">';
    htmlToReturn += '<div class="card hoverable ">';
    if (type !== "table" && type !== "kpi") {
        htmlToReturn += '<div class="cardTitleWrapper">';
        htmlToReturn += '<i class="' + iconClass + '"></i>';
        htmlToReturn += '<span class="cardTitle">' + title + '</span>';
        // htmlToReturn += '<button type="button" class="cardTitleClear btn-flat waves-effect btn-floating right"><i class="icon-cross2"></i></button>';        
        if (calledFrom == "dashboard")
            htmlToReturn += '<button type="button" title="Zoom In" class="wgtBtn closeDBLoader btn-flat waves-effect btn-floating right"><i class="icon-expand  wgtIcon" tabindex="-1"></i></button>';
        htmlToReturn += '<div class="clear"></div>';
        htmlToReturn += '</div>';
    }
    htmlToReturn += '<div class="cardContentMainWrapper">';
    if (!calledFrom)
        htmlToReturn += '<button type="button" title="Delete Widget" class="cardTitleClear titleLessCardTitleClear  red waves-effect btn-floating right"><i class="icon-cross2"></i></button>';
    if (type == "chart" || type == "table" || type == "kpi") {
        var defaultcolorMe = (type == "table" || type == "kpi") ? 'colorMe blue' : '';
        htmlToReturn += '<div class="card-content ' + type + ' ' + defaultcolorMe + '">';
        var minHeight = (type == "table" || type == "kpi")?'style="min-height:0px;"':'';
        htmlToReturn += '<div class="wrapperForWidgets" '+minHeight+'>';
        htmlToReturn += '</div>';
        htmlToReturn += '<div class="cardContentLoader valign-wrapper">';
        htmlToReturn += '<div class="preloader-wrapper small active">';
        htmlToReturn += '<div class="spinner-layer spinner-green-only">';
        htmlToReturn += '<div class="circle-clipper left">';
        htmlToReturn += '<div class="circle"></div>';
        htmlToReturn += '</div>';
        htmlToReturn += '<div class="gap-patch">';
        htmlToReturn += '<div class="circle"></div>';
        htmlToReturn += '</div>';
        htmlToReturn += '<div class="circle-clipper right">';
        htmlToReturn += '<div class="circle"></div>';
        htmlToReturn += '</div>';
        htmlToReturn += '</div>';
        htmlToReturn += '</div>';
        htmlToReturn += '</div>';
        htmlToReturn += '</div>';

    }


    htmlToReturn += '</div>';
    htmlToReturn += '</div>';
    htmlToReturn += '</div>';
    return htmlToReturn;
}


function chartResize(mainDivId) {
    // $("#AXpage"+pageNo+" ")
    $("#" + mainDivId + " .setChartHeight:visible").each(function (index, el) {
        var elem = $(this);
        elem.removeClass('setChartHeight');
        var index = elem.data('highchartsChart');
        if (index)
            Highcharts.charts[index].setSize(null, 200);
    });
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


function customizeData(plotName) {
    if (plotName && typeof plotName === "string") {
        plotName = plotName.replace(/__\^__/g, ":");
    }
    return plotName;
}
function createGlobalVars() {
    var mainStr = "";
    try {
        var globalArray = globalVars.split(";");
        var globalArrayLth = globalArray.length;

        for (var i = 0; i < globalArrayLth; i++) {
            var presKey = globalArray[i];
            var presVal = presKey.split("=")[1];
            if (presVal) {
                presVal = presVal.replace(/"/g, "");
                mainStr += presVal.replace("~", ":") + "~";
            }

            //arrGlobalVars[pIndex] = list[0].toString();
            //arrGlobalVarValues[pIndex] = CheckSpecialCharInGlobalVar(list[1].toString());
            //pIndex++;
        }
    } catch (e) {
        console.log("error in global vars rendering:" + e)
    }

    return mainStr;
}