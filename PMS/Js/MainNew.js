//getSearchData();
$(document).ready(function (event) {
    $("#homeIcon, #dashBoardIcon, #messagesIcon").on("click", function () {
        $(".wrapperForLeftMenuIcons span").removeClass("active");
        $(this).addClass("active");
    });
    App.init();
    $("#sidemenu-leftt").click();
    loadHome();
    $(".panelsWrapper ").css("display", "none");
    var idOfFrstElem = $(".leftPartAC .hideInClose .dropdown-menu li").first().find("a").attr("id");
    $(".leftPartAC .hideInClose .dropdown-toggle").html((($(".leftPartAC .hideInClose .dropdown-menu li").first().find("a").text())) + "&nbsp;<span class=\"icon-arrows-down\" style=\"margin:0px;position: relative;top: 4px;color:black\"></span><input type='hidden' value='" + idOfFrstElem + "' id='moduleSelctedVal' />");
    $(".leftPartAC .hideInClose .dropdown-toggle").attr("title", ($(".leftPartAC .hideInClose .dropdown-menu li").first().find("a").text()));
    $(".leftPartAC .hideInClose .dropdown-menu li").first().addClass("active");
    $("." + ($(".leftPartAC .hideInClose .dropdown-menu li").first().find("a").attr("id"))).css("display", "block");
    var firstelem = $(".leftPartAC .dropdown-menu li").first().find("a").text();
    $(".contentToShowOnHide .vertical-text").text(firstelem);

    if ($("#hdndashBoardIcon").val() == "t") {
        $("#dashBoardIcon").show();
    }
    else {
        $("#dashBoardIcon").hide();
    }
    if ($("#hdnmessagesIcon").val() == "t") {
        $("#messagesIcon").show();
    }
    else {
        $("#messagesIcon").hide();
    }

    $("#messagesIcon").click(function (event) {
        var topPos = "";
        isCloudApp == "False" ? topPos = $(this)[0].offsetTop + 80 : topPos = $(this)[0].offsetTop + 22;
        $("#showMessagesDashBoard").css({ top: topPos, left: $(this)[0].offsetLeft }).toggle();
    });
    $("#closemsgDshBrd").click(function (event) {
        $("#showMessagesDashBoard").hide();
        $("#messagesIcon").removeClass('active');
        $("#homeIcon").addClass("active");
    });
    $("#messagesIcon").click(function (event) {
        if (!($('#showMessagesDashBoard').is(':visible'))) {
            $("#homeIcon").addClass("active");
            $("#messagesIcon").removeClass('active');
        }
    });

    $("body").click
(
  function (e) {
      if (e.target.className !== "glyphicon glyphicon-comment active") {
          $("#showMessagesDashBoard").hide();
      }
  }
);


    //var uName = '<%= Session["user"] %>';
    //var uOwner = '<%=Session["isowner"] %>'
    if (uName.toLowerCase() == 'admin' || uOwner.toLowerCase() == 'true') {
        $("#ExportImportCogIcon .adminSettings").show();
    }
    else
        $("#ExportImportCogIcon .adminSettings").hide();

    checkResolution();
    if ($(".leftPartAC .dropdown-menu li").length == 0) {
        $(".closeSidePanel").click();
        $("#leftMenuToggleBtn").hide();
        $("#leftVerticalText p").text("No Modules available");
    }
    if (isCloudApp == "True") {
        $(".impExpHis").css({ 'right': '21px', 'top': '12px' });
        $("#dvNonCloudMenu").css("display", "none");
        $("#dvSelectedGlobalVar").css("top", "11px");

        $("#middle1").removeClass("middle1_isNotCloudApp");
        $("#middle1").addClass("middle1_isCloudApp");
        $(".leftPartAC").removeClass("middle1_isNotCloudApp");
        $(".leftPartAC").addClass("middle1_isCloudApp");
        $(".rightPartAC").removeClass("middle1_isNotCloudApp");
        $(".rightPartAC").addClass("middle1_isCloudApp");

        $(".ACmainwrapper").css("margin-top", "0px");
        $("#wrapperForMainNewData").css("top", "52px");
    }
    else {
        $(".impExpHis").css({ 'right': '29px', 'top': '68px' });
        $("#dvNonCloudMenu").css("display", "block");
        $("#dvSelectedGlobalVar").css("top", "73px");
        $("#dvSelectedGlobalVar").addClass("appGlobalParams")
        $("#middle1").removeClass("middle1_isCloudApp");
        $("#middle1").addClass("middle1_isNotCloudApp");
        $(".leftPartAC").removeClass("middle1_isCloudApp");
        $(".leftPartAC").addClass("middle1_isNotCloudApp");
        $(".rightPartAC").removeClass("middle1_isCloudApp");
        $(".rightPartAC").addClass("middle1_isNotCloudApp");

        $(".ACmainwrapper").css("margin-top", "0px");
        $("#exeiddownload").hide();
        $("#li_ConfigApp").hide();
        $("li2").hide();
        $("#wrapperForMainNewData").css("top", "110px");
    }

    $(".hidden767px .dropdown-menu .dropdown-submenu").first().find('a:first').remove();
    //Function call for newsfeed nd events
    //GetNewsfeed();
    //GetEventReminders();
    if ($("#draftsMessage").val() != "") {
        $("#draftmessagedv").css('display', 'block');
    }
    $(".tooltip").fadeOut(10000);
    if (gllangauge == "ARABIC") {
        $('.news_title').css("float", "right");
        $('.insructions_title').css("float", "right");
        $('.morquee').css("float", "right").css("width:80%");
        $('.news_title').prepend('<div class="trr"></div>');
        $('.insructions_title').prepend('<div class="tlr"></div>');
    }
    else {
        $('.news_title').prepend('<div class="tr"></div>');
        $('.insructions_title').prepend('<div class="tl"></div>');
        //Configuration Settings for Admin
        if (uName.toLowerCase() == 'admin') {
            $('#li_ConfigApp').css("display", "block");
            $("li2").show();
        }
    }

    $(".mainParentElements").click(function (e) {
        e.preventDefault();

        $(this).children(".child").toggle(500);
        $(".mainParent").css("border-bottom", "1px solid grey");
        $(this).find(".ar").toggleClass("arrowDown");
        $(this).find(".ar").toggleClass("arrow");

    });
    $("#leftVerticalText p").click(function () {
        $("#leftMenuToggleBtn").is(':visible') ? $("#leftMenuToggleBtn").click() : "";
    });

    makeSearchCenter();
    focusTheParent("#globalSearchinp", ".search-form");
    checkSuccessAxpertMsg();
});
// click on home icone change the Iframe url

function menuSellecter(idd) {
    //alert($("#"+idd).text());
    $(".leftPartAC .hideInClose .dropdown-toggle").html(($("#" + idd).text()) + "&nbsp;<span class=\"icon-arrows-down\" style=\"margin:0px;position: relative;top: 4px;color:black\"></span><input type='hidden' value='" + idd + "' id='moduleSelctedVal' />");
    $(".leftPartAC .hideInClose .dropdown-toggle").attr("title", $("#" + idd).text());
    $(".contentToShowOnHide .vertical-text").html(($("#" + idd).text()));
    $(".panelsWrapper ").css("display", "none");
    $("." + idd).css("display", "block");
    $(".leftPartAC .hideInClose .dropdown-menu li").removeClass("active");
    $(".leftPartAC .hideInClose .dropdown-menu #" + idd).parent().addClass("active");
}



function ChangeUrl(src) {
    var frame = document.getElementById('middle1');
    $('.leftPartAC').css("display", "none");
    $('#dvSelectedGlobalVar').css("display", "none");
    $("#rightDiv").removeClass("rightPartAC");
    //$(".ACmainwrapper .contentForWrapper .rightPartAC").css("width: 100%; margin-left: 0%;");
    frame.src = src;
}

function LoadIframe(src) {
    if (window.globalChange) {
        //isFunctionCalled = true;
        if (confirm(lcm[31])) {
            SetFormDirty(false);
        }
        else {
            //$(".closeSidePanel").click();
            //ShowDimmer(false);
            return;
        }
    } else if ($("#middle1")[0].contentWindow.designChanged != undefined && $("#middle1")[0].contentWindow.designChanged == true) {
        //isFunctionCalled = true;

        if (!confirm(lcm[31]))
            return;
    }
    $("#dvSelectedGlobalVar").show();
    var el = document.getElementById('middle1');
    el.src = "";

    el.src = src;
    if (src.indexOf('ivname') > -1) {
        loadFrame();
    }
    if (src.indexOf('tstruct.aspx') > -1) {
        loadFrame();
    }

    if (!$("#inner-page").is(":visible"))
        $("#inner-page").show();

    if (!$("#inner-page").is(":visible"))
        $("#inner-page").show();

    checkResolution();
    isTstructPopup = false;

    //isFunctionCalled == false ? confCheck() : "";
}
function LoadIframeCharts(src, pvalue) {

    src = "../aspx/ivtstload.aspx?tstname=" + src + "&pusername=" + pvalue + "&hltype=load&torecid=false";
    var el = document.getElementById('middle1');
    el.src = "";
    el.src = src;
}



function openMainDropDown() {
    // body...
    $(".mainParent").toggle();
}


//function loadBlank() {
//    $("#middle1").attr("src", "");
//    $("#inner-page").hide();
//}
function loadHome() {
    if (navigatePage == "") {
        $("#inner-page").hide();
    }
    else {
        $("#inner-page").show();
        $('.leftPartAC').css("display", "block");
        $('#dvSelectedGlobalVar').css("display", "inline-block");
        $("#rightDiv").addClass("rightPartAC");
        $("#middle1").attr("src", navigatePage);
        if (navigatePage == "../Portal/portal.aspx") {
            loadFrame();
        }
    }


}
var AxHelpIview;
function ShowCustomHelp() {
    LoadIframe("iview.aspx?ivname=" + AxHelpIview);
}
var ivname;
function ShowLatestNews(ivname) {
    LoadIframe("iview.aspx?ivname=" + ivname);
}



function loadFrame() {

    $.LoadingOverlay("show");
}

function closeFrame() {

    $.LoadingOverlay("hide", true);
}

function loadConfigPage(src) {

    LoadIframe(src);

}


var cm = null;
document.onclick = new Function("show(null)")

function getPos(el, sProp) {
    var iPos = 0
    while (el != null) {
        iPos += el["offset" + sProp]
        el = el.offsetParent
    }
    return iPos

}

function show(el, m) {
    $(".menu").parent().removeClass("selectedMenuMN")
    $(el).parent().addClass("selectedMenuMN");
    if (m) {
        m.style.display = '';
        m.style.pixelLeft = getPos(el, "Left")
        m.style.pixelTop = getPos(el, "Top") + el.offsetHeight
    }
    if ((m != cm) && (cm)) cm.style.display = 'none'
    cm = m
}

function OnDashboardClick(chtype) {
    $("#middle1").contents().find("#divDetailsLinks .searchField").hide();
    $("#middle1").contents().find("#divDetailsLinks .myPatients").hide();
    $("#middle1").contents().find("#divDetailsLinks").find("." + chtype).show();
    $(".rightPartAC").addClass('isDashBoard');
    setTimeout(function () {
        $(".rightPartAC").removeClass("isDashBoard");
    }, 100);
}




$(".visible767px").click(function (e) {
    e.stopPropagation();
});

function searchLoadIframe(type, src) {
    var loadurl = "";
    if (type.toLowerCase() == "iview") {
        if (src.split('^')[1] == "null")
            loadurl = 'ivtoivload.aspx?ivname=' + src.split('^')[0];
        else
            loadurl = 'ivtoivload.aspx?ivname=' + src.split('^')[0] + src.split('^')[1];
    }
    if (type.toLowerCase() == "tstruct") {
        if (src.split('^')[1] == "null")
            loadurl = 'tstruct.aspx?transid=' + src.split('^')[0];
        else
            loadurl = 'tstruct.aspx?transid=' + src.split('^')[0] + src.split('^')[1];
    }
    if (loadurl != "") {
        resetLeftMenu('fromDashboard');
        LoadIframe(loadurl);
    }

}


//$(document).on("mousedown", "#GSgoBtn", function (e) {
//    try {
//        var txtValue = $("#globalSearchinp").val();
//        var gbGoSearch = [];
//        $(tblSearchData.Table).each(function (iIndex, sElement) {
//            if (sElement.SEARCHTEXT.toLowerCase() == txtValue.toLowerCase()) {
//                gbGoSearch.push(sElement.HLTYPE + "`" + sElement.STRUCTNAME + "^" + sElement.PARAMS);
//            }
//        });
//        if (gbGoSearch.length != 0)
//            searchLoadIframe(gbGoSearch[0].split('`')[0], gbGoSearch[0].split('`')[1]);
//    }
//    catch (exception) {

//    }
//});



$(".visible767px").click(function (e) {
    e.stopPropagation();
});


function makeSearchCenter() {
    //if($("#dvSelectedGlobalVar"))
    var widthOfRightPart = parseInt($("#rightDiv").css('width').replace("px", ""));
    var searchWidth = widthOfRightPart / 2; //here we can change the width of the search
    var topOfRightPart = $("#rightDiv")[0].offsetTop;
    var leftOfRightPart = $("#rightDiv")[0].offsetLeft;
    //var leftOfSearch = leftOfRightPart + ((widthOfRightPart / 2) - (searchWidth / 2));
    var leftOfSearch = ((widthOfRightPart / 2) - (searchWidth / 2));
    //$("#wrapperForSearch .search-form").css({ width: searchWidth + "px", left: leftOfSearch +"px"});
    $("#wrapperForSearch .search-form").addClass('col-md-6 col-md-offset-3 col-lg-6 col-lg-offset-3 col-sm-8 col-sm-offset-2 col-xs-8 col-xs-offset-1');
    var searchHtml = $("#wrapperForSearch").html();
    $("#wrapperForSearch").remove();
    $("#rightDiv").prepend('<div id="wrapperForSearch">' + searchHtml + '<i title="Close" class="closeGLSearch glyphicon glyphicon-remove close icon-arrows-remove" onkeypress="handleKeyPress(event)" onclick="toggleGlobalSearch(\'close\')" tabindex="0"></i><div class="clearfix"></div></div>');
    createAutoComplete();
}
function createAutoComplete() {
    $("#globalSearchinp").autocomplete({
        minLength: 1,
        selectFirst: true,
        autoFocus: true,
        source: function (request, response) {
            var gbSearch = [];
            $(tblSearchData.Table).each(function (iIndex, sElement) {
                if (sElement.SEARCHTEXT.toLowerCase().indexOf(request.term.toLowerCase()) >= 0) {
                    gbSearch.push(sElement.SEARCHTEXT + "~" + sElement.HLTYPE + "`" + sElement.STRUCTNAME + "^" + sElement.PARAMS);
                }
            });
            if (gbSearch.length != 0) {
                response($.map(gbSearch, function (item) {
                    return {
                        label: item.split('~')[0], value: item.split('~')[0], link: item.split('~')[1]
                    }
                }))
            }
            else {
                var result = [{ label: lcm[0], value: response.term, link: "" }];
                response(result);
            }
        },
        open: function (event, ui) {
            var dialog = $(this).closest('.ui-dialog');
            if (dialog.length > 0) {
                $('.ui-autocomplete.ui-front').zIndex(dialog.zIndex() + 1);
            }
        },
        select: function (event, ui) {
            searchLoadIframe(ui.item.link.split('`')[0], ui.item.link.split('`')[1]);
            $("#globalSearchinp").blur();
        }
    });
}

function handleKeyPress(e) {
    var key = e.keyCode || e.which;
    if (key == 13) {
        toggleGlobalSearch('close')();
    }
}
function toggleGlobalSearch(task) {
    if (task == 'open') {
        $("#middle1").addClass('searchOpened');
        if (isCloudApp == "True")
            $("#wrapperForMainNewData").animate({ top: "52px" }, 600);
        else
            $("#wrapperForMainNewData").animate({ top: "110px" }, 600);
        $("#wrapperForSearch").show('slow');
        setTimeout(function () {
            $("#showGLSearch").hide();

        }, 500);

    } else if (task == 'close') {

        if (isCloudApp == "True")
            $("#wrapperForMainNewData").animate({ top: "11px" }, 200);
        else
            $("#wrapperForMainNewData").animate({ top: "68px" }, 200);
        $("#wrapperForSearch").hide('fast');
        setTimeout(function () {
            $('#globalSearchinp').val("");
            $("#GSclearBtn").hide();
            $("#showGLSearch").show();
            $("#middle1").removeClass('searchOpened');
        }, 200);
    }
}

function focusTheParent(presentFld, parentFld) {
    $(document).on('focus', presentFld, function () {
        $(presentFld).parents(parentFld).addClass('focusTheField');
    });
    $(document).on('blur', presentFld, function () {
        $(presentFld).parents(parentFld).removeClass('focusTheField');
    });

}

$(document).on('keydown', '#globalSearchinp', function (e) {
    if (e.keyCode == 13) {
        $("#globalSearchinp").val() == lcm[0] ? $("#globalSearchinp").val("") : "";

        e.preventDefault();
        e.stopPropagation();
    }
});

$(document).on('keydown', '#GSclearBtn', function (e) {
    if (e.keyCode == 13 || e.keyCode == 32) {
        $('#globalSearchinp').val("");
        $("#GSclearBtn").hide();
    }
});
