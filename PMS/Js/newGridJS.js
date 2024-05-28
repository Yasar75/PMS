var gridClassName = "";
var AxCurrGridRowNo = "";
var editElementObject = "";
var editDivId = "";
var AxEditActiveDcNo = "";
var AxEditActiveRowNo = "";
var isAttachMentExist = false;
var editLayouTmplate = {};
var oldEditValues = "";
//var addRowEnabled = "";
var lastEditAction = "";
var fromNextPrevious = false;
var isGrdEditDirty;
var lastFocusabbleElem;

//Inline grid edit
var inlineShiftKeyPressed = false; //when a row is edit mode - to check which key is pressed(tab key/shift+tab key) -- true if 'shift+tab' key pressed
var focusOnDeleteButton = false; //true, if row has delete option - focus on delete option after row converted to editmode
var divEditClass = "";
var gridDivHtml = {};
var formGridRowDele = {};
var isLoadDataRow = false;

function addTheValuesToGrid(dcNo, elem, trIndexForEdit, onlySave) {
    globalOnlySave = false;
    if (typeof onlySave == "undefined" || onlySave === "") {
        onlySave = false;
    }
    globalOnlySave = onlySave;
    var wrapperForEditFields = "wrapperForEditFields" + dcNo;
    var rowId = $j("#" + wrapperForEditFields + " .editWrapTr").attr('id');
    var deleteRowExists = false;
    var deleteRowHtml = "";

    AxCurrGridRowNo = parseInt(GetFieldsRowNo(rowId), 10);

    //checking for the first field for delete image
    // if ($j("#" + wrapperForEditFields + " .gridtdclass").first().find('a.rowdelete').length > 0) {
    //     deleteRowExists = true;
    //     deleteRowHtml = $j("#" + wrapperForEditFields + " .gridtdclass").first().find('a.rowdelete')[0].outerHTML;

    // }

    var tableHtml = createGridHtmlFromEdit(dcNo);
    // var editDeleteOpts = "<td " + (gridColOptVisibility("uniqueEditDeleteAct", dcNo) || IsTabDc(dcNo) ? "" : "style=\"display:none;\"") + "><a class=\"btn btn-sm btn-icon btn-white btn-color-gray-600 btn-active-primary me-2 shadow-sm gridEditDeleteBtns\" onclick='editTheRow(this," + dcNo + ",\"" + GetFieldsRowNo(rowId) + "\",event);' title=\"Edit\"><span class=\"material-icons material-icons-style material-icons-3\">add</span></a>";
    // if (deleteRowExists)
    //     editDeleteOpts += "<a class=\"btn btn-sm btn-icon btn-white btn-color-gray-600 btn-active-primary me-2 shadow-sm gridEditDeleteBtns\" onclick='DeleteRow(" + dcNo + ", \"" + GetFieldsRowNo(rowId) + 'F' + dcNo + "\",this)' title=\"Delete\"><span class=\"material-icons material-icons-style material-icons-3\">delete</span></a>";
    // editDeleteOpts += "</td>";
    var editDeleteOpts = "<td class=\"text-center\"><span class=\"tem1\"><div class=\"form-check form-check-sm form-check-custom ms-2\"><input class=\"form-check-input border-gray-500 fgChk gridRowChk\" type=\"checkbox\" name=\"grdchkItemTd" + dcNo + "\" id=\"grdchkItemTd" + GetFieldsRowNo(rowId) + "F" + dcNo + "\" onclick=\"javascript:CheckboxGridRow(this," + dcNo + "," + GetFieldsRowNo(rowId) + ",event);\"></div></span></td>";
    var deleteHtml = ""; //"<td style='display:none;'>" + deleteRowHtml + "</td>";
    var rowNoToCheck = "";
    if (trIndexForEdit == undefined || trIndexForEdit === "") {
        var dcClientRows = GetDcClientRows(dcNo);
        var lastRow = dcClientRows.getMaxVal();
        if (lastRow == 0) lastRow = 1;
        var addedRowNum = GetRowNoHelper(lastRow);
        globalClickTheEditRow = addedRowNum;
        rowNoToCheck = addedRowNum;
        //var slNoHtml = '<td ' + (gridColOptVisibility("uniqueThHead", dcNo) || IsTabDc(dcNo) ? "" : "style=\"display:none;\"") + '>' + $j("#" + wrapperForEditFields + " .gridElement").first().find('label')[0].outerHTML + '</td>';
        var slNoHtml = '<td ' + (gridColOptVisibility("uniqueThHead", dcNo) == false ? "style=\"display:none;\"" : (gridColOptVisibility("uniqueThHead", dcNo) || IsTabDc(dcNo)) ? "" : "style=\"display:none;\"") + '><label id="lblSlNo' + GetFieldsRowNo(rowId) + 'F' + dcNo + '" class="form-control w-100 border bg-transparent overflow-hidden resize-none  slno">' + ($j("#gridHd" + dcNo + " tbody tr").length + 1) + '</label></td>';
        $j(".wrapperForGridData" + dcNo + " tbody").append("<tr id='sp" + dcNo + "R" + GetFieldsRowNo(rowId) + "F" + dcNo + "'>" + editDeleteOpts + deleteHtml + slNoHtml + tableHtml + "</tr>");
        //here we create the edit area again  
        isMobileGridRowEdit = false;
        UpdateFieldArray(axpIsRowValid + dcNo + addedRowNum + "F" + dcNo, GetDbRowNo(addedRowNum, dcNo), "", "parent", "AddRow");
        changeEditLayoutIds(addedRowNum, dcNo);
        AddRow(dcNo, "AddRow");
        // isAttachMentExist ? clearTheAttachments(dcNo, addedRowNum) : "";
        checkTableBodyWidths(dcNo);
        if ($j("#wrapperForEditFields" + dcNo + " .addServiceCallMade").length > 0) {
            $j("#wrapperForEditFields" + dcNo + " .addServiceCallMade").removeClass("addServiceCallMade");
        } else {
            ShowDimmer(false);
        }
        AxEditActiveRowNo = parseInt(addedRowNum, 10) + 1;
    } else {
        var gridFrstElem = getFirstFocusElement("#wrapperForEditFields" + dcNo);
        var prevBtn = $("#wrapperForEditFields" + dcNo + " .previousNextEditButton .prevRec");
        var nextBtn = $("#wrapperForEditFields" + dcNo + " .previousNextEditButton .nextRec");
        var lastElem = $("#wrapperForEditFields" + dcNo).find(":focusable:not('button')").last();
        if (lastElem.length == 0) {
            lastElem = $("#wrapperForEditFields" + dcNo).find(":focusable:not('button')");
        }
        var closeBttn = $("#bootstrapModal .modal-header button.close");
        var saveBtn = $("#editUpdateButton" + dcNo);
        var saveNewBtn = $("#newRecordBtn" + dcNo);
        $(gridFrstElem).off('keydown.grdFrstElemKD');
        $(prevBtn).off('keydown.prevBtnKD');
        $(document).off('keydown.cancelBtnKD', "#editCancelButton" + dcNo);
        $(nextBtn).off('keydown.nextElemKD');
        $(lastElem).add(gridFrstElem).off('keydown.lastElemKDandFirstElemKD');
        $("#wrapperForEditFields" + dcNo).off('keydown.shortCutsKD');
        $(closeBttn).off("keydown.closeBttnKD");
        $("#myGridDCAdd" + dcNo).off("keydown.gridDCAdd");
        $(saveNewBtn).off("keydown.saveNewBtnKD");
        $(saveBtn).off("keydown.saveBtnKD");
        $j(".wrapperForGridData" + dcNo + " tbody tr.inEditMode").find('.glyphicon').removeClass('disabled').removeAttr('disabled');
        $j(".wrapperForGridData" + dcNo + " tbody tr.inEditMode").find('.gridEditDeleteBtns').removeClass('disabled').removeAttr('disabled');
        $j(".wrapperForGridData" + dcNo + " tbody tr.inEditMode").removeClass('inEditMode');
        var slNoHtml = '<td ' + ($("#uniqueThHead" + dcNo).is(":visible") || IsTabDc(dcNo) ? "" : "style=\"display:none;\"") + '><label id="lblSlNo' + GetFieldsRowNo(rowId) + 'F' + dcNo + '" class="form-control w-100 border bg-transparent overflow-hidden resize-none  slno">' + (trIndexForEdit + 1) + '</label></td>';
        $j(".wrapperForGridData" + dcNo + " tbody tr").eq(trIndexForEdit).html(editDeleteOpts + deleteHtml + slNoHtml + tableHtml);
        //addRowEnabled ?
        if ($j("#dummyWrapperForEditFields" + dcNo).length > 0) {
            $j("#wrapperForEditFields" + dcNo).replaceWith($j("#dummyWrapperForEditFields" + dcNo).detach());
            $j("#dummyWrapperForEditFields" + dcNo).attr("id", "wrapperForEditFields" + dcNo).removeClass("hide");
            $j("#dummyWrapperForEditFields" + dcNo + " #dummynewRecordBtn" + dcNo).attr("id", "newRecordBtn" + dcNo);
            if (isMobile)
                $j("#dummyWrapperForEditFields" + dcNo + " #dummyEditUpdateButton" + dcNo).attr("id", "editUpdateButton" + dcNo);
        } else {
            $j("#wrapperForEditFields" + dcNo).html(editElementObject);
        }

        UpdateFieldArray(axpIsRowValid + dcNo + GetFieldsRowNo(rowId) + "F" + dcNo, GetDbRowNo(GetFieldsRowNo(rowId), dcNo), "", "parent", "AddRow");
        var arrEditDiv = new Array();
        arrEditDiv.push("#" + editDivId);
        AssignJQueryEvents(arrEditDiv);
        editElementObject = "";

        if (axInlineGridEdit) {
            showAttachmentPopover(); //bind grid attachments file count popover events
        }

        $j("#wrapperForEditFields" + dcNo).find('.editLayoutFooter button').prop('disabled', false);
        rowNoToCheck = GetFieldsRowNo(rowId);
        if (isMobile) {
            var dcClientRows = GetDcClientRows(dcNo);
            var lastRow = dcClientRows.getMaxVal();
            if (lastRow == 0) lastRow = 1;
            var addedRowNum = GetRowNoHelper(lastRow);
            var addedRowNumNew = GetRowNoHelper(lastRow - 1);
            globalClickTheEditRow = addedRowNum;
            changeEditLayoutIds(addedRowNumNew, dcNo);
            var fields = GetGridFields(dcNo);
            $("#newRecordBtn" + dcNo).attr('onclick', 'addTheValuesToGrid(' + dcNo + ',this)');
            isMobileGridRowEdit = true;
            AddRow(dcNo, "AddRow");
            // isAttachMentExist ? clearTheAttachments(dcNo, addedRowNum) : "";
            checkTableBodyWidths(dcNo);
            AxEditActiveRowNo = parseInt(addedRowNum, 10);
        }
    }

    //dc{{dcNo}}_image{{rowFrmNo}} attachment html construction for grid
    rowFrmNo = GetFieldsRowFrameNo(rowId);
    var fldName = "dc" + dcNo + "_image" + rowFrmNo;
    var fldValue = $("input#" + fldName).val();
    $("input#" + fldName).siblings(".grdattch").find(".attach-files").remove();
    if (typeof fldValue != "undefined" && fldValue != "") {
        ConstructAttachHTML(fldValue, fldName);
    }

    //html construction for grid if field name startswith "axpfile" 
    $j(".wrapperForGridData" + dcNo).find("[class^=axpAttach]").each(function () {
        var fldAxpFldName = $(this).attr('id');
        var fldAxpValue = $("input#" + fldAxpFldName).val();
        if (typeof fldAxpValue != "undefined" && fldAxpValue != "") {
            ConstructAxpAttachHTML(fldAxpValue, fldAxpFldName);
        }
    })

    showAttachmentPopover();

    if (rowNoToCheck != getNewEditRowNo(dcNo)) {
        onlyPreviousButton(dcNo);
        if ($("#bootstrapModal [id*=newRecordBtn]").hasClass('closeEventCall') === true) {
            $("#bootstrapModal [id*=newRecordBtn]").removeClass('closeEventCall');
            createBlurEventOnLastElem(dcNo, 'close');
        } else
            createBlurEventOnLastElem(dcNo);
        setModalFooterInEdit(dcNo);
    }
    var fields = GetGridFields(dcNo);
    CheckAxpvalid(dcNo, rowNoToCheck, fields);

    axpBtnClickEvent(rowId);

    isAttachMentExist = false;
    AxCurrGridRowNo = "";
    TstructTabEventsInPopUP(dcNo);
    if (dcGridOnSave != "true" && globalOnlySave == true) {
        gridEditValidator = true;
        $("#editCancelButton" + dcNo).click();
        return false;
    } else {
        createAutoComplete(`#wrapperForEditFields${dcNo} .fldFromSelect`);

        $j(`#wrapperForEditFields${dcNo}`).find('.dropdown-main').remove();
        $j(`#wrapperForEditFields${dcNo}`).find('.dropdown-display-label').remove();
        $j(`#wrapperForEditFields${dcNo}`).find('.dropdown-mul optgroup').remove();
        jQuery.each($j(`#wrapperForEditFields${dcNo}`).find('.dropdown-mul'), function (idx, el) {
            var jsonData = JSON.parse("{\"data\":[]}");
            $(el).data('dropdown').destroy();
            $(el).dropdown({
                data: jsonData.data,
                limitCount: 40,
                multipleMode: 'label',
                choice: function () {
                    //console.log(arguments, this);
                }
            });
        });
    }

    isGrdEditDirty = false;
    $("#bootstrapModalData input,select,textarea").off("change.dirty");
    $("#bootstrapModalData input,select,textarea").on("change.dirty", function () {
        isGrdEditDirty = true;
    })

    FocusOnFirstField(dcNo);
    gridEditValidator = true;
    CheckShowHideFldsGrid(dcNo); //to show/hide grid fields on click of popup save
    customAlignTstructFlds([], dcNo, parseInt(rowNoToCheck)); //field alignment based on configuation
    try {
        AxAfterPopupAddRow(dcNo, GetFieldsRowNo($j("#" + wrapperForEditFields + " .editWrapTr").attr('id')));
    } catch (e) {}
    return true;
}

function hideSlNOandED(dcNo, trIndexForEdit) {
    if ($("#uniqueEditDeleteAct" + dcNo).length > 0 && $("#uniqueEditDeleteAct" + dcNo).is(":hidden")) {
        if (trIndexForEdit == undefined || trIndexForEdit === "") {
            $(".wrapperForGridData" + dcNo + " table tbody tr:last td:eq(" + $("#uniqueEditDeleteAct" + dcNo).index() + ")").hide();
        } else {
            $(".wrapperForGridData" + dcNo + " table tbody tr:eq(" + trIndexForEdit + ") td:eq(" + $("#uniqueEditDeleteAct" + dcNo).index() + ")").hide();
        }
    }
    if ($("#uniqueThHead" + dcNo).length > 0 && $("#uniqueThHead" + dcNo).is(":hidden")) {
        if (trIndexForEdit == undefined || trIndexForEdit === "") {
            $(".wrapperForGridData" + dcNo + " table tbody tr:last td:eq(" + $("#uniqueThHead" + dcNo).index() + ")").hide();
        } else {
            $(".wrapperForGridData" + dcNo + " table tbody tr:eq(" + trIndexForEdit + ") td:eq(" + $("#uniqueThHead" + dcNo).index() + ")").hide();
        }
    }
}

function createInpLabel(id, text, valueOfField, typeOfField, isFieldVisible, hiddenData, maxlength, inlineStyle, disableClass, calledFrom, displayClasses) {
    var labelHtml = "";
    if (isFieldVisible) {
        if (displayClasses != "" && displayClasses.split(" ").indexOf("none") > -1)
            labelHtml += "<td style='display:none;' class='" + displayClasses + "'>";
        else {
            if (axInlineGridEdit && typeOfField != "axpBtnCustom") {
                var fName = GetFieldsName(id);
                var fldIndex = $j.inArray(fName, FNames);
                var allowEmpty = GetFieldProp(fldIndex, "allowEmpty");
                //Inline grid row validation before adding a new row - if a field is mandatory then add an attribute 'data-fld-mandatory' to that field label
                labelHtml += "<td " + (allowEmpty === "F" ? 'data-fld-mandatory' : '') + " class='" + displayClasses + "'>";
            } else
                labelHtml += "<td class='" + displayClasses + "'>";
        }
    } else {
        labelHtml += "<td style='display:none;'>";
    }
    //if its gridAttachment creating hyper links for it
    if (typeOfField == 'gridattach') {
        var parentForAttach = $j("#" + id).next("[id *= 'GridAttach']");
        var linkHtml = "";
        var hdnScriptsUrlPath = $j("#hdnScriptsUrlpath");
        filePath = hdnScriptsUrlPath.val() + "axpert/" + sid + "/";
        var rowFrmNo = GetFieldsRowFrameNo(id);
        var rowNo = GetFieldsRowNo(id);
        if (calledFrom != 'listView' && (!axInlineGridEdit && AxpGridForm != "form")) {
            var allImageNames = valueOfField.split(',');
            for (i = 0; i < allImageNames.length; i++) {
                if (allImageNames[i] != "") {
                    var finalFileName = unescape(allImageNames[i]).replace(/\s/g, '♠').replace(/\(/g, '♦').replace(/\)/g, '♣');
                    linkHtml += "<div id=\"Link_" + rowFrmNo + "_" + finalFileName + "\"  class='atchfile'>";
                    let fileOpenLink = allImageNames[i];
                    fileOpenLink = fileOpenLink.replace(/'/g, '♠');
                    linkHtml += "<a onclick=\"DeleteFileFromRow('" + id + "','" + rowNo + "','" + fileOpenLink + "')\"><i class=\"glyphicon glyphicon-remove close icon-arrows-remove attachmentcrossicon\"></i></a>";
                    linkHtml += "<a href=\"javascript:void(0)\" id='grdAtt_hlnk_" + rowFrmNo + "' class='grdAttach handCur' onclick='ShowGridAttLink(\"" + filePath + fileOpenLink + "\")'>" + allImageNames[i] + "</a>";
                    linkHtml += "</div>";
                }
            }
        }
        if (!id.toLowerCase().startsWith("axpfile_"))
            labelHtml += "<textarea style='display:none;' tabindex='-1' class='form-control w-100 border bg-transparent overflow-hidden resize-none  labelInp " + disableClass + "' maxlength='" + maxlength + "'  data-style='" + inlineStyle + "'  data-type='" + typeOfField + "' data-hidden='" + hiddenData + "' id='" + (axInlineGridEdit ? "grdA" : "") + id + "'  readonly>" + valueOfField + "</textarea>";
        else
            labelHtml += "<textarea style='display:none;' tabindex='-1' class='form-control w-100 border bg-transparent overflow-hidden resize-none  axpAttach labelInp " + disableClass + "' maxlength='" + maxlength + "'  data-style='" + inlineStyle + "'  data-type='" + typeOfField + "' data-hidden='" + hiddenData + "' id='" + id + "'  readonly>" + valueOfField + "</textarea>";
        if (axInlineGridEdit || (!axInlineGridEdit && AxpGridForm != "form")) { // if grid edit mode is inline edit then display upload icon for an attachment field

            var allImageNames = valueOfField.trim() == "" ? "" : valueOfField.split(',');
            var fldName = GetFieldsName(id);
            var endIdPart = id.substr(fldName.length);
            labelHtml += '<div><input type="hidden" id="' + fldName + endIdPart + '" tabindex="-1" name="' + endIdPart + '" value="' + valueOfField + '" class="grdAttach handCur">';
            if (!id.toLowerCase().startsWith("axpfile_")) {
                //labelHtml += ' <div id="GridAttach' + endIdPart + '" class="grdattch" name="GridAttach' + endIdPart + '"><span id="grdAtt_img_' + endIdPart + '"  tabindex="0" title="Attach Files" class=\"focus-input fa fa-paperclip upload-icon\" onclick="ShowGridAttachPopUp(this);" class="grdAttach handCur" ></span>';
                //labelHtml += ' <a href="0" id="grdAtt_hlnk_' + endIdPart + '" tabindex="-1" class="grdAttach handCur"></a>';
                labelHtml += '<div class="form-group form-control p-0 grdattch" id="GridAttach' + fldName + endIdPart + '"><div id="dropzone_' + fldName + endIdPart + '" class="dropzone dropzone-queue min-h-1px border-0 px-3 py-2 dropzoneGrid"><div class="d-flex flex-row-auto dropzone-panel mb-lg-0 m-0"><a id="' + fldName + endIdPart + '" class="dropzone-select fs-7 gridattach text-truncate me-1"><span class="material-icons material-icons-style material-icons-2 float-start mx-2">upload_file</span> Drop files here or click to upload</a><span class="material-icons material-icons-style material-icons-2 ms-auto pe-9 fileuploadmore d-none" data-bs-toggle="popover" data-bs-sanitize="false" data-bs-placement="bottom" data-bs-html="true">more</span><a class="dropzone-remove-all btn btn-sm btn-light-primary d-none">Remove All</a></div><div class="dropzone-items wm-200px d-none"><div class="dropzone-item" style="display: none"><div class="dropzone-file overflow-hidden"><div class="dropzone-filename" title="some_image_file_name.jpg"><span data-dz-name>some_image_file_name.jpg</span></div><div class="dropzone-error" data-dz-errormessage></div></div><div class="dropzone-progress d-none"><div class="progress"><div class="progress-bar bg-primary" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" data-dz-uploadprogress></div></div></div><div class="dropzone-toolbar"><span class="dropzone-delete" data-dz-remove><span class="material-icons material-icons-style material-icons-2 float-end dropzoneGridItemDelete">delete_outline</span></span></div></div></div></div></div>';
            } else {
                labelHtml += '<div class="form-group form-control p-0 grdattch" id="GridAxpFile' + fldName + endIdPart + '"><div id="dropzone_' + fldName + endIdPart + '" class="dropzone dropzone-queue min-h-1px border-0 px-3 py-2"><div class="d-flex flex-row-auto dropzone-panel mb-lg-0 m-0"><a id="' + fldName + endIdPart + '" class="dropzone-select fs-7 gridattach text-truncate me-1"><span class="material-icons material-icons-style material-icons-2 float-start mx-2">upload_file</span> Drop files here or click to upload</a><span class="material-icons material-icons-style material-icons-2 ms-auto pe-9 fileuploadmore d-none" data-bs-toggle="popover" data-bs-sanitize="false" data-bs-placement="bottom" data-bs-html="true">more</span><a class="dropzone-remove-all btn btn-sm btn-light-primary d-none">Remove All</a></div><div class="dropzone-items wm-200px d-none"><div class="dropzone-item" style="display: none"><div class="dropzone-file overflow-hidden"><div class="dropzone-filename" title="some_image_file_name.jpg"><span data-dz-name>some_image_file_name.jpg</span></div><div class="dropzone-error" data-dz-errormessage></div></div><div class="dropzone-progress d-none"><div class="progress"><div class="progress-bar bg-primary" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" data-dz-uploadprogress></div></div></div><div class="dropzone-toolbar"><span class="dropzone-delete" data-dz-remove><span class="material-icons material-icons-style material-icons-2 float-end dropzoneItemDelete">delete_outline</span></span></div></div></div></div></div>';
            }
            if (allImageNames != undefined && allImageNames.length != 0) {
                labelHtml += "<div id='" + id + "attach' class='attach-files'>" + linkHtml + "</div>"
            }
            //if (!id.toLowerCase().startsWith("axpfile_"))
            //    labelHtml += "</div></div>";
        } else
            labelHtml += linkHtml;
    } else if (typeOfField == 'axpBtn') {
        labelHtml += '<a href="javascript:void(0)" style="cursor :pointer" class="Grdlnk axpBtn rejectEdit" id="' + id + '" name="' + id + '">' + valueOfField + '</a>';
        labelHtml += "<textarea tabindex='-1' style='display:none;' class='form-control w-100 border bg-transparent overflow-hidden resize-none  labelInp " + disableClass + "' maxlength='" + maxlength + "'  data-style='" + inlineStyle + "' data-type='" + typeOfField + "' data-hidden='" + hiddenData + "' id='txt_axpBtn_" + id + "'  readonly>" + valueOfField + "</textarea>";
    } else if (typeOfField == 'axpBtnCustom') {
        labelHtml += '<a href="javascript:void(0)" style="cursor :pointer" class="Grdlnk axpBtnCustom rejectEdit" id="' + id + '" name="' + id + '" ' + $("#" + id).attr("onclick") + '>' + valueOfField + '</a>';
        labelHtml += "<textarea tabindex='-1' style='display:none;' class='form-control w-100 border bg-transparent overflow-hidden resize-none  labelInp " + disableClass + "' maxlength='" + maxlength + "'  data-style='" + inlineStyle + "' data-type='" + typeOfField + "' data-hidden='" + hiddenData + "' id='txt_axpBtnCustom_" + id + "'  readonly>" + valueOfField + "</textarea>";
    } else if (typeOfField == 'select') {
        var valOfTextField = "";
        valueOfField == "" ? valOfTextField = "" : valOfTextField = text;
        labelHtml += "<textarea tabindex='-1' class='form-control w-100 border bg-transparent overflow-hidden resize-none  selectTextArea labelInp " + disableClass + "' maxlength='" + maxlength + "'  data-style='" + inlineStyle + "' data-type='" + typeOfField + "' data-hidden='" + hiddenData + "' id='txtA~" + id + "'  readonly>" + valOfTextField + "</textarea>";
    } else if (typeOfField == "numeric") {
        if (valueOfField == "") {
            var fName = GetFieldsName(id);
            var fldIndex = $j.inArray(fName, FNames);
            valueOfField = NumericFldOnBlur("0", fldIndex);
        }
        labelHtml += "<textarea tabindex='-1' class='form-control w-100 border bg-transparent overflow-hidden resize-none  labelInp " + disableClass + "' maxlength='" + maxlength + "' style='" + inlineStyle + "' data-style='" + inlineStyle + "' data-type='" + typeOfField + "' data-hidden='" + hiddenData + "' id='" + id + "'  readonly>" + valueOfField + "</textarea>";
    } else if (typeOfField == "fromselect-select" || typeOfField == "fromselect-select~isrefreshsave") {
        var valOfTextField = "";
        var typeOfFields = typeOfField.split("~")[0];
        var isrefreshsave = "";
        if (axInlineGridEdit && typeOfField == "fromselect-select~isrefreshsave")
            isrefreshsave = "~" + typeOfField.split("~")[1];
        valueOfField == "" ? valOfTextField = "" : valOfTextField = text;
        var addOption = typeof $("#" + id).data("addoption") != "undefined" ? " data-addoption='" + $("#" + id).data("addoption") + "'" : "";
        labelHtml += "<textarea tabindex='-1' class='form-control w-100 border bg-transparent overflow-hidden resize-none  selectTextArea labelInp " + disableClass + "' maxlength='" + maxlength + "'  data-style='" + inlineStyle + "' data-type='" + typeOfFields + isrefreshsave + "' data-hidden='" + hiddenData + "' id='" + id + "'  readonly " + addOption +">" + valOfTextField + "</textarea>";
    } else if (typeOfField == "fromselect-pick" || typeOfField == "fromselect-pick~isrefreshsave") {
        var valOfTextField = "";
        var typeOfFields = typeOfField.split("~")[0];
        var isrefreshsave = "";
        if (axInlineGridEdit && typeOfField == "fromselect-select~isrefreshsave")
            isrefreshsave = "~" + typeOfField.split("~")[1];
        valueOfField == "" ? valOfTextField = "" : valOfTextField = text;
        var addOption = typeof $("#" + id).data("addoption") != "undefined" ? " data-addoption='" + $("#" + id).data("addoption") + "'" : "";
        labelHtml += "<textarea tabindex='-1' class='form-control w-100 border bg-transparent overflow-hidden resize-none  selectTextArea labelInp " + disableClass + "' maxlength='" + maxlength + "'  data-style='" + inlineStyle + "' data-type='" + typeOfFields + isrefreshsave + "' data-hidden='" + hiddenData + "' id='" + id + "'  readonly " + addOption +">" + valOfTextField + "</textarea>";
    } else if (typeOfField == "multigroupselect" || typeOfField == "multigroupselect~isrefreshsave") {
        var valOfTextField = "";
        var typeOfFields = typeOfField.split("~")[0];
        var isrefreshsave = "";
        if (axInlineGridEdit && typeOfField == "multigroupselect~isrefreshsave")
            isrefreshsave = "~" + typeOfField.split("~")[1];
        valueOfField == "" ? valOfTextField = "" : valOfTextField = text;
        var fName = GetFieldsName(id);
        var fldIndex = $j.inArray(fName, FNames);
        var mgsSep = FldMgsSeparator[fldIndex];
        labelHtml += "<textarea tabindex='-1' class='form-control w-100 border bg-transparent overflow-hidden resize-none  selectTextArea labelInp " + disableClass + "' maxlength='" + maxlength + "'  data-style='" + inlineStyle + "' data-type='" + typeOfFields + isrefreshsave + "' data-sep='" + mgsSep + "' data-hidden='" + hiddenData + "' id='" + id + "'  readonly>" + valOfTextField + "</textarea>";
    } else {
        labelHtml += "<textarea tabindex='-1' class='form-control w-100 border bg-transparent overflow-hidden resize-none  labelInp " + disableClass + "' maxlength='" + maxlength + "'  data-style='" + inlineStyle + "' data-type='" + typeOfField + "' data-hidden='" + hiddenData + "' id='" + id + "'  readonly>" + valueOfField + "</textarea>";
    }

    if (typeOfField == "select") {
        labelHtml += '<select id="' + id + '" title="" name="' + id + '" class="combotem Family  form-control d-none">' + $j("#" + id).html() + '</select>';
    }
    labelHtml += "</td>";

    return labelHtml;
}

function deleteAttachMent(elem) {
    $j(elem).parent('.attachmentWrapper').find("a[onclick^='DeleteFileFromRow']").click();
}

function clearTheAttachments(dcNo, addedRowNum) {
    var nextRowNo = parseInt(addedRowNum, 10) + 1; //2
    var nextRowNum = GetRowNoHelper(nextRowNo); //002
    var wrapperForEditFields = "wrapperForEditFields" + dcNo;
    var attachHtml = '<span id="grdAtt_img_' + nextRowNum + 'F' + dcNo + '"  tabindex="0" title="Attach Files" class=\"fa fa-paperclip\" onclick="ShowGridAttachPopUp(this);" class="grdAttach handCur">';
    attachHtml += '<a href="0" id="grdAtt_hlnk_' + nextRowNum + 'F' + dcNo + '" tabindex="-1" class="grdAttach handCur"></a>';
    $j("#" + wrapperForEditFields + " .gridElement [id^=GridAttach]").html(attachHtml);

}

function slNoGenerator(dcNo, task, trNo) {
    if (task == "next") {
        if ($j(".wrapperForGridData" + dcNo + " tbody tr").length > 0) {
            var slNoId = 'lblSlNo' + GetRowNoHelper(AxCurrGridRowNo) + 'F' + dcNo;

            return "<td><label id='" + slNoId + "'></label></td>";
        } else {
            idOfSlNo = 'lblSlNo001F' + dcNo;
            return "<td><label id='" + slNoId + "'>1</label></td>";
        }
    } else if (task == "reset") {

        var idOFtheField = $j(".wrapperForGridData" + dcNo + " tbody tr").eq(trNo).find('td:first label').attr("id");
        return "<td><label id='" + idOFtheField + "'>" + (trNo + 1) + "</label></td>";
    } else if (task == "remove") {
        var slNo = trNo;
        $j(".wrapperForGridData" + dcNo + " tbody tr").each(function (index, el) {
            if (index > trNo) {
                slNo++;
                $j(this).find('td:first label').text(slNo);
            }
        });
    }
}

function changeEditLayoutIds(presentNo, dcNo, task) {
    var wrapperForEditFields = "wrapperForEditFields" + dcNo;
    var numToadd = 0;
    numToadd = parseInt(presentNo) + 1;
    var curRowNo = GetRowNoHelper(numToadd);
    AxCurrGridRowNo = $j("#" + wrapperForEditFields + " .editWrapTr").attr('id');
    if (task == 'tabListView') {
        var lastIndexF = AxCurrGridRowNo.lastIndexOf("F"); //AxpFin_F2001F12
        presentNo = AxCurrGridRowNo.substr(lastIndexF - 3, 3); //002
        numToadd = parseInt(presentNo) + 1;
        curRowNo = GetRowNoHelper(numToadd);
    }
    $j("#" + wrapperForEditFields + " .editWrapTr").attr('id', "sp" + dcNo + "R" + curRowNo + "F" + dcNo);
    // if ($j("#" + wrapperForEditFields + " .gridtdclass").first().find('a.rowdelete').length > 0) {
    //     $j("#" + wrapperForEditFields + " .gridtdclass").first().find('a.rowdelete').attr('id', 'del' + curRowNo + 'F' + dcNo);
    // }



    $j("#" + wrapperForEditFields + " .gridElement").find('select,input,label,img,.Grdlnk,textarea,.grdAttach,.pickimg,.grdRefer,a, div[id^=GridAttach],div.autoclear i,div.edit i,div[id^=autoadv],div[id^=autoadv] i,div.dropzone').each(function (index, el) {
        var currentElement = $j(this);
        if (currentElement[0].id.substr(currentElement[0].id.lastIndexOf("F") - 3, 3) != curRowNo && !currentElement[0].id.toLowerCase().startsWith("gridaxpfile_hlnk_")) {
            if (currentElement.hasClass('grdAttach')) {
                //then we have to clear the grid attachments
                var lastPartOfId = curRowNo + 'F' + dcNo;
                var gridHtml = "";
                var fieldId = GetFieldsName(currentElement[0].id);
                gridHtml += '<input type="hidden" id="' + fieldId + lastPartOfId + '" tabindex="-1" class="grdAttach handCur">'; //+ dcNo
                if (!fieldId.toLowerCase().startsWith("axpfile_")) {
                    //gridHtml += '<div id="GridAttach' + lastPartOfId + '" class="grdattch"><span id="grdAtt_img_' + lastPartOfId + '"  tabindex="0" title="Attach Files" class=\"fa fa-paperclip\" onclick="ShowGridAttachPopUp(this);" class="grdAttach handCur">';
                    //gridHtml += ' <a href="0" id="grdAtt_hlnk_' + lastPartOfId + '" tabindex="-1" class="grdAttach handCur"></a>';
                    //gridHtml += '</div>';
                    gridHtml += '<div class="form-group form-control p-0 grdattch" id="GridAttach' + fieldId + lastPartOfId + '"><div id="dropzone_' + fieldId + lastPartOfId + '" class="dropzone dropzone-queue min-h-1px border-0 px-3 py-2 dropzoneGrid"><div class="d-flex flex-row-auto dropzone-panel mb-lg-0 m-0"><a id="' + fieldId + lastPartOfId + '" class="dropzone-select fs-7 gridattach text-truncate me-1"><span class="material-icons material-icons-style material-icons-2 float-start mx-2">upload_file</span> Drop files here or click to upload</a><span class="material-icons material-icons-style material-icons-2 ms-auto pe-9 fileuploadmore d-none" data-bs-toggle="popover" data-bs-sanitize="false" data-bs-placement="bottom" data-bs-html="true">more</span><a class="dropzone-remove-all btn btn-sm btn-light-primary d-none">Remove All</a></div><div class="dropzone-items wm-200px d-none"><div class="dropzone-item" style="display: none"><div class="dropzone-file overflow-hidden"><div class="dropzone-filename" title="some_image_file_name.jpg"><span data-dz-name>some_image_file_name.jpg</span></div><div class="dropzone-error" data-dz-errormessage></div></div><div class="dropzone-progress d-none"><div class="progress"><div class="progress-bar bg-primary" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" data-dz-uploadprogress></div></div></div><div class="dropzone-toolbar"><span class="dropzone-delete" data-dz-remove><span class="material-icons material-icons-style material-icons-2 float-end dropzoneGridItemDelete">delete_outline</span></span></div></div></div></div></div>';
                } else {
                    gridHtml += '<div class="form-group form-control p-0 grdattch" id="GridAxpFile' + fieldId + lastPartOfId + '"><div id="dropzone_' + fieldId + lastPartOfId + '" class="dropzone dropzone-queue min-h-1px border-0 px-3 py-2"><div class="d-flex flex-row-auto dropzone-panel mb-lg-0 m-0"><a id="' + fieldId + lastPartOfId + '" class="dropzone-select fs-7 gridattach text-truncate me-1"><span class="material-icons material-icons-style material-icons-2 float-start mx-2">upload_file</span> Drop files here or click to upload</a><span class="material-icons material-icons-style material-icons-2 ms-auto pe-9 fileuploadmore d-none" data-bs-toggle="popover" data-bs-sanitize="false" data-bs-placement="bottom" data-bs-html="true">more</span><a class="dropzone-remove-all btn btn-sm btn-light-primary d-none">Remove All</a></div><div class="dropzone-items wm-200px d-none"><div class="dropzone-item" style="display: none"><div class="dropzone-file overflow-hidden"><div class="dropzone-filename" title="some_image_file_name.jpg"><span data-dz-name>some_image_file_name.jpg</span></div><div class="dropzone-error" data-dz-errormessage></div></div><div class="dropzone-progress d-none"><div class="progress"><div class="progress-bar bg-primary" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" data-dz-uploadprogress></div></div></div><div class="dropzone-toolbar"><span class="dropzone-delete" data-dz-remove><span class="material-icons material-icons-style material-icons-2 float-end dropzoneItemDelete">delete_outline</span></span></div></div></div></div></div>';
                }
                currentElement.parent().html(gridHtml);
            }

            ConvertFieldID($j(this), curRowNo);
            if (currentElement[0].nodeName == "SELECT") {
                currentElement.find("option:selected").removeAttr("selected");
            } else if (currentElement.hasClass('slno') && currentElement[0].nodeName == "LABEL") {
                currentElement.text(numToadd);
            } else if (currentElement[0].nodeName == "INPUT") {
                //currentElement.val(""); is not working in some cases
                currentElement.removeAttr('value').attr('value', '').val('');
                if (currentElement.data("attr")) {
                    currentElement.data("attr", "");
                }
            }

            if (currentElement.hasClass('axpFilePathFld')) {
                var lastPartOfId = curRowNo + 'F' + dcNo;
                var fldClasses = $(currentElement).attr("class");
                var endPart = currentElement[0].id.substring(("axpfilepath_").length);
                fldClasses = fldClasses.substr(fldClasses.indexOf(" ") + 1);
                fldClasses = "axpFilePath_" + endPart + " " + fldClasses;
                $(currentElement).attr("class", fldClasses);
            }
        }
    });


    if (task == 'fillGrid' && parseInt(GetDcRowCount(dcNo), 10) > 0) {
        if (!axInlineGridEdit) {
            if ($("#gridHd" + dcNo + " tbody tr").length > 0)
                AddRow(dcNo, "FillGrid");
        } else {
            //Refer bug AGI004379, AGI004388 - for inline grid, since we are not calling AddRow() functionality but record count needs to be update if filling data using fill grid 
            numToadd = parseInt(presentNo) + 1;
            curRowNo = GetRowNoHelper(numToadd);
            UpdateDcRowArrays(dcNo, curRowNo, "Add");
        }
        ShowDimmer(false);
    }

}

function onlyPreviousButton(dcNo) {
    $("#wrapperForEditFields" + dcNo).find('.previousNextEditButton button').prop('disabled', true).addClass("disabled");
    //for enabling previous row navigation con click of add
    if ($(".wrapperForGridData" + dcNo + " table tbody tr").length > 0) {
        $("#wrapperForEditFields" + dcNo).find('.previousNextEditButton button.prevRec').prop('disabled', false).removeClass("disabled").attr("onclick", "editThePreviousNextRow('" + ($(".wrapperForGridData" + dcNo + " table tbody tr").length - 1) + "','" + dcNo + "','prev')");
    }
    oldEditValues = "";
}

function editTheRow(elem, dcNo, rowNo, e) { //(editIcon,2,001,event)
    if (rowNo == "")
        GetCurrentTime("Tstruct grid dc addrow button click(ws call)");
    if (axInlineGridEdit) {
        if (elem === "") {
            var isExitDummy = false;
            if (gridDummyRowVal.length > 0) {
                if (rowNo == "")
                    gridDummyRowVal.map(function (v) {
                        if (v.split("~")[0] == dcNo) isExitDummy = true;
                    });
                else
                    gridDummyRowVal.map(function (v) {
                        if (v.split("~")[0] == dcNo && v.split("~")[1] == rowNo) isExitDummy = true;
                    });
            }
            if (isExitDummy) {
                showAlertDialog("warning", 2054, "client", "Row 1 ");
                return;
            }
            gridRowEditOnLoad = false;
            addNewInlineGridRow(dcNo); //add a new row in grid
            focusOnDeleteButton = true;
        } else
            $(elem).closest("td").click(); //when user clicks on grid row edit button
        return;
    } else if ((!axInlineGridEdit && AxpGridForm == "form") || (isMobile && mobileCardLayout != "none")) {
        if (checkFormRowValid(dcNo, rowNo))
            formGridRowEdit(dcNo, rowNo, isLoadDataRow == false ? undefined : "listview");
        else
            return;
    } else if (isMobile) {
        $j(".wrapperForGridData" + dcNo + " tbody tr.inEditMode").find('.glyphicon').removeClass('disabled').removeAttr('disabled');
        $j(".wrapperForGridData" + dcNo + " tbody tr.inEditMode").find('.gridEditDeleteBtns').removeClass('disabled').removeAttr('disabled');
        $j(".wrapperForGridData" + dcNo + " tbody tr.inEditMode").removeClass('inEditMode');
    }
    if (!isMobile) {
        gridEditSaveNdClose("edit");
    }
    var onlySave = globalOnlySave;
    var prevlcm = eval(callParent('lcm[298]'));
    var nextlcm = eval(callParent('lcm[299]'));
    var savenewlcm = eval(callParent('lcm[300]'));
    var savelcm = eval(callParent('lcm[200]'));
    var cancellcm = eval(callParent('lcm[192]'));
    $j(".dropdown").removeClass("open");
    if (typeof e != "undefined" && AxpGridForm != "form") {
        e.preventDefault();
        e.stopPropagation();
    }
    if (elem === "" && rowNo === "" && isLoadDataRow == false) {
        rowNo = getNewEditRowNo(dcNo);
        onlyPreviousButton(dcNo);
        var indexOfThisNewElement = parseInt(rowNo, 10) - 1;
        changeEditLayoutIds(indexOfThisNewElement, dcNo);
        isGrdEditDirty = false;
    } else if ((!axInlineGridEdit && AxpGridForm == "form" && isLoadDataRow) || (isMobile && mobileCardLayout != "none" && isLoadDataRow)) {
        isGrdEditDirty = false;
    } else {
        isGrdEditDirty = true;
    }



    //creating a template for edit layout
    var dcName = "dc" + dcNo; //dc2
    if (eval("editLayouTmplate." + dcName) == undefined)
        createEditLayoutTemplate(dcNo);
    if (elem != "" && $j(elem).hasClass('disabled')) {
        gridEditValidator = true;
        return false;
    }

    gridEditValidator = true;
    if (!isMobile && AxpGridForm != "form" && $("#bootstrapModal").length == 0) {
        createDataGridDialog(dcNo);
    } else if ((!isMobile && AxpGridForm == "form") || (isMobile && mobileCardLayout != "none"))
        createFormGridRowHTML(dcNo);
    else {
        if (elem == "") {
            setTimeout(function () {
                $("#newRecordBtn" + dcNo).click();
            }, 100);
        }
        $("#colScroll" + dcNo).show();
    }

    AxEditActiveDcNo = dcNo;
    oldEditValues = "";
    AxEditActiveRowNo = GetDbRowNo(rowNo, dcNo);
    var parentTrElement;
    if (elem != "") {
        parentTrElement = $j(elem).parents("tr");
        //var noOfFields = parentTrElement.find('td').length;
        $j("#wrapperForEditFields" + dcNo).find('.editLayoutFooter button').prop('disabled', true);
    }
    var editHtml = "";

    editDivId = $j("#wrapperForEditFields" + dcNo + " .editWrapTr").attr('id');
    var fields = GetGridFields(dcNo);

    if (onlySave || elem != "") {
        if (!isMobile) {
            $($j("#wrapperForEditFields" + dcNo).clone()).appendTo("#divDc" + dcNo + " .grid-icons");
            $j(".grid-icons #wrapperForEditFields" + dcNo).attr("id", "dummyWrapperForEditFields" + dcNo).addClass("hide");
            $j("#dummyWrapperForEditFields" + dcNo + "  #newRecordBtn" + dcNo).attr("id", "dummynewRecordBtn" + dcNo);
            //if (isMobile) {
            //    $j("#dummyWrapperForEditFields" + dcNo + "  #editUpdateButton" + dcNo).attr("id", "dummyEditUpdateButton" + dcNo);
            //}
        }
    } else {
        editElementObject = $j("#wrapperForEditFields" + dcNo).html();
    }
    var endIdPart = rowNo + 'F' + dcNo; //002F2
    var dvId = "sp" + dcNo + 'R' + endIdPart;
    if (elem != "") {
        editHtml += '<div id="' + dvId + '" class="editWrapTr">';
        parentTrElement.addClass('inEditMode');
        var gsiY = "";
        var groupFieldDesignArr = {};
        let addedRowsArray = new Set();
        parentTrElement.find('td').each(function (index, el) {
            if (index == 0) {
                //means last edit delete field which we can skip adding
                $j(this).find('.glyphicon').addClass('disabled').attr('disabled', 'disabled');
                $j(this).find('.gridEditDeleteBtns').addClass('disabled').attr('disabled', 'disabled');

            } else if (index == 1) {
                //means we have a delete button
                editHtml += '<div class="gridtdclass d-none">' + $j(this).html() + '</div>';
            } else {
                var visibility = $j(this).is(':visible');
                var presentLabel = $j(this).find('textarea.labelInp');
                var typeOfField = presentLabel.data('type');
                typeOfField != undefined ? typeOfField = typeOfField.toLowerCase() : "";
                var idOFtheField = presentLabel.attr('id');
                var textOfTheField = presentLabel.text();
                var valueOfField = presentLabel.val();
                var maxlength = presentLabel.attr('maxlength');
                maxlength == undefined ? maxlength = "" : "";
                var inlineStyle = presentLabel.data('style');
                var isFieldDisable = presentLabel.hasClass('flddis');
                var fieldClasses = presentLabel.attr('class');

                //for taking grid field caption using field id
                var fName = GetFieldsName(idOFtheField);
                if (typeOfField == 'select') {
                    fName = fName.substr(5);
                }

                var fldIndex = $j.inArray(fName, FNames);
                var fldCaption = FCaption[fldIndex];
                if (fldCaption != undefined && fldCaption.indexOf('~') > -1)
                    fldCaption = fldCaption.replace(new RegExp('~', "g"), "\n");

                var hidenFromDesignMode = false;
                if (typeOfField != undefined && typeOfField != "undefined") {
                    if (visibility == false) {
                        //checking field visibility from grid header
                        var fldId = idOFtheField.substr(0, idOFtheField.length - 5)
                        if (!$(this).closest('table').find('#th-' + fldId).hasClass('none') && $(this).closest('table').find('#th-' + fldId)[0].style.display != "none") {
                            visibility = true;
                        }
                    }
                    var tmpId = idOFtheField;
                    typeOfField == 'select' ? (tmpId = idOFtheField.substr(5), oldEditValues += $("#" + tmpId + " option:selected").val() + "¿" + $("#" + tmpId + " option:selected").text() + "♠") : (tmpId = idOFtheField, oldEditValues += valueOfField + "♠");
                    typeOfField == 'axpbtn' ? tmpId = idOFtheField.substr(11) : tmpId = tmpId;
                    typeOfField == 'axpbtncustom' ? tmpId = idOFtheField.substr(11) : tmpId = tmpId;
                    valueOfField ? valueOfField = checkSpecialCharacters(valueOfField, 'encode') : "";
                    var lastIndexF = tmpId.lastIndexOf("F");
                    if (tmpId.substr(lastIndexF, 3).length == 3) { //f12
                        //remove last 6 chars
                        tmpId = tmpId.substr(0, tmpId.length - 6);
                        tmpId = tmpId + "tmp";
                    } else {
                        //remove last 5 chars
                        tmpId = tmpId.substr(0, tmpId.length - 5);
                        tmpId = tmpId + "tmp";
                    }
                    var classes = "";
                    classes = eval("editLayouTmplate." + dcName + "." + tmpId)

                    //Adding for allow empty in edit mode
                    let isAllowEmpty, purpose;
                    if (fldIndex != -1) {
                        isAllowEmpty = FProps[fldIndex][1];
                        purpose = FldPurpose[fldIndex];
                    }

                    //design mode for editted wrapper fields
                    var dummyWrapper = $("#dummyWrapperForEditFields" + dcNo);
                    var grdFldId = "";
                    var grdStack = idOFtheField;
                    if (typeOfField == "select") {
                        grdStack = idOFtheField.substr(5);
                    } else if (typeOfField == 'axpbtn') {
                        grdStack = grdStack.substr(11);
                    } else if (typeOfField == 'axpbtncustom') {
                        grdStack = grdStack.substr(11);
                    }
                    grdStack = "dvGrid" + GetFieldsName(grdStack);

                    dummyWrapper.find("#" + grdStack)
                    var dataAttr = dummyWrapper.find("#" + grdStack).data();
                    var attributes = "";
                    for (var attr in dataAttr) {
                        if (attr.indexOf("gs") != -1) {
                            var attrFld = camelCaseToDash(attr);
                            var attrVal = dataAttr[attr];
                            attributes += "data-" + attrFld + "" + "='" + attrVal + "' ";
                        }
                    }

                    var gsiHeight = "";

                    if (theMode == "render" && !staticRunMode) {
                        try {
                            var elm = designObj[0].dcs[dcNo - 1].fieldsDesign.filter(function (obj, index) {
                                return obj.fld_id == fName && obj.visibility
                            })[0];
                            var elmHeight = elm.height;
                        } catch (ex) {
                            var elmHeight = 0;
                        }
                        try {

                            var tempRowObj = designObj[0].dcs[dcNo - 1].fieldsDesign.filter(function (elmns) {
                                return elmns.y >= elm.y && elmns.y <= (elm.y + elm.height - 1)
                            });
                            if (!addedRowsArray.has(elm.y) && tempRowObj[0].fld_id == elm.fld_id) {
                                addedRowsArray = unionSets(addedRowsArray, new Set(_.map(tempRowObj, 'y')));
                                groupFieldDesignArr = tempRowObj[0];
                            }
                        } catch (ex) {}
                        if (theMode == "render" && !staticRunMode) {
                            if (compressedMode) {
                                gsiHeight = (((elmHeight * gsConf.compressedMode.cellHeight) + ((elmHeight - 1) * gsConf.compressedMode.verticalMargin)) - gsConf.compressedMode.labelHeight).toString() + isMobile ? 10 : "" + "px";
                            } else {
                                gsiHeight = (((elmHeight * gsConf.normalMode.cellHeight) + ((elmHeight - 1) * gsConf.normalMode.verticalMargin)) - gsConf.normalMode.labelHeight).toString() + isMobile ? 10 : "" + "px";
                            }
                        }

                        if (typeof gsiHeight != "undefined") {
                            gsiHeight = " height: " + gsiHeight + "; ";
                        } else {
                            gsiHeight = "";
                        }

                        if (typeof elm != "undefined" && gsiY !== elm.y) {
                            var oldGsiY = gsiY;
                            gsiY = elm.y;
                            try {
                                if (oldGsiY !== "") {
                                    if (groupFieldDesignArr != {} && groupFieldDesignArr.fld_id == elm.fld_id) {
                                        editHtml += "<div class=\"clearfix\"></div>";
                                        groupFieldDesignArr = {};
                                    }
                                }
                            } catch (ex) {}
                        }
                    }

                    if (visibility && typeof dataAttr != "undefined" && dataAttr.popVisible != undefined) {
                        hidenFromDesignMode = true;
                        attributes += "data-pop-visible='false'";
                        visibility = false;
                    }

                    if (visibility)
                        editHtml += '<div class="' + classes + '" style="' + '" ' + attributes + ' > ';
                    else
                        editHtml += '<div class="' + classes + '" style="display:none;' + '" ' + attributes + '>';

                    editHtml += "<div class='grid-stack-item-content'>";
                    //Adding for allow empty in edit mode
                    if (isAllowEmpty === 'F' || (purpose != undefined && purpose.length > 0 && purpose != " "))
                        editHtml += "<div class='fld-wrap1'>";

                    if (typeOfField == 'axpbtn')
                        editHtml += '<label>' + textOfTheField + '</label>';
                    else if (typeOfField == 'axpbtncustom')
                        editHtml += '<label>' + textOfTheField + '</label>';
                    else if (typeOfField == 'checkbox')
                        editHtml += '<label for="' + idOFtheField + '" style="padding-top: 20px;">';
                    else if (typeOfField == 'select') {
                        var idOfSelectField = idOFtheField.substr(5);
                        editHtml += '<label for="' + idOfSelectField + '">' + fldCaption + '</label>';
                    } else
                        editHtml += '<label for="' + idOFtheField + '">' + fldCaption + '</label>';

                    //Adding for allow empty in edit mode
                    if (isAllowEmpty === 'F' || (purpose != undefined && purpose.length > 0 && purpose != " ")) {
                        editHtml += "<span class='fld-wrap2'>";
                        if (isAllowEmpty === 'F')
                            editHtml += "<span class='allowempty'>*</span>";
                        if (purpose != undefined && purpose.length > 0 && purpose != " ")
                            editHtml += "<i tabindex='-1' style='cursor: pointer; outline: none;' data-trigger='hover' class='icon-arrows-question' id='ico_cl'  data-toggle='popover'  data-content='" + purpose + "' data-placement='right'></i>"
                        editHtml += "</span>";
                        editHtml += "</div>";
                    }


                    if (typeOfField == "hidden") {
                        var axpfilePath = "";
                        if (idOFtheField.toLowerCase().startsWith("axpfilepath_")) {
                            var endPart = idOFtheField.substring(("axpfilepath_").length);
                            axpfilePath = "axpFilePath_" + endPart + " axpFilePathFld ";
                            editHtml += '<div style="display:none;"><input style="height:0px;width:0px;" id="' + idOFtheField + '" type="hidden" value="' + valueOfField + '" class="' + axpfilePath + '" name="' + idOFtheField + '"></div>';
                        } else
                            editHtml += '<div style="display:none;"><input style="height:0px;width:0px;" id="' + idOFtheField + '" type="hidden" value="' + valueOfField + '" name="' + idOFtheField + '"></div>';
                    } else if (typeOfField == 'picklist') {
                        var hiddenFiledData = presentLabel.data('hidden').split('~'); //pickIdVal_itemcode001F2~16829000000000
                        //IF its from fill grid adding id's manually
                        if (hiddenFiledData[0] == "") {
                            hiddenFiledData[0] = "pickIdVal_" + idOFtheField;
                            hiddenFiledData[1] = "";
                        }

                        editHtml += '<div>';
                        editHtml += '<nobr>';
                        editHtml += '<span class="picklist input-group ">';
                        if (isFieldDisable) {
                            editHtml += '<input disabled type="text" id="' + idOFtheField + '" title="" name="' + idOFtheField + '" value="' + valueOfField + '" maxlength="' + maxlength + '" class="tem inputClass2 pixelwidth form-control flddis" style="' + inlineStyle + gsiHeight + '">';
                        } else {
                            editHtml += '<input type="text" id="' + idOFtheField + '" title="" name="' + idOFtheField + '" value="' + valueOfField + '" maxlength="' + maxlength + '" class="tem inputClass2 pixelwidth form-control" style="' + inlineStyle + gsiHeight + '">';
                        }

                        editHtml += '<span class="input-group-addon handCur pickimg " id="img~' + idOFtheField + '" name="img~' + idOFtheField + '">';
                        editHtml += '<i class="glyphicon glyphicon-search icon-basic-magnifier"></i>';
                        editHtml += '</span>';
                        editHtml += '<div class="picklisttxtclear icon-arrows-remove" title="Clear Text" style="position: absolute;right: 39px;z-index: 3;font-size: 22px;font-weight: bold;color: black"></div>';
                        editHtml += '<input type="hidden" id="' + hiddenFiledData[0] + '" value="' + hiddenFiledData[1] + '" name="' + hiddenFiledData[0] + '">';
                        editHtml += '</span>';
                        editHtml += '</nobr>';
                        editHtml += '</div>';
                        //editHtml += '</div>';

                    } else if (typeOfField == "input" || typeOfField == "numeric") {
                        var classes = "";
                        var timepicker = "";
                        var axpfilePath = "";
                        let dwbfieldName = GetFieldsName(idOFtheField);
                        let dwbfldInd = GetFieldIndex(dwbfieldName);
                        var fldDType = GetDWBFieldType(idOFtheField, dwbfldInd);
                        if (idOFtheField.indexOf("axptm_", 0) === 0 || idOFtheField.indexOf("axpdbtm_", 0) === 0 || (fldDType != "" && fldDType.toLowerCase() == "time")) {
                            if (TimeFieldPattern(idOFtheField))
                                timepicker = " tstOnlyTime24hours flatpickr-input ";
                            else
                                timepicker = " tstOnlyTime flatpickr-input ";
                        } else if (idOFtheField.toLowerCase().startsWith("axpfilepath_")) {
                            var endPart = idOFtheField.substring(("axpfilepath_").length);
                            axpfilePath = " axpFilePath_" + endPart + " axpFilePathFld ";
                        } else if (idOFtheField.toLowerCase().startsWith("barqr_")) {
                            editHtml += `<div class="divBarQrScan input-group-text p-2 cursor-pointer"><span class="material-icons material-icons-style material-icons-1">center_focus_weak</span></div>`;
                        }
                        typeOfField == "numeric" ? classes = "tem form-control  Family number" : classes = axpfilePath + "tem form-control  Family " + timepicker;
                        editHtml += '<div>';
                        if (timepicker != "")
                            editHtml += '<span class="input-group">';
                        if (fldDType == "Table") {
                            editHtml += '<div class="input-group">';
                            classes = "fldCustTable " + classes;
                        }
                        if (isFieldDisable) {
                            editHtml += '<input disabled id="' + idOFtheField + '" name="' + idOFtheField + '" title="" value="' + valueOfField + '" maxlength="' + maxlength + '"  class="' + classes + ' flddis" style="' + inlineStyle + gsiHeight + '" type="text">';
                        } else {
                            editHtml += '<input id="' + idOFtheField + '" name="' + idOFtheField + '" title="" value="' + valueOfField + '" maxlength="' + maxlength + '" class="' + classes + '" style="' + inlineStyle + gsiHeight + '" type="text">';
                        }
                        if (timepicker != "") {
                            editHtml += '<span class="input-group-text" data-toggle=""><span class="material-icons material-icons-style cursor-pointer fs-4">schedule</span></span>';
                            editHtml += '</span>';
                        }
                        if (fldDType == "Table")
                            editHtml += '<span class="input-group-text"><span class="material-icons material-icons-style cursor-pointer fs-4 fldCustTableIcon" data-clk="' + idOFtheField + '-tbl">apps</span></span></div>';
                        editHtml += '</div>';
                    } else if (typeOfField == "datepicker") {
                        editHtml += '<div>';
                        editHtml += '<span class="input-group">';
                        if (isFieldDisable) {
                            editHtml += '<input disabled id="' + idOFtheField + '" name="' + idOFtheField + '" title="" value="' + valueOfField + '" maxlength="' + maxlength + '" class="tem Family form-control date flatpickr-input flddis" style="' + inlineStyle + gsiHeight + '" type="text">';
                        } else {
                            editHtml += '<input id="' + idOFtheField + '" name="' + idOFtheField + '" title="" value="' + valueOfField + '" maxlength="' + maxlength + '" class="tem Family form-control date flatpickr-input " style="' + inlineStyle + gsiHeight + '" type="text">';
                        }
                        editHtml += '<span class="input-group-text spandate" id="basic-addon2"><span class="material-icons material-icons-style cursor-pointer fs-4">calendar_today</span></span>';
                        editHtml += '</span>';
                        editHtml += '</div>';
                    } else if (typeOfField == "select") {
                        var idOfSelectField = idOFtheField.substr(5); //txtA~disctype001F2
                        var selectMarkup = $j("#" + idOfSelectField).html();
                        editHtml += '<div>';
                        if (isFieldDisable) {
                            editHtml += '<select disabled id="' + idOfSelectField + '" class="form-control flddis" style="' + gsiHeight + '">';
                        } else {
                            editHtml += '<select id="' + idOfSelectField + '" class="form-control" style="' + gsiHeight + '">';
                        }
                        editHtml += selectMarkup;
                        editHtml += '</select>';
                        editHtml += '</div>';


                    } else if (typeOfField == 'axpbtn') {
                        idOFtheField = $j('#' + idOFtheField).prev('a').attr('id');
                        editHtml += '<div>';
                        editHtml += '<a href="javascript:void(0)" style="cursor :pointer;' + gsiHeight + '" class="Grdlnk axpBtn" id="' + idOFtheField + '">' + textOfTheField + '</a>';
                        editHtml += '</div>';
                    } else if (typeOfField == 'axpbtncustom') {
                        idOFtheField = $j('#' + idOFtheField).prev('a').attr('id');
                        editHtml += '<div>';
                        editHtml += '<a href="javascript:void(0)" style="cursor :pointer;' + gsiHeight + '" class="Grdlnk axpBtnCustom" id="' + idOFtheField + '">' + textOfTheField + '</a>';
                        editHtml += '</div>';
                    } else if (typeOfField == 'gridattach') {
                        var hdnScriptsUrlPath = $j("#hdnScriptsUrlpath");
                        var lastIndexF = idOFtheField.lastIndexOf("F"); //AxpFin_F2001F12
                        var rowNo = idOFtheField.substr(lastIndexF - 3, 3); //001
                        fileLinks = "";
                        editHtml += '<div style="' + gsiHeight + '">';
                        editHtml += '<input type="hidden" id="' + idOFtheField + '" tabindex="-1" name="' + idOFtheField + '" value="' + valueOfField + '" class="grdAttach handCur">'; //axp_gridattach_2001F2   endIdPart
                        if (!idOFtheField.toLowerCase().startsWith("axpfile_")) {
                            //editHtml += ' <div id="GridAttach' + endIdPart + '" class="grdattch" name="GridAttach' + endIdPart + '"><span id="grdAtt_img_' + endIdPart + '"  tabindex="0" title="Attach Files" class=\"fa fa-paperclip\" onclick="ShowGridAttachPopUp(this);" class="grdAttach handCur" ></span>';
                            editHtml += ' <div id="GridAttach' + idOFtheField + '" class="grdattch" name="GridAttach' + endIdPart + '"><span id="grdAtt_img_' + endIdPart + '"  tabindex="0" title="Attach Files" class=\"fa fa-paperclip\" onclick="ShowGridAttachPopUp(this);" class="grdAttach handCur" ></span>';
                            if (valueOfField != "")
                                editHtml += ConstructGridAttachHTML(idOFtheField, rowNo, valueOfField, hdnScriptsUrlPath);

                            editHtml += '<a href="0" id="grdAtt_hlnk_' + endIdPart + '" tabindex="-1" class="grdAttach handCur"></a>';
                        } else {
                            editHtml += ' <div id="GridAxpFile' + idOFtheField + '" class="grdattch" name="GridAxpFile' + endIdPart + '"><span id="GridAxpFileAtt_' + idOFtheField + '"  tabindex="0" title="Attach Files" class=\"fa fa-paperclip\" onclick="ShowAxpFileAttachPopUp(this);" class="grdAttach handCur" ></span>';
                            if (valueOfField != "")
                                editHtml += ConstructAxpFileAttachHTML(idOFtheField, rowNo, valueOfField, hdnScriptsUrlPath);
                            editHtml += '<a href="0" id="axpFileAtt_hlnk_' + endIdPart + '" tabindex="-1" class="grdAttach handCur"></a>';
                        }
                        editHtml += '</div>';
                        editHtml += '</div>';
                    } else if (typeOfField == 'checkbox') {
                        var isCompMode = false;
                        if (($("#ckbCompressedMode").length && $("#ckbCompressedMode").prop('checked') == true) || ($j("#hdnCompMode").length && $j("#hdnCompMode").val().toLowerCase() == "true")) isCompMode = true;
                        if (isCompMode)
                            editHtml += '<div style="min-height: 23px;">';
                        // else
                        // editHtml += '<div style="min-height: 30px;">';

                        editHtml += '<input id="' + idOFtheField + '" name="' + idOFtheField + '" title="" alt="' + presentLabel.data('hidden') + '" value="' + valueOfField + '" class="gridchk Family " style="' + inlineStyle + gsiHeight + '" type="checkbox"';
                        if (isFieldDisable) editHtml += ' disabled readonly ';
                        if (valueOfField.toLowerCase() == 'yes') editHtml += ' checked="checked" ';
                        editHtml += ' ></input>'
                        editHtml += '<span class="gridChkSpan">' + fldCaption + '</span></label>';
                        editHtml += '</div>';

                    } else if (typeOfField == "textarea") {
                        editHtml += '<div>';
                        if (isFieldDisable) {
                            editHtml += '<textarea  id="' + idOFtheField + '" name="' + idOFtheField + '" title="" disabled readonly maxlength="' + maxlength + '" class="tem form-control Family disabled" style="' + inlineStyle + gsiHeight + '" >' + valueOfField + '</textarea>';
                        } else {
                            editHtml += '<textarea  id="' + idOFtheField + '" name="' + idOFtheField + '" title="" value="' + valueOfField + '" maxlength="' + maxlength + '" class="tem form-control  Family " style="' + inlineStyle + gsiHeight + '" >' + valueOfField + '</textarea>';
                        }
                        editHtml += '</div>';
                    } else if (typeOfField.indexOf("fromselect") != -1) {
                        editHtml += '<div>';
                        editHtml += '<div class="autoinput-parent">';

                        let typeOfAutoComFld = typeOfField.split("~");
                        let auRefreshOnSave = typeOfAutoComFld[1] && typeOfAutoComFld[1] === "isrefreshsave" ? "isrefreshsave" : "";
                        typeOfField = typeOfAutoComFld[0];

                        var classesToAdd = "";
                        typeOfField == "fromselect-pick" ? classesToAdd = "" : classesToAdd = "fastdll";
                        var axpfilePath = "";
                        if (idOFtheField.toLowerCase().startsWith("axpfilepath_")) {
                            var endPart = idOFtheField.substring(("axpfilepath_").length);
                            axpfilePath = " axpFilePath_" + endPart + " axpFilePathFld ";
                        }
                        if (isFieldDisable) {
                            editHtml += '<input disabled type="text" data-type="autocomplete" id="' + idOFtheField + '" name="' + idOFtheField + '" title="" value="' + valueOfField + '" maxlength="' + maxlength + '" class="tem fldFromSelect pixelwidth form-control flddis ' + classesToAdd + " " + auRefreshOnSave + " " + axpfilePath + '" style="' + gsiHeight + '">';
                        } else {
                            editHtml += '<input type="text" ' + (isMobile ? 'onfocus="blur()"' : ' ') + ' data-type="autocomplete" id="' + idOFtheField + '" name="' + idOFtheField + '" title="" value="' + valueOfField + '" maxlength="' + maxlength + '" class="tem fldFromSelect pixelwidth form-control ' + classesToAdd + " " + auRefreshOnSave + " " + axpfilePath + '" style="' + gsiHeight + '">';
                        }
                        if (isMobile) {
                            editHtml += '<div class="virtualKeyboard"><i class="fa fa-keyboard-o" id="vkeyboard' + idOFtheField + '" title="vkeyboard"></i></div>';
                        }
                        editHtml += `<div class="autoclear ${typeOfField == "fromselect-pick" ? "advsearchexist" : ""} autoinputtxtclear">`;
                        if (isFieldDisable) {
                            editHtml += '<i class="glyphicon glyphicon-remove" id="clr' + idOFtheField + '" title="clear" name="clr' + idOFtheField + '" style="display:none"></i>';
                        } else {
                            editHtml += '<i class="glyphicon glyphicon-remove" id="clr' + idOFtheField + '" title="clear" name="clr' + idOFtheField + '"></i>';
                        }
                        editHtml += '</div>';
                        editHtml += '<div class="edit">';
                        if (isFieldDisable) {
                            editHtml += '<i class="glyphicon glyphicon-chevron-down autoClickddl" title="select" data-clk="' + idOFtheField + '" style="display:none"></i>';
                            if (typeOfField === "fromselect-pick")
                                editHtml += '<i style="display:none" class="glyphicon glyphicon-search fldavdsearch" title="adv. search"></i>';
                        } else {
                            editHtml += '<i class="glyphicon glyphicon-chevron-down autoClickddl" title="select" data-clk="' + idOFtheField + '"></i>';
                            if (typeOfField === "fromselect-pick")
                                editHtml += '<i class="glyphicon glyphicon-search fldavdsearch" title="adv. search"></i>';
                        }
                        editHtml += '</div>';
                        editHtml += '</div>';
                        editHtml += '<div style="display:none;" id="autoadv' + idOFtheField + '">';
                        editHtml += '<div class="name" data-advance="true">';
                        if (typeOfField == "fromselect-pick") {
                            editHtml += '<div class="leftico ico">';
                            editHtml += '<i class="glyphicon glyphicon-chevron-left" title="previous" data-fldname="' + idOFtheField + '" id="autoleft' + idOFtheField + '"></i>';
                            editHtml += '<i class="glyphicon glyphicon-chevron-right" title="next" data-fldname="' + idOFtheField + '" id="autoright' + idOFtheField + '"></i>';
                            editHtml += '</div>';
                            editHtml += '<div class="rightico">';
                            editHtml += '<i class="glyphicon glyphicon-search pickimg" title="adv. search" aria-hidden="true" id="img~' + idOFtheField + '" data-ids="' + idOFtheField + '" name="img~' + idOFtheField + '"></i>';
                            editHtml += '<input type="hidden" id="pickIdVal_' + idOFtheField + '" value="" name="pickIdVal_' + idOFtheField + '">';
                            editHtml += '</div>';
                        } else {
                            editHtml += '<div class="reload">';
                            editHtml += '<i class="glyphicon glyphicon-repeat" title="refresh" id="autorefresh' + idOFtheField + '" data-refresh="' + idOFtheField + '"></i>';
                            editHtml += '</div>';
                        }
                        editHtml += '</div>';
                        editHtml += '</div>';

                        editHtml += '</div>';
                    } else if (typeOfField.indexOf("multigroupselect") != -1) {
                        editHtml += '<div class="autoinput-parent dropdown-mul">';
                        var datasep = presentLabel.attr('data-sep');
                        if (valueOfField != "") {
                            valueOfField = valueOfField.replace(/#amp:/g, "&");
                            valueOfField = valueOfField.replace(/#apos:/g, "'")
                        }
                        let typeOfMgsFld = typeOfField.split("~");
                        let mgsRefreshOnSave = typeOfMgsFld[1] && typeOfMgsFld[1] === "isrefreshsave" ? "isrefreshsave" : "";
                        typeOfField = typeOfMgsFld[0];
                        if (isFieldDisable)
                            editHtml += '<select disabled data-type="multigroupselect" multiple data-selected="' + valueOfField + '" data-sep="' + datasep + '" id="' + idOFtheField + '" name="' + idOFtheField + '" title="" maxlength="' + maxlength + '" class="tem fldmultiSelect pixelwidth form-control ' + mgsRefreshOnSave + '" style=""></select>';
                        else
                            editHtml += '<select data-type="multigroupselect" multiple data-selected="' + valueOfField + '" data-sep="' + datasep + '" id="' + idOFtheField + '" name="' + idOFtheField + '" title="" maxlength="' + maxlength + '" class="tem fldmultiSelect pixelwidth form-control ' + mgsRefreshOnSave + '" style=""></select>';
                        if (valueOfField != "")
                            SetMultiSelectValue(idOFtheField, valueOfField);
                        editHtml += '</div>';
                    }

                    editHtml += '</div></div>';
                }
            }
        });
        editHtml += '</div>';
        editHtml += '<div class="clear"></div>';
        editHtml += '<div class="col-sm-12 editLayoutFooter">';
        editHtml += '<div class=\"GridHelpdiv\" style="margin-bottom: 10px;">';
        editHtml += '<i class="fa fa-question-circle" aria-hidden="true"></i> <span>Use <b>Ctrl+Left arrow</b> &amp; <b>Ctrl+Right arrow</b> to navigate between record(s).</span>';
        editHtml += '</div>';
        editHtml += '<div>';
        editHtml += '<div class="btn-group previousNextEditButton" role="group">';
        var previosRow = checkForTheRow("previous", parentTrElement.index(), dcNo);
        var nextRow = checkForTheRow("next", parentTrElement.index(), dcNo);

        if (previosRow === false) {
            editHtml += '<button title="Previous Record" class="btn prevRec coldbtn disabled" disabled="disabled" onclick="editThePreviousNextRow(\'\',\'' + dcNo + '\');">&lt; \ ' + prevlcm + '\</button>';
        } else {
            editHtml += '<button title="Previous Record" class="btn prevRec coldbtn cup"  onclick="editThePreviousNextRow(' + previosRow + ',\'' + dcNo + '\',\'prev\');">&lt; \ ' + prevlcm + '\</button>';
        }

        if (nextRow === false) {
            editHtml += '<button title="Next Record" class="btn nextRec coldbtn disabled"  disabled="disabled" onclick="editThePreviousNextRow(\'\',\'' + dcNo + '\');">\ ' + nextlcm + '\ &gt;</button>';
        } else {
            editHtml += '<button title="Next Record" class="btn nextRec cup coldbtn" onclick="editThePreviousNextRow(' + nextRow + ',\'' + dcNo + '\',\'next\');">\ ' + nextlcm + '\ &gt;</button>';
        }
        editHtml += '</div>';
        editHtml += '<button title="Save & New Record" class="btn hotbtn" id="newRecordBtn' + dcNo + '" onclick="addTheValuesToGrid(' + dcNo + ',this,' + parentTrElement.index() + ')">\ ' + savenewlcm + '\</button>';
        if (isMobile)
            editHtml += '<button title="Save the record" class="btn hotbtn" id="editUpdateButton' + dcNo + '" style="margin-right:5px;" onclick="if(addTheValuesToGrid(' + dcNo + ',this,' + parentTrElement.index() + ',true)){clickTheEdit(\'' + rowNo + '\',\'' + dcNo + '\')}">\ ' + savelcm + '\</button>';
        editHtml += '</div>';
        editHtml += '</div>';
        if (!isMobile) {
            makeIdsEdit(parentTrElement, 'add');
            $j("#wrapperForEditFields" + dcNo).html(editHtml) /*.removeClass('hide')*/ ;
        } else if (isMobile) {
            $j("#wrapperForEditFields" + dcNo).html(editHtml); //.removeClass('hide');
            $("#wrapperForEditFields" + (dcNo)).removeClass("hide");
            $("#wrapperForEditFields" + (dcNo)).addClass("mobilewrapperForEditFields");
            if (axInlineGridEdit)
                $(".editWrapTr").hide();
            $(".editLayoutFooter").hide();

            if (mobileCardLayout == "none") {
                $(`#DivFrame${dcNo} .newgridbtn`).addClass("d-none");
                let gridButton = $(`#DivFrame${dcNo} .newgridbtn>ul`).html();
                $(`#wrapperForEditFields${dcNo}`).append(`<div class="clearfix"></div><div class="grdButtons btnMobile"><ul class="left">${gridButton}</ul</div>`);
                $(`#wrapperForEditFields${dcNo} .btnMobile`).find(`#viewGrid${dcNo}`).addClass("d-none");
            }
            $(".virtualKeyboard").click(function () {
                $(this).parent().children("input").attr("onfocus", function (index, attr) {
                    return attr == "blur()" ? null : "blur()";
                });
                $(this).parent().children("input").focus();
                $(this).children().toggleClass('green');
            });
        }
        showAttachmentPopover();
        if (!axInlineGridEdit && !isMobile) {
            //Forcefully updating serial no - 1 on edit in mobile
            //var rCnt = $j('#gridDc' + dcNo + ' tbody>tr').length ? 0 : $j('#gridHd' + dcNo + ' tbody>tr').length - 1;
            var rCnt = $j('#gridDc' + dcNo + ' tbody>tr').length ? 0 : $j('#gridHd' + dcNo + ' tbody>tr').length;
            $j("#hdnSlNoCnt" + dcNo).val(rCnt);
            $j("#lblSlNo" + rowNo + "F" + dcNo).text(rCnt);
            createBlurEventOnLastElem(dcNo);
            SetRowCount(dcNo, rCnt, "d", undefined);
            //SetRowCount(dcNo, lastRow, "d", undefined)
        }
    }

    CheckShowHideFldsGrid(dcNo.toString());
    checkSpecialCharacters("", "decode", dcNo);
    createBlurEventOnLastElem(dcNo);
    assignShortCuts(dcNo);
    if (!axInlineGridEdit && AxpGridForm != "form") {
        var arrEditDiv = new Array();
        arrEditDiv.push("#wrapperForEditFields" + dcNo);
        AssignJQueryEvents(arrEditDiv);
    }
    makeFieldInitCap(dcNo);
    var fields = GetGridFields(dcNo);
    CheckAxpvalid(dcNo, rowNo, fields);
    EvaluateSetFont(dcNo);
    if (elem == "" && !isMobile && AxpGridForm != "form") {
        if (typeof wsPerfEnabled != "undefined" && wsPerfEnabled)
            CallEvaluateOnAddPerf(dcNo, rowNo, fields, "ToCheckAddRow");
        else
            CallEvaluateOnAdd(dcNo, rowNo, fields, "ToCheckAddRow");
    }

    setModalFooterInEdit(dcNo);
    fromNextPrevious = false;
    hideacoptions();
    if (!isMobile && AxpGridForm != "form") {
        $("#bootstrapModalData input,select,textarea").off("change.dirty");
        $("#bootstrapModalData input,select,textarea").on("change.dirty", function () {
            isGrdEditDirty = true;
        })

        $('#bootstrapModal').ready(function () {
            if (lastFocusabbleElem) {
                $("#wrapperForEditFields" + AxEditActiveDcNo).find("[id='" + lastFocusabbleElem + rowNo + "F" + AxEditActiveDcNo + "']").focus();
            } else {
                FocusOnFirstField(AxEditActiveDcNo);
            }
            $('.lblprevious').html(eval(callParent('lcm[298]'))).prepend(' &lt; ');
            $('.lblNext').html(eval(callParent('lcm[299]'))).append(' &gt; ');
            $('.lblSaveNew').html(eval(callParent('lcm[300]')));
            $('.lblSaveRec').html(eval(callParent('lcm[200]')));
            $('.lblCancel').html(eval(callParent('lcm[192]')));
            $("#wrapperForEditFields" + dcNo).find(".editWrapTr").addClass("grid-stack");
            setDesignedLayout("#bootstrapModalData");
            customAlignTstructFlds([], dcNo, parseInt(rowNo)); //field alignment based on configuation
            try {
                AxAfterPopupAddRow(dcNo, rowNo);
            } catch (e) {}
        });
    } else if ((!isMobile && AxpGridForm == "form") || (isMobile && mobileCardLayout != "none")) {
        addRowFormGrid(dcNo, rowNo);
        //if (rowNo.toString().length == 3) {// || formGridRowDele[dcNo] == "true") {
        if (rowNo.toString().length == 3 && !isLoadDataRow) {
            if (typeof wsPerfEnabled != "undefined" && wsPerfEnabled)
                CallEvaluateOnAddPerf(dcNo, rowNo, fields, "ToCheckAddRow");
            else
                CallEvaluateOnAdd(dcNo, rowNo, fields, "ToCheckAddRow");
        }
    } else {
        $("#wrapperForEditFields" + dcNo).removeClass(".editWrapTr");
    }
}


function assignShortCuts(dcNo) {
    $("#wrapperForEditFields" + dcNo).off('keydown.shortCutsKD')
    $("#wrapperForEditFields" + dcNo).on('keydown.shortCutsKD', function (e) {
        if (e.ctrlKey) {
            if (e.keyCode == 39) {
                e.preventDefault();
                $("#wrapperForEditFields" + dcNo + " .previousNextEditButton .nextRec").click();
            } else if (e.keyCode == 37) {
                e.preventDefault();
                $("#wrapperForEditFields" + dcNo + " .previousNextEditButton .prevRec").click();
            }
            if (isMobile && e.keycode == 83) {
                e.preventdefault();
                $("#editUpdateButton" + dcNo).click();
            }
        }
    });
}


function createBlurEventOnLastElem(dcNo, task) {
    var lastElem = $("#wrapperForEditFields" + dcNo).find(":focus:not('button')").last();
    if (lastElem.length == 0) {
        lastElem = $("#wrapperForEditFields" + dcNo).find(":focus:not('button')");
    }
    var nextBtn = $("#wrapperForEditFields" + dcNo + " .previousNextEditButton .nextRec");
    var prevBtn = $("#wrapperForEditFields" + dcNo + " .previousNextEditButton .prevRec");
    var closeBttn = $("#bootstrapModal .modal-header button.close");
    var gridFrstElem = getFirstFocusElement("#wrapperForEditFields" + dcNo);
    if (gridFrstElem != undefined) {
        if (task != 'close' && !isMobile)
            gridFrstElem.focus();
        $(lastElem).add(gridFrstElem).off('keydown.lastElemKDandFirstElemKD').on('keydown.lastElemKDandFirstElemKD', function (e) {
            //alert("me");
            if (e.keyCode == 9) {

                if ($(lastElem).is($(gridFrstElem))) {
                    if (!e.shiftKey) {
                        gridFrstElem = "";
                    } else {
                        lastElem = "";
                    }
                }

                if (lastEditAction == "next" || lastEditAction == "prev") {
                    if (!(nextBtn.is(":disabled")) && nextBtn.length > 0) {
                        //if clicked on edit mode :not last row
                        if ($(this).is(lastElem)) {
                            if (!e.shiftKey) {
                                e.preventDefault();
                                nextBtn.focus();
                                $(nextBtn).off('keydown.nextElemKD').on('keydown.nextElemKD', function (e) {
                                    if (e.shiftKey && e.keyCode == 9 && lastElem.length > 0) {
                                        e.preventDefault();
                                        lastElem.focus();
                                    }
                                })

                                if (!(prevBtn.is(":disabled")) && prevBtn.length > 0) {
                                    $(document).off("keydown.cancelBtnKD").on("keydown.cancelBtnKD", "#editCancelButton" + dcNo, function (e) {
                                        if (!e.shiftKey && e.keyCode == 9) {
                                            e.preventDefault();
                                            prevBtn.focus();
                                        }
                                    });

                                    $(prevBtn).off("keydown.prevBtnKD").on("keydown.prevBtnKD", function (e) {
                                        //prevBtn.focus();
                                        if (!e.shiftKey && e.keyCode == 9 && closeBttn.length > 0) {
                                            e.preventDefault();
                                            closeBttn.focus();
                                        } else if (e.shiftKey && e.keyCode == 9 && $("#editCancelButton" + dcNo).length > 0) {
                                            e.preventDefault();
                                            $("#editCancelButton" + dcNo).focus();
                                        }

                                    });

                                    $(closeBttn).off("keydown.closeBttnKD").on("keydown.closeBttnKD", function (e) {
                                        if (!e.shiftKey && e.keyCode == 9 && gridFrstElem.length > 0) {
                                            e.preventDefault();
                                            gridFrstElem.focus();
                                        } else if (e.shiftKey && e.keyCode == 9 && prevBtn.length > 0) {
                                            e.preventDefault();
                                            prevBtn.focus();
                                        }

                                    });

                                    $(gridFrstElem).off("keydown.grdFrstElemKD").on("keydown.grdFrstElemKD", function (e) {
                                        if (e.shiftKey && e.keyCode == 9 && closeBttn.length > 0) {
                                            e.preventDefault();
                                            closeBttn.focus();
                                        }
                                    })
                                } else {
                                    $(document).off("keydown.cancelBtnKD").on("keydown.cancelBtnKD", "#editCancelButton" + dcNo, function (e) {
                                        if (!e.shiftKey && e.keyCode == 9) {
                                            e.preventDefault();
                                            closeBttn.focus();
                                        }
                                    });

                                    $(closeBttn).off("keydown.closeBttnKD").on("keydown.closeBttnKD", function (e) {
                                        if (!e.shiftKey && e.keyCode == 9 && gridFrstElem.length > 0) {
                                            e.preventDefault();
                                            gridFrstElem.focus();
                                        } else if (e.shiftKey && e.keyCode == 9 && $("#editCancelButton" + dcNo).length > 0) {
                                            e.preventDefault();
                                            $("#editCancelButton" + dcNo).focus();
                                        }

                                    });

                                    $(gridFrstElem).off("keydown.grdFrstElemKD").on("keydown.grdFrstElemKD", function (e) {
                                        if (e.shiftKey && e.keyCode == 9) {
                                            e.preventDefault();
                                            closeBttn.focus();
                                        }
                                    })
                                }
                            }
                        } else if ($(this).is(gridFrstElem)) {
                            if (e.shiftKey) {
                                e.preventDefault();
                                closeBttn.focus();
                                $(closeBttn).off("keydown.closeBttnKD").on("keydown.closeBttnKD", function (e) {
                                    if (!e.shiftKey && e.keyCode == 9 && gridFrstElem.length > 0) {
                                        e.preventDefault();
                                        gridFrstElem.focus();
                                    } else if (e.shiftKey && e.keyCode == 9 && prevBtn.length > 0) {
                                        e.preventDefault();
                                        prevBtn.focus();
                                    }

                                });
                                $(nextBtn).off('keydown.nextElemKD').on('keydown.nextElemKD', function (e) {
                                    if (e.shiftKey && e.keyCode == 9 && lastElem.length > 0) {
                                        e.preventDefault();
                                        lastElem.focus();
                                    }
                                })

                                if (!(prevBtn.is(":disabled")) && prevBtn.length > 0) {
                                    $(document).off("keydown.cancelBtnKD").on("keydown.cancelBtnKD", "#editCancelButton" + dcNo, function (e) {
                                        if (!e.shiftKey && e.keyCode == 9) {
                                            e.preventDefault();
                                            prevBtn.focus();
                                        }
                                    });

                                    $(prevBtn).off("keydown.prevBtnKD").on("keydown.prevBtnKD", function (e) {
                                        //prevBtn.focus();
                                        if (!e.shiftKey && e.keyCode == 9 && closeBttn.length > 0) {
                                            e.preventDefault();
                                            closeBttn.focus();
                                        } else if (e.shiftKey && e.keyCode == 9 && $("#editCancelButton" + dcNo).length > 0) {
                                            e.preventDefault();
                                            $("#editCancelButton" + dcNo).focus();
                                        }

                                    });
                                    $(gridFrstElem).off("keydown.grdFrstElemKD").on("keydown.grdFrstElemKD", function (e) {
                                        if (e.shiftKey && e.keyCode == 9 && closeBttn.length > 0) {
                                            e.preventDefault();
                                            closeBttn.focus();
                                        }
                                    });
                                }
                            }
                        }
                    } else if ($("#myGridDCAdd" + dcNo).is(":visible")) {
                        //old Add Button in Grid Events
                        if ($(this).is(lastElem)) {
                            if (!e.shiftKey) {
                                e.preventDefault();
                                $("#myGridDCAdd" + dcNo).focus();
                                $("#myGridDCAdd" + dcNo).off('keydown.gridDCAdd').on('keydown.gridDCAdd', function (e) {
                                    if (!e.shiftKey && e.keyCode == 9) {
                                        e.preventDefault();
                                        closeBttn.focus();
                                    } else if (e.shiftKey && e.keyCode == 9) {
                                        e.preventDefault();
                                        lastElem.focus();
                                    }
                                })

                                $(closeBttn).off("keydown.closeBttnKD").on("keydown.closeBttnKD", function (e) {
                                    //prevBtn.focus();
                                    if (!e.shiftKey && e.keyCode == 9 && gridFrstElem.length > 0) {
                                        e.preventDefault();
                                        gridFrstElem.focus();
                                    } else if (e.shiftKey && e.keyCode == 9 && prevBtn.length > 0) {
                                        e.preventDefault();
                                        $("#myGridDCAdd" + dcNo).focus();
                                    }

                                });
                            }

                        } else if ($(this).is(gridFrstElem)) {
                            if (e.shiftKey) {
                                e.preventDefault();
                                closeBttn.focus();

                                $(closeBttn).off("keydown.closeBttnKD").on("keydown.closeBttnKD", function (e) {
                                    if (!e.shiftKey && e.keyCode == 9 && gridFrstElem.length > 0) {
                                        e.preventDefault();
                                        gridFrstElem.focus();
                                    } else if (e.shiftKey && e.keyCode == 9 && $("#myGridDCAdd" + dcNo).length > 0) {
                                        e.preventDefault();
                                        $("#myGridDCAdd" + dcNo).focus();
                                    }

                                });

                                $("#myGridDCAdd" + dcNo).off('keydown.gridDCAdd').on('keydown.gridDCAdd', function (e) {
                                    if (!e.shiftKey && e.keyCode == 9) {
                                        e.preventDefault();
                                        closeBttn.focus();
                                    } else if (e.shiftKey && e.keyCode == 9) {
                                        e.preventDefault();
                                        lastElem.focus();
                                    }
                                })



                            }
                        }
                    } else {
                        //IF ITS DISABLED MEANIG WE ARE IN LAST ROW or adding first row in grid
                        var saveBtn = $("#editUpdateButton" + dcNo);
                        var saveNewBtn = $("button[id*='newRecordBtn" + dcNo + "']");
                        if ($(this).is(lastElem)) {
                            if (!e.shiftKey) {
                                e.preventDefault();
                                if (saveNewBtn.length > 0) {
                                    saveNewBtn.focus();
                                }

                                $(document).off("keydown.cancelBtnKD").on("keydown.cancelBtnKD", "#editCancelButton" + dcNo, function (e) {
                                    if (!e.shiftKey && e.keyCode == 9) {
                                        e.preventDefault();
                                        if (prevBtn.length > 0 && !prevBtn.is(":disabled")) {
                                            prevBtn.focus();
                                        } else {
                                            saveNewBtn.focus();
                                        }
                                    }
                                });


                                $(saveNewBtn).off("keydown.saveNewBtnKD").on("keydown.saveNewBtnKD", function (e) {
                                    if (!e.shiftKey && e.keyCode == 9 && closeBttn.length > 0) {
                                        e.preventDefault();
                                        closeBttn.focus();
                                    } else if (e.shiftKey && e.keyCode == 9 && prevBtn.length > 0 && prevBtn.is(":disabled")) {
                                        e.preventDefault();
                                        $("#editCancelButton" + dcNo).focus();
                                    }
                                })

                                $(closeBttn).off("keydown.closeBttnKD").on("keydown.closeBttnKD", function (e) {
                                    if (!e.shiftKey && e.keyCode == 9 && gridFrstElem.length > 0) {
                                        e.preventDefault();
                                        gridFrstElem.focus();
                                    } else if (e.shiftKey && e.keyCode == 9 && saveNewBtn.length > 0) {
                                        e.preventDefault();
                                        saveNewBtn.focus();
                                    }

                                });



                                $(saveNewBtn).off("keydown.saveBtnKD").on("keydown.saveBtnKD", function (e) {
                                    if (e.shiftKey && e.keyCode == 9 && lastElem.length > 0) {
                                        e.preventDefault();
                                        lastElem.focus();
                                    }
                                })



                                $(gridFrstElem).off("keydown.grdFrstElemKD").on("keydown.grdFrstElemKD", function (e) {
                                    if (e.shiftKey && e.keyCode == 9 && saveNewBtn.length > 0) {
                                        e.preventDefault();
                                        closeBttn.focus();
                                    }
                                })



                                $(prevBtn).off("keydown.prevBtnKD").on("keydown.prevBtnKD", function (e) {
                                    //prevBtn.focus();
                                    if (e.shiftKey && e.keyCode == 9 && $("#editCancelButton" + dcNo).length > 0) {
                                        e.preventDefault();
                                        $("#editCancelButton" + dcNo).focus();
                                    }

                                });
                            }
                        } else if ($(this).is(gridFrstElem)) {
                            if (e.shiftKey) {
                                e.preventDefault();
                                if (closeBttn.length > 0) {
                                    closeBttn.focus();
                                }

                                $(closeBttn).off("keydown.closeBttnKD").on("keydown.closeBttnKD", function (e) {
                                    if (!e.shiftKey && e.keyCode == 9 && gridFrstElem.length > 0) {
                                        e.preventDefault();
                                        gridFrstElem.focus();
                                    } else if (e.shiftKey && e.keyCode == 9 && saveNewBtn.length > 0) {
                                        e.preventDefault();
                                        saveNewBtn.focus();
                                    }

                                });

                                $(saveNewBtn).off("keydown.saveNewBtnKD").on("keydown.saveNewBtnKD", function (e) {
                                    if (!e.shiftKey && e.keyCode == 9 && closeBttn.length > 0) {
                                        e.preventDefault();
                                        closeBttn.focus();
                                    } else if (e.shiftKey && e.keyCode == 9 && closeBttn.length > 0 && prevBtn.length > 0 && prevBtn.is(":disabled")) {
                                        $("#editCancelButton" + dcNo).focus();
                                    }
                                })



                                $(prevBtn).off("keydown.prevBtnKD").on("keydown.prevBtnKD", function (e) {
                                    //prevBtn.focus();
                                    if (e.shiftKey && e.keyCode == 9 && $("#editCancelButton" + dcNo).length > 0) {
                                        e.preventDefault();
                                        $("#editCancelButton" + dcNo).focus();
                                    }

                                });

                                $(document).off("keydown.cancelBtnKD").on("keydown.cancelBtnKD", "#editCancelButton" + dcNo, function (e) {
                                    if (!e.shiftKey && e.keyCode == 9 && prevBtn.length > 0) {
                                        e.preventDefault();
                                        prevBtn.focus();
                                    }
                                });

                                $(saveNewBtn).off("keydown.saveBtnKD").on("keydown.saveBtnKD", function (e) {
                                    if (e.shiftKey && e.keyCode == 9 && lastElem.length > 0) {
                                        e.preventDefault();
                                        lastElem.focus();
                                    }
                                })


                            }
                        }
                    }
                }
                if (gridFrstElem == "") {
                    gridFrstElem = lastElem;
                } else if (lastElem == "") {
                    lastElem = gridFrstElem;
                }
            }
        });
    }
}

function checkSpecialCharacters(str, type, dcNo) {
    if (type == 'encode') {
        str = str.replace(/&/g, "\#amp:")
        str = str.replace(/</g, "\#lt:")
        str = str.replace(/>/g, "\#gt:")
        str = str.replace(/'/g, "\#apos:")
        str = str.replace(/"/g, "\#quot:")
    } else {
        $("#wrapperForEditFields" + dcNo + " input, #wrapperForEditFields" + dcNo + " textarea").each(function () {
            str = $(this).val();
            str = str.replace(/#amp:/g, "&");
            str = str.replace(/#lt:/g, "<");
            str = str.replace(/#gt:/g, ">");
            str = str.replace(/#apos:/g, "'");
            str = str.replace(/#quot:/g, '"');
            $(this).val(str);
        });
    }

    return str;
}

function cancelTheEdit(dcNo, elem, indexOfTheElement) {
    globalOnlySave = false;
    var nextPreviousFlag = false;
    if (editDivId != "") {
        if (typeof indexOfTheElement == "undefined" || indexOfTheElement === "") {
            indexOfTheElement = getTableRowIndex(dcNo);
        }
        if (fromNextPrevious) {
            nextPreviousFlag = true;
            fromNextPrevious = false;
        } else {
            nextPreviousFlag = false;
            $("#bootstrapModal").modal("hide");
        }
        var newEditVals = "";
        if (oldEditValues != "")
            newEditVals = GetEditNewValues(AxEditActiveDcNo);
        $j(".wrapperForGridData" + dcNo + " tbody tr.inEditMode").find('.glyphicon').removeClass('disabled').removeAttr('disabled');
        $j(".wrapperForGridData" + dcNo + " tbody tr.inEditMode").find('.gridEditDeleteBtns').removeClass('disabled').removeAttr('disabled');
        $j(".wrapperForGridData" + dcNo + " tbody tr.inEditMode").removeClass('inEditMode');
        if (typeof indexOfTheElement != "undefined" && indexOfTheElement !== "") {
            var trElem = $j(".wrapperForGridData" + dcNo + " tbody tr").eq(indexOfTheElement);
            makeIdsEdit(trElem);
        }
        //var gridFrstElem = $("#gridHd" + dcNo).find(":focusable").first();
        var gridFrstElem = getFirstFocusElement("#wrapperForEditFields" + dcNo);
        var prevBtn = $("#wrapperForEditFields" + dcNo + " .previousNextEditButton .prevRec");
        var nextBtn = $("#wrapperForEditFields" + dcNo + " .previousNextEditButton .nextRec");
        var lastElem = $("#wrapperForEditFields" + dcNo).find(":focusable:not('button')").last();
        if (lastElem.length == 0) {
            lastElem = $("#wrapperForEditFields" + dcNo).find(":focusable:not('button')");
        }
        var closeBttn = $("#bootstrapModal .modal-header button.close");
        var saveBtn = $("#editUpdateButton" + dcNo);
        var saveNewBtn = $("#newRecordBtn" + dcNo);
        $(gridFrstElem).off('keydown.grdFrstElemKD');
        $(prevBtn).off('keydown.prevBtnKD');
        //$(document).off('keydown.cancelBtnKD', "#editCancelButton" + dcNo);
        $(nextBtn).off('keydown.nextElemKD');
        $(lastElem).add(gridFrstElem).off('keydown.lastElemKDandFirstElemKD');
        $("#wrapperForEditFields" + dcNo).off('keydown.shortCutsKD');
        $(closeBttn).off("keydown.closeBttnKD");
        $("#myGridDCAdd" + dcNo).off("keydown.gridDCAdd");
        $(saveNewBtn).off("keydown.saveNewBtnKD");
        $(saveBtn).off("keydown.saveBtnKD");
        //addRowEnabled ?
        if (typeof indexOfTheElement != "undefined" && indexOfTheElement !== "") {
            if ($j("#dummyWrapperForEditFields" + dcNo).length > 0) {
                $j("#wrapperForEditFields" + dcNo).replaceWith($j("#dummyWrapperForEditFields" + dcNo).detach());
                $j("#dummyWrapperForEditFields" + dcNo).attr("id", "wrapperForEditFields" + dcNo).removeClass("hide");
                $j("#dummyWrapperForEditFields" + dcNo + " #dummynewRecordBtn" + dcNo).attr("id", "newRecordBtn" + dcNo);
                if (isMobile)
                    $j("#dummyWrapperForEditFields" + dcNo + " #dummyEditUpdateButton" + dcNo).attr("id", "editUpdateButton" + dcNo);
            } else {
                $j("#wrapperForEditFields" + dcNo).html(editElementObject);
            }
        }
        var arrEditDiv = new Array();
        arrEditDiv.push("#" + editDivId);
        AssignJQueryEvents(arrEditDiv);
        var clientRNoOnCancel = getNewEditRowNo(dcNo);
        if (!nextPreviousFlag) {
            UpdateFieldArray(axpIsRowValid + dcNo + clientRNoOnCancel + "F" + dcNo, GetDbRowNo(clientRNoOnCancel, dcNo), "false", "parent", "AddRow");
        }

        if (oldEditValues != "")
            updateEditFldValues(oldEditValues, newEditVals);
        $j("#wrapperForEditFields" + dcNo).find('.editLayoutFooter button').prop('disabled', false);
        editElementObject = "";
        editDivId = "";
        oldEditValues = "";
        AxEditActiveDcNo = "";
        AxEditActiveRowNo = "";
        $('#gridAddBtn' + dcNo).focus();
    } else {
        $("#bootstrapModal").modal("hide");
    }
    gridEditValidator = true;
}


function checkForTheRow(direction, index, dcNo) {
    var rowToCheck = false;
    if (direction == 'previous') {
        index == 0 ? rowToCheck = false : rowToCheck = index - 1;
    } else if (direction == 'next') {
        index == ($("#gridHd" + dcNo + " tbody tr").length - 1) ? rowToCheck = false : rowToCheck = index + 1;
    }
    return rowToCheck;
}

function editThePreviousNextRow(index, dcNo, task) {
    globalOnlySave = false;
    fromNextPrevious = true;
    if (index !== "") {
        lastFocusabbleElem = $(document.activeElement).attr("id");
        if (lastFocusabbleElem)
            lastFocusabbleElem = lastFocusabbleElem.substr(0, lastFocusabbleElem.length - 5);
        lastEditAction = task;
        $("#gridHd" + dcNo + " tbody tr").eq(index).find('[onclick^="editTheRow"]').click();
    }
}

function clickTheEdit(rowNO, dcNo) {
    if (typeof rowNO == "undefined" || rowNO == "") {
        if (globalClickTheEditRow != "") {
            rowNO = globalClickTheEditRow;
        } else {
            rowNO = getNewEditRowNo(dcNo);
        }
    }
    $("#sp" + dcNo + "R" + rowNO + "F" + dcNo).find('[onclick^="editTheRow"]').click();
}

//get 3 digit row no for the opened grid in edit mode.
function getNewEditRowNo(dcNo) {
    var rowParentId = $("#wrapperForEditFields" + dcNo + " .editWrapTr").attr("id");
    try {
        if (typeof rowParentId != "undefined")
            return rowParentId.substr(rowParentId.indexOf("R") + 1, 3);
        else
            return;
    } catch (ex) {
        console.log(ex.message);
    }
}

//get real table index in db for the opened grid in edit mode.
function getTableRowIndex(dcNo) {
    if ($(".wrapperForGridData" + dcNo + " table tbody tr").length > 0) {
        var rowParentId = $(".wrapperForGridData" + dcNo + " .inEditMode").attr("id");
        if (typeof rowParentId != "undefined") {
            return $(".wrapperForGridData" + dcNo + " table tbody tr").index($("#" + rowParentId));
        } else {
            //rowParentId = $("#bootstrapModal #bootstrapModalData #wrapperForEditFields2 .editWrapTr").attr("id");
            return;
        }
    } else {
        return "";
    }
}

function getLastPartOfId(stringId) {
    var lastIndexF = str.lastIndexOf("F"); //AxpFin_F2001F12
    var lastPartOfId = stringId.substr(lastIndexF - 3);
    return lastPartOfId;
}

function getHeaderName(dcNo, indexOfTheElement) {
    return $j(".wrapperForGridData" + dcNo + " thead tr th").eq(indexOfTheElement).html();
}

function makeIdsEdit(trElem, task) {
    $j(trElem).find('td').each(function (index, el) {
        var presentLabel = axInlineGridEdit ? $j(this).find('textarea.labelInp,label') : $j(this).find('textarea,label').last();
        var idOFtheField = presentLabel.attr('id');
        if (idOFtheField != undefined) {
            if (idOFtheField.indexOf("txtA~") !== -1) {
                if (axInlineGridEdit)
                    presentLabel = $j(this).find('select').first();
                else
                    presentLabel = $j(this).find('select');
                idOFtheField = presentLabel.attr('id');
            }
            if (!axInlineGridEdit && idOFtheField.indexOf("txt_axpBtn_") !== -1) {
                presentLabel = $j(this).find('a.axpBtn');
                idOFtheField = presentLabel.attr('id');
            }
            if (!axInlineGridEdit && idOFtheField.indexOf("txt_axpBtnCustom_") !== -1) {
                presentLabel = $j(this).find('a.axpBtnCustom');
                idOFtheField = presentLabel.attr('id');
            }

            if (axInlineGridEdit && task == "add" && idOFtheField.toString().startsWith('EDIT~')) {
                var type = $j(this).find('textarea').data('type');
                if (type == "hidden")
                    idOFtheField = idOFtheField.slice(5);
            }
            if (task == "add") {
                presentLabel.attr('id', 'EDIT~' + idOFtheField);
                if (idOFtheField.indexOf("_image") > -1 && $("#" + idOFtheField).parent().find("input").length > 0 && !axInlineGridEdit) {
                    $("#" + idOFtheField).parent().find("input").attr('id', 'EDIT~' + idOFtheField);
                    $(this).find("input").siblings(".grdattch").attr('id', 'EDIT~' + $(this).find("input").siblings(".grdattch").attr("id"));
                }
            } else {
                presentLabel.attr('id', idOFtheField.slice(5));
                if (idOFtheField.indexOf("_image") > -1 && $("#" + idOFtheField).parent().find("input").length > 0 && !axInlineGridEdit) {
                    $("#" + idOFtheField).parent().find("input").attr('id', idOFtheField.slice(5));
                    $(this).find("input").siblings(".grdattch").attr('id', 'EDIT~' + $(this).find("input").siblings(".grdattch").attr("id"));
                }
            }
        }
    });
}


//for file upload
$j("#testFile").change(function () {
    var inputFile = $j(this);
    if (inputFile[0].files.length > 0) {
        var type = inputFile[0].files[0].type;
        if (type != "") {
            var typeArray = type.split('/');
            if (typeArray[0] == 'image') {
                createImageTag(this);
            } else {
                showAlertDialog("warning", type)
            }
        }
    }
});

function createImageTag(input) {
    var reader = new FileReader();
    reader.onload = function (e) {
        var imagetag = "<img class='attachedImageGrid' src='" + e.target.result + "'/>";
        if ($j(".attachedImageGrid").length > 0) {
            $j(".attachedImageGrid").remove();
            $j(imagetag).insertAfter('#testFile');
        } else {
            $j(imagetag).insertAfter('#testFile');
        }
    }

    reader.readAsDataURL(input.files[0]);
}



function checkRowsExists(wrapperOfGridToCheck) {
    if (wrapperOfGridToCheck == "all") {
        $j(div).hasClass('[class^="wrapperForGridData"]');
        $j("div").each(function (index, el) {
            showAlertDialog("info", index)
        });
    }
}


function ValidateOnAddRow(gridDcNo) {

    for (var i = 0; i < FNames.length; i++) {
        var allowEmpty = GetFieldProp(i, "allowEmpty");
        var visible = GetFieldProp(i, "visible");
        dcNo = GetDcNo(FNames[i]);
        if (gridDcNo == dcNo) {

            if (FNames[i].toString().toLowerCase().indexOf('axpcurrencydec') && currdecVal != "") {
                showAlertDialog("warning", 2031, "client", currdecVal);
                return false;
            }
            if (allowEmpty.toLowerCase() == "f" && visible.toLowerCase() == "f") {

                var frmno = 0;
                var isGrid = IsGridField(FNames[i]);
                dcNo = GetDcNo(FNames[i]);

                if (isGrid == true) {

                    k = GetRowNoHelper(AxCurrGridRowNo);
                    if (IsAxFldEmpty(i, k, dcNo, "Edit") == false)
                        return false;
                }
            }
        }
    }
    return true;
}

$j(document).off("click", ".griddivColumn table tbody tr").on('click', ".griddivColumn table tbody tr", function (e) {
    if (e.target == undefined || e.target.className.indexOf("material-icons") >= 0 || e.target.className.indexOf("grdAttach") >= 0 || e.target.className.indexOf("rejectEdit") >= 0 || e.target.className.indexOf("gridEditDeleteBtns") > -1 || $(e.target).is(".gridHeader  a.axpBtn") || $(e.target).is(".gridHeader  a.axpBtnCustom")) {
        return false;
    } else if (e.target.className == "gridEditDeleteBtns" && isMobile) {
        $(e.target).find('.material-icons').click();
        return false;
    }
    var trElement = $j(this);
    //var dcNo = parseInt(trElement.attr('id').charAt(2));
    var dcNo = trElement.attr('id').substring(trElement.attr('id').lastIndexOf("F") + 1, trElement.attr('id').length);

    if (axInlineGridEdit) {
        if (!$(e.target).closest("tr").hasClass("inline-edit") && !$(e.target).hasClass("attach-popover") && !$(e.target).closest("tr").hasClass("disableTheRow")) {
            $("[inline-grid-warning]").removeAttr("inline-grid-warning");
            //var rowIndex = $(e.target).parent().parent().index();
            var rowIndex = $(e.target).closest("tr").index();
            var columnIndex = $(e.target).parent().index();
            inlineShiftKeyPressed = false;
            focusOnDeleteButton = false;
            var trId = trElement.attr("id");
            var editRowNo = trId.substring(trId.lastIndexOf("F") - 3, trId.lastIndexOf("F"));
            var fields = GetGridFields(dcNo);
            var isExitDummy = false;
            if (gridDummyRowVal.length > 0) {
                gridDummyRowVal.map(function (v) {
                    if (v.split("~")[0] == dcNo && v.split("~")[1] == editRowNo) isExitDummy = true;
                });
            }
            if (isExitDummy) {
                GetCurrentTime("Tstruct grid dc addrow button click(ws call)");
                AxActiveDc = dcNo;
                AxActiveRowNo = parseInt(editRowNo);
                if (!gridRowEditOnLoad) {
                    gridDummyRowVal.splice($.inArray(dcNo.toString() + "~" + editRowNo, gridDummyRowVal), 1);
                    gridDummyRows = false;
                    $j(".wrapperForGridData" + dcNo + " tbody tr.inEditMode").find('.gridEditDeleteBtns').removeClass('disabled').removeAttr('disabled');
                    CallEvaluateOnAddPerf(dcNo, editRowNo, fields, "AddRow");
                }
                //CallEvaluateOnAddPerf(dcNo, editRowNo, fields, "AddRow");
                navValidator = true;
            }
            if ($(e.target).closest("td") != null)
                inlineGridEdit(dcNo, $(e.target).closest("td"), columnIndex, rowIndex);
            else
                inlineGridEdit(dcNo, $(trElement).find("td .gridEditDeleteBtns").closest("td"), columnIndex, rowIndex); //convert the selected clicked row into editable row (selected row edit button will click)

            CheckAxpvalid(dcNo, editRowNo, fields);
        }
    } else if (!$(e.target).hasClass("attach-popover")) {
        trElement.find('td:first i.glyphicon.glyphicon-pencil.icon-software-pencil').click();
    }
})

function AddNewRowInDc(dcNo, calledFrom) {
    var wrapperForEditFields = "wrapperForEditFields" + dcNo;
    var rCnt = GetDcRowCount(dcNo);
    var i = parseInt(rCnt, 10);
    var strRowNo = GetRowNoHelper(i);
    var endIdPart = strRowNo + 'F' + dcNo;
    var rowId = "sp2R" + endIdPart;
    var deleteRowExists = false;
    var deleteRowHtml = "";

    ////checking for the first field for delete image
    // if ($j("#" + wrapperForEditFields + " .gridtdclass").first().find('a.rowdelete').length > 0) {
    //     deleteRowExists = true;
    //     deleteRowHtml = '<a id="del' + endIdPart + '" class="rowdelete" alt="Delete row" title="Delete row" style="cursor: default;"><img src="../axpimages/icons/16x16/delete-fade.png" title="Delete Row" alt="Delete row"></a>'
    // }
    var tableHtml = createGridHtmlFromEdit(dcNo, 'listView');
    // var editDeleteOpts = "<td " + (gridColOptVisibility("uniqueEditDeleteAct", dcNo) || IsTabDc(dcNo) ? "" : "style=\"display:none;\"") + "><a class=\"btn btn-sm btn-icon btn-white btn-color-gray-600 btn-active-primary me-2 shadow-sm gridEditDeleteBtns\" onclick='editTheRow(this," + dcNo + ",\"" + strRowNo + "\",event);' title=\"Edit\"><span class=\"material-icons material-icons-style material-icons-3\">edit</span></a>";
    // if (deleteRowExists)
    //     editDeleteOpts += "<a class=\"btn btn-sm btn-icon btn-white btn-color-gray-600 btn-active-primary me-2 shadow-sm gridEditDeleteBtns\" onclick='DeleteRow(" + dcNo + ", \"" + endIdPart + "\",this)' title=\"Delete\"><span class=\"material-icons material-icons-style material-icons-3\">delete</span></a>";
    // editDeleteOpts += "</td>";

    var editDeleteOpts = "<td class=\"text-center\"><span class=\"tem1\"><div class=\"form-check form-check-sm form-check-custom ms-2\"><input class=\"form-check-input border-gray-500 fgChk gridRowChk\" type=\"checkbox\" name=\"grdchkItemTd" + dcNo + "\" id=\"grdchkItemTd" + strRowNo + "F" + dcNo + "\" onclick=\"javascript:CheckboxGridRow(this," + dcNo + "," + strRowNo + ",event);\"></div></span></td>";

    var deleteHtml = "<td style='display:none;'>" + deleteRowHtml + "</td>";
    var slNoHtml = '<td ' + (gridColOptVisibility("uniqueThHead", dcNo) == false ? "style=\"display:none;\"" : (gridColOptVisibility("uniqueThHead", dcNo) || IsTabDc(dcNo)) ? "" : "style=\"display:none;\"") + '><label id="lblSlNo' + GetRowNoHelper(i) + 'F' + dcNo + '" class="form-control w-100 border bg-transparent overflow-hidden resize-none  slno">' + i + '</label></td>';
    $j(".wrapperForGridData" + dcNo + " tbody").append("<tr id='sp" + dcNo + "R" + endIdPart + "'>" + editDeleteOpts + deleteHtml + slNoHtml + tableHtml + "</tr>");

    changeEditLayoutIds(i, dcNo, 'listView');
    AddRow(dcNo, calledFrom);

    axpBtnClickEvent(rowId);
    setDesignedLayout("divDc" + dcNo);
    if (axInlineGridEdit) {
        setTimeout(function () {
            showAttachmentPopover();
            assignInlineGridEditEvent(dcNo);
        }, 500);
    }
}

function adjustEditLayoutId(dcNo) {
    //to adjust the edit layout id's based on now of rows added

    var wrapperForEditFields = "wrapperForEditFields" + dcNo;
    var wrapperForGridData = "wrapperForGridData" + dcNo;
    if ($j("." + wrapperForGridData + " tbody tr").length == 0) {
        changeEditLayoutIds(0, dcNo);
        UpdateLastRowNoOnDel(dcNo, "001");
        return;
    }
    try {
        var idOfPresentEdit = $j("#" + wrapperForEditFields + " .editWrapTr").attr('id'); //sp2R002F2
        idOfPresentEdit = idOfPresentEdit.substr(0, idOfPresentEdit.indexOf('F')); //sp2R002
        idOfPresentEdit = parseInt(idOfPresentEdit.substr(idOfPresentEdit.length - 3), 10); //2

        var idOfLastCol = $j("." + wrapperForGridData + " tbody tr:last").attr('id'); //sp2R002F2
        idOfLastCol = idOfLastCol.substr(0, idOfLastCol.indexOf('F')); //sp2R002
        idOfLastCol = parseInt(idOfLastCol.substr(idOfLastCol.length - 3), 10); //2
        var presentRowNo = GetFieldsRowNo($("#wrapperForEditFields" + dcNo + " .editWrapTr").attr('id'));
        var nextEditId = idOfLastCol + 1;
        var newRowNo = GetRowNoHelper(nextEditId);
        if (nextEditId != idOfPresentEdit) {
            changeEditLayoutIds(idOfLastCol, dcNo);
            UpdateLastRowNoOnDel(dcNo, presentRowNo, newRowNo)
        }
    } catch (Ex) {}
}

function UpdateLastRowNoOnDel(dcNo, rowNo, newRowNo) {
    var indx = -1;

    for (var i = 0; i < RowDcNo.length; i++) {

        if (newRowNo == undefined && RowDcNo[i] == dcNo && ClientRowNo[i] != rowNo) {
            indx = i;
            ClientRowNo[indx] = rowNo;
            break;
        } else if (RowDcNo[i] == dcNo && ClientRowNo[i] == rowNo) {
            indx = i;
            ClientRowNo[indx] = newRowNo;
            break;
        }
    }
}

function createGridHtmlFromEditPop(dcNo, calledFrom) {
    var wrapperForEditFields = "wrapperForEditFields" + dcNo;

    var rCnt = GetDcRowCount(dcNo);
    var i = parseInt(rCnt, 10);
    var strRowNo = GetRowNoHelper(i);
    var endIdPart = strRowNo + 'F' + dcNo;
    var tableHtml = "";
    var wrapperForEditFieldsIsHidden = false;


    if ($j("#" + wrapperForEditFields).hasClass("hide")) {
        wrapperForEditFieldsIsHidden = true;
        $j("#" + wrapperForEditFields).removeClass("hide");
    }

    var wrapperForGridData = "wrapperForGridData" + dcNo;
    $j("." + wrapperForGridData + " thead tr th").each(function (index, el) {
        var fldDataid = $j(this).attr("id");
        let dataid = "";
        if (typeof fldDataid != "undefined" && fldDataid.startsWith("th-") > 0)
            dataid = fldDataid.split('-')[1];
        var wrapFldId = $("#" + wrapperForEditFields).find("#dvGrid" + dataid)
        var currentElement = $j(wrapFldId);
        var idOFtheField = "";
        var valueOfTheField = "";
        var textOfTheField = "";
        var isFieldVisible = "";
        var maxlength = "";
        var inlineStyle = "";
        var hiddenData = "";
        var disableClass = ""; //flddis
        var inpValue = $j(wrapFldId).find('select,input,textarea,checkbox');
        var eleType = "";
        var displayClasses = "";

        if (inpValue.length > 0) {
            var idOfField = inpValue.attr('id');
            var fldType = inpValue.attr("type");
            var headerId = "";
            if (idOfField) {
                var lastIndexF = idOfField.lastIndexOf("F");
                if (idOfField.substr(lastIndexF, 3).length == 3) { //f12
                    //remove last 6 chars
                    headerId = "th-" + idOfField.substr(0, idOfField.length - 6);
                } else {
                    //remove last 5 chars
                    headerId = "th-" + idOfField.substr(0, idOfField.length - 5);
                }
            }
            if (headerId != "" && $("#" + headerId).length > 0) {
                displayClasses = $j(".wrapperForGridData" + dcNo + " thead tr th#" + headerId).attr("class");
            }
            displayClasses == undefined ? displayClasses = "" : "";
            //displayClasses = $j(".wrapperForGridData" + dcNo + " thead tr th").eq(index).attr("class");
            if (currentElement.find('span.picklist').length > 0) {
                eleType = 'pickList';
                hiddenData = currentElement.find('span.picklist input[type = hidden]').attr('id') + '~' + currentElement.find('span.picklist input[type = hidden]').val();
            } else if (currentElement.find('input.grdAttach').length > 0) {
                eleType = 'gridattach';
                isAttachMentExist = true;
            } else if (currentElement.find('input.tstOnlyTime').length > 0) {
                eleType = 'input';
            } else if (currentElement.find('input.tstOnlyTime24hours').length > 0) {
                eleType = 'input';
            } else if (currentElement.find('input.flatpickr-input').length > 0) {
                eleType = 'datepicker';
            } else if (inpValue.hasClass('fldFromSelect')) {
                inpValue.hasClass('fastdll') ? eleType = 'fromselect-select' : eleType = 'fromselect-pick';
                eleType = inpValue.hasClass('isrefreshsave') ? eleType + "~isrefreshsave" : eleType;
            } else if (inpValue.hasClass('fldmultiSelect')) {
                eleType = 'multigroupselect';
                eleType = inpValue.hasClass('isrefreshsave') ? eleType + "~isrefreshsave" : eleType;
            } else {
                eleType = inpValue[0].nodeName.toLowerCase();
                (eleType == "input" && inpValue[0].type == "checkbox") ? eleType = "checkbox": "";
                (eleType == "input" && inpValue.hasClass('number')) ? eleType = "numeric": "";
                hiddenData = '';
            }

            idOFtheField = inpValue.attr('id');
            if (calledFrom == 'listView')
                idOFtheField = idOFtheField.replace(GetFieldsRowFrameNo(idOFtheField), endIdPart);

            //checking for maxlength prop exists
            if (inpValue.attr('maxlength') != undefined)
                maxlength = inpValue.attr('maxlength');

            //checking for inline default css
            if (inpValue.attr('style') != undefined)
                inlineStyle = inpValue.attr('style');


            var gridVisible = $("#" + headerId).hasClass('none') ? true : (currentElement.css("display") == "none" ? false : $("#" + headerId).data("grid-visible") === undefined);
            var popupVisible = calledFrom === undefined ? currentElement.data('pop-visible') === undefined : gridVisible;

            //checking for field visibility
            if ((fldType != "hidden" || eleType === "gridattach") && ((!axInlineGridEdit && gridVisible) || axInlineGridEdit && gridVisible)) {
                isFieldVisible = true;
            } else {
                isFieldVisible = false;
                //eleType = 'hidden';
            }

            //checking if field is disable
            if (inpValue.hasClass('flddis') || (eleType == 'fromselect-pick' && inpValue.hasClass('pickdis')) || (eleType == 'fromselect-pick~isrefreshsave' && inpValue.hasClass('pickdis')))
                disableClass = 'flddis';
            else
                disableClass = '';

            if (calledFrom != 'listview') {
                if (eleType == "select") {
                    textOfTheField = inpValue.find("option:selected").text();
                    valueOfTheField = inpValue.find("option:selected").val();
                    valueOfTheField == "" ? valueOfTheField = textOfTheField : "";
                    valueOfTheField == '-- Select --' ? valueOfTheField = "" : "";
                } else if (eleType == "checkbox") {
                    var valuesOfCb = inpValue.attr("alt").split(",");
                    var trueCbVal = "",
                        falseCbVal = "";
                    valuesOfCb[0] != "" ? (trueCbVal = valuesOfCb[0], falseCbVal = valuesOfCb[1]) : (trueCbVal = valuesOfCb[1], falseCbVal = valuesOfCb[2]);
                    inpValue.is(":checked") ? valueOfTheField = textOfTheField = trueCbVal : valueOfTheField = textOfTheField = falseCbVal;
                    hiddenData = inpValue.attr("alt");
                } else if (eleType == "datepicker") {
                    inpValue.val().endsWith('/yyyy') ? textOfTheField = valueOfTheField = "" : textOfTheField = valueOfTheField = inpValue.val();
                } else if (eleType.indexOf("multigroupselect") != -1) {
                    textOfTheField = valueOfTheField = inpValue.attr("data-selected");
                } else {
                    textOfTheField = valueOfTheField = inpValue.val();
                }
            }

        } else if ($j(wrapFldId).find('a.axpBtn').length > 0) {
            var axpBtnElem = $j(wrapFldId).find('a.axpBtn');
            idOFtheField = axpBtnElem.attr('id');
            if (calledFrom != 'listview')
                valueOfTheField = textOfTheField = axpBtnElem.text();
            eleType = 'axpBtn';
            //if (axpBtnElem.is(':visible')) {
            isFieldVisible = true;
            //} else {
            //    isFieldVisible = false;
            //}
            hiddenData = "";
            maxlength = "";
            inlineStyle = axpBtnElem.attr('style');
            if (axpBtnElem.hasClass('flddis')) {
                disableClass = 'flddis';
            } else {
                disableClass = '';
            }
        } else if ($j(wrapFldId).find('a.axpBtnCustom').length > 0) {
            var axpBtnElem = $j(wrapFldId).find('a.axpBtnCustom');
            idOFtheField = axpBtnElem.attr('id');
            if (calledFrom != 'listview')
                valueOfTheField = textOfTheField = axpBtnElem.text();
            eleType = 'axpBtnCustom';
            isFieldVisible = true;
            hiddenData = "";
            maxlength = "";
            inlineStyle = axpBtnElem.attr('style');
            if (axpBtnElem.hasClass('flddis')) {
                disableClass = 'flddis';
            } else {
                disableClass = '';
            }
        }
        if (idOFtheField != "")
            tableHtml += createInpLabel(idOFtheField, textOfTheField, valueOfTheField, eleType, isFieldVisible, hiddenData, maxlength, inlineStyle, disableClass, calledFrom, displayClasses);

    });


    if (wrapperForEditFieldsIsHidden == true) {
        $j("#" + wrapperForEditFields).addClass("hide");
        wrapperForEditFieldsIsHidden = false;
    }

    return tableHtml;
}

function createGridHtmlFromEdit(dcNo, calledFrom) {
    var wrapperForEditFields = "wrapperForEditFields" + dcNo;
    var rCnt = GetDcRowCount(dcNo);
    var i = parseInt(rCnt, 10);
    var strRowNo = GetRowNoHelper(i);
    var endIdPart = strRowNo + 'F' + dcNo;
    var tableHtml = "";
    var wrapperForEditFieldsIsHidden = false;


    if ($j("#" + wrapperForEditFields).hasClass("hide")) {
        wrapperForEditFieldsIsHidden = true;
        $j("#" + wrapperForEditFields).removeClass("hide");
    }

    $j("#" + wrapperForEditFields + " .gridElement").each(function (index, el) {
        var currentElement = $j(this);
        var idOFtheField = "";
        var valueOfTheField = "";
        var textOfTheField = "";
        var isFieldVisible = "";
        var maxlength = "";
        var inlineStyle = "";
        var hiddenData = "";
        var disableClass = ""; //flddis
        var inpValue = $j(this).find('select,input,textarea,checkbox');
        var eleType = "";
        var displayClasses = "";

        if (inpValue.length > 0) {
            var idOfField = inpValue.attr('id');
            var fldType = inpValue.attr("type");
            var headerId = "";
            if (idOfField) {
                var lastIndexF = idOfField.lastIndexOf("F");
                if (idOfField.substr(lastIndexF, 3).length == 3) { //f12
                    //remove last 6 chars
                    headerId = "th-" + idOfField.substr(0, idOfField.length - 6);
                } else {
                    //remove last 5 chars
                    headerId = "th-" + idOfField.substr(0, idOfField.length - 5);
                }
            }
            if (headerId != "" && $("#" + headerId).length > 0) {
                displayClasses = $j(".wrapperForGridData" + dcNo + " thead tr th#" + headerId).attr("class");
            }
            displayClasses == undefined ? displayClasses = "" : "";
            //displayClasses = $j(".wrapperForGridData" + dcNo + " thead tr th").eq(index).attr("class");
            if (currentElement.find('span.picklist').length > 0) {
                eleType = 'pickList';
                hiddenData = currentElement.find('span.picklist input[type = hidden]').attr('id') + '~' + currentElement.find('span.picklist input[type = hidden]').val();
            } else if (currentElement.find('input.grdAttach').length > 0) {
                eleType = 'gridattach';
                isAttachMentExist = true;
            } else if (currentElement.find('input.tstOnlyTime').length > 0) {
                eleType = 'input';
            } else if (currentElement.find('input.tstOnlyTime24hours').length > 0) {
                eleType = 'input';
            } else if (currentElement.find('input.flatpickr-input').length > 0) {
                eleType = 'datepicker';
            } else if (inpValue.hasClass('fldFromSelect')) {
                inpValue.hasClass('fastdll') ? eleType = 'fromselect-select' : eleType = 'fromselect-pick';
                eleType = inpValue.hasClass('isrefreshsave') ? eleType + "~isrefreshsave" : eleType;
            } else if (inpValue.hasClass('fldmultiSelect')) {
                eleType = 'multigroupselect';
                eleType = inpValue.hasClass('isrefreshsave') ? eleType + "~isrefreshsave" : eleType;
            } else {
                eleType = inpValue[0].nodeName.toLowerCase();
                (eleType == "input" && inpValue[0].type == "checkbox") ? eleType = "checkbox": "";
                (eleType == "input" && inpValue.hasClass('number')) ? eleType = "numeric": "";
                hiddenData = '';
            }

            idOFtheField = inpValue.attr('id');
            if (calledFrom == 'listView')
                idOFtheField = idOFtheField.replace(GetFieldsRowFrameNo(idOFtheField), endIdPart);

            //checking for maxlength prop exists
            if (inpValue.attr('maxlength') != undefined)
                maxlength = inpValue.attr('maxlength');

            //checking for inline default css
            if (inpValue.attr('style') != undefined)
                inlineStyle = inpValue.attr('style');


            var gridVisible = $("#" + headerId).hasClass('none') ? true : (currentElement.css("display") == "none" ? false : $("#" + headerId).data("grid-visible") === undefined);
            var popupVisible = calledFrom === undefined ? currentElement.data('pop-visible') === undefined : gridVisible;

            //checking for field visibility
            if ((fldType != "hidden" || eleType === "gridattach") && ((!axInlineGridEdit && gridVisible) || axInlineGridEdit && gridVisible)) {
                isFieldVisible = true;
            } else {
                isFieldVisible = false;
                //if (!axInlineGridEdit)
                //    eleType = 'hidden';
            }

            //checking if field is disable
            if (inpValue.hasClass('flddis') || (eleType == 'fromselect-pick' && inpValue.hasClass('pickdis')) || (eleType == 'fromselect-pick~isrefreshsave' && inpValue.hasClass('pickdis')))
                disableClass = 'flddis';
            else
                disableClass = '';

            if (calledFrom != 'listview') {
                if (eleType == "select") {
                    textOfTheField = inpValue.find("option:selected").text();
                    valueOfTheField = inpValue.find("option:selected").val();
                    valueOfTheField == "" ? valueOfTheField = textOfTheField : "";
                    valueOfTheField == '-- Select --' ? valueOfTheField = "" : "";
                } else if (eleType == "checkbox") {
                    var valuesOfCb = inpValue.attr("alt").split(",");
                    var trueCbVal = "",
                        falseCbVal = "";
                    valuesOfCb[0] != "" ? (trueCbVal = valuesOfCb[0], falseCbVal = valuesOfCb[1]) : (trueCbVal = valuesOfCb[1], falseCbVal = valuesOfCb[2]);
                    inpValue.is(":checked") ? valueOfTheField = textOfTheField = trueCbVal : valueOfTheField = textOfTheField = falseCbVal;
                    hiddenData = inpValue.attr("alt");
                } else if (eleType == "datepicker") {
                    inpValue.val().endsWith('/yyyy') ? textOfTheField = valueOfTheField = "" : textOfTheField = valueOfTheField = inpValue.val();
                } else if (eleType.indexOf("multigroupselect") != -1) {
                    textOfTheField = valueOfTheField = inpValue.attr("data-selected");
                } else if (eleType.indexOf("fromselect") != -1) {
                    textOfTheField = valueOfTheField = inpValue.val() == null ? "" : inpValue.val();
                } else {
                    textOfTheField = valueOfTheField = inpValue.val();
                }
            }

        } else if ($j(this).find('a.axpBtn').length > 0) {
            var axpBtnElem = $j(this).find('a.axpBtn');
            idOFtheField = axpBtnElem.attr('id');
            if (calledFrom != 'listview')
                valueOfTheField = textOfTheField = axpBtnElem.text();
            eleType = 'axpBtn';
            // if (axpBtnElem.is(':visible')) {
            isFieldVisible = true;
            //} else {
            //    isFieldVisible = false;
            //}
            hiddenData = "";
            maxlength = "";
            inlineStyle = axpBtnElem.attr('style');
            if (axpBtnElem.hasClass('flddis')) {
                disableClass = 'flddis';
            } else {
                disableClass = '';
            }
        } else if ($j(this).find('a.axpBtnCustom').length > 0) {
            var axpBtnElem = $j(this).find('a.axpBtnCustom');
            idOFtheField = axpBtnElem.attr('id');
            if (calledFrom != 'listview')
                valueOfTheField = textOfTheField = axpBtnElem.text();
            eleType = 'axpBtnCustom';
            isFieldVisible = true;
            hiddenData = "";
            maxlength = "";
            inlineStyle = axpBtnElem.attr('style');
            if (axpBtnElem.hasClass('flddis')) {
                disableClass = 'flddis';
            } else {
                disableClass = '';
            }
        }

        if (idOFtheField != "")
            tableHtml += createInpLabel(idOFtheField, textOfTheField, valueOfTheField, eleType, isFieldVisible, hiddenData, maxlength, inlineStyle, disableClass, calledFrom, displayClasses);

    });


    if (wrapperForEditFieldsIsHidden == true) {
        $j("#" + wrapperForEditFields).addClass("hide");
        wrapperForEditFieldsIsHidden = false;
    }

    return tableHtml;
}

function createAttachmentsInGrid(fldName, fldValue, rowFrmNo) { //axp_gridattach_2001F2,//bg1.jpg,bg2.jpg,bg3.jpg,001F2
    if (!callParentNew("axInlineGridEdit")) {
        var hdnScriptsUrlPath = $j("#hdnScriptsUrlpath");
        var filePath = hdnScriptsUrlPath.val() + "axpert/" + sid + "/";
        var attachHtml = "";
        var rowNo = GetFieldsRowNo(fldName);
        var fNo = GetFieldsRowNo(fldName);
        var attachments = fldValue.split(',');


        for (i = 0; i < attachments.length; i++) {

            let fileOpenLink = allImageNames[i];
            fileOpenLink = fileOpenLink.replace(/'/g, '♠');
            attachHtml += "<div id=\"Link_" + rowFrmNo + "_" + unescape(attachments[i]).replace(/\s/g, '♠').replace(/\(/g, '♦').replace(/\)/g, '♣') + "\"  class='atchfile'>";
            attachHtml += "<a onclick=\"DeleteFileFromRow('" + fldName + "','" + rowNo + "','" + fileOpenLink + "')\"><i class=\"glyphicon glyphicon-remove close icon-arrows-remove attachmentcrossicon\"></i></a>";
            var pathOfFile = "";
            referRecId == "" ? pathOfFile = (filePath + attachments[i]) : pathOfFile = (filePath + referRecId + '-' + attachments[i]);
            attachHtml += "<a href=\"javascript:void(0)\" id='grdAtt_hlnk_" + rowFrmNo + "' class='grdAttach handCur' onclick='ShowGridAttLink(\"" + filePath + fileOpenLink + "\")'>" + attachments[i] + "</a>";
            attachHtml += "</div>";


        }

        $j(attachHtml).insertAfter("#" + fldName);

        $j("#" + fldName).val(fldValue);
    }
}

function createEditLayoutTemplate(dcNo) {
    var layout = {};
    var dcName = "dc" + dcNo;
    $("#wrapperForEditFields" + dcNo + " .gridElement ").each(function () {

        var idOfField = $(this).find('select,input,textarea,a.axpBtn,a.axpBtnCustom').attr('id');

        var classes = $(this).attr('class');

        if (idOfField) {
            var lastIndexF = idOfField.lastIndexOf("F");
            if (idOfField.substr(lastIndexF, 3).length == 3) { //f12
                //remove last 6 chars
                idOfField = idOfField.substr(0, idOfField.length - 6);
                idOfField = idOfField + "tmp";
            } else {
                //remove last 5 chars
                idOfField = idOfField.substr(0, idOfField.length - 5);
                idOfField = idOfField + "tmp";
            }
            //var obj = {};
            layout[idOfField] = classes;

        }
    });
    editLayouTmplate[dcName] = layout;
}

function checkTableBodyWidths(dcNo) {
    if ($("#gridHd" + dcNo + " tbody tr:first td:first").css("min-width") == "0px") {
        $("#gridHd" + dcNo + " tbody tr:first td").each(function (index, el) {
            var width = 0;
            if ($(el).find(".slno").length > 0 || $(el).find(".gridRowChk").length > 0)
                width = "40px";
            else
                width = $("#gridHd" + dcNo + " thead th:not([id*=uniqueEditDeleteAct],[id*=uniqueThHead]):visible").eq(index).css("width");
            $(this).css({
                "width": width,
                "min-width": width
            });
        })
    }
}

function GetEditNewValues(dcNo) {
    var newEditValues = "";
    var eleType = "";
    $("#wrapperForEditFields" + dcNo + " .editWrapTr .gridElement").each(function (index, el) {
        var inpValue = $(this).find('select,input,textarea,checkbox');
        if (inpValue.length > 0) {
            eleType = inpValue[0].nodeName.toLowerCase();
            eleType == 'select' ? newEditValues += inpValue.find("option:selected").val() + "¿" + inpValue.find("option:selected").text() + "♠" : newEditValues += inpValue.val() + "♠";
        }
    });

    return newEditValues;
}

function toggleTheEditLayout(dcNo) {
    if ($("#gridToggleBtn" + dcNo).hasClass('icon-arrows-up')) {
        $("#wrapperForEditFields" + dcNo).attr('data-action', 'closedByToggle').slideUp("medium");
        $("#gridToggleBtn" + dcNo).removeClass('icon-arrows-up').addClass('icon-arrows-down').attr('title', 'Expand');
    } else {
        $("#wrapperForEditFields" + dcNo).attr('data-action', 'openedByToggle').slideDown('medium');
        $("#gridToggleBtn" + dcNo).removeClass('icon-arrows-down').addClass('icon-arrows-up').attr('title', 'Collapse');
    }

}

function checkEditMode(mode) {
    if (dcGridOnSave == "true" && globalOnlySave == true) {
        globalOnlySave = false;
        return true;
    }
    var newEditValues = "";
    if (AxEditActiveDcNo != "") {
        newEditValues = GetEditNewValues(AxEditActiveDcNo);
        if (newEditValues != oldEditValues && !gridEditValidator) {
            var dcName = "";
            $("#dcCaption" + AxEditActiveDcNo).text() == "" ? dcName = $("#myTab #li" + AxEditActiveDcNo + " span").text() : dcName = $("#dcCaption" + AxEditActiveDcNo).text();
            if (oldEditValues === "" && globalClickTheEditRow == "") {
                gridEditValidator = true;
                $("#editCancelButton" + AxEditActiveDcNo).click();
                return true;
            } else {
                globalClickTheEditRow = "";
                //return true;
            }
            var message = "";
            var cutMsg = eval(callParent('lcm[36]'));
            cutMsg = cutMsg.replace('{0}', dcName);
            var cutMsg1 = eval(callParent('lcm[37]'));
            cutMsg1 = cutMsg1.replace('{0}', dcName);
            mode == 'edit' ? message = "!confirm('" + cutMsg + "')" : message = "confirm('" + cutMsg1 + "')";
            if (mode == 'edit' && eval(callParent('appSettingsObj.sabrnig')) != true) {
                message = "false";
            }
            if (eval(message)) {
                gridEditValidator = true;
                //The changes in edit should be reverted and continue with next action - return true
                $("#editCancelButton" + AxEditActiveDcNo).click();
                oldEditValues = "";
                return true;
            } else {
                //focus on the update button in the AxEditActiveDcNo  
                //need to handle when its tab
                if (mode == 'edit') {
                    var wrapperForEditFields = "wrapperForEditFields" + AxEditActiveDcNo;
                    var rowId = $j("#" + wrapperForEditFields + " .editWrapTr").attr('id');
                    AxCurrGridRowNo = parseInt(GetFieldsRowNo(rowId), 10);
                    if (!ValidateOnAddRow(AxEditActiveDcNo)) {
                        return false;
                    }
                    var trIndex = $j(".wrapperForGridData" + AxEditActiveDcNo + " .customSetupTableMN tbody tr.inEditMode").index();
                    if (trIndex > -1) {
                        gridEditValidator = true;
                        addTheValuesToGrid(AxEditActiveDcNo, "", trIndex, false);
                    } else {
                        gridEditValidator = true;
                        addTheValuesToGrid(AxEditActiveDcNo, "", "", false);
                    }
                    oldEditValues = "";
                    return true;
                } else {
                    FocusOnFirstField(AxEditActiveDcNo);
                    return false;
                }

            }
        } else {
            oldEditValues = "";
            gridEditValidator = true;
            $("#editCancelButton" + AxEditActiveDcNo).click();
            return true;
        }
    }
    return true;
}

function setModalFooterInEdit(currenttDC) {
    curRowNoo = "";
    if ($(".wrapperForGridData" + currenttDC + " .inEditMode [id*=lblSlNo]").length > 0 && $(".wrapperForGridData" + currenttDC + " .inEditMode [id*=lblSlNo]").text().length > 0) {
        curRowNoo = $(".wrapperForGridData" + currenttDC + " .inEditMode [id*=lblSlNo]").text();
    } else if ($("#wrapperForEditFields" + currenttDC + " .editWrapTr [id^=lblSlNo]").length > 0 && $("#wrapperForEditFields" + currenttDC + " .editWrapTr [id^=lblSlNo]").text().length > 0) {
        curRowNoo = $("#wrapperForEditFields" + currenttDC + " .editWrapTr [id^=lblSlNo]").text();
    }

    if (curRowNoo != "") {
        if ($("#wrapperForEditFields" + currenttDC + " .footerRowCount").length < 1) {
            $("#wrapperForEditFields" + currenttDC + " .previousNextEditButton").parent().append("<div class=\"footerRowCount\"></div>");
        }
        var totalRowInGrid = $(".wrapperForGridData" + currenttDC + " table tbody tr").length;
        if (totalRowInGrid >= curRowNoo) {

            $("#wrapperForEditFields" + currenttDC + " .footerRowCount").text("Row " + curRowNoo + "(" + totalRowInGrid + ")");
        } else {
            $("#wrapperForEditFields" + currenttDC + " .footerRowCount").text("Row " + curRowNoo);
        }
    }
}

function updateEditFldValues(oldValues, newEditVals) {

    var fields = GetGridFields(AxEditActiveDcNo);
    var oldFldVals = oldValues.split("♠");
    var newFldVals = newEditVals.split("♠");
    for (var i = 0; i < fields.length; i++) {
        var fldId = fields[i] + GetRowNoHelper(AxEditActiveRowNo) + "F" + AxEditActiveDcNo;
        if (oldFldVals[i].toString() != newFldVals[i].toString()) {
            //check for attachment
            var fName = fields[i].toString();
            if (fName.indexOf("axp_gridattach_") != -1 || (fName.toLowerCase() == "dc" + AxEditActiveDcNo + "_image")) {
                $("#" + fldId).nextAll('span.badge.attachmentWrapper').remove();
                createAttachmentsInGrid(fldId, oldFldVals[i].toString(), GetFieldsRowFrameNo(fldId));
            }
            UpdateFieldArray(fldId, AxEditActiveRowNo, oldFldVals[i].toString(), "parent", "");
            UpdateAllFieldValues(fldId, oldFldVals[i].toString());
        }

    }
}

function gridEditSaveNdClose(task) {
    if (AxEditActiveDcNo != "") {
        var dcNo = AxEditActiveDcNo;

        if (isGrdEditDirty === true) {
            if (task === 'close') {

                if ($j("#dummyWrapperForEditFields" + dcNo).length > 0) {
                    $("#dummynewRecordBtn" + dcNo).addClass('closeEventCall');
                } else {
                    $("#bootstrapModal [id*=newRecordBtn]").addClass('closeEventCall');
                }
            }
            $("#bootstrapModal [id*=newRecordBtn]").click();
        }
        var nextPreviousFlag = false;
        if (fromNextPrevious) {
            nextPreviousFlag = true;
            fromNextPrevious = false;
        } else {
            nextPreviousFlag = false;
        }

        var clientRNoOnCancel = getNewEditRowNo(dcNo);
        if (!nextPreviousFlag) {
            UpdateFieldArray(axpIsRowValid + dcNo + clientRNoOnCancel + "F" + dcNo, GetDbRowNo(clientRNoOnCancel, dcNo), "false", "parent", "AddRow");
        }
        if ($j("#dummyWrapperForEditFields" + dcNo).length > 0) {
            $j("#wrapperForEditFields" + dcNo).replaceWith($j("#dummyWrapperForEditFields" + dcNo).detach());
            $j("#dummyWrapperForEditFields" + dcNo).attr("id", "wrapperForEditFields" + dcNo).removeClass("hide");
            $j("#dummyWrapperForEditFields" + dcNo + " #dummynewRecordBtn" + dcNo).attr("id", "newRecordBtn" + dcNo);
            if (isMobile)
                $j("#dummyWrapperForEditFields" + dcNo + " #dummyEditUpdateButton" + dcNo).attr("id", "editUpdateButton" + dcNo);
        }
        isGrdEditDirty = false;
        if (task !== "edit")
            $("#bootstrapModal").modal("hide");
    }
}


//to get grid column property visibility
//example: gridColOptVisibility("uniqueEditDeleteAct", dcNo), gridColOptVisibility("uniqueThHead", dcNo);
function gridColOptVisibility(option, dcNo) {
    let currentDC = $.grep(designObj[0].dcs, function (v) {
        return v.dc_id == dcNo;
    });
    var colVisibility = currentDC[0].tableDesign.filter(function (elm) {
        return elm.fld_id == option + dcNo
    });
    if (colVisibility.length == 0)
        return $("#" + option + dcNo).is(":visible");
    else
        return colVisibility[0].visibility;
}



//#Region FormGridEdit
function checkFormRowValid(dcNo, rowNo) {
    if (rowNo != "" && isLoadDataRow == false) {
        var strRowNo = GetRowNoHelper(rowNo);
        var trID = "sp" + dcNo + "R" + strRowNo + "F" + dcNo;
        if ($("#gridHd" + dcNo + " tbody [id^=" + trID + "]").length == 0) {
            showAlertDialog("warning", "Current row cannot be empty value.");
            return false;
        } else
            return true;
    } else
        return true;
}

function formGridRowEdit(dcNo, rowNo, calledFrom) {
    axInlineGridEdit = false;
    AxEditActiveDcNo = "";
    if (rowNo != "") {
        var wIdgrid = $("#colScroll" + dcNo + " [id^=gridrowWrap" + dcNo + "-]").children("#wrapperForEditFields" + dcNo).attr('id');
        $("#colScroll" + dcNo + " [id^=gridrowWrap" + dcNo + "-]").children("#wrapperForEditFields" + dcNo).attr('id', wIdgrid + "Added");
        $("#divDc" + dcNo + " .grid-icons").append(gridDivHtml[dcNo]);

        var i = parseInt(rowNo, 10);
        var strRowNo = GetRowNoHelper(i);
        changeEditLayoutIds(strRowNo, dcNo);
        if ((typeof formGridRowDele[dcNo] == "undefined" || formGridRowDele[dcNo] == "false") && typeof calledFrom == "undefined")
            AddRow(dcNo, "AddRow");
        else
            formGridRowDele[dcNo] = "false";
    }
}

function addRowFormGrid(dcNo, newRowNo, calledFrom) {
    // if (!isMobile)
    $("#gridAddBtn" + dcNo).addClass("d-none");
    $("#clearThisDC" + dcNo).addClass("d-none");
    var TrId = $j("#wrapperForEditFields" + dcNo + " .editWrapTr").attr("id").split("F")[0];
    var strRowNo = TrId.substring(TrId.length - 3, TrId.length);

    $("#colScroll" + dcNo + " .addFormGridbutton").remove();
    $("#gridHd" + dcNo).addClass("d-none");
    var btnRemove = "";
    if (strRowNo != "001" && $(`#clearThisDC${dcNo}`)?.[0]) {
        btnRemove = "<div class=\"removeformGridbutton d-inline-flex\"><button id=\"gridRemoveBtnAdd" + dcNo + strRowNo + "\" onclick=\"DeleteFromGridRow('" + dcNo + "','" + strRowNo + "F" + dcNo + "','this');\" class=\"btn btn-white btn-color-gray-700 btn-active-primary shadow-sm\" >Delete Row</button></div>";
    }
var gridHtml = "<div class=\"clearfix\"></div>";
let mobileDcRowNo = "<span class=\"d-flex flex-center mobileDcRowNO\"> (" + strRowNo + ") </span>";
let mobileDcCapt = "";
try {
    mobileDcCapt = $(`#head${dcNo}`).length > 0 ? $(`#head${dcNo}`).text() : $("#dcCaption" + dcNo)[0].childNodes[0].nodeValue;
} catch (error) {}

if (isMobile ) { //&& strRowNo != "001") {
    gridHtml += "<div id=\"dcCaptionBtn" + dcNo + "-" + strRowNo + "\" class=\"d-flex gap-3 frameCap fw-boldest fs-6 text-gray-800 dcCaptionBtn\"><span class=\"d-flex flex-center\">" + mobileDcCapt + "</span>" + mobileDcRowNo + "</div><hr class=\"text-gray-500\" />";
}
gridHtml += "<div id=\"gridrowWrap" + dcNo + "-" + strRowNo + "\" class=\"formGridRow\"><div class=\"row\" id=\"wrapperForEditFields" + dcNo + "\" >" + $j("#wrapperForEditFields" + dcNo).html() + "</div><div class=\"addFormGridbutton d-inline-flex me-2\"><button id=\"gridAddBtnAdd" + dcNo + "\" onclick=\"editTheRow(''," + dcNo + "," + strRowNo + ",event)\" class=\"btn btn-primary\" type=\"button\" title=\"Add\">Add Row</button></div>" + btnRemove + "<div class=\"clearfix\"></div></div>";
$("#bootstrapModalData").remove();
$("#colScroll" + dcNo + " [id^=gridrowWrap" + dcNo + "-]").children("#wrapperForEditFields" + dcNo + "Added").attr('id', "wrapperForEditFields" + dcNo);
$("#colScroll" + dcNo).append(gridHtml);

let gridClsList = isMobile ? "editWrapTr grid-stack grid-stack-one-column-mode dynamicRunMode dirty" : "editWrapTr grid-stack dynamicRunMode dirty"
$("#gridrowWrap" + dcNo + "-" + strRowNo).find(".editWrapTr").removeAttr("class").attr("class", gridClsList);
if (isMobile) {
    // $("#colScroll" + dcNo).css({
    //     "overflow": "hidden"
    // });
    $(`#head${dcNo}`).addClass("d-none");
    $(`#DivFrame${dcNo} .gridIconBtns:not(.dcCaptionBtn .gridIconBtns)`).first().clone().appendTo($(`#dcCaptionBtn${dcNo}-${strRowNo}`));
    $(`#DivFrame2 .gridIconBtns:not(.dcCaptionBtn .gridIconBtns)`).addClass("d-none");
    $(`#dcCaptionBtn${dcNo}-${strRowNo} .gridIconBtns`).addClass("ms-auto").removeClass("d-none");
    // strRowNo == "001" ? $("#dcCaption" + dcNo).html(mobileDcCapt + mobileDcRowNo) : "";
}
SetGridBtnAccess();
var arrEditDiv = new Array();
arrEditDiv.push("#gridrowWrap" + dcNo + "-" + strRowNo);
//if (isLoadDataRow)
//    changeEditLayoutIds(newRowNo, dcNo, 'listView');
AssignJQueryEvents(arrEditDiv);
$(".editLayoutFooter").remove();
}

function DeleteFromGridRow(dcNo, rowFrmNo, elem) {
    // if ($j("#del" + rowFrmNo).attr("class").indexOf("disabledelete") != -1)
    //     return;
    var gridRowCust = "sp" + dcNo + "R" + rowFrmNo;
    //if ($("#gridHd" + dcNo + " tbody [id^=" + gridRowCust + "]").length == 0) {
    var delRowNo = rowFrmNo.substring(0, 3);
    $("#colScroll" + dcNo + " #gridrowWrap" + dcNo + "-" + delRowNo).remove();
    var rdId = $("#colScroll" + dcNo + " [id^=gridrowWrap" + dcNo + "]").last().attr("id");
    $("#colScroll" + dcNo + " .addFormGridbutton").remove();
    $("#colScroll" + dcNo + " #gridrowWrap" + dcNo + "-" + rdId.split("-")[1] + " .clearfix").remove();
    $("#colScroll" + dcNo + " #gridrowWrap" + dcNo + "-" + rdId.split("-")[1]).append("<div class=\"addFormGridbutton d-inline-flex me-2\"><button id=\"gridAddBtnAdd" + dcNo + "\" onclick=\"editTheRow(''," + dcNo + "," + rdId.split("-")[1] + ",event)\" class=\"btn btn-primary\" type=\"button\" title=\"Add\">Add Row</button></div><div class=\"clearfix\"></div>");
    $("#gridAddBtnAdd" + dcNo).removeAttr("onclick").attr("onclick", "editTheRow(''," + dcNo + "," + rdId.split("-")[1] + ",event)");
    formGridRowDele[dcNo] = "true";
    //    return;
    //}
    if ($("#gridHd" + dcNo + " tbody [id^=" + gridRowCust + "]").length > 0)
        DeleteRow(dcNo, rowFrmNo, elem);

    if (isMobile)
        $("#dcCaptionBtn" + dcNo + "-" + delRowNo).remove();
}

function addTheValuesToFormGrid(dcNo, rowNo, elem, trIndexForEdit, onlySave) {
    globalOnlySave = false;
    if (typeof onlySave == "undefined" || onlySave === "") {
        onlySave = false;
    }
    globalOnlySave = onlySave;
    var wrapperForEditFields = "gridrowWrap" + dcNo + "-" + rowNo;
    var rowId = $j("#" + wrapperForEditFields + " .editWrapTr").attr('id');
    var deleteRowExists = false;
    var deleteRowHtml = "";
    if (rowNo == "001") {
        gridDummyRowVal.splice($.inArray(dcNo.toString() + "~" + rowNo, gridDummyRowVal), 1);
        gridDummyRows = false;
        gridRowEditOnLoad = false;
    }

    AxCurrGridRowNo = parseInt(GetFieldsRowNo(rowId), 10);

    //checking for the first field for delete image
    // if ($j("#" + wrapperForEditFields + " .gridtdclass").first().find('a.rowdelete').length > 0) {
    //     deleteRowExists = true;
    //     deleteRowHtml = $j("#" + wrapperForEditFields + " .gridtdclass").first().find('a.rowdelete')[0].outerHTML;
    // }

    var tableHtml = createGridHtmlForm(dcNo, rowNo);
    // var editDeleteOpts = "<td " + (gridColOptVisibility("uniqueEditDeleteAct", dcNo) || IsTabDc(dcNo) ? "" : "style=\"display:none;\"") + "><a class=\"btn btn-sm btn-icon btn-white btn-color-gray-600 btn-active-primary me-2 shadow-sm gridEditDeleteBtns\" onclick='editTheRow(this," + dcNo + ",\"" + GetFieldsRowNo(rowId) + "\",event);' title=\"Edit\"><span class=\"material-icons material-icons-style material-icons-3\">edit</span></a>";
    // if (deleteRowExists)
    //     editDeleteOpts += "<a class=\"btn btn-sm btn-icon btn-white btn-color-gray-600 btn-active-primary me-2 shadow-sm gridEditDeleteBtns\" onclick='DeleteRow(" + dcNo + ", \"" + GetFieldsRowNo(rowId) + 'F' + dcNo + "\",this)' title=\"Delete\"><span class=\"material-icons material-icons-style material-icons-3\">delete</span></a>";
    // editDeleteOpts += "</td>";

    var editDeleteOpts = "<td class=\"text-center\"><span class=\"tem1\"><div class=\"form-check form-check-sm form-check-custom ms-2\"><input class=\"form-check-input border-gray-500 fgChk gridRowChk\" type=\"checkbox\" name=\"grdchkItemTd" + dcNo + "\" id=\"grdchkItemTd" + GetFieldsRowNo(rowId) + "F" + dcNo + "\" onclick=\"javascript:CheckboxGridRow(this," + dcNo + "," + GetFieldsRowNo(rowId) + ",event);\"></div></span></td>";

    var deleteHtml = "<td style='display:none;'>" + deleteRowHtml + "</td>";
    var rowNoToCheck = "";
    if (trIndexForEdit == undefined || trIndexForEdit === "") {
        var dcClientRows = GetDcClientRows(dcNo);
        var lastRow = dcClientRows.getMaxVal();
        if (lastRow == 0) lastRow = 1;
        var addedRowNum = GetRowNoHelper(lastRow);
        globalClickTheEditRow = addedRowNum;
        rowNoToCheck = addedRowNum;
        var slNoHtml = '<td ' + (gridColOptVisibility("uniqueThHead", dcNo) == false ? "style=\"display:none;\"" : (gridColOptVisibility("uniqueThHead", dcNo) || IsTabDc(dcNo)) ? "" : "style=\"display:none;\"") + '><label id="lblSlNo' + GetFieldsRowNo(rowId) + 'F' + dcNo + '" class="form-control w-100 border bg-transparent overflow-hidden resize-none  slno">' + ($j("#gridHd" + dcNo + " tbody tr").length + 1) + '</label></td>';
        $j(".wrapperForGridData" + dcNo + " tbody").append("<tr id='sp" + dcNo + "R" + GetFieldsRowNo(rowId) + "F" + dcNo + "'>" + editDeleteOpts + deleteHtml + slNoHtml + tableHtml + "</tr>");

        //$j(".wrapperForGridData" + dcNo + " tbody tr textarea").each(function () {
        $j(".wrapperForGridData" + dcNo + " tbody tr[id=sp" + dcNo + "R" + GetFieldsRowNo(rowId) + "F" + dcNo + "] select,tr[id=sp" + dcNo + "R" + GetFieldsRowNo(rowId) + "F" + dcNo + "] textarea").each(function () {
            $(this).attr('id', "gr" + this.id);
        });
        UpdateFieldArray(axpIsRowValid + dcNo + addedRowNum + "F" + dcNo, GetDbRowNo(addedRowNum, dcNo), "", "parent", "AddRow");

        AxCurrGridRowNo = "";
        TstructTabEventsInPopUP(dcNo);
        isGrdEditDirty = false;
        gridEditValidator = true;
        CheckShowHideFldsGrid(dcNo);
        customAlignTstructFlds([], dcNo, parseInt(rowNoToCheck));
        return true;
    } else {
        $j(".wrapperForGridData" + dcNo + " tbody tr.inEditMode").removeClass('inEditMode');
        var slNoHtml = '<td ' + (gridColOptVisibility("uniqueThHead", dcNo) == false ? "style=\"display:none;\"" : (gridColOptVisibility("uniqueThHead", dcNo) || IsTabDc(dcNo)) ? "" : "style=\"display:none;\"") + '><label id="lblSlNo' + GetFieldsRowNo(rowId) + 'F' + dcNo + '" class="form-control w-100 border bg-transparent overflow-hidden resize-none  slno">' + (trIndexForEdit + 1) + '</label></td>';
        $j(".wrapperForGridData" + dcNo + " tbody tr").eq(trIndexForEdit).html(editDeleteOpts + deleteHtml + slNoHtml + tableHtml);

        UpdateFieldArray(axpIsRowValid + dcNo + GetFieldsRowNo(rowId) + "F" + dcNo, GetDbRowNo(GetFieldsRowNo(rowId), dcNo), "", "parent", "AddRow");

        //$j(".wrapperForGridData" + dcNo + " tbody tr textarea").each(function () {
        $j(".wrapperForGridData" + dcNo + " tbody tr[id=sp" + dcNo + "R" + GetFieldsRowNo(rowId) + "F" + dcNo + "] select,tr[id=sp" + dcNo + "R" + GetFieldsRowNo(rowId) + "F" + dcNo + "] textarea").each(function () {
            $(this).attr('id', "gr" + this.id);
        });
        editElementObject = "";
        return true;
    }
}

function formGridRowBlur(fldObj) {
    var fldcutId = fldObj.attr("id");
    var dcNo = GetFieldsDcNo(fldcutId);
    var fieldName = GetFieldsName(fldcutId);
    divEditClass = "";
    if (IsGridField(fieldName)) {
        var rowNo = GetFieldsRowNo(fldcutId);
        var fldDbRowNo = GetDbRowNo(rowNo, dcNo);
        var gridRowCust = "sp" + dcNo + "R" + rowNo + "F" + dcNo;
        let trIndex = 0;
        $("#gridrowWrap" + dcNo + "-" + rowNo + " .attach-files").show();
        //$("#gridrowWrap" + dcNo + "-" + rowNo + " .attachment-count").hide();
        $("#gridHd" + dcNo + " tbody tr").each(function () {
            if ($(this).attr('id') == gridRowCust)
                trIndex = $(this).index();
        });
        if ($("#gridHd" + dcNo + " tbody tr").length > 0) {
            divEditClass = "gridrowWrap" + dcNo + "-" + rowNo;
            var isUpdate = false;
            $("#gridHd" + dcNo + " tbody tr").each(function () {
                if ($(this).attr('id') == gridRowCust) {
                    isUpdate = true;
                    addTheValuesToFormGrid(dcNo, rowNo, $(this), trIndex);
                }
            });
            if (isUpdate == false)
                addTheValuesToFormGrid(dcNo, rowNo, $(this));
        } else {
            divEditClass = "gridrowWrap" + dcNo + "-" + rowNo;
            addTheValuesToFormGrid(dcNo, rowNo, $(this));
        }
    }
}

function createFormGridRowHTML(editGridDC) {
    var idOfelement = "divDc" + editGridDC + " #gridheaddiv";
    var data = "wrapperForEditFields" + editGridDC;
    gridDivHtml[editGridDC] = "<div class=\"row hide\" id=\"wrapperForEditFields" + editGridDC + "\">" + $("#" + data).html() + "</div>";

    var modalHTML = "";
    var heightOfModal = "";
    var widthOfModal = "100%";
    var modalHTML = '<div class="modal fade" style="width:100%" id="bootstrapModalGrid" role="dialog">';
    modalHTML += '<div class="modal-dialog" style="height:' + heightOfModal + ';width:' + widthOfModal + ';margin-bottom:0px;">';
    modalHTML += '<div class="modal-content" style="height:400px">';
    modalHTML += '<div class="modal-header">';
    modalHTML += '<h4 class="modal-title"></h4>';
    modalHTML += '</div>';
    let heights = "height: calc(100% - 111px);-webkit-height: calc(100% - 111px);-moz-height: calc(100% - 111px);-o-height: calc(100% - 111px);overflow: auto;";
    modalHTML += '<div class="modal-body" style="' + heights + '">';
    modalHTML += '<div id="bootstrapModalDataGrid" style="width:100%;height:100%;" class="modal-body-content">';
    modalHTML += '</div>';
    modalHTML += '</div>';
    modalHTML += ' </div>';
    modalHTML += '</div>';
    modalHTML += '</div>';
    $('body').append(modalHTML);
    $("#" + data).removeClass("hide");
    data = $("#" + data).detach();
    $(data).appendTo("#bootstrapModalDataGrid");
}

function createGridHtmlForm(dcNo, rowNo, calledFrom) {
    var wrapperForEditFields = "wrapperForEditFields" + dcNo;
    var endIdPart = rowNo + 'F' + dcNo;
    var tableHtml = "";
    var wrapperForEditFieldsIsHidden = false;


    if ($j("#" + wrapperForEditFields).hasClass("hide")) {
        wrapperForEditFieldsIsHidden = true;
        $j("#" + wrapperForEditFields).removeClass("hide");
    }
    //if (calledFrom != "undefined" && rowNo=="001")
    //    $("#" + wrapperForEditFields + " .gridElement").each(function (index, el) {
    //    else
    $("#gridrowWrap" + dcNo + "-" + rowNo + " #" + wrapperForEditFields + " .gridElement").each(function (index, el) {
        //$((calledFrom != "undefined" && rowNo == "001") == true ? ("#" + wrapperForEditFields + " .gridElement") : ("#gridrowWrap" + dcNo + "-" + rowNo + " #" + wrapperForEditFields + " .gridElement")).each(function (index, el) {
        var currentElement = $j(this);
        var idOFtheField = "";
        var valueOfTheField = "";
        var textOfTheField = "";
        var isFieldVisible = "";
        var maxlength = "";
        var inlineStyle = "";
        var hiddenData = "";
        var disableClass = "";
        var inpValue = $j(this).find('select,input,textarea,checkbox');
        var eleType = "";
        var displayClasses = "";

        if (inpValue.length > 0) {
            var idOfField = inpValue.attr('id');
            var fldType = inpValue.attr("type");
            var headerId = "";
            if (idOfField) {
                var lastIndexF = idOfField.lastIndexOf("F");
                if (idOfField.substr(lastIndexF, 3).length == 3) {
                    headerId = "th-" + idOfField.substr(0, idOfField.length - 6);
                } else {
                    headerId = "th-" + idOfField.substr(0, idOfField.length - 5);
                }
            }
            if (headerId != "" && $("#" + headerId).length > 0) {
                displayClasses = $j(".wrapperForGridData" + dcNo + " thead tr th#" + headerId).attr("class");
            }
            displayClasses == undefined ? displayClasses = "" : "";
            if (currentElement.find('span.picklist').length > 0) {
                eleType = 'pickList';
                hiddenData = currentElement.find('span.picklist input[type = hidden]').attr('id') + '~' + currentElement.find('span.picklist input[type = hidden]').val();
            } else if (currentElement.find('input.grdAttach').length > 0) {
                eleType = 'gridattach';
                isAttachMentExist = true;
            } else if (currentElement.find('input.tstOnlyTime').length > 0) {
                eleType = 'input';
            } else if (currentElement.find('input.tstOnlyTime24hours').length > 0) {
                eleType = 'input';
            } else if (currentElement.find('input.flatpickr-input').length > 0) {
                eleType = 'datepicker';
            } else if (inpValue.hasClass('fldFromSelect')) {
                inpValue.hasClass('fastdll') ? eleType = 'fromselect-select' : eleType = 'fromselect-pick';
                eleType = inpValue.hasClass('isrefreshsave') ? eleType + "~isrefreshsave" : eleType;
            } else if (inpValue.hasClass('fldmultiSelect')) {
                eleType = 'multigroupselect';
                eleType = inpValue.hasClass('isrefreshsave') ? eleType + "~isrefreshsave" : eleType;
            } else {
                eleType = inpValue[0].nodeName.toLowerCase();
                (eleType == "input" && inpValue[0].type == "checkbox") ? eleType = "checkbox": "";
                (eleType == "input" && inpValue.hasClass('number')) ? eleType = "numeric": "";
                hiddenData = '';
            }

            idOFtheField = inpValue.attr('id');
            if (calledFrom == 'listView')
                idOFtheField = idOFtheField.replace(GetFieldsRowFrameNo(idOFtheField), endIdPart);

            //checking for maxlength prop exists
            if (inpValue.attr('maxlength') != undefined)
                maxlength = inpValue.attr('maxlength');

            //checking for inline default css
            if (inpValue.attr('style') != undefined)
                inlineStyle = inpValue.attr('style');


            var gridVisible = $("#" + headerId).hasClass('none') ? true : (currentElement.css("display") == "none" ? false : $("#" + headerId).data("grid-visible") === undefined);
            var popupVisible = calledFrom === undefined ? currentElement.data('pop-visible') === undefined : gridVisible;

            //checking for field visibility
            if ((fldType != "hidden" || eleType === "gridattach") && ((!axInlineGridEdit && gridVisible) || axInlineGridEdit && gridVisible)) {
                isFieldVisible = true;
            } else {
                isFieldVisible = false;
                //eleType = 'hidden';
            }

            //checking if field is disable
            if (inpValue.hasClass('flddis') || (eleType == 'fromselect-pick' && inpValue.hasClass('pickdis')) || (eleType == 'fromselect-pick~isrefreshsave' && inpValue.hasClass('pickdis')))
                disableClass = 'flddis';
            else
                disableClass = '';

            if (calledFrom != 'listview') {
                if (eleType == "select") {
                    textOfTheField = inpValue.find("option:selected").text();
                    valueOfTheField = inpValue.find("option:selected").val();
                    valueOfTheField == "" ? valueOfTheField = textOfTheField : "";
                    valueOfTheField == '-- Select --' ? valueOfTheField = "" : "";
                } else if (eleType == "checkbox") {
                    var valuesOfCb = inpValue.attr("alt").split(",");
                    var trueCbVal = "",
                        falseCbVal = "";
                    valuesOfCb[0] != "" ? (trueCbVal = valuesOfCb[0], falseCbVal = valuesOfCb[1]) : (trueCbVal = valuesOfCb[1], falseCbVal = valuesOfCb[2]);
                    inpValue.is(":checked") ? valueOfTheField = textOfTheField = trueCbVal : valueOfTheField = textOfTheField = falseCbVal;
                    hiddenData = inpValue.attr("alt");
                } else if (eleType == "datepicker") {
                    inpValue.val().endsWith('/yyyy') ? textOfTheField = valueOfTheField = "" : textOfTheField = valueOfTheField = inpValue.val();
                } else if (eleType.indexOf("multigroupselect") != -1) {
                    textOfTheField = valueOfTheField = inpValue.attr("data-selected");
                } else {
                    textOfTheField = valueOfTheField = inpValue.val();
                }
            }

        } else if ($j(this).find('a.axpBtn').length > 0) {
            var axpBtnElem = $j(this).find('a.axpBtn');
            idOFtheField = axpBtnElem.attr('id');
            if (calledFrom != 'listview')
                valueOfTheField = textOfTheField = axpBtnElem.text();
            eleType = 'axpBtn';
            // if (axpBtnElem.is(':visible')) {
            isFieldVisible = true;
            //} else {
            //    isFieldVisible = false;
            //}
            hiddenData = "";
            maxlength = "";
            inlineStyle = axpBtnElem.attr('style');
            if (axpBtnElem.hasClass('flddis')) {
                disableClass = 'flddis';
            } else {
                disableClass = '';
            }
        } else if ($j(this).find('a.axpBtnCustom').length > 0) {
            var axpBtnElem = $j(this).find('a.axpBtnCustom');
            idOFtheField = axpBtnElem.attr('id');
            if (calledFrom != 'listview')
                valueOfTheField = textOfTheField = axpBtnElem.text();
            eleType = 'axpBtnCustom';
            isFieldVisible = true;
            hiddenData = "";
            maxlength = "";
            inlineStyle = axpBtnElem.attr('style');
            if (axpBtnElem.hasClass('flddis')) {
                disableClass = 'flddis';
            } else {
                disableClass = '';
            }
        }
        if (idOFtheField != "")
            tableHtml += createInpLabel(idOFtheField, textOfTheField, valueOfTheField, eleType, isFieldVisible, hiddenData, maxlength, inlineStyle, disableClass, calledFrom, displayClasses);
    });
    if (wrapperForEditFieldsIsHidden == true) {
        $j("#" + wrapperForEditFields).addClass("hide");
        wrapperForEditFieldsIsHidden = false;
    }
    return tableHtml;
}

function AddNewFormRowInDc(dcNo, calledFrom) {
    isLoadDataRow = true;
    var strRowNo = "",
        strRowNoAdd = "001";
    var TrId = "sp" + dcNo + "R001";
    if ($j("#wrapperForEditFields" + dcNo + " .editWrapTr.grid-stack.dynamicRunMode.dirty").length > 0) {
        TrId = $j("#wrapperForEditFields" + dcNo + " .editWrapTr.grid-stack.dynamicRunMode.dirty").last().attr("id").split("F")[0];
        strRowNo = TrId.substring(TrId.length - 3, TrId.length);
        var i = parseInt(strRowNo, 10);
        strRowNoAdd = GetRowNoHelper(i + 1);
        strRowNo = GetRowNoHelper(i);
    } else
        strRowNo = TrId.substring(TrId.length - 3, TrId.length);
    if (strRowNoAdd == "001")
        editTheRow("", dcNo, "", event);
    else
        editTheRow("", dcNo, strRowNo, event);

    axpBtnClickEvent(strRowNoAdd);
    setDesignedLayout("divDc" + dcNo);
    formGridRowBlur($("#axp_recid" + dcNo + strRowNoAdd + "F" + dcNo));
    AxEditActiveRowNo = parseInt(strRowNoAdd, 10);
    UpdateDcRowArrays(dcNo, GetRowNoHelper(AxEditActiveRowNo), "Add");
    isLoadDataRow = false;
}
//#EndRegion FormGridEdit;


//#region InlineGridEdit
/**
* Inline grid edit functions
------------------------------------
* {author}  -   Malakonda reddy 
*/

/**
* when user clicks on any grid cell then convert that entire row to an editable mode       
* @param  {dcNo}        current dc no.
* @param  {td}          table td  - next editable cell(previous/next td)
* @param  {col}         column index
* @param  {row}         row index
* @return               converts the selected grid row into editable mode       
------------------------------------
*/
function inlineGridEdit(dcNo, td, col, row,ent) {
    try {
        if ($(".grd-attach-popover").length > 0) //prevent inline edit mode if any grid attachment(files count) popover is opened
            return;
        AxActiveDc = dcNo;
        var editorHtml = "",
            onlySave = globalOnlySave;
        var parentTrElement = $j(td).closest("tr");
        var editHtml = "";
        editDivId = $j("#wrapperForEditFields" + dcNo + " .editWrapTr").attr('id');
        var fields = GetGridFields(dcNo);
        var endIdPart = row + 'F' + dcNo; //002F2
        var dvId = "sp" + dcNo + 'R' + endIdPart;
        var focusIndex = 0;
        if (parentTrElement != "") {
            if ($(".inline-edit").length > 0) // if any grid row is in edit mode then update & remove row editmode
                updateInlineGridRowValues();
            $(".inline-edit").find("textarea").show();
            makeIdsEdit($(".inline-edit"), "remove");
            $(".inline-edit").removeClass("inline-edit");
            editHtml += '<div id="' + dvId + '" class="editWrapTr">';
            parentTrElement.addClass('inline-edit');
            parentTrElement.find('td').each(function (index, el) {
                editorHtml = "";
                if (index == 0) {
                    //means last edit delete field which we can skip adding
                    $j(el).find('[onclick*="editTheRow"], [onclick*="editTheRow"] .glyphicon').addClass('disabled').attr('disabled', 'disabled');
                } else if (index == 1) {
                    //means we have a delete button
                    editorHtml += '<div class="gridtdclass d-none">' + $j(el).html() + '</div>';
                } else {
                    var visibility = $j(el).is(':visible');
                    var presentLabel = $j(el).find('textarea.labelInp');
                    var typeOfField = presentLabel.attr('data-type');
                    typeOfField != undefined ? typeOfField = typeOfField.toLowerCase() : "";
                    var idOFtheField = presentLabel.attr('id');
                    var textOfTheField = presentLabel.text();
                    var valueOfField = presentLabel.val();
                    var maxlength = presentLabel.attr('maxlength');
                    maxlength == undefined ? maxlength = "" : "";
                    var inlineStyle = presentLabel.attr('data-style');
                    var isFieldDisable = presentLabel.hasClass('flddis') == false ? (presentLabel.attr("disabled") == "disabled" ? true : false) : presentLabel.hasClass('flddis');
                    var fieldClasses = presentLabel.attr('class');

                    //for taking grid field caption using field id
                    var fName = GetFieldsName(idOFtheField);
                    var fldIndex = $j.inArray(fName, FNames);
                    var fldCaption = FCaption[fldIndex];

                    if (typeOfField != undefined && typeOfField != "undefined") {
                        var tmpId = idOFtheField;
                        typeOfField == 'select' ? (tmpId = idOFtheField.substr(5), oldEditValues += $("#" + tmpId + " option:selected").val() + "¿" + $("#" + tmpId + " option:selected").text() + "♠") : (tmpId = idOFtheField, oldEditValues += valueOfField + "♠");
                        typeOfField == 'axpbtn' ? tmpId = idOFtheField.substr(11) : tmpId = tmpId;
                        typeOfField == 'axpbtncustom' ? tmpId = idOFtheField.substr(11) : tmpId = tmpId;

                        valueOfField ? valueOfField = checkSpecialCharacters(valueOfField, 'encode') : "";
                        var lastIndexF = tmpId.lastIndexOf("F");
                        if (tmpId.substr(lastIndexF, 3).length == 3) { //f12
                            //remove last 6 chars
                            tmpId = tmpId.substr(0, tmpId.length - 6);
                            tmpId = tmpId + "tmp";
                        } else {
                            //remove last 5 chars
                            tmpId = tmpId.substr(0, tmpId.length - 5);
                            tmpId = tmpId + "tmp";
                        }


                        //if (typeOfField == 'checkbox') {
                        //    editorHtml += '<label for="' + idOFtheField + '">';
                        //}

                        var classes = "";
                        if (typeOfField == 'checkbox')
                            classes = " form-check form-switch form-check-custom px-1 align-self-end ";
                        else if(idOFtheField.toLowerCase().startsWith("barqr_"))
                            classes = " input-group";
                        editorHtml += '<div class="edit-mode-content' + classes + '" data-type="' + typeOfField + '" style="' + (visibility ? '' : 'display:none;') + '" data-fld-id="' + idOFtheField + '">';

                        if (typeOfField == "hidden") {
                            var axpfilePath = "";
                            if (idOFtheField.toLowerCase().startsWith("axpfilepath_")) {
                                var endPart = idOFtheField.substring(("axpfilepath_").length);
                                axpfilePath = "axpFilePath_" + endPart + " axpFilePathFld ";
                                editorHtml += '<div style="display:none;"><input style="height:0px;width:0px;" id="' + idOFtheField + '" type="hidden" value="' + valueOfField + '" class="' + axpfilePath + '" name="' + idOFtheField + '"></div>';
                            } else
                                editorHtml += '<div style="display:none;"><input style="height:0px;width:0px;" id="' + idOFtheField + '" type="hidden" value="' + valueOfField + '" name="' + idOFtheField + '"></div>';
                        } else if (typeOfField == 'picklist') {
                            var hiddenFiledData = presentLabel.data('hidden').split('~'); //pickIdVal_itemcode001F2~16829000000000
                            //IF its from fill grid adding id's manually
                            if (hiddenFiledData[0] == "") {
                                hiddenFiledData[0] = "pickIdVal_" + idOFtheField;
                                hiddenFiledData[1] = "";
                            }

                            editorHtml += '<nobr>';
                            editorHtml += '<span class="picklist input-group ">';
                            if (isFieldDisable) {
                                editorHtml += '<input disabled type="text" id="' + idOFtheField + '" title="" name="' + idOFtheField + '" value="' + valueOfField + '" maxlength="' + maxlength + '" class="tem inputClass2 pixelwidth form-control flddis " style="' + inlineStyle + '">';
                            } else {
                                editorHtml += '<input type="text" id="' + idOFtheField + '" title="" name="' + idOFtheField + '" value="' + valueOfField + '" maxlength="' + maxlength + '" class="tem inputClass2 pixelwidth form-control focus-input" style="' + inlineStyle + '">';
                            }

                            editorHtml += '<span class="input-group-addon handCur pickimg " id="img~' + idOFtheField + '" name="img~' + idOFtheField + '">';
                            editorHtml += '<i class="glyphicon glyphicon-search icon-basic-magnifier"></i>';
                            editorHtml += '</span>';
                            editorHtml += '<div class="picklisttxtclear icon-arrows-remove" title="Clear Text" style="position: absolute;right: 39px;z-index: 3;font-size: 22px;font-weight: bold;indexor: black"></div>';
                            editorHtml += '<input type="hidden" id="' + hiddenFiledData[0] + '" value="' + hiddenFiledData[1] + '" name="' + hiddenFiledData[0] + '">';
                            editorHtml += '</span>';
                            editorHtml += '</nobr>';
                            editorHtml += '</div>';
                        } else if (typeOfField == "input" || typeOfField == "numeric") {
                            var classes = "";
                            var timepicker = "";
                            var axpfilePath = "";
                            let dwbfieldName = GetFieldsName(idOFtheField);
                            let dwbfldInd = GetFieldIndex(dwbfieldName);
                            var fldDType = GetDWBFieldType(idOFtheField, dwbfldInd);
                            if (idOFtheField.indexOf("axptm_", 0) === 0 || idOFtheField.indexOf("axpdbtm_", 0) === 0 || (fldDType != "" && fldDType.toLowerCase() == "time")) {
                                if (TimeFieldPattern(idOFtheField))
                                    timepicker = " tstOnlyTime24hours flatpickr-input ";
                                else
                                    timepicker = " tstOnlyTime flatpickr-input ";
                            } else if (idOFtheField.toLowerCase().startsWith("axpfilepath_")) {
                                var endPart = idOFtheField.substring(("axpfilepath_").length);
                                axpfilePath = " axpFilePath_" + endPart + " axpFilePathFld ";
                            } else if (idOFtheField.toLowerCase().startsWith("barqr_")) {
                                editorHtml += `<div class="divBarQrScan input-group-text p-2 cursor-pointer"><span class="material-icons material-icons-style material-icons-1">center_focus_weak</span></div>`;
                            }
                            typeOfField == "numeric" ? classes = "tem form-control  Family number" : classes = axpfilePath + "tem form-control  Family " + timepicker;
                            if (timepicker != "")
                                editorHtml += '<span class="input-group">';
                            if (fldDType == "Table") {
                                editorHtml += '<div class="input-group">';
                                classes = "fldCustTable " + classes;
                            }
                            if (isFieldDisable) {
                                editorHtml += '<input disabled id="' + idOFtheField + '" name="' + idOFtheField + '" title="" value="' + valueOfField + '" maxlength="' + maxlength + '"  class=" ' + classes + ' flddis" style="' + inlineStyle + '" type="text">';
                            } else {
                                editorHtml += '<input id="' + idOFtheField + '" name="' + idOFtheField + '" title="" value="' + valueOfField + '" maxlength="' + maxlength + '" class="focus-input ' + classes + '" style="' + inlineStyle + '" type="text">';
                            }
                            if (timepicker != "") {
                                editorHtml += '<span class="input-group-text" data-toggle=""><span class="material-icons material-icons-style cursor-pointer fs-4">schedule</span></span>';
                                editorHtml += '</span>';                                
                            }
                            if (fldDType == "Table")
                                editorHtml += '<span class="input-group-text"><span class="material-icons material-icons-style cursor-pointer fs-4 fldCustTableIcon" data-clk="' + idOFtheField + '-tbl">apps</span></span></div>';
                        } else if (typeOfField == "datepicker") {
                            editorHtml += '<span class="input-group">';
                            if (isFieldDisable) {
                                editorHtml += '<input disabled id="' + idOFtheField + '" name="' + idOFtheField + '" title="" value="' + valueOfField + '" maxlength="' + maxlength + '" class="tem Family form-control date flatpickr-input  flddis " style="' + inlineStyle + '" type="text">';
                            } else {
                                editorHtml += '<input id="' + idOFtheField + '" name="' + idOFtheField + '" title="" value="' + valueOfField + '" maxlength="' + maxlength + '" class="tem Family form-control date flatpickr-input focus-input " style="' + inlineStyle + '" type="text">';
                            }
                            editorHtml += '<span class="input-group-text spandate" id="basic-addon2"><span class="material-icons material-icons-style cursor-pointer fs-4">calendar_today</span></span>';
                            editorHtml += '</span>';
                        } else if (typeOfField == "select") {
                            var idOfSelectField = idOFtheField.substr(5);
                            var selectMarkup = $j("#" + idOFtheField.substr(5)).html();
                            if (isFieldDisable) {
                                editorHtml += '<select disabled id="' + idOfSelectField + '" class="form-control flddis " style="display: inline-block !important">';
                            } else {
                                editorHtml += '<select id="' + idOfSelectField + '" class="form-control focus-input" style="display: inline-block !important">';
                            }
                            editorHtml += selectMarkup;
                            editorHtml += '</select>';
                        } else if (typeOfField == 'gridattach') {
                            idOFtheField = idOFtheField.substr(4); //grdAdisctype001F2
                            var hdnScriptsUrlPath = $j("#hdnScriptsUrlpath");
                            var lastIndexF = idOFtheField.lastIndexOf("F"); //AxpFin_F2001F12
                            var rowNo = idOFtheField.substr(lastIndexF - 3, 3); //001
                            fileLinks = "";
                            editorHtml += '<input type="hidden" id="' + idOFtheField + '" tabindex="-1" name="' + idOFtheField + '" value="' + valueOfField + '" class="grdAttach handCur">'; //axp_gridattach_2001F2   endIdPart
                            editorHtml += '</div>';
                        } else if (typeOfField == 'checkbox') {
                            //var isCompMode = false;
                            //if (($("#ckbCompressedMode").length && $("#ckbCompressedMode").prop('checked') == true) || ($j("#hdnCompMode").length && $j("#hdnCompMode").val().toLowerCase() == "true")) isCompMode = true;
                            //if (isCompMode)
                            //    editorHtml += '<div style="min-height: 23px;">';
                            //// else
                            //// editorHtml += '<div style="min-height: 30px;">';

                            editorHtml += '<input id="' + idOFtheField + '" name="' + idOFtheField + '" title="" alt="' + presentLabel.data('hidden') + '" value="' + valueOfField + '" class="form-check-input opacity-100 gridchk Family focus-input h-30px" style="' + inlineStyle + '" type="checkbox"';
                            if (isFieldDisable) editorHtml += ' disabled readonly ';
                            if (valueOfField.toLowerCase() == 'yes') editorHtml += ' checked="checked" ';
                            editorHtml += ' ></input>'
                            editorHtml += '<span class="gridChkSpan form-check-label form-label col-form-label opacity-100 noempty nopurpose col-form-label-sm d-none">' + fldCaption + '</span></label>';
                            editorHtml += '</div>';
                        } else if (typeOfField == "textarea") {
                            if (isFieldDisable) {
                                editorHtml += '<textarea rows="2"  id="' + idOFtheField + '" name="' + idOFtheField + '" title="" disabled readonly maxlength="' + maxlength + '" class="tem form-control Family disabled " data-txt-area="true" style="' + inlineStyle + '" >' + valueOfField + '</textarea>';
                            } else {
                                editorHtml += '<textarea rows="2" id="' + idOFtheField + '" name="' + idOFtheField + '" title=""  maxlength="' + maxlength + '" class="tem form-control  Family  focus-input" data-txt-area="true" style="' + inlineStyle + '" >' + valueOfField + '</textarea>';
                            }
                        } else if (typeOfField.indexOf("fromselect") != -1) {
                            // data-refresh=\"false\" data-addoption=\"" + refSelsrctDetails + "\"
                            let typeOfAutoComFld = typeOfField.split("~");
                            let auRefreshOnSave = typeOfAutoComFld[1] && typeOfAutoComFld[1] === "isrefreshsave" ? "isrefreshsave" : "";
                            let addOption = typeof $("#" + idOFtheField).data("addoption") != "undefined" ? " data-addoption='" + $("#" + idOFtheField).data("addoption") + "'" : "";
                            if (isFieldDisable) {
                                if (typeOfField == "fromselect-pick")
                                    editorHtml += '<select disabled class="tem fldFromSelect form-control form-select ' + auRefreshOnSave + '" data-control="select2" id="' + idOFtheField + '" data-placeholder="Select an option" data-allow-clear="true" data-refresh="false" "' + addOption + '">';
                                else
                                    editorHtml += '<select disabled class="tem fldFromSelect form-control form-select fastdll ' + auRefreshOnSave + '" data-control="select2" id="' + idOFtheField + '" data-placeholder="Select an option" data-allow-clear="true" data-refresh="true" "' + addOption + '">';
                            } else {
                                if (typeOfField == "fromselect-pick")
                                    editorHtml += '<select class="tem fldFromSelect form-control focus-input form-select ' + auRefreshOnSave + '" data-control="select2" id="' + idOFtheField + '" data-placeholder="Select an option" data-allow-clear="true" data-refresh="false" "' + addOption + '">';
                                else
                                    editorHtml += '<select class="tem fldFromSelect form-control focus-input form-select fastdll ' + auRefreshOnSave + '" data-control="select2" id="' + idOFtheField + '" data-placeholder="Select an option" data-allow-clear="true" data-refresh="true" "' + addOption + '">';
                            }
                            if (valueOfField != ""){
                                valueOfField=valueOfField.replace(/#amp:/g, "&").replace(/#lt:/g, "<").replace(/#gt:/g, ">").replace(/#apos:/g, "'").replace(/#quot:/g, '"');
                                editorHtml += '<option value="' + valueOfField + '" selected="selected">' + valueOfField + '</option>';
                            }
                            editorHtml += '</select>';
                        } else if (typeOfField.indexOf("multigroupselect") != -1) {
                            // editorHtml += '<div class="autoinput-parent dropdown-mul">';
                            // var datasep = presentLabel.attr('data-sep');
                            // if (valueOfField != "") {
                            //     valueOfField = valueOfField.replace(/#amp:/g, "&");
                            //     valueOfField = valueOfField.replace(/#apos:/g, "'")
                            // }
                            // let typeOfMgsFld = typeOfField.split("~");
                            // let mgsRefreshOnSave = typeOfMgsFld[1] && typeOfMgsFld[1] === "isrefreshsave" ? "isrefreshsave" : "";
                            // typeOfField = typeOfMgsFld[0];
                            // if (isFieldDisable)
                            //     editorHtml += '<select disabled data-type="multigroupselect" multiple data-selected="' + valueOfField + '" data-sep="' + datasep + '" id="' + idOFtheField + '" name="' + idOFtheField + '" title="" maxlength="' + maxlength + '" class="tem fldmultiSelect pixelwidth form-control ' + mgsRefreshOnSave + '" style=""></select>';
                            // else
                            //     editorHtml += '<select data-type="multigroupselect" multiple data-selected="' + valueOfField + '" data-sep="' + datasep + '" id="' + idOFtheField + '" name="' + idOFtheField + '" title="" maxlength="' + maxlength + '" class="tem fldmultiSelect pixelwidth form-control ' + mgsRefreshOnSave + '" style=""></select>';
                            // if (valueOfField != "")
                            //     SetMultiSelectValue(idOFtheField, valueOfField);
                            // editorHtml += '</div>';

                            var datasep = presentLabel.attr('data-sep');
                            if (valueOfField != "") {
                                valueOfField = valueOfField.replace(/#amp:/g, "&");
                                valueOfField = valueOfField.replace(/#apos:/g, "'")
                            }
                            let typeOfMgsFld = typeOfField.split("~");
                            let mgsRefreshOnSave = typeOfMgsFld[1] && typeOfMgsFld[1] === "isrefreshsave" ? "isrefreshsave" : "";
                            typeOfField = typeOfMgsFld[0];
                            editorHtml += '<select class="tem fldmultiSelect form-control focus-input form-select" data-control="select2" id="' + idOFtheField + '" data-type="multigroupselect" multiple data-selected="' + valueOfField + '" data-sep="' + datasep + '" data-placeholder="Select an option" data-allow-clear="true">';
                            if (valueOfField != "") {
                                $.each(valueOfField.split(datasep), function (ind, val) {
                                    editorHtml += '<option value="' + val + '" selected="selected">' + val + '</option>';
                                });
                            }
                            editorHtml += '</select>';
                        }

                        $(el).append(editorHtml);
                        if (visibility && !isFieldDisable) //if the input field is visible & not disabled then add attributes 'data-focus' & 'data-focus-index' to the td - for keyboard events
                            $(el).attr({
                                "data-focus-index": ++focusIndex,
                                "data-focus": ''
                            });

                        var fldMandatoryAttr = $j(el).attr("inline-grid-warning");
                        if (fldMandatoryAttr != undefined && fldMandatoryAttr == "") {
                            $(el).find(".focus-input").css("border", "1px solid red");
                        }
                    }
                }
            });

            //decode & update input values (&, <, >, ', ")
            $(parentTrElement).find("input").each(function () {
                selectedVal = $(this).val();
                selectedVal = selectedVal.replace(/#amp:/g, "&").replace(/#lt:/g, "<").replace(/#gt:/g, ">").replace(/#apos:/g, "'").replace(/#quot:/g, '"');
                $(this).val(selectedVal);
            });

            $(parentTrElement).attr("last-focus-index", focusIndex); //set total visible & not disabled fields(td's) to tr 
          
            makeIdsEdit(parentTrElement, "add");
            $(".inline-edit").find("textarea:not([data-txt-area])").hide();
            var arrEditDiv = new Array();
            arrEditDiv.push("#" + parentTrElement.attr("id"));
            AssignJQueryEvents(arrEditDiv);
            if (isScriptFCAddClick) {
                ShowDimmer(true);
                isScriptFCAddClick = false;
            }
            assignInlineGridEditEvent(dcNo); //keydown events for inline grid cell.
            CheckShowHideFldsGrid(dcNo, parentTrElement.attr("id")); //to show/hide grid fields on click of edit
            if ($("[inline-grid-warning]").length > 0 && !isMobile) //if any grid field is invalid then focus on that particular field when user clicks on save button or grid add button
                $("[inline-grid-warning]").find(".focus-input").first().focus();
            else if (focusOnDeleteButton || !inlineShiftKeyPressed) {
                setTimeout(function () {
                    $("textarea.select2-search__field").addClass("cursor-pointer");
                    if (forceRowedit) {
                        forceRowedit = false;
                        return;
                    }

                    if (focusOnDeleteButton)
                        $(parentTrElement).find('input.gridRowChk').focus();
                        //$(parentTrElement).find('[onclick*="DeleteRow"]').focus();
                    else if ($(td).is("td")) {
                        if ($(td).find(".upload-icon").length) //if column type is attachment then focus on the upload icon
                            $(td).find(".upload-icon").focus();
                        else {
                            var focusElem = $(td).find(".focus-input").filter(':visible').not(':disabled')
                            focusElem = focusElem.length == 0 ? $(td).find(".fldmultiSelectInput").filter(':visible').not(':disabled') : focusElem;
                            var curElem = $(td);
                            while (focusElem.length == 0 && curElem.length != 0) { //if any field is disabled then find next focus input element
                                curElem = $(curElem).next();
                                focusElem = curElem.find(".focus-input").filter(':visible').not(':disabled');
                            }
                            if (focusElem.length > 0)
                                focusElem.focusCursorToEnd();
                            else if ($(parentTrElement).find('[onclick*="DeleteRow"]').is(":visible"))
                                $(parentTrElement).find('[onclick*="DeleteRow"]').focus();
                        }
                    } else {
                        $(parentTrElement).find("[data-focus][data-fld-mandatory]") ? $(parentTrElement).find("[data-focus][data-fld-mandatory] .focus-input:first").focusCursorToEnd() : $(parentTrElement).find("[data-focus] .focus-input:first").focusCursorToEnd();
                    }
                }, 30);
            }

            hideacoptions();
            try {
                AxAfterInlineEditRow(dcNo, GetClientRowNo(row + 1, dcNo));
            } catch (e) {

            }
            customAlignTstructFlds([], dcNo, $(parentTrElement).index() + 1); //field alignment based on configuation
        }
    } catch (e) {
        console.log("Exception: " + e);
    }
}

//clears the inline grid edit mode & update the input field values to the textarea
function updateInlineGridRowValues(isValidated = false) {
    try {
        if ($(".grd-attach-popover").length) //don't clear editmode if any confirm dialog opened(grid row delete or attachment file delete)
            return;
        $(".inline-edit td").removeAttr("data-focus-index");
        $(".inline-edit").removeAttr("last-focus-index");
        $(".inline-edit").closest("tr").find('td').each(function (index, td) {
            if (index == 0) {
                //means last edit delete field which we can skip adding
                $j(td).find('.glyphicon').removeClass('disabled').removeAttr('disabled');
                $j(td).find('.gridEditDeleteBtns').removeClass('disabled').removeAttr('disabled');

            } else {
                var curFldId, curFldType, selectedVal, selectFldId, selectedTxt;
                if ($(td).find(".edit-mode-content").length > 0) {
                    curFldId = $(td).find(".edit-mode-content").data("fld-id");
                    curFldType = $(td).find(".edit-mode-content").data("type");
                    if (curFldType == "select") {
                        selectFldId = curFldId.substr(5);
                        selectedVal = $("#" + selectFldId).val();
                        selectedTxt = $("#" + selectFldId).find("option:selected").text();
                        selectedVal == '-- Select --' ? selectedVal = "" : "";
                        selectedVal == "" ? selectedTxt = "" : selectedVal = selectedTxt;
                    } else if (curFldType == "checkbox")
                        selectedVal = $("#" + curFldId).is(":checked");
                    else
                        selectedVal = $("#" + curFldId).val();

                    //update grid field selected values
                    if (curFldType == "input" || curFldType == "numeric" || curFldType == "datepicker" || curFldType == "fromselect-select" || curFldType == "fromselect-pick" || curFldType == "fromselect-pick~isrefreshsave" || curFldType == "fromselect-select~isrefreshsave" || curFldType == "textarea" || curFldType == "hidden")
                        $("#EDIT\\~" + curFldId).val(selectedVal);
                    else if (curFldType === "picklist") {
                        var hiddenData = $(td).find('span.picklist input[type = hidden]').attr('id') + '~' + $(td).find('span.picklist input[type = hidden]').val();
                        $("#EDIT\\~" + curFldId).val(selectedVal).text(selectedVal).attr("data-hidden", hiddenData);
                    } else if (curFldType == "select") {
                        $("#txtA\\~" + selectFldId).text(selectedVal);
                        $("#EDIT\\~" + selectFldId).find("option").removeAttr("selected");
                        $("#EDIT\\~" + selectFldId).find("option").each(function () {
                            if (selectedTxt == $(this).text())
                                $(this).attr({
                                    "selected": "selected",
                                    "value": selectedTxt
                                });
                        });
                    } else if (curFldType == "checkbox")
                        $("#EDIT\\~" + curFldId).val(selectedVal ? "YES" : "NO");
                    else if (curFldType == "multigroupselect" || curFldType == "multigroupselect~isrefreshsave") {
                        var hiddenData = $(td).find('select.fldmultiSelect').attr('data-selected');
                        $("#EDIT\\~" + curFldId).val(hiddenData);
                    }

                    var fldObj = $("#" + curFldId);
                    var fldId = fldObj.attr("id");
                    var fName = GetFieldsName(fldId);
                    var fldIndex = $j.inArray(fName, FNames);
                    if (fldIndex != -1) {
                        var allowEmpty = GetFieldProp(fldIndex, "allowEmpty");
                        var fldValue = fldObj.val();
                        if (allowEmpty === "F") {
                            var fldType = FDataType[fldIndex];
                            if ((fldType == "Numeric" && parseFloat(fldValue) == 0 || fldValue === "" || fldValue === null)) {
                                fldObj.css("border", "1px solid red");
                                fldObj.closest("td").attr("data-fld-mandatory", '');
                            } else {
                                fldObj.css("border", "1px solid rgb(204, 204, 204)");
                                fldObj.closest("td").removeAttr("data-fld-mandatory");
                            }
                        }
                    }

                    //show & update grid textarea id's
                    if (curFldType == "select") {
                        $("#txtA\\~" + selectFldId).show();
                        $("#EDIT\\~" + selectFldId).attr("id", selectFldId);
                    } else if (curFldType == "gridattach" || curFldType == "axpbtn")
                        $("#EDIT\\~" + curFldId).attr("id", curFldId);
                    else if (curFldType == "gridattach" || curFldType == "axpbtncustom")
                        $("#EDIT\\~" + curFldId).attr("id", curFldId);
                    else
                        $("#EDIT\\~" + curFldId).show().attr("id", curFldId);
                } else {
                    if ($(td).find("label").hasClass("slno")) {
                        var lblId = $(td).find(".slno").attr("id");
                        if (lblId.indexOf("EDIT~") == 0)
                            $(td).find(".slno").attr("id", lblId.substr(5));
                    }
                }
                customAlignTstructFlds([], AxActiveDc, $(".inline-edit").index() + 1); //field alignment based on configuation
            }
        });

        var grdRowValid = true;
        if (!isValidated) {
            //if atleast one field is invalid(for mandatory fields) then add a attribute 'data-valid-row'='false' to that table, if it is valid row then add 'data-valid-row'='true'
            $(".inline-edit").closest("table").find("th .required").closest("th").each(function () {
                if (grdRowValid) {
                    var colIndex = $(this).index();
                    var inputfld = $(".inline-edit").find("td:nth-child(" + (colIndex + 1) + ")").find(".focus-input");
                    var fldId = inputfld.attr("id");
                    var fName = GetFieldsName(fldId);
                    var fldIndex = $j.inArray(fName, FNames);
                    var fldValue = inputfld.val();
                    var fldType = FDataType[fldIndex];
                    if ((fldType == "Numeric" && parseFloat(fldValue) == 0 || fldValue === "" || fldValue === null)) {
                        grdRowValid = false;
                    }
                }
            });
        }

        $(".inline-edit").attr("data-valid-row", grdRowValid);

        $(".inline-edit").removeClass("inline-edit").find(".edit-mode-content").remove();
        try {
            AxAfterInlineAddRowUpdate();
        } catch (e) {}
    } catch (e) {
        console.log("Exception: " + e);
    }
}

//to add a new empty row(at the end) in the grid when user clicks on add row
function addNewInlineGridRow(dcNo, calledFrom) {
    try {
        AxActiveDc = dcNo;
        inlineShiftKeyPressed = false;       
        if (calledFrom === undefined && !validateInlineGridRow(dcNo, "addrow")) { //if any mandatory field is empty then ignore adding a new record & focus on the row first mandatory field
            return;
        }
        updateInlineGridRowValues();
        rowNo = getNewEditRowNo(dcNo);
        AxActiveRowNo = parseInt(rowNo); //to set next active row no


        $("[inline-grid-warning]").removeAttr("inline-grid-warning");
        var wrapperForEditFields = "wrapperForEditFields" + dcNo;
        var rowId = $j("#" + wrapperForEditFields + " .editWrapTr").attr('id');
        var deleteRowExists = false;
        var deleteRowHtml = "";
        AxCurrGridRowNo = parseInt(GetFieldsRowNo(rowId), 10);
        var deleteHtml = "";

        //checking for the first field for delete image
        // if ($j("#" + wrapperForEditFields + " .gridtdclass").first().find('a.rowdelete').length > 0) {
        //     deleteRowExists = true;
        //     deleteRowHtml = $j("#" + wrapperForEditFields + " .gridtdclass").first().find('a.rowdelete')[0].outerHTML;
        // }
        // deleteHtml = "<td style='display:none;'>" + deleteRowHtml + "</td>"

        var tableHtml = createGridHtmlFromEdit(dcNo);
        // var editDeleteOpts = "<td " + (gridColOptVisibility("uniqueEditDeleteAct", dcNo) ? "" : "style=\"display:none;\"") + "><a class=\"btn btn-sm btn-icon btn-white btn-color-gray-600 btn-active-primary me-2 shadow-sm gridEditDeleteBtns\" onclick='editTheRow(this," + dcNo + ",\"" + GetFieldsRowNo(rowId) + "\",event);' title=\"Edit\"><span class='material-icons material-icons-style material-icons-3" + (gridDummyRows == true ? "'" : (calledFrom === "LoadData" || calledFrom === "GetDep" ? "'" : " disabled' disabled='disabled''")) + ">edit</span></a>";
        // if (deleteRowExists)
        //     editDeleteOpts += "<a class=\"btn btn-sm btn-icon btn-white btn-color-gray-600 btn-active-primary me-2 shadow-sm gridEditDeleteBtns " + (gridDummyRows == true ? "disabled' disabled='disabled'" : "'") + "\" onclick='DeleteRow(" + dcNo + ", \"" + GetFieldsRowNo(rowId) + 'F' + dcNo + "\",this)' title=\"Delete\"><span class=\"material-icons material-icons-style material-icons-3\">delete</span></a>";
        // editDeleteOpts += "</td>";

        var editDeleteOpts = "<td class=\"text-center\"><span class=\"tem1\"><div class=\"form-check form-check-sm form-check-custom ms-2\"><input class=\"form-check-input border-gray-500 fgChk gridRowChk\" type=\"checkbox\" name=\"grdchkItemTd" + dcNo + "\" id=\"grdchkItemTd" + GetFieldsRowNo(rowId) + "F" + dcNo + "\" onclick=\"javascript:CheckboxGridRow(this," + dcNo + "," + GetFieldsRowNo(rowId) + ",event);\"></div></span></td>";

        var rowNoToCheck = "";
        var dcClientRows = GetDcClientRows(dcNo);
        var lastRow = dcClientRows.getMaxVal();
        if (lastRow == 0) lastRow = 1;
        var addedRowNum = GetRowNoHelper(lastRow);
        globalClickTheEditRow = addedRowNum;
        rowNoToCheck = addedRowNum;
        var newRowId = "sp" + dcNo + "R" + GetFieldsRowNo(rowId) + "F" + dcNo;
        var slNoHtml = '<td ' + (gridColOptVisibility("uniqueThHead", dcNo) == false ? "style=\"display:none;\"" : (gridColOptVisibility("uniqueThHead", dcNo) || IsTabDc(dcNo)) ? "" : "style=\"display:none;\"") + '>' + $j("#" + wrapperForEditFields + " .gridElement").first().find('label')[0].outerHTML + '</td>';
        var gridValidRow = false;
        gridValidRow = (calledFrom === "LoadData" || calledFrom === "GetDep");
        $j(".wrapperForGridData" + dcNo + " tbody").append("<tr data-valid-row='" + gridValidRow + "' id='" + newRowId + "'>" + editDeleteOpts + deleteHtml + slNoHtml + tableHtml + "</tr>");
        //Commenting this as Not required for inline-HEA000031 
        //setDesignedLayout("divDc" + dcNo);
        //here we create the edit area again  

        changeEditLayoutIds(addedRowNum, dcNo);
        //Set axp_isgrdvld to true

        if (calledFrom != 'LoadData' && calledFrom != 'Action' && gridDummyRows == false) {
            if (calledFrom != 'GetDep')
                UpdateFieldArray(ConstructFieldName(axpIsRowValid + AxActiveDc, AxActiveDc, lastRow + 1), GetRowNoHelper(lastRow + 1), "false", "parent", "AddRow");
            AddInlineRow(dcNo, "AddInlineRow", undefined, calledFrom);
            navValidator = true;
        }

        if (calledFrom == 'LoadData' && gridDummyRows == false) {
            $j("#chkallgridrow" + dcNo).prop("disabled", false);
        }

        //Update the serial no of the newly added row and hidden count

        //Forcefully updating serial no
        var rCnt = $j('#gridDc' + dcNo + ' tbody>tr').length ? 0 : $j('#gridHd' + dcNo + ' tbody>tr').length;
        $j("#hdnSlNoCnt" + dcNo).val(rCnt);
        $j("#lblSlNo" + rowNo + "F" + dcNo).text(rCnt);

        SetRowCount(dcNo, rCnt, "d", undefined);
        //SetRowCount(dcNo, lastRow, "d", undefined);

        // isAttachMentExist ? clearTheAttachments(dcNo, addedRowNum) : "";
        checkTableBodyWidths(dcNo);
        //ShowDimmer(false);
        AxEditActiveRowNo = parseInt(addedRowNum, 10) + 1;
        UpdateDcRowArrays(dcNo, GetRowNoHelper(AxEditActiveRowNo), "Add");

        if (calledFrom == 'LoadData')
            showAttachmentPopover();

        var rowIndex = AxEditActiveRowNo;
        var nextColumnFound = false;
        if (calledFrom === undefined && gridDummyRows == false) {
            $("#" + newRowId).find("td").each(function (column, curTd) {
                if (!nextColumnFound && $(curTd).is(":visible") && $(curTd).find("textarea").data('type')) {
                    var rowIndex = $("#" + newRowId).index();
                    var columnIndex = $(curTd).index();
                    inlineGridEdit(dcNo, curTd, columnIndex, rowIndex); //convert the selected clicked row into editable row
                    nextColumnFound = true;
                }
            });
        }
        hideacoptions();
        if (IsAddRowCalled)
            ShowDimmer(true);
    } catch (e) {
        console.log("Exception: " + e);
    }
}

//displays list of uploaded files in bootstrap popover when user clicks on attachment count
function showAttachmentPopover() {
    try {
        $(".attach-popover").each(function () {
            $(this).popover({
                html: true,
                trigger: 'manual',
                placement: "bottom", //parent.gllangType === "ar" ? "right" : "left",
                content: function () {
                    var fldName = $(this).parents().siblings("input").attr("id");
                    var parentID = $(this).parent().siblings().attr("id");
                    var rowFrmNo = GetFieldsRowFrameNo(parentID);
                    var rowNo = GetFieldsRowNo(parentID);
                    var hasModalClassIn = false;
                    if ($(this).parents(".modal").hasClass("in"))
                        hasModalClassIn = true;
                    var tempPopover = $(this).parent().siblings(".attach-files").clone();
                    tempPopover.find(".revrseInlinediv").removeClass("revrseInlinediv");
                    tempPopover.find(".inlinediv").removeClass("inlinediv");
                    //Return only required files in the popover
                    tempPopover.children().each(function () {
                        if (!fldName.toLowerCase().startsWith("axpfile_")) {
                            if (rowNo == "000") {
                                var NongrdDataFiles = $(".attachment-count").parent().attr("data-morefiles");
                                if (!NongrdDataFiles.includes($(this).attr("id")))
                                    $(this).remove();
                            } else {
                                if (!hasModalClassIn) {
                                    var grdDataFiles = $j("#GridAttach" + rowFrmNo).attr("data-morefiles");
                                    if (!grdDataFiles.includes($(this).attr("id")))
                                        $(this).remove();
                                }
                            }
                        } else {
                            if (rowNo == "000") {
                                var NongrdDataFiles = $("input#" + fldName).siblings(".divNonGridAxpFile").attr("data-morefiles");
                                if (!NongrdDataFiles.includes($(this).attr("id")))
                                    $(this).remove();
                            } else {
                                if (axInlineGridEdit && !hasModalClassIn) {
                                    var grdDataFiles = $j("#GridAxpFile" + fldName).attr("data-morefiles");
                                    if (!grdDataFiles.includes($(this).attr("id")))
                                        $(this).remove();
                                } else if (!axInlineGridEdit && !hasModalClassIn && ((AxpGridForm == "popup" && !isMobile) || (!AxpGridForm == "popup" && !isMobile))) {
                                    var grdDataFiles = $j("#GridAxpFile" + fldName).attr("data-morefiles");
                                    if (!grdDataFiles.includes($(this).attr("id")))
                                        $(this).remove();
                                }
                            }
                        }
                    })

                    return tempPopover.html();
                }
            });
        });

        $(".attachment-count").click(function () {
            $(".popover-content").parent().remove();
            var fldno = "";
            var parentID = $(this).siblings().attr('id');
            var rowFrmNo = GetFieldsRowFrameNo(parentID);
            var countrowno = GetFieldsRowNo(parentID);
            var rowNo = GetFieldsRowNo(parentID);

            fldno = $(this).parent("div").siblings("input").attr("id");
            if ($(this).find(".popover").length == 0) {
                $(this).find(".attach-popover").popover("show");
                $(this).find(".popover").addClass("grd-attach-popover");
                $(this).find(".popover-content").addClass("grd-attach-popover-content");
            }
            if (!fldno.toLowerCase().startsWith("axpfile_"))
                updateAttachmentLabelCount(rowFrmNo);
            else
                updateAxpFileAttachmentLabelCount(rowFrmNo);

            //to set attachments list css before popover is displayed 
            var deleteBtn = $(".popover-content").addClass("grd-attach-content").find("a[onclick^='DeleteFileFromRow']");
            //deleteBtn.addClass("glyphicon glyphicon-remove colorButton").addClass("a-colorbutton").attr("title", eval(callParent('lcm[248]'))).find("img").remove();
            deleteBtn.addClass("a-colorbutton").attr("title", eval(callParent('lcm[248]'))).find("img").remove();
            deleteBtn.siblings("a").css("word-break", "break-all");

            //if the transaction is disabled then disable attachment files remove button
            if (deleteBtn.first().attr("disabled") == "disabled")
                deleteBtn.addClass("disabled").attr("onclick", "javascript:void(0)");

            $(".popover-content div").css("margin-bottom", "1px");
            setTimeout(function () {
                //tab focus events on popover attachments
                $(".popover-content div .grdAttach:first").focus();
                $(".popover-content div .grdAttach").keydown(function (e) {
                    if (e.which == 9) {
                        if (e.shiftKey) {
                            if ($(this).parent().prev().length > 0)
                                $(this).parent().prev().find("a").focus();
                            else
                                $(".popover-content div .grdAttach:last").focus();
                        } else {
                            if ($(this).parent().next().length > 0)
                                $(this).parent().next().find("a").focus();
                            else
                                $(".popover-content div .grdAttach:first").focus();
                        }
                        e.preventDefault();
                    }
                });
            }, 250);

            return false;
        });

        // hide any open popovers when user clicks on outside the body is clicked except that table
        $('body').off('click').on('click', function (e) {
            $('.attach-popover').each(function () {
                if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0 && !$(".jconfirm").length > 0 && !$(e.target).hasClass("glyphicon-remove")) {
                    var curPopoverId = $(".popover").prop("id");
                    $(this).popover('hide');
                    $("[aria-describedby='" + curPopoverId + "']").parent().focus();
                }
            });
        });

        //hide popover on esc key press & focus on the attachment count label
        $('body').off("keydown").on('keydown', function (e) {
            if (e.which == 27 && $(".popover").length > 0) {
                var curPopoverId = $(".popover").prop("id");
                $(".popover").popover('hide');
                $("[aria-describedby='" + curPopoverId + "']").parent().focus();
            }
        });
    } catch (e) {
        console.log("Exception: " + e);
    }
}

//tab focus events for inline grid edit from one grid cell to another cell
function assignInlineGridEditEvent(dcNo) {
    try {
        $("body").off("click").on("click", function (e) {
            // //clears grid row edit mode to normal mode when user clicks on outside of the table(except grid delete action, jquery date picker, autocomplete, grid attach dialog)
            // if ($(".inline-edit").length > 0 && e.which == 1 && !$(e.target).closest("table").length > 0 && !$(e.target).closest(".gridBtns").length > 0 && !$(e.target).hasClass("ui-menu-item-wrapper") && $(e.target).closest(".fldFromSelect").length === 0 && !$(e.target).closest(".modal").length > 0 && !$(".jconfirm").length > 0 && !$(e.target).closest(".pickListFooter").length > 0 && $(e.target).closest(".ui-datepicker").length === 0 && $(e.target).closest(".ui-datepicker-header").length === 0) {
            //     updateInlineGridRowValues(); //clear grid edit mode cell on outside clicks
            // }

            $('.attach-popover').each(function () {
                // hide any open popovers when the anywhere else in the body is clicked
                if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0 && !$(".jconfirm").length > 0 && !$(e.target).hasClass("glyphicon-remove")) {
                    var curPopoverId = $(".popover").prop("id");
                    $(this).popover('hide');
                    $("[aria-describedby='" + curPopoverId + "']").parent().focus();
                }
            });
        });

        // tab focus events for grid inline edit 
        $(".edit-mode-content, .attachment-count, .upload-icon, .attach-popover, [onclick*='DeleteRow']").off("keydown.inlineEditEv").on("keydown.inlineEditEv", function (e) {
            if (e.which == 27) { //clear grid edit mode cell on esc key press
                //updateInlineGridRowValues();
            }
            else if (e.which == 13 && $(this).hasClass("upload-icon")) //open file upload dialog when user press enter key on upload icon
                $(this).click();
            else if (e.which == 13 && $(this).hasClass("attachment-count")) {
                var attachmentId = $(this).parent().attr("id");
                setTimeout(function () {
                    $("#" + attachmentId).find(".attach-popover").click(); //show attached files in popover when user press enter key on attachment count label
                }, 200);
            } else if ($(".popover").length == 0 && e.which == 9) { //if no active attachment popover then activate grid cell tab keypress events
                var fldType = $(this).data("type") != undefined ? $(this).data("type") : "attach";
                if (fldType == "attach" && $(this).hasClass("upload-icon") && $(this).closest("td").find(".attachment-count").length > 0) //if input type is attachment & fileupload contains files then focus on attachment count label
                    $(this).closest("td").find(".attach-popover").focus();
                else {
                    if ($(".inline-edit").length === 0)
                        return;
                    var deleteButtonExists = $(this).closest("tr").find("[onclick*='DeleteRow']").is(":visible");
                    focusOnDeleteButton = deleteButtonExists;
                    var firstFocusId = "";
                    var currentTd = fldType != "attach" ? $(this).parent() : $(this).parent().parent();
                    let isAttaFld = false;
                    if (!e.shiftKey && currentTd.next().find(".edit-mode-content").attr('data-type') == "gridattach")
                        isAttaFld = true;
                    else if (e.shiftKey && currentTd.prev().find(".edit-mode-content").attr('data-type') == "gridattach")
                        isAttaFld = true;

                    var prevOrNextTd = e.shiftKey ? (isAttaFld ? currentTd.prev().prev() : currentTd.prev()) : (isAttaFld ? currentTd.next().next(): currentTd.next());

                    // while (prevOrNextTd.hasClass("none") || GetFieldProp($j.inArray(GetFieldsName($($(prevOrNextTd).find(".edit-mode-content")).children().attr("id")), FNames), "tabstop") == "F" ){
                    while (prevOrNextTd.hasClass("none")) { //if any table cell is hidden then find next/prev cell
                        prevOrNextTd = e.shiftKey ? prevOrNextTd.prev() : prevOrNextTd.next();
                    }

                    var focusCellFound = false;
                    var totalVisibleTds = parseInt($(".inline-edit").attr("last-focus-index"));
                    if (prevOrNextTd.length > 0) { // if next input focus element exists in next cell
                        var curFocusIndex = currentTd.data("focus-index");
                        var nextFocus = e.shiftKey ? (curFocusIndex - 1) : (curFocusIndex + 1);
                        if (curFocusIndex <= totalVisibleTds) {
                            if (e.shiftKey) {
                                if (nextFocus != 0) {
                                    //$("[data-focus-index='" + nextFocus + "']").find(".focus-input").focus();
                                    if ($j(prevOrNextTd).find("select").hasClass("fldmultiSelect"))
                                        $j(prevOrNextTd).find("input.fldmultiSelectInput").click();
                                    focusCellFound = true;
                                } else {
                                    if (deleteButtonExists) {
                                        setTimeout(function () {
                                            $(this).closest("tr").find('[onclick*="DeleteRow"]').focus();
                                        }, 100);
                                        focusCellFound = true;
                                    } else
                                        focusCellFound = false;
                                }
                                inlineShiftKeyPressed = true;
                            } else if (curFocusIndex === totalVisibleTds)
                                focusCellFound = false;
                            else {
                                //$("[data-focus-index='" + nextFocus + "']").find(".focus-input").focus();
                                if ($j(prevOrNextTd).find("select").hasClass("fldmultiSelect"))
                                    $j(prevOrNextTd).find("input.fldmultiSelectInput").click();
                                focusCellFound = true;
                            }
                        }
                    }

                    //if grid row delete option exists & pressing tab key will focus on the first focus input element
                    if (deleteButtonExists && $(e.target).hasClass("gridEditDeleteBtns") && !e.shiftKey)
                        focusCellFound = true;

                    if (!focusCellFound) {
                        if (!e.shiftKey && $(this).closest("tr").next().length > 0) { //tab key press - no next column found & grid next row exists then make that row into editable row & focus on first input element
                            inlineShiftKeyPressed = false;
                            var rowIndex = $(this).closest("tr").index() + 1;
                            var nextColumnFound = false,
                                curTr = $(this).closest("tr").next();
                            $(this).closest("tr").next().find("td").each(function (column, curTd) {
                                if (!nextColumnFound && $(curTd).is(":visible") && $(curTd).find("textarea").data('type')) {
                                    var columnIndex = $(this).index();
                                    if (currentTd.find(".focus-input").length && !currentTd.find(".focus-input").hasClass("upload-icon"))
                                        MainBlur(currentTd.find(".focus-input"));
                                    updateInlineGridRowValues();
                                    var rowIndex = $(this).closest("tr").index();
                                    var columnIndex = $(curTd).index();
                                    inlineGridEdit(dcNo, curTd, columnIndex, rowIndex); //convert the selected clicked row into editable row

                                    firstFocusId = $(curTd).find(".focus-input").attr("id");
                                    nextColumnFound = true;
                                    inlineShiftKeyPressed = false;
                                }
                            });

                            setTimeout(function () {
                                //once row converts to editmode - focus on delete button if exists otherwise focus on first input field
                                if (deleteButtonExists)
                                    curTr.find('[onclick*="DeleteRow"]').focus();
                                else
                                    $("#" + firstFocusId).focus();
                            }, 100);
                        } else if (e.shiftKey && $(this).closest("tr").prev().length > 0) { //shift + tab key press - no prev column found & grid prev row exists then make that row into editable row & focus on last input element
                            inlineShiftKeyPressed = true;
                            focusOnDeleteButton = false;
                            var lastCellIndex = $(this).closest("tr").find("[data-focus]:last").index();
                            var prevTrId = $(this).closest("tr").prev().attr("id");
                            if (currentTd.find(".focus-input").length && !currentTd.find(".focus-input").hasClass("upload-icon"))
                                MainBlur(currentTd.find(".focus-input"));

                            var rowIndex = $(this).closest("tr").index();
                            var columnIndex = $(this).closest("tr").prev().find("td:nth-child(" + (lastCellIndex + 1) + ")").index();
                            inlineGridEdit(dcNo, $(this).closest("tr").prev().find("td:nth-child(" + (lastCellIndex + 1) + ")"), columnIndex, rowIndex); //convert the selected clicked row into editable row
                            e.preventDefault(); //to prevent focusing on edit icon
                            setTimeout(function () {
                                var td = $("#" + prevTrId).find("td:nth-child(" + (lastCellIndex + 1) + ")");
                                if (td.find(".attachment-count").length)
                                    td.find(".attachment-count").focus(); //prev row last column type is grid attach - focus on attachment label count if exists
                                else if (td.find(".upload-icon").length)
                                    td.find(".upload-icon").focus(); //prev row last column type is grid attach - focus on upload icon
                                else
                                    td.find(".focus-input").focus(); //focus on previous row last input element
                            }, 50);
                        } else if (e.shiftKey && $(this).hasClass("attachment-count") && $(this).closest("tr").prev().length == 0) { //shift + tab keypress on grid attachment label count
                            inlineShiftKeyPressed = true;
                            focusOnDeleteButton = false;
                        } else if (e.shiftKey && $(this).closest("tr").prev().length === 0) { //shift + tab key on first grid cell then clear editmode, it will automatically focus on grid actions 
                            updateInlineGridRowValues();
                            inlineShiftKeyPressed = true;
                            focusOnDeleteButton = false;
                        } else { //no next column and row found then add a new grid row and make it into editable row & focus on first input element
                            if (currentTd.find(".focus-input").length && !currentTd.find(".focus-input").hasClass("upload-icon"))
                                MainBlur(currentTd.find(".focus-input"));
                            if (typeof callBackFunDtls != "undefined" && callBackFunDtls.startsWith("GetDependents♠") > 0) { // GIS000196
                                e.preventDefault();
                                return;
                            }
                            if (!validateInlineGridRow(dcNo)) { //if any mandatory field is empty then ignore adding a new record & focus on the row first mandatory field
                                e.preventDefault();
                                return;
                            }
                            if ($("#gridAddBtn" + dcNo).length > 0) { //if Add DC Row = false then disable grid add new row when user press tab on for last row last column
                                addNewInlineGridRow(dcNo);
                                focusOnDeleteButton = true;
                            } else
                                updateInlineGridRowValues();
                            inlineShiftKeyPressed = false;
                        }
                    }
                }
            }
        });

        //commented the code since label can handle this logic properly - Prashik & Goshali
        //to select/unselect checkbox when user clicks on inline grid edit checkbox label
        //$(".gridChkSpan").off("click").on("click", function () {
        //    var chkbox = $(this).parent().find("input[type='checkbox']");
        //    chkbox.is(":checked") ? chkbox.prop("checked", false) : chkbox.prop("checked", true);
        //});

    } catch (e) {
        console.log("Exception: " + e);
    }
}

//grid attachment - if a file added/removed then update the files count in the label
function updateAttachmentLabelCount(rowFrmNo) {
    try {
        var filesCount = $("#grdAtt_hlnk_" + rowFrmNo + "attach div").length;
        if (filesCount == 0) { //hide attachment count if no files exist
            $("[data-target='grdAtt_hlnk_" + rowFrmNo + "attach']").remove();
            $("#grdAtt_hlnk_" + rowFrmNo + "attach+.attachment-count").remove()
        } else {
            if ($("[data-target='grdAtt_hlnk_" + rowFrmNo + "attach']").hasClass("attach-popover"))
                $("[data-target='grdAtt_hlnk_" + rowFrmNo + "attach']").addClass("expandAttachment");
        }


    } catch (e) {
        console.log("Exception: " + e);
    }
}

function updateAxpFileAttachmentLabelCount(rowFrmNo) {
    try {
        var filesCount = $("#axpFileAtt_hlnk_" + rowFrmNo + "attach div").length;
        if (filesCount == 0) { //hide attachment count if no files exist
            $("[data-target='axpFileAtt_hlnk_" + rowFrmNo + "attach']").remove();
            $("#axpFileAtt_hlnk_" + rowFrmNo + "attach+.attachment-count").remove()
        } else {
            if ($("[data-target='axpFileAtt_hlnk_" + rowFrmNo + "attach']").hasClass("attach-popover"))
                $("[data-target='axpFileAtt_hlnk_" + rowFrmNo + "attach']").addClass("expandAttachment");
        }


    } catch (e) {
        console.log("Exception: " + e);
    }
}

//for inline grid edit, if any mandatory field is empty then display warning message & focus will be on the field
function validateInlineGridRow(dcNo, calledfrom) {
    var result = true;
    if (typeof calledfrom != "undefined" && gridDummyRows != false)
        return result;
    var invalidDataRows = $("#gridHd" + dcNo + " [data-valid-row='false']");
    if (invalidDataRows.length > 0) {
        $("[inline-grid-warning]").removeAttr("inline-grid-warning")
        var mandatoryFields = invalidDataRows.find("[data-fld-mandatory]");//invalidDataRows.first().find("[data-fld-mandatory]");
        if (mandatoryFields.length > 0) {
            var fldType = "";
            //mandatoryFields.first().find(".labelInp").is(":visible") ? fldType = ".labelInp" : fldType = ".focus-input";
            //var fldId = mandatoryFields.first().find(fldType).attr("Id")
            //if (typeof fldId != "undefined" && fldId.startsWith("grdAtt_img_"))
            //    fldId = mandatoryFields.first().find(".grdAttach").attr("Id");
            //var fName = GetFieldsName(fldId);
            //var fldIndex = $j.inArray(fName, FNames);

             updateInlineGridRowValues();
            // mandatoryFields.attr("inline-grid-warning", ''); //add an attribute 'inline-grid-warning' to invalid grid row td

            //var rowIndex = mandatoryFields.first().parent().index();
            //var columnIndex = mandatoryFields.first().index();
            //inlineShiftKeyPressed = false;
            //focusOnDeleteButton = false;
            //inlineGridEdit(dcNo, mandatoryFields.first(), columnIndex, rowIndex); //convert that specific row to editable mode

            //fldObj = $("#" + fldId);
            //fldValue = fldObj.val();
            //var fType = FDataType[fldIndex];
            //if ((fType == "Numeric" && parseFloat(fldValue) == 0 || fldValue === "" || fldValue === null)) {
            //    fldObj.css("border", "1px solid red"); //warning - add red color border to that td
            //    fldObj.closest("td").attr("data-fld-mandatory", '');

            //    var fieldRowNo = GetFieldsRowNo(fldId);
            //    var isExitDummy = false;
            //    if (gridDummyRowVal.length > 0) {
            //        gridDummyRowVal.map(function (v) {
            //            if (v.split("~")[0] == dcNo && v.split("~")[1] == fieldRowNo) isExitDummy = true;
            //        });
            //    }
            //    if (isExitDummy)
            //        gridRowEditOnLoad = true;
            //    let _thisRowNo = GetDbRowNo(fieldRowNo, dcNo);
            //        _thisRowNo = GetRowNoHelper(_thisRowNo);
            //    showAlertDialog("warning", 2056, "client", FCaption[fldIndex] + "^♠^" + parseInt(_thisRowNo, 10));
            //    result = false;
            //} else {
            //    fldObj.css("border", "1px solid rgb(204, 204, 204)"); //remove warning border css
            //    fldObj.closest("td").removeAttr("data-fld-mandatory").removeAttr("inline-grid-warning");
            //    result = true;
            //}


            var rowIndex = mandatoryFields.first().parent().index();
            mandatoryFields.each(function () {
                let _thisEl = $(this);
                _thisEl.first().find(".labelInp").is(":visible") ? fldType = ".labelInp" : fldType = ".focus-input";
                let _thisFldId = _thisEl.first().find(fldType).attr("Id");
                if (typeof _thisFldId != "undefined" && _thisFldId.startsWith("grdAtt_img_"))
                    _thisFldId = mandatoryFields.first().find(".grdAttach").attr("Id");
                var fName = GetFieldsName(_thisFldId);
                var fldIndex = $j.inArray(fName, FNames);
                var columnIndex = _thisEl.index();
                inlineShiftKeyPressed = false;
                focusOnDeleteButton = false;

                fldObj = $("#" + _thisFldId);
                fldValue = fldObj.val();
                var fType = FDataType[fldIndex];
                if ((parseFloat(fldValue) == 0 || fldValue === "" || fldValue === null)) {
                    _thisEl.attr("inline-grid-warning", '');
                    _thisEl.parent().removeClass("inline-edit")
                    inlineGridEdit(dcNo, _thisEl, columnIndex, rowIndex); //convert that specific row to editable mode

                    fldObj.css("border", "1px solid red"); //warning - add red color border to that td
                    fldObj.closest("td").attr("data-fld-mandatory", '');

                    var fieldRowNo = GetFieldsRowNo(_thisFldId);
                    var isExitDummy = false;
                    if (gridDummyRowVal.length > 0) {
                        gridDummyRowVal.map(function (v) {
                            if (v.split("~")[0] == dcNo && v.split("~")[1] == fieldRowNo) isExitDummy = true;
                        });
                    }
                    if (isExitDummy)
                        gridRowEditOnLoad = true;

                    //showAlertDialog("warning", 2055, "client", FCaption[fldIndex]);
                   let _thisRowNo = GetDbRowNo(fieldRowNo, dcNo);
                    _thisRowNo = GetRowNoHelper(_thisRowNo);
                    showAlertDialog("warning", 2056, "client", FCaption[fldIndex] + "^♠^" + parseInt(_thisRowNo, 10));
                    result = false;
                    return false;
                } else {
                    fldObj.css("border", "1px solid rgb(204, 204, 204)"); //remove warning border css
                     fldObj.closest("td").removeAttr("data-fld-mandatory").removeAttr("inline-grid-warning");
                    //result = true;
                }
            });
        }
    }
    return result;
}


//to focus cursor to the end of the text on input field
(function ($) {
    $.fn.focusCursorToEnd = function (e) {
        //if (this.hasClass("fldFromSelect") && typeof e != "undefined" && e.which == 1) {
        //    select2IsOpened = true;
        //    select2IsFocused = false;
        //    select2EventType = "click";
        //}
        //this.focus();
        if (!this.hasClass("fldFromSelect"))
            this.focus();
        var $thisVal = this.val();
        this.val('').val($thisVal);
        if (!isMobile)
            this.select();
        if ($(this).hasClass("fldmultiSelectInput"))
            $(this).parents(".dropdown-mul").click();
        if (isMobile && typeof axpShowKeyboard != "undefined" && axpShowKeyboard == "false") {
            try {
                AxAfterMainFocus($(this).attr("id"));
            } catch (e) { }
        }
        return this;
    }
}(jQuery));

//#endregion InlineGridEdit


function camelCaseToDash(str) {
    return str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();
}

//activate action axpBtn hyperlink click events
function axpBtnClickEvent(rowId) {
    try {
        $("#" + rowId + " .axpBtn").off("click.axpBtn").on("click.axpBtn", function () {
            var obj = $j(this);
            CallAction(obj[0].id);
        });
    } catch (e) {
        console.log(e.message);
    }
}


//hide grid columns(design mode hidden columns) after filling records from fillgrid
function fillgridColOptVisibility(dcNo) {
    if (designObj[0].dcs != null) {
        var gridElems = $.grep(designObj[0].dcs, function (v) {
            return v.dc_id == dcNo;
        })[0].tableDesign;
        gridElems.map(function (fld) {
            if (fld.fld_id != undefined && fld.visibility != undefined && !fld.visibility) {
                var fldId = fld.fld_id;
                var thIndex = -1;
                if (fldId.indexOf("uniqueEditDeleteAct") > -1) //edit/delete option
                    thIndex = $("#" + fldId).index();
                else if (fldId.indexOf("uniqueThHead") > -1) //sl. no column
                    thIndex = $("#" + fldId).index();
                else
                    thIndex = $("#th-" + fldId).index(); //grid field
                if (thIndex > -1)
                    $("#gridHd" + dcNo).find("tbody tr td:nth-child(" + (thIndex + 1) + ")").hide();
            }
        });
    }
}

function viewGridPopUp(gridDcNum) {
    let gridTableHTML = `<div class="dcTablePopup"><table class="customSetupTableMN gridHeader g-1 table table-striped table-bordered mt-1 mb-0 border-gray-300 ">` + $("#colScroll" + gridDcNum + " table").html() + `</table></div>`;
    displayBootstrapModalDialog("Grid View", "md", "100%", false, gridTableHTML, false);
}

$(document).on("click", ".modal-content .dcTablePopup table td", function (event) {
    var fldID = $(this).find("textarea").attr("id");
    // $("#v_subledgercode003F7").is("not:disabled");
    if (!$("#" + fldID.substr(2)).is(":disabled")) {
        $("#" + fldID.substr(2)).focus();
        closeModalDialog();
    }
});

function CheckAllGridRow(obj, ckDcNo) {
    $j("input[name=grdchkItemTd" + ckDcNo + "]:checkbox").each(function () {
        if ($j(this).prop("disabled") == false)
            $j(this).prop("checked", obj.checked);
    });

    if ($j("input[name=grdchkItemTd" + ckDcNo + "]:checked").length > 0)
        $("#clearThisDC" + ckDcNo).removeClass("disabled");
    else
        $("#clearThisDC" + ckDcNo).removeClass("disabled").addClass("disabled");
}

function CheckboxGridRow(obj, ckDcNo, ckRowNo, event) {
    if ($j("input[name=grdchkItemTd" + ckDcNo + "]:visible").length == $j("input[name=grdchkItemTd" + ckDcNo + "]:checked").length){
        $j("#chkallgridrow" + ckDcNo).prop("checked", true);
        $j("#chkallgridrow"+ckDcNo).prop("disabled", false);
    }
    else{
        $j("#chkallgridrow" + ckDcNo).prop("checked", false);
        $j("#chkallgridrow"+ckDcNo).prop("disabled", false);
    }

    if ($j("input[name=grdchkItemTd" + ckDcNo + "]:checked").length > 0)
        $("#clearThisDC" + ckDcNo).removeClass("disabled");
    else
        $("#clearThisDC" + ckDcNo).removeClass("disabled").addClass("disabled");

    event.stopPropagation()
}
