Dropzone.autoDiscover = false;

//function pover() {
//    $('body').on('click', function (e) {
//        $('[data-toggle=popover]').each(function () {
//            // hide any open popovers when the anywhere else in the body is clicked
//            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
//                $(this).popover('hide');
//            }
//        });
//    });
//    $('body').on('hidden.bs.popover', function (e) {
//        $(e.target).data("bs.popover").inState.click = false;
//    });

//    $(function () {
//        $('#ico_cl').popover();
//    });
//    $('[data-toggle="popover"]').popover();
//}

function validateDataSearchWiz() {
    var ddl = 0;
    var multiselect = 0;
    if ($('#ddlImpTbl').val() != 'NA') {
        ddl = 1;
        if ($('#mSelectRight option').val() != undefined && $('#mSelectRight option').val().length > 0) {
            var mandatoryField = false;
            $("#mSelectLeft option").each(function () {
                if ($(this).val().indexOf("*")>=0) {
                    mandatoryField = true;
                    return;
                }
            });
            if (mandatoryField) {
                showAlertDialog("warning", eval(callParent('lcm[156]')));
                $('#mSelectLeft').focus();
            }
            else 
                multiselect = 1
        }
        else {
            showAlertDialog("warning", eval(callParent('lcm[108]')));
            $('#mSelectLeft').focus();
        }
    }
    else {
        showAlertDialog("warning", eval(callParent('lcm[106]')));
        $('#ddlImpTbl').data('selectpicker').$button.focus();
    }

    if (ddl == 1 && multiselect == 1) {
        var tempColNames = "", tempColValues = "", tempFileName = "";
        $("#mSelectRight option").each(function () {
            tempColNames += $(this).text() + ", ";
            tempColValues += $(this).val() + ", ";
        })
        tempColNames = tempColNames.substring(0, tempColNames.length - 2);
        tempColValues = tempColValues.substring(0, tempColValues.length - 2);

        selectedValues = $("#mSelectRight option").length;
        
        if (oldSelectedValues != 0 && selectedValues != oldSelectedValues) {
            $("#noFile").text(eval(callParent('lcm[66]')));
            $('#fileToUpload').val("").prop("title", eval(callParent('lcm[66]')));
            $("#IsFileUploaded").val("");
            $("#divProgress").hide();
            oldSelectedValues = 0;
        }
        else {
            $('#hdnSelectedColumnCount').val(selectedValues);
        }

        $('#hdnColNames').val(tempColNames);
        $('#hdnColValues').val(tempColValues);
        tempFileName = $('#ddlImpTbl :selected').text();
        hdnTemplateName = $("#hdnTemplateName").val();
       
        $("#excel1").click(function () {
            //$("#excel1").attr("href", "openfile.aspx?fpath=" + hdnTemplateName + ".xlsx&Imp=t")
            //$("#hdnTemplateName").val() = hdnTemplateName + ".xls";
            if (hdnTemplateName ==""){
                hdnTemplateName = $("#ddlImpTbl :selected").text();
            }
            $("#hdnTemplateName").val(hdnTemplateName + ".xlsx");
            $("#btnCreateTemplate").click();
        })

        $("#CSV1").click(function () {
            //$("#CSV1").attr("href", "openfile.aspx?fpath=" + hdnTemplateName + ".csv&Imp=t")
            if (hdnTemplateName ==""){
                hdnTemplateName = $("#ddlImpTbl :selected").text();
            }
            $("#hdnTemplateName").val(hdnTemplateName + ".csv");
           // $("#hdnTemplateName").val() = hdnTemplateName + ".csv";
            $("#btnCreateTemplate").click();
        })

        // $("#lnkExpTemp").attr("href", "openfile.aspx?fpath=" + hdnTemplateName + ".csv&Imp=t")
      //  $("#lnkExpTemp").attr("href", "openfile.aspx?fpath=" + hdnTemplateName + ".xls&Imp=t")
        //$("#btnCreateTemplate").click();

        $("#ddlGroupBy").empty();
        $("#ddlGroupBy").append("<option value='NA'>-- Select --</option");
        colValues = $("#hdnGroupByColVal").val().split(', ');
        colNames = $("#hdnGroupByColName").val().split(', ');
        for (var i = 0; i < colNames.length; i++) {
            $("#ddlGroupBy").append("<option value='" + colValues[i] + "'>" + colNames[i] + "</option");
        }
        $("#ddlGroupBy").change(function () {
            $("#hdnGroupBy").val($("#ddlGroupBy").val());
        })
        return true;
    } else {
        return false;
    }
}

function FileuplaodValidation() {
    try {
        $.ajax({
            url: 'importnew.aspx/FileuplaodValidation',
            type: 'POST',
            cache: false,
            async: true,
            dataType: 'json',
            contentType: "application/json",
            success: function (data) {
                var result = data.d;
                //let appSUrl = top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/"));
                //if (typeof localStorage["ExecutionFullLog-" + appSUrl] != "undefined")
                //    ExecutionLogText += localStorage["ExecutionFullLog-" + appSUrl];

                //$("#myDiv").html('');
                //$("#myDiv").html(ExecutionLogText.replace(/♦/g, '<br/>').replace(/\r\n/g, '<br/>'));
            },
            error: function (error) {
            }
        });
    }
    catch (exp) { }
}

function validateDataUploadWiz() {
    var fileupload = 0;
    var uploadMsg = $("#hdnUploadFileWarnings").val();
    if ($("#IsFileUploaded").val() == "1") {
        ChkAllowUpdate();
        return true;
    }
    else {
        if (uploadMsg == "Empty") {
            showAlertDialog('warning', 4036, 'client');
            return false;
        }
        else if (uploadMsg == "NotEqualColumns") {
            showAlertDialog('warning', 4039, 'client');
            return false;
        }
        else if (uploadMsg == "DuplicateColumns") {
            showAlertDialog('warning', eval(callParent('lcm[307]')));
            return false;
        }
        else if (uploadMsg == "InvalidFileFormat") {
            showAlertDialog('warning', eval(callParent('lcm[310]')));
            return false;
        }
        else  {
            fileupload = 1;
            var errorMesg = $(".fileUploadErrorMessage").text();
            if (errorMesg.indexOf('csv') < 0)
                showAlertDialog("warning", eval(callParent('lcm[113]')));
            $("#fileuploadsts").text("");
            return false;
        }
    }
}

function GetSelColData() {
    var colselected = [];
    var colselectedName = [];
    var notSelected = 0;
    $("#gridImpData tr >th select:not([disabled])").each(function () {
        var col = $(this).find(":selected").val();
        var txt = $(this).find(":selected").text();
        if (col == "None") {
            colselected.push("None");
        } else {
            colselected.push(col);
            colselectedName.push(txt)
        }
    });

    var sorted_arr = colselected.slice().sort();
    var results = [];
    for (var i = 0; i < colselected.length - 1; i++) {
        if (sorted_arr[i + 1] == sorted_arr[i]) {
            results.push(sorted_arr[i]);
        }
    }
    if (results.length > 0) {
        showAlertDialog('warning', 1030, "client");
        focusSelectInGrid(colselected, results);
        return false;
    }
    else {
        var tempColNames = "", tempColValues = "";
        $("#gridImpData tr th").find("select:not([disabled])").each(function () {
            tempColNames += $(this).find("option[selected]").text() + ", ";
            tempColValues += $(this).val() + ", ";
        });
        tempColNames = tempColNames.substring(0, tempColNames.length - 2);
        tempColValues = tempColValues.substring(0, tempColValues.length - 2);

        $('#hdnColNames').val(tempColNames);
        $('#hdnColValues').val(tempColValues);

        $("#colheader").val(colselected.join(','));
        $("#colHeaderNames").val(colselectedName.join(','));
        unselectIgnoredColumns();

        var allowUpdate = $('#chkForAllowUpdate').prop("checked");
        if (allowUpdate) {
            primaryKeyCol = $("#ddlPrimaryKey").val();
            if (primaryKeyCol == "NA") {
                showAlertDialog("warning", "Please select Primary Key column");
                $("#ddlPrimaryKey").focus();
                return false;
            }
            else {
                $("#hdnPrimaryKey").val(primaryKeyCol);
                return true;
            }
        }
        else 
            return true;
    }
}

//once tstuct select is selected - move all manadatory fields to right selection
function updateMandatoryFieldsToSelection() {
    $("#mSelectLeft option").each(function () {
        if ($(this).text().indexOf("*") >= 0) {
            $('#mSelectRight').append($('<option>', {
                value: $(this).val().replace("*",""),
                text: $(this).text().replace("*", ""),
                mandatory:true
            }));
            $(this).remove();
        }
        else {
            $(this).attr("mandatory", false);
        }
    });
}

function ChkAllowUpdate() {
    if ($('#chkForAllowUpdate').prop("checked")) {
        $('#lblprimarycolmn,#ddlPrimaryKey').parent("div").removeClass("d-none");
        $("#ddlPrimaryKey").empty();
        $("#ddlPrimaryKey").append("<option value='NA'>-- Select --</option");
        colValues = $("#hdnColValues").val().split(', ');
        colNames = $("#hdnColNames").val().split(', ');
        for (var i = 0; i < colNames.length; i++) {
            $("#ddlPrimaryKey").append("<option value='" + colValues[i] + "'>" + colNames[i] + "</option");
        }
        disabledIgnoredColumns(ignoredColCount);
    }
    else {
        $('#lblprimarycolmn,#ddlPrimaryKey').parent("div").addClass("d-none");
    }
}

function ColNameInfileChanged() {
    
    
    $("#ColHeaderClick").click();
    //if ($("#lblFileName").text() != "" && $('#ddlImpTbl').val() != '')
      
    //    $("#UploadButton").click();
}

function focusSelectInGrid(SelectedColValues, RepeatedColNames) {
    var result = [];

    for (i = 0; i < RepeatedColNames.length ; i++) {
        for (j = 0; j < SelectedColValues.length; j++) {
            if (RepeatedColNames[i] == SelectedColValues[j]) {
                result.push(j);
            }
        }
    }
    for (i = 0; i < result.length; i++) {
        if (i == 1) {
            $("#gridImpData tbody tr th").eq(result[i]).find('select').focus();
        }
    }
}

function removeConfirmDialog() {
    if ($(".jconfirm").length > 0) {
        $(".jconfirm").remove();
    }
}

//to display Confirm dialog before closing the form only if any changes are there in the form
function ConfirmLeave() {
    if ($(".jconfirm").length > 0) {
        $(".jconfirm").remove();
    }
    else {
        var glType = eval(callParent('gllangType'));
        var isRTL = false;
        if (glType == "ar")
            isRTL = true;
        else
            isRTL = false;
        var ConfirmSaveCB = $.confirm({
            theme: 'modern',
            title: eval(callParent('lcm[155]')),
            onContentReady: function () {
                disableBackDrop('bind');
                //to display tooltips for Confirm & Cancel buttons
                $(".jconfirm-buttons button").each(function () {
                    var txt = $(this).text();
                    $(this).prop('title', txt.charAt(0).toUpperCase() + txt.slice(1))
                });
                $(".jconfirm-buttons .hotbtn").focus(); //to focus on Confirm button once dialog is opened
            },
            backgroundDismiss: 'false',
            escapeKey: 'buttonB',
            rtl: isRTL,
            content: eval(callParent('lcm[115]')),
            buttons: {
                buttonA: {
                    text: eval(callParent('lcm[164]')),
                    btnClass: 'btn btn-primary',
                    action: function () {
                        ConfirmSaveCB.close();
                        parent.closeModalDialog();
                        parent.checkIfAnyActionPerformed();
                    }
                },
                buttonB: {
                    text: eval(callParent('lcm[192]')),
                    btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                    action: function () {
                        disableBackDrop('destroy');
                        parent.actionsClicked = "";
                    },
                }
            }
        });
       

    }
}

function uploadFileChangeEvent() {
    $('#fileToUpload').change(function (e) {
        var uploadControl = $('#fileToUpload')[0].files[0];
        var regex = /^.*\.(CSV|csv|txt|TXT|XLS|xls|XLSX|xlsx)$/;
        if (uploadControl != undefined) {
            var Filename = uploadControl.name;
            if (Filename != "") {
                var fileSize = uploadControl.size / 1024 / 1024; // in MB
                if (regex.test(Filename)) {
                    if (fileSize > 1) {
                        showAlertDialog("warning", eval(callParent('lcm[156]')));
                        $("#noFile").text(eval(callParent('lcm[66]')));
                        $('#fileToUpload').val("");
                        $("#IsFileUploaded").val("");
                    }
                    else {
                        $("#noFile").text(Filename);
                        $('#chkForAllowUpdate').attr("checked", false);
                        $("#hdnPrimaryKey").val("");
                        ChkAllowUpdate();
                        $("#btnFileUpload").click();
                    }
                }
                else {
                    showAlertDialog("warning", eval(callParent('lcm[157]')));
                    uploadControl.value = '';
                    $("#noFile").text(eval(callParent('lcm[66]')));
                    $('#fileToUpload').val("");
                    $("#IsFileUploaded").val("");
                }
            }
        }
        else {
            $("#noFile").text(eval(callParent('lcm[66]')));
            $("#IsFileUploaded").val("");
        }
    });
}

function uploadFileClickEvent() {
    $('#btnFileUpload').click(function () {
        var fileUpload = $("#fileToUpload").get(0);
        var files = fileUpload.files;
        var frm = new FormData();
        if (files.length == 0) {
            showAlertDialog("warning", eval(callParent('lcm[158]')));
        }
        else {
            for (var i = 0; i < files.length; i++) {
                frm.append(files[i].name, files[i]);
            }
            $(".progress").show();
            //upload file using Generic handler ashx file, once successfully uploaded display top 5 records in Grid
            var url = location.origin + location.pathname.substr(0, location.pathname.indexOf('aspx')); //to get base url of the website
            $.ajax({
                url: url + "FileUploadHandler.ashx",
                type: "POST",
                contentType: false,
                processData: false,
                data: frm,
                success: function (result) {
                    if (result.indexOf("File Uploaded successfully") == 0) {
                        var filename = result.substr(result.indexOf("&&") + 2);
                        $("#divProgressBar").removeClass("progress-bar-danger");
                        setTimeout(function () {
                            //to reset progress bar
                            $("#divProgressBar").removeClass("progress-bar progress-bar-striped active").addClass("progress-bar-success").text("100%").css("width", "100%").attr('aria-valuenow', "100");
                        }, 500);
                       // filename=$("#noFile").text()
                        $("#upFileName").val(filename);
                        $("#uploadFileName").val(files[0].name);
                        $("#UploadButton").click();
                    }
                    else
                        showAlertDialog("warning", result);
                },
                error: function (err) {
                    showAlertDialog("warning", eval(callParent('lcm[159]')));
                    $("#divProgressBar").removeClass("progress-bar-striped active").addClass("progress-bar-danger").text("0%").css("width", "100%").attr('aria-valuenow', "100");
                },
                xhr: function () {
                    //upload Progress
                    var xhr = $.ajaxSettings.xhr();
                    xhr.upload.onprogress = function (event) {
                        var percent = 0;
                        var position = event.loaded || event.position;
                        var total = event.total; 
                        if (event.lengthComputable) {
                            percent = Math.ceil(position / total * 100);
                        }
                        //update progressbar
                        $("#divProgressBar").addClass("progress-bar-striped").text(percent + "%").css("width", "100%").attr('aria-valuenow', percent);
                    };
                    return xhr;
                },
            });
        }
    });
}

function fileUploadSuccess() {
    showAlertDialog('success', 4037, 'client');
   var uploadedFileName =$("#uploadFileName").val();
   $(".dropzone-select").text(uploadedFileName).addClass("col-10");
  //  $(".importFileDelete").removeClass("d-none")
    uploadFileClickEvent();
    uploadFileChangeEvent();

    addChkbxsToGrdColumns();
    ignoredColCount = parseInt($("#hdnIgnoredColCount").val());
    disabledIgnoredColumns(ignoredColCount);
    unselectIgnoredColumns();
    showPopover();//to show popover tooltip for hint
    filename = $("#uploadFileName").val();
    $("#noFile").text(filename);
    $("#fileToUpload").attr("title", filename);
}

//multi select control creation
var leftSelectedClickedOnce = false;
function createMultiselectControl() {
    $('.multiselect').multiselect({
        beforeMoveToLeft: function ($left, $right, $options) {
            return false; //prevent by default left click functionality
        },
        sort: true,
        moveToLeft: function (Multiselect, $options, event, silent, skipStack) {
            targetId = $(event.target).attr("id");
            var selectionOptionCount = 0;
            if ($options.length == 1) { //if double clicks on right select option 
                if ($options.attr("mandatory") == "false") {
                    $('#mSelectLeft').append($('<option>', {
                        value: $options.val(),
                        text: $options.text(),
                        mandatory: false
                    }));
                    $options.remove();
                    return true;
                }
                else
                    showAlertDialog('warning', eval(callParent('lcm[160]')));
            }
            else if (targetId == "left_Selected_1") { //if clicks on left select button to unselect selected options
                $("#mSelectRight :selected").map(function (i, el) {
                    if($(el).attr("mandatory")=="true")
                        selectionOptionCount++;
                });
                if (selectionOptionCount == $options.length)
                    showAlertDialog('warning', eval(callParent('lcm[161]')));
            }

            var mandatoryCount = 0;
            $("#mSelectRight option").map(function (i, el) {
                var li = $(el).attr("mandatory");
                if (li == "true") {
                    mandatoryCount++;
                }
            });
            if (mandatoryCount>1 && mandatoryCount == $options.length) //if all right select fields are mandatory fields
                showAlertDialog('warning', eval(callParent('lcm[161]')));
            else {
                var selectOrAll =$(event.currentTarget).attr("id") == "left_All_1" ? "option" : ":selected";
                $("#mSelectRight " + selectOrAll).map(function (i, el) {
                    var li = $(el).attr("mandatory");
                    if (li == "false") {
                        leftSelectedClickedOnce = true;
                        $('#mSelectLeft').append($('<option>', {
                            value: $(this).val(),
                            text: $(this).text(),
                            mandatory: false
                        }));
                        $(this).remove();
                    }
                });
            }
        }
    });
}

function closeWindow() {
    if (checkIfFormChanges())
        ConfirmLeave();
    else
        parent.closeModalDialog();
}

//to check if the form is dirty before closing
var isFormDirty = false;
function checkIfFormChanges() {
    var tstructForm = $("#ddlImpTbl").val();
    if (tstructForm != "NA")
        isFormDirty = true;
    else
        isFormDirty = false;
    return isFormDirty;
}

//tab foucus method for individual wizard tab by passing first & last focus ids once tab is loaded
function wizardTabFocus(firstFocusId, lastFocusId, bootstrapSelect) {
    //modalButton = eval(callParent("btnModalClose", "id") + ".getElementById('btnModalClose')");
    //if (modalButton.className.indexOf("firstFocusable") == -1)
    //    modalButton.className += " firstFocusable";
    //$("#" + lastFocusId).addClass("lastFocusable");
    //$(".lastFocusable").on('keydown.tabRot', function (e) {
    //    if ((e.which === 9 && !e.shiftKey)) {
    //        e.preventDefault();
    //        modalButton.focus();
    //    }
    //});
    //modalButton.addEventListener('keydown', function (e) {
    //    if ((e.which === 9 && e.shiftKey)) {
    //        e.preventDefault();
    //        $(".lastFocusable").focus();
    //    }
    //});
    //setTimeout(function () {
    //    if(bootstrapSelect==undefined)
    //        $("#" + firstFocusId).focus();
    //    else {
    //        if ($('#ddlImpTbl').val() == 'NA')
    //            $('#ddlImpTbl').data('selectpicker').$button.focus();
    //        else
    //            $('#mSelectLeft').focus();
    //    }
    //}, 700)
}

//text for Failed Summary report table headings
function setFailedSummaryColumnHeadings() {
    $("#thSummFileName").text(eval(callParent('lcm[263]')));
    $("#thSummRecords").text(eval(callParent('lcm[264]')));
    $("#thSummAdded").text(eval(callParent('lcm[357]')));
    $("#thSummUpdated").text(eval(callParent('lcm[358]')));
    $("#thSummFailed").text(eval(callParent('lcm[266]')));
    $("#hdnIgnoredColumns").val("");
    ignoredColumns = [];

}

//Edit wizard grid - add a checkbox option to select/unselect column after file uploaded successfully
function addChkbxsToGrdColumns() {
    var grd = $("#gridImpData");
    var selectExist = grd.data("column-select");
    if (selectExist == undefined) {
        $("#gridImpData th").each(function () {
            $(this).find("select").addClass("form-select");
           // $(this).find("select").attr("data-control","select2");
            $(this).find("select").select2();
            $(this).find("select").css("width","auto");
            selectId = $(this).find("select").attr("id");
            $(this).append("<label class='checkbox-inline'><br><input type='checkbox' class='grd-column-select' checked id='chk" + selectId + "'/><span>Select Column</span></label><i tabindex='0' data-trigger='focus' class='icon-arrows-question col-info' data-toggle='popover' data-content='Uncheck to ignore this column' data-placement='right' style='cursor: pointer;'  title=''></i>");
            //var thisText = $(this).text();
            //$(this).text("");   
            //$(this).append(`<div class='d-flex gap-2 form-check form-check-sm form-check-custom form-check-solid checkbox-inline'><input type='checkbox' class='form-check-input grd-column-select' checked id='chk" + selectId + "'/><label class="form-label fw-boldest">${thisText}</label><span tabindex='0' data-trigger='focus' class='material-icons material-icons-style material-icons-3 icon-arrows-question col-info' data-bs-toggle='tooltip' data-bs-original-title='Uncheck to ignore this column' data-bs-placement="bottom" data-bs-dismiss="click">help_outline</span></div>`);

            //select column change event 
            $(this).find("select").change(function () {
                $("option[value=" + this.value + "]", this).attr("selected", true).siblings().removeAttr("selected");
                selectVal = $(this).val();
                selectId = $(this).attr("id");
                mandatory = $("#mSelectRight option[value='" + selectVal + "']").attr("mandatory");
                mandatory = mandatory != undefined ? JSON.parse(mandatory) : false;
                colIndex = $(this).closest("th").index();
                if(mandatory)
                    $("#chk" + selectId).attr("disabled", "disabled");
                else
                    $("#chk" + selectId).removeAttr("disabled");
            });
            curselectVal = $(this).find("select").val();
            mandatory = $("#mSelectRight option[value='" + curselectVal + "']").attr("mandatory");
            mandatory = mandatory != undefined ? JSON.parse(mandatory) : false;
            mandatory ? $("#chk" + selectId).attr("disabled", "disabled") : "";
        });

        //grid column checkbox change event 
        $(".grd-column-select").change(function () {
            var selected = $(this).is(":checked");
            var colIndex = $(this).closest("th").index()+1;
            if (selected) {
                $(this).closest("th").find("select").removeAttr("disabled");
                $("#gridImpData tr td:nth-child(" + colIndex + "), #gridImpData tr th:nth-child(" + colIndex + ")").removeClass("column-disabled");
                updateIgnoredColumns(colIndex, "pop");
            }
            else {
                $(this).closest("th").find("select").attr("disabled", "disabled");
                $("#gridImpData tr td:nth-child(" + colIndex + "), #gridImpData tr th:nth-child(" + colIndex + ")").addClass("column-disabled");
                updateIgnoredColumns(colIndex, "push");
            }

            var selDisabled = $(this).closest("th").find("select").is(":disabled");
            var selVal = $(this).closest("th").find("select").val();
            if (selDisabled) {
                $("#ddlPrimaryKey option[value='" + selVal + "']").attr("disabled", "disabled");
            }
            else
                $("#ddlPrimaryKey option[value='" + selVal + "']").removeAttr("disabled");
        })
        $("#gridImpData").attr("data-column-select", true);
    }

    try{
        KTApp?.initBootstrapTooltips();
    }catch(ex){}
}

//once file uploaded successfully, if any column is ignored then disable those columns
function disabledIgnoredColumns(index) {
    if (index > 0) {
        --index;
        $("#gridImpData tr").each(function () {
            $(this).find("td:gt(" + index + "), th:gt(" + index + ")").addClass("column-disabled")
        });
        $("#gridImpData tr th:gt(" + index + ")").find("select").attr("disabled", "disabled");
        $("#gridImpData tr th").find("select[disabled]").each(function () {
            var val = $(this).val();
            $("#ddlPrimaryKey option[value='" + val + "']").attr("disabled", "disabled");
            updateIgnoredColumns($(this).parent().index()+1, "push")
        });
        $("#gridImpData tr th:gt(" + index + ")").find(".checkbox-inline, .col-info").remove();
        
    }
}
var oldSelectedValues = 0;

//if any column is ignored then unselect those field from the Data search wizard 
function unselectIgnoredColumns() {
    $("#gridImpData tr th").find("select[disabled]").each(function () {
        var val = $(this).val();
        var txt = $(this).find("option[selected]").text();
        if ($('#mSelectLeft option[value="' + val + '"]').length == 0) {
            $('#mSelectLeft').append($('<option>', {
                value: val,
                text: txt,
                mandatory: false
            }));
            $("#mSelectRight option[value='" + val + "']").remove();
        }
    });
    oldSelectedValues = $("#mSelectRight option").length;
}

//add ignored column index in hdnIgnoredColumns fld seperated by ','
function updateIgnoredColumns(val, type) {
    var ind = ignoredColumns.indexOf(val);
    if (type == "push") {
        if (ind === -1) 
            ignoredColumns.push(val);
    }
    else {
        if (ind !== -1) 
            ignoredColumns.splice(ind, 1);
    }
    $("#hdnIgnoredColumns").val(ignoredColumns.sort(((a, b) => a - b)));
}

window.addEventListener('error', function (e) {
    var error = e.error;
    console.log(error);
});

function showPopover() {
    $('[data-toggle="popover"]').popover({
        placement: placement
    });
}

var placement, ignoredColCount = 0;
var ignoredColumns = [], impWizardObj = [];

function DropzoneInitImport() {
    const id = "#dropzone_AxpFileImport";
    const dropzone = document.querySelector(id);

    //et the preview element template
    var previewNode = dropzone.querySelector(".dropzone-item");
    previewNode.id = "";
    var previewTemplate = previewNode.parentNode.innerHTML;
    previewNode.parentNode.removeChild(previewNode);
    var url = location.origin + location.pathname.substr(0, location.pathname.indexOf('aspx'));
    var myDropzone = new Dropzone(id, { // Make the whole body a dropzone
        url: url + "FileUploadHandler.ashx", // Set the url for your upload script location
        // parallelUploads: 20,
        previewTemplate: previewTemplate,
        addRemoveLinks: true,
        maxFilesize: 1, // Max filesize in MB
        // autoQueue: false, // Make sure the files aren't queued until manually added
        previewsContainer: id + " .dropzone-items", // Define the container to display the previews
        clickable: id + " .dropzone-select" // Define the element that should be used as click trigger to select files.
    });
    //.addRemoveLinks = true
    myDropzone.on("addedfile", function (file) {
        // Hookup the start button
        const dropzoneItems = dropzone.querySelectorAll('.dropzone-item');
        dropzoneItems.forEach(dropzoneItem => {
            dropzoneItem.style.display = '';
        });
        // $("#UploadButton").click();
    });

    // Update the total progress bar
    myDropzone.on("totaluploadprogress", function (progress) {
        const progressBars = dropzone.querySelectorAll('.progress-bar');
        progressBars.forEach(progressBar => {
            progressBar.style.width = progress + "%";
        });
    });
    myDropzone.on("removedfile", function (file) {
        debugger;

    });
   
    // Hide the total progress bar when nothing's uploading anymore
    myDropzone.on("complete", function (progress) {
        const progressBars = dropzone.querySelectorAll('.dz-complete');
        var responseText =progress.xhr.responseText;
        var fileNameModified =progress.xhr.responseText.substr(progress.xhr.responseText.indexOf("&&") + 2);

        $("#upFileName").val(fileNameModified);
        $("#uploadFileName").val(progress.name);
         //FileuplaodValidation();
        $("#UploadButton").click();
       // $("#upFileName").val(progress.name); 
        setTimeout(function () {
            progressBars.forEach(progressBar => {
                progressBar.querySelector('.progress-bar').style.opacity = "0";
                progressBar.querySelector('.progress').style.opacity = "0";
               // progressBar.querySelector('.dropzone-start').style.opacity = "0";
            });
        }, 300);
    });

}


// function DropzoneInitImport(dvId) {
//     let _thisDiv;
//     if (typeof dvId != "undefined") {
//         _thisDiv = $(dvId + " .dropzone");
//     }
//     else {
//         _thisDiv = $("#divDc1 .dropzone");
//     }
//     _thisDiv.each(function () {
//         const id = "#" + $(this).attr("id");
//         const dropzone = document.querySelector(id);

//         // set the preview element template
//         var previewNode = dropzone.querySelector(".dropzone-item");
//         previewNode.id = "";
//         var previewTemplate = previewNode.parentNode.innerHTML;
//         previewNode.parentNode.removeChild(previewNode);

//         var url = location.origin + location.pathname.substr(0, location.pathname.indexOf('aspx'));
//         const fuName = $(id).attr("id").substr(9);
//         funame = fuName.substring(0, fuName.lastIndexOf("F") - 3);
//         let attachmentSizeMB = callParentNew("axAttachmentSize", "axAttachmentSize") == undefined ? 1 : callParentNew("axAttachmentSize", "axAttachmentSize");
//         let maxFilesUpload = AxpFileUploadlmt != "0" ? AxpFileUploadlmt : 100;

//         var myDropzone = new Dropzone(id, { // Make the whole body a dropzone
//             url: url + `TstFileUpload.ashx?thisFld=${$(id).attr("id").substr(9)}&filePath=${$(".axpFilePath_" + $(id).attr("id").substring(("dropzone_axpfile_").length)).val() == undefined ? "" : $(".axpFilePath_" + $(id).attr("id").substring(("dropzone_axpfile_").length)).val()}&dcNo=${GetFieldsDcNo($(id).attr("id"))}&attFldName=${funame}`,
//             maxFilesize: attachmentSizeMB, // Max filesize in MB
//             previewTemplate: previewTemplate,
//             previewsContainer: id + " .dropzone-items", // Define the container to display the previews
//             clickable: id + " .dropzone-select", // Define the element that should be used as click trigger to select files.
//             maxFiles: maxFilesUpload
//         });

//         const dzdefault = dropzone.querySelectorAll('.dz-default');
//         $(dzdefault).addClass("d-none");

//         myDropzone.on("addedfile", function (file) {
//             // Hookup the start button
//             const dropzoneItems = dropzone.querySelectorAll('.dropzone-item');
//             dropzoneItems.forEach(dropzoneItem => {
//                 dropzoneItem.style.display = '';
//             });
//         });

//         // Hide the total progress bar when nothing"s uploading anymore
//         myDropzone.on("complete", function (progress) {
//             const progressBars = dropzone.querySelectorAll('.dz-complete');
//             if (progress.status == 'success') {
//                 if (progress.xhr.response == "success" || progress.xhr.response.startsWith("success:")) {
//                     let mesg = progress.xhr.response;
//                     $(progress.previewElement).parents(".dropzone").find(".fileuploadmore").removeClass("d-none");
//                     let fuInpId = $(progress.previewElement).parents(".dropzone").attr("id").substr(9);
//                     let fuInpVal = $("#" + fuInpId).val();
//                     fuInpVal = fuInpVal == "" ? progress.name : fuInpVal + "," + progress.name;
//                     $("#" + fuInpId).val(fuInpVal);

//                     var hdnScriptsUrlPath = $j("#hdnScriptsUrlpath");
//                     let filePath = hdnScriptsUrlPath.val() + "axpert/" + sid + "/";
//                     filePath += progress.name;

//                     $(progress.previewElement).find(".dropzone-filename").attr("onclick", "ShowAxpFileuploadLink('" + fuInpId + "','" + progress.name + "','" + filePath + "')")

//                     UpdateFieldArray(fuInpId, "0", fuInpVal, "parent", "");

//                     showAlertDialog("success", mesg.split(":")[1]);
//                 } else {
//                     let mesg = progress.xhr.response;
//                     myDropzone.removeFile(progress);
//                     showAlertDialog("error", mesg.split(":")[1]);
//                 }
//             } else {
//                 if (progress.status == 'error')
//                     showAlertDialog("warning", $(progress.previewTemplate).find(".dropzone-error").text());
//             }
//         });

//         myDropzone.on("error", function (file) {
//             myDropzone.removeFile(file);
//         });

//         myDropzone.on("removedfile", function (file) {
//             let fuInpId = $(myDropzone.element).attr("id").substr(9);
//             let fuInpVal = $("#" + fuInpId).val();
//             fuInpVal = fuInpVal.replace(file.name + ",", "").replace(file.name, "");
//             $("#" + fuInpId).val(fuInpVal);
//             UpdateFieldArray(fuInpId, "0", fuInpVal, "parent", "");
//         });


//         let fuInpId = $(id).attr("id").substr(9)
//         let fuInpVal = $("#" + fuInpId).val();
//         if (fuInpVal != "") {
//             $.each(fuInpVal.split(','), function (i, val) {
//                 var file = {
//                     name: val,
//                     size: "0",
//                     status: Dropzone.ADDED,
//                     accepted: true
//                 };
//                 myDropzone.emit("addedfile", file);
//                 myDropzone.emit("complete", file);
//                 myDropzone.files.push(file);

//                 var hdnScriptsUrlPath = $j("#hdnScriptsUrlpath");
//                 let filePath = hdnScriptsUrlPath.val() + "axpert/" + sid + "/";
//                 filePath += file.name;

//                 $(file.previewElement).find(".dropzone-filename").attr("onclick", "ShowAxpFileuploadLink('" + $(myDropzone.files[0].previewElement).parents(".dropzone").attr("id").substr(9) + "','" + file.name + "','" + filePath + "')")
//             });
//             $(id).find(".fileuploadmore").removeClass("d-none");
//         }
//     });
// }

$(document).ready(function () {

    var element = document.querySelector("#kt_stepper_example_clickable");

    // Initialize Stepper
    var stepper = new KTStepper(element);

    // Handle navigation click
    stepper.on("kt.stepper.click", function (stepper) {

        if(!stepper.stepped){
            return;
        }
        stepper.goTo(stepper.getClickedStepIndex()); // go to clicked step
    });

    // Handle next step
    stepper.on("kt.stepper.next", function (stepper) {
        // stepper.goNext(); // go next step
        if (stepper.getCurrentStepIndex() == 1) {
            validateDataSearchWiz();
            if (validateDataSearchWiz() == true) {
                stepper.goNext();
                return;
            }
            else {

                return;
            }
        }
        if (stepper.getCurrentStepIndex() == 2) {
            validateDataUploadWiz();
            if (validateDataUploadWiz() == true) {
                stepper.goNext();
                return;
            }
            else {

                return;
            }
            // return validateDataUploadWiz();
        }
        if (stepper.getCurrentStepIndex() == 3) {
            if (GetSelColData()) {
                $(".card-footer").addClass("d-none")
                $("#btnImport").click();
               ShowDimmer(true);
               stepper.goNext();
           //parent.closeModalDialog();
                 return;
             }
            return ;
        }
        if (stepper.getCurrentStepIndex() == 4) {
            if ($("#fileUploadComplete").val() == "1")
                return true;
            return false;
        }
    });

    // Handle previous step
    stepper.on("kt.stepper.previous", function (stepper) {
        stepper.goPrevious(); // go previous step
    });
    $("#ddlImpTbl").select2();
    if ($("#ddlGroupBy").prop("disabled") != true)
        $("#ddlGroupBy").select2();
    $("#ddlSeparator").select2();
    $("#ddlPrimaryKey").select2();
    
    // Dropzone.autoDiscover = false;
    DropzoneInitImport();
    // modalHeader = eval(callParent("divModalHeader", "id") + ".getElementById('divModalHeader')");
    // modalHeader.innerText = eval(callParent('lcm[251]'));
    $("#ChkColNameInfile").attr("checked", false)
    //updating popup over content dynamically based on language selection
    $("#icocl1").attr("data-content", eval(callParent('lcm[179]')));
    $("#icocl2").attr("data-content", eval(callParent('lcm[181]')));
    $("#icocl3").attr("data-content", eval(callParent('lcm[176]')));
    $("#icocl4").attr("data-content", eval(callParent('lcm[177]')));
    $("#icocl5").attr("data-content", eval(callParent('lcm[307]')));
    $("#icocl6").attr("data-content", eval(callParent('lcm[308]')));
    $("#icocl7").attr("data-content", eval(callParent('lcm[309]')));
    parent.gllangType === "ar" ? ($("#wizardWrappper").addClass('rtlLanguage'), placement = "left", $("#wizardNextbtn").parent().removeClass("pull-right").addClass("pull-left")) : ($("#wizardWrappper").removeClass('rtlLanguage'), placement = "right");

    $("#lblimgroupby,#lblseparator, #icocl6, #icocl7").css("float", parent.gllangType === "ar" ? "right" : "left");
    //$("#lnkExpTemp").click(function () {
    //    $("#btnCreateTemplate").click();
    //});

    showPopover();

    //updating >, <, >>, << button title content & icons alignment dynamically based on language selection
    $("#right_All_1").prop("title", eval(callParent('lcm[171]'))).addClass(parent.gllangType === "ar" ? "fa-angle-double-left" : "fa-angle-double-right");
    $("#right_Selected_1").prop("title", eval(callParent('lcm[172]'))).addClass(parent.gllangType === "ar" ? "fa-angle-left" : "fa-angle-right");
    $("#left_Selected_1").prop("title", eval(callParent('lcm[173]'))).addClass(parent.gllangType === "ar" ? "fa-angle-right" : "fa-angle-left");
    $("#left_All_1").prop("title", eval(callParent('lcm[174]'))).addClass(parent.gllangType === "ar" ? "fa-angle-double-right" : "fa-angle-double-left");

    //updating Prev, Next, Cancel, Done button title & text properties dynamically based on language selection
    $("#wizardPrevbtn").prop("title", eval(callParent('lcm[163]'))).html("<span class='material-icons'>skip_previous</span><span class='wizard-icon'>" + eval(callParent('lcm[163]')) + "</span>");
    $("#wizardNextbtn").prop("title", eval(callParent('lcm[162]'))).html("<span class='material-icons'>skip_next</span><span class='wizard-icon'>" + eval(callParent('lcm[162]')) + "</span>");
    $("#wizardCompbtn").prop("title", eval(callParent('lcm[165]'))).html("<span class='material-icons'>thumb_up</span><span class='wizard-icon'>"+ eval(callParent('lcm[165]')) +"</span>");
    $("#wizardCancelbtn").prop("title", eval(callParent('lcm[192]'))).html("<span class='material-icons'>close</span><span class='wizard-icon'>"+ eval(callParent('lcm[192]')) +"</span>");
    
    $("#btnFileUpload").attr({ 'value': (eval(callParent('lcm[167]'))), 'title': (eval(callParent('lcm[167]'))) });

    // window.parent.closeFrame();
    callParentNew("closeFrame()", "function");

    uploadFileChangeEvent();
    
    uploadFileClickEvent();

    commonReadyTasks();

    //CheckFileUploadDis('fromReady');
    $(document).on("keydown", "input[type='text'],input[type='radio'],input[type='checkbox']", function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
        }
    });

    createMultiselectControl();

    //multiselect left button clicks - allow user to move selected options from right to left(only non mandatory fields)
    $("#left_Selected_1").click(function () {
        $("#mSelectRight :selected").map(function (i, el) {
            var li = Boolean($(el).attr("mandatory"));
            if (!li) {
                $('#mSelectLeft').append($('<option>', {
                    value: $(this).val(),
                    text: $(this).text(),
                }));
                $(this).remove();
            }
        });
    });

    //multiselect left all button clicks - allow user to move all options from right to left(only non mandatory fields)
    $("#right_All_1").click(function () {
        $("#mSelectLeft option").map(function (i, el) {
            var li = Boolean($(el).attr("mandatory"));
            if (!li) {
                $('#mSelectRight').append($('<option>', {
                    value: $(this).val(),
                    text: $(this).text(),
                }));
                $(this).remove();
            }
        });
    });

    //multiselect left all button clicks - allow user to move all options from right to left(only non mandatory fields)
    $("#left_All_1").click(function () {
        $("#mSelectRight option").map(function (i, el) {
            var li = Boolean($(el).attr("mandatory"));
            if (!li) {
                $('#mSelectLeft').append($('<option>', {
                    value: $(this).val(),
                    text: $(this).text(),
                }));
                $(this).remove();
            }
        });
    });

    ////right multiselect option double click - allow user to move option from right to left(only non mandatory fields)
    //$("#mSelectRight option").dblclick(function () {
    //    if ($(this).attr("mandatory") == "true")
    //        showAlertDialog('warning', 'It is a mandatory field.');
    //    else {
    //        $('#mSelectLeft').append($('<option>', {
    //            value: $(this).val(),
    //            text: $(this).text(),
    //        }));
    //        $(this).remove();
    //    }
    //});

    $('body').on('click', function (e) {
        $('[data-toggle=popover]').each(function () {
            // hide any open popovers when the anywhere else in the body is clicked
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                $(this).popover('hide');
            }
        });
    });

    $('body').on('hidden.bs.popover', function (e) {
        $(e.target).data("bs.popover").inState.click = false;
    });

    $("#ddlImpTbl").change(function () {
        ShowDimmer(true);
    });

    $("#spnFileSelect").keypress(function (e) {
        if (e.keyCode == 13)
            $("#fileToUpload").click();
    });

    $("#fileToUpload").attr("title", eval(callParent('lcm[66]')));
    $("#ddlSeparator").change(function () {
        $("#hdnUploadFileWarnings, #IsFileUploaded").val("");
        $("#noFile").text(eval(callParent('lcm[66]')));
        $("#fileToUpload").attr("title", eval(callParent('lcm[66]')));
        $("#divProgress").hide();

        $("[data-target='imWizardEdit']").removeClass("in-progress complete");
        $("[data-target='imWizardSummary']").removeClass("in-progress complete");
        $("[data-target='imWizardUpload']").addClass("in-progress").removeClass("complete");
    })

    mandatoryColCount = $("#mSelectRight option[mandatory='true']").length;
    $("#hdnMandatoryColCount").val(mandatoryColCount);

    var mandatoryFldVal = "", mandatoryFldCap = "";
    $("#mSelectRight option[mandatory='true']").each(function () {
        mandatoryFldVal += $(this).val() + ",";
        mandatoryFldCap += $(this).text() + ",";
    });
    if (mandatoryFldVal != "" && mandatoryFldCap != "") {
        mandatoryFldVal = mandatoryFldVal.substr(0, mandatoryFldVal.length - 1);
        mandatoryFldCap = mandatoryFldCap.substr(0, mandatoryFldCap.length - 1);
    }
    $("#hdnMandatoryFields").val(mandatoryFldVal + '#' + mandatoryFldCap);


    //Widget Work flow code - begins
    // impWizardObj = new WizardComp({ progress_bar: `${AxwizardType === "modern" ? "flat" : AxwizardType}` });

    //widget initilization
    // impWizardObj.importDataWizard = {
    //     name: 'importDataWizard',
    //     steps: 4,
    //     ids: ["imWizardDataSearch", "imWizardUpload", "imWizardEdit", "imWizardSummary"],
    //     stepNames: [eval(callParent('lcm[166]')), eval(callParent('lcm[167]')), eval(callParent('lcm[168]')), eval(callParent('lcm[169]'))],
    //     validateKeys: ["data-select", "data-upload", "data-edit", 'data-summary']
    // }

    ////widget creation
    //impWizardObj.createWizard = function (widget) {
    //    var wizardHeaderHtml = "";
    //    var presentObj = widget;
    //    var totalSteps = presentObj.steps;
    //    var stepNames = presentObj.stepNames;
    //    var ids = presentObj.ids;
    //    $("#wizardWrappper").data('type', presentObj.name);
    //    for (var i = 0; i < totalSteps; i++) {
    //        var targetId = ids[i];
    //        if (i == 0)
    //            wizardHeaderHtml += '<div data-objtype="' + presentObj.name + '" data-id=' + i + ' data-target="' + targetId + '" class="step in-progress active">';
    //        else
    //            wizardHeaderHtml += '<div data-objtype="' + presentObj.name + '" data-id=' + i + ' data-target="' + targetId + '" class="step">';
    //        wizardHeaderHtml += '<a class="stepName" href="javascript:void(0)">' + stepNames[i] + '</a>';
    //        wizardHeaderHtml += '<div class="node"></div>';
    //        wizardHeaderHtml += '</div>';
    //    }
    //    $("#wizardHeader").html('<div class="wizard-progress">' + wizardHeaderHtml + '</div>');
    //    impWizardObj.showActiveData(ids[0])
    //    $("#wizardNextbtn").show();
    //    $("#ddlExTstruct").focus();
    //    impWizardObj.assignEvents();
    //}

    impWizardObj.assignEvents = function () {
        $("#wizardHeader .node,#wizardHeader a.stepName").on('click', function (event) {
            event.preventDefault();
            var elem = $(this);
            impWizardObj.checkClick(elem);
        });
    }

    //widget - next/prev click events
    impWizardObj.checkClick = function (elem, type) {
        var parentElem = $("#wizardHeader .step.active");
        var validateKey = parentElem.data('id');
        var validateObj = parentElem.data('objtype');
        if (type == "next") {
            var validationResult = impWizardObj.validateTheKey(validateObj, validateKey);
            if (validationResult || (parentElem.hasClass('complete') && validationResult)) {
                var nextparentelem = parentElem.next();
                if (!parentElem.hasClass('complete')) {
                    parentElem.addClass('complete').removeClass('in-progress active');
                    nextparentelem.addClass('in-progress active');

                } else {
                    parentElem.removeClass('active');
                    nextparentelem.addClass('active');
                }
                var targetObj = nextparentelem.data('objtype');
                var targetId = impWizardObj[targetObj].ids[nextparentelem.data('id')];
                impWizardObj.showActiveData(targetId)
                impWizardObj.checkNxtPrevBtns();
                if (validateKey + 1 == impWizardObj.importDataWizard.steps - 1)
                    nextparentelem.addClass("complete");
                if (validateKey == 3)
                    ShowDimmer(true);
            }
        }
        else if (type == "prev") {
            parentElem.removeClass('active');
            var prevParentElem = parentElem.prev();
            prevParentElem.addClass('active');
            var targetObj = prevParentElem.data('objtype');
            var targetId = impWizardObj[targetObj].ids[prevParentElem.data('id')];
            impWizardObj.showActiveData(targetId)
            impWizardObj.checkNxtPrevBtns();
        }
        else {
            var parentElem = elem.parents('.step');
            if (!parentElem.hasClass('active') && (parentElem.hasClass('complete') || parentElem.hasClass('in-progress'))) {
                $("#wizardHeader .step.active").removeClass('active')
                var target = parentElem.addClass('active').data('target');
                impWizardObj.showActiveData(target);
                impWizardObj.checkNxtPrevBtns();
            }
        }
    }

    //widget - to show active widget menu
    impWizardObj.showActiveData = function (target) {
        $(".wizardContainer").hide();
        $("#" + target).show();
    }

    //hide & show Next, Prev, Cancel & Done buttons
    impWizardObj.checkNxtPrevBtns = function () {
        var totalSteps = $("#wizardHeader .step").length;
        var curStep = $("#wizardHeader .step.active").data('id');
        if (curStep == 0) {
            wizardTabFocus("ddlImpTbl", "wizardNextbtn",true);
        }
        if (curStep == 1)
            wizardTabFocus("lnkExpTemp", "wizardNextbtn");
        else if (curStep == 2) {
            wizardTabFocus("chkForIgnoreErr", "wizardNextbtn");
            addChkbxsToGrdColumns();
            disabledIgnoredColumns(ignoredColCount);
        }

        if (curStep == 0) {
            //$("#ddlExTstruct").focus();
            $("#wizardPrevbtn, #wizardCompbtn").hide();
            $("#wizardNextbtn").show().html(eval(callParent('lcm[162]')));
            $("#mSelectLeft option, #mSelectRight option").prop('selected', false);
        } else if (curStep == (totalSteps - 1)) {
            $("#wizardPrevbtn").show();
            $("#wizardNextbtn").hide();
            $("#wizardCompbtn").show().html("<span class='material-icons'>cancel</span><span class='wizard-icon'>"+ eval(callParent('lcm[165]')) +"</span>").click(function () { parent.closeModalDialog(); actionsClicked = ""; });

        } else {
            $("#wizardPrevbtn").show();
            $("#wizardNextbtn").show().html("<span class='material-icons'>skip_next</span><span class='wizard-icon'>" + eval(callParent('lcm[162]')) + "</span>");
            $("#wizardCompbtn").hide();
        }

        if (curStep == 3)
            $("#wizardNextbtn").text(eval(callParent('lcm[170]')));
        else
            $("#wizardNextbtn").html("<span class='material-icons'>skip_next</span><span class='wizard-icon'>" + eval(callParent('lcm[162]')) + "</span>");
        $(".gridData select").addClass("form-control");

    }

    //Next, Prev button validations
    impWizardObj.validateTheKey = function (objct, key) {
        var presentObj = impWizardObj[objct];
        var validateKeys = presentObj.validateKeys;
        var validateKeyName = validateKeys[key];
        if (validateKeyName != "") {
            if (validateKeyName == "data-select") {
                //GetSelColData()
                return validateDataSearchWiz();
            }
            else if (validateKeyName == "data-upload") {
                return validateDataUploadWiz();
            }
            else if (validateKeyName == "data-edit") {
                if (GetSelColData()) {
                    $("#btnImport").click();
                    ShowDimmer(true);
                    //parent.closeModalDialog();
                    return true;
                }
                return false;
            }
            else if (validateKeyName == "data-summary") {
                if ($("#fileUploadComplete").val() == "1")
                    return true;
                return false;
            }
        } else {
            return true;
        }
    }

    //create wizard
    // impWizardObj.createWizard("importDataWizard");
    //Widget Work flow code - end

    //to set tab focus for the the first tab(Data Search)l̥
    // wizardTabFocus("ddlImpTbl", "wizardNextbtn", true);

    //to display tooltips for Wizard tabs
    $("#wizardWrappper .stepName").each(function () {
        $(this).prop("title", $(this).text());
        $(this).next().prop("title", $(this).text());
    })
});  
