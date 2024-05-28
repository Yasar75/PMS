//$j(document).ready(function () {
//    //BindEventFirefox();
//    //checkSuccessAxpertMsg();
//});
//function refreshRespWindow() {
//    $j("#txtReEditResp").val('');
//    $j('#treeEditRes :checkbox').attr('checked', false);
//    $j("#txtReEditResp").prop('readonly', false);
//}

//function countChecked() {
//    var count = $j("#grdReList input[type=radio]:checked").length;
//    if (count == 0) {
//        var cutMsg = eval(callParent('lcm[48]'));
//        ShowInfoMsg(cutMsg);
//        return false;
//    }
//    else if (count != 1) {
//        var cutMsg = eval(callParent('lcm[49]'));
//        ShowErrorMsg(cutMsg);
//        return false;
//    }
//    else {
//        ShowBackgroundFade();
//        SetGoCall('Copy'); adjustwin(window, 600);
//        return true;
//    }
//}

//function EndRequestHandler(sender, args) {
//    if (args.get_error() == undefined) {
//        var ErrMessageToDisplay = $j('#errorMessage');
//        var successMessageToDisplay = $j('#successMessage');
//        var hdn = $j('#hdnIsSearched').val();
//        if (hdn == "") {
//            return;
//        }
//        if (hdn == "Edit" || hdn == "AddRes") {
//            displayEditWindow('dvEditResp', 'Add/Edit Responsibility', 'Show', 'Resp');
//            if (ErrMessageToDisplay.val() != undefined && ErrMessageToDisplay.val() != "")
//                ShowErrorMsg(ErrMessageToDisplay.val());
//            if (successMessageToDisplay.val() != undefined && successMessageToDisplay.val() != "") {
//                ShowSuccessMsg(successMessageToDisplay.val());
//                $j("input.msgButton").click(function (e) {
//                    e.preventDefault();
//                    hiddenFloatingDiv('dvEditResp', 'close', 'success');
//                });
//            }
//            //TODO:The wait cursor should be added for the users and role tab also
//        }
//        else if (hdn == "Copy") {
//            displayEditWindow('dvEditResp', 'Add/Edit Responsibility', 'Show', 'Resp');
//            if (ErrMessageToDisplay.val() != undefined && ErrMessageToDisplay.val() != "")
//                ShowErrorMsg(ErrMessageToDisplay.val());
//            if (successMessageToDisplay.val() != undefined && successMessageToDisplay.val() != "") {
//                ShowSuccessMsg(successMessageToDisplay.val());
//                $j("input.msgButton").click(function (e) {
//                    e.preventDefault();
//                    hiddenFloatingDiv('dvEditResp', 'close', 'success');
//                });
//            }
//            //TODO:The wait cursor should be added for the users and role tab also
//        }
//        else if (hdn == "Delete") {
//            if (ErrMessageToDisplay.val() != undefined && ErrMessageToDisplay.val() != "") {
//                ShowErrorMsg(ErrMessageToDisplay.val());
//                HideBackgroundFade();
//            }
//            if (successMessageToDisplay.val() != undefined && successMessageToDisplay.val() != "") {
//                ShowSuccessMsg(successMessageToDisplay.val());
//                $j("input.msgButton").click(function (e) {
//                    e.preventDefault();
//                    hiddenFloatingDiv('dvEditResp', 'close', 'success');
//                });
//            }
//        }
//        else if (hdn == "Update") {
//            displayEditWindow('', '', '', '');
//            document.body.style.cursor = 'default';
//            if (ErrMessageToDisplay.val() != undefined && ErrMessageToDisplay.val() != "")
//                ShowErrorMsg(ErrMessageToDisplay.val());
//            if (successMessageToDisplay.val() != undefined && successMessageToDisplay.val() != "") {
//                ShowSuccessMsg(successMessageToDisplay.val());
//                $j("input.msgButton").click(function (e) {
//                    e.preventDefault();
//                    hiddenFloatingDiv('dvEditResp', 'close', 'success');
//                });
//            }
//        }
//        else if (hdn == "Search") {
//            if (!$j("#dvEditResp").is(':visible'))
//                hiddenFloatingDiv('dvEditResp', 'close', 'success');
//            if (ErrMessageToDisplay.val() != undefined && ErrMessageToDisplay.val() != "")
//                ShowErrorMsg(ErrMessageToDisplay.val());
//            if (successMessageToDisplay.val() != undefined && successMessageToDisplay.val() != "") {
//                ShowSuccessMsg(successMessageToDisplay.val());
//                $j("input.msgButton").click(function (e) {
//                    e.preventDefault();
//                    hiddenFloatingDiv('dvEditResp', 'close', 'success');
//                });
//            }
//        }
//        ShowDimmer(false);
//        $j("#successMessage").val('');
//        $j("#errorMessage").val('');
//        $j("#hdnIsSearched").val('');
//        document.body.style.cursor = 'default';
//    }
//    else {
//        if (args.get_error().name == "Sys.WebForms.PageRequestManagerTimeoutException")
//            document.getElementById("lblDisErrMsg").innerText = "Server request timed out";
//        document.body.style.cursor = 'default';
//        window.location.href = window.location.href;
//    }
//}
//function load() {
//    Sys.WebForms.PageRequestManager.getInstance().add_endRequest(EndRequestHandler);
//}

var totalResSelected = 0;
$(document).ready(function () {

    try {
        AxBeforeResponsibilityReady();
    }
    catch (ex) {
        console.log("AxBeforeResponsibilityReady Hook is failed" + ex.message);
    }
    // ChangeTheme(window);
    hdnTree = document.getElementById("hdnTreeSelVal").value;

    actionsHtml = $("#spnResponsibilityActions").html();
    bindGridData("");
    $("#txtGridSearch").attr("placeholder", eval(callParent('lcm[287]'))).focus();

    //grid search - clear icon click - reset the grid
    $("#searchclear").click(function () {
        $("#txtGridSearch").val("").focus();
        dt.search('').columns().search('').draw();
        $(this).hide();
    });

    $("#lnkAddResponsibility").click(function () {
        var name = "", status = "";
        name = $(this).text();
        status = $(this).attr("data-status");
        ShowDimmer(true);
        parent.displayBootstrapModalDialog('Add Responsibility', 'md', '430px', true, '../aspx/AddEditResponsibility.aspx?action=add', true);
    }).attr("title", eval(callParent('lcm[314]')));

    $("#lnkDeleteResponsibility").click(function () {
        confirmDelete();
    }).attr("title", eval(callParent('lcm[248]')));

    $("#ddlSearchColumns").change(function () {
        $("#searchclear").click();
    });

    $("#lblHeader").text(eval(callParent('lcm[313]')));
    $("#optSearchAll").text(eval(callParent('lcm[317]')));
    $("#optSearchName").text(eval(callParent('lcm[224]')));
    $("#optSearchAccessRights").text(eval(callParent('lcm[316]')));

    gridSearchEvent();

    try {
        AxAfterResponsibilityReady();
    }
    catch (ex) {
        console.log("AxAfterResponsibilityReady Hook  is failed" + ex.message);
    }
})

function ShowDimmer(status) {
    DimmerCalled = true;
    var dv = $j("#waitDiv");
    if (dv.length > 0 && dv != undefined) {
        if (status == true) {
            var currentfr = $j("#middle1", parent.document);
            if (currentfr) {
                //  dv.height(currentfr.height());
                dv.width(currentfr.width());
            }
            dv.show();
            document.onkeydown = function EatKeyPress() { return false; }
        }
        else {
            dv.hide();
            document.onkeydown = function EatKeyPress() { if (DimmerCalled == true) { return true; } }
        }
    }
    else {
        //TODO:Needs to be tested
        if (window.opener != undefined) {
            dv = $j("#waitDiv", window.opener.document);
            if (dv.length > 0) {
                if (status == true)
                    dv.show();
                else
                    dv.hide();
            }
        }
    }
    DimmerCalled = false;
}
//get total count of selected responsibilities from the grid, 
//if any one checked return true else return false
function getselectedResp() {
    totalResSelected = 0;
    var grd = $("#tblResponsibilities td:nth-child(1) input[type='checkbox']")
    var gv = document.getElementById("tblResponsibilities");
    var chk = gv.getElementsByTagName("input");
    if ($('#chkSelectAll').is(":checked")) {
        if (chk.length == 1)
            totalResSelected = 0;
        else
            totalResSelected = "All";
    }
    else {
        dt.column(0).nodes().to$().each(function (index) {
            if ($(this).find("input[type='checkbox']").prop("checked"))
                totalResSelected++;
        });
    }

    if (totalResSelected == 0)
        return false;
    else
        return true;
}

function ChangeTheme() {
    //var theme = $j("#DropDownList1 option:selected", window.parent.document).text();
    var theme = "";
    theme = eval(callParent('currentThemeColor'));
    if (theme != "") {
        $j("#themecss").attr('href', "../App_Themes/" + theme + "/Stylesheet.min.css?v=23");
    }
    else {
        var themeref = "";
        if (window.opener) {
            themeref = $j("#themecss", window.opener.document).attr("href");
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

//copy a responsibility & display dialog to add a responsibility
function copyResponsibility() {
    if (getselectedResp() == false) {
        //no responsibility is selected from the grid
        showAlertDialog("warning", eval(callParent('lcm[48]')));
        return false;
    }
    else if (totalResSelected != 1) {
        //if more than 1 responsibility selected from the grid
        showAlertDialog("warning", eval(callParent('lcm[49]')));
        return false;
    }
    else {
        ShowDimmer(true);
        return true;
    }
}

//to display confirm dialog box to delete selected responsibilities
function confirmDelete() {
    if (getselectedResp() == false) {
        //no responsibilities selected
        showAlertDialog("warning", eval(callParent('lcm[85]')));
        return false;
    }
    else {
        //atleast one responsibility is selected
        var glType = eval(callParent('gllangType'));
        var isRTL = false;
        if (glType == "ar")
            isRTL = true;
        else
            isRTL = false;
        var ConfirmDelCB = $.confirm({
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
            rtl: isRTL,
            escapeKey: 'buttonB',
            content: eval(callParent('lcm[87]')),
            buttons: {
                buttonA: {
                    text: eval(callParent('lcm[248]')),
                    btnClass: 'btn btn-primary',
                    action: function () {
                        disableBackDrop('destroy');
                        deleteResponsibilities();
                    }
                },
                buttonB: {
                    text: eval(callParent('lcm[192]')),
                    btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                    action: function () {
                        ConfirmDelCB.close();
                        disableBackDrop('destroy');
                        return false;
                    }
                },
            }
        });
    }
}

//delete selected responsibilities from the grid
function deleteResponsibilities() {
    var selectedResp = "";
    var checkflag = false;
    dt.column(1).nodes().to$().each(function (index) {
        if ($(this).siblings().find("input[type='checkbox']").prop("checked"))
            selectedResp += $(this).find("a").text() + ",";
    });

    selectedResp = selectedResp.substr(0, selectedResp.length - 1);
    $.ajax({
        type: "POST",
        url: "../aspx/Responsibilities.aspx/DeleteResponsibilities",
        contentType: "application/json;charset=utf-8",
        data: '{selectedResp:"' + selectedResp + '"}',
        dataType: "json",
        success: function (data) {
            if (data.d == "Success") {
                showAlertDialog('success', 'Responsibility deleted successfully');
                bindGridData("");
            }
            else if (data.d == "SessionExpiry") {
                parent.window.location.href = "../aspx/sess.aspx";
            }
            else if (data.d == "Error") {
                window.location.href = "../aspx/err.aspx"
            }
            else {
                showAlertDialog('warning', data.d);
                bindGridData("");
            }
            $("#searchclear").click();
            $("#chkSelectAll").prop("checked", false);
            ShowDimmer(false);
        },
        //error: function (response) {
        //    showAlertDialog('warning', eval(callParent('lcm[273]')) + eval(callParent('lcm[275]'))); ShowDimmer(false);
        //    ShowDimmer(false);
        //}
    });
}

var navAction = "";
//to navigate page by page on back and forward button click
function BackForwardButtonClicked(buttonName) {
    if (enableBackButton.toString().toUpperCase() == "FALSE" && buttonName == "back")
        return;
    if (enableForwardButton.toString().toUpperCase() == "FALSE" && buttonName == "forward")
        return;
    navAction = buttonName;
    ShowDimmer(true);
    try {
        //  ASB.WebService.NavigateBackForwardButton(buttonName, SuccessButtonClicked, OnNavException);
        $j.ajax({
            type: "POST",
            url: "../WebService.asmx/NavigateBackForwardButton",
            contentType: "application/json;charset=utf-8",
            data: '{buttonName: "' + buttonName + '"}',
            dataType: "json",
            success: function (data) {
                SuccessButtonClicked(data.d);
            },
            failure: function (response) {
                OnNavException(data.d);
            },
            error: function (response) {
                OnNavException(data.d);
            }
        });
    } catch (ex) {
        OnNavException("Failure during the process");
        ShowDimmer(true);
    }
}

function SuccessButtonClicked(result) {

    if (result != "") {
        window.location = result;
        return false;  //return false will force the page to load
    }
}

function OnNavException(result) {
    ShowDimmer(false);
    showAlertDialog("error", result._message);
}

//get list of Redis keys for the current project
function bindGridData(status) {
    ShowDimmer(true);
    $.ajax({
        type: "POST",
        url: "../aspx/Responsibilities.aspx/BindGridData",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: '{act:"' + status + '"}',
        success: function (data) {
            if (data.d == "SessionExpiry") {
                parent.window.location.href = "../aspx/sess.aspx";
            }
            else if (data.d == "Error") {
                window.location.href = "../aspx/err.aspx"
            }
            else {
                createDataTable(data.d);
            }
            $("#chkSelectAll").prop("checked", false);
            ShowDimmer(false);
        },
        error: function (response) {
            showAlertDialog('warning', "Failed to load Responsibilities"); 
            ShowDimmer(false);
        }
    });
}

//to create a jquery datatable for Redis key's list
var dt = "";
function createDataTable(data) {
     dt = $('#tblResponsibilities').DataTable({
        data: data,
        language: {
            //assign language keys for the datatable options
            "search": "",
            "searchPlaceholder": eval(callParent('lcm[287]')),
            "lengthMenu": eval(callParent('lcm[288]')),
            "zeroRecords": eval(callParent('lcm[0]')),
            "info": eval(callParent('lcm[290]')),
            "infoEmpty": "",
            "infoFiltered": eval(callParent('lcm[289]')),
            "paginate": {
                "previous": eval(callParent('lcm[163]')),
                "next": eval(callParent('lcm[162]')),
            }
        },
        "autoWidth": false,
        destroy: true,
        scrollY: '250px',
        scrollCollapse: true,
        "order": [[ 1, "asc" ]],
        "columns": [
            {
                'targets': 0,
                'searchable': false,
                'bSortable': false,
                'orderable': false,
                'className': 'dt-body-center',
                'render': function (data, type, full, meta) {
                    return '<input type="checkbox" name="id[]" value="' + $('<div/>').text(data).html() + '">';
                },
                "width": "4%"
            },
            {
                "data": "Name",
                "title": eval(callParent('lcm[224]')),
                "width": "16%"
            },
            {
                "data": "AccessRights",
                "title": eval(callParent('lcm[316]')),
                "width": "80%"
            },
            //{
            //    "data": "Status",
            //    "width": "10%"
            //},
        ]
    })

    dt.on('draw', function () {
        gridDataboundEvent();
    });
    gridDataboundEvent();
    
    
}

var actionsHtml = "", currentStatus="";
function gridDataboundEvent() {
    $("#tblResponsibilities_length").css("float", "right").find("select").addClass("form-control resp-dt-select");
    $("#tblResponsibilities_filter").hide();
    $("#tblResponsibilities_wrapper").css("top", "40px");
    
    // Handle click on "Select all" control
    $('#chkSelectAll').on('click', function () {
        // Get all rows with search applied
        var rows = dt.rows({ 'search': 'applied' }).nodes();
        // Check/uncheck checkboxes for all rows in the table
        $('td input[type="checkbox"]', rows).prop('checked', this.checked);
    });

    var dtRows = $(dt.rows().nodes()).find("input[type='checkbox']")

    // Handle click on checkbox to set state of "Select all" control
    $('#tblResponsibilities tbody').on('change', 'input[type="checkbox"]', function () {
        // If checkbox is not checked
        if (this.checked) {
            var totRowsSelected = $(dt.rows().nodes()).find("input[type='checkbox']:checked").length;
            if (totRowsSelected == dtRows.length)
                $('#chkSelectAll').prop("checked", true);
        }
        else
            $('#chkSelectAll').prop("checked", false);
    });

    // Handle click on "Select all" control
    $('#chkSelectAll').on('click', function () {
        // Get all rows with search applied
        var rows = dt.rows({ 'search': 'applied' }).nodes();
        // Check/uncheck checkboxes for all rows in the table
        $('td input[type="checkbox"]', rows).prop('checked', this.checked);
    });

    //hide Grid Prev & Next buttons if grid records are less than the selected Display records per page
    if ($("#tblResponsibilities_previous").hasClass("disabled") && $("#tblResponsibilities_next").hasClass("disabled"))
        $("#tblResponsibilities_paginate").hide();
    else
        $("#tblResponsibilities_paginate").show();

    $('table tbody tr td').bind('mouseenter', function () {
        var $this = $(this);

        if (this.offsetWidth < this.scrollWidth && !$this.attr('title')) 
            $this.attr('title', $this.text());
    });
}

//to search the grid based on Search by column selection
function gridSearchEvent() {
    $("#txtGridSearch").keyup(function () {
        var selectedColumn = parseInt($("#ddlSearchColumns").val());
        var searchTxt = $("#txtGridSearch").val();
        if (selectedColumn < 0) //search entire grid
            dt.search(searchTxt).draw();
        else
            dt.columns(selectedColumn).search(searchTxt).draw();//search specific column grid
        if (searchTxt.length > 0)//display search icon in the textbox only if text is there in the search box
            $("#searchclear").show();
        else
            $("#searchclear").hide();
        $("#chkSelectAll").attr("checked", false);
        dt.column(0).nodes().to$().each(function (index) {
            $(this).find("input[type='checkbox']").prop("checked", false);
        });
    });
}
