var dtAssoc = [];
var searchResult = [];
var AutPageNo = 1, AutPageSize = 50, rcount = 0, fetchRCount = FetchPickListRows || 1000; PageCount = 0;
var CangefldName = '', isNavigation = false, refreshAC = false, pickarrow = false;
var isAutocomBlur = true;
var isSelectedValFocus = false;
//$(function () {
//    createFormSelect(".fldFromSelect,.multiFldChk");

//    createFormMultiSelect(".fldmultiSelect");

//});

function createFormSelect(fld) {
    const formSelect = $(fld);
    var fldNameAc = "",
        fieldName = "",
        fastdll = "",
        termVal = "",
        depFldName = "";
    var isPickMinChar = false;
    var isOnCLose = false;
    formSelect.select2({
        ajax: {
            url: 'tstruct.aspx/GetAutoCompleteData',
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            delay: 250,
            data: function (params) {

                if (select2IsOpened && (typeof params.term == "undefined" || params.term == "")) {
                    termVal = "";
                }
                else if (select2IsFocused) {
                    select2EventType = "open";
                    termVal = params.term == "" ? undefined : (isSelectedValFocus ? undefined : params.term);
                    //console.log("Select2:select2IsFocused:" + termVal + " ," + isSelectedValFocus);

                }
                else if (typeof params.term != "undefined" && params.term != "") {
                    termVal = params.term;
                }


                fastdll = $(this).hasClass('multiFldChk') ? true : $(this).hasClass('fastdll');
                if (fastdll == true || (fastdll == false && termVal == "") || (fastdll == false && (typeof termVal == "undefined" || termVal.length > 2))) {
                    isPickMinChar = false;
                    var isrefreshsave = $(this).hasClass('isrefreshsave');
                    var pageData = GetAutoCompData(fldNameAc, termVal, AutPageNo, AutPageSize);
                    var fieldName = fldNameAc.substring(0, fldNameAc.lastIndexOf("F") - 3);
                    var parentFldVal = "";
                    if (typeof wsPerfEnabled != "undefined" && wsPerfEnabled)
                        parentFldVal = ISBoundAutoCom(fieldName, fldNameAc);
                    else
                        parentFldVal = ISBoundNew(fieldName, fldNameAc);
                    let fldApiInd = GetFieldIndex(fieldName);
                    let isApifld = FldIsAPI[fldApiInd];

                    return JSON.stringify({
                        tstDataId: tstDataId,
                        FldName: fieldName,
                        FltValue: termVal,
                        ChangedFields: ChangedFields,
                        ChangedFieldDbRowNo: ChangedFieldDbRowNo,
                        ChangedFieldValues: ChangedFieldValues,
                        DeletedDCRows: DeletedDCRows,
                        pageData: pageData,
                        fastdll: fastdll,
                        fldNameAc: fldNameAc,
                        refreshAC: refreshAC,
                        pickArrow: pickarrow,
                        parentsFlds: parentFldVal,
                        rfSave: isrefreshsave,
                        IsApiFld: isApifld,
                        tblSourceParams: ""
                    });
                } else {
                    rcount = 0;
                    isPickMinChar = true;
                }
            },
            processResults: function (data) {
                // datasss = data.d;
                select2EventType = "open";
                refreshAC = false;
                try {
                    var result = data.d.toString().replace(new RegExp("\\n", "g"), "");
                    if (result != "") {
                        if (result.split("*♠*").length > 1) {
                            serverprocesstime = result.split("*♠*")[1];
                            requestProcess_logtime = result.split("*♠*")[2];
                            result = result.split("*♠*")[0];
                            WireElapsTime(serverprocesstime, requestProcess_logtime, true);
                        } else {
                            UpdateExceptionMessageInET("Error : " + result);
                        }
                    }
                    if (CheckSessionTimeout(result))
                        return;
                    result = result.toString().replace(new RegExp("\\t", "g"), "&#9;");
                    ChangedFields = new Array();
                    ChangedFieldDbRowNo = new Array();
                    ChangedFieldValues = new Array();
                    DeletedDCRows = new Array();
                    if (!(result.toLowerCase().includes("access violation") && result.toLowerCase().includes("asbtstruct.dll"))) {
                        var serResult = $.parseJSON(result);
                        datasss = serResult;
                        if (serResult.error) {
                            ExecErrorMsg(serResult.error, "autocomplete");
                            return;
                        }
                        var rcountNew = serResult.pickdata[0].rcount;
                        depFldName = serResult.pickdata[2].dfname;
                        // AutoFillFlds[fieldName] = depFldName;
                        if (rcountNew != 0)
                            rcount = parseInt(rcountNew);
                        rcount = rcount < fetchRCount ? rcount : fetchRCount;
                        PageCount = Math.ceil(rcount / AutPageSize);
                        PageCount == 0 ? PageCount = 1 : "";
                        countPerPage = rcount;
                        if (AutPageNo == 1) {
                            if (PageCount == 1) {
                                $("#autoleft" + fldNameAc).prop("disabled", true).addClass("disabled");
                                $("#autoright" + fldNameAc).prop("disabled", true).addClass("disabled");
                            } else {
                                // $("#autoleft" + fldNameAc).prop("disabled", true).addClass("disabled");
                                $("#autoright" + fldNameAc).prop("disabled", false).removeClass("disabled");
                            }
                        }
                        else if (AutPageNo > 1 && PageCount <= AutPageNo)
                            $("#autoright" + fldNameAc).prop("disabled", true).addClass("disabled");

                        dtAssoc = serResult.pickdata[3].data;
                        if (dtAssoc != undefined && dtAssoc.length != 0) {
                            if ($(this.$element).hasClass('multiFldChk'))
                                $(".msSelectAllOption").removeClass("d-none");
                            if (fastdll) {
                                var aSearch = [];
                                $(dtAssoc).each(function (iIndex, sElement) {
                                    sElement.i = sElement.i.replace(/\^\^dq/g, '"');
                                    if (sElement.i.toLowerCase().indexOf(termVal.toLowerCase()) >= 0) {
                                        aSearch.push(sElement);
                                    }
                                });
                                $("#" + fldNameAc).data("rowcount", aSearch.length);
                                if (aSearch.length != 0) {
                                    var result = ($.map(aSearch, function (item) {
                                        item.i = item.i.replace(/\^\^dq/g, '"');
                                        return {
                                            //id: item.v == "" ? item.i : item.v,
                                            id: item.i,
                                            text: item.i,
                                            dep: item.d
                                        }
                                    }))
                                    if (AxRulesDefFilter == "true")
                                        result = AxFilterDropDownResult(fldNameAc, result);
                                    searchResult = result;
                                    return {
                                        results: result
                                    };
                                } else {
                                    if ($(this.$element).hasClass('multiFldChk'))
                                        $(".msSelectAllOption").addClass("d-none");
                                    var cutMsg = eval(callParent('lcm[0]'));
                                    return { results: "", noResults: cutMsg };
                                }
                            } else {
                                var result = ($.map(dtAssoc, function (item) {
                                    item.i = item.i.replace(/\^\^dq/g, '"');
                                    return {
                                        //id: item.v == "" ? item.i : item.v,
                                        id: item.i,
                                        text: item.i,
                                        dep: item.d
                                    }
                                }))
                                if (AxRulesDefFilter == "true")
                                    result = AxFilterDropDownResult(fldNameAc, result);
                                searchResult = result;
                                return {
                                    results: result
                                };
                            }
                        } else {
                            if ($(this.$element).hasClass('multiFldChk'))
                                $(".msSelectAllOption").addClass("d-none");
                            var cutMsg = eval(callParent('lcm[0]'));
                            return { results: "", noResults: cutMsg };
                        }
                    } else {
                        AxWaitCursor(false);
                        ShowDimmer(false);
                        $("#reloaddiv").show();
                        $("#dvlayout").hide();
                    }
                } catch (exception) {
                    if (exception.message.toLowerCase().indexOf("access violation") != -1) {
                        AxWaitCursor(false);
                        ShowDimmer(false);
                        $("#reloaddiv").show();
                        $("#dvlayout").hide();
                    }
                }
            }
        },
        placeholder: 'Search for a repository',
        minimumInputLength: 0,
        language: {
            errorLoading: function () {
                if (isPickMinChar)
                    return 'Required to search minimum 3 characters';
                else
                    return 'Start type characters for searching data..';
            }
        }
    }).on('select2:select', function (event) {
        let depList = event.params.data.dep;
        let fldAcValue = $(this).val();
        if (typeof $(this).data("separator") != "undefined" && $(this).hasClass("multiFldChk")) {
            let separator = $(this).data("separator");
            fldAcValue = fldAcValue.join(separator);
        }
        refreshAC = false;
        isGrdEditDirty = true;
        dtAssoc = [];
        var cutMsg = eval(callParent('lcm[0]'));

        var fName = GetFieldsName(fldNameAc);
        var fldIndex = $j.inArray(fName, FNames);

        if (fldIndex == -1)
            return;
        if (typeof $("#" + fldNameAc).attr('disabled') != "undefined")
            return;
        if (FFieldReadOnly[fldIndex] == "True")
            return;
        if (FFieldHidden[fldIndex] == "True")
            return;

        var rcID = GetFieldsRowFrameNo(fldNameAc);
        var acFrNo = GetFieldsDcNo(fldNameAc);
        var rowNum = GetDbRowNo(GetFieldsRowNo(fldNameAc), acFrNo);
        var fldRowNo = GetFieldsRowNo(fldNameAc);
        if (IsDcGrid(acFrNo) && isGrdEditDirty)
            UpdateFieldArray(axpIsRowValid + acFrNo + fldRowNo + "F" + acFrNo, GetDbRowNo(fldRowNo, acFrNo), "", "parent", "AddRow");
        UpdateFieldArray(fldNameAc, rowNum, fldAcValue, "parent", "AutoComplete");
        UpdateAllFieldValues(fldNameAc, fldAcValue);

        if (depList != undefined && depList != null && depList != cutMsg && depFldName != "") {//Alogn with othe cindtion should check depFldName variable also should not be empty
            try {
                //dep = uhid^patient_details^attending_physician~76222000000431^wardtype~Single Room
                var depText = depList.split('^');
                var dfCount = 0;
                $.each(depText, function (index, value) {
                    var depfldId = depFldName.split('^')[dfCount];
                    var depfldValue = value;
                    dfCount++;
                    rcID = rcID.substring(0, rcID.lastIndexOf('F') + 1) + GetDcNo(depfldId);
                    $("#" + depfldId + rcID).val(depfldValue);
                    var fldIndex = $j.inArray(depfldId, FNames);
                    var fldType = GetFieldType(depfldId, fldIndex);
                    if (fldType == "Numeric")
                        $("#" + depfldId + rcID).data("attr", depfldValue);
                    if (depfldValue != undefined) {
                        UpdateFieldArray(depfldId + rcID, rowNum, depfldValue, "parent", "AutoComplete");
                        UpdateAllFieldValues(depfldId + rcID, depfldValue);
                    }
                });
            } catch (Ex) { }
        }
        setTimeout(function () {
            AxOldValue = "";
            MainBlur($j("#" + fldNameAc));
        }, 0);
    }).on("select2:unselect", function (e) {
        let fldNamesf = $(this).attr("id");
        let fldAcValue = $(this).val();
        if (typeof $(this).data("separator") != "undefined" && $(this).hasClass("multiFldChk")) {
            let separator = $(this).data("separator");
            fldAcValue = fldAcValue.join(separator);
            var rcID = GetFieldsRowFrameNo(fldNamesf);
            var acFrNo = GetFieldsDcNo(fldNamesf);
            var rowNum = GetDbRowNo(GetFieldsRowNo(fldNamesf), acFrNo);
            UpdateFieldArray(fldNamesf, rowNum, fldAcValue, "parent", "AutoComplete");
            UpdateAllFieldValues(fldNamesf, fldAcValue);
        }
        if (fldAcValue == "")
            AxOldValue = " ";
        else if (!$(this).hasClass("multiFldChk"))
            AxOldValue = fldAcValue;
        MainBlur($j("#" + fldNamesf));
    }).on('select2:open', function (e) {

        const evt = "scroll.select2";
        $(e.target).parents().off(evt);
        $(window).off(evt);

        isPickMinChar = false;
        if (select2IsFocused) {
            select2EventType = "tab";
            if ($(this).val() != "" && $(this).val() != null) {
                //$("input.select2-search__field").val($(this).val());
                if (!$(this).hasClass('multiFldChk')) {
                    isSelectedValFocus = false;
                    select2IsFocused = true;
                    select2IsOpened = false;
                } else {
                    $("input.select2-search__field").val($(this).val());
                    select2IsOpened = true;
                    isSelectedValFocus = true;
                }
            } else if (!isOnCLose && !$(this).hasClass('multiFldChk')) {
                select2IsOpened = true;
                select2EventType = "click";
            } else if (isOnCLose && $(this).val() == null && !$(this).hasClass('multiFldChk'))
                select2IsFocused = true;
            else if (isOnCLose && $(this).val() != "" && $(this).val() != null && !$(this).hasClass('multiFldChk'))
                select2IsFocused = false;
            isOnCLose = false;
        }
        else {
            if ($(this).attr("id") != AxFocusedFld && AxFocusedFld != "" && !$("#" + AxFocusedFld).hasClass("fldFromSelect") && !$("#" + AxFocusedFld).hasClass("multiFldChk") && !$("#" + AxFocusedFld).hasClass("gridHeaderSwitch"))// Changed text field and directlly click on select2 field using mouse changed field not getting call mainblur.
            {
                MainBlur($("#" + AxFocusedFld));
                AxOldValue = "";
                MainFocus($j(this));
            }
            else if (gridRowEditOnLoad && IsGridField(GetFieldsName($(this).attr("id")))) {
                UpdateGridRowFlags($(this).attr("id"), GetFieldsDcNo($(this).attr("id")), "001");
            }
            if (!isOnCLose) {
                if ($(this).val() != "" && $(this).val() != null && !$(this).hasClass('multiFldChk')) {
                    //$("input.select2-search__field").val($(this).val());
                    isSelectedValFocus = true;
                    select2IsFocused = true;
                } else {
                    $("input.select2-search__field").val($(this).val());
                    select2IsOpened = true;
                    select2EventType = "click";
                }
            } else if (isOnCLose && $(this).val() == null && !$(this).hasClass('multiFldChk'))
                select2IsFocused = true;
            else if (isOnCLose && $(this).val() != "" && $(this).val() != null && !$(this).hasClass('multiFldChk'))
                select2IsFocused = false;
            isOnCLose = false;
        }

        let addOption = typeof $(this).attr("data-addoption") == "undefined" ? "" : $(this).attr("data-addoption");
        let dataRefresh = typeof $(this).attr("data-refresh") == "undefined" ? "" : $(this).attr("data-refresh");
        let _thisId = $(this).attr("id");
        let iconBtn = "";
        if (!$(this).hasClass('multiFldChk')) {
            if (typeof dataRefresh != "undefined" && dataRefresh != "" && dataRefresh == "true") {
                iconBtn += '<a class="btn btn-sm btn-icon btn-white btn-color-gray-600 btn-active-primary me-2 shadow-sm ms-2 fsautorefresh" id="autorefresh' + _thisId + '" title="Refresh" data-refresh=' + _thisId + '><span class="material-icons material-icons-style material-icons-3">refresh</span></a>';
            }
            else if (typeof dataRefresh != "undefined" && dataRefresh != "" && dataRefresh == "false") {
                iconBtn += '<a class="btn btn-sm btn-icon btn-white btn-color-gray-600 btn-active-primary me-2 shadow-sm ms-2 disabled" id="autoleft' + _thisId + '" title="Previous" data-fldname=' + _thisId + '><span class="material-icons material-icons-style material-icons-3">navigate_before</span></a><a class="btn btn-sm btn-icon btn-white btn-color-gray-500 btn-active-primary me-2 shadow-sm disabled" id="autoright' + _thisId + '" title="Next" data-fldname=' + _thisId + '><span class="material-icons material-icons-style material-icons-3">navigate_next</span></a>';
            }
            iconBtn += '<a class="btn btn-sm btn-icon btn-white btn-color-gray-500 btn-active-primary me-2 shadow-sm float-end" id="advSearch' + _thisId + '" title="adv. search" data-ids=' + _thisId + '><span class="material-icons material-icons-style material-icons-3">search</span></a><input type=hidden id="pickIdVal_' + _thisId + '" value=\"\" />';
        } else {
            $(".select2-results a.fsautorefresh").remove();
            iconBtn += '<a class="btn btn-sm btn-icon btn-white btn-color-gray-500 btn-active-primary me-2 shadow-sm float-end" id="advSearch' + _thisId + '" title="adv. search" data-ids=' + _thisId + '><span class="material-icons material-icons-style material-icons-3">search</span></a><input type=hidden id="pickIdVal_' + _thisId + '" value=\"\" />';
        }
        if (typeof addOption != "undefined" && addOption != "") {
            iconBtn += '<a class="btn btn-sm btn-icon btn-white btn-color-gray-600 btn-active-primary me-2 shadow-sm float-end" id="addOption' + _thisId + '" data-ids=' + _thisId + ' title="Add Master Data"><span class="material-icons material-icons-style material-icons-3">add</span></a>';
        }
        $(".select2-results:not(:has(a))").append(iconBtn);

        fldNameAc = $(this).attr("id");
        if ($(this).hasClass('multiFldChk')) {
            var curDropdown = $(this).data("select2")?.$dropdown;
            if (curDropdown.find(".select2-results").find(".msSelectAllOption").length == 0) {
                let selectAllHTML = `<div class="msSelectAllOption form-check form-check-custom align-self-end px-5 d-none">
                    <input type="checkbox" class="form-check-input msSelectAll" onchange="checkAllCheckBoxTokens(this, '${fldNameAc}')"/>
                    <label for="SelectAll" class="ps-2 form-check-label form-label col-form-label pb-1 fw-boldest">
                        Select All
                    </label>
                </div>`;
                curDropdown.find(".select2-results").append(selectAllHTML);
            }
            var selectedOptionCount = 0;
            curDropdown.find(".select2-results").find(".select2-results__options li:not(.select2-results__option--disabled.loading-results)").each((ind, elm) => {
                if ($(elm).hasClass("select2-results__option--selected")) {
                    selectedOptionCount++;
                }
            });

            if (curDropdown.find(".select2-results").find(".select2-results__options li:not(.select2-results__option--disabled.loading-results)").length == selectedOptionCount && selectedOptionCount > 0) {
                curDropdown.find(".select2-results").find(".msSelectAllOption > .msSelectAll").prop("checked", true);
            }
            else if (curDropdown.find(".select2-results").find(".select2-results__options li:not(.select2-results__option--disabled.loading-results)").length != selectedOptionCount && curDropdown.find(".select2-results").find(".msSelectAllOption > .msSelectAll").is(":checked")) {
                curDropdown.find(".select2-results").find(".msSelectAllOption > .msSelectAll").prop("checked", false);
            }
        }

        if (CangefldName != fldNameAc) {
            AutPageNo = 1;
            rcount = 0;
            CangefldName = fldNameAc;
        }
        if (!isNavigation)
            AutPageNo = 1;
        isNavigation = false;

        clickEvents(_thisId);
    }).on("select2:close", function (e) {
        isOnCLose = false;
        isSelectedValFocus = false;
        select2IsFocused = true;
        select2EventType = "";
    }).on("select2:closing", function (e) {
        isOnCLose = true;
        select2EventType = "";
    }).on("select2:clear", function (e) {
        isOnCLose = true;
        select2EventType = "";
    });
}

function clickEvents(fsFldName) {

    $(document).off("click", "#autorefresh" + fsFldName);
    $(document).on("click", "#autorefresh" + fsFldName, function (e) {
        refreshAC = true;
        AutPageNo = 1;
        rcount = 0;
        CangefldName = '';
        PageCount = 0;
        isSelectedValFocus = false;
        select2IsFocused = false;
        select2IsOpened = true;
        select2EventType = "click";
        if (typeof $(".select2-dropdown--below") != "undefined" && $(".select2-dropdown--below").length > 0)
            $(".select2-dropdown--below").find('.select2-search__field').trigger($.Event('input', { which: 13 }));
        else {
            $("#" + $(e.currentTarget).data('refresh')).select2('close');
            $("#" + $(e.currentTarget).data('refresh')).select2('open');
        }
    });

    $(document).off("click", "#autoleft" + fsFldName);
    $(document).on("click", "#autoleft" + fsFldName, function (e) {
        isNavigation = true;
        pickarrow = true;
        AutPageNo--;
        isSelectedValFocus = false;
        $("#autoright" + fsFldName).prop("disabled", false).removeClass("disabled");
        if (AutPageNo == 1) {
            $("#autoleft" + fsFldName).prop("disabled", true).addClass("disabled");
        }
        select2IsFocused = false;
        select2IsOpened = true;
        select2EventType = "click";
        //$(".select2-dropdown--below").find('.select2-search__field').trigger($.Event('input', { which: 13 }));
        if (typeof $(".select2-dropdown--below") != "undefined" && $(".select2-dropdown--below").length > 0)
            $(".select2-dropdown--below").find('.select2-search__field').trigger($.Event('input', { which: 13 }));
        else {
            $("#" + $(e.currentTarget).data('refresh')).select2('close');
            $("#" + $(e.currentTarget).data('refresh')).select2('open');
        }
    });

    $(document).off("click", "#autoright" + fsFldName);
    $(document).on("click", "#autoright" + fsFldName, function (e) {
        isNavigation = true;
        pickarrow = true;
        AutPageNo++;
        isSelectedValFocus = false;

        $("#autoleft" + fsFldName).prop("disabled", false).removeClass("disabled");
        if (PageCount <= AutPageNo) {
            $("#autoright" + fsFldName).prop("disabled", true).addClass("disabled");
        }
        select2IsFocused = false;
        select2IsOpened = true;
        select2EventType = "click";
        //$(".select2-dropdown--below").find('.select2-search__field').trigger($.Event('input', { which: 13 }));
        if (typeof $(".select2-dropdown--below") != "undefined" && $(".select2-dropdown--below").length > 0)
            $(".select2-dropdown--below").find('.select2-search__field').trigger($.Event('input', { which: 13 }));
        else {
            $("#" + $(e.currentTarget).data('refresh')).select2('close');
            $("#" + $(e.currentTarget).data('refresh')).select2('open');
        }
    });

    $(document).off("click", "#advSearch" + fsFldName);
    $(document).on("click", "#advSearch" + fsFldName, function () {
        $("#" + $(this).data("ids")).select2("close");
        isSelectedValFocus = false;
        SearchOpenNew($(this).data("ids"));
    });

    $(document).off("click", "#addOption" + fsFldName);
    $(document).on("click", "#addOption" + fsFldName, function () {
        $("#" + $(this).data("ids")).select2("close");
        let mstFldId = $(this).data("ids");
        let mstFldDetails = $("#" + mstFldId).data("addoption");
        var fieldName = mstFldId.substring(0, mstFldId.lastIndexOf("F") - 3);
        let na = `tstruct.aspx?transid=` + mstFldDetails.split('~')[0] + `&AxPop=true&AxRefSelect=true&AxRefSelectID=` + fieldName + `&AxSrcSelectID=` + mstFldDetails.split('~')[1] + `&AxRefType=` + mstFldDetails.split('~')[2];
        isSelectedValFocus = false;
        let myModal = new BSModal("modalIdNewItem", "", "<iframe class='col-12 h-100' src='" + na + "'></iframe>", () => {
            //shown callback
        }, () => {
            //hide callback
        });
        myModal.changeSize("fullscreen");
        myModal.hideFooter();
        myModal.hideHeader();
        myModal.showFloatingClose();
    });

    $(document).off("keydown", "input.select2-search__field");
    $(document).on("keydown", "input.select2-search__field", function (event) {
        if (isSelectedValFocus) {
            isSelectedValFocus = false;
        }
        if (event.originalEvent.keyCode == "9") {
            let _fldTarget = $(event.currentTarget).attr('aria-controls');
            if (typeof _fldTarget != "undefined") {
                _fldTarget = _fldTarget.replace("select2-", "").replace("-results", "");
                $("#" + _fldTarget).select2("close");
            }
        }
    });

    $(document).off("keypress", "input.select2-search__field");
    $(document).on("keypress", "input.select2-search__field", function (event) {
        if (isSelectedValFocus) {
            isSelectedValFocus = false;
        }
    });
}

function GetAutoCompData(fldNameAc, value, curPageNo, AutPageSize) {
    var includeDcs = "";
    if (arrRefreshDcs.length > 0) {
        for (var i = 0; i < arrRefreshDcs.length; i++) {
            var arrDcNos = arrRefreshDcs[i].split(':');
            includeDcs = arrDcNos[1].replace("dc", "") + ',' + arrDcNos[0].replace("dc", "");
        }
    }
    value = CheckSpecialCharsInStr(value);
    var fldDcNo = GetFieldsDcNo(fldNameAc);

    AxActiveRowNo = parseInt(GetFieldsRowNo(fldNameAc), 10);
    AxActiveRowNo = GetDbRowNo(AxActiveRowNo, fldDcNo);
    var activeRow = AxActiveRowNo;

    var parStr = "";
    if (AxActivePRow != "" && AxActivePDc != "")
        parStr = AxActivePDc + "♠" + AxActivePRow;

    var subStr = "";
    if (IsParentField(fldNameAc, fldDcNo))
        subStr = GetSubGridInfoForParent(fldDcNo, AxActiveRowNo);
    return curPageNo.toString() + "~" + AutPageSize.toString() + "~" + fldDcNo + "~" + activeRow + "~" + parStr + "~" + subStr + "~" + includeDcs;
}

function createFormMultiSelect(msfldId) {
    const formSelect = $(msfldId);
    var msData = "";
    var refreshMs = false;
    var fldNameMs = "";
    var isrefreshsave = "";
    var fieldName = "";
    var pageData = "";
    var parentFldVal = "";
    var igr = 1;
    formSelect.select2({
        ajax: {
            url: 'tstruct.aspx/GetMultiSelectValues',
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            delay: 250,
            data: function (params) {

                if (select2IsOpened && (typeof params.term == "undefined" || params.term == "")) {
                    termVal = "";
                }
                else if (select2IsFocused) {
                    select2EventType = "open";
                    termVal = params.term == "" ? undefined : params.term;
                }
                else if (typeof params.term != "undefined" && params.term != "") {
                    termVal = params.term;
                }
                igr = 1;
                fldNameMs = $(this).attr("id");
                isrefreshsave = $(this).hasClass('isrefreshsave');
                fieldName = fldNameMs.substring(0, fldNameMs.lastIndexOf("F") - 3);
                pageData = GetMultiSelectPageData(fldNameMs, "", 1, AutPageSize);

                return JSON.stringify({
                    tstDataId: tstDataId, FldName: fieldName, ChangedFields: ChangedFields, ChangedFieldDbRowNo: ChangedFieldDbRowNo,
                    ChangedFieldValues: ChangedFieldValues, DeletedDCRows: DeletedDCRows, fldNameMs: fldNameMs, refreshMs: refreshMs,
                    parentsFlds: parentFldVal, rfSave: isrefreshsave, pageData: pageData
                });
            },
            processResults: function (data) {
                select2EventType = "open";
                var result = data.d.toString().replace(new RegExp("\\n", "g"), "");
                if (CheckSessionTimeout(result))
                    return;
                result = result.toString().replace(new RegExp("\\t", "g"), "&#9;");
                ChangedFields = new Array();
                ChangedFieldDbRowNo = new Array();
                ChangedFieldValues = new Array();
                DeletedDCRows = new Array();
                if (result.toLowerCase().indexOf("access violation") === -1) {
                    var serResult = $.parseJSON(result);
                    if (serResult.error) {
                        ExecErrorMsg(serResult.error, "autocomplete");
                        return;
                    }
                    msData = serResult.multiselectdata[3].data;
                    if (msData.length != 0) {
                        let aSearch = [];
                        if (termVal.toLowerCase() != "") {
                            $(msData).each(function (iIndex, sElement) {
                                sElement.mslist = sElement.mslist.replace(/\^\^dq/g, '"');
                                if (sElement.mslist.toLowerCase().indexOf(termVal.toLowerCase()) >= 0) {
                                    aSearch.push(sElement);
                                }
                            });
                        } else {
                            aSearch = msData;
                        }
                        if (aSearch.length != 0) {
                            msData = _.sortBy(aSearch, "grouporder");
                            let grdNo = 0;
                            var mulResult = "[";
                            var result = ($.map(msData, function (item) {
                                if (grdNo == 0) {
                                    grdNo = item.grouporder;
                                    mulResult += `{"id":"` + item.grouporder + `","text":"` + item.groupby + `","children":[{"id":"` + item.mslist + `","text":"` + item.mslist + `","selected":"` + item.selected + `"}`;
                                }
                                else if (grdNo == item.grouporder) {
                                    grdNo = item.grouporder;
                                    mulResult += `,{"id":"` + item.mslist + `","text":"` + item.mslist + `","selected":"` + item.selected + `"}`;
                                }
                                else if (grdNo != item.grouporder) {
                                    grdNo = item.grouporder;
                                    mulResult += `]},{"id":"` + item.grouporder + `","text":"` + item.groupby + `","children":[{"id":"` + item.mslist + `","text":"` + item.mslist + `", "selected":"` + item.selected + `"}`;
                                }
                            }));
                            if (mulResult != "[")
                                mulResult += "]}]";
                            else if (mulResult == "[")
                                mulResult = "";
                            return {
                                results: $.parseJSON(mulResult)
                            };
                        }
                        else {
                            var cutMsg = eval(callParent('lcm[0]'));
                            return { results: "", noResults: cutMsg };
                        }
                    }
                    else {
                        var cutMsg = eval(callParent('lcm[0]'));
                        return { results: "", noResults: cutMsg };
                    }
                }
            }
        },
        tags: "true",
        placeholder: 'Search for a repository',
        minimumInputLength: 0,
        templateResult: function (data, container) {
            if (data.element) {
                return data.text;
            }
            if (data.children) {
                if (igr > 1)
                    $('#' + fldNameMs).data("select2")?.$dropdown.find('ul.select2-results__options:eq(0)').addClass('d-flex justify-content-between');
                igr++;
            }
            return data.text;
        },
        closeOnSelect: false
    }).on('select2:select', function (event) {
        let fldMulValue = $(this).val();
        if (typeof $(this).data("sep") != "undefined") {
            let separator = $(this).data("sep");
            fldMulValue = fldMulValue.join(separator);
        }

        var fName = GetFieldsName(fldNameMs);
        var fldIndex = $j.inArray(fName, FNames);

        if (fldIndex == -1)
            return;
        if (typeof $("#" + fldNameMs).attr('disabled') != "undefined")
            return;
        if (FFieldReadOnly[fldIndex] == "True")
            return;
        if (FFieldHidden[fldIndex] == "True")
            return;

        var acFrNo = GetFieldsDcNo(fldNameMs);
        var rowNum = GetDbRowNo(GetFieldsRowNo(fldNameMs), acFrNo);
        $(this).attr("data-selected", fldMulValue);
        UpdateFieldArray(fldNameMs, rowNum, fldMulValue, "parent", "AutoComplete");
        UpdateAllFieldValues(fldNameMs, fldMulValue);
        setTimeout(function () {
            MainBlur($j("#" + fldNameMs));
        }, 0);
    }).on("select2:unselect", function (e) {
        let fldNamesf = $(this).attr("id");
        let fldMulValue = $(this).val();
        if (typeof $(this).data("sep") != "undefined") {
            let separator = $(this).data("sep");
            fldMulValue = fldMulValue.join(separator);
        }
        var acFrNo = GetFieldsDcNo(fldNamesf);
        var rowNum = GetDbRowNo(GetFieldsRowNo(fldNamesf), acFrNo);
        $(this).attr("data-selected", fldMulValue);
        UpdateFieldArray(fldNamesf, rowNum, fldMulValue, "parent", "AutoComplete");
        UpdateAllFieldValues(fldNamesf, fldMulValue);
        if (fldMulValue == "")
            AxOldValue = " ";
        //else
        //    AxOldValue = fldMulValue;
        MainBlur($j("#" + fldNamesf));
    }).on('select2:open', function (e) {
        const evt = "scroll.select2";
        $(e.target).parents().off(evt);
        $(window).off(evt);

        if (select2IsFocused) {
            select2EventType = "tab";
        }
        else {
            select2IsOpened = true;
            select2EventType = "click";
        }
        $(".select2-results a.fsautorefresh").remove();
        $(".select2-results a[id*=addOption]").remove();
    });
}

function GetMultiSelectPageData(fldNameMs, value, curPageNo, AutPageSize) {
    var includeDcs = "";
    if (arrRefreshDcs.length > 0) {
        for (var i = 0; i < arrRefreshDcs.length; i++) {
            var arrDcNos = arrRefreshDcs[i].split(':');
            includeDcs = arrDcNos[1].replace("dc", "") + ',' + arrDcNos[0].replace("dc", "");
        }
    }
    value = CheckSpecialCharsInStr(value);
    var fldDcNo = GetFieldsDcNo(fldNameMs);

    AxActiveRowNo = parseInt(GetFieldsRowNo(fldNameMs), 10);
    AxActiveRowNo = GetDbRowNo(AxActiveRowNo, fldDcNo);
    var activeRow = AxActiveRowNo;

    var parStr = "";
    if (AxActivePRow != "" && AxActivePDc != "")
        parStr = AxActivePDc + "♠" + AxActivePRow;

    var subStr = "";
    if (IsParentField(fldNameMs, fldDcNo))
        subStr = GetSubGridInfoForParent(fldDcNo, AxActiveRowNo);
    return curPageNo.toString() + "~" + AutPageSize.toString() + "~" + fldDcNo + "~" + activeRow + "~" + parStr + "~" + subStr + "~" + includeDcs;
}

function AxGetCustSelectFldData(fieldId) {
    var optionValues = "";
    var fastdll = $("#" + fieldId).hasClass('fastdll');
    var pageData = GetAutoCompData(fieldId, "", 1, 1000);
    var fieldName = fieldId.substring(0, fieldId.lastIndexOf("F") - 3);
    var parentFldVal = "";
    if (typeof wsPerfEnabled != "undefined" && wsPerfEnabled)
        parentFldVal = ISBoundAutoCom(fieldName, fieldId);
    else
        parentFldVal = ISBoundNew(fieldName, fieldId);
    let fldApiInd = GetFieldIndex(fieldName);
    let isApifld = FldIsAPI[fldApiInd];
    $.ajax({
        url: 'tstruct.aspx/GetAutoCompleteData',
        type: 'POST',
        cache: false,
        async: false,
        data: JSON.stringify({
            tstDataId: tstDataId, FldName: fieldName, FltValue: "", ChangedFields: ChangedFields, ChangedFieldDbRowNo: ChangedFieldDbRowNo,
            ChangedFieldValues: ChangedFieldValues, DeletedDCRows: DeletedDCRows, pageData: pageData, fastdll: fastdll, fldNameAc: fieldId, refreshAC: false,
            pickArrow: false, parentsFlds: parentFldVal, rfSave: true, IsApiFld: isApifld, tblSourceParams: ""
        }),
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            try {
                var result = data.d.toString().replace(new RegExp("\\n", "g"), "");
                if (result != "") {
                    result = result.split("*♠*")[0];
                }
                if (CheckSessionTimeout(result))
                    return;
                result = result.toString().replace(new RegExp("\\t", "g"), "&#9;");
                ChangedFields = new Array();
                ChangedFieldDbRowNo = new Array();
                ChangedFieldValues = new Array();
                DeletedDCRows = new Array();
                if (!(result.toLowerCase().includes("access violation") && result.toLowerCase().includes("asbtstruct.dll"))) {
                    optionValues = result;
                }
                else {
                    AxWaitCursor(false);
                    ShowDimmer(false);
                    showAlertDialog("error", "Access Violation");
                }
            }
            catch (exception) {
                AxWaitCursor(false);
                ShowDimmer(false);
                showAlertDialog("error", exception.message);
            }
        },
        error: function (error) {
            AxWaitCursor(false);
            ShowDimmer(false);
            showAlertDialog("error", error);
        }
    })
    return optionValues;
}

