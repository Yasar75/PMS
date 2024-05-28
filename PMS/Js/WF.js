

$j(document).ready(function () {
    $("#headerWorkflow").text(callParentNew("lcm")[398]);
    $j(".RootNodeCss").click(function() {
        TreeViewNodeClick();
    });

    // ChangeTheme(window);
    adjustwin(window); AddNewLevel();
    checkSuccessAxpertMsg();
    
});


function TreeViewNodeClick() {
    //$j("#btnTreeClick").click();
}

function LoadWF() {
    Sys.WebForms.PageRequestManager.getInstance().add_endRequest(EndRequestHandler);
}
function EndRequestHandler(sender, args) {
    if (args.get_error() == undefined) {
        var hdn = $j("#hdnListWf");
        var hdnST = $j("#hdnLoadSubType");
        if (hdn.val() == "List" || hdnST.val() == "true") {
            var hdnVal = $j("#hdnLvlValues");
            var hdnStypeDet = $j("#hdnSubTypeDet");
            if (hdnST.val() == "true") {
                if (hdnStypeDet && hdnStypeDet.val() != "")
                    hdnVal.val(hdnStypeDet.val());
            }

            if (hdnVal != "") {
                var levels = hdnVal.val().split("♣");
                wfLevels.length = 0;
                LvlDetails.length = 0;
                for (var i = 0; i < levels.length; i++) {
                    if (levels[i] != "") {
                        wfLevels.push(i);
                        LvlDetails.push(levels[i]);
                    }
                }
            }
            DisplayWFDetails();
            DisplaySubTypeDet();
            hdn.val("");

        }
        else if (hdn.val() == "true") {
            DisplayWFDetails();
        }
        else {
            ShowDimmer(false);
            AxWaitCursor(false);
        }
    }
    else {
        document.body.style.cursor = 'default';
        showAlertDialog("error", 1022, "client", args.get_error().message);
    }

    ShowDimmer(false);
    AxWaitCursor(false);
}

var cIndex = 0;
function DisplaySubTypeDet() {
    var hdn = document.getElementById("hdnCondTxt").value;
    if (hdn != "") {
        var strCondTxt = "";
        if (hdn.indexOf("|") != "") {
            strCondTxt = hdn.split("|");
            for (var i = 0; i < strCondTxt.length; i++)                
                SetCondDetails(strCondTxt[i]);            
        }
        else {
            SetCondDetails(strCondTxt);
        }
    }
}

var oldCond = "";
function SetCondDetails(strCond) {
    var strCondTxt = strCond.split("^");
//TODO: Naming convention is different for 1st row and other condition rows. Make it uniform.
    if (cIndex == undefined || cIndex == "0") {
        var ddlCol = $j("#ddlFilter");
        var ddlCond = $j("#ddlFilcond");
        var txtValue1 = $j("#txtFilter");
        var txtValue2 = $j("#filVal2");
        $j("#ddlFilcond option").each(function() {
            if ($j(this).text() == strCondTxt[1]) {
                $j(this).attr('selected', 'selected');
            }
        });        
        ddlCol.val(strCondTxt[0]);
        txtValue1.val(strCondTxt[2]);
        txtValue2.val(strCondTxt[3]);

        if (strCondTxt[4] != "")
            oldCond = strCondTxt[4];
        var fOpr = document.getElementById("rad" + strCondTxt[4] + cIndex);
        if (fOpr != null)
            fOpr.checked = true;
        cIndex++;
    }
    else {
    
    
        AddNewCondition();

        //var fOprId = "grpAndOr" + cIndex;
        var fOpr = document.getElementById("rad" + strCondTxt[4] + cIndex);
        fOpr.checked = true;
        
        cIndex++;
        var ddlCol = $j("#ddlFilter" + cIndex);
        var txtValue1 = $j("#txtFilter" + cIndex);
        var txtValue2 = $j("#txtFillVal" + cIndex);
        var ddlCond = $j("#ddlOpr" + cIndex);
        var fOprId = "#grpAndOr" + cIndex;
        fOpr = $j(fOprId);

        $j("#ddlOpr" + cIndex + " option").each(function() {
        if ($j(this).text() == strCondTxt[1]) {
                $j(this).attr('selected', 'selected');
            }
        });
        ddlCol.val(strCondTxt[0]);
        txtValue1.val(strCondTxt[2]);
        txtValue2.val(strCondTxt[3]);

        if (strCondTxt[4] != "")
            oldCond = strCondTxt[4];
        cIndex++;
       
    }    
    
}

function validate(obj1, obj2, obj3, obj4, obj5) {

    var err = "";
    if (obj1[obj1.selectedIndex].value == 0)
        err += eval(callParent('lcm[141]'));

    if (obj2[obj2.selectedIndex].value == 0)
        err += eval(callParent('lcm[142]'));

    if (obj3[obj3.selectedIndex].value == 0)
        err += eval(callParent('lcm[143]'));

    if (obj4[obj4.selectedIndex].value == 0)
        err += eval(callParent('lcm[144]'));

    if (obj5[obj5.selectedIndex].value == 0)
        err += eval(callParent('lcm[145]'));

    if (err != "")
        showAlertDialog("warning", err);
}

function CheckNumeric(evt, val) {

    var charCode = (evt.which) ? evt.which : event.keyCode
    var sLen = val.length;
    if ((charCode == 46) && (sLen > 0)) { charCode = 49; }
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}

function CheckAction() {

    var txtDays = $j("#TxtDays");
    var txtHrs = $j("#TxtHrs");
    var ddlAction = $j("#ddlActions");

    if ((txtDays.val() != "" && !isNaN(txtDays.val()) && parseInt(txtDays.val()) > 0) || (txtHrs.val() != "" && !isNaN(txtHrs.val()) && parseInt(txtHrs.val()) > 0)) {

        ddlAction.prop("disabled", false);
    }
    else {
        ddlAction.prop("disabled", true);
        ddlAction.attr("selectedIndex",  -1);         
    }
}

function CheckMandatory(lstbox) {

    var intCounter = 0;
    var chkBox = $j("#ChkMandatory");
    for (var i = 0; i < lstbox.length; i++) {
        if (lstbox.options[i].selected == true)
            intCounter = intCounter + 1;
    }
    if (intCounter > 1) {
        chkBox.attr("disabled", false);
        chkBox.parent().attr("disabled", false);
    }
    else {
        chkBox.attr("disabled", true);
        chkBox.parent().attr("disabled", true);
        chkBox.attr("checked", false);
    }

}

function CheckRole(rindx) {

    var gvWork = document.getElementById("gvWorkFlow");
    rindx = rindx + 1;
    var chkMdt = gvWork.rows[rindx].cells[1].childNodes[0];
    chkMdt.disabled = true;
    var lstRole = gvWork.rows[rindx].cells[0].childNodes[0];
    var i = 0; var cnt = 0;

    for (i = 0; i < lstRole.nextSibling.length; i++) {
        if (lstRole.nextSibling[i].selected == true)
            cnt++;
    }
    if (cnt > 1) {
        chkMdt.disabled = false;
        chkMdt.nextSibling.firstChild.disabled = false;
        chkMdt.nextSibling.removeAttribute('disabled');
    }
    else {
        chkMdt.disabled = true;
        chkMdt.checked = false;
        chkMdt.nextSibling.firstChild.disabled = true;
        chkMdt.nextSibling.firstChild.checked = false;
    }
}

function CheckActions(rwindx) {

    var gvWorks = document.getElementById("gvWorkFlow");
    rwindx = rwindx + 1;
    var txtDay = gvWorks.rows[rwindx].cells[6].childNodes[0];
    var txtHour = gvWorks.rows[rwindx].cells[7].childNodes[0];
    var ddlAct = gvWorks.rows[rwindx].cells[9].childNodes[0];

    if ((txtDay.value != "" && !isNaN(txtDay.value) && parseInt(txtDay.value) > 0) || (txtHour.value != "" && !isNaN(txtHour.value) && parseInt(txtHour.value) > 0)) {

        ddlAct.disabled = false;
    }
    else {
        ddlAct.disabled = true;
        ddlAct.selectedIndex = -1;      
    }    

}


function ShowCondDiv() {
    var ddlTst = document.getElementById("ddlTst");
    if (ddlTst.selectedIndex == 0) {
        showAlertDialog("warning", 1023, "client");
        return;
    }

    var dv = document.getElementById("dvCondition");
    if (dv.style.display == "block")
        dv.style.display = "none";
    else
        dv.style.display = "block";

}
function ToggleFilterDiv(imgObj) {

    var dv = document.getElementById("dvNewrow");
    var tb = document.getElementById("tblFilter");
    if (dv) {
        if (tb.rows.length > 0) {
            if (dv.style.display == "block") {
                imgObj.src = "AxpImages/icons/16x16/expandwt.png";
                dv.style.display = "none";
                imgObj.alt = "Show";
            }
            else {
                imgObj.src = "AxpImages/icons/16x16/collapsewt.png";
                dv.style.display = "block";
                imgObj.alt = "Hide";
            }
        }
    }
}

function AddNewCondition() {

    //validate the main condition. it should not be empty.
//    var ddlTst = document.getElementById("ddlTst");
//    if (ddlTst.value == "") {
    //        showAlertDialog("warning",Tstruct name cannot be empty");
//        return;
//    }

    var dv = document.getElementById("tblFilter");
    var curntRow = $j("#tblFilter tr").length + 1;
    var rowCount = "0";

    var rowCnt = document.getElementById("FilterRowCount");
    if (rowCnt)
        rowCount = rowCnt.value;




    var index = (parseInt(rowCount) + 1).toString();

    // var newRow = dv.insertRow();
    var newRow = dv.appendChild(document.createElement("tr"));

    if (window.chrome) {
        $j("#tblpanel").css('margin-left', '6.8em');
        //var newRow = dv.appendChild(document.createElement("tr"));

        var cell = newRow.insertCell();

        //Added the anchor tag to hold the delete button since the onclick event cannot be assigned for image.
        var anc = document.createElement("a");
        anc.id = "delAnc" + index;
        anc.href = "javascript:DeleteCondition('" + index + "');";
        anc.className = "ancLink";


        var delImg = document.createElement("img");
        delImg.src = "../AxpImages/icons/16x16/delete.png";
        delImg.id = "delCond" + index;
        delImg.className = "curHand";

        anc.appendChild(delImg);
        cell.appendChild(anc);

        index = (parseInt(index) + 1).toString();
        cell = newRow.insertCell();
        var inpVal1 = document.createElement("input");
        inpVal1.type = "text";
        inpVal1.id = "txtFillVal" + index;
        inpVal1.className = "lblTxt";
        inpVal1.disabled = "disabled";
        inpVal1.style.width = "160px";
        cell.appendChild(inpVal1);

        cell = newRow.insertCell();
        var inpVal1 = document.createElement("input");
        inpVal1.type = "text";
        inpVal1.id = "txtFilter" + index;
        inpVal1.className = "lblTxt";
        inpVal1.style.width = "160px";
        cell.appendChild(inpVal1);

        cell = newRow.insertCell();
        var ddlOpr = document.createElement("select");
        ddlOpr.id = "ddlOpr" + index;
        ddlOpr.className = "lblTxt";
        ddlOpr.setAttribute('onchange', 'CheckFilterCond(' + index + ')');
        cell.appendChild(ddlOpr);

        var ddlOperator = document.getElementById("ddlOpr" + index);
        ddlOperator.length = 0;
        if (ddlOperator) {
            var parOpr = document.getElementById("ddlFilcond");
            if (parOpr.length > 0) {
                for (var i = 0; i < parOpr.length; i++) {
                    var opt = document.createElement("option");
                    opt.text = parOpr.options[i].text;
                    opt.value = parOpr.options[i].value;
                    ddlOperator.options.add(opt);
                }
            }
        }


        var cell = newRow.insertCell();
        var ddlClm = document.createElement("select");
        ddlClm.id = "ddlFilter" + index;
        ddlClm.className = "lblTxt";
        ddlClm.style.width = "120px";
        cell.appendChild(ddlClm);


        var ddlFilter = document.getElementById("ddlFilter" + index);
        ddlFilter.length = 0;
        if (ddlFilter) {
            var parDll = document.getElementById("ddlFilter");
            if (parDll.length > 0) {
                for (var i = 0; i < parDll.length; i++) {
                    var opt = document.createElement("option");
                    opt.text = parDll.options[i].text;
                    opt.value = parDll.options[i].value;
                    ddlFilter.options.add(opt);
                }
            }
        }

        var ocell = newRow.insertCell();

        var el = document.createElement("input");
        el.type = "radio";
        el.name = "grpAndOr" + index;
        el.id = "radAnd" + index;
        el.value = "And";
        var el1 = document.createElement("input");
        el1.type = "radio";
        el1.name = "grpAndOr" + index;
        el1.id = "radOr" + index;
        el1.value = "Or";


        ocell.appendChild(el);
        var spn = document.createElement("span");
        spn.innerText = "And";
        ocell.appendChild(spn);

        ocell.appendChild(el1);
        spn = document.createElement("span");
        spn.innerText = "Or";
        ocell.appendChild(spn);
        ocell.style.align = "right";

        var rad = document.getElementById("radOr" + index);
        if (rad)
            rad.checked = true;

        rowCnt.value = index;
    }
    else {
        $j("#tblpanel").css('margin-left', '6.6em');
        var ocell = newRow.insertCell();

        var el = document.createElement("input");
        el.type = "radio";
        el.name = "grpAndOr" + index;
        el.id = "radAnd" + index;
        el.value = "And";
        var el1 = document.createElement("input");
        el1.type = "radio";
        el1.name = "grpAndOr" + index;
        el1.id = "radOr" + index;
        el1.value = "Or";


        ocell.appendChild(el);
        var spn = document.createElement("span");
        spn.innerText = "And";
        ocell.appendChild(spn);

        ocell.appendChild(el1);
        spn = document.createElement("span");
        spn.innerText = "Or";
        ocell.appendChild(spn);
        ocell.style.align = "right";

        var rad = document.getElementById("radOr" + index);
        if (rad)
            rad.checked = true;
        index = (parseInt(index) + 1).toString();
        var cell = newRow.insertCell();
        var ddlClm = document.createElement("select");
        ddlClm.id = "ddlFilter" + index;
        ddlClm.className = "lblTxt";
        ddlClm.style.width = "120px";
        cell.appendChild(ddlClm);


        var ddlFilter = document.getElementById("ddlFilter" + index);
        ddlFilter.length = 0;
        if (ddlFilter) {
            var parDll = document.getElementById("ddlFilter");
            if (parDll.length > 0) {
                for (var i = 0; i < parDll.length; i++) {
                    var opt = document.createElement("option");
                    opt.text = parDll.options[i].text;
                    opt.value = parDll.options[i].value;
                    ddlFilter.options.add(opt);
                }
            }
        }

        cell = newRow.insertCell();
        var ddlOpr = document.createElement("select");
        ddlOpr.id = "ddlOpr" + index;
        ddlOpr.className = "lblTxt";
        ddlOpr.style.width = "173px";
        ddlOpr.setAttribute('onchange', 'CheckFilterCond(' + index + ')');
        cell.appendChild(ddlOpr);

        var ddlOperator = document.getElementById("ddlOpr" + index);
        ddlOperator.length = 0;
        if (ddlOperator) {
            var parOpr = document.getElementById("ddlFilcond");
            if (parOpr.length > 0) {
                for (var i = 0; i < parOpr.length; i++) {
                    var opt = document.createElement("option");
                    opt.text = parOpr.options[i].text;
                    opt.value = parOpr.options[i].value;
                    ddlOperator.options.add(opt);
                }
            }
        }


        cell = newRow.insertCell();
        var inpVal1 = document.createElement("input");
        inpVal1.type = "text";
        inpVal1.id = "txtFilter" + index;
        inpVal1.className = "lblTxt";
        inpVal1.style.width = "160px";
        cell.appendChild(inpVal1);

        cell = newRow.insertCell();
        var inpVal1 = document.createElement("input");
        inpVal1.type = "text";
        inpVal1.id = "txtFillVal" + index;
        inpVal1.className = "lblTxt";
        inpVal1.style.width = "160px";
        inpVal1.disabled = "disabled";
        cell.appendChild(inpVal1);

        cell = newRow.insertCell();

        //Added the anchor tag to hold the delete button since the onclick event cannot be assigned for image.
        var anc = document.createElement("a");
        anc.id = "delAnc" + index;
        anc.href = "javascript:DeleteCondition('" + index + "');";
        anc.className = "ancLink";


        var delImg = document.createElement("img");
        delImg.src = "../AxpImages/icons/16x16/delete.png";
        delImg.id = "delCond" + index;
        delImg.className = "curHand";

        anc.appendChild(delImg);
        cell.appendChild(anc);

        rowCnt.value = index;
    }
}

function ValidatePreviousCondition(index) {
    if (index == 0)
        index = "";
    if ($j("#ddlFilter" + index).val() == "" || $j("#ddlFilcond").val() == "" || $j("#ddlOpr"+index).val()== "" || $j("#txtFilter" + index).val() == "")
        return false;
    else if(index>0 && $j("#ddlOpr"+index).val().toLowerCase()=="between" && $j("#txtFillVal"+index).val() == "")
        return false;
    else if(index == "" && $j("#ddlFilcond").val().toLowerCase()=="between" && $j("#filVal2").val() == "")
        return false;
    else
        return true;
}

//function to convert the condition into expression for subtype.
function ConvertToExpr(fldName, dataType, opr, fldValue, fldValue1) {
    opr = opr.toLowerCase();
    var colonInFldValue = false;
    if(fldValue.substring(0,1) == ":")
    colonInFldValue = true;
    var result="";

    if (opr == "less than or equal to" || opr == "greater than or equal to") {
        var oprStr = "";
        if (opr == "less than or equal to")
            oprStr = " < ";
        else
            oprStr = " > ";

        if (colonInFldValue) {
            fldValue = fldValue.substring(1);
            result = "(" + fldName + oprStr + fldValue + ") | (" + fldName + "=" + fldValue + ")";
        }
        else if (dataType == "Date/Time") {
            result = "(" + fldName + oprStr + "ctod({" + fldValue + "})) | (" + fldName + " = ctod({" + fldValue + "}))";
        }
        else if (dataType == "Numeric") {
            result = "(" + fldName + oprStr + fldValue + ") | (" + fldName + "=" + fldValue + ")";
        }
        else {
            result = "(" + fldName + oprStr + "{" + fldValue + "}) | (" + fldName + "=" + "{" + fldValue + "})";
        }
    }
    else if (opr == "not equal to" || opr == "equal to") {
        var oprStr = "";
        if (opr.toLowerCase() == "not equal to")
            oprStr = " # ";
        else
            oprStr = " = ";

        if (colonInFldValue) {
            fldValue = fldValue.substring(1);
            result = "(" + fldName + oprStr + fldValue + ")";
        }
        else if (dataType == "Date/Time") {
            result = "(" + fldName + oprStr + " ctod({" + fldValue + "}))";
        }
        else if (dataType == "Numeric") {
            result = "(" + fldName + oprStr + fldValue + ")";
        }
        else {
            result = "(" + fldName + oprStr + "{" + fldValue + "})";
        }
    }
    else if (opr == "less than" || opr == "greater than") {

        var oprStr = "";
        if (opr == "less than")
            oprStr = " < ";
        else
            oprStr = " > ";
        if (colonInFldValue) {
            fldValue = fldValue.substring(1);
            result = "(" + fldName + oprStr + fldValue + ")";
        }
        else if (dataType == "Date/Time") {
            result = "(" + fldName + oprStr + "ctod({" + fldValue + "}))";
        }
        else if (dataType == "Numeric") {
            result = "(" + fldName + oprStr + fldValue + ")";
        }
        else {
            result = "(" + fldName + oprStr + "{" + fldValue + "})";
        }
    }
    else if(opr == "between")
    {
        var colonInFldVal1 = false;
        if (fldValue1.substring(0, 1) == ":")
            colonInFldVal1 = true;
        else colonInFldVal1 = false;

        if (colonInFldValue && colonInFldVal1) {
            fldValue = fldValue.substring(1);
            fldValue1 = fldValue1.substring(1);
            result = "((" + fldName + " > " + fldValue + ") | (" + fldName + "=" + fldValue + ")) & ";
            result += "((" + fldName + " < " + fldValue1 + ") | (" + fldName + "=" + fldValue1 + "))";
        }
        else if (colonInFldValue && !colonInFldVal1) {
            fldValue = fldValue.substring(1);
            if (dataType == "Date/Time") {
                result = "((" + fldName + ">" + fldValue + ") | (" + fldName + "=" + fldValue + ")) & ";
                result += "((" + fldName + "< ctod({" + fldValue1 + "})) | (" + fldName + " = ctod({" + fldValue1 + "})))";
            }
            else {
                result = "((" + fldName + " < " + fldValue + ") | (" + fldName + "=" + fldValue + ")) & ";
                result += "((" + fldName + " < " + fldValue1 + ") | (" + fldName + "=" + fldValue1 + ")))";
            }
        }
        else if (!colonInFldValue && colonInFldVal1) {
            fldValue1 = fldValue1.substring(1);
            if (dataType == "Date/Time") {
                result = "((" + fldName + " > ctod({" + fldValue + "})) | (" + fldName + " = ctod({" + fldValue + "})) & ";
                result += "((" + fldName + " < " + fldValue1 + ") | (" + fldName + "=" + fldValue1 + ")))";
            }
            else {
                result = "((" + fldName + " > " + fldValue + ") | (" + fldName + " = " + fldValue + "))) & ";
                result += "((" + fldName + " < " + fldValue1 + ") | (" + fldName + " = " + fldValue1 + ")))";
            }
        }
        else {
            if (dataType == "Date/Time") {
                result = "(((" + fldName + " > ctod({" + fldValue + "})) | (" + fldName + " = ctod({" + fldValue + "}))) & ";
                result += "((" + fldName + " < ctod({" + fldValue1 + "})) | (" + fldName + " = ctod({" + fldValue1 + "}))))";
            }
            else {
                result = "(((" + fldName + " > " + fldValue + ") | (" + fldName + " = " + fldValue + ")) & ";
                result += "((" + fldName + " < " + fldValue1 + ") | (" + fldName + " = " + fldValue1 + ")))";
            }
        }
    }

    return result;
}

function ConvertToExprStr(colName, colCaption, cond, value1, value2) {
    //(Prefix field ( pfield ) Equal to 0) And (Prefix field ( pfield ) Equal to a)
    var str = "";
    if (cond.toLowerCase() == "between")
        str = "(" + colCaption + " ( " + colName + " ) " + cond + " " + value1 + "," + value2 + ")";
    else
        str = "(" + colCaption + " ( " + colName + " ) " + cond + " " + value1 + ")";
    return str;
}

function SaveWFCondition() {
    
    var tblFilter = document.getElementById("tblFilter");
    rowCount = tblFilter.rows.length;
    var ddlFldTypes = document.getElementById("ddlFldTypes");
    var searchXml = "";
    searchXml += "iif(";
    var displayCond = "";
    var fOpr = "";
    var fOprValue = "";
    var condTxt = "";
    for (var i = 0; i <= 2*rowCount; i++) {
        var cnt = i + 1;
        if (i == 0) {
            var ddlCol = document.getElementById("ddlFilter");
            var ddlCond = document.getElementById("ddlFilcond");
            var txtValue1 = document.getElementById("txtFilter");
            var txtValue2 = document.getElementById("filVal2");
        }
        else {
            if (i % 2 == 0) {
                var ddlCol = document.getElementById("ddlFilter" + i);
                var txtValue1 = document.getElementById("txtFilter" + i);
                var txtValue2 = document.getElementById("txtFillVal" + i);
                var ddlCond = document.getElementById("ddlOpr" + i);
            }
                if (i > 0) {
                    var fOprId = "grpAndOr" + i;
                    fOpr = document.getElementsByName(fOprId);
                    if (fOpr) {
                        for (var j = 0; j < fOpr.length; j++) {
                            if (fOpr[j].checked) {
                                fOprValue = fOpr[j].value;
                                continue;
                            }
                        }
                    }
                 }
              }

        if (i == 0) {
            if (ddlCol.selectedIndex == 0 || ddlCond.selectedIndex == 0 || txtValue1.value == "") {
                if ($j("#lblCond").text() == "") {
                    showAlertDialog("warning", 1024, "client");
                    return false;
                }
                else {
                    var hdn = document.getElementById("hdnSubTypeCond");
                    hdn.value = $j("#lblCond").text();
                    return true;
                }
            }
        }

        var filterCol = ddlCol.value;
        var filterColCap = ddlCol[ddlCol.selectedIndex].textContent;
        var filterOpr = ddlCond.value;
        var filterValue1 = txtValue1.value;
        var filterValue2 = txtValue2.value;

        var cond = ddlCond[ddlCond.selectedIndex].innerText;

        if (ddlCol.selectedIndex == 0 || ddlCond.selectedIndex == 0 || txtValue1.value == "") {
            continue;
        }
        else {
            if ((i == 0) || (i % 2 == 0)) {
                if (searchXml == "iif(") {
                    searchXml += ConvertToExpr(filterCol, ddlFldTypes[ddlCol.selectedIndex].textContent, cond, filterValue1, filterValue2);
                    displayCond += ConvertToExprStr(filterCol, filterColCap, cond, filterValue1, filterValue2);
                }
                else {
                    if (fOprValue == "Or") {
                        displayCond += " Or ";
                        searchXml += " | ";
                    }
                    else if (fOprValue == "And") {
                        displayCond += " And ";
                        searchXml += " & ";
                    }
                    displayCond += ConvertToExprStr(filterCol, filterColCap, cond, filterValue1, filterValue2);                   
                    searchXml += ConvertToExpr(filterCol, ddlFldTypes[ddlCol.selectedIndex].textContent, cond, filterValue1, filterValue2);
                }

                cond = CheckSpecialCharsInXml(cond);
                if (condTxt == "")
                    condTxt = filterCol + "^" + cond + "^" + filterValue1 + "^" + (filterValue2==""?"":(filterValue2 + "^")) + fOprValue;
                else
                    condTxt += "|" + "^" + fOprValue + "^" + filterCol + "^" + cond + "^" + filterValue1 + "^" + (filterValue2 == "" ? "" : (filterValue2));
            }
        }
    }
    searchXml += ",{T},{F})";
    var hdn = document.getElementById("hdnSubTypeCond");
    hdn.value = searchXml;
    var hdnCond = document.getElementById("hdnCondTxt");
    hdnCond.value = condTxt
    $j("#hdnDisplayCond").val(displayCond);
    return true;
}


function SaveSubType() {
    var tblFilter = document.getElementById("tblFilter");
    rowCount = tblFilter.rows.length;
    var ddlFldTypes = document.getElementById("ddlFldTypes");
    var searchXml = "";
    searchXml += "iif((";
    var fOpr = "";
    var fOprValue = "";
    var condTxt = "";
    for (var i = 0; i <= rowCount; i++) {
        var cnt = i + 1;
        if (i == 0) {            
            var ddlCol = document.getElementById("ddlFilter");
            var ddlCond = document.getElementById("ddlFilcond");
            var txtValue1 = document.getElementById("txtFilter");
            var txtValue2 = document.getElementById("filVal2");
        }
        else {
                var ddlCol = document.getElementById("ddlFilter" + i);               
                var txtValue1 = document.getElementById("txtFilter" + i);
                var txtValue2 = document.getElementById("txtFillVal" + i);
                var ddlCond = document.getElementById("ddlOpr" + i);
                if (i > 0) {
                    var fOprId = "grpAndOr" + i;
                    fOpr = document.getElementsByName(fOprId);
                    if (fOpr) {
                        for (var j = 0; j < fOpr.length; j++) {
                            if (fOpr[j].checked) {
                                fOprValue = fOpr[j].value;
                            }
                        }
                    }
                }
             }

        if (i == 0) {
            if (ddlCol.selectedIndex == 0 || ddlCond.selectedIndex == 0 || txtValue1.value == "") {
                if ($j("#lblCond").text() == "") {
                    showAlertDialog("warning", 1024, "client");
                    return false;
                }
                else {
                    var hdn = document.getElementById("hdnSubTypeCond");
                    hdn.value = $j("#lblCond").text();
                    return true;
                }
            }            
        }

        var filterCol = ddlCol.value;
        var filterOpr = ddlCond.value;
        var filterValue1 = txtValue1.value;
        var filterValue2 = txtValue2.value;        

        var cond = ddlCond[ddlCond.selectedIndex].innerText;

        if (ddlCol.selectedIndex == 0 || ddlCond.selectedIndex == 0 || txtValue1.value == "") {
            continue;
        }
        else {
            if ((i == 0) || (i % 2 == 0)) {
                if (searchXml == "iif((") {
                    searchXml += ConvertToExpr(filterCol, ddlFldTypes[ddlCol.selectedIndex].textContent, cond, filterValue1, filterValue2);

                }
                else {
                    if (fOprValue == "Or") {
                        searchXml += "|";
                    }
                    else if (fOprValue == "And") {
                        searchXml += "&";
                    }
                    searchXml += ConvertToExpr(filterCol, ddlFldTypes[ddlCol.selectedIndex].innerText, cond, filterValue1, filterValue2);
                }

                cond = CheckSpecialCharsInXml(cond);
                if (condTxt == "")
                    condTxt = filterCol + "^" + cond + "^" + filterValue1 +(filterValue2 == "" ? "" : ("^" + filterValue2 + "^")) + fOprValue;
                else
                    condTxt += "|" + filterCol + "^" + cond + "^" + filterValue1 + (filterValue2 == "" ? "" : ("^"+filterValue2 + "^")) + fOprValue;
            }            
        }
    }
    searchXml += "), {T},{F})";
    var hdn = document.getElementById("hdnSubTypeCond");
    hdn.value = searchXml;
    var hdnCond = document.getElementById("hdnCondTxt");
    hdnCond.value = condTxt
    return true;
}

function SetWFCondition(condText) {
    //No of conditions

    var tblFilter = document.getElementById("tblFilter");
    rowCount = tblFilter.rows.length;
    if (rowCount > 0)
        return;
    var strWF = condText.split("|");   
    var k = 1;
    for (var i = 0; i < strWF.length; i++) {
        var wfCond = strWF[i].split("^");
        var ddlCol; var ddlCond; var txtValue1; var txtValue2;
        var suffix = "";
            //The first condition will not have the operator And/Or
            if (i > 0)
                suffix = 2*i;
            if (i == 0) {

                ddlCol = $j("#ddlFilter");
                ddlCond = $j("#ddlFilcond");
                txtValue1 = $j("#txtFilter");
                txtValue2 = $j("#filVal2");
                ddlCol.val(wfCond[0]);
                if (ddlCol[0] != undefined) {
                    $j("#" + ddlCol[0].id).find("option").each(function () {
                        if ($j(this).text() == wfCond[0]) {
                            $j(this).attr("selected", "selected");
                        }
                    });
                }
                ddlCond.val(wfCond[1]);
                if (ddlCond[0] != undefined) {
                    $j("#" + ddlCond[0].id).find("option").each(function () {
                        if ($j(this).text() == wfCond[1]) {
                            $j(this).attr("selected", "selected");
                        }
                    });
                }

                txtValue1.val(wfCond[2]);
                txtValue2.val(wfCond[3]);
                if (wfCond[3] != "")
                    txtValue2[0].disabled = false;
            }
            else {

                ddlCol = $j("#ddlFilter" + suffix);
                txtValue1 = $j("#txtFilter" + suffix);
                txtValue2 = $j("#txtFillVal" + suffix);
                ddlCond = $j("#ddlOpr" + suffix);

                ddlCol.val(wfCond[1]);
                if (ddlCol[0] != undefined) {
                    $j("#" + ddlCol[0].id).find("option").each(function () {
                        if ($j(this).text() == wfCond[1]) {
                            $j(this).attr("selected", "selected");
                        }
                    });
                }
                ddlCond.val(wfCond[2]);
                if (ddlCond[0] != undefined) {
                    $j("#" + ddlCond[0].id).find("option").each(function () {
                        if ($j(this).text() == wfCond[2]) {
                            $j(this).attr("selected", "selected");
                        }
                    });
                }

                txtValue1.val(wfCond[3]);
                txtValue2.val(wfCond[4]);
                if (wfCond[4] != "")
                    txtValue2[0].disabled = false;
            }

            if (i < strWF.length - 1) {
                AddNewCondition();
            }
            if (i > 0) {
                var j = 1;
                if (i > 0 && wfCond[0] == "")
                    wfCond[0] = "Or";
                if (window.chrome) {
                    j = i * 2;
                    var Opr = $j("#rad" + wfCond[0] + j);
                    Opr.prop("checked", true);
                }
                else {
                    var Opr = $j("#rad" + wfCond[0] + k);
                    Opr.prop("checked", true);
                }
                k += 2;
               // var OprId = "#grpAndOr" + i;
                //radOr1

            }
    }
}

//Function to validate '&' and other special characters
function CheckSpecialCharsInXml(str) {
    var str = str;
    str = str.replace(/&/g, "&amp;");
    str = str.replace(/</g, "&lt;");
    str = str.replace(/>/g, "&gt;");
    str = str.replace(/'/g, "&apos;");
    str = str.replace(/"/g, '&quot;');
    return str;
}

function DeleteCondition(index) {
    if (index % 2 != 0)
        index = parseInt(index) + 1;
    var length = $j("#tblFilter tr").length;
    for (var row = index; row < length*2; row++) {
        var nxtIndx = parseInt(row) + 2;
        var oprIndx = parseInt(nxtIndx) - 1;
        var oprCrIndx = parseInt(row) - 1;
        $j('#ddlFilter' + row).val($j('#ddlFilter' + nxtIndx).val());
        if ($j("#ddlOpr" + row).length == 0)
            $j('#ddlFilcond' + row).val($j('#ddlFilcond' + nxtIndx).val());
        else
            $j('#ddlOpr' + row).val($j('#ddlOpr' + nxtIndx).val());
        $j('#txtFilter' + row).val($j('#txtFilter' + nxtIndx).val());
        $j('#txtFillVal' + row).val($j('#txtFillVal' + nxtIndx).val());
        if ($j('#radAnd' + oprIndx).is(':checked'))
            $j('#radAnd' + oprCrIndx).prop("checked", true);
        else
            $j('#radOr' + oprCrIndx).prop("checked", true);
   }
  
   var rowCnt = document.getElementById("FilterRowCount");
   if (rowCnt)
       rowCnt.value -= 2;
   var dv = document.getElementById("tblFilter");
   dv.deleteRow(length-1);
}


function CheckFilterCond(index) {

    if (index == -1) {
        var ddlCond = document.getElementById("ddlFilcond");
        var value2 = document.getElementById("filVal2");
        if (ddlCond.value == "between") {           
            value2.disabled = false;
        }
        else {
            value2.disabled = true;
            value2.value = "";
        }
    }
    else {
        var condFldName = "ddlFilcond" + index;
        var ddlCondId = "ddlOpr" + index;//document.getElementById("ddlFilcond");
        var selectedCondition = $j("#" + ddlCondId).val();
        var txtFillValId = "txtFillVal" + index;
        var txtFillVal = document.getElementById(txtFillValId);
        if (selectedCondition == "between") {
            txtFillVal.disabled = false;
        }
        else {
            txtFillVal.value = "";
            txtFillVal.disabled = true;
        }
    }
}

function RemoveLevel(dvId, index) {
    wfLevels.splice(index, 1);
    HideDiv(dvId);
    adjustwin(window);
}

function HideDiv(divId) {
    var dv = document.getElementById(divId);
    dv.style.display = "none";
}

function ConstructLevelHtml(rCnt) {
    var dvId = "dvLevel" + rCnt;
        var newRCnt = parseInt(rCnt,10) + 1;
        var str = "";
        str += "<div id='dvLevel" + rCnt + "' class='wfLevel'><div class='leftPane'><table style='width:35%'><tr><td><select id='ddlUser" + rCnt + "' Width='225px' class='lblTxt'>";
        str += "<option>All users</option><option>Reporting to user</option>";
        str += "<option>All users in this branch</option><option>All users in this department</option>";
        str += "<option>All users in this region</option></select></td><td><label id='lblRole" + rCnt + "'>In Role </label> &nbsp;<select id='ddlRole" + rCnt + "' class='lblTxt'>";
        str += "<option></option></select></td></tr><tr><td colspan='2'><input type='checkbox' id='chkReturn" + rCnt + "' checked=true />";
        str += "<label>User can return the document</label></td></tr><tr><td colspan='2'><input type='checkbox' id='chkReject" + rCnt + "' checked=true />";
        str += "<label>User can reject the document</label></td></tr>";
        str += "</table></div>";
        str += "<div class='rightPane'><a id='lnkInsert" + rCnt + "' class='handCur lnk' href=\"javascript:InsertNewLevel('" + rCnt + "', '" + newRCnt + "');adjustwin(window);\">Insert</a>&nbsp;&nbsp;";
        str += "<a class='handCur lnk' href=\"javascript:RemoveLevel('" + dvId + "', '" + rCnt + "');\">Remove</a> &nbsp;";
        str += "</div></div>";
        return str;

    }

    function AddNewLevel() {
        var hdn = document.getElementById("hdnLevelCnt");
        var rCnt = 0;
        if (hdn.value != "")
            rCnt = hdn.value;

        var str = ConstructLevelHtml(rCnt);
        var dv = $j("#dvLevels");
        dv.append(str);
        wfLevels.push(rCnt.toString());
        hdn.value = parseInt(rCnt, 10) + 1;

        var ddlrole = document.getElementById("ddlRoles");
        if (ddlrole.length > 0) {
            var curRole = document.getElementById("ddlRole" + rCnt);
            for (var i = 0; i < ddlrole.length; i++) {
                var opt = document.createElement("option");
                opt.text = ddlrole.options[i].text;
                opt.value = ddlrole.options[i].value;
                curRole.options.add(opt);
            }
        }
    }

    function DisplayWFDetails() {
        var dv = document.getElementById("dvLevels");
        dv.innerHTML = "";

        for (var i = 0; i < LvlDetails.length; i++) {
            SetNewLevel(LvlDetails[i], i);
        }

        adjustwin(window);
    }

    function ClearLevels() {
        ShowDimmer(true);
        var dv = document.getElementById("dvLevels");
        dv.innerHTML = "";
        var wfLevels = new Array();
        var LvlDetails = new Array();
        $j("#subtypeName").val("");
        $j("#ddlFilcond").val("");
        $j("#txtFilter").val("");
        $j("#filVal2").val("");
        AddNewLevel();       
    }

function SetNewLevel(strValues, rCnt) {
    var hdn = document.getElementById("hdnLevelCnt");

    var str = ConstructLevelHtml(rCnt);
    var dv = $j("#dvLevels");
        dv.append(str);
  

    var selRole = "";
    var levelValues = strValues.split("¿");
    if (levelValues[1])
        selRole = levelValues[1];

    var ddlrole = document.getElementById("ddlRoles");
    if (ddlrole.length > 0) {
        var curRole = document.getElementById("ddlRole" + rCnt);
        for (var i = 0; i < ddlrole.length; i++) {
            var opt = document.createElement("option");
            opt.text = ddlrole.options[i].text;
            opt.value = ddlrole.options[i].value;
            if (opt.text == selRole)
                opt.selected = "true";
            curRole.options.add(opt);
        }
    }

    var ddlUser = document.getElementById("ddlUser" + rCnt);
    for (var j = 0; j < ddlUser.length; j++) {
        if (ddlUser.options[j].innerText == levelValues[0]) {
            ddlUser.selectedIndex = j;
            break;
        }
    }

    var chkReject = document.getElementById("chkReject" + rCnt);
    if (levelValues[2] == "true" || levelValues[2] == "y")
        chkReject.checked = true;
    else
        chkReject.checked = false;

    var chkReturn = document.getElementById("chkReturn" + rCnt);
    if (levelValues[3] == "true" || levelValues[3] == "y")
        chkReturn.checked = true;
        else
            chkReturn.checked = false;
    
    
}

function InsertNewLevel(index, newValue) {
   
    var strHTML = "";
    var hdn = document.getElementById("hdnLevelCnt");
    var rCnt = 0;

    var ind = GetIndexOf(index);
    newValue = wfLevels.length + 1;

    wfLevels.splice(ind, 0, newValue);
    hdn.value = wfLevels.length + 1;
    for (var i = 0; i < wfLevels.length; i++) {
        if (wfLevels[i] == newValue) {
            strHTML += ConstructLevelHtml(newValue);            
        }
        else {
            var dv = document.getElementById("dvLevel" + wfLevels[i]);
            if (dv)
                strHTML += dv.outerHTML;            
        }
    }
    var dvLvl = document.getElementById("dvLevels");
    dvLvl.innerHTML = strHTML;
    var ddlrole = document.getElementById("ddlRoles");
    if (ddlrole.length > 0) {
        var curRole = document.getElementById("ddlRole" + newValue);
        for (var i = 0; i < ddlrole.length; i++) {
            var opt = document.createElement("option");
            opt.text = ddlrole.options[i].text;
            opt.value = ddlrole.options[i].value;
            curRole.options.add(opt);
        }
    }
}

function GetIndexOf(value) {
    var index =-1;
    for (var i = 0; i < wfLevels.length; i++) {
        if (wfLevels[i] == value) {
            index = i;
            break;
        }
    }
    return index;
}

function SaveLevel(index) {
    var wfName = document.getElementById("txtWorkflowName").value;
    wfNames.push(wfName);

    var user = document.getElementById("ddlUser" + index);
    var role = document.getElementById("ddlRole" + index);
    var ret = document.getElementById("chkReturn" + index);
    var reject = document.getElementById("chkReject" + index);

    var selUser = user.options[user.selectedIndex].innerText;
    var selRole = role.options[role.selectedIndex].innerText;
    var returned = "false";
    if (ret.checked == true)
        returned = "true";
    var rejected = "false"; 
    if (reject.checked == true)
        rejected = "true";            

    var str = "";
    str = selUser + ", " + selRole + ", " + returned + ", " + rejected;
    wfLevels.push(str);
}

function LoadWf(txtObj) {
    if (txtObj.value != "") {
        var btn = document.getElementById("btnLoadWorkflow");
        if (btn)
            btn.click();
    }
}

function ShowWfList() {
    var dv = document.getElementById("");
}

function SetList() {
    var hdn = document.getElementById("hdnListWf");
    hdn.value = "List";
}

function SetSelectedWf(obj) {
    if (obj) {
        var txt = document.getElementById("txtWorkflowName");
        txt.value = obj.innerText;
    }
}

function ClearEntryText() {
    var subType = document.getElementById("subtypeName");
    if (subType.value == "Enter a sub type name") {
        subType.value = "";
    }
}

function ValidateSubType() {
    var ddlSt = document.getElementById("ddlSubType");
    var txtSubType = document.getElementById("subtypeName");
    var hdnVal = document.getElementById("hdnValidate");
    if (ddlSt.selectedIndex == 0 && (txtSubType.value == "" || txtSubType.value == "Enter a sub type name")) {
        showAlertDialog("warning", 1025, "client");
        hdnVal.value = "false";
        return false;
    }
    hdnVal.value = "true";
    return true;
}


function GetRoleData() {

    if (SaveSubType()) {
        var rCnt = 0;
        var hdn = document.getElementById("hdnLevelCnt");
        rCnt = parseInt(hdn.value, 10);

        var inputXml = "";

        for (var i = 0; i < wfLevels.length; i++) {

            var indx = wfLevels[i];
            var identity = document.getElementById("ddlUser" + indx);
            var role = document.getElementById("ddlRole" + indx);
            var canReturn = document.getElementById("chkReturn" + indx);
            var canReject = document.getElementById("chkReject" + indx);

            if (role && role.value != "") {
                if (inputXml == "")
                    inputXml += role.value + "¿" + canReject.checked + "¿" + canReturn.checked + "¿" + identity[identity.selectedIndex].innerText;
                else
                    inputXml += "♣" + role.value + "¿" + canReject.checked + "¿" + canReturn.checked + "¿" + identity[identity.selectedIndex].innerText;
            }
        }
        var hdnLevel = document.getElementById("hdnWrkLevel");
        hdnLevel.value = inputXml;
    }
    else
        return false;
}

function SetBtnCap(act) {
    if ($j("#btnSave").length > 0) {
        if (act == "edit")
            $j("#btnSave").attr("value", "Update");
        else
            $j("#btnSave").attr("value", "Submit");
    }
}

function EditCond() {
    $j("#subtypeName").val($j("#ddlSubType").val());
}

//Function to show the dimmer on the background.
function ShowDimmer(status) {

    DimmerCalled = true;
    var dv = $j("#waitDiv");

    if (dv.length > 0 && dv != undefined) {
        if (status == true) {

            var currentfr = $j("#middle1", parent.document);
            if (currentfr) {
             //   dv.height(currentfr.height());
                dv.width(currentfr.width());
            }
            dv.show();
            document.onkeydown = function EatKeyPress() { return false; }
        }
        else {
            dv.hide();
            document.onkeydown = function EatKeyPress() { if (DimmerCalled == true) { return true; } }
        }
    }
    else {

        //TODO:Needs to be tested
        if (window.opener != undefined) {

            dv = $j("#waitDiv", window.opener.document);
            if (dv.length > 0) {
                if (status == true)
                    dv.show();
                else
                    dv.hide();
            }
        }
    }
    DimmerCalled = false;
}
