/////////////////////////////////////////////////////////////////////////
//By MANIKANTA                                                         //
//I was sad because i didnt have shoe then i saw a man with no feet-MG //
/////////////////////////////////////////////////////////////////////////


// var axCacheManager = {};

if (typeof isPageBuilder === "undefined") {
    var isPageBuilder = false;
}


const allTabNames = [];


const alreadyUsedResp = [];

const maxScrollElemntsInMenu = 20;
var menuSelectedList = [];

const maxChanges = 10; //after the count alert popup will come to save the changed
var homeBuilderJson = {};
var iconsHtml = "";
var autoComData = {};
var builderActiveElement = "";//have active elemnt
var confirmBox, deleteCnfrmBx;//to hold confrm bx instances
var isChangesMade = false;

var userBuildResps = [];
var isDataPublished = "Y";
var localLangFile = {};
var deletedLstArray = [];
var changesTrackerArray = [];
var homeJsonObj, ajaxCallObj, isRearranged, startIndex = "";
var tempPubObj = {};
// var userRoles = 
//var userResps = "";
if(parent.userResp != undefined)
    var userResps = parent.userResp;
else
    userResps = callParentNew("userResps");
//var userResps = parent.userResp;
userResps = userResps.split(",");
agileChartsObj = new AgileCharts("build");
// inheritsFrom(MakeHBAjaxCall, MainAjaxCalls);
inheritsFrom(MakeHBAjaxCall, HomePage);
ajaxCallObj = new MakeHBAjaxCall();
homeJsonObj = new HomeBuilderJsonObj();
var isValidPage = ajaxCallObj.isPageValid();
if (isValidPage) {
    ajaxCallObj.getNLSparameter();
} else {
    redirectPage(true);
}
//ajaxCallObj.getPublishedVersion();

var isAccessable =callParentNew("hasPageBuildAccess"); //parent.hasPageBuildAccess;
var presBuiildMode = "homeBuild";

if (!isAccessable) {
    // parent.LoadIframe("homepage.aspx");
    toggleToolBxInBuilder("hide");
    $("#toggleMyPagesBtn").hide();
} else {
    toggleToolBxInBuilder("show");
}


var theme = eval(callParent('currentThemeColor'));;
theme = theme || "default";
$("#homeBuilderLink").attr('href', "../App_Themes/" + theme + "/home_builder.min.css?v=4");


jQuery(document).ready(function ($) {

    handleLanguageSupprt();

    $("body").attr('dir', ax_direction);
    $("body").addClass("mtextDir" + ax_direction);
    $("#frmUploader").attr('action', apiBase + "upload");

    $("#imgUsername").val(mainUserName);
    $("#imgauthorization").val(parent.nodeAccessToken);
    $("#imgappSKey").val(appsessionKey);

    var ajaxFrmOptions = {
        beforeSubmit: showRequest, // pre-submit callback 
        success: showResponse, // post-submit callback 
        uploadProgress: showProgress
    };
    $('#frmUploader').ajaxForm(ajaxFrmOptions);
    $("#imgUploader").on('change', () => $("#frmUploader").submit());
    $("#propTableContent .propShtDataToggleIcon").on('click', function(e) {
        var elem = $(this);
        var target = elem.data('target');
        $("#propTableContent table tr[data-group='" + target + "']:not('.notSearchable')").toggle();
        elem.toggleClass('icon-chevron-up icon-chevron-down');
    });

    $("#propertySearchFld").on('keyup', function (e) {
        var elem = $(this);
        var enteredVal = elem.val().toLowerCase();
        var cutMsg = eval(callParent('lcm[0]'));
        var nodata = '<tr class="noDatFoundTr"><td colspan="2" class="center">' + cutMsg + '</td></tr>';
        $("#propTableContent table tbody .noDatFoundTr").remove();
        $("#propTableContent table tr:not('.notSearchable')").each(function (index, el) {
            var presTr = $(this);
            var childTd = presTr.find('td:first');
            if (enteredVal != "" && childTd.hasClass('subHeading')) {
                presTr.hide();
                return;
            }
            childTd.text().toLowerCase().indexOf(enteredVal) === -1 ? presTr.hide() : presTr.show();
        });
        if (elem.val() != "" && $("#propTableContent table tr:visible").length == 0) {
            $("#propTableContent table tbody").append(nodata)
        }
    });

    //property sheet scroll
    $("#propertySheetDataWrapper").on('scroll', () => {
        if ($("#iconWrapperData").length !== 0)
            toggleIcons("destroy")
    });

    var buildModeAccessLth = buildModeAccess.length;
    for (var i = 0; i < buildModeAccessLth; i++) {
        var presRole = buildModeAccess[i];
        if ($.inArray(presRole, userResps) !== -1) {
            userBuildResps.push(presRole);
        }
    }

    $('#createNewPageModalBtn').on('click', function(event) {
        if (!changesTracker("pageChange")) {
            event.stopPropagation();
            return false;

        }
    });

    $('#createNewPageModal').modal({
        dismissible: false,
        ready(modal, trigger) {
            var respData = homeJsonObj.allRoles;
            var respDataLth = respData.length;

            if (typeof isPageBuilder !== "undefined" && isPageBuilder) {
                createTheTreeView({ menuJSON: parent.menuJson, treeContainer: "#pageCreationTreeWrapper #treeWrapper", nodeCreatorInput: "#newTabName" })
            } else {
                var optionHtml = "";
                for (var i = 0; i < respDataLth; i++) {
                    var presResp = respData[i];
                    if (isPageBuilder || $.inArray(presResp, alreadyUsedResp) === -1)
                        optionHtml += '<option title="' + presResp + '" value="' + presResp + '">' + presResp + '</option>';
                }
                $('#multiselect').html(optionHtml).multiselect();
            }

            $("#hpbPageTemplateSelector .templateWrapper a").off('click.tempSelctn').on('click.tempSelctn', function(event) {
                event.preventDefault();
                $("#hpbPageTemplateSelector .templateWrapper a.createTick").removeClass('createTick');
                $(this).addClass('createTick');
            });
            materialModalEventsHandler("bind");

            $("#addPageIsPrivate").off('change.isPrivate').on('change.isPrivate', function(e) {
                if ($(this).is(':checked')) {
                    $("#createTabRespSelector").hide();
                } else {
                    $("#createTabRespSelector").show();
                }
            });
            $("#newTabName").focus();
        },
        complete() {
            materialModalEventsHandler("unbind");
            $("#multiselect_to").html("");
            $("#newTabName").val("");
            $("#addPageIsPrivate").prop('checked', false)
            $("#hpbPageRespSelector,#createTabRespSelector").show();
            $("#hpbPageTemplateSelector").hide();
        }
    });

    // where ever we click inside design canvas propertysheet should toggle 
    $("#sortable").on('click', function(event) {
        const activeTab = $("#HPBtabsHaeder .pageTab a.active");
        if (activeTab.data('ismyhomepage')) {
            //if its my homepage no need to show the property sheet
            return
        }
        const target = $(event.target);
        if (target && target.attr('id') === "sortable") openProprtySht("page", activeTab.data("tid"));
    });

    $('#searchPage').keyup(function(){  
        if($(".autocomplete-content").length == 0){      
            crateAutoCompleteFld("#searchPage", searchPageData);
        }
    });  


});
$("#imageSessionId").val(sId);
$("#imageUtl").val(utls);

$(document).on('click', '.htmlContentCard a', function (event) {
    event.preventDefault();
    //var href = $(this).attr('href');
    //window.open(href, "_blank");
});



function handleLanguageSupprt() {
    if (ax_language != "en") {
        var presLanArray = parent.lcm;
        localLangFile["discard"] = presLanArray[191] || "Discard";
        localLangFile["cancel"] = presLanArray[192] || "Cancel";
        localLangFile["save"] = presLanArray[200] || "Save";
        localLangFile["delete"] = presLanArray[248] || "Delete";
        localLangFile["cache_info"] = "Cache Information";

        $("#HMTsSrch").attr('placeholder', presLanArray[229]);
        $("#HBIVSrch").attr('placeholder', presLanArray[230]);
        $("#HBWSrch").attr('placeholder', presLanArray[193]);
        $("#HBCWSrch").attr('placeholder', presLanArray[194]);

        var img = presLanArray[195] || "Image";
        var st = presLanArray[196] || "Static Text";
        var sql = presLanArray[197] || "SQL Query";
        var rss = presLanArray[198] || "RSS Feed";
        var mtsk = presLanArray[199] || "My Tasks";

        $("#saveDesign,#customTxtAreaFooter button.save").attr('title', localLangFile["save"]);
        $("#customTxtAreaFooter button.cancel").attr('title', localLangFile["cancel"]);
        $(".customWidgetsUl li[data-type='Custom__img']").attr('title', img).text(img);
        $(".customWidgetsUl li[data-type='Custom__txt']").attr('title', st).text(st);
        $(".customWidgetsUl li[data-type='Custom__sql']").attr('title', sql).text(sql);
        $(".customWidgetsUl li[data-type='Custom__rss']").attr('title', rss).text(rss);
        $(".customWidgetsUl li[data-type='Custom__mytsk']").attr('title', mtsk).text(mtsk);

        $("#prpShtImgWrapper td:first").text(img);
        $("#publishDesign").attr('title', presLanArray[201]);
        $("#HPBToolBox .hpbWrapper .title").text(presLanArray[202]);
        $("#HPBdesignerCanvas .hpbHeaderTitle .title").text(presLanArray[203]);
        $("#propertySheet .hpbHeaderTitle .title").text(presLanArray[204]);

        $("#propTableContent td .td-general").text(presLanArray[205]);
        $("#propTableContent td .td-src").text(presLanArray[228]);
        $("#propTableContent td .td-appr").text(presLanArray[212]);
        $("#propTableContent td .td-auth").text(presLanArray[223]);
        $("#propTableContent td .td-log").text(presLanArray[225]);

        $("#ppsLcmp").text(presLanArray[206]);
        $("#ppsLttl").text(presLanArray[207]);
        $("#prpShtTargetTypeWrapper td:first").text(presLanArray[208]);
        $("#prpShtCustomTargetWrapper td:first,#prpShtTargetWrapper td:first").text(presLanArray[209]);
        $("#prpShtTargetType option:eq(0)").text(presLanArray[210]);
        $("#prpShtTargetType option:eq(2)").text(presLanArray[229]);
        $("#prpShtTargetType option:eq(3)").text(presLanArray[230]);

        $("#prpShtTxtBxWrapper td:first").text(presLanArray[211]);
        $("#prpShtTtlRgnTr td:first").text(presLanArray[213]);
        $("#prpShtImgRespTr td:first").text(presLanArray[214]);
        $("#prpShtTitlePickerTr td:first").text(presLanArray[215]);
        $("#prpShtIcnClrTr td:first").text(presLanArray[216]);
        $("#prpShtTtlClrTr td:first").text(presLanArray[217]);
        $("#prpShtTtlBgClrTr td:first").text(presLanArray[218]);
        $("#prpShtFmBgClrTr td:first").text(presLanArray[219]);
        $("#prpShtFmTcTr td:first").text(presLanArray[220]);
        $("#bdTxtClrTr td:first").text(presLanArray[221]);
        $("#bdBgClrTr td:first").text(presLanArray[222]);
        $("#prpShrResptr td:first").text(presLanArray[224]);
        $("#prpShtMdByTr td:first").text(presLanArray[226]);
        $("#prpShtMdyOnTr td:first").text(presLanArray[227]);
    } else {
        localLangFile["discard"] = "Discard";
        localLangFile["cancel"] = "Cancel";
        localLangFile["save"] = "Save";
        localLangFile["delete"] = "Delete";
        localLangFile["cache_info"] = "Cache Information";
    }
}

function assignColorToPanel(targetElemId, type, colr) {
    var targetElem = $("#" + targetElemId);
    switch (type) {
        case "icc":
            targetElem.find('.cardTitleWrapper i:first').css('color', colr);
            break;
        case "tc":
            targetElem.find('.cardTitle').css('color', colr);
            break;
        case "tbc":
            targetElem.find('.cardTitleWrapper').css('background-color', colr);
            break;
        case "fbc":
            targetElem.find('.fixed-action-btn .btn-floating').css('background-color', colr);
            break;
        case "fc":
            targetElem.find('.fixed-action-btn .btn-floating i').css('color', colr);
            break;
        case "bc":
            targetElem.find('.cardContentMainWrapper').css('color', colr);
            break;
        case "bbc":
            targetElem.find('.cardContentMainWrapper').css('background-color', colr);
            break;
        default:
            // statements_def
            break;
    }
}


function addEventsAfterLoad() {
    //for custom scroll bar
    $(".collectionListUl").mCustomScrollbar({
        axis: "y", // vertical and horizontal scrollbar
        theme: "minimal-dark",
        snapAmount: 0,
        scrollInertia: 500,
        autoExpandScrollbar: false,
        updateOnContentResize: true,
        callbacks: {
            whileScrolling() {
                var scrollTop = this.mcs.topPct;
                if (scrollTop === 100) {
                    var elem = $(this);
                    recreateMenu(elem.attr('id'));
                }
            }
        }
    });

    // for color picker
    $(".colorPicker").spectrum({
        color: "#01579b",
        chooseText: "Apply",
        clickoutFiresChange: false,
        change(color) {
            $(this).prev().val(color.toHexString());
            var type = $(this).data('type');
            var colr = color.toHexString(); // #ff0000
            homeJsonObj.updateDataInJson($(this).parents('#propertySheet').data('target'), type, colr);
        },
        move(color) {
            var elem = $(this);
            var targetElem = elem.parents('#propertySheet').data('target');
            var type = $(this).data('type');
            var colr = color.toHexString(); // #ff0000

            assignColorToPanel(targetElem, type, colr)
        },
        hide(color) {
            var elem = $(this);
            var targetElem = elem.parents('#propertySheet').data('target');
            var type = $(this).data('type');
            var colr = color.toHexString(); // #ff0000

            assignColorToPanel(targetElem, type, colr)
        }

    });

    $(".colorPickerInp").on("change keyup paste", function(e) {
        var elem = $(this);
        var colorValue = elem.val();
        var tinyColorValue = tinycolor(colorValue);
        if (tinyColorValue.isValid()) {
            elem.next().spectrum("set", tinyColorValue);
            var targetElem = elem.parents('#propertySheet').data('target');
            var type = elem.next().data('type');
            var colr = tinyColorValue.toHexString()
            assignColorToPanel(targetElem, type, colr)
            homeJsonObj.updateDataInJson(targetElem, type, colr);
        }
    });
    $(".colorPickerInp").on('blur', function(e) {
        var elem = $(this);
        var color = elem.next().spectrum("get");
        var colorName = color.toName()
        colorName ? elem.val(colorName) : elem.val(color.toHexString());
    });

    // for iconsearch fld keyup and focus,blur
    $("#prpShtIcon").on('keyup', function(e) {
        var elem = $(this);
        var elemVal = elem.val();
        toggleIcons();
        if (elemVal != "") {
            $('div#iconWrapperData span[class^="icon-"]').each(function (index, el) {
                var currentimg = $(this);
                var currimgClass = currentimg.attr('class');
                currimgClass.indexOf(elemVal) == -1 ? currentimg.hide() : currentimg.show();
            });

        }
    });
    $("#prpShtIcon").on('focus', function (e) {
        var elem = $(this);
        var elemVal = elem.val();
        toggleIcons();
        if (elemVal != "") {
            $('div#iconWrapperData span[class^="icon-"]').each(function (index, el) {
                var currentimg = $(this);
                var currimgClass = currentimg.attr('class');
                currimgClass.indexOf(elemVal) == -1 ? currentimg.hide() : currentimg.show();
            });

        }
    });
    $("#prpShtIcon").on('blur', function (e) {
        $(this).val($("#iconSelectorSpn").attr('class'));
    });

    //for toolbox search
    $(".toolBxPanelSrch").on('keyup', function(e) {
        if ((e.which <= 111 && e.which >= 48) || e.which == 8 || e.which == 46 || (e.which >= 186 && e.which <= 192) || (e.which >= 219 && e.which <= 222)) {
            var elem = $(this);
            var enteredVal = elem.val().toLowerCase();
            enteredVal = enteredVal.trim();
            var cutMsg = eval(callParent('lcm[0]'));
            var nodata = '<li data-target="emp" data-type="iview" class="collection-item noDatFound">' + cutMsg + '</li>';
            var nodatElem = elem.parents(".collection").find('.collectionListUl .collection-item.noDatFound');
            if (nodatElem.length !== 0)
                nodatElem.remove();
            var nextMainElem = elem.parents('.collection-header').next();
            var isDynamicData = nextMainElem.hasClass('dynamicData');
            var elemToPass = nextMainElem.attr('id');
            if (enteredVal != "") {
                if (isDynamicData) {
                    recreateMenu(elemToPass, "search", enteredVal)
                } else {
                    elem.parents(".collection").find('.collectionListUl .collection-item').each(function (index, el) {
                        var currentElem = $(this);
                        var textOfElem = currentElem.text().toLowerCase();
                        textOfElem.indexOf(enteredVal) == -1 ? currentElem.hide() : currentElem.show();
                    });
                }
                var visibleFrst = elem.parents(".collection").find('.collectionListUl .collection-item:visible:first');
                elem.parents(".collection").find('.collectionListUl .collection-item.activeLi').removeClass("activeLi");
                if (visibleFrst.length === 0) {

                    if (isDynamicData) {
                        elem.parents(".collection").find('.collectionListUl .mCSB_container').html(nodata);
                    } else {
                        var lastElem = elem.parents(".collection").find('.collectionListUl .collection-item:last');
                        $(nodata).insertAfter(lastElem);
                    }
                } else {
                    visibleFrst.addClass('activeLi');
                }

            } else {
                var nodatElem = elem.parents(".collection").find('.collectionListUl .collection-item.noDatFound');
                nodatElem.remove();
                if (isDynamicData) {
                    recreateMenu(elemToPass, "reset")
                } else {
                    elem.parents(".collection").find('.collectionListUl .collection-item').removeClass('activeLi').show();
                }
            }
        }
    });
    //for toolbar search actions
    $(".toolBxPanelSrch").on('keydown', function (e) {
        var elem = $(this);
        var parentWrapper = elem.parents(".collection");
        var activeElem = parentWrapper.find('.collectionListUl .collection-item.activeLi');
        if (activeElem.length > 0) {
            if (e.keyCode == 38) {
                e.preventDefault();
                var prevVisisbleLi = activeElem.prevAll("li.collection-item:visible").first();
                if (prevVisisbleLi.hasClass('collection-item')) {
                    activeElem.removeClass('activeLi');
                    prevVisisbleLi.addClass('activeLi');
                }
            } else if (e.keyCode == 40) {
                e.preventDefault();
                var nextVisibleLi = activeElem.nextAll("li.collection-item:visible").first();
                if (nextVisibleLi.hasClass('collection-item')) {
                    activeElem.removeClass('activeLi');
                    nextVisibleLi.addClass('activeLi');
                }
            } else if (e.keyCode == 13) {
                activeElem.dblclick();
            }
        }
    });

    //for multiselect
    $('select').material_select();
    $(document).on('change', '#prpShtRoles', function (e) {
        var presElem = $(this);
        if (presElem.val() == null || presElem.val().length == 0) {
            showAlertDialog("warning", "Please select atleast one responsibility.");
            $("#prpShtRolesWrappperTd .select-dropdown").addClass("customFldError");
        } else {
            $("#prpShtRolesWrappperTd .select-dropdown").removeClass('customFldError')
        }

    });

    $("#propertySheet").draggable({
        revert: false,
        scroll: false,
        appendTo: 'body',
        containment: 'window',
        handle: ".hpbHeaderTitle",
        cursor: 'move',
        start: function (event, ui) {
            $("#propertySheet").css('bottom', '');
        }
    })

    $("#HPBToolBox .collection-item,#sortable,#propertySheet .hpbHeaderTitle").disableSelection();
    addMenuEvents();
}

function addMenuEvents(elem) {
    var presElem = $(".collectionListUl");
    if (elem) {
        presElem = elem;
    }
    presElem.find(".collection-item:not('.noDataLi')").draggable({
        connectToSortable: "#sortable",
        revert: "invalid",
        revertDuration: 200,
        scroll: false,
        appendTo: 'body',
        containment: 'window',
        helper: function (event) {
            var targetElem = $(event.target);
            var panelHtml = getPanelHtml({
                templateObj: getTheTemplat(),
                idx: $("#sortable .ui-state-default").length || 0,
                type: targetElem.data('type'),
                title: targetElem.text(),
                target: targetElem.data('target'),
                isFirstTime: "isFirstTime",
                scenaRio: "notSaved",
                calledFrom: "builder"
            });
            return $(panelHtml)
        },
        start: function(event, ui) {
            if (!checkIfPageExists()) {
                return false;
            }
            if (!changesTracker("get")) {
                return false;
            }
            closeProprtySht();
            if ($("#sortable .ui-state-default").length >= totalWidgetCanAdd) {
                // Materialize.toast('Limit Exceeded', 4000)
                showAlertDialog("warning", 1042, "client");
                return false;
            }
            ui.helper.data("isWidgetDropedInCanvas", false);
            var width = $("#sortable .ui-state-default:first").outerWidth();
            var height = $("#sortable .ui-state-default:first").outerHeight();
            $(ui.helper[0]).css({
                width: width,
                "max-width": "300px",
                "max-hright": "300px",
                height: height
            });
        },
        stop: function(event, ui) {
            if (!ui.helper.data("isWidgetDropedInCanvas")) {
                $(this).dblclick();
            }
        },
        cursor: 'move'
    });

    var presElem = $(".toolBxPanelWrapper").find(".collectionListUl .collection-item");
    if (elem) {
        presElem = elem.find(".collection-item");
    }
    // when double clik on toolbar list
    presElem.off('dblclick.lstDblClk');
    presElem.on('dblclick.lstDblClk', function(e) {
        if (!checkIfPageExists()) {
            return false;
        }

        if (!changesTracker("get")) {
            return false
        }
        var elem = $(this);
        if ($(elem).hasClass('noDataLi'))
            return;

        if ($("#sortable .ui-state-default").length >= totalWidgetCanAdd) {
            // Materialize.toast('Limit Exceeded', 4000)
            showAlertDialog("warning", 1042, "client");
            return;
        }

        var target = elem.data('target');
        var targetId = target + "Wrapper";
        if (elem.hasClass('widgetCreated')) {
            createConfirmBox("deleteWidget", eval(callParent('lcm[9]')), "homeJsonObj~removeTheNode~" + targetId + "");
            return false;
        }
        var type = elem.data('type');

        var title = elem.text();
        if (elem.data('multiselect') !== false && targetId.indexOf("C__") == 0) {
            //means custom widget
            var dataCount = elem.attr('data-count');
            elem.addClass('createBadge');
            if (!dataCount)
                elem.attr('data-count', 1);
            else
                elem.attr('data-count', parseInt(dataCount) + 1);
        } else {
            elem.draggable("disable").addClass('widgetCreated');
        }

        var panelHtml = getPanelHtml({
            templateObj: getTheTemplat(),
            idx: $("#sortable .ui-state-default").length || 0,
            type: type,
            title: title,
            target: target,
            isFirstTime: "",
            scenaRio: "notSaved",
            calledFrom: "builder"
        });

        $("#hpbDsgnrcnvsWrapper #sortable.mainWidgetAddedWrapper").append(panelHtml);
        homeJsonObj.addInitialDataToJson(target + "Wrapper");
        addDragableEvents($("#" + target + "Wrapper"))
    });
    presElem.off('click.clck')
    presElem.on('click.clck', function (e) {
        var elem = $(this);
        var target = elem.data('target');
        var targetId = target + "Wrapper";
        if (elem.hasClass('widgetCreated')) {
            createConfirmBox("deleteWidget", parent.lcm[9], "homeJsonObj~removeTheNode~" + targetId + "");
            return false;
        }
    });
}


$(document).on('click', '#sortable .ui-state-default', function(event) {
    // if ($("#propertySheet").is(':visible') && !validateProprtySht())
    //     return false;

    //if its myhomepage then no need to open property sheet, But in future if we want to enable property sheet as well we can remove the below return
    if ($("#HPBtabsHaeder .pageTab a.active").data('ismyhomepage')) {
        return;
    }

    recreateMenu("toolBarLsttstruct", "reset")
    recreateMenu("toolBarLstiview", "reset")

    var elem = $(this);
    if (elem.hasClass('selectedForPropSht') || elem.hasClass('ui-sortable-helper')) {
        closeProprtySht();
        return;
    } else {
        var presFocussedElem = $(document.activeElement)
        if (presFocussedElem && presFocussedElem.attr("id") === "prpShtTarget" && $("#propertySheet").data("target").indexOf("C__rss") === 0) {
            presFocussedElem.blur();
        }

    }
    builderActiveElement = "card";
    $("#sortable .ui-state-default.selectedForPropSht").removeClass('selectedForPropSht');

    elem.addClass('selectedForPropSht');
    var type = elem.data('type');
    var idOfElem = elem.attr('id');
    var prsntJsonObj = homeJsonObj.jsonContent.jsonData[idOfElem];
    //clear all the values
    clearPropertySheet();

    $("#prpShtTitle").val(prsntJsonObj.tl);
    $("#prpShtIcon").val(prsntJsonObj.ic);
    $("#iconSelectorSpn").attr('class', prsntJsonObj.ic);
    if (type.indexOf("Custom__") !== -1) {
        var customElem = $(".customWidgetsUl .collection-item[data-type='" + type + "']");
        $("#prpShtComponent").text(customElem.text());
        $("#prpShtTargetType").material_select('destroy');
        $("#prpShtTargetType").val(prsntJsonObj.tgt);
        prpShtChangeTrgtType($("#prpShtTargetType"), "onClick",prsntJsonObj.tg)
        $('#prpShtTargetType').material_select();
        if (prsntJsonObj.tgt == "url" || prsntJsonObj.c == "Custom__rss") {
            $("#prpShtTarget").prop('disabled', false).val(prsntJsonObj.tg);
        } else {
            var targetName = $("#toolBarLst" + prsntJsonObj.tgt + " li[data-target='" + prsntJsonObj.tg + "']").text()
            $("#prpShtTarget").prop('disabled', false).val(targetName).data('key', prsntJsonObj.tg);
        }
        if (type == "Custom__html") {
            $("#prpShtTxtBx").val(prsntJsonObj.html);
        } else if (type == "Custom__txt") {
            $("#prpShtTxtBx").val(prsntJsonObj.txt);
        } else if (type == "Custom__sql") {
            $("#prpShtTxtBx").val(prsntJsonObj.sql);
        } else {
            $("#prpShtTxtBx").val(prsntJsonObj.dc);
        }
    } else {
        if (type === "tstruct") {
            // $("#prpShtDirectLoad")
            prsntJsonObj.dl === 'Y' ? $("#prpShtDirectLoad").prop('checked', true) : $("#prpShtDirectLoad").prop('checked', false);
        }
        $("#prpShtComponent").text(type);
        $("#prpShtTarget").prop('disabled', true).val(prsntJsonObj.tl);
        $("#prpShtTxtBx").val(prsntJsonObj.dc);
    }
    if (prsntJsonObj.lmb) {
        $("#prpShtModifiedBy").text(prsntJsonObj.dc);
        $("#prpShtModifiedOn").text(prsntJsonObj.dc);
    }
    let dependencyObject = prsntJsonObj.dep;
    if (dependencyObject) {
        $("#parameterMappingBtn").text(dependencyObject.join("~")).attr('onclick', `createDependencyPopup('${idOfElem}')`);
    }

    setColorInProp("prpShtIcnColor", prsntJsonObj.icc);
    setColorInProp("prpShtTtlColor", prsntJsonObj.tc);
    setColorInProp("prpShtTtlBgColor", prsntJsonObj.tbc);
    setColorInProp("prpShtBtnBgColor", prsntJsonObj.fbc);
    setColorInProp("prpShtBtnColor", prsntJsonObj.fc);
    setColorInProp("prpShtBodyTxtColor", prsntJsonObj.bc);
    setColorInProp("prpShtBodyColor", prsntJsonObj.bbc);
    if (prsntJsonObj.tr == "show") {
        $("#prpShtTargetRgn").prop('checked', true);
        $("#propertySheetDataWrapper .prpShtTitleRelated").removeClass('notSearchable').show();
    } else {
        $("#prpShtTargetRgn").prop('checked', false);
        $("#propertySheetDataWrapper .prpShtTitleRelated").addClass('notSearchable').hide();
    }
    if (prsntJsonObj.fb === "hide") {
        $("#prpShtFltngBtn").prop('checked', false);
        $(".prpShtfloatingBtnGrp").hide();
    } else {
        $("#prpShtFltngBtn").prop('checked', true);
        $(".prpShtfloatingBtnGrp").show();
    }

    if (prsntJsonObj.ir === "false") {
        $("#prpShtRespimg").prop('checked', false);
    } else {
        $("#prpShtRespimg").prop('checked', true);
    }
    if (prsntJsonObj.cwd === "Y") {
        $("#phpShtWidgetRefresher").prop('checked', true);
    } else {
        $("#phpShtWidgetRefresher").prop('checked', false);
    }
    $("#prpShtWidgetRefresheTimer").val(parseInt(prsntJsonObj.cei || 0));

    if (prsntJsonObj.lmb) {
        $("#prpShtModifiedBy").text(prsntJsonObj.lmb)
        $("#prpShtModifiedOn").text(prsntJsonObj.lmo)
    }

    var elemOffsetTop = elem.offset().top - 20;
    var scrollBody = $("#hpbDsgnrcnvsWrapper");
    if ((elemOffsetTop < 0) || ((elemOffsetTop + elem.outerHeight()) > $(window).height())) {
        scrollBody.stop().animate({
            scrollTop: scrollBody.scrollTop() + (elemOffsetTop) - 50
        }, 50, 'swing', function() {
            openProprtySht(type, idOfElem);
        });
    } else {
        openProprtySht(type, idOfElem);
    }

    if (type === "widget" && elem.find(".highcharts-container").length === 0) {
        var kpiColor = prsntJsonObj.kpiColor || "blue";
        if (kpiColor) {
            ChangePropertySheet("kpiWidgetClicked");
            $("#gradientPicker").attr('class', 'colorMe ' + kpiColor + ' center-align');
            $("#gradientPicker a").data('color', kpiColor).text(kpiColor);
        }
    }
});


function prpShtToggleSwtch(task, elem) {

    elem = $(elem);
    var targetId = elem.parents("#propertySheet").data('target');
    var targetElem = $("#" + targetId);
    if (elem.is(":checked")) {
        if (task == "ttlRgn") {
            targetElem.find('.card-content').removeClass('titleRemoved');
            targetElem.find('.cardContentMainWrapper').removeClass('mainTitleRemoved');
            var htToAdd = targetElem.find('.cardContentMainWrapper').outerHeight() - targetElem.find('.cardTitleWrapper').outerHeight();
            targetElem.find('.heightOfcardContentMainWrapper').css('height', htToAdd + "px");
            targetElem.find('.cardTitleWrapper').slideDown(300);
            homeJsonObj.updateDataInJson(targetId, "tr", "show");
            $("#propertySheetDataWrapper .prpShtTitleRelated").removeClass('notSearchable').show();
        } else if (task === "respImg") {
            targetElem.find('.card-image img').removeClass('nonResp');
            homeJsonObj.updateDataInJson(targetId, "ir", "true");
        } else if (task === "isPrivate") {
            $("#prpShtRepTr").hide();
            homeJsonObj.updateDataInJson(targetId, "ip", "Y");
        } else if (task === "isDefault") {
            homeJsonObj.updateDataInJson(targetId, "isDefault", "Y");
        } else if (task === "cacheWidget") {
            $("#prpShtWidgetRefresheTimerTr").show();
            homeJsonObj.updateDataInJson(targetId, "cwd", "Y");
        } else if (task === "floatingBtn") {
            $(".prpShtfloatingBtnGrp").show();
            targetElem.find('.runtimeActionWrapper').show();
            homeJsonObj.updateDataInJson(targetId, "fb", "show");
        }else if (task === "directLoad") {
            homeJsonObj.updateDataInJson(targetId, "dl", "Y");
        }
        else if (task === "widgetGroups") { 
            homeJsonObj.updateDataInJson(targetId, "wg", "Y");
        }
    } else {
        if (task == "ttlRgn") {
            var ttlRgnHeight = targetElem.find('.cardTitleWrapper').outerHeight();
            targetElem.find('.cardTitleWrapper').slideUp(300);
            setTimeout(function() {
                var htToAdd = targetElem.find('.cardContentMainWrapper').outerHeight() + ttlRgnHeight;
                targetElem.find('.heightOfcardContentMainWrapper').css('height', htToAdd + "px");
                targetElem.find('.card-content').addClass('titleRemoved');
                targetElem.find('.cardContentMainWrapper').addClass('mainTitleRemoved');

            }, 300)
            homeJsonObj.updateDataInJson(targetId, "tr", "hide");
            $("#propertySheetDataWrapper .prpShtTitleRelated").addClass('notSearchable').hide();
            if ($("#prpShtTitlePickerTr").hasClass('kpiWidgetIcon')) {
                $("#prpShtTitlePickerTr").removeClass('notSearchable').show();
            }
        } else if (task === "respImg") {
            targetElem.find('.card-image img').addClass('nonResp');
            homeJsonObj.updateDataInJson(targetId, "ir", "false");
        } else if (task === "isPrivate") {
            $("#prpShtRepTr").show();
            homeJsonObj.updateDataInJson(targetId, "ip", "N");
        } else if (task === "isDefault") {
            homeJsonObj.updateDataInJson(targetId, "isDefault", "N");
        } else if (task === "cacheWidget") {
            $("#prpShtWidgetRefresheTimerTr").hide();
            homeJsonObj.updateDataInJson(targetId, "cwd", "N");
        } else if (task === "floatingBtn") {
            $(".prpShtfloatingBtnGrp").hide();
            targetElem.find('.runtimeActionWrapper').hide();
            homeJsonObj.updateDataInJson(targetId, "fb", "hide");
        }else if (task === "directLoad") {
            homeJsonObj.updateDataInJson(targetId, "dl", "N");
        }
        else if (task === "widgetGroups") { 
            homeJsonObj.updateDataInJson(targetId, "wg", "N");
        }
    }

}


function setColorInProp(id, color) {
    var colorElem = $("#" + id);
    colorElem.val(color);
    colorElem.next().spectrum("set", color);
}

function closeProprtySht(calledFrom) {
    if ($("#propertySheet").hasClass('scale-out'))
        return true;
    //check weather rss field is focused
    var presFocussedElem = $(document.activeElement)
    if (presFocussedElem && presFocussedElem.attr("id") === "prpShtTarget" && $("#propertySheet").data("target").indexOf("C__rss") === 0) {
        presFocussedElem.blur();
    }

    $("#propertySheet").find('select,input').off('focus.propSheetFocus');
    var target = $("#propertySheet").data('target');
    var isPage = target.indexOf("__pageProps__") === 0;
    if (!isPage) {
        var type = homeJsonObj.jsonContent.jsonData[target].c;
        if (type && type.indexOf("Custom__") !== -1) {
            if ($("#prpShtTarget").hasClass('customFldError')) {
                homeJsonObj.updateDataInJson(target, "tgt", "none");
            }
        }
    }
    $("#propertySearchFld").val("").keyup();
    $("#propertySheet").data('target', "").removeClass('scale-in').addClass('scale-out');
    setTimeout(function() {
        $("#propertySheet").addClass('hide');
    }, 50)
    $("#sortable .ui-state-default.selectedForPropSht").removeClass('selectedForPropSht');
    $(document).off('blur.prpShtTargetErrorValidate');
    clearPropertySheet();
    $(document).off('keyup.esCapeDeleteCard');
    $(".colorPicker").spectrum("hide");
    if ((calledFrom !== "fromPopUp") && !changesTracker("get")) {
        return false;
    }
}

function openProprtySht(type, elemId, calledFrom) {
    if ($("#HPBtabsHaeder .pageTab a.active").data('ismyhomepage')) {
        //if its my homepage no need to show the property sheet
        return
    }
    if (type === "page") {
        // instead of closing propertysheet multiple places when we call open propsheet will toggle
        if ($("#HPBtabsHaeder a[data-tid=" + elemId + "]").hasClass('selectedForPropSht')) {
            closeProprtySht();
            return;
        }
    }

    let isPrivate = false;
    if (!changesTracker("get")) {
        return false
    }
    if (type != "page") {
        $("#" + elemId).addClass('selectedForPropSht');
        $("#prpShtWidgetGroupsTr").addClass("notSearchable").hide();
    } else {
        $("#HPBtabsHaeder a[data-tid=" + elemId + "]").addClass('selectedForPropSht');
        const cachedTabData = homeJsonObj.jsonContent.pageData[elemId];
        const changedTabData = cachedTabData.changedTabData || {};
        const presTabData = cachedTabData.tabData;
        const tabResps = changedTabData.rty || presTabData[metaDataCacher.tabData.RESPONSIBILITY];
        const template = changedTabData.tmp || presTabData[metaDataCacher.tabData.TEMPLATE];
        const isDefault = changedTabData.isDefault || presTabData[metaDataCacher.tabData.IS_DEFAULT];
        const wg = changedTabData.wg || presTabData[metaDataCacher.tabData.WIDGET_GROUPS];
        const UPDATED_BY = presTabData[metaDataCacher.tabData.UPDATED_BY] || presTabData[metaDataCacher.tabData.CREATED_BY];
        const UPDATED_ON = presTabData[metaDataCacher.tabData.UPDATED_ON];
        isPrivate = changedTabData.ip || presTabData[metaDataCacher.tabData.IS_PRIVATE];
        isPrivate = isPrivate === "Y";

        $("#prpShtIsPrivate").prop('checked', isPrivate);
        $("#prpShtIsDefault").prop('checked', (isDefault === 'Y'));
        $("#prpShtWidgetGroups").prop('checked', (wg === 'Y' && templateInfo[template].name.toLowerCase() === "basic"));
        if(templateInfo[template].name.toLowerCase() === "basic"){
            $("#prpShtWidgetGroupsTr").removeClass('notSearchable').show();
        }
        const selectedTemp = $("#prpShtTmpFropDwn li a[data-tmpid='" + template + "']");
        $("#prpShtTmpFropDwn").prev().html(selectedTemp.find('span').text() + '<span class="caret right">▼</span>');
        selectedTemp.parent().addClass('selected');
        var tabRespsArr = !tabResps || typeof tabResps === "object" ? tabResps : tabResps.split(",");
        var rolesData = homeJsonObj.allRoles;
        var rolesDataLngth = rolesData.length;
        var optionHtml = "";
        rolesData.forEach(function(element, index) {
            if (isPageBuilder || $.inArray(element, alreadyUsedResp) === -1 || $.inArray(element, tabRespsArr) !== -1)
                optionHtml += '<option title="' + element + '" value="' + element + '">' + element + '</option>';
        });
        $('#prpShtRoles').material_select('destroy');
        $("#prpShtRoles").html(optionHtml);
        $("#prpShtRoles").val(tabRespsArr);
        $('#prpShtRoles').material_select();
        if (!tabRespsArr) {
            $("#prpShtRolesWrappperTd .select-dropdown").val("");
        }
        $("#prpShtModifiedBy").text(UPDATED_BY);
        $("#prpShtModifiedOn").text(UPDATED_ON);
    }

    $(".commonCloseOnOpen").addClass('notSearchable').hide();
    if (type == "tstruct") {
        $("#prpShtCustomTargetWrapper,#prpShtTargetTypeWrapper,#prpShtDepTr,#prpShtDepMappingTr").addClass('notSearchable').hide();
        $("#prpShtImgRespTr,#prpShtDrLoadWrapper").removeClass('notSearchable').show();
    } else if (type == "iview") {
        $("#prpShtImgWrapper,#prpShtCustomTargetWrapper,#prpShtTargetTypeWrapper,#prpShtTxtBxWrapper").addClass('notSearchable').hide();
    } else if (type == "widget") {
        $(".prpShtfloatingBtnGrp,#bdTxtClrTr,#bdBgClrTr,#prpShtTargetTypeWrapper,#prpShtCustomTargetWrapper,#prpShtTargetWrapper,#prpShtTxtBxWrapper,#prpShtImgWrapper").addClass('notSearchable').hide();
        $("#prpShtWidgetRefresherTr").removeClass('notSearchable').show();
        if ($("#phpShtWidgetRefresher").is(":checked")) {
            $("#prpShtWidgetRefresheTimerTr").removeClass('notSearchable').show();
        }
    } else if (type.indexOf("Custom__") !== -1) {
        if (calledFrom == "addInitialDataToJson") {
            $("#prpShtTargetType").material_select('destroy');
            $("#prpShtTargetType").val("none");
            $("#prpShtTargetType").material_select();
            $("#prpShtTargetWrapper").addClass('notSearchable').hide();
        }
        if (isPageBuilder && type !== "Custom__sql") {
            $("#prpShtDepTr,#prpShtDepMappingTr").addClass('notSearchable').hide();
        }

        $("#prpShtCustomTargetWrapper,#prpShtTxtBxWrapper,#prpShtImgWrapper").addClass('notSearchable').hide();
        $("#prpShtTarget").prop('disabled', false);
        switch (type) {
            case "Custom__img":
                $("#bdTxtClrTr").addClass('notSearchable').hide();
                $("#prpShtImgWrapper,#prpShtImgRespTr").removeClass('notSearchable').show();
                break;
            case "Custom__html":
                $("#prpShtTargetTypeWrapper,#prpShtCustomTargetWrapper").addClass('notSearchable').hide();
                $("#prpShtTxtBxWrapper").removeClass('notSearchable').show();
                $("#prpShtTxtBxWrapper td:first").text("HTML");
                $("#prpShtTxtBx").data('key', 'html');
                break;
            case "Custom__txt":
                $("#prpShtTxtBxWrapper").removeClass('notSearchable').show();
                $("#prpShtTxtBxWrapper td:first").text("Text");
                $("#prpShtTxtBx").data('key', 'txt');
                break;
            case "Custom__sql":
                $("#prpShtTxtBxWrapper,#prpShtPropsTr,#prpShtColPropsTr,#prpShtWidgetRefresherTr").removeClass('notSearchable').show();
                $("#prpShtTxtBxWrapper td:first").text("Sql");
                $("#prpShtTxtBx").data('key', 'sql');
                break;
            case "Custom__mytsk":
                $("#prpShtHeadingSrc,#prpShtTargetTypeWrapper").addClass('notSearchable').hide();
                break;
            case "Custom__rss":
                $("#prpShtTargetTypeWrapper").addClass('notSearchable').hide();
                $("#prpShtTargetWrapper,#prpShtRssFeedTime").removeClass('notSearchable').show();
                $("#prpShtTarget").on('blur.rssFeed', function(event) {
                    event.preventDefault();
                    var targetElem = $("#propertySheet").data('target');
                    homeJsonObj.updateDataInJson(targetElem, "tg", $(this).val());
                    ajaxCallObj.fireRssFeed($(this).val(), targetElem);
                });
                break;
            default:
                // statements_def
                break;
        }
    } else if (type === "page") {
        $("#prpShtComponent").text('Page');
        $("#prpShtTitle").val($("#HPBtabsHaeder .pageTab a.active .tabTitle").text());
        $("#prpShtHeadingSrc,#propTableContent tr[data-group='src'],#propTableContent tr[data-group='appr']:not(#prpShtWidgetGroupsTr),#prpShtDepTr,#prpShtDepMappingTr").addClass('notSearchable').hide();
        $("#prpShtPageTemplateTr,#prpShtAuthrzatn,tr[data-group='auth']").removeClass('notSearchable').show();
        if (isPageBuilder) {
            $("#prpShtRepTr").addClass('notSearchable').hide();
        }
        if (isPrivate) {
            $("#prpShtRepTr").addClass('notSearchable').hide();
        }
    }
    var propShtWidth = 280;
    if (type === "page") {
        const clickedTab = $("#HPBtabsHaeder a[data-tid=" + elemId + "]");
        const clickedTabWidth = clickedTab.outerWidth();
        const clickedTabLeftPosition = parseInt(clickedTab.offset().left || "10");
        var topToAdd = "0px";
        var leftToAdd = clickedTabLeftPosition;
        var bottomToAdd = "inherit";
        if (clickedTabLeftPosition + clickedTabWidth + propShtWidth > $(window).width()) {
            leftToAdd = clickedTabLeftPosition - propShtWidth;
        } else {
            leftToAdd = clickedTabLeftPosition + clickedTabWidth;
        }
        elemId = "__pageProps__" + elemId;
    } else {
        //positioning the propertySheet
        var offsetPos = $("#" + elemId).offset();
        var propShtHeight = parseInt($(window).height() * 0.7);
        var elemWidth = parseInt($("#" + elemId).css('width'));
        var elemHeight = parseInt($("#" + elemId).css('width'));
        var leftToAdd, topToAdd;
        var bottomToAdd = "inherit";
        var scrollTop = $("#hpbDsgnrcnvsWrapper").scrollTop()
        if ((offsetPos.left + elemWidth + propShtWidth) > $(window).width()) {
            leftToAdd = offsetPos.left - propShtWidth;
        } else {
            leftToAdd = offsetPos.left + elemWidth;
        }
        if (leftToAdd < 0) {
            leftToAdd = elemWidth - 40;
        }
        if ((offsetPos.top + propShtHeight) > $(window).height()) {
            topToAdd = "inherit"; //(offsetPos.top - propShtHeight) + elemHeight;
            bottomToAdd = "0px";
        } else {
            topToAdd = offsetPos.top + 'px';
        }
    }

    $("#propertySheet").css({
        top: topToAdd,
        left: leftToAdd + "px",
        bottom: bottomToAdd
    }).data('target', elemId).removeClass('hide');

    setTimeout(function() {
        $("#propertySheet").removeClass('scale-out').addClass('scale-in');
    }, 50)
    $("#propertySheet").find('select,input').off('focus.propSheetFocus');
    $("#propertySheet").find('select,input').on('focus.propSheetFocus', function(event) {
        builderActiveElement = "propSheet";
        if ($(this).attr('id') != "prpShtIcon" && $("#iconWrapperData").length !== 0) {
            toggleIcons("destroy");
        }
    });

    $(document).off('keyup.esCapeDeleteCard');
    $(document).on('keyup.esCapeDeleteCard', function(e) {
        if (e.keyCode === 46) {
            if (builderActiveElement == "card") {
                createConfirmBox("deleteWidget", parent.lcm[9], "homeJsonObj~removeTheNode~" + elemId + "");
                return false;
            }
        }

    });

    if (type === "page") {
        if (!isPageBuilder) {
            $('#prpShtRolesWrappperTd .dropdown-content>li').off('click.pageResp').on('click.pageResp', function(e) {
                var elem = $(this);
                var existedIdx = alreadyUsedResp.indexOf(elem.text());
                if (elem.find('input').is(":checked")) {
                    //means earlier its not checked so need to add responsibility from alreadyUsedResp
                    if (existedIdx === -1) {
                        alreadyUsedResp.push(elem.text());
                    }
                } else {
                    //means earlier its checked so need to remove responsibility from alreadyUsedResp
                    if (existedIdx !== -1) {
                        alreadyUsedResp.splice(existedIdx, 1);
                    }
                }
            });
        }

        $("#prpShtTmpFropDwn li").off('click.templateSelc').on('click.templateSelc', function(event) {
            const elem = $(this);
            if (!elem.hasClass('selected')) {
                $("#prpShtTmpFropDwn li.selected").removeClass('selected');
                const tmpId = elem.find('a').data('tmpid');
                const templateObj = templateInfo[tmpId];
                elem.addClass('selected');
                $("#prpShtTmpFropDwn").prev().html(elem.find('a span').text() + '<span class="caret right">▼</span>');
                homeJsonObj.updateDataInJson($(this).parents("#propertySheet").data("target"), "tmp", tmpId);
                if(templateInfo[tmpId].name.toLowerCase() === "basic"){
                   $("#prpShtWidgetGroupsTr").removeClass("notSearchable").show();
                }
                else{
                    $("#prpShtWidgetGroupsTr").addClass("notSearchable").hide();
                }
                changeToNewTemplate({ templateObj,afterTemplateChange });
            }

        });
            }
    }

function afterTemplateChange() {
    $("#sortable [data-highcharts-chart]").each(function(index, el) {
        const presChart = $(this);
        const chartIndex = presChart.data("highchartsChart");
        const presWidgetHeight = presChart.outerHeight();
        agileChartsObj.resizeTheChart({index:chartIndex,height:presWidgetHeight});
    });
}

$(document).on('click', '#propertySheet', function(event) {
    $(document).off('keyup.esCapeDeleteCard');
});

function ChangePropertySheet(task) {
    if (task == "kpiWidgetAdded" || task == "kpiWidgetClicked") {
        if (task == "kpiWidgetAdded") {
            $("#prpShtTargetRgn").prop('checked', false).change();
        }
        $("#bdBgClrTr,#bdTxtClrTr").addClass('notSearchable').hide();
        $("#gradientPickerWrapper,#prpShtTitlePickerTr").removeClass('notSearchable').addClass('kpiWidgetIcon').show();
    }
}


function clearPropertySheet() {
    //clear all the values
    $("#prpShtTitlePickerTr").removeClass('kpiWidgetIcon')
    $("#prpShtTargetType").material_select('destroy');
    $("#prpShtTargetType").val("none");
    $("#prpShtTargetType").material_select();
    $("#propertySearchFld").val("").keyup();
    $("#prpShtTarget").off('blur.rssFeed')
    $('.customFldError').removeClass('customFldError');
    $("#prpShtComponent,#prpShtModifiedBy,#prpShtModifiedOn").text("");
    $("#prpShtTarget,#prpShtTxtBx,#prpShtRoles,#prpShtImgWrapper .file-path").val("");
    $("#sortable .ui-state-default.selectedForPropSht").removeClass('selectedForPropSht');
    $("#HPBtabsHaeder a.selectedForPropSht").removeClass('selectedForPropSht');
    $("#prpShtTxtBxWrapper td:first").text(parent.lcm[211]);
    $('input#prpShtTarget').removeAttr('onkeyup').autocomplete("destroy");
    $("#prpShtTxtBx").data('key', 'dc');
    $("#propertySheet .notSearchable").removeClass('notSearchable').show();
    $("#gradientPicker").attr('class', 'colorMe blue center-align');
    $("#gradientPicker a").data('color', 'blue').text("Blue");
    $("#phpShtWidgetRefresher").prop('checked', false);
    $("#parameterMappingBtn").text('...').attr('onclick', 'createDependencyPopup()');
}

function toggleIcons(task) {
    if (task == "destroy") {
        $("#iconWrapper").html("");
        return;
    }
    if (iconsHtml != "") {
        $("#iconWrapper").html(iconsHtml);
        var top = ($("#prpShtIcon").offset().top - ($("#propertySheet").offset().top - 25)) + "px";
        $("#iconWrapper #iconWrapperData").css("top", top);
    } else {
        var top = ($("#prpShtIcon").offset().top - ($("#propertySheet").offset().top - 25)) + "px";
        iconsHtml += '<div style="top:' + top + ';" id="iconWrapperData" class="closeOutsideClick">';
        iconsHtml += '<span class="icon-home"></span>';
        iconsHtml += '<span class="icon-home2"></span>';
        iconsHtml += '<span class="icon-home3"></span>';
        iconsHtml += '<span class="icon-home4"></span>';
        iconsHtml += '<span class="icon-home5"></span>';
        iconsHtml += '<span class="icon-home6"></span>';
        iconsHtml += '<span class="icon-bathtub"></span>';
        iconsHtml += '<span class="icon-toothbrush"></span>';
        iconsHtml += '<span class="icon-bed"></span>';
        iconsHtml += '<span class="icon-couch"></span>';
        iconsHtml += '<span class="icon-chair"></span>';
        iconsHtml += '<span class="icon-city"></span>';
        iconsHtml += '<span class="icon-apartment"></span>';
        iconsHtml += '<span class="icon-pencil"></span>';
        iconsHtml += '<span class="icon-pencil2"></span>';
        iconsHtml += '<span class="icon-pen"></span>';
        iconsHtml += '<span class="icon-pencil3"></span>';
        iconsHtml += '<span class="icon-eraser"></span>';
        iconsHtml += '<span class="icon-pencil4"></span>';
        iconsHtml += '<span class="icon-pencil5"></span>';
        iconsHtml += '<span class="icon-feather"></span>';
        iconsHtml += '<span class="icon-feather2"></span>';
        iconsHtml += '<span class="icon-feather3"></span>';
        iconsHtml += '<span class="icon-pen2"></span>';
        iconsHtml += '<span class="icon-pen-add"></span>';
        iconsHtml += '<span class="icon-pen-remove"></span>';
        iconsHtml += '<span class="icon-vector"></span>';
        iconsHtml += '<span class="icon-pen3"></span>';
        iconsHtml += '<span class="icon-blog"></span>';
        iconsHtml += '<span class="icon-brush"></span>';
        iconsHtml += '<span class="icon-brush2"></span>';
        iconsHtml += '<span class="icon-spray"></span>';
        iconsHtml += '<span class="icon-paint-roller"></span>';
        iconsHtml += '<span class="icon-stamp"></span>';
        iconsHtml += '<span class="icon-tape"></span>';
        iconsHtml += '<span class="icon-desk-tape"></span>';
        iconsHtml += '<span class="icon-texture"></span>';
        iconsHtml += '<span class="icon-eye-dropper"></span>';
        iconsHtml += '<span class="icon-palette"></span>';
        iconsHtml += '<span class="icon-color-sampler"></span>';
        iconsHtml += '<span class="icon-bucket"></span>';
        iconsHtml += '<span class="icon-gradient"></span>';
        iconsHtml += '<span class="icon-gradient2"></span>';
        iconsHtml += '<span class="icon-magic-wand"></span>';
        iconsHtml += '<span class="icon-magnet"></span>';
        iconsHtml += '<span class="icon-pencil-ruler"></span>';
        iconsHtml += '<span class="icon-pencil-ruler2"></span>';
        iconsHtml += '<span class="icon-compass"></span>';
        iconsHtml += '<span class="icon-aim"></span>';
        iconsHtml += '<span class="icon-gun"></span>';
        iconsHtml += '<span class="icon-bottle"></span>';
        iconsHtml += '<span class="icon-drop"></span>';
        iconsHtml += '<span class="icon-drop-crossed"></span>';
        iconsHtml += '<span class="icon-drop2"></span>';
        iconsHtml += '<span class="icon-snow"></span>';
        iconsHtml += '<span class="icon-snow2"></span>';
        iconsHtml += '<span class="icon-fire"></span>';
        iconsHtml += '<span class="icon-lighter"></span>';
        iconsHtml += '<span class="icon-knife"></span>';
        iconsHtml += '<span class="icon-dagger"></span>';
        iconsHtml += '<span class="icon-tissue"></span>';
        iconsHtml += '<span class="icon-toilet-paper"></span>';
        iconsHtml += '<span class="icon-poop"></span>';
        iconsHtml += '<span class="icon-umbrella"></span>';
        iconsHtml += '<span class="icon-umbrella2"></span>';
        iconsHtml += '<span class="icon-rain"></span>';
        iconsHtml += '<span class="icon-tornado"></span>';
        iconsHtml += '<span class="icon-wind"></span>';
        iconsHtml += '<span class="icon-fan"></span>';
        iconsHtml += '<span class="icon-contrast"></span>';
        iconsHtml += '<span class="icon-sun-small"></span>';
        iconsHtml += '<span class="icon-sun"></span>';
        iconsHtml += '<span class="icon-sun2"></span>';
        iconsHtml += '<span class="icon-moon"></span>';
        iconsHtml += '<span class="icon-cloud"></span>';
        iconsHtml += '<span class="icon-cloud-upload"></span>';
        iconsHtml += '<span class="icon-cloud-download"></span>';
        iconsHtml += '<span class="icon-cloud-rain"></span>';
        iconsHtml += '<span class="icon-cloud-hailstones"></span>';
        iconsHtml += '<span class="icon-cloud-snow"></span>';
        iconsHtml += '<span class="icon-cloud-windy"></span>';
        iconsHtml += '<span class="icon-sun-wind"></span>';
        iconsHtml += '<span class="icon-cloud-fog"></span>';
        iconsHtml += '<span class="icon-cloud-sun"></span>';
        iconsHtml += '<span class="icon-cloud-lightning"></span>';
        iconsHtml += '<span class="icon-cloud-sync"></span>';
        iconsHtml += '<span class="icon-cloud-lock"></span>';
        iconsHtml += '<span class="icon-cloud-gear"></span>';
        iconsHtml += '<span class="icon-cloud-alert"></span>';
        iconsHtml += '<span class="icon-cloud-check"></span>';
        iconsHtml += '<span class="icon-cloud-cross"></span>';
        iconsHtml += '<span class="icon-cloud-crossed"></span>';
        iconsHtml += '<span class="icon-cloud-database"></span>';
        iconsHtml += '<span class="icon-database"></span>';
        iconsHtml += '<span class="icon-database-add"></span>';
        iconsHtml += '<span class="icon-database-remove"></span>';
        iconsHtml += '<span class="icon-database-lock"></span>';
        iconsHtml += '<span class="icon-database-refresh"></span>';
        iconsHtml += '<span class="icon-database-check"></span>';
        iconsHtml += '<span class="icon-database-history"></span>';
        iconsHtml += '<span class="icon-database-upload"></span>';
        iconsHtml += '<span class="icon-database-download"></span>';
        iconsHtml += '<span class="icon-server"></span>';
        iconsHtml += '<span class="icon-shield"></span>';
        iconsHtml += '<span class="icon-shield-check"></span>';
        iconsHtml += '<span class="icon-shield-alert"></span>';
        iconsHtml += '<span class="icon-shield-cross"></span>';
        iconsHtml += '<span class="icon-lock"></span>';
        iconsHtml += '<span class="icon-rotation-lock"></span>';
        iconsHtml += '<span class="icon-unlock"></span>';
        iconsHtml += '<span class="icon-key"></span>';
        iconsHtml += '<span class="icon-key-hole"></span>';
        iconsHtml += '<span class="icon-toggle-off"></span>';
        iconsHtml += '<span class="icon-toggle-on"></span>';
        iconsHtml += '<span class="icon-cog"></span>';
        iconsHtml += '<span class="icon-cog2"></span>';
        iconsHtml += '<span class="icon-wrench"></span>';
        iconsHtml += '<span class="icon-screwdriver"></span>';
        iconsHtml += '<span class="icon-hammer-wrench"></span>';
        iconsHtml += '<span class="icon-hammer"></span>';
        iconsHtml += '<span class="icon-saw"></span>';
        iconsHtml += '<span class="icon-axe"></span>';
        iconsHtml += '<span class="icon-axe2"></span>';
        iconsHtml += '<span class="icon-shovel"></span>';
        iconsHtml += '<span class="icon-pickaxe"></span>';
        iconsHtml += '<span class="icon-factory"></span>';
        iconsHtml += '<span class="icon-factory2"></span>';
        iconsHtml += '<span class="icon-recycle"></span>';
        iconsHtml += '<span class="icon-trash"></span>';
        iconsHtml += '<span class="icon-trash2"></span>';
        iconsHtml += '<span class="icon-trash3"></span>';
        iconsHtml += '<span class="icon-broom"></span>';
        iconsHtml += '<span class="icon-game"></span>';
        iconsHtml += '<span class="icon-gamepad"></span>';
        iconsHtml += '<span class="icon-joystick"></span>';
        iconsHtml += '<span class="icon-dice"></span>';
        iconsHtml += '<span class="icon-spades"></span>';
        iconsHtml += '<span class="icon-diamonds"></span>';
        iconsHtml += '<span class="icon-clubs"></span>';
        iconsHtml += '<span class="icon-hearts"></span>';
        iconsHtml += '<span class="icon-heart"></span>';
        iconsHtml += '<span class="icon-star"></span>';
        iconsHtml += '<span class="icon-star-half"></span>';
        iconsHtml += '<span class="icon-star-empty"></span>';
        iconsHtml += '<span class="icon-flag"></span>';
        iconsHtml += '<span class="icon-flag2"></span>';
        iconsHtml += '<span class="icon-flag3"></span>';
        iconsHtml += '<span class="icon-mailbox-full"></span>';
        iconsHtml += '<span class="icon-mailbox-empty"></span>';
        iconsHtml += '<span class="icon-at-sign"></span>';
        iconsHtml += '<span class="icon-envelope"></span>';
        iconsHtml += '<span class="icon-envelope-open"></span>';
        iconsHtml += '<span class="icon-paperclip"></span>';
        iconsHtml += '<span class="icon-paper-plane"></span>';
        iconsHtml += '<span class="icon-reply"></span>';
        iconsHtml += '<span class="icon-reply-all"></span>';
        iconsHtml += '<span class="icon-inbox"></span>';
        iconsHtml += '<span class="icon-inbox2"></span>';
        iconsHtml += '<span class="icon-outbox"></span>';
        iconsHtml += '<span class="icon-box"></span>';
        iconsHtml += '<span class="icon-archive"></span>';
        iconsHtml += '<span class="icon-archive2"></span>';
        iconsHtml += '<span class="icon-drawers"></span>';
        iconsHtml += '<span class="icon-drawers2"></span>';
        iconsHtml += '<span class="icon-drawers3"></span>';
        iconsHtml += '<span class="icon-eye"></span>';
        iconsHtml += '<span class="icon-eye-crossed"></span>';
        iconsHtml += '<span class="icon-eye-plus"></span>';
        iconsHtml += '<span class="icon-eye-minus"></span>';
        iconsHtml += '<span class="icon-binoculars"></span>';
        iconsHtml += '<span class="icon-binoculars2"></span>';
        iconsHtml += '<span class="icon-hdd"></span>';
        iconsHtml += '<span class="icon-hdd-down"></span>';
        iconsHtml += '<span class="icon-hdd-up"></span>';
        iconsHtml += '<span class="icon-floppy-disk"></span>';
        iconsHtml += '<span class="icon-disc"></span>';
        iconsHtml += '<span class="icon-tape2"></span>';
        iconsHtml += '<span class="icon-printer"></span>';
        iconsHtml += '<span class="icon-shredder"></span>';
        iconsHtml += '<span class="icon-file-empty"></span>';
        iconsHtml += '<span class="icon-file-add"></span>';
        iconsHtml += '<span class="icon-file-check"></span>';
        iconsHtml += '<span class="icon-file-lock"></span>';
        iconsHtml += '<span class="icon-files"></span>';
        iconsHtml += '<span class="icon-copy"></span>';
        iconsHtml += '<span class="icon-compare"></span>';
        iconsHtml += '<span class="icon-folder"></span>';
        iconsHtml += '<span class="icon-folder-search"></span>';
        iconsHtml += '<span class="icon-folder-plus"></span>';
        iconsHtml += '<span class="icon-folder-minus"></span>';
        iconsHtml += '<span class="icon-folder-download"></span>';
        iconsHtml += '<span class="icon-folder-upload"></span>';
        iconsHtml += '<span class="icon-folder-star"></span>';
        iconsHtml += '<span class="icon-folder-heart"></span>';
        iconsHtml += '<span class="icon-folder-user"></span>';
        iconsHtml += '<span class="icon-folder-shared"></span>';
        iconsHtml += '<span class="icon-folder-music"></span>';
        iconsHtml += '<span class="icon-folder-picture"></span>';
        iconsHtml += '<span class="icon-folder-film"></span>';
        iconsHtml += '<span class="icon-scissors"></span>';
        iconsHtml += '<span class="icon-paste"></span>';
        iconsHtml += '<span class="icon-clipboard-empty"></span>';
        iconsHtml += '<span class="icon-clipboard-pencil"></span>';
        iconsHtml += '<span class="icon-clipboard-text"></span>';
        iconsHtml += '<span class="icon-clipboard-check"></span>';
        iconsHtml += '<span class="icon-clipboard-down"></span>';
        iconsHtml += '<span class="icon-clipboard-left"></span>';
        iconsHtml += '<span class="icon-clipboard-alert"></span>';
        iconsHtml += '<span class="icon-clipboard-user"></span>';
        iconsHtml += '<span class="icon-register"></span>';
        iconsHtml += '<span class="icon-enter"></span>';
        iconsHtml += '<span class="icon-exit"></span>';
        iconsHtml += '<span class="icon-papers"></span>';
        iconsHtml += '<span class="icon-news"></span>';
        iconsHtml += '<span class="icon-reading"></span>';
        iconsHtml += '<span class="icon-typewriter"></span>';
        iconsHtml += '<span class="icon-document"></span>';
        iconsHtml += '<span class="icon-document2"></span>';
        iconsHtml += '<span class="icon-graduation-hat"></span>';
        iconsHtml += '<span class="icon-license"></span>';
        iconsHtml += '<span class="icon-license2"></span>';
        iconsHtml += '<span class="icon-medal-empty"></span>';
        iconsHtml += '<span class="icon-medal-first"></span>';
        iconsHtml += '<span class="icon-medal-second"></span>';
        iconsHtml += '<span class="icon-medal-third"></span>';
        iconsHtml += '<span class="icon-podium"></span>';
        iconsHtml += '<span class="icon-trophy"></span>';
        iconsHtml += '<span class="icon-trophy2"></span>';
        iconsHtml += '<span class="icon-music-note"></span>';
        iconsHtml += '<span class="icon-music-note2"></span>';
        iconsHtml += '<span class="icon-music-note3"></span>';
        iconsHtml += '<span class="icon-playlist"></span>';
        iconsHtml += '<span class="icon-playlist-add"></span>';
        iconsHtml += '<span class="icon-guitar"></span>';
        iconsHtml += '<span class="icon-trumpet"></span>';
        iconsHtml += '<span class="icon-album"></span>';
        iconsHtml += '<span class="icon-shuffle"></span>';
        iconsHtml += '<span class="icon-repeat-one"></span>';
        iconsHtml += '<span class="icon-repeat"></span>';
        iconsHtml += '<span class="icon-headphones"></span>';
        iconsHtml += '<span class="icon-headset"></span>';
        iconsHtml += '<span class="icon-loudspeaker"></span>';
        iconsHtml += '<span class="icon-equalizer"></span>';
        iconsHtml += '<span class="icon-theater"></span>';
        iconsHtml += '<span class="icon-3d-glasses"></span>';
        iconsHtml += '<span class="icon-ticket"></span>';
        iconsHtml += '<span class="icon-presentation"></span>';
        iconsHtml += '<span class="icon-play"></span>';
        iconsHtml += '<span class="icon-film-play"></span>';
        iconsHtml += '<span class="icon-clapboard-play"></span>';
        iconsHtml += '<span class="icon-media"></span>';
        iconsHtml += '<span class="icon-film"></span>';
        iconsHtml += '<span class="icon-film2"></span>';
        iconsHtml += '<span class="icon-surveillance"></span>';
        iconsHtml += '<span class="icon-surveillance2"></span>';
        iconsHtml += '<span class="icon-camera"></span>';
        iconsHtml += '<span class="icon-camera-crossed"></span>';
        iconsHtml += '<span class="icon-camera-play"></span>';
        iconsHtml += '<span class="icon-time-lapse"></span>';
        iconsHtml += '<span class="icon-record"></span>';
        iconsHtml += '<span class="icon-camera2"></span>';
        iconsHtml += '<span class="icon-camera-flip"></span>';
        iconsHtml += '<span class="icon-panorama"></span>';
        iconsHtml += '<span class="icon-time-lapse2"></span>';
        iconsHtml += '<span class="icon-shutter"></span>';
        iconsHtml += '<span class="icon-shutter2"></span>';
        iconsHtml += '<span class="icon-face-detection"></span>';
        iconsHtml += '<span class="icon-flare"></span>';
        iconsHtml += '<span class="icon-convex"></span>';
        iconsHtml += '<span class="icon-concave"></span>';
        iconsHtml += '<span class="icon-picture"></span>';
        iconsHtml += '<span class="icon-picture2"></span>';
        iconsHtml += '<span class="icon-picture3"></span>';
        iconsHtml += '<span class="icon-pictures"></span>';
        iconsHtml += '<span class="icon-book"></span>';
        iconsHtml += '<span class="icon-audio-book"></span>';
        iconsHtml += '<span class="icon-book2"></span>';
        iconsHtml += '<span class="icon-bookmark"></span>';
        iconsHtml += '<span class="icon-bookmark2"></span>';
        iconsHtml += '<span class="icon-label"></span>';
        iconsHtml += '<span class="icon-library"></span>';
        iconsHtml += '<span class="icon-library2"></span>';
        iconsHtml += '<span class="icon-contacts"></span>';
        iconsHtml += '<span class="icon-profile"></span>';
        iconsHtml += '<span class="icon-portrait"></span>';
        iconsHtml += '<span class="icon-portrait2"></span>';
        iconsHtml += '<span class="icon-user"></span>';
        iconsHtml += '<span class="icon-user-plus"></span>';
        iconsHtml += '<span class="icon-user-minus"></span>';
        iconsHtml += '<span class="icon-user-lock"></span>';
        iconsHtml += '<span class="icon-users"></span>';
        iconsHtml += '<span class="icon-users2"></span>';
        iconsHtml += '<span class="icon-users-plus"></span>';
        iconsHtml += '<span class="icon-users-minus"></span>';
        iconsHtml += '<span class="icon-group-work"></span>';
        iconsHtml += '<span class="icon-woman"></span>';
        iconsHtml += '<span class="icon-man"></span>';
        iconsHtml += '<span class="icon-baby"></span>';
        iconsHtml += '<span class="icon-baby2"></span>';
        iconsHtml += '<span class="icon-baby3"></span>';
        iconsHtml += '<span class="icon-baby-bottle"></span>';
        iconsHtml += '<span class="icon-walk"></span>';
        iconsHtml += '<span class="icon-hand-waving"></span>';
        iconsHtml += '<span class="icon-jump"></span>';
        iconsHtml += '<span class="icon-run"></span>';
        iconsHtml += '<span class="icon-woman2"></span>';
        iconsHtml += '<span class="icon-man2"></span>';
        iconsHtml += '<span class="icon-man-woman"></span>';
        iconsHtml += '<span class="icon-height"></span>';
        iconsHtml += '<span class="icon-weight"></span>';
        iconsHtml += '<span class="icon-scale"></span>';
        iconsHtml += '<span class="icon-button"></span>';
        iconsHtml += '<span class="icon-bow-tie"></span>';
        iconsHtml += '<span class="icon-tie"></span>';
        iconsHtml += '<span class="icon-socks"></span>';
        iconsHtml += '<span class="icon-shoe"></span>';
        iconsHtml += '<span class="icon-shoes"></span>';
        iconsHtml += '<span class="icon-hat"></span>';
        iconsHtml += '<span class="icon-pants"></span>';
        iconsHtml += '<span class="icon-shorts"></span>';
        iconsHtml += '<span class="icon-flip-flops"></span>';
        iconsHtml += '<span class="icon-shirt"></span>';
        iconsHtml += '<span class="icon-hanger"></span>';
        iconsHtml += '<span class="icon-laundry"></span>';
        iconsHtml += '<span class="icon-store"></span>';
        iconsHtml += '<span class="icon-haircut"></span>';
        iconsHtml += '<span class="icon-store-24"></span>';
        iconsHtml += '<span class="icon-barcode"></span>';
        iconsHtml += '<span class="icon-barcode2"></span>';
        iconsHtml += '<span class="icon-barcode3"></span>';
        iconsHtml += '<span class="icon-cashier"></span>';
        iconsHtml += '<span class="icon-bag"></span>';
        iconsHtml += '<span class="icon-bag2"></span>';
        iconsHtml += '<span class="icon-cart"></span>';
        iconsHtml += '<span class="icon-cart-empty"></span>';
        iconsHtml += '<span class="icon-cart-full"></span>';
        iconsHtml += '<span class="icon-cart-plus"></span>';
        iconsHtml += '<span class="icon-cart-plus2"></span>';
        iconsHtml += '<span class="icon-cart-add"></span>';
        iconsHtml += '<span class="icon-cart-remove"></span>';
        iconsHtml += '<span class="icon-cart-exchange"></span>';
        iconsHtml += '<span class="icon-tag"></span>';
        iconsHtml += '<span class="icon-tags"></span>';
        iconsHtml += '<span class="icon-receipt"></span>';
        iconsHtml += '<span class="icon-wallet"></span>';
        iconsHtml += '<span class="icon-credit-card"></span>';
        iconsHtml += '<span class="icon-cash-dollar"></span>';
        iconsHtml += '<span class="icon-cash-euro"></span>';
        iconsHtml += '<span class="icon-cash-pound"></span>';
        iconsHtml += '<span class="icon-cash-yen"></span>';
        iconsHtml += '<span class="icon-bag-dollar"></span>';
        iconsHtml += '<span class="icon-bag-euro"></span>';
        iconsHtml += '<span class="icon-bag-pound"></span>';
        iconsHtml += '<span class="icon-bag-yen"></span>';
        iconsHtml += '<span class="icon-coin-dollar"></span>';
        iconsHtml += '<span class="icon-coin-euro"></span>';
        iconsHtml += '<span class="icon-coin-pound"></span>';
        iconsHtml += '<span class="icon-coin-yen"></span>';
        iconsHtml += '<span class="icon-calculator"></span>';
        iconsHtml += '<span class="icon-calculator2"></span>';
        iconsHtml += '<span class="icon-abacus"></span>';
        iconsHtml += '<span class="icon-vault"></span>';
        iconsHtml += '<span class="icon-telephone"></span>';
        iconsHtml += '<span class="icon-phone-lock"></span>';
        iconsHtml += '<span class="icon-phone-wave"></span>';
        iconsHtml += '<span class="icon-phone-pause"></span>';
        iconsHtml += '<span class="icon-phone-outgoing"></span>';
        iconsHtml += '<span class="icon-phone-incoming"></span>';
        iconsHtml += '<span class="icon-phone-in-out"></span>';
        iconsHtml += '<span class="icon-phone-error"></span>';
        iconsHtml += '<span class="icon-phone-sip"></span>';
        iconsHtml += '<span class="icon-phone-plus"></span>';
        iconsHtml += '<span class="icon-phone-minus"></span>';
        iconsHtml += '<span class="icon-voicemail"></span>';
        iconsHtml += '<span class="icon-dial"></span>';
        iconsHtml += '<span class="icon-telephone2"></span>';
        iconsHtml += '<span class="icon-pushpin"></span>';
        iconsHtml += '<span class="icon-pushpin2"></span>';
        iconsHtml += '<span class="icon-map-marker"></span>';
        iconsHtml += '<span class="icon-map-marker-user"></span>';
        iconsHtml += '<span class="icon-map-marker-down"></span>';
        iconsHtml += '<span class="icon-map-marker-check"></span>';
        iconsHtml += '<span class="icon-map-marker-crossed"></span>';
        iconsHtml += '<span class="icon-radar"></span>';
        iconsHtml += '<span class="icon-compass2"></span>';
        iconsHtml += '<span class="icon-map"></span>';
        iconsHtml += '<span class="icon-map2"></span>';
        iconsHtml += '<span class="icon-location"></span>';
        iconsHtml += '<span class="icon-road-sign"></span>';
        iconsHtml += '<span class="icon-calendar-empty"></span>';
        iconsHtml += '<span class="icon-calendar-check"></span>';
        iconsHtml += '<span class="icon-calendar-cross"></span>';
        iconsHtml += '<span class="icon-calendar-31"></span>';
        iconsHtml += '<span class="icon-calendar-full"></span>';
        iconsHtml += '<span class="icon-calendar-insert"></span>';
        iconsHtml += '<span class="icon-calendar-text"></span>';
        iconsHtml += '<span class="icon-calendar-user"></span>';
        iconsHtml += '<span class="icon-mouse"></span>';
        iconsHtml += '<span class="icon-mouse-left"></span>';
        iconsHtml += '<span class="icon-mouse-right"></span>';
        iconsHtml += '<span class="icon-mouse-both"></span>';
        iconsHtml += '<span class="icon-keyboard"></span>';
        iconsHtml += '<span class="icon-keyboard-up"></span>';
        iconsHtml += '<span class="icon-keyboard-down"></span>';
        iconsHtml += '<span class="icon-delete"></span>';
        iconsHtml += '<span class="icon-spell-check"></span>';
        iconsHtml += '<span class="icon-escape"></span>';
        iconsHtml += '<span class="icon-enter2"></span>';
        iconsHtml += '<span class="icon-screen"></span>';
        iconsHtml += '<span class="icon-aspect-ratio"></span>';
        iconsHtml += '<span class="icon-signal"></span>';
        iconsHtml += '<span class="icon-signal-lock"></span>';
        iconsHtml += '<span class="icon-signal-80"></span>';
        iconsHtml += '<span class="icon-signal-60"></span>';
        iconsHtml += '<span class="icon-signal-40"></span>';
        iconsHtml += '<span class="icon-signal-20"></span>';
        iconsHtml += '<span class="icon-signal-0"></span>';
        iconsHtml += '<span class="icon-signal-blocked"></span>';
        iconsHtml += '<span class="icon-sim"></span>';
        iconsHtml += '<span class="icon-flash-memory"></span>';
        iconsHtml += '<span class="icon-usb-drive"></span>';
        iconsHtml += '<span class="icon-phone"></span>';
        iconsHtml += '<span class="icon-smartphone"></span>';
        iconsHtml += '<span class="icon-smartphone-notification"></span>';
        iconsHtml += '<span class="icon-smartphone-vibration"></span>';
        iconsHtml += '<span class="icon-smartphone-embed"></span>';
        iconsHtml += '<span class="icon-smartphone-waves"></span>';
        iconsHtml += '<span class="icon-tablet"></span>';
        iconsHtml += '<span class="icon-tablet2"></span>';
        iconsHtml += '<span class="icon-laptop"></span>';
        iconsHtml += '<span class="icon-laptop-phone"></span>';
        iconsHtml += '<span class="icon-desktop"></span>';
        iconsHtml += '<span class="icon-launch"></span>';
        iconsHtml += '<span class="icon-new-tab"></span>';
        iconsHtml += '<span class="icon-window"></span>';
        iconsHtml += '<span class="icon-cable"></span>';
        iconsHtml += '<span class="icon-cable2"></span>';
        iconsHtml += '<span class="icon-tv"></span>';
        iconsHtml += '<span class="icon-radio"></span>';
        iconsHtml += '<span class="icon-remote-control"></span>';
        iconsHtml += '<span class="icon-power-switch"></span>';
        iconsHtml += '<span class="icon-power"></span>';
        iconsHtml += '<span class="icon-power-crossed"></span>';
        iconsHtml += '<span class="icon-flash-auto"></span>';
        iconsHtml += '<span class="icon-lamp"></span>';
        iconsHtml += '<span class="icon-flashlight"></span>';
        iconsHtml += '<span class="icon-lampshade"></span>';
        iconsHtml += '<span class="icon-cord"></span>';
        iconsHtml += '<span class="icon-outlet"></span>';
        iconsHtml += '<span class="icon-battery-power"></span>';
        iconsHtml += '<span class="icon-battery-empty"></span>';
        iconsHtml += '<span class="icon-battery-alert"></span>';
        iconsHtml += '<span class="icon-battery-error"></span>';
        iconsHtml += '<span class="icon-battery-low1"></span>';
        iconsHtml += '<span class="icon-battery-low2"></span>';
        iconsHtml += '<span class="icon-battery-low3"></span>';
        iconsHtml += '<span class="icon-battery-mid1"></span>';
        iconsHtml += '<span class="icon-battery-mid2"></span>';
        iconsHtml += '<span class="icon-battery-mid3"></span>';
        iconsHtml += '<span class="icon-battery-full"></span>';
        iconsHtml += '<span class="icon-battery-charging"></span>';
        iconsHtml += '<span class="icon-battery-charging2"></span>';
        iconsHtml += '<span class="icon-battery-charging3"></span>';
        iconsHtml += '<span class="icon-battery-charging4"></span>';
        iconsHtml += '<span class="icon-battery-charging5"></span>';
        iconsHtml += '<span class="icon-battery-charging6"></span>';
        iconsHtml += '<span class="icon-battery-charging7"></span>';
        iconsHtml += '<span class="icon-chip"></span>';
        iconsHtml += '<span class="icon-chip-x64"></span>';
        iconsHtml += '<span class="icon-chip-x86"></span>';
        iconsHtml += '<span class="icon-bubble"></span>';
        iconsHtml += '<span class="icon-bubbles"></span>';
        iconsHtml += '<span class="icon-bubble-dots"></span>';
        iconsHtml += '<span class="icon-bubble-alert"></span>';
        iconsHtml += '<span class="icon-bubble-question"></span>';
        iconsHtml += '<span class="icon-bubble-text"></span>';
        iconsHtml += '<span class="icon-bubble-pencil"></span>';
        iconsHtml += '<span class="icon-bubble-picture"></span>';
        iconsHtml += '<span class="icon-bubble-video"></span>';
        iconsHtml += '<span class="icon-bubble-user"></span>';
        iconsHtml += '<span class="icon-bubble-quote"></span>';
        iconsHtml += '<span class="icon-bubble-heart"></span>';
        iconsHtml += '<span class="icon-bubble-emoticon"></span>';
        iconsHtml += '<span class="icon-bubble-attachment"></span>';
        iconsHtml += '<span class="icon-phone-bubble"></span>';
        iconsHtml += '<span class="icon-quote-open"></span>';
        iconsHtml += '<span class="icon-quote-close"></span>';
        iconsHtml += '<span class="icon-dna"></span>';
        iconsHtml += '<span class="icon-heart-pulse"></span>';
        iconsHtml += '<span class="icon-pulse"></span>';
        iconsHtml += '<span class="icon-syringe"></span>';
        iconsHtml += '<span class="icon-pills"></span>';
        iconsHtml += '<span class="icon-first-aid"></span>';
        iconsHtml += '<span class="icon-lifebuoy"></span>';
        iconsHtml += '<span class="icon-bandage"></span>';
        iconsHtml += '<span class="icon-bandages"></span>';
        iconsHtml += '<span class="icon-thermometer"></span>';
        iconsHtml += '<span class="icon-microscope"></span>';
        iconsHtml += '<span class="icon-brain"></span>';
        iconsHtml += '<span class="icon-beaker"></span>';
        iconsHtml += '<span class="icon-skull"></span>';
        iconsHtml += '<span class="icon-bone"></span>';
        iconsHtml += '<span class="icon-construction"></span>';
        iconsHtml += '<span class="icon-construction-cone"></span>';
        iconsHtml += '<span class="icon-pie-chart"></span>';
        iconsHtml += '<span class="icon-pie-chart2"></span>';
        iconsHtml += '<span class="icon-graph"></span>';
        iconsHtml += '<span class="icon-chart-growth"></span>';
        iconsHtml += '<span class="icon-chart-bars"></span>';
        iconsHtml += '<span class="icon-chart-settings"></span>';
        iconsHtml += '<span class="icon-cake"></span>';
        iconsHtml += '<span class="icon-gift"></span>';
        iconsHtml += '<span class="icon-balloon"></span>';
        iconsHtml += '<span class="icon-rank"></span>';
        iconsHtml += '<span class="icon-rank2"></span>';
        iconsHtml += '<span class="icon-rank3"></span>';
        iconsHtml += '<span class="icon-crown"></span>';
        iconsHtml += '<span class="icon-lotus"></span>';
        iconsHtml += '<span class="icon-diamond"></span>';
        iconsHtml += '<span class="icon-diamond2"></span>';
        iconsHtml += '<span class="icon-diamond3"></span>';
        iconsHtml += '<span class="icon-diamond4"></span>';
        iconsHtml += '<span class="icon-linearicons"></span>';
        iconsHtml += '<span class="icon-teacup"></span>';
        iconsHtml += '<span class="icon-teapot"></span>';
        iconsHtml += '<span class="icon-glass"></span>';
        iconsHtml += '<span class="icon-bottle2"></span>';
        iconsHtml += '<span class="icon-glass-cocktail"></span>';
        iconsHtml += '<span class="icon-glass2"></span>';
        iconsHtml += '<span class="icon-dinner"></span>';
        iconsHtml += '<span class="icon-dinner2"></span>';
        iconsHtml += '<span class="icon-chef"></span>';
        iconsHtml += '<span class="icon-scale2"></span>';
        iconsHtml += '<span class="icon-egg"></span>';
        iconsHtml += '<span class="icon-egg2"></span>';
        iconsHtml += '<span class="icon-eggs"></span>';
        iconsHtml += '<span class="icon-platter"></span>';
        iconsHtml += '<span class="icon-steak"></span>';
        iconsHtml += '<span class="icon-hamburger"></span>';
        iconsHtml += '<span class="icon-hotdog"></span>';
        iconsHtml += '<span class="icon-pizza"></span>';
        iconsHtml += '<span class="icon-sausage"></span>';
        iconsHtml += '<span class="icon-chicken"></span>';
        iconsHtml += '<span class="icon-fish"></span>';
        iconsHtml += '<span class="icon-carrot"></span>';
        iconsHtml += '<span class="icon-cheese"></span>';
        iconsHtml += '<span class="icon-bread"></span>';
        iconsHtml += '<span class="icon-ice-cream"></span>';
        iconsHtml += '<span class="icon-ice-cream2"></span>';
        iconsHtml += '<span class="icon-candy"></span>';
        iconsHtml += '<span class="icon-lollipop"></span>';
        iconsHtml += '<span class="icon-coffee-bean"></span>';
        iconsHtml += '<span class="icon-coffee-cup"></span>';
        iconsHtml += '<span class="icon-cherry"></span>';
        iconsHtml += '<span class="icon-grapes"></span>';
        iconsHtml += '<span class="icon-citrus"></span>';
        iconsHtml += '<span class="icon-apple"></span>';
        iconsHtml += '<span class="icon-leaf"></span>';
        iconsHtml += '<span class="icon-landscape"></span>';
        iconsHtml += '<span class="icon-pine-tree"></span>';
        iconsHtml += '<span class="icon-tree"></span>';
        iconsHtml += '<span class="icon-cactus"></span>';
        iconsHtml += '<span class="icon-paw"></span>';
        iconsHtml += '<span class="icon-footprint"></span>';
        iconsHtml += '<span class="icon-speed-slow"></span>';
        iconsHtml += '<span class="icon-speed-medium"></span>';
        iconsHtml += '<span class="icon-speed-fast"></span>';
        iconsHtml += '<span class="icon-rocket"></span>';
        iconsHtml += '<span class="icon-hammer2"></span>';
        iconsHtml += '<span class="icon-balance"></span>';
        iconsHtml += '<span class="icon-briefcase"></span>';
        iconsHtml += '<span class="icon-luggage-weight"></span>';
        iconsHtml += '<span class="icon-dolly"></span>';
        iconsHtml += '<span class="icon-plane"></span>';
        iconsHtml += '<span class="icon-plane-crossed"></span>';
        iconsHtml += '<span class="icon-helicopter"></span>';
        iconsHtml += '<span class="icon-traffic-lights"></span>';
        iconsHtml += '<span class="icon-siren"></span>';
        iconsHtml += '<span class="icon-road"></span>';
        iconsHtml += '<span class="icon-engine"></span>';
        iconsHtml += '<span class="icon-oil-pressure"></span>';
        iconsHtml += '<span class="icon-coolant-temperature"></span>';
        iconsHtml += '<span class="icon-car-battery"></span>';
        iconsHtml += '<span class="icon-gas"></span>';
        iconsHtml += '<span class="icon-gallon"></span>';
        iconsHtml += '<span class="icon-transmission"></span>';
        iconsHtml += '<span class="icon-car"></span>';
        iconsHtml += '<span class="icon-car-wash"></span>';
        iconsHtml += '<span class="icon-car-wash2"></span>';
        iconsHtml += '<span class="icon-bus"></span>';
        iconsHtml += '<span class="icon-bus2"></span>';
        iconsHtml += '<span class="icon-car2"></span>';
        iconsHtml += '<span class="icon-parking"></span>';
        iconsHtml += '<span class="icon-car-lock"></span>';
        iconsHtml += '<span class="icon-taxi"></span>';
        iconsHtml += '<span class="icon-car-siren"></span>';
        iconsHtml += '<span class="icon-car-wash3"></span>';
        iconsHtml += '<span class="icon-car-wash4"></span>';
        iconsHtml += '<span class="icon-ambulance"></span>';
        iconsHtml += '<span class="icon-truck"></span>';
        iconsHtml += '<span class="icon-trailer"></span>';
        iconsHtml += '<span class="icon-scale-truck"></span>';
        iconsHtml += '<span class="icon-train"></span>';
        iconsHtml += '<span class="icon-ship"></span>';
        iconsHtml += '<span class="icon-ship2"></span>';
        iconsHtml += '<span class="icon-anchor"></span>';
        iconsHtml += '<span class="icon-boat"></span>';
        iconsHtml += '<span class="icon-bicycle"></span>';
        iconsHtml += '<span class="icon-bicycle2"></span>';
        iconsHtml += '<span class="icon-dumbbell"></span>';
        iconsHtml += '<span class="icon-bench-press"></span>';
        iconsHtml += '<span class="icon-swim"></span>';
        iconsHtml += '<span class="icon-football"></span>';
        iconsHtml += '<span class="icon-baseball-bat"></span>';
        iconsHtml += '<span class="icon-baseball"></span>';
        iconsHtml += '<span class="icon-tennis"></span>';
        iconsHtml += '<span class="icon-tennis2"></span>';
        iconsHtml += '<span class="icon-ping-pong"></span>';
        iconsHtml += '<span class="icon-hockey"></span>';
        iconsHtml += '<span class="icon-8ball"></span>';
        iconsHtml += '<span class="icon-bowling"></span>';
        iconsHtml += '<span class="icon-bowling-pins"></span>';
        iconsHtml += '<span class="icon-golf"></span>';
        iconsHtml += '<span class="icon-golf2"></span>';
        iconsHtml += '<span class="icon-archery"></span>';
        iconsHtml += '<span class="icon-slingshot"></span>';
        iconsHtml += '<span class="icon-soccer"></span>';
        iconsHtml += '<span class="icon-basketball"></span>';
        iconsHtml += '<span class="icon-cube"></span>';
        iconsHtml += '<span class="icon-3d-rotate"></span>';
        iconsHtml += '<span class="icon-puzzle"></span>';
        iconsHtml += '<span class="icon-glasses"></span>';
        iconsHtml += '<span class="icon-glasses2"></span>';
        iconsHtml += '<span class="icon-accessibility"></span>';
        iconsHtml += '<span class="icon-wheelchair"></span>';
        iconsHtml += '<span class="icon-wall"></span>';
        iconsHtml += '<span class="icon-fence"></span>';
        iconsHtml += '<span class="icon-wall2"></span>';
        iconsHtml += '<span class="icon-icons"></span>';
        iconsHtml += '<span class="icon-resize-handle"></span>';
        iconsHtml += '<span class="icon-icons2"></span>';
        iconsHtml += '<span class="icon-select"></span>';
        iconsHtml += '<span class="icon-select2"></span>';
        iconsHtml += '<span class="icon-site-map"></span>';
        iconsHtml += '<span class="icon-earth"></span>';
        iconsHtml += '<span class="icon-earth-lock"></span>';
        iconsHtml += '<span class="icon-network"></span>';
        iconsHtml += '<span class="icon-network-lock"></span>';
        iconsHtml += '<span class="icon-planet"></span>';
        iconsHtml += '<span class="icon-happy"></span>';
        iconsHtml += '<span class="icon-smile"></span>';
        iconsHtml += '<span class="icon-grin"></span>';
        iconsHtml += '<span class="icon-tongue"></span>';
        iconsHtml += '<span class="icon-sad"></span>';
        iconsHtml += '<span class="icon-wink"></span>';
        iconsHtml += '<span class="icon-dream"></span>';
        iconsHtml += '<span class="icon-shocked"></span>';
        iconsHtml += '<span class="icon-shocked2"></span>';
        iconsHtml += '<span class="icon-tongue2"></span>';
        iconsHtml += '<span class="icon-neutral"></span>';
        iconsHtml += '<span class="icon-happy-grin"></span>';
        iconsHtml += '<span class="icon-cool"></span>';
        iconsHtml += '<span class="icon-mad"></span>';
        iconsHtml += '<span class="icon-grin-evil"></span>';
        iconsHtml += '<span class="icon-evil"></span>';
        iconsHtml += '<span class="icon-wow"></span>';
        iconsHtml += '<span class="icon-annoyed"></span>';
        iconsHtml += '<span class="icon-wondering"></span>';
        iconsHtml += '<span class="icon-confused"></span>';
        iconsHtml += '<span class="icon-zipped"></span>';
        iconsHtml += '<span class="icon-grumpy"></span>';
        iconsHtml += '<span class="icon-mustache"></span>';
        iconsHtml += '<span class="icon-tombstone-hipster"></span>';
        iconsHtml += '<span class="icon-tombstone"></span>';
        iconsHtml += '<span class="icon-ghost"></span>';
        iconsHtml += '<span class="icon-ghost-hipster"></span>';
        iconsHtml += '<span class="icon-halloween"></span>';
        iconsHtml += '<span class="icon-christmas"></span>';
        iconsHtml += '<span class="icon-easter-egg"></span>';
        iconsHtml += '<span class="icon-mustache2"></span>';
        iconsHtml += '<span class="icon-mustache-glasses"></span>';
        iconsHtml += '<span class="icon-pipe"></span>';
        iconsHtml += '<span class="icon-alarm"></span>';
        iconsHtml += '<span class="icon-alarm-add"></span>';
        iconsHtml += '<span class="icon-alarm-snooze"></span>';
        iconsHtml += '<span class="icon-alarm-ringing"></span>';
        iconsHtml += '<span class="icon-bullhorn"></span>';
        iconsHtml += '<span class="icon-hearing"></span>';
        iconsHtml += '<span class="icon-volume-high"></span>';
        iconsHtml += '<span class="icon-volume-medium"></span>';
        iconsHtml += '<span class="icon-volume-low"></span>';
        iconsHtml += '<span class="icon-volume"></span>';
        iconsHtml += '<span class="icon-mute"></span>';
        iconsHtml += '<span class="icon-lan"></span>';
        iconsHtml += '<span class="icon-lan2"></span>';
        iconsHtml += '<span class="icon-wifi"></span>';
        iconsHtml += '<span class="icon-wifi-lock"></span>';
        iconsHtml += '<span class="icon-wifi-blocked"></span>';
        iconsHtml += '<span class="icon-wifi-mid"></span>';
        iconsHtml += '<span class="icon-wifi-low"></span>';
        iconsHtml += '<span class="icon-wifi-low2"></span>';
        iconsHtml += '<span class="icon-wifi-alert"></span>';
        iconsHtml += '<span class="icon-wifi-alert-mid"></span>';
        iconsHtml += '<span class="icon-wifi-alert-low"></span>';
        iconsHtml += '<span class="icon-wifi-alert-low2"></span>';
        iconsHtml += '<span class="icon-stream"></span>';
        iconsHtml += '<span class="icon-stream-check"></span>';
        iconsHtml += '<span class="icon-stream-error"></span>';
        iconsHtml += '<span class="icon-stream-alert"></span>';
        iconsHtml += '<span class="icon-communication"></span>';
        iconsHtml += '<span class="icon-communication-crossed"></span>';
        iconsHtml += '<span class="icon-broadcast"></span>';
        iconsHtml += '<span class="icon-antenna"></span>';
        iconsHtml += '<span class="icon-satellite"></span>';
        iconsHtml += '<span class="icon-satellite2"></span>';
        iconsHtml += '<span class="icon-mic"></span>';
        iconsHtml += '<span class="icon-mic-mute"></span>';
        iconsHtml += '<span class="icon-mic2"></span>';
        iconsHtml += '<span class="icon-spotlights"></span>';
        iconsHtml += '<span class="icon-hourglass"></span>';
        iconsHtml += '<span class="icon-loading"></span>';
        iconsHtml += '<span class="icon-loading2"></span>';
        iconsHtml += '<span class="icon-loading3"></span>';
        iconsHtml += '<span class="icon-refresh"></span>';
        iconsHtml += '<span class="icon-refresh2"></span>';
        iconsHtml += '<span class="icon-undo"></span>';
        iconsHtml += '<span class="icon-redo"></span>';
        iconsHtml += '<span class="icon-jump2"></span>';
        iconsHtml += '<span class="icon-undo2"></span>';
        iconsHtml += '<span class="icon-redo2"></span>';
        iconsHtml += '<span class="icon-sync"></span>';
        iconsHtml += '<span class="icon-repeat-one2"></span>';
        iconsHtml += '<span class="icon-sync-crossed"></span>';
        iconsHtml += '<span class="icon-sync2"></span>';
        iconsHtml += '<span class="icon-repeat-one3"></span>';
        iconsHtml += '<span class="icon-sync-crossed2"></span>';
        iconsHtml += '<span class="icon-return"></span>';
        iconsHtml += '<span class="icon-return2"></span>';
        iconsHtml += '<span class="icon-refund"></span>';
        iconsHtml += '<span class="icon-history"></span>';
        iconsHtml += '<span class="icon-history2"></span>';
        iconsHtml += '<span class="icon-self-timer"></span>';
        iconsHtml += '<span class="icon-clock"></span>';
        iconsHtml += '<span class="icon-clock2"></span>';
        iconsHtml += '<span class="icon-clock3"></span>';
        iconsHtml += '<span class="icon-watch"></span>';
        iconsHtml += '<span class="icon-alarm2"></span>';
        iconsHtml += '<span class="icon-alarm-add2"></span>';
        iconsHtml += '<span class="icon-alarm-remove"></span>';
        iconsHtml += '<span class="icon-alarm-check"></span>';
        iconsHtml += '<span class="icon-alarm-error"></span>';
        iconsHtml += '<span class="icon-timer"></span>';
        iconsHtml += '<span class="icon-timer-crossed"></span>';
        iconsHtml += '<span class="icon-timer2"></span>';
        iconsHtml += '<span class="icon-timer-crossed2"></span>';
        iconsHtml += '<span class="icon-download"></span>';
        iconsHtml += '<span class="icon-upload"></span>';
        iconsHtml += '<span class="icon-download2"></span>';
        iconsHtml += '<span class="icon-upload2"></span>';
        iconsHtml += '<span class="icon-enter-up"></span>';
        iconsHtml += '<span class="icon-enter-down"></span>';
        iconsHtml += '<span class="icon-enter-left"></span>';
        iconsHtml += '<span class="icon-enter-right"></span>';
        iconsHtml += '<span class="icon-exit-up"></span>';
        iconsHtml += '<span class="icon-exit-down"></span>';
        iconsHtml += '<span class="icon-exit-left"></span>';
        iconsHtml += '<span class="icon-exit-right"></span>';
        iconsHtml += '<span class="icon-enter-up2"></span>';
        iconsHtml += '<span class="icon-enter-down2"></span>';
        iconsHtml += '<span class="icon-enter-vertical"></span>';
        iconsHtml += '<span class="icon-enter-left2"></span>';
        iconsHtml += '<span class="icon-enter-right2"></span>';
        iconsHtml += '<span class="icon-enter-horizontal"></span>';
        iconsHtml += '<span class="icon-exit-up2"></span>';
        iconsHtml += '<span class="icon-exit-down2"></span>';
        iconsHtml += '<span class="icon-exit-left2"></span>';
        iconsHtml += '<span class="icon-exit-right2"></span>';
        iconsHtml += '<span class="icon-cli"></span>';
        iconsHtml += '<span class="icon-bug"></span>';
        iconsHtml += '<span class="icon-code"></span>';
        iconsHtml += '<span class="icon-file-code"></span>';
        iconsHtml += '<span class="icon-file-image"></span>';
        iconsHtml += '<span class="icon-file-zip"></span>';
        iconsHtml += '<span class="icon-file-audio"></span>';
        iconsHtml += '<span class="icon-file-video"></span>';
        iconsHtml += '<span class="icon-file-preview"></span>';
        iconsHtml += '<span class="icon-file-charts"></span>';
        iconsHtml += '<span class="icon-file-stats"></span>';
        iconsHtml += '<span class="icon-file-spreadsheet"></span>';
        iconsHtml += '<span class="icon-link"></span>';
        iconsHtml += '<span class="icon-unlink"></span>';
        iconsHtml += '<span class="icon-link2"></span>';
        iconsHtml += '<span class="icon-unlink2"></span>';
        iconsHtml += '<span class="icon-thumbs-up"></span>';
        iconsHtml += '<span class="icon-thumbs-down"></span>';
        iconsHtml += '<span class="icon-thumbs-up2"></span>';
        iconsHtml += '<span class="icon-thumbs-down2"></span>';
        iconsHtml += '<span class="icon-thumbs-up3"></span>';
        iconsHtml += '<span class="icon-thumbs-down3"></span>';
        iconsHtml += '<span class="icon-share"></span>';
        iconsHtml += '<span class="icon-share2"></span>';
        iconsHtml += '<span class="icon-share3"></span>';
        iconsHtml += '<span class="icon-magnifier"></span>';
        iconsHtml += '<span class="icon-file-search"></span>';
        iconsHtml += '<span class="icon-find-replace"></span>';
        iconsHtml += '<span class="icon-zoom-in"></span>';
        iconsHtml += '<span class="icon-zoom-out"></span>';
        iconsHtml += '<span class="icon-loupe"></span>';
        iconsHtml += '<span class="icon-loupe-zoom-in"></span>';
        iconsHtml += '<span class="icon-loupe-zoom-out"></span>';
        iconsHtml += '<span class="icon-cross"></span>';
        iconsHtml += '<span class="icon-menu"></span>';
        iconsHtml += '<span class="icon-list"></span>';
        iconsHtml += '<span class="icon-list2"></span>';
        iconsHtml += '<span class="icon-list3"></span>';
        iconsHtml += '<span class="icon-menu2"></span>';
        iconsHtml += '<span class="icon-list4"></span>';
        iconsHtml += '<span class="icon-menu3"></span>';
        iconsHtml += '<span class="icon-exclamation"></span>';
        iconsHtml += '<span class="icon-question"></span>';
        iconsHtml += '<span class="icon-check"></span>';
        iconsHtml += '<span class="icon-cross2"></span>';
        iconsHtml += '<span class="icon-plus"></span>';
        iconsHtml += '<span class="icon-minus"></span>';
        iconsHtml += '<span class="icon-percent"></span>';
        iconsHtml += '<span class="icon-chevron-up"></span>';
        iconsHtml += '<span class="icon-chevron-down"></span>';
        iconsHtml += '<span class="icon-chevron-left"></span>';
        iconsHtml += '<span class="icon-chevron-right"></span>';
        iconsHtml += '<span class="icon-chevrons-expand-vertical"></span>';
        iconsHtml += '<span class="icon-chevrons-expand-horizontal"></span>';
        iconsHtml += '<span class="icon-chevrons-contract-vertical"></span>';
        iconsHtml += '<span class="icon-chevrons-contract-horizontal"></span>';
        iconsHtml += '<span class="icon-arrow-up"></span>';
        iconsHtml += '<span class="icon-arrow-down"></span>';
        iconsHtml += '<span class="icon-arrow-left"></span>';
        iconsHtml += '<span class="icon-arrow-right"></span>';
        iconsHtml += '<span class="icon-arrow-up-right"></span>';
        iconsHtml += '<span class="icon-arrows-merge"></span>';
        iconsHtml += '<span class="icon-arrows-split"></span>';
        iconsHtml += '<span class="icon-arrow-divert"></span>';
        iconsHtml += '<span class="icon-arrow-return"></span>';
        iconsHtml += '<span class="icon-expand"></span>';
        iconsHtml += '<span class="icon-contract"></span>';
        iconsHtml += '<span class="icon-expand2"></span>';
        iconsHtml += '<span class="icon-contract2"></span>';
        iconsHtml += '<span class="icon-move"></span>';
        iconsHtml += '<span class="icon-tab"></span>';
        iconsHtml += '<span class="icon-arrow-wave"></span>';
        iconsHtml += '<span class="icon-expand3"></span>';
        iconsHtml += '<span class="icon-expand4"></span>';
        iconsHtml += '<span class="icon-contract3"></span>';
        iconsHtml += '<span class="icon-notification"></span>';
        iconsHtml += '<span class="icon-warning"></span>';
        iconsHtml += '<span class="icon-notification-circle"></span>';
        iconsHtml += '<span class="icon-question-circle"></span>';
        iconsHtml += '<span class="icon-menu-circle"></span>';
        iconsHtml += '<span class="icon-checkmark-circle"></span>';
        iconsHtml += '<span class="icon-cross-circle"></span>';
        iconsHtml += '<span class="icon-plus-circle"></span>';
        iconsHtml += '<span class="icon-circle-minus"></span>';
        iconsHtml += '<span class="icon-percent-circle"></span>';
        iconsHtml += '<span class="icon-arrow-up-circle"></span>';
        iconsHtml += '<span class="icon-arrow-down-circle"></span>';
        iconsHtml += '<span class="icon-arrow-left-circle"></span>';
        iconsHtml += '<span class="icon-arrow-right-circle"></span>';
        iconsHtml += '<span class="icon-chevron-up-circle"></span>';
        iconsHtml += '<span class="icon-chevron-down-circle"></span>';
        iconsHtml += '<span class="icon-chevron-left-circle"></span>';
        iconsHtml += '<span class="icon-chevron-right-circle"></span>';
        iconsHtml += '<span class="icon-backward-circle"></span>';
        iconsHtml += '<span class="icon-first-circle"></span>';
        iconsHtml += '<span class="icon-previous-circle"></span>';
        iconsHtml += '<span class="icon-stop-circle"></span>';
        iconsHtml += '<span class="icon-play-circle"></span>';
        iconsHtml += '<span class="icon-pause-circle"></span>';
        iconsHtml += '<span class="icon-next-circle"></span>';
        iconsHtml += '<span class="icon-last-circle"></span>';
        iconsHtml += '<span class="icon-forward-circle"></span>';
        iconsHtml += '<span class="icon-eject-circle"></span>';
        iconsHtml += '<span class="icon-crop"></span>';
        iconsHtml += '<span class="icon-frame-expand"></span>';
        iconsHtml += '<span class="icon-frame-contract"></span>';
        iconsHtml += '<span class="icon-focus"></span>';
        iconsHtml += '<span class="icon-transform"></span>';
        iconsHtml += '<span class="icon-grid"></span>';
        iconsHtml += '<span class="icon-grid-crossed"></span>';
        iconsHtml += '<span class="icon-layers"></span>';
        iconsHtml += '<span class="icon-layers-crossed"></span>';
        iconsHtml += '<span class="icon-toggle"></span>';
        iconsHtml += '<span class="icon-rulers"></span>';
        iconsHtml += '<span class="icon-ruler"></span>';
        iconsHtml += '<span class="icon-funnel"></span>';
        iconsHtml += '<span class="icon-flip-horizontal"></span>';
        iconsHtml += '<span class="icon-flip-vertical"></span>';
        iconsHtml += '<span class="icon-flip-horizontal2"></span>';
        iconsHtml += '<span class="icon-flip-vertical2"></span>';
        iconsHtml += '<span class="icon-angle"></span>';
        iconsHtml += '<span class="icon-angle2"></span>';
        iconsHtml += '<span class="icon-subtract"></span>';
        iconsHtml += '<span class="icon-combine"></span>';
        iconsHtml += '<span class="icon-intersect"></span>';
        iconsHtml += '<span class="icon-exclude"></span>';
        iconsHtml += '<span class="icon-align-center-vertical"></span>';
        iconsHtml += '<span class="icon-align-right"></span>';
        iconsHtml += '<span class="icon-align-bottom"></span>';
        iconsHtml += '<span class="icon-align-left"></span>';
        iconsHtml += '<span class="icon-align-center-horizontal"></span>';
        iconsHtml += '<span class="icon-align-top"></span>';
        iconsHtml += '<span class="icon-square"></span>';
        iconsHtml += '<span class="icon-plus-square"></span>';
        iconsHtml += '<span class="icon-minus-square"></span>';
        iconsHtml += '<span class="icon-percent-square"></span>';
        iconsHtml += '<span class="icon-arrow-up-square"></span>';
        iconsHtml += '<span class="icon-arrow-down-square"></span>';
        iconsHtml += '<span class="icon-arrow-left-square"></span>';
        iconsHtml += '<span class="icon-arrow-right-square"></span>';
        iconsHtml += '<span class="icon-chevron-up-square"></span>';
        iconsHtml += '<span class="icon-chevron-down-square"></span>';
        iconsHtml += '<span class="icon-chevron-left-square"></span>';
        iconsHtml += '<span class="icon-chevron-right-square"></span>';
        iconsHtml += '<span class="icon-check-square"></span>';
        iconsHtml += '<span class="icon-cross-square"></span>';
        iconsHtml += '<span class="icon-menu-square"></span>';
        iconsHtml += '<span class="icon-prohibited"></span>';
        iconsHtml += '<span class="icon-circle"></span>';
        iconsHtml += '<span class="icon-radio-button"></span>';
        iconsHtml += '<span class="icon-ligature"></span>';
        iconsHtml += '<span class="icon-text-format"></span>';
        iconsHtml += '<span class="icon-text-format-remove"></span>';
        iconsHtml += '<span class="icon-text-size"></span>';
        iconsHtml += '<span class="icon-bold"></span>';
        iconsHtml += '<span class="icon-italic"></span>';
        iconsHtml += '<span class="icon-underline"></span>';
        iconsHtml += '<span class="icon-strikethrough"></span>';
        iconsHtml += '<span class="icon-highlight"></span>';
        iconsHtml += '<span class="icon-text-align-left"></span>';
        iconsHtml += '<span class="icon-text-align-center"></span>';
        iconsHtml += '<span class="icon-text-align-right"></span>';
        iconsHtml += '<span class="icon-text-align-justify"></span>';
        iconsHtml += '<span class="icon-line-spacing"></span>';
        iconsHtml += '<span class="icon-indent-increase"></span>';
        iconsHtml += '<span class="icon-indent-decrease"></span>';
        iconsHtml += '<span class="icon-text-wrap"></span>';
        iconsHtml += '<span class="icon-pilcrow"></span>';
        iconsHtml += '<span class="icon-direction-ltr"></span>';
        iconsHtml += '<span class="icon-direction-rtl"></span>';
        iconsHtml += '<span class="icon-page-break"></span>';
        iconsHtml += '<span class="icon-page-break2"></span>';
        iconsHtml += '<span class="icon-sort-alpha-asc"></span>';
        iconsHtml += '<span class="icon-sort-alpha-desc"></span>';
        iconsHtml += '<span class="icon-sort-numeric-asc"></span>';
        iconsHtml += '<span class="icon-sort-numeric-desc"></span>';
        iconsHtml += '<span class="icon-sort-amount-asc"></span>';
        iconsHtml += '<span class="icon-sort-amount-desc"></span>';
        iconsHtml += '<span class="icon-sort-time-asc"></span>';
        iconsHtml += '<span class="icon-sort-time-desc"></span>';
        iconsHtml += '<span class="icon-sigma"></span>';
        iconsHtml += '<span class="icon-pencil-line"></span>';
        iconsHtml += '<span class="icon-hand"></span>';
        iconsHtml += '<span class="icon-pointer-up"></span>';
        iconsHtml += '<span class="icon-pointer-right"></span>';
        iconsHtml += '<span class="icon-pointer-down"></span>';
        iconsHtml += '<span class="icon-pointer-left"></span>';
        iconsHtml += '<span class="icon-finger-tap"></span>';
        iconsHtml += '<span class="icon-fingers-tap"></span>';
        iconsHtml += '<span class="icon-reminder"></span>';
        iconsHtml += '<span class="icon-fingers-crossed"></span>';
        iconsHtml += '<span class="icon-fingers-victory"></span>';
        iconsHtml += '<span class="icon-gesture-zoom"></span>';
        iconsHtml += '<span class="icon-gesture-pinch"></span>';
        iconsHtml += '<span class="icon-fingers-scroll-horizontal"></span>';
        iconsHtml += '<span class="icon-fingers-scroll-vertical"></span>';
        iconsHtml += '<span class="icon-fingers-scroll-left"></span>';
        iconsHtml += '<span class="icon-fingers-scroll-right"></span>';
        iconsHtml += '<span class="icon-hand2"></span>';
        iconsHtml += '<span class="icon-pointer-up2"></span>';
        iconsHtml += '<span class="icon-pointer-right2"></span>';
        iconsHtml += '<span class="icon-pointer-down2"></span>';
        iconsHtml += '<span class="icon-pointer-left2"></span>';
        iconsHtml += '<span class="icon-finger-tap2"></span>';
        iconsHtml += '<span class="icon-fingers-tap2"></span>';
        iconsHtml += '<span class="icon-reminder2"></span>';
        iconsHtml += '<span class="icon-gesture-zoom2"></span>';
        iconsHtml += '<span class="icon-gesture-pinch2"></span>';
        iconsHtml += '<span class="icon-fingers-scroll-horizontal2"></span>';
        iconsHtml += '<span class="icon-fingers-scroll-vertical2"></span>';
        iconsHtml += '<span class="icon-fingers-scroll-left2"></span>';
        iconsHtml += '<span class="icon-fingers-scroll-right2"></span>';
        iconsHtml += '<span class="icon-fingers-scroll-vertical3"></span>';
        iconsHtml += '<span class="icon-border-style"></span>';
        iconsHtml += '<span class="icon-border-all"></span>';
        iconsHtml += '<span class="icon-border-outer"></span>';
        iconsHtml += '<span class="icon-border-inner"></span>';
        iconsHtml += '<span class="icon-border-top"></span>';
        iconsHtml += '<span class="icon-border-horizontal"></span>';
        iconsHtml += '<span class="icon-border-bottom"></span>';
        iconsHtml += '<span class="icon-border-left"></span>';
        iconsHtml += '<span class="icon-border-vertical"></span>';
        iconsHtml += '<span class="icon-border-right"></span>';
        iconsHtml += '<span class="icon-border-none"></span>';
        iconsHtml += '<span class="icon-ellipsis"></span>';
        iconsHtml += '</div>';
        $("#iconWrapper").html(iconsHtml);
    }
    $('div#iconWrapperData span[class^="icon-"]').click(function(event) {
        var elem = $(this);
        var className = elem.attr("class");
        className = className.replace(" active", "");
        $("#prpShtIcon").val(className);
        $("#iconSelectorSpn").attr('class', className);
        var targetElemId = elem.parents("#propertySheet").data('target');
        $("#" + targetElemId).find('.cardTitleWrapper i:first').attr('class', className);
        if ($("#prpShtTitlePickerTr").hasClass('kpiWidgetIcon')) {
            $("#" + targetElemId).find('.kpiImage').attr('class', className + ' kpiImage');
        }
        homeJsonObj.updateDataInJson(targetElemId, "ic", className);
        toggleIcons("destroy");
    });
    var selectedClass = $("#iconSelectorSpn").attr('class');
    if (selectedClass != "")
        $('div#iconWrapperData span[class="' + selectedClass + '"]').addClass('active')
}

function createCustomTxtBx(elem) {
    elem = $(elem);
    var elemOfset = elem.offset();
    var elemVal = elem.val();
    var encodedVal = htmlEntity("encode", elemVal);
    $("#customTxtAreaWrapper").css({
        top: elemOfset.top + "px",
        left: elemOfset.left + "px"
    });
    $("#customTxtAreaWrapperBg").show();
    if ($("#customTxtAreaWrapperBg").length != 0) {
        jQuery(document).bind("keydown.customTxtKD", function(event) {
            if (!event.shiftKey && event.keyCode == 9) {
                if ($("#customTxtAreaWrapperBg :focusable").last()[0] == $(document.activeElement)[0]) {
                    event.preventDefault();
                    $("#customTxtAreaWrapperBg :focusable").first()[0].focus();
                }
            } else if (event.shiftKey && event.keyCode == 9) {
                if ($("#customTxtAreaWrapperBg :focusable").first()[0] == $(document.activeElement)[0]) {
                    event.preventDefault();
                    $("#customTxtAreaWrapperBg :focusable").last()[0].focus();
                }
            }
        });
    }
    setTimeout(function() {
        $("#customTxtAreaFooter button.save").attr('onclick', 'closeCustomTxtBx("' + elem.attr("id") + '","save")');
        $("#customTxtAreaFooter button.cancel").attr('onclick', 'closeCustomTxtBx("' + elem.attr("id") + '","cancel","' + encodedVal + '")');
        $("#customTxtAreaWrapper textarea").removeAttr('tabindex').val(elemVal).focus();
        $("#customTxtAreaWrapper").addClass('centerMe');
        $("#customTxtAreaFooter").slideDown();
    }, 50)

    $(document).on('keyup.closeCustomTxtBx', function(event) {
        var txtFldval = $("#customTxtAreaWrapper textarea").val();
        var targetParId = elem.parents("#propertySheet").data('target');
        var keyWord = elem.data('key');
        $("#customTxtAreaWrapper textarea").addClass('valChanged');
        if (event.keyCode == 27) {
            event.preventDefault();
            if (confirmBox && confirmBox.isOpen()) {
                confirmBox.close();
                confirmBox = "";
            } else
                closeCustomTxtBx(elem.attr("id"), "cancel", encodedVal);
        } else if (keyWord == 'dc' || keyWord == "txt") {
            $("#" + targetParId + " .card-content p").text(txtFldval);
            elem.val(txtFldval);
        }
    });

}

function closeCustomTxtBx(elem, task, oldVal) {
    if (task == "cancel") {
        if ($("#customTxtAreaWrapper textarea").hasClass('valChanged')) {
            $("#customTxtAreaWrapper textarea").removeClass('valChanged');
            var isRtl = ax_direction === "rtl";
            // rtl: true,
            confirmBox = $.confirm({
                theme: 'modern',
                title: localLangFile["discard"],
                onContentReady: function() {
                    //disableBackDrop('bind');
                },
                rtl: isRtl,
                escapeKey: 'buttonB',
                content: parent.lcm[121],
                columnClass: 'col s6 offset-s3',
                buttons: {
                    buttonA: {
                        text: localLangFile["discard"],
                        btnClass: 'btn btn-primary',
                        action: function() {
                            closeCustomTxtBx(elem, "PermnantCancel", oldVal);
                        }
                    },
                    buttonB: {
                        text: localLangFile["cancel"],
                        btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                        action: function() {
                            //disableBackDrop('destroy');
                            confirmBox = "";
                        }
                    },
                }
            });

            return;
        } else {
            task = "PermnantCancel";
        }
    }
    jQuery(document).unbind("keydown.customTxtKD");
    elem = $("#" + elem);
    $(document).off('keyup.closeCustomTxtBx');
    $("#customTxtAreaWrapperBg").hide();
    var txtFldval = $("#customTxtAreaWrapper textarea").attr('tabindex', '-1').val();
    $("#customTxtAreaWrapper").removeClass('centerMe').removeAttr('style');
    var targetParId = elem.parents("#propertySheet").data('target');
    if (task != "PermnantCancel") {
        confirmBox = "";
        var keyWord = elem.data('key');
        elem.val(txtFldval);
        if (keyWord == 'dc' || keyWord == "txt")
            $("#" + targetParId + " .card-content p").text(txtFldval);
        else if (keyWord == 'html') {
            txtFldval = txtFldval.replace(/<[ \t]*\bstyle[^\t]*[ \t]>/g, "");
            elem.val(txtFldval);
            $("#" + targetParId + " .card-content .htmlContentCard").html(txtFldval);
        } else if (keyWord == 'sql') {
            if (txtFldval !== "")
                ajaxCallObj.fireMySql(txtFldval, targetParId, "", "prpShtUpdateSql","");
            else
                $("#" + targetParId + " .sqlContentCard").html("");
        }

        $("#customTxtAreaWrapper textarea").val("");
        $("#customTxtAreaFooter").hide();
        homeJsonObj.updateDataInJson(targetParId, keyWord, txtFldval);
    } else {
        if ($("#prpShtTxtBx").parent().prev().text() != "Sql") {
            oldVal = htmlEntity("decode", oldVal);
            elem.val(oldVal);
            if ($("#prpShtTxtBx").parent().prev().text().toLowerCase() == "html")
                $("#" + targetParId + " .card-content .htmlContentCard").html(oldVal);
            else
                $("#" + targetParId + " .card-content p").text(oldVal);
        }
    }
}

$('html').click(function(event) {
    //dom click events document.click document click
    var target = $(event.target);
    if (target.parent().attr('id') != "iconWrapperData" && !target.parent().hasClass('iconSelector') && !target.hasClass('iconSelector') && !target.hasClass('iconInpFld') && $("#iconWrapperData").length !== 0)
        toggleIcons("destroy");
    if (target.parents('.gradientPalletWrapper').length === 0 && target.parent().attr('id') != "gradientPicker") {
        $(".gradientSelected").remove();
        $(".gradientPalletWrapper").hide('medium');
    }

});


$(document).on('click', '#sortable .cardTitleClear', function(e) {
    e.stopPropagation();
    const elem = $(this);
    const parentElem = elem.parents('.card.hoverable')
    if (elem.hasClass('saveHideBtn')) {
        //means my tab need to hide the widget
        isChangesMade = true;
        if (parentElem.hasClass('hidden')) {
            //means its already hidden need to enable
            parentElem.removeClass('hidden');
            elem.attr('title', 'Hide Widget');
            elem.find('i').attr('class', 'icon-eye');
        } else {
            parentElem.addClass('hidden');
            elem.attr('title', 'Show Widget');
            elem.find('i').attr('class', 'icon-eye-crossed');
        }
    } else {
        //means delete widget
        var targetId = $(this).parents('.ui-state-default').attr('id');
        createConfirmBox("deleteWidget", parent.lcm[9], "homeJsonObj~removeTheNode~" + targetId + "");
    }
});



function createConfirmBox(task, msg, okFunctionality) {
    //need to make this function generic
    if (deleteCnfrmBx && deleteCnfrmBx.isOpen()) {
        return false;
    }
    var title;
    if (task == "deleteWidget") {
        okFunctionality = okFunctionality.split("~");
        if (!homeJsonObj.getValue(okFunctionality[2], "lmo")) {
            if (!changesTracker("get")) {
                return false
            }
            window[okFunctionality[0]][okFunctionality[1]](okFunctionality[2]);
            return;
        }
        title = localLangFile["delete"];
    }else if(task == "deleteTab"){
        title = localLangFile["delete"];
    }else{
        title = localLangFile["cache_info"];
    }

    var isRtl = ax_direction === "rtl";
    deleteCnfrmBx = $.confirm({
        theme: 'modern',
        title: title,
        onContentReady: function () {
            disableBackDrop('bind');
        },
        onOpen: function () { $('.cnfrmBxHotBtn').focus(); },
        escapeKey: 'buttonB',
        rtl: isRtl,
        content: msg,
        columnClass: 'col s6 offset-s3',
        buttons: {
            buttonA: {
                text: parent.lcm[155],
                btnClass: 'btn btn-primary',
                action: function() {
                    if (task === "deleteTab") {
                        ajaxCallObj.deleteTheTab(okFunctionality);
                    } else if (task == "deleteWidget") {
                        window[okFunctionality[0]][okFunctionality[1]](okFunctionality[2]);
                    }
                    deleteCnfrmBx = "";
                }
            },
            buttonB: {
                text: localLangFile["cancel"],
                btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                action: function () {
                    disableBackDrop('destroy');
                    deleteCnfrmBx = "";                   
                }
            },
        }
    });
}


function prpShtChangeTrgtType(elem, calledFrom,tg) {
    $(document).off('blur.prpShtTargetErrorValidate');
    $("#prpShtTarget").removeClass('customFldError')
    var elem = $(elem);
    var selectedOptn = elem.val();
    if (calledFrom != "onClick") {
        homeJsonObj.updateDataInJson($("#propertySheet").data('target'), "tgt", selectedOptn);
        if (selectedOptn == "none" || selectedOptn == "url") {
            var targetId = $("#propertySheet").data('target');
        } else if (selectedOptn == "tstruct" || selectedOptn == "iview") {
            //need to remove if no use
        }
    }
    if (selectedOptn == "none") {
        $("#prpShtTargetWrapper").addClass('notSearchable').hide();
        return;
    }

    $(document).on('blur.prpShtTargetErrorValidate', '#prpShtTarget', function(event) {
        event.preventDefault();
        var elem = $(this);
        var selectedOptn = $("#prpShtTargetType").val();
        if (selectedOptn == "tstruct" || selectedOptn == "iview") {
            if (elem.val() == "") {
                elem.data('key', "");
            }
            if (!elem.data('key') || elem.data('key') == "") {
                $("#prpShtTarget").addClass('customFldError');
                showAlertDialog("warning", 1043, "client", selectedOptn);
                return false;
            } else {
                elem.removeClass('customFldError')
            }
        } else if (selectedOptn == "url") {
            var res = elem.val().match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
            if (res == null) {
                elem.addClass('customFldError');
                showAlertDialog("warning", 1044, "client");
                return false;
            } else {
                elem.removeClass('customFldError')
            }
        }
    });
    $("#prpShtTargetWrapper").removeClass('notSearchable').show();
    if (selectedOptn == "url") {
        $("#prpShtTarget").attr('onkeyup', "homeJsonObj.updateValueOnKeyUp(this,'tg')").val("https://");
        $('input#prpShtTarget').autocomplete("destroy");
        $("#prpShtTarget").focus();
    } else {
        $("#prpShtTarget").data('key', "").removeClass('valSelected').val("").removeAttr('onkeyup');
        var dataToAdd;
        if (autoComData[selectedOptn]) {
            dataToAdd = autoComData[selectedOptn];
        } else {
            var tmpObj = {};
            var dataToLoad = ajaxCallObj.onLoadObj.menu[selectedOptn];
            var dataLength = dataToLoad.length
            for (var i = 0; i < dataLength; i++) {
                var curArray = dataToLoad[i];
                tmpObj[curArray[1]] = selectedOptn.charAt(0) + curArray[0];
            }
            dataToAdd = autoComData[selectedOptn] = tmpObj;
        }

        $('input#prpShtTarget').autocomplete({
            isKeyImage: false,
            data: dataToAdd,
            limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
            onAutocomplete: function(val) {
                var targetId = $('input#prpShtTarget').parents("#propertySheet").data('target');
                var target = $('input#prpShtTarget').data('key');
                homeJsonObj.updateDataInJson(targetId, "tg", target);
                ajaxCallObj.getApplicableRoles(target.charAt(0), target.substr(1));
            },
            minLength: 0, // The minimum length of the input for the autocomplete to start. Default: 1.
        })
        var targetValue = '';
        for (var key in dataToAdd) {
            if (dataToAdd[key] == tg) 
                targetValue = key;
        }
        if(tg && targetValue)
            $('input#prpShtTarget').val(targetValue);
        if (calledFrom != "onClick")
            $('input#prpShtTarget').focus();
    }
}

//json related functions
// homeJsonObj
function HomeBuilderJsonObj() {
    this.jsonContent = {};
    this.jsonContent.length = 0;
    this.jsonContent.jsonData = {};
    this.jsonContent.customWidget = {};
    this.jsonContent.jsonOrder = [];
    this.jsonContent.pageData = {};
    this.jsonDataa = this.jsonContent.jsonData;
    this.addInitialDataToJson = function(id) {
        isChangesMade = true;
        var widgetId = "";
        var presentJsonData = this.jsonContent.jsonData[id] = {};
        var elem = $("#" + id);
        var type = elem.data('type');
        var target = elem.data('target');
        menuSelectedList.push(target);
        var title = elem.find('.cardTitle').text();
        var description = elem.find('.card-content p').text();
        var idOfElem = elem.attr('id');
        var className = elem.find('.cardTitleWrapper i:first').attr("class");
        var iconColor = tinycolor(elem.find('.cardTitleWrapper i:first').css('color')).toHexString();
        var titleColor = tinycolor(elem.find('.cardTitle').css('color')).toHexString();
        var titleBgColor = tinycolor(elem.find('.cardTitleWrapper').css('background-color')).toHexString();
        var floatingBtnColor = tinycolor(elem.find('.fixed-action-btn .btn-floating i').css('color')).toHexString();
        var floatingBtnBgColor = tinycolor(elem.find('.fixed-action-btn .btn-floating').css('background-color')).toHexString();
        var bdyClr = tinycolor(elem.find('.cardContentMainWrapper').css('color')).toHexString();
        var bdyBgColor = tinycolor(elem.find('.cardContentMainWrapper').css('background-color')).toHexString();
        clearPropertySheet();
        var customElem = $(".customWidgetsUl .collection-item[data-type='" + type + "']");
        var dataExpand = customElem.data('expand');
        if (dataExpand)
            presentJsonData.we = dataExpand;
        if (customElem.data('multiselect') !== false && type.indexOf("Custom__") !== -1) {
            var customType = type.substring(8);
            var customTarget = customElem.data('target');
            var customTargetCount = parseInt(customTarget.substr(("C__" + customType).length));
            this.jsonContent.customWidget[customType] = customTargetCount;
            customElem.attr("data-target", "C__" + customType + (customTargetCount + 1)).data('target', "C__" + customType + (customTargetCount + 1));
        }
        presentJsonData.c = type;
        if (type.indexOf("Custom__") !== -1) {
            $("#prpShtComponent").text(customElem.text());
            $("#prpShtTarget").prop('disabled', false).val("");
            presentJsonData.ctg = target;
            target = "";
            presentJsonData.tgt = $("#prpShtTargetType").val();
            if (type == "Custom__mytsk" || type == "Custom__rss") {
                //defaulting some color for bg instead of white so that corousal controls which are in white will be visible
                elem.find('.cardContentMainWrapper').css('background-color', "#b7b7b7");
                bdyBgColor = "#b7b7b7";
            }

        } else {
            $("#prpShtTxtBx").val(description);
            presentJsonData.dc = description;
            $("#prpShtComponent").text(type);
            $("#prpShtTarget").prop('disabled', true).val(title);
        }
        if (type == "widget") {
            widgetId = parseInt(target.substr(6));
            presentJsonData.wid = widgetId;
        }

        presentJsonData.tl = title;
        $("#prpShtTitle").val(title);
        presentJsonData.tg = target;
        presentJsonData.tr = "show";
        presentJsonData.ir = "true";
        $("#prpShtTargetRgn").prop('checked', true);
        presentJsonData.ic = className;
        $("#prpShtIcon").val(className);
        $("#iconSelectorSpn").attr('class', className);
        presentJsonData.icc = iconColor;
        setColorInProp("prpShtIcnColor", iconColor);
        presentJsonData.tc = titleColor;
        setColorInProp("prpShtTtlColor", titleColor);
        presentJsonData.tbc = titleBgColor;
        setColorInProp("prpShtTtlBgColor", titleBgColor);
        presentJsonData.bc = bdyClr;
        setColorInProp("prpShtBodyTxtColor", bdyClr);
        presentJsonData.bbc = bdyBgColor;
        setColorInProp("prpShtBodyColor", bdyBgColor);
        presentJsonData.fc = floatingBtnColor;
        setColorInProp("prpShtBtnColor", floatingBtnColor);
        presentJsonData.fbc = floatingBtnBgColor;
        setColorInProp("prpShtBtnBgColor", floatingBtnBgColor);
        this.jsonLengthHandler("add");
        addEventsAfterWidgetCreated(id);
        if (type.indexOf("Custom__") === -1) {
            getTheRequiredData(type, target, "addInitialData", widgetId);
        } else {
            getTheRequiredData(type, presentJsonData.ctg, "addInitialData", widgetId);
            if (type == "Custom__mytsk")
                ajaxCallObj.fireMySql(myTaskString, presentJsonData.ctg + "Wrapper", true, "myTasks","");
        }

        this.modified(id);
        // Added on 10.4 
        $("#prpShtWidgetRefresheTimer").val(30);
        $("#phpShtWidgetRefresher").prop('checked', true);
        presentJsonData.cwd = "Y";
        presentJsonData.cei = 30;

        openProprtySht(type, id, "addInitialDataToJson");
        changesTracker("set", id);
    }
    this.jsonLengthHandler = function(type) {
        var jsonLength = parseInt(this.jsonContent.length);
        if (type == "add") {
            jsonLength = jsonLength + 1;
        } else {
            jsonLength = jsonLength - 1;
        }
    }

    this.updateDataInJson = function(id, key, value) {
        var isPage = id.indexOf("__pageProps__") !== -1;
        if (isPage) {
            var pageId = id.substr(13); //always starts with __pageProps__
            var changedTabData = this.jsonContent.pageData[pageId].changedTabData;
            if (!changedTabData)
                changedTabData = this.jsonContent.pageData[pageId].changedTabData = {};
            let tmpKey = key;
            switch (key) {
                case "tl":
                    tmpKey = "title"
                    break;
                case "rl":
                    tmpKey = "rty"
                    break;
                default:
                    // statements_def
                    break;
            }

            changedTabData[tmpKey] = value;
            var pageTab = $("#HPBtabsHaeder a[data-tid=" + pageId + "]");
            pageTab.data('status', 'notSaved');
            if (key === "tl") {
                pageTab.find('.tabTitle').text(value);
            }
            this.modified(id, "page");
        } else {
            changesTracker("set", id);
            builderActiveElement = "propSheet";
            this.modified(id);
            if (key) {
                this.jsonContent.jsonData[id][key] = value;
            }
            this.jsonContent.jsonData[id]["isU"] = "Y";
            changeWidgetStatus("notSaved", id)
        }
    }
    this.getValue = function(id, key) {
        var valToRet = this.jsonContent.jsonData[id][key]
        return valToRet ? valToRet : false;
    }
    this.updateValueOnKeyUp = function(elem, key) {        
        if (!this.validateTheValueOnKeyUp(elem, key)) return false;
        isChangesMade = true;
        elem = $(elem);
        var targetId = elem.parents("#propertySheet").data('target');
        var valueEnter = elem.val();
        var msg = '<span>If you reduce caching time to 10 minutes or less, then it will affect the performance of the widget.</span>'
        if(valueEnter <=10){
            createConfirmBox('cacheInfo',msg);
        }
        this.updateDataInJson(targetId, key, valueEnter);
        if (key == "tl") {
            $("#" + targetId).find('.cardTitle').text(valueEnter);
        }
    }
    this.validateTheValueOnKeyUp = function(elem, key) {
        if (key === "cei") {
            elem = $(elem);
            const enteredVal = parseInt(elem.val() || 0) || 0;
            if (enteredVal < 0) {
                elem.val(0);
            } else if (enteredVal > 999) {
                elem.val(999);
            }
            return true;
        }
        return true;
    }
    this.modified = function(id, calledFrom) {
        isChangesMade = true;
        if (calledFrom === "page") {
        } else {
            this.jsonContent.jsonData[id]["lmb"] = currentUserName;
            this.jsonContent.jsonData[id]["lmo"] = getFormattedDate();
        }
        $("#prpShtModifiedBy").text(currentUserName);
        $("#prpShtModifiedOn").text(getFormattedDate());
    }

    this.removeTheNode = function(id) {
        isChangesMade = true;
        var liTarget = id.substring(0, id.indexOf("Wrapper"));
        var isCustomWdgt = liTarget.indexOf("C__") == 0;
        var idxToRmv = menuSelectedList.indexOf(liTarget);
        if (idxToRmv > -1) {
            menuSelectedList.splice(idxToRmv, 1);
        }
        if (isCustomWdgt) {
            var targetLiElem = $("li.collection-item[data-target ^='" + liTarget.substr(0, 5) + "']");
        } else {
            var targetLiElem = $("li.collection-item[data-target ^='" + liTarget + "']");
        }
        if (targetLiElem.data('multiselect') !== false && liTarget.indexOf("C__") == 0) {
            var customType = targetLiElem.data('type').substr(8);
            var count = targetLiElem.attr("data-count");
            if (count == 1) {
                delete this.jsonContent.customWidget[customType]
                targetLiElem.removeAttr("data-count").removeClass('createBadge');
            } else {
                targetLiElem.attr("data-count", parseInt(count) - 1);
            }
        } else {
            if (isCustomWdgt)
                $("li.collection-item[data-target ^='" + liTarget.substr(0, 5) + "']").draggable("enable").removeClass('widgetCreated');
            else
                $("li.collection-item[data-target ^='" + liTarget + "']").draggable("enable").removeClass('widgetCreated');
        }
        var target = $("#" + id);
        var presTemplate = getTheTemplat();
        rearrangePanelsBeforeDeleteNadd({
            elem: target,
            templateObj: presTemplate,
            task: "delete"
        });
        if (target.hasClass('selectedForPropSht'))
            closeProprtySht();
        target.remove();
        var customWidget = false;
        var ig = "";
        var presWidgtGngToDlt = this.jsonContent.jsonData[id];
        var hid = presWidgtGngToDlt.hid;
        if (liTarget.indexOf("C__") === 0) {
            customWidget = presWidgtGngToDlt.c;
            ig = presWidgtGngToDlt.ig;
        }
        delete this.jsonContent.jsonData[id];
        if (hid != undefined || hid != "") {
            this.jsonContent.jsonData[id + "~D"] = {
                hid: hid,
                isU: "Y",
                isD: "Y",
                c: customWidget,
                ig: ig
            }
            deletedLstArray.push(id + "~D");
        }
        this.jsonLengthHandler("delete");
    }
}

//json related functions~End


function getTheRequiredData(type, liTarget, calledFrom, widgetId) {
    if (type.indexOf("Custom__") !== -1)
        type = "customWidget";
    switch (type) {
        case "iview":
            if (isPageBuilder) {
                ajaxCallObj.getIviewDataNew({ target: liTarget });
            } else {
                ajaxCallObj.getIviewData(liTarget);
            }
            break;
        case "tstruct":
            break;
        case "widget":
            ajaxCallObj.getAxpertWidgetDetails({ tId: liTarget, widgetId, calledFrom: "addInitialDataCall" });
            break;
        case "customWidget":
            break;
        default:
            // statements_def
            break;
    }
}

function clearrRedisDataWS(){
    $.ajax({
        type: "POST",
        url: "../WidgetWebService.asmx/ClearRedisWidgetData",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        cache: false,
        success: function (response) {
        },
        failure: function (response) {
        }
    });
}

//ajaxCalls
function MakeHBAjaxCall() {
    this.onLoadObj = {};
    this.deleteImage = function(imgName) {
        var settings = primaryApiSettings();
        settings.url = apiBase + "removeimage";
        settings.data.imagename = imgName;
        $.ajax(settings).done(function(response) {
            console.log(response);
            if (response.status == false) {
                filterErrorMessageAndShow(response);
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            onAjaxFailure();
        });
    }
    this.saveJsonData = function (calledFrom) {
        if (!ajaxCallObj.isPageValid()) {
            redirectPage(true);
            return;
        }
        closeProprtySht(calledFrom);
        if (!isChangesMade) {
            showAlertDialog("warning", "No modification have been made.");
            return false;
        }
        var activePageTab = $("#HPBtabsHaeder .pageTab a.active");
        if (activePageTab.parent().hasClass('myPageTab')) {
            //then we are saving mytab data so calling seperate api for this
            //Reason we are redirecting in this function is this will be called in multiple scenarios so we are checking here
            const needToUpdate = homeJsonObj.jsonContent.pageData[activePageTab.data("tid")].widgetOrder != "";
            this.saveMyView(needToUpdate);
            return
        }

        if (activePageTab.data('status') === "notSaved") {
            callParentNew("closeFrame()","function");
           // parent.loadFrame();
            var savedTid = activePageTab.data('tid');
            let changedTabData = { ...homeJsonObj.jsonContent.pageData[savedTid].changedTabData };
            if (changedTabData.rty) {
                changedTabData.rty = changedTabData.rty.join();
            }
            this.updateTabData(savedTid, changedTabData);
            return false;
        }
        if (jQuery.isEmptyObject(homeJsonObj.jsonContent.jsonData)) {
            callParentNew("closeFrame()","function");
           // parent.closeFrame();
            return;
        }

        //start Loader
        var jsonOrdr = homeJsonObj.jsonContent.jsonOrder = [];
        let redisClrKeys = [];
        $("#sortable .ui-state-default").each(function(index, el) {
            let presWidgetId = $(this).attr('id');
            jsonOrdr.push(presWidgetId);
            const presWidgetData = homeJsonObj.jsonContent.jsonData[presWidgetId];
            if (presWidgetData.isU === "Y" && presWidgetData.cwd !== undefined) {
                let typeOfWidget = presWidgetData.c;
                let widgetId;
                if (typeOfWidget === "widget") {
                    widgetId = presWidgetData.wid;
                } else if (typeOfWidget === "Custom__sql") {
                    widgetId = presWidgetData.ctg;
                }
                if (widgetId) {
                    let cacheKey = getTheCacheKey({ widgetId, sql: "" });
                    redisClrKeys.push(cacheKey);
                }
            }
        });
        clearrRedisDataWS();
        ajaxCallObj.clearRedisData(redisClrKeys);
        jsonOrdr = $.merge(jsonOrdr, deletedLstArray);
        var presTabId = activePageTab.data('tid');
        var settings = primaryApiSettings();
        settings.url = apiBase + "setSavedWidgets";
        settings.data.databody = JSON.stringify(homeJsonObj.jsonContent);
        settings.data.rty = userBuildResps.toString();
        settings.data.hp_id = presTabId;
        callParentNew("loadFrame()","function");
       // parent.loadFrame();
        $.ajax(settings).done(function (response) {
            if (response.status === true) {
                callParentNew("closeFrame()","function");
               // parent.closeFrame();
                // clearing the variables once data is saved
                delete homeJsonObj.jsonContent.pageData[presTabId].data;
                isRearranged = "N";
                isChangesMade = false;
                isDataPublished = "N";
                changesTrackerArray = [];
                var data = response.data;

                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        var presntObj = data[key];
                        var hid = presntObj[1];
                        var isSaved = presntObj[0];
                        var statusMsg = presntObj[2];
                        if (key.indexOf("C__") !== -1) {
                            var tmpObjData = homeJsonObj.jsonContent.jsonData[key];
                            if (tmpObjData.c === "Custom__img" && tmpObjData.isD === "Y") {
                                ajaxCallObj.deleteImage(tmpObjData.ig);
                            }
                            delete homeJsonObj.jsonContent.jsonData[key];
                            var cType = tmpObjData.c.substr(8);
                            var newKey = "C__" + cType + hid + "Wrapper";
                            tmpObjData.ctg = newKey;
                            homeJsonObj.jsonContent.jsonData[newKey] = tmpObjData;
                            $("#" + key).attr('id', newKey);
                            $("#" + key).data('target', newKey);
                            var dltIndx = $.inArray(key, deletedLstArray);
                            if (dltIndx !== -1){
                                deletedLstArray[dltIndx] = newKey;
                            }
                            key = newKey;
                        }

                        if (isSaved) {
                            if($("#" + key).length > 0){
                                var targetWidgetElem = $("#" + key);
                                targetWidgetElem.data('hid', hid);
                                if (statusMsg.toLowerCase().indexOf("not updated") === -1) {
                                    changeWidgetStatus("save", key)
                                }
                                homeJsonObj.jsonContent.jsonData[key].isRespChanged = "N";
                                homeJsonObj.jsonContent.jsonData[key].pid = null;
                                homeJsonObj.jsonContent.jsonData[key].hid = hid;
                                homeJsonObj.jsonContent.jsonData[key].isU = "N";
                            }
                        } else {
                            changesTrackerArray.push(key);
                            changeWidgetStatus("saveFailed", key)
                            //need to show that widget failed to save
                        }
                    }
                }
                showAlertDialog("success", "Changes saved successfully");
            } else if (response.status == false) {
                filterErrorMessageAndShow(response);
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            onAjaxFailure();
        });
    }
    this.publishJsonData = function () {
        if (!ajaxCallObj.isPageValid()) {
            redirectPage(true);
            return;
        }
        closeProprtySht();
        if (isChangesMade) {
            showAlertDialog("warning", "Please save before publishing.");
            return false;
        } else if (isDataPublished !== "N") {
            showAlertDialog("warning", "No changes to publish.");
            return false;
        }
        callParentNew("loadFrame()","function");
       // parent.loadFrame();
        //need to check first tab is published or need to publish the tab first
        const activeTab = $("#HPBtabsHaeder .pageTab a.active");
        var publishedTabId = activeTab.data('ptid');
        const tabStatus = activeTab.data('status');
        if (!publishedTabId) {
            ajaxCallObj.publishNewTab(activeTab.data('tid'));
            return
        } else if (tabStatus === "notPublished") {
            ajaxCallObj.updatePulishedTab(activeTab.data('tid'));
            return
        }
        const activeTabSaveId = activeTab.data('tid');
        changePageStatus(`${homeJsonObj.jsonContent.pageData[activeTabSaveId].tabData[metaDataCacher.tabData.IS_PRIVATE] === "Y"  ? "private" : "published"}`, activeTab.find(".tabTitle"))
        var hids = [];
        tempPubObj = {};
        var jsonOrdr = homeJsonObj.jsonContent.jsonOrder = [];
        $("#sortable .ui-state-default").each(function (index, el) {
            jsonOrdr.push($(this).attr('id'));
        });
        jsonOrdr = $.merge(jsonOrdr, deletedLstArray);
        var homeObj = homeJsonObj.jsonContent.jsonData;
        let redisClrKeys = [];
        for (var i = 0; i < jsonOrdr.length; i++) {
            var presKey = jsonOrdr[i];
            var presObj = homeObj[presKey];
            if (!presObj) {
                continue;
            }
            var presHid = presObj.hid;
            if (presObj.isD === "Y") {
                let widgetId = presKey.substring(6, presKey.indexOf("Wrapper"))
                let cacheKey = getTheCacheKey({ widgetId, sql: "" });
                redisClrKeys.push(cacheKey);
                redisClrKeys.push(cacheKey.replace("~hbs~","~hbp~"));
            }else if (presObj.pid === null && presObj.cwd !== undefined) {
                //means if widget is going to publish then pid(parent id) will be null then will clear the reddis key in this
                let typeOfWidget = presObj.c;
                let widgetId;
                if (typeOfWidget === "widget") {
                    widgetId = presObj.wid;
                } else if (typeOfWidget === "Custom__sql") {
                    widgetId = presObj.ctg;
                }
                if (widgetId) {
                    let cacheKey = getTheCacheKey({ widgetId, sql: "" });
                    redisClrKeys.push(cacheKey.replace("~hbs~", "~hbp~"));// need to remove the publish key
                }
            }
            hids.push(presHid);
            tempPubObj[presHid] = presKey;
        }
        clearrRedisDataWS();
        ajaxCallObj.clearRedisData(redisClrKeys);
        if (hids.length === 0) {
            callParentNew("closeFrame()","function");
            //parent.closeFrame();
            //means no widgets are added in the home
            return
        }
        var settings = primaryApiSettings();
        settings.url = apiBase + "setPublishedWidgets";
        settings.data.sids = hids.toString();
        settings.data.hp_id = activeTabSaveId;
        settings.data.p_hp_id = publishedTabId;

        $.ajax(settings).done(function(response) {
            if (response.status === true) {
                var data = response.data;
                for (var hid in data) {
                    if (data.hasOwnProperty(hid)) {
                        var presntObj = data[hid];
                        var pid = presntObj[1];
                        var isSaved = presntObj[0]
                        var key = tempPubObj[hid];
                        var tmpObjData = homeJsonObj.jsonContent.jsonData[key];
                        if (tmpObjData.c === "Custom__img" && tmpObjData.isD === "Y") {
                            ajaxCallObj.deleteImage(tmpObjData.ig);
                        }
                        if (isSaved) {
                            var widgStatus = homeJsonObj.jsonContent.jsonData[key].ip === "Y" ? "private" : "published";
                            changeWidgetStatus(widgStatus, key)
                            homeJsonObj.jsonContent.jsonData[key].pid = pid;
                        } else {
                            changeWidgetStatus("saveFailed", key)
                            //need to show that widget failed to save
                        }
                    }
                }
                isDataPublished = "Y";
                callParentNew("closeFrame()","function");
               // parent.closeFrame();
                showAlertDialog("success", "Changes published successfully");
            } else if (response.status == false) {
                filterErrorMessageAndShow(response);
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            onAjaxFailure();
        });
    }


    this.getOnLoadData = function() {
        var settings = primaryApiSettings();
        settings.url = apiBase + "getmenu";
        settings.data.rty = userResps.toString();
        settings.data.lang = ax_language_full.toUpperCase();
        $.ajax(settings).done(function(response) {
            if (response.status = true && response.statusCode == 200) {
                ajaxCallObj.onLoadObj = response;
                ajaxCallObj.createMenu();
                ajaxCallObj.getSavedTabs();
                ajaxCallObj.getTmplateInfo();
            } else {
                filterErrorMessageAndShow(response);
            }

        }).fail(function(jqXHR, textStatus, errorThrown) {
            onAjaxFailure();
        });
    }


    this.getApplicableRoles = function(type, tvransid) {
        var settings = primaryApiSettings();
        settings.url = apiBase + "roleprovider";
        settings.data.sname = tvransid;
        settings.data.stype = type;
        $.ajax(settings).done(function(response) {
            if (response.status == true) {
                var rolesData = response.data.roles;
                var rolesDataLngth = rolesData.length;
                var optionHtml = "";
                for (var i = 0; i < rolesDataLngth; i++) {
                    optionHtml += '<option title="' + rolesData[i] + '" value="' + rolesData[i] + '">' + rolesData[i] + '</option>';
                }
                homeJsonObj.updateDataInJson($("#propertySheet").data('target'), "rl", "");
                homeJsonObj.updateDataInJson($("#propertySheet").data('target'), "arl", rolesData);
                $('#prpShtRoles').material_select('destroy');
                $("#prpShtRoles").html(optionHtml);
                $('#prpShtRoles').material_select();
                $("#prpShtRolesWrappperTd .select-dropdown").val("").addClass('customFldError');
            } else {
                homeJsonObj.updateDataInJson($("#propertySheet").data('target'), "rl", "");
                homeJsonObj.updateDataInJson($("#propertySheet").data('target'), "arl", "");
                $('#prpShtRoles').material_select('destroy');
                $("#prpShtRoles").html("<option disabled >" + response.errMsg + "</option>");
                $('#prpShtRoles').material_select();
                filterErrorMessageAndShow(response);
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            homeJsonObj.updateDataInJson($("#propertySheet").data('target'), "rl", "");
            onAjaxFailure();
        });
    }


    this.createMenu = function() {
        homeJsonObj.allRoles = this.onLoadObj.userroles;
        var menu = this.onLoadObj.menu;
        var chartMenu = this.onLoadObj.chartdata;
        var tstructMenu = menu.tstruct;
        var iviewMenu = menu.iview;
        var tstructHtml = "";
        var iviewHtml = "";
        var widgetHtml = "";
        var tstructMenuLgth = tstructMenu.length;
        var ivwMenuLgth = iviewMenu.length;
        if (tstructMenuLgth !== 0) {
            if (tstructMenuLgth > maxScrollElemntsInMenu) {
                tstructMenuLgth = maxScrollElemntsInMenu;
                $("#toolBarLsttstruct").addClass("dynamicData");
            }
            for (var i = 0; i < tstructMenuLgth; i++) {
                tstructHtml += '<li data-menuidx=' + i + ' title="' + tstructMenu[i][1] + '" data-target="t' + tstructMenu[i][0] + '" data-type="tstruct" class="collection-item">' + tstructMenu[i][1] + '</li>';
            }
        } else {
            var cutMsg = eval(callParent('lcm[0]'));
            tstructHtml = '<li title=' + cutMsg + ' class="collection-item noDataLi">' + cutMsg + '</li>';
        }
        if (ivwMenuLgth !== 0) {
            if (ivwMenuLgth > maxScrollElemntsInMenu) {
                ivwMenuLgth = maxScrollElemntsInMenu;
                $("#toolBarLstiview").addClass("dynamicData");
            }
            for (var i = 0; i < ivwMenuLgth; i++) {
                iviewHtml += '<li  data-menuidx=' + i + ' title="' + iviewMenu[i][1] + '" data-target="i' + iviewMenu[i][0] + '" data-type="iview" class="collection-item">' + iviewMenu[i][1] + '</li>';
            }
        } else {
            iviewHtml = '<li title="No data found" class="collection-item noDataLi">No data found.</li>';
        }
        if (chartMenu && chartMenu != "") {
            var chartMenuRows = chartMenu.rows; //id~Caption~type~chart Type
            var chartWidgetLength = chartMenuRows.length;
            if (chartWidgetLength !== 0) {
                for (var i = 0; i < chartWidgetLength; i++) {
                    var curWidget = chartMenuRows[i];
                    if (curWidget[2] != "Search")
                        widgetHtml += '<li data-menuidx=' + i + ' title="' + curWidget[1] + '" data-widgetId=' + curWidget[0] + ' data-target="widget' + curWidget[0] + '" data-widgetType="' + curWidget[2] + '" data-chartType="' + curWidget[3] + '" data-type="widget" class="collection-item">' + curWidget[1] + '</li>';
                }
            } else {
                var cutMsg = eval(callParent('lcm[0]'));
                widgetHtml += ' <li class="collection-item noDataLi">' + cutMsg + '</li>';
            }

        } else {
            var cutMsg = eval(callParent('lcm[0]'));
            widgetHtml += ' <li class="collection-item noDataLi">' + cutMsg + '</li>';
        }
        $("#toolBarLsttstruct").html(tstructHtml);
        $("#toolBarLstiview").html(iviewHtml);
        $("#toolBarLstwidget").html(widgetHtml);
        addEventsAfterLoad();
    }


    this.createNewTab = function({jsonData}) {

        var settings = primaryApiSettings();
        settings.url = apiBase + "setSavePage";
        if (isPageBuilder) {
            settings.data.isPgins = 'Y';
        }
        settings.data.jsonbody = JSON.stringify(jsonData);
        $.ajax(settings).done(function(response) {
            callParentNew("closeFrame()","function");
           // parent.closeFrame();
            var tabName = jsonData.title;
            if (response.status) {
                var pageId = response.data;
                var finalTabHtml = `<li class="tab pageTab col s6"><a class="newTab" data-tid=${pageId} href="#tab${$("#HPBtabsHaeder li").length+1}">${changePageStatus("save", "onlyHtml")}<span class="tabTitle">${tabName}</span><button class="deleteTab waves-effect waves-red btn-flat"><span class="icon-cross"></span></button></a></li>`;
                $("#HPBtabsHaeder").prepend(finalTabHtml).show();
                recreateTheHeaderTabs();
                if (!isPageBuilder) {
                    const createdResps = jsonData.rty ? jsonData.rty.split(",") : [];
                    createdResps.forEach(resp => {
                        if (resp != "" && $.inArray(resp, alreadyUsedResp) === -1) {
                            alreadyUsedResp.push(resp);
                        }
                    });
                }
                if ($.inArray(tabName, allTabNames) === -1) {
                    allTabNames.push(tabName);
                }
                updateTabDetailsInCache({
                    task: "new",
                    pageId: pageId,
                    tabDetails: { title: tabName, resp: jsonData.rty, template: jsonData.tmp, ip: jsonData.ip, pageMenu: jsonData.pageMenu, isDefault: jsonData.isDefault }
                });
                clearThePreviousHomePage();
                $("#HPBtabsHaeder a[data-tid=" + response.data + "]").click();
            } else {
                filterErrorMessageAndShow(response);
            }
            $('#createNewPageModal').modal('close');
        }).fail(function(jqXHR, textStatus, errorThrown) {
            onAjaxFailure();
        });
    }

    this.deleteTheTab = function(savedTabId) {
        var settings = primaryApiSettings();
        settings.url = apiBase + "deleteSavedPage";
        settings.data.hp_id = savedTabId;
        $.ajax(settings).done(function(response) {
            if (response.status) {
                showAlertDialog("success", "Page deleted successfully.");
                const tabToDel = $("#HPBtabsHaeder a[data-tid=" + savedTabId + "]");
                const parentLiTab = tabToDel.parent();
                parentLiTab.remove();
                let createdResps = homeJsonObj.jsonContent.pageData[savedTabId].tabData[metaDataCacher.tabData.RESPONSIBILITY];
                let createdTabName = homeJsonObj.jsonContent.pageData[savedTabId].tabData[metaDataCacher.tabData.TITLE];
                if (!isPageBuilder) {
                    createdResps = createdResps ? createdResps.split(",") : [];
                    createdResps.forEach(resp => {
                        let inArrayIdx = $.inArray(resp, alreadyUsedResp)
                        if (resp != "" && inArrayIdx !== -1) {
                            alreadyUsedResp.splice(inArrayIdx, 1);
                        }
                    });
                }
                let createdTabNameIdx = $.inArray(createdTabName, allTabNames)
                if (createdTabNameIdx !== -1) {
                    allTabNames.splice(createdTabNameIdx, 1);
                }
                if (tabToDel.hasClass('active')) {
                    if ($("#HPBtabsHaeder li:first").hasClass('pageTab')) {
                        $("#HPBtabsHaeder li:first a").click();
                    } else {
                        clearThePreviousHomePage();
                    }
                }
                if ($("#HPBtabsHaeder li").length === 0) {
                    $("#HPBtabsHaeder").hide();
                }
            } else {
                filterErrorMessageAndShow(response);
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            onAjaxFailure();
        });
    }

    this.updateTabData = function(savedId, jsonData) {
        var settings = primaryApiSettings();
        settings.url = apiBase + "updateSavedPage";
        settings.data.hp_id = savedId;
        settings.data.jsonbody = JSON.stringify(jsonData);

        $.ajax(settings).done(function(response) {
            if (response.status) {
                $("#HPBtabsHaeder .pageTab a[data-tid = '" + savedId + "']").data('status', 'notPublished');
                ajaxCallObj.saveJsonData();
            } else {
                filterErrorMessageAndShow(response);
            }

        }).fail(function(jqXHR, textStatus, errorThrown) {
            onAjaxFailure();
        });
    }

    this.updatePulishedTab = function(savedId) {

        var settings = primaryApiSettings();
        settings.url = apiBase + "updatePublishedPage";
        settings.data.hp_id = savedId;
        $.ajax(settings).done(function(response) {
            if (response.status) {
                $("#HPBtabsHaeder .pageTab a[data-tid = '" + savedId + "']").data('status', '');
                ajaxCallObj.publishJsonData();
            } else {
                filterErrorMessageAndShow(response);
            }

        }).fail(function(jqXHR, textStatus, errorThrown) {
            onAjaxFailure();
        });
    }

    this.publishNewTab = function(savedTabId) {

        var settings = primaryApiSettings();
        if (isPageBuilder) {
            settings.data.isPgins = 'Y';
        }
        settings.url = apiBase + "setPublishPage";
        settings.data.hp_id = savedTabId;

        $.ajax(settings).done(function(response) {
            if (response.status) {
                $("#HPBtabsHaeder .pageTab a.active").data({
                    'ptid': response.data,
                    'status': ""
                });
                ajaxCallObj.publishJsonData();
                //once tab is added need to add to user page if tab belongs to user(To avoid one more ajax call)
                // getTheTabDetailsFromId({ savedTabId });
            } else {
                filterErrorMessageAndShow(response);
            }

        }).fail(function(jqXHR, textStatus, errorThrown) {
            onAjaxFailure();
        });
    }

    this.saveMyView = function(needToUpdate) {

        const activeTab = $("#HPBtabsHaeder .pageTab a.active");
        var publishedTabId = activeTab.data('ptid');
        var hids = [];
        tempPubObj = {};
        var jsonOrdr = [];
        $("#sortable .ui-state-default").each(function(index, el) {
            const elem = $(this);
            const objToAdd = {}
            objToAdd.id = elem.attr('id');
            objToAdd.isHidden = elem.find(".card.hidden").length !== 0;
            jsonOrdr.push(objToAdd)
        });
        var settings = primaryApiSettings();
        settings.url = apiBase + `${needToUpdate ? "updateUserWidget" : "setUserWidget" }`;
        settings.data.jsonbody = JSON.stringify(jsonOrdr)
        settings.data.hp_id = publishedTabId;
        $.ajax(settings).done(function(response) {
            if (response.status === true) {
                showAlertDialog("success", "Changes saved successfully");
                isChangesMade = false;
            } else {
                filterErrorMessageAndShow(response);
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            onAjaxFailure();
        });
    }



}


//ajaxCalls~End

/**
 * To recreate the left side menu when scrolling
 * @param  {String} type  Which panel need to create menu
 * @param  {String} dir  the dir scroll is happening
 * @param  {Boolean} reset Reset to original set
 * @return {null}       
 */
function recreateMenu(type, calledFrom, searchedText) {
    var data = [],
        lastIdx, finalSet = [],
        target, elem, dataType;
    if (type === "toolBarLsttstruct") {
       //to get pass by value
        data = (function(x) {
            return Object.create(x);
        })(ajaxCallObj.onLoadObj.menu.tstruct);
        elem = $("#" + type);
        lastIdx = elem.find('.collection-item').last().data('menuidx');
        target = 't';
        dataType = 'tstruct';
    } else if (type === "toolBarLstiview") {
        //to get pass by value
        data = (function(x) {
            return Object.create(x);
        })(ajaxCallObj.onLoadObj.menu.iview);
        elem = $("#" + type);
        lastIdx = elem.find('.collection-item').last().data('menuidx');
        target = 'i';
        dataType = 'iview';
    }

    if (elem && elem.hasClass('dynamicData')) {

        if (calledFrom === "reset") {
            if (elem.hasClass('reachedTop')) {
                return
            }
            elem.removeClass('reachedEnd searchedData');
            lastIdx = -1;
        }
        if (calledFrom === "search") {
            searchedText = searchedText.toLowerCase();
            var finalSet = [];
            var dataLth = data.length;
            for (var i = 0; i < dataLth; i++) {
                var presTst = data[i];
                if (presTst[1].toLowerCase().indexOf(searchedText) !== -1) {
                    finalSet.push(presTst)
                }
            }
            data = finalSet;
            lastIdx = data.length;
            elem.addClass('searchedData');
            elem.removeClass('reachedEnd reachedTop');
        } else {
            if (elem.hasClass('searchedData')) {
                return
            }
        }

        if (lastIdx !== data.length) {
            elem.removeClass('reachedEnd reachedTop searchedData')
            var finalSet = data.splice(lastIdx + 1, maxScrollElemntsInMenu);
        } else {
            elem.addClass('reachedEnd')
        }

        var finalSetLth = finalSet.length;
        if (finalSetLth !== 0) {
            var htmlToAdd = "";
            for (var i = 0; i < finalSetLth; i++) {
                var presSet = finalSet[i];
                var idx = lastIdx + 1 + i;
                var targetToAdd = target + presSet[0];
                var extraClass = "";
                if ($.inArray(targetToAdd, menuSelectedList) !== -1) {
                    extraClass = "widgetCreated";
                }
                htmlToAdd += '<li data-menuidx=' + idx + ' title="' + presSet[1] + '" data-target="' + targetToAdd + '" data-type="' + dataType + '" class="collection-item ' + extraClass + '">' + presSet[1] + '</li>';
            }
            elem.find(".collection-item:not('.noDataLi')").draggable("destroy");
            if (calledFrom === "reset" || calledFrom === "search") {
                if (calledFrom === "reset") {
                    elem.addClass('reachedTop');
                    elem.prev().find('.toolBxPanelSrch').val("");
                }
                elem.find('.mCSB_container').html(htmlToAdd);
            } else {
                elem.find('.mCSB_container').append(htmlToAdd);
            }
            addMenuEvents(elem);
            if (calledFrom === "reset") {
                elem.mCustomScrollbar("scrollTo", 0, {
                    scrollInertia: 0
                });
            }
        } else {
            if (calledFrom === "search") {
                elem.find('.mCSB_container').html("");
            }
        }
    }
}


function getFormattedDate() {
    var date = new Date();
    var str = getFormattedPartTime(date.getDate()) + "/" + getFormattedPartTime(date.getMonth() + 1) + "/" + date.getFullYear() + " " + formatAMPM(date);

    return str;
}

function getFormattedPartTime(partTime) {
    if (partTime < 10)
        return "0" + partTime;
    return partTime;
}

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}


function showProgress(event, position, total, percentComplete) {
    // body...
    $("#prpShtImgUpload .determinate").css('width', percentComplete + '%');
}

// pre-submit callback 
function showRequest(formData, jqForm, options) {

    var typeOfFile = formData[6].value.type;
    if (formData[6].value === "") {
        //means user cancelled upload
        return false;
    }
    var isValidFile = false;
    if (typeOfFile == "image/jpeg" || typeOfFile == "image/png" || typeOfFile == "image/gif" || typeOfFile == "image/jpg") {
        isValidFile = true;
    }
    // formData is an array; here we use $.param to convert it to a string to display it 
    // but the form plugin does this for you automatically when it submits the data 
    // var queryString = $.param(formData);
    if (!isValidFile) {
        showAlertDialog("warning", 1048, "client");
    } else if (formData[6].value.size > 2000000) {
        showAlertDialog("warning", 1049, "client");
        isValidFile = false;
    } else {
        $("#prpShtImgUpload").show();
        formData[2].value = sId + $("#propertySheet").data('target') + "." + typeOfFile.split('/')[1];
    }
    return isValidFile;
}

// post-submit callback 
function showResponse(responseText, statusText, xhr, $form) {
    if (responseText.status == false) {
        showAlertDialog("warning", responseText.errMsg);
        return
    }


    showAlertDialog("success", 1050, "client");
    $("#imgUploader").val("");
    setTimeout(function () {
        $("#prpShtImgUpload").hide();
    }, 500)

    imageName = responseText.filename;
    var targetId = $("#propertySheet").data('target');
    var targetElem = $("#" + targetId);
    var type = targetElem.data('type');
    if (type == "tstruct")
        targetElem.find('.card-image img').attr('src', imageBase + imageName + "?" + new Date().getTime());
    if (type == "Custom__img")
        targetElem.find('.card-image img').attr('src', imageBase + imageName + "?" + new Date().getTime());
    homeJsonObj.updateDataInJson(targetId, "ig", imageName);
}

function gradientClick(task, color) {
    var checkHtml = '<div class="gradientSelected"><span class="icon-check"></span></div>';
    if (task == "colorClick") {
        $(".gradientPalletWrapper").toggle('medium');
        var colorC = $("#gradientPicker a").data('color');
        $(".gradientPalletWrapper .pallet ." + colorC).append(checkHtml);
        return;
    } else if (task == "colorPick") {
        $(".gradientSelected").remove();
        var targetId = $("#propertySheet").data('target');
        $(".gradientPalletWrapper .pallet ." + color).append(checkHtml);
        $("#gradientPicker").attr('class', 'colorMe ' + color + ' center-align');
        $("#gradientPicker a").data('color', color).text(color);
        homeJsonObj.updateDataInJson(targetId, "kpiColor", color);
        $("#" + targetId).find('.kpiCard').attr('class', 'kpiCard card colorMe ' + color);

    }
}
function modifyTheMsgForInvSess(msg) {
    if (msg.toLowerCase() == "not a valid session") {
        msg = "Signing out. This account is currently being used in one other location.";
    }

    return msg;
}

function changeWidgetStatus(status, id) {
    var elem = $("#" + id);
    if (elem.find('widgetStatus-' + status).length > 0) return
    var statusIndicatorIcon = "";
    var statusIndicatorColorClass = "";
    var toolTip = "";
    var statusIndicator = ""
    if (status) {
        switch (status) {
            case "save":
                statusIndicatorIcon = "icon-check";
                toolTip = "Widget Saved. Not yet published";
                break;
            case "saveFailed":
                statusIndicatorIcon = "icon-warning";
                toolTip = "Widget saving failed.";
                break;
            case "notSaved":
                statusIndicatorIcon = "icon-notification-circle";
                toolTip = "Widget not yet saved.";
                break;
            case "published":
                statusIndicatorIcon = "icon-cloud-check";
                toolTip = "Widget published.";
                break;
            case "private":
                statusIndicatorIcon = "icon-cloud-lock";
                toolTip = "Private widget published.";
                break;
        }
    }
    statusIndicatorColorClass = status;
    statusIndicator = '<span title="' + toolTip + '" class="widgetStatusSpn widgetStatus-' + statusIndicatorColorClass + '"><i class="' + statusIndicatorIcon + '"></i></span>';
    const widgetStatusElem = elem.find('div[class*="widgetStatus-"]');
    widgetStatusElem.removeClass(function(index, className) {
        return (className.match(/(^|\s)widgetStatus-\S+/g) || []).join(' ');
    });
    widgetStatusElem.addClass('widgetStatus-' + status)
    elem.find('.widgetStatusIndicator').html(statusIndicator);
}

function changePageStatus(status, elem) {
    var statusIndicatorIcon = "";
    var statusIndicatorColorClass = "";
    var toolTip = "";
    if (status) {
        switch (status) {
            case "save":
                statusIndicatorIcon = "icon-check";
                toolTip = "Widget Saved. Not yet published";
                break;
            case "saveFailed":
                statusIndicatorIcon = "icon-warning";
                toolTip = "Widget saving failed.";
                break;
            case "notSaved":
                statusIndicatorIcon = "icon-notification-circle";
                toolTip = "Widget not yet saved.";
                break;
            case "published":
                statusIndicatorIcon = "icon-cloud-check";
                toolTip = "Widget published.";
                break;
            case "private":
                statusIndicatorIcon = "icon-cloud-lock";
                toolTip = "Private widget published.";
                break;
            case "myPage":
                statusIndicatorIcon = "icon-user";
                toolTip = "My page.";
                break;
        }
    }
    if (elem === "onlyHtml") {
        return `<span class="tabStatusIcn ${statusIndicatorIcon} widgetStatus-${status}"></span>`;
    }
    var statusIcn = elem.find('.tabStatusIcn');
    if (statusIcn.length === 0) {
        elem.prepend(`<span class="tabStatusIcn ${statusIndicatorIcon} widgetStatus-${status}"></span>`)
    } else {
        statusIcn.attr('class', `tabStatusIcn ${statusIndicatorIcon} widgetStatus-${status}`);
    }

}


function changesTracker(type, id, tab) {
    if (type === "set") {
        if ($.inArray(id, changesTrackerArray) === -1)
            changesTrackerArray.push(id);
        var length = changesTrackerArray.length;
    } else if (type === "get" || type === "pageChange") {
        if ((type === "pageChange" && isChangesMade) || changesTrackerArray.length >= maxChanges) {
            // callParentNew("closeFrame()", "function");
            var isRtl = ax_direction === "rtl";
            $.confirm({
                theme: 'modern',
                title: "Save",
                onContentReady: function () {
                    // disableBackDrop('bind');
                },
                rtl: isRtl,
                escapeKey: 'buttonB',
                content: "Please save the changes before proceeding.",
                columnClass: 'col s6 offset-s3',
                buttons: {
                    buttonA: {
                        text: localLangFile["save"],
                        btnClass: 'btn btn-primary',
                        action() {
                            ajaxCallObj.saveJsonData("fromPopUp");
                            //closeCustomTxtBx(elem, "PermnantCancel", oldVal);
                            if (typeof tab != "undefined") {
                                this.lastCallback(tab);
                            }
                        }
                    },
                    buttonB: {
                        text: localLangFile["cancel"],
                        btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                        action() {
                            //disableBackDrop('destroy');
                            //confirmBox = "";
                            if (typeof tab != "undefined") {
                                this.lastCallback(tab);
                            }
                        }
                    },
                },
                lastCallback(tab) {
                    if (type === "pageChange") {
                        isChangesMade = false;
                        changesTrackerArray = [];
                        callParentNew("loadFrame()","function");
                       // parent.loadFrame();
                        $('#sortable').empty();
                        $('.pageTab').hide();
                        $('.pageTab').find('a').removeClass('active');
                        $('#pageTab' + searchPageData[tab]).show();
                        $('ul.tabs').tabs('select_tab', 'tab' + searchPageData[tab]);
                        $('#searchPage').val('');
                    }
                }
            });

            return false;
        }

        return true;

    }
}



/*
save - icon-check - #8fd692 
Savinf Failed - icon-warning - #f3c241 
Yet to be saved - icon-notification-circle - #ff9109
Published - icon-cloud-check - #4caf50
Private - icon-cloud-lock - #4caf50
*/


function addDragableEvents(elemToAddEvents) {

    elemToAddEvents = elemToAddEvents || $("#sortable .ui-state-default");
    elemToAddEvents.draggable({
        revert: "invalid",
        cursor: 'move',
        // helper: "clone",
        containment: "#hpbDsgnrcnvsWrapper",
        scroll: false,
        cursorAt: {
            top: 56,
            left: 56
        },
    });
    elemToAddEvents.droppable({
        accept: "#sortable .ui-state-default,.collection-item:not('.noDataLi')",
        drop(event, ui) {
            isChangesMade = true;
            var dragged = ui.draggable;
            var droppped = $(this);
            var isDragFromMenu = false;
            var draggedWidgetCardIdx = dragged.data("cardidx");
            var droppedWidgetCardIdx = droppped.data('cardidx');
            var presTemplate = getTheTemplat();
            if (dragged.hasClass('collection-item')) {
                isDragFromMenu = true;
                dragged = ui.helper;
                draggedWidgetCardIdx = droppedWidgetCardIdx;
                dragged.data("isWidgetDropedInCanvas", true);
                dragged = $(dragged.getOuterHTML()).insertBefore(droppped).removeAttr('style').css('position', 'relative');
                addDragableEvents(dragged);
                rearrangePanelsBeforeDeleteNadd({
                    elem: dragged,
                    templateObj: presTemplate,
                    task: "add"
                });
            } else {
                if (draggedWidgetCardIdx > droppedWidgetCardIdx) {
                    dragged.insertBefore(droppped).removeAttr('style').css('position', 'relative');
                    droppped.insertAfter($("#sortable .ui-state-default:eq(" + draggedWidgetCardIdx + ")"));
                } else {
                    dragged.insertAfter(droppped).removeAttr('style').css('position', 'relative');
                    droppped.insertBefore($("#sortable .ui-state-default:eq(" + draggedWidgetCardIdx + ")"));
                }
            }

            changePanelLayout({
                templateObj: presTemplate,
                panel: dragged,
                toIdx: droppedWidgetCardIdx
            });
            if (!isDragFromMenu) {
                changePanelLayout({
                    templateObj: presTemplate,
                    panel: droppped,
                    toIdx: draggedWidgetCardIdx
                });
                var dropedChrtIdx = droppped.find(".cardContentData").data("highchartsChart");
                if (dropedChrtIdx != undefined)
                    Highcharts.charts[dropedChrtIdx].reflow()
            }

            var draggedChartIdx = dragged.find(".cardContentData").data("highchartsChart");
            if (draggedChartIdx != undefined)
                Highcharts.charts[draggedChartIdx].reflow()



            var elem = dragged;
            var id = elem.attr('id');
            var liTarget = id.substring(0, id.indexOf("Wrapper"));
            if (liTarget.indexOf("C__") == 0) {
                var targetLiElem = $("li.collection-item[data-target ^='" + liTarget + "']");
            } else {
                var targetLiElem = $("li.collection-item[data-target ='" + liTarget + "']");
            }

            if (targetLiElem.data("multiselect") !== false && liTarget.indexOf("C__") == 0) {
                //means custom widget
                var dataCount = targetLiElem.attr('data-count');
                if (elem.hasClass('isFirstTime')) {
                    if (!dataCount)
                        targetLiElem.addClass('createBadge').attr('data-count', 1);
                    else
                        targetLiElem.addClass('createBadge').attr('data-count', parseInt(dataCount) + 1);
                }
            } else {
                targetLiElem.draggable("disable").addClass('widgetCreated');
            }
            if (elem.hasClass('isFirstTime')) {
                elem.removeClass('isFirstTime');
                homeJsonObj.addInitialDataToJson(elem.attr('id'));
            }

            changeWidgetStatus("notSaved", id);
            homeJsonObj.updateDataInJson(id, "isU", "Y");
            changeStatusAfterDrag(dragged);
            changeStatusAfterDrag(droppped);

            function changeStatusAfterDrag(elem) {
                var presElem = elem;
                var presIndex = presElem.index();
                var presId = presElem.attr("id");
                changeWidgetStatus("notSaved", presId);
                homeJsonObj.updateDataInJson(presId, "isU", "Y");
                return !(presIndex === draggedWidgetCardIdx)
            }
        }
    });
}



function addNewHomePage() {
    if ($("#hpbPageRespSelector").is(":visible")) {
        const tabName = $("#newTabName").val();
        if (!testRegex("validName", tabName)) {
            showAlertDialog("warning", "Please enter a valid name.");
            return;
        } else if ($.inArray(tabName, allTabNames) !== -1) {
            showAlertDialog("warning", "Name already exists.");
            return;
        }

        if (!$("#addPageIsPrivate").is(":checked")) {

            if (typeof isPageBuilder !== "undefined" && isPageBuilder) {
                // let parentName = $("#treeWrapper").data("parentnodename");
                //need to have some validations on TREE
            } else {
                if ($("#multiselect_to option").length === 0) {
                    showAlertDialog("warning", "Please select atleast one responsibility.");
                    return;
                }
            }
        }
        $("#hpbPageRespSelector").hide();
        $("#hpbPageTemplateSelector").show();
    } else {
        callParentNew("loadFrame()","function");
        //parent.loadFrame();
        var selectdTemplate = $("#hpbPageTemplateSelector a.createTick").data('tmpid');
        var roles = "";
        let parentName = "";
        if (typeof isPageBuilder !== "undefined" && isPageBuilder) {
            parentName = $("#treeWrapper").data("parentnodename");
            //need to remove once desktop releases the version to define resp 
            roles = "default";
        } else {
            $("#multiselect_to option").each(function(index, el) {
                let presResp = $(this).val();
                roles += presResp + ",";
            });
            roles = roles.slice(0, -1);
        }

        const isPrivate = $("#addPageIsPrivate").is(":checked") ? "Y" : "N";
        const isDefault = $("#defaultHomePage").is(":checked") ? "Y" : "N";
        var tabName = $("#newTabName").val() || "Tab" + ($("#HPBtabsHaeder .pageTab").length + 1);
        ajaxCallObj.createNewTab({
            jsonData: {
                isDefault,
                "title": tabName,
                "tmp": selectdTemplate,
                "rty": roles,
                "ip": isPrivate,
                "pageMenu": parentName
            }
        })
    }
}



function updateTabDetailsInCache({ task, pageId, tabDetails }) {
    let cachedData = homeJsonObj.jsonContent.pageData[pageId];
    if (task === "new") {
        cachedData = homeJsonObj.jsonContent.pageData[pageId] = {};
        const cachedTabData = cachedData.tabData = [];
        const cachedTabMetaData = metaDataCacher.tabData;
        cachedTabData[cachedTabMetaData.PAGE_ID] = pageId;
        cachedTabData[cachedTabMetaData.IS_PRIVATE] = tabDetails.ip;
        cachedTabData[cachedTabMetaData.IS_PUBLISH] = "N";
        cachedTabData[cachedTabMetaData.PARENT_PAGE_ID] = null;
        cachedTabData[cachedTabMetaData.RESPONSIBILITY] = tabDetails.resp;
        cachedTabData[cachedTabMetaData.TEMPLATE] = tabDetails.template;
        cachedTabData[cachedTabMetaData.TITLE] = tabDetails.title;
        cachedTabData[cachedTabMetaData.IS_DEFAULT] = tabDetails.isDefault;
        cachedTabData[cachedTabMetaData.CREATED_BY] = mainUserName;
        cachedTabData[cachedTabMetaData.UPDATED_ON] = new Date();
        homeJsonObj.jsonContent.pageData[pageId].data = [];
    }
}

function checkIfPageExists() {
    if ($("#HPBtabsHaeder .pageTab a.active").length === 0) {
        showAlertDialog("warning", "Please add a page before adding widgets")
        return false;
    }
    return true;
}

function toggleToolBxInBuilder(task) {
    if (task === "hide") {
        //means its my tab
        $("#HPBdesignerCanvas").attr('class', 'col s12');
        $("#HPBToolBox,#createNewPageModalBtn,#publishDesign").hide();
    } else {
        $("#HPBdesignerCanvas").attr('class', 'col s10');
        $("#HPBToolBox,#createNewPageModalBtn,#publishDesign").show();
    }
}

function toggleMyPages(elem) {
    elem = $(elem);
    let task = "show"
    if (elem.hasClass('hidePages')) {
        task = "hide";
    }
    if (task === "show" ) {
        if (!$(".myPageTab").length) {
            return
        }
        elem.removeClass('showPages');
        elem.addClass('hidePages');
        elem.attr('title', 'Pages');
        $(".myPageTab").show();
        $(".pageTab:not('.myPageTab')").hide();
    } else {
        elem.removeClass('hidePages');
        elem.addClass('showPages');
        elem.attr('title', 'My home pages');
        $(".myPageTab").hide();
        $(".pageTab:not('.myPageTab')").show();
    }
    elem.find('span').toggleClass('icon-clipboard-user icon-clipboard-empty');
    $("#HPBtabsHaeder .pageTab:visible a:first").addClass('firstClick').click();
}

/**
 * When a widget is clicked then property sheet will be opened then will get selected widget id or else ""(EMPTY)
 * @author ManiKanta
 * @Date   2018-10-05T12:40:06+0530
 * @return {String}                 empty/id
 */
function getActiveWidgetId() {
    let targetId = "";
    if ($("#propertySheet").hasClass('scale-in')) {
        targetId = $("#propertySheet").data('target');
    }

    return targetId;
}

/**
 * To open create extrmodel but to pass the metaData to that function this is a intermediate function
 * @author ManiKanta
 * @Date   2018-10-05T15:45:15+0530
 * @return {}                 
 */
function openSQLcolumnProps() {
    const widgetId = getActiveWidgetId();
    const metaData = querymetaDataInfo[widgetId];
    createExtraModel({ type: 'col', metaData });
}

/**
 * When SQL is added or updated in SQL widget then need to add initial column props for the result metaData
 * @author ManiKanta
 * @Date   2018-10-08T11:25:47+0530
 * @param  {String}                 options.widgetId   ID of the widget
 * @param  {String}                 options.calledFrom From where its called for any conditions in future
 * @param  {Object/Array}           options.metaData   metaInfo of the QUERY
 */
function addInitialColumnPropsForTheWidget({ widgetId, calledFrom, metaData = [] }) {
    const columnInfo = {};
    metaData.forEach((column, idx) => {
        const columnName = column.name.toLowerCase();
        let dataType = column.type;
        if (dataType === "N") {
            dataType = "Numeric";
        } else if (dataType === "D") {
            dataType = "Date/Time"
        } else {
            dataType = "Character";
        }
        columnInfo[columnName] = {
            "name": columnName,
            "caption": columnName,
            "dtype": dataType,
            "ordno": (idx + 1),
            "width": "80",
            "decimal": "0",
            "align": "Left",
            "rtotal": "F",
            "disptotal": "F",
            "applycomma": "F",
            "norepeat": "F",
            "zerooff": "F",
            "hidden": "F",
            "font": "",
            "color": "",
            "defcolor": "T",
            "dblclick": "",
            "cf": [{
                "expr": "",
                "style": ""
            }]
        }
    });

    homeJsonObj.jsonContent.jsonData[widgetId].cols = columnInfo;

}
