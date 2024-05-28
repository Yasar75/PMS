var logTable;

$(document).ready(function () {

    //to set dialog header dynamically based on language selection
    var modalHeader = eval(callParent("divModalHeader", "id") + ".getElementById('divModalHeader')");
    modalHeader.innerText = eval(callParent('lcm[375]'));

    LoadConfigLog();

    $(".panel-title a").click(function () {
        var expand = $(this).attr('aria-expanded');
        if (expand === "true") {
            $(this).attr("title", "Expand")
        }
        else {
            $(this).attr("title", "Hide")
        }
    });

    // ChangeTheme();

});

function LoadConfigLog() {
    $.ajax({
        type: "POST",
        url: "../aspx/AxpertLogs.aspx/GetConfigLogsHtml",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {
            $("#configLogs .panel-body").append(data.d);
            LoadConfigLogTable();
        }
    });
}

function LoadConfigLogTable() {
    logTable = $('#tblConfigLog').DataTable({
        scrollY: '55vh',
        scrollCollapse: true
    });
    configLogsLoaded = false;
    logTable.column(4).visible(false);
    $('#tblConfigLog').css("width", "100%");

    if ($("#tblConfigLog_filter").length) {
        $("#tblConfigLog_filter").html('<input id="configLogSrch" type="search" class="form-control" placeholder="' + eval(callParent('lcm[350]')) + '..." aria-controls="tblConfigLog">');

        $('#configLogSrch').on('keyup', function () {
            logTable.search(this.value).draw();

            setTimeout(function () {
                $('div.dataTables_scrollHeadInner').css("width", "100%");
                $('.dataTable').css("width", "100%");
                $('table.dataTable tbody th').css("padding", "2px 10px").css("opacity", "0.8");
                $('table.dataTable th, table.dataTable td').css("word-break", "break-all");
            }, 100);
        });
    }

    // Add event listener for opening and closing details
    $('#tblConfigLog tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = logTable.row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
            tr.find(".details-control span").removeClass("icon-arrows-up").addClass("icon-arrows-down").prop('title', eval(callParent('lcm[382]')));
        }
        else {
            // Open this row
            row.child(GetChildRow(row.data())).show();
            tr.addClass('shown');
            tr.find(".details-control span").removeClass("icon-arrows-down").addClass("icon-arrows-up").prop('title', eval(callParent('lcm[383]')));
        }

        $('table.dataTable tbody th').css("padding", "2px 10px").css("opacity", "0.8");
        $('table.dataTable th, table.dataTable td').css("word-break", "break-all");

        SetChildRowHeadings();
    });

    setTimeout(function () {
        $('div.dataTables_scrollHeadInner').css("width", "100%");
        $('.dataTable').css("width", "100%");
        $('table.dataTable tbody th').css("padding", "2px 10px").css("opacity", "0.8");
        $('table.dataTable th, table.dataTable td').css("word-break", "break-all");
    }, 300);

    SetMainHeadings();
}

function GetChildRow(row) {
    var rowHtml = '<table class="childRow" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;width:95%;margin:0 auto;"><tr><th>Field modified</th><th>Old value</th><th>New value</th></tr>';

    if (row[4] != undefined) {
        var changes = row[4].split('♦');
        for (var i = 0; i < changes.length; i++) {
            var data = changes[i].split('♣');
            rowHtml += '<tr><td>' + data[0] + '</td><td>' + data[1] + '</td><td>' + data[2] + '</td></tr>';
        }
    }
    rowHtml += '</table>';
    return rowHtml;
}

function ChangeDir(dir) {
    $("#form1").attr("dir", dir);
}

function ChangeTheme() {
    var theme = "";
    theme = eval(callParent('currentThemeColor'));;
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

function SetMainHeadings() {
    $('table.dataTable th').each(function () {
        var colName = $(this).text();
        switch (colName) {
            case "Modified by":
                $(this).text(eval(callParent('lcm[376]')));
                break;
            case "Modified on":
                $(this).text(eval(callParent('lcm[377]')));
                break;
            case "Other Info":
                $(this).text(eval(callParent('lcm[378]')));
                break;
            default:
                break;
        }

    })
}

function SetChildRowHeadings() {
    $('table.childRow th').each(function () {
        var colName = $(this).text();
        switch (colName) {
            case "Field modified":
                $(this).text(eval(callParent('lcm[379]')));
                break;
            case "Old value":
                $(this).text(eval(callParent('lcm[380]')));
                break;
            case "New value":
                $(this).text(eval(callParent('lcm[381]')));
                break;
            default:
                break;
        }

    })
}