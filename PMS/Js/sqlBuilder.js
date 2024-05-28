var apiBase = eval(callParent('nodeApi'));//
var sId = eval(callParent('mainSessionId'));
var utls = eval(callParent('utl'));
var codeMirrorHintObj = {};
var allTstructs = [];
var tstructTableObj = {};
var tstructColObj = {};
var mainSqlCM = "";
var tableSqlCM = "";
var tableObj = {};
var isTstGenerated = false;
var isEditSelect = false;
var presUserName = callParentNew("mainUserName");
var nodeAccessToken = callParentNew("nodeAccessToken");


function createSqlWindow() {
    if (!$("#propertySheet").hasClass("scale-out")) {
        //if ($("#selmoe option:selected").val() == "Select") {
        if (!$("#selAlwEmpty").is(":visible")) {
            $("#propertySearchFld").focus();
        } else {
            $("#selAlwEmpty").focus();
        }
        var selectHtml = '<div class="col-md-12">';
        selectHtml += '<div id="SLCTradioBtns">';
        selectHtml += '<label class="radio-inline">';
        selectHtml += '<input type="radio" data-target="SQLslctData" name="slctRdioBtns" value="sql">SQL</label>';
        selectHtml += '<label class="radio-inline">';
        selectHtml += '<input type="radio" data-target="TBLslctData" name="slctRdioBtns" value="table">Table</label>';
        selectHtml += '<label class="radio-inline">';
        //selectHtml += '<input type="radio" data-target="SLslctData" name="slctRdioBtns" value="staticList">Static List</label>'
        selectHtml += '</div>';
        selectHtml += '<div id="SLCTData">';
        selectHtml += '<div id="SQLslctData" class="slctdataWrapper">';
        selectHtml += '<textarea id="codeMirrorSql"  rows="4"></textarea>';
        selectHtml += '</div>';
        selectHtml += '<div id="TBLslctData" class="slctdataWrapper">';
        selectHtml += '<div class="row">';
        selectHtml += '<div class="col-md-6">';
        selectHtml += '<div class="form-group">';
        selectHtml += '<label for="slctTstrctName">Tstruct</label>';
        selectHtml += '<input type="text" class="form-control" id="slctTstrctName">';
        selectHtml += '</div>';
        selectHtml += '</div>';
        selectHtml += '<div class="col-md-6">';
        selectHtml += '<div class="form-group">';
        selectHtml += '<label for="slctTblName">Table</label>';
        selectHtml += '<input type="text" class="form-control" id="slctTblName">';
        selectHtml += '</div>';
        selectHtml += '</div>';
        selectHtml += '<div class="col-sm-12">';
        selectHtml += '<div id="wtrFldsData"></div>';
        selectHtml += '</div>';
        selectHtml += '<div class="col-sm-12" id="tableSqlData" style="display: none;">';
        selectHtml += '<textarea id="tableSqlCM" cols="30" rows="10"></textarea>';
        selectHtml += '</div>';
        selectHtml += '</div>';
        selectHtml += '</div>';
        selectHtml += '<div id="SLslctData" class="slctdataWrapper">';
        selectHtml += '<div class="row">';
        selectHtml += '<div class="cloneParent">';
        selectHtml += '<div class="input-field col-sm-10">';
        selectHtml += '<input value="" id="ivColHyPName0" class="cloneChangeId form-control" data-idkey="ivColHyPName" type="text">';

        selectHtml += '</div>';
        selectHtml += '<div class="col-sm-2 ivColAdDelWrapper">';
        selectHtml += '<button onclick="genericCloneTheRow(this,\'add\',\'ivColHyp\')" data-index="0" class="waves-effect waves-light addBtn btn-flat"><span class="icon-arrows-plus"></span></button>';
        selectHtml += '<button style="display:none" onclick="genericCloneTheRow(this,\'delete\',\'ivColHyp\')" data-index="0" class="waves-effect waves-light delBtn btn-flat">x<span class="icon"></span></button>';
        selectHtml += '</div>';
        selectHtml += '</div>';
        selectHtml += '</div>';
        selectHtml += '</div>';
        selectHtml += '</div>';
        selectHtml += '</div>';
        sqlConfirm = $.confirm({
            theme: 'modern',
            title: 'SQL',
            content: selectHtml,
            closeIcon: true,
            escapeKey: 'Cancel',
            backgroundDismiss: true,
            columnClass: 'col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-10 col-xs-offset-1',
            onOpenBefore: function () {
                $('input[type=radio][name=slctRdioBtns]').change(function () {
                    var elem = $(this);

                    var idToShow = elem.data('target');
                    $("#SLCTData .slctdataWrapper").hide();
                    $("#" + idToShow).show();
                    if ($($('input[type=radio][name=slctRdioBtns]')[1]).val() == "table") {
                        $("#slctTstrctName").focus();
                    }
                    else {
                        mainSqlCM.focus();
                    }

                })
                $($('input[type=radio][name=slctRdioBtns]')[0]).click()
                $(".CodeMirror-line span").focus();
            },
            onContentReady: function () {
                getTstructs();
                getHintsForCodeMirror()
                disableBackDrop('bind');

                if (Object.keys(tableValues).length != 0) {
                    if (tableValues["sqlQuery"] != undefined) {
                        mainSqlCM.setValue(tableValues.sqlQuery)
                    }
                    else {
                        $($('input[type=radio][name=slctRdioBtns]')[1]).click();
                        $("#slctTstrctName").val(tableValues.tstructObj.value);
                        $("#slctTstrctName").data('ui-autocomplete')._trigger('select', 'autocompleteselect', { item: tableValues.tstructObj });

                        //createTableCols(tableValues.tstructObj.tId, tableValues.tableObj.dcName);
                        //$.each(tableValues.columnsfrom, function (index, value) {
                        //    $(this).data('ui-autocomplete')._trigger('select', 'autocompleteselect', { item: { value: value } });
                        //$("#extraColMSFrom").append(new Option(value, key));
                        //});
                        //$.each(tableValues.columnsto, function (key, value) {
                        //    $("#extraColMSTo").append(new Option(value, key));
                        //});
                    }

                }
            },
            buttons: {
                Apply: {
                    btnClass: 'btn btn-primary',
                    keys: ['enter'],
                    action: function () {
                        return saveSelectChanges();
                        //sqlConfirm.close();
                    }
                },
                Cancel: {
                    btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                    action: function () {
                        $("#codeMirrorSql").removeClass('cdmrEdiSetted');
                        sqlConfirm.close();
                        disableBackDrop('destroy');

                    }
                }

            }
        });
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

function getHintsForCodeMirror() {
    //if (isTstGenerated) {
    //    return;
    //}
    if (!jQuery.isEmptyObject(codeMirrorHintObj)) {
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
            addAutoSuggestSql(mainSqlCM);
            // mainSqlCM.options.hintOptions.tables = codeMirrorHintObj;
        } else {
            mainSqlCM.refresh();
        }
        return;
    }
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
            "username": presUserName,
            "authorization": nodeAccessToken,
            "appSKey": appsessionKey
        }
    }

    $.ajax(settings).done(function (response) {
        isTstGenerated = true;
        if (response.status == true) {
            var data = response.data;
            if (data) {
                $.each(data, function (index, value) {
                    if (codeMirrorHintObj[value[0]]) { codeMirrorHintObj[value[0]].push(value[1]); } else { codeMirrorHintObj[value[0]] = [value[1]] }
                });
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
                    addAutoSuggestSql(mainSqlCM);
                    // mainSqlCM.options.hintOptions.tables = codeMirrorHintObj;
                } else {
                    mainSqlCM.refresh();
                }

            }
        } else {
            showAlertDialog("warning", response.errMsg);
        }
        // console.log(response);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        showAlertDialog("error", "Unable to connect node server.");
    });
}


function getTstructs() {
    if (allTstructs.length != 0) {
        creatAutoComplete("#slctTstrctName");
        return;
    }
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
            "username": presUserName,
            "authorization": nodeAccessToken,
            "appSKey": appsessionKey
        }
    }

    $.ajax(settings).done(function (response) {
        if (response.status == true) {
            var data = response.data;
            if (data) {
                $.each(data, function (index, value) {
                    allTstructs.push({ label: value[1], value: value[1], tId: value[0] });
                });

                creatAutoComplete("#slctTstrctName", false)

            }
        } else {
            showAlertDialog("warning", response.errMsg);
        }
        // console.log(response);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        showAlertDialog("error", "Unable to connect node server.");
    });
}



function creatAutoComplete(fld) {
    $(fld).autocomplete({
        minLength: 0,
        selectFirst: true,
        autoFocus: true,
        // appendTo: ".dvheightframe",
        source: function (request, response) {
            var results = $.ui.autocomplete.filter(allTstructs, request.term);

            response(results.slice(0, 20));
        },
        select: function (event, ui) {
            tableValues.tstructObj = ui.item;
            var transId = ui.item.tId;
            var cachedObj = tstructTableObj[transId];
            if (!cachedObj) {
                createTstructTableAutoCom(transId, true);
            } else {
                createTstructTableAutoCom(cachedObj, false)
            }
        }
    });
    $(fld).off('focus.manualTri')
    $(fld).on('focus.manualTri', function () {
        $(fld).autocomplete("search");
    })
}

function createTstructTableAutoCom(tIdObj, isNew) {
    if (isNew) {
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
                "tstruct": tIdObj,
                "username": presUserName,
                "authorization": nodeAccessToken,
                "appSKey": appsessionKey
            }
        }

        $.ajax(settings).done(function (response) {

            if (response.status == true) {
                var data = response.data;
                // 
                if (data) {
                    var presObj = [];
                    for (var i = 0; i < data.length; i++) {
                        var presData = data[i]
                        presObj.push({ label: presData[1], value: presData[1], tblName: presData[0], dcName: presData[2] })
                    }
                    tstructTableObj[tIdObj] = presObj;

                    createTstructTableAutoCom(presObj, false)
                }
            } else {
                showAlertDialog("warning", response.errMsg);
            }
            // console.log(response);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            showAlertDialog("error", "Unable to connect node server.");
        });
    } else {
        if ($("#slctTblName").data("uiAutocomplete"))
            $("#slctTblName").autocomplete("destroy");
        $("#slctTblName").autocomplete({
            minLength: 0,
            selectFirst: true,
            autoFocus: true,
            // appendTo: ".dvheightframe",
            source: function (request, response) {
                var results = $.ui.autocomplete.filter(tIdObj, request.term);

                response(results.slice(0, 20));
            },
            select: function (event, ui) {
                $("#slctTblName").data("tableName", ui.item.tblName)
                tableValues.tableObj = ui.item;
                var tid = "";
                if (!isEditSelect)
                    tid = $("#slctTstrctName").data("uiAutocomplete").selectedItem.tId
                else
                    tid = tableValues.tstructObj.tId;
                createTableCols(tid, ui.item.dcName)
                isEditSelect = true;
            }
        }).focus();

        if (isEditSelect) {
            $("#slctTblName").val(tableValues.tableObj.value);
            $("#slctTblName").data('ui-autocomplete')._trigger('select', 'autocompleteselect', { item: tableValues.tableObj });
            if (tableValues.columnsfrom != undefined && tableValues.columnsfrom.length != 0) {

                var respFrmHTML = "";
                var respToHtml = "";
                for (var i = 0; i < tableValues.columnsfrom.length; i++) {
                    respFrmHTML += " <option value='" + tableValues.columnsfrom[i].val.toString() + "' >" + tableValues.columnsfrom[i].text.toString() + "</option>";
                }
                for (var i = 0; i < tableValues.columnsto.length; i++) {
                    respToHtml += " <option value='" + tableValues.columnsto[i].val.toString() + "' >" + tableValues.columnsto[i].text.toString() + "</option>";
                }
                if (respFrmHTML != "") {
                    $("#extraColMSFrom").append(respFrmHTML);
                    $('#extraColMSTo').html('');
                    $("#extraColMSTo").append(respToHtml);
                }
                $("#tableSqlCM").text(tableValues.tableSqlCM);
                tableSqlCM.getDoc().setValue($("#tableSqlCM").text());
                tableSqlCM.refresh();
                $("#extraColMSFrom").multiselect('refresh');
                $("#extraColMSTo").multiselect('refresh');
                tableSqlCM.refresh();
                //ShowDesignerResp();
                //ShowHomeBuildResp();
            }
            //$("#extraColMSTo option").each(function (index, el) {
            //    var presSlctVal = $(this);
            //    var slctVal = presSlctVal.attr('value');
            //    if (typeof tableValues.columnsfrom[slctVal] != "undefined") {
            //        presSlctVal.dblclick();
            //    }
            //});
        }
    }
    $("#slctTblName").off('focus.manualTri')
    $("#slctTblName").on('focus.manualTri', function () {
        $("#slctTblName").autocomplete("search");
    });
}

function ConstructResponsibilityFields() {

}
function createTableCols(transId, dcName) {
    var cachedObj = tstructColObj[transId + dcName];
    if (!cachedObj) {
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
                "username": presUserName,
                "authorization": nodeAccessToken,
                "appSKey": appsessionKey
            }
        }

        $.ajax(settings).done(function (response) {
            if (response.status == true) {
                var data = response.data;
                if (data) {
                    // var presObj= [];
                    // for (var i = 0; i < data.length; i++) {
                    //     var presData = data[i];
                    //     presObj.push({ label: presData[1], value: presData[1], colName: presData[0], dtType: presData[2] })
                    // }
                    tstructColObj[transId + dcName] = data;
                    createTableCols(transId, dcName)

                }
            } else {
                showAlertDialog("warning", response.errMsg);
            }
            // console.log(response);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            showAlertDialog("error", "Unable to connect node server.");
        });
    } else {
        var tableName = $("#slctTblName").data("tableName");
        var optionsHtml = "";
        var presObj = cachedObj
        // for (var key in presObj) {
        //     if (presObj.hasOwnProperty(key)) {
        //         var name = key;
        //         var dbName = presObj[key].split("__~__")[0];
        //         optionsHtml += "<option value='" + dbName + "'>" + name + "</option>";
        //     }
        // }
        for (var i = 0; i < presObj.length; i++) {
            var presData = presObj[i];
            optionsHtml += "<option value='" + presData[0] + "'>" + presData[1] + "</option>";
        }
        optionsHtml += "<option value='" + tableName + "id'>" + tableName + "id</option>";

        var htmlToAdd = "";
        htmlToAdd = '<div class="row con">';
        htmlToAdd += '<div class="col-sm-5 multiSelWrap">';
        htmlToAdd += '<label class="widgetRespLabel">Columns<sup>*</sup></label>';
        htmlToAdd += '<select name="from[]" id="extraColMSFrom" data-right="#extraColMSTo" data-right-all="#right_All_1" data-right-selected="#right_Selected_1" data-left-all="#left_All_1" data-left-selected="#left_Selected_1" class="form-control1 browser-default rlmultiSlectFld" size="8" multiple="multiple">';
        htmlToAdd += optionsHtml;
        htmlToAdd += '</select>';
        htmlToAdd += '</div>';
        htmlToAdd += '<div id="sqlFldColSlctWrapper" class="col col-sm-2 multiSelWrapOpt" style="padding-left: 20px;">';
        htmlToAdd += '<button title="Select All" type="button" id="right_All_1" class="icon-arrows-right-double">';
        htmlToAdd += '<i class="icon-chevron-right frstIcn"></i>';
        htmlToAdd += '<i class="icon-chevron-right scndIcn"></i>';
        htmlToAdd += '</button>';
        htmlToAdd += '<button title="Select" type="button" id="right_Selected_1" class="icon-arrows-right">';
        htmlToAdd += '<i class="icon-chevron-right"></i>';
        htmlToAdd += '</button>';
        htmlToAdd += '<button title="Remove" type="button" id="left_Selected_1" class="icon-arrows-left">';
        htmlToAdd += '<i class="icon-chevron-left"></i>';
        htmlToAdd += '</button>';
        htmlToAdd += '<button title="Remove All" type="button" id="left_All_1" class="icon-arrows-left-double-32">';
        htmlToAdd += '<i class="icon-chevron-left frstIcn"></i>';
        htmlToAdd += '<i class="icon-chevron-left scndIcn"></i>';
        htmlToAdd += '</button>';
        htmlToAdd += '</div>';
        htmlToAdd += '<div class="col col-sm-5 multiSelWrap multiSelWrap2">';
        htmlToAdd += '<select name="to[]" id="extraColMSTo" class="form-control1 browser-default rlmultiSlectFld" size="8" multiple="multiple"></select>';
        htmlToAdd += '</div>';
        htmlToAdd += '</div>';

        $("#wtrFldsData").html(htmlToAdd)
        // $("#wtrFldsData select").material_select();
        $("#widgetTableRemData").show();
        $('#extraColMSFrom').multiselect({
            sort: false,
            afterMoveToRight: function ($left, $right, $options) {
                createSqlForTableData()
            },
            afterMoveToLeft: function () {
                createSqlForTableData()
            }
        });
        //$("#right_All_1").click();
        // createSqlForTableData();
    }

}


function createSqlForTableData() {
    var sqlText = "SELECT ";
    var paramStr = "";
    var groupByStr = "";
    var tableName = $("#slctTblName").data("tableName");
    // if (calledFrom === "kpi") {
    $("#extraColMSTo option").each(function (index, el) {
        var elemVal = $(this).val();
        paramStr += elemVal + ",";
        groupByStr += elemVal + ",";
    });

    // }


    if (paramStr !== "") paramStr = paramStr.slice(0, -1), groupByStr = groupByStr.slice(0, -1);
    var finalSql = sqlText + paramStr + " FROM " + tableName;


    $("#tableSqlCM").text(finalSql);


    $("#tableSqlData").show();
    if (!$("#tableSqlCM").hasClass('cdmrEdiSetted')) {
        $("#tableSqlCM").addClass('cdmrEdiSetted')
        tableSqlCM = CodeMirror.fromTextArea(document.getElementById("tableSqlCM"), {
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
        tableSqlCM.on("change", function (doc, changeObj) {
            $("#wizardNextbtn").removeClass('validated')
            // $("#isValidSQl").val("false");
        });
        addAutoSuggestSql(tableSqlCM);
        // mainSqlCM.options.hintOptions.tables = codeMirrorHintObj;
    } else {
        // $("#tableSqlCM").text();

        tableSqlCM.getDoc().setValue($("#tableSqlCM").text());
        tableSqlCM.refresh();
    }
}
function saveSelectChanges(isValid) {
    var checkedVal = $('input[name="slctRdioBtns"]:checked').val()
    if (!isValid) {
        if (!doTheValidations(checkedVal)) return false;
    }
    if (checkedVal == "sql") {
        $("#sqlSource").val(mainSqlCM.getDoc().getValue());
        tableValues.sqlQuery = mainSqlCM.getDoc().getValue();
    }
    else if (checkedVal == "table") {
        $("#sqlSource").val(tableSqlCM.getDoc().getValue());
        //    //tableValues.tstructObj = $("#slctTstrctName").data().uiAutocomplete.selectedItem;
        //    //tableValues.tableObj = $("#slctTblName").data().uiAutocomplete.selectedItem;
        //    //tableValues.transid = $("#slctTstrctName").data().uiAutocomplete.selectedItem.tId;
        //    //tableValues.dcname = $("#slctTblName").data().uiAutocomplete.selectedItem.dcName;
        var tableFromArr = [];
        var tableToArr = [];
        var optVal = "";
        var optTxt = "";
        $("#extraColMSTo option").each(function (index) {
            optVal = this.value;
            optTxt = this.text;
            //tableToArr[optVal] = optTxt;
            tableToArr.push({ text: optTxt, val: optVal })

        });
        $("#extraColMSFrom option").each(function (index) {
            optVal = this.value;
            optTxt = this.text;
            //tableFromArr[optVal] = optTxt;
            tableFromArr.push({ text: optTxt, val: optVal })

        });
        //    //extraColMSFrom
        tableValues.columnsfrom = tableFromArr;
        tableValues.columnsto = tableToArr;
        tableValues.tableSqlCM = $("#tableSqlCM").text();
    }
    else {

    }

    return true;

}

function isValidQuery(sql) {
    sql = validateTheSql(sql);
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
            "calledFrom": "validate",
            "isMetadata": false,
            "username": presUserName,
            "authorization": nodeAccessToken,
            "appSKey": appsessionKey
        }
    }

    $.ajax(settings).done(function (response) {
        if (response.status == true) {
            saveSelectChanges(true);
            sqlConfirm.close();
        } else {
            showAlertDialog("warning", response.errMsg);
            valSessByApi(response);
        }
        // console.log(response);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        showAlertDialog("error", "Unable to connect node server.");
    });
}

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

function doTheValidations(checkedVal) {
    if (checkedVal === "sql") {
        //need to validate the SQL
        isValidQuery(mainSqlCM.getDoc().getValue())
        return false;
    } else {
        if ($("#slctTstrctName").val() === "") {
            showAlertDialog("error", "Please select a tstruct.");
            return false;
        }
        if ($("#slctTblName").val() === "") {
            showAlertDialog("error", "Please select a table.");
            return false;
        }
        if ($("#extraColMSTo option").length === 0) {
            showAlertDialog("error", "Please select atleast one column.")
            return false;
        }
        //need to validate SQL;
        isValidQuery(tableSqlCM.getDoc().getValue())
        return false;
    }
    return true;
}

function addAutoSuggestSql(codeMirrorObj){
    codeMirrorObj.on('keyup', function(editor, event){
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
}