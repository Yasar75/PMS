
function ToHideOrShow() {
    var grdHeight = 0;
    if ($("#dvSql").hasClass("closeSql")) {
        $("#dvSql").removeClass("closeSql");
        grdHeight = $("#dvGrdData").height() - $("#dvSql").height();
        $("#dvGrdData").height(grdHeight + "px");

    }
    else {
        $("#dvSql").addClass("closeSql");
        grdHeight = $("#dvGrdData").height() + $("#dvSql").height();
        $("#dvGrdData").height(grdHeight + "px");
    }
    if ($("#iBtnClick").hasClass("glyphicon glyphicon-minus icon-arrows-minus")) {
        $("#iBtnClick").removeClass("glyphicon glyphicon-minus icon-arrows-minus");
        $("#iBtnClick").addClass("glyphicon glyphicon-plus icon-arrows-plus");
    }
    else {
        $("#iBtnClick").removeClass("glyphicon glyphicon-plus icon-arrows-plus");
        $("#iBtnClick").addClass("glyphicon glyphicon-minus icon-arrows-minus");
    }
}

$j(document).ready(function () {
    checkSuccessAxpertMsg();
});
