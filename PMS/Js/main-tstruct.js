// global variables
var isMozilla;
var objDiv = null;
var originalDivHTML = "";
var DivID = "";
var over = false;
var addHeader = "";
var fillGridDatatbl = "";
var shouldFaceUser = false;
var flipCamera = false;
var gridDummyRows = false;
var gridDummyRowVal = new Array;
var AxpGridForm = "popup";
var fldmultiSelectdep = false;
var depNotBoundFld = "";
var axplatlongFldName = "";
var axpfilepathold = "";
var axpScanBarFldFocus = "";
var axpScriptaddrowres = "";
var axpScriptIsAddrow = true;
var dcLayoutType = "default";
var isDcLayoutSelected = false;
var formLabelJSON = [];
var buttonFieldFontJSON = [];
var regVarFldExp = new Array();
var select2EventType = "";
var select2IsOpened = false;
var select2IsFocused = false;
var setDesProp = {};
var forceRowedit = false;
var isGridFileUploadOnLoad = false;
var wizardHidenDcNos = [];
var gridRowEditOnLoad = false;
var AxRulesDefValidation = "false";
var AxRulesDefFilter = "false";
var AxRuesDefFormcontrol = "false";
var AxRulesDefComputescript = "false";
var AxRulesDefAllowdup = "false";
var AxRulesDefAllowEmpty = "false";
var AxRulesDefIsAppli = "false";

var AxRulesDefScriptOnLoad = "false";
var AxRulesDefOnSubmit = "false";
var AxRuesDefScriptFormcontrol = "false";
var AxRuesDefScriptFCP = "false";

var AxpDcstateVal = "";
var AxAllowEmptyFlds = new Array;
var isScriptFormLoad = "false";
var dynamicMobileResolution = function () {
    if ($(".grid-stack").hasClass("dynamicRunMode")) {
        if ((window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) <=
            renderGridOptions.minWidth) {
            $(".grid-stack").addClass("grid-stack-one-column-mode");
        } else if ($(".tileLayoutDiv").length == 0) {
            $(".grid-stack").removeClass("grid-stack-one-column-mode");
        }
    }
}

$j(document).ready(function () {

    if (typeof isTstPostBackVal == "undefined" || isTstPostBackVal == "")
        WireElapsTime(serverprocesstime, requestProcess_logtime);
    AxpGridForm = AxpGridFormCols != "" ? AxpGridFormCols.split("♠")[0] : "popup";
    if (theMode == "design") {
        $(callParentNew("splitIcon", "id")).css({
            "display": ""
        }).removeClass("hide");
        $(callParentNew("spiltHeading", "class")).css({
            "display": ""
        }).removeClass("hide");
    }
    tstReadOnly = false;
    typeof commonReadyTasks == 'function' ? commonReadyTasks() : "";
    if (typeof isTstPostBackVal != "undefined" && isTstPostBackVal != "") {
        var resval = isTstPostBackVal.split("*$*");
        var wBdrHtml = resval[0];
        $("#wBdr").html("");
        $("#wBdr").prepend(wBdrHtml);
        var toolBarHtml = resval[1];
        if ((typeof isWizardTstruct == "undefined" || isWizardTstruct == false) && IsObjCustomHtml == "False") {
            $("#tstIcons").html("");
            $("#tstIcons").prepend(toolBarHtml);
            $("#iconsNewOptionIcon").after("");
            $("#iconsNewOptionIcon").after(toolBarHtml);

            $("#tstModernOpenIcons").html("");
            var modenFooter = resval[2];
            if (modenFooter != '') {
                $("#tstModernOpenIcons").prepend(modenFooter.split('♦')[0]);
                btnfooteropenlist = modenFooter.split('♦')[1];
                if (btnfooteropenlist.indexOf('<li>') > -1)
                    btnfooteropenlist = '';
            }
        }       
    }
    if (typeof AxpTstButtonStyle != "undefined" && AxpTstButtonStyle == "old") {
        $("#breadcrumb-panel").removeClass("justify-content-center");
        $("#breadcrumb-panel").parent().removeClass("flex-stack").addClass("flex-column");
        $("#breadcrumb-panel").next().removeClass("align-items-center");
        $("#searchBar").addClass("vw-100 overflow-scroll");
        $("#searchBar").find("ul").addClass("px-0 my-0");
    }
    $("#btnSaveTst").prop({
        'value': callParentNew('lcm')[392],
        'title': eval(callParent('lcm[392]'))
    });
    $("#New").prop({
        'value': callParentNew('lcm')[393],
        'title': eval(callParent('lcm[393]'))
    });
    SetFormDirty(false);
    AxpIviewDisableSplit = AxpIviewDisableSplit.toLowerCase();
    compressedMode = appGlobalVarsObject._CONSTANTS.compressedMode;
    if (!isMobile && isTstPop.toLowerCase() == "false") {
        if (AxpIviewDisableSplit != undefined && AxpIviewDisableSplit == "false") {
            $(callParentNew("split-btn", "class")).css({
                "display": ""
            }).removeClass("hide");
            $(callParentNew("split-btn-vertical", "class")).css({
                "display": ""
            }).removeClass("hide");
        } else if (AxpIviewDisableSplit === "true") {
            $(callParentNew("splitIcon", "id")).addClass("hide");
            $(callParentNew("spiltHeading", "class")).addClass("hide");
            // $(callParentNew("split-btn-vertical", "class")).addClass("hide");
        } else if (AxpIviewDisableSplit === "") {
            $(callParentNew("splitIcon", "id")).css({
                "display": ""
            }).removeClass("hide");
            $(callParentNew("spiltHeading", "class")).css({
                "display": ""
            }).removeClass("hide");
        }
    } else {
        $(callParentNew("split-btn", "class")).addClass("hide");
        $(callParentNew("split-btn-vertical", "class")).addClass("hide");
    }

    if (AxpIsAutoSplit.toLowerCase() == "true" && callParentNew("isTstructSplited") === false) {
        callParentNew(`assocateIframe(true)`, 'function');
    }
    var glangType = eval(callParent('gllangType'));
    if (glangType === "ar") {
        //        $('head').append('<link rel="stylesheet" href="../ThirdParty/bootstrap_rtl.min.css" type="text/css" />');
        $('[data-toggle=popover]').each(function () {
            $(this).data('placement', 'left');
        });
    }


    if (typeof AxRulesEngine != "undefined" && AxRulesEngine != "") {
        let axruleList = AxRulesEngine.split('~');
        //AxRulesDefValidation = axruleList[0];
        //AxRulesDefFilter = axruleList[1];
        //AxRuesDefFormcontrol = axruleList[2];
        //AxRulesDefComputescript = axruleList[3];
        //AxRulesDefAllowdup = axruleList[4];
        //AxRulesDefAllowEmpty = axruleList[5];
        //AxRulesDefIsAppli = axruleList[6];

        AxRulesDefScriptOnLoad = axruleList[0];
        AxRulesDefOnSubmit = axruleList[1];
        AxRuesDefScriptFormcontrol = axruleList[2];
        AxRuesDefScriptFCP = axruleList[3];
    }


    $ == undefined ? $ = $j : "";
    try {
        if (DCIsPopGrid.indexOf("True") > -1) {
            window.location.href = "err.aspx?errmsg=Axpertweb 11.0 popgrid (subgrid) is not supporting, please change the definition and try again..";
            return;
        }
        AxBeforeTstLoad();
    } catch (ex) {
        $j('div#wBdr').show();
        ShowDimmer(false);
    }
    var t0 = performance.now();
    AxStartTime = new Date();
    $(document).on("click", "#icons,#btnSaveTst,.BottomToolbarBar a", function (e) {
        if (actionCallFlag != actionCallbackFlag) {
            e.stopPropagation;
            e.preventDefault();
            $("#icons,#btnSaveTst,.BottomToolbarBar a").css({
                "pointer-events": "none"
            });
            return;
        }
    })
    try {
        hideDiscardButton();
        switchTstructMode();
        GetFormDetails();
        loadingNew();
        LoadGridScript();
        AxAutoGenDeps = GetDependentArray();
        AddVisTabDcsInArray();
        OnTstructLoad();
        SetFieldSetCarryValue();
        AxpFileFields();
        if (typeof isTstPostBackVal != "undefined" && isTstPostBackVal != "") {
            isTstPostBackVal = "";
            recordid = $("#axp_recid1000F1").val();
            $j("#recordid000F0").val($("#axp_recid1000F1").val());
        }
        //if (typeof isWizardTstruct != "undefined" && isWizardTstruct) {
        // $("#wizardFormContainer").append($("#formContainer").detach());
        // $("#wizardFormContainer").append($("#attachment-overlay").detach());
        //}
    } catch (ex) {
        $j('div#wBdr').show();
        ShowDimmer(false);
    }
    if (gl_language == "ARABIC")
        $j("#pagebdy").css("direction", "rtl");
    SetGridBtnAccess();
    if (mode != "design")
        LoadEvents();

    $(window).resize(dynamicMobileResolution);


    CheckCustFooter();
    CheckCustomTStSave();
    SetAutoCompAccess("");
    if (typeof focusAfterSaveOnLoad != "undefined" && focusAfterSaveOnLoad != "")
        SetFocusAfterSaveOnLoad();
    else
        FocusOnFirstField("form");
    SetFocusFormControl();
    try {
        if (transid == "axpwf")
            tstwfcomments();
        AxAfterTstLoad();
    } catch (ex) { }
    //DisplaySearchDlg();
    if (AxIsTstructLocked) {
        LockTstruct();
    }
    jQuery.browser = {};
    (function () {
        jQuery.browser.msie = false;
        jQuery.browser.version = 0;
        if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
            jQuery.browser.msie = true;
            jQuery.browser.version = RegExp.$1;
        }
    })();


    if ($j(".clsPrps").length > 0) {
        $j("#tgPurpose").css("display", "inline-block");
    } else {
        $j("#tgPurpose").css("display", "none");
    }
    $('[data-toggle="popover"]').popover({
        container: 'body'
    });
    checkSuccessAxpertMsg();
    if (eval(callParent('isPrintPDFClick')))
        $j(".printhtmltopdf").click();

    if (eval(callParent('isSaveAndPrintClick'))) {
        var isSPValues = [];
        isSPValues = eval(callParent('isSavePrintValues'));
        OpenPdfFile(isSPValues[0], isSPValues[1], isSPValues[2], isSPValues[3], "");
        eval(callParent('isSaveAndPrintClick') + "= false");
        eval(callParent('isSavePrintValues') + "=[]");
    }

    makeFieldInitCap();
    var t1 = performance.now();
    //console.log("Call to form load took " + (t1 - t0) + " milliseconds.");

    $("div").scroll(function () {
        $('#ui-datepicker-div').hide();
    });
    //$("#editUpdateButton2").click(function (e) {
    //    $('#ui-datepicker-div').hide(); // This is the preferred method.
    //});

    //if the tstruct field is axp-url (ie, field name starts with axp_url_) then make textbox hidden & make label has hyperlink
    $("[data-axp-url]").each(function () {
        $(this).after('<br/>')
        inputId = $(this).attr("for");
        text = $(this).text();
        $(this).text('');
        $("#" + inputId).attr("type", "hidden");
        urlValue = $("#" + inputId).val();
        url = $("#" + inputId).val() == "" ? "javascript:void(0);" : "window.open('" + urlValue + "','newwindow','width=600,height=500')"; //open link in window only for tstruct edit
        $("#" + inputId).after("<a style='cursor:pointer' onclick=" + url + ">" + text + "</a>");
    });

    if (typeof btnfooterlist != 'undefined' && btnfooterlist != '') {
        $('#ftbtn_iList').attr('onClick', btnfooterlist);
    }

    if (typeof btnfooteropenlist != 'undefined' && btnfooteropenlist != "" && IsObjCustomHtml == "False") {
        $("#dvFooter").hide();
        $.each(btnfooteropenlist.split(','), function (i, val) {
            if (val != "") {
                $("#" + val).removeClass("d-none");
                // $("#" + val).css({"display":"block"});
            }
        });
        //if (recordid != "0")
        //    $("#ftbtn_iSave").removeAttr("class").addClass("btn btn-white btn-color-gray-700 btn-active-primary d-inline-flex align-items-center shadow-sm me-2 dwbIvBtnbtm");
    }

    if (typeof dvRefreshFromLoadModern != "undefined" && dvRefreshFromLoadModern == "true") {
        $("#dvRefreshFromLoadModern").removeClass("d-none");
        /* $("#dvRefreshFromLoadModern").show();*/
    }
    //due to this code isbund getting effect
    //$(".fldAutocomplete").each(function () {
    //    var fldId = $(this).attr("id");
    //    UpdateAssignedFld(fldId)
    //});

    if (typeof hideToolBar != "undefined" && hideToolBar && $("#design").length == 0 && theMode != "design") {
        var srchBarHt = 28; //Search bar height
        $("#searchBar").hide();
        $(".dvheightframe").first().css("top", "0px");
        if (typeof isWizardTstruct != "undefined" && isWizardTstruct)
            $("#wizardBodyContent").height($("#wizardBodyContent").height() + srchBarHt);
        else {
            srchBarHt = srchBarHt + 5 + 8; //Search bar height + Padding + Margin
            $("#pagebdy").height($("#pagebdy").height() + srchBarHt);
            $(".dvheightframe").first().attr("style", $(".dvheightframe").first().attr("style") + ";height:" + ($(".dvheightframe").first().height() + srchBarHt) + "px !important;")
        }
    }

    var curFrameObj = $(window.frameElement);
    if (curFrameObj.attr("id") === "axpiframe" || curFrameObj.attr("id") === "homePageDynamicFrame" || curFrameObj.attr("id").startsWith("homePageFrame")) {
        iframeindex = 1;
        $j("#goback").hide();
    }
    if (callParentNew("IsfieldaddInDesignMode")) {
        callParentNew("IsfieldaddInDesignMode=", false)
        $('.grid-stack').addClass('dirty');
    }


    if (isMobile && mobileCardLayout == "none") {
        $("#wizardHeader").addClass("mobileHeader");
        $.each(DCIsGrid, function (i, data) {
            if (data === "True") {
                $("#wrapperForEditFields" + (i + 1)).removeClass("d-none");
                $("#wrapperForEditFields" + (i + 1)).addClass("mobilewrapperForEditFields");
                if ($(".wrapperForGridData" + (i + 1) + " table tbody tr").length == 0 && !axInlineGridEdit)
                    $("#colScroll" + (i + 1)).hide();
                if (axInlineGridEdit)
                    $(".editWrapTr").hide();
                $(".editLayoutFooter").hide();
                $(`#DivFrame${i + 1} .newgridbtn`).addClass("d-none");
                let gridButton = $(`#DivFrame${i + 1} .newgridbtn>ul`).html();
                $(`#wrapperForEditFields${i + 1}`).append(`<div class="clearfix"></div><div class="grdButtons btnMobile d-none"><ul class="left">${gridButton}</ul></div>`);
                $(`#wrapperForEditFields${i + 1} .btnMobile`).find(`#viewGrid${i + 1}`).addClass("d-none");
            }
        });
    }

    $(document).off('focus', '.select2.select2-container');
    $(document).on('focus', '.select2.select2-container', function (e) {
        var isOriginalEvent = e.originalEvent; // don't re-open on closing focus event
        var isSingleSelect = $(this).find(".select2-selection--single").length > 0; // multi-select will pass focus to input
        if (isOriginalEvent && isSingleSelect) {
            if (select2EventType == "open") {
                select2EventType = "";
                if (select2IsFocused == true && select2IsOpened)
                    $(this).siblings('select.fldFromSelect').select2('close');
                select2IsOpened = false;               
                select2IsFocused = false;                       
            } else {
                if (select2IsOpened)
                    select2EventType = "click";
                else {
                    select2IsFocused = true;
                    select2EventType = "tab";
                }
            }
            // console.log("Select2 focus original");
            $(this).siblings('select:enabled').select2('open');
        }
    });

    /** * @description Focus next/Prev non-grid fields on Tab/Shift+Tab along with "tabStop" field property */
    $j("input:not([id=searstr],[class=AxAddRows],[class=AxSearchField]),select:not([id=selectbox],.fldFromSelect),textarea:not(#txtCommentWF):not(.labelInp),input[type=checkbox],li.dropdown-chose").bind("keydown", function (e) {
        var keyCode = e.keyCode || e.which;
        var tabFldId = $(this);
        if ($(this).hasClass("select2-search__field")) {
            isSelectedValFocus = false;
            return;
        }
        if (keyCode == 9 && !e.shiftKey) {
            var curFldTabOrder = $(this).closest("[class*=fldindex]").data("dataindex");
            let TabFldDc;
            if (typeof $(this).attr("id") != "undefined")
                TabFldDc = $(this).attr("id").substring($(this).attr("id").lastIndexOf("F") + 1, $(this).attr("id").length);
            else if ($(this).hasClass("tokenSelectAll"))
                TabFldDc = $(this).closest("div").attr("name").substring($(this).closest("div").attr("name").lastIndexOf("F") + 1, $(this).closest("div").attr("name").length);
            var listDivTabOrder = [];
            $(this).closest("#divDc" + TabFldDc).find(".grid-stack-item").find("[class*=fldindex]").each(function (ind, val) {
                var fName = GetFieldsName($(this).find("input:not([id=searstr],[class=AxAddRows],[class=AxSearchField]),select:not([id=selectbox]),textarea:not(#txtCommentWF):not(.labelInp),input[type=checkbox]").attr("id"));
                var fldIndex = $j.inArray(fName, FNames);
                if ($(this).css('display') != "none" && GetFieldProp(fldIndex, "tabStop") != "F")
                    listDivTabOrder.push($(this).data("dataindex"));
            });
            listDivTabOrder.sort(function (a, b) {
                return a - b
            });
            $.each(listDivTabOrder, function (i, indTabOr) {
                if (curFldTabOrder < indTabOr) {
                    var NextFldId = $j(tabFldId).closest("#divDc" + TabFldDc).find("[data-dataindex=" + indTabOr + "]").find("input:not([id=searstr],[class=AxAddRows],[class=AxSearchField]),select:not([id=selectbox]),textarea:not(#txtCommentWF):not(.labelInp),input[type=checkbox]");
                    if (typeof $("#" + $(NextFldId).attr("id")).attr("disabled") == "undefined" && typeof $("#" + $(NextFldId).attr("id")).attr("readonly") == "undefined") {
                        if (!$("#" + $(NextFldId).attr("id")).hasClass("axpImg") && !$("#" + $(NextFldId).attr("id")).hasClass("fldmultiSelect")) {
                            if ($(NextFldId).length == 4)
                                return false;
                            // if ($("#" + $(NextFldId).attr("id")).hasClass("fldFromSelect") && $("#" + $(NextFldId).attr("id")).val() == "") {
                            //     // $("#" + $(NextFldId).attr("id")).addClass('autoComSelWithTab');
                            //     isAutoComSelWithTab = false;
                            // }
                            $("#" + $(NextFldId).attr("id")).focus().select();
                            e.preventDefault();
                            return false;
                        } else if ($("#" + $(NextFldId).attr("id")).hasClass("fldmultiSelect")) {
                            if ($(NextFldId).length == 4)
                                return false;
                            $("#" + $(NextFldId).attr("id")).parent(".dropdown-mul").find(".fldmultiSelectInput").click();
                            e.preventDefault();
                            return false;
                        }
                    } else if (listDivTabOrder.length - 1 == i) {
                        $(".tstructMainBottomFooter a:visible:eq(0)").focus();
                    }
                }
            });
        } else if (keyCode == 9 && e.shiftKey) {
            var curFldTabOrder = $(this).closest("[class*=fldindex]").data("dataindex");
            let TabFldDc;
            if (typeof $(this).attr("id") != "undefined")
                TabFldDc = $(this).attr("id").substring($(this).attr("id").lastIndexOf("F") + 1, $(this).attr("id").length);
            else if ($(this).hasClass("tokenSelectAll"))
                TabFldDc = $(this).closest("div").attr("name").substring($(this).closest("div").attr("name").lastIndexOf("F") + 1, $(this).closest("div").attr("name").length);
            var listDivTabOrder = [];
            $(this).closest("#divDc" + TabFldDc).find(".grid-stack-item").find("[class*=fldindex]").each(function (ind, val) {
                var fName = GetFieldsName($(this).find("input:not([id=searstr],[class=AxAddRows],[class=AxSearchField]),select:not([id=selectbox]),textarea:not(#txtCommentWF):not(.labelInp),input[type=checkbox]").attr("id"));
                var fldIndex = $j.inArray(fName, FNames);
                if ($(this).css('display') != "none" && GetFieldProp(fldIndex, "tabStop") != "F")
                    listDivTabOrder.push($(this).data("dataindex"));
            });
            listDivTabOrder.sort(function (a, b) {
                return a - b
            }).reverse();
            $.each(listDivTabOrder, function (i, indTabOr) {
                if (curFldTabOrder > indTabOr) {
                    var NextFldId = $j(tabFldId).closest("#divDc" + TabFldDc).find("[data-dataindex=" + indTabOr + "]").find("input:not([id=searstr],[class=AxAddRows],[class=AxSearchField]),select:not([id=selectbox]),textarea:not(#txtCommentWF):not(.labelInp),input[type=checkbox]");
                    if (typeof $("#" + $(NextFldId).attr("id")).attr("disabled") == "undefined" && typeof $("#" + $(NextFldId).attr("id")).attr("readonly") == "undefined") {
                        if (!$("#" + $(NextFldId).attr("id")).hasClass("axpImg") && !$("#" + $(NextFldId).attr("id")).hasClass("fldmultiSelect")) {
                            if ($(NextFldId).length == 4)
                                return false;
                            // if ($("#" + $(NextFldId).attr("id")).hasClass("fldFromSelect") && $("#" + $(NextFldId).attr("id")).val() == "") {
                            //     $("#" + $(NextFldId).attr("id")).addClass('autoComSelWithTab');
                            //     isAutoComSelWithTab = false;
                            // }
                            $("#" + $(NextFldId).attr("id")).focus().select();
                            e.preventDefault();
                            return false;
                        } else if ($("#" + $(NextFldId).attr("id")).hasClass("fldmultiSelect")) {
                            if ($(NextFldId).length == 4)
                                return false;
                            $("#" + $(NextFldId).attr("id")).parent(".dropdown-mul").find(".fldmultiSelectInput").click();
                            e.preventDefault();
                            return false;
                        }
                    } else if (listDivTabOrder.length - 1 == i) {
                        $(".tstructMainBottomFooter a:visible:eq(0)").focus();
                    }
                }
            });
        }
    });

    setTimeout(function () {
        if (typeof isWizardTstruct != "undefined" && isWizardTstruct) {
            var mainDiv = $('#wizardTstructWrapper').outerHeight(true);
            var toolBarOH = $('#toolBarBtns').outerHeight() - 41; // 41 is the default haight for first row
            var heighFrame = $("#wizardBodyFooterWrapper").outerHeight(true);
            var wizardHeader = $('#wizardHeader').outerHeight(true);
            // $('#wizardBodyContent').css({
            //     height: `calc(100vh - ${(mainDiv + toolBarOH + wizardHeader) - (heighFrame + wizardHeader)}px)`
            // });
        } else {
            var heighFrame = $("#heightframe").outerHeight(true);
            var mainDiv = $('#dvlayout').outerHeight(true);
            var footer = $('.tstructMainBottomFooter').outerHeight(true);
            if (transid == 'axglo') {
                // $('#heightframe').css({
                //     height: `calc(100vh - 95px)`
                // });
            } else {
                //$('#heightframe').css({ height: `calc(100vh - ${(mainDiv - (heighFrame - footer))}px)` });
                if ($("body").hasClass("formLayoutWidth")) {
                    let wBdrOH = $("#wBdr").outerHeight(true);
                    if (wBdrOH < heighFrame)
                        $('.tstructMainBottomFooter').css({
                            bottom: `${heighFrame - (wBdrOH + footer)}px`
                        });
                    else
                        $('.tstructMainBottomFooter').css({
                            bottom: `-${footer}px`
                        });
                }
                // $('#wBdr').css({ height: `calc(100vh - ${(mainDiv - (heighFrame - footer))}px)` });
                if (!isMobile && $('#DivFrame1').outerHeight() < $('#heightframe').outerHeight()) {
                    if ($('#tabsCont2 .dvdcframe').length > 0) {
                        var mainHeight = $('#tabsCont2 .dvdcframe').height() + $('#myTab').outerHeight(true) + ($('#heightframe').outerHeight(true) - $('#DivFrame1').outerHeight(true) - $('#tabsCont2').parents('.wrapper').outerHeight(true) - 20);
                        $('#tabsCont2 .dvdcframe').css({
                            'min-height': mainHeight
                        });
                    }
                    $.each(DCIsGrid, function (dcIndex) {
                        DCIsGrid[dcIndex] == "False" && dcIndex != 0 ? $("#DivFrame" + (dcIndex + 1)).addClass("nonGridDcTab") : "";
                    });
                }
            }
        }
    }, 50);
    // to get latitude longitude value

    if (theMode != "design" && isMobile && ($.inArray("axp_latlong", FNames) != -1)) {
        var llIndex = ($.inArray("axp_latlong", FNames));
        axplatlongFldName = FNames[llIndex];
        callParentNew("LocationInfoAPI()", "function");
    }

    if (theMode != "design" && ($.inArray("latitude", FNames) != -1) && ($.inArray("longitude", FNames) != -1)) {
        var counter = 0;
        var intervalID = setInterval(() => {
            counter++;
            if (counter == 10) {
                clearInterval(intervalID);
            }

            var fldlatitude = `latitude000F${GetDcNo("latitude")}`;
            var fldlongitude = `longitude000F${GetDcNo("longitude")}`;

            if ($(`#${fldlatitude}`).val() == "" && $(`#${fldlongitude}`).val() == "") {

                if (getLocation() === true) {
                    clearInterval(intervalID);
                }
            }
        }, 1000);
    }

    // $(".dropdown-mul").off('click.dropdown-mula');
    // $(".dropdown-mul").on('click.dropdown-mula', function (event) {
    //     if (typeof fldmultiSelectdep == "undefined" || (typeof fldmultiSelectdep != "undefined" && fldmultiSelectdep == false))
    //         MultiGroupSelectClk(event, this);
    // });

    if (breadCrumbStr) {
        //$("#breadcrumb-panel span").removeClass("tstivtitle");
        //$("#breadcrumb-panel .bcrumb .menuBreadCrumb").length > 0 && $("#breadcrumb-panel .bcrumb .menuBreadCrumb").remove();
        //$("#breadcrumb-panel .bcrumb").append('<span class="menuBreadCrumb"><span class="breadCrumbCaption">' + breadCrumbStr + '</span>' + $("#breadcrumb-panel span.tstivCaption").text() + '</span>');
        let brcList = "";
        breadCrumbStr.split(" > ").forEach(function (item) {
            if (item != "")
                brcList += "<li class=\"breadcrumb-item text-muted\">" + item + "</li>";
        });
        if ($("#breadcrumb-panel ul.breadcrumb").length > 0)
            $("#breadcrumb-panel ul.breadcrumb").remove();
        $("#breadcrumb-panel").append(`<ul class="breadcrumb fw-bold fs-base my-1">` + brcList + `<li class="breadcrumb-item text-dark">` + $("#breadcrumb-panel h1").text() + `</li></ul>`);
    }

    if (isMobile) {
        $('#breadcrumb-panel').attr({
            'data-toggle': 'popover',
            'data-placement': 'bottom',
            'data-content': "",
        });

        $('#breadcrumb-panel[data-toggle=popover]').popover({
            content: $(".menuBreadCrumb").length > 1 ? $(".menuBreadCrumb").text() : $(".tstivCaption ").text(),
            container: 'body'
        });
    }


    if (typeof AutosaveDraft != "undefined" && AutosaveDraft == "true" && savedraftKeyCreatedtime != "") {
        if (!(window.location.href.includes("act")) && !(window.location.href.includes("recordid")))
            loadSavedDraft(savedraftKeyCreatedtime);
        savedraftKeyCreatedtime = "";
    }

    if (typeof AutosaveDraft != "undefined" && AutosaveDraft == "true" && AutosaveDraftTime != "") {
        draftSetTimeoutObj = setInterval(SaveAsDraft, parseInt(AutosaveDraftTime));
    }

    //gridScrollBar developer option withdran as per UI.
    //if (typeof gridScrollBar != "undefined" && gridScrollBar == "true") {
    //    // $('#heightframe').css({
    //    //     'overflow-x': 'scroll'
    //    // });
    //    $(".griddivColumn").css({
    //        "padding-left": "0",
    //        "width": "100%",
    //        "overflow": "inherit"
    //    });
        
    //    $('.griddivColumn .customSetupTableMN').each((ind, elm) =>{
    //        var gridMainWidth = $(elm).width() + ($($(elm)).parents(".card-body").outerWidth() - $($(elm)).parents(".card-body").width());
            
    //        $($(elm)).parents(".dvdcframe").css({
    //            "width": gridMainWidth
    //        });
    //    });

    //    $('.griddivColumn').parents().find('.dcTitle').css({
    //        'display': 'block'
    //    });
    //    if ($('body').hasClass('btextDir-rtl')) {
    //        $('.griddivColumn').parents().find('.newgridbtn').css({
    //            'float': 'right'
    //        });
    //    } else {
    //        $('.griddivColumn').parents().find('.newgridbtn').css({
    //            'float': 'left'
    //        });
    //    }
    //}

    $('.griddivColumn ').addClass('gridFixedHeader').css({ "overflow": "auto" });
    if (typeof gridFixedHeader == "undefined" || gridFixedHeader == "true") {
        //$('.griddivColumn ').addClass('gridFixedHeader').css({ "overflow": "auto", "max-height": "calc(100vh - 130px)" });
        $('.griddivColumn ').addClass('gridFixedHeader').css({ "max-height": "calc(100vh - 130px)" });
        $(".gridFixedHeader table thead tr th").css({ "background": "#fff", "position": "sticky", "top": "0" });        
    }

    hideacoptions();
    $("input.fldFromSelect").off('click');
    $("input.fldFromSelect").on('click', function () {
        if (isMobile) {
            let fldId = $(this).attr("id");
            if (fldId != "" && $("#" + fldId).hasClass("fldFromSelect"))
                $("#" + fldId).removeClass("fldFromSelect");
        }
    });

    if (appGlobalVarsObject._CONSTANTS.compressedMode) {
        appGlobalVarsObject.methods.toggleCompressModeUI($('body'));
    }

    $(".toolbarRightMenu .menu").find('.menu-sub').addClass("mh-300px scroll-y");

    $(".nav.nav-tabs").each((ind, tab)=>{
        $(tab).find(".nav-item a.nav-link").length == 1 && $(tab).find(".nav-item a.nav-link").removeClass("active").addClass("bg-white");
    }); 

    setTimeout(function () {
        swicthCompressMode();
    }, 0);

    // if (callParentNew("isDWB")) {
    //     $("#breadcrumb-panel, #design").hide();
    // }

    $(".fldCustTableIcon").off('click.fldCustTableIcona');
    $(".fldCustTableIcon").on('click.fldCustTableIcona', function (event) {
        FieldTypeTable(event, this);
    });
    $(".fldCustTable ").off('keydown.fldtblA');
    $(".fldCustTable ").on("keydown.fldtblA", function (event) {
        if (event.keyCode == 13) {
            FieldTypeTable(event, this);
        }
    });

    $(".toggle-password").click(function () {

        $(this).toggleClass("fa-eye fa-eye-slash");
        var input = $($(this).attr("toggle"));
        if (input.attr("type") == "password") {
            input.attr("type", "text");
        } else {
            input.attr("type", "password");
        }
    });

    $('#searchBar').on('click', 'ul.dropdown-menu [data-toggle=dropdown]', function (event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).parent().siblings().removeClass('open');
        $(this).parent().toggleClass('open');
    });
    if (isMobile) {
        $('body').addClass('isMobile');
        $("#design").hide();
    }

    if (true || AxpTstButtonStyle != "old") {
        $("#iconsNew .right").off("click.subMenu", '.dropdown-submenu a').on("click.subMenu", '.dropdown-submenu a', function (e) {
            var $not = $(this).next('ul');
            $.each($("#iconsUl ul").not($not), function (i, val) {
                if ($(val).is(':visible')) {
                    $(val).hide();
                }
            });
            $(this).next('ul').toggle();
            //  $(this).find('i').toggle();

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

    }

    GetProcessTime();
    GetTotalElapsTime();
    $(".modernButtonOptions #iconsUl > li.dropdown-submenu").on('click', function (e) {
        if ($("#iconsUl > li:visible").index(this) % 3 == 0) {
            $(this).find('ul').css({
                'left': '0px'
            })
        } else if ($("#iconsUl > li:visible").index(this) % 3 == 1) {
            $(this).find('ul').css({
                'left': '-110px'
            })
        } else if ($("#iconsUl > li:visible").index(this) % 3 == 2) {
            $(this).find('ul').css({
                'left': '-223px'
            })
        }
    });
    barCodeScannerInit();
});

function swicthCompressMode(dvId) {
    if (appGlobalVarsObject._CONSTANTS.compressedMode) {
        if (typeof dvId != "undefined" && dvId != "") {
            $(".compressedModeUI .inline-edit").each(function (index, el) {
                $(el).find(".form-check-label").addClass("col-form-label-sm fw-boldest");
                $(el).find(".form-check-input").removeClass("h-40px w-40px");
                $(el).find(".selection .select2-selection").addClass("form-select-sm");
                $(el).find(".select2-hidden-accessible").addClass("form-select-sm");
                $(el).find(".edit-mode-content").addClass("input-group-sm");
                $(el).find(".edit-mode-content .input-group").addClass("input-group-sm");
                $(el).find(".edit-mode-content .fldmultiSelect").addClass("py-0");
                $(el).find(".edit-mode-content .select2-selection__choice").addClass("py-1 my-0");
            });

            // $(".compressedModeUI textarea").addClass("py-0 min-h-25px h-25px");
            $(".compressedModeUI table.customSetupTableMN tr textarea:not([data-txt-area]),.compressedModeUI  table.customSetupTableMN tr label").addClass("py-0 min-h-25px h-25px");
            $(".compressedModeUI table.customSetupTableMN tr textarea[data-txt-area]").addClass("min-h-25px h-30px");
            $(".compressedModeUI table.customSetupTableMN").addClass("table-sm");

            $(".compressedModeUI .dvdcframe .gridIconBtns a").addClass("btn-sm");

            $(".compressedModeUI table.customSetupTableMN .form-check").addClass("py-0");

        } else {
            // $(".compressedModeUI").removeClass("p-0").addClass("p-1");

            $(".compressedModeUI .input-group").each(function (index, el) {
                $(el).addClass("input-group-sm");
                $(el).find(".form-check-label").addClass("col-form-label-sm fw-boldest");
                $(el).find(".form-check-input").removeClass("h-40px w-40px");
                $(el).find(".selection .select2-selection").addClass("form-select-sm");
                $(el).find(".select2-hidden-accessible").addClass("form-select-sm");
                $(el).find(".form-check-input").parents(".agform").addClass("d-flex");
                if (typeof dcLayoutType == "undefined" || dcLayoutType == "" || dcLayoutType == "default")
                    $(el).find(".radiohori,.radiovert").parents(".agform").addClass("flex-column");
                if (!staticRunMode)
                    $(el).find(".form-check-input").parents(".grid-stack-item").addClass("d-flex");
            });

            $(".compressedModeUI .inline-edit").each(function (index, el) {
                $(el).find(".form-check-label").addClass("col-form-label-sm fw-boldest");
                $(el).find(".form-check-input").removeClass("h-40px w-40px");
                $(el).find(".selection .select2-selection").addClass("form-select-sm");
                $(el).find(".select2-hidden-accessible").addClass("form-select-sm");
            });

            $(".compressedModeUI table.customSetupTableMN tr textarea:not([data-txt-area]),.compressedModeUI  table.customSetupTableMN tr label").addClass("py-0 min-h-25px h-25px");

            $(".compressedModeUI table.customSetupTableMN tr textarea[data-txt-area]").addClass("min-h-25px h-30px");

            if (typeof dcLayoutType == "undefined" || dcLayoutType == "" || dcLayoutType == "default")
                $(".compressedModeUI .labelcol").removeClass("row");
            else {
                let fcwidth = parseInt(designObj[0].fieldCaptionWidth);
                fcwidth = fcwidth / 10;
                fcwidth = 12 - fcwidth;
                if(!$(".compressedModeUI .input-group").parent().hasClass("layoutAdded")){
                    $(".compressedModeUI .input-group").wrap(`<div class='col-sm-${fcwidth} layoutAdded'></div>`);
                }
                $(".upload-button").addClass('mt-4');
                $(".fldImageCamera").removeClass('mt-n4').addClass('mt-0');
                if (!staticRunMode)
                    $(".colFldGridStackWidth").addClass('mb-3');
            }

            $(".compressedModeUI .fld-wrap3 label").addClass("col-form-label-sm fw-boldest m-0 p-0");

            $(".compressedModeUI .agform").addClass("px-1");

            $(".compressedModeUI table.customSetupTableMN").addClass("table-sm");

            $(".compressedModeUI .toolbarRightMenu a,.compressedModeUI .toolbarRightMenu button").addClass("btn-sm");
            $(".compressedModeUI .toolbarRightMenu a span,.compressedModeUI .toolbarRightMenu button span").addClass("material-icons-2");

            $(".compressedModeUI .BottomToolbarBar a").addClass("btn-sm");
            $(".compressedModeUI .BottomToolbarBar a span").addClass("material-icons-style material-icons-2");
            $(".compressedModeUI .tstructBottomLeftButton a span").addClass("material-icons-style material-icons-2");
            $(".compressedModeUI .tstructBottomLeftButton div.btn").addClass("btn-sm");

            $("select.multiFldChk,select.multiFldChklist,select.fldmultiSelect").parents('.agform').addClass('d-flex flex-column');
            $("select.multiFldChk,select.multiFldChklist,select.fldmultiSelect").parent().addClass('flex-root overflow-auto');
            $(".compressedModeUI textarea.CodeMirrorApplied").parent().addClass("overflow-auto");
        }
    } else
    {
        $(".content table.customSetupTableMN tr:not(.inline-edit) textarea:not([data-txt-area]),.content  table.customSetupTableMN tr:not(.inline-edit) label").addClass("py-2 min-h-30px h-30px");
        $(".content table.customSetupTableMN tr textarea[data-txt-area]").addClass("min-h-25px h-30px");
        $(".content table.customSetupTableMN").removeClass("table-sm");

        // $(".content .dvdcframe .gridIconBtns a").removeClass("btn-sm");
        $(".content .dvdcframe .gridIconBtns a").addClass("btn-sm");

        $(".btn.btn-icon").addClass("btn-sm").find(".material-icons").addClass("material-icons-style material-icons-2");
        
        $(".content table.customSetupTableMN .form-check").addClass("py-2");

        $(".content .dropzone").parent(".form-control").removeClass("p-0").addClass("p-1 rounded-1");
        $(".content [id^=DivFrame] .form-switch .form-check-input").removeClass("w-40px").addClass("w-50px");
        $(".content .form-check-input").parents(".agform").addClass("d-flex");
        
        $("textarea.memofam.gridstackCalc").parent().addClass('flex-root overflow-auto').parents('.agform').addClass('d-flex flex-column');

        $("select.multiFldChk,select.multiFldChklist,select.fldmultiSelect").parents('.agform').addClass('d-flex flex-column');
        $("select.multiFldChk,select.multiFldChklist,select.fldmultiSelect").parent().addClass('flex-root overflow-auto');
        $(".content textarea.CodeMirrorApplied").parent().addClass("overflow-auto");
        if (typeof dcLayoutType == "undefined" || dcLayoutType == "" || dcLayoutType == "default")
            $(".content .radiohori,.content .radiovert").parents(".agform").addClass("flex-column");
        if (!staticRunMode)
            $(".content .form-check-input").parents(".grid-stack-item").addClass("d-flex");

        if (typeof dcLayoutType != "undefined" && (dcLayoutType == "single" || dcLayoutType == "double" || dcLayoutType == "triple")) {
            let fcwidth = parseInt(designObj[0].fieldCaptionWidth);
            fcwidth = fcwidth / 10;
            fcwidth = 12 - fcwidth;
            if(!$(".content .input-group").parent().hasClass("layoutAdded")){
                $(".content .input-group").wrap(`<div class='col-sm-${fcwidth} layoutAdded'></div>`);
            }
            $(".upload-button").addClass('mt-4');
            $(".fldImageCamera").removeClass('mt-n4').addClass('mt-0');
            if (!staticRunMode)
                $(".colFldGridStackWidth").addClass('mb-3');
        }
        $("textarea.select2-search__field").addClass("cursor-pointer");
    }

    if(staticRunMode){
        $(".fld-wrap3").addClass("text-truncate");
    }

    /* Image Upload */
    if (typeof dcLayoutType == "undefined" || dcLayoutType == "" || dcLayoutType == "default")
        $(".imageFileUpload").parents().find(".flex-root").parent().addClass("d-flex flex-column");
    else
        $(".imageFileUpload").parents().find(".flex-root").parent().addClass("d-flex");
    rtfCkeditorAlignment();
}

function getlatlongitude() {
    try {
        var latlongvalue = getRedisString('hybridinfo', callParentNew("hybridGUID"));
        if (latlongvalue != "") {
            var json = JSON.parse(latlongvalue);
            latlongvalue = json.location.coords.latitude + "," + json.location.coords.longitude;
            var latLongId = axplatlongFldName + "000F" + GetDcNo(axplatlongFldName);
            SetFieldValue(latLongId, latlongvalue);
            UpdateFieldArray(latLongId, "000", latlongvalue, "parent");
            MainBlur($j("#" + latLongId));
            $j("#" + latLongId).blur();
        }
    } catch (ex) { }
}

function pinItemToTaskbar(item) {
    var temp = $(item).clone();
    temp.find('a > i').remove(); //remove pin icon
    if (temp.hasClass("dropdown-submenu")) {
        temp.removeClass("dropdown-submenu");
        temp.children('a').append('<span class="icon-arrows-down"></span>'); //add down arrow to dropdown item
        // temp.find("ul.dropdown-menu").hide();
        if (temp.attr('id') != "filterWrapper" && (AxpTstButtonStyle == "modern" || temp.attr('id') != "ivirCButtonsWrapper")) {
            temp.addClass("dropdown");
            temp.find('ul').removeAttr("style");
            if (temp.find('a#tasks'))
                temp.find('li').addClass('liTaskItems');
        } else
            if (temp.find('ul').hasClass('dropdown-menu')) {
                temp.find('ul').removeClass('dropdown-menu');
            }
        if (temp.attr('id') == "ivirCButtonsWrapper") {
            var active = temp.find('ul  a:not(.active):eq(0)');
            $(active).find('.customIcon').removeClass('customIcon');
            $(active).html($(active).html().replace($(active).text(), ''));
            temp.html(active.clone());
        }
    } else
        temp.addClass('actionWrapper');

    temp.removeClass("waves-effect").removeClass("waves-block");

    if (temp.attr('id'))
        temp.attr('id', 'pinned' + temp.attr('id'));
    $.each(temp.find('*'), function (index, element) {
        if ($(element).attr('id')) {
            $(element).attr('id', 'pinned' + $(element).attr('id'));
        }

    });
    $('#pinnediconsUl').append(temp);
    setPinedIconContainerWidth();
}

function setPinedIconContainerWidth() {
    let titleBarExtrasWidth = $("#breadcrumb").outerWidth(true) + $(".toolbarRightMenu").outerWidth(true) + 50;

    if (typeof isAxpertPopup != "undefined" && isAxpertPopup) {
        titleBarExtrasWidth += 35;
    }

    $(".modernButtonOptions #pinnedsearchBar").css({
        'width': `calc(100vw - ${titleBarExtrasWidth}px)`,
        'max-width': `calc(100vw - ${titleBarExtrasWidth}px)`
    });

    var neededHeight = $("#pinnediconsUl").outerWidth(true);
    var totalChildHeight = 0;
    $("ul#pinnediconsUl").children("li").each(function () {
        totalChildHeight += $(this).outerWidth(true);
        if (totalChildHeight > neededHeight) {
            $(this).hide();
            $(this).nextAll().hide();
            return false;
        } else {
            $(this).show();
            $(this).nextAll().show();
        }
    });
}


function hideacoptions() {
    if (isMobile) {
        $(".autoClickddl").parent(".edit").removeAttr('style');
        $(".autoinputtxtclear").hide();
        $(".virtualKeyboard").hide();
    }
}

function getLocation() {
    var mobileLatLong = {};
    if (findGetParameter("recordid") > 0) {
        mobileLatLong.latitude = $("#latitude000F" + GetDcNo("latitude")).val() || 0;
        mobileLatLong.longitude = $("#longitude000F" + GetDcNo("longitude")).val() || 0;
    } else {
        try {
            var mobileAPI = callParentNew("ok");

            if (mobileAPI) {
                mobileLatLong = JSON.parse(mobileAPI.getAndroidLocation());
            }
        } catch (ex) {

        }
    }

    if (($.isEmptyObject(mobileLatLong) || mobileLatLong.latitude == 0 || mobileLatLong.longitude == 0) && navigator.geolocation) {
        return navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        return showPosition({
            coords: {
                latitude: mobileLatLong.latitude,
                longitude: mobileLatLong.longitude
            }
        });
    }

}

function showPosition(position) {
    var fldlatitude = "",
        fldlongitude = "";
    if (position && position.coords && position.coords.latitude != 0 && position.coords.latitude != 0 && !IsGridField("latitude") && !IsGridField("longitude")) {
        var latitudeDc = GetDcNo("latitude");
        var longitudeDc = GetDcNo("longitude");

        fldlatitude = "latitude000F" + latitudeDc;
        fldlongitude = "longitude000F" + longitudeDc;

        if ($("#" + fldlatitude).val() == "") {
            $("#" + fldlatitude).val(position.coords.latitude); //.trigger("blur");
            UpdateFieldArray(fldlatitude, "000", $("#" + fldlatitude).val(), "parent");
            UpdateAllFieldValues(fldlatitude, $("#" + fldlatitude).val());
        }
        if ($("#" + fldlongitude).val() == "") {
            $("#" + fldlongitude).val(position.coords.longitude); //.trigger("blur");
            UpdateFieldArray(fldlongitude, "000", $("#" + fldlongitude).val(), "parent");
            UpdateAllFieldValues(fldlongitude, $("#" + fldlongitude).val());
        }

        var googleMapsApiKeyVal = callParentNew("googleMapsApiKey");
        var files = {
            css: [],
            js: [`https://maps.googleapis.com/maps/api/js?key=${callParentNew("googleMapsApiKey")}`]
        };

        if (($.inArray("latlongmap", FNames) != -1) && googleMapsApiKeyVal) {
            loadAndCall({
                files,
                callBack: function () {
                    if (google) {
                        var fldLatLongMap = "";
                        var latlongmapDc = GetDcNo("latlongmap");
                        fldLatLongMap = "latlongmap000F" + latlongmapDc;
                        var latLongMapField = $("#" + fldLatLongMap);
                        var position = center = {
                            lat: parseFloat($("#" + fldlatitude).val()),
                            lng: parseFloat($("#" + fldlongitude).val())
                        };
                        var geocoder = new google.maps.Geocoder();
                        geocoder.geocode({
                            'location': position
                        }, function (results, status) {
                            if (status === 'OK') {
                                if (results[0]) {
                                    latLongMapField.val(results[0].formatted_address).trigger("blur");
                                    if (latLongMapField.is("textarea")) {
                                        var map = new google.maps.Map(latLongMapField.hide().before(`<div class="${latLongMapField.attr("class")} style="${latLongMapField.attr("style")}"></div>`).prev()[0], {
                                            zoom: 11,
                                            center
                                        });

                                        var infowindow = new google.maps.InfoWindow;

                                        if (googleMapsZoom) {
                                            map.setZoom(+googleMapsZoom);
                                        }

                                        var marker = new google.maps.Marker({
                                            position,
                                            map
                                        });
                                        infowindow.setContent(results[0].formatted_address);
                                        infowindow.open(map, marker);
                                    }
                                }
                            }
                        });
                    }
                }
            });
        }

    }

    if ($(`#${fldlatitude}`).val() != "" && $(`#${fldlongitude}`).val() != "") {
        return true;
    } else {
        return false;
    }
}

$(document).on("click", ".virtualKeyboard", function () {
    $(this).parent().children("input").attr("onfocus", function (index, attr) {
        return attr == "blur()" ? null : "blur()";
    });
    $(this).parent().children("input").focus();
    $(this).children().toggleClass('green');
});

function AxpFileFields() {
    if (typeof AxpFileUploadFields != "undefined" && AxpFileUploadFields.length > 0) {
        callParentNew("tstAxpFileFlds=", true);
    } else
        callParentNew("tstAxpFileFlds=", false);
}

function SetFieldSetCarryValue() {
    if (recordid == "0" && (AxActiveAction == "Save" || AxActiveAction == "New")) {
        if (typeof FSetCarry != "undefined") {
            FSetCarry.forEach(function (fldSetCarry) {
                var setCaryyDcNo = GetDcNo(fldSetCarry);
                if (!IsDcGrid(setCaryyDcNo)) {
                    var fieldId = fldSetCarry + "000F" + setCaryyDcNo;
                    $.each(SetCarryFlds, function (j, value) {
                        if (value.split("♠")[0] == fieldId) {
                            SetFieldValue(fieldId, value.split("♠")[1]);
                            var fRowNo = GetFieldsRowNo(fieldId);
                            var dbRowNo = GetDbRowNo(fRowNo, setCaryyDcNo);
                            UpdateFieldArray(fieldId, dbRowNo, value.split("♠")[1], "parent", "AutoComplete");
                        }
                    });
                }
            });
        }
        SetCarryFlds = new Array();
    }
}

function GetFldSetCarryValue() {
    try {
        if (SetCarryFlds.length > 0)
            SetCarryFlds = new Array();
        if (typeof FSetCarry != "undefined") {
            FSetCarry.forEach(function (fldSetCarry) {
                var setCaryyDcNo = GetDcNo(fldSetCarry);
                if (!IsDcGrid(setCaryyDcNo)) {
                    var fieldId = fldSetCarry + "000F" + setCaryyDcNo;
                    SetCarryFlds.push(fieldId + "♠" + $("#" + fieldId).val());
                }
            });
        }
    } catch (ex) { }
}

function OnMobileNewTst() {
    $("#wizardTstructWrapper wizardWrapper").remove();
    $.each(DCIsGrid, function (i, data) {
        if (data === "True") {
            $("#wrapperForEditFields" + (i + 1) + " .btnMobile").remove();
        }
    });
}

function checkIfFormChanges() {
    if ($(".grid-stack ").hasClass('dirty')) {
        isFormChange = true;
    } else {
        isFormChange = false;
    }
    return isFormChange;
}

function SetAutoCompAccess(act, fld) {
    try {
        if (fld == undefined) {
            $j('input.fldFromSelect:disabled').parent().find("i").css("display", "none");
            //$j('input.fldAutocomplete:readonly').parent().find("i").css("display", "none");
        } else {
            if (act == "enabled")
                fld.parent().find("i").css("display", "inline-block");
            else
                fld.parent().find("i").css("display", "none");
        }
    } catch (ex) {
        console.log("SetAutoCompAccess-action" + act + "-msg" + ex.message);
    }

}
//to get the expression for INIT_CAP
function makeFieldInitCap(dcNo) {
    var depFldIndx = GetFldNamesIndx("axp_initcap");
    var depFldType = "";
    var initExpression = "";
    var initCapElems;
    if (depFldIndx != -1) {
        depFldType = GetExpressionType("axp_initcap", depFldIndx);
        initExpression = Expressions[depFldIndx].toString();
    }
    if (initExpression != "") {
        initExpression = initExpression.split(',');
        for (var i = 0; i < initExpression.length; i++) {
            if (dcNo) {
                if ($("#DivFrame" + dcNo).find('input[id*="' + initExpression[i] + '"]').length > 0)
                    $("#DivFrame" + dcNo).find('input[id*="' + initExpression[i] + '"]').addClass('initCapField');
            } else {
                if ($("input[id^='" + initExpression[i] + "']").length > 0)
                    $("input[id^='" + initExpression[i] + "']").addClass('initCapField');
            }
        }
        //dcNo ? initCapElems = $("#DivFrame" + dcNo + " .initCapField") : initCapElems = $(".initCapField");
        //initCapElems.blur(function (e) {
        //    var capitalizedString = $(this).val().toLowerCase().replace(/\b[a-z]/g, function (letter) {
        //        return letter.toUpperCase();
        //    });
        //    $(this).val(capitalizedString);
        //    var fldId = $(this).attr("id");
        //    var dbRowNo = GetDbRowNo();
        //    UpdateFieldArray(fld, fldDbRowNo, fldValue, "parent", "");
        //});
    }



}

window.onbeforeunload = BeforeWindowClose;

function BeforeWindowClose() {

    if (FNames.filter((fld) => fld.toLowerCase().startsWith("axp_weight_")).length > 0 && appGlobalVarsObject._CONSTANTS.isHybrid) {
        closeWeightScalePort();
    }

    if (draftTimer)
        window.clearInterval(draftTimer);
    if (window.parent.globalChange)
        SetFormDirty(false);
    if (window.opener && !window.opener.closed && window.opener.parent.tstructPop && AxActiveAction != "") {
        window.opener.parent.tstructPop = false;
        ReloadListView(window.opener.parent.listViewPage);
    }
    //RemoveTstDataObj();
    //this function is a dummy call to fire the window close event.
    var rid = $j("#recordid000F0").val();

    if (rid != "0" && AxIsTstructLocked == false && callParentNew("isLockOnRead")) {
        try {
            ASB.WebService.UnlockTStructRecord(tst, rid, false);
        } catch (ex) {

        }
    }
    if (axpRefreshParent == true) {
        if (window.opener.document.title = "Iview") {
            var param = window.opener.document.getElementById("hdnparamValues").value;
            var iName = window.opener.iName;
            var url = "ivtoivload.aspx?ivname=" + iName;
            var strParam = "";
            strParam = param.replace(/¿/g, "&");
            strParam = strParam.replace(/~/g, "=");
            url = url + "&" + strParam + "&axp_refresh=true";
            window.opener.document.getElementById("hdnIvRefresh").value = "true";
            window.opener.document.location.href = url;
            var browservalue = navigator.userAgent.toUpperCase();
            if (browservalue.indexOf("CHROME") > -1) {
                window.opener.document.getElementById("button1").click();
            }
        }
    }

    callParentNew("removeOverlayFromBody()", "function"); //if any remodal popup is opened & user clicks on browser back button then remove window - header, footer & menu overlay css
}

function CheckCustomTStSave() {
    var custActFld = $j("#axp_savedirective000F1");
    var custActFldVal = "";
    var tstIviewname = "";
    var tstParams = "";
    var ivParam = "";
    var tstRedirect = "";

    custActFldVal = custActFld.val();
    if (custActFldVal != undefined) {
        if (custActFldVal.indexOf("$") > -1) { // as a pop up
            custActFldVal = GetPopUpVal(custActFldVal);
        }
        if (custActFldVal.indexOf("~") > -1) {
            tstRedirect = custActFldVal.split('~');
            if (tstRedirect[1] != undefined) {
                tstParams = tstRedirect[1].split('*');
                if (tstRedirect[0] != undefined && tstRedirect[0] != "") {
                    if (tstRedirect.indexOf("iview") > -1) {
                        axCustomTstAction = "ivtoivload.aspx?ivname=" + tstParams[0];
                        if (tstParams[1] != undefined && tstParams[1] != "") {
                            axCustomTstAction += "&" + tstParams[1];
                        }
                    }
                    //tstruct~transid*paramname1=value1^paramname2=value2
                    else if (tstRedirect.indexOf("tstruct") > -1) {
                        axCustomTstAction = "tstruct.aspx?transid=" + tstParams[0] + `&openerIV=${typeof isListView != "undefined" ? iName : tstParams[0]}&isIV=${typeof isListView != "undefined" ? !isListView : "false"}`;
                        if (tstParams[1] != undefined && tstParams[1] != "") {
                            axCustomTstAction += "&" + tstParams[1];
                        }
                    }
                }
            }

        } else {
            axCustomTstAction = custActFld.val();
        }
    }
}

function GetPopUpVal(custActFldVal) {

    var dolrIndx = custActFldVal.indexOf("$");
    var sIndx = custActFldVal.indexOf("*");
    if (sIndx > -1)
        AxPopup = custActFldVal.substring(dolrIndx + 1, sIndx);
    else
        AxPopup = custActFldVal.substring(dolrIndx + 1);

    custActFldVal = custActFldVal.replace("$" + AxPopup, '');

    return custActFldVal;

}
//NOTE:Any modification in the below function should be checked with the AssignJQueryEvents function in tstruct.js
function LoadEvents(dvId) {
    $('[data-toggle="tooltip"]').tooltip();
    CKEDITOR.on('instanceReady', function (event) {
        event.editor.on('change', function () {
            currentCK = this.name;
        });
        isReadyCK = true;
    });
    WizardKtInit();
    createEditors();

    createFormSelect(".fldFromSelect,.multiFldChk");
    createFormMultiSelect(".fldmultiSelect");

    var autoDiv = dvId == undefined ? "#divDc1" : dvId;

    DropzoneInit(dvId);
    DropzoneGridInit(dvId);
    HeaderAttachFiles();
    KTApp.initBootstrapPopovers();
    try {
        KTApp?.initBootstrapTooltips();
    } catch (error) { }
    createCheckListTokens(dvId);

    //function call for focus event of textarea, textbox, checkbox, checklist & radiogroup.
    $j("input:not([id=searstr],[class=AxAddRows],[class=AxSearchField],.flatpickr-input,.gridRowChk,.gridHdrChk),select:not([id=selectbox]),textarea:not(#txtCommentWF):not(.labelInp)").focus(function () {
        MainFocus($j(this));
    });

    var glType = eval(callParent('gllangType'));
    var dtpkrRTL = false;
    if (glType == "ar")
        dtpkrRTL = true;
    else
        dtpkrRTL = false;
    var glCulture = eval(callParent('glCulture'));
    var dtFormat = "d/m/Y";
    if (glCulture == "en-us")
        dtFormat = "m/d/Y";

    $(".flatpickr-input:not(.tstOnlyTime,.tstOnlyTime24hours)").parent(".input-group").flatpickr({
        dateFormat: dtFormat,
        disableMobile: "true",
        allowInput: true,
        wrap: true,
        onOpen: function (selectedDates, dateStr, instance) {
            MainFocus($(instance.element).find("input"));
        },
        onChange: function (selectedDates, dateStr, instance) {
            //if ($(".flatpickr-calendar:visible").length == 0 && $(instance.element).find("input").val() != AxOldValue) {
            //    MainBlur($(instance.element).find("input"));
            //}
        }
    });

    $(".tstOnlyTime").parent(".input-group").flatpickr({
        enableTime: true,
        noCalendar: true,
        dateFormat: "h:i K",
        disableMobile: "true",
        wrap: true,
        onOpen: function (selectedDates, dateStr, instance) {
            MainFocus($(instance.element).find("input"));
        },
        onChange: function (selectedDates, dateStr, instance) {
            if ($(instance.element).find("input").val() != AxOldValue) {
                MainBlur($(instance.element).find("input"));
            }
        }
    });

    $(".tstOnlyTime24hours").parent(".input-group").flatpickr({
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: true,
        disableMobile: "true",
        wrap: true,
        onOpen: function (selectedDates, dateStr, instance) {
            MainFocus($(instance.element).find("input"));
        },
        onChange: function (selectedDates, dateStr, instance) {
            if ($(instance.element).find("input").val() != AxOldValue) {
                MainBlur($(instance.element).find("input"));
            }
        }
    });

    $(document).off("mousedown.designer").on("mousedown.designer", ".tstructDesignMode .grid-stack-item, .tstructDesignMode .ui-resizable", function () {
        setSelectedDesignElement(this);
    });


    $(document).off("dragstop.designer").on("dragstop.designer", ".tstructDesignMode.grid-stack", function (event, ui) {
        selectedDesignObject.elem = event.target;
    });

    $(document).off("change.designer").on("change.designer", ".tstructDesignMode.grid-stack", function (event, ui) {
        setSelectedDesignElement(selectedDesignObject.elem);
    });

    $(document).off("dragstart.designer resizestart.designer").on("dragstart.designer resizestart.designer", ".tstructDesignMode.grid-stack", function (event, ui) {
        $(this).addClass('dirty');
        changeStatus("notSaved");
    });

    $(document).off("gsresizestop.designer").on("gsresizestop.designer", ".tstructDesignMode.grid-stack", function (event, ui) {
        var newHeight = $(ui).attr('data-gs-height');
        var gsiPX = gsiPixels(newHeight);
        // gsiHeight = { "height": gsiPX.toString() + "px" };
        gsiHeight = {
            "height": (isMobile ? gsiPX + 10 : gsiPX).toString() + "px"
        };
        if (typeof CKEDITOR.instances[$(ui).find("textarea").attr("id")] != "undefined") {
            //var ckHeight = CKEDITOR.instances[$(currentElm).attr("id")].resize( '100%', gsiHeight.height, true );
            try {
                var _this = CKEDITOR.instances[$(ui).find("textarea").attr("id")];
                if (!staticRunMode) {
                    _this.resize('100%', gsiPX);
                } else {
                    _this.resize('100%', ($(_this.ui.contentsElement.$).parents(".grid-stack-item-content").height() - $(_this.ui.contentsElement.$).parents(".grid-stack-item-content").children(".fld-wrap3").outerHeight(true) - 2) - $(_this.ui.contentsElement.$).siblings().toArray().reduce((total, elm) => {
                        return total = total + $(elm).outerHeight(true);
                    }, 0), true);
                }
            } catch (error) { }
        }
    });

    //TimePickerEvent(dvId, dtpkrRTL);
    //function call on blur event of textarea, textbox.
    $j("textarea:not(#comment):not(.labelInp,.select2-search__field),[id]:text:not([id=searstr],[class=AxAddRows],[class=AxSearchField],.gridHdrChk,.tstOnlyTime,.tstOnlyTime24hours,.gridHeaderSwitch),[id][type=number]:not([id=searstr],[class=AxAddRows],[class=AxSearchField]),:password").blur(function (event) {
        if (theMode != "design")
            MainBlur($j(this));
    });

    $j(document).mousedown(function (e) {
        if (e.target.id != "") {
            blurNextPreventElement = new Object();
            blurNextPreventId = e.target.id;
        } else {
            blurNextPreventId = "";
            blurNextPreventElement = e.target;
        }
    });

    //function call on change event of dropdown.
    $j("select:not(#ddlSearch,#selectbox,.fldFromSelect,.fldmultiSelect,.multiFldChk):not(#designLayoutSelector)").change(function () {
        if ($j(this).find(':selected').text().indexOf("+ Add") == -1) {
            MainBlur($j(this));
            $j(this).blur();
            $j(this).focus();
        } else {
            if ($j(this).val() != null || $j(this).val() != undefined) {
                var ddlrefval = $j(this).val();
                $j(this).val("");
                eval(ddlrefval);
            }
        }
    });

    //function call on blur event of checkbox, checklist & radiogroup.
    $j(":checkbox:not([class=chkAllList],.gridHdrChk,.gridRowChk,.gridHeaderSwitch):not(.tokenSelectAll):not(#ckbCompressedMode):not(#ckbStaticRunMode):not(#ckbWizardDC):not('[id^=ckbGridStretch]'),:radio").not(".chkShwSel").change(function () {
        MainBlur($j(this));
    });

    //function call on keydown event in a textarea.
    $j("textarea:not(.labelInp)").keydown(function (event) {
        LimitText($j(this));
    });

    //function call on keyup event in a textarea.
    $j("textarea:not(.labelInp)").keyup(function () {
        LimitText($j(this));
    });

    //function call on keypress event in a numeric field.
    $j(".number").keypress(function (event) {
        return CheckNumeric(event, $j(this).val());
    });


    $j("#searchoverrelay").unbind("keypress").keypress(function (e) {
        if (e.keyCode == 13) { // detect the enter key
            if (!valid_submit())
                return false;
        }
    });

    //function on click of image field
    $j(".axpImg").click(function () {
        if (tstructCancelled != "Cancelled") {
            var imgFld = $j(this);
            var fldName = imgFld[0].id;
            var onclickevent = document.getElementById(fldName).onclick;
            if (onclickevent == null)
                UploadImg(fldName);
        }
    });

    //function on click of signature field
    $j(".signaturePad").click(function (e) {
        if ($(e.target).attr("onclick") == "ClearImageSrc(this);") {
            return;
        }
        if (tstructCancelled != "Cancelled") {            
            var imgFld = $j(this).find(".signatureInput");
            var fldName = imgFld[0].id;
            var onclickevent = document.getElementById(fldName).onclick;
            if (onclickevent == null)
                openSignaturePad(fldName);
        }
    });

    // function on click of Bar/QR code field
    $j(".divBarQrScan").click(function () {
        if (tstructCancelled != "Cancelled") {
            var scanFld = $j(this);
            var fldName = scanFld.parent().find("input")[0].id;
            var onclickevent = document.getElementById(fldName).onclick;
            if (onclickevent == null)
                openBarQrScanner(fldName);
        }
    });

    //function on click of action buttons
    $(".axpBtn").off("click.axpBtn").on("click.axpBtn", function () {
        var obj = $j(this);
        if (obj.length > 0) {
            var rowNo = GetFieldsRowNo(obj[0].id);
            var dcNo = GetFieldsDcNo(obj[0].id);
            RegisterActiveRow(rowNo, dcNo);
            CallAction(obj[0].id);
        }
    });

    $j(".rowdelete").click(function () {
        DeleteCurrentRow($j(this));
    });

    $j(".subGrid").click(function () {

        ShowPopUp($j(this));
    });

    $j("#taskListPopUp").hide();

    $j('.AxAddRows').blur(function () {
        if (!this.value || isNaN(this.value))
            return this.value = "1";
    });

    $j(".achklist").click(function () {
        $j(this).parent().next('.chkListBdr').toggle();
    });


    $j(".spandate").click(function () {
        $j(this).prev().focus();
    });

    $j(".spanTime").click(function () {
        $j(this).prev().find("input").focus();
    });

    $(document).on("keypress", dvId + " .form-group span.fa-paperclip", function (e) {
        if (e.which == "13") {
            $(this).click();
        }
    });
    $j(".rowdelete img").hover(function () {
        $j(this).attr("src", "../axpimages/icons/16x16/delete.png");
    }, function () {
        $j(this).attr("src", "../axpimages/icons/16x16/delete-fade.png");
    });

    if (parent.MainNewEdit == true) {
        $j('html').addClass("makeFullHeight");
    }

    try {
        if ($j("#popupIframeRemodal", parent.document).attr("src") != undefined) {
            $j(document).keyup(function (e) {
                if (e.keyCode === 27) {
                    if (IsFormDirty && $('#bootstrapModal').length === 0) {
                        $.confirm({
                            theme: 'modern',
                            closeIcon: false,
                            title: eval(callParent('lcm[155]')), //lcm[121]
                            content: eval(callParent('lcm[121]')),
                            escapeKey: 'buttonB',
                            onContentReady: function () {
                                disableBackDrop('bind');
                            },
                            buttons: {
                                buttonA: {
                                    text: eval(callParent('lcm[164]')),
                                    btnClass: 'btn btn-primary',
                                    action: function () {
                                        $j('.remodal-close', parent.document).click();
                                    }
                                },
                                buttonB: {
                                    text: eval(callParent('lcm[192]')),
                                    btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                                    action: function () {
                                        disableBackDrop('destroy');
                                        return true;
                                    },

                                }
                            }
                        });
                    } else if ($('#bootstrapModal').length === 1) {
                        // do nothing;
                    } else {
                        $j('.remodal-close', parent.document).click();
                    }

                }
            });
        }
    } catch (ex) {
        console.log(ex.message);
    }


    $ == undefined ? $ = $j : "";
    jQuery.browser = {};
    (function () {
        jQuery.browser.msie = false;
        jQuery.browser.version = 0;
        if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
            jQuery.browser.msie = true;
            jQuery.browser.version = RegExp.$1;
        }
    })();


    if ($j(".clsPrps").length > 0) {
        $j("#tgPurpose").css("display", "inline-block");
    } else {
        $j("#tgPurpose").css("display", "none");
    }

    //function call on focusin event for masked field value to actual value.
    $j("input.form-control,textarea.memofam").on('focusin', function (e) {
        try {
            var fldId = $j(this).attr("id");
            if (typeof fldId != "undefined" && fldId != "") {
                var fName = GetFieldsName(fldId);
                var fldIndex = $j.inArray(fName, FNames);
                if (fldIndex != undefined && fldIndex > -1) {
                    if (typeof FldMaskType != "undefined" || typeof ScriptMaskFields != "undefined") {
                        let maskType = "";
                        if (ScriptMaskFields.length > 0) {
                            var idx = $j.inArray(fName, ScriptMaskFields);
                            if (idx != -1)
                                maskType = ScriptMaskFields[idx];
                            else
                                maskType = FldMaskType[fldIndex];
                        } else
                            maskType = FldMaskType[fldIndex];
                        if (maskType != "") {
                            let newFldMaskValue = GetFieldValue(fldId);
                            if (newFldMaskValue != "" && newFldMaskValue != '0.00' && newFldMaskValue != '0') {
                                $j(this).val(newFldMaskValue);
                                $j(this).attr("value", newFldMaskValue);
                            }
                        }
                    }
                }
            }
        } catch (ex) { }
    });

    $j("input.number").on('input', function () {
        var fldVal = $j(this).val();
        var fldId = $j(this).attr("id");
        if (fldId != undefined) {
            var fName = GetFieldsName(fldId);
            var fldIndex = $j.inArray(fName, FNames);
            if (fldIndex != undefined && fldIndex > -1) {
                var maxFldLength = FMaxLength[fldIndex];
                var decimalLength = 0;
                if (FCustDecimal[fldIndex] == "True" && typeof gloAxDecimal != "undefined" && gloAxDecimal > -1)
                    decimalLength = gloAxDecimal;
                else
                    decimalLength = FDecimal[fldIndex];
                var fldType = FDataType[fldIndex];
                if (fldType == "Numeric" && decimalLength != undefined && decimalLength > 0) {
                    var intPartMaxLimit = maxFldLength - decimalLength - 1; //Integer Part Max Limit.
                    if (fldVal.indexOf('.') == -1) {
                        if (fldVal.length > intPartMaxLimit) {
                            $j(this).val(fldVal.slice(0, intPartMaxLimit));
                            UpdateAllFieldValues($j(this).attr("id"), fldVal.slice(0, intPartMaxLimit));
                        }
                    } else if (fldVal.indexOf('.') != -1) {
                        var intPart = fldVal.substring(0, fldVal.indexOf('.'));
                        var decPart = fldVal.substring(fldVal.indexOf('.') + 1, fldVal.length);
                        if (intPart.length > intPartMaxLimit) intPart = intPart.slice(0, intPartMaxLimit);
                        if (decPart.length > decimalLength) decPart = decPart.slice(0, decimalLength);
                        $j(this).val(intPart + "." + decPart);
                        UpdateAllFieldValues($j(this).attr("id"), intPart + "." + decPart);
                    }
                }
            }
        }
    });

    // $j(".workflowOptions").click(function () {
    //     if ($("#workflowdropdown").length != 0)
    //     $("#workflowdropdown").append($("#selectbox").detach());
    //          $("#workflowdropdown").append($(".dropbox").detach());
    //     if ($(".wfselectbox").hasClass("d-none")) {
    //         $(".wfselectbox").removeClass("d-none");
    //     } else
    //         $(".wfselectbox").addClass("d-none");
    // });

    $(document).off("click", ".weightScaleIcon").on("click", ".weightScaleIcon", function () {
        if (appGlobalVarsObject._CONSTANTS.isHybrid) {
            /* Clear older weight scale value in redis if exists with current loggedin guid.*/
            let oldWeightScaleVal = getRedisString("HybridWeightScaleInfo", callParentNew("hybridGUID"));

            $(this).parent(".weightScale").parent().children("input").focus();

            try {
                ShowDimmer(true);
                ASB.WebService.NotifyHybridForWeightScale(callParentNew("hybridGUID"),
                    (success) => {
                        if (success == "success") {
                            getHybridWeightScaleInfo($(this).parent(".weightScale").parent().children("input").attr("id"));
                        } else {
                            ShowDimmer(false);
                            showAlertDialog("error", "Error occurred while fetching weight. Please try again.");
                        }
                    },
                    (error) => {
                        ShowDimmer(false);
                        showAlertDialog("error", "Error occurred while fetching weight. Please try again.");
                    }
                );
            } catch (error) {
                ShowDimmer(false);
                showAlertDialog("error", "Exception occurred while fetching weight.");
            }
        }
        else {
            showAlertDialog("error", "Please close the application and login again.");
        }
    });

    $(document).off("change", '.tstfldImage').on("change", '.tstfldImage', function (e) {
        TstFldImageUpload(e.target);
    });

    $(document).off("click", ".imageFileUpload,img.profile-pic").on("click", ".imageFileUpload,img.profile-pic", function (e) {
        $(this).siblings("label.upload-button").find(".tstfldImage").click()
    });

    $j(".fldImageCamera").click(function () {
        let attrId = $(".fldImageCamera").parent(".image-input").find("input").attr("id");
        UploadCaptureImage(attrId);
    });

    if (typeof AxpCameraOption == "undefined" || (typeof AxpCameraOption != "undefined" && (AxpCameraOption == "" || AxpCameraOption != "true"))) {
        $(".fldImageCamera").removeClass("d-none");
    }

    $("#wBdr").on("mouseenter mouseleave", ".customSetupTableMN textarea", function(e){
        $(this).attr('title', $(this).val());
    });
}

function WizardKtInit() {
    if (typeof isWizardTstruct != "undefined" && isWizardTstruct) {
        // Stepper lement
        var element = document.querySelector("#wbdrHtml");

        // Initialize Stepper
        var stepper = new KTStepper(element);

        // Handle navigation click
        stepper.on("kt.stepper.click", function (stepper) {
            let wCurrDc = $(stepper.element).find(".flex-column.current").attr("id");
            let wcDcNo = wCurrDc.slice(8);
            if (wcDcNo < stepper.getClickedStepIndex()) {
                if (!ValidateBeforeSubmit(wcDcNo))
                    return false;
                else {
                    stepper.goTo(stepper.getClickedStepIndex()); // go to clicked step
                }
            } else
                stepper.goTo(stepper.getClickedStepIndex()); // go to clicked step
        });

        // Handle next step
        stepper.on("kt.stepper.next", function (stepper) {
            let wCurrDc = $(stepper.element).find(".flex-column.current").attr("id");
            let wcDcNo = wCurrDc.slice(8);
            let allDcs = $(stepper.element).find(".flex-column.current").nextAll(".flex-column");
            if (wizardHidenDcNos.length > 0) {
                let isNexyClk = false;
                allDcs.each(function () {
                    let wdcId = $(this).attr("id");
                    wdcId = parseInt(wdcId.slice(8));
                    if (wizardHidenDcNos.includes(wdcId)) {
                        stepper.goNext()
                    } else {
                        isNexyClk = true;
                        return false;
                    }
                });
                if (isNexyClk) {
                    if (!ValidateBeforeSubmit(wcDcNo))
                        return false;
                    else {
                        return stepper.goNext(); // go next step
                    }
                }
            } else {
                if (!ValidateBeforeSubmit(wcDcNo))
                    return false;
                else {
                    return stepper.goNext(); // go next step
                }
            }
        });

        // Handle previous step
        stepper.on("kt.stepper.previous", function (stepper) {
            let wCurrDc = $(stepper.element).find(".flex-column.current").attr("id");
            let wcDcNo = wCurrDc.slice(8);
            let allDcs = $(stepper.element).find(".flex-column.current").prevAll(".flex-column");
            if (wizardHidenDcNos.length > 0) {
                let isPrevClk = false;
                allDcs.each(function () {
                    let wdcId = $(this).attr("id");
                    wdcId = parseInt(wdcId.slice(8));
                    if (wizardHidenDcNos.includes(wdcId)) {
                        stepper.goPrevious(); // go previous step
                    } else {
                        isPrevClk = true;
                        return false;
                    }
                });
                if (isPrevClk) {
                    stepper.goPrevious(); // go previous step
                }
            } else
                stepper.goPrevious(); // go previous step
        });
    }
}

function createCheckListTokens(dvId) {
    $((dvId ? "#" + dvId : "") + " .form-select.multiFldChklist:not(span)").each(function () {
        var thisValueList = $(this).data("valuelist");
        var source = typeof thisValueList == "object" ? thisValueList : [...new Set(
            $(this).data("valuelist").split($(this).data("separator"))
        )];

        if (source != "") {
            var result = ($.map(source, function (item) {
                return {
                    id: item,
                    text: item
                }
            }))
            $(this).select2({
                data: result
            }).on("select2:unselect select2:select", function (e) {
                let fldNamesf = $(this).attr("id");
                let fldAcValue = $(this).val();
                if (typeof $(this).data("separator") != "undefined" && fldAcValue.length > 1) {
                    let separator = $(this).data("separator");
                    fldAcValue = fldAcValue.join(separator);
                }
                var rcID = GetFieldsRowFrameNo(fldNamesf);
                var acFrNo = GetFieldsDcNo(fldNamesf);
                var rowNum = GetDbRowNo(GetFieldsRowNo(fldNamesf), acFrNo);
                UpdateFieldArray(fldNamesf, rowNum, fldAcValue, "parent", "AutoComplete");
                UpdateAllFieldValues(fldNamesf, fldAcValue);
            }).on('select2:open', (selectEv) => {
                var curDropdown = $(selectEv.currentTarget).data("select2")?.$dropdown;
                var selectedOptionCount = 0;
                if (result.length != 0) {
                    if (curDropdown.find(".select2-results").find(".msSelectAllOption").length == 0) {
                        var selectAllHTML = `<div class="msSelectAllOption form-check form-check-custom align-self-end px-5">
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
    });
}

function checkAllCheckBoxTokens(elem, elemId) {
    if ($(`#${elemId}`).hasClass('multiFldChk')) {
        if ($(elem).is(":checked")) {
            $(`#${elemId}`).find('option').remove();
            $(".select2-results ul li").each(function () {
                $(`#${elemId}`).append('<option value="' + $(this).text() + '" selected="selected">' + $(this).text() + '</option>');
            });

            let fldAcValue = $(`#${elemId}`).val();
            if (typeof $(`#${elemId}`).data("separator") != "undefined" && fldAcValue.length > 1) {
                let separator = $(`#${elemId}`).data("separator");
                fldAcValue = fldAcValue.join(separator);
            }
            isGrdEditDirty = true;
            var acFrNo = GetFieldsDcNo(elemId);
            var rowNum = GetDbRowNo(GetFieldsRowNo(elemId), acFrNo);
            var fldRowNo = GetFieldsRowNo(elemId);
            if (IsDcGrid(acFrNo) && isGrdEditDirty)
                UpdateFieldArray(axpIsRowValid + acFrNo + fldRowNo + "F" + acFrNo, GetDbRowNo(fldRowNo, acFrNo), "", "parent", "AddRow");
            UpdateFieldArray(elemId, rowNum, fldAcValue, "parent", "AutoComplete");
            UpdateAllFieldValues(elemId, fldAcValue);
            setTimeout(function () {
                MainBlur($j("#" + elemId));
            }, 0);
        } else {
            $(`#${elemId}`).find('option').remove();
            $(`#${elemId}`).val('');
            var acFrNo = GetFieldsDcNo(elemId);
            var rowNum = GetDbRowNo(GetFieldsRowNo(elemId), acFrNo);
            UpdateFieldArray(elemId, rowNum, "", "parent", "AutoComplete");
            UpdateAllFieldValues(elemId, "");
            AxOldValue = " ";
            setTimeout(function () {
                MainBlur($j("#" + elemId));
            }, 0);
        }
        $(`#${elemId}`).trigger("change").select2("close");
    } else {
        if ($(elem).is(":checked")) {
            $(`#${elemId} > option`).prop("selected", "selected");
            $(`#${elemId}`).trigger("change").select2("close");
        } else {
            $(`#${elemId} > option`).prop("selected", "");
            $(`#${elemId}`).trigger("change").select2("close");
        }
    }
}

function ShowPopUp(imgObj) {
    var imgId = imgObj.attr("id");
    var parFld = imgObj.parent().find("input");
    if (parFld.length == 0)
        parFld = imgObj.parent().find("select");
    var parFldId = parFld.attr("id");
    OpenPopUp(parFldId, imgId);
}

//Function to focus the first element in the form, focus Tab dc and first field in the Tab dc.
//Parameter - Dc Div id.
function FocusOnFirstField(dcno) {

    if (dcno == "form") {
        var visibleDCs = $j('[id*="divDc"]');
        for (var i = 0; i < visibleDCs.length; i++) {
            if ($j(visibleDCs[i]).is(':visible')) {
                dcno = visibleDCs[i].id.substring(visibleDCs[i].id.indexOf('divDc') + 5);
                break;
            }
        }
    }
    var objId = "";
    if (IsDcGrid(dcno)) {
        objId = "#wrapperForEditFields" + dcno;
    } else {
        objId = "#divDc" + dcno;
    }
    if ($j(objId).length > 0) {
        try {
            if ($j.inArray("1", TabDCs) == -1 && !isMobile) {
                $j(objId).focus();
            } else if (isMobile && $("#wizardBodyContent").length) {
                $("#wizardBodyContent").scrollTop(0);
            }
        } catch (ex) { }
        var focusObj = getFirstFocusElement(objId);
        //if (!focusObj.hasClass("date")) This condition is removed due to the issue : AGI003000
        if (focusObj != undefined && focusObj.length > 0 && !isMobile) {
            focusObj.focus();
            return focusObj;
        } else if (isMobile && $("#wizardBodyContent").length) {
            $("#wizardBodyContent").scrollTop(0);
        } else if (isMobile && axInlineGridEdit) {
            focusObj.focus();
            return focusObj;
        }
    }
}

function SetFocusAfterSaveOnLoad() {
    let sfasId = focusAfterSaveOnLoad;
    focusAfterSaveOnLoad = "";
    let sfasName = GetFieldsName(sfasId);
    let sfasDcNo = GetFieldsDcNo(sfasId);
    if (!IsDcGrid(sfasDcNo)) {
        if ($("#ank" + sfasDcNo).length > 0 && !$("#ank" + sfasDcNo).parent().hasClass("active")) {
            $("#ank" + sfasDcNo).click();
            setTimeout(function () {
                $j("#" + sfasId).focus();
            }, 210);
        } else
            $j("#" + sfasId).focus();
    } else {
        let sfasRowNo = sfasId.substring(sfasId.lastIndexOf("F") - 3, sfasId.lastIndexOf("F"));
        if ($("#ank" + sfasDcNo).length > 0 && !$("#ank" + sfasDcNo).parent().hasClass("active")) {
            $("#ank" + sfasDcNo).click();
            setTimeout(function () {
                $("#gridHd" + sfasDcNo + " tbody tr[id=sp" + sfasDcNo + "R" + sfasRowNo + "F" + sfasDcNo + "]").find(".glyphicon-pencil").parent().click();
                setTimeout(function () {
                    $j("#" + sfasId).focus();
                }, 50);
            }, 300);
        } else if ($("#ank" + sfasDcNo).length > 0 && $("#ank" + sfasDcNo).parent().hasClass("active")) {
            $("#gridHd" + sfasDcNo + " tbody tr[id=sp" + sfasDcNo + "R" + sfasRowNo + "F" + sfasDcNo + "]").find(".glyphicon-pencil").parent().click();
            setTimeout(function () {
                $j("#" + sfasId).focus();
            }, 50);
        }
    }
}


function DisplaySearchDlg() {

    $j(window).keydown(function (e) {
        OpenSearchPop(e);
    });

    if (window.parent) {
        $j(window.parent).keydown(function (e) {
            OpenSearchPop(e);
        });
    }
};

function LockTstruct() {
    Readonlyform();
    $j("#icons").find('*').attr('disabled', true);
    $j("#icons").find('*').prop('disabled', true);
    if ($j(".search").length > 0)
        $j(".search").removeProp("disabled");
    if ($j(".add").length > 0)
        $j(".add").find('*').removeProp("disabled");
    if ($j(".pdf").length > 0)
        $j(".pdf").find('*').removeProp("disabled");
    if ($j(".listview").length > 0)
        $j(".listview").find('*').removeProp("disabled");
}



function loadingNew() {
    Sys.WebForms.PageRequestManager.getInstance().add_endRequest(EndRequestHandler);
}

function EndRequestHandler(sender, args) {
    if (args.get_error() == undefined) {
        if ($j("#goval").length > 0) {
            var gov = $j("#goval");
            if (gov.val() == "go") {
                FillDiv("Show");
                if (!$("#grdSearchRes").parent().hasClass('d-inline-flex'))
                    $("#grdSearchRes").parent().addClass('d-inline-flex w-100 overflow-auto');
                $j("#searstr").val(DecodeUrlSplChars($j("#hdnSearchStr").val()));
                gov.val("d");
            }
        }
        ShowDimmer(false);

        var ExportToHtml = $j("#hdnHtml");
        var fileName = $j("#hdnFilename");
        if (ExportToHtml.val() == "Save") {
            showAlertDialog("success", 2028, "client", fileName.val());
            ExportToHtml.val("");
        }
    } else {
        showAlertDialog("error", 2029, "client", args.get_error().message);
    }
}

function displaysearchDiv(divId, title) {

    $j("#" + divId).show();
    $j("#" + divId).addClass('Pagebody Bordercolor');
    $j("#searchoverrelay").parent().removeClass("d-none");
    $j("#searchoverrelay").css("display", "block");

    Resizewindow();
}

function FillDiv(state) {

    if (state == "Show")
        $("#srchcontent").removeClass("d-none");
    else
        $("#srchcontent").addClass("d-none");
    Resizewindow();
}

function Pagination() {

    var gov = $j("#goval");
    gov.val("go");
    ShowDimmer(true);
}

function Closediv() {
    $j("#Panel1").hide();
    $j("#srchcontent").addClass("d-none");
    $j("#searchoverrelay").parent().addClass("d-none");
    $j("#searchoverrelay").css("display", "none");
    //adjustwin('100', this.window);

}

function hiddenFloatingDiv(divId) {

    document.getElementById(divId).style.display = "none";
    document.getElementById('dimmer').style.display = 'none';
    DivID = "";
    Resizewindow();
}

function Resizewindow() {

    //adjustwin('100', this.window);
    // This is to adjust the absolute position of the controls once
    // the grid is shown or hidden.
    var closeimg = document.getElementById("closeimg");
    //closeimg.onmouseover();
    //closeimg.onmouseout();
}

function togglesrchselect() {

    var check = false;
    var obj = document.getElementById("searchall");
    if (obj.checked)
        check = true;
    else
        check = false;

    for (var i = 0; i < document.getElementById("s1").options.length; i++) {
        var cntrl = "search" + i;
        document.getElementById(cntrl).checked = check;
    }
}

function PopupfadeTo(obj, opacity) {

    obj = $j("#" + obj.id);
    if (opacity <= 100) {
        if (opacity < 0) {
            opacity = 100;
            document.body.style.cursor = 'default';
        } else {
            document.body.style.cursor = 'Hand';
            opacity = 65;
        }
        SetOpacity(obj, opacity);
    }
}

function valid_submit() {
    GetCurrentTime("Tstruct load on Search Go button click(ajax call)");
    var gov = $j("#goval");
    gov.val("go");
    var srchFld = $j("#searstr");
    txtVal = CheckUrlSplChars(srchFld.val());
    if (ValidateSrchFlds()) {
        ShowDimmer(true);
        $j("#hdnSearchStr").val(txtVal);
        $j("#searstr").val("");
        var btn = $j("#btnGo");
        if (btn.length > 0) {
            GetProcessTime();
            $j("#hdnbElapsTimeGo").val(callParentNew("browserElapsTime"));
            btn.click();
        }
    } else
        if (txtVal == "" || txtVal == null || txtVal == undefined) {
            showAlertDialog("warning", 2007, "client");
        }

    return;
}

function DecodeUrlSplChars(value) {
    value = value.replace(/&/g, "&amp;");
    value = value.replace(/%25/g, "%");
    value = value.replace(/%26/g, "&");
    value = value.replace(/%27/g, "'");
    value = value.replace(/%22/g, '"');
    value = value.replace(/%23/g, "#");
    return value;
}

function ValidateSrchFlds() {
    var srchDdl = $j("#ddlSearch");
    var selFld = srchDdl.val();
    var indx = $j.inArray(selFld, FNames);
    var txtVal = $j.trim($j("#searstr").val());
    if (indx != -1 && txtVal != "") {
        var fldType = FDataType[indx];
        if (fldType == "Date/Time") {
            var srchFldValue = $j("#searstr");
            var isproperdate = isDate(srchFldValue.val());
            if (!isproperdate) {
                srchFldValue.focus();
                // showAlertDialog("warning", "please enter correct date/time ");
                return false;
            } else {
                srchFldValue.focus();
                return true;
            }
        } else {
            return true;
        }
    } else {
        return false;
    }
}

function loadTstruct(recid) {
    WireElapsTime(serverprocesstime, requestProcess_logtime);
    ShowDimmer(true);
    ResetNavGlobalVariables();
    AxWaitCursor(true);
    //window.document.location.href = "tstruct.aspx?transid=" + transid + "&recordid=" + recid;
    try {
        if (!window.parent.isSessionCleared && !window.opener) {
            ASB.WebService.ClearNavigationSession();
            window.parent.isSessionCleared = true;
        }
        if (!window.opener)
            window.parent.disableNavigation = true;
        else
            window.opener.parent.disableNavigation = true;

        GetLoadData(recid, "");
    } catch (ex) {
        Closediv();
    }
}

// Checks if the browsers is IE or another.
// document.all will return true or false depending if its IE
// If its not IE then it adds the mouse event
if (!document.all)
    document.captureEvents(Event.MOUSEMOVE)

// On the move of the mouse, it will call the function getPosition
// These varibles will be used to store the position of the mouse
var iX = 0
var iY = 0

// This is the function that will set the position in the above varibles
function getPosition(args) {
    // Gets IE browser position
    if (document.all) {
        iX = event.clientX + document.body.scrollLeft
        iY = event.clientY + document.body.scrollTop
    }
    // Gets position for other browsers
    else {
        iX = args.pageX
        iY = args.pageY
    }
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

function ShowTooltipDiv() {
    if (document.getElementById)
        // Standard way to get element
        div = document.getElementById('dvTip');
    else if (document.all)
        // Get the element in old IE's
        div = document.all['dvTip'];

    // if the style.display value is blank we try to check it out here
    if (div.style.display == '' && div.offsetWidth != undefined && div.offsetHeight != undefined) {
        div.style.display = (div.offsetWidth != 0 && elem.offsetHeight != 0) ? 'block' : 'none';
    }

    div.style.display = "block";
    // Sets the position of the DIV
    div.style.left = iX + 'px';
    div.style.top = iY + 'px';
}
var regexFld = new RegExp("^[a-zA-z0-9_]+$");

function ShowTooltip(fldName, obj) {
    HideTooltip();
    var i = 0;
    var toolTip = "";
    var toolTipList = new Array();
    var ttURL;
    var toolTipHyperlnk = "";
    for (i = 0; i < FNames.length; i++) {
        if (FNames[i] == fldName) {

            toolTip = FToolTip[i];
            var displyText = "";
            var stPos = toolTip.indexOf("<h>");
            if (stPos != -1) {
                var enPos = toolTip.indexOf("</h>");
                var ttURL = toolTip.substring(stPos + 3, enPos);

                displyText = toolTip.substring(0, stPos);
                toolTipHyperlnk = "<a class='curHand' id='lblTip'  onclick='javascript:HyperlinkToolTip(\"" + ttURL + "\");'>" + displyText + " </a>";
                toolTip = toolTip.substring(enPos + 4, toolTip.length);
            }

            if (toolTip != "")
                toolTipList = toolTip.split("/");

            break;
        }
    }
    var j = 0;
    var flname = obj.attr("id");
    var flval = obj.value;
    var temp = "";
    for (j = 0; j < toolTipList.length; j++) {
        //Condition to check if the tooltip Is not empty and is plainText/String .

        if (toolTipList[j] != "") {
            if (toolTipList[j].toString().indexOf(":") == -1) {
                toolTipList[j] = toolTipList[j].trim();
                temp += toolTipList[j].trim();
            }
            //Conodition to check for fields or expressions
            else {
                var tempArr = new Array();
                var tempStr = toolTipList[j];
                var finalStr = "";
                var charCnt = 0;
                var strLen = 0;
                var ch = '';
                var nextCh = '';
                var isColon = false;
                //tempStr = ":name_ Hi";

                //Loop through the string to seperate the string, fields and expressions
                for (charCnt = 0; charCnt <= tempStr.length; charCnt++) {
                    ch = tempStr.charAt(charCnt);

                    if (ch == ":") {
                        nextCh = tempStr.charAt(charCnt + 1);
                        if (nextCh == "+") {
                            //Get the expression and push it to the array
                            var str = tempStr.substring(tempStr.indexOf(":+"), tempStr.indexOf("+:") + 2);
                            str = str.replace(":+", "");
                            str = str.replace("+:", "");
                            str = Evaluate(flname, flval, str, "expr");
                            tempArr.push(str);
                            charCnt = tempStr.indexOf("+:") + 2;
                        } else {
                            isColon = true;
                            if (finalStr != "") {
                                tempArr.push(finalStr);
                            }
                            finalStr = "";
                        }
                    } else {
                        if (isColon == true) {
                            var res = regexFld.test(ch);
                            if (res == false) {
                                var rowFramNo = GetFieldsRowFrameNo(flname);
                                res = GetFieldValue(finalStr + rowFramNo);
                                tempArr.push(res);
                                finalStr = "";
                                isColon = false;
                            }
                        }
                        finalStr += ch;
                    }
                }
                if (finalStr != "")
                    tempArr.push(finalStr);
                //Loop through the tempArr and evaluate the string and generate the tooltip
                var items = 0;
                toolTipList[j] = "";
                for (items = 0; items < tempArr.length; items++) {
                    toolTipList[j] += tempArr[items];
                }
            }

        }
    }

    //Write the result to the div inner Text
    if (toolTipList.length > 0) {

        FindCtrlPos(flname);
        var dvToolTip = $j("#dvInnerTip");
        var toolTip = "";
        for (i = 0; i < toolTipList.length; i++) {
            if (toolTipList[i] != "") {
                toolTip += toolTipList[i] + "<br/>";
            }
        }
        if (toolTipHyperlnk != "") {
            dvToolTip.html("<br/>" + toolTipHyperlnk + " " + toolTip);
            ShowTooltipDiv();
        } else if (toolTip != "") {
            dvToolTip.html("<br/>" + toolTip);
            ShowTooltipDiv();
        }
    }
}
document.onkeypress = function hideTooltip(event) {
    if (event.keyCode == 27) {
        HideTooltip()
    }
}

function HideTooltip() {
    var dvtooltip = $j("#dvTip");
    if (dvtooltip.length > 0) {
        dvtooltip.hide();
    }
}

var hlTipProps = "";
var hlTipParmUrl = "";
var hlTipUrl = "";
var hlTipParamXml = "";

function HyperlinkToolTip(ttUrl) {
    hlTipParmUrl = "";
    var structName = "";
    var propArr = new Array();
    var arrParam = new Array();
    propArr = ttUrl.split(",");
    var iName = "";
    var refresh = "";
    var newLink = "";
    var openWin = "";
    var pType = "";
    var load = "";
    var propDetails = new Array();
    if (propArr.length > 0) {
        for (var i = 0; i < propArr.length; i++) {
            propDetails = propArr[i].split("=");
            if (propDetails[0] == 'type') {
                temp = propDetails[1];
                if (temp.startsWith('t')) {
                    hlTipUrl = "tstruct.aspx?act=open&transid=";
                    pType = "t";
                } else if (temp.startsWith('i')) {
                    hlTipUrl = "ivtoivload.aspx?ivname=";
                    pType = "i";
                }
            } else if (propDetails[0] == 'name') {
                hlTipUrl = hlTipUrl + propDetails[1] + `&openerIV=${typeof isListView != "undefined" ? iName : propDetails[1]}&isIV=${typeof isListView != "undefined" ? !isListView : "false"}`;
                structName = propDetails[1];
            } else if (propDetails[0] == 'popup') {
                openWin = propDetails[1];
            } else if (propDetails[0] == 'refresh') {
                refresh = propDetails[1];
            } else if (propDetails[0] == 'load') {
                load = propDetails[1];
            } else if (propDetails[0] == 'param') {
                CreatParamUrl(propArr[i]);
            }
        }
    }

    hlTipProps = pType + "," + load + "," + openWin;

    if (pType == "t" && structName != "" && load.startsWith("t")) {
        try {
            ASB.WebService.GetRecordId(structName, hlTipParamXml, SuccessGetRecId, OnException);
        } catch (e) { }
    } else {
        GetUrl();
    }
}

function SuccessGetRecId(result, eventArgs) {
    var rId = "0";
    if (result != "") {
        var xmlDoc = $j.parseXML(result),
            xml = $j(xmlDoc);
        if (xml.find("recordid").length > 0)
            rId = xml.find("recordid").text();
    }
    GetUrl(rId);
}

function GetUrl(rId) {

    var pType = "";
    var load = "";
    var openWin = "";
    if (hlTipProps != "") {
        var strHlProps = hlTipProps.split(",");
        pType = strHlProps[0];
        load = strHlProps[1];
        openWin = strHlProps[2];
    }

    if (hlTipUrl != "") {

        if (pType == "t" && rId != undefined && rId != "0" && load.startsWith("t"))
            hlTipUrl += '&recordid=' + rId;
        else
            hlTipUrl += hlTipParmUrl;

        if (openWin.startsWith('t')) {
            var newWindow;
            try {
                newWindow = window.open(hlTipUrl, 'MyPopUp', 'resizable=yes');
            } catch (ex) {
                showAlertDialog("warning", eval(callParent('lcm[356]')));
            }
        } else
            window.document.location.href = hlTipUrl;
    }
}

function CreatParamUrl(temp) {

    var pType = "";
    if (hlTipProps != "") {
        var strHlProps = hlTipProps.split(",");
        pType = strHlProps[0];
    }
    hlTipParmUrl = "";
    var stPos = temp.indexOf("param=");
    if (stPos != -1) {
        var enPos = temp.indexOf("=");
        temp = temp.substring(6, temp.length);
    }
    arrParam = temp.split("~");
    if (arrParam.length > 0) {
        for (var k = 0; k < arrParam.length; k++) {
            var stPos = arrParam[k].indexOf("=");
            var fldName = arrParam[k].substring(stPos + 1, arrParam[k].count);
            var param = arrParam[k].substring(0, stPos)
            if (fldName.startsWith(':')) {
                fldName = fldName.substring(1, fldName.length)
                var isGridDc = IsGridField(fldName);
                var val = "";
                if (IsGridField(fldName)) {
                    var actRowNo = GetRowNoHelper(AxActiveRowNo);
                    var fld = fldName + actRowNo + "F" + AxActiveDc;
                    val = GetFieldValue(fld);
                } else {
                    var frameNo = GetDcNo(fldName);
                    var fld = fldName + "000F" + frameNo;
                    val = GetFieldValue(fld);
                }
            } else if (fldName.startsWith('{')) {
                if (fldName.indexOf("{") != -1)
                    fldName = fldName.replace('{', '');
                if (fldName.indexOf("}") != -1)
                    fldName = fldName.replace('}', '');

                if (fldName.endsWith("*d"))
                    val = fldName.substring(0, fldName.length - 2)
                else
                    val = fldName;
            } else {
                val = fldName;
            }
            hlTipParamXml = hlTipParamXml + "<" + param + ">" + val + "</" + param + ">";
            if (pType == "i" && val != "")
                hlTipUrl = hlTipUrl + '&' + param + '=' + val;
            else if (val != "")
                hlTipParmUrl = hlTipParmUrl + '&' + param + '=' + val;
        }
    }
}

function GetSetTtipHgt(status) {
    var dvTooltip = $j("#dvInnerTip");
    var dvtip = $j("#dvTip");
    if (status == "new") {
        if (dvTooltip.height() < 50) {
            dvTooltip.height("50");
        }
        if (dvTooltip.width() < 100) {
            dvTooltip.width("100");
        }
        if (dvtip.height() < 50) {
            dvtip.height("50");
        }
        if (dvtip.width() < 100) {
            dvtip.width("100");
        }
    } else {
        dvTooltip.css("height", "auto");
        dvTooltip.css("width", "auto");
        dvtip.css("height", "auto");
        dvtip.css("width", "auto");
    }
}
var tmpFldName = "";
//Function to get the picklist data and display it in the picklist div.
function DisplayPickList(obj) {
    ShowDimmer(true);
    AxWaitCursor(true);
    var fldProps = obj.attr("id").split("~");
    var i;
    if (fldProps.length == 2)
        i = 1;
    else
        i = 0;

    var fldName = fldProps[i].substring(0, fldProps[i].lastIndexOf("F") - 3);
    var fldValue = "";
    var pickFld = $j("#" + fldProps[i]);
    //The below condition will not open picklist if the picklist field is made readonly
    if (pickFld.attr("readonly") != undefined || pickFld.attr("disabled") != undefined) {
        ShowDimmer(false);
        AxWaitCursor(false);
        return;
    }

    if (pickFld.length > 0) {
        AxOldValue = pickFld.val();
        fldValue = pickFld.val(); //pickFld.value;
    }

    totalPLRows = 0;
    curPageNo = 1;

    var hdn = $j("#hdnPickFldId");
    if (obj.attr("id").indexOf("~") == -1)
        hdn.val("img~" + obj.attr("id"));
    else
        hdn.val(obj.attr("id"));
    AxFromAssociated = true;
    GetPickListData(fldName, fldValue, curPageNo.toString(), pageSize.toString(), fldProps[i]);
}

//Function to position and show the div containing the picklist data.
function ShowPickList() {
    //hide picklist next/prev loader
    $j("#pickDimmer").css("display", "none");
    var hdn = $j("#hdnPickFldId");
    var objId = hdn.val();
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
    var isDcGrid = IsDcGrid(divFrameNo);

    dv.width(wdth);
    dv.show();
    //If it's a scroll div,set the position of the left scroll value
    var scrollleft = $(".dvheightframe ").scrollLeft();
    var scrollTop = $(".dvheightframe ").scrollTop();
    //if (!isDcGrid) {
    //    if (scrollTop > 0) {
    //        var tmpHgt = (iY - plHgt - scrollTop - 18);
    //        var tmpTop = parseInt((tmpHgt - 0), 10);
    //        if (tmpTop > 0)
    //            dv.css("top", tmpTop + 'px');
    //        else
    //            dv.css("top", (iY + 5) + 'px');
    //    }
    //    else
    //        dv.css("top", (iY - 69) + 'px');

    //    if (scrollleft > 0) {
    //        var slValue = (iX - wdth - scrollleft);
    //        var clientWidth = $j("#divDc" + divFrameNo).width() + 20;
    //        var scrollWidth = 0;
    //        var popupScrollWidth = (slValue + 200);
    //        if (clientWidth < popupScrollWidth)
    //            scrollWidth = popupScrollWidth - clientWidth;
    //        var leftV = parseInt((slValue - scrollWidth), 10);
    //        if (leftV > 0)
    //            dv.css("left", leftV + 'px');
    //        else
    //            dv.css("left", '0px');
    //    }
    //    else
    //        dv.css("left", (iX - wdth) + 'px');
    //} else {
    if (axInlineGridEdit)
        scrollTop = scrollTop - 36; //calculating picklist position for inline grid
    var top = (pickFld.offset().top - pickFld.parents('.' + (axInlineGridEdit ? 'input' : 'form') + '-group').outerHeight()) + scrollTop;
    dv.css("top", top + 'px');
    dv.css("left", pickFld.offset().left + 'px');
    //}


    // CheckHeight(iY + 5, 205);
    if ($("#dvPickList .pickLstResultCntnr").length > 0) {
        if ($("#dvPickList .pickLstResultCntnr").offset().top + $("#dvPickList .pickLstResultCntnr").outerHeight() - $(".dvheightframe").offset().top > $(".dvheightframe").outerHeight()) {
            $(".dvheightframe").animate({
                scrollTop: (($("#dvPickList .pickLstResultCntnr").offset().top + $("#dvPickList .pickLstResultCntnr").outerHeight() - $(".dvheightframe").offset().top) - ($(".dvheightframe").outerHeight())) + ($(".dvheightframe").scrollTop())
            }, 100);
        }
    }
}

function CheckHeight(top, dvHgt) {
    var frm = $j("#middle1", parent.document);
    var docHgt = document.body.offsetHeight;
    var totHgt = top + dvHgt;
    if (totHgt > docHgt) {
        docHgt = docHgt + (totHgt - docHgt);
        frm.height(docHgt + 10);
    }
}

//Function to call the service to get the filtered picklist data.
function GetPickListData(fldName, value, pageNo, pageSize, objId) {
    currentPickList = objId;
    //initialise the search value
    initialSrchVal = value;
    var includeDcs = "";
    if (arrRefreshDcs.length > 0) {
        for (var i = 0; i < arrRefreshDcs.length; i++) {
            var arrDcNos = arrRefreshDcs[i].split(':');
            includeDcs = arrDcNos[1].replace("dc", "") + ',' + arrDcNos[0].replace("dc", "");

        }
    }
    value = CheckSpecialCharsInStr(value);
    var fldDcNo = GetFieldsDcNo(objId);

    AxActiveRowNo = parseInt(GetFieldsRowNo(objId), 10);
    AxActiveRowNo = GetDbRowNo(AxActiveRowNo, fldDcNo);
    var activeRow = AxActiveRowNo;

    var parStr = "";
    if (AxActivePRow != "" && AxActivePDc != "")
        parStr = AxActivePDc + "~" + AxActivePRow;

    var subStr = "";
    if (IsParentField(fldName, fldDcNo)) {
        //for each subgrid, get the sub grid rows for the given parent row and send this info
        subStr = GetSubGridInfoForParent(fldDcNo, AxActiveRowNo);
    }

    try {
        ASB.WebService.GetSearchResult(ChangedFields, ChangedFieldDbRowNo, ChangedFieldValues, DeletedDCRows, fldName, value, pageNo.toString(), pageSize.toString(), tstDataId, fldDcNo, activeRow, parStr, subStr, includeDcs, SuccGetSearchResult, OnException);
    } catch (exp) {
        AxWaitCursor(false);
        ShowDimmer(false);
        var execMess = exp.name + "^♠^" + exp.message;
        showAlertDialog("error", 2030, "client", execMess);
    }
}

// function to construct td id
function GetTdFrameNo() {
    var hdn = $j("#hdnPickFldId");
    var objId = hdn.val();
    var divFrameNo = GetFieldsDcNo(objId);
    return divFrameNo;
}
var pickStatus = true;
var selectedRow = 0;
//Success function which parses the result and dynamically creates inner html for the picklist div.
function SuccGetSearchResult(result, eventArgs) {
    if (CheckSessionTimeout(result))
        return;
    var hdnFilter = $j("#hdnFiltered");
    var resultArr;
    hdnFilter.val("true");

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
            tableStr = "<table id='tblPickData'  data-pick='" + currentPickList + "' class='pickGridData'>";
            for (var i = 0; i < resultArr.length; i++) {
                var tdId = "axPickTd00" + (i + 1) + 'F' + GetTdFrameNo();
                var pickValue = CheckSpecialCharsInHTML(resultArr[i]);
                if (resultArr[i].toString().indexOf("^") != -1) {
                    var displayText = resultArr[i].toString().split('^')[1];

                    tableStr += "<tr><td id =" + tdId + " onclick='javascript:SetPickVal(\"" + pickValue + "\")' class='handCur'><a>" + displayText + "</td></tr>";
                } else {
                    displayText = resultArr[i].toString();
                    if (pickValue.indexOf("\\") != -1) {
                        pickValue = pickValue.replace("\\", "\\\\");
                        tableStr += "<tr><td id =" + tdId + " onclick='javascript:SetPickVal(\"" + pickValue + "\")' class='handCur' ><a>" + displayText + "</td></tr>";
                    } else {
                        tableStr += "<tr><td id =" + tdId + " onclick='javascript:SetPickVal(\"" + pickValue + "\")' class='handCur'><a>" + displayText + "</td></tr>";
                    }
                }
            }

            if (dv.length > 0)
                dv.html(tableStr);

            if ($j("#tblPickData tr").length > 0) {
                $j("#tblPickData tr:nth-child(1)").addClass('active');
            }

        } else {
            if (dv.length > 0) {
                var cutMsg = eval(callParent('lcm[0]'));
                dv.html("<span>" + cutMsg + "</span>");
            }
        }
        SetPrevNextLinks();
        document.getElementById('advancebtn').style.visibility = 'visible';
        document.getElementById('advancesrch').style.visibility = 'visible';
    } else {
        tableStr = "<table style='width:100%;height:auto;' id='tblPickData' cellpadding='1' cellspacing='1'>";
        //tableStr += "<tr><td></td><td align='right' class='hdrRow'><img class='curHand' src='../AxpImages/icons/close-button.png' alt='Close' onclick=\"javascript:HidePLDiv(true);\"/></td></tr>";
        tableStr += "</table>";
        document.getElementById('advancebtn').style.visibility = 'hidden';
        document.getElementById('advancesrch').style.visibility = 'hidden';
        var cutMsg = eval(callParent('lcm[0]'));
        tableStr += "<span style=\"font-size: 12px;\">" + cutMsg + "</span>";
        TogglePrevNextLink("none");
        var dv = $j("#dvPickHead");
        if (dv.length > 0)
            dv.html(tableStr);
    }
    pickListRowCount = $j("#tblPickData tbody tr").length;
    if (pickListRowCount > 1) {
        $j(".inputClass2").keydown(function (e) {
            if (e.which == 40) { // down arrow
                if (selectedRow < pickListRowCount) {
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
                        //$j('#dvPickHead').scrollTop((rowTotHgt - dvHgt) + 20);
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
                    for (var i = pickListRowCount; i >= selectedRow; i--) {
                        rowTotHgt += $j("#tblPickData tr:nth-child(" + i + ")").height();
                    }
                    var dvHgt = 0;
                    dvHgt = $j('#dvPickHead').height();
                    if ((rowTotHgt + 10) > dvHgt) {
                        var tmpRowNo = selectedRow - 1;
                        $j('#dvPickHead').scrollTop($j("#tblPickData tr:nth-child(" + tmpRowNo + ")").height());

                    }
                }
            } else if (e.which == 39) { // right arrow
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
                HidePLDiv(false);
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
                    SetPickVal(selcteditm);
                    pickStatus = false;
                }
                selectedRow = 0;
            }
        }
        e.which = -1;
    });
    $j(document).click(function (e) {
        if (e.target.id != 'nextPick' && e.target.id != 'prevPick' && e.target.className != 'curHand' && e.target.className != 'hdrRow') {
            //show picklist next/prev loader
            if (e.target.parentElement.id == 'nextPick' || e.target.parentElement.id == 'prevPick') {
                $j("#pickDimmer").css("display", "block");
            } else {
                HidePLDiv(false);
            }

            selectedRow = 0;
        }
    });
    currentPickList = "";
    ShowPickList();
    ShowDimmer(false);
    AxWaitCursor(false);
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

function HidePLDiv(setFocus) {

    if (setFocus == true) {
        var hdn = $j("#hdnPickFldId");
        var objId = hdn.val();
        if (objId != "" && objId.indexOf("~") != -1) {
            var fldProps = objId.split("~");
            var fldName = "#" + fldProps[1];
            var fld = $j(fldName);
            fld.focusNextInputField();
        }
    }

    var dv = $j("#dvPickList");
    if (dv.length > 0)
        dv.hide();

}


$j.fn.focusNextInputField = function () {
    return this.each(function () {
        setTimeout(function () {
            var focusElem = $(this);
            if (axInlineGridEdit && !$($(focusElem).closest("div")).hasClass("form-group"))
                var fields = $j(focusElem).parents('input:eq(0),body').find('button,input[type!="hidden"],textarea,select');
            else
                var fields = $j(focusElem).parents('form:eq(0),body').find('button,input[type!="hidden"],textarea,select');
            var index = fields.index(focusElem);
            if (index > -1 && (index + 1) < fields.length) {

                var fld = fields.eq(index + 1); //togCol
                var isDisabled = fld.prop("disabled");
                if (isDisabled == true || isDisabled == "disabled" || fld.prop("class") == "togCol") {
                    fields.eq(index + 1).focusNextInputField();
                } else {
                    if (axInlineGridEdit && !$(focusElem.closest("div")).hasClass("form-group")) {
                        var dataindex = fields.eq(index).closest("td").attr("data-focus-index");
                        var lastFocusIndex = fields.eq(index).closest("tr").attr("last-focus-index");
                        if (lastFocusIndex != dataindex) {
                            dataindex = parseInt(dataindex) + 1;
                        }
                        $j(focusElem).parents('input:eq(0),body').find("td[data-focus-index='" + dataindex + "']").find("input").focus();

                    } else if (!isMobile)
                        fields.eq(index + 1).focus();
                }
            }
            return false;
        }, 0);
    });
};

//Function to get the next or prev page records in picklist dropdown.
function GetData(str) {

    if (str == "prev" && curPageNo > 1) {
        curPageNo = curPageNo - 1;
    } else if (str == "next" && curPageNo < noOfPLPages) {
        curPageNo = curPageNo + 1;
    }

    var hdn = $j("#hdnPickFldId");
    if (hdn.length > 0) {
        var objId = hdn.val();
        if (objId != "" && objId.indexOf("~") != -1) {
            var fldProps = objId.split("~");
            var fldName = fldProps[1].substring(0, fldProps[1].lastIndexOf("F") - 3);
            var fldValue = $j("#" + fldProps[1]).val();

            GetPickListData(fldName, fldValue, curPageNo.toString(), pageSize.toString(), fldProps[1]);
        }
    }
}

//TO hide or show the next and prev buttons in the picklist div.
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

//Function to set the selected value in the picklist field.
function SetPickVal(pickVal) {
    var hdn = $j("#hdnPickFldId");
    if (hdn) {
        var objId = hdn.val();
        var fldProps = objId.split("~");
        var i;
        if (fldProps.length > 1)
            i = 1;
        else
            i = 0;

        var fldName = fldProps[i];
        var fld = $j("#" + fldName);
        var pickFld = $j("#pickfld000F0");
        pickFld.val(fldName);
        if (pickVal.indexOf("^") != -1) {
            var rowFrmNo = GetFieldsRowFrameNo(fldName);
            var pickId = $j("#pickIdVal_" + fldName);
            var picStr = pickVal.split("^");
            pickId.val(picStr[0]);
            pickVal = picStr[1];
        }

        pickVal = RepSpecialCharsInHTML(pickVal);
        fld.val(pickVal);
        try {
            fld.focus();
        } catch (ex) { }

        AxFromAssociated = true;
    }

    HidePLDiv(false);
}


//Function to open the old picklist pop up on click of Advanced link in the picklist div.
function CallSearchOpen() {
    //Not to enter in mainfocus twice in chrome
    if (window.chrome)
        $j("#HdnAxAdvPickSearch").val("true");
    ShowDimmer(true);
    AxWaitCursor(true);
    HidePLDiv(false);
    if ($j("#hdnPickFldId")) {
        var fldId = $j("#hdnPickFldId").val();
        var imgObj = $j("#" + fldId);
        $j(".pickimg").each(function () {
            if ($j(this).attr("id") == fldId) {
                imgObj = $j(this);
            }
        });

        if (imgObj.length > 0) {
            SearchOpen(imgObj);
        }
    }
    AxWaitCursor(false);
}


//<Module>  FormControl </Module>
//<Author>  Naveen  </Author>
//<Description> Function to change the property of the dependency controls based on the paricular action of a field </Description>
//<Return> Changes the property of the dependency control </Return>
// 1 - Enable Field, 2 - Disable Field, 3 - SetValue, 4 - Show DC, 5 - Hide DC(its not really hide, rather disable,
// 6 - Enable Field and Editable, 7 - Enable Field but not editable? TODO: check this case
// 8 - Hide (DC or Field), 9 - Show (DC or Field)
// 10 - hidepopdc, 11 - showpopdc
var fcontrols = new Array();
var found = false;
var process = false;
var fc = 0;
var ch, strch, cmdfchar;
var cresult = true;
var cond = '';
var skip;
var fld;
var count = 0;
var cont = false;
var fldExtn = "";
var isobject = false;
var btnObject = false;
var firstFldDc = "NONGRID";
var secFldDc = "NONGRID";
var isFieldBtn = false;
var arrVisibleTabDcs = new Array();

function DoFormControl(componentName) {

    var v;
    var fName = GetFieldsName(componentName);
    var dcNo = GetFieldsDcNo(componentName);
    var rowNo = GetFieldsRowNo(componentName);
    var isGrid = IsDcGrid(dcNo);
    fldExtn = rowNo + "F" + dcNo;
    if (isGrid)
        firstFldDc = "GRID";
    else
        firstFldDc = "NONGRID";


    if (fcontrols.length == 0) {

        for (var m = 0; m < Formcontrols.length; m++) {
            var s = Formcontrols[m];
            if (s.startsWith('f')) {
                v = s.substr(1, s.length);
                fcontrols[fc] = v;
                fc++;
            }
        }
    }

    found = false;
    for (var k = 0; k < fcontrols.length; k++) {
        if (fcontrols[k] == fName) {
            found = true;
            break;
        }
    }
    process = false;

    if (found) {
        EvaluateFormControl(fName);
    }
}

function AddVisTabDcsInArray() {
    var cnt = PagePositions.length;
    for (var i = 0; i < cnt; i++) {
        arrVisibleTabDcs.push("");
    }
}

function DoFormControlOnload() {
    var isgrid = false;

    if (fcontrols.length == 0) {
        for (var m = 0; m < Formcontrols.length; m++) {
            var s = Formcontrols[m];
            if (s.startsWith('f')) {
                v = s.substr(1, s.length);
                fcontrols[fc] = v;
                fc++;
            }
        }
    }

    try {
        var rId = $j("#recordid000F0").val();
        if (rId == "") rId = "0";
        for (var k = 0; k < fcontrols.length; k++) {
            if ((rId == "0" && fcontrols[k] == "_On Form Load") || (rId != "0" && fcontrols[k] == "_On Data Load"))
                EvaluateFormControl(fcontrols[k]);

        }
    } catch (ex) {
        console.log(ex.message);
    }
}

function EvaluateFormControl(fName) {



    for (var j = 0; j < Formcontrols.length; j++) {

        ch = Formcontrols[j];
        strch = ch;
        ch = ch.split('');
        if (strch.startsWith("10") || strch.startsWith("11") || strch.startsWith("12"))
            cmdfchar = ch[0] + ch[1];
        else
            cmdfchar = ch[0];
        if (cmdfchar == "1" && ch.length > 1 && (ch[1] == "0" || ch[1] == "1") && ch[2] == "d" && ch[3] == "c") {
            cmdfchar = ch[0] + ch[1];
            fldname = strch.substr(2, strch.length);
        } else if (cmdfchar == "10" || cmdfchar == "11" || cmdfchar == "12") {
            fldname = strch.substr(2, strch.length);
        } else {
            fldname = strch.substr(1, strch.length);
        }

        if ((cmdfchar == 'f') && (fldname == fName)) {
            process = true;
            continue;
        }

        if ((cmdfchar == 'e') && (process == true)) {
            process = false
            continue;
        }

        if (process == false)
            continue;

        var IndexValue = 0;
        if ((cmdfchar == 3) && (cresult == true)) {
            j = j + 1;
            var result = Formcontrols[j];
            result = result.substring(1, result.length);
            if (result == "''") result = "";
            var ch = result.split('');
            var got = "No";
            if (ch[0] == ":") {
                got = "yes";
                result = result.substring(1, result.length);
                result = GetComponentName(GetExactFieldName(result), fldExtn);
                var srcFld = $j("#" + result);

                if (srcFld.length > 0) {
                    result = GetFieldValue(result);
                } else
                    continue;
            }
            CallProcessFormControl(fldname, fldExtn, "3", result);
        } else if ((cmdfchar == 12) && (cresult == true)) {
            j = j + 1;
            var result = Formcontrols[j];
            result = result.substring(2, result.length);
            if (result == "''") result = "";
            var ch = result.split('');
            var got = "No";
            if (ch[0] == ":") {
                got = "yes";
                result = result.substring(1, result.length);
                result = GetComponentName(GetExactFieldName(result), fldExtn);
                var srcFld = $j("#" + result);

                if (srcFld.length > 0) {
                    result = GetFieldValue(result);
                } else
                    continue;
            }
            CallProcessFormControl(fldname, fldExtn, "12", result);
        } else if ((cmdfchar == 1 || cmdfchar == 2 || cmdfchar == 4 || cmdfchar == 5 || cmdfchar == 6 || cmdfchar == 7 || cmdfchar == 8 || cmdfchar == 9 || cmdfchar == 10 || cmdfchar == 11) && (cresult == true)) {

            CallProcessFormControl(fldname, fldExtn, cmdfchar.toString());
        } else if (cmdfchar == 'c') {

            if (fldname == 'if') {
                count = 0;
                try {
                    cresult = Getcondition(j);
                    skip = cresult;

                    if (skip)
                        count = 1;
                    j += 3;
                } catch (e) { }

            } else if (fldname == "elseif") {

                if (skip) {
                    cresult = false;
                    count = 3;
                } else {
                    cresult = (!cresult);
                }
                if (cresult) {
                    cresult = Getcondition(j);
                    skip = cresult;

                    if (skip)
                        count = 2;
                }
                j += 3;
            } else if (fldname == 'else') {

                if (skip == true)
                    cresult = false;
                else
                    cresult = (!cresult);

                skip = cresult;

            } else if (fldname == 'and') {

                cresult = cresult && Getcondition(j);

                if (count == 1) {
                    if (count == 1 && cresult == false)
                        skip = false;
                }

                if (count == 2) {
                    if (count == 2 && cresult == true)
                        skip = true;
                    else
                        skip = false;
                }

                if (count == 3) {
                    skip = true;
                }
                j += 3;
            } else if (fldname == 'or') {
                //continue;
                cresult = cresult || Getcondition(j);

                if (count == 1) {
                    if (count == 1 && cresult == false)
                        skip = false;
                }

                if (count == 2) {
                    if (count == 2 && cresult == true)
                        skip = true;
                    else
                        skip = false;
                }

                if (count == 3) {
                    skip = true;
                }
                j += 3;

            } else if (fldname == 'end') {
                cresult = true;
                skip = false;
            }
        }
    }
}

//Function to get the component name of the field on which the formcontrol should be applied,
//and to call formcontrol based on the dc type.
function CallProcessFormControl(fldName, fldExtn, actionStr, fldValue) {

    if (actionStr == "4" || actionStr == "5" || (fldName.substring(0, 2) == "dc" && (actionStr == "8" || actionStr == "9" || actionStr == "10" || actionStr == "11"))) {
        ProcessFormControl(fldName, actionStr, fldValue);
    } else {

        fldName = GetExactFieldName(fldName);
        var conFldDcNo = GetDcNo(fldName);
        var isGrid = IsDcGrid(conFldDcNo);
        if (isGrid)
            secFldDc = "GRID";
        else
            secFldDc = "NONGRID";


        if ((firstFldDc == "NONGRID" && secFldDc == "NONGRID") || (firstFldDc == "GRID" && secFldDc == "NONGRID")) {
            fldName = fldName + "000F" + conFldDcNo;
            ProcessFormControl(fldName, actionStr, fldValue);
        } else if (firstFldDc == "NONGRID" && secFldDc == "GRID") {
            var rCnt = GetDcRowCount(conFldDcNo);
            for (var i = 1; i <= rCnt; i++) {
                var newrow = GetRowNoHelper(i);
                var tmpFldName = fldName + newrow + "F" + conFldDcNo;
                ProcessFormControl(tmpFldName, actionStr, fldValue);
            }
        } else if (firstFldDc == "GRID" && secFldDc == "GRID") {
            var clientRowNo = GetClientRowNo(AxActiveRowNo, conFldDcNo);
            fldName = fldName + clientRowNo + "F" + conFldDcNo;
            ProcessFormControl(fldName, actionStr, fldValue);
        } else {
            fldName = fldName;
            ProcessFormControl(fldName, actionStr, fldValue);
        }
    }
}

//Function to perform SetValue or fieldAccess on the given field based on the command.
function ProcessFormControl(fld, actionStr, fldValue) {

    isFieldBtn = false;
    if (fld.indexOf(".") != -1)
        fld.replace(".", "\\.");

    var destfld = $j("#" + fld);
    if (actionStr == "4" || actionStr == "5" || (fld.substr(0, 2) == "dc" && (actionStr == "8" || actionStr == "9" || actionStr == "10" || actionStr == "11"))) {
        var dcName = fld.substr(2);
        destfld = $j("#DivFrame" + fld.toString().substring(2));
        if (destfld.length == 0) {
            if ($j.inArray(dcName, TabDCs) != -1) {
                destfld = $j("#ank" + dcName);
            }
        }
    }
    var fldRowNo = GetFieldsRowNo(fld);
    var fldDcNo = GetFieldsDcNo(fld);
    var fldDbRowNo = GetDbRowNo(fldRowNo, fldDcNo);

    var isFldSaveBtn = false;

    if (destfld.length <= 0) {
        //check if the field is button, by removing the rowno and dc number
        var newFldName = fld;
        if (fld.toString().indexOf("F") != -1)
            newFldName = fld.substring(0, fld.lastIndexOf("F") - 3);

        $j(".axpBtn,.axpBtnCustom").each(function () {
            if ($j(this).attr("id") == newFldName) {
                destfld = $j(this);
                isFieldBtn = true;
                return false;
            }
        });

        var actTmpBtn;
        $j(".action img").each(function () {
            if ($j(this).attr("id") == newFldName) {
                actTmpBtn = $j(this);
                isFieldBtn = true;
                return false;
            }
        });

        //AxpTstBtn
        var actTmpBtn;
        var isBtnInDc = false;
        $j(".AxpTstBtn input,img").each(function () {
            if ($j(this).attr("value") == newFldName || $j(this).attr("id") == "AxpTstBtn_" + newFldName) {
                actTmpBtn = $j(this);
                isFieldBtn = true;
                isBtnInDc = true;
                return false;
            }
        });

        if (newFldName.toLowerCase() == "remove")
            newFldName = "delete";
        else if (newFldName.toLowerCase() == "list view")
            newFldName = "listview";
        else if (newFldName.toLowerCase() == "new")
            newFldName = "add";

        if (newFldName.toLowerCase() == "save")
            isFldSaveBtn = true;

        var sfnewFldName = newFldName;
        if (sfnewFldName.toLowerCase() == "listview")
            sfnewFldName = "list view";
        $j("#icons").find("a").each(function () {
            if (typeof $j(this).attr("title") != "undefined" && $j(this).attr("class") == newFldName.toLowerCase() || (typeof btnName !== 'undefined' && $j(this).text() == btnName)) {
                destfld = $j(this);
                isFieldBtn = true;
                return false;
            } else if (typeof $j(this).attr("title") != "undefined" && $j(this).attr("title").toLowerCase() == sfnewFldName.toLowerCase() || (typeof btnName !== 'undefined' && $j(this).text() == btnName)) {
                destfld = $j(this);
                isFieldBtn = true;
                return false;
            }
        });

        $j(".toolbarRightMenu").find("a").each(function () {
            if (typeof $j(this).attr("title") != "undefined" && $j(this).attr("title").toLowerCase() == sfnewFldName.toLowerCase() || (typeof btnName !== 'undefined' && $j(this).text() == btnName)) {
                destfld = $j(this);
                isFieldBtn = true;
                return false;
            }
        });

        //condition to check prev and next button in list view header
        if (!isFieldBtn) {
            $j("#nextprevicons").find("a").each(function () {
                if ($j(this).attr("class") == newFldName.toLowerCase()) {
                    destfld = $j(this);
                    isFieldBtn = true;
                }
            });
        }
        if (!isFieldBtn) {
            $j(".tstructMainBottomFooter").find("a").each(function () {
                if ($j(this).attr("id").toLowerCase() == newFldName.toLowerCase()) {
                    destfld = $j(this);
                    isFieldBtn = true;
                }
            });
        }

        if (!isFieldBtn) {
            $(".toolbarRightMenu .menu-item a").each(function () {
                if (typeof $j(this).attr("id") != "undefined" && ($j(this).attr("id").toLowerCase() == newFldName.toLowerCase()) || (typeof $j(this).attr("title") != "undefined" && $j(this).attr("title").toLowerCase() == sfnewFldName.toLowerCase() || (typeof btnName !== 'undefined' && $j(this).text() == btnName))) {
                    destfld = $j(this);
                    isFieldBtn = true;
                }
            });
        }


        if (actTmpBtn != undefined && actTmpBtn.length > 0)
            destfld = actTmpBtn.parent(0);
        if (isBtnInDc)
            destfld = actTmpBtn;
    }

    // 1 - Enable Field, 2 - Disable Field, 3 - SetValue, 4 - Show DC, 5 - Hide DC(its not really hide, rather disable,
    // 6 - Enable Field and Editable, 7 - Enable Field but not editable? TODO: check this case
    // 8 - Hide (DC or Field), 9 - Show (DC or Field)
    // 10 - hidepopdc, 11 - showpopdc
    if (destfld.length > 0) {
        switch (actionStr) {
            case ("1"):
                if (isFieldBtn) {
                    if (isFldSaveBtn)
                        EnableSaveBtn(true);
                    else
                        EnableDisableBtns(destfld, true);
                } else {

                    if (IsPickListField(destfld.attr("id")) == true) {
                        var pickFld = document.getElementById("img~" + destfld.attr("id"));
                        pickFld.disabled = false;
                        pickFld.className = "input-group-addon handCur pickimg";
                    }


                    if (destfld.val() == 0 && destfld.prop("type") != "select-one")
                        destfld.val("");

                    if (destfld.attr("title") == dateString && destfld.val() == "")
                        destfld.val(dateString);
                    if (destfld.attr("type") == "checkbox") {
                        var checlistid = destfld.attr("id");

                        EnableDisableCheckbox(checlistid, false)
                    } else {

                        // for enabling the Rich Text Box If it is disabled on dataload using form control
                        if (destfld.attr("id").startsWith("rtf_") || destfld.attr("id").startsWith("rtfm_") || destfld.attr("id").startsWith("fr_rtf_") || GetDWBFieldType(GetFieldsName(destfld.attr("id"))) == "Rich Text") {
                            $j("#cke_" + destfld.attr("id")).prop("disabled", false);
                            destfld.css("display", "none");
                            $j("#cke_" + destfld.attr("id")).removeAttr("disabled");
                        }
                        if (destfld.attr("class") == "axpImg") {
                            destfld.attr("onclick", null);
                        }
                        destfld.prop("disabled", false);
                        destfld.prop("readOnly", false);
                        destfld.removeAttr("readOnly");
                        SetAutoCompAccess("enabled", destfld);

                    }
                }
                break;
            case ("2"):
                if (isFieldBtn) {
                    if (isFldSaveBtn)
                        EnableSaveBtn(false);
                    else
                        EnableDisableBtns(destfld, false);
                } else {
                    if (IsPickListField(destfld.attr("id")) == true) {
                        var pickFld = document.getElementById("img~" + destfld.attr("id"));
                        pickFld.disabled = true;
                        pickFld.className = "pickimg input-group-addon handCur";
                    }
                    if (destfld.attr("title") == dateString && (destfld.val() == dateString || destfld.val() == "''"))
                        destfld.val("");



                    if (destfld.attr("type") == "checkbox") {
                        var checlistid = destfld.attr("id");
                        EnableDisableCheckbox(checlistid, true)
                    } else {

                        // for disabling the Rich Text Box If it is disabled on dataload using form control
                        if (destfld.attr("id").startsWith("rtf_") || destfld.attr("id").startsWith("rtfm_") || destfld.attr("id").startsWith("fr_rtf_") || GetDWBFieldType(GetFieldsName(destfld.attr("id"))) == "Rich Text") {
                            $j("#cke_" + destfld.attr("id")).attr('disabled', 'disabled');
                            destfld.css("display", "none");
                            $j("#cke_" + destfld.attr("id")).prop("readonly", true);
                        }
                        if (destfld.attr("class") == "axpImg") {
                            destfld.attr("onclick", "callnull");
                        }
                        try {
                            if (destfld.hasClass('selectTextArea')) {
                                var _thisdcNo = GetFieldsDcNo(destfld.attr("id"));
                                if (!IsDcGrid(_thisdcNo))
                                    destfld.prop("disabled", true);
                            } else
                                destfld.prop("disabled", true);
                        } catch (ex) {
                            destfld.prop("disabled", true);
                        }
                        //destfld.attr("readOnly", "readOnly");
                        SetAutoCompAccess("disabled", destfld);

                    }
                }
                break;
            case ("3"):
                var dcNo = GetDcNo(fldname);
                if ($j("#" + fld).hasClass("multiFldChk") && fldValue.trim() == "") {
                    if (IsDcGrid(dcNo)) {
                        $j("input[id=" + fld + "]").each(function () {
                            $j(this).removeAttr("checked");
                            $j(this).prop("checked", false);
                        });
                    } else {
                        try {
                            $("#" + fld).val("");
                            $("#" + fld).data("valuelist", "");
                            $("#" + fld).tokenfield('setTokens', []);
                        } catch (ex) { }
                    }
                } else {
                    CallSetFieldValue(fld, fldValue);
                }

                UpdateFieldArray(fld, fldDbRowNo, fldValue, "parent", "");
                break;
            case ("4"):
                if (fldname.substr(0, 2) == "dc") {
                    var dcNo = parseInt(fldname.substr(2, fldname.length), 10);
                    ShowingDc(dcNo, "enable");
                }
                break;
            case ("5"):
                if (fldname.substr(0, 2) == "dc") {
                    var dcNo = parseInt(fldname.substr(2, fldname.length), 10);
                    ShowingDc(dcNo, "disable");
                }
                break;
            //Enable
            case ("6"):
                if (isFieldBtn) {
                    if (isFldSaveBtn)
                        EnableSaveBtn(true);
                    else
                        EnableDisableBtns(destfld, true);
                } else {
                    if (IsPickListField(destfld.attr("id")) == true) {
                        var pickFld = document.getElementById("img~" + destfld.attr("id"));
                        pickFld.disabled = false;
                        pickFld.className = "input-group-addon handCur pickimg";
                    }
                    destfld.prop("disabled", false);
                    destfld.prop("readOnly", false);
                    if (!isFieldBtn)
                        destfld.removeClass("dis");
                    destfld[0].children[0].className = "handCur";
                }
                break;
            //Disable
            case ("7"):
                if (isFieldBtn) {
                    if (isFldSaveBtn)
                        EnableSaveBtn(false);
                    else
                        EnableDisableBtns(destfld, false);
                } else {
                    if (IsPickListField(destfld.attr("id")) == true) {
                        var pickFld = document.getElementById("img~" + destfld.attr("id"));
                        pickFld.disabled = true;
                        pickFld.className = "input-group-addon  pickimg";
                    }
                    destfld.prop("disabled", true);
                    destfld.prop("readOnly", false);
                    destfld.addClass("dis");
                    destfld[0].children[0].className = "";
                }
                break;
            case ("8"):
                if (fldname.substr(0, 2) == "dc") {
                    var dcNo = parseInt(fldname.substr(2, fldname.length), 10);
                    if (typeof isWizardTstruct != "undefined" && isWizardTstruct)
                        ToggleWizardDc(dcNo, "hide");
                    else
                        ShowingDc(dcNo, "hide");
                } else {
                    HideShowField(fldname, "hide");

                    //  var fieldName = GetFieldsName(fieldID);
                    var fldInd = GetFieldIndex(fldname);
                    var fldDType = GetDWBFieldType("", fldInd);
                    if (fldname.startsWith("axptm_") || fldname.startsWith("axpdbtm_") || (fldDType != "" && fldDType.toLowerCase() == "time")) {
                        //$(".ui-datepicker.ui-widget").css("display", "none");
                        $j("#" + destfld.attr("id") + " .tstOnlyTime").removeClass('hasDatepicker');
                        $j("#" + destfld.attr("id") + " .tstOnlyTime24hours").removeClass('hasDatepicker');
                    }
                }
                break;
            case ("9"):
                if (fldname.substr(0, 2) == "dc") {
                    var dcNo = parseInt(fldname.substr(2, fldname.length), 10);
                    if (typeof isWizardTstruct != "undefined" && isWizardTstruct)
                        ToggleWizardDc(dcNo, "show");
                    else
                        ShowingDc(dcNo, "show");
                } else {
                    HideShowField(fldname, "show");
                    //  var fieldName = GetFieldsName(fieldID);
                    var fldInd = GetFieldIndex(fldname);
                    var fldDType = GetDWBFieldType("", fldInd);
                    if (fldname.startsWith("axptm_") || fldname.startsWith("axpdbtm_") || (fldDType != "" && fldDType.toLowerCase() == "time")) {
                        //$(".ui-datepicker.ui-widget").css("display", "block");
                        $j("#" + destfld.attr("id") + " .tstOnlyTime").addClass('hasDatepicker');
                        $j("#" + destfld.attr("id") + " .tstOnlyTime24hours").addClass('hasDatepicker');
                    }
                }
                break;
            case ("10"):
                if (fldname.substr(0, 2) == "dc") {
                    var dcNo = parseInt(fldname.substr(2, fldname.length), 10);
                    ShowingDc(dcNo, "hidepopdc");
                }
                break;
            case ("11"):
                if (fldname.substr(0, 2) == "dc") {
                    var dcNo = parseInt(fldname.substr(2, fldname.length), 10);
                    ShowingDc(dcNo, "showpopdc");
                }
                break;
            case ("12"):
                var dcNo = GetDcNo(fldname);
                if (!IsDcGrid(dcNo)) {
                    if ($j("#" + fld).attr("type") == "checkbox")
                        $("label[for='" + fld + "'] span").text(fldValue);
                    else
                        $("label[for='" + fld + "']").text(fldValue);
                } else {
                    $("#gridHd" + dcNo + " th[id='th-" + fldname + "']").text(fldValue);
                    $("#wrapperForEditFields" + dcNo + " label[for='" + fld + "']").text(fldValue);
                }
                break;
            default:
                return;
        }
    } else {
        EnableDisableField(fld, actionStr, '0');

        //If the Dc to be enabled or disbaled is not available,
        //it is assumed to be a tab dc and the dc no along with the action is captured in the array.
        if ((actionStr == "4" || actionStr == "5") && fldname.substr(0, 2) == "dc") {
            var actn = "";
            if (actionStr == "4")
                actn = "enable";
            else
                actn = "disable";

            var dcNo = parseInt(fldname.substr(2, fldname.length), 10);

            var idx = $j.inArray(dcNo + "~" + actn, DisabledDcs);
            if (idx == -1)
                DisabledDcs.push(dcNo + "~" + actn);
        }
    }
    // if (typeof isWizardTstruct != "undefined" && isWizardTstruct)
    //     CheckWizardSaveButton();
}


function EnableDisableCheckbox(listID, Value) {
    $j("#chkAll_" + listID).prop("disabled", Value);
    $j("#chkAll_" + listID).attr("readOnly", Value);
    $j("input:checkbox[id='" + listID + "']").each(function () {
        $j(this).prop("disabled", Value);
        $j(this).attr("readOnly", Value);
    });

}

//If the field to be enabled or disable and if not avilabe adding these fields to an array
function EnableDisableField(fldName, action, status) {

    if (status == "1") {
        ProcessFormControl(fldName, action, '')
    } else {
        var idx = $j.inArray(fldName + "~" + action, AxFormContDisableFlds);
        if (idx == -1)
            AxFormContDisableFlds.push(fldName + "~" + action);
    }
}



function HideShowField(fldName, action) {
    var dcNo = GetDcNo(fldName);
    var fld = "";


    if (IsDcGrid(dcNo)) {
        if (action == "hide")
            $j("#th-" + fldName).hide();
        else
            $j("#th-" + fldName).show();
        var rowCnt = 0;
        rowCnt = GetDcRowCount(dcNo);
        try {
            let _fldIndex = GetFieldIndex(fldName);
            if (action == "hide") {
                FFieldHidden[_fldIndex] = "True";
            } else
                FFieldHidden[_fldIndex] = "False";
        } catch (ex) { }
        var eleType = getGridFldType(fldName, dcNo)
        for (var i = 1; i <= rowCnt; i++) {
            fld = $j("#" + fldName + GetClientRowNo(i, dcNo) + "F" + dcNo);
            if (fld.length > 0) {

                if (action == "hide") {
                    //fld.hide().attr("data-type", eleType);
                    fld.hide();
                    inputValue.css("display", "none");
                    fld.parent().hide();
                    var dataStyle = fld.attr("data-style");
                    if (dataStyle != undefined)
                        fld.attr("data-style", dataStyle.indexOf("display: inline") > 0 ? dataStyle.replace("display: inline;", "display: none;") : (dataStyle.indexOf("display: none") > 0 ? dataStyle : (dataStyle + "display: none;")));
                    if ($j("#dvGrid" + fldName).length)
                        $j("#dvGrid" + fldName).hide();
                    if (fld.closest(".gridElement").length)
                        fld.closest(".gridElement").hide();
                    if (!fld.parent().is('td') && fld.parent().parent().length > 0) {
                        if (fld.parent().parent().is('td'))
                            fld.parent().parent().hide();
                        else if (fld.parent().parent().parent().is('td'))
                            fld.parent().parent().parent().hide();
                    }
                } else {
                    //fld.show().attr("data-type", eleType);
                    fld.show();
                    fld.parent().show();
                    inputValue.css("display", "inline");
                    var dataStyle = fld.attr("data-style");
                    if (dataStyle != undefined)
                        fld.attr("data-style", dataStyle.indexOf("display: inline") > 0 ? dataStyle : (dataStyle + "display: inline;"))
                    if ($j("#dvGrid" + fldName))
                        $j("#dvGrid" + fldName).show();
                    if (fld.closest(".gridElement").length)
                        fld.closest(".gridElement").show();
                    if (!fld.parent().is('td') && fld.parent().parent().length > 0) {
                        if (fld.parent().parent().is('td'))
                            fld.parent().parent().show();
                        else if (fld.parent().parent().parent().is('td'))
                            fld.parent().parent().parent().show();
                    }
                }
            } else {
                var idx = $j.inArray(fldName + "~" + action, AxFormContHiddenFlds);
                if (idx == -1)
                    AxFormContHiddenFlds.push(fldName + "~" + action);
            }
        }
        // SetGridHeaderWidth(dcNo);
    } else {
        fld = $j("#dv" + fldName);
        try {
            let _fldIndex = GetFieldIndex(fldName);
            if (action == "hide") {               
                FFieldHidden[_fldIndex] = "True";
            } else
                FFieldHidden[_fldIndex] = "False";
        } catch (ex) { }
        if (fld.length > 0) {
            if (action == "hide")
                fld.addClass("d-none").parents(".grid-stack-item").addClass("d-none");
            else {
                fld.removeClass("d-none").parents(".grid-stack-item").removeClass("d-none");
                var fldInput = fld.find(':input');
                if (fldInput.css('visibility') == 'hidden') { }
                fldInput.css('visibility', '');
            }
        } else {
            var idx = $j.inArray(fldName + "~" + action, AxFormContHiddenFlds);
            if (idx == -1)
                AxFormContHiddenFlds.push(fldName + "~" + action);
        }
    }
}
var inputValue = "";

function getGridFldType(fldName, dcNo) {

    var rc = $("#gridHd" + dcNo + " tbody tr").length == 0 ? 1 : $("#gridHd" + dcNo + " tbody tr").length;
    inputValue = $j("#" + fldName + GetClientRowNo(rc, dcNo) + "F" + dcNo);
    var currentElement = inputValue.closest(".gridElement");
    eleType = "";
    if (currentElement.find('span.picklist').length > 0) {
        eleType = 'pickList';
        hiddenData = currentElement.find('span.picklist input[type = hidden]').attr('id') + '~' + currentElement.find('span.picklist input[type = hidden]').val();
    } else if (currentElement.find('input.grdAttach').length > 0) {
        eleType = 'gridattach';
        isAttachMentExist = true;
    } else if (currentElement.find('input.date').length > 0) {
        eleType = 'datepicker';
    } else if (inputValue.hasClass('fldFromSelect')) {
        inputValue.hasClass('fastdll') ? eleType = 'fromselect-select' : eleType = 'fromselect-pick';
        eleType = inputValue.hasClass('isrefreshsave') ? eleType + "~isrefreshsave" : eleType;

    } else {
        eleType = inputValue[0].nodeName.toLowerCase();
        (eleType == "input" && inputValue[0].type == "checkbox") ? eleType = "checkbox" : "";
        (eleType == "input" && inputValue.hasClass('number')) ? eleType = "numeric" : "";
    }
    return eleType;
}


//<Module>  FormControl </Module>
//<Author>  Naveen  </Author>
//<Description> Function to evaluate the if else condition statement </Description>
//<Return> Returns the evaluated result </Return>
var s;

function Getcondition(i) {

    var isfld = false;
    var expFldname1 = "";
    var fieldVal = '';
    s = Formcontrols[i + 1];
    var firstChar = s.substring(0, 1);
    if (firstChar == ":")
        s = s.substring(1, s.length);
    s = GetExactFieldName(s);
    fld = GetComponentName(s, fldExtn);

    cond = GetCondFldValue(fld);
    if (cond == "") cond = "''";

    var op = Formcontrols[i + 2];
    if (op == "et")
        op = "==";
    if (op == "net")
        op = "!=";
    if (op == "gt")
        op = ">";
    if (op == "lt")
        op = "<";
    if (op == "gtoet")
        op = ">=";
    if (op == "ltoet")
        op = "<=";

    cond = cond + op;
    //TODO:Need to handle the condition (:fieldname = :fieldname)
    s = Formcontrols[i + 3];
    var firstChar = s.substring(0, 1);
    if (firstChar == ":") {
        s = s.substring(1, s.length);
        s = GetExactFieldName(s);
        s = GetComponentName(s, fldExtn);
        s = GetCondFldValue(s);
    }
    s = TrimAll(s);
    s = s.replace(/\s/g, "");
    if (isNaN(s)) {
        s = s.replace(/\"/g, "");
        s = '"' + s + '"';
    }

    cond = cond + s;
    result = eval(cond);
    return result;
}

//
function GetComponentName(fieldName, fldExtn) {

    var fldDcNo = GetDcNo(fieldName);
    var isGrid = IsDcGrid(fldDcNo);

    if (fldExtn == "") {
        if (isGrid)
            fld = fieldName + "001F" + fldDcNo;
        else
            fld = fieldName + "000F" + fldDcNo;
    } else {
        var fld = fieldName + fldExtn;
    }

    if (!document.getElementById(fld)) {
        if (isGrid)
            fld = fieldName + "001F" + fldDcNo;
        else
            fld = fieldName + "000F" + fldDcNo;
    }
    return fld;
}

//Function to fetch the value of the field in condition, from the field or parameters list.
function GetCondFldValue(fld) {
    var isfld = $j("#" + fld);
    var fieldVal = "";

    if (isfld.length > 0) {

        fieldVal = GetFieldValue(fld);
    } else {

        var w = 0;
        if (Parameters.length > 1) {
            for (var pki = 1; pki < Parameters.length; pki++) {
                var list = Parameters[pki].toString();
                list = list.split("~");
                varlist[w] = list[0].toString();
                valuelist[w] = list[1].toString();
                w++;
            }
        }

        for (var ij = 0; ij < varlist.length; ij++) {

            if (s == varlist[ij]) {
                fieldVal = valuelist[ij];
                break;
            }
        }
    }

    if (fieldVal != undefined) {
        fieldVal = fieldVal.replace(/\s/g, "");
    } else {
        fieldVal = "''";
    }
    // fixed for the "dd/mm/yyyy" to be considered as empty value.
    if (fieldVal == dateString) {
        fieldVal = "''";
    }

    if (isNaN(fieldVal))
        fieldVal = '"' + fieldVal + '"';

    return fieldVal;
}


//<Module>  FormControl </Module>
//<Author>  Naveen  </Author>
//<Description> Function to hide/show the DC control </Description>
//<Return> hide/show the DC control based on the action </Return>
function ShowingDc(a, x, calledFrom) {

    var isGrid = IsDcGrid(a);
    var adddcno = parseInt(a, 10);

    var isHidden = 'visible';
    var isDisplay = 'block';
    var classDcBut = "glyphicon glyphicon-chevron-down icon-arrows-down";
    var imgAlt = "show";
    var cursorStyle = 'hand';
    var disable = "true";
    x = x.toString().toLowerCase();
    var callGetTab = false;

    if (x == "hide") {

        isHidden = 'hidden';
        isDisplay = 'none';
        classDcBut = "glyphicon glyphicon-chevron-up icon-arrows-up";
        imgAlt = "show";
        cursorStyle = 'default';
        disable = "true"
    } else if (x == "show") {

        var dcIdx = GetTabDcIndexPagePos(adddcno);
        if (dcIdx != -1) {
            if (arrVisibleTabDcs[dcIdx] == "") {
                arrVisibleTabDcs[dcIdx] = (adddcno);
                callGetTab = true;
            } else
                callGetTab = false;
        }
        isHidden = 'visible';
        isDisplay = 'block';
        classDcBut = "glyphicon glyphicon-chevron-down icon-arrows-down";
        imgAlt = "hide";
        cursorStyle = 'hand';
        disable = "false";
    }

    var dcBut = $j("#dcButspan" + a);
    if (dcBut.length > 0) {
        dcBut.attr("alt", imgAlt);
        dcBut.attr("class", classDcBut);
        dcBut.css("visibility", isHidden);
        dcBut.css("cursor", cursorStyle);
    }

    $j(".fbutton").each(function () {
        if (x == "hide") {
            $j(this).prop("disabled", true);
        } else {
            $j(this).prop("disabled", false);
        }
    });

    var dvFrame = $j("#DivFrame" + a);
    var thisFldId = "";
    if (dvFrame.length > 0) {
        if (x == "showpopdc" || x == "hidepopdc") {
            //calling popupdcdialog func
            createPopDcDialog(a, dvFrame);
            if (typeof fld != "undefined" || fld != null || fld != "") {
                thisFldId = fld;
            } else {
                if (parseInt(dcno, 10) > 0) {
                    if (DCIsGrid[dcno - 1].toLowerCase() == "true") {
                        rowNo = GetRowNoHelper(AxActiveRowNo);
                        thisFldId = AxActiveField + rowNo + "F" + GetDcNo(AxActiveField);;
                    } else {
                        rowNo = "000";
                        thisFldId = AxActiveField + rowNo + "F" + GetDcNo(AxActiveField);;
                    }
                }
            }
        }
        if (x == "show") {
            // dvFrame.show();
            dvFrame.removeClass("d-none");
        } else if (x == "hide") {
            dvFrame.addClass("d-none");
        } else if (x == "showpopdc") {
            if (document.readyState == "complete") {
                dvFrame.dialog('open');
            }
            dvFrame.find("#head" + a).find("a[onclick^='javascript:ShowDc(']").hide();
            if (!($("#" + thisFldId).parent().next()).hasClass("ShowPopDc")) {
                $("<span class=\"fa fa-external-link ShowPopDc\" onclick=\"ShowingDc('" + a + "','showpopdc'); return false;\"></span>").insertAfter($("#" + thisFldId).parent());
            }
        } else if (x == "hidepopdc") {
            if (document.readyState == "complete") {
                dvFrame.dialog('close');
            }
            if (($("#" + thisFldId).parent().next()).hasClass("ShowPopDc")) {
                ($("#" + thisFldId).parent().next()).remove();
            }
        } else if (x == "enable") {
            $j("#DivFrame" + a).find('input,textarea, img, select, a').removeAttr('disabled');
            $j("#DivFrame" + a).find('.rowdelete').removeClass("disabledelete");
            $j("#wrapperForEditFields" + a).show();
            $j("#gridToggleBtn" + a).removeClass('disables').prop('disables', false);
            $j("#DivFrame" + a).find('.rowadd').removeClass("disableadd");
            $j("#DivFrame" + a).find('.fillcls').removeClass("disablefill");
            $j("#gridAddBtn" + a).prop('disabled', false);
            $j("#wrapperForEditFields" + a).find(".editLayoutFooter button").removeClass('disabled').prop('disabled', false);
            $j("[id ^= 'fillgrid']").prop('disabled', false).removeClass('disabled');
            $j("#gridHd" + a + " tbody tr").removeClass('disableTheRow');
            $j("#gridHd" + a + " tbody tr").find('.glyphicon.glyphicon-pencil,.glyphicon.glyphicon-trash').removeClass('disabled').prop("disabled", false).parent().removeClass('disabled').prop("disabled", false);
            $("#gridAddBtn" + a).next().find(":button").attr("disabled", false).on('click');
            $j("#DivFrame" + a + " .newgridbtn ul li").css("pointer-events", "");
        } else if (x == "disable") {
            $j("#DivFrame" + a).find('input,textarea, img, select, a').not('.subGrid,.chkShwSel').attr('disabled', true);

            for (var instanceName in CKEDITOR.instances) {
                try {
                    CKEDITOR.instances[instanceName].setReadOnly(true);
                } catch (ex) { }
            }

            $j("#DivFrame" + a).find('a img').removeClass('handCur');
            $j("#DivFrame" + a).find('img').attr('onclick', 'javascript:void(0);');
            $j("#DivFrame" + a).find('.dvImgClear .icon-arrows-remove').attr('onclick', 'javascript:void(0);');
            $j("#DivFrame" + a).find(":button").removeClass('handCur');
            $j("#DivFrame" + a).find('.rowdelete').addClass("disabledelete");
            $j("#DivFrame" + a).find('.rowadd').addClass("disableadd");
            $j("#gridAddBtn" + a).prop('disabled', true);
            $j("#clearThisDC" + a).prop("disabled", true).find(".gridActs").addClass("disabled");
            $j("#wrapperForEditFields" + a).hide();
            $j("#gridToggleBtn" + a).addClass('disabled').prop('disabled', true);
            $j("#DivFrame" + a).find('.fillcls').addClass("disablefill");
            $j("[id ^= 'fillgrid']").prop('disabled', true).addClass('disabled');
            $j("#wrapperForEditFields" + a).find(".editLayoutFooter button").addClass('disabled').prop('disabled', true);
            $j("#colScroll" + a + " table tbody tr").addClass('disableTheRow');
            $j("#colScroll" + a + " table tbody tr").find('.glyphicon.glyphicon-pencil,.glyphicon.glyphicon-trash').addClass('disabled').prop("disabled", true).parent().addClass('disabled').prop("disabled", true);
            $("#gridAddBtn" + a).next().find(":button").attr("disabled", true).off('click');
            $j("#DivFrame" + a + " .newgridbtn ul li").css("pointer-events", "none");
            //to disable grid attachment icon click event
            $j("#DivFrame" + a).find(".upload-icon").hover(function () {
                $(this).css("cursor", "not-allowed");
            }).attr('onclick', 'javascript:void(0)');

            //to disable grid attachment files click event(remove & preview)
            $j("#DivFrame" + a).find(".attach-files .grdAttach, .grdAttach").hover(function () {
                $(this).css("cursor", "not-allowed");
            }).attr('onclick', 'javascript:void(0)');

            $j("#DivFrame" + a).find(".attachment-count").removeAttr("disabled");

        }
    } else {
        if (x == "disable" || x == "enable") {
            var idx = $j.inArray(a + "~" + x, DisabledDcs);
            if (idx == -1)
                DisabledDcs.push(a + "~" + x);
        }
    }

    var li = $j("#li" + a);
    if (li.length > 0) {
        if (x == "show")
            // li.show();
            li.removeClass("d-none");
        else if (x == "hide")
            // li.hide();
            li.addClass("d-none");
    }


    //Rule 1- If the active tab is action tab and x is hide, then show first tab
    //Rule 2- If action tab is the first tab then show the first tab
    if (li.hasClass("active") && x == "hide") {
        var firstTab = GetFirstTabDcNo(a)
        if (firstTab != -1)
            $j("#ank" + firstTab).click();
    }
}

//function to createpopdcdialog

function createPopDcDialog(a, dvFrame) {
    var wWidth = $(window).width();
    var dWidth = wWidth * 0.97;
    var wHeight = $(window).height();
    var dHeight = wHeight * 0.97;

    if (document.readyState == "complete") {

        dvFrame.dialog({
            modal: true,
            autoOpen: false,
            width: dWidth,
            open: function () {
                $('.ui-widget-overlay').bind('click', function () {
                    dvFrame.dialog('close');
                })

            },
            close: function () {
                $(this).dialog("close");
                $(this).dialog('destroy');
                dvFrame.hide();
            },
            buttons: [{
                text: "Save",
                click: function () {
                    if (ValidateBeforeSubmit(a)) {
                        dvFrame.dialog('close');
                    }
                },
                'class': "ui-button ui-corner-all ui-widget hotbtn"
            },

            {
                text: "Cancel",
                click: function () {
                    ClearFieldsInDC(a);
                    dvFrame.dialog('close');
                },
                'class': "coldbtn btn",
                style: "background: antiquewhite"
            }
            ]
        });

        $('.ui-dialog-titlebar').hide();

        if (dvFrame.find("div:eq(0) button").length == 0) {
            dvFrame.find("div:eq(0)").prepend('<button class="remodal-close icon-basic-remove" style="color:rgba(76, 53, 53, 0.61);"></button>');
        } else {
            //do nothing
        }

        $('.remodal-close').bind('click', function () {
            dvFrame.dialog('close');
        });
    }

}

function createDataGridDialog(editGridDC) {
    createBootstrapModal("divDc" + editGridDC + " #gridheaddiv", "DC" + editGridDC + " ", "wrapperForEditFields" + editGridDC, "", "", "97%");
}

function clearDataGrid(editGridDC) {
    var isExitDummy = false;
    if (gridDummyRowVal.length > 0) {
        gridDummyRowVal.map(function (v) {
            if (v.split("~")[0] == editGridDC) isExitDummy = true;
        });
    }
    if (isExitDummy)
        return false;

    //if ($j("#clearThisDC" + editGridDC).prop("disabled"))
    if ($j("#clearThisDC" + editGridDC).find("a[disabled='disabled']").length > 0)
        return false;
    if ($j("#chkallgridrow" + editGridDC).prop("checked")) {
        if ($(".wrapperForGridData" + editGridDC + " table tbody tr").length > 0) {
            var cutMsg = eval(callParent('lcm[25]'));
            //cutMsg = cutMsg.replace('{0}', editGridDC);//GetDcCaption(fillGridDc)
            cutMsg = cutMsg.replace('{0}', GetDcCaption(editGridDC));
            var glType = eval(callParent('gllangType'));
            var isRTL = false;
            if (glType == "ar")
                isRTL = true;
            else
                isRTL = false;
            var rid = $j("#recordid000F0").val();
            if (rid != "0") {
                var clearThisDCGrid = $.confirm({
                    theme: 'modern',
                    closeIcon: false,
                    rtl: isRTL,
                    title: eval(callParent('lcm[155]')),
                    onContentReady: function () {
                        $(".jconfirm-buttons .hotbtn").focus(); //bug #AGI000616 -- manually focusing the cursor to Confirm button to avoid tab focus to other elements(once dialog displayed click on Shift+Tab it will navigate to background elements)
                        disableBackDrop('bind');
                    },
                    backgroundDismiss: 'false',
                    escapeKey: 'buttonB',
                    content: cutMsg,
                    buttons: {
                        buttonA: {
                            text: eval(callParent('lcm[164]')),
                            btnClass: 'btn btn-primary',
                            action: function () {
                                clearThisDCGrid.close();
                                var fDcRowCount = GetDcRowCount(editGridDC);
                                DeleteAllRows(editGridDC, fDcRowCount);
                                ShowDimmer(false);
                                $("#chkallgridrow" + editGridDC).prop("checked", false);
                                $("#clearThisDC" + editGridDC).addClass("disabled");
                                if (AxFormContSetGridCell.length > 0) {
                                    AxFormContSetGridCell = jQuery.grep(AxFormContSetGridCell, function (value) {
                                        return value.split("~")[0] != editGridDC;
                                    });
                                }
                            }
                        },
                        buttonB: {
                            text: eval(callParent('lcm[192]')),
                            btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                            action: function () {
                                AxWaitCursor(false);
                                ShowDimmer(false);
                                disableBackDrop('destroy');
                                return;
                            }
                        },
                    }
                });
            } else {
                var fDcRowCount = GetDcRowCount(editGridDC);
                DeleteAllRows(editGridDC, fDcRowCount);
                ShowDimmer(false);
                $("#chkallgridrow" + editGridDC).prop("checked", false);
                $("#clearThisDC" + editGridDC).addClass("disabled");
                if (AxFormContSetGridCell.length > 0) {
                    AxFormContSetGridCell = jQuery.grep(AxFormContSetGridCell, function (value) {
                        return value.split("~")[0] != editGridDC;
                    });
                }
            }
        } else {
            showAlertDialog("info", 2004, "client");
        }
    } else {
        if ($j("input[name=grdchkItemTd" + editGridDC + "]:checked").length > 0)
            DeleteSelectedRows(editGridDC);
    }
}

function DeleteSelectedRows(editGridDC) {

    var glType = eval(callParent('gllangType'));
    var isRTL = false;
    if (glType == "ar")
        isRTL = true;
    else
        isRTL = false;
    var cutMsg = eval(callParent('lcm[5]'));
    var rid = $j("#recordid000F0").val();
    if (rid != "0") {
        $.confirm({
            theme: 'modern',
            title: eval(callParent('lcm[155]')),
            content: cutMsg,
            escapeKey: 'buttonB',
            rtl: isRTL,
            onContentReady: function () {
                disableBackDrop('bind');
            },
            buttons: {
                buttonA: {
                    text: eval(callParent('lcm[279]')),
                    btnClass: 'btn btn-primary',
                    action: function () {
                        try {
                            let chkdCount = $j("input[name=grdchkItemTd" + editGridDC + "]:checked").length;
                            let loopCount = 0;
                            $j("input[name=grdchkItemTd" + editGridDC + "]:checked").each(function () {
                                loopCount++;
                                let _thisId = $j(this).attr("id");
                                let rowFrmNo = _thisId.substring(_thisId.lastIndexOf("F"), _thisId.lastIndexOf("F") - 3);// _thisId.substr(7, _thisId.lastIndexOf("F") - 3);
                                if (axInlineGridEdit)
                                    updateInlineGridRowValues();
                                if (loopCount == chkdCount)
                                    DeleteGridRow(editGridDC, rowFrmNo, undefined);
                                else
                                    DeleteGridRow(editGridDC, rowFrmNo, "all");
                            });
                        } catch (ex) {
                            AxWaitCursor(false);
                        }
                    }
                },
                buttonB: {
                    text: eval(callParent('lcm[280]')),
                    btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                    action: function () {

                    }
                }
            }
        });
    } else {
        try {
            let chkdCount = $j("input[name=grdchkItemTd" + editGridDC + "]:checked").length;
            let loopCount = 0;
            $j("input[name=grdchkItemTd" + editGridDC + "]:checked").each(function () {
                loopCount++;
                let _thisId = $j(this).attr("id");
                let rowFrmNo = _thisId.substring(_thisId.lastIndexOf("F"), _thisId.lastIndexOf("F") - 3);// _thisId.substr(7, _thisId.lastIndexOf("F") - 3);
                if (axInlineGridEdit)
                    updateInlineGridRowValues();
                if (loopCount == chkdCount)
                    DeleteGridRow(editGridDC, rowFrmNo, undefined);
                else
                    DeleteGridRow(editGridDC, rowFrmNo, "all");
            });
        } catch (ex) {
            AxWaitCursor(false);
        }
    }

    if (arrRefreshDcs.length > 0) {
        for (var i = 0; i < arrRefreshDcs.length; i++) {
            var arrDcNos = arrRefreshDcs[i].split(':');
            if (arrDcNos[1] == "dc" + editGridDC) {
                arrRefreshFldDirty[i] = true;
                break;
            }
        }
    }
    OnRowChangeSetHeight(editGridDC);
    checkTableBodyWidths(editGridDC);
    if (isTstPop == "True") {
        TstructTabEventsInPopUP("");
    }

    //DeleteGridRow(dcNo, GetClientRowNo(i, dcNo), "all");
}

function GetFirstTabDcNo(curDcNo) {
    var j = 0;
    for (j = 0; j < PagePositions.length; j++) {

        if (PagePositions[j].toString().indexOf(",") != -1) {

            var strTabs = PagePositions[j].toString().split(',');
            var cnt = 0;
            for (cnt = 0; cnt < strTabs.length; cnt++) {
                if (curDcNo == strTabs[cnt]) {
                    return strTabs[0];
                }
            }
        }
    }

    return -1;
}

//<Module>  FormControl </Module>
//<Author>  Naveen  </Author>
//<Description> Function to Enable/Disable the DC control </Description>
//<Return> Enables/Disables the DC control based on the action </Return>
function EnableDisableDc(a, x) {
    var isGrid = IsDcGrid(a);
    var adddcno = parseInt(a, 10);
    var isDisable = false;
    var cursorStyle = 'hand';
    if (x == "Enable") {

        isDisable = false;
        cursorStyle = 'hand';
    } else if (x == "Disable") {

        isDisable = "disabled";
        cursorStyle = 'default';
    }

    var dcBtn = $j("#dcButspan" + a);
    if (dcBtn.length > 0) {
        dcBtn.attr("alt", "hide");
        dcBtn.attr("class", "glyphicon glyphicon-chevron-down icon-arrows-down");
        dcBtn.attr("disabled", isDisable);
        dcBtn.css("cursor", cursorStyle);
    }

    if (isGrid) {
        var dvFrame = $j("#DivFrame" + a);
        if (dvFrame.length > 0) {
            if (x == "Enable")
                dvFrame.attr("disbaled", false);
            else
                dvFrame.attr("disbaled", "disbaled");
        }
    } else {
        var nonGridDc = $j("#DivFrame" + a);
        if (nonGridDc.length > 0) {
            if (x == "Enable")
                nonGridDc.attr("disbaled", false);
            else
                nonGridDc.attr("disbaled", "disbaled");
        } else {
            var tabDc = $j("#tab-" + a);
            if (tabDc.length > 0) {
                if (x == "Enable")
                    tabDc.attr("disbaled", false);
                else
                    tabDc.attr("disbaled", "disbaled");
            }
        }
    }
}

//-----------------------------List of functions in this file--------------------------------------
//CheckAOWE(dcNo) -Function which returns the actual Grid row count for checking Add Only When Empty in Fill grid.
//FillGrid(tid, dcname, ashow, multiselect, plist) -Function to call fill grid service or open a fillgrid page.
//SuccessFillGridNonMS(result, eventArgs) -Callback function for DoGetFillGridNonMS service.
//ProcessFillGrid(dcNo) -Function which calls the DoGetFillGrid service.
//SuccGetResultValue(result, eventArgs) -Callback function form the DoGetFillGrid webservice.
//DoFillControlPrivilege(strSingleLineText) -Function which executes the partial disabling in the fill grid dc.
//CloseWrapper() -Function to close the wrapper on fill grid window.
//CheckAll() -Function to check all the row once the header row is checked.
//ChkHdrCheckbox() -Function to check if the header checkbox is checked then check all.
//-------------------------------------------------------------------------------------------------
$j.curCSS = function (element, attrib, val) {
    $j(element).css(attrib, val);
};

//Function which returns the actual Grid row count for checking Add Only When Empty in Fill grid.
//By default the grid has one row,
//Function to add a new group to the given format grid dc.
function AddGroup(dcNo, keyColName) {
    fillDcname = dcNo;
    //This below code is to send the existing groups in the format grid on filling new items.
    var dcRowCnt = GetDcRowCount(dcNo);
    if (parseInt(dcRowCnt, 10) == 1) {
        var rowNo = GetClientRowNo("001", dcNo);
        var keyColfldId = keyColName + rowNo + "F" + dcNo;
        var val = GetFieldValue(keyColfldId);
        if (val != "")
            UpdateFieldArray(keyColfldId, "001", val, "");
    }

    var rid = $j("#recordid000F0").val();
    ArrActionLog = "AddGroup-DcNo-" + dcNo + "-KeyColumn-" + keyColName + "-Recordid-" + rid;

    var dIndx = GetFormatGridIndex(dcNo);
    if (dIndx != -1) {
        var multiSelect = DcMultiSelect[dIndx].toString().toLowerCase();
        try {
            if (multiSelect == "true")
                ASB.WebService.GetAddGroupsHtml(ChangedFields, ChangedFieldDbRowNo, ChangedFieldValues, DeletedDCRows, dcNo, transid, tstDataId, SuccessGetFillGridMS, OnException);
            else {
                var delRows = GetDeletedRows();
                var chngRows = GetChangedRows();
                var recid = $j("#recordid000F0").val();
                ShowDimmer(true);
                ASB.WebService.ExecuteAction(ChangedFields, ChangedFieldDbRowNo, ChangedFieldValues, DeletedDCRows, ArrActionLog, recid, transid, dcNo, "", "", delRows, chngRows, tstDataId, SuccExecActionValue, OnException);
            }
        } catch (ex) {
            AxWaitCursor(false);
            var execMess = ex.name + "^♠^" + ex.message;
            showAlertDialog("error", 2030, "client", execMess);
        }
    }
}

var fillGridDc = "";
var fillOrAdd = "";
var AxActivefillGridName = "";
//Function to call fill grid service or open a fillgrid page.
function FillGrid(frNo, addGroup, fillGridName, fastFill) {
    GetCurrentTime("Tstruct FillGrid button click(ws call)");
    fastFill == undefined ? fastFill = false : true;
    var IsConfirm = false;
    //if (!checkEditMode())
    //    return;
    AxStartTime = new Date();
    AxStartTime = GetAxDate(AxStartTime);
    var stTime = new Date();

    try {
        AxBeforeFillGrid();
    } catch (ex) { }
    AxActivefillGridName = fillGridName;
    if ($j("[name=" + fillGridName + "]").attr("class").indexOf("disablefill") != -1)
        return;
    //ShowDimmer(true);
    //AxWaitCursor(true);
    var vallist = new Array();

    fillGridDc = frNo;

    var ind = $j.inArray(fillGridName, FillGridName);
    var dcIdx = $j.inArray(frNo, DCFrameNo);
    var isExitDummy = false;
    if (gridDummyRowVal.length > 0) {
        gridDummyRowVal.map(function (v) {
            if (v.split("~")[0] == fillGridDc) isExitDummy = true;
        });
    }
    //Fill grid rule:1
    if (FillCondition[ind] == "APPEND" && $("#gridHd" + frNo + " tbody tr").length > 0 && isExitDummy) {
        UpdateFieldArray(axpIsRowValid + frNo + "001F" + frNo, GetDbRowNo("001", frNo), "false", "parent", "fillgrid");
    } else if (FillCondition[ind] == "INIT") {
        if ($("#gridHd" + frNo + " tbody tr").length > 0 && !isExitDummy) {
            IsConfirm = true;
            var cutMsg = eval(callParent('lcm[26]'));
            var glType = eval(callParent('gllangType'));
            var isRTL = false;
            if (glType == "ar")
                isRTL = true;
            else
                isRTL = false;
            var FillGridCB = $.confirm({
                theme: 'modern',
                closeIcon: false,
                title: eval(callParent('lcm[155]')),
                onContentReady: function () {
                    disableBackDrop('bind');
                },
                backgroundDismiss: 'false',
                rtl: isRTL,
                escapeKey: 'buttonB',
                content: cutMsg,
                buttons: {
                    buttonA: {
                        text: eval(callParent('lcm[164]')),
                        btnClass: 'btn btn-primary',
                        action: function () {
                            GetCurrentTime("Tstruct FillGrid button click(ws call)");
                            FillGridCB.close();
                            //var fDcRowCount = GetDcRowCount(frNo);
                            // DeleteAllRows(frNo, fDcRowCount);
                            if (gridDummyRowVal.length > 0) {
                                gridDummyRowVal.map(function (v) {
                                    if (v.split("~")[0] == fillGridDc)
                                        gridDummyRowVal.splice($.inArray(v, gridDummyRowVal), 1);
                                    gridRowEditOnLoad = false;
                                });
                            }
                            FillGridAfterConfirm(fastFill);
                        }
                    },
                    buttonB: {
                        text: eval(callParent('lcm[192]')),
                        btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                        action: function () {
                            disableBackDrop('destroy');
                            AxWaitCursor(false);
                            ShowDimmer(false);
                            return;
                        }
                    }
                }
            });

        }
    } else if (FillCondition[ind] == "AOWE") {
        if ($("#gridHd" + frNo + " tbody tr").length > 0 && !isExitDummy && DCHasDataRows[dcIdx] == "True") {
            IsConfirm = true;
            //ShowDialog('warning', 5003, "client");
            var cutMsg = eval(callParent('lcm[519]'));
            var glType = eval(callParent('gllangType'));
            var isRTL = false;
            if (glType == "ar")
                isRTL = true;
            else
                isRTL = false;
            var FillGridCB = $.confirm({
                theme: 'modern',
                closeIcon: false,
                title: eval(callParent('lcm[155]')),
                onContentReady: function () {
                    disableBackDrop('bind');
                },
                backgroundDismiss: 'false',
                rtl: isRTL,
                escapeKey: 'buttonB',
                content: cutMsg,
                buttons: {
                    buttonA: {
                        text: eval(callParent('lcm[164]')),
                        btnClass: 'btn btn-primary',
                        action: function () {
                            GetCurrentTime("Tstruct FillGrid button click(ws call)");
                            FillGridCB.close();
                            var fDcRowCount = GetDcRowCount(frNo);
                            DeleteAllRows(frNo, fDcRowCount);
                            if (gridDummyRowVal.length > 0) {
                                gridDummyRowVal.map(function (v) {
                                    if (v.split("~")[0] == fillGridDc)
                                        gridDummyRowVal.splice($.inArray(v, gridDummyRowVal), 1);
                                    gridRowEditOnLoad = false;
                                });
                            }
                            FillGridAfterConfirm(fastFill);
                        }
                    },
                    buttonB: {
                        text: eval(callParent('lcm[192]')),
                        btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                        action: function () {
                            disableBackDrop('destroy');
                            AxWaitCursor(false);
                            ShowDimmer(false);
                            return;
                        }
                    }
                }
            });
        }
    }

    function FillGridAfterConfirm(fastFill) {
        AxWaitCursor(true);
        ShowDimmer(true);
        var paramList = "";
        if (ind != -1) {
            ashow = FillAutoShow[ind];
            multiselect = FillMultiSelect[ind].toString().toLowerCase();
            paramList = FillParamFld[ind];
        }

        //If the dc has fillgrid from source dc then multiselect should not be shown.
        if (FillSourceDc[ind] != "" && multiselect == "true")
            multiselect = "false";

        var paramXml = "";
        if (paramList != "" && multiselect == "true") {

            var paramlst = paramList.toString();
            var inputdata = paramlst.split(',');

            for (var pr = 0; pr < inputdata.length; pr++) {

                var isGrid = IsGridField(inputdata[pr]);
                var dcNo = GetDcNo(inputdata[pr]);
                if (isGrid == true) {

                    var rCount = GetDcRowCount(dcNo);
                    rCount = parseInt(rCount, 10);

                    var paramValStr = "";
                    for (var k = 1; k <= rCount; k++) {

                        k = GetRowNoHelper(k);
                        inputdata[pr] = GetExactFieldName(inputdata[pr]);
                        var fld = $j("#" + inputdata[pr] + k + "F" + dcNo);
                        if (fld) {

                            var fParamName = inputdata[pr].toString() + k + "F" + dcNo;
                            var paramVal = GetFieldValue(fParamName, "fillGrid");
                            paramVal = CheckSpecialCharsInStr(paramVal);
                            paramXml += "<" + inputdata[pr] + " rowno='" + k + "' >" + paramVal + "</" + inputdata[pr] + ">";
                        }
                    }
                } else {
                    var fParamName = inputdata[pr].toString() + "000F" + dcNo;
                    if ($("#" + fParamName).length > 0) {
                        var paramVal = GetFieldValue(fParamName, "fillGrid");
                        paramVal = CheckSpecialCharsInStr(paramVal);
                        paramXml += "<" + inputdata[pr] + ">" + paramVal + "</" + inputdata[pr] + ">";
                    } else {
                        var paramVal = CheckGlobalVars(inputdata[pr].toString());
                        if (paramVal == inputdata[pr].toString())
                            paramXml += "<" + inputdata[pr] + "></" + inputdata[pr] + ">";
                        else
                            paramXml += "<" + inputdata[pr] + ">" + paramVal + "</" + inputdata[pr] + ">";
                    }
                }
            }
        }
        var src = "fill";
        if (addGroup && addGroup != "") src = addGroup;
        fillOrAdd = src;
        if (multiselect == "true") {
            if (fastFill) {
                var res = "t";
                //if (FillGridVExpr[ind] != "") {
                //    res = EvalPrepared("", "000", FillGridVExpr[ind], "expr");
                //}

                //paramXml = "<tid>" + transid + "</tid><dc>" + frNo + "</dc>" + paramXml;
                try {
                    callBackFunDtls = "FillGridAfterConfirm♠" + fastFill;
                    GetProcessTime();
                    ASB.WebService.GetFastFillGridData(frNo, fillGridName, transid, src, tstDataId, res, SuccessGetFillGridMS, OnException);

                } catch (ex) {
                    AxWaitCursor(false);
                    var execMess = ex.name + "^♠^" + ex.message;
                    showAlertDialog("error", 2030, "client", execMess);
                }
            } else {
                //Evaluate validate expression for fillgrid if any
                var res = "t";
                if (FillGridVExpr[ind] != "") {
                    res = EvalPrepared("", "000", FillGridVExpr[ind], "expr");
                }

                paramXml = "<tid>" + transid + "</tid><dc>" + frNo + "</dc>" + paramXml;
                try {
                    callBackFunDtls = "FillGridAfterConfirm♠" + fastFill;
                    GetProcessTime();
                    ASB.WebService.GetFillGridData(paramXml, ChangedFields, ChangedFieldDbRowNo, ChangedFieldValues,
                        DeletedDCRows, frNo, fillGridName, transid, src, tstDataId, res, SuccessGetFillGridMS, OnException);

                } catch (ex) {
                    AxWaitCursor(false);
                    var execMess = ex.name + "^♠^" + ex.message;
                    showAlertDialog("error", 2030, "client", execMess);
                    UpdateExceptionMessageInET("GetFillGridData exception : " + ex.message);
                }
            }
        } else {
            if (!IsFormDirty)
                SetFormDirty(true);
            //If multi select is false,
            //Then call the DoFillGrid service directly instead of opening the fillgrid window.
            try {
                changeFillGridDc = frNo;
                callBackFunDtls = "FillGridAfterConfirm♠" + fastFill;
                GetProcessTime();
                ASB.WebService.DoGetFillGridNonMS(ChangedFields, ChangedFieldDbRowNo, ChangedFieldValues,
                    DeletedDCRows, frNo, fillGridName, tstDataId, SuccessFillGridNonMS, OnException);
            } catch (ex) {
                AxWaitCursor(false);
                var execMess = ex.name + "^♠^" + ex.message;
                showAlertDialog("error", 2030, "client", execMess);
                UpdateExceptionMessageInET("DoGetFillGridNonMS exception : " + ex.message);
                GetProcessTime();
                GetTotalElapsTime();
            }
        }
        var edTime = new Date();
        AxTimeBefSerCall = edTime - stTime;
    }
    if (IsConfirm == false) {
        FillGridAfterConfirm(fastFill);
    }
}





var dialogObj;
var fgHt = 400;
var fgWid = 400;

function SuccessGetFillGridMS(result, eventArgs) {
    if (result != "") {
        if (result.split("*♠♠*").length > 1) {
            var serverprocesstime = result.split("*♠♠*")[0];
            var requestProcess_logtime = result.split("*♠♠*")[1];
            result = result.split("*♠♠*")[2];
            WireElapsTime(serverprocesstime, requestProcess_logtime, true);
        } else {
            UpdateExceptionMessageInET("Error : " + result);
        }
    }
    if (result.toLowerCase().indexOf("access violation") === -1) {
        if (CheckSessionTimeout(result))
            return;

        try {
            AxBeforeFillPopUp();
        } catch (ex) { }

        var fillTitle = "";
        if (fillOrAdd == "FILL")
            fillTitle = "FILL " + GetDcCaption(fillGridDc);
        else
            fillTitle = "ADD " + GetDcCaption(fillGridDc);

        if (result == "") {
            var cutMsg = eval(callParent('lcm[0]'));
            result = "<label>" + cutMsg + "</label>"
        }

        var resSplit = result.split("*♠*");

        ChangedFields = new Array();
        ChangedFieldDbRowNo = new Array();
        ChangedFieldValues = new Array();
        DeletedDCRows = new Array();

        var tablehtml = resSplit[0].toString();
        if ($j("#dvFillGrid").length > 0)
            $j("#dvFillGrid").html(tablehtml);
        else {
            $("#bootstrapModalWrapP").remove();
            $("#pagebdy").append("<div id=\"dvFillGrid\" style=\"\"></div>");
            $j("#dvFillGrid").html(tablehtml);
        }

        if (resSplit.length > 1 && resSplit[1].toString() != "") {
            var fgSize = resSplit[1].toString();
            var fgsizeSplit = fgSize.split(',');
            try {
                fgHt = fgsizeSplit[2].toString();
                fgWid = fgsizeSplit[3].toString();
            } catch (e) { }
            if ((fgHt == "0") || (fgWid == "0")) {
                fgHt = 400;
                fgWid = 400;
            }
            var modalData = "";

            modalData += $j("#dvFillGrid").wrap('<p id="bootstrapModalWrapP"/>').parent().html();
            $j("#bootstrapModalWrapP").html("");
            buttons = {
                "count": 2,
                "button1": {
                    'name': eval(callParent('lcm[281]')),
                    'function': "ProcessFillGrid(" + fillGridDc + ", '" + AxActivefillGridName + "')",
                    'class': 'btn hotbtn',
                    'id': 'modalCnfirmbtn'
                },
                "button2": {
                    'name': eval(callParent('lcm[192]')),
                    'class': 'btn coldbtn'
                }
            }
            // createBootstrapModal("dvFillGrid", fillTitle, modalData, buttons, fgHt + "px", fgWid + "px");

            let myModal = new BSModal("dvFillGrid", fillTitle, modalData, () => {
                //shown callback
            }, () => {
                //hide callback
            });
            myModal.changeSize("lg");
            myModal.scrollableDialog();
            myModal.okBtn.innerText = eval(callParent('lcm[281]'));
            myModal.okBtn.setAttribute("onClick", "ProcessFillGrid('" + fillGridDc + "','" + AxActivefillGridName + "')");
            myModal.cancelBtn.innerText = eval(callParent('lcm[192]'));
            

            if (jQuery('table[id^=tblFillGrid]').length) bindUpdownEvents(jQuery('table[id^=tblFillGrid]').attr('id'), 'multiple');
            $("#wrapperForMainNewData", window.parent.document).hide();
        } else {
            var modalData = "";
            var buttons = {
                "count": 1,
                "button1": {
                    'name': eval(callParent('lcm[281]')),
                    'class': 'btn hotbtn'
                }
            }
            modalData += $j("#dvFillGrid").wrap('<p id="bootstrapModalWrapP"/>').parent().html();
            createBootstrapModal("dvFillGrid", fillTitle, modalData, buttons);
            if (jQuery('table[id^=tblFillGrid]').length) bindUpdownEvents(jQuery('table[id^=tblFillGrid]').attr('id'), 'multiple');
            $("#wrapperForMainNewData", window.parent.document).hide();
        }

        $('#bootstrapModal').ready(function () {
            try {
                var glCulture = eval(callParent('glCulture'));
                let dtFormat = "DD/MM/YYYY";
                if (glCulture == "en-us")
                    dtFormat = "MM/DD/YYYY";
                $.fn.dataTable.moment(dtFormat);
            } catch (ex) { }
            fillGridDatatbl = $('table[id^=tblFillGrid]').DataTable({
                fixedHeader: true,
                "dom": '<"float-start"f><"float-end"l><"d-inline-flex w-100 overflow-auto"t>ip',
                'columnDefs': [{
                    'orderable': false,
                    'targets': 0
                }], // hide sort icon on header of first column
                'aaSorting': (typeof fillGridDataQueryOrder != "undefined" && fillGridDataQueryOrder.toString() == "true") ? [] : [
                    [1, 'asc']
                ], //default sort for 1 column in ascending order
                language: {
                    search: "_INPUT_",
                    searchPlaceholder: "Search...",

                },
                scrollCollapse: true,
                "lengthMenu": (typeof fillGridDataShowAll != "undefined" && fillGridDataShowAll.toString() == "true") ? [
                    [-1, 500, 100],
                    ["All", 500, 100]
                ] : [
                    [100, 500, -1],
                    [100, 500, "All"]
                ],
                "autoWidth": false
            });
            $("#dvFillGrid .dataTables_filter input[type=search]").addClass("serachdatatbl form-control");
            $('#dvFillGrid .dataTables_length select').removeClass('form-control input-sm selectPaddingFix').addClass('showentries');
            //var theadtext = $(".gridData.customSetupTableMN.dataTable thead tr th");
            //for (var i = 1; i < theadtext.length; i++) {
            //    var temptext = theadtext[i].innerHTML;
            //    temptext = temptext.toLowerCase(); // console.log(temptext);
            //    $(".gridData.customSetupTableMN.dataTable thead tr th")[i].innerHTML = capitalizeFirstLetter(temptext);
            //}
        });

        AxWaitCursor(false);
        ShowDimmer(false);
    } else {
        AxWaitCursor(false);
        ShowDimmer(false);
        $("#reloaddiv").show();
        $("#dvlayout").hide();
    }
    GetProcessTime();
    GetTotalElapsTime();
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//Function to get the dc title and return.
function GetDcCaption(dcNo) {
    dcNo = "dc" + dcNo;
    var dcTitle = "";
    var indx = $j.inArray(dcNo, DCName);
    if (indx != -1) {
        dcTitle = DCCaption[indx];
    }
    return dcTitle;
}

//Callback function for DoGetFillGridNonMS service.
function SuccessFillGridNonMS(result, eventArgs) {
    if (result != "") {
        if (result.split("*♠♠*").length > 1) {
            var serverprocesstime = result.split("*♠♠*")[0];
            var requestProcess_logtime = result.split("*♠♠*")[1];
            result = result.split("*♠♠*")[2];
            WireElapsTime(serverprocesstime, requestProcess_logtime, true);
        } else {
            UpdateExceptionMessageInET("Error : " + result);
        }
    }
    if (result.toLowerCase().indexOf("access violation") === -1) {
        if (gridDummyRowVal.length > 0) {
            gridDummyRowVal.map(function (v) {
                if (v.split("~")[0] == fillGridDc)
                    gridDummyRowVal.splice($.inArray(v, gridDummyRowVal), 1);
                gridRowEditOnLoad = false;
            });
        }

        var stTime = new Date();
        if (CheckSessionTimeout(result))
            return;
        if (result != "") {
            ParseServiceResult(result, "FillGrid");
        }

        var dcColumnValue = $j('#axp_colmerge_' + fillGridDc + '000F1');
        dcColumnValue = dcColumnValue.val();
        if (dcColumnValue != null && dcColumnValue != '' && dcColumnValue != undefined) {
            GetGridDcTable(dcColumnValue, fillGridDc);
        }

        UpdateFldArrayInFillgrid(fillGridDc);

        try {
            AxAfterFillGrid();
        } catch (ex) {

        }
        changeEditLayoutIds(FillGridFillRows, FillGridCurrentDC, 'fillGrid');
        EvaluateSetFont(fillGridDc);
        showAttachmentPopover();
        if (AxLogTimeTaken == "true") {
            var edTime = new Date();
            var diff = edTime.getTime() - stTime.getTime();
            CreateTimeLog(AxStartTime, AxTimeBefSerCall, diff, ASBTotal, ASBDbTime, "FillGridNonMS");
        }
        //applyDesignJsonAgain(fillGridDc);
        setDesignedLayout("#divDc" + fillGridDc);
        //AlignDcElements("divDc" + fillGridDc);
        FocusOnFirstGridField(fillGridDc);
        if (isMobile && mobileCardLayout == "none") {
            $("#wrapperForEditFields" + (fillGridDc)).removeClass("d-none");
            $("#wrapperForEditFields" + (fillGridDc)).addClass("mobilewrapperForEditFields");
            if ($(".wrapperForGridData" + (fillGridDc) + " table tbody tr").length == 0 && !axInlineGridEdit)
                $("#colScroll" + (fillGridDc)).hide();
            if (axInlineGridEdit)
                $(".editWrapTr").hide();
            $(".editLayoutFooter").hide();
            $(`#DivFrame${fillGridDc} .newgridbtn`).addClass("d-none");
            let gridButton = $(`#DivFrame${fillGridDc} .newgridbtn>ul`).html();
            $(`#wrapperForEditFields${fillGridDc}`).append(`<div class="clearfix"></div><div class="grdButtons btnMobile"><ul class="left">${gridButton}</ul></div>`);
            $(`#wrapperForEditFields${fillGridDc} .btnMobile`).find(`#viewGrid${fillGridDc}`).addClass("d-none");
            $(".dcTitle").hide().nextAll("hr.hrline").hide();

            try {
                if (typeof designObj != "undefined" && designObj[0] != null && designObj[0].selectedLayout != null && designObj[0].selectedLayout != "" && designObj[0].selectedLayout == "tile") {
                    $(".dcTitle").show().nextAll("hr.hrline").show();
                }
            } catch (ex) { }
        }
    } else {
        AxWaitCursor(false);
        ShowDimmer(false);
        $("#reloaddiv").show();
        $("#dvlayout").hide();
        //if (callBackFunDtls != "") {
        //    AxWaitCursor(false);
        //    ShowDimmer(false);
        //    $("#reloaddiv").show();
        //    $("#dvlayout").hide();
        //}
    }
    GetProcessTime();
    GetTotalElapsTime();
}


var addGroupDc = "";
///Function to Add selected groups to the format grid.
function ProcessAddGroup(dcNo) {
    addGroupDc = dcNo;
    var tblFg = $j("#tblFillGrid" + dcNo);
    var rowData = "";
    var data = "";
    var selection = "";

    //Loop through the checklist and get the selected rows data
    tblFg.find('.fgChk').each(function () {
        if ($j(this).prop("checked") != undefined && $j(this).prop("disabled") == false) {
            rowData = $j(this).val();

            var rows = rowData.split("¿");
            if (selection == "")
                selection += rows[0].toString();
            else
                selection += "¿" + rows[0].toString();
        }
    });
    var dcClientRows = GetDcClientRows(dcNo);
    var lastRow = dcClientRows.getMaxVal();
    var newCnt = parseInt(lastRow, 10) + 1;
    var newRowNo = GetRowNoHelper(newCnt);
    //GetNewGroupsHtml
    try {
        ASB.WebService.GetNewGroupsHtml(dcNo, transid, selection, newRowNo, tstDataId, SuccAddGroups);
    } catch (ex) {
        AxWaitCursor(false);
        var execMess = ex.name + "^♠^" + ex.message;
        showAlertDialog("error", 2030, "client", execMess);
    }
}

///Success function which appends the ne group to the format grid.
function SuccAddGroups(result, eventArgs) {
    if (CheckSessionTimeout(result))
        return;
    if (addGroupDc != "") {
        var strResult = result.split("♣");
        var oldHtml = $j("#gridDc" + addGroupDc).html();
        $j("#gridDc" + addGroupDc + " > tbody:last").append(strResult[1]);
        if (strResult[0] != "") {
            var rowArray = new Array();
            var rows = strResult[0].toString().split(",");
            for (var i = 0; i < rows.length; i++) {
                UpdateDcRowArrays(addGroupDc, rows[i], "Add");
                UpdateKeyColValues(addGroupDc, rows[i]);
            }

        }
        ResetRowCount(addGroupDc, rows.length);
        ResetGridRowsStyle(addGroupDc);
        rowArray.push("#DivFrame" + addGroupDc);
        AssignJQueryEvents(rowArray);
        AxWaitCursor(false);
        if (dialogObj) {
            dialogObj.dialog("close");
            $("#wrapperForMainNewData", window.parent.document).show();
        }
    }
}


function ResetRowCount(dcNo, newCnt) {
    var oldRowCnt = parseInt($j("#hdnRCntDc" + addGroupDc).val(), 10);
    var rowCnt = oldRowCnt + newCnt;
    SetRowCount(addGroupDc, rowCnt);
}

function UpdateKeyColValues(dcNo, rowNo) {
    var dcIndx = GetFormatGridIndex(dcNo);
    if (dcIndx != -1) {
        var keyCol = DcKeyColumns[dcIndx];
        var fld = $j("#" + keyCol + rowNo + "F" + dcNo);
        var fldValue = GetFieldValue(keyCol + rowNo + "F" + dcNo);
        var dbRowNo = GetDbRowNo(rowNo, dcNo);
        UpdateFieldArray(keyCol + rowNo + "F" + dcNo, dbRowNo, fldValue, "parent");
        UpdateAllFieldValues(keyCol + rowNo + "F" + dcNo, fldValue);
    }
}

//Function to fill the values from list or sql without action
function ProcessFormatStaticFill(dcNo) {

    fillDcname = dcNo;
    AxWaitCursor(true);

    var tblFg = $j("#tblFillGrid" + dcNo);
    var rowData = "";
    var data = "";
    var selection = "";
    var selectionCol = "";
    var selectionType = "";

    var dcIdx = $j.inArray("dc" + dcNo, DCName);
    var keyCol = "";
    if (dcIdx != -1)
        keyCol = DcKeyColumns[dcIdx];

    //Loop through the checklist and get the selected rows data
    tblFg.find('.fgChk').each(function () {
        if ($j(this).prop("checked") != undefined) {
            rowData = $j(this).val();

            var rows = rowData.split("¿");
            for (var i = 0; i < rows.length; i++) {
                var colData = rows[i].split("♣");
                if (i == 0) {
                    if (colData[0] == keyCol) {
                        selectionCol = colData[0];
                    }
                }
                if (colData[0] == selectionCol) {

                    if (selection == "")
                        selection = colData[1];
                    else
                        selection += "," + colData[1];
                }
            }
        }
    });

    data = data.replace(/&/g, "&amp;");
    var recid = $j("#recordid000F0").val();
    try {
        ASB.WebService.ExecuteFormatFill(transid, dcNo, selection, tstDataId, SuccExecActionValue);
    } catch (ex) {
        AxWaitCursor(false);
        var execMess = ex.name + "^♠^" + ex.message;
        showAlertDialog("error", 2030, "client", execMess);
    }
}

//Function to call action for a format grid on the selected rows from the fill.
function ProcessFormatFill(dcNo) {
    fillDcname = dcNo;
    AxWaitCursor(true);

    var tblFg = $j("#tblFillGrid" + dcNo);
    var rowData = "";
    var data = "";
    var selection = "";
    var selectionCol = "";
    var selectionType = "";
    //Loop through the checklist and get the selected rows data
    tblFg.find('.fgChk').each(function () {
        if ($j(this).prop("checked") != undefined) {
            rowData = $j(this).val();

            var rows = rowData.split("¿");
            for (var i = 0; i < rows.length; i++) {
                var colData = rows[i].split("♣");
                if (i == 0) {
                    if (colData[0].substring(1) == "selection") {
                        selectionCol = colData[0];
                        selectionType = colData[0].substring(0, 1);
                    }
                }
                if (colData[0] == selectionCol) {
                    if (selectionType != "n") {
                        if (selection == "")
                            selection = "'" + colData[1] + "'";
                        else
                            selection += "," + "'" + colData[1] + "'";
                    } else {
                        if (selection == "")
                            selection = colData[1];
                        else
                            selection += "," + colData[1];
                    }
                }
            }
        }
    });

    if (selection == "") {
        showAlertDialog("warning", 2005, "client");
        AxWaitCursor(false);
        return;
    }
    data = "<selections>" + selection + "</selections>";
    data = data.replace(/&/g, "&amp;");
    var recid = $j("#recordid000F0").val();

    var rid = $j("#recordid000F0").val();
    ArrActionLog = "FillFormatGrid-DcNo-" + dcNo + "-Selected groups-" + selection + "-Recordid-" + rid;

    var delRows = GetDeletedRows();
    var chngRows = GetChangedRows();
    try {
        ASB.WebService.ExecuteAction(ChangedFields, ChangedFieldDbRowNo, ChangedFieldValues, DeletedDCRows, ArrActionLog, recid, transid, dcNo, data, selection, delRows, chngRows, tstDataId, SuccExecActionValue, OnException);
    } catch (ex) {
        AxWaitCursor(false);
        var execMess = ex.name + "^♠^" + ex.message;
        showAlertDialog("error", 2030, "client", execMess);
    }
}

//Success Function for action after fill in the format grid dc.
function SuccExecActionValue(result, eventArgs) {
    ArrActionLog = "";
    if (CheckSessionTimeout(result))
        return;
    //the result format -> jsonsResult*♠*dcno♣rowCnt*?*dchtml
    //First split the json and html, call assignloadvalues for json
    //second parse the html
    if (result != "") {
        ParseServiceResult(result, "Action");
    }
    if (dialogObj) {
        dialogObj.dialog("close");
        $("#wrapperForMainNewData", window.parent.document).show();
    }
}


//Function which calls the DoGetFillGrid service.
function ProcessFillGrid(dcNo, fillGridName) {
    GetCurrentTime("Tstruct Process FillGrid Ok button click(ws call)");
    if (gridDummyRowVal.length > 0) {
        gridDummyRowVal.map(function (v) {
            if (v.split("~")[0] == dcNo)
                gridDummyRowVal.splice($.inArray(v, gridDummyRowVal), 1);
            gridRowEditOnLoad = false;
        });
    }
    AxStartTime = new Date();
    AxStartTime = GetAxDate(AxStartTime);
    var stTime = new Date();
    fillDcname = dcNo;

    ShowDimmer(true);
    AxWaitCursor(true);

    if (!IsFormDirty)
        SetFormDirty(true);

    var tblFg = $j("#tblFillGrid" + dcNo);
    var rowData = "";
    var data = "";

    var presentCB = "";
    var isCBchecked;
    if ($('input[name="grdchkItemTd"]:checked').length == 0)
        isCBchecked = false;
    else
        isCBchecked = true;
    //var totalrows = fillGridDatatbl.rows();
    //Loop through the checklist and get the selected rows data
    fillGridDatatbl.rows().every(function () {
        //var node = fillGridDatatbl.rows().nodes();
        var node = this.node();
        var allTds = $(node).find('td');
        var chkBx = $(node).find('td input[type="checkbox"]');
        var isCurRowChkd = chkBx.is(":checked");

        if (isCurRowChkd) {
            presentCB = chkBx.val();
            data += "<row>";
            var rows = presentCB.split("¿");
            for (var i = 0; i < rows.length; i++) {
                var colData = rows[i].split("♣");
                var selColData = CheckSpecialCharsInStr(colData[1]);
                data += "<" + colData[0] + ">" + selColData + "</" + colData[0] + ">";
            }
            data += "</row>";
        }



        //if (isCBchecked)
        //var datatbllength = $(node).find('td').prevObject.find('input[name="chkItem"]:checked').length;
        //for (var k = 0 ; k < datatbllength ; k++) {
        //    presentCB = $(node).find('td').prevObject.find('input[name="chkItem"]:checked')[k].value;
        //    data += "<row>";
        //    var rows = presentCB.split("¿");
        //    for (var i = 0; i < rows.length; i++) {
        //        var colData = rows[i].split("♣");
        //        var selColData = CheckSpecialCharsInStr(colData[1]);
        //        data += "<" + colData[0] + ">" + selColData + "</" + colData[0] + ">";
        //    }
        //    data += "</row>";
        //}
    });

    data = "<GridList>" + data + "</GridList>";
    if (data != "<GridList></GridList>") {
        try {
            changeFillGridDc = dcNo;
            callBackFunDtls = "ProcessFillGrid♠" + dcNo + "♠" + fillGridName;
            GetProcessTime();
            ASB.WebService.DoGetFillGrid(ChangedFields, ChangedFieldDbRowNo, ChangedFieldValues, DeletedDCRows, dcNo, fillGridName, data, tstDataId, SuccGetResultValue, OnException);
        } catch (ex) {
            AxWaitCursor(false);
            ShowDimmer(false);
            if (dialogObj) {
                dialogObj.dialog("close");
                $("#wrapperForMainNewData", window.parent.document).show();
            }
            var execMess = ex.name + "^♠^" + ex.message;
            showAlertDialog("error", 2030, "client", execMess);
            UpdateExceptionMessageInET("DoGetFillGridWS exception : " + ex.message);
            GetProcessTime();
            GetTotalElapsTime();
        }
    } else {
        ShowDimmer(false);
        AxWaitCursor(false);
        if (dialogObj) {
            dialogObj.dialog("close");
            $("#wrapperForMainNewData", window.parent.document).show();
        }
        GetProcessTime();
        GetTotalElapsTime();
    }
    var edTime = new Date();
    AxTimeBefSerCall = edTime - stTime;
    AxActivefillGridName = "";
}

//Callback function form the DoGetFillGrid webservice.
function SuccGetResultValue(result, eventArgs) {
    if (result != "") {
        if (result.split("*♠♠*").length > 1) {
            var serverprocesstime = result.split("*♠♠*")[0];
            var requestProcess_logtime = result.split("*♠♠*")[1];
            result = result.split("*♠♠*")[2];
            WireElapsTime(serverprocesstime, requestProcess_logtime, true);
        } else {
            UpdateExceptionMessageInET("Error : " + result);
        }
    }
    if (result.toLowerCase().indexOf("access violation") === -1) {
        var stTime = new Date();
        if (CheckSessionTimeout(result))
            return;
        //the result format -> jsonsResult*♠*dcno♣rowCnt*?*dchtml
        //First split the json and html, call assignloadvalues for json
        //second parse the html
        ParseServiceResult(result, "FillGrid");

        UpdateFldArrayInFillgrid(fillDcname);

        try {
            $('.griddivColumn ').addClass('gridFixedHeader').css({ "overflow": "auto" });
            if (typeof gridFixedHeader == "undefined" || gridFixedHeader == "true") {
                $('.griddivColumn ').addClass('gridFixedHeader').css({ "max-height": "calc(100vh - 130px)" });
                $(".gridFixedHeader table thead tr th").css({ "background": "#fff", "position": "sticky", "top": "0" });
            }
        } catch (ex) { }

        let isOverridFomrControl = true;
        if (AxRuesDefFormcontrol == "true") {
            isOverridFomrControl = AxRulesDefParser("formcontrol", "", "formcontrol");
        }
        if (appstatus != "Approved" && appstatus != "Rejected" && theMode != "design" && isOverridFomrControl) {
            DoFormControlOnload();
        }
        if (appstatus != "Approved" && appstatus != "Rejected" && theMode != "design" && isOverridFomrControl) {
            var rid = $j("#recordid000F0").val();
            if (rid != "" && rid != "0")
                DoScriptFormControl("", "On Data Load");
            else
                DoScriptFormControl("", "On Form Load");
        }
        var fldGrImage = $(".wrapperForGridData" + fillDcname + " table tbody tr td").find("textarea[id^=dc" + fillDcname + "_image]"); //$(".wrapperForGridData" + fillDcname + " table tbody tr td").find("[id^=dc" + fillDcname + "_image]");
        var fldaxpGrImage = $(".wrapperForGridData" + fillDcname + " table tbody tr td").find("textarea[id^=axp_gridattach_]");
        var fldAxpFileGrdImage = $(".wrapperForGridData" + fillDcname + " table tbody tr td").find("textarea[class^=axpAttach]");
        if (fldGrImage.length > 0) {
            fldGrImage.each(function (ind, val) {
                //if ($(val).attr("id").toLowerCase() != "dc" + fillDcname + "_imagepath") {
                if ($(val).attr("data-type") == "gridattach") {
                    let fldValue = $("textarea#" + $(val).attr("id")).text();
                    if (fldValue != "" && fldValue != undefined) {
                        ConstructAttachHTML(fldValue, $(val).attr("id"), "FillGrid");
                        showAttachmentPopover();
                    }
                }
            });
        }
        if (fldaxpGrImage.length > 0) {
            fldaxpGrImage.each(function (ind, val) {
                let fldValue = $("textarea#" + $(val).attr("id")).text();
                ConstructAttachHTML(fldValue, $(val).attr("id"), "FillGrid");
                showAttachmentPopover();
            });
        }
        if (fldAxpFileGrdImage.length > 0) {
            fldAxpFileGrdImage.each(function (ind, val) {
                if ($(val).attr("data-type") == "gridattach") {
                    let fldValue = $("textarea#" + $(val).attr("id")).text();
                    if (fldValue != "" && fldValue != undefined) {
                        ConstructAxpAttachHTML(fldValue, $(val).attr("id"), "FillGrid");
                        showAttachmentPopover();
                    }
                }
            });
        }
        var dcColumnValue = $j('#axp_colmerge_' + fillDcname + '000F1');
        dcColumnValue = dcColumnValue.val();
        if (dcColumnValue != null && dcColumnValue != '' && dcColumnValue != undefined) {
            GetGridDcTable(dcColumnValue, fillDcname);
        }

        try {
            AxAfterFillGrid();
        } catch (ex) {

        }

        fillgridColOptVisibility(fillDcname); //hide grid columns(design mode hidden columns) after filling records from fillgrid

        EvaluateSetFont(fillDcname);
        changeEditLayoutIds(FillGridFillRows, FillGridCurrentDC, 'fillGrid');
        //Refer bug - AGI003532 and IWA-C-0000020
        if (axInlineGridEdit) {
            UpdateDcRowArrays(FillGridCurrentDC, GetRowNoHelper(parseInt(FillGridFillRows, 10) + 1), "Add");
        }
        //CallAddRowWS(FillGridCurrentDC, GetRowNoHelper(parseInt(FillGridFillRows, 10)));
        var fields = GetGridFields(FillGridCurrentDC);
        var rowNo = getNewEditRowNo(FillGridCurrentDC);
        AxActiveRowNo = parseInt(rowNo);
        AxActiveDc = FillGridCurrentDC;
        if (typeof wsPerfEnabled != "undefined" && wsPerfEnabled)
            CallEvaluateOnAddPerf(FillGridCurrentDC, GetRowNoHelper(parseInt(FillGridFillRows, 10) + 1), fields, "FillGrid");
        else
            CallEvaluateOnAdd(FillGridCurrentDC, GetRowNoHelper(parseInt(FillGridFillRows, 10) + 1), fields, "FillGrid");
        AxWaitCursor(false);

        if (dialogObj) {
            dialogObj.dialog("close");
            $("#wrapperForMainNewData", window.parent.document).show();
        }
        if (AxLogTimeTaken == "true") {
            var edTime = new Date();
            var diff = edTime.getTime() - stTime.getTime();
            CreateTimeLog(AxStartTime, AxTimeBefSerCall, diff, ASBTotal, ASBDbTime, "FillGridMS");
        }
        //applyDesignJsonAgain(fillDcname);
        setDesignedLayout("#divDc" + fillDcname);
        //AlignDcElements("divDc" + fillDcname);
        FocusOnFirstGridField(fillDcname);
        customAlignTstructFlds([], FillGridCurrentDC);

        $j("textarea[id^='axpvalid']").each(function () {
            DoFormControlPrivilege($j(this).attr("id"), $j(this).val());
        });

        if (isMobile && mobileCardLayout == "none") {
            $("#wrapperForEditFields" + (fillDcname)).removeClass("d-none");
            $("#wrapperForEditFields" + (fillDcname)).addClass("mobilewrapperForEditFields");
            if ($(".wrapperForGridData" + (fillDcname) + " table tbody tr").length == 0 && !axInlineGridEdit)
                $("#colScroll" + (fillDcname)).hide();
            if (axInlineGridEdit)
                $(".editWrapTr").hide();
            $(".editLayoutFooter").hide();
            $(`#DivFrame${fillDcname} .newgridbtn`).addClass("d-none");
            let gridButton = $(`#DivFrame${fillDcname} .newgridbtn>ul`).html();
            $(`#wrapperForEditFields${fillDcname}`).append(`<div class="clearfix"></div><div class="grdButtons btnMobile"><ul class="left">${gridButton}</ul></div>`);
            $(`#wrapperForEditFields${i + 1} .btnMobile`).find(`#viewGrid${i + 1}`).addClass("d-none");
            $(".dcTitle").hide().nextAll("hr.hrline").hide();
            try {
                if (typeof designObj != "undefined" && designObj[0] != null && designObj[0].selectedLayout != null && designObj[0].selectedLayout != "" && designObj[0].selectedLayout == "tile") {
                    $(".dcTitle").show().nextAll("hr.hrline").show();
                }
            } catch (ex) { }
        }
    } else {
        AxWaitCursor(false);
        ShowDimmer(false);
        $("#reloaddiv").show();
        $("#dvlayout").hide();
    }
    GetProcessTime();
    GetTotalElapsTime();
}

function UpdateFldArrayInFillgrid(_thisDc) {
    try {
        $(".wrapperForGridData" + _thisDc + " table tbody tr").each(function () {
            $(this).find("td").each(function () {
                let _thisElId = $(this).find("textarea").attr("id");// $(this).attr("id");
                if (typeof _thisElId != "undefined" && _thisElId != "" && !_thisElId.startsWith("axp_recid" + _thisDc)) {
                    _thisElId = _thisElId.replace('EDIT~', '');
                    let _thiselVal = $(this).find("textarea").val(); //GetFieldValueNew(_thisElId);
                    UpdateAllFieldValues(_thisElId, _thiselVal);
                }
            });
        });
    } catch (ex) {

    }
}

function UpdateFldArrayInDeleteRow(_thisDc, _thisRowNo) {
    try {
        let _thisTrId = "sp" + _thisDc + "R" + _thisRowNo + "F" + _thisDc;
        $(".wrapperForGridData" + _thisDc + " table tbody tr#" + _thisTrId).each(function () {
            $(this).find("td").each(function () {
                let _thisElId = $(this).find("textarea").attr("id");
                if (AllFieldNames.length > 0 && typeof _thisElId != "undefined" && _thisElId != "") {
                    _thisElId = _thisElId.replace('EDIT~', '');
                    var idx = $j.inArray(_thisElId, AllFieldNames);
                    if (idx != -1) {
                        AllFieldValues.splice(idx, 1);
                        AllFieldNames.splice(idx, 1);
                    }
                }
            });
        });
    } catch (ex) {

    }
}

function ClearFldArrays() {
    ChangedFields.length = 0;
    ChangedFieldDbRowNo.length = 0;
    ChangedFieldValues.length = 0;
    DeletedDCRows.length = 0;
}

function ParseServiceResult(result, CalledFrom) {
    if (result != "") {
        ClearFldArrays();
        var tabResult = result.split("*♠*");
        var tabDcServiceCalled = result.split("*♠*~");
        if (tabResult[0] != undefined) {
            try {
                AssignLoadValues(tabResult[0].toString(), CalledFrom);
            } catch (ex) {
                AxWaitCursor(false);
                ShowDimmer(false);
            }
        }
        if (tabResult[2] != undefined) {
            try {
                var tempDesignObj = designObj;
                var dcDesignObj = JSON.parse(tabResult[2]);


                if ($.isEmptyObject(dcDesignObj)) {
                    designObj = tempDesignObj;
                } else {
                    //jsonText = tabResult[2];
                    var newIndex = designObj[0].dcs.map(function (obj, index) {
                        return obj.dc_id;
                    });

                    var dcIndex = newIndex.indexOf(dcDesignObj.dc_id);

                    if (dcIndex > -1) {
                        designObj[0].dcs[dcIndex] = dcDesignObj;
                    } else {
                        designObj[0].dcs = _.sortBy([...designObj[0].dcs, dcDesignObj], 'dc_id');
                    }
                }
            } catch (ex) {
                designObj = tempDesignObj;
            }
            jsonText = JSON.stringify(designObj, null, '');
        }
        if (tabResult[1] != undefined) {
            var restxt = tabResult[1].substring(0, ErrLength);

            if (restxt == ErrStr) {
                var nres = tabResult[1].substring(ErrLength, tabResult[1].length - 8);
                AxWaitCursor(false);
                showAlertDialog("error", nres);
            } else {
                AssignHTML(tabResult[1], "FillGrid", CalledFrom);
                if (changeFillGridDc != 0) {
                    CheckShowHideFldsGrid(changeFillGridDc.toString());
                    changeFillGridDc = 0;
                }
                AxWaitCursor(false);
            }
        }
        if (CalledFrom == "GetTabData" && tabDcServiceCalled != undefined) {
            if (tabDcServiceCalled.length > 1 && tabDcServiceCalled[1] == "false") {
                //refer bug - AGI003632 After selecting data from fillgrid popup ,one extra blank row is getting added on first position .(this scenario happening when grid contains expression and which is accept field)
                var dcIdx = $j.inArray(CurrTabNo.toString(), DCFrameNo);
                if (IsDcGrid(CurrTabNo) && DCHasDataRows[dcIdx] == "False")
                    UpdateAxpRowVldInArray(CurrTabNo, "001", "1");

                EvalDcFldExpressions(CurrTabNo);
            }
        }
    }
    try {
        AfterParseServiceResult(CalledFrom);
    } catch (ex) { }
    ShowDimmer(false);
    AxWaitCursor(false);
}

function EvalDcFldExpressions(dcNo) {
    var fields = GetGridFields(dcNo);
    for (var i = 0; i < fields.length; i++) {
        var fldIdnName = fields[i];
        if (fldIdnName == "axp_recid" + dcNo)
            continue;
        if (!IsGridField(fldIdnName)) {
            EvaluateAxFunction(fields[i], fldIdnName, "000F" + dcNo);
        } else {
            EvaluateAxFunction(fields[i], fldIdnName, "001F" + dcNo);
        }
    }
}

//Function which executes the partial disabling in the fill grid dc.
function DoFillControlPrivilege(strSingleLineText) {

    var rno;
    var noofrows = 1;

    if (strSingleLineText == "") {
        return;
    }

    var myfdcJSONObject = eval('(' + strSingleLineText + ')');
    for (var i = 0; i < myfdcJSONObject.root.length; i++) {

        var dcvalues = myfdcJSONObject.root[i].dc;
        var fields = dcvalues.split("###");
        var gdslno = 1;

        for (var fpar = 0; fpar < fields.length; fpar++) {

            var valSplit = fields[fpar].toString();
            valSplit = valSplit.split('~');
            rno = noofrows + "";
            var rnolength = rno.length;
            if (rnolength == 2) nrno = "0" + rno;
            else if (rnolength == 1) nrno = "00" + rno;
            else if (rnolength == 3) nrno = rno;
            nrno = nrno + 'F' + fillDcname;
            var fldVal = "";

            for (m = 0; m < valSplit.length; m++) {

                var FldSplit = valSplit[m].split("=");
                if (FldSplit[0].toString().indexOf("axpvalid") != -1) {
                    fldVal = FldSplit[1];
                }
                if (fldVal != "") {

                    var strValue = fldVal.toString().toUpperCase();
                    //B-Delete button disable
                    if (strValue == "B") {
                        //Get current img button and disabled here

                        var delImg = window.opener.document.getElementById("del" + nrno);
                        if (delImg) {
                            delImg.removeAttribute("onclick");
                            delImg.removeAttribute("onmouseover");
                            delImg.removeAttribute("onmouseout");
                        }
                    }
                    //C-Current Row disable
                    if (strValue == "C") {

                        //B-Delete button disable
                        var delImg = window.opener.document.getElementById("del" + nrno);
                        if (delImg) {
                            delImg.removeAttribute("onclick");
                            delImg.removeAttribute("onmouseover");
                            delImg.removeAttribute("onmouseout");
                        }
                        //Row disable
                        for (var l = 0; l < valSplit.length; l++) {

                            var FldSplit = valSplit[l].split("=");
                            var FieldId = window.opener.document.getElementById(FldSplit[0] + nrno);
                            if (FieldId) {
                                var id = FieldId.id;
                                window.opener.document.getElementById(id).disabled = "true";
                            }
                        }
                        break;
                    }
                }
            }
            dnrno = "'" + nrno + "'";
            noofrows = noofrows + 1;
        }
    }
}

//Function to check all the row once the header row is checked.
function CheckAll(obj, exprResult) {
    //The exprResult will contain the result of the expression evaluation.
    if (exprResult == "t" || exprResult == "true") {
        $j("input[name=chkItem]:checkbox").each(function () {
            if ($j(this).prop("disabled") == false && $j(this).parent().parent().parent().css("display") != "none")
                $j(this).prop("checked", obj.checked);
        });
    } else {
        obj.checked = false;

    }
    $j("#dvFillGrid").height($j("#dvFillGrid").height());
}

//Function to check the header checkbox is all the checkboxes are checked.
function ChkHdrCheckbox(obj, exprResult) {
    //The exprResult will contain the result of the expression evaluation.
    if (exprResult == "t" || exprResult == "true") {

        if ($j(".fgChk").parents("table.gridData tbody").find(".fgChk:visible").length == $j(".fgChk").parents("table.gridData tbody").find(".fgChk:checked").length)
            $j(".fgHdrChk").parents("table.gridData thead").find(".fgHdrChk").prop("checked", true);
        else
            $j(".fgHdrChk").parents("table.gridData thead").find(".fgHdrChk").prop("checked", false);
    } else {
        obj.checked = false;

    }

    $j("#dvFillGrid").height($j("#dvFillGrid").height());
}

function DeleteAllRows(dcNo, RowCount) {
    var rCount = parseInt(RowCount, 10);
    if (rCount > 1 && !axInlineGridEdit && AxpGridForm != "form") {
        grdRCOunt = $("#gridHd" + dcNo + " tbody tr").length;
        if (grdRCOunt == rCount)
            rCount++;
    }

    for (var i = axInlineGridEdit ? rCount : (AxpGridForm == "form") ? rCount : rCount - 1; i >= 1; i--) {
        DeleteGridRow(dcNo, GetClientRowNo(i, dcNo), "all");
    }
    if (!axInlineGridEdit && AxpGridForm == "form") {
        $("#divDc" + dcNo + " .grid-icons").append(gridDivHtml[dcNo]);
        $("#divDc" + dcNo + " .formGridRow").remove();
        if ($(".wrapperForGridData" + dcNo + " table tbody tr").length == 0)
            adjustEditLayoutId(dcNo);
        setDesignedLayout("divDc" + dcNo);
        editTheRow("", dcNo, "", event);

    } else {
        adjustEditLayoutId(dcNo);
        AxActiveRowNo = "1";
        var fields = GetGridFields(dcNo);
        if (typeof wsPerfEnabled != "undefined" && wsPerfEnabled)
            CallEvaluateOnAddPerf(dcNo, "001", fields);
        else
            CallEvaluateOnAdd(dcNo, "001", fields);

        if (!IsAddRowCalled) {
            IsDcPopGridCleared = true;
            DeleteGridRow(dcNo, "001F" + dcNo, undefined);
        } else {
            if (!axInlineGridEdit) {
                UpdateDcRowArrays(dcNo, "001", "Add");
            }
        }
    }
}

function ChangeDir(dir) {
    $j("#form1").attr("dir", dir);
}

function LoadPdfDDL(ddlStr) {
    document.getElementById("dvPdfDDl").innerHTML = ddlStr;
}

function bindUpdownEvents(idOfTheElement, typeOfSelect) {
    unbindKeyDownEvent();
    if (typeOfSelect != 'single') {
        $("#" + idOfTheElement + " input[type='checkbox']").each(function () {
            $(this).parents('td,th').addClass('text-center');
        });

    }
    if (jQuery("#" + idOfTheElement + " tr:nth-child(2)").length > 0) {
        //jQuery("#" + idOfTheElement + " tr:nth-child(2)").addClass('activeSearchTr').find("input").focus();
    }
    if (jQuery('#' + idOfTheElement).length > 0) {
        jQuery("#" + idOfTheElement).on("keydown.tstrctSrch", "tr:not(:first)", function (event) {
            var elemm = $(this);
            $(elemm).addClass('activeSearchTr');
            if (event.keyCode == 9 && !event.shiftKey) {

                if (jQuery("#" + idOfTheElement).find('tr.activeSearchTr').prevAll("tr:visible").length > 0) {
                    if (typeOfSelect == "multiple") {
                        checkTheHeight(idOfTheElement, elemm, 'bottom');
                    }

                    if ($(elemm).next().is("tr")) {
                        jQuery("#" + idOfTheElement).find('tr.activeSearchTr').removeClass('activeSearchTr');
                        $(elemm).next().addClass('activeSearchTr');
                        jQuery('.activeSearchTr').find("input").focus();
                        event.preventDefault();
                    }
                }

            } else if (event.keyCode == 9 && event.shiftKey) {
                if (jQuery("#" + idOfTheElement).find('tr.activeSearchTr').prevAll("tr:visible").length > 0) {
                    if (typeOfSelect == "multiple") {
                        checkTheHeight(idOfTheElement, elemm, 'top');
                    }

                    if ($(elemm).prev().is("tr") && (!$(elemm).prev().is("#" + idOfTheElement + " tr:first"))) {
                        jQuery("#" + idOfTheElement).find('tr.activeSearchTr').removeClass('activeSearchTr');
                        $(elemm).prev().addClass('activeSearchTr');
                        jQuery('.activeSearchTr').find("input").focus();
                        event.preventDefault();
                    }
                }

            } else if (event.keyCode == 38) {
                //up arrow
                event.preventDefault();
                var index = jQuery("#" + idOfTheElement).find('tr.activeSearchTr').index();
                if (index != 0 && jQuery("#" + idOfTheElement).find('tr.activeSearchTr').prevAll("tr:visible").length > 0) {
                    if (typeOfSelect == "multiple") {
                        checkTheHeight(idOfTheElement, elemm, 'top');
                    }
                    jQuery("#" + idOfTheElement).find('tr.activeSearchTr').removeClass('activeSearchTr').prevAll("tr:visible:first").addClass('activeSearchTr').find("input").focus();
                }
            } else if (event.keyCode == 40) {
                //down arrow
                if (typeOfSelect == "single") {
                    event.preventDefault();
                }
                var presntIndex = jQuery("#" + idOfTheElement).find('tr.activeSearchTr').index();

                var lstIndex = jQuery("#" + idOfTheElement).find('tr').last().index();
                if (presntIndex < lstIndex && jQuery("#" + idOfTheElement).find('tr.activeSearchTr').nextAll("tr:visible").length > 0) {
                    if (typeOfSelect == "multiple") {
                        checkTheHeight(idOfTheElement, elemm, 'bottom');
                    }
                    jQuery("#" + idOfTheElement).find('tr.activeSearchTr').removeClass('activeSearchTr').nextAll("tr:visible:first").addClass('activeSearchTr').find("input").focus();
                }
            } else if (event.keyCode == 32) {
                if ($(event.target).attr('id') != "searchInput") {
                    //event.preventDefault();
                    //jQuery("#" + idOfTheElement + " tr.activeSearchTr input").click();
                    if (typeOfSelect == "single") {
                        unbindKeyDownEvent();
                    }
                }
            } else if (event.keyCode == 13 && $(event.target).attr('id') != "searchInput") {
                if (typeOfSelect == "multiple") {
                    event.preventDefault();
                    unbindKeyDownEvent();
                    //here we have to hit the ok button
                    $('#dvFillGrid').parents('.modal-body').next().find("#modalCnfirmbtn").click();

                } else {
                    jQuery("#" + idOfTheElement + " tr.activeSearchTr input").click();
                    if (typeOfSelect == "single") {
                        unbindKeyDownEvent();
                    }
                }
                unbindKeyDownEvent();
            }

        });

        jQuery("#" + idOfTheElement).on("keydown.tstrctSrch", "tr:first", function (event) {
            if (event.keyCode == 13) {
                $('#dvFillGrid').parents('.modal-body').next().find("#modalCnfirmbtn").click();
            }
        });

        jQuery("#" + idOfTheElement + " tr").hover(function () {
            /* Stuff to do when the mouse enters the element */
            jQuery("#" + idOfTheElement + " tr.activeSearchTr").removeClass('activeSearchTr');
            // jQuery(this).addClass('activeSearchTr').find("input").focus();
            //jQuery('.activeSearchTr').find("input").focus();
        }, function () {
            /* Stuff to do when the mouse leaves the element */
        });

        jQuery("#" + idOfTheElement + " tr").click(function (event) {
            if (typeOfSelect == "single") {
                unbindKeyDownEvent();
            }
            if ($(event.target).attr('type') != "checkbox" && $(event.target).attr('type') != "radio" && $(this).parent("thead").length == 0) {
                typeOfSelect == "single" ? jQuery(this).find('input[type="radio"]').click() : jQuery(this).find('input[type="checkbox"]').click();
            }
        });

    }
}

function checkTheHeight(idOfTheElement, elemm, direction) {
    var heightOfFrame = parseInt(jQuery("#dvFillGrid").parents('.modal-body-content').css('height').replace("px", ""));
    var frameScrollTop = jQuery("#dvFillGrid").parents('.modal-body-content').scrollTop();
    var currentTr = $(elemm);
    var nextTrheight = $(elemm).next().height();
    var prevTrheight = $(elemm).prev().height();
    var topOfCurrentTr = currentTr.position().top;
    // event.preventDefault();
    if (direction == "bottom") {
        if ((topOfCurrentTr + nextTrheight + 50) > heightOfFrame) {
            jQuery("#dvFillGrid").parents('.modal-body-content').animate({
                scrollTop: frameScrollTop + nextTrheight + 30
            }, 'fast');
        }
    } else if (direction == "top") {
        if ((topOfCurrentTr - prevTrheight) < 0) {
            jQuery("#dvFillGrid").parents('.modal-body-content').animate({
                scrollTop: frameScrollTop - prevTrheight - 30
            }, 'fast');
        }
    }
}

function unbindKeyDownEvent() {
    jQuery(document).unbind("keydown.tstrctSrch");
}


$('body').on('click', function (e) {
    $('[data-toggle=popover]').each(function () {
        // hide any open popovers when the anywhere else in the body is clicked
        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
            $(this).popover('hide');
        }
    });
});

// Searching for input filed with partial id 'axp_colmerge_dcno'
$j(function () {
    //Works only on active fields available on pageload.
    for (var i = 0; i < VisibleDCs.length; i++) {
        if (DCIsGrid[i].toLowerCase() == "true") {
            if ($j('#axp_colmerge_' + VisibleDCs[i] + '000F1').length > 0) {
                var dcColumnValue = $j('#axp_colmerge_' + VisibleDCs[i] + '000F1');
                dcColumnValue = dcColumnValue[0].value;
                if (dcColumnValue != null && dcColumnValue != '' && dcColumnValue != undefined) {
                    GetGridDcTable(dcColumnValue, VisibleDCs[i]);
                }
            }
        }
    }
});

/// get the column values and the dc id...
function GetGridDcTable(strCond, dcNo) {

    //Generate Id according to the dcNo.
    var iDtoFind = 'gridHd' + dcNo;
    var table = document.getElementById(iDtoFind);
    var arrMainHeader = strCond.split('#'); // Split each value from string to create arrays.
    var htmlConcat = table.outerHTML;
    htmlConcat = htmlConcat.replace(iDtoFind, 'mergeHd' + dcNo); // assign html to the table with id as MergeHD + dc name for further changes.
    $j('#' + iDtoFind).before(htmlConcat);

    var mergeTable = $j('#mergeHd' + dcNo);
    var tableCells = mergeTable[0].childNodes[0].childNodes[0].childNodes;
    var count = 0;

    // loop through each table cell then checking it the array of columns to be merged...
    for (var j = 0; j < tableCells.length; j++) {
        var mergeRowContent = arrMainHeader[0].split(',').toString();
        var columns = mergeRowContent.substr(mergeRowContent.indexOf("~") + 1);
        var arrColumns = columns.split(',');
        var mainHeader = mergeRowContent.split("~", 1).toString();
        // loop through each arrColumn to check if the value is equal to the table cell.
        for (var k = 0; k < arrColumns.length; k++) {
            var selectedItem = tableCells[j];
            selectedItem.innerHTML = '';
            thName = "th-" + arrColumns[k];
            if (selectedItem.id == thName) {
                SetHeader(arrColumns, k, mainHeader);
                if (arrMainHeader.length > 1) {
                    arrMainHeader.splice(0, 1);
                }
                j = (j + arrColumns.length) - 1;
            }
            break;
        }
    }
}

//Clear inner html for each table cell and headers
function SetHeader(arrColumns, index, mainHeader) {

    for (var o = 0; o < arrColumns.length; o++) {
        theadName = "th-" + arrColumns[index + o];
        var selectedItem = document.getElementById(theadName);

        //change the color of the border to grey only if the element is not the last in array.
        if ((o - (arrColumns.length - 1)) != 0) {
            selectedItem.style.borderColor = 'grey';
        }
        if (o == 0) {
            selectedItem.innerHTML = '<div id="div-' + arrColumns[0] + '"><b style="font-weight:101">' + mainHeader + '</b></div>';
            selectedItem.style.borderBottom = 'solid 1px white';
            selectedItem.style.maxWidth = selectedItem.style.width;
        } else {
            selectedItem.innerHTML = "";
            selectedItem.style.borderBottom = 'solid 1px white';
        }
    }


    SetHeaderWidth(arrColumns, arrColumns[0], index);
}


//Set Width to the header..
function SetHeaderWidth(arrColumns, divID, index) {

    var totalWidth = parseInt(0);
    var currenElementWidth = parseInt(0);
    var selectedDiv = $j('#div-' + divID);
    for (var i = 0; i < arrColumns.length; i++) {
        theadName = "th-" + arrColumns[index + i];
        currenElementWidth = parseInt(document.getElementById(theadName).offsetWidth);
        totalWidth = (totalWidth + currenElementWidth);
    }

    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        var selectedDiv = document.getElementById('div-' + divID);
        //replace space with a line break for the header to be aligned.
        if (selectedDiv.childNodes[0].innerHTML.indexOf("_") > -1) {
            selectedDiv.style.width = totalWidth + "px";
            selectedDiv.style.maxWidth = totalWidth + "px";
            selectedDiv.childNodes[0].innerHTML = selectedDiv.childNodes[0].innerHTML.replace(/_/g, " ");
        } else {
            selectedDiv.style.width = totalWidth + "px";
            selectedDiv.style.maxWidth = totalWidth + "px";
        }
    } else {
        var selectedDiv = $j('#div-' + divID);
        //replace space with a line break for the header to be aligned.
        if (selectedDiv[0].innerText.indexOf("_") > -1) {
            selectedDiv.css({
                width: totalWidth,
                maxWidth: totalWidth
            });

            selectedDiv[0].innerText = selectedDiv[0].innerText.replace(/_/g, " ");

        } else {
            totalWidth = (totalWidth * 40) / 100;
            selectedDiv.css({
                marginLeft: totalWidth
            });
        }
    }

}

// This file contains the popup grid related functions.
//
//------------------List of functions in this file--------------------------------------------
//OpenPopUp(parentfldName, popDcNo) -Function to display the popUp for the current parent row.
//ClosePopUp(popDcNo, validate) -Function to hide the opened pop up.
//ClearPopUp(popDcNo) -Function which deletes all the rows except the first row, and clears the values in  the first row.
//UpdatePopUpParents(fieldName) -Function to update the changed value of the parent into the arrays.
//CheckDuplicateParents(dcNo, ParentFlds, parentStr) -Function to check for duplicate entries in the parent grid for the parent fields.
//SetPopParents(parentDcNo, popDcNo, parentRowNo, parentStr) -Function to set the concatenated parent value to the array.
//ShowPopUpDiv(dcNo) -Function to set the dimmer on the tstruct, set pop up position and display the popup.
//DisableDeleteForFirmDc(isFirm, popDcNo, rowNo) -Function to diable the delete button in the pop dc if the dc is firm bind.
//DisplaySummaryInPopUp(popDcNo) -Function to display the summary defined for the pop grid.
//GetPopRows(parentDcNo, ParentRowNo, popDcNo) -Function to get the sub grid rows for the current active parent row.
//ClearPopRows(parentDc, parentRow, popDc) -Function to clear the poprows for the given parent row and dc no.
//AddDeletePopRow(parentDcNo, parentRowNo, popDcNo, popRowNo) -Function to add a new row for the given pop up dc no.
//Ax_BeforeHidePopUp(dcNo) -Function to customize validations before closing the popup.
//IsEmptyRow(rowNo, dcNo) -Function which returns true if the given row is empty.
//SetPopDcStyle(PopDcNo, isFirm) -Function to set style for the pop grid dc if firm bind.
//RegisterActivePRow(clientRowNo, pDcNo) -Function to set the Parents active row to the global variable.
//IsPopGridFirmBind(popDcNo) -Function returns true if the PopDc has firm bind attribute as true.
//DisplayHidePopRow(rowNo, style) -Function to Display or hide the row html in the subgrid.
//GetParentFields(popDcNo) -Function to get the parent fields for the given pop dc.
//GetParentString(parentDcNo, parentRow, popDc) -Function to get the parent values concatenated string for the given parent and pop dc.
//GetPopGrids(parentDcNo) -Function which returs the pop grids for the current parent dc.
//AddParentRow(parentDcNo, parentRowNo, popDcNo, parentStr) -Function which adds the parent row info to the pop arrays.
//UpdatePopUpArrays(dcNo, rowNo, isPopDc) -Function which updates the popRows and rowno arrays for the newly added row.

//---------------------------------------------------------------------------------------------
var popUpTitle = "";
//Function to display the popUp for the current parent row.
function OpenPopUp(parentfldName, popRowDcNo) {

    var pRowNo = GetFieldsRowNo(parentfldName);
    var parentDcNo = GetFieldsDcNo(parentfldName);
    AxActivePDc = parentDcNo;
    RegisterActivePRow(pRowNo, parentDcNo);
    AxIsPopActive = true;
    var popDcNo = popRowDcNo.substring(popRowDcNo.lastIndexOf("F") + 1);
    AxActiveDc = popDcNo;

    var pIdx = $j.inArray(popDcNo, PopGridDCs); //PopCondition
    if (pIdx != -1) {
        var result = "f";
        if (PopCondition[pIdx] != "") {
            result = EvalPrepared("", "000", PopCondition[pIdx], "expr");
            if (result.toLowerCase() == "f") {
                showAlertDialog("error", 2006, "client");
                return;
            }
        }
    }

    var isPopFirm = IsPopGridFirmBind(popDcNo);
    SetPopDcStyle(popDcNo, isPopFirm);
    var popRowStr = GetPopRows(parentDcNo, pRowNo, popDcNo);
    var popRows = popRowStr.split(",");
    var rowCntFld = "#hdnRCntDc" + popDcNo;
    var popRowCnt = 0;
    popRowCnt = parseInt($j(rowCntFld).val(), 10);

    popUpTitle = $j("#popDcTitle" + popDcNo).val();
    popUpTitle = "<span style='font-size: 20PX;color: white;font-weight: bold;'>" + popUpTitle + "</span>";


    //hide all rows in the table
    $j("#gridDc" + popDcNo + " tbody tr").each(function () {
        var tRow = $j(this);
        $j(this).hide();
    });

    for (var j = 0; j < popRows.length; j++) {
        var rowId = "#sp" + popDcNo + "R" + popRows[j] + "F" + popDcNo;
        $j(rowId).show();
    }

    if ($j(".AxAddRows").length > 0)
        $j(".AxAddRows").val('1');
    //This condition checks
    //If the parent row does not have any sub grid row
    //All the parent fields are bound in the parent row
    if (popRowStr == "" && IsPopParBound(popDcNo, parentDcNo, pRowNo) == true) {

        var newRowNo = "";
        var rCnt = GetDcRowCount(popDcNo);
        if (rCnt == 1 && IsEmptyRow("001", popDcNo)) {
            var isOldRow = IsRowInPopRows(parentDcNo, popDcNo, pRowNo, "001");
            if (isOldRow == false) {
                newRowNo = 1;
                UpdatePopUpArrays(popDcNo, "001", true, "Add");
                UpdatePopParentFlds(popDcNo, parentDcNo, "001", pRowNo);
                SetRowCount(popDcNo, "1");
                $j("#sp" + popDcNo + "R" + "001" + "F" + popDcNo).show();
                RefreshFillFldsInSubGrid(popDcNo, "001");
                AxActiveRowNo = "1";
                CallGetSubGridDDL(popDcNo, pRowNo, parentDcNo, "001");
            }
        } else {
            AddSubGridRow(popDcNo);
        }
    } else {
        //for all the fill fields in the subgrid, if there is a parent in the nongrid, call combofilldep

        RefreshFillFldsInSubGrid(popDcNo, popRowStr);
        $j("#DivFrame" + popDcNo).dialog({
            title: popUpTitle,
            height: 400,
            width: 550,
            close: function () {
                ClosePopUp(popDcNo);
            },
            position: 'top',
            modal: true,
            buttons: {
                "Ok": function () {
                    ClosePopUp(popDcNo, $j(this));
                }
            }
        });
    }
}

//Function to refresh the fields in the subgrid which have the combo parents in the primary dc.
function RefreshFillFldsInSubGrid(dcNo, rowStr) {
    var fields = GetGridFields(dcNo);
    for (var i = 0; i < fields.length; i++) {
        var idx = GetFieldIndex(fields[i]);
        var parentStr = FldParents[idx].toString().split(",");
        if (FMoe[idx] == "Fill" && parentStr != "") {

            for (var j = 0; j < parentStr.length; j++) {
                var parDcNo = GetDcNo(parentStr[j]);
                if (!IsDcGrid(parDcNo) && $j.inArray(parentStr[j], ComboParentField) != -1) {
                    var pFldValue = GetFieldValue(parentStr[j] + "000F" + parDcNo);
                    var fieldID = parentStr[j] + "000F" + parDcNo;
                    var fName = parentStr[j];


                    for (var ind = 0; ind < ComboParentField.length; ind++) {
                        //var parFldName = GetFieldsName(ComboParentField[i]);
                        if (ComboParentField[ind] == fName && ComboParentValue[ind] == pFldValue) {
                            var strRows = rowStr.split(",");
                            for (var k = 0; k < strRows; k++) {
                                if (strRows[k] == "")
                                    continue;

                                var rowFrameNo = strRows[k] + "F" + dcNo;
                                var dbRowNo = GetDbRowNo(strRows[k], dcNo);

                                var depFldId = ComboDepField[ind] + rowFrameNo;
                                var depFldValue = ComboDepValue[ind].toString();
                                var depFld = $j("#" + depFldId);
                                if (depFld.length > 0) {
                                    CallSetFieldValue(depFldId, depFldValue);
                                    UpdateFieldArray(depFldId, dbRowNo, depFldValue, "parent");
                                }
                            }
                            break;
                        }
                    }
                }
            }
        }
    }
}

function AddSubGridRow(dcNo, calledFrom) {
    var tableName = "gridDc" + dcNo;
    var newRow = "";
    var sTRowIndx = -1;
    newRow = $j('#' + tableName + ' tbody>tr:last').clone(true);
    var oldRowNo = newRow.attr("id");

    var hdnRowCount = $j("#hdnRCntDc" + dcNo);
    if (hdnRowCount.length > 0) {

        var dcClientRows = GetDcClientRows(dcNo);
        var lastRow = dcClientRows.getMaxVal();
        var rowCount = $j("#hdnRCntDc" + dcNo).val();
        var newCnt = parseInt(lastRow, 10) + 1;
        var newRowNo = GetRowNoHelper(newCnt);
        newRow.attr("id", "sp" + dcNo + "R" + newRowNo + "F" + dcNo);
        newRow.find(':input').val('');
        newRow.find('select,input,label,img,.Grdlnk').each(function () {
            ConvertFieldID($j(this), newRowNo);
        });

        RegisterActiveRow(newRowNo, dcNo);
        AxActiveDc = dcNo;
        var glType = eval(callParent('gllangType'));
        var dtpkrRTL = false;
        if (glType == "ar")
            dtpkrRTL = true;
        else
            dtpkrRTL = false;
        var glCulture = eval(callParent('glCulture'));
        var dtFormat = "dd/mm/yy";
        if (glCulture == "en-us")
            dtFormat = "mm/dd/yy";
        $j(".date").datepicker({
            isRTL: dtpkrRTL,
            dateFormat: dtFormat,
            showOn: "both",
            buttonImage: "../AxpImages/icons/16x16/calendar.png",
            buttonImageOnly: true,
            buttonText: "Select date",
            changeMonth: true,
            changeYear: true,
            yearRange: "-100:+100"
        });
        delImg = newRow.find('.rowdelete');
        if (delImg.attr("id") != undefined)
            delImg.attr("id", ("del" + newRowNo + "F" + dcNo));
        newRow.insertAfter('#' + tableName + ' tbody>tr:last');
        $j("#sp" + dcNo + "R" + newRowNo + "F" + dcNo).show();

        //TODO: the SetRowCount need not be called
        //if the web service is returning the row since it is already updated in the server array.
        if (calledFrom == undefined)
            SetRowCount(dcNo, newCnt, "i" + newRowNo);
        else
            SetRowCount(dcNo, parseInt(rowCount, 10) + 1);

        if (calledFrom == "GetDep")
            UpdateNewPopInfo(dcNo, newRowNo);

        var rowFrameNo = newRowNo + "F" + dcNo;
        //On clearing the rows, the row will be added to the DeletedDCRows,
        //if you add the same row agian then the row should be removed from the DeletedDCRows

        var ind = $j.inArray(rowFrameNo, DeletedDCRows);
        if (ind != -1)
            DeletedDCRows.splice(ind, 1);

        CheckScroll(dcNo);

        UpdateDcRowArrays(dcNo, newRowNo, "Add");
        if (calledFrom == undefined) {
            UpdateFieldsInNewRow(dcNo, newRowNo);
            UpdatePopParentFlds(dcNo, AxActivePDc, newRowNo, GetClientRowNo(AxActivePRow, AxActivePDc));
        }
        IsFunction = "";

        if (calledFrom == "GetDep") {
            if (AxParStrFromDep != "") {
                var parStr = AxParStrFromDep.split("~");
                var parDc = parStr[0];
                var pRow = GetClientRowNo(parStr[1], parDc);
                UpdatePopUpArrays(dcNo, newRowNo, true, "Add", pRow, parDc);
            } else
                UpdatePopUpArrays(dcNo, newRowNo, true, "Add");
        } else
            UpdatePopUpArrays(dcNo, newRowNo, true, "Add");

        if (calledFrom == undefined) {
            RefreshFillFldsInSubGrid(dcNo, newRowNo);
            if (subGridJson == "")
                CallGetSubGridDDL(dcNo, AxActivePRow, AxActivePDc, newRowNo);
            else
                ApplyPopJson(dcNo);
        }

        adjustwin("10", window);
    }
}

function CallGetSubGridDDL(popDcNo, pRowNo, parentDcNo, newRowNo) {
    try {
        var recId = $j("#recordid000F0").val();
        ASB.WebService.GetSubGridDropdown(ChangedFields, ChangedFieldDbRowNo, ChangedFieldValues, DeletedDCRows, popDcNo, tstDataId, recId, pRowNo, parentDcNo, newRowNo, SuccessSubGridCombos, OnException);
    } catch (exp) {
        AxWaitCursor(false);
        showAlertDialog("error", ServerErrMsg);
    }
}

var subGridJson = "";

function SuccessSubGridCombos(result, eventArgs) {
    if (CheckSessionTimeout(result))
        return;
    ChangedFields = new Array();
    ChangedFieldDbRowNo = new Array();
    ChangedFieldValues = new Array();
    DeletedDCRows = new Array();
    if (result != "") {
        subGridJson = result;
        var dcClientRows = GetDcClientRows(AxActiveDc);
        AxPopRowNo = dcClientRows.getMaxVal();
        AssignLoadValues(result, "PopGridCombos");
        try {
            AxAfterSubGridAddRow();
        } catch (ex) { }
        $j("#DivFrame" + AxActiveDc).dialog({
            title: popUpTitle,
            height: 400,
            width: 550,
            close: function () {
                ClosePopUp(AxActiveDc);
            },
            position: 'top',
            modal: true,
            buttons: {
                "Ok": function () {
                    ClosePopUp(AxActiveDc, $j(this));
                }
            }
        });
    }
}

function ApplyPopJson(dcNo) {
    var dcClientRows = GetDcClientRows(dcNo);
    AxPopRowNo = dcClientRows.getMaxVal();
    AssignLoadValues(subGridJson, "PopGridCombos");
    UpdateRowInDataObj();
    try {
        AxAfterSubGridAddRow();
    } catch (ex) { }
}

//Function returns true if this row is assigned to a dc in the pop rows arrays.
function IsRowInPopRows(parDcNo, popDcNo, parRow, popRowNo) {
    var popRows = GetPopRows(parDcNo, parRow, popDcNo);
    var popRowStr = popRows.split(",");
    for (var i = 0; i < popRowStr.length; i++) {
        if (popRowStr[i] == popRowNo) {
            return true;
        }
    }

    return false;
}

//Function to check if the parent fields have empty value and return true.
//This function will not take care of integer fields.
function IsPopParBound(popDcNo, parDcNo, parRowNo) {
    var parFldsStr = GetParentFields(popDcNo);
    var isParBound = true;
    for (var i = 0; i < parFldsStr.length; i++) {
        var parFld = parFldsStr[i] + parRowNo + "F" + parDcNo;
        var parValue = GetFieldValue(parFld);
        //TODO: the try catch block needs to be removed.
        try {
            parValue = parseFloat(parValue);
        } catch (ex) { }
        if (parValue.toString() == "") {
            isParBound = false;
            break;
        }
    }
    return isParBound;
}

//function which sets the parent field values from the given parent row to the given rows pop fields.
function UpdatePopParentFlds(popDcNo, parDcNo, popRowNo, parRowNo) {
    var parFldsStr = GetParentFields(popDcNo);
    for (var i = 0; i < parFldsStr.length; i++) {
        var parFld = parFldsStr[i].toString().trim() + parRowNo + "F" + parDcNo;
        var popGridField = GetSubFieldId("sub" + popDcNo + "_" + parFldsStr[i].toString(), popRowNo, popDcNo);
        var parValue = GetFieldValue(parFld);
        SetFieldValue(popGridField, parValue);
        var clientRowNo = GetDbRowNo(popRowNo, popDcNo);
        UpdateFieldArray(popGridField, clientRowNo, parValue, "parent");
    }
}

//This function should be called on close popup to refresh all expression dependent fields outside the pop up.
function EvaluateSubGridDep(popDcNo) {
    var fields = GetGridFields(popDcNo);
    for (var i = 0; i < fields.length; i++) {

        var fldInd = GetFieldIndex(fields[i]);
        if (fldInd != -1) {
            depStr = FldDependents[fldInd].toString();
        }
        var depArray;
        if (depStr != "") {
            depArray = depStr.split(",");

            if (depArray != undefined) {
                for (var di = 0; di < depArray.length; di++) {

                    var dField = depArray[di].toString();
                    var depFirstChar = dField.substring(0, 1);
                    var depfName = dField.substring(1);
                    var depFldDc = GetDcNo(depfName);

                    if (popDcNo != depFldDc) {
                        if (depFirstChar == 'e') {
                            EvaluateAxFunction(depfName, fields[i] + AxActiveRowNo + "F" + popDcNo);
                        }
                    }
                }
            }
        }
    }
}

//Function to hide the opened pop up.
function ClosePopUp(popDcNo, dialogObj) {

    var popRows = GetPopRows(AxActivePDc, GetClientRowNo(AxActivePRow, AxActivePDc), popDcNo).split(",");
    if (popRows.length != 1) {
        for (var i = popRows.length - 1; i >= 0; i--) {
            var rCnt = GetDcRowCount(popDcNo);
            if (popRows[i].toString() != "") {
                if (IsEmptyRow(popRows[i], popDcNo) && rCnt != 1) {
                    DeletePopRow(popDcNo, popRows[i]);
                }
            }
        }
    }
    if ($j("#dvPickList").is(':visible')) $j("#dvPickList").hide();
    AxIsPopActive = false;
    if (dialogObj != undefined)
        dialogObj.dialog("close");
    var parentFld = $j("#" + AxActiveField);
    if (parentFld.length > 0)
        parentFld.focus();
    subGridJson = "";
    EvaluateSubGridDep(popDcNo);
    DisplaySummaryInPopUp(popDcNo);
}

//Function to delete the default pop row in the popgrid.
function DeletePopRow(popDcNo, popRow) {

    var slNo = GetSerialNoCnt(popDcNo);
    slNo = parseInt(slNo, 10) - 1;
    SetSerialNoCnt(popDcNo, slNo);
    var rowCnt = GetDcRowCount(popDcNo);

    var rowFrmNo = popRow + "F" + popDcNo;
    UpdateDcRowArrays(popDcNo, popRow, "Delete");
    var flds = GetGridFields(popDcNo);
    for (var j = 0; j < flds.length; j++) {
        var fld = flds[j] + rowFrmNo;
        RemoveDeletedFields(fld);
    }

    var rowId = "sp" + popDcNo + "R" + popRow + "F" + popDcNo;
    $j("#" + rowId).remove();
    UpdatePopUpArrays(popDcNo, popRow, true, "Delete");
    var rCnt = GetDcRowCount(popDcNo);
    SetRowCount(popDcNo, rCnt - 1);
}

//Function to update the changed value of the parent into the arrays.
function UpdatePopUpParents(fieldName) {
    var fName = GetFieldsName(fieldName);
    var fldDcNo = GetFieldsDcNo(fieldName);
    var fldRowNo = GetFieldsRowNo(fieldName);
    var parentRowNo = fldRowNo;
    for (var i = 0; i < PopParentDCs.length; i++) {
        if (PopParentDCs[i] == fldDcNo) {
            popParentFlds = PopParentFlds[i].toString().split(",");
            var parentStr = "";
            parentStr = GetParentString(fldDcNo, parentRowNo, PopGridDCs[i]);

            var isParentForPop = false;
            var subParFlds = GetParentFields(PopGridDCs[i]);
            for (var parIdx = 0; parIdx < subParFlds.length; parIdx++) {
                if (subParFlds[parIdx] == fName) {
                    isParentForPop = true;
                    break;
                }
            }
            if (!isParentForPop)
                continue;

            //Check for duplicate parents in the parent dc.
            if (CheckDuplicateParents(fldDcNo, popParentFlds, parentStr, PopGridDCs[i], parentRowNo) && parentStr != "") {
                errorFlag = true;
                errorField = fieldName;
                return;
            }

            // replace the old value in the poprows array with parentstr for each of its pop grid.
            SetPopParents(fldDcNo, PopGridDCs[i], parentRowNo, parentStr);

            var popDcNo = PopGridDCs[i];
            var strGridRows = GetPopRows(fldDcNo, parentRowNo, popDcNo);
            var subGrdRows = strGridRows.split(",");

            var newParValue = GetFieldValue(fieldName);

            for (var j = 0; j < subGrdRows.length; j++) {
                if (subGrdRows[j].toString() != "") {
                    var parFldId = GetSubFieldId("sub" + popDcNo + "_" + fName, subGrdRows[j].toString(), popDcNo);
                    parFldId = "#" + parFldId;
                    try {
                        var popFldId = parFldId.substring(1);
                        SetFieldValue(popFldId, newParValue);

                        var dbRowNo = GetDbRowNo(subGrdRows[j].toString(), popDcNo)
                        UpdateFieldArray(popFldId, dbRowNo, newParValue, "parent");
                    } catch (ex) { }
                }
            }
        }
    }
}

//Function to check for duplicate entries in the parent grid for the parent fields.
function CheckDuplicateParents(dcNo, ParentFlds, parentStr, popGridDc, parentRowNo) {

    var isDuplicate = false;
    var rowCount = 0;
    rowCount = parseInt(GetDcRowCount(dcNo), 10);

    for (var i = 1; i < rowCount; i++) {
        var rowNo = GetRowNoHelper(i);
        var rowParentStr = "";
        rowParentStr = GetParentString(dcNo, rowNo, popGridDc);
        if (rowParentStr == parentStr && i != parseInt(parentRowNo, 10))
            isDuplicate = true;
    }
    return isDuplicate;
}

//Function to set the concatenated parent value to the array.
function SetPopParents(parentDcNo, popDcNo, parentRowNo, parentStr) {
    for (var i = 0; i < ParentDcNo.length; i++) {
        if (ParentDcNo[i] == parentDcNo && PopGridDcNo[i] == popDcNo && ParentClientRow[i] == parentRowNo) {
            PopParentsStr[i] = parentStr;
        }
    }
}

//Function to display the summary defined for the pop grid.
function DisplaySummaryInPopUp(popDcNo) {

    var pIndx = -1;
    var i = 0;
    for (i = 0; i < PopGridDCs.length; i++) {
        if (PopGridDCs[i] == popDcNo) {
            pIndx = i;
            break;
        }
    }
    var parentFld = "";
    var summaryColumn = "";
    var delimiter = "";
    var summaryValue = "";
    if (pIndx != -1) {

        parentFld = PopSummaryParent[pIndx];
        summaryColumn = PopSummaryFld[pIndx];
        delimiter = PopSummDelimiter[pIndx] == "" ? "," : PopSummDelimiter[pIndx];
    }

    if (summaryColumn.indexOf(":") != -1) {
        summaryColumn = summaryColumn.replace(":", "");
    }
    var popRowStr = GetPopRows(AxActivePDc, GetClientRowNo(AxActivePRow, AxActivePDc), popDcNo);
    var popRows = popRowStr.split(",");

    for (var j = 0; j < popRows.length; j++) {
        var SummaryFld = summaryColumn + popRows[j] + "F" + popDcNo;
        SummaryFld = $j("#" + SummaryFld);
        if (SummaryFld.length > 0)
            summaryValue += SummaryFld.val() + delimiter;
    }
    summaryValue = summaryValue.substring(0, summaryValue.length - 1);
    parentFld = parentFld + GetClientRowNo(AxActivePRow, AxActivePDc) + "F" + AxActivePDc;
    if ($j("#" + parentFld).length > 0)
        $j("#" + parentFld).val(summaryValue);
}


//General Pop grid functions
//-----------------------------------------------------------------------
//Function to get the sub grid rows for the current active parent row.
function GetPopRows(parentDcNo, parentRowNo, popDcNo) {
    var popRows = "";
    for (var i = 0; i < ParentDcNo.length; i++) {
        if (ParentDcNo[i] == parentDcNo && ParentClientRow[i] == GetRowNoHelper(parentRowNo) && PopGridDcNo[i] == popDcNo) {
            popRows = PopRows[i];
            break;
        }
    }
    return popRows;
}

//Function to clear the poprows for the given parent row and dc no.
function ClearPopRows(parentDc, parentRow, popDc) {
    for (var i = 0; i < ParentDcNo.length; i++) {
        if (ParentDcNo[i] == parentDc && ParentClientRow[i] == parentRow && PopGridDcNo[i] == popDc) {
            PopRows[i] = "";
        }
    }
}

//Function to add a new row for the given pop up dc no.
function AddDeletePopRow(parentDcNo, parentRowNo, popDcNo, popRowNo, action) {

    var IsParentFound = false;
    var IsPDcFound = false;
    var IsFound = false;

    for (var i = 0; i < ParentDcNo.length; i++) {

        if (ParentDcNo[i] == parentDcNo) {

            if (ParentClientRow[i] == parentRowNo) {

                if (PopGridDcNo[i] == popDcNo) {
                    IsFound = true;
                    var tmpPopRows = PopRows[i].toString();
                    if (action == "Add") {
                        if (tmpPopRows == "")
                            tmpPopRows = popRowNo;
                        else {
                            var tmpRows = tmpPopRows.split(",");
                            var indx = $j.inArray(popRowNo, tmpRows)
                            if (indx == -1) {
                                tmpPopRows += "," + popRowNo;
                            }
                        }
                        PopRows[i] = tmpPopRows;
                    } else {
                        tmpPopRows = tmpPopRows.split(",");
                        for (var j = tmpPopRows.length - 1; j >= 0; j--) {
                            if (tmpPopRows[j].toString() == popRowNo) {
                                tmpPopRows.splice(j, 1);
                                break;
                            }
                        }
                        var popRowStr = "";
                        for (var k = 0; k < tmpPopRows.length; k++) {
                            if (popRowStr == "")
                                popRowStr += tmpPopRows[k].toString();
                            else
                                popRowStr += "," + tmpPopRows[k].toString();
                        }
                        PopRows[i] = popRowStr;
                    }
                    break;
                }
            }
        }
    }

    if (action == "Add") {
        if (!IsFound) {
            ParentDcNo.push(parentDcNo);
            ParentClientRow.push(parentRowNo);
            var parStr = GetParentString(parentDcNo, parentRowNo, popDcNo);
            PopGridDcNo.push(popDcNo);
            PopParentsStr.push(parStr);
            PopRows.push(popRowNo);
        }

        //set the parent field values into the components from the parent row.
        //PopParentFlds

        for (var ind = 0; ind < PopParentDCs.length; ind++) {
            if (PopParentDCs[ind] == parentDcNo) {
                parentFlds = PopParentFlds[ind].toString().split(",");
                for (var i = 0; i < parentFlds.length; i++) {
                    var pFldId = parentFlds[i] + parentRowNo + "F" + parentDcNo;
                    var popFldId = GetSubFieldId("sub" + popDcNo + "_" + parentFlds[i], popRowNo, popDcNo);
                    var parFld = $j("#" + pFldId);
                    var popFld = $j("#" + popFldId);

                    if (parFld.length > 0 && popFld.length > 0) {
                        popFld.val(parFld.val());
                    }
                }
            }
        }
    }
}

//Function which returns true if the given row is empty.
function IsEmptyRow(rowNo, dcNo) {
    var range;
    var IsEmpty = false;
    for (var i = 0; i < FldDcRange.length; i++) {
        var dcRange = FldDcRange[i].split("~");
        if (dcRange[0] == dcNo) {
            range = dcRange[1].split(",");
            break;
        }
    }
    if (range != undefined) {
        var startIndex = parseInt(range[0].toString(), 10);
        var endIndex = parseInt(range[1].toString(), 10);

        for (var j = startIndex; j <= endIndex; j++) {
            var fieldName = FNames[j];
            if (FMoe[j] == "Accept" || FMoe[j] == "Select") {
                fieldName = fieldName + rowNo + "F" + dcNo;
                var fldValue = GetFieldValue(fieldName);
                var field = $j("#" + fieldName);
                if (field.length > 0) {
                    if (field.attr("type") != "hidden") {
                        if (FDataType[j].toLowerCase() == "numeric" && fldValue != "")
                            fldValue = parseInt(fldValue, 10);
                        if (fldValue == "" || fldValue == "0") {
                            IsEmpty = true;
                        } else {
                            IsEmpty = false;
                            break;
                        }
                    }
                }
            }
        }
    }
    return IsEmpty;
}

//Function to set style for the pop grid dc if firm bind.
function SetPopDcStyle(PopDcNo, isFirm) {
    var addBtn = document.getElementById("add" + PopDcNo);
    var clearBtn = document.getElementById("btnClear" + PopDcNo);
    var btnOk = document.getElementById("btnOk" + PopDcNo);

    var enableAdd = false;

    if (isFirm) {
        if (addBtn && !enableAdd) {
            addBtn.disabled = true;
            addBtn.style.cursor = 'default';
        }
        if (clearBtn) {
            clearBtn.style.visibility = 'hidden';
        }

        if (btnOk) {
            btnOk.value = "Close";
        }
        ShowingDc(PopDcNo, "Disable");

        if (enableAdd) {
            $j("#DivFrame" + PopDcNo).find('.rowadd').removeClass("disableadd");
            $j("#DivFrame" + PopDcNo).find('.rowadd').removeAttr('disabled');
        }
    } else {
        if (addBtn) {
            addBtn.disabled = false;
            addBtn.style.cursor = 'hand';
        }
        if (clearBtn) {
            clearBtn.style.visibility = 'visible';
        }
        if (btnOk) {
            btnOk.value = "Ok";
        }
    }
}

//Function to set the Parents active row to the global variable.
function RegisterActivePRow(clientRowNo, pDcNo) {
    AxActivePRow = GetDbRowNo(clientRowNo, pDcNo);
    AxActivePDc = pDcNo;
    //update the parameters array.
    var found = false;
    for (var i = Parameters.length - 1; i >= 0; i--) {
        var parameter = Parameters[i].split("~");
        if (parameter[0] == "activeprow") {
            Parameters[i] = "activeprow" + "~" + AxActivePRow;
            found = true;
            break;
        }
    }
    if (!found)
        Parameters[Parameters.length] = "activeprow" + "~" + AxActivePRow;
}

//Function returns true if the PopDc has firm bind attribute as true.
function IsPopGridFirmBind(popDcNo) {
    for (var pIndx = 0; pIndx < PopGridDCs.length; pIndx++) {
        if (PopGridDCs[pIndx] == popDcNo) {
            if (PopGridDCFirm[pIndx].toString().toLowerCase() == "t") {
                return true;
            }
        }
    }
    return false;
}

//Function to get the parent fields for the given pop dc.
function GetParentFields(popDcNo) {
    var parentFlds;
    for (var i = 0; i < PopGridDCs.length; i++) {
        if (PopGridDCs[i] == popDcNo) {
            parentFlds = PopParentFlds[i].toString().split(",");
            break;
        }
    }
    return parentFlds;
}

//Function to get the parent values concatenated string for the given parent row and pop dc.
function GetParentString(parentDcNo, parentRow, popDc) {

    var parentStr = "";
    var parentFlds = GetParentFields(popDc);
    if (parentFlds != undefined) {
        for (var j = 0; j < parentFlds.length; j++) {
            var fldName = parentFlds[j] + parentRow + "F" + parentDcNo;
            if (parentStr == "")
                parentStr = GetFieldValue(fldName);
            else
                parentStr += "¿" + GetFieldValue(fldName);
        }
    }
    return parentStr;
}

//Function which returs the pop grids for the current parent dc.
function GetPopGrids(parentDcNo) {
    var popGrids = "";
    for (var i = 0; i < PopParentDCs.length; i++) {
        if (PopParentDCs[i] == parentDcNo) {
            if (popGrids == "")
                popGrids = PopGridDCs[i];
            else
                popGrids += "," + PopGridDCs[i];
        }
    }
    return popGrids;
}

function GetPopGridDcNo(parentDcNo) {
    var popGrids = "";
    for (var i = 0; i < PopParentDCs.length; i++) {
        if (PopParentDCs[i] == parentDcNo) {
            if (popGrids == "")
                popGrids = "dc" + PopGridDCs[i];
            else
                popGrids += "," + "dc" + PopGridDCs[i];
        }
    }
    return popGrids;
}

//Function which adds the parent row info to the pop arrays.
function AddParentRow(parentDcNo, parentRowNo, popDcNo, parentStr) {
    var isFound = false;
    for (var i = 0; i <= parentDcNo.length; i++) {
        if (ParentDcNo[i] == parentDcNo && PopGridDcNo[i] == popDcNo && ParentClientRow[i] == parentRowNo) {
            PopParentsStr[i] = parentStr;
            isFound = true;
            break;
        }
    }
    if (!isFound) {
        ParentDcNo.push(parentDcNo);
        ParentClientRow.push(parentRowNo);
        PopGridDcNo.push(popDcNo);
        PopParentsStr.push(parentStr);
        PopRows.push("");
    }
}

//Function which updates the popRows and rowno arrays for the newly added row.
function UpdatePopUpArrays(dcNo, rowNo, isPopDc, action, pRow, pDc) {
    if (TstructHasPop) {

        if (isPopDc) {
            var parentClientRow = GetClientRowNo(AxActivePRow, AxActivePDc);
            var activePDc = AxActivePDc;
            var activePRow = parentClientRow;

            if (pRow != undefined && pDc != undefined) {
                activePDc = pDc;
                activePRow = pRow;
            }

            if (action == "Add") {
                AddDeletePopRow(activePDc, activePRow, AxActiveDc, rowNo, "Add");
            } else {
                AddDeletePopRow(activePDc, activePRow, AxActiveDc, rowNo, "Delete");
            }
        } else {
            var popGridsStr = GetPopGrids(dcNo);
            var popGrids = popGridsStr.split(",");

            for (var i = 0; i < popGrids.length; i++) {
                if (popGrids[i] != "") {
                    AddParentRow(dcNo, rowNo, popGrids[i], "");
                }
            }
        }
    }
}

function DeletePopRowsAfterGetDep() {
    //format of AxSubGridRows -popdc1~row1,row2,row3¿popdc2~row1,row2
    var strData = AxSubGridRows.split("¿");
    //AxParStrFromDep -dcno~rowno
    var parData = AxParStrFromDep.split("~");
    for (var i = 0; i < strData.length; i++) {
        if (strData[i] != "") {
            var strDcRows = strData[i].split("~");
            var dcNo = strDcRows[0];

            //for every popgrid for the current parent grid, clear the poprows for the given parent row from the pop arrays
            ClearPopRows(parData[0], GetClientRowNo(parData[1], parData[0]), dcNo);

            var dcRows = strDcRows[1].split(",");
            for (var j = dcRows.length - 1; j >= 0; j--) {
                var rowNo = GetClientRowNo(parseInt(dcRows[j], 10), dcNo);
                if ($j("#gridDc" + dcNo)[0].rows.length == 1) {
                    var rowId = $j("#gridDc" + dcNo)[0].rows[0].id;
                    var rowNo = rowId.substring(rowId.lastIndexOf("R") + 1, rowId.lastIndexOf("F"));
                    ClearDeletedFields(dcNo, rowNo);
                    var dcIdx = $j.inArray(dcNo, DCFrameNo);
                    DCHasDataRows[dcIdx] = "False";
                    //convert the rowid of the first row to 001
                    var a = "sp" + dcNo + "R" + dcRows[j] + "F" + dcNo;
                    var newRow = $j("#" + a);

                    newRow.attr("id", "sp" + dcNo + "R001F" + dcNo);
                    newRow.find(':input').val('');
                    newRow.find('select,a,input,label,img,.Grdlnk').each(function () {
                        ConvertFieldID($j(this), "001");
                    });
                    SetRowCount(dcNo, "1");
                    UpdatePopUpArrays(dcNo, rowNo, true, "Delete");
                    UpdateDcRowArrays(dcNo, rowNo, "Delete", -1);
                } else {

                    //get the row, and remove the html
                    var a = "sp" + dcNo + "R" + rowNo + "F" + dcNo;
                    $j("#" + a).remove();

                    UpdatePopUpArrays(dcNo, rowNo, true, "Delete");
                    UpdateDcRowArrays(dcNo, rowNo, "Delete", -1);
                    SetRowCount(dcNo, GetDcRowCount(dcNo) - 1);
                }
            }
        }
    }
}

function AddRowAfterGetDep(rowNo, dcNo, oldHasData) {
    if (TstructHasPop) {

        //GetDep will always return the sub grid rows starting from "1" for the active parent row.
        //For e.g the cr attribute will always have "i1,i2...." Hence just adding at the end.
        //if (strDelRows[i].toString() != "i1" || (dcIsPop && calledFrom == "GetDep" && GetDcRowCount(dcNo) > 1)) {
        if (rowNo != "1" || oldHasData == "True") {
            AddRow(dcNo, "GetDep");
            AxDepRows.push(rowNo + "~" + GetDcRowCount(dcNo));
        } else {
            //if dc is pop grid or parent grid update the pop rows array
            AxDepRows.push(rowNo + "~" + "1");

            $j("#sp" + dcNo + "R" + "001" + "F" + dcNo).show();
            UpdateNewPopInfo(dcNo, "001");
            if (AxParStrFromDep != "") {
                var parStr = AxParStrFromDep.split("~");
                var parDc = parStr[0];
                var pRow = GetClientRowNo(parStr[1], parDc);
                UpdatePopUpArrays(dcNo, "001", true, "Add", pRow, parDc);
            }
            UpdateDcRowArrays(dcNo, "001", "Add");
        }
    }
}

//Function which returns the dbrowno for the poprows of a given parent row
function GetDbPopRows(strRows, dcNo) {
    if (strRows != "") {
        var dbPopRows = strRows.split(",");
        dbPopRows.sort();
        var tmpRows = "";
        for (var i = 0; i < dbPopRows.length; i++) {
            var rNo = GetRowNoHelper(GetDbRowNo(dbPopRows[i], dcNo));

            if (tmpRows == "")
                tmpRows = rNo;
            else
                tmpRows += "," + rNo;
        }
        return tmpRows;
    } else
        return strRows;
}

//Function to return the calcualted/last rowno to be used for adding to the table.
function GetSubDsRowNo(wsRowNo, dcNo) {
    var dsRowNo = 0;
    var idx = $j.inArray(wsRowNo, AxSubWsRows);
    if (idx == -1) {
        AxSubWsRows.push(wsRowNo);
        dsRowNo = GetDcRowCount(dcNo) + 1;
        AxSubDsRows.push(dsRowNo);
    } else {
        dsRowNo = AxSubDsRows[idx];
    }
    return dsRowNo;
}
var result;

function toggleSwitch(type) {
    var usrFlag = '';
    if ($j("#ckbPurposeUser").prop("checked") == true) {
        //checkbox is unchecked
        $j("#ckbPurposeUser").prop('checked', false);
        usrFlag = '0';
        $j(".clsPrps").css("display", "none");

    } else {
        $j("#ckbPurposeUser").prop('checked', true);
        //checkbox is checked
        usrFlag = '1';
        $j(".clsPrps").css("display", "block");
    }

    try {
        result = ASB.WebService.GetChoices('normal', usrFlag);
    } catch (ex) {
        result = ex.toString();
    }
}


function toggleSwitchDesign(type) {
    var valFlag = '';
    if ($("#ckbPurposeDev").prop("checked") == true) {
        //checkbox is unchecked
        $("#ckbPurposeDev").prop('checked', false);
        valFlag = '0';
        $j(".clsPrps").css("display", "none");

    } else {
        //checkbox is checked
        $("#ckbPurposeDev").prop('checked', true);
        valFlag = '1';
        $j(".clsPrps").css("display", "block");
    }
    try {
        result = ASB.WebService.GetChoices('design', valFlag);
    } catch (ex) {
        result = ex.toString();
    }

}

// AJAX Calls on tstruct design load
function GetChoiceStatusForDSign() {
    //alert(1);
    $.ajax({
        type: "POST",
        url: "TstructDesign.aspx/GetPrpLblStatusForDSign",
        data: '',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            //alert(response.d);
            var res = response.d;
            if (res == "true") {
                $j(".clsPrps").css("display", "block");
                $j("#ckbPurposeDev").prop("checked", true);


            } else {
                $j(".clsPrps").css("display", "none");
                $j("#ckbPurposeDev").prop("checked", false);
            }
        }
    });


}

function pageloadlogtime(logTime) {
    console.log("Page Load:  " + logTime + " milliseconds.");
}

function disableDC(dcno) {
    const DCNumber = $j("#DivFrame" + dcno)
    DCNumber.find('input,textarea, img, select, a').not('.subGrid,.chkShwSel,.swtchDummyAnchr,.tgl').attr('disabled', true);
    DCNumber.find('a img').removeClass('handCur');
    DCNumber.find('img').attr('onclick', 'Callnull');
    DCNumber.find(":button").removeClass('handCur');
    DCNumber.find('.rowdelete').addClass("disabledelete");
    DCNumber.find('.rowadd').addClass("disableadd");
    DCNumber.find('.axpBtn').css({
        "pointer-events": "none",
        "cursor": "default"
    });
    DCNumber.find('.axpBtnCustom').css({
        "pointer-events": "none",
        "cursor": "default"
    });
    DCNumber.find('.upload-icon').attr('disabled', true).css("cursor", "default");
    DCNumber.find('.fillcls').addClass("disablefill");
    $j("#gridAddBtn" + dcno).prop('disabled', true);
    if (!axInlineGridEdit && AxpGridForm != "form")
        $j("#wrapperForEditFields" + dcno).hide();
    $j("#gridToggleBtn" + dcno).addClass('disabled').prop('disabled', true);
    $j("[id ^= 'fillgrid']").prop('disabled', true).addClass('disabled');
    $j("#wrapperForEditFields" + dcno).find(".editLayoutFooter button").addClass('disabled').prop('disabled', true);
    $j("#colScroll" + dcno + " table tbody tr").addClass('disableTheRow');
    $j("#colScroll" + dcno + " table tbody tr").find('.glyphicon.glyphicon-pencil,.glyphicon.glyphicon-remove').addClass('disabled').prop("disabled", true).parent().addClass('disabled').prop("disabled", true);
    $("#gridAddBtn" + dcno).next().find(":button").attr("disabled", true).off('click');

}

function createEditors() {
    $("textarea").each(function () {
        let elem = $(this);
        let editorId = "";
        editorId = elem.attr("id") != undefined ? elem.attr("id") : "";
        if (editorId.toLowerCase().indexOf("sql_editor") === 0 || editorId.toLowerCase().indexOf("exp_editor") === 0 || GetDWBFieldType(GetFieldsName(editorId)) == "SQL Editor" || GetDWBFieldType(GetFieldsName(editorId)) == "Expression Editor" || editorId.toLowerCase().indexOf("js_editor") === 0 || editorId.toLowerCase().indexOf("html_editor") === 0) {

            if (IsGridField(GetFieldsName(editorId)) && AxpGridForm != "form" && !elem.parent('div').hasClass("edit-mode-content") && !elem.parents('.modal').length)
                return true;
            if (elem.hasClass('CodeMirrorApplied'))
                return true;
            elem.addClass('CodeMirrorApplied');

            if (elem.data("myeditor")) {
                //destroying the text editor
                elem.data("myeditor").toTextArea();
            }
            if (editorId.toLowerCase().indexOf("sql_editor") === 0 || GetDWBFieldType(GetFieldsName(editorId)) == "SQL Editor") {
                //createTheEditor({ type: "sql", textarea: editorId, loadSqlHintObj: false, sqlHintObj: callParentNew("mainSQLhintObj") })
                createTheEditor({
                    type: "sql",
                    textarea: editorId,
                    loadSqlHintObj: false,
                    sqlHintObj: ("mainSQLhintObj"),
                    customValidationFn: customValidationFn
                })
                var btnHTML = "<div id=\"dvpop" + editorId + "\" class=\"tstsqleditorbtn\"><a value=\"SQL Editor\" onclick=javascript:createPopup('AxDBScript.aspx',true); tooltip=\"SQL Editor\"><i class=\"fa fa-external-link\"></i></a></div>";
                $("#" + editorId).after(btnHTML);
            } else if (editorId.toLowerCase().indexOf("exp_editor") === 0 || GetDWBFieldType(GetFieldsName(editorId)) == "Expression Editor") {
                createTheEditor({
                    type: "expression",
                    textarea: editorId,
                    customValidationFn: customValidationFn
                })
                //createTheEditor({ type: "expression", textarea: editorId })
            } else if (editorId.toLowerCase().indexOf("html_editor") === 0) {
                createHtmlEditor(editorId);
            } else if (editorId.toLowerCase().indexOf("js_editor") === 0) {
                //  createTheEditor({ type: "text/javascript", textarea: editorId, customValidationFn: customValidationFn })
                createJSEditor(editorId, "text/javascript");
            } else {
                console.log("Not Applied " + editorId)
            }

        }

        //elem.blur(function () {
        //    MainBlur($j(this));
        //});
    })
}

//Open SQL Editor Modified in popup(devendra)
function createPopupdesignnew(txtid) {

    htmlContent = '<div id="axpertPopupWrapperDWB"  class="remodal" data-pushtxt-id="' + txtid + '" data-remodal-id="axpertPopupModalDWB"><button data-remodal-action="close" class="remodal-close remodalCloseBtn icon-basic-remove" title="Close"></button><div style="height:100%;" id="iframeMarkUp1"><div id="QryEditor"><div ><button id="exeQuery" title="Execute"><i class="fa fa-bolt"></i></button><textarea id="dwbtxtEditorsql" rows="4" cols="50"></textarea></div><div class="dvOutput"><div class="rsltHeader">Result<span id="spnRowCnt"></span></div><div id="txtOutput"></div><table id="tblOutput" class="table-responsive"></table></div></div></div></div>';
    $("head").append(htmlContent);
    var options = {
        "closeOnOutsideClick": true,
        "hashTracking": false,
        "closeOnEscape": true
    };
    var inst = $('[data-remodal-id=axpertPopupModalDWB]:not(.remodal-is-initialized):not(.remodal-is-closed):eq(0)').remodal(options);
    if (inst && inst.state != "opened")
        inst.open();

    let mainSqlCM = CodeMirror.fromTextArea(document.getElementById('dwbtxtEditorsql'), {
        mode: 'text/x-sql',
        smartIndent: true,
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        theme: "default",
        hintOptions: {
            tables: callParentNew("mainSqlHintObj")
        },

    });

    mainSqlCM.on('keyup', function (editor, event) {
        if (
            !(event.ctrlKey) &&
            (event.keyCode >= 65 && event.keyCode <= 90) ||
            (event.keyCode >= 97 && event.keyCode <= 122) ||
            (event.keyCode >= 46 && event.keyCode <= 57)
        ) {
            // type code and show autocomplete hint in the meanwhile
            CodeMirror.commands.autocomplete(editor, null, {
                completeSingle: false
            });
        }
    });
    var parentdiv = '#dv' + $("#axpertPopupWrapperDWB").attr('data-pushtxt-id').split('0')[0];

    // var parentEditor = $(parentdiv + ' .CodeMirror')[0].CodeMirror;
    $('#QryEditor .CodeMirror')[0].CodeMirror.setValue($(parentdiv + ' .CodeMirror')[0].CodeMirror.getDoc().getValue());
    //return inst;

}
//---------End devendra

// Calling webservice
function customValidationFn(textarea) {
    var jsonData = "";
    var webServiceName = "";
    var textSqlandExpression = textarea.value;
    if (textSqlandExpression.length <= 0) {
        return;
    }
    if (textarea.id.toLocaleLowerCase().startsWith("sql_editor") || textarea.id.toLocaleLowerCase().startsWith("exp_editor") || GetDWBFieldType(GetFieldsName(textarea.id)) == "SQL Editor" || GetDWBFieldType(GetFieldsName(textarea.id)) == "Expression Editor") {
        var sourcefield = "",
            sourcetable = "",
            Axp_Web_SqlExp_Val_Def_RestRad = "";
        var calfrom = "",
            fgname = "";
        var fieldname = "",
            fldordno = "",
            datatype = "",
            fieldType = "",
            sfrom = "",
            expression = "",
            validateExpression = "",
            transid = "",
            savenorm = "",
            refresh = "",
            autoselect = "",
            combobox = "",
            sql = "",
            iviewparams = "",
            pmetadata = "",
            sourcefieldid = "",
            sourcetableid = "";
        var dcNo = "";

        fieldType = GetFieldValue(GetComponentName("type", GetDcNo("type"))) || "";
        fieldname = GetFieldValue(GetComponentName("name", GetDcNo("name"))) || "";
        fldordno = GetFieldValue(GetComponentName("fldordno", GetDcNo("fldordno"))) || "";
        datatype = GetFieldValue(GetComponentName("datatype", GetDcNo("datatype"))) || "";

        if (fieldType.toLowerCase() === "field") {
            sfrom = GetFieldValue(GetComponentName("modeofentry", GetDcNo("modeofentry"))) || "";
        } else if (fieldType.toLowerCase() === "Fill Grid") {
            sfrom = "fillgrid";
        }
        transid = GetFieldValue(GetComponentName("stransid", GetDcNo("stransid"))) || callParentNew("transid");
        expression = GetFieldValue(GetComponentName("exp_editor_expression", GetDcNo("exp_editor_expression"))) || "";
        validateExpression = GetFieldValue(GetComponentName("exp_editor_validateexpression", GetDcNo("exp_editor_validateexpression"))) || "";


        sfrom = sfrom.toLowerCase();

        if (sfrom === "select from sql") {
            savenorm = GetFieldValue(GetComponentName("savenormalized", GetDcNo("savenormalized"))) || "";
            refresh = GetFieldValue(GetComponentName("refreshonsav", GetDcNo("refreshonsav"))) || "";
            autoselect = GetFieldValue(GetComponentName("autoselect_sql", GetDcNo("autoselect_sql"))) || "";
            combobox = GetFieldValue(GetComponentName("combobox_sql", GetDcNo("combobox_sql"))) | "";
            sql = GetFieldValue(GetComponentName("sql_editor_test", GetDcNo("sql_editor_test"))) || "";
            sourcefield = GetFieldValue(GetComponentName("sourcefield", GetDcNo("sourcefield"))) || "";
            sourcetable = GetFieldValue(GetComponentName("sourcetable", GetDcNo("sourcetable"))) || "";
            pmetadata = GetFieldValue(GetComponentName("pmetadata", GetDcNo("pmetadata"))) || "";
            sourcefieldid = "sourcefield";
            sourcetableid = "sourcetable";
        } else if (sfrom === "select from form") {
            savenorm = GetFieldValue(GetComponentName("savenormalized_form", GetDcNo("savenormalized_form"))) || "";
            refresh = GetFieldValue(GetComponentName("refreshonsave_form", GetDcNo("refreshonsave_form"))) || "";
            autoselect = GetFieldValue(GetComponentName("autoselect_form", GetDcNo("autoselect_form"))) || "";
            combobox = GetFieldValue(GetComponentName("combobox_form", GetDcNo("combobox_form"))) || "";
            sql = GetFieldValue(GetComponentName("sql_editor_sqltextform", GetDcNo("sql_editor_sqltextform"))) || "";
            sourcefield = GetFieldValue(GetComponentName("selectfield", GetDcNo("selectfield"))) || "";
            sourcetable = GetFieldValue(GetComponentName("tname", GetDcNo("tname"))) || "";
            pmetadata = GetFieldValue(GetComponentName("pmetadata", GetDcNo("pmetadata"))) || "";

        } else if (sfrom === "accept") {
            sql = GetFieldValue(GetComponentName("sql_editor_detail", GetDcNo("sql_editor_detail"))) || "";

        } else if (sql == "") {
            sql = textSqlandExpression;
        }

        Axp_Web_SqlExp_Val_Def_RestRad = GetFieldValue(GetComponentName("Axp_Web_SqlExp_Val_Def_RestRad", GetDcNo("Axp_Web_SqlExp_Val_Def_RestRad"))) || "";

        if (textarea.id.toLocaleLowerCase().startsWith("sql_editor")) {
            jsonData = {
                "_parameters": [{
                    "tstructs": {
                        //"axpapp": eval(callParent('mainProject')),//
                        "axpapp": callParentNew('mainProject'), //Devendra
                        "transid": transid, //
                        "fieldname": fieldname,
                        "iviewparams": iviewparams,
                        "fldordno": fldordno,
                        "datatype": datatype,
                        "sfrom": sfrom,
                        "expression": expression,
                        "validateexpression": validateExpression,
                        "savenorm": savenorm,
                        "refresh": refresh,
                        "autoselect": autoselect,
                        "combobox": combobox,
                        "sql": sql, //
                        "sourcefield": sourcefield,
                        "sourcetable": sourcetable,
                        "Axp_Web_SqlExp_Val_Def_RestRad": Axp_Web_SqlExp_Val_Def_RestRad,
                        "metadata": pmetadata,
                        "sourcefieldid": sourcefieldid,
                        "sourcetableid": sourcetableid
                    }
                }]
            }
            webServiceName = "ValidateSQL";
        } else if (textarea.id.toLocaleLowerCase().startsWith("exp_editor")) {
            //For expression called from
            textAreaID = textarea.id.toLocaleLowerCase();
            if (textAreaID.indexOf("exp_editor_expression") != -1)
                calfrom = "field"
            else if (textAreaID.indexOf("exp_editor_validateexpression") != -1)
                calfrom = "fgval"
            else if (textAreaID.indexOf("exp_editor_footerstring") != -1)
                calfrom = "fgfootstr"
            else
                calfrom = "field";


            jsonData = {
                "_parameters": [{
                    "tstructs": {
                        "axpapp": eval(callParent('mainProject')),
                        "transid": transid,
                        "calfrom": calfrom,
                        "expression": textSqlandExpression,
                        "fgname": fieldname,
                        "Axp_Web_SqlExp_Val_Def_RestRad": Axp_Web_SqlExp_Val_Def_RestRad,



                    }
                }]
            }
            webServiceName = "ValidateExpression";
        }
        ShowDimmer(true);

        try {
            ASB.WebService.CallRestWS(JSON.stringify(jsonData), webServiceName, SuccessCallbackAction, OnException);
        } catch (exp) { }


        function SuccessCallbackAction(result, eventArgs) {
            ShowDimmer(false);
            try {
                var json = $.parseJSON(result);
                var msg = json["result"][0].msg;
                var status = json["result"][0].status;
                if (typeof json["result"][0].metadata != "undefined") {
                    autocompleteMetadataJson(json["result"][0].metadata);
                } else {
                    sourceAcMetaJsonFlds = new Array();
                    fldSourceAcMetaJson = "";
                }
                if (status.toLowerCase() == "failed") {
                    msg = msg.replace('<error>', '').replace('</error>', '');
                    showAlertDialog("warning", msg);
                }
            } catch (ex) { }
        }

        function OnException(result) {
            ShowDimmer(false)
        }
    }
}

function IsTabDc(dcNo) {
    if ($j.inArray(dcNo, TabDCs) != -1)
        return true;
    else
        return false;
}


function createJSEditor(editorId, Jmode) {

    var opts = {
        smartIndent: true,
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        autoRefresh: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
    };
    opts.mode = Jmode;
    jsCodeMirror = CodeMirror.fromTextArea(document.getElementById(editorId), opts);
    jsCodeMirror.on("blur", function () {
        SetFieldValue(editorId, jsCodeMirror.getValue());
        UpdateFieldArray(editorId, "000", $("#" + editorId).val(), "parent");
    });
    jsCodeMirror.on('keyup', function (editor, event) {
        if (
            !(event.ctrlKey) &&
            (event.keyCode >= 65 && event.keyCode <= 90) ||
            (event.keyCode >= 97 && event.keyCode <= 122) ||
            (event.keyCode >= 46 && event.keyCode <= 57)
        ) {
            CodeMirror.commands.autocomplete(editor, null, {
                completeSingle: false
            });
        }
    });
}

function discardLodaData() {
    try {
        var dcldId = $j("#recordid000F0").val();
        GetLoadData(dcldId, "");
    } catch (exp) { }
}

function hideDiscardButton() {
    try {
        var dcldId = $j("#recordid000F0").val();
        if (dcldId != "" && dcldId != "0" && AxpTstButtonStyle!="old")
            $("#ftbtn_iDiscard").removeClass("d-none");
        else {
            if (!$("#ftbtn_iDiscard").hasClass("d-none"))
                $("#ftbtn_iDiscard").addClass("d-none");
        }
    } catch (exp) { }
}

function autocompleteMetadataJson(mtJson) {
    if (mtJson != "") {
        try {
            sourceAcMetaJsonFlds = new Array();
            fldSourceAcMetaJson = mtJson;
            mtJson.forEach(function (varJson) {
                sourceAcMetaJsonFlds.push(varJson.name);
            });
        } catch (ex) { }
    }
}

function tstwfcomments() {
    if ($(".toolbarRightMenu").find(".content").length == 0) {
        var strBtn = "<section class=\"content\">";
        $("#breadcrumb-panel .bcrumb span:not(.ivirCButton):not(.icon-arrows-down).tstivtitle").css("padding", "3px 0px 0px 46px");
        strBtn += "<button type=\"button\" class=\"btn btn-default btn-circle waves-effect waves-circle waves-float wftstBackBtn\" onclick=\"wftstBackBtn();\" style=\"float: left;margin-top: -8px;margin-left: -15px;\">";
        strBtn += "<i class=\"material-icons\">arrow_back</i>";
        strBtn += "</button></section>";
        if ($(".toolbarRightMenu .newRequestJson").length > 0)
            $($(".toolbarRightMenu .newRequestJson")[0]).before(strBtn);
        else if ($(".toolbarRightMenu #iconsNewOption").length > 0)
            $(".toolbarRightMenu #iconsNewOption").before(strBtn);
        else
            $(".toolbarRightMenu").append(strBtn);
    }
}

function wftstBackBtn() {
    window.parent.globalChange = false;
    var prevTransId = $("#stransid000F1").val();
    var prevWfName = $("#wfname000F1").val();
    parent.LoadIframeac('WorkflowNew.aspx?prevTransId=' + prevTransId + '&prevWfName=' + prevWfName + '')
}

function DoScriptFormControl(componentName, eventType) {
    if (SFormControls.length > 0) {
        if (eventType == "On Form Load" || eventType == "On Data Load") {
            var rid = $j("#recordid000F0").val();
            $.each(SFCApply, function (idx, elem) {
                if (elem == "On Form Load" && rid == "0") {
                    isScriptFormLoad = "true";
                    var sfcExp = SFormControls[idx];
                    EvaluateScriptFormControl(sfcExp);
                } else if (elem == "On Data Load" && rid != "0") {
                    isScriptFormLoad = "true";
                    var sfcExp = SFormControls[idx];
                    EvaluateScriptFormControl(sfcExp);
                }
            });
        } else if (componentName != "") {
            var sfcfName = GetFieldsName(componentName);
            $.each(SFCFldNames, function (idx, elem) {
                if (SFCApply[idx] == "On Click" && eventType == "On Field Enter")
                    eventType = "On Click";
                if (elem == sfcfName && SFCApply[idx] == eventType) {
                    isScriptFormLoad = "false";
                    var sfcExp = SFormControls[idx];
                    EvaluateScriptFormControl(sfcExp, componentName);
                }
            });
        }
    }
}

function EvaluateScriptFormControl(sfcExp, sfcfName = "") {
    if (sfcExp != "") {
        var flval = "";
        if (sfcfName != "")
            flval = GetFieldValue(sfcfName);
        //var strefVal= Evaluate(sfcfName, flval, sfcExp, "vexpr");
        var sfName = sfcfName == "" ? "" : sfcfName;
        var arrsfcExp = sfcExp.split("♥");
        AxFormControlList = new Array();
        var strefVal = EvalExprSet(arrsfcExp);
        if (AxFormControlList.length > 0)
            ProcessScriptFormControlOnList(sfName);
        else if (strefVal != "" && strefVal.split("~").length >= 2)
            ProcessScriptFormControl(strefVal.split("~")[1], strefVal.split("~")[0], sfName);
        else if (strefVal != "" && strefVal.split("♠").length > 0)
            ProcessScriptFormControlEvents(strefVal, sfName);
    }
}

function ProcessScriptFormControlOnList(sfName) {
    $.each(AxFormControlList, function (i, val) {
        if (val != "")
            ProcessScriptFormControl(val.split("~")[1], val.split("~")[0], sfName);
    });
}

function ProcessScriptFormControl(listControls, actionStr, sfName) {
    var sfFldVal = "";
    var sfRno = 0;
    if (listControls.indexOf("♦") > 0) {
        sfRno = listControls.split("♦")[2];
        sfFldVal = listControls.split("♦")[1];
        listControls = listControls.split("♦")[0];
    }
    listControls.split(',').forEach(function (contName) {

        let setfldCap = "";
        if (contName.indexOf("^") > 0) {
            setfldCap = contName.split("^")[1];
            contName = contName.split("^")[0];
        }

        var fldname = GetExactFieldName(contName);
        contName = fldname;
        var conFldDcNo = GetDcNo(contName);
        if (conFldDcNo != "0") {
            var isGrid = IsDcGrid(conFldDcNo);
            if (isGrid)
                secFldDc = "GRID";
            else
                secFldDc = "NONGRID";


            if (secFldDc == "NONGRID")
                contName = contName + "000F" + conFldDcNo;
            else if (secFldDc == "GRID") {
                let contFldName = contName;
                if (AxActiveRowNo == "0" || AxActiveRowNo == "") {
                    var clientRowNo = "001";
                    contName = contName + clientRowNo + "F" + conFldDcNo;
                } else {
                    var clientRowNo = GetClientRowNo(AxActiveRowNo, conFldDcNo);
                    contName = contName + clientRowNo + "F" + conFldDcNo;
                }
                var destfld = $j("#" + contName + ":not(.tstformbutton,.axpBtnCustom)");
                if (destfld.length == 0) {
                    let grdFldRowId = $("#gridHd" + conFldDcNo + " tbody tr:first").length > 0 ? $("#gridHd" + conFldDcNo + " tbody tr:first").attr("id") : "";
                    if (grdFldRowId != "") {
                        grdFldRowId = grdFldRowId.substring(grdFldRowId.lastIndexOf("F") - 3);
                        contName = contFldName + grdFldRowId;
                    }
                }
            }
        }

        isFieldBtn = false;
        var destfld = $j("#" + contName + ":not(.tstformbutton,.axpBtnCustom,.dwbIvBtnbtm,.dwbBtn,.menu-link)");
        if (destfld.length == 0) {
            destfld = $j("#DivFrame" + contName.toString().substring(2));
            if (destfld.length == 0) {
                var dcName = contName.substr(2);
                if ($j.inArray(dcName, TabDCs) != -1) {
                    destfld = $j("#ank" + dcName);
                }
            }
        } else if (destfld.length > 0) {
            if (destfld.parents(".menu.menu-sub-dropdown").length > 0)
                isFieldBtn = true;
        }

        var fldRowNo = GetFieldsRowNo(contName);
        var fldDcNo = GetFieldsDcNo(contName);
        var fldDbRowNo = GetDbRowNo(fldRowNo, fldDcNo);

        var isFldSaveBtn = false;

        if (destfld.length <= 0) {
            //check if the field is button, by removing the rowno and dc number
            var newFldName = contName;
            if (contName.toString().indexOf("F") != -1)
                newFldName = contName.substring(0, contName.lastIndexOf("F") - 3);

            $j(".axpBtn,.axpBtnCustom").each(function () {
                if ($j(this).attr("id") == newFldName) {
                    destfld = $j(this);
                    isFieldBtn = true;
                    return false;
                }
            });

            var actTmpBtn;
            $j(".action img").each(function () {
                if ($j(this).attr("id") == newFldName) {
                    actTmpBtn = $j(this);
                    isFieldBtn = true;
                    return false;
                }
            });

            //AxpTstBtn
            var actTmpBtn;
            var isBtnInDc = false;
            $j(".AxpTstBtn input,img").each(function () {
                if ($j(this).attr("value") == newFldName || $j(this).attr("id") == "AxpTstBtn_" + newFldName) {
                    actTmpBtn = $j(this);
                    isFieldBtn = true;
                    isBtnInDc = true;
                    return false;
                }
            });

            $j(".tstformbutton").each(function () {
                if ($j(this).attr("id") == newFldName) {
                    actTmpBtn = $j(this);
                    isFieldBtn = true;
                    isBtnInDc = true;
                    return false;
                }
            });


            if (newFldName.toLowerCase() == "remove")
                newFldName = "delete";
            else if (newFldName.toLowerCase() == "list view")
                newFldName = "listview";
            else if (newFldName.toLowerCase() == "new") {
                newFldName = "add";
                //btnfooteropenlist = btnfooteropenlist.replace("ftbtn_iNew", "");
            }

            if (newFldName.toLowerCase() == "save" || newFldName.toLowerCase() == "submit") {
                isFldSaveBtn = true;
                newFldName = "save";
                //btnfooteropenlist = btnfooteropenlist.replace("ftbtn_iSave", "");
            }

            var sfnewFldName = newFldName;
            if (sfnewFldName.toLowerCase() == "listview")
                sfnewFldName = "list view";
            $j("#icons").find("a").each(function () {
                if (typeof $j(this).attr("title") != "undefined" && $j(this).attr("class") == newFldName.toLowerCase() || (typeof btnName !== 'undefined' && $j(this).text() == btnName)) {
                    destfld = $j(this);
                    isFieldBtn = true;
                    return false;
                } else if (typeof $j(this).attr("title") != "undefined" && $j(this).attr("title").toLowerCase() == sfnewFldName.toLowerCase() || (typeof btnName !== 'undefined' && $j(this).text() == btnName) || typeof $j(this).attr("id") != "undefined" && $j(this).attr("id").toLowerCase() == sfnewFldName.toLowerCase()) {
                    destfld = $j(this);
                    isFieldBtn = true;
                    return false;
                }
            });

            $j(".toolbarRightMenu").find("a").each(function () {
                if (typeof $j(this).attr("title") != "undefined" && $j(this).attr("title").toLowerCase() == sfnewFldName.toLowerCase() || (typeof btnName !== 'undefined' && $j(this).text() == btnName)) {
                    destfld = $j(this);
                    isFieldBtn = true;
                    return false;
                }
            });

            //condition to check prev and next button in list view header
            if (!isFieldBtn) {
                $j("#nextprevicons").find("a").each(function () {
                    if ($j(this).attr("class") == newFldName.toLowerCase()) {
                        destfld = $j(this);
                        isFieldBtn = true;
                    }
                });
            }
            if (!isFieldBtn) {
                $j(".tstructMainBottomFooter").find("a").each(function () {
                    if ($j(this).attr("id").toLowerCase() == newFldName.toLowerCase() || (typeof $j(this).attr("title") != "undefined" && $j(this).attr("title").toLowerCase() == sfnewFldName.toLowerCase() || (typeof btnName !== 'undefined' && $j(this).text() == btnName))) {
                        destfld = $j(this);
                        isFieldBtn = true;
                    }
                });
            }

            if (!isFieldBtn) {
                $(".toolbarRightMenu .menu-item a").each(function () {
                    if (typeof $j(this).attr("id") != "undefined" && ($j(this).attr("id").toLowerCase() == newFldName.toLowerCase()) || (typeof $j(this).attr("title") != "undefined" && $j(this).attr("title").toLowerCase() == sfnewFldName.toLowerCase() || (typeof btnName !== 'undefined' && $j(this).text() == btnName))) {
                        destfld = $j(this);
                        isFieldBtn = true;
                    }
                });
            }

            if (actTmpBtn != undefined && actTmpBtn.length > 0)
                destfld = actTmpBtn.parent(0);
            if (isBtnInDc)
                destfld = actTmpBtn;
        }

        if (destfld.length > 0) {
            switch (actionStr) {
                case ("enable"):
                    if (isFieldBtn) {
                        if (isFldSaveBtn)
                            EnableSaveBtn(true);
                        else
                            EnableDisableBtns(destfld, true);
                    } else {
                        if (fldname.substr(0, 2) == "dc") {
                            var dcNo = parseInt(fldname.substr(2, fldname.length), 10);
                            if (typeof isWizardTstruct != "undefined" && isWizardTstruct)
                                ToggleWizardDc(dcNo, "enable");
                            else
                                ShowingDc(dcNo, "enable");
                        } else {
                            var _thisdcNo = GetDcNo(fldname);
                            try {
                                let _fName = GetFieldsName(destfld.attr("id"));
                                let _fldIndex = $j.inArray(_fName, FNames);
                                FFieldReadOnly[_fldIndex] = "False";
                            } catch (ex) { }
                            if (IsDcGrid(_thisdcNo)) {
                                var rowCnt = 0;
                                rowCnt = GetDcRowCount(_thisdcNo);
                                var eleType = getGridFldType(fldname, _thisdcNo);
                                for (var i = 1; i <= rowCnt; i++) {
                                    destfld = $j("#" + fldname + GetClientRowNo(i, _thisdcNo) + "F" + _thisdcNo);
                                    let _thisEleId = fldname + GetClientRowNo(i, _thisdcNo) + "F" + _thisdcNo;
                                    if (destfld.length > 0) {
                                        var idx = $j.inArray(_thisdcNo + "~" + fldname + "~disable", AxFormContSetFldActGrid);
                                        if (idx == -1) {
                                            idx = $j.inArray(_thisdcNo + "~" + fldname + "~enable", AxFormContSetFldActGrid);
                                            if (idx == -1)
                                                AxFormContSetFldActGrid.push(_thisdcNo + "~" + fldname + "~enable");
                                            else
                                                AxFormContSetFldActGrid[idx] = _thisdcNo + "~" + fldname + "~enable";
                                        } else {
                                            AxFormContSetFldActGrid[idx] = _thisdcNo + "~" + fldname + "~enable";
                                        }

                                        if (IsPickListField(destfld.attr("id")) == true) {
                                            var pickFld = document.getElementById("img~" + destfld.attr("id"));
                                            pickFld.disabled = false;
                                            pickFld.className = "input-group-addon handCur pickimg";
                                        }
                                        if (destfld.val() == 0 && destfld.prop("type") != "select-one")
                                            destfld.val("");

                                        if (destfld.attr("title") == dateString && destfld.val() == "")
                                            destfld.val(dateString);
                                        if (destfld.attr("type") == "checkbox") {
                                            var checlistid = destfld.attr("id");

                                            EnableDisableCheckbox(checlistid, false)
                                        } else {

                                            // for enabling the Rich Text Box If it is disabled on dataload using form control
                                            if (destfld.attr("id").startsWith("rtf_") || destfld.attr("id").startsWith("rtfm_") || destfld.attr("id").startsWith("fr_rtf_") || GetDWBFieldType(GetFieldsName(destfld.attr("id"))) == "Rich Text") {
                                                $j("#cke_" + destfld.attr("id")).prop("disabled", false);
                                                destfld.css("display", "none");
                                                $j("#cke_" + destfld.attr("id")).removeAttr("disabled");
                                            }
                                            if (destfld.attr("class") == "axpImg") {
                                                destfld.attr("onclick", null);
                                            }
                                            destfld.prop("disabled", false);
                                            destfld.prop("readOnly", false);
                                            destfld.removeAttr("readOnly");
                                            SetAutoCompAccess("enabled", destfld);
                                        }
                                    }
                                }
                            } else {
                                if (IsPickListField(destfld.attr("id")) == true) {
                                    var pickFld = document.getElementById("img~" + destfld.attr("id"));
                                    pickFld.disabled = false;
                                    pickFld.className = "input-group-addon handCur pickimg";
                                }


                                if (destfld.val() == 0 && destfld.prop("type") != "select-one")
                                    destfld.val("");

                                if (destfld.attr("title") == dateString && destfld.val() == "")
                                    destfld.val(dateString);
                                if (destfld.attr("type") == "checkbox") {
                                    var checlistid = destfld.attr("id");

                                    EnableDisableCheckbox(checlistid, false)
                                } else {

                                    // for enabling the Rich Text Box If it is disabled on dataload using form control
                                    if (destfld.attr("id").startsWith("rtf_") || destfld.attr("id").startsWith("rtfm_") || destfld.attr("id").startsWith("fr_rtf_") || GetDWBFieldType(GetFieldsName(destfld.attr("id"))) == "Rich Text") {
                                        $j("#cke_" + destfld.attr("id")).prop("disabled", false);
                                        destfld.css("display", "none");
                                        $j("#cke_" + destfld.attr("id")).removeAttr("disabled");
                                    }
                                    if (destfld.attr("class") == "axpImg") {
                                        destfld.attr("onclick", null);
                                    }
                                    destfld.prop("disabled", false);
                                    destfld.prop("readOnly", false);
                                    destfld.removeAttr("readOnly");
                                    SetAutoCompAccess("enabled", destfld);
                                }
                            }
                        }
                    }
                    break;
                case ("disable"):
                    if (isFieldBtn) {
                        if (isFldSaveBtn)
                            EnableSaveBtn(false);
                        else
                            EnableDisableBtns(destfld, false);
                    } else {
                        if (fldname.substr(0, 2) == "dc") {
                            var dcNo = parseInt(fldname.substr(2, fldname.length), 10);
                            if (typeof isWizardTstruct != "undefined" && isWizardTstruct)
                                ToggleWizardDc(dcNo, "disable");
                            else
                                ShowingDc(dcNo, "disable");
                        } else {
                            var _thisdcNo = GetDcNo(fldname);
                            try {
                                let _fName = GetFieldsName(destfld.attr("id"));
                                let _fldIndex = $j.inArray(_fName, FNames);
                                FFieldReadOnly[_fldIndex] = "True";
                            } catch (ex) { }
                            if (IsDcGrid(_thisdcNo)) {
                                var rowCnt = 0;
                                rowCnt = GetDcRowCount(_thisdcNo);
                                var eleType = getGridFldType(fldname, _thisdcNo);
                                for (var i = 1; i <= rowCnt; i++) {
                                    destfld = $j("#" + fldname + GetClientRowNo(i, _thisdcNo) + "F" + _thisdcNo);
                                    let _thisEleId = fldname + GetClientRowNo(i, _thisdcNo) + "F" + _thisdcNo;
                                    if (destfld.length > 0) {
                                        var idx = $j.inArray(_thisdcNo + "~" + fldname + "~enable", AxFormContSetFldActGrid);
                                        if (idx == -1) {
                                            idx = $j.inArray(_thisdcNo + "~" + fldname + "~disable", AxFormContSetFldActGrid);
                                            if (idx == -1)
                                                AxFormContSetFldActGrid.push(_thisdcNo + "~" + fldname + "~disable");
                                            else
                                                AxFormContSetFldActGrid[idx] = _thisdcNo + "~" + fldname + "~disable";
                                        } else {
                                            AxFormContSetFldActGrid[idx] = _thisdcNo + "~" + fldname + "~disable";
                                        }
                                        if (IsPickListField(destfld.attr("id")) == true) {
                                            var pickFld = document.getElementById("img~" + destfld.attr("id"));
                                            pickFld.disabled = true;
                                            pickFld.className = "pickimg input-group-addon handCur";
                                        }
                                        if (destfld.attr("title") == dateString && (destfld.val() == dateString || destfld.val() == "''"))
                                            destfld.val("");

                                        if (destfld.attr("type") == "checkbox") {
                                            var checlistid = destfld.attr("id");
                                            EnableDisableCheckbox(checlistid, true)
                                        } else {

                                            // for disabling the Rich Text Box If it is disabled on dataload using form control
                                            if (destfld.attr("id").startsWith("rtf_") || destfld.attr("id").startsWith("rtfm_") || destfld.attr("id").startsWith("fr_rtf_") || GetDWBFieldType(GetFieldsName(destfld.attr("id"))) == "Rich Text") {
                                                $j("#cke_" + destfld.attr("id")).attr('disabled', 'disabled');
                                                destfld.css("display", "none");
                                                $j("#cke_" + destfld.attr("id")).prop("readonly", true);
                                            }
                                            if (destfld.attr("class") == "axpImg") {
                                                destfld.attr("onclick", "callnull");
                                            }
                                            //destfld.prop("disabled", true);
                                            SetAutoCompAccess("disabled", destfld);
                                        }
                                    }
                                }
                            } else {
                                if (IsPickListField(destfld.attr("id")) == true) {
                                    var pickFld = document.getElementById("img~" + destfld.attr("id"));
                                    pickFld.disabled = true;
                                    pickFld.className = "pickimg input-group-addon handCur";
                                }
                                if (destfld.attr("title") == dateString && (destfld.val() == dateString || destfld.val() == "''"))
                                    destfld.val("");

                                if (destfld.attr("type") == "checkbox") {
                                    var checlistid = destfld.attr("id");
                                    EnableDisableCheckbox(checlistid, true)
                                } else {

                                    // for disabling the Rich Text Box If it is disabled on dataload using form control
                                    if (destfld.attr("id").startsWith("rtf_") || destfld.attr("id").startsWith("rtfm_") || destfld.attr("id").startsWith("fr_rtf_") || GetDWBFieldType(GetFieldsName(destfld.attr("id"))) == "Rich Text") {
                                        $j("#cke_" + destfld.attr("id")).attr('disabled', 'disabled');
                                        destfld.css("display", "none");
                                        $j("#cke_" + destfld.attr("id")).prop("readonly", true);
                                    }
                                    if (destfld.attr("class") == "axpImg") {
                                        destfld.attr("onclick", "callnull");
                                    }
                                    destfld.prop("disabled", true);
                                    SetAutoCompAccess("disabled", destfld);
                                }
                            }
                        }
                    }
                    break;
                case ("hide"):
                    if (fldname.substr(0, 2) == "dc") {
                        var dcNo = parseInt(fldname.substr(2, fldname.length), 10);
                        if (typeof isWizardTstruct != "undefined" && isWizardTstruct)
                            ToggleWizardDc(dcNo, "hide");
                        else
                            ShowingDc(dcNo, "hide");
                    } else {
                        if (isFieldBtn) {
                            EnableDisableSFCBtns(destfld, "hide");
                            if (typeof destfld.attr("id") != "undefined" && destfld.attr("id") == "ftbtn_iSave")
                                btnfooteropenlist = btnfooteropenlist.replace("ftbtn_iSave", "");
                            if (typeof destfld.attr("id") != "undefined" && destfld.attr("id") == "ftbtn_iNew")
                                btnfooteropenlist = btnfooteropenlist.replace("ftbtn_iNew", "");
                        } else {
                            HideShowField(fldname, "hide");
                            var fldInd = GetFieldIndex(fldname);
                            var fldDType = GetDWBFieldType("", fldInd);
                            if (fldname.startsWith("axptm_") || fldname.startsWith("axpdbtm_") || (fldDType != "" && fldDType.toLowerCase() == "time")) {
                                $j("#" + destfld.attr("id") + " .tstOnlyTime").removeClass('hasDatepicker');
                                $j("#" + destfld.attr("id") + " .tstOnlyTime24hours").removeClass('hasDatepicker');
                            }
                        }
                    }
                    break;
                case ("show"):
                    if (fldname.substr(0, 2) == "dc") {
                        var dcNo = parseInt(fldname.substr(2, fldname.length), 10);
                        if (typeof isWizardTstruct != "undefined" && isWizardTstruct)
                            ToggleWizardDc(dcNo, "show");
                        else
                            ShowingDc(dcNo, "show");
                    } else {
                        if (isFieldBtn) {
                            EnableDisableSFCBtns(destfld, "show");
                        } else {
                            HideShowField(fldname, "show");
                            var fldInd = GetFieldIndex(fldname);
                            var fldDType = GetDWBFieldType("", fldInd);
                            if (fldname.startsWith("axptm_") || fldname.startsWith("axpdbtm_") || (fldDType != "" && fldDType.toLowerCase() == "time")) {
                                $j("#" + destfld.attr("id") + " .tstOnlyTime").addClass('hasDatepicker');
                                $j("#" + destfld.attr("id") + " .tstOnlyTime24hours").addClass('hasDatepicker');
                            }
                        }
                    }
                    break;
                case ("setvalue"):
                    axpScriptIsAddrow = false;
                    var dcNo = GetDcNo(fldname);
                    var sffld = "";
                    if (IsDcGrid(dcNo)) {
                        let nrno = "001";
                        var rnolength = sfRno.length;
                        if (rnolength == 2) nrno = "0" + sfRno;
                        else if (rnolength == 1) nrno = "00" + sfRno;
                        else if (rnolength == 3) nrno = sfRno;
                        let clientRow = GetClientRowNo(sfRno, dcNo);
                        sffld = fldname + clientRow + "F" + dcNo;
                        AxActiveRowNo = GetDbRowNo(nrno, dcNo);
                    } else {
                        sffld = fldname + "000F" + dcNo;
                    }
                    if ($j("#" + sffld).hasClass("multiFldChk") && sfFldVal.trim() == "") {
                        if (IsDcGrid(dcNo)) {
                            $j("input[id=" + sffld + "]").each(function () {
                                $j(this).removeAttr("checked");
                                $j(this).prop("checked", false);
                            });
                        } else {
                            try {
                                $("#" + sffld).val("");
                                $("#" + sffld).data("valuelist", "");
                                $("#" + sffld).tokenfield('setTokens', []);
                            } catch (ex) { }
                        }
                    } else {
                        CallSetFieldValue(sffld, sfFldVal);
                    }
                    var fRowNo = GetFieldsRowNo(sffld);
                    var dbRowNo = GetDbRowNo(fRowNo, dcNo);
                    UpdateFieldArray(sffld, dbRowNo, sfFldVal, "parent", "");
                    if (sfName != "") {
                        if (sfName.startsWith("barqr_"))
                            $j($j("#" + sfName)).val('');
                    }
                    break;
                case ("axaddrow"):
                    axpScriptIsAddrow = true;
                    var addDcNo = contName.substring(2);
                    var isExitDummy = false;
                    if (gridDummyRowVal.length > 0) {
                        gridDummyRowVal.map(function (v) {
                            if (v.split("~")[0] == addDcNo)
                                isExitDummy = true;
                        });
                    }
                    AxWaitCursor(true);
                    ShowDimmer(true);
                    CallAddRowFromScript(addDcNo, sfName, isExitDummy);
                    break;
                case ("setfieldcaption"):
                    var conFldDcNo = GetFieldsDcNo(contName);
                    if (conFldDcNo != "0") {
                        var isGrid = IsDcGrid(conFldDcNo);
                        if (isGrid) {
                            let thisFldName = GetFieldsName(contName);
                            destfld.parents(".customSetupTableMN").find(`thead th#th-${thisFldName} .thhead`).text(setfldCap);
                        } else {
                            destfld.parents(".grid-stack-item").find(".fld-wrap3 label").text(setfldCap);
                        }
                    }
                    break;
                case ("collapse"):
                    if (fldname.substr(0, 2) == "dc") {
                        let _thisDicId = parseInt(fldname.substr(2, fldname.length), 10);
                        if ($("#dcBlean" + _thisDicId).length > 0) {
                            if ($("#dcBlean" + _thisDicId).is(":checked"))
                                $("#dcBlean" + _thisDicId).removeAttr("checked");
                            if ($("#divDc" + _thisDicId + " .gridIconBtns").length > 0) {
                                $("#divDc" + _thisDicId + " .griddivColumn").addClass("d-none");
                                $("#divDc" + _thisDicId + " .gridIconBtns").addClass("d-none");
                            } else
                                $("#divDc" + _thisDicId).addClass("d-none");
                            GetDcStateValue(_thisDicId, 'F');
                        }
                    }
                    break;
                case ("expand"):
                    if (fldname.substr(0, 2) == "dc") {
                        let _thisDicId = parseInt(fldname.substr(2, fldname.length), 10);
                        if ($("#dcBlean" + _thisDicId).length > 0) {
                            if (!$("#dcBlean" + _thisDicId).is(":checked"))
                                $("#dcBlean" + _thisDicId).attr("checked", "checked");
                            if ($("#divDc" + _thisDicId + " .gridIconBtns").length > 0) {
                                $("#divDc" + _thisDicId + " .griddivColumn").removeClass("d-none");
                                $("#divDc" + _thisDicId + " .gridIconBtns").removeClass("d-none");
                            } else
                                $("#divDc" + _thisDicId).removeClass("d-none");
                            GetDcStateValue(_thisDicId, 'T');
                        }
                    }
                    break;
                case ("mask"):
                    let _fldInd = GetFieldIndex(fldname);
                    if (_fldInd > -1) {
                        let _maskChar = sfFldVal;
                        let _maskApply = sfRno.split('♠');

                        if (isScriptFormLoad == "false") {
                            if (ScriptMaskFields.length > 0) {
                                var idx = $j.inArray(fldname, ScriptMaskFields);
                                if (idx == -1)
                                    ScriptMaskFields.push(fldname);
                            } else
                                ScriptMaskFields.push(fldname);
                        }
                        if (_maskApply.length > 1) {
                            FldMaskType[_fldInd] = "Show few characters";
                            FldMaskDetails[_fldInd] = _maskApply[0] + "♦" + _maskApply[1] + "♦" + _maskChar + "♦";
                        } else {
                            FldMaskType[_fldInd] = "Mask all characters";
                            FldMaskDetails[_fldInd] = "0♦0♦" + _maskChar + "♦";
                        }
                        let _dcNo = GetDcNo(fldname);
                        if (IsDcGrid(_dcNo)) {                            
                            let rowCnt = GetDcRowCount(_dcNo);
                            for (var i = 1; i <= rowCnt; i++) {
                                let _thisFld = fldname + GetClientRowNo(i, _dcNo) + "F" + _dcNo;
                                let _fld = $j("#" + _thisFld);
                                if (_fld.length > 0) {
                                    let _thisFldVal = GetFieldValue(_thisFld);
                                    if (_thisFldVal != "") {
                                        UpdateAllFieldValues(_thisFld, _thisFldVal);
                                        if (_maskApply[0] == "all") {
                                            _thisFldVal = MaskCharacter(_thisFldVal.toString(), _maskChar, 0);
                                        } else {
                                            _thisFldVal = MaskCharacter(_thisFldVal.toString(), _maskChar, _thisFldVal.length - _maskApply[0]);
                                            _thisFldVal = RevMaskCharacter(_thisFldVal.toString(), _maskChar, _maskApply[1]);
                                        }
                                        $("#" + _thisFld).val(_thisFldVal);
                                        $("#" + _thisFld).attr("value", _thisFldVal);
                                    }
                                }
                            }

                        } else {
                            let _thisFld = fldname + "000F" + _dcNo;
                            let _thisFldVal = GetFieldValue(_thisFld);
                            if (_thisFldVal != "") {
                                UpdateAllFieldValues(_thisFld, _thisFldVal);
                                if (_maskApply[0] == "all") {
                                    _thisFldVal = MaskCharacter(_thisFldVal.toString(), _maskChar, 0);
                                } else {
                                    _thisFldVal = MaskCharacter(_thisFldVal.toString(), _maskChar, _thisFldVal.length - _maskApply[0]);
                                    _thisFldVal = RevMaskCharacter(_thisFldVal.toString(), _maskChar, _maskApply[1]);
                                }
                                $("#" + _thisFld).val(_thisFldVal);
                                $("#" + _thisFld).attr("value", _thisFldVal);
                            }
                        }
                    }
                    break;
                case ("nomask"):
                    let _fldIndnm = GetFieldIndex(fldname);
                    if (_fldIndnm > -1) {
                        if (isScriptFormLoad == "false") {
                            if (ScriptMaskFields.length > 0) {
                                var idx = $j.inArray(fldname, ScriptMaskFields);
                                if (idx > -1)
                                    ScriptMaskFields.splice(idx, 1);
                            }
                        } 
                        FldMaskType[_fldIndnm] = "";
                        FldMaskDetails[_fldIndnm] = "";
                        let _dcNo = GetDcNo(fldname);
                        if (IsDcGrid(_dcNo)) {
                            let rowCnt = GetDcRowCount(_dcNo);
                            for (var i = 1; i <= rowCnt; i++) {
                                let _thisFld = fldname + GetClientRowNo(i, _dcNo) + "F" + _dcNo;
                                let _fld = $j("#" + _thisFld);
                                if (_fld.length > 0) {
                                    let _thisFldVal = GetFieldValue(_thisFld);
                                    if (_thisFldVal != "") {
                                        UpdateAllFieldValues(_thisFld, _thisFldVal);
                                        $("#" + _thisFld).val(_thisFldVal);
                                        $("#" + _thisFld).attr("value", _thisFldVal);
                                    }
                                }
                            }

                        } else {
                            let _thisFld = fldname + "000F" + _dcNo;
                            let _thisFldVal = GetFieldValue(_thisFld);
                            if (_thisFldVal != "") {
                                UpdateAllFieldValues(_thisFld, _thisFldVal);
                                $("#" + _thisFld).val(_thisFldVal);
                                $("#" + _thisFld).attr("value", _thisFldVal);
                            }
                        }
                    }
                    break;
                case ("gridcelldisable"):
                    var _thisdcNo = GetDcNo(fldname);
                    if (IsDcGrid(_thisdcNo)) {
                        if (sfFldVal != "" && sfFldVal != 0) {
                            destfld = $j("#" + fldname + GetClientRowNo(sfFldVal, _thisdcNo) + "F" + _thisdcNo);
                            if (destfld.length > 0) {

                                var idx = $j.inArray(_thisdcNo + "~" + fldname + "~" + GetClientRowNo(sfFldVal, _thisdcNo) + "~enable", AxFormContSetGridCell);
                                if (idx == -1) {
                                    idx = $j.inArray(_thisdcNo + "~" + fldname + "~" + GetClientRowNo(sfFldVal, _thisdcNo) + "~disable", AxFormContSetGridCell);
                                    if (idx == -1)
                                        AxFormContSetGridCell.push(_thisdcNo + "~" + fldname + "~" + GetClientRowNo(sfFldVal, _thisdcNo) + "~disable");
                                    else
                                        AxFormContSetGridCell[idx] = _thisdcNo + "~" + fldname + "~" + GetClientRowNo(sfFldVal, _thisdcNo) + "~disable";
                                } else {
                                    AxFormContSetGridCell[idx] = _thisdcNo + "~" + fldname + "~" + GetClientRowNo(sfFldVal, _thisdcNo) + "~disable";
                                }

                                if (IsPickListField(destfld.attr("id")) == true) {
                                    var pickFld = document.getElementById("img~" + destfld.attr("id"));
                                    pickFld.disabled = true;
                                    pickFld.className = "pickimg input-group-addon handCur";
                                }
                                if (destfld.attr("title") == dateString && (destfld.val() == dateString || destfld.val() == "''"))
                                    destfld.val("");

                                if (destfld.attr("type") == "checkbox") {
                                    var checlistid = destfld.attr("id");
                                    EnableDisableCheckbox(checlistid, true)
                                } else {

                                    // for disabling the Rich Text Box If it is disabled on dataload using form control
                                    if (destfld.attr("id").startsWith("rtf_") || destfld.attr("id").startsWith("rtfm_") || destfld.attr("id").startsWith("fr_rtf_") || GetDWBFieldType(GetFieldsName(destfld.attr("id"))) == "Rich Text") {
                                        $j("#cke_" + destfld.attr("id")).attr('disabled', 'disabled');
                                        destfld.css("display", "none");
                                        $j("#cke_" + destfld.attr("id")).prop("readonly", true);
                                    }
                                    if (destfld.attr("class") == "axpImg") {
                                        destfld.attr("onclick", "callnull");
                                    }
                                    destfld.prop("disabled", true);
                                    SetAutoCompAccess("disabled", destfld);
                                }
                            }
                        }
                    }
                    break;
                case ("gridcellenable"):
                    var _thisdcNo = GetDcNo(fldname);
                    if (IsDcGrid(_thisdcNo)) {
                        if (sfFldVal != "" && sfFldVal != 0) {
                            destfld = $j("#" + fldname + GetClientRowNo(sfFldVal, _thisdcNo) + "F" + _thisdcNo);
                            if (destfld.length > 0) {
                                //let _dbRowNo = GetDbRowNo(GetClientRowNo(sfFldVal, _thisdcNo), _thisdcNo);
                                var idx = $j.inArray(_thisdcNo + "~" + fldname + "~" + GetClientRowNo(sfFldVal, _thisdcNo) + "~disable", AxFormContSetGridCell);
                                if (idx == -1) {
                                    idx = $j.inArray(_thisdcNo + "~" + fldname + "~" + GetClientRowNo(sfFldVal, _thisdcNo) + "~enable", AxFormContSetGridCell);
                                    if (idx == -1)
                                        AxFormContSetGridCell.push(_thisdcNo + "~" + fldname + "~" + GetClientRowNo(sfFldVal, _thisdcNo) + "~enable");
                                    else
                                        AxFormContSetGridCell[idx] = _thisdcNo + "~" + fldname + "~" + GetClientRowNo(sfFldVal, _thisdcNo) + "~enable";
                                } else {
                                    AxFormContSetGridCell[idx] = _thisdcNo + "~" + fldname + "~" + GetClientRowNo(sfFldVal, _thisdcNo) + "~enable";
                                }

                                if (IsPickListField(destfld.attr("id")) == true) {
                                    var pickFld = document.getElementById("img~" + destfld.attr("id"));
                                    pickFld.disabled = false;
                                    pickFld.className = "input-group-addon handCur pickimg";
                                }
                                if (destfld.val() == 0 && destfld.prop("type") != "select-one")
                                    destfld.val("");

                                if (destfld.attr("title") == dateString && destfld.val() == "")
                                    destfld.val(dateString);
                                if (destfld.attr("type") == "checkbox") {
                                    var checlistid = destfld.attr("id");

                                    EnableDisableCheckbox(checlistid, false)
                                } else {

                                    // for enabling the Rich Text Box If it is disabled on dataload using form control
                                    if (destfld.attr("id").startsWith("rtf_") || destfld.attr("id").startsWith("rtfm_") || destfld.attr("id").startsWith("fr_rtf_") || GetDWBFieldType(GetFieldsName(destfld.attr("id"))) == "Rich Text") {
                                        $j("#cke_" + destfld.attr("id")).prop("disabled", false);
                                        destfld.css("display", "none");
                                        $j("#cke_" + destfld.attr("id")).removeAttr("disabled");
                                    }
                                    if (destfld.attr("class") == "axpImg") {
                                        destfld.attr("onclick", null);
                                    }
                                    destfld.prop("disabled", false);
                                    destfld.prop("readOnly", false);
                                    destfld.removeAttr("readOnly");
                                    SetAutoCompAccess("enabled", destfld);
                                }
                            }
                        }
                    } 
                    break;
                default:
                    return;
            }
        }
    });
}


function ProcessScriptFormControlEvents(scriptStr, sfName) {
    if (scriptStr != "") {
        let actionStr = scriptStr.split("♠");
        switch (actionStr[0]) {
            case ("LoadForm"):
                var thisTrId = actionStr[1];
                var thisParams = actionStr[2];
                thisParams = thisParams.replace(/♦/g, "&");
                var thisPageMode = actionStr[3];
                var thisOnClose = actionStr[4];
                if (thisPageMode == "" || thisPageMode.toLowerCase() == "d" || thisPageMode.toLowerCase() == "default") {
                    if (transid == thisTrId) {
                        var tstQureystr = '';
                        if (thisParams != "") {
                            thisParams.split('&').forEach(function (paramType) {
                                tstQureystr += paramType + "♠";
                            });
                            tstQureystr += "act=load";
                        } else {
                            tstQureystr = "act=load♠";
                        }
                        FormControlSameFormLoad = true;
                        GetFormLoadData(tstQureystr);
                    }
                    else
                        callParentNew("LoadIframe(tstruct.aspx?transid=" + thisTrId + "&" + thisParams + "&act=load)", "function");
                }
                else {
                    tparams = thisParams + "&AxPop=true";
                    tparams += "&axp_refresh=true";
                    var openpopup = 'tstruct.aspx?act=load&transid=' + thisTrId + "&" + tparams;
                    createPopup(openpopup);
                }
                break;
            case ("LoadFormAndData"):
                var thisTrId = actionStr[1];
                var thisParams = actionStr[2];
                thisParams = thisParams.replace(/♦/g, "&");
                var thisPageMode = actionStr[3];
                var thisOnClose = actionStr[4];
                if (thisPageMode == "" || thisPageMode.toLowerCase() == "d" || thisPageMode.toLowerCase() == "default") {
                    if (transid == thisTrId) {
                        var tstQureystr = '';
                        if (thisParams != "") {
                            thisParams.split('&').forEach(function (paramType) {
                                tstQureystr += paramType + "♠";
                            });
                            tstQureystr += "act=load";
                        } else {
                            tstQureystr = "act=load♠";
                        }
                        FormControlSameFormLoad = true;
                        GetFormLoadData(tstQureystr);
                    }
                    else
                        callParentNew("LoadIframe(tstruct.aspx?transid=" + thisTrId + "&" + thisParams + "&act=load)", "function");
                }
                else {
                    tparams = thisParams + "&AxPop=true";
                    tparams += "&axp_refresh=true";
                    var openpopup = 'tstruct.aspx?act=load&transid=' + thisTrId + "&" + tparams;
                    createPopup(openpopup);
                }
                break;
            case ("LoadIView"):
                var thisIvName = actionStr[1];
                var thisParams = actionStr[2];
                thisParams = thisParams.replace(/♦/g, "&");
                var thisPageMode = actionStr[3];
                var thisOnClose = actionStr[4];
                if (thisPageMode == "" || thisPageMode.toLowerCase() == "d" || thisPageMode.toLowerCase() == "default")
                    callParentNew("LoadIframe(ivtoivload.aspx?ivname=" + thisIvName + "&" + thisParams + "&act=load)", "function");
                else {
                    tparams = thisParams + "&AxIsPop=true";
                    var loadpopup = 'ivtoivload.aspx?ivname=' + thisIvName + "&" + tparams;
                    createPopup(loadpopup);
                }
                break;
            case ("LoadPage"):
                var thisTrId = actionStr[1];
                var thisParams = actionStr[2];
                thisParams = thisParams.replace(/♦/g, "&");
                var thisPageMode = actionStr[3];
                var thisOnClose = actionStr[4];
                if (thisPageMode == "" || thisPageMode.toLowerCase() == "d" || thisPageMode.toLowerCase() == "default") {
                    if (transid == thisTrId) {
                        var tstQureystr = '';
                        if (thisParams != "") {
                            thisParams.split('&').forEach(function (paramType) {
                                tstQureystr += paramType + "♠";
                            });
                            tstQureystr += "act=load";
                        } else {
                            tstQureystr = "act=load♠";
                        }
                        FormControlSameFormLoad = true;
                        GetFormLoadData(tstQureystr);
                    }
                    else
                        callParentNew("LoadIframe(tstruct.aspx?transid=" + thisTrId + "&" + thisParams + "&act=load)", "function");
                }
                else {
                    tparams = thisParams + "&AxPop=true";
                    tparams += "&axp_refresh=true";
                    var openpopup = 'tstruct.aspx?act=load&transid=' + thisTrId + "&" + tparams;
                    createPopup(openpopup);
                }
                break;
            case ("OpenPage"):
                var thisTrId = actionStr[1];
                var thisParams = actionStr[2];
                thisParams = thisParams.replace(/♦/g, "&");
                var thisPageMode = actionStr[3];
                var thisOnClose = actionStr[4];
                if (thisPageMode == "" || thisPageMode.toLowerCase() == "d" || thisPageMode.toLowerCase() == "default") {
                    if (transid == thisTrId) {
                        var tstQureystr = '';
                        if (thisParams != "") {
                            thisParams.split('&').forEach(function (paramType) {
                                tstQureystr += paramType + "♠";
                            });
                            tstQureystr += "act=open";
                        } else {
                            tstQureystr = "act=open♠";
                        }
                        FormControlSameFormLoad = true;
                        GetFormLoadData(tstQureystr);
                    }
                    else
                        callParentNew("LoadIframe(tstruct.aspx?transid=" + thisTrId + "&" + thisParams + "&act=open)", "function");
                }
                else {
                    tparams = thisParams + "&AxPop=true";
                    tparams += "&axp_refresh=true";
                    var openpopup = 'tstruct.aspx?act=open&transid=' + thisTrId + "&" + tparams;
                    createPopup(openpopup);
                }
                break;
            default:
                return;
        }
    }
}


function CallAddRowFromScript(addDcNo, sfName, isExitDummy) {
    var dcClientRows = GetDcClientRows(addDcNo);
    var lastRow = dcClientRows.getMaxVal();
    if (lastRow == 0) lastRow = 1;
    if (isExitDummy)
        lastRow = 1;
    var newCnt = parseInt(lastRow, 10);
    var newRowNo = GetRowNoHelper(newCnt);

    var visDcname = GetOpenTabDcs();
    var dbRowNo = GetDbRowNo(newRowNo, addDcNo);
    var rid = $j("#recordid000F0").val();
    var filename = traceSplitStr + "AddRowFromScript-" + transid + traceSplitChar;
    var ixml = '<sqlresultset axpapp="' + proj + '" transid="' + transid + '" recordid="' + rid + '" dcname="' + addDcNo + '" rowno="' + dbRowNo + '" dcnames="' + visDcname + '" sessionid="' + sid + '" trace="' + filename + '" >';
    try {
        ASB.WebService.AddRowPerfWS(ChangedFields, ChangedFieldDbRowNo, ChangedFieldValues, DeletedDCRows, ixml, addDcNo, tstDataId, true, SuccessCalAddDataForce, ErrorAddRowForceWS);
    } catch (exp) {
        $j($j("#" + sfName)).val('');

        AxWaitCursor(false);
        ShowDimmer(false);
        showAlertDialog("error", ServerErrMsg);
    }

    function SuccessCalAddDataForce(result, eventArgs) {
        var passResult = result;
        if (result != "")
            result = result.split("*♠*")[2];

        if (CheckSessionTimeout(result))
            return;
        var isValidRow = true;
        if (result != "" && (result == "Not a valid row!" || result.startsWith("Notavalidrow♦"))) {
            isValidRow = false;
            if (result == "Not a valid row!")
                showAlertDialog("warning", eval(callParent('lcm[517]')));
            else
                showAlertDialog("warning", result.split('♦')[1]);
        }
        if (isValidRow) {
            axpScriptaddrowres = passResult;
            if (isExitDummy && !isMobile) {
                isScriptFCAddClick = true;
                $("#gridHd" + addDcNo + " tbody tr[id=sp" + addDcNo + "R001F" + addDcNo + "]").find(".glyphicon-pencil").parent().click();
                isScriptFCAddClick = false;
            } else {
                if (axInlineGridEdit)
                    addNewInlineGridRow(addDcNo);
                else
                    AddNewRowInDc(addDcNo);
            }
            axpScriptaddrowres = "";
            updateInlineGridRowValues();
        }
        $j($j("#" + sfName)).val('');
        AxWaitCursor(false);
        ShowDimmer(false);
    }

    function ErrorAddRowForceWS() {
        ArrActionLog = "";
        ChangedFields = new Array();
        ChangedFieldDbRowNo = new Array();
        ChangedFieldValues = new Array();
        DeletedDCRows = new Array();
        $j($j("#" + sfName)).val('');
        AxWaitCursor(false);
        ShowDimmer(false);
    }
}

function EnableDisableSFCBtns(obj, enable) {
    var isObjFound = false;
    if (obj.length > 0) {
        if (enable == "hide") {
            if ($(obj).hasClass("dwbIvBtnbtm"))
                $(obj).addClass("d-none");
            else if ($(obj).hasClass("dwbBtn"))
                $(obj).addClass("d-none");
            else if ($(obj).parent(".toolbarRightMenu").length > 0)
                $(obj).addClass("d-none");
            else if ($(obj).parent("li").length > 0)
                $(obj).parent("li").hide();
            else if ($(obj).parent("div").length > 0)
                $(obj).parent("div").hide();
            else {
                $(obj).parent("td").hide();
                $(obj).parents("table").find("th#th-" + $(obj).attr("id")).hide();
            }
        } else {
            if ($(obj).hasClass("dwbIvBtnbtm"))
                $(obj).removeClass("d-none");
            else if ($(obj).hasClass("dwbBtn"))
                $(obj).removeClass("d-none");
            else if ($(obj).parent(".toolbarRightMenu").length > 0)
                $(obj).removeClass("d-none");
            else if ($(obj).parent("li").length > 0)
                $(obj).parent("li").show();
            else if ($(obj).parent("div").length > 0)
                $(obj).parent("div").show();
            else {
                $(obj).parent("td").show();
                $(obj).parents("table").find("th#th-" + $(obj).attr("id")).show();
            }
        }
    }
}

function AlertNoAction() {
    //email smptp test settings
    var smptpHost = $('#smtphost000F1').val();
    var smptpPort = $('#smtpport000F1').val();
    var smptpUser = $('#smtpuser000F1').val();
    var smptpPassword = $('#smtppwd000F1').val();
    try {
        ASB.WebService.TestMailSettings(smptpHost, smptpPort, smptpUser, smptpPassword, sucessCallbackMail, OnException);
    } catch (ex) { }
}

function sucessCallbackMail(result, eventArgs) {
    //sucess callback code for TestMailSettings
    var resultcheck = result;
    try {
        var xmlDoc = jQuery.parseXML(result);
        if (xmlDoc) {
            if (result.indexOf("result") != -1)
                resultcheck = xmlDoc.getElementsByTagName('result')[0].firstChild.nodeValue; //<result>Test mail has been sent to souvik.b@agile-labs.com'</result>
            else
                resultcheck = xmlDoc.getElementsByTagName('error')[0].firstChild.nodeValue;
        }
        if (resultcheck.indexOf("Test mail has been sent to") != -1)
            showAlertDialog("success", resultcheck);
        else
            showAlertDialog("warning", resultcheck);
    } catch (ex) { }
}

function barCodeScannerInit() {
    var scanqrfld = $j(document).find('input[id^=barqr_]').attr("id");
    if (typeof scanqrfld != "undefined") {
        try {
            onScan.detachFrom(document);
        } catch (ex) { }
        loadAndCall({
            files: {
                css: [],
                js: ["/ThirdParty/onscan.js-master/onscan.min.js"]
            },
            callBack() {
                onScan.attachTo(document, {
                    reactToPaste: true,
                    ignoreIfFocusOn: ($j('#waitDiv').css('display') == 'none') == true ? false : true,
                    onScan: function (sCode) { // Alternative to document.addEventListener('scan')
                        if (($j('#waitDiv').css('display') == 'none') == true) {
                            $j("#" + scanqrfld).val(sCode);
                            isScriptFCAddClick = true;
                            axpScanBarFldFocus = scanqrfld;
                            $j($j("#" + scanqrfld)).blur();
                            if (axpScriptIsAddrow == false)
                                $j($j("#" + scanqrfld)).val('').focus();
                            //ShowDimmer(false);
                            isScriptFCAddClick = false;
                        } else {
                            showAlertDialog("warning", "Please wait till the process complete!");
                        }
                    }
                });
            }
        });
    }
}

function getHybridWeightScaleInfo(axpWeightFldId) {

    try {
        var counter = 0;
        var intervalID = setInterval(() => {
            counter++;
            if (counter == 10) {
                clearInterval(intervalID);
                ShowDimmer(false);
            }

            var weighedValue = getRedisString("HybridWeightScaleInfo", callParentNew("hybridGUID"));

            if (weighedValue != "") {
                var weighedValueJSON = JSON.parse(weighedValue);
                weighedValue = weighedValueJSON.data.weight + weighedValueJSON.data.unit;
                SetFieldValue(axpWeightFldId, weighedValue);
                UpdateFieldArray(axpWeightFldId, GetFieldsRowNo(axpWeightFldId), weighedValue, "parent", "");
                MainBlur($j("#" + axpWeightFldId));
                $("#" + axpWeightFldId).blur();

                clearInterval(intervalID);
                ShowDimmer(false);
            }
        }, 1000);
    } catch (ex) { }

}

function closeWeightScalePort() {
    try {
        ASB.WebService.NotifyCloseWeightScalePort(callParentNew("hybridGUID"), (success) => { }, (error) => { });
    } catch (error) { }
}

function DropzoneInit(dvId) {
    let _thisDiv;
    if (typeof dvId != "undefined") {
        _thisDiv = $(dvId + " .dropzone:not(.dropzoneGrid)");
    } else {
        _thisDiv = $("[id^='divDc']:not(:has(.editWrapTr)) .dropzone:not(.dropzoneGrid)");// $("#divDc1 .dropzone");
    }
    _thisDiv.each(function () {
        if ($(this).parents('.editWrapTr').length > 0)
            return;
        const id = "#" + $(this).attr("id");
        const dropzone = document.querySelector(id);

        // set the preview element template
        var previewNode = dropzone.querySelector(".dropzone-item");
        previewNode.id = "";
        var previewTemplate = previewNode.parentNode.innerHTML;
        previewNode.parentNode.removeChild(previewNode);

        var url = location.origin + location.pathname.substr(0, location.pathname.indexOf('aspx'));
        const fuName = $(id).attr("id").substr(9);
        funame = fuName.substring(0, fuName.lastIndexOf("F") - 3);
        let attachmentSizeMB = callParentNew("axAttachmentSize", "axAttachmentSize") == undefined ? 1 : callParentNew("axAttachmentSize", "axAttachmentSize");
        let maxFilesUpload = AxpFileUploadlmt != "0" ? AxpFileUploadlmt : 100;
        let UploadFileTypes = "";
        if (typeof UploadFileTypesVal != "undefined")
            UploadFileTypes = UploadFileTypesVal;

        var myDropzone = new Dropzone(id, { // Make the whole body a dropzone
            url: url + `TstFileUpload.ashx?thisFld=${$(id).attr("id").substr(9)}&filePath=${$(".axpFilePath_" + $(id).attr("id").substring(("dropzone_axpfile_").length)).val() == undefined ? "" : $(".axpFilePath_" + $(id).attr("id").substring(("dropzone_axpfile_").length)).val()}&dcNo=${GetFieldsDcNo($(id).attr("id"))}&attFldName=${funame}&fileExt=${UploadFileTypes}`,
            maxFilesize: attachmentSizeMB, // Max filesize in MB
            previewTemplate: previewTemplate,
            previewsContainer: id + " .dropzone-items", // Define the container to display the previews
            clickable: id + " .dropzone-select", // Define the element that should be used as click trigger to select files.
            maxFiles: maxFilesUpload
        });

        const dzdefault = dropzone.querySelectorAll('.dz-default');
        $(dzdefault).addClass("d-none");

        myDropzone.on("addedfile", function (file) {
            var extension = file.name.substring(file.name.lastIndexOf('.') + 1);
            if (UploadFileTypes != "" && UploadFileTypes.indexOf(extension) == -1) {
                showAlertDialog("error", eval(callParent('lcm[521]')));
                return;
            }
            if (gridRowEditOnLoad) {
                let thisFldId = $(id).attr("id").substr(9);
                var fieldRowNo = GetFieldsRowNo(thisFldId);
                var fldDcNo = GetFieldsDcNo(thisFldId);
                UpdateGridRowFlags(thisFldId, fldDcNo, fieldRowNo);
            }

            this.options.url = url + `TstFileUpload.ashx?thisFld=${$(id).attr("id").substr(9)}&filePath=${$(".axpFilePath_" + $(id).attr("id").substring(("dropzone_axpfile_").length)).val() == undefined ? "" : $(".axpFilePath_" + $(id).attr("id").substring(("dropzone_axpfile_").length)).val()}&dcNo=${GetFieldsDcNo($(id).attr("id"))}&attFldName=${funame}&fileExt=${UploadFileTypes}`;
            // Hookup the start button
            const dropzoneItems = dropzone.querySelectorAll('.dropzone-item');
            dropzoneItems.forEach(dropzoneItem => {
                dropzoneItem.style.display = '';
            });
        });

        // Hide the total progress bar when nothing"s uploading anymore
        myDropzone.on("complete", function (progress) {
            const progressBars = dropzone.querySelectorAll('.dz-complete');
            if (progress.status == 'success') {
                if (progress.xhr.response == "success" || progress.xhr.response.startsWith("success:")) {
                    let mesg = progress.xhr.response;
                    let _thisupfile = "";
                    if (mesg != "")
                        _thisupfile = mesg.split('♠')[1];                    
                    $(progress.previewElement).parents(".dropzone").find(".fileuploadmore").removeClass("d-none");
                    let fuInpId = $(progress.previewElement).parents(".dropzone").attr("id").substr(9);
                    let fuInpVal = $("#" + fuInpId).val();
                    if (fuInpVal == "") {
                        fuInpVal = _thisupfile;// progress.name;
                        let _thisFldWidth = $("#" + fuInpId).parent().width();
                        $("#" + fuInpId).parent().width(_thisFldWidth);
                        let _thisATag = $("a#" + fuInpId).length != 0 ? $("a#" + fuInpId) : $("#" + fuInpId).next().find("a.dropzone-select");
                        let _thisSpan = _thisATag.find('span')[0];
                        _thisATag.text(progress.name);
                        _thisATag.prepend(_thisSpan).attr("title", "Drop files here or click to upload");
                    }
                    else {
                        const dupFileObj = fuInpVal.split(',').filter(file => file == _thisupfile)?.[0];
                        if (dupFileObj) {
                            myDropzone.removeFile(progress);
                            return false;
                        } else
                            fuInpVal = fuInpVal + "," + _thisupfile;
                    }
                    $("#" + fuInpId).val(fuInpVal);

                    var hdnScriptsUrlPath = $j("#hdnScriptsUrlpath");
                    let filePath = hdnScriptsUrlPath.val() + "axpert/" + sid + "/";
                    filePath += _thisupfile;

                    $(progress.previewElement).find(".dropzone-filename").attr("onclick", "ShowAxpFileuploadLink('" + fuInpId + "','" + _thisupfile + "','" + filePath + "')")

                    var fRowNo = GetFieldsRowNo(fuInpId);
                    var dcNo = GetFieldsDcNo(fuInpId);
                    var fldDbRow = GetDbRowNo(fRowNo, dcNo);
                    UpdateFieldArray(fuInpId, fldDbRow, fuInpVal, "parent", "");
                    UpdateAllFieldValues(fuInpId, fuInpVal);
                    showAlertDialog("success", mesg.split(":")[1]);
                } else {
                    let mesg = progress.xhr.response;
                    myDropzone.removeFile(progress);
                    showAlertDialog("error", mesg.split(":")[1]);
                }
            } else {
                if (progress.status == 'error')
                    showAlertDialog("warning", $(progress.previewTemplate).find(".dropzone-error").text());
            }
        });

        myDropzone.on("error", function (file) {
            myDropzone.removeFile(file);
        });

        myDropzone.on("removedfile", function (file) {
            let fuInpId = $(myDropzone.element).attr("id").substr(9);
            let fuInpVal = $("#" + fuInpId).val();
            let axpFName = fuInpId.substr(7);
            var axpPath = "";
            if (typeof $("textarea[id*=" + axpFName + "]").not(".axpAttach")[0] != "undefined")
                axpPath = $("textarea[id*=" + axpFName + "]").not(".axpAttach")[0].value;
            else
                axpPath = $("input[id*=" + axpFName + "]").not(".axpAttach")[0].value;
            fuInpVal = fuInpVal.replace(file.name + ",", "").replace(file.name, "");
            try {
                $("textarea#" + fuInpId).val(fuInpVal);
                $("textarea#" + fuInpId).attr('value', fuInpVal);
            } catch (ex) { }
            $("input#" + fuInpId).val(fuInpVal);
            $("input#" + fuInpId).attr('value', fuInpVal);
            var fRowNo = GetFieldsRowNo(fuInpId);
            var dcNo = GetFieldsDcNo(fuInpId);
            var fldDbRow = GetDbRowNo(fRowNo, dcNo);
            UpdateFieldArray(fuInpId, fldDbRow, fuInpVal, "parent", "");
            UpdateAllFieldValues(fuInpId, fuInpVal);
            let _thisATag = $("a#" + fuInpId).length != 0 ? $("a#" + fuInpId) : $("#" + fuInpId).next().find("a.dropzone-select");
            if (fuInpVal == "") {
                $(myDropzone.element).find(".fileuploadmore").addClass("d-none");
                let _thisSpan = _thisATag.find('span')[0];
                _thisATag.text("Drop files here or click to upload");
                _thisATag.prepend(_thisSpan).attr("title", "");
            } else {
                let _thisSpan = _thisATag.find('span')[0];
                let _thissrFile = fuInpVal.split(',')[0];
                if (axpPath != "" && axpPath.endsWith("\\*"))
                    _thissrFile = _thissrFile.substr(20);
                _thisATag.text(_thissrFile);
                _thisATag.prepend(_thisSpan).attr("title", "Drop files here or click to upload");
            }
        });


        let fuInpId = $(id).attr("id").substr(9)
        let fuInpVal = $("#" + fuInpId).val();
        if (fuInpVal != "") {
            let axpFName = fuInpId.substr(7);
            var axpPath = "";
            if (typeof $("textarea[id*=" + axpFName + "]").not(".axpAttach")[0] != "undefined")
                axpPath = $("textarea[id*=" + axpFName + "]").not(".axpAttach")[0].value;
            else
                axpPath = $("input[id*=" + axpFName + "]").not(".axpAttach")[0].value;
            $.each(fuInpVal.split(','), function (i, val) {
                let _fullval = val;
                if (_fullval == "")
                    return;
                if (axpPath != "" && axpPath.endsWith("\\*"))
                    val = val.substr(20);
                var file = {
                    name: _fullval,
                    size: "0",
                    status: Dropzone.ADDED,
                    accepted: true
                };
                myDropzone.emit("addedfile", file);
                myDropzone.emit("complete", file);
                myDropzone.files.push(file);

                var hdnScriptsUrlPath = $j("#hdnScriptsUrlpath");
                let filePath = hdnScriptsUrlPath.val() + "axpert/" + sid + "/";
                filePath += _fullval;

                $(file.previewElement).find(".dropzone-filename span").text(val);
                $(file.previewElement).find(".dropzone-filename span").attr("data-fullfile", _fullval);
                $(file.previewElement).find(".dropzone-filename").attr("onclick", "ShowAxpFileuploadLink('" + $(myDropzone.files[0].previewElement).parents(".dropzone").attr("id").substr(9) + "','" + _fullval + "','" + filePath + "')")
            });
            if (fuInpVal != "") {
                let _thisATag = $("a#" + fuInpId).length != 0 ? $("a#" + fuInpId) : $("#" + fuInpId).next().find("a.dropzone-select");
                let _thisSpan = _thisATag.find('span')[0];
                let _thissrFile = fuInpVal.split(',')[0];
                if (axpPath != "" && axpPath.endsWith("\\*"))
                    _thissrFile = _thissrFile.substr(20);
                _thisATag.text(_thissrFile);
                _thisATag.prepend(_thisSpan).attr("title", "Drop files here or click to upload");
            }
            $(id).find(".fileuploadmore").removeClass("d-none");
        }
    });
}

$(document).on("mouseover", ".fileuploadmore", function () {
    if ($(this).parents(".dropzone").find(".dropzone-items").hasClass("d-none")) {
        let elId = $(this).parents(".dropzone").attr("id");
        var popover_instance = bootstrap.Popover.getInstance(this); //get instance
        if (popover_instance.tip != null)
            popover_instance.tip.classList.add('mw-350px');
        popover_instance._config.content = "<div class=\"dropzone dropzone-queue mt-n3\" id=\"" + elId + "\">" + $(this).parents(".dropzone").find(".dropzone-items").html() + "</div>";
        popover_instance.show();
    } else
        $(this).parents(".dropzone").find(".dropzone-items").addClass("d-none");
});


$j(document).on("mouseover", "body", function (e) {
    if (!$(e.target).hasClass("fileuploadmore") && !$(e.target).hasClass("grdattch") && !$(e.target).hasClass("gridattach") && !$(e.target).hasClass("fw-boldest") && !$(e.target).hasClass("popover-arrow") && !$(e.target).hasClass("popover-body") && !$(e.target).hasClass("dropzone-delete") && !$(e.target).hasClass("dropzoneItemDelete") && !$(e.target).hasClass("dropzoneGridItemDelete") && !$(e.target).hasClass("dropzone-panel") && !$(e.target).hasClass("dropzone-file") && !$(e.target).hasClass("dropzone") && !$(e.target).hasClass("dropzone-items") && !$(e.target).hasClass("dropzone-item") && !$(e.target).hasClass("dropzone-filename") && !$(e.target).parent().hasClass("dropzone-filename")) {
        $("[data-bs-toggle]").popover("hide");
    }
});

$j(document).on("click", ".popover-body .dropzoneItemDelete", function (e) {
    const id = $(e.target).parents(".dropzone").attr("id");
    const dropzone = document.querySelector("#" + id);
    var myDropzone = Dropzone.forElement(dropzone);
    //myDropzone.removeFile(myDropzone.files[0]);
    const delFileName = typeof $(e.target).parents(".dropzone-item").find(".dropzone-filename span").data('fullfile') == 'undefined' ? $(e.target).parents(".dropzone-item").find(".dropzone-filename").text() : $(e.target).parents(".dropzone-item").find(".dropzone-filename span").data('fullfile');
    const delFileObj = myDropzone.files.filter(file => file.name == delFileName)?.[0];
    if (delFileObj) {
        $("[data-bs-toggle]").popover("hide");
        myDropzone.removeFile(delFileObj);
    }
});

function TstFldImageUpload(elem) {
    var fileUpload = elem;
    var files = fileUpload.files;
    var data = new FormData();
    for (var i = 0; i < files.length; i++) {
        data.append(files[i].name, files[i]);
    }


    var url = location.origin + location.pathname.substr(0, location.pathname.indexOf('aspx'));
    let isAxpImagePath = $("#isAxpImagePathHidden").val();
    $.ajax({
        url: url + `TstImageUpload.ashx?fldname=${$(elem).attr("id")}&isAxpImagePath=${isAxpImagePath}`,
        type: "POST",
        data: data,
        contentType: false,
        processData: false,
        success(result) {
            const _thisName = $(elem).attr("id");
            if (result.indexOf("success:") > -1) {
                $(elem).parents(".image-input").find(".imageFileUpload").addClass("d-none");
                $(elem).parents(".image-input").find(".profile-pic").removeClass("d-none");
                let hdnScriptsUrlPath = $j("#hdnScriptsUrlpath");
                let imgFldName = GetFieldsName(_thisName);
                let fldValuePath = "";
                if (imgFldName.startsWith('nodb_') || isAxpImagePath == "true")
                    fldValuePath = hdnScriptsUrlPath.val() + "axpert/" + sid + "/" + imgFldName + "/" + files[0].name;
                else
                    fldValuePath = hdnScriptsUrlPath.val() + "axpert/" + sid + "/" + files[0].name;
                $("img#" + _thisName).css({ "background-image": "unset" });
                $("img#" + _thisName).prop("src", fldValuePath);
                $("#" + _thisName).parent().find(".delete-button").removeClass("d-none");

                UpdateFieldArray(_thisName, "0", files[0].name, "parent", "");
                UpdateAllFieldValues(_thisName, files[0].name);
                showAlertDialog("success", result.replace("success:", ""));
            } else {
                $("img#" + _thisName).css({ "background-image": "unset" });
                if (result == "error:sessionexpired")
                    CheckSessionTimeout(result);
                else if (result.startsWith("error:"))
                    showAlertDialog("error", result.replace("error:", ""));
            }
        },
        error(err) {
            handlerType = "upload";
            showAlertDialog("error", err.statusText);
        }
    });
}

function HeaderAttachFiles() {
    const id = "#attachment-overlay";
    const dropzone = document.querySelector(id);

    // set the preview element template
    var previewNode = dropzone.querySelector(".dropzone-item");
    previewNode.id = "";
    var previewTemplate = previewNode.parentNode.innerHTML;
    previewNode.parentNode.removeChild(previewNode);

    var url = location.origin + location.pathname.substr(0, location.pathname.indexOf('aspx'));

    let attachmentSizeMB = callParentNew("axAttachmentSize", "axAttachmentSize") == undefined ? 1 : callParentNew("axAttachmentSize", "axAttachmentSize");

    var myhdrDropzone = new Dropzone(id, { // Make the whole body a dropzone
        url: url + `HeaderFileUpload.ashx?act=attach`,
        maxFilesize: attachmentSizeMB, // Max filesize in MB
        previewTemplate: previewTemplate,
        previewsContainer: id + " .dropzone-items", // Define the container to display the previews
        clickable: id + " .dropzone-select", // Define the element that should be used as click trigger to select files.
        dictDuplicateFile: "Duplicate Files Cannot Be Uploaded",
        preventDuplicates: true
    });

    const dzdefault = dropzone.querySelectorAll('.dz-default');
    $(dzdefault).addClass("d-none");

    myhdrDropzone.on("addedfile", function (file) {
        // Hookup the start button
        const dropzoneItems = dropzone.querySelectorAll('.dropzone-item');
        dropzoneItems.forEach(dropzoneItem => {
            dropzoneItem.style.display = '';
        });
    });

    // Hide the total progress bar when nothing"s uploading anymore
    myhdrDropzone.on("complete", function (progress) {
        const progressBars = dropzone.querySelectorAll('.dz-complete');
        if (progress.status == 'success') {
            if (progress.xhr.response == "success" || progress.xhr.response.startsWith("success:")) {
                let mesg = progress.xhr.response;
                $(progress.previewElement).parents(".dropzone").find(".fileuploadmore").removeClass("d-none");
                $(progress.previewElement).parents(".dropzone").find("#hattachCounter").removeClass("d-none");  
                $(progress.previewElement).parents(".dropzone").find("span.spanAttCount").text(this.files.length);
                filenamearray.push(progress.name);

                var rid = 0;
                if ($j("#recordid000F0").length > 0)
                    rid = $j("#recordid000F0").val();

                var attachstr = CheckUrlSpecialChars(progress.name);
                $(progress.previewElement).find(".dropzone-filename").attr("onclick", "OpenAttachment('" + attachstr + "','" + rid + "');");

                showAlertDialog("success", mesg.split(":")[1]);
            } else {
                let mesg = progress.xhr.response;
                myhdrDropzone.removeFile(progress);
                showAlertDialog("error", mesg.split(":")[1]);
            }
        } else {
            if (progress.status == 'error')
                showAlertDialog("warning", $(progress.previewTemplate).find(".dropzone-error").text());
        }
    });

    myhdrDropzone.on("error", function (file) {
        myhdrDropzone.removeFile(file);
    });

    myhdrDropzone.on("removedfile", function (file) {
        //var rid = 0;
        //if ($j("#recordid000F0").length > 0)
        //    rid = $j("#recordid000F0").val();        
        //RemoveFile(file.name, rid);
        RemoveArrVal(file.name, filenamearray);
        if (this.files.length > 0)
            //$(file.previewElement).parents(".dropzone").find("span.spanAttCount").text(this.files.length);
            $(this.element).find("span.spanAttCount").text(this.files.length);
        else {
            $(this.element).find(".fileuploadmore").addClass("d-none");
            $(this.element).find("span.spanAttCount").text(this.files.length);
            $(this.element).find("#hattachCounter").addClass("d-none");  
        }
    });

    if (fileonloadarray.length > 0) {
        $.each(fileonloadarray, function (i, val) {
            var file = {
                name: val,
                size: "0",
                status: Dropzone.ADDED,
                accepted: true
            };
            myhdrDropzone.emit("addedfile", file);
            myhdrDropzone.emit("complete", file);
            myhdrDropzone.files.push(file);
            let rid = 0;
            if ($j("#recordid000F0").length > 0)
                rid = $j("#recordid000F0").val();

            let attachstr = CheckUrlSpecialChars(file.name);
            $(file.previewElement).find(".dropzone-filename").attr("onclick", "OpenAttachment('" + attachstr + "','" + rid + "');");
        });
        $(id).find("span.spanAttCount").text(myhdrDropzone.files.length);
        $(id).find(".fileuploadmore").removeClass("d-none");
        $(id).find("#hattachCounter").removeClass("d-none");        
    }
}

$j(document).on("click", ".popover-body .dropzoneItemDeleteHeader", function (e) {
    const dropzone = document.querySelector("#attachment-overlay");
    var myDropzone = Dropzone.forElement(dropzone);
    const delFileName = $(e.target).parents(".dropzone-item").find(".dropzone-filename").text();
    const delFileObj = myDropzone.files.filter(file => file.name == delFileName)?.[0];
    if (delFileObj) {
        var rid = 0;
        if ($j("#recordid000F0").length > 0)
            rid = $j("#recordid000F0").val();
        RemoveFile(delFileName, rid, delFileObj);
        //myDropzone.removeFile(delFileObj);
    }
});

function rtfCkeditorAlignment() {
    var A = document.getElementsByTagName("textarea") && document.getElementsByClassName("memofam");
    for (var B = 0; B < A.length; B++) {
        if (A[B].id.startsWith("rtf_") || A[B].id.startsWith("rtfm_") || A[B].id.startsWith("fr_rtf_") || GetDWBFieldType(GetFieldsName(A[B].id)) == "Rich Text" || (GetDWBFieldType(GetFieldsName(A[B].id)) == "Large Text" && !A[B].id.startsWith("exp_editor_"))) {
            A[B].parentElement.classList.add("flex-root");
            A[B].parentElement.parentElement.classList.add(..."d-flex flex-column".split(" "));
        } else if (A[B].id.startsWith("exp_editor_")) {
            A[B].parentElement.classList.add("flex-root");
            if (staticRunMode)
                A[B].parentElement.parentElement.classList.add(..."d-flex flex-column".split(" "));
        }
    }
}

function DropzoneGridInit(dvId) {
    let _thisDiv;
    if (typeof dvId != "undefined") {
        _thisDiv = $(dvId + " .dropzoneGrid");
    } else {
        _thisDiv = $("[id^='divDc']:not(:has(.editWrapTr)) .dropzoneGrid");// $("#divDc1 .dropzone");
    }
    _thisDiv.each(function () {
        if ($(this).parents('.editWrapTr').length > 0)
            return;
        const id = "#" + $(this).attr("id");
        const dropzone = document.querySelector(id);

        // set the preview element template
        var previewNode = dropzone.querySelector(".dropzone-item");
        previewNode.id = "";
        var previewTemplate = previewNode.parentNode.innerHTML;
        previewNode.parentNode.removeChild(previewNode);

        var url = location.origin + location.pathname.substr(0, location.pathname.indexOf('aspx'));
        const fuName = $(id).attr("id").substr(9);
        funame = fuName.substring(0, fuName.lastIndexOf("F") - 3);
        let attachmentSizeMB = callParentNew("axAttachmentSize", "axAttachmentSize") == undefined ? 1 : callParentNew("axAttachmentSize", "axAttachmentSize");
        let maxFilesUpload = AxpFileUploadlmt != "0" ? AxpFileUploadlmt : 100;

        var myDropzone = new Dropzone(id, { // Make the whole body a dropzone
            url: url + `TstGridFileUpload.ashx?thisFld=${$(id).attr("id").substr(9)}&filePath=${$("#" + funame + "path" + $(id).attr("id").substring($(id).attr("id").lastIndexOf("F") - 3)).val() == undefined ? "" : $("#" + funame + "path" + $(id).attr("id").substring($(id).attr("id").lastIndexOf("F") - 3)).val()}&dcNo=${GetFieldsDcNo($(id).attr("id"))}&attFldName=${funame}&attTransId=${transid}`,
            maxFilesize: attachmentSizeMB, // Max filesize in MB
            previewTemplate: previewTemplate,
            previewsContainer: id + " .dropzone-items", // Define the container to display the previews
            clickable: id + " .dropzone-select", // Define the element that should be used as click trigger to select files.
            maxFiles: maxFilesUpload
        });

        const dzdefault = dropzone.querySelectorAll('.dz-default');
        $(dzdefault).addClass("d-none");

        myDropzone.on("addedfile", function (file) {
            if (gridRowEditOnLoad) {
                let thisFldId = $(id).attr("id").substr(9);
                var fieldRowNo = GetFieldsRowNo(thisFldId);
                var fldDcNo = GetFieldsDcNo(thisFldId);
                UpdateGridRowFlags(thisFldId, fldDcNo, fieldRowNo);
            }

            this.options.url = url + `TstGridFileUpload.ashx?thisFld=${$(id).attr("id").substr(9)}&filePath=${$("#" + funame + "path" + $(id).attr("id").substring($(id).attr("id").lastIndexOf("F") - 3)).val() == undefined ? "" : $("#" + funame + "path" + $(id).attr("id").substring($(id).attr("id").lastIndexOf("F") - 3)).val()}&dcNo=${GetFieldsDcNo($(id).attr("id"))}&attFldName=${funame}&attTransId=${transid}`;
            // Hookup the start button
            const dropzoneItems = dropzone.querySelectorAll('.dropzone-item');
            dropzoneItems.forEach(dropzoneItem => {
                dropzoneItem.style.display = '';
            });
        });

        // Hide the total progress bar when nothing"s uploading anymore
        myDropzone.on("complete", function (progress) {
            const progressBars = dropzone.querySelectorAll('.dz-complete');
            if (progress.status == 'success') {
                if (progress.xhr.response == "success" || progress.xhr.response.startsWith("success:")) {
                    let mesg = progress.xhr.response;
                    $(progress.previewElement).parents(".dropzone").find(".fileuploadmore").removeClass("d-none");
                    let fuInpId = $(progress.previewElement).parents(".dropzone").attr("id").substr(9);
                    let fuInpVal = $("#" + fuInpId).val();
                    if (fuInpVal == "") {
                        let _thisFldWidth = $("#" + fuInpId).parent().width();
                        $("#" + fuInpId).parent().width(_thisFldWidth);
                        let _thisSpan = $("a#" + fuInpId).find('span')[0];
                        $("a#" + fuInpId).text(progress.name);
                        $("a#" + fuInpId).prepend(_thisSpan).attr("title", "Drop files here or click to upload");
                    }
                    fuInpVal = fuInpVal == "" ? progress.name : fuInpVal + "," + progress.name;
                    $("#" + fuInpId).val(fuInpVal);

                    var hdnScriptsUrlPath = $j("#hdnScriptsUrlpath");
                    let filePath = hdnScriptsUrlPath.val() + "axpert/" + sid + "/";
                    filePath += progress.name;

                    $(progress.previewElement).find(".dropzone-filename").attr("onclick", "ShowGridAttLink('" + filePath + "')")

                    var fRowNo = GetFieldsRowNo(fuInpId);
                    var dcNo = GetFieldsDcNo(fuInpId);
                    var fldDbRow = GetDbRowNo(fRowNo, dcNo);
                    UpdateFieldArray(fuInpId, fldDbRow, fuInpVal, "parent", "");
                    UpdateAllFieldValues(fuInpId, fuInpVal);
                    showAlertDialog("success", mesg.split(":")[1]);
                } else {
                    let mesg = progress.xhr.response;
                    myDropzone.removeFile(progress);
                    showAlertDialog("error", mesg.split(":")[1]);
                }
            } else {
                if (progress.status == 'error')
                    showAlertDialog("warning", $(progress.previewTemplate).find(".dropzone-error").text());
            }
        });

        myDropzone.on("error", function (file) {
            myDropzone.removeFile(file);
        });

        myDropzone.on("removedfile", function (file) {
            let fuInpId = $(myDropzone.element).attr("id").substr(9);
            let fuInpVal = $("#" + fuInpId).val();
            fuInpVal = fuInpVal.replace(file.name + ",", "").replace(file.name, "");
            if (fuInpVal[fuInpVal.length - 1] == ",")
                fuInpVal = fuInpVal.substring(0, fuInpVal.length - 1);
            $("#" + fuInpId).val(fuInpVal);
            var fRowNo = GetFieldsRowNo(fuInpId);
            var dcNo = GetFieldsDcNo(fuInpId);
            var fldDbRow = GetDbRowNo(fRowNo, dcNo);
            UpdateFieldArray(fuInpId, fldDbRow, fuInpVal, "parent", "");
            UpdateAllFieldValues(fuInpId, fuInpVal);
            if (fuInpVal == "") {
                $(myDropzone.element).find(".fileuploadmore").addClass("d-none");
                let _thisSpan = $("a#" + fuInpId).find('span')[0];
                $("a#" + fuInpId).text("Drop files here or click to upload");
                $("a#" + fuInpId).prepend(_thisSpan).attr("title", "");
            } else {
                let _thisSpan = $("a#" + fuInpId).find('span')[0];
                $("a#" + fuInpId).text(fuInpVal.split(',')[0]);
                $("a#" + fuInpId).prepend(_thisSpan).attr("title", "Drop files here or click to upload");
            }
        });


        let fuInpId = $(id).attr("id").substr(9)
        let fuInpVal = $("#" + fuInpId).val();
        if (fuInpVal != "") {
            $.each(fuInpVal.split(','), function (i, val) {
                var file = {
                    name: val,
                    size: "0",
                    status: Dropzone.ADDED,
                    accepted: true
                };
                myDropzone.emit("addedfile", file);
                myDropzone.emit("complete", file);
                myDropzone.files.push(file);

                var hdnScriptsUrlPath = $j("#hdnScriptsUrlpath");
                let filePath = hdnScriptsUrlPath.val() + "axpert/" + sid + "/";
                filePath += file.name;

                $(file.previewElement).find(".dropzone-filename").attr("onclick", "ShowGridAttLink('" + filePath + "')")
            });
            if (fuInpVal != "") {
                let _thisSpan = $("a#" + fuInpId).find('span')[0];
                $("a#" + fuInpId).text(fuInpVal.split(',')[0]);
                $("a#" + fuInpId).prepend(_thisSpan).attr("title", "Drop files here or click to upload");
            }
            $(id).find(".fileuploadmore").removeClass("d-none");
        }
    });
}

$j(document).on("click", ".popover-body .dropzoneGridItemDelete", function (e) {
    const id = $(e.target).parents(".dropzone").attr("id");
    const dropzone = document.querySelector("#" + id);
    var myDropzone = Dropzone.forElement(dropzone);
    //myDropzone.removeFile(myDropzone.files[0]);
    const delFileName = $(e.target).parents(".dropzone-item").find(".dropzone-filename").text();
    const delFileObj = myDropzone.files.filter(file => file.name == delFileName)?.[0];
    if (delFileObj) {
        $("[data-bs-toggle]").popover("hide");
        myDropzone.removeFile(delFileObj);
    }
});

$j(document).off("click", ".gridHeaderSwitch").on("click", ".gridHeaderSwitch", function (e) {
    let _thisDicId = $(this).attr("id");
    _thisDicId = _thisDicId.substr(7);
    if ($(this).is(":checked")) {
        if ($("#divDc" + _thisDicId + " .gridIconBtns").length > 0) {
            $("#divDc" + _thisDicId + " .griddivColumn").removeClass("d-none");
            $("#divDc" + _thisDicId + " .gridIconBtns").removeClass("d-none");
        } else
            $("#divDc" + _thisDicId).removeClass("d-none");
        GetDcStateValue(_thisDicId, 'T');
    } else {
        var isRecLoad = false;
        var rid = $j("#recordid000F0").val();
        if (rid != "0")
            isRecLoad = true;
        //if (rid != "0") {
        //    if ($("#divDc" + _thisDicId + " .gridIconBtns").length > 0) {
        //        $("#divDc" + _thisDicId + " .griddivColumn").addClass("d-none");
        //        $("#divDc" + _thisDicId + " .gridIconBtns").addClass("d-none");
        //    } else
        //        $("#divDc" + _thisDicId).addClass("d-none");
        //    GetDcStateValue(_thisDicId, 'F');
        //} else {
            var isExitDummy = false;
            if (gridDummyRowVal.length > 0) {
                gridDummyRowVal.map(function (v) {
                    if (v.split("~")[0] == _thisDicId) isExitDummy = true;
                });
            }
            if (!isExitDummy && $(".wrapperForGridData" + _thisDicId + " table tbody tr").length > 0) {
                var cutMsg = eval(callParent('lcm[520]'));
                cutMsg = cutMsg.replace('{0}', GetDcCaption(_thisDicId));
                var glType = eval(callParent('gllangType'));
                var isRTL = false;
                if (glType == "ar")
                    isRTL = true;
                else
                    isRTL = false;
                var clearThisDCGrid = $.confirm({
                    theme: 'modern',
                    closeIcon: false,
                    rtl: isRTL,
                    title: eval(callParent('lcm[155]')),
                    onContentReady: function () {
                        disableBackDrop('bind');
                    },
                    backgroundDismiss: 'false',
                    escapeKey: 'buttonB',
                    content: cutMsg,
                    buttons: {
                        buttonA: {
                            text: eval(callParent('lcm[164]')),
                            btnClass: 'btn btn-primary',
                            action: function () {
                                clearThisDCGrid.close();
                                var fDcRowCount = GetDcRowCount(_thisDicId);
                                DeleteAllRows(_thisDicId, fDcRowCount);
                                ShowDimmer(false);
                                $("#chkallgridrow" + _thisDicId).prop("checked", false);
                                $("#divDc" + _thisDicId + " .griddivColumn").addClass("d-none");
                                $("#divDc" + _thisDicId + " .gridIconBtns").addClass("d-none");

                                GetDcStateValue(_thisDicId, 'F');
                            }
                        },
                        buttonB: {
                            text: eval(callParent('lcm[192]')),
                            btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                            action: function () {
                                //$("#divDc" + _thisDicId + " .griddivColumn").addClass("d-none");
                                //$("#divDc" + _thisDicId + " .gridIconBtns").addClass("d-none");

                                $("#divDc" + _thisDicId + " .griddivColumn").removeClass("d-none");
                                $("#divDc" + _thisDicId + " .gridIconBtns").removeClass("d-none");
                                $("#dcBlean" + _thisDicId).prop("checked", true);
                                disableBackDrop('destroy');
                                return;
                            }
                        },
                    }
                });
            } else {
                if ($("#divDc" + _thisDicId + " .gridIconBtns").length > 0) {
                    $("#divDc" + _thisDicId + " .griddivColumn").addClass("d-none");
                    $("#divDc" + _thisDicId + " .gridIconBtns").addClass("d-none");
                } else {
                    if (IsFormDirty || isRecLoad) {
                        var cutMsg = eval(callParent('lcm[520]'));
                        cutMsg = cutMsg.replace('{0}', GetDcCaption(_thisDicId));
                        var glType = eval(callParent('gllangType'));
                        var isRTL = false;
                        if (glType == "ar")
                            isRTL = true;
                        else
                            isRTL = false;
                        var clearThisDCGrid = $.confirm({
                            theme: 'modern',
                            closeIcon: false,
                            rtl: isRTL,
                            title: eval(callParent('lcm[155]')),
                            onContentReady: function () {
                                disableBackDrop('bind');
                            },
                            backgroundDismiss: 'false',
                            escapeKey: 'buttonB',
                            content: cutMsg,
                            buttons: {
                                buttonA: {
                                    text: eval(callParent('lcm[164]')),
                                    btnClass: 'btn btn-primary',
                                    action: function () {
                                        clearThisDCGrid.close();
                                        var _thisFlds = GetGridFields(_thisDicId);
                                        _thisFlds.forEach(function (_thifld) {
                                            if (_thifld != "axp_recid" + _thisDicId) {
                                                let _thisfldId = _thifld + "000F" + _thisDicId;
                                                SetFieldValue(_thisfldId, "");
                                                UpdateFieldArray(_thisfldId, 0, "", "parent", "");
                                            }
                                        });
                                        ShowDimmer(false);
                                        $("#divDc" + _thisDicId).addClass("d-none");

                                        GetDcStateValue(_thisDicId, 'F');
                                    }
                                },
                                buttonB: {
                                    text: eval(callParent('lcm[192]')),
                                    btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                                    action: function () {
                                        //$("#divDc" + _thisDicId).addClass("d-none");
                                        $("#divDc" + _thisDicId).removeClass("d-none");
                                        $("#dcBlean" + _thisDicId).prop("checked", true);
                                        disableBackDrop('destroy');
                                        return;
                                    }
                                },
                            }
                        });
                    } else
                        $("#divDc" + _thisDicId).addClass("d-none");
                }
            }
            /*GetDcStateValue(_thisDicId, 'F');*/
       // }
    }
});

function GetDcStateValue(dcsId, expandDc) {
    try {
        if ($("#axp_dcstate000F1").length > 0) {
            let _thisIsFormDirty = IsFormDirty;
            if (dcsId == "") {
                AxpDcstateVal = $("#axp_dcstate000F1").val();
                if ($("[id^=dcBlean]").length > 0) {
                    let _axpdcval = "";// $("#axp_dcstate000F1").val();
                    if (_axpdcval == "") {
                        DCName.forEach(function () {
                            _axpdcval += "T";
                        })
                    }
                    var _arrAxpDc = Array.from(_axpdcval);
                    $("[id^=dcBlean]").each(function () {
                        if ($(this).hasClass('gridHeaderSwitch')) {
                            let _thisId = $(this).attr("id");
                            _thisId = parseInt(_thisId.substring(7));
                            if ($("#dcBlean" + _thisId).is(":checked"))
                                _arrAxpDc[_thisId - 1] = "T";
                            else
                                _arrAxpDc[_thisId - 1] = "F";
                        }
                    });
                    let _thidSwithVal = _arrAxpDc.join('');
                    let _thidFldId = $("#axp_dcstate000F1").attr("id");                    
                    SetFieldValue(_thidFldId, _thidSwithVal);
                    UpdateFieldArray(_thidFldId, "000", _thidSwithVal, "parent");
                    MainBlur($("#axp_dcstate000F1"));
                }
                AxExecFormControl = false;
            } else {
                let _dcSVal = $("#axp_dcstate000F1").val();
                var _arrAxpDc = Array.from(_dcSVal);
                _arrAxpDc[parseInt(dcsId) - 1] = expandDc;
                let _thidSwithVal = _arrAxpDc.join('');
                let _thidFldId = $("#axp_dcstate000F1").attr("id");
                SetFieldValue(_thidFldId, _thidSwithVal);
                UpdateFieldArray(_thidFldId, "000", _thidSwithVal, "parent");
                MainBlur($("#axp_dcstate000F1"));
            }
            if (!_thisIsFormDirty)
                IsFormDirty = false;
        }
    } catch (ex) { }
}

function GetDcStateOnLodaData() {
    let _thisRid = $j("#recordid000F0").val();
    if (_thisRid != "0") {
        if ($("#axp_dcstate000F1").length > 0 && $("#axp_dcstate000F1").val() != "" && AxpDcstateVal != "") {
            var _arrAxpDc = Array.from(AxpDcstateVal);
            _arrAxpDc.forEach(function (val, ind) {
                if (ind == 0)
                    return true;
                if (val == "T")
                    AxFormControlList.push("expand~" + DCName[ind]);
                else
                    AxFormControlList.push("collapse~" + DCName[ind]);
            });
            if (AxFormControlList.length > 0)
                ProcessScriptFormControlOnList('axp_dcstate');
        }
    }
}
