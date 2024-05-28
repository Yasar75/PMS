/*********
 *Smart Views extended from Interactive Report(IvIr)
 *01/01/2019(03/05/2017)
 *By Prashik + Abhishek(Manikanta)
 *
 *
 *
 *
 **********/
var maxNoOfPills = 5;
var ivirMainObj = {};
let bkpIvirMainObj = {};
var ivirMainViewObj = {};
var ivirTable = "#GridView1";
var initialChkup = {};
var ivirVisibleColumns = [];
var tmpGroupObj = {};
var fixedColumnsObj = "";
var allGrandTotal = [];
var groupingCol = "";
var pillDependentCols = {};
var numericColumns = [];
var anchorRegexPatter = /<a [^>]/;
var custBtnIVIR = "";
var oldLoadViewName = "";
var svHtmlGeneratorRef, saveViewActionRef, cancelViewActionRef, onContentReadyRef, onCloseRef, isOpenSmartStepper = false;
var dateOptions = ["Custom", "Today", "Yesterday", "Tomorrow", "This week", "Last week", "Next week", "This month", "Last month", "Next month", "This quarter", "Last quarter", "Next quarter", "This year", "Last year", "Next year"];

var dateOptionsId = ["customOption", "todayOption", "yesterdayOption", "tomorrowOption", "this_weekOption", "last_weekOption", "next_weekOption", "this_monthOption", "last_monthOption", "next_monthOption", "this_quarterOption", "last_quarterOption", "next_quarterOption", "this_yearOption", "last_yearOption", "next_yearOption"];

var dateOptionsCaption = callParentNew('lcm')[445];

var errorMessages = {
    "emptyField": eval(callParent('lcm[13]')),
    "invalidName": eval(callParent('lcm[14]')),
    "integerChk": eval(callParent('lcm[15]')),
    "emptySelect": eval(callParent('lcm[16]')),
    "chartSelection": eval(callParent('lcm[17]')),
    "columnSelection": eval(callParent('lcm[18]')),
    "downloadSelection": eval(callParent('lcm[19]')),
    "maxPills": eval(callParent('lcm[20]')),
    "duplicateFld": eval(callParent('lcm[21]')),
    "dependentColumns": eval(callParent('lcm[22]')),
    "noChartWhileGrpng": "When grouping is enabled chart cannot be viewed."
};

var advFiltersObjectToApply = {};

var regexes = {
    "validName": "^[a-zA-Z0-9][a-zA-Z0-9 ,.'_-]{0,}$"
}
var isSpecialRow = false;
var colTypes = { "c": "string", "n": "num-fmt", "d": "date" };
var colAlign = { "Left": "dt-left", "Right": "dt-right", "Center": "dt-center" };
if ($("body").attr("dir") && $("body").attr("dir") == "rtl") {
    colAlign = { "Right": "dt-left", "Left": "dt-right", "Center": "dt-center" };
}
var btnFilterApplyVal = callParentNew('lcm')[399];
var btnFilterApplyEditVal = callParentNew('lcm')[442];

let widthIncrement = 0;

let newBtnGroup = {
    params: {
        name: "params",
        task: "",
        type: "paramFilter",
        stage: "[data-dropdown-value=paramFilter]:eq(0)",
        caption: callParentNew('lcm')[478],
        icon: "search",
        open() {
            $(this.stage).click();
        },
        clear(elem) {
            $('#button2').click();
            setTimeout(() => {
                elem.prev("input").val($j("#hdnparamValues").val());
            }, 0);
        },
        apply() {

        },
        html(isEdit) {
            return svHtmlGeneratorRef(this, $(`<input value="${this.type}">`), isEdit);
        },
        get visible() {
            return false;
        },
        get value() {
            return $j("#hdnparamValues").val();
        }
    },
    charts: {
        name: "charts",
        task: "chart",
        type: "chart",
        stage: "#chartActionLi[data-dropdown-value=chart]:eq(0)",
        caption: callParentNew('lcm')[402],
        icon: "pie_chart",
        open() {
            $(this.stage).click();
        },
        clear() {

        },
        apply(indexOfArray, isPillChecked) {
            ivirCreateChart(indexOfArray, isPillChecked);
        },
        html(isEdit) {
            return svHtmlGeneratorRef(this, $(`<input value="${this.type}">`), isEdit);
        },
        get visible() {
            return false
        },
        get value() {
            return ivirMainObj.chart && ivirMainObj.chart[0] && JSON.stringify(ivirMainObj.chart[0]) || "";
        }
    },
    filters: {
        name: "filters",
        task: "filter",
        type: "moreFilters",
        stage: "[data-dropdown-value=moreFilters]:eq(0)",
        caption: callParentNew('lcm')[409],
        icon: "filter_alt",
        open() {
            let pill = $("[onclick=editThePill\\(\\'filter\\'\\,0\\)]");
            if (pill.length) {
                pill.click();
            } else {
                $(this.stage).click();
            }
        },
        clear(elem) {
            resetMoreFilters();
            delete ivirMainObj.filter;
            var moreFiltersBody = $("#newViewTabId").find(".filter-body-cont");
            if (moreFiltersBody.length > 0) {
                moreFiltersBody.data("pillindex", -1);
            }
        },
        apply() {
            $("#btnFilterApply").click();
        },
        html(isEdit) {
            return svHtmlGeneratorRef(this, $(`<input value="${this.type}">`), isEdit);
        },
        get visible() {
            return true
        },
        get value() {
            return ivirMainObj.filter && ivirMainObj.filter[0] && JSON.stringify(ivirMainObj.filter[0]) || "";
        }
    },
    sort: {
        name: "sort",
        task: "sort",
        type: "sort",
        stage: "[data-dropdown-value=sort]:eq(0)",
        caption: callParentNew('lcm')[403],
        icon: "sort",
        open() {
            $(this.stage).click();
        },
        clear(elem) {
            $("#clearSorting").click();
            delete ivirMainObj.sorting;
        },
        apply() {
            ivirSortColumns();
        },
        html(isEdit) {
            return svHtmlGeneratorRef(this, $(`<input value="${this.type}">`), isEdit);
        },
        get visible() {
            return (iName != "inmemdb" ? true : false)
        },
        get value() {
            return ivirMainObj.sorting && ivirMainObj.sorting.length > 0 && JSON.stringify(ivirMainObj.sorting) || "";
        }
    },
    rowGrouping: {
        name: "rowGrouping",
        task: "group",
        type: "rowGrouping",
        stage: "[data-dropdown-value=rowGrouping]:eq(0)",
        caption: callParentNew('lcm')[404],
        icon: "table_rows",
        open() {
            let pill = $("[onclick=editThePill\\(\\'group\\'\\,0\\)]");
            if (pill.length) {
                pill.click();
            } else {
                $(this.stage).click();
            }
        },
        clear(elem) {
            delete ivirMainObj.group;
            $("#grpColName").val("").trigger("change");
        },
        apply(indexOfArray, isPillChecked) {
            ivirRowGrouping(indexOfArray, isPillChecked);
        },
        html(isEdit) {
            return svHtmlGeneratorRef(this, $(`<input value="${this.type}">`), isEdit);
        },
        get visible() {
            return (iName != "inmemdb" && !isListView && !enableCardsUi ? true : false)
        },
        get value() {
            return ivirMainObj.group && ivirMainObj.group[0] && JSON.stringify(ivirMainObj.group[0]) || "";
        }
    },
    columns: {
        name: "columns",
        task: "column",
        type: "SHcolumns",
        stage: "[data-dropdown-value=SHcolumns]:eq(0)",
        caption: callParentNew('lcm')[401],
        icon: "view_week",
        open() {
            $(this.stage).click();
        },
        clear(elem) {
            if (!isListView) {
                ivirMainObj.hiddenColumns = [];
            } else {
                ivirMainObj.visibleColumns = [];
            }
        },
        apply() {
            ivirshowHideColumns();
        },
        html(isEdit) {
            return svHtmlGeneratorRef(this, $(`<input value="${this.type}">`), isEdit);
        },
        get visible() {
            return (iName != "inmemdb" && (!enableCardsUi ? true : false));
        },
        get value() {
            if (!isListView) {
                return ivirMainObj.hiddenColumns && ivirMainObj.hiddenColumns.length > 0 && JSON.stringify({ hidden: ivirMainObj.hiddenColumns }) || "";
            } else {
                return ivirMainObj.visibleColumns && ivirMainObj.visibleColumns.length > 0 && JSON.stringify({ visible: ivirMainObj.visibleColumns }) || "";
            }
        }
    },
    design: {
        name: "design",
        task: "design",
        type: "design",
        stage: "[data-dropdown-value=design]:eq(0)",
        caption: "Design" || callParentNew('lcm')[401],
        icon: "design_services",
        open() {
            $(this.stage).click();
        },
        clear(elem) {
            delete ivirMainObj.design;
        },
        apply() {
            ivirDesignColumn();
        },
        html(isEdit) {
            return svHtmlGeneratorRef(this, $(`<input value="${this.type}">`), isEdit);
        },
        get visible() {
            return (iName != "inmemdb" && isListView && !enableCardsUi ? true : false)
        },
        get value() {
            return ivirMainObj.design && ivirMainObj.design.length > 0 && JSON.stringify(ivirMainObj.design) || "";
        }
    },
    highlight: {
        name: "highlight",
        task: "highlight",
        type: "highlighting",
        stage: "[data-dropdown-value=highlighting]:eq(0)",
        caption: callParentNew('lcm')[396],
        icon: "highlight",
        open() {
            let pill = $("[onclick=editThePill\\(\\'highlight\\'\\,0\\)]");
            if (pill.length) {
                pill.click();
            } else {
                $(this.stage).click();
            }
        },
        clear(elem) {


            clearIvirHighlight(0);


            delete ivirMainObj.highlight;
        },
        apply(indexOfArray, isPillChecked) {
            ivirHighlightRow(indexOfArray, isPillChecked);
        },
        html(isEdit) {
            return svHtmlGeneratorRef(this, $(`<input value="${this.type}">`), isEdit);
        },
        get visible() {
            return (iName != "inmemdb" ? true : false)
        },
        get value() {
            return ivirMainObj.highlight && ivirMainObj.highlight[0] && JSON.stringify(ivirMainObj.highlight[0]) || "";
        }
    }
};

$j(document).ready(function ($) {
    $.fn.dataTableExt.ofnSearch['alt-status'] = function (sData) {


    };
    $.fn.dataTable.ext.errMode = 'none';




    Highcharts.setOptions({
        lang: {
            decimalPoint: '.',
            thousandsSep: ','
        }
    });

    /** Will trigger when actions dropdown like highlight,group is selected */
    svHtmlGeneratorRef = function svHtmlGenerator(svOption, that = this, isEdit = false) {
        isOpenSmartStepper = true;
        if (($("#ivirCButtonsWrapper").is(":visible") && !$("#ivirCButtonsWrapper a.active").hasClass('grdView')) || ($("#pinnedivirCButtonsWrapper").is(":visible") && !$("#pinnedivirCButtonsWrapper a.active").hasClass('grdView'))) {
            toggleGridView("grid");
        }
        var htmlToShow = "";
        var selectedVal = $(that).val();
        if (selectedVal && selectedVal != "") {
            if (selectedVal == 'SHcolumns' && iName != "inmemdb") {
                //Show hide colums in the report
                requestTstructFieldsObj();
                if (!isListView) {
                    htmlToShow = '<div class="d-flex form-check form-check-sm form-check-custom form-check-solid gap-10 checkbox">';
                    htmlToShow += '<input class="form-check-input" type="checkbox" id="showAllColumns" />';
                    htmlToShow += '<label class="form-label col-form-label pb-1 fw-boldest">' + callParentNew('lcm')[446] + '</label>';
                    htmlToShow += '</div>';
                    htmlToShow += '<hr />';
                }

                htmlToShow += '<div id="ivirshowHideColumnWrapper" class="columList">';
                var fixedColumns = 0;
                if (fixedColumnsObj != "")
                    fixedColumns = fixedColumnsObj.s.iLeftColumns;


                var groupCol = [];
                var chartCol = [];
                if (groupingCol != "") {
                    isGrouped = true;
                    var groupArrayIndex = $("[id^='grouppillCB']:checked").data("index");
                    groupCol = checkForPillDependentFlds("group", groupArrayIndex, true);
                }
                var chartArrayIndex = $("[id^='chartpillCB']:checked").data("index");
                if (chartArrayIndex >= 0) {
                    chartCol = checkForPillDependentFlds("chart", chartArrayIndex, true);
                }

                if (!isListView) {
                    var allColumns = ivirDataTableApi.columns();
                    var allColumnsLength = allColumns[0].length;

                    var allDepCols = groupCol.concat(chartCol);
                    for (var i = 0; i < allColumnsLength; i++) {

                        /**
                         * Do not Create column list if column hided from defination
                         * @author Prashik
                         * @Date   2019-04-11T11:45:39+0530
                         */
                        if ((ivHeadRows[getColumnName(ivirDataTableApi.context[0].aoColumns[i].mData)]["@hide"] == "true")) {
                            continue;
                        }

                        var headerName = $(ivirDataTableApi.columns(i).header()).text().trim();
                        htmlToShow += '<div class="d-flex form-check form-check-sm form-check-custom form-check-solid gap-10 checkbox ivirLabelWrapper">';
                        var disabled = "";
                        var isGrouped = false;
                        var totalArrayIngrouping;







                        var isVisibleCol = ivirDataTableApi.column(i).visible() === true;

                        if ($("#newViewTabId").is(":visible") || isOpenSmartStepper) {
                            try {
                                if (ivirMainObj.hiddenColumns) {
                                    if (ivirMainObj.hiddenColumns.indexOf(FieldName[HeaderText.indexOf(headerName)]) > -1) {
                                        isVisibleCol = false;
                                    } else {
                                        isVisibleCol = true;
                                    }
                                }
                            } catch (ex) { }
                        }

                        if ((i < fixedColumns) || ($.inArray(i, allDepCols) !== -1))
                            disabled = "disabled";
                        if (isVisibleCol)
                            htmlToShow += '<input class="form-check-input customCheckBox ' + disabled + '" ' + disabled + ' checked type="checkbox" data-index=' + i + ' value="' + headerName + '">';
                        else
                            htmlToShow += '<input class="form-check-input customCheckBox ' + disabled + '" ' + disabled + ' type="checkbox" data-index=' + i + ' value="' + headerName + '">';
                        htmlToShow += '<label class="form-label col-form-label pb-1 fw-boldest ivirSortLabel">' + (headerName == "" && i == 0 && isChkBox == "true" ? "Checkbox" : headerName == "arrow_drop_down" && rowOptionsExist && i == 0 ? "AxRowOptions_Checkbox" : headerName) + '</label>';
                        htmlToShow += '</div>';

                    }
                } else {
                    var listDropdowns = ``;
                    if ($("#hdnListViewFieldsJSON").val() != "") {
                        var lvFldsObj = JSON.parse($("#hdnListViewFieldsJSON").val());
                    }else{
                        var lvFldsObj = {
                            1: {
                                caption: iName,
                                fields: FieldName.map((fld, ind)=>{
                                    return {
                                        caption: HeaderText[ind],
                                        component: "",
                                        dcNo: 1,
                                        index: ind + 1,
                                        isGridField: false,
                                        length: undefined,
                                        name: fld,
                                        save: fld == "rowno" ? false : !(HideColumn[ind] == "true"),
                                        visible: fld == "rowno" ? false : !(HideColumn[ind] == "true")
                                    }
                                }),
                                index: 1,
                                isGrid: false,
                                name: "dc1"
                            }
                        }
                    }
                        try {
                            // var lvFldsObj = JSON.parse($("#hdnListViewFieldsJSON").val());

                            htmlToShow += Object.keys(lvFldsObj).map((dcInd) => {
                                let dc = lvFldsObj[dcInd];
                                
                                let extraFIelds = [];
                                if(dcInd == 1){
                                    extraFIelds = ["Created By", "Created On", "Modified By", "Modified On"].map((fld, ind)=>{
                                        return {
                                            ...dc?.fields?.find(field=>field.visible && field.save),
                                            index: ((dc?.fields?.length > -1 ? dc?.fields?.length : 0) + (ind + 1)),
                                            name: fld.toLowerCase().replaceAll(" ", ""),
                                            caption: fld
                                        }
                                    }) || extraFIelds;
                                }
                                return `
                                <div id="lstColSel_${dc.name}" class="d-block gap-10 lstColSelWrapper">
                                    <div class="d-flex flex-row-auto form-check form-check-sm form-check-custom form-check-solid gap-10">
                                        <input id="showAllColumns${dcInd}" class="form-check-input showAllColumns" type="checkbox" value="${dc.name}" ${Object.keys(dc).map((propName) => { return (propName != "fields" ? `data-${propName}="${dc[propName]}"` : ``) }).join(" ")} /> 
                                        <!-- <span> -->
                                            <label class="form-label col-form-label pb-1 fw-boldest fst-bolder"for="showAllColumns${dcInd}">
                                                ${dc.name}<i> (${dc.caption}) - ${dc.isGrid ? `Grid` : `Non-Grid`}</i>
                                            </label>
                                        </div>
                                    <div class="mx-15">
                                            ${[
                                                ...dc.fields,
                                                ...extraFIelds
                                            ].map((field) => {
                                    return field.visible && field.save ? `
                                            <div class="d-flex form-check form-check-sm form-check-custom form-check-solid gap-10 checkbox ivirLabelWrapper">
                                            <input id="customCheckBox_${dcInd}_${field.index}" class="form-check-input customCheckBox" type="checkbox"
                                            ${($("#newViewTabId").is(":visible") || isOpenSmartStepper) && ((ivirMainObj.visibleColumns && (ivirMainObj.visibleColumns.length > 0 && ivirMainObj.visibleColumns[0].dcs && ivirMainObj.visibleColumns[0].dcs[dcInd] && typeof ivirMainObj.visibleColumns[0].dcs[dcInd].fields != "undefined" && (checkIt = ivirMainObj.visibleColumns[0].dcs[dcInd].fields.indexOf(field.name) > -1))) || (FieldName.indexOf(field.name) > -1 || (isListView && (field.name == "modifiedby" && FieldName.indexOf("username") > -1)) && (typeof checkIt == "undefined" || checkIt))) ? ((listDropdowns += `<option>${field.name}</option>`) && `checked="checked"`) : ``}
                                            value="${field.name}" ${Object.keys(field).map((propName) => { return `data-${propName}="${field[propName]}"` }).join(" ")} />
                                                <label class="form-label col-form-label pb-1 fw-boldest ivirSortLabel" for="customCheckBox_${dcInd}_${field.index}">
                                                    ${field.name}<i> (${field.caption})</i>
                                                </label>
                                            </div>
                                            ` : ``
                                }).join("")
                                    }
                                        </div>
                                    </div>
                                <hr class="text-gray-500" />`;
                            }).join("");

                            htmlToShow += `<div class="form-group">
                                <label for="grpColName" class="form-label col-form-label pb-1 fw-boldest required"> 
                                    Select column for Hyperlink
                                </label>
                                <select class="form-select dialogSlctFld stepperSelect" id="selColHypOpts">
                                    ${listDropdowns}
                                </select>
                            </div>`;
                        } catch (ex) { }
                    // }
                }


                htmlToShow += '</div>';

                return htmlToShow;
                var dialogObj = ivirActionDialog(callParentNew('lcm')[401], 'column', htmlToShow, 'ivirshowHideColumns');

                setTimeout(function () {
                    if (!(!isListView)) {
                        dialogObj.$btnc.css({ "width": "100%" });
                        dialogObj.$btnc.prepend(`
                        <div class="form-group">
                            <label for="grpColName" class="form-label col-form-label pb-1 fw-boldest required"> Select column for Hyperlink </label>
                            <!-- <span class="red">*</span> -->
                            <select class="form-select dialogSlctFld" id="selColHypOpts" data-control="select2">
                                ${listDropdowns}
                            </select>
                        </div>
                        `);
                        try {
                            $("#selColHypOpts").val(ivirMainObj.visibleColumns[0].hyperlink);
                        } catch (ex) { }
                    }
                }, 0);

            }
            else if (selectedVal == 'design' && iName != "inmemdb" && isListView) {
                htmlToShow = `
                <div id="ivirDesignColumnWrapper" class="designList">
                </div>
                `;

                if (document.getElementById("IvirActions").value == "design"){
                    smartDesign(htmlToShow);
                }
                else {
                    return htmlToShow;
                }
                
            }
            else if (selectedVal == 'sort' && iName != "inmemdb") {

                htmlToShow += '<div class="d-flex justify-content-end">';
                htmlToShow += '<button type="button" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-dismiss="click" data-bs-original-title="' + callParentNew('lcm')[447] + '" class="btn btn-sm btn-icon btn-active-primary shadow-sm arrowUpDown" onclick="ivirMoveUpDown(\'up\',\'ivirSortColumnWrapper\')" id="listUp"><span class="material-icons material-icons-style">vertical_align_top</span></button>';
                htmlToShow += '<button type="button" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-dismiss="click" data-bs-original-title="' + callParentNew('lcm')[448] + '" class="btn btn-sm btn-icon btn-active-primary shadow-sm arrowUpDown" onclick="ivirMoveUpDown(\'down\',\'ivirSortColumnWrapper\')" id="listDown"><span class="material-icons material-icons-style">vertical_align_bottom</span></button>';
                htmlToShow += '<button id="clearSorting" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-dismiss="click" data-bs-original-title="' + callParentNew('lcm')[318] + '" class="btn btn-sm btn-icon btn-active-light-primary shadow-sm clear d-none"><span class="material-icons material-icons-style">restore</span></button>';
                htmlToShow += '</div>';

                htmlToShow += '<hr />';


                htmlToShow += '<div id="ivirSortColumnWrapper" class="columList">';
                var ivirDataTableApiOrder = ivirDataTableApi.order();
                var ivirDataTableApiOrderArray = [];
                for (var i = 0; i < ivirDataTableApiOrder.length; i++) {
                    ivirDataTableApiOrderArray.push(ivirDataTableApiOrder[i][0]);
                    ivirDataTableApiOrderArray.push(ivirDataTableApiOrder[i][1]);
                }
                for (var j = 0; j < ivirDataTableApiOrderArray.length; j += 2) {
                    var headerName = $(ivirDataTableApi.columns(ivirDataTableApiOrderArray[j]).header()).text().trim();
                    if (groupingCol != ivirDataTableApiOrderArray[j]) {
                        htmlToShow += '<div class="d-flex justify-content-between form-check form-check-sm form-check-custom form-check-solid py-2 checkbox ivirLabelWrapper">';
                        htmlToShow += '<input tabindex="-1" class="form-check-input col-sm-1 customCheckBox" type="checkbox" checked data-index=' + ivirDataTableApiOrderArray[j] + '>';
                        htmlToShow += '<label class="form-label col-form-label pb-1 fw-boldest col-sm-9 ivirSortLabel">' + headerName + '</label>';
                        htmlToShow += '<span class="d-flex col-sm-2 ascDscWrapper">';
                        if (ivirDataTableApiOrderArray[j + 1] == 'asc') {
                            htmlToShow += '<button tabindex="-1" class="btn btn-sm btn-icon btn-active-light-primary shadow-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-dismiss="click" data-bs-original-title="Descending Order"><span data-order="asc" class="material-icons material-icons-style active">arrow_circle_down</span></button>';
                            htmlToShow += '<button tabindex="-1" class="btn btn-sm btn-icon btn-active-light-primary shadow-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-dismiss="click" data-bs-original-title="Ascending Order"><span data-order="desc" class="material-icons material-icons-style">arrow_circle_up</span></button>';
                        } else {
                            htmlToShow += '<button tabindex="-1" class="btn btn-sm btn-icon btn-active-light-primary shadow-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-dismiss="click" data-bs-original-title="Ascending Order"><span data-order="asc" class="material-icons material-icons-style">arrow_circle_down</span></button>';
                            htmlToShow += '<button tabindex="-1" class="btn btn-sm btn-icon btn-active-light-primary shadow-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-dismiss="click" data-bs-original-title="Descending Order"><span data-order="desc" class="material-icons material-icons-style active">arrow_circle_up</span></button>';
                        }
                        htmlToShow += '</span>';
                        htmlToShow += '</div>';
                    }
                }


                var allColumns = ivirDataTableApi.columns();
                for (var k = 0; k < allColumns[0].length; k++) {
                    if (isChkBox == "true" && k == 0)
                        continue;
                    if (ivirDataTableApi.column(k).visible() === true && jQuery.inArray(k, ivirDataTableApiOrderArray) === -1) {
                        var headerName = $(ivirDataTableApi.columns(k).header()).text().trim();
                        htmlToShow += '<div class="d-flex justify-content-between form-check form-check-sm form-check-custom form-check-solid py-2 checkbox ivirLabelWrapper">';
                        htmlToShow += '<input tabindex="-1" class="form-check-input col-sm-1 customCheckBox" type="checkbox" data-index=' + k + '>';
                        htmlToShow += '<label class="form-label col-form-label pb-1 fw-boldest col-sm-9 ivirSortLabel">' + headerName + '</label>';
                        htmlToShow += '<span class="d-flex col-sm-2 ascDscWrapper">';
                        htmlToShow += '<button tabindex="-1" class="btn btn-sm btn-icon btn-active-light-primary shadow-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-dismiss="click" data-bs-original-title="Ascending Order"><span data-order="asc" class="material-icons material-icons-style">arrow_circle_down</span></button>';
                        htmlToShow += '<button tabindex="-1" class="btn btn-sm btn-icon btn-active-light-primary shadow-sm" type="button" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-dismiss="click" data-bs-original-title="Descending Order"><span data-order="desc" class="material-icons material-icons-style">arrow_circle_up</span></button>';
                        htmlToShow += '</span>';
                        htmlToShow += '</div>';
                    }

                }


                htmlToShow += '</div>';

                return htmlToShow;
                ivirActionDialog(callParentNew('lcm')[403], 'sort', htmlToShow, 'ivirSortColumns');
            } else if (selectedVal == 'rowGrouping' && iName != "inmemdb") {
                if (!checkForPillsLength('group')) {
                    return getGroupHtml();
                    ivirActionDialog(callParentNew('lcm')[412], 'group', getGroupHtml(), "ivirRowGrouping");
                }
                else if (isEdit) {
                    return getGroupHtml(isEdit);
                }
            } else if (selectedVal == 'highlighting' && iName != "inmemdb") {

                if (!checkForPillsLength('highlight')) {
                    return getHighlightHtml();
                    ivirActionDialog(callParentNew('lcm')[396], 'highlight', getHighlightHtml(), "ivirHighlightRow");
                }
                else if (isEdit) {
                    return getHighlightHtml("highlight", 0, isEdit);
                }







            } else if (selectedVal == 'download') {
                htmlToShow += '<div>'
                htmlToShow += '<div>'
                htmlToShow += '<div id="main">'
                htmlToShow += '<div class="row" id="ivirDownloadWrapper">'


                htmlToShow += '<div class="col-md-2 text-center"><button onclick="DownloadAndSave(this)" type="button" title="CSV" class="noBg CSV active"><span class="ivirDownload fa fa-file-excel-o CSV"></button></span><label>CSV</label></div>';
                htmlToShow += '<div class="col-md-2 text-center"><button onclick="DownloadAndSave(this)" type="button" title="Excel" class="noBg EXCEL"><span  class="ivirDownload  fa fa-file-excel-o EXCEL"></button><label>Excel</label></span></div>';
                htmlToShow += '<div class="col-md-2 text-center"><button onclick="DownloadAndSave(this)" type="button"title="PDF" class="noBg PDF"><span class="ivirDownload fa fa-file-pdf-o PDF"></button></span><label>PDF</PDF></div>';
                htmlToShow += '<div class="col-md-2 text-center"><button onclick="DownloadAndSave(this)" type="button" title="Print" class="noBg PRINT"><span class="ivirDownload fa fa-print PRINT"></button></span><label>Print</label></div>';








                htmlToShow += '</div> ';





                htmlToShow += '</div>';
                htmlToShow += '</div>';
                htmlToShow += '</div>';
                return htmlToShow;
                ivirActionDialog(callParentNew('lcm')[411], 'download', htmlToShow, "DownloadFile");

            } else if (selectedVal == 'chart' && iName != "inmemdb") {

                if (!checkForPillsLength('chart'))
                    smartCharts();
            } else if (selectedVal == 'save' && iName != "inmemdb") {
                if (requestJSON) {
                    if (ivirMainObj.groupName) {
                        if (hasBuildAccess){
                            saveInSessionBeforeSaveNew(ivirMainObj.groupName, ivirMainObj.caption || ivirMainObj.groupName, ivirMainObj.applyTo);
                        }
                        else{
                            saveInSessionBeforeSaveNew(ivirMainObj.groupName, ivirMainObj.caption || ivirMainObj.groupName, callParentNew("mainUserName"), ivirMainObj.asDefault);
                        }
                    }



                    else {
                        try {
                            callParentNew("Charts", "id").dispatchEvent(new CustomEvent("close"));
                        } catch (error) {}                        
                        getViewName();
                    }
                }
                else
                    saveInSessionBeforeSave();
            } else if (selectedVal == 'saveAs' && iName != "inmemdb") {

                newViewTabClick($(that));
            }
            else if (selectedVal == 'moreFilters') {

                let filPillIndex = isEdit && ivirMainObj.filter ? 0 : -1;
                return ivirMoreFilters(filPillIndex);


            } else if (selectedVal == 'clearFilters') {
                clearFilters();
            } else if (selectedVal == 'paramFilter') {
                $('#Filterscollapse').collapse("toggle");
            }
        }
    }

    $(document).on("keydown", "#ivirCndtnToggleBtn", function (event) {
        if (event.keyCode == 32 || event.keyCode == 13) {
            toggleIvirPills();
        }
    });


    /** Wlll trigger when custom Actions of iview are selected */
    $(document).on("change", "#IvirCustomActions", function (event) {
        var selectedValue = $(this).val();
        if (selectedValue != "") {
            if (selectedValue.startsWith('custBtn')) {
                var fn = selectedValue.split(',');
                var btnID = fn[0].substr(7);



                fireTheCustomAction(btnID);
            }
        }

    });
    /**
     * This function will be trigerred from datatable whenever Advanced Filters Search will be requested.
     * @author Prashik
     * @Date   2019-02-28T10:37:05+0530                                                                                   
     * var isObjectAvailable [if filters are parsed from filterObject or opened filter Popup Fields]
     * @return {[boolean]}                            [return true if current row should be shown in search result]
     */
    $.fn.dataTable.ext.search.push(
        function (settings, filteredData, dataIndex, data, rowNo) {


            var isObjectAvailable = false;
            var loopData = [];
            if ($.isEmptyObject(advFiltersObjectToApply) || advFiltersObjectToApply.somedummyfilterjsobjectkey) {
                isObjectAvailable = false;
                if (!advFiltersObjectToApply.somedummyfilterjsobjectkey) {
                    loopData = $("#newViewTabId .filter-bodyAndFooter-cont table tbody tr");
                }
            } else {
                isObjectAvailable = true;
                loopData = $(Object.keys(advFiltersObjectToApply));
            }


            var validationArray = [];


            $(loopData).each(function (dataIndex) {
                var dataKey = "";
                if (isObjectAvailable) {

                    dataKey = loopData[dataIndex];
                    var colType = ivirColumnTypeObj[dataKey];
                } else {
                    var colType = $(this).data("coltype");
                }
                switch (colType) {
                    case "c":

                        if (isObjectAvailable) {
                            var thisVal = advFiltersObjectToApply[dataKey].split("`");

                            var currentIndex = getPropertyAccess(dataKey);
                        } else {
                            var thisVal = $(this).find(".moreFiltersInput.characterFilter:nth(0)").val();


                            var currentIndex = getPropertyAccess($(this).find(".moreFiltersInput.characterFilter").data("field"));





                        }
                        var tempData = typeof data[currentIndex] == "object" && data[currentIndex] != null ? data[currentIndex].display : (data[currentIndex] != null ? data[currentIndex] : "");
                        tempData = $($.parseHTML(tempData)).text().trim();
                        var currentData = tempData;



                        // if (requestJSON) {
                            thisVal != "" ? validationArray.push(thisVal.filter((val, ind) => { return currentData.indexOf(val) > -1 }).length > 0) : "";
                        // } else {
                        //     thisVal != "" ? validationArray.push(thisVal.filter((val, ind) => { return currentData.indexOf(val) > -1 }).length > 0) : "";
                        // }
                        break;
                    case "n":
                        var minVal = 0, maxVal = 0;
                        if (isObjectAvailable) {

                            var currentIndex = getPropertyAccess(dataKey);

                            if (advFiltersObjectToApply[dataKey]["min"].toString() != "" || advFiltersObjectToApply[dataKey]["max"].toString() != "") {
                                var columnVals = [];
                                try {
                                    columnVals = generateUniqueColumnVals(colType, currentIndex + ":name");
                                    if (advFiltersObjectToApply[dataKey]["min"].toString() == "") {
                                        advFiltersObjectToApply[dataKey]["min"] = (Math.min(...columnVals) || minVal);
                                    }
                                    if (advFiltersObjectToApply[dataKey]["max"].toString() == "") {
                                        advFiltersObjectToApply[dataKey]["max"] = (Math.max(...columnVals) || maxVal);
                                    }
                                } catch (ex) { }
                                try {
                                    minVal = parseFloat(advFiltersObjectToApply[dataKey]["min"].toString().replace(/,/g, "")) || minVal;
                                } catch (ex) { }
                                try {
                                    maxVal = parseFloat(advFiltersObjectToApply[dataKey]["max"].toString().replace(/,/g, "")) || maxVal;
                                } catch (ex) { }
                            }

                        } else {


                            var currentIndex = getPropertyAccess($(this).find(".moreFiltersInput.numericFilter:nth(0)").data("field"));




                            if ($(this).find(".moreFiltersInput.numericFilter:nth(0)").val() != "" || $(this).find(".moreFiltersInput.numericFilter:nth(1)").val() != "") {
                                var columnVals = [];
                                try {
                                    columnVals = generateUniqueColumnVals(colType, currentIndex + ":name");
                                    if ($(this).find(".moreFiltersInput.numericFilter:nth(0)").val() == "") {
                                        $(this).find(".moreFiltersInput.numericFilter:nth(0)").val(Math.min(...columnVals) || minVal);
                                    }
                                    if ($(this).find(".moreFiltersInput.numericFilter:nth(1)").val() == "") {
                                        $(this).find(".moreFiltersInput.numericFilter:nth(1)").val(Math.max(...columnVals) || maxVal);
                                    }
                                } catch (ex) { }
                                minVal = parseFloat($(this).find(".moreFiltersInput.numericFilter:nth(0)").val().toString().replace(/,/g, "")) || minVal;
                                maxVal = parseFloat($(this).find(".moreFiltersInput.numericFilter:nth(1)").val().toString().replace(/,/g, "")) || maxVal;
                            }
                        }
                        var tempData = typeof data[currentIndex] == "object" && data[currentIndex] != null ? data[currentIndex].display : (data[currentIndex] != null ? data[currentIndex] : "");
                        tempData = checkFroNegativeValue($($.parseHTML(tempData)).text().trim());
                        var currentData = parseFloat(tempData.toString().replace(/,/g, ""));
                        currentData = !isInValidNumber(currentData) ? currentData : "";
                        if (currentData != "")
                            minVal != 0 || maxVal != 0 ? validationArray.push(isNumberBetweenScope(minVal, maxVal, currentData)) : "";


                        break;
                    case "d":
                        var minVal = 0, maxVal = 0;
                        if (isObjectAvailable) {

                            var currentIndex = getPropertyAccess(dataKey);
                            if (typeof advFiltersObjectToApply[dataKey]["min"] != "undefined" && (advFiltersObjectToApply[dataKey]["min"].toString() != "" || advFiltersObjectToApply[dataKey]["max"].toString() != "")) {
                                var columnVals = [];
                                try {
                                    columnVals = generateUniqueColumnVals(colType, currentIndex + ":name");
                                    if (advFiltersObjectToApply[dataKey]["min"].toString() == "") {
                                        advFiltersObjectToApply[dataKey]["min"] = new Date(Math.min(...columnVals) || minVal);
                                    }
                                    if (advFiltersObjectToApply[dataKey]["max"].toString() == "") {
                                        advFiltersObjectToApply[dataKey]["max"] = new Date(Math.max(...columnVals) || maxVal);
                                    }
                                } catch (ex) { }
                                try {
                                    if (advFiltersObjectToApply[dataKey]["min"]) {
                                        minVal = getDateStamp(advFiltersObjectToApply[dataKey]["min"]) || minVal;
                                    }
                                    else {
                                        var selectionOption = "";

                                    }
                                } catch (ex) { }
                                try {
                                    if (advFiltersObjectToApply[dataKey]["max"]) {
                                        maxVal = getDateStamp(advFiltersObjectToApply[dataKey]["max"]) || maxVal;
                                    } else {
                                        var selectionOption = "";

                                    }
                                } catch (ex) { }
                            } else {
                                var fromToObj = generateAdvFilterDates(advFiltersObjectToApply[dataKey]);
                                minVal = getDateStamp(fromToObj.from);
                                maxVal = getDateStamp(fromToObj.to);
                            }
                        } else {


                            var currentIndex = getPropertyAccess($(this).find("input.moreFiltersInput.dateFilter:nth(0)").data("field"));




                            if ($(this).find("input.moreFiltersInput.dateFilter:nth(0)").val() != "" || $(this).find("input.moreFiltersInput.dateFilter:nth(1)").val() != "") {
                                var columnVals = [];
                                try {
                                    columnVals = generateUniqueColumnVals(colType, currentIndex + ":name");
                                    if ($(this).find("input.moreFiltersInput.dateFilter:nth(0)").val() == "") {
                                        $(this).find("input.moreFiltersInput.dateFilter:nth(0)").datepicker("setDate", new Date(Math.min(...columnVals) || minVal));
                                    }
                                    if ($(this).find("input.moreFiltersInput.dateFilter:nth(1)").val() == "") {
                                        $(this).find("input.moreFiltersInput.dateFilter:nth(1)").datepicker("setDate", new Date(Math.max(...columnVals) || maxVal));
                                    }
                                } catch (ex) { }
                                try {
                                    minVal = parseInt($(this).find("input.moreFiltersInput.dateFilter:nth(0)").datepicker("getDate").getTime(), 10) || minVal;
                                } catch (ex) { }

                                try {
                                    maxVal = parseInt($(this).find("input.moreFiltersInput.dateFilter:nth(1)").datepicker("getDate").getTime(), 10) || maxVal;
                                } catch (ex) { }
                            }
                        }
                        var currentData = "";
                        try {
                            var tempData = typeof data[currentIndex] == "object" && data[currentIndex] != null ? data[currentIndex].display : (data[currentIndex] != null ? data[currentIndex] : "");
                            tempData = $($.parseHTML(tempData)).text().trim();
                          
                                tempData = getDateBasedOnCulture(tempData);
                      
                            currentData = getDateStamp(tempData);
                        } catch (ex) { }
                        if (currentData != "")
                            minVal != 0 || maxVal != 0 ? validationArray.push(isNumberBetweenScope(minVal, maxVal, currentData)) : "";


                        break;
                    case "t":
                        break;
                }
            });










            return validationArray.every(valData => valData);
        }
    );

    /**
     * This function will revert table sorting to initial table sorting on doubleCLick of table header.
     * @author Prashik
     * @Date   2019-02-28T10:46:02+0530
     */
    $(document).on("dblclick", 'th.sorting, th.sorting_asc, th.sorting_desc, th.dt-right, th.dt-left', function () {
        try { ivirDataTableApi.order.neutral().draw() } catch (ex) { }
    });

    /**
     * Trigger advance filter search functionality
     * @author Prashik
     * @Date   2019-02-28T11:32:21+0530
     */
    $(document).on("click", "#btnFilter", function () {
        $('[data-dropdown-value="moreFilters"]').attr("data-filter-type", "search");
        advFiltersObjectToApply = {};
        ivirDataTableApi.draw();
        setFilterInfo();
    });

    /**
     * Create advanced filter pill and trigger advanced search functionality
     * @author Prashik
     * @Date   2019-02-28T11:44:57+0530
     */
    $(document).on("click", "#btnFilterApply", function () {
        var advSearchNameValue = $("#advSearchName").val() || "a";
        var pillindex = $("#newViewTabId").find(".filter-body-cont").data("pillindex");
        if (pillindex != -1 || !checkForPillsLength('filter') || ($("#newViewTabId").is(":visible") || isOpenSmartStepper)) {
            if (advSearchNameValue) {
                var pillIndex = getFiltersPillIndex();
                var isEditPill = pillIndex == undefined ? false : true;
                if (!($("#newViewTabId").is(":visible") || isOpenSmartStepper)) {
                    if (!ivirDuplicateCheck("filter", isEditPill, pillIndex))
                        return false;
                }
                var searchJSON = JSON.stringify(generateSearchString("JSON"));
                if (searchJSON != "{}") {
                    if ($("#newViewTabId").is(":visible") || isOpenSmartStepper) {
                        let filterObj = [{ n: advSearchNameValue, data: JSON.parse(searchJSON) }];
                        ivirMainObj.filter = filterObj;
                    } else {
                        generateFilterPill(searchJSON, advSearchNameValue, pillIndex);


                        ivirDataTableApi.draw();
                        setFilterInfo();
                        $('[data-dropdown-value="moreFilters"]').attr("data-filter-type", "filter");

                    }
                } else {
                    showAlertDialog("info", "Filter fields cannot be empty.");
                }
            } else {

                showAlertDialog("warning", "Enter your filter name.");
            }
        }
    });

    /**
     * Automatic date selection on selecting special case date options in advanced filters
     * @author Prashik
     * @Date   2019-02-28T11:45:46+0530
     * @param  {[type]}                 ) {                   var thisSiblings [description]
     * @return {[type]}                   [description]
     */
    $(document).on("change", "select.dateFilter", function () {
        var thisSiblings = $(this).parent().nextAll();
        var fromDate = $(thisSiblings[0]).find("input.moreFiltersInput");
        var toDate = $(thisSiblings[1]).find("input.moreFiltersInput");

        var fromToObj = generateAdvFilterDates($(this).val());
        fromDate.val(fromToObj.from);
        toDate.val(fromToObj.to);
        enableDisableDateField(thisSiblings.find("input.moreFiltersInput"), $(this).val() == "customOption" ? "enable" : "disable");
    });
    GetProcessTime();
    GetTotalElapsTime();
});

/**
 * Generate from/to dates for filters for selected options
 * @author Prashik
 * @Date   2019-04-11T11:45:39+0530
 * @param  {string}                 dateOption : selected date option
 * @return {object}                 fromToObj : from/to date object
 */
function generateAdvFilterDates(dateOption) {
    var fromToObj = { from: "", to: "" };
    var advFilterDtCulture = dtCulture == "en-us" ? "MM/DD/YYYY" : "DD/MM/YYYY";
    switch (dateOption) {
        case "customOption":
            break;
        case "todayOption":
            var dateObj = new Date();
            fromToObj.from = fromToObj.to = moment(dateObj).format(advFilterDtCulture);
            break;
        case "yesterdayOption":
            var dateObj = new Date();
            dateObj.setDate(dateObj.getDate() - 1);
            fromToObj.from = fromToObj.to = moment(dateObj).format(advFilterDtCulture);
            break;
        case "tomorrowOption":
            var dateObj = new Date();
            dateObj.setDate(dateObj.getDate() + 1);
            fromToObj.from = fromToObj.to = moment(dateObj).format(advFilterDtCulture);
            break;
        case "this_weekOption":
            var dateObj = getFirstDayOfWeek(new Date());
            fromToObj.from = moment(dateObj).format(advFilterDtCulture);
            dateObj.setDate(dateObj.getDate() + 6);
            fromToObj.to = moment(dateObj).format(advFilterDtCulture);
            break;
        case "last_weekOption":
            var dateObj = getFirstDayOfWeek(new Date());
            dateObj.setDate(dateObj.getDate() - 7)
            fromToObj.from = moment(dateObj).format(advFilterDtCulture);
            dateObj.setDate(dateObj.getDate() + 6);
            fromToObj.to = moment(dateObj).format(advFilterDtCulture);
            break;
        case "next_weekOption":
            var dateObj = getFirstDayOfWeek(new Date());
            dateObj.setDate(dateObj.getDate() + 7)
            fromToObj.from = moment(dateObj).format(advFilterDtCulture);
            dateObj.setDate(dateObj.getDate() + 6);
            fromToObj.to = moment(dateObj).format(advFilterDtCulture);
            break;
        //case "this_fortnightOption":
        ////    enableDisable = "disable";
        //    break;
        //case "last_fortnightOption":
        ////    enableDisable = "disable";
        //    break;
        //case "next_fortnightOption":
        ////    enableDisable = "disable";
        //    break;
        case "this_monthOption":
            var dateObj = getFirstDayOfWeek(new Date());
            dateObj.setDate(1);
            fromToObj.from = moment(dateObj).format(advFilterDtCulture);
            dateObj.setMonth(dateObj.getMonth() + 1);
            dateObj.setDate(0);
            fromToObj.to = moment(dateObj).format(advFilterDtCulture);
            break;
        case "last_monthOption":
            var dateObj = getFirstDayOfWeek(new Date());
            dateObj.setDate(1);
            dateObj.setMonth(dateObj.getMonth() - 1);
            fromToObj.from = moment(dateObj).format(advFilterDtCulture);
            dateObj.setMonth(dateObj.getMonth() + 1);
            dateObj.setDate(0);
            fromToObj.to = moment(dateObj).format(advFilterDtCulture);
            break;
        case "next_monthOption":
            var dateObj = getFirstDayOfWeek(new Date());
            dateObj.setDate(1);
            dateObj.setMonth(dateObj.getMonth() + 1);
            fromToObj.from = moment(dateObj).format(advFilterDtCulture);
            dateObj.setMonth(dateObj.getMonth() + 1);
            dateObj.setDate(0);
            fromToObj.to = moment(dateObj).format(advFilterDtCulture);
            break;
        case "this_quarterOption":
            var dateObj = new Date();
            var thisQuarter = Math.floor(((dateObj).getMonth() + 3) / 3);
            dateObj.setDate(1);
            dateObj.setMonth((thisQuarter * 3) - 3);
            fromToObj.from = moment(dateObj).format(advFilterDtCulture);
            dateObj.setMonth(dateObj.getMonth() + 3);
            dateObj.setDate(0);
            fromToObj.to = moment(dateObj).format(advFilterDtCulture);
            break;
        case "last_quarterOption":
            var dateObj = new Date();
            var thisQuarter = Math.floor(((dateObj).getMonth() + 3) / 3) - 1;
            if (thisQuarter == 0) {
                thisQuarter = 4;
                dateObj.setFullYear(dateObj.getFullYear() - 1);
            }
            dateObj.setDate(1);
            dateObj.setMonth((thisQuarter * 3) - 3);
            fromToObj.from = moment(dateObj).format(advFilterDtCulture);
            dateObj.setMonth(dateObj.getMonth() + 3);
            dateObj.setDate(0);
            fromToObj.to = moment(dateObj).format(advFilterDtCulture);
            break;
        case "next_quarterOption":
            var dateObj = new Date();
            var thisQuarter = Math.floor(((dateObj).getMonth() + 3) / 3) + 1;
            if (thisQuarter == 5) {
                thisQuarter = 1;
                dateObj.setFullYear(dateObj.getFullYear() + 1);
            }
            dateObj.setDate(1);
            dateObj.setMonth((thisQuarter * 3) - 3);
            fromToObj.from = moment(dateObj).format(advFilterDtCulture);
            dateObj.setMonth(dateObj.getMonth() + 3);
            dateObj.setDate(0);
            fromToObj.to = moment(dateObj).format(advFilterDtCulture);
            break;
        case "this_yearOption":
            var dateObj = new Date();
            dateObj.setDate(1);
            dateObj.setMonth(0);
            fromToObj.from = moment(dateObj).format(advFilterDtCulture);
            dateObj.setFullYear(dateObj.getFullYear() + 1);
            dateObj.setMonth(0);
            dateObj.setDate(0);
            fromToObj.to = moment(dateObj).format(advFilterDtCulture);
            break;
        case "last_yearOption":
            var dateObj = new Date();
            dateObj.setFullYear(dateObj.getFullYear() - 1);
            dateObj.setDate(1);
            dateObj.setMonth(0);
            fromToObj.from = moment(dateObj).format(advFilterDtCulture);
            dateObj.setFullYear(dateObj.getFullYear() + 1);
            dateObj.setMonth(0);
            dateObj.setDate(0);
            fromToObj.to = moment(dateObj).format(advFilterDtCulture);
            break;
        case "next_yearOption":
            var dateObj = new Date();
            dateObj.setFullYear(dateObj.getFullYear() + 1);
            dateObj.setDate(1);
            dateObj.setMonth(0);
            fromToObj.from = moment(dateObj).format(advFilterDtCulture);
            dateObj.setFullYear(dateObj.getFullYear() + 1);
            dateObj.setMonth(0);
            dateObj.setDate(0);
            fromToObj.to = moment(dateObj).format(advFilterDtCulture);
            break;
    }
    return fromToObj;
}

/**
 * Generate unique list of values from selected non special row column 
 * @author Prashik
 * @Date   2019-04-11T11:55:05+0530
 * @param  {character}                 type        : type of column
 * @param  {string}                 columnIndex : column selector
 * @return {array}                   columnVals : list of unique column values
 */
function generateUniqueColumnVals(type, columnIndex) {
    var columnVals = [];
    try {

        ivirDataTableApi.cells(ivirDataTableApi.rows(":not(.specialRow)").nodes(), columnIndex, { search: 'applied' }).data().unique().sort().each(function (value, index) {
            if (type == "n") {
                value = typeof value == "object" && value != null ? value.display : (value != null ? value : "");
                value = value.replace(/,/g, "");

                columnVals.push(value);
            } else if (type == "d") {
            
                    value = getDateBasedOnCulture(value);
      
                var curTimeStamp = getDateStamp(value);

                columnVals.push(curTimeStamp);
            }
        });
    } catch (ex) { }
    return columnVals;
}

/**
 * Generate TimeStamp from date string based on culture
 * @author Prashik
 * @Date   2019-02-28T11:47:25+0530
 * @param  {string}                 thisData [date as string]
 * @return {int}                          [date as timestamp]
 */
function getDateStamp(thisData) {
    try {
        var dtFormatArray = dtFormat.substring(0, dtFormat.length - 2).split(/-|\//);
        var dtData = thisData.split(/-|\//);
        if (dtFormatArray[0].toLowerCase().startsWith("d")) {
            [dtData[0], dtData[1], dtData[2]] = [dtData[1], dtData[0], dtData[2]]
        }
        return parseInt(new Date(dtData.join("/")).getTime(), 10) || thisData;
    } catch (ex) { }
}

/**
 * Automatic enable/disable from/to date options on selecting special case date options in advanced filters
 * @author Prashik
 * @Date   2019-02-28T11:49:03+0530
 * @param  {object}                 fieldObj      [input field objects]
 * @param  {bool}                 enableDisable [enable/disable fields flag]
 */
function enableDisableDateField(fieldObj, enableDisable) {
    if (enableDisable == "disable") {
        fieldObj.prop("disabled", true);
        fieldObj.parent().addClass("pe-none opacity-50 shadow-none");
    }
}

/**
 * get first day of the week for and passed date's week
 * @author Prashik
 * @Date   2019-02-28T11:51:48+0530
 * @param  {object}                 currentDate [date object for the date whose first day of week to be calculated]
 * @return {object}                             [date object as first date of the week for the input date]
 */
function getFirstDayOfWeek(currentDate) {
    currentDate = new Date(currentDate);
    var day = currentDate.getDay();
    var diff = currentDate.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(currentDate.setDate(diff));
}

/**
 * check if number/timestamp exist between the given from and to input scope
 * @author Prashik
 * @Date   2019-02-28T11:58:06+0530
 * @param  {int}                 minVal      [form value]
 * @param  {int}                 maxVal      [to value]
 * @param  {int}                 currentData [value to be compared]
 * @return {bool}                            [return if number os between scope or not]
 */
function isNumberBetweenScope(minVal, maxVal, currentData) {
    return ((isNaN(minVal) && isNaN(maxVal)) || (isNaN(minVal) && currentData <= maxVal) || (minVal <= currentData && isNaN(maxVal)) || (minVal <= currentData && currentData <= maxVal));
}

/**
 * Generate Filter pill
 * @author Prashik
 * @Date   2019-02-28T12:39:01+0530
 * @param  {object}                 filterJSON           object for filter pill
 * @param  {string}                 advFilterNameValue   name of advanced filter
 * @param  {integer}                 indexOfArray         index if filter pill
 * @param  {boolean}                isPillAlreadyChecked    if pill is checked
 */
function generateFilterPill(filterJSON, advFilterNameValue, indexOfArray, isPillAlreadyChecked) {

    var indexOfFilterArray;
    var limitExceeded = false;
    var isFirstTime = false;

    //apply the pill is is directly handled in chekcbox click ivirCheckBox 

    var name = advFilterNameValue;

    // if (requestJSON && iviewButtonStyle != "old") {
        maxNoOfPills = 1;
    // }

    if (indexOfArray === undefined) {
        //means first time or new one
        if (jQuery.isEmptyObject(ivirMainObj)) {
            var filterArr = ivirMainObj.filter = [];
            isFirstTime = true;
            indexOfFilterArray = 0;
        } else if (ivirMainObj.filter === undefined) {
            var filterArr = ivirMainObj.filter = [];
            indexOfFilterArray = 0;
        } else {
            var filterArr = ivirMainObj.filter;
            isFirstTime = false;
            if (filterArr.length >= maxNoOfPills)
                limitExceeded = true;
            indexOfFilterArray = filterArr.length;
        }

        var filterObj = new Object();
    } else {
        var filterObj = ivirMainObj.filter[indexOfArray];
        indexOfFilterArray = indexOfArray;
    }



    if (!limitExceeded) {

        filterObj.n = name;
        filterObj.data = JSON.parse(filterJSON);
        if (indexOfArray === undefined) {
            filterArr.push(filterObj);
            if (isFirstTime || $("#ivirFilteredAccordion").length == 0) {
                if ($("#ivirFilteredAccordion").length == 0)
                    createPills("all", "first");
                else {
                    $("[id^='filterpillCB']").prop('checked', false).removeAttr('checked');
                    createPills("all", "last");
                }
            } else if ($("#ivirFilteredAccordion").length > 0) {
                $("[id^='filterpillCB']").prop('checked', false).removeAttr('checked');
                upateThePills("filter", indexOfFilterArray, name);
            }
        } else {

            $("[id^='filterpillCB']").prop('checked', false).removeAttr('checked');
            $("#filterpillCB" + indexOfArray).prop('checked', true).attr('checked', 'checked');

            $("#filterpillCB" + indexOfArray).parent().next().find('.ivirCndtnName').attr('title', "Edit " + name).text(name);
        }
    } else {
        showAlertDialog("warning", appGlobalVarsObject.lcm[23]);
    }
    try {
        advFiltersObjectToApply = ivirMainObj.filter[indexOfFilterArray].data;
    } catch (e) { }

    setSmartViewHeight();

    return true;
}

/**
 * Will be called when ever an custom action is selected
 * @author ManiKanta
 * @Date   2018-11-19T14:43:21+0530
 * @param  {String}                 actName id of the original action button
 * @return {}                         
 */
function fireTheCustomAction(actName) {
    $("#" + actName).click();
    javascript: __doPostBack(actName, '');
}


/**
 * Function to toggle between chart layout and grid layout
 * @author ManiKanta
 * @Date   2018-11-19T14:47:00+0530
 * @param  {String}                 divToShow   which one to show
 * @param  {String}                 typeOfChart Type of chart to show
 * @param  {Object}                 elem        clicked buttons
 * @return {}                            
 */
function ivirShowChart(divToShow, typeOfChart, elem) {
    if (divToShow !== 'chart') {
        $(".chartCndtnWrapper").hide();
        $("#ivir" + divToShow).show();
    }
    $("#ivirChartsRow span.customError").remove();
    $(".ivirChartButton").removeClass('active btn-active-light-primary');
    $(elem).addClass('active btn-active-light-primary');
    $("#ivir" + divToShow + " .form-control").first().focus();
}


/**
 * To create a chart based on new data user eneterd or existing data which is already saved
 * @author ManiKanta + Avi
 * @Date   2018-11-19T14:49:45+0530
 * @param  {Numbee}                 indexOfArray  Index of the array if user selecting existing chart condition
 * @param  {Boolean}                isPillChecked To know weather user checking or unchecking the condition
 * @param  {Boolean}                applyThePill  To apply the existing pill or to add new condition
 * @param  {Boolean}                isFromLoad    
 * @return {}                             
 */
function ivirCreateChart(indexOfArray, isPillChecked, applyThePill, isFromLoad) {
    var checkingArray = [];
    var chartArray = [];
    var columnIndex = $("#ivirChartCol").find('option:selected').data("index");
    var columnValue = $("#ivirChartCol").find('option:selected').val();
    var headerName = $(ivirDataTableApi.column(columnIndex).header()).text().trim();
    var valueIndex = $("#ivirChartVal").find('option:selected').data("index");
    var valueVal = $("#ivirChartVal").find('option:selected').val();
    var chartName = $("#ivirChartName").val();
    var typeOfChart = $("#ivirChartsRow .ivirChartButton.active").data('type');
    var isFirstTime = true;
    var limitExceeded = false;
    if (applyThePill === undefined) {
        var name = chartName;
        var colIndex = getPropertyAccess(columnValue);
        var colValue = getPropertyAccess(valueVal);
        var chartType = typeOfChart;
    } else {
        var ivirMainChartObj = ivirMainObj.chart[indexOfArray];
        var name = ivirMainChartObj.n;
        var colIndex = ivirMainChartObj.cl;
        var colValue = ivirMainChartObj.v;
        var chartType = ivirMainChartObj.t;
        valueIndex = typeof valueIndex == "undefined" ? FieldName.indexOf(colValue) : valueIndex;

    }
    if (!isFromLoad) {
        if (name == "") {
            ivirCustomErrMsg($("#ivirChartName"), errorMessages.emptyField)
            return false;
        } else if (!testRegex("validName", name)) {
            ivirCustomErrMsg($("#ivirChartName"), errorMessages.invalidName);
            return false;
        }
        if (colIndex == undefined || colIndex === "") {
            ivirCustomErrMsg($("#ivirChartCol"), errorMessages.emptySelect)
            return false;
        }
        if (colValue == undefined || colValue === "") {
            ivirCustomErrMsg($("#ivirChartVal"), errorMessages.emptySelect)
            return false;
        }

        if (!chartType) {
            ivirCustomErrMsg($("#ivirChartsRow"), errorMessages.emptySelect);
            return false;
        }
    } else {
        var chartObj = ivirMainObj.chart[indexOfArray];
        chartName = chartObj.n;
        columnIndex = chartObj.cl;
        valueIndex = chartObj.v;
        chartType = chartObj.t;
        valueIndex = typeof valueIndex == "undefined" ? FieldName.indexOf(valueIndex) : valueIndex;
    }
    var isCBchecked;
    if ($('input[name="chkItem"]:checked').length == 0)
        isCBchecked = false;
    else
        isCBchecked = true;



    if ((indexOfArray === undefined) || isPillChecked) {
        var isDataExists = false;
        ivirDataTableApi.rows(":not(.specialRow)", { search: 'applied' }).every(function (rowIdx, tableLoop, rowLoop) {
            var nodeData = ivirDataTableApi.rows(rowIdx).data()[0];
            var node = this.node();
            var allTds = $(node).find('td');
            var presentCB = "";
            if (isCBchecked)
                presentCB = allTds.eq(0).find('input[name=chkItem]').is(':checked')
            else
                presentCB = true;
            if (presentCB) {
                var graphCol = ``;
                var graphValue = ``;
                (!isNaN(parseFloat(colIndex))) ? graphCol = nodeData[Object.keys(nodeData)[colIndex]] : graphCol = nodeData[colIndex],
                    (!isNaN(parseFloat(colValue))) ? graphValue = nodeData[Object.keys(nodeData)[colValue]] : graphValue = nodeData[colValue]

                if (ColumnType[FieldName.indexOf(valueVal)] == "n") {
                    graphValue = graphValue.replace(/,/g, '');
                }

                if (anchorRegexPatter.test(graphCol))
                    graphCol = $(graphCol).text();

                if (anchorRegexPatter.test(graphValue))
                    graphValue = parseFloat($(graphValue).text());
                var existingIndex = $.inArray(graphCol, checkingArray);
                if (existingIndex == -1) {

                    checkingArray.push(graphCol);
                    var tmpObj = {} //{"name":"Walk In","y":0.0}
                    tmpObj.name = graphCol;
                    graphValue = parseFloat(graphValue);
                    if (graphValue !== 0 && graphValue && graphValue !== "") isDataExists = true;
                    if (chartType == 'pie' || chartType == 'donut') {
                        tmpObj.y = graphValue;
                    } else if (chartType == 'bar' || chartType == 'column') {
                        tmpObj.data = [graphValue];
                    }
                    chartArray.push(tmpObj);

                } else {
                    //means in array we need to increment the val
                    var existingObj = chartArray[existingIndex]
                    if (chartType == 'pie' || chartType == 'donut') {
                        var earlierVal = existingObj.y;
                        earlierVal = parseFloat(earlierVal), graphValue = parseFloat(graphValue)
                        existingObj.y = earlierVal + graphValue;
                    } else if (chartType == 'column' || chartType == 'bar') {
                        var earlierVal = existingObj.data[0];
                        existingObj.data = [parseFloat(earlierVal) + parseFloat(graphValue)];
                    }


                }
            }
        })

    }

    let processCheckedPill = isPillChecked;

    if (indexOfArray === undefined) {
        //means first time or new one
        if (ivirMainObj.chart === undefined) {
            var chartArr = ivirMainObj.chart = [];
            indexOfChartArry = 0;
        } else {
            var chartArr = ivirMainObj.chart;
            isFirstTime = false;
            if (chartArr.length >= maxNoOfPills)
                limitExceeded = true;
            indexOfChartArry = chartArr.length;
        }

        var chartObj = new Object();
    } else {
        var chartObj = ivirMainObj.chart[indexOfArray];
        indexOfChartArry = indexOfArray;
        if (!(processCheckedPill && requestJSON && ((typeof chartObj.checked == "undefined" || chartObj.checked)))) {
            processCheckedPill = false;
        }
    }


    if ((indexOfArray === undefined) || processCheckedPill) {
        if (chartType == 'pie') {
            pieChart(isDataExists, JSON.stringify(chartArray), name, indexOfChartArry, valueIndex);
        } else if (chartType == 'donut') {
            pieChart(isDataExists, JSON.stringify(chartArray), name, indexOfChartArry, valueIndex, true);
        } else if (chartType == 'bar' || chartType == 'column') {
            var dataTosend = '["' + headerName + '"]~' + JSON.stringify(chartArray);
            columnChart(isDataExists, dataTosend, name, indexOfChartArry, chartType, valueIndex)
        }
    }

    if (!limitExceeded) {
        chartObj.n = name;
        chartObj.t = chartType;
        chartObj.cl = colIndex;
        chartObj.v = colValue;

        if (indexOfArray === undefined) {
            chartArr.push(chartObj);
            if (requestJSON && ivirMainObj && ivirMainObj.chart && ivirMainObj.chart.length > 0) {
                $("#ivirMainDataTableWrapper").show();
            }
            if (!$("#ivirChartPills").hasClass('pillsAdded'))
                createChartPills();
            else
                upateTheChartPills(indexOfChartArry, name);

        } else {
            //highlight0pillCB
            if (processCheckedPill) {
                if (!(requestJSON)) {//temp
                    $(".ivirChartCheckBox").prop('checked', false).removeAttr('checked');
                }
                $("#chartpillCB" + indexOfArray).prop('checked', true).attr('checked', 'checked');
            } else {
                $("#chartpillCB" + indexOfArray).prop('checked', false).removeAttr('checked');
            }
            $("#ivirchart" + indexOfArray + "CndtnPill .ivirCndtnName").attr('title', "Edit " + name).text(name);

        }
    } else {
        showAlertDialog("warning", appGlobalVarsObject.lcm[23]);
    }
    setSmartViewHeight();
    return true;
}

//reset this values in resetSmartViewVariables function
var nxtScrollSize = 100; //default record size for datatable initilization
var defaultRecsPerPage = 100; //fetch size value
var checkNextDBRowsExist = true; //fetch size info, true if webservice call is required
var dtPageNo = 1; //iview page no for datatable
var dtTotalRecords = 0; //datatable current page record count
var dtDbTotalRecords = 0; //datatable total records
var autoAppendRecords = false; //true - lazy binding, which will automatically append all records to datatable after datatable initilization 
var pageScrollToEnd = false; //flag used to check page is scrolled to end of div
var scrollTopPosition = 0; //to get the scroll position of the div before datatable draw event & update the scroll position to same after draw event
/**
 * The main function will be called on load of the interactive report
 * Also have the configuration of data table grouping logics and more
 * @author ManiKanta + Prashik
 * @Date   2018-11-19T14:52:42+0530
 * @param  {String}                 task            To re-apply or to clear or grouping
 * @param  {Numeric}                index           In case of group or groupApply this param have the value of the grouped column
 * @param  {Array/Object}           totalArray      The info about the subtotal for that group
 * @param  {Array/Object}           grandTotalArray Info about any grandtotal 
 * @return {}                              
 */
function createIvirDataTable(task, index, totalArray, grandTotalArray) {
    dtInitalising = true;

    var heightOfDT = $(".iviewTableWrapper")[0].offsetHeight + "px";
    var dataTblObj = {};
    var pillsAccordionHtml = "";
    let accordianClone = "";
    if (task == "clear" || task == "groupApply" || task == "group") {
        pillsAccordionHtml = $("#pillsWrapper").html();

    }





    dataTblObj.scrollY = heightOfDT;
    dataTblObj.scrollX = true;

    dataTblObj.dom = "<'#ivirCustomContainer.container-fluid'<'row'<'#pillsWrapper.col-md-6 col-sm-6'><'col-md-6 col-sm-6 pull-right'l>>><'#ivirMainDataTableWrapper'<'iviewPreTableCustom'>t<'iviewPostTableCustom'>>";

    dataTblObj.scrollCollapse = true;
    dataTblObj.colReorder = false;
    dataTblObj.language = {
        search: "_INPUT_",
        searchPlaceholder: "Search...",
        "lengthMenu": "Show _MENU_ rows",
        /**
         * set next/prev icons
         */
        paginate: {
            next: '<span class="material-icons">navigate_next</span>',
            previous: '<span class="material-icons">navigate_before</span>'
        },



        // "zeroRecords": "Nothing found - sorry",
        // "info": "Showing page _PAGE_ of _PAGES_",
        // "infoEmpty": "No records available",
        // "infoFiltered": "(filtered from _MAX_ total records)"
    }
    dataTblObj.lengthMenu = [10, 25, 50, 75, 100, 250, 500];
    dataTblObj.lengthChange = false;
    dataTblObj.buttons = [
        {
            extend: 'copyHtml5',
            text: 'Copy',
            title: IVIRCaption,
            exportOptions: {
                stripHtml: true,
                trim: false,
                stripNewlines: false,
                decodeEntities: false,
                columns: function (idx, data, node) {
                    var isVisible = ivirDataTableApi.column(idx).visible();
                    var isForExport = true;
                    if ((isChkBox == "true" && idx == 0) || !isVisible) {
                        isForExport = false;
                    }
                    return isForExport
                },
                rows: ''
            }
        }, {
            extend: 'csvHtml5',
            text: 'CSV',
            title: IVIRCaption,
            exportOptions: {
                stripHtml: false,
                trim: false,
                stripNewlines: false,
                decodeEntities: false,
                columns: function (idx, data, node) {
                    var isVisible = ivirDataTableApi.column(idx).visible();
                    var isForExport = true;
                    if ((isChkBox == "true" && idx == 0) || !isVisible) {
                        isForExport = false;
                    }
                    return isForExport
                },
                rows: ''
            }
        }, {
            extend: 'excelHtml5',
            text: 'Excel',
            title: IVIRCaption,
            exportHF: ivExportHF,
            exportOptions: {
                stripHtml: false,
                trim: false,
                stripNewlines: false,
                decodeEntities: false,
                columns: function (idx, data, node) {
                    var isVisible = ivirDataTableApi.column(idx).visible();
                    var isForExport = true;
                    if ((isChkBox == "true" && idx == 0) || !isVisible) {
                        isForExport = false;
                    }
                    return isForExport
                },
                rows: ''
            },
            createEmptyCells: true,
        }, {
            extend: 'pdfHtml5',
            text: 'PDF',
            title: IVIRCaption,
            exportHF: ivExportHF,
            exportOptions: {
                stripHtml: false,
                trim: false,
                stripNewlines: false,
                decodeEntities: false,
                columns: function (idx, data, node) {
                    var isVisible = ivirDataTableApi.column(idx).visible();
                    var isForExport = true;
                    if ((isChkBox == "true" && idx == 0) || !isVisible) {
                        isForExport = false;
                    }
                    return isForExport
                },
                rows: ''
            },
            customize: function (doc) {
                doc.defaultStyle.fontSize = 8;
                doc.styles.tableHeader.fontSize = 8;
                doc.content.filter((data) => { return data.table })[0].table.widths = Array(doc.content.filter((data) => { return data.table })[0].table.body[0].length + 1).join('%').split('');

            }

        }, {
            extend: 'print',
            text: 'Print',
            title: "",
            exportHF: ivExportHF,
            exportOptions: {
                stripHtml: false,
                trim: false,
                stripNewlines: false,
                decodeEntities: false,
                columns: function (idx, data, node) {
                    var isVisible = ivirDataTableApi.column(idx).visible();
                    var isForExport = true;
                    if ((isChkBox == "true" && idx == 0) || !isVisible) {
                        isForExport = false;
                    }
                    return isForExport
                },
                rows: ''
            },

        },
        {
            extend: 'print',
            text: 'HTML',
            title: "",
            exportHF: ivExportHF,
            exportOptions: {
                stripHtml: false,
                trim: false,
                stripNewlines: false,
                decodeEntities: false,
                columns: function (idx, data, node) {
                    var isVisible = ivirDataTableApi.column(idx).visible();
                    var isForExport = true;
                    if ((isChkBox == "true" && idx == 0) || !isVisible) {
                        isForExport = false;
                    }
                    return isForExport
                },
                rows: ''
            },
            htmlExport: true
        },
        {
            text: 'JSON',
            title: IVIRCaption,
            action: function (e, dt, button, config) {
                this.processing(true);

                var data = dt.buttons.exportData();

                $.fn.dataTable.fileSave(
                    new Blob([JSON.stringify(data)]),
                    `${IVIRCaption}.json`
                );

                this.processing(false);
            }
        }
    ];
    dataTblObj.select = {
        style: "multi"
    };
    dataTblObj.paging = true;
    dataTblObj.pageLength = pageLength = -1;
    dataTblObj.aaSorting = [];
    dataTblObj.orderClasses = false;
    /**
     * datatable 1st time initialization complete call back function
     * @author Prashik
     * @Date   2019-04-11T12:08:56+0530
     */
    dataTblObj.initComplete = function (settings, json) {
        /**
         * datatable 1st time initialization complete pre call back hook
         * @author Prashik
         * @Date   2020-05-20T12:08:56+0530
         */
        try {
            axDatatablePreInitComplete(settings, json);
        } catch (ex) { };


        if ($("#hdnIsParaVisible").val() != "hidden") {
            if(iviewButtonStyle == "old" && requestJSON) {
                $("#myFiltersLi").removeClass("d-none");
            }
            $("[id=dvSelectedFilters]").removeClass("d-none");
        }

        // $("#ivirCButtonsWrapper").removeClass("d-none");

        if (appGlobalVarsObject._CONSTANTS.compressedMode) {

            appGlobalVarsObject.methods.toggleCompressModeUI($('body'));
        }

        $(".animationLoading").hide();

        var scrollExist = $(".dataTables_scrollBody").hasScrollBar();
        if ($.isEmptyObject(advFiltersObjectToApply) || advFiltersObjectToApply.somedummyfilterjsobjectkey) {
            if (scrollExist)
                $("#requestNextRecords").hide();
            else
                $("#requestNextRecords").show();
        }

        var specialRowCnt = getSpecialRowCount();

        if (dtDbTotalRecords > nxtScrollSize || specialRowCnt > 0 ? ivDatas.length > nxtScrollSize : false)
            appendRowsAfterLoad(); //appends remaining records(except default record count - nxtScrollSize) to the grid after datatable initilization


        autoSplitChecker();

        try {
            recordsExist = this.fnSettings().fnRecordsTotal() > 0;
        } catch (ex) { }

        
        if(iName == "ad___acs"){
            $("#dvRefreshParam").parent().prepend(`<a id="newFormForRuntime" href="javascript:void(0)" onclick="javascript:getAxpertStudioAddFormData();" class="btn btn-white btn-color-gray-600 btn-active-primary d-inline-flex align-items-center shadow-sm me-2 dwbIvBtnbtm"><span class="material-icons">add_circle_outline</span>New Form</a>`);
        }

        if(iName == "ad___cfd"){
            $("#dvRefreshParam").parent().prepend(`<a id="newFormForRuntime" href="javascript:void(0)" onclick="javascript:callAxpertConfigStudio('addfield','','');" class="btn btn-white btn-color-gray-600 btn-active-primary d-inline-flex align-items-center shadow-sm me-2 dwbIvBtnbtm"><span class="material-icons">add_circle_outline</span>New Field</a>`);
        }

        if (iName == "ad___acr") {
            $("#dvRefreshParam").parent().prepend(`<a id="newAxRules" href="javascript:void(0)" onclick="javascript:loadAxRuleEngineForm('true');" class="btn btn-white btn-color-gray-600 btn-active-primary d-inline-flex align-items-center shadow-sm me-2 dwbIvBtnbtm"><span class="material-icons">add_circle_outline</span>New Rule</a>`);
        }

        scrollToLastKnownDrilldown();

        /**
         * datatable 1st time initialization complete post call back hook
         * @author Prashik
         * @Date   2020-05-20T12:08:56+0530
         */
        try {
            axDatatablePostInitComplete(settings, json);
        } catch (ex) { };

        dtInitCompleted = true;

        setTimeout(function () {
            // $(window).trigger("resize");

            
            // if (!responsiveColumnWidth) {
            //     forceColumnWidth();
            // }
            setTimeout(() => {
                $("#GridView1 thead").addClass("headSortUiFix");
                
                setTimeout(() => {
                    hideDataTableLoading();

                    if(oldLoadViewName){
                        smartStepper(true, ("vw" + (new Date().getTime())), "");
                    }
                }, 100);
            }, 0);
        }, 0);
    };
        var recCount = `<a href="javascript:void(0)" onclick="getIviewRecordCount();" id="getIviewRecordCountVal" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-dismiss="click" data-bs-original-title="Total Row Count" class="d-flex flex-row-auto w-auto flex-center rounded shadow-sm mx-2">
            <span class="material-icons material-icons-style material-icons-3">
                question_mark
            </span>
        </a>`;
        dataTblObj.preDrawCallback = function (settings) {
            scrollTopPosition = Math.round($(".dataTables_scrollBody").scrollTop());
        };
        dataTblObj.drawCallback = function (settings) {
            /**
             * datatable pre in drawCallback hook
             * @author Prashik
             * @Date   2020-05-20T12:08:56+0530
             */
            try {
                axDatatablePreInDrawCallBack(settings);
            } catch (ex) { };

            $('#GridView1 tbody').append($('#GridView1 tr.gtot-no-sort').detach());

            enableMobileCards();
            expandCollapseCardsLogic();



            
            
            // if (!responsiveColumnWidth) {
            //     forceColumnWidth();
            // }
            
            drawCallbackPaginationLogic();
            
            // scrollToLastKnownDrilldown();

            /**
             * datatable post in drawCallback hook
             * @author Prashik
             * @Date   2020-05-20T12:08:56+0530
             */
            try {
                axDatatablePostInDrawCallBack(settings);
            } catch (ex) { };
        }
    
    if (isChkBox == "true" || (rowOptionsExist && !false)) {
        dataTblObj.columnDefs = [{
            "targets": 0,
            "orderable": false
        }];
    } else {
        dataTblObj.columnDefs = [];
    }
    if (task == undefined) {
        getAllNumericColumns();
        dataTblObj.columnDefs.push({ className: "dt-right", "targets": numericColumns });
    }
    // if (!responsiveColumnWidth) {
    //     dataTblObj.autoWidth = false;
    // }
    dataTblObj.autoWidth = false;
        /**
         * cell creation and manipulation datatable callback function
         * @author Prashik
         * @Date   2019-04-11T12:13:45+0530
         */
        dataTblObj.columnDefs.push({
            "targets": "_all",
            createdCell
        });
        /**
         * row creation and manipulation datatable callback function
         * @author Prashik
         * @Date   2019-04-11T12:15:12+0530
         * @param  {object}                 row       : row html object
         * @param  {object}                 data      : row data object
         * @param  {int}                 dataIndex : row index
         */
        dataTblObj.createdRow = (row, data, dataIndex) => {
            saveSubHeadInfo(row, data, dataIndex);

            if (typeof rowRefreshIndex != "undefined") {
                dataIndex = rowRefreshIndex;
            }
            try {
                if (cardTemplatingHTML) {
                    cardTemplatingHTML = getLayoutHTML(cardTemplatingHTML);

                    renderRowTemplete(cardTemplatingHTML, row, data, dataIndex);
                    rowRefreshIndex = undefined;
                    return;
                }
            } catch (ex) { }

            if (data[getPropertyAccess("axrowtype")] && (data[getPropertyAccess("axrowtype")] == "stot" || data[getPropertyAccess("axrowtype")] == "subhead" || data[getPropertyAccess("axrowtype")] == "gtot")) {
                $(row).addClass("specialRow");
            }

            if (data[getPropertyAccess("axrowtype")] && data[getPropertyAccess("axrowtype")] == "gtot") {
                $(row).addClass("gtot-no-sort");

            }

            /**
             * Expand/Collapse TreeMethod
             * @author Prashik
             * @Date   2019-04-11T12:17:31+0530
             */
            if (cellHeaderConf.root_class_index) {
                $(row).addClass((data[getPropertyAccess(cellHeaderConf.root_class_index)] ? data[getPropertyAccess(cellHeaderConf.root_class_index)].toString() : ""));
            }

            try {
                createdRowEndCustom(row, data, dataIndex);
            } catch (ex) { };
            rowRefreshIndex = undefined;
        }

        tableWidth = 0;

        visibleTableWidth = 0;






        if (!responsiveColumnWidth) {
            try {
                horizontalScrollExist = true;
                $("#GridView1 thead tr th:eq(0)").removeClass("sorting_disabled");
                widthIncrement = $("#GridView1 thead tr th:eq(0)").outerWidth() - $("#GridView1 thead tr th:eq(0)").width() || 0;
            } catch (ex) {
                widthIncrement = 0;
            }
        }

        /**
         * smartviews column properties initialization
         * @author Prashik
         * @Date   2019-04-11T12:18:30+0530
         */
        dataTblObj.columns = FieldName.map((fld, ind) => {
            if(isListView && !ivirMainObj?.design && fld != "rowno"){
                let fldLength = ivHeadRows[fld]["@width"];//tstFields.filter(fld => fld.name == fld)?.[0]?.length || 15;

                ivHeadRows[fld]["@width"] = (fldLength > 51 ? 400 : (fldLength <= 15) ? 150 : (fldLength * 8)).toString();
            }

            var width = ivirMainObj?.design?.filter(dsign => dsign.name == fld)?.[0]?.width || ivHeadRows[fld]["@width"] || (isListView && ind == 0 ? listViewCheckBoxSize : minCellWidth);

            if (!responsiveColumnWidth) {
                (ivHeadRows[fld]["@hide"].toString() || "true") == "false" ? visibleTableWidth += (parseInt(width, 10) + widthIncrement) : "";

                tableWidth += (parseInt(width, 10) + widthIncrement);
            } else {
                (ivHeadRows[fld]["@hide"].toString() || "true") == "false" ? tableWidth += (parseInt(width, 10) + widthIncrement) : "";
            }


            let returnData = { "data": getPropertyAccess(fld), "name": getPropertyAccess(fld), "width": `${width}px`, "className": colAlign[ivHeadRows[fld]["@align"] || (fld == "rowno" && !enableCardsUi ? "Center" : "Left")] }

            if (!pivotCreated && (designIndex = ivirMainObj?.design?.findIndex(col => col.name == getPropertyAccess(fld))) >= 0) {
                returnData.order = designIndex + 1;
            }

            return returnData;
        });

        if (!responsiveColumnWidth) {

        }

        if (!pivotCreated && ivirMainObj?.design) {
            ivirMainObj.design.forEach((col, ind) => $(`table#GridView1 thead th[data-header-name=${col.name}]`)?.attr("data-order", ind + 1)?.data("order", ind + 1));

            $(`table#GridView1 thead th[data-header-name=rowno]`)?.attr("data-order", 0)?.data("order", 0);

            var orderedColumns = $("table#GridView1 thead th").detach();

            orderedColumns = [...orderedColumns].sort((a, b) => {
                const contentA = !isNaN(dataA = parseInt($(a).data('order'))) ? dataA : +"1".repeat(7);
                const contentB = !isNaN(dataB = parseInt($(b).data('order'))) ? dataB : +"1".repeat(7);
                return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
            });

            $("table#GridView1 thead tr").append(orderedColumns);

            try {
                dataTblObj.columns.filter(col => col.name == "rowno")[0].order = 0;
            } catch (ex) { }

            dataTblObj.columns = _.sortBy(dataTblObj.columns, ['order']);

            if(hiddenColumnIndex){
                hiddenColumnIndex = hiddenColumnIndex.map(col=>{
                    return dataTblObj.columns.findIndex(dtCol=>dtCol.name==FieldName[col]);
                });
            }
        }

        dtColumns = dataTblObj.columns;

        $(ivirTable).css({ "width": `${tableWidth}px` });

        nxtScrollSize = ivDatas.length;

        /**
         * smartviews 1st page data initialization
         * @author Prashik
         * @Date   2019-04-11T12:18:30+0530
         */
        dataTblObj.data = ivDatas.length != undefined ? ivDatas.slice(0, nxtScrollSize) : ivDatas;

        dataTblObj.deferRender = true;
 

    if (responsiveColumnWidth) {
        var widthOfGrid = tableWidth || $("table#GridView1")[0].offsetWidth;
        var windowWidth = $(window).width();
        if ((document.title == "Iview" && typeof axpResp != "undefined" && axpResp == "true") || widthOfGrid <= windowWidth)
            $(".gridData").css({ "width": "100%", "min-width": "100%" });
    }

    if (grandTotalArray && grandTotalArray.length != 0) {
        dataTblObj.footerCallback = function (row, data, start, end, display) {
            var api = this.api(),
                data;

            // Remove the formatting to get integer data for summation
            var intVal = function (i) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '') * 1 :
                    typeof i === 'number' ?
                        i : 0;
            };

            for (var i = 0; i < grandTotalArray.length; i++) {
                if (grandTotalArray[i] != "-1") {
                    // Total over all pages
                    var presIndex = grandTotalArray[i];
                    total = api
                        .column(presIndex)
                        .data()
                        .reduce(function (a, b) {
                            if (b.trim() == "" || b.trim() == "&nbsp;")
                                b = 0;
                            var res = anchorRegexPatter.test(b);
                            if (res)
                                b = $(b).text()
                            b = checkFroNegativeValue(b)
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Total over this page
                    pageTotal = api
                        .column(presIndex, { page: 'current' })
                        .data()
                        .reduce(function (a, b) {

                            if (b.trim() == "" || b.trim() == "&nbsp;")
                                b = 0;
                            var res = anchorRegexPatter.test(b);
                            if (res)
                                b = $(b).text()
                            b = checkFroNegativeValue(b)
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Update footer
                    $(api.column(presIndex).footer()).html(
                        '<br />' + (checkNextDBRowsExist ? 'Running' : 'Grand') + '  Total : ' + commaSeparateNumber(total.toFixed(2))
                    );
                }
            }

        }
        ivirDataTableApi.fixedColumns().relayout();
        $("#iviewFrame").removeClass("hideDatatableFooter");
    } else {
        $("#iviewFrame").addClass("hideDatatableFooter");
    }
    if (ivirVisibleColumns.length > 0) {


        if (task == 'group' || task == 'groupApply') {
            task != 'groupApply' ? colIndex = index : colIndex = ivirMainObj.group[index].cl;
            var idx = ivirVisibleColumns.indexOf(colIndex);
            ivirVisibleColumns.splice(idx, 1);
            var prevCheckedGroup = $("[id^='grouppillCB']:checked");
            if (prevCheckedGroup.length) {
                var prevCheckdIdx = prevCheckedGroup.data("index");
                prevCheckdIdx = ivirMainObj.group[prevCheckdIdx].cl;
                if ($.inArray(prevCheckdIdx, ivirVisibleColumns) === -1)
                    ivirVisibleColumns.push(prevCheckdIdx);
            }
        }
        var allVisibleColArray = ivirVisibleColumns;
        if (isChkBox == "true" || (rowOptionsExist && !false))
            allVisibleColArray.push(0);
        dataTblObj.columnDefs.push({ targets: ivirVisibleColumns, visible: true });
        dataTblObj.columnDefs.push({ targets: '_all', visible: false, searchable: searchHiddenColumnsInReports });
        dataTblObj.columnDefs.push({ targets: 0, searchable: false });
    }
    if (task == undefined || task == "clear") {
        if (task == "clear") {
            groupingCol = "";
            $(".rightClickMenu li.freeze").removeClass('d-none');
            ivirDatatable.fnDestroy();
            $(ivirTable + " tfoot td").html("");
        }

        /**
         * smartviews defination hidden coulmns logic implementation
         * @author Prashik
         * @Date   2019-04-11T12:18:30+0530
         */
        dataTblObj.columnDefs.push({ targets: hiddenColumnIndex, visible: false, searchable: searchHiddenColumnsInReports });
        dataTblObj.columnDefs.push({ targets: 0, searchable: false });
        $.fn.dataTable.moment('DD/MM/YYYY');
        $.fn.dataTable.ext.errMode = 'none';
        $.fn.dataTable.Api.register('order.neutral()', function () {
            return this.iterator('table', function (s) {
                s.aaSorting.length = 0;
                s.aiDisplay.sort(function (a, b) {
                    return a - b;
                });
                s.aiDisplayMaster.sort(function (a, b) {
                    return a - b;
                });
            });
        });


        try {
            /**
            * Datable init object customization hook
            * @author Prashik
            * @Date   2019-08-20T12:18:30+0530
            *
            *create axUpdateDtConfig function in custom JS file
            **function axUpdateDtConfig(dataTblObj){return dataTblObj}
            *
            * Configuration changes can be done as follows
            **In case of Sorting(oreracle configuration)
            ***modify existing configuration
            ****=> dataTblObj.columnDefs.filter((defVal)=>{return defVal.targets == "_all" && typeof defVal.orderable != "undefined"})[0].orderable = false
            ***add configuration
            ****=> dataTblObj.columnDefs.push({"targets": "_all", "orderable": false});})
            */
            dataTblObj = $.isEmptyObject(newDtConfig = axUpdateDtConfig(dataTblObj)) ? dataTblObj : newDtConfig;
        } catch (ex) { }
        ivirDataTableApi = $(ivirTable).DataTable(dataTblObj);
        if (task == "clear") {
            if (pillsAccordionHtml != "") {
                $("#pillsWrapper").html(pillsAccordionHtml);
            }
        }
    } else if (task == 'group' || task == 'groupApply') {

        var colIndex = "";
        task != 'groupApply' ? colIndex = index : (colIndex = ivirMainObj.group[index].cl, totalArray = ivirMainObj.group[index].t);
        groupingCol = colIndex;
        $(".rightClickMenu li.freeze").addClass('d-none');
        var allColsLength = ivirDataTableApi.columns()[0].length;

        dataTblObj.columnDefs.push({ targets: colIndex, visible: false, searchable: false });
        dataTblObj.columnDefs.push({ targets: 0, searchable: false });
        dataTblObj.order = [
            [colIndex, 'asc']
        ];
        dataTblObj.drawCallback = function (settings) {
            /**
             * datatable pre in drawCallback hook
             * @author Prashik
             * @Date   2020-05-20T12:08:56+0530
             */
            try {
                axDatatablePreInDrawCallBack(settings);
            } catch (ex) { };

            enableMobileCards();
            expandCollapseCardsLogic();
            var api = this.api();
            var rows = api.rows({ page: 'current' }).nodes();
            var last = null;
            var sortedArray = settings.aaSorting;
            var tmpGrpTotalArray = [];
            var tmpLastFld = "";
            var presGroupCnt = 0;
            api.column(colIndex, { page: 'current' }).data().each(function (group, colIdx) {
                var orgnalGrpName = group;
                var res = anchorRegexPatter.test(group);
                if (res)
                    group = $(group).text()
                if (last !== group) {
                    var presentGroupHtml = "";
                    presentGroupHtml += '<tr class="group">';
                    if (totalArray == undefined || totalArray.length == 0) {
                        presentGroupHtml += '<td colspan="' + allColsLength + '">' + orgnalGrpName + '</td>';
                    } else {
                        presentGroupHtml += '<td class="groupName">' + orgnalGrpName + '</td>';
                        for (var j = 0; j < allColsLength; j++) {
                            if (j == colIndex)
                                continue
                            var inArray = $.inArray(j, totalArray);
                            if (inArray != -1) {
                                if (sortedArray[sortedArray.length - 1][0] == colIndex) {
                                    var defaultValToAdd = "0.00";
                                    var aggrFun = totalArray[inArray - 1];
                                    if (aggrFun === "min" || aggrFun === "max") {
                                        //then default value should not be 0 since 0 is taking as min val
                                        defaultValToAdd = "";
                                    }
                                    presentGroupHtml += '<td class="groupTotal" id="groupTotal' + group.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '') + j + '">' + defaultValToAdd + '</td>';
                                } else {
                                    presentGroupHtml += '<td class="groupTotal" id="groupTotal' + group.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '') + j + '"></td>';
                                }

                            } else {
                                if (j !== 0)
                                    presentGroupHtml += '<td></td>';
                            }

                        }
                    }
                    presentGroupHtml += '</tr>';

                    $(rows).eq(colIdx).before(
                        presentGroupHtml
                    );

                    last = group;
                }
                if (sortedArray[sortedArray.length - 1][0] == colIndex)
                    if (totalArray) {
                        val = api.row(api.row($(rows).eq(colIdx)).index()).data();
                        if (tmpLastFld == "") {
                            tmpLastFld = group
                        }
                        else if (tmpLastFld !== group) {
                            _groupChanging("")
                            presGroupCnt = 0;

                            tmpLastFld = group;

                        } else {
                            presGroupCnt++;
                        }
                        var typeCndtnSelected = totalArray[0];
                        var indexSelected = totalArray[1];
                        var valueSelected = getPropertyAccess(totalArray[2]);
                        val = api.row(api.row($(rows).eq(colIdx)).index()).data();
                        var thisSelector = ``;
                        thisSelector = valueSelected;
                        val[thisSelector] = typeof val[thisSelector] == "object" && val[thisSelector] != null ? val[thisSelector].display : (val[thisSelector] != null ? val[thisSelector] : "");
                        var valueOfRow = val[thisSelector].replace(/,/g, "");

                        var res = anchorRegexPatter.test(valueOfRow);
                        if (res)
                            valueOfRow = $(valueOfRow).text();
                        valueOfRow = checkFroNegativeValue(valueOfRow);
                        if (valueOfRow !== "") {
                            valueOfRow = valueOfRow || 0;
                            valueOfRow = parseFloat(valueOfRow);

                            if (typeCndtnSelected == 'sum' || typeCndtnSelected == 'avg') {


                                if (tmpGrpTotalArray.length == 0 || $.inArray(indexSelected, tmpGrpTotalArray) == -1)
                                    tmpGrpTotalArray.push(indexSelected);

                                $("#groupTotal" + group.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '') + indexSelected).text(parseFloat($("#groupTotal" + group.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '') + indexSelected).text()) + valueOfRow);


                            } else if (typeCndtnSelected == 'count') {
                                var valueToAdd = (parseInt($("#groupTotal" + group.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '') + indexSelected).text())) + 1;
                                $("#groupTotal" + group.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '') + indexSelected).text(valueToAdd);

                            } else if (typeCndtnSelected == 'max') {
                                var prevVal = $("#groupTotal" + group.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '') + indexSelected).text();
                                if (prevVal === "") {
                                    //means first time then add the default value as present value -1 so that it will go inside in next loop
                                    prevVal = valueOfRow - 1;
                                }
                                prevVal = parseInt(prevVal);
                                if (valueOfRow > prevVal) {
                                    $("#groupTotal" + group.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '') + indexSelected).text(valueOfRow);
                                }
                            } else if (typeCndtnSelected == 'min') {
                                var prevVal = $("#groupTotal" + group.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '') + indexSelected).text();
                                if (prevVal === "") {
                                    //means first time then add the default value as present value +1 so that it will go inside in next loop
                                    prevVal = valueOfRow + 1;
                                }
                                prevVal = parseInt(prevVal);
                                if (valueOfRow < prevVal) {
                                    $("#groupTotal" + group.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '') + indexSelected).text(valueOfRow);
                                }
                            }



                        }
                        if (ivirDataTableApi.page.info().length - 1 == colIdx || (ivirDataTableApi.rows().count() - 1 == colIdx && presGroupCnt !== 0)) {
                            _groupChanging();
                        }

                        function _groupChanging() {

                            for (var u = 1; u <= totalArray.length; u = u + 2) {
                                var task = totalArray[u - 1];
                                var presColIdx = totalArray[u];

                                var lastTotalVal = $("#groupTotal" + tmpLastFld.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '') + presColIdx).text();
                                if (lastTotalVal === "0.00" || lastTotalVal === "")
                                    lastTotalVal = "0";
                                if (task === "avg") {

                                    lastTotalVal = lastTotalVal / (presGroupCnt + 1);
                                    $("#groupTotal" + tmpLastFld.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '') + presColIdx).text(lastTotalVal);
                                } else {
                                    $("#groupTotal" + tmpLastFld.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '') + presColIdx).text(commaSeparateNumber(lastTotalVal));
                                }
                            }

                        }

                    }

            });



            
            
            // if (!responsiveColumnWidth) {
            //     forceColumnWidth();
            // }
            
            drawCallbackPaginationLogic();
            
            // scrollToLastKnownDrilldown();

            /**
             * datatable post in drawCallback hook
             * @author Prashik
             * @Date   2020-05-20T12:08:56+0530
             */
            try {
                axDatatablePostInDrawCallBack(settings);
            } catch (ex) { };
        };


        // for foooter grandTotal and page total



        ivirDatatable.fnDestroy();
        $(ivirTable + " tfoot td").html("");

        try {
            /**
            * Datable init object customization hook
            * @author Prashik
            * @Date   2019-08-20T12:18:30+0530
            *
            *create axUpdateDtConfig function in custom JS file
            **function axUpdateDtConfig(dataTblObj){return dataTblObj}
            *
            * Configuration changes can be done as follows
            **In case of Sorting(oreracle configuration)
            ***modify existing configuration
            ****=> dataTblObj.columnDefs.filter((defVal)=>{return defVal.targets == "_all" && typeof defVal.orderable != "undefined"})[0].orderable = false
            ***add configuration
            ****=> dataTblObj.columnDefs.push({"targets": "_all", "orderable": false});})
            */
            dataTblObj = $.isEmptyObject(newDtConfig = axUpdateDtConfig(dataTblObj)) ? dataTblObj : newDtConfig;
        } catch (ex) { }


        ivirDataTableApi = $(ivirTable).DataTable(dataTblObj);

        if (pillsAccordionHtml != "")
            $("#pillsWrapper").html(pillsAccordionHtml);



        // Order by the grouping
        $(ivirTable + ' tbody').off('click.grpClick');
        $(ivirTable + ' tbody').on('click.grpClick', 'tr.group', function () {
            var currentOrder = ivirDataTableApi.order()[0];
            if (currentOrder[0] === colIndex && currentOrder[1] === 'asc') {
                ivirDataTableApi.order([colIndex, 'desc']).draw();
            } else {
                ivirDataTableApi.order([colIndex, 'asc']).draw();
            }
        });
    }

    ivirDataTableApi.on('buttons-processing', function (e, indicator) {
        if (!indicator) {
            ShowDimmer(false);
        }
    });

    ivirDatatable = $(ivirTable).dataTable();
  
        var lastScrollTop = 0;
        //if datatable scrolls bottom of the page then check if next db rows exists & call webservice and append the rows to the grid
        $(".dataTables_scrollBody").on("scroll", delay(function (e) {
            var st = Math.round($(this).scrollTop());
            if (st > lastScrollTop) { //append rows to grid only if vertical scroll bar is moved
                var $o = $(e.currentTarget);
                var scrollBarExists = $(this).hasScrollBar();
                var scrollAtTheEnd = scrollBarExists ? $o[0].scrollHeight - $o[0].scrollTop - $o[0].clientHeight < 2 : $o[0].scrollHeight - Math.round($o.scrollTop()) < $o.outerHeight();
                if (!pageScrollToEnd && scrollAtTheEnd) {
                    if (checkNextDBRowsExist && nxtScrollSize < dtDbTotalRecords) //if rows exists in the client side and not binded to the grid then append remaining records to the grid
                        appendNextDtRecords();
                    else if (checkNextDBRowsExist) { //call webservice & append next records to the grid based on fetch size
                        showDataTableLoading();
                        setTimeout(function () {
                            if(checkNextDBRowsExist){
                                setTimeout(() => {
                                    getNextDtRecords(dtPageNo + 1);
                                }, 100);
                            }else{
                                hideDataTableLoading();
                            }
                        }, 0)
                    }
                }
            }
            lastScrollTop = st;
        }, 10));

    /**
     * @description: drawCallback pagination logic
     * @author Prashik
     * @date 2020-07-28
     */
    function drawCallbackPaginationLogic() {
        if (dtDbTotalRecords == 0)
            if ($("#rowsTxtCount").length)
                $("#rowsTxtCount").hide();
            else
                $("#rowsTxtCountNew").hide();
        else {
            var rowsTo = dtDbTotalRecords;
            if (dtDbTotalRecords > iviewDataWSRows && dtDbTotalRecords > nxtScrollSize) { //if autoAppendRecords(lazy binding) is enabled then display total page info, ex: Rows: 1-3500 of 3500
                rowsTo = recCount = dtDbTotalRecords;
                if (autoAppendRecords)
                    setTimeout(function () {
                        appendNextDtRecords();

                        scrollToLastKnownDrilldown();
                    }, 0);//settimeout 0 means add to last of js call stack and execute immediately once call stack queue finishes
            }
            else if (!checkNextDBRowsExist) { //record count < fetch size then display, ex: Rows: 1-18 of 18
                recCount = dtDbTotalRecords;
            }
            else if (iviewDataWSRows <= nxtScrollSize) {
                if ($("#rowsTxtCount").length)
                    $("#requestNextRecords").length == 0 ? $("#rowsTxtCount").append("<span title='Request next page records' id='requestNextRecords' onclick='requestNextRecords()'><span class='material-icons'>chevron_right</span></span>") : "";
                else
                    $("#requestNextRecords").length == 0 ? $("#rowsTxtCountNew").append("<span title='Request next page records' id='requestNextRecords' onclick='requestNextRecords()'><span class='material-icons'>chevron_right</span></span>") : "";

                setSmartViewHeight();
                var scrollExist = $(".dataTables_scrollBody").hasScrollBar();
                if ($.isEmptyObject(advFiltersObjectToApply) || advFiltersObjectToApply.somedummyfilterjsobjectkey) {
                    if (scrollExist)
                        $("#requestNextRecords").hide();
                    else
                        $("#requestNextRecords").show();
                }

                if (!checkNextDBRowsExist)
                    recCount = dtDbTotalRecords;
            }

            $("#lblCurPage").html('Rows: 1-' + rowsTo + ' of ' + (totRowCount == "" ? `${recCount}${ivirDataTableApi?.search() ? ` (${ivirDataTableApi.rows(":not(.specialRow)", { search: 'applied' }).count()})` : ``}` : "")); //record count > fetch size then display hyperlink button to get record count
            if(dtInitCompleted){
                setTimeout(() => {
                    hideDataTableLoading();
                }, 0);
            }
        }

        setTimeout(() => {
            $("#GridView1 thead").addClass("headSortUiFix");
        }, 0);

        setSmartViewHeight();
    }

    /**
     * Expand Collapse  Mobile Cards Logic
     * @author Prashik
     * @Date   2019-05-22T13:17:07+0530
     */
    function expandCollapseCardsLogic() {
        if (enableCardsUi) {
            $("#GridView1 tbody td:visible").addClass("visibleMobileCol");
            $("#GridView1 tbody td:hidden").addClass("hiddenMobileCol");
            $("#GridView1").off("click.expandCollapse").on("click.expandCollapse", "td:not(.isHyperlinkUI)", function (e) {
                if ($(e.target).parents(".rowOptionsExist").length > 0) {
                    return true;
                }
                $(this).parents("tr").children("td").toggleClass("forceShow");
                setSmartViewHeight();
            });
            $("#GridView1 tbody tr[role=row]").css("height", "");
        }
    }

    //if rows exists in the client side and not binded to the grid then append remaining records to the grid
    function appendNextDtRecords() {
        showDataTableLoading();
        var currRowSize = nxtScrollSize;
        nxtScrollSize += defaultRecsPerPage;
        var currScrollSize = 0;
        if (autoAppendRecords) { //all records fetch to the client side if lazy load is true
            currScrollSize = dtDbTotalRecords; //append next records(from nxtScrollSize to dtDbTotalRecords) to the grid 
            autoAppendRecords = false;
        }
        else
            currScrollSize = nxtScrollSize > dtDbTotalRecords ? dtDbTotalRecords : nxtScrollSize, checkNextDBRowsExist = true;
        ivirDataTableApi.rows.add(ivDatas.slice(currRowSize, currScrollSize)).draw(false); //append next records to the datatable & redraw it
    }

    //remaining records will append to datatable after datatable created with 100 records
    function appendRowsAfterLoad() {
        if (ivDatas.length != undefined) {
            setTimeout(function () {
                var currRowSize = nxtScrollSize;
                defaultRecsPerPage = iviewDataWSRows;
                var currScrollSize = 0;
                if (dtDbTotalRecords > iviewDataWSRows) { //if lazy load is enabled then append all records to the datatable & all pages are cached 
                    nxtScrollSize = currScrollSize = defaultRecsPerPage;
                    autoAppendRecords = true;
                }
                else {
                    nxtScrollSize += defaultRecsPerPage;
                    var specialRowCnt = getSpecialRowCount();
                    currScrollSize = nxtScrollSize > dtDbTotalRecords ? (specialRowCnt > 0 ? ivDatas.length : dtDbTotalRecords) : nxtScrollSize;
                }
                if (currRowSize < currScrollSize) {
                    ivirDataTableApi.rows.add(ivDatas.slice(currRowSize, currScrollSize)).draw(false); //append next records to the datatable & redraw it
                } else if (isPivotReport) {
                    var appendRecords = ivDatas.slice(currRowSize, dtDbTotalRecords);

                    if (appendRecords.length >= 1000) {
                        lazyBinding = true;
                        ivirDatatable.DataTable.settings[0].oInit.scroller = true;
                        $(ivirTable).trigger($.Event('preInit' + '.dt'), ivirDatatable.DataTable.settings);
                        $(ivirTable).trigger($.Event('init' + '.dt'), ivirDatatable.DataTable.settings);
                        setSmartViewHeight();
                    }

                    ivirDataTableApi.rows.add(appendRecords).draw(false);
                }
            }, 0);
        }
    }

    setSmartViewHeight();

    if (fixedColumnsObj !== "" && task != 'group' && task != 'groupApply') {
        fixedColumnsObj = new $.fn.dataTable.FixedColumns(ivirDataTableApi, {
            iLeftColumns: fixedColumnsObj.s.iLeftColumns
        });
    }

    constuctDataButton(task);



    var customButtonHtml = "";
    if (requestJSON) {

        if (task == 'group' || task == 'groupApply') {

            customButtonHtml += `
                            <ul class="dropdown-menu">
                                <li class="dropdown-item">
                                    <a disabled title="Grid View" type="button" class="disabled grdView task-button shadow animate blue"><span class="disabled ivirCButton icon-software-layout-8boxes customIcon"></span>Report</a>
                                </li>
                                <li class="dropdown-item">
                                    <a data-count="0" onclick="toggleGridView('showChartErrMsg',this)" title="Chart View." type="button" class="disabled chrtView task-button shadow animate blue"><span class="disabled ivirCButton icon-ecommerce-graph1 customIcon"></span>Chart</a>
                                </li>
                            </ul>
                            `;
        }
        else {
            customButtonHtml += `
            ${iviewButtonStyle != "modern"
                    ?
                    `<ul class="dropdown-menu">
                    <li class="dropdown-item">
                        <a title="Grid View" type="button" onclick="toggleGridView('grid')" class="grdView task-button shadow animate blue"><span class="ivirCButton icon-software-layout-8boxes customIcon"></span>Report</a>
                    </li>
                    <li class="dropdown-item">
                        <a title="Chart View" type="button" onclick="toggleGridView('chart');" class="chrtView task-button shadow animate blue"><span class="ivirCButton icon-ecommerce-graph1 customIcon"></span>Chart</a>
                    </li>
                </ul>`
                    :
                    ``
                }`;
        }
        $("#ivirCButtonsWrapper").html(`
            ${iviewButtonStyle != "modern" ? `` : ``}
            ${customButtonHtml}
        `);
    }
    else {
        if (task == 'group' || task == 'groupApply') {

            customButtonHtml += '<button disabled title="Grid View" type="button" class="disabled grdView task-button shadow animate blue"><span class="disabled ivirCButton icon-software-layout-8boxes"></span></button>';
            customButtonHtml += '<button data-count="0" onclick="toggleGridView(\'showChartErrMsg\',this)" title="Chart View." type="button" class="disabled chrtView task-button shadow animate blue"><span class="disabled ivirCButton icon-ecommerce-graph1"></span></button>';
        }
        else {
            customButtonHtml += '<button title="Grid View" type="button" onclick="toggleGridView(\'grid\')" class="grdView task-button shadow animate blue"><span class="ivirCButton icon-software-layout-8boxes"></span></button>';
            customButtonHtml += '<button title="Chart View" type="button" onclick="toggleGridView(\'chart\');" class="chrtView task-button shadow animate blue"><span class="ivirCButton icon-ecommerce-graph1"></span></button>';

        }
        customButtonHtml += '</div>';
        $("#ivirCButtonsWrapper").html(customButtonHtml);
    }

    if (ivirMainObj.chart == undefined) {
        $("#ivirCButtonsWrapper").hide();
        $("#pinnedivirCButtonsWrapper").hide();

    } else {
        $("#ivirCButtonsWrapper").show();
        $("#PinnedivirCButtonsWrapper").show();
    }

    if (!$("#iconsUl #myFiltersLi").hasClass('hidden')) {

        if ($("#accordion")) {
            $("#accordion").find(".panel-collapse.collapse").removeClass("in");
            // if (!requestJSON || iviewButtonStyle == "old") {
            //     $("#ivirCustomContainer").append($("#accordion"));
            // }
        }


    }
    var allColumns = ivirDataTableApi.columns();

    var customHtml = "", axpbtnHTML = "";
    if (custBtnIVIR.length !== 0) {
        customHtml += '<select name="IvirCustomActions" class="form-select cup" id="IvirCustomActions" data-control="select2">';
        customHtml += '<option value="">Options</option>';
        var tmpObj = {}
        for (i = 0; i < custBtnIVIR.length; i++) {
            var btnObj = custBtnIVIR[i].split('$');
            var groupName = btnObj[2];
            if (!groupName) groupName = "customActions"
            if (tmpObj[groupName] === undefined) {
                tmpObj[groupName] = [btnObj[0] + "$" + btnObj[1]];
            }
            else {
                tmpObj[groupName].push(btnObj[0] + "$" + btnObj[1]);
            }
        }


        for (var presKey in tmpObj) {

            if (presKey.toLowerCase().indexOf("axp_btn_") === 0) {
                let presentGroupBtns = tmpObj[presKey];
                let btnsLength = presentGroupBtns.length;
                if (btnsLength === 1) {
                    let keyValue = presentGroupBtns[0].split("$");
                    axpbtnHTML += `<button onclick="fireTheCustomAction('${keyValue[0]}')" class="btn cutomActionBtns btn-primary dib dropdown-toggle" type="button" data-toggle="dropdown">${keyValue[1]}</button>`;
                } else {
                    axpbtnHTML += '<div class="dropdown dib">';
                    axpbtnHTML += `<button class="btn btn-primary cutomActionBtns dropdown-toggle" type="button" data-bs-toggle="dropdown">${presKey.substr(8)} <span class="caret"></span></button>`;
                    axpbtnHTML += '<ul class="dropdown-menu">';
                    for (var j = 0; j < btnsLength; j++) {
                        let keyValue = presentGroupBtns[j].split("$");
                        axpbtnHTML += `<li class="dropdown-item"><a onclick="fireTheCustomAction('${keyValue[0]}')" href="javascript:void(0)">${keyValue[1]}</a></li>`;
                    }
                    axpbtnHTML += '</ul>';
                    axpbtnHTML += '</div>';
                }

            } else {
                if (presKey == "customActions") {
                    customHtml += '<optgroup label="Options">';
                }
                else {
                    customHtml += '<optgroup label="' + presKey + '">';
                }
                for (j = 0; j < tmpObj[presKey].length; j++) {
                    var optVal = tmpObj[presKey][j].split("$");
                    customHtml += '<option value="custBtn' + optVal[0] + '">' + optVal[1] + '</option>';
                }
            }


        }

        customHtml += '</optgroup>';
        customHtml += '</select>';
    }




    $("#customActionBtn").html(customHtml + axpbtnHTML);
    $('div.dataTables_filter input').addClass('ivirSearchFld form-control');
    createMainEventsOnGrid();
    ExecuteDatatableExport();
    setSmartViewHeight();
}

/**
 * @description Scroll To The Last clicked Drilldown after reopening iview / back button click.
 * @author Prashik
 * @date 09/11/2022
 */
function scrollToLastKnownDrilldown(){
    setTimeout(() => {
        
        try {
            var scrollHeight = $(".dataTables_scrollBody")[0].scrollHeight;

            var appUrl = top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/"));
            
            var drilldownScrollInfo = localStorage["drilldownScrollInfo-" + appUrl] || "{}";

            var loadedScroll = JSON.parse(drilldownScrollInfo)?.[iName]?.scroll || 0;
            
            let scrollParams = {};
            
            var loadedIndex = -1;
            if(!$.isEmptyObject(scrollParams = (JSON.parse(drilldownScrollInfo)[iName]?.params || {}))){
                loadedIndex = _.findIndex(ivDatas.map(oldData=>{
                const {rowno, ...newData} = oldData;
                return newData
            }), ((val)=>{delete val.rowno;return val;})(scrollParams));
            }
            
            
            if(loadedScroll > -1 && scrollHeight >= loadedScroll){
                $(".dataTables_scrollBody").scrollTop(loadedScroll);
            }
            // else if(loadedIndex > 0 && lazyBinding){
                
            // }

            if(loadedIndex > -1){
                var tr = $(ivirDatatable.api().row( loadedIndex ).node())
                if(tr.length > 0){
                    // function fnBlink() {
                    //     tr.animate({opacity: 0.1}, 1000).animate({opacity: 1}, 100)
                    // }
                    $(".loadedRecord").removeClass("loadedRecord").removeClass("tableStripedFix bg-secondary");
                    // setInterval(fnBlink, 3000);
                    tr.addClass("loadedRecord").addClass("tableStripedFix bg-secondary");

                    var updatedJSON = JSON.parse(drilldownScrollInfo);
                    
                    delete updatedJSON?.[iName];
        
                    localStorage["drilldownScrollInfo-" + appUrl] = JSON.stringify(updatedJSON);
                }
            }
        } catch (ex) {}
    }, 0);
}

/**
 * Enable Cards Layout For Mobile
 * @author Prashik
 * @Date   2019-05-22T13:21:51+0530
 * @return {[type]}                 [description]
 */
function enableMobileCards() {
    if (enableCardsUi || cardTemplatingHTML) {
        $(".ivirMainGrid thead").hide();
    }
    if (enableCardsUi) {
        $("#GridView1").css({ "width": "calc(100vw - 20px)" }).addClass('cards');
        $("#ivirMainDataTableWrapper").addClass('cardsWrapper');
    }
    if (cardTemplatingHTML) {
        $("#GridView1").css({ "border-bottom": "initial" })
    }
}

/**
 * autosplit an iview based on configuration
 * @author Prashik
 * @Date   2019-04-11T12:24:12+0530
 */
function autoSplitChecker() {
    let isAutoSplit = ``;

        if (ivConfigurations && (!isMobile || isiPad)) {
            try {
                isAutoSplit = getCaseInSensitiveJsonProperty(ivConfigurations.filter((val, ind) => {
                    var thisVal = getCaseInSensitiveJsonProperty(val, "PROPS");
                    return thisVal && thisVal.toString() && thisVal.toString().toLowerCase() == "autosplit"
                })[0], ["PROPSVAL"]).toString();
            } catch (ex) { }
        }
    if (isAutoSplit != undefined && isAutoSplit.toLowerCase() == "true")
        callParentNew(`assocateIframe(${true})`, 'function');
}

/**
 * get proper data access key name while accessing data from smartviews datatable object
 * @author Prashik
 * @Date   2019-04-11T12:25:16+0530
 * @param  {string}                 property : field name
 * @return {string}                          : samrtviews data access key
 */
function getPropertyAccess(property) {
    
    return isPerf && !property.startsWith("@") ? "@" + property.toUpperCase() : property;
}

/**
 * get proper key name while accessing data from smartviews datatable object
 * @author Abhishek
 * @Date   2019-04-12T12:25:16+0530
 * @param  {string}                 property : field name
 * @return {string}                          : samrtviews data access key
 */
function getColumnName(property) {
    return isPerf && property.startsWith("@") ? property.substr(1).toLowerCase() : property;
}

/**
 * generate checkbox column cell for smartviews
 * @author Prashik
 * @Date   2019-04-11T12:27:26+0530
 * @param  {[type]}                 options.col     [description]
 * @param  {[type]}                 options.row     [description]
 * @param  {[type]}                 options.rowData [description]
 * @return {[type]}                                 [description]
 */
function generateCellCheckbox({ td, cellData, rowData, row, col, colID, rowDataAccess }) {
    var checkboxVal = rowData[getPropertyAccess("rowno")];
    var listViewData = ``;

    let isChecked = false;

    if (typeof rowRefreshIndex != "undefined" && isChkBox == "true" && isCheckedRowRefresh) {
        isChecked = true;
        isCheckedRowRefresh = false;
    }

    let returnString = "";

    if (rowOptionsExist) {

        let rowOptionsData = rowData["axrowoptions"];

        returnString += `
            <div class="rowOptionsExist float-start form-check form-check-sm form-check-custom me-2">
                <a href="javascript:void(0);" class="btn btn-sm btn-icon btn-light-secondary btn-active-light-primary form-check-input"
            data-kt-menu-trigger="click" data-kt-menu-placement="bottom-start" data-kt-menu-flip="top-start">
                    <span class="material-icons material-icons-style material-icons-2">arrow_drop_down</span>
                </a>
                <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bolder w-200px py-3" data-kt-menu="true" data-popper-placement="bottom-start">
                    ${
                        rowOptionsData.split("~").map((opt) => {
                        let opts = opt.split(",");
                        let optName = opts[0] || "";
                        let optCaption = opts[1] || "";
                        let optType = opts[2] || "";
                        let optIcon = opts[3] || "";

                        let onClick = "";

                        onClick = generateCellOnClick(td, optType, optName, row + 1, rowData);

                        return `
							<div class="menu-item px-3">
                                <a class="menu-link px-3" href="javascript:void(0);" onclick="${onClick}">
                                    <span class="menu-icon material-icons material-icons-style material-icons-2">
                                        <span>${optIcon}</span>
                                    </span>
                                    ${optCaption}
                                </a>       
                            </div>`;
                        }).join("")
                    }
                </div>
            </div>
        `;
    }

    returnString += `<div class="form-check form-check-sm form-check-custom ms-2"><input class="form-check-input border-gray-500 ${isChkBox == "true" ? "" : "d-none"}" name="chkItem" type="checkbox" onclick="javascript:ChkHdrCheckbox();" ${isChecked ? ` checked="checked" ` : ``} value="${checkboxVal}">${listViewData}</div>`;

    return returnString;
}

function generateFieldCheckbox({ td, cellData, rowData, row, col, colID, rowDataAccess }) { 
    let isChecked = false;
    isChecked = (cellData == "T");
    
    let returnString = `<div class="form-check form-check-sm form-check-custom form-check-solid ms-3"><input class="form-check-input border-gray-500 listViewDisabledCb" name="${colID}" type="checkbox" ${isChecked ? ` checked="checked" ` : ``} value="${cellData}"></div>`;

    return returnString;
}

function generateCellOnClick(elem, optType, optName, row, rowData) {
    let onClick = "";

    try {
        rowData = typeof rowData == "undefined" ? ivDatas[parseInt(row) - 1] : rowData;
    } catch (ex) {
        rowData = [];
    }

    switch (optType.toLowerCase()) {
        case "action":
        case "script":
            onClick = `javascript:callHLaction('${optName}',${row},'${iName}','');setRefreshParent('false');`;
            break;
        case "hyperlink":
            try {
                if (ivHyperlinks && ivHyperlinks[optName]) {
                    let hyperlinkColumn = ivHyperlinks[optName]["@source"];
                    if (hyperlinkColumn) {
                        onClick = $(generateCellHyperlink({ td: elem, cellData: rowData[hyperlinkColumn], rowData, row, col: FieldName.indexOf(hyperlinkColumn), colID: hyperlinkColumn, rowDataAccess: getPropertyAccess(hyperlinkColumn) })).attr("onclick") || "";
                    }
                }
            } catch (ex) { }
            break;
    }

    return onClick;
}


/**
 * @description: Generate tstruct navigation query string for visible records
 * @author Prashik
 * @date 2019-10-01
 * @param {*} { td, cellData, rowData, row, col, colID, rowDataAccess }
 * @returns 
 */
function generateViewNavigation({ td, cellData, rowData, row, col, colID, rowDataAccess }) {
    var returnData = ``;
    var recPos = +row + 1;
    var pageType = ``;
    if (recPos == 1 && dtDbTotalRecords == 1) {
        pageType = "single";
    }
    else if (recPos == 1) {
        pageType = "first";
    }
    else if (recPos == dtDbTotalRecords && !checkNextDBRowsExist) {
        pageType = "last";
    }
    else {
        pageType = "middle";
    }

    returnData = `&recPos=${recPos}&curPage=${dtPageNo}&pageType=${pageType}`;
    return returnData;
}


function htmlEncode(value) {
    return $('<div/>').text(value).html();
}

function htmlDecode(value) {
    return $('<div/>').html(value).text();
}


/**
 * implement expand/collapse logic
 * @author Prashik
 * @Date   2019-04-11T12:28:33+0530
 * @param  {object}                 td            :html td object
 * @param  {string}                 cellData      :cellValue
 * @param  {object}                 rowData       :row data object
 * @param  {int}                 row           :row no
 * @param  {int}                 col           :column no
 * @param  {string}                 colID         :column name
 * @param  {string}                 rowDataAccess :row data access key
 * @return {string}                                       :cell data html
 */
function generateExpColTree({ td, cellData, rowData, row, col, colID, rowDataAccess }) {
    //Expand/Collapse TreeMethod
    var newCellData = $(td).html();
    if (cellHeaderConf.root_atype_index && cellHeaderConf.root_account_index && getPropertyAccess(cellHeaderConf.root_account_index)
        == rowDataAccess && rowData[getPropertyAccess(cellHeaderConf.root_atype_index)].toString().toLowerCase() == "group") {
        var prefixStr = rowData[rowDataAccess].match(/^([\s]+)/g);
        prefixStr = prefixStr != null ? prefixStr[0].replace(/ /g, "&nbsp;") : "";
        newCellData = `${prefixStr}<span class='icon-arrows-plus'>${newCellData}</span>`;
    }
    return newCellData;
}


/**
 * Apply cell data and column logic based on properties
 * @author Prashik
 * @Date   2019-04-11T12:53:27+0530
 * @param  {object}                 td            :html td object
 * @param  {string}                 cellData      :cellValue
 * @param  {object}                 rowData       :row data object
 * @param  {int}                 row           :row no
 * @param  {int}                 col           :column no
 * @param  {string}                 colID         :column name
 * @param  {string}                 rowDataAccess :row data access key
 * @return {string}                                       :cell data html
 */
function processCellData({ td, cellData, rowData, row, col, colID, rowDataAccess }) {
    cellData = typeof cellData != "undefined" && cellData != null ? cellData.toString() : ``;

    cellData.indexOf("~") > -1 && (cellData = cellData.replace(/~/g, "<br />"));

    if (cellData != "&nbsp;" && col != 0) {
        var nVal = cellData;
        if (nVal.indexOf("&nbsp;") != -1)
            nVal = nVal.replace(/&nbsp;/g, " ");
    } else if (col == 0) {
        //set correct row number even in case of pagination
        cellData = (row + 1).toString();
        rowData[getPropertyAccess("rowno")] = cellData;
    }

    let dtColumnName = dtColumns[col].name;

    if (iName == "inmemdb") {
        dtColumnName = getColumnName(dtColumnName);        
    }

    switch (ColumnType[FieldName.indexOf(dtColumnName)]) {
        case "c":
            if (trimIviewData) {
                cellData = cellData.trim();
            } else {
                cellData = cellData.replace(/ /g, "&nbsp;")
            }
            break;
        case "n":
            if (cellData != "" && cellData != "&nbsp;" && !cellData.toString().startsWith("(")) {
                if (isInValidNumber(cellData)) {
                    cellData = "0";
                } else if (cellData != "0" && isPerf) {
                    if (ivHeadRows[colID]["@dec"] && (decimalVal = parseInt(ivHeadRows[colID]["@dec"], 10)) && !isInValidNumber(decimalVal)) {
                        //get decimals string
                        var pustZero = Number(cellData.toString().replace(/,/g, "")).toFixed(decimalVal);
                        var getDecimals = "";
                        if (pustZero.indexOf(".") > -1) {
                            getDecimals = pustZero.substr(pustZero.indexOf(".") + 1) || "";
                            //preserve commas and append generated decimals
                            if (cellData.indexOf(".") > -1) {
                                cellData = cellData.substr(0, cellData.indexOf("."))
                            }
                            cellData = cellData + "." + getDecimals;
                        }
                        cellData = Number(cellData).toFixed(decimalVal);
                    }
                }
            }
            break;
        case "d":
            cellData = dateCellProcessor(cellData);
            rowData[rowDataAccess] = cellData;
            break;
    }
    if (rowData[getPropertyAccess("axrowtype")] && (rowData[getPropertyAccess("axrowtype")] == "stot" || rowData[getPropertyAccess("axrowtype")] == "subhead" || rowData[getPropertyAccess("axrowtype")] == "gtot")) {
        isSpecialRow = true;
        SetAxFontCondition($(td), "fontstyle=b");
        switch (rowData[getPropertyAccess("axrowtype")]) {
            case "stot":
                $(td).addClass("fontBlue");
                break;
            case "subhead":
                $(td).addClass("fontBlack");
                break;
            case "gtot":
                $(td).addClass("fontGreen");
                break;
        }
        if ((isChkBox == "true" || (rowOptionsExist && !false)) && col == 0) {
            cellData = "";
        }
    }
    else if (bulkDownloadEnabled) {

        if (FieldName[FieldName.indexOf(dtColumnName)] == "axp_attach") {
            //check if is grid attachment
            var gridAttachmentFieldNameRegex = /(dc[0-9]+_image+)|(axp_nga_){1}[a-zA-Z0-9]+/i;

            cellData = cellData.split(",").map((val) => {
                val = val.trim();
                var attachTransId = rowData[getPropertyAccess("transid")] || "";
                var attachFieldname = rowData[getPropertyAccess("fieldname")] || "";

                var isDbAttachment = (rowData[getPropertyAccess("isdbattach")] || "") == "true";

                var attachtype = "";
                if (gridAttachmentFieldNameRegex.test(rowData[getPropertyAccess("fieldname")] || "")) {
                    attachtype = "gridattach";
                } else if (attachTransId == "" && attachFieldname == "" && val != "") {
                    attachtype = "fullpath";
                    attachTransId = "-";
                    attachFieldname = "-";
                } else if (attachFieldname == "") {
                    attachtype = "header";
                } else {
                    attachtype = "image";
                }

                var attachFileName = attachtype == "gridattach" ? ((rowData[getPropertyAccess("recordid")] || "") + "-" + val) : (rowData[getPropertyAccess("recordid")] || "");

                if (attachtype == "fullpath") {
                    attachFileName = CheckUrlSpecialChars(CheckUrlSpecialChars(val));
                    var urlSplitted = val.split(/\\|\//g);
                    val = urlSplitted[urlSplitted.length - 1];
                }

                if (resolveAttachmentPath) {
                    try {
                        var tempCellData = SetFileToDownload(proj || "", attachTransId, attachFieldname, attachFileName, attachtype, (rowData[getPropertyAccess("recordid")] || ""), val, isDbAttachment, true);
                        if (tempCellData.length) {
                            val = tempCellData.filter((val) => val.indexOf("Error:")).join(",") || "";
                        }
                    } catch (ex) { }
                } else {

                    val = "<a class=\"downloadLink" + row + "\" href=\"javascript:SetFileToDownload('" + proj + "' || '','" + attachTransId + "','" + attachFieldname + "','" + attachFileName + "', '" + attachtype + "', '" + (rowData[getPropertyAccess("recordid")] || "") + "' || '', '" + val + "' || '', '" + isDbAttachment + "' || '');\">" + val + "</a>";
                }
                return val;
            }).join(",");
        } else if (requestJSON && FieldName[FieldName.indexOf(dtColumnName)].toLowerCase().indexOf("axpfile_") == 0) {
            cellData = cellData.split(",").map((val, ind, data) => {
                val = val.trim();

                var fieldNameShort = FieldName[FieldName.indexOf(dtColumnName)].substring(8);
                var fieldNamePrefix = FieldName[FieldName.indexOf(dtColumnName)].substring(0, 7);

                var attachFilePath = getCaseInSensitiveJsonProperty(rowData, getPropertyAccess(fieldNamePrefix + "Path_" + fieldNameShort)).toString() || "";
                
                if(attachFilePath){
                    var tempAttachFilePath = (attachFilePath.replace(/\*/g, "\\\\").split("\\").filter((val) => { return (val) }).join("\\\\") || "");
                }                

                if (tempAttachFilePath) {
                    if(attachFilePath.indexOf("\\\\") == 0){
                        attachFilePath = "\\\\\\\\" + tempAttachFilePath;
                    }

                    attachFilePath += "\\\\";
                }
                attachFileName = CheckUrlSpecialChars(CheckUrlSpecialChars(val));
                var attachtype = "axpfile";

                val = "<a class=\"downloadLink" + row + "\" href=\"javascript:SetAxpFileListviewDownload('" + attachFilePath + "', '" + attachFileName + "', '" + attachtype + "');\">" + val + "</a>";

                return val;
            }).join(",");
            var tempCellDataObj = $(cellData);
            var cellDataObj = $("<div></div>");
            tempCellDataObj.filter((indd, vall) => {
                if (indd < 2) {
                    cellDataObj.append(vall);
                } else {
                    if (cellDataObj.find(".popover").length == 0) {
                        cellDataObj.append("<a href=\"#\" class=\"badge axpFilePopOver\">+" + (tempCellDataObj.filter((inddd, valll) => { return $(valll).is("a") }).length - 1) + "<div class=\"popover\"></div></a>");
                    }
                    if ($(vall).text() == ",") {
                        vall = $("<br />");
                    }
                    cellDataObj.find("a.axpFilePopOver .popover").append(vall);
                }
            });
            cellData = cellDataObj.html();
        }
    }


    return cellData;
}

/**
 * fix date based in data and its culture
 * @author Prashik
 * @Date   2019-04-15T12:24:30+0530
 * @param  {string}                 cellData : date string to be fixed
 * @return {string}                          : fixed date
 */
function dateCellProcessor(cellData) {
    if (cellData != "" && cellData != "&nbsp;") {
        if (isPerf && cellData.indexOf("T") > -1 && cellData.indexOf("-") > -1) {
            cellData = cellData.split("T")[0];
            var splittedDate = cellData.split("-");
            cellData = splittedDate[2] + "/" + splittedDate[1] + "/" + splittedDate[0]
        } else {
            cellData = getDateBasedOnCulture(cellData);
        }
    } else {
        cellData = "";
    }
    return cellData;
}

/**
 * return string to number else return default
 * @author Prashik
 * @Date   2019-04-11T12:56:25+0530
 * @param  {string}                 str         : string input
 * @param  {string}                 returnValue : default to return if not a number
 * @return {int}                             : number or default value
 */
function tryParseNumeric(str, returnValue) {
    str = str.toString().replace(/,/g, "")
    if (str !== null && str.length > 0 && !isNaN(str)) {
        returnValue = parseFloat(str);
    }
    return returnValue;
}

/**
 * return if string is a valid number or not
 * @author Prashik
 * @Date   2019-04-11T12:58:22+0530
 * @param  {string}                 dateStr : validating number string
 * @return {bool}                        : return if valid number or not
 */
function isInValidNumber(dateStr) {
    var tmpVal = "";
    if ((tmpVal = tryParseNumeric(dateStr, "")) || tmpVal === 0) {
        return false;
    } else {
        return true;
    }
}

/**
 * generate proper date format based on selected culture
 * @author Prashik
 * @Date   2019-04-11T13:00:01+0530
 * @param  {string}                 dateStr : date string
 * @return {string}                         : formatted date string based on culture
 */
function getDateBasedOnCulture(dateStr) {
    if (dateStr != "") {
        let dateStrArr = dateStr.split(" ");
        dateStr = dateStrArr[0];
        if (dtCulture == "en-us") {
            var splittedDate = dateStr.split("/");
            if (splittedDate.length > 2) {
                if (isPerf && splittedDate[0].length == 4) {
                    dateStr = splittedDate[2] + "/" + splittedDate[0] + "/" + splittedDate[1];
                } else {
                    dateStr = splittedDate[1] + "/" + splittedDate[0] + "/" + splittedDate[2];
                }
            }
        } else {
            var splittedDate = dateStr.split("-");
            if (splittedDate.length > 2) {
                if (isPerf && splittedDate[0].length == 4) {
                    dateStr = splittedDate[2] + "/" + splittedDate[1] + "/" + splittedDate[0];
                }
            }
        }
        if (dateStrArr[1]) {
            dateStr = `${dateStr} ${dateStrArr[1]}`;
        }
    }
    return dateStr;
}


/**
 * generate hyperlink for hyperlink/action cell
 * @author Prashik
 * @Date   2019-04-11T13:01:20+0530
 * @param  {string}                 cellData      :cellValue
 * @param  {object}                 rowData       :row data object
 * @param  {int}                 row           :row no
 * @param  {int}                 col           :column no
 * @param  {string}                 colID         :column name
 * @param  {string}                 rowDataAccess :row data access key
 * @return {string}                                       :cell data html
 */
function generateCellHyperlink({ td, cellData, rowData, row, col, colID, rowDataAccess }) {
    var listViewCbCellData = $(td).find("input:checkbox")?.hasClass("listViewDisabledCb");
    var returnString = cellData;

    var hLinkData;

    let dtColumnName = dtColumns[col].name;

    if (iName == "inmemdb") {
        dtColumnName = getColumnName(dtColumnName);        
    }

    if (returnString && HideColumn[FieldName.indexOf(dtColumnName)] == "false") {
        if (!(cellData.indexOf("<") == 0 && cellData.indexOf(">") == cellData.length - 1) && !(cellData.indexOf("<") > -1 && (cellData.indexOf("</") > -1 || cellData.indexOf("/>") > -1))) {

            cellData = CheckSpecialChars(cellData);
        }

        let commonOnClick = `clickOnDemand($(this), true);`

        //hyperlink action
        if (hLinkData = ivHeadRows[colID]["@hlaction"]) {
            if (returnString.toString() != "0") {

                returnString = `<a href="javascript:void(0)" onclick="${commonOnClick}" ${className}>${(listViewCbCellData ? $(td).html() : cellData)}</a>`;
            }

        }
        //hyperlink
        else if ((hLinkData = ivHeadRows[colID]["@hlink"]) && returnString != "Grand Total" && (rowData[getPropertyAccess("axrowtype")] != "stot" || rowData[getPropertyAccess("axrowtype")] != "subhead")) {
            var className = "";
            rowData[getPropertyAccess("axrowtype")] == "subhead" ? className = " class=ivHeaderLink" : className = " class=l2";
            var hLinkPageType = hLinkData.substr(0, 1);
            hLinkData = hLinkData.substr(1);
            if (hLinkPageType == ":") {
                try {
                    hLinkData = rowData[getPropertyAccess(hLinkData)];
                } catch (ex) { }
                hLinkPageType = "";
                if (hLinkData) {
                    hLinkPageType = hLinkData.substr(0, 1);
                    hLinkData = hLinkData.substr(1);
                }
            }
            if (returnString.toString() != "0") {
                switch (hLinkPageType) {
                    case "t":
                    case "i":
                        {
                            returnString = `<a href="javascript:void(0)" onclick="${commonOnClick}" ${className}>${(listViewCbCellData ? $(td).html() : cellData)}</a>`;
                        }
                        break;
                    case "p":
                        {
                            if(hLinkData.indexOf("HP") == 0){
                                hLinkData = hLinkData.substr(2);
                                
                                returnString = `<a href="javascript:void(0)" onclick="${commonOnClick}" ${className}>${(listViewCbCellData ? $(td).html() : cellData)}</a>`;
                            }                            
                        }
                        break;
                }
            }
        } else if (iName == "response" && colID == "rname") {
            returnString = `<a onclick="${commonOnClick}" class="edit-resp" data-status="true">${listViewCbCellData ? $(td).html() : cellData}</a>`;
        }
    }
    if (returnString.startsWith("<a ")) {
        commonOnClick = `clickOnDemand($(this), true, \`${cellData}\`, \`${row}\`, \`${FieldName.indexOf(rowDataAccess)}\`);`

        $(td).addClass("isHyperlinkUI");

        returnString =  $(`<dummy>${returnString}</dummy>`).find("a:not('.customLink')").attr("onclick", commonOnClick).attr("data-data", cellData).attr("data-row", row).attr("data-col", FieldName.indexOf(rowDataAccess)).parents("dummy").html();
    }

    if (returnString == cellData && listViewCbCellData && !$(td).hasClass("isHyperlinkUI")) {   
        $(td).find("input:checkbox").prop("disabled", true);
        
        returnString = $(td).html();
    }

    return returnString;
}


function clickOnDemand(elem, open = true, cellData, row, col){
    let td = $(elem);
    typeof cellData == "undefined" && (cellData = td.data("data").toString());
    typeof row == "undefined" && (row = td.data("row"));
    typeof col == "undefined" && (col = td.data("col"));
    row = +row;
    col = +col;
    let rowData = ivDatas[row];
    let colID = getPropertyAccess(FieldName[col]);
    let rowDataAccess = getPropertyAccess(colID);

    var listViewCbCellData = $(td).find("input:checkbox")?.hasClass("listViewDisabledCb");
    var returnString = cellData;

    var hLinkData;

    let dtColumnName = dtColumns[col].name;

    if (iName == "inmemdb") {
        dtColumnName = getColumnName(dtColumnName);        
    }

    if (returnString && HideColumn[FieldName.indexOf(dtColumnName)] == "false") {
        var _params = ``;
        var _paramsObj = {};
        var _lastMapParam = ``;
        var _lastMapCol = ``;
        var _lastMapValue = ``;
        var _torecid = `&torecid=false`;


        var _urlProp = ``;
        if (ivConfigurations) {
            try {
                _urlProp = getCaseInSensitiveJsonProperty(ivConfigurations.filter((val, ind) => {
                    var thisVal = getCaseInSensitiveJsonProperty(val, "HLINK");
                    return thisVal && thisVal.toString() && thisVal.toString() == colID && getCaseInSensitiveJsonProperty(val, "PROPS").toString().toLowerCase() == "navigation"
                })[0], ["PROPSVAL"]).toString();
            } catch (ex) { }
        }
        ivHeadRows[colID]["@map"] && ivHeadRows[colID]["@map"].split(",").forEach((val, index) => {
            if (val.indexOf("=:") > -1) {
                var splitVal = val.split("=:");
                _lastMapParam = splitVal[0].indexOf(".") > -1 ? splitVal[0].split(".")[1] : splitVal[0];
                _lastMapCol = splitVal[1];
                if (isListView && _lastMapCol == "recordid") {
                    _lastMapParam = "recordid";
                }
                var existingColData = rowData[getPropertyAccess(_lastMapCol)];
                _lastMapValue = existingColData || getParamsValueArray()[_lastMapCol] || ``;
                if (_lastMapValue != "") {
                    _lastMapValue = ReverseCheckSpecialChars(_lastMapValue);
                    _lastMapValue = CheckUrlSpecialChars(_lastMapValue);
                }
                if (existingColData && ivHeadRows[_lastMapCol]["@type"] && ivHeadRows[_lastMapCol]["@type"] == "d") {
                    if (_lastMapValue != "") {
                        _lastMapValue = _lastMapValue.split(" ")[0];
                        if (_lastMapValue.split("-").length > 2)
                            var splittedDate = _lastMapValue.split("-");
                        var parsedDate = Date.parse(splittedDate);
                        if (!isNaN(parsedDate) && parsedDate > 0) {
                            _lastMapValue = splittedDate[0] + "/" + splittedDate[1] + "/" + splittedDate[2];
                        }

                    }
                }
            }
            _params += "&" + _lastMapParam + "=" + _lastMapValue;
            _paramsObj[_lastMapCol] = _lastMapValue;
        });

        
        

        _params = _params.split("#").map((val, ind) => {
            return val.endsWith("&") && ind != (_params.split("#").length - 1) ? val + "#" : (ind != _params.split("#").length - 1 ? val + "%23" : val);
        }).join("");
        _params = _params.replace(/\+/g, '%2b');
        _params = _params.replace(/%3C/g, 'l%3tC;');
        cellData = cellData.replace(/&nbsp;/g, " ");
        if (!(cellData.indexOf("<") == 0 && cellData.indexOf(">") == cellData.length - 1) && !(cellData.indexOf("<") > -1 && (cellData.indexOf("</") > -1 || cellData.indexOf("/>") > -1))) {
            
            cellData = CheckSpecialChars(cellData);
        }
        var refresh = ``;
        var isRefreshParent = `false`;
        var isRefreshParentAction = `false`;
        var listViewCbCellDataProp = ()=>{
            if(listViewCbCellData){
                $(td).find("input:checkbox").prop("checked", !$(td).find("input:checkbox").prop("checked"));
            }
        };
        if (typeof axp_refresh != "undefined" && axp_refresh && axp_refresh == "true") {
            refresh = "&axp_refresh=" + Convert.ToString(iviewObj.Axp_refresh);
        } else if (ivHeadRows[colID]["@refresh"]) {
            isRefreshParent = ivHeadRows[colID]["@refresh"].toLowerCase();
        } else if (ivHeadRows[colID]["@parentrefresh"]) {
            isRefreshParent = ivHeadRows[colID]["@parentrefresh"].toLowerCase();
        }

        //hyperlink action
        if (hLinkData = ivHeadRows[colID]["@hlaction"]) {
            if (returnString.toString() != "0") {
                try {
                    if (ivActions && ivActions[hLinkData]) {
                        isRefreshParentAction = ivActions[hLinkData].r1.param1.Refresh.toLowerCase();
                    } else if (ivScripts && ivScripts[hLinkData]) {
                        // isRefreshParentAction = ivScripts[hLinkData].r1.param1.Refresh.toLowerCase();
                    }
                } catch (ex) { }

                {
                    listViewCbCellDataProp();
                }
                returnString = "<a href='javascript:void(0);' onclick=\"javascript:callHLaction('" + ivHeadRows[colID]["@hlaction"] + "'," + parseInt(rowData[getPropertyAccess("rowno")], 10) + ",'" + iName + "','" + _urlProp + "');setRefreshParent('" + isRefreshParentAction + "');\" class=l3>" + (listViewCbCellData ? $(td).html() : cellData) + "</a>";
            }

        }
        //hyperlink
        else if ((hLinkData = ivHeadRows[colID]["@hlink"]) && returnString != "Grand Total" && (rowData[getPropertyAccess("axrowtype")] != "stot" || rowData[getPropertyAccess("axrowtype")] != "subhead")) {
            var className = "";
            rowData[getPropertyAccess("axrowtype")] == "subhead" ? className = " class=ivHeaderLink" : className = " class=l2";
            var isPopup = ivHeadRows[colID]["@pop"] ? ivHeadRows[colID]["@pop"].toLowerCase() == "true" : false;
            var _hLinkType = `&hltype=` + ivHeadRows[colID]["@hltype"];
            var hLinkPageType = hLinkData.substr(0, 1);
            hLinkData = hLinkData.substr(1);
            if (hLinkPageType == ":") {
                try {
                    hLinkData = rowData[getPropertyAccess(hLinkData)];
                } catch (ex) { }
                hLinkPageType = "";
                if (hLinkData) {
                    hLinkPageType = hLinkData.substr(0, 1);
                    hLinkData = hLinkData.substr(1);
                }
            }
            if (returnString.toString() != "0") {
                switch (hLinkPageType) {
                    case "t":
                        {
                            var baseLink = ``;
                            if (isListView) {
                                baseLink = "tstruct.aspx?transid=";
                            } else {
                                baseLink = "ivtstload.aspx?tstname=";
                            }

                            var navigationData = (ivHeadRows[colID]["@hltype"] == "load" ? generateViewNavigation({ td, cellData, rowData, row, col, colID, rowDataAccess }) : "") + `&openerIV=${iName}&isIV=${!isListView}`;
                            var fullNavigationData = baseLink + "" + hLinkData + _params + _hLinkType + _torecid + navigationData;
                            if (isPopup) {
                                {
                                    listViewCbCellDataProp();
                                }
                                if(open){
                                    callParentNew("loadFrame()", "function");
                                }
                                returnString = "<a href='javascript:void(0)' onclick='javascript:setListViewDictionary(viewNavigationData[\"" + colID + "\"], " + (row + 1) + ");SetColumnName(\"" + _lastMapCol + "\",\"" + parseInt(row, 10) + "\",\"" + true + "\");setRefreshParent(\"" + isRefreshParent + "\");LoadPopPage(\"" + fullNavigationData + "\",\"\",\"\",\"" + _urlProp + "\");' data-url=\"" + fullNavigationData + "\" class=\"handCur l2\"  >" + (listViewCbCellData ? $(td).html() : cellData) + "</a>";


                            } else {
                                {
                                    listViewCbCellDataProp();
                                }
                                if(open){
                                    callParentNew("loadFrame()", "function");
                                }
                                returnString = "<a href='javascript:void(0)' onclick='" + (ivHeadRows[colID]["@hltype"] == "load" ? ("setListViewDictionary(viewNavigationData[\"" + colID + "\"], " + (row + 1) + ");") : "") + "SetColumnName(\"" + _lastMapCol + "\",\"" + parseInt(row, 10) + "\",\"" + true + "\");LoadTstFrmIview(\"" + "./" + fullNavigationData + "\",\"" + hLinkData + "\",\"" + _urlProp + "\");' data-url=\"" + fullNavigationData + "\" " + className + " >" + (listViewCbCellData ? $(td).html() : cellData) + "</a>";


                            }

                            if(ivHeadRows[colID]["@hltype"] == "load"){
                                viewNavigationData[colID] ? "" : viewNavigationData[colID] = [];

                                let isTstNavReplaced = fullNavigationData.indexOf("tstruct.aspx?") > -1;

                                viewNavigationData[colID][row] = (fullNavigationData).replace("ivtstload.aspx?", "tstruct.aspx?") + (isTstNavReplaced ? `&openerIV=${iName/* || hLinkData*/}&isIV=${!isListView}` : ``);

                                ivDatas.forEach((data, index, originalArray) => {
                                    if(typeof viewNavigationData[colID][index] == "undefined"){
                                        let linkTd = null;
                                        try {
                                            if((linkTd = $(`#GridView1 tbody tr[role=row]:eq(${index}) [data-field-name=${colID}] [onclick^=clickOnDemand\\(\\$\\(this]:eq(0)`))?.length > 0){
                                                var dataURL = $(`<div>${clickOnDemand(linkTd, false)}</div>`).find("a[data-url]:first").data("url") || "";

                                                // if(dataURL){
                                                    viewNavigationData[colID][index] = dataURL;

                                                    let isTstNavReplaced = fullNavigationData.indexOf("tstruct.aspx?") > -1;

                                                    viewNavigationData[colID][row] = (fullNavigationData).replace("ivtstload.aspx?", "tstruct.aspx?") + (isTstNavReplaced ? `&openerIV=${iName/* || hLinkData*/}&isIV=${!isListView}` : ``);

                                                    if(ivHeadRows[colID]["@hltype"] == "load"){
                                                        viewNavigationData[colID][index] = viewNavigationData[colID][index].replace("ivtstload.aspx?", "tstruct.aspx?")(isTstNavReplaced ? `&openerIV=${iName/* || hLinkData*/}&isIV=${!isListView}` : ``);
                                                    }
                                                // }                                                
                                            }else{
                                                viewNavigationData[colID][index] = "";
                                            }
                                        } catch (ex) {
                                            viewNavigationData[colID][index] = "";
                                        }
                                    }
                                });
                            }
                        }
                        break;
                    case "i":
                        {
                            if (isPopup) {
                                {
                                    listViewCbCellDataProp();
                                }
                                if(open){
                                    callParentNew("loadFrame()", "function");
                                }
                                returnString = "<a href='javascript:void(0)' onclick='javascript:LoadPopPage(\"ivtoivload.aspx?ivname=" + hLinkData + _params + _hLinkType + "\",\"\",\"\",\"" + _urlProp + "\");' data-url=\"ivtoivload.aspx?ivname=" + hLinkData + _params + _hLinkType + "\" class=\"handCur l2\"  >" + (listViewCbCellData ? $(td).html() : cellData) + "</a>";
                            } else {
                                var _urlStr = `ivtoivload.aspx?ivname=` + hLinkData;
                                _params = _params.replace(/%26/g, "--.--");

                                {
                                    listViewCbCellDataProp();
                                }
                                if(open){
                                    callParentNew("loadFrame()", "function");
                                }
                                returnString = "<a href='javascript:void(0)' onclick=\"javascript:OpenIviewFromIv('" + _urlStr + "','" + _params + _hLinkType + "','" + hLinkData + "','" + _urlProp + "');\"" + className + ">" + (listViewCbCellData ? $(td).html() : cellData) + "</a>";
                            }
                        }
                        break;
                    case "p":
                        {
                            if(hLinkData.indexOf("HP") == 0){
                                hLinkData = hLinkData.substr(2);
                                if (isPopup) {
                                    {
                                        listViewCbCellDataProp();
                                    }
                                    returnString = "<a href='javascript:void(0)' onclick='javascript:LoadPopPage(\"htmlPages.aspx?load=" + hLinkData + _params + _hLinkType + "\",\"\",\"\",\"" + _urlProp + "\");' data-url=\"htmlPages.aspx?load=" + hLinkData + _params + _hLinkType + "\" class=\"handCur l2\"  >" + (listViewCbCellData ? $(td).html() : cellData) + "</a>";
                                } else {
                                    var _urlStr = `htmlPages.aspx?load=` + hLinkData;
                                    _params = _params.replace(/%26/g, "--.--");

                                    {
                                        listViewCbCellDataProp();
                                    }
                                    returnString = "<a href='javascript:void(0)' onclick=\"javascript:ReloadIframe('" + _urlStr + _params + _hLinkType + "');\"" + className + ">" + (listViewCbCellData ? $(td).html() : cellData) + "</a>";
                                }
                            }                            
                        }
                        break;
                }
            }
        } else if (iName == "flist" && colID == "reportname") {
            {
                listViewCbCellDataProp();
            }
            returnString = "<a href='javascript:void(0);' onclick=\"ReloadIframe('iviewBuilder.aspx?ivname=" + rowData[getPropertyAccess("name")] + "');\">" + (listViewCbCellData ? $(td).html() : cellData) + "</a>";
        } else if (iName == "response" && colID == "rname") {
            {
                listViewCbCellDataProp();
            }
            returnString = `<a href='javascript:void(0);' style="cursor:pointer" onclick="ShowDimmer(true);parent.displayBootstrapModalDialog('Edit Responsibility', 'md', '430px', true, '../aspx/AddEditResponsibility.aspx?status=true&amp;action=edit&amp;name=${cellData}', true)" class="edit-resp" data-status="true">${listViewCbCellData ? $(td).html() : cellData}</a>`;
        }
    }
    if (returnString.startsWith("<a ")) {
        $(td).addClass("isHyperlinkUI");
    }

    if (returnString == cellData && listViewCbCellData && !$(td).hasClass("isHyperlinkUI")) {   
        $(td).find("input:checkbox").prop("disabled", true);
        
        returnString = $(td).html();
    }

    
    if(open){
        try {
            var appUrl = top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/"));
            localStorage["drilldownScrollInfo-" + appUrl] = JSON.stringify({
                ...JSON.parse(localStorage["drilldownScrollInfo-" + appUrl] || "{}"),
                [iName]: {
                    scroll: Math.round($(".dataTables_scrollBody").scrollTop()),
                    rowIndex: row,
                    params: (function(){
                        if(rowData["recordid"]){
                            return {
                                recordid: rowData["recordid"]
                            };
                        }else if(!$.isEmptyObject(_paramsObj)){
                            return _paramsObj;
                        }else{
                            return rowData;
                        }
                    })()
                }//Math.round($(".dataTables_scrollBody").scrollTop())
            });
        } catch (ex) {}
        
        $(returnString).click();
    }else{
        return returnString;
    }
}

/**
 * set conditional formatting for cell
 * @author Prashik
 * @Date   2019-04-11T13:02:20+0530
 * @param  {object}                 td            :html td object
 * @param  {object}                 rowData       :row data object
 * @param  {string}                 colID         :column name
 */
function applyConditionalFormatting({ td, rowData, colID }, processCell = true) {
    var fontString = "";
    if (rowData[getPropertyAccess("axp__font")]) {
        rowData[getPropertyAccess("axp__font")].split("~").forEach((val, ind) => {
            if (val.startsWith(colID + ",")) {
                var fontSplit = val.split(",");
                fontString += fontSplit.reduce((result, item, index) => {
                    switch (index) {
                        case 1:
                            result += `fontname=${item},`
                            break;
                        case 2:
                            result += `fontsize=${item},fontstyle=`
                            break;
                        case 3:
                            result += (item == "t" ? "b" : "")
                            break;
                        case 4:
                            result += (item == "t" ? "i" : "")
                            break;
                        case 5:
                            result += (item == "t" ? "u" : "")
                            break;
                        case 6:
                            result += (item == "t" ? "s" : "")
                            break;
                        case 7:
                            result += `,fontcolor=${item}`;
                            break;
                    }
                    return result;
                }, "");

            }
        });
    }

    if (rowData[getPropertyAccess("axp__color")]) {
        rowData[getPropertyAccess("axp__color")].split("~").forEach((val, ind) => {
            if (val.startsWith(colID + ",")) {

                var backColor = "";

                var colorSplit = val.split(",");

                if ((color = colorSplit[1]) && colorSplit[1].indexOf("$") == 0 && color.length == 9) {
                    backColor = "#" + [color[7], color[8], color[5], color[6], color[3], color[4]].join("");
                } else {
                    backColor = colorSplit[1];
                }

                if (backColor) {
                    if (fontString) {
                        fontString += ","
                    }
                    fontString += `backcolor=${backColor}`;
                }
            } else if (isSpecialRow && val.startsWith("$")) {
                let item = "";
                if (val.indexOf("$") == 0 && val.length == 9) {
                    item = "#" + [val[7], val[8], val[5], val[6], val[3], val[4]].join("").toUpperCase();
                } else {
                    item = val;
                }

                if (item) {
                    fontString += `,fontcolor=${item}`;
                }
            }
        });
    }

    if (fontString && processCell) {
        var elem = $(td);
        if (elem.children().length) {
            SetAxFontCondition(elem.children(), fontString)
        }
        SetAxFontCondition(elem, fontString);
    }

    return fontString;
}

/**
 * generate prray from selected parameters
 * @author Prashik
 * @Date   2019-04-11T13:04:08+0530
 * @return {array}                 : array of selected filters with key as field name
 */
function getParamsValueArray() {
    var paramString = $("#hdnparamValues").val();
    var returnArray = [];
    typeof paramString == "string" && paramString.replace(/¿/g, '♣').split('♣').forEach((v, i) => {
        if (v) {
            var splitVal = v.split("~");

            try {
                if ($(`#${CheckSpecialCharsInStr(splitVal[0])}`).hasClass("multiFldChk") && _.isEqual(_.sortBy([...new Set(splitVal[1].toString().split("&grave;"))].filter((val) => val != "")), _.sortBy([...new Set($(`#${CheckSpecialCharsInStr(splitVal[0])}`).data("valuelist").split($(`#${CheckSpecialCharsInStr(splitVal[0])}`).data("separator")))].filter((val) => val != "")))) {
                    splitVal[1] = "ALL";
                }
            } catch (ex) { }

            returnArray[CheckSpecialCharsInStr(splitVal[0])] = CheckSpecialCharsInStr(splitVal[1].toString()).replace(/&amp;grave;/g, '~');
        }
    });
    return returnArray;
}


/**
 * set height for datatable body height properly based on content available in window
 * @author Prashik
 * @Date   2019-04-11T13:05:24+0530
 */
function setSmartViewHeight() {

    var dtScrollFootOffsetHeight = 0;
    try {
        $(".dataTables_scrollFoot").length ? dtScrollFootOffsetHeight = $(".dataTables_scrollFoot")[0].offsetHeight : "";
    } catch (ex) { }

    var tableWrapperOuterHeight = $(".iviewTableWrapper ").outerHeight(true) - $(".iviewTableWrapper ").height();  

    var subCaptionHeight = 0;
    try {
        $(".ivcaptions").length ? subCaptionHeight = $(".ivcaptions").toArray().reduce((sum, elem) => sum + $(elem).outerHeight(true), 0) : "";
    } catch (ex) { }

    var pageInformationNew = 0
    try {
        $(".pageInformationNew").length ? pageInformationNew = $(".pageInformationNew").outerHeight(true) + $(".pageInformationNew").next().outerHeight(true) : "";
    } catch (ex) { }


    var viewTabsHeight = 0;
    try {
        $("#viewTabs").length ? viewTabsHeight = $("#viewTabs").outerHeight(true) : "";
    } catch (ex) { }

    //latest logic
    var reduceHeightOfFinalDT = Math.round(($("#breadcrumb-panel").outerHeight(true) + $("#ivContainer").outerHeight(true) + $(".iviewPreTableCustom").outerHeight(true) + $(".iviewPostTableCustom").outerHeight(true) + $(".dataTables_scrollHead").outerHeight(true) + dtScrollFootOffsetHeight + subCaptionHeight + pageInformationNew + viewTabsHeight + tableWrapperOuterHeight));
    if (requestJSON && iviewButtonStyle != "old") {
    }
    else if (!$("#ivContainer").outerHeight(true))
        reduceHeightOfFinalDT -= 14;


    $('.dataTables_scrollBody').height() > reduceHeightOfFinalDT ? $('.dataTables_scrollBody').css({ "max-height": `calc(100vh - ${reduceHeightOfFinalDT}px)`, "height": `calc(100vh - ${reduceHeightOfFinalDT}px)` }) : $('.dataTables_scrollBody').css({ "height": `calc(100vh - ${reduceHeightOfFinalDT}px)`, "max-height": `calc(100vh - ${reduceHeightOfFinalDT}px)` });



    try {
        if (lazyBinding) {
            $(".dataTables_scrollBody table + div").height(($(".dataTables_scrollBody tbody").height() / $(".dataTables_scrollBody tbody tr").length) * ($(".dataTables_scrollBody tbody tr").length + (checkNextDBRowsExist ? (len = ((ivDatas.length - $(".dataTables_scrollBody tbody tr").length) / 4) > 1 ? len : 1) : 0)));
        }
    } catch (ex) { }
}


/**
 * generate and show filter popup
 * @author Prashik
 * @Date   2019-04-11T14:50:05+0530
 * @param  {int}                 pillindex : index of created filter pill
 */
function ivirMoreFilters(pillindex = -1) {
    $("#newViewTabId span.customError").remove();
    var allColumns = ivirDataTableApi.columns();
    var allColumnsLength = allColumns[0].length;
    //var headerName = $(ivirDataTableApi.columns(i).header()).text().trim();

    var moreFilters = ``;
    var prevDrawnMoreFilters = $("#newViewTabId .filter-body-cont").parent();
    if (prevDrawnMoreFilters.length == true) {
        prevDrawnMoreFilters.find(".filter-body-cont").attr("data-pillindex", pillindex).data("pillindex", pillindex);
        moreFilters = prevDrawnMoreFilters.detach();
        initAdvFilters = false;
    }
    else {
        initAdvFilters = true;
        if (allColumnsLength > 0) {
            moreFilters += `<div class="filter-bodyAndFooter-cont">` +
                `<input type="text" maxlength="20" id="advSearchName" class="form-control fldNme ${($("#newViewTabId").is(":visible") || isOpenSmartStepper) ? `d-none` : ``}" value="${($("#newViewTabId").is(":visible") || isOpenSmartStepper) ? `a` : ``}" placeholder="${callParentNew('lcm')[417]}"/>` +
                `<div class="filter-body-cont" data-pillindex="${pillindex}">` +

                `<table class="gridDataFilter table table-borderless w-100">` +

                `<tbody>`;

            allColumns.every(function (index) {
                if (hiddenColumnIndex.indexOf(index) == -1) {
                    var headerCaption = $(this.header()).text().trim();
                    var headerName = $(this.header()).attr("id").replace("GridView1_ctl01_", "");
                    if (headerName != "" && headerName != "rowno") {
                        var colType = ivirColumnTypeObj[headerName];
                        moreFilters += `<tr data-coltype="${colType}" data-field="${headerName}" data-index="${index}"><td><label class="form-label col-form-label pb-1 fw-boldest">${headerCaption}</label></td><td class="d-flex col-12">${getInnerAdvFilter(headerName, colType, index)}</td></tr>`;
                    }

                }
            });

            moreFilters += `</tbody></table>` +
                `` +
                `</div>` +
                `<div class="filter-footer-cont d-none">` +
                `<div class="">` +
                `<button id="resetMoreFilters" class="coldbtn btn handCursor allow-enter-key lastFocusable" onclick="resetMoreFilters();" title="${callParentNew('lcm')[444]}">${callParentNew('lcm')[444]}</button>` +
                `</div>` +
                `<div class="pull-right" id="filterBtn">` +
                `<input type="button" name="btnFilterApply" value="${btnFilterApplyVal}" onclick="" id="btnFilterApply" title="${btnFilterApplyVal}" class="normalbtn btn handCursor allow-enter-key"/>` +
                `<input type="button" name="btnFilter" value="${btnFilterApplyEditVal}" onclick="" id="btnFilter" title="${btnFilterApplyEditVal}" class="hotbtn btn handCursor allow-enter-key" />` +
                `</div>` +
                `</div>` +
                `</div>`
        } else {
            moreFilters += `No Columns to filter.`
        }
    }
    return moreFilters;

}

/**
 * generate single filter
 * @author Prashik
 * @Date   2019-04-11T14:52:08+0530
 * @param  {string}                 headerName : column name
 * @param  {char}                 colType    : type of column
 * @param  {int}                 index      : index of column
 * @return {string}                            : single filter html
 */
function getInnerAdvFilter(headerName, colType, index) {

    var filterStr = ``;

    switch (colType) {
        case "c":
            filterStr += `<div class="input-group px-2"><select id="${headerName.replace(/ /g, "_").toLowerCase()}Filter" class="moreFiltersInput characterFilter form-select" type="text" data-field="${headerName}" data-index="${index}" multiple="multiple"></select></div>`;
            break;
        case "n":
            filterStr += `<div class="input-group px-2"><input id="${headerName.replace(/ /g, "_").toLowerCase()}Filter1" class="moreFiltersInput numericFilter form-control" type="number" placeholder="${callParentNew('lcm')[427]}" data-field="${headerName}" data-index="${index}" /></div><div class="input-group px-2"><input id="${headerName.replace(/ /g, "_").toLowerCase()}Filter2" class="moreFiltersInput numericFilter form-control" type="number" placeholder="${callParentNew('lcm')[428]}" data-field="${headerName}" data-index="${index}" /></div>`;
            break;
        case "d":
            filterStr += `<div class="input-group px-2"><select id="${headerName.replace(/ /g, "_").toLowerCase()}Options" class="moreFiltersInput dateFilter form-select stepperSelect" type="text" data-field="${headerName}" data-index="${index}">${dateOptions.map((opt, indexx) => { return `<option value="${opt.replace(/ /g, "_").toLowerCase()}Option">${dateOptionsCaption[indexx]}</option>` }).join("")}</select></div><div class="input-group px-2"><input id="${headerName.replace(/ /g, "_").toLowerCase()}Filter1" class="moreFiltersInput dateFilter date form-control" type="text" placeholder="${callParentNew('lcm')[427]}" data-field="${headerName}" data-index="${index}" data-input/><span class="input-group-text" data-toggle><span class="material-icons material-icons-style cursor-pointer fs-4">calendar_today</span></span></div><div class="input-group px-2"><input id="${headerName.replace(/ /g, "_").toLowerCase()}Filter2" class="moreFiltersInput dateFilter date form-control" type="text" placeholder="${callParentNew('lcm')[428]}" data-field="${headerName}" data-index="${index}" data-input/><span class="input-group-text" data-toggle><span class="material-icons material-icons-style cursor-pointer fs-4">calendar_today</span></span></div>`;
            break;
        case "t":
            filterStr += `Time`;
            break;
    }
    return filterStr;
}

/**
 * filter events and tasks on popup load
 * @author Prashik
 * @Date   2019-04-11T14:54:22+0530
 */
function initMoreFiltersAddOns() {


    //if any search is created previously then prevent reseting filters for the next time when user opens a filter dialog
    var filterType = $('[data-dropdown-value="moreFilters"]').attr("data-filter-type");
    var moreFilters = $("#newViewTabId .filter-body-cont").parent();
    var pillindex = moreFilters.find(".filter-body-cont").data("pillindex");
    if (!openFilters) {
        if (filterType == "filter" || pillindex == -1 || filterType == undefined)
            resetMoreFilters();
    }


    if (($("#newViewTabId").is(":visible") || isOpenSmartStepper) && typeof ivirMainObj.filter == "undefined" && typeof pillindex != "undefined") {
        pillindex = -1;
    }

    if (initAdvFilters) {
        $(".moreFiltersInput.characterFilter").each(function () {
            var source = [...new Set(

                ivirDataTableApi.cells(ivirDataTableApi.rows(":not(.specialRow)").nodes(), parseInt($(this).data("index"), 10)).data().toArray().map(
                    function (fldVal) {
                        return $($.parseHTML(fldVal)).text()
                    }
                ))
            ];
            source.indexOf("") > -1 ? source.splice(source.indexOf(""), 1) : "";

            var processedList = $.map(source, (val, index) => {
                return {
                    id: val,
                    text: val
                }
            });

            $(this).select2({
                allowClear: true,
                data: processedList,
                dropdownParent: document.getElementById("newViewTabId"),
                placeholder: appGlobalVarsObject.lcm[441],
                tags: true,
                tokenSeparators: ['`']
            }).on('select2:select', (selectEv) => {

            });
        });

        AddDatePicker("newViewTabId");
    }

    if (pillindex != -1) {
        pushSearchStringtoFilters(ivirMainObj.filter[pillindex].data, "JSON");
        $("#advSearchName").val(ivirMainObj.filter[pillindex].n);
        $("#btnFilterApply").val(btnFilterApplyEditVal);
        $("#btnFilter").hide();
    } else if (($("#newViewTabId").is(":visible") || isOpenSmartStepper) && ivirMainObj.filter && ivirMainObj.filter.length > 0) {
        pushSearchStringtoFilters(ivirMainObj.filter[0].data, "JSON");
        $("#advSearchName").val(ivirMainObj.filter[0].n);
        $("#btnFilterApply").val(btnFilterApplyEditVal);
        $("#btnFilter").hide();
    } else {
        $("#btnFilterApply").val(btnFilterApplyVal);
        $("#btnFilter").show();
    }

    if (openFilters) {
        openFilters = false;
        pushSearchStringtoFilters($("#myFiltersPillInfo").data("filterJsonObj"), "JSON");
    }

    $("#resetMoreFilters").show();
    $("#btnFilter").show();

    if ($("#newViewTabId").is(":visible") || isOpenSmartStepper) {
        $("#resetMoreFilters").hide();
        $("#btnFilter").hide();
    }

    ivirbindEvents("filter");
}


/**
 * push filter tempelate to search
 * @author Prashik
 * @Date   2019-04-11T14:55:32+0530
 * @return {[type]}                 [description]
 */
function pushSearchStringtoInput() {
    var searchInput = $("#ivInSearchInput");
    searchInput.val(generateSearchString());
    searchInput.trigger("keyup");
}

/**
 * generate string/json for selected filters
 * @author Prashik
 * @Date   2019-04-11T15:03:36+0530
 * @param  {string}                 returnType : (string/JSON) return string/object format
 * @return {string/object}                            : return string/object for selected filters
 */
function generateSearchString(returnType = "string") {
    var searchString = ``;
    var searchJSON = {};
    $("tr[data-coltype]").each(function () {
        switch ($(this).data("coltype")) {
            case "c":
                var inputField = $(this).find(".moreFiltersInput.characterFilter:nth(0)");

                var inputFieldVal = inputField.select2('data').map(function (elem) {
                    return elem.text;
                }).join("`");

                if (inputFieldVal != "") {
                    searchString += `${inputField.data("field")}:=>${inputFieldVal}:::`;
                    searchJSON[`${inputField.data("field")}`] = inputFieldVal;
                }
                break;
            case "n":
                var minVal = 0;
                var maxVal = 0;
                var minValField = $(this).find(".moreFiltersInput.numericFilter:nth(0)");
                var maxValField = $(this).find(".moreFiltersInput.numericFilter:nth(1)");
                if (minValField.val() != "" || maxValField.val() != "") {
                    var columnVals = [];
                    try {
                        columnVals = generateUniqueColumnVals($(this).data("coltype"), currentIndex + ":name");
                        if (minValField.val() == "") {
                            minValField.val(Math.min(...columnVals) || minVal);
                        }
                        if (maxValField.val() == "") {
                            maxValField.val(Math.max(...columnVals) || maxVal);
                        }
                    } catch (ex) { }
                }
                minVal = parseFloat(minValField.val()) || minVal;
                maxVal = parseFloat(maxValField.val()) || maxVal;
                if (minVal != 0 || maxVal != 0) {
                    searchString += `${minValField.data("field")}:=><=${minVal}=><=${maxVal}=>:::`;
                    searchJSON[`${minValField.data("field")}`] = {};
                    searchJSON[`${minValField.data("field")}`][`min`] = minVal;
                    searchJSON[`${minValField.data("field")}`][`max`] = maxVal;
                }
                break;
            case "d":
                var minVal = "";
                var maxVal = "";
                var minValField = $(this).find("input.moreFiltersInput.dateFilter:nth(0)");
                var maxValField = $(this).find("input.moreFiltersInput.dateFilter:nth(1)");
                if (minValField.val() != "" || maxValField.val() != "") {
                    var columnVals = [];
                    try {
                        var currentIndex = getPropertyAccess(minValField.data("field"));
                        columnVals = generateUniqueColumnVals($(this).data("coltype"), currentIndex + ":name");
                        if (minValField.val() == "") {
                            minValField.datepicker("setDate", new Date(Math.min(...columnVals) || minVal));
                        }
                        if (maxValField.val() == "") {
                            maxValField.datepicker("setDate", new Date(Math.max(...columnVals) || maxVal));
                        }
                    } catch (ex) { }
                }

                minVal = minValField.val() || minVal;
                maxVal = maxValField.val() || maxVal;
                var selectField = $(this).find("select.moreFiltersInput.dateFilter");
                if (selectField.val() != "customOption") {
                    searchString += `${minValField.data("field")}:=>${selectField.val()}:::`;
                    searchJSON[`${minValField.data("field")}`] = selectField.val();
                }
                else if (minVal != "" || maxVal != "") {
                    searchString += `${minValField.data("field")}:=><=${minVal}=><=${maxVal}=>:::`;
                    searchJSON[`${minValField.data("field")}`] = {};
                    searchJSON[`${minValField.data("field")}`][`min`] = minVal;
                    searchJSON[`${minValField.data("field")}`][`max`] = maxVal;
                }
                break;
            case "t":
                break;
        }
    });
    searchString = searchString.endsWith(":::") ? (searchString.substr(0, searchString.length - 3)) : searchString;
    return returnType == "string" ? searchString : (returnType == "JSON" ? searchJSON : "");
}

/**
 * push pre selected search string/json to popup in edit filter
 * @author Prashik
 * @Date   2019-04-11T15:07:23+0530
 * @param  {string/object}                 objectVal : values to be assigned to filter popup
 * @param  {string}                 inputType : type of input value
 */
function pushSearchStringtoFilters(objectVal, inputType = "string") {
    var searchInput = $("#ivInSearchInput");
    var searchStringOBJ = inputType == "string" ? searchInput.val().split(":::").sort() : Object.keys(objectVal);
    $(searchStringOBJ).each(function (index, val) {
        if (inputType == "string") {
            val = val.trim();
            var baseStringSplit = val.split(":=>");
            var key = baseStringSplit[0];
            var value = baseStringSplit[1];
        } else {
            var key = val;
            var value = typeof objectVal[key] == "string" ? objectVal[key].trim() : objectVal[key];
        }
        var baseRow = $(`tr[data-field]`).filterByData('field', key);
        baseRow.each(function (index, val) {

            if ($(val).data("field") == key) {

                switch ($(val).data("coltype")) {
                    case "c":
                        var inputField = $(val).find(".moreFiltersInput.characterFilter:nth(0)");
                        value = value.split("`");
                        if (requestJSON) {
                            inputField.val(value).trigger("change");
                        } else {
                            inputField.val(value).trigger("change");
                        }
                        break;
                    case "n":
                        var minValField = $(this).find("input.moreFiltersInput.numericFilter:nth(0)");
                        var maxValField = $(this).find("input.moreFiltersInput.numericFilter:nth(1)");
                        if (typeof value == "object") {
                            minValField.val(value['min']);
                            maxValField.val(value['max']);
                        } else {
                            var startEndSplit = value.substr(2, value.length - 4).split("=><=")
                            minValField.val(startEndSplit[0]);
                            maxValField.val(startEndSplit[1]);
                        }
                        break;
                    case "d":
                        var minValField = $(this).find("input.moreFiltersInput.dateFilter:nth(0)");
                        var maxValField = $(this).find("input.moreFiltersInput.dateFilter:nth(1)");
                        var selectField = $(this).find("select.moreFiltersInput.dateFilter");
                        if (typeof value == "object") {
                            minValField.val(value['min']);
                            maxValField.val(value['max']);
                            selectField.val("customOption");
                        } else if (value.indexOf("=><=") > -1) {
                            var startEndSplit = value.substr(2, value.length - 4).split("=><=")
                            minValField.val(startEndSplit[0]);
                            maxValField.val(startEndSplit[1]);
                            selectField.val("customOption");
                        } else {
                            selectField.val(value);
                        }
                        if (selectField.val() != "customOption") {
                            selectField.trigger("change");
                        }
                        break;
                    case "t":
                        break;
                }
            }
        });
    });
}

/**
 * reset values in filter popup
 * @author Prashik
 * @Date   2019-04-11T15:13:14+0530
 */
function resetMoreFilters() {
    $("input.moreFiltersInput").val("");
    $("select.moreFiltersInput.characterFilter").each(function () { $(this).val('').trigger('change'); });
    $("select.moreFiltersInput.dateFilter option:first-child").prop("selected", true);
    $("select.moreFiltersInput.dateFilter").trigger("change");
    $("#btnFilterApply").val(btnFilterApplyVal);
    $("#btnFilter").show();
}


/**
 * From axpert the negative value will come with paranthesis like (91) instead of -91 so that value will be converted to negative and do operations like subtotal and grnad total
 * @author ManiKanta
 * @Date   2018-11-19T15:03:29+0530
 * @param  {String}                 num The num to check
 * @return {NUMERIC}                    The negative or positive number
 */
function checkFroNegativeValue(num) {
    if (num) {
        num = num.trim();
        if (num.substr(0, 1) === "(" && num.substr(-1, 1) === ")") {
            num = num.substring(1, num.length - 1);
            num = -parseInt(num);
        }
    }
    return num;
}


/**
 * Events like custom right click or context menu after grid creation will be intialized here
 * @author ManiKanta + Prashik
 * @Date   2018-11-19T15:12:36+0530
 * @return {}
 */
function createMainEventsOnGrid() {
    $(".dataTables_scrollHead thead th").off("contextmenu");
    $(".dataTables_scrollHead thead th").on("contextmenu", function (event) {

        if (event.which == 3) {
            event.preventDefault();
            var elem = $(event.target).find('.rightClickMenuIcn');
            var idx = ivirDataTableApi.column(elem.parents('th')).index();
            createRightClick(event, idx);


        }
    });
    $(".dataTables_scrollHead thead th .rightClickMenuIcn").off("click");
    $(".DTFC_LeftHeadWrapper thead th .rightClickMenuIcn").off("click");
    $(".DTFC_LeftHeadWrapper thead th .rightClickMenuIcn").on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var elem = $(this);
        var idx = ivirDataTableApi.fixedColumns().cellIndex(elem.parents('th')).column;
        createRightClick(e, idx);
    });
    $(".dataTables_scrollHead thead th .rightClickMenuIcn").on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var elem = $(this);
        var idx = ivirDataTableApi.column(elem.parents('th')).index();
        createRightClick(e, idx);
    });
    $(".dataTables_scrollHead thead th .rightClickMenuIcn").off("keydown");
    $(".dataTables_scrollHead thead th .rightClickMenuIcn").on("keydown", function (e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode == 32) {
            e.preventDefault();
            var elem = $(this);
            var e = elem.offset();
            var positionHolder = {};
            positionHolder.pageX = e.left;
            positionHolder.pageY = e.top;
            var idx = ivirDataTableApi.column(elem.parents('th')).index();
            createRightClick(positionHolder, idx);
        }
    });
    $(ivirTable).on('draw.dt', function () {
        if ($("#divModalAdvancedFilters").is(":visible")) {
            $("#btnModalClose").click();
        }
    });
}

/** will be trigerred when user select particular column to search */
$(document).on('change', '#searchSelectColumn', function (event) {
    var elem = $(this);
    var parentSearchId = ivirTable + "_filter";
    var previousSearchVal = "";
    var originalSrchInp = $(parentSearchId + " .ivirSearchFld");
    var customSrchInp = $(parentSearchId + " #customSearchInput");
    var indexSelected = elem.data('index');

    if (!customSrchInp.length > 0)
        previousSearchVal = originalSrchInp.val() || "";
    else
        previousSearchVal = customSrchInp.val() || "";

    originalSrchInp.val("");
    customSrchInp.val("");
    if (elem.val() == "all") {
        $(parentSearchId + " #customSearchInput").hide();
        $(parentSearchId + " .ivirSearchFld").show();
        if (previousSearchVal != "") {
            $(parentSearchId + " .ivirSearchFld").val(previousSearchVal);
            ivirDataTableApi
                .search('')
                .columns().search('')
                .draw();
            ivirDataTableApi.search(previousSearchVal).draw();
        }
    } else {
        $(parentSearchId + " .ivirSearchFld").hide();
        if ($(parentSearchId + " #customSearchInput").length == 0) {
            var customSearchInput = '<input type="search" value="' + previousSearchVal + '" class="form-control input-sm firstTime" id="customSearchInput" placeholder="Search...">';
            $(parentSearchId + " label").append(customSearchInput);
        } else {
            $(parentSearchId + " #customSearchInput").val(previousSearchVal).show();
        }
        if (previousSearchVal != "") {
            ivirDataTableApi
                .search('')
                .columns().search('')
                .draw();

            ivirDataTableApi
                .columns(indexSelected)
                .search(previousSearchVal)
                .draw();
        }
    }
});

/** When user pressed a button in search field */
$(document).on('keydown', '.ivirSearchFld', function (event) {
    if ($("#ivirCButtonsWrapper").is(":visible") && !$("#ivirCButtonsWrapper button.active").hasClass('grdView')) {
        toggleGridView("grid");
    }
});


$(document).on('keyup', '#customSearchInput', function (event) {

    var searchValue = this.value;
    var indexOfColumnSelected = $("#searchSelectColumn").data('index');
    ivirDataTableApi
        .columns(indexOfColumnSelected)
        .search(searchValue)
        .draw();

});

/**
 * To get the all the numeric columns in the table will be pushed into numericColumns array
 * @author ManiKanta + Prashik
 * @Date   2018-11-19T15:21:46+0530
 * @return {}                 
 */
function getAllNumericColumns() {
    numericColumns = [];
    $(ivirTable + " thead tr:last th").each(function (index, el) {
        headerCaption = $(this).text().trim();
        headerName = $(this).attr("id").replace("GridView1_ctl01_", "");
        if (ivirColumnTypeObj[headerName] == 'n')
            numericColumns.push(index);
    });
}


/**
 * Function to freeze upto a certain column based on the index sent
 * @author ManiKanta
 * @Date   2018-11-19T15:22:33+0530
 * @param  {Number}                 index The index of the column upto which freeze should happen
 * @return {}                       
 */
function freezeColumn(index) {

    index = index + 1;//since for freeze index starts from 1 not 0
    if (fixedColumnsObj && index == fixedColumnsObj.s.iLeftColumns) {
        fixedColumnsObj = "";
        if (allGrandTotal && allGrandTotal.length > 0) {
            createIvirDataTable('clear', '', '', allGrandTotal);
        } else {
            createIvirDataTable('clear');
        }

        return false;
    }
    $(".rightClickMenu li.freeze i").not('#rightClickMenu' + (index - 1) + ' li i').removeClass('icon icon-arrows-check');

    if (fixedColumnsObj != "") {
        fixedColumnsObj.s.iLeftColumns = index;
        fixedColumnsObj.fnRedrawLayout();
    } else {
        fixedColumnsObj = new $.fn.dataTable.FixedColumns(ivirDataTableApi, {
            iLeftColumns: index
        });
    }

    $(".DTFC_LeftBodyWrapper .ivirCustomHighlight,.DTFC_LeftBodyWrapper .ivirCustomHighlightCell").removeClass("ivirCustomHighlight").css({
        "background-color": "",
        "color": ""
    });

    $(".DTFC_LeftHeadWrapper thead th .rightClickMenuIcn").off("click");
    $(".DTFC_LeftHeadWrapper thead th .rightClickMenuIcn").on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var elem = $(this)
        var idx = ivirDataTableApi.fixedColumns().cellIndex(elem.parents('th')).column;
        createRightClick(e, idx)
    });
    $(".DTFC_LeftHeadWrapper thead th").off("contextmenu");
    $(".DTFC_LeftHeadWrapper thead th").on("contextmenu", function (event) {

        if (event.which == 3) {
            event.preventDefault();
            $(event.target).find('.rightClickMenuIcn').click();
        }
    });

}


/** When freeze happens an extra layer will come on the top of the grid when a check box is checked on that layer,
    Then it need to be reflected in the bottom layer also
 */
$(document).on('change', ".DTFC_LeftWrapper table tr input[name='chkItem']", function (event) {
    var elem = $(this);
    var trIndex = elem.parents('tr').index();
    var isChecked = elem.is(':checked');
    var classToAdd = "";
    if (isChecked) {
        $('.dataTables_scrollBody table tbody tr').eq(trIndex).addClass('axSelected').find("input[name='chkItem']").prop('checked', true);
    } else {
        $('.dataTables_scrollBody table tbody tr').eq(trIndex).removeClass('axSelected').find("input[name='chkItem']").prop('checked', false);
    }
});

/**
 * For doing column sorting
 * @author ManiKanta
 * @Date   2018-11-19T15:27:12+0530
 * @param  {String}                 dir   Direction of the sort asc/desc
 * @param  {Number}                 index The index of the column to sort
 * @return {}                       
 */
function colAscDsc(dir, index) {
    ivirDatatable.fnSort([index, dir]);
    if (dir == "asc")
        $('#rightClickMenu' + index + ' li.desc i').removeClass('icon-arrows-check');
    else
        $('#rightClickMenu' + index + ' li.asc i').removeClass('icon-arrows-check');
}

/**
 * To apply/remove the grand total for a column
 * @author ManiKanta
 * @Date   2018-11-19T15:28:00+0530
 * @param  {Number}                 indexOfCol The index of the column to toggle on
 * @return {}                            
 */
function toggleGrandTotal(indexOfCol) {
    if ($('#rightClickMenu' + indexOfCol + ' li.columnGrndTotal i').hasClass('icon-arrows-check')) {
        var idx = allGrandTotal.indexOf(indexOfCol);
        allGrandTotal.splice(idx, 1);
    } else {
        if ($.inArray(indexOfCol, allGrandTotal) === -1)
            allGrandTotal.push(indexOfCol);
    }
    if (groupingCol === "")
        createIvirDataTable('clear', '', '', allGrandTotal);
    else {
        var groupArrayIndex = $("[id^='grouppillCB']:checked").data("index");
        createIvirDataTable('groupApply', groupArrayIndex, '', allGrandTotal);
    }
}


/**
 * To create custom right click HTML (Context menu on the header of the IVIR grid)
 * @author ManiKanta + Abhishek
 * @Date   2018-11-19T15:28:39+0530
 * @param  {Object}                 e          Complete right click event
 * @param  {Number}                 indexOfCol The index of the column to position this menu
 * @return {}                            
 */
function createRightClick(e, indexOfCol) {
    if (typeof indexOfCol == "undefined" || indexOfCol == "0") {
        return false;
    }
    var menu = $("#rightClickMenu" + indexOfCol);
    if (menu.length == 0) {
        var rtClkHtml = '<div class="menu rightClickMenu" id="rightClickMenu' + indexOfCol + '">';
        rtClkHtml += '<ul class="dropdown-menu">';
        if (indexOfCol != (ivirDataTableApi.columns()[0].length) - 1)
            rtClkHtml += '<li class="dropdown-item freeze" onclick="freezeColumn(' + indexOfCol + ')">Freeze Column<span class="material-icons">check_box_outline_blank</span></li>';
        rtClkHtml += '<li class="dropdown-item asc" onclick="colAscDsc(\'asc\',' + indexOfCol + ')">Ascending<span class="material-icons">check_box_outline_blank</span></li>';
        rtClkHtml += '<li class="dropdown-item desc" onclick="colAscDsc(\'desc\',' + indexOfCol + ')">Descending<span class="material-icons">check_box_outline_blank</span></li>';
        var colCaption = $(ivirDataTableApi.columns(indexOfCol).header()).text().trim();
        var headerName = $(ivirDataTableApi.columns(indexOfCol).header()).attr("id").replace("GridView1_ctl01_", "")
        if (ivirColumnTypeObj[headerName] == 'n') {
            var grandTotalExist = $.grep(ivDatas, function (v) {
                return v.axrowtype == 'gtot' || v.axrowtype == 'stot';
            }).length == 0 ? false : true;

            if (!grandTotalExist)
                rtClkHtml += '<li class="columnGrndTotal" onclick="toggleGrandTotal(' + indexOfCol + ')">' + (checkNextDBRowsExist ? 'Running' : 'Grand') + ' Total<i class="fa  ckbox" aria-hidden="true"></i></li>';
        }

        rtClkHtml += '</ul>';
        rtClkHtml += '</div>';
        $('body').append(rtClkHtml);
        menu = $("#rightClickMenu" + indexOfCol);
    }
    if (menu.is(":visible") && menu.data('index') == indexOfCol) {
        menu.hide();
        return;
    }
    if (groupingCol != "") {
        menu.find('li.freeze').addClass('d-none');
    }
    var order = getTheOrderOfCol(indexOfCol);
    if (order != "empty") {
        menu.find('li.asc i,li.desc i').removeClass('icon-arrows-check')
        if (order == "asc")
            menu.find('li.asc i').addClass('icon-arrows-check');
        else
            menu.find('li.desc i').addClass('icon-arrows-check');
    }

    if ($.inArray(indexOfCol, allGrandTotal) !== -1) {
        menu.find('li.columnGrndTotal i').addClass('icon-arrows-check')
    } else {
        menu.find('li.columnGrndTotal i').removeClass('icon-arrows-check')
    }
    //hide menu if already shown
    $('.rightClickMenu').hide();
    menu.data('index', indexOfCol);

    //get x and y values of the click event
    var pageX = e.pageX;
    var pageY = e.pageY;

    //position menu div near mouse cliked area
    menu.css({
        top: pageY,
        left: pageX
    });

    var mwidth = menu.width();
    var mheight = menu.height();
    var screenWidth = $(window).width();
    var screenHeight = $(window).height();

    //if window is scrolled
    var scrTop = Math.round($(window).scrollTop());

    //if the menu is close to right edge of the window
    if (pageX + mwidth > screenWidth) {
        menu.css({
            left: pageX - mwidth
        });
    }

    //if the menu is close to bottom edge of the window
    if (pageY + mheight > screenHeight + scrTop) {
        menu.css({
            top: pageY - mheight
        });
    }

    //finally show the menu
    menu.show();
    $(document).unbind('keydown.upDownEvents');
    highlightAndBindUpDown(menu, indexOfCol, ".rightClickMenu ul li");

}

/**
 * keyboars events on custom context menu
 * @author ManiKanta
 * @Date   2018-11-19T15:32:30+0530
 * @param  {}                 presElem      
 * @param  {}                 indexOfCol    
 * @param  {}                 bindedElement 
 * @return {}                               
 */
function highlightAndBindUpDown(presElem, indexOfCol, bindedElement) {

    var allOptions = presElem.find("ul li").not(".subHeader");
    var optionToSelect = allOptions;
    optionToSelect.siblings().removeClass("highlightOption");
    if (bindedElement === ".js-dropdown ul li") {


        var selectFirstField = true;


        var btnTxt = presElem.find('.js-dropdown__input').val().toLowerCase();
        optionToSelect.each(function (index, liElement) {
            var dropdownValue = $(liElement).data("dropdown-value");
            dropdownValue = dropdownValue.toLowerCase();
            if (btnTxt === dropdownValue) {
                $(this).addClass("highlightOption");
                optionToSelect = $(this);
                selectFirstField = false;
                return false;
            }
        });

        if (selectFirstField) {
            optionToSelect.first().addClass("highlightOption");
            optionToSelect = optionToSelect.first();
        }
        allOptions.off('mouseover.drpListHover');
        allOptions.on('mouseover.drpListHover', function () {
            $(".highlightOption").removeClass('highlightOption');
            optionToSelect = $(this);
            $(this).addClass("highlightOption");
        });
    } else {
        optionToSelect.first().addClass("highlightOption");
        optionToSelect = optionToSelect.first();
    }

    $(document).unbind('keydown.upDownEvents');
    $(document).bind('keydown.upDownEvents', bindedElement, function (e) {
        switch (e.which) {

            case 38: // up
                if (!optionToSelect.is(":first-child") && !(optionToSelect.index() === 1 && optionToSelect.prev('.subHeader').length === 1)) {
                    e.preventDefault();
                    if (optionToSelect.hasClass("highlightOption")) {
                        optionToSelect.removeClass("highlightOption");
                        optionToSelect = optionToSelect.prevAll().not('.subHeader').first();
                        optionToSelect.addClass("highlightOption");
                    }
                }

                break;

            case 13:
            case 32:

                if (optionToSelect.hasClass("highlightOption")) {

                    if (optionToSelect.hasClass("desc")) {
                        colAscDsc('desc', indexOfCol);
                    } else if (optionToSelect.hasClass("asc")) {
                        colAscDsc('asc', indexOfCol);
                    } else if (optionToSelect.hasClass("freeze")) {
                        freezeColumn(indexOfCol);
                    } else if (optionToSelect.hasClass("columnGrndTotal")) {
                        toggleGrandTotal(indexOfCol);
                    } else if (optionToSelect.hasClass("dropDownButton__item")) {

                        var $item = optionToSelect;
                        var $dropdown = $item.parents('.js-dropdown');
                        $dropdown.find('.js-dropdown__input').data('index', $item.data('index')).val($item.data('dropdown-value')).change();
                        if (!$dropdown.hasClass("ivirActionDrpDwn"))
                            $dropdown.find('.js-dropdown__current').attr('title', 'Search ' + $item.text()).text($item.text());
                        else
                            $dropdown.find('.js-dropdown__current').text("Options");

                        $dropdown.removeClass('is-open');
                        $(document).unbind('keydown.upDownEvents');
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }//end of if
                break;

            case 40: // down
                if (!optionToSelect.is(":last-child")) {
                    e.preventDefault();
                    if (optionToSelect.hasClass("highlightOption")) {
                        optionToSelect.removeClass("highlightOption");
                        optionToSelect = optionToSelect.nextAll().not('.subHeader').first();
                        optionToSelect.addClass("highlightOption");
                    }
                }

                break;
            case 9:

                if (optionToSelect.parents('.js-dropdown').hasClass('is-open')) {
                    optionToSelect.parents('.js-dropdown').removeClass('is-open')
                    $(document).unbind('keydown.upDownEvents');
                }
                break;

            default:
                return; // exit this handler for other keys
        }


    });

}

/**
 * To get the sorting order of the column based on index
 * @author ManiKanta
 * @Date   2018-11-19T15:39:17+0530
 * @param  {Number}                 colIndex Column index
 * @return {String}                          asc/desc/ empty(No order)
 */
function getTheOrderOfCol(colIndex) {
    var orderArray = ivirDataTableApi.order();
    var ordArrayLngth = orderArray.length;
    var order = "empty";
    if (ordArrayLngth > 0) {
        for (var i = 0; i < ordArrayLngth; i++) {
            var presntOrder = orderArray[i];
            if (presntOrder[0] == colIndex) {
                order = presntOrder[1]
                return order;
            }
        }
    }
    return order;
}


$(document).on('click', '.rightClickMenu ul li', function () {
    var elem = $(this);
    var val = elem.data('value');
    if (val == "freeze") {

    }
    if (elem.hasClass('icon-arrows-check'))
        elem.data('isChecked', true);
    else
        elem.data('isChecked', false);
    elem.find('i').toggleClass('icon-arrows-check');
});

/**
 * Function to call to add any onload check when an ivir is called
 * @author ManiKanta
 * @Date   2018-11-19T15:41:23+0530
 * @return {}                 
 */
function ivirInitailCheck() {
    //checking for hyperlink
    ivirDataTableApi.row(0).every(function (rowIdx, tableLoop, rowLoop) {
        var data = this.data();
        for (var i = 0; i < data.length; i++) {
            var patt = /<a[^>]*>([\s\S]*?)/g;
            var res = patt.test(typeof data[i] == "object" && data[i] != null ? data[i].display : (data[i] != null ? data[i] : ""));
            if (res)
                initialChkup.isAnchor = i;
        }
    });
}

/**
 * Events to be binded when highlight popup opens from actions
 * @author ManiKanta
 * @Date   2018-11-19T15:46:44+0530
 * @return {}                 
 */
function highlightBindEvents() {
    $(document).on("focusout", "#ivirbgColorValue", function () {
        var colorValue = $(this).val();
        var tinyColorValue = tinycolor(colorValue);
        if (tinyColorValue.isValid()) {
            $("#ivirbgColor").spectrum("set", tinyColorValue);
        }
    });

    $(document).on("focusout", "#ivirtxtColorValue", function () {
        var colorValue = $(this).val();
        var tinyColorValue = tinycolor(colorValue);
        if (tinyColorValue.isValid()) {
            $("#ivirtxtColor").spectrum("set", tinyColorValue);
        }
    })
}

/**
 * To unbind events of highligh when popup is closed
 * @author ManiKanta
 * @Date   2018-11-19T15:47:11+0530
 * @return {}                 
 */
function highlightUnBindEvents() {
    $(document).off("focusout", "#ivirbgColorValue");
    $(document).off("focusout", "#ivirtxtColorValue");
}

/**
 * Main Funtion to create a dialog when ever user select an action
 * This will have the close open every event of popup
 * @author ManiKanta + Prashik
 * @Date   2018-11-19T15:47:36+0530
 * @param  {String}                 titleName        The title to show on the top of the popup i.e., Add View/Edit View
 * @param  {String}                 task             The popup to show will be descided based on the task name
 * @param  {String}                 okFunction       Name of the function to execute when user clicked on Apply
 * @param  {Array}                  showValuesOnOpen will have the values of [type,index] of the colum if user click on edit of the condtion
 * @param  {Boolean}                isEditPill       IS called from edit of the condtion or new (true => edit,false=>new)
 * function ivirActionDialog is been modified to smartStepper
 * saveViewActionRef => to save the task
 * cancelViewActionRef => cancel/close smartStepper
 */

saveViewActionRef = (titleName, task, okFunction, showValuesOnOpen, isEditPill) => {
    if (task == "group" || task == 'highlight') {
        var ind = showValuesOnOpen == undefined ? undefined : showValuesOnOpen[1];
        if (!ivirDuplicateCheck(task, isEditPill, ind)) {
            return false;
        }
    }
    if (task == 'chart') {
        var ind = showValuesOnOpen == undefined ? undefined : showValuesOnOpen[1];
        if (ivirMainObj && ivirMainObj.key != "charts" && !ivirChartNewDuplicateCheck(task, isEditPill, ind)) {
            return false;
        }
    }
    if (task == "highlight") {
        if (!validateFields(task)) {
            return false;
        }
    }
    if (showValuesOnOpen) {
        var presentAction = showValuesOnOpen[0];
        var indexOfPill = showValuesOnOpen[1];
        if (presentAction == 'highlight' || presentAction == 'group' || presentAction == 'chart') {
            var pillAlreadyChecked = $("input#" + presentAction + "pillCB" + indexOfPill).is(":checked");

            if (!okFunction(indexOfPill, pillAlreadyChecked)) {
                if (presentAction == "chart") {
                    try {
                        callParentNew("Charts", "id").dispatchEvent(new CustomEvent("close"));
                    } catch (error) {}                    
                } else {
                    return false;
                }
            }

            if (task == "chart") {
                $("[data-dropdown-value=save]:eq(0)").click();
            }
        }
        else {
            okFunction();
        }
    } else {
        if (task == "group" || task == 'chart' || task == 'column' || task == 'download') {
            if (okFunction()) {
                return false;
            }

            if (task == "chart") {
                $("[data-dropdown-value=save]:eq(0)").click();
            }
        } else if (task == 'view') {
            if ($("#viewCaption").val() == "") {
                ivirCustomErrMsg($("#viewCaption"), errorMessages.emptyField);
                return false;
            }
            else if (($("#viewName").val().toLowerCase() == "main" && !isListView) || (requestJSON && $("#viewName").val().toLowerCase() == "charts")) {
                ivirCustomErrMsg($("#viewName"), callParentNew('lcm')[483]);
                return false;
            }
            else {
                if (validateViewName()) {
                    if (titleName != "Edit View" && !checkDuplicateViewName()) {
                        return false;
                    }
                    else if (
                        toolbarPinArr.length > 0 ||
                        ($("#viewName").val().toLowerCase() == "main" && isListView) || //force save/clear of main view design
                        (ivirMainObj.params || $("#hdnparamValues").val().replace(/&grave;/g, "`")) ||
                        ivirMainObj.chart ||
                        ivirMainObj.filter ||
                        ivirMainObj.sorting ||
                        ivirMainObj.group ||
                        ivirMainObj.visibleColumns ||
                        ivirMainObj.hiddenColumns ||
                        ivirMainObj.highlight ||
                        ivirMainObj.design
                    ) {
                        window[okFunction]($("#viewName").val(), $("#viewCaption").val(), $('#viewAplyTo option:selected').val(), $("#asDefaultView").prop("checked"));
                    } else {
                        showAlertDialog("warning", 3011, "client", appGlobalVarsObject.lcm[335] + " " + "\"" + ($("#viewCaption").val() || "") + "\" " + appGlobalVarsObject.lcm[301].toLowerCase() + " ");
                        return false;
                    }
                }
                else {
                    return false;
                }
            }
        }
        else {
            okFunction();
        }
    }

    setSmartViewHeight();
}

cancelViewActionRef = (titleName) => {
    if (titleName == "Edit View" && !_.isEmpty(ivirMainObj) && !_.isEmpty(bkpIvirMainObj)) {
        ivirMainObj = _.cloneDeep(bkpIvirMainObj);
    }
}

onContentReadyRef = (task, showValuesOnOpen, isEditPill) => {
    disableBackDrop('bind');
    if (!isEditPill)
        checkForPillsLength(task);
    highlightTheFirstFld();
    ivirbindEvents(task);
    if (task == 'group') {
        if ($("#newViewTabId").is(":visible") || isOpenSmartStepper) {
            if (ivirMainObj.group && ivirMainObj.group.length > 0) {
                showValuesOnOpen = [task, 0];
            } else {
                showValuesOnOpen = undefined;
            }
        }
    }
    if (task == 'column') {
        requestTstructFieldsObj();
        if (!isListView) {
            if ($("#ivirshowHideColumnWrapper .ivirLabelWrapper input:checkbox:not(:checked)").length > 0)
                $("#showAllColumns").prop('checked', false);

            else
                $("#showAllColumns").prop('checked', true);
        } else {
            $(".lstColSelWrapper").each((ind, elm) => {
                if ($(elm).find(".ivirLabelWrapper input:checkbox:not(:checked)").length > 0)
                    $(elm).find("input.showAllColumns[data-isgrid]").prop('checked', false);

                else
                    $(elm).find("input.showAllColumns[data-isgrid]").prop('checked', true);
            });
        }
    }
    else if (task == "design") {
        var iframe = document.createElement('iframe');

        $(iframe).attr("id", "columnDesigner");
        $(iframe).addClass("col-xs-12 col-sm-12 col-md-12 col-lg-12 h-250px");
        $(iframe).css("padding", "0px");
        $(iframe).attr("frameborder", "0");
        $(iframe).attr("allowtransparency", "True");
        $("#ivirDesignColumnWrapper")[0].appendChild(iframe);

        let iframeWindow = iframe.contentWindow;

        $(iframeWindow.document.getElementsByTagName("body")).attr("oncontextmenu", "return false;").addClass("topSplitDivision").append("<div id='GridView2Wrapper' />");

        iframeWindow.dwbiName = iName;
        loadAndCall({
            files: {
                css: [
                    "/Css/thirdparty/bootstrap/3.3.6/bootstrap.min.css",
                    "/ThirdParty/DataTables-1.10.13/media/css/jquery.dataTables.min.css",
                    "/ThirdParty/DataTables-1.10.13/extensions/Responsive/css/responsive.bootstrap.min.css",
                    "/ThirdParty/DataTables-1.10.13/extensions/FixedHeader/css/fixedHeader.dataTables.min.css",
                    "/Css/listViewDesigner.min.css?v=1",
                ],
                js: [
                    "/Js/thirdparty/jquery/3.1.1/jquery.min.js",
                    "/Js/noConflict.min.js",
                    "/ThirdParty/lodash.min.js",
                    "/Js/common.min.js?v=118",
                    "/ThirdParty/DataTables-1.10.13/media/js/jquery.dataTables.min.js",
                    "/ThirdParty/DataTables-1.10.13/media/js/dataTables.bootstrap.min.js",
                    "/ThirdParty/DataTables-1.10.13/extensions/FixedHeader/js/dataTables.fixedHeader.min.js",
                    "/ThirdParty/DataTables-1.10.13/extensions/ColReorderWithResize/ColReorderWithResize.min.js?v=1",
                    "/ThirdParty/DataTables-1.10.13/extensions/Extras/moment.min.js",
                    "/ThirdParty/DataTables-1.10.13/extensions/Extras/datetime-moment.js",
                    "/Js/iviewColumnBuilder.min.js?v=14"
                ]
            },
            callBack() {
                iframeWindow.axDevIvDrawTable(FieldName.map((fld, ind) => {
                    return {
                        f_name: FieldName[ind],
                        f_caption: HeaderText[ind],
                        column_width: ivirMainObj?.design?.filter(dsign => dsign.name == FieldName[ind])?.[0]?.width || ivHeadRows[FieldName[ind]]?.["@width"] || minCellWidth.toString(),
                        hidden: HideColumn[ind],
                        isquerycol: false
                    };
                }).filter(fld => fld.f_name != "rowno") || [], iName);
            },
            win: iframeWindow
        });

    }
    else if (task == 'sort') {
        $("#ivirSortColumnWrapper .ivirLabelWrapper:first").addClass('labelSelected');
        if (($("#newViewTabId").is(":visible") || isOpenSmartStepper) && ivirMainObj.sorting && ivirMainObj.sorting.length > 0) {
            $("#ivirSortColumnWrapper .checkbox input[type='checkbox']").each(function (index, el) {
                $(this).prop("checked", false);
                $(this).parent().find('button span').removeClass("active");

                var index = $(this).data('index');
                var fieldName = FieldName[index];

                var thisObj = ivirMainObj.sorting.filter(sort => sort[0] == fieldName);

                if (thisObj && thisObj.length == 1 && thisObj[0].length == 2) {
                    $(this).prop("checked", true);
                    $(this).parent().find('button span[data-order=' + thisObj[0][1] + ']').addClass("active");
                }

            });
        }
    } else if (task == 'highlight') {
        $(document).find("#ivirtxtColor").spectrum({
            color: "#000000",
            clickoutFiresChange: false,
            beforeShow: function (color) {
                $("#ivirbgColor").spectrum("set", $("#ivirbgColorValue").val());
            },
            change: function (color) {
                $("#ivirtxtColorValue").val(color.toHexString());
            }
        });
        $(document).find("#ivirbgColor").spectrum({
            color: "#000000",
            clickoutFiresChange: false,
            beforeShow: function (color) {
                $("#ivirtxtColor").spectrum("set", $("#ivirtxtColorValue").val());
            },
            change: function (color) {
                $("#ivirbgColorValue").val(color.toHexString());
            }
        });
        $("#ivirbgColor, #ivirtxtColor").parent().find(".sp-replacer").addClass("input-group-text");
        highlightBindEvents();
    } else if (task == 'chart') {
        $('#ivirChartName').focus();
    }
    else if (task == 'view') {
        var username = eval(callParent("mainUserName"));
        $('#viewAplyTo').val(username);
        if (!hasBuildAccess) {
            $('#viewAplyTo').prop("disabled", true);
        }
        $('#viewCaption').focus();
    }
    if (showValuesOnOpen) {
        var ivirMainTypeObj = ivirMainObj[showValuesOnOpen[0]][showValuesOnOpen[1]];
        if (showValuesOnOpen[0] == 'highlight') {
            var name = ivirMainTypeObj.n;
            var highlightType = ivirMainTypeObj.t;
            var bgColor = ivirMainTypeObj.bc;
            var txtColor = ivirMainTypeObj.tc;
            var column = ivirMainTypeObj.cl;
            var condition = ivirMainTypeObj.cn;
            var value = ivirMainTypeObj.v;

            $("#ivirHltName").val(name);
            $("#ivirHighlightType").val(highlightType);
            $("#ivirbgColorValue").val(bgColor);
            $("#ivirtxtColorValue").val(txtColor);
            $("#ivirHighlightCol option[data-index=" + column + "]").prop('selected', true).change();
            $("#ivirHighlightCndtn").val(condition);
            $("#ivirHltValue").val(value);
            $(document).find("#ivirtxtColor").spectrum({
                color: txtColor,
                clickoutFiresChange: false,
                change: function (color) {
                    $("#ivirtxtColorValue").val(color.toHexString());
                }
            });
            $(document).find("#ivirbgColor").spectrum({
                color: bgColor,
                clickoutFiresChange: false,
                change: function (color) {
                    $("#ivirbgColorValue").val(color.toHexString());
                }
            });
            $("#ivirbgColor, #ivirtxtColor").parent().find(".sp-replacer").addClass("input-group-text");
        } else if (showValuesOnOpen[0] == 'group') {
            var name = ivirMainTypeObj.n;
            var column = ivirMainTypeObj.cl;
            var totalArray = ivirMainTypeObj.t;
            var grndTotalArray = ivirMainTypeObj.g;
            var totalCndtns = 1;
            $("#grpName").val(name);
            $("#grpColName option[data-index=" + column + "]").prop('selected', true).change();
            if (totalArray) {
                for (var i = 1; i < totalArray.length; i = i + 3) {
                    var columnIndex = totalArray[i];
                    var functionType = totalArray[i - 1];
                    if (i !== 1)
                        $("#ivirTotalCndtn" + (totalCndtns - 1) + " .ivirTotalCndtnBtn").click(); //sice plus will be always last row
                    $("#ivirTotalCndtn" + totalCndtns + " .totalAggrFunction option[value='" + functionType + "']").prop('selected', true).change();
                    $("#ivirTotalCndtn" + totalCndtns + " .totalSource option[data-index='" + columnIndex + "']").prop('selected', true).change();
                    if (grndTotalArray[totalCndtns - 1] != "-1")
                        $("#ivirTotalCndtn" + totalCndtns + " .grndTtlCB input").prop('checked', true);
                    totalCndtns++;

                }
            }
        } else if (showValuesOnOpen[0] == 'chart') {
            var name = ivirMainTypeObj.n;
            var column = ivirMainTypeObj.cl;
            var value = ivirMainTypeObj.v;
            var chartType = ivirMainTypeObj.t;
            $("#ivirChartName").val(name).prop("disabled", true);
            $("#ivirChartCol option[data-index=" + FieldName.indexOf(column) + "]").prop('selected', true).change();
            $("#ivirChartVal option[data-index=" + FieldName.indexOf(value) + "]").prop('selected', true).change();
            $("#ivirChartsRow .ivirChartButton").removeClass('active');
            $("#ivirChartsRow").find("[data-type='" + chartType + "']").addClass('active');
        }
    }
}

onCloseRef = (task) => {
    // before the modal is hidden.
    $("#IvirActions").val("");
    ivirRemovebindEvents(task);
    highlightUnBindEvents();
    if (task == 'group') {
        tmpGroupObj = {};
    } else if (task == 'column') {
        pillDependentCols = {};
    } else if (task == "design") {
        $(".designForceHide").removeClass("d-none designForceHide");
    }
    isOpenSmartStepper = false;
}

function checkDuplicateViewName() {
    var name = $("#viewCaption").val();
    if ($("#viewTabs").find("a span[data-caption=" + name.replace(/ /g, "\\ ") + "]").length > 0) {
        ivirCustomErrMsg($("#viewCaption"), errorMessages.duplicateFld.replace("{0}", "View"));
        return false;
    }
    else
        return true;


}
function validateViewName() {
    var name = $("#viewCaption").val(); var regex = /^[0-9a-zA-Z\_ ]+$/;
    if (!regex.test(name)) {
        ivirCustomErrMsg($("#viewCaption"), errorMessages.invalidName);
        return false;
    }
    else
        return true;
}

/**
 * To highlight the first field when an popup is opened
 * @author ManiKanta
 * @Date   2018-11-19T16:26:22+0530
 * @return {}                 
 */
function highlightTheFirstFld() {
    var allFocusableElems = $(".jconfirm-box-container").find(':focusable');
    for (var i = 0; i < allFocusableElems.length; i++) {
        if (allFocusableElems[i].nodeName != "DIV" && allFocusableElems[i].tabIndex != "-1") {
            allFocusableElems[i].focus();
            return false;
        }
    }
}

/**
 * When user is adding more conditons this function will check weather user can add more conditoins or limit exceeded
 * @author ManiKanta
 * @Date   2018-11-19T16:26:49+0530
 * @param  {String}                 type Type of the condition to check
 * @return {Boolean}                      
 */
function checkForPillsLength(type) {
    if (type == "group" || type == "highlight" || type == "chart" || type == "filter") {
        var pillsArr = ivirMainObj[type];
        if (type != "chart") {
            maxNoOfPills = 1;
        } else {
             maxNoOfPills = 5;
        }
        if (pillsArr && pillsArr.length >= maxNoOfPills) {
            if (maxNoOfPills < 1) {
                var msg = errorMessages.maxPills.replace(/_type_/g, type);
                showAlertDialog("warning", msg);
            }
            $("#IvirActions").val("");
            if (type != "chart") {
                maxNoOfPills = 5;
            }
            return true;
        }
    }
}

/**
 * Events to bind once the poup is opned
 * @author ManiKanta
 * @Date   2018-11-19T16:28:14+0530
 * @param  {String}                 act Action name on which popup is opened
 * @return {}                     
 */
function ivirbindEvents(act) {
    var action = act.toLowerCase();

    //writing custom code to traverse the tab access in the opened popup
    jQuery(document).bind("keyup.cnfrmPopupKU", function (event) { });
    jQuery(document).bind("keydown.cnfrmPopupKD", function (event) {
        var elemntsToCheck = 'button[tabindex!="-1"],a[tabindex!="-1"],input[tabindex!="-1"],select[tabindex!="-1"],textarea[tabindex!="-1"]';
        if (!event.shiftKey && event.keyCode == 9) {
            //tab key
            if ($(document.activeElement)[0] == $(".jconfirm-buttons button:last")[0]) {
                event.preventDefault()
                $(".jconfirm-box").find(elemntsToCheck).first().focus();
            }
        } else if (event.shiftKey && event.keyCode == 9) {
            //tab key + shift
            if ($(document.activeElement)[0] == $(".jconfirm-box").find(elemntsToCheck).first()[0]) {
                event.preventDefault();
                $(".jconfirm-box").find(elemntsToCheck).last().focus();
            }
        }
        else if (event.keyCode == 27) {
            event.preventDefault();
            $(".jconfirm-box .jconfirm-buttons .coldbtntiny").click();
        }
    });

    $("#ivirHighlightWrapper .colorPicker").on('blur.accessColor', function () {
        $(this).val($($(this).next()).spectrum("get").toHexString());
    });
    $('.dialogInptFld').on("keydown.dlgKD", function () {
        var elem = $(this);
        if (elem.next().hasClass('customError')) {
            elem.next('span.customError').remove();
        }
    });
    $('.dialogSlctFld').on("change.dlgKD", function () {
        var elem = $(this);
        if (elem.next().hasClass('customError')) {
            elem.next('span.customError').remove();
        }
    });

    if (action == 'column') {
        $(document).on('change', '#showAllColumns, .showAllColumns', function (event) {
            if (!isListView) {
                if ($(this).is(':checked')) {
                    $("#ivirshowHideColumnWrapper div.checkbox input:not('.disabled')").prop('checked', true);
                } else {
                    $("#ivirshowHideColumnWrapper .customCheckBox:not('.disabled')").prop('checked', false);
                    if ($("#ivirshowHideColumnWrapper .customCheckBox:checked").length === 0)
                        $("#ivirshowHideColumnWrapper .customCheckBox:not('.disabled'):first").prop('checked', true);
                }
            } else {
                var wrapper = $(this).parents(".lstColSelWrapper");
                var showAllInput = $(this);
                var isGrid = showAllInput.data("isgrid");

                if ($(this).is(':checked')) {
                    wrapper.find(".ivirLabelWrapper input:checkbox:not('.disabled')").prop('checked', true);
                } else {
                    wrapper.find(".ivirLabelWrapper input:checkbox:not('.disabled')").prop('checked', false);
                    if (wrapper.find(".ivirLabelWrapper input:checkbox:checked").length === 0 && !isGrid)
                        wrapper.find(".ivirLabelWrapper input:checkbox:not('.disabled'):first").prop('checked', true);
                }

                if (isGrid && $(this).is(':checked')) {
                    $(".lstColSelWrapper").each((ind, elm) => {
                        if (!$(elm).is(wrapper) && $(elm).find(".showAllColumns").data("isgrid")) {
                            $(elm).find("input:checkbox:not('.disabled')").prop('checked', false);
                        }
                    });
                }

                $("#selColHypOpts").html($(".lstColSelWrapper").map((ind, elm) => { return $(elm).find(".ivirLabelWrapper input:checkbox:checked").map((ind, elm) => { return `<option>${$(elm).data("name")}</option>` }).toArray().join("") }).toArray().join(""));
            }
        });
        $(document).on('change', '#ivirshowHideColumnWrapper .customCheckBox', function (event) {
            if (!isListView) {
                if (!$(this).is(':checked')) {
                    $("#showAllColumns").prop('checked', false);
                } else {
                    if ($(".ivirLabelWrapper input:checkbox:not(:checked)").length > 0)
                        $("#showAllColumns").prop('checked', false);
                    else
                        $("#showAllColumns").prop('checked', true);
                }
            } else {
                var wrapper = $(this).parents(".lstColSelWrapper");
                var showAllInput = wrapper.find(".showAllColumns");
                var isGrid = showAllInput.data("isgrid");

                if (!$(this).is(':checked')) {
                    showAllInput.prop('checked', false);

                    if (wrapper.find(".ivirLabelWrapper input:checkbox:checked").length === 0 && !isGrid)
                        wrapper.find(".ivirLabelWrapper input:checkbox:not('.disabled'):first").prop('checked', true);
                } else {
                    if (wrapper.find(".ivirLabelWrapper input:checkbox:not(:checked)").length > 0)
                        showAllInput.prop('checked', false);
                    else
                        showAllInput.prop('checked', true);
                }

                if (isGrid && $(this).is(':checked')) {
                    $(".lstColSelWrapper").each((ind, elm) => {
                        if (!$(elm).is(wrapper) && $(elm).find(".showAllColumns").data("isgrid")) {
                            $(elm).find("input:checkbox:not('.disabled')").prop('checked', false);
                        }
                    });
                }

                $("#selColHypOpts").html($(".lstColSelWrapper").map((ind, elm) => { return $(elm).find(".ivirLabelWrapper input:checkbox:checked").map((ind, elm) => { return `<option>${$(elm).data("name")}</option>` }).toArray().join("") }).toArray().join(""));
            }
        });
    } else if (action == "sort") {
        $(document).on('click', '#ivirSortColumnWrapper .ascDscWrapper button', function (event) {
            var clickedBtn = $(this);
            var parentSpan = $($(this).parent());
            parentSpan.find('button span').removeClass('active');
            clickedBtn.find('span').addClass('active');
            parentSpan.parent().find('input[type="checkbox"]').prop('checked', true)
        });
        $(document).on('click', '#clearSorting', function (event) {
            $("#ivirSortColumnWrapper .labelSelected").removeClass('labelSelected');
            $("#ivirSortColumnWrapper input[type='checkbox']").prop('checked', false);
            $("#ivirSortColumnWrapper .ascDscWrapper button span").removeClass('active');
        });
        $(document).on('click', '.ivirSortLabel', function (event) {
            var parentEl = $(this).parent('.ivirLabelWrapper');
            $("#ivirSortColumnWrapper .labelSelected").removeClass('labelSelected');
            if (parentEl.hasClass('labelSelected'))
                parentEl.removeClass('labelSelected');
            else
                parentEl.addClass('labelSelected');
        });

        $(document).on('change', '#ivirSortColumnWrapper input[type="checkbox"]', function (event) {
            if ($(this).is(':checked')) {
                $(this).parent().find('span.ascDscWrapper').find('button span:first').addClass('active');
            } else {
                $(this).parent().find('span.ascDscWrapper').find('button span').removeClass('active');
            }
        });
        assignKeyDownDrag("ivirSortColumnWrapper");
    } else if (action == 'highlight') {
        $(document).on('change', '#ivirHighlightCol', function (event) {
            var lastColType = $(this).data('lastColType');
            var colType = $(this).find('option:selected').data('type');
            if (colType == "d")
                $("#ivirHltValue").attr("type", "date");
            else
                $("#ivirHltValue").attr("type", "text");
            $(this).data('lastColType', colType);
            if (lastColType == undefined || lastColType != colType) {

                var optionsHtml = "";
                if (colType == 'c') {
                    optionsHtml += "<option value='equalto'>&#61;</option>";
                    optionsHtml += "<option value='notequalto'>&#33;&#61;</option>";
                    optionsHtml += "<option value='contains'>contains</option>";
                    optionsHtml += "<option value='notcontains'>not contains</option>";
                    optionsHtml += "<option value='regex'>regex</option>";
                } else if (colType == 'n' || colType == 'd') {
                    optionsHtml += "<option value='equalto'>&#61;</option>";
                    optionsHtml += "<option value='notequalto'>&#33;&#61;</option>";
                    optionsHtml += "<option value='lessthan'>&lt;</option>";
                    optionsHtml += "<option value='lessthanequalto'>&lt;&#61;</option>";
                    optionsHtml += "<option value='greaterthan'>&gt;</option>";
                    optionsHtml += "<option value='greaterthanequalto'>&gt;&#61;</option>";
                }

                $("#ivirHighlightCndtn").html(optionsHtml);
            }

        });
    } else if (action == 'group') {
        $(document).on('change', '#grpColName', function (event) {
            var elem = $(this);
            tmpGroupObj = {};
            htmlToShow = '<div id="ivirTotalCndtn1" class="ivirTotalCndtn row py-3">';
            htmlToShow += getRowGroupingCondtionHtml();
            htmlToShow += '</div>';

            $("#ivirTotalCndtnWrapper").data('cndtns', [1]).attr('data-cndtns', '[1]').html(htmlToShow);

            if (elem.val() === "") {
                $("#ivirTotalCndtnWrapper").hide();

            } else {
                $("#ivirTotalCndtnWrapper").show();
                tmpGroupObj.groupIndex = $(this).find('option:selected').data('index');
            }

            /* select2 and tooltip init required */
            $("select.stepperSelect.totalAggrFunction, select.stepperSelect.totalSource").select2({
                allowClear: true,
                dropdownParent: document.getElementById("newViewTabId"),
                placeholder: appGlobalVarsObject.lcm[441],
            });

            KTApp?.initBootstrapTooltips();

        });
    }
}

/**
 * To remove the events wehen the popup is closing
 * @author ManiKanta
 * @Date   2018-11-19T16:28:59+0530
 * @param  {String}                 act Action on which popup is closing
 * @return {}                     
 */
function ivirRemovebindEvents(act) {
    jQuery(document).unbind("keydown.cnfrmPopupKD");
    jQuery(document).unbind("keyup.cnfrmPopupKU");
    $('.dialogInptFld').off("keydown.dlgKD");
    $('.dialogInptFld').off("change.dlgKD");
    var action = act.toLowerCase();
    if (action == 'column') {
        $(document).off('change', '#showAllColumns, .showAllColumns');
    } else if (action == "sort") {
        $(document).off('click', '#ivirSortColumnWrapper .ascDscWrapper button');
        $(document).off('click', '#clearSorting');
        $(document).off('click', '.ivirSortLabel');
        $(document).off('change', '#ivirSortColumnWrapper input[type="checkbox"]');
        $(document).off('keydown.upAndDown');
    } else if (action == 'highlight') {
        $("#ivirHighlightWrapper .colorPicker").off('blur.accessColor');
        $(document).off('change', '#ivirHighlightCol');
    } else if (action == 'group') {
        $(document).off('change', '#grpColName');
    }
}

/**
 * Events to be binded when user opened a sort popup like key down/up space selction and dragging(Future use)
 * @author ManiKanta
 * @Date   2018-11-19T16:29:53+0530
 * @param  {}                 parentId 
 * @return {}                          
 */
function assignKeyDownDrag(parentId) {
    $(document).on('keydown.upAndDown', function (e) {
        var selectedElem = $("#ivirSortColumnWrapper .ivirLabelWrapper.labelSelected");
        if (e.keyCode == 38) {
            if (selectedElem.index() != 0) {
                selectedElem.prev().addClass('labelSelected');
                selectedElem.removeClass('labelSelected');
            }
        }
        else if (e.keyCode == 40) {
            if (selectedElem.index() != selectedElem.parent().find('.ivirLabelWrapper').last().index()) {
                selectedElem.next().addClass('labelSelected');
                selectedElem.removeClass('labelSelected');
            }
        }
        else if (e.keyCode == 32) {
            e.preventDefault();
            $("#ivirSortColumnWrapper .ivirLabelWrapper.labelSelected .ascDscWrapper button span:not('.active')").first().click();
        }

    });
}

/**
 * For sorting popup when user click on up arrow or down arrow this function will be called with parent div ID
 * @author ManiKanta
 * @Date   2018-11-19T16:31:30+0530
 * @param  {String}                 direction up/down
 * @param  {String}                 parentId  id of the parent
 * @return {}                           
 */
function ivirMoveUpDown(direction, parentId) {
    var selectedFld = $("#" + parentId).find('div.labelSelected');
    if (direction == 'up') {
        if (selectedFld.index() != 0) {
            selectedFld.insertBefore(selectedFld.prev());
        }
    } else if (direction == 'down') {
        if (selectedFld.index() != selectedFld.parent().find('.ivirLabelWrapper').last().index()) {
            selectedFld.insertAfter(selectedFld.next());
        }
    }
}

/**
 * Will be called when user applied hide show columns
 * @author Prashik + ManiKanta
 * @Date   2018-11-19T17:18:08+0530
 * @return {}                 
 */
function ivirshowHideColumns(hvColumns = []) {
    requestTstructFieldsObj();
    if (!isListView) {
        if ($("#ivirshowHideColumnWrapper div.checkbox input:checked").length == 0 && hvColumns.length == 0) {
            showAlertDialog("warning", errorMessages.columnSelection);
            return false;
        }

        if ($("#ivirshowHideColumnWrapper div.checkbox:visible").length > 0) {
            hvColumns = [];

            $(ivirTable).css("width", "auto");
            $("#ivirshowHideColumnWrapper div.checkbox").each(function (index, el) {
                var checkBox = $(this).find('input');
                if (checkBox.is(':checked')) {
                    if (!($("#newViewTabId").is(":visible") || isOpenSmartStepper)) {
                        ivirVisibleColumns.push(checkBox.data('index'));
                        ivirDataTableApi.column(checkBox.data('index')).visible(true);
                    }
                } else {
                    hvColumns.push(FieldName[checkBox.data('index')]);
                    if (!($("#newViewTabId").is(":visible") || isOpenSmartStepper)) {
                        ivirDataTableApi.column(checkBox.data('index')).visible(false);
                    }
                }
            });
            viewLoadedColumns = false;
        } else if (hvColumns.length > 0) {
            FieldName.forEach((fld, ind) => {
                if (hvColumns.indexOf(fld) == -1 && hiddenColumnIndex.indexOf(ind) == -1) {
                    if (!($("#newViewTabId").is(":visible") || isOpenSmartStepper)) {
                        ivirVisibleColumns.push(ind);
                        ivirDataTableApi.column(ind).visible(true);
                    }
                } else {
                    if (!($("#newViewTabId").is(":visible") || isOpenSmartStepper)) {
                        ivirDataTableApi.column(ind).visible(false);
                    }
                }
            });
            viewLoadedColumns = true;
        } else {
            viewLoadedColumns = false;
        }

        if (requestJSON) {
            if (hvColumns.length == 1 && hvColumns[0] == "!") {
                hvColumns = [];
                viewLoadedColumns = false;
            }
            if (hvColumns.length > 0) {
                ivirMainObj.hiddenColumns = hvColumns;
            }
            else if (hvColumns.length == 0) {
                delete ivirMainObj.hiddenColumns;
            }

        }

        if (!($("#newViewTabId").is(":visible") || isOpenSmartStepper)) {

            if ($(ivirTable).outerWidth() < $(window).width()) {
                $(ivirTable).css("width", "100%");
                ivirDatatable.fnAdjustColumnSizing();
            }
            // if column freeze is there heights are appending to tr so its showing too much space
            $(ivirTable + " tbody tr").css("height", "22px");
            ivirDataTableApi.fixedColumns().relayout();
            createMainEventsOnGrid();

            if (!jQuery.isEmptyObject(pillDependentCols)) {
                var pillData = pillDependentCols.data;
                var pillType = pillDependentCols.type;
                var pillindex = pillDependentCols.index;
                var pillDependentColsLength = pillData.length;
                for (var i = 0; i < pillDependentColsLength; i++) {
                    if ($.inArray(pillData[i], ivirVisibleColumns) === -1) {
                        showAlertDialog("warning", errorMessages.dependentColumns);
                        return false;
                    }
                }
                $("#" + pillType + "pillCB" + pillindex).prop('checked', true).attr('checked', 'checked');
                if (pillType == "group")
                    applyThePill("group", pillindex);
                else if (pillType == "chart")
                    ivirCreateChart(pillindex, true, true);
                pillDependentCols = {};
            }
            if (fixedColumnsObj != "") {
                $(".DTFC_LeftBodyWrapper .ivirCustomHighlight,.DTFC_LeftBodyWrapper .ivirCustomHighlightCell").removeClass("ivirCustomHighlight").css({
                    "background-color": "",
                    "color": ""
                });
            }
        }
    } else {


        if ($("#ivirshowHideColumnWrapper div.checkbox input:checked").length == 0 && hvColumns.length == 0) {
            showAlertDialog("warning", errorMessages.columnSelection);
            return false;
        }

        hvColumns = [];

        if ($("#ivirshowHideColumnWrapper div.checkbox:visible").length > 0) {
            hvColumns = [];

            hvColumns.push(
                {
                    hyperlink: $("#selColHypOpts").val(),
                    dcs: $("#ivirshowHideColumnWrapper div.checkbox:visible input:checked").toArray().reduce((res, fld, ind) => {
                        if (!res[$(fld).data("dcno")]) {
                            res[$(fld).data("dcno")] = {};
                            res[$(fld).data("dcno")].fields = [];
                            res[$(fld).data("dcno")].isGrid = $(fld).data("isgridfield");
                        }
                        res[$(fld).data("dcno")].fields.push($(fld).data("name"));
                        return res;
                    }, {})
                }
            );

            if (hvColumns) {
                var columnsString = _.map(hvColumns[0].dcs, (dc) => { return dc.fields }).reduce((res, fld) => { res = [...res, ...fld]; return res; }, []).join(",");

                if ($("#hdnLvSelectedCols").val() != columnsString || $("#hdnLvSelectedHyperlink").val() != hvColumns[0].hyperlink) {
                    $("#hdnLvSelectedCols").val(columnsString);
                    $("#hdnLvSelectedHyperlink").val(hvColumns[0].hyperlink);
                    $("#hdnLvChangedStructure").val("");

                    var viewName = $(".viewtabEdit").parents("li a.active").find(".viewtabEdit").data("name") || "main";
                    loadViewName = viewName;
                    if(oldLoadViewName){
                        oldLoadViewName = "";
                    }
                    $("#button1").trigger('click');
                }
            }
            viewLoadedColumns = false;
        } else if (hvColumns.length > 0) {

            viewLoadedColumns = true;
        } else {
            viewLoadedColumns = false;
        }

        if (requestJSON) {
            if (hvColumns.length == 1 && hvColumns[0] == "!") {
                hvColumns = [];
                viewLoadedColumns = false;
            }
            if (hvColumns.length > 0) {
                ivirMainObj.visibleColumns = hvColumns;
            }
            else if (hvColumns.length == 0) {
                delete ivirMainObj.visibleColumns;
            }
        }
    }

    if (!responsiveColumnWidth) {
        setTimeout(() => {
            forceColumnWidth();
        }, 0);
    }
}

function ivirDesignColumn() {
    try {
        ivirMainObj = ivirMainObj || {};
    } catch (ex) { }

    ivirMainObj.design = ivColDesignJSON || [];

    if (document.getElementById("IvirActions").value == "design") {        
        var username = callParentNew("mainUserName");

        ivirMainObj["applyTo"] = $('#viewAplyTo option:selected').val() || username;
        ivirMainObj["groupName"] = "main";
        ivirMainObj["caption"] = ivirMainObj["groupName"];

        if (!ivirMainViewObj["views"])
            ivirMainViewObj["views"] = {};
        ivirMainViewObj["views"][ivirMainObj["groupName"]] = JSON.parse(JSON.stringify(ivirMainObj));

        SaveSmartviewJsonToDb("set", JSON.stringify(ivirMainViewObj), ivirMainObj["applyTo"], ivirMainObj["groupName"]);
    }
    if (!responsiveColumnWidth) {
        forceColumnWidth();
    }
}

/**
 * Will be called when user applied sorting
 * @author Prashik + ManiKanta
 * @Date   2018-11-19T17:18:47+0530
 * @return {}                 
 */
function ivirSortColumns(fldSortingArray = []) {
    var sortingArray = [];

    if ($("#ivirSortColumnWrapper .checkbox input[type='checkbox']:visible").length > 0) {
        fldSortingArray = [];
        $("#ivirSortColumnWrapper .checkbox input[type='checkbox']").each(function (index, el) {
            if ($(this).is(':checked')) {
                var index = $(this).data('index');
                var order = $(this).parent().find('button span.active').data('order');
                var tmpArray = [];
                tmpArray.push(index);
                tmpArray.push(order);
                sortingArray.push(tmpArray);
                var tmpFldArray = [];
                tmpFldArray.push(FieldName[index]);
                tmpFldArray.push(order);
                fldSortingArray.push(tmpFldArray);
            }
        });
        viewLoadedSort = false;
    } else if (fldSortingArray.length > 0 && fldSortingArray[0] != "!") {
        sortingArray = fldSortingArray.map(sortData => {
            sortData[0] = FieldName.indexOf(sortData[0]);
            return sortData;
        });
        viewLoadedSort = true;
    } else if (fldSortingArray.length > 0 && fldSortingArray[0] == "!") {
        try { ivirDataTableApi.order.neutral().draw() } catch (ex) { }
        viewLoadedSort = false;
    }
    else {
        viewLoadedSort = false;
    }

    if (requestJSON) {
        if (fldSortingArray.length == 1 && fldSortingArray[0] == "!") {
            fldSortingArray = [];
            viewLoadedColumns = false;
        }
        if (fldSortingArray.length > 0) {
            ivirMainObj.sorting = fldSortingArray;
        }

        if (($("#newViewTabId").is(":visible") || isOpenSmartStepper) && fldSortingArray.length == 0) {
            delete ivirMainObj.sorting;
        }
    }

    if (groupingCol != "") {
        sortingArray.push([parseInt(groupingCol), "asc"]);
    }

    if ($("#newViewTabId").is(":visible") || isOpenSmartStepper) {
        try {
            $("#newViewsort").val(JSON.stringify(ivirMainObj.sorting));
        } catch (ex) { }
    } else {
        ivirDatatable.fnSort(sortingArray);
    }

}

/**
 * The main function for row grouping will be called when user applied for grouping
 * @author ManiKanta + Abhishek
 * @Date   2018-11-19T17:19:03+0530
 * @param  {Number}                 indexOfArray         index of the column on which grouping should apply
 * @param  {Boolean}                isPillAlreadyChecked To know weather user is applyig or removing the conditon
 * @return {}                                      
 */
function ivirRowGrouping(indexOfArray, isPillAlreadyChecked) {

    if (($("#newViewTabId").is(":visible") || isOpenSmartStepper) && (typeof ivirMainObj.group == "undefined" || ivirMainObj.group.length == 0) && typeof indexOfArray != "undefined") {
        indexOfArray = undefined;
    }

    var grpName = $("#grpName");
    var grpColName = $("#grpColName");
    var indexOfGrpArray;
    var limitExceeded = false;
    var isFirstTime = false;
    if (grpName.val() == "") {
        ivirCustomErrMsg(grpName, errorMessages.emptyField)
        return false;
    } else if (!testRegex("validName", grpName.val())) {
        ivirCustomErrMsg(grpName, errorMessages.invalidName);
        return false;
    }

    if (grpColName.val() == "") {
        ivirCustomErrMsg(grpColName, errorMessages.emptySelect)
        return false;
    }

    var colIndex = parseInt(grpColName.find('option:selected').data('index'), 10);

    //checking for user filled any total conditions
    if ($("#ivirTotalCndtn1 .totalAggrFunction").val() != "") {
        var isLastSelectEmpty = false;
        $("#ivirTotalCndtnWrapper select:enabled").each(function (index, el) {
            if ($(this).val() == "") {
                ivirCustomErrMsg($(this), errorMessages.emptyField);
                isLastSelectEmpty = true;
                return false;
            }

        });
        if (isLastSelectEmpty) {
            return false;
        }
        if ($("#ivirTotalCndtn1 .totalAggrFunction").val() == "") {
            ivirCustomErrMsg($("#ivirTotalCndtn1 .totalAggrFunction"), errorMessages.emptyField)
            return false;
        } else {
            $("#ivirTotalCndtn1 .totalAggrFunction").next('span.customError').remove();
        }
        if ($("#ivirTotalCndtn1 .totalSource").val() == "") {
            ivirCustomErrMsg($("#ivirTotalCndtn1 .totalSource"), errorMessages.emptyField)
            return false;
        } else {
            $("#ivirTotalCndtn1 .totalSource").next('span.customError').remove();
        }
        var addedRowsArray = $("#ivirTotalCndtnWrapper").data('cndtns');
        var groupTotalArray = [];
        var grandTotal = [];
        for (var i = 0; i < addedRowsArray.length; i++) {
            var presentCndtn = addedRowsArray[i];
            groupTotalArray.push($("#ivirTotalCndtn" + presentCndtn + " .totalAggrFunction").val());
            groupTotalArray.push($("#ivirTotalCndtn" + presentCndtn + " .totalSource option:selected").data("index"));
            groupTotalArray.push($("#ivirTotalCndtn" + presentCndtn + " .totalSource option:selected").val());


            var indexOfCol = $("#ivirTotalCndtn" + presentCndtn + " .grndTtlCB input").data('index');
            if ($("#ivirTotalCndtn" + presentCndtn + " .grndTtlCB input").is(':checked')) {

                if ($.inArray(indexOfCol, allGrandTotal) === -1) {
                    allGrandTotal.push(indexOfCol);
                }
                grandTotal.push(indexOfCol)
            } else {
                var idx = allGrandTotal.indexOf(indexOfCol);
                if (idx != -1)
                    allGrandTotal.splice(idx, 1);
                grandTotal.push(-1);
            }
        }

    }

    //neeed to validate for added rows(function....)

    if ($("#newViewTabId").is(":visible") || isOpenSmartStepper) {
    } else {
        if ((indexOfArray === undefined) || isPillAlreadyChecked)
            createIvirDataTable("group", colIndex, groupTotalArray, allGrandTotal);
    }


    //apply the pill is is directly handled in chekcbox click ivirCheckBox 

    var name = grpName.val();
    var columnIndex = colIndex;
    var grpTotal = groupTotalArray;
    var grndTotal = grandTotal;

    if (indexOfArray === undefined) {
        //means first time or new one
        if (jQuery.isEmptyObject(ivirMainObj)) {
            var grpArr = ivirMainObj.group = [];
            isFirstTime = true;
            indexOfGrpArray = 0;
        } else if (ivirMainObj.group === undefined) {
            var grpArr = ivirMainObj.group = [];
            indexOfGrpArray = 0;
        } else {
            var grpArr = ivirMainObj.group;
            isFirstTime = false;
            if (grpArr.length >= maxNoOfPills)
                limitExceeded = true;
            indexOfGrpArray = grpArr.length;
        }

        var grpObj = new Object();
    } else {
        var grpObj = ivirMainObj.group[indexOfArray];
        indexOfGrpArray = indexOfArray;
    }

    if (!limitExceeded) {
        grpObj.n = name;
        grpObj.cl = columnIndex;
        grpObj.t = grpTotal;
        grpObj.g = grndTotal;
        if ($("#newViewTabId").is(":visible") || isOpenSmartStepper) {
            if (typeof ivirMainObj.group == "undefined" || ivirMainObj.group.length == 0) {
                grpArr.push(grpObj);
            }

        } else {
            if (indexOfArray === undefined) {
                grpArr.push(grpObj);
                if (isFirstTime || $("#ivirFilteredAccordion").length == 0) {
                    if ($("#ivirFilteredAccordion").length == 0)
                        createPills("all", "first");
                    else {
                        $("[id^='grouppillCB']").prop('checked', false).removeAttr('checked');
                        createPills("all", "last");
                    }
                } else if ($("#ivirFilteredAccordion").length > 0) {
                    $("[id^='grouppillCB']").prop('checked', false).removeAttr('checked');
                    upateThePills("group", indexOfGrpArray, name);
                }
            } else {
                if (isPillAlreadyChecked) {
                    $("[id^='grouppillCB']").prop('checked', false).removeAttr('checked');
                    $("#grouppillCB" + indexOfArray).prop('checked', true).attr('checked', 'checked');
                }
                $("#grouppillCB" + indexOfArray).parent().next().find('.ivirCndtnName').attr('title', "Edit " + name).text(name);
            }
        }
    } else {
        showAlertDialog("warning", appGlobalVarsObject.lcm[23]);
    }

    if ($("#newViewTabId").is(":visible") || isOpenSmartStepper) {
        $("#newViewrowGrouping").val(JSON.stringify(grpObj));
    }

    setSmartViewHeight();
    return true;
}

/**
 * Function to generate chart html for the popup opened when user clicked on action
 * @author ManiKanta
 * @Date   2018-11-19T17:21:32+0530
 * @param  {Boolean}                isFromEdit To check from edit of new
 * @return {}                            
 */
function getChartHtml(isFromEdit) {
    isFromEdit = isFromEdit || false;
    htmlToShow = "";
    htmlToShow += '<div id="ivirChatWrapper">';
    htmlToShow += '<div id="ivirChartsRow" class="row">';
    htmlToShow += '<div class="col-md-3 col-sm-3 text-center d-flex flex-column"><button data-type="pie" title="' + callParentNew('lcm')[419] + '" onclick="ivirShowChart(\'graph \',\'pie\',this)" type="button" class="ivirChartButton btn btn-active-light-primary shadow-sm p-10 mx-10 active"><span class="material-icons material-icons-style material-icons-5tx">pie_chart</span></button><label class="h4 mt-7">' + callParentNew('lcm')[419] + '</label></div>';
    htmlToShow += '<div class="col-md-3 col-sm-3 text-center d-flex flex-column"><button data-type="column" title="' + callParentNew('lcm')[420] + '" onclick="ivirShowChart(\'graph \',\'column\',this)" type="button" class="ivirChartButton btn shadow-sm p-10 mx-10"><span class="material-icons material-icons-style material-icons-5tx">bar_chart</span></button><label class="h4 mt-7">' + callParentNew('lcm')[420] + '</label></div>';
    htmlToShow += '<div class="col-md-3 col-sm-3 text-center d-flex flex-column"><button data-type="donut" title="' + callParentNew('lcm')[421] + '" onclick="ivirShowChart(\'graph \',\'donut\',this)" type="button" class="ivirChartButton btn shadow-sm p-10 mx-10"><span class="material-icons material-icons-style material-icons-5tx">donut_large</span></button><label class="h4 mt-7">' + callParentNew('lcm')[421] + '</label></div>';
    htmlToShow += '<div class="col-md-3 col-sm-3 text-center d-flex flex-column"><button data-type="bar" title="' + callParentNew('lcm')[422] + '" onclick="ivirShowChart(\'graph \',\'bar\',this)" type="button" class="ivirChartButton btn shadow-sm p-10 mx-10"><span class="material-icons material-icons-style material-icons-5tx transform-90 transform-origin-inherit">bar_chart</span></button><label class="h4 mt-7">' + callParentNew('lcm')[422] + '</label></div>';
    htmlToShow += '</div>';
    htmlToShow += '<hr />';
    htmlToShow += '<div id="ivirchartsCndtn">';
    htmlToShow += ' <div id="ivirgraph" class="row chartCndtnWrapper">';
    htmlToShow += '<div class="col-md-4 col-sm-12">'
    htmlToShow += '<label for="ivirChartName" class="form-label col-form-label pb-1 fw-boldest required">' + callParentNew('lcm')[413] + '</label>';
    htmlToShow += '<a href="javascript:void(0)" class="ms-2 align-middle icon-arrows-question" tabindex="-1" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-dismiss="click" data-bs-original-title="' + callParentNew('lcm')[431] + '"><span class="material-icons material-icons-style material-icons-3">help_outline</span></a>';
    htmlToShow += '<div class="input-group">';
    htmlToShow += '<input required type="text" maxlength="20" class="form-control dialogInptFld fldNme" id="ivirChartName">';
    htmlToShow += '</div>';
    htmlToShow += '</div>'
    htmlToShow += '     <div class="col-md-4 col-sm-12">';
    htmlToShow += '       <label for="ivirChartCol" class="form-label col-form-label pb-1 fw-boldest required">' + callParentNew('lcm')[420] + '</label>';
    htmlToShow += '<a href="javascript:void(0)" class="ms-2 align-middle icon-arrows-question" tabindex="-1" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-dismiss="click" data-bs-original-title="' + callParentNew('lcm')[432] + '"><span class="material-icons material-icons-style material-icons-3">help_outline</span></a>';
    var numericFldsHtml = "";
    var charFldsHml = "";
    var allColumnsArray = getAllColumns("", isFromEdit);
    numericFldsHtml = allColumnsArray[0]
    charFldsHml = allColumnsArray[1];
    htmlToShow += '<div class="input-group">';
    htmlToShow += '  <select class="form-select chartSelect dialogSlctFld" id="ivirChartCol">';
    htmlToShow += '<option value="" data-index="">' + callParentNew('lcm')[441] + '</option>';
    htmlToShow += charFldsHml;
    htmlToShow += '</select>';
    htmlToShow += '</div>';
    htmlToShow += '</div>';

    htmlToShow += '<div class="col-md-4 col-sm-12">';
    htmlToShow += '   <label for="ivirChartVal" class="form-label col-form-label pb-1 fw-boldest required">' + callParentNew('lcm')[414] + '</label>';
    htmlToShow += '<a href="javascript:void(0)" class="ms-2 align-middle icon-arrows-question" tabindex="-1" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-dismiss="click" data-bs-original-title="' + callParentNew('lcm')[433] + '"><span class="material-icons material-icons-style material-icons-3">help_outline</span></a>';
    htmlToShow += '<div class="input-group">';
    htmlToShow += '  <select class="form-select chartSelect dialogSlctFld" id="ivirChartVal">';
    htmlToShow += '<option value="" data-index="">' + callParentNew('lcm')[441] + '</option>';
    htmlToShow += numericFldsHtml;
    htmlToShow += '   </select>';
    htmlToShow += '</div>';
    htmlToShow += ' </div>';
    htmlToShow += '</div>';
    htmlToShow += ' </div>';
    htmlToShow += ' </div>';
    return htmlToShow;
}

/**
 * To get the group html in the popup when user clicked on grroup action
 * @author ManiKanta
 * @Date   2018-11-19T17:22:26+0530
 * @param  {Boolean}                isFromEdit To check is from edit or new
 * @return {}                            
 */
function getGroupHtml(isFromEdit) {
    isFromEdit = isFromEdit || false;
    var htmlToShow = "";
    htmlToShow = ' <div class="form-group ' + (($("#newViewTabId").is(":visible") || isOpenSmartStepper) ? `d-none` : ``) + '">';
    htmlToShow += '<label for="grpName" class="form-label col-form-label pb-1 fw-boldest required">' + callParentNew('lcm')[413] + '</label>';
    htmlToShow += ' <a href="javascript:void(0)" class="ms-2 align-middle icon-arrows-question" tabindex="-1" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-dismiss="click" data-bs-original-title="' + callParentNew('lcm')[430] + '"><span class="material-icons material-icons-style material-icons-3">help_outline</span></a>';
    htmlToShow += '<input required type="text" class="form-control fldNme dialogInptFld" maxlength="20" id="grpName" value="' + (($("#newViewTabId").is(":visible") || isOpenSmartStepper) ? `a` : ``) + '">';
    htmlToShow += '</div>';
    htmlToShow += '<div class="form-group">';
    htmlToShow += '<label for="grpColName" class="form-label col-form-label pb-1 fw-boldest required">' + callParentNew('lcm')[420] + '</label>';
    htmlToShow += '<a href="javascript:void(0)"  class="ms-2 align-middle icon-arrows-question" tabindex="-1" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-dismiss="click" data-bs-original-title="' + callParentNew('lcm')[429] + '" ><span class="material-icons material-icons-style material-icons-3">help_outline</span></a>';
    htmlToShow += '<select class="form-select stepperSelect dialogSlctFld" id="grpColName">';
    htmlToShow += '<option value="">' + callParentNew('lcm')[441] + '</option>';

    var allColumnsArray = getAllColumns(hiddenColumnIndex, true, "group");
    htmlToShow += allColumnsArray[2];
    htmlToShow += ' </select>';
    htmlToShow += '</div>';
    htmlToShow += '<div id="ivirTotalCndtnWrapper" data-cndtns="[1]">';
    htmlToShow += '<div id="ivirTotalCndtn1" class="ivirTotalCndtn row py-3">';
    htmlToShow += getRowGroupingCondtionHtml();
    htmlToShow += '</div>';
    htmlToShow += '</div>';
    return htmlToShow;
}

/** Will be triggered when aggregation function change in grouping popup */
$(document).on('change', '.totalAggrFunction', function (event) {
    var elem = $(this);
    var elemVal = elem.val();
    var lastSelectedVal = elem.data('lastSelected');
    if (lastSelectedVal && lastSelectedVal == 'count') {
        $(".totalAggrFunction").append('<option value="count">Count</option>');
        elem.find('option[value="count"]').last().remove();
    } else {
        elem.data('lastSelected', elemVal);
    }
    elem.parents('.ivirTotalCndtn').find('.grndTtlCB input').prop({
        'checked': false,
        'disabled': true,
    })
    if (elemVal != "") {
        if (elemVal == 'count') {
            $('.totalAggrFunction').not(this).find('option[value="count"]').remove();
        }
        var exceptionArray = [];
        if (elem.parents('.ivirTotalCndtn ').attr('id') == 'ivirTotalCndtn1') {
            exceptionArray = [tmpGroupObj.groupIndex];
        } else {
            var selectedGroupIndex = tmpGroupObj.groupIndex;
            var indexeSelected = tmpGroupObj.indexeSelected;
            if (selectedGroupIndex && indexeSelected == undefined)
                exceptionArray.push(selectedGroupIndex);
            else if (indexeSelected) {
                if ($.inArray(selectedGroupIndex, indexeSelected) == -1)
                    indexeSelected.push(selectedGroupIndex);
                exceptionArray = indexeSelected;
            }
        }
        var allColumns = getAllColumns([...exceptionArray, ...hiddenColumnIndex], true);
        if (elemVal == "sum" || elemVal == "max" || elemVal == "min" || elemVal == "avg") {
            //means only numeric are allowed
            elem.parents('.ivirTotalCndtn').find('select.totalSource').append(allColumns[0]).trigger("change");
        } else {
            elem.parents('.ivirTotalCndtn').find('select.totalSource').append(allColumns[0]).trigger("change");
            elem.parents('.ivirTotalCndtn').find('select.totalSource').append(allColumns[1]).trigger("change");
        }
    }
});

/** Will be traiggered in grouping popup */
$(document).on('change', '.totalSource', function (event) {
    var chkBx = $(this).parents(".ivirTotalCndtn").find('.grndTtlCB input');
    if ($(this).find('option:selected').data('type') == 'n') {
        var index = $(this).find('option:selected').data('index');
        chkBx.data('index', index).prop('disabled', false);
    } else {
        chkBx.prop('disabled', true);
    }

});

/**
 * In grouping popup when user click on add condition row this function will handle the validations and add a row
 * @author ManiKanta
 * @Date   2018-11-19T17:26:17+0530
 * @param  {String}                 indexToAdd New index to add
 * @return {}                            
 */
function ivirAddTotalCndtn(indexToAdd) {
    indexToAdd = parseInt(indexToAdd, 10);
    var isCountSelected = false;
    var addedRowsArray = $("#ivirTotalCndtnWrapper").data('cndtns');
    var lastAddedIndex = addedRowsArray[addedRowsArray.length - 1];
    if ($("#ivirTotalCndtn" + lastAddedIndex + " .totalAggrFunction").val() == "") {
        ivirCustomErrMsg($("#ivirTotalCndtn" + lastAddedIndex + " .totalAggrFunction"), errorMessages.emptyField)
        return false;
    } else {
        $("#ivirTotalCndtn" + lastAddedIndex + " .totalAggrFunction").next('span.customError').remove();
    }
    if ($("#ivirTotalCndtn" + lastAddedIndex + " .totalSource").val() == "") {
        ivirCustomErrMsg($("#ivirTotalCndtn" + lastAddedIndex + " .totalSource"), errorMessages.emptyField)
        return false;
    } else {
        $("#ivirTotalCndtn" + lastAddedIndex + " .totalSource").next('span.customError').remove();
    }
    addedRowsArray.push(indexToAdd);
    var indexeSelected = tmpGroupObj.indexeSelected;
    if (indexeSelected) {
        if ($.inArray($("#ivirTotalCndtn" + lastAddedIndex + " .totalSource option:selected").data('index'), indexeSelected) == -1)
            indexeSelected.push($("#ivirTotalCndtn" + lastAddedIndex + " .totalSource option:selected").data('index'));
    } else
        tmpGroupObj.indexeSelected = [$("#ivirTotalCndtn" + lastAddedIndex + " .totalSource option:selected").data('index')];
    $(".totalAggrFunction").each(function (index, el) {
        if ($(this).val() == "count")
            isCountSelected = true;
    });

    var rowGroupingCondHtml = getRowGroupingCondtionHtml();
    var htmlToAdd = '<div id="ivirTotalCndtn' + indexToAdd + '" class="ivirTotalCndtn row py-3">' + rowGroupingCondHtml + '</div>';
    var deleteHtml = '<button type="button" title="Delete" onclick="ivirDeleteTotalCndtn(' + indexToAdd + ')" class="btn btn-sm btn-icon btn-active-light-primary shadow-sm"><i class="material-icons material-icons-style material-icons-1 ivirDeleteCndtnIcon">remove</i></button>';
    $("#ivirTotalCndtnWrapper").append(htmlToAdd);
    $('#ivirTotalCndtn' + indexToAdd + ' .ivirTotalCndtnBtn').show().attr('onclick', 'ivirAddTotalCndtn(' + (indexToAdd + 1) + ')');
    $('#ivirTotalCndtn' + indexToAdd + ' .grpaddDltBtnWrapper').append(deleteHtml);

    $('#ivirTotalCndtn' + indexToAdd + ' label:not(".grndTtlCB"),#ivirTotalCndtn' + indexToAdd + ' .labelP,#ivirTotalCndtn' + indexToAdd + ' a.icon-arrows-question').hide();
    $('#ivirTotalCndtn' + indexToAdd + ' .grndTtlCB input').prop('disabled', true);
    $('#ivirTotalCndtn' + indexToAdd + ' select').prop('disabled', false);
    $('#ivirTotalCndtn' + indexToAdd + ' select').select2({
        allowClear: true,
        dropdownParent: document.getElementById("newViewTabId"),
        placeholder: appGlobalVarsObject.lcm[441],
    });
    $("#ivirTotalCndtnWrapper").data('cndtns', addedRowsArray).attr('data-cndtns', "[" + addedRowsArray + "]");
    $("#ivirTotalCndtn" + lastAddedIndex + " .ivirTotalCndtnBtn").hide();
    $("#ivirTotalCndtn" + lastAddedIndex + " select").prop('disabled', true);
    if (isCountSelected) {
        $('#ivirTotalCndtn' + indexToAdd + ' .totalAggrFunction option[value="count"]').remove();
    }

}

/**
 * In grouping popup when user click on delete condtion this function will be trigerred
 * @author ManiKanta
 * @Date   2018-11-19T17:28:05+0530
 * @param  {String}                 indexToDelete The index to delete the condition
 * @return {}                               
 */
function ivirDeleteTotalCndtn(indexToDelete) {
    var functionVal = $('#ivirTotalCndtn' + indexToDelete + ' .totalAggrFunction').val();
    var totalSource = $('#ivirTotalCndtn' + indexToDelete + ' .totalSource option:selected').data('index');
    var indexSelectedArray = tmpGroupObj['indexeSelected'];
    var indexInArray = indexSelectedArray.indexOf(totalSource);
    if (indexInArray >= 0) {
        indexSelectedArray.splice(indexInArray, 1);
    }

    if (functionVal == "count") {
        $('.totalAggrFunction').append('<option value="count">Count</option>')
    }
    var addedRowsArray = $("#ivirTotalCndtnWrapper").data('cndtns');
    var index = addedRowsArray.indexOf(indexToDelete);
    addedRowsArray.splice(index, 1);
    if (!$('#ivirTotalCndtn' + indexToDelete + ' .totalAggrFunction').is(':disabled')) {
        $('#ivirTotalCndtn' + addedRowsArray[addedRowsArray.length - 1] + ' .ivirTotalCndtnBtn').show();
    }
    $('#ivirTotalCndtn' + indexToDelete).remove();

    if (addedRowsArray.length == 1) {
        $("#ivirTotalCndtn1 .ivirTotalCndtnBtn").show();
        $("#ivirTotalCndtn1 select").prop('disabled', false)
    }
    var lastIndex = addedRowsArray[addedRowsArray.length - 1];

    if (lastIndex > indexToDelete) {
        var lstGrpFunction = $('#ivirTotalCndtn' + lastIndex + ' .totalAggrFunction');
        var lstGrpFunctionVal = lstGrpFunction.val();
        var lstGrpSource = $('#ivirTotalCndtn' + lastIndex + ' .totalSource');
        var lstGrpSourceVal = lstGrpSource.val();

        lstGrpFunction.change();
        lstGrpSource[0].value = lstGrpSourceVal;
    }

    $("#ivirTotalCndtnWrapper").data('cndtns', addedRowsArray).attr('data-cndtns', "[" + addedRowsArray + "]");
}

/**
 * Generic function to show the error messages in the column popup when user entered some invalid data
 * @author ManiKanta
 * @Date   2018-11-19T17:29:59+0530
 * @param  {Object}                 elem feild object
 * @param  {String}                 msg  Message to show
 * @return {}                      
 */
function ivirCustomErrMsg(elem, msg) {
    var labelName = elem.parent().find('label').text();

    if (msg.indexOf('_name_') != -1) {
        msg = msg.replace("_name_", labelName);
    }
    else if (msg.indexOf('_option_' != -1)) {
        if (labelName == "Highlight") {
            msg = msg.replace("_option_", "option");
        }
        else {
            msg = msg.replace("_option_", labelName.toLowerCase());
        }
    }
    $('span.customError').remove();

    $('<span class="customError text-danger">' + msg + '</span>').insertAfter(elem);
}

/**
 * To get the highlight HTML for the popup
 * @author ManiKanta
 * @Date   2018-11-19T17:38:27+0530
 * @param  {}                 type       
 * @param  {Number}                 index      Index of the col
 * @param  {Boolean}                isFromEdit From edit or new
 * @return {}                           
 */
function getHighlightHtml(type, index, isFromEdit) {
    var isFromEdit = isFromEdit || false;
    htmlToShow = '<div id="ivirHighlightWrapper">';
    htmlToShow += '<div class="row">';
    htmlToShow += '<div class="form-group col-md-6 col-sm-6 ' + (($("#newViewTabId").is(":visible") || isOpenSmartStepper) ? `d-none` : ``) + '">';
    htmlToShow += '<label for="ivirHltName" class="form-label col-form-label pb-1 fw-boldest required">' + callParentNew('lcm')[413] + '</label>';
    htmlToShow += '<a href="javascript:void(0)" class="ms-2 align-middle icon-arrows-question" tabindex="-1" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-dismiss="click" data-bs-original-title="' + callParentNew('lcm')[435] + '"><span class="material-icons material-icons-style material-icons-3">help_outline</span></a>';
    htmlToShow += '<input required type="text" maxlength="20" value="' + (($("#newViewTabId").is(":visible") || isOpenSmartStepper) ? `a` : ``) + '" class="form-control fldNme dialogInptFld" id="ivirHltName">';
    htmlToShow += '</div>';
    htmlToShow += '<div class="form-group col-md-6 col-sm-6">';
    htmlToShow += '<label for="ivirHighlightType" class="form-label col-form-label pb-1 fw-boldest required">' + callParentNew('lcm')[396] + '</label>';
    htmlToShow += '<a href="javascript:void(0)" class="ms-2 align-middle icon-arrows-question" tabindex="-1" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-dismiss="click" data-bs-original-title="' + callParentNew('lcm')[434] + '"><span class="material-icons material-icons-style material-icons-3">help_outline</span></a>';
    htmlToShow += '<select class="form-select stepperSelect dialogSlctFld" id="ivirHighlightType">';
    htmlToShow += '<option value="">' + callParentNew('lcm')[441] + '</option>';
    htmlToShow += '<option value="row">Row</option>';
    htmlToShow += '<option value="column">Column</option>';
    htmlToShow += '<option value="cell">Cell</option>';
    htmlToShow += ' </select>';
    htmlToShow += ' </div>';
    htmlToShow += ' </div>';
    htmlToShow += '<div class="row">';
    htmlToShow += '<div class="form-group col-md-6 col-sm-6">';
    htmlToShow += '<label for="ivirbgColor" class="form-label col-form-label pb-1 fw-boldest required">' + callParentNew('lcm')[425] + '</label>';
    htmlToShow += '<a href="javascript:void(0)"  class="ms-2 align-middle icon-arrows-question" tabindex="-1" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-dismiss="click" data-bs-original-title="' + callParentNew('lcm')[436] + '" ><span class="material-icons material-icons-style material-icons-3">help_outline</span></a>';
    htmlToShow += '<div class="input-group">';
    htmlToShow += '<input required value="#000000" class="col-md-8 col-sm-8 col-xs-8 form-control colorPicker" id="ivirbgColorValue">';
    htmlToShow += '<input required type="text" class="col-md-3 col-sm-3 col-xs-3 d-none" id="ivirbgColor"></span>';
    htmlToShow += '</div>';
    htmlToShow += '</div>';
    htmlToShow += '<div class="form-group col-md-6 col-sm-6">';
    htmlToShow += '<label for="ivirtxtColor" class="form-label col-form-label pb-1 fw-boldest required">' + callParentNew('lcm')[426] + '</label>';
    htmlToShow += '<a href="javascript:void(0)"  class="ms-2 align-middle icon-arrows-question" tabindex="-1" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-dismiss="click" data-bs-original-title="' + callParentNew('lcm')[437] + '"><span class="material-icons material-icons-style material-icons-3">help_outline</span></a>';
    htmlToShow += '<div class="input-group">';
    htmlToShow += '<input required value="#000000" class="col-md-8 col-sm-8 col-xs-8 form-control colorPicker" id="ivirtxtColorValue">';
    htmlToShow += '<input required type="text" class="col-md-3 col-sm-3 col-xs-3 d-none" id="ivirtxtColor"></span>';
    htmlToShow += '</div>';
    htmlToShow += '</div>';
    htmlToShow += '</div>';
    htmlToShow += '<legend class="mt-4">' + callParentNew('lcm')[424] + '</legend>';
    htmlToShow += '<div class="row">'
    htmlToShow += '<div class="form-group col-md-4 col-sm-4">';
    htmlToShow += '<label for="ivirHighlightCol" class="form-label col-form-label pb-1 fw-boldest required">' + callParentNew('lcm')[420] + '</label>';
    htmlToShow += '<a href="javascript:void(0)" class="ms-2 align-middle icon-arrows-question" tabindex="-1" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-dismiss="click" data-bs-original-title="' + callParentNew('lcm')[438] + '"><span class="material-icons material-icons-style material-icons-3">help_outline</span></a>';
    htmlToShow += ' <select class="form-select stepperSelect dialogSlctFld" id="ivirHighlightCol">';
    htmlToShow += '  <option value="">' + callParentNew('lcm')[441] + '</option>';
    var allColumnsArray = getAllColumns(hiddenColumnIndex, true);
    htmlToShow += allColumnsArray[2];
    htmlToShow += '</select>';
    htmlToShow += '</div>';
    htmlToShow += '<div class="form-group col-md-4 col-sm-4">';
    htmlToShow += '<label for="ivirHighlightCndtn" class="form-label col-form-label pb-1 fw-boldest required">' + callParentNew('lcm')[424] + '</label>';
    htmlToShow += '<a href="javascript:void(0)" class="ms-2 align-middle icon-arrows-question" tabindex="-1" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-dismiss="click" data-bs-original-title="' + callParentNew('lcm')[439] + '"><span class="material-icons material-icons-style material-icons-3">help_outline</span></a>';
    htmlToShow += '<select class="form-select stepperSelect dialogSlctFld" id="ivirHighlightCndtn">';
    htmlToShow += '<option value="">' + callParentNew('lcm')[441] + '</option>';
    htmlToShow += '</select>';
    htmlToShow += '</div>';
    htmlToShow += '<div class="form-group col-md-4 col-sm-4">';
    htmlToShow += '<label for="ivirHltValue" class="form-label col-form-label pb-1 fw-boldest required">' + callParentNew('lcm')[414] + '</label>';
    htmlToShow += '<a href="javascript:void(0)" class="ms-2 align-middle icon-arrows-question" tabindex="-1" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-dismiss="click" data-bs-original-title="' + callParentNew('lcm')[440] + '"><span class="material-icons material-icons-style material-icons-3">help_outline</span></a>';
    htmlToShow += '<input required type="" maxlength="255" class="form-control dialogInptFld" id="ivirHltValue">';
    htmlToShow += '</div>';
    htmlToShow += '</div>';
    htmlToShow += '</div>';
    htmlToShow += '</div>';
    return htmlToShow;
}

/**
 *  Generic function to get the all column in <option> tag in seperated array havind [numericOptions, characterOptions, allOptions]
 * @author ManiKanta + Prashik
 * @Date   2018-11-19T17:41:12+0530
 * @param  {Array}                 exceptionArray           Array of indexes that should be avoided
 * @param  {Boolean}                 dontCheckForHiddenFields If true hidden fields wont come
 * @param  {String}                 calledFrom               From where it called to add some conditions
 * @return {Array}                                          Array of options havind in order [numericOptions, characterOptions, allOptions]
 */
function getAllColumns(exceptionArray, dontCheckForHiddenFields, calledFrom) {
    var allColumns = ivirDataTableApi.columns();
    var numericOptions = "";
    var characterOptions = "";
    var allOptions = "";
    for (var i = 0; i < allColumns[0].length; i++) {
        if (isChkBox == "true" && i == 0)
            continue;
        var columnCaption = $(ivirDataTableApi.columns(allColumns[0][i]).header()).text().trim();
        var colFieldValue = getColumnName(ivirDataTableApi.context[0].aoColumns[i].mData);
        var colType = ivirColumnTypeObj[colFieldValue];
        if ((dontCheckForHiddenFields && $.inArray(i, exceptionArray) === -1) || (!dontCheckForHiddenFields && $.inArray(i, exceptionArray) === -1 && (ivirVisibleColumns.length === 0 || (calledFrom === "group" && groupingCol === i) || $.inArray(i, ivirVisibleColumns) !== -1))) {
            allOptions += ' <option data-index=' + i + ' value="' + colFieldValue + '" data-type="' + colType + '">' + columnCaption + '</option>';
            if (colType == 'n')
                numericOptions += ' <option data-index=' + i + ' value="' + colFieldValue + '" data-type="' + colType + '">' + columnCaption + '</option>';
            else
                characterOptions += ' <option data-index=' + i + ' value="' + colFieldValue + '" data-type="' + colType + '">' + columnCaption + '</option>';
        }
    }

    return [numericOptions, characterOptions, allOptions];
}

/**
 * Will be called when user appling highlight logics (new/old)
 * @author ManiKanta + Avi
 * @Date   2018-11-20T10:24:30+0530
 * @param  {Number}                 indexOfArray  The index of the already applied highlight
 * @param  {Boolean}                isPillChecked Applying or removing
 * @param  {Boolean}                applyThePill  To apply the condtion or to simply add
 * @return {}                               
 */
function ivirHighlightRow(indexOfArray, isPillChecked, applyThePill) {
    //must handle first time click,creating pills,edit pills,showing particular pill

    if (($("#newViewTabId").is(":visible") || isOpenSmartStepper) && typeof ivirMainObj.highlight == "undefined" && typeof indexOfArray != "undefined") {
        indexOfArray = undefined;
    }

    applyThePill = applyThePill || false;
    var rows = [];
    var cells = [];
    var cols = [];
    var totalRows = ivirDataTableApi.rows();
    var rowsData = totalRows.data();
    if (applyThePill === false) {
        var name = $("#ivirHltName").val();
        var ivirHighlightType = $("#ivirHighlightType").val();
        var ivirbgColor = $("#ivirbgColorValue").val();
        var ivirtxtColor = $("#ivirtxtColorValue").val();
        var colIndex = $("#ivirHighlightCol").find('option:selected').data('index');
        var colvalue = getPropertyAccess($("#ivirHighlightCol").find('option:selected').val());
        var ivirHighlightCndtn = $("#ivirHighlightCndtn").val();
        var ivirHltValue = $("#ivirHltValue").val();
        var colType = $("#ivirHighlightCol").find('option:selected').data('type');
    } else {
        var ivirMainHltObj = ivirMainObj.highlight[indexOfArray];
        var name = ivirMainHltObj.n;
        var ivirHighlightType = ivirMainHltObj.t;
        var ivirbgColor = ivirMainHltObj.bc;
        var ivirtxtColor = ivirMainHltObj.tc;
        var colIndex = ivirMainHltObj.cl;
        var colvalue = getPropertyAccess(ivirDataTableApi.context[0].aoColumns[colIndex].mData);
        var ivirHighlightCndtn = ivirMainHltObj.cn;
        var ivirHltValue = ivirMainHltObj.v;
        var colType = ivirMainHltObj.colType;
    }
    var j = colIndex;
    var isFirstTime = false;
    var limitExceeded = false;
    var indexOfHighlightArray = "";

    //must have some validations~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (ivirHighlightCndtn == 'regex') {
        var regexExp = ivirHltValue.replace(/\\/g, "\\");
        regexExp = new RegExp(regexExp, "i")
    }


    if (indexOfArray === undefined) {
        //means first time or new one
        if (jQuery.isEmptyObject(ivirMainObj)) {
            var hilghtArr = ivirMainObj.highlight = [];
            isFirstTime = true;
            indexOfHighlightArray = 0;
        } else if (ivirMainObj.highlight === undefined) {
            var hilghtArr = ivirMainObj.highlight = [];
            indexOfHighlightArray = 0;
        } else {
            var hilghtArr = ivirMainObj.highlight;
            isFirstTime = false;
            if (hilghtArr.length >= maxNoOfPills)
                limitExceeded = true;
            indexOfHighlightArray = hilghtArr.length;
        }

        var hilghtObj = new Object();
    } else {
        if (!($("#newViewTabId").is(":visible") || isOpenSmartStepper)) {
            clearIvirHighlight(indexOfArray);
            var hilghtObj = new Object();
        } else {
            if (($("#newViewTabId").is(":visible") || isOpenSmartStepper) && typeof ivirMainObj.highlight == "undefined") {
                var hilghtObj = new Object();
            } else {
                var hilghtObj = ivirMainObj.highlight[indexOfArray];
            }
        }
        indexOfHighlightArray = indexOfArray;
    }

    if (!limitExceeded) {
        hilghtObj.n = name;
        hilghtObj.t = ivirHighlightType;
        hilghtObj.bc = ivirbgColor;
        hilghtObj.tc = ivirtxtColor;
        hilghtObj.cl = colIndex;
        hilghtObj.cn = ivirHighlightCndtn;
        hilghtObj.v = ivirHltValue;
        hilghtObj.colType = colType;
        if (indexOfArray === undefined) {
            hilghtArr.push(hilghtObj);
            if (!($("#newViewTabId").is(":visible") || isOpenSmartStepper)) {
                if (isFirstTime || $("#ivirFilteredAccordion").length == 0) {
                    if ($("#ivirFilteredAccordion").length == 0)
                        createPills("all", "first");
                    else
                        createPills("all", "last");
                } else if ($("#ivirFilteredAccordion").length > 0) {
                    upateThePills("highlight", indexOfHighlightArray, name);
                }
            }
        } else {
            //highlight0pillCB
            if (!($("#newViewTabId").is(":visible") || isOpenSmartStepper)) {
                if (isPillChecked)
                    $("#highlightpillCB" + indexOfArray).prop('checked', true).attr('checked', 'checked');;
                $("#highlightpillCB" + indexOfArray).parent().next().find('.ivirCndtnName').attr('title', "Edit " + name).text(name);
            }
        }
    } else {
        showAlertDialog("warning", appGlobalVarsObject.lcm[23]);
    }

    if (!($("#newViewTabId").is(":visible") || isOpenSmartStepper)) {
        if ((indexOfArray === undefined) || isPillChecked) {

            for (var i = 0; i < totalRows[0].length; i++) {
                //totalRows[0][i](if sorting happrend i wont be the row num) is the row and j is column                
                var presentRowData = rowsData[i];
                (!isNaN(parseInt(colvalue))) ? presentRowData = presentRowData[Object.keys(presentRowData)[colvalue]] : graphCol = presentRowData[colvalue]
                presentRowData = typeof presentRowData[colvalue] == "object" && presentRowData[colvalue] != null ? presentRowData[colvalue].display : (presentRowData[colvalue] != null ? presentRowData[colvalue] : "");

                if (anchorRegexPatter.test(presentRowData))
                    presentRowData = $(presentRowData).text();
                presentRowData = presentRowData.replace(",", "");
                ivirHltValue = ivirHltValue.replace(",", "");
                if (ivirHighlightCndtn == "equalto") {
                    if (colType === "d") {
                        var momentObj = moment(ivirHltValue, 'YYYY-MM-DD');
                        var momentString = momentObj.format('DD/MM/YYYY');
                        if (momentString === (typeof rowsData[i][colvalue] == "object" && rowsData[i][colvalue] != null ? rowsData[i][colvalue].display : (rowsData[i][colvalue] != null ? rowsData[i][colvalue] : ""))) {
                            pushValues(totalRows[0][i], colvalue);
                        }
                    } else if (ivirHltValue.toLowerCase() == presentRowData.toLowerCase()) {
                        pushValues(totalRows[0][i], j);
                    }
                } else if (ivirHighlightCndtn == "contains") {
                    if (presentRowData.toLowerCase().indexOf(ivirHltValue.toLowerCase()) != -1) {
                        pushValues(totalRows[0][i], j);
                    }
                } else if (ivirHighlightCndtn == "notcontains") {
                    if (presentRowData.toLowerCase().indexOf(ivirHltValue.toLowerCase()) == -1) {
                        pushValues(totalRows[0][i], j);
                    }
                } else if (ivirHighlightCndtn == "notequalto") {
                    if (colType === "d") {
                        var momentObj = moment(ivirHltValue, 'YYYY-MM-DD');
                        var momentString = momentObj.format('DD/MM/YYYY');
                        if (momentString !== presentRowData) {
                            pushValues(totalRows[0][i], j);
                        }
                    } else if (ivirHltValue.toLowerCase() != presentRowData.toLowerCase()) {
                        pushValues(totalRows[0][i], j);
                    }
                } else if (ivirHighlightCndtn == "lessthan") {
                    if (colType === "d") {
                        var momentObj = moment(ivirHltValue, 'YYYY-MM-DD');
                        var momentObj1 = moment(presentRowData, "DD/MM/YYYY");
                        if (momentObj1 < momentObj) {
                            pushValues(totalRows[0][i], j);
                        }
                    } else if (parseInt(presentRowData, 10) < parseInt(ivirHltValue, 10)) {
                        pushValues(totalRows[0][i], j);
                    }
                } else if (ivirHighlightCndtn == "lessthanequalto") {
                    if (colType === "d") {
                        var momentObj = moment(ivirHltValue, 'YYYY-MM-DD');
                        var momentObj1 = moment(presentRowData, "DD/MM/YYYY");
                        if (momentObj1 <= momentObj) {
                            pushValues(totalRows[0][i], j);
                        }
                    } else if (parseInt(presentRowData, 10) <= parseInt(ivirHltValue, 10)) {
                        pushValues(totalRows[0][i], j);
                    }
                } else if (ivirHighlightCndtn == "greaterthan") {
                    if (colType === "d") {
                        var momentObj = moment(ivirHltValue, 'YYYY-MM-DD');
                        var momentObj1 = moment(presentRowData, "DD/MM/YYYY");
                        if (momentObj1 > momentObj) {
                            pushValues(totalRows[0][i], j);
                        }
                    } else if (parseInt(presentRowData, 10) > parseInt(ivirHltValue, 10)) {
                        pushValues(totalRows[0][i], j);
                    }
                } else if (ivirHighlightCndtn == "greaterthanequalto") {
                    if (colType === "d") {
                        var momentObj = moment(ivirHltValue, 'YYYY-MM-DD');
                        var momentObj1 = moment(presentRowData, "DD/MM/YYYY");
                        if (momentObj1 >= momentObj) {
                            pushValues(totalRows[0][i], j);
                        }
                    } else if (parseInt(presentRowData, 10) >= parseInt(ivirHltValue, 10)) {
                        pushValues(totalRows[0][i], j);
                    }
                } else if (ivirHighlightCndtn == "regex") {
                    if (regexExp.test(presentRowData)) {
                        pushValues(totalRows[0][i], j);
                    }
                }
            }

            if (ivirHighlightType == 'row') {
                for (var k = 0; k < rows.length; k++) {
                    $(ivirDataTableApi.row(rows[k]).node()).addClass('ivirCustomHighlight highlight' + indexOfHighlightArray).css({
                        "background-color": ivirbgColor,
                        "color": ivirtxtColor
                    });

                }
            } else if (ivirHighlightType == 'column') {
                var allCols = ivirDataTableApi.column(colIndex).nodes();
                if (jQuery.inArray(colIndex, cols) !== -1) {
                    $(ivirDataTableApi.columns(colIndex).header()).addClass('ivirCustomHighlight highlight' + indexOfHighlightArray)
                    for (var i = 0; i < allCols.length; i++) {
                        $(allCols[i]).addClass('ivirCustomHighlightCell').css({
                            "background-color": ivirbgColor,
                            "color": ivirtxtColor
                        });
                    }
                }

            } else if (ivirHighlightType == 'cell') {
                for (var i = 0; i < cells.length; i++) {
                    $(ivirDataTableApi.cell(cells[i][0], cells[i][1]).node()).addClass('ivirCustomHighlight highlight' + indexOfHighlightArray).css({
                        "background-color": ivirbgColor,
                        "color": ivirtxtColor
                    });

                }

            }

            function pushValues(i, j) {
                if (jQuery.inArray(i, rows) == -1)
                    rows.push(i);
                if (jQuery.inArray(j, cols) == -1)
                    cols.push(j);
                cells.push([i, j]);
            }
        }
    } else if (ivirMainObj.highlight && ivirMainObj.highlight.length > 0) {
        $("#newViewhighlight").val(JSON.stringify(ivirMainObj.highlight[0]));
    }
    setSmartViewHeight();
    return true;

}

/**
 * Clear the previous highlights based on index
 * @author ManiKanta
 * @Date   2018-11-20T10:26:40+0530
 * @param  {String}                 index If index is 'all' then it will clear all the highlights
 * @return {}                       
 */
function clearIvirHighlight(index) {
    // initial values need to be given
    if (index == "all") {
        if (ivirDataTableApi.columns('.ivirCustomHighlight')[0].length > 0) {
            var Cols = ivirDataTableApi.columns('.ivirCustomHighlight');
            var allCols = Cols.nodes();
            $(Cols).removeClass('ivirCustomHighlight').css({
                "background-color": "inherit",
                "color": "inherit"
            });
            for (var i = 0; i < allCols.length; i++) {
                $(allCols[i]).removeClass('ivirCustomHighlightCell').css({
                    "background-color": "inherit",
                    "color": "inherit"
                });
            }
        }
        if (ivirDataTableApi.cells('.ivirCustomHighlight')[0].length > 0) {
            $(ivirDataTableApi.cells('.ivirCustomHighlight').nodes()).removeClass('ivirCustomHighlight').css({
                "background-color": "inherit",
                "color": "inherit"
            });
        }
        if (ivirDataTableApi.rows('.ivirCustomHighlight')[0].length > 0) {
            $(ivirDataTableApi.rows('.ivirCustomHighlight').nodes()).removeClass('ivirCustomHighlight').css({
                "background-color": "inherit",
                "color": "inherit"
            });
        }
    } else if (index !== undefined) {
        // highlight
        if (ivirMainObj.highlight && ivirMainObj.highlight.length > 0) {
            var typeSelected = ivirMainObj['highlight'][index].t;
            if (typeSelected == 'cell') {
                if (ivirDataTableApi.cells('.ivirCustomHighlight.highlight' + index)[0].length > 0) {
                    $(ivirDataTableApi.cells('.ivirCustomHighlight.highlight' + index).nodes()).removeClass('ivirCustomHighlight highlight' + index).css({
                        "background-color": "inherit",
                        "color": "inherit"
                    });
                }
            } else if (typeSelected == 'column') {
                if (ivirDataTableApi.columns('.ivirCustomHighlight.highlight' + index)[0].length > 0) {
                    var Cols = ivirDataTableApi.columns('.ivirCustomHighlight.highlight' + index);
                    var allCols = Cols.nodes();
                    $(Cols.header()).removeClass('ivirCustomHighlight highlight' + index)
                    for (var i = 0; i < allCols.length; i++) {
                        $(allCols[i]).removeClass('ivirCustomHighlightCell').css({
                            "background-color": "inherit",
                            "color": "inherit"
                        });
                    }

                }

            } else if (typeSelected == 'row') {
                if (ivirDataTableApi.rows('.ivirCustomHighlight.highlight' + index)[0].length > 0) {
                    $(ivirDataTableApi.rows('.ivirCustomHighlight.highlight' + index).nodes()).removeClass('ivirCustomHighlight highlight' + index).css({
                        "background-color": "inherit",
                        "color": "inherit"
                    });
                }
            }
        }
    }

    if (fixedColumnsObj != "")
        $(".DTFC_LeftBodyWrapper .ivirCustomHighlight,.DTFC_LeftBodyWrapper .ivirCustomHighlightCell").removeClass("ivirCustomHighlight").css({
            "background-color": "",
            "color": ""
        });
}

/**
 * To create all the condtions in ivirmain object (Except chart - since chart have different function createChartPills/upateTheChartPills)
 * @author ManiKanta + Prashik
 * @Date   2018-11-20T10:30:05+0530
 * @param  {String}                 type            Particular type to create or all
 * @param  {String}                 pillToHighlight To chechk the first/last/none by default
 * @return {}                                 
 */
function createPills(type, pillToHighlight) {
    if (!ivirMainObj.highlight && !ivirMainObj.group && !ivirMainObj.filter)
        return

    // if (requestJSON && iviewButtonStyle != "old") {
        maxNoOfPills = 1;
    // }

    var pillsArray = "";
    var allPillsArray = "";
    var allPillsType = "";
    var curType = "";
    var icons = "";
    allPillsType = ['highlight', 'group', 'filter'];

    icons = {
        highlight: "highlight",
        group: "table_rows",
        chart: "pie_chart",
        filter: "filter_alt"
    }
    var pillsHtml = "";
    pillsHtml += '<div id="ivirFilteredAccordion">';
    pillsHtml += '<div id="ivirPillsWrapper">';
    pillsHtml += '<span tabindex="0" onclick="toggleIvirPills();" id="ivirCndtnToggleBtn" class="icon-arrows-keyboard-right"></span>';
    pillsHtml += '<div id="ivirAllCndtns">';
    //need to loop
    for (var i = 0; i < allPillsType.length; i++) {
        var typeOfPill = allPillsType[i];
        if (ivirMainObj[typeOfPill]) {
            pillsHtml += '<span id="ivir' + typeOfPill + 'CndtnPill" class="pillMainWrapper">';
            pillsHtml += '<span title="' + curType + '" class="material-icons material-icons-style ivirCndtnIcon">' + icons[typeOfPill] + '</span>';
            pillsHtml += '<span class="h4 text-gray-500 my-2 ivirCndtnName">' + typeOfPill + ' <span class="label ivirCndtnLabel">' + ivirMainObj[typeOfPill].length + '</span></span>';
            pillsHtml += '</span>';
        }
    }

    //need to loop-end

    pillsHtml += '</div>';
    pillsHtml += '<div id="ivirAllCndtnPills" class="d-none">';


    //need to loop
    for (var i = 0; i < allPillsType.length; i++) {
        var pillsArray = ivirMainObj[allPillsType[i]];
        if (pillsArray) {
            if (pillsArray.length > maxNoOfPills) {
                try {
                    pillsArray = pillsArray.sort((a, b) => { if (a.checked === b.checked) { return 0; } if (a.checked) { return -1; } if (b.checked) { return 1; } });
                } catch (ex) { }
                pillsArray.splice(maxNoOfPills);
            }
            for (var j = 0; j < pillsArray.length; j++) {
                var curType = allPillsType[i];
                pillsHtml += '<div id="ivir' + curType + j + 'CndtnPill" data-pill-type="' + curType + '" class="d-flex flex-row-auto flex-center w-auto menu-item px-3">';
                pillsHtml += '<span class="form-check form-check-custom form-check-solid menu-link px-3 justify-content-between materialCheckBox pillMainWrapper">';

                if (pillToHighlight == "first" && j == 0)
                    pillsHtml += '<input id="' + curType + 'pillCB' + j + '" checked data-index=' + j + ' data-type="' + curType + '" class="form-check-input p-4 filled-in ivirFilterCheckBox" type="checkbox" value="" />';
                else if (pillToHighlight == "last" && j == (pillsArray[j].length - 1))
                    pillsHtml += '<input id="' + curType + 'pillCB' + j + '" checked data-index=' + j + ' data-type="' + curType + '" class="form-check-input p-4 filled-in ivirFilterCheckBox" type="checkbox" value="" />';
                else
                    pillsHtml += '<input id="' + curType + 'pillCB' + j + '" data-index=' + j + ' data-type="' + curType + '" class="form-check-input p-4 filled-in ivirFilterCheckBox" type="checkbox" value="" />';

                pillsHtml += '<a href="javascript:void(0)" title="Edit ' + pillsArray[j].n + '" onclick="editThePill(\'' + curType + '\',' + j + ')" class="h4 text-gray-500 my-2 ivirCndtnName">' + pillsArray[j].n + '</a>';
                pillsHtml += '<button title="Remove" type="button" onclick="deleteThePill(\'' + curType + '\',' + j + ')" class="btn btn-sm btn-icon btn-active-light-primary shadow-sm deletePillBtn"><span class="material-icons material-icons-style pillRemove">clear</span></button>';
                pillsHtml += '</span>';
                pillsHtml += '</div>';
            }
        }
    }

    //need to loop-end
    pillsHtml += '</div></div></div>';

    $("#pillsWrapper").html(pillsHtml);
    if (requestJSON) {
        var filterCount = 0;
        $('#ivirAllCndtnPillsList').children().remove();
        $.each($('#ivirAllCndtnPills').children('div'), function (idx, ele) {
            filterCount++;
            $('#ivirAllCndtnPillsList').append($(ele).detach());
        });
        $("#ivirAllCndtnPillsCount").text(filterCount);
        $("#ivirAllCndtnPillsDiv").css('display', 'inline-block');
        $("#ivirAllCndtnPillsDiv").hide();
        $("#pillsWrapper").hide();
        setSmartViewHeight();
    }

    else
        $("#pillsWrapper").show('slow');

}

/**
 * To update the condtions when user added new or anything update(Not for chart)
 * @author ManiKanta + Prashik
 * @Date   2018-11-20T10:32:36+0530
 * @param  {String}                 type highlihgt or group
 * @param  {Number}                 j    Index need to update
 * @param  {String}                 name New condition name to show
 * @return {}                      
 */
function upateThePills(type, j, name) {
    var pillsHtml = "";
    var icons = "";
    var curType = type;
    icons = {
        highlight: "highlight",
        group: "table_rows",
        chart: "pie_chart",
        filter: "filter_alt"
    }
    pillsHtml += '<div id="ivir' + curType + j + 'CndtnPill" data-pill-type="' + curType + '" class="d-flex flex-row-auto flex-center w-auto menu-item px-3">';
    pillsHtml += '<span class="form-check form-check-custom form-check-solid menu-link px-3 justify-content-between materialCheckBox pillMainWrapper">';
    pillsHtml += '<input id="' + curType + 'pillCB' + j + '" checked data-index=' + j + ' data-type="' + curType + '" class="form-check-input p-4 filled-in ivirFilterCheckBox" type="checkbox" value="" />';
    pillsHtml += '<a href="javascript:void(0)" title="Edit ' + name + '" onclick="editThePill(\'' + curType + '\',' + j + ')" class="h4 text-gray-500 my-2 ivirCndtnName">' + name + '</a>';
    pillsHtml += '<button type="button" onclick="deleteThePill(\'' + curType + '\',' + j + ')" title="Remove" class="btn btn-sm btn-icon btn-active-light-primary shadow-sm deletePillBtn"><span class="material-icons material-icons-style pillRemove">clear</span></button>';
    pillsHtml += '</span>';
    pillsHtml += '</div>';

    if (requestJSON) {
        $("#ivirAllCndtnPillsList").append(pillsHtml);
        $('#ivirAllCndtnPillsCount').text($('#ivirAllCndtnPillsList').children('div').length)
    }
    else {
        $("#ivirAllCndtnPills").append(pillsHtml);
    }

    if ($("#ivir" + curType + "CndtnPill").length == 0) {
        var panelHdHtml = "";
        panelHdHtml += '<span id="ivir' + curType + 'CndtnPill" class="pillMainWrapper" class="d-flex flex-row-auto flex-center w-auto menu-item px-3">';
        panelHdHtml += '<span title="' + curType + '" class="material-icons material-icons-style shadow-sm rounded-3 p-2 d-none ivirCndtnIcon">' + icons[curType] + '</span>';
        panelHdHtml += '<span class="h4 text-gray-500 my-2 ivirCndtnName">' + curType + ' <span class="label ivirCndtnLabel">' + ivirMainObj[curType].length + '</span></span>';
        panelHdHtml += '</span>';
        $("#ivirAllCndtns").append(panelHdHtml);
    } else {
        $("#ivir" + curType + "CndtnPill .ivirCndtnLabel").text(ivirMainObj[type].length);
    }
}

/**
 * Similar to create pills usedj to create chart conditions
 * @author ManiKanta
 * @Date   2018-11-20T10:34:01+0530
 * @return {}                 
 */
function createChartPills() {
    var pillsHtml = "";
    var icons = "";
    var chartArray = ivirMainObj.chart;
    var curType = 'chart';
    // if (requestJSON && iviewButtonStyle != "old") {
        maxNoOfPills = 5;
    // }
    icons = {
        highlight: "highlight",
        group: "table_rows",
        chart: "pie_chart"
    }

    if (typeof chartArray.length != "undefined" && chartArray.length > maxNoOfPills) {
        chartArray.splice(maxNoOfPills);
    }
    for (var j = 0; j < chartArray.length; j++) {
        var currentChart = chartArray[j];

        pillsHtml += '<div id="ivir' + curType + j + 'CndtnPill" class="d-flex flex-row-auto flex-center w-auto menu-item px-3 chartPills">';
        pillsHtml += '<span class="form-check form-check-custom form-check-solid menu-link px-3 justify-content-between materialCheckBox pillMainWrapper">';
        if (((requestJSON) && (typeof currentChart.checked == "undefined" || currentChart.checked)) || (!(requestJSON) && j == 0)) {
            pillsHtml += '<input checked id="' + curType + 'pillCB' + j + '" data-index=' + j + ' data-type="' + curType + '" class="form-check-input p-4 filled-in ivirChartCheckBox" type="checkbox" value="" />';

            $("#ivirChartWrapper #ivirChart" + j).show();

            if (typeof currentChart.checked == "undefined") {
                currentChart.checked = true;
            }
        }
        else {
            pillsHtml += '<input id="' + curType + 'pillCB' + j + '" data-index=' + j + ' data-type="' + curType + '" class="form-check-input p-4 filled-in ivirChartCheckBox" type="checkbox" value="" />';

            $("#ivirChartWrapper #ivirChart" + j).hide();
        }
        pillsHtml += '<a href="javascript:void(0)" title="Edit ' + currentChart.n + '" onclick="editThePill(\'' + curType + '\',' + j + ')" class="h4 text-gray-500 my-2 ivirCndtnName">' + currentChart.n + '</a>';
        pillsHtml += '<button type="button" onclick="deleteThePill(\'' + curType + '\',' + j + ')" title="Remove" class="btn btn-sm btn-icon btn-active-light-primary shadow-sm deletePillBtn"><span class="material-icons material-icons-style pillRemove">clear</span></button>';
        pillsHtml += '</span>';
        pillsHtml += '</div>';
    }

    $("#ivirChartPills").addClass('pillsAdded').html(pillsHtml);
    if (requestJSON) {
        $('#ivirChartPillsList').children().remove();
        $.each($('#ivirChartPills').children('div'), function (idx, ele) {
            $('#ivirChartPillsList').append($(ele).detach());
        });
        $('#ivirChartPillsCount').text($('#ivirChartPillsList').children('div').length)
        $("#ivirAllCndtnPillsDiv").hide();
        $("#ivirChartPills").hide();
    }

    else
        $("#ivirChartPills").show('slow');

}

/**
 * Similar to updatepills used to update the chart conditions
 * @author ManiKanta
 * @Date   2018-11-20T10:34:26+0530
 * @param  {Number}                 j    New index to add
 * @param  {String}                 name New name to show
 * @return {}                      
 */
function upateTheChartPills(j, name) {
    var pillsHtml = "";
    var icons = "";
    var curType = 'chart';
    icons = {
        highlight: "highlight",
        group: "table_rows",
        chart: "pie_chart"
    }


    pillsHtml += '<div id="ivir' + curType + j + 'CndtnPill" class="d-flex flex-row-auto flex-center w-auto menu-item px-3 chartPills">';
    pillsHtml += '<span class="form-check form-check-custom form-check-solid menu-link px-3 justify-content-between materialCheckBox">';
    pillsHtml += '<input checked id="' + curType + 'pillCB' + j + '" data-index=' + j + ' data-type="' + curType + '" class="form-check-input p-4 filled-in ivirChartCheckBox" type="checkbox" value="" />';
    pillsHtml += '<a href="javascript:void(0)" title="Edit ' + name + '" onclick="editThePill(\'' + curType + '\',' + j + ')" class="h4 text-gray-500 my-2 ivirCndtnName">' + name + '</a>';
    pillsHtml += '<button type="button" onclick="deleteThePill(\'' + curType + '\',' + j + ')" title="Remove" class="btn btn-sm btn-icon btn-active-light-primary shadow-sm deletePillBtn"><span class="material-icons material-icons-style pillRemove">clear</span></button>';
    pillsHtml += '</span>';
    pillsHtml += '</div>';

    if (!(requestJSON)) {//temp
        $("#ivirChartWrapper .chartWrapper").hide(); //chartWrapper
    }
    $("#ivirChartWrapper #ivirChart" + j).show();

    if (requestJSON) {
        $("#ivirChartPillsList").append(pillsHtml);
        $("#ivirChartPillsdiv").show();
        $('#ivirChartPillsCount').text($('#ivirChartPillsList').children('div').length)
    }
    else {
        $("#ivirChartPills").show().append(pillsHtml);
    }
}

/**
 * Show/Hide of the highlight/group condtions when user click on show hide button
 * @author ManiKanta + Prashik
 * @Date   2018-11-20T10:36:46+0530
 * @return {}                 
 */
function toggleIvirPills() {
    var cndtns = $("#ivirAllCndtns");
    var cndtnsPills = $("#ivirAllCndtnPills");
    if (cndtns.is(":visible")) {
        $("#ivirCndtnToggleBtn").removeClass('icon-arrows-keyboard-right').addClass('icon-arrows-keyboard-down');
        cndtns.hide();
        cndtnsPills.addClass('open');

    } else {
        $("#ivirCndtnToggleBtn").removeClass('icon-arrows-keyboard-down').addClass('icon-arrows-keyboard-right');
        cndtnsPills.removeClass('open');
        cndtns.show();
    }
    setSmartViewHeight();
}

/** When user checking existing chart conditions */
$(document).on('change', '.ivirChartCheckBox', function (event) {
    var clickedElement = $(this);
    var index = clickedElement.data('index');
    var id = clickedElement.attr('id');
    try {
        // if (requestJSON && iviewButtonStyle != "old") {
            ivirMainObj.chart[index].checked = clickedElement.is(':checked');
        // }
    } catch (ex) { }
    if (clickedElement.is(':checked')) {
        // if (requestJSON && iviewButtonStyle != "old") {
            clickedElement.attr('checked', 'checked');
        // }
        if (!checkForPillDependentFlds('chart', index)) {
            clickedElement.prop('checked', false)//temp
            clickedElement.removeAttr('checked');//temp
            return false;
        }
        if (!(requestJSON)) {//temp
            $(".ivirChartCheckBox").not('#' + id).prop('checked', false).removeAttr('checked');
            $("#ivirChartWrapper .chartWrapper").hide();//chartWrapper //temp
        }

        $("#ivirChartWrapper #ivirChart" + index).show();
        ivirCreateChart(index, true, true);
    } else {
        // if (requestJSON && iviewButtonStyle != "old") {
            clickedElement.removeAttr('checked');
        // }
        if (!(requestJSON)) {
            clickedElement.prop('checked', true).attr('checked', 'checked');
        } else {
            $("#ivirChartWrapper #ivirChart" + index).hide();
        }
    }
    adjustChartBasedWrapperHeight();

    if (!isChartCreationOnLoad) {
        $("[data-dropdown-value=save]:eq(0)").click();
    }
});

/** When user checking existing highlight/group conditions */
$(document).on('change', '.ivirFilterCheckBox', function (event) {
    var clickedElement = $(this);
    var type = clickedElement.data('type');
    if (clickedElement.is(':checked')) {

        if (type == "group") {
            if (!checkForPillDependentFlds('group', clickedElement.data('index'))) {
                clickedElement.prop('checked', false)
                clickedElement.removeAttr('checked');
                return false;
            }

            $("#chartActionLi").addClass("subHeader");
        } else if (type == "filter") {
            advFiltersObjectToApply = ivirMainObj.filter[clickedElement.data("index")].data;
            ivirDataTableApi.draw();
            // if (requestJSON && iviewButtonStyle != "old") {
                setFilterInfo();
            // }
        }
        clickedElement.attr('checked', 'checked');
        applyThePill(type, clickedElement.data('index'));
    } else {
        clickedElement.removeAttr('checked');
        if (type == 'highlight')
            clearIvirHighlight(clickedElement.data('index'));
        else if (type == 'group') {
            var index = clickedElement.data('index');
            var grandtotalArray = ivirMainObj[type][index].g;
            if (grandtotalArray) {
                for (var i = 0; i < grandtotalArray.length; i++) {
                    var idx = allGrandTotal.indexOf(grandtotalArray[i]);
                    allGrandTotal.splice(idx, 1);
                }
            }
            if (ivirVisibleColumns.length > 0)
                ivirVisibleColumns.push(groupingCol);
            createIvirDataTable("clear", index, "", allGrandTotal);

            $("#chartActionLi").removeClass("subHeader");
        } else if (type == "filter") {
            advFiltersObjectToApply = { somedummyfilterjsobjectkey: "dummy" };
            ivirDataTableApi.draw();
            setFilterInfo();
        }
    }

});

/**
 * To apply the existing conditions(highlight/group)
 * @author ManiKanta + Prashik
 * @Date   2018-11-20T10:38:35+0530
 * @param  {String}                 type  Condtions type highlihgt/group
 * @param  {Number}                 index index number of the condition to apply
 * @return {[type]}                       [description]
 */
function applyThePill(type, index) {
    if (type == "highlight")
        ivirHighlightRow(index, true, true);
    else if (type == "group") {
        $("[id^='grouppillCB']").not("#grouppillCB" + index).prop('checked', false).removeAttr('checked');
        var grndTotalArray = ivirMainObj[type][index].g;
        if (grndTotalArray) {
            for (var i = 0; i < grndTotalArray.length; i++) {
                if ($.inArray(grndTotalArray[i], allGrandTotal) === -1)
                    allGrandTotal.push(grndTotalArray[i]);
            }
        }
        createIvirDataTable("groupApply", index, "", allGrandTotal);
    } else if (type == "filter") {
        $("[id^='filterpillCB']").not("#filterpillCB" + index).prop('checked', false).removeAttr('checked');
    }
}

/**
 * Will be called when a condition is edited
 * @author ManiKanta + Prashik
 * @Date   2018-11-20T11:14:52+0530
 * @param  {String}                  type  highlight/group/chart
 * @param  {Number}                 index Index of the condition to edit
 * @return {}                       
 */
function editThePill(type, index) {
    var showValueOption = [type, index];
    if (type == 'highlight') {
        var htmlToShow = getHighlightHtml(type, index, true);
    } else if (type == 'group') {
    } else if (type == 'chart') {
        var chartParam = $("#" + type + "pillCB" + index).is(":checked");
        smartCharts(chartParam, showValueOption, true);
    } else if (type == 'filter') {
        ivirMoreFilters(index);
    }
}

/**
 * will be called to delete the conditions
 * @author ManiKanta + Prashik
 * @Date   2018-11-20T11:16:55+0530
 * @param  {String}                 type  highlihgt/group/chart
 * @param  {index}                  index index of the condition to delete
 * @return {}                       
 */
function deleteThePill(type, index, isClearAll = false) {
    if (type == 'highlight')
        clearIvirHighlight(index);
    else if (type == 'group') {
        if (ivirMainObj.group && ivirMainObj.group.length > 0) {
            var grandtotalArray = ivirMainObj[type][index].g;
            if (grandtotalArray) {
                for (var i = 0; i < grandtotalArray.length; i++) {
                    var idx = allGrandTotal.indexOf(grandtotalArray[i]);
                    allGrandTotal.splice(idx, 1);
                }
            }
        }
        if (ivirVisibleColumns.length > 0)
            ivirVisibleColumns.push(groupingCol);
        if ($("#" + type + "pillCB" + index).is(":checked"))//grouppillCB0
            createIvirDataTable("clear", index, "", allGrandTotal);
    }
    else if (type == 'chart') {
        var isPillChecked = false;
        if ($("#chartpillCB" + index).is(':checked'))
            isPillChecked = true;

        $("#ivirChart" + index).remove();
    }
    // ivirgroup0CndtnPill
    $("#ivir" + type + index + "CndtnPill").remove();


    reArrangeIndexes(type, index);
    var pillsArray = ivirMainObj[type];
    if (pillsArray) {
        var removedPill = pillsArray.splice(index, 1);
        if (type != "chart") {
            if (pillsArray.length == 0) {
                delete ivirMainObj[type];
                $("#ivir" + type + "CndtnPill").remove();
            } else {
                $("#ivir" + type + "CndtnPill .ivirCndtnLabel").text(ivirMainObj[type].length);
            }

            var filterPills = $("[data-pill-type='filter']");
            //when user deletes a plill and if any other filter pill exists & it was selected then display default grid data as selected filter 
            if (filterPills.length && filterPills.find(".ivirFilterCheckBox").is(":checked")) {
                try {
                    advFiltersObjectToApply = ivirMainObj.filter[filterPills.find(".ivirFilterCheckBox:checked").data("index")].data;
                } catch (ex) {
                    advFiltersObjectToApply = { somedummyfilterjsobjectkey: "dummy" };
                }
            }
            else {
                advFiltersObjectToApply = { somedummyfilterjsobjectkey: "dummy" };
            }
            ivirDataTableApi.draw();
            setFilterInfo();
            if ($("#ivirAllCndtns").html() == "") {
                $("#pillsWrapper").html("");
            }
            // if (requestJSON && iviewButtonStyle != "old") {
                if ($('#ivirAllCndtnPillsDiv .popover-content').children('div').length == 0) {
                    $('#lnkallCndtnPill').popover('hide');
                    $('#ivirAllCndtnPillsDiv').hide();
                }
                else {
                    $('#lnkallCndtnPill').popover('reposition');

                }
            // }
        } else {
            if (!isClearAll && removedPill && removedPill.length == 1 && requestJSON && ivirMainObj.key == "charts") {
                deleteCommonChart(removedPill[0]);
            }
            if (pillsArray.length == 0) {
                toggleGridView("grid");
                $("#ivirCButtonsWrapper").hide();
                $("#pinnedivirCButtonsWrapper").hide();
                delete ivirMainObj[type];
            } else if (isPillChecked) {
                $("#chartpillCB0").prop('checked', true).attr('checked', 'checked');
                $("#ivirChart0").show();
            }
            // if (requestJSON && iviewButtonStyle != "old") {
            // }
            if ($('#ivirChartPillsDiv .popover-content').children('div').length == 0) {
                $('#lnkChartPill').popover('hide');
                $('#ivirChartPillsDiv').hide();
            }
            else {
                $('#lnkChartPill').popover('reposition');

            }
            adjustChartBasedWrapperHeight();
        }
    } else {
        advFiltersObjectToApply = { somedummyfilterjsobjectkey: "dummy" };
    }

    if (type == "chart" && isClearAll == false) {
        $("[data-dropdown-value=save]:eq(0)").click();
    }
}
$(function () {
    $.fn.popover.Constructor.prototype.reposition = function () {
        var $tip = this.tip()
        var autoPlace = true

        var placement = typeof this.options.placement === 'function' ? this.options.placement.call(this, $tip[0], this.$element[0]) : this.options.placement

        var pos = this.getPosition()
        var actualWidth = $tip[0].offsetWidth
        var actualHeight = $tip[0].offsetHeight

        if (autoPlace) {
            var orgPlacement = placement
            var viewportDim = this.getPosition(this.$viewport)

            placement = placement === 'bottom' &&
                pos.bottom + actualHeight > viewportDim.bottom ? 'top' : placement === 'top' &&
                    pos.top - actualHeight < viewportDim.top ? 'bottom' : placement === 'right' &&
                        pos.right + actualWidth > viewportDim.width ? 'left' : placement === 'left' &&
                            pos.left - actualWidth < viewportDim.left ? 'right' : placement

            $tip
                .removeClass(orgPlacement)
                .addClass(placement)
        }

        var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

        this.applyPlacement(calculatedOffset, placement)
    }
})

/**
 * Rearrange indexes in the array and conditions when some condtion is deleted in the middle
 * @author ManiKanta
 * @Date   2018-11-20T11:18:02+0530
 * @param  {String}                 type  type of the condtion to rearrange
 * @param  {Number}                 index The index which is deleted
 * @return {}                       
 */
function reArrangeIndexes(type, index) {
    var pillsArray = ivirMainObj[type];
    if (ivirMainObj[type] && index != pillsArray.length - 1) {
        var presentIndex = index;

        for (var i = (index + 1); i < pillsArray.length; i++) {
            var parentEl = $("#ivir" + type + (presentIndex + 1) + "CndtnPill");
            var indexToAdd = (i - 1);
            var idToAdd = type + 'pillCB' + indexToAdd; //chartpillCB1

            parentEl.find('input.ivirFilterCheckBox,input.ivirChartCheckBox').attr('id', idToAdd).data('index', indexToAdd).attr('data-index', indexToAdd);
            parentEl.find('input.ivirFilterCheckBox,input.ivirChartCheckBox').next("label").attr('for', idToAdd);
            parentEl.find('.ivirCndtnName').attr('onclick', 'editThePill("' + type + '",' + indexToAdd + ')');
            parentEl.find('.deletePillBtn').attr('onclick', 'deleteThePill("' + type + '",' + indexToAdd + ')');
            parentEl.attr('id', "ivir" + type + indexToAdd + "CndtnPill"); //ivirgroup0CndtnPill
            presentIndex++;
            if (type == "chart")
                $("#ivirChart" + i).attr('id', 'ivirChart' + indexToAdd);
            else if (type == "highlight") {
                //ivirCustomHighlight highlight1
                $(".ivirCustomHighlight.highlight" + i).removeClass("highlight" + i).addClass("highlight" + indexToAdd);
            }

        }
    }
}

/**
 * All validations of the popup will be handled here
 * @author ManiKanta
 * @Date   2018-11-20T11:19:20+0530
 * @param  {String}                 title 
 * @return {Boolean}                       returns true if everything is valid
 */
function validateFields(title) {
    var error = false;
    $("#ivirHighlightWrapper .form-control:not('.colorPicker')").each(function () {
        var fld = $(this)
        if (fld.val() == "") {
            if (fld[0].nodeName == "SELECT") {
                ivirCustomErrMsg(fld, errorMessages.emptySelect);
                error = true;
                return false;
            } else if (fld[0].nodeName == "INPUT") {
                ivirCustomErrMsg(fld, errorMessages.emptyField);
                error = true;
                return false;
            }
        } else if (!fld.hasClass('colorFld') && fld[0].nodeName == "INPUT") {
            if (!testRegex("validName", fld.val())) {
                ivirCustomErrMsg(fld, errorMessages.invalidName);
                error = true;
                return false;
            }

        } else if (fld.attr("id") && fld.attr("id") == "ivirHltValue") {
            var colType = $("#ivirHighlightCol").find('option:selected').data('type');
            if (colType == "n" && isNaN(fld.val())) {
                ivirCustomErrMsg(fld, errorMessages.integerChk);
                error = true;
                return false;
            }
        }
    });

    return error ? false : true;
}



/**
 * Will be called when user click on download
 * @author ManiKanta
 * @Date   2018-11-20T11:20:47+0530
 * @param  {}                 
 */
function DownloadAndSave(el) {
    $("#ivirDownloadWrapper div button .ivirDownload").removeClass('active');
    $("#ivirDownloadWrapper div button").removeClass('active');

    $("#ivirDownloadWrapper div button .ivirDownload").css("color", "");
    $("#ivirDownloadWrapper div button").css("color", "")

    $(el).addClass('active');
    $(el).css("color", "#3799dc ")

}

/**
 * Will be called when user click on download of any file in download popup
 * @author ManiKanta
 * @Date   2018-11-20T11:21:44+0530
 * @param  {}                 val 
 */
function DownloadFile(val) {
    if (!$("#ivirDownloadWrapper div button").hasClass('active')) {
        showAlertDialog("warning", errorMessages.downloadSelection);
        return false;
    } else {
        var typeOfFile = ivirDataTableApi;
        if ($('.CSV').hasClass('active')) {
            typeOfFile.button('1').trigger();
        } else if ($('.EXCEL').hasClass('active')) {
            typeOfFile.button('2').trigger();
        } else if ($('.PDF').hasClass('active')) {
            typeOfFile.button('3').trigger();
        } else if ($('.PRINT').hasClass('active')) {
            typeOfFile.button('4').trigger();
        } else if ($('.COPY').hasClass('active')) {
            typeOfFile.button('0').trigger();
        } else if ($('.HTML').hasClass('active')) {
            typeOfFile.button('5').trigger();
        } else if ($('.JSON').hasClass('active')) {
            typeOfFile.button('6').trigger();
        }

        return true;
    }
}



/**
 * WIll be called when user checked checkall (header checkbox)
 * @author ManiKanta
 * @Date   2018-11-20T11:23:04+0530
 * @param  {Object}                 elemm Element which is clicked
 * @return {}                       
 */
function ivirChkHdrCheckbox(elemm) {

    var chkAll = $("#chkall");
    var status = $(elemm).prop("checked");
    if (status) {
        if (!$(elemm).parents("tr").hasClass("axSelected")) {
            $(elemm).parents("tr").addClass("axSelected");
        }
    } else {
        $(elemm).parents("tr").removeClass("axSelected");

    }
    var allChecked = true;
    $("input[name=chkItem]:checkbox").each(function () {
        var isChked = $(this).prop("checked");
        if (isChked == undefined || isChked == false) {
            allChecked = false;
            return false;
        }
    });
    if (allChecked) {
        chkAll.prop("checked", true);
        $.each(ivirDataTableApi.settings()[0]._buttons[0].inst.c.buttons, function (index, value) {
            value.exportOptions.rows = "";
        });
    } else {
        chkAll.prop("checked", false);
        if ($("input[name=chkItem]:checkbox:checked").length < 1) {
            $.each(ivirDataTableApi.settings()[0]._buttons[0].inst.c.buttons, function (index, value) {
                value.exportOptions.rows = "";
            });
        } else {
            $.each(ivirDataTableApi.settings()[0]._buttons[0].inst.c.buttons, function (index, value) {
                value.exportOptions.rows = ".axSelected";
            });
        }
    }
}

/**
 * Internal function to handle check all logics
 * @author ManiKanta
 * @Date   2018-11-20T11:23:57+0530
 * @param  {Object}                 elem Element which is clicked
 * @return {}                      
 */
function ivirCheckAll(elem) {

    var chkAll = $(elem);

    if (chkAll.prop("checked") == true) {
        chkItems = $("input[name=chkItem]:checkbox").each(function () {
            $(this).prop("checked", true);
            if (!$(this).parents("tr").hasClass("axSelected")) {
                $(this).parents("tr").addClass("axSelected");
            }

        });
        $.each(ivirDataTableApi.settings()[0]._buttons[0].inst.c.buttons, function (index, value) {
            value.exportOptions.rows = ".axSelected";
        });
    } else {
        chkItems = $("input[name=chkItem]:checkbox").each(function () {
            $(this).prop("checked", false);
            $(this).parents("tr").removeClass("axSelected");
        });
        $.each(ivirDataTableApi.settings()[0]._buttons[0].inst.c.buttons, function (index, value) {
            value.exportOptions.rows = "";
        });
    }

}

/**
 * To show hide grid view/chart view
 * @author ManiKanta
 * @Date   2018-11-20T11:25:48+0530
 * @param  {String}                 type view to show chart/grid
 * @param  {Object}                 elem Clicked button
 * @return {}                      
 */
function toggleGridView(type, elem) {
    $(".task-button").removeClass('active')
    var customButtonHtml = "";
    if (type == "chart") {
        $("#ivirFilteredAccordion").hide();
        $(".chrtView").addClass('active');
        $("#ivirCButtonsWrapper").show();
        $("#pinnedivirCButtonsWrapper").show();
        $("#ivirMainChartWrapper").show();
        $("#searchSelectColumnButton").prop('disabled', true);
        $("#ivirMainDataTableWrapper").hide();
        $(ivirTable + "_paginate").hide();
        $(ivirTable + "_length").hide();
        $("#pillsWrapper").hide();
        $("#ivirChartPills").show();
        if (requestJSON) {
            $("#pillsWrapper").hide();
            $("#ivirChartPills").hide();
            $("#ivirAllCndtnPillsDiv").hide();
            $("#ivirChartPillsDiv").show().removeClass("d-none");
            if (ivirMainObj && ivirMainObj.chart && ivirMainObj.chart.length > 0) {
                $("#ivirMainDataTableWrapper").show();
            } else {
            }
            customButtonHtml += '<a title="Grid View" type="button" onclick="toggleGridView(\'grid\')" class="grdView task-button shadow animate blue"><span class="ivirCButton icon-software-layout-8boxes"></span></a>';;

            $("#pinnedivirCButtonsWrapper").html(customButtonHtml);
        }
    } else if (type == "grid") {
        $(".grdView").addClass('active');
        $("#ivirFilteredAccordion").show();
        $("#ivirCButtonsWrapper").show();
        $("#pinnedivirCButtonsWrapper").show();
        $('#ivirMainChartWrapper').hide();
        $("#searchSelectColumnButton").prop('disabled', false);
        $(ivirTable + "_paginate").show();
        $(ivirTable + "_length").show();
        $("#ivirMainDataTableWrapper").show();
        ivirDataTableApi.columns.adjust().draw();
        $("#pillsWrapper").show();
        $("#ivirChartPills").hide();
        if (requestJSON) {
            $("#pillsWrapper").hide();
            $("#ivirChartPills").hide();
            if ($('#ivirAllCndtnPillsList').children('div').length) {
                $("#ivirAllCndtnPillsDiv").hide();//
            }
            if (ivirMainObj && ivirMainObj.chart && ivirMainObj.chart.length > 0) {
                $('#ivirMainChartWrapper').show();
            } else {
                $("#ivirChartPillsDiv").hide().addClass("d-none");
            }
            customButtonHtml += '<a title="Chart View" type="button" onclick="toggleGridView(\'chart\');" class="chrtView task-button shadow animate blue"><span class="ivirCButton icon-ecommerce-graph1"></span></a>';

            $("#pinnedivirCButtonsWrapper").html(customButtonHtml);
        }
    } else if (type = "showChartErrMsg") {
        if ($(elem).data("count") == 0) {
            $(elem).data("count", 1)
        } else {
            showAlertDialog("warning", errorMessages.noChartWhileGrpng);
        }
    }

    try {
        KTMenu?.init();
    } catch (error) { }

}


/**
 * Function to create column chart in IVIR
 * @author ManiKanta
 * @Date   2018-11-20T11:26:56+0530
 * @param  {Boolean}                isDataExists if any data is there or not then will show no data....
 * @param  {Object}                 datats       Will have all the data to render the chart
 * @param  {String}                 title        Title of the chart
 * @param  {Number}                 index        chart condition index
 * @param  {String}                 type         column/bar
 * @param  {Number}                 valColIndex  The value column index number
 * @return {}                              
 */
function columnChart(isDataExists, datats, title, index, type, valColIndex) {
    var headerName = $(ivirDataTableApi.columns(valColIndex).header()).text().trim();
    var heihgtOfChrt = $("#ivirMainChartWrapper").outerHeight() - 70;
    var valueSelected = JSON.parse(datats.split('~')[0])[0];
    toggleGridView("chart");
    var idOftheDiv = 'ivirChart' + index;
    if (index > (maxNoOfPills - 1)) {
        $(".ivirChartCheckBox").prop('checked', false).attr('checked', 'checked');
        $(".chartWrapper").hide();
        idOftheDiv = 'ivirChartCommon';
    }

    if ($("#" + idOftheDiv).length == 0)
        $("#ivirChartWrapper").append('<div class="chartWrapper" id="' + idOftheDiv + '"></div>');
    if (!(requestJSON)) {//temp
        $("#ivirChartWrapper .chartWrapper").hide(); //chartWrapper
    }
    $("#ivirChartWrapper #ivirChart" + index).show();
    try {
        var viewName = $(".viewtabEdit").parents("li a.active").find(".viewtabEdit").data("name") || "main";
        if (viewName == "charts") {
        }
    } catch (ex) { }
    if (!isDataExists) {
        $('#ivirChartWrapper #' + idOftheDiv).html(`<p class='ivirNoDataTag'>${appGlobalVarsObject.lcm[0]}</p>`);
        return;
    }
    var chart = $('#ivirChartWrapper #' + idOftheDiv).highcharts({
        colors: ['#f8bd19', '#e44a00', '#008ee4', '#33bdda', '#6baa01', '#583e78'],
        credits: {
            enabled: false
        },
        chart: {
            type: type,
            height: heihgtOfChrt,
            options3d: {
                enabled: true,
                alpha: 0,
                beta: 20,
                depth: 50
            },
            events: {
                beforePrint: function () {
                    this.exportSVGElements[0].box.hide();
                    this.exportSVGElements[1].hide();
                },
                afterPrint: function () {
                    this.exportSVGElements[0].box.show();
                    this.exportSVGElements[1].show();
                }
            }
        },
        title: {
            text: title,
            align: 'left'
        },
        xAxis: {
            categories: JSON.parse(JSON.stringify(JSON.parse(datats.split('~')[0])).replace(/_+/g, ' '))
        },
        tooltip: {
            formatter: function () {
                return this.series.name + '<br>' + headerName + ': <b>' + Highcharts.numberFormat(this.y, -1) + '</b>';
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: valueSelected
            }
        },
        series: JSON.parse(JSON.stringify(JSON.parse(datats.split('~')[1])))
    });
    // if (requestJSON && iviewButtonStyle != "old") {
        chart.highcharts().setSize(undefined, 300, false);
    // }
    adjustChartBasedWrapperHeight();
}

/**
 * To create pie/donut chart
 * @author ManiKanta
 * @Date   2018-11-20T11:36:33+0530
 * @param  {Boolean}                isDataExists if any data is there or not then will show no data....
 * @param  {Object}                 datats       Will have all the data to render the chart
 * @param  {String}                 title        Title of the chart
 * @param  {Number}                 index        chart condition index
 * @param  {String}                 type         column/bar
 * @param  {Number}                 valColIndex  The value column index number
 * @param  {Boolean}                isDonut      Is donut or pie chart
 * @return {}                              
 */
function pieChart(isDataExists, datats, title, index, valColIndex, isDonut) {
    var headerName = $(ivirDataTableApi.columns(valColIndex).header()).text().trim();
    var heihgtOfChrt = $("#ivirMainChartWrapper").outerHeight() - 70;
    toggleGridView("chart");
    var idOftheDiv = 'ivirChart' + index;
    if (index > (maxNoOfPills - 1)) {
        $(".ivirChartCheckBox").prop('checked', false).attr('checked', 'checked');
        $(".chartWrapper").hide();
        idOftheDiv = 'ivirChartCommon';
    }

    if ($("#" + idOftheDiv).length == 0)
        $("#ivirChartWrapper").append('<div class="chartWrapper" id="' + idOftheDiv + '"></div>');

    if (!(requestJSON)) {//temp
        $("#ivirChartWrapper .chartWrapper").hide(); //chartWrapper
    }
    $("#ivirChartWrapper #ivirChart" + index).show();
    try {
        var viewName = $(".viewtabEdit").parents("li a.active").find(".viewtabEdit").data("name") || "main";
        if (viewName == "charts") {

        }
    } catch (ex) { }
    if (!isDataExists) {
        $('#ivirChartWrapper #' + idOftheDiv).html(`<p class='ivirNoDataTag'>${appGlobalVarsObject.lcm[0]}</p>`);
        return;
    }
    isDonut ? sizeOfInner = 80 : sizeOfInner = 0;
    var chart = $('#ivirChartWrapper #' + idOftheDiv).highcharts({
        colors: ['#f8bd19', '#e44a00', '#008ee4', '#33bdda', '#6baa01', '#583e78'],
        credits: {
            enabled: false
        },
        chart: {
            type: 'pie',
            height: heihgtOfChrt,
            options3d: {
                enabled: true,
                alpha: 25,
                beta: 0
            },
            events: {
                beforePrint: function () {
                    this.exportSVGElements[0].box.hide();
                    this.exportSVGElements[1].hide();
                },
                afterPrint: function () {
                    this.exportSVGElements[0].box.show();
                    this.exportSVGElements[1].show();
                }
            }
        },
        title: {
            text: title,
            align: 'left'
        },
        tooltip: {
            pointFormat: headerName + ': <b>{point.y}</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                innerSize: sizeOfInner,
                depth: 35,
                dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                },
                showInLegend: true
            }
        },
        series: [{
            name: title,
            data: JSON.parse(JSON.stringify(JSON.parse(datats)))
        }]
    });
    // if (requestJSON && iviewButtonStyle != "old") {
        chart.highcharts().setSize(undefined, 300, false);
    // }
    adjustChartBasedWrapperHeight();
}


/** Generic function to create the select dropdown kind ui like column selection */
(function ($, window, document, undefined) {

    'use strict';

    var $html = $('html');

    $html.on('click.ui.dropdown', '.js-dropdown', function (e) {
        e.preventDefault();
        var presentElem = $(this);
        if (!presentElem.hasClass('is-open')) {
            // presentElem.find('.dropDownButton__list').css({
            //     'display': 'block',
            //     'visibility': 'visible'
            // });
        } else {
            setTimeout(function () {
                presentElem.find('.dropDownButton__list').hide();
            }, 250)
        }
        $(document).unbind('keydown.upDownEvents');
        if (!presentElem.hasClass('is-open')) {
            highlightAndBindUpDown(presentElem, '', ".js-dropdown ul li");
        }
        presentElem.toggleClass('is-open');
    });

    $html.on('click.ui.dropdown', '.js-dropdown [data-dropdown-value]', function (e) {
        e.preventDefault();
        var $item = $(this);
        if (!$item.hasClass('subHeader')) {
            var $dropdown = $item.parents('.js-dropdown');
            $dropdown.find('.js-dropdown__input').data('index', $item.data('index')).val($item.data('dropdown-value')).change();
            if (!$dropdown.hasClass("ivirActionDrpDwn")) {
                $dropdown.find('.js-dropdown__current').attr('title', 'Search ' + $item.text()).text($item.text());
            }
            // else {
            //     if (!requestJSON || iviewButtonStyle == "old") {
            //         $dropdown.find('.js-dropdown__current').html(callParentNew('lcm')[406] + '<span class="menu-arrow"></span>');
            //     }
            // }
            svHtmlGeneratorRef($item, $dropdown.find('.js-dropdown__input'));
        } else {
            e.stopPropagation();
        }
    });

    $html.on('click.ui.dropdown', function (e) {
        var $target = $(e.target);
        if (!$target.parents().hasClass('js-dropdown')) {
            $(document).unbind('keydown.upDownEvents');
            $('.js-dropdown').removeClass('is-open');
            $('.js-dropdown').find('.dropDownButton__list').css({
                'display': 'none'
            });
        }
        if (!$(e.target).hasClass('rightClickMenuIcn')) {

            $(".rightClickMenu").hide();
        }

    });

})(jQuery, window, document);

/**
 * Function to apply comma to a number
 * @author ManiKanta
 * @Date   2018-11-20T11:56:45+0530
 * @param  {String}                 val Number to apply comma
 * @return {String}                     comma applied string
 */
function commaSeparateNumber(val) {
    while (/(\d+)(\d{3})/.test(val.toString())) {
        val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
    }
    return val;
}



/**
 * To check any duplicate named conditions are adding
 * @author ManiKanta + Abhishek
 * @Date   2018-11-20T11:57:58+0530
 * @param  {String}                 title The title user is going to add
 * @return {Boolean}                      true - valid,false- invalid
 */
function ivirDuplicateCheck(title, isEditPill, index) {
    title = title.toLowerCase();
    var obj = ivirMainObj[title];
    var fld = title == "filter" ? $('#divModalAdvancedFilters .fldNme') : title == "chart" ? $(".modal-body .fldNme") : $("#newViewTabId").find(".card-body .flex-column.current .fldNme");
    if (obj && fld) {
        for (var i = obj.length - 1; i >= 0; i--) {
            if (fld.val().trim() != "") {
                if (obj[i].n == fld.val().trim()) {
                    if (isEditPill && index == i)
                        continue;
                    else {
                        var ttl = '';
                        if (title == 'filter')
                            ttl = callParentNew('lcm')[231];
                        else if (title == 'chart')
                            ttl = callParentNew('lcm')[394];
                        else if (title == 'group')
                            ttl = callParentNew('lcm')[395];
                        else if (title == 'highlight')
                            ttl = callParentNew('lcm')[396];
                        ivirCustomErrMsg(fld, errorMessages.duplicateFld.replace("{0}", ttl));
                        return false;
                    }

                }
            }
        }
    }
    return true;
}

/**
 * @description: Check if new chart name exxist or not in any of the views
 * @author Prashik
 * @date 2020-11-10
 * @param {*} title
 * @param {boolean} isEditPill
 * @param {*} index
 * @returns 
 */
function ivirChartNewDuplicateCheck(title, isEditPill, index) {
    if (ivirMainViewObj) {
        var fld = $('#ivirgraph .fldNme');

        let ttl = callParentNew('lcm')[394];

        if (!isEditPill && ivirMainViewObj && !_.isEmpty(_.find(getAllCommonCharts(), { n: fld.val().trim() }))) {
            ivirCustomErrMsg(fld, errorMessages.duplicateFld.replace("{0}", ttl));
            return false;
        }

        return true;
    }
}


/**
 * @description: Get charts from all views in array
 * @author Prashik
 * @date 2020-11-10
 * @returns {String[]}
 */
function getAllCommonCharts() {
    let returnArray = ivirMainViewObj && _.uniqBy(_.flatMap(_.filter(_.mapValues(ivirMainViewObj.views, 'chart'))), v => v.n) || [];

    if (returnArray.length && ivirMainObj && ivirMainObj["chart"] && ivirMainObj["chart"].length) {
        returnArray = _.uniqBy([...ivirMainObj["chart"], ...returnArray], v => v.n) || [];
    }
    return returnArray.length ? returnArray : [];
}

/**
 * @description: Delete chart object from main views object also if chart is deleted from charts view
 * @author Prashik
 * @date 2020-11-10
 * @param {*} chartObj
 */
function deleteCommonChart(chartObj) {
    _.each(ivirMainViewObj.views, (v) => {
        if (v && v.chart && v.chart.length && v.chart.length > 0) {
            v.chart = v.chart.map((c) => c.n != chartObj.n ? c : "").filter(c => c);
            if (v.chart.length == 0) {
                delete v.chart;
            }
        }
    });
    setTimeout(function () {
        $("#ivirChartPillsList .ivirChartCheckBox:first").prop("checked", true).change();
        $("#ivirChartPillsDiv .ivirChartCheckBox:first").prop("checked", true).change();
    }, 0);
}

/**
 * To test the regular expressions
 * @author ManiKanta
 * @Date   2018-11-20T11:58:52+0530
 * @param  {}                 type  
 * @param  {}                 value 
 * @return {Boolean}                       
 */
function testRegex(type, value) {
    var regexTotst = regexes[type];
    var regexExp = regexTotst.replace(/\\/g, "\\");
    regexExp = new RegExp(regexExp, "i");
    return regexExp.test(value) ? true : false;
}

/**
 * On click on action save saving the condition to database for next load
 * @author ManiKanta
 * @Date   2018-11-20T11:59:18+0530
 * @return {}                 
 */
function saveInSessionBeforeSave() {
    $("#IvirActions").val("");
    //Caching in local storage.
    var isLocalCache = false;
    try {
        if (typeof (Storage) !== "undefined") {
            var ivInteractiveMainJson = localStorage.ivInteractiveMainJson;
            if (ivInteractiveMainJson) {
                isLocalCache = true;
                var savedJson = JSON.parse(ivInteractiveMainJson);
                savedJson[iName] = ivirMainObj;
                saveJsonToDB("set", JSON.stringify(savedJson));
            } else {
                isLocalCache = false;
            }

        } else {
            isLocalCache = false;
        }
    } catch (e) {
        isLocalCache = false;
        console.log(e);
    }
    if (!isLocalCache) {
        var jsonToSave = {};
        jsonToSave[iName] = ivirMainObj;
        saveJsonToDB("set", JSON.stringify(jsonToSave));
    }
}
function saveInSessionBeforeSaveNew(viewName, viewCaption, uname, asDefault) {
    $("#IvirActions").val("");

    ivirMainObj["applyTo"] = uname;
    ivirMainObj["caption"] = viewCaption;
    ivirMainObj["groupName"] = viewName;

    if (!(viewName == "main" && viewCaption == "main")) {
        SavePillsCheckedProperty();
        ivirMainObj.params = $("#hdnparamValues").val().replace(/&grave;/g, "`");
        ivirMainObj.paramsList = getParamsValueList();
        ivirMainObj.paramsList && (ivirMainObj.paramsList = JSON.parse(JSON.stringify(ivirMainObj.paramsList).replace(/&/g, "&amp;")));

        try {
            if (isListView && $("#hdnLvChangedStructure").val()) {
                ivirMainObj.visibleColumns[0].structure = CheckUrlSpecialChars($("#hdnLvChangedStructure").val());
            }
        } catch (ex) { }

        if (ivirMainObj.hiddenColumns || ivirMainObj.visibleColumns) {
            viewLoadedColumns = true;
        }
        if (ivirMainObj.sorting) {
            viewLoadedSort = true;
        }

        if (toolbarPinArr.length > 0)
            ivirMainViewObj["toolbarPin"] = [...new Set(toolbarPinArr)];
    }

    if (!ivirMainViewObj["views"])
        ivirMainViewObj["views"] = {};
    ivirMainViewObj["views"][viewName] = JSON.parse(JSON.stringify(ivirMainObj));

    if(asDefault){
        ivirMainViewObj["views"]["@defaultView"] = viewName;
        currView = viewName;
    }else if(ivirMainViewObj?.["views"]?.["@defaultView"] == viewName){
        delete ivirMainViewObj["views"]["@defaultView"];
    }

    SaveSmartviewJsonToDb("set", JSON.stringify(ivirMainViewObj), uname, viewName);

}

function getViewName() {
    var htmlToShow = "";
    var username = eval(callParent("mainUserName"));

    htmlToShow = ' <div class="form-group">';
    htmlToShow += '<label for="grpName" class="form-label col-form-label pb-1 fw-boldest required">Name</label>';
    htmlToShow += '<input required id="viewName" type="text" class="d-none form-control fldNme dialogInptFld" maxlength="20" value="' + ("vw" + (new Date().getTime())) + '" />';
    htmlToShow += '<input required id="viewCaption" type="text" class="form-control fldNme dialogInptFld" maxlength="20" />';
    htmlToShow += '</div>';
    htmlToShow += '<div class="form-group">';
    htmlToShow += '<label for="grpColName" class="form-label col-form-label pb-1 fw-boldest required"> Apply To </label>';
    htmlToShow += '<select class="form-select stepperSelect dialogSlctFld" id="viewAplyTo">';
    htmlToShow += '<option value="' + username + '">' + username + '</option>';
    htmlToShow += '<option value="ALL">ALL</option>'
    htmlToShow += ' </select>';
    htmlToShow += '</div>';


    let myModal = new BSModal("getviewname", "Add View Name", htmlToShow, () => {
        $("select.stepperSelect").select2({
            allowClear: true,
            dropdownParent: document.getElementById("getviewname"),
            minimumResultsForSearch: Infinity,
            placeholder: appGlobalVarsObject.lcm[441],
        });
    }, () => { });

    myModal.changeSize("sm");
    myModal.okBtn.innerText = appGlobalVarsObject.lcm[399];
    myModal.okBtn.addEventListener("click", () => {
        saveViewActionRef("View", "view", "saveInSessionBeforeSaveNew", undefined, false);
    });
}

/**
 * @description: Create/open new view tab popup from views panel
 * @author Prashik
 * @date 2020-11-10
 */
function newViewTabClick(jqElem) {
    setTimeout(() => {
        bkpIvirMainObj = _.cloneDeep(ivirMainObj);
    }, 0);
    var newViewTab = false;
    var viewTabName = ("vw" + (new Date().getTime()));
    var viewTabCaption = "";
    if (jqElem.attr("id") == "viewAddTab" || (jqElem.attr("id") == "IvirActions" && jqElem.val() == "saveAs")) {
        newViewTab = true;
        if(isListView && loadViewName != "main"){
            oldLoadViewName = loadViewName;
            $(".lnkViewTab#main").click();
        }
    } else {
        viewTabName = jqElem.data('name');
        viewTabCaption = jqElem.data('caption');

        if (ivirMainObj && (ivirMainObj.groupName && ivirMainObj.groupName != viewTabName) || !ivirMainObj.groupName) {
            if (ivirMainViewObj && ivirMainViewObj.views && ivirMainViewObj.views[viewTabName]) {
                ivirMainObj = ivirMainViewObj.views[viewTabName];
            }
        }
    }

    if(!oldLoadViewName){
        smartStepper(newViewTab, viewTabName, viewTabCaption);
    }
}

function applyCheckedPillsOnLoad() {

    $.each(ivirMainObj, function (index, element) {
        switch (index) {
            case "filter":
                $.each(element, function (index, value) {
                    //if (value.checked == true || (requestJSON && iviewButtonStyle != "old"))
                        $(".ivirFilterCheckBox[data-type='filter'][data-index=" + index + "]").trigger("click");
                });
                break;
            case "highlight":
                $.each(element, function (index, value) {
                    //if (value.checked == true || (requestJSON && iviewButtonStyle != "old"))
                        $(".ivirFilterCheckBox[data-type='highlight'][data-index=" + index + "]").trigger("click");
                });
                break;
            case "group":
                $.each(element, function (index, value) {
                    //if (value.checked == true || (requestJSON && iviewButtonStyle != "old"))
                        $(".ivirFilterCheckBox[data-type='group'][data-index=" + index + "]").trigger("click");
                });
                break;
            case "hiddenColumns":
                ivirshowHideColumns(element);
                break;
            case "sorting":
                ivirSortColumns(element);
                break;
        }
    });
}

function SavePillsCheckedProperty() {
    var allPills = $("[data-pill-type='filter'],[data-pill-type='highlight'],[data-pill-type='group']");
    if (allPills) {
        $.each(allPills, function (index, pill) {
            var type = pill.dataset.pillType
            switch (type) {
                case "filter":
                    if (ivirMainObj.filter && ivirMainObj.filter.length > 0) {
                        if ($(pill).find(".ivirFilterCheckBox").is(":checked"))
                            ivirMainObj.filter[$(pill).find(".ivirFilterCheckBox").data("index")].checked = true;
                        else
                            ivirMainObj.filter[$(pill).find(".ivirFilterCheckBox").data("index")].checked = false;
                    }
                    break;
                case "highlight":
                    if (ivirMainObj.highlight && ivirMainObj.highlight.length > 0) {
                        if ($(pill).find(".ivirFilterCheckBox").is(":checked"))
                            ivirMainObj.highlight[$(pill).find(".ivirFilterCheckBox").data("index")].checked = true;
                        else
                            ivirMainObj.highlight[$(pill).find(".ivirFilterCheckBox").data("index")].checked = false;
                    }
                    break;
                case "group":
                    if (ivirMainObj.group && ivirMainObj.group.length > 0) {
                        if ($(pill).find(".ivirFilterCheckBox").is(":checked"))
                            ivirMainObj.group[$(pill).find(".ivirFilterCheckBox").data("index")].checked = true;
                        else
                            ivirMainObj.group[$(pill).find(".ivirFilterCheckBox").data("index")].checked = false;
                    }
            }

        });
    }
}


/**
 * On load to get the already saved conditions from db
 * @author ManiKanta
 * @Date   2018-11-20T12:00:04+0530
 * @return {}                 
 */
function getSavedConditions() {

    var ivInteractiveMainJson = localStorage.ivInteractiveMainJson;
    if (!ivInteractiveMainJson)
        saveJsonToDB("get");
    else {
        var jsonObj;
        try {
            jsonObj = JSON.parse(ivInteractiveMainJson);
            if (jsonObj[iName]) {
                if (jQuery.isEmptyObject(ivirMainObj))
                    ivirMainObj = jsonObj[iName];
            }
        } catch (e) { }

        createIvirDataTable();
        createPillsOnLoad();
    }

}

function getSavedConditionsNew(view, json = "") {
    SaveSmartviewJsonToDb("get", json, "", view);
    var allCharts = getAllCommonCharts();
    if (allCharts.length > 0 && requestJSON && view == "charts") {
        ivirMainObj = {}
        ivirMainObj.key = "charts";
        ivirMainObj.chart = getAllCommonCharts();
    }

    if(view){
        $('.nav-tabs a[id=' + view + ']')?.tab?.('show');
    }

    if (view != "main" && (requestJSON && loadViewName != "charts")) {

        createPillsOnLoad();
        applyCheckedPillsOnLoad();
        
        scrollToActiveView(view);

        try {
            if (checkIfNextDBRowsExist() && ivirMainObj && (ivirMainObj.chart && ivirMainObj.chart.length && ivirMainObj.chart.length > 0 || ivirMainObj.highlight && ivirMainObj.highlight.length && ivirMainObj.highlight.length > 0 || ivirMainObj.sorting && ivirMainObj.sorting.length && ivirMainObj.sorting.length > 0)) {
                showChartsWithAllRecords = true;

                ShowDimmer(true);
                setTimeout(function () {
                    getNextDtRecords(0);
                }, 100);
            }
        } catch (ex) { }
    }
}

function createViewTabs(jsonObj) {
    var tabindex = 0;

    $("#viewTabs").children().remove();

    if ((viewKeys = Object.keys(jsonObj)).length > 0 && !(isListView && viewKeys.length == 1 && viewKeys[0] == "main")) {

        if ($.isEmptyObject(jsonObj["main"])) {
            jsonObj["main"] = {};
        }

        $.each(jsonObj, function (key, element) {
            if(key == "@defaultView"){
                return;
            }
            var tabHtml = "";
            var dataCaption = element["caption"] || key;
            tabHtml = `
                <li class="nav-item">
                    <a data-bs-toggle="tab" id="${key}" class="nav-link fw-boldest shadow-sm fs-6 text-gray-800 p-4 lnkViewTab" data-caption="${tabindex}" href="#${key}">
                        <span>${dataCaption}</span>
                        <span  data-name="${key}" data-caption="${dataCaption}" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-dismiss="click" data-bs-original-title="Edit" class="material-icons material-icons-style material-icons-5 viewtabEdit viewtabDltBtn">edit</span>
                        
                    </a>
                </li>
            `;

            if ((key == (currView || "main") && !isListView) || key == "charts") {
                $("#viewTabs").prepend($(tabHtml).find(".viewtabRemove, .viewtabEdit").addClass("d-none").parents("li"));
            } else if (key == (currView || "main") && isListView) {
                $("#viewTabs").prepend(tabHtml);
            } else {
                $("#viewTabs").append(tabHtml);
            }
        });

        $("#viewTabs").append(`
        <li class="nav-item">
            <a data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-dismiss="click" data-bs-original-title="Add View" id="viewAddTab" class="nav-link fw-boldest shadow-sm fs-6 text-gray-800 px-3 py-4 lnkViewTab lnkViewTabAdd viewAddTab" href="" onclick="newViewTabClick($(this));">
                <span class="material-icons material-icons-style material-icons-5">add</span>
            </a>
        </li>
        `);

        if (jsonObj[(currView || "main")]) {
            $(`.nav-tabs a[id=${(currView || "main")}]`).addClass("active");

            if(currView != ""){
                try {
                    $(`.nav-tabs a[id=${currView}]`).parent("li.nav-item").after($(`.nav-tabs a[id=${"main"}]`).parent("li.nav-item"));
                } catch (ex) {}

                if(isListView && currView){
                    $(`.nav-tabs a[id=${("main")}]`).addClass("d-none");
                }
            }

            if ($.isEmptyObject(jsonObj["main"])) {
                delete jsonObj["main"];
            }
        }
    }

    if ($('#viewTabs').children('li').length != 0) {
        if ($('#dvViewtabs').is(':hidden'))
            $('#dvViewtabs').show();
        reAdjust();
    }
    else
        $('.scroller').hide();
    setSmartViewHeight();

    if ($("#viewTabs li").length > 0) {
        $(".mainTabs").addClass("viewTabsAdded");
        if (isListView) {
            $("[data-dropdown-value=design]:eq(0)").addClass("d-none");
        }
    } else {
        $(".mainTabs").removeClass("viewTabsAdded");
        if (isListView) {
            $("[data-dropdown-value=design]:eq(0)").removeClass("d-none");
        }
    }
}
function clearExistingPills() {
    if ($("#ivirAllCndtnPillsList :input").length) {
        $($("#ivirAllCndtnPillsList :input").get().reverse()).each(function (index, element) {
            if (element.type == "checkbox")
                deleteThePill(element.dataset["type"], element.dataset["index"], true);
        });
    }
    if (!ivirMainObj.highlight && !ivirMainObj.group && !ivirMainObj.filter) {
        $('#ivirAllCndtnPillsDiv .popover-content').html("");
        $('#ivirAllCndtnPillsList').html("");
    }

    if ($("#ivirChartPillsList :input").length) {
        $($("#ivirChartPillsList :input").get().reverse()).each(function (index, element) {
            if (element.type == "checkbox")
                deleteThePill(element.dataset["type"], element.dataset["index"], true);
        });
    }
    if (!ivirMainObj.chart) {
        $('#ivirChartPillsDiv .popover-content').html("");
        $("#ivirChartPillsList").html("");
    }
}
/**
 * Internal function to get/set the conditiond from/to db
 * @author ManiKanta + Abhishek
 * @Date   2018-11-20T12:00:27+0530
 * @param  {String}                 option task to get/set
 * @param  {Object}                 json   if set the json data to set
 * @return {}                        
 */
function saveJsonToDB(option, json, view) {

    if (option == "set" && json != "") {
        $.ajax({
            url: 'iview.aspx/SaveJsonInDB',
            type: 'POST',
            cache: false,
            async: false,
            data: JSON.stringify({ jsonString: json, isListView }),
            dataType: 'json',
            contentType: "application/json",
            success: function (msg) {
                if (msg.d == "Session Authentication failed...")
                    parent.window.location.href = "../aspx/sess.aspx";
                else if (msg.d == "done") {
                    showAlertDialog("success", 3030, "client");
                    localStorage.ivInteractiveMainJson = json;
                }
                else
                    showAlertDialog("warning", 3028, "client");
            },
            error: function () {
                showAlertDialog("warning", "Error while saving the data.");
            }
        });
    }
    else if (option == "get") {
        $.ajax({
            url: 'iview.aspx/GetJsonFromDB',
            type: 'POST',
            async: true,
            data: JSON.stringify({ isListView }),
            dataType: 'json',
            contentType: "application/json",
            success: function (data) {
                try {
                    if (data.d.status == "success") {
                        var ivInteractiveMainJson = localStorage.ivInteractiveMainJson;
                        var jsonSaved = data.d.result;
                        if (jsonSaved && jsonSaved !== "") {
                            var isJsonCreated = false;
                            ivInteractiveMainJson = jsonSaved;
                            if (ivInteractiveMainJson !== "") {
                                localStorage.ivInteractiveMainJson = ivInteractiveMainJson;
                                var jsonObj = JSON.parse(jsonSaved);
                                if (jsonObj[iName]) {
                                    isJsonCreated = true;
                                    if (jQuery.isEmptyObject(ivirMainObj))
                                        ivirMainObj = jsonObj[iName];
                                    if (allGrandTotal.length > 0) {
                                        createIvirDataTable(undefined, '', '', allGrandTotal);
                                    } else {
                                        createIvirDataTable();
                                    }

                                }
                            }
                        }
                        createPillsOnLoad();
                    }
                    else if (data.d.result == "Session Authentication failed...")
                        parent.window.location.href = "../aspx/sess.aspx";
                    else
                        showAlertDialog("warning", 3028, "client");
                } catch (ex) {
                }
                if (!isJsonCreated && allGrandTotal.length > 0) {
                    createIvirDataTable(undefined, '', '', allGrandTotal);
                } else if (!isJsonCreated)
                    createIvirDataTable();
            },
            error: function () {
                createIvirDataTable();
            }
        });
    }
}

/**
 * @description function to get/set New smartview settings from/to db
 * @author Rakesh + Prashik
 * @date 2020-06-05
 * @param {string}           option task to get/set
 * @param {string}           json   Json data to save/apply.
 * @param {sting}            uname  name of the use for which Json data to be save(username/All)
 * @param {string}           view   Name of the view for which Json data to be save/retrive
 */
function SaveSmartviewJsonToDb(option, json, uname, view) {

    if (option == 'set' && json != "") {

        let switchViewCallBackFunction;

        if ($("#newViewTabId").is(":visible") || isOpenSmartStepper) {
            switchViewCallBackFunction = function (view) {
                setTimeout(() => {
                    var viewName = $(".viewtabEdit").parents("li a.active").find(".viewtabEdit").data("name") || "main";
                    if (!isListView || viewName != view) {
                        $('#' + view).click();
                    }
                }, 0);
            }
        }

        var jsonSaveObj = JSON.parse(json);

        if (jsonSaveObj.views) {
            Object.keys(jsonSaveObj.views).forEach(key => {
                var thisSaveView = jsonSaveObj.views[key];
                if (thisSaveView.applyTo != uname && key != "@defaultView") {
                    delete jsonSaveObj.views[key];
                }
            });
        }

        var saveJson = JSON.stringify(jsonSaveObj);

        ASB.WebService.SaveSmartViews(iName, $('#hdnKey').val(), saveJson, uname, function (result) {
            try {
                if (result == "Session Authentication failed...")
                    parent.window.location.href = "../aspx/sess.aspx";
                else if (result && (res = JSON.parse(result)) && res.result && res.result.length && res.result[0] && res.result[0].value == "Saved") {
                    var tempViewObj = JSON.parse(json).views;
                    if (view) {
                        var isDelete = typeof tempViewObj[view] == "undefined";
                        if (isDelete) {
                            showAlertDialog("success", 3033, "client");
                        } else {
                            showAlertDialog("success", 3030, "client");
                        }

                        loadViewName = view;
                        if(oldLoadViewName){
                            oldLoadViewName = "";
                        }

                        /* Temp alert to reload */
                        showAlertDialog("info", "Please reload the view to see the changes");
                        try {
                            (callParentNew("newViewTabId", "id") || callParentNew("design", "id") || callParentNew("Charts", "id")).dispatchEvent(new CustomEvent("close"));
                        } catch (error) { }

                    }

                    let viewToCreate = JSON.parse(json).views;
                    if (viewToCreate) {
                        createViewTabs(viewToCreate);
                    }

                    if (ivirMainObj.groupName) {
                        $('.nav-tabs a[id=' + ivirMainObj.groupName + ']').tab('show');
                        if ($('#' + view).length > 0) {
                            scrollToActiveView(ivirMainObj.groupName);
                        }
                        if (switchViewCallBackFunction) {
                            switchViewCallBackFunction(ivirMainObj.groupName);
                        }
                    }
                    if ($('#viewTabs').children('li').length == 0) {
                        $('#dvViewtabs').hide();
                        $('.scroller').hide();
                    }
                }
                else
                    showAlertDialog("warning", 3028, "client");
            } catch (ex) {
                showAlertDialog("warning", 3028, "client");
            }

        }, function (result) { })
    }

    else if (option == "get") {
        // json = "";
        var isJsonCreated = false;
        //onsuccess
        try {
            if (json != "") {

                var jsonSaved = json;
                if (jsonSaved && jsonSaved !== "") {

                    var jsonObj = JSON.parse(jsonSaved);

                    try {
                        if (jsonObj && ((view == "main" && $.isEmptyObject(ivirMainObj?.visibleColumns)) || !($("#newViewTabId").is(":visible") || isOpenSmartStepper))) {
                            isJsonCreated = true;
                            if (ivirMainObj && (requestJSON && view != "charts"))
                                ivirMainObj = JSON.parse(JSON.stringify(jsonObj?.views?.[view] || {}));
                            else
                                ivirMainObj = {};
                            ivirMainViewObj = JSON.parse(JSON.stringify(jsonObj));
                        }else{
                            ivirMainViewObj = JSON.parse(JSON.stringify(jsonObj));
                        }
                    } catch (ex) { }
                    if (!isMobile && jsonObj.toolbarPin != undefined) {
                        toolbarPinArr = jsonObj.toolbarPin;
                        constructPinnedToolbar();
                    }
                    if (allGrandTotal.length > 0) {
                        createIvirDataTable(undefined, '', '', allGrandTotal);
                    } else {
                        createIvirDataTable();
                    }
                    if (ivirMainViewObj.views)
                        createViewTabs(ivirMainViewObj.views);

                }
            }
        } catch (ex) {
        }
        if (!isJsonCreated && allGrandTotal.length > 0) {
            createIvirDataTable(undefined, '', '', allGrandTotal);
        } else if (!isJsonCreated)
            createIvirDataTable();
    }
}


/**
 * Create all the condtions once we got the data from database
 * @author ManiKanta + Prashik
 * @Date   2018-11-20T12:01:28+0530
 * @return {}                 
 */
function createPillsOnLoad() {
    if (jQuery.isEmptyObject(ivirMainObj))
        return false;
    createPills("all", "first");
    $(".ivirFilterCheckBox").prop('checked', false).removeAttr('checked');
    var chartArray = ivirMainObj.chart;
    if (chartArray) {
        for (var i = 0; i < chartArray.length; i++) {
            if (requestJSON) {
                ivirCreateChart(i, true, false, true);

            } else {
                ivirCreateChart(i, false, false, true);
            }
            createChartPills();
            if (requestJSON) {
                if (ivirMainObj.groupName && ivirMainObj.groupName != "charts") {
                    isChartCreationOnLoad = true;
                    $("#ivirChartPillsList .ivirChartCheckBox:first").change();
                    $("#ivirChartPillsDiv .ivirChartCheckBox:first").change();
                    isChartCreationOnLoad = false;
                }
            }
            else
                $("#ivirChartPills .ivirChartCheckBox:first").change();

            toggleGridView('grid');
        }
    }
    setSmartViewHeight();
}

/**
 * To ccheck any dependent fields are there when user is applying any conditions
 * @author ManiKanta
 * @Date   2018-11-20T12:01:51+0530
 * @param  {}                 arrayType  
 * @param  {}                 arrayIndex 
 * @param  {}                 getColumns 
 * @return {}                            
 */
function checkForPillDependentFlds(arrayType, arrayIndex, getColumns) {
    if (!getColumns && ivirVisibleColumns.length === 0) {
        //means no columns are hided
        return true;
    }
    var presentObj = ivirMainObj[arrayType][arrayIndex];
    var dependentCols = [];
    if (ivirMainObj[arrayType] && ivirMainObj[arrayType].length > 0) {
        if (arrayType == 'group') {
            dependentCols.push(presentObj.cl);
            var grandTArray = presentObj.g;
            if (grandTArray) {
                for (var i = 0; i < grandTArray.length; i++) {
                    var presentGT = grandTArray[i];
                    if (presentGT != -1 && $.inArray(presentGT, dependentCols) === -1)
                        dependentCols.push(presentGT);
                }
            }
            var totalArray = presentObj.t;
            if (totalArray) {
                for (var j = 1; j < totalArray.length; j = j + 2) {
                    var presentT = totalArray[j];//present total array
                    if (presentT != -1 && $.inArray(presentT, dependentCols) === -1)
                        dependentCols.push(presentT);
                }
            }
        } else if (arrayType == 'chart') {
            dependentCols = [presentObj.cl, presentObj.v];
        }
    }
    if (getColumns) {
        return dependentCols;
    }
    var dependentColsLength = dependentCols.length;
    var allColsPresent = true;
    for (var i = 0; i < dependentColsLength; i++) {
        if ($.inArray(FieldName.indexOf(dependentCols[i]), ivirVisibleColumns) === -1) {
            $("#" + arrayType + "pillCB" + arrayIndex).prop("checked", false);
            allColsPresent = false;
            $("#IvirActions").val("SHcolumns").change();
            showAlertDialog("warning", errorMessages.dependentColumns);
            pillDependentCols.index = arrayIndex;
            pillDependentCols.data = dependentCols;
            pillDependentCols.type = arrayType;
            return false;
        }
    }

    return true;;
}


$(window).resize(delay(function () {
    if ($(".dataTables_scrollHead table thead tr th:last-child").visible(true)) {
        $(".dataTables_scrollHead").off('keydown');
    } else {
        $(".dataTables_scrollHead").on('keydown', function (e) {
            var keyCode = e.keyCode || e.which;

            if (keyCode == 9) {
                e.preventDefault();
            }
        });
    }

}, 100));

//to get filter pill index
//returns pill index - if exists, -1 - if not
function getFiltersPillIndex() {
    var prevDrawnMoreFilters = $("#newViewTabId .filter-body-cont").parent();
    var pillindex = -1;
    if (prevDrawnMoreFilters.length > 0) {
        pillindex = prevDrawnMoreFilters.find(".filter-body-cont").data("pillindex");
        return pillindex == -1 ? undefined : pillindex;
    }
}

function showDataTableLoading() {
    ShowDimmer(true);
}

function hideDataTableLoading() {
    $("body").removeClass("stay-page-loading");
    ShowDimmer(false);
}

/**
 * @description : createdCell / createCustomElement : Function to process individual data which can be used in datatable and also in thirdparty pluguns
 * @author Prashik
 * @date 2020-01-09
 * @param {*} elem = jQuery empty html element or document element that should be passed to function and will be further filled with processedData [eg: $("<div />") / document.createElement("div")]
 * @param {*} cellData : Current Data that should be processed
 * @param {*} rowData : complete rowData
 * @param {int} row : row index starting from 0 in ivDatas json onject 
 * @param {int} col : data index starting from 0 for given rowData as per FieldName
 * 
 * @return {htmlObj} jQuery html element will be returned with processed data that can be attached anywhere in dom [eg: html : <div>Processed Data</div>]
 */
var createdCell = createCustomElement = (elem, cellData, rowData, row, col, parseTemplete = true) => {
    if (typeof rowRefreshIndex != "undefined") {
        row = rowRefreshIndex;
    }
    isSpecialRow = false;

    let dtColumnName = dtColumns[col].name;

    if (iName == "inmemdb") {
        dtColumnName = getColumnName(dtColumnName);        
    }

    var colID = FieldName[FieldName.indexOf(dtColumnName)];
    var rowDataAccess = getPropertyAccess(colID);
    //cellDataProcessing
    cellData = processCellData({ td: elem, cellData, rowData, row, col, colID, rowDataAccess });

    cellData = processMask({ td: elem, cellData, rowData, row, col, colID, rowDataAccess });

    if (cellData != "") {
        //generate checkbox column
        if (col == 0) {
            $(elem).html(generateCellCheckbox({ td: elem, cellData, rowData, row, col, colID, rowDataAccess }));
        } else {

            let nonCbComponent = true;
            if(ivHeadRows?.[colID]?.["@ctype"]?.toLowerCase() == "check box"){
                nonCbComponent = false;
                $(elem).html(generateFieldCheckbox({ td: elem, cellData, rowData, row, col, colID, rowDataAccess }));
            }

            if (!isSpecialRow) {
                $(elem).html(generateCellHyperlink({ td: elem, cellData, rowData, row, col, colID, rowDataAccess }));
            } else {
                nonCbComponent ? $(elem).html(cellData) : "";
            }
            applyConditionalFormatting({ td: elem, rowData, colID });

            //Expand/Collapse TreeMethod
            if (cellHeaderConf.root_class_index) {
                $(elem).html(generateExpColTree({ td: elem, cellData, rowData, row, col, colID, rowDataAccess }));
            }
            if (HeaderText[FieldName.indexOf(dtColumnName)] != "" && HeaderText[FieldName.indexOf(dtColumnName)] != "$nbsp;" && enableCardsUi && !cardTemplatingHTML) {
                $(elem).children().wrap(`<div class="cardLabelContent"></div>`);
                $(elem).prepend("<label>" + HeaderText[FieldName.indexOf(dtColumnName)] + ":</label>");
            }
            }
    } else {
        $(elem).html("");
    }
    if (!iviewWrap)
        $(elem).css({ "white-space": "nowrap" });
    else
        $(elem).css({ "word-break": "break-word" });

    try {
        var columnTemplatingHTML = "";
        var columnTemplatingObj;
        try {
            columnTemplatingObj = ivTemplates.filter((val, data) => {
                return getCaseInSensitiveJsonProperty(val, "ELEMENTS")[0].toLowerCase() == colID.toLowerCase()
            });
        } catch (ex) { }

        columnTemplatingHTML = injectProductColumnTemplate(iName, colID);

        if (columnTemplatingObj && columnTemplatingObj.length && !columnTemplatingHTML) {
            columnTemplatingHTML = getCaseInSensitiveJsonProperty(columnTemplatingObj[0], "CVALUE")[0];
        }

        if (columnTemplatingHTML && parseTemplete) {
            renderColumnTemplete({ hbHTML: columnTemplatingHTML, td: elem, cellData, rowData, row, col, colID, rowDataAccess });
        }
    } catch (ex) { }

    try {
        createdCellEndCustom(elem, cellData, rowData, row, col);
    } catch (ex) { };
    $(elem).attr("data-field-name", colID);
    return elem;
}

/**
 * @description : Inject custom column templates for product functioalities
 * @author Prashik
 * @date 2022-10-20
 * @param {*} iName : iview name
 * @param {*} colID : column name
 */
function injectProductColumnTemplate(iName, colID){
    if((iName == "ad___acs" || iName == "ad___cfd") && colID == "caption"){
        return `
        <div class="col-12">
            <div class="col-12 d-flex flex-row">
                {{#is name}}
                    <div class="fs-5">
                        {{caption}}({{name}})
                    </div>
                {{else}}
                    <div class="fs-5">
                        - {{caption}} -
                    </div>
                {{/is}}
            </div>
        </div>
        `;
    } else if ((iName == "ad___acs" || iName == "ad___cfd") && colID == "dmy") {
        return `
        <div class="col-12">
            <div class="col-12 d-flex flex-row">
                {{#is name}}
                    <div class="">
                        {{#is runtimetstruct '==' 'T'}}
                            <a href="javascript:void(0);" class="btn btn-light-primary fw-boldest btn-sm px-5" onclick="callAxpertConfigStudio('designform','{{name}}','{{caption}}');">
                                Edit
                            </a>
                        {{else}}
                            <a href="javascript:void(0);" class="btn btn-light-primary fw-boldest btn-sm px-5" onclick="callAxpertConfigStudio('editfield','{{name}}','{{fname}}');">
                                Edit
                            </a>
                            <!--<a href="javascript:void(0);" class="btn btn-light-primary fw-boldest btn-sm px-5" onclick="showAlertDialog('info', 'Popup ' + $(this).text() + ' Page');">
                                Add Rules
                            </a>-->
                        {{/is}}
                    </div>
                {{else}}
                {{/is}}
            </div>
        </div>
        `;
    } else if (iName == "ad___acr" && colID == "dmy") {
        return `
        <div class="col-12">
            <div class="col-12 d-flex flex-row">                    
                    <div class="">
                            <a href="javascript:void(0);" class="btn btn-light-primary fw-boldest btn-sm px-5" onclick="loadAxRuleEngineForm('false','{{axpdef_rulesdefid}}');">
                                Edit
                            </a>                        
                    </div>
            </div>
        </div>
        `;
    } else {
        return "";
    }
}

/**
 * @description : Refresh rowData as per action call
 * @author Prashik
 * @date 2020-06-22
 * @param {*} row : Datatable row object : ivirDataTableApi.row(parseInt(ivDatas[0].rowno)-1)
 * @param {*} newRowData : New row data
 */
function refreshRow(row, newRowData) {
    try {
        newRowData = newRowData || row.data();

        isCheckedRowRefresh = false;

        if (isChkBox == "true") {
            try {
                isCheckedRowRefresh = $(row.node()).find("td:eq(0) input:checkbox").prop("checked") || false;
            } catch (ex) { }
        }

        row.data(newRowData).invalidate();
        rowRefreshIndex = row.index();

        var newRow = ivirDataTableApi.row.add(newRowData).draw();
        $(row.node()).html($(newRow.node()).html());

        newRow.remove().draw();

        try {
            KTMenu?.init();
        } catch (error) { }
    } catch (ex) { }
}

Handlebars.registerHelper('onclick', function (...args) {
    var opts = args.pop();
    var optType = typeof args[0] != "undefined" ? args[0] : "";
    var optName = typeof args[1] != "undefined" ? args[1] : ",";
    var row = typeof args[2] != "undefined" ? args[2] : "";

    let rowData = opts?.data?.root || [];

    return generateCellOnClick($("<td></td>"), optType, optName, row) || "";
});

Handlebars.registerHelper('get', function (...args) {
    var opts = args.pop();
    var name = typeof args[0] != "undefined" ? args[0] : "";

    let data = opts?.data?.root || [];

    return data?.[name] || "";
});

Handlebars.registerHelper('set', function (...args) {
    var opts = args.pop();
    var name = typeof args[0] != "undefined" ? args[0] : "";
    var value = typeof args[1] != "undefined" ? args[1] : "";

    let data = opts?.data?.root || [];

    if (typeof data != "undefined" && name) {
        data[name] = value;
        return true;
    } else {
        return false;
    }
});

/**
 * @description : Process handlebars templete for given iview
 * @author Prashik
 * @date 2020-01-09
 * @param {*} hbHTML : handlebars template
 * @param {*} row : row html object
 * @param {*} data : row data object
 * @param {*} dataIndex : row index starting from 0 for given rowData as per FieldName
 * @additionalProperties
    * axRenderProject: Project Name
    * axRenderRowNo: access row no starting from 1
    * axRenderIName: iview name
 */
function renderRowTemplete(hbHTML, row, data, dataIndex) {
    var processedData = FieldName.reduce((o, key) => Object.assign(o, { [key]: (cellVal = $(row).find(`td[data-field-name="${key}"]`).html(), typeof cellVal != "undefined" ? cellVal : data[getPropertyAccess(key)]) }), {});

    processedData["axRenderProject"] = callParentNew("thmProj") || proj;
    processedData["axRenderIName"] = iName;
    processedData["axRenderRowNo"] = dataIndex + 1;

    try {
        axPreTemplate(processedData, row, data, dataIndex);
    } catch (ex) { }

    let compiledHtml = "";

    try {
        compiledHtml = Handlebars.compile(hbHTML)(processedData);
    } catch (error) {
        console.log("Row Templete", error);
    }

    if (compiledHtml) {
        $(row).html(compiledHtml).css({ "background-color": "initial" }).addClass("rowTemplate");
    }

    try {
        axPostTemplate(processedData, row, data, dataIndex);
    } catch (ex) { }
}

/**
 * @description : Process column handlebars templete
 * @author Prashik
 * @date 2020-01-09
//  * @param {*} hbHTML : handlebars template
//  * @param {*} row : row html object
//  * @param {*} data : row data object
//  * @param {*} dataIndex : row index starting from 0 for given rowData as per FieldName
 * @additionalProperties
    * axRenderProject: Project Name
    * axRenderRowNo: access row no starting from 1
    * axRenderIName: iview name
    * axRenderThis: td javascript object for rendering cell
 */
function renderColumnTemplete({ hbHTML, td, cellData, rowData, row, col, colID, rowDataAccess }) {

    var processedData = FieldName.reduce((o, key, ind) => Object.assign(o, { [key]: (cellVal = createdCell($(`<td></td>`), rowData[getPropertyAccess(key)], rowData, row, ind, false).html(), typeof cellVal != "undefined" ? cellVal : rowData[getPropertyAccess(key)]) }), {});

    processedData["axRenderThis"] = $(td).html()

    processedData["axRenderProject"] = callParentNew("thmProj") || proj;
    processedData["axRenderIName"] = iName;
    processedData["axRenderRowNo"] = row + 1;


    try {
        axPreColumnTemplate(processedData, td, cellData, rowData, row, col, colID, rowDataAccess);
    } catch (ex) { }

    let compiledHtml = "";

    try {
        compiledHtml = Handlebars.compile(hbHTML)(processedData)
    } catch (error) {
        console.log(colID + " Column Templete", error);
    }

    if (compiledHtml) {
        $(td).html(compiledHtml).addClass("columnTemplate");
    }

    try {
        axPostColumnTemplate(processedData, td, cellData, rowData, row, col, colID, rowDataAccess);
    } catch (ex) { }
}

/**
 * @description: Construct Data button panel
 * @author Prashik
 * @date 2020-04-10
 */
function constuctDataButton(task) {
    var filterSelectHtml = "";
    if (requestJSON) {
        filterSelectHtml += `<div class="btn ${iviewButtonStyle == "old" ? "btn-sm" : "btn-icon"} btn-white btn-color-gray-600 btn-active-primary shadow-sm me-2 js-dropdown ivirActionDrpDwn tb-btn" ${iviewButtonStyle != "old" ? `data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-dismiss="click" data-bs-original-title="${callParentNew('lcm')[405]}"` : ""}>`;
        filterSelectHtml += '<input type="hidden" name="IvirActions" id="IvirActions" class="js-dropdown__input" value="">';

        filterSelectHtml += ` <div id="ivirActionButton" class="c-button c-button--dropdown js-dropdown__current ${iviewButtonStyle == "old" ? "menu-link text-gray-600 text-hover-white p-0 menu-dropdown" : "pt-2"}" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end" data-kt-menu-flip="top-end">${iviewButtonStyle == "old" ? `<span class="menu-title">${callParentNew('lcm')[406]}</span><span class="menu-arrow"></span>` : `<span class="material-icons material-icons-style">list_alt</span>`}</div>`;
        
        var MenuClass = iviewButtonStyle == "modern" ? "w-100 w-sm-350px" : "w-200px";
        var MenuItemClass = iviewButtonStyle == "modern" ? "col-4" : "menu-item px-3";
        var MenuItemLinkClass = iviewButtonStyle == "modern" ? "d-flex flex-column flex-center text-center text-gray-800 text-hover-primary bg-hover-light rounded p-3 mb-3" : "menu-link px-3";
        var MenuItemIconClass = iviewButtonStyle == "modern" ? "" : "me-3";

        filterSelectHtml += '<ul class="dropDownButton__list menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bolder py-3 ' + MenuClass + '" data-popper-placement="bottom-end" data-kt-menu="true">';

        if (iviewButtonStyle == "modern") {
            filterSelectHtml += '<div class="card"><div class="card-body py-5"><div class="mh-450px scroll-y me-n5 pe-5"><div class="row g-2">';
        }

        if (iName != "inmemdb") {

            if ($("#hdnIsParaVisible").val() != "hidden") {
                filterSelectHtml += '<li class="dropDownButton__item ' + MenuItemClass + '" data-dropdown-value="paramFilter" title="' + callParentNew('lcm')[478] + '"><a href="javascript:void(0);" class="' + MenuItemLinkClass + '"><span class="material-icons ' + MenuItemIconClass + '">search</span>' + callParentNew('lcm')[478] + '</a></li>';
            }
            filterSelectHtml += '<li id="chartActionLi" class="dropDownButton__item ' + MenuItemClass + '" data-dropdown-value="chart" title="' + callParentNew('lcm')[402] + '"><a href="javascript:void(0);" class="' + MenuItemLinkClass + '"><span class="material-icons ' + MenuItemIconClass + '">add_chart</span>' + callParentNew('lcm')[402] + '</a></li>';
        }

        filterSelectHtml += '<li class="dropDownButton__item d-none ' + MenuItemClass + '" data-dropdown-value="moreFilters" title="' + callParentNew('lcm')[409] + '"><a href="javascript:void(0);" class="' + MenuItemLinkClass + '"><span class="material-icons ' + MenuItemIconClass + '">filter_alt</span>' + callParentNew('lcm')[409] + '</a></li>';
        filterSelectHtml += '<li class="dropDownButton__item d-none ' + MenuItemClass + '" data-dropdown-value="clearFilters" title="' + callParentNew('lcm')[443] + '"><a href="javascript:void(0);" class="' + MenuItemLinkClass + '"><span class="material-icons ' + MenuItemIconClass + '">filter_alt_off</span>' + callParentNew('lcm')[443] + '</a></li>';
        if (iName != "inmemdb") {

            filterSelectHtml += '<li class="dropDownButton__item d-none ' + MenuItemClass + '" data-dropdown-value="sort" title="' + callParentNew('lcm')[403] + '"><a href="javascript:void(0);" class="' + MenuItemLinkClass + '"><span class="material-icons ' + MenuItemIconClass + '">sort</span>' + callParentNew('lcm')[403] + '</a></li>';

            if (!enableCardsUi) {
                filterSelectHtml += '<li class="dropDownButton__item d-none ' + MenuItemClass + '" data-dropdown-value="rowGrouping" title="' + callParentNew('lcm')[404] + '"><a href="javascript:void(0);" class="' + MenuItemLinkClass + '"><span class="material-icons ' + MenuItemIconClass + '">table_rows</span>' + callParentNew('lcm')[404] + '</a></li>';
                filterSelectHtml += '<li class="dropDownButton__item d-none ' + MenuItemClass + '" data-dropdown-value="SHcolumns" title="' + callParentNew('lcm')[401] + '"><a href="javascript:void(0);" class="' + MenuItemLinkClass + '"><span class="material-icons ' + MenuItemIconClass + '">view_week</span>' + callParentNew('lcm')[401] + '</a></li>';
                if (isListView) {
                    filterSelectHtml += '<li class="dropDownButton__item ' + MenuItemClass + '" data-dropdown-value="design" title="' + ("Design" || callParentNew('lcm')[401]) + '"><a href="javascript:void(0);" class="' + MenuItemLinkClass + '"><span class="material-icons ' + MenuItemIconClass + '">design_services</span>' + ("Design" || callParentNew('lcm')[401]) + '</a></li>';
                }
            }
            filterSelectHtml += '<li class="dropDownButton__item d-none ' + MenuItemClass + '" data-dropdown-value="highlighting" title="' + callParentNew('lcm')[396] + '"><a href="javascript:void(0);" class="' + MenuItemLinkClass + '"><span class="material-icons ' + MenuItemIconClass + '">highlight</span>' + callParentNew('lcm')[396] + '</li>';
            filterSelectHtml += '<li class="dropDownButton__item d-none ' + MenuItemClass + '" data-dropdown-value="save" title="' + callParentNew('lcm')[400] + '"><a href="javascript:void(0);" class="' + MenuItemLinkClass + '"><span class="material-icons ' + MenuItemIconClass + '">save</span>' + callParentNew('lcm')[400] + '</a></li>';
            filterSelectHtml += '<li class="dropDownButton__item ' + MenuItemClass + '" data-dropdown-value="saveAs" title="' + callParentNew('lcm')[482] + '"><a href="javascript:void(0);" class="' + MenuItemLinkClass + '"><span class="material-icons ' + MenuItemIconClass + '">add</span>' + callParentNew('lcm')[482] + '</a></li>';

        }

        if (iviewButtonStyle == "modern") {
            filterSelectHtml += '</div></div></div></div>';
        }

        filterSelectHtml += '</ul>';
        filterSelectHtml += '</div>';

        $("#filterWrapper").html(filterSelectHtml);


    }
    else {
        filterSelectHtml += '<div class="js-dropdown ivirActionDrpDwn">';
        filterSelectHtml += '<input type="hidden" name="IvirActions" id="IvirActions" class="js-dropdown__input" value="">';

        filterSelectHtml += '<a href="javascript:void(0)" title="' + callParentNew('lcm')[406] + '" id="ivirActionButton" class="js-dropdown__current btn btn-white btn-sm btn-color-gray-600 btn-active-primary shadow-sm me-2 menu menu-dropdown menu-link" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-start""><span class="menu-title">' + callParentNew('lcm')[406] + '</span><span class="menu-arrow"></span></a>';
        filterSelectHtml += '<ul class="dropDownButton__list menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg-light-primary fw-bold w-200px py-3" data-kt-menu="true" data-popper-placement="top-end">';
        if (iName != "inmemdb") {
            filterSelectHtml += '<li class="dropDownButton__item subHeader menu-item px-3" data-dropdown-value="save" title="' + callParentNew('lcm')[406] + '"><span class="menu-content text-muted pb-2 px-3 fs-7">' + callParentNew('lcm')[406] + '</span></li>';
            filterSelectHtml += '<li class="dropDownButton__item dropdown-itemz menu-item px-3" data-dropdown-value="save" title="' + callParentNew('lcm')[400] + '"><span class="menu-link px-3"><span class="material-icons material-icons-style material-icons-2 me-3">save</span>' + callParentNew('lcm')[400] + '</span></li>';

            if (!enableCardsUi) {
                filterSelectHtml += '<li class="dropDownButton__item dropdown-itemz menu-item px-3" data-dropdown-value="SHcolumns" title="' + callParentNew('lcm')[401] + '"><span class="menu-link px-3"><span class="material-icons material-icons-style material-icons-2 me-3">view_week</span>' + callParentNew('lcm')[401] + '</span></li>';
            }

            var chartClass = "";
            if (task == 'group' || task == 'groupApply')
                chartClass = "subHeader"
            filterSelectHtml += '<li id="chartActionLi" class="dropDownButton__item menu-item px-3 ' + chartClass + '" data-dropdown-value="chart" title="' + callParentNew('lcm')[402] + '"><span class="menu-link px-3"><span class="material-icons material-icons-style material-icons-2 me-3">add_chart</span>' + callParentNew('lcm')[402] + '</span></li>';
        }

        filterSelectHtml += '<li class="dropDownButton__item dropdown-itemz menu-item px-3" data-dropdown-value="moreFilters" title="' + callParentNew('lcm')[409] + '"><span class="menu-link px-3"><span class="material-icons material-icons-style material-icons-2 me-3">filter_list</span>' + callParentNew('lcm')[409] + '</span></li>';
        filterSelectHtml += '<li class="dropDownButton__item dropdown-itemz menu-item px-3" data-dropdown-value="clearFilters" title="' + callParentNew('lcm')[443] + '"><span class="menu-link px-3"><span class="material-icons material-icons-style material-icons-2 me-3">filter_list_off</span>' + callParentNew('lcm')[443] + '</span></li>';
        if (iName != "inmemdb") {
            filterSelectHtml += '<li class="dropDownButton__item dropdown-itemz subHeader menu-item px-3" data-dropdown-value="data" title="' + callParentNew('lcm')[405] + '"><span class="menu-content text-muted pb-2 px-3 fs-7">' + callParentNew('lcm')[405] + '</span></li>';
            filterSelectHtml += '<li class="dropDownButton__item dropdown-itemz menu-item px-3" data-dropdown-value="sort" title="' + callParentNew('lcm')[403] + '"><span class="menu-link px-3"><span class="material-icons material-icons-style material-icons-2 me-3">sort</span>' + callParentNew('lcm')[403] + '</span></li>';
            filterSelectHtml += '<li class="dropDownButton__item dropdown-itemz subHeader menu-item px-3" data-dropdown-value="save" id="Format_header" title="' + callParentNew('lcm')[423] + '"><span class="menu-content text-muted pb-2 px-3 fs-7">' + callParentNew('lcm')[423] + '</span></li>';
            if (!enableCardsUi) {
                filterSelectHtml += '<li class="dropDownButton__item dropdown-itemz menu-item px-3" data-dropdown-value="rowGrouping" title="' + callParentNew('lcm')[404] + '"><span class="menu-link px-3"><span class="material-icons material-icons-style material-icons-2 me-3">table_rows</span>' + callParentNew('lcm')[404] + '</span></li>';
            }
            filterSelectHtml += '<li class="dropDownButton__item dropdown-itemz menu-item px-3" data-dropdown-value="highlighting" title="' + callParentNew('lcm')[396] + '"><span class="menu-link px-3"><span class="material-icons material-icons-style material-icons-2 me-3">highlight</span>' + callParentNew('lcm')[396] + '</span></li>';
        }
        filterSelectHtml += '</ul>';
        filterSelectHtml += '</div>';

        $("#filterWrapper").html(filterSelectHtml);        
    }

    if (requestJSON && appGlobalVarsObject._CONSTANTS.compressedMode) {
        $(".toolbarRightMenu").find(".tb-btn").addClass("btn-sm");
        $(".toolbarRightMenu").find(".tb-btn .material-icons.material-icons-style").addClass("material-icons-2");
    }

    try {
        KTMenu?.init();
    } catch (error) {}
}

function deleteViewtab(tabName) {
    if (!hasBuildAccess && ivirMainViewObj["views"][tabName].applyTo == 'ALL') {
        showAlertDialog("warning", callParentNew('lcm')[484]);
        return false;
    }
    var isActive = $("a#" + tabName).hasClass('active');
    if (isActive) {
        clearExistingPills();
    }


    $("#IvirActions").val("");
    try {
        var applyTo = ivirMainViewObj["views"][tabName].applyTo;
        var viewName = tabName;
        delete ivirMainViewObj["views"][tabName];
        ivirMainObj = {};
        SaveSmartviewJsonToDb("set", JSON.stringify(ivirMainViewObj), applyTo, viewName);
    } catch (e) {

        console.log(e);
    }

    if (isActive)
        getSavedConditionsNew("main", JSON.stringify(ivirMainViewObj));
    else {
        $("a#" + tabName).closest('li').remove();
        reAdjust();
    }
    if ($('#viewTabs').children('li').length == 0) {
        $('#dvViewtabs').hide();
        $('.scroller').hide();
    }
    setSmartViewHeight();


}

function loadViewTab(view) {
    var paramString = ivirMainViewObj["views"][view].params.replace(/`/g, "&grave;");
    var paramValues = ivirMainViewObj["views"][view].paramsList || "";
    paramValues && (paramValues = JSON.parse(JSON.stringify(paramValues).replace(/&amp;/g, "&")));

    var lvColVisibleObj = "";
    if (isListView && ivirMainViewObj["views"][view] && ivirMainViewObj["views"][view].visibleColumns && ivirMainViewObj["views"][view].visibleColumns.length > 0 && ivirMainViewObj["views"][view].visibleColumns[0].structure) {
        lvColVisibleObj = ivirMainViewObj["views"][view].visibleColumns;
    }

    if (paramString != "" && paramString != undefined) {

        SetParamValues(paramString, paramValues);
        if (view != "main" && view != "charts") {
            let ivirMainObj = ivirMainViewObj["views"][view];
            if (ivirMainObj && ivirMainObj.chart && ivirMainObj.chart.length && ivirMainObj.chart.length > 0) {
                $("#hdnWebServiceViewName").val(view);
            }
        }
        setTimeout(function () {
            $("#button1").trigger('click');
        }, 0);
        loadViewName = view;
    }
    else if (isListView && lvColVisibleObj) {
        try {
            var columnsString = _.map(lvColVisibleObj[0].dcs, (dc) => { return dc.fields }).reduce((res, fld) => { res = [...res, ...fld]; return res; }, []).join(",");
            $("#hdnLvSelectedCols").val(columnsString);
            $("#hdnLvSelectedHyperlink").val(lvColVisibleObj[0].hyperlink);
            $("#hdnLvChangedStructure").val(ReplaceUrlSpecialChars(lvColVisibleObj[0].structure));
        } catch (ex) { }
        setTimeout(function () {
            $("#button1").trigger('click');
        }, 0);
        loadViewName = view;
    }
    else {
        clearExistingPills();
        getSavedConditionsNew(view, JSON.stringify(ivirMainViewObj));
    }
}


function pinItemToTaskbar(item) {
    var temp = $(item).clone();
    temp.find('a > i').remove();//remove pin icon
    if (temp.hasClass("dropdown-submenu")) {
        temp.removeClass("dropdown-submenu");
        temp.children('a').append('<span class="menu-arrow"></span>');//add down arrow to dropdown item

        if (temp.attr('id') != "filterWrapper" && (iviewButtonStyle == "modern" || temp.attr('id') != "ivirCButtonsWrapper")) {
            temp.addClass("dropdown");
            temp.find('ul').removeAttr("style");
            if (temp.find('a#tasks'))
                temp.find('li').addClass('liTaskItems');

        }
        else if (temp.find('ul').hasClass('dropdown-menu')) {
            temp.find('ul').removeClass('dropdown-menu');
        }
        if (temp.attr('id') == "ivirCButtonsWrapper") {

            var active = temp.find('ul  a:not(.active):eq(0)');
            $(active).find('.customIcon').removeClass('customIcon');
            $(active).html($(active).html().replace($(active).text(), ''));
            temp.html(active.clone());
        }

    }
    else
        temp.addClass('actionWrapper');

    if (temp.attr('id'))
        temp.attr('id', 'pinned' + temp.attr('id'));
    $.each(temp.find('*'), function (index, element) {
        if ($(element).attr('id')) {
            $(element).attr('id', 'pinned' + $(element).attr('id'));
        }

    });
    $('#pinnediconsUl').append(temp);
    if (temp.attr('id') == "pinnedivirCButtonsWrapper" && iviewButtonStyle == "modern") {

        if ($("#ivirMainDataTableWrapper").is(":visible")) {
            toggleGridView("grid");
        } else {
            toggleGridView("chart");
        }

    }
    setPinedIconContainerWidth();
}

function constructPinnedToolbar() {
    if (!toolbarPinArr.length)
        return false;
    $('#pinnediconsUl').children().remove();
    for (var i = 0; i < toolbarPinArr.length; i++) {
        if ($('#' + toolbarPinArr[i])) {
            if ($('#' + toolbarPinArr[i]).hasClass('dropdown-submenu')) {
                pinItemToTaskbar($('#' + toolbarPinArr[i]));
                $('#' + toolbarPinArr[i]).addClass('pinned')
                $('#' + toolbarPinArr[i]).find('a > i').attr("title", "Unpin from taskbar");
            }
            else {
                pinItemToTaskbar($('#' + toolbarPinArr[i]).parent('li'));
                $('#' + toolbarPinArr[i]).parent('li').addClass('pinned');
                $('#' + toolbarPinArr[i]).find('i').attr("title", "Unpin from taskbar");
            }

        }
    }

}

function mergerSmartviewSettings(json) {
    if (json != "") {
        jsonObj = JSON.parse(json);
        if (jsonObj["all"]) {
            if (jsonObj["all"].views) {
                $.each(jsonObj["all"].views, function (index, val) {
                    if (val["applyTo"] != "ALL")
                        delete jsonObj["all"].views[index];
                });
            }
        }
        var userName = callParentNew("mainUserName");
        var finalJson = $.extend(true, {}, jsonObj["all"], jsonObj[userName]);
        return JSON.stringify(finalJson);
    }
}

function setFilterInfo() {

    var filterInformation = ``;
    if ((processObj = Object.keys(advFiltersObjectToApply).length > 0 ? advFiltersObjectToApply : generateSearchString("JSON")) && (!$.isEmptyObject(processObj) && !processObj.somedummyfilterjsobjectkey)) {
        filterInformation = `
        <div id="myFiltersPillInfo" class="badge badge-primary cursor-pointer" onclick="openFilters = true; ivirMoreFilters();">
            <span id="myFilterPillValues">
                <span class="myFilterPillTooltipNew">
                    ${appGlobalVarsObject.lcm[409]}
                </span>
            </span>
        </div>
        <span data-caption="main" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-dismiss="click" data-bs-original-title="${appGlobalVarsObject.lcm[443]}" onclick="clearFilters();" class="icon-arrows-remove" style="position:relative; top:3px;">
        </span>
        <span class="myFilterPillTooltipText">
            ${Object.keys(processObj).map((key) => {
            if (key != "somedummyfilterjsobjectkey" && processObj[key]) {
                let procObj = processObj[key];
                let textData = "";
                if (dateOptionsId.indexOf(procObj) > -1) {
                    procObj = dateOptions[dateOptionsId.indexOf(procObj)];
                }
                if (typeof procObj == "object" && typeof procObj.min != "undefined" && typeof procObj.max != "undefined") {
                    procObj = `${procObj.min} to ${procObj.max}`;
                }
                if (requestJSON) {
                    textData = procObj.toString().replace(/`/g, ",")
                } else {
                    textData = procObj.toString().replace(/\♣\|♣/g, ",")
                }
                return `
                    <span data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-dismiss="click" data-bs-original-title="${textData}">
                        <span>
                            ${HeaderText[FieldName.indexOf(key)]}
                        </span>: ${textData}
                    </span>
                    `;
            } else {
                return ``;
            }
        }).join(".&nbsp;")}
            </span>
        `;
    }

    if (!$("#dvSelectedFilters").is(":visible")) {
        $(".paramPillContent").addClass("d-none");
    } else {
        $(".paramPillContent").removeClass("d-none");
    }

    if (filterInformation && $("#dvSelectedFilters").is(":visible")) {
        $(".paramPillContent, .filterPillContent").addClass("half");
    } else {
        $(".paramPillContent, .filterPillContent").removeClass("half");
    }
    $(".filterPillContent").html(filterInformation);
    $("#myFiltersPillInfo").data("filterJsonObj", processObj);

}

/**
 * Reset Filters Selection
 * @author Prashik
 * @Date   2019-04-11T11:45:39+0530
 */
function clearFilters() {
    advFiltersObjectToApply = { somedummyfilterjsobjectkey: "dummy" };
    ivirDataTableApi.draw();
    setFilterInfo();
    $("[id^='filterpillCB']").prop('checked', false).removeAttr('checked');
}

function adjustChartBasedWrapperHeight() {
    if ($("#ivirChartWrapper .chartWrapper:visible").length > 0) {
        $(".iviewTableWrapperNew").addClass("chartsAdded");

        var subCaptionHeight = 0;
        try {
            $(".ivcaptions").length ? subCaptionHeight = $(".ivcaptions").toArray().reduce((sum, elem) => sum + $(elem).outerHeight(true), 0) : "";
        } catch (ex) { }

        var mainTabsHeight = 0;
        try {
            $(".mainTabs").length ? mainTabsHeight = $(".mainTabs").outerHeight(true) : "";
        } catch (ex) { }

        var finalHeightChartAdded = Math.round($(window).height() - ($("#breadcrumb-panel").height() + subCaptionHeight + mainTabsHeight));

        $('.iviewTableWrapperNew.chartsAdded').css({ "height": finalHeightChartAdded + "px" });
    } else {
        $(".iviewTableWrapperNew").removeClass("chartsAdded");
        $('.iviewTableWrapperNew').css({ "height": "" });
    }
}

function forceColumnWidth() {
    visibleTableWidth = 0;

    $("#GridView1 tfoot tr td").css({ "width": "", "max-width": "" });

    $(".dataTables_scrollHead table.gridData thead tr:last th").toArray().forEach((th, ind) => {
        let columnName = $(th).data("headerName");

        let applyWidth = (parseInt(ivirMainObj?.design?.filter(dsign => dsign.name == columnName)?.[0]?.width || ivHeadRows[columnName]["@width"] || (isListView && columnName == "rowno" ? listViewCheckBoxSize : minCellWidth)) || 0) + widthIncrement;

        visibleTableWidth += applyWidth;

        $(`.dataTables_scrollHead table.gridData thead tr:last th[data-header-name=${columnName}], .dataTables_scrollBody table.gridData thead tr:last th[data-header-name=${columnName}], .dataTables_scrollFoot table.gridData tfoot tr td:eq(${ind})`).css({ "width": `${applyWidth}px`, "max-width": `${applyWidth}px` });
    });

    $(".gridData").css({ "width": `${visibleTableWidth}px` });
}
let subHeadGroup = {};
function saveSubHeadInfo(row, data, dataIndex) {
    if (data?.axrowtype == "subhead") {
        subHeadGroup[dataIndex] = data;
    } else if ((dataIndex - 1) == Object.keys(subHeadGroup).getMaxVal() && subHeadGroup[Object.keys(subHeadGroup).getMaxVal()] != null) {
        subHeadGroup[dataIndex] = null;
    }
}

function getLayoutHTML(cardTemplatingHTML) {
    switch (cardTemplatingHTML) {
        case "card":
            return `
            <style>
                table#GridView1 {
                    width: 70% !important;
                    margin: 0 auto;
                }

                tr.rowTemplate {
                    box-shadow: none !important;
                }

                @media (max-width: 960px) {
                    table#GridView1 {
                        width: 85% !important;
                    }
                }

                @media (max-width: 768px) {
                    table#GridView1 {
                        width: 85% !important;
                    }
                }

                @media (max-width: 600px) {
                    table#GridView1 {
                        width: 95% !important;
                    }
                }

                @media (max-width: 480px) {
                    table#GridView1 {
                        width: 95% !important;
                    }
                }

                @media (max-width: 320px) {
                    table#GridView1 {
                        width: 95% !important;
                    }
                }
            </style>
            <div class="container show" style="width: 100%; padding: 0px 30px;">
                <div class="row">

                    <section class="panel panel-primary card">
                        <div class="pull-right panel-header">
                            <div class="section-apt-status" style="padding: 15px;">
                                {{#is axp_status}}
                                    {{#is axp_status 'toLower' 'active'}}
                                    <span class="apt-status-color" style="padding: 12px; border-radius: 50%; background: green; display: inline-block;"></span>
                                    {{/is}}
                                    {{#is axp_status 'toLower' 'delayed'}}
                                    <span class="apt-status-color" style="padding: 12px; border-radius: 50%; background: red; display: inline-block;"></span>
                                    {{/is}}
                                    {{#is axp_status 'toLower' 'progress'}}
                                    <span class="apt-status-color" style="padding: 12px; border-radius: 50%; background: orange; display: inline-block;"></span>
                                    {{/is}}
                                    <span class="apt-status-text" style="display: inline-block; padding: 6px 12px; vertical-align: super; font-size: 16px; font-style: italic;">{{axp_status}}</span>
                                {{/is}}                        

                                {{#is axrowoptions}}
                                <ul class="header-dropdown" style="list-style: none; display: inline-block;">
                                    <li class="dropdown">
                                        <a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown"
                                            role="button" aria-haspopup="true" aria-expanded="true">
                                            <i class="material-icons">more_vert</i>
                                        </a>
                                        <ul class="dropdown-menu pull-right">
                                            {{#each (split axrowoptions '~')}}
                                            <li><a href="javascript:void(0);"
                                                    onclick="{{onclick (split this ',' '2') (split this ',' '0') ../axRenderRowNo}}"><i
                                                        class="material-icons" style="margin-right: 5px;">{{split this ','
                                                        '3'}}</i><span style="position: relative; top: -5px;">{{split this ','
                                                        '1'}}</span></a></li>
                                            {{/each}}
                                        </ul>
                                    </li>
                                </ul>
                                {{/is}}
                            </div>
                        </div>
                        <div class="panel-body clearfix">

                            {{#is axp_icon_img}}
                            <div class="pull-left"
                                style="position: relative; padding: 10px; width: 95px; height: 130px; margin-left: -10px;">
                                <img src="../{{axRenderProject}}/Images/{{axp_icon_img}}" alt="image" style="max-width: 75px; position: absolute; bottom: 50%; left: 50%; transform: translate(-50%, 50%);" />
                            </div>

                            {{else}}
                                {{#is axp_icon}}
                                <div class="pull-left section-apt-icon"
                                    style="border-radius: 50px; background-color: blue; position: absolute; padding: 35px; margin-right: 25px; display: inline-block; top: 50%; transform: translate(0, -50%);">
                                    <span class="apt-icon"
                                        style="color: white; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); font-size: 20px;">{{axp_icon}}</span>
                                    <div class="clearfix"></div>
                                </div>
                                {{/is}}
                            {{/is}}


                            <div class="section-apt-text" style="padding: 0 10px; margin-left: 85px;">
                                <h2>{{{axp_title}}}</h2>

                                <p>{{axp_description}}</p>
                            </div>

                        </div>
                    </section>

                </div>
            </div>
            `;
            break;
        case "tile":
            return `
            <style>
                table#GridView1 {
                    width: 100% !important;
                    margin: 0 auto;
                    display: inline-block;
                }

                table#GridView1 tbody {
                    display: flex;
                    flex-wrap: wrap;
                    align-content: flex-start;
                }

                tr.rowTemplate {
                    box-shadow: none !important;
                    width: 33.333333% !important;
                    margin: 0 !important;
                    display: inline-block;
                }

                @media (max-width: 960px) {
                    tr.rowTemplate {
                        width: 33.333333% !important;
                    }
                }

                @media (max-width: 768px) {
                    tr.rowTemplate {
                        width: 50% !important;
                    }
                }

                @media (max-width: 600px) {
                    tr.rowTemplate {
                        width: 50% !important;
                    }
                }

                @media (max-width: 480px) {
                    tr.rowTemplate {
                        width: 100% !important;
                    }
                }

                @media (max-width: 320px) {
                    tr.rowTemplate {
                        width: 100% !important;
                    }
                }
            </style>
            <div class="container show" style="width: 100%; padding: 0px 30px;">
                <div class="row">
                <section class="panel panel-primary card" style="max-width: 100%">
                        <div class="pull-right" style="padding: 15px 10px;/* position: relative; */">
                            {{#is axrowoptions}}
                            <ul class="header-dropdown" style="list-style: none;/* display: inline-block; */padding: 0;/* margin-top: 20px; */position: relative;top: 10px;">
                            <li class="dropdown">
                                <a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown"
                                role="button" aria-haspopup="true" aria-expanded="true">
                                <i class="material-icons">more_vert</i>
                                </a>
                                <ul class="dropdown-menu pull-right">
                                {{#each (split axrowoptions '~')}}
                                <li><a href="javascript:void(0);" onclick="{{onclick (split this ',' '2') (split this ',' '0') ../axRenderRowNo}}"><i class="material-icons" style="margin-right: 5px;">{{split this ','
                                    '3'}}</i><span style="position: relative; top: -5px;">{{split this
                                    ','
                                    '1'}}</span></a></li>
                                {{/each}}
                                </ul>
                            </li>
                            </ul>
                            {{/is}}
                        </div>
                        <div style="padding: 10px 15px 0px;">
                            <div class="">
                                {{#is axp_icon_img}}
                                <div class="left" style="position: relative; padding: 2px; display: inline-block;">
                                <img src="../{{axRenderProject}}/Images/{{axp_icon_img}}" alt="Not Found" style="max-width: 70px;" />
                                </div>
                                {{else}}
                                    {{#is axp_icon}}
                                    <div class="section-apt-icon text-center"
                                        style="border-radius: 50%;background-color: blue;position: relative;padding: 35px;/* margin-right: 25px; */display: inline-block;/* left: -50%; *//* transform: translate(-50%, -50%); */">
                                    <span class="apt-icon"
                                            style="color: white; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); font-size: 20px;">{{axp_icon}}</span>
                                    <div class="clearfix"></div>
                                    </div>
                                    {{/is}}
                                {{/is}}
                                <div class="section-apt-title" style="display: inline-block;padding: 0 15px;position: relative;vertical-align: top;">
                                <h2 style="/* display: inline-block; */">
                                    {{{axp_title}}}
                                </h2>
                            </div>
                            </div>     	                	
                        </div>
                        <div class="panel-body">
                            <hr style="margin: 0px 0px 10px;"/>
                            <div class="section-apt-text" style="padding: 0 10px;">
                                <p>{{axp_description}}</p>
                            </div>
                            {{#is axp_status}}
                                <hr style="margin: 0px 0 10px;"/>
                                <div class="left" style="padding: 5px;display: inline-block;/* background-color: #f5f5f5; *//* border: 1px solid #ccc; *//* border-radius: 5px; */">
                                {{#is axp_status 'toLower' 'active'}}
                                <span class="apt-status-color" style="padding: 12px; border-radius: 50%; background: green; display: inline-block;"></span>
                                {{/is}}
                                {{#is axp_status 'toLower' 'delayed'}}
                                <span class="apt-status-color" style="padding: 12px; border-radius: 50%; background: red; display: inline-block;"></span>
                                {{/is}}
                                {{#is axp_status 'toLower' 'progress'}}
                                <span class="apt-status-color" style="padding: 12px; border-radius: 50%; background: orange; display: inline-block;"></span>
                                {{/is}}
                                <span class="apt-status-text" style="display: inline-block; padding: 6px 12px; vertical-align: super; font-size: 16px; font-style: italic;">{{axp_status}}</span>     
                                </div>
                            {{/is}}
                        </div>
                    </section>
                </div>
            </div>
            `;
            break;
        case ""://table
        default:
            return cardTemplatingHTML;
            break;
    }
}

function parseJSON(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return false;
    }
}

/* SmartView :: Filter, Sort, Row Grouping, Columns, Highlight */
function smartStepper(newViewTab, viewTabName, viewTabCaption) {

    ShowDimmer(true);
    /* Variables */
    var svElement;
    var stepper;
    var showValueOption;
    var svOptionsObj = Object.keys(newBtnGroup).map(key => newBtnGroup[key]).filter(obj => obj.visible);

    if (viewTabName == "main" && viewTabCaption == "main" && isListView) {
        svOptionsObj = svOptionsObj.filter(opt => opt.name == "design");
    }
    
    var saveView = `saveViewActionRef("${(newViewTab ? "Add View" : "Edit View")}", "view", "saveInSessionBeforeSaveNew", ${showValueOption}, ${!newViewTab ? true : false})`;

    /* Section :: HTML */
    var smartViewStepperHTML = `<div class="stepper stepper-pills card bg-transparent border-0 h-100">        
        <div class="card-header d-block p-0 bg-transparent border-0">
            <div class="stepper-nav bg-white rounded-2 flex-center flex-wrap">
                ${
                    svOptionsObj.map((element, index) => {
                    return `<div class="stepper-item mx-2 my-4 ${index == 0 ? "current" : ""}" data-kt-stepper-element="nav" data-kt-stepper-action="step" data-kt-stepper-action="click" data-svname="${element.name}">
                        <div class="stepper-line w-40px"></div>
                        <div class="stepper-icon w-40px h-40px">
                            <span class="stepper-check material-icons material-icons-style material-icons-2">${element.icon}</span>
                            <span class="stepper-number material-icons">${element.icon}</span>
                        </div>
                        <div class="stepper-label">
                            <h3 class="stepper-title">
                                ${element.caption}
                            </h3>                       
                        </div>
                    </div>`;
                    }).join("")
                }                
            </div>
        </div>
        <div class="card-body p-0">
            <div class="form w-lg-75 w-md-50 w-sm-100 mx-auto" novalidate="novalidate">
                <div class="mb-5">
                    ${
                        svOptionsObj.map((element, index) => {
                            return `<div class="flex-column ${((element.task == "column" && !isListView) || element.task == "sort") ? "w-lg-50 w-md-75 w-sm-100 mx-auto" : (element.task == "column" && isListView) ? "w-lg-75 w-md-75 w-sm-100 mx-auto" : "" } ${index == 0 ? "current" : ""}" data-kt-stepper-element="content" data-svname="${element.name}">
                                ${element.html(!newViewTab)}
                            </div>`;
                        }).join("")
                    }                    
                </div>                
            </div>
        </div>        
    </div>
    `;

    var viewHeaderHTML = `<label class="input-group border-bottom required"> 
        <input required id="viewName" type="text" class="d-none form-control" maxlength="20" tabindex="-1" value="${viewTabName}" ${viewTabName && !newViewTab ? `disabled="disabled"` : ``} />

        <input required id="viewCaption" type="text" class="form-control form-control-transparent ps-12" maxlength="20" tabindex="-1" placeholder="Enter View Name..." title="Enter View Name..." value="${viewTabCaption}" ${viewTabCaption && !newViewTab ? `disabled="disabled"` : ``} /> 

        <span class="material-icons material-icons-style material-icons-2 material-icons-lg-3 cursor-default position-absolute top-50 translate-middle-y ms-4 z-index-3">
            edit
        </span>
    </label>
    
    <label class="input-group gap-5 ${!hasBuildAccess ? `d-none` : ``}">                    
        <label class="form-label col-form-label pb-1 fw-boldest text-gray-500 fst-italic">for</label>
        <select class="form-select form-select-white border-bottom dialogSlctFld" id="viewAplyTo" placeholder="Apply To">
            <option value=${callParentNew("mainUserName")}>${callParentNew("mainUserName")}</option>
            <option value="ALL">ALL</option>
        </select>
    </label>

    <label class="input-group gap-5 w-600px ${!isListView ? `d-none` : ``}">
        <!--<div class="vr h-25px bg-dark my-3"></div>-->   
        <label class="form-label col-form-label pb-1 fw-boldest text-gray-500 fst-italic">set as</label>
        <div class="form-check form-switch form-check-custom form-check-solid--- px-1">
            <label for="asDefaultView" class="form-check-label form-label col-form-label pb-1 fw-boldest opacity-100 noempty nopurpose col-form-label-sm fs-6">
                Default View
            </label>
            <input type="checkbox" id="asDefaultView" title="" style="" name="asDefaultView" class="form-check-input opacity-100 tem custInpChk w-50px h-25px ms-2" ${ivirMainObj?.groupName === currView && currView != "" && !newViewTab ? ` checked="checked" ` : ``} />
        </div>
    </label>
    `;

    var buttonDeleteResetHTML = `${(!newViewTab && viewTabName != "main") ? `<span class="btn btn-icon btn-light btn-active-light-danger shadow-sm me-2" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-dismiss="modal" data-bs-original-title="Delete View" onclick="deleteViewtab('${viewTabName}')">
        <span class="material-icons material-icons-style">
            delete
        </span>
    </span>` : ``
    }
    
    <span class="btn btn-icon btn-light btn-active-light-primary shadow-sm sv-btn-reset" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-dismiss="click" data-bs-original-title="${appGlobalVarsObject.lcm[393]}">
        <span class="material-icons material-icons-style">
            auto_mode
        </span>
    </span>
    `;

    var buttonApplyHTML = `<button type="button" class="btn btn-light-primary btn-active-primary shadow-sm sv-btn-apply">
        ${appGlobalVarsObject.lcm[442]}
    </button>
    `;

    /* Section :: Modal */
    let myModal = new BSModal("newViewTabId", "", smartViewStepperHTML, (shown) => {

        /* Onload CallBacks */
        svOptionsObj.map((element, index) => {
            if (element.task == "filter") {
                return initMoreFiltersAddOns();
            } else {
                if ((element.task == "group" || element.task == "highlight") && !newViewTab) {
                    ivirMainObj[element.task] ? showValueOption = [element.task, 0] : "";
                }
                else if (element.task == "column" && isListView && ivirMainObj.visibleColumns) {
                    $("#selColHypOpts").val(ivirMainObj.visibleColumns[0].hyperlink).trigger("change");
                }
                return onContentReadyRef(element.task, showValueOption, !newViewTab ? true : false);
            }

        }).join("");

        /* Init :: Stepper */
        svElement = document.querySelector("#newViewTabId");
        stepper = new KTStepper(svElement);

        var applyButtonInnerText = `${appGlobalVarsObject.lcm[442]} ${stepper.steps[stepper.getCurrentStepIndex() -1].getElementsByClassName("stepper-title")[0].innerText}`;
        document.getElementsByClassName("sv-btn-apply")[0].innerText = applyButtonInnerText;

        /* Stepper :: go to clicked step */
        stepper.on("kt.stepper.click", function (stepper) {
            stepper.goTo(stepper.getClickedStepIndex());
            applyButtonInnerText = `${appGlobalVarsObject.lcm[442]} ${stepper.steps[stepper.getCurrentStepIndex() -1].getElementsByClassName("stepper-title")[0].innerText}`;
            document.getElementsByClassName("sv-btn-apply")[0].innerText = applyButtonInnerText;
        });

        try {

            /* Init :: all Smartview options */
            $("select.stepperSelect").select2({
                allowClear: true,
                dropdownParent: document.getElementById("newViewTabId"),
                placeholder: appGlobalVarsObject.lcm[441],
                tags: true,
                tokenSeparators: ['`']
            });

            /* Init :: apply to in header only */
            $("select#viewAplyTo").select2({
                allowClear: true,
                minimumResultsForSearch: Infinity,
                placeholder: appGlobalVarsObject.lcm[441],
                width: 'resolve'
            });

            if(!newViewTab){
                let {applyTo} = ivirMainViewObj.views[viewTabName];

                if(applyTo){
                    $("select#viewAplyTo").val(applyTo).trigger("change");
                }

                $("select#viewAplyTo").prop('disabled', true).next(".select2").find(".select2-selection").addClass("bg-white");
            }

            KTApp?.initBootstrapTooltips();

            // hasBuildAccess = false;
            // if (!hasBuildAccess) {
            //     $('#viewAplyTo').append(new Option(callParentNew("mainUserName"), callParentNew("mainUserName"), true, true)).trigger("change");
            // }

            $(document).off("click", ".sv-btn-apply").on("click", ".sv-btn-apply", () => {
                let svTask = newBtnGroup[stepper.steps[stepper.currentStepIndex - 1].dataset.svname]?.task;

                saveViewActionRef(`${(newViewTab ? "Add View" : "Edit View")}`, `${svTask}`, newBtnGroup[stepper.steps[stepper.currentStepIndex - 1].dataset.svname]?.apply, (newViewTab ? showValueOption : [svTask, 0]), (!newViewTab ? true : false));
                showAlertDialog(`info`, `${newBtnGroup[stepper.steps[stepper.currentStepIndex - 1].dataset.svname]?.caption} applied. Please ${appGlobalVarsObject.lcm[400]} to see the changes.`);

            }).off("click", ".sv-btn-reset").on("click", ".sv-btn-reset", () => {
                newBtnGroup[stepper.steps[stepper.currentStepIndex - 1].dataset.svname]?.clear();
                showAlertDialog(`success`, `${newBtnGroup[stepper.steps[stepper.currentStepIndex - 1].dataset.svname]?.caption} ${appGlobalVarsObject.lcm[393]}.`);
            });

        } catch (error) { }

        setTimeout(() => {
            ShowDimmer(false);
        }, 0);

    }, (hide) => {
        {
            if(oldLoadViewName){
                $(`.lnkViewTab#${oldLoadViewName}`).click();
            }
        }

        oldLoadViewName = "";
        /* Unload CallBacks */
        setTimeout(() => {
            onCloseRef(newBtnGroup[stepper.steps[stepper.currentStepIndex - 1].dataset.svname]?.task);
            stepper = undefined;
        }, 0);
    });

    /* Section :: myModal methods */
    myModal.changeSize("fullscreen");
    myModal.scrollableDialog();

    myModal.okBtn.innerText = appGlobalVarsObject.lcm[400];
    myModal.okBtn.setAttribute(`onclick`, `${saveView}`);
    myModal.okBtn.removeAttribute("data-bs-dismiss");

    myModal.cancelBtn.classList.add("d-none");

    myModal.modalFooter.classList.add(..."hstack gap-2".split(" "));

    /* Section :: add/edit view name & user permission */
    var headerExtras = document.createElement("div");
    headerExtras.classList.add(..."d-flex col-11 gap-5".split(" "));
    myModal.modalHeader.prepend(headerExtras);
    myModal.headerExtras = headerExtras;
    myModal.headerExtras.innerHTML = viewHeaderHTML;
    myModal.modalHeader.getElementsByClassName("btn-close")?.[0].setAttribute(`onclick`, `cancelViewActionRef("${(newViewTab ? "Add View" : "Edit View")}")`);

    /* Section :: footerExtras object */
    var footerExtras = document.createDocumentFragment();
    myModal.footerExtras = footerExtras;

    /* Section :: footerExtras => button separator */
    var buttonSeparator = document.createElement("div");
    buttonSeparator.classList.add(..."vr h-30px bg-dark m-3".split(" "));
    myModal.modalFooter.prepend(buttonSeparator);
    myModal.footerExtras.buttonSeparator = buttonSeparator;

    /* Section :: footerExtras => apply filter, sort... option */
    var buttonApply = document.createElement("div");
    buttonApply.classList.add(..."d-flex gap-2".split(" "));
    myModal.modalFooter.prepend(buttonApply);
    myModal.footerExtras.buttonApply = buttonApply;
    myModal.footerExtras.buttonApply.innerHTML = buttonApplyHTML;

    /* Section :: footerExtras => delete view & Reset filters, sort... option */
    var buttonDeleteReset = document.createElement("div");
    buttonDeleteReset.classList.add(..."d-flex gap-2 me-auto".split(" "));
    myModal.modalFooter.prepend(buttonDeleteReset);
    myModal.footerExtras.buttonDeleteReset = buttonDeleteReset;
    myModal.footerExtras.buttonDeleteReset.innerHTML = buttonDeleteResetHTML;
}

/* Chart Modal */
function smartCharts(chartParam = true, showValueOption = undefined, isEditPill = false) {

    let myModal = new BSModal(appGlobalVarsObject.lcm[410], appGlobalVarsObject.lcm[410], getChartHtml(!chartParam), () => {

        $("select.chartSelect").select2({
            allowClear: true,
            dropdownParent: document.getElementById(appGlobalVarsObject.lcm[410]),
            placeholder: appGlobalVarsObject.lcm[441],
        });

        onContentReadyRef("chart", showValueOption, isEditPill);

        KTApp?.initBootstrapTooltips();
    }, () => {
        onCloseRef("chart");
    });

    myModal.changeSize("fullscreen");
    myModal.scrollableDialog();

    myModal.okBtn.innerText = appGlobalVarsObject.lcm[399];
    myModal.okBtn.removeAttribute("data-bs-dismiss");
    myModal.okBtn.addEventListener("click", () => {
        saveViewActionRef("Charts", "chart", newBtnGroup.charts.apply, showValueOption, isEditPill);
    });

}

/* Get row grouping's condition row on add condtion */
function getRowGroupingCondtionHtml() {
    var htmlToShow = `
    <div class="col-md-4 col-sm-12">
        <div class="form-group">
            <label for="totalAggrFunction" class="form-label col-form-label pb-1 fw-boldest">Function</label>
            <select class="form-select stepperSelect totalAggrFunction">
                <option value="">${appGlobalVarsObject.lcm[441]}</option>
                <option value="sum">Sum</option>
                <option value="count">Count</option>
                <option value="max">Max</option>
                <option value="min">Min</option>
                <option value="avg">Average</option>
            </select>
        </div>
    </div>
    <div class="col-md-4 col-sm-12">
        <div class="form-group">
            <label for="totalSource" class="form-label col-form-label pb-1 fw-boldest">Source</label>
            <a href="javascript:void(0);" class="ms-2 align-middle icon-arrows-question" tabindex="-1"
                data-bs-toggle="tooltip" data-bs-placement="right" data-bs-dismiss="click"
                data-bs-original-title="Please select the column, which will be used by the function for computation.">
                <span class="material-icons material-icons-style material-icons-3">help_outline</span>
            </a>
            <select class="form-select stepperSelect totalSource">
                <option value="">${appGlobalVarsObject.lcm[441]}</option>
            </select>
        </div>
    </div>
    <div class="d-flex flex-row-auto flex-center gap-3 col-md-4 firstRow grpaddDltBtnWrapper">
        <label class="form-label col-form-label pb-1 fw-boldest labelP">Grand Total</label>
        <div class="checkbox grndTotalWrapper">
            <label class="form-check form-check-sm form-check-custom form-check-solid grndTtlCB">
                <input disabled type="checkbox" value="" class="form-check-input">
            </label>
        </div>
        <button type="button" title="Add" onclick="ivirAddTotalCndtn(2);"
            class="btn btn-sm btn-icon btn-active-light-primary shadow-sm ivirTotalCndtnBtn">
            <i class="material-icons material-icons-style material-icons-1 ivirTotalCndtnIcon">add</i>
        </button>
    </div>
    `;

    return htmlToShow;
}

/* Listview Design Modal */
function smartDesign(lvDesignHTML) {

    let applyToHTML = `<label class="input-group border-bottom required d-none"> 
    <input required id="viewName" type="text" class="d-none form-control" maxlength="20" tabindex="-1" value=""} />

    <input required id="viewCaption" type="text" class="form-control form-control-transparent ps-12" maxlength="20" tabindex="-1" placeholder="Enter View Name..." title="Enter View Name..." value="main"} /> 

    <span class="material-icons material-icons-style material-icons-2 material-icons-lg-3 cursor-default position-absolute top-50 translate-middle-y ms-4 z-index-3">
        edit
    </span>
</label>

<label class="input-group gap-5 ${!hasBuildAccess ? `d-none` : ``}">                    
    <label class="form-label col-form-label pb-1 fw-boldest text-gray-500 fst-italic">Design for</label>
    <select class="form-select form-select-white border-bottom dialogSlctFld" id="viewAplyTo" placeholder="Apply To">
        <option value=${callParentNew("mainUserName")}>${callParentNew("mainUserName")}</option>
        <option value="ALL">ALL</option>
    </select>
</label>`;

    let myModal = new BSModal("design", "", lvDesignHTML, () => {
        onContentReadyRef("design", undefined, false);

        $("select#viewAplyTo").select2({
            allowClear: true,
            dropdownParent: document.getElementById("design"),
            minimumResultsForSearch: Infinity,
            placeholder: appGlobalVarsObject.lcm[441],
            width: 'resolve'
        });
    }, () => {
        onCloseRef("design");
    });

    myModal.changeSize("fullscreen");
    myModal.scrollableDialog();
    myModal.cancelBtn.classList.add("d-none");

    myModal.okBtn.innerText = appGlobalVarsObject.lcm[399];
    myModal.okBtn.removeAttribute("data-bs-dismiss");
    myModal.okBtn.addEventListener("click", () => {
        saveViewActionRef("Design", "design", newBtnGroup.design.apply, undefined, false);
    });

    var headerExtras = document.createElement("div");
    headerExtras.classList.add(..."d-flex col-6 gap-5".split(" "));
    myModal.modalHeader.prepend(headerExtras);
    myModal.headerExtras = headerExtras;
    myModal.headerExtras.innerHTML = applyToHTML;

}

function loadAxRuleEngineForm(isOpen,paramVal='') {
    if (isOpen == 'true') {
        createAxRulesPopup('tstruct.aspx?act=open&transid=axrlr&AxPop=true');
    } else {
        createAxRulesPopup('tstruct.aspx?act=load&transid=axrlr&axpdef_rulesdefid=' + paramVal +'&AxPop=true');
    }
}

function createAxRulesPopup(modalBodyLink, delayLoad = false) {

    try {
        var modalId = "loadPopUpPage";

        var iFrameModalBody = `<iframe id="${modalId}" name="${modalId}" class="col-12 flex-column-fluid w-100 h-100 p-0 my-n1" src="${delayLoad ? "" : modalBodyLink}" frameborder="0" allowtransparency="True"></iframe>`;

        let myModal = new BSModal(modalId, "", iFrameModalBody,
            (opening) => {
                if (delayLoad) {
                    try {
                        myModal.modalBody.querySelector(`#${modalId}`).contentWindow.location.href = modalBodyLink;
                    } catch (ex) { }
                }
            },
            (closing) => {
                var isAxPop = modalBodyLink.indexOf("AxPop=true") > -1;
                if (isAxPop && (window.document.title == "Iview" || window.document.title == "Listview")) {
                    window.location.href = window.location.href;
                }
            }
        );

        myModal.changeSize("fullscreen");
        myModal.hideHeader();
        myModal.hideFooter();
        myModal.showFloatingClose();
        myModal.modalBody.classList.add("p-0", "overflow-hidden");
    } catch (error) {
        showAlertDialog("error", error.message);
    }
}

/**
 * @description: process masking information for report
 * @author Prashik
 * @date 06/01/2023
 * @param {*} { td, cellData, rowData, row, col, colID, rowDataAccess }
 * @return {*}  
 */
function processMask({ td, cellData, rowData, row, col, colID, rowDataAccess }){
    let returnData = cellData;
    let maskObj;
    if((maskObj = ivHeadRows[colID]["@mask"]) && maskObj.maskchar){
        // maskObj.maskchar = "@";
        if (maskObj.masking == "Mask all characters" && (maskObj.maskroles ? ((AxRole?.split(",") || []).some(val=>(maskObj.maskroles?.split(",") || []).indexOf(val) > -1)) : false)){
            returnData = maskObj.maskchar.repeat(returnData.toString().length);
        }
        else if(maskObj.masking == "Show few characters"){
            let prefixVisibleMaskCount = +maskObj.firstcharmask;
            let postfixVisibleMaskCount = +maskObj.lastcharmask;
            
            if(prefixVisibleMaskCount){
                if(returnData.toString().length < prefixVisibleMaskCount){
                    prefixVisibleMaskCount = returnData.toString().length;
                }

                // let regex = new RegExp(`^.{${prefixVisibleMaskCount}}`, "gm");

                // returnData = returnData.replace(regex, maskObj.maskchar.repeat(prefixVisibleMaskCount));

                returnData = RevMaskCharacter(returnData.toString(), maskObj.maskchar, prefixVisibleMaskCount);
            }

            if(postfixVisibleMaskCount){
                if(returnData.toString().length < postfixVisibleMaskCount){
                    postfixVisibleMaskCount = returnData.toString().length;
                }

                // let regex = new RegExp(`.{${postfixVisibleMaskCount}}$`, "gm");

                // returnData = returnData.replace(regex, maskObj.maskchar.repeat(postfixVisibleMaskCount));

                returnData = MaskCharacter(returnData.toString(), maskObj.maskchar, returnData.toString().length - postfixVisibleMaskCount);
            }
        }
    }
    return returnData;
}