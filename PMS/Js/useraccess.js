var isFormDirty = false;
var totelements = "";
var dcres = "";
var fldres = "";
var butres = "";
var lvbutres = "";
var tcindex = 0;
$(document).ready(function () {
    //find responsibility dialog id
    var respModal = window.parent.document.getElementById('iFrameAddResponsibility');
    if (respModal == undefined)
        respModal = window.parent.document.getElementById('iFrameEditResponsibility');
    respModal.contentWindow.ShowDimmer(false); //hide dimmer in responsibility page once this page is loaded

    //modal header text
    iframe = eval(callParent("divModalHeader", "id") + ".getElementById('divModalHeader')");
    modalHeader = eval(callParent("divModalUserAccess", "id") + ".getElementById('divModalUserAccess')");
    $(modalHeader).find("#divModalHeader").text(eval(callParent('lcm[328]')));
    $(".dialog-footer div").addClass("pull-" + (parent.gllangType != "ar" ? "right" : "left"));
    $("#save").prop({ 'value': eval(callParent('lcm[200]')),'title':  eval(callParent('lcm[200]'))});
    $("#btnClose").prop({ 'value': eval(callParent('lcm[249]')), 'title': eval(callParent('lcm[249]')) });

    //menu header text
    $("#aViewControl").text(eval(callParent('lcm[333]')));
    $("#aTransactionControl").text(eval(callParent('lcm[334]')));
    $("#aDCs").text(eval(callParent('lcm[329]')));
    $("#aFields").text(eval(callParent('lcm[330]')));
    $("#aButtons").text(eval(callParent('lcm[331]')));
    $("#aListViewButtons").text(eval(callParent('lcm[332]')));

    //table header text for DCs, field name, buttons, listview buttons
    $("#thDCName").text(eval(callParent('lcm[353]')));
    $("#thFieldName").text(eval(callParent('lcm[354]')));
    $("#thButtonName,#thLVButtonName").text(eval(callParent('lcm[355]')));
    $(".view").text(eval(callParent('lcm[335]')));
    $(".enable").text(eval(callParent('lcm[336]')));

    //transaction control lbl's
    $("#lblFieldColumn").text(eval(callParent('lcm[354]')));
    $("#lblOperator").text(eval(callParent('lcm[327]')));
    $("#lblValues,#lblValuesBtw").text(eval(callParent('lcm[352]')));
    $("[for='tc_view_cb']").text(eval(callParent('lcm[335]')));
    $("[for='tc_edit_cb']").text(eval(callParent('lcm[168]')));
    $("[for='tc_delete_cb']").text(eval(callParent('lcm[248]')));
    $("#btnTCOK").prop({ 'value': eval(callParent('lcm[281]')), 'title': eval(callParent('lcm[281]')) });
    $("#btnTCCancel").prop({ 'value': eval(callParent('lcm[192]')), 'title': eval(callParent('lcm[192]')) });
    $("#tcadd").attr("title", eval(callParent('lcm[314]')));

    // ChangeTheme(window);
    checkSuccessAxpertMsg();
    $('#ViewControl input[type="checkbox"]').each(function (key) {
        $(this).change(function () {
            
            $("#hdnFormChanges").val("true");
        });
    });
    setAccessValues();
    totelements = document.form1.elements.length;

    $("#save").click(function () {
        setAccessValues();
        if ($("#tc_flds").css("display")=="none") {
            ShowDimmer(true);
            return true;
        }
        else {
            showAlertDialog("warning", eval(callParent('lcm[341]')));
            $('#liTransactionControl, #TransactionControl').addClass('active'); $('#liViewControl,#ViewControl').removeClass('active');
            $("#tc_ok").focus();
            return false;
        }
    });

    tabFocusEvent("save", "cancel");
    enableDisableChkboxes();//to enable/disable associated checkboxes for dc's, fields, buttons, listview buttons
    $("#liTransactionControl").click(function () {
        $("#tc_opr_cb").change(function () {
            if ($(this).val() == "Between")
                $("#tc_betvalues_cb").removeAttr("disabled");
            else
                $("#tc_betvalues_cb").attr("disabled", "disabled")
        })
    })
    
    bindGridData(transid);

    $("#liTransactionControl, #liTransactionControl a").click(function () {
        $(".dataTables_scrollHeadInner, .gridData").css("width", "100%")
    })

    $("#tcadd").click(function () {
        $("#tblTC_wrapper,#tcadd").hide();
        $("#tc_flds").show();
        $("#editmode, #tc_betvalues_cb, #tc_fld_cb, #tc_opr_cb, #tc_opr_cb, #tc_values_cb").val("");
        $("#tc_betvalues_cb").attr("disabled", "disabled");
        $("#tc_view_cb,#tc_edit_cb,#tc_delete_cb").prop("checked", "checked");
        actionType = "add";
        tcindex = 0;
    })
});

//update default values(xml tags) in the hidden fields dc_xml, fld_xml, but_xml, lv_xml
function setAccessValues() {
    for (i = 0; i < totelements; i++) {
        if (document.form1.elements[i].type == "checkbox") {
            var id = document.form1.elements[i].id;
            var vie = id.substring(0, id.length - 3);

            if (vie == "dcview") {
                var viewsts = document.form1.elements[i].checked;
                var dcval = document.form1.elements[i].value;
                var enasts = document.form1.elements[i + 1].checked;
                var dccap = document.form1.elements[i + 2].value;
                dcres = dcres + '<' + dcval + ' cap="' + dccap + '" view="' + viewsts + '" enable="' + enasts + '" ></' + dcval + '>';
                i = i + 1;
            }
            else if (vie == "fldview") {
                var viewsts = document.form1.elements[i].checked;
                var fldval = document.form1.elements[i].value;
                var enasts = document.form1.elements[i + 1].checked;
                var flcap = document.form1.elements[i + 2].value;
                fldres = fldres + '<' + fldval + ' cap="' + flcap + '"  view="' + viewsts + '" enable="' + enasts + '" ></' + fldval + '>';
                i = i + 1;
            }
            else if (vie == "butview") {
                var viewsts = document.form1.elements[i].checked;
                var butname = document.form1.elements[i].value;
                var butval = document.form1.elements[i + 1].value;
                var enasts = document.form1.elements[i + 1].checked;
                butres = butres + '<' + butname + ' cap="' + butval + '" view="' + viewsts + '" enable="' + enasts + '" ></' + butname + '>';
                i = i + 1;
            }
            else if (vie == "lvbview") {
                var viewsts = document.form1.elements[i].checked;
                var butname = document.form1.elements[i].value;
                var butval = document.form1.elements[i + 1].value;
                var enasts = document.form1.elements[i + 1].checked;
                lvbutres = lvbutres + '<' + butname + '  cap="' + butval + '" view="' + viewsts + '" enable="' + enasts + '" ></' + butname + '>';
                i = i + 1;
            }
        }
    }
    if (dcres != "") {
        var dcxml = document.getElementById("dc_xml");
        dcxml.value = dcres;
    }
    if (fldres != "") {
        var fldxml = document.getElementById("fld_xml");
        fldxml.value = fldres;
    }
    if (butres != "") {
        var butxml = document.getElementById("but_xml");
        butxml.value = butres;
    }
    if (lvbutres != "") {
        var lvxml = document.getElementById("lv_xml");
        lvxml.value = lvbutres;
    }
}

//to check if any checkbox has changed
function checkIfFormChanges() {
    isFormDirty = JSON.parse($("#hdnFormChanges").val())
    return isFormDirty;
}

//to display confirm dialog while unloading the form only if form inputs changes
function ConfirmLeave() {
    if ($(".jconfirm").length > 0) {
        $(".jconfirm").remove();
    }
    else {
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
            escapeKey: 'cancel',
            content: eval(callParent('lcm[319]')),
            buttons: {
                confirm: {
                    text: eval(callParent('lcm[164]')),
                    btnClass: 'btn btn-primary',
                    action: function () {
                        ConfirmSaveCB.close();
                        parent.closeModalDialog();
                        parent.checkIfAnyActionPerformed();
                    }
                },
                cancel: {
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

//transaction add/edit validation - returns true if all fields are valid, else return false
function validateTransactionControl() {
    fld = $("#tc_fld_cb");
    opr = $("#tc_opr_cb");
    values = $("#tc_values_cb");
    btwnvalues = $("#tc_betvalues_cb");

    if (fld.val() == "") {
        showAlertDialog("warning", eval(callParent('lcm[343]')));
        fld.focus();
        return false;
    }
    else if (opr.val() == "") {
        showAlertDialog("warning", eval(callParent('lcm[344]')));
        opr.focus();
        return false;
    }
    else if (values.val() == "") {
        showAlertDialog("warning", eval(callParent('lcm[345]')));
        values.focus();
        return false;
    }
    else if (opr.val() == "Between" && btwnvalues.val() == "") {
        showAlertDialog("warning", eval(callParent('lcm[345]')));
        btwnvalues.focus();
        return false;
    }
    tcUpdate(transid);
}

function tabFocusEvent(firstFocusId, lastFocusId) {
    modalButton = eval(callParent("btnModalClose", "id") + ".getElementById('btnModalClose')");
    if (modalButton.className.indexOf("firstFocusable") == -1)
        modalButton.className += " firstFocusable";
    $(".lastFocusable").removeClass("lastFocusable");
    $("#" + lastFocusId).addClass("lastFocusable").focus();
    $(".lastFocusable").on('keydown.tabRot', function (e) {
        if ((e.which === 9 && !e.shiftKey)) {
            e.preventDefault();
            modalButton.focus();
        }
    });

    modalButton.addEventListener('keydown', function (e) {
        if ((e.which === 9 && e.shiftKey)) {
            e.preventDefault();
            $(".lastFocusable").focus();
        }
    });
    setTimeout(function () {
        $("#" + firstFocusId).focus();
    }, 100)
}

//to enable/disable associated checkboxes for dc's, fields, buttons, listview buttons
function enableDisableChkboxes() {
    var viewControlList = ["dc", "fld", "btn", "lbtn"]; //list of view controls
    $.each(viewControlList, function (key, value) { //assign checkbox change events for all view controls
        //checkbox change event for all View options
        $("[data-" + value + "-view]").change(function () {
            var chkId = $(this).attr("data-" + value + "-view");
            var status = $(this).is(":checked");
            if (!status)//if any view option is unselected then unselect the associated enable option
                $("[data-" + value + "-enable='" + chkId + "']").prop("checked", false);
        });

        //checkbox change event for all Enable options
        $("[data-" + value + "-enable]").change(function () {
            var chkId = $(this).attr("data-" + value + "-enable");
            var status = $(this).is(":checked");
            if (status)//if any enable option is selected then select the associated view option
                $("[data-" + value + "-view='" + chkId + "']").prop("checked", true);
        });
    });
}

//check if any form elements has been changed, if yes display confirm dialog else close User Access Tstruct popup
function closeWindow() {
    if (checkIfFormChanges())
        ConfirmLeave();
    else
        parent.closeModalDialog();
}

//get transaction control details
function editTransactionControl(index) {
    ShowDimmer(true);
    $.ajax({
        type: "POST",
        url: "../aspx/UserAccess.aspx/getTCDetails",
        contentType: "application/json;charset=utf-8",
        data: '{transid:"' + transid + '", index:"' + index + '"}',
        dataType: "json",
        success: function (data) {
            if (data.d == "SessionExpiry") {
                parent.window.location.href = "../aspx/sess.aspx";
            }
            else if (data.d == "Error") {
                showAlertDialog('warning', eval(callParent('lcm[346]')));
            }
            else {
                showTransactionFields();
                $("#tc_fld_cb").val(data.d.tc_fld_cb);
                $("#tc_opr_cb").val(data.d.tc_opr_cb);
                $("#tc_values_cb").val(data.d.tc_values_cb);
                $("#tc_view_cb").prop("checked", data.d.tc_view_cb);
                $("#tc_edit_cb").prop("checked", data.d.tc_edit_cb);
                $("#tc_delete_cb").prop("checked", data.d.tc_delete_cb);
                if (data.d.tc_betvalues_cb != "") {
                    $("#tc_betvalues_cb").val(data.d.tc_betvalues_cb).removeAttr("disabled");
                }
                else
                    $("#tc_betvalues_cb").val("").attr("disabled", "disabled");
                actionType = "update";
                tcindex = index;
            }
            ShowDimmer(false);
        },
        error: function (response) {
            showAlertDialog('warning', eval(callParent('lcm[342]')));
            ShowDimmer(false);
        }
    });
  
}

//to delete transaction control from the grid
function deleteTransactionControl(index) {
    ShowDimmer(true);
    $.ajax({
        type: "POST",
        url: "../aspx/UserAccess.aspx/DeleteTC",
        contentType: "application/json;charset=utf-8",
        data: '{transid:"' + transid + '", index:"' + index + '"}',
        dataType: "json",
        success: function (data) {
            if (data.d == "SessionExpiry") 
                parent.window.location.href = "../aspx/sess.aspx";
            else if (data.d == "Error") 
                showAlertDialog('warning', eval(callParent('lcm[347]')));
            else {
                showAlertDialog('success', eval(callParent('lcm[348]')));
                createDataTable(data.d);
            }
            ShowDimmer(false);
        },
        error: function (response) {
            showAlertDialog('warning', eval(callParent('lcm[347]')));
            ShowDimmer(false);
        }
    });
}

function showTransactionExp() {
    $("#tblTC_wrapper,#tcadd").show();
    $("#tc_flds").hide();
}

function showTransactionFields() {
    $("#tblTC_wrapper,#tcadd").hide();
    $("#tc_flds").show();
}

function cancelTransactionControl() {
    $("#tc_fld_cb, #tc_opr_cb, #tc_values_cb,tc_betvalues_cb").val("");
    showTransactionExp();
}

//to display confirm dialog if user clicks on any tc record delete
function confirmDeleteTransaction(index) {
    if ($(".jconfirm").length > 0) {
        $(".jconfirm").remove();
    }
    else {
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
            escapeKey: 'cancel',
            content: "Are you sure, you want to delete this Transaction control?",
            buttons: {
                confirm: {
                    text: eval(callParent('lcm[164]')),
                    btnClass: 'btn btn-primary',
                    action: function () {
                        ConfirmSaveCB.close();
                        deleteTransactionControl(index);
                    }
                },
                cancel: {
                    text: eval(callParent('lcm[192]')),
                    btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                    action: function () {
                        disableBackDrop('destroy');
                        
                    },
                }
            }
        });
    }
}

//get list of Redis keys for the current project
function bindGridData(transid) {
    ShowDimmer(true);
    $.ajax({
        type: "POST",
        url: "../aspx/UserAccess.aspx/BindGridData",
        contentType: "application/json;charset=utf-8",
        data: '{transid:"' + transid + '"}',
        dataType: "json",
        success: function (data) {
            if (data.d == "SessionExpiry") {
                parent.window.location.href = "../aspx/sess.aspx";
            }
            else if (data.d == "Error") {
                showAlertDialog('warning', eval(callParent('lcm[346]')));
            }
            else {
                createDataTable(data.d);
            }
            $("#chkSelectAll").prop("checked", false);
            ShowDimmer(false);
        },
        error: function (response) {
            showAlertDialog('warning', eval(callParent('lcm[346]')));
            ShowDimmer(false);
        }
    });
}

//to create a jquery datatable for Transaction control list
var dt = "";
function createDataTable(data) {
    var rowIndex = 0;
    dt = $('#tblTC').DataTable({
        data: data,
        language: {
            "search": "",
            "searchPlaceholder": eval(callParent('lcm[287]')),
            "zeroRecords": eval(callParent('lcm[0]')),
            "info":"",
            "infoEmpty": "",
        },
        "paging": false,
        "autoWidth": false,
        destroy: true,
        scrollY: '250px',
        scrollCollapse: true,
        "bSort" : false,
        "columns": [
            {
                "data": "Expression",
                "width": "73%",
                "title": eval(callParent('lcm[337]'))
            },
            {
                "data": "View",
                "width": "5%",
                "title": eval(callParent('lcm[335]')),
                'render': function (data, type, full, meta) {
                    return '<input type="checkbox" disabled ' + (data ? "checked='true'" : "") + '  value="' + $('<div/>').text(data).html() + '"/>'
                },
            },
            {
                "data": "Edit",
                "width": "5%",
                "title": eval(callParent('lcm[168]')),
                'render': function (data, type, full, meta) {
                    return '<input type="checkbox" disabled ' + (data ? "checked='true'" : "") + '  value="' + $('<div/>').text(data).html() + '"/>'
                },
            },
            {
                "data": "Delete",
                "width": "5%",
                "title": eval(callParent('lcm[248]')),
                'render': function (data, type, full, meta) {
                    return '<input type="checkbox" disabled ' + (data ? "checked='true'" : "") + '  value="' + $('<div/>').text(data).html() + '"/>'
                },
            },
            {
                "data": "Expression",
                "width": "12%",
                'render': function (data, type, full, meta) {
                    return '<span onclick="editTransactionControl(' + rowIndex + ')"  class="colorButton icon-pencil tc-action" title="' + eval(callParent('lcm[168]')) + '"></span><span onclick="confirmDeleteTransaction(' + (rowIndex++) + ')" class="colorButton icon-trash tc-action" title="' + eval(callParent('lcm[248]')) + '"></a>';
                },
            },
        ]
    })
   
    $("#tblTC tbody tr td:not(:first-child)").css("text-align", "center");
    $("#tblTC_filter").hide();
    setTimeout(function () {
        dt.columns.adjust().draw();
    }, 1000);
}

//to add/update a transaction control
function tcUpdate(transid) {
    tc_betvalues_cb = $("#tc_betvalues_cb").val();
    tc_fld_cb=$("#tc_fld_cb").val();
    tc_opr_cb=$("#tc_opr_cb").val();
    tc_values_cb=$("#tc_values_cb").val();
    tc_view_cb = $("#tc_view_cb").prop("checked");
    tc_edit_cb = $("#tc_edit_cb").prop("checked");
    tc_delete_cb = $("#tc_delete_cb").prop("checked");
    ShowDimmer(true);
    $.ajax({
        type: "POST",
        url: "../aspx/UserAccess.aspx/tcUpdate",
        contentType: "application/json;charset=utf-8",
        data: '{transid:"' + transid + '", tc_betvalues_cb:"' + tc_betvalues_cb + '", tc_fld_cb:"' + tc_fld_cb + '", tc_opr_cb:"' + tc_opr_cb + '", tc_values_cb:"' + tc_values_cb + '", tc_view_cb:"' + tc_view_cb + '", tc_edit_cb:"' + tc_edit_cb + '", tc_delete_cb:"' + tc_delete_cb + '", actionType:"' + actionType + '" , index:"' + tcindex + '"}',
        dataType: "json",
        success: function (data) {
            if (data.d == "SessionExpiry") {
                parent.window.location.href = "../aspx/sess.aspx";
            }
            else if (data.d == "Error") {
                showAlertDialog('warning', eval(callParent('lcm[342]')));
            }
            else {
                showAlertDialog('success', eval(callParent('lcm[338]')));
                showTransactionExp();
                createDataTable(data.d);
            }
            $("#hdnFormChanges").val("true");
            ShowDimmer(false);
        },
        error: function (response) {
            showAlertDialog('warning', eval(callParent('lcm[342]')));
            ShowDimmer(false);
        }
    });
}