//var stopBlurEvent = false;
function checkResolution() {
    var widthOfWindow = $(window).width();
    if (widthOfWindow <= 1050) {
        $(".closeSidePanel").click();
    }
}



$(document).on('click', '.closeSidePanel', function () {
    $('.closeSidePanel').removeClass('closeSidePanel glyphicon-remove icon-arrows-circle-right').addClass('openSidePanel glyphicon-menu-hamburger icon-arrows-circle-left').attr('title', 'Expand');
    $(".ACmainwrapper .leftPartAC").css({ "width": "35px" });
    $(".ACmainwrapper .rightPartAC").removeClass("minRightPart").addClass("fullRightPart");
    $(".hideInClose").hide();

    setTimeout(function () {
        $("#showMessagesDashBoard").removeClass('sideOpen').addClass('sideclose');
        if (leftMenuWrapper != "") {
            $("#leftVerticalText p").text(leftMenuvText)
        }
        $(".contentToShowOnHide").show();
        setTimeout(function () {
            try {
                frames["middle1"].OnMenuPanelChange("open");
            }
            catch (exception) {
            }
        }, 50)
    }, 200)

});

$(document).on('click', '.openSidePanel', function () {
    $(".menu").addClass('open');
    $(".contentToShowOnHide").hide();
    $('.openSidePanel').removeClass('openSidePanel glyphicon-menu-hamburger icon-arrows-circle-left').addClass('closeSidePanel glyphicon-remove icon-arrows-circle-right').attr('title', 'Collapse');
    $(".ACmainwrapper .leftPartAC").css({ "width": "280px" });
    var id = $("#moduleSelctedVal").val();
    $(".ACmainwrapper .rightPartAC").removeClass("fullRightPart").addClass("minRightPart");
    setTimeout(function () {
        if (leftMenuWrapper == "") {
            $(".hideInClose").show();
            menuSellecter(id);
        }
        else {
            $("#" + leftMenuWrapper).show();
        }
        $("#showMessagesDashBoard").removeClass('sideclose').addClass('sideOpen');
        setTimeout(function () {
            try {
                frames["middle1"].OnMenuPanelChange("close");
            }
            catch (exception) {
            }
        }, 50)
    }, 200)

});


//global search
$(document).on('focus', '#globalSearchinp', function (e) {
    if ($(this).val() == "")
        $("#GSclearBtn").hide();
    else
        $("#GSclearBtn").show();
});
$(document).on('blur', '#globalSearchinp', function (e) {
    if ($(this).val() == "")
        $("#GSclearBtn").hide();
    else
        $("#GSclearBtn").show();
});

$(document).on('keyup', '#globalSearchinp', function () {
    if ($(this).val() == "")
        $("#GSclearBtn").hide();
    else
        $("#GSclearBtn").show();

});

$(document).on('click', '#GSclearBtn', function () {
    $('#globalSearchinp').val("");
    $("#GSclearBtn").hide();

});


var tblSearchData = [];
(function getSearchData() {
    $.ajax({
        url: 'Mainnew.aspx/getGlobalSearchData',
        type: 'POST',
        cache: false,
        async: false,
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            if (data.d != "getting exception in code")
                tblSearchData = $.parseJSON(data.d);
        }
    });
})();
$(document).ready(function (event) {
    createLocalSession();
});