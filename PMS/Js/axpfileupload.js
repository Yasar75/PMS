
$j(document).ready(function () {
    modalHeader = eval(callParent("divModalHeader", "id") + ".getElementById('divModalHeader')");
    modalHeader.innerText = eval(callParent('lcm[489]'));
    $("#cmdSend").prop("title", eval(callParent('lcm[490]'))).val(eval(callParent('lcm[490]')));
    $("#close").prop("title", eval(callParent('lcm[249]'))).val(eval(callParent('lcm[249]')));
    $('#filMyFile').bind({
        change: function () {
            var existingFlCount = parent.$("#" + $j("#hdnAttFld").val() + "attach").parent().find(".attachment-count span").text();
            existingFlCount = existingFlCount == "" ? 0 : existingFlCount;
            var FileUploadlmt = eval(callParent('AxpFileUploadlmt'));
            var uploadFileCount = $('#filMyFile')[0].files.length;
            var totFlCount = parseInt(existingFlCount) + uploadFileCount;
            if (typeof FileUploadlmt != "undefined" && FileUploadlmt != 0 && (uploadFileCount > FileUploadlmt || totFlCount > FileUploadlmt)) {
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

            try {
                ax_changeValidateFileExtensionParams = callParentNew("ax_changeValidateFileExtensionParams");
            } catch (ex) { }

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

    checkSuccessAxpertMsg();
    setTimeout(function () { IFrameModalDialogTabEvents("file-select"); }, 500);
    closeRemodalPopupOnEsc();
    validateFilesize();

});


function DoClientFunction() {
    var fn = $j("#fname");
    var randNumber = $j("#randNumber").val();
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
        if (rowNo != "000") {
            for (var i = 0; i < fldsByClass.length; i++) {
                tmpFldid = fldsByClass[i].getAttribute('id');
                if (tmpFldid != null && (tmpFldid.toLowerCase().startsWith("axpfile_") && tmpFldid.endsWith(rowFrmNo) && id.startsWith("GridAxpFileAtt_") && id == "GridAxpFileAtt_" + tmpFldid)) {
                    fldId = tmpFldid;
                }
            }
        } else {
            fldId = id.replace("ngAxpFileAtt_", "");
        }

        var dcNo = fldId.substring(fldId.lastIndexOf("F") + 1, fldId.length);
        var fieldName = callParentNew("GetFieldsName(" + id + ")", "function");

        var existingFiles = $j('input#' + fldId, doParentOpInIframe("document", "rtn", "input#" + fldId))[0].value;
        if (typeof existingFiles != "undefined" && existingFiles != "") {
            filename = existingFiles + "," + filename;
            if (!callParentNew("axInlineGridEdit") && rowNo != "000")
                $j($j("input#" + fldId, doParentOpInIframe("document", "rtn", "input#" + fldId))[1]).val("");
            else
                $j("input#" + fldId, doParentOpInIframe("document", "rtn", "input#" + fldId)).val("");
        }

        filename = unescape(filename);
        var fileLinks = "";
        let uploadSid = eval(callParent('sid'));
        let hdnScriptsUrlPath = $(parent.$j("#hdnScriptsUrlpath"));
        var ScriptFilePath = hdnScriptsUrlPath.val() + "axpert/" + uploadSid + "/";
        if (filename.indexOf(',') > -1) {
            arrFileNames = filename.split(',');
            hlFld.innerHTML = "";
            for (var j = 0; j < arrFileNames.length; j++) {
                var finalFileName = unescape(arrFileNames[j]).replace(/\s/g, '♠').replace(/\(/g, '♦').replace(/\)/g, '♣');
                var actualName = unescape(arrFileNames[j]);
                if (randNumber == "true")
                    actualName = actualName.substr(20);//actualName.substr(actualName.indexOf("-") + 1);
                let fileOpenLink = arrFileNames[j];
                fileOpenLink = fileOpenLink.replace(/'/g, '♠');
                if (rowNo == "000")
                    fileLinks += "<div id=\"Link_" + rowFrmNo + "_" + finalFileName + "\"  class='atchfile'><a onclick=\"DeleteFileFromRow('" + fldId + "','" + rowNo + "','" + fileOpenLink + "')\"><i class=\"glyphicon glyphicon-remove close icon-arrows-remove attachmentcrossicon\"></i></a><a href=\"javascript:void(0)\" id='nonGridAxpFile_hlnk" + rowFrmNo + "' class='grdAttach handCur' onclick='ShowAxpFileuploadLink(\"" + fldId + "\",\"" + fileOpenLink + "\",\"" + ScriptFilePath + fileOpenLink + "\")'>" + actualName + "</a></div>";
                else
                    fileLinks += "<div id=\"Link_" + rowFrmNo + "_" + finalFileName + "\"  class='atchfile'><a onclick=\"DeleteFileFromRow('" + fldId + "','" + rowNo + "','" + fileOpenLink + "')\"><i class=\"glyphicon glyphicon-remove close icon-arrows-remove attachmentcrossicon\"></i></a><a href=\"javascript:void(0)\" id='GridAxpFile_hlnk_" + rowFrmNo + "' class='grdAttach handCur' onclick='ShowAxpFileuploadLink(\"" + fldId + "\",\"" + fileOpenLink + "\",\"" + ScriptFilePath + fileOpenLink + "\")'>" + actualName + "</a></div>";
            }
        }
        else {
            var actualName = filename;
            if (randNumber == "true")
                actualName = actualName.substr(20);// actualName.substr(actualName.indexOf("-") + 1);
            var finalFileName = filename.replace(/\s/g, '♠').replace(/\(/g, '♦').replace(/\)/g, '♣');
            let fileOpenLink = filename.replace(/'/g, '♠');
            if (rowNo == "000")
                fileLinks += "<div id=\"Link_" + rowFrmNo + "_" + finalFileName + "\" class='atchfile'><a onclick=\"DeleteFileFromRow('" + fldId + "','" + rowNo + "','" + fileOpenLink + "')\"><i class=\"glyphicon glyphicon-remove close icon-arrows-remove attachmentcrossicon\"></i></a><a href=\"javascript:void(0)\" id='nonGridAxpFile_hlnk" + rowFrmNo + "' class='grdAttach handCur' onclick='ShowAxpFileuploadLink(\"" + fldId + "\",\"" + fileOpenLink + "\",\"" + ScriptFilePath + fileOpenLink + "\")'>" + actualName + "</a></div>";
            else
                fileLinks += "<div id=\"Link_" + rowFrmNo + "_" + finalFileName + "\" class='atchfile'><a onclick=\"DeleteFileFromRow('" + fldId + "','" + rowNo + "','" + fileOpenLink + "')\"><i class=\"glyphicon glyphicon-remove close icon-arrows-remove attachmentcrossicon\"></i></a><a href=\"javascript:void(0)\" id='GridAxpFile_hlnk_" + rowFrmNo + "' class='grdAttach handCur' onclick='ShowAxpFileuploadLink(\"" + fldId + "\",\"" + fileOpenLink + "\",\"" + ScriptFilePath + fileOpenLink + "\")'>" + actualName + "</a></div>";
        }
        if (!callParentNew("axInlineGridEdit") && rowNo != "000" && callParentNew("recordid") != "0")
            $j($j("input#" + fldId, doParentOpInIframe("document", "rtn", "input#" + fldId))[1]).attr("value", filename).text(filename).val(filename);
        else
            $j("input#" + fldId, doParentOpInIframe("document", "rtn", "input#" + fldId)).attr("value", filename).text(filename).val(filename);
        UpdateArray(fldId, filename);

        if ($j("#hdnType").val() != "") {
            if (filename.lastIndexOf(".") == -1) {
                filename = filename + $j("#hdnType").val();
            }
        }
        var labelHtml = "";
        if (rowNo == "000")
            labelHtml = "<span id=\"ngAxpFileAtt_" + fldId + "\" class=\"fa fa-paperclip upload-icon nongridAttachIcon inlinediv\" style=\"\" onclick=\"ShowAxpFileAttachPopUp(this);\" title=\"nongrid attachment\"></span>";
        else
            labelHtml = "<span id=\"GridAxpFileAtt_" + fldId + "\" tabindex='0' class=\"fa fa-paperclip upload-icon inlinediv\" onclick=\"ShowAxpFileAttachPopUp(this);\" class=\"grdAttach handCur\" />";

        labelHtml += "<div id='axpFileAtt_hlnk_" + rowFrmNo + "attach' class='attach-files attach-popover' onclick=\"showAttachmentPopover();\">" + fileLinks + "</div>";

        if (rowNo == "000") {
            fieldName = callParentNew("GetFieldsName(" + fldId + ")", "function");
            $j("#dv" + fieldName + " .divNonGridAxpFile", doParentOpInIframe("document", "rtn", "#dv" + fieldName)).html(labelHtml);
        }
        else {
            if (!callParentNew("axInlineGridEdit") && callParentNew("recordid") != "0")
                $j($j("input#" + fldId, doParentOpInIframe("document", "rtn", "input#" + fldId))[1]).siblings("#GridAxpFile" + fldId).html(labelHtml);
            else
                $j("#" + fldId, doParentOpInIframe("document", "rtn", "#" + fldId)).siblings("#GridAxpFile" + fldId).html(labelHtml);
        }

        if (rowNo == "000") {
            $(callParentNew("attach-files", "class")).parent("#dv" + fieldName + " .divNonGridAxpFile").find(".attach-files").children().addClass("inlinediv");
            if ($(callParentNew("attach-files", "class")).parent("#dv" + fieldName + " .divNonGridAxpFile").find(".attach-files").height() > 22) {
                let fileName = $j("#dv" + fieldName + " .divNonGridAxpFile", doParentOpInIframe("document", "rtn", "#dv" + fieldName)).attr("data-morefiles");
                if (typeof fileName != "undefined" && fileName != "")
                    fileName += ',' + $(callParentNew("attach-files", "class")).parent("#dv" + fieldName + " .divNonGridAxpFile").find(".attach-files").children().last().attr("id");
                else
                    fileName = $(callParentNew("attach-files", "class")).parent("#dv" + fieldName + " .divNonGridAxpFile").find(".attach-files").children().last().attr("id");
                $j("#dv" + fieldName + " .divNonGridAxpFile", doParentOpInIframe("document", "rtn", "#dv" + fieldName)).attr("data-morefiles", fileName);

                let popList = fileName.split(",");
                $j("#dv" + fieldName + " .divNonGridAxpFile", doParentOpInIframe("document", "rtn", "#dv" + fieldName)).find(".attach-files").children().each(function (ind, fid) {
                    let cId = $(fid).attr("id");
                    if ($j.inArray(cId, popList) > -1)
                        $j("#dv" + fieldName + " .divNonGridAxpFile", doParentOpInIframe("document", "rtn", "#dv" + fieldName)).find(".attach-files").find("[id^=" + cId.split('.')[0] + "]").addClass("revrseInlinediv");
                });
                $j("#dv" + fieldName + " .divNonGridAxpFile", doParentOpInIframe("document", "rtn", ".divNonGridAxpFile")).append("<a class='pull-" + (callParentNew("gllangType", "gllangType") === "ar" ? "left" : "right") + " attachment-count' href='javascript:void(0)' class='' '><span data-target='axpFileAtt_hlnk_" + rowFrmNo + "attach' class='attach-popover' data-container='.dvheightframe' data-placement='bottom'>" + fileName.split(",").length + "+</span></a>");
            }
        }
        else {
            if (!callParentNew("axInlineGridEdit") && callParentNew("recordid") != "0") {
                $($(callParentNew("attach-files", "class")).parent("#GridAxpFile" + fldId).find(".attach-files")[1]).children().addClass("inlinediv");
                let ftsize = $($(callParentNew("attach-files", "class")).parent("#GridAxpFile" + fldId).find(".attach-files")[1]).css('font-size');
                let minHght = GetAxpFileControlHeight(ftsize);
                if ($($(callParentNew("attach-files", "class")).parent("#GridAxpFile" + fldId).find(".attach-files")[1])[0].offsetHeight > minHght) {
                    let fileNames = "";
                    $j("#bootstrapModalData", doParentOpInIframe("document", "rtn", "#bootstrapModalData")).find("div.atchfile").each(function () {
                        fileNames += $(this).attr("id") + ",";
                    })
                    if (fileNames != "")
                        fileNames = fileNames.slice(0, -1);
                    $j("#bootstrapModalData", doParentOpInIframe("document", "rtn", "#bootstrapModalData")).find("input#" + fldId).siblings("#GridAxpFile" + fldId).attr("data-morefiles", fileNames);

                    $j("#bootstrapModalData", doParentOpInIframe("document", "rtn", "#bootstrapModalData")).find("input#" + fldId).siblings("#GridAxpFile" + fldId).append("<a class='pull-" + (callParentNew("gllangType", "gllangType") === "ar" ? "left" : "right") + " attachment-count' href='javascript:void(0)' class='' '><span data-target='axpFileAtt_hlnk_" + rowFrmNo + "attach' class='attach-popover' data-container='.dvheightframe' data-placement='bottom'>" + fileNames.split(",").length + "+</span></a>");
                    $j("#bootstrapModalData", doParentOpInIframe("document", "rtn", "#bootstrapModalData")).find("div.atchfile").each(function () {
                        $(this).addClass("revrseInlinediv");
                    })
                }
                else {
                    $(callParentNew("attach-files", "class")).children().last().removeClass("hide");
                    $(callParentNew("axpFileAtt_hlnk_" + rowFrmNo + "attach", "id"));
                }
            }
            else {
                $(callParentNew("attach-files", "class")).parent("#GridAxpFile" + fldId).find(".attach-files").children().addClass("inlinediv");
                let ftsize = $(callParentNew("attach-files", "class")).parent("#GridAxpFile" + fldId).find(".attach-files").css('font-size');
                let minHght = GetAxpFileControlHeight(ftsize);
                if ($(callParentNew("attach-files", "class")).parent("#GridAxpFile" + fldId).find(".attach-files")[0].offsetHeight > minHght) {
                    let fileNames = $j("#" + fldId, doParentOpInIframe("document", "rtn", "#" + fldId)).siblings("#GridAxpFile" + fldId).attr("data-morefiles");
                    if (typeof fileNames != "undefined" && fileNames != "")
                        fileNames += ',' + $(callParentNew("attach-files", "class")).parent("#GridAxpFile" + fldId).find(".attach-files").children().last().attr("id");
                    else
                        fileNames = $(callParentNew("attach-files", "class")).parent("#GridAxpFile" + fldId).find(".attach-files").children().last().attr("id");
                    $j("#" + fldId, doParentOpInIframe("document", "rtn", "#" + fldId)).siblings("#GridAxpFile" + fldId).attr("data-morefiles", fileNames);

                    fileNames.split(",").forEach(function (fid) {
                        $(callParentNew(fid, "id")).addClass("revrseInlinediv");
                    });

                    $j("#" + fldId, doParentOpInIframe("document", "rtn", "#" + fldId)).siblings("#GridAxpFile" + fldId).append("<a class='pull-" + (callParentNew("gllangType", "gllangType") === "ar" ? "left" : "right") + " attachment-count' href='javascript:void(0)' class='' '><span data-target='axpFileAtt_hlnk_" + rowFrmNo + "attach' class='attach-popover' data-container='.dvheightframe' data-placement='bottom'>" + fileNames.split(",").length + "+</span></a>");
                }
                else {
                    $(callParentNew("attach-files", "class")).children().last().removeClass("hide");
                    $(callParentNew("axpFileAtt_hlnk_" + rowFrmNo + "attach", "id"));
                }
            }
        }

        callParentNew('axpFileSavedPath=', $j("#hdnaxpFileSavedPath").val());
        callParentNew("showAttachmentPopover();", "function");
        callParentNew("assignInlineGridEditEvent(" + frmNo + ")", "function");
        callParentNew('AxGlobalChange=', true);
        callParentNew('globalChange=', true);
        setTimeout(function () { closeUploadDialog(); }, 300);
    }
    else {
        closeUploadDialog();
    }
}

function GetAxpFileControlHeight(ftsize) {
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
    return minHght;
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
    var dcNo = $("#hdnDcNo").val();
    var filelist = "";

    var attFldId = window.parent.$("#" + id).parent().siblings("input").attr("id");
    var endPart = attFldId.substring(("axpfile_").length);
    var axpFilePathVal = "";
    if ($(callParentNew("axpFilePath_" + endPart, "class")).length > 1) {
        $(callParentNew("axpFilePath_" + endPart, "class")).each(function (ind, ele) {
            if ($(ele).attr("id").endsWith("_" + endPart))
                axpFilePathVal = $(ele).val();
        });
    }
    else
        axpFilePathVal = $(callParentNew("axpFilePath_" + endPart, "class")).val();
    $("#hdnaxpFilePath").val(axpFilePathVal);

    filelist = window.parent.$(".attach-files").find(".grdAttach").map((i, el) => el.text).get().join(',');

    if (filelist != null && filelist != "") {
        var myFile = $('#filMyFile').val();
        if (myFile != null && myFile != "") {
            myFile = myFile.substr(12);
            var isfileExist = false;
            $.each(filelist.split(","), function (index, el) {
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
    } else {
        return true;
    }
}

function CheckIsFileExists() {
    //DoClientFunction();
    alert("File already exists, please rename and upload again!");
}
