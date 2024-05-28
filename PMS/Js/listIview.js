
$(document).ready(function () {
    $(".childnode").attr("href", "javascript:void(0)");
    $('a').keyup(function (e) {
        if (e.which == 39)
            $(this).closest('td').next().find('a').focus();
        else if (e.which == 37)
            $(this).closest('td').prev().find('a').focus();
        else if (e.which == 40)
            $(this).closest('tr').next().find('td:eq(' + $(this).closest('td').index() + ')').find('a').focus();
        else if (e.which == 38)
            $(this).closest('tr').prev().find('td:eq(' + $(this).closest('td').index() + ')').find('a').focus();
    });
    checkSuccessAxpertMsg();
    $('div#icons li.gropuedBtn').prop('tabIndex', 0);
    $(".PopTd2").focusout(function () {
        $('.PopTd2').hide();
    });
});

try {
    google.load("visualization", "1", { packages: ["corechart"] });
}
catch (Ex) { isChartsAvailable = false; }
function AdjustLviewWinff() {
    var ua = ie_ver();
    var bodyHeight = $j(window.document.body).height();

    if (ua != 0 && ua != undefined) {
        bodyHeight = bodyHeight + 100;
    }

    adjustwin(bodyHeight, window);
}

function ChangeDir(dir) {
    $j("#form1").attr("dir", dir);
}

function ie_ver() {
    var iev = 0;
    var ieold = (/MSIE (\d+\.\d+);/.test(navigator.userAgent));
    var trident = !!navigator.userAgent.match(/Trident\/7.0/);
    var rv = navigator.userAgent.indexOf("rv:11.0");

    if (ieold) iev = new Number(RegExp.$1);
    if (navigator.appVersion.indexOf("MSIE 10") != -1) iev = 10;
    if (trident && rv != -1) iev = 11;

    return iev;
}

function OnTreeClick(evt) {
    var src = window.event != window.undefined ? window.event.srcElement : evt.target;
    var isChkBoxClick = (src.tagName.toLowerCase() == "input" && src.type == "checkbox");
    if (isChkBoxClick) {
        var parentTable = GetParentByTagName("table", src);
        var nxtSibling = parentTable.nextSibling;
        if (nxtSibling && nxtSibling.nodeType == 1)//check if nxt sibling is not null & is an element node
        {
            if (nxtSibling.tagName.toLowerCase() == "div") //if node has children
            {
                //check or uncheck children at all levels
                CheckUncheckChildren(parentTable.nextSibling, src.checked);
            }
        }
        //check or uncheck parents at all levels
        CheckUncheckParents(src, src.checked);
    }
}

function CheckUncheckChildren(childContainer, check) {
    var childChkBoxes = childContainer.getElementsByTagName("input");
    var childChkBoxCount = childChkBoxes.length;
    for (var i = 0; i < childChkBoxCount; i++) {
        childChkBoxes[i].checked = check;
    }
}

function CheckUncheckParents(srcChild, check) {
    var parentDiv = GetParentByTagName("div", srcChild);
    var parentNodeTable = parentDiv.previousSibling;

    if (parentNodeTable) {
        var checkUncheckSwitch;

        if (check) //checkbox checked
        {
            var isAllSiblingsChecked = AreAllSiblingsChecked(srcChild);
            if (isAllSiblingsChecked)
                checkUncheckSwitch = true;
            else
                return; //do not need to check parent if any(one or more) child not checked
        }
        else //checkbox unchecked
        {
            checkUncheckSwitch = false;
        }

        var inpElemsInParentTable = parentNodeTable.getElementsByTagName("input");
        if (inpElemsInParentTable.length > 0) {
            var parentNodeChkBox = inpElemsInParentTable[0];
            parentNodeChkBox.checked = checkUncheckSwitch;
            //do the same recursively
            CheckUncheckParents(parentNodeChkBox, checkUncheckSwitch);
        }
    }
}

function AreAllSiblingsChecked(chkBox) {
    var parentDiv = GetParentByTagName("div", chkBox);
    var childCount = parentDiv.childNodes.length;
    for (var i = 0; i < childCount; i++) {
        if (parentDiv.childNodes[i].nodeType == 1) //check if the child node is an element node
        {
            if (parentDiv.childNodes[i].tagName.toLowerCase() == "table") {
                var prevChkBox = parentDiv.childNodes[i].getElementsByTagName("input")[0];
                //if any of sibling nodes are not checked, return false
                if (!prevChkBox.checked) {
                    return false;
                }
            }
        }
    }
    return true;
}

//utility function to get the container of an element by tagname
function GetParentByTagName(parentTagName, childElementObj) {
    var parent = childElementObj.parentNode;
    while (parent.tagName.toLowerCase() != parentTagName.toLowerCase()) {
        parent = parent.parentNode;
    }
    return parent;
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
    }
    else if (imgFld.attr("alt") == "Show") {
        imgFld.attr({
            alt: 'Hide',
            src: '../AxpImages/arrow-down-black.gif'
        });
        divProp.show();
        $("#Columns").focus();
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
            }
            else if (imgFld.attr("alt") == "Show") {
                imgFld.attr({
                    alt: 'Hide',
                    src: '../AxpImages/arrow-down-black.gif'
                });
                divProp.show();

            }
        }

    }
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
