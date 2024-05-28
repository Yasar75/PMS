/*********
 *Smart Report extended from Interactive Report(IvIr)
 *01/01/2019(03/05/2017)
 *By Prashik + Abhishek(mohsin/Manikanta/Niglin)
 *
 *
 *
 *
 *
 **********/
var maxNoOfPills = 5;
var ivirMainObj = {};
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
var dateOptions = ["Custom", "Today", "Yesterday", "Tomorrow", "This week", "Last week", "Next week", "This month", "Last month", "Next month", "This quarter", "Last quarter", "Next quarter", "This year", "Last year", "Next year"];

var dateOptionsCaption = callParentNew('lcm')[445];

//var anchorRegexPatter = /<a[^>]*>([\s\S]*?)/g;
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

$j(document).ready(function ($) {
    $.fn.dataTableExt.ofnSearch['alt-status'] = function (sData) {
        console.log(sData);
        //return sData.replace(/\n/g, " ").replace(/<.*?>/g, "");
    };
    $.fn.dataTable.ext.errMode = 'none';
    $("#tasks").html(callParentNew('lcm')[407] + " " + "<span class='caret'></span>").prop({ 'title': callParentNew('lcm')[407] });
    $(".print").prop({ 'title': callParentNew('lcm')[408] }).text(callParentNew('lcm')[408]);
    $("#ivInSearchInput").attr({ 'placeholder': callParentNew('lcm')[415] });


    // var testJsonString = {
    //     "ColumnType": "[  \"c\",  \"c\",  \"c\",  \"n\",  \"c\",  \"c\",  \"c\",  \"n\",  \"c\"]",
    //     "HeaderText": "[  \"\",  \"\",  \"axp__fontdetails\",  \"Sr. No.\",  \"Short Name\",  \"State Name\",  \"Country\",  \"Active\",  \"Option\"]",
    //     "FieldName": "[  \"rowno\",  \"axrowtype\",  \"axp__font\",  \"column1\",  \"state_sname\",  \"state_name\",  \"country_name\",  \"active\",  \"column2\"]",
    //     "HideColumn": "[  \"false\",  \"false\",  \"true\",  \"false\",  \"false\",  \"false\",  \"false\",  \"false\",  \"false\"]",
    //     "HasCKB": "true"
    // }

    //var data = $.parseJSON(testJsonString.Data);
    //var ColumnType = $.parseJSON(testJsonString.ColumnType);
    //var HeaderText = $.parseJSON(testJsonString.HeaderText);
    //var FieldName = $.parseJSON(testJsonString.FieldName);
    //var HideColumn = $.parseJSON(testJsonString.HideColumn);
    //var dataRows = data.row;
    //for (var i = 0; i < HeaderText.length; i++) {
    //    if (HeaderText[i] !== "") {
    //        ivirColumnTypeObj[HeaderText[i]] = ColumnType[i];
    //    }
    //}
    // var ivirGridHtml = "";
    // var ivirHeaderHtml = "";
    // var ivirBodyHtml = "";
    // for (var j = 0; j < dataRows.length; j++) {
    //     if (j == 0) {
    //         ivirHeaderHtml += "<thead><tr>";
    //         ivirBodyHtml += "<tbody>";
    //     }
    //     ivirBodyHtml += "<tr>";

    //     for (var i = 0; i < HeaderText.length; i++) {
    //         if (HeaderText[i] != "" && HideColumn[i] == "false") {
    //             var headerName = HeaderText[i];
    //             if (j == 0)
    //                 ivirHeaderHtml += "<th>" + headerName + "</th>";
    //             ivirBodyHtml += "<td>" + dataRows[j][FieldName[i]] + "</td>";
    //         }
    //     }
    //     if (j == 0)
    //         ivirHeaderHtml += "</tr></thead>";
    //     ivirBodyHtml += "</tr>";
    //     if (j == dataRows.length - 1) {
    //         ivirBodyHtml += "</tbody>";
    //     }
    // }

    // ivirGridHtml = "<table class='table' id='ivirGrid '>" + ivirHeaderHtml + ivirBodyHtml + "</table>";

    /** Will trigger when actions dropdown like highlight,group is selected */
    $(document).on("change", "#IvirActions", function (event) {
        if ($("#ivirCButtonsWrapper").is(":visible") && !$("#ivirCButtonsWrapper button.active").hasClass('grdView')) {
            toggleGridView("grid");
        }
        var htmlToShow = "";
        var selectedVal = $(this).val();
        if (selectedVal && selectedVal != "") {
            if (selectedVal == 'SHcolumns') {
                //Show hide colums in the report
                htmlToShow = '<div class="checkbox">';
                htmlToShow += '<label>';
                htmlToShow += '<input type="checkbox" id="showAllColumns" /><span> ' + " " + callParentNew('lcm')[446] + " " + '</span></label>';
                //htmlToShow += '<p>Display Columns</p>';
                htmlToShow += '<div id="ivirshowHideColumnWrapper" class="columList">';
                var fixedColumns = 0;
                if (fixedColumnsObj != "")
                    fixedColumns = fixedColumnsObj.s.iLeftColumns;
                var allColumns = ivirDataTableApi.columns();
                var allColumnsLength = allColumns[0].length;

                var groupCol = [];
                var chartCol = [];
                if (groupingCol != "") {
                    isGrouped = true;
                    var groupArrayIndex = $("[id^='grouppillCB']:checked").data("index");
                    groupCol = checkForPillDependentFlds("group", groupArrayIndex, true)
                }
                var chartArrayIndex = $("[id^='chartpillCB']:checked").data("index");
                if (chartArrayIndex >= 0) {
                    chartCol = checkForPillDependentFlds("chart", chartArrayIndex, true)
                }
                var allDepCols = groupCol.concat(chartCol);
                for (var i = 0; i < allColumnsLength; i++) {
                    //if (isChkBox == "true" && i == 0)
                    //if (i == 0)
                    //    continue;

                    if ((getAjaxIviewData && ivHeadRows[ivirDataTableApi.context[0].aoColumns[i].mData]["@hide"] == "true") || (!getAjaxIviewData && HideColumn[FieldName.indexOf(ivirDataTableApi.context[0].aoColumns[i].mData)] == "true")) {
                        continue;
                    }

                    var headerName = $(ivirDataTableApi.columns(i).header()).text().trim();
                    htmlToShow += '<div class="checkbox ivirLabelWrapper">';
                    var disabled = "";
                    var isGrouped = false;
                    var totalArrayIngrouping;
                    //if (groupingCol != "") {
                    //    isGrouped = true;
                    //    var groupArrayIndex = $("[id^='grouppillCB']:checked").data("index");
                    //    totalArrayIngrouping = ivirMainObj.group[groupArrayIndex].t;

                    //}

                    if ((i < fixedColumns) || ($.inArray(i, allDepCols) !== -1))
                        disabled = "disabled";
                    if (ivirDataTableApi.column(i).visible() === true)
                        htmlToShow += '<input class="customCheckBox ' + disabled + '" ' + disabled + ' checked type="checkbox" data-index=' + i + ' value="' + headerName + '">';
                    else
                        htmlToShow += '<input class="customCheckBox ' + disabled + '" ' + disabled + ' type="checkbox" data-index=' + i + ' value="' + headerName + '">';
                    htmlToShow += '<label class="ivirSortLabel">' + headerName + '</label>';
                    htmlToShow += '</div>';

                }

                htmlToShow += '</div>';
                //htmlToShow += '<button onclick="ivirMoveUpDown(\'up\',\'ivirshowHideColumnWrapper\')" type="button" id="listUp"><i class="icon-arrows-up"></i> Up</button>';
                //htmlToShow += '<button onclick="ivirMoveUpDown(\'down\',\'ivirshowHideColumnWrapper\')" type="button" id="listDown"><i class="icon-arrows-down"></i>Down</button>';

                ivirActionDialog(callParentNew('lcm')[401], 'column', htmlToShow, 'ivirshowHideColumns');

            } else if (selectedVal == 'sort') {



                // htmlToShow += '<p>Display Columns</p>';
                htmlToShow += '<div id="ivirSortColumnWrapper" class="columList">';
                var ivirDataTableApiOrder = ivirDataTableApi.order();
                var ivirDataTableApiOrderArray = [];
                for (var i = 0; i < ivirDataTableApiOrder.length; i++) {
                    ivirDataTableApiOrderArray.push(ivirDataTableApiOrder[i][0])
                    ivirDataTableApiOrderArray.push(ivirDataTableApiOrder[i][1])
                }
                for (var j = 0; j < ivirDataTableApiOrderArray.length; j += 2) {
                    var headerName = $(ivirDataTableApi.columns(ivirDataTableApiOrderArray[j]).header()).text().trim();
                    if (groupingCol != ivirDataTableApiOrderArray[j]) {
                        htmlToShow += '<div class="checkbox ivirLabelWrapper">';
                        htmlToShow += '<input tabindex="-1" class="customCheckBox" type="checkbox" checked data-index=' + ivirDataTableApiOrderArray[j] + '>';
                        htmlToShow += '<label class="ivirSortLabel">' + headerName + '</label>';
                        htmlToShow += '<span class="ascDscWrapper">';
                        if (ivirDataTableApiOrderArray[j + 1] == 'asc') {
                            htmlToShow += '<button tabindex="-1" class="noBg" type="button"><i data-order="asc" class="glyphicon icon-basic-server-download glyphicon-sort-by-attributes active"></i></button>';
                            htmlToShow += '<button tabindex="-1" class="noBg" type="button"><i data-order="desc" class="glyphicon icon-basic-server-upload glyphicon-sort-by-attributes-alt"></i></button>';
                        } else {
                            htmlToShow += '<button tabindex="-1" class="noBg" type="button"><i data-order="asc" class="glyphicon icon-basic-server-download glyphicon-sort-by-attributes "></i></button>';
                            htmlToShow += '<button tabindex="-1" class="noBg" type="button"><i data-order="desc" class="glyphicon icon-basic-server-upload glyphicon-sort-by-attributes-alt active"></i></button>';
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
                        htmlToShow += '<div class="checkbox ivirLabelWrapper">';
                        htmlToShow += '<input tabindex="-1" class="customCheckBox" type="checkbox" data-index=' + k + '>';
                        htmlToShow += '<label class="ivirSortLabel">' + headerName + '</label>';
                        htmlToShow += '<span class="ascDscWrapper">';
                        htmlToShow += '<button tabindex="-1" class="noBg" type="button"><i data-order="asc" class="glyphicon icon-basic-server-download glyphicon-sort-by-attributes"></i></button>';
                        htmlToShow += '<button tabindex="-1" class="noBg" type="button"><i data-order="desc" class="glyphicon icon-basic-server-upload glyphicon-sort-by-attributes-alt"></i></button>';
                        htmlToShow += '</span>';
                        htmlToShow += '</div>';
                    }

                }


                htmlToShow += '</div>';
                htmlToShow += '<button type="button" title="' + callParentNew('lcm')[447] + '" class="noBg arrowUpDown" onclick="ivirMoveUpDown(\'up\',\'ivirSortColumnWrapper\')" id="listUp"><i class="icon-arrows-up"></i></button>';
                htmlToShow += '<button type="button" title="' + callParentNew('lcm')[448] + '" class="noBg arrowUpDown" onclick="ivirMoveUpDown(\'down\',\'ivirSortColumnWrapper\')" id="listDown"><i class="icon-arrows-down"></i></button>';
                htmlToShow += '<button id="clearSorting" title="' + callParentNew('lcm')[318] + '" class="noBg clear"><i class="icon-arrows-clockwise" style="top: -6px;position: relative;left: 2px;"></button>';

                ivirActionDialog(callParentNew('lcm')[403], 'sort', htmlToShow, 'ivirSortColumns');
            } else if (selectedVal == 'rowGrouping') {
                if (!checkForPillsLength('group'))
                    ivirActionDialog(callParentNew('lcm')[412], 'group', getGroupHtml(), "ivirRowGrouping");
            } else if (selectedVal == 'highlighting') {
                // htmlToShow = getHighlightHtml();
                if (!checkForPillsLength('highlight'))
                    ivirActionDialog(callParentNew('lcm')[396], 'highlight', getHighlightHtml(), "ivirHighlightRow");
                // if (ivirMainObj.highlight === undefined)
                //     ivirActionDialog('Highlight', getHighlightHtml(), "ivirHighlightRow");
                // else
                //     createPills("highlight");

                // ivirHighlightRow(ivirMainObj.highlight);

            } else if (selectedVal == 'download') {
                htmlToShow += '<div>'
                htmlToShow += '<div style="margin-top: 10px;">'
                htmlToShow += '<div id="main">'
                htmlToShow += '<div class="row" id="ivirDownloadWrapper">'
                //htmlToShow += '<i onclick="DownloadAndSave(this)" id="pdfSave" class="ivirDownload fa fa-copy COPY" aria-hidden="true"></i>'
                //htmlToShow += '<div class="col-md-2 text-center"><button onclick="DownloadAndSave(this)" type="button" title="Copy" class="noBg COPY"><span style="font-size:30px" class="ivirDownload fa fa-copy COPY"></button></span><label style="display:block">Copy</label></div>';
                htmlToShow += '<div class="col-md-2 text-center"><button onclick="DownloadAndSave(this)" type="button" title="CSV" class="noBg CSV active"><span style="font-size:30px" class="ivirDownload fa fa-file-excel-o CSV"></button></span><label style="display:block">CSV</label></div>';
                htmlToShow += '<div class="col-md-2 text-center"><button onclick="DownloadAndSave(this)" type="button" title="Excel" class="noBg EXCEL"><span style="font-size:30px"  class="ivirDownload  fa fa-file-excel-o EXCEL"></button><label style="display:block">Excel</label></span></div>';
                htmlToShow += '<div class="col-md-2 text-center"><button onclick="DownloadAndSave(this)" type="button"title="PDF" class="noBg PDF"><span style="font-size:30px" class="ivirDownload fa fa-file-pdf-o PDF"></button></span><label style="display:block">PDF</PDF></div>';
                htmlToShow += '<div class="col-md-2 text-center"><button onclick="DownloadAndSave(this)" type="button" title="Print" class="noBg PRINT"><span style="font-size:30px" class="ivirDownload fa fa-print PRINT"></button></span><label style="display:block">Print</label></div>';

                //htmlToShow += '<div class="col-md-1 text-center"><span onclick="DownloadAndSave(this)" style="font-size:35px" class="ivirDownload fa fa-copy COPY noBg"></span><label>Copy</label></div>';
                //htmlToShow += '<div class="col-md-1 text-center"><span onclick="DownloadAndSave(this)" style="font-size:35px" class="ivirDownload fa fa-file-excel-o CSV noBg"></span><label>CSV</label></div>';
                //htmlToShow += '<div class="col-md-1 text-center"><span onclick="DownloadAndSave(this) "style="font-size:35px" class="ivirDownload fa fa-file-excel-o EXCEL noBg"></span><label>Excel</label></div>';
                //htmlToShow += '<div class="col-md-1 text-center"><span onclick="DownloadAndSave(this)" style="font-size:35px" class="ivirDownload fa fa-file-pdf-o PDF noBg"></span><label></label>PDF</div>';
                //htmlToShow += '<div class="col-md-1 text-center"><span onclick="DownloadAndSave(this)" style="font-size:35px" class="ivirDownload fa fa-print PRINT noBg"></span><label>Print</label></div>';

                //htmlToShow += '<i onclick="DownloadAndSave(this)" id="excelSave" class="ivirDownload fa fa-print PRINT" aria-hidden="true"></i>'
                htmlToShow += '</div> ';
                // htmlToShow += '<hr>';
                // htmlToShow += '<p>'
                // htmlToShow += 'This is an email link:'
                // htmlToShow += '<a href="mailto:mohsin@agile-labs.com?Subject=Hello%20again" target="_top">Send Mail</a>'
                // htmlToShow += '</p>'
                htmlToShow += '</div>';
                htmlToShow += '</div>';
                htmlToShow += '</div>';
                ivirActionDialog(callParentNew('lcm')[411], 'download', htmlToShow, "DownloadFile");

            } else if (selectedVal == 'chart') {

                if (!checkForPillsLength('chart'))
                    ivirActionDialog(callParentNew('lcm')[410], 'chart', getChartHtml(), "ivirCreateChart");
            } else if (selectedVal == 'save') {
                saveInSessionBeforeSave();
            } else if (selectedVal == 'moreFilters') {
                //saveInSessionBeforeSave();

                ivirMoreFilters();

            } else if (selectedVal == 'clearFilters') {
                advFiltersObjectToApply = { somedummyfilterjsobjectkey: "dummy" };
                ivirDataTableApi.draw();
                $("[id^='filterpillCB']").prop('checked', false).removeAttr('checked');
            }
        }
    });

    $(document).on("keydown", "#ivirCndtnToggleBtn", function (event) {
        if (event.keyCode == 32 || event.keyCode == 13) {
            toggleIvirPills();
        }
    })


    /** Wlll trigger when custom Actions of iview are selected */
    $(document).on("change", "#IvirCustomActions", function (event) {
        var selectedValue = $(this).val();
        if (selectedValue != "") {
            if (selectedValue.startsWith('custBtn')) {
                var fn = selectedValue.split(',');
                var btnID = fn[0].substr(7);
                ////var fnWindow = window[fnString];
                //var params = fn.splice(1);
                //var btnID = params[0];
                fireTheCustomAction(btnID);
            }
        }

    })
    /**
     * This function will be trigerred from datatable whenever Advanced Filters Search will be requested.
     * @author Prashik
     * @Date   2019-02-28T10:37:05+0530                                                                                   
     * var isObjectAvailable [if filters are parsed from filterObject or opened filter Popup Fields]
     * @return {[boolean]}                            [return true if current row should be shown in search result]
     */
    $.fn.dataTable.ext.search.push(
        function (settings, filteredData, dataIndex, data, rowNo) {
            //debugger;
            //var min = parseInt($('#min').val(), 10);
            //var max = parseInt($('#max').val(), 10);
            //var age = parseFloat(data[3]) || 0; // use data for the age column

            //if ((isNaN(min) && isNaN(max)) ||
            //     (isNaN(min) && age <= max) ||
            //     (min <= age && isNaN(max)) ||
            //     (min <= age && age <= max)) {
            //    return true;
            //}
            //return false;
            //return true;


            //var f1 = $("#fldA1");
            //var f2 = $("#fldB1");

            //return RegExp((f1.val() || "")  + "|" + (f2.val() || ""), "g").test(data);

            var isObjectAvailable = false;
            var loopData = [];
            if ($.isEmptyObject(advFiltersObjectToApply) || advFiltersObjectToApply.somedummyfilterjsobjectkey) {
                isObjectAvailable = false;
                if (!advFiltersObjectToApply.somedummyfilterjsobjectkey) {
                    loopData = $("#divModalAdvancedFilters table tbody tr");
                }
            } else {
                isObjectAvailable = true;
                loopData = $(Object.keys(advFiltersObjectToApply));
            }


            var validationArray = [];
            //if ($("#divModalAdvancedFilters:visible").length) {
            //$("#divModalAdvancedFilters table tbody tr").each(function (thisTR) {
            $(loopData).each(function (dataIndex) {
                var dataKey = "";
                if (isObjectAvailable) {
                    //this.toString();
                    dataKey = loopData[dataIndex];
                    var colType = ivirColumnTypeObj[dataKey];
                } else {
                    var colType = $(this).data("coltype");
                }
                switch (colType) {
                    case "c":
                        //debugger;
                        //data, ivirDataTableApi, filteredColumns;
                        if (isObjectAvailable) {
                            var thisVal = advFiltersObjectToApply[dataKey];
                            //var currentIndex = FieldName.indexOf(dataKey) - (rowTypeExist ? 1 : 0);
                            var currentIndex = getPropertyAccess(dataKey);
                        } else {
                            var thisVal = $(this).find(".moreFiltersInput.characterFilter:nth(0)").val();
                            //var currentIndex = filteredColumns.indexOf($(this).find(".moreFiltersInput.characterFilter").data("field"));
                            //if(dataIsKey){
                            var currentIndex = getPropertyAccess($(this).find(".moreFiltersInput.characterFilter").data("field"));
                            //}
                            //else{
                            //    var currentIndex = FieldName.indexOf($(this).find(".moreFiltersInput.characterFilter").data("field")) - (rowTypeExist ? 1 : 0);
                            //}

                        }
                        var tempData = typeof data[currentIndex] == "object" ? data[currentIndex].display : data[currentIndex];
                        tempData = $($.parseHTML(tempData)).text().trim();
                        var currentData = tempData;
                        //thisVal != "" ? validationArray.push(RegExp((thisVal.toString().replace(/\| /g, '|')), "g").test(currentData)) : validationArray.push(false);
                        //thisVal != "" ? validationArray.push(RegExp((thisVal.toString().replace(/\| /g, '|')), "g").test(currentData)) : "";
                        //thisVal != "" ? validationArray.push(thisVal.split(/\♣\|♣/g).indexOf(currentData) > -1) : "";
                        thisVal != "" ? validationArray.push(thisVal.split(/\♣\|♣/g).filter((val, ind) => { return currentData.indexOf(val) > -1 }).length > 0) : "";
                        break;
                    case "n":
                        var minVal = 0, maxVal = 0;
                        if (isObjectAvailable) {
                            //var currentIndex = FieldName.indexOf(dataKey) - (rowTypeExist ? 1 : 0);
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
                            //var currentIndex = filteredColumns.indexOf($(this).find(".moreFiltersInput.numericFilter:nth(0)").data("field"));
                            //if(dataIsKey){
                            var currentIndex = getPropertyAccess($(this).find(".moreFiltersInput.numericFilter:nth(0)").data("field"));
                            //}
                            //else{
                            //    var currentIndex = FieldName.indexOf($(this).find(".moreFiltersInput.numericFilter:nth(0)").data("field")) - (rowTypeExist ? 1 : 0);
                            //}
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
                        var tempData = typeof data[currentIndex] == "object" ? data[currentIndex].display : data[currentIndex];
                        tempData = checkFroNegativeValue($($.parseHTML(tempData)).text().trim());
                        var currentData = parseFloat(tempData.toString().replace(/,/g, ""));
                        currentData = !isInValidNumber(currentData) ? currentData : -1
                        minVal != 0 || maxVal != 0 ? validationArray.push(isNumberBetweenScope(minVal, maxVal, currentData)) : "";
                        break;
                    case "d":
                        var minVal = 0, maxVal = 0;
                        if (isObjectAvailable) {
                            //var currentIndex = FieldName.indexOf(dataKey) - (rowTypeExist ? 1 : 0);
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
                                        //minVal = 
                                    }
                                } catch (ex) { }
                                try {
                                    if (advFiltersObjectToApply[dataKey]["max"]) {
                                        maxVal = getDateStamp(advFiltersObjectToApply[dataKey]["max"]) || maxVal;
                                    } else {
                                        var selectionOption = "";
                                        //minVal = 
                                    }
                                } catch (ex) { }
                            } else {
                                var fromToObj = generateAdvFilterDates(advFiltersObjectToApply[dataKey]);
                                minVal = getDateStamp(fromToObj.from);
                                maxVal = getDateStamp(fromToObj.to);
                            }
                        } else {
                            //var currentIndex = filteredColumns.indexOf($(this).find("input.moreFiltersInput.dateFilter:nth(0)").data("field"));
                            //if(dataIsKey){
                            var currentIndex = getPropertyAccess($(this).find("input.moreFiltersInput.dateFilter:nth(0)").data("field"));
                            //}
                            //else{
                            //    var currentIndex = FieldName.indexOf($(this).find("input.moreFiltersInput.dateFilter:nth(0)").data("field")) - (rowTypeExist ? 1 : 0);
                            //}
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
                                //var maxVal = 0;
                                try {
                                    maxVal = parseInt($(this).find("input.moreFiltersInput.dateFilter:nth(1)").datepicker("getDate").getTime(), 10) || maxVal;
                                } catch (ex) { }
                            }
                        }
                        var currentData = -1;
                        try {
                            var tempData = typeof data[currentIndex] == "object" ? data[currentIndex].display : data[currentIndex];
                            tempData = $($.parseHTML(tempData)).text().trim();
                            if (getAjaxIviewData) {
                                tempData = getDateBasedOnCulture(tempData);
                            }
                            currentData = getDateStamp(tempData);
                        } catch (ex) { }
                        //future regex to split and swap mm & dd
                        // /[-|.|\/]/

                        minVal != 0 || maxVal != 0 ? validationArray.push(isNumberBetweenScope(minVal, maxVal, currentData)) : "";
                        break;
                    case "t":
                        break;
                }
            });
            //}
            //else if ($("#ivInSearchInput").val() != "") {
            //    $("#ivInSearchInput").val().split("| ").filter(function () {

            //    });
            //}
            //return true;
            //advFiltersObjectToApply = {};
            return validationArray.length > 0 ? validationArray.indexOf(true) > -1 : true;
        }
    );



    /**
     * This function will help to reArrange columns sorting to initial stage by using ivirDataTableApi.order.neutral().draw();
     * @author Prashik
     * @Date   2019-02-28T10:43:22+0530
     */
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

    /**
     * This function will revert table sorting to initial table sorting on doubleCLick of table header.
     * @author Prashik
     * @Date   2019-02-28T10:46:02+0530
     */
    $(document).on("dblclick", 'th.sorting, th.sorting_asc, th.sorting_desc, th.dt-right, th.dt-left', function () {
        ivirDataTableApi.order.neutral().draw();
    });

    /**
     * Trigger advance filter search functionality
     * @author Prashik
     * @Date   2019-02-28T11:32:21+0530
     */
    $(document).on("click", "#btnFilter", function () {
        $('[data-dropdown-value="moreFilters"]').attr("data-filter-type", "search");
        //$("[data-pill-type='filter'] .ivirFilterCheckBox").attr("checked",false); //if any filters exists & checked then clear it
        //debugger;
        //ivirDataTableApi.columns().search('').draw();
        //pushSearchStringtoInput();
        advFiltersObjectToApply = {};
        ivirDataTableApi.draw();
    });

    /**
     * Create advanced filter pill and trigger advanced search functionality
     * @author Prashik
     * @Date   2019-02-28T11:44:57+0530
     */
    $(document).on("click", "#btnFilterApply", function () {
        var advSearchNameValue = $("#advSearchName").val();
        var moreFilters = $("#divModalAdvancedFilters .body-cont").parent();
        var pillindex = moreFilters.find(".body-cont").data("pillindex");
        if (pillindex != -1 || !checkForPillsLength('filter')) {
            if (advSearchNameValue) {
                var pillIndex = getFiltersPillIndex();
                var isEditPill = pillIndex == undefined ? false : true;
                if (!ivirDuplicateCheck("filter", isEditPill, pillIndex))
                    return false;
                var searchJSON = JSON.stringify(generateSearchString("JSON"));
                if (searchJSON != "{}") {
                    generateFilterPill(searchJSON, advSearchNameValue, pillIndex);
                    //$("#btnFilter").data("applyFilterIndex", "pillIndex");
                    //$("#btnFilter").click();
                    ivirDataTableApi.draw();
                    $('[data-dropdown-value="moreFilters"]').attr("data-filter-type", "filter");
                    //showAlertDialog("success", searchJSON);
                } else {
                    showAlertDialog("info", "Filter fields cannot be empty.");
                }
            } else {
                //showAlertDialog("warning", "Filter name should not be left empty while creating filters.");
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
        //var enableDisable;
        var fromToObj = generateAdvFilterDates($(this).val());
        fromDate.val(fromToObj.from);
        toDate.val(fromToObj.to);
        enableDisableDateField(thisSiblings.find("input.moreFiltersInput"), $(this).val() == "customOption" ? "enable" : "disable");
    });
});

function generateAdvFilterDates(dateOption) {
    var fromToObj = { from: "", to: "" };
    switch (dateOption) {
        case "customOption":
            //enableDisable = "enable";
            break;
        case "todayOption":
            //enableDisable = "disable";
            var dateObj = new Date();
            fromToObj.from = ($.datepicker.formatDate(dtFormat.replace("yyyy", "yy"), dateObj));
            fromToObj.to = ($.datepicker.formatDate(dtFormat.replace("yyyy", "yy"), dateObj));
            break;
        case "yesterdayOption":
            //enableDisable = "disable";
            var dateObj = new Date();
            dateObj.setDate(dateObj.getDate() - 1);
            fromToObj.from = ($.datepicker.formatDate(dtFormat.replace("yyyy", "yy"), dateObj));
            fromToObj.to = ($.datepicker.formatDate(dtFormat.replace("yyyy", "yy"), dateObj));
            break;
        case "tomorrowOption":
            //enableDisable = "disable";
            var dateObj = new Date();
            dateObj.setDate(dateObj.getDate() + 1);
            fromToObj.from = ($.datepicker.formatDate(dtFormat.replace("yyyy", "yy"), dateObj));
            fromToObj.to = ($.datepicker.formatDate(dtFormat.replace("yyyy", "yy"), dateObj));
            break;
        case "this_weekOption":
            //enableDisable = "disable";
            var dateObj = getFirstDayOfWeek(new Date());
            fromToObj.from = ($.datepicker.formatDate(dtFormat.replace("yyyy", "yy"), dateObj));
            dateObj.setDate(dateObj.getDate() + 6);
            fromToObj.to = ($.datepicker.formatDate(dtFormat.replace("yyyy", "yy"), dateObj));
            break;
        case "last_weekOption":
            //enableDisable = "disable";
            var dateObj = getFirstDayOfWeek(new Date());
            dateObj.setDate(dateObj.getDate() - 7)
            fromToObj.from = ($.datepicker.formatDate(dtFormat.replace("yyyy", "yy"), dateObj));
            dateObj.setDate(dateObj.getDate() + 6);
            fromToObj.to = ($.datepicker.formatDate(dtFormat.replace("yyyy", "yy"), dateObj));
            break;
        case "next_weekOption":
            //enableDisable = "disable";
            var dateObj = getFirstDayOfWeek(new Date());
            dateObj.setDate(dateObj.getDate() + 7)
            fromToObj.from = ($.datepicker.formatDate(dtFormat.replace("yyyy", "yy"), dateObj));
            dateObj.setDate(dateObj.getDate() + 6);
            fromToObj.to = ($.datepicker.formatDate(dtFormat.replace("yyyy", "yy"), dateObj));
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
            //enableDisable = "disable";
            var dateObj = getFirstDayOfWeek(new Date());
            dateObj.setDate(1);
            fromToObj.from = ($.datepicker.formatDate(dtFormat.replace("yyyy", "yy"), dateObj));
            //dateObj.setMonth(dateObj.getMonth() + 1).setDate(0)
            dateObj.setMonth(dateObj.getMonth() + 1);
            dateObj.setDate(0);
            fromToObj.to = ($.datepicker.formatDate(dtFormat.replace("yyyy", "yy"), dateObj));
            break;
        case "last_monthOption":
            //enableDisable = "disable";
            var dateObj = getFirstDayOfWeek(new Date());
            dateObj.setDate(1);
            dateObj.setMonth(dateObj.getMonth() - 1);
            fromToObj.from = ($.datepicker.formatDate(dtFormat.replace("yyyy", "yy"), dateObj));
            //dateObj.setMonth(dateObj.getMonth() + 1).setDate(0)
            dateObj.setMonth(dateObj.getMonth() + 1);
            dateObj.setDate(0);
            fromToObj.to = ($.datepicker.formatDate(dtFormat.replace("yyyy", "yy"), dateObj));
            break;
        case "next_monthOption":
            //enableDisable = "disable";
            var dateObj = getFirstDayOfWeek(new Date());
            dateObj.setDate(1);
            dateObj.setMonth(dateObj.getMonth() + 1);
            fromToObj.from = ($.datepicker.formatDate(dtFormat.replace("yyyy", "yy"), dateObj));
            //dateObj.setMonth(dateObj.getMonth() + 1).setDate(0)
            dateObj.setMonth(dateObj.getMonth() + 1);
            dateObj.setDate(0);
            fromToObj.to = ($.datepicker.formatDate(dtFormat.replace("yyyy", "yy"), dateObj));
            break;
        case "this_quarterOption":
            //enableDisable = "disable";
            var dateObj = new Date();
            var thisQuarter = Math.floor(((dateObj).getMonth() + 3) / 3);
            dateObj.setDate(1);
            dateObj.setMonth((thisQuarter * 3) - 3);
            fromToObj.from = ($.datepicker.formatDate(dtFormat.replace("yyyy", "yy"), dateObj));
            dateObj.setMonth(dateObj.getMonth() + 3);
            dateObj.setDate(0);
            fromToObj.to = ($.datepicker.formatDate(dtFormat.replace("yyyy", "yy"), dateObj));
            break;
        case "last_quarterOption":
            //enableDisable = "disable";
            var dateObj = new Date();
            var thisQuarter = Math.floor(((dateObj).getMonth() + 3) / 3) - 1;
            if (thisQuarter == 0) {
                thisQuarter = 4;
                dateObj.setFullYear(dateObj.getFullYear() - 1);
            }
            dateObj.setDate(1);
            dateObj.setMonth((thisQuarter * 3) - 3);
            fromToObj.from = ($.datepicker.formatDate(dtFormat.replace("yyyy", "yy"), dateObj));
            dateObj.setMonth(dateObj.getMonth() + 3);
            dateObj.setDate(0);
            fromToObj.to = ($.datepicker.formatDate(dtFormat.replace("yyyy", "yy"), dateObj));
            break;
        case "next_quarterOption":
            //enableDisable = "disable";
            var dateObj = new Date();
            var thisQuarter = Math.floor(((dateObj).getMonth() + 3) / 3) + 1;
            if (thisQuarter == 5) {
                thisQuarter = 1;
                dateObj.setFullYear(dateObj.getFullYear() + 1);
            }
            dateObj.setDate(1);
            dateObj.setMonth((thisQuarter * 3) - 3);
            fromToObj.from = ($.datepicker.formatDate(dtFormat.replace("yyyy", "yy"), dateObj));
            dateObj.setMonth(dateObj.getMonth() + 3);
            dateObj.setDate(0);
            fromToObj.to = ($.datepicker.formatDate(dtFormat.replace("yyyy", "yy"), dateObj));
            break;
        case "this_yearOption":
            //enableDisable = "disable";
            var dateObj = new Date();
            dateObj.setDate(1);
            dateObj.setMonth(0);
            fromToObj.from = ($.datepicker.formatDate(dtFormat.replace("yyyy", "yy"), dateObj));
            dateObj.setFullYear(dateObj.getFullYear() + 1);
            dateObj.setMonth(0);
            dateObj.setDate(0);
            fromToObj.to = ($.datepicker.formatDate(dtFormat.replace("yyyy", "yy"), dateObj));
            break;
        case "last_yearOption":
            //enableDisable = "disable";
            var dateObj = new Date();
            dateObj.setFullYear(dateObj.getFullYear() - 1);
            dateObj.setDate(1);
            dateObj.setMonth(0);
            fromToObj.from = ($.datepicker.formatDate(dtFormat.replace("yyyy", "yy"), dateObj));
            dateObj.setFullYear(dateObj.getFullYear() + 1);
            dateObj.setMonth(0);
            dateObj.setDate(0);
            fromToObj.to = ($.datepicker.formatDate(dtFormat.replace("yyyy", "yy"), dateObj));
            break;
        case "next_yearOption":
            //enableDisable = "disable";
            var dateObj = new Date();
            dateObj.setFullYear(dateObj.getFullYear() + 1);
            dateObj.setDate(1);
            dateObj.setMonth(0);
            fromToObj.from = ($.datepicker.formatDate(dtFormat.replace("yyyy", "yy"), dateObj));
            dateObj.setFullYear(dateObj.getFullYear() + 1);
            dateObj.setMonth(0);
            dateObj.setDate(0);
            fromToObj.to = ($.datepicker.formatDate(dtFormat.replace("yyyy", "yy"), dateObj));
            break;
    }
    return fromToObj;
}


function generateUniqueColumnVals(type, columnIndex) {
    var columnVals = [];
    try {
        //ivirDataTableApi.column(columnIndex, { search: 'applied' }).data().unique().sort().each(function (value, index) {
        ivirDataTableApi.cells(ivirDataTableApi.rows(":not(.specialRow)").nodes(), columnIndex, { search: 'applied' }).data().unique().sort().each(function (value, index) {
            if (type == "n") {
                value = typeof value == "object" ? value.display : value;
                value = value.replace(/,/g, "");
                //parseFloat(value) ? columnVals.push(value) : "";
                columnVals.push(value);
            } else if (type == "d") {
                if (getAjaxIviewData) {
                    value = getDateBasedOnCulture(value);
                }
                var curTimeStamp = getDateStamp(value);
                //curTimeStamp ? columnVals.push(curTimeStamp) : "";
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
        return parseInt(new Date(dtData).getTime(), 10) || thisData;
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
    fieldObj.datepicker(enableDisable).css({ "height": enableDisable == "enable" ? "" : "30px", "opacity": enableDisable == "enable" ? "1" : "0.5" });
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
 * if number/timestamp exist between the given from and to input scope
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
            //if (isPillAlreadyChecked) {
            $("[id^='filterpillCB']").prop('checked', false).removeAttr('checked');
            $("#filterpillCB" + indexOfArray).prop('checked', true).attr('checked', 'checked');
            //}
            $("#filterpillCB" + indexOfArray).parent().next().find('.ivirCndtnName').attr('title', "Edit " + name).text(name);
        }
    } else {
        var cutMsg = eval(callParent('lcm[23]'));
        showAlertDialog("warning", cutMsg);
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
    $(".ivirChartButton").removeClass('active');
    $(elem).addClass('active');
    $("#ivir" + divToShow + " .form-control").first().focus();
}


/**
 * To create a chart based on new data user eneterd or existing data which is already saved
 * @author ManiKanta
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
    }
    var isCBchecked;
    if ($('input[name="chkItem"]:checked').length == 0)
        isCBchecked = false;
    else
        isCBchecked = true;

    // var apiToRefer = 
    // fixedColumnsObj == ""
    if ((indexOfArray === undefined) || isPillChecked) {
        var isDataExists = false;
        ivirDataTableApi.rows().every(function (rowIdx, tableLoop, rowLoop) {
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
                (!isNaN(parseInt(colIndex))) ? graphCol = nodeData[Object.keys(nodeData)[colIndex]] : graphCol = nodeData[colIndex],
                    (!isNaN(parseInt(colValue))) ? graphValue = nodeData[Object.keys(nodeData)[colValue]] : graphValue = nodeData[colValue]

                if (anchorRegexPatter.test(graphCol))
                    graphCol = $(graphCol).text();

                if (anchorRegexPatter.test(graphValue))
                    graphValue = parseInt($(graphValue).text());
                var existingIndex = $.inArray(graphCol, checkingArray);
                if (existingIndex == -1) {

                    checkingArray.push(graphCol);
                    var tmpObj = {} //{"name":"Walk In","y":0.0}
                    tmpObj.name = graphCol;
                    graphValue = parseInt(graphValue);
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
                        earlierVal = parseInt(earlierVal), graphValue = parseInt(graphValue)
                        existingObj.y = earlierVal + graphValue;
                    } else if (chartType == 'column' || chartType == 'bar') {
                        var earlierVal = existingObj.data[0];
                        existingObj.data = [parseInt(earlierVal) + parseInt(graphValue)];
                    }


                }
            }
        })

    }





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
    }


    if ((indexOfArray === undefined) || isPillChecked) {
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
        // isFirstTime ? chartObj.ft = true : "";
        if (indexOfArray === undefined) {
            chartArr.push(chartObj);
            if (!$("#ivirChartPills").hasClass('pillsAdded'))
                createChartPills();
            else
                upateTheChartPills(indexOfChartArry, name);

        } else {
            //highlight0pillCB
            if (isPillChecked) {
                $(".ivirChartCheckBox").prop('checked', false).removeAttr('checked');
                $("#chartpillCB" + indexOfArray).prop('checked', true).attr('checked', 'checked');
            }
            $("#ivirchart" + indexOfArray + "CndtnPill .ivirCndtnName").attr('title', "Edit " + name).text(name);
            // $("#highlight" + indexOfArray + "pillCB").parent().next().find('.ivirCndtnName').text(name);
        }
    } else {
        var cutMsg = eval(callParent('lcm[23]'));
        showAlertDialog("warning", cutMsg);
    }




    // columnChart(datats, title)
    setSmartViewHeight();
    return true;


}

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
 * @author ManiKanta
 * @Date   2018-11-19T14:52:42+0530
 * @param  {String}                 task            To re-apply or to clear or grouping
 * @param  {Numeric}                index           In case of group or groupApply this param have the value of the grouped column
 * @param  {Array/Object}           totalArray      The info about the subtotal for that group
 * @param  {Array/Object}           grandTotalArray Info about any grandtotal 
 * @return {}                              
 */
function createIvirDataTable(task, index, totalArray, grandTotalArray) {
    // isChkBox
    console.log(new Date() + ': datatable creation started');
    var heightOfDT = $(".iviewTableWrapper")[0].offsetHeight + "px";
    var dataTblObj = {};
    var pillsAccordionHtml = "";
    let accordianClone = "";
    if (task == "clear" || task == "groupApply" || task == "group") {
        pillsAccordionHtml = $("#pillsWrapper").html();

    }
    accordianClone = $("#accordion").detach();
    //$("#accordion").remove();



    dataTblObj.scrollY = heightOfDT;
    dataTblObj.scrollX = true;
    // dataTblObj.dom = "lfrtip";
    // dataTblObj.dom = "pfltip";
    //dataTblObj.dom = "<'container-fluid'<'row'<'col-md-12 pull-right'p>><'row ivirFilterRow'<'col-md-3'f><'#filterWrapper.col-md-3'><'col-md-6 pull-right'l>>>tip";

    dataTblObj.dom = "<'#ivirCustomContainer.container-fluid'<'row'<'#pillsWrapper.col-md-6 col-sm-6'><'col-md-6 col-sm-6 pull-right'l>>><'#ivirMainDataTableWrapper't>";

    dataTblObj.scrollCollapse = true;
    // dataTblObj.searching = false;
    dataTblObj.colReorder = false;
    dataTblObj.language = {
        search: "_INPUT_",
        searchPlaceholder: "Search...",
        "lengthMenu": "Show _MENU_ rows",

        paginate: {
            //next: '<span class="glyphicon glyphicon-menu-right"></span>',
            //previous: '<span class="glyphicon glyphicon-menu-left"></span>'
            next: '<i class="glyphicon glyphicon-arrow-left icon-arrows-right"></i>',
            previous: '<i class="glyphicon glyphicon-arrow-left icon-arrows-left"></i>'
        },



        // "zeroRecords": "Nothing found - sorry",
        // "info": "Showing page _PAGE_ of _PAGES_",
        // "infoEmpty": "No records available",
        // "infoFiltered": "(filtered from _MAX_ total records)"
    }
    dataTblObj.lengthMenu = [10, 25, 50, 75, 100, 250, 500];
    dataTblObj.lengthChange = false,
        dataTblObj.buttons = [
            /*'copy', 'csv', 'excel', 'pdf', 'print'*/
            {
                extend: 'copyHtml5',
                text: 'Copy',
                title: IVIRCaption,
                exportOptions: {
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
                exportOptions: {
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
                extend: 'pdfHtml5',
                text: 'PDF',
                title: IVIRCaption,
                exportOptions: {
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
                extend: 'print',
                text: 'Print',
                title: '',
                message: '<center>' + printTitle + '</center> <br> <center>' + IVIRCaption + '</center> <br>',
                exportOptions: {
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
            }
        ];
    dataTblObj.select = {
        style: "multi"
    };
    dataTblObj.paging = true;
    //var pageLength = ""; //"pageLength": 50
    //pageLength = ivirDataTableApi ? ivirDataTableApi.page.info().length : (ivirMainObj.pageLength || 10);

    //dataTblObj.pageLength = pageLength;
    dataTblObj.pageLength = pageLength = -1;
    dataTblObj.aaSorting = [];
    dataTblObj.orderClasses = false;

    dataTblObj.initComplete = function (settings, json) {
        $(".animationLoading").hide();
        if (getAjaxIviewData && dtDbTotalRecords > nxtScrollSize)
            appendRowsAfterLoad(); //appends remaining records(except default record count - nxtScrollSize) to the grid after datatable initilization
        console.log(new Date() + ': end time');

        autoSplitChecker();
    };
    if (getAjaxIviewData) {
        var recCount = '<a href=\"javascript:void(0)\" onclick=\"getIviewRecordCount();\" id=\"getIviewRecordCountVal\" title=\"\" class=\"icon-arrows-question fa\"></a>';
        dataTblObj.preDrawCallback = function (settings) {
            scrollTopPosition = $(".dataTables_scrollBody").scrollTop()
        };
        dataTblObj.drawCallback = function () {
            if (dtDbTotalRecords == 0)
                $("#rowsTxtCount").hide();
            else {
                var rowsTo = dtDbTotalRecords;
                if (dtDbTotalRecords > iviewDataWSRows && dtDbTotalRecords > nxtScrollSize) { //if autoAppendRecords(lazy binding) is enabled then display total page info, ex: Rows: 1-3500 of 3500
                    rowsTo = recCount = dtDbTotalRecords;
                    if (autoAppendRecords)
                        setTimeout(function () {
                            appendNextDtRecords();
                        }, 0);//settimeout 0 means add to last of js call stack and execute immediately once call stack queue finishes
                    else
                        console.log(new Date() + ': append completed')
                }
                else if (!checkNextDBRowsExist) { //record count < fetch size then display, ex: Rows: 1-18 of 18
                    recCount = dtDbTotalRecords;
                }
                else if (iviewDataWSRows <= nxtScrollSize) {
                    $("#requestNextRecords").length == 0 ? $("#rowsTxtCount").append("<span title='Request next page records' id='requestNextRecords' onclick='requestNextRecords()'><i class='fa fa-chevron-circle-right'></i></span>") : "";
                    //<li><input type='button' style='display:none;width: 100%;' class='btn btn-xs hotbtn' id='requestNextRecords' onclick='getNextDtRecords("+(dtPageNo + 1)+");' value='Request Next Page'/></li>
                    var scrollExist = $(".dataTables_scrollBody").hasScrollBar();
                    if (scrollExist)
                        $("#requestNextRecords").hide();
                    else
                        $("#requestNextRecords").show();
                    if (!checkNextDBRowsExist)
                        recCount = dtDbTotalRecords;
                }
                $("#lblCurPage").html('Rows: 1-' + rowsTo + ' of ' + (totRowCount == "" ? recCount : "")); //record count > fetch size then display hyperlink button to get record count
                hideDataTableLoading();
            }
            setSmartViewHeight();
        }
    }
    if (isChkBox == "true") {
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
    //dataTblObj.autoWidth = false;
    if (getAjaxIviewData) {
        dataTblObj.columnDefs.push({
            "targets": "_all",
            "createdCell": (td, cellData, rowData, row, col) => {
                isSpecialRow = false;
                var colID = FieldName[col];
                var rowDataAccess = getPropertyAccess(colID);
                //cellDataProcessing
                cellData = processCellData({ td, cellData, rowData, row, col, colID, rowDataAccess });


                if (cellData != "") {
                    //generate checkbox column
                    if (col == 0) {
                        $(td).html(genarateCellCheckbox({ col, row, rowData }));
                    } else {

                        if (!isSpecialRow) {
                            $(td).html(generateCellHyperlink({ cellData, rowData, row, col, colID, rowDataAccess }));




                        }
                        applyConditionalFormatting({ td, rowData, colID });

                        //Expand/Collapse TreeMethod
                        if (cellHeaderConf.root_class_index) {
                            $(td).html(generateExpColTree({ td, cellData, rowData, row, col, colID, rowDataAccess }));
                        }

                    }
                } else {
                    $(td).html("");
                }
                if (!iviewWrap)
                    $(td).css({ "white-space": "nowrap" });
                else
                    $(td).css({ "word-break": "break-all" });
            }
        });
        dataTblObj.createdRow = (row, data, dataIndex) => {
            if (data[getPropertyAccess("axrowtype")] && (data[getPropertyAccess("axrowtype")] == "stot" || data[getPropertyAccess("axrowtype")] == "subhead" || data[getPropertyAccess("axrowtype")] == "gtot")) {
                $(row).addClass("specialRow");
            }
            //Expand/Collapse TreeMethod
            if (cellHeaderConf.root_class_index) {
                $(row).addClass(data[getPropertyAccess(cellHeaderConf.root_class_index)].toString() || "");
            }
        }

        tableWidth = 0;
        dataTblObj.columns = FieldName.map((fld, ind) => {
            //return {"data": fld, "title": HeaderText[ind]}
            //return {"data": getPropertyAccess(fld)}
            //return {"data": getPropertyAccess(fld), "type": colTypes[ivHeadRows[fld]["@type"] || (fld == "rowno" ? "n" : "c")]}
            var width = ivHeadRows[fld]["@width"] || minCellWidth;
            (ivHeadRows[fld]["@hide"].toString() || "true") == "false" ? tableWidth += parseInt(width, 10) : "";
            //tableWidth += parseInt(width, 10);
            return { "data": getPropertyAccess(fld), "name": getPropertyAccess(fld), "width": `${width}px`, "className": colAlign[ivHeadRows[fld]["@align"] || (fld == "rowno" ? "Center" : "Left")] }
        });

        $(ivirTable).css({ "width": `${tableWidth}px` });
        //$(ivirTable).outerWidth(tableWidth);

        dataTblObj.data = ivDatas.length != undefined ? ivDatas.slice(0, nxtScrollSize) : ivDatas;

        dataTblObj.deferRender = true;
    }

    var widthOfGrid = tableWidth || $("table#GridView1")[0].offsetWidth;
    var windowWidth = $(window).width();
    if ((document.title == "Iview" && axpResp == "true") || widthOfGrid <= windowWidth)
        //$(".gridData").css({ "width": "100%", "min-width": "100%" });
        $(".gridData").css({ "width": "100%", "min-width": "100%" });
    //}
    //if (widthOfGrid > windowWidth)
    $(".gridData").css("margin-left", "0px");

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
                        //'$' + pageTotal + ' ( $' + total + ' total)'
                        //commaSeparateNumber(pageTotal) + '<br>Grand Total : ' + commaSeparateNumber(total)
                        '<br />' + (checkNextDBRowsExist ? 'Running' : 'Grand') + '  Total : ' + commaSeparateNumber(total.toFixed(2))
                    );
                }
            }

        }
        ivirDataTableApi.fixedColumns().relayout();
        //$("#iviewFrame").removeClass("hideDatatableFooter");
    } else {
        //$("#iviewFrame").addClass("hideDatatableFooter");
    }
    // dataTblObj.fixedColumns = true;
    // dataTblObj.fixedColumns = {
    //     leftColumns: 3,
    //     rightColumns: 1
    // };
    if (ivirVisibleColumns.length > 0) {
        //if()

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
        if (isChkBox == "true")
            allVisibleColArray.push(0);
        dataTblObj.columnDefs.push({ targets: ivirVisibleColumns, visible: true });
        dataTblObj.columnDefs.push({ targets: '_all', visible: false });
    }
    if (task == undefined || task == "clear") {
        if (task == "clear") {
            groupingCol = "";
            $(".rightClickMenu li.freeze").removeClass('hide');
            ivirDatatable.fnDestroy();
            $(ivirTable + " tfoot td").html("");
        }

        dataTblObj.columnDefs.push({ targets: hiddenColumnIndex, visible: false });
        //dataTblObj.responsive = true;
        //dataTblObj.fixedHeader = true;
        $.fn.dataTable.moment('DD/MM/YYYY');
        $.fn.dataTable.ext.errMode = 'none';
        //if (ivirDataTableApi == undefined)
        ivirDataTableApi = $(ivirTable).DataTable(dataTblObj);
        //new $.fn.dataTable.FixedHeader( ivirDataTableApi );
        //ivirDataTableApi.columns(hiddenColumnIndex).visible(false);
        //if we want to add some validation on initialization of datatable use below code
        //if (task != "clear")
        //    ivirInitailCheck();
        if (task == "clear") {
            if (pillsAccordionHtml != "") {
                $("#pillsWrapper").html(pillsAccordionHtml);
            }


        }



        // ivirDatatable = $('#example').dataTable();
    } else if (task == 'group' || task == 'groupApply') {

        var colIndex = "";
        task != 'groupApply' ? colIndex = index : (colIndex = ivirMainObj.group[index].cl, totalArray = ivirMainObj.group[index].t);
        groupingCol = colIndex;
        $(".rightClickMenu li.freeze").addClass('hide');
        var allColsLength = ivirDataTableApi.columns()[0].length;

        // if (isChkBox == "true") {
        //     dataTblObj.columnDefs = [{ "targets": 0, "orderable": false }, { "visible": false, "targets": colIndex }];

        // } else {
        //     dataTblObj.columnDefs = [{ "visible": false, "targets": colIndex }];
        // }

        dataTblObj.columnDefs.push({ targets: colIndex, visible: false });
        dataTblObj.order = [
            [colIndex, 'asc']
        ];
        dataTblObj.drawCallback = function (settings) {
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
                        //if ($.inArray(1, totalArray) == -1)
                        //    presentGroupHtml += '<td class="groupName" colspan="2">' + group + '</td>';
                        //else
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
                            //presGroupCnt++
                            tmpLastFld = group
                        }
                        else if (tmpLastFld !== group) {
                            //hook to go inside wheb grouping changed so we can add comma logics for old group sum
                            //for (var i = 0; i < tmpGrpTotalArray.length; i++) {

                            //    var lastTotalVal = $("#groupTotal" + tmpLastFld.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '') + tmpGrpTotalArray[i]).text();
                            //    $("#groupTotal" + tmpLastFld.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '') + tmpGrpTotalArray[i]).text(commaSeparateNumber(lastTotalVal));
                            //}
                            _groupChanging("")
                            presGroupCnt = 0;

                            tmpLastFld = group;

                        } else {
                            presGroupCnt++;
                        }
                        //for (var k = 1; k <= totalArray.length; k = k + 3) {
                        var typeCndtnSelected = totalArray[0];
                        var indexSelected = totalArray[1];
                        var valueSelected = getPropertyAccess(totalArray[2]);
                        val = api.row(api.row($(rows).eq(colIdx)).index()).data();
                        var thisSelector = ``;

                        // if (getAjaxIviewData) {
                        thisSelector = valueSelected;
                        //} else {
                        //    thisSelector = indexSelected;
                        //}

                        val[thisSelector] = typeof val[thisSelector] == "object" ? val[thisSelector].display : val[thisSelector];
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
                        //else {
                        //    //$("#groupTotal" + group.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '') + indexSelected).text(0);
                        //}
                        //}
                        if (ivirDataTableApi.page.info().length - 1 == colIdx || (ivirDataTableApi.rows().count() - 1 == colIdx && presGroupCnt !== 0)) {
                            //hook to go inside at the end of the looping so we can add comma logics
                            //for (var i = 0; i < tmpGrpTotalArray.length; i++) {

                            //    var lastTotalVal = $("#groupTotal" + tmpLastFld.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '') + tmpGrpTotalArray[i]).text();
                            //    $("#groupTotal" + tmpLastFld.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '') + tmpGrpTotalArray[i]).text(commaSeparateNumber(lastTotalVal));

                            //}
                            _groupChanging();
                        }

                        function _groupChanging() {

                            //alert(presGroupCnt)
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
        };


        // for foooter grandTotal and page total



        ivirDatatable.fnDestroy();
        $(ivirTable + " tfoot td").html("");
        ivirDataTableApi = $(ivirTable).DataTable(dataTblObj);

        if (pillsAccordionHtml != "")
            $("#pillsWrapper").html(pillsAccordionHtml);

        //ivirDataTableApi.columns(hiddenColumnIndex);;

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
    ivirDatatable = $(ivirTable).dataTable();
    if (getAjaxIviewData) {
        //if datatable scrolls bottom of the page then check if next db rows exists & call webservice and append the rows to the grid
        $(".dataTables_scrollBody").on("scroll", function (e) {
            var $o = $(e.currentTarget);
            var scrollBarExists = $(this).hasScrollBar();
            var scrollAtTheEnd = scrollBarExists ? $o[0].scrollHeight - $o.scrollTop() <= $o.outerHeight() : $o[0].scrollHeight - $o.scrollTop() < $o.outerHeight();
            if (!pageScrollToEnd && scrollAtTheEnd) {
                if (checkNextDBRowsExist && nxtScrollSize < dtDbTotalRecords) //if rows exists in the client side and not binded to the grid then append remaining records to the grid
                    appendNextDtRecords();
                else if (checkNextDBRowsExist) { //call webservice & append next records to the grid based on fetch size
                    showDataTableLoading();
                    setTimeout(function () {
                        getNextDtRecords(dtPageNo + 1);
                    }, 0)
                }
            }
        });
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
                    currScrollSize = nxtScrollSize > dtDbTotalRecords ? dtDbTotalRecords : nxtScrollSize;
                }
                if (currRowSize < currScrollSize) {
                    ivirDataTableApi.rows.add(ivDatas.slice(currRowSize, currScrollSize)).draw(false); //append next records to the datatable & redraw it
                }
                console.log(new Date() + ': load time');
            }, 0);
        }
    }

    //var heightOfFinalDT = $(".iviewTableWrapper")[0].offsetHeight - ($("#ivirCustomContainer")[0].offsetHeight + $(".dataTables_scrollHead")[0].offsetHeight + $(".dataTables_scrollFoot")[0].offsetHeight + $(".dataTables_info")[0].offsetHeight + 5);//dataTables_scrollHead & footer as well 
    //var heightOfFinalDT = $(".iviewTableWrapper")[0].offsetHeight - ($("#ivirCustomContainer")[0].offsetHeight + 5);//dataTables_scrollHead & footer as well 
    //var heightOfFinalDT = $(".iviewTableWrapper")[0].offsetHeight - ($("#ivirCustomContainer")[0].offsetHeight + $(".dataTables_scrollHead")[0].offsetHeight + $(".dataTables_scrollFoot")[0].offsetHeight - 17);//dataTables_scrollHead & footer as well 

    //var heightOfFinalDT = $(".iviewTableWrapper")[0].offsetHeight - ($("#ivirCustomContainer")[0].offsetHeight + $(".dataTables_scrollHead")[0].offsetHeight + $(".dataTables_scrollFoot")[0].offsetHeight + 10);//dataTables_scrollHead & footer as well 

    setSmartViewHeight();

    if (fixedColumnsObj !== "" && task != 'group' && task != 'groupApply') {
        fixedColumnsObj = new $.fn.dataTable.FixedColumns(ivirDataTableApi, {
            iLeftColumns: fixedColumnsObj.s.iLeftColumns
        });
    }

    var filterSelectHtml = "";
    //filterSelectHtml += '<select name="IvirActions" class="form-control cup" id="IvirActions">';
    //filterSelectHtml += '<option value="">Actions</option>';
    //filterSelectHtml += '<optgroup label="Options">';
    //filterSelectHtml += '<option value="save">Save</option>';
    //filterSelectHtml += '<option value="download">Download</option>';
    //filterSelectHtml += '<option value="SHcolumns">Columns</option>';
    //if (task == 'group' || task == 'groupApply')
    //    filterSelectHtml += '<option disabled value="chart">Chart</option>';
    //else
    //    filterSelectHtml += '<option value="chart">Chart</option>';
    //filterSelectHtml += ' </optgroup>';
    //filterSelectHtml += '<optgroup label="Data">';
    //filterSelectHtml += '<option value="sort">Sort</option>';
    //filterSelectHtml += '</optgroup>';
    //filterSelectHtml += '<optgroup label="Format">';
    //filterSelectHtml += '<option value="rowGrouping">Row Grouping</option>';
    //filterSelectHtml += '<option value="highlighting">Highlight</option>';
    //filterSelectHtml += '</optgroup>';
    //filterSelectHtml += '</select>';

    filterSelectHtml += '<div class="dropDownButton js-dropdown ivirActionDrpDwn">';
    filterSelectHtml += '<input type="hidden" name="IvirActions" id="IvirActions" class="js-dropdown__input" value="">';
    filterSelectHtml += '<button type="button" title="' + callParentNew('lcm')[406] + '" id="ivirActionButton" class="c-button c-button--dropdown js-dropdown__current">' + callParentNew('lcm')[406] + '</button>';
    filterSelectHtml += '<ul class="dropDownButton__list" style="display: block; visibility: hidden;">';
    filterSelectHtml += '<li class="dropDownButton__item subHeader" data-dropdown-value="save">' + callParentNew('lcm')[406] + '</li>';
    filterSelectHtml += '<li class="dropDownButton__item" data-dropdown-value="save"><i class="fa fa-floppy-o customIcon" aria-hidden="true"></i>' + callParentNew('lcm')[400] + '</li>';
    //if (!classicView ) {
    //    filterSelectHtml += '<li class="dropDownButton__item" data-dropdown-value="download"><i class="fa fa-download customIcon" aria-hidden="true"></i> Download</li>';
    //}
    filterSelectHtml += '<li class="dropDownButton__item" data-dropdown-value="SHcolumns"><i class="fa fa-columns customIcon" aria-hidden="true"></i>' + callParentNew('lcm')[401] + '</li>';
    var chartClass = "";
    if (task == 'group' || task == 'groupApply')
        chartClass = "subHeader"
    filterSelectHtml += '<li id="chartActionLi" class="dropDownButton__item ' + chartClass + '" data-dropdown-value="chart"><i class="fa fa-pie-chart customIcon" aria-hidden="true"></i>' + callParentNew('lcm')[402] + '</li>';
    filterSelectHtml += '<li class="dropDownButton__item" data-dropdown-value="moreFilters"><i class="fa fa-search customIcon" aria-hidden="true"></i>' + callParentNew('lcm')[399] + '</li>';
    filterSelectHtml += '<li class="dropDownButton__item" data-dropdown-value="clearFilters"><i class="fa fa-eraser customIcon" aria-hidden="true"></i>' + callParentNew('lcm')[443] + '</li>';
    filterSelectHtml += '<li class="dropDownButton__item subHeader" data-dropdown-value="data">' + callParentNew('lcm')[405] + '</li>';
    filterSelectHtml += '<li class="dropDownButton__item" data-dropdown-value="sort"><i class="fa fa-sort-amount-asc customIcon" aria-hidden="true"></i>' + callParentNew('lcm')[403] + '</li>';
    filterSelectHtml += '<li class="dropDownButton__item subHeader" data-dropdown-value="save" id="Format_header">' + callParentNew('lcm')[423] + '</li>';
    filterSelectHtml += '<li class="dropDownButton__item" data-dropdown-value="rowGrouping"><i class="icon-software-layers2 customIcon" aria-hidden="true"></i>' + callParentNew('lcm')[404] + '</li>';
    filterSelectHtml += '<li class="dropDownButton__item" data-dropdown-value="highlighting"><i class="icon-software-paintbrush customIcon" aria-hidden="true"></i>' + callParentNew('lcm')[396] + '</li>';
    filterSelectHtml += '</ul>';
    filterSelectHtml += '</div>';



    $("#filterWrapper").html(filterSelectHtml);

    applyAdvFilter();

    // ivirCustomActionButtons

    var customButtonHtml = "";
    if (ivirMainObj.chart == undefined) {
        customButtonHtml += '<div style="display:none;" id="ivirCButtonsWrapper">';
    } else {
        customButtonHtml += '<div id="ivirCButtonsWrapper">';
    }

    if (task == 'group' || task == 'groupApply') {
        //showAlertDialog("warning", msg);
        customButtonHtml += '<button disabled title="Grid View" type="button" class="disabled grdView task-button shadow animate blue"><span class="disabled ivirCButton icon-software-layout-8boxes"></span></button>';
        customButtonHtml += '<button data-count="0" onclick="toggleGridView(\'showChartErrMsg\',this)" title="Chart View." type="button" class="disabled chrtView task-button shadow animate blue"><span class="disabled ivirCButton icon-ecommerce-graph1"></span></button>';
    }
    else {
        customButtonHtml += '<button title="Grid View" type="button" onclick="toggleGridView(\'grid\')" class="grdView task-button shadow animate blue"><span class="ivirCButton icon-software-layout-8boxes"></span></button>';
        customButtonHtml += '<button title="Chart View" type="button" onclick="toggleGridView(\'chart\');" class="chrtView task-button shadow animate blue"><span class="ivirCButton icon-ecommerce-graph1"></span></button>';

    }


    customButtonHtml += '</div>';
    $("#ivirCustomActionButtons").html(customButtonHtml);

    if (!$("#iconsUl #myFiltersLi").hasClass('hidden')) {
        if (accordianClone) {
            accordianClone.find(".panel-collapse.collapse").removeClass("in")

            accordianClone.insertAfter($("#ivirCustomContainer .row:first"));
        }
        $("#filterColumnSelect").addClass('filterExixts');
    }
    var allColumns = ivirDataTableApi.columns();
    // selectHtml = "<select id='searchSelectColumn' class='form-control'>"
    // selectHtml += "<option value=''></option>"

    // selectHtml += "</select>";
    selectHtml = "";
    selectHtml += '<div class="dropDownButton js-dropdown">';
    selectHtml += '<input type="hidden" name="searchSelectColumn" id="searchSelectColumn" class="js-dropdown__input">';
    selectHtml += '<button type="button" title="Search All" id="searchSelectColumnButton" class="c-button c-button--dropdown js-dropdown__current">All</button>';
    selectHtml += '<ul class="dropDownButton__list">';
    selectHtml += '<li class="dropDownButton__item" data-dropdown-value="all">All</li><li class="dropDownButton__item" data-dropdown-value="filter">Custom Filter</li>';
    for (var i = 0; i < allColumns[0].length; i++) {
        if (isChkBox == "true" && i == 0)
            continue;
        var headerName = $(ivirDataTableApi.columns(i).header()).text().trim();
        // selectHtml += "<option value=" + headerName + " data-index=" + i + ">" + headerName + "</option>";
        selectHtml += '<li class="dropDownButton__item"  data-index=' + i + ' data-dropdown-value="' + headerName + '">' + headerName + '</li>';

    }
    selectHtml += '</ul>';
    selectHtml += '</div>';

    var customHtml = "", axpbtnHTML = "";
    if (custBtnIVIR.length !== 0) {
        customHtml += '<select name="IvirCustomActions" class="form-control cup" id="IvirCustomActions">';
        customHtml += '<option value="">Options</option>';
        var tmpObj = {}
        //var tmpName = [];
        for (i = 0; i < custBtnIVIR.length; i++) {
            var btnObj = custBtnIVIR[i].split('$');
            //tmpName[i] = btnObj[2];
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
                    axpbtnHTML += `<button class="btn btn-primary cutomActionBtns dropdown-toggle" type="button" data-toggle="dropdown">${presKey.substr(8)} <span class="caret"></span></button>`;
                    axpbtnHTML += '<ul class="dropdown-menu">';
                    for (var j = 0; j < btnsLength; j++) {
                        let keyValue = presentGroupBtns[j].split("$");
                        axpbtnHTML += `<li><a onclick="fireTheCustomAction('${keyValue[0]}')" href="javascript:void(0)">${keyValue[1]}</a></li>`;
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


        //var uniqueNames = [];
        //$.each(tmpName, function (i, el) {
        //    if ($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
        //});

        //for (i = 0; i < uniqueNames.length; i++) {
        //    if (typeof (uniqueNames[i]) == "customActions") {
        //        customHtml += '<optgroup label="Options">';
        //    }
        //    else {
        //        customHtml += '<optgroup label="' + uniqueNames[i] + '">';
        //    }
        //    for (j = 0; j < tmpObj[uniqueNames[i]].length; j++) {
        //        var optVal = tmpObj[uniqueNames[i]][j].split("$");
        //        customHtml += '<option value="custBtn' + optVal[0] + '">' + optVal[1] + '</option>';
        //    }
        //}
        //customHtml += '<optgroup label="' + btnObj[2] + '">';
        //
        customHtml += '</optgroup>';
        customHtml += '</select>';
    }



    $("#filterColumnSelect").html(selectHtml);
    $("#customActionBtn").html(customHtml + axpbtnHTML);
    $('div.dataTables_filter input').addClass('ivirSearchFld form-control');
    createMainEventsOnGrid();
    setSmartViewHeight();
}

function autoSplitChecker() {
    let isAutoSplit = ``;
    if (!getAjaxIviewData) {
        isAutoSplit = $("#hdnAutoSplit").val();
    } else {
        if (ivConfigurations) {
            try {
                isAutoSplit = ivConfigurations.filter((val, ind) => {
                    return val.PROPS && val.PROPS.toLowerCase() == "autosplit"
                })[0]["PROPSVAL"];
            } catch (ex) { }
        }
    }
    if (isAutoSplit != undefined && isAutoSplit.toLowerCase() == "true")
        callParentNew(`assocateIframe(${true})`, 'function');
}

function getPropertyAccess(property) {
    return isPerf ? "@" + property.toUpperCase() : property;
}

function genarateCellCheckbox({ col, row, rowData }) {
    var checkboxVal = rowData[getPropertyAccess("rowno")];
    return `<center><input name="chkItem" style="width:10px; height:12px;" type="checkbox" onclick="javascript:ChkHdrCheckbox();" value="${checkboxVal}"></center>`;
}

function htmlEncode(value) {
    return $('<div/>').text(value).html();
}

function htmlDecode(value) {
    return $('<div/>').html(value).text();
}

function generateExpColTree({ td, cellData, rowData, row, col, colID, rowDataAccess }) {
    //Expand/Collapse TreeMethod
    var newCellData = $(td).html();
    if (cellHeaderConf.root_atype_index && cellHeaderConf.root_account_index && getPropertyAccess(cellHeaderConf.root_account_index)
        == rowDataAccess && rowData[getPropertyAccess(cellHeaderConf.root_atype_index)].toString().toLowerCase() == "group") {
        //cellData = 
        var prefixStr = rowData[rowDataAccess].match(/^([\s]+)/g);
        prefixStr = prefixStr != null ? prefixStr[0].replace(/ /g, "&nbsp;") : "";
        newCellData = `${prefixStr}<span class='icon-arrows-plus' style='font-size: 12px;'>${newCellData}</span>`;
    }
    return newCellData;
}


function processCellData({ td, cellData, rowData, row, col, colID, rowDataAccess }) {
    cellData = typeof cellData != "undefined" && cellData != null ? cellData.toString() : ``;

    cellData.indexOf("~") > -1 && (cellData = cellData.replace(/~/g, "<br />"));

    if (cellData != "&nbsp;" && col != 0) {
        var nVal = cellData;
        if (nVal.indexOf("&nbsp;") != -1)
            nVal = nVal.replace(/&nbsp;/g, " ");
        // if (!(nVal.indexOf("<") == 0 && nVal.indexOf(">") == nVal.length - 1) && !(nVal.indexOf("<") > -1 && (nVal.indexOf("</") > -1 || nVal.indexOf("/>") > -1))) {
        //Below is another method to convert special characters in iview hyperlink- currently not used
        //var encodedStr = nVal.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
        //    return '&#'+i.charCodeAt(0)+';';
        //});
        //cellData = encodedStr;

        //different form c#: removed here
        // cellData = htmlEncode(cellData);            
        //}
    } else if (col == 0) {
        //set correct row number even in case of pagination
        cellData = (row + 1).toString();
        rowData[getPropertyAccess("rowno")] = cellData;
    }

    switch (ColumnType[col]) {
        case "c":
            cellData = cellData.trim();
            break;
        case "n":
            if (cellData != "" && cellData != "&nbsp;" && !cellData.toString().startsWith("(") && isInValidNumber(cellData)) {
                cellData = "0";
            }
            break;
        case "d":
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
            break;
    }
    if (rowData[getPropertyAccess("axrowtype")] && (rowData[getPropertyAccess("axrowtype")] == "stot" || rowData[getPropertyAccess("axrowtype")] == "subhead" || rowData[getPropertyAccess("axrowtype")] == "gtot")) {
        //specialRows.add(row + 1);
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
        if (isChkBox == "true" && col == 0) {
            cellData = "";
        }
        if (bulkDownloadEnabled) {
            if (cellHeaderConf.FilesIndexes[col] && cellData != "" && cellData != "&nbsp;") {
                cellData = "<a class=\"downloadLink" + row + "\" href=\"javascript:SetFileToDownload('" + proj + "','" + rowData[getPropertyAccess(FieldName[HeaderText.indexOf["transid"]])] + "','" + rowData[getPropertyAccess(FieldName[HeaderText.indexOf["axp_gridattach"]])] + "','" + cellData + "');\">" + " <img src=\"../AxpImages/Downloads-icon.png\" alt=\"Download\"/>" + "</a>";
            }
        }
    }


    return cellData;
}

//function isValidDate(dateStr) {
//    if (isNaN(dateStr)) {
//        return false;
//    } else {
//        var dt = new Date(dateStr);
//        if (isNaN(dt.getTime())) {
//            return true;
//        } else {
//            return false;
//        }
//    }
//}

function tryParseInt(str, returnValue) {
    str = str.toString().replace(/,/g, "")
    if (str !== null && str.length > 0 && !isNaN(str)) {
        returnValue = parseInt(str);
    }
    return returnValue;
}

function isInValidNumber(dateStr) {
    var tmpVal = "";
    if ((tmpVal = tryParseInt(dateStr, "")) || tmpVal === 0) {
        return false;
    } else {
        return true;
    }
}

function getDateBasedOnCulture(dateStr) {
    if (dateStr != "") {
        dateStr = dateStr.split(" ")[0];
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
    }
    return dateStr;
}

function generateCellHyperlink({ cellData, rowData, row, col, colID, rowDataAccess }) {
    //var returnString =  typeof cellData != "undefined" && cellData != null ? cellData : ``;
    var returnString = cellData;

    var hLinkData;
    if (returnString && HideColumn[col] == "false") {
        //hyperlink action
        var _params = ``;
        var _lastMapParam = ``;
        var _lastMapCol = ``;
        var _lastMapValue = ``;
        var _torecid = `&torecid=false`;


        var _urlProp = ``;
        if (ivConfigurations) {
            try {
                _urlProp = ivConfigurations.filter((val, ind) => {
                    return val.HLINK && val.HLINK == colID && val.PROPS.toLowerCase() == "navigation"
                })[0]["PROPSVAL"];
            } catch (ex) { }
        }
        ivHeadRows[colID]["@map"] && ivHeadRows[colID]["@map"].split(",").forEach((val, index) => {
            if (val.indexOf("=:") > -1) {
                var splitVal = val.split("=:");
                _lastMapParam = splitVal[0].indexOf(".") > -1 ? splitVal[0].split(".")[1] : splitVal[0];
                _lastMapCol = splitVal[1];
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
            // _params += encodeURI("&" + _lastMapParam + "=" + _lastMapValue);
            _params += "&" + _lastMapParam + "=" + _lastMapValue;
        });




        ////REPLACE # not &# with %23
        //var reg = new RegExp('(?<!&)#', 'g');
        //_params = _params.replace(reg, '%23');
        _params = _params.split("#").map((val, ind) => {
            return val.endsWith("&") && ind != (_params.split("#").length - 1) ? val + "#" : (ind != _params.split("#").length - 1 ? val + "%23" : val);
        }).join("");
        _params = _params.replace(/\+/g, '%2b');
        ////Below replacing %3C to &l%3Ct; as '<' symbol even in encoded format cannot be recieved in the ivtstload and ivtoivload page
        _params = _params.replace(/%3C/g, 'l%3tC;');
        cellData = cellData.replace(/&nbsp;/g, " ");
        if (!(cellData.indexOf("<") == 0 && cellData.indexOf(">") == cellData.length - 1) && !(cellData.indexOf("<") > -1 && (cellData.indexOf("</") > -1 || cellData.indexOf("/>") > -1))) {

            cellData = CheckSpecialChars(cellData);
        }
        var refresh = ``;
        var isRefreshParent = `false`;
        var isRefreshParentAction = `false`;
        if (axp_refresh && axp_refresh == "true") {
            refresh = "&axp_refresh=" + Convert.ToString(iviewObj.Axp_refresh);
        } else if (ivHeadRows[colID]["@refresh"]) {
            isRefreshParent = ivHeadRows[colID]["@refresh"].toLowerCase();
        }
        if (hLinkData = ivHeadRows[colID]["@hlaction"]) {
            if (returnString.toString() != "0") {
                try {
                    if (ivActions && ivActions[hLinkData]) {
                        isRefreshParentAction = ivActions[hLinkData].r1.param1.visible.toLowerCase();
                    }
                } catch (ex) { }
                returnString = "<a href=\"javascript:callHLaction('" + ivHeadRows[colID]["@hlaction"] + "'," + parseInt(rowData[getPropertyAccess("rowno")], 10) + ",'" + iName + "','" + _urlProp + "');setRefreshParent('" + isRefreshParentAction + "');\" class=l3>" + cellData + "</a>";
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
                            if (isPopup) {
                                returnString = "<a href='javascript:void(0)' onclick='javascript:SetColumnName(\"" + _lastMapCol + "\",\"" + parseInt(row, 10) + "\",\"" + true + "\");setRefreshParent(\"" + isRefreshParent + "\");LoadPopPage(\"ivtstload.aspx?tstname=" + hLinkData + _params + _hLinkType + _torecid + refresh + "\",\"\",\"\",\"" + _urlProp + "\");' data-url=\"ivtstload.aspx?tstname=" + hLinkData + _params + _hLinkType + _torecid + refresh + "\" class=\"handCur l2\"  >" + cellData + "</a>";
                            } else {
                                returnString = "<a href='javascript:void(0)' onclick='javascript:SetColumnName(\"" + _lastMapCol + "\",\"" + parseInt(row, 10) + "\",\"" + true + "\");LoadTstFrmIview(\"" + "./ivtstload.aspx?tstname=" + hLinkData + "\",\"" + _params + _hLinkType + _torecid + "\",\"" + hLinkData + "\",\"" + _urlProp + "\");' data-url=\"ivtstload.aspx?tstname=" + hLinkData + _params + _hLinkType + _torecid + "\" " + className + " >" + cellData + "</a>";
                            }
                        }
                        break;
                    case "i":
                        {
                            if (isPopup) {
                                returnString = "<a href='javascript:void(0)' onclick='javascript:LoadPopPage(\"ivtoivload.aspx?ivname=" + hLinkData + _params + _hLinkType + "\",\"\",\"\",\"" + _urlProp + "\");' data-url=\"ivtoivload.aspx?ivname=" + hLinkData + _params + _hLinkType + "\" class=\"handCur l2\"  >" + cellData + "</a>";
                            } else {
                                var _urlStr = `ivtoivload.aspx?ivname=` + hLinkData;
                                _params = _params.replace(/%26/g, "--.--");
                                returnString = "<a href='javascript:void(0)' onclick=\"javascript:OpenIviewFromIv('" + _urlStr + "','" + _params + _hLinkType + "','" + hLinkData + "','" + _urlProp + "');\"" + className + ">" + cellData + "</a>";
                            }
                        }
                        break;
                    //page no longer used
                    //case "p":
                    //    break;
                }
            }
        }
    }
    return returnString;
}

function applyConditionalFormatting({ td, rowData, colID }) {
    if (rowData[getPropertyAccess("axp__font")]) {
        rowData[getPropertyAccess("axp__font")].split("~").forEach((val, ind) => {
            if (val.startsWith(colID + ",")) {
                var fontSplit = val.split(",");
                var fontString = fontSplit.reduce((result, item, index) => {
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
                var elem = $(td);
                if (elem.children().length) {
                    //elem = elem.find("a");
                    SetAxFontCondition(elem.children(), fontString)
                }
                SetAxFontCondition(elem, fontString);
            }
        });
    }
}

function getParamsValueArray() {
    var paramString = $("#hdnparamValues").val();
    var returnArray = [];
    typeof paramString == "string" && paramString.replace(/¿/g, '♣').split('♣').forEach((v, i) => {
        if (v) {
            var splitVal = v.split("~");
            returnArray[CheckSpecialCharsInStr(splitVal[0])] = CheckSpecialCharsInStr(splitVal[1].toString()).replace(/&amp;grave;/g, '~');
        }
    });
    return returnArray;
}

function setSmartViewHeight() {

    var dtScrollFootOffsetHeight = 0;
    try {
        $(".dataTables_scrollFoot").length ? dtScrollFootOffsetHeight = $(".dataTables_scrollFoot")[0].offsetHeight : "";
    } catch (ex) { }




    //try {
    //    var heightOfFinalDT = $(".iviewTableWrapper")[0].offsetHeight - ($("#ivirCustomContainer")[0].offsetHeight + $(".dataTables_scrollHead")[0].offsetHeight + dtScrollFootOffsetHeight + subCaptionHeight + 10);//dataTables_scrollHead & footer as well 

    //    //var heightType =  $('.dataTables_scrollBody').height() > heightOfFinalDT ? "max-height" : "height";

    //    //$('.dataTables_scrollBody').css({ heightType: heightOfFinalDT });

    //    $('.dataTables_scrollBody').height() > heightOfFinalDT ? $('.dataTables_scrollBody').css({ "max-height": heightOfFinalDT }) : $('.dataTables_scrollBody').css({ "height": heightOfFinalDT });
    //} catch (ex) { }

    var reqNextPageHeight = 0;
    try {
        $("#requestNextRecords").length ? reqNextPageHeight = $("#requestNextRecords")[0].offsetHeight : "";
    } catch (ex) { }

    var pillContainerHeight = 0;
    try {
        $("#ivirCustomContainer").length ? pillContainerHeight = $("#ivirCustomContainer")[0].offsetHeight : "";
    } catch (ex) { }

    var subCaptionHeight = 0;
    try {
        $(".ivcaptions").length ? subCaptionHeight = $(".ivcaptions").outerHeight(true) : "";
    } catch (ex) { }


    //new logic
    var heightOfFinalDT = Math.round(($(window).height()) - ($("#breadcrumb-panel").outerHeight(true) + $("#ivContainer").outerHeight(true) + $(".dataTables_scrollHead").outerHeight(true) + dtScrollFootOffsetHeight + reqNextPageHeight + pillContainerHeight + subCaptionHeight + 14));
    $('.dataTables_scrollBody').height() > heightOfFinalDT ? $('.dataTables_scrollBody').css({ "max-height": heightOfFinalDT }) : $('.dataTables_scrollBody').css({ "height": heightOfFinalDT });
}

function applyAdvFilter(idOfAdvField) {
    //!idOfAdvField.startsWith("#") ? (idOfAdvField = "#" + idOfAdvField) : "";
    var advFilterTemplate = ``;
    //advFilterTemplate += `<button id="ivirMoreButton" class="c-button c-button--dropdown js-dropdown__current" type="button" onclick="ivirMoreFilters()">`,
    ////advFilterTemplate += `More`;
    //advFilterTemplate += `</button>`;
    $("#advFilterWrapper").append(advFilterTemplate);
}

function ivirMoreFilters(pillindex = -1) {
    $("#divModalAdvancedFilters span.customError").remove();
    var allColumns = ivirDataTableApi.columns();
    var allColumnsLength = allColumns[0].length;
    //var headerName = $(ivirDataTableApi.columns(i).header()).text().trim();

    var moreFilters = ``;
    var prevDrawnMoreFilters = $("#divModalAdvancedFilters .body-cont").parent();
    if (prevDrawnMoreFilters.length == true) {
        //if(pillindex != -1){
        prevDrawnMoreFilters.find(".body-cont").attr("data-pillindex", pillindex).data("pillindex", pillindex);
        //}
        moreFilters = prevDrawnMoreFilters.detach();
        initAdvFilters = false;
    }
    else {
        initAdvFilters = true;
        if (allColumnsLength > 0) {
            moreFilters += `<div class="bodyAndFooter-cont" style="height:100%;">` +
                `<input type="text" id="advSearchName" class="form-control fldNme" value="" placeholder="${callParentNew('lcm')[417]}" style="height: 35px !important;border-radius:5px;" />` +
                `<div class="body-cont" style="height: calc(100% - 70px);overflow: auto;margin-top:5px;" data-pillindex="${pillindex}">` +
                //`<table class="gridData stripe row-border dataTable"><thead><th>Name</th><th>Value</th></thead><tbody>`;
                //`<input type="text" id="advSearchName" class="form-control fldNme" value="" placeholder="Enter filter name for creating filter" maxlength="20" style="height: 30px;" />` +

                //`<div class="col-sm-2"><div class="form-group"><label>Filter Name</label><span class="red">*</span><a href="javascript:void(0)" class="icon-arrows-question" tabindex="-1" data-toggle="popover" data-placement="right" title="" data-content="Please enter filter name" data-original-title=""></a></div>` +
                //`</div>`+
                //`<div class="col-sm-10"><input type="text" id="advSearchName" class="form-control fldNme" value="" style="height: 30px !important;margin-right: 7px;float:right;" /></div>` +
                //`<table class="gridData stripe row-border" style="min-width: initial;margin-top:5px"><thead><th>Name</th><th>Value</th></thead><tbody>`;

                `<table class="gridDataFilter stripe row-border" style="min-width: initial;margin-top:12px">` +
                //`<thead><th>`+
                //`<div class="col-md-12 col-sm-12">`+
                //`<div class="form-group"><label>Filter Name</label><span class="red">*</span><a href="javascript:void(0)" class="icon-arrows-question" tabindex="-1" data-toggle="popover" data-placement="right" title="" data-content="Please enter filter name" data-original-title=""></a></div>`+
                //`</div>`+
                //`</th><th>`+
                //`<div class="col-sm-12 col-md-12">`+
                //`<input type="text" id="advSearchName" class="form-control fldNme" value="" style="height: 35px !important;border-radius:5px;" /></div>`+
                //`</th></thead>`+
                `<tbody>`;

            allColumns.every(function (index) {
                if (hiddenColumnIndex.indexOf(index) == -1) {
                    var headerCaption = $(this.header()).text().trim();
                    var headerName = $(this.header()).attr("id").replace("GridView1_ctl01_", "");
                    if (headerName != "" && headerName != "rowno") {
                        //moreFilters += `<tr><td>${headerName}</td><td>${getInnerAdvFilter(headerName)}:<input id="fldA${index}" data-field="${headerName}" /><input id="fldB${index}"  data-field="${headerName}" /></td></tr>`;
                        var colType = ivirColumnTypeObj[headerName];
                        moreFilters += `<tr data-coltype="${colType}" data-field="${headerName}" data-index="${index}"><td>${headerCaption}</td><td>${getInnerAdvFilter(headerName, colType, index)}</td></tr>`;
                    }
                    //debugger;
                }
            });
            //moreFilters += `<tr>` +
            //                `</tr>` +

            moreFilters += `</tbody></table>` +
                `` +
                `</div>` +
                `<div class="footer-cont" style="height: 32px;position: absolute;bottom: 0px;right: 0px;margin: 10px;margin-bottom: 15px;padding-top: 5px;width: calc(100% - 20px);border-top: 1px solid black;">` +
                `<div class="" style="">` +
                //`<input type="button" name="btnResetFilter" value="resetFilter" onclick="resetMoreFilters();" id="btnResetFilter" title="Reset Filter" class="hotbtn btn fa fa-refresh handCursor allow-enter-key">` +
                `<button id="resetMoreFilters" class="coldbtn btn handCursor allow-enter-key lastFocusable" onclick="resetMoreFilters();" title="${callParentNew('lcm')[444]}">${callParentNew('lcm')[444]}</button>` +
                `</div>` +
                `<div class="pull-right" style="" id="filterBtn">` +
                `<input type="button" name="btnFilterApply" value="${btnFilterApplyVal}" onclick="" id="btnFilterApply" title="${btnFilterApplyVal}" class="normalbtn btn handCursor allow-enter-key" style="margin-right: 5px;" />` +
                `<input type="button" name="btnFilter" value="${btnFilterApplyEditVal}" onclick="" id="btnFilter" title="${btnFilterApplyEditVal}" class="hotbtn btn handCursor allow-enter-key" />` +
                //`<input name="btncancel" type="button" id="btncancel" value="Cancel" title="Cancel" style="display: inline-block;" class="coldbtn btn handCursor">` +
                //`<input name="btnRestore" type="button" id="btnRestore" value="Restore Defaults" title="Restore Defaults" onclick="loadDefaultValues(); EnableEdit();" class="coldbtn btn handCursor allow-enter-key lastFocusable">` +
                //`<input name="btnUnlock" type="button" id="btnUnlock" value="Unlock" title="Unlock" onclick="UnlockPage();" class="hotbtn btn handCursor allow-enter-key" style="display:none;">` +
                `</div>` +
                `</div>` +
                `</div>`
        } else {
            moreFilters += `No Columns to filter.`
        }
    }
    //debugger;
    //displayBootstrapModalDialog("More Filters", "lg", "330px", false, moreFilters, "", initMoreFiltersAddOns);
    displayBootstrapModalDialog("Advanced Filters", "lg", "330px", false, moreFilters, "", initMoreFiltersAddOns);

}

function getInnerAdvFilter(headerName, colType, index) {

    var filterStr = ``;
    //var dateOptions = ["Custom", "Today", "Yesterday", "Tomorrow", "This week", "Last week", "Next week", "This fortnight", "Last fortnight", "Next fortnight", "This month", "Last month", "Next month", "This quarter", "Last quarter", "Next quarter", "This year", "Last year", "Next year"];

    switch (colType) {
        case "c":
            filterStr += `<div class="col-md-12 col-sm-12"><input id="${headerName.replace(/ /g, "_").toLowerCase()}Filter" class="moreFiltersInput characterFilter form-control" type="text" data-field="${headerName}" data-index="${index}" /></div>`;
            break;
        case "n":
            filterStr += `<div class="col-md-6 col-sm-12"><input id="${headerName.replace(/ /g, "_").toLowerCase()}Filter1" class="moreFiltersInput numericFilter form-control" type="number" placeholder="${callParentNew('lcm')[427]}" data-field="${headerName}" data-index="${index}" /></div><div class="col-md-6 col-sm-12"><input id="${headerName.replace(/ /g, "_").toLowerCase()}Filter2" class="moreFiltersInput numericFilter form-control" type="number" placeholder="${callParentNew('lcm')[428]}" data-field="${headerName}" data-index="${index}" /></div>`;
            break;
        case "d":
            filterStr += `<div class="col-md-4 col-sm-12"><select id="${headerName.replace(/ /g, "_").toLowerCase()}Options" class="moreFiltersInput dateFilter form-control" type="text" data-field="${headerName}" data-index="${index}" >${dateOptions.map((opt, indexx) => { return `<option value="${opt.replace(/ /g, "_").toLowerCase()}Option">${dateOptionsCaption[indexx]}</option>` }).join("")}</select></div><div class="col-md-4 col-sm-12"><input id="${headerName.replace(/ /g, "_").toLowerCase()}Filter1" class="moreFiltersInput dateFilter date form-control" type="text" placeholder="${callParentNew('lcm')[427]}" data-field="${headerName}" data-index="${index}" style="display: inline-block; width: calc(100% - 25px);" /></div><div class="col-md-4 col-sm-12"><input id="${headerName.replace(/ /g, "_").toLowerCase()}Filter2" class="moreFiltersInput dateFilter date form-control" type="text" placeholder="${callParentNew('lcm')[427]}" data-field="${headerName}" data-index="${index}" style="display: inline-block; width: calc(100% - 25px);" /></div>`;
            break;
        case "t":
            filterStr += `Time`;
            break;
    }
    return filterStr;
}


function initMoreFiltersAddOns() {
    //if any search is created previously then prevent reseting filters for the next time when user opens a filter dialog
    var filterType = $('[data-dropdown-value="moreFilters"]').attr("data-filter-type");
    if (filterType == "filter")
        resetMoreFilters();
    //$("#btnFilter").val(callParentNew('lcm')[442]).prop({'title':callParentNew('lcm')[442]});;
    //$("#btnFilterApply").val(callParentNew('lcm')[399]).prop({'title':callParentNew('lcm')[399]});
    //$("[data-coltype=n] [id$='1']").attr('placeholder',callParentNew('lcm')[427]);
    //$("[data-coltype=n] [id$='2']").attr('placeholder',callParentNew('lcm')[428]);
    //$("[data-coltype=d] [id$='1']").attr('placeholder',callParentNew('lcm')[427]);
    //$("[data-coltype=d] [id$='2']").attr('placeholder',callParentNew('lcm')[428]);
    //$("[data-coltype=d] [id$='datetimeOptions']").attr('placeholder',callParentNew('lcm')[428]);
    //$("#resetMoreFilters").text(callParentNew('lcm')[444]).attr('title',callParentNew('lcm')[444]);
    //$("#advSearchName").attr('placeholder',callParentNew('lcm')[417]);

    var modalHeader = eval(callParent("divModalHeader", "id") + ".getElementById('divModalHeader')");
    modalHeader.innerText = callParentNew('lcm')[409];
    if (initAdvFilters) {
        $(".moreFiltersInput.characterFilter").each(function () {
            var source = [...new Set(
                //ivirDataTableApi.columns(HeaderText.indexOf($(this).data("field"))).data()[0].map(
                //ivirDataTableApi.columns(filteredColumns.indexOf($(this).data("field"))).data()[0].map(
                //ivirDataTableApi.columns(parseInt($(this).data("index"), 10)).data()[0].map(
                ivirDataTableApi.cells(ivirDataTableApi.rows(":not(.specialRow)").nodes(), parseInt($(this).data("index"), 10)).data().toArray().map(
                    function (fldVal) {
                        return $($.parseHTML(fldVal)).text()
                    }
                ))
            ];
            source.indexOf("") > -1 ? source.splice(source.indexOf(""), 1) : "";
            $(this).tokenfield({
                autocomplete: {
                    source,
                    delay: 100
                },
                showAutocompleteOnFocus: true,
                delimiter: "♣|♣",
                beautify: false,
                createTokensOnBlur: true
            })
            //    .on('tokenfield:createtoken', function (e) {
            //    var data = e.attrs.value.split('|')
            //    e.attrs.value = data[1] || data[0]
            //    e.attrs.label = data[1] ? data[0] + ' (' + data[1] + ')' : data[0]
            //});

            $('.tokenfield').on('tokenfield:createtoken', function (event) {
                if ($(this).find("input.moreFiltersInput").tokenfield('getTokens').filter(function (vals) { return vals.value == event.attrs.value }).length > 0) {
                    event.preventDefault();
                }
            });

            $(".body-cont").off("scroll.closeAutoComp").on("scroll.closeAutoComp", function () {
                $(".body-cont .ui-autocomplete-input").autocomplete("close");
            });

        });

        AddDatePicker("divModalAdvancedFilters");
    }
    var moreFilters = $("#divModalAdvancedFilters .body-cont").parent();
    var pillindex = moreFilters.find(".body-cont").data("pillindex");
    if (pillindex != -1) {
        pushSearchStringtoFilters(ivirMainObj.filter[pillindex].data, "JSON");
        $("#advSearchName").val(ivirMainObj.filter[pillindex].n);
        $("#btnFilterApply").val(btnFilterApplyEditVal);
        $("#btnFilter").hide();
    } else {
        $("#btnFilterApply").val(btnFilterApplyVal);
        $("#btnFilter").show();
    }
    ivirbindEvents("filter");
}

function pushSearchStringtoInput() {
    var searchInput = $("#ivInSearchInput");
    searchInput.val(generateSearchString());
    searchInput.trigger("keyup");
}

function generateSearchString(returnType = "string") {
    var searchString = ``;
    var searchJSON = {};
    $("tr[data-coltype]").each(function () {
        switch ($(this).data("coltype")) {
            case "c":
                var inputField = $(this).find(".moreFiltersInput.characterFilter:nth(0)");
                //inputField.val().split("| ").forEach(function (val, index) {
                //    val = val.trim();
                //    //console.log(val);
                //    if (val != "") {
                //        //searchString += `${inputField.data("field").replace(/ /g, "_").toLowerCase()}:=>${val}:::`;
                //        searchString += `${inputField.data("field")}:=>${val}:::`;
                //    }
                //});
                if (inputField.val() != "") {
                    searchString += `${inputField.data("field")}:=>${inputField.val()}:::`;
                    searchJSON[`${inputField.data("field")}`] = inputField.val();
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
                        //if(dataIsKey){
                        var currentIndex = getPropertyAccess(minValField.data("field"));
                        //}
                        //else{
                        //    var currentIndex = FieldName.indexOf(minValField.data("field")) - (rowTypeExist ? 1 : 0);
                        //}
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
                //var minVal = parseFloat(minValField.val()) || 0;
                //var maxVal = parseFloat(maxValField.val()) || 0;

                if (minValField.val() != "" || maxValField.val() != "") {
                    var columnVals = [];
                    try {
                        //if(dataIsKey){
                        var currentIndex = getPropertyAccess(minValField.data("field"));
                        //}
                        //else{
                        //    var currentIndex = FieldName.indexOf(minValField.data("field")) - (rowTypeExist ? 1 : 0);
                        //}
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
                //else if (minVal != 0 || maxVal != 0) {
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

function pushSearchStringtoFilters(objectVal, inputType = "string") {
    var searchInput = $("#ivInSearchInput");
    var searchStringOBJ = inputType == "string" ? searchInput.val().split(":::").sort() : Object.keys(objectVal);
    //var filteredArray = [];
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
        //filteredArray.push(key);
        //var baseRow = $(`tr[data-field^=${key.split(" ")[0]}]`);
        //var baseRow = $(`tr[data-field^=${key}]`);
        var baseRow = $(`tr[data-field]`).filterByData('field', key);
        baseRow.each(function (index, val) {

            if ($(val).data("field") == key) {

                switch ($(val).data("coltype")) {
                    case "c":
                        //baseRow.find
                        var inputField = $(val).find(".moreFiltersInput.characterFilter:nth(0)");
                        //inputField.tokenfield('setTokens', value.split("| "));
                        inputField.tokenfield('setTokens', value.split("♣|♣"));
                        break;
                    case "n":
                        var minValField = $(this).find("input.moreFiltersInput.numericFilter:nth(0)");
                        var maxValField = $(this).find("input.moreFiltersInput.numericFilter:nth(1)");
                        //value = value.startsWith("<=") ? value.substr(2, value.length) : value;
                        //value = value.endsWith("=>") ? value.substr(0, value.length - 1) : value;
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
                            //value = value.startsWith("<=") ? value.substr(2, value.length) : value;
                            //value = value.endsWith("=>") ? value.substr(0, value.length - 2) : value;
                            var startEndSplit = value.substr(2, value.length - 4).split("=><=")
                            minValField.val(startEndSplit[0]);
                            maxValField.val(startEndSplit[1]);
                            selectField.val("customOption");
                        } else {
                            selectField.val(value);
                        }
                        selectField.trigger("change");
                        break;
                    case "t":
                        break;
                }
            }
        });
    });
}
function resetMoreFilters() {
    $("input.moreFiltersInput, #advSearchName").val("");
    $("input.moreFiltersInput.characterFilter").each(function () { $(this).tokenfield('setTokens', []) });
    $("select.moreFiltersInput option:first-child").prop("selected", true);
    $("select.moreFiltersInput").trigger("change");
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
 * @author ManiKanta
 * @Date   2018-11-19T15:12:36+0530
 * @return {}
 */
function createMainEventsOnGrid() {
    $(".dataTables_scrollHead thead th").off("contextmenu");
    $(".dataTables_scrollHead thead th").on("contextmenu", function (event) {

        if (event.which == 3) {
            event.preventDefault();
            // var idx = ivirDataTableApi.column(this).index();
            // var headtitle = ivirDataTableApi.column(idx).header();
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
        var elem = $(this)
        var idx = ivirDataTableApi.fixedColumns().cellIndex(elem.parents('th')).column;
        createRightClick(e, idx)
        // if (event.which == 3) {
        //     var idx = ivirDataTableApi.column(this).index();
        //     var headtitle = ivirDataTableApi.column(idx).header();
        // }
    });
    $(".dataTables_scrollHead thead th .rightClickMenuIcn").on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var elem = $(this)
        var idx = ivirDataTableApi.column(elem.parents('th')).index();
        createRightClick(e, idx)
        // if (event.which == 3) {
        //     var idx = ivirDataTableApi.column(this).index();
        //     var headtitle = ivirDataTableApi.column(idx).header();
        // }
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
        //alert( 'Table redrawn' );
        if ($("#divModalAdvancedFilters").is(":visible")) {
            $("#btnModalClose").click();

            //closeModalDialog();

            //if ($(".jconfirm-box").length) {
            //    $(".jconfirm-box .jconfirm-buttons .coldbtn").click();
            //    return;
            //}
        }
    });
}

/** will be trigerred when user select particular column to search */
$(document).on('change', '#searchSelectColumn', function (event) {
    // ivirDataTableApi
    //     .search('')
    //     .columns().search('')
    //     .draw();
    var elem = $(this);
    var parentSearchId = ivirTable + "_filter";
    var previousSearchVal = "";
    var originalSrchInp = $(parentSearchId + " .ivirSearchFld");
    var customSrchInp = $(parentSearchId + " #customSearchInput");
    var indexSelected = elem.data('index');
    //if (originalSrchInp.is(':visible'))
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
            var customSearchInput = '<input type="search" value="' + previousSearchVal + '" class="form-control input-sm firstTime" id="customSearchInput" placeholder="Search..." style="display: inline-block;">';
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

//$(document).on('focus', '.ivirSearchFld', function (event) {
//    $(".dropDownButton__list").hide();
//});

//$(document).on('focus', '#customSearchInput', function (event) {
//    $(".dropDownButton__list").hide();
//});



$(document).on('keyup', '#customSearchInput', function (event) {
    // if ($(this).hasClass('firstTime')) {
    //     $(this).removeClass('firstTime')
    //     ivirDataTableApi
    //         .search('')
    //         .columns().search('')
    //         .draw();
    // }
    var searchValue = this.value;

    // Commenting this, since this doesnt handle all the possible cases 
    //if (searchValue.indexOf(",") >= 0) {
    //   searchValue = searchValue.replace(",", "");
    // }

    var indexOfColumnSelected = $("#searchSelectColumn").data('index');
    ivirDataTableApi
        .columns(indexOfColumnSelected)
        .search(searchValue)
        .draw();

});

/**
 * To get the all the numeric columns in the table will be pushed into numericColumns array
 * @author ManiKanta
 * @Date   2018-11-19T15:21:46+0530
 * @return {}                 
 */
function getAllNumericColumns() {
    $(ivirTable + " thead tr:last th").each(function (index, el) {
        headerCaption = $(this).text().trim();
        headerName = $(this).attr("id").replace("GridView1_ctl01_", "");
        if (ivirColumnTypeObj[headerName] == 'n')
            numericColumns.push(index);
        // else if (ivirColumnTypeObj[headerName] == 'd')
        //     dateColumns.push(index);
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
        // createIvirDataTable('clear');
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
        // if (event.which == 3) {
        //     var idx = ivirDataTableApi.column(this).index();
        //     var headtitle = ivirDataTableApi.column(idx).header();
        // }
    });
    $(".DTFC_LeftHeadWrapper thead th").off("contextmenu");
    $(".DTFC_LeftHeadWrapper thead th").on("contextmenu", function (event) {

        if (event.which == 3) {
            event.preventDefault();
            // var idx = ivirDataTableApi.column(this).index();
            // var headtitle = ivirDataTableApi.column(idx).header();
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
 * @author ManiKanta
 * @Date   2018-11-19T15:28:39+0530
 * @param  {Object}                 e          Complete right click event
 * @param  {Number}                 indexOfCol The index of the column to position this menu
 * @return {}                            
 */
function createRightClick(e, indexOfCol) {

    var menu = $("#rightClickMenu" + indexOfCol);
    if (menu.length == 0) {
        var rtClkHtml = '<div class="menu rightClickMenu" id="rightClickMenu' + indexOfCol + '">';
        rtClkHtml += '<ul>';
        if (indexOfCol != (ivirDataTableApi.columns()[0].length) - 1)
            rtClkHtml += '<li class="freeze" onclick="freezeColumn(' + indexOfCol + ')">Freeze Column<i class="fa  ckbox" aria-hidden="true"></i></li>';
        rtClkHtml += '<li class="asc" onclick="colAscDsc(\'asc\',' + indexOfCol + ')">Ascending<i class="fa  ckbox" aria-hidden="true"></i> </li>';
        rtClkHtml += '<li class="desc" onclick="colAscDsc(\'desc\',' + indexOfCol + ')">Descending<i class="fa ckbox" aria-hidden="true"></i></li>';
        var colCaption = $(ivirDataTableApi.columns(indexOfCol).header()).text().trim();
        var headerName = $(ivirDataTableApi.columns(indexOfCol).header()).attr("id").replace("GridView1_ctl01_", "")
        if (ivirColumnTypeObj[headerName] == 'n') {
            var grandTotalExist = $.grep(ivDatas, function (v) {
                return v.axrowtype == 'gtot' || v.axrowtype == 'stot';
            }).length == 0 ? false : true;

            if (!grandTotalExist)
                rtClkHtml += '<li class="columnGrndTotal" onclick="toggleGrandTotal(' + indexOfCol + ')">' + (checkNextDBRowsExist ? 'Running' : 'Grand') + ' Total<i class="fa  ckbox" aria-hidden="true"></i></li>';
        }
        // rtClkHtml += '<li>Print <i class="fa  ckbox" aria-hidden="true"></i></li>';
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
        menu.find('li.freeze').addClass('hide');
    }
    var order = getTheOrderOfCol(indexOfCol);
    if (order != "empty") {
        menu.find('li.asc i,li.desc i').removeClass('icon-arrows-check')
        if (order == "asc")
            menu.find('li.asc i').addClass('icon-arrows-check')
        else
            menu.find('li.desc i').addClass('icon-arrows-check')
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
    var scrTop = $(window).scrollTop();

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
        allOptions.off('mouseover.drpListHover')
        allOptions.on('mouseover.drpListHover', function () {
            $(".highlightOption").removeClass('highlightOption');
            optionToSelect = $(this);
            $(this).addClass("highlightOption");
        })
        //$(allOptions).unbind('hover');
        //$(allOptions).hover(function () {
        //    debugger
        //})


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

        // e.preventDefault(); // prevent the default action (scroll / move caret)

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
    // $(ivirTable+" tbody tr:first td").each(function(index, el) {

    // });
    ivirDataTableApi.row(0).every(function (rowIdx, tableLoop, rowLoop) {
        var data = this.data();
        for (var i = 0; i < data.length; i++) {
            //var headerName = $(ivirDataTableApi.column(i).header()).text().trim();
            var patt = /<a[^>]*>([\s\S]*?)/g;
            var res = patt.test(typeof data[i] == "object" ? data[i].display : data[i]);
            if (res)
                initialChkup.isAnchor = i;
        }
        // ... do something with data(), or this.node(), etc
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
 * @author ManiKanta
 * @Date   2018-11-19T15:47:36+0530
 * @param  {String}                 titleName        The title to show on the top of the popup
 * @param  {String}                 task             The popup to show will be descided based on the task name
 * @param  {String}                 htmlToShow       The complete html to show on the popup
 * @param  {String}                 okFunction       Name of the function to execute when user clicked on Apply
 * @param  {Array}                  showValuesOnOpen will have the values of [type,index] of the colum if user click on edit of the condtion
 * @param  {Boolean}                isEditPill       IS called from edit of the condtion or new (true => edit,false=>new)
 * @return {}                                 
 */
function ivirActionDialog(titleName, task, htmlToShow, okFunction, showValuesOnOpen, isEditPill) {
    var glType = eval(callParent('gllangType'));
    var isRTL = false;
    if (glType == "ar")
        isRTL = true;
    else
        isRTL = false;
    $.confirm({
        title: titleName,
        rtl: isRTL,
        content: htmlToShow,
        draggable: true,
        type: 'blue',
        typeAnimated: true,
        backgroundDismiss: 'false',
        escapeKey: 'buttonB',
        columnClass: 'col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1',
        buttons: {
            buttonA: {
                text: eval(callParent('lcm[281]')),
                btnClass: 'btn okBtn hotbtntiny', // hide is a bootstrap class to hide elements
                action: function () {
                    if (task == "group" || task == 'chart' || task == 'highlight') {
                        var ind = showValuesOnOpen == undefined ? undefined : showValuesOnOpen[1];
                        if (!ivirDuplicateCheck(task, isEditPill, ind))
                            return false;
                    }
                    if (task == "highlight") {
                        if (!validateFields(task))
                            return false;
                    }
                    if (showValuesOnOpen) {
                        var presentAction = showValuesOnOpen[0];
                        var indexOfPill = showValuesOnOpen[1];
                        if (presentAction == 'highlight' || presentAction == 'group' || presentAction == 'chart') {
                            var pillAlreadyChecked = $("input#" + presentAction + "pillCB" + indexOfPill).is(":checked");

                            if (!window[okFunction](indexOfPill, pillAlreadyChecked))
                                return false;
                        }
                    } else {
                        if (task == "group" || task == 'chart' || task == 'column' || task == 'download') {
                            if (!window[okFunction]())
                                return false;
                        } else {
                            window[okFunction]()
                        }
                    }

                    setSmartViewHeight()

                }
            },
            buttonB: {
                text: eval(callParent('lcm[192]')),
                btnClass: 'btn coldbtntiny ',
            },

        },

        onContentReady: function () {
            disableBackDrop('bind');
            if (!isEditPill)
                checkForPillsLength(task);
            highlightTheFirstFld();
            ivirbindEvents(task);
            if (task == 'group') {

                // selectfromcontent is the common class for converting  --search-- in arabic 

                //$(".selectfromcontent").text(callParentNew('lcm')[441]); 

            }
            if (task == 'column') {
                if ($(".ivirLabelWrapper input:checkbox:not(:checked)").length > 0)
                    $("#showAllColumns").prop('checked', false);
                else
                    $("#showAllColumns").prop('checked', true);
            } else if (task == 'sort') {
                $("#ivirSortColumnWrapper .ivirLabelWrapper:first").addClass('labelSelected');
            } else if (task == 'highlight') {

                //$(".selectfromcontent").text(callParentNew('lcm')[441]);
                $(document).find("#ivirtxtColor").spectrum({
                    color: "#000000",
                    clickoutFiresChange: false,
                    beforeShow: function (color) {
                        $("#ivirbgColor").spectrum("set", $("#ivirbgColorValue").val());
                        //return false; // Will never show up
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
                        //return false; // Will never show up
                    },
                    change: function (color) {
                        $("#ivirbgColorValue").val(color.toHexString());
                    }
                });
                highlightBindEvents();
            } else if (task == 'chart') {
                $('#ivirChartName').focus();

                // selectfromcontent is the common class for converting  --search-- in arabic 

                //$(".selectfromcontent").text(callParentNew('lcm')[441]); 

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

                    $("#ivirHltName").val(name)
                    $("#ivirHighlightType").val(highlightType)
                    $("#ivirbgColorValue").val(bgColor)
                    $("#ivirtxtColorValue").val(txtColor)
                    $("#ivirHighlightCol option[data-index=" + column + "]").prop('selected', true).change();
                    $("#ivirHighlightCndtn").val(condition)
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
                } else if (showValuesOnOpen[0] == 'group') {
                    var name = ivirMainTypeObj.n;
                    var column = ivirMainTypeObj.cl;
                    var totalArray = ivirMainTypeObj.t;
                    var grndTotalArray = ivirMainTypeObj.g;
                    var totalCndtns = 1;
                    $("#grpName").val(name)
                    $("#grpColName option[data-index=" + column + "]").prop('selected', true).change();
                    if (totalArray) {
                        for (var i = 1; i < totalArray.length; i = i + 2) {
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
                    $("#ivirChartName").val(name)
                    $("#ivirChartCol option[data-index=" + column + "]").prop('selected', true).change();
                    $("#ivirChartVal option[data-index=" + value + "]").prop('selected', true).change();
                    $("#ivirChartsRow .ivirChartButton").removeClass('active');
                    $("#ivirChartsRow").find("[data-type='" + chartType + "']").addClass('active');
                }
            }
        },
        onClose: function () {
            // before the modal is hidden.
            $("#IvirActions").val("");
            ivirRemovebindEvents(task);
            highlightUnBindEvents();
            if (task == 'group') {
                tmpGroupObj = {};
            } else if (task == 'column') {
                pillDependentCols = {};
            }
        },
    });

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
        if (pillsArr && pillsArr.length >= maxNoOfPills) {
            var msg = errorMessages.maxPills.replace(/_type_/g, type);
            showAlertDialog("warning", msg);
            $("#IvirActions").val("");
            //$("#ivirActionButton").text(callParentNew('lcm')[406]);
            return true;
            $(".okBtn").addClass('disabled').prop('disabled', true);
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
    })
    $(".jconfirm-buttons button").each(function () {
        var txt = $(this).text();
        $(this).prop('title', txt.charAt(0).toUpperCase() + txt.slice(1))
    });

    $("#ivirHighlightWrapper .colorPicker").on('blur.accessColor', function () {
        $(this).val($($(this).next()).spectrum("get").toHexString());
    })
    $('.dialogInptFld').on("keydown.dlgKD", function () {
        var elem = $(this);
        if (elem.next().hasClass('customError')) {
            elem.next('span.customError').remove();
            // $("span.customError").remove('.customError');
        }
    })
    $('.dialogSlctFld').on("change.dlgKD", function () {
        var elem = $(this);
        if (elem.next().hasClass('customError')) {
            elem.next('span.customError').remove();
        }
    })
    $('[data-toggle=popover]').popover({
        trigger: 'manual',
    });
    // $('[data-toggle=popover]').off('click');
    $('[data-toggle=popover]').on('mouseenter', function (e) {
        $(this).popover('show');
    });
    $('[data-toggle=popover]').on('mouseleave', function (e) {
        $('[data-toggle=popover]').popover("destroy");
    });

    //$(document).on('click', function(e) {
    //$(".icon-arrows-question[aria-describedby^='p']").click();
    // });



    if (action == 'column') {
        $(document).on('change', '#showAllColumns', function (event) {
            if ($(this).is(':checked')) {
                $("#ivirshowHideColumnWrapper div.checkbox input:not('.disabled')").prop('checked', true);
            } else {
                $("#ivirshowHideColumnWrapper .customCheckBox:not('.disabled')").prop('checked', false);
                if ($("#ivirshowHideColumnWrapper .customCheckBox:checked").length === 0)
                    $("#ivirshowHideColumnWrapper .customCheckBox:not('.disabled'):first").prop('checked', true);
            }
        });
        $(document).on('change', '#ivirshowHideColumnWrapper .customCheckBox', function (event) {
            if (!$(this).is(':checked')) {
                $("#showAllColumns").prop('checked', false);
            } else {
                if ($(".ivirLabelWrapper input:checkbox:not(:checked)").length > 0)
                    $("#showAllColumns").prop('checked', false);
                else
                    $("#showAllColumns").prop('checked', true);
            }
        });

        // $(document).on('click', '.ivirSortLabel', function(event) {
        //     var parentEl = $(this).parent('.ivirLabelWrapper');
        //     $("#ivirshowHideColumnWrapper .labelSelected").removeClass('labelSelected').css('border', '1px solid white');
        //     if (parentEl.hasClass('labelSelected'))
        //         parentEl.removeClass('labelSelected').css('border', '1px solid white');
        //     else
        //         parentEl.addClass('labelSelected').css('border', '1px solid red');
        // });
        // assignKeyDownDrag("ivirshowHideColumnWrapper");
    } else if (action == "sort") {
        $(document).on('click', '#ivirSortColumnWrapper .ascDscWrapper button', function (event) {
            var clickedBtn = $(this);
            var parentSpan = $($(this).parent());
            parentSpan.find('button i').removeClass('active');
            clickedBtn.find('i').addClass('active');
            parentSpan.parent().find('input[type="checkbox"]').prop('checked', true)
        });
        $(document).on('click', '#clearSorting', function (event) {
            $("#ivirSortColumnWrapper .labelSelected").removeClass('labelSelected');
            $("#ivirSortColumnWrapper input[type='checkbox']").prop('checked', false);
            $("#ivirSortColumnWrapper .ascDscWrapper button i").removeClass('active');
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
                $(this).parent().find('span.ascDscWrapper').find('button i:first').addClass('active');
            } else {
                $(this).parent().find('span.ascDscWrapper').find('button i').removeClass('active');
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
            htmlToShow = '<div id="ivirTotalCndtn1" class="ivirTotalCndtn row">';
            htmlToShow += '<div class="col-md-4">';
            htmlToShow += '<div class="form-group">';
            htmlToShow += '<label for="totalAggrFunction">Function</label>';
            //htmlToShow += '<a href="javascript:void(0)" class="icon-arrows-question" tabindex="-1" data-toggle="popover" title="" data-placement="top" data-content="Some content inside the popover"></a>';
            htmlToShow += '<select class="form-control totalAggrFunction">';
            htmlToShow += '<option  value="">' + callParentNew('lcm')[441] + '</option>';
            htmlToShow += '<option value="sum">Sum</option>';
            htmlToShow += '<option value="count">Count</option>';
            htmlToShow += '<option value="max">Max</option>';
            htmlToShow += '<option value="min">Min</option>';
            htmlToShow += '<option value="avg">Average</option>';
            htmlToShow += '</select>';
            htmlToShow += '</div>';
            htmlToShow += '</div>';
            htmlToShow += '<div class="col-md-4">';
            htmlToShow += '<div class="form-group">';
            htmlToShow += '<label for="totalSource">Source</label> ';
            htmlToShow += ' <a href="javascript:void(0)" class="icon-arrows-question" tabindex="-1" data-toggle="popover" title="" data-placement="top" data-content="Please select the column, which will be used by the function for computation."></a>';
            htmlToShow += '<select class="form-control totalSource" id="">';
            htmlToShow += '<option value="" >' + callParentNew('lcm')[441] + '</option>';
            // htmlToShow += '<option data-index="1" value="Sr. No." data-type="n">Sr. No.</option>';
            // htmlToShow += '<option data-index="2" value="Short Name" data-type="c">Short Name</option>';
            // htmlToShow += '<option data-index="3" value="State Name" data-type="c">State Name</option>';
            // htmlToShow += '<option data-index="4" value="Country" data-type="c">Country</option>';
            // htmlToShow += '<option data-index="5" value="Active" data-type="c">Active</option>';
            htmlToShow += '</select>';
            htmlToShow += '</div>';
            htmlToShow += '</div>';
            htmlToShow += '<div class="col-md-4 firstRow grpaddDltBtnWrapper">';
            htmlToShow += '<p class="labelP">Grand Total:</p>'
            htmlToShow += '<div class="checkbox grndTotalWrapper">';
            htmlToShow += '<label class="grndTtlCB"><input disabled type="checkbox" value=""></label>';
            htmlToShow += '</div>';
            // htmlToShow += '<label for="">Grand Total</label>';
            // htmlToShow += ' <span class="toggleBtnSpn">';
            // htmlToShow += '<input class="tgl tgl-ios" id="cb2" type="checkbox"/>';
            // htmlToShow += '<label class="tgl-btn" for="cb2"></label>';
            // htmlToShow += '</span>';
            htmlToShow += '<button type="button" title="Add" onclick="ivirAddTotalCndtn(2);" class="noBg ivirTotalCndtnBtn"><span class="icon-arrows-circle-plus ivirTotalCndtnIcon" ></span></button>';
            htmlToShow += '</div>';
            htmlToShow += '</div>';
            $("#ivirTotalCndtnWrapper").data('cndtns', [1]).attr('data-cndtns', '[1]').html(htmlToShow);
            $('#ivirTotalCndtn1 [data-toggle=popover]').popover({
                trigger: 'manual',
            });
            $('#ivirTotalCndtn1 [data-toggle=popover]').on('mouseenter', function (e) {
                $(this).popover('show');
            });
            $('#ivirTotalCndtn1 [data-toggle=popover]').on('mouseleave', function (e) {
                $('#ivirTotalCndtn1 [data-toggle=popover]').popover("destroy");
            });
            if (elem.val() === "") {
                $("#ivirTotalCndtnWrapper").hide();

            } else {
                $("#ivirTotalCndtnWrapper").show();
                tmpGroupObj.groupIndex = $(this).find('option:selected').data('index');
            }

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
        $(document).off('change', '#showAllColumns');
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

        // ivirMoveUpDown('up', parentId);
        else if (e.keyCode == 40) {
            if (selectedElem.index() != selectedElem.parent().find('.ivirLabelWrapper').last().index()) {
                selectedElem.next().addClass('labelSelected');
                selectedElem.removeClass('labelSelected');
            }
        }

        // ivirMoveUpDown('down', parentId);
        else if (e.keyCode == 32) {
            e.preventDefault();
            $("#ivirSortColumnWrapper .ivirLabelWrapper.labelSelected .ascDscWrapper button i:not('.active')").first().click();
            //ivirMoveUpDown('down', parentId);
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
 * @author ManiKanta
 * @Date   2018-11-19T17:18:08+0530
 * @return {}                 
 */
function ivirshowHideColumns() {

    var columnPosArray = [0];
    var liHtml = "";
    if ($("#ivirshowHideColumnWrapper div.checkbox input:checked").length == 0) {
        showAlertDialog("warning", errorMessages.columnSelection);
        // alert();
        return false;
    }
    ivirVisibleColumns = [];
    $(ivirTable).css("width", "auto");
    $("#ivirshowHideColumnWrapper div.checkbox").each(function (index, el) {
        var checkBox = $(this).find('input');
        columnPosArray.push(checkBox.data('index'));
        if (checkBox.is(':checked')) {
            ivirVisibleColumns.push(checkBox.data('index'));
            ivirDataTableApi.column(checkBox.data('index')).visible(true);
        } else
            ivirDataTableApi.column(checkBox.data('index')).visible(false);
    });




    if ($(ivirTable).outerWidth() < $(window).width()) {
        $(ivirTable).css("width", "100%");
        ivirDatatable.fnAdjustColumnSizing();
    }

    var allColumns = ivirDataTableApi.columns();
    liHtml += '<li class="dropDownButton__item" data-dropdown-value="all">All</li><li class="dropDownButton__item" data-dropdown-value="filter">Custom Filter</li>';
    for (var i = 0; i < allColumns[0].length; i++) {
        if ($.inArray(i, ivirVisibleColumns) === -1 || (isChkBox == "true" && i == 0))
            continue;
        var headerName = $(ivirDataTableApi.columns(i).header()).text().trim();
        liHtml += '<li class="dropDownButton__item"  data-index=' + i + ' data-dropdown-value="' + headerName + '">' + headerName + '</li>';

    }
    $("#filterColumnSelect ul.dropDownButton__list").html(liHtml);
    if ($.inArray($("#searchSelectColumn").data('index'), ivirVisibleColumns) === -1) {
        $("#filterColumnSelect ul.dropDownButton__list li:first").click();
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
            //var dependentCols[i]
            if ($.inArray(pillData[i], ivirVisibleColumns) === -1) {
                showAlertDialog("warning", errorMessages.dependentColumns);
                return false;
            }
        }
        $("#" + pillType + "pillCB" + pillindex).prop('checked', true).attr('checked', 'checked');
        if (pillType == "group")
            applyThePill("group", pillindex);
        else if (pillType == "chart")
            ivirCreateChart(pillindex, true, true)
        pillDependentCols = {};
    }
    if (fixedColumnsObj != "")
        $(".DTFC_LeftBodyWrapper .ivirCustomHighlight,.DTFC_LeftBodyWrapper .ivirCustomHighlightCell").removeClass("ivirCustomHighlight").css({
            "background-color": "",
            "color": ""
        });
    return true;
    // ivirDataTableApi.colReorder.order( columnPosArray ,true);

}

/**
 * Will be called when user applied sorting
 * @author ManiKanta
 * @Date   2018-11-19T17:18:47+0530
 * @return {}                 
 */
function ivirSortColumns() {
    var sortingArray = [];
    var sortingStrng = "";
    $("#ivirSortColumnWrapper .checkbox input[type='checkbox']").each(function (index, el) {
        if ($(this).is(':checked')) {
            var index = $(this).data('index');
            var order = $(this).parent().find('button i.active').data('order');
            var tmpArray = [];
            tmpArray.push(index)
            tmpArray.push(order)
            sortingArray.push(tmpArray)
            // sortingArray.push(index)
            // sortingArray.push(order)
        }

    });

    if (groupingCol != "")
        sortingArray.push([parseInt(groupingCol), "asc"]);

    ivirDatatable.fnSort(sortingArray);
    // eval("ivirDatatable.fnSort("+sortingStrng+")");
}

/**
 * The main function for row grouping will be called when user applied for grouping
 * @author ManiKanta
 * @Date   2018-11-19T17:19:03+0530
 * @param  {Number}                 indexOfArray         index of the column on which grouping should apply
 * @param  {Boolean}                isPillAlreadyChecked To know weather user is applyig or removing the conditon
 * @return {}                                      
 */
function ivirRowGrouping(indexOfArray, isPillAlreadyChecked) {
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
        if (isLastSelectEmpty)
            return false;
        if ($("#ivirTotalCndtn1 .totalAggrFunction").val() == "") {
            ivirCustomErrMsg($("#ivirTotalCndtn1 .totalAggrFunction"), errorMessages.emptyField)
            return false;
            //$('<span class="customError text-danger">Please fill out this field.</span>').insertAfter($("#ivirTotalCndtn"+lastAddedIndex+" .totalAggrFunction"));
        } else {
            $("#ivirTotalCndtn1 .totalAggrFunction").next('span.customError').remove();
        }
        if ($("#ivirTotalCndtn1 .totalSource").val() == "") {
            ivirCustomErrMsg($("#ivirTotalCndtn1 .totalSource"), errorMessages.emptyField)
            return false;
            //$('<span class="customError text-danger">Please fill out this field.</span>').insertAfter($("#ivirTotalCndtn"+lastAddedIndex+" .totalAggrFunction"));
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

                //allGrandTotal.push(indexOfCol);
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

    if ((indexOfArray === undefined) || isPillAlreadyChecked)
        createIvirDataTable("group", colIndex, groupTotalArray, allGrandTotal);


    //apply the pill is is directly handled in chekcbox click ivirCheckBox 
    //if (applyThePill === undefined) {
    var name = grpName.val();
    var columnIndex = colIndex;
    var grpTotal = groupTotalArray;
    var grndTotal = grandTotal;
    //} else {
    //    var ivirMainGrpObj = ivirMainObj.group[indexOfArray];
    //    var name = ivirMainGrpObj.n;
    //    var columnIndex = ivirMainGrpObj.cl;
    //    var grpTotal = ivirMainGrpObj.t;
    //    var grndTotal = ivirMainGrpObj.g;

    //}


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
    } else {
        var cutMsg = eval(callParent('lcm[23]'));
        showAlertDialog("warning", cutMsg);
    }


    //for total
    // if ($("#ivirTotalCndtn1 .totalAggrFunction").val() != "")
    //     ivirGroupingTotal();
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
    htmlToShow += '<div class="col-md-3 text-center"><button data-type="pie" title="' + callParentNew('lcm')[419] + '" onclick="ivirShowChart(\'graph \',\'pie\',this)" type="button" class="ivirChartButton noBg active"><span  class="ivirGraphIcon icon-ecommerce-graph1"></button></span><label style="display:block">' + callParentNew('lcm')[419] + '</label></div>';
    htmlToShow += '<div class="col-md-3 text-center"><button data-type="column" title="' + callParentNew('lcm')[420] + '" onclick="ivirShowChart(\'graph \',\'column\',this)" type="button" class="ivirChartButton noBg"><span class="ivirGraphIcon icon-ecommerce-graph2"></button></span><label style="display:block">' + callParentNew('lcm')[420] + '</label></div>';
    htmlToShow += '<div class="col-md-3 text-center"><button data-type="donut" title="' + callParentNew('lcm')[421] + '" onclick="ivirShowChart(\'graph \',\'donut\',this)" type="button" class="ivirChartButton noBg"><span class="ivirGraphIcon icon-music-record"></button></span><label style="display:block">' + callParentNew('lcm')[421] + '</label></div>';
    htmlToShow += '<div class="col-md-3 text-center"><button data-type="bar" title="' + callParentNew('lcm')[422] + '" onclick="ivirShowChart(\'graph \',\'bar\',this)" type="button" class="ivirChartButton noBg"><span class="ivirGraphIcon icon-software-horizontal-align-left"></button></span><label style="display:block">' + callParentNew('lcm')[422] + '</label></div>';
    htmlToShow += '</div>';
    htmlToShow += '<hr>';
    htmlToShow += '<div id="ivirchartsCndtn" class="row">';
    htmlToShow += ' <div id="ivirgraph" class="chartCndtnWrapper">';
    htmlToShow += '<div class="col-md-12">'
    htmlToShow += '<div class="form-group">';
    htmlToShow += '<label for="ivirChartName">' + callParentNew('lcm')[413] + '</label>';
    htmlToShow += '<span class="red">*</span>';
    htmlToShow += '<a href="javascript:void(0)" class="icon-arrows-question" tabindex="-1" data-toggle="popover" data-placement="right" title="" data-content="' + callParentNew('lcm')[431] + '"></a>';
    htmlToShow += '<input required type="text" maxlength="20" class="form-control dialogInptFld fldNme" id="ivirChartName">';
    htmlToShow += '</div>';
    htmlToShow += '</div>'
    htmlToShow += '     <div class="col-md-6">';
    htmlToShow += '      <div class="form-group">';
    htmlToShow += '       <label for="ivirChartCol">' + callParentNew('lcm')[420] + '</label>';
    htmlToShow += '<span class="red">*</span>';
    htmlToShow += '<a href="javascript:void(0)" class="icon-arrows-question" tabindex="-1" data-toggle="popover" title="" data-placement="right" data-content="' + callParentNew('lcm')[432] + '"></a>';
    var numericFldsHtml = "";
    var charFldsHml = "";
    var allColumnsArray = getAllColumns("", isFromEdit);
    numericFldsHtml = allColumnsArray[0]
    charFldsHml = allColumnsArray[1];
    // ivirColumnTypeObj
    // var allColumns = ivirDataTableApi.columns();
    // for (var i = 0; i < allColumns[0].length; i++) {
    //     if (isChkBox == "true" && i == 0)
    //         continue;
    //     var colName = $(ivirDataTableApi.columns(allColumns[0][i]).header()).text();
    //     var colType = ivirColumnTypeObj[colName];
    //     if ($.inArray(i, ivirVisibleColumns) !== -1 && colType == 'c')
    //         charFldsHml += ' <option data-index=' + i + ' value="' + colName + '" data-type="' + colType + '">' + colName + '</option>';
    //     else if ($.inArray(i, ivirVisibleColumns) !== -1 && colType == 'n')
    //         numericFldsHtml += ' <option data-index=' + i + ' value="' + colName + '" data-type="' + colType + '">' + colName + '</option>';

    // }
    htmlToShow += '  <select class="form-control dialogSlctFld" id="ivirChartCol">';
    htmlToShow += '<option value="" data-index="">' + callParentNew('lcm')[441] + '</option>';
    htmlToShow += charFldsHml;
    htmlToShow += '</select>';
    htmlToShow += '</div>';
    htmlToShow += '</div>';

    htmlToShow += '<div class="col-md-6">';
    htmlToShow += '<div class="form-group">';
    htmlToShow += '   <label for="ivirChartVal">' + callParentNew('lcm')[414] + '</label>';
    htmlToShow += '<span class="red">*</span>';
    htmlToShow += '<a href="javascript:void(0)" class="icon-arrows-question" tabindex="-1" data-toggle="popover" data-placement="top" title="" data-content="' + callParentNew('lcm')[433] + '"></a>';
    htmlToShow += '  <select class="form-control dialogSlctFld" id="ivirChartVal">';
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
    htmlToShow = ' <div class="form-group" style="margin-top: 15px;">';
    htmlToShow += '<label for="grpName">' + callParentNew('lcm')[413] + '</label>';
    htmlToShow += '<span class="red">*</span>';
    htmlToShow += ' <a href="javascript:void(0)" class="icon-arrows-question" tabindex="-1" data-toggle="popover" title="" data-placement="right" data-content="' + callParentNew('lcm')[430] + '"></a>';
    htmlToShow += '<input required type="text" class="form-control fldNme dialogInptFld" maxlength="20" id="grpName">';
    htmlToShow += '</div>';
    htmlToShow += '<div class="form-group">';
    htmlToShow += '<label for="grpColName">' + callParentNew('lcm')[420] + '</label>';
    htmlToShow += '<span class="red">*</span>';
    htmlToShow += '<a href="javascript:void(0)"  class="icon-arrows-question" tabindex="-1" data-toggle="popover" title="" data-placement="right" data-content="' + callParentNew('lcm')[429] + '" ></a>';
    htmlToShow += '<select class="form-control dialogSlctFld" id="grpColName">';
    htmlToShow += '<option value="">' + callParentNew('lcm')[441] + '</option>';
    // if(groupingCol != ""){
    //     var exceptionArray = [groupingCol];
    //     var allColumnsArray = getAllColumns(exceptionArray);
    // }else{
    //     var allColumnsArray = getAllColumns();
    // }

    var allColumnsArray = getAllColumns("", isFromEdit, "group");
    htmlToShow += allColumnsArray[2];
    // htmlToShow += '<option>1</option>';
    htmlToShow += ' </select>';
    htmlToShow += '</div>';
    htmlToShow += '<div id="ivirTotalCndtnWrapper" data-cndtns="[1]" style="display:none;">';
    htmlToShow += '<div id="ivirTotalCndtn1" class="ivirTotalCndtn row">';
    htmlToShow += '<div class="col-md-4">';
    htmlToShow += '<div class="form-group">';
    htmlToShow += '<label for="grpColName">Function</label>';
    htmlToShow += '<span class="red">*</span>';
    htmlToShow += '<a href="javascript:void(0)" class="icon-arrows-question" tabindex="-1" data-toggle="popover" data-placement="right" title="" data-content="' + callParentNew('lcm')[431] + '"></a>';

    htmlToShow += '<select class="form-control totalAggrFunction">';
    htmlToShow += '<option value="">' + callParentNew('lcm')[441] + '</option>';
    htmlToShow += '<option value="sum">Sum</option>';
    htmlToShow += '<option value="count">Count</option>';
    htmlToShow += '<option value="max">Max</option>';
    htmlToShow += '<option value="min">Min</option>';
    htmlToShow += '<option value="avg">Average</option>';
    htmlToShow += '</select>';
    htmlToShow += '</div>';
    htmlToShow += '</div>';
    htmlToShow += '<div class="col-md-4">';
    htmlToShow += '<div class="form-group">';
    htmlToShow += '<label for="grpColName">Source:</label>';
    htmlToShow += '<a href="javascript:void(0)" class="icon-arrows-question" tabindex="-1" data-toggle="popover" data-placement="right" title="" data-content="Please enter name for the Chart Type. Example: Sales Distribution."></a>';
    htmlToShow += '<select class="form-control totalSource">';
    htmlToShow += '<option value="">' + callParentNew('lcm')[441] + '</option>';
    // htmlToShow += '<option data-index="1" value="Sr. No." data-type="n">Sr. No.</option>';
    // htmlToShow += '<option data-index="2" value="Short Name" data-type="c">Short Name</option>';
    // htmlToShow += '<option data-index="3" value="State Name" data-type="c">State Name</option>';
    // htmlToShow += '<option data-index="4" value="Country" data-type="c">Country</option>';
    // htmlToShow += '<option data-index="5" value="Active" data-type="c">Active</option>';
    htmlToShow += '</select>';
    htmlToShow += '</div>';
    htmlToShow += '</div>';
    htmlToShow += '<div class="col-md-4 firstRow grpaddDltBtnWrapper">';
    htmlToShow += '<label for="">Grand Total</label>';
    htmlToShow += ' <span class="toggleBtnSpn">';
    htmlToShow += '<input class="tgl tgl-ios" id="cb2" type="checkbox"/>';
    htmlToShow += '<label class="tgl-btn" for="cb2"></label>';
    htmlToShow += '</span>';
    htmlToShow += '<button title="Add" type="button" onclick="ivirAddTotalCndtn(2);" class="noBg ivirTotalCndtnBtn"><span class="icon-arrows-circle-plus ivirTotalCndtnIcon"></span></button>';
    htmlToShow += '</div>';
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
        // $('.totalAggrFunction option[value="SEL1"]')
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
        var allColumns = getAllColumns(exceptionArray);
        if (elemVal == "sum" || elemVal == "max" || elemVal == "min" || elemVal == "avg") {
            //means only numeric are allowed
            elem.parents('.ivirTotalCndtn').find('.totalSource').html("<option value=''>" + callParentNew('lcm')[441] + "</option>" + allColumns[0]);
        } else {
            elem.parents('.ivirTotalCndtn').find('.totalSource').html("<option value=''>" + callParentNew('lcm')[441] + "</option>" + allColumns[0] + allColumns[1]);
        }
    } else {

        elem.parents('.ivirTotalCndtn').find('.totalSource').html("<option value=''>" + callParentNew('lcm')[441] + "</option>");

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
        //$('<span class="customError text-danger">Please fill out this field.</span>').insertAfter($("#ivirTotalCndtn"+lastAddedIndex+" .totalAggrFunction"));
    } else {
        $("#ivirTotalCndtn" + lastAddedIndex + " .totalAggrFunction").next('span.customError').remove();
    }
    if ($("#ivirTotalCndtn" + lastAddedIndex + " .totalSource").val() == "") {
        ivirCustomErrMsg($("#ivirTotalCndtn" + lastAddedIndex + " .totalSource"), errorMessages.emptyField)
        return false;
        //$('<span class="customError text-danger">Please fill out this field.</span>').insertAfter($("#ivirTotalCndtn"+lastAddedIndex+" .totalAggrFunction"));
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



    var htmlToAdd = '<div id="ivirTotalCndtn' + indexToAdd + '" class="ivirTotalCndtn row">' + $("#ivirTotalCndtn1").html() + '</div>';
    var deleteHtml = '<button type="button" title="Delete" onclick="ivirDeleteTotalCndtn(' + indexToAdd + ')" class="noBg"><span style="margin-left: 5px;" class="ivirDeleteCndtnIcon icon-arrows-circle-minus"></span></button>';
    $("#ivirTotalCndtnWrapper").append(htmlToAdd);
    $('#ivirTotalCndtn' + indexToAdd + ' .ivirTotalCndtnBtn').show().attr('onclick', 'ivirAddTotalCndtn(' + (indexToAdd + 1) + ')');
    $('#ivirTotalCndtn' + indexToAdd + ' .grpaddDltBtnWrapper').append(deleteHtml);

    $('#ivirTotalCndtn' + indexToAdd + ' label:not(".grndTtlCB"),#ivirTotalCndtn' + indexToAdd + ' p.labelP,#ivirTotalCndtn' + indexToAdd + ' a.icon-arrows-question').hide();
    $('#ivirTotalCndtn' + indexToAdd + ' .grndTtlCB input').prop('disabled', true);
    //$('#ivirTotalCndtn' + indexToAdd + ' .firstRow').removeClass('firstRow');
    $('#ivirTotalCndtn' + indexToAdd + ' select').prop('disabled', false);
    $('#ivirTotalCndtn' + indexToAdd + ' .totalSource').html("<option value=''>" + callParentNew('lcm')[441] + "</option>");
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
    //     var arr = ["orange","red","black","white"];

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
    // addedRowsArray.last = 3
    /*   var last=$('#ivirTotalCndtn' + parseInt(indexToDelete+1) + ' .totalAggrFunction');
     */
    var lastIndex = addedRowsArray[addedRowsArray.length - 1];

    if (lastIndex > indexToDelete) {
        var lstGrpFunction = $('#ivirTotalCndtn' + lastIndex + ' .totalAggrFunction');
        var lstGrpFunctionVal = lstGrpFunction.val();
        var lstGrpSource = $('#ivirTotalCndtn' + lastIndex + ' .totalSource');
        var lstGrpSourceVal = lstGrpSource.val();

        lstGrpFunction.change();
        lstGrpSource[0].value = lstGrpSourceVal;


        /*var adsfkjsdf = $('#ivirTotalCndtn' + last + ' .totalAggrFunction')
        adsfkjsdf.change()*/
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
    // if (!elem.next().hasClass('customError')) {

    $('<span class="customError text-danger">' + msg + '</span>').insertAfter(elem);
    // } else {
    //     elem.next('span.customError').text(msg);
    // }
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
    htmlToShow += '<div class="form-group col-md-6">';
    htmlToShow += '<label for="ivirHltName">' + callParentNew('lcm')[413] + '</label>';
    htmlToShow += '<span class="red">*</span>';
    htmlToShow += '<a href="javascript:void(0)" class="icon-arrows-question" tabindex="-1" data-toggle="popover" title="" data-placement="right" data-content="' + callParentNew('lcm')[435] + '"></a>';
    htmlToShow += '<input required type="text" maxlength="20" value="" class="form-control fldNme dialogInptFld" id="ivirHltName">';
    htmlToShow += '</div>';
    htmlToShow += '<div class="form-group col-md-6">';
    htmlToShow += '<label for="ivirHighlightType">' + callParentNew('lcm')[396] + '</label>';
    htmlToShow += '<span class="red">*</span>';
    htmlToShow += '<a href="javascript:void(0)" class="icon-arrows-question" tabindex="-1" data-toggle="popover" title="" data-placement="right" data-content="' + callParentNew('lcm')[434] + '"></a>';
    htmlToShow += '<select class="form-control dialogSlctFld" id="ivirHighlightType">';
    htmlToShow += '<option value="">' + callParentNew('lcm')[441] + '</option>';
    htmlToShow += '<option value="row">Row</option>';
    htmlToShow += '<option value="column">Column</option>';
    htmlToShow += '<option value="cell">Cell</option>';
    htmlToShow += ' </select>';
    htmlToShow += ' </div>';
    htmlToShow += ' </div>';
    htmlToShow += '<div class="row">';
    htmlToShow += '<div class="form-group col-md-6">';
    htmlToShow += '<label for="ivirbgColor">' + callParentNew('lcm')[425] + '</label>';
    htmlToShow += '<span class="red">*</span>';
    htmlToShow += '<a href="javascript:void(0)"  class="icon-arrows-question" tabindex="-1" data-toggle="popover" title="" data-placement="top" data-content="' + callParentNew('lcm')[436] + '" ></a>';
    htmlToShow += '<div class="input-group" style="width:100%;">';
    htmlToShow += '<input required value="#000000" class="col-md-8 col-sm-8 col-xs-8 form-control colorPicker" id="ivirbgColorValue">';
    htmlToShow += '<input required type="text" class="col-md-3 col-sm-3 col-xs-3 hide" id="ivirbgColor"></span>';
    htmlToShow += '</div>';
    htmlToShow += '</div>';
    htmlToShow += '<div class="form-group col-md-6">';
    htmlToShow += '<label for="ivirtxtColor">' + callParentNew('lcm')[426] + '</label>';
    htmlToShow += '<span class="red">*</span>';
    htmlToShow += '<a href="javascript:void(0)"  class="icon-arrows-question" tabindex="-1" data-toggle="popover" title="" data-placement="top" data-content="' + callParentNew('lcm')[437] + '"></a>';
    htmlToShow += '<div class="input-group" style="width:100%;">';
    htmlToShow += '<input required value="#000000" class="col-md-8 col-sm-8 col-xs-8 form-control colorPicker" id="ivirtxtColorValue">';
    htmlToShow += '<input required type="text" class="col-md-3 col-sm-3 col-xs-3 hide" id="ivirtxtColor"></span>';
    htmlToShow += '</div>';
    htmlToShow += '</div>';
    htmlToShow += '</div>';
    htmlToShow += '<legend align="">' + callParentNew('lcm')[424] + '</legend>';
    htmlToShow += '<div class="form-group col-md-4">';
    htmlToShow += '<label for="ivirHighlightCol">' + callParentNew('lcm')[420] + '</label>';
    htmlToShow += '<span class="red">*</span>';
    htmlToShow += '<a href="javascript:void(0)" class="icon-arrows-question" tabindex="-1" data-toggle="popover" title="" data-placement="top" data-content="' + callParentNew('lcm')[438] + '"></a>';
    htmlToShow += ' <select class="form-control dialogSlctFld" id="ivirHighlightCol">';
    htmlToShow += '  <option value="">' + callParentNew('lcm')[441] + '</option>';
    var allColumnsArray = getAllColumns("", isFromEdit);
    htmlToShow += allColumnsArray[2];
    htmlToShow += '</select>';
    htmlToShow += '</div>';
    htmlToShow += '<div class="form-group col-md-4">';
    htmlToShow += '<label for="ivirHighlightCndtn">' + callParentNew('lcm')[424] + '</label>';
    htmlToShow += '<span class="red">*</span>';
    htmlToShow += '<a href="javascript:void(0)" class="icon-arrows-question" tabindex="-1" data-toggle="popover" title="" data-placement="top" data-content="' + callParentNew('lcm')[439] + '"></a>';
    htmlToShow += '<select class="form-control dialogSlctFld" id="ivirHighlightCndtn">';
    htmlToShow += '<option value="">' + callParentNew('lcm')[441] + '</option>';
    htmlToShow += '</select>';
    htmlToShow += '</div>';
    htmlToShow += '<div class="form-group col-md-4">';
    htmlToShow += '<label for="ivirHltValue">' + callParentNew('lcm')[414] + '</label>';
    htmlToShow += '<span class="red">*</span>';
    htmlToShow += '<a href="javascript:void(0)" class="icon-arrows-question" tabindex="-1" data-toggle="popover" title="" data-placement="top" data-content="' + callParentNew('lcm')[440] + '"></a>';
    htmlToShow += '<input required type="" maxlength="255" class="form-control dialogInptFld" id="ivirHltValue">';
    htmlToShow += '</div>';
    htmlToShow += '</div>';
    htmlToShow += '</div>';
    return htmlToShow;
}

/**
 *  Generic function to get the all column in <option> tag in seperated array havind [numericOptions, characterOptions, allOptions]
 * @author ManiKanta
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
        //var headerName = $(this.header()).attr("id").replace("GridView1_ctl01_", "");
        var colFieldValue = ivirDataTableApi.context[0].aoColumns[i].mData;
        var colType = ivirColumnTypeObj[colFieldValue];
        if ((dontCheckForHiddenFields && $.inArray(i, exceptionArray) === -1) || (!dontCheckForHiddenFields && $.inArray(i, exceptionArray) === -1 && (ivirVisibleColumns.length === 0 || (calledFrom === "group" && groupingCol === i) || $.inArray(i, ivirVisibleColumns) !== -1))) {
            //if ($.inArray(i, exceptionArray) === -1 && (ivirVisibleColumns.length === 0 || $.inArray(i, ivirVisibleColumns) !== -1)) {
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
 * @author ManiKanta
 * @Date   2018-11-20T10:24:30+0530
 * @param  {Number}                 indexOfArray  The index of the already applied highlight
 * @param  {Boolean}                isPillChecked Applying or removing
 * @param  {Boolean}                applyThePill  To apply the condtion or to simply add
 * @return {}                               
 */
function ivirHighlightRow(indexOfArray, isPillChecked, applyThePill) {
    //must handle first time click,creating pills,edit pills,showing particular pill
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
        // var colvalue = ivirMainHltObj.cv;
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
        clearIvirHighlight(indexOfArray);
        var hilghtObj = ivirMainObj.highlight[indexOfArray];
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
            if (isFirstTime || $("#ivirFilteredAccordion").length == 0) {
                if ($("#ivirFilteredAccordion").length == 0)
                    createPills("all", "first");
                else
                    createPills("all", "last");
            } else if ($("#ivirFilteredAccordion").length > 0) {
                upateThePills("highlight", indexOfHighlightArray, name);
            }
        } else {
            //highlight0pillCB
            if (isPillChecked)
                $("#highlightpillCB" + indexOfArray).prop('checked', true).attr('checked', 'checked');;
            $("#highlightpillCB" + indexOfArray).parent().next().find('.ivirCndtnName').attr('title', "Edit " + name).text(name);
        }
    } else {
        var cutMsg = eval(callParent('lcm[23]'));
        showAlertDialog("warning", cutMsg);
    }

    if ((indexOfArray === undefined) || isPillChecked) {

        for (var i = 0; i < totalRows[0].length; i++) {
            //totalRows[0][i](if sorting happrend i wont be the row num) is the row and j is column
            //if (getAjaxIviewData) {
            var presentRowData = rowsData[i];
            (!isNaN(parseInt(colvalue))) ? presentRowData = presentRowData[Object.keys(presentRowData)[colvalue]] : graphCol = presentRowData[colvalue]
            presentRowData = typeof presentRowData[colvalue] == "object" ? presentRowData[colvalue].display : presentRowData[colvalue];
            //}
            //else {
            //    var presentRowData = typeof rowsData[i][j] == "object" ? rowsData[i][j].display : rowsData[i][j];
            //}
            if (anchorRegexPatter.test(presentRowData))
                presentRowData = $(presentRowData).text();
            presentRowData = presentRowData.replace(",", "");
            ivirHltValue = ivirHltValue.replace(",", "");
            if (ivirHighlightCndtn == "equalto") {
                if (colType === "d") {
                    var momentObj = moment(ivirHltValue, 'YYYY-MM-DD');
                    var momentString = momentObj.format('DD/MM/YYYY');
                    if (momentString === (typeof rowsData[i][colvalue] == "object" ? rowsData[i][colvalue] : rowsData[i][colvalue])) {
                        pushValues(totalRows[0][i], colvalue);
                    }
                    //else if (momentString === (typeof rowsData[i][j] == "object" ? rowsData[i][j].display : rowsData[i][j])) {
                    //    pushValues(totalRows[0][i], j);
                    //}
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
            // if(ivirHighlightCndtn == "contains")
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
    // if(type == "all"){}
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
                // ivirDataTableApi.columns('.ivirCustomHighlight.highlight' + index).header()
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

    if (fixedColumnsObj != "")
        $(".DTFC_LeftBodyWrapper .ivirCustomHighlight,.DTFC_LeftBodyWrapper .ivirCustomHighlightCell").removeClass("ivirCustomHighlight").css({
            "background-color": "",
            "color": ""
        });
}

/**
 * To create all the condtions in ivirmain object (Except chart - since chart have different function createChartPills/upateTheChartPills)
 * @author ManiKanta
 * @Date   2018-11-20T10:30:05+0530
 * @param  {String}                 type            Particular type to create or all
 * @param  {String}                 pillToHighlight To chechk the first/last/none by default
 * @return {}                                 
 */
function createPills(type, pillToHighlight) {
    if (!ivirMainObj.highlight && !ivirMainObj.group && !ivirMainObj.filter)
        return

    var pillsArray = "";
    var allPillsArray = "";
    var allPillsType = ""
    var curType = "";
    var icons = "";
    // if (type == 'all')
    allPillsType = ['highlight', 'group', 'filter'];

    icons = {
        highlight: "icon-software-paintbrush",
        group: "icon-software-layers2",
        chart: "icon-software-layers1",
        filter: "icon-basic-elaboration-todolist-search"
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
            pillsHtml += '<span title="' + curType + '" class="' + icons[typeOfPill] + ' ivirCndtnIcon"></span>';
            pillsHtml += '<span class="ivirCndtnName">' + typeOfPill + ' <span class="label ivirCndtnLabel">' + ivirMainObj[typeOfPill].length + '</span></span>';
            pillsHtml += '</span>';
        }
    }

    //need to loop-end

    pillsHtml += '</div>';
    pillsHtml += '<div id="ivirAllCndtnPills" style="display: none;">';


    //need to loop
    for (var i = 0; i < allPillsType.length; i++) {
        var pillsArray = ivirMainObj[allPillsType[i]];
        if (pillsArray) {
            for (var j = 0; j < pillsArray.length; j++) {
                var curType = allPillsType[i];
                pillsHtml += '<div id="ivir' + curType + j + 'CndtnPill" data-pill-type="' + curType + '">';
                pillsHtml += '<span class="materialCheckBox">';

                if (pillToHighlight == "first" && j == 0)
                    pillsHtml += '<input id="' + curType + 'pillCB' + j + '" checked data-index=' + j + ' data-type="' + curType + '" class="filled-in ivirFilterCheckBox" type="checkbox" value="" />';
                else if (pillToHighlight == "last" && j == (pillsArray[j].length - 1))
                    pillsHtml += '<input id="' + curType + 'pillCB' + j + '" checked data-index=' + j + ' data-type="' + curType + '" class="filled-in ivirFilterCheckBox" type="checkbox" value="" />';
                else
                    pillsHtml += '<input id="' + curType + 'pillCB' + j + '" data-index=' + j + ' data-type="' + curType + '" class="filled-in ivirFilterCheckBox" type="checkbox" value="" />';



                // pillsHtml += '<input type="checkbox" class="" id="filled-in-box1" checked="checked" />';
                pillsHtml += '<label for="' + curType + 'pillCB' + j + '"></label>';
                pillsHtml += '</span>';
                pillsHtml += '<span class="pillMainWrapper">';
                pillsHtml += '<span title="' + curType + '" class="' + icons[curType] + ' ivirCndtnIcon"></span>';
                pillsHtml += '<a href="javascript:void(0)" title="Edit ' + pillsArray[j].n + '" onclick="editThePill(\'' + curType + '\',' + j + ')" class="ivirCndtnName">' + pillsArray[j].n + '</a>';
                pillsHtml += '<button title="Remove" type="button" onclick="deleteThePill(\'' + curType + '\',' + j + ')" class="noBg deletePillBtn"><span class="icon-arrows-remove pillRemove"></span></button>';
                pillsHtml += '</span>';
                pillsHtml += '</div>';
            }
        }
    }


    //need to loop-end
    pillsHtml += '</div></div></div>';


    $("#pillsWrapper").html(pillsHtml).show('slow');

}

/**
 * To update the condtions when user added new or anything update(Not for chart)
 * @author ManiKanta
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
        highlight: "icon-software-paintbrush",
        group: "icon-software-layers2",
        chart: "icon-software-layers1",
        filter: "icon-basic-elaboration-todolist-search"
    }
    pillsHtml += '<div id="ivir' + curType + j + 'CndtnPill" data-pill-type="' + curType + '">';
    pillsHtml += '<span class="materialCheckBox">';
    pillsHtml += '<input id="' + curType + 'pillCB' + j + '" checked data-index=' + j + ' data-type="' + curType + '" class="filled-in ivirFilterCheckBox" type="checkbox" value="" />';
    pillsHtml += '<label for="' + curType + 'pillCB' + j + '"></label>';
    pillsHtml += '</span>';
    pillsHtml += '<span class="pillMainWrapper">';
    pillsHtml += '<span title="' + curType + '" class="' + icons[curType] + ' ivirCndtnIcon"></span>';
    pillsHtml += '<a href="javascript:void(0)" title="Edit ' + name + '" onclick="editThePill(\'' + curType + '\',' + j + ')" class="ivirCndtnName">' + name + '</a>';
    pillsHtml += '<button type="button" onclick="deleteThePill(\'' + curType + '\',' + j + ')" title="Remove" class="noBg deletePillBtn"><span class="icon-arrows-remove pillRemove"></span></button>';
    pillsHtml += '</span>';
    pillsHtml += '</div>';


    $("#ivirAllCndtnPills").append(pillsHtml);

    if ($("#ivir" + curType + "CndtnPill").length == 0) {

        var panelHdHtml = "";
        panelHdHtml += '<span id="ivir' + curType + 'CndtnPill" class="pillMainWrapper">';
        panelHdHtml += '<span title="' + curType + '" class="' + icons[curType] + ' ivirCndtnIcon"></span>';
        panelHdHtml += '<span class="ivirCndtnName">' + curType + ' <span class="label ivirCndtnLabel">' + ivirMainObj[curType].length + '</span></span>';
        panelHdHtml += '</span>';
        $("#ivirAllCndtns").append(panelHdHtml);
    } else {
        $("#ivir" + curType + "CndtnPill .ivirCndtnLabel").text(ivirMainObj[type].length);
    }
    // pillsHtml += '<div id="' + type + "Pill" + i + '" class="row attrib">';
    // pillsHtml += '<div class="col-sm-6 col-xs-6">';
    // pillsHtml += '<div class="checkbox">';
    // pillsHtml += '<input checked data-index=' + i + ' data-type="' + type + '" class="ivirFilterCheckBox" type="checkbox" value="" />';
    // pillsHtml += '<label class="ivirPillNameLabel" onclick="editThePill(\'' + type + '\',' + i + ')">' + name + '</label>';
    // pillsHtml += '</div></div>';
    // pillsHtml += '<div class="col-sm-6 col-xs-6 align">';
    // pillsHtml += '<i class="icon-arrows-remove" onclick="deleteThePill(\'' + type + '\',' + i + ')"></i>';
    // pillsHtml += '</div></div>';
    // $("#ivirFilteredAccordion .panel-body").append(pillsHtml);
    // if ($("#" + type + "Panel").length == 0) {
    //     var panelHdHtml = "";
    //     panelHdHtml += '<div class="panel-title" id="' + type + 'Panel">';
    //     panelHdHtml += '<i class="icon-software-layers2 mclass" aria-hidden="true" data-toggle="collapse" href="#collapseOne"></i>';
    //     panelHdHtml += '<a href="#collapseOne" data-toggle="collapse" class="condition">' + type + '</a>';
    //     panelHdHtml += '<label class="digit badge">' + ivirMainObj[type].length + '</label>';
    //     panelHdHtml += '</div>';
    //     $("#pillsWrapper .panel-heading").append(panelHdHtml);
    // } else {
    //     $("#" + type + "Panel .digit").text(ivirMainObj[type].length);
    // }
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
    icons = {
        highlight: "icon-software-paintbrush",
        group: "icon-software-layers2",
        chart: "icon-software-layers1"
    }
    for (var j = 0; j < chartArray.length; j++) {
        var currentChart = chartArray[j];

        pillsHtml += '<div id="ivir' + curType + j + 'CndtnPill" class="chartPills">';
        pillsHtml += '<span class="materialCheckBox">';
        if (j == 0)
            pillsHtml += '<input checked id="' + curType + 'pillCB' + j + '" data-index=' + j + ' data-type="' + curType + '" class="filled-in ivirChartCheckBox" type="checkbox" value="" />';
        else
            pillsHtml += '<input id="' + curType + 'pillCB' + j + '" data-index=' + j + ' data-type="' + curType + '" class="filled-in ivirChartCheckBox" type="checkbox" value="" />';
        pillsHtml += '<label for="' + curType + 'pillCB' + j + '"></label>';
        pillsHtml += '</span>';
        pillsHtml += '<span class="pillMainWrapper">';
        pillsHtml += '<span title="' + curType + '" class="' + icons[curType] + ' ivirCndtnIcon"></span>';
        pillsHtml += '<a href="javascript:void(0)" title="Edit ' + currentChart.n + '" onclick="editThePill(\'' + curType + '\',' + j + ')" class="ivirCndtnName">' + currentChart.n + '</a>';
        pillsHtml += '<button type="button" onclick="deleteThePill(\'' + curType + '\',' + j + ')" title="Remove" class="noBg deletePillBtn"><span class="icon-arrows-remove pillRemove"></span></button>';
        pillsHtml += '</span>';
        pillsHtml += '</div>';
    }

    $("#ivirChartPills").addClass('pillsAdded').show().html(pillsHtml);
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
        highlight: "icon-software-paintbrush",
        group: "icon-software-layers2",
        chart: "icon-software-layers1"
    }


    pillsHtml += '<div id="ivir' + curType + j + 'CndtnPill" class="chartPills">';
    pillsHtml += '<span class="materialCheckBox">';
    pillsHtml += '<input checked id="' + curType + 'pillCB' + j + '" data-index=' + j + ' data-type="' + curType + '" class="filled-in ivirChartCheckBox" type="checkbox" value="" />';
    pillsHtml += '<label for="' + curType + 'pillCB' + j + '"></label>';
    pillsHtml += '</span>';
    pillsHtml += '<span class="pillMainWrapper">';
    pillsHtml += '<span title="' + curType + '" class="' + icons[curType] + ' ivirCndtnIcon"></span>';
    pillsHtml += '<a href="javascript:void(0)" title="Edit ' + name + '" onclick="editThePill(\'' + curType + '\',' + j + ')" class="ivirCndtnName">' + name + '</a>';
    pillsHtml += '<button type="button" onclick="deleteThePill(\'' + curType + '\',' + j + ')" title="Remove" class="noBg deletePillBtn"><span class="icon-arrows-remove pillRemove"></span></button>';
    pillsHtml += '</span>';
    pillsHtml += '</div>';
    $(".ivirChartCheckBox").prop('checked', false).removeAttr('checked');
    $("#ivirChartWrapper .chartWrapper").hide(); //chartWrapper
    $("#ivirChartWrapper #ivirChart" + j).show();
    $("#ivirChartPills").show().append(pillsHtml);
}

/**
 * Show/Hide of the highlight/group condtions when user click on show hide button
 * @author ManiKanta
 * @Date   2018-11-20T10:36:46+0530
 * @return {}                 
 */
function toggleIvirPills() {
    var cndtns = $("#ivirAllCndtns");
    var cndtnsPills = $("#ivirAllCndtnPills");
    if (cndtns.is(":visible")) {
        $("#ivirCndtnToggleBtn").removeClass('icon-arrows-keyboard-right').addClass('icon-arrows-keyboard-down');
        cndtns.hide();
        cndtnsPills.show();

    } else {
        $("#ivirCndtnToggleBtn").removeClass('icon-arrows-keyboard-down').addClass('icon-arrows-keyboard-right');
        cndtnsPills.hide();
        cndtns.show();
    }
    setSmartViewHeight();
}

/** When user checking existing chart conditions */
$(document).on('change', '.ivirChartCheckBox', function (event) {
    var clickedElement = $(this);
    var index = clickedElement.data('index');
    var id = clickedElement.attr('id');
    if (clickedElement.is(':checked')) {

        if (!checkForPillDependentFlds('chart', index)) {
            clickedElement.prop('checked', false)
            clickedElement.removeAttr('checked');
            return false;
        }
        $(".ivirChartCheckBox").not('#' + id).prop('checked', false).removeAttr('checked');
        $("#ivirChartWrapper .chartWrapper").hide(); //chartWrapper
        $("#ivirChartWrapper #ivirChart" + index).show();
        ivirCreateChart(index, true, true)
    } else {
        // $(".ivirChartCheckBox")
        clickedElement.prop('checked', true).attr('checked', 'checked');
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
            //$("#IvirActions option[value='chart']").prop('disabled', true).attr('disabled', 'disabled');
            $("#chartActionLi").addClass("subHeader");
        } else if (type == "filter") {
            //debugger;
            advFiltersObjectToApply = ivirMainObj.filter[clickedElement.data("index")].data;
            ivirDataTableApi.draw();
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
            //$("#IvirActions option[value='chart']").prop('disabled', false).removeAttr('disabled');
            $("#chartActionLi").removeClass("subHeader");
        } else if (type == "filter") {
            //debugger;
            advFiltersObjectToApply = { somedummyfilterjsobjectkey: "dummy" };
            ivirDataTableApi.draw();
        }
    }

});



// function createNewPill(type) {
//     if (type == "highlight")
//         ivirActionDialog("Highlight", getHighlightHtml(), "ivirHighlightRow");
// }

/**
 * To apply the existing conditions(highlight/group)
 * @author ManiKanta
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
        //advFiltersObjectToApply = ivirMainObj.filter[index].data;
        //ivirDataTableApi.draw();
    }
}

/**
 * Will be called when a condition is edited
 * @author ManiKanta
 * @Date   2018-11-20T11:14:52+0530
 * @param  {String}                  type  highlight/group/chart
 * @param  {Number}                 index Index of the condition to edit
 * @return {}                       
 */
function editThePill(type, index) {
    var showValueOption = [type, index];
    if (type == 'highlight') {
        var htmlToShow = getHighlightHtml(type, index, true);
        ivirActionDialog("Highlight", "highlight", htmlToShow, "ivirHighlightRow", showValueOption, true);
    } else if (type == 'group') {
        ivirActionDialog('Row Grouping', "group", getGroupHtml(true), "ivirRowGrouping", showValueOption, true);
    } else if (type == 'chart') {
        var chartParam = $("#" + type + "pillCB" + index).is(":checked");
        ivirActionDialog('Chart', "chart", getChartHtml(!chartParam), "ivirCreateChart", showValueOption, true);
    } else if (type == 'filter') {
        ivirMoreFilters(index);
    }
}

/**
 * will be called to delete the conditions
 * @author ManiKanta
 * @Date   2018-11-20T11:16:55+0530
 * @param  {String}                 type  highlihgt/group/chart
 * @param  {index}                  index index of the condition to delete
 * @return {}                       
 */
function deleteThePill(type, index) {
    if (type == 'highlight')
        clearIvirHighlight(index);
    else if (type == 'group') {
        var grandtotalArray = ivirMainObj[type][index].g;
        if (grandtotalArray) {
            for (var i = 0; i < grandtotalArray.length; i++) {
                var idx = allGrandTotal.indexOf(grandtotalArray[i]);
                allGrandTotal.splice(idx, 1);
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
    pillsArray.splice(index, 1);
    if (type != "chart") {
        if (pillsArray.length == 0) {
            delete ivirMainObj[type];
            $("#ivir" + type + "CndtnPill").remove();
        } else {
            $("#ivir" + type + "CndtnPill .ivirCndtnLabel").text(ivirMainObj[type].length);
        }

        var filterPills = $("[data-pill-type='filter']");
        //when user deletes a plill and if any other filter pill exists & it was selected then display default grid data as selected filter 
        if (filterPills.length && filterPills.find(".ivirFilterCheckBox").is(":checked"))
            advFiltersObjectToApply = ivirMainObj.filter[filterPills.find(".ivirFilterCheckBox:checked").data("index")].data;
        else
            advFiltersObjectToApply = { somedummyfilterjsobjectkey: "dummy" };
        ivirDataTableApi.draw();
        if ($("#ivirAllCndtns").html() == "") {
            $("#pillsWrapper").html("");
        }
    } else {
        if (pillsArray.length == 0) {
            toggleGridView("grid");
            $("#ivirCButtonsWrapper").hide();
            delete ivirMainObj[type];
        } else if (isPillChecked) {
            // chartpillCB0//ivirChart0
            $("#chartpillCB0").prop('checked', true).attr('checked', 'checked');
            $("#ivirChart0").show();
        }
    }

}
// function deleteTheChartPill(type, index) {
//     $("#ivirchart"+index+"CndtnPill").remove();


//     reArrangeChartIndexes(index);
//     var pillsArray = ivirMainObj[type];
//     pillsArray.splice(index, 1);
// }

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
    if (index != pillsArray.length - 1) {
        var presentIndex = index;

        for (var i = (index + 1); i < pillsArray.length; i++) {
            var parentEl = $("#ivir" + type + (presentIndex + 1) + "CndtnPill");
            var indexToAdd = (i - 1);
            //if (type == "chart")
            var idToAdd = type + 'pillCB' + indexToAdd; //chartpillCB1
            // else
            //     var idToAdd = type + indexToAdd + 'pillCB';
            parentEl.find('input.ivirFilterCheckBox,input.ivirChartCheckBox').attr('id', idToAdd).data('index', indexToAdd).attr('data-index', indexToAdd);
            parentEl.find('input.ivirFilterCheckBox,input.ivirChartCheckBox').next("label").attr('for', idToAdd);
            parentEl.find('.ivirCndtnName').attr('onclick', 'editThePill("' + type + '",' + indexToAdd + ')');
            parentEl.find('.deletePillBtn').attr('onclick', 'deleteThePill("' + type + '",' + indexToAdd + ')');
            parentEl.attr('id', "ivir" + type + indexToAdd + "CndtnPill"); //ivirgroup0CndtnPill//
            // parentEl = parentEl.next();
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
// function reArrangeChartIndexes(index) {
//     var pillsArray = ivirMainObj.chart;
//     if (index != pillsArray.length - 1) {
//         var presentIndex = index;
//         var type = "chart";
//         for (var i = (index + 1); i < pillsArray.length; i++) {

//             var parentEl = $("#ivir" + type + (presentIndex + 1) + "CndtnPill");
//             var indexToAdd = (i - 1);
//             parentEl.find('input.ivirFilterCheckBox').attr('id', type + indexToAdd + 'pillCB').data('index', indexToAdd).attr('data-index', indexToAdd);
//             parentEl.find('input.ivirFilterCheckBox').next("label").attr('for', type + indexToAdd + 'pillCB');
//             parentEl.find('.ivirCndtnName').attr('onclick', 'editThePill("' + type + '",' + indexToAdd + ')');
//             parentEl.find('.icon-arrows-remove.pillRemove').attr('onclick', 'deleteThePill("' + type + '",' + indexToAdd + ')');
//             parentEl.attr('id', "ivir" + type + indexToAdd + "CndtnPill"); //ivirgroup0CndtnPill//
//             // parentEl = parentEl.next();
//             presentIndex++;
//         }
//     }
// }




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
    // $("#ivirHighlightWrapper .form-control").each(function() {
    //     var fldId = $(this)[0].id;
    //     var fldlabel = fldId + "Lbl";
    //     if ($("#" + fldlabel).length) {
    //         errors = true;
    //         return false;
    //     }
    // });
    // return errors ? false : true;
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
        // alert(errorMessages.downloadSelection);
        return false;
    } else {
        var typeOfFile = ivirDataTableApi;
        // var btnData = typeOfFile.buttons.exportData();
        // var json = JSON.stringify(btnData);
        //if ($('.COPY').hasClass('active')) {
        //typeOfFile.button('1').trigger();
        // }
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
        }

        return true;
        //else if ($('.PRINT').hasClass('active')) {
        //typeOfFile.button('5').trigger();
        //}
        // var json = JSON.stringify(btnData);

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
        /*if(isChked == undefined && isChked == true){
 
        }
        else */
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
    var chkItems;

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
    if (type == "chart") {
        $("#ivirFilteredAccordion").hide();
        $(".chrtView").addClass('active');
        $("#ivirCButtonsWrapper").show();
        $("#ivirMainChartWrapper").show();
        $("#searchSelectColumnButton").prop('disabled', true);
        $("#ivirMainDataTableWrapper").hide();
        $(ivirTable + "_paginate").hide();
        $(ivirTable + "_length").hide();
    } else if (type == "grid") {
        $(".grdView").addClass('active');
        $("#ivirFilteredAccordion").show();
        $("#ivirCButtonsWrapper").show();
        $('#ivirMainChartWrapper').hide();
        $("#searchSelectColumnButton").prop('disabled', false);
        $(ivirTable + "_paginate").show();
        $(ivirTable + "_length").show();
        $("#ivirMainDataTableWrapper").show();
        ivirDataTableApi.columns.adjust().draw();
    } else if (type = "showChartErrMsg") {
        if ($(elem).data("count") == 0) {
            $(elem).data("count", 1)
        } else {
            showAlertDialog("warning", errorMessages.noChartWhileGrpng);
        }
    }
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
    //var valueSelected = $("#ivirChartVal").find('option:selected')[0].value;
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
    $("#ivirChartWrapper .chartWrapper").hide(); //chartWrapper
    $("#ivirChartWrapper #ivirChart" + index).show();
    if (!isDataExists) {
        var cutMsg = eval(callParent('lcm[0]'));
        $('#ivirChartWrapper #' + idOftheDiv).html("<p class='ivirNoDataTag'>" + cutMsg + "</p>")
        return;
    }
    $('#ivirChartWrapper #' + idOftheDiv).highcharts({
        colors: ['#f8bd19', '#e44a00', '#008ee4', '#33bdda', '#6baa01', '#583e78'],
        //colors: ['#EED17F', '#97CBE7', '#074868', '#B0D67A', '#2C560A', '#DD9D82'],
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
                return this.series.name + '<br>' + headerName + ': <b>' + this.y + '</b>';
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

    $("#ivirChartWrapper .chartWrapper").hide(); //chartWrapper
    $("#ivirChartWrapper #ivirChart" + index).show();
    if (!isDataExists) {
        var cutMsg = eval(callParent('lcm[0]'));
        $('#ivirChartWrapper #' + idOftheDiv).html("<p class='ivirNoDataTag'>" + cutMsg + "</p>")
        return;
    }
    // else
    //     $("#" + idOftheDiv).show();
    isDonut ? sizeOfInner = 80 : sizeOfInner = 0;
    $('#ivirChartWrapper #' + idOftheDiv).highcharts({
        colors: ['#f8bd19', '#e44a00', '#008ee4', '#33bdda', '#6baa01', '#583e78'],
        //colors: ['#EED17F', '#97CBE7', '#074868', '#B0D67A', '#2C560A', '#DD9D82'],
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
}


/** Generic fucntion to create the select dropdown kind ui like column selection */
(function ($, window, document, undefined) {

    'use strict';

    var $html = $('html');

    $html.on('click.ui.dropdown', '.js-dropdown', function (e) {
        e.preventDefault();
        var presentElem = $(this);
        if (!presentElem.hasClass('is-open')) {
            presentElem.find('.dropDownButton__list').css({
                'display': 'block',
                'visibility': 'hidden'
            });
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
    //$html.on('blur.ui.dropdown', '.js-dropdown', function (e) {
    //    $(document).unbind('keydown.upDownEvents');
    //    $('.js-dropdown').removeClass('is-open');
    //})
    $html.on('click.ui.dropdown', '.js-dropdown [data-dropdown-value]', function (e) {
        e.preventDefault();
        var $item = $(this);
        if (!$item.hasClass('subHeader')) {
            var $dropdown = $item.parents('.js-dropdown');
            $dropdown.find('.js-dropdown__input').data('index', $item.data('index')).val($item.data('dropdown-value')).change();
            if (!$dropdown.hasClass("ivirActionDrpDwn"))
                $dropdown.find('.js-dropdown__current').attr('title', 'Search ' + $item.text()).text($item.text());
            else
                $dropdown.find('.js-dropdown__current').text(callParentNew('lcm')[406]);
        } else {
            e.stopPropagation();
        }
    });

    $html.on('click.ui.dropdown', function (e) {
        var $target = $(e.target);
        if (!$target.parents().hasClass('js-dropdown')) {
            $(document).unbind('keydown.upDownEvents');
            $('.js-dropdown').removeClass('is-open');
        }
        if (!$(e.target).hasClass('rightClickMenuIcn')) {

            $(".rightClickMenu").hide();
        }

    });

})(jQuery, window, document);


function closeTheDropDowns() {

}

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
 * @author ManiKanta
 * @Date   2018-11-20T11:57:58+0530
 * @param  {String}                 title The title user is going to add
 * @return {Boolean}                      true - valid,false- invalid
 */
function ivirDuplicateCheck(title, isEditPill, index) {
    title = title.toLowerCase();
    var obj = ivirMainObj[title];
    var fld = title == "filter" ? $('#divModalAdvancedFilters .fldNme') : $('.jconfirm-content .fldNme');
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
    //if (jQuery.isEmptyObject(ivirMainObj)) {
    //    showAlertDialog("warning", "No changes to save.");
    //    return false;
    //}


    //Caching in local storage.
    var isLocalCache = false;
    try {
        if (typeof (Storage) !== "undefined") {
            var ivInteractiveMainJson = localStorage.ivInteractiveMainJson;
            if (ivInteractiveMainJson) {
                isLocalCache = true;
                var savedJson = JSON.parse(ivInteractiveMainJson);
                //if (ivirDataTableApi)
                //    ivirMainObj.pageLength = ivirDataTableApi.page.len();
                savedJson[iName] = ivirMainObj;
                saveJsonToDB("set", JSON.stringify(savedJson));
            } else {
                isLocalCache = false;
            }

        } else {
            isLocalCache = false;
            console.log("Sorry! No Web Storage support..")
        }
    } catch (e) {
        isLocalCache = false;
        console.log(e);
    }
    if (!isLocalCache) {
        var jsonToSave = {};
        //if (ivirDataTableApi)
        //    ivirMainObj.pageLength = ivirDataTableApi.page.len();
        jsonToSave[iName] = ivirMainObj;
        jsonToSave
        saveJsonToDB("set", JSON.stringify(jsonToSave));
    }



    //if (typeof (Storage) !== "undefined") {
    //    var ivInteractiveMainJson = localStorage.ivInteractiveMainJson;

    //    if (ivInteractiveMainJson) {
    //        var savedJson = JSON.parse(ivInteractiveMainJson);
    //        savedJson[iName] = ivirMainObj;
    //        saveJsonToDB("set", JSON.stringify(savedJson));
    //    } else {
    //        var jsonToSave = {};
    //        jsonToSave[iName] = ivirMainObj;
    //        saveJsonToDB("set", JSON.stringify(jsonToSave));
    //    }
    //} else {
    //    //ivirDataTableApi.page.len()

    //    var cutMsg = eval(callParent('lcm[24]'));
    //    console.log(cutMsg)
    //}
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

        var jsonObj = JSON.parse(ivInteractiveMainJson);
        if (jsonObj[iName]) {
            if (jQuery.isEmptyObject(ivirMainObj))
                ivirMainObj = jsonObj[iName];
        }
        createIvirDataTable();
        createPillsOnLoad();


    }
    //var jsonObj = { "ordlist": { "group": [{ "n": "test", "cl": 5 }, { "n": "testt", "cl": 9 }], "highlight": [{ "n": "teat", "t": "cell", "bc": "#ff80c0", "tc": "#000000", "cl": 5, "cn": "equalto", "v": "1" }], "chart": [{ "n": "test", "t": "pie", "cl": 3, "v": 7 }] } };
    //jsonObj = JSON.parse(jsonSaved);
    //ivirMainObj = jsonObj[iName];
    // createPills("all", "first");


}

/**
 * Internal function to get/set the conditiond from/to db
 * @author ManiKanta
 * @Date   2018-11-20T12:00:27+0530
 * @param  {String}                 option task to get/set
 * @param  {Object}                 json   if set the json data to set
 * @return {}                        
 */
function saveJsonToDB(option, json) {
    if (option == "set" && json != "") {
        $.ajax({
            url: 'iview.aspx/SaveJsonInDB',
            type: 'POST',
            cache: false,
            async: false,
            data: JSON.stringify({ jsonString: json }),
            dataType: 'json',
            contentType: "application/json",
            success: function (msg) {
                if (msg.d == "done") {
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
            //cache: false,
            async: true,
            //data: JSON.stringify({ jsonString: json }),
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
                    else
                        showAlertDialog("warning", 3028, "client");
                } catch (ex) {
                    console.log("Failed in getting ivirjson", ex.message);
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
 * Create all the condtions once we got the data from database
 * @author ManiKanta
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
            ivirCreateChart(i, false, false, true);
            createChartPills();

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
    if (getColumns) {
        return dependentCols;
    }
    var dependentColsLength = dependentCols.length;
    var allColsPresent = true;
    for (var i = 0; i < dependentColsLength; i++) {
        //var dependentCols[i]
        if ($.inArray(dependentCols[i], ivirVisibleColumns) === -1) {
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


$(window).resize(function () {
    //Makes use of jquery.visible.min.js
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

});

//to get filter pill index
//returns pill index - if exists, -1 - if not
function getFiltersPillIndex() {
    var prevDrawnMoreFilters = $("#divModalAdvancedFilters .body-cont").parent();
    var pillindex = -1;
    if (prevDrawnMoreFilters.length > 0) {
        pillindex = prevDrawnMoreFilters.find(".body-cont").data("pillindex")
        return pillindex == -1 ? undefined : pillindex;
    }
}

function showDataTableLoading() {
    //$(".dataTables_scrollBody").append("<div class='dt-loading'><i class='fa fa-refresh fa-spin fa-4x'></i></div>")
    ShowDimmer(true);
}

function hideDataTableLoading() {
    //$(".dataTables_scrollBody .dt-loading").remove();
    ShowDimmer(false);
}
