
$j(document).ready(function () {
    modalHeader = eval(callParent("divModalHeader", "id") + ".getElementById('divModalHeader')");
    modalHeader.innerText = eval(callParent('lcm[359]'));
    $("#cmdSend").prop("title", eval(callParent('lcm[360]'))).val(eval(callParent('lcm[360]')));
    $("#close").prop("title", eval(callParent('lcm[249]'))).val(eval(callParent('lcm[249]')));
    $('#filMyFile').bind({
        change: function () {
            var existingFlCount = parent.$("#" + $j("#hdnAttFld").val() + "attach").parent().find(".attachment-count span").text();// 0;//$j(this, doParentOpInIframe("document", "rtn", this))[0].value;
            existingFlCount = existingFlCount == "" ? 0 : existingFlCount;
            var FileUploadlmt = eval(callParent('AxpFileUploadlmt'));
            var uploadFileCount = $('#filMyFile')[0].files.length;
            var totFlCount = parseInt(existingFlCount) + uploadFileCount;
            if (FileUploadlmt != undefined && FileUploadlmt != 0 && (uploadFileCount > FileUploadlmt || totFlCount > FileUploadlmt)) {
                $("#filMyFile").val('');
                $('#fileuploadsts').val('');
                $("#fileuploadsts").text("[Files can upload " + FileUploadlmt + " only.]");
                return;
            }
            var filename = $("#filMyFile").val();
            if (filename.indexOf("+") > -1) {
                $("#fileuploadsts").text("[FileName should not contain '+' character.]");
            }
            if (/^\s*$/.test(filename)) {
                $(".file-upload").removeClass('active');
                var cutMsg = eval(callParent('lcm[66]'));
                $("#noFile").text(cutMsg);
            }
            else {
                $(".file-upload").addClass('active');
                $("#noFile").text(filename.replace("C:\\fakepath\\", ""));
            }
            var uploadControl = $('#filMyFile')[0].files;
            if (uploadControl.length > 0)
                $("#lblnofilename").text(uploadControl[0].name);

            if (ValidateFileExtension(filename, "file") == true) {
                $('#fileuploadsts').val();
                $('#cmdSend').prop('disabled', false);
                $(".file-upload").addClass('active');
                $("#noFile").text(filename.replace("C:\\fakepath\\", ""));
            }
            else {
                $("#fileuploadsts").text("[" + eval(callParent('lcm[305]')) + "]");
                $('#cmdSend').prop('disabled', true);
                ResetFileUploadProperties();
            }
        }
    });


    // ChangeTheme();
    checkSuccessAxpertMsg();
    setTimeout(function () { IFrameModalDialogTabEvents("file-select"); }, 500);
    closeRemodalPopupOnEsc();
    validateFilesize();

});


function DoClientFunction() {
    var exectrace = $j("#hdnExeTrace").val();
    exectrace += "DoClientFunction function process started";
    UpdateExceptionMessageInET(exectrace);
    var fn = $j("#fname");
    var filename = escape(fn.val()); //encode file name
    filename = filename.replace(/%2C/g, ","); //ignoring ',' char while encoding(because we are separating multiple files by comma)
    var upl = $j("#upsts");
    var succ = upl.val();
    var fldId = "";
    var act = $j("#hdnAttFld");
    var hdnFilePath = $j("#hdnFilePath");
    if (succ == "Uploaded Successfully") {
        eval(callParent('isGrdEditDirty') + "= true");
        var id = act.val();
        var rowFrmNo = id.substring(id.lastIndexOf("F") - 3);
        var rowNo = rowFrmNo.substring(0, rowFrmNo.lastIndexOf("F"));
        var frmNo = rowFrmNo.substring(rowFrmNo.lastIndexOf("F") + 1);
        var hlFld = $j("#" + id, doParentOpInIframe("document", "rtn", "#" + id));
        var fldsByClass = doParentOpInIframe("document.getElementsByClassName('grdAttach')", "rtn", ".grdAttach");
        var tmpFldid = "";
        var hasReferFiles = false;
        if (rowNo != "000") {
            for (var i = 0; i < fldsByClass.length; i++) {
                tmpFldid = fldsByClass[i].getAttribute('id');
                if ((tmpFldid == 'dc' + frmNo + '_image' + rowFrmNo) || (tmpFldid == 'axp_gridattach_' + frmNo + rowFrmNo) || (tmpFldid != null && tmpFldid.startsWith("axp_nga_") && tmpFldid.endsWith(rowFrmNo)) || (tmpFldid == 'EDIT~dc' + frmNo + '_image' + rowFrmNo)) {
                    fldId = tmpFldid;
                }
            }
        } else {
            fldId = id.replace("nonGrdAtt_", "");
        }

        var dcNo = fldId.substring(fldId.lastIndexOf("F") + 1, fldId.length);
        var fieldName = callParentNew("GetFieldsName(" + id + ")", "function");

        var existingFiles = $j('input#' + fldId, doParentOpInIframe("document", "rtn", "input#" + fldId))[0].value;
        if (existingFiles != undefined) {
            if (existingFiles != "") {
                if (existingFiles.indexOf("@") != -1) {
                    hasReferFiles = true;
                    existingFiles = GetReferedFiles(existingFiles);
                }
                filename = existingFiles + "," + filename;

                $j("input#" + fldId, doParentOpInIframe("document", "rtn", "input#" + fldId)).val("");
                $j("#GridAttach" + rowFrmNo, doParentOpInIframe("document", "rtn", "#GridAttach" + rowFrmNo)).html("");
            }

        }

        var fileLinks = "";
        //if(!callParentNew("axInlineGridEdit")){
        //    fileLinks = "<span id=\"grdAtt_img_" + rowFrmNo + "\" class=\"fa fa-paperclip\" onclick=\"ShowGridAttachPopUp(this);\" class=\"grdAttach handCur\" />";
        //}
        var bMultipleFiles = false;
        var totalFiles = 1;
        if (filename.indexOf(',') > -1) {
            bMultipleFiles = true;
            arrFileNames = filename.split(',');
            totalFiles = arrFileNames.length;
            hlFld.innerHTML = "";
            var referfilename = "";
            for (var j = 0; j < arrFileNames.length; j++) {

                var finalFileName = unescape(arrFileNames[j]).replace(/\s/g, '♠').replace(/\(/g, '♦').replace(/\)/g, '♣');

                var unescapedChar = unescape(arrFileNames[j]);
                if (hasReferFiles && window.localStorage.refFiles != undefined) {
                    if ((JSON.parse(window.localStorage.refFiles)).indexOf(arrFileNames[j]) == -1) {


                        let fileOpenLink = arrFileNames[j];
                        fileOpenLink = fileOpenLink.replace(/'/g, '♠');
                        if (rowNo == "000")
                            fileLinks += "<div id=\"Link_" + rowFrmNo + "_" + finalFileName + "\"><a onclick=\"DeleteFileFromRow('" + fldId + "','" + rowNo + "','" + fileOpenLink + "')\"><i class=\"glyphicon glyphicon-remove close icon-arrows-remove attachmentcrossicon\"></i></a><a href=\"javascript:void(0)\" id='axp_nga_" + rowFrmNo + "' class='grdAttach handCur' onclick='ShowGridAttLink(\"" + hdnFilePath.val() + fileOpenLink + "\")'>" + unescapedChar + "</a></div>";
                        else
                            fileLinks += "<div id=\"Link_" + rowFrmNo + "_" + finalFileName + "\"><a onclick=\"DeleteFileFromRow('" + fldId + "','" + rowNo + "','" + fileOpenLink + "')\"><i class=\"glyphicon glyphicon-remove close icon-arrows-remove attachmentcrossicon\"></i></a><a href=\"javascript:void(0)\" id='grdAtt_hlnk_" + rowFrmNo + "' class='grdAttach handCur' onclick='ShowGridAttLink(\"" + hdnFilePath.val() + fileOpenLink + "\")'>" + unescapedChar + "</a></div>";
                    }
                    else {
                        let fileOpenLink = arrFileNames[j];
                        fileOpenLink = fileOpenLink.replace(/'/g, '♠');
                        if (rowNo == "000")
                            fileLinks += "<div id=\"Link" + finalFileName + "\"></a><a id='axp_nga_" + rowFrmNo + "' class='grdAttach handCur' onclick='ShowGridAttLink(\"" + hdnFilePath.val() + (JSON.parse(window.localStorage.referRecId)) + "-" + fileOpenLink + "\")'>" + unescapedChar + "</a></div>";
                        else
                            fileLinks += "<div id=\"Link" + finalFileName + "\"></a><a id='grdAtt_hlnk_" + rowFrmNo + "' class='grdAttach handCur' onclick='ShowGridAttLink(\"" + hdnFilePath.val() + (JSON.parse(window.localStorage.referRecId)) + "-" + fileOpenLink + "\")'>" + unescapedChar + "</a></div>";
                        if (referfilename == "")
                            referfilename = arrFileNames[j].toString();
                        else
                            referfilename += "," + arrFileNames[j].toString();
                    }
                }
                else {
                    let fileOpenLink = arrFileNames[j];
                    fileOpenLink = fileOpenLink.replace(/'/g, '♠');
                    if (rowNo == "000")
                        fileLinks += "<div id=\"Link_" + rowFrmNo + "_" + finalFileName + "\"  class='atchfile'><a onclick=\"DeleteFileFromRow('" + fldId + "','" + rowNo + "','" + fileOpenLink + "')\"><i class=\"glyphicon glyphicon-remove close icon-arrows-remove attachmentcrossicon\"></i></a><a href=\"javascript:void(0)\" id='axp_nga_" + rowFrmNo + "' class='grdAttach handCur' onclick='ShowGridAttLink(\"" + hdnFilePath.val() + fileOpenLink + "\")'>" + unescapedChar + "</a></div>";
                    else

                        fileLinks += "<div id=\"Link_" + rowFrmNo + "_" + finalFileName + "\"  class='atchfile'><a onclick=\"DeleteFileFromRow('" + fldId + "','" + rowNo + "','" + fileOpenLink + "')\"><i class=\"glyphicon glyphicon-remove close icon-arrows-remove attachmentcrossicon\"></i></a><a href=\"javascript:void(0)\" id='grdAtt_hlnk_" + rowFrmNo + "' class='grdAttach handCur' onclick='ShowGridAttLink(\"" + hdnFilePath.val() + fileOpenLink + "\")'>" + unescapedChar + "</a></div>";
                }

            }

            if (referfilename != "")
                filename = filename.replace(referfilename, (JSON.parse(window.localStorage.fldExp)));

        }
        else {
            filename = unescape(filename);
            var finalFileName = filename.replace(/\s/g, '♠').replace(/\(/g, '♦').replace(/\)/g, '♣');
            let fileOpenLink = filename.replace(/'/g, '♠');
            if (rowNo == "000")
                fileLinks += "<div id=\"Link_" + rowFrmNo + "_" + finalFileName + "\" class='atchfile'><a onclick=\"DeleteFileFromRow('" + fldId + "','" + rowNo + "','" + fileOpenLink + "')\"><i class=\"glyphicon glyphicon-remove close icon-arrows-remove attachmentcrossicon\"></i></a><a href=\"javascript:void(0)\" id='axp_nga_" + rowFrmNo + "' class='grdAttach handCur' onclick='ShowGridAttLink(\"" + hdnFilePath.val() + fileOpenLink + "\")'>" + unescape(filename) + "</a></div>";
            else
                fileLinks += "<div id=\"Link_" + rowFrmNo + "_" + finalFileName + "\" class='atchfile'><a onclick=\"DeleteFileFromRow('" + fldId + "','" + rowNo + "','" + fileOpenLink + "')\"><i class=\"glyphicon glyphicon-remove close icon-arrows-remove attachmentcrossicon\"></i></a><a href=\"javascript:void(0)\" id='grdAtt_hlnk_" + rowFrmNo + "' class='grdAttach handCur' onclick='ShowGridAttLink(\"" + hdnFilePath.val() + fileOpenLink + "\")'>" + unescape(filename) + "</a></div>";
        }

        filename = unescape(filename); //decode file name

        $j("input#" + fldId, doParentOpInIframe("document", "rtn", "input#" + fldId)).attr("value", filename).text(filename).val(filename);
        UpdateArray(fldId, filename);


        if ($j("#axpattach_filename" + frmNo + rowFrmNo, doParentOpInIframe("document", "rtn", "#axpattach_filename" + frmNo + rowFrmNo)).length > 0) {
            filename = $j("#axpattach_filename" + frmNo + rowFrmNo, doParentOpInIframe("document", "rtn", "#axpattach_filename" + frmNo + rowFrmNo)).val();

            $j("#axpattach_filename" + frmNo + rowFrmNo, doParentOpInIframe("document", "rtn", "#axpattach_filename" + frmNo + rowFrmNo)).val(filename);
            UpdateArray("axpattach_filename" + frmNo + rowFrmNo, filename);

        }
        if ($j("#hdnType").val() != "") {
            if (filename.lastIndexOf(".") == -1) {
                filename = filename + $j("#hdnType").val();
            }
        }
        //if(!callParentNew("axInlineGridEdit"))
        //   $j("#GridAttach" + rowFrmNo, doParentOpInIframe("document", "rtn", "#GridAttach" + rowFrmNo)).html(fileLinks);
        //else {
        var labelHtml = "";
        if (rowNo == "000")
            labelHtml = "<span id=\"nonGrdAtt_" + fldId + "\" class=\"fa fa-paperclip upload-icon nongridAttachIcon inlinediv\" style=\"\" onclick=\"ShowGridAttachPopUp(this);\" title=\"nongrid attachment\"></span>";
        else
            labelHtml = "<span id=\"grdAtt_img_" + rowFrmNo + "\" tabindex='0' class=\"fa fa-paperclip upload-icon inlinediv\" onclick=\"ShowGridAttachPopUp(this);\" class=\"grdAttach handCur\" />";

        if (!callParentNew("isMobile"))
            labelHtml += "<div id='grdAtt_hlnk_" + rowFrmNo + "attach' class='attach-files attach-popover' onclick=\"showAttachmentPopover();\">" + fileLinks + "</div>";
        else
            labelHtml += "<div id='grdAtt_hlnk_" + rowFrmNo + "attach' class='attach-files attach-popover' onclick=\"showAttachmentPopover();\" style='width:312px;'>" + fileLinks + "</div>";
        //labelHtml += "<a class='pull-" + (callParentNew("gllangType", "gllangType") === "ar" ? "left" : "right") + " attachment-count' href='javascript:void(0)' class=''><span data-target='grdAtt_hlnk_" + rowFrmNo + "attach' class='badge attach-popover' style='display:none'>" + totalFiles + "</span></a>";

        // labelHtml += "<a class='fa fa-ellipsis-h pull-" + (callParentNew("gllangType", "gllangType") === "ar" ? "left" : "right") + " attachment-count' href='javascript:void(0)' class='' style=\" padding: 5px 5px 0 0;\" '><span data-target='grdAtt_hlnk_" + rowFrmNo + "attach' class='attach-popover' ></span></a>";


        if (rowNo == "000") {
            fieldName = callParentNew("GetFieldsName(" + fldId + ")", "function");
            $j("#dv" + fieldName + " .divnonattach", doParentOpInIframe("document", "rtn", "#dv" + fieldName)).html(labelHtml);
        }
        else
            $j("#GridAttach" + rowFrmNo, doParentOpInIframe("document", "rtn", "#GridAttach" + rowFrmNo)).html(labelHtml);

        if (rowNo == "000") {
            $(callParentNew("attach-files", "class")).parent("#dv" + fieldName + " .divnonattach").find(".attach-files").children().addClass("inlinediv");
            if ($(callParentNew("attach-files", "class")).parent("#dv" + fieldName + " .divnonattach").find(".attach-files").height() > 22) {
                let fileName = $j("#dv" + fieldName + " .divnonattach", doParentOpInIframe("document", "rtn", "#dv" + fieldName)).attr("data-morefiles");
                if (typeof fileName != "undefined" && fileName != "")
                    fileName += ',' + $(callParentNew("attach-files", "class")).parent("#dv" + fieldName + " .divnonattach").find(".attach-files").children().last().attr("id");
                else
                    fileName = $(callParentNew("attach-files", "class")).parent("#dv" + fieldName + " .divnonattach").find(".attach-files").children().last().attr("id");
                $j("#dv" + fieldName + " .divnonattach", doParentOpInIframe("document", "rtn", "#dv" + fieldName)).attr("data-morefiles", fileName);

                let popList = fileName.split(",");
                $j("#dv" + fieldName + " .divnonattach", doParentOpInIframe("document", "rtn", "#dv" + fieldName)).find(".attach-files").children().each(function (ind, fid) {
                    let cId = $(fid).attr("id");
                    if ($j.inArray(cId, popList) > -1)
                        $j("#dv" + fieldName + " .divnonattach", doParentOpInIframe("document", "rtn", "#dv" + fieldName)).find(".attach-files").find("[id^=" + cId.split('.')[0] + "]").addClass("revrseInlinediv");

                });


                $j("#dv" + fieldName + " .divnonattach", doParentOpInIframe("document", "rtn", ".divnonattach")).append("<a class='pull-" + (callParentNew("gllangType", "gllangType") === "ar" ? "left" : "right") + " attachment-count' href='javascript:void(0)' class='' '><span data-target='grdAtt_hlnk_" + rowFrmNo + "attach' class='attach-popover' data-container='.dvheightframe' data-placement='bottom'>" + fileName.split(",").length + "+</span></a>");
            }
        } else {
            $(callParentNew("attach-files", "class")).parent("#GridAttach" + rowFrmNo).find(".attach-files").children().addClass("inlinediv");
            let ftsize = $(callParentNew("attach-files", "class")).parent("#GridAttach" + rowFrmNo).find(".attach-files").css('font-size');
            let minHght = 20;
            if (typeof ftsize != "undefined") {
                ftsize = parseInt(ftsize.slice(0, -2));
                if (ftsize <= 14)
                    minHght = 20;
                else if (ftsize == 15 || ftsize == 16) {
                    minHght = ftsize + 6;
                }
                else if (ftsize > 16) {
                    let flotval = Math.floor(((ftsize - 14) / 2) + 0.5);
                    minHght = ftsize + 5 + flotval;
                }
            }
            if ($(callParentNew("attach-files", "class")).parent("#GridAttach" + rowFrmNo).find(".attach-files")[0].offsetHeight > minHght) {
                let fileNames = $j("#GridAttach" + rowFrmNo, doParentOpInIframe("document", "rtn", "#GridAttach" + rowFrmNo)).attr("data-morefiles");
                if (typeof fileNames != "undefined" && fileNames != "")
                    fileNames += ',' + $(callParentNew("attach-files", "class")).parent("#GridAttach" + rowFrmNo).find(".attach-files").children().last().attr("id");
                else
                    fileNames = $(callParentNew("attach-files", "class")).parent("#GridAttach" + rowFrmNo).find(".attach-files").children().last().attr("id");
                $j("#GridAttach" + rowFrmNo, doParentOpInIframe("document", "rtn", "#GridAttach" + rowFrmNo)).attr("data-morefiles", fileNames);

                fileNames.split(",").forEach(function (fid) {
                    $(callParentNew(fid, "id")).addClass("revrseInlinediv");
                });

                $j("#GridAttach" + rowFrmNo, doParentOpInIframe("document", "rtn", "#GridAttach" + rowFrmNo)).append("<a class='pull-" + (callParentNew("gllangType", "gllangType") === "ar" ? "left" : "right") + " attachment-count' href='javascript:void(0)' class='' '><span data-target='grdAtt_hlnk_" + rowFrmNo + "attach' class='attach-popover' data-container='.dvheightframe' data-placement='bottom'>" + fileNames.split(",").length + "+</span></a>");

            }
            else {
                if (!callParentNew("isMobile")) {
                    $(callParentNew("wrapperForEditFields" + dcNo, "id")).children("#sp" + dcNo + "R" + rowFrmNo).css("height", "90px");
                }
                $(callParentNew("attach-files", "class")).children().last().removeClass("hide");
                $(callParentNew("grdAtt_hlnk_" + rowFrmNo + "attach", "id"));
            }
        }

        callParentNew('axGridAttSavedPath=', $j("#hdnAxGridAttSavedPath").val());
        callParentNew("showAttachmentPopover();", "function");
        callParentNew("assignInlineGridEditEvent(" + frmNo + ")", "function");
        //}"#dv" + fldId.substring(0,fldId.lastIndexOf("F")-3)
        UpdateExceptionMessageInET("DoClientFunction function process completed.");
        setTimeout(function () { closeUploadDialog(); }, 300);
    }
    else {
        UpdateExceptionMessageInET("DoClientFunction function process completed with " + succ);
        closeUploadDialog();
    }
}

function updateAttachmentLabelCount1(rowFrmNo) {
    try {
        var filesCount = $("#grdAtt_hlnk_" + rowFrmNo + "attach div").length;
        if (filesCount == 0) { //hide attachment count if no files exist
            $("[data-target='grdAtt_hlnk_" + rowFrmNo + "attach']").remove();
            $("#grdAtt_hlnk_" + rowFrmNo + "attach+.attachment-count").remove()
        }
        else
            $("[data-target='grdAtt_hlnk_" + rowFrmNo + "attach']").text("");
    } catch (e) {
        console.log("Exception: " + e);
    }
}

// Get Referred Filenames
function GetReferedFiles(fldValue) {

    var attachedFiles = "";
    var TempfldValues = fldValue;
    var OIndx = TempfldValues.indexOf('(');
    var CommaIndx = TempfldValues.indexOf(',');
    var fileNameSIndx = OIndx + 1;
    var fileNameEIndx = TempfldValues.indexOf(")") - 1;
    referRecId = TempfldValues.substring(CommaIndx + 1, fileNameSIndx - 1);
    var referFiles = TempfldValues.substr(fileNameSIndx, fileNameEIndx - fileNameSIndx + 1);
    var attachedFiles = TempfldValues.substring(fileNameEIndx + 3);
    if (attachedFiles != "")
        return (referFiles + "," + attachedFiles);
    else
        return referFiles;
}

function UpdateArray(fldName, fldValue) {

    var isAlreadyFound = false;
    for (var x = 0; x < doParentOpInIframe("ChangedFields", "rtn").length; x++) {

        var fName = doParentOpInIframe("ChangedFields[" + x + "]", "rtn").toString();
        if (fName == fldName) {
            if (fldValue == "***") {
                doParentOpInIframe("ChangedFields", "rtn").splice(x, 1);
                doParentOpInIframe("ChangedFieldDbRowNo", "rtn").splice(x, 1);
                doParentOpInIframe("ChangedFieldValues", "rtn").splice(x, 1);
                doParentOpInIframe().ChangedFieldOldValues.splice(x, 1);
            }
            else {
                //doParentOpInIframe("ChangedFieldOldValues[" + x + "]", "rtn") = doParentOpInIframe("ChangedFieldValues[" + x + "]", "rtn").toString();
                doParentOpInIframe("ChangedFieldOldValues[" + x + "]", "var", doParentOpInIframe("ChangedFieldValues[" + x + "]", "rtn").toString());
                doParentOpInIframe("ChangedFieldDbRowNo[" + x + "]", "var", doParentOpInIframe("ChangedFieldDbRowNo[" + x + "]", "rtn"));
                doParentOpInIframe("ChangedFieldValues[" + x + "]", "var", fldValue);
            }
            isAlreadyFound = true; // the field name is already found and updated.
            break;
        }
    }

    if ((!isAlreadyFound) && (fldValue != "***")) {
        var fIndx = fldName.lastIndexOf("F");
        var rowNo = fldName.substring(fIndx - 3, fIndx);
        var dcNo = fldName.substring(fIndx + 1);
        var dbRowNo = callParentNew("GetDbRowNo(" + rowNo + "," + dcNo + ")", "function");
        parent.ChangedFields.push(fldName);
        parent.ChangedFieldDbRowNo.push(dbRowNo);
        parent.ChangedFieldValues.push(fldValue);
        parent.ChangedFieldOldValues.push("");
    }
}
function ChangeTheme() {
    //var theme = $j("#DropDownList1 option:selected", window.parent.document).text();

    theme = eval(callParent('currentThemeColor'));

    if (theme != "") {
        $j("#themecss").attr('href', "../App_Themes/" + theme + "/Stylesheet.min.css?v=23");
    }
    else {
        var themeref = "";
        if (parent) {
            themeref = $j("#themecss", parent.document).attr("href");
            if (themeref != "") {
                $j("#themecss").attr("href", themeref);
            }
        }
        if (parent.parent.document) {
            themeref = $j("#themecss", parent.parent.document).attr("href");
            if (themeref != "") {
                $j("#themecss").attr("href", themeref);
            }
        }
        if (themeref == "" || themeref == undefined) {
            themeref = "../App_Themes/" + axTheme + "/Stylesheet.min.css?v=23";
            $j("#themecss").attr("href", themeref);
        }
    }
}
$(document).keydown(function (e) {
    if (e.which == 27) {
        if ($(parent.$('.modal')) != undefined && $(parent.$('.modal')).length > 0) {
            $(parent).focus();
            if ($(parent.$('.modal .close')) != undefined && $(parent.$('.modal .close')).length > 0) {
                $(parent.$('.modal .close'))[$(parent.$('.modal .close')).length - 1].click();
            }
            setTimeout(function () {
                $(parent.$('.modal'))[$(parent.$('.modal')).length - 1].remove();
            }, 300);
        }
    }
})

function closeUploadDialog() {
    if ($(parent.$('.custom-dialog')) != undefined && $(parent.$('.custom-dialog')).length > 0) {
        $(parent).focus();
        if ($(parent.$('.custom-dialog .close')) != undefined && $(parent.$('.custom-dialog .close')).length > 0) {
            $(parent.$('.custom-dialog  .close'))[$(parent.$('.custom-dialog .close')).length - 1].click();
        }
        setTimeout(function () {
            $(parent.$('.custom-dialog'))[$(parent.$('.custom-dialog')).length - 1].remove();
        }, 300);
    }
}

function AllowAttachements() {
    var id = $j("#hdnAttFld").val();
    if (id.startsWith("nonGrdAtt_")) {
        id = id.replace("nonGrdAtt_", "");
    }
    var dcNo = $("#hdnDcNo").val();
    var aStrings = "";
    if (!callParentNew("IsDcGrid(" + dcNo + ")", "function"))
        aStrings = window.parent.$("#" + id).siblings(".divnonattach").find("[id^=grdAtt_hlnk_]").find(".grdAttach").map((i, el) => el.text).get().join(',');
    else if (!callParentNew("axInlineGridEdit") && callParentNew("AxpGridForm") != "form")
        aStrings = window.parent.$("#" + id).siblings(".attach-files").find(".grdAttach").map((i, el) => el.text).get().join(',');
    else
        aStrings = window.parent.$("#divDc" + dcNo + " [id^=grdAtt_hlnk_]").find(".grdAttach").map((i, el) => el.text).get().join(',');
    if (callParentNew("IsDcGrid(" + dcNo + ")", "function")) {
        let attFldId = window.parent.$("#" + id).attr("id");
        let attFldRowNo = attFldId.substring(attFldId.lastIndexOf("F"), attFldId.lastIndexOf("F") - 3);
        hdnImagePath.value = window.parent.$("#dc" + dcNo + "_imagepath" + attFldRowNo + "F" + dcNo).length != 0 ? window.parent.$("#dc" + dcNo + "_imagepath" + attFldRowNo + "F" + dcNo).val() : "";
    }
    if (aStrings != null && aStrings != "") {
        var myFile = $('#filMyFile').val();
        if (myFile != null && myFile != "") {
            myFile = myFile.substr(12);
            var isfileExist = false;
            $.each(aStrings.split(","), function (index, el) {
                if (el == myFile) {
                    isfileExist = true;
                    return false;
                }
            });
            if (isfileExist) {
                $('#fileuploadsts').text("File Already Exists");
                $('#fileuploadsts').css('color', 'RED');
                return false;
            }
            else
                return true;
        }
        else
            return false;
    }
    else {
        return true;
    }
}
