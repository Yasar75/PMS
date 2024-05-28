var tstruct = new Object();
var clickedArray = [];
var gridArray = [];
var clickedArrayIndex = [];
var dcid = "";
var griddcid = "";
var dcNo = "";
var min = 1;
var max = 999999;
var randomNumberRow = [];
var checker = false;
var minWidthForGridHeaders = 40;
var adjustWidth = 20;
var isNotsequence = false;
var tableArray = [];
var isGridElementsAlligned = true;
var designChanged = false;
$(document).ready(function () {
    //LoadFunctionsOnLoad();
    //$('div.GridHelpdiv').remove();
    BindFunctionsOnLoad();
    BindButtonsOnLoad();
    unBindEvents();

    checkSuccessAxpertMsg();
    jQuery.browser = {};
    (function () {
        jQuery.browser.msie = false;
        jQuery.browser.version = 0;
        if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
            jQuery.browser.msie = true;
            jQuery.browser.version = RegExp.$1;
        }
    })();
    SetGridElementsHeight();
});


function unBindEvents() {
    $("#wBdr").find('input:not(.grdButtons .tgl-ios),textarea').each(function () {
        $(this).prop('disabled', true);
        if ($(this).filter('.form-control').is(':disabled')) {
            $(this).after('<div style="position:absolute; left:0; right:0; top:0; bottom:0;z-index:9"></div>')
        }
    })
    $("#wBdr").find('select').each(function () {
        $(this).parent().prepend('<div class="selectOverLay"></div>');
        $(this).prop('disabled', true);
    })
    $("[id^=wrapperForEditFields]").removeClass("hide");
    $("button[id^=gridAddBtn]").removeAttr("onclick").addClass('disabled');
    $(".grdButtons button[id^=gridAddBtn]").removeAttr("onclick").addClass('disabled');
    //$(".grdButtons .dropdown button").removeAttr("data-toggle").addClass('disabled');
    $("li[onclick*='javascript:FillGrid']").removeAttr("onclick").addClass('disabled');
    $(".grdButtons li button").addClass('disabled').prop('disabled', true);
    $(".editLayoutFooter button").removeAttr("onclick").addClass('disabled').prop('disabled', true).attr('type', 'button');

    //For toolbardiv icons making them disable
    $('.toolbardiv').addClass('disableToolIcon');
    $('#dvlayout [title]:not([class^="icon-basic-eye"])').removeAttr('title');
    $(".editLayoutFooter").hide();
}

function hideTheField() {
    if ($("#hideTheField").hasClass('disableToolIcon'))
        return;
    designChanged = true;
    for (var i = 0; i < clickedArray.length; i++) {
        $(clickedArray[i]).attr("data-isVisible", "false").data("isVisible", "false");
    }

    ClearSelected();
}

function showTheField() {
    if ($("#showTheField").hasClass('disableToolIcon'))
        return;
    designChanged = true;
    for (var i = 0; i < clickedArray.length; i++) {
        $(clickedArray[i]).attr("data-isVisible", "true").data("isVisible", "true");
    }

    ClearSelected();
}

function BindButtonsOnLoad() {
    $("#btnAlignOne").click(function () {
        if ($("#btnAlignOne").hasClass('disableToolIcon'))
            return;
        AlignOne();
    });

    $("#btnAlignMerge").click(function () {
        if ($("#btnAlignMerge").hasClass('disableToolIcon'))
            return;
        //checking if the elements selected are from editlayout of grid
        var isEditLayoutElements = true;
        for (i = 0; i < clickedArray.length; i++) {
            !($(clickedArray[i]).hasClass('gridElement')) ? isEditLayoutElements = false : "";
        }
        isEditLayoutElements ? alignGridElements() : AlignMerge();
    });


}
function BindFunctionsOnLoad() {

    $('#dvlayout').on('click', function (event) {
        if (designChanged == true)
            $("#A5").removeClass('disableToolIcon');
        if ($(event.target).closest("div[id^='colScroll']").length === 0) {
            // hide menu here
            ClearSelected();
        }

    });

    $('#tstructcontent').find('input, textarea, button, select').attr('disabled', 'disabled');
    $('.form-group').find('input,textarea,select').css("disabled", true);

    $('.form-group > *').css('width', '100% !important');
    $('.form-group').on('click', function (event) {
        OnElementSelect(this, event);
        enableToolIcons();
    });
    $(".gridHeader th").on('click', function (event) {
        OnGridElementSelect(this, event);
        enableToolIcons();

    });

    $("table[id^='gridHd'] tbody").on('click', function (event) {
        OnTableSelect(this, event);
        enableToolIcons();
    });
}

//function LoadFunctionsOnLoad() {
//    //CreateObjectsForDcs();
//}

function ClearSelected() {
    for (var i = 0; i < clickedArray.length; i++) {
        if (clickedArray[i].id == undefined)
            $("#" + clickedArray[i]).css("outline", "none");
        else
            clickedArray[i].style.outline = "none";
    }

    for (var j = 0; j < gridArray.length; j++) {
        if (gridArray[j].id == undefined)
            $("#" + gridArray[j]).css("border", "none");
        else {
            gridArray[j].style.border = "none";
            $(gridArray[j]).css('border-right', '1px solid white');
        }
    }

    for (var j = 0; j < tableArray.length; j++) {
        if (tableArray[j] != "")
            $("#" + tableArray[j] + " tbody").css("border", "none");
    }

    tableArray = [];
    gridArray = [];
    clickedArray = [];
    clickedArrayIndex = [];
    $('.toolbardiv').addClass('disableToolIcon');
    if (designChanged == true)
        $("#A5").removeClass('disableToolIcon');
}

function OnElementSelect(elem, event) {
    if (gridArray.length > 0) {
        ClearSelected();
    }
    var clickedObject = elem;
    dcid = elem.parentElement.id;

    if (dcid == "" && elem.parentElement.className == "containerDc") {
        dcid = elem.parentElement.parentNode.id;
    }
    dcNo = dcid.replace('divDc', '');
    for (var i = 0; i < clickedArray.length; i++) {
        if (clickedArray[i].id == clickedObject.id) {
            clickedArray[i].style.outline = "none";
            clickedArray.splice(i, 1);
            event.stopPropagation();
            break;
        }
    }


    if (event.ctrlKey) {
        clickedObject.style.outline = "1px red solid";
        clickedArray.push(clickedObject);
    }
    else {
        for (var i = 0; i < clickedArray.length; i++)
            clickedArray[i].style.outline = "none";

        clickedObject.style.outline = "1px red solid";
        clickedArray = [];
        clickedArray.push(clickedObject);
    }

     if ($("#propertySheet").hasClass("scale-in")) {
         $("#propertySheet").addClass("scale-out");
     }
    event.stopPropagation();
}

function AlignThree() {
    if (clickedArray.length === 3) {
        var prevElemId = findPreviousElement(clickedArray[0]);
        var createdDivID = GenerateDiv(prevElemId);
        for (var i = 0; i < clickedArray.length; i++) {
            clickedArray[i].style.outline = "none";
            var classList = $(clickedArray[i]).attr('class').split(/\s+/);
            $.each(classList, function (index, item) {
                if (item.indexOf('col-lg-') > -1) {
                    $(clickedArray[i]).removeClass(item);
                    $(clickedArray[i]).addClass("col-lg-4");
                }
                else if (item.indexOf('col-md-') > -1) {
                    $(clickedArray[i]).removeClass(item);
                    $(clickedArray[i]).addClass("col-md-4");
                }
                else if (item.indexOf('col-sm-') > -1) {
                    $(clickedArray[i]).removeClass(item);
                    $(clickedArray[i]).addClass("col-sm-4");
                }
                else if (item.indexOf('col-xs-') > -1) {
                    $(clickedArray[i]).removeClass(item);
                    $(clickedArray[i]).addClass("col-xs-12");
                }
            });
            var detached = $(clickedArray[i]).detach();
            $('#' + createdDivID).append(detached);
        }
    } else {
        showAlertDialog("warning", 2045, "client");
    }
    detached = [];
    ClearSelected();
}


function SetSingleColumn() {
    var arrayOfIds = [];
    checker = false;
    $('.form-group').each(function () {
        arrayOfIds.push(this.id);
    });

    if (arrayOfIds.length > 0) {
        for (var i = 0; i < arrayOfIds.length; i++) {

            if ($("#" + arrayOfIds).hasClass('col-lg-6') || $("#" + arrayOfIds).hasClass('col-lg-4'))
                checker = true;
        }
    }
    var grapDivs = $('div[class|="grap"]');

}

function AlignMerge() {
    if (clickedArray.length > 0 && gridArray.length > 0 || gridArray.length > 0 && tableArray.length > 0 || tableArray.length > 0 && clickedArray.length > 0) {
        showAlertDialog("warning", 2046, "client");
        ClearSelected();
        return;

    }

    if (clickedArray.length === 2) {
        clickedArray = SortBasedOnParent(clickedArray);
        if (isNotsequence) {
            showAlertDialog("warning", 2047, "client");
            isNotsequence = false;
            ClearSelected();
            return;
        }
        designChanged = true;
        $("#A5").removeClass('disableToolIcon');
        for (var i = 0; i < clickedArray.length - 1; i++) {
            $("#" + clickedArray[i]).parent().removeClass("row");
            $("#" + clickedArray[i]).parent().addClass("rowdesign");

        }
        for (var i = 0; i < clickedArray.length; i++) {
            // clickedArray[i].style.outline = "none";
            $("#" + clickedArray[i].id).css("outline", "none");

            var clsText = $("#" + clickedArray[i]).attr('class');
            var classList = clsText.split(/\s+/);

            $.each(classList, function (index, item) {
                if (item.indexOf('col-lg-') > -1) {
                    $("#" + clickedArray[i]).removeClass(item);
                    $("#" + clickedArray[i]).addClass("col-lg-6");
                }
                else if (item.indexOf('col-sm-') > -1) {
                    $("#" + clickedArray[i]).removeClass(item);
                    $("#" + clickedArray[i]).addClass("col-sm-6");
                }
                else if (item.indexOf('col-md-') > -1) {
                    $("#" + clickedArray[i]).removeClass(item);
                    $("#" + clickedArray[i]).addClass("col-md-6");
                }
                else if (item.indexOf('col-xs-') > -1) {
                    $("#" + clickedArray[i]).removeClass(item);
                    $("#" + clickedArray[i]).addClass("col-xs-12");
                }
            });
        }
    }
    else if (clickedArray.length === 3) {
        clickedArray = SortBasedOnParent(clickedArray);
        if (isNotsequence) {
            showAlertDialog("warning", 2047, "client");
            isNotsequence = false;
            ClearSelected();
            return;
        }
        designChanged = true;
        $("#A5").removeClass('disableToolIcon');
        for (var i = 0; i < clickedArray.length - 1; i++) {
            $("#" + clickedArray[i]).parent().removeClass("row");
            $("#" + clickedArray[i]).parent().addClass("rowdesign");
        }

        for (var i = 0; i < clickedArray.length; i++) {
            $("#" + clickedArray[i].id).css("outline", "none");

            var clsText = $("#" + clickedArray[i]).attr('class');
            var classList = clsText.split(/\s+/);
            $.each(classList, function (index, item) {
                if (item.indexOf('col-lg-') > -1) {
                    $("#" + clickedArray[i]).removeClass(item);
                    $("#" + clickedArray[i]).addClass("col-lg-4");
                }
                else if (item.indexOf('col-md-') > -1) {
                    $("#" + clickedArray[i]).removeClass(item);
                    $("#" + clickedArray[i]).addClass("col-md-4");
                }
                else if (item.indexOf('col-sm-') > -1) {
                    $("#" + clickedArray[i]).removeClass(item);
                    $("#" + clickedArray[i]).addClass("col-sm-4");
                }
                else if (item.indexOf('col-xs-') > -1) {
                    $("#" + clickedArray[i]).removeClass(item);
                    $("#" + clickedArray[i]).addClass("col-xs-12");
                }
            });

        }
    }
    else {
        showAlertDialog("warning", 2048, "client");
    }

    detached = [];
    ClearSelected();
}

function alignGridElements() {
    if (clickedArray.length > 3 || clickedArray.length <= 1) {
        showAlertDialog("warning", 2048, "client");
    } else {
        //checking if the elements are in order or not
        checkGridAlignment()
        if (isGridElementsAlligned) {
            designChanged = true;
            $("#A5").removeClass('disableToolIcon');
            //alert('Selected Properly')
            if (clickedArray.length === 3) {


                for (var i = 0; i < clickedArray.length; i++) {
                    $("#" + clickedArray[i].id).css("outline", "none");

                    var clsText = $("#" + clickedArray[i].id).attr('class');
                    var classList = clsText.split(/\s+/);
                    $.each(classList, function (index, item) {
                        if (item.indexOf('col-lg-') > -1) {
                            $("#" + clickedArray[i].id).removeClass(item);
                            $("#" + clickedArray[i].id).addClass("col-lg-4");
                        }
                        else if (item.indexOf('col-md-') > -1) {
                            $("#" + clickedArray[i].id).removeClass(item);
                            $("#" + clickedArray[i].id).addClass("col-md-4");
                        }
                        else if (item.indexOf('col-sm-') > -1) {
                            $("#" + clickedArray[i].id).removeClass(item);
                            $("#" + clickedArray[i].id).addClass("col-sm-4");
                        }
                        else if (item.indexOf('col-xs-') > -1) {
                            $("#" + clickedArray[i].id).removeClass(item);
                            $("#" + clickedArray[i].id).addClass("col-xs-12");
                        }
                    });

                }
            }
            if (clickedArray.length === 2) {

                for (var i = 0; i < clickedArray.length; i++) {
                    // clickedArray[i].style.outline = "none";
                    $("#" + clickedArray[i].id).css("outline", "none");

                    var clsText = $("#" + clickedArray[i].id).attr('class');
                    var classList = clsText.split(/\s+/);

                    $.each(classList, function (index, item) {
                        if (item.indexOf('col-lg-') > -1) {
                            $("#" + clickedArray[i].id).removeClass(item);
                            $("#" + clickedArray[i].id).addClass("col-lg-6");
                        }
                        else if (item.indexOf('col-sm-') > -1) {
                            $("#" + clickedArray[i].id).removeClass(item);
                            $("#" + clickedArray[i].id).addClass("col-sm-6");
                        }
                        else if (item.indexOf('col-md-') > -1) {
                            $("#" + clickedArray[i].id).removeClass(item);
                            $("#" + clickedArray[i].id).addClass("col-md-6");
                        }
                        else if (item.indexOf('col-xs-') > -1) {
                            $("#" + clickedArray[i].id).removeClass(item);
                            $("#" + clickedArray[i].id).addClass("col-xs-12");
                        }
                    });
                }
            }

        } else {
            showAlertDialog("warning", 2047, "client");

        }

        //$("#sp2R001F2").children().eq(3)
    }
    isGridElementsAlligned = true;
    ClearSelected();
}

function checkGridAlignment(lastSelectedElemnt) {

    if (lastSelectedElemnt == undefined) {
        lastSelectedElemnt = 1;
        clickedArrayIndex = [];
        for (i = 0; i < clickedArray.length; i++) {
            clickedArrayIndex.push(parseInt($(clickedArray[i]).index()));
        }
        clickedArrayIndex.sort(sortTheNumbers);
    }
    var isElementsAlligned = true;
    //var firstElement = clickedArray[lastSelectedElemnt - 1];
    //var secondElemnt = clickedArray[lastSelectedElemnt];
    var firstIndex = clickedArrayIndex[lastSelectedElemnt - 1];
    var secondIndex = clickedArrayIndex[lastSelectedElemnt];
    var minIndex = Math.min(firstIndex, secondIndex);
    var maxIndex = Math.max(firstIndex, secondIndex);
    var parentId = $(clickedArray[0]).parent().attr('id');
    for (i = minIndex + 1 ; i < maxIndex; i++) {
        if ($("#" + parentId).children().eq(i).is(':visible'))
            isElementsAlligned = false;
    }
    if (isElementsAlligned == false)
        isGridElementsAlligned = false;
    else if (isElementsAlligned && (lastSelectedElemnt + 1) < clickedArray.length)
        checkGridAlignment(lastSelectedElemnt + 1);
    else if (isElementsAlligned)
        isGridElementsAlligned = true;
}

function sortTheNumbers(a, b) {
    var aName = a;
    var bName = b;
    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
}

function AlignOne() {
    if (clickedArray.length > 0 && gridArray.length > 0 || gridArray.length > 0 && tableArray.length > 0 || tableArray.length > 0 && clickedArray.length > 0) {
        showAlertDialog("warning", 2046, "client");
        ClearSelected();
        return;

    }
    if (clickedArray.length === 1) {
        var prevparent = "#randomID_" + (parseInt($("#" + clickedArray[0].id)[0].parentNode.id.split('_')[1]) - 1);
        if ($(prevparent) != undefined) {
            $(prevparent).removeClass("rowdesign");
            $(prevparent).addClass("row");
        }
        for (var i = 0; i < clickedArray.length; i++) {
            clickedArray[i].style.outline = "none";
            var classList = $(clickedArray[i]).attr('class').split(/\s+/);
            $.each(classList, function (index, item) {
                if (item.indexOf('col-lg-') > -1) {
                    $(clickedArray[i]).removeClass(item);
                    $(clickedArray[i]).addClass("col-lg-12");
                }
                else if (item.indexOf('col-sm-') > -1) {
                    $(clickedArray[i]).removeClass(item);
                    $(clickedArray[i]).addClass("col-sm-12");
                }
                else if (item.indexOf('col-md-') > -1) {
                    $(clickedArray[i]).removeClass(item);
                    $(clickedArray[i]).addClass("col-md-12");
                }
                else if (item.indexOf('col-xs-') > -1) {
                    $(clickedArray[i]).removeClass(item);
                    $(clickedArray[i]).addClass("col-xs-12");
                }
            });

        }
        designChanged = true;
        $("#A5").removeClass('disableToolIcon');
    } else {
        showAlertDialog("warning", 2049, "client");

    }
    ClearSelected();
}

var elemID = "";
function findPreviousElement(elem) {
    var prevelem = $(elem).prev();

    if (prevelem.css("display") == "none") {
        findPreviousElement(prevelem);
    }
    else {
        if (prevelem.length == 0) {
            elemID = dcid;
        }
        else {
            elemID = prevelem[0].id;
        }
    }

    return elemID;
}




function GenerateDiv(prevElement) {
    var randomDivID = "randomID" + getRandomIntInclusive();
    for (var i = 0; i < randomNumberRow.length; i++) {
        if (randomDivID === randomNumberRow[i]) {
            GenerateDiv();
        }
    }
    CreateDiv(randomDivID, prevElement);

    return randomDivID;
}

function CreateDiv(id, prevElement) {
    if ($('#' + prevElement).parent().length > -1 && $('#' + prevElement).parent()[0] != null && $('#' + prevElement).parent()[0].id.indexOf('randomID') > -1) {
        prevElement = $('#' + prevElement).parent()[0].id;
    }
    if (prevElement.indexOf("divDc") > -1) {
        $("<div/>", {
            "class": "row",
            "id": id
        })
.prependTo("#" + prevElement);

    }
    else {
        $("<div/>", {
            "class": "row",
            "id": id
        })
    .insertAfter("#" + prevElement);
    }
    randomNumberRow.push(id);
}


function getRandomIntInclusive() {
    return Math.floor(Math.random() * (999999));
}




//Create Object for DCs
//function CreateObjectsForDcs() {
//    tstruct.Dcs = new Array();
//    for (var i = 1 ; i < TotalDCs + 1; i++) {
//        var dc = new Object();
//        dc.id = i;
//        dc.Flds = new Array();
//        tstruct.Dcs.push(dc);
//    }
//    return tstruct;
//}



//function AddandLogStyles() {
//    dc = new array();
//    for (var i = 0; i < tstruct.Dcs.length; i++) {
//        if (tstruct.Dcs[i].id == dcNo) {
//            dc = tstruct.Dcs[i];
//            break;
//        }
//    }
//}

//function to get all the elements which has changed
function saveAsJson() {
    if ($("#A5").hasClass('disableToolIcon'))
        return;
    tstruct.dcs = [];
    tstruct.tstructName = tstructName;
    tstruct.tstructCaption = tstructCaption;
    if (parseInt(TotalDCs) > 0) {
        for (var i = 1; i < parseInt(TotalDCs) + 1; i++) {
            var container = $('#divDc' + i)[0];
            if (container != undefined) {
                var dc = new Object();
                dc.id = 'divDc' + i;
                dc.elements = [];
                dc.elements.push(CreateControlObjects(container));
                tstruct.dcs.push(dc);
            }
        }
        //checking for the compressed mode of tstruct
        var compressedMode = $("#ckbCompressedMode").prop('checked');
        tstruct.cpMode = compressedMode;
        var jsonText = JSON.stringify(tstruct);
        SaveJsonToSession(jsonText);
    }
}


function SaveJsonToSession(jsonText) {
    $('#hdnDesign').val(jsonText);
    SetSingleColumn();
    if (checker == false)
        $('#hdnLayout').val("onecolumn");
    $('#btnSave').click();
}

function CreateControlObjects(container) {
    var elements = [];
    var arr;
    //checking if its grid container
    //if ($(container).find('.editWrapTr').length > 0) {
    //    container = $(container).find('.editWrapTr')[0];
    //}
    if (container.childElementCount != undefined) {
        arr = container;
    }
    else {
        arr = container[0];
    }
    for (var j = 0; j < arr.childElementCount; j++) {
        var currentChild = $(arr).children().eq(j);
        if (currentChild.css("display") == "none")
            continue;

        var ele = new Object();
        ele.index = j;
        ele.id = currentChild.attr('id');
        ele.classes = currentChild.attr("class");
        if (typeof ele.classes != "undefined" && ele.classes.indexOf("griddivColumn wrapperForGridData") == 0) {
            ele.gridStretch = $("#ckbGridStretch" + ele.classes.substr(32)).prop('checked');
            currentChild.find(".hiddenTableColumn").removeClass("hiddenTableColumn");
        }
        if (ele.id != "containerDc" && ele.classes === undefined)
            continue;
        if (ele.classes == "row" || ele.classes == "rowdesign" || ele.id == "containerDc") {
            ele.elements = [];
            ele.elements.push(CreateControlObjects(currentChild));
        }
        else if (ele.classes.indexOf("griddivColumn") != -1) {
            ele.elements = [];

            var Cols = [];
            if ($("#" + ele.id) != undefined)
                Cols = $("#" + ele.id + " th");
            var hiddenColWidth = 0;
            for (var i = 0; i < Cols.length; i++) {

                if (Cols[i] != undefined && Cols[i].id != "") {
                    if ($("#" + Cols[i].id).css("display") != "none") {
                        var gridField = new Object();
                        gridField.id = Cols[i].id;
                        gridField.width = $("#" + Cols[i].id).css("width");

                        if ($("#" + Cols[i].id).find('button.eyeBtn i').length > 0) {
                            $("#" + Cols[i].id).find('button.eyeBtn i').hasClass('icon-basic-eye') ? (gridField.visibility = 'table-cell') : (gridField.visibility = 'none', hiddenColWidth += parseInt(gridField.width, 10));
                        } else {
                            gridField.visibility = 'table-cell';
                        }

                        ele.elements.push(gridField);
                    }
                }
            }
            if ($("#" + ele.id).children("table").attr("id") != undefined) {
                if (typeof $("#" + ele.id).children("table").css("width") != "undefined") {
                    var tableWidth = parseInt($("#" + ele.id).children("table").css("width"), 10);
                    $("#" + ele.id).children("table").css("width", (tableWidth - hiddenColWidth) + "px");
                    var tableMinWidth = parseInt($("#" + ele.id).children("table").css("min-width"), 10);
                    $("#" + ele.id).children("table").css("min-width", (tableMinWidth - hiddenColWidth) + "px");
                }
                ele.tableid = $("#" + ele.id).children("table").attr("id");
                ele.tablecss = $("#" + ele.id).children("table").attr("style");
                ele.tbodyHeight = $("#" + ele.id).children("table").find('tbody').css("min-height");
            }
        }

        else if (ele.classes == "grid-icons") {
            //means its in edit layout

            ele.elements = [];
            if (currentChild.find('.editWrapTr').length > 0) {
                var editLayoutWrapperId = currentChild.find('.editWrapTr').parent().attr('id');

                ele.gridWrapperId = editLayoutWrapperId;
                var editElemets = $("#" + editLayoutWrapperId + " .editWrapTr .gridElement.form-group");

                for (var i = 0; i < editElemets.length; i++) {
                    if (editElemets[i] != undefined && editElemets[i].id != "" && $("#" + editElemets[i].id).find('input:not(.grdAttach),select,checkbox,span.fa-paperclip').attr("type") != "hidden") {
                        var editField = new Object();
                        var editFldId = editElemets[i].id;
                        var isFieldvisble = $("#" + editFldId).data("isvisible");
                        isFieldvisble === undefined ? isFieldvisble = "true" : isFieldvisble = isFieldvisble.toString();
                        editField.id = editFldId;
                        editField.classes = $("#" + editFldId).attr("class");
                        editField.isVisible = isFieldvisble;
                        ele.elements.push(editField);
                    }

                }
            }
        }
        //else if (ele.classes == "divGridContent") {
        //    ele.height = $("#" + ele.id).css("height");
        //    if (parseInt($("#" + ele.id).css("width").replace("px", "")) <= $j("#wBdr").width())
        //        ele.width = parseInt($("#" + ele.id).css("width")) + 5;
        //    if ($("#" + ele.id).children("table").attr("id") != undefined) {
        //        ele.tableid = $("#" + ele.id).children("table").attr("id");
        //        // ele.tablecss = $("#" + ele.id).children("table").attr("style");
        //    }
        //}
        if (!currentChild.hasClass('clear') && currentChild[0].lastChild.rows != undefined)
            ele.rows = currentChild[0].lastChild.rows;
        else if ($(currentChild[0]).children(".divImgBorder").children(".axpImg").length > 0) {
            ele.height = $(currentChild[0]).children(".divImgBorder").children(".axpImg").css("height");
        }

        if (ele.classes != "clear" && ele.classes != "grdButtons" && ele.classes != "divGridContent")//
            elements.push(ele);
    }
    return elements;
}


//function CreatGridControlObject(griddc) {
//    var Cols = [];
//    if ($("#gridHd" + griddc) != undefined)
//        Cols = $("#gridHd" + griddc + " th");
//    var tableobj = new Object();
//    tableobj.id = "gridHd" + griddc;
//    tableobj.elements = [];

//    for (var i = 0; i < Cols.length; i++) {

//        if (Cols[i] != undefined && Cols[i].id != "") {
//            if ($("#" + Cols[i].id).css("display") != "none") {
//                var gridField = new Object();
//                gridField.id = Cols[i].id;
//                gridField.width = $("#" + Cols[i].id).css("width");
//                tableobj.elements.push(gridField);
//            }
//        }
//    }


//    return tableobj;
//}





function IncreaseHeight() {
    if ($("#A3").hasClass('disableToolIcon'))
        return;
    if (clickedArray.length > 0 && gridArray.length > 0 || gridArray.length > 0 && tableArray.length > 0 || tableArray.length > 0 && clickedArray.length > 0) {
        showAlertDialog("warning", 2046, "client");
        ClearSelected();
        return;

    }
    if (clickedArray.length > 0) {

        for (var i = 0; i < clickedArray.length; i++) {
            //clickedArray[i].style.outline = "none";
            if ((clickedArray[i]).lastChild.localName == "textarea") {
                var rows = parseInt(clickedArray[i].lastChild.rows)
                clickedArray[i].lastChild.rows = rows + 1;
            }
            else if ($(clickedArray[i]).find(".axpImg")) {
                var height = parseInt($(clickedArray[i]).find(".axpImg").css("height").replace("px", ""));
                $(clickedArray[i]).find(".axpImg").css("height", (height + adjustWidth));

            }

        }
        designChanged = true;
        $("#A5").removeClass('disableToolIcon');

    }

    else if (tableArray.length > 0) {

        for (var i = 0; i < tableArray.length; i++) {
            if ($("#" + tableArray[i] + " tbody") != undefined) {
                $("#" + tableArray[i] + " tbody").css("min-height", (parseInt($("#" + tableArray[i] + " tbody").css("height")) + adjustWidth));

            }
        }
        designChanged = true;
        $("#A5").removeClass('disableToolIcon');
    }
    else {
        showAlertDialog("warning", 2050, "client");
    }
}

function DecreaseHeight() {
    if ($("#A4").hasClass('disableToolIcon'))
        return;
    if (clickedArray.length > 0 && gridArray.length > 0 || gridArray.length > 0 && tableArray.length > 0 || tableArray.length > 0 && clickedArray.length > 0) {
        showAlertDialog("warning", 2046, "client");
        ClearSelected();
        return;

    }
    if (clickedArray.length > 0) {
        for (var i = 0; i < clickedArray.length; i++) {
            //clickedArray[i].style.outline = "none";
            if ((clickedArray[i]).lastChild.localName == "textarea") {
                var rows = parseInt(clickedArray[i].lastChild.rows)
                if (rows != 1)
                    clickedArray[i].lastChild.rows = rows - 1;
            }
            else if ($(clickedArray[i]).find(".axpImg")) {
                var height = parseInt($(clickedArray[i]).find(".axpImg").css("height").replace("px", ""));
                $(clickedArray[i]).find(".axpImg").css("height", (height - adjustWidth));

            }

        }
        designChanged = true;
        $("#A5").removeClass('disableToolIcon');
    } else if (tableArray.length > 0) {
        for (var i = 0; i < tableArray.length; i++) {
            if ($("#" + tableArray[i] + " tbody") != undefined) {
                $("#" + tableArray[i] + " tbody").css("min-height", (parseInt($("#" + tableArray[i] + " tbody").css("height")) - adjustWidth));

            }
        }
        designChanged = true;
        $("#A5").removeClass('disableToolIcon');
    }
    else {
        showAlertDialog("warning", 2050, "client");
    }
}

function IncreaseWidth() {
    if ($("#increaseWidth").hasClass('disableToolIcon'))
        return;
    if (clickedArray.length > 0 && gridArray.length > 0 || gridArray.length > 0 && tableArray.length > 0 || tableArray.length > 0 && clickedArray.length > 0) {
        showAlertDialog("warning", 2046, "client");
        ClearSelected();
        return;

    }
    if (clickedArray.length > 0) {

        for (var i = 0; i < clickedArray.length; i++) {
            var classList = $(clickedArray[i]).attr('class').split(/\s+/);
            $.each(classList, function (index, item) {
                if (item.indexOf('col-lg-') > -1) {
                    var incrsdcls = parseInt(item.substring(item.lastIndexOf('-') + 1));
                    $(clickedArray[i]).removeClass(item);
                    if (incrsdcls < 12)
                        $(clickedArray[i]).addClass("col-lg-" + (incrsdcls + 1));
                    else
                        $(clickedArray[i]).addClass("col-lg-12");
                }
                else if (item.indexOf('col-sm-') > -1) {
                    var incrsdcls = parseInt(item.substring(item.lastIndexOf('-') + 1));
                    $(clickedArray[i]).removeClass(item);
                    if (incrsdcls < 12)
                        $(clickedArray[i]).addClass("col-sm-" + (incrsdcls + 1));
                    else
                        $(clickedArray[i]).addClass("col-sm-12");
                }
                else if (item.indexOf('col-md-') > -1) {
                    var incrsdcls = parseInt(item.substring(item.lastIndexOf('-') + 1));
                    $(clickedArray[i]).removeClass(item);
                    if (incrsdcls < 12)
                        $(clickedArray[i]).addClass("col-md-" + (incrsdcls + 1));
                    else
                        $(clickedArray[i]).addClass("col-md-12");
                }
                else if (item.indexOf('col-xs-') > -1) {
                    var incrsdcls = parseInt(item.substring(item.lastIndexOf('-') + 1));
                    $(clickedArray[i]).removeClass(item);
                    if (incrsdcls < 12)
                        $(clickedArray[i]).addClass("col-xs-" + (incrsdcls + 1));
                    else
                        $(clickedArray[i]).addClass("col-xs-12");
                }
            });

        }
        designChanged = true;
        $("#A5").removeClass('disableToolIcon');
    }
    else if (gridArray.length > 0) {

        for (var i = 0; i < gridArray.length; i++) {
            var gridcolid = $(gridArray[i]);
            var tableid = $("#" + gridArray[i].id).closest("table").attr("id");

            if (tableid.indexOf("gridHd") == 0) {
                var dcNo = tableid.substring(6);
                if ($("#ckbGridStretch" + dcNo).prop("checked") == true) {
                    $("#ckbGridStretch" + dcNo).prop("checked", false);
                    toggleGridStretch(dcNo);
                }
            }

            if (gridcolid != undefined && tableid != undefined) {
                var dcNum = tableid.substring(6);
                var colwidth = $(gridArray[i]).css("width").replace("px", "");

                if (griddcid != undefined) {
                    var theadWidth = parseInt($("#" + tableid).css("width").replace("px", "")) + adjustWidth;
                    $("#" + tableid).attr("style", "width:" + theadWidth + "px");
                    $(gridArray[i]).css({ "width": (parseInt(colwidth) + adjustWidth), "min-width": (parseInt(colwidth) + adjustWidth) });

                    var inputelement = $("#" + gridArray[i].id.replace("th-", "") + "001F" + griddcid);
                    var tdobj = inputelement.closest("td");
                    if ($("#contentScroll" + dcNum) != undefined) {
                        if (theadWidth < $("#wBdr").width()) {
                            $("#contentScroll" + dcNum).css({ "width": (theadWidth), "min-width": (theadWidth) });
                        }
                        else {
                            $("#contentScroll" + dcNum).css({ "width": (parseInt($("#wBdr").width()) - 40), "min-width": (parseInt($("#wBdr").width()) - 40) });
                        }
                    }
                    tdobj.css("width", (parseInt(colwidth) + adjustWidth));

                    AssignGrdFreezeHdrScript(dcNum);
                }
            }

        }
        designChanged = true;
        $("#A5").removeClass('disableToolIcon');
    }
    else {
        showAlertDialog("warning", 2050, "client");
    }



}

function DecreaseWidth() {
    if ($("#A2").hasClass('disableToolIcon'))
        return;
    if (clickedArray.length > 0 && gridArray.length > 0 || gridArray.length > 0 && tableArray.length > 0 || tableArray.length > 0 && clickedArray.length > 0) {
        showAlertDialog("warning", 2046, "client");
        ClearSelected();
        return;

    }
    if (clickedArray.length > 0) {
        designChanged = true;
        $("#A5").removeClass('disableToolIcon');
        for (var i = 0; i < clickedArray.length; i++) {

            var classList = $(clickedArray[i]).attr('class').split(/\s+/);
            $.each(classList, function (index, item) {
                if (item.indexOf('col-lg-') > -1) {
                    var incrsdcls = parseInt(item.substring(item.lastIndexOf('-') + 1));
                    $(clickedArray[i]).removeClass(item);
                    if (incrsdcls > 1)
                        $(clickedArray[i]).addClass("col-lg-" + (incrsdcls - 1));
                    else
                        $(clickedArray[i]).addClass("col-lg-1");
                }
                else if (item.indexOf('col-sm-') > -1) {
                    var incrsdcls = parseInt(item.substring(item.lastIndexOf('-') + 1));
                    $(clickedArray[i]).removeClass(item);
                    if (incrsdcls > 1)
                        $(clickedArray[i]).addClass("col-sm-" + (incrsdcls - 1));
                    else
                        $(clickedArray[i]).addClass("col-sm-1");
                }
                else if (item.indexOf('col-md-') > -1) {
                    var incrsdcls = parseInt(item.substring(item.lastIndexOf('-') + 1));
                    $(clickedArray[i]).removeClass(item);
                    if (incrsdcls > 1)
                        $(clickedArray[i]).addClass("col-md-" + (incrsdcls - 1));
                    else
                        $(clickedArray[i]).addClass("col-md-1");
                }
                else if (item.indexOf('col-xs-') > -1) {
                    var incrsdcls = parseInt(item.substring(item.lastIndexOf('-') + 1));
                    $(clickedArray[i]).removeClass(item);
                    if (incrsdcls > 1)
                        $(clickedArray[i]).addClass("col-md-" + (incrsdcls - 1));
                    else
                        $(clickedArray[i]).addClass("col-md-1");
                }
            });

        }
    } else if (gridArray.length > 0) {
        designChanged = true;
        $("#A5").removeClass('disableToolIcon');
        for (var i = 0; i < gridArray.length; i++) {
            var gridcolid = $(gridArray[i]);
            var tableid = $("#" + gridArray[i].id).closest("table").attr("id");

            if (tableid.indexOf("gridHd") == 0) {
                var dcNo = tableid.substring(6);
                if ($("#ckbGridStretch" + dcNo).prop("checked") == true) {
                    $("#ckbGridStretch" + dcNo).prop("checked", false);
                    toggleGridStretch(dcNo);
                }
            }

            if (gridcolid != undefined && tableid != undefined) {
                var dcNum = tableid.substring(6);
                var colwidth = $(gridArray[i]).css("width").replace("px", "");
                if (parseInt(colwidth, 10) <= minWidthForGridHeaders)
                    return false;

                if (griddcid != undefined) {
                    var theadWidth = parseInt($("#" + tableid).css("width").replace("px", "")) - adjustWidth;
                    $("#" + tableid).attr("style", "width:" + theadWidth + "px");
                    $(gridArray[i]).css({ "width": (parseInt(colwidth) - adjustWidth), "min-width": (parseInt(colwidth) - adjustWidth) });

                    var inputelement = $("#" + gridArray[i].id.replace("th-", "") + "001F" + griddcid);
                    var tdobj = inputelement.closest("td");
                    if ($("#contentScroll" + dcNum) != undefined) {
                        if (theadWidth < $("#wBdr").width()) {
                            $("#contentScroll" + dcNum).css({ "width": (theadWidth), "min-width": (theadWidth) });
                        }
                        else {
                            $("#contentScroll" + dcNum).css({ "width": (parseInt($("#wBdr").width()) - 40), "min-width": (parseInt($("#wBdr").width()) - 40) });
                        }
                    }
                    tdobj.css("width", (parseInt(colwidth) - adjustWidth));

                    AssignGrdFreezeHdrScript(dcNum);
                }
            }

        }

    }
    else {
        showAlertDialog("warning", 2050, "client");
    }

}

function resetButtonClicked() {
    $('#btnSave').click();
}

function SortBasedOnParent(SortElem) {
    var arrayOfObjects = [];
    for (var i = 0; i < SortElem.length; i++) {
        var elemObject = new Object();
        elemObject.id = SortElem[i].id;
        elemObject.parentid = SortElem[i].parentNode.id;
        arrayOfObjects.push(elemObject);
    }

    var byName = arrayOfObjects.slice(0);
    byName.sort(function (a, b) {
        var x = a.parentid.toLowerCase();
        var y = b.parentid.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
    });
    SortElem = [];
    ParentIds = [];
    for (var i = 0; i < byName.length; i++) {
        SortElem.push(byName[i].id);
        ParentIds.push(parseInt(byName[i].parentid.split('_')[1]));
    }
    if (!CheckConsecutive(ParentIds))
        isNotsequence = true;

    var prevID = "#randomID_" + parseInt(byName[0].parentid.split('_')[1] - 1);
    if (prevID != "" && prevID != undefined) {
        $(prevID).removeClass("rowdesign");
        $(prevID).addClass("row");
    }

    return SortElem;
}

function CheckConsecutive(arrA) {
    for (var i = 0; i < arrA.length - 1; i++) {
        var temp = arrA[i] + 1;
        if (temp != arrA[i + 1])
            return false;

    }
    return true;
}



//function MoveRight() {
//    if (clickedArray.length > 0) {

//        for (var i = 0; i < clickedArray.length; i++) {
//            clickedArray[i].style.outline = "none";
//            var classList = $(clickedArray[i]).attr('class').split(/\s+/);
//            $.each(classList, function (index, item) {
//                if (item.indexOf('col-lg-') > -1) {
//                    var incrsdcls = parseInt(item.substring(item.lastIndexOf('-') + 1));
//                    $(clickedArray[i]).removeClass(item);
//                    if (incrsdcls < 12)
//                        $(clickedArray[i]).addClass("col-lg-" + (incrsdcls + 1));
//                    else
//                        $(clickedArray[i]).addClass("col-lg-12");
//                }
//                else if (item.indexOf('col-sm-') > -1) {
//                    var incrsdcls = parseInt(item.substring(item.lastIndexOf('-') + 1));
//                    $(clickedArray[i]).removeClass(item);
//                    if (incrsdcls < 12)
//                        $(clickedArray[i]).addClass("col-sm-" + (incrsdcls + 1));
//                    else
//                        $(clickedArray[i]).addClass("col-sm-12");
//                }
//                else if (item.indexOf('col-md-') > -1) {
//                    var incrsdcls = parseInt(item.substring(item.lastIndexOf('-') + 1));
//                    $(clickedArray[i]).removeClass(item);
//                    if (incrsdcls < 12)
//                        $(clickedArray[i]).addClass("col-md-" + (incrsdcls + 1));
//                    else
//                        $(clickedArray[i]).addClass("col-md-12");
//                }
//                else if (item.indexOf('col-xs-') > -1) {
//                    var incrsdcls = parseInt(item.substring(item.lastIndexOf('-') + 1));
//                    $(clickedArray[i]).removeClass(item);
//                    if (incrsdcls < 12)
//                        $(clickedArray[i]).addClass("col-xs-" + (incrsdcls + 1));
//                    else
//                        $(clickedArray[i]).addClass("col-xs-12");
//                }
//            });


//        }
//    }
//    else {
//        showAlertDialog("warning", "Please select an element");
//    }
//}



/*  gridheader changes */


function OnGridElementSelect(elem, event) {
    if (clickedArray.length > 0) {
        ClearSelected();
    }

    var clickedObject = elem;
    var elemId = elem.id;
    if (elem.id != undefined) {
        griddcid = $("#" + elemId).closest("table").attr("id").substring(6);

        if (dcid == "" && elem.parentElement.className == "containerDc") {
            dcid = elem.parentElement.parentNode.id;
        }
        dcNo = dcid.replace('divDc', '');
        for (var i = 0; i < gridArray.length; i++) {
            if (gridArray[i].id == clickedObject.id) {
                gridArray[i].style.border = "none";
                $(gridArray[i]).css('border-right', '1px solid white');
                gridArray.splice(i, 1);
                event.stopPropagation();
                break;
            }
        }
    }

    if (event.ctrlKey) {
        clickedObject.style.border = "1px red solid";
        gridArray.push(clickedObject);
    }
    else {
        for (var i = 0; i < gridArray.length; i++) {
            gridArray[i].style.border = "none";
            $(gridArray[i]).css('border-right', '1px solid white');
        }

        clickedObject.style.border = "1px red solid";
        gridArray = [];
        gridArray.push(clickedObject);
    }

    event.stopPropagation();
}


function OnTableSelect(elem, event) {

    $(elem).css("border", "2px solid red");
    var idOfTable = $(elem).parent().attr('id');
    tableArray.push(idOfTable);
}





function ChangeDir(dir) {
    $j("#form1").attr("dir", dir);
}
//$j(document).ready(function f() {

//    jQuery.browser = {};
//    (function () {
//        jQuery.browser.msie = false;
//        jQuery.browser.version = 0;
//        if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
//            jQuery.browser.msie = true;
//            jQuery.browser.version = RegExp.$1;
//        }
//    })();
//});




//function GetChoiceStatusForDSign() {
//    $j.ajax({
//        type: "POST",
//        url: "TstructDesign.aspx/GetPrpLblStatusForDSign",
//        data: '',
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: function (response) {
//            var res = response.d;
//            if (res == "true") {
//                $j(".clsPrps").css("display", "block");
//                $j("#ckbPurposeDev").prop("checked", true);
//            }
//            else {
//                $j(".clsPrps").css("display", "none");
//                $j("#ckbPurposeDev").prop("checked", false);
//            }
//        }
//    });
//}
///////
(function ($) {

    'use strict';

    $(document).on('show.bs.tab', '.nav-tabs-responsive [data-toggle="tab"]', function (event) {
        var $target = $(event.target);
        var tst = $target.attr("id");
        var $tabs = $target.closest('.nav-tabs-responsive');
        var $current = $target.closest('li');
        var tst2 = $current.attr("id");
        //console.log(tst + "  " + tst2);
        //var $parent = $current.closest('li.dropdown');
        //$current = $parent.length > 0 ? $parent : $current;
        var $next = $current.next();
        //console.log($next);
        var nextClass = $next.attr("class");
        if (nextClass === "notVisible") {
            $next = $next.next();
        }

        var $prev = $current.prev();
        var prevClass = $prev.attr('class');
        if (prevClass === "notVisible") {
            $prev = $prev.prev();
        }
        var updateDropdownMenu = function ($el, position) {
            $el
              .find('.dropdown-menu')
              .removeClass('pull-xs-left pull-xs-center pull-xs-right')
              .addClass('pull-xs-' + position);
        };

        $tabs.find('>li').removeClass('next prev');
        $prev.addClass('prev');
        $next.addClass('next');

    });

})(jQuery);

function toggleCompressedMode(type) {
    var valFlag = '';
    designChanged = true;
    $("#A5").removeClass('disableToolIcon');
    if ($("#ckbCompressedMode").prop("checked") == true) {
        //checkbox is unchecked                 
        $("#ckbCompressedMode").prop('checked', false);

        if($("link[href='../Css/customCompressedTstruct.css']").length > 0) {
            $('link[rel=stylesheet][href~="../'+ proj +'/customCompressedTstruct.css"]').remove();
        }

        if ($("link[href='../Css/compressedTstruct.min.css?v=40']").length > 0)
            $('link[rel=stylesheet][href~="../Css/compressedTstruct.min.css?v=40"]').remove();
    } else {
        //checkbox is checked
        $("#ckbCompressedMode").prop('checked', true);

        let customStyleApplied = false; 

        if(typeof localStorage != "undefined") {
            var projUrl =  top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/"));
            var customStyleTimeStamp = localStorage["customCompressedTstructExist-" + projUrl];
            if (customStyleTimeStamp && customStyleTimeStamp != "false") {
                var appProjName = localStorage["projInfo-" + projUrl] || "";
                $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', `../${appProjName}/customCompressedTstruct.css?v=${customStyleTimeStamp}`));
                customStyleApplied = true;
            }         
        }

        if (!customStyleApplied && $("link[href='../Css/compressedTstruct.min.css?v=40']").length != 1)
            $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', '../Css/compressedTstruct.min.css?v=40'));
    }
    SetGridElementsHeight();
}

//$(document).on('mousedown', '.disableToolIcon', function (e) {
//    e.preventDefault();
//    e.stopPropagation();
//});




function enableToolIcons() {
    $('.toolbardiv').addClass('disableToolIcon');
    if (designChanged == true)
        $("#A5").removeClass('disableToolIcon');
    //$("#btnAlignOne")
    //$("#btnAlignMerge")
    //$("#increaseWidth")
    //$("#A2")//DecreaseWidth();
    //$("#A3")//IncreaseHeight();
    //$("#A4")//DecreaseHeight();
    //$("#A7")//resetButtonClicked();
    //$("#A5")//javascript:saveAsJson();
    if (clickedArray.length > 0 && gridArray.length > 0 || gridArray.length > 0 && tableArray.length > 0 || tableArray.length > 0 && clickedArray.length > 0) {
        showAlertDialog("warning", 2046, "client");
        ClearSelected();
        return;

    }
    if (clickedArray.length > 0) {

        //checking for textarea for to enable height buttons
        var textAreaSelected = true;
        var gridBodySelected = true;
        for (j = 0; j < clickedArray.length; j++) {
            //$(clickedArray[i]).find(".axpImg")
            $(clickedArray[j]).find('textarea,.axpImg').length == 0 ? textAreaSelected = false : "";
        }
        gridArray.length > 0 ? textAreaSelected = false : "";
        //clickedArray.length == 0 && tableArray.length > 0 && gridArray.length == 0
        clickedArray.length > 0 && textAreaSelected == true && tableArray.length > 0 ? gridBodySelected = true : gridBodySelected = false;
        if (clickedArray.length > 0 && gridArray.length > 0) {
            textAreaSelected && gridBodySelected ? $("#A3,#A4").removeClass('disableToolIcon') : $("#A3,#A4").addClass('disableToolIcon');
        } else if (textAreaSelected) {
            $("#A3,#A4").removeClass('disableToolIcon');
        }

        //textAreaSelected && gridBodySelected ? $("#A3,#A4").removeClass('disableToolIcon') : $("#A3,#A4").addClass('disableToolIcon');
        if (clickedArray.length == 1) {
            var clickedElem = $(clickedArray[0]);
            if (clickedElem.hasClass('gridElement')) {
                if (clickedElem.data('isVisible') === undefined || $(clickedArray[0]).data('isVisible') == "true") {
                    //means field is visible
                    $("#showTheField").addClass('disableToolIcon');
                    $("#hideTheField").removeClass("disableToolIcon");
                } else {
                    $("#showTheField").removeClass('disableToolIcon');
                    $("#hideTheField").addClass("disableToolIcon");
                }
            }
            $("#btnAlignOne,#increaseWidth,#A2").removeClass('disableToolIcon');
        } else {
            var isEditLayoutElements = true;
            for (i = 0; i < clickedArray.length; i++) {
                !($(clickedArray[i]).hasClass('gridElement')) ? isEditLayoutElements = false : "";
            }
            if (isEditLayoutElements) {
                var tmpStatus = "";
                var allSame = "";
                for (i = 0; i < clickedArray.length; i++) {
                    var isFieldvisible = $(clickedArray[i]).data('isVisible');
                    isFieldvisible === undefined ? isFieldvisible = "true" : "";
                    if (i == 0) {
                        isFieldvisible == "true" ? tmpStatus = "true" : tmpStatus = "false";
                    } else {
                        if (allSame !== "" && allSame == false) {
                            continue;
                        }
                        if (tmpStatus == isFieldvisible)
                            allSame = true;
                        else
                            allSame = false;
                    }
                }
                if (allSame) {
                    if (tmpStatus == "true") {
                        $("#hideTheField").removeClass("disableToolIcon");
                        $("#showTheField").addClass('disableToolIcon');
                    }
                    else {
                        $("#hideTheField").addClass("disableToolIcon");
                        $("#showTheField").removeClass('disableToolIcon');
                    }
                }







                checkGridAlignment()
                if (isGridElementsAlligned) {
                    //alert('ok')
                    if (clickedArray.length <= 3)
                        $("#btnAlignMerge,#increaseWidth,#A2").removeClass('disableToolIcon');
                    else
                        $("#increaseWidth,#A2").removeClass('disableToolIcon');
                } else {
                    $("#increaseWidth,#A2").removeClass('disableToolIcon');
                }
            } else {
                var SortElem = clickedArray;
                var arrayOfObjects = [];
                for (var i = 0; i < SortElem.length; i++) {
                    var elemObject = new Object();
                    elemObject.id = SortElem[i].id;
                    elemObject.parentid = SortElem[i].parentNode.id;
                    arrayOfObjects.push(elemObject);
                }

                var byName = arrayOfObjects.slice(0);
                byName.sort(function (a, b) {
                    var x = a.parentid.toLowerCase();
                    var y = b.parentid.toLowerCase();
                    return x < y ? -1 : x > y ? 1 : 0;
                });
                SortElem = [];
                ParentIds = [];
                for (var i = 0; i < byName.length; i++) {
                    SortElem.push(byName[i].id);
                    ParentIds.push(parseInt(byName[i].parentid.split('_')[1]));
                }
                if (!CheckConsecutive(ParentIds))
                    isNotsequence = true;

                if (isNotsequence) {
                    $("#increaseWidth,#A2").removeClass('disableToolIcon');
                    //alert('Not in sequence');
                } else {
                    if (clickedArray.length <= 3)
                        $("#btnAlignMerge,#increaseWidth,#A2").removeClass('disableToolIcon');
                    else
                        $("#increaseWidth,#A2").removeClass('disableToolIcon');
                }
                isNotsequence = false;
            }

        }
    }
    else if (gridArray.length > 0) {
        $("#increaseWidth,#A2").removeClass('disableToolIcon');
    }
    else if (tableArray.length > 0) {
        $("#A3,#A4").removeClass('disableToolIcon')
    }


    //clickedArray = SortBasedOnParent(clickedArray,false);
    //if (clickedArray.length > 0) {
    //    if (clickedArray.length == 1) {
    //        $("#btnAlignOne").removeClass('disableToolIcon');
    //    } else {
    //        if (isNotsequence) {
    //            alert("please select Fields in sequence order");
    //            isNotsequence = false;
    //            ClearSelected();
    //            return;
    //        }
    //        //$("#btnAlignMerge")
    //    }
    //}


}

function CancelButtonClicked() {
    if (isTstPop == "True") {
        window.location.href = document.referrer;
    }
    else
        BackForwardButtonClicked("back");
}


function DesignSaveSuccess() {
    if ($("#hdnLayout").val() != "") {
        window.location.href = "tstruct.aspx?transid=" + transid + "&layout=" + $("#hdnLayout").val();
    } else {
        window.location.href = "tstruct.aspx?transid=" + transid + "";
    }
}

function toggleEyeClass(elem, e) {
    e.preventDefault();
    e.stopPropagation();
    designChanged = true;
    $("#A5").removeClass('disableToolIcon');
    if ($(elem).find('i').hasClass('icon-basic-eye')) {
        $(elem).find('i').removeClass('icon-basic-eye').attr('title', 'Show column').addClass('icon-basic-eye-closed');
    } else {
        $(elem).find('i').removeClass('icon-basic-eye-closed').attr('title', 'Hide column').addClass('icon-basic-eye');
    }
}

//$("[id^=ckbGridStretch]").change(function () {
//    toggleGridStretch(this.id.substr(14));
//});
