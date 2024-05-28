var count = "", keyvalue = "",isFormDirty = false;

$(document).ready(function () {
    ShowDimmer(true);
    if (!parent.isLatestSession()) {//to validate session
        parent.location.href = "../aspx/sess.aspx";
        return;
    }
    ShowDimmer(false);
    //to set dialog header dynamically based on language selection
    modalHeader = eval(callParent("divModalHeader", "id") + ".getElementById('divModalHeader')");
    modalHeader.innerText = eval(callParent('lcm[256]'));

    var key = "";
    var value = "";
    var confirmAction = "";
    // ChangeTheme();
    $("[data-toggle=tooltip]").tooltip();

    bindGridData();
    callCharts();

    $('[data-toggle="popover"],[data-original-title]').popover({
        placement: "right"
    });

    $(document).on('click', function (e) {
        $('[data-toggle="popover"],[data-original-title]').each(function () {
            //the 'is' for buttons that trigger popups
            //the 'has' for icons within a button that triggers a popup
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                $(this).popover('hide').data('bs.popover').inState.click = false // fix for BS 3.3.6
            }

        });
    });

    $("#btnDeleteKey").prop("title", eval(callParent('lcm[286]')));
    $("#btnRefreshKey").prop("title", eval(callParent('lcm[247]')));
    gridSearchEvent()
    $("#txtGridSearch").attr("placeholder", eval(callParent('lcm[287]'))).focus();
    tabFocus("icocl1", "tblFastDataUtility_next"); //bind focus event in the dialog

});

//to check if the form is dirty before closing, true if any changes, false if no changes
function checkIfFormChanges() {
    count = document.getElementById("hfCount").value;
    var gv = document.getElementById("tblFastDataUtility");
    var chk = gv.getElementsByTagName("input");
    if (chk[0].checked) {
        count = "All";
    }
    else {
        for (var i = 0; i < chk.length; i++) {
            if (chk[i].checked && chk[i].id.indexOf("chkAll") == -1) {
                count++;
            }
        }
    }
    if (count!=0)
        isFormDirty = true;
    else
        isFormDirty = false;
    return isFormDirty;
}

//to display Confirm dialog before closing the form only if any changes are there in the form
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
            content: eval(callParent('lcm[285]')),
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

function ShowDimmer(status) {
    DimmerCalled = true;
    var dv = $j("#waitDiv");
    if (dv.length > 0 && dv != undefined) {
        if (status == true) {

            var currentfr = $j("#middle1", parent.document);
            if (currentfr) {
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

//to display Confirm dialog if user clicks on Delete/Refresh button
function confirmDialog(calledFrom) {
    count = document.getElementById("hfCount").value;
    dt.column(0).nodes().to$().each(function (index) {
        if ($(this).find("input[type='checkbox']").prop("checked"))
            count++;
    });
    if (recordCount == 0) {
        showAlertDialog('warning', eval(callParent('lcm[312]')));
        return;
    }
    if (count == recordCount)
        count = "All";

    if (count == 0) {
        showAlertDialog('warning', eval(callParent('lcm[278]')));
        return false;
    }
    else {
        //if all selected then display all confirm msg for refresh/delete
        var alertMsg =  count == "All" ?
                            (calledFrom == "delete" ? eval(callParent('lcm[71]')) : eval(callParent('lcm[70]'))) :
                            (calledFrom == "delete" ? eval(callParent('lcm[277]')) : eval(callParent('lcm[276]')));

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
            content: alertMsg,
            buttons: {
                confirm: {
                    text: eval(callParent('lcm[164]')),
                    btnClass: 'btn btn-primary',
                    action: function () {
                        if (!parent.isLatestSession())//to validate session
                            parent.location.href = "../aspx/sess.aspx"
                        else {
                            ConfirmSaveCB.close();
                            getKeyNameLists();
                            if (calledFrom == "delete")
                                deleteSelectedKeys(count)
                            else
                                refreshSelectedKeys(count);
                        }
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

//to get list of keys selected from the Grid using checkbox & append keys by '&' character
function getKeyNameLists() {
    var checkflag = false;
    keyvalue = "";
    dt.column(1).nodes().to$().each(function (index) {
        if ($(this).siblings().find("input[type='checkbox']").prop("checked"))
            keyvalue += $(this).next().text() + "&";
    });

    keyvalue = keyvalue.substr(0, keyvalue.length - 1);
}

//delete selected keys, if user selected all then call FlushAll method otherwise delete only selected keys
function deleteSelectedKeys(count) {
    ShowDimmer(true);
    var url = "../aspx/FastDataUtility.aspx/" + (count == "All" ? "FlushAll" : "DeleteKeys");
    $.ajax({
        type: "POST",
        url: url,
        contentType: "application/json;charset=utf-8",
        data: '{keylists:"' + keyvalue + '"}',
        dataType: "json",
        success: function (data) {
            if (data.d == "success")
                showAlertDialog('success', eval(callParent('lcm[267]')));
            else
                showAlertDialog('warning', eval(callParent('lcm[268]')));
            bindGridData();
            callCharts();
            keyvalue = "";
        },
        error: function (response) {
            showAlertDialog('warning', eval(callParent('lcm[268]')));
            ShowDimmer(false);
        }
    });
}

//refresh selected keys, if user selected all then call RefereshAll method otherwise refresh only selected keys
function refreshSelectedKeys(count) {
    ShowDimmer(true);
    var url = "../aspx/FastDataUtility.aspx/" + (count == "All" ? "RefereshAll" : "GetRefreshDatasetKeys");
    $.ajax({
        type: "POST",
        url: url,
        contentType: "application/json;charset=utf-8",
        data: '{dtKeylists:"' + keyvalue + '"}',
        dataType: "json",
        success: function (data) {
            if (data.d == "success")
                showAlertDialog('success', eval(callParent('lcm[269]')));
            else
                showAlertDialog('warning', eval(callParent('lcm[270]')));
            bindGridData();
            callCharts();
            keyvalue = "";
        },
        error: function (response) {
            showAlertDialog('warning', eval(callParent('lcm[268]')));
            ShowDimmer(false);
        }
    });
}

//to get Memory details for the selected project/schema
function callCharts() {
    ShowDimmer(true);
    $.ajax({
        type: "POST",
        url: "../aspx/FastDataUtility.aspx/MemoryDetails",
        contentType: "application/json;charset=utf-8",
        data: '{}',
        dataType: "json",
        success: function (data) {
            ShowDimmer(false);
            pieChart(data.d);
            isPostback = false;
        },
        error: function (response) {
            showAlertDialog('warning', eval(callParent('lcm[273]')) + eval(callParent('lcm[274]')));
            ShowDimmer(false);
        }
    });
}

//create a 3D pie chart
function pieChart(datats) {
    try {
        $('#containerChartsPie').highcharts({
            colors: ['#50B432', '#ED561B', '#DDDF00', '#24CBE5'],
            credits: {
                enabled: false
            },
            chart: {
                type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 45,
                    beta: 0
                }
            },
            exporting: { enabled: false },
            legend: {
                layout: 'vertical',
                backgroundColor: '#FFFFFF',
                floating: true,
                align: 'right',
                x: 90,
                y: 0,
                itemStyle: {
                    color: '#FFFFF'
                },
                align: 'right',
                verticalAlign: 'middle'
            },
            title: {
                style: {
                    fontWeight: 'bold',
                    fontSize: '15px'
                },
                text: eval(callParent('lcm[291]'))
            },
            tooltip: {
                shared: true, //headerFormat: '<span style="font-size: 25px;" >{point.key}</span><br/>',
                style: {
                    fontWeight: 'bold',
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    depth: 35,
                    size: 180,
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}'
                    }
                }
            },
            series: [{
                colorByPoint: true,
                name: "Memory details in MB",
                data: JSON.parse(JSON.stringify(JSON.parse(datats)))
            }]
        });
    }
    catch (e) {
        showAlertDialog('warning', eval(callParent('lcm[361]')));
    }
}

//get list of Redis keys for the current project
function bindGridData() {
    ShowDimmer(true);
    $.ajax({
        type: "POST",
        url: "../aspx/FastDataUtility.aspx/BindGridData",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {
            createDataTable(data.d);
            recordCount = data.d.length;
            $("#chkSelectAll").prop("checked", false);
            ShowDimmer(false);
        },
        error: function (response) {
            showAlertDialog('warning', eval(callParent('lcm[273]')) + eval(callParent('lcm[275]'))); ShowDimmer(false);
            ShowDimmer(false);
        }
    });
}

var dt = "", recordCount=0;
//to create a jquery datatable for Redis key's list
function createDataTable(data) {
    dt = $('#tblFastDataUtility').DataTable({
        data: data,
        "dom": '<"left"><"right"l>rt<"bottom"ip><"clear">',
        language: {
            //assign language keys for the datatable options
            "search": "",
            "searchPlaceholder": eval(callParent('lcm[287]')),
            "lengthMenu": eval(callParent('lcm[288]')),
            "zeroRecords": eval(callParent('lcm[0]')),
            "info": eval(callParent('lcm[290]')),
            "infoEmpty":"",
            "infoFiltered": eval(callParent('lcm[289]')),
            "paginate": {
                "previous": eval(callParent('lcm[163]')),
                "next": eval(callParent('lcm[162]')),
            }
        },
        "order": [[2, "asc"]],
        "autoWidth": false,
        destroy: true,
        scrollY: '200px',
        scrollCollapse: true,
        "columns": [
            {
                'targets': 0,
                'searchable': false,
                'bSortable': false,
                'orderable': false,
                'className': 'dt-body-center',
                'render': function (data, type, full, meta) {
                    return '<input type="checkbox" style="margin-left:7px;" name="id[]" value="' + $('<div/>').text(data).html() + '">';
                },
                "width": "4%"
            },
            {
                "data": "Key",
                'bSortable': false,
                'orderable': false,
                "width": "10%"
            },
            {
                "data": "Key",
                "width": "80%"
            },
        ]
    });
    dt.on('order.dt search.dt', function () {
        
    }).on('draw', function () {
        gridDataboundEvent();
    });
    gridDataboundEvent();
    $("#txtGridSearch").val("");

    setTimeout(function () {
        dt.columns.adjust().draw();
    }, 500);

}

//handle tab focus event in current dialog
function tabFocus(firstFocusId, lastFocusId) {
    modalButton = eval(callParent("btnModalClose", "id") + ".getElementById('btnModalClose')");
    if (modalButton.className.indexOf("firstFocusable")==-1)
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
        $("#txtGridSearch").focus();
    }, 500)
}

function ChangeTheme() {
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

function gridDataboundEvent() {
   
    dt.column(1, { search: 'applied' }).nodes().each(function (cell, i) {
        cell.innerHTML = i + 1;
    });
    //$("#tblFastDataUtility_filter").append($("#spnUtilityActions").html());
    //$("#tblFastDataUtility_filter input").addClass("form-control input-sm").width("100%");
    //$("#searchclear").remove();
    //$('<span id="searchclear" class="icon-arrows-remove colorButton" style="display: none" title="Clear"></span>').insertAfter("#tblFastDataUtility_filter input");
   

    //hide Grid Prev & Next buttons if grid records are less than the selected Display records per page
    if ($("#tblFastDataUtility_previous").hasClass("disabled") && $("#tblFastDataUtility_next").hasClass("disabled"))
        $("#tblFastDataUtility_paginate").hide();
    else
        $("#tblFastDataUtility_paginate").show();

    // Handle click on "Select all" control
    $('#chkSelectAll').on('click', function () {
        // Get all rows with search applied
        var rows = dt.rows({ 'search': 'applied' }).nodes();
        // Check/uncheck checkboxes for all rows in the table
        $('td input[type="checkbox"]', rows).prop('checked', this.checked);
    });

    // Handle click on checkbox to set state of "Select all" control
    $('#tblFastDataUtility tbody').on('change', 'input[type="checkbox"]', function () {
        // If checkbox is not checked
        if (!this.checked) {
            var el = $('#chkSelectAll').get(0);
            // If "Select all" control is checked and has 'indeterminate' property
            if (el && el.checked && ('indeterminate' in el)) {
                // Set visual state of "Select all" control
                // as 'indeterminate'
                el.indeterminate = true;
            }
        }
    });
}

//to search the grid based on Search by column selection
function gridSearchEvent() {
    $("#txtGridSearch").keyup(function () {
        $('td input[type="checkbox"], #chkSelectAll').prop('checked', false);
        var searchTxt = $("#txtGridSearch").val();
        $(this).focus();
        dt.search(searchTxt).draw();
        if (searchTxt.length > 0)
            $("#searchclear").show();
        else
            $("#searchclear").hide();
    });

    //grid search - clear icon click - reset the grid
    $("#searchclear").click(function () {
        $("#txtGridSearch").val("").focus();
        dt.search('').columns().search('').draw();
        $(this).hide();
    });
}