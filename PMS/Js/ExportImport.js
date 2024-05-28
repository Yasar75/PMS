function AddNewCondition() {
    var dv = document.getElementById("tblFilter");
    var curntRow = $j("#tblFilter tr").length + 1;
    var rowCount = "0";

    var rowCnt = document.getElementById("FilterRowCount");
    if (rowCnt)
        rowCount = rowCnt.value;

    var index = (parseInt(rowCount) + 1).toString();
    var newRow = dv.appendChild(document.createElement("tr"));

    //$j("#tblpanel").css('margin-left', '85px');
    var ocell = newRow.insertCell();
    ocell.className = "radio d-flex px-2 pt-4";

    var el = document.createElement("input");
    el.type = "radio";
    el.name = "grpAndOr" + index;
    el.id = "radAnd" + index;
    el.className = "form-check-input";
    el.value = "And";

    var el1 = document.createElement("input");
    el1.type = "radio";
    el1.name = "grpAndOr" + index;
    el1.id = "radOr" + index;
    el1.className = "form-check-input";
    el1.value = "Or";

    ocell.appendChild(el);
    var spn = document.createElement("span");
    //spn.style.marginLeft = "2px";
    //spn.style.marginRight = "5px";
    spn.className = "d-flex align-content-center flex-wrap px-2";
    spn.innerText = "And";
    ocell.appendChild(spn);

    ocell.appendChild(el1);
    spn = document.createElement("span");
    //spn.style.marginLeft = "1px"
    spn.className = "d-flex align-content-center flex-wrap px-2";
    spn.innerText = "Or";
    ocell.appendChild(spn);
    ocell.style.align = "right";

    var rad = document.getElementById("radOr" + index);
    if (rad)
        rad.checked = true;
    index = (parseInt(index) + 1).toString();
    var cell = newRow.insertCell();
    cell.className = "px-2";
    var ddlClm = document.createElement("select");
    ddlClm.id = "ddlFilter" + index;
    ddlClm.className = "lblTxt form-select";
    ddlClm.style.maxWidth = "250px";
    ddlClm.style.minWidth = "150px";
    cell.appendChild(ddlClm);
    $("#ddlFilter" + index).select2();
    var ddlFilter = document.getElementById("ddlFilter" + index);
    ddlFilter.length = 0;
    if (ddlFilter) {
        var parDll = document.getElementById("ddlFilter");
        if (parDll.length > 0) {
            for (var i = 0; i < parDll.length; i++) {
                var opt = document.createElement("option");
                opt.text = parDll.options[i].text;
                opt.value = parDll.options[i].value;
                if ($(parDll.options[i]).attr("date-field") != undefined) {
                    opt.setAttribute("date-field", true);
                }
                ddlFilter.options.add(opt);
            }
        }
    }

    cell = newRow.insertCell();
    cell.className = "px-2";
    var ddlOpr = document.createElement("select");
    ddlOpr.id = "ddlOpr" + index;
    ddlOpr.className = "lblTxt form-select";
    //ddlOpr.style.width = "173px";
    ddlOpr.setAttribute('onchange', 'CheckFilterCond(' + index + ')');
    cell.appendChild(ddlOpr);
    $("#ddlOpr" + index).select2();
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

    
    //change event for newly created filter conditions
    $("#ddlOpr" + index + ",#ddlFilter" + index).change(function () {
        condition = $("#ddlOpr" + index).val();
        filterIds = condition == "between" ? ("#txtFilter" + index + ", #txtFillVal"+index+"" ): "#txtFilter"+index;
        filter = $("#ddlFilter" + index+" :selected").attr("date-field");
        if (filter != undefined) {//display date picker option for values only if the field type is date 
            $(filterIds).datepicker({
                dateFormat: 'dd/mm/yy',
                changeMonth: true,
                changeYear: true,
            }).attr("placeholder", "dd/mm/yyyy").on('change', function (ev) {
                if (filter != undefined && validateDate($(this).val()) == null)
                    $(this).focus();
            });
        }
        else 
            $(filterIds).datepicker("destroy").attr("placeholder", "").val("");
    })

    cell = newRow.insertCell();
    cell.className = "px-2";
    var inpVal1 = document.createElement("input");
    //inpVal1.select2();
    inpVal1.type = "text";
    inpVal1.id = "txtFilter" + index;
    inpVal1.className = "lblTxt form-control";
    inpVal1.style.width = "100px";
    inpVal1.maxLength = "1024";
    cell.appendChild(inpVal1);

    cell = newRow.insertCell();
    cell.className = "px-2";
    var inpVal1 = document.createElement("input");
    inpVal1.type = "text";
    inpVal1.id = "txtFillVal" + index;
    inpVal1.className = "lblTxt form-control";
    inpVal1.style.width = "100px";
    inpVal1.maxLength = "1024";
    inpVal1.disabled = "disabled";
    cell.appendChild(inpVal1);

    cell = newRow.insertCell();
    cell.className = "px-2";
    //Added the anchor tag to hold the delete button since the onclick event cannot be assigned for image.
    var anc = document.createElement("a");
    anc.id = "delAnc" + index;
    anc.href = "javascript:DeleteCondition('" + index + "');";
    anc.className = "ancLink";


    var delImg = document.createElement("span");
    delImg.setAttribute("class", "curHand icon-arrows-circle-minus");
    delImg.id = "delCond" + index;
    delImg.title = eval(callParent('lcm[187]'));
    delImg.innerText = "Remove";

    anc.appendChild(delImg);
    cell.appendChild(anc);

    rowCnt.value = index;
}
$( document ).ready(function() {
    var element = document.querySelector("#kt_stepper_example_clickable");

		// Initialize Stepper
		var stepper = new KTStepper(element);

		// Handle navigation click
		stepper.on("kt.stepper.click", function (stepper) {
            if(!stepper.stepped){
                return;
            }
			stepper.goTo(stepper.getClickedStepIndex()); // go to clicked step
		});

		// Handle next step
        stepper.on("kt.stepper.next", function (stepper) {
            // if(!stepper.stepped){
            //     return;
            // }

            if (stepper.getCurrentStepIndex() == 1) {
                var selecCondition =  ValSelectCondition();
                if (selecCondition) {
                    return;
                }
                else {

                    stepper.goNext();  
                    return;
                }

            }
            //else
            if (stepper.getCurrentStepIndex() == 2) {

                var resultForNxtClick = SaveCondition();
                if (resultForNxtClick) {
                //    $("#ddlExFileType").focus();
                    
                    stepper.goNext();
                    return;
                }
                else {
                    
                    // stepper.goNext();
                }

            }

            if (stepper.getCurrentStepIndex() == 3) {
                
                // if (stepper.getCurrentStepIndex() == 3) {
                    // var temp = "";
                    // $("#mSelectRight option").each(function () {
                    //     temp += $(this).val() + ", "
                    // })
                    // temp = temp.substring(0, temp.length - 2);
                    // $('#hdnColValues').val(temp);
                    var result = ClickExportBtn();
                    if (result) {
                        stepper.goNext();
                        $(".card-footer").addClass("d-none")
                        $("#btnExport").click();
                        ShowDimmer(true);
                        
                    }
                    else{
                        
                    }
                // }  
                    //stepper.goNext();
                }
        
            
		   // stepper.goNext();// go next step
		});

		// Handle previous step
		stepper.on("kt.stepper.previous", function (stepper) {
            
			stepper.goPrevious(); // go previous step
		});

        stepper.on("kt.stepper.changed", function() {
            // console.log("kt.stepper.changed event is fired");
        });


    ShowDimmer(false);
    $("#ddlExTstruct").select2();
    $("#ddlExFileType").select2();
    $("#ddlExSeparator").select2();
    
    
    
})
function ConvertToExprStr(colName, cond, value1, value2) {
    //(Prefix field ( pfield ) Equal to 0) And (Prefix field ( pfield ) Equal to a)
    var str = "";
    if (cond.toLowerCase() == "between")
        str = "$$" + colName + "$$" + CheckSpecialCharsInXml(cond) + "$$" + CheckSpecialCharsInXml(value1) + "$$" + CheckSpecialCharsInXml(value2);
    else
        str = "$$" + colName + "$$" + CheckSpecialCharsInXml(cond) + "$$" + CheckSpecialCharsInXml(value1) + "$$";
    return str;
}

function ConvertToExprDispStr(colName, cond, value1, value2) {
    //(Prefix field ( pfield ) Equal to 0) And (Prefix field ( pfield ) Equal to a)
    colName = colName.substring(colName.indexOf("(") + 1, colName.indexOf(")"));
    var str = "";
    if (cond.toLowerCase() == "between")
        str = "(" + colName + ")" + cond + "(" + value1 + "," + value2 + ")";
    else
        str = "(" + colName + ")" + cond + "(" + value1 + ")";
    return str;
}

function SaveCondition() {
    var temp = "";
    $("#mSelectRight option").each(function () {
        temp += $(this).val() + ", "
    })
    temp = temp.substring(0, temp.length - 2);
    $('#hdnColValues').val(temp);
    $j("#hdnCondString").val('');

    var tblFilter = document.getElementById("tblFilter");
    rowCount = tblFilter.rows.length;
    var searchXml = "";
    // var displayCond = "";
    var fOpr = "";
    var fOprValue = "";
    var count = 0;


    for (var i = 0; i <= 2 * rowCount; i++) {
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
        var isDateField = $("#" + $(ddlCol).attr("id") + " :selected").attr("date-field");

        if (i == 0) {
             if (ddlCol.selectedIndex == 0 || ddlCond.selectedIndex == 0 || txtValue1.value == "" || isDateField != undefined) {
                if (rowCount == 0 && ddlCol.selectedIndex == 0 && ddlCond.selectedIndex == 0 && txtValue1.value == "") {
                    return true;
                }
                else {
                    
                    if (ddlCol.selectedIndex == 0) {
                        ddlCol.focus();
                        showAlertDialog("warning", 1024, "client");
                        return false;
                    } else if (ddlCond.selectedIndex == 0) {
                        ddlCond.focus();
                        showAlertDialog("warning", 1024, "client");
                        return false;
                    }
                    else if (txtValue1.value == "") {
                        txtValue1.focus();
                        showAlertDialog("warning", 1024, "client");
                        return false;
                    }
                    else if (isDateField != undefined) {
                        if (validateDate(txtValue1.value) == null) {
                            txtValue1.focus();
                            return false;
                        }
                    }

                    //if ($j("#lblCond").text() == "") {
                    //    showAlertDialog("warning", 1024, "client");
                    //    return false;
                    //}
                    //else {
                    //    var hdn = document.getElementById("hdnSubTypeCond");
                    //    hdn.value = $j("#lblCond").text();
                    //    return true;
                    //}
                }
            }
            if (ddlCol.selectedIndex != 0 && ddlCond.selectedIndex != 0 && txtValue1.value != "" && ddlCond[ddlCond.selectedIndex].value == "between") {
                if (txtValue2.value == "") { //end date is empty
                    txtValue2.focus();
                    showAlertDialog("warning", 1024, "client");
                    return false;
                }
                else if (isDateField != undefined) {
                    if (validateDate(txtValue1.value) == null) { //invalid start date
                        txtValue1.focus();
                        return false;
                    }
                    else if (validateDate(txtValue2.value) == null) { //invalid end date
                        txtValue2.focus();
                        return false;
                    }
                    else {
                        if (!validateDateRange(txtValue1.value, txtValue2.value)) {//invalid date range
                            showAlertDialog("warning", "Please select a valid date range");
                            txtValue1.focus();
                            return false;
                        }
                    }
                }
            }
        }

        var filterCol = ddlCol.value;
        var filterColCap = ddlCol[ddlCol.selectedIndex].text;
        var filterOpr = ddlCond.value;
        var filterValue1 = txtValue1.value;
        var filterValue2 = txtValue2.value;

        var cond = ddlCond[ddlCond.selectedIndex].value;

        if (cond == "between" && ddlCol.selectedIndex != 0 && ddlCond.selectedIndex != 0 && txtValue1.value != "") {
            if (txtValue2.value == "") { //end date is empty
                txtValue2.focus();
                showAlertDialog("warning", 1024, "client");
                return false;
            }
            else if (isDateField != undefined) {
                if (validateDate(txtValue1.value) == null) { //invalid start date
                    txtValue1.focus();
                    return false;
                }
                else if (validateDate(txtValue2.value) == null) { //invalid end date
                    txtValue2.focus();
                    return false;
                }
                else {
                    if (!validateDateRange(txtValue1.value, txtValue2.value)) {//invalid date range
                        showAlertDialog("warning", "Please select a valid date range");
                        txtValue1.focus();
                        return false;
                    }
                }
            }
        }

        if (ddlCol.selectedIndex == 0 || ddlCond.selectedIndex == 0 || txtValue1.value == "") {
            if (ddlCol.selectedIndex == 0) {
                ddlCol.focus();
                showAlertDialog("warning", 1024, "client");
                return false;
            } else if (ddlCond.selectedIndex == 0) {
                ddlCond.focus();
                showAlertDialog("warning", 1024, "client");
                return false;
            }
            else if (txtValue1.value == "") {
                txtValue1.focus();
                showAlertDialog("warning", 1024, "client");
                return false;
            }
        }
        else if (isDateField != undefined) {
            if (validateDate(txtValue1.value) == null) { //invalid date
                txtValue1.focus();
                return false;
            }
            else if (cond == "between" && txtValue1.value != "") { 
                if (txtValue2.value == "") { 
                    txtValue2.focus();
                    showAlertDialog("warning", 1024, "client");
                    return false;
                }
            }
        }


        if ((i == 0) || (i % 2 == 0)) {
            if (searchXml == "") {
                count++;
                searchXml += "<l" + count + ">";
                searchXml += ConvertToExprStr(filterCol, cond, filterValue1, filterValue2);
            }
            else {
                count++;
                searchXml += "</l" + (count - 1) + ">";
                searchXml += "<l" + count + ">";
                if (fOprValue == "Or") {
                    searchXml += "or";
                }
                else if (fOprValue == "And") {
                    searchXml += "and";
                }
                searchXml += ConvertToExprStr(filterCol, cond, filterValue1, filterValue2);
            }
        }
       
    }
    searchXml += "</l" + count + ">";
    var finalCond = "<cond>" + searchXml + "</cond>";
    $j("#hdnCondString").val(finalCond);
    return true;
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
    for (var row = index; row < length * 2; row++) {
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
    dv.deleteRow(length - 1);
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
            value2.setAttribute("placeholder", "");
        }
    }
    else {
        var condFldName = "ddlFilcond" + index;
        var ddlCondId = "ddlOpr" + index; //document.getElementById("ddlFilcond");
        var selectedCondition = $j("#" + ddlCondId).val();
        var txtFillValId = "txtFillVal" + index;
        var txtFillVal = document.getElementById(txtFillValId);
        if (selectedCondition == "between") {
            txtFillVal.disabled = false;
        }
        else {
            txtFillVal.value = "";
            txtFillVal.disabled = true;
            txtFillVal.setAttribute("placeholder", "");
        }
    }
}

function EnableSeparator() {
    var type = $j("#ddlExFileType").find("option:selected").text();
    if (type == "Text") {
        $j("#ddlExSeparator").removeAttr("disabled");
        $j("#ddlExSeparator").prop('selectedIndex', 3);
       // $j("#ddlExSeparator").val
        $("#ddlExSeparator").trigger('change');
    }
    else {
        $j("#ddlExSeparator").attr("disabled", "disabled");
        $j("#ddlExSeparator").prop('selectedIndex', 0);
    }

    if (type != "Excel" && type != "CSV") {
        $j("#chkExWithQuotes").prop("checked", false);
        $j("#chkExWithQuotes").removeAttr("disabled");
        $j("#chkExWithQuotes").parent().removeAttr("disabled");
    }
    else {
        if (type == "CSV") {
            $j("#ddlExSeparator").prop('selectedIndex', 1);
            $("#ddlExSeparator").trigger('change');
        }
        $j("#chkExWithQuotes").prop("checked", false);
        $j("#chkExWithQuotes").attr("disabled", "disabled");
    }

    if (type != "") {
        $j("#txtExpFileName").removeAttr("disabled");
        var fileName = $j("#txtExpFileName").val();
        SetFileType(fileName, type);
    }
    else {
        $j("#txtExpFileName").attr("disabled", "disabled");
    }
}

function ShowCondition() {
    if ($j("#btnShowCond").val() == "+") {
        $j("#dvCondition").show();
        $j("#trCondition").show();
        $j("#btnShowCond").val("-");
        FillCondFields();
    }
    else {
        $j("#dvCondition").hide();
        $j("#trCondition").hide();
        $j("#btnShowCond").val("+");
    }
}

function FillCondFields() {
    if ($j('#ddlFilter > option').length < 1) {
        var selFlds = $j("#txtExFields").val().split(",");
        var arrDc = new Array();
        for (var i = 0; i < selFlds.length; i++) {
            var fldName = selFlds[i];
            var idx = $j.inArray(fldName, arrFlds);
            if (idx != -1) {
                var dcNo = arrFldDcNo[idx];
                if ($j.inArray(dcNo, arrDc) == -1) {
                    arrDc.push(dcNo);
                }
            }
        }
        var condFields = new Array();
        var comboField = $j("#ddlFilter");
        var optHtml = "<option></option>";
        comboField.append(optHtml);
        for (var j = 0; j < arrFlds.length; j++) {
            if ($j.inArray(arrFldDcNo[j], arrDc) != -1 && arrIsDc[j] == "F") {
                var optHtml = "<option>" + arrFlds[j] + "</option>";
                comboField.append(optHtml);
            }
        }
    }
}

function GetIndex(value, arrData) {
    var idx = -1;
    $j.each(arrData, function (index, value) {
        if (idx == null && value.toLowerCase().trim().equals(arrData[index].toLowerCase().trim())) {
            idx = index;
            return false;
        }
    });
    return idx;
}

function DisChks() {
    var fileName = $j("#txtExpFileName").val();
    var type = $j("#ddlExFileType").find("option:selected").text();
    if (fileName != "") {
        $j("#chkWithHeader").removeAttr("disabled");
        $j("#chkWithHeader").parent().removeAttr("disabled");
        if (type != "Excel" && type != "CSV") {
            $j("#chkExWithQuotes").removeAttr("disabled");
            $j("#chkExWithQuotes").parent().removeAttr("disabled");
        }
        $j("#btnExport").removeAttr("disabled");
        SetFileType(fileName, type);

        if ($j("#lblExError").text() != "")
            $j("#btnExport").attr("disabled", "disabled");
    }
    else {
        $j("#chkWithHeader").attr("disabled", "disabled");
        $j("#chkExWithQuotes").prop("checked", false);
        $j("#chkExWithQuotes").attr("disabled", "disabled");
        $j("#btnExport").attr("disabled", "disabled");
    }
}

function SetFileType(fileName, type) {
    if (fileName.indexOf(".") != -1)
        fileName = fileName.substring(0, fileName.lastIndexOf("."));

    if (fileName != "" && fileName.indexOf(".") == -1) {
        if (type == "Text")
            fileName = fileName + ".txt";
        else if (type == "Excel")
            fileName = fileName + ".xlsx";
        else if (type == "CSV")
            fileName = fileName + ".csv";
        $j("#txtExpFileName").val(fileName);
    }
}

function ValidateSep() {
    if ($j("#ddlImSeparator").val() == "")
        $j("#btnImport").attr("disabled", "disabled");
    else
        $j("#btnImport").removeAttr("disabled");
}

function EnableMapFlds() {
    if ($j("#upImpFile").val() != "") {
        var fName = $j("#upImpFile").val();
        var ext = fName.substring(fName.lastIndexOf(".") + 1);
        if (ext == "txt") {
            $j("#ddlImSeparator").removeAttr("disabled");
            $j("#btnImport").attr("disabled", "disabled");
        }
        else {
            $j("#ddlImSeparator").attr("disabled", "disabled");
            $j("#btnImport").removeAttr("disabled");
        }

        if (ext == "xlsx" || ext == "xls") {
            $j("#chkImWithQuotes").attr("disabled", "disabled");
            $j("#chkImWithQuotes").parent().attr("disabled", "disabled");
        }
        else {
            $j("#chkImWithQuotes").removeAttr("disabled");
            $j("#chkImWithQuotes").parent().removeAttr("disabled");
        }
        $j("#txtImFields").removeAttr("disabled");
        $j("#chkInFile").removeAttr("disabled");
        $j("#chkInFile").parent().removeAttr("disabled");
    }
    else {
        $j("#txtImFields").attr("disabled", "disabled");
        $j("#chkInFile").attr("disabled", "disabled");
        $j("#chkImWithQuotes").attr("disabled", "disabled");
    }
}

function DisMapFlds() {
    if ($j("#chkInFile").prop("checked") == true) {
        $j("#hdnMapFields").val($j("#txtImFields").val());
        $j("#txtImFields").val("");
        $j("#txtImFields").attr("disabled", "disabled");
    }
    else {
        $j("#txtImFields").removeAttr("disabled");
        $j("#txtImFields").val($j("#hdnMapFields").val());
        if ($j("#txtImFields").val() == "")
            $j("#btnImport").attr("disabled", "disabled");
        else
            $j("#btnImport").removeAttr("disabled");
    }
}

function ShowDates() {
    var selValue = $j("#rbtnType").val();
    if (selValue == "Date")
        $j("#dvDate").show();
    else if (selValue = "Date Range")
        $j("#dvRange").show();
    else {
        $j("#dvDate").hide();
        $j("#dvRange").hide();
    }
}

function SetExType() {
    if ($j("#chkExWithQuotes").prop("checked") == true) {
        $j("#ddlExSeparator").val(",");
        $j("#ddlExSeparator").attr("disabled", "disabled");
    }
    else {
        $j("#ddlExSeparator").val("");
        $j("#ddlExSeparator").removeAttr("disabled");
    }
}

function ValSelectCondition() {
    var ddl = 0;
    var multiselect = 0;
    if ($('#ddlExTstruct').val() != 'NA') {
        ddl = 1;

        if ($('#mSelectLeft').val() != null) {
            if ($('#mSelectRight option').val() != undefined && $('#mSelectRight option').val().length > 0) {
                multiselect = 1
                var temp = "";
                $("#mSelectRight option").each(function () {
                    temp += $(this).val() + ", "
                })
                temp = temp.substring(0, temp.length - 2);
                $('#hdnColValues').val(temp);
            }
            else {
                $('#hdnColValues').val('');
                showAlertDialog("warning", eval(callParent('lcm[108]')));
                $('#mSelectLeft').focus();
                return true;
            }
        } else {
            showAlertDialog("warning", eval(callParent('lcm[108]')));
            $('#mSelectLeft').focus();
            return true;
        }
    }
    else {
        showAlertDialog("warning", eval(callParent('lcm[106]')));
        return true;
        
       // $('#ddlExTstruct').data('selectpicker').$button.focus();
    }

    // if (ddl == 1 && multiselect == 1) {
    //     return true;
    // } else {
    //     return false;
    // }
}

function ClickExportBtn() {
    var FileType = 0;
    var FileName = 0;
    if ($("#ddlExFileType").val() != '')
        FileType = 1;
    else
        showAlertDialog("warning", eval(callParent('lcm[107]')));

    if ($("#txtExpFileName").val() != "") {
        FileName = 1;

        //var regex = /^[a-zA-Z0-9- ]+[.](txt|csv|xlsx)$/;
        //if ((regex.test($("#txtExpFileName").val())))
        //else
        //    showAlertDialog("warning", eval(callParent('lcm[109]')));
    }
    else
        showAlertDialog("warning", eval(callParent('lcm[110]')));

    if (FileType == 1 && FileName == 1)
        return true;
    else {
        if (FileType == 0)
            $("#ddlExFileType").focus();
        if (FileName == 0)
            $("#txtExpFileName").focus();
        return false;
    }
}

$(document).on('keydown', '.checkForSpecialCharacters', function () {
    if (event.keyCode == 16) 
        return;
    var chars = ["!", "@", "#", "%", "$", "^", "*", "+", "=", "{", "}", ":", ";", "\"", "<", ">", "?", "/", "|", "\\", "[", "]", "_", "`", "~", "&", "."];
    var tst = $.inArray(event.key, chars);
    if (tst > -1) 
        event.preventDefault();
});

function SetDefaultFileName() {
    var fileName = $("#ddlExTstruct :selected").text();
    var type = $("#ddlExFileType").val();
    var nameOfFile = fileName.substring(0, fileName.indexOf('(')).replace(/[^a-z0-9]+/gi, '');
    $("#txtExpFileName").val(fileName);
    $("#ddlExFileType").focus();
    SetFileType(fileName, type);
}

function checkForValuesChanged(Element) {
    var empty = false;
    $(Element).parents(".wizardValidation").find(".forValidation").each(function () {
        if ($(this).val() == "")
            empty = true
    });

    if (empty) {
        $("#Expli2").attr("class", "disabled").prop("disabled", true);
        $("#Expli2 a span").addClass("class", "disabled").prop("disabled", true);
        $("#Expli3").attr("class", "disabled").prop("disabled", true);
        $("#Expli3 a span").addClass("class", "disabled").prop("disabled", true);
        $("#li4").attr("class", "disabled").prop("disabled", true);
        $("#li4  a span").addClass("class", "disabled").prop("disabled", true);
    }
    else {
        $("#Expli2").removeClass("disabled").prop("disabled", false);
        $("#Expli2 a span").removeClass("disabled").prop("disabled", false);
        $("#Expli3").removeClass("disabled").prop("disabled", false);
        $("#Expli3 a span").removeClass("disabled").prop("disabled", false);

    }
    if ($("#ddlExTstruct").val() != "-- Select --") {
        SetDefaultFileName();
    }
}

function ClearFirstRow() {
    $("#txtFilter, #ddlFilcond, #filVal2").val("").attr("placeholder","");
    $("#ddlFilter").val("NA");
    $("#filVal2").attr("disabled", true);
    $("#tblFilter tr").remove();
}

function ForIconClickComplete() {
    var result = ClickExportBtn();
    if (result) {
        ShowDimmer(true);
        $('#btnExport').click();
        return true;
    } else {
        return false;
    }
}

//Function to show the dimmer on the background.
function ShowDimmer(status) {
    DimmerCalled = true;
    var dv = $j("#waitDiv");
    if (dv.length > 0 && dv != undefined) {
        if (status == true) {
            var currentfr = $j("#middle1", parent.document);
            if (currentfr) {
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

function closeWindow() {
    if (checkIfFormChanges())
        ConfirmLeave();
    else
        parent.closeModalDialog();
}

//to check if the form is dirty before closing
var isFormDirty = false;
function checkIfFormChanges() {
    var tstructForm = $("#ddlExTstruct").val();
    if (tstructForm != "NA")
        isFormDirty = true;
    else
        isFormDirty = false;
    return isFormDirty;
}

//tab foucus method for individual wizard tab by passing first & last focus ids once tab is loaded
function wizardTabFocus(firstFocusId, lastFocusId, bootstrapSelect) {
    modalButton = eval(callParent("btnModalClose", "id") + ".getElementById('btnModalClose')");
    if (modalButton.className.indexOf("firstFocusable") == -1)
        modalButton.className += " firstFocusable";
    $("#" + lastFocusId).addClass("lastFocusable");
    $(".lastFocusable").on('keydown.tabRot', function (e) {
        if ((e.which === 9 && !e.shiftKey)) {
            e.preventDefault();
            modalButton.focus();
        }
    });
    modalButton.addEventListener('keydown', function (e) {
        if ((e.which === 9 && e.shiftKey)) {
            e.preventDefault();
            $(".lastFocusable").focus();
        }
    });
    setTimeout(function () {
        if (bootstrapSelect == undefined)
            $("#" + firstFocusId).focus();
        else {
            if ($('#ddlExTstruct').val() == 'NA')
                $('#ddlExTstruct').data('selectpicker').$button.focus();
            else
                $('#mSelectLeft').focus();
        }
    }, 500)
}

function ConfirmLeave() {
    if ($(".jconfirm").length > 0)
        $(".jconfirm").remove();
    else {
        var glType = eval(callParent('gllangType'));
        var isRTL = false;
        if (glType == "ar")
            isRTL = true;
        else
            isRTL = false;
        var ConfirmSaveCB = $.confirm({
            theme: 'modern',
            title: eval(callParent('lcm[155]')),
            onContentReady: function () {
                disableBackDrop('bind');
                //to display tooltips for Confirm & Cancel buttons
                $(".jconfirm-buttons button").each(function () {
                    var txt = $(this).text();
                    $(this).prop('title', txt.charAt(0).toUpperCase() + txt.slice(1))
                });
            },
            rtl: isRTL,
            backgroundDismiss: 'false',
            escapeKey: 'buttonB',
            content: eval(callParent('lcm[111]')),
            buttons: {
                buttonA: {
                    text: eval(callParent('lcm[164]')),
                    btnClass: 'btn btn-primary',
                    action: function () {
                        ConfirmSaveCB.close();
                        parent.closeModalDialog();
                        parent.checkIfAnyActionPerformed();
                    }
                },
                buttonB: {
                    text: eval(callParent('lcm[192]')),
                    btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                    action: function () {
                        disableBackDrop('destroy');
                        parent.actionsClicked = "";
                    }
                }
            }
        });
    }
}

function validateDateRange(startDate, endDate) {
    var st = startDate;
    var patternSt = /(\d{2})\/(\d{2})\/(\d{4})/;
    var dt = new Date(st.replace(patternSt, '$3-$2-$1'));
    var et = endDate;
  //  var patternET = /(\d{2})\/(\d{2})\/(\d{4})/;
    var dt1 = new Date(et.replace(patternSt, '$3-$2-$1'));
    //startDate = $.datepicker.parseDate('dd/mm/yy', startDate);
   // endDate = $.datepicker.parseDate('dd/mm/yy', endDate);
    if (dt <= dt1)
        return true;
    else
        return false;
}

function validateDate(value) {
    var date;
    try {
        var st = value;
        var pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
        var dt = new Date(st.replace(pattern, '$3-$2-$1'));
        return dt
    }
    catch (error) {
        showAlertDialog("warning", 2044, "client");
        return null;
    }
  
}

var expWizardObj = [];
$(document).ready(function () {
   // modalHeader = eval(callParent("divModalHeader", "id") + ".getElementById('divModalHeader')");
   // modalHeader.innerText = eval(callParent('lcm[250]'));

    //updating popup over content dynamically based on language selection
    $("#icocl1").attr("data-content", eval(callParent('lcm[180]')));
    $("#icocl2").attr("data-content", eval(callParent('lcm[175]')));
    $("#icocl3").attr("data-content", eval(callParent('lcm[182]')));
    $("#icocl4").attr("data-content", eval(callParent('lcm[183]')));
    $("#icocl5").attr("data-content", eval(callParent('lcm[184]')));
    $("#icocl6").attr("data-content", eval(callParent('lcm[185]')));
    $("#icocl7").attr("data-content", eval(callParent('lcm[186]')));

    var placement;
    parent.gllangType === "ar" ? ($("#wizardWrappper").addClass('rtlLanguage'), placement = "left") : ($("#wizardWrappper").removeClass('rtlLanguage'), placement = "right");

    $('[data-toggle="popover"]').popover({
        placement: placement
    });

    //updating >, <, >>, << button title content & icons alignment dynamically based on language selection
    $("#right_All_1").prop("title", eval(callParent('lcm[171]'))).addClass(parent.gllangType === "ar" ? "fa-angle-double-left" : "fa-angle-double-right");
    $("#right_Selected_1").prop("title", eval(callParent('lcm[172]'))).addClass(parent.gllangType === "ar" ? "fa-angle-left" : "fa-angle-right");
    $("#left_Selected_1").prop("title", eval(callParent('lcm[173]'))).addClass(parent.gllangType === "ar" ? "fa-angle-right" : "fa-angle-left");
    $("#left_All_1").prop("title", eval(callParent('lcm[174]'))).addClass(parent.gllangType === "ar" ? "fa-angle-double-right" : "fa-angle-double-left");

    //updating Prev, Next, Cancel, Done button title & text properties dynamically based on language selection
    $("#wizardPrevbtn").prop("title", eval(callParent('lcm[163]'))).html("<span class='material-icons'>skip_previous</span><span class='wizard-icon'>" + eval(callParent('lcm[163]')) + "</span>");
    $("#wizardNextbtn").prop("title", eval(callParent('lcm[162]'))).html("<span class='material-icons'>skip_next</span><span class='wizard-icon'>" + eval(callParent('lcm[162]')) + "</span>");
    $("#wizardCompbtn").prop("title", eval(callParent('lcm[165]'))).html("<span class='material-icons'>thumb_up</span><span class='wizard-icon'>"+ eval(callParent('lcm[165]')) +"</span>");
    $("#wizardCancelbtn").prop("title", eval(callParent('lcm[192]'))).html("<span class='material-icons'>close</span><span class='wizard-icon'>"+ eval(callParent('lcm[192]')) +"</span>");

    if (parent.gllangType == "ar")
        $(".checkbox-inline input[type='checkbox']").siblings().addClass("rtl-label-checkbox");

    $("#btnAddNew").attr("title", eval(callParent('lcm[188]')));
    $("#clearCond").attr("title", eval(callParent('lcm[187]')));

    $('.multiselect').multiselect({
        sort: true
    });

    $(".checkForEnter").keypress(function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
        }
    });

    $(document).on("keydown", "input[type='text'],input[type='radio'],input[type='checkbox']", function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
        }
    });

    $("#ddlExFileType").val("CSV");
    $("#ddlExSeparator").val(",");
   // $("#chkExWithQuotes").attr("disabled", true);
    ClearFirstRow();
    checkSuccessAxpertMsg();
    $("#btnnext").attr("disabled", true);

    $('body').on('click', function (e) {
        $('[data-toggle=popover]').each(function () {
            // hide any open popovers when the anywhere else in the body is clicked
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                $(this).popover('hide');
            }
        });
    });

    $('body').on('hidden.bs.popover', function (e) {
        $(e.target).data("bs.popover").inState.click = false;
    });

    $("#ddlExTstruct").change(function () {
        ShowDimmer(true);
    })

    $("#ddlFilcond, #ddlFilter").change(function () {
        condition = $("#ddlFilcond").val();
        filterIds = condition == "between" ? "#txtFilter, #filVal2" : "#txtFilter";

        filter = $("#ddlFilter :selected").attr("date-field");
        try {
            if (filter != undefined) {
                $(filterIds).datepicker({
                    dateFormat: 'dd/mm/yy',
                    changeMonth: true,
                    changeYear: true,
                }).attr("placeholder", "dd/mm/yyyy").on('change', function(ev) {
                    if (filter!=undefined && validateDate($(this).val()) == null)
                        $(this).focus();
                });
            }
            else {
                $(filterIds).datepicker("destroy").attr("placeholder", "").val("");
            }
        } catch (error) { }

    })

    var dateFields = $("#hdnDateFields").val().split(',');
    if (dateFields.length > 0) {
        var captured = [];
        $("#ddlFilter option").each(function () {
            for (var i = 0; i < dateFields.length; i++) {
                var field = $(this).val();
                if (field == dateFields[i]) {
                    $(this).attr("date-field", true)
                }
            }
        })
    }
    //Widget Work flow code - begins
    //expWizardObj = new WizardComp({progress_bar:`${AxwizardType === "modern" ? "flat" : AxwizardType}`});

    ////widget initilization
    //expWizardObj.exportDataWizard = {
    //    name: 'exportDataWizard',
    //    steps: 4,
    //    ids: ["exWizardDataSearch", "exWizardFilter", "exWizardExport", "exWizardComplete"],
    //    stepNames: [eval(callParent('lcm[166]')), eval(callParent('lcm[231]')), eval(callParent('lcm[232]')), eval(callParent('lcm[233]'))],
    //    validateKeys: ["data-select", "data-filter", 'data-export']
    //}

    ////widget creation
    //expWizardObj.createWizard = function (widget) {
    //    var wizardHeaderHtml = "";
    //    var presentObj = widget;
    //    var totalSteps = presentObj.steps;
    //    var stepNames = presentObj.stepNames;
    //    var ids = presentObj.ids;
    //    $("#wizardWrappper").data('type', presentObj.name);
    //    for (var i = 0; i < totalSteps; i++) {
    //        var targetId = ids[i];
    //        if (i == 0)
    //            wizardHeaderHtml += '<div data-objtype="' + presentObj.name + '" data-id=' + i + ' data-target="' + targetId + '" class="step in-progress active">';
    //        else
    //            wizardHeaderHtml += '<div data-objtype="' + presentObj.name + '" data-id=' + i + ' data-target="' + targetId + '" class="step">';
    //        wizardHeaderHtml += '<a class="stepName" href="javascript:void(0)">' + stepNames[i] + '</a>';
    //        wizardHeaderHtml += '<div class="node"></div>';
    //        wizardHeaderHtml += '</div>';
    //    }
    //    $("#wizardHeader").html('<div class="wizard-progress">' + wizardHeaderHtml + '</div>');
    //    expWizardObj.showActiveData(ids[0])
    //    $("#wizardNextbtn").show();
    //    $("#ddlExTstruct").focus();
    //    expWizardObj.assignEvents();
    //}
    //var stepperEl = document.querySelector("#kt_stepper_example_clickable");
    //var options = {startIndex: 1};
    //var stepper = new KTStepper(stepperEl, options);
    //var stepperEl = document.querySelector("#kt_stepper_example_clickable");
    //var stepper = new KTStepper(stepperEl);
    //stepper.on("kt.stepper.next", function () {
    //    // console.log("kt.stepper.next event is fired");
    //});

    expWizardObj.assignEvents = function () {
        $("#wizardHeader .node,#wizardHeader a.stepName").on('click', function (event) {
            event.preventDefault();
            var elem = $(this);
            expWizardObj.checkClick(elem);
        });
    }

    //widget - next/prev click events
    expWizardObj.checkClick = function (elem, type) {
        var parentElem = $("#wizardHeader .step.active");
        var validateKey = parentElem.data('id');
        var validateObj = parentElem.data('objtype');
        if (type == "next") {
            var validationResult = expWizardObj.validateTheKey(validateObj, validateKey);
            if (validationResult || (parentElem.hasClass('complete') && validationResult)) {
                if (type == "next") {
                    var nextparentelem = parentElem.next();
                    if (!parentElem.hasClass('complete')) {
                        parentElem.addClass('complete').removeClass('in-progress active');
                        nextparentelem.addClass('in-progress active');


                    } else {
                        parentElem.removeClass('active');
                        nextparentelem.addClass('active');
                    }
                    var targetObj = nextparentelem.data('objtype');
                    var targetId = expWizardObj[targetObj].ids[nextparentelem.data('id')];
                    expWizardObj.showActiveData(targetId)
                    expWizardObj.checkNxtPrevBtns();
                    if (validateKey + 1 == expWizardObj.exportDataWizard.steps - 1)
                        nextparentelem.addClass("complete")
                }
            }
        }
        else if (type == "prev") {
            parentElem.removeClass('active');
            var prevParentElem = parentElem.prev();
            prevParentElem.addClass('active');
            var targetObj = prevParentElem.data('objtype');
            var targetId = expWizardObj[targetObj].ids[prevParentElem.data('id')];
            expWizardObj.showActiveData(targetId)
            expWizardObj.checkNxtPrevBtns();
        }
        else {
            var parentElem = elem.parents('.step');
            if (!parentElem.hasClass('active') && (parentElem.hasClass('complete') || parentElem.hasClass('in-progress'))) {
                $("#wizardHeader .step.active").removeClass('active')
                var target = parentElem.addClass('active').data('target');
                expWizardObj.showActiveData(target);
                expWizardObj.checkNxtPrevBtns();
            }
        }
    }

    //widget - to show active widget menu
    expWizardObj.showActiveData = function (target) {
        $(".wizardContainer").hide();
        $("#" + target).show();
    }

    //hide & show Next, Prev, Cancel & Done buttons
    expWizardObj.checkNxtPrevBtns = function () {
        var totalSteps = $("#wizardHeader .step").length;
        var curStep = $("#wizardHeader .step.active").data('id');

        if (curStep == 0) {
            wizardTabFocus("ddlExTstruct", "wizardNextbtn", true);
        }
        if (curStep == 1) {
            wizardTabFocus("ddlFilter", "wizardNextbtn");
        }
        else if (curStep == 2) {
            wizardTabFocus("ddlExFileType", "wizardNextbtn");
        }

        if (curStep == 0) {
            $("#wizardPrevbtn, #wizardCompbtn").hide();
            $("#wizardNextbtn").show();
            $("#mSelectLeft option, #mSelectRight option").prop('selected', false);
        } else if (curStep == (totalSteps - 1)) {
            $("#wizardPrevbtn").show();
            $("#wizardNextbtn").hide();
            $("#wizardCompbtn").show().click(function () { parent.closeModalDialog(); });

        } else {
            $("#wizardPrevbtn, #wizardNextbtn").show();
            $("#wizardCompbtn").hide();
        }
    }

    //Next, Prev button validations
    expWizardObj.validateTheKey = function (objct, key) {
        var presentObj = expWizardObj[objct];
        var validateKeys = presentObj.validateKeys;
        var validateKeyName = validateKeys[key];
        if (validateKeyName != "") {
            if (validateKeyName == "data-select") {
                return ValSelectCondition();
            }
            else if (validateKeyName == "data-filter") {
                var resultForNxtClick = SaveCondition();
                if (resultForNxtClick) {
                    $("#ddlExFileType").focus();
                    return true;
                }
                else
                    return false;
            }
            else if (validateKeyName == "data-export") {
                var result = ClickExportBtn();
                if (result) {
                    $("#nextbtn").click();
                    $("#btnExport").click();

                    ShowDimmer(true);
                    $("#lblSuccess").text(eval(callParent('lcm[234]')));
                    $("#lnkExpFile").text("");
                    $("#anchComplete").attr('class', 'fromExportComplete');
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            return true;
        }
    }

    //create wizard
    //expWizardObj.createWizard("exportDataWizard");
    //Widget Work flow code - end

    //to set tab focus for the the first tab(Data Search)
    //wizardTabFocus("ddlExTstruct", "wizardNextbtn",true);

    //to display tooltips for Wizard tabs
    $("#wizardWrappper .stepName").each(function () {
        $(this).prop("title", $(this).text());
        $(this).next().prop("title", $(this).text());
    });
});


