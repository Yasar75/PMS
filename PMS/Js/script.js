$(document).ready(function () {

    $('.box-item').draggable({
        cursor: 'move',
        helper: "clone"
    });

    $("#container1").droppable({
        drop: function (event, ui) {
            var itemid = $(event.originalEvent.toElement).attr("itemid");
            $('.box-item').each(function () {
                if ($(this).attr("itemid") === itemid) {
                    $(this).appendTo("#container1");
                    //alert(itemid);
                }
            });
            //if ($("#spben").text().indexOf(itemid) > -1) {
            //    var myStr = $("#spben").text();
            //    myStr = myStr.replace("," + itemid, '');
            //    //alert(myStr);
            //    $("#spben").text(myStr);
            //    //$('#spben:contains("' + itemid + '")').remove();
            //    //                $("#spben").text(itemid).hide();
            //    // $("#spben").text($("#spben").text() + ',' + itemid);
            //    $("#tbxben").val($("#spben").text());
            //}
        }
    });


    $("#lstWizardLeftMenu").droppable({
        drop: function (event, ui) {
            var itemid = $(event.originalEvent.toElement).attr("itemid");
            $('.box-item').each(function () {
                if ($(this).attr("itemid") === itemid) {
                    $(this).appendTo("#lstWizardLeftMenu");
                    //alert(itemid);
                }
            });
            //if ($("#spben").text().indexOf(itemid) > -1) {
            //    var myStr = $("#spben").text();
            //    myStr = myStr.replace("," + itemid, '');
            //    //alert(myStr);
            //    $("#spben").text(myStr);
            //    //$('#spben:contains("' + itemid + '")').remove();
            //    //                $("#spben").text(itemid).hide();
            //    // $("#spben").text($("#spben").text() + ',' + itemid);
            //    $("#tbxben").val($("#spben").text());
            //}
        }
    });


    $("#container2").droppable({
        drop: function (event, ui) {
            var itemid = $(event.originalEvent.toElement).attr("itemid");
            $('.box-item').each(function () {
                if ($(this).attr("itemid") === itemid) {
                    $(this).appendTo("#container2");
                    //alert(itemid);
                }
            });
            //if ($("#spben").text().indexOf(itemid) > -1) {
            //    var myStr = $("#spben").text();
            //    myStr = myStr.replace("," + itemid, '');
            //    //alert(myStr);
            //    $("#spben").text(myStr);
            //    //$('#spben:contains("' + itemid + '")').remove();
            //    //                $("#spben").text(itemid).hide();
            //    $("#spben").text($("#spben").text() + ',' + itemid);
            //    $("#tbxben").val($("#spben").text());
            //}
            //else {

            //    $("#spben").text($("#spben").text() + ',' + itemid);
            //    $("#tbxben").val($("#spben").text());
            //}
            //alert(SBMaxLimit);

        }


    });

    //New Containers
    $("#container3").droppable({
        drop: function (event, ui) {
            var itemid = $(event.originalEvent.toElement).attr("itemid");
            $('.box-item').each(function () {
                if ($(this).attr("itemid") === itemid) {
                    $(this).appendTo("#container3");
                }
            });

            if ($("#spMem").text().indexOf(itemid) > -1) {
                var myStr = $("#spMem").text();
                myStr = myStr.replace("," + itemid, '');
                //alert(myStr);
                $("#spMem").text(myStr);
                //$('#spben:contains("' + itemid + '")').remove();
                //                $("#spben").text(itemid).hide();
                $("#spMem").text($("#spMem").text() + ',' + itemid);
                $("#tbxMem").val($("#spMem").text());
            }
            else {

                $("#spMem").text($("#spMem").text() + ',' + itemid);
                $("#tbxMem").val($("#spMem").text());
            }


            //var sf = itemid.substr(0, (itemid.length - 1));
            //var sf1 = itemid.substr((itemid.length - 1), (itemid.length));
            //var sf2 = sf + (parseInt(sf1) + 1);
            //document.getElementById(sf2).style.display = 'block';
            //alert(document.getElementById(sf2));


            ////$(this).attr(sf2).hide();
            //if ($("#spMem").text().indexOf(itemid) > -1) {


            //    var myStr = $("#spMem").text();
            //    myStr = myStr.replace("," + itemid, '');
            //    //alert(myStr);
            //    $("#spMem").text(myStr);
            //    //$('#spben:contains("' + itemid + '")').remove();
            //    //                $("#spben").text(itemid).hide();
            //    $("#spMem").text($("#spMem").text() + ',' + itemid);
            //    $("#tbxMem").val($("#spMem").text());
            //}
            //else {
            //    $("#spMem").text($("#spMem").text() + ',' + itemid);
            //    $("#tbxMem").val($("#spMem").text());
            //}
        }
    });
    $("#container4").droppable({
        drop: function (event, ui) {
            var itemid = $(event.originalEvent.toElement).attr("itemid");
            $('.box-item').each(function () {
                if ($(this).attr("itemid") === itemid) {
                    $(this).appendTo("#container4");
                }
            });
            if ($("#spMem").text().indexOf(itemid) > -1) {

                var myStr = $("#spMem").text();
                myStr = myStr.replace("," + itemid, '');
                //alert(myStr);
                $("#spMem").text(myStr);
                //$('#spben:contains("' + itemid + '")').remove();
                //                $("#spben").text(itemid).hide();
                //$("#spMem").text($("#spMem").text() + ',' + itemid);
                $("#tbxMem").val($("#spMem").text());
            }
        }
    });

});

