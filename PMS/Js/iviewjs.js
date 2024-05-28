try {
    google.load("visualization", "1", { packages: ["corechart"] });
}
catch (Ex)
{ isChartsAvailable = false; }


function RefreshParams() {
    $j('#hdnGo').val("refreshparams");
    $j('#btnRefreshParams').click();

}

//function GetStagRecords(checkLink) {

//    parent.window.loadFrame();

//    $j("#hdnIViewShow").val(checkLink);

//    var key = $j("#hdnKey").val();

//    var tableno = $j("#hdnStagTableNo").val();
//    var totalRecords = $j("#hdnTotalIViewRec").val();
//    if (totalRecords > 20) {
//        if (checkLink == 'More') {
//            try {
//                ASB.WebService.GetNextStagPage(key, tableno, SuccessGetStag);
//            }
//            catch (ex) { AxWaitCursor(false); }
//        }
//        else if (checkLink == 'All') {
//            try {
//                ASB.WebService.GetAllPages(key, tableno, SuccessGetStag);
//            }
//            catch (ex) { AxWaitCursor(false); }
//        }
//    }
//    else {
//        showMore = false;
//        DisableStagLoad();
//        parent.window.closeFrame();
//    }

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
//    }
//    else {
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
//                        }
//                        else
//                            row.find("td").eq(idx).html(colText);
//                    }
//                    else {
//                        if (colText == "Grand Total")
//                            row.find("td").eq(idx - 1).html("");
//                        row.find("td").eq(idx).html(colText);
//                    }
//                    idx++;
//                }
//            }
//        }
//        else {
//            for (var j = 0; j < customer[0].children.length; j++) {
//                var colText = customer[0].children[j].textContent;
//                if (j == 0) {
//                    var htmlString = row.find("td").eq(j).html();
//                    if (htmlString.indexOf("checkbox") > -1) {
//                        row.find("td").eq(j).html(row[0].children[0].innerHTML.replace('value="1"', 'value="' + colText + '"'));
//                    }
//                    else {
//                        row.find("td").eq(j).html(colText);
//                    }
//                }
//                else {
//                    row.find("td").eq(j).html(colText);
//                }
//            }
//        }
//        $j("[id$=GridView1]").append(row);


//    });
//    //Adjustwin();

//    var totalGridRows = $j("#GridView1 tr").length - 1;

//    if ($j("#GridView1 tr:last td:eq(0)").text() == "Grand Total" || $j("#GridView1 tr:last td:eq(1)").text() == "Grand Total" || $j("#GridView1 tr:first td:eq(1)").text() == "Grand Total") {
//        if ($j("#GridView1 tr:last td:eq(0)").text() == "Grand Total") {
//            $j("#GridView1 tr:last td:eq(1)").text("Grand Total");
//            $j("#GridView1 tr:last td:eq(1)").css("color", "DarkGreen");
//            $j("#GridView1 tr:last td:eq(1)").css("font-weight", "bold");
//            $j("#GridView1 tr:last td:eq(0)").text(" ")
//        }
//        else if ($j("#GridView1 tr:last td:eq(1)").text() == "Grand Total") {
//            $j("#GridView1 tr:last td:eq(2)").text("Grand Total");
//            $j("#GridView1 tr:last td:eq(2)").css("color", "DarkGreen");
//            $j("#GridView1 tr:last td:eq(2)").css("font-weight", "bold");
//            $j("#GridView1 tr:last td:eq(1)").text(" ");
//        }
//        totalGridRows = totalGridRows - 1;
//    }
//    var totalRecords = $j("#hdnTotalIViewRec").val();
//    if ($j("#dvSqlPages").is(':visible')) {

//        $j("#lblNoOfRecs").text("Total no of Rows :  " + (totalGridRows) + " of " + totalRecords);
//    }
//    else {
//        if ($j("#dvFilteredRowCount").is(':visible')) {
//            var cutMsg = eval(callParent('lcm[12]'));
//            cutMsg = cutMsg.replace('{0}', totalGridRows).replace('{1}', totalRecords)
//            $j("#lblFilteredRowCount").text(cutMsg);
//        }
//    }
//    if (iViewShowCat == 'All' || totalGridRows == totalRecords) {
//        showMore = false;
//        DisableStagLoad();
//    }
//    parent.window.closeFrame();
//}

//function DisableStagLoad() {
//    var lnkShow = $j("#dvStagLoad").find('a');
//    lnkShow.removeAttr('onclick');
//    lnkShow.removeClass('handCursor');
//    lnkShow.attr("disabled", "disabled");
//    lnkShow.css("color", "GREY");
//}
