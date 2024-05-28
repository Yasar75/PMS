//-----------------------------List of functions in this file--------------------------------------
//SetTstProps(project, userName, transId, sessionId, roleName, traceVal) -Function to set the global variables. 
//CheckSpecialCharsInStr(str) -Function to validate '&' and other special characters 
//ShowDimmer(status) -Function to show the dimmer on the background.   
//AxWaitCursor(type) -Function to toggle the cursor style.
//GetFieldType(fieldName, fldIndex) -Function which returns the field type from the FDataType array.
//GetFieldsName(componentName) -Function which returns the fieldname from the component name.
//GetFieldsRowNo(componentName) -Function which returns the row no from the component name of the field.
//GetFieldsDcNo(componentName) -Function which returns the dc no from the component name of the field.
//GetFieldsRowFrameNo(componentName) -Function which returns the rowFrame no from the component name of the field.
//GetFieldValueFromArray(fldName) -Function which returns the value of the given field from field array.
//GetFieldValue(componentName, fillGrid) -Function which returns the value of the field from the component.
//SetFieldValue(componentName, value) -Function which set the given value to the component.
//GetDbRowNo(clientRowNo, dcNo) -Function which returns a field's  dbRowNo from the rowNo arrays.
//GetClientRowNo(dbRowNo, dcNo) -Function which returns a field's client row no from the array.
//UpdateDcRowArrays(dcNo, rowNo) -Function which adds the newly added row the row no arrays.
//ResetDbRowNo(dcNo, delDbRowNo) -Function which resets the db nos of all the rows after the deleted row.
//GetLastDbRowNo(dcNo) -Function to get the last db row no for the given dc no.  
//GetDcClientRows(dcNo) -Function which returns all the rows for a given dc. 
//IsDcGrid(dcNo) -Function which returns true if the given dc is a grid dc, else returns false.
//IsDcPopGrid(dcNo) -Function which returms true if the given dc is a pop grid.\
//IsDcParentGrid(dcNo) -Funtion which returns true if the grid is a parent grid of any popgrid. 
//IsParentField(fieldName, dcNo) -Function which returns true if the field is a parent field for any pop grid.
//RegisterActiveRow(ClientRowNo, dcNo) -Function to register the dbrowNo of the current row to the AxActivePRow variable.
//GetRowNoHelper(rowNo) -Function to construct the rowno as per our standard [ 3 digit ] from the ineteger rowNo.
//GetDeletedRows() -Function which returns the deleted row string which contains the dc and row no, from the Delete Arrays.
//IsFGParamChanged(fieldName) -Function to check if the field exists in the parameters list and all the parameters of the fill grid are bound
//ISBound(fieldname, rownumber) -Function to check if all the parent [ bound ] fields are filled.
//IsGridField(fieldname) -Function to check whether the field is grid or not. 
//GetDcNo(fieldName) -Function which returns the dc no of the given field.
//GetVisibleDCs() -Function which returns the visible dc's in a tstruct.
//GetOpenTabDcs() -Function which returns the opened tab dc's string.
//GetFieldCaption(fldName, fldIndex) -Function which returns the field caption from FCaption array.
//CheckAlphaNumeric(str) -Function to check for AlphaNumeric 
//CheckAlpha(str) -Function to check for Alphabets. 
//CheckIsNumeric(str) -Function to check for Numeric .
//CheckEmail(email) -Function to check for Email.
//UpdateFieldArray(fieldName, fieldDbRowNo, fieldValue, sourcewin) -Function to update the field arrays on change of any field.  
//ShowDialog(title, message) -Function to display the success message or error message in a tstruct on save.
//HideDialog() -Function to hide the success message or error message in a tstruct on save.
//Mouseoverstyle(obj) -Function to apply the mouseHover style for hyperlink and checkbox in a tstruct.
//Mouseoutstyle(obj) -Function to apply mouse out the style for hyperlink and checkbox in a tstruct.
//ChangeTheme(iframewindow) -Function to change the theme of the page. 
//OnFcsLstItem(lst) -Function to apply style for task button in task list on hover.
//GetDcRowCount(DcNo) -Function to get the number of rows in a particular dc.
//SetRowCount(dcNo, rowCnt) -Function sets the rowcount for the given dc.
//GetSerialNoCnt(dcNo) -Function which retuns the serial number count for the given dc.
//SetSerialNoCnt(dcNo, count) -Function which sets the serial number count for the given dc. 
//SetFocusFromDate(dtfield) -Function to set focus to the next enabled/visible field from the date field
//GetActualFieldName(fieldName) -Function which takes the fieldname (without row no and frame no) as parameter, Get its frame no.
//ReadonlyWfButtons() -Function to disable or enable workflow buttons.
//Readonlyform() -Function to make the whole tstrut readonly.
//FadeImage(objId, opacity) -Function to apply fade effect for the disabled buttons.
//SetOpacity(obj, opacity) -Function to set the opacity for the faded image.
//GetExactFieldName(currFldName, fldIndx) - function returns fieldname or fieldIndex. 
//GetGridFields(dcNo) -Function whcih returns the fields in the given grid.
//LimitText(limitField, limitNum) -Function for Text Area length validation.
//SetFocusOnField(tabNo, fldName) -Function to set focus go the given field.
//Calendarvalidate(evt, txtObj) -Function to call hidecalendar if TAB or ESC key pressed.
//ValidateCalendar(evt, val) -Function to close the calendar control if validation fails.
//CheckKeyPressed(evt, ctrl) -Function to check the key pressed and hide calendar.
//ValidateDate(obj) -Function to validate the date value in the given objects value.
//GetNextActiveRow(dbRowNo, dcNo) -Function to get the next active row in a grid dc.
//GetPreviousActiveRow(dbRowNo, dcNo) -Function to get the previous active row in a grid dc. 
//GetFieldIndex(fldName) - Function whcih returns the index of the field from the fnames array.                
//-------------------------------------------------------------------------------------------------
var SESSTIMEOUT = "SESSION_TIMEOUT";
var srchDlg = "";
var aXEmptyOption = "-- Select --";

//Function to set the global variables.
function SetTstProps(project, userName, transId, sessionId, roleName, traceVal) {

    proj = project;
    proj = CheckSpecialCharsInStr(proj);

    user = userName;
    user = CheckSpecialCharsInStr(user);

    tst = transId;
    tst = CheckSpecialCharsInStr(tst);

    sid = sessionId;
    sid = CheckSpecialCharsInStr(sid);

    trace = traceVal;
    trace = CheckSpecialCharsInStr(trace);

    window.status = "";
}

//Function to validate '&' and other special characters
function CheckSpecialCharsInStr(str) {

    var str = str;
    if (str != undefined) {
        str = str.replace(/&/g, "&amp;");
        str = str.replace(/</g, "&lt;");
        str = str.replace(/>/g, "&gt;");
        str = str.replace(/'/g, "&apos;");
        str = str.replace(/"/g, '&quot;');
    } else {
        str = "";
    }
    return str;
}

function CheckSpecialCharsInJson(str) {

    var str = str;
    if (str != undefined) {
        str = str.replace(/&/g, "&amp;");
        str = str.replace(/</g, "&lt;");
        str = str.replace(/>/g, "&gt;");
        str = str.replace(/'/g, "&apos;");
        str = str.replace(/"/g, '&quot;');
        str = str.replace(/\\/g, '&#92;');
    } else {
        str = "";
    }
    return str;
}

//Function to validate '&' and other special characters
function CheckSpecialCharsInHTML(str) {

    var str = str;
    str = str.replace(/&/g, "#amp:");
    str = str.replace(/</g, "#lt:");
    str = str.replace(/>/g, "#gt:");
    str = str.replace(/'/g, "#apos:");
    str = str.replace(/"/g, '#quot:');
    return str;
}

function RepSpecialCharsInHTML(str) {
    str = str.replace(/#amp:/g, "&");
    str = str.replace(/#lt:/g, "<");
    str = str.replace(/#gt:/g, ">");
    str = str.replace(/#apos:/g, "'");
    str = str.replace(/#quot:/g, '"');
    return str;
}
//Replacing Special characters in html
function RepSpecialCharForRTB(Str) {
    var Str = Str;
    Str = Str.replace(/&lt;/g, '<');
    Str = Str.replace(/&gt;/g, '>');
    Str = Str.replace(/&amp;nbsp;/g, ' ');

    return Str;
}

//Function to show the dimmer on the background.
function ShowDimmer(status) {

    DimmerCalled = true;
    var dv = $("#waitDiv");

    if (dv.length > 0 && dv != undefined) {
        if (status == true) {
            closeParentFrame();
            $("body").addClass("page-loading");
            document.onkeydown = function EatKeyPress() {
                return false;
            }
        } else if(!$("body").hasClass("stay-page-loading")) {
            $("body").removeClass("page-loading");
            document.onkeydown = function EatKeyPress() {
                if (DimmerCalled == true) {
                    return true;
                }
            }
        }
    } else {

        //TODO:Needs to be tested
        if (window.opener != undefined) {

            dv = $("#waitDiv", window.opener.document);
            if (dv.length > 0) {
                if (status == true) {                    
                    $("body", window.opener.document).addClass("page-loading");
                } else if(!$("body", window.opener.document).hasClass("stay-page-loading")) {
                    $("body", window.opener.document).removeClass("page-loading");
                }
            }
        }
    }
    DimmerCalled = false;
}

//Function which returns the field type from the FDataType array.
function GetFieldType(fieldName, fldIndex) {

    var fldType = "";


    if (fldIndex) {
        fldType = FDataType[fldIndex];
    } else {
        for (var i = 0; i < FNames.length; i++) {
            if (FNames[i] == fieldName) {
                fldType = FDataType[i];
                break;
            }
        }
    }
    return fldType;
}


//Function which returns the field type from the FFieldType array.
function GetDWBFieldType(fieldName, fldIndex) {
    var dfldType = "";
    if (fldIndex) {
        dfldType = FFieldType[fldIndex];
    } else {
        for (var i = 0; i < FNames.length; i++) {
            if (FNames[i] == fieldName) {
                dfldType = FFieldType[i];
                break;
            }
        }
    }
    return dfldType;
}

//Function which returns the fieldname from the component name.
function GetFieldsName(componentName) {
    if (componentName != undefined) {
        var fIndx = componentName.lastIndexOf("F");
        var fldName = componentName.substring(0, fIndx - 3);
        return fldName;
    }
}

//Function which returns the row no from the component name of the field.
function GetFieldsRowNo(componentName) {

    var fIndx = componentName.lastIndexOf("F");
    var rowNo = componentName.substring(fIndx - 3, fIndx);
    return rowNo;
}

//Function which returns the dc no from the component name of the field.
function GetFieldsDcNo(componentName) {

    var fIndx = componentName.lastIndexOf("F");
    var dcNo = componentName.substring(fIndx + 1);
    return dcNo;
}

//Function which returns the rowFrame no from the component name of the field.
function GetFieldsRowFrameNo(componentName) {

    var fIndx = componentName.lastIndexOf("F");
    var rowFrameNo = componentName.substring(fIndx - 3);
    return rowFrameNo;
}

//Function which returns the value of the given field from field array.
function GetFieldValueFromArray(fldName) {

    for (var i = 0; i < ChangedFields.length; i++) {
        if (ChangedFields[i] == fldName) {
            return ChangedFieldValues[i];
        }
    }
    return "";
}

//Function which returns the value of the field from the component.
function GetFieldValue(componentName, fillGrid) {

    var fldValue = "";
    if (componentName != "") {
        var fld = $j("#" + componentName);

        if (fld.length > 0) {
            var fldType = fld.attr("type");

            if (fldType == undefined)
                fldType = fld.prop("type");

            if (fldType == "select-one") {

                fldValue = fld.find("option:selected").text();
                if (fldValue == aXEmptyOption) fldValue = "";
                if (fillGrid != undefined) {
                    if (fldValue.indexOf("#") != -1) {
                        fldValue = fldValue.replace(/#/, "hash;");
                    }
                }
            } else if (fldType == "radio") {

                if ($j(".multiFldRdg").length > 0) {
                    $j("input:radio.multiFldRdg").each(function () {
                        if ($j(this).attr("id") == componentName && $j(this).prop("checked") == true) {
                            fldValue = $j(this).val();
                        }
                    });
                }

                $j("input:radio[name=" + componentName + "]").each(function () {
                    if ($j(this).prop("checked") == true || $j(this).prop("checked") == "checked") {
                        fldValue = $j(this).val();
                    }
                });

            } else if (fldType == "textarea") {
                let _thisId = fld.attr("id");
                if (AllFieldNames.length > 0) {
                    var idx = $j.inArray(_thisId, AllFieldNames);
                    if (idx != -1)
                        fldValue = AllFieldValues[idx];
                    else {
                        fldValue = fld.val().replace(/\n/gi, "<br>");
                        fldValue = fld.val();
                    }
                } else {
                    fldValue = fld.val().replace(/\n/gi, "<br>");
                    fldValue = fld.val();
                }
            } else if (fldType == "checkbox") {
                var isChecked = "";
                isChecked = fld.is(":checked");

                var isFldFound = false;
                if ($j(".multiFldChk").length > 0) {

                    var fldChkSep = GetChkSeparator(GetFieldsName(componentName));

                    $j("input:checkbox:checked.multiFldChk").each(function () {
                        if ($j(this).attr("id") == componentName && $j(this).prop("checked") == true) {
                            if (fldValue == "")
                                fldValue = $j(this).val();
                            else
                                fldValue += fldChkSep + $j(this).val();

                            isFldFound = true;
                        }
                    });
                }
                if (!isFldFound) {
                    if (!$j("#" + componentName).hasClass("multiFldChk"))
                        fldValue = GetChkValue(componentName, isChecked);
                }
            } else if (fldType == "select-multiple") {
                if (fillGrid != undefined) {
                    if (fldValue.indexOf("#") != -1) {
                        fldValue = fldValue.replace(/#/, "hash;");
                    }
                }
                if (fld.hasClass("multiFldChk")) {
                    if (fld.data("control") == "select2" && fld.data("separator")) {
                        fldValue = (fld.val()?.join(fld.data("separator")) ?? fld.val());
                    } else {
                        fldValue = fld.val();
                    }
                } else {
                    if (fld.data("control") == "select2" && fld.data("sep")) {
                        fldValue = (fld.val()?.join(fld.data("sep")) ?? fld.val());
                    } else {
                        fldValue = fld.val();
                    }
                }
                //if(fld.data("control") == "select2" && fld.data("separator")){
                //    fldValue = (fld.val()?.join(fld.data("separator")) ?? fld.val());
                //}else{
                //    fldValue = fld.val();
                //}
                ////fldValue = fld.val();
                //if (fldValue == "" && typeof fld.attr("data-selected") != "undefined") {
                //    fldValue = fld.attr("data-selected");
                //    let fldSep = fld.attr("data-sep");
                //    if (fldValue != "")
                //        fldValue = (fldValue?.join(fldSep) ?? fldValue);
                //        //fldValue = fldValue.split(fldSep);
                //}
                if (fldValue == dateString) fldValue = "";

            } else {

                if (fillGrid != undefined) {
                    if (fldValue.indexOf("#") != -1) {
                        fldValue = fldValue.replace(/#/, "hash;");
                    }
                }
                //fldValue = fld.val();
                var _thisId = fld.attr("id");
                if (AllFieldNames.length > 0) {
                    var idx = $j.inArray(_thisId, AllFieldNames);
                    if (idx != -1)
                        fldValue = AllFieldValues[idx];
                }
                if (fldType == "hidden" && fldValue == "" && fld.attr("defaultvalue") != undefined) {
                    fldValue = fld.attr("defaultvalue");
                }
                if (fldValue == dateString) fldValue = "";
            }
        }
    }
    try {
        let fldCustVal = AxAfterGetFieldValue();
        if (typeof fldCustVal != "undefined" && fldCustVal != "@*#")
            fldValue = fldCustVal;
    } catch (ex) { }
    return fldValue;
}

function GetFieldValueNew(componentName, fillGrid) {

    var fldValue = "";
    if (componentName != "") {
        var fld = $j("#" + componentName);

        if (fld.length > 0) {
            var fldType = fld.attr("type");

            if (fldType == undefined)
                fldType = fld.prop("type");

            if (fldType == "select-one") {

                fldValue = fld.find("option:selected").text();
                if (fldValue == aXEmptyOption) fldValue = "";
                if (fillGrid != undefined) {
                    if (fldValue.indexOf("#") != -1) {
                        fldValue = fldValue.replace(/#/, "hash;");
                    }
                }
            } else if (fldType == "radio") {

                if ($j(".multiFldRdg").length > 0) {
                    $j("input:radio.multiFldRdg").each(function () {
                        if ($j(this).attr("id") == componentName && $j(this).prop("checked") == true) {
                            fldValue = $j(this).val();
                        }
                    });
                }

                $j("input:radio[name=" + componentName + "]").each(function () {
                    if ($j(this).prop("checked") == true || $j(this).prop("checked") == "checked") {
                        fldValue = $j(this).val();
                    }
                });

            } else if (fldType == "textarea") {
                fldValue = fld.val().replace(/\n/gi, "<br>");
                fldValue = fld.val();
            } else if (fldType == "checkbox") {
                var isChecked = "";
                isChecked = fld.is(":checked");

                var isFldFound = false;
                if ($j(".multiFldChk").length > 0) {

                    var fldChkSep = GetChkSeparator(GetFieldsName(componentName));

                    $j("input:checkbox:checked.multiFldChk").each(function () {
                        if ($j(this).attr("id") == componentName && $j(this).prop("checked") == true) {
                            if (fldValue == "")
                                fldValue = $j(this).val();
                            else
                                fldValue += fldChkSep + $j(this).val();

                            isFldFound = true;
                        }
                    });
                }
                if (!isFldFound) {
                    if (!$j("#" + componentName).hasClass("multiFldChk"))
                        fldValue = GetChkValue(componentName, isChecked);
                }
            } else if (fldType == "select-multiple") {
                if (fillGrid != undefined) {
                    if (fldValue.indexOf("#") != -1) {
                        fldValue = fldValue.replace(/#/, "hash;");
                    }
                }
                if (fld.hasClass("multiFldChk")) {
                    if (fld.data("control") == "select2" && fld.data("separator")) {
                        fldValue = (fld.val()?.join(fld.data("separator")) ?? fld.val());
                    } else {
                        fldValue = fld.val();
                    }
                } else {
                    if (fld.data("control") == "select2" && fld.data("sep")) {
                        fldValue = (fld.val()?.join(fld.data("sep")) ?? fld.val());
                    } else {
                        fldValue = fld.val();
                    }
                }
                ////fldValue = fld.val();
                //if (fldValue == "" && typeof fld.attr("data-selected") != "undefined") {
                //    fldValue = fld.attr("data-selected");
                //    let fldSep = fld.attr("data-sep");
                //    if (fldValue != "")
                //        fldValue = (fldValue?.join(fldSep) ?? fldValue);
                //        //fldValue = fldValue.split(fldSep);
                //}
                if (fldValue == dateString) fldValue = "";

            } else {

                if (fillGrid != undefined) {
                    if (fldValue.indexOf("#") != -1) {
                        fldValue = fldValue.replace(/#/, "hash;");
                    }
                }
                fldValue = fld.val();
                if (fldType == "hidden" && fldValue == "" && fld.attr("defaultvalue") != undefined) {
                    fldValue = fld.attr("defaultvalue");
                }
                if (fldValue == dateString) fldValue = "";
            }
        }
    }
    try {
        let fldCustVal = AxAfterGetFieldValue();
        if (typeof fldCustVal != "undefined" && fldCustVal != "@*#")
            fldValue = fldCustVal;
    } catch (ex) { }
    return fldValue;
}

function GetChkValue(componentName, isChecked) {

    var chkValue = "";
    var dcNo = GetFieldsDcNo(componentName);
    var chkValues = $j("#" + componentName).attr("alt");
    if (chkValues != undefined)
        var chkVal = chkValues.split(",");
    try {
        if (isChecked != undefined) {
            if (IsDcGrid(dcNo)) {
                chkVal = $j.grep(chkVal, function (n) { //Removing empty string
                    return (n);
                });
                if (chkVal.length > 1) {
                    if (isChecked)
                        chkValue = chkVal[0].toString();
                    else
                        chkValue = chkVal[1].toString();
                }
            } else {

                if (isChecked)
                    chkValue = "T";
                else
                    chkValue = "F";
            }
        }
    } catch (ex) { }
    return chkValue;
}

///This function will capture the fields old value and call set field value.
//Call update sub total with the captured old value.
function CallSetFieldValue(fieldId, value, fromNumFocus, calledFrom) {
    FldOldValue = GetFieldValue(fieldId);
    if (calledFrom != undefined)
        SetFieldValue(fieldId, value, fromNumFocus, calledFrom);
    else
        SetFieldValue(fieldId, value, fromNumFocus);
    var dcNo = GetFieldsDcNo(fieldId);
    var fieldName = GetFieldsName(fieldId);
    var dcIndx = GetFormatGridIndex(dcNo);
    if (dcIndx != -1) {
        var fRowNo = GetFieldsRowNo(fieldId);
        UpdateFormatGridTotal(fieldName, dcNo, fRowNo, dcIndx);
    }
}

function CloneCombo(fld) {
    var tmpFld = fld.clone();
    fld[0].length = 0;
    tmpFld.find("option").each(function () {
        var newOption = $j(this);
        fld.append(new Option(newOption.text(), newOption.val()));
    });
    return fld;
}

//Function which set the given value to the component.
function SetFieldValue(componentName, value, fromNumFocus, calledFrom) {
    AxDoBlur = false;

    var fieldName = GetFieldsName(componentName);
    var dcNo = GetFieldsDcNo(componentName);

    if (value == "''") value = "";
    if (componentName != "") {
        //Code to set the value from textarea to Rich text box
        if ((componentName.indexOf("rtf_", 0) === 0 || componentName.indexOf("rtfm_", 0) === 0 || componentName.indexOf("fr_rtf_", 0) === 0 || GetDWBFieldType(fieldName) == "Rich Text") && (calledFrom == "LoadData" || calledFrom == "GetDep" || calledFrom == undefined) && isReadyCK) {
            value = RepSpecialCharForRTB(value);
            UpdateAllFieldValues(componentName, value);
            value = value.replace(/<gmi/g, '<img');
            CKEDITOR.instances[componentName].setData(value);            
        }
        let lowComponentName = componentName.toLowerCase();
        if ((lowComponentName.indexOf("sql_editor_", 0) === 0 || lowComponentName.indexOf("exp_editor_", 0) === 0 || GetDWBFieldType(fieldName) == "SQL Editor" || GetDWBFieldType(fieldName) == "Expression Editor") && (calledFrom == "LoadData" || calledFrom == "GetDep" || calledFrom == undefined)) {
            //means its editor
            let editor = $("#" + componentName).data("myeditor");
            if (editor) {
                editor.setValue(value);
                UpdateAllFieldValues(componentName, value);
            }
        }

        var fldId = "#" + componentName;
        var fld = $j(fldId);
        var fldType = fld.data("type") || fld.prop("type");
        if (fld.length > 0) {
            if ($j(fldId).prop("disabled") && $j(fldId).hasClass("autogen") && value == "")
                return false;

            UpdateAssignedFld(componentName);

            //hook
            var DoSetVal = true;
            try {
                DoSetVal = AxCustomSetValue(fld, fieldName, value);
            } catch (ex) {
                DoSetVal = true;
            }

            if (fldType == "select-one") {
                if (fld.prev('textarea').length > 0) {
                    fld.prev('textarea').text(value);
                    UpdateAllFieldValues(fld.attr("id"), value);
                }
                var ddlValue = "";
                //In chrome , the dropdown values are not getting cleared.
                if (fld.hasClass("fldFromSelect")) {
                    if (value == "") {
                        UpdateAllFieldValues(fld.attr("id"), "");
                        fld.empty().trigger('change');
                    }
                    else {
                        UpdateAllFieldValues(fld.attr("id"), value);
                        fld.append('<option value="' + value + '" selected="selected">' + value + '</option>');
                    }
                } else {
                    if (!$j.browser.msie)
                        fld = CloneCombo(fld);
                    fld.find("option").each(function () {
                        var htmlFldVal = value.replace(/ /g, "&nbsp;");
                        var tmpVal = value.replace(/ /g, String.fromCharCode(160));
                        if ($j(this).text() == tmpVal || value == $j(this).text()) {
                            //If the field is not a normalized field ,the source key will be false("idcol": "no").
                            // And there will not be any key value for those type of fields.So Here We need to take the field text.
                            if ($j(this).val() == "") {
                                ddlValue = $j(this).text();
                                $j(this).attr("selected", "selected");
                                $j(this).val(ddlValue);
                            } else {
                                ddlValue = $j(this).val();
                                fld.val(ddlValue);
                                //If the dropdown options do not have any value associated. fld.val will behave differently.
                                //Hence below set the current option as selected.                       
                                $j(this).attr("selected", "selected");
                                fld.val(ddlValue);
                            }
                        }
                    });
                }
                if (ddlValue != "" && !fromNumFocus)
                    ComboFillDependents(componentName, ddlValue);
            } else if (fldType == "select-multiple" || fldType == "multigroupselect") {
                let _separator = fldType == "select-multiple" ? fld.data("separator") : fld.data("sep");
                if (value != "") {
                    UpdateAllFieldValues(fld.attr("id"), value);
                    if (!Array.isArray(value)) {
                        value = [...new Set([...value.split(_separator)])].join(_separator);
                        if (fld.find("option").length == 0) {
                            $.each(value.split(_separator), function (ind, val) {
                                fld.append('<option value="' + val + '" selected="selected">' + val + '</option>');
                            });
                        }
                    }
                    fld.attr("data-selected", value);
                } else if (value == "" && (fld.hasClass("multiFldChk") || fld.hasClass("fldmultiSelect"))) {
                    UpdateAllFieldValues(fld.attr("id"), value);
                    fld.attr("data-selected", value);
                    fld.empty().trigger('change');
                }
                else if (value == "" && fld.hasClass("multiFldChklist")) {
                    UpdateAllFieldValues(fld.attr("id"), value);
                    fld.attr("data-selected", value);
                    $(`#${fld.attr("id")} > option`).prop("selected", "");
                    fld.parent().find(".select2-selection__choice").remove();
                }
            } else if (fldType == "radio") {

                if ($j(".multiFldRdg").length > 0) {
                    $j("input:radio.multiFldRdg").each(function () {
                        if ($j(this).attr("id") == componentName && $j(this).val() == value) {
                            $j(this).prop("checked", true);
                        }
                    });
                }
            } else if (fldType == "checkbox") {

                var isFldFound = false;

                var fldChkSep = GetChkSeparator(GetFieldsName(componentName));
                var clVals = value.split(fldChkSep);
                if (IsDcGrid(dcNo)) {
                    for (var cIdx = 0; cIdx < clVals.length; cIdx++) {
                        var cVal = clVals[cIdx];
                        $j("input:checkbox.multiFldChk").each(function () {
                            if ($j(this).attr("id") == componentName && $j(this).val().toLowerCase() == cVal.toLowerCase()) {
                                $j(this).prop("checked", true);
                                isFldFound = true;
                                return false;
                            }
                        });
                    }
                    if (!isFldFound) {
                        fld.text(value);
                    }
                } else {
                    try {
                        $j("#" + componentName).val(value);
                        if (!$(blurNextPreventElement).hasClass("close")) {
                            $j("#" + componentName).tokenfield('setTokens', clVals);
                        }
                    } catch (ex) { }
                }
                //if any of the item in cheklist is unchecked, uncheck the select all Or Set the Select all as checked
                if ($j("#chkAll_" + componentName).length > 0 && calledFrom != "SelectAll") {
                    var itemLength = $j("input[name='" + componentName + "']").length;
                    if (clVals.length < itemLength) {
                        $j("#chkAll_" + componentName).removeAttr("checked");
                        $j("#chkAll_" + componentName).prop("checked", false);
                    } else if (value != "" && clVals.length == itemLength) {
                        $j("#chkAll_" + componentName).prop("checked", true);
                    }

                    //when show selected is checked and any 1 item is unchecked from the list, to hide the unchecked item in list
                    ShowSelectedChkItems($j("#hideAll_" + componentName).attr("id"));

                }


                if (!isFldFound) {
                    if (value == "T" || value.toLowerCase() == "yes")
                        fld.prop("checked", true);
                    else
                        fld.prop("checked", false);
                }
            } else if (fldType == "textarea") {
                //checking if its grid or not

                var fldIndex = $j.inArray(fieldName, FNames);
                var fldType = GetFieldType(fieldName, fldIndex);
                var isValSet = false;

                if (IsGridField(fieldName) && fldType.toLowerCase() == "numeric") {

                    if (value.toString().indexOf(",") != -1)
                        value = removeCommas(value.toString());
                    value = NumericFldOnBlur(value, fldIndex);
                    if (TstructHasPop) {
                        if (IsParentField(fieldName, dcNo) && value == 0)
                            value = "";
                    }
                    UpdateAllFieldValues(fld.attr("id"), value);
                    fld.val(value);
                    fld.attr("value", value);
                    isValSet = true;
                    ApplyFldMask(fld.attr("id"), value);
                }
                if (!isValSet) {
                    var newValue = value.replace(new RegExp("<br>", "g"), "¿");
                    newValue = newValue.replace(new RegExp("¿", "g"), "\n");
                    newValue = newValue.replace(new RegExp("&#9;", "g"), "\t");
                    try {
                        if (fld.next("div").attr("id") == "cke_" + fld.attr("id"))
                            newValue = newValue.replace(new RegExp("<img", "g"), "<gmi");
                        else if (FFieldType[fldIndex] == "Rich Text")
                            newValue = newValue.replace(new RegExp("<gmi", "g"), "<img");
                    } catch (ex) { }
                    UpdateAllFieldValues(fld.attr("id"), newValue);
                    fld.val(newValue);
                    ApplyFldMask(fld.attr("id"), newValue);
                }

            } else {
                if (fld.attr("title") == "dd/mm/yyyy" && value == "" && !fld.prop("disabled")) value = "dd/mm/yyyy";

                var fldIndex = $j.inArray(fieldName, FNames);
                var fldType = GetFieldType(fieldName, fldIndex);

                if (fldType != undefined && fldType.toLowerCase() == "numeric") {
                    if (typeof value != "undefined" && value.toString().indexOf(",") != -1) {
                        value = removeCommas(value.toString());
                    }
                    fld.data("attr", value) //After change value of numeric field should update field attr value as well.
                    if (!fld.is("[type=number]")) { //apply comma will not with input type as numeric html component as in mobile
                        value = NumericFldOnBlur(value, fldIndex); //apply comma not working if we remove this
                    }
                    if (TstructHasPop) {
                        if (IsParentField(fieldName, dcNo) && value == 0)
                            value = "";
                    }
                    UpdateAllFieldValues(fld.attr("id"), value);
                    fld.val(value);
                    fld.attr("value", value);
                    ApplyFldMask(fld.attr("id"), value);
                } else if (fld.hasClass("fldmultiSelect")) { // Set value to Multi select field.
                    if (value != "") {
                        if (fld[0].type == "textarea") {
                            UpdateAllFieldValues(fld.attr("id"), value);
                            fld.val(value);
                            fld.attr("value", value);
                        }
                        SetMultiSelectValue(fld.attr("id"), value);
                    }
                } else {
                    try {
                        let fldsdId = fld.attr("id");
                        var fldType = GetFieldType(fieldName, fldIndex);


                        if (typeof AutosaveDraft != "undefined" && AutosaveDraft == "true" && checkIsdraft == "true") {
                            if (fldType != undefined && fldType.toLowerCase() != "image") {
                                if (!fldsdId.startsWith("axp_nga_") && fldsdId.indexOf("axp_gridattach_") == -1 && fldsdId.toLowerCase().indexOf("dc" + dcNo + "_image") == -1 && fldsdId.toLowerCase().indexOf("dc" + dcNo + "_referimages") == -1) {
                                    UpdateAllFieldValues(fld.attr("id"), value);
                                    fld.val(value);
                                    fld.attr("value", value);
                                    ApplyFldMask(fld.attr("id"), value);
                                }
                            }
                        } else {
                            UpdateAllFieldValues(fld.attr("id"), value);
                            fld.val(value);
                            fld.attr("value", value);
                            ApplyFldMask(fld.attr("id"), value);
                        }
                    } catch (ex) {
                        UpdateAllFieldValues(fld.attr("id"), value);
                        fld.val(value);
                        fld.attr("value", value);
                        ApplyFldMask(fld.attr("id"), value);
                    }
                }
            }
        }
        if (fld.hasClass('fldAutocomplete') && fld.val() != "") {
            //for tab event to work below class need to added when value is filling dynamically
            fld.addClass('newValueReturned');
        }
    }
    AxDoBlur = true;


    if (TstructHasPop) {
        var fieldRowNo = GetFieldsRowNo(componentName);
        if (calledFrom != undefined) {
            if (calledFrom == "GetDep")
                return;
        }
        if (IsParentField(fieldName, dcNo)) {
            RegisterActivePRow(fieldRowNo, dcNo);
            UpdatePopUpParents(componentName);
        }
    }
}

function SetMultiSelectValue(fldMsId, msValue) {
    const matches = multiSelectLoadVals.filter(s => s.includes(fldMsId + '♦')).toString();
    if (matches != "")
        multiSelectLoadVals[multiSelectLoadVals.indexOf(matches)] = fldMsId + "♦" + msValue;
    else
        multiSelectLoadVals.push(fldMsId + "♦" + msValue);
}

//Function to get the checklist field value separator
function GetChkSeparator(fieldName) {
    var fldIdx = $j.inArray(fieldName, FNames);
    var fldChkSep = FldChkSeparator[fldIdx];
    if (fldChkSep == "")
        fldChkSep = ",";

    return fldChkSep;
}


//Function which returns a field's  dbRowNo from the rowNo arrays.
function GetDbRowNo(clientRowNo, dcNo) {

    var dbRowNo = "-1";
    var isGrid = IsDcGrid(dcNo);

    if (!isGrid) {
        dbRowNo = "0";
    } else {

        var rowFound = false;
        for (var i = 0; i < RowDcNo.length; i++) {

            if (RowDcNo[i] == dcNo) {
                if (ClientRowNo[i] == clientRowNo) {
                    dbRowNo = DbRowNo[i].toString();
                    rowFound = true;
                    break;
                }
            }
        }
        if (!rowFound) {
            if (clientRowNo == "000")
                dbRowNo = "1";
            else
                dbRowNo = parseInt(clientRowNo, 10);
        }
    }
    return dbRowNo;
}

//Function which returns a field's client row no from the array.
function GetClientRowNo(dbRowNo, dcNo) {

    var clientRow = "";
    var isGrid = IsDcGrid(dcNo);

    if (!isGrid) {
        clientRow = "000";
    } else {
        var rowFound = false;
        for (var i = 0; i < RowDcNo.length; i++) {

            if (RowDcNo[i] == dcNo) {

                if (DbRowNo[i] == dbRowNo) {
                    clientRow = ClientRowNo[i].toString();
                    rowFound = true;
                    break;
                }
            }
        }

        if (!rowFound) {
            clientRow = GetRowNoHelper(dbRowNo);
        }
    }
    return clientRow;
}

//Function which adds the rows returned from the service on load.
function UpdateDcArrays(dcNo, rowCount) {
    rowCount = parseInt(rowCount, 10);
    if (rowCount == 0) {
        UpdateDcRowArrays(dcNo, "001", "Add");
    }

    for (var i = 1; i <= rowCount; i++) {
        var rowNo = GetRowNoHelper(i);
        UpdateDcRowArrays(dcNo, rowNo, "Add");
        UpdatePopArraysOnSetHtml(dcNo, rowNo);
    }
}

function UpdatePopArraysOnSetHtml(dcNo, rowNo) {
    if (TstructHasPop) {
        var isPopDc = IsDcPopGrid(dcNo);
        if (!isPopDc) {

            var popGridsStr = GetPopGrids(dcNo);
            var popGrids = popGridsStr.split(",");

            for (var i = 0; i < popGrids.length; i++) {
                if (popGrids[i] != "") {
                    var parStr = GetParentString(dcNo, rowNo, popGrids[i]);
                    AddParentRow(dcNo, rowNo, popGrids[i], parStr);
                }
            }
        }
    }
}

function ClearDcRowArrays(dcNo) {
    for (var i = RowDcNo.length; i >= 0; i--) {
        if (RowDcNo[i] == dcNo) {
            RowDcNo.splice(i, 1);
            DbRowNo.splice(i, 1);
            ClientRowNo.splice(i, 1);
        }
    }
}

//Function which adds the newly added row the row no arrays.
function UpdateDcRowArrays(dcNo, rowNo, action, formatDc) {

    var found = false;
    var indx = -1;
    for (var i = 0; i < RowDcNo.length; i++) {

        if (RowDcNo[i] == dcNo && ClientRowNo[i] == rowNo) {
            indx = i;
            found = true;
            break;
        }
    }

    if (found == false && action == "Add") {

        var lastRow = GetLastDbRowNo(dcNo);
        lastRow = parseInt(lastRow, 10) + 1;
        RowDcNo.push(dcNo);
        DbRowNo.push(lastRow);
        ClientRowNo.push(rowNo);
    } else if (found == true && action == "Delete") {
        var curRowNo = DbRowNo[indx];
        RowDcNo.splice(indx, 1);
        DbRowNo.splice(indx, 1);
        ClientRowNo.splice(indx, 1);
        ResetDbRowNo(dcNo, curRowNo, action, formatDc);
    }
}

//Function which resets the db nos of all the rows after the deleted row.
function ResetDbRowNo(dcNo, delDbRowNo, action, formatDc) {

    for (var i = 0; i < RowDcNo.length; i++) {

        if (RowDcNo[i] == dcNo) {

            var dbRowNo = parseInt(DbRowNo[i], 10);
            if (dbRowNo > delDbRowNo) {
                if (action == "Delete") {
                    dbRowNo = dbRowNo - 1;
                    if (formatDc == -1 || formatDc == undefined) {
                        var cRowNo = ClientRowNo[i];
                        var slNo = $j("#lblSlNo" + cRowNo + "F" + dcNo);
                        if (slNo.length > 0)
                            slNo.text(dbRowNo);
                    }
                } else
                    dbRowNo = dbRowNo + 1;
                //DbRowNo[i] = dbRowNo.toString();
                DbRowNo[i] = dbRowNo;
            }
        }
    }
}

//Function to get the last db row no for the given dc no.
function GetLastDbRowNo(dcNo) {

    var DcFound = false;
    var dbRowNo = new Array();
    var dbRow = "0";

    for (var i = 0; i < RowDcNo.length; i++) {
        if (RowDcNo[i].toString() == dcNo) {
            DcFound = true;
            dbRowNo.push(DbRowNo[i].toString());
        }
    }

    if (DcFound == false) {
        dbRow = "0";
    } else {
        var rowIndx = -1;
        rowIndx = dbRowNo.getMaxVal();
        dbRow = rowIndx;
    }
    return parseInt(dbRow, 10);
}

//Function which returns all the rows for a given dc.
function GetDcClientRows(dcNo) {

    var rows = new Array();

    for (var i = 0; i < RowDcNo.length; i++) {
        if (RowDcNo[i] == dcNo) {
            rows.push(ClientRowNo[i]);
        }
    }
    return rows;
}

//Function which returns true if the given dc is a grid dc, else returns false.
function IsDcGrid(dcNo) {

    var isGrid = false;
    for (var i = 0; i < DCFrameNo.length; i++) {

        if (DCFrameNo[i] == dcNo) {
            if (DCIsGrid[i] == "False")
                isGrid = false;
            else
                isGrid = true;
            break;
        }
    }
    return isGrid;
}

function IsDcVisible(dcNo) {
    var dcDiv = "#DivFrame" + dcNo;
    if ($j(dcDiv).length > 0)
        return true;
    else {
        dcDiv = "#divDc" + dcNo;
        if ($j(dcDiv).length > 0)
            return true;
        else
            return false;
    }
}


//Function which returms true if the given dc is a pop grid.
function IsDcPopGrid(dcNo) {

    var isPopGrid = false;
    for (var i = 0; i < DCFrameNo.length; i++) {

        if (DCFrameNo[i] == dcNo && DCIsPopGrid[i].toString().toLowerCase() == "true") {
            isPopGrid = true;
            break;
        }
    }
    return isPopGrid;
}

//Funtion which returns true if the grid is a parent grid of any popgrid.
function IsDcParentGrid(dcNo) {

    var isParent = false;
    for (var i = 0; i < PopParentDCs.length; i++) {

        if (PopParentDCs[i] == dcNo) {
            isParent = true;
            break;
        }
    }
    return isParent;
}

//Function which returns true if the field is a parent field for any pop grid.
function IsParentField(fieldName, dcNo) {

    if (TstructHasPop) {

        for (var i = 0; i < PopParentDCs.length; i++) {

            if (PopParentDCs[i] == dcNo) {

                var parentFlds = PopParentFlds[i].split(",");
                for (var j = 0; j < parentFlds.length; j++) {
                    if (parentFlds[j] == fieldName) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

//Function to check if the given dc is a parent dc, then return true else return false.
function IsParentDc(dcNo) {
    var IsParent = false;
    if (TstructHasPop) {

        for (var i = 0; i < PopParentDCs.length; i++) {

            if (PopParentDCs[i] == dcNo) {
                IsParent = true;
                break;
            }
        }
    }
    return IsParent;
}

//Function to register the dbrowNo of the current row to the AxActiveRowNo variable.
function RegisterActiveRow(ClientRowNo, dcNo) {

    AxActiveRowNo = GetDbRowNo(ClientRowNo, dcNo);
    //update the parameters array.
    var found = false;
    for (var i = 0; i < Parameters.length; i++) {

        var parameter = Parameters[i].split("~");
        if (parameter[0] == "activerow") {
            Parameters[i] = "activerow" + "~" + AxActiveRowNo;
            found = true;
        }
    }
    if (!found)
        Parameters[Parameters.length] = "activerow" + "~" + AxActiveRowNo;
}

//Function to construct the rowno as per our standard [ 3 digit ] from the ineteger rowNo.
function GetRowNoHelper(rowNo) {

    rowNo = rowNo.toString();
    if (rowNo.length == 1)
        rowNo = "00" + rowNo;
    else if (rowNo.length == 2)
        rowNo = "0" + rowNo;

    return rowNo;
}

function GetChangedRows() {

    var tmpRecId = "";
    tmpRecId = $j("#recordid000F0").val();
    var changedRows = "";
    if (tmpRecId == "0" || tmpRecId == "") {
        for (var r = 0; r < DCName.length; r++) {
            var isGrid = false;
            //If the dc has data, only then the changed rows should be sent to the webservice.
            if (DCIsGrid[r].toString().toLowerCase() == "true" && (FillGridExecOnSave.includes(DCName[r].toString()) || DCHasDataRows[r] != "False")) {
                if (changedRows != "") {
                    changedRows += "~" + DCName[r].toString() + "-*";
                } else {
                    changedRows = DCName[r].toString() + "-*";
                }
            } else
                continue;
        }
    } else {

        for (var n = 0; n < ChangedDcs.length; n++) {

            if (changedRows != "") {
                changedRows += "~" + ChangedDcs[n].toString() + "-" + ChangedDcRows[n];
            } else {
                changedRows = ChangedDcs[n].toString() + "-" + ChangedDcRows[n];
            }
        }
    }
    return changedRows;
}

//Function which returns the deleted row string which contains the dc and row no, from the Delete Arrays.
function GetDeletedRows() {

    var delRows = "";
    for (var n = 0; n < DeletedDCs.length; n++) {

        if (delRows != "") {
            delRows += "~" + DeletedDCs[n].toString() + "-" + DeletedRows[n];
        } else {
            delRows = DeletedDCs[n].toString() + "-" + DeletedRows[n];
        }
    }
    return delRows;
}

//Function to check if the field exists in the parameters list and all the parameters of the fill grid are bound
function IsFGParamChanged(fieldName) {

    var paramFound = false;
    for (var i = 0; i < FillParamFld.length; i++) {

        var fillGridParams = FillParamFld[i].split(",");
        for (var j = 0; j < fillGridParams.length; j++) {

            if (fillGridParams[j] != "") {
                if (fillGridParams[j] == fieldName) {
                    paramFound = true;
                    break;
                }
            }
        }
    }

    if (paramFound) {
        var isBound = false;
        for (k = 0; k < fillGridParams.length; k++) {
            var paramDcNo = GetDcNo(fillGridParams[k]);

            if (fillGridParams[k] != "") {

                var isgrd = IsGridField(fillGridParams[k]);
                if (isgrd == false) {
                    var value = GetFieldValue(fillGridParams[k] + "000F" + paramDcNo);
                    isBound = CheckEmptyValue(fillGridParams[k] + "000F" + paramDcNo);
                    if (isBound == false) break;
                } else {
                    //If the parameter is in the same dc for which fill grid is defined then consider the active row.

                    var dcNo = FillParamDCs[k];
                    if (paramDcNo == dcNo) {

                        var rowNo = GetClientRowNo(AxActiveRowNo, dcNo);
                        var fldName = fillGridParams[k] + rowNo + "F" + paramDcNo;
                        var value = GetFieldValue(fldName);
                        isBound = CheckEmptyValue(fldName);
                        if (isBound == false) break;
                    } else {
                        //If the parameter is in a different dc, then check its value in all the rows.
                        var frRowVal = 0;
                        frRowVal = GetDcRowCount(paramDcNo);
                        frRowVal = parseInt(frRowVal, 10);

                        for (var rCnt = 1; rCnt < frRowVal; rCnt++) {
                            var rowNo = GetRowNoHelper(rCnt);
                            var value = GetFieldValue(fillGridParams[k] + rowNo + "F" + paramDcNo);
                            isBound = CheckEmptyValue(fillGridParams[k] + rowNo + "F" + paramDcNo);
                            if (isBound == false) break;
                        }
                    }
                }
            }
        }
        return isBound;
    } else
        return false;
}

function IsFGParamChangedPerf(fieldName, depfName, fieldID) {
    var paramFound = false;
    var isComponent = true;
    var fgdInx = 0;
    var fgdDcNo = depfName.substring(2, depfName.length);
    for (var i = 0; i < FillParamDCs.length; i++) {
        if (depfName == FillParamDCs[i]) {
            fgdInx = i;
            break;
        }
    }
    var fillGridParams = FillParamFld[fgdInx].split(",");
    for (var j = 0; j < fillGridParams.length; j++) {
        if (fillGridParams[j] != "") {
            if (fillGridParams[j] == fieldName) {
                paramFound = true;
                break;
            } else {
                var paramDcNo = GetDcNo(fillGridParams[j]);
                var isgrd = IsGridField(fillGridParams[j]);
                var fldComponent;
                if (isgrd == false)
                    fldComponent = $j("#" + fillGridParams[j] + "000F" + paramDcNo);
                else
                    fldComponent = $j("#" + fillGridParams[j] + "001F" + paramDcNo);
                if (paramDcNo <= fgdDcNo) {
                    paramFound = true;
                } else if (fldComponent.length > 0) {
                    EvaluateAxFunction(fillGridParams[j], fieldID);
                    paramFound = true;
                } else if (fldComponent.length == 0) {
                    EvaluateAxFunctionPerf(fillGridParams[j], fieldID);
                    isComponent = false;
                }
            }
        }
    }

    if (paramFound) {
        var isBound = false;
        for (k = 0; k < fillGridParams.length; k++) {
            var paramDcNo = GetDcNo(fillGridParams[k]);
            var fldComponent;
            var isgrd = IsGridField(fillGridParams[k]);
            if (isgrd == false)
                fldComponent = $j("#" + fillGridParams[k] + "000F" + paramDcNo);
            else
                fldComponent = $j("#" + fillGridParams[k] + "001F" + paramDcNo);
            if (fillGridParams[k] != "" && fldComponent.length > 0) {
                if (isgrd == false) {
                    var value = GetFieldValue(fillGridParams[k] + "000F" + paramDcNo);
                    isBound = CheckEmptyValuePerf(fillGridParams[k] + "000F" + paramDcNo);
                    if (isBound == false) break;
                } else {
                    //If the parameter is in the same dc for which fill grid is defined then consider the active row.

                    var dcNo = FillParamDCs[k];
                    if (paramDcNo == dcNo) {

                        var rowNo = GetClientRowNo(AxActiveRowNo, dcNo);
                        var fldName = fillGridParams[k] + rowNo + "F" + paramDcNo;
                        var value = GetFieldValue(fldName);
                        isBound = CheckEmptyValuePerf(fldName);
                        if (isBound == false) break;
                    } else {
                        //If the parameter is in a different dc, then check its value in all the rows.
                        var frRowVal = 0;
                        frRowVal = GetDcRowCount(paramDcNo);
                        frRowVal = parseInt(frRowVal, 10);

                        for (var rCnt = 1; rCnt < frRowVal; rCnt++) {
                            var rowNo = GetRowNoHelper(rCnt);
                            var value = GetFieldValue(fillGridParams[k] + rowNo + "F" + paramDcNo);
                            isBound = CheckEmptyValuePerf(fillGridParams[k] + rowNo + "F" + paramDcNo);
                            if (isBound == false) break;
                        }
                    }
                }
            } else
                isBound = true;
        }
        return isBound;
    } else if (isComponent == false)
        return true;
    else
        return false;
}

///Function to check if the field is bound or not.
function CheckEmptyValuePerf(fieldName) {
    var isBound = false;
    var isNumeric = GetFieldType(fieldName, GetFieldIndex(GetFieldsName(fieldName)));
    var gloVarField = GetFieldsName(fieldName).toUpperCase();
    if (GetFieldValue(fieldName) != "")
        isBound = true;
    else if (GetFieldValue(fieldName) == "" && typeof isNumeric != "undefined" && isNumeric.toLowerCase() == "numeric") {
        SetFieldValue(fieldName, 0);
        var dcNoChValue = GetFieldsDcNo(fieldName);
        var dcIdx = $j.inArray(dcNoChValue, DCFrameNo);
        var rowNoChValue = GetFieldsRowNo(fieldName);
        var fldDbRowNoChV = GetDbRowNo(rowNoChValue, dcNoChValue);
        if ($("#" + fieldName).length > 0 && IsDcGrid(dcNoChValue) && DCHasDataRows[dcIdx] == "False") //Refer Bug: HEA000030
            UpdateAxpRowVldInArray(dcNoChValue, "001", 1);
        if ($("#" + fieldName).length > 0)
            UpdateFieldArray(fieldName, fldDbRowNoChV, 0, "parent", "");
        isBound = true;
    } else if (CheckGlobalVars(CheckSpecialCharInGlobalVar(gloVarField)) != gloVarField) {
        isBound = true;
    }
    return isBound;
}


///Function to check if the field is bound or not.
function CheckEmptyValue(fieldName) {
    var isBound = false;

    for (var i = 0; i < FldsAssigned.length; i++) {
        if (FldsAssigned[i].toLowerCase() == fieldName.toLowerCase()) {
            isBound = true;
            break;
        }
    }

    //The second check is done in the component since, on click of tab only html is returned and json is not uodated in the FldsAssigned array.
    if (isBound == false) {
        var isNumeric = GetFieldType(fieldName, GetFieldIndex(GetFieldsName(fieldName)));
        var gloVarField = GetFieldsName(fieldName).toUpperCase();
        if (GetFieldValue(fieldName) != "")
            isBound = true;
        else if (GetFieldValue(fieldName) == "" && typeof isNumeric != "undefined" && isNumeric.toLowerCase() == "numeric") { //Assigning 0 value to the field If the field type is numeric
            SetFieldValue(fieldName, 0);
            var dcNoChValue = GetFieldsDcNo(fieldName);
            var rowNoChValue = GetFieldsRowNo(fieldName);
            var fldDbRowNoChV = GetDbRowNo(rowNoChValue, dcNoChValue);
            if ($("#" + fieldName).length > 0)
                UpdateFieldArray(fieldName, fldDbRowNoChV, 0, "parent", "");
            isBound = true;
        } else if (CheckGlobalVars(CheckSpecialCharInGlobalVar(gloVarField)) != gloVarField) {
            isBound = true;
        } else
            isBound = false;
    }
    return isBound;
}

//function to update the FldsAssigned array for every field value changed.
function UpdateAssignedFld(fldName) {
    var ind = $j.inArray(fldName, FldsAssigned);
    if (ind == -1)
        FldsAssigned.push(fldName);
}

//Function to check if all the parent [ bound ] fields are filled.
function ISBound(fieldName, rowNumber) {

    var AssignedArr = new Array();
    var returnflag = true;
    var pobj = "";

    rowNumber = GetRowNoHelper(rowNumber);
    var depDcNo = GetDcNo(fieldName);
    var fldInd = GetFieldIndex(fieldName);

    if (fldInd != -1) {
        var parentStr = FldParents[fldInd].toString().split(",");
        if (parentStr != "") {
            for (var i = 0; i < parentStr.length; i++) {

                var parDcNo = GetDcNo(parentStr[i]);
                IsParDcgrid = IsGridField(parentStr[i]);
                var newObjName = GetExactFieldName(parentStr[i]);
                isFldOldField = false;
                var tmpFldId = "";
                //Check for the field name, if the first 3 chars of the fieldname are "old"                 
                if (newObjName.substring(0, 3) == "old") {
                    isFldOldField = true;
                }

                //If the parent field is in the same dc or any other non grid dc.
                if (parDcNo == depDcNo || IsParDcgrid == false) {
                    if (IsParDcgrid == false)
                        pobj = newObjName + "000F" + parDcNo;
                    else
                        pobj = newObjName + rowNumber + "F" + parDcNo;

                    //If field prefix is old and the rest of the fieldname is a valid field.
                    //Consider it to be bound.
                    if (isFldOldField) {
                        tmpFldId = "#" + pobj.substring(3);
                        if ($j(tmpFldId).length > 0) {
                            UpdateAssignedFld(pobj);
                            isFldOldField = false;
                        }
                    }

                    var isValBound = CheckEmptyValue(pobj);
                    if (!isValBound) {
                        returnflag = false;
                        break;
                    }
                } else {
                    //If the parent field is in any other grid dc
                    var rows = GetDcClientRows(parDcNo);
                    //If the depdc is a subgrid then check only for subgrids parent row.
                    var isDcPopUp = IsDcPopGrid(depDcNo);
                    for (var j = 0; j < rows.length; j++) {
                        pobj = newObjName + rows[j] + "F" + parDcNo;

                        if (isDcPopUp && parseInt(rows[j], 10) != AxActivePRow)
                            continue;
                        //If field prefix is old and the rest of the fieldname is a valid field.
                        //Consider it to be bound.
                        if (isFldOldField) {
                            tmpFldId = "#" + pobj.substring(3);
                            if ($j(tmpFldId).length > 0) {
                                UpdateAssignedFld(pobj);
                                isFldOldField = false;
                            }
                        }

                        var isBound = CheckEmptyValue(pobj);
                        if (!isBound) {
                            returnflag = false;
                            break;
                        }
                    }
                }
                if (!returnflag)
                    break;
            }
        }
    }

    return returnflag;
}

//Function to check if all the parent [ bound ] fields are filled.
function ISBoundPerf(fieldName, rowNumber) {
    var AssignedArr = new Array();
    var returnflag = true;
    var pobj = "";
    rowNumber = GetRowNoHelper(rowNumber);
    var depDcNo = GetDcNo(fieldName);
    var fldInd = GetFieldIndex(fieldName);
    if (fldInd != -1) {
        // var parentStr = FldParents[fldInd].toString().split(",");
        var parentStr = "";
        if (ClientFldParents[fldInd] != "")
            parentStr = ClientFldParents[fldInd].toString().split(",");
        if (parentStr != "") {
            for (var i = 0; i < parentStr.length; i++) {
                if (fieldName != parentStr[i]) {
                    var parDcNo = GetDcNo(parentStr[i]);
                    IsParDcgrid = IsGridField(parentStr[i]);
                    var newObjName = GetExactFieldName(parentStr[i]);
                    isFldOldField = false;
                    var tmpFldId = "";
                    //Check for the field name, if the first 3 chars of the fieldname are "old"                 
                    if (newObjName.substring(0, 3) == "old") {
                        isFldOldField = true;
                    }

                    //If the parent field is in the same dc or any other non grid dc.
                    if (parDcNo == depDcNo || IsParDcgrid == false) {
                        if (IsParDcgrid == false)
                            pobj = newObjName + "000F" + parDcNo;
                        else
                            pobj = newObjName + rowNumber + "F" + parDcNo;

                        //If field prefix is old and the rest of the fieldname is a valid field.
                        //Consider it to be bound.
                        if (isFldOldField) {
                            tmpFldId = "#" + pobj.substring(3);
                            if ($j(tmpFldId).length > 0) {
                                UpdateAssignedFld(pobj);
                                isFldOldField = false;
                            }
                        }
                        var isValBound;
                        var dfldInd = GetFieldIndex(newObjName);
                        if (FMoe[dfldInd].toString().toLowerCase() == "fill")
                            isValBound = true;
                        else
                            isValBound = CheckEmptyValuePerf(pobj);
                        if (!isValBound) {
                            depNotBoundFld = newObjName;
                            returnflag = false;
                            break;
                        }
                    } else {
                        //If the parent field is in any other grid dc
                        var rows = GetDcClientRows(parDcNo);
                        //If the depdc is a subgrid then check only for subgrids parent row.
                        var isDcPopUp = IsDcPopGrid(depDcNo);
                        for (var j = 0; j < rows.length; j++) {
                            pobj = newObjName + rows[j] + "F" + parDcNo;

                            if (isDcPopUp && parseInt(rows[j], 10) != AxActivePRow)
                                continue;
                            //If field prefix is old and the rest of the fieldname is a valid field.
                            //Consider it to be bound.
                            if (isFldOldField) {
                                tmpFldId = "#" + pobj.substring(3);
                                if ($j(tmpFldId).length > 0) {
                                    UpdateAssignedFld(pobj);
                                    isFldOldField = false;
                                }
                            }
                            var isBound;
                            var dfldInd = GetFieldIndex(newObjName);
                            if (FMoe[dfldInd].toString().toLowerCase() == "fill")
                                isBound = true;
                            else
                                isBound = CheckEmptyValuePerf(pobj);
                            if (!isBound) {
                                depNotBoundFld = newObjName;
                                returnflag = false;
                                break;
                            }
                        }
                    }
                    if (!returnflag)
                        break;
                }
            }
        }
    }
    return returnflag;
}

//Function to check if all the parent [ bound ] fields are filled.
function ISBoundNew(fieldName, fldNameAc) {
    var AssignedArr = new Array();
    var parentFldValue = "";
    var pobj = "";
    var rowNumber = GetRowNoHelper(GetFieldsRowNo(fldNameAc));
    var depDcNo = GetDcNo(fieldName);
    var fldInd = GetFieldIndex(fieldName);
    if (fldInd != -1) {
        var parentStr = FldParents[fldInd].toString().split(",");
        if (parentStr != "") {
            for (var i = 0; i < parentStr.length; i++) {
                var parDcNo = GetDcNo(parentStr[i]);
                IsParDcgrid = IsGridField(parentStr[i]);
                var newObjName = GetExactFieldName(parentStr[i]);
                if (parDcNo == depDcNo || IsParDcgrid == false) {
                    if (IsParDcgrid == false)
                        pobj = newObjName + "000F" + parDcNo;
                    else
                        pobj = newObjName + rowNumber + "F" + parDcNo;
                    parentFldValue += newObjName + "~" + GetFieldValue(pobj) + "~~"; //"♠";
                } else {
                    var rows = GetDcClientRows(parDcNo);
                    var isDcPopUp = IsDcPopGrid(depDcNo);
                    for (var j = 0; j < rows.length; j++) {
                        pobj = newObjName + rows[j] + "F" + parDcNo;
                        parentFldValue += newObjName + "~" + GetFieldValue(pobj) + "~~"; //"♠";
                    }
                }
            }
        }
    }
    return parentFldValue;
}

function ISBoundAutoCom(fieldName, fldNameAc) {
    var AssignedArr = new Array();
    var parentFldValue = "";
    var pobj = "";
    var rowNumber = GetRowNoHelper(GetFieldsRowNo(fldNameAc));
    var depDcNo = GetDcNo(fieldName);
    var fldInd = GetFieldIndex(fieldName);
    if (fldInd != -1) {
        var parentStr = "";
        if (ClientFldParents[fldInd] != "")
            parentStr = ClientFldParents[fldInd].toString().split(",");
        if (parentStr != "") {
            for (var i = 0; i < parentStr.length; i++) {
                if (fieldName != parentStr[i]) {
                    var parDcNo = GetDcNo(parentStr[i]);
                    IsParDcgrid = IsGridField(parentStr[i]);
                    var newObjName = GetExactFieldName(parentStr[i]);
                    if (parDcNo == depDcNo || IsParDcgrid == false) {
                        if (IsParDcgrid == false)
                            pobj = newObjName + "000F" + parDcNo;
                        else
                            pobj = newObjName + rowNumber + "F" + parDcNo;
                        parentFldValue += newObjName + "~" + GetFieldValue(pobj) + "~~"; //"♠";
                    } else {
                        var rows = GetDcClientRows(parDcNo);
                        var isDcPopUp = IsDcPopGrid(depDcNo);
                        for (var j = 0; j < rows.length; j++) {
                            pobj = newObjName + rows[j] + "F" + parDcNo;
                            parentFldValue += newObjName + "~" + GetFieldValue(pobj) + "~~"; //"♠";
                        }
                    }
                }
            }
        }
    }
    return parentFldValue;
}

//Function to check whether the field is grid or not.
function IsGridField(fieldname) {

    var flag = false;
    var fldDcNo = GetDcNo(fieldname);
    flag = IsDcGrid(fldDcNo);
    return flag;
}

//Function which returns the dc no of the given field.
function GetDcNo(fieldName) {
    var fldDcNo = "0";
    if (fieldName != "" && fieldName != undefined)
        for (var i = 0; i < FNames.length; i++) {

            if (FNames[i].toLowerCase() == fieldName.toLowerCase()) {
                fldDcNo = FldFrameNo[i];
                break;
            }
        }
    return fldDcNo;
}

//Function which returns the visible dc's in a tstruct.
function GetVisibleDCs() {

    var i = 0;
    var strVisibleDc = "";
    for (i = 0; i < VisibleDCs.length; i++) {

        if (VisibleDCs[i] != "") {
            if (i == 0) {
                strVisibleDc += "dc" + VisibleDCs[i].toString();
            } else {
                strVisibleDc += "," + "dc" + VisibleDCs[i].toString();
            }
        }
    }
    return strVisibleDc;
}

//Function which returns the opened tab dc's string.
function GetOpenTabDcs() {

    var i = 0;
    var status = 0;
    var indx = 0;
    var strOpendc = "";
    var tmpStr = "";
    var tmpStr1 = "";
    strOpendc = GetVisibleDCs();

    for (i = 0; i < TabDCs.length; i++) {

        if (TabDCStatus[i] == "0") {

            tmpStr = "dc" + TabDCs[i].toString() + ",";
            tmpStr1 = "dc" + TabDCs[i].toString();
            if (strOpendc.indexOf(tmpStr) != -1)
                strOpendc.replace(tmpStr, "");
            else if (strOpendc.indexOf(tmpStr1) != -1)
                strOpendc.replace(tmpStr1, "");
        } else {
            if (strOpendc.indexOf("dc" + TabDCs[i].toString()) == -1)
                strOpendc += "," + "dc" + TabDCs[i].toString();
        }
    }

    return strOpendc;
}

//Function which returns the field caption from FCaption array.
function GetFieldCaption(fldName, fldIndex) {
    if (fldIndex == undefined) {
        var fName = GetFieldsName(fldName);
        fldIndex = $j.inArray(fName, FNames);
    } else if (fldIndex == -1)
        return "";

    return FCaption[fldIndex];
}

//Function to check for AlphaNumeric
function CheckAlphaNumeric(str) {
    //var regex = /^[A-Za-z0-9]+$/;
    var regex = new RegExp("^[a-zA-Z0-9]()*.+={};\&^%$#@!~\':></?-_/,|");
    return regex.test(str);
}

//Function to check for Alphabets.
function CheckAlpha(str) {

    var regex = new RegExp("^[a-zA-Z ]+$");
    return regex.test(str);
}

//Function to check for Numeric .
function CheckIsNumeric(str) {

    var regex = new RegExp("^[0-9]+$");
    return regex.test(str);
}

//Function to check for Email.
function CheckAxpEmail(email) {

    var regex = new RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+.[a-zA-Z]{2,4}$");
    return regex.test(email);
}

function UpdateChangedRows(fldName, dbRowNo) {
    var dcNo = GetFieldsDcNo(fldName);
    var rowNo = GetFieldsRowNo(fldName);
    var chdRowStr = "dc" + dcNo;
    var recIdx = -1;
    var rowExits = false;
    if (IsDcGrid(dcNo)) {

        recIdx = $j.inArray(chdRowStr, ChangedDcs);
        if (recIdx != -1) {
            var strRows = ChangedDcRows[recIdx].toString().split(",");
            for (var i = 0; i < strRows.length; i++) {
                if (strRows[i] == dbRowNo) {
                    rowExits = true;
                    break;
                }
            }
            if (!rowExits)
                ChangedDcRows[recIdx] = ChangedDcRows[recIdx] + "," + dbRowNo;
        } else {
            ChangedDcs.push(chdRowStr);
            ChangedDcRows.push(dbRowNo);
        }
    }
}

//Function to update the field arrays on change of any field.
function UpdateFieldArray(fieldName, fieldDbRowNo, fieldValue, sourcewin, calledFrom) {
    if (typeof fieldValue != "string") fieldValue = fieldValue.toString();
    if (fieldValue.indexOf("♦") < 0 && fieldName.indexOf("axp__isGrdVld") < 0 && sourcewin != "popup") {
        navValidator = false;
        if (GetGridFields(GetFieldsDcNo(fieldName)).indexOf(GetFieldsName(fieldName)) > -1 && IsGridField(GetFieldsName(fieldName))) {
            gridEditValidator = false;
        }
    }
    if (GetFieldsName(fieldName).toLowerCase() == "axpcurrencydec")
        UpdateAxpCurrDec(fieldValue, calledFrom);

    if (!IsFormDirty && calledFrom == undefined)
        SetFormDirty(true);

    if (sourcewin != "popup")
        UpdateChangedRows(fieldName, fieldDbRowNo);

    var id = "";
    if ($j("#" + fieldName).prop("type") == "select-one") {
        if ($j("#" + fieldName).hasClass("fldFromSelect")) {
            id = $j("#" + fieldName).find("option:selected").val();
            if (id != undefined && id != "")
                fieldValue = id;
        } else {
            id = $j("#" + fieldName).find("option:selected").val();
            if (id != undefined && id != "")
                fieldValue = id + "¿" + fieldValue;
        }
    } else if ($j("#" + fieldName).prop("type") == "textarea") {
        var newValue = fieldValue.replace(new RegExp("<br>", "g"), "¿");
        newValue = newValue.replace(new RegExp("¿", "g"), "\n");
        fieldValue = newValue;
    }

    if (sourcewin != "popup") {
        var dcNo = GetFieldsDcNo(fieldName);
        var dcIdx = $j.inArray(dcNo, DCFrameNo);
        if (dcIdx != -1 && DCIsGrid[dcIdx].toString() == "True") {
            DCHasDataRows[dcIdx] = "True";
        }
    }

    var oldValue = GetFieldValue(fieldName);
    var IsDcField = false;
    var GrdNo = "-1";
    var grdFldRowNo = "0";
    //(!fieldname.startsWith(axpIsRowValid) && calledFrom != "AddRow")
    //if ((fieldName.startsWith == "dc" && IsDcGrid(GrdNo)) || ($("#sp" + dcNo + "R" + GetFieldsRowNo(fieldName) + "F" + dcNo).hasClass("editWrapTr")) && calledFrom != "CustomAdd") {
    //&& (!fieldName.startsWith(axpIsRowValid) && calledFrom != "AddRow")
    if ((fieldName.indexOf("dc", 0) === 0 && IsDcGrid(fieldName.substring(2))) || (($("#sp" + dcNo + "R" + GetFieldsRowNo(fieldName) + "F" + dcNo).hasClass("editWrapTr")) && calledFrom != "CustomAdd" && !fieldName.indexOf(axpIsRowValid, 0) === 0)) {
        IsDcField = true;
        //GrdNo = fieldName.substring(2);
        var GrdRowNo = "0";
        //GrdRowNo = fieldValue.substring(fieldValue.indexOf("~") + 1, fieldValue.length - 1);


        if (fieldName.indexOf("dc", 0) === 0 && fieldDbRowNo == -1) {
            GrdNo = fieldName.substring(2);
            GrdRowNo = fieldValue.substring(fieldValue.indexOf("~") + 1, fieldValue.length - 1);
            grdFldRowNo = GetRowNoHelper(GrdRowNo);
        } else {
            GrdNo = dcNo;
            GrdRowNo = fieldDbRowNo;
            grdFldRowNo = GetFieldsRowNo(fieldName);
        }

    }


    if (fieldValue == undefined) fieldValue = "";
    var isAlreadyFound = false;
    if (sourcewin == "popup") {

        if (fldNewNameArr.length > 0) {

            for (var x = 0; x < fldNewNameArr.length; x++) {
                if (fldNewNameArr[x] == fieldName) {
                    fldNewValueArr[x] = fieldValue;
                    isAlreadyFound = true; // the field name is already found and updated.
                    break;
                }
            }
            if (!isAlreadyFound) {
                fldNewNameArr.push(fieldName);
                fldNewDbRowNo.push(fieldDbRowNo);
                fldNewValueArr.push(fieldValue);
            }
        } else { // first time
            fldNewNameArr.push(fieldName);
            fldNewDbRowNo.push(fieldDbRowNo);
            fldNewValueArr.push(fieldValue);
        }
    } else {
        if (ChangedFields.length > 0) {

            var idx = $j.inArray(fieldName, ChangedFields);
            if (idx != -1) {
                ChangedFieldValues[idx] = fieldValue;
                ChangedFieldOldValues[idx] = oldValue;
                isAlreadyFound = true; // the field name is already found and updated.
            }
            //for (var x = 0; x < ChangedFields.length; x++) {

            //    if (ChangedFields[x] == fieldName) {
            //        ChangedFieldValues[x] = fieldValue;
            //        ChangedFieldOldValues[x] = oldValue;
            //        isAlreadyFound = true; // the field name is already found and updated.
            //        break;
            //    }
            //}
            if ((!isAlreadyFound)) {
                ChangedFields.push(fieldName);
                ChangedFieldDbRowNo.push(fieldDbRowNo);
                ChangedFieldValues.push(fieldValue);
                ChangedFieldOldValues.push(oldValue);
                //Refer bug id -AGI003509 for fillgrid condition
                if (IsDcField && (calledFrom != "LoadData" && calledFrom != "GetDep" && calledFrom != "FillGrid" && calledFrom != "Action"))
                    UpdateAxpRowVldInArray(GrdNo, grdFldRowNo, GetDbRowNo(grdFldRowNo, GrdNo));
            }
        } else { // first time
            ChangedFields.push(fieldName);
            ChangedFieldDbRowNo.push(fieldDbRowNo);
            ChangedFieldValues.push(fieldValue);
            ChangedFieldOldValues.push(oldValue);
            //Refer bug id -AGI003509 for fillgrid condition
            if (IsDcField && (calledFrom != "LoadData" && calledFrom != "GetDep" && calledFrom != "FillGrid" && calledFrom != "Action"))
                UpdateAxpRowVldInArray(GrdNo, grdFldRowNo, GetDbRowNo(grdFldRowNo, GrdNo));
        }
    }
}

function UpdateAxpRowVldInArray(dcNo, crowNo, dbRowNo) {
    var fldId = axpIsRowValid + dcNo + crowNo + "F" + dcNo;
    //var fld = $j("#"+ fldId);
    //if (fld.length > 0)
    //{
    UpdateFieldArray(fldId, dbRowNo, "false", "parent", "CustomAdd");
    //}
}


//Function to display the success message or error message in a tstruct on save.
function ShowDialog(title, message, messageType, messageVars, functionality, hold, isLandingPageSuccess) {
    var alertsTimeout = parseInt(callParentNew("alertsTimeout"), 10) || 3000;
    var errorEnable = JSON.parse(callParentNew("errorEnable") || false);
    var errorTimeout = parseInt(callParentNew("errorTimeout"), 10) || 0;
    AxWaitCursor(false);
    try {
        if (messageType == "client") {
            if (typeof LoadglLangauge === "undefined")
                message = eval(callParent("LoadglLangauge(" + message + ")", "function"));
            else
                message = LoadglLangauge(message);
        }
        if (messageVars != undefined && messageVars != "") {
            var messageVarArray = messageVars.split("^♠^");
            for (var i = 0; i < messageVarArray.length; i++) {
                message = message.replace("{" + i + "}", messageVarArray[i]);
            }
        }
    } catch (ex) { }

    functionality == undefined ? functionality = "" : "";

    var index = message.indexOf("^^dq");
    while (index != -1) {
        message = message.replace("^^dq", '"');
        index = message.indexOf("^^dq");
    }
    msgType = title;
    if (title == "success" && axCustomTstAction.toLowerCase() == "reloadaftersave") {
        disableBtnBeforeReload();
    }
    // clearThePreviousAlert();
    var shMessage = "";
    //if (gl_language == "ARABIC") {
    //    if (title == "success")
    //        shMessage = "<div class='"+title+" arabicsucc shortMessageWrapper animated pulse'>";
    //    else
    //        shMessage = "<div class='" + title + " arabicerror shortMessageWrapper animated pulse'>";
    //}
    //else {
    //    shMessage = "<div class='AX" + title + " shortMessageWrapper animated pulse'>";
    //}
    var wrapperClassForApp = "";
    if (parent.document.location.href.indexOf("mainnew.aspx") != -1 || parent.document.location.href.indexOf("axmain.aspx") != -1) {
        wrapperClassForApp = "shortMessageWrapperInApp";
    }
    shMessage = "<div class='shortMessageWrapper " + wrapperClassForApp + " animated pulse'>";
    switch (title) {
        case "success":
            shMessage += '<div class="alert agc-alert-wrapper alert-success agc-alert-success">';
            if (hold == true || hold == "True")
                shMessage += '<a href="javascript:void(0)" id="btnMsgClose" class="close agc-close-btn" data-dismiss="alert" aria-label="close"  onclick="HideDialog();">&times;</a>';
            shMessage += '<span class="fa fa-check agc-alert-icon-wrapper"></span>';
            break;
        case "warning":
            if (typeof actionCallbackFlag != "undefined") {
                actionCallbackFlag = actionCallFlag;
                $("#icons,#btnSaveTst,.BottomToolbarBar a,.wizardNextPrevWrapper").css({
                    "pointer-events": "auto"
                });
            }
            shMessage += '<div class="alert agc-alert-wrapper alert-warning agc-alert-warning">';
            if (hold == true || hold == "True")
                shMessage += '<a href="javascript:void(0)" id="btnMsgClose" class="close agc-close-btn" data-dismiss="alert" aria-label="close"  onclick="HideDialog();">&times;</a>';
            shMessage += '<span class="fa fa-exclamation-triangle agc-alert-icon-wrapper"></span>';
            break;
        default:
        case "error":
        case "failure":
            if (typeof actionCallbackFlag != "undefined") {
                actionCallbackFlag = actionCallFlag;
                $("#icons,#btnSaveTst,.BottomToolbarBar a,.wizardNextPrevWrapper").css({
                    "pointer-events": "auto"
                });
            }
            shMessage += '<div class="alert agc-alert-wrapper alert-danger agc-alert-error">';
            shMessage += '<a href="javascript:void(0)" id="btnMsgClose" class="close agc-close-btn" data-dismiss="alert" aria-label="close"  onclick="HideDialog();">&times;</a>';
            shMessage += '<span class="fa fa-remove agc-alert-icon-wrapper"></span>';
            if (hold == undefined) {
                hold = true;
            }
            break;
        case "info":
            shMessage += '<div class="alert agc-alert-wrapper alert-info agc-alert-info">';
            shMessage += '<a href="javascript:void(0)" id="btnMsgClose" class="close agc-close-btn" data-dismiss="alert" aria-label="close"  onclick="HideDialog();">&times;</a>';
            shMessage += '<span class="fa fa-info agc-alert-icon-wrapper"></span>';
            break;
    }

    shMessage += message;
    shMessage += "</div>";
    shMessage += "</div>";

    try {
        try {
            if((appGlobalVarsObject?._CONSTANTS?.window || window).$("#toast-container .toast:last").is(".toast-error")) {
                (appGlobalVarsObject?._CONSTANTS?.window || window).toastr.clear((appGlobalVarsObject?._CONSTANTS?.window || window).$("#toast-container .toast:last"))
           }
        } catch (error) {
            
        }
        (appGlobalVarsObject?._CONSTANTS?.window || window).toastr[["success", "warning", "info"].indexOf(title) > -1 ? title : "error"](
            message,
            '', {
            tapToDismiss: false,
            newestOnTop: false,
            preventDuplicates: true,
            positionClass: "toast-top-center",
            get timeOut() {
                if (title == "failure" || title == "error") {
                    if (errorEnable == true && errorTimeout > 0) {
                        return errorTimeout;
                    }
                } else if (hold == false || hold == 'False' || hold == undefined) {
                    return alertsTimeout;
                }
                return 0;
            },
            get extendedTimeOut() {
                return this.timeOut;
            },
            get closeButton() {
                if (["success", "warning"].indexOf(title) > -1) {
                    if (hold == true || hold == "True") {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            },
            onHidden() {
                if (!((title == "failure" || title == "error") && (errorEnable != true || !(errorTimeout > 0)))) {
                    if (functionality != "") {
                        var functionalityCategory = functionality.split("~");
                        if (functionalityCategory[0] == "load") {
                            window.location.href = functionalityCategory[1];
                        } else if (functionalityCategory[0] == "reload") {
                            window.location.href = window.location.href;
                        } else if (functionalityCategory[0] == "function") {
                            window.eval(functionalityCategory[1]);
                        }
                    }
                    HideDialog();
                }
            }
        }
        );
        return;
    } catch (ex) { }

    $j("body").append(shMessage);
    if (hold == false || hold == 'False' || hold == undefined) {
        setTimeout(function () {
            $j(".shortMessageWrapper").removeClass('animated pulse').addClass('animated fadeOut');
            HideDialog();
        }, alertsTimeout);
    }
}

function ShowInfoDialog(message) {
    AxWaitCursor(false);
    var dvObj = $j("#dvMessage");
    dvObj.show();
    var innerhtm;
    if (gl_language == "ARABIC")
        innerhtm = "&nbsp;&nbsp;" + message + "&nbsp;&nbsp;";
    else
        innerhtm = "<table><tr><td>" + message + "</td></tr></table>";
    dvObj.html(innerhtm);
    if (gl_language == "ARABIC")
        dvObj.removeClass().addClass("AXinfo arabicinfo");
    else
        dvObj.removeClass().addClass("AXinfo");
    //   adjustwin("100", window);
}

//Function to hide the success message or error message in a tstruct on save.
function HideDialog() {
    var alertsTimeout = parseInt(callParentNew("alertsTimeout"), 10) || 3000;
    var listViewNavigating = false;
    var presentFrameObj = $(window.frameElement);
    $j(".shortMessageWrapper").removeClass('animated pulse').addClass('animated fadeOut');
    setTimeout(function () {
        $j(".shortMessageWrapper").remove();
    }, alertsTimeout);
    window.status = "";
    var url = "";
    var recPos = findGetParameter("recPos");
    var Isaxpiframe = callParentNew("axpiframe", "id").src;
    //msgType.toString().toLowerCase() == "error" ? actionCallbackFlag = actionCallFlag : "";
    if (msgType.toString().toLowerCase() == "success") {
        var lastIndexOfAxPop = document.URL.lastIndexOf('AxPop');
        if (axpRefSelect == "true" && axpRefSelectID != "" && axpSrcSelectID != "" && axRefreshSelectType != "") {
            eval(callParent('isSuccessAlertInPopUp') + "= false");
            tsddlRefreshSelect();
            return;
        } else if (lastIndexOfAxPop != -1 && document.URL.substr(lastIndexOfAxPop + 6, 1).toLowerCase() == 't' && lvNavDetails == "") {
            eval(callParent('isSuccessAlertInPopUp') + "= true");
            if (transid == "axcal") {
                callParentNew("closeModalDialog()", "function");
            } else {
                $j("#axpertPopupWrapper .remodal-close", window.parent.document).click();
                try {
                    callParentNew("loadPopUpPage", "id").dispatchEvent(new CustomEvent("close"));
                } catch (ex) {}
            }
            eval(callParent("closeFrame()", "function"));
        }

        if (document.title == "Tstruct") {
            //axp_savedirective
            url = ApplySaveDirective(axCustomTstAction);
            if (url == "") {
                if (lvNavDetails == "") {
                    url = "tstruct.aspx?transid=" + tst + `&openerIV=${typeof isListView != "undefined" ? iName : tst}&isIV=${typeof isListView != "undefined" ? !isListView : "false"}`;
                } else {
                    navValidator = true;
                    listViewNavigating = true;
                    if (lvNavDetails == "prev") {
                        $("#lnkPrev").removeClass("disabled").prop("disabled", false);
                        $("#lnkNext").removeClass("disabled").prop("disabled", false);
                        lnkPrevClick();
                    } else if (lvNavDetails == "next") {
                        $("#lnkPrev").removeClass("disabled").prop("disabled", false);
                        $("#lnkNext").removeClass("disabled").prop("disabled", false);
                        lnkNextClick();
                    }
                }
            }
            if ((btnSaveContVal != "") && (axFooAction == "ax_savecontinue")) {
                if (btnSaveContVal.substring(0, 1) == "i")
                    url = "iview.aspx?ivname=" + btnSaveContVal.substring(1);
                else
                    url = "tstruct.aspx?transid=" + btnSaveContVal.substring(1) + `&openerIV=${typeof isListView != "undefined" ? iName : btnSaveContVal.substring(1)}&isIV=${typeof isListView != "undefined" ? !isListView : "false"}`;
            } else if ((axFooAction == "ax_savenew") || (axFooAction == "ax_savesend")) {
                url = "tstruct.aspx?transid=" + tst + "&recordid=" + axSaveRecId + `&openerIV=${typeof isListView != "undefined" ? iName : tst}&isIV=${typeof isListView != "undefined" ? !isListView : "false"}`;
            }

            var customUrl = url;
            try {
                customUrl = AxCustomRedirect(url);
            } catch (ex) { }

            if (customUrl == undefined)
                customUrl = url;

            if (fromHyperLink.toString().toLowerCase() == "true")
                // window.document.location.href = customUrl + "&AxHypTstRefresh=" + fromHyperLink;
                customUrl = customUrl + "&AxHypTstRefresh=" + fromHyperLink;
            //axp_savedirective- As a popUp
            if (AxPopup.toLowerCase().indexOf("true") > -1) {

                var left = (screen.width / 2) - 200;
                var top = (screen.height / 2) - 100;
                var windobj;
                try {
                    windobj = window.open(customUrl, "PopUp", "width=550,height=300,scrollbars=yes,resizable=yes,top=" + top + ",left=" + left + "");
                } catch (ex) {
                    showAlertDialog("warning", eval(callParent('lcm[356]')));
                }
            } else {
                if (!listViewNavigating) {
                    if (iframeindex != -1) {
                        if (customUrl.toLowerCase().indexOf("tstruct.aspx?") > -1) {
                            if (presentFrameObj.attr("id") !== "axpiframe") {
                                AvoidPostBackAfterSave(customUrl);
                            }
                        } else
                            parent.currAxpFrmUrl = customUrl;
                    } else {
                        if (customUrl.toLowerCase().indexOf("tstruct.aspx?") > -1) {
                            if (presentFrameObj.attr("id") !== "axpiframe") {
                                AvoidPostBackAfterSave(customUrl);
                            }
                        } else
                            window.document.location.href = customUrl;
                    }
                }
            }
        } else if (document.title == "Load Tstruct") {
            if (recordid != 0) {
                //axp_savedirective
                url = ApplySaveDirective(axCustomTstAction);
                if (url == "") {
                    if (lvNavDetails == "") {
                        navValidator = true;
                        var url = "tstruct.aspx?transid=" + tst + "&recordid=" + recordid + "&recPos=" + recPos + `&openerIV=${typeof isListView != "undefined" ? iName : tst}&isIV=${typeof isListView != "undefined" ? !isListView : "false"}`;
                    } else {
                        navValidator = true;
                        listViewNavigating = true;
                        if (lvNavDetails == "prev") {
                            $("#lnkPrev").removeClass("disabled").prop("disabled", false);
                            $("#lnkNext").removeClass("disabled").prop("disabled", false);
                            lnkPrevClick();
                        } else if (lvNavDetails == "next") {
                            $("#lnkPrev").removeClass("disabled").prop("disabled", false);
                            $("#lnkNext").removeClass("disabled").prop("disabled", false);
                            lnkNextClick();
                        }
                    }
                }
                if ((btnSaveContVal != "") && (axFooAction == "ax_savecontinue")) {
                    if (btnSaveContVal.substring(0, 1) == "i")
                        url = "iview.aspx?ivname=" + btnSaveContVal.substring(1);
                    else
                        url = "tstruct.aspx?transid=" + btnSaveContVal.substring(1) + `&openerIV=${typeof isListView != "undefined" ? iName : btnSaveContVal.substring(1)}&isIV=${typeof isListView != "undefined" ? !isListView : "false"}`;
                } else if (axFooAction == "ax_savereset") {
                    url = "tstruct.aspx?transid=" + tst + `&openerIV=${typeof isListView != "undefined" ? iName : tst}&isIV=${typeof isListView != "undefined" ? !isListView : "false"}`;
                }

                var customUrl = url;
                try {
                    customUrl = AxCustomRedirect(url);
                } catch (ex) { }

                if (customUrl == undefined)
                    customUrl = url;

                if (fromHyperLink.toString().toLowerCase() == "true")
                    customUrl = customUrl + "&AxHypTstRefresh=" + fromHyperLink;
                //  window.document.location.href = customUrl + "&AxHypTstRefresh=" + fromHyperLink;

                if (AxPopup.toLowerCase().indexOf("true") > -1) {

                    var left = (screen.width / 2) - 200;
                    var top = (screen.height / 2) - 100;
                    var windobj;
                    try {
                        windobj = (window.open(customUrl, "PopUp", "width=550,height=300,scrollbars=yes,resizable=yes,top=" + top + ",left=" + left + ""));
                    } catch (ex) {
                        showAlertDialog("warning", eval(callParent('lcm[356]')));
                    }
                    if (!listViewNavigating) {
                        if (iframeindex != -1)
                            if (customUrl.toLowerCase().indexOf("tstruct.aspx?") > -1) {
                                if (presentFrameObj.attr("id") !== "axpiframe") {
                                    AvoidPostBackAfterSave(customUrl);
                                }
                            }
                            else
                                parent.currAxpFrmUrl = customUrl;
                        else
                            if (customUrl.toLowerCase().indexOf("tstruct.aspx?") > -1) {
                                if (presentFrameObj.attr("id") !== "axpiframe") {
                                    AvoidPostBackAfterSave(customUrl);
                                }
                            } else
                                window.document.location.href = customUrl;
                    }

                } else {
                    if (!listViewNavigating) {
                        if (iframeindex != -1)
                            if (customUrl.toLowerCase().indexOf("tstruct.aspx?") > -1) {
                                if (presentFrameObj.attr("id") !== "axpiframe") {
                                    AvoidPostBackAfterSave(customUrl);
                                }
                            }
                            else
                                parent.currAxpFrmUrl = customUrl;
                        else
                            if (customUrl.toLowerCase().indexOf("tstruct.aspx?") > -1) {
                                if (presentFrameObj.attr("id") !== "axpiframe") {
                                    AvoidPostBackAfterSave(customUrl);
                                }
                            } else
                                window.document.location.href = customUrl;
                    }
                }
            } else {
                $("#icons,#btnSaveTst,.BottomToolbarBar a,.wizardNextPrevWrapper").css({
                    "pointer-events": "auto"
                });
            }

        } else if (document.title == "User Access" || document.title == "User Access Iview") {
            window.close();
        }
        //close the popup and referesh the Parent window    
        //check if title of the parent is Iview
        else if (document.title == "Load TStruct with QS" || document.title == "Load Tstruct") {
            var saveDirUrl;
            if ((btnSaveContVal != "") && (axFooAction == "ax_savecontinue") && !listViewNavigating) {
                if (btnSaveContVal.substring(0, 1) == "i")
                    url = "iview.aspx?ivname=" + btnSaveContVal.substring(1);
                else
                    url = "tstruct.aspx?transid=" + btnSaveContVal.substring(1) + `&openerIV=${typeof isListView != "undefined" ? iName : btnSaveContVal.substring(1)}&isIV=${typeof isListView != "undefined" ? !isListView : "false"}`;
                if (fromHyperLink.toString().toLowerCase() == "true")
                    window.document.location.href = url + "&AxHypTstRefresh=" + fromHyperLink;
                else {
                    if (url.toLowerCase().indexOf("tstruct.aspx?") > -1) {
                        if (presentFrameObj.attr("id") !== "axpiframe") {
                            AvoidPostBackAfterSave(url);
                        }
                    } else
                        window.document.location.href = url;
                }
            } else if (((axFooAction == "ax_savenew") || (axFooAction == "ax_savesend")) && !listViewNavigating) {
                url = "tstruct.aspx?transid=" + tst + "&recordid=" + axSaveRecId + `&openerIV=${typeof isListView != "undefined" ? iName : tst}&isIV=${typeof isListView != "undefined" ? !isListView : "false"}`;
                if (fromHyperLink.toString().toLowerCase() == "true")
                    window.document.location.href = url + "&AxHypTstRefresh=" + fromHyperLink;
                else {
                    if (presentFrameObj.attr("id") !== "axpiframe") {
                        AvoidPostBackAfterSave(url);
                    }
                    //window.document.location.href = url;
                }
            } else if (window.opener && (window.opener.document.title = "Iview")) {
                // to make sure that its a popup         
                var popupName = window.name;
                if (popupName != null && popupName != undefined) {

                    if (popupName.indexOf("Pop") != -1) {
                        window.close();
                        if (window.opener && !window.opener.closed && window.opener.document.getElementById("button1")) {
                            // on unload deletes all existing cached iview files.
                            window.opener.document.getElementById("hdnIvRefresh").value = "true"; //This will set whether to fetch data from cache or DB
                            window.opener.document.getElementById("button1").click();
                        }
                    }
                }
            } else {
                //axp_savedirective
                let url = "";
                saveDirUrl = ApplySaveDirective(axCustomTstAction);
                if (saveDirUrl != "") {
                    url = saveDirUrl;
                    if (presentFrameObj.attr("id") !== "axpiframe") {
                        AvoidPostBackAfterSave(url);
                    }
                } else {
                    url = "../aspx/tstruct.aspx?transid=" + tst + `&openerIV=${typeof isListView != "undefined" ? iName : tst}&isIV=${typeof isListView != "undefined" ? !isListView : "false"}`;
                    if (!listViewNavigating) {
                        if (recordid != 0)
                            url += "&recordid=" + axSaveRecId;
                        if (Isaxpiframe.indexOf("axpfrm") != -1)
                            url += "&axpfrm=t"

                        if (presentFrameObj.attr("id") !== "axpiframe") {
                            AvoidPostBackAfterSave(url);
                        }
                        //window.document.location.href = url;                   
                    }
                }
            }

            if (AxPopup.toLowerCase().indexOf("true") > -1) {
                var left = (screen.width / 2) - 200;
                var top = (screen.height / 2) - 100;
                var windobj;
                try {
                    windobj = (window.open(url, "PopUp", "width=550,height=300,scrollbars=yes,resizable=yes,top=" + top + ",left=" + left + ""));
                } catch (ex) {
                    showAlertDialog("warning", eval(callParent('lcm[356]')));
                }

            } else {
                if (url != "" && !listViewNavigating) {
                    if (presentFrameObj.attr("id") !== "axpiframe") {
                        AvoidPostBackAfterSave(url);
                    }
                }
                //window.document.location.href = url;
            }

        }
        //On save navigation buttons should be desabled
        if (!window.opener)
            window.parent.disableNavigation = true;
        else
            window.opener.parent.disableNavigation = true;
    }
    //else {
    //    actionCallbackFlag = actionCallFlag;
    //}
    //adjustwin("100", window);
}

//Applying savedirective- actions
function ApplySaveDirective(axCustomTstAction) {

    var url = "";
    if (axCustomTstAction != undefined && axCustomTstAction != "") {
        if (axCustomTstAction.toLowerCase() == "reloadaftersave") {
            url = "tstruct.aspx?transid=" + tst + "&recordid=" + axSaveRecId + "&axp_IsSaveUrl=true" + `&openerIV=${typeof isListView != "undefined" ? iName : tst}&isIV=${typeof isListView != "undefined" ? !isListView : "false"}`;
        } else {
            if (axCustomTstAction.toLowerCase().indexOf("transid") > -1 || axCustomTstAction.toLowerCase().indexOf("ivname") > -1) {
                url = axCustomTstAction;
                url = GetUrlParams(url);
            }
        }
    }
    return url;
}

//To avoid tstruct page load after save the transaction
function AvoidPostBackAfterSave(page) {
    AxWaitCursor(true);
    ShowDimmer(true);
    var tstRecId = "",
        tstQureystr = "";
    if (page != "") {
        page.split('&').forEach(function (paramType) {
            if (paramType.indexOf("recordid=") > -1)
                tstRecId = paramType.split("=")[1];
            else
                tstQureystr += paramType + "♠";
        });
    }
    if (tstRecId != "" && tstRecId != "0") {
        GetLoadData(tstRecId, tstQureystr)
    } else {
        GetFormLoadData(tstQureystr);
    }
}

//Function for getting the field values from the axp_savedirective field 
function GetUrlParams(url) {

    var strParams = url.split("&");
    var fldName, fld, fldVal;
    var paramVal;
    //var isFirstTime = true;
    var pName = "";
    var colnIndx;
    //tstruct~transid&paramname1=value1^paramname2=value2
    //If value1 is  :fieldName get the value of field
    url = strParams[0];
    if (strParams.length > 1) { //If url has params
        $j.each(strParams, function (i, val) {
            paramVal = strParams[i];
            colnIndx = paramVal.indexOf(":");
            if (colnIndx > -1) {
                fldName = paramVal.substring(colnIndx + 1);
                pName = paramVal.substring(0, colnIndx);
                fld = GetActualFieldName(fldName);
                fldVal = GetFieldValue(fld);
                url = url + "&" + pName + fldVal;
            }

        });
    }
    return url;
}
//Function to apply the mouseHover style for hyperlink and checkbox in a tstruct.
//function Mouseoverstyle(obj) {

//    obj.className = "onmouseover";
//}

//Function to apply mouse out the style for hyperlink and checkbox in a tstruct.
function Mouseoutstyle(obj) {

    obj.className = "onmouseout";
}

//Function to change the theme of the page. 
//function ChangeTheme(iframewindow) {

//    var framename = iframewindow.name;
//    framename = framename.toLowerCase();

//    if ((framename.substring(0, 7) == "openpop") || (framename.substring(0, 7) == "loadpop") || (framename.substring(0, 7) == "ivewpop") || (framename == "savewindow") || (framename.substring(0, 7) == "mypopup") || (framename.toString() == "")) {
//        framename = "MyPopUp";
//    }
//    if ((iframewindow.name != "MyPopUp") && (framename != "MyPopUp")) {
//        var theme = $j("#DropDownList1 option:selected", window.parent.document).text();
//        $j("#themecss").attr('href', "../App_Themes/" + theme + "/Stylesheet.min.css?v=23");
//    }
//    else {
//        var themeref = "";
//        themeref = $j("#themecss", window.opener.document).attr("href");
//        if (themeref != "") {
//            $j("#themecss").attr("href", themeref);
//        }
//    }
//}

//Function to get the number of rows in a particular dc. 
function GetDcRowCount(DcNo) {

    var rcount = 0;
    var deldetails = "";
    if ($j("#hdnRCntDc" + DcNo).length > 0) {
        rcount = $j("#hdnRCntDc" + DcNo).val();
    }
    if (rcount != "") rcount = parseInt(rcount, 10);
    return rcount;
}

//Function sets the rowcount for the given dc.
function SetRowCount(dcNo, rowCnt, cr, calledFrom) {
    if ($j("#hdnRCntDc" + dcNo).length > 0) {
        var rc = $("#gridHd" + dcNo + " tbody tr").length
        if (cr == "d" && rc > 0)
            $j("#hdnRCntDc" + dcNo).val(rc);
        else
            $j("#hdnRCntDc" + dcNo).val(rc + 1);
    }

    ////TODO: add this condition as a else if condition.
    if (cr == "d")
        return;

    if (cr != undefined)
        UpdateFieldArray("dc" + dcNo, "-1", "dc" + dcNo + "~" + rowCnt + "♦" + cr, "parent", calledFrom);
    else
        UpdateFieldArray("dc" + dcNo, "-1", "dc" + dcNo + "~" + rowCnt + "♦", "parent", calledFrom);
}

//Function which retuns the serial number count for the given dc.
function GetSerialNoCnt(dcNo) {

    var fldID = "#hdnSlNoCnt" + dcNo;
    var fld = $j(fldID);
    var serialNo = "1";
    if (fld.length > 0) {
        serialNo = fld.val();
    }
    return serialNo;
}

//Function which sets the serial number count for the given dc.
function SetSerialNoCnt(dcNo, count) {

    var fldID = "#hdnSlNoCnt" + dcNo;
    var fld = $j(fldID);
    if (fld.length > 0) {
        fld.val(count);
    }
}


//Function which takes the fieldname (without row no and frame no) as parameter, Get its frame no.
//If the field is a grid field and row count is greater than zero, return comma seperated actual(Component) fieldnames in all rows
//Else if the field is non -grid field, return its actual(Component) fieldname 
function GetActualFieldName(fieldName) {

    var actFldName = "";
    for (var i = 0; i < FNames.length; i++) {
        if (FNames[i] == fieldName)
            break;
    }

    var frameNo = parseInt(FldFrameNo[i], 10);
    var indx = 0;
    for (indx = 0; indx < DCFrameNo.length; indx++) {
        if (DCFrameNo[indx] == frameNo)
            break;
    }

    if (DCIsGrid[indx] == "True") {

        var rowTem = "row" + frameNo + "temF0";
        var rCount = 0;
        rCount = GetDcRowCount(frameNo);
        rCount = parseInt(rCount, 10);

        if (rCount > 0) {

            for (var j = 1; j < rCount; j++) {

                var rowNo = GetRowNoHelper(j);
                var tmpFldName = fieldName + rowNo + "F" + frameNo;
                if (actFldName == "")
                    actFldName = tmpFldName;
                else
                    actFldName += "," + tmpFldName;
            }
        }
    } else {
        actFldName = fieldName + "000F" + frameNo;
    }
    return actFldName;
}


//Function to disable or enable workflow buttons.
function ReadonlyWfButtons() {
    $j("#btntabapprove").prop('disabled', 'disabled');
    $j("#btntabapprove").removeClass("enablewfbuttons").addClass("disablewfbuttons");
    $j("#btntabreject").prop('disabled', 'disabled');
    $j("#btntabreject").removeClass("enablewfbuttons").addClass("disablewfbuttons");
    $j("#btntabreturn").prop('disabled', 'disabled');
    $j("#btntabreturn").removeClass("enablewfbuttons").addClass("disablewfbuttons");
    $j("#btntabreview").prop('disabled', 'disabled');
    $j("#btntabreview").removeClass("enablewfbuttons").addClass("disablewfbuttons");
    if ($j("#txtCommentWF").length > 0) {
        $j("#txtCommentWF").prop('disabled', 'disabled');
        $j("#txtCommentWF").css('cursor', 'default');
    }
}

//Function to make the whole tstrut readonly.
function Readonlyform() {

    if (parseInt(TotalDCs, 10) > 0) {
        for (var i = 1; i <= parseInt(TotalDCs, 10); i++) {
            ShowingDc(i, "Disable");
        }
    }
}

//Function to apply fade effect for the disabled buttons.
function FadeImage(objId, opacity) {

    if (document.getElementById) {

        obj = $j("#" + objId);
        if (opacity <= 100) {
            opacity = 30;
            SetOpacity(obj, opacity);
        }
    }
}

//Function to set the opacity for the faded image.
function SetOpacity(obj, opacity) {

    opacity = (opacity == 100) ? 99.999 : opacity;

    obj.css("opacity", opacity);
}

//Function returns the fieldname from the array for expressions and formcontrol
function GetExactFieldName(currFldName) {

    var i = 0;
    var indx = -1;
    var newFldName = "";
    try {
        if (FLowerNames) {
            for (i = 0; i < FLowerNames.length; i++) {
                if (FLowerNames[i] == currFldName.toLowerCase()) {
                    indx = i;
                    break;
                }
            }
        }
    } catch (ex) { }
    if (indx == -1) {
        return currFldName
    } else {
        newFldName = FNames[indx].toString();
        return newFldName;
    }
}

//Function whcih returns the fields in the given grid.
function GetGridFields(dcNo) {

    var range;
    var fields = new Array();
    for (var i = 0; i < FldDcRange.length; i++) {

        var dcRange = FldDcRange[i].split("~");
        if (dcRange[0] == dcNo) {
            range = dcRange[1].split(",");
            break;
        }
    }
    if (typeof range != "undefined") {
        var startIndex = parseInt(range[0].toString(), 10);
        var endIndex = parseInt(range[1].toString(), 10);

        for (var j = startIndex; j <= endIndex; j++) {
            fields.push(FNames[j]);
        }
    }
    return fields;
}

//Function for Text Area length validation.
function LimitText(limitField) {

    var fName = GetFieldsName(limitField[0].id);
    var index = $j.inArray(fName, FNames);
    if (index != -1) {
        var limitNum = parseInt(FMaxLength[index], 10);

        if ($j(limitField).val().length > limitNum) {
            $j(limitField).val(limitField.val().substring(0, limitNum));
        } else { }
    }
}

//Function to set focus go the given field.
function SetFocusOnField(tabNo, fldName) {

    var fld = $j("#" + fldName);

    try {
        if (fld.length > 0 && (fld.prop("disabled") != true)) {
            fld.focus();
        }
    } catch (exp) { }
}

//Function to call hidecalendar if TAB or ESC key pressed.
//function Calendarvalidate(evt, txtObj) {
//    if (typeof (txtObj) == "string")
//        var sLen = txtObj.length;
//    else
//        var sLen = txtObj.val().length;
//    var charCode = (evt.which) ? evt.which : event.keyCode;

//    if (((charCode == 46) || (charCode == 47)) && (sLen > 0)) {
//        charCode = 49;
//    }
//    if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;

//    return true;
//}

//Function to close the calendar control.
//function ValidateCalendar(evt, val) {

//    var charCode = (evt.which) ? evt.which : event.keyCode;
//    var sLen = val.length;

//    if (charCode == 27) {
//        return false;
//    }
//    return true;
//}

//Function to check the key pressed and hide calendar.
//function CheckKeyPressed(evt, ctrl) {

//    var ctr = document.getElementById(ctrl);
//    var TAB = 9; var ENTER = 13;
//    var keyCode;

//    if ("which" in evt) {// NN4 & FF &amp; Opera
//        keyCode = evt.which;
//    }
//    else if ("keyCode" in evt) {// Safari & IE4+
//        keyCode = evt.keyCode;
//    }
//    else if ("keyCode" in window.event) {// IE4+
//        keyCode = window.event.keyCode;
//    }
//    else if ("which" in window.event) {
//        keyCode = evt.which;
//    }
//    else { showAlertDialog("error", "the browser don't support"); }
//}

//Function to validate the date value in the given objects value.
function ValidateDate(obj) {
    if (AxDoBlur == true) {
        if (obj.val() != "  /  /") {
            if (isDate(obj.val()) == false) {
                obj.val(dateString);
                obj.focus();
                return false;
            }
        }
        if (obj.attr("title") == dateString && obj.val() == "") obj.val(dateString);
        return true;
    }
    return false;
}

//Function to get the next active row in a grid dc.
//function GetNextActiveRow(dbRowNo, dcNo) {

//    var nextRow = "";
//    for (var i = 0; i < RowDcNo.length; i++) {

//        if (RowDcNo[i] == dcNo) {
//            if (dbRowNo == DbRowNo[i])
//                nextRow = "";
//            else
//                nextRow = DbRowNo[i];
//        }
//    }
//    return nextRow;
//}


//Function to get the previous active row in a grid dc.
//function GetPreviousActiveRow(dbRowNo, dcNo) {

//    var prevRow = "";
//    for (var i = 0; i < RowDcNo.length; i++) {
//        if (RowDcNo[i] == dcNo) {
//            if (dbRowNo == DbRowNo[i])
//                prevRow == "";
//            else
//                prevRow = DbRowNo[i];
//        }
//    }
//    return prevRow;
//}

//Function which returns the field's applyComma + allowEmpty + visible + onlyPositive + tabStop property.
function GetFieldProp(index, action) {

    var fldProps = FProps[index].toString();

    if (action == "allowEmpty")
        return fldProps.substring(1, 2);
    else if (action == "applyComma")
        return fldProps.substring(0, 1);
    else if (action == "onlyPositive") {
        return fldProps.substring(3, 4);
    } else if (action == "tabStop") {
        return fldProps.substring(4, 5);
    } else return fldProps.substring(2, 3);
}

//Function which returns true if the field is a picklist field.
function IsPickListField(fieldId) {
    var isPickFld = false;
    var pickFldId = "img~" + fieldId;
    $j(".pickimg").each(function () {
        if ($j(this).attr("id") == pickFldId && !$j(this).hasClass("fastField")) {
            isPickFld = true;
            return false;
        }
    });
    if (isPickFld)
        return true;
    else
        return false;
}

//This function is used to clear all select fields which will get their items from service, for from list fields it should not clear.
function ClearComboBox(fldObj, fldName, fldValue) {
    var strOption = "";
    var lstIdx = 0;
    var tsPopupVal = fldObj.find('option:nth-child(2)').val();
    var tsPopupText = fldObj.find('option:nth-child(2)').text();
    lstIdx = $j.inArray(fldName, FNames);
    if (FldsFrmLst[lstIdx] == "True") {
        SetFieldValue(fldObj.attr("id"), fldValue);
        return;
    }


    if (fldObj.length > 0 && (fldObj.attr("type") == "select-one" || fldObj.prop("type") == "select-one"))
        strOption = "<option value=''>" + aXEmptyOption + "</option>";

    if (tsPopupVal != undefined && tsPopupText != undefined && tsPopupText.indexOf("+ Add") != -1 && tsPopupVal.indexOf("createPopup(") != -1)
        strOption += "<option value=\"" + tsPopupVal + "\">" + tsPopupText + "</option>";

    if (fldObj.length > 0 && (fldObj.attr("type") == "select-one" || fldObj.prop("type") == "select-one"))
        fldObj.html(strOption);

}

function GetFieldIndex(fldName) {
    var index = $j.inArray(fldName, FNames);

    if (index == -1)
        index = $j.inArray(fldName.toLowerCase(), FLowerNames);
    return index;
}
///Function to toggle the cursor style.
function AxWaitCursor(act) {
    if (act) {
        $j("body").css('cursor', 'wait');
        if (srchDlg)
            CloseSearchPop();
    } else {
        $j("body").css('cursor', 'arrow');
        $j("body").css('cursor', 'default');
    }
}
//Function to change the theme of the page. 
function ChangeTheme() {
    //var theme = $j("#DropDownList1 option:selected", window.parent.document).text();
    var theme = "";
    theme = eval(callParent('currentThemeColor'));
    if (theme != "") {
        $j("#themecss").attr('href', "../App_Themes/" + theme + "/Stylesheet.min.css?v=23");
    } else {
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
// // function ChangeTheme() {
// These varibles will be used to store the position of the mouse
var X = 0;
var Y = 0;

//Function to find the left position of the given obj on screen.
function FindPosX(obj) {

    var curleft = 0;

    if (obj.offsetParent) {
        while (obj.offsetParent) {
            curleft += obj.offsetLeft
            obj = obj.offsetParent;
        }
    } else if (obj.x)
        curleft += obj.x;
    return curleft;
}

//Function to find the top position of the given object on screen.
function FindPosY(obj) {

    var curtop = 0;

    if (obj.offsetParent) {
        while (obj.offsetParent) {
            curtop += obj.offsetTop
            obj = obj.offsetParent;
        }
    } else if (obj.y)
        curtop += obj.y;
    return curtop;
}

//Function to get the left and top position of the task button image on screen.
function FindPos() {

    var img = document.getElementById("imgTsk");
    X = FindPosX(img);
    Y = FindPosY(img);
}



function ShowAndHideActDiv(actDivId) {

    var dcBtn = $j("#imgAct");
    var x = dcBtn.attr("alt");
    $j("#" + actDivId).css("display", x == "show" ? "block" : "none");
    if (x == "hide") {
        dcBtn.attr("alt", "show");
        dcBtn.attr("src", "../AxpImages/icons/16x16/expandwt.png");
    } else if (x == "show") {
        dcBtn.attr("alt", "hide");
        dcBtn.attr("src", "../AxpImages/icons/16x16/collapsewt.png");
    }
    if (document.title == "Iview") {
        Adjustwin();
    } else {
        $j("#divActContent").html($j("#dvActivityInfo").html());
        $j("#divCustomAct").css("display", "block");
        //   adjustwin('500', window);
    }
}

//Function returns the index of dc in the DCName array if the format grid is true, else returns -1.
function GetFormatGridIndex(dcNo) {
    var formatGridIndex = -1;
    var dcIndex = $j.inArray("dc" + dcNo, DCName);
    if (dcIndex != -1 && DcIsFormatGrid.length > dcIndex) {
        var isFormatGrid = DcIsFormatGrid[dcIndex];
        if (isFormatGrid.toLowerCase() == "true")
            formatGridIndex = dcIndex;
    }

    return formatGridIndex;
}

//Function to update the sub total on deleting a row.
function UpdateSubTotalOnDelRow(fgIdx, dcNo, rowNo) {
    var subTotCols = DcSubTotCols[fgIdx].toString().split(",");
    var keyColName = DcKeyColumns[fgIdx].toString();
    for (var i = 0; i < subTotCols.length; i++) {

        var keyColValue = GetFieldValue(keyColName + rowNo + "F" + dcNo);
        var oldTotal = GetSubTotLblValue("lblSt" + subTotCols[i] + keyColValue + dcNo);
        var fieldValue = GetFieldValue(subTotCols[i] + rowNo + "F" + dcNo);
        if (fieldValue.indexOf(",") != -1)
            fieldValue = removeCommas(fieldValue);
        if (fieldValue == "") fieldValue = 0;
        fieldValue = parseFloat(fieldValue, 10);

        var newTotal = oldTotal - fieldValue;
        SetSubTotLblValue(subTotCols[i], "lblSt" + subTotCols[i] + keyColValue + dcNo, newTotal);
    }
}

//Function returns the fields old value, if the field is numeric then it returns value without comma.
function GetFieldsOldValue(componentName) {
    var oldValue = "";

    var idx = $j.inArray(componentName, ChangedFields);
    if (idx != -1)
        oldValue = ChangedFieldOldValues[idx].toString();

    if (oldValue == "") oldValue = "0";
    if (oldValue.indexOf(",") != -1)
        oldValue = removeCommas(oldValue);
    oldValue = parseFloat(oldValue, 10)
    return oldValue;
}

function GetRowIdx(type, keyColValue, dcNo) {

    var id = "";
    var idx = 0;

    if (type == "header") {
        id = "hdr-" + keyColValue + "F" + dcNo;
        $j("#gridDc" + dcNo + " tbody tr.hdrRow").each(function () {
            if ($j(this).attr("id") == id) {
                idx = $j(this).index();
                return false;
            }
        });
    } else {
        id = "subt-" + keyColValue + "F" + dcNo;
        $j("#gridDc" + dcNo + " tbody tr.stRow").each(function () {
            if ($j(this).attr("id") == id) {
                idx = $j(this).index();
                return false;
            }
        });
    }
    return idx;
}

//Function to update the sub total on change of the fields in the data row.
function UpdateSubTotal(fieldName, rowNo, dcNo, keyColName) {

    var keyColValue = GetFieldValue(keyColName + rowNo + "F" + dcNo);

    var stLabelID = "lblSt" + fieldName + keyColValue + dcNo;
    var hdrLblId = "hdr-" + keyColValue + "F" + dcNo;

    var hdrIdx = 0;
    var strIdx = 0;

    var currTot = GetSubTotLblValue(stLabelID);
    var newValue = GetFieldValue(fieldName + rowNo + "F" + dcNo);
    if (newValue != "") {
        if (newValue.indexOf(",") != -1)
            newValue = removeCommas(newValue);
        newValue = parseFloat(newValue, 10);
    } else
        newValue = 0;

    var localOldValue = FldOldValue;
    if (localOldValue != "") {
        if (localOldValue.indexOf(",") != -1)
            localOldValue = removeCommas(localOldValue);
        localOldValue = parseFloat(localOldValue, 10);
    }
    currTot = currTot - localOldValue + newValue;

    SetSubTotLblValue(fieldName, stLabelID, currTot);
}

//Function to get the value from the sub total label
function GetSubTotLblValue(labelID) {
    var stFld = document.getElementById(labelID);
    if (stFld) {
        var subTotal = stFld.innerHTML;
        if (subTotal.toString().indexOf(",") != -1)
            subTotal = removeCommas(subTotal);
        subTotal = parseFloat(subTotal, 10);
        return subTotal;
    } else
        return 0;
}

//Function to set the value to the sub total label
function SetSubTotLblValue(fldName, labelID, totValue) {
    var stFld = document.getElementById(labelID);
    if (stFld) {
        var fIndx = GetFieldIndex(fldName);
        var newTotal = NumericFldOnBlur(totValue, fIndx);
        stFld.innerHTML = newTotal;
    }
}

///Function to get the first tab dc no from the page positions array.
//The tab dc numbers are in the format '2,3,4,5'
function GetTabContainer() {
    var tabContId = "";
    for (var i = 0; i < PagePositions.length; i++) {
        if (PagePositions[i].indexOf(",") != -1) {
            var tabDivs = PagePositions[i].toString().split(',');
            tabContId = tabDivs[0];
        }
    }
    return tabContId;
}

//Function to update the sub totals in the format grid dc on change of every sub total column field value.
function UpdateFormatGridTotal(fName, dcNo, rowNo, dcIndx) {
    //Update the sub total in format grid
    if (dcIndx != -1) {
        var subTotCols = DcSubTotCols[dcIndx].toString().split(",");
        var subTotIndx = $j.inArray(fName, subTotCols);
        if (subTotIndx != -1) {
            var kIndx = $j.inArray("dc" + dcNo, DCName);
            var keyColName = DcKeyColumns[kIndx].toString();
            UpdateSubTotal(fName, rowNo, dcNo, keyColName);
        }
    }
}

//Function to get the index of the given row from the format grid dc.
function GetFormatRowIndex(tableName, dcNo, keyColValue, rowType, dataRowId) {

    var id = "";
    if (rowType == "header")
        id = "hdr-" + keyColValue + "F" + dcNo;
    else
        id = "subt-" + keyColValue + "F" + dcNo;

    var indx = -1;
    if (dataRowId != undefined)
        id = dataRowId;
    $j("#" + tableName + " tbody>tr").each(function () {
        if ($j(this).attr("id") == id) {
            indx = $j(this)[0].rowIndex;
            return false;
        }
    });

    return indx;
}

//Function to check if the given row is the only row in the given group/type.
function IsOnlyFormatGridRow(dcNo, rowNo, dcIndex) {
    var keyColName = DcKeyColumns[dcIndex].toString();
    var currKeyColId = keyColName + rowNo + "F" + dcNo;

    var keyColValue = GetFieldValue(currKeyColId);

    var hdrRowIndx = GetFormatRowIndex("gridDc" + dcNo, dcNo, keyColValue, "header");
    var stRowIndx = GetFormatRowIndex("gridDc" + dcNo, dcNo, keyColValue, "strow");
    if (stRowIndx - hdrRowIndx == 2 || $j("#hdnRCntDc" + dcNo).val() == "1") {
        return true;
    }
    return false;
}

//Function to reset the serial no of the format grid rows on deleting the given row.
function ResetFormatGridSlNo(dcNo, rowNo, dcIndex) {
    var keyColName = DcKeyColumns[dcIndex].toString();
    var currKeyColId = keyColName + rowNo + "F" + dcNo;
    var keyColValue = GetFieldValue(currKeyColId);
    var stRowIndx = GetFormatRowIndex("gridDc" + dcNo, dcNo, keyColValue, "strow");

    if (stRowIndx != -1) {

        var delRowSlNo = $j("#lblSlNo" + rowNo + "F" + dcNo).text();
        delRowSlNo = parseInt(delRowSlNo, 10);
        var delRowId = "sp" + dcNo + "R" + rowNo + "F" + dcNo;
        var delRowIndex = GetFormatRowIndex("gridDc" + dcNo, dcNo, keyColValue, "data", delRowId);
        delRowIndex = delRowIndex + 1;
        var currSlNo = delRowSlNo;

        for (var i = delRowIndex; i <= stRowIndx; i++) {

            var row = $j('#gridDc' + dcNo + ' tbody>tr:eq(' + i + ')');
            var rowId = row.attr("id");
            var curRowNo = rowId.substring(rowId.indexOf("R") + 1, rowId.indexOf("F"));

            if (curRowNo == rowNo) continue;

            var slNo = "#lblSlNo" + curRowNo + "F" + dcNo;
            slNo = $j(slNo);

            if (slNo.length > 0) {
                slNo.text(currSlNo);
                currSlNo += 1;
            }
        }
    }
}

//Function to add the key column value in the given row. 
function SetKeyColValue(dcNo, rowNo, keyColValue) {
    var gridIndex = GetFormatGridIndex(dcNo);
    var keyColName = DcKeyColumns[gridIndex].toString();
    SetFieldValue(keyColName + rowNo + "F" + dcNo, keyColValue);
    var dbRowNo = GetDbRowNo(rowNo, dcNo);
    UpdateFieldArray(keyColName + rowNo + "F" + dcNo, dbRowNo, keyColValue, "parent");
    UpdateAllFieldValues(keyColName + rowNo + "F" + dcNo, keyColValue);
}

//Function to delete the entire group, header data and the sub total rows in the given format grid dc.
function DeleteGroup(deletedRow, dcNo, keyColValue) {

    ShowDimmer("true");
    var cutMsg = eval(callParent('lcm[65]'));
    var glType = eval(callParent('gllangType'));
    var isRTL = false;
    if (glType == "ar")
        isRTL = true;
    else
        isRTL = false;
    var DeleteGroupCB = $.confirm({
        theme: 'modern',
        title: eval(callParent('lcm[155]')),
        onContentReady: function () {
            disableBackDrop('bind');
        },
        backgroundDismiss: 'false',
        escapeKey: 'buttonB',
        content: cutMsg,
        rtl: isRTL,
        buttons: {
            buttonA: {
                text: eval(callParent('lcm[164]')),
                btnClass: 'btn btn-primary',
                action: function () {
                    DeleteGroupCB.close();
                    DeleteGroupAfterConfirm();
                }
            },
            buttonB: {
                text: eval(callParent('lcm[192]')),
                btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                action: function () {
                    disableBackDrop('destroy');
                    return;
                },
            }
        }
    });

    function DeleteGroupAfterConfirm() {
        var isSingleRow = false;
        var row = deletedRow;
        var hdrRowIndx = GetFormatRowIndex("gridDc" + dcNo, dcNo, keyColValue, "header");

        var stRowIndx = GetFormatRowIndex("gridDc" + dcNo, dcNo, keyColValue, "strow");

        var strGrpCntValue = GetGrpCntValue(dcNo, keyColValue);

        for (var i = stRowIndx; i >= hdrRowIndx; i--) {
            if (i == hdrRowIndx || i == stRowIndx) {
                $j('#gridDc' + dcNo + ' tbody>tr:eq(' + i + ')').remove();
            } else {
                var rowId = $j('#gridDc' + dcNo + ' tbody>tr:eq(' + i + ')').attr("id");
                var rowNo = rowId.substring(rowId.indexOf("R") + 1, rowId.indexOf("F"));
                DeleteGridRow(dcNo, rowNo + "F" + dcNo, "group");
            }
        }

        if (stRowIndx - hdrRowIndx == 2)
            isSingleRow = true;
        //This condition is to check if there is only one row in a group, which has already been deleted and cleared.
        //then do not call webservice
        if (isSingleRow && strGrpCntValue == "cleared") {
            DeletedDCRows = new Array();
            ShowDimmer(false);
            AxWaitCursor(false);
        } else {
            if (typeof wsPerfEnabled != "undefined" && wsPerfEnabled)
                CallDeletePerfWS("dc" + dcNo);
            else
                CallDeleteWS("dc" + dcNo);
        }
    }
}

//Function to get the sub total row for the given format grid dc and the key column value.
//function GetSubTotalRow(tableName, dcNo, keyColValue) {
//    var id = "subt-" + keyColValue + "F" + dcNo;
//    var prevRow = "";
//    var newRow = "";

//    $j("#" + tableName + " tbody>tr").each(function () {
//        if ($j(this).attr("id") == id) {
//            newRow = prevRow.clone(true);
//            return false;
//        }
//        else {
//            prevRow = $j(this);
//        }
//    });
//    return newRow;
//}

//Function to increment the serial no from the previous row and set it to the current row.
function SetFGSerialNo(dcNo, rowNo, priorRowID) {
    //lblSlNo001F3
    var priorRowNo = priorRowID.substring(priorRowID.indexOf("R") + 1, priorRowID.indexOf("F"));
    var oldSerialNoLbl = $j("#lblSlNo" + priorRowNo + "F" + dcNo);
    var newSerialNoLbl = $j("#lblSlNo" + rowNo + "F" + dcNo);
    var newSerialNo = parseInt(oldSerialNoLbl.text(), 10) + 1
    newSerialNoLbl.text(newSerialNo);
}

function RemoveTstDataObj() {

    if (isSelfOpened) {
        isSelfOpened = false;
        return;
    }
    if (tstDataId == "") {
        tstDataId = $j("#hdnDataObjId").val();
    }
    try {
        ASB.WebService.DeleteTstDataObj(tstDataId);
    } catch (exp) { }
}

//function SuccessRemoveTstDataObj() {

//}

function CheckSessionTimeout(result) {

    if (result == SESSTIMEOUT) {
        if (window.opener && !window.opener.closed) {
            window.close();
            window.opener.location.reload();
        } else {
            parent.parent.location.href = "Signin.aspx?msg=Your session is expired. Please login again.";
        }
        return true;
    } else if (result == "Duplicate_session") {
        CheckSuccCallBackValidate();
        return true;
    } else if (result == appGlobalVarsObject._CONSTANTS.MALICIOUSNPUTDETECTED) {
        showAlertDialog("error", appGlobalVarsObject.lcm["449"]);
        AxWaitCursor(false);
        ShowDimmer(false);
        return true;
    }
    return false;
}

//This function checks for the grid dc if the vertical scrollbar is visible , 
//if visible then it sets the right margin for the header div, to make space for the scrollbar.
function CheckScroll(dcNo) {

    var dvContentScroll = $j("#contentScroll" + dcNo);
    if (dvContentScroll.length > 0) {

        var dvColScroll = $j("#colScroll" + dcNo);
        var scrollHeight = dvContentScroll.get(0).scrollHeight;

        //safari's scrollHeight includes padding

        var ua = window.navigator.userAgent;
        var browser = ua.indexOf("safari");

        if (browser > 0)
            scrollHeight -= parseInt(dvContentScroll.css('padding-top')) + parseInt(dvContentScroll.css('padding-bottom'));

        if (dvContentScroll.height() <= scrollHeight)
            //dvColScroll.css("margin-right", "17px");
            dvColScroll.css("margin-right", "0px");
        else
            dvColScroll.css("margin-right", "0px");
    }
}

//Function to construct the parent field names of subgrid with proper case
//the fieldname parameter will have the subgrid field id, for e.g: sub3_qty
function GetSubFieldId(fieldName, rowNo, dcNo) {
    var fldId = fieldName + rowNo + "F" + dcNo;
    if ($j("#" + fldId).length > 0)
        return fldId;
    else {
        var fldName = "";
        var idx = $j.inArray(fieldName.toString().toLowerCase(), FLowerNames);
        if (idx != -1)
            fldName = FNames[idx];
        else
            fldName = fieldName;

        fldId = fldName + rowNo + "F" + dcNo;
        if ($j("#" + fldId).length > 0) {
            return fldId;
        }
    }
    return fldId;
}

function ClearSqlChkList(fldId) {
    var hint = "";
    hint = document.getElementById(fldId).title;
    if (IsDcGrid(GetDcNo(GetFieldsName(fldId)))) {
        //$j(".multiChkSpan").each(function () {
        //    if ($j(this).attr("name") == fldId) {
        //        fldChk = $j(this);
        //        fldChk.html("");
        //    }
        //});
        try {
            $j(".multiChkSpan[name=" + fldId + "]").html("");
        } catch (ex) { }
    } else {
        try {
            $("#" + fldId).data("valuelist", "");
            $("#" + fldId).val("");
            $("#" + fldId).tokenfield('setTokens', []);
            $("#" + fldId).data('bs.tokenfield').$input.autocomplete({
                source: []
            });
        } catch (ex) { }
    }
    return hint;
}

function ClearRadioGrp(fldId) {
    var hint = "";
    hint = document.getElementById(fldId).title;
    $j(".multiRgrpSpan").each(function () {
        if ($j(this).attr("name") == fldId) {
            fldChk = $j(this);
            fldChk.html("");
        }
    });

    return hint;
}

//to reload the same ListView page on popup close
function ReloadListView(listViewPage) {
    if (listViewPage != "" && window.opener.location.href.indexOf("pgno") == -1)
        window.opener.location.href = window.opener.location.href + "&pgno=" + listViewPage;
    else
        window.opener.location.href = window.opener.location.href;
}

function IfUnSavedChanges() {
    if (window.parent.globalChange || (typeof (designChanged) != "undefined" && designChanged == true)) {
        var cutMsg = eval(callParent('lcm[29]'));
        if (!confirm(cutMsg)) {
            return true;
            window.parent.globalChange = false;
        } else
            return false;
    } else {
        return false;
    }
}

//function CallDimmer() {
//    try {
//        window.parent.loadFrame();
//    }
//    catch (ex) {
//        window.parent.parent.loadFrame();
//    }
//}

//to navigate page by page on back and forward button click
function BackForwardButtonClicked(buttonName) {

    if (typeof theMode != "undefined" && theMode == "design") {
        goToRenderMode();
        return;
    }

    if (enableBackButton.toString().toUpperCase() == "FALSE" && buttonName == "back")
        return;
    if (enableForwardButton.toString().toUpperCase() == "FALSE" && buttonName == "forward")
        return;
    if (buttonName == "back" || buttonName == "forward") {
        if (IfUnSavedChanges())
            return;
        AxWaitCursor(true);
        ShowDimmer(true);
        //parent.loadFrame();
        callParentNew("loadFrame", "function");
        try {
            ASB.WebService.NavigateBackForwardButton(buttonName, SuccessButtonClicked, OnNavException);
        } catch (ex) {
            AxWaitCursor(true);
            ShowDimmer(true);
        }
    }
    if (buttonName == "back") {
        $j("#goback").css("cursor", 'pointer');
        $j("#goback").removeAttr("onclick");
    }
}

function SuccessButtonClicked(result) {
    AxWaitCursor(false);
    ShowDimmer(false);
    if (result != "") {
        window.location = result;
        return false; //return false will force the page to load
    }

}

function OnNavException(result) {
    AxWaitCursor(false);
    ShowDimmer(false);
    // parent.closeFrame();
    callParentNew("closeFrame()", "function");
    showAlertDialog("error", result._message);
}

function ResetNavGlobalVariables() {
    window.parent.listViewPage = "0";
    window.parent.clickedColumn = "";
    window.parent.dataRowIndex = -1;
    window.parent.isParentIview = false;
}

function SetBackForwardButtonProp(enableForwardButton, enableBackButton) {
    history.forward();
    //if (enableForwardButton == "False") {
    //    $j("#goforward").css("cursor", 'default');
    //    $j("#goforward").bind("BackForwardButtonClicked");
    //}
    //else {
    //    $j("#goforward").css("cursor", 'pointer');
    //    $j("#goforward").bind("BackForwardButtonClicked");
    //}
    if (enableBackButton.toString().toUpperCase() == "FALSE") {
        $j("#goback").css("cursor", 'default');
        $j("#goback").unbind("BackForwardButtonClicked");
    } else {
        $j("#goback").css("cursor", 'pointer');
        $j("#goback").unbind("BackForwardButtonClicked");
    }

    if (parent.gimportIsOpen == true && document.title == "Iview")
        $("#backforwrdbuttons a img#goback").hide();

}


function CreateTimeLog(startTime, client1, client2, asbTot, asbDb, serviceName) {
    try {
        ASB.WebService.CreateTimeLog(startTime, client1, client2, asbTot, asbDb, serviceName, tstDataId);
    } catch (exp) {
        AxWaitCursor(false);
        showAlertDialog("error", ServerErrMsg);
    }
}

function GetAxDate(dt) {
    dt = dt.getDate() + "/" + (dt.getMonth() + 1) + "/" + dt.getFullYear() + " " + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
    return dt;
}

var imageSuffix = "";

function GetDateTime() {
    var param1 = new Date();
    var param2 = param1.getDate().toString() + param1.getMonth().toString() + param1.getFullYear().toString() + param1.getHours().toString() + param1.getMinutes().toString() + param1.getSeconds().toString();
    imageSuffix = param2;
    return imageSuffix;
}

function ChangeDir(dir) {
    $j("#form1").attr("dir", dir);
}

function GetTabDcIndexPagePos(tabDcNo) {
    for (var j = 0; j < PagePositions.length; j++) {
        if (PagePositions[j].toString().indexOf(",") != -1) {
            var strTabs = PagePositions[j].toString().split(',');
            for (var i = 0; i < strTabs.length; i++) {
                if (strTabs[i] == tabDcNo.toString()) {
                    return j;
                }
            }

        }
    }
    return -1;
}


function EnablePageDimmer(e) {


    if ($("#" + e.target.id).is(':enabled') && $("#waitDiv").is(":hidden")) {
        // $("#" + e.target.id).attr("disabled", "disabled");
        ShowDimmer(true);
        //disabledNavLink = e.target.id;
    }

}


function tsddlRefreshSelect() {
    try {
        var popFldDc = GetDcNo(axpSrcSelectID);
        var parFldDc = parent.GetDcNo(axpRefSelectID);
        var tmpSelId = axpSrcSelectID + "000F" + popFldDc;
        var tmpRefSelId = axpRefSelectID + "000F" + parFldDc;
        var tmpSelText = GetFieldValue(tmpSelId);
        var tmpSelVal = "";
        if (axRefreshSelectType.toLowerCase() == "yes")
            tmpSelVal = recordidax;

        if (tmpSelText != "") {
            var tmpSelFld = $j("#" + tmpRefSelId, window.parent.document);

            if (tmpSelFld.length > 0) {
                // tmpSelFld.find('option:selected').prop('selected', false);
                if (tmpSelVal == "")
                    tmpSelFld.append('<option value="' + tmpSelText + '" selected="selected">' + tmpSelText + '</option>');
                else
                    tmpSelFld.append('<option value="' + tmpSelVal + '" selected="selected">' + tmpSelText + '</option>');

                eval(callParent('isTstructPopup') + "= false");
                callParentNew("modalIdNewItem", "id").dispatchEvent(new CustomEvent("close"));
                parent.MainBlur(tmpSelFld);
                tmpSelFld.blur();
                tmpSelFld.focus();
                return;
            }
        }
    } catch (ex) {
        console.log(ex.message);
    }
}


function closeParentFrame() {
    try {
        eval(callParent('closeFrame()', 'function'));
    } catch (ex) {
        console.log("Error in CloseParentFrame -" + ex.message);
    }
}




//To-Do Function to evaluate all the setfont expressions on form load or data load if dcno is 'all' else call this after fillgrid by passing the dcno
function EvaluateSetFont(dcNo) {
    for (var i = 0; i < Expressions.length; i++) {
        var idx = Expressions[i].toString().toLowerCase().indexOf("setfont(");
        if (idx != -1) {
            var fldProps = ExpFldNames[i].toString().split('.');
            var fldDcNo = GetDcNo(fldProps[1]);
            if (dcNo != "all" && fldDcNo.toString() == dcNo) {
                EvaluateAxFunction(fldProps[1].toString(), fldProps[1].toString());
            } else if (dcNo == "all") {
                EvaluateAxFunction(fldProps[1].toString(), fldProps[1].toString());
            }

        }
    }
}

//After getdependents call- if there is a dependent field having setfont expression it needs to be evaluated
//Parameter - Active field that called getdep
function EvaluateSetFontOnGetDep(AxActDepFld) {
    var fieldName = GetFieldsName(AxActDepFld);
    var fldInd = GetFieldIndex(fieldName);

    var depArray;
    var depStr = "";
    if (fldInd != -1) {
        depStr = FldDependents[fldInd].toString();
    }
    if (depStr != "")
        depArray = depStr.split(",");

    if (depArray != undefined) {
        for (var di = 0; di < depArray.length; di++) {

            var dField = depArray[di].toString();
            var depFirstChar = dField.substring(0, 1);
            var depfName = dField.substring(1);
            var depFldDc = GetDcNo(depfName);

            if (depFirstChar == 'e') {
                var depFldIndx = GetFldNamesIndx(depfName);
                if (depFldIndx != -1)
                    expression = Expressions[depFldIndx].toString();
                if (expression.toLowerCase().indexOf("setfont(") != -1)
                    EvaluateAxFunction(depfName, AxActDepFld);
            }
        }
    }
}

function createBootstrapModal(idOfelement, headerTitle, data, buttons, heightOfModal, widthOfModal) {

    var currenttDC = "";
    var typeOfModal = "";
    if (idOfelement == "dvFillGrid") {
        typeOfModal = "fillgrid";
    } else if (data.indexOf("wrapperForEditFields") > -1) {
        typeOfModal = "gridedit";
    }
    if (typeOfModal == "gridedit") {

        currenttDC = headerTitle.substring(headerTitle.indexOf("DC") + 2, headerTitle.indexOf(" "));
        headerTitle = DCCaption[parseInt(currenttDC) - 1];

    }
    let heightcontent = "";
    if (idOfelement != "dvFillGrid") {
        let currentclass = $("#" + data).attr("style");
        let editLayoutWrappper = $("#" + data);
        let editLayoutParent = editLayoutWrappper.parent();
        let editLayoutParentClasses = editLayoutParent.attr("style");
        editLayoutParent.css({
            position: 'absolute', // Optional if #myDiv is already absolute
        });
        editLayoutWrappper.css({
            visibility: 'hidden'
        });
        editLayoutWrappper.removeClass("hide").show();
        GridfieldsHeight = $("#" + data).outerHeight();
        $("#" + data).attr("style", currentclass ? currentclass : "");
        editLayoutParent.attr("style", editLayoutParentClasses || "");
        $("#" + data).addClass("hide");

        iframeheight = $(".dvheightframe").height();
        GridfieldsHeight > iframeheight ? heightcontent = iframeheight : heightcontent = GridfieldsHeight + 100; //100 if for header height+container marigins and padding
    } else {
        heightcontent = "400";
    }
    //heightcontent = heightcontent.toString();
    //if (heightcontent.indexOf("px") == -1 || heightcontent.indexOf("%") == -1 || heightcontent.indexOf("vh") == -1) {
    //    heightcontent += "px";
    //}

    //heightcontent = "100%";

    var modalHTML = "";
    heightOfModal = heightOfModal || "";
    widthOfModal = widthOfModal || "";
    var modalHTML = '<div class="modal fade" style="width:100%" id="bootstrapModal" role="dialog">';
    modalHTML += '<div class="modal-dialog" style="height:' + heightOfModal + ';width:' + widthOfModal + ';margin-bottom:0px;">';
    modalHTML += '<div class="modal-content" style="height:' + heightcontent + 'px !important">';
    modalHTML += '<div class="modal-header">';
    if (typeOfModal == "gridedit")
        modalHTML += '<button type="button"  onclick="gridEditSaveNdClose(\'close\')" class="close" title="Save & Close">&times;</button>';
    else
        modalHTML += '<button type="button" class="close" data-dismiss="modal" title="Close">&times;</button>';
    modalHTML += '<h4 class="modal-title">' + headerTitle + '</h4>';
    modalHTML += '</div>';

    let heights = "height: calc(100% - 111px);-webkit-height: calc(100% - 111px);-moz-height: calc(100% - 111px);-o-height: calc(100% - 111px);overflow: auto;"
    if (typeOfModal === "gridedit") {
        heights = "height: calc(100% - 55px);-webkit-height: calc(100% - 55px);-moz-height: calc(100% - 55px);-o-height: calc(100% - 55px);overflow: auto;"
    }

    modalHTML += '<div class="modal-body" style="' + heights + '">';
    modalHTML += '<div id="bootstrapModalData" style="width:100%;height:100%;" class="modal-body-content">';
    //modalHTML += data;
    modalHTML += '</div>';
    modalHTML += '</div>';
    if (buttons && buttons.count) {
        modalHTML += '<div class="modal-footer">';
        //creating buttons html

        for (var i = 1; i <= buttons.count; i++) {
            var name = eval("buttons.button" + i + ".name") || "Button";
            var classes = eval("buttons.button" + i + ".class") || "btn btn-default";
            var functionality = eval("buttons.button" + i + ".function") || "";
            var id = eval("buttons.button" + i + ".id") || "";
            modalHTML += '<button id="' + id + '" type="button"  class="' + classes + '" onclick="' + functionality + '"  data-dismiss="modal" title="' + name + '">' + name + '</button>';
        }

        //modalHTML += '<button id="modalCnfirmbtn" type="button"  class="btn btn-default"  data-dismiss="modal">Ok</button>';
        ////if (okFunctionality)
        //    modalHTML += '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>';
        modalHTML += '</div>';
    }
    modalHTML += ' </div>';
    modalHTML += '</div>';
    modalHTML += '</div>';
    $('body').append(modalHTML);
    if (typeOfModal == "gridedit") {
        $("#" + data).removeClass("hide");

        data = $("#" + data).detach();
    }
    if (typeOfModal == "gridedit") {
        var x = data.find("input[type!='hidden']").first();
        if (x.hasClass("hasDatepicker")) {
            x.unbind("focus");
        }
    }



    $(data).appendTo("#bootstrapModalData").show();
    var optns = {};
    if (typeOfModal == "gridedit") {
        optns.keyboard = false;
        optns.backdrop = false;

    }


    $("#bootstrapModal").modal(optns);

    $('#bootstrapModal').on('shown.bs.modal', function (e) {
        //$('#bootstrapModal .modal-dialog')
        $('#bootstrapModal .modal-content').draggable({
            containment: "body",
        }).resizable();
        //if (typeOfModal != "gridedit") {
        handleModalTabEvents();
        //}
        if (typeOfModal == "gridedit") {
            $('#bootstrapModal').off('click.gridOutClick')
            $('#bootstrapModal').on('click.gridOutClick', function (e) {
                // your function...
                if (!$(e.target).hasClass('modal-content') && $(e.target).parents('.modal-content').length === 0 && $(e.target).parents('[id^=wrapperForEditFields]').length === 0 && $(e.target).parents('.editLayoutFooter').length === 0 && !$(e.target).hasClass("grdAttach"))
                    gridEditSaveNdClose('close')
            });
            setModalFooterInEdit(currenttDC);

            // editDivId = $j("#wrapperForEditFields" + currenttDC + " .editWrapTr").attr('id');
            //  editElementObject = $j("#wrapperForEditFields" + currenttDC).html();
            //FocusOnFirstField(headerTitle.substring(headerTitle.indexOf("DC") + 2, headerTitle.indexOf(" ")));
            createBlurEventOnLastElem(currenttDC);
        } else if (typeOfModal == "fillgrid") {
            var element = getFirstFocusElement("#dvFillGrid table tr:not(:first)");
            element != undefined ? element.focus() : $("#bootstrapModal .modal-footer button:first").focus(); //if no data found on grid dialog then focus on modal button after dialog displays
        }
        $(document).off("keydown.bootstrapmodalEscKey")
        $(document).on("keydown.bootstrapmodalEscKey", function (event) {
            if (event.keyCode == 27) {
                if (typeOfModal == "gridedit") {
                    $(event.target).blur();
                    gridEditSaveNdClose('close')
                } else
                    $("#bootstrapModal .close").click();
            }
        })
    });
    $('#bootstrapModal').on('hidden.bs.modal', function (e) {

        if (typeOfModal != "gridedit") {
            unBindModalTabEvents();
        } else {
            $('#bootstrapModal').off('click.gridOutClick')
        }
        $("#wrapperForMainNewData", window.parent.document).show();
        if (typeOfModal == "fillgrid") {
            unbindKeyDownEvent();
            $("#bootstrapModalWrapP").html("<div id='" + idOfelement + "'></div>");


            if ($("#bootstrapModalWrapP"))
                $("#" + idOfelement).unwrap();
        } else if (typeOfModal == "gridedit") {

            //if ($("#bootstrapModal [id^=newRecordBtn]").length > 0) {
            //    $("#bootstrapModal [id^=newRecordBtn]").click();
            //}
            //editDivId = "";
            $j("#" + data[0].id).find(".fldAutocomplete").autocomplete('close');
            if (typeof data[0].id != "undefined" && typeOfModal == "gridedit" && data[0].id != "") {
                $("#" + data[0].id).addClass("hide");
                data = $("#" + data[0].id).detach();
                $(data).appendTo("#" + idOfelement);
            }
        }
        $("#bootstrapModal").remove();
    })
}


//To handle tab events in BootStrap Modal
function handleModalTabEvents() {
    jQuery(document).bind("keydown.bootstrapModalPopupKD", function (event) {
        if (!event.shiftKey && event.keyCode == 9) {
            if ($(document.activeElement)[0] == $('.modal-content :focusable').last()[0]) {
                event.preventDefault();
                $('.modal-content :focusable').first().focus();
            }
        } else if (event.shiftKey && event.keyCode == 9) {
            if ($(document.activeElement)[0] == $('.modal-content :focusable').first()[0]) {
                event.preventDefault();
                $('.modal-content :focusable').last().focus();
            }
        }
    })
}

function unBindModalTabEvents() {
    jQuery(document).unbind("keydown.bootstrapModalPopupKD");
}

function getFirstFocusElement(objId) {
    var focusObj = $j(objId).find(':input[type!="hidden"]:enabled,textarea:enabled,select:enabled,span.fa-paperclip').filter(":visible").not('button').first();
    if (focusObj != undefined && focusObj.length > 0)
        return focusObj;
    else if (typeof isWizardTstruct != "undefined" && isWizardTstruct)
        return $j("#wizardBodyContent").find('button.gridBtns,button.lblgridactn').filter(":visible").first();
}

function doParentOpInIframe(name, type, data, selIFrame) {
    data == undefined ? data = "" : "";
    var allData = data.split('~');
    selIFrame = getFrameParent(selIFrame);
    try {

        if (selIFrame) {
            if (type == "var") {
                selIFrame.eval(name = data);
            } else if (type == "fun") {

            } else if (type == "chk") {

            }
        }
    } catch (ex) {
        doParentOpInIframe(name, type, data)
    }

}

function getFrameParent(selIFrame) {
    if (typeof selIFrame == undefined && window) {
        return window;
    } else if (selIFrame == window && window.parent) {
        return window.parent;
    } else if (selIFrame == window.parent && window.parent.parent) {
        return window.parent.parent;
    } else if (selIFrame == window.parent.parent && window.parent.parent.parent) {
        return window.parent.parent.parent;
    } else {
        return false;
    }
}

function dateAutoGenerator(elem, dateRoundToLastDate) {
    var dateTextLength = $(elem).val().length;
    if (dateTextLength > 0) {
        var dateSlashes = $(elem).val().split('/').length - 1;
        if (dateSlashes > 0) {
            $(elem).val($(elem).val().replace(/\//g, ""));
            if ($(elem).val().length > 8) {
                $(elem).val($(elem).val().substr(0, 8));
            }
        }
        dateTextLength = $(elem).val().length;
        if (dateTextLength > 0 && dateTextLength <= 8) {
            var dateDate = "00";
            var dateMonth = "00";
            var dateYear = "0000";
            if (dateTextLength <= 4) {
                switch (dateTextLength) {
                    case 1:
                        $(elem).val("000" + $(elem).val());
                        break;
                    case 2:
                        $(elem).val("00" + $(elem).val());
                        break;
                    case 3:
                        $(elem).val("0" + $(elem).val());
                        break;
                }
                dateYear = $(elem).val().substr(2, 2);
                var currentYear = (new Date().getFullYear()).toString();
                dateYear = currentYear.substr(0, 2) + dateYear;
                dateMonth = $(elem).val().substr(0, 2);
                dateMonth = dateMonth == "00" || (parseInt(dateMonth) > 12) ? (dateRoundToLastDate == "true" ? "12" : "01") : dateMonth;
                //dateDate = DaysInMonth(dateYear, dateMonth);
                dateDate = dateDate == "00" || (DaysInMonth(dateYear, dateMonth) < parseInt(dateDate)) ? (dateRoundToLastDate == "true" ? DaysInMonth(dateYear, dateMonth) : "01") : dateDate;
                $(elem).val(dateDate + "/" + dateMonth + "/" + dateYear);
            } else {
                switch (dateTextLength) {
                    case 5:
                        $(elem).val("000" + $(elem).val());
                        break;
                    case 6:
                        $(elem).val("00" + $(elem).val());
                        break;
                    case 7:
                        $(elem).val("0" + $(elem).val());
                        break;
                }
                dateYear = $(elem).val().substr(4, 4);
                //dateYear = (new Date().getFullYear()).substr(0, 2) + dateYear;
                dateMonth = $(elem).val().substr(2, 2);
                dateMonth = dateMonth == "00" || (parseInt(dateMonth) > 12) ? (dateRoundToLastDate == "true" ? "12" : "01") : dateMonth;
                dateDate = $(elem).val().substr(0, 2);
                dateDate = dateDate == "00" || (DaysInMonth(dateYear, dateMonth) < parseInt(dateDate)) ? (dateRoundToLastDate == "true" ? DaysInMonth(dateYear, dateMonth) : "01") : dateDate;
                $(elem).val(dateDate + "/" + dateMonth + "/" + dateYear);
            }
        }
    }
}

// Function for masking the character
function MaskCharacter(str, mask, n) {
    // Slice the string and replace with
    // mask then add remaining string
    return [...str].reduce((acc, x, i) =>
        (i < str.length - n) ? acc + mask : acc + x, '');
}

function RevMaskCharacter(str, mask, n) {

    // Slice the string and replace with
    // mask then add remaining string
    return [...str].reduce((acc, x, i) =>
        (i >= str.length - n) ? acc + mask : acc + x, '');
}

function ApplyFldMask(_thisId, _thisVal) {
    let fieldName = GetFieldsName(_thisId);
    let fldInd = GetFieldIndex(fieldName);
    if (typeof FldMaskType != "undefined") {
        let maskType = FldMaskType[fldInd];
        if (maskType == "Show few characters") {
            let maskDtl = FldMaskDetails[fldInd];
            var maskDtls = maskDtl.split('♦');
            let _thisMaskVal = _thisVal
            if (maskDtls[0] != "" && maskDtls[0] != 0 && _thisMaskVal != "" && _thisMaskVal != 0)
                _thisMaskVal = MaskCharacter(_thisMaskVal.toString(), maskDtls[2], _thisMaskVal.toString().length - maskDtls[0]);
            if (maskDtls[1] != "" && maskDtls[1] != 0 && _thisMaskVal != "" && _thisMaskVal != 0)
                _thisMaskVal = RevMaskCharacter(_thisMaskVal.toString(), maskDtls[2], maskDtls[1]);
            $("#" + _thisId).val(_thisMaskVal);
            $("#" + _thisId).attr("value", _thisMaskVal);

        } else if (maskType == "Mask all characters") {
            let maskDtl = FldMaskDetails[fldInd];
            var maskDtls = maskDtl.split('♦');
            let _thisMaskVal = _thisVal
            if (_thisMaskVal != "" && _thisMaskVal != 0)
                _thisMaskVal = MaskCharacter(_thisMaskVal.toString(), maskDtls[2], 0);
            $("#" + _thisId).val(_thisMaskVal);
            $("#" + _thisId).attr("value", _thisMaskVal);
        }
    }
}

//Function to update the field arrays on change of any field.
function UpdateAllFieldValues(fieldName, fieldValue) {
    if (typeof fieldValue != "string") fieldValue = fieldValue.toString();

    var id = "";
    if ($j("#" + fieldName).prop("type") == "select-one") {
        if ($j("#" + fieldName).hasClass("fldFromSelect")) {
            id = $j("#" + fieldName).find("option:selected").val();
            if (id != undefined && id != "")
                fieldValue = id;
        } else {
            id = $j("#" + fieldName).find("option:selected").val();
            if (id != undefined && id != "")
                fieldValue = id + "¿" + fieldValue;
        }
    } else if ($j("#" + fieldName).prop("type") == "textarea") {
        var newValue = fieldValue.replace(new RegExp("<br>", "g"), "¿");
        newValue = newValue.replace(new RegExp("¿", "g"), "\n");
        fieldValue = newValue;
    }

    if (fieldValue == undefined) fieldValue = "";
    var _isAlreadyFound = false;
    if (AllFieldNames.length > 0) {
        var idx = $j.inArray(fieldName, AllFieldNames);
        if (idx != -1) {
            AllFieldValues[idx] = fieldValue;
            _isAlreadyFound = true;
        }

        if ((!_isAlreadyFound)) {
            AllFieldNames.push(fieldName);
            AllFieldValues.push(fieldValue);
        }
    } else {
        AllFieldNames.push(fieldName);
        AllFieldValues.push(fieldValue);
    }
}
