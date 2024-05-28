var details = {}, dtsearchparams = [], searchlistval = [], tblFilterParams = [], mdftblFilterParams = [], groupType = '', widgetGroup = [], unFilter = false, tableWidgetsCount = {}, isWgtZoomIn = false, tDataG, chartHeight = 300;
var mappingdata = [], xxx = [];
var chartUid = "";
function ChangeDir(dir) {
    $j("#form1").attr("dir", dir);
}


function getFilterParamsData(ddlParams, fltParams) {
    $j.ajax({
        url: 'dashBoard.aspx/GetFilterParamsData',
        type: 'POST',
        cache: false,
        async: false,
        data: JSON.stringify({ sqlQuery: "" }),
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            try {
                tblFilterParams = $j.parseJSON(data.d);
                if (tblFilterParams.Table0.length > 0) {
                    if (fltParams.split(',')[0] == ddlParams.split(',')[0]) {
                        for (ftlist = 0; ftlist < ddlParams.split(',').length; ftlist++) {
                            $.each(tblFilterParams.Table0, function (ind, item) {
                                var paramddl = ddlParams.split(',')[ftlist].toUpperCase();
                                var itemName = (typeof eval("item." + paramddl) != 'undefined') ? eval("item." + paramddl) : eval("item." + paramddl.toLowerCase());
                                $("#" + ddlParams.split(',')[ftlist] + ' li:contains(' + itemName + ')').each(function () {
                                    if ($(this).text() == itemName) {
                                        $(this).remove();
                                    }
                                });

                                if ($.inArray(paramddl, Object.keys(item)) > -1 || $.inArray(paramddl.toLowerCase(), Object.keys(item)) > -1) {
                                    $("#" + ddlParams.split(',')[ftlist]).append("<li data-target=\"" + ddlParams.split(',')[ftlist] + ind + "\" data-type=\"tstruct\" class=\"collection-item filterli\">" + itemName + "</li>");
                                }
                            });
                            break;
                        }
                    }
                }

            } catch (Exception) {
                console.log("Get Filter Params Data-" + Exception.message);
            }
        }
    });
}

$j(function () {
    (function () {
        details.qltemplate = "";
        details.tasktemplate = "";
        details.messtemplate = "";
        details.datatemplate = "";
        var arrtlink = [], chartType = [], chartTitle = [], chartLink = [], tData = "", rvalue = [], colora = [], colorb = [], colorc = [], colorafrom = [], colorato = [], colorbfrom = [], colorbto = [], colorcfrom = [], colorcto = [], isTable = false, rtQuery = "", uid = "", chartQuery = "", chartUid = "";


        makefilterpanel();

        function gettabledata(rtQuery, uid, arrtlink, flt, isFromFilter) { //for right side table, it will call if right side tables is there
            var uidArray = uid.split(';');
            var uidArrayLength = uidArray.length;
            for (var i = 0; i < uidArrayLength; i++) {
                var pUid = uidArray[i];
                if (pUid && pUid != "") {
                    if (uidArray[i + 1] == undefined || uidArray[i + 1] == "") {
                        var isLast = true;
                    } else {
                        var isLast = false;
                    }
                    ajaxCallObj.getAxpertWidgetDetails(pUid);
                    //nodeApiGetWidgetData(pUid, flt, i, isLast, isFromFilter);
                }
            }

        }




        function parseHyperLink(linkCondition) {
            try {
                if (!linkCondition) {
                    return "noLinks";
                }
                // linkCondition = "h1=tNewIs{priority:priority}l^w%30";
                linkCondition = linkCondition.split("%")[0];
                var linksArrays;
                var parsedLink = {};
                parsedLink.columns = [];
                parsedLink.data = {};
                if (linkCondition == "") {
                    return "noLinks";
                } else {
                    linksArrays = linkCondition.split("~");
                    linksArrayLength = linksArrays.length;
                    for (var i = 0; i < linksArrayLength; i++) {
                        var linksArray = linksArrays[i].split("^");
                        var linkOpenType = linksArray[1];
                        var tmpArray = {};

                        var presentCondition = linksArray[0].split("=");

                        var colNum = "col" + presentCondition[0].substr(1)
                        parsedLink.columns.push(parseInt(presentCondition[0].substr(1)));
                        var presentCdtn = presentCondition[1];
                        var type = presentCdtn.charAt(0);
                        if (presentCdtn.indexOf("{") !== -1)
                            var tvransid = presentCdtn.substr(1, presentCdtn.indexOf("{") - 1);
                        else
                            var tvransid = presentCdtn.substr(1);
                        if (type == "i") { // checking is it iview or not 
                            url = 'ivtoivload.aspx?ivname=' + tvransid;
                            tmpArray.url = url;
                        } else if (type == "t") {
                            //tstruct
                            var typeToOpen = presentCdtn.slice(-1);
                            if (typeToOpen == "o") {
                                url = 'tstruct.aspx?transid=' + tvransid + '&hltype=open';
                            } else if (typeToOpen == "l") {
                                url = 'tstruct.aspx?transid=' + tvransid + '&hltype=load';
                            } else {
                                url = 'tstruct.aspx?transid=' + tvransid;
                            }
                            tmpArray.url = url;


                        }

                        var params = presentCdtn.substring(presentCdtn.indexOf("{") + 1, presentCdtn.indexOf("}"));
                        if (params && params != "") {
                            params = params.split(",");
                            var paramsLength = params.length;
                            var paramUrl = "";
                            var tmpParams = [];
                            for (var i = 0; i < paramsLength; i++) {
                                var curParam = params[i].split(":");
                                tmpParams.push([curParam[0], curParam[1]]);
                                // paramUrl += "&" + curParam[0] + "=" + curParam[1];
                            }
                        } else {
                            var tmpParams = [];
                        }
                        tmpArray.params = tmpParams;
                        if (linkOpenType && linkOpenType != "") {
                            tmpArray.openType = linkOpenType;
                        }
                        parsedLink.data[colNum] = tmpArray;
                        // parsedLink.push(tmpArray);

                    }
                    return parsedLink;
                }
            } catch (e) {
                showAlertDialog("warning", 1047, "client");
            }

        }


        function reaArrangeTableWidgets(isFromFilter) {
            var kpiTableData = "";
            var kpiWidget = "";
            $(".smallKpiTableWrapper").mCustomScrollbar({
                axis: "yx", // vertical and horizontal scrollbar
                theme: "minimal-dark",
                scrollInertia: 500,
                mouseWheel: { scrollAmount: 50 },
                autoExpandScrollbar: false,
                updateOnContentResize: true
            });

            var frstTab = $('.listUlDb li a.active').attr('href');
            if (isFromFilter !== true)
                adjustTheKpis(frstTab.substr(1))
            closeDBLoader();
            parent.closeFrame();
            //$("#hpbDsgnrcnvsWrapper .kpiTableData").each(function () {
            //    kpiTableData += $(this).html();
            //    $(this).remove();
            //})
            //$("#hpbDsgnrcnvsWrapper .kpiWidget").each(function () {
            //    kpiWidget += $(this).html();
            //    $(this).remove();
            //})
        }




        function chartLoadIframe(src) {
            window.parent.resetLeftMenu("");
            window.parent.LoadIframe(src);
        }

        function LoadWindow(src) {
            window.open(src, '_blank', 'scrollbars=1,resizable=1,height=400,width=550');
        }

        function getHypDetails(HypDtls, title) {
            if (HypDtls != null) {
                var strHypDtls = [], ivWnd = '', ivLoad = '', ivOrTst = '', ivName = '', params = '', widthIdx = HypDtls.indexOf("%");
                if (widthIdx != -1) {
                    HypDtls = HypDtls.split("%")[0];
                }
                var widthIdx = HypDtls.indexOf("^");
                if (widthIdx != -1) {
                    ivWnd = HypDtls.split("^")[1];
                    HypDtls = HypDtls.split("^")[0];
                }

                var loadIdx = HypDtls.indexOf("}");
                if (loadIdx != -1)
                    ivLoad = HypDtls[HypDtls.length - 1];

                strHypDtls = strHypDtls.concat(HypDtls.split("~"));
                for (var i = 0; i < strHypDtls.length; i++) {
                    //h1=iaceri{col1:name1,col2:name2}
                    if (strHypDtls[i].toString() != "") {
                        var colDtls = [];
                        colDtls = colDtls.concat(strHypDtls[i].toString().split("="));
                        if (colDtls.length > 0) {
                            var colName = colDtls[0].toString().substring(1);
                            var dtls = colDtls[1].toString();
                            ivOrTst = dtls.substring(0, 1);
                            var sidx = dtls.indexOf("{");
                            var eidx = dtls.indexOf("}");
                            if (ivOrTst != "d") {
                                if (sidx != -1) {
                                    ivName = dtls.substring(1, sidx);
                                    var parmDtls = dtls.substring(sidx + 1, eidx);
                                    if (parmDtls != "")
                                        params = GetParamDetails(parmDtls);
                                }
                                else {
                                    ivName = dtls.substring(1);
                                }
                            }
                            else
                                params = dtls.substring(sidx + 1, eidx);

                        }
                    }
                }

                if (ivOrTst.toLowerCase() == "i") {
                    return 'ivtoivload.aspx?ivname=' + ivName + ";" + ivWnd + ";" + params;
                }
                else if (ivOrTst.toLowerCase() == "t") {
                    if (ivLoad.toLowerCase() == "o")
                        return 'tstruct.aspx?transid=' + ivName + '&hltype=open' + ";" + ivWnd + ";" + params;
                    else if (ivLoad.toLowerCase() == "l")
                        return 'tstruct.aspx?transid=' + ivName + '&hltype=load' + ";" + ivWnd + ";" + params;
                    else
                        return 'tstruct.aspx?transid=' + ivName + ";" + ivWnd + ";" + params;
                }
                else if (ivOrTst.toLowerCase() == "d") {
                    return title + "~" + params;
                }
                else
                    return "" + ";" + ivWnd + ";" + params;
            }
        }

        //col1:name1,col2:name2
        function GetParamDetails(parmDtls) {
            var parStr = "", strDtls = [];
            strDtls = strDtls.concat(parmDtls.split(","));
            for (var i = 0; i < strDtls.length; i++) {
                if (strDtls[i] != "") {
                    var col = [];
                    col = col.concat(strDtls[i].split(":"));
                    if (col.length > 0) {
                        parStr += "&" + col[0].toLowerCase();
                    }
                }
            }
            return parStr;
        }

        function linkClick(hypLink, category, yvalue) {
            try {
                if (hypLink != "" && hypLink != ";;") {

                    if (hypLink.split(";")[2] == "") {
                        if (hypLink.split(";")[1].toLowerCase() == "w")
                            LoadWindow(hypLink.split(";")[0]);
                        else
                            chartLoadIframe(hypLink.split(";")[0]);
                    }
                    else {
                        var parmsLn = [];
                        if (hypLink.split(";")[2] != undefined) {
                            parmsLn = parmsLn.concat(hypLink.split(";")[2].split("&"));
                            if ($.inArray(category.toLowerCase(), parmsLn) != -1) {
                                if (hypLink.split(";")[1].toLowerCase() == "w")
                                    LoadWindow(hypLink.split(";")[0] + "&" + category + "=" + yvalue);
                                else
                                    chartLoadIframe(hypLink.split(";")[0] + "&" + category + "=" + yvalue);
                            }
                            else if (parmsLn != "") {
                                if (hypLink.split(";")[1].toLowerCase() == "w")
                                    LoadWindow(hypLink.split(";")[0] + "&" + parmsLn[1] + "=" + category);
                                else
                                    chartLoadIframe(hypLink.split(";")[0] + "&" + parmsLn[1] + "=" + category);
                            }
                        }
                        else {
                            drillDownhyperlink(hypLink);
                        }
                    }
                }
            } catch (exception) {

            }
        }

        function drillDownhyperlink(hypLink) {
            if (hypLink != "") {
                var curTab = hypLink.split("~")[0];
                var openTab = hypLink.split("~")[1];
                var curTabID = $(".widgetgroup .widgetWrapper[data-id = '" + curTab.toLowerCase() + "']").parents("div:eq(2)").attr("id");
                var openTabID = $(".widgetgroup .widgetWrapper[data-id = '" + openTab.toLowerCase() + "']").parents("div:eq(2)").attr("id");
                if (curTabID != openTabID) {
                    $("#" + curTabID).removeClass("active").css("display", "none");
                    $("#" + openTabID).addClass("active").removeAttr("style");
                    $(".listUlDb li a[href='#" + curTabID + "']").removeClass("active");
                    $(".listUlDb li a[href='#" + openTabID + "']").addClass("active");
                    $('ul.tabs').tabs();
                }
                //by reddy
                //$(".widgetgroup .widgetWrapper[data-id = '" + openTab.toLowerCase() + "'] .cardTitleClear i").removeClass("icon-expand").addClass("icon-contract");
                //$(".widgetgroup .widgetWrapper[data-id = '" + openTab.toLowerCase() + "']").removeClass("none");
                //WidgetExpand($(".widgetgroup .widgetWrapper[data-id = '" + openTab.toLowerCase() + "'] .cardTitleClear i"));

                //change title class 
                $(".widgetgroup .widgetWrapper[data-id = '" + openTab.toLowerCase() + "'] .wgtBtn i").removeClass("icon-expand").addClass("icon-contract");
                $(".widgetgroup .widgetWrapper[data-id = '" + openTab.toLowerCase() + "']").removeClass("none");
                WidgetExpand($(".widgetgroup .widgetWrapper[data-id = '" + openTab.toLowerCase() + "'] .wgtBtn i"));
            }
            else {
                showAlertDialog('warning', eval(callParent('lcm[125]')));
            }
        }


        $(document).on("click", "#toolBxPanel li.filterli", function () {
            if ($(this).hasClass("selected"))
                $(this).removeClass("selected");
            else
                $(this).addClass("selected");
            var select = $(this).parents(".collectionListUl");
            findNextPrevVars(select);
            $('.wgtIcon.icon-contract').trigger('click');
            filterParams();
        });

        $(document).on("change", "#toolBxPanel input.filtertext", function () {
            if ($(this).val() != "") {
                $(this).addClass("selected");
            }
            else
                $(this).removeClass("selected");
            filterParams();
        });

        var orgWidth = "100%";
        $(document).on('click', '.tabs.listUlDb li', function () {
            var elem = $(this);
            if (elem.hasClass('firstTimeTab')) {
                elem.removeClass('firstTimeTab');
                var target = elem.find('a').attr('href').substr(1);
                adjustTheKpis(target);
                makeshowwidget(target);
                $("#" + target + " .wgtBtn").each(function () {
                    chartResize($(this), "reflow");
                });
            } else {
                var target = elem.find('a').attr('href').substr(1);
                $("#" + target + " .wgtBtn").each(function () {
                    chartResize($(this), "reflow");
                });
            }
        });

        $(document).on('click', '.wgtBtn', function () {
            if ($(this).find(".wgtIcon").hasClass("icon-expand")) {
                $(this).find(".wgtIcon").removeClass("icon-expand").addClass("icon-contract");
                $(this).attr("title", "Zoom Out");
                $(this).find(".wgtIcon").attr("title", "Zoom Out");
                WidgetExpand($(this));
                $('body').on('keydown.graphPopup', function (e) {
                    if (e.which == 9) {
                        e.preventDefault();
                        // do your code
                    }
                });
            } else {
                //orgWidth = orgWidth.split(':')[1].split(';')[0];
                $(this).find(".wgtIcon").removeClass("icon-contract").addClass("icon-expand");
                $(this).find(".wgtIcon").parents(".widgetWrapper").removeClass("widgetExpanding").removeAttr("style");
                //$(this).parents(".widgetWrapper").css("width", orgWidth);
                $("div.blurMe").remove();
                $(this).attr("title", "Zoom In");
                $(this).find(".wgtIcon").attr("title", "Zoom In");
                var chartWidth = orgWidth.slice(orgWidth.indexOf("max-width:")).replace("max-width:", "").replace("px", "").split(";")[0].trim();
                chartResize($(this).find(".wgtIcon"), "setWidth", chartWidth - 20, 300, false);
                $('body').off('keydown.graphPopup');
            }
        });

        function WidgetExpand(Elem) {
            var expandingWidget = $(Elem).parents('.widgetWrapper');
            var expWgrOffset = expandingWidget.offset();
            expandingWidget.css({
                "top": expWgrOffset.top + "px",
                "left": expWgrOffset.left + "px",
                "max-width": expandingWidget.outerWidth() + "px"
            });
            var topnleft = Elem.parents(".rightPartODshBrd").offset();
            var scrollTop = parseInt($(".rightPartODshBrd").scrollTop());
            //var wd = Elem.parents("#hpbDsgnrcnvsWrapper").outerWidth();
            //var ht = Elem.parents("#hpbDsgnrcnvsWrapper").outerHeight();
            var blurHight = $(".rightPartODshBrd").outerHeight();
            var blurWidth = $(".rightPartODshBrd").outerWidth();
            Elem.parents(".widgetgroup").prepend("<div class='blurMe'></div>");
            $("div.blurMe").css({ top: topnleft.top + "px", width: blurWidth + "px", height: blurHight + "px" });
            var wd = $("div.blurMe").outerWidth();
            var ht = $("div.blurMe").outerHeight();

            orgWidth = Elem.parents(".widgetWrapper").attr("style");
            Elem.parents(".widgetWrapper").addClass("widgetExpanding").css({
                top: topnleft.top + "px", left: (topnleft.left + 5) + "px", width: (wd - 10) + "px", "max-width": wd + "px", height: (ht - 15) + "px"
            });

            //$("div.blurMe").css({ top: topnleft.top + scrollTop + "px", left: (topnleft.left + 10) + "px", width: (wd - 10) + "px", "max-width": wd + "px", height: blurHight + "px" });

            chartResize(Elem, "setWidth", wd - 10, ht - 40, true);
        }

        //$(document).on('click', '.wgtBtn', function () {
        //    $(this).find('wgtIcon').removeClass("icon-contract").addClass("icon-expand");
        //    $(this).find('wgtIcon').parents(".widgetWrapper").removeClass("widgetExpanding").removeAttr("style");
        //    $(this).find('wgtIcon').parents(".widgetWrapper").css("width", orgWidth.split(':')[1].split(';')[0]);
        //    $("div.blurMe").remove();
        //    chartResize($(this).find('wgtIcon'));
        //});


    })();



    $(document).on("click", "#btnClear", function () { // search panel clear button
        $(this).closest("div").find("table").find("input[type=text]").val("");
    });

    $(document).on("click", "#btnGo", function () { // search panel go button 
        var params = "";
        $(this).closest("div").find("table").find(".schparms").find("input").each(function (index, element) {
            params += "&" + element.name + "=" + element.value;
        });
        var ivnam = $(this).closest("span").attr("id").split('{')[0];
        window.location.href = 'ivtoivload.aspx?ivname=' + ivnam + params
    });

    $(document).on("click", "#addLink", function () { // quick links add button
        var elements = $j("#mn123 [onclick]", window.parent.document);
        var strHTML = "<div class=\"form-group\"><label for=\"inpuytName\">Name</label><input id=\"txtAdd\" type=\"text\" class=\"form-control\"></div><div class=\"form-group\"><label for=\"sel1\">Select Page</label><select class=\"form-control\" id=\"sel1\">";
        if (elements.length > 0) {
            var vals = [], eleUrl = [];
            // Populate the array
            for (var i = 0, l = elements.length; i < l; i++) {
                vals.push(elements[i].innerText);
                eleUrl.push(elements[i].outerHTML)
            }
            for (var i = 0; i < vals.length; i++) {
                var value = eleUrl[i];
                var url = value.substring(value.indexOf("(") + 1, value.lastIndexOf(")"));
                strHTML += "<option value =" + url.replace("&quot;", "").replace("&quot;", "") + ">" + vals[i] + "</option>";
            }
        }
        else {
            var cutMsg = eval(callParent('lcm[0]'));
            strHTML += "<option>" + cutMsg + "</option>";
        }
        strHTML += "</select></div>";
        $("#linksdialog").dialog({ autoOpen: false, modal: true, buttons: { "Save": function () { addQLLink(); }, "Save and Add": function () { SaveaddQLLink(); } } });
        $("#linksdialog").html(strHTML);
        $(".ui-dialog-titlebar-close").html("<p class='icon-arrows-remove'></p>");
        $("#linksdialog").dialog("open");
    });

    $(document).on("click", "#EditLinks", function () { // quick links edit button
        var alt = $j(this).attr("alt");
        var text = $j(this).attr("title");
        var slval = $j(this).parent("p").find("a").attr("onclick").split("('")[1].split("')")[0];
        var elements = $j("#mn123 [onclick]", window.parent.document);
        var strHTML = "<div class=\"form-group\"><label for=\"inpuytName\">Name</label><input id=\"txtAddu\" type=\"text\" value=\"" + $j(this).attr("title") + "\" class=\"form-control\"></div><div class=\"form-group\"><label for=\"sel1u\">Select Page</label><select class=\"form-control\" id=\"sel1u\">";
        if (elements.length > 0) {
            var vals = [], eleUrl = [];
            // Populate the array
            for (var i = 0, l = elements.length; i < l; i++) {
                vals.push(elements[i].innerText);
                eleUrl.push(elements[i].outerHTML)
            }
            for (var i = 0; i < vals.length; i++) {
                var value = eleUrl[i];
                var url = value.substring(value.indexOf("(") + 1, value.lastIndexOf(")")).replace("&quot;", "").replace("&quot;", "");
                if (url == slval) {
                    strHTML += "<option value =" + url + " selected=" + slval + ">" + vals[i] + "</option>";
                }
                else {
                    strHTML += "<option value =" + url + ">" + vals[i] + "</option>";
                }
            }
        }
        else {
            var cutMsg = eval(callParent('lcm[0]'));
            strHTML += "<option>" + cutMsg + "</option>";
        }
        strHTML += "</select></div>";
        $("#linkEditDialog").dialog({ autoOpen: false, modal: true, buttons: { "Update": function () { editQLLinks(alt, text) } } });
        $("#linkEditDialog").html(strHTML);
        $(".ui-dialog-titlebar-close").html("<p class='icon-arrows-remove'></p>");
        $("#linkEditDialog").dialog("open");
    });

    $(document).on("click", "#DelLinks", function () { // quick links delete 
        var alt = $j(this).attr("alt");
        var delmsg = eval(callParent('lcm[127]'));
        $j.ajax({
            url: 'dashBoard.aspx/DeleteQL',
            type: 'POST',
            cache: false,
            data: JSON.stringify({ linkId: alt }),
            dataType: 'json',
            contentType: "application/json",
            success: function (data) {
                if (data.d == "Quicklink deleted successfully") {
                    $j('#divQuickLinks #' + alt).remove('p');

                    if ($j("#divQuickLinks p").length == 0) {
                        $j("#divQuickLinks").append(delmsg);
                    }
                }
                showAlertDialog("success", data.d);
            }
        });
    });

    function editQLLinks(alt, text) { // here calling DB method & update the link to quick links list 
        if ($j("#txtAddu").val() != "") {
            var chexist = false, qlistlenght = $j("#divQuickLinks p a").length, quickList = $j("#divQuickLinks p a");
            for (var chcount = 0; chcount < qlistlenght; chcount++) {
                if (quickList.get(chcount).text.toLowerCase() == $j("#txtAddu").val().toLowerCase()) {
                    if (text != $j("#txtAddu").val().toLowerCase()) {
                        chexist = true;
                    }
                }
            }
            if (chexist == false) {
                $("#linkEditDialog").dialog("close");
                $j.ajax({
                    url: 'dashBoard.aspx/UpdateQL',
                    type: 'POST',
                    cache: false,
                    data: JSON.stringify({ linkUrl: $j("#sel1u").find(":selected").val(), linkname: $j("#txtAddu").val(), linkId: alt }),
                    dataType: 'json',
                    contentType: "application/json",
                    success: function (data) {
                        if (data.d == "Quicklink updated successfully") {
                            var str = "<p class='links' id=" + alt + ">";
                            str += "<a href='javascript:void(0);' class=\"line-truncateQL\" title='" + $j("#txtAddu").val() + "' onclick=\"javascript:parent.LoadIframe('" + $j("#sel1u").find(":selected").val() + "')\">" + $j("#txtAddu").val() + "</a>";
                            str += "<img src='../images/deletedb.png' alt='" + alt + "' title='" + $j("#txtAddu").val() + "' id='DelLinks' style='margin-left: 10px;'/><img src='../images/edit.png' alt='" + alt + "' title='" + $j("#txtAddu").val() + "' id='EditLinks' />";
                            str += "</p>";
                            $j("#divQuickLinks #" + alt).empty();
                            $j("#divQuickLinks #" + alt).append(str);
                        }
                        showAlertDialog("success", data.d);
                    }
                });
            }
            else {
                showAlertDialog("error", 1052, "client");
            }
        }
        else {
            showAlertDialog("warning", 1053, "client");
        }
    }

    function addQLLink() { // here calling DB method & adding the link to quick links list 
        if ($j("#txtAdd").val() != "") {
            var chexist = false, qlistlenght = $j("#divQuickLinks p a").length, quickList = $j("#divQuickLinks p a");
            for (var chcount = 0; chcount < qlistlenght; chcount++) {
                if (quickList.get(chcount).text.toLowerCase() == $j("#txtAdd").val().toLowerCase()) {
                    chexist = true;
                }
            }
            if (chexist == false) {
                $("#linksdialog").dialog("close");
                $j.ajax({
                    url: 'dashBoard.aspx/AddQL',
                    type: 'POST',
                    cache: false,
                    data: JSON.stringify({ linkName: $j("#txtAdd").val(), linkUrl: $j("#sel1").find(":selected").val() }),
                    dataType: 'json',
                    contentType: "application/json",
                    success: function (data) {
                        if (data.d != "Some error occured please try again later.") {
                            var qid = $j.parseJSON(data.d);
                            if (qid.Table.length != 0) {

                                if ($j("#divQuickLinks p").length == 0) {
                                    $j("#divQuickLinks").empty();
                                }

                                var str = "<p class='links' id=" + qid.Table[0].ID + ">";
                                str += "<a href='javascript:void(0);' class=\"line-truncateQL\" title='" + $j("#txtAdd").val() + "' onclick=\"javascript:parent.LoadIframe('" + $j("#sel1").find(":selected").val() + "')\">" + $j("#txtAdd").val() + "</a>";
                                str += "<img src='../images/deletedb.png' alt='" + qid.Table[0].ID + "' title='" + $j("#txtAdd").val() + "' id='DelLinks' style='margin-left: 10px;' /><img src='../images/edit.png' alt='" + qid.Table[0].ID + "' title='" + $j("#txtAdd").val() + "' id='EditLinks' />";
                                str += "</p>";
                                $j("#divQuickLinks").append(str);
                            }
                            showAlertDialog("success", 1054, "client");
                        }
                        else {
                            showAlertDialog("error", data.d);
                        }
                    }
                });
            }
            else {
                showAlertDialog("error", 1052, "client");
            }
        }
        else {
            showAlertDialog("warning", 1053, "client");
        }
    }

    function SaveaddQLLink() { // here calling DB method & adding the link to quick links list 
        if ($j("#txtAdd").val() != "") {
            var chexist = false, qlistlenght = $j("#divQuickLinks p a").length, quickList = $j("#divQuickLinks p a");
            for (var chcount = 0; chcount < qlistlenght; chcount++) {
                if (quickList.get(chcount).text.toLowerCase() == $j("#txtAdd").val().toLowerCase()) {
                    chexist = true;
                }
            }
            if (chexist == false) {
                $j.ajax({
                    url: 'dashBoard.aspx/AddQL',
                    type: 'POST',
                    cache: false,
                    data: JSON.stringify({ linkName: $j("#txtAdd").val(), linkUrl: $j("#sel1").find(":selected").val() }),
                    dataType: 'json',
                    contentType: "application/json",
                    success: function (data) {
                        var qid = $j.parseJSON(data.d);
                        if (qid.Table.length != 0) {
                            if ($j("#divQuickLinks p").length == 0) {
                                $j("#divQuickLinks").empty();
                            }
                            var str = "<p class='links' id=" + qid.Table[0].ID + ">";
                            str += "<a href='javascript:void(0);' class=\"line-truncateQL\" title='" + $j("#txtAdd").val() + "' onclick=\"javascript:parent.LoadIframe('" + $j("#sel1").find(":selected").val() + "')\">" + $j("#txtAdd").val() + "</a>";
                            str += "<img src='../images/deletedb.png' alt='" + qid.Table[0].ID + "' title='" + $j("#txtAdd").val() + "' id='DelLinks' style='margin-left: 10px;' /><img src='../images/edit.png' alt='" + qid.Table[0].ID + "' title='" + $j("#txtAdd").val() + "' id='EditLinks' />";
                            str += "</p>";
                            $j("#divQuickLinks").append(str);
                            $("#txtAdd").val("");
                        }
                        showAlertDialog("success", 1054, "client");
                    }
                });
            }
            else {
                showAlertDialog("error", 1052, "client");
            }
        }
        else {
            showAlertDialog("warning", 1053, "client");
        }
    }

    $(".autocompleted").keyup(function (e) {
        if (e.which == 9) {
            var id = $(this).attr("id");
            var tit = $(this).closest("div").parent("div").parent("div").children().find("p").text();
            searchlistval = searchfilter(tit, id);
        }
    });
    $(".autocompleted").keypress(function (e) {
        if (e.which == 9) {
            var id = $(this).attr("id");
            var tit = $(this).closest("div").parent("div").parent("div").children().find("p").text();
            searchlistval = searchfilter(tit, id);
        }
    });
    $(".autocompleted").click(function (e) {
        var id = $(this).attr("id");
        var tit = $(this).closest("div").parent("div").parent("div").children().find("p").text();
        searchlistval = searchfilter(tit, id);
    });

    function searchfilter(pr1, pr2) {
        var arr = [];
        $.each(dtsearchparams, function (ind, item) {
            if (item.WIDGETNAME == pr1 && item.PNAME == pr2) {
                arr.push(item);
            }
        });
        return arr;
    }

    $(".autocompleted").autocomplete({
        minLength: 1,
        selectFirst: true,
        autoFocus: true,
        source: function (request, response) {
            var aSearch = [];
            $(searchlistval).each(function (iIndex, sElement) {
                if (sElement.SQLTEXT.substr(0, request.term.length) == request.term) {
                    aSearch.push(sElement);
                }
            });
            response($.map(aSearch, function (item) {
                return {
                    label: item.SQLTEXT, value: item.SQLTEXT,
                }
            }))
        }
    });

    $(function () {
        $(".datepicker").datepicker({
        }).attr('readonly', 'readonly');

        $(".allownumericwithdecimal").on("keypress keyup blur", function (event) {
            $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
            if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
        });
    });

    $(document).ready(function () {

        //Hiding the menu arrow from left menu pannel
        // $("#leftMenuToggleBtn", window.parent.document).hide();


        $('.collapse').on('shown.bs.collapse', function () {
            $(this).parent().find(".glyphicon.glyphicon-menu-down icon-arrows-down").removeClass("glyphicon glyphicon-menu-down icon-arrows-down").addClass("glyphicon glyphicon-menu-up icon-arrows-up");
        }).on('hidden.bs.collapse', function () {
            $(this).parent().find(".glyphicon.glyphicon-menu-up icon-arrows-up").removeClass("glyphicon glyphicon-menu-up icon-arrows-up").addClass("glyphicon glyphicon-menu-down icon-arrows-down");
        });
        checkSuccessAxpertMsg();

        $('ul.tabs').tabs();
    });

    $(".fltAutocomplete").autocomplete({
        minLength: 1,
        selectFirst: true,
        autoFocus: true,
        source: function (request, response) {
            isFirstAutoInput($(this.element));
            var aFilter = [];
            var inputId = $(this.element).attr('id');
            $(mdftblFilterParams).each(function (iIndex, sElement) {
                if ($.inArray(inputId.toUpperCase(), Object.keys(sElement)) > -1) {
                    if (eval("sElement." + inputId.toUpperCase()).toLowerCase().indexOf(request.term.toLowerCase()) >= 0) {
                        if ($.inArray(eval("sElement." + inputId.toUpperCase()), aFilter) == -1)
                            aFilter.push(eval("sElement." + inputId.toUpperCase()));
                    }
                }
            });
            response($.map(aFilter, function (item) {
                return {
                    label: item, value: item,
                }
            }))
        },
        open: function (event, ui) {
            var dialog = $(this).closest('.ui-dialog');
            if (dialog.length > 0) {
                $('.ui-autocomplete.ui-front').zIndex(dialog.zIndex() + 1);
            }
        },
        select: function (event, ui) {
            $(this).val(ui.item.label);
            findNextPrevVars($(this));
        }
    });


    function isFirstAutoInput(selectedInput) {
        var params = "";
        var prevAll = selectedInput.closest("div").prevAll("div");
        $.each(prevAll, function (ind, item) {
            if (item.lastChild.nodeName == "SELECT" || $(item.lastChild).hasClass('fltAutoInput')) {
                var id = $(item.lastChild).attr("id");
                var val = $(item.lastChild).val();
                params += id + "=" + val + ";";
            }
        })
        filterSelection(params);
    }

    function findNextPrevVars(selectedCtl) {
        var params = "";
        var prevAll = selectedCtl.parent().closest("ul").prevAll("ul").children("ul");
        $.each(prevAll, function (ind, item) {
            if (item.lastChild.nodeName == "SELECT" || $(item.lastChild).hasClass('fltAutoInput')) {
                var id = $(item.lastChild).attr("id");
                var val = $(item.lastChild).val();
                params += id + "=" + val + ";";
            }
        })
        if (selectedCtl.text() != "")
            params += selectedCtl.attr('id') + "=";
        var selected = "";
        selectedCtl.find('li.selected').each(function () {
            selected += $(this).text() + ','; //
        });
        params += selected.slice(0, -1);
        filterSelection(params);
        var nxtAllselect = selectedCtl.parent().closest("ul").nextAll("ul").children("ul");
        $.each(nxtAllselect, function (ind, item) {
            if (item.nodeName == "UL") {
                $('#' + $(item).attr("id") + ' li').remove();
            }
            else if ($(item.lastChild).hasClass('fltAutoInput')) {
                $('#' + $(item.lastChild).attr("id")).val("");
            }
        })
        var nxtId = selectedCtl.parent().closest("ul").nextAll("ul").children("ul").attr("id");
        if (nxtId != undefined) {
            bindNextControl(nxtId);
        }
    }

    function filterSelection(strValues) {

        if (strValues)
            strValues = GetFormattedStrvalues(strValues);
        mdftblFilterParams = [];
        if (strValues != "") {
            var arrValues = strValues.split(';');
            var flag = "";
            for (i = 0; i < arrValues.length; i++) {
                if (arrValues[i] != "") {
                    $.each(tblFilterParams.Table0, function (ind, items) {
                        if (eval("items." + arrValues[i].split('=')[0].toUpperCase()) == arrValues[i].split('=')[1]) {
                            mdftblFilterParams.push(items);
                        }
                    });
                }
            }
        }
        return mdftblFilterParams;
    }
    function GetFormattedStrvalues(strvalues) {
        var newStrVal = "";
        var semiColonSeperatedAry = strvalues.split(';');
        $.each(semiColonSeperatedAry, function (index) {
            var equalSeperatedAry = semiColonSeperatedAry[index].split('=');
            var LHSValue = equalSeperatedAry[0];
            var commaSeperatedAry = equalSeperatedAry[1].split(',');
            $.each(commaSeperatedAry, function (indx) {
                newStrVal += LHSValue + "=" + commaSeperatedAry[indx] + ";";
            });
        });
        return newStrVal;
    }
    function bindNextControl(nxtId) {
        $.each(mdftblFilterParams, function (ind, item) {
            $("#" + nxtId + ' li:contains(' + eval("item." + nxtId.toUpperCase()) + ')').each(function () {
                if ($(this).text() == eval("item." + nxtId.toUpperCase())) {
                    $(this).remove();
                }
            });

            if ($.inArray(nxtId.toUpperCase(), Object.keys(item)) > -1) {
                $("#" + nxtId).append("<li data-target=\"" + nxtId.toUpperCase() + ind + "\" data-type=\"tstruct\" class=\"collection-item filterli\">" + eval("item." + nxtId.toUpperCase()) + "</li>");
            }
        });
    }
});


$(document).ready(function () {
    // ChangeTheme()
    parent.closeFrame();

    var elem = $(".myPatients.card-2").first();
    $("<div></div>").insertBefore(elem);
    $(".highcharts-button").each(function (index) {
        if ($(this).prev().html().length > 0) {
            if ($(this).prev().find(".highcharts-series").html().length > 0)
                $(this).css('display', 'block');
            else
                $(this).css('display', 'none');
        }
        else {
            $(this).css('display', 'none');
        }
    });
});
$(document).on('click', '.highcharts-container', function () {
    $("#globalSearchinp", window.parent.document).blur();
})

//for toolbox search
$(document).on('keyup', '.toolBxPanelSrch', function (e) {
    if ((e.which <= 111 && e.which >= 48) || e.which == 8) {
        var elem = $(this);
        var enteredVal = elem.val().toLowerCase();
        if (enteredVal != "") {

            elem.parents(".collection").find('.collectionListUl .collection-item').each(function (index, el) {
                var currentElem = $(this);
                var textOfElem = currentElem.text().toLowerCase();
                textOfElem.indexOf(enteredVal) == -1 ? currentElem.hide() : currentElem.show();
            });
            elem.parents(".collection").find('.collectionListUl .collection-item:visible:first').addClass('activeLi')
        } else {
            elem.parents(".collection").find('.collectionListUl .collection-item').removeClass('activeLi').show();
        }
    }
});
//for toolbar search actions
$(document).on('keydown', '.toolBxPanelSrch', function (e) {
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


//loader
function startDBLoader() {
    $.LoadingOverlay("show");
}

function closeDBLoader() {
    $.LoadingOverlay("hide", true);
}


function ChangeTheme() {
    //var theme = $j("#DropDownList1 option:selected", window.parent.document).text();
    var theme = "";
    theme = eval(callParent('currentThemeColor'));
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

function collapseDBTB(elem) {
    $("#HPBToolBox").addClass('animate fadeOutLeft');
}

$(document).on('click', '#collapseDBTB', function () {
    $("#HPBToolBox").addClass('animated fadeOutLeft');
    setTimeout(function () {
        $("#HPBToolBox").hide();
        $("#openDBTBWrapper").show();
        $("#HPBdesignerCanvas").css("width", "100%");
        $(".tabs.listUlDb li a.active").click();
        WidgetResize();
        $("#HPBdesignerCanvas .wgtBtn").each(function () {
            chartResize($(this), "reflow");
        });
    }, 500)

})

$(document).on('click', '#openDBTB', function () {
    $("#HPBdesignerCanvas").removeAttr("style");
    $("#openDBTBWrapper").hide();
    $(".tabs.listUlDb li a.active").click();
    $("#HPBToolBox").show().removeClass('animated fadeOutLeft').addClass('animated fadeInLeft');
    WidgetResize();
    $("#HPBdesignerCanvas .wgtBtn").each(function () {
        chartResize($(this), "reflow");
    });
})

function chartResize(Elem, task, width, height, animate) {
    var chartElem = Elem.parents(".widgetWrapper").find('.wrapperForWidgets');
    var index = parseInt(chartElem.attr("data-highcharts-chart"));
    if (chartElem != undefined && index != undefined && index >= 0) {
        if (task == "setWidth") {
            setTimeout(function () {
                Highcharts.charts[index].setSize(width, height, animate);
            }, 50);
        } else if (task == "reflow") {
            Highcharts.charts[index].reflow();
        }
    } else if (chartElem != undefined)
        chartElem.css('height', height);
}

function WidgetResize() {
    var topnleft = $(".rightPartODshBrd").offset();
    var wd = $(".rightPartODshBrd").outerWidth();
    var ht = $(".rightPartODshBrd").outerHeight();

    if ($(".widgetWrapper.widgetExpanding")[0]) {
        $(".widgetWrapper.widgetExpanding").css({
            top: topnleft.top + "px", left: (topnleft.left + 3) + "px", width: (wd - 10) + "px", "max-width": wd + "px", height: (ht - 15) + "px"
        });
    }

    if ($("div.blurMe")[0]) {
        $("div.blurMe").css({
            top: topnleft.top + "px", left: (topnleft.left + 3) + "px", width: (wd - 10) + "px", "max-width": wd + "px", height: (ht - 15) + "px"
        });
    }
}


function makeshowwidget(tabs) {
    var widgetTab = $('#' + tabs).length;
    if (widgetTab == 0) {
        return false;
    }
    var widgets = $('#' + tabs).find('.widgetWrapper');
    if (widgets.length == 0) {
        return false;
    }

    widgets.each(function () {
        var widgetId = $(this).data('id');
        ajaxCallObj.getAxpertWidgetDetails(widgetId);
    });
}

function renameTheTabId(str) {
    return "AxDTabs" + str.replace(/ /g, "");

}

function makefilterpanel() {
    $j.ajax({
        "async": true,
        "crossDomain": true,
        "url": apiBase + "getdashboardfilters",
        "method": "POST",
        "headers": {
            "content-type": "application/x-www-form-urlencoded"
        },
        "data": {
            "session_id": sId,
            "utl": utls,
            "username": username,
            "authorization": parent.nodeAccessToken,
            "appSKey": appsessionKey
        },
        success: function (data) {
            if (!data.status) {
                valSessByApi(data);
                //alert("Getting Widgets error : " + data.errmsg);
                return false;
            }
            var resultData = data.data;
            var querymetaData = resultData.metaData;
            for (i = 0; i < querymetaData.length; i++) {
                mappingdata[querymetaData[i]['name']] = i;
            }

            if (resultData.rows.length > 0) {
                var fltParams = "", ddlParams = "", fltLength = 0, fltTable = [];
                fltLength = resultData.rows.length;
                fltTable = resultData.rows;
                var dataMeta = {};

                for (ftleng = 0; ftleng < fltLength; ftleng++) {
                    dataMeta["MOE"] = fltTable[ftleng][mappingdata.MOE];
                    dataMeta["PNAME"] = fltTable[ftleng][mappingdata.PNAME];
                    dataMeta["PCAPTION"] = fltTable[ftleng][mappingdata.PCAPTION];
                    dataMeta["DATATYPE"] = fltTable[ftleng][mappingdata.DATATYPE];

                    if (dataMeta.MOE.toLowerCase() == "select" || dataMeta.MOE.toLowerCase() == "autocomplete") {
                        fltParams += dataMeta.PNAME + ",";
                        ddlParams += dataMeta.PNAME + ",";
                        var toolBxPanelMarkUp = "<ul class=\"collection with-header\"><li class=\"collection-header\"><span class=\"toolBxPanelSrchSpn\"><input placeholder=\"" + dataMeta.PCAPTION + "\" class=\"toolBxPanelSrch\"><i class=\"searchIcon icon-magnifier\"></i></span></li><ul id=\"" + dataMeta.PNAME + "\" class=\"collectionListUl\"></ul></ul>";
                        $("#toolBxPanel").append(toolBxPanelMarkUp);
                    }
                    else {
                        if (dataMeta.DATATYPE.toLowerCase() == "character") {
                            var toolBxPanelMarkUp = "<ul class=\"collection with-header\"><li class=\"collection-header\"><span class=\"toolBxPanelSrchSpn\"><input id=" + dataMeta.PNAME + " placeholder=\"" + dataMeta.PCAPTION + "\" class=\"toolBxPanelSrch filtertext\"><i class=\"searchIcon icon-magnifier\"></i></span></li></ul>";
                            $("#toolBxPanel").append(toolBxPanelMarkUp);
                        }
                        else if (dataMeta.DATATYPE.toLowerCase() == "date") {
                            var toolBxPanelMarkUp = "<ul class=\"collection with-header\"><li class=\"collection-header\"><span class=\"toolBxPanelSrchSpn\"><input id=" + dataMeta.PNAME + " placeholder=\"" + dataMeta.PCAPTION + "\" class=\"toolBxPanelSrch datepicker filtertext\"></span></li></ul>";
                            $("#toolBxPanel").append(toolBxPanelMarkUp);
                        }
                        else
                            $("#toolBxPanel").append("<ul class=\"collection with-header\"><li class=\"collection-header\"><span class=\"toolBxPanelSrchSpn\"><input id=" + dataMeta.PNAME + " placeholder=\"" + dataMeta.PCAPTION + "\" class=\"toolBxPanelSrch allownumericwithdecimal filtertext\"><i class=\"searchIcon icon-magnifier\"></i></span></li></ul");
                    }
                }
                if (fltParams != "") {
                    fltParams = fltParams.slice(0, -1);
                    getFilterParamsData(ddlParams, fltParams);
                }
            }
            else {
                $("#HPBToolBox").hide();
                $("#HPBdesignerCanvas").removeClass("col s9").addClass("col s12");
            }
        }
    });

}


function filterParams() {
    tableWidgetsCount = {};
    try {
        var strParams = "", strParamValue = "", curID = "";
        $("#toolBxPanel .selected").each(function () {
            var currentObj = $(this);
            var inpValue = currentObj.val();
            var isInput = currentObj.prop("tagName");
            if (isInput != undefined && isInput == "INPUT") {
                inpID = currentObj.attr("id");
                strParams += inpID + ":" + inpValue + "~";
                strParamValue += inpValue;
                return;
            }
            var isLi = currentObj.prop("tagName");
            if (isLi != undefined && isLi == "LI") {
                inpID = currentObj.parents(".collectionListUl").attr("id");
                if (curID != inpID) {
                    curID = inpID;
                    var liVaues = "";
                    $("#" + inpID + " li.selected").each(function () {
                        liVaues += $(this).text() + ",";
                    });
                    strParams += inpID + ":" + liVaues.slice(0, -1) + "~";
                    strParamValue += liVaues.slice(0, -1);
                }
                return;
            }
        });
        //chartUid = chartUid.slice(0, -1)
        var chartUidSliced = chartUid.slice(0, -1)
        var chartUidArr = chartUidSliced.split(';');
        if (strParamValue != "") {
            startDBLoader();
            unFilter = true;
            for (i = 0; i < chartUidArr.length; i++) {
                ajaxCallObj.getAxpertWidgetDetails(chartUidArr[i], strParams.slice(0, -1));
            }
            setTimeout(function () {
                closeDBLoader();
            }, 500);

        } else {
            if (unFilter == true) {
                startDBLoader();

                for (i = 0; i < chartUidArr.length; i++) {
                    if (chartUidArr[i])
                        ajaxCallObj.getAxpertWidgetDetails(chartUidArr[i], strParams.slice(0, -1));
                }
                unFilter = false;
                setTimeout(function () {
                    closeDBLoader();
                }, 500);
            }
            else
                showAlertDialog("warning", "Require at least one filter value");
        }
        //need to add first time.yyyyyyyyyyy
    } catch (exception) {

    }
}

function adjustTheKpis(tab) {
    var count = tableWidgetsCount[tab];
    if (count) {
        //$(frstTab)
        count = parseInt(count);
        if (count <= 4) {
            var percentageToAdd = 100 / count;
            //$(frstTab + " div[class*='kpi']:lt(4)")
            $("#" + tab + " div[data-type='table']").css("width", percentageToAdd + "%");
            $("#" + tab + " div[data-type='kpi']").css("width", percentageToAdd + "%");
        } else {
            //var floatRows = count / 4;
            var noOfRows = Math.floor(count / 4);
            var extraRow = count % 4;
            if (extraRow == 0) {
                $("#" + tab + " div[data-type='table']").css("width", 25 + "%");
                $("#" + tab + " div[data-type='kpi']").css("width", 25 + "%");
            } else {
                $("#" + tab + " div[data-type='table']:lt(" + (noOfRows * 4) + ")").css("width", 25 + "%");
                $("#" + tab + " div[data-type='kpi']:lt(" + (noOfRows * 4) + ")").css("width", 25 + "%");
                var extraWidth = 100 / extraRow;
                $("#" + tab + " div[data-type='table']:gt(" + ((noOfRows * 4) - 1) + ")").css("width", extraWidth + "%");
                $("#" + tab + " div[data-type='kpi']:gt(" + ((noOfRows * 4) - 1) + ")").css("width", extraWidth + "%");
            }
        }
    }
}

$(window).on('resize.windowRszEvt', function () {
    $($(".rightPartODshBrd").find('.icon-contract')).each(function () {
        $('.icon-contract').parent('.wgtBtn').click();
    })
});
