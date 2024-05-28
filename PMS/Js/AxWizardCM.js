var DbObjData = "";
var DbObjData1 = "";
var mainSqlCM = "";
var mainSqlCM1 = "";
var mainSqlCM2 = "";
var lsstpArr = "";
var lsdropedId = "";
var lstsId = "";
var lstsName = "";
var editParam = "";
var lsPrValue = "";
var propIdEdit = "";
var pageUrl = window.location.href;
//JSON.stringify(parameter)
//Left Menu 
function showTstruct() {

    var pageUrl1 = pageUrl.split("?");
    $.ajax({
        type: 'POST',
        url: pageUrl1[0].toString() + '/callTstruct',
        data: {},
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        success: function (data) {
            if (data.d != "") {
                let saveMsg1 = "";
                let saveMsg = JSON.parse(data.d);
                if (saveMsg.Result.length > 0) {
                    $('#LeftMenu').empty();
                    if ($('#tbxeditPage').val() != "") {
                        $.ajax({
                            type: 'POST',
                            url: pageUrl1[0].toString() + '/returnTSNames',
                            data: {},
                            contentType: "application/json; charset=utf-8",
                            datatype: 'json',
                            success: function (data1) {
                                saveMsg1 = JSON.parse(data1.d);
                                for (i = 0; i < saveMsg.Result.length; i++) {
                                    if (saveMsg1 != "") {
                                        let edCont = saveMsg1.Result[0].Name.split(",");
                                        if (saveMsg1.Result[0].Name.indexOf(saveMsg.Result[i].Caption) != -1) {
                                        }
                                        else {
                                            $('#LeftMenu').append("<div class='portlet'><div class='portlet-header'>" + saveMsg.Result[i].Caption + " (" + saveMsg.Result[i].Name + ")</div><div class='portlet-content'></div><div style='display:none;' id='dvprTS" + i.toString() + "'><p style='display:none;'><b>Tstruct Name: </b><span id='msprTS" + i.toString() + "'>" + saveMsg.Result[i].Name + "</span><span id='ms1prTS" + i.toString() + "'>" + saveMsg.Result[i].Caption + "</span></p><ul id='ulprTS" + i.toString() + "'><li class='createWizard' onclick=\"showParamModal('" + saveMsg.Result[i].Name + "','TS', 'ulprTS" + i.toString() + "');\"><span class='icon-software-pencil modal-icon'></span>Add Param</li></ul></div></div>");
                                            //$('#LeftMenu').append('<div class="portlet"><div class="portlet-header">' + saveMsg.Result[i].Caption + '</div></div>');<ul id='ulprTSS" + i.toString() + "'><li class='createWizard' onclick=\"showScriptModal('" + saveMsg.Result[i].Name + "','TS', 'ulprTSS" + i.toString() + "');\"><span class='icon-software-pencil modal-icon'></span>Add Scripts</li></ul><ul id='ulprTSP" + i.toString() + "'><li class='createWizard' onclick=\"showPropsModal('" + saveMsg.Result[i].Name + "','TS', 'ulprTSP" + i.toString() + "');\"><span class='icon-software-pencil modal-icon'></span>Add Props</li></ul>
                                        }
                                    }
                                    else {
                                        $('#LeftMenu').append("<div class='portlet'><div class='portlet-header'>" + saveMsg.Result[i].Caption + " (" + saveMsg.Result[i].Name + ")</div><div class='portlet-content'></div><div style='display:none;' id='dvprTS" + i.toString() + "'><p style='display:none;'><b>Tstruct Name: </b><span id='msprTS" + i.toString() + "'>" + saveMsg.Result[i].Name + "</span><span id='ms1prTS" + i.toString() + "'>" + saveMsg.Result[i].Caption + "</span></p><ul id='ulprTS" + i.toString() + "'><li class='createWizard' onclick=\"showParamModal('" + saveMsg.Result[i].Name + "','TS', 'ulprTS" + i.toString() + "');\"><span class='icon-software-pencil modal-icon'></span>Add Param</li></ul></div></div>");
                                    }
                                }
                            }
                        });
                    }
                    else {
                        for (i = 0; i < saveMsg.Result.length; i++) {
                            var transId = $('#txttsId').val();
                            var transArr = transId.split(',');
                            var lsAv = "";
                            if (transArr.length > 0) {
                                for (t = 0; t < transArr.length; t++) {
                                    if (saveMsg.Result[i].Name.trim() == transArr[t].toString().trim()) {
                                        lsAv = "1";
                                    }
                                }
                            }
                            if (lsAv == "1") {
                            }
                            else {
                                $('#LeftMenu').append("<div class='portlet'><div class='portlet-header'>" + saveMsg.Result[i].Caption + " (" + saveMsg.Result[i].Name + ")</div><div class='portlet-content'></div><div style='display:none;' id='dvprTS" + i.toString() + "'><p style='display:none;'><b>Tstruct Name: </b><span id='msprTS" + i.toString() + "'>" + saveMsg.Result[i].Name + "</span><span id='ms1prTS" + i.toString() + "'>" + saveMsg.Result[i].Caption + "</span></p><ul id='ulprTS" + i.toString() + "'><li class='createWizard' onclick=\"showParamModal('" + saveMsg.Result[i].Name + "','TS', 'ulprTS" + i.toString() + "');\"><span class='icon-software-pencil modal-icon'></span>Add Param</li></ul></div></div>");
                            }
                        }
                    }
                }
            }
        },
        error: function (data, success, error) {
            alert("Error: " + error);
        }
    });
    return false;
}
function showIview() {
    var pageUrl1 = pageUrl.split("?");
    $.ajax({
        type: 'POST',
        url: pageUrl1[0].toString() + '/callIviews',
        data: {},
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        success: function (data) {
            if (data.d != "") {
                let saveMsg1 = "";
                let saveMsg = JSON.parse(data.d);
                if (saveMsg.Result.length > 0) {
                    $('#LeftMenu').empty();
                    if ($('#tbxeditPage').val() != "") {
                        $.ajax({
                            type: 'POST',
                            url: pageUrl1[0].toString() + '/returnTSNames',
                            data: {},
                            contentType: "application/json; charset=utf-8",
                            datatype: 'json',
                            success: function (data1) {
                                saveMsg1 = JSON.parse(data1.d);
                                for (i = 0; i < saveMsg.Result.length; i++) {
                                    if (saveMsg1 != "") {
                                        let edCont = saveMsg1.Result[0].Name.split(",");
                                        if (saveMsg1.Result[0].Name.indexOf(saveMsg.Result[i].Caption) != -1) {
                                        }
                                        else {
                                            $('#LeftMenu').append("<div class='portlet'><div class='portlet-header'>" + saveMsg.Result[i].Caption + " (" + saveMsg.Result[i].Name + ")</div><div class='portlet-content'></div><div style='display:none;' id='dvprIV" + i.toString() + "'><p style='display:none;'><b>Tstruct Name: </b><span id='msprIV" + i.toString() + "'>" + saveMsg.Result[i].Name + "</span><span id='ms1prIV" + i.toString() + "'>" + saveMsg.Result[i].Caption + "</span></p><ul id='ulprIV" + i.toString() + "'><li class='createWizard' onclick=\"showParamModal('" + saveMsg.Result[i].Name + "','TS', 'ulprIV" + i.toString() + "');\"><span class='icon-software-pencil modal-icon'></span>Add Param</li></ul></div></div>");
                                            //$('#LeftMenu').append('<div class="portlet"><div class="portlet-header">' + saveMsg.Result[i].Caption + '</div></div>');<ul id='ulprTSS" + i.toString() + "'><li class='createWizard' onclick=\"showScriptModal('" + saveMsg.Result[i].Name + "','TS', 'ulprTSS" + i.toString() + "');\"><span class='icon-software-pencil modal-icon'></span>Add Scripts</li></ul><ul id='ulprTSP" + i.toString() + "'><li class='createWizard' onclick=\"showPropsModal('" + saveMsg.Result[i].Name + "','TS', 'ulprTSP" + i.toString() + "');\"><span class='icon-software-pencil modal-icon'></span>Add Props</li></ul>
                                        }
                                    }
                                    else {
                                        $('#LeftMenu').append("<div class='portlet'><div class='portlet-header'>" + saveMsg.Result[i].Caption + " (" + saveMsg.Result[i].Name + ")</div><div class='portlet-content'></div><div style='display:none;' id='dvprIV" + i.toString() + "'><p style='display:none;'><b>Tstruct Name: </b><span id='msprIV" + i.toString() + "'>" + saveMsg.Result[i].Name + "</span><span id='ms1prIV" + i.toString() + "'>" + saveMsg.Result[i].Caption + "</span></p><ul id='ulprIV" + i.toString() + "'><li class='createWizard' onclick=\"showParamModal('" + saveMsg.Result[i].Name + "','TS', 'ulprIV" + i.toString() + "');\"><span class='icon-software-pencil modal-icon'></span>Add Param</li></ul></div></div>");
                                    }
                                }
                            }
                        });
                    }
                    else {

                        for (i = 0; i < saveMsg.Result.length; i++) {

                            var transId = $('#txttsId').val();
                            var transArr = transId.split(',');
                            var lsAv = "";
                            if (transArr.length > 0) {
                                for (t = 0; t < transArr.length; t++) {
                                    if (saveMsg.Result[i].Name.trim() == transArr[t].toString().trim()) {
                                        lsAv = "1";
                                    }
                                }
                            }
                            if (lsAv == "1") {
                            }
                            else {
                                $('#LeftMenu').append("<div class='portlet'><div class='portlet-header'>" + saveMsg.Result[i].Caption + " (" + saveMsg.Result[i].Name + ")</div><div class='portlet-content'></div><div style='display:none;' id='dvprIV" + i.toString() + "'><p style='display:none;'><b>Tstruct Name: </b><span id='msprIV" + i.toString() + "'>" + saveMsg.Result[i].Name + "</span><span id='ms1prIV" + i.toString() + "'>" + saveMsg.Result[i].Caption + "</span></p><ul id='ulprIV" + i.toString() + "'><li class='createWizard' onclick=\"showParamModal('" + saveMsg.Result[i].Name + "','TS', 'ulprIV" + i.toString() + "');\"><span class='icon-software-pencil modal-icon'></span>Add Param</li></ul></div></div>");
                            }
                        }
                    }
                }
            }
        },
        error: function (data, success, error) {
            alert("Error: " + error);
        }
    });
    return false;
}
function showPaymentGatewy() {
    var pageUrl1 = pageUrl.split("?");
    $.ajax({
        type: 'POST',
        url: pageUrl1[0].toString() + '/callPaymentGateWay',
        data: {},
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        success: function (data) {
            if (data.d != "") {
                let saveMsg = JSON.parse(data.d);
                if (saveMsg.Result.length > 0) {
                    $('#LeftMenu').empty();
                    for (i = 0; i < saveMsg.Result.length; i++) {
                        // $('#LeftMenu').append("<div class='portlet'><div class='portlet-header'>" + saveMsg.Result[i].Caption + "</div><div class='portlet-content'><p>Payment Gateway Name: " + saveMsg.Result[i].Caption + "</p><ul id='ulprPG" + i.toString() + "'><li class='createWizard' onclick=\"showParamModal('" + saveMsg.Result[i].Name + "','PG','ulprPG" + i.toString() + "');\"><span class='icon-software-pencil modal-icon'></span>Add Param</li><li class='createWizard' data-toggle='modal' data-target='#myModalScript'><span class='icon-software-pencil modal-icon'></span>Add Scripts</li><li class='createWizard' data-toggle='modal' data-target='#myModalProps'><span class='icon-software-pencil modal-icon'></span>Add Props</li></ul></div></div>");
                        $('#LeftMenu').append("<div class='portlet'><div class='portlet-header'>" + saveMsg.Result[i].Caption + "</div><div class='portlet-content'><p><b>Payment Gateway Name: </b><span id='msprPG" + i.toString() + "'>" + saveMsg.Result[i].Name + "</span><span id='ms1prPG" + i.toString() + "'>" + saveMsg.Result[i].Caption + "</span></p><ul id='ulprPG" + i.toString() + "'><li class='createWizard' onclick=\"showParamModal('" + saveMsg.Result[i].Name + "','PG', 'ulprPG" + i.toString() + "');\"><span class='icon-software-pencil modal-icon'></span>Add Param</li></ul><ul id='ulprPGS" + i.toString() + "'><li class='createWizard' onclick=\"showScriptModal('" + saveMsg.Result[i].Name + "','PG', 'ulprPGS" + i.toString() + "');\"><span class='icon-software-pencil modal-icon'></span>Add Scripts</li></ul><ul id='ulprPGP" + i.toString() + "'><li class='createWizard' onclick=\"showPropsModal('" + saveMsg.Result[i].Name + "','PG', 'ulprPGP" + i.toString() + "');\"><span class='icon-software-pencil modal-icon'></span>Add Props</li></ul></div></div>");
                        //$('#LeftMenu').append('<div class="portlet"><div class="portlet-header">' + saveMsg.Result[i].Caption + '</div></div>');
                    }
                }

            }
        },
        error: function (data, success, error) {
            alert("Error: " + error);
        }
    });
    return false;
}

function showPageDtl() {

    var pageUrl1 = pageUrl.split("?");
    $.ajax({
        type: 'POST',
        url: pageUrl1[0].toString() + '/callPageDtl',
        data: {},
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        success: function (data) {
            if (data.d != "") {
                let saveMsg = JSON.parse(data.d);
                if (saveMsg.Result.length > 0) {
                    $('#LeftMenu').empty();
                    for (i = 0; i < saveMsg.Result.length; i++) {
                        // $('#LeftMenu').append("<div class='portlet'><div class='portlet-header'>" + saveMsg.Result[i].Caption + "</div><div class='portlet-content'><p>Payment Gateway Name: " + saveMsg.Result[i].Caption + "</p><ul id='ulprPG" + i.toString() + "'><li class='createWizard' onclick=\"showParamModal('" + saveMsg.Result[i].Name + "','PG','ulprPG" + i.toString() + "');\"><span class='icon-software-pencil modal-icon'></span>Add Param</li><li class='createWizard' data-toggle='modal' data-target='#myModalScript'><span class='icon-software-pencil modal-icon'></span>Add Scripts</li><li class='createWizard' data-toggle='modal' data-target='#myModalProps'><span class='icon-software-pencil modal-icon'></span>Add Props</li></ul></div></div>");
                        $('#LeftMenu').append("<div class='portlet'><div class='portlet-header'>" + saveMsg.Result[i].Caption + "</div><div class='portlet-content'><p><b>Payment Gateway Name: </b><span id='msprPG" + i.toString() + "'>" + saveMsg.Result[i].Name + "</span><span id='ms1prPG" + i.toString() + "'>" + saveMsg.Result[i].Caption + "</span></p><ul id='ulprPG" + i.toString() + "'><li class='createWizard' onclick=\"showParamModal('" + saveMsg.Result[i].Name + "','PG', 'ulprPG" + i.toString() + "');\"><span class='icon-software-pencil modal-icon'></span>Add Param</li></ul><ul id='ulprPGS" + i.toString() + "'><li class='createWizard' onclick=\"showScriptModal('" + saveMsg.Result[i].Name + "','PG', 'ulprPGS" + i.toString() + "');\"><span class='icon-software-pencil modal-icon'></span>Add Scripts</li></ul><ul id='ulprPGP" + i.toString() + "'><li class='createWizard' onclick=\"showPropsModal('" + saveMsg.Result[i].Name + "','PG', 'ulprPGP" + i.toString() + "');\"><span class='icon-software-pencil modal-icon'></span>Add Props</li></ul></div></div>");
                        //$('#LeftMenu').append('<div class="portlet"><div class="portlet-header">' + saveMsg.Result[i].Caption + '</div></div>');
                    }
                }

            }
        },
        error: function (data, success, error) {
            alert("Error: " + error);
        }
    });
    return false;
}

//Right panel in Edit Mode
function showTstructEditRight() {

    var pageUrl1 = pageUrl.split("?");
    $.ajax({
        type: 'POST',
        url: pageUrl1[0].toString() + '/callTstruct',
        data: {},
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        success: function (data) {
            if (data.d != "") {
                let saveMsg1 = "";
                let saveMsg = JSON.parse(data.d);
                if (saveMsg.Result.length > 0) {
                    if ($('#tbxeditPage').val() != "") {
                        $.ajax({
                            type: 'POST',
                            url: pageUrl1[0].toString() + '/returnTSNames',
                            data: {},
                            contentType: "application/json; charset=utf-8",
                            datatype: 'json',
                            success: function (data1) {
                                saveMsg1 = JSON.parse(data1.d);
                                let k = 0;
                                var propId = $('#txtdropedId').val();
                                for (i = 0; i < saveMsg.Result.length; i++) {
                                    if (saveMsg1 != "") {
                                        let edCont = saveMsg1.Result[0].Name.split(",");
                                        if (saveMsg1.Result[0].Name.indexOf(saveMsg.Result[i].Caption) != -1) {
                                            k += 1;
                                            //$('#rightMenu').append("<div class='portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all' style=''><div class='portlet-header ui-widget-header ui-corner-all'><span class='ui-icon ui-icon-minusthick portlet-toggle'></span><input type='hidden' id='tab0" + k.toString() + "' name='tab0" + k.toString() + "' value='" + k.toString() + "'>" + saveMsg.Result[i].Caption + " (" + saveMsg.Result[i].Name + ")</div><div class='portlet-content'></div><div style='display: block;' id='dvprTS" + i.toString() + "'><p style='display:none;'><b>Tstruct Name: </b><span id='msprTS" + i.toString() + "'>" + saveMsg.Result[i].Name + "</span><span id='ms1prTS" + i.toString() + "'>" + saveMsg.Result[i].Caption + "</span></p><ul id='ulprTS" + i.toString() + "'><li class='createWizard' onclick=\"showParamModal('" + saveMsg.Result[i].Name + "','TS', 'ulprTS" + i.toString() + "');\"><span class='icon-software-pencil modal-icon'></span>Add Param</li></ul></div></div>");
                                            if (propId == "") {
                                                propId = "ulprTS" + i.toString();
                                            }
                                            else {
                                                propId = propId + ",ulprTS" + i.toString();
                                            }
                                            //$('#rightMenu').append("<div class='portlet'><div class='portlet-header'>" + saveMsg.Result[i].Caption + " (" + saveMsg.Result[i].Name + ")</div><div class='portlet-content'></div><div style='display:none;' id='dvprTS" + i.toString() + "'><p style='display:none;'><b>Tstruct Name: </b><span id='msprTS" + i.toString() + "'>" + saveMsg.Result[i].Name + "</span><span id='ms1prTS" + i.toString() + "'>" + saveMsg.Result[i].Caption + "</span></p><ul id='ulprTS" + i.toString() + "'><li class='createWizard' onclick=\"showParamModal('" + saveMsg.Result[i].Name + "','TS', 'ulprTS" + i.toString() + "');\"><span class='icon-software-pencil modal-icon'></span>Add Param</li></ul></div></div>");
                                        }
                                    }
                                }
                                $('#txtdropedId').val(propId);
                                showIviewEditRight();
                                //showeditContent();
                            }
                        });
                    }
                }
            }
        },
        error: function (data, success, error) {
            alert("Error: " + error);
        }
    });
    return false;
}
function showIviewEditRight() {
    var pageUrl1 = pageUrl.split("?");
    $.ajax({
        type: 'POST',
        url: pageUrl1[0].toString() + '/callIviews',
        data: {},
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        success: function (data) {
            if (data.d != "") {
                let saveMsg1 = "";
                let saveMsg = JSON.parse(data.d);
                if (saveMsg.Result.length > 0) {
                    if ($('#tbxeditPage').val() != "") {
                        $.ajax({
                            type: 'POST',
                            url: pageUrl1[0].toString() + '/returnTSNames',
                            data: {},
                            contentType: "application/json; charset=utf-8",
                            datatype: 'json',
                            success: function (data1) {
                                saveMsg1 = JSON.parse(data1.d);
                                let k = 0;
                                var propId = $('#txtdropedId').val();
                                for (i = 0; i < saveMsg.Result.length; i++) {
                                    if (saveMsg1 != "") {
                                        let edCont = saveMsg1.Result[0].Name.split(",");
                                        if (saveMsg1.Result[0].Name.indexOf(saveMsg.Result[i].Caption) != -1) {
                                            k += 1;
                                            // $('#rightMenu').append("<div class='portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all' style=''><div class='portlet-header ui-widget-header ui-corner-all'><span class='ui-icon ui-icon-minusthick portlet-toggle'></span><input type='hidden' id='tab0" + k.toString() + "' name='tab0" + k.toString() + "' value='" + k.toString() + "'>" + saveMsg.Result[i].Caption + " (" + saveMsg.Result[i].Name + ")</div><div class='portlet-content'></div><div style='display: block;' id='dvprIV" + i.toString() + "'><p style='display:none;'><b>IVtruct Name: </b><span id='msprIV" + i.toString() + "'>" + saveMsg.Result[i].Name + "</span><span id='ms1prIV" + i.toString() + "'>" + saveMsg.Result[i].Caption + "</span></p><ul id='ulprIV" + i.toString() + "'><li class='createWizard' onclick=\"showParamModal('" + saveMsg.Result[i].Name + "','IV', 'ulprIV" + i.toString() + "');\"><span class='icon-software-pencil modal-icon'></span>Add Param</li></ul></div></div>");
                                            if (propId == "") {
                                                propId = "ulprIV" + i.toString();
                                            }
                                            else {
                                                propId = propId + ",ulprIV" + i.toString();
                                            }
                                            //$('#rightMenu').append("<div class='portlet'><div class='portlet-header'>" + saveMsg.Result[i].Caption + " (" + saveMsg.Result[i].Name + ")</div><div class='portlet-content'></div><div style='display:none;' id='dvprIV" + i.toString() + "'><p style='display:none;'><b>Tstruct Name: </b><span id='msprIV" + i.toString() + "'>" + saveMsg.Result[i].Name + "</span><span id='ms1prIV" + i.toString() + "'>" + saveMsg.Result[i].Caption + "</span></p><ul id='ulprIV" + i.toString() + "'><li class='createWizard' onclick=\"showParamModal('" + saveMsg.Result[i].Name + "','TS', 'ulprIV" + i.toString() + "');\"><span class='icon-software-pencil modal-icon'></span>Add Param</li></ul></div></div>");
                                        }
                                    }
                                }
                                if (saveMsg1 != "") {
                                    $('#txtdropedId').val(propId);
                                    showeditContent();
                                }
                            }
                        });
                    }
                }
            }
        },
        error: function (data, success, error) {
            alert("Error: " + error);
        }
    });
    return false;
}

function showeditContent() {
    var pageUrl1 = pageUrl.split("?");
    var pgTitle = "";
    if ($('#tbxeditPage').val() != "") {
        pgTitle = $('#tbxeditPage').val();
        $('#tbxPageTitle').val(pgTitle);
        $.ajax({
            type: 'POST',
            url: pageUrl1[0].toString() + '/returnTSNames',
            data: {},
            contentType: "application/json; charset=utf-8",
            datatype: 'json',
            success: function (data1) {
                saveMsg1 = JSON.parse(data1.d);
                let k = 0;
                var tsId = "";
                var tsName = "";
                if (saveMsg1 != "") {
                    let edContName = saveMsg1.Result[0].Name.split(",");
                    let edContCode = saveMsg1.Result[0].Code.split(",");
                    let edContCType = saveMsg1.Result[0].CbType.split(",");
                    let edlsParam = saveMsg1.Result[0].lsParam.split("~");
                    let edPropId = $('#txtdropedId').val().split(",");
                    var prodIdDtl = "";
                    if (edContName.length > 0) {
                        for (j = 0; j < edContName.length; j++) {
                            for (k = 0; k < edPropId.length; k++) {
                                if (edPropId[k].toString().indexOf("TS") != -1 && edContCType[j].toString() == "TSTRUCT") {
                                    if (prodIdDtl == "") {
                                        prodIdDtl = edPropId[k].toString();
                                    }
                                    else {
                                        prodIdDtl = prodIdDtl + "," + edPropId[k].toString();
                                    }
                                }
                                else if (edPropId[k].toString().indexOf("IV") != -1 && edContCType[j].toString() == "IVIEW") {
                                    if (prodIdDtl == "") {
                                        prodIdDtl = edPropId[k].toString();
                                    }
                                    else {
                                        prodIdDtl = prodIdDtl + "," + edPropId[k].toString();
                                    }
                                }
                            }
                        }
                        $('#txtdropedId').val('');
                        $('#txtdropedId').val(prodIdDtl);
                        let edPropId1 = $('#txtdropedId').val().split(",");
                        for (i = 0; i < edContName.length; i++) {
                            k += 1;
                            if (tsId == "") {
                                tsId = edContCode[i].toString();
                                tsName = edContName[i].toString();
                            }
                            else {
                                tsId = tsId + "," + edContCode[i].toString();
                                tsName = tsName + "," + edContName[i].toString();
                            }
                            //alert($('#txtdropedId').val());

                            if (edContCType[i].toString() == "TSTRUCT") {
                                if (edlsParam[i].toString() == "-") {
                                    $('#rightMenu').append("<div class='portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all' style=''><div class='portlet-header ui-widget-header ui-corner-all'><span class='ui-icon ui-icon-minusthick portlet-toggle' style='display:none;'></span><span>" + k.toString() + "&nbsp;-&nbsp;</span><input type='hidden' id='tab0" + k.toString() + "' name='tab0" + k.toString() + "' value='" + k.toString() + "'>" + edContName[i].toString() + " (" + edContCode[i].toString() + ")<span style='float:right;'><i class='fa fa-times' aria-hidden='true' onclick=\"removecurrent('" + edPropId1[i].toString() + "')\"></i></span></div><div class='portlet-content'></div><div style='display: block;' id='" + edPropId1[i].toString().replace("ul", "dv") + "'><p style='display:none;'><b>Tstruct Name: </b><span id='" + edPropId1[i].toString().replace("ul", "ms") + "'>" + edContCode[i].toString() + "</span><span id='" + edPropId1[i].toString().replace("ul", "ms1") + "'>" + edContName[i].toString() + "</span></p><ul id='" + edPropId1[i].toString() + "'><li class='createWizard' onclick=\"showParamModal('" + edContCode[i].toString() + "','TS', '" + edPropId1[i].toString() + "');\"><span class='icon-software-pencil modal-icon'></span>Add Param</li></ul></div></div>");
                                }
                                else {
                                    $('#rightMenu').append("<div class='portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all' style=''><div class='portlet-header ui-widget-header ui-corner-all'><span class='ui-icon ui-icon-minusthick portlet-toggle' style='display:none;'></span><span>" + k.toString() + "&nbsp;-&nbsp;</span><input type='hidden' id='tab0" + k.toString() + "' name='tab0" + k.toString() + "' value='" + k.toString() + "'>" + edContName[i].toString() + " (" + edContCode[i].toString() + ")<span style='float:right;'><i class='fa fa-times' aria-hidden='true' onclick=\"removecurrent('" + edPropId1[i].toString() + "')\"></i></span></div><div class='portlet-content'></div><div style='display: block;' id='" + edPropId1[i].toString().replace("ul", "dv") + "'><p style='display:none;'><b>Tstruct Name: </b><span id='" + edPropId1[i].toString().replace("ul", "ms") + "'>" + edContCode[i].toString() + "</span><span id='" + edPropId1[i].toString().replace("ul", "ms1") + "'>" + edContName[i].toString() + "</span></p><ul id='" + edPropId1[i].toString() + "'><span id='" + edPropId1[i].toString().replace("ul", "sp") + "'><b>Parameters Detail: </b>" + edlsParam[i].toString() + "</span><ul id='" + edPropId1[i].toString().replace("ul", "ulEdit") + "'><li class='createWizard' onclick=\"showParamModalEdit('" + edlsParam[i].toString() + "','" + edPropId1[i].toString().replace("ulpr", "") + "', '" + edPropId1[i].toString() + "');\"><span class='icon-software-pencil modal-icon'></span>Edit Param</li><li class='createWizard' onclick=\"showParamModalDelete('" + edlsParam[i].toString() + "','" + edPropId1[i].toString().replace("ulpr", "") + "', '" + edPropId1[i].toString() + "');\"><span class='icon-software-pencil modal-icon'></span>Remove Param</li></ul></ul></div></div>");
                                }
                            }
                            else if (edContCType[i].toString() == "IVIEW") {
                                if (edlsParam[i].toString() == "-") {
                                    $('#rightMenu').append("<div class='portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all' style=''><div class='portlet-header ui-widget-header ui-corner-all'><span class='ui-icon ui-icon-minusthick portlet-toggle' style='display:none;'></span><span>" + k.toString() + "&nbsp;-&nbsp;</span><input type='hidden' id='tab0" + k.toString() + "' name='tab0" + k.toString() + "' value='" + k.toString() + "'>" + edContName[i].toString() + " (" + edContCode[i].toString() + ")<span style='float:right;'><i class='fa fa-times' aria-hidden='true' onclick=\"removecurrent('" + edPropId1[i].toString() + "')\"></i></span></div><div class='portlet-content'></div><div style='display: block;' id='" + edPropId1[i].toString().replace("ul", "dv") + "'><p style='display:none;'><b>Iview Name: </b><span id='" + edPropId1[i].toString().replace("ul", "ms") + "'>" + edContCode[i].toString() + "</span><span id='" + edPropId1[i].toString().replace("ul", "ms1") + "'>" + edContName[i].toString() + "</span></p><ul id='" + edPropId1[i].toString() + "'><li class='createWizard' onclick=\"showParamModal('" + edContCode[i].toString() + "','IV', '" + edPropId1[i].toString() + "');\"><span class='icon-software-pencil modal-icon'></span>Add Param</li></ul></div></div>");
                                }
                                else {
                                    $('#rightMenu').append("<div class='portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all' style=''><div class='portlet-header ui-widget-header ui-corner-all'><span class='ui-icon ui-icon-minusthick portlet-toggle' style='display:none;'></span><span>" + k.toString() + "&nbsp;-&nbsp;</span><input type='hidden' id='tab0" + k.toString() + "' name='tab0" + k.toString() + "' value='" + k.toString() + "'>" + edContName[i].toString() + " (" + edContCode[i].toString() + ")<span style='float:right;'><i class='fa fa-times' aria-hidden='true' onclick=\"removecurrent('" + edPropId1[i].toString() + "')\"></i></span></div><div class='portlet-content'></div><div style='display: block;' id='" + edPropId1[i].toString().replace("ul", "dv") + "'><p style='display:none;'><b>Iview Name: </b><span id='" + edPropId1[i].toString().replace("ul", "ms") + "'>" + edContCode[i].toString() + "</span><span id='" + edPropId1[i].toString().replace("ul", "ms1") + "'>" + edContName[i].toString() + "</span></p><ul id='" + edPropId1[i].toString() + "'><span id='" + edPropId1[i].toString().replace("ul", "sp") + "'><b>Parameters Detail: </b>" + edlsParam[i].toString() + "</span><ul id='" + edPropId1[i].toString().replace("ul", "ulEdit") + "'><li class='createWizard' onclick=\"showParamModalEdit('" + edlsParam[i].toString() + "','" + edPropId1[i].toString().replace("ulpr", "") + "', '" + edPropId1[i].toString() + "');\"><span class='icon-software-pencil modal-icon'></span>Edit Param</li><li class='createWizard' onclick=\"showParamModalDelete('" + edlsParam[i].toString() + "','" + edPropId1[i].toString().replace("ulpr", "") + "', '" + edPropId1[i].toString() + "');\"><span class='icon-software-pencil modal-icon'></span>Remove Param</li></ul></ul></div></div>");
                                }
                            }
                        }
                    }

                    $('#txttsName').val(tsName);
                    $('#txttsId').val(tsId);
                    $("#txtParam").val('');
                    var txttsDtl = $('#txttsId').val();
                    var txtprpDtl = $('#txtdropedId').val();
                    if (txttsDtl != "") {
                        var lslts = txttsDtl.split(",");
                        var lsprts = txtprpDtl.split(",");
                        if (lslts.length > 0) {
                            if (lslts.length >= 1) {
                                $("#ddlResParam").empty();
                                $("#ddlRParam").empty();
                                $("#ddlRParam").append($("<option></option>").val('0').html('--Select--'));
                                $("#ddlResParam").append($("<option></option>").val('0').html('--Select--'));
                                //$("#ddlRParam").append($("<option></option>").val('Action').html('Action'));
                                //$("#ddlResParam").append($("<option></option>").val('Load').html('Load'));
                                //$("#ddlResParam").append($("<option></option>").val('Open').html('Open'));
                                getGlobalParam();
                                for (j = 1; j < lslts.length; j++) {
                                    if (lsprts[j].indexOf("TS") != -1) {
                                        getParam(lslts[j].toString(), "TS");
                                    }
                                    else if (lsprts[j].indexOf("IV") != -1) {
                                        getParam(lslts[j].toString(), "IV");
                                    }
                                }
                                for (i = 0; i < lslts.length - 1; i++) {
                                    if (lsprts[i].indexOf("TS") != -1) {
                                        getParamS(lslts[i].toString(), "TS");
                                    }
                                    else if (lsprts[i].indexOf("IV") != -1) {
                                        getParamS(lslts[i].toString(), "IV");
                                    }
                                }
                            }
                            if (lslts.length == 1) {
                                $("#ddlResParam").empty();
                                $("#ddlRParam").empty();
                                $("#ddlRParam").append($("<option></option>").val('0').html('--Select--'));
                                $("#ddlResParam").append($("<option></option>").val('0').html('--Select--'));
                                //$("#ddlRParam").append($("<option></option>").val('Action').html('Action'));
                                //$("#ddlResParam").append($("<option></option>").val('Load').html('Load'));
                                //$("#ddlResParam").append($("<option></option>").val('Open').html('Open'));
                                getGlobalParam();
                                for (k = 0; k < lslts.length; k++) {
                                    if (lsprts[k].indexOf("TS") != -1) {
                                        getParam(lslts[k].toString(), "TS");
                                    }
                                    else if (lsprts[k].indexOf("IV") != -1) {
                                        getParam(lslts[k].toString(), "IV");
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }
}


///Publish Page
function publishPage() {

    var lsPageTitle = $("#tbxPageTitle").val();
    var lsDescription = $("#tbxDescription").val();
    var lsPropId = $("#txtdropedId").val();
    var lsstId = $("#txttsId").val();
    var lsstName = $("#txttsName").val();
    var lsparam = "";
    var lsCbType = "";
    if (lsPropId != "") {
        var propVal = lsPropId.split(",");
        if (propVal.length > 0) {
            for (i = 0; i < propVal.length; i++) {
                var lsId = propVal[i].toString().replace("ul", "sp");
                if (lsId.indexOf("TS") != -1) {
                    if (lsCbType == "") {
                        lsCbType = "TSTRUCT";
                    }
                    else {
                        lsCbType = lsCbType + ",TSTRUCT";
                    }
                }
                else if (lsId.indexOf("IV") != -1) {
                    if (lsCbType == "") {
                        lsCbType = "IVIEW";
                    }
                    else {
                        lsCbType = lsCbType + ",IVIEW";
                    }
                }
                else if (lsId.indexOf("PG") != -1) {
                    if (lsCbType == "") {
                        lsCbType = "PAYMENT GATEWAY";
                    }
                    else {
                        lsCbType = lsCbType + ",PAYMENT GATEWAY";
                    }
                }
                var lsParamDtl = document.getElementById(lsId);
                if (lsParamDtl != null) {
                    if (lsparam == "") {
                        lsparam = lsParamDtl.innerHTML.replace("<b>Parameters Detail: </b>", "");
                    }
                    else {
                        lsparam = lsparam + "~" + lsParamDtl.innerHTML.replace("<b>Parameters Detail: </b>", "");
                    }
                }
                else {
                    if (lsparam == "") {
                        lsparam = "-";
                    }
                    else {
                        lsparam = lsparam + "~-";
                    }
                }
            }
        }
    }

    var pageUrl1 = pageUrl.split("?");
    $.ajax({
        type: 'POST',
        url: pageUrl1[0].toString() + '/setPageSave',
        data: JSON.stringify({ lsPagetitle: lsPageTitle, lsDecsription: lsDescription, lsPTitle: lsstName, lsSType: lsCbType, lspCaption: lsstName, lsPName: lsstId, lsParameter: lsparam }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        success: function (data) {
            //alert(data.d);
            if (data.d.indexOf("Page published successfully") != -1) {
                $("[data-dismiss=modal]").trigger({ type: "click" });
                $("#myModalPublish").hide();
                alert(data.d);
                window.location.href = pageUrl;
            }
            else {
                alert(data.d + "!");
            }
        },
        error: function (data, success, error) {
            alert("Error: " + error);
        }
    });
    return false;


    //var lsPropId = $("#txtdropedId").val();
}

///Get Param value and edit delete
function showParamModalEdit(lsStr, lsStr1, lsStr2) {
    $("#txtParaVal").val(lsStr2);
    mainSqlCM.setValue(lsStr);
    $("#txtParam").val(lsStr);
    var lscheckO = "";
    var txttsDtl = $('#txttsId').val();
    var txtprpDtl = $('#txtdropedId').val();
    var txtprpDtlSplit = txtprpDtl.split(",");
    if (txtprpDtlSplit[0].toString() == lsStr2) {
        lscheckO = "0";
    }
    else {
        lscheckO = "1";
    }

    if (txttsDtl != "") {
        var lslts = txttsDtl.split(",");
        var lsprts = txtprpDtl.split(",");
        if (lslts.length > 0) {
            if (lscheckO == "1") {
                if (lslts.length >= 1) {
                    $("#ddlResParam").empty();
                    $("#ddlRParam").empty();
                    $("#ddlRParam").append($("<option></option>").val('0').html('--Select--'));
                    $("#ddlResParam").append($("<option></option>").val('0').html('--Select--'));
                    //$("#ddlRParam").append($("<option></option>").val('Action').html('Action'));
                    //$("#ddlResParam").append($("<option></option>").val('Load').html('Load'));
                    //$("#ddlResParam").append($("<option></option>").val('Open').html('Open'));
                    // getGlobalParam();
                    for (j = 1; j < lslts.length; j++) {
                        if (lsprts[j].indexOf("TS") != -1) {
                            getParam(lslts[j].toString(), "TS");
                        }
                        else if (lsprts[j].indexOf("IV") != -1) {
                            getParam(lslts[j].toString(), "IV");
                        }
                    }
                    for (i = 0; i < lslts.length - 1; i++) {
                        if (lsprts[i].indexOf("TS") != -1) {
                            getParamS(lslts[i].toString(), "TS");
                        }
                        else if (lsprts[i].indexOf("IV") != -1) {
                            getParamS(lslts[i].toString(), "IV");
                        }
                    }
                }
            }
            if (lslts.length == 1 || lscheckO == "0") {
                $("#ddlResParam").empty();
                $("#ddlRParam").empty();
                $("#ddlRParam").append($("<option></option>").val('0').html('--Select--'));
                $("#ddlResParam").append($("<option></option>").val('0').html('--Select--'));
                //$("#ddlRParam").append($("<option></option>").val('Action').html('Action'));
                //$("#ddlResParam").append($("<option></option>").val('Load').html('Load'));
                //$("#ddlResParam").append($("<option></option>").val('Open').html('Open'));
                getGlobalParam();
                for (k = 0; k < lslts.length; k++) {
                    if (lsprts[k].indexOf("TS") != -1) {
                        getParam(lslts[k].toString(), "TS");
                    }
                    else if (lsprts[k].indexOf("IV") != -1) {
                        getParam(lslts[k].toString(), "IV");
                    }
                }
            }
        }
    }

    var tablecont = "";
    var paramSplit = $("#txtParam").val().split(",");
    if (paramSplit.length > 0) {
        $("#divTbl").empty();
        tablecont = tablecont + "<table cellpadding='0' cellspacing='0' border='0' width='100 % ' class='table table-light table-striped table-hover'><tr><th>S No.</th><th>Target Field/Param</th><th>Source Field/Param</th><th>Edit</th><th>Delete</th></tr>";
        for (i = 0; i < paramSplit.length; i++) {
            tablecont = tablecont + "<tr>";
            var paramValSplit = paramSplit[i].toString().split("=");
            if (paramValSplit.length > 1) {
                tablecont = tablecont + "<td>" + (i + 1).toString() + "</td><td>" + paramValSplit[1].toString() + "</td><td>" + paramValSplit[0].toString() + "</td><td><a href='javascript:void();' onclick=\"editParamVal('" + paramSplit[i].toString() + "')\">Edit</a></td><td><a href='javascript:void();' onclick=\"deleteParamVal('" + paramSplit[i].toString() + "')\">Delete</a></td>";
            }
            tablecont = tablecont + "</tr>";
        }
        tablecont = tablecont + "</table>";
    }
    $("#divTbl").append(tablecont);
    $("#myModal").modal();
}
function showParamModalDelete(lsStr, lsStr1, lsStr2) {

    var frmId = lsStr2.replace("ul", "ms" + '');
    var frmVal = document.getElementById(frmId).innerText;
    $('#' + lsStr2 + '').empty();
    $('#' + lsStr2 + '').append("<ul id='" + lsStr2 + "'><li class='createWizard' onclick=\"showParamModal('" + frmVal + "','" + lsStr1 + "', '" + lsStr2 + "');\"><span class='icon-software-pencil modal-icon'></span>Add Param</li></ul>");
    $("#txtParam").val('');
    mainSqlCM.setValue('');
}
function showParamModal(lsStr, lsStr1, lsStr2) {
    $("#txtParam").val('');
    var lscheckO = "";
    var txttsDtl = $('#txttsId').val();
    var txtprpDtl = $('#txtdropedId').val();
    var txtprpDtlSplit = txtprpDtl.split(",");
    if (txtprpDtlSplit[0].toString() == lsStr2) {
        lscheckO = "0";
    }
    else {
        lscheckO = "1";
    }

    if (txttsDtl != "") {
        var lslts = txttsDtl.split(",");
        var lsprts = txtprpDtl.split(",");
        if (lslts.length > 0) {
            if (lscheckO == "1") {
                if (lslts.length >= 1) {
                    $("#ddlResParam").empty();
                    $("#ddlRParam").empty();
                    $("#ddlRParam").append($("<option></option>").val('0').html('--Select--'));
                    $("#ddlResParam").append($("<option></option>").val('0').html('--Select--'));
                    //$("#ddlRParam").append($("<option></option>").val('Action').html('Action'));
                    //$("#ddlResParam").append($("<option></option>").val('Load').html('Load'));
                    //$("#ddlResParam").append($("<option></option>").val('Open').html('Open'));
                    // getGlobalParam();
                    for (j = 1; j < lslts.length; j++) {
                        if (lsprts[j].indexOf("TS") != -1) {
                            getParam(lslts[j].toString(), "TS");
                        }
                        else if (lsprts[j].indexOf("IV") != -1) {
                            getParam(lslts[j].toString(), "IV");
                        }
                    }
                    for (i = 0; i < lslts.length - 1; i++) {
                        if (lsprts[i].indexOf("TS") != -1) {
                            getParamS(lslts[i].toString(), "TS");
                        }
                        else if (lsprts[i].indexOf("IV") != -1) {
                            getParamS(lslts[i].toString(), "IV");
                        }
                    }
                }
            }
            if (lslts.length == 1 || lscheckO == "0") {
                $("#ddlResParam").empty();
                $("#ddlRParam").empty();
                $("#ddlRParam").append($("<option></option>").val('0').html('--Select--'));
                $("#ddlResParam").append($("<option></option>").val('0').html('--Select--'));
                //$("#ddlRParam").append($("<option></option>").val('Action').html('Action'));
                //$("#ddlResParam").append($("<option></option>").val('Load').html('Load'));
                //$("#ddlResParam").append($("<option></option>").val('Open').html('Open'));
                getGlobalParam();
                for (k = 0; k < lslts.length; k++) {
                    if (lsprts[k].indexOf("TS") != -1) {
                        getParam(lslts[k].toString(), "TS");
                    }
                    else if (lsprts[k].indexOf("IV") != -1) {
                        getParam(lslts[k].toString(), "IV");
                    }
                }
            }
        }
        var tablecont = "";
        $("#divTbl").empty();
        tablecont = tablecont + "<table cellpadding='0' cellspacing='0' border='0' width='100 % ' class='table table-light table-striped table-hover'><tr><th>S No.</th><th>Target Field/Param</th><th>Source Field/Param</th><th>Edit</th><th>Delete</th></tr>";
        tablecont = tablecont + "<tr style=''>";
        tablecont = tablecont + "<td>1</td><td>-</td><td>-</td><td>Edit</td><td>Delete</td>";
        tablecont = tablecont + "</tr>";
        tablecont = tablecont + "</table>";
        $("#divTbl").append(tablecont);
    }

    $("#txtParaVal").val(lsStr2);
    $("#myModal").modal();
}

///Get Script Values and edit, delete
function showScriptModalEdit(lsStr, lsStr1, lsStr2) {
    txtParam.val(lsStr);
    mainSqlCM1.setValue(lsStr);
    $("#myModalScript").modal();
}
function showScriptModalDelete(lsStr, lsStr1, lsStr2) {

    var frmVal = '';
    $('#' + lsStr2 + '').empty();
    $('#' + lsStr2 + '').append("<ul id='" + lsStr2 + "'><li class='createWizard' onclick=\"showScriptModal('" + frmVal + "','" + lsStr1 + "', '" + lsStr2 + "');\"><span class='icon-software-pencil modal-icon'></span>Add Script</li></ul>");
    mainSqlCM1.setValue('');
}
function showScriptModal(lsStr, lsStr1, lsStr2) {
    //getParam(lsStr, lsStr1);
    $("#txtScriptVal").val(lsStr2);
    $("#myModalScript").modal();
}

///Get Props Values and edit, delete
function showPropsModalEdit(lsStr, lsStr1, lsStr2) {
    mainSqlCM2.setValue(lsStr);
    $("#myModalProps").modal();
}
function showPropsModalDelete(lsStr, lsStr1, lsStr2) {

    var frmVal = '';
    $('#' + lsStr2 + '').empty();
    $('#' + lsStr2 + '').append("<ul id='" + lsStr2 + "'><li class='createWizard' onclick=\"showPropsModal('" + frmVal + "','" + lsStr1 + "', '" + lsStr2 + "');\"><span class='icon-software-pencil modal-icon'></span>Add Props</li></ul>");
    mainSqlCM2.setValue('');
}
function showPropsModal(lsStr, lsStr1, lsStr2) {
    //getParam(lsStr, lsStr1);
    $("#txtPropsVal").val(lsStr2);
    $("#myModalProps").modal();
}

function getInfoParam() {

    var id = $('#txtParaVal').val();
    var lsaction = "";
    if ($("#chkAction").prop("checked") == true) {
        lsaction = "Load";
    }
    var id1 = mainSqlCM.getValue();
    id1 = $("#txtParam").val();
    $('#' + id + '').empty();
    //if (lsPrValue == "") {
    //    lsPrValue = id1;
    //}
    //else {
    //    lsPrValue =lsPrValue + "~"+ id1;

    //}
    if (lsaction != "") {
        $('#' + id + '').append("<span id='" + id.replace("ul", "sp") + "'><b>Parameters Detail: </b>" + id1 + ", Action=" + lsaction + "</span><ul id='" + id.replace("ul", "ulEdit") + "'><li class='createWizard' onclick=\"showParamModalEdit('" + id1 + "','" + id.replace('ulpr', '') + "', '" + id + "');\"><span class='icon-software-pencil modal-icon'></span>Edit Param</li><li class='createWizard' onclick=\"showParamModalDelete('" + id1 + "','TS', '" + id + "');\"><span class='icon-software-pencil modal-icon'></span>Remove Param</li></ul>");
    }
    else {
        $('#' + id + '').append("<span id='" + id.replace("ul", "sp") + "'><b>Parameters Detail: </b>" + id1 + "</span><ul id='" + id.replace("ul", "ulEdit") + "'><li class='createWizard' onclick=\"showParamModalEdit('" + id1 + "','" + id.replace('ulpr', '') + "', '" + id + "');\"><span class='icon-software-pencil modal-icon'></span>Edit Param</li><li class='createWizard' onclick=\"showParamModalDelete('" + id1 + "','TS', '" + id + "');\"><span class='icon-software-pencil modal-icon'></span>Remove Param</li></ul>");
    }
    mainSqlCM.setValue('');
    $("#txtParam").val('');
    $("#divTbl").empty();
    //$("#txtPrName").val(lsPrValue);
    $("[data-dismiss=modal]").trigger({ type: "click" });
    $("#myModal").hide();
}

function getInfoScript() {

    var id = $('#txtScriptVal').val();
    var id1 = mainSqlCM1.getValue();
    $('#' + id + '').empty();
    $('#' + id + '').append("<span id='" + id.replace("ul", "sp") + "'><b>Script Detail: </b>" + id1 + "</span><ul id='" + id.replace("ul", "ulEdit") + "'><li class='createWizard' onclick=\"showScriptModalEdit('" + id1 + "','" + id.replace('ulpr', '') + "', '" + id + "');\"><span class='icon-software-pencil modal-icon'></span>Edit Script</li><li class='createWizard' onclick=\"showScriptModalDelete('" + id1 + "','TS', '" + id + "');\"><span class='icon-software-pencil modal-icon'></span>Remove Script</li></ul>");
    mainSqlCM1.setValue('');
    $("[data-dismiss=modal]").trigger({ type: "click" });
    $("#myModalScript").hide();
}
function getInfoProps() {

    var id = $('#txtPropsVal').val();
    var id1 = mainSqlCM2.getValue();
    $('#' + id + '').empty();
    $('#' + id + '').append("<span id='" + id.replace("ul", "sp") + "'><b>Props Detail: </b>" + id1 + "</span><ul id='" + id.replace("ul", "ulEdit") + "'><li class='createWizard' onclick=\"showPropsModalEdit('" + id1 + "','" + id.replace('ulpr', '') + "', '" + id + "');\"><span class='icon-software-pencil modal-icon'></span>Edit Props</li><li class='createWizard' onclick=\"showPropsModalDelete('" + id1 + "','TS', '" + id + "');\"><span class='icon-software-pencil modal-icon'></span>Remove Props</li></ul>");
    mainSqlCM2.setValue('');
    $("[data-dismiss=modal]").trigger({ type: "click" });
    $("#myModalProps").hide();
}

function getGlobalParam1() {

    // ddlRParam.empty();
    $.ajax({
        url: "../aspx/axinterface.aspx/GetGlobalVar",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            strVar: 'm_empindate^m_empintime^m_empinlatitude^m_empinlongitude^m_empoutdate^m_empouttime^m_empoutlatitude^m_empoutlongitude^m_emprecid^m_nickname'
            //this the list of variables for which we need the values from Axpert. In the //example screen shown above, these are requested.
        }),
        cache: false,
        async: true,
        dataType: "json",
        success: function (data) {
            // alert(ddlRParam);
            if (data.d == "") {
                // return;
                //$("#ddlRParam").append($("<option></option>").val('Action').html('Action'));
            }
            else {
                //$("#ddlRParam").append($("<option></option>").val('Action').html('Action'));
                varsplitData = data.d.split('^');

                if (varsplitData.length > 0) {
                    for (i = 0; i < varsplitData.length; i++) {
                        if (varsplitData[i] != "") {
                            $("#ddlRParam").append($("<option></option>").val(varsplitData[i]).html(varsplitData[i]));
                        }
                    }
                }
            }
            //your code goes here. The result will be provided as a string with values for all variables separated by ^.
        },

        error: function (data) {
            alert("test1");
            //your code goes here
        }
    });
}

function getGlobalParam() {

    // ddlRParam.empty();
    var pageUrl1 = pageUrl.split("?");
    $.ajax({
        url: pageUrl1[0].toString() + '/getGlobVar',
        type: "POST",
        contentType: "application/json",
        data: {},
        cache: false,
        async: true,
        dataType: "json",
        success: function (data) {
            // alert(ddlRParam);
            if (data.d == "") {
                // return;
                //$("#ddlRParam").append($("<option></option>").val('Action').html('Action'));
            }
            else {
                //$("#ddlRParam").append($("<option></option>").val('Action').html('Action'));
                varsplitData = data.d.split(',');
                saveMsg = JSON.parse(data.d);
                if (saveMsg.Result.length > 0) {
                    for (i = 0; i < saveMsg.Result.length; i++) {
                        $("#ddlRParam").append($("<option></option>").val(saveMsg.Result[i].Name.trim()).html(saveMsg.Result[i].Name.trim()));
                    }
                }
            }
            //your code goes here. The result will be provided as a string with values for all variables separated by ^.
        },

        error: function (data) {
            alert("test1");
            //your code goes here
        }
    });
}


function getParam(lsString, lsString1) {
    var pageUrl1 = pageUrl.split("?");
    $.ajax({
        type: 'POST',
        url: pageUrl1[0].toString() + '/getParamJson',
        data: JSON.stringify({ lsReqValue: lsString, lsReqType: lsString1 }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        success: function (data) {
            //alert(data.d);
            lsstpArr = "";
            lsstpArr = data.d.trim().split(',');

            //$("#ddlResParam").append($("<option></option>").val('Load').html('Load'));
            //$("#ddlResParam").append($("<option></option>").val('Open').html('Open'));
            if (lsstpArr.length > 0) {
                for (i = 0; i < lsstpArr.length; i++) {
                    if (lsstpArr[i].trim() != "") {
                        $("#ddlResParam").append($("<option></option>").val(lsstpArr[i]).html(lsstpArr[i]));
                    }
                }
            }
            //if (data.d != "") {
            //    let saveMsg = JSON.parse(data.d);
            //    if (saveMsg.Result.length > 0) {
            //        $('#LeftMenu').empty();
            //        for (i = 0; i < saveMsg.Result.length; i++) {
            //            $('#LeftMenu').append("<div class='portlet'><div class='portlet-header'>" + saveMsg.Result[i].Caption + "</div><div class='portlet-content'><p>Payment Gateway Name: " + saveMsg.Result[i].Caption + "</p><ul><li class='createWizard' data-toggle='modal' data-target='#myModal'><span class='icon-software-pencil modal-icon'></span>Edit</li></ul></div></div>");
            //            //$('#LeftMenu').append('<div class="portlet"><div class="portlet-header">' + saveMsg.Result[i].Caption + '</div></div>');
            //        }
            //    }

            //}
        },
        error: function (data, success, error) {
            alert("Error: " + error);
        }
    });
    return false;
}

function getParamS(lsString, lsString1) {
    var pageUrl1 = pageUrl.split("?");
    $.ajax({
        type: 'POST',
        url: pageUrl1[0].toString() + '/getParamJson',
        data: JSON.stringify({ lsReqValue: lsString, lsReqType: lsString1 }),
        contentType: "application/json; charset=utf-8",
        datatype: 'json',
        success: function (data) {
            //alert(data.d);
            lsstpArr = "";
            lsstpArr = data.d.trim().split(',');

            if (lsstpArr.length > 0) {
                for (i = 0; i < lsstpArr.length; i++) {
                    if (lsstpArr[i].trim() != "") {
                        $("#ddlRParam").append($("<option></option>").val(lsstpArr[i]).html(lsstpArr[i]));
                    }
                }
            }
            //if (data.d != "") {
            //    let saveMsg = JSON.parse(data.d);
            //    if (saveMsg.Result.length > 0) {
            //        $('#LeftMenu').empty();
            //        for (i = 0; i < saveMsg.Result.length; i++) {
            //            $('#LeftMenu').append("<div class='portlet'><div class='portlet-header'>" + saveMsg.Result[i].Caption + "</div><div class='portlet-content'><p>Payment Gateway Name: " + saveMsg.Result[i].Caption + "</p><ul><li class='createWizard' data-toggle='modal' data-target='#myModal'><span class='icon-software-pencil modal-icon'></span>Edit</li></ul></div></div>");
            //            //$('#LeftMenu').append('<div class="portlet"><div class="portlet-header">' + saveMsg.Result[i].Caption + '</div></div>');
            //        }
            //    }

            //}
        },
        error: function (data, success, error) {
            alert("Error: " + error);
        }
    });
    return false;
}

function onSuccess(data) {
    alert(data.d);
}
function EditorAutoComplete1(editor, event) {
    if (
        !(event.ctrlKey) &&
        (event.keyCode >= 65 && event.keyCode <= 90) ||
        (event.keyCode >= 97 && event.keyCode <= 122) ||
        (event.keyCode >= 46 && event.keyCode <= 57)
    ) {
        // type code and show autocomplete hint in the meanwhile
        CodeMirror.commands.autocomplete(editor, CodeMirror.hint.wizardHints, { completeSingle: false });
    }
}
function EditorAutoComplete2(editor, event) {
    if (
        !(event.ctrlKey) &&
        (event.keyCode >= 65 && event.keyCode <= 90) ||
        (event.keyCode >= 97 && event.keyCode <= 122) ||
        (event.keyCode >= 46 && event.keyCode <= 57)
    ) {
        // type code and show autocomplete hint in the meanwhile
        CodeMirror.commands.autocomplete(editor, null, { completeSingle: false });
    }
}
function EditorAutoComplete3(editor, event) {
    if (
        !(event.ctrlKey) &&
        (event.keyCode >= 65 && event.keyCode <= 90) ||
        (event.keyCode >= 97 && event.keyCode <= 122) ||
        (event.keyCode >= 46 && event.keyCode <= 57)
    ) {
        // type code and show autocomplete hint in the meanwhile
        CodeMirror.commands.autocomplete(editor, null, { completeSingle: false });
    }
}
function editParamVal(ParamValue) {

    if (ParamValue != "") {
        var PParamValue = ParamValue.split("=");
        if (PParamValue.length > 1) {
            $("#ddlRParam").val(PParamValue[0]);
            $("#ddlResParam").val(PParamValue[1]);
            editParam = ParamValue;
        }
    }

}

function deleteParamVal(ParamValue) {

    var txtVal = $("#txtParam").val().split(",");
    var delVal = "";
    if (txtVal.length > 0) {
        for (i = 0; i < txtVal.length; i++) {
            if (txtVal[i].toString() != ParamValue) {
                if (delVal == "") {
                    delVal = txtVal[i].toString();
                }
                else {
                    delVal = delVal + "," + txtVal[i].toString();
                }
            }
        }
    }
    $("#txtParam").val(delVal);
    var tablecont = "";
    var paramSplit = $("#txtParam").val().split(",");
    if (paramSplit.length > 0) {
        $("#divTbl").empty();
        tablecont = tablecont + "<table cellpadding='0' cellspacing='0' border='0' width='100 % ' class='table table-light table-striped table-hover'><tr><th>S No.</th><th>Target Field/Param</th><th>Source Field/Param</th><th>Edit</th><th>Delete</th></tr>";
        for (i = 0; i < paramSplit.length; i++) {
            tablecont = tablecont + "<tr>";
            var paramValSplit = paramSplit[i].toString().split("=");
            if (paramValSplit.length > 1) {
                tablecont = tablecont + "<td>" + (i + 1).toString() + "</td><td>" + paramValSplit[1].toString() + "</td><td>" + paramValSplit[0].toString() + "</td><td><a href='javascript:void();' onclick=\"editParamVal('" + paramSplit[i].toString() + "')\">Edit</a></td><td><a href='javascript:void();' onclick=\"deleteParamVal('" + paramSplit[i].toString() + "')\">Delete</a></td>";
            }
            tablecont = tablecont + "</tr>";
        }
        tablecont = tablecont + "</table>";
    }
    $("#divTbl").append(tablecont)
}

function removecurrent(itemId) {
    
    $("#rightMenu").empty();
    var lspropId1 = $('#txtdropedId').val().split(",");
    var lstsId1 = $('#txttsId').val().split(",");
    var lstsName1 = $('#txttsName').val().split(",");
    var lsPrName1 = $('#txtPrName').val().split("~");
    var lsprop = "";
    var lsts = "";
    var lstsN = "";
    var lsPrN = "";
    if (lspropId1.length > 0) {
        for (i = 0; i < lspropId1.length; i++) {
            if (lspropId1[i].toString() != itemId) {
                if (lsprop == "") {
                    lsprop = lspropId1[i].toString();
                    lsts = lstsId1[i].toString();
                    lstsN = lstsName1[i].toString();
                    if (lsPrName1.length > i) {
                        lsPrN = lsPrName1[i].toString();
                    }
                }
                else {
                    lsprop = lsprop + "," + lspropId1[i].toString();
                    lsts = lsts + "," + lstsId1[i].toString();
                    lstsN = lstsN + "," + lstsName1[i].toString();
                    if (lsPrName1.length > i) {
                        lsPrN = lsPrN + "," + lsPrName1[i].toString();
                    }
                }
            }
        }
    }
    $('#txtdropedId').val(lsprop);
    $('#txttsId').val(lsts);
    $('#txttsName').val(lstsN);
    $('#txtPrName').val(lsPrN);
    lsdropedId = lsprop;
    lstsId = lsts;
    lstsName = lstsN;
    //var lstsd = itemId;
    //var lsstNm = lstsd.replace('ul', 'ms1');
    //lstsd = lstsd.replace('ul', 'ms');

    //document.getElementById(lstsd).innerText = lsts;
    //document.getElementById(lsstNm).innerText = lstsN;

    let k = 0;
    var tsId = "";
    var tsName = "";
    if ($('#txtdropedId').val() != "") {
        let edContName = $('#txttsName').val().split(",");
        let edContCode = $('#txttsId').val().split(",");
        let edlsParam = $('#txtPrName').val().split("~");
        let edPropId = $('#txtdropedId').val().split(",");
        var prodIdDtl = "";
        var saveMsg1 = "";
        if (edPropId.length > 0) {
                for (k = 0; k < edPropId.length; k++) {
                    if (edPropId[k].toString().indexOf("TS") != -1) {
                        if (prodIdDtl == "") {
                            prodIdDtl = edPropId[k].toString();
                            saveMsg1 = "TSTRUCT";
                        }
                        else {
                            prodIdDtl = prodIdDtl + "," + edPropId[k].toString();
                            saveMsg1 = saveMsg1 + "," + "TSTRUCT";
                        }
                    }
                    else if (edPropId[k].toString().indexOf("IV") != -1) {
                        if (prodIdDtl == "") {
                            prodIdDtl = edPropId[k].toString();
                            saveMsg1 = "IVIEW";
                        }
                        else {
                            prodIdDtl = prodIdDtl + "," + edPropId[k].toString();
                            saveMsg1 = saveMsg1 + "," + "IVIEW";
                        }
                    }
                }
            let edContCType = saveMsg1.split(",");
            $('#txtdropedId').val('');
            $('#txtdropedId').val(prodIdDtl);
            let edPropId1 = $('#txtdropedId').val().split(",");
            for (i = 0; i < edContName.length; i++) {
                k += 1;
                if (tsId == "") {
                    tsId = edContCode[i].toString();
                    tsName = edContName[i].toString();
                }
                else {
                    tsId = tsId + "," + edContCode[i].toString();
                    tsName = tsName + "," + edContName[i].toString();
                }
                //alert($('#txtdropedId').val());

                if (edContCType[i].toString() == "TSTRUCT") {
                    if (edlsParam.length > i) {
                        if (edlsParam[i].toString() == "-" || edlsParam[i].toString() == "") {
                            $('#rightMenu').append("<div class='portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all' style=''><div class='portlet-header ui-widget-header ui-corner-all'><span class='ui-icon ui-icon-minusthick portlet-toggle' style='display:none;'></span><span>" + k.toString() + "&nbsp;-&nbsp;</span><input type='hidden' id='tab0" + k.toString() + "' name='tab0" + k.toString() + "' value='" + k.toString() + "'>" + edContName[i].toString() + " (" + edContCode[i].toString() + ")<span style='float:right;'><i class='fa fa-times' aria-hidden='true' onclick=\"removecurrent('"+edPropId1[i].toString()+"')\"></i></span></div><div class='portlet-content'></div><div style='display: block;' id='" + edPropId1[i].toString().replace("ul", "dv") + "'><p style='display:none;'><b>Tstruct Name: </b><span id='" + edPropId1[i].toString().replace("ul", "ms") + "'>" + edContCode[i].toString() + "</span><span id='" + edPropId1[i].toString().replace("ul", "ms1") + "'>" + edContName[i].toString() + "</span></p><ul id='" + edPropId1[i].toString() + "'><li class='createWizard' onclick=\"showParamModal('" + edContCode[i].toString() + "','TS', '" + edPropId1[i].toString() + "');\"><span class='icon-software-pencil modal-icon'></span>Add Param</li></ul></div></div>");
                        }
                        else {
                            $('#rightMenu').append("<div class='portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all' style=''><div class='portlet-header ui-widget-header ui-corner-all'><span class='ui-icon ui-icon-minusthick portlet-toggle' style='display:none;'></span><span>" + k.toString() + "&nbsp;-&nbsp;</span><input type='hidden' id='tab0" + k.toString() + "' name='tab0" + k.toString() + "' value='" + k.toString() + "'>" + edContName[i].toString() + " (" + edContCode[i].toString() + ")<span style='float:right;'><i class='fa fa-times' aria-hidden='true' onclick=\"removecurrent('" + edPropId1[i].toString() + "')\"></i></span></div><div class='portlet-content'></div><div style='display: block;' id='" + edPropId1[i].toString().replace("ul", "dv") + "'><p style='display:none;'><b>Tstruct Name: </b><span id='" + edPropId1[i].toString().replace("ul", "ms") + "'>" + edContCode[i].toString() + "</span><span id='" + edPropId1[i].toString().replace("ul", "ms1") + "'>" + edContName[i].toString() + "</span></p><ul id='" + edPropId1[i].toString() + "'><span id='" + edPropId1[i].toString().replace("ul", "sp") + "'><b>Parameters Detail: </b>" + edlsParam[i].toString() + "</span><ul id='" + edPropId1[i].toString().replace("ul", "ulEdit") + "'><li class='createWizard' onclick=\"showParamModalEdit('" + edlsParam[i].toString() + "','" + edPropId1[i].toString().replace("ulpr", "") + "', '" + edPropId1[i].toString() + "');\"><span class='icon-software-pencil modal-icon'></span>Edit Param</li><li class='createWizard' onclick=\"showParamModalDelete('" + edlsParam[i].toString() + "','" + edPropId1[i].toString().replace("ulpr", "") + "', '" + edPropId1[i].toString() + "');\"><span class='icon-software-pencil modal-icon'></span>Remove Param</li></ul></ul></div></div>");
                        }
                    }
                    else {
                        $('#rightMenu').append("<div class='portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all' style=''><div class='portlet-header ui-widget-header ui-corner-all'><span class='ui-icon ui-icon-minusthick portlet-toggle' style='display:none;'></span><span>" + k.toString() + "&nbsp;-&nbsp;</span><input type='hidden' id='tab0" + k.toString() + "' name='tab0" + k.toString() + "' value='" + k.toString() + "'>" + edContName[i].toString() + " (" + edContCode[i].toString() + ")<span style='float:right;'><i class='fa fa-times' aria-hidden='true' onclick=\"removecurrent('" + edPropId1[i].toString() + "')\"></i></span></div><div class='portlet-content'></div><div style='display: block;' id='" + edPropId1[i].toString().replace("ul", "dv") + "'><p style='display:none;'><b>Tstruct Name: </b><span id='" + edPropId1[i].toString().replace("ul", "ms") + "'>" + edContCode[i].toString() + "</span><span id='" + edPropId1[i].toString().replace("ul", "ms1") + "'>" + edContName[i].toString() + "</span></p><ul id='" + edPropId1[i].toString() + "'><li class='createWizard' onclick=\"showParamModal('" + edContCode[i].toString() + "','TS', '" + edPropId1[i].toString() + "');\"><span class='icon-software-pencil modal-icon'></span>Add Param</li></ul></div></div>");
                    }
                }
                else if (edContCType[i].toString() == "IVIEW") {
                    if (edlsParam.length > i) {
                        if (edlsParam[i].toString() == "-" || edlsParam[i].toString() == "") {
                            $('#rightMenu').append("<div class='portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all' style=''><div class='portlet-header ui-widget-header ui-corner-all'><span class='ui-icon ui-icon-minusthick portlet-toggle' style='display:none;'></span><span>" + k.toString() + "&nbsp;-&nbsp;</span><input type='hidden' id='tab0" + k.toString() + "' name='tab0" + k.toString() + "' value='" + k.toString() + "'>" + edContName[i].toString() + " (" + edContCode[i].toString() + ")<span style='float:right;'><i class='fa fa-times' aria-hidden='true' onclick=\"removecurrent('" + edPropId1[i].toString() + "')\"></i></span></div><div class='portlet-content'></div><div style='display: block;' id='" + edPropId1[i].toString().replace("ul", "dv") + "'><p style='display:none;'><b>Iview Name: </b><span id='" + edPropId1[i].toString().replace("ul", "ms") + "'>" + edContCode[i].toString() + "</span><span id='" + edPropId1[i].toString().replace("ul", "ms1") + "'>" + edContName[i].toString() + "</span></p><ul id='" + edPropId1[i].toString() + "'><li class='createWizard' onclick=\"showParamModal('" + edContCode[i].toString() + "','IV', '" + edPropId1[i].toString() + "');\"><span class='icon-software-pencil modal-icon'></span>Add Param</li></ul></div></div>");
                        }
                        else {
                            $('#rightMenu').append("<div class='portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all' style=''><div class='portlet-header ui-widget-header ui-corner-all'><span class='ui-icon ui-icon-minusthick portlet-toggle' style='display:none;'></span><span>" + k.toString() + "&nbsp;-&nbsp;</span><input type='hidden' id='tab0" + k.toString() + "' name='tab0" + k.toString() + "' value='" + k.toString() + "'>" + edContName[i].toString() + " (" + edContCode[i].toString() + ")<span style='float:right;'><i class='fa fa-times' aria-hidden='true' onclick=\"removecurrent('" + edPropId1[i].toString() + "')\"></i></span></div><div class='portlet-content'></div><div style='display: block;' id='" + edPropId1[i].toString().replace("ul", "dv") + "'><p style='display:none;'><b>Iview Name: </b><span id='" + edPropId1[i].toString().replace("ul", "ms") + "'>" + edContCode[i].toString() + "</span><span id='" + edPropId1[i].toString().replace("ul", "ms1") + "'>" + edContName[i].toString() + "</span></p><ul id='" + edPropId1[i].toString() + "'><span id='" + edPropId1[i].toString().replace("ul", "sp") + "'><b>Parameters Detail: </b>" + edlsParam[i].toString() + "</span><ul id='" + edPropId1[i].toString().replace("ul", "ulEdit") + "'><li class='createWizard' onclick=\"showParamModalEdit('" + edlsParam[i].toString() + "','" + edPropId1[i].toString().replace("ulpr", "") + "', '" + edPropId1[i].toString() + "');\"><span class='icon-software-pencil modal-icon'></span>Edit Param</li><li class='createWizard' onclick=\"showParamModalDelete('" + edlsParam[i].toString() + "','" + edPropId1[i].toString().replace("ulpr", "") + "', '" + edPropId1[i].toString() + "');\"><span class='icon-software-pencil modal-icon'></span>Remove Param</li></ul></ul></div></div>");
                        }
                    }
                    else {
                        $('#rightMenu').append("<div class='portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all' style=''><div class='portlet-header ui-widget-header ui-corner-all'><span class='ui-icon ui-icon-minusthick portlet-toggle' style='display:none;'></span><span>" + k.toString() + "&nbsp;-&nbsp;</span><input type='hidden' id='tab0" + k.toString() + "' name='tab0" + k.toString() + "' value='" + k.toString() + "'>" + edContName[i].toString() + " (" + edContCode[i].toString() + ")<span style='float:right;'><i class='fa fa-times' aria-hidden='true' onclick=\"removecurrent('" + edPropId1[i].toString() + "')\"></i></span></div><div class='portlet-content'></div><div style='display: block;' id='" + edPropId1[i].toString().replace("ul", "dv") + "'><p style='display:none;'><b>Iview Name: </b><span id='" + edPropId1[i].toString().replace("ul", "ms") + "'>" + edContCode[i].toString() + "</span><span id='" + edPropId1[i].toString().replace("ul", "ms1") + "'>" + edContName[i].toString() + "</span></p><ul id='" + edPropId1[i].toString() + "'><li class='createWizard' onclick=\"showParamModal('" + edContCode[i].toString() + "','IV', '" + edPropId1[i].toString() + "');\"><span class='icon-software-pencil modal-icon'></span>Add Param</li></ul></div></div>");
                    }
                }
            }
        }

        $('#txttsName').val(tsName);
        $('#txttsId').val(tsId);
        $("#txtParam").val('');
        var txttsDtl = $('#txttsId').val();
        var txtprpDtl = $('#txtdropedId').val();
        if (txttsDtl != "") {
            var lslts = txttsDtl.split(",");
            var lsprts = txtprpDtl.split(",");
            if (lslts.length > 0) {
                if (lslts.length >= 1) {
                    $("#ddlResParam").empty();
                    $("#ddlRParam").empty();
                    $("#ddlRParam").append($("<option></option>").val('0').html('--Select--'));
                    $("#ddlResParam").append($("<option></option>").val('0').html('--Select--'));
                    //$("#ddlRParam").append($("<option></option>").val('Action').html('Action'));
                    //$("#ddlResParam").append($("<option></option>").val('Load').html('Load'));
                    //$("#ddlResParam").append($("<option></option>").val('Open').html('Open'));
                    getGlobalParam();
                    for (j = 1; j < lslts.length; j++) {
                        if (lsprts[j].indexOf("TS") != -1) {
                            getParam(lslts[j].toString(), "TS");
                        }
                        else if (lsprts[j].indexOf("IV") != -1) {
                            getParam(lslts[j].toString(), "IV");
                        }
                    }
                    for (i = 0; i < lslts.length - 1; i++) {
                        if (lsprts[i].indexOf("TS") != -1) {
                            getParamS(lslts[i].toString(), "TS");
                        }
                        else if (lsprts[i].indexOf("IV") != -1) {
                            getParamS(lslts[i].toString(), "IV");
                        }
                    }
                }
                if (lslts.length == 1) {
                    $("#ddlResParam").empty();
                    $("#ddlRParam").empty();
                    $("#ddlRParam").append($("<option></option>").val('0').html('--Select--'));
                    $("#ddlResParam").append($("<option></option>").val('0').html('--Select--'));
                    //$("#ddlRParam").append($("<option></option>").val('Action').html('Action'));
                    //$("#ddlResParam").append($("<option></option>").val('Load').html('Load'));
                    //$("#ddlResParam").append($("<option></option>").val('Open').html('Open'));
                    getGlobalParam();
                    for (k = 0; k < lslts.length; k++) {
                        if (lsprts[k].indexOf("TS") != -1) {
                            getParam(lslts[k].toString(), "TS");
                        }
                        else if (lsprts[k].indexOf("IV") != -1) {
                            getParam(lslts[k].toString(), "IV");
                        }
                    }
                }
            }
        }
    }



}

function putParamVal() {


    var txtVal = $("#txtParam").val();
    var paramDtl = "";
    if (editParam != "") {
        //txtVal = $("#txtParam").val();
        paramDtl = $("#ddlRParam").val() + "=" + $("#ddlResParam").val();
        txtVal = txtVal.replace(editParam, paramDtl);
        $("#txtParam").empty();
        $("#txtParam").val(txtVal);
    }
    else {
        if ($("#ddlRParam").val() == "0" || $("#ddlResParam").val() == "0") {
            alert("Please select the Paramters!");
            return false;
        }
        paramDtl = $("#ddlRParam").val() + "=" + $("#ddlResParam").val();
        if (txtVal != "") {
            paramDtl = "," + $("#ddlRParam").val() + "=" + $("#ddlResParam").val();
        }
    }
    if (txtVal.indexOf(paramDtl) == -1) {
        if (editParam != "") { }
        else {
            txtVal = txtVal + paramDtl;
            $("#txtParam").val(txtVal);
        }
        var tablecont = "";
        var paramSplit = $("#txtParam").val().split(",");
        if (paramSplit.length > 0) {
            $("#divTbl").empty();
            tablecont = tablecont + "<table cellpadding='0' cellspacing='0' border='0' width='100 % ' class='table table-light table-striped table-hover'><tr><th>S No.</th><th>Target Field/Param</th><th>Source Field/Param</th><th>Edit</th><th>Delete</th></tr>";
            for (i = 0; i < paramSplit.length; i++) {
                tablecont = tablecont + "<tr>";
                var paramValSplit = paramSplit[i].toString().split("=");
                if (paramValSplit.length > 1) {
                    tablecont = tablecont + "<td>" + (i + 1).toString() + "</td><td>" + paramValSplit[1].toString() + "</td><td>" + paramValSplit[0].toString() + "</td><td><a href='javascript:void();' onclick=\"editParamVal('" + paramSplit[i].toString() + "')\">Edit</a></td><td><a href='javascript:void();' onclick=\"deleteParamVal('" + paramSplit[i].toString() + "')\">Delete</a></td>";
                }
                tablecont = tablecont + "</tr>";
            }
            tablecont = tablecont + "</table>";
        }
        $("#divTbl").append(tablecont);
    }
    else {
        if (editParam != "") {
            var tablecont = "";
            var paramSplit = $("#txtParam").val().split(",");
            if (paramSplit.length > 0) {
                $("#divTbl").empty();
                tablecont = tablecont + "<table cellpadding='0' cellspacing='0' border='0' width='100 % ' class='table table-light table-striped table-hover'><tr><th>S No.</th><th>Target Field/Param</th><th>Source Field/Param</th><th>Edit</th><th>Delete</th></tr>";
                for (i = 0; i < paramSplit.length; i++) {
                    tablecont = tablecont + "<tr>";
                    var paramValSplit = paramSplit[i].toString().split("=");
                    if (paramValSplit.length > 1) {
                        tablecont = tablecont + "<td>" + (i + 1).toString() + "</td><td>" + paramValSplit[1].toString() + "</td><td>" + paramValSplit[0].toString() + "</td><td><a href='javascript:void();' onclick=\"editParamVal('" + paramSplit[i].toString() + "')\">Edit</a></td><td><a href='javascript:void();' onclick=\"deleteParamVal('" + paramSplit[i].toString() + "')\">Delete</a></td>";
                    }
                    tablecont = tablecont + "</tr>";
                }
                tablecont = tablecont + "</table>";
            }
            $("#divTbl").append(tablecont);
        }
        else {
            alert("Parameter already added!");
        }
    }
}

//  $( function() {
$(document).ready(function () {

    //$("#ddlResParam").on('change', function () {
    //    alert(this.value);
    //});
    showTstruct();
    if ($('#tbxeditPage').val() != "") {

        $('#rightMenu').empty();
        showTstructEditRight();
    }
    //showIviewEditRight();
    //showeditContent();
    //  getParam();
    CodeMirror.registerHelper("hint", "wizardHints", function (editor, options) {
        var list = lsstpArr || [];
        var cursor = editor.getCursor();
        var currentLine = editor.getLine(cursor.line);
        var start = cursor.ch;
        var end = start;
        while (end < currentLine.length && /[\w$]+/.test(currentLine.charAt(end)))++end;
        while (start && /[\w$]+/.test(currentLine.charAt(start - 1)))--start;
        var curWord = start != end && currentLine.slice(start, end);
        var regex = new RegExp('^' + curWord, 'i');
        var result = {
            list: (!curWord ? list : list.filter(function (item) {
                return item.match(regex);
            })).sort(),
            from: CodeMirror.Pos(cursor.line, start),
            to: CodeMirror.Pos(cursor.line, end)
        };

        return result;
    });
    mainSqlCM = CodeMirror.fromTextArea(txtEditor, {
        mode: 'text/x-sql',
        smartIndent: true,
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        autofocus: true,
        // hint: CodeMirror.hint.sql,
        hintOptions: {
            tables: callParentNew("")
        },
        theme: "elegant"
    });

    mainSqlCM1 = CodeMirror.fromTextArea(txtEditor1, {
        mode: 'text/x-sql',
        smartIndent: true,
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        autofocus: true,
        // hint: CodeMirror.hint.sql,
        hintOptions: {
            tables: callParentNew("")
        },
        theme: "elegant"
    });

    mainSqlCM2 = CodeMirror.fromTextArea(txtEditor2, {
        mode: 'text/x-sql',
        smartIndent: true,
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        autofocus: true,
        // hint: CodeMirror.hint.sql,
        hintOptions: {
            tables: callParentNew("")
        },
        theme: "elegant"
    });

    mainSqlCM.on('keyup', EditorAutoComplete1);
    mainSqlCM1.on('keyup', EditorAutoComplete2);
    mainSqlCM2.on('keyup', EditorAutoComplete3);

    setInterval(function () {
        mainSqlCM.refresh();
        mainSqlCM1.refresh();
        mainSqlCM2.refresh();
    }, 500);
    $(".CodeMirror").resizable({
        handles: "s",
        resizeWidth: false,
        resize: function (event, ui) {
            setDataTableHeight();
        }
    });



    $("#LeftMenu,#rightMenu").sortable({
        connectWith: ".column",
        //   handle: ".portlet-header",
        //   cancel: ".portlet-toggle",
        //   placeholder: "portlet-placeholder ui-corner-all"
        beforeStop: function (event, ui) {
            
            $('#bg1').empty();
            //alert(ui.item.index());
            if (ui.item.parents('#rightMenu').length > 0 && !ui.item.hasClass(
                'ui-widget')) {
                var itmId = $(ui.item).find('ul').attr('id');
                if (lsdropedId == "") {
                    lsdropedId = $(ui.item).find('ul').attr('id');
                    var lstsd = $(ui.item).find('ul').attr('id');
                    var lsstNm = lstsd.replace('ul', 'ms1');
                    lstsd = lstsd.replace('ul', 'ms');
                    lstsId = document.getElementById(lstsd).innerText;
                    lstsName = document.getElementById(lsstNm).innerText;
                }
                else {
                    lsdropedId = lsdropedId + "," + $(ui.item).find('ul').attr('id');
                    var lstsd = $(ui.item).find('ul').attr('id');
                    var lsstNm = lstsd.replace('ul', 'ms1');
                    lstsd = lstsd.replace('ul', 'ms');
                    lstsId = lstsId + "," + document.getElementById(lstsd).innerText;
                    lstsName = lstsName + "," + document.getElementById(lsstNm).innerText;
                }
                ui.item.addClass(
                    "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all")
                    .find(".portlet-header")
                    .addClass("ui-widget-header ui-corner-all")
                if (ui.item.find('.portlet-content').length > 0) {
                    ui.item.find(".portlet-header").prepend(
                        "<span class='ui-icon ui-icon-minusthick portlet-toggle' style='display:none;'></span><span>" + (ui.item.index()).toString() + "&nbsp;-&nbsp;</span><input type='hidden' id='tab0" + ui.item.index() + "' name='tab0" + ui.item.index() + "' value='" + ui.item.index() + "'/>"
                    );
                    ui.item.find(".portlet-header").append("<span style='float:right;'><i class='fa fa-times' aria-hidden='true' onclick=\"removecurrent('" + itmId + "')\"></i></span>");
                    var divId = $(ui.item).find('ul').attr('id');
                    divId = divId.replace("ul", "dv");
                    var dvId = document.getElementById(divId);
                    dvId.style.display = "block";
                    //ui.item.find(".portlet-content").css('display') = 'block';
                }
            }
            //var divId = $(ui.item).find('ul').attr('id');
            //divId = divId.replace("ul", "dv");
            //document.getElementById(divId).style.display == "block";

            //<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>
            //else {
            //    if (ui.item.hasClass(
            //    'ui-widget')) {
            //        ui.item.addClass(
            //            "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all")
            //        .find(".portlet-header")
            //        .addClass("ui-widget-header ui-corner-all")
            //        if (ui.item.find('.portlet-content').length > 0) {
            //            ui.item.find(".portlet-header").prepend(
            //                "<span class='ui-icon ui-icon-minusthick portlet-toggle'></span><input type='text' id='tab0" + ui.item.index() + "' name='tab0" + ui.item.index() + "' value='" + ui.item.index() + "'/>"
            //                );
            //        }
            //    }

            //}
            if (ui.item.parents('#LeftMenu').length > 0 && ui.item.hasClass(
                'ui-widget')) {
                $("#LeftMenu,#rightMenu").sortable("cancel");
            }
            $('#txtdropedId').val(lsdropedId);
            $('#txttsId').val(lstsId);
            $('#txttsName').val(lstsName);
        }
    }).disableSelection();

    $("#rightMenu .portlet")
        .addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-all")
        .find(".portlet-header")
        .addClass("ui-widget-header ui-corner-all")
        .prepend("<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");

    $("html").on("click", ".portlet-toggle", function () {
        var icon = $(this);
        $("#rightMenu").find(".ui-icon-plusthick").each(function () {
            if (!$(this).is(icon)) {
                $(this).toggleClass("ui-icon-minusthick ui-icon-plusthick");
                $(this).closest(".portlet").find(".portlet-content").toggle();
            }
        })
        icon.toggleClass("ui-icon-minusthick ui-icon-plusthick");
        icon.closest(".portlet").find(".portlet-content").toggle();
    });

    $(".ui-sortable .portlet-toggle:first").trigger('click')
});
