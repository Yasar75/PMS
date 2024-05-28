var gllangauge = "";
var uName = "";
var currentIndex = "";
var rowCount = "";
var rowTdValue = "";
var patternValues = new Array();
var rowCellValues = new Array();
var iPatternCount = "";
var iCount = "";
var maxCount = 1;
var draggedRowValue = "";
var calledFrom = "";
var dValue = "";
var droppedItem = "";
var droppedMemberItem = "";

$(document).ready(function () {
    dragandDrop();
});

function dragandDrop() {
    var droppedItemIndex = -1;
    $('.block').draggable({
        helper: "clone",
        cursor: "move"
    });

    $("#DetailsView1").droppable({
        hoverClass: "ui-state-hover",
        drop: function (ev, ui) {
            //var dropped = $(this),
            //droppedRow = dropped.closest('tr');
            //alert(droppedRow.index());

            accept: '.block',
            $(this).find("tbody").append(ui.item);
            droppedItemIndex = $(ui.draggable).index();
            droppedItem = $(".grd-bench tr").eq(droppedItemIndex);
            droppedMemberItem = $(".grd-member tr").eq(droppedItemIndex);
            index = -1;
            //var spcCharIndex = (validateValue.indexOf("-") < validateValue.indexOf("(")) ? validateValue.indexOf("(") : validateValue.indexOf("-")
            draggedRowValue = droppedItem.find("span:nth-child(1)").html();
            //draggedRowValue = draggedRowValue.slice(0, 6);
            //draggedRowValue = draggedRowValue.replace(' ', '');
            draggedRowValue = draggedRowValue + "," + droppedMemberItem.find("span:nth-child(1)").html();

            calledFrom = ui.draggable.context.parentNode.parentNode.className;
            gvRowCount(draggedRowValue, calledFrom);
            //var ss = iCount;
            if (iPatternCount <= maxCount) {
                if (iCount == 1) {
                    var lastTdIndex = parseInt(currentIndex - 1);
                    if (calledFrom == "grd-bench") {
                        $("#DetailsView1").append($("#DetailsView1 tbody>tr:last").clone(true));
                        //alert(droppedItem.find(".bench").html());
                        $("#DetailsView1 tr:eq(" + currentIndex + ")").find(".bench").html(droppedItem.find(".bench").html());
                        $("#DetailsView1 tr:eq(" + currentIndex + ")").find(".bench1").html(currentIndex);

                    }
                    else {
                        //if (currentIndex > 1) {
                        $("#DetailsView1 tr:eq(" + lastTdIndex + ")").find(".member").html(droppedMemberItem.find(".member").html());
                        //}
                        //else {
                        //    $("#DetailsView1").append($("#DetailsView1 tbody>tr:last").clone(true));
                        //    $("#DetailsView1 tr:eq(" + currentIndex + ")").find(".price").html(droppedPriceItem.find(".price").html());
                        //}

                        var Details = {};
                        var members = "";
                        var bench = "";
                        var mCount = $("#DetailsView1 tr:eq(" + lastTdIndex + ")").find(".member").find("span").length;
                        var bCount = $("#DetailsView1 tr:eq(" + lastTdIndex + ")").find(".bench").find("span").length;

                        if (mCount > 0) {
                            for (var m = 0; m < mCount; m++) {
                                members += $("#DetailsView1 tr:eq(" + lastTdIndex + ")").find(".member").find("span:eq(" + m + ")").html() + ",";
                            }
                        }

                        if (bCount > 0) {
                            for (var b = 0; b < bCount; b++) {
                                bench += $("#DetailsView1 tr:eq(" + lastTdIndex + ")").find(".bench").find("span:eq(" + b + ")").html() + ",";
                            }
                        }

                        Details.membersInfo = members + "♣" + bench + "♣" + maxCount;
                        //alert(Details.membersInfo);
                        //Details.Item = $("#DetailsView1 tr:eq(" + lastTdIndex + ")").find("td").find("span:nth-child(1)").html();
                        //Details.ID = $("#DetailsView1 tr:eq(" + lastTdIndex + ")").find("td").find("span:nth-child(2)").html();
                        //Details.Price = $("#DetailsView1 tr:eq(" + lastTdIndex + ")").find("td:nth-child(2)").html();

                        $.ajax({
                            type: "POST",
                            url: "DragAndDrop.aspx/AllocatedMemeberDetails",
                            data: '{details: ' + JSON.stringify(Details) + '}',
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            success: function (response) {
                            }
                        });
                    }
                }
                else {
                    rowCellValues.splice(rowCellValues.length - 1);
                    patternValues.splice(patternValues.length - 1);
                    dValue = dValue.split(',');
                    dValue = dValue[0] + ",";
                    alert("Duplicate allocations are not allowed.");
                    return false;
                }
            }
            else {
                //if (calledFrom == "grd-source") {
                //    alert("Duplicate member entries are not allowed");
                //}
                rowCellValues.splice(rowCellValues.length - 1);
                patternValues.splice(patternValues.length - 1);
                dValue = dValue.split(',');
                dValue = dValue[0] + ",";
                alert("You have exceeded maximum number of allocation");
                return false;
            }
        }
    });
}

function gvRowCount(data, source) {
    var gridID = "#DetailsView1";
    $(gridID + " tr").each(function () {
        if (!this.rowIndex) return;
        else {
            currentIndex = this.rowIndex;
        }
    });

    data = data.split(',');
    if (source == "grd-bench") { //grd-price
        dValue = droppedItem.find("span:nth-child(1)").html();
        patternValues.push(data[0]);
        if (data[0].indexOf("एफ") != -1) {
            maxCount = FBMaxLimit; //. बी
        }
        if (data[0].indexOf("एल") != -1) {
            maxCount = LBMaxLimit;
        }
        if (data[0].indexOf("डी") != -1) {
            maxCount = DBMaxLimit;
        }
        //if (data[0].indexOf("एस") != -1) {
        //    maxCount = SBMaxLimit; 
        //}
        iCount = 1;
        iPatternCount = $.grep(patternValues, function (a) {
            return a == data[0]
        }).length
    }
    else {
        dValue += droppedMemberItem.find("span:nth-child(1)").html() + ",";
        rowCellValues.push(dValue);

        iCount = $.grep(rowCellValues, function (a) {
            return a == dValue
        }).length
    }
}


function SucessResultMessage(result) {
    if (result.indexOf("-") == -1) {
        alert("Allocated-Members details has been saved successfully");
    }
    else {
        alert("Error in save");
    }
}

function PrintAlloMembersList() {
    
    $("#scrollDIV").removeClass("adjustscrl");
    //Get the HTML of div
    var divElements = document.getElementById('Print').innerHTML;
    //Get the HTML of whole page
    var oldPage = document.body.innerHTML;

    //Reset the page's HTML with div's HTML only
    document.body.innerHTML =
      "<html><head></head><body>" +
      divElements + "</body>";

    //Print Page
    window.print();

    //Restore orignal HTML
    document.body.innerHTML = oldPage;
}

