/////////////////
//By MANIKANTA //
/////////////////

dbType = dbType ? dbType.toLowerCase().replace(" ", "") : "oracle";
var widgetsPerPage = 8;
var maxNoOfGroups = 5;
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

var demandArray = [];
var newWidgetData = false;
var widgetTableData = {};
var presBuiildMode = "widgetBuild";

var presWizardData = {};

var theme = eval(callParent('currentThemeColor'));;
theme = theme || "default";
$j("#homeBuilderLink").attr('href', "../App_Themes/" + theme + "/home_builder.min.css?v=4");

//need to write a logic to handle who can access home builder;
//var userRespArr = "";
if((parent.userResp) != undefined)
    var userRespArr = parent.userResp.split(",");
else
    userRespArr = callParentNew("userResps").split(",");
if ($.inArray("default", userRespArr) === -1) {
    callParentNew("LoadIframe('page.aspx')","function");
   // parent.LoadIframe("page.aspx");
}
const globalConfiguration = {
    "chart3D": ["bar", "pie", "donut", "column", "stacked-group-column", "stacked-bar", "stacked-column"],
}


// ******MOVING  TO COMMONBUILDER SINCE TO USE IN WIDGET DEPENDANCY************
// // dont change the below configuration fields order once decided
// var chartConfiguration = {
//     "3columns": {
//         fieldsCount: 3,
//         fields: ["Data Label", "X-axis Label", "Value~fun"],
//         type: ["*", "*", "n"]
//     },
//     "3columnsNumeric": {
//         fieldsCount: 3,
//         fields: ["Data Label", "X-axis Data~fun", "Y-axis data~fun"],
//         type: ["*", "n", "n"]
//     },
//     "2columns": {
//         fieldsCount: 2,
//         fields: ["Xaxis Label", "Value~fun"],
//         type: ["*", "n"]
//     },
//     "4columns": {
//         fieldsCount: 4,
//         fields: ["Data Label", "Xaxis Label", "Group Column", "Value~fun"],
//         type: ["*", "*", "*", "n"]
//     },
//     "4columnsNumeric": {
//         fieldsCount: 4,
//         fields: ["Data Label", "X-axis Data~fun", "Y-axis Data~fun", "Z-axis Data~fun"],
//         type: ["*", "n", "n", "n"]
//     }
// };

var mainDataObj = {};

const exampleQueries = {
    twoColumn: "select first_name as data_label,sum(sales_qty) as value {{link}}<br>from AXP_SALES_DATA <br>group by first_name",
    threeColumn: "select first_name as data_label,sales_year as x_axis,sum(sales_qty) as value {{link}}<br>from AXP_SALES_DATA <br>group by first_name,sales_year <br>order by sales_year",
    scatter: "select first_name as data_label,sales_qty as x_axis_data,sales_year as y_axis_data from axp_sales_data",
    scatter3D: "select first_name as data_label,sales_qty as x_axis_data,sales_year as y_axis_data,sales_amount as z_axis_data from axp_sales_data",
    fourColumn: "select first_name as data_label,country as group_column,sales_year as x_axis,sum(sales_qty) as value {{link}}<br>from AXP_SALES_DATA <br>group by first_name,sales_year,country <br>order by sales_year",
    kpi: "select sum(sales_amount) as axphideh_sales from AXP_SALES_DATA where country = 'India'",
    kpi1: "select * from axp_sales_data where sales_qty=(select max(sales_qty) from axp_sales_data)",
    table: "select * from AXP_SALES_DATA",
    iview: "select first_name,country,sales_year,sales_amount from axp_sales_data",
    links: {
        chartLink: {
            oracle: ",<br>'h1=isales(name='|| first_name ||'^year='|| sales_year ||')' as link",
            mysql: ",<br>CONCAT('h1=isales(name=', first_name, '^year=', sales_year, ')') as link",
            mariadb: ",<br>CONCAT('h1=isales(name=', first_name, '^year=', sales_year, ')') as link",
            mssql: ",<br>'h1=isales(name='+ first_name +'^year='+ sales_year +')' as link"
        },
        pieLink: {
            oracle: ",<br>'h1=isales(name='|| first_name ||')' as link ",
            mssql: ",<br>'h1=isales(name='+ first_name +')' as link ",
            mysql: ",<br>CONCAT('h1=isales(name=', first_name,')') as link",
            mariadb: ",<br>CONCAT('h1=isales(name=', first_name,')') as link",
        },
        kpiLink: {
            oracle: "select first_name,country,sales_year,<br>'h1=isales(name='|| first_name || '^year='||  sales_year ||')~h2=ipurch(qty='|| sales_qty || ')' as link <br>from AXP_SALES_DATA",

            mssql: "select first_name,country,sales_year,<br>'h1=isales(name='+ first_name + '^year='+  sales_year +')~h2=ipurch(qty='+ sales_qty + ')' as link <br>from AXP_SALES_DATA",

            mysql: "select first_name,country,sales_year,<br>CONCAT('h1=isales(name=', first_name, '^year=',  sales_year, ')~h2=ipurch(qty=', sales_qty, ')') as link <br>from AXP_SALES_DATA",

            mariadb: "select first_name,country,sales_year,<br>CONCAT('h1=isales(name=', first_name, '^year=',  sales_year, ')~h2=ipurch(qty=', sales_qty, ')') as link <br>from AXP_SALES_DATA",
        }

    }

}

var chartExamples = {
    "area": exampleQueries.threeColumn,
    "line": exampleQueries.threeColumn,
    "bar": exampleQueries.threeColumn,
    "column": exampleQueries.threeColumn,
    "stacked-bar": exampleQueries.threeColumn,
    "stacked-column": exampleQueries.threeColumn,
    "stacked-percentage-column": exampleQueries.threeColumn,
    "scatter-plot": exampleQueries.scatter,
    "stacked-group-column": exampleQueries.fourColumn,
    "scatter-plot-3D": exampleQueries.scatter3D,
    "pie": exampleQueries.twoColumn,
    "semi-donut": exampleQueries.twoColumn,
    "donut": exampleQueries.twoColumn,
    "chartLink": exampleQueries.links.chartLink[dbType],
    "pieLink": exampleQueries.links.pieLink[dbType],
    "kpi": exampleQueries.kpi,
    "kpi1": exampleQueries.kpi1,
    "table": exampleQueries.table,
    "kpiLink": exampleQueries.links.kpiLink[dbType],
    "iview": exampleQueries.iview
}

var widgetMessages = {
    "noChart": eval(callParent('lcm[17]')),
    "noTitle": eval(callParent('lcm[146]')),
    "noCaption": "Please enter the caption.",
    "noIviewName": "Please enter the iview name.",
    "noCaption": "Please enter the caption",
    "noTypeSelected": "Please select the type.",
    "mandatoryFld": eval(callParent('lcm[147]')),
    "validStructureName": "Please enter a valid structure name.",
    "noRoles": eval(callParent('lcm[148]')),
    "widgetCreated": eval(callParent('lcm[149]')),
    "deleteSuccess": eval(callParent('lcm[150]')),
    "widgetUpdated": eval(callParent('lcm[151]')),
    "noChanges": eval(callParent('lcm[152]')),
    "atleastOneCol": eval(callParent('lcm[153]')),
    "noIviewType": "Please select the type of ivew.",
    "validSql": "Please enter the valid SQL.",
    "maxGroups": "Reached maximum no.of groups.",
    "invalidName": "Please enter a valid name.",
    "invalidCaption": "Please enter a valid caption.",
    "noSQl": "Please enter a valid SQL.",
    "invalidIviewParams": "Invalid parameters, name cannot be column name or global parameter.",
    "noResponsibility": "No Responsibility",
    "paramNameExists": "Parameter name already exists",
    "hypNameExists": "Hyperlink name already exists",
    "iviewNameAlreadyExists": "Iview name already exists",
    "multipleHypParams": "Parameter name should not be duplicate.",
    "invalidIviewName": "Please enter a valid iview name",
    "unsavedChanges": "You have unsaved data. Do you want to proceed?",
    "invalidColName": "Please enter a valid column name.",
    "invalidDecimalVal": "Please enter a valid decimal value.",
    "invalidColWidth": "Please enter a valid column width.",
    "paramsInUse" : "Params used in SQL cannot be deleted."
}

var wizardObj = new WizardComp({ progress_bar: `${AxwizardType === "modern" ? "flat" : AxwizardType}` });

inheritsFrom(AjaxCallObj, MainAjaxCalls);
var ajaxCallObj = new AjaxCallObj();
var isValidPage = ajaxCallObj.isPageValid();
if (isValidPage) {
    ajaxCallObj.getNLSparameter();
} else {
    redirectPage(true);
}

wizardObj.chartWizard = {
    steps: 4,
    ids: ["chartSelData", "queryData", "appearanceData", "roleSelctionData"],
    stepNames: ["Chart Type", "Source", "Attributes", "Authorization"],
    validateKeys: ["chtType", "query", "attrs", "rl"]
}
wizardObj.kpiWizard = {
    steps: 3,
    ids: ["queryData", "appearanceData", "roleSelctionData"],
    stepNames: ["Source", "Attributes", "Authorization"],
    validateKeys: ["query", "attrs", "rl"]
}
wizardObj.iviewWizard = {
    steps: 4,
    ids: ["iviewType", "queryData", "ivColData", "ivParams"],
    stepNames: ["Report Type", "Source", "Columns", "Parameters"],
    validateKeys: ["ivrt", "query", "ivcl", "ivp"]
}

wizardObj.checkNxtPrevBtns = function () {
    var totalSteps = $("#wizardHeader .step").length;
    var curStep = $("#wizardHeader .step.active").data('id');
    if (curStep == 0) {
        $("#wizardPrevbtn").attr("onclick", "wizardObj.resetTheWizard()");
        $("#wizardNextbtn").attr({ "onclick": "wizardObj.checkClick(this,'next')", "title": "Next" }).show().html("Next &gt;");
    } else if (curStep == (totalSteps - 1)) {
        $("#wizardPrevbtn").attr("onclick", "wizardObj.checkClick(this,'prev')").show();
        $("#wizardNextbtn").show().attr({ "onclick": "createJsonToSend()", "title": "Create" }).html("Create");
    } else {
        $("#wizardPrevbtn").attr("onclick", "wizardObj.checkClick(this,'prev')").show();
        $("#wizardNextbtn").attr({ "onclick": "wizardObj.checkClick(this,'next')", "title": "Next" }).show().html("Next &gt;");
    }
}

wizardObj.validateTheKey = function (objct, key) {
    var presentObj = wizardObj[objct];
    var validateKeys = presentObj.validateKeys;
    var validateKeyName = validateKeys[key];
    return doTheValidations(validateKeyName);
}


wizardObj.onWizardCreate = function () {
    //hook to add extra code after wizard is created
    if (widgetType === "iview") {
        // presWizardData = {"iviews":{}}
        presWizardData.iviews = {}
        presWizardData.extraData = {}
        var iviewObj = presWizardData.iviews;
        iviewObj.s = sId;
        iviewObj.axpapp = mainProjName;
        iviewObj.gtotal = "F";
        iviewObj.actmode = "new";
        iviewObj.tasks = [{
            "name": "Task1",
            "txt": [{
                "v": ""
            }],
            "type": "sql",
            "rfld": ""
        }];
        iviewObj.cols = [];
        iviewObj.hyperlinks = [];
        iviewObj.params = [];
        $("#widgetTTlWrpper").addClass('m6');
        $("#widgetTTlWrpper label").html('Caption<sup>*</sup>');
        $("#widgeIvNameWrpper").show();
    }
}

wizardObj.onWizardClose = function () {
    // isNewGroupAdded = true;
    presWizardData = {};
    $("#chartSelData").removeData("isCompleted");
    $("#chartSelData").data('isCompleted', undefined);
    $("#widgetTitle,#chartYaxisLabel,#chartXaxisLabel,#iviewName").val("");
    $("#shwLgnd").prop('checked', true).attr('checked', 'checked');
    $("#gradienChartInp").prop('checked', false).removeAttr('checked');
    $("#wizardNextbtn").attr({ "onclick": "wizardObj.checkClick(this,'next')", "title": "Next" }).html("Next &gt;");
    $("#chartSelData a.selected").data('cc', '');
    $("#chartSelData a.selected").removeData('cc')
    $("#wtrFldsData").html("");
    $("#sqlQry").click();
    if (mainSqlCM)
        mainSqlCM.getDoc().setValue("");
    if (tableSqlCm)
        tableSqlCm.getDoc().setValue("");
    $("#chartSelData a.selected").removeClass('selected');
    if ($("#widgetTstructName").data('key')) {
        $("#widgetTstructName").data('key', undefined).val("").removeClass('valSelected').removeData('key');
        $("#widgetTstrctColumn").data('key', undefined).val("").removeData('key').removeClass('valSelected').prop('disabled', true);
        $('#widgetTableRemData').hide();
        selectedCols = [];
    }
    $("#widgetGroupsInp").data('key', undefined).val("").removeClass('valSelected').removeData('key');
    $("#isValidSQl").removeClass('tableSqlFocussed');
    $('button#multiselect_leftAll').trigger('click');
    $("#iviewType").data('isComp', "false");
    $("#iviewType a.active").removeClass("active");
    $("#widgetTTlWrpper").removeClass('m6');
    $("#widgetTTlWrpper label").html('Title<sup>*</sup>');
    $("#widgeIvNameWrpper").hide();
    $(".ivEchPramWrapper").data('tmpIndex', undefined);
    $(document).off('keydown.ivColKdEvnt');
    $("#iviewType .selectedIcon").remove();
    Materialize.updateTextFields();
}

jQuery(document).ready(function ($) {
    $('#multiselect option:disabled').html(widgetMessages.noResponsibility);
    if (!mainRestDllPath) {
        $(".ivCreationRelated").hide();
    }
    $(callParentNew("developerbreadcrumbTitle","class")).text("Widget Builder");
    $("#lblWidgetBuilder").text(callParentNew("lcm")[257]);
    var finalChartHtml = "";
    for (var key in customChartColors) {
        var presKeyArr = key.split("~");
        var keyCode = presKeyArr[0];
        var keyName = presKeyArr[1] || keyCode;
        // finalChartHtml += '<div class="eachCCWrapper">';
        // finalChartHtml += '<button data-colorcode="' + keyCode + '" onclick="chartColorChanger(\'colorPick\',this)" class="chartColorWrapper waves-effect waves-light btn-flat">' + keyName;
        // finalChartHtml += '</button>';
        // finalChartHtml += '</div>';
        finalChartHtml += '<option value="' + keyCode + '">' + keyName + '</option>';
    }
    finalChartHtml += '<option value="custom">Custom</option>';
    $("#chartColorPicker #colorSelector .palletSelectFld").html('<select id="chartColorChangerSlctBx" onchange="chartColorChanger(\'colorPick\', this)" class="materialSelect">' + finalChartHtml + '</select>');
    // $("#chartColorPicker #colorSelector select").material_select();



    $('#wizardModal').modal({
        dismissible: false,
        ready: function (modal, trigger) {
            materialModalEventsHandler("bind");
            tabFocusEventHandler({task:'bind', parentId:"wizardModal",loopInsideParent: true});
        },
        complete: function () {
            materialModalEventsHandler("unbind");
            tabFocusEventHandler({task:'unbind', parentId:"wizardModal"});
            wizardObj.resetTheWizard()
        }
    });



    $("#sqlExData").on('click', function (e) {
        // if (widgetType === "chart") {
        //     var sql = $("#sqlExData .chartExmplP").html();
        //     sql = sql.replace(/<br>/g, '\n');
        //     mainSqlCM.getDoc().setValue(sql);
        // $("#isValidSQl").val("true");
        // } else if (widgetType === "kpi") {
        var elem = $(e.target);
        // for tab click
        if (elem.hasClass('chrtKpiEXAnchr')) {
            elem = elem.find('p.chrtKpiEX');
        }

        if (elem.hasClass('chrtKpiEX')) {
            var sql = elem.html();
            sql = sql.replace(/<br>/g, '\n');
            mainSqlCM.getDoc().setValue(sql);
            mainSqlCM.focus()
            // $("#isValidSQl").val("true");
        }
        // }
    });
    $('.materialCollapsible').collapsible();
    $("#chartSelData a").on('click', function (event) {
        event.preventDefault();
        presWizardData.isDirty = true;
        var elem = $(this);
        if (elem.hasClass('selected')) return;
        var isCompleted = $("#chartSelData").data("isCompleted");
        $("#chartSelData a.selected").removeClass('selected');
        $(this).addClass('selected');

        //need to update in obj if required
        if (isCompleted != true) {
            $("#chartSelData").data("isCompleted", true)
            wizardObj.completeCurrentStep();
            wizardObj.checkNxtPrevBtns();
        } else {
            //means not first time click
            if ($("#widgetTstructName").data('key')) {
                $("#widgetTstructName").data('key', undefined).val("").removeClass('valSelected').removeData('key');
                $("#widgetTstrctColumn").data('key', undefined).val("").removeClass('valSelected').removeData('key').prop('disabled', true);
                $('#widgetTableRemData').hide();
                if (tableSqlCm)
                    tableSqlCm.getDoc().setValue("");
                selectedCols = [];
            }
        }
    });
    $('.materialSelect').material_select();

    $("#sqlExmpleBtn,#sqlEdtExmpleBtn").on('click', function (e) {
        var elem = $(this);
        elem.next().slideToggle();
        elem.find('.arrwCls').toggleClass('icon-chevron-down icon-chevron-up');
    });

    $("#prpShtAutoSave").on('change', function () {
        if ($(this).is(":checked")) {
            $("#updateWidget,#refreshWidget").hide();
        } else {
            $("#updateWidget,#refreshWidget").show();
        }

    });
    // $("#shwLgnd").on('change', function(event) {
    //     $("#showLgndPstn").toggle();
    //     /* Act on the event */
    // });

    $("input[name='widgetSqlSource']").on('change', function (event) {
        $("#wizardNextbtn").removeClass('validated');
        if ($(this).data("val") == "sql") {
            $("#widgetSqlData").show();
            $("#widgetTableData").hide();
            mainSqlCM.focus();
        } else {
            $("#widgetSqlData").hide();
            $("#widgetTableData").show();
            $("#widgetTableData input:first").focus();
        }
    });




    wizardObj.onPageShow = function(target) {
        tabFocusEventHandler({task:'bind', parentId:"wizardModal", loopInsideParent:true});
        if (target === "queryData") {
            if (widgetType === "chart") {
                var chartType = $("#chartSelData a.selected").data('type');
                var exampleData = getExampleData("chart", chartType);
                $("#sqlExData").html("<p class='chartExmplP'>" + exampleData + "</p>");
            } else if (widgetType === "kpi") {


                $("#sqlExData").html(getExampleData("kpi"));
            } else if (widgetType === "iview") {
                $("#sqlExData").html(getExampleData("iview"));
            }
            if (!$("#codeMirrorSql").hasClass('cdmrEdiSetted')) {
                $("#codeMirrorSql").addClass('cdmrEdiSetted')
                mainSqlCM = CodeMirror.fromTextArea(document.getElementById("codeMirrorSql"), {
                    mode: 'text/x-sql',
                    smartIndent: true,
                    lineNumbers: true,
                    matchBrackets: true,
                    extraKeys: {
                        "Ctrl-Space": "autocomplete",
                        "Tab": false, // Let focus go to next control
                        "Shift-Tab": false // Let focus go to previous control
                    },
                    value: document.documentElement.innerHTML,
                    hintOptions: {
                        tables: codeMirrorHintObj
                    }
                });
                // mainSqlCM.on("blur", function(inst, event) {
                //     var sql = inst.getDoc().getValue();
                //     if (sql)
                //         ajaxCallObj.isValidQuery(sql);
                // });
                mainSqlCM.on("change", function (doc, changeObj) {
                    $("#wizardNextbtn").removeClass('validated')
                    // $("#isValidSQl").val("false");
                });
                // mainSqlCM.options.hintOptions.tables = codeMirrorHintObj;
                mainSqlCM.on('keyup', function(editor, event){
                  if (
                    !(event.ctrlKey) &&
                    (event.keyCode >= 65 && event.keyCode <= 90) || 
                    (event.keyCode >= 97 && event.keyCode <= 122) || 
                    (event.keyCode >= 46 && event.keyCode <= 57)
                  ) {
                    // type code and show autocomplete hint in the meanwhile
                    CodeMirror.commands.autocomplete(editor);
                  }
                });
            } else {
                mainSqlCM.refresh();
            }
        } else if (target === "appearanceData") {
            if (widgetType === "kpi") {
                $("#appearanceData .apprData").hide();
                $("#appearanceData div[data-showfor*='kpi']").show();
            } else if (widgetType === "chart") {
                $("#appearanceData .apprData").hide();
                notOf = "";
                var typeOfChart = $("#chartSelData a.selected").data('type');
                if (typeOfChart === "pie" || typeOfChart === "semi-donut" || typeOfChart === "donut")
                    notOf = "#chartYaxisLabelWrapper,#chartXaxisLabelWrapper";
                $("#appearanceData div[data-showfor*='chart']").not(notOf).show();
            }
        }
        // alert(target)
    }

    $("#propertySearchFld").on('keyup', function (e) {
        var elem = $(this);
        var enteredVal = elem.val().toLowerCase();
        var cutMsg = eval(callParent('lcm[0]'));
        var nodata = '<tr class="noDatFoundTr"><td colspan="2" class="center">' + cutMsg + '</td></tr>';
        // $("#propTableContent table tr:not('.notSearchable') ")
        $("#propTableContent table tbody .noDatFoundTr").remove();
        $("#propTableContent table tr:not('.notSearchable')").each(function (index, el) {
            var presTr = $(this);
            var childTd = presTr.find('td:first');
            if (enteredVal != "" && childTd.hasClass('subHeading')) {
                presTr.hide();
                return;
            }
            childTd.text().toLowerCase().indexOf(enteredVal) === -1 ? presTr.hide() : presTr.show();
        });
        if (elem.val() != "" && $("#propTableContent table tr:visible").length == 0) {

            $("#propTableContent table tbody").append(nodata)
        }
    });

    $("#propertySheet").draggable({
        revert: false,
        scroll: false,
        appendTo: 'body',
        containment: 'window',
        handle: ".hpbHeaderTitle",
        cursor: 'move',
        start: function (event, ui) {
            $("#propertySheet").css('bottom', '');
        }
    })

    $("#propTableContent .propShtDataToggleIcon").on('click', function (e) {
        var elem = $(this);
        var target = elem.data('target');
        $("#propTableContent table tr[data-group='" + target + "']:not('.notSearchable')").toggle();
        elem.toggleClass('icon-chevron-up icon-chevron-down');
        /* Act on the event */
    });

    $(document).on('click', '#widgetPanelWrapper .widgetWrapper', function (event) {
        var elem = $(this);
        if (!validateProprtySht('onWdgtClick', elem))
            return false;
        if (elem.hasClass('selectedForPropSht')) {
            closeProprtySht();
            return;
        }
        var wId = elem.data('id');
        let is3dChart = false;

        $("#widgetPanelWrapper .widgetWrapper.selectedForPropSht").removeClass('selectedForPropSht');

        elem.addClass('selectedForPropSht');

        var presentObj = widgetTableData["w" + wId];
        var type = presentObj.type;
        if (type === "chart") {
            var cType = presentObj.cType;
            var ex = chartExamples[cType] || "";
            $("#sqlEdtExData").html(ex);
            // $("#sqlEdtExData,#sqlEdtExmpleBtn").show();
            $("#sqlEdtExData,#sqlEdtExmpleBtn").hide();
        } else if (type === "kpi") {
            $("#sqlEdtExData,#sqlEdtExmpleBtn").hide();
            // $("#sqlEdtExData").html(getKpiHtml());
        }
        var type = elem.data('type');

        var idOfElem = elem.attr('id');
        var title = presentObj.title;
        var SQL = presentObj.sql;
        var SelectedRoles = presentObj.roles || "";
        var kpiColor = type == "kpi" ? elem.find('.colorMe').data('kpicolor') : false;
        var presObjAttrs = presentObj.attr;
        if (presObjAttrs) presObjAttrs = JSON.parse(presObjAttrs);
        //clear all the values
        clearPropertySheet();
        var cTypeToShw = type.toLowerCase() === "table" ? "kpi" : type;
        $("#prpShtComponent").text(cTypeToShw);
        $("#prpShtTitle").val(htmlEntity("decode", title));
        $("#prpShtTxtBx").data("id", wId).val(SQL);
        if (type === "iview") {

            $("#prpShtApprRelated").addClass('notSearchable').hide();
            var ivName = presObjAttrs.ivName || "";
            $("#prpShtIvName").val(ivName);
            $("#prpShtUpdateInfo").hide();
            $("#propertySheet .prpSteIvRelated").removeClass('notSearchable').show();
            $("#propertySheet .ivDisabledFld").prop('disabled', true);
            $("#propertySheet .prpShtAuthRelated,.prpSteNonIvRelated,#chartColorPickerWrapper").addClass('notSearchable').hide();

        } else {
            var rolesData = widgetTableData.allRoles;
            var rolesDataLngth = rolesData.length;
            var optionHtml = "";
            for (var i = 0; i < rolesDataLngth; i++) {
                optionHtml += '<option selected title="' + rolesData[i] + '" value="' + rolesData[i] + '">' + rolesData[i] + '</option>';
            }
            if (rolesDataLngth === 0) {
                optionHtml += '<option disabled >No Roles assigned</option>'
            }

            // prpShtGrpWrapper
            // groups
            var grpLth = groups.length;
            var selectdGrpName = presentObj.grpName;
            var grpOptnsHtml = "";
            for (var i = 0; i < grpLth; i++) {
                var presGrp = groups[i];
                if (presGrp) {
                    var isSelected = presGrp === selectdGrpName ? "selected" : "";
                    grpOptnsHtml += '<option ' + isSelected + ' title="' + presGrp + '" value="' + presGrp + '">' + presGrp + '</option>';
                }
            }
            $("#prpShtGrpWrapper select").html(grpOptnsHtml);
            $('#prpShtGrpWrapper select').material_select('destroy');
            $('#prpShtGrpWrapper select').material_select();
            $('#prpShtRoles').material_select('destroy');
            if (presentObj.roles) {
                $("#prpShtRoles").val(presentObj.roles);
                $('#prpShtRoles').material_select();
            } else {
                ajaxCallObj.getWidgetRoles(wId, optionHtml);
            }
            var chartType = presentObj.cType;
            is3dChart = $.inArray(chartType, globalConfiguration.chart3D) !== -1;


            if (type === "chart") {
                $("#prpShtShwLgndWrapper,#chartColorPickerWrapper,#prpShtGradientChrtWrapper,#prpShtShwChrtValWrapper").removeClass('notSearchable').show();
                if (presObjAttrs) {
                    if (presObjAttrs.shwLgnd) {
                        $("#prpShtShwLgnd").prop('checked', true)
                    } else {
                        $("#prpShtShwLgnd").prop('checked', false)
                    }
                    if (presObjAttrs.shwChartVal) {
                        $("#prpShtShwChrtVal").prop('checked', true)
                    } else {
                        $("#prpShtShwChrtVal").prop('checked', false)
                    }

                    var chartColorKey = presObjAttrs.cck;
                    var chartColorCodes = presObjAttrs.cccv;
                    if (chartColorKey) {
                        // if (chartColorKey === "custom") {
                        // }

                    } else {
                        chartColorKey = "pallet1";
                    }
                    if (presObjAttrs.gradClrChart && (presObjAttrs.gradClrChart === true || presObjAttrs.gradClrChart === "true")) {
                        $("#prpShtGradientChrt").prop('checked', true)
                    } else {
                        $("#prpShtGradientChrt").prop('checked', false)
                    }

                } else {
                    var chartColorKey = "pallet1";
                    var chartColorCodes = "";
                }
                chartColorChanger("colorSet", chartColorKey, chartColorCodes);





            } else {
                $("#prpShtShwLgndWrapper,#chartColorPickerWrapper,#prpShtGradientChrtWrapper,#prpShtShwChrtValWrapper").addClass('notSearchable').hide();
            }

            if (type === "chart" && (chartType === "semi-donut" || chartType === "pie" || chartType === "donut")) {
                $("#prpShtShwValFrPWrapper").removeClass('notSearchable').show();
                if (presObjAttrs && presObjAttrs.shwVal) {
                    $("#prpShtShwValForPie").prop('checked', true)
                } else {
                    $("#prpShtShwValForPie").prop('checked', false)
                }
            } else {
                $("#prpShtShwValFrPWrapper").addClass('notSearchable').hide();
            }

            if (is3dChart) {
                $("#prpSht3DChrtWrapper").removeClass('notSearchable').show();
                if (presObjAttrs && presObjAttrs.threeD === "create") {
                    $("#prpSht3DChrt").prop('checked', true)
                } else {
                    $("#prpSht3DChrt").prop('checked', false)
                }
            } else {
                $("#prpSht3DChrtWrapper").addClass('notSearchable').hide();
            }
            // 
        }

        // else {
        //     $("#prpShtApprRelated").addClass('notSearchable').hide();
        //     var ivName = presObjAttrs.ivName || "";
        //     $("#prpShtIvName").val(ivName);
        //     $("#prpShtUpdateInfo").hide();
        //     $("#propertySheet .prpSteIvRelated").removeClass('notSearchable').show();
        //     $("#propertySheet .ivDisabledFld").prop('disabled', true);
        //     $("#propertySheet .prpShtAuthRelated,.prpSteNonIvRelated,#chartColorPickerWrapper").addClass('notSearchable').hide();
        // }
        openProprtySht(type, idOfElem);

        //~~~~~After Property sheet opened~~~~~~~
        //
        // var kpiColor = prsntJsonObj.kpiColor
        if (type === "kpi") {
            $("#prpShtkpiTtlWrapper").removeClass('notSearchable').show();
            if (kpiColor) {
                ChangePropertySheet("kpiWidgetClicked");
                $("#gradientPicker").attr('class', 'colorMe ' + kpiColor + ' center-align');
                $("#gradientPicker a").data('color', kpiColor).text(kpiColor);
            }
            if (presObjAttrs && presObjAttrs.shwKpiTtl)
                $("#prpShtshwKpiTtl").prop('checked', true)
            else
                $("#prpShtshwKpiTtl").prop('checked', false)
        } else {
            $("#prpShtkpiTtlWrapper").addClass('notSearchable').hide();
        }

        if (type === "kpi" || type === "chart") {
            // for exposeAPI
            if (presObjAttrs && presObjAttrs.exposeAPI) {
                $("#prpShtAPIswitch").prop('checked', true);
                chnageKpiChartView('exposeAPI', true, 'exposeAPI');
            } else {
                $("#prpShtAPIswitch").prop('checked', false);
                chnageKpiChartView('exposeAPI', false, 'exposeAPI');
            }
        }


    });



    $("#mainSearchFld").keydown(function (e) {
        if (!closeProprtySht()) {
            e.preventDefault();
            return;
        }
    })
    $("#mainSearchFld").keyup(function (e) {
        if (e.keyCode === 9) {
            return;
        }
        if (!dataTableApi) {
            createGridDatatble();
        }
        var curValue = $(this).val();
        dataTableApi.search(curValue).draw();
        $('.widgetWrapper').hide();
        var selectedRow = dataTableApi.row().context[0].aiDisplay;
        if (presentView === "widget") {
            $('.pagination-wrapper').createAxPagination("destroy");
            $(".widgetWrapper").hide();
            for (i = 0; i < selectedRow.length; i++) {
                $('#axWidget' + dataTableApi.row(selectedRow[i]).data().id).show();
            }
            createPagination();
        } else {
            $("#gridWdgtToggleBtn").addClass('changesAvailable')
        }
        checkDataFound(selectedRow);
    });
    $('#matcolumnSearch li').click(function (e) {
        if (!dataTableApi) {
            createGridDatatble();
        }
        $("#mainSearchFld").val('');
        var target = $(this).data('id');
        var oldVal = $('#matcolumnSrchBtn').text();
        if (target.toLowerCase() === oldVal.toLowerCase()) return false;
        $('#matcolumnSrchBtn').removeClass('active').text(target).attr('title', 'Search ' + target);
        target = target.toLowerCase();
        //target = (target == 'kpi') ? 'table' : target;
        dataTableApi.column(2).search(target != "all" ? '^' + target + '$' : '', true, false).draw();
        if (presentView === "widget") {
            $('.pagination-wrapper').createAxPagination("destroy");
            $(".widgetWrapper").hide();
            if (target.toLowerCase() === "all") {
                $(".widgetWrapper").show();
                createPagination();
            } else {
                if (target === "table")
                    $(".widgetWrapper[data-type='kpi'],.widgetWrapper[data-type='table']").show();
                else
                    $(".widgetWrapper[data-type='" + target.toLowerCase() + "']").show();
                createPagination();
            }
        } else {
            $("#gridWdgtToggleBtn").addClass('changesAvailable');
            $('#matcolumnSearch').addClass('clicked');
        }
        var selectedRow = dataTableApi.row().context[0].aiDisplay;
        checkDataFound(selectedRow);
    });

});

$(document).on('click', '.cardTitleClear', function (e) {
    e.stopPropagation();
    var widgetId = $(this).parents('.widgetWrapper').data('id');
    createConfirmBox("deleteWidget", "Are you sure you want to delete?", widgetId);
    //
    /* Act on the event */
});


// function assignPropShtValues(wId) {

// }

function changeIvType(elem, type) {
    // $("#chartSelData").data("isCompleted", true)
    presWizardData.isDirty = true;
    elem = $(elem);
    if (elem.hasClass('active'))
        return false;
    var checkHtml = '<span class="selectedIcon darkenBackground themeDarkenBackground icon-check"></span>';
    presWizardData.iviews.viewtype = type;
    if (type === "Interactive") {
        presWizardData.iviews.gtotal = "F";
    }
    var isCompleted = $("#iviewType").data('isComp');

    $("#iviewType a.active").removeClass("active");
    $('#iviewType .selectedIcon').remove();
    elem.addClass('active');
    elem.find('span').html(checkHtml);
    if (isCompleted !== "true") {
        $("#iviewType").data('isComp', "true");
        wizardObj.completeCurrentStep();
        wizardObj.checkNxtPrevBtns();
    }
}


/**
 * To get the HTML to show in the modal popup
 * @author ManiKanta
 * @Date   2018-10-04T15:56:08+0530
 * @param  {String}                 options.type    type of html to send
 * @param  {Object}                 options.details 
 * @return {String}                                 HTML
 */
function getModalHTML({ type, details, idOfModel }) {
    var modelBodyHtml = "";
    if (type === "param") {
        var parentElem = $(details).parents(".ivEchPramWrapper");
        var parentElmIndex = parentElem.index();
        // extraColAppCb = "'" + idOfModel + "','" + parentElmIndex + "','params'";
        var isParamExists = false;
        var savedIndx = parentElem.data('tmpIndex');
        if (savedIndx === undefined) {
            var pname = parentElem.find('.pName').val();
            var pvalue = parentElem.find('.pVal').val();
            var pType = parentElem.find('select.pType').val();
            var pcaption = "";
            // var pdatatype = "";
            var pdecimals = "0";
            var pexpr = "";
            var phidden = "";
            var pmoe = "";
            var psql = "";
            var psuggest = "";
            var pvexpr = "";
        } else {
            var presParamData = presWizardData.extraData.params[savedIndx];
            presParamData.name = parentElem.find('.pName').val();
            presParamData.value = parentElem.find('.pVal').val();
            presParamData.datatype = parentElem.find('select.pType').val();
            var pname = presParamData.name;
            var pvalue = presParamData.value;
            var pcaption = presParamData.caption;
            var pType = presParamData.datatype;
            var pdecimals = presParamData.decimals || "0";
            var pexpr = presParamData.expr;
            var phidden = presParamData.hidden;
            var pmoe = presParamData.moe;
            // var pqryname = presParamData.qryname;
            var psql = presParamData.sql;
            var psuggest = presParamData.suggest;
            var pvexpr = presParamData.vexpr;
            // var pwidth = presParamData.width;
        }

        modelBodyHtml += '<div class="container1">';
        modelBodyHtml += '<div class="row">';
        modelBodyHtml += '<div class="input-field col s12 m6">';
        var isDisabled = parentElem.find('.pName').is(":disabled") ? "disabled" : "";
        modelBodyHtml += '<input maxlength="10" ' + isDisabled + ' value="' + pname + '" class="themeMaterialInp" id="ivPropName" type="text">';
        modelBodyHtml += '<label for="ivPropName">Name</label>';
        modelBodyHtml += '</div>';
        modelBodyHtml += '<div class="input-field col s12 m6">';
        modelBodyHtml += '<input value="' + pcaption + '" class="themeMaterialInp" id="ivPropCaptn" type="text">';
        modelBodyHtml += '<label for="ivPropCaptn">Caption</label>';
        modelBodyHtml += '</div>';
        modelBodyHtml += '<div class="input-field col s12 m4">';
        modelBodyHtml += '<select id="ivPropType" class="materialSelect">';
        // modelBodyHtml += '<option value="" disabled selected>Choose your option</option>';
        var isSelected = pType === "Character" ? "selected" : "";
        modelBodyHtml += '<option ' + isSelected + ' value="Character">Character</option>';
        var isSelected = pType === "Date/Time" ? "selected" : "";
        modelBodyHtml += '<option ' + isSelected + ' value="Date/Time">Date/Time</option>';
        var isSelected = pType === "Numeric" ? "selected" : "";
        modelBodyHtml += '<option ' + isSelected + ' value="Numeric">Numeric</option>';
        modelBodyHtml += '</select>';
        modelBodyHtml += '<label>Data Type</label>';
        modelBodyHtml += '</div>';
        modelBodyHtml += '<div class="input-field col s12 m4">';
        var isDeciDisabeld = pType === "Numeric" ? "" : "disabled";
        modelBodyHtml += '<input ' + isDeciDisabeld + ' value="' + pdecimals + '" class="themeMaterialInp" id="ivPropdcml" type="text">';
        modelBodyHtml += '<label for="ivPropdcml">Decimal</label>';
        modelBodyHtml += '</div>';
        modelBodyHtml += '<div class="input-field col s12 m4">';
        modelBodyHtml += '<input value="' + pvalue + '" class="themeMaterialInp" id="ivPropVal" type="text">';
        modelBodyHtml += '<label for="ivPropVal">Value</label>';
        modelBodyHtml += '</div>';
        modelBodyHtml += '<div class="input-field col s12 m6">';
        modelBodyHtml += '<select id="ivParamsMoe" class="materialSelect">';
        // modelBodyHtml += '<option value="" disabled selected>Choose your option</option>';
        var isSelected = pmoe === "Accept" ? "selected" : "";
        modelBodyHtml += '<option ' + isSelected + ' value="Accept">Accept</option>';
        var isSelected = pmoe === "Select" ? "selected" : "";
        modelBodyHtml += '<option ' + isSelected + ' value="Select">Select</option>';
        var isSelected = pmoe === "Multi Select" ? "selected" : "";
        modelBodyHtml += '<option ' + isSelected + ' value="Multi Select">Multi Select</option>';
        var isSelected = pmoe === "Pick List" ? "selected" : "";
        modelBodyHtml += '<option ' + isSelected + ' value="Pick List">Pick List</option>';
        modelBodyHtml += '</select>';
        modelBodyHtml += '<label>Mode Of Entry</label>';
        modelBodyHtml += '</div>';
        modelBodyHtml += '<div class="col s12 m6">';
        modelBodyHtml += '<div class="switch" style="position: relative; top: 28px;">';
        modelBodyHtml += 'Is Hidden :';
        modelBodyHtml += '<label>';
        modelBodyHtml += 'No';
        var checked = phidden === "T" ? "checked" : "";
        modelBodyHtml += '<input ' + checked + ' id="ivParamIsHidden" type="checkbox">';
        modelBodyHtml += '<span class="lever"></span> Yes';
        modelBodyHtml += '</label>';
        modelBodyHtml += '</div>';
        modelBodyHtml += '</div>';
        modelBodyHtml += '</div>';
        modelBodyHtml += '<div class="row">';
        modelBodyHtml += '<div class="input-field col s6">';
        modelBodyHtml += '<input value="' + pexpr + '" class="themeMaterialInp" id="ivPropExp" type="text">';
        modelBodyHtml += '<label for="ivPropExp">Expression</label>';
        modelBodyHtml += '</div>';
        modelBodyHtml += '<div class="input-field col s6">';
        modelBodyHtml += '<input value="' + pvexpr + '" class="themeMaterialInp" id="ivPropVldExp" type="text">';
        modelBodyHtml += '<label for="ivPropVldExp">Validate Expression</label>';
        modelBodyHtml += '</div>';
        modelBodyHtml += '<p class="ivChckBx">';
        var checked = psuggest === "T" ? "checked" : "";
        modelBodyHtml += '<input ' + checked + ' type="checkbox" id="ivPropExpCheck" />';
        modelBodyHtml += '<label for="ivPropExpCheck">Calculate using this expression only if the value is empty.</label>';
        modelBodyHtml += '</p>';
        modelBodyHtml += '</div>';
        modelBodyHtml += '<div class="row">';
        modelBodyHtml += '<div class="input-field col s12">';
        modelBodyHtml += '<textarea id="ivPropSql" class="materialize-textarea">' + psql + '</textarea>';
        modelBodyHtml += '<label for="ivPropSql">SQL</label>';
        modelBodyHtml += '</div></div></div>';

    } else if (type === "font") {
        modelBodyHtml += '<div class="container">';
        modelBodyHtml += '<div class="row">';
        modelBodyHtml += '<div class="col s12 m8">';
        modelBodyHtml += '<label>Font Type</label>';
        modelBodyHtml += '<select id="fontSelect" class="browser-default" style="font-family: Arial, Arial, Helvetica, sans-serif;">';
        modelBodyHtml += '<option value="Arial" style="font-family: Arial, Arial, Helvetica, sans-serif;">Arial</option>';
        modelBodyHtml += '<option value="Arial Black" style="font-family: &quot;Arial Black&quot;, &quot;Arial Black&quot;, Gadget, sans-serif;">Arial Black</option>';
        modelBodyHtml += '<option value="Comic Sans MS" style="font-family: &quot;Comic Sans MS&quot;, &quot;Comic Sans MS&quot;, cursive;">Comic Sans MS</option>';
        modelBodyHtml += '<option value="Courier New" style="font-family: &quot;Courier New&quot;, &quot;Courier New&quot;, Courier, monospace;">Courier New</option>';
        modelBodyHtml += '<option value="Georgia" style="font-family: Georgia, Georgia, serif;">Georgia</option>';
        modelBodyHtml += '<option value="Impact" style="font-family: Impact, Charcoal, sans-serif;">Impact</option>';
        modelBodyHtml += '<option value="Lucida Console" style="font-family: &quot;Lucida Console&quot;, Monaco, monospace;">Lucida Console</option>';
        modelBodyHtml += '<option value="Lucida Sans Unicode" style="font-family: &quot;Lucida Sans Unicode&quot;, &quot;Lucida Grande&quot;, sans-serif;">Lucida Sans Unicode</option>';
        modelBodyHtml += '<option value="Palatino Linotype" style="font-family: &quot;Palatino Linotype&quot;, &quot;Book Antiqua&quot;, Palatino, serif;">Palatino Linotype</option>';
        modelBodyHtml += '<option value="Tahoma" style="font-family: Tahoma, Geneva, sans-serif;">Tahoma</option>';
        modelBodyHtml += '<option value="Times New Roman" style="font-family: &quot;Times New Roman&quot;, Times, serif;">Times New Roman</option>';
        modelBodyHtml += '<option value="Trebuchet MS" style="font-family: &quot;Trebuchet MS&quot;, Helvetica, sans-serif;">Trebuchet MS</option>';
        modelBodyHtml += '<option value="Verdana" style="font-family: Verdana, Geneva, sans-serif;">Verdana</option>';
        modelBodyHtml += '<option value="Gill Sans" style="font-family: &quot;Gill Sans&quot;, Geneva, sans-serif;">Gill Sans</option>';
        modelBodyHtml += '</select>';
        modelBodyHtml += '</div>';
        modelBodyHtml += '<div class="col s12 m2">';
        modelBodyHtml += '<label>Font Size</label>';
        modelBodyHtml += '<select id="fontSize" class="browser-default">';
        modelBodyHtml += '<option value="8" alt="11px" selected="">8pt</option>';
        modelBodyHtml += '<option value="10" alt="13px">10pt</option>';
        modelBodyHtml += '<option value="12" alt="16px">12pt</option>';
        modelBodyHtml += '<option value="14" alt="19px">14pt</option>';
        modelBodyHtml += '<option value="15" selected alt="21px">15pt</option>';
        modelBodyHtml += '<option value="17" alt="23px">17pt</option>';
        modelBodyHtml += '<option value="18" alt="24px">18pt</option>';
        modelBodyHtml += '<option value="23" alt="30.67">23pt</option>';
        modelBodyHtml += '<option value="24" alt="32px">24pt</option>';
        modelBodyHtml += '<option value="30" alt="40px">30pt</option>';
        modelBodyHtml += '</select>';
        modelBodyHtml += '</div>';
        modelBodyHtml += '<div class="col s12 m2">';
        modelBodyHtml += '<label style="display: block;margin-bottom: 4px;">Font Color</label>';
        modelBodyHtml += '<input type="text" id="custom" />';
        modelBodyHtml += '</div>';
        modelBodyHtml += '</div>';
        modelBodyHtml += '<div class="row">';
        modelBodyHtml += '<div class="col s12" id="fontExtraProps">';
        modelBodyHtml += '<p class="ivChckBx">';
        modelBodyHtml += '<input type="checkbox" id="fontBold" />';
        modelBodyHtml += '<label for="fontBold">Bold</label>';
        modelBodyHtml += '</p>';
        modelBodyHtml += '<p class="ivChckBx">';
        modelBodyHtml += '<input type="checkbox" id="fontItalic" />';
        modelBodyHtml += '<label for="fontItalic">Italic</label>';
        modelBodyHtml += '</p>';
        modelBodyHtml += '<p class="ivChckBx">';
        modelBodyHtml += '<input data-type="underline" class="fntTxtDc" type="checkbox" id="fontUdr" />';
        modelBodyHtml += '<label for="fontUdr">Underline </label>';
        modelBodyHtml += '</p>';
        modelBodyHtml += '<p class="ivChckBx">';
        modelBodyHtml += '<input data-type="line-through" class="fntTxtDc" type="checkbox" id="fontStr" />';
        modelBodyHtml += '<label for="fontStr">Strikeout</label>';
        modelBodyHtml += '</p>';
        modelBodyHtml += '</div>';
        modelBodyHtml += '</div>';
        modelBodyHtml += '<div class="row">';
        modelBodyHtml += '<div id="fontExapmle">';
        modelBodyHtml += '<span class="ex">Exapmle</span>';
        modelBodyHtml += '<span class="mainEx">Axpert</span>';
        modelBodyHtml += '</div>';
        modelBodyHtml += '</div>';
        modelBodyHtml += '</div>';
    }
    return modelBodyHtml;
}

/**
 * To assing events after the modal is created and opened
 * @author ManiKanta
 * @Date   2018-10-04T16:13:08+0530
 * @param  {String}                 options.idOfModel Id of the modal
 * @param  {String}                 options.type      Type of the modal
 * @return {}                                   
 */
function afterModalIsCreated({ idOfModel, type }) {
    if (type === "font") {
        $("#custom").spectrum({
            color: "#000",
            chooseText: "Apply",
            clickoutFiresChange: false,
            change: function(color) {
                $("#fontExapmle .mainEx").css('color', color.toHexString());
            },
            move: function(color) {
                $("#fontExapmle .mainEx").css('color', color.toHexString());
            },
            hide: function(color) {
                $("#fontExapmle .mainEx").css('color', color.toHexString());
            }
        });
        $("#fontSelect").on('change', function(e) {
            var val = $(this).val();
            var font = "";
            switch (val) {
                case "Arial":
                    font = "Arial, Arial, Helvetica, sans-serif;"
                    break;
                case "Arial Black":
                    font = "&quot;Arial Black&quot;, &quot;Arial Black&quot;, Gadget, sans-serif"
                    break;
                case "Comic Sans MS":
                    font = "&quot;Comic Sans MS&quot;, &quot;Comic Sans MS&quot;, cursive"
                    break;
                case "Courier New":
                    font = "&quot;Courier New&quot;, &quot;Courier New&quot;, Courier, monospace"
                    break;
                case "Georgia":
                    font = "Georgia, Georgia, serif"
                    break;
                case "Impact":
                    font = "Impact, Charcoal, sans-serif"
                    break;
                case "Lucida Console":
                    font = " &quot;Lucida Console&quot;, Monaco, monospace"
                    break;
                case "Lucida Sans Unicode":
                    font = "&quot;Palatino Linotype&quot;, &quot;Book Antiqua&quot;, Palatino, serif"
                    break;
                case "Tahoma":
                    font = "Tahoma, Geneva, sans-serif"
                    break;
                case "Times New Roman":
                    font = "&quot;Times New Roman&quot;, Times, serif"
                    break;
                case "Trebuchet MS":
                    font = "&quot;Trebuchet MS&quot;, Helvetica, sans-serif"
                    break;
                case "Verdana":
                    font = "Verdana, Geneva, sans-serif"
                    break;
                case "Gill Sans":
                    font = "font-family: &quot;Gill Sans&quot;, Geneva, sans-serif"
                    break;

                default:
                    font = "&quot;Arial Black&quot;, &quot;Arial Black&quot;, Gadget, sans-serif"
                    break;
            }
            font = font.replace(/&quot;/g, '"')

            $("#fontExapmle .mainEx").css('font-family', font);

        });

        $("#fontSize").on('change', function(e) {
            $("#fontExapmle .mainEx").css('font-size', $(this).val() + "px");
            /* Act on the event */
        });

        $("#fontExtraProps .ivChckBx input").on('change', function(e) {
            var elem = $(this);
            var type = elem.attr('id');
            switch (type) {
                case "fontBold":
                    if (elem.is(":checked"))
                        $("#fontExapmle .mainEx").css('font-weight', "bold");
                    else
                        $("#fontExapmle .mainEx").css('font-weight', "normal");
                    break;
                case "fontItalic":
                    if (elem.is(":checked"))
                        $("#fontExapmle .mainEx").css('font-style', "italic");
                    else
                        $("#fontExapmle .mainEx").css('font-style', "normal");
                    break;
                case "fontUdr":
                case "fontStr":
                    if ($("#fontExtraProps .fntTxtDc:checked").length === 2) {

                        $("#fontExapmle .mainEx").css('text-decoration', "underline line-through");
                    } else if ($("#fontExtraProps .fntTxtDc:checked").length === 0) {
                        $("#fontExapmle .mainEx").css('text-decoration', "none");
                    } else {

                        $("#fontExapmle .mainEx").css('text-decoration', $("#fontExtraProps .fntTxtDc:checked").data("type"));
                    }
                    break;
                default:
                    // statements_def
                    break;
            }

            // text-decoration: underline line-through;

        });
    }
}


// function applyTheExtraColProps(idOfModel, index, type) {

//     //need to validate here
//     if (!doTheIviewValidations(type, index))
//         return false;
//     if (type === "cols") {
//         var dataToadd = {};
//         dataToadd.name = $("#ivColPropName").val();
//         dataToadd.decimal = $("#ivColPropDcml").val() || "0";
//         dataToadd.caption = $("#ivColPropCptn").val();
//         dataToadd.width = $("#ivColPropClWdth").val();
//         dataToadd.dtype = $("#ivColPropDtTypeSel").val();
//         dataToadd.align = $("#ivColPropAlign").val();
//         dataToadd.norepeat = $("#ivColNRpt").is(":checked") ? "T" : "F";
//         dataToadd.hidden = $("#ivColIsHid").is(":checked") ? "T" : "F";
//         if (dataToadd.dtype === "Numeric") {
//             dataToadd.rtotal = $("#ivColRnTtl").is(":checked") ? "T" : "F";
//             dataToadd.dtotal = $("#ivColDsTtl").is(":checked") ? "T" : "F";
//             dataToadd.applycoma = $("#ivColAppCom").is(":checked") ? "T" : "F";
//             dataToadd.zerooff = $("#ivColZrOf").is(":checked") ? "T" : "F";
//         } else {
//             dataToadd.rtotal = "F";
//             dataToadd.dtotal = "F";
//             dataToadd.applycoma = "F";
//             dataToadd.zerooff = "F";
//         }


//         var hypName = $("#ivColHypName").val();
//         if (hypName !== "") {
//             //means hyperlink exists
//             var hypData = dataToadd.hyperLink = {};
//             hypData.source = dataToadd.name;
//             hypData.hname = $("#ivColHypName").val();
//             hypData.sname = $("#ivColPropTypeSel").val() + $("#ivColHypStName").data("key");
//             hypData.ssName = $("#ivColHypStName").val();
//             hypData.load = $("#ivColPropAction").val() === "edit" ? "T" : "F";
//             hypData.pop = $("#ivHypOpntp").is(":checked") ? "T" : "F";
//             hypData.refresh = $("#ivHyprpoc").is(":checked") ? "T" : "F";
//             var hypParamData = dataToadd.hyperLink.p = [];
//             $("#ivColHypPramWrapper .cloneParent").each(function(index, el) {
//                 var elem = $(this);
//                 var nameElem = elem.find('input[id^="ivColHyPName"]');
//                 var valElem = elem.find('input[id^="ivColHypVal"]');
//                 var name = nameElem.data("key");
//                 var value = valElem.data("key");
//                 if (name && value) {
//                     hypParamData.push({ n: name, v: value, nn: nameElem.val(), vv: valElem.val() });
//                 }
//             });
//         }
//         // var conditionalName = $("#ivColCf")
//         // if (true) {}
//         // need to handle conditional format
//         dataToadd.index = $("div[data-original=" + index + "]").index();
//         createUpdateIvJsonData("cols", dataToadd, index, false)
//     } else if (type.indexOf("font") === 0) {
//         var fontName = $("#fontSelect").val();
//         var fontSize = $("#fontSize").val();
//         var color = $("#custom").spectrum("get").toHexString();
//         var isBold = $("#fontBold").is(':checked') ? "True" : "False";
//         var isItalic = $("#fontItalic").is(':checked') ? "True" : "False";
//         var isUnderline = $("#fontUdr").is(':checked') ? "True" : "False";
//         var isStriked = $("#fontStr").is(':checked') ? "True" : "False";
//         if (type === "font-cf") {
//             isBold = isBold.substr(0, 1).toLowerCase();
//             isItalic = isItalic.substr(0, 1).toLowerCase();
//             isUnderline = isUnderline.substr(0, 1).toLowerCase();
//             isStriked = isStriked.substr(0, 1).toLowerCase();
//             $(index).data('value', fontName + "," + isBold + "," + isItalic + "," + isUnderline + "," + color + "," + isStriked + "," + fontSize);
//         }
//     } else if (type === "params") {

//         var tmpObjToUpdate = {};
//         tmpObjToUpdate.qryname = "Task1";
//         tmpObjToUpdate.name = $("#ivPropName").val();
//         tmpObjToUpdate.caption = $("#ivPropCaptn").val();
//         tmpObjToUpdate.datatype = $("#ivPropType").val();
//         tmpObjToUpdate.expr = $("#ivPropExp").val();
//         tmpObjToUpdate.suggest = $("#ivPropExpCheck").is(":checked") ? "T" : "F";
//         tmpObjToUpdate.vexpr = $("#ivPropVldExp").val();
//         tmpObjToUpdate.hidden = $("#ivParamIsHidden").is(":checked") ? "T" : "F";
//         tmpObjToUpdate.sql = $("#ivPropSql").val();
//         tmpObjToUpdate.decimals = $("#ivPropdcml").val() || 0;
//         tmpObjToUpdate.width = 200;
//         tmpObjToUpdate.value = $("#ivPropVal").val();
//         tmpObjToUpdate.moe = $("#ivParamsMoe").val();
//         tmpObjToUpdate.ordno = 1;

//         var parentElem = $("#ivParamMainWrapper .ivEchPramWrapper").eq(index);
//         parentElem.find('.pName').val(tmpObjToUpdate.name);
//         parentElem.find('.pVal').val(tmpObjToUpdate.value);
//         parentElem.find('select.pType').material_select("destroy");
//         parentElem.find('select.pType').val(tmpObjToUpdate.datatype).material_select();
//         Materialize.updateTextFields();
//         var parentElem = $("#ivParamMainWrapper .ivEchPramWrapper:eq(" + index + ")");
//         var presIndex = parentElem.data('tmpIndex');
//         var isFirstTime = presIndex === undefined;

//         var indexAdded = createUpdateIvJsonData("tparams", tmpObjToUpdate, presIndex, isFirstTime);
//         if (isFirstTime) {
//             parentElem.data('tmpIndex', indexAdded);
//         }

//         // tmpIndex

//     }

//     $('#' + idOfModel).modal('close');
// }
// 


function applyTheExtraColPropsForIview({ idOfModel, index, type }) {
    if (type.indexOf("font") === 0) {
        var fontName = $("#fontSelect").val();
        var fontSize = $("#fontSize").val();
        var color = $("#custom").spectrum("get").toHexString();
        var isBold = $("#fontBold").is(':checked') ? "True" : "False";
        var isItalic = $("#fontItalic").is(':checked') ? "True" : "False";
        var isUnderline = $("#fontUdr").is(':checked') ? "True" : "False";
        var isStriked = $("#fontStr").is(':checked') ? "True" : "False";
        if (type === "font-cf") {
            isBold = isBold.substr(0, 1).toLowerCase();
            isItalic = isItalic.substr(0, 1).toLowerCase();
            isUnderline = isUnderline.substr(0, 1).toLowerCase();
            isStriked = isStriked.substr(0, 1).toLowerCase();
            $(index).data('value', fontName + "," + isBold + "," + isItalic + "," + isUnderline + "," + color + "," + isStriked + "," + fontSize);
        }
    } else if (type === "params") {
        var tmpObjToUpdate = {};
        tmpObjToUpdate.qryname = "Task1";
        tmpObjToUpdate.name = $("#ivPropName").val();
        tmpObjToUpdate.caption = $("#ivPropCaptn").val();
        tmpObjToUpdate.datatype = $("#ivPropType").val();
        tmpObjToUpdate.expr = $("#ivPropExp").val();
        tmpObjToUpdate.suggest = $("#ivPropExpCheck").is(":checked") ? "T" : "F";
        tmpObjToUpdate.vexpr = $("#ivPropVldExp").val();
        tmpObjToUpdate.hidden = $("#ivParamIsHidden").is(":checked") ? "T" : "F";
        tmpObjToUpdate.sql = $("#ivPropSql").val();
        tmpObjToUpdate.decimals = $("#ivPropdcml").val() || 0;
        tmpObjToUpdate.width = 200;
        tmpObjToUpdate.value = $("#ivPropVal").val();
        tmpObjToUpdate.moe = $("#ivParamsMoe").val();
        tmpObjToUpdate.ordno = 1;

        var parentElem = $("#ivParamMainWrapper .ivEchPramWrapper").eq(index);
        parentElem.find('.pName').val(tmpObjToUpdate.name);
        parentElem.find('.pVal').val(tmpObjToUpdate.value);
        parentElem.find('select.pType').material_select("destroy");
        parentElem.find('select.pType').val(tmpObjToUpdate.datatype).material_select();
        Materialize.updateTextFields();
        var parentElem = $("#ivParamMainWrapper .ivEchPramWrapper:eq(" + index + ")");
        var presIndex = parentElem.data('tmpIndex');
        var isFirstTime = presIndex === undefined;

        var indexAdded = createUpdateIvJsonData("tparams", tmpObjToUpdate, presIndex, isFirstTime);
        if (isFirstTime) {
            parentElem.data('tmpIndex', indexAdded);
        }
    }
}


function doTheIviewValidations(key, index) {
    if (key === "cols") {
        var decimalVal = $("#ivColPropDcml").val();
        if (!isValidNumber(decimalVal)) {
            $("#ivColPropDcml").focus();
            showAlertDialog("warning", widgetMessages.invalidDecimalVal);
            return false;
        }
        var colWidthVal = $("#ivColPropClWdth").val();
        if (!isValidNumber(colWidthVal)) {
            $("#ivColPropClWdth").focus();
            showAlertDialog("warning", widgetMessages.invalidColWidth);
            return false;
        }
        if ($("#ivColPropCptn").val() === "") {
            showAlertDialog("warning", widgetMessages.noCaption);
            $("#ivColPropCptn").focus();
            return false;
        }
        var enteredHypVal = $("#ivColHypName").val();
        if (enteredHypVal !== "" || $("a[href='#ivColLink']").hasClass("active")) {
            if (enteredHypVal === "" || !testRegex("validNameWithoutSpace", enteredHypVal)) {
                showAlertDialog("warning", widgetMessages.invalidName);
                $("#ivColHypName").focus();
                return false;
            }

            //for hyperlink name duplicate check\
            index = index || "";

            var colName = $(".ciColWrapper[data-original=" + index + "]").text();
            if (presWizardData.extraData.hyperlinks) {
                index = presWizardData.extraData.hyperlinks[colName];
                if (index !== undefined) {
                    index = parseInt(index)
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

            //for hyperlink multiple param should not be same
            var hypNames = [];
            var errorMsg = false;
            $("#ivColHypPramWrapper .cloneParent [id^='ivColHyPName']").each(function (index, el) {
                var elem = $(this);
                var param = elem.data('key');
                if (param) {
                    if ($.inArray(param, hypNames) !== -1) {
                        errorMsg = widgetMessages.multipleHypParams;
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
                showAlertDialog("warning", widgetMessages.noTypeSelected);
                $("#ivColPropTypeSel").parent().find('input').click();
                return false;
            }
            if (!$("#ivColHypStName").data("key") || $("#ivColHypStName").val() === "") {
                showAlertDialog("warning", widgetMessages.validStructureName);
                $("#ivColHypStName").focus();
                return false;
            }
            //need to validate hyperlink Params - TO_DO -
        }
    } else if (key === "params") {

        var decimalVal = $("#ivPropdcml").val();
        if (!isValidNumber(decimalVal)) {
            $("#ivPropdcml").focus();
            showAlertDialog("warning", widgetMessages.invalidDecimalVal);
            return false;
        }
        var propName = $("#ivPropName").val();
        var exception = $("#ivParamMainWrapper .ivEchPramWrapper").eq(index).find('.pName');
        var status = true;
        $("#ivParamMainWrapper .ivEchPramWrapper .pName").not(exception).each(function (index, el) {
            if (propName === $(this).val()) {
                showAlertDialog("warning", widgetMessages.paramNameExists);
                $("#ivPropName").focus();
                status = false;
                return false;
            }

        });
        if (!status) {
            return status;
        }
        if (propName === "" || !testRegex("validNameWithoutSpace", $("#ivPropName").val())) {
            showAlertDialog("warning", widgetMessages.invalidName);
            $("#ivPropName").focus();
            return false;
        }
        if ($("#ivPropCaptn").val() === "") {
            showAlertDialog("warning", widgetMessages.noCaption);
            $("#ivPropCaptn").focus();
            return false;
        }
        if ($("#ivParamsMoe").val() !== "Accept" && $("#ivPropSql").val() === "") {
            showAlertDialog("warning", widgetMessages.noSQl);
            $("#ivParamsMoe").focus();
            return false;
        }
    }
    return true;
}






function getExampleData(type, subType) {
    var exmHtml = "";
    if (type === "kpi") {
        exmHtml += "<h3>Example 1</h3>";
        exmHtml += "<a class='chrtKpiEXAnchr hoverFocusThemeColor' href='javascript:void(0)'><p class='chrtKpiEX'>" + chartExamples.kpi + "</p></a>";
        exmHtml += "<h3>Example 2</h3>";
        exmHtml += "<a class='chrtKpiEXAnchr hoverFocusThemeColor' href='javascript:void(0)'><p class='chrtKpiEX'>" + chartExamples.kpi1 + "</p></a>";
        exmHtml += "<h3>Example 3</h3>";
        exmHtml += "<a class='chrtKpiEXAnchr hoverFocusThemeColor' href='javascript:void(0)'><p class='chrtKpiEX'>" + chartExamples.table + "</p></a>";
        exmHtml += "<h3>Example 4</h3>";
        exmHtml += "<a class='chrtKpiEXAnchr hoverFocusThemeColor' href='javascript:void(0)'><p class='chrtKpiEX'>" + chartExamples.kpiLink + "</p></a>";
    } else if (type === "chart") {
        var message = chartExamples[subType];
        var linkEx = (subType === "pie" || subType === "semi-donut" || subType === "donut") ? chartExamples.pieLink : chartExamples.chartLink;
        exmHtml += "<h3>Example 1</h3>";
        exmHtml += "<a class='chrtKpiEXAnchr hoverFocusThemeColor' href='javascript:void(0)'><p class='chrtKpiEX'>" + message.replace("{{link}}", "") + "</p></a>";
        exmHtml += "<h3>Example 2</h3>";
        exmHtml += "<a class='chrtKpiEXAnchr hoverFocusThemeColor' href='javascript:void(0)'><p class='chrtKpiEX'>" + message.replace("{{link}}", linkEx) + "</p></a>";
    } else if (type === "iview") {
        exmHtml += "<a class='chrtKpiEXAnchr hoverFocusThemeColor' href='javascript:void(0)'><p class='chrtKpiEX'>" + chartExamples.iview + "</p></a>";
    }
    return exmHtml;
}

function closeProprtySht(task, elem) {
    if ($("#propertySheet").hasClass('scale-out'))
        return true;
    if (task != "delete") {
        if (!validateProprtySht(task, elem))
            return false;
    }
    clearPropertySheet();


    var target = $("#propertySheet").data('target');

    $("#propertySheet").data('target', "").removeClass('scale-in').addClass('scale-out');
    setTimeout(function () {
        $("#propertySheet").addClass('hide');
    }, 50)
    $(document).off('blur.prpShtTargetErrorValidate');
    return true;
    // need to clear all
}

function validateProprtySht(task, elem) {
    var isAutoSave = $("#prpShtAutoSave").is(':checked');
    var validpropmsg = eval(callParent('lcm[121]'));
    if (!jQuery.isEmptyObject(updateObj)) {
        if (isAutoSave || task == "manualSave") {
            if (!validateBeforeUpdatePrpSht()) return;
            var wId = $("#propertySheet").data("target").substr(8);
            updateTmpObjBeforeSave("wid", "widget_id", wId);
            ajaxCallObj.addDetails(updateObj, "update");
        } else {
            confirmBox = $.confirm({
                theme: 'modern',
                title: eval(callParent('lcm[191]')),
                content: validpropmsg,
                columnClass: 'col s6 offset-s3',
                escapeKey: 'buttonB',
                onContentReady: function () {
                    disableBackDrop('bind');
                },
                buttons: {
                    buttonA: {
                        text: eval(callParent('lcm[191]')),
                        btnClass: 'btn btn-primary',
                        action: function () {
                            revertThePropSheet();


                            updateObj = {};
                            if (task === "onWdgtClick" || task === "onPageClick") {
                                elem.click();
                            } else {
                                closeProprtySht()
                            }
                        }
                    },
                    buttonB: {
                        text: eval(callParent('lcm[192]')),
                        btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                        action: function () {
                            disableBackDrop('destroy');
                            confirmBox = "";
                        }
                    },
                }
            });
            return false;
        }
    } else if (task === "onPageClick") {
        $(elem).addClass('manualClick').click();
    }
    return true;
}


function validateBeforeUpdatePrpSht() {
    var titleVal = $("#prpShtTitle").val();

    if (titleVal === "") {
        showAlertDialog("warning", widgetMessages.noTitle)
        return false;
    }
    // not validating for validname as discussed with satish user can anter any character unicode special chars as well @manikanta
    // else if (!testRegex("validName", titleVal)) {
    //     showAlertDialog("warning", widgetMessages.invalidName)
    //     return false;
    // }
    return true;
}

function openProprtySht(type, elemId, calledFrom) {
    // addInitialDataToJson
    $("#" + elemId).addClass('selectedForPropSht');
    $(".commonCloseOnOpen").addClass('notSearchable').hide();


    //positioning the propertySheet
    var offsetPos = $("#" + elemId).offset();
    // var propShtWidth = parseInt($("#propertySheet").outerWidth());
    var propShtWidth = 280;
    // var propShtHeight = parseInt($("#propertySheet").outerHeight());
    var propShtHeight = parseInt($(window).height() * 0.7);
    var elemWidth = parseInt($("#" + elemId).css('width'));
    var elemHeight = parseInt($("#" + elemId).css('width'));
    var leftToAdd, topToAdd;
    var bottomToAdd = "inherit";
    var scrollTop = $("#widgetPanelWrapper").scrollTop()
    if ((offsetPos.left + elemWidth + propShtWidth) > $(window).width()) {
        leftToAdd = offsetPos.left - propShtWidth;
    } else {
        leftToAdd = offsetPos.left + elemWidth;
    }
    if ((offsetPos.top + propShtHeight) > $(window).height()) {
        topToAdd = "inherit"; //(offsetPos.top - propShtHeight) + elemHeight;
        bottomToAdd = "0px";
    } else {
        topToAdd = offsetPos.top + 'px';
    }
    // else if () {

    // }

    // if()
    $("#propertySheet").css({
        top: topToAdd,
        left: leftToAdd + "px",
        bottom: bottomToAdd
    }).data('target', elemId).removeClass('hide');

    setTimeout(function () {
        $("#propertySheet").removeClass('scale-out').addClass('scale-in');
    }, 50)

}

function ChangePropertySheet(task) {
    if (task == "kpiWidgetAdded" || task == "kpiWidgetClicked") {
        if (task == "kpiWidgetAdded") {
            $("#prpShtTargetRgn").prop('checked', false).change();
        }
        $("#bdBgClrTr,#bdTxtClrTr").addClass('notSearchable').hide();
        $("#gradientPickerWrapper,#prpShtTitlePickerTr").removeClass('notSearchable').addClass('kpiWidgetIcon').show();
    }
}


function clearPropertySheet() {
    //clear all the values
    updateObj = {};
    $("#propertySearchFld").val("").keyup();
    $('.customFldError').removeClass('customFldError');
    $("#prpShtUpdateInfo").show();
    $(".chartColorPalletWrapper").hide();
    $("#chartColorPicker button").data('colorcode', 'pallet1')
    $("#ifCustomColorCodes").val("");
    $("#prpShtComponent,#prpShtModifiedBy,#prpShtModifiedOn").text("");
    $("#prpShtTarget,#prpShtTxtBx,#prpShtRoles,#prpShtImgWrapper .file-path").val("");
    $("#widgetPanelWrapper .widgetWrapper.selectedForPropSht").removeClass('selectedForPropSht');
    $("#propertySheet .notSearchable").removeClass('notSearchable').show();
    $("#propertySheet .prpShtAuthRelated,.prpSteNonIvRelated").removeClass('notSearchable').show();
    $("#propertySheet .ivDisabledFld").prop('disabled', false);
    $("#propertySheet .prpSteIvRelated").addClass('notSearchable').hide();
    $("#gradientPicker").attr('class', 'colorMe blue center-align');
    $("#gradientPicker a").data('color', 'blue').text("Blue");
    $(".gradientPalletWrapper").hide();
    $(".gradientSelected").remove();
}

function createCustomTxtBx(elem) {
    elem = $(elem);
    var elemOfset = elem.offset();
    var elemVal = widgetTableData["w" + elem.data('id')].sql;
    // var encodedVal = htmlEntity("encode", elemVal);
    $("#customTxtAreaWrapper").css({
        top: elemOfset.top + "px",
        left: elemOfset.left + "px"
    });
    $("#customTxtAreaWrapperBg").show();
    setTimeout(function () {
        $("#customTxtAreaFooter button.save").attr('onclick', 'closeCustomTxtBx("' + elem.attr("id") + '","save")');
        $("#customTxtAreaFooter button.cancel").attr('onclick', 'closeCustomTxtBx("' + elem.attr("id") + '","cancel")');

        if (!updateSqlCM) {
            updateSqlCM = CodeMirror.fromTextArea($("#customTxtAreaWrapper textarea")[0], {
                mode: 'text/x-sql',
                smartIndent: true,
                lineNumbers: true,
                matchBrackets: true,
                autofocus: true,
                extraKeys: {
                    "Ctrl-Space": "autocomplete",
                    "Tab": false, // Let focus go to next control
                    "Shift-Tab": false // Let focus go to previous control
                },
                value: document.documentElement.innerHTML,
                hintOptions: {
                    tables: codeMirrorHintObj
                }
            });
            updateSqlCM.on("change", function (doc, changeObj) {
                $("#customTxtAreaWrapper textarea").addClass('valChanged');
            });
            if (elemVal)
                updateSqlCM.getDoc().setValue(elemVal);
        } else {
            if (elemVal)
                updateSqlCM.getDoc().setValue(elemVal);
        }
        $("#customTxtAreaWrapper textarea").removeClass('valChanged');
        $("#customTxtAreaWrapper").addClass('centerMe');
        $("#customTxtAreaFooter").slideDown();
    }, 50)

    $(document).on('keyup.closeCustomTxtBx', function (event) {
        // var txtFldval = $("#customTxtAreaWrapper textarea").val();
        // var targetParId = elem.parents("#propertySheet").data('target');
        // var keyWord = elem.data('key');
        // $("#customTxtAreaWrapper textarea").addClass('valChanged');
        if (event.keyCode == 27) {
            event.preventDefault();
            if (confirmBox && confirmBox.isOpen()) {
                confirmBox.close();
                confirmBox = "";
            } else
                closeCustomTxtBx("prpShtTxtBx", "cancel")
        }
    });

}



function closeCustomTxtBx(elem, task) {

    if (task == "cancel") {
        if ($("#customTxtAreaWrapper textarea").hasClass('valChanged')) {

            confirmBox = $.confirm({
                theme: 'modern',
                title: eval(callParent('lcm[191]')),
                escapeKey: 'buttonB',
                onContentReady: function () {
                    disableBackDrop('bind');
                },
                content: eval(callParent('lcm[121]')),
                columnClass: 'col s6 offset-s3',
                buttons: {
                    buttonA: {
                        text: eval(callParent('lcm[191]')),
                        btnClass: 'btn btn-primary',
                        action: function () {
                            $("#customTxtAreaWrapper textarea").removeClass('valChanged')
                            closeCustomTxtBx(elem, "PermnantCancel");
                        }
                    },
                    buttonB: {
                        text: eval(callParent('lcm[192]')),
                        btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                        action: function () {
                            disableBackDrop('destroy');
                            confirmBox = "";
                        }
                    },
                }
            });

            return;
        } else {
            task = "PermnantCancel";
        }
    }
    elem = $("#" + elem);
    var keyWord = elem.data('key');
    var txtFldval = updateSqlCM.getDoc().getValue();
    if (task == "save" && keyWord == 'sqlDt') {
        if (txtFldval === "") {
            showAlertDialog("warning", widgetMessages.noSQl)
        } else {
            ajaxCallObj.isValidQuery(txtFldval, "update");
        }
        return;
    }


    $(document).off('keyup.closeCustomTxtBx');
    $("#customTxtAreaWrapperBg").hide();
    $("#customTxtAreaWrapper").removeClass('centerMe').removeAttr('style');
    var targetParId = elem.parents("#propertySheet").data('target');
    if (task != "PermnantCancel") {
        confirmBox = "";
        var keyWord = elem.data('key');
        elem.val(txtFldval);
        updateSqlCM.getDoc().setValue(" ");
        $("#customTxtAreaFooter").hide();
    } else {
        // oldVal = htmlEntity("decode", oldVal);
        // elem.val(oldVal);
        // if ($("#prpShtTxtBx").parent().prev().text().toLowerCase() == "html")
        //     $("#" + targetParId + " .card-content .htmlContentCard").html(oldVal);
        // else
        //     $("#" + targetParId + " .card-content p").text(oldVal);    
    }
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
        updateTmpObjBeforeSave("attr", "kpiColor", color);
        $("#" + targetId).find('.kpiCard').attr('class', 'kpiCard card colorMe ' + color);
        $("#" + targetId).find('.colorMe').data('kpicolor', color);


    }
}


function chartColorChanger(task, elem, customColorCodes, isChange) {
    // yyyyyy
    // customChartColors
    // var presColors = customChartColors[colorKey] || customChartColors["basic"];
    // var checkHtml = '<span class="cccSelected selected icon-check"></span>';
    // if (task === "colorClick") {
    //     $(".chartColorPalletWrapper").toggle('medium');
    //     var colorCode = $("#chartColorPicker button").data('colorcode') || "pallet1";

    //     if (colorCode === "custom") {
    //         $("#customChartColor").click().change();
    //         customColorCodes = $("#ifCustomColorCodes").val();
    //     } else {
    //         $("#chartDefaultColors .cccSelected").remove();
    //         var elem = $("button[data-colorcode='" + colorCode + "']");
    //         $(checkHtml).insertBefore(elem);
    //         $("#defaultChartColor").click().change();
    //         // $("#ifCustomColorCodes").val("");
    //     }



    // } else 
    if (task === "colorPick") {
        elem = $(elem);
        var colorCode = elem.val();
        var colors = customChartColors[colorCode];
        if (colorCode === "custom") {
            $("#colorSelector .palletSelectFld").removeClass('nonCustom');
            $("#colorSelector .palletMinatureWrapper").hide();
            if ($("#chartCustomColors input").length === 0) {
                var inpHtml = "";
                var oldClrs = $("#ifCustomColorCodes").val();
                if (oldClrs === "") {
                    var colrsArr = customChartColors.pallet1;
                } else {
                    var colrsArr = oldClrs.split(",");
                }

                var colsArrLth = colrsArr.length;
                for (var i = 0; i < chartColorCount; i++) {
                    var presColor = colrsArr[i];
                    if (!presColor) {
                        //looping if length is less
                        presColor = colrsArr[i - (Math.floor(i / colsArrLth) * (colsArrLth))];

                    }
                    inpHtml += "<input type='color' class='customSColorPic' value='" + presColor + "' />"
                }
                $("#chartCustomColors").html(inpHtml);
                $('.customSColorPic').spectrum({
                    preferredFormat: "hex",
                    showInput: true,
                    change: function (color) {
                        var finalColors = "";
                        $("#chartCustomColors input").each(function (index, el) {
                            finalColors += $(this).val() + ",";
                        });
                        finalColors = finalColors.slice(0, -1);
                        $("#ifCustomColorCodes").val(finalColors);
                        chnageKpiChartView("changeColors", "", "chart", { isCustom: true });
                        updateTmpObjBeforeSave("attr", "cccv", finalColors);
                    },
                });
            }
            $("#chartCustomColors").show();
            if (!$("#chartColorChangerSlctBx").data('isManualChange')) {
                chnageKpiChartView("changeColors", "", "chart", { isCustom: true });
            }
            $("#chartColorChangerSlctBx").data('isManualChange', false);
        } else {
            $("#colorSelector .palletSelectFld").addClass('nonCustom')

            $("#chartCustomColors").hide();
            var colors = customChartColors[colorCode];
            $("#colorSelector .palletMinatureWrapper").attr('class', colorCode + 'mini palletMinatureWrapper').show();
            if (!$("#chartColorChangerSlctBx").data('isManualChange')) {
                chnageKpiChartView("changeColors", "", "chart", { keyCode: colorCode });
            }
            $("#chartColorChangerSlctBx").data('isManualChange', false);
        }

        // chnageKpiChartView("changeColors", "", "chart", { keyCode: colorCode });
    } else if (task === "colorSet") {
        //in this elem will be color code
        if (elem === "custom") {
            // $("#customChartColor").click();
            $("#ifCustomColorCodes").val(customColorCodes);
            $("#chartCustomColors").html("");
        }
        isChange = isChange === undefined;
        $("#chartColorChangerSlctBx").val(elem).data('isManualChange', isChange).change();
        $("#chartColorChangerSlctBx").material_select("destroy");
        $("#chartColorChangerSlctBx").material_select();

    }
}

function createCustomColorPicker() {

}

function createConfirmBox(task, msg, widgetId) {
    //need to make this function h=generic
    if (deleteCnfrmBx && deleteCnfrmBx.isOpen()) {
        // deleteCnfrmBx.close();
        return false;
    }

    var title = "Delete";
    if (task === "onWizardClose") {
        title = "Confirm"
    }

    deleteCnfrmBx = $.confirm({
        theme: 'modern',
        title: title,
        onContentReady: function () {
            disableBackDrop('bind');
        },
        backgroundDismiss: 'false',
        escapeKey: 'buttonB',
        content: msg,
        columnClass: 'col s6 offset-s3',
        buttons: {
            buttonA: {
                text: eval(callParent('lcm[164]')),
                btnClass: 'btn btn-primary',
                action: function () {
                    if (task === "onWizardClose") {
                        $("#wizardModal .modal-footer .cancelButton").click();
                        return;
                    }

                    closeProprtySht("delete");
                    var presData = widgetTableData["w" + widgetId];
                    if (presData.type === "iview") {
                        if (presData) {
                            presData = JSON.parse(presData.attr);
                        }
                        var jsonObj = {};
                        jsonObj.iviews = {
                            "actmode": "delete",
                            "ivname": presData.ivName,
                        }
                        ajaxCallObj.crudIview(jsonObj, widgetId);
                    } else {
                        ajaxCallObj.deleteWidget(widgetId);
                    }
                    deleteCnfrmBx = "";
                }
            },
            buttonB: {
                text: eval(callParent('lcm[192]')),
                btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                action: function () {
                    disableBackDrop('destroy');
                    tabFocusEventHandler({ task: 'bind', parentId: "wizardModal", loopInsideParent: true });
                    deleteCnfrmBx = "";
                }
            },
        }
    });
}



//get tstructs
function AjaxCallObj() {
    var that = this;
    this.getTstructs = function (type) {

        var settings = primaryApiSettings();
        settings.url = apiBase + "getTstructs";
        settings.data.dname = 'dc1';


        // var settings = {
        //     "async": true,
        //     "crossDomain": true,
        //     "url": apiBase + "getTstructs",
        //     "method": "POST",
        //     "headers": {
        //         "content-type": "application/x-www-form-urlencoded"
        //     },
        //     "data": {
        //         "session_id": sId,
        //         "utl": utls,
        //         "dname": 'dc1'
        //     }
        // }

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
                                                // $('#widgetTableRemData').show();
                                                if (tstructTableCols[transId + dcName]) {
                                                    showTheTableRemainigData(transId + dcName);
                                                    // createSqlForTableData();
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
                                showAlertDialog("warning", 1027, "client");
                            }
                        },
                        minLength: 0, // The minimum length of the input for the autocomplete to start. Default: 1.
                    });

                }
            } else {
                filterErrorMessageAndShow(response);
            }
            // console.log(response);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            onAjaxFailure();
        });
    }

    this.getTstructTables = function (tstruct) {
        var settings = primaryApiSettings();
        settings.url = apiBase + "getTtable";
        settings.data.tstruct = tstruct;

        // var settings = {
        //     "async": true,
        //     "crossDomain": true,
        //     "url": apiBase + "getTtable",
        //     "method": "POST",
        //     "headers": {
        //         "content-type": "application/x-www-form-urlencoded"
        //     },
        //     "data": {
        //         "session_id": sId,
        //         "utl": utls,
        //         "tstruct": tstruct
        //     }
        // }

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
                                // ajaxCallObj.getTableCols(transId, dcNumSelected);

                                if (tstructTableCols[transId + dcName]) {
                                    showTheTableRemainigData(transId + dcName);
                                    // createSqlForTableData();
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
                filterErrorMessageAndShow(response);
            }
            // console.log(response);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            onAjaxFailure();
        });
    }

    this.getTableCols = function (transId, dcName) {
        dcName = dcName.split("__~__")[0];
        // var dcName = dcNames[transId][dcNum];

        var settings = primaryApiSettings();
        settings.url = apiBase + "getTableCols";
        settings.data.tstruct = transId;
        settings.data.tablename = dcName;

        // var settings = {
        //     "async": true,
        //     "crossDomain": true,
        //     "url": apiBase + "getTableCols",
        //     "method": "POST",
        //     "headers": {
        //         "content-type": "application/x-www-form-urlencoded"
        //     },
        //     "data": {
        //         "session_id": sId,
        //         "utl": utls,
        //         "tstruct": transId,
        //         "tablename": dcName
        //     }
        // }

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
                    // createSqlForTableData();
                }
            } else {
                filterErrorMessageAndShow(response);
            }
            // console.log(response);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            onAjaxFailure();
        });
    }

    this.validateIvName = function (iviewName) {
        if (iviewName === "") {
            return false;
        }
        if (!testRegex("noSpecialCharactersAndNotStartingWithNumber", iviewName)) {
            $("#iviewName").focus();
            showAlertDialog("warning", widgetMessages.invalidIviewName);
            return false;
        }
        callParentNew("loadFrame()","function");// parent.loadFrame();
       
        // var dcName = dcNames[transId][dcNum];

        var settings = primaryApiSettings();
        settings.url = apiBase + "iviewexists";
        settings.data.iviewname = iviewName;

        $.ajax(settings).done(function (response) {
            callParentNew("closeFrame()","function");
           // parent.closeFrame();
            if (response.status == true) {
                if (response.data) {
                    $("#iviewName").focus();
                    showAlertDialog("warning", widgetMessages.iviewNameAlreadyExists);
                }
                // $("#iviewName").removeClass('notValidated');
                presWizardData.iviews.ivname = iviewName;
            } else {
                $("#iviewName").removeClass('notValidated');
                presWizardData.iviews.ivname = iviewName;
                filterErrorMessageAndShow(response);
                // showAlertDialog("warning", response.errMsg);
            }
            // console.log(response);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            onAjaxFailure();
        });
    }


    this.getAllGroups = function () {

        var settings = primaryApiSettings();
        settings.url = apiBase + "getWidgetGroup";

        // var settings = {
        //     "async": true,
        //     "crossDomain": true,
        //     "url": apiBase + "getWidgetGroup",
        //     "method": "POST",
        //     "headers": {
        //         "content-type": "application/x-www-form-urlencoded"
        //     },
        //     "data": {
        //         "session_id": sId,
        //         "utl": utls
        //     }
        // }

        $.ajax(settings).done(function (response) {
            if (response.status == true) {
                var data = response.data;
                var tmpObj = {};
                groups = [];
                // if (data) {
                //     groups = data;
                // }
                for (var i = 0; i < data.length; i++) {
                    var presGroup = data[i][0];
                    if (presGroup) {
                        tmpObj[presGroup] = presGroup;
                        groups.push(presGroup);
                    }
                }
                $("#widgetGroupsInp").autocomplete({
                    isKeyImage: false,
                    data: tmpObj,
                    limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
                    onAutocomplete: function (val) {
                        // isNewGroupAdded = false;
                        // Callback function when value is autcompleted.
                        // elem
                        // selectedCols[elem.data('index')] = val;
                        // createSqlForTableData();
                    },
                    minLength: 0, // The minimum length of the input for the autocomplete to start. Default: 1.
                });
            } else {
                filterErrorMessageAndShow(response);
            }
            // console.log(response);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            onAjaxFailure();
        });
    }
    this.getAllResponsibilities = function () {

        var settings = primaryApiSettings();
        settings.url = apiBase + "getallresponsibilities";

        // var settings = {
        //     "async": true,
        //     "crossDomain": true,
        //     "url": apiBase + "getallresponsibilities",
        //     "method": "POST",
        //     "headers": {
        //         "content-type": "application/x-www-form-urlencoded"
        //     },
        //     "data": {
        //         "session_id": sId,
        //         "utl": utls
        //     }
        // }

        $.ajax(settings).done(function (response) {
            if (response.status == true) {
                var data = response.data;
                if (data) {
                    var cachRoles = widgetTableData.allRoles = [];
                    var optionsHtml = "";
                    var dataLength = data.length;
                    for (var i = 0; i < dataLength; i++) {
                        var presRole = data[i];
                        optionsHtml += "<option value='" + presRole + "'>" + presRole + "</option>";
                        cachRoles.push(presRole);
                    }
                    $("#multiselect").html(optionsHtml);
                    $('#multiselect').multiselect();
                }
            } else {
                filterErrorMessageAndShow(response);
            }
            // console.log(response);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            onAjaxFailure();
        });
    }
    this.isValidQuery = function (sql, calledFrom) {
        var isMetadata = widgetType === "iview";
        sql = validateTheSql(sql);

        var settings = primaryApiSettings();
        settings.url = apiBase + "getQuery";
        settings.data.q = sql;
        settings.data.calledFrom = "validate";
        settings.data.isMetadata = isMetadata;

        // var settings = {
        //     "async": true,
        //     "crossDomain": true,
        //     "url": apiBase + "getQuery",
        //     "method": "POST",
        //     "headers": {
        //         "content-type": "application/x-www-form-urlencoded"
        //     },
        //     "data": {
        //         "session_id": sId,
        //         "utl": utls,
        //         "q": sql,
        //         "calledFrom": "validate",
        //         "isMetadata": isMetadata
        //     }
        // }

        $.ajax(settings).done(function (response) {
            if (response.status == true) {
                if (calledFrom === "update") {
                    var widgetId = $("#propertySheet").data("target").substr(8);
                    var changedQry = updateSqlCM.getDoc().getValue();
                    updateTmpObjBeforeSave("sql", "sql", changedQry)
                    $("#prpShtTxtBx").val(changedQry);
                    $("#customTxtAreaWrapperBg").hide();
                    $("#customTxtAreaWrapper").removeClass('centerMe').removeAttr('style');
                } else {
                    // $("#isValidSQl").val("true").data('err', "");
                    // if type === "iview" then need to validate for some parameters as per Our rules

                    if ($("#wizardNextbtn").hasClass('iAmClicked')) {
                        $("#wizardNextbtn").removeClass('iAmClicked').html("Next &gt;");
                        if (widgetType === "iview") {
                            var dataTosend = response;
                            dataTosend._sql = sql;
                            var paramResult = validateSqlDataForParams(dataTosend);
                            if (createIvColHtml(response.metaData, calledFrom) === false)
                                return;
                            presWizardData.iviews.tasks[0].txt[0].v = sql;

                            if (!paramResult) {
                                targetElemClicked = "";
                                if (!$("#wizardHeader .step[data-target='queryData']").hasClass('active'))
                                    $("#wizardHeader .step[data-target='queryData'] a").click();
                                showAlertDialog("warning", widgetMessages.invalidIviewParams);
                                return false;
                            } else {
                                presWizardData.extraData.metaData = response.metaData;
                                addIvParamsDynamically(paramResult)
                            }
                        }
                        $("#wizardNextbtn").addClass("validated")
                        if (!targetElemClicked) {
                            $("#wizardNextbtn").click();

                        }

                    }
                    if (targetElemClicked && targetElemClicked !== "") {
                        targetElemClicked.click();
                        targetElemClicked = "";
                    }


                }
                // if (widgetType === "iview") {

                // }

            } else {
                if (calledFrom !== "update") {
                    if ($("#wizardNextbtn").hasClass('iAmClicked'))
                        $("#wizardNextbtn").removeClass('iAmClicked').html("Next &gt;");
                    // $("#isValidSQl").val("false").data('err', response.errMsg);
                }
                targetElemClicked = "";
                if (!$("#wizardHeader .step[data-target='queryData']").hasClass('active'))
                    $("#wizardHeader .step[data-target='queryData'] a").click();
                filterErrorMessageAndShow(response);
            }
            // console.log(response);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            $("#wizardNextbtn").removeClass('iAmClicked').html("Next &gt;");
            onAjaxFailure();
        });
    }

    this.getHintsForCodeMirror = function () {

        var settings = primaryApiSettings();
        settings.url = apiBase + "getTstructs";

        // var settings = {
        //     "async": true,
        //     "crossDomain": true,
        //     "url": apiBase + "getTstructs",
        //     "method": "POST",
        //     "headers": {
        //         "content-type": "application/x-www-form-urlencoded"
        //     },
        //     "data": {
        //         "session_id": sId,
        //         "utl": utls
        //     }
        // }

        $.ajax(settings).done(function (response) {
            if (response.status == true) {
                var data = response.data;
                if (data) {
                    $.each(data, function (index, value) {
                        if (codeMirrorHintObj[value[0]]) { codeMirrorHintObj[value[0]].push(value[1]); } else { codeMirrorHintObj[value[0]] = [value[1]] }
                        callParentNew("mainSQLhintObj=", codeMirrorHintObj);
                    });

                }
            } else {
                filterErrorMessageAndShow(response);
            }
            // console.log(response);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            onAjaxFailure();
        });
    }
    this.addDetails = function (jsonString, type) {
        if (!that.isPageValid()) {
            redirectPage(true);
            return;
        }
        var settings = primaryApiSettings();
        settings.url = apiBase + "addWidget";
        settings.data.type = type;

        // adding exposing api data 
        if (jsonString && jsonString.attrs) {
            let { exposeAPI } = jsonString.attrs
            if (exposeAPI === true)
                settings.data.isAPI = "Y";
            else if (exposeAPI === false)
                settings.data.isAPI = "N";
        }
        if (type === "insert") {
            settings.data.isAPI = "N";
        }

        settings.data.json = JSON.stringify(jsonString);

        //need to clear cache for homebuilder and widgerbuilder widgets if SQL is updating
        if (type === "update" && jsonString.sql) {
            let keysToClear = [];
            let cacheKey = getTheCacheKey({ widgetId: jsonString.widget_id, sql: "" });
            keysToClear.push(cacheKey.replace("~wb~", "~hbp~"), cacheKey.replace("~wb~", "~hbs~"))
            ajaxCallObj.clearRedisData(keysToClear);
        }


        // var settings = {
        //     "async": true,
        //     "crossDomain": true,
        //     "url": apiBase + "addWidget",
        //     "method": "POST",
        //     "dataType": "json",
        //     "headers": {
        //         "content-type": "application/x-www-form-urlencoded"
        //     },
        //     "data": {
        //         "session_id": sId,
        //         "utl": utls,
        //         "type": type,
        //         "json": JSON.stringify(jsonString)
        //     }
        // }

        $.ajax(settings).done(function (response) {
            callParentNew("closeFrame()","function");
           // parent.closeFrame();
            if (response.status == true) {
                // if (!$("#dashBoardIcon",parent.document).is(":visible"))
                ajaxCallObj.checkDashboard();

                var data = response.data;
                var widgetId = data[0];
                var title = data[1];
                var widgeType = data[2];
                if (type == "insert") {

                    if ($.inArray($("#widgetGroupsInp").val(), groups) === -1)
                        ajaxCallObj.getAllGroups();


                    $("#widgetPanelWrapper").prepend(getPanelHtml(widgeType, title, widgetId));

                    if ($("#matcolumnSrchBtn").text() !== "all") {
                        $("#matcolumnSearch li:first").click();
                    }

                    if ($("#widgetPanelWrapper .widgetWrapper").length <= widgetsPerPage) {
                        $(".pagination-wrapper").hide();
                    } else {
                        $(".pagination-wrapper").show();
                    }

                    $('.pagination-wrapper').data("AXPAGINATION") ? $('.pagination-wrapper').createAxPagination("rearrange") : createPagination();

                    wizardObj.resetTheWizard();
                    $('#wizardModal').modal('close');
                    showAlertDialog("success", widgetMessages.widgetCreated);
                } else {
                    showAlertDialog("success", widgetMessages.widgetUpdated);
                }

                if (!widgetTableData.data) {
                    widgetTableData.data = [];
                    widgetTableData.indexes = {};
                }
                widgetId = parseInt(widgetId);
                if (type == "insert") {
                    widgetTableData.data.push({ "id": widgetId, "title": title, "widget_type": widgeType });
                    widgetTableData.indexes[widgetId] = widgetTableData.data.length - 1; //means last index
                    if (dataTableApi) {
                        dataTableApi.row.add({
                            "id": widgetId,
                            "title": title,
                            "widget_type": widgeType,
                            "id": widgetId
                        }).draw();
                    }
                } else {
                    var presIndex = widgetTableData.indexes[widgetId];
                    var oldWdgtData = widgetTableData.data[presIndex];
                    widgetId = widgetId || oldWdgtData.id
                    title = title || oldWdgtData.title
                    widgeType = widgeType || oldWdgtData.widget_type
                    widgetTableData.data[presIndex] = { "id": widgetId, "title": title, "widget_type": widgeType }


                    if (dataTableApi) {
                        var indexes = dataTableApi.rows().eq(0).filter(function (rowIdx) {

                            return dataTableApi.cell(rowIdx, 0).data() === widgetId ? true : false;
                        });

                        dataTableApi.row(indexes[0]).data({ "id": widgetId, "title": title, "widget_type": widgeType }).draw()
                    }
                }



                ajaxCallObj.getAxpertWidgetDetails({ tId: "new", widgetId: data[0] });
                // $("#AXpage1").prepend("<h1>mani</h1>")
            } else {
                filterErrorMessageAndShow(response);
            }
            // console.log(response);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            onAjaxFailure();
        });
    }
    this.getDetails = function (jsonString, type) {

        var settings = primaryApiSettings();
        settings.url = apiBase + "getWidgets";

        // var settings = {
        //     "async": true,
        //     "crossDomain": true,
        //     "url": apiBase + "getWidgets",
        //     "method": "POST",
        //     "headers": {
        //         "content-type": "application/x-www-form-urlencoded"
        //     },
        //     "data": {
        //         "session_id": sId,
        //         "utl": utls
        //     }
        // }

        $.ajax(settings).done(function (response) {
            if (response.status == true) {
                var data = response.data;
                if (data) {
                    var dataLength = data.length;
                    var widgetTableDataArr = widgetTableData.data = [];
                    var widgetTableIndexesObj = widgetTableData.indexes = {};
                    for (var i = 0; i < dataLength; i++) {
                        var presentData = data[i]; //title,widget_id,widget_type
                        var widgetId = presentData[1];
                        var title = presentData[0];
                        var widgeType = presentData[2];
                        var presentObj = widgetTableData["w" + widgetId];
                        if (!presentObj)
                            presentObj = widgetTableData["w" + widgetId] = {};

                        $("#widgetPanelWrapper").append(getPanelHtml(widgeType, title, widgetId)); //(type, title, target)
                        presentObj.title = title;
                        presentObj.type = widgeType;
                        widgetTableDataArr.push({ "id": widgetId, "title": title, "widget_type": widgeType });
                        widgetTableIndexesObj[widgetId] = i;
                        if (i < widgetsPerPage)
                            ajaxCallObj.getAxpertWidgetDetails({ tId: i, widgetId });
                    }

                    // $('.pagination-wrapper').createAxPagination({
                    //     target: "#widgetPanelWrapper",
                    //     itemClass: 'widgetWrapper',
                    //     itemsPerPage: widgetsPerPage,
                    //     nextIcnClass: 'icon-chevron-right',
                    //     prevIcnClass: 'icon-chevron-left',
                    //     afterPageShow: function(pageNo) {
                    //         // chartResize("AXpage" + pageNo + " .widgetWrapper");
                    //         $("#AXpage" + pageNo + " .widgetWrapper").each(function(index, el) {
                    //             var elem = $(this);
                    //             var wId = elem.data('id');
                    //             var presentObj = widgetTableData["w" + wId];
                    //             if (presentObj && presentObj.sql) {
                    //                 var targetId = "axWidget" + wId;
                    //                 createAxpertWidget(presentObj, targetId);
                    //             }
                    //         });
                    //         // alert(pageNo)
                    //         // console.log(widgetTableData)
                    //     },
                    //     onPageClick: function(presentPage, elem) {
                    //         if (!$(elem).hasClass('manualClick')) {
                    //             if (!closeProprtySht("onPageClick", elem))
                    //                 return false
                    //         } else {
                    //             $(elem).removeClass('manualClick')
                    //         }



                    //         $("#AXpage" + presentPage + " .widgetWrapper").each(function(index, el) {
                    //             var elem = $(this);
                    //             elem.removeClass('widgetSetted');
                    //             var index = elem.find('.cardContentData').data("agilecharts-chart");
                    //             if (index !== undefined) {
                    //                 var chart = agilecharts.charts[index];
                    //                 if (chart)
                    //                     chart.destroy();
                    //             }
                    //         });
                    //         // alert("onclick")
                    //         return true;
                    //     }
                    // });
                    createPagination();
                    callParentNew("closeFrame()","function");
                   // parent.closeFrame();
                }

            } else {
                filterErrorMessageAndShow(response);
            }
            // console.log(response);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            onAjaxFailure();
        });
    }

    this.checkDashboard = function () {

        var settings = primaryApiSettings();
        settings.url = apiBase + "checkDashboard";
        settings.data.rty = parent.userResp;

        // var settings = {
        //     "async": true,
        //     "crossDomain": true,
        //     "url": apiBase + "checkDashboard",
        //     "method": "POST",
        //     "headers": {
        //         "content-type": "application/x-www-form-urlencoded"
        //     },
        //     "data": {
        //         "session_id": sId,
        //         "utl": utls,
        //         "rty": parent.userResp
        //     }
        // }

        $.ajax(settings).done(function (response) {
            // console.log(response);

            if (response.status == true) {
                var data = response.data || 0;
                if (parseInt(data) > 0)
                    $("#dashBoardIcon", parent.document).show();
                else
                    $("#dashBoardIcon", parent.document).hide();
            }else{
                filterErrorMessageAndShow(response);
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            onAjaxFailure();
        });
    }

    this.deleteWidget = function (widgetId) {
        if (!that.isPageValid()) {
            redirectPage(true);
            return;
        }
        callParentNew("loadFrame()","function");
       // parent.loadFrame();

        var settings = primaryApiSettings();
        settings.url = apiBase + "deleteWidget";
        settings.data.widget_id = widgetId;

        // var settings = {
        //     "async": true,
        //     "crossDomain": true,
        //     "url": apiBase + "deleteWidget",
        //     "method": "POST",
        //     "headers": {
        //         "content-type": "application/x-www-form-urlencoded"
        //     },
        //     "data": {
        //         "session_id": sId,
        //         "utl": utls,
        //         "widget_id": widgetId
        //     }
        // }

        $.ajax(settings).done(function (response) {
            // console.log(response);
            callParentNew("closeFrame()","function");
           // parent.closeFrame();
            var targetId = "axWidget" + widgetId;
            if (response.status == true) {
                newWidgetData = true;
                if ($("#dashBoardIcon", parent.document).is(":visible"))
                    ajaxCallObj.checkDashboard();

                $("#" + targetId).remove();
                showAlertDialog("success", widgetMessages.deleteSuccess);
                if (dataTableApi)
                    dataTableApi.row($("#wdgtDataTable .editDelBtn[data-id=" + widgetId + "]").parents("tr")).remove().draw();
                var cacheIndex = widgetTableData.indexes[widgetId];
                if (cacheIndex !== undefined) {
                    // widgetTableData.data[cacheIndex]
                    widgetTableData.data.splice(cacheIndex, 1);
                }

                if (presentView === "widget") {
                    if ($("#widgetPanelWrapper .widgetWrapper").length <= widgetsPerPage) {
                        $(".pagination-wrapper").hide();
                    } else {
                        $(".pagination-wrapper").show();
                    }

                    $('.pagination-wrapper').data("AXPAGINATION") ? $('.pagination-wrapper').createAxPagination("rearrange") : createPagination();

                    // } else {
                    //     if ($('.pagination-wrapper').data("AXPAGINATION"))
                    //         $('.pagination-wrapper').createAxPagination("destroy");
                    // }
                    // $('.pagination-wrapper').createAxPagination("rearrange");
                } else {
                    $("#gridWdgtToggleBtn").addClass('changesAvailable');

                }
                ajaxCallObj.getAllGroups();
                // createHomeWidgets(response.data)
            } else {
                filterErrorMessageAndShow(response);
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            onAjaxFailure();
        });
    }

    this.getWidgetRoles = function (wid, optionHtml) {

        var settings = primaryApiSettings();
        settings.url = apiBase + "getWidgetResponsibility";
        settings.data.widget_id = wid;

        // var settings = {
        //     "async": true,
        //     "crossDomain": true,
        //     "url": apiBase + "getWidgetResponsibility",
        //     "method": "POST",
        //     "headers": {
        //         "content-type": "application/x-www-form-urlencoded"
        //     },
        //     "data": {
        //         "session_id": sId,
        //         "widget_id": wid,
        //         "utl": utls
        //     }
        // }

        $.ajax(settings).done(function (response) {
            if (response.status == true) {
                var rolesData = [];
                if (response.data) {
                    $.each(response.data, function (i, v) {
                        rolesData.push(v[1]);
                    });
                }

                var presWdgtData = widgetTableData["w" + wid];
                presWdgtData.roles = rolesData;

                $("#prpShtRoles").html(optionHtml);
                $("#prpShtRoles").val(rolesData);
                $('#prpShtRoles').material_select();
            } else {
                filterErrorMessageAndShow(response);
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            onAjaxFailure();
        });
    }

    this.crudIview = function (jsonData, jsonToSaveInDb) {
        if (!that.isPageValid()) {
            redirectPage(true);
            return;
        }
        callParentNew("loadFrame()","function");
        //parent.loadFrame();
        jsonData.iviews.axpapp = mainProjName;
        jsonData.iviews.s = sId;
        jsonData.iviews.appsessionkey = appsessionKeyWOL;
        jsonData.iviews.trace = tracePath;
        jsonData.iviews.username = currentUserName;
        jsonData.iviews.globalvars = parent.axUtlGlobalVars;
        jsonData.iviews.uservars = parent.axUtlUserVars;
        jsonData.iviews.axapps = parent.axUtlApps;
        var settings = primaryApiSettings();
        settings.url = apiBase + "saveiview";
        settings.data.sPath = mainRestDllPath;
        settings.data.data = JSON.stringify(jsonData);

        $.ajax(settings).done(function (response) {
            //console.log(response);
            // ShowDimmer(false);
            if (response.status === false) {
                callParentNew("closeFrame()","function");
                parent.closeFrame();
                showAlertDialog("error", response.errMsg);
                return;
            }
            var json = response.data;
            var res = json.result[0];
            if (res.status === "success") {
                if (jsonData.iviews.actmode === "new") {
                    addIviewInMenu(jsonData.iviews.ivname, jsonData.iviews.ivcaption);
                    ajaxCallObj.addDetails(jsonToSaveInDb, "insert");
                }
                else if (jsonData.iviews.actmode === "delete")
                    ajaxCallObj.deleteWidget(jsonToSaveInDb);
            } else if (res.error) {
                callParentNew("closeFrame()","function");
               // parent.closeFrame();
                showAlertDialog("error", res.error.msg);
            }
            else {
                callParentNew("closeFrame()","function");
               // parent.closeFrame();
                showAlertDialog("error", res.msg);
            }

        }).fail(function() {
            onAjaxFailure();
        })
    }

}


function createMainObj(data, targetId, index) {
    if (!widgetMetaData) {
        widgetMetaData = {};
        var dataMetaData = data.datametaData;
        var dataMetaDataLength = dataMetaData.length;
        for (var i = 0; i < dataMetaDataLength; i++) {
            widgetMetaData[dataMetaData[i].name] = i;
        }
    }
    var wId = targetId.substr(8);
    var presentObj = widgetTableData["w" + wId];
    if (!presentObj)
        presentObj = widgetTableData["w" + wId] = {};

    var widgetInfo = data.data;
    var qryData = data.queryData;
    var qryMetaData = data.querymetaData;


    presentObj.sql = widgetInfo[widgetMetaData["SQLTEXT"]];
    presentObj.attr = widgetInfo[widgetMetaData["ATTRIBUTES"]];
    presentObj.roles = widgetInfo[widgetMetaData["ROLES"]];
    presentObj.cType = widgetInfo[widgetMetaData["CHARTTYPE"]];
    presentObj.grpName = widgetInfo[widgetMetaData["SUB_TYPE"]];
    presentObj.qrData = qryData;
    presentObj.qrMData = qryMetaData;
    // if (presentView == "widget")
    //     newWidgetData = false;

    if (index == "new") {
        presentObj.type = widgetInfo[widgetMetaData["WIDGET_TYPE"]];
        presentObj.title = widgetInfo[widgetMetaData["TITLE"]];
        // presentObj.id = widgetInfo[widgetMetaData["WIDGET_TYPE"]];
    }

    if (index != "error" && (index <= widgetsPerPage || index === "new" || $.inArray(parseInt(wId), demandArray) != -1)) {
        var targetId = "axWidget" + wId;
        createAxpertWidget(presentObj, targetId);
        $("#" + targetId).addClass('widgetCreated');
    }

}

function addIviewInMenu(ivName, caption) {
    try {
        var menuSet = parent.menuJson.root.parent;
        var objToPush = {
            target: "iview.aspx?ivname=" + ivName,
            img: "",
            intview: "",
            level: "0",
            name: caption,
            oname: "PageIv" + ivName, //vasdfas2
            url: ""

        }
        parent.menuJson.root.parent.push(objToPush);

        var menuObj = {
            HLTYPE: "iview",
            PARAMS: "",
            SEARCHTEXT: caption,
            STRUCTNAME: ivName
        }
        parent.tblSearchData.Table.push(menuObj)


    } catch (e) {
        // statements
        console.log(e);
    }
}

/**
 * To validate the SQL for params is valid like,
 * Must not have param name same as any column name
 * param name should not be having global variable name
 * @param  {Object} response response came from server while executing Query
 * @return {Boolean/Array}          false if params are invalid else send an array of params
 */
function validateSqlDataForParams(response) {
    var metaData = response.metaData;
    var metaLth = metaData.length;
    var invalidIvParamCols = createGlobalVars({ onlyKeys: true });
    var paramsInSql = parseSqlForParams({ sql: response._sql });
    for (var i = 0; i < metaLth; i++) {
        var presColName = metaData[i].name.toLowerCase();
        if ($.inArray(presColName, invalidIvParamCols) === -1) {
            invalidIvParamCols.push(presColName);
        }
    }

    for (var i = 0; i < paramsInSql.length; i++) {
        var presParam = paramsInSql[i].toLowerCase();

        if (!testRegex("validNameWithoutSpace", presParam) || $.inArray(presParam, invalidIvParamCols) !== -1) {
            return false;
        }
    }

    return paramsInSql;
}


/**
 * To add the parameter ui with parameters what user defined in SQL
 * @param {Array} Params data
 */
function addIvParamsDynamically(params) {
    if (params && params.length)
        var paramLth = params.length;
    else
        paramLth = 0;

    var paramHtml = "";
    paramHtml += '<div class="row ivEchPramWrapper">';
    paramHtml += '<div class="col m2 right-align">';
    if (!paramLth || paramLth > 1) {
        paramHtml += '<button title="Move Up" onclick="moveIvParamUpDwn(this,\'up\')" class="waves-effect  customSmallBtn waves-light btn-flat"><span class="icon-chevron-up"></span></button>';
        paramHtml += '<button title="Move Down" onclick="moveIvParamUpDwn(this,\'down\')" class="waves-effect customSmallBtn waves-light btn-flat"><span class="icon-chevron-down"></span></button>';
    }
    paramHtml += '<button title="Edit" onclick="createExtraModel({type:\'param\',details:this})" class="waves-effect customSmallBtn waves-light btn-flat"><span class="icon-pencil"></span></button>';
    paramHtml += '</div>';
    paramHtml += '<div class="col m8">';
    paramHtml += '<div class="input-field col s4">';
    paramHtml += '<input {{disabled}} value="{{value}}" type="text" class="themeMaterialInp pName">';
    paramHtml += '<label>Name</label>';
    paramHtml += '</div>';
    paramHtml += '<div class="input-field col s4 slctFld">';
    paramHtml += '<select class="materialSelect pType">';
    paramHtml += '<option value="Character" selected>Character</option>';
    paramHtml += '<option value="Date/Time">Date/Time</option>';
    paramHtml += '<option value="Numeric">Numeric</option>';
    paramHtml += '</select>';
    paramHtml += '</div>';
    paramHtml += '<div class="input-field col s4">';
    paramHtml += '<input type="text" class="themeMaterialInp pVal">';
    paramHtml += '<label>Value</label>';
    paramHtml += '</div>';
    paramHtml += '</div>';
    paramHtml += '<div class="col m2">';
    paramHtml += '<button title="Add" onclick="addDeleteIvParamRow(this,\'add\')" class="{{hide}} waves-effect waves-light customSmallBtn btn-flat"><span class="icon-plus"></span></button>';
    paramHtml += '<button title="Remove" onclick="addDeleteIvParamRow(this,\'delete\')" class="{{hide}} waves-effect waves-light customSmallBtn btn-flat"><span class="icon-cross2"></span></button>';
    paramHtml += '</div>';
    paramHtml += '</div>';

    if (params && params.length) {
        var paramLth = params.length;
        paramHtml = paramHtml.replace(/{{disabled}}/g, "disabled").replace(/{{hide}}/g, "");
        var finalHtml = "";
        for (var i = 0; i < paramLth; i++) {
            var presParam = params[i];
            finalHtml += paramHtml.replace(/{{value}}/g, presParam);
        }
        $("#ivParamMainWrapper").html(finalHtml);
    } else {
        paramHtml = paramHtml.replace(/{{disabled}}/g, "").replace(/{{hide}}/g, "").replace(/{{value}}/g, "")
        $("#ivParamMainWrapper").html(paramHtml);
    }
    $("#ivParamMainWrapper select.materialSelect").material_select();
    Materialize.updateTextFields();

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
    if ((e.which <= 111 && e.which >= 48) || e.which == 8 || e.which == 46 || (e.which >= 186 && e.which <= 192) || (e.which >= 219 && e.which <= 222)) {
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



function showTheTableRemainigData(colsKey) {
    // chartConfiguration
    if (widgetType === "chart") {
        var inpHtml = '<div class="input-field col s12 m4 autoComInpFld"> <input data-index="{i}" data-type="{type}" type="text" id="extraParamFld{i}" class="themeInp themeMaterialInp autocompleteMe"><label for="extraParamFld{i}">{fldName}<sup>*</sup></label></div>';
        var functionHtml = '<div class="input-field col s12 m4">';
        functionHtml += "<select onchange='createSqlForTableData()' class='exParamslct materialSelect' id='exParamslct{i}'>";
        functionHtml += "<option value='' selected>Select A Function</option>";
        functionHtml += "<option value='sum'>Sum</option>";
        functionHtml += "<option value='count'>Count</option>";
        // functionHtml += "<option value='max'>Maximum</option>";
        // functionHtml += "<option value='min'>Minimum</option>";
        functionHtml += "<select>";
        functionHtml += "</div>";
        var finalHtml = "";
        var selectedChartConfigKey = $("#chartSelData a.selected").data('cc');
        var chartConfigKey = $('#widgetTableRemData').data("cc"); //chartConfiguration
        if (($("#wtrFldsData").html() == "") || selectedChartConfigKey !== chartConfigKey) {
            $('#widgetTableRemData').data("cc", selectedChartConfigKey);
            var presentCC = chartConfiguration[selectedChartConfigKey];
            var fieldsCount = presentCC.fieldsCount;
            var flds = presentCC.fields;
            var fldsType = presentCC.type;
            for (var i = 0; i < fieldsCount; i++) {
                var presentFld = flds[i];
                var type = fldsType[i];
                if (presentFld.split("~").length > 1) {
                    finalHtml += "<div class='row marg0 bringMeNewRow'>"
                    var fldName = presentFld.split("~")[0]
                    finalHtml += inpHtml.replace(/{i}/g, i).replace(/{fldName}/g, fldName).replace(/{type}/g, type);
                    finalHtml += functionHtml.replace(/{i}/g, i);
                    finalHtml += '</div>';
                } else {
                    finalHtml += inpHtml.replace(/{fldName}/g, presentFld).replace(/{i}/g, i).replace(/{type}/g, type);
                }
            }
            $("#wtrFldsData").html(finalHtml)
            $("#wtrFldsData select").material_select();
            $("#widgetTableRemData").show();
            if (!$("#whrCls").hasClass('cdmrEdiSetted')) {
                $("#whrCls").addClass('cdmrEdiSetted')
                tableSqlCm = CodeMirror.fromTextArea(document.getElementById("whrCls"), {
                    mode: 'text/x-sql',
                    smartIndent: true,
                    lineNumbers: true,
                    matchBrackets: true,
                    extraKeys: {
                        "Ctrl-Space": "autocomplete",
                        "Tab": false, // Let focus go to next control
                        "Shift-Tab": false // Let focus go to previous control
                    },
                    value: document.documentElement.innerHTML,
                    hintOptions: {
                        tables: {}
                    }
                });
                tableSqlCm.on("change", function (doc, changeObj) {
                    $("#wizardNextbtn").removeClass('validated')
                });
            } else {
                tableSqlCm.refresh();
            }

        } else {
            $("#wtrFldsData .autocompleteMe").data('key', undefined).removeData('key').removeClass('valSelected').val("").off('keyup.autoCompKeyUp').off('focus.autoCompFocus').autocomplete("destroy");
            selectedCols = [];
            Materialize.updateTextFields();
            // $("#wtrFldsData .autocompleteMe")
            $("#widgetTableRemData").show();
        }
        $("#wtrFldsData .autocompleteMe").off('keyup.autoCompKeyUp');
        $("#wtrFldsData .autocompleteMe").on('keyup.autoCompKeyUp', function (e) {
            var elem = $(this);

            if ((e.which <= 111 && e.which >= 48) || e.which == 8 || e.which == 46 || (e.which >= 186 && e.which <= 192) || (e.which >= 219 && e.which <= 222)) {
                // $(this).removeData('key');
                // $(this).data('key', undefined).removeClass('valSelected');
                // selectedCols[$.inArray($(this).val(), selectedCols)] = null;
                // console.log(1)
                elem.focus();
            } else if (e.which !== 9) {
                e.preventDefault();
            }

        });
        $("#wtrFldsData .autocompleteMe").off('keydown.autoCompKeyDown');
        $("#wtrFldsData .autocompleteMe").on('keydown.autoCompKeyDown', function (e) {
            var elem = $(this);
            if (elem.data('key')) {
                if ((e.which <= 111 && e.which >= 48) || e.which == 8 || e.which == 46 || (e.which >= 186 && e.which <= 192) || (e.which >= 219 && e.which <= 222)) {
                    $(this).removeData('key');
                    $(this).data('key', undefined).removeClass('valSelected');
                    selectedCols[$.inArray($(this).val(), selectedCols)] = null;
                    // elem.focus();
                    // console.log(0)
                } else if (e.which !== 9) {
                    e.preventDefault();
                }
            }
        });
        $("#wtrFldsData .autocompleteMe").off('focus.autoCompFocus');
        $("#wtrFldsData .autocompleteMe").on('focus.autoCompFocus', function (event) {
            var elem = $(this);

            if (elem.data('key')) {
                elem.select();
                return
            }

            var typeOfFld = elem.data('type');
            var dataToAdd = {};
            if (elem.hasClass('firstFocus')) {
                elem.removeClass('firstFocus');
                return;
            }
            // if (elem.next().next().hasClass("autocomplete-content")) {


            if (typeOfFld === "*") {
                $.extend(dataToAdd, tstructTableCols[colsKey].all);
                // dataToAdd = tstructTableCols[colsKey].all;
            } else if (typeOfFld === "n") {
                $.extend(dataToAdd, tstructTableCols[colsKey].num);
                // dataToAdd = tstructTableCols[colsKey].num;
            }

            for (var i = 0; i < selectedCols.length; i++) {
                var presKey = selectedCols[i];
                if (presKey) {
                    delete dataToAdd[presKey]
                }
            }
            elem.autocomplete("destroy");
            elem.addClass("firstFocus").autocomplete({
                isKeyImage: false,
                data: dataToAdd,
                limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
                onAutocomplete: function (val) {
                    // Callback function when value is autcompleted.
                    // elem
                    // console.log(2)
                    selectedCols[elem.data('index')] = val;
                    createSqlForTableData();
                },
                minLength: 0, // The minimum length of the input for the autocomplete to start. Default: 1.
            }).focus();

        });

        createSqlForTableData();
        // $("#isValidSQl").val("true");
        // $("#wizardNextbtn").removeClass('validated')
    } else if (widgetType === "kpi" || widgetType === "iview") {
        // var inpHtml = '<div id="extraParamFldDiv0" class="input-field col s12 m4 autoComInpFld"> <input type="text" id="extraParamFld0" data-index="0" class="themeInp themeMaterialInp autocompleteMe"><label for="extraParamFld0">{fldName}</label></div>';
        // var btnHtml = '<button type="button" data-count=0 onclick = "addExtraFld(this,\'' + colsKey + '\')" class="extraAddBtn btn-flat waves-effect btn-floating "><span id="iconSelectorSpn" class="icon-plus"></span></button>';
        // $("#wtrFldsData").html(inpHtml + btnHtml)
        // addKpiEvents("extraParamFld0", colsKey);
        var optionsHtml = "";
        var presObj = tstructTableCols[colsKey].all;
        for (var key in presObj) {
            if (presObj.hasOwnProperty(key)) {
                var name = key;
                var dbName = presObj[key].split("__~__")[0];
                optionsHtml += "<option value='" + dbName + "'>" + name + "</option>";
            }
        }


        var htmlToAdd = "";
        htmlToAdd = '<div class="row con">';
        htmlToAdd += '<div class="col multiSelWrap">';
        htmlToAdd += '<label class="widgetRespLabel">Columns<sup>*</sup></label>';
        htmlToAdd += '<select name="from[]" id="extraColMSFrom" data-right="#extraColMSTo" data-right-all="#right_All_1" data-right-selected="#right_Selected_1" data-left-all="#left_All_1" data-left-selected="#left_Selected_1" class="form-control1 browser-default rlmultiSlectFld" size="8" multiple="multiple">';
        htmlToAdd += optionsHtml;
        htmlToAdd += '</select>';
        htmlToAdd += '</div>';
        htmlToAdd += '<div class="col multiSelWrapOpt" style="padding-left: 20px;">';
        htmlToAdd += '<button title="Select All" type="button" id="right_All_1" class="waves-effect btn-flat smallBtn">';
        htmlToAdd += '<i class="icon-chevron-right frstIcn"></i>';
        htmlToAdd += '<i class="icon-chevron-right scndIcn"></i>';
        htmlToAdd += '</button>';
        htmlToAdd += '<button title="Select" type="button" id="right_Selected_1" class="waves-effect btn-flat smallBtn">';
        htmlToAdd += '<i class="icon-chevron-right"></i>';
        htmlToAdd += '</button>';
        htmlToAdd += '<button title="Remove" type="button" id="left_Selected_1" class="waves-effect btn-flat smallBtn">';
        htmlToAdd += '<i class="icon-chevron-left"></i>';
        htmlToAdd += '</button>';
        htmlToAdd += '<button title="Remove All" type="button" id="left_All_1" class="waves-effect btn-flat smallBtn">';
        htmlToAdd += '<i class="icon-chevron-left frstIcn"></i>';
        htmlToAdd += '<i class="icon-chevron-left scndIcn"></i>';
        htmlToAdd += '</button>';
        htmlToAdd += '</div>';
        htmlToAdd += '<div class="col multiSelWrap">';
        htmlToAdd += '<select name="to[]" id="extraColMSTo" class="form-control1 browser-default rlmultiSlectFld" size="8" multiple="multiple"></select>';
        htmlToAdd += '</div>';
        htmlToAdd += '</div>';

        $("#wtrFldsData").html(htmlToAdd)
        // $("#wtrFldsData select").material_select();
        $("#widgetTableRemData").show();
        $('#extraColMSFrom').multiselect({
            afterMoveToRight: function () {
                createSqlForTableData("kpi")
            },
            afterMoveToLeft: function () {
                createSqlForTableData("kpi")
            }
        });
        $("#right_All_1").click();

        if (!$("#whrCls").hasClass('cdmrEdiSetted')) {
            $("#whrCls").addClass('cdmrEdiSetted')
            tableSqlCm = CodeMirror.fromTextArea(document.getElementById("whrCls"), {
                mode: 'text/x-sql',
                smartIndent: true,
                lineNumbers: true,
                matchBrackets: true,
                extraKeys: {
                    "Ctrl-Space": "autocomplete",
                    "Tab": false, // Let focus go to next control
                    "Shift-Tab": false // Let focus go to previous control
                },
                value: document.documentElement.innerHTML,
                hintOptions: {
                    tables: {}
                }
            });
            tableSqlCm.on("change", function (doc, changeObj) {
                $("#wizardNextbtn").removeClass('validated')
            });

        } else {
            tableSqlCm.refresh();
        }
        createSqlForTableData("kpi");
        // $("#isValidSQl").val("true");
        // $("#extraColMSTo").on('change', function(event) {
        //     // event.preventDefault();
        //     alert(2);
        // });


    }
}


// function customizeData(plotName) {
//     if (plotName && typeof plotName === "string") {
//         plotName = plotName.replace(/__\^__/g, ":");
//     }
//     return plotName;
// }

function createIvColHtml(metaData, calledFrom) {
    var metaLth = metaData.length;

    var colHtml = "";
    colHtml += '<div class="row">';
    colHtml += '<div class="col m8 offset-m2 s12">';
    colHtml += '<div>';
    colHtml += '<div class="input-field">';
    colHtml += '<input id="ivColSechr" class="themeMaterialInp" type="text">';
    colHtml += '<label for="ivColSechr">Column</label>';
    colHtml += '</div>';
    colHtml += '</div>';
    colHtml += '<div class="collection" id="ivColCollctnWrppr">';
    if (metaLth > 4) {
        colHtml += '<a title="Scroll Up" href="#!" onclick="moveColsUpDwn(38)" class="collection-item center-align upDwnArrw upArw"><span class="icon-chevron-up"></span></span></a>';
    }

    var extraColPosData = presWizardData.extraData.cols = {};
    presWizardData.iviews.cols = [];
    for (var i = 0; i < metaLth; i++) {
        var presName = metaData[i].name.toLowerCase();
        let dtype = metaData[i].type.toLowerCase();
        switch (dtype) {
            case "c":
                dtype = "Character";
                break;
            case "i":
                dtype = "Numeric";
                break;
            case "d":
                dtype = "Date/Time";
                break;
            default:
                dtype = "Character";
                break;
        }
        if (!testRegex("validNameWithoutSpace", presName)) {
            showAlertDialog("warning", widgetMessages.invalidColName);
            return false;
        }
        extraColPosData[presName] = i;
        //pushing data presWizardData 
        createUpdateIvJsonData("cols", { name: presName, index: (i + 1), dtype }, i, true)

        if (i >= 4)
            colHtml += '<div style="display: none;" class="collection-item srchSlcted colItm">';
        else if (i === 0)
            colHtml += '<div class="collection-item srchSlcted highlighted colItm">';
        else
            colHtml += '<div class="collection-item srchSlcted colItm">';

        // colHtml += '<div class="collection-item srchSlcted colItm">';
        colHtml += '<div id=ivColsUQ' + presName + ' data-original="' + i + '" onclick="createExtraModel({type:\'col\',details:this})" class="ciColWrapper">' + presName;
        colHtml += `<a class='blackText ivColPropsAnchr hoverFocusThemeColor' href='javascript:void(0)'><span title="Edit" class="edit"><span class="icon-pencil5"></span></span></a>`;
        colHtml += '</div>';
        colHtml += '<div class="upDwnWrapper">';
        colHtml += `<a class='blackText hoverFocusThemeColor' href='javascript:void(0)'><span title="Move Up" class="icon-chevron-up"></span></a>`;
        colHtml += `<a class='blackText hoverFocusThemeColor' href='javascript:void(0)'><span title="Move Down" class="icon-chevron-down"></span></a>`;
        colHtml += '</div>';
        colHtml += '<div class="clear"></div>';
        colHtml += '</div>';
    }
    if (metaLth > 4) {
        colHtml += '<a title="Scroll Down" href="#!" onclick="moveColsUpDwn(40)" class="collection-item center-align upDwnArrw dwnArw"><span class="icon-chevron-down"></span></span></a>';
    }
    colHtml += '</div></div></div>';

    $("#ivColData").html(colHtml);

    $(document).on('keyup', '#ivColSechr', function (e) {
        e.preventDefault();
        $('#ivColCollctnWrppr .collection-item.highlighted').removeClass('highlighted');
        var elemVal = $(this).val();
        $("#ivColCollctnWrppr .colItm").removeClass('srchSlcted').hide();
        if (elemVal === "") {
            $("#ivColCollctnWrppr .colItm").addClass('srchSlcted');
        } else {
            $("#ivColCollctnWrppr .colItm").each(function (index, el) {
                var presCl = $(this);
                if (presCl.text().toLowerCase().indexOf(elemVal.toLowerCase()) !== -1) presCl.addClass('srchSlcted').show();
            });

        }
        $('#ivColCollctnWrppr .collection-item.srchSlcted:visible').first().addClass("highlighted");
        $("#ivColCollctnWrppr .colItm.srchSlcted:lt(4)").show();
        $("#ivColCollctnWrppr .colItm.srchSlcted:gt(3)").hide();
    });

    $(document).off('keydown.ivColKdEvnt');
    $(document).on('keydown.ivColKdEvnt', function (event) {
        var keyCode = event.keyCode;
        moveColsUpDwn(keyCode);


    });
    $(document).off('mouseenter.mseEnter', '#ivColCollctnWrppr .colItm')
    $(document).on('mouseenter.mseEnter', '#ivColCollctnWrppr .colItm', function () {
        $('#ivColCollctnWrppr .collection-item.highlighted').removeClass('highlighted');
        $(this).addClass('highlighted');
        /* Act on the event */
    });
    $(document).off('click.upDwnClick', '#ivColCollctnWrppr .upDwnWrapper a')
    $(document).on('click.upDwnClick', '#ivColCollctnWrppr .upDwnWrapper a', function (event) {
        event.preventDefault();
        // alert(1);

        var presElem = $(this);
        presElem = presElem.find('span');
        if (presElem.hasClass('disabled')) return;

        var presElemClass = presElem.attr('class');
        var parentElem = presElem.parents('.colItm');

        if (presElemClass.indexOf('up') !== -1) {
            var prevElem = parentElem.prevAll('.srchSlcted').first();
            if (prevElem.hasClass('colItm')) {
                if (!prevElem.is(":visible")) {
                    prevElem.show();
                    $('#ivColCollctnWrppr .collection-item.srchSlcted:visible').last().hide();
                    var prevPrvElem = nextElem.prevAll('.srchSlcted').first();
                    if (!prevPrvElem.hasClass('colItm')) {
                        presElem.addClass('disabled');
                    }
                }
            } else {
                presElem.addClass('disabled');
                return
            }
            parentElem.insertBefore(prevElem);
            presElem.next().removeClass('disabled');
            // if (presElem.next().hasClass('disabled')) {
            //     $('#ivColCollctnWrppr .collection-item.srchSlcted:visible').last().find('.icon-chevron-down').addClass('disabled');
            // }

        } else if (presElemClass.indexOf('down') !== -1) {
            var nextElem = parentElem.nextAll('.srchSlcted').first();
            if (nextElem.hasClass('colItm')) {
                if (!nextElem.is(":visible")) {
                    nextElem.show();
                    $('#ivColCollctnWrppr .collection-item.srchSlcted:visible').first().hide();
                    var nxtNxtElem = nextElem.nextAll('.srchSlcted').first();
                    if (!nxtNxtElem.hasClass('colItm')) {
                        presElem.addClass('disabled');
                    }
                }
            } else {
                presElem.addClass('disabled');
                return
            }

            parentElem.insertAfter(nextElem);
            presElem.prev().removeClass('disabled');
        }
    });
    $("#ivColSechr").focus();

}


/**
 * To add details in presWizardData obj while creating iview to send the data as webservice required
 * @param  {String} type  to identify the type to add
 * @param  {Object} data  The data to add in the obj
 * @param  {Number} index The position we want to add or upfae in array
 * @param  {Boolean} isFirstTime if true defalut value will be added
 * @return {null}       Just update in Obj
 */
function createUpdateIvJsonData(type, data, index, isFirstTime) {
    if (type === "cols") {
        var objtoAdd = presWizardData.iviews.cols;
        var dataToAdd = {};
        // isFirstTime
        if (isFirstTime) {
            dataToAdd = {

                "name": data.name,
                "caption": data.name,
                "qryname": "Task1",
                "dtype": data.dtype || "Character",
                "ordno": data.index.toString(),
                "width": "80",
                "decimal": "0",
                "align": "Left",
                "rtotal": "F",
                "disptotal": "F",
                "applycomma": "F",
                "norepeat": "F",
                "zerooff": "F",
                "hidden": "F",
                "font": "",
                "color": "",
                "defcolor": "T",
                "dblclick": "",
                "cf": [{
                    "expr": "",
                    "style": ""
                }]

            };

        } else {
            dataToAdd = {

                "name": data.name,
                "caption": data.caption,
                "qryname": "Task1",
                "dtype": data.dtype,
                "ordno": data.index.toString(),
                "width": data.width,
                "decimal": data.decimal,
                "align": data.align,
                "rtotal": data.rtotal,
                "disptotal": data.disptotal,
                "applycomma": data.applycomma,
                "norepeat": data.norepeat,
                "zerooff": data.zerooff,
                "hidden": data.hidden,
                "font": "",
                "color": "",
                "defcolor": "T",
                "dblclick": "",
                "cf": [{
                    "expr": "",
                    "style": ""
                }]

            };

            if (data.hyperLink) {
                //means hyperlink Data exists

                var extraColHypPosData = presWizardData.extraData.hyperlinks;
                if (!extraColHypPosData)
                    extraColHypPosData = presWizardData.extraData.hyperlinks = {};
                // extraColHypPosData[data.name] = 
                var hypLikData = presWizardData.iviews.hyperlinks;
                if (!hypLikData)
                    var hypLikData = presWizardData.iviews.hyperlinks = [];
                //need to validate before pushing
                var existingIdx = extraColHypPosData[data.name];
                if (existingIdx === undefined) {
                    hypLikData.push(data.hyperLink);
                } else {
                    hypLikData[existingIdx] = data.hyperLink;
                }

                extraColHypPosData[data.name] = hypLikData.length - 1;
            }
        }

        objtoAdd[index] = dataToAdd;
    } else if (type === "tparams") {
        var extraParamData = presWizardData.extraData.params;
        if (!extraParamData)
            var extraParamData = presWizardData.extraData.params = [];
        if (isFirstTime) {
            extraParamData.push(data);
            return extraParamData.length - 1;
        } else {
            extraParamData[index] = data;
            return index;
        }

    } else if (type === "params") {
        var ivParData = presWizardData.iviews.params;
        if (!ivParData)
            var ivParData = presWizardData.iviews.params = [];
        ivParData.push(data);
    }
}


function moveColsUpDwn(keyCode) {
    // var keyCode = event.keyCode;
    var presFocussedElem = $('#ivColCollctnWrppr .collection-item.highlighted');
    if (presFocussedElem.length === 0) return;
    // if(presFocussedElem.length === 0)
    if (keyCode === 38) {
        // event.preventDefault();
        var prevFocsElem = presFocussedElem.prevAll('.srchSlcted').first();
        if (prevFocsElem.length !== 0) {
            if (!prevFocsElem.is(":visible")) {

                $('#ivColCollctnWrppr .collection-item.srchSlcted:visible').last().hide();

            }
            presFocussedElem.removeClass('highlighted')
            prevFocsElem.show().addClass('highlighted');
        }
    } else if (keyCode === 40) {
        // event.preventDefault();
        var nexFocsElem = presFocussedElem.nextAll('.srchSlcted').first();
        if (nexFocsElem.length !== 0) {
            if (!nexFocsElem.is(":visible")) {

                $('#ivColCollctnWrppr .collection-item.srchSlcted:visible').first().hide();

            }
            presFocussedElem.removeClass('highlighted')
            nexFocsElem.show().addClass('highlighted');
        }
    } else if (keyCode === 13) {
        $('#ivColCollctnWrppr .collection-item.highlighted.srchSlcted').click();

    }
}


/**
 * To genarate sql based on user selection in source type table 
 * @param  {string} calledFrom to define some condition whather its KPI or chart or some in future
 * @param  {String} extraOpt   Extra options to pass when we want for that condition some other logics for future use
 * @return {null}            No return it will change the text box value to genrated SQL
 */
function createSqlForTableData(calledFrom, extraOpt) {
    var sqlText = "SELECT ";
    var paramStr = "";
    var groupByStr = "";
    var tableandDcName = $("#widgetTstrctColumn").data("key").split("__~__");
    var tableName = tableandDcName[1];
    var transId = $("#widgetTstructName").data("key");
    var selectedColLength = selectedCols.length;
    if (calledFrom === "kpi") {
        if (extraOpt !== "*") {
            $("#extraColMSTo option").each(function (index, el) {
                var elemVal = $(this).val();
                paramStr += elemVal + ",";
                groupByStr += elemVal + ",";
            });
        }
    } else {
        if (selectedColLength > 0) {

            var cc = $('#widgetTableRemData').data("cc");
            var fields = chartConfiguration[cc].fields;

            for (var i = 0; i < selectedColLength; i++) {
                var presentCol = selectedCols[i]
                if (presentCol) {
                    if (fields[i].split("~").length > 1) {
                        var funVal = $("#exParamslct" + i).val();
                        var paramVal = tstructTableCols[transId + tableandDcName[0]].all[presentCol].split("__~__")[0];
                        if (funVal && funVal !== "") {
                            paramStr += funVal + "(" + paramVal + "),";
                        } else {
                            paramStr += paramVal + ",";
                        }
                        groupByStr += paramVal + ",";
                    } else {
                        var presntParam = tstructTableCols[transId + tableandDcName[0]].all[presentCol].split("__~__")[0] + ",";
                        paramStr += presntParam
                        groupByStr += presntParam;
                    }
                }

            }
        }
    }

    if (extraOpt === "*")
        var finalSql = sqlText + " * FROM " + tableName;
    else {
        if (paramStr !== "") paramStr = paramStr.slice(0, -1), groupByStr = groupByStr.slice(0, -1);
        if (calledFrom === "kpi")
            var finalSql = sqlText + paramStr + " FROM " + tableName;
        else
            var finalSql = sqlText + paramStr + " FROM " + tableName + " group by " + groupByStr;
    }
    if (!tableSqlCm)
        $("#whrCls").val(finalSql).text(finalSql)
    else {
        tableSqlCm.refresh();
        tableSqlCm.getDoc().setValue(finalSql);
    }
}

function createJsonToSend() {
    if (widgetType != "iview") {
        if ($("#multiselect_to option").length === 0) {
            showAlertDialog("warning", widgetMessages.noRoles);
            return
        }
    }

    if (validateBeforeSave() !== true) {
        return
    }




    if (widgetType === "iview") {
        var extraParamData = presWizardData.extraData.params;

        var i = 0;
        presWizardData.iviews.dispparam = "T";
        var status = true;
        var tmpParamName = [];
        $("#ivParamMainWrapper .ivEchPramWrapper").each(function (index, el) {
            var elem = $(this);
            var pName = elem.find('.pName').val();
            if (pName !== "") {
                if ($.inArray(pName, tmpParamName) === -1) {
                    tmpParamName.push(pName);
                } else {
                    elem.find('.pName').focus();
                    status = false;
                    return false;
                }

                var presPindex = $(this).data('tmpIndex');
                if (presPindex !== undefined) {
                    i++;
                    var data = extraParamData[presPindex];
                    data.ordno = i.toString();
                    createUpdateIvJsonData("params", data);
                } else {
                    var pNameVal = elem.find('.pName').val();
                    if (pNameVal !== "") {
                        i++;
                        var tmpObjToUpdate = {};
                        tmpObjToUpdate.qryname = "Task1";
                        tmpObjToUpdate.name = pNameVal;
                        tmpObjToUpdate.caption = pNameVal;
                        tmpObjToUpdate.datatype = elem.find('select.pType').val();
                        tmpObjToUpdate.expr = "";
                        tmpObjToUpdate.suggest = "F";
                        tmpObjToUpdate.vexpr = "";
                        tmpObjToUpdate.hidden = "F";
                        tmpObjToUpdate.sql = "";
                        tmpObjToUpdate.decimals = "0";
                        tmpObjToUpdate.width = "200";
                        tmpObjToUpdate.value = elem.find('.pVal').val() || "";
                        tmpObjToUpdate.moe = "Accept";
                        tmpObjToUpdate.ordno = i.toString();
                        createUpdateIvJsonData("params", tmpObjToUpdate);
                    }
                }
            }
        });

        if (presWizardData.iviews.viewtype !== "Interactive") {
            var columsData = presWizardData.iviews.cols;
            for (var i = 0; i < columsData.length; i++) {
                var presColData = columsData[i];
                if (presColData.disptotal === "T") {
                    presWizardData.iviews.gtotal = "T";
                    break;
                }
            }
        }
        if (!status) {
            showAlertDialog("warning", widgetMessages.paramNameExists);
            return false;
        }




        $("#ivColCollctnWrppr .collection-item.srchSlcted").each(function (index, el) {
            var presIndex = $(this).find('.ciColWrapper').data("original");
            presWizardData.iviews.cols[presIndex].ordno = (index + 1).toString();


        });
    }
    callParentNew("loadFrame()","function");// parent.loadFrame();
   

    // console.log(presWizardData.iviews);


    var finalJson = {};
    finalJson.wdgtType = widgetType;
    var widgetTitle = $("#widgetTitle").val();
    widgetTitle = htmlEntity("encode", widgetTitle);
    finalJson.wdgtTtl = widgetTitle;


    //need to remove the below code
    // if (widgetType === "iview") {
    //     $("#widgetPanelWrapper").append(getPanelHtml(widgetType, widgetTitle, 999)); //(type, title, target)
    //     var presentObj = widgetTableData["w" + 999] = {};
    //     presentObj.title = widgetTitle;
    //     presentObj.type = widgetType;
    //     wizardObj.resetTheWizard();
    //     $('#wizardModal').modal('close');
    //     setTimeout(function() {
    //         var data = {};
    //         data.qrData = {};
    //         data.qrMData = {};
    //         // var parsedHyperLink = parseHyperLink(qryMetaData, qryData[0]);
    //         data.type = widgetType;
    //         createAxpertWidget(data, "axWidget" + 999);
    //     }, 500)
    //     return;
    // }



    var selectdSqlSrc = $("input[name='widgetSqlSource']:checked").data('val');
    finalJson.srcType = selectdSqlSrc;
    if (selectdSqlSrc === "sql") {
        finalJson.sql = mainSqlCM.getDoc().getValue();
    } else if (selectdSqlSrc === "tbl") {
        finalJson.sql = tableSqlCm.getDoc().getValue();
        var tableData = finalJson.tableData = {};
        tableData.transId = $("#widgetTstructName").data("key");
        tableData.tName = $("#widgetTstructName").val();
        tableData.tblCptn = $("#widgetTstrctColumn").val();
        tableData.dcTableName = $("#widgetTstrctColumn").data("key"); //dc2__~__axp_chartconfig (dcname__~__tableName)
        if (widgetType === "chart") {
            var tableExtraData = tableData.exCols = {};
            var chartConfigKey = $("#chartSelData a.selected").data('cc');
            tableExtraData.cck = chartConfigKey; //chart configuration key
            tableExtraData.data = {};
            var presentConfig = chartConfiguration[chartConfigKey];
            var presenCnfgFlds = presentConfig.fields;
            for (var i = 0; i < presentConfig.fieldsCount; i++) {
                var presntFld = presenCnfgFlds[i];
                presntFld = presntFld.split("~");
                var caption = $("#extraParamFld0").val();
                var colNameType = $("#extraParamFld0").data("key"); //flinkname__~__c (ColumnName__~__type)
                if (presntFld.length > 1) {
                    var fnVal = "";
                    if (presntFld[1] === "fun") {
                        fnVal = $("#exParamslct" + i).val() || "";
                    }
                    tableExtraData.data[presntFld[0]] = caption + "__~__" + colNameType + "__~__" + fnVal;
                } else {
                    tableExtraData.data[presntFld[0]] = caption + "__~__" + colNameType;
                }
            }
        }
    }

    if (widgetType === "chart") {
        var chartType = $("#chartSelData a.selected").data('type');
        finalJson.chrtType = chartType;
        finalJson.attrs = {
            ori: $("chartOrientation").val(),
            xAxisL: $("#chartXaxisLabel").val(),
            yAxisL: $("#chartYaxisLabel").val(),
            shwLgnd: $("#shwLgnd").is(":checked"),
            gradClrChart: $("#gradienChartInp").is(":checked")
        }
    }
    if (widgetType === "iview") {
        finalJson.attrs = {
            ivName: presWizardData.iviews.ivname
        }
    } else {
        finalJson.group = $("#widgetGroupsInp").val();

        var roles = "";
        $("#multiselect_to option").each(function (index, el) {
            roles += $(this).val() + ",";
        });

        finalJson.rty = roles.slice(0, -1);



    }


    if (widgetType === "iview") {
        var dataTosend = {};
        dataTosend.iviews = presWizardData.iviews;
        ajaxCallObj.crudIview(dataTosend, finalJson);
    } else {

        ajaxCallObj.addDetails(finalJson, "insert");
    }


}


function validateBeforeSave() {
    if (widgetType === "chart" || widgetType === "kpi" || widgetType === "iview") {
        if (widgetType === "chart")
            var validateKeys = wizardObj.chartWizard.validateKeys;
        else if (widgetType === "kpi")
            var validateKeys = wizardObj.kpiWizard.validateKeys;
        else if (widgetType === "iview")
            var validateKeys = wizardObj.iviewWizard.validateKeys;

        if (validateKeys && validateKeys.length) {
            for (var i = 0; i < validateKeys.length; i++) {
                var presKey = validateKeys[i];
                var validationRes = doTheValidations(presKey);
                if (validationRes !== true) {
                    showAlertDialog("warning", validationRes);
                    return false
                }
            }
        }
    }
    return true;
}

function doTheValidations(validateKeyName) {
    if (validateKeyName != "") {
        if (validateKeyName === "chtType") {
            if ($("#chartSelData").data("isCompleted") != true)
                return widgetMessages.noChart;
        } else if (validateKeyName === "ivrt") {
            if ($("#iviewType").data('isComp') != "true")
                return widgetMessages.noIviewType;
        } else if (validateKeyName === "query") {
            if (widgetType === "iview") {
                if (!testRegex("noSpecialCharactersAndNotStartingWithNumber", $("#iviewName").val())) {
                    $("#iviewName").focus();
                    return widgetMessages.invalidIviewName;
                }
                if ($("#iviewName").hasClass('notValidated')) {
                    $("#iviewName").focus();
                    return widgetMessages.iviewNameAlreadyExists;
                }
                if ($("#iviewName").val() === "") {
                    $("#iviewName").focus();
                    return widgetMessages.noIviewName;
                }


            }

            var ttlName = $("#widgetTitle").val()
            if (ttlName === "") {
                $("#widgetTitle").focus();
                if (widgetType === "iview") {
                    return widgetMessages.noCaption;
                } else {
                    return widgetMessages.noTitle;
                }
            } else if (widgetType === "iview" && !testRegex("validName", ttlName)) {
                $("#widgetTitle").focus();
                return widgetMessages.invalidCaption;
            }

            var selectdSqlSrc = $("input[name='widgetSqlSource']:checked").data('val');
            if (selectdSqlSrc === "sql") {
                if ($("#wizardNextbtn").hasClass('iAmClicked')) return;
                if ($("#wizardNextbtn").hasClass('validated')) {
                    return true
                } else {
                    var sql = mainSqlCM.getDoc().getValue();
                    if (!sql)
                        return widgetMessages.validSql;
                    var loaderHtml = '<div class="btnLoader preloader-wrapper small active">';
                    loaderHtml += '<div class="spinner-layer spinner-white-only">';
                    loaderHtml += '<div class="circle-clipper left">';
                    loaderHtml += '<div class="circle"></div>';
                    loaderHtml += '</div><div class="gap-patch">';
                    loaderHtml += '<div class="circle"></div>';
                    loaderHtml += '</div><div class="circle-clipper right">';
                    loaderHtml += '<div class="circle"></div>';
                    loaderHtml += '</div></div></div>';
                    $("#wizardNextbtn").html(loaderHtml).addClass('iAmClicked');
                    var sql = mainSqlCM.getDoc().getValue();
                    ajaxCallObj.isValidQuery(sql, "query");
                    return;

                }
            } else if (selectdSqlSrc === "tbl") {
                // if($("#widgetTstructName").val() === ""){
                //     $("#widgetTstructName").focus();
                //     return widgetMessages.mandatoryFld;
                // }
                var errMsg = true;
                $("#queryData .autocompleteMe").each(function (index, el) {
                    var presElm = $(this);
                    if (presElm.data('key') === undefined) {
                        presElm.focus();
                        errMsg = widgetMessages.mandatoryFld;
                        return;
                    }
                    // fld.data('key') ? true : false;
                });

                if (errMsg != true) {
                    return errMsg;
                }

                if (widgetType === "kpi" || widgetType === "iview") {
                    if ($("#extraColMSTo option").length === 0)
                        return widgetMessages.atleastOneCol;
                }



                if ($("#wizardNextbtn").hasClass('iAmClicked')) return;
                if ($("#wizardNextbtn").hasClass('validated')) {
                    return true
                } else {
                    var sql = tableSqlCm.getDoc().getValue();
                    if (!sql)
                        return widgetMessages.validSql;
                    var loaderHtml = '<div class="btnLoader preloader-wrapper small active">';
                    loaderHtml += '<div class="spinner-layer spinner-white-only">';
                    loaderHtml += '<div class="circle-clipper left">';
                    loaderHtml += '<div class="circle"></div>';
                    loaderHtml += '</div><div class="gap-patch">';
                    loaderHtml += '<div class="circle"></div>';
                    loaderHtml += '</div><div class="circle-clipper right">';
                    loaderHtml += '<div class="circle"></div>';
                    loaderHtml += '</div></div></div>';
                    $("#wizardNextbtn").html(loaderHtml).addClass('iAmClicked');
                    ajaxCallObj.isValidQuery(sql, "query");
                    return;

                }


            }

        } else if (validateKeyName == "attrs") {
            var isError = true;

            // invalidName
            var grpName = $("#widgetGroupsInp").val();

            if (grpName !== "")
                var isNew = $.inArray(grpName, groups) === -1;

            if (!testRegex("specialCharsOnly", grpName))
                return widgetMessages.invalidName;

            if (isNew && groups.length >= maxNoOfGroups) {
                return widgetMessages.maxGroups;
            }


            $("#appearanceData .mandatoryFld").each(function (index, el) {
                var elem = $(this);
                if (elem.val() === "") {
                    elem.focus();
                    isError = widgetMessages.mandatoryFld;
                    return;
                }
            });

            return isError;
        } else if (validateKeyName == "rl") {
            if ($("#multiselect_to option").length === 0)
                return widgetMessages.noRoles;
            return true;
        }
        return true;
    } else {
        return true;
    }
}



function getPanelHtml(type, title, targetId) {
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
    htmlToReturn += '<div id="axWidget' + targetId + '" data-id=' + targetId + ' data-type="' + type + '" class="col s12 m4 l3 widgetWrapper">';
    htmlToReturn += '<div class="card hoverable ">';
    if (type !== "table" && type !== "kpi") {
        htmlToReturn += '<div class="cardTitleWrapper">';
        htmlToReturn += '<i class="' + iconClass + '"></i>';
        htmlToReturn += `<span class='cardTitle'>${title}</span>`;
        // htmlToReturn += '<button type="button" class="cardTitleClear btn-flat waves-effect btn-floating right"><i class="icon-cross2"></i></button>';
        htmlToReturn += '<div class="clear"></div>';
        htmlToReturn += '</div>';
    }
    htmlToReturn += '<div class="cardContentMainWrapper">';
    htmlToReturn += '<button type="button" title="Delete Widget" class="cardTitleClear titleLessCardTitleClear  red waves-effect btn-floating right"><i class="icon-cross2"></i></button>';
    if (type == "chart" || type == "table" || type == "kpi" || type == "iview") {
        htmlToReturn += '<div class="card-content ' + type + '">';
        htmlToReturn += '<div class="cardContentData">';
        htmlToReturn += '</div>';
        htmlToReturn += '<div class="cardContentLoader valign-wrapper">';
        htmlToReturn += '<div class="preloader-wrapper small active">';
        htmlToReturn += '<div class="spinner-layer themeBorderColor spinner-green-only">';
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
        // if (type != "widget") {
        //     htmlToReturn += '<div class="fixed-action-btn vertical click-to-toggle">';
        //     htmlToReturn += '<a class="btn-floating halfway-fab waves-effect waves-light">';
        //     htmlToReturn += '<i class="icon-plus"></i>';
        //     htmlToReturn += '</a>';
        //     htmlToReturn += '</div>';
        // }

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

// function makeMeInitCap(name) {
//     if (name && name != "") {
//         name = customizeData(name);
//         if (name.toLowerCase().indexOf("axphide") !== -1) {
//             return name.toLowerCase();
//         }
//         name = name.replace(/_/g, " ");
//         var capitalizedString = name.toLowerCase().replace(/\b[a-z]/g, function(letter) {
//             return letter.toUpperCase();
//         });
//         return capitalizedString;
//     } else {
//         return name;
//     }
// }

function createDatatable(task) {
    if (presentView == "widget" && !closeProprtySht())
        return
    $("#gridWdgtToggleBtn span").toggleClass('icon-list icon-grid');
    if (task == "new") {
        presentView = "table";
        $("#widgetDataTableWrapper").show();
        $("#widgetPanelWrapper").hide();
        if (!dataTableApi)
            createGridDatatble();
        else
            dataTableApi.columns.adjust().draw();
        $("#gridWdgtToggleBtn").attr({ 'onclick': 'createDatatable("showWidget")', "title": "Widget View" });


        $(".AXpaginationWrapper").hide();
    } else if (task == "showWidget") {
        presentView = "widget";
        $(".AXpaginationWrapper").show();
        $("#widgetDataTableWrapper").hide();
        $("#widgetPanelWrapper").show();
        // if ($("#gridWdgtToggleBtn").hasClass('changesAvailable')) {
        //    $("#gridWdgtToggleBtn").removeClass('changesAvailable');
        var srch = $("#mainSearchFld").val();
        // if (srch === "") {
        //     $('.pagination-wrapper').data("AXPAGINATION") ? $('.pagination-wrapper').createAxPagination("rearrange") : createPagination();
        //     // $('.pagination-wrapper').createAxPagination("rearrange");
        // } else
        $("#mainSearchFld").val(srch).keyup();

        if ($('#matcolumnSearch').hasClass('clicked')) {
            $('#matcolumnSearch').removeClass('clicked');
            var btnTxt = $('#matcolumnSrchBtn').text().toLowerCase();
            $('#matcolumnSrchBtn').text("").attr('title', '');
            $("#matcolumnSearch li[data-id='" + btnTxt + "']").click();
        }
        // yyyy

        // }
        $("#gridWdgtToggleBtn").attr({ 'onclick': 'createDatatable("showTable")', "title": "List View" });
    } else if (task == "showTable") {
        presentView = "table";
        $("#widgetDataTableWrapper").show();
        $(".AXpaginationWrapper").hide();
        $("#widgetPanelWrapper").hide();
        if (newWidgetData) {
            newWidgetData = false;
            dataTableApi.destroy();
            createGridDatatble();

            dataTableApi.search($("#mainSearchFld").val()).draw();

        } else {
            if (dataTableApi)
                dataTableApi.columns.adjust().draw();
        }


        $("#gridWdgtToggleBtn").attr({ 'onclick': 'createDatatable("showWidget")', "title": "Widget View" });
    }

}

function createGridDatatble() {
    $(".AXpaginationWrapper").hide();
    var cutMsg = eval(callParent('lcm[0]'));
    dataTableApi = $('#widgetDataTableWrapper #wdgtDataTable').DataTable({
        "aaData": widgetTableData.data,
        "order": [],
        "scrollY": "300px",
        "scrollCollapse": true,
        language: {
            "emptyTable": cutMsg
        },
        // searching: false,
        "fnDrawCallback": function () {
            if ($('#wdgtDataTable_paginate span a.paginate_button').length <= 0) {
                $('#wdgtDataTable_paginate,#wdgtDataTable_info').hide();
                //$('.dataTable')[0].style.display = "none";
                //$('#wdgtDataTable_info')[0].style.display = "none";
                //$('.dataTables_scrollBody').css("border-bottom", "none")
            } else {
                $('#wdgtDataTable_paginate,#wdgtDataTable_info').show();
                //$('.dataTable')[0].style.display = "block";
                //$('#wdgtDataTable_info')[0].style.display = "block";
                //$('.dataTables_scrollBody').css("border-bottom", "1px solid #111")
            }
        },
        "aoColumns": [{
            "mDataProp": "id"
        }, {
            "mDataProp": "title"
        }, {
            "mDataProp": "widget_type"
        }, {
            "mDataProp": "id"
        }],
        "columnDefs": [
            {
                "targets": 0,
                "orderable": false
            },
            {
                // The `data` parameter refers to the data for the cell (defined by the
                // `data` option, which defaults to the column being worked with, in
                // this case `data: 0`.
                "render": function (data, type, row) {
                    // var button = '<button data-id=' + data + ' id=editWidg' + data + ' title="Edit" type="button" onclick="editDeleteTheRow(\'' + data + '\',\'edit\')" class="iconSelector editDelBtn waves-effect btn-flat icon-pencil"></button><button title="Delete" type="button" onclick="editDeleteTheRow(\'' + data + '\',\'delete\')" class="text-red editDelBtn waves-effect btn-flat icon-cross2"></button>';
                    var button = '<button data-id=' + data + ' title="Delete" type="button" onclick="editDeleteTheRow(\'' + data + '\',\'delete\')" class="text-red editDelBtn waves-effect btn-flat icon-cross2"></button>';
                    return button;
                },
                "targets": 0
            },
            {
                // The `data` parameter refers to the data for the cell (defined by the
                // `data` option, which defaults to the column being worked with, in
                // this case `data: 0`.
                "render": function (data, type, row) {
                    var presentObj = widgetTableData["w" + data];
                    if (presentObj)
                        return presentObj.sql || "";
                    else
                        return "";
                },
                "targets": 3
            },
            { width: "30%", targets: 2 },
            { width: "30%", targets: 1 },
            { width: "40%", targets: 3 },
            { width: 70, targets: 0 }
            // { "visible": false, "targets": [3] }
        ]

    });
}


function editDeleteTheRow(id, task, elem) {
    if (task === "delete") {
        createConfirmBox("deleteWidget", eval(callParent('lcm[9]')), id);
    } else if (task === "edit") {

        var wId = id;
        var presentObj = widgetTableData["w" + wId];
        var type = presentObj.type;
        if (type === "chart") {
            var cType = presentObj.cType;
            var ex = chartExamples[cType] || "";
            $("#sqlEdtExData").html(ex);
            // $("#sqlEdtExData,#sqlEdtExmpleBtn").show();
            $("#sqlEdtExData,#sqlEdtExmpleBtn").hide();
        } else if (type === "kpi") {
            $("#sqlEdtExData,#sqlEdtExmpleBtn").hide();
            // $("#sqlEdtExData").html(getKpiHtml());
        }
        // var type = elem.data('type');

        // var idOfElem = elem.attr('id');
        var title = presentObj.title;
        var SQL = presentObj.sql;
        var SelectedRoles = presentObj.roles || "";
        // var kpiColor = type == "kpi" ? elem.find('.colorMe').data('kpicolor') : false;
        //clear all the values
        clearPropertySheet();
        var cTypeToShw = type.toLowerCase() === "table" ? "kpi" : type;
        $("#prpShtComponent").text(cTypeToShw);
        $("#prpShtTitle").val(htmlEntity("decode", title));
        $("#prpShtTxtBx").data("id", wId).val(SQL);
        var rolesData = widgetTableData.allRoles;
        var rolesDataLngth = rolesData.length;
        var optionHtml = "";
        for (var i = 0; i < rolesDataLngth; i++) {
            optionHtml += '<option selected title="' + rolesData[i] + '" value="' + rolesData[i] + '">' + rolesData[i] + '</option>';
        }
        if (rolesDataLngth === 0) {
            optionHtml += '<option disabled >No Roles assigned</option>'
        }
        $('#prpShtRoles').material_select('destroy');
        ajaxCallObj.getWidgetRoles(wId, optionHtml);
        // openProprtySht(type, idOfElem);


        // var kpiColor = prsntJsonObj.kpiColor

        // if (kpiColor) {
        //     ChangePropertySheet("kpiWidgetClicked");
        //     $("#gradientPicker").attr('class', 'colorMe ' + kpiColor + ' center-align');
        //     $("#gradientPicker a").data('color', kpiColor).text(kpiColor);
        // } else {
        $("#prpShtApprRelated").addClass('notSearchable').hide();
        // }
        openProprtySht("type", "editWidg" + id, "calledFrom");
        $("#gridWdgtToggleBtn").addClass('changesAvailable');
    }
}

function updateDiscardPropSheet(task) {
    if (!jQuery.isEmptyObject(updateObj)) {
        if (task === "revert") {
            revertThePropSheet();
            return;
        }
        if (!validateBeforeUpdatePrpSht()) return;
        closeProprtySht("manualSave")
    } else {
        showAlertDialog("warning", widgetMessages.noChanges)
    }
}

function changeTheValue(elem, task) {
    elem = $(elem);
    var val = elem.val();
    var targetId = elem.parents("#propertySheet").data('target');

    //in value special chars are converting to entity like < &lt;

    val = htmlEntity("encode", val);

    if (task === "title")
        $("#" + targetId + " .cardTitle").html(val);

    updateTmpObjBeforeSave("ttl", "wdgtTtl", val);
}


$('#prpShtRoles').change(function () {
    var selRoles = $('#prpShtRoles').val();
    selRoles = selRoles.toString();
    if (selRoles == "") {
        showAlertDialog("warning", "select atleast one!");
    }
    updateTmpObjBeforeSave("rty", "rty", selRoles);
});


function createPagination() {
    // if ($("#widgetPanelWrapper .widgetWrapper").length <= widgetsPerPage)
    //     return;

    if ($("#widgetPanelWrapper .widgetWrapper").length <= widgetsPerPage) {
        $(".pagination-wrapper").hide();
    } else {
        $(".pagination-wrapper").show();
    }




    $('.pagination-wrapper').createAxPagination({
        target: "#widgetPanelWrapper",
        itemClass: 'widgetWrapper',
        itemsPerPage: widgetsPerPage,
        nextIcnClass: 'hoverFocusThemeColor icon-chevron-right',
        prevIcnClass: 'hoverFocusThemeColor icon-chevron-left',
        afterPageShow: function (pageNo) {
            // chartResize("AXpage" + pageNo + " .widgetWrapper");
            demandArray = [];
            $("#AXpage" + pageNo + " .widgetWrapper").each(function (index, el) {
                var elem = $(this);
                if (!elem.hasClass('errorOccured')) {
                    var wId = elem.data('id');
                    if (!elem.hasClass('widgetCreated')) {
                        demandArray.push(wId);
                        var apiCalledFor = widgetTableData.apiCalledFor;
                        var isAlreadyCallMade = $.inArray(wId, apiCalledFor) !== -1;
                        if (!isAlreadyCallMade)
                            ajaxCallObj.getAxpertWidgetDetails({ tId: "new", widgetId: wId });
                    }
                    var presentObj = widgetTableData["w" + wId];
                    if (presentObj && presentObj.sql) {
                        var targetId = "axWidget" + wId;
                        createAxpertWidget(presentObj, targetId);
                    }
                }
            });

            // alert(pageNo)
            // console.log(widgetTableData)
        },
        onPageClick: function (presentPage, elem) {
            if ($(elem).hasClass('active'))
                return true

            if (!$(elem).hasClass('manualClick')) {
                if (!closeProprtySht("onPageClick", elem))
                    return false
            } else {
                $(elem).removeClass('manualClick')
            }



            $("#AXpage" + presentPage + " .widgetWrapper").each(function (index, el) {
                var elem = $(this);
                elem.removeClass('widgetSetted');
                var index = elem.find('.cardContentData').data("highcharts-chart");
                if (index !== undefined) {
                    var chart = Highcharts.charts[index];
                    if (chart)
                        chart.destroy();
                }
            });
            // alert("onclick")
            return true;
        }
    });
}


function addDeleteIvParamRow(elem, task) {
    elem = $(elem);
    var maxIndex = $("#ivParamMainWrapper").data('index') || 1;
    if (task === "add") {
        var mainParent = elem.parents('.ivEchPramWrapper');
        var presFld = $("<div class='ivEchPramWrapper row'>" + mainParent.html() + "</div>").insertAfter(mainParent);
        $(presFld).find('.slctFld').html('<select>' + mainParent.find('.slctFld select').html() + '</select>')

        $(presFld).find('.pName').prop('disabled', false);
        $(presFld).find('.pName,select.pType,.pVal').val("");
        $(presFld).find('.slctFld select').material_select();
        $("#ivParamMainWrapper").data('index', maxIndex + 1);
    } else if (task === "delete") {
        var mainParent = elem.parents('.ivEchPramWrapper');
        var tmpIndxVal = mainParent.data('tmpIndex');
        if (tmpIndxVal !== undefined) {
            presWizardData.extraData.params[tmpIndxVal] = null;
        }
        if (mainParent.find('.pName').is(":disabled")) {
            showAlertDialog("warning",widgetMessages.paramsInUse);
            return;
        }
        if ($("#ivParamMainWrapper .ivEchPramWrapper ").length === 1 && elem.parents('.ivEchPramWrapper').index() === 0) {
            mainParent.find('.pName,select.pType,.pVal').val("");

            return
        }
        elem.parents('.ivEchPramWrapper').remove();
        $("#ivParamMainWrapper").data('index', maxIndex - 1);
    }
}

function moveIvParamUpDwn(elem, task) {
    elem = $(elem);
    var mainParent = elem.parents('.ivEchPramWrapper');
    if (task === "up") {
        if (mainParent.index() !== 0) {
            mainParent.insertBefore(mainParent.prev());
        }
    } else if (task === "down") {
        if (mainParent.index() !== $("#ivParamMainWrapper .ivEchPramWrapper ").last().index()) {
            mainParent.insertAfter(mainParent.next());
        }
    }
}






/**
 * To update the obj of prs wizard when fld blur
 * @param  {Object} elem blurred field value
 * @param  {String} key 
 * @return {null}      [description]
 */
function updateTheWizObj(elem, key) {
    if ($(elem).val() !== "")
        presWizardData.isDirty = true;
    if (widgetType === "iview") {
        if (key === "cptn") {
            //need to add some validations
            presWizardData.iviews.ivcaption = $(elem).val();
        } else if (key === "ivname") {
            // presWizardData.iviews.ivname = $(elem).val();
            // ajaxCallObj..
            elem = $(elem);
            var iName = elem.val();
            if (presWizardData.iviews)
                presWizardData.iviews.ivname = iName;
            elem.addClass('notValidated')
            ajaxCallObj.validateIvName(iName);
        }
    }
}


// function checkTheFld(fld, type) {
//     if (type === "autoCom") {
//         return fld.data('key') ? true : false;
//     } else {
//         if (fld.val() === "") {

//         }
//     }
// }





/**
 * When user click on revert button in property sheet this function will revert the values to original state
 * @param  {Object} updateObj will have what user changed in propert sheet
 * @return {null}           no return
 */
function revertThePropSheet() {
    var title = updateObj.wdgtTtl;
    var attrs = updateObj.attrs;
    var wdid = $("#propertySheet").data("target");
    var wId = wdid.substr(8);
    var presWidgetTableData = widgetTableData["w" + wId];
    if (title !== undefined) {
        var oldTtl = presWidgetTableData.title;
        $("#" + wdid + " .cardTitle").text(oldTtl);
        $("#prpShtTitle").val(htmlEntity("decode", oldTtl));
    }
    if (attrs) {
        var oldAttrs = presWidgetTableData.attr;




        var oldKpiColor = "blue"; //if its not defined in old obj by default blue will come
        var threeD = "remove";
        var shwLgnd = true;
        var shwKpiTtl = false;
        var shwVal = false;
        var isGradient = false;
        var shwChartVal = false;
        var cck = 'pallet1';
        let exposeAPI = false;
        if (oldAttrs) {
            var oldKpiObj = JSON.parse(oldAttrs);
            oldKpiColor = oldKpiObj.kpiColor;
            oldKpiColor = oldKpiColor === undefined ? "blue" : oldKpiColor
            threeD = oldKpiObj.threeD;
            threeD = threeD === undefined ? "remove" : threeD;
            shwLgnd = oldKpiObj.shwLgnd;
            shwLgnd = shwLgnd === undefined ? true : shwLgnd;
            shwKpiTtl = oldKpiObj.shwKpiTtl;
            shwKpiTtl = shwKpiTtl === undefined ? false : shwKpiTtl;
            shwVal = oldKpiObj.shwVal;
            shwVal = shwVal === undefined ? false : shwVal;
            isGradient = oldKpiObj.gradClrChart;
            isGradient = isGradient === undefined ? false : isGradient;
            cck = oldKpiObj.cck;
            cck = cck === undefined ? "pallet1" : cck;
            shwChartVal = oldKpiObj.shwChartVal;
            shwChartVal = shwChartVal === undefined ? false : shwChartVal;
            exposeAPI = oldKpiObj.exposeAPI ? true : false;
        }
        if (attrs.kpiColor !== undefined) {
            gradientClick('colorPick', oldKpiColor)
        }

        if (attrs.exposeAPI !== undefined) {
            $("#prpShtAPIswitch").prop('checked', exposeAPI);
            chnageKpiChartView('exposeAPI', exposeAPI, 'exposeAPI');
        }

        if (attrs.threeD !== undefined) {
            var isChecked = threeD === "create";
            $("#prpSht3DChrt").prop('checked', isChecked);
            chnageKpiChartView('3d', threeD, 'chart');
            // var presChrtIndex = $("#" + wdid).find('.cardContentData').data("highchartsChart");
            // agileChartsObj.makeChartThreeD(threeD, presChrtIndex);
        }

        if (attrs.shwLgnd !== undefined) {
            $("#prpShtShwLgnd").prop('checked', shwLgnd);
            chnageKpiChartView('shwLgnd', shwLgnd, 'chart')
            // var presChrtIndex = $("#" + wdid).find('.cardContentData').data("highchartsChart");
            // agileChartsObj.toggleLgnds(shwLgnd, presChrtIndex);
        }

        if (attrs.shwKpiTtl !== undefined) {
            $("#prpShtshwKpiTtl").prop('checked', shwKpiTtl);
            chnageKpiChartView('kpttl', shwKpiTtl, 'kpi')
        }
        if (attrs.shwVal !== undefined) {
            $("#prpShtShwValForPie").prop('checked', shwVal);
        }
        if (attrs.gradClrChart !== undefined) {
            if (typeof isGradient !== 'boolean') {
                isGradient = isGradient === 'true';
            }
            $("#prpShtGradientChrt").prop('checked', isGradient).change();
        }
        if (attrs.cck !== undefined) {
            var chartColorCodes = "";
            if (cck === "custom") {
                var oldVal = oldKpiObj.cccv;
                chartColorCodes = oldVal;
            }
            chartColorChanger("colorSet", cck, chartColorCodes, false);
            // $("#chartColorChangerSlctBx").val(cck).data('isManualChange', true).change();
            // $(".chartColorPalletWrapper").hide();
        }
        if (attrs.shwChartVal !== undefined) {
            $("#prpShtShwChrtVal").prop('checked', shwChartVal);
            chnageKpiChartView('shwChartVal', shwChartVal, 'chart')
        }

    }
    if (updateObj.rty) {
        $("#prpShtRoles").val(presWidgetTableData.roles);
        $('#prpShtRoles').material_select();
    }

    if (updateObj.group) {
        $("#prpShtGrpWrapper select").val(presWidgetTableData.grpName);
        $('#prpShtGrpWrapper select').material_select();
    }

    updateObj = {};
}



/**
 * To update the tempObj details (updateObj) when user is changing something in property sheet (ON revert we can)
 * @return {null} no return 
 */
function updateTmpObjBeforeSave(task, key, val) {

    if (task === "attr") {
        var wId = $("#propertySheet").data("target").substr(8);

        if (!updateObj.attrs) {
            var oldAtrData = widgetTableData["w" + wId].attr
            if (oldAtrData)
                oldAtrData = JSON.parse(oldAtrData);
            else
                oldAtrData = {}

            updateObj.attrs = oldAtrData;
        }


        var attrObj = updateObj.attrs;
        attrObj[key] = val;
    } else {
        if (key === "wdgtTtl") {
            if (val === "")
                $("#prpShtTitle").addClass('customFldError')
            else if (!testRegex("validName", val))
                $("#prpShtTitle").addClass('customFldError')
            else
                $("#prpShtTitle").removeClass('customFldError')
        }
        if (task === "group") {
            key = "group";
            val = $("#prpShtGrpWrapper select").val();
        }
        updateObj[key] = val;
    }
}



function chnageKpiChartView(type, elem, cat, extraOpts) {
    var widgetId = $("#propertySheet").data("target");
    if (cat === "chart") {
        var presChrtIndex = $("#" + widgetId).find('.cardContentData').attr("data-highcharts-chart");
        if (type === '3d') {
            if (typeof elem !== "object") {
                var task = elem;
            } else {
                var task = $(elem).is(":checked") ? "create" : "remove"
            }
            updateTmpObjBeforeSave("attr", "threeD", task);
            agileChartsObj.makeChartThreeD(task, presChrtIndex);
        } else if (type === "pieShwVal") {

            updateTmpObjBeforeSave("attr", "shwVal", $("#prpShtShwValForPie").is(":checked"));
        } else if (type === "shwLgnd") {
            if (typeof elem !== "object") {
                var status = elem;
            } else {
                var status = $("#prpShtShwLgnd").is(":checked");
            }
            agileChartsObj.toggleLgnds(status, presChrtIndex);
            updateTmpObjBeforeSave("attr", "shwLgnd", status);
        } else if (type === "changeColors") {
            var isGradient = $("#prpShtGradientChrt").is(":checked");
            if (extraOpts.isCustom) {
                updateTmpObjBeforeSave("attr", "cck", "custom");
                var finalColors = "";
                $("#chartCustomColors input").each(function (index, el) {
                    finalColors += $(this).val() + ",";
                });
                finalColors = finalColors.slice(0, -1);
                $("#ifCustomColorCodes").val(finalColors);
                var colors = finalColors.split(",");
                updateTmpObjBeforeSave("attr", "cccv", colors.toString());
            } else {
                updateTmpObjBeforeSave("attr", "cck", extraOpts.keyCode);
                updateTmpObjBeforeSave("attr", "cccv", "");
                var colors = customChartColors[extraOpts.keyCode];
            }

            agileChartsObj.updateColors(presChrtIndex, colors, isGradient)
        } else if (type === "gradient") {
            if (typeof elem !== "object") {
                var isGrad = elem;
            } else {
                var isGrad = $(elem).is(":checked");
                updateTmpObjBeforeSave("attr", "gradClrChart", isGrad);
            }


            var colorCode = $("#chartColorChangerSlctBx").val() || 'pallet1';
            var colorArray = "";
            if (colorCode === "custom") {
                colorArray = $("#ifCustomColorCodes").val().split(",");
            } else {
                colorArray = customChartColors[colorCode];
            }
            agileChartsObj.updateColors(presChrtIndex, colorArray, isGrad)
        } else if (type === "shwChartVal") {
            if (typeof elem !== "object") {
                var shwChrtVal = elem;
            } else {
                var shwChrtVal = $(elem).is(":checked");
                updateTmpObjBeforeSave("attr", "shwChartVal", shwChrtVal);
            }
            agileChartsObj.toggleShowValues(shwChrtVal, presChrtIndex)
        }
    } else if (cat === "kpi") {
        if (typeof elem !== "object") {
            var isChecked = elem;
        } else {
            var isChecked = $(elem).is(":checked")
        }
        if (type === "kpttl") {
            if (isChecked) {
                $("#" + widgetId).find('.kpiHeader').show();
            } else {
                $("#" + widgetId).find('.kpiHeader').hide();
            }
            updateTmpObjBeforeSave("attr", "shwKpiTtl", isChecked);
            // var 
        }
    } else if (type === "exposeAPI") {
        if (typeof elem !== "object") {
            var isChecked = elem;
        } else {
            var isChecked = $(elem).is(":checked");
            updateTmpObjBeforeSave("attr", "exposeAPI", isChecked);
        }
        if (isChecked) {
            $('#prpShtAPIuri').show();
            var apiUri = apiBase;
            apiUri += "public/" + widgetId.substr(8);
            apiUri += "?utl=" + utls;
            var apiParams = generateParamsStr("w" + widgetId.substr(8));
            if (apiParams)
                apiUri += "&#38;params=" + apiParams;
            $('#prpApiURI').html(apiUri);
            $('#prpShtAPIuriTr').show().removeClass('notSearchable');
        } else {
            $('#prpApiURI').html('');
            $("#prpShtAPIuriTr").hide().addClass('notSearchable');
        }
    }
}

function generateParamsStr(index) {
    console.log(widgetTableData[index]);
    if (widgetTableData[index] && widgetTableData[index].sql) {
        var bindKeys = widgetTableData[index].sql.match(/:\w+/g);
        console.log(bindKeys);
        var paramStr = "";
        if (bindKeys) {
            bindKeys = bindKeys.filter(function (elem, ind, self) {
                return ind == self.indexOf(elem);
            });
            for (var i = 0; i < bindKeys.length; i++) {
                paramStr += bindKeys[i].substring(1, bindKeys[i].length) + ":";
                if (i + 1 != bindKeys.length)
                    paramStr += '|';
            }
            return paramStr;
        } else {
            return null;
        }
    } else {
        return null;
    }
}

function checkDataFound(selectedRow) {
    if (selectedRow.length === 0 && $('#widgetPanelWrapper .widgetWrapper:visible').length === 0) {
        if ($('#widgetPanelWrapper .noData').length == 0) {
            $('#widgetPanelWrapper').append('<p class="noData" style="text-align: center;">No data found</p>');
        } else {
            $('#widgetPanelWrapper .noData').show();
        }
        return false;
    } else {
        $('#widgetPanelWrapper .noData').hide();
    }
}
