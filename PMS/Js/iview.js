//We are using this js file in iview,listview,Listview & saveas files.
//-----------------------------List of functions in this file--------------------------------------
//ChangeTheme() -Function to change the theme of the page.
//Adjustwin(window)-Adjust the size of parent window according to the current window size
//pgReload()-Function to click the new button from iview ,display the tstruct page. 
//CheckAll() -Function to check all the row once the header row is checked. 
//ChkHdrCheckbox() -Function to check if the header checkbox is checked then check all.  
//-------------------------------------------------------------------------------------------------
var traceSplitChar = "♦";
var traceSplitStr = "♦♦";
var NewTree = new Array();
var arrCheckedFilter = new Array();
var loadPop;
var isSqlPagination;
var parafilterfix = {};
var isDepsProcessed = true;
var formSubmited = false;
var strTimeTaken = "";
var arrcheckedvalues = new Array();
var timePickerSec = false;
var accordionHeight = 0;
var firstTimeScroll = true;
var windowResizer;
var beforeResizeHeight = "";
var ivirColumnTypeObj = ""; //if this variable is empty its not an interactive report
var ivirDataTableApi, ivirDatatable;
var isChkBox = "";
var rowTypeExist = false;
var gl_language = "";
var validateParamOnGo = false;
var isPlDepParBound = false;
var iframeindex = -1;
var HeaderText, ColumnType, FieldName, HideColumn, HideColumnLength, filteredColumns, hiddenColumnIndex, ivComps, ivHeadRows, ivExportHF, ivActions = {}, ivScripts = {}, ivHyperlinks, ivConfigurations, ivSmartViewSettings, ivDatas = [], tstFields = [], ivTemplates = [], ivColDesignJSON = [];
var initAdvFilters = true;
var isPerf = false;
var tableWidth = 0;
var visibleTableWidth = 0;
var minCellWidth = 15;
var listViewCheckBoxSize = 40;
var responsiveColumnWidth = false;
var containsDefaultWidth = false;
var configNavProp = "default";
var enableCardsUi = false;
var isMobile = false;
var cardTemplatingHTML = ``;

var rowRefreshIndex = undefined;

var isCheckedRowRefresh = false;

var lazyBinding = false;

var submittedOnLoad = false;

var showColumnSeparator = false;

var stripedReport = false;

var actionCallFlag = Math.random();
var actionCallbackFlag = actionCallFlag;

var classicView = false;

var recordsExist = false;

var trimIviewData = true;

var resolveAttachmentPath = false;

var viewNavigationData = [];

var cellHeaderConf = {};
var bulkDownloadEnabled = true;

var toolbarHTML = "";

var exportType = "";
var scrollBarWidths = 5;

var loadViewName = "";
var toolbarPinArr = [];
var popupContentcall = false;

var firstTimeParams = "";

var openFilters = false;

var viewLoadedColumns = false;
var viewLoadedSort = false;

var searchHiddenColumnsInReports = false;

var unselectReportRowOnAction = true;

var showChartsWithAllRecords = false;

let isChartCreationOnLoad = false;

let rowOptionsExist = false;
var openFastReportInNewWindow = false;

var splitRatio = "1:1:auto";

var tstFldsRequested = false;

let paramValuesArray = [];
var exportPerf = false;
var pivotCreated = false;
var dtColumns = [];

var currView = "";

var isLnkClicked = false;

var multipleCachedPages = false;

var dtInitalising = false;
var dtInitCompleted = false;

//This function clears the cache files on unload and on opening another iview.
function DeleteIviewCacheFiles() {

    // on unload deletes all existing cached iview files.
    try {

        ASB.WebService.DeleteIviewCacheFiles(iName);
    } catch (ex) { }
}


function SetLnkClick() {
    isLnkClicked = true;
}


function dvToolBarFix() {
    //parafilterfix
    if ($j("#dvToolbar").text() == "" || $j("#dvToolbar").text() == null || $j("#dvToolbar").text() == undefined) {

        $j("#dvToolbar").parent().css("display", "none");
    } else {
        $j("#dvToolbar").parent().css("display", "inline-block");
    }
    if ($j("#FilterValues").text() == "" || $j("#FilterValues").text() == null || $j("#FilterValues").text() == undefined) {
        $j("#dvSelectedFilters").css("display", "none");
    }
}


/**
 * Return Relemnt from multiple elements with data property and its value
 * @author Prashik
 * @Date   2019-04-11T10:27:23+0530
 * @param  {string}                 prop : data property name
 * @param  {string}                 val  : data property value
 * @return {object}                      : filtered element
 */
$.fn.filterByData = function (prop, val) {
    var $self = this;
    if (typeof val === 'undefined') {
        return $self.filter(
            function () { return typeof $(this).data(prop) !== 'undefined'; }
        );
    }
    return $self.filter(
        function () { return $(this).data(prop) == val; }
    );
};

$.fn.single_double_click = function (single_click_callback, double_click_callback, timeout) {
    return this.each(function () {
        var clicks = 0,
            self = this;
        $(this).on("click", function (event) {
            clicks++;
            if (clicks == 1) {
                setTimeout(function () {
                    if (clicks == 1) {
                        single_click_callback.call(self, event);
                    } else {
                        double_click_callback.call(self, event);
                    }
                    clicks = 0;
                }, timeout || 300);
            }
        });
    });
}

/**
 * delay any callback by some interval while continous event
 * @author Prashik
 * @Date   2019-02-28T15:12:10+0530
 * @param  {function}               callback    callback function
 * @param  {int}                 ms         delay time in milliseconds
 */
    function delay(callback, ms) {
    var timer = 0;
    return function () {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            callback.apply(context, args);
        }, ms || 0);
    };
}

/**
 * page load callback function trigerred from c# for an update panel's postback and not of postback page loads and should be used instead of $(document).ready() function since that won't call on postback
 * @author Prashik
 * @Date   2019-04-11T10:31:38+0530
 */
function pageLoad(sender, args) {
    if ($("#hdnbElapsTimeGo").val() != "") {
        let paramSearchRespons = $("#hdnbElapsTimeGo").val();
        requestProcess_logtime = paramSearchRespons.split('♠')[1];
        serverprocesstime = paramSearchRespons.split('♠')[0];
        WireElapsTime(serverprocesstime, requestProcess_logtime, true);
    }
    else {
        WireElapsTime(serverprocesstime, requestProcess_logtime);
    }

    showParam = true;

    try {
        pageLoadIvHook();
    } catch (ex) { }

    if (typeof appGlobalVarsObject == "undefined") {
        appGlobalVarsObject = callParentNew("appGlobalVarsObject");
    }

    isMobile = isMobileDevice();

    isMobile && $("body").addClass("isMobile");

    enableCardsUi = enableCardsUi || isMobile;

    requestJSON && $("body").addClass("requestJSON");

    // requestJSON && iviewButtonStyle == "old" && $("body").addClass("requestJsonOldUi");

    inputControlType == "border" && $("body").addClass("borderInput");

    exportType = redisLoadType;

    constructToolbar();

    $(".animationLoading").show();
    $("#dvSqlPages").show();
    $("#nextPrevBtns").hide();

    if (typeof capturedButton1Submit != "undefined" && capturedButton1Submit == true) {
        capturedButton1Submit = false;
        $("#button1").click();
        return;
    }

    if (typeof totRowCount != "undefined" && totRowCount != "" && $("#getIviewRecordCountVal").length > 0) {
        $("#lblNoOfRecs").html(" of " + totRowCount);
    }

    if (!$("#tasks").parent('li').hasClass('dropdown-submenu')) {
        $("#tasks").html(callParentNew('lcm')[407] + " " + "<span class='menu-arrow'></span>").prop({ 'title': callParentNew('lcm')[407] });
        try {
            KTMenu?.init();
        } catch (error) {}
    }
    else {

    }
    $(".print").prop({ 'title': callParentNew('lcm')[408] }).text(callParentNew('lcm')[408]);

    if (requestJSON && iviewButtonStyle != "old") {
        $("#ivInSearchInput").attr({ 'placeholder': callParentNew('lcm')[287] });
    } else {
        $("#ivInSearchInput").attr({ 'placeholder': callParentNew('lcm')[415] });
    }

    /**
     * Entry point for initializing jquery Datatable
     * @author Prashik
     * @Date   2019-04-11T10:40:40+0530
     */
        var iVData = $("#hdnIViewData").val();
        if (iVData != "") {
            try {
                if (iVData) {
                    createIvir(iVData);
                    try {
                        nxtScrollSize = ivDatas.length;//100; //default record size for datatable initilization
                        defaultRecsPerPage = 100; //fetch size value
                        dtTotalRecords = getDtRecordCount();
                        checkIfNextDBRowsExist(true);

                    } catch (ex) {
                        console.log(ex.message);
                    }

                } else {
                    showParamsPlaceholder();
                    checkIfNextDBRowsExist(true);
                }
            } catch (e) {

            }
        } else {
            showParamsPlaceholder();
            checkIfNextDBRowsExist(true);
        }

    if (!ivConfigurations && typeof globalIvConfigurations != "undefined" && globalIvConfigurations) {
        try {
            ivConfigurations = globalIvConfigurations.configurations.config.length == undefined ? [globalIvConfigurations.configurations.config] : globalIvConfigurations.configurations.config;
            processIvConfiguration(ivConfigurations);
        } catch (ex) { }
    }


    if (document.title == "Iview" && $("table#GridView1").length != 0) {
        if (ivirColumnTypeObj != "") {

            $("table#GridView1").removeAttr('cellspacing rules border style');
            $("table#GridView1").addClass('table table-row-bordered ms-0 ivirMainGrid ');
            if (stripedReport || appGlobalVarsObject?._CONSTANTS?.window?.getSessionValue?.("AxShowStripedReport") == "true") {
                $("table#GridView1").addClass("table-striped");
            }

            $("#ivContainer").addClass("interactiveReport");
            $(".iviewTableWrapper").addClass('interactiveReportWrapper');
            if (requestJSON && iviewButtonStyle != "old") {
                $(".iviewTableWrapper").addClass('iviewTableWrapperNew');
            }
        }
    }

    if (requestJSON && iviewButtonStyle == "modern") {
        $("body").addClass("modernButtonOptions");
    }

    $('#Filterscollapse').on('shown.bs.collapse', function () {
        $("#myFilters").removeClass("disabled");
        $("#searchBar").find(".ccolapsee").removeClass("glyphicon-plus icon-arrows-plus").addClass("glyphicon-minus icon-arrows-minus");
        $("#accordion").addClass("shadow").css({"top": `${$(".toolbar").outerHeight(true)}px`});
    }).on('hidden.bs.collapse', function () {
        $("#myFilters").removeClass("disabled");
        $("#searchBar").find(".ccolapsee").removeClass("glyphicon-minus icon-arrows-minus").addClass("glyphicon-plus icon-arrows-plus");
        $("#accordion").addClass("shadow").css({"top": `${$(".toolbar").outerHeight(true)}px`});
    });
    if (ivirColumnTypeObj == "") {
        $('#Filterscollapse').off('show.bs.collapse').off('hide.bs.collapse');
        $('#Filterscollapse').on('show.bs.collapse', function () {
            if ($("#myFilters").hasClass("disabled")) {
                return;
            }
            $("#myFilters").addClass("disabled");
            $("#accordion").removeClass("shadow");
        }).on('hide.bs.collapse', function () {
            if ($("#myFilters").hasClass("disabled")) {
                return;
            }
            $("#myFilters").addClass("disabled");
            $("#accordion").removeClass("shadow");
        });

    }
    if (document.title == "Iview") {
        timePickerSecChecker();

        $(window).resize(delay(function () {
            setSmartViewHeight();
            setPinedIconContainerWidth();
        }, 100));
    }

    $("#lnkPrev").single_double_click(function (e) {
        EnablePageDimmer(e);
    }, function (e) {
        EnablePageDimmer(e);
        return;
    });

    $("#lnkNext").single_double_click(function (e) {
        EnablePageDimmer(e);
    }, function (e) {
        EnablePageDimmer(e);
        return;
    });

    FocusOnFirstFieldParam();

    $("a").keyup(function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (event.keyCode == 13) {
            $(this).click();
        }
    });

    if (!$("#nextPrevBtns").is(":visible") && document.title.toLowerCase() == "iview") {

        classicView = false;

        $("#chkall").attr("onclick", "javascript:CheckAll()");
        $("input[name=chkItem]:checkbox").attr("onclick", "javascript:ChkHdrCheckbox();");
    } else {
        classicView = true;
        $("#chkall").attr("onclick", "javascript:CheckAll()");
        $("input[name=chkItem]:checkbox").attr("onclick", "javascript:ChkHdrCheckbox();");
    }

    $("#recPerPage").click(function () {
        lastSelRecPerPage = $("#recPerPage option:selected");
    });

    if (ivirColumnTypeObj == "") {

        scrollCloneHeader();
        var maxTimeWaitCloneHeader = 2000; // 2 seconds
        var timeWaitCloneHeader = 0;

        var interval = setInterval(function () {
            if ($('.gridData.clonedHtml thead').is(':visible')) {
                //  Clone Header visible
                checkHeightOfTable();
                clearInterval(interval);
            } else {
                if (timeWaitCloneHeader > maxTimeWaitCloneHeader) {
                    clearInterval(interval);
                    return;
                }
                timeWaitCloneHeader += 100;
            }
        }, 200);

        if (!submittedOnLoad && $("#hdnIsParaVisible").val() != "hidden") {
            $(".animationLoading").hide();
        }
    } else {
        if ($(ivirTable).length > 0) {

            try {
                /**
                 * @description : axAttachExternalCustomPlugin hook function is used to render data using external plugins / implementation
                 * @author Prashik
                 * @date 2020-01-09
                 * @param {*} ivDatas               :   complete iview data json
                 * @param {string[]} FieldName      :   column name unique identifier
                 * @param {string[]} HeaderText     :   column caption
                 * @param {string[]} ColumnType     :   column type c/n/d
                 * @param {bool string[]} HideColumn:   column hidden or not
                 * @param {bool} isChkBox           :   check is enabled or not
                 * @param {int[]} filteredColumns   :   visible column index
                 * @param {int[]} hiddenColumnIndex :   hidden column index
                 * @param {json} ivConfigurations   :   iview advance settings configurations as json
                 * @additionalConfigurations
                    * Iview PageSize/Fetch Size to be set to 0
                    * Dependent css and js files to be loaded from custom.cs
                 */
                axAttachExternalCustomPlugin(ivDatas, FieldName, HeaderText, ColumnType, HideColumn, isChkBox, filteredColumns, hiddenColumnIndex, ivConfigurations);
                $(".animationLoading").hide();
            } catch (ex) {
                if (requestJSON) {
                    var tempWebServiceViewName = $("#hdnWebServiceViewName").val();
                    if (tempWebServiceViewName) {
                        loadViewName = tempWebServiceViewName;

                        if ($(`#viewTabs li a#${loadViewName}`).length > 0) {
                            $("#viewTabs li a").removeClass("active");
                            $(`#viewTabs li a#${loadViewName}`).addClass("active");
                        }

                        $("#hdnWebServiceViewName").val("");
                    }

                    getSavedConditionsNew(loadViewName, mergerSmartviewSettings(ivSmartViewSettings && !$.isEmptyObject(ivSmartViewSettings) && JSON.stringify(ivSmartViewSettings) || ""));
                }
                else {
                    getSavedConditions();
                }
            }

        } else {
            $(".animationLoading").hide();
        }
    }

    typeof axAttachExternalCustomPlugin != "undefined" ? $("table#GridView1").hide() : $("table#GridView1").show();


    /**
     * search callback function for gridview
     * @author Prashik
     * @Date   2019-02-28T15:14:27+0530
     * @param  {object}                 e   : event object
     */
    var searchCallBack = function (e) {
        if (typeof ivirDataTableApi == "undefined") {
            //is classic iview
            var value = $(this).val().toLowerCase();
            $("#GridView1 tbody tr[role=row]").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        } else {
            ivirDataTableApi.search('').columns().search('').draw();
            ivirDataTableApi.search($(this).val()).draw();
        }
    }

    $("#ivInSearchInput").on("input", delay(searchCallBack, 500)).on('blur', function (e) {
        if (requestJSON && iviewButtonStyle != "old") {
            if(!$(e.relatedTarget).is($("#ivInSearchInputButton"))){
                $('.searchBoxChildContainer').addClass('d-none');
                $('#idsearch').removeClass('fa-remove');
                $("#idsearch").off("click.searchExpandCollapse");
                setTimeout(() => {
                    $("#idsearch").on("click.searchExpandCollapse", searchExpandCollapse);
                }, 500);
                e.preventDefault();
                e.stopPropagation();
            }
        }
    }).on("mouseover", function () {
        $(this).focus()
    });

    if (requestJSON && iviewButtonStyle != "old") {
        $("#idsearch").on("click.searchExpandCollapse", searchExpandCollapse);
    }

    $("#ivInSearchInputButton").on("click", function(e){
        e.preventDefault();
        e.stopPropagation();

        $("#ivInSearchInputButtonLoader").removeClass("d-none");

        // ShowDimmer(true);
        setTimeout(function () {
            setTimeout(() => {
                $("#ivInSearchInput").focus();
                getNextDtRecords(0);
            }, 0);
        }, 100);
    });

    function searchExpandCollapse(e) {
        if ($('#idsearch').hasClass('fa-remove')) {
            $('#idsearch').removeClass('fa-remove');
        } else {
            $('#idsearch').addClass('fa-remove');
            $("#ivInSearchInput").focus();
        }
        e.stopPropagation();
        e.preventDefault();
    }

    if (document.title == "Iview") {
        if (!showParam || recordsExist || dataFetched) {
            $("#accordion").removeClass("shadow");
            $('#myFilters').addClass("collapsed").attr("aria-expanded", "false");
            $('#Filterscollapse').removeClass("in show").attr("aria-expanded", "false");
        } else {
            $("#accordion").addClass("shadow").css({"top": `${$(".toolbar").outerHeight(true)}px`});
            $('#myFilters').removeClass("collapsed").attr("aria-expanded", "true");
            $('#Filterscollapse').addClass("in show").attr("aria-expanded", "true");
        }
    }

    if(!dtInitalising && !dotNetSubmit){
        $("body").removeClass("stay-page-loading");
        ShowDimmer(false);
    }

    if (breadCrumbStr) {
        var pageCaption = document.getElementsByClassName("page-caption")[0].innerText;
        $("#breadcrumb .breadcrumb").length > 0 && $("#breadcrumb .breadcrumb").remove();
        $("#breadcrumb").append(`<ul class="breadcrumb fw-bold fs-base mb-1">
            <li class="breadcrumb-item text-muted">
                ${breadCrumbStr.slice(0, breadCrumbStr.length - 3)}
            </li>
            <li class="breadcrumb-item text-dark">
                ${pageCaption}
            </li>
        </ul>`);
    }

    if (requestJSON == true && iviewButtonStyle != "old") {
        // $("#rowsTxtCountNew").append($('#rowsTxtCount').detach().html());
        // $("#ivInSearch").append($("#searchBar").detach());


        $("#iconsNew .right").off("click.subMenu", '.dropdown-submenu a').on("click.subMenu", '.dropdown-submenu a', function (e) {
            var $not = $(this).next('ul');
            $.each($("#iconsUl ul").not($not), function (i, val) {
                if ($(val).is(':visible')) {
                    $(val).hide();
                }
            });
            $(this).next('ul').toggle();


            e.stopPropagation();
            e.preventDefault();
        });

        $('#iconsNew .right.dropdown').off("click.menu").on("click.menu", function (e) {
            if (isMobile) {
                $('.pinIcon, .iconUIPin').hide();
            }
            if ($(this).hasClass("open")) {
                $(this).find(".dropdown-submenu ul.dropdown-menu").hide();
            }
        });


        $('.dropdown-submenu').off("click", 'span.pinIcon, span.iconUIPin').on("click", 'span.pinIcon, span.iconUIPin', function (e) {

            var item = $(this).parents('li');

            if ($(item).hasClass('pinned')) {
                if ($(item).attr('id')) {
                    $('#pinned' + $(item).attr('id')).remove();

                    toolbarPinArr.splice(toolbarPinArr.indexOf($(item).attr('id')), 1);
                }
                else {
                    var name = $(item).children('a').attr('id');
                    $('#pinnediconsUl').find('a#pinned' + name).parent('li').remove();

                    toolbarPinArr.splice(toolbarPinArr.indexOf(name), 1);
                }
                $(item).removeClass('pinned');

                $(this).attr("title", "Pin to taskbar");
            }
            else {
                pinItemToTaskbar(item);
                if ($(item).attr('id')) {
                    toolbarPinArr.push($(item).attr('id'));
                }
                else {
                    toolbarPinArr.push($(item).children('a').attr('id'));
                }
                $(item).addClass('pinned')
                $(this).attr("title", "Unpin from taskbar");
            }

            ivirMainViewObj["toolbarPin"] = [...new Set(toolbarPinArr)];

            SaveSmartviewJsonToDb("set", JSON.stringify(ivirMainViewObj), callParentNew("mainUserName"), "");

            e.stopPropagation();
            e.preventDefault();
        });
        $(window).on('resize', function (e) {
            if ($('#viewTabs li').length) {
                reAdjust();
            }
        });
        $('.scroller-right').single_double_click(function (e) {
            scrollerRightClick();
        }, function (e) {
            scrollerRightClick();
        });

        $('.scroller-left').single_double_click(function (e) {
            scrollerLeftClick();
        }, function (e) {
            scrollerLeftClick();
        });
    }

    $("select.trySelect").select2({
        placeholder: appGlobalVarsObject.lcm[441],
        allowClear: true
    });

    try {
        createPlSmartSelect(".trySelectPl");

        createMsSmartSelect(".trySelectMs");
    } catch (error) { }

    $('#dvSelectedFilters, .tooltiptext').click(function () {
        $('#Filterscollapse').collapse("toggle");
    });

    try {
        KTMenu?.init();
        KTApp?.initBootstrapTooltips();
    } catch (error) { }

    setSmartViewHeight();
    if ($("#hdnbElapsTimeGo").val() != "") {
        GetProcessTime();
        GetTotalElapsTime();
        $("#hdnbElapsTimeGo").val('');
    }

    $("#dvRefreshParamIcon").off("click").on("click", refreshIview);

    $(".btn.btn-icon").addClass("btn-sm").find(".material-icons").addClass("material-icons-style material-icons-2");
}


window.onbeforeunload = BeforeWindowClose;
function BeforeWindowClose() {
}


/**
 * generate params XML node for webservice call
 * @author Prashik
 * @Date   2019-04-11T10:38:57+0530
 * @return {string}                 : params XML node for webservice call
 */
function generateParamX() {
    var paramString = $("#hdnparamValues").val();
    var splitParamString = "";
    var returnParamX = "";
    if (typeof paramString != "undefined" && paramString != "") {
        splitParamString = paramString.replace(/¿/g, '♣').split('♣');


        var i = 0;
        $("#param").val("");
        for (i = 0; i <= splitParamString.length - 1; i++) {
            if (splitParamString[i] != "") {
                var arrparam = splitParamString[i].toString().split('~');
                var pName = CheckSpecialCharsInJson(arrparam[0].toString());
                var pValue = CheckSpecialCharsInJson(arrparam[1].toString());
                if (pValue.indexOf("&amp;grave;") >= 0) {
                    pValue = pValue.replace(/&amp;grave;/g, '~');
                }
                returnParamX = returnParamX + "<" + pName + ">";
                returnParamX = returnParamX + pValue;
                returnParamX = returnParamX + "</" + pName + ">";

                pValue = pValue.replace(/~/g, '&grave;');
                if ($("#param").val() != "") {
                    $("#param").val($("#param").val() + "~" + pName + "♠" + pValue);
                }
                else {
                    $("#param").val(pName + "♠" + pValue);
                }
            }
        }

    }
    return returnParamX;

}

function onRecPerPageChange(event) {
    if ($("#recPerPage").val() == "0" && allowRecPerPageChange == false) {
        lastSelRecPerPage.prop("selected", true);

        var glType = callParentNew('gllangType');
        var isRTL = glType == "ar" ? true : false;
        var ConfirmDeleteCB = $.confirm({
            theme: 'modern',
            title: appGlobalVarsObject.lcm[155],
            onContentReady: function () {
                disableBackDrop('bind');
            },
            backgroundDismiss: 'false',
            rtl: isRTL,
            escapeKey: 'buttonB',
            content: appGlobalVarsObject.lcm[390],
            buttons: {
                buttonA: {
                    text: appGlobalVarsObject.lcm[282],
                    btnClass: 'btn btn-primary',
                    action: function () {
                        ConfirmDeleteCB.close();
                        ShowDimmer(true);
                        $("#recPerPage option[value=0]").prop("selected", true);
                        allowRecPerPageChange = true;

                        setTimeout('__doPostBack(\'recPerPage\',\'\')', 0);
                    }
                },
                buttonB: {
                    text: appGlobalVarsObject.lcm[192],
                    btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                    action: function () {
                        disableBackDrop('destroy');
                        allowRecPerPageChange = false;
                        ShowDimmer(false);
                        return;
                    }
                }
            }
        });

        allowRecPerPageChange = false;
        return false;
    } else {
        setTimeout('__doPostBack(\'recPerPage\',\'\')', 0);
    }
    allowRecPerPageChange = false;

    return true;
}


/**
 * get records count for iview dynamically from webservice
 * @author Prashik
 * @Date   2019-04-11T10:40:40+0530
 */
function getIviewRecordCount() {
    try {
        if (totRowCount == "" && $("#getIviewRecordCountVal").length > 0) {
            $("#getIviewRecordCountVal").addClass("fa-spin");
            ASB.WebService.GetIviewRecordCount(iName, $j("#hdnparamValues").val(), isListView, function (e, t) {
                //Success
                if (e.indexOf("<totalrows>") == 0) {
                    var closingIndex = e.indexOf("</totalrows>");
                    closingIndex = closingIndex > -1 ? closingIndex : e.length;
                    totRowCount = parseInt(e.substring("<totalrows>".length, closingIndex), 10);
                    $("#lblNoOfRecs").html(" " + totRowCount);

                } else {

                }
                $("#getIviewRecordCountVal").addClass("d-none");
            }, function (e) {
                //Failure
                $("#getIviewRecordCountVal").addClass("d-none");
            });
        }
    } catch (ex) {
        $("#getIviewRecordCountVal").addClass("d-none");
        console.log(ex.message);
    }
}

function timePickerSecChecker() {
    //For time picker expression to enable seconds should be given in format as {HH:mm:ss} all numeric equivalent to {00:00:00} or to disable seconds it should be given as {HH:mm} all numeric equivalent to {00:00}
    if (timePickerSec == false) {
        for (var j = 0; j < parentArr.length; j++) {
            if (typeof (Expressions[j]) == "string" && Expressions[j] != "" && Expressions[j].charAt(0) == "{" && Expressions[j].charAt(Expressions[j].length - 1) == "}" && (Expressions[j]).indexOf(":") > -1) {
                var expTime = (Expressions[j]).slice(1, -1).split(':');
                expTime.forEach(function (value, i) {

                    if (!isNaN(value)) {
                        if (i == (expTime.length - 1) && expTime.length == 3) {
                            timePickerSec = true;
                            return;
                        }
                    }
                });
            }
        }
    }
}

function checkHeightOfTable() {
    if ($("#Filterscollapse").hasClass("in")) {
        $("#searchBar").find(".ccolapsee").addClass("glyphicon-minus icon-arrows-minus");
        iviewTableWrapperHeightFix();
    } else {
        $("#searchBar").find(".ccolapsee").addClass("glyphicon-plus icon-arrows-plus");
        iviewTableWrapperHeightFix();
    }
}

function cloneTheGridHeader(isClowningNotDone, setTopOfClone) {
    if (isClowningNotDone && $('.gridData.clonedHtml').length == 0) {
        var theadHtml = "<table class='gridData clonedHtml'>";
        theadHtml += "<thead>";
        theadHtml += $(".gridData thead").html();
        theadHtml += "</thead>";
        theadHtml += "</table>";
        $(theadHtml).insertBefore($(".gridData"));
    }
    if (document.title.toLowerCase() == "iview") {
        $(".iviewTableWrapper .dvContent").css("width", "100%");
    }
    if (document.title.toLowerCase() == "list iview") {
        $(".iviewTableWrapper .pnlgrid").css("width", "100%");
    }

    $(".gridData:not('.clonedHtml') thead th").each(function (index, el) {
        var widthOfTh = $(this).outerWidth();
        $(".gridData.clonedHtml thead th").eq(index).css({ "width": widthOfTh, "max-width": widthOfTh });
    });


    var widthOFGrid = $(".gridData:not('.clonedHtml')").outerWidth();
    $(".gridData.clonedHtml").css({ "width": widthOFGrid, "min-width": widthOFGrid });
    if (document.title.toLowerCase() == "iview")
        $(".iviewTableWrapper .dvContent").css("width", widthOFGrid);
    if (document.title.toLowerCase() == "list iview")
        $(".iviewTableWrapper .pnlgrid").css("width", widthOFGrid);
    $(".gridData:not('.clonedHtml') thead").css("visibility", "hidden");


    try {
        if (!isNaN(parseInt($(".gridData:not('.clonedHtml')").css('top')))) {
        }
    } catch (ex) { }

}

function scrollCloneHeader() {

    var content = $j(".iviewTableWrapper");

    var headers = $j(".gridData.clonedHtml");
    //gridDc-gridHd
    content.scroll(function () {
        var leftScrolled;
        var isDirectionRtl = $("body").hasClass("btextDir-rtl");
        leftScrolled = 0 - content.scrollLeft();
        if (isDirectionRtl) {
            if (jQuery.browser.msie) {
                var scrollElem = ".dvContent";
                if (document.title == "List IView") {
                    scrollElem = "#Panel2";
                }
                var wdth = content.outerWidth();
                wdth = $j(scrollElem).outerWidth() - wdth;
                leftScrolled = -wdth - leftScrolled;
            } else {
                var scrollElem = ".dvContent";
                if (document.title == "List IView") {
                    scrollElem = "#divLContainer";
                }
                if ($(".iviewTableWrapper").outerHeight() <= $(scrollElem).outerHeight())
                    leftScrolled = leftScrolled + 16;
            }
        }
        headers.css("left", leftScrolled + "px");

    });
}

function FocusOnFirstFieldParam(focusIndex) {
    var paramFocused = false;
    if ($("#Filterscollapse").hasClass("in")) {
        if (focusIndex == undefined) {
            focusIndex = 0;
        }
        var focusObj;
        focusObj = $j("#myFiltersBody").find(':input[type!="hidden"]:input[type!="submit"],textarea,select').filter(":visible:enabled").eq(focusIndex);
        if (focusObj.hasClass("date") && focusObj.val() == "") {
            if (focusObj.length > 0) {
                focusObj.focus();
                paramFocused = true;
            }
        } else if (!focusObj.hasClass("date")) {
            if (focusObj.length > 0) {
                focusObj.focus();
                paramFocused = true;
            }
        } else {
            FocusOnFirstFieldParam(focusIndex + 1);
        }
    } else {
        FocusOnFirstFieldIView();
    }
    if (!paramFocused) {
        FocusOnFirstFieldIView();
    }
}

function FocusOnFirstFieldIView() {
    var objId = ".gridData";
    if ($j(objId).length > 0) {
        var focusObj;
        focusObj = $j(".gridData").find(':input[type="checkbox"],a').first();
        if (focusObj.length > 0) {
            focusObj.focus();
        }
    }
}

function iviewTableWrapperHeightFix() {
    if (($("#accordion").height()) > accordionHeight) {
        accordionHeight = $("#accordion").height();
    }

    if (ivirColumnTypeObj == "") {
        if (!$(".iviewTableWrapper").hasClass('marginSetted')) {

            $(".iviewTableWrapper").addClass('marginSetted');
            var heightOfSubHeader = $("#ivCap1").outerHeight(true) || 0;

            $(".iviewTableWrapper").css({ "overflow": "auto" });
        }
    }
    adjustRecordsHeight();
}

function adjustRecordsHeight() {
    try {
        var el = $(".iviewTableWrapper")[0];
        var top = el.offsetTop;
        var left = el.offsetLeft;
        var width = el.offsetWidth;
        var height = el.offsetHeight;
        var heightDifference = 0;

        while (el.offsetParent) {
            el = el.offsetParent;
            top += el.offsetTop;
            left += el.offsetLeft;
        }

        if ((top + height) > ($(window).height() + window.pageYOffset)) {
            heightDifference = (top + height) - ($(window).height() + window.pageYOffset);
            $(".iviewTableWrapper").css("height", ($(".iviewTableWrapper").outerHeight() - heightDifference) + "px");
        } else if ((top + height) <= ($(window).height() + window.pageYOffset)) {
            heightDifference = ($(window).height() + window.pageYOffset) - (top + height);
            $(".iviewTableWrapper").css("height", ($(".iviewTableWrapper").outerHeight() + heightDifference) + "px");
        }
        $("#noRecccord").css("height", ($(window).height() - top) + "px");
        if (ivirColumnTypeObj == "") {

        }
    } catch (ex) { }
}

var pickStatus = true;

$(document).ready(function () {

    let isDisabledSplit = ``;

    if (ivConfigurations) {
        try {
            isDisabledSplit = getCaseInSensitiveJsonProperty(ivConfigurations.filter((val, ind) => {
                var thisVal = getCaseInSensitiveJsonProperty(val, "PROPS");
                return thisVal && thisVal.toString() && thisVal.toString().toLowerCase() == "disablesplit"
            })[0], ["PROPSVAL"]).toString();
        } catch (ex) { }
    } else {
        isDisabledSplit = $("#hdnDisableSplit").val();
    }

    if (!isMobile && iName != "inmemdb" && !isIviewPopup) {
        if (isDisabledSplit != undefined && isDisabledSplit.toLowerCase() == "false") {
            $(callParentNew("split-btn", "class")).css({ "display": "" }).removeClass("d-none");
            $(callParentNew("split-btn-vertical", "class")).css({ "display": "" }).removeClass("d-none");
        }
        else if (isDisabledSplit != undefined && isDisabledSplit.toLowerCase() == "true") {
            $(callParentNew("splitIcon", "id")).addClass("d-none");
            $(callParentNew("spiltHeading", "class")).addClass("d-none");
        }
        else if (isDisabledSplit != undefined && isDisabledSplit.toLowerCase() == "") {
            $(callParentNew("splitIcon", "id")).css({ "display": "" }).removeClass("d-none");
            $(callParentNew("spiltHeading", "class")).css({ "display": "" }).removeClass("d-none");
        }
    }
    $(document).delegate("#myFilters", "click", function () {
        checkSuccessAxpertMsg();
    });

    window.parent.AxIvFilterMinHeader = new Array();
    if (document.title == "Iview") {
        GetUserLocale();
        AddDatePicker();
        AddTimePicker();
        //To pass parameter for drilldown iview
        if ($("#hdnparamValues").val().indexOf("¿") > -1) {
            SetParamValues($("#hdnparamValues").val());
        }

        //for popup back forward buttons will not be availabe
        if (window.opener && !window.opener.closed && $j(".backbutton").length > 0) {
            $(".backbutton").children().hide();
        }
    }
    if (document.title != "Save As") {
        load();
    }
    if (document.title == "List IView") {
        CallLViewFunctions();
        $("#showRecDetails").show();

        if ($j("#hdnListViewName").val() == "") {
            Adjustwin();
        }
    } else {
        Adjustwin();
    }
    if (gl_language == "ARABIC") {
        $("#dvRecPerPage").css("float", "left");
    } else {
        $("#dvRecPerPage").css("float", "right");
    }

    history.forward();
    if (document.title != "Save As" && document.title != "IView Picklist") {
        SetBackForwardButtonProp(enableForwardButton, enableBackButton);
    }

    try {
        AxAfterIviewLoad();
    } catch (ex) { }
    //Grouping action buttons

    $(".ddlBtn img.flag").addClass("flagvisibility");

    $(".ddlBtn dd ul li a").click(function () {
        var text = $j(this).html();
        $j(".ddlBtn dt a span").html(text);
        $j(".ddlBtn dd ul").hide();
    });

    $("#flagSwitcher").click(function () {
        $j(".ddlBtn img.flag").toggleClass("flagvisibility");
    });
    typeof commonReadyTasks == 'function' ? commonReadyTasks() : "";

    var ivcRef = callParentNew('ivCmdRefresh');
    if (ivcRef != null && ivcRef != false) {
        eval(callParent('ivCmdRefresh') + "= ''");
        showAlertDialog("success", ivcRef);
    }

    if (iName == "inmemdb") {
        $("body").addClass("inmemdb");
        $('<div id="inMemChartWrapper"></div>').insertBefore('#ivirMainChartWrapper');
        callCharts();
    }
    $(document).on("click", ".viewtabRemove", function (e) {
        var viewname = $(this).data('name');
        $('#' + viewname).unbind('click');
        deleteViewtab(viewname);
        e.stopPropagation();
    });

    $(document).on("click", ".viewtabEdit", function (e) {
        var clickElem = $(this);
        var viewname = clickElem.data('name');
        newViewTabClick(clickElem);
    });

    $(document).on("click", ".lnkViewTab", function (e) {
        var loadViewName = $(this).attr("id");

        if (loadViewName == "viewAddTab" || loadViewName == window.loadViewName) {
            e.preventDefault();
            return false;
        }

        if (viewLoadedColumns) {
            ivirshowHideColumns(["!"]);
        }

        if (viewLoadedSort) {
            ivirSortColumns(["!"]);
        }

        if (loadViewName != "main" && (requestJSON && loadViewName != "charts")) {
            loadViewTab($(this).attr("id"));
            toggleGridView('grid');

            window.loadViewName = loadViewName;
        } else {
            if ((firstTimeParams || (requestJSON && loadViewName == "main" && isListView)) && (requestJSON && loadViewName != "charts")) {

                if (firstTimeParams) {
                    try {
                        var paramString = firstTimeParams.params.replace(/`/g, "&grave;");
                        var paramValues = firstTimeParams.paramsList || "";
                        paramValues && (paramValues = JSON.parse(JSON.stringify(paramValues).replace(/&amp;/g, "&")));

                        if (paramString != "" && paramString != undefined) {
                            SetParamValues(paramString, paramValues);
                        }
                    } catch (ex) { }
                }

                if (loadViewName != "main" && loadViewName != "charts") {
                    let ivirMainObj = ivirMainViewObj["views"][loadViewName];
                    if (ivirMainObj && ivirMainObj.chart && ivirMainObj.chart.length && ivirMainObj.chart.length > 0) {
                        $("#hdnWebServiceViewName").val(loadViewName);
                    }
                }

                if (loadViewName == "main" && isListView) {
                    $("#hdnLvSelectedCols").val("");
                    $("#hdnLvSelectedHyperlink").val("");
                    $("#hdnLvChangedStructure").val("main");
                }

                setTimeout(function () {
                    $("#button1").trigger('click');
                }, 0);
                window.loadViewName = loadViewName;
            } else {

                clearExistingPills();
                if (requestJSON && loadViewName == "charts") {
                    ivirMainObj = {}
                    ivirMainObj.key = "charts";
                    ivirMainObj.chart = getAllCommonCharts();
                }
                if (requestJSON && loadViewName == "main") {
                    ivirMainObj = {};
                }
                createPillsOnLoad();

                if(loadViewName){
                    $('.nav-tabs a[id=' + loadViewName + ']')?.tab?.('show');
                }
                
                scrollToActiveView(loadViewName);

                window.loadViewName = loadViewName;
            }

            if (requestJSON && loadViewName == "charts") {
                $("#ivirChartPillsList .ivirChartCheckBox:first").change();
                $("#ivirChartPillsDiv .ivirChartCheckBox:first").change();

                toggleGridView('chart');
            } else {
                toggleGridView('grid');
            }
        }

        try {
            KTMenu?.init();
        } catch (error) { }
    });

});

function pickDownn() {
    var pickLength = $j("#tblPickData tr").length;
    var activatedClass = "";
    activatedClass = $j('#tblPickData tr.active').index() + 1;

    if (activatedClass == "-1") {
        activatedClass = 0;
    }

    $("#tblPickData tr").removeClass("active");
    if (activatedClass < (pickLength)) {
        $("#tblPickData tr:nth-child(" + (activatedClass + 1) + ")").addClass('active');
    } else {
        $("#tblPickData tr:nth-child(1)").addClass('active');
    }
}

function pickUpp() {
    var pickLength = $j("#tblPickData tr").length;
    var activatedClass = "";
    activatedClass = $j('#tblPickData tr.active').index() + 1;
    if (activatedClass == "0") {
        activatedClass = 1;
    }

    $j("#tblPickData tr").removeClass("active");
    if (activatedClass == 1) {
        $("#tblPickData tr:nth-last-child(1)").addClass('active');

    } else {
        $("#tblPickData tr:nth-child(" + (activatedClass - 1) + ")").addClass('active');

    }
}

function SetLnkStyle() {
    $("#lnkPrev").hover(function () {
        if ($j(this).hasClass("pickdis") == true) {
            $j(this).css("color", "gray");
        }
    });
    $("#lnkNext").hover(function () {
        if ($j(this).hasClass("pickdis") == true) {
            $j(this).css("color", "gray");
        }
    });
}

function CallAssignLoadVals(result, calledFrom, actnName, NavigationURL) {
    actnName = typeof actnName != "undefined" ? actnName : "";
    if (result.indexOf(";quot") != -1) {
        result = result.replace(new RegExp(";quot", "g"), "'");
    }
    result = CheckSpCharsInFldValueIview(result);
    AssignLoadValues(result, calledFrom, actnName, NavigationURL);
}


function ScrollToTop() {
    parent.window.scrollTo(0, 0);
}

//Function to adjust the height and width of the page according to the parent window.
function Adjustwin(hgt) {
    SetLnkStyle();
}

var xmlObj;
var ArrDep = new Array();

///Function to clear the filter fields in Listview
function pgRefresh() {
    window.location.href = window.location.href;
    Adjustwin();
}

//Function to open the email page.
function openEMail(ivn, b) {
    var rid = getRecordid();
    if (!rid) {
        showAlertDialog("warning", 3000, "client");
    } else if (rid == "n/a") { } else {
        var newWindow;
        try {
            newWindow = window.open('email.aspx?sname=' + ivn + '&stype=' + b + '&recordid=' + rid, 'MyPopUp', 'width=600,height=600');
        } catch (ex) {
            showAlertDialog("warning", appGlobalVarsObject.lcm[356]);
        }
    }
}
// TODO:This function need to change.
function processRow() {

    var b = form1.elements.length;
    var res = "";
    var selectRowno = new Array();
    var sRecid = new Array();
    var g = 0; // no of items in selectRow
    var r = 0; // no of items in sRecid

    for (i = 0; i < b; i++) {

        if (form1.elements[i].name == "rXml") {
            res = res + form1.elements[i].value;
        }
        if (form1.elements[i].type == "checkbox") {
            if (form1.elements[i].checked) {
                selectRowno[g] = form1.elements[i].value;
                g = g + 1;
            }
        }
    }

    res = generateFullIviewXML(res);

    try // for IE
    {
        xmlObj = new ActiveXObject("Microsoft.XMLDOM");
        xmlObj.loadXML(res);
    } catch (e) {
        try //Firefox, Mozilla, Opera, etc.
        {
            parser = new DOMParser();
            xmlObj = parser.parseFromString(res, "text/xml");
        } catch (e) { showAlertDialog("error", e.message) }
    }
    var s = xmlObj.getElementsByTagName(xmlObj.childNodes[0].tagName.toString());
    var noofrows = s[0].childNodes.length;
    var nodlen = s[0].childNodes[0].childNodes.length; // no of columns
    for (n = 0; n < noofrows; n++) //for1
    {
        if (s[0].childNodes[n].childNodes[0].tagName.toString() == "rowno") {
            for (k = 0; k < g; k++) //for2
            {
                if (s[0].childNodes[n].childNodes[0].firstChild.nodeValue == selectRowno[k]) {
                    for (m = 0; m < nodlen; m++) // for3
                    {
                        if (s[0].childNodes[n].childNodes[m].tagName.toString() == "recordid") {
                            sRecid[r] = s[0].childNodes[n].childNodes[m].firstChild.nodeValue;

                            r = r + 1;
                        }

                    } //for3
                }
            } //for2
        }
    } //for1

    if (g == 0) { showAlertDialog("warning", 3001, "client"); } else if (g > 1) { showAlertDialog("warning", 3002, "client"); } else {
        OpenPDFparams(sRecid[0])
    }
}
// TODO:This function need to change.
function OpenPDFparams(recid) {
    if (recid) {
        var left = (screen.width / 2) - (500 / 2);
        var top = (screen.height / 2) - (200 / 2);
        var newWindow;
        try {
            newWindow = window.open('pdfparams.aspx?sname=' + ivna + '&recid=' + recid + '&stype=' + ivtype, 'MyPopUp', 'width=500,height=200,top=' + top + ',left=' + left + '');
        } catch (ex) {
            showAlertDialog("warning", appGlobalVarsObject.lcm[356]);
        }
    } else {
        showAlertDialog("warning", 3000, "client");
    }
}
// TODO:Function to import the csv files.
var gActionname = "";
var gConfirmmsg = "";
var IviewName = "";
var appl = "";

function callFileUploadAction(aname, iName, confirm, appl) {
    if (confirm && confirm != "") {
        var glType = callParentNew('gllangType');
        var isRTL = glType == "ar" ? true : false;
        var callFileUploadActionCB = $.confirm({
            theme: 'modern',
            title: appGlobalVarsObject.lcm[155],
            onContentReady: function () {
                disableBackDrop('bind');
            },
            rtl: isRTL,
            backgroundDismiss: 'false',
            escapeKey: 'buttonB',
            content: confirm,
            buttons: {
                buttonA: {
                    text: appGlobalVarsObject.lcm[164],
                    btnClass: 'btn btn-primary',
                    acion: function () {
                        callFileUploadActionCB.close();
                        UploadFileAfterConfirm();
                    }
                },
                buttonB: {
                    text: appGlobalVarsObject.lcm[192],
                    btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                    action: function () {
                        disableBackDrop('destroy');
                        return;
                    }
                }
            }
        });
    }

    function UploadFileAfterConfirm() {
        gActionname = aname;
        gConfirmmsg = confirm;
        IviewName = iName;
        appl = appl;
        var na = "./fileupload.aspx?act=upload";

        createPopup(na);
    }
    if (callFileUploadActionCB === undefined) {
        UploadFileAfterConfirm();
    }
}

function CallAfterFileUpload() {
    var updFilename = $j("#cb_sactbu").val();
    callActWithFile(gActionname, updFilename, iName, gConfirmmsg, appl);
}
// TODO: Make this action as single function.
function callActWithFile(aname, fileup, iName, confirm, appl) {
    callParentNew("loadFrame()", "function");

    var fup = "";
    AxWaitCursor(true);
    var b = form1.elements.length;
    var res = "";
    var selectRowno = new Array();
    var g = 0; // no of items in selectRow
    if (document.getElementById("rXml") != null) {
        res = document.getElementById("rXml").value;
    }
    for (i = 0; i < b; i++) {
        if (form1.elements[i].type == "checkbox") {
            if (form1.elements[i].checked) {
                selectRowno[g] = form1.elements[i].value; // rowno  val stored in arrray
                g = g + 1;
            }
        }
    }

    res = generateFullIviewXML(res);

    try // for IE
    {
        xmlObj = new ActiveXObject("Microsoft.XMLDOM");
        xmlObj.loadXML(res);
    } catch (e) {
        try //Firefox, Mozilla, Opera, etc.
        {
            parser = new DOMParser();
            xmlObj = parser.parseFromString(res, "text/xml");
        } catch (e) { showAlertDialog("error", e.message) }
        AxWaitCursor(false);
    }

    var s = xmlObj.getElementsByTagName(xmlObj.childNodes[0].tagName.toString());
    var noofrows = s[0].childNodes.length;
    var selXML = "";
    if (g == 0 && appl == "" && noofrows > 0) {
        selectRowno[0] = 1;
    }

    var noofSrows = selectRowno.length;
    if (g == 0 && appl.toString().toLowerCase() == "all rows") {
        noofSrows = noofrows;
    }
    for (k = 0; k < noofSrows; k++) {
        var m = selectRowno[k];
        m = m - 1;
        if (xmlObj.getElementsByTagName("row")[m].xml == undefined) {
            nodeXml = new XMLSerializer().serializeToString(xmlObj.getElementsByTagName("row")[m]);
            selXML = selXML + nodeXml;
        } else {
            selXML = selXML + xmlObj.getElementsByTagName("row")[m].xml;
        }

        if ((fileup != "") && (typeof fileup != "undefined")) {

            if (fileup.substring(0, 1) == ":") {

                fup = xmlObj.getElementsByTagName(fileup)[m].firstChild.nodeValue;
            } else {

                // for fileupload value uploaded by User or
                // for fileupload with direct path given
                fup = fileup.toString();
            }
        }
    }
    if (noofSrows == 0 && fileup.length > 0 && fup == "")
        fup = fileup.toString();

    var pa = generateParamX();
    var txt = '';
    var tem = 1;
    var fileName = "";
    var trace = traceSplitStr + "Action-" + aname + traceSplitChar;
    var dummyArray = new Array();

    if (fup != "") {
        fileName = fup;
        var index = fileName.lastIndexOf('\\');
        if (index != -1) {
            fileName = fileName.substring(index + 1);
        }
    }
    txt = txt + '<root axpapp="' + proj + '" trace="' + trace + '" sessionid="' + sid + '"  stype="iviews" sname="' + iName + '" actname="' + aname + '" __file="' + fileName + '"><params>' + pa + '</params><varlist>';
    txt = txt + selXML;
    txt = txt + '</varlist>';

    var isScript = false;
    try {
        isScript = (ivScripts[aname]["@script"] || "false") == "true";
    }
    catch (e) { }

    if (g == 0 && appl != "" && appl.toString().toLowerCase() != "all rows") {
        showAlertDialog("warning", 3001, "client");
        AxWaitCursor(false);
    } else {
        var ivKey = $j("#hdnKey").val();
        if (confirm != "") {
            if (confirm(confirm)) {
                ASB.WebService.CallActionWS(dummyArray, dummyArray, dummyArray, dummyArray, dummyArray, "", "", txt, fup, "i", "", "", ivKey, "", isScript, "", false, CActSucceededCallback);
            }
        } else {
            ASB.WebService.CallActionWS(dummyArray, dummyArray, dummyArray, dummyArray, dummyArray, "", "", txt, fup, "i", "", "", ivKey, "", isScript, "", false, CActSucceededCallback);
        }
    }
    closeParentFrame();
}

function CActFUSucceededCallback(result, eventArgs) {

    try {
        AssignloadValues(result, "Iview");
        AxWaitCursor(false);
    } catch (ex) {
        AxWaitCursor(false);
        ShowDimmer(false);
        showAlertDialog("error", 3003, "client");
    }
}

// TODO: Make this action as single function.
function callAction(a, x, conf, appl) {

    var tid = "";
    AxWaitCursor(true);
    var b = form1.elements.length;
    var res = "";
    var selectRowno = new Array();
    var g = 0; // no of items in selectRow
    if (document.getElementById("rXml") != null) {
        res = document.getElementById("rXml").value;
    }
    for (i = 0; i < b; i++) {
        if (form1.elements[i].type == "checkbox") {
            if (form1.elements[i].checked) {
                if (form1.elements[i].id != "chkall") {
                    selectRowno[g] = form1.elements[i].value; // rowno  val stored in arrray
                    g = g + 1;
                }
            }
        }
    }

    if (g == 0 && appl != "" && appl.toString().toLowerCase() != "all rows") {
        showAlertDialog("warning", 3001, "client");
        AxWaitCursor(false);
        return;
    }
    if (conf != "") {

        if (!confirm(conf)) {
            AxWaitCursor(false);
            return;
        }

    }

    res = generateFullIviewXML(res);
    try // for IE
    {
        xmlObj = new ActiveXObject("Microsoft.XMLDOM");
        xmlObj.loadXML(res);
    } catch (e) {
        try //Firefox, Mozilla, Opera, etc.
        {
            parser = new DOMParser();
            xmlObj = parser.parseFromString(res, "text/xml");
        } catch (e) { showAlertDialog("error", e.message) }
        AxWaitCursor(false);
    }

    var s = xmlObj.getElementsByTagName(xmlObj.childNodes[0].tagName.toString());
    var noofrows = s[0].childNodes.length;
    var selXML = "";
    if (g == 0 && appl == "" && noofrows > 0) {
        selectRowno[0] = 1;
    }
    var noofSrows = selectRowno.length;
    if (g == 0 && appl.toString().toLowerCase() == "all rows") {
        noofSrows = noofrows;
    }
    for (k = 0; k < noofSrows; k++) {
        if (selectRowno[k] != "" && selectRowno[k] != undefined) {
            var m = selectRowno[k];
            m = m - 1;
            var nodeXml = ""
            if (xmlObj.getElementsByTagName("row")[m].xml == undefined) {
                nodeXml = new XMLSerializer().serializeToString(xmlObj.getElementsByTagName("row")[m]);
                selXML = selXML + nodeXml;
            } else {
                selXML = selXML + xmlObj.getElementsByTagName("row")[m].xml;
            }
        }
    }

    var ivtype = "iviews";
    var pa = generateParamX();
    var fup = "";
    var trace = traceSplitStr + "Action-" + a + traceSplitChar;
    var isScript = false;
    try {
        isScript = (ivScripts[a]["@script"] || "false") == "true";
    }
    catch (e) { }

    var actXML = '<root axpapp="' + proj + '" trace="' + trace + '" sessionid="' + sid + '"  stype="' + ivtype + '" sname="' + x + '" actname="' + a + '"><params>' + pa + '</params><varlist>' + selXML + '</varlist>';

    var dummyArray = new Array();
    try {
        var ivKey = $j("#hdnKey").val();
        ASB.WebService.CallActionWS(dummyArray, dummyArray, dummyArray, dummyArray, dummyArray, "", "", actXML, fup, "i", "", "", ivKey, "", isScript, "", false, CActSucceededCallback);

    } catch (ex) { showAlertDialog("error", ex.toString()); }

}

function ActButtonClick(btnId, confirmMsg, allRow, NavigationURL) {
    if (actionCallFlag == actionCallbackFlag) {
        actionCallFlag = Math.random();
        $("#icons").css({ "pointer-events": "auto" });
    } else {
        $("#icons").css({ "pointer-events": "none" });
        return;
    }

    $("#" + btnId).removeAttr("href");
    ShowDimmer(true);
    var checked = false;
    var reqIsPostBack = false;
    var rows = "";
    if (allRow == "") {
        checked = true;
    }

    $("#GridView1" + " tr").each(function () {
        $(this).find("input:checkbox").each(function () {
            if ($j(this).attr("name") == "chkItem" && $j(this).prop("checked") == true) {
                var rowIdx = $j(this).val();
                rows += rowIdx + "♣";
                checked = true;
            }
        });
    });

    if (iframeindex != null && iframeindex > -1 && rows == "") {
        checked = true;
        rows = "1♣";
    }

    try {
        //Hook - to call custom functions before calling action
        if (!AxCustomBeforeAction(rows, btnId)) {
            $j("#hdnIsPostBack").val("false");

            actionCallbackFlag = actionCallFlag;
            $("#icons,#btnSaveTst,.wizardNextPrevWrapper").css({ "pointer-events": "auto" });
            return;
        }
    } catch (ex) {

    }
    if ($("#hdnSRows").length)
        $("#hdnSRows").val(rows);
    if ($("#hdnAct").length)
        $("#hdnAct").val(btnId);
    if (checked) {
        if (confirmMsg != "") {
            var glType = callParentNew('gllangType');
            var isRTL = glType == "ar" ? true : false;
            var ActButtonClickCB = $.confirm({
                theme: 'modern',
                closeIcon: false,
                title: appGlobalVarsObject.lcm[155],
                onContentReady: function () {
                    disableBackDrop('bind');
                },
                backgroundDismiss: 'buttonB',
                escapeKey: 'buttonB',
                rtl: isRTL,
                content: confirmMsg,
                buttons: {
                    buttonA: {
                        text: appGlobalVarsObject.lcm[164],
                        btnClass: 'btn btn-primary',
                        action: function () {
                            disableBackDrop('destroy');
                            ActButtonClickCB.close();
                            callRemoteDoActionWS(rows);
                        }
                    },
                    buttonB: {
                        text: appGlobalVarsObject.lcm[192],
                        btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                        action: function () {
                            ShowDimmer(false);
                            actionCallbackFlag = actionCallFlag;
                            $("#icons,#btnSaveTst,.wizardNextPrevWrapper").css({ "pointer-events": "auto" });
                            return;
                        }
                    }

                }
            });

        } else {
            reqIsPostBack = true;
            callRemoteDoActionWS(rows);
        }

    } else {
        reqIsPostBack = false;
        showAlertDialog("warning", 3001, "client");
        ShowDimmer(false);

        actionCallbackFlag = actionCallFlag;
        $("#icons,#btnSaveTst,.wizardNextPrevWrapper").css({ "pointer-events": "auto" });
    }
}

function callRemoteDoActionWS(rows) {
    ShowDimmer(true);
    var appsessionkey = callParentNew('getAppSessionKey()', 'function').substr(2);
    var username = callParentNew("mainUserName");
    var actName = $j("#hdnAct").val().substr(4);
    var paramxml = generateParamX();
    var trace = traceSplitStr + "trace" + traceSplitStr;
    var iXml = "";
    iXml = iXml + '<root axpapp="' + proj + '" trace="' + trace + '" sessionid="' + sid + '"  appsessionkey="' + appsessionkey + '" stype="iviews" sname="' + iName + '" actname="' + actName + '" username="' + username + '"><params>' + paramxml + '</params><varlist>';
    iXml += jsonToXml(rows);
    iXml += '</varlist>';
    ivkey = $("#hdnKey").val();
    var isScript = false;
    try {
        isScript = (ivScripts[actName]["@script"] || "false") == "true";
    }
    catch (e) { }

    $.ajax({
        url: 'iview.aspx/ActionBtnClick',
        type: 'POST',
        cache: false,
        async: true,
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            iName,
            ivkey,
            iXml,
            actName,
            isScript
        }),
        success: function (data) {
            data = data.d;
            if (data.result == "failure") {
                if (iName == "inmemdb")
                    showAlertDialog('error', appGlobalVarsObject.lcm[278]);
            }
            else if (data.result == "Session Authentication failed...")
                parent.window.location.href = "../aspx/sess.aspx";
            else {
                if (iName == "inmemdb") {
                    removeValFromIndex = rows.substr(0, rows.length - 1).split("♣");
                    for (var i = removeValFromIndex.length - 1; i >= 0; i--)
                        ivDatas.splice(parseInt(removeValFromIndex[i]) - 1, 1);
                    ivirDataTableApi.rows().remove();
                    ivirDataTableApi.rows.add(ivDatas).draw();  //append next records to the datatable & redraw it
                    callCharts();

                    showAlertDialog('success', appGlobalVarsObject.lcm[267]);
                }
                else {
                    if (data.ActBtnNavigation != undefined)
                        CallAssignLoadVals(data.actResponse, "Action", actName, data.ActBtnNavigation);
                    else
                        CallAssignLoadVals(data.actResponse, "Action", actName);
                }
            }

            if (unselectReportRowOnAction) {
                CheckAll(false);
            }

            ShowDimmer(false);

            $("#hdnAct").val("");

            actionCallbackFlag = actionCallFlag;
            $("#icons,#btnSaveTst,.wizardNextPrevWrapper").css({ "pointer-events": "auto" });
        },
        failure: function (response) {
            ShowDimmer(false);
            showAlertDialog("error", 3028, "client");

            $("#hdnAct").val("");

            actionCallbackFlag = actionCallFlag;
            $("#icons,#btnSaveTst,.wizardNextPrevWrapper").css({ "pointer-events": "auto" });
        },
        error: function (response) {
            ShowDimmer(false);
            showAlertDialog("error", 3028, "client");

            $("#hdnAct").val("");

            actionCallbackFlag = actionCallFlag;
            $("#icons,#btnSaveTst,.wizardNextPrevWrapper").css({ "pointer-events": "auto" });
        }
    });
}

/**
 * generate xml for selected row's data while calling webservice
 * @author Prashik
 * @Date   2019-04-11T11:00:20+0530
 * @param  {string}                 rows : rows seperated by ♣
 * @return {string}                 selectedRow : xml for selected rows data
 */
function jsonToXml(rows) {
    rows = rows.split("♣");
    var selectedRow = "";
    $(rows).each(function (ind, val) {
        if (val != "") {
            var doc = $.parseXML("<row/>")
            var json = ivirDataTableApi.data()[val - 1];
            var xml = doc.getElementsByTagName("row")[0];
            var key, elem;
            for (key in json) {
                var newKey = key.startsWith("@") ? key.substr(1) : key;
                if (json.hasOwnProperty(key)) {
                    elem = doc.createElement(newKey);
                    $(elem).text(json[key]);
                    xml.appendChild(elem);
                }
            }

            selectedRow += xml.outerHTML || new XMLSerializer().serializeToString(xml);
        }
    });
    return selectedRow;
}


function CActSucceededCallback(result, eventArgs) {
    if (CheckSessionTimeout(result)) {
        return;
    }
    try {
        result = AfterCallActionIview(result);
    } catch (ex) { }

    try {
        AssignLoadValues(result, "Iview");
        AxWaitCursor(false);
        showAlertDialog("info", 3004, "client");
    } catch (ex) {
        AxWaitCursor(false);
        ShowDimmer(false);
        showAlertDialog("error", 3003, "client");
    }
}

/// iview column action
function callHLaction(a, x, name) {
    GetCurrentTime("Iview Action button click(Post back)");
    //The first empty row node will be deleted incase of non-directdb. So, incrementing the row no by 1 to fetch the correct row from XML.
    if ($j("#hdnIsDirectDB").val() == "false" && $j("#hdnIsPerfXml").val() == "true")
        x = x + 1;
    var selXML = "";
    var ivtype = "iviews";

    if ($("#hdnSRows").length)
        $("#hdnSRows").val(x.toString());
    if ($("#hdnAct").length)
        $("#hdnAct").val("btn_" + a);


    selXML = jsonToXml(x.toString());


    var dummyArray = new Array();
    var trace = traceSplitStr + "CallHLAction-" + a + traceSplitChar;
    var pa = generateParamX() + ConstructFldDataNodes(selXML);
    var actXML = '<root axpapp="' + proj + '" trace="' + trace + '" sessionid="' + sid + '"  stype="' + ivtype + '" sname="' + name + '" actname="' + a + '"><params>' + pa + '</params><varlist>' + selXML + '</varlist>';
    var fup = "";
    var ivKey = $j("#hdnKey").val();
    var isScript = false;
    try {
        isScript = (ivScripts[a]["@script"] || "false") == "true";
    }
    catch (e) { }
    GetProcessTime();
    ASB.WebService.CallActionWS(dummyArray, dummyArray, dummyArray, dummyArray, dummyArray, "", "", actXML, fup, "i", "", "", ivKey, "", isScript, "", false, CHlActSucceededCallback);
}

function ConstructFldDataNodes(selXML) {
    var strNodes = "";

    if ($("#hdnIsDirectDB").val() == "false" && $j("#hdnIsPerfXml").val() == "true") {
        var selXmlObj = "";
        // for IE
        try {
            selXmlObj = new ActiveXObject("Microsoft.XMLDOM");
            selXmlObj.loadXML(selXML);
        } catch (e) {
            try //Firefox, Mozilla, Opera, etc.
            {
                parser = new DOMParser();
                selXmlObj = parser.parseFromString(selXML, "text/xml");
            } catch (e) { showAlertDialog("error", e.message) }
        }

        if (selXmlObj.childNodes[0] != undefined) {
            var xmlRowAttr = selXmlObj.childNodes[0].attributes;
            for (var i = 0; i < xmlRowAttr.length; i++) {
                var nodeName = xmlRowAttr[i].name;
                var nodeVal = xmlRowAttr[i].value;
                if (!generateParamX().toLowerCase().indexOf("<" + nodeName.toLowerCase() + ">") > -1) {
                    strNodes += "<" + nodeName + ">" + nodeVal + "</" + nodeName + ">";
                }
            }
        }
    }

    return strNodes.replace(/&/g, "&amp;");;
}

function CHlActSucceededCallback(result, eventArgs) {
    if (result != "") {
        var serverprocesstime = result.split("*♠*")[0];
        var requestProcess_logtime = result.split("*♠*")[1];
        result = result.split("*♠*")[2];
        WireElapsTime(serverprocesstime, requestProcess_logtime, true);
    }
    if (CheckSessionTimeout(result)) {
        return;
    }
    try {
        AssignLoadValues(result, "Iview");
        AxWaitCursor(false);
        var resval = result.split("*$*");
        var strSingleLineText = resval[0].toString().replace(new RegExp("\\n", "g"), "");
        strSingleLineText = strSingleLineText.replace(new RegExp("\\t", "g"), "&#9;");
        strSingleLineText = strSingleLineText.replace(/\\/g, ";bkslh");
        if (strSingleLineText) {
            var myJSONObject = $j.parseJSON(strSingleLineText);

            if (!myJSONObject.hasOwnProperty("error") && myJSONObject.command) {
                var cmd = myJSONObject.command[0].cmd;
                if (cmd !== "opentstruct" && cmd !== "openfile")
                    callParentNew("closeFrame()", "function");
            }
        }
    } catch (ex) {
        AxWaitCursor(false);
        ShowDimmer(false);
        showAlertDialog("error", 3003, "client");
        callParentNew("closeFrame()", "function");
    }

    setTimeout(() => {
        $("#hdnAct").val("");
    }, 0);
}

///Function to toggle the cursor style.
function AxWaitCursor(act) {
    if (act) {
        $("body").css('cursor', 'wait');
    } else {
        $("body").css('cursor', 'arrow');
        $("body").css('cursor', 'default');
    }
}


// Function for refreash the iframe size based on AJAX frame size changed
function EndRequestHandler(sender, args) {

    var stTime = new Date();
    AddDatePicker();
    AddTimePicker();
    if (args.get_error() == undefined) {
        parent.window.scrollTo(0, 0);

        if (document.title == "Iview" || document.title == "Listview") {
            calledFrom = "";

            ShowVisibleFilters();
            HighLightSelected();
            CheckMyViewFilters();
            SetParamValues($j("#hdnparamValues").val());
            evalParamExprHandler();
        }
        try {
            AxAfterIviewLoad();
        } catch (ex) { }
        Adjustwin();
        AxWaitCursor(false);
        ShowDimmer(false);
    } else {
        if (args.get_error().name == "Sys.WebForms.PageRequestManagerTimeoutException") {
            showAlertDialog("error", 3005, "client");
        }
        document.body.style.cursor = 'default';

        ShowDimmer(false);
    }

    if (typeof isFromClearBtn != "undefined" && isFromClearBtn == true) {
        $("#form1").find('input:text').each(function () {
            $(this).val("");
        });
        $("#form1").find('select option').each(function () {
            if ($(this).text() == '0' || $j(this).text() == '') { $j(this).attr("selected", "selected"); }
        });
        $("#dvParamCont").find('select').each(function () {
            $(this).val('ALL');
        });
        isFromClearBtn = false;
    }
}

function AdjustRowsperPageDiv() {
    if ($j("#showFilter").css("display") == "block") {
        if ($j("#dvRowsPerPage").is(":visible")) {
            $j("#dvRowsPerPage").css("margin-top", "-16px");
        }
    }
}

function load() {
    Sys.WebForms.PageRequestManager.getInstance().add_endRequest(EndRequestHandler);
    window.status = "";
}

function CallSaveAs(iname, ivtype) {
    if (SaveWindow && SaveWindow.open && !SaveWindow.closed) {
        SaveWindow.focus();
    } else {
        if (recordsFieldsValidForSave()) {
            var left = (screen.width / 2) - (350 / 2);
            var top = (screen.height / 2) - (150 / 2);
            var paramVal = form1.param.value;
            paramVal = CheckUrlSplChars(paramVal);
            var ivKey = "";

            if ($j("#hdnKey").length > 0 && $j("#hdnKey").val() != "")
                ivKey = "&ivKey=" + $j("#hdnKey").val();

            var sw = "SaveAs.aspx?tid=" + iname + "&param=" + paramVal + "&ivtype=" + ivtype + ivKey;
            try {
                SaveWindow = window.open(sw, "MyPopUp", "width=350,height=150,resizable=yes,top=" + top + ", left=" + left + "");
            } catch (ex) {
                showAlertDialog("warning", appGlobalVarsObject.lcm[356]);
            }
        }
    }
}

function CheckUrlSplChars(value) {
    value = value.replace(/&amp;/g, "&");
    value = value.replace(/%/g, "%25");
    value = value.replace(/&/g, "%26");
    value = value.replace(/'/g, "%27");
    value = value.replace(/"/g, "%22");
    value = value.replace(/#/g, "%23");
    return value;
}


function SaveAs(a, c) {

    var b = form1.cb_saveas.value;

    if (b == "html") { toHTML(a, c, 'false'); } else if (b == "excel") { toExcel(a, c); } else if (b == "csv") { toCSV(a, c); } else if (b == "xml") { toXML(a, c); } else if (b == "pdf") { toPDF(a, c); } else if (b == "word") { toWord(a, c); } else if (b == "-") { }
}


function recordsFieldsValidForSave() {
    var maxLimit = parseInt($("#printRowsMaxLimitField").val());
    var totalRecords = parseInt($("#hdnTotalIViewRec").val());
    if (typeof getIviewRowCount == "undefined" || getIviewRowCount) {
        if (maxLimit < totalRecords) {
            showAlertDialog("warning", 3006, "client");
            return false;
        } else if (totalRecords < 1) {
            showAlertDialog("warning", 3007, "client");
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }
}


function toExcel(a, c) {
    var left = (screen.width / 2) - (840 / 2);
    var top = (screen.height / 2) - (600 / 2);
    var pa = form1.param.value;
    pa = CheckUrlSplChars(pa);
    var na = "../aspx/excel.aspx?ivname=" + a + "&ivtype=" + c + "&params=" + pa;
    window.open(na, "excelWindow", "width=840,height=600,scrollbars=yes,top=" + top + ",left=" + left + "");
}

function toHTML(a, c, isprint) {
    var pa = form1.param.value;

    if ($("#hdnKey").length > 0 && $j("#hdnKey").val() != "") {
        ivKey = "&ivKey=" + $j("#hdnKey").val();
    }

    SetExport("../aspx/htmliv.aspx?ivname=" + a + "&ivtype=" + c + ivKey + "&params=&isPrint=" + isprint, pa, a);

}
function SetExport(url, params, iviewName) {
    if (iviewName != "") {
        if (!requestJSON) {
            try {
                ASB.WebService.SetExportParams(url, params, iviewName, SuccSetExportParams);
            } catch (ex) {
            }
        } else {
            SetDatatableExport(url);
        }
    }
}
function SuccSetExportParams(obj, eventArgs) {
    if (obj && obj.url) {
        var isHtmlIv = obj.url.indexOf("htmliv.aspx") > -1;
        var curWin;
        try {
            try {
                /**
                 * @description : Customize Export Url(if returns string url) Or Customization for Javascript Export(if return true)
                 * @author Prashik
                 * @date 2020-06-30
                 * @param {object} url : export url object
                 * @return {[string/bool]}:
                    * If returns string(custom obj.url) then it will be considered an updated url
                    * If returns true then next operations will be stopped and it will be considered that export operation is already completed in the given function
                 */
                var tempUrl = axSetCustomExport(obj) || obj.url;
                if (tempUrl === true) {
                    return;
                } else {
                    obj.url = tempUrl;
                }
            } catch (ex) { }
            if (!isHtmlIv) {
                fixUnloadOnWindowSelfDownloads(window);
            }
            curWin = window.open(obj.url + (obj.url.indexOf("?") > -1 ? "&axpCache=true" : ""), (isHtmlIv ? "toHTML" : "_self"), "width=" + $(window).width() + ",height=" + $(window).width() + ",scrollbars=yes,top=" + 0 + ",left=" + 0 + "");
        } catch (ex) {
            if (isHtmlIv) {
                showAlertDialog("warning", appGlobalVarsObject.lcm[356]);
            }
            else {
                window.onbeforeunload = BeforeWindowClose;
            }
        }
    }
}

function SetDatatableExport(url) {
    try {
        /**
         * @description : Customize Export Url(if returns string url) Or Customization for Javascript Export(if return true)
         * @author Prashik
         * @date 2020-06-30
         * @param {object} url : export url object
         * @return {[string/bool(true)]}:
            * If returns string(custom obj.url) then it will be considered an updated url
            * If returns true then next operations will be stopped and it will be considered that export operation is already completed in the given function
         */
        var tempUrl = axSetCustomExport({ url }) || url;
        if (tempUrl === true) {
            return;
        } else {
            url = tempUrl;
        }
    } catch (ex) { }
    if (url.indexOf("htmliv.aspx") > -1) {
        exportType = "print";
    } else if (url.indexOf("pdfiview.aspx") > -1) {
        exportType = "pdf";
    } else if (url.indexOf("excelweb.aspx") > -1) {
        exportType = "excel";
    } else {
        exportType = url;
    }

    if (!checkNextDBRowsExist) {
        ExecuteDatatableExport();
    } else {
        getAllRecords();
    }
}

function ExecuteDatatableExport() {
    if (ivirDataTableApi) {
        let internalExportType = exportType;
        switch (exportType) {
            case "print":
                ShowDimmer(true);
                setTimeout(() => {
                    GetCurrentTime("iview " + internalExportType + " export");
                    ivirDataTableApi.button('4').trigger();
                    GetProcessTime();
                    GetTotalElapsTime();
                }, 0);
                break;
            case "pdf":
                ShowDimmer(true);
                setTimeout(() => {
                    GetCurrentTime("iview " + internalExportType + " export");
                    ivirDataTableApi.button('3').trigger();
                    GetProcessTime();
                    GetTotalElapsTime();
                }, 0);
                break;
            case "excel":
                ShowDimmer(true);
                setTimeout(() => {
                    GetCurrentTime("iview " + internalExportType + " export");
                    ivirDataTableApi.button('2').trigger();
                    GetProcessTime();
                    GetTotalElapsTime();
                }, 0);
                break;
            case "html":
                ShowDimmer(true);
                setTimeout(() => {
                    GetCurrentTime("iview " + internalExportType + " export");
                    ivirDataTableApi.button('5').trigger();
                    GetProcessTime();
                    GetTotalElapsTime();
                }, 0);
                break;
            case "json":
                ShowDimmer(true);
                setTimeout(() => {
                    GetCurrentTime("iview " + internalExportType + " export");
                    ivirDataTableApi.button('6').trigger();
                    GetProcessTime();
                    GetTotalElapsTime();
                }, 0);
                break;
            case "copy":
                ShowDimmer(true);
                setTimeout(() => {
                    GetCurrentTime("iview " + internalExportType + " export");
                    ivirDataTableApi.button('0').trigger();
                    GetProcessTime();
                    GetTotalElapsTime();
                }, 0);
                break;
            default:
                exportType = "";
                break;
        }
    }
    exportType = "";
}

function toCSV(a, c) {
    var pa = form1.param.value;

    if ($("#hdnKey").length > 0 && $j("#hdnKey").val() != "") {
        ivKey = "&ivKey=" + $j("#hdnKey").val();
    }
    SetExport("../aspx/csviview.aspx?ivname=" + a + "&ivtype=" + c + ivKey + "&params=", pa, a);
}

function toXML(a, c) {
    var pa = form1.param.value;

    if ($("#hdnKey").length > 0 && $j("#hdnKey").val() != "") {
        ivKey = "&ivKey=" + $j("#hdnKey").val();
    }
    SetExport("../aspx/xmliview.aspx?ivname=" + a + "&ivtype=" + c + ivKey + "&params=", pa, a);
}

function toPDF(a, c) {
    var pa = form1.param.value;

    if ($j("#hdnKey").length > 0 && $j("#hdnKey").val() != "") {
        ivKey = "&ivKey=" + $j("#hdnKey").val();
    }
    SetExport("../aspx/pdfiview.aspx?ivname=" + a + "&ivtype=" + c + ivKey + "&params=", pa, a);
}

function toWord(a, c) {
    var pa = form1.param.value;
    var ivKey = "";
    if ($j("#hdnKey").length > 0 && $j("#hdnKey").val() != "") {
        ivKey = "&ivKey=" + $j("#hdnKey").val();
    }
    SetExport("../aspx/wordview.aspx?ivname=" + a + "&ivtype=" + c + ivKey + "&params=", pa, a);
}

function fixUnloadOnWindowSelfDownloads(curWin) {
    curWin.onbeforeunload = function () {
        curWin.onbeforeunload = BeforeWindowClose;
    };
}

//Need to change this funciton
function getRecordid() {

    var b = form1.elements.length;
    var res = "";
    var selectRowno = new Array();
    var sRecid = new Array();
    var g = 0; // no of items in selectRow
    var r = 0; // no of items in sRecid

    for (i = 0; i < b; i++) {

        if (form1.elements[i].name == "rXml") {
            res = res + form1.elements[i].value;
        }
        if (form1.elements[i].type == "checkbox") {
            if (form1.elements[i].checked) {
                selectRowno[g] = form1.elements[i].value; // rowno  val stored in arrray
                g = g + 1;
            }
        }
    }

    res = generateFullIviewXML(res);

    try {
        xmlObj = new ActiveXObject("Microsoft.XMLDOM");
        xmlObj.loadXML(res);
    } catch (e) {
        try //Firefox, Mozilla, Opera, etc.
        {
            parser = new DOMParser();
            xmlObj = parser.parseFromString(res, "text/xml");
        } catch (e) { showAlertDialog("error", e.message) }
    }

    var s = xmlObj.getElementsByTagName(xmlObj.childNodes[0].tagName.toString());
    var noofrows = s[0].childNodes.length;
    var nodlen = s[0].childNodes[0].childNodes.length; // no of columns

    for (n = 0; n < noofrows; n++) //for1
    {
        if (s[0].childNodes[n].childNodes[0].tagName.toString() == "rowno") {
            for (k = 0; k < g; k++) //for2
            {
                if (s[0].childNodes[n].childNodes[0].firstChild.nodeValue == selectRowno[k]) {
                    for (m = 0; m < nodlen; m++) // for3
                    {

                        if (s[0].childNodes[n].childNodes[m].tagName.toString() == "recordid") {
                            sRecid[r] = s[0].childNodes[n].childNodes[m].firstChild.nodeValue;

                            r = r + 1;
                        }

                    } //for3
                }
            } //for2
        }
    } //for1

    var retVal = "n/a";

    if (g == 0) {
        retVal = "0";
    } else if (g > 1) {
        showAlertDialog("warning", 3002, "client");
    } else {
        retVal = sRecid[0];
    }
    return retVal;
}


function generateFullIviewXML(res) {
    var rows = "";
    $j("#GridView1" + " tr").each(function () {
        $j(this).find("input:checkbox").each(function () {
            if ($j(this).attr("name") == "chkItem") {
                var rowIdx = $j(this).val();
                rows += rowIdx + "♣";
            }
        });
    });

    res = "<table>" + jsonToXml(rows) + "</table>";
    return res;
}

//=======================For Delete ===================//
//need to change
function callDelete(x, y) {
    if (iName == "response" && x == "axrol") {
        confirmRespDelete();
        return;
    }

    AxWaitCursor(true);
    var b = form1.elements.length;
    var res = "";
    var selectRowno = new Array();
    var g = 0; // no of items in selectRow
    if ($j("#rXml").length > 0) {
        res = $j("#rXml").val();
    }

    for (i = 0; i < b; i++) {
        if (form1.elements[i].type == "checkbox") {
            if (form1.elements[i].checked) {
                if (!isNaN(parseInt(form1.elements[i].value))) {
                    selectRowno[g] = form1.elements[i].value; // rowno  val stored in arrray
                    g = g + 1;
                }
            }
        }
    }
    if (g == 0) {
        showAlertDialog("warning", 3001, "client");
        AxWaitCursor(false);
        return;
    }
    res = generateFullIviewXML(res);

    try {
        xmlObj = new ActiveXObject("Microsoft.XMLDOM");
        xmlObj.loadXML(res);
    } catch (e) {
        try //Firefox, Mozilla, Opera, etc.
        {
            parser = new DOMParser();
            xmlObj = parser.parseFromString(res, "text/xml");
        } catch (e) {
            showAlertDialog("error", e.message);
            AxWaitCursor(false);
        }
    }

    var nodeIndex = 0;
    for (nodeIndex = 0; nodeIndex < xmlObj.childNodes.length; nodeIndex++) {
        if (xmlObj.childNodes[nodeIndex].nodeName.toLowerCase() != "xml")
            break;
    }

    var s = xmlObj.getElementsByTagName(xmlObj.childNodes[nodeIndex].tagName.toString());
    var noofrows = s[0].childNodes.length;
    var selXML = "";
    var selRecIds = "";
    var noofSrows = selectRowno.length;
    var recidColIdx = 0;
    recidColIdx = GetRecordIdColIndex(xmlObj, selectRowno[0]);

    //If the record id column in not there in the iview result, alert will be displayed.
    if (y == "Iview" && recidColIdx == -1) {
        showAlertDialog("error", 3008, "client");
        AxWaitCursor(false);
        return;
    }

    for (k = 0; k < noofSrows; k++) {
        var m = selectRowno[k];
        if (!(isNaN(m))) {
            m = m - 1;

            //To refuse deletion of Cancelled record
            if (xmlObj.getElementsByTagName("cancel")[m] && xmlObj.getElementsByTagName("cancel")[m].xml && xmlObj.getElementsByTagName("cancel")[m].childNodes[0].text == "T") {
                showAlertDialog("warning", 3009, "client");
                AxWaitCursor(false);
                return;
            }

            if (xmlObj.getElementsByTagName("row")[m].xml == undefined) {
                nodeXml = new XMLSerializer().serializeToString(xmlObj.getElementsByTagName("row")[m]);
                selXML = selXML + nodeXml;
                if (recidColIdx != -1) {
                    if (selRecIds == "")
                        selRecIds = xmlObj.getElementsByTagName("row")[m].childNodes[recidColIdx].textContent;
                    else
                        selRecIds = "," + xmlObj.getElementsByTagName("row")[m].childNodes[recidColIdx].textContent;
                }

            } else {
                selXML = selXML + xmlObj.getElementsByTagName("row")[m].xml;
                if (recidColIdx != -1) {
                    if (selRecIds == "")
                        selRecIds = xmlObj.getElementsByTagName("row")[m].childNodes[recidColIdx].text;
                    else
                        selRecIds += "," + xmlObj.getElementsByTagName("row")[m].childNodes[recidColIdx].text;
                }
            }
        }
    }
    trace = traceSplitStr + "DeleteRow-" + x + traceSplitChar;
    var actXML = '<root axpapp="' + proj + '" trace="' + trace + '" sessionid="' + sid + '"  stype="iviews" sname="' + x + '" actname="delete"><varlist>' + selXML + '</varlist>';
    var glType = callParentNew('gllangType');
    var isRTL = glType == "ar" ? true : false;
    $.confirm({
        theme: 'modern',
        title: appGlobalVarsObject.lcm[155],
        rtl: isRTL,
        onContentReady: function () {
            disableBackDrop('bind');
            AxWaitCursor(false);
        },
        backgroundDismiss: 'false',
        escapeKey: 'buttonB',
        content: appGlobalVarsObject.lcm[5],
        buttons: {
            buttonA: {
                text: appGlobalVarsObject.lcm[279],
                btnClass: 'btn btn-primary',
                action: function () {
                    try {
                        ASB.WebService.DeleteIviewRow(selRecIds, x, actXML, SuccessCallbackDRow);
                    } catch (ex) { AxWaitCursor(false); }
                }
            },
            buttonB: {
                text: appGlobalVarsObject.lcm[280],
                btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                action: function () {
                    disableBackDrop('destroy');
                }
            }
        }
    });
}

//Function to get the recordid column index from the listview columns.
function GetRecordIdColIndex(xmlObj, rowIndex) {
    var idx = -1;

    rowIndex = parseInt(rowIndex, 10) - 1;
    if (!isNaN(rowIndex)) {
        var columns = xmlObj.getElementsByTagName("row")[rowIndex].childNodes;
        for (var i = 0; i < columns.length; i++) {
            if (columns[i].nodeName == "recordid") {
                idx = i;
                break;
            }
        }
    }
    return idx;
}

function callDeleteNew(x, y, rowNo) {

    var res = "";
    var selRecIds = "";
    var recidColIdx = 0;
    recidColIdx = GetRecordIdColIndex(xmlObj, rowNo);

    if ($j("#rXml").length > 0) {
        res = $j("#rXml").val();
    }
    res = generateFullIviewXML(res);

    try {
        xmlObj = new ActiveXObject("Microsoft.XMLDOM");
        xmlObj.loadXML(res);
    } catch (e) {
        try //Firefox, Mozilla, Opera, etc.
        {
            parser = new DOMParser();
            xmlObj = parser.parseFromString(res, "text/xml");
        } catch (e) { showAlertDialog("error", e.message) }
    }

    var s = xmlObj.getElementsByTagName(xmlObj.childNodes[0].tagName.toString());
    var selXML = "";

    if (xmlObj.getElementsByTagName("row")[rowNo].xml == undefined) {
        nodeXml = new XMLSerializer().serializeToString(xmlObj.getElementsByTagName("row")[rowNo]);
        selXML = selXML + nodeXml;
        if (selRecIds == "")
            selRecIds = new XMLSerializer().serializeToString(xmlObj.getElementsByTagName("row")[m].childNodes[recidColIdx].text);
        else
            selRecIds = "," + new XMLSerializer().serializeToString(xmlObj.getElementsByTagName("row")[m].childNodes[recidColIdx].text);

    } else {
        selXML = selXML + xmlObj.getElementsByTagName("row")[rowNo].xml;
        if (selRecIds == "")
            selRecIds = xmlObj.getElementsByTagName("row")[m].childNodes[recidColIdx].text;
        else
            selRecIds += "," + xmlObj.getElementsByTagName("row")[m].childNodes[recidColIdx].text;
    }

    trace = traceSplitStr + "DeleteRow-" + x + traceSplitChar;
    var actXML = '<root axpapp="' + proj + '" trace="' + trace + '" sessionid="' + sid + '"  stype="iviews" sname="' + x + '" actname="delete" ><varlist>' + selXML + '</varlist></root>';
    var glType = callParentNew('gllangType');
    var isRTL = glType == "ar" ? true : false;
    $.confirm({
        theme: 'modern',
        title: appGlobalVarsObject.lcm[155],
        rtl: isRTL,
        onContentReady: function () {
            disableBackDrop('bind');
        },
        backgroundDismiss: 'false',
        escapeKey: 'buttonB',
        content: appGlobalVarsObject.lcm[5],
        buttons: {
            buttonA: {
                text: appGlobalVarsObject.lcm[279],
                btnClass: 'btn btn-primary',
                action: function () {
                    ASB.WebService.DeleteIviewRow(selRecIds, x, actXML, SuccessCallbackDRow);
                }
            },
            buttonB: {
                text: appGlobalVarsObject.lcm[280],
                btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                action: function () {
                    disableBackDrop('destroy');
                }
            }
        }
    });
}

function SuccessCallbackDRow(result, eventArgs) {

    if (CheckSessionTimeout(result))
        return;

    var clrCacheKeys = result.split("*#*")[1];
    if (typeof clrCacheKeys != "undefined" && clrCacheKeys != "") {

        ClearRedisKeys(clrCacheKeys);
    }
    if (result.indexOf("*#*") > -1)
        result = result.substring(0, result.indexOf("*#*"));

    var resval = result.split("*$*");
    for (var ind = 0; ind < resval.length; ind++) {
        var strSingleLineText = resval[ind].toString().replace(new RegExp("\\n", "g"), "");
        if (strSingleLineText == "")
            return;

        var myJSONObject = $j.parseJSON(strSingleLineText);
        if (myJSONObject.error) {
            ExecuteErrorMsg(myJSONObject.error, "Delete");
        } else if (myJSONObject.message) {
            ClearRedisDataCache();
            ExecuteMessage(myJSONObject.message, "Delete");
        }
    }
    AxWaitCursor(false);
}

//Function to execute the Error message node in the json result.
function ExecuteErrorMsg(ErroMsgJsonObj, calledFrom) {

    var errMsg = ErroMsgJsonObj[0].msg;
    var errFld;
    if (ErroMsgJsonObj[0].errfld)
        errFld = ErroMsgJsonObj[0].errfld;

    var index = errMsg.indexOf("^^dq");
    while (index != -1) {
        errMsg = errMsg.replace("^^dq", '"');
        index = errMsg.indexOf("^^dq");
    }

    if (errMsg != null && errMsg != undefined && errMsg != "") {
        showAlertDialog("error", errMsg);
    }
}

//Function to execute the message node in the json result.
function ExecuteMessage(messageJsonObj, calledFrom) {

    for (var i = 0; i < messageJsonObj.length; i++) {

        var msgs = messageJsonObj[i].msg;
        msgs = msgs.split(",");
        var responsemsgFlds = msgs.length;
        var message = "";

        for (var mm = 0; mm < responsemsgFlds; mm++) {

            message += msgs[mm] + "\n";
            var stPos = message.indexOf("[");
            var endPos = message.indexOf("]");
            var errFld = message.substring(stPos + 1, endPos);
            if (errFld != "") {
                var nerr = msg.substring(stPos, endPos + 2);
                message = message.replace(nerr, "");
            }
            var index = message.indexOf("^^dq");
            while (index != -1) {
                message = message.replace("^^dq", '"');
                index = message.indexOf("^^dq");
            }

        }
        if (message != "") {
            if ((calledFrom == "Delete") && (message.indexOf("done") != -1)) {
                showAlertDialog("success", 3010, "client");
                if ($j("#btnClear").length > 0)
                    $j("#btnClear").click();
                else
                    pgRefresh();
            } else {
                showAlertDialog("error", message);
            }
        }
    }
}

function callOpenAction(a, b) {
    if (iName == "response" && b == "axrol") {
        ShowDimmer(true);
        parent.displayBootstrapModalDialog('Add Responsibility', 'md', '430px', true, '../aspx/AddEditResponsibility.aspx?action=add', true);
        return;
    }

    GetCurrentTime("Tstruct load on Iview New button click(Post back)");
    if (a == "opentstruct") {

        callParentNew("loadFrame()", "function");
        GetProcessTime();
        $j(location).attr("href", "../aspx/tstruct.aspx?transid=" + b + "&hdnbElapsTime=" + callParentNew("browserElapsTime") + "" + `&openerIV=${iName}&isIV=${!isListView}`);
        ResetNavGlobalVariables();
    }
}

function HideFindList() {
    if (IsFindBtnClicked == true) { IsFindBtnClicked = false } else {
        var dvtaskList = document.getElementById("findListPopUp");
        if (dvtaskList != null && dvtaskList.offsetWidth != undefined && dvtaskList.offsetHeight != undefined) {
            dvtaskList.style.display = "none";
        }
    }
}
//Function to hide the task list.
function HideNqIvTaskList() {

    var dvtaskList = $j("#taskListPopUp");

    if (IsNqIvTaskBtnCliked == true) {
        IsNqIvTaskBtnCliked = false;
        dvtaskList.show();
    } else {
        dvtaskList.hide();
    }
}
// Checks if the browsers is IE or another.
// document.all will return true or false depending if its IE
// If its not IE then it adds the mouse event
if (!document.all) {
    document.captureEvents(Event.MOUSEMOVE);
}

// On the move of the mouse, it will call the function getPosition
// These varibles will be used to store the position of the mouse
var iX = 0
var iY = 0

// This is the function that will set the position in the above varibles
function getPosition(args) {
    // Gets IE browser position
    if (document.all) {
        iX = event.clientX + $j("body").scrollLeft
        iY = event.clientY + $j("body").scrollTop
    }

    // Gets position for other browsers
    else {
        iX = args.pageX
        iY = args.pageY
    }
}

function FindposImg() {
    var img = document.getElementById("imgFind");
    iX = findPosX(img);
    iY = findPosY(img);
}

function OnBlrLstItem(lst) {
    lst.className = "popDivBg";
}

function OnLnkFcs(ankr) {
    ankr.style.color = "White";
}

function OnLnkBlr(ankr) {
    ankr.style.color = "Black";
}

function openPrint() {
    window.print();
}

function OpenPreview() {
    var OLECMDID = 7; /* OLECMDID values:* 6 - print* 7 - print preview* 1 - open window* 4 - Save As*/
    var PROMPT = 1; // 2 DONTPROMPTUSERvar
    WebBrowser = '<OBJECT ID="WebBrowser1" WIDTH=0 HEIGHT=0 CLASSID="CLSID:8856F961-340A-11D0-A96B-00C04FD705A2"></OBJECT>';
    document.body.insertAdjacentHTML('beforeEnd', WebBrowser);
    WebBrowser1.ExecWB(OLECMDID, PROMPT);
    WebBrowser1.outerHTML = "";
}

function LoadPopPage(poppath, pageno, isParentListView, navigationType) {
    GetCurrentTime("Tstruct load on Iview hyperlink click(Post back)");
    //For popup navigation buttons will be visible
    if (!window.opener)
        window.parent.disableNavigation = false;
    else
        window.opener.parent.disableNavigation = false;
    var parFrm = $j("#axpiframe", parent.document);
    if ((navigationType == undefined || navigationType == "") && parFrm.hasClass("frameSplited"))
        navigationType = "split"
    if (navigationType === "split") {
        ShowDimmer(false);
        callParentNew(`OpenOnPropertyBase(${poppath})`, 'function');
    }
    else if (navigationType === "default") {
        ReloadIframe(poppath);
    }
    else if (navigationType === "newpage") {
        popupFullPage(poppath);
    }
    else {
        if (isParentListView && isParentListView != "" && window.ivtype == "listview") {
            window.parent.tstructPop = isParentListView;
            window.parent.listViewPage = pageno;
            if (poppath.indexOf("tstruct.aspx?") > -1) {
                poppath += "&AxPop=true";
            }
        } else {
            if (poppath.indexOf("ivtoivload.aspx?") > -1) {
                poppath += "&AxIsPop=true";
            }

            if (poppath.indexOf("tstruct.aspx?") > -1) {
                poppath += "&AxPop=true";
            }

            if (poppath.indexOf("ivtstload.aspx?") > -1) {
                poppath += "&AxPop=true";
                if ((poppath.indexOf("ivtstload.aspx?tstname=digno") > -1)) {
                    poppath = poppath.replace("ivtstload.aspx", "../dsign/DgsignSkipUser.aspx");
                }
            }

        }
        GetProcessTime();
        var hyperlinkPopupURL = `${poppath}&hdnbElapsTime=${callParentNew("browserElapsTime")}`;
        createPopup(hyperlinkPopupURL, true);
        callParentNew("loadFrame()", "function");
    }
}

function IsDependent(parItem) {
    var i = 0;
    var IsDep = false;
    for (i = 0; i < depArr.length; i++) {
        var depArrVal = depArr[i].split(",");
        for (var h = 0; h < depArrVal.length; h++) {
            if (depArrVal[h] == parItem) {
                IsDep = true;
            }
        }
    }
    return IsDep;
}

function GetAllChecked(obj) {
    var chkValue = $j("#" + obj.id).prop("checked");
    if (chkValue) {
        $j("#" + obj.id + " input[type='checkbox']").each(function () {
            $j(this).prop("checked", true);
        });
    } else {
        $j("#" + obj.id + " input[type='checkbox']").each(function () {
            $j(this).prop('checked', false);
        });
    }
}

function UncheckChkAll(obj) {
    if (obj.checked == false) {
        try {
            $("#" + obj.id + ".chkSelectAll").prop("checked", false);
        } catch (Ex) { }
    }

}

function GetChkParamValues(pValue, ctrl) {

    var tmpVal = "";
    var paramValue = "";
    var paramDiv = $j("#" + ctrl + " input[type='checkbox']");
    $j.each(paramDiv, function () {
        if ($j(this).is(":checked")) {
            tmpVal = $j(this).prop("value");
            if (paramValue == "") {
                paramValue = ctrl + "~" + tmpVal;
            }
            else {
                paramValue = paramValue + "&grave;" + tmpVal;
            }
        }
    });

    if (pValue == "") {
        pValue = paramValue;
    }
    else {
        pValue = pValue + paramValue;
    }

    return pValue;
}

function GetParamValues(calledFrom, evt) {

    calledFrom = calledFrom || "";
    evt = evt || "";
    var i = 0;
    var pValue = "";
    ArrDep.length = 0;
    var ctrl;
    var validationMsgArr = new Array();
    if ($j("#hdnSelParamsAftrChWin").val() !== null && $j("#hdnSelParamsAftrChWin").val() !== "") {
        pValue = $j("#hdnSelParamsAftrChWin").val();
        $j("#hdnSelParamsAftrChWin").val("");
        $j("#hdnGo").val("Go");
    }
    else {
        for (i = 0; i < parentArr.length; i++) {
            var ctrl = $j("#" + parentArr[i]);
            if (ctrl.length) {
                var fldType = ctrl.prop("type");
                if (fldType == "select-one" && !ctrl.parents(".paramtd2").hasClass("pick-list")) {
                    var result = ctrl.find("option:selected").val();
                    result = typeof result == "undefined" ? "" : result;
                    if ((result == "" || result == null) && (calledFrom != "clear"))// If any select parameter is empty should not call getIview
                    {
                        if (document.readyState == "complete") {
                            if (evt?.pointerType || evt == "") {
                                showAlertDialog("warning", 3032, "client");
                            }
                        }
                        return false;
                    }
                    var isDep = IsDependent(parentArr[i]);
                    if (isDep == true) {
                        var j = 0;
                        var depVal = "";
                        $j(ctrl).find("option").each(function () {
                            if (($j(this).val() == "0") && ($j(this).val() == "")) {

                            } else {
                                depVal += ($j(this).val()) + "$$$";
                            }
                        });
                        ArrDep.push(parentArr[i] + "~" + depVal);
                        pValue += parentArr[i] + "~" + result + "¿";
                    } else {
                        pValue += parentArr[i] + "~" + result + "¿";
                    }
                } else if (fldType == "select-multiple") {
                    var cnt = 0;
                    var ft = "false";
                    var ctrl1 = document.getElementById(parentArr[i]);
                    cnt = ctrl1.options.length;
                    if (cnt > 0) {
                        for (j = 0; j < cnt; j++) {
                            if (ft == "false") {
                                if ($(ctrl1.options[j]).prop("selected") == true) {
                                    ft = "true";
                                    pValue += parentArr[i] + "~" + ctrl1.options[j].value;
                                }
                            } else {
                                if ($(ctrl1.options[j]).prop("selected") == true) {
                                    pValue += "&grave;" + ctrl1.options[j].value;
                                }
                            }
                        }
                    } else {
                        pValue += parentArr[i] + "~" + ctrl1.value;
                    }

                    if (pValue != "") pValue += "¿";
                } else if (fldType == "checkbox") {
                    pValue = GetChkParamValues(pValue, parentArr[i]);
                    if (pValue != "") pValue += "¿";
                } else {
                    if(ctrl.data("select2")){
                        var newval = ctrl.val() === null ? "" : ctrl.val();
                    }else{
                        var newval = ctrl.val();
                    }
                    if (ctrl.hasClass("trySelectMs")) {
                        try {
                            if (ctrl.data('bs.tokenfield')) {
                                newval = ctrl.tokenfield("getTokensList").replace(/`/g, "&grave;");
                            } else {
                                newval = ctrl.data("selectedlist").replace(/`/g, "&grave;");
                            }
                        } catch (ex) { }
                    }
                    var vFlag = true;
                    try {
                        vFlag = AxICheckValid();
                    } catch (e) {
                        if (vFlag == undefined)
                            vFlag = true;
                    }
                    if (vFlag == undefined)
                        vFlag = true;
                    if ((paramType[i] == "Date/Time") && (dtCulture.toLowerCase() == "en-us") && newval != "")
                        newval = GetDateStr(ctrl.val(), "d/m/Y", "m/d/Y");

                    if (paramType[i] == "Date/Time" && newval == "") {
                        ctrl.val(newval = moment(new Date()).format(dtCulture == "en-us" ? "MM/DD/YYYY" : "DD/MM/YYYY"));
                    }

                    if (newval == "" && ctrl.parent().prev('td').find("font").text() != "" && vFlag) {
                        validationMsgArr.push(ctrl.parent().prev('td').find("font").text());
                    }
                    pValue += parentArr[i] + "~" + newval + "¿";
                }
            }
        }
    }
    //If the parameter is not visible no need to check this validation.
    if ($j("#paramCont").css('display') != 'none') {
        for (var j = 0; j < validationMsgArr.length; j++) {
            if (validationMsgArr[j] != "") {
                ShowDimmer(false);

                callParentNew("closeFrame()", "function");
                showAlertDialog("warning", 3011, "client", "\"" + validationMsgArr[j] + "\"");
                break;
            }
        }
    }

    if (validationMsgArr.length == 0) {
        //below condition is if the iview is opened from a customised page then it was giving undefined error
        if (window.parent.childWindowHandler == undefined) {
            $j("#hdnGo").val("Go");
        } else {
            if (window.parent.childWindowHandler.length > 0 && window.parent.childWindowHandler[window.parent.childWindowHandler.length - 1] != undefined && !window.parent.childWindowHandler[window.parent.childWindowHandler.length - 1].closed)
                $j("#hdnGo").val("TSSave");
            else
                $j("#hdnGo").val("Go");
        }
    }

    $("#hdnparamValues").val(pValue);
    return true;
}

function SetParamValues(pval, depsForViewsObj = "") {
    var stTime = new Date();
    AddDatePicker();
    AddTimePicker();
    if (clearParams) {
        FillDependentsStartup(true);
        clearParams = false;
        return;
    }

    if (pval != "" && pval != undefined) {
        var strParam = pval.split("¿");
        var i = 0;
        for (i = 0; i <= strParam.length - 1; i++) {
            if (strParam[i] != "") {
                var strVal = strParam[i].split("~");
                if (strVal[1] != null && strVal[1].indexOf("quot;") != -1) {
                    strVal[1] = strVal[1].replace(/quot;/g, "'");
                }
                var pctrl = $j("#" + strVal[0]);
                if (pctrl.length) {
                    //if ALL is there in dep param just remove all and space. If no dep values exists then fill the same into that combo.

                    var pctrlreset = false;
                    var fldType = pctrl.prop("type");

                    if (depsForViewsObj) {
                        var thisDep = depsForViewsObj[strVal[0]];
                        if (thisDep) {
                            if (fldType == "select-one" && thisDep.type.toLowerCase() == "select") {
                                setParamsValueList(strVal[0], "select", thisDep.value.split("`"), "");
                            } else if (fldType != "select-multiple" && fldType != "checkbox" && thisDep.type.toLowerCase() == "multi select") {
                                setParamsValueList(strVal[0], "multi select", thisDep.value.split("`"), "");
                            }
                        }
                    }

                    if (fldType == "select-one") {
                        var cblen = pctrl[0].options.length;
                        //check whether "ALL" is in combobox, if so remove it and continue to load values from ArrDep
                        if (cblen == 1) {
                            if (pctrl.find("option:selected").val() == "ALL") {
                                pctrl[0].options.length = 0;
                                cblen = 0;
                                pctrlreset = true;
                            }
                        }
                        if (cblen == 0) {
                            for (var ind = 0; ind < ArrDep.length; ind++) {
                                var strArr = ArrDep[ind].split('~');
                                if (strArr[0] == strVal[0]) {
                                    var strItems = strArr[1].split('$$$');
                                    var k = 0;
                                    pctrl[0].options.length = 0;
                                    for (k = 0; k < strItems.length - 1; k++) {
                                        // Add an Option object to Drop Down/List Box
                                        $j(pctrl).each(function () {
                                            $j(this).append($j("<option></option>").attr("value", strItems[k]).text(strItems[k]));
                                        });
                                    }
                                    $j(pctrl).find("option").each(function (cbi) {
                                        if ($j(this).text() == strVal[1]) {
                                            $j(this).attr("selected", "selected");
                                            return false;
                                        }
                                    });
                                }
                            }
                            cblen = pctrl[0].options.length;
                        }
                        //If Arrdep is not available, if "ALL" is removed earlier then just add ALL in to combo.
                        if ((cblen == 0) && (pctrlreset)) {
                            $j(pctrl).each(function () {
                                $j(this).append($j("<option></option>").attr("value", "ALL").text("ALL"));
                            });
                        }

                        $j(pctrl).find("option").each(function () {
                            $j(this).removeAttr("selected");
                            if ($j(this).text() == strVal[1]) {
                                $j(this).prop("selected", true);

                            }
                        });
                    } else if (fldType == "select-multiple") {
                        var arrSel = strVal[1].split("&grave;");
                        for (var j = 0; j < arrSel.length; j++) {
                            $j(pctrl).find("option").each(function () {
                                if ($j(this).text() == arrSel[j]) {
                                    $j(this).attr("selected", "selected");
                                    return false;
                                }
                            });
                        }

                        if (pctrl.hasClass("trySelectedMs")) {
                            strVal[1] = strVal[1].replace(/&grave;/g, pctrl.data("separator"));
                            try {
                                if (pctrl.data('bs.tokenfield')) {
                                    pctrl.tokenfield('setTokens', typeof strVal[1] == "string" ? [...new Set(strVal[1].split(pctrl.data("separator")))] : strVal[1]);
                                } else {
                                    pctrl.data("selectedlist", strVal[1]);
                                }
                            } catch (ex) { }
                        }
                    } else if (fldType == "checkbox") {

                        var chekedVals = strVal[1].split("&grave;");
                        var chkdCnt = 0;
                        var totalCkbCnt = $j(pctrl).parent().next('div').find("input").length;
                        $j(pctrl).parent().next('div').find("input").each(function () {
                            $j(this).prop("checked", false);
                        });
                        for (var j = 0; j < chekedVals.length; j++) {
                            $j(pctrl).parent().next('div').find("input").each(function () {
                                if ($j(this).val() == chekedVals[j]) {
                                    $j(this).prop("checked", true);

                                    chkdCnt = chkdCnt + 1;
                                    return false;
                                }
                            });
                        }
                        if (totalCkbCnt === chekedVals.length) {
                            if ($j(pctrl).length > 0) {
                                $j(pctrl).prop("checked", true);
                            }
                        }

                    } else {
                        if ((parentArr[i] == strVal[0]) && (paramType[i] == "Date/Time") && (dtCulture.toLowerCase() == "en-us") && (strVal[1] != ""))
                            pctrl.val(GetDateStr(strVal[1], "d/m/Y", "m/d/Y"));
                        else
                            pctrl.val(strVal[1]);

                        if (pctrl.hasClass("multiFldChk")) {

                            strVal[1] = strVal[1].replace(/&grave;/g, pctrl.data("separator"));
                            try {
                                if (pctrl.data('bs.tokenfield')) {
                                    pctrl.tokenfield('setTokens', typeof strVal[1] == "string" ? [...new Set(strVal[1].split(pctrl.data("separator")))] : strVal[1]);
                                } else {
                                    pctrl.data("selectedlist", strVal[1]);
                                }
                            } catch (ex) { }
                        }
                    }

                    $j("#hdnParamChngd").val("true");
                    //Set values into the Curfldvalue array
                }
            }
        }
    }
    if (!loadPop && window.parent.isSessionCleared && document.title == "Iview")
        window.parent.isSessionCleared = false;
    $j("#hdnGo").val("");

    AxWaitCursor(false);
    ShowDimmer(false);

}
var clearParams = false;

function ClearParamValues() {
    isFromClearBtn = true;

    callParentNew("loadFrame()", "function");

    clearParams = true;
    $j("#hdnparamValues").val('');

    $j("#form1").find('input:text').each(function () {
        $j(this).val("");
    });
    $j("#form1").find('select option').each(function () {
        if ($j(this).text() == '0' || $j(this).text() == '' || $j(this).text() == aXEmptyOption) { $j(this).attr("selected", "selected"); }
    });
    var allExist = false;
    var aXEmptyOptionExist = false;
    $j("#dvParamCont").find('select').each(function () {

        $.each($j(this).find("option"), function (index, value) {
            if ($(value).text() == aXEmptyOption) {
                aXEmptyOptionExist = true;
            }
            if ($(value).text() == "ALL") {
                allExist = true;
            }
        });
        if (allExist) {
            $j(this).val('ALL');
        } else if (aXEmptyOptionExist) {
            $j(this).val('');
        } else {
            $j(this).val($j(this).find("option:selected").val());
        }
    });

    if (document.title == "Iview") {
        GetParamValues("clear");
        $j("#hdnGo").val("clear");
    }

    arrCheckedFilter.length = 0;
    selectedFilterItem = '';

}

function clearFilterValues() {

    callParentNew("loadFrame()", "function");
    GetParamValues();
    arrCheckedFilter.length = 0;
    selectedFilterItem = '';

}


function iviewValidatedate(obj) {
    if (obj.val() != "  /  /") {
        if (isIviewDate(obj.val()) == false) {
            obj.val("");
            obj.focus()
            return false
        }
    }
    return true
}

function isIviewDate(dtStr) {
    dtStr = DateDisplayFormat(dtStr);
    if (dtStr != "") {
        var daysInMonth = DaysArray(12);
        var pos1 = dtStr.indexOf(dtCh);
        var pos2 = dtStr.indexOf(dtCh, pos1 + 1);
        var strDay = dtStr.substring(0, pos1);
        var strMonth = dtStr.substring(pos1 + 1, pos2);
        var strYear = dtStr.substring(pos2 + 1);
        strYr = strYear;
        if (strDay.charAt(0) == "0" && strDay.length > 1) {
            strDay = strDay.substring(1);
        }
        if (strMonth.charAt(0) == "0" && strMonth.length > 1) {
            strMonth = strMonth.substring(1);
        }
        for (var i = 1; i <= 3; i++) {
            if (strYr.charAt(0) == "0" && strYr.length > 1) {
                strYr = strYr.substring(1);
            }
        }
        month = parseInt(strMonth);
        day = parseInt(strDay);
        year = parseInt(strYr);
        if (pos1 == -1 || pos2 == -1) {
            showAlertDialog("warning", 3012, "client");
            return false;
        }
        if (strMonth.length < 1 || month < 1 || month > 12) {
            showAlertDialog("warning", 3013, "client");
            return false;
        }
        if (strDay.length < 1 || day < 1 || day > 31 || (month == 2 && day > daysInFebruary(year)) || day > daysInMonth[month]) {
            showAlertDialog("warning", 3014, "client");
            return false;
        }
        if (strYear.length != 4 || year == 0 || year < minYear || year > maxYear) {
            showAlertDialog("warning", 3015, "client", minYear + "^♠^" + maxYear);
            return false;
        }
        if (dtStr.indexOf(dtCh, pos2 + 1) != -1 || isInteger(stripCharsInBag(dtStr, dtCh)) == false) {
            showAlertDialog("warning", 3016, "client");
            return false;
        }
    } else {
        return true;
    }
    return true;
}
//iview
function Calendarvalidate(evt, val) {

    var charCode = (evt.which) ? evt.which : event.keyCode;
    var sLen = val.length;
    if (((charCode == 46) || (charCode == 47)) && (sLen > 0)) {
        charCode = 49;
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }

    return true;
}

//iview
function validatecalendar(evt, val) {

    var charCode = (evt.which) ? evt.which : event.keyCode;
    var sLen = val.length;
    return true;
}


function IsInteger(s) {
    var i;
    for (i = 0; i < s.length; i++) {
        // Check that current character is number.
        var c = s.charAt(i);
        if (((c < "0") || (c > "9"))) {
            return false;
        }
    }
    // All characters are numbers.
    return true;
}
//iviewand detailsview
function CheckKeyPressed(evt, ctrl) {
    var ctr = document.getElementById(ctrl);
    var TAB = 9;
    var ENTER = 13;
    var keyCode;
    if ("which" in evt) { // NN4 & FF &amp; Opera
        keyCode = evt.which;
    } else if ("keyCode" in evt) { // Safari & IE4+
        keyCode = evt.keyCode;
    } else if ("keyCode" in window.event) { // IE4+
        keyCode = window.event.keyCode;
    } else if ("which" in window.event) {
        keyCode = evt.which;
    } else {
        showAlertDialog("error", 3017, "client");
    }

}

function ChkHdrCheckbox() {

    var chkAll = $j("#chkall");

    var allChecked = true;
    $j("input[name=chkItem]:checkbox").each(function () {
        var isChked = $j(this).prop("checked");
        if (isChked == undefined || isChked == false) {
            allChecked = false;
            return false;
        }
    });
    if (allChecked) {
        chkAll.prop("checked", true);
    }
    else {
        chkAll.prop("checked", false);
    }
}


// JScript File
//Function to create browser specofic xml object.
function CreateXmlObject(res) {
    if (ie) {
        xmlObj = new ActiveXObject("Microsoft.XMLDOM");
        xmlObj.loadXML(res);
    } else {
        parser = new DOMParser();
        xmlObj = parser.parseFromString(res, "text/xml");
    }
    return xmlObj;
}

//var xmlObj = new ActiveXObject("Microsoft.XMLDOM");
var xmlObj;
var ie = document.all;

function CheckSpecialCharsInXml(str) {

    if (str == null) {
        return "";
    }
    var str = str;
    str = str.replace(/&/g, "&amp;");
    str = str.replace(/</g, "&lt;");
    str = str.replace(/>/g, "&gt;");
    // single and double quote are part of parameter , so not replaced.
    return str;
}

//Function to refresh the dependent parameters in Iviews.
function FillDependents(parentParam) {

    ValParamChanged(parentParam);
    AxWaitCursor(true);

    ctrlID = parentParam;
    var pIndex = 0;
    var innerIPText = "";
    var i = 0;
    for (i = 0; i < parentArr.length; i++) {
        if (parentArr[i] == parentParam) {
            if (depArr[i] != "" || columnDepArr[i] != "") {
                for (pIndex = 0; pIndex < parentArr.length; pIndex++) {
                    var pItem = "";
                    var pType = "";
                    pItem = parentArr[pIndex];
                    pType = typeArr[pIndex];
                    pValue = "";
                    var selected = $("<div />");
                    let isSelectWithMultiColumn = false;
                    if (pType.toLowerCase() == "accept") {
                        pValue = $("#" + pItem).val();
                        if ((paramType[pIndex] == "Date/Time") && (dtCulture.toLowerCase() == "en-us") && pValue != "")
                            pValue = GetDateStr(pValue, "d/m/Y", "m/d/Y");
                    } else if (pType.toLowerCase() == "select") {
                        selected = $("#" + pItem).find('option:selected');
                        if ($('option:selected', "#" + pItem).index() >= 0) {
                            pValue = selected.text();

                            try {
                                isSelectWithMultiColumn = Object.keys(selected.data()).filter(key => key.startsWith("optionsss")).length > 0;
                            } catch (ex) { }
                        }
                    } else if (pType.toLowerCase() == "multi select") {
                        pValue = typeof $j("#" + pItem).val() == "object" ? $j("#" + pItem).val().join("~") : $j("#" + pItem).val();
                    }
                    else {
                        pValue = $("#" + pItem).val();

                        if (pType.toLowerCase() == "pick list") {
                            var selected = $("#" + pItem);
                            try {
                                isSelectWithMultiColumn = Object.keys($j("#" + pItem).data()).filter(key => key.startsWith("optionsss")).length > 0;
                            } catch (ex) { }
                        }
                    }

                    pValue = CheckSpecialCharsInXml(pValue);
                    if (parentParam == pItem && paramType[pIndex] == "Date/Time") {
                        if (!isDtSelected && pType.toLowerCase() == "accept") return;
                        else
                            isDtSelected = false;
                    }

                    if (!isSelectWithMultiColumn) {
                        innerIPText += "<" + pItem + ">" + pValue + "</" + pItem + ">";
                    } else {

                        if (pType.toLowerCase() == "pick list" && columnDepArr[i] == "") {
                            columnDepArr[i] = Object.keys(selected.data()).filter(col => col.startsWith("optionsss")).map(col => col.replace("optionsss", "")).join() || "";
                        }

                        if (columnDepArr[i] != "") {
                            let tempDepArr = [];

                            columnDepArr[i].split(",").forEach(col => {
                                sqlParamsArr.forEach((par, parInd) => {
                                    par.split(",").forEach(splitPar => {
                                        if (col == splitPar) {
                                            tempDepArr.push(parentArr[parInd]);
                                        }
                                    });
                                });
                            });

                            depArr[i] = [...new Set([...depArr[i].split(","), ...tempDepArr])].join();
                        }

                        let keys = Object.keys(selected.data()).filter(key => key.startsWith("optionsss"));

                        let kkk = "";
                        let vvv = "";
                        let ttt = "";

                        keys.forEach(k => {
                            kkk = k.replace("optionsss", "");

                            vvv = selected.data(k);

                            ttt = selected.data(`dtypeee${kkk}`) || "";

                            innerIPText += "<" + kkk + (ttt ? ` dt=\"${ttt}\"` : ``) + ">" + (pValue != "" ? vvv : "") + "</" + kkk + ">";
                        });
                    }

                }

                //Get the dependent fields
                var depValues = "";
                var isDepFldsVisible = false;
                for (var di = 0; di < depArr.length; di++) {
                    if (depArr[di] != "") {
                        //If the changed parameter is part of the dep array then do not include.
                        var depFlds = "";
                        depFlds = CheckDepParents(parentParam, depArr[di], depValues);
                        if (depFlds != "") {
                            if (depValues == "")
                                depValues = depFlds;
                            else
                                depValues += "," + depFlds;

                            var depType = $("#" + depFlds).attr("type");
                        }
                        if (depType != undefined && depType != "hidden")
                            isDepFldsVisible = true;
                    }
                }
                if (isDepFldsVisible == true)
                    ShowDimmer(true);
                var trace = traceSplitStr + "GetDependParams-" + iName + traceSplitChar;
                var txt = '<sqlresultset name="' + iName + '" axpapp="' + proj + '" transid=""  sessionid="' + sid + '" trace="' + trace + '" depparams="' + depValues + '">';
                txt = txt + innerIPText;

                try {
                    isDepsProcessed = false;
                    ASB.WebService.GetDependParamsValues(txt, $("#hdnKey").val(), SuccGetDependents, OnParDepException);
                } catch (e) {
                    isDepsProcessed = true;
                    AxWaitCursor(false);
                    ShowDimmer(false);
                    if (formSubmited) {
                        $j("#button1").click();
                    }
                }
            } else {
                FillHiddenValues(parentParam);
                AxWaitCursor(false);
                ShowDimmer(false);
            }
            break;
        }
    }
    if ($("#" + parentParam).hasClass("onlyTime")) {
        if ($("#" + parentParam).val() != "" && ((!timePickerSec && $("#" + parentParam).val() != "00:00") || (timePickerSec && $j("#" + parentParam).val() != "00:00:00"))) {


            $("#" + parentParam).val(CheckValidTime($j("#" + parentParam).val()));
        } else {

            var paramHasExpr = false;
            for (var j = 0; j < parentArr.length; j++) {
                if (parentParam == parentArr[j]) {
                    if (Expressions[j] != "") {
                        paramHasExpr = true;
                        ExprHandler(parentParam, "");
                        break;
                    }
                }
            }

            if (!paramHasExpr) {
                if (timePickerSec) {
                    $("#" + parentParam).val("00:00:00");
                } else {
                    $("#" + parentParam).val("00:00");
                }
            }
        }
    }
}

//Function which checks if the changed parameter is part of the dependents then it will not add to the depparams.
//If the depparam is already part of the depvalues, then it will skip adding duplicates.
function CheckDepParents(parentParam, depArr, depValues) {
    var depFlds = "";
    var strDep = depArr.split(",");
    var strFlds = depValues.split(",");

    for (var k = 0; k < strDep.length; k++) {
        if (strDep[k] == parentParam)
            continue;
        else {
            var idx = $.inArray(strDep[k], strFlds)
            if (idx == -1) {
                if (depFlds == "")
                    depFlds += strDep[k];
                else
                    depFlds += "," + strDep[k];
            }
        }
    }

    return depFlds;
}

function OnParDepException(result) {
    AxWaitCursor(false);
    ShowDimmer(false);
    isDepsProcessed = true;
    if (formSubmited) {
        $j("#button1").click();
    }
}

function ValParamChanged(parentParam) {
    //Check for changed parameter values
    var pValue = "";
    var paramCtrl = $j("#" + parentParam);
    if (paramCtrl.length) {
        if (paramCtrl.prop("type").toLowerCase() == "accept") {
            pValue = paramCtrl.val();
        } else if (paramCtrl.prop("type").toLowerCase() == "select") {
            pValue = $j("#" + pItem).find('option:selected').text();
        } else if (paramCtrl.prop("type").toLowerCase() == "select-one") {
            if ($j('option:selected', paramCtrl).index() != -1)
                pValue = $j(paramCtrl).find('option:selected').text();
        } else {
            pValue = paramCtrl.val();
        }
    }
    var ChCnt = 0;
    var i = 0;
    for (i = 0; i < parentArr.length; i++) {
        if (parentArr[i] == parentParam) {
            currFldValue = pCurArr[i];
            ChCnt = i;
            break;
        }
    }

    var IsParamChng = "";
    IsParamChng = $j("#hdnParamChngd").val();
    if (pValue != currFldValue && IsParamChng == "true") {
        $j("#lblErrMsg").text(appGlobalVarsObject.lcm[6]);
        pCurArr[ChCnt] = pValue;
    } else {
        $j("#lblErrMsg").text("");
    }
}

function SuccGetDependents(result, eventArgs) {
    AxWaitCursor(false);
    ShowDimmer(false);
    if (CheckSessionTimeout(result))
        return;
    var rexTxt = result.substring(0, 7);
    if (rexTxt == "<error>") {
        showAlertDialog("error", result);
        this.blur();
    } else {
        var res = result;
        try {
            xmlObj = CreateXmlObject(res);
        } catch (e) {
            showAlertDialog("error", e.message)
        }
        var select = "";
        var rootNode = xmlObj.getElementsByTagName("sqlresultset");
        var childCnt = rootNode[0].childNodes.length;
        var pID = "";
        var fldname = "";
        var pType = "";
        var fldValue = "";
        var cat = "";
        var isHidden = "";
        var hdnArr = new Array();
        var dataType = "";
        var i = 0;
        for (i = 0; i < childCnt; i++) {
            fldValue = rootNode[0].childNodes[i].getAttribute("value");
            cat = rootNode[0].childNodes[i].getAttribute("cat");
            if (cat == null) { continue; }
            var childcount = rootNode[0].childNodes[i].childNodes.length;
            var resultArr = new Array();
            var attriuteArr = new Array();
            for (var j = 0; j < childcount; j++) {
                pID = rootNode[0].childNodes[i].childNodes[j].tagName;
                if (pID == "a0") { fldname = rootNode[0].childNodes[i].childNodes[j].firstChild.nodeValue; }
                if (pID == "a4") { dataType = rootNode[0].childNodes[i].childNodes[j].firstChild.nodeValue; }
                if (pID == "a13") { pType = rootNode[0].childNodes[i].childNodes[j].firstChild.nodeValue; }
                if (pID == "a21") { isHidden = rootNode[0].childNodes[i].childNodes[j].firstChild.nodeValue; }
                if (pID == "response") {
                    if (rootNode[0].childNodes[i].childNodes[j].childNodes.length >= 1) {
                        var rows = rootNode[0].childNodes[i].childNodes[j].childNodes;
                        var m = 0;
                        for (m = 0; m < rootNode[0].childNodes[i].childNodes[j].childNodes.length; m++) {
                            if (ie) {
                                resultArr[m] = rootNode[0].childNodes[i].childNodes[j].childNodes[m].childNodes[0].text;
                            } else {
                                resultArr[m] = rootNode[0].childNodes[i].childNodes[j].childNodes[m].childNodes[0].textContent;
                            }

                            attriuteArr[m] = [];

                            if (rootNode[0].childNodes[i].childNodes[j].childNodes[m].childNodes.length > 1) {
                                attriuteArr[m] = $(rootNode[0].childNodes[i].childNodes[j].childNodes[m].childNodes).toArray().reduce((finalStr, node, nodeInd) => {
                                    var str = (node.textContent || node.text);
                                    var returnStr = [];

                                    returnStr.push({ [`optionsss${nodeInd > 0 ? node.tagName : fldname}`]: str });

                                    if (!(nodeInd == 0 || !node.hasAttribute("dt"))) {
                                        returnStr.push({ [`dtypeee${nodeInd > 0 ? node.tagName : fldname}`]: node.getAttribute("dt") });
                                    }

                                    finalStr.push(returnStr);
                                    return finalStr;
                                }, []).flat();
                            }
                        }

                    } else { }
                }
            }
            if (fldValue == null) {
                fldValue = "";
            }
            var parentCtrl = "";
            parentCtrl = document.getElementById(fldname);
            if ((dataType == "Date/Time") && (dtCulture.toLowerCase() == "en-us") && fldValue != "")
                fldValue = GetDateStr(fldValue, "d/m/Y", "m/d/Y");
            if (pType.toLowerCase() == "select" && isHidden == "false") {
                setParamsValueList(fldname, pType, resultArr, fldValue, attriuteArr);
                var cnt = resultArr.length;
                resultArr.splice(0, cnt);

                if($(parentCtrl).data('select2')?.isOpen()){
                    $(parentCtrl).select2('close');
                    $(parentCtrl).select2('open');
                }                
            }
            if (pType.toLowerCase() == "select" && isHidden == "true") {
                parentCtrl.value = fldValue;
            }
            else if (pType.toLowerCase() == "accept" && isHidden == "false") {
                parentCtrl.value = fldValue;
            }
            else if (pType.toLowerCase() == "accept" && isHidden == "true") {
                parentCtrl.value = fldValue;
                hdnArr.push(fldname);
            } else if (pType.toLowerCase() == "multi select") {
                setParamsValueList(fldname, pType, resultArr, fldValue);
                var cnt = resultArr.length;
                resultArr.splice(0, cnt);

                if($(parentCtrl).data('select2')?.isOpen()){
                    $(parentCtrl).select2('close');
                    $(parentCtrl).select2('open');
                }
            }
            else if (pType.toLowerCase() == "pick list" && isHidden == "false") {
                parentCtrl.value = fldValue;

                if($(parentCtrl).data('select2')?.isOpen()){
                    $(parentCtrl).select2('close');
                    $(parentCtrl).select2('open');
                }
            }
        }
    }

    onLoadDep = false;
    if (isFstParamsBound) {
        document.getElementById('button1').click();
        isFstParamsBound = false;
    }
    //Updating the param html assuming the param items have changed
    $j("#hdnParamHtml").val($j("#dvParamCont").html());
    isDepsProcessed = true;
    if (formSubmited) {
        $j("#button1").click();
    }
}

function ValidateOnSubmit() {
    GetCurrentTime("Iview param Search button click(Post back)");
    ShowDimmer(true);

    var isInValid = true;
    $j("#hdnParamHtml").val($j("#dvParamCont").html());
    if (validateParamOnGo) {
        for (j = 0; j < parentArr.length; j++) {
            paramType = hiddenArr[j];
            if (paramType != "true") {
                expr = vExpressions[j];
                fldName = parentArr[j];
                if (expr != "") {
                    var result = Evaluate(fldName, fldName.valueOf(), expr, 'vexpr', "iview");
                    if (result != "T" && result != "true") {
                        var fcharRes = result.substring(0, 1);
                        if (fcharRes == "_") {
                            result = result.substring(1);
                            showAlertDialog("error", result);
                            var fld = $j("#" + fldName);
                            if (fld.length) {
                                fld.val('');
                                try {
                                    fld.focus();
                                } catch (ex) { }
                            }
                            return;
                        } else if (!confirm(result + ". Do you want to continue?"))
                            setTimeout("document.getElementById('" + paramNm + "').focus();", 50);

                        isInValid = false;
                        break;
                    }
                }
            }
        }
    }
    if (!clearParams) {
        if (isInValid)
            isInValid = GetParamValues("", (window?.event || arguments?.callee?.caller?.arguments?.[0] || ""));
    }
    arrCheckedFilter.length = 0;

    $("#newViewparams").val($j("#hdnparamValues").val());
    if (isDepsProcessed) {
        formSubmited = false;
        if (isInValid) {
            totRowCount = '';
            clearAdvancedFiltersforNewData();
            var linkParams = $j("#hdnparamValues").val();
            linkParams = linkParams.replace(/~/g, "=");
            linkParams = linkParams.replace(/¿/g, "&");
            linkParams = ReplaceUrlSpecialChars(linkParams);
            if (linkParams != "") {
                setIviewNavigationData(linkParams, iName);
                callParentNew("updateAppLinkObj")?.(window.location.href.replace("iview.aspx?ivname=", "ivtoivload.aspx?ivname=") + "&AxIvNav=true",1,window?.frameElement?.id == "axpiframe");
            }
            resetSmartViewVariables();
            try {
                $(".multiFldChk").each(function () {
                    if ($(this).data('bs.tokenfield')) {
                        $(this).attr("data-selectedlist", $(this).tokenfield("getTokensList"));
                        $(this).tokenfield('destroy');
                    }
                });
                $("select.trySelect, select.trySelectPl, select.trySelectMs").each(function () {
                    try {
                        $(this).select2('destroy');
                    } catch (ex) {}
                });
            } catch (ex) { }
            $(".multiFldChk, select.trySelect, select.trySelectPl, select.trySelectMs").length > 0 && $('#Filterscollapse')?.collapse?.('hide') && $j("#hdnParamHtml").val($j("#dvParamCont").html());
        }
        else {
            $(".animationLoading").hide();
            ShowDimmer(false);
        }
        GetProcessTime();
        $j("#hdnbElapsTimeGo").val(callParentNew("browserElapsTime"));
        return isInValid;
    } else {
        formSubmited = true;
        return false;
    }
}

function evalParamExprHandler() {
    parentArr.forEach((val, ind) => {
        if ((typeArr[ind].toLowerCase() == "accept") && (Expressions[ind] !== "" && Expressions[ind].toLowerCase() !== "date()" && !exprSuggestions[ind] && hiddenArr[ind] != "true")) {

            ExprHandler(val, "");
        }
    });
}

function FillHiddenValues(paramName) {
    var i = 0;
    var j = 0;
    var cnt = 0;
    var paramType = "";
    var expr = "";
    var fldName = "";
    var isDependent = false;
    for (i = 0; i < parentArr.length; i++) {
        if (parentArr[i] == paramName) {
            cnt = i + 1;
            for (j = cnt; j < parentArr.length; j++) {
                paramType = hiddenArr[j];
                if (paramType == "true") {
                    expr = Expressions[j];
                    fldName = parentArr[j];
                    if (expr != "") {
                        ExprHandler(fldName, '');
                    }

                    FillDependents(fldName);
                    isDependent = true;
                    break;

                } else {
                    break;
                }
            }
            if (isDependent == true)
                break;
        }
    }
}

//function to return the date in a format required  by the GetChoicesXML service.
function GetDateParamFormat(Pdate) {
    var arrdt = new Array();
    arrdt = Pdate.split("/");
    var mon = "";
    mon = arrdt[1];
    mon = eval(mon) - 1;
    var monthNames = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
    mon = monthNames[mon];

    var strDate = "";
    strDate = arrdt[0] + "-" + mon + "-" + arrdt[2];

    return strDate;

}


//Functions inserted for handling Expression dependencies

//<Module>  TStruct </Module>
//<Author>  Naveen  </Author>
//<Description> Function to Evaluate expressions on onblur event </Description>
//<Return> Returns the evaluated Result </Return>
var result = "";
var expfield = "";
var expfieldname = "";

function ExprHandler(ExpfldName, objName, focus = false) {
    //field containing the expression.
    if ((focus && objName == "") || !focus) {
        expfield = ExpfldName.toString();
        for (var j = 0; j < parentArr.length; j++) {
            if (expfield == parentArr[j]) {
                if (Expressions[j] != "") {
                    GetParamValues();
                    paramValuesArray = getParamsValueArray();
                    result = Evaluate(expfield, ExpfldName.valueOf(), Expressions[j], "expr");
                    if ((result == "username") || (result == "usergroup")) { } else {
                        assignfldvaliv(expfield, result);
                    }
                    break;
                } //End if checking Expressions null or not
            } //End if checking whether field is present or not
        } //End For
    }
}

function assignfldvaliv(flname, fval) {

    var actFldnamesv = flname;
    var datatype = "";
    var fld = $j("#" + flname);
    if (fld.length) // if field exists
    {
        // fix for datetype field returning 0
        for (var z = 0; z < parentArr.length; z++) {
            if (parentArr[z] == flname) {
                datatype = typeArr[z];
            }
        }
        if ((fld.prop("type") == "text") || (fld.prop("type") == "hidden")) {
            if (fval == "''")
                fval = "";
            if (!fval) fval = "";
            if (datatype == "Date/Time") {
                if (fval == 0)
                    fval = "";
            }
            if (typeof fval == "string")
                fval = checkIVSpecialCharInGlobalVar(fval);
            fld.val(fval);
        } else if (fld.prop("type") == "select-one") {
            var cblen = fld.find('option').length;
            for (var cbi = 0; cbi < cblen; cbi++) {
                if (fld.val() == fval) {
                    break;
                }
            }
            fld[cbi].selectedIndex;
        }
    }
}

function checkIVSpecialCharInGlobalVar(str) {
    str = str.replace(/&amp;/g, "&");
    str = str.replace(/&lt;/g, "<");
    str = str.replace(/&gt;/g, ">");
    str = str.replace(/&apos;/g, "'");
    str = str.replace(/&quot;/g, "\\");
    return str;
}

function ValidateVexpr(paramNm, vexpr) {
    if (validateParamOnGo)
        return;
    var result = Evaluate(paramNm, paramNm.valueOf(), vexpr, 'vexpr', "iview");
    if (result != "T" && result != "true") {
        var fcharRes = result.substring(0, 1);
        if (fcharRes == "_") {
            result = result.substring(1);
            showAlertDialog("error", result);
            var fld = $j("#" + paramNm);
            if (fld.length) {
                fld.val('');
                try {
                    fld.focus();
                } catch (ex) { }
            }
            return;
        }

        var cutMsg = appGlobalVarsObject.lcm[7];
        cutMsg = cutMsg.replace('{0}', result);
        var glType = callParentNew('gllangType');
        var isRTL = glType == "ar" ? true : false;
        var ValidateVexprCB = $.confirm({
            theme: 'modern',
            closeIcon: false,
            title: appGlobalVarsObject.lcm[155],
            rtl: isRTL,
            onContentReady: function () {
                disableBackDrop('bind');
            },
            backgroundDismiss: 'false',
            escapeKey: 'buttonB',
            content: cutMsg,
            buttons: {
                buttonA: {
                    text: appGlobalVarsObject.lcm[164],
                    btnClass: 'btn btn-primary',
                    action: function () {
                        disableBackDrop('destroy');
                        ValidateVexprCB.close();
                    }
                },
                buttonB: {
                    text: appGlobalVarsObject.lcm[192],
                    btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                    action: function () {
                        setTimeout("document.getElementById('" + paramNm + "').focus();", 50);
                    }
                }
            }
        });
    }
}


function SetParamxml() {
    ShowDimmer(true);
    $j("#hdnGo").val('');
}
var curPageNo = 1;

function ToggleParams() {
    var divParams;
    divParams = $j("#paramCont");
    var imgFld = document.getElementById("imgArrow");
    var imgFld = $j("#imgArrow");

    if (imgFld.attr("alt") == "Hide") {
        imgFld.attr({
            alt: 'Show',
            src: '../AxpImages/arrowup.png'
        });
        divParams.hide();
    } else if (imgFld.attr("alt") == "Show") {
        imgFld.attr({
            alt: 'Hide',
            src: '../AxpImages/arrowdown.png'
        });
        divParams.show();
    }
}
//Function to check all the row once the header row is checked.
//Calling from iview & listview.
function CheckAll(forcedEnable) {

    var chkAll = $j("#chkall");
    if (typeof forcedEnable != "undefined") {
        chkAll.prop("checked", forcedEnable)
    }

    var chkItems;

    if (chkAll.prop("checked") == true) {
        chkItems = $j("input[name=chkItem]:checkbox").each(function () {
            $j(this).prop("checked", true);
        });
    } else {
        chkItems = $j("input[name=chkItem]:checkbox").each(function () {
            $j(this).prop("checked", false);
        });
    }
}

function CheckCond(obj) {
    var value2 = $j("#filVal2");

    if (obj.value == "between") {
        value2.prop("disabled", false);
    } else {
        value2.prop("disabled", true);
    }
}

var isDtSelected = false;
function AddDatePicker(parentID = "") {
    parentID = (!parentID.startsWith("#") && parentID != "") ? ("#" + parentID + " ") : parentID;

    if ($(parentID + ".date").length > 0) {
        $(parentID + ".date").parent().flatpickr({
            dateFormat: dtFormat,
            disableMobile: "true",
            allowInput: true,
            wrap: true,
            onChange(selectedDates, dateStr, instance) {
                isDtSelected = true;
            }
        });
    }
}

function compareDates(dtObj) {
    if (iviewValidatedate(dtObj)) {
        if (dtObj.parents(".gridDataFilter").length) {
            var objID = dtObj.attr("id")
            var obj1 = $("#" + objID.substr(0, objID.length - 1) + "1");
            var obj2 = $("#" + objID.substr(0, objID.length - 1) + "2");
            var obj1Val = 0;
            var obj2Val = 0;
            try {
                obj1Val = obj1.datepicker("getDate").getTime();
            } catch (ex) { }
            try {
                obj2Val = obj2.datepicker("getDate").getTime();
            } catch (ex) { }
            if (obj1Val > obj2Val && obj1Val != 0 && obj2Val != 0) {
                dtObj.val("");
                dtObj.focus();
                showAlertDialog("warning", callParentNew('lcm')[89]);
            }
        }
    }
}

function AddTimePicker(parentID = "") {
    parentID = (!parentID.startsWith("#") && parentID != "") ? ("#" + parentID + " ") : parentID;

    if ($(parentID + ".onlyTime").length > 0) {
        $(parentID + ".onlyTime").parent().flatpickr({
            enableTime: true,
            noCalendar: true,
            dateFormat: "H:i",
            time_24hr: true,
            disableMobile: "true",
            wrap: true
        });

    }
}

function GetUserLocale() {
    for (var i = 0; i < Parameters.length; i++) {

        var parameter = Parameters[i].split("~");
        if (parameter[0] == "Culture") {
            dtCulture = parameter[1];
        }
    }

    dtCulture = callParentNew('glCulture') || dtCulture;

    dtFormat = GetDateFormat(dtCulture);
    dateString = dtFormat;
}

function loadParent(a, b) {
    var gov = document.getElementById("searchlist");
    var grviewpno = document.getElementById("pgno");
    var pno = parseInt(grviewpno.value)
    gov.selectedIndex = (pno * 10) + parseInt(a, 10);
    var govlistval = "searchlistval";
    SetSelectedValue(gov, govlistval, b);
}

function SetSelectedValue(listcontrol, listctrl, b) {
    if (listcontrol[listcontrol.selectedIndex].value != -1) {
        var fname = b;
        var result = listcontrol[listcontrol.selectedIndex].value;

        $(callParentNew(fname, "id")).append(new Option(result, result, true, true)).trigger("change");

        var iVData = $("#hdnIViewData2").val();
        if (iVData != "") {
            applyAdvPicklistData(fname, listcontrol.selectedIndex, iVData);
        }

        var len = eval('form1.' + listctrl + '.options.length');
        if (len > 0) {
            if (eval('form1.' + listctrl + '[' + listcontrol.selectedIndex + '].value') != -1) {
                var fldarr = eval('form1.' + listctrl + '[' + listcontrol.selectedIndex + '].value');
                fldarr = fldarr.split('~');
                for (var fill = 0; fill < fldarr.length; fill++) {
                    if (fldarr[fill] != "") {
                        var fieldnm = fldarr[fill].toString();
                        fieldnm = fieldnm.split('***');
                        if (eval("document.forms['f1']." + fieldnm[0] + cbnameExt)) {
                            if (eval("document.forms['f1']." + fieldnm[0] + cbnameExt + ".type") != "radio") {
                                if (fieldnm[1] == "*") {
                                    eval('document.f1.' + fieldnm[0] + cbnameExt + '.value=""');
                                } else {
                                    eval('document.f1.' + fieldnm[0] + cbnameExt + '.value="' + fieldnm[1] + '"');
                                }
                            }
                        }
                    }
                }
            }
        }

        callParentNew("ivPlAdvSearch", "id").dispatchEvent(new CustomEvent("close"));
    }
}

function applyAdvPicklistData(fldId, inddd, iVData) {
    try {
        var fld = $(callParentNew(fldId, "id"));
        if (iVData) {
            var jsonObject = $.parseJSON(iVData);

            var jsonInputIndex = (((inddd + 1) % 10) - 1);

            if (jsonInputIndex == -1) {
                jsonInputIndex = 9;
            }

            var loopData = jsonObject?.sqlresultset?.response?.row?.[jsonInputIndex];

            (Object.keys(loopData || [])).forEach((key, ind, realArr) => {
                var str = typeof loopData[key] == "string" ? loopData[key] : loopData[key]["#text"];

                fld.data(`optionsss${ind > 0 ? key : realArr[0]}`, str);

                if (!(ind == 0 || !loopData[key]["@dt"])) {
                    fld.data(`dtypeee${ind > 0 ? key : realArr[0]}`, loopData[key]["@dt"]);
                }
            });
        }
    } catch (ex) { }
}

var depParamCnt = 0;
var isFstParamsBound = false;
var onLoadDep = false;
//On load parameter ,Get all the depentent value
function FillDependentsStartup(isParamVal) {
    var stTime = new Date();
    depParamCnt = 0;
    isFstParamsBound = isParamVal;

    try {
        AxFillDepOnLoad();
    } catch (ex) {

    }

    if ((isParamVal == true && isFromClearBtn == false) || $("#hdnSelParamsAftrChWin").val() != "") {
        submittedOnLoad = true;
        setTimeout(function () {
            document.getElementById('button1').click();
            isFstParamsBound = false;
        }, 0);
    } else if (isFromClearBtn) {
        submittedOnLoad = false;
        isFstParamsBound = false;
        onLoadDep = true;
        $(".animationLoading").hide();
    }
    else {
        submittedOnLoad = false;
        onLoadDep = true;
        $(".animationLoading").hide();
    }
}

//show the tooltip for iview dropdownlist
function showHideTooltip(objId) {

    try {
        document.getElementById(objId).title = (document.getElementById(objId).options[($("#" + objId)[0].selectedIndex)].text);
    } catch (ex) { }
}

//This function also available in the process.js
function CheckSpCharsInFldValueIview(fldValue) {

    var index = fldValue.indexOf("^^dq");
    while (index != -1) {
        fldValue = fldValue.replace("^^dq", '%22');
        index = fldValue.indexOf("^^dq");
    }
    if (fldValue.indexOf(";bkslh") != -1) {
        fldValue = fldValue.replace(new RegExp(";bkslh", "g"), "\\");
    }
    return fldValue;
}

// Show hide  on row click for list view action

function showHide(id) {

    var i = id;
    var lstCust = $j(".ListCust");
    lstCust.hide();

    $j("#div" + i).show();

    $j('#tblProp tr').each(function () {

        var cls = $j(this)[0].className


        if (cls.indexOf('selProperty') >= 0) {
            $j(this).removeClass('selProperty');
            $j(this).addClass('RowCust');
        }
    })

    $j("#" + i).removeClass('RowCust');
    $j("#" + i).addClass('selProperty');
}

//Open List view action winow
function openListActionWin() {
    $j(".ListCust").hide();
    $j("#divtr1").show();
    $j("#tr1").css('background-color', '#D9D2D4');
    $j("#divAction").dialog({ title: "List view actions", height: 400, width: 800, position: 'center', modal: true, buttons: { "Ok": function () { ApplyCondition($j(this)); } } });
    Adjustwin();
}

function ApplyCondition(dialogObj) {
    $j("#button1").click();
}

function ToggleParamsLstProp() {
    var divParams;
    var divProp = $j("#divProperty");
    var imgFld = document.getElementById("imgArrow");
    var imgFld = $j("#imgArrow");

    if (imgFld.attr("alt") == "Hide") {
        imgFld.attr({
            alt: 'Show',
            src: '../AxpImages/arrow-up-black.gif'
        });
        divProp.hide();
    } else if (imgFld.attr("alt") == "Show") {
        imgFld.attr({
            alt: 'Hide',
            src: '../AxpImages/arrow-down-black.gif'
        });
        divProp.show();
    }
}

function client_OnTreeNodeCheckedList() {
    var obj = window.event.srcElement;
    var treeNodeFound = false;
    var checkedState;
    ValidateGridDc();

    if (griddccnt > 1) {
        var treeNode = obj;
        treeNode.checked = false;
        return;
    }
    if (obj.tagName == "INPUT" && obj.type == "checkbox") {
        var treeNode = obj;
        checkedState = treeNode.checked;
        if (checkedState == true || checkedState == false) {
            if (hdnTree == "") {
                hdnTree += treeNode.parentElement.children[1].innerHTML;
            } else {
                hdnTree += "~" + treeNode.parentElement.children[1].innerHTML;
            }
            NewTree.push(treeNode.parentElement.children[1].innerHTML);
        }

        do {
            obj = obj.parentElement;
        } while (obj.tagName != "TABLE")
        var parentTreeLevel = obj.rows[0].cells.length;
        var parentTreeNode = obj.rows[0].cells[0];
        var tables = obj.parentElement.getElementsByTagName("TABLE");
        var numTables = tables.length
        if (numTables >= 1) {
            for (i = 0; i < numTables; i++) {
                if (tables[i] == obj) {
                    treeNodeFound = true;
                    i++;
                    if (i == numTables) {
                        return;
                    }
                }
                if (treeNodeFound == true) {
                    changed = true;
                    var childTreeLevel = tables[i].rows[0].cells.length;
                    if (childTreeLevel > parentTreeLevel) {
                        var cell = tables[i].rows[0].cells[childTreeLevel - 1];
                        var inputs = cell.getElementsByTagName("INPUT");
                        inputs[0].checked = checkedState;
                    } else {
                        return;
                    }
                }
            }
        }
    }
}

var griddccnt = 0;

function ValidateGridDc() {
    var PNode;
    griddccnt = 0;
    $j('#tvList input[type=checkbox]:checked').each(function () {
        if ($j(this).parentNode != undefined)
            PNode = $j(this).parentNode;
        else
            PNode = $j(this);

        if (PNode[0].nextSibling.innerHTML.indexOf("Grid DC") != -1)
            griddccnt++;
    });

    if (griddccnt > 1)

        showAlertDialog("warning", 3018, "client");
    return;
}

var childdccnt = 0;
var childdccnt1 = 0;
var childdccnt2 = 0;

function validateChildDc() {
    var indc = 0;
    var obj = window.event.srcElement;

    var treeNode = obj;
    var TreeView = document.getElementById("tvList")
    var checkboxs = TreeView.getElementsByTagName("input")
    childdccnt1 = 0;
    childdccnt2 = 0;
    for (i = 0; i < checkboxs.length; i++) {
        if (checkboxs[i].type == "checkbox") {

            var NodeText = checkboxs[i].nextSibling.innerHTML;
            if (checkboxs[i].nextSibling.innerHTML.indexOf("Grid DC") != -1) {
                indc = 1 + indc;
            }
            if (checkboxs[i].checked && indc == 1) {
                childdccnt1 = 1;
            } else if (checkboxs[i].checked && indc == 2) {
                childdccnt2 = 2;
            }
        }
    }

    if (childdccnt1 >= 1 && childdccnt2 >= 2)

        showAlertDialog("warning", 3018, "client");
    return;
}

var fldName = "";

function checkDc() {

    var strnorepeat = $j("#hdnNoRepeat").val();
    $j('#tblNorep input[type=checkbox]').each(function () {
        var chkName = $j(this)[0].value;
        var tbl = $j(this);
        var nodecount = 0;
        $j('#tvList input[type=checkbox]:checked').each(function () {

            var node = $j(this).next('a');
            var nodeValue = '';
            var nodePath = node.attr('href').substring(node.attr('href').indexOf(",") + 2, node.attr('href').length - 2);
            var nodeValues = nodePath.split("\\");
            if (nodeValues.length > 1) {
                nodeValue = nodeValues[nodeValues.length - 1];
            }
            else {
                nodeValue = nodeValues[0].substr(1);
            }

            if (chkName == nodeValue) {
                nodecount = 1;
            }
        })

        if (nodecount == 0) {
            tbl.parent().parent().remove();
        }
    })

    var PNode = "";
    var parents = $j("#hdnParent").val();
    $j('#tvList input[type=checkbox]:checked').each(function () {
        PNode = $j(this);
        if (parents.indexOf(PNode[0].nextSibling.innerHTML) != -1 && (PNode[0].nextSibling.innerHTML) != "") { } else {
            fldName = 0;

            var NodeText = PNode[0].nextSibling.innerHTML;
            var node = $j(this).next('a');
            var nodeValue = '';
            var nodePath = node.attr('href').substring(node.attr('href').indexOf(",") + 2, node.attr('href').length - 2);
            var nodeValues = nodePath.split("\\");
            if (nodeValues.length > 1) {
                nodeValue = nodeValues[nodeValues.length - 1];
            }
            else {
                nodeValue = nodeValues[0].substr(1);
            }
            var tableRef = document.getElementById('tblNorep');

            $j('#tblNorep input[type=checkbox]').each(function () {
                var a = $j(this)[0].title;

                var value = $j(this)[0].value;

                if (value == nodeValue) {
                    fldName = 1;
                }
            });

            if (fldName == 0) {
                var len = $j('#tblNorep tr').length;
                var tableRow = tableRef.insertRow(len);
                var tableCell = tableRow.insertCell();
                var checkBoxRef = document.createElement('input');
                var labelRef = document.createElement('label');

                checkBoxRef.type = 'checkbox';
                checkBoxRef.value = nodeValue;
                checkBoxRef.title = NodeText;
                labelRef.innerHTML = NodeText;
                tableCell.title = NodeText;

                tableCell.appendChild(checkBoxRef);
                tableCell.appendChild(labelRef);

            }
        }
    });

    if (strnorepeat != "" || strnorepeat != null) {
        $j('#tblNorep input[type=checkbox]').each(function () {
            var value = $j(this)[0].value;
            if (strnorepeat.indexOf(value) != -1) {
                $j(this)[0].checked = true;
            }

        });
    }
}

var fld = "";

function bindSubtotalColmn() {

    var strsubtotlCaptn = $j("#hdnSubtotlCaptn").val();

    $j('#tblSubtotal  input[type=checkbox]').each(function () {

        var chkName = $j(this)[0].value;
        var tbl = $j(this);
        var nodecount = 0;
        $j('#tvList input[type=checkbox]:checked').each(function () {

            PNode = $j(this);
            var node = $j(this).next('a');
            var nodeValue = '';
            var nodePath = node.attr('href').substring(node.attr('href').indexOf(",") + 2, node.attr('href').length - 2);
            var nodeValues = nodePath.split("\\");
            if (nodeValues.length > 1) {
                nodeValue = nodeValues[nodeValues.length - 1];
            }
            else {
                nodeValue = nodeValues[0].substr(1);
            }
            if (chkName == nodeValue) {
                nodecount = 1;
            }
        });

        if (nodecount == 0) {
            tbl.parent().parent().remove();
        }
    });

    var PNode = "";
    var parents = $j("#hdnParent").val();
    $j('#tvList input[type=checkbox]:checked').each(function () {

        PNode = $j(this);

        if (parents.indexOf(PNode[0].nextSibling.innerHTML) != -1 && (PNode[0].nextSibling.innerHTML) != "") { } else {
            fld = 0;

            var NodeText = PNode[0].nextSibling.innerHTML;
            var tableRef = document.getElementById('tblSubtotal');

            var node = $j(this).next('a');
            var nodeValue = '';
            var nodePath = node.attr('href').substring(node.attr('href').indexOf(",") + 2, node.attr('href').length - 2);
            var nodeValues = nodePath.split("\\");
            if (nodeValues.length > 1) {
                nodeValue = nodeValues[nodeValues.length - 1];
            }
            else {
                nodeValue = nodeValues[0].substr(1);
            }

            $j('#tblSubtotal  input[type=checkbox]').each(function () {

                var value = $j(this)[0].value;

                if (strsubtotlCaptn.indexOf(value) != -1) {
                    $j(this)[0].checked = true;
                }
                if (value == nodeValue) {
                    fld = 1;
                }
            });

            if (fld == 0) {

                var len = $j('#tblSubtotal tr').length;
                var tableRow = tableRef.insertRow(len);
                var tableCell = tableRow.insertCell();
                var checkBoxRef = document.createElement('input');
                var labelRef = document.createElement('label');
                checkBoxRef.type = 'checkbox';
                checkBoxRef.value = nodeValue;
                checkBoxRef.title = NodeText;
                labelRef.innerHTML = NodeText + "(" + nodeValue + ")";
                labelRef.width = "20px";
                tableCell.title = NodeText;
                tableCell.appendChild(checkBoxRef);
                tableCell.appendChild(labelRef);
            }
        }
    });

    if (strsubtotlCaptn != '' || strsubtotlCaptn != null) {
        $j('#tblSubtotal  input[type=checkbox]').each(function () {

            var value = $j(this)[0].value;
            if (strsubtotlCaptn.indexOf(value) != -1) {
                $j(this)[0].checked = true;
            }
        })
    }

    $j("#tblSubtotal input[type=checkbox]").click(function () {
        var a = $j(this);
        var text = this.title;
        var val = $j(this)[0].value;

        if ($j(this).attr("checked") == "checked") {

            $j("#txtFooter").val("Total");
            $j("#txtHeader").val(val);
            $j("#ddlCaption").val(val);
            $j("#txtSubOrder").val("0");

        } else {
            if ($j("#txtHeader").val() == text) {

                $j("#txtFooter").val("");
                $j("#txtHeader").val("");
                $j("#ddlCaption option:selected").text("");
                $j("#ddlCaption option:selected").val("");
                $j("#txtSubOrder").val("");
            }
            $j('#tblSubtotlList').each(function () {
                var a = $j('#tblSubtotlList tr > td:contains(' + text + ')').parent().remove();
            });
        }
    });

    $j("#tblSubtotal").each(function () {
        $j("tr", this).addClass("clsSubtotl");
    });
}

function bindSubttlDrpdwn() {

    $j("#ddlCaption").empty();
    var parents = $j("#hdnParent").val();
    var drpdown = $j("#ddlCaption");
    var options = '<option value="' + "" + '">' + "" + '</option>';
    $j('#tvList input[type=checkbox]:checked').each(function () {
        if ($j(this).parentNode != undefined) {
            PNode = $j(this).parentNode;
        }
        else {
            PNode = $j(this);

            if (parents.indexOf(PNode[0].nextSibling.innerHTML) != -1 && (PNode[0].nextSibling.innerHTML) != "") { } else {

                var NodeText = PNode[0].nextSibling.innerHTML;
                var node = $j(this).next('a');
                var nodeValue = '';
                var nodePath = node.attr('href').substring(node.attr('href').indexOf(",") + 2, node.attr('href').length - 2);
                var nodeValues = nodePath.split("\\");
                if (nodeValues.length > 1) {
                    nodeValue = nodeValues[nodeValues.length - 1];
                }
                else {
                    nodeValue = nodeValues[0].substr(1);
                }

                options += '<option value="' + nodeValue + '">' + NodeText + '</option>';
            }
        }
    });
    drpdown.html(options);
}

//Add new condition row
function AddNewListCondition() {

    var dv = document.getElementById("tblFilter");
    var rowCount = "0";
    var rowCnt = document.getElementById("FilterRowCount");
    if (rowCnt) {
        rowCount = rowCnt.value;
    }
    var index = (parseInt(rowCount) + 1).toString();
    var newRow = dv.insertRow();
    var ocell = newRow.insertCell();
    ocell = newRow.insertCell();
    var el = document.createElement("input");
    el.type = "radio";
    el.name = "grpAndOr" + index;
    el.id = "radAnd" + index;
    el.value = "And";
    var el1 = document.createElement("input");
    el1.type = "radio";
    el1.name = "grpAndOr" + index;
    el1.id = "radOr" + index;
    el1.value = "Or";

    ocell.appendChild(el);
    var spn = document.createElement("span");
    spn.innerHTML = "And";
    ocell.appendChild(spn);

    ocell.appendChild(el1);
    spn = document.createElement("span");
    spn.innerHTML = "Or";
    ocell.appendChild(spn);
    ocell.style.align = "right";

    var rad = document.getElementById("radOr" + index);
    if (rad)
        rad.checked = true;

    var newRow = dv.insertRow();
    index = (parseInt(index) + 1).toString();
    var cell = newRow.insertCell();
    var ddlClm = document.createElement("select");
    ddlClm.id = "ddlListFilter" + index;
    ddlClm.className = "lblTxt";
    ddlClm.style.width = "120px";
    cell.appendChild(ddlClm);

    var ddlFilter = document.getElementById("ddlListFilter" + index);
    ddlFilter.length = 0;
    if (ddlFilter) {
        var parDll = document.getElementById("ddlListFilter");
        if (parDll.length > 0) {
            for (var i = 0; i < parDll.length; i++) {
                var opt = document.createElement("option");
                opt.text = parDll.options[i].text;
                opt.value = parDll.options[i].value;
                ddlFilter.options.add(opt);
            }
        }
    }

    cell = newRow.insertCell();
    var ddlOpr = document.createElement("select");
    ddlOpr.id = "ddlOpr" + index;
    ddlOpr.className = "lblTxt";
    cell.appendChild(ddlOpr);

    var ddlOperator = document.getElementById("ddlOpr" + index);
    ddlOperator.length = 0;
    if (ddlOperator) {
        var parOpr = document.getElementById("ddlListFilcond");
        if (parOpr.length > 0) {
            for (var i = 0; i < parOpr.length; i++) {
                var opt = document.createElement("option");
                opt.text = parOpr.options[i].text;
                opt.value = parOpr.options[i].value;
                ddlOperator.options.add(opt);
            }
        }
    }

    cell = newRow.insertCell();
    var inpVal1 = document.createElement("input");
    inpVal1.type = "text";
    inpVal1.id = "txtFilter" + index;
    inpVal1.className = "lblTxt";
    inpVal1.style.width = "160px";
    cell.appendChild(inpVal1);

    cell = newRow.insertCell();
    var inpVal1 = document.createElement("input");
    inpVal1.type = "text";
    inpVal1.id = "txtFillVal" + index;
    inpVal1.className = "lblTxt";
    inpVal1.style.width = "160px";
    cell.appendChild(inpVal1);

    cell = newRow.insertCell();

    //Added the anchor tag to hold the delete button since the onclick event cannot be assigned for image.
    var anc = document.createElement("a");
    anc.id = "delAnc" + index;
    anc.href = "javascript:DeleteListCondition('" + index + "');";
    anc.className = "ancLink";

    var delImg = document.createElement("span");
    delImg.className = "curHand icon-arrows-circle-minus";
    delImg.id = "delCond" + index;
    anc.appendChild(delImg);
    cell.appendChild(anc);

    rowCnt.value = index;
}

function AddCondition() {
    var isSafari = navigator.vendor.indexOf("Apple") == 0 && /\sSafari\//.test(navigator.userAgent);
    if (isSafari) {
        var dv = document.getElementById("tblFilter");
        var rowCount = "0";
        var rowCnt = document.getElementById("FilterRowCount");
        if (rowCnt)
            rowCount = rowCnt.value;
        var index = (parseInt(rowCount) + 1).toString();
        var newRow = dv.appendChild(document.createElement("tr"));

        var cell = newRow.insertCell();
        var anc = document.createElement("a");
        anc.id = "delAnc" + index;
        anc.title = "Remove condition";
        anc.href = "javascript:DeleteListCondition('" + index + "');";

        var delImg = document.createElement("span");
        delImg.className = "curHand icon-arrows-circle-minus";
        delImg.id = "delCond" + index;


        anc.appendChild(delImg);
        cell.appendChild(anc);

        cell = newRow.insertCell();
        var inpVal1 = document.createElement("input");
        inpVal1.type = "text";
        inpVal1.id = "txtFillVal" + index;
        inpVal1.className = "txtfilter tem Family form-control";
        inpVal1.title = "Enter filter text";
        inpVal1.style.width = "180px";
        cell.appendChild(inpVal1);

        cell = newRow.insertCell();
        var inpVal1 = document.createElement("input");
        inpVal1.type = "text";
        inpVal1.id = "txtFilter" + index;
        inpVal1.className = "txtfilter tem Family form-control";
        inpVal1.title = "Enter filter text";
        inpVal1.style.width = "180px";
        cell.appendChild(inpVal1);

        cell = newRow.insertCell();
        var ddlOpr = document.createElement("select");
        ddlOpr.id = "ddlOpr" + index;
        ddlOpr.className = "ddlListFilter combotem Family form-control";
        ddlOpr.title = "Select filter conditions";
        ddlOpr.style.width = "145px";
        cell.appendChild(ddlOpr);

        var a = $j("ddlListFilter").width();
        var ddlOperator = document.getElementById("ddlOpr" + index);
        ddlOperator.length = 0;
        if (ddlOperator) {
            var parOpr = document.getElementById("ddlListFilcond");
            if (parOpr.length > 0) {
                for (var i = 0; i < parOpr.length; i++) {
                    var opt = document.createElement("option");
                    opt.text = parOpr.options[i].text;
                    opt.value = parOpr.options[i].value;
                    ddlOperator.options.add(opt);
                }
            }

        }

        var cell = newRow.insertCell();
        var ddlClm = document.createElement("select");
        ddlClm.id = "ddlListFilter" + index;
        ddlClm.className = "ddlListFilter combotem Family form-control";
        ddlClm.title = "Select column";
        ddlClm.style.width = "200px";
        cell.appendChild(ddlClm);

        var ddlFilter = document.getElementById("ddlListFilter" + index);
        ddlFilter.length = 0;
        if (ddlFilter) {
            var parDll = document.getElementById("ddlListFilter");
            if (parDll.length > 0) {
                for (var i = 0; i < parDll.length; i++) {
                    var opt = document.createElement("option");
                    opt.text = parDll.options[i].text;
                    opt.value = parDll.options[i].value;
                    ddlFilter.options.add(opt);
                }
            }
        }

        var ocell = newRow.insertCell();
        ocell = newRow.insertCell();

        var el = document.createElement("input");
        el.type = "radio";
        el.name = "grpAndOr" + index;
        el.id = "radAnd" + index;
        el.value = "And";
        var el1 = document.createElement("input");
        el1.type = "radio";
        el1.name = "grpAndOr" + index;
        el1.id = "radOr" + index;
        el1.value = "Or";

        ocell.className = "paramtd1";
        ocell.appendChild(el);
        var spn = document.createElement("span");
        spn.innerHTML = "And";
        ocell.appendChild(spn);

        ocell.appendChild(el1);
        spn = document.createElement("span");
        spn.innerHTML = "Or";
        ocell.appendChild(spn);
        ocell.style.align = "right";

        var rad = document.getElementById("radOr" + index);
        if (rad)
            rad.checked = true;

        rowCnt.value = index;
        var a = $j("dvNewrow").height();
        var b = $j("tblpanel").height();
    } else {
        var dv = document.getElementById("tblFilter");

        var rowCount = "0";

        var rowCnt = document.getElementById("FilterRowCount");
        if (rowCnt)
            rowCount = rowCnt.value;
        var index = (parseInt(rowCount) + 1).toString();

        var newRow = dv.insertRow();
        newRow.setAttribute("id", "tblFilterRowID" + index);
        var ocell = newRow.insertCell();
        ocell = newRow.insertCell();
        var el = document.createElement("input");
        el.type = "radio";
        el.name = "grpAndOr" + index;
        el.id = "radAnd" + index;
        el.value = "And";
        var el1 = document.createElement("input");
        el1.type = "radio";
        el1.name = "grpAndOr" + index;
        el1.id = "radOr" + index;
        el1.value = "Or";

        ocell.className = "paramtd1";
        ocell.appendChild(el);
        var spn = document.createElement("span");
        spn.innerHTML = "And";
        ocell.appendChild(spn);

        ocell.appendChild(el1);
        spn = document.createElement("span");
        spn.innerHTML = "Or";
        ocell.appendChild(spn);
        ocell.style.align = "right";

        var cell = newRow.insertCell();
        var ddlClm = document.createElement("select");
        ddlClm.id = "ddlListFilter" + index;
        ddlClm.className = "ddlListFilter combotem Family form-control";
        ddlClm.title = "Select column";
        ddlClm.style.width = "200px";
        cell.appendChild(ddlClm);

        var ddlFilter = document.getElementById("ddlListFilter" + index);
        ddlFilter.length = 0;
        if (ddlFilter) {
            var parDll = document.getElementById("ddlListFilter");
            if (parDll.length > 0) {
                for (var i = 0; i < parDll.length; i++) {
                    var opt = document.createElement("option");
                    opt.text = parDll.options[i].text;
                    opt.value = parDll.options[i].value;
                    ddlFilter.options.add(opt);
                }
            }
        }

        cell = newRow.insertCell();
        var ddlOpr = document.createElement("select");
        ddlOpr.id = "ddlOpr" + index;
        ddlOpr.className = "ddlListFilter combotem Family form-control";
        ddlOpr.title = "Select filter conditions";
        ddlOpr.style.width = "200px";
        cell.appendChild(ddlOpr);
        var a = $j("ddlListFilter").width();

        var ddlOperator = document.getElementById("ddlOpr" + index);
        ddlOperator.length = 0;
        if (ddlOperator) {
            var parOpr = document.getElementById("ddlListFilcond");
            if (parOpr.length > 0) {
                for (var i = 0; i < parOpr.length; i++) {
                    var opt = document.createElement("option");
                    opt.text = parOpr.options[i].text;
                    opt.value = parOpr.options[i].value;
                    ddlOperator.options.add(opt);
                }
            }
        }

        cell = newRow.insertCell();
        var inpVal1 = document.createElement("input");
        inpVal1.type = "text";
        inpVal1.id = "txtFilter" + index;
        inpVal1.className = "txtfilter tem Family form-control";
        inpVal1.title = "Enter filter text";
        inpVal1.style.width = "100px";
        cell.appendChild(inpVal1);

        cell = newRow.insertCell();
        var inpVal1 = document.createElement("input");
        inpVal1.type = "text";
        inpVal1.id = "txtFillVal" + index;
        inpVal1.className = "txtfilter tem Family form-control";
        inpVal1.title = "Enter filter text";
        inpVal1.style.width = "100px";
        cell.appendChild(inpVal1);

        cell = newRow.insertCell();

        var anc = document.createElement("a");
        anc.id = "delAnc" + index;
        anc.title = "Remove condition";
        anc.href = "javascript:DeleteListCondition('" + index + "');";

        var delImg = document.createElement("span");

        delImg.className = "curHand icon-arrows-circle-minus";
        delImg.id = "delCond" + index;

        anc.appendChild(delImg);
        cell.appendChild(anc);

        var rad = document.getElementById("radOr" + index);
        if (rad)
            rad.checked = true;

        rowCnt.value = index;

        var a = $j("dvNewrow").height();
        var b = $j("tblpanel").height();
    }
}

function DeleteListCondition(index) {
    if (window.chrome) {
        var dv = document.getElementById("tblFilterRowID" + index);
        dv.remove();
    } else {
        var delImg = document.getElementById("delAnc" + index);
        var rowIndex = delImg.parentElement.parentElement.rowIndex;
        var dv = document.getElementById("tblFilterRowID" + index);
        dv.remove();
    }
    var index = (parseInt(index) - 1).toString();
    var rowCnt = document.getElementById("FilterRowCount");
    rowCnt.value = index;

}

function RefreshFirstListCondition() {
    $("#txtListFilter").val("");
    $("#ListfilVal2").val("");
    $("#ddlListFilcond").val($("#ddlListFilcond option:first").val());
    $("#ddlListFilter").val($("#ddlListFilter option:first").val());
}

//Enable disable textbox on filter value condition
function CheckListFilterCond(index) {

    if (index == -1) {
        var ddlCond = $j("#ddlListFilcond");
        var value2 = $j("#ListfilVal2");
        var value1 = $j("#txtListFilter");
        if (ddlCond.val() == "between") {
            value1.prop("disabled", false);
            value2.prop("disabled", false);
        } else if (ddlCond.val() == "is null") {
            value1.prop("disabled", true);
            value2.prop("disabled", true);
        } else {
            value1.prop("disabled", false);
            value2.prop("disabled", true);
        }
        value2.val("");
        value1.val("");
    }
}

//Get treeview selected columns
function GetSelectedColumns() {

    var strCols = "";
    $j('#tvList input[type=checkbox]:checked').each(function () {
        if ($j(this).parentNode == undefined) {
            if (strCols == "") {
                strCols = $j(this)[0].nextSibling.innerHTML;
            }
            else {
                strCols += "," + $j(this)[0].nextSibling.innerHTML;
            }
        }

    });

    $j("#hdnColumns").val(strCols);
}

function CheckSpecialCharsInStr(str) {

    if (str == null) {
        return "";
    }
    var str = str;
    str = str.replace(/<>/g, "");
    str = str.replace(/</g, "");
    str = str.replace(/>/g, "");
    str = str.replace(/>=/g, "");
    str = str.replace(/<=/g, "");
    str = str.replace(/'/g, "");
    str = str.replace(/"/g, "");
    str = str.replace(/,/g, "");
    str = str.replace(/./g, "");
    str = str.replace(/-/g, "");

    // single and double quote are part of parameter , so not replaced.
    return str;
}

// Save all list view property filters to hidden fields to create input xml
function saveLViewActionCond() {

    if ($j("#txtViewName").val().toLowerCase() == "new" || $j("#txtViewName").val().toLowerCase() == "") {
        showAlertDialog("warning", 3019, "client");
        return false;
    }

    if ($j("#txtViewName").val().length > 15) {
        showAlertDialog("warning", 3020, "client");
        return false;
    }

    var chkd = false;
    $j('#tvList input[type=checkbox]:checked').each(function () {

        chkd = true;
    })
    if (!chkd) {
        showAlertDialog("warning", 3021, "client");
        return false;
    }

    var strCols = "";
    var parents = $j("#hdnParent").val();

    $j('#tvList input[type=checkbox]:checked').each(function () {

        PNode = $j(this);

        if (parents.indexOf(PNode[0].nextSibling.innerHTML) != -1 && (PNode[0].nextSibling.innerHTML) != "") { } else {
            var node = $j(this).next('a');
            var nodeValue = '';
            var nodePath = node.attr('href').substring(node.attr('href').indexOf(",") + 2, node.attr('href').length - 2);
            var nodeValues = nodePath.split("\\");
            if (nodeValues.length > 1) {
                nodeValue = nodeValues[nodeValues.length - 1];
            }
            else {
                nodeValue = nodeValues[0].substr(1);
            }

            if (strCols == "") {
                strCols = nodeValue;
            }
            else {
                strCols += "," + nodeValue;
            }

        }
    });

    $j("#hdnColumns").val(strCols);

    var strnorepeat = "";
    var strnorepeatCaptn = "";

    $j('#tblNorep input[type=checkbox]:checked').each(function () {

        var val = $j(this)[0].value;
        var captn = $j(this)[0].title;
        if (strnorepeat == "") {
            strnorepeat = val;
        }
        else {
            strnorepeat += "," + val;
        }

        if (strnorepeatCaptn == "") {
            strnorepeatCaptn = captn;
        }
        else {
            strnorepeatCaptn += "," + captn;
        }
    });

    var strsubtotal = "";

    var subCount = 0;
    var tblRow = $j('#tblSubtotlList tr');

    tblRow.each(function () {
        var seltdColumns = $j("#hdnColumns").val();
        var arrColumn = seltdColumns.split(',');
        var column = tblRow.parent()[0].childNodes[subCount].childNodes[0].innerHTML;
        if (arrColumn.indexOf(column) != -1) {
            strsubtotal += '<' + tblRow.parent()[0].childNodes[subCount].childNodes[0].innerHTML + 'st' + ' totalontop="' + tblRow.parent()[0].childNodes[subCount].childNodes[6].innerHTML + '">';
            strsubtotal += '<a1>' + tblRow.parent()[0].childNodes[subCount].childNodes[0].innerHTML + '</a1>'; //checkbox field name

            var header = tblRow.parent()[0].childNodes[subCount].childNodes[1].innerHTML;

            if (header.indexOf("{") == -1) {
                strsubtotal += '<a4>{' + tblRow.parent()[0].childNodes[subCount].childNodes[1].innerHTML; //header
            } else {
                strsubtotal += '<a4>' + tblRow.parent()[0].childNodes[subCount].childNodes[1].innerHTML;
            }
            if (header.indexOf("}") == -1) {
                strsubtotal += '}</a4>'; //header
            } else {
                strsubtotal += '</a4>'; //header
            }

            strsubtotal += '<a5>' + tblRow.parent()[0].childNodes[subCount].childNodes[2].innerHTML + '</a5>'; //footer
            strsubtotal += '<a12>' + tblRow.parent()[0].childNodes[subCount].childNodes[3].innerHTML + '</a12>'; //caption
            strsubtotal += '<a13>' + tblRow.parent()[0].childNodes[subCount].childNodes[4].innerHTML + '</a13>'; //subtotalorder
            strsubtotal += '<a18>' + tblRow.parent()[0].childNodes[subCount].childNodes[5].innerHTML + '</a18>'; //linespace
            strsubtotal += '</' + tblRow.parent()[0].childNodes[subCount].childNodes[0].innerHTML + 'st>';
            subCount += 1;
        }
    });

    $j("#hdnSubtotal").val(strsubtotal);

    $j("#hdnNoRepeat").val(strnorepeat);
    $j("#hdnNoRepeatCaptn").val(strnorepeatCaptn);

    var assign = $j("#ddlSortBy option:selected").val();

    $j("#hdnSort").val(assign);

    $j("#hdnSortCap").val($j("#ddlSortBy option:selected").text());

    assign = $j("#ddlGroupBy option:selected").val();

    $j("#hdnGroup").val(assign);

    $j("#hdnGroupCap").val($j("#ddlGroupBy option:selected").text());

    assign = $j("#rbtnOrder option:selected").text();
    $j("#hdnOrder").val(assign);

    assign = $j("#rbtnStatus option:selected").text();
    $j("#hdnStatus").val(assign);

    SaveListCondition();
}

// Save filter condition in list view popup
function SaveListCondition() {
    var tblFilter = document.getElementById("tblFilter");
    rowCount = tblFilter.rows.length;
    var ddlFldTypes = document.getElementById("ddlFldTypes");
    var searchXml = "";
    searchXml += "iif((";
    var displayCond = "";
    var fOpr = "";
    var fOprValue = "";
    var condTxt = "";
    var gridConditn = "";
    var xmlCond = "";

    for (var i = 0; i <= rowCount; i++) {
        var cnt = i + 1;
        if (i == 0) {
            var ddlCol = document.getElementById("ddlListFilter");
            var ddlCond = document.getElementById("ddlListFilcond");
            var txtValue1 = document.getElementById("txtListFilter");
            var txtValue2 = document.getElementById("ListfilVal2");
        } else {
            if (i > 0) {
                var ddlCol = document.getElementById("ddlListFilter" + i);
                var txtValue1 = document.getElementById("txtFilter" + i);
                var txtValue2 = document.getElementById("txtFillVal" + i);
                var ddlCond = document.getElementById("ddlOpr" + i);
            }


            if (i > 0) {
                var fOprId = "grpAndOr" + i;
                fOpr = document.getElementsByName(fOprId);
                if (fOpr) {
                    for (var j = 0; j < fOpr.length; j++) {
                        if (fOpr[j].checked) {
                            fOprValue = fOpr[j].value;
                            continue;
                        }
                    }
                }
            }
        }

        if (i == 0) {

            if (ddlCol.selectedIndex == 0 || ddlCond.selectedIndex == 0) {

                if (ddlCond.value != "is null" && txtValue1.value == "") {
                    if ($j("#lblCond").text() == "") {

                        isExistCondtn = 0;
                        return false;
                    } else {
                        var hdn = document.getElementById("hdnSubTypeCond");
                        hdn.value = $j("#lblCond").text();
                        return true;
                    }
                }
            }
        }

        var filterCol = ddlCol.value;
        var filterColCap = ddlCol[ddlCol.selectedIndex].text;
        var filterOpr = ddlCond.value;
        var filterValue1 = txtValue1.value;
        var filterValue2 = txtValue2.value;

        var cond = ddlCond[ddlCond.selectedIndex].innerHTML;
        var condval = ddlCond[ddlCond.selectedIndex].value;

        if (ddlCol.selectedIndex == 0 || ddlCond.selectedIndex == 0) {
            continue;
        } else {
            if ((i == 0) || (i >= 0)) {
                if (searchXml == "") {
                    searchXml += ConvertToExpr(filterCol, ddlFldTypes[ddlCol.selectedIndex].Text, cond, filterValue1, filterValue2);
                    displayCond += ConvertToExprStr(filterCol, filterColCap, cond, filterValue1, filterValue2);
                    gridConditn += ConvertToDisplyStr(filterCol, filterColCap, cond, filterValue1, filterValue2);
                    xmlCond += ConvertToXml(filterCol, filterColCap, ddlFldTypes[ddlCol.selectedIndex].innerHTML, condval, filterValue1, filterValue2, i + 1, fOprValue);
                } else {
                    if (fOprValue == "Or") {
                        displayCond += " Or ";
                        searchXml += "|";
                        gridConditn += " Or ";
                    } else if (fOprValue == "And") {
                        displayCond += " And ";
                        searchXml += "&";
                        gridConditn += " And ";
                    }
                    displayCond += ConvertToExprStr(filterCol, filterColCap, cond, filterValue1, filterValue2);
                    gridConditn += ConvertToDisplyStr(filterCol, filterColCap, cond, filterValue1, filterValue2);

                    searchXml += ConvertToExpr(filterCol, ddlFldTypes[ddlCol.selectedIndex].Text, cond, filterValue1, filterValue2);

                    xmlCond += ConvertToXml(filterCol, filterColCap, ddlFldTypes[ddlCol.selectedIndex].innerHTML, condval, filterValue1, filterValue2, i, fOprValue);

                }
                if (condTxt == "")
                    condTxt = filterCol + "^" + cond + "^" + filterValue1 + "^" + filterValue2 + "^" + fOprValue;
                else
                    condTxt += "|" + filterCol + "^" + cond + "^" + filterValue1 + "^" + filterValue2 + "^" + fOprValue;
            }
        }
    }
    searchXml += "), {T},{F})";
    var hdn = document.getElementById("hdnSubTypeCond");
    hdn.value = searchXml;
    var hdnCond = document.getElementById("hdnCondTxt");
    hdnCond.value = xmlCond
    $j("#hdnDisplayCond").val(displayCond);
    $j("#hdnGridCond").val(gridConditn);
    return true;
}


function CheckSpecialCharsInXmlCond(str) {

    if (str == null)
        return "";
    var str = str;
    str = str.replace(/<>/g, "&lt;&gt;");
    str = str.replace(/</g, "&lt;");
    str = str.replace(/>/g, "&&gt;");
    str = str.replace(/>=/g, "&gt;=");
    str = str.replace(/<=/g, "&lt;=");
    // single and double quote are part of parameter , so not replaced.
    return str;
}


//function to convert the condition into expression for subtype.
function ConvertToXml(fldName, fldCaption, dataType, opr1, fldValue, fldValue1, num, fOprValue) {
    opr1 = opr1.toLowerCase();
    var colonInFldValue = false;
    if (fldValue.substring(0, 1) == ":")
        colonInFldValue = true;

    var fldtype = "";

    if (dataType.toLowerCase() == "numeric") {
        fldtype = "n";
    } else if (dataType.toLowerCase() == "date/time") {
        fldtype = "d";
    } else if (dataType.toLowerCase() == "character") {
        fldtype = "c";
    }
    var oprStr = opr1;


    var result = "";
    oprStr = CheckSpecialCharsInXml(oprStr);
    result = "<c" + num + " lopr='" + fOprValue + "'  fname='" + fldName + "' ftype='" + fldtype.toUpperCase() + "' v1='" + fldValue + "' v2='" + fldValue1 + "' op='" + oprStr + "' fcaption='" + fldCaption + "' />";
    return result;
}

function ConvertToExprStr(colName, colCaption, cond, value1, value2) {
    //(Prefix field ( pfield ) Equal to 0) And (Prefix field ( pfield ) Equal to a)
    var str = "";
    if (cond.toLowerCase() == "between")
        str = "(" + colCaption + " ( " + colName + " ) " + cond + " " + value1 + "," + value2 + ")";
    else if (cond.toLowerCase() == "is null")
        str = "(" + colCaption + "  " + cond + ")";
    else
        str = "(" + colCaption + " ( " + colName + " ) " + cond + " " + value1 + ")";
    return str;
}

function ConvertToDisplyStr(colName, colCaption, cond, value1, value2) {
    //(Prefix field ( pfield ) Equal to 0) And (Prefix field ( pfield ) Equal to a)
    var str = "";
    if (cond.toLowerCase() == "between")
        str = "(" + colCaption + " " + cond + " " + value1 + "," + value2 + ")";
    else if (cond.toLowerCase() == "is null")
        str = "(" + colCaption + "  " + cond + ")";
    else
        str = "(" + colCaption + " " + cond + " " + value1 + ")";
    return str;
}

//function to convert the condition into expression for subtype.
function ConvertToExpr(fldName, dataType, opr, fldValue, fldValue1) {
    opr = opr.toLowerCase();
    var colonInFldValue = false;
    if (fldValue.substring(0, 1) == ":")
        colonInFldValue = true;
    var result = "";

    if (opr == "less than or equal to" || opr == "greater than or equal to") {
        var oprStr = "";
        if (opr == "less than or equal to")
            oprStr = " <= ";
        else
            oprStr = " >= ";

        if (colonInFldValue) {
            fldValue = fldValue.substring(1);
            result = "(" + fldName + oprStr + fldValue + ") | (" + fldName + "=" + fldValue + ")";
        } else if (dataType == "Date/Time") {
            result = "(" + fldName + oprStr + "ctod({" + fldValue + "})) | (" + fldName + " = ctod({" + fldValue + "}))";
        } else if (dataType == "Numeric") {
            result = "(" + fldName + oprStr + fldValue + ") | (" + fldName + "=" + fldValue + ")";
        } else {
            result = "(" + fldName + oprStr + "{" + fldValue + "}) | (" + fldName + "=" + "{" + fldValue + "})";
        }
    } else if (opr == "not equal to" || opr == "equal to") {
        var oprStr = "";
        if (opr.toLowerCase() == "not equal to")
            oprStr = " # ";
        else
            oprStr = " = ";

        if (colonInFldValue) {
            fldValue = fldValue.substring(1);
            result = "(" + fldName + oprStr + fldValue + ")";
        } else if (dataType == "Date/Time") {
            result = "(" + fldName + oprStr + " ctod({" + fldValue + "}))";
        } else if (dataType == "Numeric") {
            result = "(" + fldName + oprStr + fldValue + ")";
        } else {
            result = "(" + fldName + oprStr + "{" + fldValue + "})";
        }
    } else if (opr == "less than" || opr == "greater than") {

        var oprStr = "";
        if (opr == "<")
            oprStr = " < ";
        else
            oprStr = " > ";
        if (colonInFldValue) {
            fldValue = fldValue.substring(1);
            result = "(" + fldName + oprStr + fldValue + ")";
        } else if (dataType == "Date/Time") {
            result = "(" + fldName + oprStr + "ctod({" + fldValue + "}))";
        } else if (dataType == "Numeric") {
            result = "(" + fldName + oprStr + fldValue + ")";
        } else {
            result = "(" + fldName + oprStr + "{" + fldValue + "})";
        }
    } else if (opr == "between") {
        var colonInFldVal1 = false;
        if (fldValue1.substring(0, 1) == ":")
            colonInFldVal1 = true;
        else colonInFldVal1 = false;

        if (colonInFldValue && colonInFldVal1) {
            fldValue = fldValue.substring(1);
            fldValue1 = fldValue1.substring(1);
            result = "((" + fldName + " > " + fldValue + ") | (" + fldName + "=" + fldValue + ")) &";
            result += "((" + fldName + " < " + fldValue1 + ") | (" + fldName + "=" + fldValue1 + "))";
        } else if (colonInFldValue && !colonInFldVal1) {
            fldValue = fldValue.substring(1);
            if (dataType == "Date/Time") {
                result = "((" + fldName + ">" + fldValue + ") | (" + fldName + "=" + fldValue + ")) &";
                result += "((" + fldName + "< ctod({" + fldValue1 + "})) | (" + fldName + " = ctod({" + fldValue1 + "})))";
            } else {
                result = "((" + fldName + " < " + fldValue + ") | (" + fldName + "=" + fldValue + ")) &";
                result += "((" + fldName + " < " + fldValue1 + ") | (" + fldName + "=" + fldValue1 + ")))";
            }
        } else if (!colonInFldValue && colonInFldVal1) {
            fldValue1 = fldValue1.substring(1);
            if (dataType == "Date/Time") {
                result = "((" + fldName + " > ctod({" + fldValue + "})) | (" + fldName + " = ctod({" + fldValue + "})) &";
                result += "((" + fldName + " < " + fldValue1 + ") | (" + fldName + "=" + fldValue1 + ")))";
            } else {
                result = "((" + fldName + " > " + fldValue + ") | (" + fldName + " = " + fldValue + ")) &";
                result += "((" + fldName + " < " + fldValue1 + ") | (" + fldName + " = " + fldValue1 + ")))";
            }
        } else {
            if (dataType == "Date/Time") {
                result = "((" + fldName + " > ctod({" + fldValue + "})) | (" + fldName + " = ctod({" + fldValue + "})) &";
                result += "((" + fldName + " < ctod({" + fldValue1 + "})) | (" + fldName + " = ctod({" + fldValue1 + "})))";
            } else {
                result = "((" + fldName + " > " + fldValue + ") | (" + fldName + " = " + fldValue + ")) &";
                result += "((" + fldName + " < " + fldValue1 + ") | (" + fldName + " = " + fldValue1 + ")))";
            }
        }
    }
    return result;
}

//Create table for subtotal list
function CreateSubtotal() {

    var html = '';
    var caption = $j("#ddlCaption option:selected").text();
    var value = $j("#ddlCaption option:selected")[0].value;
    $j('#tblSubtotlList').each(function () {
        $j('#tblSubtotlList tr > td:contains(' + value + ')').parent().remove();
    })

    html += '<tr><td class="tableCell">' + $j('#hdnCbValue').val() + '</td>';
    html += '<td  class="tableCell" >' + document.getElementById('txtHeader').value + '</td>';
    html += '<td  class="tableCell" >' + document.getElementById('txtFooter').value + '</td>';
    html += '<td  class="tableCell" >' + value + '</td>';
    html += '<td  class="tableCell" >' + document.getElementById('txtSubOrder').value + '</td>';
    html += '<td  class="tableCell" >' + document.getElementById('cbLineSpace').checked + '</td>';
    html += '<td  class="tableCell" >' + document.getElementById('cbTtl').checked + '</td>';
    html += '</tr>';

    $j('#tblSubtotlList').append(html);
}

//bind dummy subtotal table
function bindSubtotalList() {

    if ($j("#hdnSubtotalList").val() != "") {
        var subtotallst = $j("#hdnSubtotalList").val().split(';');
        var count = subtotallst.length;
        var html = '';
        for (var i = 0; i < count; i++) {
            var subtotl = subtotallst[i].split(',');

            html += '<tr><td class="tableCell">' + subtotl[0] + '</td>';
            html += '<td  class="tableCell" >' + subtotl[1] + '</td>';
            html += '<td  class="tableCell" >' + subtotl[2] + '</td>';
            html += '<td  class="tableCell" >' + subtotl[3] + '</td>';
            html += '<td  class="tableCell" >' + subtotl[4] + '</td>';
            html += '<td  class="tableCell" >' + subtotl[5] + '</td>';
            html += '<td  class="tableCell" >' + subtotl[6] + '</td>';

            html += '</tr>';
        }

        $j('#tblSubtotlList').append(html);
    }
    return false;
}



// These varibles will be used to store the position of the mouse
var X = 0;
var Y = 0;

//Function to find the left position of the given obj on screen.
function FindListPosX(obj) {

    var curleft = 0;

    if (obj.offsetParent) {
        while (obj.offsetParent) {
            curleft += obj.offsetLeft
            obj = obj.offsetParent;
        }
    } else if (obj.x)
        curleft += obj.x;
    return curleft;
}

//Function to find the top position of the given object on screen.
function FindListPosY(obj) {

    var curtop = 0;

    if (obj.offsetParent) {
        while (obj.offsetParent) {
            curtop += obj.offsetTop
            obj = obj.offsetParent;
        }
    } else if (obj.y)
        curtop += obj.y;
    return curtop;
}

//Function to get the left and top position of the task button image on screen.
function FindListPos() {

    var img = document.getElementById("imgView");
    X = FindListPosX(img);
    Y = FindListPosY(img);
}




//Set list view conditions to popup
function SetListCondition(condText) {
    //No of conditions
    var tblFilter = document.getElementById("tblFilter");
    rowCount = tblFilter.rows.length;
    if (rowCount > 0)
        return;
    var strWF = condText.split("|");
    for (var i = 0; i < strWF.length; i++) {
        var wfCond = strWF[i].split("^");
        var ddlCol;
        var ddlCond;
        var txtValue1;
        var txtValue2;
        var suffix = "";
        if (i == 0) {
            //The first condition will not have the operator And/Or
            if (i > 0)
                suffix = i;
            if (i == 0) {

                ddlCol = $j("#ddlListFilter");
                ddlCond = $j("#ddlListFilcond");
                txtValue1 = $j("#txtListFilter");
                txtValue2 = $j("#ListfilVal2");
            } else {

                ddlCol = $j("#ddlListFilter" + suffix);
                txtValue1 = $j("#txtFilter" + suffix);
                txtValue2 = $j("#txtFillVal" + suffix);
                ddlCond = $j("#ddlOpr" + suffix);
            }
            ddlCol.val(wfCond[0]); //            $j("#ddlCaption").val(val);
            ddlCond.find("option").each(function () {
                if ($j(this).val().toLowerCase() == wfCond[1].toLowerCase()) {
                    $j(this).attr("selected", "selected");

                    if ($j(this).text() == 'Between') {
                        txtValue2.prop("disabled", false);
                        txtValue1.prop("disabled", false);
                    } else if ($j(this).text() == 'Is empty') {
                        txtValue2.prop("disabled", true);
                        txtValue1.prop("disabled", true);
                    } else {
                        txtValue2.prop("disabled", true);
                        txtValue1.prop("disabled", false);
                    }
                }
            });
            txtValue1.val(wfCond[2]);
            txtValue2.val(wfCond[3]);
        } else {
            AddCondition();
            var OprId = "#grpAndOr" + i;
            var Opr = $j("#rad" + wfCond[4] + i);
            Opr.prop("checked", true);

            suffix = i;
            ddlCol = $j("#ddlListFilter" + suffix);
            txtValue1 = $j("#txtFilter" + suffix);
            txtValue2 = $j("#txtFillVal" + suffix);
            ddlCond = $j("#ddlOpr" + suffix);

            ddlCol.val(wfCond[0]);

            ddlCond.find("option").each(function () {
                if ($j(this).val() == wfCond[1]) {
                    $j(this).attr("selected", "selected");

                    if ($j(this).text() == 'Between') {
                        document.getElementById(txtValue2[0].id).disabled = false;
                        document.getElementById(txtValue1[0].id).disabled = false;
                    } else if ($j(this).text() == 'Is empty') {
                        document.getElementById(txtValue2[0].id).disabled = true;
                        document.getElementById(txtValue1[0].id).disabled = true;
                    } else {
                        document.getElementById(txtValue2[0].id).disabled = true;
                        document.getElementById(txtValue1[0].id).disabled = false;
                    }
                }
            });
            txtValue1.val(wfCond[2]);
            txtValue2.val(wfCond[3]);

        }
    }
}

var IsexistView = true;

function checkViewName(lname) {

    var i = 0;
    var str = 0;
    var strCount = lname.length;
    var viewName = lname;
    while (IsexistView == true) {

        if (IsexistView == true) {

            str = lname.substr(lname.length - 1);
            i = parseInt(str) + 1;
            lname = lname.substr(0, lname.length - 1) + i;
            NameEnd = lname.substr(strCount - 1, lname.length - 2);

            if (NameEnd.toLowerCase() == "nan") {
                lname = viewName + "01";
            }

            IsexistView = false;
            checkddName(lname);
        } else {
            IsexistView = false;
            $j("#ddlViewList").val(lname);
        }

    }
    $j("#ddlViewList").val(lname);
    $j("#txtViewName").val(lname);
}



function checkddName(lname) {

    var views = $j("#hdnViewNames").val();
    var viewarr = views.split(',');

    for (var i = 0; i < viewarr.length; i++) {

        if (viewarr[i] == lname) {
            IsexistView = true;
        }
    }
}

//Check wether view name already exist
var isExistCondtn = 1;
var views = "";
var lname = "";

function isExistViewName() {

    if ($j("#txtViewName").val().toLowerCase() == "new" || $j("#txtViewName").val().toLowerCase() == "" || $j("#txtViewName").val().toLowerCase() == "main" || (requestJSON && $j("#txtViewName").val().toLowerCase() == "charts")) {
        showAlertDialog("warning", 3019, "client");
        return false;
    }
    if ($j("#txtViewName").val().toLowerCase() == $j("#hdnTransId").val().toLowerCase()) {
        showAlertDialog("warning", 3022, "client");
        return false;
    }

    if ($j("#txtViewName").val().length > 15) {
        showAlertDialog("warning", 3023, "client");
        return false;
    }

    var chkd = false;
    $j('#tvList input[type=checkbox]:checked').each(function () {

        chkd = true;
    })
    if (!chkd) {
        showAlertDialog("warning", 3021, "client");
        return false;
    }

    $j("#hdnCondTxt").val('');
    $j("#hdnSubtotal").val('');
    $j("#hdnSubtotal").val('');
    var mode = $j("#hdnSaveMode").val();
    isExistCondtn = 1;
    var exist = false;
    views = $j("#hdnViewNames").val();

    lname = $j("#txtViewName").val();

    var viewarr = views.split(',');

    for (var i = 0; i < viewarr.length; i++) {

        if (viewarr[i].toLowerCase() == lname.toLowerCase()) {
            exist = true;
        }
    }

    if (exist == true && mode != "Edit") {

        showAlertDialog("warning", 3022, "client");
        return false;
    } else {
        var status = $j("#hdnStatus").val();

        if (status == "ON") {

            SaveListCondition();
            if (isExistCondtn == 0) {
                return false;
            }
        }

        saveLViewActionCond();

        document.getElementById('btnSav').click();
        $j("#hdnViewNames").val(views + "," + lname);
        return true;

    }

}

//Remove changes from listview popup
function discardChanges() {

    $j("#hdnSubtotal").val('');
    $j("#hdnNoRepeat").val('');
    $j("#ddlSortBy option:selected").val('');
    $j("#hdnSort").val('');
    $j("#ddlGroupBy option:selected").val('');
    $j("#hdnGroup").val('');
    $j("#rbtnOrder option:selected").text('');
    $j("#hdnOrder").val('');
    $j("#rbtnStatus option:selected").text('');
    $j("#hdnStatus").val('');
    $j("#hdnColumns").val('');
    $j("#hdnSubtotlCaptn").val('');
    $j("#hdnCondTxt").val('');

    $j("#ddlSortBy").val('');
    $j("#ddlGroupBy").val('');

    $j("#rbtnOrder option:selected").text("Asc");
    $j("#rbtnStatus option:selected").text("OFF");

    $j("#tblFilter").empty();
    $j("#ddlListFilter").val("");
    $j("#ddlListFilcond").val("");

    $j("#txtListFilter").val('');
    $j("#ListfilVal2").val('');

    $j("#txtHeader").val('');
    $j("#txtFooter").val('');
    $j("#ddlCaption").val('');

    $j("#cbLineSpace").prop('checked', false);

    $j("#cbTtl").prop('checked', false);

    $j("#txtSubOrder").val('');

    $j('#tblSubtotal  input[type=checkbox]').each(function () {

        $j(this)[0].checked = false;
    });
    $j('#tblNorep  input[type=checkbox]').each(function () {

        $j(this)[0].checked = false;
    });

    $j("#tblSubtotlList").empty();

}

//Function to get the left and top position of the task button image on screen.
function FindViewPos() {

    var img = document.getElementById("imgView");
    X = FindPosX(img);
    Y = FindPosY(img);
}

// These varibles will be used to store the position of the mouse
var X = 0;
var Y = 0;

//Function to find the left position of the given obj on screen.
function FindPosX(obj) {

    var curleft = 0;

    if (obj.offsetParent) {
        while (obj.offsetParent) {
            curleft += obj.offsetLeft
            obj = obj.offsetParent;
        }
    } else if (obj.x)
        curleft += obj.x;
    return curleft;
}

//Function to find the top position of the given object on screen.
function FindPosY(obj) {

    var curtop = 0;

    if (obj.offsetParent) {
        while (obj.offsetParent) {
            curtop += obj.offsetTop
            obj = obj.offsetParent;
        }
    } else if (obj.y)
        curtop += obj.y;
    return curtop;
}


//Function to hide the view list.
function HideNqIvViewList() {

    var dvviewList = $j("#listViewPopUp");

    if (IsNqViewBtnCliked == true) {
        IsNqViewBtnCliked = false;
        dvviewList.show();
    } else {
        dvviewList.hide();
    }
}

function ConfirmDelete() {
    var glType = callParentNew('gllangType');
    var isRTL = glType == "ar" ? true : false;
    var ConfirmDeleteCB = $.confirm({
        theme: 'modern',
        title: appGlobalVarsObject.lcm["155"],
        onContentReady: function () {
            disableBackDrop('bind');
        },
        backgroundDismiss: 'false',
        rtl: isRTL,
        escapeKey: 'buttonB',
        content: appGlobalVarsObject.lcm[9],
        buttons: {
            buttonA: {
                text: appGlobalVarsObject.lcm[164],
                btnClass: 'btn btn-primary',
                action: function () {
                    ConfirmDeleteCB.close();
                    var e = document.getElementById("ddlViewList");
                    var fname = e.options[e.selectedIndex].innerHTML;
                    $j('#hdnViewDelt').val(fname);
                    DeleteView(fname);
                }
            },
            buttonB: {
                text: appGlobalVarsObject.lcm[192],
                btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                action: function () {
                    disableBackDrop('destroy');
                    return false;
                }
            }
        }
    });

}

function DeleteView(fname) {
    var a = $j('#btnRemv').click();

    return false;
}


function EditCondPopUp() {
    if ($j("#hdnCondTxt").val() != "") {
        SetListCondition($j("#hdnCondTxt").val());
    }
    return false;
}

function NewViewMode() {
    $j('#hdnNoRepeat').val('');
    $j('#hdnNoRepeatCaptn').val('');
    $j('#hdnSubtotlCaptn').val('');
    $j('#hdnSubtotalList').val('');
    $j('#hdnGridCond').val('');
    $j('#hdnGroup').val('');
    $j('#hdnSort').val('');
    $j('#hdnStatus').val('OFF');
    $j('#hdnColumns').val('');
    $j('#hdnOrder').val("Asc");

    return true;
}

function OpenopupWithCond() {

    $j('#lblViewName').show();
    $j('#txtViewName').show();
    $j('#lblviewtext').hide();
    $j('#ddlViewList').hide();
    $j('#btnRemove').hide();

    $j(divtr1).show();
    tr1.className = "tvRow selProperty";
    $j(divtr2).hide();
    $j(divtr3).hide();
    $j(divtr4).hide();
    $j(divtr5).hide();

    //Calculate Page width and height
    var pageWidth = window.innerWidth;
    var pageHeight = window.innerHeight;
    if (typeof pageWidth != "number") {
        if (document.compatMode == "CSS1Compat") {
            pageWidth = document.documentElement.clientWidth;
            pageHeight = document.documentElement.clientHeight;
        } else {
            pageWidth = document.body.clientWidth;
            pageHeight = document.body.clientHeight;
        }
    }
    //Make the background div tag visible...
    var divbg = document.getElementById('bg');
    $j(divbg).show();
    var divobj = document.getElementById('divAction');
    $j(divobj).show();

    if (navigator.appName == "Microsoft Internet Explorer")
        computedStyle = divobj.currentStyle;
    else computedStyle = document.defaultView.getComputedStyle(divobj, null);
    //Get Div width and height from StyleSheet
    var divWidth = computedStyle.width.replace('px', '');
    var divHeight = computedStyle.height.replace('px', '');
    var divLeft = (pageWidth - divWidth) / 2;
    var divTop = (pageHeight - divHeight) / 2;
    //Set Left and top coordinates for the div tag


    $j(divobj).css("left", divLeft + "px");
    $j(divobj).css("top", divTop + "px");
    $j(divobj).css("top", "40px");


    //Adjust popup size when list view view is empty or less number of row
    var listPnl = document.getElementById('Panel2');

    var docHight = $j(document).height();

    var height = 0;
    var PopupHeight = 500;
    var top = 40;
    if (PopupHeight > docHight)
        height = PopupHeight - docHight;

    var winHeight = docHight + top + height;
    Adjustwin(winHeight);
    showAlertDialog("warning", 3024, "client");
}

function OpenPopup(id, Mode) {
    var a = Mode;
    var transId = $j('#hdnTransId').val()
    var view = $j('#txtViewName').val();
    if (view.toLowerCase() == "main")
        Mode = "New";

    if (Mode == 'New') {
        $j('#lblViewName').show();
        $j('#txtViewName').show();
        $j('#lblviewtext').hide();
        $j('#ddlViewList').hide();
        $j('#btnRemove').hide();

        checkViewName($j('#hdnViewName').val());
        NewViewMode();
        $j('#hdnSaveMode').val("New");
        $j('#tblFilter').empty();
        $j("#ddlSortBy option:selected").val('');
        $j("#ddlGroupBy option:selected").val('');
        $j('#ddlGroupBy')[0].selectedIndex = 0;
        $j('#ddlSortBy')[0].selectedIndex = 0;
        $j("#hdnSubtotlCaptn").val('');
        $j("#tblSubtotlList").empty();
        $j('#tblSubtotal  input[type=checkbox]').each(function () {
            $j(this)[0].checked = false;
        });

    } else if (Mode == 'Edit') {
        $j('#hdnSaveMode').val("Edit");
        $j('#lblViewName').hide();
        $j('#txtViewName').hide();
        $j('#lblviewtext').show();
        $j('#ddlViewList').show();
        $j('#btnRemove').show();
    } else if (Mode == 'EditNew') {
        $j('#lblViewName').show();
        $j('#txtViewName').show();
        $j('#lblviewtext').show();
        $j('#ddlViewList').show();
        $j('#btnRemove').hide();
        $j('#hdnSaveMode').val("New");
        NewViewMode();
    }

    var divtr1 = document.getElementById('divtr1');
    var divtr2 = document.getElementById('divtr2');
    var divtr3 = document.getElementById('divtr3');
    var divtr4 = document.getElementById('divtr4');
    var divtr5 = document.getElementById('divtr5');
    var viewname = $j('#hdnViewName').val();

    $j('#txtViewName').innerHTML = viewname;
    $j("#ddlSortBy option:selected").val($j('#hdnSort').val());
    $j("#ddlGroupBy option:selected").val($j('#hdnGroup').val());
    $j("#ddlListFilcond").val("");
    $j("#ddlListFilter").val("");
    $j("#txtListFilter").val("");
    $j("#ListfilVal2").val("");
    $j("#FilterRowCount").val("0");
    $j("#txtHeader").val("");
    $j("#txtFooter").val("");
    $j("#txtSubOrder").val("");
    $j("#cbLineSpace").prop('checked', false);
    $j("#cbTtl").prop('checked', false);

    var order = $j('#hdnOrder').val();
    var Status = $j('#hdnStatus').val();

    $j('input:radio[name="rbtnOrder"]').filter('[value="' + order + '"]').attr('checked', true);
    $j('input:radio[name="rbtnStatus"]').filter('[value="' + Status.toUpperCase() + '"]').attr('checked', true);
    $j(divtr1).show();

    tr1.className = "tvRow selProperty";
    tr2.className = "tvRow RowCust";
    tr3.className = "tvRow RowCust";
    tr4.className = "tvRow RowCust";
    tr5.className = "tvRow RowCust";

    $j(divtr2).hide();
    $j(divtr3).hide();
    $j(divtr4).hide();
    $j(divtr5).hide();

    //Calculate Page width and height
    var pageWidth = window.innerWidth;
    var pageHeight = window.innerHeight;
    if (typeof pageWidth != "number") {
        if (document.compatMode == "CSS1Compat") {
            pageWidth = document.documentElement.clientWidth;
            pageHeight = document.documentElement.clientHeight;
        } else {
            pageWidth = document.body.clientWidth;
            pageHeight = document.body.clientHeight;
        }
    }
    //Make the background div tag visible...
    var divbg = document.getElementById('bg');
    $j(divbg).show();
    var divobj = document.getElementById(id);
    $j(divobj).show();

    if (navigator.appName == "Microsoft Internet Explorer")
        computedStyle = divobj.currentStyle;
    else computedStyle = document.defaultView.getComputedStyle(divobj, null);
    //Get Div width and height from StyleSheet
    var divWidth = computedStyle.width.replace('px', '');
    var divHeight = computedStyle.height.replace('px', '');
    var divLeft = (pageWidth - divWidth) / 2;
    var divTop = (pageHeight - divHeight) / 2;
    //Set Left and top coordinates for the div tag

    $j(divobj).css("left", divLeft + "px");
    $j(divobj).css("top", divTop + "px");
    $j(divobj).css("top", "40px");

    //Adjust popup size when list view view is empty or less number of row
    var listPnl = document.getElementById('Panel2');

    var docHight = $j(document).height();

    var height = 0;
    var PopupHeight = 500;
    var top = 40;
    if (PopupHeight > docHight)
        height = PopupHeight - docHight;

    var winHeight = docHight + top + height;
    Adjustwin(winHeight);
    $('#txtViewName').focus();
    jQuery(".popup_bg").bind("click.modalPopupKD", function (event) {
        CloseListActionWin();
    })
    jQuery(document).bind("keydown.modalPopupKD", function (event) {
        if (!event.shiftKey && event.keyCode == 9) {
            //tab key
            if ($(document.activeElement)[0].id == $("#btnSave")[0].id) {
                event.preventDefault();
                $('#closeList').focus();
            } else if ($(document.activeElement)[0].id == $("#closeList")[0].id) {
                event.preventDefault();
                $('#txtViewName').focus();
            }
        } else if (event.shiftKey && event.keyCode == 9) {
            if ($(document.activeElement)[0].id == $("#closeList")[0].id) {
                event.preventDefault();
                $('#btnSave').focus();
            }
        } else if (event.keyCode == 27) {
            CloseListActionWin();
        }
    });

}

function CloseListActionWin() {
    $j('#bg').hide();
    $j('#divAction').hide();
    var docHight = $j(document).height();
    var height = 0;
    var PopupHeight = 500;
    var top = 40;
    if (PopupHeight > docHight)
        height = PopupHeight - docHight;

    var winHeight = docHight + top + height;
    Adjustwin(winHeight);
    jQuery(document).unbind("keydown.modalPopupKD");
    jQuery(document).unbind("click.modalPopupKD");

    return false;
}


function EditView(context) {
    context.onchange = "";

    var e = document.getElementById("ddlViewList");
    var fname = e.options[e.selectedIndex].innerHTML;

    if (fname == "New view") {

        $j('#lblViewName').show();
        $j('#txtViewName').show();
        $j('#lblviewtext').show();
        $j('#ddlViewList').show();
        $j('#btnRemove').hide();

        checkViewName($j('#hdnViewName').val());
        discardChanges();
        $j("#ddlSortBy option:selected").val($j('#hdnSort').val());

        $j("#ddlGroupBy option:selected").val($j('#hdnGroup').val());

        $j('#hdnSaveMode').val("New");
    } else {
        $j('#hdnViewName').val(fname);
        $j('#txtViewName').val(fname);
        $j('#hdnSaveMode').val("Edit");
        discardChanges();
        BindXml(fname);
    }
    return true;
}

function BindXml(fxml) {
    $j('#txtViewName').val(fxml);
    $j('#hdnListViewName').val(fxml);
    $j('#btnListView').click();
    return true;
}

function BindGrid(viewName) {
    $j('#hdnSelectedView').val(viewName);
    $j('#btnShowGrid').click(); //hdnSelectedView

    return true;
}

///Function to click the new button from iview ,display the tstruct page.
function pgReload() {
    ResetNavGlobalVariables();
    $j(location).attr("href", "tstruct.aspx?transid=" + tst + `&openerIV=${iName}&isIV=${!isListView}`);
    try {
        if (!window.parent.isSessionCleared && window.document.title == "List IView") {
            ASB.WebService.ClearNavigationSession();
            window.parent.isSessionCleared = true;
        }
    } catch (ex) { }
}

function submitIt() {

    var empCode = $j("#EmployeeCode").val();
    if (empCode == "") {
        var dob = $j("#dob").val();
        if (dob == "") {
            ShowDimmer(false);
            showAlertDialog("warning", 3025, "client");
            return false;
        } else {
            var empName = $j("#EmployeeName").val();
            var deptname = $j("#dept").val();
            var ddo = $j("#dddo").val();
            var doa = $j("#doa").val();
            if ((empCode == "") && (empName == "") && (deptname == "--") && (ddo == "") && (doa == "")) {
                ShowDimmer(false);
                showAlertDialog("warning", 3026, "client");
                return false;
            }
        }
    }
    return true;
}
//to set clicked rowIndex,column name and parent as IView
function SetColumnName(columnName, dataRowIndex, isParentIview) {
    // ShowDimmer(true);
    window.parent.dataRowIndex = dataRowIndex;
    window.parent.clickedColumn = columnName;
    if (isParentIview)
        window.parent.isParentIview = isParentIview;
}

function ShowCharts(calledFrom, action) {
    if ($j("#dvCharts").is(':visible'))
        return;
    if (!isChartsAvailable) {
        showAlertDialog("error", 3027, "client");
    } else {
        var chartSize = $j("#hdnChartSize").val();
        if (chartSize == "" || chartSize == "half") {
            $j("#dvCharts").show();
            Adjustwin();
            SetContentPanelWidth("half");
        } else {
            ShowChartPopUp(calledFrom, action);
        }
    }
}

function CloseChart(calledFrom) {
    var chartSize = $j("#hdnChartSize").val();
    var dvChart = $j("#dvCharts");
    dvChart.hide();
    var width = "";
    if (chartSize == "" || chartSize == "half") {
        ShowFilter();
    } else {
        $j("#bg").hide();
        dvChart.removeClass("dvChartsPop");
        dvChart.addClass("dvChart");
        $j("#hdnChartSize").val("");
        $j("#lnkChart").text("View Full Screen");
    }

    SetContentPanelWidth(width);

    if (chartSize == "full") {
        if (gl_language == "ARABIC") {
            $j("#divcontainer").css("margin-top", "0%");
        }
        Adjustwin();
    }
}

function ShowChartPopUp(calledFrom, action) {
    var lnk = $j("#lnkChart");
    var dvChart = $j("#dvCharts");
    var width = "";
    if (lnk.text() == "View Full Screen") {
        $j("#bg").show();

        if (isFilterSortEnabled || isParamVisible.toLowerCase() == "true")
            width = "half";
        else
            width = "full";
        dvChart.removeClass("dvChart");
        dvChart.addClass("dvChartsPop");
        $j("#hdnChartSize").val("full");
        if (action == undefined) {
            if ($j("#ddlChartCol1").val() != "" && $j("#ddlChartCol2").val() != "")
                $j("#btnGetChart1").click();
        }
        dvChart.show();

        dvChart.css("top", "20px");
        $j("#lnkChart").text("Close Full Screen");
        Adjustwin(100);
        if (gl_language == "ARABIC") {
            $j("#dvCharts").css("margin-top", "1%");
        }
    } else {

        width = "half";
        $j("#bg").hide();
        dvChart.removeClass("dvChartsPop");
        dvChart.addClass("dvChart");
        $j("#hdnChartSize").val("half");
        $j("#lnkChart").text("View Full Screen");

        dvChart.show();
        if (action == undefined) {
            if ($j("#ddlChartCol1").val() != "" && $j("#ddlChartCol2").val() != "")
                $j("#btnGetChart1").click();
        }
        if (gl_language == "ARABIC") {
            $j("#dvCharts").css("margin-top", "-13%");
        }
    }
    SetContentPanelWidth(width);
}

//#Region Filter Iview and ListView

var visibleColumns = new Array();
var visibleColumnIds = new Array();
var isFilterSortEnabled = false;
//Construction of filter using Json Object and Grid Header


var selectedFilterItem = '';
//To add sorting on the column name click.
function CallSorting(obj) {
    callParentNew("loadFrame()", "function");
    var colName = obj.innerHTML.replace("<br>", "~");
    selectedFilterItem = obj.id;
    $j("#hdnSortColName").val(colName);
    $j("#SortGrid").click();

}
//To add filter feature on the basis of Item selected to filter
function CallFilter(colName, filterVal, item) {
    if (colName) {

        callParentNew("loadFrame()", "function");

        arrCheckedFilter.push(item);
        if ($j("#cb" + item).attr('checked'))
            $j("#hdnFilterChecked").val("checked");
        else
            $j("#hdnFilterChecked").val("unchecked");
        selectedFilterItem = item;

        $j("#hdnFilterBy").val(filterVal);
        $j("#hdnFilterColName").val(colName);
        $j("#FilterGrid").click();
        $j("#showRecDetails").hide();
    }
}

//To make filter hidden on hide filter click
function HideFilter(src) {
    document.getElementById("hdnIsParaVisible").value = "0";
    if (isFilterSortEnabled || isParamVisible.toLowerCase() == "true") {
        $j("#leftPanel").hide("slide", { percent: 0 }, 500);
        $j("#showFilter").css('display', 'block');
        $j("#hideFilter").css('display', 'none');
        $j(".dvContent").css('height', 'auto');

        if (navigator.appName != "Microsoft Internet Explorer")
            $j('.vertical').css('margin-left', '25px');
        $j(".hdIvFilter").hide();
        if (src == undefined) {
            if (!($j("#dvCharts").is(":visible"))) {
                $j("#divcontainer").css("width", "100%");
                SetContentPanelWidth("full");
            } else {
                if ($j("#leftPanel").is(":visible"))

                    //halfchart
                    SetContentPanelWidth("half");
                else
                    SetContentPanelWidth("halfchart");
            }
        }
    }
    if (gl_language == "ARABIC") {
        $j("#divcontainer").css("margin-top", "0px");
        $j("#divcontainer").css("margin-right", "0px");
    } else {
        $j("#divcontainer").css("margin-left", "0px");
    }
    setGridviewWidth();
}

function SetContentPanelWidth(strSize) {


    var contentPanel;
    if (document.title == "List IView")
        contentPanel = $j("#contentPanelGrid");
    else
        contentPanel = $j("#contentPanelGridIview");

    if (strSize == "full") {
        contentPanel.css("width", "100%");
        contentPanel.css("margin-left", "0px");
        SetDynamicScrollWdith("full");
    } else if (strSize == "half") {
        contentPanel.css("width", "50%");
        contentPanel.css("margin-left", "10px");
        SetDynamicScrollWdith("half");
    } else if (strSize == "halfchart") {
        contentPanel.css("width", "60%");
        contentPanel.css("margin-left", "10px");
        SetDynamicScrollWdith("halfchart");
    } else {
        if (gl_language == "ARABIC" && screen.width > 1024)
            $j("#divcontainer").css("width", "75%");
        else if (gl_language == "ENGLISH" && screen.width > 1024)
            $j("#divcontainer").css("width", "75%");
        else
            $j("#divcontainer").css("width", "75%");
        $j("#contentPanelGrid").css("width", "75%");
        contentPanel.css("width", "100%");
        contentPanel.css("margin-left", "10px");
        SetDynamicScrollWdith("");
    }

    if (window.opener != undefined) {
        if (strSize == "") {
            contentPanel.css("width", "65%");
            contentPanel.css("margin-left", "10px");
        }
    }
}

function SetDynamicScrollWdith(action) {

    var DivHR = document.getElementById('DivHeaderRow');
    var DivMC = document.getElementById('DivMainContent');
    var width = screen.width - 50;

    if (DivHR && DivMC) {
        if (action == "full") {
            DivHR.style.width = (parseInt(width) - 16) + 'px';
            DivMC.style.width = width + 'px';
        } else if (action == "half") {
            var newWid = width / 2;
            DivHR.style.width = (parseInt(newWid) - 16) + 'px';
            DivMC.style.width = newWid + 'px';
        } else if (action == "halfchart") {
            var newWid = width / 2;
            DivHR.style.width = (parseInt(newWid) - 16) + 'px';
            DivMC.style.width = newWid + 'px';
        } else {

            var newWid = (width * 75 / 100) + 50;
            if (screen.width == 1024)
                newWid = (width * 75 / 100);
            DivHR.style.width = (parseInt(newWid) - 16) + 'px';
            DivMC.style.width = newWid + 'px';
        }
    }
}

//To make filter visible on show filter click
function ShowFilter() {
    $j("#dvHideFilter").css("display", "block");
    $j(".dvContent").css("height", "60vh");
    document.getElementById("hdnIsParaVisible").value = "1";
    //added the condition if show filter is called hide the graph
    if ($j("#dvCharts").is(":visible"))
        $j("#dvCharts").hide();
    if (isFilterSortEnabled || isParamVisible.toLowerCase() == "true") {
        if (gl_language == "ARABIC") {
            $j("#divcontainer").css("float", "right");
            $j("#leftPanel").css("float", "right");
        } else {
            $j("#leftPanel").css("float", "left");
            $j("#leftPanel").css("clear", "both");
            $j("#divcontainer").css("margin-top", "1%");
            if (screen.width == 1024) {
                $j("#divcontainer").css("margin-left", "0%");
            }
            else {
                $j("#divcontainer").css("margin-left", "0%");
            }

        }
        $j("#leftPanel").show("slide", { percent: 0 }, 500);
        $j("#showFilter").css('display', 'none');
        $j('#dvUpdateFilter').css('margin-top', '-16px');
        $j(".hdIvFilter").show();

        if (!($j("#dvCharts").is(":visible"))) {
            if (document.title == "List IView") {
                $j("#contentPanelGrid").css("width", "75%");
            }
            else {
                SetContentPanelWidth("");
            }
        } else {
            SetContentPanelWidth("half");
        }
    }

    setGridviewWidth();
}

//In List View This feature is to hide or show column on the basis of checked column
function CallColumnHide(obj) {
    callParentNew("loadFrame()", "function");
    var colId = obj.id;
    var colName = obj.parentElement.textContent;
    if (colId && colName) {
        $j("#hdnHideColName").val(obj.value);
        $j("#HideColumn").click();
    }
}
//check the filter columns
function CheckFilterColumns() {

    for (var j = 0; j < arrCheckedFilter.length; j++) {
        if ($j("#cb" + arrCheckedFilter[j]).attr('checked')) {
            $j("#cb" + arrCheckedFilter[j]).prop('checked', false);
        }
        else {
            $j("#cb" + arrCheckedFilter[j]).prop('checked', 'checked');
        }
    }
}
//To select the checkboxes which are not visible
function CheckHiddenColumns(visibleColumns, visibleColumnIds) {

    var arrayHiddenCol = new Array();
    var gridColumn;
    if (document.title == "Iview")
        gridColumn = '#GridView1 tr:first-child th'
    else
        gridColumn = '#GridView1 tr:first-child th a'
    $j(gridColumn).each(function (i) {
        if (this.innerHTML && $j(this).text()) {
            arrayHiddenCol.push(this.innerHTML.replace(/<br>/g, ""));
        }
    });
    for (var k = 0; k < visibleColumns.length; k++) {
        var colName = visibleColumns[k];
        colName = colName.replace(/~/g, "");
        var id = colName.replace(/[^\w\s]/gi, '').replace(/\s/g, '');
        if ($j.inArray(colName, arrayHiddenCol) == -1)
            $j("#cb" + id).prop('checked', 'checked');
        else
            $j("#cb" + id).prop('checked', false);
    }
}
var calledFrom = "";

//To update global array AxIvFilterMinHeader, whenever a filter pannel is minimized or maximized
function UpdateActiveArray(obj) {
    if (calledFrom == "") {
        var id = $j(obj).attr('id');
        if ($j(obj).hasClass("ui-state-active") && window.parent.AxIvFilterMinHeader.indexOf(id) == -1)
            window.parent.AxIvFilterMinHeader.push(id);
        else if (window.parent.AxIvFilterMinHeader.indexOf(id) > -1)
            window.parent.AxIvFilterMinHeader.splice($j.inArray(id, window.parent.AxIvFilterMinHeader), 1);
    }
    if ($j("#filterIvParam").attr("aria-selected") == "true") {
        $j("#leftPanel").css("margin-top", "-1%");
    } else {
        $j("#leftPanel").css("margin-top", "-2%");
    }
}

//To maintain the Filter Pannel state for the end user
function ShowVisibleFilters() {
    for (var k = 0; k < window.parent.AxIvFilterMinHeader.length; k++) {
        calledFrom = "clicked";
        $j("#" + window.parent.AxIvFilterMinHeader[k]).click();
    }
    calledFrom = "";
}

//To highlight selected Filter Item
function HighLightSelected() {
    if (selectedFilterItem && $j("#" + selectedFilterItem).length > 0)
        $j("#" + selectedFilterItem).addClass("selectedFilterItem");
    else
        selectedFilterItem = '';
}

//#End Region Filter Iview and List View

function toExcelWeb(a, c) {
    var left = (screen.width / 2) - (840 / 2);
    var top = (screen.height / 2) - (600 / 2);
    var pa = "";
    var ivKey;
    pa = form1.param.value;

    if ($j("#hdnKey").length > 0 && $j("#hdnKey").val() != "")
        ivKey = "&ivKey=" + $j("#hdnKey").val();

    SetExport("../aspx/excelweb.aspx?ivname=" + a + "&ivtype=" + c + ivKey + "&params=", pa, a);

}

function MakeStaticHeader(gridId, height, width, headerHeight, isFooter) {
    var tbl = document.getElementById(gridId);
    if (tbl) {
        var DivHR = document.getElementById('DivHeaderRow');
        var DivMC = document.getElementById('DivMainContent');

        headerHeight = $j('#GridView1').find("tr:first").height();
        width = screen.width - 50;

        //*** Set divheaderRow Properties ****
        DivHR.style.height = headerHeight + 'px';
        DivHR.style.width = (parseInt(width) - 16) + 'px';
        DivHR.style.position = 'relative';
        DivHR.style.top = '0px';
        DivHR.style.zIndex = '10';
        DivHR.style.verticalAlign = 'top';

        //*** Set divMainContent Properties ****
        DivMC.style.width = width + 'px';
        DivMC.style.height = height + 'px';
        DivMC.style.position = 'relative';
        DivMC.style.top = -headerHeight + 'px';
        DivMC.style.zIndex = '1';
        DivHR.appendChild(tbl.cloneNode(true));

    }
}

function OnScrollDiv(Scrollablediv) {
    document.getElementById('DivHeaderRow').scrollLeft = Scrollablediv.scrollLeft;

}
$j(window).on("load", function () {
    setGridviewWidth();
});

function setGridviewWidth() {
    if ($j("#DivMainContent").width() > $j("#GridView1").width())
        $j("#DivMainContent").width($j("#GridView1").width() + 17);
}

function ShowMessageBox(msg, objId) {

    if (objId != undefined) {
        var fld = document.getElementById(objId);
        var posY = FindPosY(fld);
        $j.msgBox({ content: msg, type: "info" }, posY);
    } else
        $j.msgBox({ content: msg, type: "info" }, 100);
}

function ddToggle(e) {
    e.preventDefault();
    $j(".ddlBtn dd ul").toggle();
}


function ShowViewPopup() {
    $j("#divFilterView").css('display', 'block');
}

function CloseViewPopup() {
    $j("#divFilterView").css('display', 'none');
}

function FilterMyView(id) {
    callParentNew("loadFrame()", "function");
    $j("#hdnMyViewName").val(id);

}

function DeleteMyView(id) {
    var result = confirm("Are you sure you want to delete this item?");
    if (result) {
        $j("#hdnMyViewName").val(id);
        $j("#btnDeleteMyView").click();
    }

}

function CheckMyViewFilters() {

    var strMyviewcol = $j("#hdnMyViewFilterCol").val();
    if (strMyviewcol != "" && typeof strMyviewcol !== "undefined") {
        var arrmyViewcolValues = new Array();
        var arrColDtls = strMyviewcol.split("^");
        for (var j = 0; j < arrColDtls.length; j++) {
            var filColNm = arrColDtls[j].substring(0, arrColDtls[j].indexOf(":"));
            var filColDt = arrColDtls[j].substring(arrColDtls[j].indexOf(":") + 1);
            arrmyViewcolValues = filColDt.split(",");
            for (var i = 0; i < arrmyViewcolValues.length; i++) {
                $j("#leftPanel:input[value=" + arrmyViewcolValues[i] + "]").attr("checked", "true");
                var chkId = "#" + filColNm + "colValue";
                $j(chkId + " input").each(function () {
                    if ($j(this).val() == arrmyViewcolValues[i].toString()) {
                        $j(this).prop("checked", true);
                    }
                });
            }
        }

        if ($j("#hdnparamValues").val() != "") {
            SetParamValues($j("#hdnparamValues").val());
        }
    }
    $j("#hdnMyViewFilterCol").val("");
}

function OpenIviewFromIv(srcUrl, params, ivname, navigationType) {
    if (navigationType != undefined)
        configNavProp = navigationType;
    else
        configNavProp = "";

    if (srcUrl != "") {
        closeParentFrame();

        srcUrl = srcUrl + "&AxIvNav=true";
        try {
            ASB.WebService.SetActionIvParams(srcUrl, params, ivname, SuccOpenIvAction);
        } catch (ex) {
            closeParentFrame();
        }
    }
}


function SuccOpenIvAction(result, eventArgs) {
    if (result != "") {
        callParentNew("updateAppLinkObj")?.(result,1,window?.frameElement?.id == "axpiframe");
        //todo : need to remove
        var parFrm = $j("#axpiframe", parent.document);

        if (configNavProp == "" && parFrm.hasClass("frameSplited"))
            configNavProp = "split";

        if (configNavProp === "split") {
            ShowDimmer(false);
            callParentNew(`OpenOnPropertyBase(${result})`, 'function');

        }
        else if (configNavProp === "popup") {
            LoadPopPage(result)
        }
        else if (configNavProp === "default" || configNavProp === "") {
            UpdatePrevMid1FrameUrl(result);
            document.location.href = result;
        }
        else if (configNavProp === "newpage") {
            popupFullPage(result);
        }
    }
}

function adjustwin(ht, iframeWindow, height) {
    var framename = iframeWindow.name;
    framename = framename.toLowerCase();
    if ((framename.substring(0, 7) == "openpop") || (framename.substring(0, 7) == "loadpop") || (framename.substring(0, 7) == "ivewPop")) {
        framename = "MyPopUp";
    }
}
//global variable for pick list
var initialSrchVal = "";
$j(document).keydown(function (e) {
    if (e.which == 13 && $j('#dvPickList').is(':visible') && $j('#tblPickData tr.active').length > 0) {
        //check for the value
        if (initialSrchVal == $j("#" + $j("#tblPickData").attr("data-pick")).val()) {
            e.preventDefault();
            e.stopPropagation();
            var paramString = $j("#tblPickData tr.active td").attr("onclick");
            paramString = paramString.split(';')[0];
            paramString = paramString.substring(23, paramString.length - 2);
            SetPickVal(paramString, $j("#tblPickData tr.active td").data());
            FillDependents(paramString.split('^')[0]);
            pickStatus = false;
            selectedRow = 0;
            e.which = -1;
            //clear the value
            initialSrchVal = "";
        } else {
            createPlSmartSelect($j("#" + $j("#tblPickData").attr("data-pick"))[0]);
        }
    }
    if (e.which == 40 && $j('#dvPickList').is(':visible') && $j('#tblPickData tr.active').length > 0) {
        e.preventDefault();
        e.stopPropagation();
        pickDownn();
        if ($("#dvPickHead .active").offset().top - $("#dvPickHead").offset().top + $("#dvPickHead .active").outerHeight() >= $("#dvPickHead").height() || $("#dvPickHead .active").offset().top - $("#dvPickHead").offset().top < 0) {
            $("#dvPickHead").animate({
                scrollTop: ($("#dvPickHead .active").offset().top - $("#dvPickHead").offset().top) + $("#dvPickHead .active").height()
            }, 100);
        }
        return false;
    }
    if (e.which == 38 && $j('#dvPickList').is(':visible') && $j('#tblPickData tr.active').length > 0) {
        e.preventDefault();
        e.stopPropagation();
        pickUpp();
        $("#dvPickHead").animate({
            scrollTop: ($("#dvPickHead .active").offset().top - $("#dvPickHead").offset().top) - $("#dvPickHead .active").height()
        }, 100);

        return false;
    }

});

/**
 * @description : Iview Tstruct Attachments Implemetation
 * @author Prashik
 * @date 2020-01-21
 * @param {*} proj : Project name
 * @param {*} tid : transid of the tstruct
 * @param {*} fldname : field name in tstruct
 * @param {*} filename : attachment name
 * @param {string} [attachtype="image"]
 * @param {boolean} [onlygetPath=false]
 * @iviewColumnConfiguration:
    * Iview columns to be added:
        * transid : transid of the tstruct
        * fieldname : field name in tstruct(to be kept empty for header attachment)
        * recordid : record id for attachment
        * axp_attach : text to be shown on download hyperlink(this column is an flag to enable/disable attachments componenet)/grid attachment name
        * isdbattach : this is an optional column which determines wheater the attachment is db attachment or file attachment, if the attachment type is db attachment then this column value should be true
 * @resolvePathForTemplates:
    * "resolve attachment path" property is used for iview templetes in case of resolving image path to show image in iview templates
        * "resolve attachment path" Advanced Setting configuration property with property code as "resolve attachment path" to be added as true or false.
 */
function SetFileToDownload(proj, tid, fldname, filename, attachtype = "image", onlyRecordId, onlyFileName, isDbAttachment, onlygetPath = false) {
    var axp_attachfilename;
    if (proj != undefined && tid != undefined && filename != undefined) {
        $j.ajax({
            type: "POST",
            async: !onlygetPath,
            url: "../WebService.asmx/GetFilePathForIviewAttachment",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({ proj, tid, fldname, filename, attachtype, onlyRecordId, onlyFileName, isDbAttachment, onlygetPath }),
            dataType: "json",
            success: function (data) {
                axp_attachfilename = InvokeDownloadButton(data.d, attachtype, onlygetPath);
            },
            failure: function (response) {
                showAlertDialog("error", 3028, "client");
                axp_attachfilename = [];
            },
            error: function (response) {
                showAlertDialog("error", 3028, "client");
                axp_attachfilename = [];
            }
        });
        return axp_attachfilename;
    } else {
        return [];
    }
}

/**
 * @description : Lisiview AxpFile Tstruct Attachments Implemetation
 * @author Prashik
 * @date 2020-06-27
 * @param {*} filepath : attachment path
 * @param {*} filename : attachment name
 * @param {string} [attachtype="axpfile"]
 */
function SetAxpFileListviewDownload(filepath, filename, attachtype = "axpfile") {
    var axp_attachfilename;
    if (filename != undefined) {
        $j.ajax({
            type: "POST",
            async: true,
            url: "../WebService.asmx/GetAxpFilePathForListviewAttachment",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({ filepath, filename }),
            dataType: "json",
            success: function (data) {
                axp_attachfilename = InvokeDownloadButton(data.d, attachtype);
            },
            failure: function (response) {
                showAlertDialog("error", 3028, "client");
                axp_attachfilename = [];
            },
            error: function (response) {
                showAlertDialog("error", 3028, "client");
                axp_attachfilename = [];
            }
        });
        return axp_attachfilename;
    } else {
        return [];
    }
}

function InvokeDownloadButton(link, attachtype, onlygetPath = false) {
    if (link) {
        link = [...new Set(link.split("♠"))].join("♠");
        if (!onlygetPath) {
            for (var i = 0; i < link.split('♠').length; i++) {
                var fileUrl = link.split('♠')[i];
                if (fileUrl.indexOf('Error:') > -1) {
                    fileUrl = fileUrl.replace('Error:', '')
                    showAlertDialog("error", fileUrl);
                    continue;
                }

                var urlSplitted = fileUrl;

                let downloadCommand = "";

                try {
                    downloadCommand = JSON.parse(urlSplitted);
                } catch (ex) {
                    urlSplitted = urlSplitted.split(/\\|\//g);
                    urlSplitted = urlSplitted[urlSplitted.length - 1];

                    downloadCommand = JSON.parse("{\"command\":[{\"cmd\":\"openfile\",\"cmdval\":\"" + urlSplitted + "\",\"isatt\":\"T\"}]}");
                }

                AssignLoadValues(JSON.stringify(downloadCommand));
            }
            return [];
        } else {
            return link.split('♠').map(lnk => {
                try {
                    var cmdVal = JSON.parse(lnk)?.command?.["0"]?.cmdval;

                    if (cmdVal) {
                        return (JSON.parse(lnk).basePath || "") + cmdVal;
                    } else {
                        return lnk;
                    }
                } catch (ex) {
                    return lnk;
                }
            }) || [];
        }
    } else if (!onlygetPath) {
        showAlertDialog("error", 3007, "client");
    }
}

function downloadImage(fileUrl) {
    var image = new Image();
    image.crossOrigin = "anonymous";
    image.src = fileUrl;
    // get file name - you might need to modify this if your image url doesn't contain a file extension otherwise you can set the file name manually
    var fileName = image.src.split(/(\\|\/)/g).pop();
    image.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
        canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size
        canvas.getContext('2d').drawImage(this, 0, 0);
        var blob;

        switch (fileName.match(/\.(jpeg|jpg|gif|png)$/)[0]) {
            case ".gif":
                blob = canvas.toDataURL("image/gif");
                break;
            case ".jpg":
            case ".jpeg":
                blob = canvas.toDataURL("image/jpeg");
                break;
            case ".png":
            default:
                blob = canvas.toDataURL("image/png");
                break;
        }

        $("body").append("<a id=\"hdnButtonInvokeDownload\" class=\"hdnButtonInvokeDownload\" download='" + fileName + "' href='" + blob + "'><img src='" + blob + "'/></a>");
        $(".hdnButtonInvokeDownload:last img").click().parents(".hdnButtonInvokeDownload").remove();
    };
}


var ivAttachRid = [];
var ivAttachTransid = [];
var ivAttachRowNo = [];
var ivFileNames = [];

function DownloadSelectedFiles() {
    $j('#GridView1').find('input[type="checkbox"]:checked').each(function (index) {
        var rowIdx = $j('.downloadLink' + (parseInt($j(this).val()) - 1));
        rowIdx.each(function (i) {
            var link = $j(this).attr("href");
            if (link != undefined && link != null && link != "") {
                link = link.replace("javascript:SetFileToDownload(", "");
                link = link.replace(");", "");
                link = link.replace(/'/g, "");
                var tempArray = link.split(',');
                GetFileValues(tempArray);
            }
        })
    });
    GetDownloadLink();
    ivAttachRid = [];
    ivAttachTransid = [];
    ivAttachRowNo = [];
    ivFileNames = [];
}


function GetDownloadLink() {
    try {
        if (ivAttachRid.length > 0) {
            ASB.WebService.GetZipPathForIviewAttachment(ivAttachRid, ivAttachTransid, ivAttachRowNo, ivFileNames, InvokeDownloadButton, OnException);
        } else
            showAlertDialog("warning", 3029, "client");
    } catch (exp) { }
}

function OnException(response) {

}

function GetFileValues(arr) {
    ivAttachRid.push(arr[0]);
    ivAttachTransid.push(arr[1]);
    ivAttachRowNo.push(arr[2]);
    ivFileNames.push(arr.slice(3).join(","));
}

function setWidth() {

    HideFilter();
    $j("#showFilter").css("display", "block");
    $j("#dvHideFilter").css("display", "none");
    $j("#contentPanelGridIview").css("margin-top", "2%");
}


function parafilterfixer() {

    if (parafilterfix.myFilters == false) {
        $j("#myFilters").attr("aria-expanded", "false");
        if ($j("#Filterscollapse").hasClass("in")) {
            iviewTableWrapperHeightFix();
        }
        $j("#Filterscollapse").removeClass("in show");
        $("#accordion").removeClass("shadow");
        $j("#Filterscollapse").attr("aria-expanded", "false");
    } else {
        $j("#myFilters").attr("aria-expanded", "true");
        if (!$j("#Filterscollapse").hasClass("in")) {
            iviewTableWrapperHeightFix();
        }
        $j("#Filterscollapse").addClass("in");
        $j("#Filterscollapse").attr("aria-expanded", "true");
        $("#accordion").addClass("shadow").css({"top": `${$(".toolbar").outerHeight(true)}px`});
    }
}

function RefreshParams() {
    $j('#hdnGo').val("refreshparams");
    $j('#btnRefreshParams').click();
}

function UpdateGetParamCache() {
    $j('#hdnGo').val("updateCache");
    clearAdvancedFiltersforNewData();
    capturedButton1Submit = true;
}

//function GetStagRecords(checkLink) {
//    callParentNew("loadFrame()", "function");

//    $j("#hdnIViewShow").val(checkLink);

//    var key = $j("#hdnKey").val();
//    var tableno = $j("#hdnStagTableNo").val();
//    var totalRecords = $j("#hdnTotalIViewRec").val();
//    if (totalRecords > 20) {
//        if (checkLink == 'More') {
//            try {
//                ASB.WebService.GetNextStagPage(key, tableno, SuccessGetStag);
//            } catch (ex) { AxWaitCursor(false); }
//        } else if (checkLink == 'All') {
//            try {
//                ASB.WebService.GetAllPages(key, tableno, SuccessGetStag);
//            } catch (ex) { AxWaitCursor(false); }
//        }
//    } else {
//        showMore = false;
//        DisableStagLoad();
//        callParentNew("closeFrame()", "function");
//    }

//}

//function FailureGetStag(result, eventArgs) {
//    closeParentFrame();
//}

//function SuccessGetStag(result, eventArgs) {
//    if (CheckSessionTimeout(result))
//        return;
//    var xmlDoc = $j.parseXML(result);
//    var xml = $j(xmlDoc);
//    var tableno = $j("#hdnStagTableNo").val();
//    tableno = parseInt(tableno, 10) + 1;
//    $j("#hdnStagTableNo").val(tableno);

//    var iViewShowCat = $j("#hdnIViewShow").val();
//    var customers;
//    if (iViewShowCat == 'More') {
//        customers = xml.find("Table_" + tableno);
//    } else {
//        customers = $j(xml).find("Table1");
//    }

//    customers.each(function () {
//        var customer = $j(this);
//        var row = $j("[id$=GridView1] tr").eq(1).clone(true);
//        var rowHtml = "";
//        if (customer[0].childNodes) {
//            var idx = 0;
//            for (var j = 0; j < customer[0].childNodes.length; j++) {
//                var colText = customer[0].childNodes[j].textContent;
//                if (colText != "\n    ") {

//                    if (j == 0 || j == 1) {
//                        var htmlString = row.find("td").eq(idx).html();
//                        if (htmlString.indexOf("checkbox") > -1) {
//                            row.find("td").eq(idx).html(htmlString.replace('value="1"', 'value="' + colText + '"'));
//                        } else
//                            row.find("td").eq(idx).html(colText);
//                    } else {
//                        if (colText == "Grand Total")
//                            row.find("td").eq(idx - 1).html("");
//                        row.find("td").eq(idx).html(colText);
//                    }
//                    idx++;
//                }
//            }
//        } else {
//            for (var j = 0; j < customer[0].children.length; j++) {
//                var colText = customer[0].children[j].textContent;
//                if (j == 0) {
//                    var htmlString = row.find("td").eq(j).html();
//                    if (htmlString.indexOf("checkbox") > -1) {
//                        row.find("td").eq(j).html(row[0].children[0].innerHTML.replace('value="1"', 'value="' + colText + '"'));
//                    } else {
//                        row.find("td").eq(j).html(colText);
//                    }
//                } else {
//                    row.find("td").eq(j).html(colText);
//                }
//            }
//        }
//        $j("[id$=GridView1]").append(row);
//    });

//    var totalGridRows = $j("#GridView1 tr").length - 1;

//    if ($j("#GridView1 tr:last td:eq(0)").text() == "Grand Total" || $j("#GridView1 tr:last td:eq(1)").text() == "Grand Total" || $j("#GridView1 tr:first td:eq(1)").text() == "Grand Total") {
//        if ($j("#GridView1 tr:last td:eq(0)").text() == "Grand Total") {
//            $j("#GridView1 tr:last td:eq(1)").text("Grand Total");
//            $j("#GridView1 tr:last td:eq(1)").css("color", "DarkGreen");
//            $j("#GridView1 tr:last td:eq(1)").css("font-weight", "bold");
//            $j("#GridView1 tr:last td:eq(0)").text(" ")
//        } else if ($j("#GridView1 tr:last td:eq(1)").text() == "Grand Total") {
//            $j("#GridView1 tr:last td:eq(2)").text("Grand Total");
//            $j("#GridView1 tr:last td:eq(2)").css("color", "DarkGreen");
//            $j("#GridView1 tr:last td:eq(2)").css("font-weight", "bold");
//            $j("#GridView1 tr:last td:eq(1)").text(" ");
//        }
//        totalGridRows = totalGridRows - 1;
//    }
//    var totalRecords = $j("#hdnTotalIViewRec").val();
//    if ($j("#nextPrevBtns").is(':visible')) {
//        $j("#lblNoOfRecs").text("Total no of Rows :  " + (totalGridRows) + " of " + totalRecords);
//    } else {
//        if ($j("#dvFilteredRowCount").is(':visible')) {
//            var cutMsg = appGlobalVarsObject.lcm[12];
//            cutMsg = cutMsg.replace('{0}', totalGridRows).replace('{1}', totalRecords);
//            $j("#lblFilteredRowCount").text(cutMsg);
//        }
//    }
//    if (iViewShowCat == 'All' || totalGridRows == totalRecords) {
//        showMore = false;
//        DisableStagLoad();
//    }

//    callParentNew("closeFrame()", "function");
//}

//function DisableStagLoad() {
//    var lnkShow = $j("#dvStagLoad").find('a');
//    lnkShow.removeAttr('onclick');
//    lnkShow.removeClass('handCursor');
//    lnkShow.attr("disabled", "disabled");
//    lnkShow.css("color", "GREY");
//}


function CheckValidTime(fldValue) {
    var finalFldValue = "";
    var values = fldValue.split(':');
    if (timePickerSec && values.length == 2) {
        values.push("");
    } else if (timePickerSec && values.length == 1) {
        values.push("");
        values.push("");
    } else if (!timePickerSec && values.length == 1) {
        values.push("");
    }
    values[0] = values[0].replace(/[^0-9]/g, "0");
    values[1] = values[1].replace(/[^0-9]/g, "0");
    if (timePickerSec) {
        values[2] = values[2].replace(/[^0-9]/g, "0");
    }
    if (!(parseInt(values[0]) <= 23)) {
        values[0] = (values[0].charAt(1) == ":" ? "0" : values[0].charAt(1)) + (values[0].charAt(0) == ":" ? "0" : values[0].charAt(0));
        if (!(parseInt(values[0]) <= 23))
            values[0] = "00";
    }
    if (!(parseInt(values[1]) <= 59)) {
        values[1] = (values[1].charAt(1) == ":" ? "0" : values[1].charAt(1)) + (values[1].charAt(0) == ":" ? "0" : values[1].charAt(0));
        if (!(parseInt(values[1]) <= 59))
            values[1] = "00";
    }
    if (timePickerSec && !(parseInt(values[2]) <= 59)) {
        values[2] = (values[2].charAt(1) == ":" ? "0" : values[2].charAt(1)) + (values[2].charAt(0) == ":" ? "0" : values[2].charAt(0));
        if (!(parseInt(values[2]) <= 59))
            values[2] = "00";
    }
    if (timePickerSec) {
        finalFldValue = values[0] + ":" + values[1] + ":" + values[2];
    } else {
        finalFldValue = values[0] + ":" + values[1];
    }

    return finalFldValue;
}

function ParamSearchOpen(txtobj) {
    curPageNo = 1;
    var id = txtobj.id;
    var fname1 = "";
    var fname = id.split('~');
    if (id.indexOf("~") != -1)
        fname1 = fname[1].toString();
    else
        fname1 = fname[0].toString();

    var obj = $j("#" + fname1);
    var value = obj.val();

    plname = fname1;
    plvalue = value;
    plpageNo = 1;
    plpagesize = 10;
    objid = id;
    CallPicklistService(plname, plvalue, plpageNo, plpagesize, objid);

}

var fallback;
var totalCount;

function CallPicklistService(fldname, value, pageNo, pagesize, id) {
    ShowDimmer(true);
    initialSrchVal = value;
    GetParamValues("clear");//To get all the parameters name & value for picklist dependency.  //"clear" param is passed to skip the alert msg.
    $j.ajax({
        type: "POST",
        url: "../aspx/iview.aspx/GetIviewPickListData",
        contentType: "application/json;charset=utf-8",
        data: '{iviewName: "' + iName + '",pageNo: "' + pageNo +
            '",pageSize: "' + pagesize + '",fieldName :"' + fldname + '",fieldValue :"' +
            value + '",depParamVal:"' + $j("#hdnparamValues").val() + '"}',
        dataType: "json",
        success: function (data) {
            var resultString = "";
            if (CheckSessionTimeout(data.d)) {
                ShowDimmer(false);
                return;
            }
            if (data.d.toLowerCase().indexOf("\"error\":") > -1) {
                ;
                showAlertDialog("error", appGlobalVarsObject.lcm[10]);
                ShowDimmer(false);
            } else {
                var json = JSON.parse(data.d.replace(/@/g, ''));
                let attrs = [];
                if (json.sqlresultset.response != null) {

                    var count = -1;

                    if (!fallback) {
                        count = parseInt(json.sqlresultset.response.totalrows);
                        totalCount = count;
                    } else {
                        count = totalCount;
                        fallback = false;
                    }
                    resultString = count + '♣';
                    var dfparam = eval('dfval' + fldname);

                    if (count == 1) {
                        json.sqlresultset.response.row = [json.sqlresultset.response.row];
                    }

                    $j.each(json.sqlresultset.response.row, function (i, item) {
                        var temp = json.sqlresultset.response.row[i];

                        if (typeof temp == "object" && Object.keys(temp).length > 1) {
                            let attr = "";
                            Object.keys(temp).forEach((pickColName, pickColInd) => {
                                let colObj = temp[pickColName];
                                let colVal = typeof colObj == "string" ? colObj : colObj["#text"];
                                colVal = CheckSpecialCharsInHTML(colVal);
                                let colDt = colObj["dt"] || "";

                                attr += " data-optionsss" + (pickColInd == 0 ? fldname : pickColName) + "=\"" + colVal + "\" " + (pickColInd == 0 || !colDt ? "" : " data-dtypeee" + (pickColInd == 0 ? fldname : pickColName) + "=\"" + (colDt) + "\" ") + " ";
                            });

                            attrs.push(attr);
                        } else {
                            attrs.push("");
                        }

                        if (typeof temp != "object" && dfparam != "" && temp.indexOf("~") != -1) {

                            resultString += (typeof temp[dfparam.split('|')[0].split('~')[0].toUpperCase()] == "string" ? temp[dfparam.split('|')[0].split('~')[0].toUpperCase()] : temp[dfparam.split('|')[0].split('~')[0].toUpperCase()]["#text"]) + '¿';


                        } else {
                            resultString += (typeof temp[Object.keys(temp)[0]] == "string" ? temp[Object.keys(temp)[0]] : temp[Object.keys(temp)[0]]["#text"]) + '¿';
                        }
                    });

                }
                AssignPLValues(resultString, pagesize, id, fldname, attrs);
            }
        },
        failure: function (response) {
            showAlertDialog("error", appGlobalVarsObject.lcm[10]);
            ShowDimmer(false);
            AxWaitCursor(false);
        },
        error: function (response) {
            showAlertDialog("error", appGlobalVarsObject.lcm[10]);
            ShowDimmer(false);
            AxWaitCursor(false);
        }
    });
}

function AssignPLValues(result, pageSize, id, field, attrs = []) {
    var resultArr;
    if (result != "" && result.substring(0, 7) != "<error>") {
        TogglePrevNextLink("inline");
        var tableStr = "";
        if (result.indexOf("♣") != -1) {
            var totRowStr = result.split("♣");
            totalPLRows = parseInt(totRowStr[0], 10);
            if ((totalPLRows / pageSize) % 1 > 0)
                noOfPLPages = Math.floor(totalPLRows / pageSize) + 1;
            else
                noOfPLPages = totalPLRows / pageSize;
            resultArr = totRowStr[1].split("¿");
        } else {
            resultArr = result.split("¿");
        }

        var dv = $j("#dvPickHead");

        if (resultArr != undefined && resultArr != "") {
            tableStr = "<table id='tblPickData' data-pick='" + field + "' class='pickGridData'>";

            for (var i = 0; i < resultArr.length; i++) {
                var tdId = "axPickTd00" + (i + 1) + 'F';
                var pickValue = CheckSpecialCharsInHTML(resultArr[i]);
                if (resultArr[i].toString() != "") {
                    var displayText = resultArr[i].toString();
                    if (resultArr[i].toString().indexOf("^") != -1) {
                        displayText = resultArr[i].toString().split('^')[1];
                    }
                    if (pickValue.indexOf("\\") != -1) {
                        pickValue = pickValue.replace("\\", "\\\\");
                    }

                    tableStr += "<tr><td id=\"" + tdId + "\" onclick=\"javascript:SetPickVal('" + field + "^" + pickValue + "', $(this).data());FillDependents('" + field + "');\" class=\"handCur\" data-setPickVal=\"" + field + "^" + pickValue + "\" " + (attrs[i] || "") + "><a>" + displayText + "</a></td></tr>";
                }
            }
            tableStr += "</table>";

            if (dv.length > 0)
                dv.html(tableStr);
            if ($j("#tblPickData tr").length > 0) {
                $j("#tblPickData tr:nth-child(1)").addClass('active');
            }
        } else {
            if (dv.length > 0) {
                dv.html(`<label>${appGlobalVarsObject.lcm[11]}</label>`);
            }
        }
        SetPrevNextLinks();
        document.getElementById('advancebtn').style.visibility = 'visible';
    } else {
        tableStr = "<table id='' cellpadding='1' cellspacing='1'>";
        tableStr += "";
        tableStr += "</table>";
        document.getElementById('advancebtn').style.visibility = 'hidden';
        tableStr += `<label>${appGlobalVarsObject.lcm[11]}</label>`;
        TogglePrevNextLink("none");
        var dv = $j("#dvPickHead");
        if (dv.length > 0)
            dv.html(tableStr);
    }
    var rowsCount = $j("#tblPickData tbody tr").length;
    if (rowsCount > 1) {
        $j(".inputClass2").keydown(function (e) {

            if (e.which == 40) { // down arrow
                typeof selectedRow == "undefined" ? selectedRow = 0 : "";
                if (selectedRow < rowsCount) {
                    if ($j("#tblPickData tr:nth-child(" + selectedRow++ + ")").length == 0)
                        selectedRow = 2;

                    $j("#tblPickData tr").removeClass("pickbg");
                    $j("#tblPickData tr:nth-child(" + selectedRow + ")").addClass("pickbg");

                    var totalHgt = 0;
                    var rowTotHgt = 0;
                    for (var i = 0; i < selectedRow; i++) {
                        rowTotHgt += $j("#tblPickData tr:nth-child(" + i + ")").height();
                    }
                    var dvHgt = 0;
                    dvHgt = $j('#dvPickHead').height();
                    if ((rowTotHgt + 20) > dvHgt) {
                        $j('#dvPickHead').scrollTop($j('#dvPickHead')[0].scrollHeight);
                    }
                }
            } else if (e.which == 38) { // up arrow
                if (selectedRow > 2) {
                    if ($j("#tblPickData tr:nth-child(" + selectedRow-- + ")").length == 0)
                        selectedRow++;

                    $j("#tblPickData tr").removeClass("pickbg");
                    $j("#tblPickData tr:nth-child(" + selectedRow + ")").addClass("pickbg");

                    if (selectedRow == 1) {
                        e.preventDefault();
                    }
                    var totalHgt = 0;
                    var rowTotHgt = 0;
                    for (var i = rowsCount; i >= selectedRow; i--) {
                        rowTotHgt += $j("#tblPickData tr:nth-child(" + i + ")").height();
                    }
                    var dvHgt = 0;
                    dvHgt = $j('#dvPickHead').height();
                    if ((rowTotHgt + 10) > dvHgt) {
                        var tmpRowNo = selectedRow - 1;
                        $j('#dvPickHead').scrollTop($j("#tblPickData tr:nth-child(" + tmpRowNo + ")").height());

                    }
                }
            }
            // for next,Prev,close and advanced
            else if (e.which == 39) { // right arrow
                if ($j('#nextPick').attr("onclick") != undefined && $j('#nextPick').attr("onclick") != "") {
                    GetData('next');
                    $j('#dvPickHead').scrollTop(0);
                    selectedRow = 1;
                }
            } else if (e.which == 37) { // left arrow
                if ($j('#prevPick').attr("onclick") != undefined && $j('#prevPick').attr("onclick") != "") {
                    GetData('prev');
                    selectedRow = 1;
                    $j('#dvPickHead').scrollTop(0);
                }
            } else if (e.which == 27 || e.which == 9) { // for Close the picklist
                HidePLDiv(false, id);
                selectedRow = 0;
            }
            e.which = -1;
        });
    }

    $j(document).keypress(function (e) {

        if (e.keyCode == -1)
            return;
        if (e.keyCode == 13) {
            var fldId = GetActivePickListId();
            var fieldDcNo = GetFieldsDcNo(fldId);
            var fieldRowNo = GetFieldsRowNo(fldId);
            AxActiveRowNo = GetDbRowNo(fieldRowNo, fieldDcNo);

            if ($j("#dvPickList").is(':visible')) {
                var tdId = "#axPickTd00" + --selectedRow + 'F' + GetTdFrameNo();
                if ($j(tdId).length > 0) {
                    var selcteditm = $j(tdId).find('a')[0].innerText;
                    if (selcteditm == undefined)
                        selcteditm = $j(tdId).find('a')[0].textContent;
                    SetPickVal(field + "^" + selcteditm, $j(tdId).data());
                    FillDependents(field);
                    pickStatus = false;
                }
                selectedRow = 0;
            }
        }
        e.which = -1;
    });
    $j(document).click(function (e) {
        if (e.target.id != 'nextPick' && e.target.id != 'prevPick' && e.target.className != 'curHand' && e.target.className != 'hdrRow') {
            HidePLDiv(false, id);
            selectedRow = 0;
        }
    });
    ShowPickList(id);
    ShowDimmer(false);
    AxWaitCursor(false);
    $j("#" + id).focus();
}

function ShowPickList(id) {

    $j("#pickDimmer").css("display", "none");
    var objId = id;
    var fldProps = objId.split("~");
    var i;
    if (fldProps.length == 2)
        i = 1;
    else
        i = 0;
    var pickFld = document.getElementById(fldProps[i]);

    FindCtrlPos(pickFld);
    var pickFld = $j("#" + fldProps[i]);
    var wdth = pickFld.width() + 19;
    var plHgt = pickFld.height();

    var dv = $j("#dvPickList");
    var divFrameNo = GetFieldsDcNo(fldProps[i]);
    dv.width(wdth);

    //If it's a scroll div,set the position of the left scroll value
    var scrollleft = $j("#contentScroll" + divFrameNo).scrollLeft();
    var scrollTop = $j("#contentScroll" + divFrameNo).scrollTop();
    if (scrollTop > 0) {
        var tmpHgt = (iY - plHgt - scrollTop + 18);
        var tmpTop = parseInt((tmpHgt - 0), 10);
        if (tmpTop > 0)
            dv.css("top", tmpTop + 'px');
        else
            dv.css("top", (iY + 5) + 'px');
    } else
        dv.css("top", (iY + 5) + 'px');

    if (scrollleft > 0) {
        var slValue = (iX - wdth - scrollleft);
        var clientWidth = $j("#divDc" + divFrameNo).width() + 20;
        var scrollWidth = 0;
        var popupScrollWidth = (slValue + 200);
        if (clientWidth < popupScrollWidth)
            scrollWidth = popupScrollWidth - clientWidth;
        var leftV = parseInt((slValue - scrollWidth), 10);
        if (leftV > 0)
            dv.css("left", leftV + 'px');
        else
            dv.css("left", '0px');
    } else
        dv.css("left", (iX - wdth) + 'px');


    dv.show();
    dv.removeClass("d-none");
}

function CheckHeight(top, dvHgt) {
    var frm = $j("#middle1", parent.document);
    var docHgt = document.body.offsetHeight;
    var totHgt = top + dvHgt;
    if (totHgt > docHgt) {
        docHgt = docHgt + (totHgt - docHgt);
        frm.height(docHgt + 100);
    }
}

function TogglePrevNextLink(status) {
    var prev = $j("#prevPick");
    var next = $j("#nextPick");

    if (status == "block" || status == "inline") {
        prev.show();
        next.show();
    } else {
        prev.hide();
        next.hide();
    }
}

//Function which decides to display the next and prev button in the picklist div.
function SetPrevNextLinks() {
    var prev = $j("#prevPick");
    var next = $j("#nextPick");
    var tblPick = $j("#tblPickData");

    if (curPageNo == 1) {
        prev.attr("disabled", "disabled");
        prev.css("display", "none");
        prev.removeAttr("onclick");
    } else {
        prev.attr("disabled", false);
        prev.css("color", "black");
        next.css("color", "black");
        prev.attr("onclick", "javascript:GetData('prev')");
    }

    if (curPageNo < noOfPLPages) {
        next.attr("disabled", false);
        next.css("color", "black");
        next.attr("onclick", "javascript:GetData('next')");
    } else if (curPageNo >= noOfPLPages) {
        next.attr("disabled", "disabled");
        next.css("display", "none");
        next.removeAttr("onclick");
    } else {
        tblPick.attr("disabled", "disabled");
        tblPick.removeAttr("onclick");

    }

}

//Function to get the next or prev page records in picklist dropdown.
function GetData(str) {

    if (str == "prev" && curPageNo > 1) {
        curPageNo = curPageNo - 1;
    } else if (str == "next" && curPageNo < noOfPLPages) {
        curPageNo = curPageNo + 1;
    }
    fallback = true;
    CallPicklistService(plname, plvalue, curPageNo, plpagesize, objid);
}


function FindCtrlPos(fldName) {

    if (typeof (fldName) == "string") {
        fldName = document.getElementById(fldName);
    }
    var fld = fldName;
    var textbox = jQuery(fldName);
    var offset = textbox.offset();
    iX = findPosX(fld) + fld.clientWidth + 1;
    iY = findPosY(fld) + fld.clientHeight + 1;
}

function findPosX(obj) {
    var curleft = 0;
    if (obj.offsetParent) {
        while (obj.offsetParent) {
            curleft += obj.offsetLeft
            obj = obj.offsetParent;
        }
    } else if (obj.x)
        curleft += obj.x;
    return curleft;
}

function findPosY(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
        while (obj.offsetParent) {
            curtop += obj.offsetTop
            obj = obj.offsetParent;
        }
    } else if (obj.y)
        curtop += obj.y;
    return curtop;
}

function SetPickVal(vall, dataObj = {}) {

    vall = dataObj["setpickval"] || vall;

    delete dataObj["setpickval"];

    vall = RepSpecialCharsInHTML(vall);
    vall = vall.split('^');
    var elem = vall[0],
        value = vall[1];
    value = value.replace(/&#94;/g, "^");
    value = value.replace(/&#64;/g, "@");
    document.getElementById(elem).value = value;

    Object.keys(dataObj).forEach(pickColKey => {
        let pickColVal = dataObj[pickColKey];

        $(`#${elem}`).data(pickColKey, pickColVal);
    });
}

function CallSearchOpen(plEle = "") {
    if ($j("#hdnparamValues").val() != "")
        isPlDepParBound = true;

    if ($(`#${plEle.id}`).data("select2").dropdown.$search.val() != "") {
        try {
            var plAdvanceSearchUrl = `./ivpicklist.aspx?sqlsearch=${plEle.id}&searchval=${$(`#${plEle.id}`).data("select2").dropdown.$search.val()}&ivname=${iName}&isPlDepParBound=${isPlDepParBound}`;

            var plAdvSearchHtml = `<iframe id="ivPlAdvSearch" name="ivPlAdvSearch" class="col-12 flex-column-fluid w-100 h-100 p-0 my-n1" src="${plAdvanceSearchUrl}" frameborder="0" allowtransparency="True"></iframe>`;

            let myModal = new BSModal("ivPlAdvSearch", "Pick List", plAdvSearchHtml, () => {
                $(`#${plEle.id}`).select2("close");
            }, () => { });

            myModal.changeSize("fullscreen");
            myModal.scrollableDialog();
            myModal.hideFooter();
        } catch (error) {

        }

    } else {
        showAlertDialog("error", appGlobalVarsObject.lcm[8]);
    }
    isPlDepParBound = false;
}

function GetActivePickListId() {
    var hdn = $j("#hdnPickFldId");
    var objId = hdn.val();
    var fldProps = objId.split("~");
    var i;
    if (fldProps.length > 1)
        i = 1;
    else
        i = 0;

    var fldName = fldProps[i];
    return fldName;
}

/**
 * Initialize objects and html for smartviews
 * @author Prashik
 * @Date   2019-04-11T10:46:29+0530
 * @param  {[type]}                 jsonString : json string for initializing smartview's object and html
 */
function createIvir(jsonString) {
    $("td[data-order^=Grand]").attr("data-order", "");
    ivirColumnTypeObj = {};
    var jsonObject = $.parseJSON(jsonString);
    let jsonObjectBkp;

    if(typeof jsonObject.length != "undefined"){
        jsonObjectBkp = [...jsonObject];

        multipleCachedPages = true;

        jsonObject = $.parseJSON(jsonObject[0]);
    }
    
        if (jsonObject.data) {
            currView = jsonObject.currView || currView;
            if(!window.loadViewName){
                window.loadViewName = (currView || "main");
            }

            ivComps = jsonObject.data.comps;
            ivHeadRows = jsonObject.data.headrow;
            ivExportHF = jsonObject.data.reporthf;
            ivSmartViewSettings = jsonObject.data.smartview && jsonObject.data.smartview.settings;
            
            if (jsonObject.data.actions) {
                ivActions = jsonObject.data.actions;
            }
            if (jsonObject.data.scripts) {
                ivScripts = jsonObject.data.scripts;
            }
            if (jsonObject.data.hyperlinks) {
                ivHyperlinks = jsonObject.data.hyperlinks;
            }
            if (isListView) {
                requestTstructFieldsObj();
                if ($("#hdnListViewFieldsJSON").val() != "") {
                    var lvFldsObj = JSON.parse($("#hdnListViewFieldsJSON").val());
                    try {
                        tstFields = Object.keys(lvFldsObj).reduce((alldata, key) => ([...alldata, ...lvFldsObj[key].fields]), []);
                    } catch (ex) { }

                }
            }
            if (jsonObject.data.configurations && jsonObject.data.configurations.config) {
                ivConfigurations = jsonObject.data.configurations.config.length == undefined ? [jsonObject.data.configurations.config] : jsonObject.data.configurations.config;

                if (ivConfigurations) {
                    processIvConfiguration(ivConfigurations);
                }
            }
            if (jsonObject.data.templetes && jsonObject.data.templetes.templete) {
                try {
                    if (jsonObject.data.templetes.templete.length == undefined) {
                        jsonObject.data.templetes.templete = [jsonObject.data.templetes.templete];
                    }

                    ivTemplates = jsonObject.data.templetes.templete;

                    cardTemplatingHTML = "";

                    var tempTemplateObj = jsonObject.data.templetes.templete.filter((val, data) => {
                        return getCaseInSensitiveJsonProperty(val, "ELEMENTS")[0].toUpperCase() == "ALL"
                    });

                    if (tempTemplateObj && tempTemplateObj.length) {
                        cardTemplatingHTML = getCaseInSensitiveJsonProperty(tempTemplateObj[0], "CVALUE")[0];

                        let cValueJSON = parseJSON(cardTemplatingHTML);

                        if (cValueJSON) {
                            cardTemplatingHTML = cValueJSON.html;

                            let { width, align } = cValueJSON;

                            if (width) {
                                $("#iviewFrame").addClass(`col-lg-${width} col-md-${width} col-sm-12 col-xs-12`);
                            }

                            if (align) {
                                $("#iviewFrame").addClass("alignIview");

                                $("#iviewFrame").addClass(align);
                            }
                        }
                    }

                } catch (ex) { }
            }
        } else if (jsonObject.message) {
            if (jsonObject.message == "webservice timeout") {
                setIviewNotificationInfo(jsonObject);
            }
        }


        FieldName = [];
        HeaderText = [];
        ColumnType = [];
        HideColumn = [];
        custBtnIVIR = [];//
        isChkBox = "true";
        $.each(ivHeadRows, (key, value) => {
            if (!key.startsWith("@") && key != "axp__font" && key != "axrowtype" && key != "pivotghead") {
                // {
                //     if(key == "username"){
                //         ivHeadRows[key]["@mask"]= {
                //             "maskroles": "default",
                //             "maskchar": "X",
                //             "firstcharmask": "2",
                //             "lastcharmask": "3",
                //             "masking": "Mask all characters"
                //         };
                //     }
                // }
                FieldName.push(key);
                HeaderText.push(value["#text"] || "");
                ColumnType.push(value["@type"] || "c");
                HideColumn.push(value["@hide"].toString() || "true");

                if (key.startsWith("p_v_") && !ivHeadRows[key]["@align"]) { //align pivot numeric columns to right
                    ivHeadRows[key]["@align"] = "Right";
                }

                if (key == "rowno") {
                    isChkBox = (value["@hide"].toString() == "false").toString();
                }
                if (requestJSON && FieldName[FieldName.length - 1].toLowerCase().indexOf("axpfilepath_") == 0) {
                    value["@hide"] = HideColumn[HideColumn.length - 1] = "true";
                }
                if (isListView && iName == "temps" && FieldName[FieldName.length - 1].toLowerCase() == "cvalue") {
                    value["@hide"] = HideColumn[HideColumn.length - 1] = "true";
                }

                if (FieldName[FieldName.length - 1].toLowerCase() == "axrowoptions") {
                    value["@hide"] = HideColumn[HideColumn.length - 1] = "true";

                    rowOptionsExist = true;

                    if (!isMobile) {
                        HideColumn[FieldName.indexOf("rowno")] = "false";
                    }

                }
            }
        });
        cardTemplatingHTML = !cardTemplatingHTML && typeof customCardTemplatingHTML != "undefined" ? customCardTemplatingHTML : cardTemplatingHTML;
    
    ivDatas = processRowData(jsonObject.data, jsonObjectBkp);
    dtDbTotalRecords = getDtRecordCount();

    for (var i = 0; i < HeaderText.length; i++) {
        if (HeaderText[i] !== "") {
            ivirColumnTypeObj[FieldName[i]] = ColumnType[i];
        }
    }
    rowTypeExist = FieldName.filter(function (a) { return a == "axrowtype" }).length > 0;
    filteredColumns = FieldName.filter(function (a, b, c) {
        return HideColumn[b] == "false" && (FieldName[b] != "rowno" && FieldName[b] != "axrowtype")
    });
        var pivotHeaderHtml = ``;
        if (ivHeadRows.pivotghead !== undefined && !$.isEmptyObject(ivHeadRows.pivotghead)) {
            pivotCreated = true;
            pivotHeaderHtml += `<tr>`;
            pivotHeaderHtml += generateColumns(1, ``, `width:${minCellWidth}px;`);
            if (ivHeadRows.pivotghead) {
                if (ivHeadRows.pivotghead.head && ivHeadRows.pivotghead.head.length == undefined) {
                    ivHeadRows.pivotghead.head = [ivHeadRows.pivotghead.head];
                }
                var missingHeaderCount = 0;
                try {
                    missingHeaderCount = (parseInt(_.sortBy(ivHeadRows.pivotghead.head, function (pivot) {
                        return parseInt(pivot.sn, 10);
                    })[0].sn, 10)) - 1;
                } catch (ex) { }
                for (let i = 0; i < missingHeaderCount; i++) {
                    pivotHeaderHtml += generateColumns(1, ``);
                }
                ivHeadRows.pivotghead.head.forEach(function (a, b, c) {
                    var colSpan = parseInt(a.en) - parseInt(a.sn);
                    a.ghead = a.ghead || "";
                    pivotHeaderHtml += generateColumns(colSpan, a.ghead);
                });
            } else if (jsonObject.data.PivotAndMerge && Object.keys(jsonObject.data.PivotAndMerge).filter((key, ind) => { return jsonObject.data.PivotAndMerge[key]["#text"] !== "" }).length) {
                Object.keys(jsonObject.data.PivotAndMerge).forEach((key, ind) => {
                    var a = jsonObject.data.PivotAndMerge[key];
                    var colSpan = parseInt(a["@e"]) - parseInt(a["@s"]);
                    a["#text"] = a["#text"] || "";
                    pivotHeaderHtml += generateColumns(colSpan, a["#text"]);
                });
            } else {
                pivotCreated = false;
            }
            function generateColumns(colSpan, title, style) {
                return `<th ${(typeof style != "undefined" ? (`style="${style}"`) : "")} align="center" colspan="${colSpan}" rowspan="1" class="pivotHeaderStyle dt-center">${title.replace(/~/g, "<br />")}</th>`;
            }
            pivotHeaderHtml += `</tr>`;
            if (!pivotCreated) {
                pivotHeaderHtml = ``;
            }
        }
        var thMenuTemplete = ``;//`<button title="Actions Menu" class="btn btn-sm btn-icon btn-active-light-primary me-n3 float-end d-none rightClickMenuIcn" type="button"><span class="material-icons material-icons-style material-icons-3" aria-hidden="true">more_vert</span></button>`;
        var footerTdTemplate = `<td></td>`;
        var footerHtml = ``;
        tableWidth = 0;
        var GridView2THtml = `<table class="gridData table fs-5 ${appGlobalVarsObject._CONSTANTS.compressedMode ? "table-sm" : ""}" rules="all" border="1" id="GridView1" data-row>` +
            `<thead>` +
            pivotHeaderHtml +
            `<tr class="fw-bold text-gray-800 border-bottom-2 border-gray-200">`;

        GridView2THtml += `<th id="GridView1_ctl01_rowno" class="fw-boldest" data-header-name="rowno" scope="col" style="width:${findGetParameter("tstcaption") == null ? minCellWidth : listViewCheckBoxSize}px; ">
            ${(rowOptionsExist) ? `<div class="rowOptionsExist float-start form-check form-check-sm form-check-custom invisible">
                <a href="javascript:void(0);" class="btn btn-sm btn-icon form-check-input">
                    <span class="material-icons material-icons-style material-icons-2">arrow_drop_down</span>
                </a>
            </div>` : ``}
            <div class="form-check form-check-sm form-check-custom ${appGlobalVarsObject._CONSTANTS.compressedMode ? "px-2" : "px-3 py-3"}"><input class="form-check-input  border-gray-500 ${isChkBox == "true" ? "" : "d-none"}" name="chkall" id="chkall" onclick="javascript:CheckAll();" type="checkbox" /></div>
        </th>`;
        footerHtml += footerTdTemplate;
        tableWidth += (findGetParameter("tstcaption") == null ? minCellWidth : listViewCheckBoxSize) + (isChkBox == "true" ? 40 : 0);

        containsDefaultWidth = Object.keys(ivHeadRows).map((col)=>ivHeadRows?.[col]?.["@width"]).reduce((final, current, index, all) => {
            let existEntryCallback = (current)=>{
                return (Number.isNaN(+current) || +current == 80 || +current == 120)
            }
            return final ? (final && existEntryCallback(current)) : (final || existEntryCallback(current))
        }, false);

        HeaderText.forEach(function (a, b, c) {
            if ((FieldName[b] != "rowno")) {
                var width = ivHeadRows[FieldName[b]]["@width"] || minCellWidth;

                (ivHeadRows[FieldName[b]]["@hide"].toString() || "true") == "false" ? tableWidth += parseInt(width, 10) : "";
                GridView2THtml += `<th id="GridView1_ctl01_${FieldName[b]}" class="fw-boldest" data-header-name="${FieldName[b]}" scope="col" style="width:${width}px;">${a.replace(/~/g, "<br />")}${thMenuTemplete}</th>`;
                footerHtml += footerTdTemplate;
            }

        });
        footerHtml = `<tfoot><tr>${footerHtml}</tr></tfoot>`
        GridView2THtml += `</tr>` +
            `</thead>${footerHtml}</table>`;
        $("#GridView2Wrapper").html($(GridView2THtml).css({ "width": `${tableWidth}px` }));

        showParamsPlaceholder();
        /**
         * axPostTableHeaderCreationHook post Table Header creation hook
         * @author Prashik
         * @Date   2020-05-20T12:08:56+0530
         */
        try {
            $("#GridView2Wrapper").html(axPostTableHeaderCreationHook($("#GridView2Wrapper").html()));
        } catch (ex) { };
    

    hiddenColumnIndex = FieldName.map(function (a, b, c) {
        return FieldName[b] == "rowno" || FieldName[b] == "axrowtype" ? "" : (HideColumn[b] == "true" ? b - (rowTypeExist ? 1 : 0) : "")
    }).filter(function (a) { return a !== "" });

    if (isChkBox == "true" || (rowOptionsExist && !false)) {
        filteredColumns = ["", ...filteredColumns];
    } else {
        hiddenColumnIndex = [0, ...hiddenColumnIndex];
    }

        //Expand/Collapse TreeMethod
        HeaderText.forEach((val, ind) => {
            if (val.toString().toLowerCase() == "root_class") {
                cellHeaderConf.root_class_index = FieldName[ind];
            }
            if (val.toString().toLowerCase() == "account name" || val.toString().toLowerCase() == "particulars" || val.toString().toLowerCase() == "+/-") {
                cellHeaderConf.root_account_index = FieldName[ind];
            }
            if (val.toString().toLowerCase() == "root_type") {
                cellHeaderConf.root_atype_index = FieldName[ind];
            }
        });

        if (bulkDownloadEnabled) {
            HeaderText.forEach((val, ind) => {
                if (val.indexOf("axp_attach") > -1) {
                    if (!cellHeaderConf.FilesIndexes) {
                        cellHeaderConf.FilesIndexes = [];
                    }
                    cellHeaderConf.FilesIndexes.push(FieldName[ind]);
                    ivHeadRows[FieldName[ind]]["@align"] = "Center";
                }
                return val;
            });
        }

        if (cellHeaderConf.FilesIndexes && bulkDownloadEnabled) {
            $("#btnDownloadAll").show();
        } else {
            $("#btnDownloadAll").hide();
        }
    if (showColumnSeparator) {
        $("table#GridView1").addClass("table-bordered");
    }
}

//changes for HMS000158,AGI001702
$(document).on("keydown", "input[type='text'],input[type='search'],input[type='radio'],input[type='checkbox']", function (e) {

    if (e.keyCode == 13) {
        e.preventDefault();
    }
    if (e.keyCode == 13 && $(e.target).parents("#Filterscollapse").length !== 0 && $(e.target).parents(".paramtd2.picklist").length == 0) {
        if ($(e.target).is("input:text")) {
            $(e.target).blur();
        }
        $("#button1").click();
    }
});

function CheckDisabled(elemID) {
    var elem = $("#" + elemID);
    clearAdvancedFiltersforNewData();
    if (elem.length && !elem.hasClass("disabled")) {
        elem.addClass("disabled");
        if ($("#waitDiv").is(":hidden"))
            ShowDimmer(true);
    } else {
        return false;
    }
    return true;
}

/**
 * remove advanced filters and its objects for required scenarioes
 * @author Prashik
 * @Date   2019-04-11T10:49:17+0530
 * @return {[type]}                 [description]
 */
function clearAdvancedFiltersforNewData() {
    $("#divModalAdvancedFilters .body-cont").remove();
    advFiltersObjectToApply = {};
}

/**
 * reset smartview variables for required scenarioes
 * @author Prashik
 * @Date   2019-07-05T10:49:17+0530
 * @return {[type]}                 [description]
 */
function resetSmartViewVariables() {
    nxtScrollSize = ivDatas.length;//100;
    defaultRecsPerPage = 100;
    checkNextDBRowsExist = true;
    dtPageNo = 1;
    dtTotalRecords = 0;
    dtDbTotalRecords = 0;
    autoAppendRecords = false;
    pageScrollToEnd = false;
    scrollTopPosition = 0;
    if (firstTimeParams == "") {
        if ($j("#hdnparamValues").val() != "") {
            firstTimeParams = {};
            firstTimeParams.params = $("#hdnparamValues").val().replace(/&grave;/g, "`");
            firstTimeParams.paramsList = getParamsValueList();
            firstTimeParams.paramsList && (firstTimeParams.paramsList = JSON.parse(JSON.stringify(firstTimeParams.paramsList).replace(/&/g, "&amp;")));
        }
    }
}

function valdDecPts(obj, actValue) {
    var newVal = !isNaN(parseFloat(obj.value)) ? parseFloat(obj.value).toFixed(actValue) : "";
    obj.value = newVal;
}

function setRefreshParent(val) {
    eval(callParent('isRefreshParentOnClose') + "=" + val.toLowerCase() + "");
}

/**
 * Generate Iview Data in proper format to be consumed by smartviews
 * @author Prashik
 * @Date   2019-04-11T10:50:54+0530
 * @param  {object}                 processData : json object including full get iview data and additional response
 * @return {object}                 returnData : json object in proper format to be consumed by smartviews
 */
function processRowData(processData, allPagesObj) {
    processParamBadge();
    var returnData = [];
    if (processData["@perfxml"] && processData["@perfxml"] == "true") {
        if (processData.rowdata.row.length == undefined) {
            returnData = [processData.rowdata.row];
        } else {
            returnData = processData.rowdata.row;
        }

        returnData.splice(0, 1);

        if (returnData.length > 0) {
            if (Object.keys(returnData[0]).indexOf("@ROWNO") < 0) {
                returnData = returnData.map((dataa, indexx) => {
                    return { "@ROWNO": (indexx + 1).toString(), ...dataa };
                });
            }
        }
        isPerf = true;
    } else {
        if(!multipleCachedPages && !allPagesObj){
            if (processData.row.length == undefined) {
                returnData = [processData.row];
            } else {
                returnData = processData.row;
            }
        }else{
            allPagesObj.forEach((page, index, pages)=>{
                page = jsonObject = $.parseJSON(page)?.data;

                let pageData;

                if (page.row.length == undefined) {
                    pageData = [page.row];
                } else {
                    pageData = page.row;
                }

                dtPageNo = index + 1;
                var currRowSize = returnData.length;
                var processedData = pageData;
                if (processedData.length > 0) { //if records exists

                    var oldGtotIndex = returnData.findIndex((v) => {
                        return v.axrowtype == "gtot"
                    });

                    var newGtotIndex = processedData.findIndex((v) => {
                        return v.axrowtype == "gtot"
                    });

                    if (oldGtotIndex > -1 && newGtotIndex > -1) {//code for removing multiple grand total rows
                        returnData.splice(oldGtotIndex, 1);
                        // ivirDataTableApi.rows(oldGtotIndex).remove();
                        currRowSize = returnData.length;
                    }

                    var nullCounter = 0;
                    var lastSubHeadGroup = Object.keys(subHeadGroup).reverse().reduce((returnObj, obj, ind) => {
                        if (subHeadGroup[obj] == null) {
                            nullCounter++;
                        } else if (nullCounter < 2) {
                            returnObj.push(parseInt(obj));
                        }
                        return returnObj;
                    }, []).reverse();

                    var newSubHeadIndex = _.findIndex(processedData, ivd => ivd.axrowtype == "subhead");

                    //logic for removing duplicate subhead and its heirarchy
                    var breakSubheadLoop = false;
                    if (lastSubHeadGroup.length > 0 && newSubHeadIndex > -1) {
                        lastSubHeadGroup.forEach((sh, ind) => {
                            try {
                                if (!breakSubheadLoop && processedData?.[newSubHeadIndex]?.axrowtype == "subhead") {
                                    var objDiff = Object.keys(difference(returnData[sh], processedData[newSubHeadIndex]));
                                    if (objDiff.length == 0 || (objDiff.length == 1 && objDiff[0] == "rowno")) {
                                        processedData.splice(newSubHeadIndex, 1);
                                    } else {
                                        breakSubheadLoop = true;
                                    }
                                }
                            } catch (ex) { }
                        });
                    }

                    returnData = returnData.concat(processedData);
                    ivDatas = [...returnData];
                    dtDbTotalRecords = getDtRecordCount(); //update total record count on every page change

                    var currScrollSize = nxtScrollSize > returnData.length ? returnData.length : nxtScrollSize;

                    if(index == 0){
                        nxtScrollSize = returnData.length;
                    }

                    checkIfNextDBRowsExist();

                    pageScrollToEnd = true;
                    // ivirDataTableApi.rows.add(returnData.slice(currRowSize, returnData.length)).draw(false);  //append next records to the datatable & redraw it

                    // $(".dataTables_scrollBody").scrollTop(scrollTopPosition);
                    pageScrollToEnd = false;
                }
                else {
                    //when checking/getting for the next records if no records came from webservice then update record count
                    checkNextDBRowsExist = false;
                    $("#ivInSearchInputButton").addClass("d-none");
                    $("#lnkShowAll").remove();
                    $("#lblCurPage").text('Rows: 1-' + dtDbTotalRecords + ' of ');
                    $("#lblNoOfRecs").text(dtDbTotalRecords);
                }
            });
        }
    }

    //remove single dummy empty row response from WebService
    // returnData.length == 1 && Object.keys(returnData[0]).filter(col => !((/^column[0-9]+$/g).test(col))).filter(function(data){
    //     return returnData[0][data] != "" && returnData[0][data] != null && (typeof returnData[0][getPropertyAccess("recordid")] == "undefined" || returnData[0][getPropertyAccess("recordid")] != "0") && (fieldIdentifier = getColumnName(data)) != "rowno" && (ColumnType[FieldName.indexOf(fieldIdentifier)] != "n" ? true : +returnData[0][data] != 0);
    // }).length == 0 && (returnData = []);
    return returnData;
}

/**
 * Generate Parameters badge to selected filters and its count on hover of badge wrapper available next to parameters show/hide button
 * @author Prashik
 * @Date   2019-04-11T10:54:15+0530
 */
function processParamBadge() {
    paramValuesArray = getParamsValueArray();
    if ($("#FilterValues").length && $("#hdnIsParaVisible").val() != "hidden") {
        if (Object.keys(paramValuesArray).length) {
            var filterValuesRowsString = ``;
            var paramsRowsCount = 0;
            Object.keys(paramValuesArray).forEach((val, ind) => {
                if ($(`.paramtd2 #${val}:not([type=hidden])`).length && paramValuesArray[val] != "") {
                    paramsRowsCount++;
                    paramValuesArray[val] = paramValuesArray[val].replace(/\~/g, ",");
                    filterValuesRowsString += ((!requestJSON && iviewButtonStyle == "old") ? "<div><b>" : (`<span><span>`)) + ($("#" + val).data("caption") || val) + ((!requestJSON && iviewButtonStyle == "old") ? "</b> </td><td>: " : "</span>: ") + paramValuesArray[val] + ((!requestJSON && iviewButtonStyle == "old") ? "</div>" : "</span><span class=\"seperator\">;&nbsp;</span>");
                }
            });
            if (requestJSON) {
                var filterValuesHTML = "<span class=\"filtertooltipNew\">Params" + "<span class=\"ms-10 cursor-pointer tooltiptext\" style=\"display:none;\" >" + filterValuesRowsString + "</span></span>"
                $("#FilterValues").html(filterValuesHTML);

                var paramInfoElm = $(".filtertooltipNew span.tooltiptext").clone().css("display", "");

                $("#dvSelectedFilters + .tooltiptext").replaceWith(paramInfoElm);

                $("#dvSelectedFilters + .tooltiptext").before(`
                    <span data-caption="main" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-dismiss="click" data-bs-original-title="${appGlobalVarsObject.lcm[318]}" onclick="$('#button2').click();" class="material-icons material-icons-style material-icons-5 position-absolute pt-1">clear</span>
                `);
            }
            // else {
            //     var filterValuesHTML = "<span class=\"filtertooltip\">" + paramsRowsCount + "<span class=\"ms-10 cursor-pointer tooltiptext\"><div>" + filterValuesRowsString + "</div></span></span>";
            //     $("#FilterValues").html(filterValuesHTML);

            // }
        } else {
            $("#FilterValues").html("");

        }
        dvToolBarFix();
    }
}

/**
 * @description: generate parameter string from selected parameters
 * @author Prashik
 * @date 2020-08-25
 * @returns : parameter string
 */
function processParamString() {
    let returnString = "";
    paramValuesArray = getParamsValueArray();

    if (Object.keys(paramValuesArray).length) {
        Object.keys(paramValuesArray).forEach((val, ind) => {
            if ($(`.paramtd2 #${val}:not([type=hidden])`).length && paramValuesArray[val] != "") {
                paramValuesArray[val] = paramValuesArray[val].replace(/\~/g, ",");
                returnString += ($("#" + val).data("caption") || val) + ": " + paramValuesArray[val] + ", ";
            }
        });
    }

    return returnString;
}

function UpdatePrevMid1FrameUrl(src) {
    const presentFrame = $(window.frameElement);
    if (presentFrame.attr("id") === "middle1")
        parent.prevMid1FrameUrl = src;
}
function LoadTstFrmIview(srcUrl, ivname, navigationType) {
    GetCurrentTime("Tstruct load on Iview hyperlink click(Post back)");
    var parFrm = $j("#axpiframe", parent.document);
    if ((navigationType == undefined || navigationType == "") && parFrm.hasClass("frameSplited"))
        navigationType = "split"

    try {
        srcUrl = loadTstUrlReWrite(srcUrl) || srcUrl;
    } catch (ex) { }

    if (navigationType === "split") {
        ShowDimmer(false);
        callParentNew(`OpenOnPropertyBase(${srcUrl + params})`, 'function');

    }
    else if (navigationType === "popup") {
        LoadPopPage(srcUrl + params)
    }
    else if (navigationType === "default" || navigationType == "") {
        ReloadIframe(srcUrl + params);
    }
    else if (navigationType === "newpage") {
        popupFullPage(srcUrl + params);
    }


}

function ReloadIframe(NavigationURL) {
    var parFrm = $(window.frameElement);
    try {
        parFrm = reloadingFrameSwitch() || parFrm;
    } catch (ex) { }
    GetProcessTime();
    // parFrm.attr("src", NavigationURL + "&hdnbElapsTime=" + callParentNew("browserElapsTime"));
    try {
        parFrm[0].contentWindow.location.href = NavigationURL + "&hdnbElapsTime=" + callParentNew("browserElapsTime");
    } catch (ex) {}

}
function popupFullPage(NavigationURL) {
    callParentNew("splitfull()", 'function');
    var frm = $j("#middle1", parent.document);
    GetProcessTime();
    // frm.attr("src", NavigationURL + "&hdnbElapsTime=" + callParentNew("browserElapsTime"));
    try {
        frm[0].contentWindow.location.href = NavigationURL + "&hdnbElapsTime=" + callParentNew("browserElapsTime");
    } catch (ex) {}
}

//to get all iview records - displays an option only if pagination exists
function getAllRecords() {
    var glType = callParentNew('gllangType');
    var isRTL = glType == "ar" ? true : false;

    if (!exportType) {
        var ConfirmDeleteCB = $.confirm({
            theme: 'modern',
            title: appGlobalVarsObject.lcm[164],
            onContentReady: function () {
                disableBackDrop('bind');
            },
            backgroundDismiss: 'false',
            rtl: isRTL,
            escapeKey: 'buttonB',
            content: appGlobalVarsObject.lcm[390],
            buttons: {
                buttonA: {
                    text: appGlobalVarsObject.lcm[282],
                    btnClass: 'btn btn-primary',
                    action: function () {
                        ConfirmDeleteCB.close();
                        ShowDimmer(true);
                        setTimeout(function () {
                            setTimeout(() => {
                                getNextDtRecords(0);
                            }, 0);
                        }, 100);

                    }
                },
                buttonB: {
                    text: appGlobalVarsObject.lcm[192],
                    btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                    action: function () {
                        disableBackDrop('destroy');
                        ShowDimmer(false);
                        exportType = "";
                        return;
                    }
                }
            }
        });
    } else {
        var ConfirmDeleteCB = $.confirm({
            theme: 'modern',
            title: appGlobalVarsObject.lcm[164],
            onContentReady: function () {
                disableBackDrop('bind');
            },
            backgroundDismiss: 'false',
            rtl: isRTL,
            escapeKey: 'buttonB',
            content: appGlobalVarsObject.lcm[499],
            columnClass: 'medium',
            buttons: {
                buttonA: {
                    text: appGlobalVarsObject.lcm[500],
                    btnClass: 'btn btn-primary',
                    action: function () {
                        ConfirmDeleteCB.close();
                        ShowDimmer(true);
                        setTimeout(function () {
                            setTimeout(() => {
                                getNextDtRecords(0);
                            }, 0);
                        }, 100);
                    }
                },
                buttonB: {
                    text: appGlobalVarsObject.lcm[501],
                    btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                    action: function () {
                        ConfirmDeleteCB.close();
                        ExecuteDatatableExport();
                        return;
                    }
                },
                buttonC: {
                    text: appGlobalVarsObject.lcm[192],
                    btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                    action: function () {
                        disableBackDrop('destroy');
                        ShowDimmer(false);
                        exportType = "";
                        return;
                    }
                }
            }
        });
    }
}

function requestNextRecords() {
    setTimeout(function () {
        getNextDtRecords(dtPageNo + 1);
    }, 100);
}

//get next page records based on fetch size & page no
function getNextDtRecords(pageNo) {
    showDataTableLoading();

    var ivKey = $j("#hdnKey").val();
    var url = "iview.aspx/GetiViewData";
    var paramX = generateParamX();

    var lvXml = "";
    var sql = "";
    var cols = "";
    var hyp = "";
    if (isListView) {
        if ($("#hdnLvChangedStructure").val() != "") {

        } else {
            cols = $("#hdnLvSelectedCols").val();
            hyp = $("#hdnLvSelectedHyperlink").val();
        }

        lvXml = `<listviewCols><selectedCols>${cols}</selectedCols><selectedHyperlink>${hyp}</selectedHyperlink></listviewCols>`;
    }

    // var data = '{ivKey: "' + ivKey + '", recsPerPage: "' + defaultRecsPerPage + '", pageno: "' + pageNo + '", paramX: "' + paramX + '", lvXml: "' + lvXml + '", lvStructure: "' + $("#hdnLvChangedStructure").val() + '"}'

    if(+originalRecsPerPage){
        pageNo = (Math.ceil(defaultRecsPerPage / +originalRecsPerPage) || 1) + 1;
        dtPageNo = [+pageNo - 1][0];
        
        defaultRecsPerPage = iviewDataWSRows = dtTotalRecords = [+originalRecsPerPage][0];
    }

    var data = JSON.stringify(
        {
            ivKey,
            recsPerPage: defaultRecsPerPage,
            pageno: pageNo,
            paramX,
            lvXml,
            lvStructure: $("#hdnLvChangedStructure").val()
        }
    );
    
    $j.ajax({
        url,
        type: 'POST',
        cache: false,
        async: false,
        data,
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            $("#ivInSearchInputButtonLoader").addClass("d-none");
            originalRecsPerPage = "";
            multipleCachedPages = false;
            if (data && data.d != "" && data.d.result != "") {
                if (data.d.status == "success") {

                    var parsedData = JSON.parse(data.d.result);
                    if (parsedData.data) {
                        if (pageNo == 0) {//to get all records
                            ivDatas = processRowData(parsedData.data);
                            dtDbTotalRecords = getDtRecordCount(); //update total record count on every page change

                            // if (exportType && ivDatas.length >= 1000) {
                                lazyBinding = true;
                                ivirDatatable.DataTable.settings[0].oInit.scroller = true;
                                $(ivirTable).trigger($.Event('preInit' + '.dt'), ivirDatatable.DataTable.settings);
                                $(ivirTable).trigger($.Event('init' + '.dt'), ivirDatatable.DataTable.settings);
                                setSmartViewHeight();
                            // }

                            checkNextDBRowsExist = false;
                            $("#ivInSearchInputButton").addClass("d-none");
                            ivirDataTableApi.rows().remove();
                            ivirDataTableApi.rows.add(ivDatas).draw();  //append next records to the datatable & redraw it
                            $("#lnkShowAll, #requestNextRecords").remove();
                            if (showChartsWithAllRecords) {
                                showChartsWithAllRecords = false;
                                if (ivirMainObj && ivirMainObj.chart && ivirMainObj.chart.length && ivirMainObj.chart.length > 0) {
                                    ivirMainObj.chart.forEach((chart, index) => {

                                        ivirCreateChart(index, true, false);
                                    });
                                }
                            }
                        }
                        else {
                            dtPageNo++
                            var currRowSize = ivDatas.length;
                            var processedData = processRowData(parsedData.data);
                            if (processedData.length > 0) { //if records exists

                                    var oldGtotIndex = ivDatas.findIndex((v) => {
                                        return v.axrowtype == "gtot"
                                    });

                                    var newGtotIndex = processedData.findIndex((v) => {
                                        return v.axrowtype == "gtot"
                                    });

                                    if (oldGtotIndex > -1 && newGtotIndex > -1) {//code for removing multiple grand total rows
                                        ivDatas.splice(oldGtotIndex, 1);
                                        ivirDataTableApi.rows(oldGtotIndex).remove();
                                        currRowSize = ivDatas.length;
                                    }

                                    var nullCounter = 0;
                                    var lastSubHeadGroup = Object.keys(subHeadGroup).reverse().reduce((returnObj, obj, ind) => {
                                        if (subHeadGroup[obj] == null) {
                                            nullCounter++;
                                        } else if (nullCounter < 2) {
                                            returnObj.push(parseInt(obj));
                                        }
                                        return returnObj;
                                    }, []).reverse();

                                    var newSubHeadIndex = _.findIndex(processedData, ivd => ivd.axrowtype == "subhead");

                                    //logic for removing duplicate subhead and its heirarchy
                                    var breakSubheadLoop = false;
                                    if (lastSubHeadGroup.length > 0 && newSubHeadIndex > -1) {
                                        lastSubHeadGroup.forEach((sh, ind) => {
                                            try {
                                                if (!breakSubheadLoop && processedData?.[newSubHeadIndex]?.axrowtype == "subhead") {
                                                    var objDiff = Object.keys(difference(ivDatas[sh], processedData[newSubHeadIndex]));
                                                    if (objDiff.length == 0 || (objDiff.length == 1 && objDiff[0] == "rowno")) {
                                                        processedData.splice(newSubHeadIndex, 1);
                                                    } else {
                                                        breakSubheadLoop = true;
                                                    }
                                                }
                                            } catch (ex) { }
                                        });
                                    }

                                ivDatas = ivDatas.concat(processedData);
                                dtDbTotalRecords = getDtRecordCount(); //update total record count on every page change

                                var currScrollSize = nxtScrollSize > ivDatas.length ? ivDatas.length : nxtScrollSize;
                                nxtScrollSize = ivDatas.length;

                                checkIfNextDBRowsExist();

                                pageScrollToEnd = true;
                                ivirDataTableApi.rows.add(ivDatas.slice(currRowSize, ivDatas.length)).draw(false);  //append next records to the datatable & redraw it

                                $(".dataTables_scrollBody").scrollTop(scrollTopPosition);
                                pageScrollToEnd = false;
                            }
                            else {
                                //when checking/getting for the next records if no records came from webservice then update record count
                                checkNextDBRowsExist = false;
                                $("#ivInSearchInputButton").addClass("d-none");
                                $("#lnkShowAll").remove();
                                $("#lblCurPage").text('Rows: 1-' + dtDbTotalRecords + ' of ');
                                $("#lblNoOfRecs").text(dtDbTotalRecords);
                            }
                        }
                        clearAdvancedFiltersforNewData();
                        ExecuteDatatableExport();
                        ShowDimmer(false);
                    } else if (parsedData.message) {
                        if (parsedData.message == "webservice timeout") {
                            setIviewNotificationInfo(parsedData);
                        }
                    }

                    try {
                        KTMenu?.init();                                
                    } catch (error) { }
                }
                else {
                    showAlertDialog("warning", data.d.result);
                    if (data.d.result == "Session Authentication failed...")
                        parent.window.location.href = "../aspx/sess.aspx";
                    ShowDimmer(false);
                    exportType = "";
                }
            }
            ShowDimmer(false);
            AxWaitCursor(false);

            exportType = "";
        },
        failure: function (response) {
            $("#ivInSearchInputButtonLoader").addClass("d-none");
            AxWaitCursor(false);
            ShowDimmer(false);
            exportType = "";
        },
        error: function (response) {
            $("#ivInSearchInputButtonLoader").addClass("d-none");
            AxWaitCursor(false);
            ShowDimmer(false);
            exportType = "";
        }
    });
}


/**
 * Get no of valid rows available in iview data response object
 * @author Prashik
 * @Date   2019-04-11T10:56:51+0530
 * @return {int}                 : Count of valid iview rows
 */
function getDtRecordCount() {
    return ivDatas.reduce((sum, val, ind) => {
        if (requestJSON && (typeof val["axrowtype"] == "undefined" || (typeof val["axrowtype"] != "undefined" && (val["axrowtype"] == null || val["axrowtype"] == "")))) {
            return sum + 1;
        }
        else if (isPerf || (typeof val["axrowtype"] != "undefined" && (val["axrowtype"] == null || val["axrowtype"] == ""))) {
            return sum + 1;
        } else {
            return sum + 0;
        }
    }, 0);
}

/**
* get no of having infomation like grand total/sub total/sub headings
* @author Abhishek
* @Date   2019-04-23 10:56:51+0530
* @return {int}                 : Count of special rows
*/
function getSpecialRowCount() {
    return ivDatas.length - dtDbTotalRecords;
}

/**
* check if next db records exist or not
* @author Abhishek + Prashik
* @Date   2019-04-23 10:56:51+0530
*/
function checkIfNextDBRowsExist(onPageLoad) {
    try {
        dtDbTotalRecords = getDtRecordCount();
        var axpertPageSize, allRecsCached = false;

        if (onPageLoad) { //first time when page load
            if (!requestJSON) {
                axpertPageSize = JSON.parse($("#hdnIViewData").val()).data.headrow["@pagesize"];
            } else {
                try {
                    let thisJSON = JSON.parse($("#hdnIViewData").val());
                    if(typeof thisJSON.length != "undefined"){
                        thisJSON = JSON.parse(thisJSON[0]);
                    }
                    axpertPageSize = thisJSON.pagesize.pagesize;
                } catch (ex) { }
            }
            if (axpertPageSize != undefined) {
                axpertPageSize = parseInt(axpertPageSize);
                if (axpertPageSize == 0) { //if pagesize is defined as <=0 then it will get total records
                    defaultRecsPerPage = iviewDataWSRows = dtDbTotalRecords;
                    allRecsCached = true;
                }
                else
                    defaultRecsPerPage = iviewDataWSRows = axpertPageSize;
            }
            else
                defaultRecsPerPage = iviewDataWSRows;
        }
        /*
            Disable checkNextDBRowsExist if any of the below condition true
                1. no records exists
                2. all records came
                3. fetch size is defined from Adv settings & pagesize is defined from Axpert --  dtDbTotalRecords < axpertPageSize
                4. fetch size > db records
                5. last record came
        */
        if (isPivotReport || dtDbTotalRecords == 0 || allRecsCached || (dtDbTotalRecords % iviewDataWSRows != 0) && (axpertPageSize == undefined ? true : dtDbTotalRecords < axpertPageSize)) {
            checkNextDBRowsExist = false;
            $("#ivInSearchInputButton").addClass("d-none");
            $("#lnkShowAll").addClass("d-none");
            return false;
        }
        else {
            if(!multipleCachedPages){
                defaultRecsPerPage = iviewDataWSRows = dtTotalRecords;
            }
            
            checkNextDBRowsExist = true;
            $("#lnkShowAll").removeClass("d-none");
            return true;


        }
    } catch (ex) { }
}
//inmemdb
function pieChart1(datats) {
    try {
        $('#inMemChartWrapper').highcharts({
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
                },
                height: 250
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
                text: appGlobalVarsObject.lcm[291],
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
        $(".iviewTableWrapperNew").addClass("chartsAdded");
        adjustChartBasedWrapperHeight();
    }
    catch (e) {
        showAlertDialog('warning', appGlobalVarsObject.lcm[361]);
    }
}

// region get memory represnention for redis
function callCharts() {
    ShowDimmer(true);
    $.ajax({
        type: "POST",
        url: "../aspx/iview.aspx/MemoryDetails",
        contentType: "application/json;charset=utf-8",
        data: '{}',
        dataType: "json",
        success: function (data) {
            ShowDimmer(false);
            pieChart1(data.d);
            isPostback = false;
        },
        error: function (response) {
            showAlertDialog('warning', appGlobalVarsObject.lcm[273] + appGlobalVarsObject.lcm[274]);
            ShowDimmer(false);
        }
    });
}

function loadAxTstruct(urlNavigationPath) {
    var parFrm = $j("#axpiframe", parent.document);
    var parFrmmiddle = $j("#middle1", parent.document);
    if (parFrm.hasClass("frameSplited")) {
        if (urlNavigationPath.toLowerCase().indexOf("tstruct.aspx?") > -1) {
            var tstRecId = "", tstQureystr = "";
            if (urlNavigationPath != "") {
                urlNavigationPath.split('&').forEach(function (paramType) {
                    if (paramType.indexOf("recordid=") > -1)
                        tstRecId = paramType.split("=")[1];
                    else
                        tstQureystr += paramType + "♠";
                });
            }
            if (tstRecId != "" && tstRecId != "0")
                $j("#axpiframe", parent.document)[0].contentWindow.GetLoadData(tstRecId, tstQureystr);
            else
                $j("#axpiframe", parent.document)[0].contentWindow.GetFormLoadData(tstQureystr);
            AxWaitCursor(false);
            ShowDimmer(false);
        }
        else
            parFrm.attr("src", urlNavigationPath);
    }
    else
        parFrmmiddle.attr("src", urlNavigationPath);
}

/**
 * @description: push recordID for visible records in session for tstruct navigation
 * @author Prashik
 * @date 2019-10-01
 */
function setListViewDictionary(viewNavigationDataTemp, viewRecordKey) {
    ASB.WebService.SetListViewDictionary(viewNavigationDataTemp, parseInt(viewRecordKey, 10), iName, function (e, t) { }, function (e) { });
}

/**
 * @description: get toolbar json sorted based on button feft positioning
 * @author Prashik
 * @date 2020-03-31
 * @param {*} toolbarJSON: original unsorted json
 * @returns : sorted json
 */
function getFormattedToolbarJSON(toolbarJSON) {
    try {
        /**
         * @description: axUpdateToolbarJson: use this hook to add or update in existing toolbarJSON
         * @author Prashik
         * @date 2020-03-31
         * @param {*} toolbarJSON
         * @returns 
         */
        toolbarJSON = axUpdateToolbarJson(toolbarJSON);
    } catch (ex) { }
    return _.sortBy(toolbarJSON, function (json) {
        return parseInt(json.left, 10);
    }).filter((button) => { return button.key })
}

/**
 * @description: generate complete toolbar html including parameters based on toolbarJSON
 * @author Prashik
 * @date 2020-03-31
 */
function constructToolbar() {
    $("#iconsNewNew").addClass("d-none");
    $("#iconsNewRemove").addClass("d-none");
    $("#iconsNewUtility ul li").addClass("d-none");
    $("#iconsNewOption ul li").remove();

    if (toolbarJSON) {
        if (typeof toolbarJSON == "string") {
            toolbarJSON = JSON.parse(toolbarJSON);
        }
    }

    toolbarHTML = ``;

    if (requestJSON && iviewButtonStyle != "old") {
        toolbarHTML += constructToolbarHTML(getFormattedToolbarJSON(toolbarJSON), false);
    }

    var filterBtnHtml = `
    <li id="myFiltersLi" class="${iviewButtonStyle == "old" ? `btn btn-white btn-sm btn-color-gray-600 btn-active-primary shadow-sm me-2 ${$("#hdnIsParaVisible").val() != "hidden" ? "" : "d-none"}"` : "menu-item px-3"} ${$("#hdnIsParaVisible").val()} onclick="$('#Filterscollapse').collapse('toggle');">
        <a href="#Filterscollapse" id="myFilters" class="filterBuTTon ${iviewButtonStyle == "old" ? "text-gray-600 text-hover-white" : ""}" data-bs-toggle="collapse" data-bs-parent="#accordion" aria-expanded="false" onclick="$('#Filterscollapse').collapse('toggle');">
            <span class="ccolapsee material-icons material-icons-style ${iviewButtonStyle == "old" ? "d-none" : ""}">search</span>
            <span id="lblfilters" title="Params">
                Params
            </span>
        </a> `;
    // if (requestJSON && iviewButtonStyle == "old") {
    //     filterBtnHtml += ` <div id="dvSelectedFilters" class="badge badge-primary cursor-pointer d-none">
    //         <span id="FilterValues"></span>      
    //     </div>`;
    // }
    filterBtnHtml += `</li>`;

    if (iviewButtonStyle != "modern") {
        toolbarHTML += filterBtnHtml;
    }

    toolbarHTML += `
    ${(iviewButtonStyle == "old") ? `<li id='filterWrapper' class="menu-item">
        <span class="material-icons pinIcon customIcon d-none" title="Pin to taskbar">
            push_pin
        </span>
    </li>` 
    : ``}
    <li id='ivirCButtonsWrapper' class="menu-item px-3 d-none" data-kt-menu-trigger="hover" data-kt-menu-placement="right-start"
    data-kt-menu-flip="left-start, top">
        <span class="material-icons pinIcon customIcon d-none" title="Pin to taskbar">
            push_pin
        </span>
    </li>`;

    if (iviewButtonStyle == "modern") {
        toolbarHTML += filterBtnHtml;
        toolbarHTML = `<div class="card">
            <div class="card-body py-5">
                <div class="mh-450px scroll-y me-n5 pe-5">
                    <div class="row g-2">
                        ${toolbarHTML}
                    </div>
                </div>
            </div>
        </div>`;
    }

    if (iviewButtonStyle == "old") {
        toolbarHTML += constructToolbarHTML(getFormattedToolbarJSON(toolbarJSON), false);
    }

    $("#iconsUl").children().remove();
    $("#iconsUl").append(toolbarHTML);
    if (requestJSON && iviewButtonStyle != "old") {
        $('#myFiltersLi').css('display', 'none');
    }
    constuctDataButton();

    $("#iconsNewUtility ul li:not(.d-none)").length > 0 ? $("#iconsNewUtility").removeClass("d-none") : $("#iconsNewUtility").addClass("d-none");

    if (requestJSON && iviewButtonStyle != "old") {
        $("#iconsUl li ul").each((ind, elem) => {
            $(elem).find("li").length == 0 && $(elem).parent("li").remove();
        });
    }

    var displayNoneCount = 0;
    if (requestJSON && iviewButtonStyle != "old") {
        $("#iconsUl li").each((ind, elm) => {
            if ($(elm).css("display") == "none" || $(elm).hasClass("d-none")) {
                displayNoneCount++;
            }
        });
        if ($("#iconsUl li").length == displayNoneCount) {
            $("#iconsNewOption").addClass("d-none");
        }
    }

    setPinedIconContainerWidth();

    if (requestJSON && iviewButtonStyle == "modern") {
        $("#iconsExportUl, #iconsUl").removeClass("w-200px").addClass("w-100 w-sm-350px");
        $("#iconsExportUl li, #iconsUl li").removeClass("menu-item px-3").addClass("col-4");
        $("#iconsExportUl li a, #iconsUl li a").removeClass("menu-link px-3").addClass("d-flex flex-column flex-center text-center text-gray-800 text-hover-primary bg-hover-light rounded p-3 mb-3");
        $("#iconsExportUl li a .dropdownIconUI, #iconsUl li a .dropdownIconUI").removeClass("symbol-25px me-5").addClass("symbol-40px");
        $("#iconsExportUl li a .iconUITitle, #iconsUl li a .iconUITitle").addClass("mb-1");
    }

    if (requestJSON && appGlobalVarsObject._CONSTANTS.compressedMode) {
        $(".toolbarRightMenu").find(".tb-btn").addClass("btn-sm");
        $(".toolbarRightMenu").find(".tb-btn .material-icons.material-icons-style").addClass("material-icons-2");
    }
}

/**
 * @description: recursive toolbar html generator by parsing toolbarJSON
 * @author Prashik
 * @date 2020-03-31
 * @param {*} toolbarJSON: valid sorted toolbarJSON JSON object
 * @param {*} parentRoot: true/false: if the parent node is dropdown root or not
 * @returns 
 */
function constructToolbarHTML(toolbarJSON, parentRoot) {
    var toolbarHTML = "";
    if (requestJSON && iviewButtonStyle != "old") {
        toolbarJSON.forEach((button) => {
            if (button.isRoot) {
                /**
                 * @description: axToolbarRootGenerator: use this hook to generate toolbar root html
                 * @author Prashik
                 * @date 2020-03-31
                 * @param {*} button: object for button
                 * @returns : html string
                 */
                toolbarHTML += ((typeof axToolbarRootGenerator != "undefined" && axToolbarRootGenerator(button)) || `
                    <li class="menu-item px-3" data-kt-menu-trigger="hover" data-kt-menu-placement="right-start"
                    data-kt-menu-flip="left-start, top">
                        <span class="iconUIPin"><i class="fa fa-thumb-tack"></i></span>
                        <span class="material-icons pinIcon customIcon d-none ${iName == "inmemdb" ? "d-none" : ""} " title="Pin to taskbar">push_pin</span>
                        <a href="javascript:void(0)" id="${button.key}" class="menu-link px-3" title="${finalCaption = getModernButtonIconInfo(button.groupName)}" data-close-others="true">
                            <div class="menu-icon symbol ${iviewButtonStyle == "modern" ? "symbol-40px" : "symbol-25px"} symbol-circle me-5 dropdownIconUI">
                                <span class="symbol-label bg-primary text-white fw-normal fs-3 iconUITitle">${(button.icon && button.icon != "" && getButtonIconHTML(button.icon)) || getModernButtonIconInfo(button.groupName)}</span>
                            </div>
                            <span class="menu-title dropdownIconName text-break text-wrap">${getModernButtonIconInfo(button.groupName, false)}</span>
                            <!--<i class="fa fa-angle-down modernDropdownIcon" aria-hidden="true"></i>-->
                            <span class="menu-arrow"></span>
                        </a>
                        <ul class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bolder mh-450px scroll-y ${iviewButtonStyle == "modern" ? "w-100 w-sm-350px py-4" : "w-200px py-3"} ">
                            ${iviewButtonStyle == "modern" ? `<div class="col-12 d-flex flex-wrap">` : ``}
                                ${constructToolbarHTML(getFormattedToolbarJSON(button), true)}
                            ${iviewButtonStyle == "modern" ? `</div>` : ``}
                        </ul>
                    </li>
                    `);
            } else {
                if (button.href || button.onclick) {
                    if (button.onclick && typeof button.onclick == "object") {
                        button = Object.keys(button.onclick).map((caption, index) => {
                            var buttonNew = { ...button }
                            buttonNew.onclick = buttonNew.onclick[caption]
                            buttonNew.caption = caption.replace(/_/g, " ")
                            buttonNew.key = caption.replace(/ /g, "_")
                            return buttonNew
                        });
                    } else {
                        button = [button]
                    }
                    button.forEach((buttonNew) => {
                        /**
                         * @description: axToolbarSingleNodeGenerator: use this hook to generate toolbar single node html
                         * @author Prashik
                         * @date 2020-03-31
                         * @param {*} buttonNew: object for button
                         * @param {*} parentRoot: true/false: if the parent node is dropdown root or not
                         * @returns : html string
                         */
                        toolbarHTML += ((typeof axToolbarSingleNodeGenerator != "undefined" && axToolbarSingleNodeGenerator(buttonNew, parentRoot)) || ((iconsNewLogicVar = iconsNewLogicFunction(buttonNew, parentRoot)) && iconsNewLogicVar ? `` : `
                        <li class="menu-item px-3">
                            <span class="iconUIPin"><i class="fa fa-thumb-tack"></i></span>
                            <span class="material-icons pinIcon d-none customIcon ${iName == "inmemdb" ? "d-none" : ""} " title="Pin to taskbar">push_pin</span>
                            <a onclick="${buttonNew.onclick || ""}" id="btn_${buttonNew.key}" title="${finalCaption = getModernButtonIconInfo(buttonNewTitle = (buttonNew.caption || buttonNew.hint || buttonNew.key), false)}" class="menu-link px-3" href="${buttonNew.href || ""}">
                                <div class="symbol ${iviewButtonStyle == "modern" ? "symbol-40px" : "symbol-25px"} symbol-circle me-5 dropdownIconUI">
                                    <span class="symbol-label bg-primary text-white fw-normal fs-3 iconUITitle">${(buttonNew.icon && buttonNew.icon != "" && getButtonIconHTML(buttonNew.icon)) || getModernButtonIconInfo(buttonNewTitle)}</span>
                                </div>
                                <span class="dropdownIconName text-break text-wrap">${finalCaption}</span>
                            </a>
                        </li>
                    `));
                    });
                }
            }
        });
    }
    else {
        toolbarJSON.forEach((button) => {
            if (button.isRoot) {
                /**
                 * @description: axToolbarRootGenerator: use this hook to generate toolbar root html
                 * @author Prashik
                 * @date 2020-03-31
                 * @param {*} button: object for button
                 * @returns : html string
                 */
                toolbarHTML += ((typeof axToolbarRootGenerator != "undefined" && axToolbarRootGenerator(button)) || `
                    <li class="btn btn-white btn-sm btn-color-gray-600 btn-active-primary shadow-sm me-2 menu-item menu menu-dropdown" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-start">
                        <a href="javascript:void(0)" id="${button.key}" class="menu-link text-gray-600 text-hover-white p-0" title="${button.groupName}">
                            <span class="tbIcon menu-icon ${(typeof button.icon == "undefined" || button.icon == "" ? "d-none" : "") || ""}">${(button.icon && button.icon != "" && getButtonIconHTML(button.icon)) || ""}</span>
                            <span class="tbTitle menu-title">${button.groupName}</span>
                            <span class="menu-arrow">
                            </span>
                        </a>
                        <ul class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg-light-primary fw-bold w-200px" data-kt-menu="true">
                            ${constructToolbarHTML(getFormattedToolbarJSON(button), true)}
                        </ul>
                    </li>
                    `);
            } else {
                if (button.href || button.onclick) {
                    if (button.onclick && typeof button.onclick == "object") {
                        button = Object.keys(button.onclick).map((caption, index) => {
                            var buttonNew = { ...button }
                            buttonNew.onclick = buttonNew.onclick[caption]
                            buttonNew.caption = caption.replace(/_/g, " ")
                            buttonNew.key = caption.replace(/ /g, "_")
                            return buttonNew
                        });
                    } else {
                        button = [button]
                    }
                    button.forEach((buttonNew) => {
                        /**
                         * @description: axToolbarSingleNodeGenerator: use this hook to generate toolbar single node html
                         * @author Prashik
                         * @date 2020-03-31
                         * @param {*} buttonNew: object for button
                         * @param {*} parentRoot: true/false: if the parent node is dropdown root or not
                         * @returns : html string
                         */
                        toolbarHTML += ((typeof axToolbarSingleNodeGenerator != "undefined" && axToolbarSingleNodeGenerator(buttonNew, parentRoot)) || `
                        <li class="${parentRoot ? "" : "btn"} btn-white ${parentRoot ? "" : "btn-sm"} btn-color-gray-600 btn-active-primary shadow-sm me-2 ${parentRoot ? "liTaskItems" : "actionWrapper"} menu-item">
                            <a onclick="${buttonNew.onclick || ""}" id="btn_${buttonNew.key}" title="${buttonNew.hint || buttonNew.caption || buttonNew.key}" class="action singleaction handCur l2 text-gray-600 text-hover-white menu-link ${parentRoot? "" : "p-0"}" href="${buttonNew.href || ""}">
                            <span class="tbIcon menu-icon ${(typeof buttonNew.icon == "undefined" || buttonNew.icon == "" ? "d-none" : "") || ""}">${(buttonNew.icon && buttonNew.icon != "" && getButtonIconHTML(buttonNew.icon)) || ""}</span>
                            <span class="tbTitle menu-title"> ${buttonNew.caption || buttonNew.hint || buttonNew.key}</span>
                            </a>
                        </li>
                    `);
                    });
                }
            }
        });
    }
    return toolbarHTML;
}

function widthOfList() {
    var itemsWidth = 0;
    $('#viewTabs li').each(function () {
        var itemWidth = $(this).outerWidth();
        itemsWidth += itemWidth;
    });
    return itemsWidth;
}

function widthOfHidden() {
    var ww = 0 - $('#dvViewtabs').outerWidth();
    var hw = (($('#dvViewtabs').outerWidth()) - widthOfList() - getLeftPosi()) - scrollBarWidths;

    if (ww > hw) {
        return ww;
    }
    else {
        return hw;
    }

}

function getLeftPosi() {

    var ww = 0 - $('#dvViewtabs').outerWidth();
    var lp = $('#viewTabs').position().left;

    if (ww > lp) {
        return ww;
    }
    else {
        return lp;
    }
}

/**
 * @description adjust the viewtab scroller after every load and navigation
 * @author Rakesh
 * @date 2020-06-06
 */
function reAdjust() {
    if (($('#dvViewtabs').outerWidth()) < widthOfList()) {
        $('.scroller-right').show();
    }
    else {
        ``
        $('.scroller-right').hide();
    }

    if (getLeftPosi() < 0) {
        $('.scroller-left').show();
    }
    else {
        $('.item').animate({ left: "-=" + getLeftPosi() + "px" }, 'slow');
        $('.scroller-left').hide();
    }
}
function scrollerRightClick() {
    $('.scroller-left').fadeIn('slow');
    if (-widthOfHidden() < $('#dvViewtabs').outerWidth())
        $('.scroller-right').fadeOut('slow');
    lastTabPos = $('#viewTabs > li:last').offset().left + $('#viewTabs > li:last').outerWidth();
    if (lastTabPos >= $('#dvViewtabs').outerWidth())
        $('#viewTabs').animate({ left: "+=" + widthOfHidden() + "px" }, 'slow', function () {
        });
}
function scrollerLeftClick() {
    $('.scroller-right').fadeIn('slow');
    $('#viewTabs').animate({ left: "-=" + getLeftPosi() + "px" }, 'slow', function () {
        reAdjust();
    });

}

function scrollToActiveView(view) {

    var ActiveTabRight = $('#' + view).offset().left + $('#' + view).outerWidth();
    var viewListRight = $('#dvViewtabs').outerWidth();
    if (viewListRight < ActiveTabRight) {
        $('#viewTabs').animate({ left: "-=" + $('#' + view).offset().left + "px" }, 'slow', function () {

        });
        $('.scroller-left').fadeIn('slow');
    }
}

function checkAllCheckBoxTokens(elem, elemId) {
    if ($(elem).is(":checked")) {
        $(`#${elemId} > option`).prop("selected", "selected");
        $(`#${elemId}`).trigger("change").select2("close");
    } else {
        $(`#${elemId} > option`).prop("selected", "");
        $(`#${elemId}`).trigger("change").select2("close");
    }
}

function iconsNewLogicFunction(buttonNew, parentRoot) {
    if (isMobile) {
        return false;
    }
    if (buttonNew.key == "new" && buttonNew.href && buttonNew.href.indexOf(`javascript:callOpenAction('opentstruct'`) == 0) {
        $("#iconsNewNew").removeClass("d-none");
        $("#iconsNewNew a").attr("href", buttonNew.href);
        return true;
    } else if (buttonNew.key == "delete" && buttonNew.href && buttonNew.href.indexOf(`javascript:callDelete('`) == 0) {
        $("#iconsNewRemove").removeClass("d-none");
        $("#iconsNewRemove a").attr("href", buttonNew.href);
        return true;
    } else if (thisHref = (buttonNew.href && buttonNew.href.indexOf(`javascript:toHTML(`) == 0 && buttonNew.href) || (buttonNew.onclick && buttonNew.onclick.indexOf(`javascript:toHTML(`) == 0 && buttonNew.onclick)) {
        $("#iconsExportPrint").removeClass("d-none").find("a").attr("href", thisHref);
        return true;
    } else if (thisHref = (buttonNew.href && buttonNew.href.indexOf(`javascript:toPDF(`) == 0 && buttonNew.href) || (buttonNew.onclick && buttonNew.onclick.indexOf(`javascript:toPDF(`) == 0 && buttonNew.onclick)) {
        $("#iconsExportPdf").removeClass("d-none").find("a").attr("href", thisHref);
        return true;
    } else if (thisHref = (buttonNew.href && buttonNew.href.indexOf(`javascript:toExcelWeb(`) == 0 && buttonNew.href) || (buttonNew.onclick && buttonNew.onclick.indexOf(`javascript:toExcelWeb(`) == 0 && buttonNew.onclick)) {
        $("#iconsExportExcel").removeClass("d-none").find("a").attr("href", thisHref);
        return true;
    } else if (thisHref = (buttonNew.href && buttonNew.href.indexOf(`javascript:SetDatatableExport(`) == 0 && buttonNew.href) || (buttonNew.onclick && buttonNew.onclick.indexOf(`javascript:SetDatatableExport(`) == 0 && buttonNew.onclick)) {
        $("#iconsExportHTML,#iconsExporJSON,#iconsExportCopy").removeClass("d-none");
        return true;
    }
}

function setIviewNotificationInfo(jsonObject) {
    if (requestJSON) {
        showAlertDialog("info", appGlobalVarsObject.lcm[491]);
        updateSessionVar = callParentNew("updateSessionVar");

        var viewName = "";
        // if (requestJSON && iviewButtonStyle != "old") {
            viewName = $(".viewtabEdit").parents("li a.active").find(".viewtabEdit").data("name") || "main";
        // }

        var saveJSON = {};
        saveJSON["params"] = $("#hdnparamValues").val();
        saveJSON["type"] = exportType;
        saveJSON["headrow"] = ivHeadRows;
        saveJSON["viewName"] = viewName;

        typeof updateSessionVar == "function" && updateSessionVar("iview-" + iName + "-" + jsonObject.dataId, JSON.stringify(saveJSON));
    } else {
        showAlertDialog("warning", 3006, "client");
    }
}

/**
 * @description: get select and multi-select selected values in object
 * @author Prashik
 * @date 2020-08-25
 * @returns : params object with values
 */
function getParamsValueList() {
    var returnObj = {}

    parentArr.forEach((val, index) => {
        switch (typeArr[index].toLowerCase()) {
            case "select":
                returnObj[val] = { type: typeArr[index], value: $("#" + val + " option").map(function () { return $(this).val(); }).get().filter(val => val != "").join("`") };
                break;
            case "multi select":
                returnObj[val] = { type: typeArr[index], value: $("#" + val).attr("data-valuelist") };
                break;
        }
    });

    if (Object.keys(returnObj).length == 0) {
        returnObj = "";
    }

    return returnObj;
}

/**
 * @description: set param values to the provided select and multi-select fields
 * @author Prashik
 * @date 2020-08-25
 * @param {*} fldname: field id
 * @param {*} pType: param type: select/multi-select
 * @param {*} resultArr: values array
 * @param {string} [fldValue=""] : selected field value
 */
function setParamsValueList(fldname, pType, resultArr, fldValue = "", attriuteArr = []) {
    var parentCtrl = document.getElementById(fldname);
    switch (pType.toLowerCase()) {
        case "select":
            var k = 0;
            parentCtrl.options.length = 0;
            if (resultArr.length < 1) {
                parentCtrl.options[0] = new Option(appGlobalVarsObject.lcm[441], 0);
                n = 1;
            } else {
                n = 0;
                for (k = 0; k < resultArr.length; k++) {
                    if (k == 0) {
                        parentCtrl.options[n] = new Option(appGlobalVarsObject.lcm[441], "");
                        parentCtrl.options[n].title = "";
                        n++;
                    }
                    parentCtrl.options[n] = new Option(resultArr[k], resultArr[k]);
                    if (fldValue == resultArr[k])
                        parentCtrl.options[n].selected = true;
                    parentCtrl.options[n].title = resultArr[k];

                    if (attriuteArr[k]) {

                        attriuteArr[k].forEach(data => {
                            let kkk = Object.keys(data)?.[0];
                            $(parentCtrl.options[n]).data(kkk, data[kkk]);
                        });
                    }

                    n++;
                }
            }
            break;
        case "multi select":
            if (!requestJSON) {
                var k = 0;
                $(parentCtrl).parent().next().html("");
                var chkLstStr = ``;
                for (k = 0; k < resultArr.length; k++) {

                    chkLstStr += `<span><input type='checkbox' id='${fldname}' class='chkAllList chkShwSel' onclick='UncheckChkAll(this);' value='${resultArr[k]}'/>${resultArr[k]}</span></br>`;

                }
                $(parentCtrl).parent().next().html(chkLstStr);
            } else {
                var newval = resultArr.join("`");
                if ($(parentCtrl).hasClass("trySelectMs")) {
                    try {
                        if ($(parentCtrl).data('bs.tokenfield')) {
                            $(parentCtrl).tokenfield('setTokens', []);
                        } else {
                            $(parentCtrl).val("");
                        }
                    } catch (ex) { }

                    $(parentCtrl).attr("data-valuelist", newval).data("valuelist", newval);

                    var valueList = [...new Set($(parentCtrl).data("valuelist").split($(parentCtrl).data("separator")))].filter((val) => val != "");
                    $(parentCtrl).empty();
                    valueList.forEach(
                        (option, index) => $(parentCtrl).append(new Option(option, option, true, false))
                    );
                    $(parentCtrl).trigger("change");
                }
            }
            break;
    }
}


/**
 * @description: generate empty placeholder in empty iview
 * @author Prashik
 * @date 2020-08-25
 */
function showParamsPlaceholder() {
    // if ($("#hdnIsParaVisible").val() != "hidden" && $("#GridView1").length == 0) { 
    //     $("#Panel1").html(`
    //         <div class="fa fa-filter fa-2x iviewPlaceHolder" title="${appGlobalVarsObject.lcm[478]}" onclick='$("#Filterscollapse").collapse("toggle");'></div>
    //     `);
    // } else if($("#GridView1").length == 0) {
    //     $("#Panel1").html(`
    //         <div class="fa fa-fa-exclamation-circle fa-2x iviewPlaceHolder" title="${appGlobalVarsObject.lcm[0]}"></div>
    //     `); 
    // }
}

/**
 * @description: generic function to process configurations coming from Developer Options
 * @author Prashik
 * @date 2020-08-25
 * @param {*} InnerIvConfigurations
 */
function processIvConfiguration(InnerIvConfigurations) {
    try {
        trimIviewData = getCaseInSensitiveJsonProperty(InnerIvConfigurations.filter((val, ind) => {
            var thisVal = getCaseInSensitiveJsonProperty(val, "PROPS");
            return thisVal && thisVal.toString() && thisVal.toString().toLowerCase() == "trim iview data"
        })[0], ["PROPSVAL"]).toString().toLowerCase() == "true";
    } catch (ex) { }

    try {
        resolveAttachmentPath = getCaseInSensitiveJsonProperty(InnerIvConfigurations.filter((val, ind) => {
            var thisVal = getCaseInSensitiveJsonProperty(val, "PROPS");
            return thisVal && thisVal.toString() && thisVal.toString().toLowerCase() == "resolve attachment path"
        })[0], ["PROPSVAL"]).toString().toLowerCase() == "true";
    } catch (ex) { }

    try {
        showColumnSeparator = getCaseInSensitiveJsonProperty(InnerIvConfigurations.filter((val, ind) => {
            var thisVal = getCaseInSensitiveJsonProperty(val, "PROPS");
            return thisVal && thisVal.toString() && thisVal.toString().toLowerCase() == "column separator for reports"
        })[0], ["PROPSVAL"]).toString().toLowerCase() == "true";
    } catch (ex) { }

    try {
        iviewButtonStyle = getCaseInSensitiveJsonProperty(InnerIvConfigurations.filter((val, ind) => {
            var thisVal = getCaseInSensitiveJsonProperty(val, "PROPS");
            return thisVal && thisVal.toString() && thisVal.toString().toLowerCase() == "iview button style"
        })[0], ["PROPSVAL"]).toString().toLowerCase();
    } catch (ex) { }

    try {
        searchHiddenColumnsInReports = getCaseInSensitiveJsonProperty(InnerIvConfigurations.filter((val, ind) => {
            var thisVal = getCaseInSensitiveJsonProperty(val, "PROPS");
            return thisVal && thisVal.toString() && thisVal.toString().toLowerCase() == "search hidden columns in reports"
        })[0], ["PROPSVAL"]).toString().toLowerCase() == "true";
    } catch (ex) { }

    try {
        unselectReportRowOnAction = getCaseInSensitiveJsonProperty(InnerIvConfigurations.filter((val, ind) => {
            var thisVal = getCaseInSensitiveJsonProperty(val, "PROPS");
            return thisVal && thisVal.toString() && thisVal.toString().toLowerCase() == "clear selected report rows after task execution"
        })[0], ["PROPSVAL"]).toString().toLowerCase() == "true";
    } catch (ex) { }

    try {
        openFastReportInNewWindow = getCaseInSensitiveJsonProperty(ivConfigurations.filter((val, ind) => {
            var thisVal = getCaseInSensitiveJsonProperty(val, "PROPS");
            return thisVal && thisVal.toString() && thisVal.toString().toLowerCase() == "open fast report in new window"
        })[0], ["PROPSVAL"]).toString().toLowerCase() == "true";
    } catch (ex) { }

    {
        try {
            splitRatio = getCaseInSensitiveJsonProperty(ivConfigurations.filter((val, ind) => {
                var thisVal = getCaseInSensitiveJsonProperty(val, "PROPS");
                return thisVal && thisVal.toString() && thisVal.toString().toLowerCase() == "split ratio"
            })[0], ["PROPSVAL"]).toString().toLowerCase() || splitRatio;
        } catch (ex) { }

        if (splitRatio) {
            appGlobalVarsObject.splitRatio = splitRatio;
        }
    }

    // try {
    //     responsiveColumnWidth = getCaseInSensitiveJsonProperty(ivConfigurations.filter((val, ind) => {
    //         var thisVal = getCaseInSensitiveJsonProperty(val, "PROPS");
    //         return thisVal && thisVal.toString() && thisVal.toString().toLowerCase() == "iview responsive column width"
    //     })[0], ["PROPSVAL"]).toString().toLowerCase() == "true";
    // } catch (ex) { }

    try {
        stripedReport = getCaseInSensitiveJsonProperty(ivConfigurations.filter((val, ind) => {
            var thisVal = getCaseInSensitiveJsonProperty(val, "PROPS");
            return thisVal && thisVal.toString() && thisVal.toString().toLowerCase() == "striped reports ui"
        })[0], ["PROPSVAL"]).toString().toLowerCase() == "true";
    } catch (ex) { }

    try {
        exportPerf = getCaseInSensitiveJsonProperty(ivConfigurations.filter((val, ind) => {
            var thisVal = getCaseInSensitiveJsonProperty(val, "PROPS");
            return thisVal && thisVal.toString() && thisVal.toString().toLowerCase() == "excel export with formatting"
        })[0], ["PROPSVAL"]).toString().toLowerCase() == "enable";
    } catch (ex) { }

    if (isMobile) {
        try {
            enableCardsUi = !(getCaseInSensitiveJsonProperty(InnerIvConfigurations.filter((val, ind) => {
                var thisVal = getCaseInSensitiveJsonProperty(val, "PROPS");
                return thisVal && thisVal.toString() && thisVal.toString().toLowerCase() == "mobile reports as table"
            })[0], ["PROPSVAL"]).toString().toLowerCase() == "true");
        } catch (ex) { }
    }
}

/**
 * @description: get icon character / icon caption to be shown for modern buttons
 * @author Prashik
 * @date 2020-09-10
 * @param {string} iconCaption : raw icon cation
 * @param {bool} isIcon : get icon character, get icon caption
 * @returns {char / string}
 */
function getModernButtonIconInfo(iconCaption, isIcon = true) {
    var finalIcon = iconCaption.split("&").reduce((returnData, data) => {
        var iconChar = data.length > 0 ? data[0] : "";

        if (iconChar != "" && iconChar != " ") {
            returnData = iconChar;
        }
        return returnData
    }, "A");

    if (isIcon) {
        return finalIcon;
    } else {
        return iconCaption.replace("&" + finalIcon, finalIcon);
    }
}
function getButtonIconHTML(icon) {
    if (typeof icon == "object") {
        return `<span class="${icon.addClass.replace("material-icons", "material-icons material-icons-style material-icons-3")}">${icon.text}</span>`;
    }
    else {
        return `<img src="${icon}" class="menuIcon">`;
    }
}

function setPinedIconContainerWidth() {
    let titleBarExtrasWidth = $("#breadcrumb").outerWidth(true) + $(".toolbarRightMenu").outerWidth(true) + 50;

    if (typeof isAxpertPopup != "undefined" && isAxpertPopup) {
        titleBarExtrasWidth += 35;
    }

    $(".modernButtonOptions #pinnedsearchBar").css({ 'width': `calc(100vw - ${titleBarExtrasWidth}px)`, 'max-width': `calc(100vw - ${titleBarExtrasWidth}px)` });

    var neededHeight = $("#pinnediconsUl").outerWidth(true);
    var totalChildHeight = 0;
    $("ul#pinnediconsUl").children("li").each(function () {
        totalChildHeight += $(this).outerWidth(true);
        if (totalChildHeight > neededHeight) {
            $(this).hide();
            $(this).nextAll().hide();
            return false;
        }
        else {
            $(this).show();
            $(this).nextAll().show();
        }
    });
}

//to display confirm dialog box to delete selected responsibilities
function confirmRespDelete() {
    if (getselectedResp() == false) {
        //no responsibilities selected
        showAlertDialog("warning", appGlobalVarsObject.lcm[85]);
        return false;
    }
    else {
        //atleast one responsibility is selected
        var glType = callParentNew('gllangType');
        var isRTL = glType == "ar" ? true : false;
        var ConfirmDelCB = $.confirm({
            theme: 'modern',
            title: appGlobalVarsObject.lcm[155],
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
            content: appGlobalVarsObject.lcm[87],
            buttons: {
                buttonA: {
                    text: appGlobalVarsObject.lcm[248],
                    btnClass: 'btn btn-primary',
                    action: function () {
                        disableBackDrop('destroy');
                        deleteResponsibilities();
                    }
                },
                buttonB: {
                    text: appGlobalVarsObject.lcm[192],
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

//get total count of selected responsibilities from the grid, 
//if any one checked return true else return false
function getselectedResp() {
    totalResSelected = 0;
    var grd = $("#GridView1 td:nth-child(1) input[type='checkbox']")
    var gv = document.getElementById("GridView1");
    var chk = gv.getElementsByTagName("input");
    if ($('#chkall').is(":checked")) {
        if (chk.length == 1)
            totalResSelected = 0;
        else
            totalResSelected = "All";
    }
    else {
        ivirDataTableApi.column(0).nodes().to$().each(function (index) {
            if ($(this).find("input[type='checkbox']").prop("checked")) {
                totalResSelected++;
            }
        });
    }

    if (totalResSelected == 0)
        return false;
    else
        return true;
}

//delete selected responsibilities from the grid
function deleteResponsibilities() {
    var selectedResp = "";

    ivirDataTableApi.column(1).nodes().to$().each(function (index) {
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

                setTimeout(() => {
                    window.location.href = window.location.href;
                }, 1000);
            }
            else if (data.d == "SessionExpiry") {
                parent.window.location.href = "../aspx/sess.aspx";
            }
            else if (data.d == "Error") {
                window.location.href = "../aspx/err.aspx"
            }
            else {
                showAlertDialog('warning', data.d);

                setTimeout(() => {
                    window.location.href = window.location.href;
                }, 1000);
            }

            $("#chkall").prop("checked", false);
            ShowDimmer(false);
        },

    });
}

function requestTstructFieldsObj() {
    if (isListView && $("#hdnListViewFieldsJSON").val() == "" && !tstFldsRequested) {

        tstFldsRequested = false;

        $.ajax({
            url: 'iview.aspx/GetTstructFieldsForListView',
            type: 'POST',
            cache: false,
            async: false,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                iName
            }),
            success: (res) => {
                try {
                    if (res && res.d) {
                        res = res.d;
                        var parsedObj = JSON.parse(res);

                        var fieldsJson = parsedObj.dcs.reduce((result, dc) => {
                            result[dc.frameno] = {
                                index: dc.frameno,
                                name: dc.name,
                                caption: dc.caption,
                                isGrid: dc.isgrid,
                                fields: []
                            }
                            return result;
                        }, {});

                        parsedObj.flds.forEach((fld) => {
                            if (fieldsJson[fld.fldframeno] && fieldsJson[fld.fldframeno].fields) {
                                fieldsJson[fld.fldframeno].fields.push({
                                    index: fld.order,
                                    name: fld.name,
                                    caption: fld.caption,
                                    dcNo: fld.fldframeno,
                                    isGridField: fieldsJson[fld.fldframeno].isGrid,
                                    save: fld.savevalue,
                                    visible: !fld.visibility,
                                    length: fld.fldlength,
                                    component: fld.ctype
                                });
                            }
                        });

                        $("#hdnListViewFieldsJSON").val(JSON.stringify(fieldsJson));
                    }
                } catch (ex) {
                    $("#hdnListViewFieldsJSON").val("");
                }
            },
            failure: function (response) {
            },
            error: function (response) {
            }
        });
    }
}

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
function difference(object, base) {
    function changes(object, base) {
        return _.transform(object, function (result, value, key) {
            if (!_.isEqual(value, base[key])) {
                result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
            }
        });
    }
    return changes(object, base);
}


function createPlSmartSelect(paramName) {
    const PlSmartSelect = $(paramName);

    PlSmartSelect.select2({
        ajax: {
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            delay: 250,
            type: "POST",
            url: "../aspx/iview.aspx/GetIviewPickListData",
            data: function (params) {

                GetParamValues("clear");//To get all the parameters name & value for picklist dependency.  //"clear" param is passed to skip the alert msg.  

                return JSON.stringify({
                    iviewName: iName,
                    pageNo: 1,
                    pageSize: 10,
                    fieldName: $(this)[0].id,
                    fieldValue: params.term || "",
                    depParamVal: $("#hdnparamValues").val()
                });
            },
            processResults: function (data, params) {
                params.page = params.page || 1;
                var pageSize = 10;

                if (CheckSessionTimeout(data.d)) {
                    ShowDimmer(false);
                    return;
                }

                if (data.d.toLowerCase().indexOf("\"error\":") > -1) {
                    showAlertDialog("error", appGlobalVarsObject.lcm[10]);
                    ShowDimmer(false);
                }
                else {
                    let processPlData = JSON.parse(data.d.replace(/@/g, ''));
                    
                    if (processPlData.sqlresultset.response != null) {
                        data.total_count = processPlData.sqlresultset.response.totalrows || 10;
                        
                        if (processPlData.sqlresultset.response.row.length == undefined) {
                            processPlData.sqlresultset.response.row = [processPlData.sqlresultset.response.row];
                        }

                        data.items = processPlData.sqlresultset.response.row.map((row, index) => {
                            var pkData = $(`<span>${row[Object.keys(row)[0]]["#text"]}</span>`).html();
                            return {
                                id: pkData,
                                text: pkData,
                                row
                            }
                        });
                    }
                }
        
                return {
                    
                    results: data.items,
                    pagination: {
                        more: (params.page * pageSize) < data.total_count
                    }
                };
            },
            cache: true
        },
        allowClear: true,
        placeholder: appGlobalVarsObject.lcm[441],
        templateResult__t: function (data, container) {
            
            let internalContainer = $(container);
            let returnHTML = "";
            if (!data.loading) {
                let { row } = data;

                if (row) {
                    returnHTML = "Hi";
                } else {
                    returnHTML = data.text;
                }

            } else {
                returnHTML = data.text;
            }
            internalContainer.append($(returnHTML));
            return internalContainer;
            //return $container
        }
        // templateSelection: formatRepoSelection
    }).on('select2:open', (selectEv) => {
        var curDropdown = $(selectEv.currentTarget).data("select2")?.$dropdown;

        // if (curDropdown.find(".select2-search").find(".plAdvanceSearch").length == 0) {
        //     curDropdown.find(".select2-search").addClass("d-flex input-group").append(`<span class="input-group-text rounded-circle btn btn-icon btn-white btn-color-gray-600 btn-active-primary shadow-sm ms-2 plAdvanceSearch" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-dismiss="click" data-bs-original-title="Advance Search" onclick="javascript:CallSearchOpen(${$(paramName)[0].id});"><span class="material-icons material-icons-style cursor-pointer">manage_search</span></span>`).find(".select2-search__field").addClass("form-control w-auto");
        // }
    });
}

function createMsSmartSelect(paramName) {
    const MsSmartSelect = $(paramName);
    
    var valueList = [...new Set($(paramName).data("valuelist")?.split($(paramName).data("separator")))].filter((val) => val != "");
    var processedList = $.map(valueList, (val, index) => {
        return {
            id: val,
            text: val
        }
    });

    MsSmartSelect.select2({
        allowClear: true,
        data: processedList,
        placeholder: appGlobalVarsObject.lcm[441],
    }).on('select2:open', (selectEv) => {
        var curDropdown = $(selectEv.currentTarget).data("select2")?.$dropdown;
        var selectedOptionCount = 0;
        
        valueList = [...new Set($(paramName).data("valuelist").split($(paramName).data("separator")))].filter((val) => val != "");

        if (valueList.length != 0) {
            if (curDropdown.find(".select2-results").find(".msSelectAllOption").length == 0) {

                var selectAllHTML = `<div class="msSelectAllOption form-check form-check-custom form-check-solid align-self-end px-5">
                    <input type="checkbox" class="form-check-input msSelectAll" onchange="checkAllCheckBoxTokens(this, '${$(selectEv.currentTarget).attr("id")}')"/>
                    <label for="SelectAll" class="ps-2 form-check-label form-label col-form-label pb-1 fw-boldest">
                        Select All
                    </label>
                </div>`;
                curDropdown.find(".select2-results").append(selectAllHTML);
            }
    
            curDropdown.find(".select2-results").find(".select2-results__options li:not(.select2-results__option--disabled.loading-results)").each((ind, elm) => {
                if ($(elm).hasClass("select2-results__option--selected")) {
                    selectedOptionCount++;
                }
            });
    
            if (curDropdown.find(".select2-results").find(".select2-results__options li:not(.select2-results__option--disabled.loading-results)").length == selectedOptionCount && selectedOptionCount > 0) {
                curDropdown.find(".select2-results").find(".msSelectAllOption > .msSelectAll").prop("checked", true);
            }
            else if (curDropdown.find(".select2-results").find(".select2-results__options li:not(.select2-results__option--disabled.loading-results)").length != selectedOptionCount && curDropdown.find(".select2-results").find(".msSelectAllOption > .msSelectAll").is(":checked")) {
                curDropdown.find(".select2-results").find(".msSelectAllOption > .msSelectAll").prop("checked", false);
            }
        }

    });

}

function refreshIview(e) {
    try {
        var appUrl = top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/"));
        
        var updatedJSON = JSON.parse(localStorage["drilldownScrollInfo-" + appUrl] || "{}");
        delete updatedJSON?.[iName];
        
        localStorage["drilldownScrollInfo-" + appUrl] = JSON.stringify(updatedJSON);
    } catch (ex) {}
    
    ClearRedisDataCache();

    if (iName == "inmemdb" || isListView || $("#hdnIsParaVisible").val() == "hidden") {
        callParentNew("loadFrame()", "function");
        e.preventDefault();
        window.location.href = window.location.href;
    }
    else {
        if ($j("#hdnparamValues").val() != "") {
            callParentNew("loadFrame()", "function");
            UpdateGetParamCache();
        } else {
            e.preventDefault();
            $('#Filterscollapse').collapse("show");
        }
    }
}

function ClearRedisDataCache() {
    try {
        var ivKey = $j("#hdnKey").val();
        $.ajax({
            type: "POST",
            url: "iview.aspx/ClearRedisDataCache",
            cache: false,
            async: false,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                ivKey,
                isListView
            }),
            success: function (data) {
            },
            error: function (response) {
            }
        });
    } catch (ex) {}
}