var dtAssoc = [];
var isAutocomBlur = true;
$j(function () {
    $(".fastAutocompl").autocomplete({
        minLength: 1,
        selectFirst: true,
        autoFocus: true,
        source: function (request, response) {
            fldName = $(this.element).attr('id');
            $("#" + fldName).next().removeClass("hide");

            $j.ajax({
                url: 'tstruct.aspx/GetFilterFastData',
                type: 'POST',
                cache: false,
                async: true,
                data: JSON.stringify({ SessKey: tstDataId, FldName: fldName, FldValue: "", fltValue: request.term }),
                dataType: 'json',
                contentType: "application/json",
                success: function (data) {
                    dtAssoc = $j.parseJSON(data.d);
                    response($.map(dtAssoc, function (item) {
                        return {
                            label: item.Item, value: item.Value
                        }
                    }))
                }
            });
        },

        open: function (event, ui) {
            var fldName = $(this).attr('id');
            var dialog = $(this).closest('.ui-dialog');
            if (dialog.length > 0) {
                $('.ui-autocomplete.ui-front').zIndex(dialog.zIndex() + 1);
            }
        },
        focus: function (event, ui) {
            return false;
        },
        select: function (event, ui) {
            dtAssoc = [];
            var fldName = $(this).attr('id');
            $(this).val(ui.item.label);
            return false;
        }
    });
});

var AutPageNo = 1, AutPageSize = 50, rcount = 0, fetchRCount = FetchPickListRows || 1000; PageCount = 0;
var CangefldName = '', isNavigation = false, refreshAC = false, pickarrow = false;
$(function () {
    createAutoComplete(".fldAutocomplete");

    $(document).on('mouseenter', '.fldAutocomplete', function () {
        if ($(this).attr("readonly") != undefined) {
            $(this).parent().find('.autoclear,.edit').hide();
        }
    });
    if (!jQBrowser.msie) {
        $(document).on('blur', '.fldAutocomplete', function () {
            const elem = $(this);
            if (elem.data("uiAutocomplete"))
                elem.autocomplete("close");
        })
    }
});

function removeClickEvents(fldNameAc, preasentAutoId) {
    $(document).off("click", "[data-ids = '" + fldNameAc + "']");
    $(document).off("click", "#autoleft" + fldNameAc);
    $(document).off("click", "#autoright" + fldNameAc);
    $(document).off("click", "#autorefresh" + fldNameAc);
}

function clickEvents(fldNameAc, preasentAutoId) {
    $(document).on("click", "[data-ids = '" + fldNameAc + "']", function () {
        var presentFldName = $(this).attr("id");
        $j("#hdnPickFldId").val(presentFldName);
        try {
            $("#" + fldNameAc).autocomplete('close');
        } catch (ex) { }
        $("#" + fldNameAc).removeClass('autoComSelWithTab');
        CallSearchOpen();
    });

    $(document).on("click", "#autoleft" + fldNameAc, function () {
        isNavigation = true;
        pickarrow = true;
        AutPageNo--;
        $("#" + preasentAutoId + " #autoright" + fldNameAc).prop("disabled", false).removeClass("disabled");
        if (AutPageNo == 1) {
            $("#" + preasentAutoId + " #autoleft" + fldNameAc).prop("disabled", true).addClass("disabled");
        }
        var presentFldName = $(this).data("fldname");
        $("#" + presentFldName).focus().autocomplete("search", $("#" + presentFldName).val());
    });

    $(document).on("click", "#autoright" + fldNameAc, function () {
        isNavigation = true;
        pickarrow = true;
        AutPageNo++;
        $("#" + preasentAutoId + " #autoleft" + fldNameAc).prop("disabled", false).removeClass("disabled");
        if (PageCount <= AutPageNo) {
            $("#" + preasentAutoId + " #autoright" + fldNameAc).prop("disabled", true).addClass("disabled");
        }
        var presentFldNamer = $(this).data("fldname");
        $("#" + presentFldNamer).focus().autocomplete("search", $("#" + presentFldNamer).val());
    });

    $(document).on("click", "#autorefresh" + fldNameAc, function () {
        refreshAC = true;
        AutPageNo = 1;
        rcount = 0;
        CangefldName = '';
        PageCount = 0;
        var presentFldNamer = $(this).data("refresh");
        $("#" + presentFldNamer).focus().autocomplete("search", $("#" + presentFldNamer).val());
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

function createAutoComplete(fld) {
    var position = {
        my: "left top",
        at: "left bottom"
    };
    if ($("body").hasClass("btextDir-rtl")) {
        position = {
            my: "right top",
            at: "right bottom"
        }
    }

    var depFldName = "";
    callBackFunDtls = "createAutoComplete♠" + fld;

    const autoComFlds = $(fld);
    autoComFlds.each(function () {
        const presAutoCom = $(this);
        if (presAutoCom.data("uiAutocomplete")) {
            presAutoCom.autocomplete("destroy")
        }
    })

    autoComFlds.autocomplete({
        //delay: 600,
        minLength: 0,
        selectFirst: true,
        autoFocus: true,
        appendTo: ".dvheightframe",
        source: function (request, response) {
            var fastdll = $(this.element).hasClass('fastdll');
            var isrefreshsave = $(this.element).hasClass('isrefreshsave');
            fldNameAc = $(this.element).attr('id');
            if ((request.term.length > 2 && fastdll == false) || request.term.length == 0 || fastdll == true) {
                if ($(this.element).parent().hasClass("opened")) {
                    return;
                }
                if (performFastSearch) {
                    if (!$("#" + fldNameAc).hasClass('blurme'))
                        $(this.element).parent().addClass("opened");
                    if (CangefldName != fldNameAc) {
                        AutPageNo = 1;
                        rcount = 0;
                        CangefldName = fldNameAc;
                    }
                    if (!isNavigation)
                        AutPageNo = 1;
                    isNavigation = false;
                    $("#" + fldNameAc).next().removeClass("hide");
                    var pageData = GetAutoCompData(fldNameAc, request.term, AutPageNo, AutPageSize);
                    var fieldName = fldNameAc.substring(0, fldNameAc.lastIndexOf("F") - 3);
                    var parentFldVal = "";
                    if (typeof wsPerfEnabled != "undefined" && wsPerfEnabled)
                        parentFldVal = ISBoundAutoCom(fieldName, fldNameAc);
                    else
                        parentFldVal = ISBoundNew(fieldName, fldNameAc);
                    let fldApiInd = GetFieldIndex(fieldName);
                    let isApifld = FldIsAPI[fldApiInd];
                    GetProcessTime();
                    if ($j.inArray(fieldName, sourceAcMetaJsonFlds) > -1) {
                        $("#" + fldNameAc).parent().removeClass("opened eventFiredWhileLoading");
                        var fldsourceIndex = $j.inArray(fieldName, sourceAcMetaJsonFlds);
                        var fdmJson = fldSourceAcMetaJson[fldsourceIndex].data;
                        var aSearch = [];
                        aSearch = fdmJson.split(',');
                        $("#" + fldNameAc).data("rowcount", aSearch.length);
                        if (aSearch.length != 0) {
                            response($.map(aSearch, function (item) {
                                item = item.replace(/\^\^dq/g, '"');
                                return {
                                    label: item, value: '', dep: ''
                                }
                            }))
                        }
                        if ($("#" + fldNameAc).hasClass("clickedOnTab")) {
                            $("#" + fldNameAc).removeClass("clickedOnTab").addClass("newValueReturned");
                        }
                    } else {
                        $.ajax({
                            url: 'tstruct.aspx/GetAutoCompleteData',
                            type: 'POST',
                            cache: false,
                            async: true,
                            data: JSON.stringify({
                                tstDataId: tstDataId, FldName: fieldName, FltValue: request.term, ChangedFields: ChangedFields, ChangedFieldDbRowNo: ChangedFieldDbRowNo,
                                ChangedFieldValues: ChangedFieldValues, DeletedDCRows: DeletedDCRows, pageData: pageData, fastdll: fastdll, fldNameAc: fldNameAc, refreshAC: refreshAC,
                                pickArrow: pickarrow, parentsFlds: parentFldVal, rfSave: isrefreshsave, IsApiFld: isApifld
                            }),
                            dataType: 'json',
                            contentType: "application/json",
                            success: function (data) {
                                refreshAC = false;
                                $("#" + fldNameAc).parent().removeClass("opened eventFiredWhileLoading");
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
                                        //    if (result.toLowerCase().indexOf("access violation") === -1) {
                                        var serResult = $.parseJSON(result);
                                        if (serResult.error) {
                                            ExecErrorMsg(serResult.error, "autocomplete");
                                            return;
                                        }
                                        var rcountNew = serResult.pickdata[0].rcount;
                                        depFldName = serResult.pickdata[2].dfname;
                                        AutoFillFlds[fieldName] = depFldName;
                                        if ($("#" + fldNameAc).hasClass('blurme')) {
                                            isAutoComSelected = true;
                                            $("#" + fldNameAc).removeClass('blurme').removeClass("autoComSelWithTab");//.trigger("blur");
                                            MainBlur($j($("#" + fldNameAc)));
                                            //AxWaitCursor(false);
                                            //ShowDimmer(false);
                                            return;
                                        }
                                        if (rcountNew != 0)
                                            rcount = parseInt(rcountNew);
                                        dtAssoc = serResult.pickdata[3].data;
                                        if (dtAssoc != undefined && dtAssoc.length != 0) {
                                            if (fastdll) {
                                                var aSearch = [];
                                                $(dtAssoc).each(function (iIndex, sElement) {
                                                    sElement.i = sElement.i.replace(/\^\^dq/g, '"');
                                                    if (sElement.i.toLowerCase().indexOf(request.term.toLowerCase()) >= 0) {
                                                        aSearch.push(sElement);
                                                    }
                                                });
                                                $("#" + fldNameAc).data("rowcount", aSearch.length);
                                                if (aSearch.length != 0) {
                                                    response($.map(aSearch, function (item) {
                                                        item.i = item.i.replace(/\^\^dq/g, '"');
                                                        return {
                                                            label: item.i, value: item.v, dep: item.d
                                                        }
                                                    }))
                                                    //as sabarish side dropdown values should show all the values in autocomplete, ticket is from Bizops (BIZ000210	)
                                                    //response($.map(aSearch.slice(0, 100), function (item) {
                                                    //    item.i = item.i.replace(/\^\^dq/g, '"');
                                                    //    return {
                                                    //        label: item.i, value: item.v, dep: item.d
                                                    //    }
                                                    //}))
                                                }
                                                else {
                                                    var cutMsg = eval(callParent('lcm[0]'));
                                                    var result = [{ label: cutMsg, value: "NO1234567890", dep: cutMsg }];
                                                    response(result);
                                                }
                                            }
                                            else {
                                                response($.map(dtAssoc, function (item) {
                                                    item.i = item.i.replace(/\^\^dq/g, '"');
                                                    return {
                                                        label: item.i, value: item.v, dep: item.d
                                                    }
                                                }))
                                            }
                                        }
                                        else {
                                            var cutMsg = eval(callParent('lcm[0]'));
                                            var result = [{ label: cutMsg, value: "NO1234567890" }];
                                            response(result);
                                        }
                                    }
                                    else {
                                        isAutoComSelected = true;
                                        AxWaitCursor(false);
                                        ShowDimmer(false);
                                        $("#reloaddiv").show();
                                        $("#dvlayout").hide();
                                    }


                                    if ($("#" + fldNameAc).hasClass("clickedOnTab")) {
                                        $("#" + fldNameAc).removeClass("clickedOnTab").addClass("newValueReturned");
                                    }

                                }

                                catch (exception) {
                                    $(this).removeClass('autoComSelWithTab');
                                    isAutoComSelected = true;
                                    $("#" + fldNameAc).parent().removeClass("opened eventFiredWhileLoading");
                                    if ($("#" + fldNameAc).hasClass("clickedOnTab")) {
                                        $("#" + fldNameAc).removeClass("clickedOnTab").addClass("newValueReturned");
                                    }
                                    if (exception.message.toLowerCase().indexOf("access violation") != -1) {
                                        AxWaitCursor(false);
                                        ShowDimmer(false);
                                        $("#reloaddiv").show();
                                        $("#dvlayout").hide();
                                    }
                                }
                            },
                            error: function (error) {
                                $(this).removeClass('autoComSelWithTab');
                                isAutoComSelected = true;
                                $("#" + fldNameAc).parent().removeClass("opened eventFiredWhileLoading");
                                if (error.toLowerCase().indexOf("access violation") != -1) {
                                    AxWaitCursor(false);
                                    ShowDimmer(false);
                                    $("#reloaddiv").show();
                                    $("#dvlayout").hide();
                                }
                                return false;
                            }
                        })
                    }
                }
            }
            else {
                $(this).removeClass('autoComSelWithTab');
                isAutoComSelected = true;
                this.menu.element.html("");
                rcount = 0;
                var result = [{ label: "Required to search minimum 3 characters", value: "", dep: "" }];
                response(result);
            }
        },
        position: position,
        open: function (event, ui) {
            refreshAC = false;
            pickarrow = false;
            var preasentAutoId = $(this).data('ui-autocomplete').menu.element.attr('id');
            var fldwidth = $(this).outerWidth();
            var leftOfUl = $("#" + preasentAutoId).offset().left + "px";

            var isPopupAutoComp = false;
            var topOfUl = 0;
            if (AxpGridForm == "popup" && $('#bootstrapModal:visible').length) {
                isPopupAutoComp = true;
            }
            if (!$(".dvheightframe").hasScrollBar() && isPopupAutoComp) {
                //$("#" + preasentAutoId).css('position', 'fixed');
                topOfUl = ($("#" + preasentAutoId)[0].offsetTop + $("#" + preasentAutoId)[0].offsetHeight) + "px";
            } else {
                topOfUl = ($("#" + preasentAutoId)[0].offsetTop + $("#" + preasentAutoId)[0].offsetHeight + $(".dvheightframe")[0].offsetTop) - $(".dvheightframe")[0].scrollTop + "px";
            }
            var widthOfUl = isMobile == true ? fldwidth + "px" : $("#" + preasentAutoId)[0].offsetWidth + "px";
            $("#" + preasentAutoId).append("<li class='autoComFooter' style='float: left;z-index:999999;width:" + widthOfUl + " ;position: fixed;top: " + topOfUl + ";left:" + leftOfUl + ";'>" + $("#autoadv" + fldNameAc).html() + "</li>");
            if (!$(".dvheightframe").hasScrollBar() && isPopupAutoComp) {
                $("#" + preasentAutoId).find(".name").css({ 'position': 'absolute' }).parent().css({ "top": "initial" });
            }
            rcount = rcount < fetchRCount ? rcount : fetchRCount;
            PageCount = Math.ceil(rcount / AutPageSize);
            PageCount == 0 ? PageCount = 1 : "";
            countPerPage = rcount;
            if (isMobile)
                $("#" + preasentAutoId).css({ "width": fldwidth + "px" }).addClass("acOpen");
            if (AutPageNo == 1) {
                if (PageCount == 1) {
                    $("#" + preasentAutoId + " #autoleft" + fldNameAc).prop("disabled", true).addClass("disabled");
                    $("#" + preasentAutoId + " #autoright" + fldNameAc).prop("disabled", true).addClass("disabled");
                } else {
                    $("#" + preasentAutoId + " #autoleft" + fldNameAc).prop("disabled", true).addClass("disabled");
                }
            }
            else if (AutPageNo > 1 && PageCount <= AutPageNo)
                $("#" + preasentAutoId + " #autoright" + fldNameAc).prop("disabled", true).addClass("disabled");

            if ($(this).data("rowcount") == 0) {
                $("#" + preasentAutoId + " #autorefresh" + fldNameAc).prop("disabled", true).addClass("disabled");
            }
            removeClickEvents(fldNameAc, preasentAutoId);
            clickEvents(fldNameAc, preasentAutoId);
            createScrollEvent("bind", preasentAutoId);
            createLeftRightEvents("bind", preasentAutoId);
            var presAutFld = $("#" + preasentAutoId);
            var scrollFrame = $('.dvheightframe');
            var presAutFldHt = presAutFld.offset().top + presAutFld.outerHeight();
            var scrolFrameHt = $('.dvheightframe').outerHeight();
            if (presAutFldHt > scrolFrameHt)
                scrollFrame.scrollTop((scrollFrame.scrollTop()) + (presAutFldHt - scrolFrameHt));
            //var fldRtlAlign = $("#autoadv" + fldNameAc).closest(".grid-stack-item, .edit-mode-content").hasClass("btextDir-rtl");
            var fldRtlAlign = $("body").hasClass("btextDir-rtl");
            if (fldRtlAlign) {
                $("#" + preasentAutoId).find("li").css("text-align", "right");
                $("#" + preasentAutoId).find(".reload,.leftico").css("float", "right");
                $("#" + preasentAutoId).find(".rightico").css("float", "left");
            }
            else {
                //$("#" + preasentAutoId).find("li").css("text-align", "left");
                $("#" + preasentAutoId).find("li").css("text-align", "left");
                $("#" + preasentAutoId).find(".reload,.leftico").css("float", "left");
                $("#" + preasentAutoId).find(".rightico").css("float", "right");
            }
        },
        close: function (event, ui) {
            refreshAC = false;
            createLeftRightEvents("unbind");
            createScrollEvent("unbind");
            const ulListId = $(this).data('ui-autocomplete').menu.element.attr('id');
            $("#" + ulListId).removeClass("acOpen").html("");
            $(".ui-helper-hidden-accessible").html("");
            return false;
        },
        focus: function (event, ui) {
            isAutoComSelWithTab = false;
            var focusedFooterIcn = $(this).data('ui-autocomplete').menu.element.find('.autoComFooter .glyphicon.footerActive')
            if (focusedFooterIcn.length > 0)
                focusedFooterIcn.removeClass('footerActive');
            return false;
        },
        select: function (event, ui) {
            isAutoComSelWithTab = true;
            refreshAC = false;
            isGrdEditDirty = true;
            dtAssoc = [];
            var fldNameAc = $(this).attr('id');
            var fldAcValue = "";
            var cutMsg = eval(callParent('lcm[0]'));
            if (ui.item.label != cutMsg && ui.item.value != "NO1234567890" && ui.item.label != "Required to search minimum 3 characters") {
                $(this).val(ui.item.label);
                fldAcValue = ui.item.label;
            }
            else
                $(this).val('');

            var rcID = GetFieldsRowFrameNo(fldNameAc);
            var acFrNo = GetFieldsDcNo(fldNameAc);
            var rowNum = GetDbRowNo(GetFieldsRowNo(fldNameAc), acFrNo);
            var fldRowNo = GetFieldsRowNo(fldNameAc)
            //if (IsDcGrid(acFrNo) && isGrdEditDirty && !axInlineGridEdit)//Refer Bug:AGI004107
            if (IsDcGrid(acFrNo) && isGrdEditDirty)//Refer Bug:AGI004885
                UpdateFieldArray(axpIsRowValid + acFrNo + fldRowNo + "F" + acFrNo, GetDbRowNo(fldRowNo, acFrNo), "", "parent", "AddRow");
            UpdateFieldArray(fldNameAc, rowNum, fldAcValue, "parent", "AutoComplete");

            if (ui.item.dep != undefined && ui.item.dep != cutMsg) {
                try {
                    //dep = uhid^patient_details^attending_physician~76222000000431^wardtype~Single Room
                    var depText = ui.item.dep.split('^');
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
                        if (depfldValue != undefined)
                            UpdateFieldArray(depfldId + rcID, rowNum, depfldValue, "parent", "AutoComplete");
                    });
                } catch (Ex) { }
            }
            $(this).addClass("newValueReturned");
            $(this).removeClass('autoComSelWithTab');
            isAutoComSelected = true;
            return false;
        },
        search: function (event, ui) {
            if (isAutocomBlur) {
                isAutocomBlur = false;
                GetCurrentTime("Tstruct autocomplete search (ws call)");
            }
            if ($(this).parent().hasClass("eventFiredWhileLoading"))
                event.preventDefault();
            var fastdll = $(this).hasClass('fastdll');
            $(this).addClass('autoComSelWithTab');
            if (fastdll) {
                isAutoComSelected = false;
                $(this).autocomplete("option", "delay", 300);
            }
            else {
                isAutoComSelected = false;
                $(this).autocomplete("option", "delay", 600);
            }
        }
    });

    $(".autoinputtxtclear").click(function (e) {
        isAutoComSelected = true;
    });

    $(".autoClickddl").off('click');
    $(".autoClickddl").click(function (e) {
        performFastSearch = true;
        var presentFldNamer = $(this).attr("data-clk");
        if ($("#" + presentFldNamer).val() != "")
            $("#" + presentFldNamer).val('');
        $("#" + presentFldNamer).focus().autocomplete("search", $("#" + presentFldNamer).val());
    });

    $(".fldAutocomplete").off('keydown.fldA');
    $(".fldAutocomplete").on("keydown.fldA", function (event) {
        performFastSearch = true;
        if ($(this).parent().hasClass("opened")) {
            $(this).parent().addClass("eventFiredWhileLoading");
            event.preventDefault();
        } else {
            if (event.keyCode === 9) {
                //case -1 entered text is empty then we should allow to go to next field
                //case 2 user didnt enter anything simply came and went then control should go to next field
                //case 3 user entered text then the control should be there only so that user has to select one value
                const presAutoFldElem = $(this);
                if (presAutoFldElem.hasClass("newValueReturned")) {
                    presAutoFldElem.removeClass("newValueReturned");
                } else {
                    const presAutoFldValue = presAutoFldElem.val();

                    if (presAutoFldValue !== "") {
                        if (AxOldValue !== presAutoFldValue) {
                            event.preventDefault();
                            $(this).addClass("clickedOnTab");
                        }
                    }
                }
                if (event.keyCode == 9 && !event.shiftKey) {
                    var tabFldId = $(this);
                    var curFldTabOrder = $(tabFldId).closest("[class*=fldindex]").data("dataindex");
                    var TabFldDc = $(tabFldId).attr("id").substring($(tabFldId).attr("id").lastIndexOf("F") + 1, $(tabFldId).attr("id").length);
                    var listDivTabOrder = [];
                    $(tabFldId).closest("#divDc" + TabFldDc).find(".rowDUMMY").find("[class*=fldindex]").each(function (ind, val) {
                        listDivTabOrder.push($(this).data("dataindex"));
                    });
                    if (listDivTabOrder.length > 0) {
                        listDivTabOrder.sort(function (a, b) { return a - b });
                        $.each(listDivTabOrder, function (i, indTabOr) {
                            if (curFldTabOrder < indTabOr) {
                                var NextFldId = $j(tabFldId).closest("#divDc" + TabFldDc).find("[data-dataindex=" + indTabOr + "]").find("input:not([id=searstr],[class=AxAddRows],[class=AxSearchField]),select:not([id=selectbox]),textarea:not(#txtCommentWF):not(.labelInp),input[type=checkbox],input[type=checkbox]");
                                if (typeof $("#" + $(NextFldId).attr("id")).attr("disabled") == "undefined" && typeof $("#" + $(NextFldId).attr("id")).attr("readonly") == "undefined") {
                                    if (!$("#" + $(NextFldId).attr("id")).hasClass("fldAutocomplete") && !$("#" + $(NextFldId).attr("id")).hasClass("fldmultiSelect") && isAutoComSelWithTab == false) {
                                        presAutoFldElem.removeClass('autoComSelWithTab');
                                        $("#" + $(NextFldId).attr("id")).focus();
                                    }
                                    else if (isAutoComSelWithTab == false && AxOldValue != presAutoFldElem.val()) {
                                        presAutoFldElem.addClass('autoComSelWithTab');
                                        $("#" + $(NextFldId).attr("id")).focus();
                                    }
                                    else if (isAutoComSelWithTab == false && AxOldValue == presAutoFldElem.val()) {
                                        presAutoFldElem.removeClass('autoComSelWithTab');
                                        $("#" + $(NextFldId).attr("id")).focus();
                                    }
                                    else if ($("#" + $(NextFldId).attr("id")).hasClass("fldmultiSelect")) {
                                        $("#" + $(NextFldId).attr("id")).parent(".dropdown-mul").find(".fldmultiSelectInput").click();
                                    }
                                    else
                                        $("#" + $(NextFldId).attr("id")).focus();
                                    if ((event.shiftKey && event.keyCode == 16) || (event.keyCode == 9) || (event.shiftKey && event.keyCode == 9) || (event.ctrlKey && event.keyCode == 17) || (event.altKey && event.keyCode == 18) || event.keyCode == 20) {
                                        performFastSearch = false;
                                    }
                                    event.preventDefault();
                                    return false;
                                }
                            }
                        });
                    }
                } else if (event.keyCode == 9 && event.shiftKey) {
                    var tabFldId = $(this);
                    var curFldTabOrder = $(tabFldId).closest("[class*=fldindex]").data("dataindex");
                    var TabFldDc = $(tabFldId).attr("id").substring($(tabFldId).attr("id").lastIndexOf("F") + 1, $(tabFldId).attr("id").length);
                    var listDivTabOrder = [];
                    $(tabFldId).closest("#divDc" + TabFldDc).find(".rowDUMMY").find("[class*=fldindex]").each(function (ind, val) {
                        listDivTabOrder.push($(this).data("dataindex"));
                    });
                    if (listDivTabOrder.length > 0) {
                        listDivTabOrder.sort(function (a, b) { return a - b }).reverse();
                        $.each(listDivTabOrder, function (i, indTabOr) {
                            if (curFldTabOrder > indTabOr) {
                                var NextFldId = $j(tabFldId).closest("#divDc" + TabFldDc).find("[data-dataindex=" + indTabOr + "]").find("input:not([id=searstr],[class=AxAddRows],[class=AxSearchField]),select:not([id=selectbox]),textarea:not(#txtCommentWF):not(.labelInp),input[type=checkbox],input[type=checkbox]");
                                if (typeof $("#" + $(NextFldId).attr("id")).attr("disabled") == "undefined" && typeof $("#" + $(NextFldId).attr("id")).attr("readonly") == "undefined") {
                                    if (!$("#" + $(NextFldId).attr("id")).hasClass("fldAutocomplete") && !$("#" + $(NextFldId).attr("id")).hasClass("fldmultiSelect") && isAutoComSelWithTab == false) {
                                        presAutoFldElem.removeClass('autoComSelWithTab');
                                        $("#" + $(NextFldId).attr("id")).focus();
                                    }
                                    else if (isAutoComSelWithTab == false && AxOldValue != presAutoFldElem.val()) {
                                        presAutoFldElem.addClass('autoComSelWithTab');
                                        $("#" + $(NextFldId).attr("id")).focus();
                                    }
                                    else if (isAutoComSelWithTab == false && AxOldValue == presAutoFldElem.val()) {
                                        presAutoFldElem.removeClass('autoComSelWithTab');
                                        $("#" + $(NextFldId).attr("id")).focus();
                                    }
                                    else if ($("#" + $(NextFldId).attr("id")).hasClass("fldmultiSelect")) {
                                        $("#" + $(NextFldId).attr("id")).parent(".dropdown-mul").find(".fldmultiSelectInput").click();
                                    }
                                    else
                                        $("#" + $(NextFldId).attr("id")).focus();
                                    if ((event.shiftKey && event.keyCode == 16) || (event.keyCode == 9) || (event.shiftKey && event.keyCode == 9) || (event.ctrlKey && event.keyCode == 17) || (event.altKey && event.keyCode == 18) || event.keyCode == 20) {
                                        performFastSearch = false;
                                    }
                                    event.preventDefault();
                                    return false;
                                }
                            }
                        });
                    }
                }
                return
            }

            if (event.keyCode !== 38 && event.keyCode !== 40) {
                if ($(this).data("uiAutocomplete"))
                    $(this).autocomplete("close")
            }
            if (event.keyCode == 13) {
                var fld = $(this);
                if (fld.attr("readonly") == undefined && $("#axpertPopupWrapper").length == 0) {
                    var ulElem = fld.data('ui-autocomplete').menu.element;
                    var footerActElem = fld.data('ui-autocomplete').menu.element.find('.autoComFooter .glyphicon.footerActive');
                    if (footerActElem.length == 0 && fld.val() == "")
                        fld.focus().autocomplete("search", fld.val());
                    else if (footerActElem.length !== 0)
                        footerActElem.click();
                }
            } else if ((event.shiftKey && event.keyCode == 16) || (event.keyCode == 9) || (event.shiftKey && event.keyCode == 9) || (event.ctrlKey && event.keyCode == 17) || (event.altKey && event.keyCode == 18) || event.keyCode == 20) {
                performFastSearch = false;
            }
        }
    });

    $(".fldavdsearch").off('click.fldAS');
    $(".fldavdsearch").on("click.fldAS", function (event) {
        const fldId = $(this).parents(".autoinput-parent").find('input.ui-autocomplete-input').attr("id");
        $j("#hdnPickFldId").val(`img~${fldId}`);
        //isAutoComSelected = true;
        $("#" + fldId).removeClass('autoComSelWithTab');
        CallSearchOpen();
    });

}

function createScrollEvent(task, ulId) {
    if (task == "bind") {
        var tpOfLastLi = 0;
        $(".dvheightframe").off('scroll.autoScroll').on('scroll.autoScroll', function () {
            var scrlTp = $(".dvheightframe")[0].scrollTop;
            //tpOfLastLi = $("#" + ulId)[0].offsetHeight + $("#" + ulId)[0].offsetTop + 88 - scrlTp;
            if (typeof isWizardTstruct != "undefined" && isWizardTstruct)
                tpOfLastLi = $("#" + ulId)[0].offsetHeight + $("#" + ulId)[0].offsetTop - scrlTp;
            else if (isMobile && mobileCardLayout != "none")
                tpOfLastLi = $(".dvheightframe").outerHeight();
            else if (typeof $("#" + ulId)[0] != "undefined")
                tpOfLastLi = $("#" + ulId)[0].offsetHeight + $("#" + ulId)[0].offsetTop + 100 - scrlTp;
            $("#" + ulId + " li.autoComFooter").css("top", (tpOfLastLi + "px"));
        })
    } else {
        $(".dvheightframe").off('scroll.autoScroll');
    }

}

function createLeftRightEvents(task, ulId) {
    $(document).off('keydown.lrEvents');
    if (task == "unbind") {
        isAutoComSelected = true;
        return false;
    }
    $(document).on('keydown.lrEvents', function (e) {
        var footerActiveElem = $("#" + ulId + " .autoComFooter .name .glyphicon.footerActive");
        var activeLi = $("#" + ulId).data('ui-menu').active;
        activeLi ? activeLi = activeLi.find('div') : activeLi = $("#" + ulId + " li:first div");
        if (e.keyCode == 37) {
            //left key
            if (footerActiveElem.length == 0) {

                $("#" + ulId + " li div.ui-state-active").removeClass('ui-state-active');
                $("#" + ulId + " .autoComFooter .name div").last().find('.glyphicon').addClass('footerActive');
            } else {
                if (footerActiveElem.hasClass('pickimg')) {
                    var previousElem = footerActiveElem.parent().prev().find('.glyphicon').last();
                    if (previousElem.is(":disabled")) {
                        if (previousElem.prev().is(':disabled')) {
                            footerActiveElem.removeClass('footerActive');
                            activeLi.addClass('ui-state-active');
                        } else {
                            footerActiveElem.removeClass('footerActive');
                            previousElem.prev().addClass('footerActive');
                        }

                    } else {
                        footerActiveElem.removeClass('footerActive');
                        previousElem.addClass('footerActive');
                    }
                } else if (footerActiveElem.parent().hasClass('reload')) {
                    footerActiveElem.removeClass('footerActive');
                    activeLi.addClass('ui-state-active');

                } else if (footerActiveElem.parent().hasClass('leftico')) {
                    if (footerActiveElem.index() == 0) {
                        footerActiveElem.removeClass('footerActive');
                        activeLi.addClass('ui-state-active');

                    } else {
                        var previousElem = footerActiveElem.prev();
                        if (previousElem.is(":disabled")) {
                            footerActiveElem.removeClass('footerActive');
                            activeLi.addClass('ui-state-active');

                        } else {
                            footerActiveElem.removeClass('footerActive');
                            previousElem.addClass('footerActive');
                        }
                    }
                }
                else if (footerActiveElem.parent().hasClass('addOption')) {
                    footerActiveElem.removeClass('footerActive');
                    previousElem.addClass('footerActive');
                }
            }


        } else if (e.keyCode == 39) {
            if (footerActiveElem.length == 0) {

                $("#" + ulId + " li div.ui-state-active").removeClass('ui-state-active');
                $("#" + ulId + " .autoComFooter .name div").first().find('.glyphicon:not(":disabled")').first().addClass('footerActive');
            } else {
                if (footerActiveElem.parent().hasClass('reload')) {
                    footerActiveElem.removeClass('footerActive');
                    footerActiveElem.parent().next().find('.pickimg').addClass('footerActive');
                } else if (footerActiveElem.hasClass('pickimg')) {
                    footerActiveElem.removeClass('footerActive');

                    activeLi.addClass('ui-state-active');
                } else if (footerActiveElem.parent().hasClass('leftico')) {
                    if (footerActiveElem.index() == 1 || footerActiveElem.next().is(':disabled')) {
                        footerActiveElem.removeClass('footerActive');
                        footerActiveElem.parent().next().find('.pickimg').addClass('footerActive');
                    } else {
                        footerActiveElem.removeClass('footerActive');
                        footerActiveElem.next().addClass('footerActive');
                    }
                }
                else if (footerActiveElem.parent().hasClass('addOption')) {
                    footerActiveElem.removeClass('footerActive');
                    if (footerActiveElem.parent().next().hasClass('reload'))
                        footerActiveElem.parent().next().find(".glyphicon-repeat").addClass('footerActive');
                    else if (footerActiveElem.parent().next().hasClass('leftico')) {
                        if (!footerActiveElem.parent().next().find('.glyphicon-chevron-left').hasClass("disabled"))
                            footerActiveElem.parent().next().find('.glyphicon-chevron-left').addClass('footerActive');
                        else if (!footerActiveElem.parent().next().find('.glyphicon-chevron-right').hasClass("disabled"))
                            footerActiveElem.parent().next().find('.glyphicon-chevron-right').addClass('footerActive');
                        else if (!footerActiveElem.parent().hasClass("reload"))
                            footerActiveElem.parent().next().next().find('.pickimg').addClass('footerActive');
                    }
                }
            }
        } else if (e.keyCode == 32) {
            //right key
            if (footerActiveElem.length > 0) {
                e.preventDefault();
                e.stopPropagation();
                footerActiveElem.click();
            }

        }
    });
}
$(document).on("mousewheel DOMMouseScroll", ".ui-autocomplete", function (e) {

    var e0 = e.originalEvent;
    var delta = e0.wheelDelta || -e0.detail;

    this.scrollTop += (delta < 0 ? 1 : -1) * 30;
    e.preventDefault();
});

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
    $.ajax({
        url: 'tstruct.aspx/GetAutoCompleteData',
        type: 'POST',
        cache: false,
        async: false,
        data: JSON.stringify({
            tstDataId: tstDataId, FldName: fieldName, FltValue: "", ChangedFields: ChangedFields, ChangedFieldDbRowNo: ChangedFieldDbRowNo,
            ChangedFieldValues: ChangedFieldValues, DeletedDCRows: DeletedDCRows, pageData: pageData, fastdll: fastdll, fldNameAc: fieldId, refreshAC: false,
            pickArrow: false, parentsFlds: parentFldVal, rfSave: true
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
                    //var serResult = $.parseJSON(result);
                    //if (serResult.error) {
                    //    ExecErrorMsg(serResult.error, "autocomplete");
                    //    return;
                    //}
                    //var custFldData = serResult.pickdata[3].data;
                    //var custDepFlds = serResult.pickdata[2].dfname;
                    //optionValues = custFldData + "*♦*" + custDepFlds;
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
