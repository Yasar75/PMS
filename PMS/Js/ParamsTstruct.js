function SetParamValues() {

    var paramValues = ""; var displayTxt = "";
    for (var i = 0; i < FldFrameNo.length; i++) {
        if (FldFrameNo[i] == "1") {
            var fldName = FNames[i];
            if (fldName == "axp_recid1") continue;
            var fldName = FNames[i] + "000F1";
            var isFieldVisible = $j("#" + fldName).attr("type") == "hidden" ? false : true;
            if (fldName.toLowerCase() == "axglo_hide000f1") continue;
            var fldVlaue = GetFieldValue(fldName, "");
            fldVlaue = encodeURI(fldVlaue); //encode global parameters
            if (paramValues == "") {
                paramValues = FNames[i] + "♣" + fldVlaue;
            }
            else {
                paramValues += "¿" + FNames[i] + "♣" + fldVlaue;
            }

            if (displayTxt == "") {
                if (isFieldVisible)
                    displayTxt = FCaption[i] + ":" + fldVlaue;
            }
            else {
                if (isFieldVisible)
                    displayTxt += "," + FCaption[i] + ":" + fldVlaue;
            }
        }
    }

    if ($j("#hdParamsValues", window.parent.document).length > 0) {
        $j("#hdParamsValues", window.parent.document).val(paramValues);
        $j("#hdnDisplayTxt", window.parent.document).val(displayTxt);
        $j("#hdnAxGloRecId", window.parent.document).val(axSaveRecId);
        $j("#btnSetParams", window.parent.document).click();

        window.close();
    }
}

function AxBeforeSave() {
    var displayfldName = GetExactFieldName("axp_displaytext");
    var displayTxt = "";
    for (var i = 0; i < FldFrameNo.length; i++) {
        if (FldFrameNo[i] == "1") {
            var fldName = FNames[i];
            if (fldName == "axp_recid1") continue;
            var fldName = FNames[i] + "000F1";
            var isFieldVisible = $j("#" + fldName).attr("type") == "hidden" ? false : true;
            if (fldName.toLowerCase() == "axglo_hide000f1") continue;
            var fldVlaue = GetFieldValue(fldName, "");
            if (displayTxt == "") {
                if (isFieldVisible)
                    displayTxt = FCaption[i] + ":" + fldVlaue;
            }
            else {
                if (isFieldVisible)
                    displayTxt += "," + FCaption[i] + ":" + fldVlaue;
            }
        }
    }
    $j("#" + displayfldName + "000F1").val(displayTxt);
    UpdateFieldArray(displayfldName + "000F1", "0", displayTxt, "");
    UpdateAllFieldValues(displayfldName + "000F1", displayTxt);
}

function AxCustomRedirect() {
    SetParamValues();
}


function GoBackToPrePage(e) {
    var fallbackUrl = "page.aspx";
    //if (self.window.history.back() == undefined)
    //    self.window.location.href = fallbackUrl;
    //else
    //    self.window.history.back();

    self.window.location.href = fallbackUrl;
    e.preventDefault();
    return false;
}

$j(document).ready(function () {
    $(".toolbar").addClass("d-none");
    $("#ftbtn_iNew").addClass("d-none");
    $("#ftbtn_iDiscard").removeClass("d-none");
    $("#ftbtn_iSave").removeClass("d-none");
    $("#leftMenuToggleBtn", window.parent.document).show();
    checkSuccessAxpertMsg();
});
