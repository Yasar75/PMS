$(document).ready(function () {
    var jTbl = $j('#GridView1');
    if (jTbl.find("tbody>tr>th").length > 0) {
        jTbl.find("tbody").before("<thead><tr></tr></thead>");
        jTbl.find("thead:first tr").append(jTbl.find("th"));
        jTbl.find("tbody tr:first").remove();
    }
    // applyCurrentTheme();
    var heightOfDT = $(callParentNew("axpertPopupWrapper")).height() - ($(".adv-dv1").outerHeight() + $(".adv-dv2").outerHeight() + $("#divTitle").outerHeight() +  100);

    oTable = jTbl.DataTable({
        "order": [],
        "scrollX": true,
        "scrollY": heightOfDT + "px",
        "dom": '<"float-end"l>',
        "columnDefs": [{
            "oLanguage": {
                "Search": '<i class="icon-search"></i>',
                "sEmptyTable": "My Custom Message On Empty Table"
            },
            "targets": 'no-sort',
            "orderable": false,
            "bJQueryUI": true,
            "bFilter": false,
            "bInfo": false
        }],
        "bLengthChange": false,
        "bPaginate": false,
        "tabIndex": -1,
        "info": false,
    });
    $j('#txtSrchText').keyup(function () {
        oTable.search($j(this).val()).draw();
    });

    $j("[data-toggle=tooltip]").tooltip();

    $j('[data-toggle="popover"],[data-original-title]').popover();

    $j(document).on('click', function (e) {
        $j('[data-toggle="popover"],[data-original-title]').each(function () {
            if (!$j(this).is(e.target) && $j(this).has(e.target).length === 0 && $j('.popover').has(e.target).length === 0) {
                $j(this).popover('hide').data('bs.popover').inState.click = false // fix for BS 3.3.6
            }

        });
    });

    //var Idnx = $("select[name='ddlSearchFld'] option:selected").index();
    //var dtTpe = $('#ddlDataType option').eq(Idnx).val();
    //enableCondition(dtTpe);


    $("#ddlCondition").change(function () {
        var dllval = this.value;
        if (dllval == "between")
            $("#txtfltbetween").show();
        else
            $("#txtfltbetween").hide();
    });

    if ($("#ddlCondition").val() == "between")
        $("#txtfltbetween").show();
    else
        $("#txtfltbetween").hide();

    $(".table>tbody>tr").keyup(function (event) {
        if (event.keyCode == 13) {
            $(this).click();
        }
    });

    setTimeout(setTabloop, 10);
});


//$(document).on("change", "#ddlCondition", function () {
//    var Idnx = $(this + " option:selected").index();
//    var dtTpe = $('#ddlDataType option').eq(Idnx).val();
//    enableCondition(dtTpe);
//});

function enableCondition(type) {
    alert(type);

}

$(document).on("click", ".clearico", function () {
    var contID = $(this).closest('.profile-pic').children('.form-control').attr("id");
    $("#" + contID).val("");
});

function callserverbtn(btntype) {
    $("#" + btntype).click();
}

$(document).on("keydown.AxpCls", function (e) {
    if (e.keyCode == 27) {
        $(document).off("keydown.AxpCls")
        parent.closeRemodalPopup();
    }
});


function setTabloop() {
    var elemntsToCheck = 'button[tabindex!="-1"],a[tabindex!="-1"],input[tabindex!="-1"],select[tabindex!="-1"],textarea[tabindex!="-1"],table tbody tr[tabindex!="-1"]';
    var inputs = $('#main').find(elemntsToCheck).filter(':visible').not(':disabled');
    var firstInput = inputs.first();
    var lastInput = inputs.last();
    console.log(firstInput);
    console.log(lastInput);
    /*redirect last tab to first input*/
    lastInput.on('keydown', function (e) {
        if ((e.which === 9 && !e.shiftKey)) {
            e.preventDefault();
            firstInput.focus();
        }
    });
    firstInput.on('keydown', function (e) {
        if ((e.which === 9 && e.shiftKey)) {
            e.preventDefault();
            lastInput.focus();
        }
    });
}

function applyCurrentTheme() {
    var theme = eval(callParent('currentThemeColor'));
   // $j("#themecss").attr('href', "../App_Themes/" + theme + "/Stylesheet.min.css?v=23");
    if (theme == "" || theme == undefined) {
        if (window.parent.document)
            theme = $j("#themecss", window.parent.document).attr("href");
        else
            theme = $j("#themecss", window.opener.document).attr("href");
        $j("#themecss").attr("href", theme);
    }
}


