var clickedDc = "";

function openProprtySht(curDivID) {
    PropertySheetHTML(curDivID);
    $("#Wrapperpropsheet").css("display", "block");
    $("#updateWidget").prop('title', 'Save');
    $("#propertySrchCls").prop('title', 'Cancel');
    $("#propTableContent input:not([class=form-range])").val("");
    $("#propTableContent select").each(
        function () {
            if (!$(this).data("noClear")) {
                $(this).removeAttr('selected');
                $(this).find('option:first').prop('selected', true);
            }
        }
    );
    $("#fldWidth").val(10);
    if ($("#seldataType").val() != "Numeric") {
        $(".decimalFld").addClass('notSearchable').hide()
        $("#fldDecimal").val(0);
    }
    setTimeout(function () {
        // $("#propertySheet").removeClass('scale-out').addClass('scale-in');
        // $("#propertySheet").draggable({
        //     containment: "body"
        // });
        let modalData = $j("#propertySheet").html();
        let myModal = new BSModal("modalIdNewItem", "", modalData, () => {
            designLayoutProperties();
        }, () => {
            setDesignProperties();
        });
        // myModal.changeSize("fullscreen");
        myModal.hideFooter();
        myModal.hideHeader();
        myModal.showFloatingClose();
    }, 50);
    $("#fldName").focus();
}

function CheckToOpenPropSheet() {
    checkIfFormChanges();
    if (isFormChange)
        confirmOnAction(true);
    else
        openProprtySht('addFieldPS');
}

function PropertySheetHTML(curDivID) {
    var PropSheetHTML = "";
    var propTitle = $("#" + curDivID).data("title") || "Property";
    var saveEnabled = $("#" + curDivID).data("save") == false ? false : true;
    $("#Wrapperpropsheet #propertySheet .hpbHeaderTitle span.title").text(propTitle);
    if (saveEnabled) {
        $("#Wrapperpropsheet #propertySheet .hpbHeaderTitle #updateWidget").show();
    } else {
        $("#Wrapperpropsheet #propertySheet .hpbHeaderTitle #updateWidget").hide();
    }
    var currentProp = null;
    if ($("#Wrapperpropsheet table").length > 0) {
        currentProp = $("#Wrapperpropsheet table");
    }
    if (currentProp != null) {
        if (currentProp.prop("id") != curDivID) {
            var parentDiv = currentProp.data("parent");
            $("#" + parentDiv).append(currentProp.hide().detach());
            $("#Wrapperpropsheet #propTableContent").append($("#" + curDivID).show().detach());
        }
    } else {
        $("#Wrapperpropsheet #propTableContent").append($("#" + curDivID).show().detach());
    }

    if ($("#" + curDivID).find("select#seldc").length > 0 && $("select#seldc option").length <= 0) {
        let propShtDcSelectHtml = "";
        DCCaption.forEach((caption, i) => {
            propShtDcSelectHtml += `<option value="${DCName[i]}">${caption}</option>`;
        });
        $('#seldc').html(propShtDcSelectHtml);
    }

    $("#propertySearchFld").on('keyup', function (e) {
        var elem = $(this);
        var enteredVal = elem.val().toLowerCase();
        var nodata = '<tr class="noDatFoundTr"><td colspan="2" class="center">No data found</td></tr>';
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

            $("#propTableContent table tbody").append(nodata);
        }
    });
    $("#propTableContent .propShtDataToggleIcon").on('click', function (e) {
        var elem = $(this);
        var target = elem.data('target');
        $("#propTableContent table tr[data-group='" + target + "']:not('.notSearchable')").toggle();
        if (elem.hasClass('icon-arrows-up')) {
            elem.removeClass('icon-arrows-up').addClass('icon-arrows-down');
        }
        else if (elem.hasClass('icon-arrows-down')) {
            elem.removeClass('icon-arrows-down').addClass('icon-arrows-up');
        }
        /* Act on the event */
    });
    $(document).on("keydown", ".customError", function (e) {
        $(this).removeClass("customError");
    });
    $("#seldataType").on("change", function (e) {
        if ($("#seldataType").val() == "Numeric") {
            $(".decimalFld").removeClass('notSearchable').show()
        }
        else {
            $(".decimalFld").addClass('notSearchable').hide()
            $("#fldDecimal").val(0);
        }
    });
}

function closeProprtySht(task, elem) {

    if ($("#propertySheet").hasClass('scale-out'))
        return true;
    var target = $("#propertySheet").data('target');

    $("#propertySheet").data('target', "").removeClass('scale-in').addClass('scale-out');
    return true;
}
function updateField() {
    var dcName = $("#seldc option:selected").val();
    var dcNo = parseInt(dcName.substring(2));
    var orderNumber = 0;
    var isValidated = validateData();
    orderNumber = parseInt(FldDcRange[dcNo - 1].split(',')[1]) + 1;
    if (isValidated) {
        var jsonData = {
            "tstructs": {
                "axpapp": eval(callParent('mainProject')),
                "s": eval(callParent('mainSessionId')),
                "trace": tracePath,
                "username": eval(callParent('mainUserName')),
                "transid": eval(callParent('transid')),
                "caption": RepSpecialCharsInHTML(eval(callParent('tstructCaption'))),
                "flds": [{
                    "name": $("#fldName").val(),
                    "actmode": "new",
                    "caption": $("#fldCaption").val(),
                    "dcname": dcName,
                    "ordno": orderNumber,
                    "datatype": $("#seldataType").val(),
                    "moe": $("#selmoe option:selected").val(),
                    "width": $("#fldWidth").val(),
                    "decimal": $("#fldDecimal").val(),
                    "saveval": "T",
                    "readonly": $("#fldReadOnly option:selected").val(),
                    "visible": $("#selvisible option:selected").val(),
                    "sql": $("#sqlSource").val(),
                    "expr": "",
                    "stransid": "",
                    "stable": "",
                    "skey": "",
                    "isnormalized": $("#selvisible option:selected").val(),
                    "allowempty": $("#selAlwEmpty option:selected").val(),
                    "allowduplicate": $("#selAlwDup option:selected").val(),
                    "applycomma": "F",
                    "hint": "",
                    "vexpr": ""
                }
                ]

            }
        }
        ShowDimmer(true);

        try {
            ASB.WebService.CallRestWS(JSON.stringify(jsonData), "savestruct", SuccessCallbackAction, OnException);
        }
        catch (exp) {
        }


        function SuccessCallbackAction(result, eventArgs) {
            console.log(result);
            ShowDimmer(false);
            var json = $.parseJSON(result);
            var msg = json["result"][0].msg;
            if (msg.toLowerCase() == "done") {
                $("#propertySheet").data('target', "").removeClass('scale-in').addClass('scale-out');
                showAlertDialog("success", "Field added successfully");
                callParentNew("IsfieldaddInDesignMode=", true);
                window.location.href = "tstruct.aspx?transid=" + transid + "&theMode=design" + `&openerIV=${transid}&isIV=false`;
            }
            else {
                msg = msg.replace('<error>', '').replace('</error>', '');
                showAlertDialog("failure", msg);
            }
        }

        function OnException(result) {
            ShowDimmer(false)
        }
    }
}
function validateData() {
    var fldName = $("#fldName").val();
    if (fldName == "") {
        $("#fldName").addClass("customError");
        showAlertDialog("warning", "Name cannot be empty");
        return false;
    }
    else if (fldName.indexOf(" ") > 0) {
        $("#fldName").addClass("customError");
        showAlertDialog("warning", "Name field cannot have empty spaces");
        return false;
    }


    var exceptionalFldNames = /\busername\b|\brecordid\b|\bfinyrst\b|\bfinyred\b|\bafinyrst\b|\bafinyred\b|\busergroup\b|\busergroupno\b|\bactiverow\b|\b_maincurr\b|\brolename\b|\bresponsibilities\b|\bsiteno\b|\bwf_applevel\b|\bwf_status\b|\baxp_language\b|\baxp_timezone\b|\baxp_datemode\b|\baxp_service\b|\badd\b|\balter\b|\band\b|\bany\b|\bas\b|\basc\b|\baudit\b|\bbetween\b|\bby\b|\bchar\b|\bcheck\b|\bcluster\b|\bcolumn\b|\bcomment\b|\bcompress\b|\bconnect\b|\bcreate\b|\bcurrent\b|\bdate\b|\bdecimal\b|\bdefault\b|\bdeletue\b|\bdesc\b|\bdistinct\b|\bdrop\b|\belse\b|\bexclusive\b|\bexists\b|\bfile\b|\bfloat\b|\bfor\b|\bfrom\b|\bgrant\b|\bgroup\b|\bhaving\b|\bidentified\b|\bimmediate\b|\bin\b|\bincrement\b|\bindex\b|\binitial\b|\binsert\b|\binteger\b|\bintersect\b|\binto\b|\bis\b|\blevel\b|\blike\b|\block\b|\blong\b|\bmaxextents\b|\bminus\b|\bmode\b|\bmodify\b|\bnoaudit\b|\bnocompress\b|\bnot\b|\bnowait\b|\bnull\b|\bnumber\b|\bof\b|\boffline\b|\boption\b|\bor\b|\border\b|\bpctfree\b|\bprior\b|\bprivileges\b|\bpublic\b|\braw\b|\brename\b|\bresource\b|\brevoke\b|\brow\b|\browid\b|\browlabel\b|\brownum\b|\brows\b|\bselect\b|\bsession\b|\bset\b|\bshare\b|\bsize\b|\bsmallint\b|\bstart\b|\bsuccessful\b|\bsynonym\b|\bsysdate\b|\btable\b|\bthen\b|\bto\b|\btrigger\b|\buid\b|\bunion\b|\bunique\b|\buser\b|\bvalidate\b|\bvalues\b|\bvarchar\b|\bvarchar2\b|\bview\b|\bwhenever\b|\bwhere\b|\bwith\b|\bsize\b|\bselect\b|\bdrop\b|\bas\b|\bin\b|\badd\b|\bupdate\b|\balter\b|\bfield\b|\bcolumn\b|\border\b|\bview\b|\btable\b|\btab\b|\bfrom\b|\bdatabase\b|\bvalues\b|\border\b|\bby\b|\bdefault\b|\bvalue\b|\bjoint\b|\bpassword\b|\bgroup\b|\bno\b|\bnot\b|\bto\b|\bfieldchanged\b|\bgetrcell\b|\bupper\b|\blower\b|\bdtoc\b|\bctod\b|\brnd\b|\bround\b|\bstuff\b|\biif\b|\bamtword\b|\bval\b|\bstr\b|\bsubstr\b|\bconvert\b|\brevconvert\b|\bencode\b|\bdecode\b|\bhashchar\b|\bmandy\b|\bdayselapsed\b|\btimeelapsed\b|\baddtotime\b|\baddtodate\b|\baddtomonth\b|\bisemptyvalue\b|\blastdayofmonth\b|\bvalidencodedate\b|\beval\b|\bisempty\b|\babs\b|\bmakedate\b|\bdate\b|\bformatdatetime\b|\btime\b|\bdayofdate\b|\bmonthofdate\b|\byearofdate\b|\bgen_id\b|\btotal\b|\bsum\b|\bgetmax\b|\bgetvalue\b|\bgetid\b|\bgetrow\b|\bgetrowcount\b|\bgetcostrate\b|\bgetadjustedamount\b|\bsumtill\b|\bgetcell\b|\bgetinteger\b|\bpower\b|\bcreatedby\b|\bcreatedon\b|\baxpceil\b|\baxpfloor\b|\bdays360\b|\bdata\b/g;

    if (fldName.toLowerCase().match(exceptionalFldNames) != null) {
        $("#fldName").addClass("customError");
        showAlertDialog("warning", "Invalid name");
        return false;
    }
    if ($("#fldCaption").val() == "") {
        $("#fldCaption").addClass("customError");
        showAlertDialog("warning", "Caption cannot be empty");
        return false;
    }
    else if (!$("#fldWidth").val().match(/^[0-9]+$/)) {
        $("#fldWidth").addClass("customError");
        showAlertDialog("warning", "Width should be numeric");
        return false;
    }
    else if ($("#fldWidth").val().match(/^[0-9]+$/) && $("#fldWidth").val() > 4000) {
        $("#fldWidth").addClass("customError");
        showAlertDialog("warning", "Width cannot exceed 4000");
        return false;
    }
    else if (!$("#fldDecimal").val().match(/^[0-9]+$/)) {
        $("#fldDecimal").addClass("customError");
        showAlertDialog("warning", "Decimal should be numeric.");
        return false;
    }
    else if ($("#fldDecimal").val().match(/^[0-9]+$/) && $("#fldDecimal").val() > 15) {
        $("#fldDecimal").addClass("customError");
        showAlertDialog("warning", "Decimal value cannot exceed 15.");
        return false;
    }
    else if ($("#selmoe option:selected").val() == "Select") {
        if ($("#sqlSource").val() == "") {
            showAlertDialog("warning", "SQL cannot be empty.");
            return false;
        }
    }
    else {
        return true;
    }
    return true;
}
function moeChanger(elem) {
    elem = $(elem);
    if (elem.val() === "Image") {
        $("#sqlSource").prop("disabled", true);
    } else {
        $("#sqlSource").prop("disabled", false);
    }
}
