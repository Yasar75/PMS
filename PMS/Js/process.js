//-----------------------------List of functions in this file--------------------------------------
//EvaluateAxFunction(depFldname, changedFldName, currentRowNo) -Function to evaluate the expressio of a field and set its value.
//GetFldNamesIndx(fldName) -Function to get the fields index from the ExpFldNames array.
//GetExpressionType(expFldName, indx) -Function to get the type of expression defined for a field.
//GetFieldGridType(fieldName) -Function which returns the type of the fields dc.
//Assignfldval(fldName, fval) -Function to assign the value to the field after evaluating the expression.
//CallFileUploadAction(actionName, Title, ftype, confirmmsg) -Function to call file upload action.
//CallAfterFileUploadAction() -Function which executes after the file upload.
//CallAction(actionName, fileup, confirmmsg) -Function to call action webservice.
//SuccessCallbackAction(result, eventArgs) -callback function from the callaction webservice.
//AssignLoadValues(resultJson, calledFrom) -Function which fills the values from result json into the fields.
//ExecAttachments(attJsonObj) -Function to execute the attachments node in the json result .
//ExecWorkflow(wfJsonObj) -Function to execute the workflow node in the json result.
//ExecMessage(messageJsonObj) -Function to execute the message node in the json result.
//ExecFormControl(formControlJsonObj) -Function to execute the formcontrol node in the json result.    
//ConstructParams(params, values) -Function to construct the parameter string from the json parameters.
//ExecCommand(cmdJsonObj) -Function which executes the commands in the result json.  
//SetRows(dcNo, rowCount, calledFrom) -Function which adds or deletes the rows to the given dc to make it equal to the rowCount.
//SetRowsInDc(dcNo, rowCount) -Function to clear and add rows in the grid with the given rowcount.
//ClearRowsInGrid(gridDcNo) -Function to clear all rows except the first row in the Grid.
//ConstructFieldName(fldName, dcNo, dbRowNo) -Function which returns the component name of the field.
//GetFirstRow(dcNo) -Function which returns the first row in the dc. 
//CopyFromMasterRow(fldName, dcNo) -Function which copies the items to the field from the field in the first row of the given dcno.
//DoFormControlPrivilege(result) -Function to apply partial disabling of the grid rows.
//AttachFiles() -Function to attach the attachments to the tstruct. 
//ConstructAttachments() -Function to display the attachments attached to the tstruct. 
//RemoveNewFiles(filename) -Function to remove the files which is uploaded attachments. 
//RemoveFile(fname, rid) -Function to call the webservice to remove the uploaded attachments.
//SuccessRemAttFile(result, eventArgs) -Callback function for RemoveAttachedFiles.
//RemoveArrVal(flname, arrayname) -Function to remove the file from the array , once removed from the path. 
//OpenAttachment(a, b) -Function to call the service to view the attachments.
//SuccChoicesOpenAtt(result, eventArgs) -Callback function for viewAttachXML service call.
//OpenNewFile(openFileName) -Function to open a file which is attached newly. 
//ClearInputFile() -Function to clear the value from the html file control.
//FindDuplicate(fileupld) -Function to find the duplicate attachment.            
//-------------------------------------------------------------------------------------------------

var arrExpFunctions = ["getstockvalue", "getcostrate", "getclosingstock", "checkstock", "domrp"], saveActRecSuccess = false, AxActionSave = false, iViewRefresh = false; WrkflFlag = false;
var axFramReload = false;
var isMobile = isMobileDevice();
function CheckExpFunctions(expr) {
    var isExpFunc = false;
    for (var i = 0; i < arrExpFunctions.length; i++) {
        if (expr.indexOf(arrExpFunctions[i].toLowerCase()) != -1) {
            isExpFunc = true;
            break;
        }
    }
    return isExpFunc;
}

//Function to evaluate the expressio of a field and set its value.
function EvaluateAxFunction(depFldname, changedFldName, currentRowNo) {

    //local variables for storing the global active variables.
    var activeRow = AxActiveRowNo;
    var activePRow = AxActivePRow;
    var activeDc = AxActiveDc;
    var activeParDC = AxActivePDc;
    var activeFldOldVal = FldOldValue;

    var depFldIndx = GetFldNamesIndx(depFldname)
    var depFldType = "";
    var expression = "";
    if (depFldIndx != -1) {
        depFldType = GetExpressionType(depFldname, depFldIndx);
        expression = Expressions[depFldIndx].toString();
    }

    //For evaluate GetCostRate expression
    if (CheckExpFunctions(expression.toLowerCase())) {
        GetDependents(changedFldName, "");
        return;
    }

    var changedFldType = GetFieldGridType(changedFldName);
    var exprFldName = depFldname;
    var depFrameNo = GetDcNo(exprFldName);

    if (depFldIndx != -1 && expression != "") {

        var result = "";
        if (depFldType == "NG" && changedFldType == "NG") {
            if (exprFldName == "axpattachmentpath") {
                exprFldName = exprFldName + "000F" + depFrameNo;
                result = expression.substring(1, expression.length - 1);
                if ((result != "username") || (result != "usergroup") || (result != undefined) || (result.toString() != "undefined")) {
                    Assignfldval(exprFldName, result);
                }
            }
            else {
                exprFldName = exprFldName + "000F" + depFrameNo;
                result = EvalPrepared(exprFldName, "000", expression, "expr");
                if ((result != "username") || (result != "usergroup") || (result != undefined) || (result.toString() != "undefined")) {
                    Assignfldval(exprFldName, result);
                }
            }
        }
        else if (depFldType == "NG" && changedFldType == "GR") {
            var clientRowNo = GetClientRowNo(AxActiveRowNo, depFrameNo);
            exprFldName = exprFldName + clientRowNo + "F" + depFrameNo;
            result = EvalPrepared(exprFldName, clientRowNo, expression, "expr");
            if ((result != "username") || (result != "usergroup") || (result != undefined) || (result.toString() != "undefined")) {
                Assignfldval(exprFldName, result);
            }
        }
        else if ((depFldType == "GR" || depFldType == "PG") && changedFldType == "NG") {

            var rowCnt = 0;
            rowCnt = parseInt(GetDcRowCount(depFrameNo), 10);

            for (var i = 1; i <= rowCnt; i++) {

                var rowNo = GetRowNoHelper(i);
                AxActiveRowNo = GetDbRowNo(rowNo, depFrameNo);
                //Here the exprFldName was getting appended with new row as it was not cleared, also check line no 116
                var tmpFldId = exprFldName + rowNo + "F" + depFrameNo;
                isEvalGrid=false;
                result =Evaluate(tmpFldId, rowNo, expression, "expr");// EvalPrepared(tmpFldId, rowNo, expression, "expr");
                if ((result != "username") || (result != "usergroup") || (result != undefined) || (result.toString() != "undefined")) {
                    Assignfldval(tmpFldId, result);
                }
                if (isEvalGrid) {
                    var rvarFldList="";
                    try{
                        let rvFld= regVarFldExp.filter(word => word.startsWith(exprFldName.toLowerCase()+"♦"));
                        if(rvFld.length>0)
                        {
                            let rvFldExp=rvFld[0].split("♦")[1];
                            if(rvFldExp!=-1)
                                rvarFldList=rvFldExp;
                        }else{
                            let rvrFldList = FNames.filter(word => word.toLowerCase()=="rvar_"+exprFldName.toLowerCase());
                            if(rvrFldList!=""){
                                let rvlFldIndx = GetFldNamesIndx(rvrFldList)
                                let rvlExpression = Expressions[rvlFldIndx].toString();
                                regVarFldExp.push(exprFldName+"♦"+rvrFldList+"♠"+rvlExpression);
                                rvarFldList=rvrFldList+"♠"+rvlExpression;
                            }else
                                regVarFldExp.push(exprFldName+"♦-1");
                        }
                    }catch(ex){}
                    isEvalGrid = false;
                    if(rvarFldList!="")
                    {
                        try{
                            let rvarFldName= rvarFldList.split("♠");
                            let tmprvlFldId = rvarFldName[0] + rowNo + "F" + depFrameNo;
                            Evaluate(tmprvlFldId, rowNo, rvarFldName[1], "expr");
                        }catch(ex){}
                    }
                }
            }
        }
        else if (depFldType == "GR" && changedFldType == "GR") {

            var clientRowNo = GetClientRowNo(AxActiveRowNo, AxActiveDc);
            var depDcNo = GetDcNo(exprFldName);
            if (AxActiveDc != depDcNo) {
                var rowCnt = 0;
                rowCnt = parseInt(GetDcRowCount(depDcNo), 10);

                for (var i = 1; i <= rowCnt; i++) {

                    var rowNo = GetClientRowNo(i, depDcNo);
                    AxActiveRowNo = GetDbRowNo(rowNo, depDcNo);

                    var tmpFldId = exprFldName + rowNo + "F" + depDcNo;
                    result = Evaluate(tmpFldId, rowNo, expression, "expr");
                    if ((result != "username") || (result != "usergroup") || (result != undefined) || (result.toString() != "undefined")) {
                        Assignfldval(tmpFldId, result);
                    }
                }
            }
            else {
                var fldExprFldName = exprFldName;
                exprFldName = exprFldName + clientRowNo + "F" + AxActiveDc;
                isEvalGrid=false;
                if (exprFldName.indexOf("_referimages") > -1 || exprFldName.indexOf("dc" + depDcNo + "_image") > -1 || exprFldName.indexOf("dc" + depDcNo + "_imagepath") > -1)
                    result = GetReferExpr(exprFldName, clientRowNo, expression);
                else
                    result = Evaluate(exprFldName, clientRowNo, expression, "expr");
                if ((result != "username") || (result != "usergroup") || (result != undefined) || (result.toString() != "undefined")) {

                    Assignfldval(exprFldName, result);
                }
                if (AxActiveDc == depDcNo && (isSumTillGrid || isEvalGrid)) {//Refer: HEA000101
                    isSumTillGrid = false;
                    var rvarFldList="";
                    if(isEvalGrid){
                        try{
                            let rvFld= regVarFldExp.filter(word => word.startsWith(fldExprFldName.toLowerCase()+"♦"));
                            if(rvFld.length>0)
                            {
                                let rvFldExp=rvFld[0].split("♦")[1];
                                if(rvFldExp!=-1)
                                    rvarFldList=rvFldExp;
                            }else{
                                let rvrFldList = FNames.filter(word => word.toLowerCase()=="rvar_"+fldExprFldName.toLowerCase());
                                if(rvrFldList!=""){
                                    let rvlFldIndx = GetFldNamesIndx(rvrFldList)
                                    let rvlExpression = Expressions[rvlFldIndx].toString();
                                    regVarFldExp.push(fldExprFldName+"♦"+rvrFldList+"♠"+rvlExpression);
                                    rvarFldList=rvrFldList+"♠"+rvlExpression;
                                }else
                                    regVarFldExp.push(fldExprFldName+"♦-1");
                            }
                        }catch(ex){}
                    }
                    isEvalGrid = false;
                    //var curRowNum = parseInt(AxActiveRowNo) + 1;
                    var curRowNum = 1;
                    var rowCnt = 0;
                    rowCnt = parseInt(GetDcRowCount(depDcNo), 10);
                    for (var i = curRowNum; i <= rowCnt; i++) {
                        var rowNo = GetClientRowNo(i, depDcNo);
                        AxActiveRowNo = GetDbRowNo(rowNo, depDcNo);
                        var tmpFldId = fldExprFldName + rowNo + "F" + depDcNo;
                        result = Evaluate(tmpFldId, rowNo, expression, "expr");
                        if ((result != "username") || (result != "usergroup") || (result != undefined) || (result.toString() != "undefined")) {
                            Assignfldval(tmpFldId, result);
                            if(rvarFldList!="")
                            {
                                try{
                                    let rvarFldName= rvarFldList.split("♠");
                                    let tmprvlFldId = rvarFldName[0] + rowNo + "F" + depDcNo;
                                    Evaluate(tmprvlFldId, rowNo, rvarFldName[1], "expr");
                                }catch(ex){}
                            }
                        }
                    }
                    isEvalGrid = false;
                }
            }
        }
        else if (depFldType == "PG" && changedFldType == "PG") {

            var clientRowNo = GetClientRowNo(AxActiveRowNo, AxActiveDc);
            exprFldName = exprFldName + clientRowNo + "F" + AxActiveDc;
            result = EvalPrepared(exprFldName, clientRowNo, expression, "expr");
            if ((result != "username") || (result != "usergroup") || (result != undefined) || (result.toString() != "undefined")) {
                Assignfldval(exprFldName, result);
            }
        }
        else if (depFldType == "PG" && changedFldType == "GR") {

            var cDcNo = GetFieldsDcNo(changedFldName);
            AxActivePRow = AxActiveRowNo;
            AxActiveDc = depFrameNo;
            AxActivePDc = cDcNo;
            var clientActRow = GetClientRowNo(AxActivePRow, AxActivePDc);
            var popRowsStr = GetPopRows(AxActivePDc, clientActRow, AxActiveDc);
            var popRows = popRowsStr.split(",");
            var fldName = exprFldName;

            for (var i = 0; i < popRows.length; i++) {
                if (popRows[0] != "") {
                    AxActiveRowNo = GetDbRowNo(popRows[i], AxActiveDc);
                    exprFldName = fldName + popRows[i] + "F" + depFrameNo;
                    result = EvalPrepared(exprFldName, popRows[i].toString(), expression, "expr");
                    if ((result != "username") || (result != "usergroup") || (result != undefined) || (result.toString() != "undefined")) {
                        Assignfldval(exprFldName, result);
                    }
                }
            }
        }
        else if (depFldType == "GR" && changedFldType == "PG") {

            var cDcNo = GetFieldsDcNo(changedFldName);
            if (depFrameNo != cDcNo) {
                AxActiveRowNo = AxActivePRow;
                AxActiveDc = depFrameNo;
            }
            var clientRow = GetClientRowNo(AxActiveRowNo, AxActiveDc);
            exprFldName = exprFldName + clientRow + "F" + AxActiveDc;
            result = EvalPrepared(exprFldName, clientRow, expression, "expr");
            if ((result != "username") || (result != "usergroup") || (result != undefined) || (result.toString() != "undefined")) {
                Assignfldval(exprFldName, result);
            }
        }
        if (isSumTillGrid != undefined)
            isSumTillGrid = false;
        //Restore the global variables with the local variables.       
        AxActiveRowNo = activeRow;
        AxActivePRow = activePRow;
        AxActiveDc = activeDc;
        AxActivePDc = activeParDC;
        FldOldValue = activeFldOldVal;
    }
}

function EvaluateAxFunctionPerf(depFldname, changedFldName, currentRowNo) {

    //local variables for storing the global active variables.
    var activeRow = AxActiveRowNo;
    var activePRow = AxActivePRow;
    var activeDc = AxActiveDc;
    var activeParDC = AxActivePDc;
    var activeFldOldVal = FldOldValue;

    var depFldIndx = GetFldNamesIndx(depFldname)
    var depFldType = "";
    var expression = "";
    if (depFldIndx != -1) {
        depFldType = GetExpressionType(depFldname, depFldIndx);
        expression = Expressions[depFldIndx].toString();
    }

    //For evaluate GetCostRate expression
    if (CheckExpFunctions(expression.toLowerCase())) {
        GetDependents(changedFldName, "");
        return;
    }

    var changedFldType = GetFieldGridType(changedFldName);
    var exprFldName = depFldname;
    var depFrameNo = GetDcNo(exprFldName);

    if (depFldIndx != -1 && expression != "") {

        var result = "";
        if (depFldType == "NG" && changedFldType == "NG") {
            if (exprFldName == "axpattachmentpath") {
                exprFldName = exprFldName + "000F" + depFrameNo;
                result = expression.substring(1, expression.length - 1);
                if ((result != "username") || (result != "usergroup") || (result != undefined) || (result.toString() != "undefined")) {
                    AssignfldvalPerf(exprFldName, result);
                }
            }
            else {
                exprFldName = exprFldName + "000F" + depFrameNo;
                result = EvalPrepared(exprFldName, "000", expression, "expr");
                if ((result != "username") || (result != "usergroup") || (result != undefined) || (result.toString() != "undefined")) {
                    AssignfldvalPerf(exprFldName, result);
                }
            }
        }
        else if (depFldType == "NG" && changedFldType == "GR") {
            var clientRowNo = GetClientRowNo(AxActiveRowNo, depFrameNo);
            exprFldName = exprFldName + clientRowNo + "F" + depFrameNo;
            result = EvalPrepared(exprFldName, clientRowNo, expression, "expr");
            if ((result != "username") || (result != "usergroup") || (result != undefined) || (result.toString() != "undefined")) {
                AssignfldvalPerf(exprFldName, result);
            }
        }
        else if ((depFldType == "GR" || depFldType == "PG") && changedFldType == "NG") {

            var rowCnt = 0;
            rowCnt = parseInt(GetDcRowCount(depFrameNo), 10);

            for (var i = 1; i <= rowCnt; i++) {

                var rowNo = GetRowNoHelper(i);
                AxActiveRowNo = GetDbRowNo(rowNo, depFrameNo);
                //Here the exprFldName was getting appended with new row as it was not cleared, also check line no 116
                var tmpFldId = exprFldName + rowNo + "F" + depFrameNo;
                result = EvalPrepared(tmpFldId, rowNo, expression, "expr");
                if ((result != "username") || (result != "usergroup") || (result != undefined) || (result.toString() != "undefined")) {
                    AssignfldvalPerf(tmpFldId, result);
                }
            }
        }
        else if (depFldType == "GR" && changedFldType == "GR") {

            var clientRowNo = GetClientRowNo(AxActiveRowNo, AxActiveDc);
            var depDcNo = GetDcNo(exprFldName);
            if (AxActiveDc != depDcNo) {
                var rowCnt = 0;
                rowCnt = parseInt(GetDcRowCount(depDcNo), 10);

                for (var i = 1; i <= rowCnt; i++) {

                    var rowNo = GetClientRowNo(i, depDcNo);
                    AxActiveRowNo = GetDbRowNo(rowNo, depDcNo);

                    var tmpFldId = exprFldName + rowNo + "F" + depDcNo;
                    result = Evaluate(tmpFldId, rowNo, expression, "expr");
                    if ((result != "username") || (result != "usergroup") || (result != undefined) || (result.toString() != "undefined")) {
                        AssignfldvalPerf(tmpFldId, result);
                    }
                }
            }
            else {
                var fldExprFldName = exprFldName;
                exprFldName = exprFldName + clientRowNo + "F" + AxActiveDc;
                if (exprFldName.indexOf("_referimages") > -1 || exprFldName.indexOf("dc" + depDcNo + "_image") > -1 || exprFldName.indexOf("dc" + depDcNo + "_imagepath") > -1)
                    result = GetReferExpr(exprFldName, clientRowNo, expression);
                else
                    result = Evaluate(exprFldName, clientRowNo, expression, "expr");
                if ((result != "username") || (result != "usergroup") || (result != undefined) || (result.toString() != "undefined")) {
                    AssignfldvalPerf(exprFldName, result);
                }
                if (AxActiveDc == depDcNo && isSumTillGrid) {//Refer: HEA000101
                    isSumTillGrid = false;
                    var curRowNum = parseInt(AxActiveRowNo) + 1;
                    var rowCnt = 0;
                    rowCnt = parseInt(GetDcRowCount(depDcNo), 10);
                    for (var i = curRowNum; i <= rowCnt; i++) {
                        var rowNo = GetClientRowNo(i, depDcNo);
                        AxActiveRowNo = GetDbRowNo(rowNo, depDcNo);
                        var tmpFldId = fldExprFldName + rowNo + "F" + depDcNo;
                        result = Evaluate(tmpFldId, rowNo, expression, "expr");
                        if ((result != "username") || (result != "usergroup") || (result != undefined) || (result.toString() != "undefined")) {
                            AssignfldvalPerf(tmpFldId, result);
                        }
                    }
                }
            }
        }
        else if (depFldType == "PG" && changedFldType == "PG") {

            var clientRowNo = GetClientRowNo(AxActiveRowNo, AxActiveDc);
            exprFldName = exprFldName + clientRowNo + "F" + AxActiveDc;
            result = EvalPrepared(exprFldName, clientRowNo, expression, "expr");
            if ((result != "username") || (result != "usergroup") || (result != undefined) || (result.toString() != "undefined")) {
                AssignfldvalPerf(exprFldName, result);
            }
        }
        else if (depFldType == "PG" && changedFldType == "GR") {

            var cDcNo = GetFieldsDcNo(changedFldName);
            AxActivePRow = AxActiveRowNo;
            AxActiveDc = depFrameNo;
            AxActivePDc = cDcNo;
            var clientActRow = GetClientRowNo(AxActivePRow, AxActivePDc);
            var popRowsStr = GetPopRows(AxActivePDc, clientActRow, AxActiveDc);
            var popRows = popRowsStr.split(",");
            var fldName = exprFldName;

            for (var i = 0; i < popRows.length; i++) {
                if (popRows[0] != "") {
                    AxActiveRowNo = GetDbRowNo(popRows[i], AxActiveDc);
                    exprFldName = fldName + popRows[i] + "F" + depFrameNo;
                    result = EvalPrepared(exprFldName, popRows[i].toString(), expression, "expr");
                    if ((result != "username") || (result != "usergroup") || (result != undefined) || (result.toString() != "undefined")) {
                        AssignfldvalPerf(exprFldName, result);
                    }
                }
            }
        }
        else if (depFldType == "GR" && changedFldType == "PG") {

            var cDcNo = GetFieldsDcNo(changedFldName);
            if (depFrameNo != cDcNo) {
                AxActiveRowNo = AxActivePRow;
                AxActiveDc = depFrameNo;
            }
            var clientRow = GetClientRowNo(AxActiveRowNo, AxActiveDc);
            exprFldName = exprFldName + clientRow + "F" + AxActiveDc;
            result = EvalPrepared(exprFldName, clientRow, expression, "expr");
            if ((result != "username") || (result != "usergroup") || (result != undefined) || (result.toString() != "undefined")) {
                AssignfldvalPerf(exprFldName, result);
            }
        }

        if (isSumTillGrid != undefined)
            isSumTillGrid = false;
        //Restore the global variables with the local variables.       
        AxActiveRowNo = activeRow;
        AxActivePRow = activePRow;
        AxActiveDc = activeDc;
        AxActivePDc = activeParDC;
        FldOldValue = activeFldOldVal;
    }
}

//Function to get the fields index from the ExpFldNames array.
function GetFldNamesIndx(fldName) {

    var indx = -1;
    for (var i = 0; i < ExpFldNames.length; i++) {
        var exprStr = ExpFldNames[i].split(".");
        if (exprStr[1] == fldName) {
            indx = i;
            break;
        }
    }
    return indx;
}

//Function to get the type of expression defined for a field.
function GetExpressionType(expFldName, indx) {

    var fldProps; var type = "";
    fldProps = ExpFldNames[indx].split('.');

    var dcNo = fldProps[2].substring(1);
    if (IsDcPopGrid(dcNo))
        type = "PG";
    else if (IsDcGrid(dcNo))
        type = "GR";
    else
        type = "NG";


    return type;
}

//Function which returns the type of the fields dc.
function GetFieldGridType(fieldName) {

    var type = "";
    var dcNo = GetFieldsDcNo(fieldName);

    if (IsDcPopGrid(dcNo))
        type = "PG";
    else if (IsDcGrid(dcNo))
        type = "GR";
    else
        type = "NG";
    return type;
}


//Function to assign the value to the field after evaluating the expression.
function Assignfldval(fldName, fval) {
    if (fval != "MessageSetAxFont") {
        //FldOldValue = GetFieldValue(fldName);
        var datatype = "";
        var fld = $j("#" + fldName);
        if (fld.length > 0)  // if field exists
        {
            var CurValue = fld[0].value;
            if (CurValue == "***")
                return;

            var pickListFld = "img~" + fldName;
            if ($j("#" + pickListFld).length > 0) //img~PartNo001F2"
            {
                isFocusFrmPickList = true;
            }

            var fName = GetFieldsName(fldName);
            var fRowNo = GetFieldsRowNo(fldName);
            var dcNo = GetFieldsDcNo(fldName);
            var fldDbRow = GetDbRowNo(fRowNo, dcNo);

            if (TstructHasPop) {
                if (IsParentField(fName, dcNo)) {
                    UpdatePopUpParents(fldName);
                }
            }

            // fix for datetype field returning 0
            var decNo = 0;
            for (var z = 0; z < FNames.length; z++) {

                if (FNames[z] == fName) {
                    if (FCustDecimal[z] == "True" && typeof gloAxDecimal != "undefined" && gloAxDecimal > -1)
                        decNo = gloAxDecimal;
                    else
                        decNo = FDecimal[z];
                    datatype = FDataType[z];
                    break;
                }
            }

            if (datatype.toLowerCase() == "numeric") {

                fval = fixit(fval, decNo);
                UpdateFieldArray(fldName, fldDbRow, fval, "parent", "");
                fval = CommaFormatted(fixit(fval, decNo));
                CallSetFieldValue(fldName, fval);
            }
            else if ((fld[0].type == "text") || (fld[0].type == "hidden")) {

                if (fval == "''")
                    fval = "";
                if (!fval) fval = "";
                if (datatype == "Date/Time") {
                    var upfval = fval;
                    if (fval == 0) {
                        fval = "";
                        upfval = "";
                    }
                    else if (upfval != "") {
                        var glCulture = callParentNew('glCulture');// eval(callParent('glCulture'));
                        if (glCulture != undefined && glCulture == "en-us")
                            upfval = GetDateStr(upfval, "mm/dd/yyyy", "dd/mm/yyyy");
                    }
                    UpdateFieldArray(fldName, fldDbRow, upfval, "parent", "");
                    CallSetFieldValue(fldName, fval);
                }
                else {
                    if (fval != "") {
                        var upfval = fval;
                        try {
                            var dtlenth = fval.split('/');
                            if (dtlenth[0].length == 2 && (typeof dtlenth[1] != "undefined" && dtlenth[1].length == 2) && (typeof dtlenth[2] != "undefined" && dtlenth[2].length == 4)) {
                                var glCulture = callParentNew('glCulture');//eval(callParent('glCulture'));
                                if (glCulture != undefined && glCulture == "en-us")
                                    upfval = GetDateStr(upfval, "mm/dd/yyyy", "dd/mm/yyyy");
                            }
                        } catch (ex) { }
                        UpdateFieldArray(fldName, fldDbRow, upfval, "parent", "");
                        CallSetFieldValue(fldName, fval);
                    }
                    else {
                        UpdateFieldArray(fldName, fldDbRow, fval, "parent", "");
                        CallSetFieldValue(fldName, fval);
                    }
                }
            }
            else {
                //convert the value to string if the field type is character(by default it is taking it as numeric value)
                if (datatype.toLowerCase() == "character")
                    fval = fval.toString();
                UpdateFieldArray(fldName, fldDbRow, fval, "parent", "");
                CallSetFieldValue(fldName, fval);
            }

            if (fName.indexOf("axpvalid") != -1) {
                DoFormControlPrivilege(fldName, fval);
            }
            if (fldName.indexOf("axpcurrencydec") != -1) {
                UpdateAxpCurrDec(fval, "GetDep");
            }
        }
    }
}

function AssignfldvalPerf(fldName, fval) {
    if (fval != "MessageSetAxFont") {
        var datatype = "";
        var fName = GetFieldsName(fldName);
        var fRowNo = GetFieldsRowNo(fldName);
        var dcNo = GetFieldsDcNo(fldName);
        var fldDbRow = GetDbRowNo(fRowNo, dcNo);
        if (TstructHasPop) {
            if (IsParentField(fName, dcNo)) {
                UpdatePopUpParents(fldName);
            }
        }
        // fix for datetype field returning 0
        var decNo = 0;
        for (var z = 0; z < FNames.length; z++) {

            if (FNames[z] == fName) {
                if (FCustDecimal[z] == "True" && typeof gloAxDecimal != "undefined" && gloAxDecimal > -1)
                    decNo = gloAxDecimal;
                else
                    decNo = FDecimal[z];
                datatype = FDataType[z];
                break;
            }
        }
        if (datatype.toLowerCase() == "numeric") {

            fval = fixit(fval, decNo);
            UpdateFieldArray(fldName, fldDbRow, fval, "parent", "");
            fval = CommaFormatted(fixit(fval, decNo));
            CallSetFieldValue(fldName, fval);
        }
        else if (datatype == "Date/Time") {
            if (fval == 0)
                fval = "";
            UpdateFieldArray(fldName, fldDbRow, fval, "parent", "");
            CallSetFieldValue(fldName, fval);
        }
        else {
            //convert the value to string if the field type is character(by default it is taking it as numeric value)
            if (datatype.toLowerCase() == "character")
                fval = fval.toString();
            UpdateFieldArray(fldName, fldDbRow, fval, "parent", "");
            CallSetFieldValue(fldName, fval);
        }

        if (fName.indexOf("axpvalid") != -1) {
            DoFormControlPrivilege(fldName, fval);
        }
        if (fldName.indexOf("axpcurrencydec") != -1) {
            UpdateAxpCurrDec(fval, "GetDep");
        }
    }
}

//Function to call file upload action.
function CallFileUploadAction(actionName, Title, ftype, confirmmsg) {

    if (confirmmsg && confirmmsg != "") {
        var glType = eval(callParent('gllangType'));
        var isRTL = false;
        if (glType == "ar")
            isRTL = true;
        else
            isRTL = false;
        var CallFileUploadActionCB = $.confirm({
            theme: 'modern',
            title: eval(callParent('lcm[155]')),
            onContentReady: function () {
                disableBackDrop('bind');
            },
            backgroundDismiss: 'false',
            rtl: isRTL,
            escapeKey: 'buttonB',
            content: confirmmsg,
            buttons: {
                buttonA: {
                    text: eval(callParent('lcm[164]')),
                    btnClass: 'btn btn-primary',
                    action: function () {
                        CallFileUploadActionCB.close();
                        CallFileUploadActionAfterConfirm();
                    }
                },
                buttonB: {
                    text: eval(callParent('lcm[192]')),
                    btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                    action: function () {
                        disableBackDrop('destroy');
                        return;
                    }
                }
            }
        });
    }



    function CallFileUploadActionAfterConfirm() {
        Title = "File Upload";

        gActionname = actionName;
        gConfirmmsg = confirmmsg;
        displayBootstrapModalDialog("File Upload", "xs", "147px", true, "./fileupload.aspx?act=upload");
    }
    if (CallFileUploadActionCB === undefined) {
        CallFileUploadActionAfterConfirm();
    }
}

//Function which executes after the file upload.
function CallAfterFileUploadAction() {

    var updFilename = $j("#cb_sactbu").val();
    CallAction(gActionname, updFilename, gConfirmmsg);
}

function GetCancelRemarks(actionName, fileup, manRemarks, dsignaction, isScript) {
    ShowPrompt(actionName, fileup, manRemarks, true, dsignaction, isScript);
}

function ShowPrompt(actionName, fileup, manRemarks, isRemarksEntered, dsignaction, isScript) {
    var msgStatus = true;
    var i = 0;
    try {
        var AxHeader = AxBeforeShowPrompt();
    }
    catch (ex) {
        actionCallbackFlag = actionCallFlag;
        $("#icons,#btnSaveTst,.BottomToolbarBar a,.wizardNextPrevWrapper").css({ "pointer-events": "auto" });
    }
    var cutMsg = eval(callParent('lcm[38]'));
    var cutMsgEnter = eval(callParent('lcm[39]'));
    var cutMsgChar = eval(callParent('lcm[40]'));
    var titleHead=typeof AxHeader =="undefined" ? cutMsgEnter : AxHeader;
    let CancelTransaction = $.confirm({
        theme: 'modern',
        title: titleHead,
        animation: 'scale',
        closeAnimation: 'scale',
        animateFromElement: false,
        //backgroundDismiss: 'cancel',
        columnClass:'medium',
        escapeKey: 'cancel',
        content: '' +
        '<form action="" class="formName">' +
        '<div class="form-group">' +
        '<label></label>' +
        '<textarea type="text" placeholder="'+titleHead+'" class="remarksCancel form-control" required ></textarea>' +
        '</div>' +
        '</form>',
        buttons: {
            formSubmit: {
                text: eval(callParent('lcm[392]')),
                btnClass: 'btn btn-primary',
                action: function () {                   
                    var name = this.$content.find('.remarksCancel').val();
                    if(!name){
                        $.alert(titleHead+' is mandatory.');
                        return false;
                    }else{
                        CallActionExt(actionName, fileup, name, dsignaction, isScript);
                    }
                }
            },
            cancel: {
                text: eval(callParent('lcm[192]')),
                btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                action: function () {
                    actionCallbackFlag = actionCallFlag;
                    $("#icons,#btnSaveTst,.BottomToolbarBar a,.wizardNextPrevWrapper").css({ "pointer-events": "auto" });
                    EnableToolBarBtns();
                    disableBackDrop('destroy');
                }
            },
        },
        onContentReady: function () {
            disableBackDrop('bind');
            //to display tooltips for Confirm & Cancel buttons
            $(".jconfirm-buttons button").each(function () {
                var txt = $(this).text();
                $(this).prop('title', txt.charAt(0).toUpperCase() + txt.slice(1))
            });
            $(".jconfirm-buttons .btn-primary").focus(); //to focus on Confirm button once dialog is opened

            // bind to events
            var jc = this;
            this.$content.find('form').on('submit', function (e) {
                // if the user submits the form by pressing enter in the field.
                e.preventDefault();
                jc.$$formSubmit.trigger('click'); // reference the button and click it
            });
        }
    });

    ShowDimmer(false);
}

function EnableToolBarBtns() {
    if ($j("#icons").length > 0 && $j("#icons").prop("disabled"))
        $j("#icons").prop("disabled", false);
}

function CheckDisabledActionBtn(actionName) {

    var isBtnDisabled = false;
    //$j(".action,.AxpTstBtn").each(function() {
    $j(".action").each(function () {
        var actFunction = $j(this).html().toLowerCase();
        var idx = actFunction.substring(actFunction.indexOf("callaction") + 11).indexOf("&quot;" + actionName + "&quot;");
        if (idx == -1)
            idx = actFunction.substring(actFunction.indexOf("callaction") + 11).indexOf('"' + actionName + '"');
        if (idx != -1 && $j(this).attr("disabled") == "disabled") {
            isBtnDisabled = true;
            return false;
        }
    });
    return isBtnDisabled;
}

//Function to call action webservice. 
function CallAction(actionName, fileup, confirmmsg, remarks, manRemarks, dsignaction, isScript) {
    if (actionCallFlag == actionCallbackFlag) {
        actionCallFlag = Math.random();
        $("#icons,#btnSaveTst,.BottomToolbarBar a").css({ "pointer-events": "auto" });
    } else {
        //showAlertDialog("error", 2023, "client");
        $("#icons,#btnSaveTst,.BottomToolbarBar a").css({ "pointer-events": "none" });
        return;
    }
    try{
        clickedButtonCaption=this.event.currentTarget.text;
    }catch(ex){}
    $j("#hdnActionName").val(actionName);
    if (dsignaction == undefined)
        dsignaction = '';
    AxActiveAction = actionName;


    if (CheckDisabledActionBtn(actionName) || AxIsTstructLocked) {
        actionCallbackFlag = actionCallFlag;
        $("#icons,#btnSaveTst,.BottomToolbarBar a,.wizardNextPrevWrapper").css({ "pointer-events": "auto" });
        return;
    }
    ShowDimmer(true);
    if (currentCK != "") {
        ShowdivContentCK($("#" + currentCK), false);
    }
    var proceed = true;
    try {
        proceed = AxBeforeCallAction(actionName);
    }
    catch (ex) {
    }
    if (proceed == undefined)
        proceed = true;

    if (proceed) {
        try {
            let actInd=$j.inArray(actionName, tstActionName);
            if (typeof actSaveTask != "undefined" && actSaveTask[actInd] == "save") {
                if (AxRulesDefComputescript == "true")
                    AxRulesDefParser("compute script onsave", "", "computescript");
                if (AxRulesDefValidation == "true") {
                    if (!AxRulesDefParser("validate onsave", "", "validate")) {
                        ShowDimmer(false);
                        AxWaitCursor(false);
                        actionCallbackFlag = actionCallFlag;
                        $("#icons,#btnSaveTst,.BottomToolbarBar a,.wizardNextPrevWrapper").css({ "pointer-events": "auto" });
                        GetProcessTime();
                        GetTotalElapsTime();
                        return;
                    }
                }
                if (AxRulesDefAllowdup == "true")
                    AxRulesDefParser("allowduplicate", "", "allowduplicate");

                if (!ValidateBeforeSubmit()) {
                    ShowDimmer(false);
                    AxWaitCursor(false);
                    actionCallbackFlag = actionCallFlag;
                    $("#icons,#btnSaveTst,.BottomToolbarBar a,.wizardNextPrevWrapper").css({ "pointer-events": "auto" });
                    GetProcessTime();
                    GetTotalElapsTime();
                    return;
                }
            }

            if(actInd > -1 && typeof actScriptTask != "undefined" && (actScriptTask[actInd].startsWith("doformdesign♠"))) {
                var formDesignParams = JSON.parse(EvaluateDirectScript(actScriptTask[actInd].split("♠")[1]).replace(/(^"|"$)/g, ''));
  
                try {
                    callAxpertConfigStudio('designform',formDesignParams[0],(formDesignParams[1] || ""));
                } catch (ex) {}

                EnableToolBarBtns();
                actionCallbackFlag = actionCallFlag;
                ShowDimmer(false);
                AxWaitCursor(false);
                $("#icons,#btnSaveTst,.BottomToolbarBar a,.wizardNextPrevWrapper").css({ "pointer-events": "auto" });

                return;
            }
            else if (actInd > -1 && typeof actScriptTask != "undefined" && (actScriptTask[actInd].startsWith("loadform♠") || actScriptTask[actInd].startsWith("loadformanddata♠") || actScriptTask[actInd].startsWith("loadiview♠") || actScriptTask[actInd].startsWith("loadpage♠") || actScriptTask[actInd].startsWith("openpage♠"))) {
                let scriptTaskNode = actScriptTask[actInd];
                scriptTaskNode = scriptTaskNode.split("♠")[1];
                EvaluateScriptFormControl(scriptTaskNode);

                EnableToolBarBtns();
                actionCallbackFlag = actionCallFlag;
                ShowDimmer(false);
                AxWaitCursor(false);
                $("#icons,#btnSaveTst,.BottomToolbarBar a,.wizardNextPrevWrapper").css({ "pointer-events": "auto" });

                return;
            }
            let fcScriptInd = $j.inArray(actionName, SFCActionName);
            if (fcScriptInd>-1 && typeof SFormControls != "undefined" && typeof SFormControls[fcScriptInd] != "undefined" && (SFormControls[fcScriptInd].toLowerCase().startsWith("loadform(") || SFormControls[fcScriptInd].toLowerCase().startsWith("loadformanddata(") || SFormControls[fcScriptInd].toLowerCase().startsWith("loadiview(") || SFormControls[fcScriptInd].toLowerCase().startsWith("loadpage(") || SFormControls[fcScriptInd].toLowerCase().startsWith("openpage("))) {
                EvaluateScriptFormControl(SFormControls[fcScriptInd]);

                EnableToolBarBtns();
                actionCallbackFlag = actionCallFlag;
                ShowDimmer(false);
                AxWaitCursor(false);
                $("#icons,#btnSaveTst,.BottomToolbarBar a,.wizardNextPrevWrapper").css({ "pointer-events": "auto" });

                return;
            }

            if (actInd > -1 && typeof actScriptCancel != "undefined" && (actScriptCancel[actInd].startsWith("canceltransaction♠"))) {
                if (AxRulesDefComputescript == "true")
                    AxRulesDefParser("compute script oncancel", "", "computescript");
                if (AxRulesDefValidation == "true") {
                    if (!AxRulesDefParser("validate oncancel", "", "validate")) {
                        ShowDimmer(false);
                        AxWaitCursor(false);
                        actionCallbackFlag = actionCallFlag;
                        $("#icons,#btnSaveTst,.BottomToolbarBar a,.wizardNextPrevWrapper").css({ "pointer-events": "auto" });
                        GetProcessTime();
                        GetTotalElapsTime();
                        return;
                    }
                }
                let scriptRemark = EvaluateDirectScript(actScriptCancel[actInd].split("♠")[1]);
                if (scriptRemark != "" && (scriptRemark.toLowerCase() == "y" || scriptRemark.toLowerCase() == "t"))
                    remarks = "y";
            }
        }catch(ex){}

        if (remarks == "y") {
            var rid = $j("#recordid000F0").val();
            if (rid == "0") {
                showAlertDialog("warning", 2009, "client");
                actionCallbackFlag = actionCallFlag;
                $("#icons,#btnSaveTst,.BottomToolbarBar a,.wizardNextPrevWrapper").css({ "pointer-events": "auto" });
                ShowDimmer(false);
                return;
            }
            if (tstructCancelled.toLowerCase() == "cancelled") {
                showAlertDialog("error", 2024, "client");
                actionCallbackFlag = actionCallFlag;
                $("#icons,#btnSaveTst,.BottomToolbarBar a,.wizardNextPrevWrapper").css({ "pointer-events": "auto" });
                ShowDimmer(false);
                return;
            }
            if (!AxAllowCancel) {
                actionCallbackFlag = actionCallFlag;
                $("#icons,#btnSaveTst,.BottomToolbarBar a,.wizardNextPrevWrapper").css({ "pointer-events": "auto" });
                ShowDimmer(false);
                return showAlertDialog("error", 2025, "client");
            }
        }
        if ($j("#icons").length > 0 && $j("#icons").prop("disabled")) {
            actionCallbackFlag = actionCallFlag;
            $("#icons,#btnSaveTst,.BottomToolbarBar a,.wizardNextPrevWrapper").css({ "pointer-events": "auto" });
            return;
        }
        if ($j("#icons").length > 0)
            $j("#icons").prop("disabled", true);

        if (confirmmsg == undefined) confirmmsg = "";
        if ((confirmmsg != "") && (!confrm)) {

            if (!confirm(confirmmsg)) {
                EnableToolBarBtns();
                actionCallbackFlag = actionCallFlag;
                ShowDimmer(false);
                AxWaitCursor(false);
                $("#icons,#btnSaveTst,.BottomToolbarBar a,.wizardNextPrevWrapper").css({ "pointer-events": "auto" });
                return;
            }
        }

        if (remarks == "y") {
            //if remarks entered by user and clicked on ok then call w/s else return
            GetCancelRemarks(actionName, fileup, manRemarks, dsignaction, isScript);
            ShowDimmer(false);
        }
        else {
            CallActionExt(actionName, fileup, '', dsignaction, isScript);
        }
    }
}

function CallActionExt(actionName, fileup, remarks, dsignaction, isScript,ruleScriptCall=false) {
    GetCurrentTime("Tstruct load on Action button click(ws call)");
    var rid = $j("#recordid000F0").val();
    ArrActionLog = "CallAction-" + actionName + "Recordid-" + rid;

    AxWaitCursor(true);
    var fup = "";
    if ((fileup != "") && (fileup != undefined)) {

        if (fileup.substring(0, 1) == ":") {

            var uploadFieldname = ""; var uploadFieldVal = "";
            // for fileupload with fieldname as param
            var fupfld = fileup.substring(1, fileup.length);
            var isgridfld = IsGridField(fupfld);
            if (isgridfld == true) {
                var rownum = "";
            }
            else {

                uploadFieldname = fupfld + "000F0";
                uploadFieldVal = $j("#" + uploadFieldname).val();
                fup = uploadFieldVal;
            }
        }
        else {
            fup = fileup.toString();
        }
    }


    var tid = transid;
    var txt = '';
    var tem = 1;
    var rid = $j("#recordid000F0").val();
    var startIndex;
    var actionId; var dcNo = 0; var activerow = 0; var fullFldName = actionName;
    if (actionName.indexOf("_") != -1) {
        //if (actionName.indexOf("onfocus") != -1) {


        if ($j.inArray(GetFieldsName(actionName), FNames) != -1) {
            startIndex = actionName.lastIndexOf("_");
            actionName = actionName.substring(startIndex + 1);
        }

        if (actionName.indexOf("F") != -1) {

            activerow = parseInt(GetActiveRow(fullFldName), 10) + 1;
            var fIndx = actionName.lastIndexOf("F");
            dcNo = parseInt(actionName.toString().substring(fIndx + 1));
            actionName = actionName.substring(0, fIndx - 3);
        }
        // }
    }
    // for all else condion defualt value of 0 will go.


    var trace = traceSplitStr + "Action-" + actionName + traceSplitChar;
    var fileName = "";
    if (fup != "") {

        fileName = fup;
        var index = fileName.lastIndexOf('\\');
        if (index != -1) {
            fileName = fileName.substring(index + 1);
        }
    }
    var visDcname = GetOpenTabDcs();
    var files = UploadFiles();
    var delRows = GetDeletedRows();
    var chngRows = GetChangedRows();
    var remStr = "";
    if (remarks != undefined) {
        remarks = CheckSpecialCharsInXml(remarks);
        remStr = '<cancelremarks>' + remarks + '</cancelremarks>';
    }
    txt = txt + '<root axpapp="' + proj + '" trace="' + trace + '" recordid="' + rid + '"  fno="' + dcNo + '" afiles="' + (typeof headerAttachDir != "undefined" && headerAttachDir.toLowerCase() == "true" ? '' : files) + '"  dcname="' + visDcname + '" actrow="' + activerow + '" sessionid="' + sid + '"  stype="tstructs" sname="' + tid + '" actname="' + actionName + '" __file="' + fileName + '" options="true" dsignstatus="' + dsignaction + '">' + remStr + '<varlist><row>';

    if (typeof isScript == 'undefined')
        isScript = false;

    if (typeof ruleScriptCall == 'undefined')
        ruleScriptCall = false;

    try {
        let axrulesFlds = "";
        if (AxRulesFlds.length > 0) {
            axrulesFlds = AxRulesFlds.join("♥");
        }
        if (isScript == false || isScript == "false")
            axrulesFlds = "";
        callBackFunDtls = "CallActionExt♠" + actionName + "♠" + fileup + "♠" + remarks + "♠" + dsignaction;
        GetProcessTime();
        ASB.WebService.CallActionWS(ChangedFields, ChangedFieldDbRowNo, ChangedFieldValues, DeletedDCRows, DeletedFieldValue, ArrActionLog, visDcname, txt, fup, "t", delRows, chngRows, tstDataId, files, isScript, axrulesFlds, ruleScriptCall, SuccessCallbackAction, OnException);
    }
    catch (exp) {
        actionCallbackFlag = actionCallFlag;
        $("#icons,#btnSaveTst,.BottomToolbarBar a,.wizardNextPrevWrapper").css({ "pointer-events": "auto" });
        AxWaitCursor(false);
        var execMess = exp.name + "^♠^" + exp.message;
        showAlertDialog("error", 2030, "client", execMess);
        UpdateExceptionMessageInET("ActionWS exception : "+exp.message);
        GetProcessTime();
        GetTotalElapsTime();
    }
}


//callback function from the callaction webservice.
function SuccessCallbackAction(result, eventArgs) {
    if (result != "") {
        if (result.split("*♠*").length > 1) {
            var serverprocesstime = result.split("*♠*")[0];
            var requestProcess_logtime = result.split("*♠*")[1];
            result = result.split("*♠*")[2];
            WireElapsTime(serverprocesstime, requestProcess_logtime);
        } else {
            UpdateExceptionMessageInET("Error : " + result);
        }
    }

    if (result!=""){// && result.toLowerCase().indexOf("access violation") === -1) {
        actionCallbackFlag = actionCallFlag;
        $("#icons,#btnSaveTst,.BottomToolbarBar a,.wizardNextPrevWrapper").css({ "pointer-events": "auto" });
        ArrActionLog = "";
        if (CheckSessionTimeout(result)) {
            return;
        }
        var clrCacheKeys = result.split("*#*")[1];
        if (typeof clrCacheKeys != "undefined" && clrCacheKeys != "") {
            console.log("Clearing cache in action");
            ClearRedisKeys(clrCacheKeys);
        }
        if (result.indexOf("*#*") > -1)
            result = result.substring(0, result.indexOf("*#*"));

        ChangedFields.length = 0;
        ChangedFieldDbRowNo.length = 0;
        ChangedFieldValues.length = 0;
        DeletedDCRows.length = 0;
        DeletedFieldValue.length = 0;
        EnableToolBarBtns();
        //AxRulesFlds = new Array();

        try {
            var AfterAction = AxAftertstCallAction(result);
            // result = AxModifyActionResult(result);
            if (AfterAction) {
                SetFormDirty(false);
                AxWaitCursor(false);
                ShowDimmer(false);
                return;
            }
        }
        catch (ex) {

        }
        ParseServiceResult(result, "Action");
        try {
            AxAfterCallAction();
        }
        catch (ex) {

        }

        if (AxActionSave == true && parent.axMainPageReload == transid)// TO Reload mainnew page for cloud application.
        {
            parent.doPageUnload = "false";
            parent.window.location.href = "../aspx/mainnew.aspx";
        }
        SetFormDirty(false);
        AxWaitCursor(false);
        ShowDimmer(false);
        //if(AxActionSave)
        //{
        //    //ShowDimmer(true);
        //    disableBtnBeforeReload();
        //}
    }
    else {
        if(window.document.location.href.indexOf("tstruct.aspx")>-1)
        {     
            DataReloadDuringActionError();
        }else{
            $("#dvlayout").hide();
            AxWaitCursor(false);
            ShowDimmer(false);
            $("#reloaddiv").show();
        }
    }
}

function DataReloadDuringActionError(errorMsg="")
{    
    if(typeof clickedButtonCaption=="undefined" || clickedButtonCaption=="")
        clickedButtonCaption="Task";
    var glType = eval(callParent('gllangType'));
    var isRTL = false;
    if (glType == "ar")
        isRTL = true;
    else
        isRTL = false;
    var CallAvActionCB = $.confirm({
        closeIcon: false,
        title: eval(callParent('lcm[155]')),
        rtl: isRTL,
        onContentReady: function () {
            disableBackDrop('bind');
        },
        content: errorMsg==""?clickedButtonCaption +" not completed due to an unexpected error.":clickedButtonCaption +" not completed due to "+errorMsg,
        buttons: {
            buttonA: {
                text: "Retry",
                btnClass: 'hotbtn',
                action: function () {                        
                    CallAvActionCB.close();
                    clickedButtonCaption="";
                    actionCallbackFlag = actionCallFlag;
                    $("#icons,#btnSaveTst,.BottomToolbarBar a,.wizardNextPrevWrapper").css({ "pointer-events": "auto" });
                    ArrActionLog = "";
                    AxWaitCursor(false);
                    ShowDimmer(false);
                }
            },
            buttonB: {
                text: "Abort",
                btnClass: 'coldbtn',
                action: function () {
                    clickedButtonCaption="";
                    window.location.href = window.location.href;
                }
            }
        }
    });
}

function EvaluateRapidExpressions(rapidExprFlds) {
    var expFlds = rapidExprFlds.split(',');
    var expFldName; var depFldName = ""; var i = 0;
    for (i = 0; i < expFlds.length; i++) {
        EvaluateAxFunction(GetFieldsName(expFlds[i]), expFlds[i]);
    }
}


var AxFormLoadSkipped = false;
//Function which fills the values from result json into the fields.
function AssignLoadValues(resultJson, calledFrom, actnName, navigationURL) {
    actnName = typeof actnName != "undefined" ? actnName : "";
    if (resultJson == "This proces taking time is more than expected. You will get a notification once completed") {
        showAlertDialog("info", appGlobalVarsObject.lcm[491]);
        return;
    }
    var resval = resultJson.split("*$*");
    for (var ind = 0; ind < resval.length; ind++) {

        if (resval[ind] == "FDCache") {
            AxFormLoadSkipped = true;
            continue;
        }

        //TODO:We need to Review the below line.
        var strSingleLineText = resval[ind].toString().replace(new RegExp("\\n", "g"), "");
        strSingleLineText = strSingleLineText.replace(new RegExp("\\t", "g"), "&#9;");
        strSingleLineText = strSingleLineText.replace(/\\/g, ";bkslh");

        //Adding this line of code for <script></script>
        strSingleLineText = strSingleLineText.replace(new RegExp("&lt", "g"), "<");
        strSingleLineText = strSingleLineText.replace(new RegExp("&gt", "g"), ">");
        if (strSingleLineText == "")
            continue;
        try {
            var myJSONObject = $j.parseJSON(strSingleLineText);
        }
        catch (ex) {
            continue;
        }

        if (myJSONObject.error) {
            ExecErrorMsg(myJSONObject.error, calledFrom);
        }
        else if (myJSONObject.data && calledFrom != "Iview") {
            //Note : If the data node is returned by action from iview, then it gives error hence above condition
            ExecData(myJSONObject.data, calledFrom);
        }
        else if (myJSONObject.evalexpr) {
            //{\"EvalExpr\":\"true\", \"flds\":\"" + rapidFormLoadExpFlds + "\"}            
            EvaluateRapidExpressions(myJSONObject.flds);
        }
        else if (myJSONObject.fastdata) {
            ExecData(myJSONObject.fastdata, calledFrom);
        }
        else if (myJSONObject.pickdata) {
            ExecPickData(myJSONObject.pickdata, calledFrom);
        }
        else if (myJSONObject.command) {
            ExecCommand(myJSONObject.command, actnName, navigationURL);
            if (typeof isCopyTrans != "undefined" && isCopyTrans) {
                try {
                    let _CopytrData = resval[0].toString().replace(new RegExp("\\n", "g"), "");
                    _CopytrData = _CopytrData.replace(new RegExp("\\t", "g"), "&#9;");
                    _CopytrData = _CopytrData.replace(/\\/g, ";bkslh");
                    TstCopyTransRes = _CopytrData;
                    if (window.opener)
                        GetCloneFormLoadData("AxIsPop=true");
                    else
                        GetCloneFormLoadData("");
                } catch (ex) { }
            }
        }
        else if (myJSONObject.formcontrol) {
            try {

                ExecFormControl(myJSONObject.formcontrol, calledFrom);
            }
            catch (ex) {
                console.log(ex.message);
            }
        }
        else if (myJSONObject.message) {
            if (typeof pickListRowCount == "undefined" || pickListRowCount > 0 || pickListRowCount == -1) {
                if (iViewRefresh != true)
                    ExecMessage(myJSONObject.message, calledFrom);
                else
                    eval(callParent('ivCmdRefresh') + "= '" + myJSONObject.message[0].msg + "'");
            }
        }
        else if (myJSONObject.wfnode) {
            if (typeof tstructCancelled != "undefined") {
                if (tstructCancelled.toLowerCase() != "cancelled")
                    ExecWorkflow(myJSONObject.wfnode);
            }
        }
        else if (myJSONObject.attachment && calledFrom != "Iview" && document.title.toLowerCase() != "iview") {
            ExecAttachments(myJSONObject.attachment);
        }
        else if (myJSONObject.memvar) {
            ExecMemVars(myJSONObject.memvar, calledFrom);
        }
        else if (myJSONObject.timetaken) {
            ExecTimetaken(myJSONObject.timetaken);
        }
        else if(myJSONObject.result && calledFrom != "Iview" && document.title.toLowerCase() != "iview")
        {
            if(myJSONObject.result[0].action){
                let erMsg="";
                try{
                    var resvalRetry = resultJson.split("*$*");
                    for (var indR = 0; indR < resvalRetry.length; indR++) {
                        var strSingleLineTextRetry = resvalRetry[indR].toString().replace(new RegExp("\\n", "g"), "");
                        strSingleLineTextRetry = strSingleLineTextRetry.replace(new RegExp("\\t", "g"), "&#9;");
                        strSingleLineTextRetry = strSingleLineTextRetry.replace(/\\/g, ";bkslh");
                        var myJSONObjectRetry="";
                        if (strSingleLineTextRetry != ""){
                            try {
                                myJSONObjectRetry = $j.parseJSON(strSingleLineTextRetry);
                            }
                            catch (ex) {
                            }
                        }
                        if (myJSONObjectRetry!="" && myJSONObjectRetry.error) {
                            erMsg=myJSONObjectRetry.error[0].msg;
                        }
                    }
                }catch(ex){}
                DataReloadDuringActionError(erMsg);
                break;
            }
        }
        else if (myJSONObject.rowrefresh && myJSONObject.rowrefresh == "true" && myJSONObject.row && document.title.toLowerCase() == "iview") {
            ExecRefreshIviewRows(myJSONObject.row);
        }
        else if (resultJson.indexOf("dsignresult") > -1) {
            if (myJSONObject.dsignresult) {
                Execdsignresult(myJSONObject.dsignresult);
                break;
            }
            else {
                continue;
            }
        }
        else if (resultJson.indexOf("dsignmsg") > -1) {
            if (myJSONObject.dsignmsg) {
                ExecDsignMsg(myJSONObject.dsignmsg);
                break;
            }
            else {
                continue;
            }
        }
        else if (myJSONObject.axpeg) {
            if (myJSONObject.axpeg[0].readonlytrans == 'true')
                ReadonlyformPeg();
        }

        if ((typeof (GridDispHead) != "undefined") && GridDispHead) {
            if (grDisObj != undefined)
                displayGfirstcol(grDisObj, grDisname);
            grDisObj = "";
            grDisname = "";
        }
    }


    try {
        AxAfterFormLoad(calledFrom);
    }
    catch (ex) { }

    AxWaitCursor(false);
    if (!WrkflFlag)
        ShowDimmer(false);
    myJSONObject = null;
}

function AssignWsPerfExprValues(calledFrom) {
    if (typeof formParamFlds != "undefined" && formParamFlds != "") {
        var fldCount = 0;
        formParamFlds.forEach(function (currField) {
            if (currField != "" && currField != "transid") {
                GetActualFieldName(currField).split(',').forEach(function (currFieldID) {
                    if (currFieldID != "") {
                        try {
                            var exFldVale = ReplaceUrlSpecialChars(formParamVals[fldCount]);
                            SetFieldValue(currFieldID, exFldVale);
                            var fieldRowNo = GetFieldsRowNo(currFieldID);
                            var fldDcNo = GetFieldsDcNo(currFieldID);
                            var fldDbRowNo = GetDbRowNo(fieldRowNo, fldDcNo);
                            UpdateFieldArray(currFieldID, fldDbRowNo, exFldVale, "parent");
                        }
                        catch (ex) { }
                    }
                });
            }
            fldCount++;
        });
    }
    if (typeof wsPerfEvalExpClient != "undefined" && wsPerfEvalExpClient != "") {
        wsPerfEvalExpClient.forEach(function (currField) {
            if (currField != "") {
                GetActualFieldName(currField).split(',').forEach(function (currFieldID) {
                    if (currFieldID != "") {
                        EvaluateAxFunction(currField, currFieldID);
                    }
                });
            }
        });
    }
}

//Function to assign the 'Load Values' for Design Mode
function AssignLoadValuesDesignMode(resultJson, calledFrom) {

    var resval = resultJson.split("*$*");
    for (var ind = 0; ind < resval.length; ind++) {

        var strSingleLineText = resval[ind].toString().replace(new RegExp("\\n", "g"), "");
        strSingleLineText = strSingleLineText.replace(new RegExp("\\t", "g"), "&#9;");
        strSingleLineText = strSingleLineText.replace(/\\/g, ";bkslh");
        if (strSingleLineText == "")
            continue;
        try {
            var myJSONObject = $j.parseJSON(strSingleLineText);
        }
        catch (ex) {
            continue;
        }

        //Only the Form Control values has to be assigned for Design Mode
        if (myJSONObject.formcontrol) {
            try {
                ExecFormControlDesignMode(myJSONObject.formcontrol, calledFrom);
            }
            catch (ex) {
                console.log(ex.message);
            }
        }
        myJSONObject = null;
    }
}

//function for digitial signature starts
//function to parse dsignobject if record already sent for digital signature
function Execdsignresult(dsignresult) {
    var documentname = "";
    var users = "";
    for (var i = 0; i < dsignresult.length; i++) {
        documentname = documentname + "," + dsignresult[i].docname;
        users = users + "," + dsignresult[i].docuser;
    }
    dsignconfirmation(documentname, users);
}

function dsignconfirmation(documentname, users) {
    var cutMsg = eval(callParent('lcm[41]'));
    var cutMsgWd = eval(callParent('lcm[42]'));
    var cutMsgOw = eval(callParent('lcm[43]'));
    var msg = "Document(" + documentname + ") " + cutMsg + "</br>";
    msg += "now pending with " + users + "  </br>";
    msg += "<a onclick='CallActionForDsign(\"withdraw\");'>" + cutMsgWd + "</br></br></a>";
    msg += "<a onclick='CallActionForDsign(\"overwrite\");'>" + cutMsgOw + "</br></a>";
    $j.msgBox({ content: msg, type: "info" }, 100);
}

function CallActionForDsign(type) {
    var actionName = $j("#hdnActionName").val();
    CallAction(actionName, '', '', '', '', type);
}

function ExecDsignMsg(dsignmsg) {
    showAlertDialog("info", dsignmsg.msg);
}
//function for digitial signature ends



///Function to parse the timetaken node for logging the timetaken.
function ExecTimetaken(timetakenNode) {
    ASBDbTime = "";
    ASBTotal = "";

    for (var i = 0; i < timetakenNode.length; i++) {
        if (timetakenNode[i].total) {
            ASBTotal = timetakenNode[i].total;
        }
        if (timetakenNode[i].dbtime) {
            ASBDbTime = timetakenNode[i].dbtime;
        }
    }
}

function ExecRefreshIviewRows(rowData) {
    var refreshRowData = {
        apply() {
            if (ivirDataTableApi) {
                if (_this.getRows().length == _this.rowData.length) {
                    _this.rows.forEach((rowno, ind) => {
                        var selectedRow = parseInt(rowno || "1");
                        ivDatas[selectedRow - 1] = _this.rowData[ind];
                        ivDatas[selectedRow - 1][getPropertyAccess("rowno")] = selectedRow.toString();
                        refreshRow(ivirDataTableApi.row(selectedRow - 1), ivDatas[selectedRow - 1]);
                    });
                }
            }
        },
        getRows() {
            _this.rows = $j("#hdnSRows").val().split("♣").filter((val) => val);
            if (_this.rows.length == 0) {
                _this.rows = ["1"];
            }
            switch (_this.getActionEvent()) {
                case "Current Row":
                case "":
                    _this.rows = [_this.rows[0]];
                    break;
                case "Each Selected Rows":
                    _this.rows = [_this.rows[_this.rows.length - 1]];
                    break;
                case "All Selected Rows":
                default:
                    break;
                case "All Rows":
                    _this.rows = ivDatas.map((val) => val[getPropertyAccess("rowno")])
                    break;
            }
            return _this.rows;
        },
        getActionEvent() {
            _this.event = ((eventObj = (ivActions[$j("#hdnAct").val().substr(4)] || ivScripts[$j("#hdnAct").val().substr(4)])) && eventObj["@apply"]) || "Current Row";
            return _this.event;
        },
        process(rowData) {
            _this = this;
            _this.rowData = rowData;
            _this.apply();
        }
    }.process(rowData);
}

function CheckSpCharsInFldValue(fldValue) {

    var index = fldValue.indexOf("^^dq");
    while (index != -1) {
        fldValue = fldValue.replace("^^dq", '"');
        index = fldValue.indexOf("^^dq");
    }
    if (fldValue.indexOf(";bkslh") != -1) {
        fldValue = fldValue.replace(new RegExp(";bkslh", "g"), "\\");
    }
    fldValue = fldValue.replace(new RegExp("<br>", "g"), "\n");
    return fldValue;
}

///Function to parse the mem vars and register them in the Global variables array.
function ExecMemVars(memVarJsonObj, calledFrom) {
    var varName = "";
    var varValue = "";
    for (var i = 0; i < memVarJsonObj.length; i++) {
        varName = "";
        varValue = "";
        if (memVarJsonObj[i].n) {
            varName = memVarJsonObj[i].n;
        }
        if (memVarJsonObj[i].v) {
            varValue = memVarJsonObj[i].v;
        }
        var idx = -1;
        for (var ind = 0; ind < Parameters.length; ind++) {
            var strParams = Parameters[ind].split("~");
            if (strParams[0].toString().toLowerCase() == varName.toLowerCase()) {
                idx = ind;
                break;
            }
        }
        if (idx != -1)
            Parameters[idx] = varName + "~" + varValue;
        else
            Parameters[Parameters.length] = varName + "~" + varValue;
    }
}

function ExecPickData(dataJsonObj, calledFrom) {
    var fldName = "";
    var rCnt = 0;
    var fldValue = "";
    var idUpdate = "no";
    for (var i = 0; i < dataJsonObj.length; i++) {
        if (dataJsonObj[i].rcount) {
            rCnt = dataJsonObj[i].rcount;
        }
        else if (dataJsonObj[i].idupdate) {
            idUpdate = dataJsonObj[i].idupdate;
        }
        else if (dataJsonObj[i].fname) {
            fldName = dataJsonObj[i].fname;
        }
        else if (dataJsonObj[i].fvalue) {
            fldValue = dataJsonObj[i].fvalue;
        }
    }

    if (idUpdate == "yes" && rCnt == "1" && fldName != "" && fldValue != "") {
        var fIndx = AxActDepFld.lastIndexOf("F");
        var tmpFldName = AxActDepFld.substring(0, fIndx - 3);
        var tmpRowNo = AxActDepFld.substring(fIndx - 3, fIndx);
        var tmpDcNo = AxActDepFld.substring(fIndx + 1);
        tmpRowNo = GetDbRowNo(tmpRowNo, tmpDcNo);
        //Hack: if the webservice returns multiple values for the record, then always take the first one.
        if (fldValue.indexOf("~") != -1) {
            var strItems = fldValue.split("~");
            fldValue = strItems[0];
        }
        fldValue = CheckSpCharsInFldValue(fldValue);
        fldValue = fldValue.replace("^", "¿");
        isPKItemSelected = true;
        if (tmpFldName == fldName) {
            UpdateFieldArray(AxActDepFld, tmpRowNo, fldValue, "parent");
            //Below code will update the proper value if improper case was entered by the user.
            //If the fld has sourcekey true, then value will contain id also, hence checking for "¿"
            var fldTextVal = fldValue;
            if (fldValue.indexOf("¿") != -1) {
                fldTextVal = fldValue.substring(fldValue.indexOf("¿") + 1);
            }
            if (GetFieldValue(AxActDepFld) != fldTextVal) {
                SetFieldValue(AxActDepFld, fldTextVal);
            }
        }
    }
    else {

        //fldValue = CheckSpCharsInFldValue(fldValue);
        //var pickDataArray = "";
        //if (fldName != "" && fldValue != "") {
        //    pickDataArray += rCnt + "♣";
        //    var pickFldValues = fldValue.split('~');
        //    for (var j = 0; j < pickFldValues.length; j++) {
        //        if (j == 0)
        //            pickDataArray += pickFldValues[j].toString();
        //        else
        //            pickDataArray += "¿" + pickFldValues[j].toString();
        //    }
        //}
        //AxFromAssociated = true;
        ////If the picklist field is a required field and on clearing the value, 
        ////if the service returns the message that the 'field cannot be left empty',then do not show the picklist
        ////Here if the field value is empty, do not show the picklist. 
        ////the same fix is there in mainfocus also.
        //if ($j("#" + AxActDepFld).val() == "" && AxActDepFldVal == "") {
        //    HidePLDiv(false);
        //}
        //else {
        //    $j("#hdnPickFldId").val("img~" + AxActDepFld);
        //    AxPickResult = pickDataArray;
        //    if (pickDataArray != "")
        //        currentPickList = AxActDepFld;
        //        SuccGetSearchResult(pickDataArray);
        //}
    }
}

//Code to clear the checklist which dint recieve any items from ASB in Get Dependents, and add a default disabled item
//Disabled item is added since all the field items are cleared the field will not be there in the document
//if on uncheck if the select all is checked then that should be unchecked
function ClearChecklistOnGetDep(comboFld) {
    var chkFldHint = ClearSqlChkList(comboFld);
    if (IsDcGrid(GetDcNo(GetFieldsName(comboFld)))) {
        var chkHtml = "<input type='checkbox' class='multiFldChk' id='" + comboFld + "' name='" + comboFld + "' title='" + chkFldHint + "' value='' disabled='disabled' style='display:none'> ";
        var chkSpanObj;
        $j(".multiChkSpan").each(function () {
            if ($j(this).attr("name") == comboFld) {
                chkSpanObj = $j(this);
                return false;
            }
        });
        var chkAllId = "#chkAll_" + comboFld;
        var chkAllObj = $j(chkAllId);
        if (chkAllObj.prop("checked")) {
            chkAllObj.removeAttr("checked");
            chkAllObj.prop("checked", false);
        }
        chkAllObj.attr("disabled", "disabled");

        chkSpanObj.append(chkHtml);
    }
}


function ExecData(dataJsonObj, calledFrom, isExcelImp = false) {

    FillGridFillRows = 0;
    FillGridCurrentDC = 0;
    var dcNo = "0"; var fldName = ""; var fldValue = ""; var fldType = ""; var fldDbRowNo = ""; var masterRow = 0; var delRows = "";
    var tmpActiveRow = "";
    var tmpActiveDc = "";
    var isDcFormatGrid = false;
    var formatGridIdx = -1;
    var dcKeyColumn = ""; var fName = "";
    var rid = $j("#recordid000F0").val();
    var axActiveDc = AxActiveDc;
    var prevFldType = "";
    var expDepArray = new Array();
    if (calledFrom == "GetDep" && IsDcGrid(AxActiveDc)) {
        var dcIdx = $j.inArray(AxActiveDc, DCFrameNo);
        expDepArray = DCExpDeps[dcIdx].toString().split(",");
    }
    //Varibles for storing the combo details.
    var comboFld = ""; var comboVal = ""; var comboRowNo = ""; var depFlds = ""; var idCol = "";
    var isPopGrid = false; var curRowNo = "";
    var dcOldHasData = ""; var dcOldRowCount = 0;
    var isChkCleared = false;
    for (var i = 0; i < dataJsonObj.length; i++) {

        fldName = dataJsonObj[i].n; fldValue = dataJsonObj[i].v; fldType = dataJsonObj[i].t; fldDbRowNo = dataJsonObj[i].r;
        masterRow = dataJsonObj[i].mr;

        fldValue = CheckSpCharsInFldValue(fldValue);

        if (dataJsonObj[i].idcol)
            idCol = dataJsonObj[i].idcol;

        if (dataJsonObj[i].cr)
            delRows = dataJsonObj[i].cr;
        else
            delRows = "";

        if (fldType == "dc") {

            var dcHasRows = "";
            dcHasRows = dataJsonObj[i].hasdatarows;
            dcNo = fldName.substring(2);
            var dcCaption = "";
            dcCaption = dataJsonObj[i].c;
            var fgName = "";
            if (dataJsonObj[i].fg)
                fgName = dataJsonObj[i].fg;
            else
                fgName = "";

            if (dcCaption != "")
                SetDcCaption(dcNo, dcCaption);

            formatGridIdx = GetFormatGridIndex(dcNo);
            if (formatGridIdx != -1) {
                isDcFormatGrid = true;
                dcKeyColumn = DcKeyColumns[formatGridIdx];
            }
            else {
                isDcFormatGrid = false;
                dcKeyColumn = "";
            }

            if (IsDcPopGrid(dcNo))
                isPopGrid = true;
            else
                isPopGrid = false;

            if (calledFrom == "GetDep" && isPopGrid && IsParentDc(axActiveDc)) {
                //Delete thr rows that were sent to the webservice from AxSubGridRows
                //The format is popdc1~row1,row2,row3¿popdc2~row1,row2
                DeletePopRowsAfterGetDep();
                AxSubWsRows = new Array();
                AxSubDsRows = new Array();
            }

            if (IsDcGrid(dcNo)) {
                var dcIdx = $j.inArray(dcNo, DCFrameNo);
                dcOldHasData = DCHasDataRows[dcIdx];
                if (dcHasRows != "") {
                    if (dcHasRows == "yes") {
                        DCHasDataRows[dcIdx] = "True";
                        if (dcOldHasData == "False")
                            delRows = "d*," + delRows;
                    }
                    else if (dcHasRows == "no") {//Refer Bug: AXP000122-- If service give hasdata=no this array needs to be updated with new value.
                        DCHasDataRows[dcIdx] = "False";
                    }
                }
            }

            if (IsDcGrid(dcNo) && IsDcVisible(dcNo)) {

                if (calledFrom == "LoadData") {
                    if (recordid != "0" && isDcFormatGrid)
                        continue;
                    UpdateDcRowArrays(dcNo, "001", "Add");
                }

                //This condition is if getdep sends new rows for fillgrid, and existing rows have to be deleted.
                //The same condition is also handled in JsonToArray in server side.
                var ind = 0;
                if (fgName == "")
                    ind = $j.inArray("dc" + dcNo, FillParamDCs);
                else
                    ind = $j.inArray(fgName, FillGridName);
                if (ind != -1 && delRows != "") {
                    var fillCond = FillCondition[ind];
                    if (fillCond == "INIT" || fillCond == "AOWE") {
                        if (delRows.indexOf("d*") == -1)
                            delRows = "d*," + delRows;
                        if ($("#gridHd" + dcNo + " tbody tr").length == 0 && calledFrom == "GetDep" && dcHasRows == "no")
                            delRows = "d*";
                    }
                    else if (fillCond == "APPEND") {
                        var existingRec = $("#gridHd" + dcNo + " tbody tr").length;
                        //if grid has existing rows for Fillgrid with APPEND prop then store record count in table 'data-fg-append-rec' prop
                        if (existingRec > 0)
                            $("#gridHd" + dcNo).data("fg-append-rec", existingRec);
                        else if (existingRec == 0 && calledFrom == "Action" && delRows.indexOf("d*") == -1) {
                            delRows = "d*," + delRows;
                            $("#gridHd" + dcNo).removeData("fg-append-rec");
                        }
                        else
                            $("#gridHd" + dcNo).removeData("fg-append-rec");
                    }
                }

                tmpActiveRow = AxActiveRowNo;
                tmpActiveDc = AxActiveDc;
                AxDepRows = new Array();
                if (calledFrom == "GetDep" && isPopGrid && IsParentDc(axActiveDc)) {
                    dcOldRowCount = GetDcRowCount(dcNo);
                    continue;
                }
                if (calledFrom != "CallAdd") {
                    SetRows(dcNo, fldValue, delRows, calledFrom, dcOldHasData, dcHasRows);
                    if (calledFrom == "LoadData")//On loaddat need to hide column which are hided in designmode. 
                        fillgridColOptVisibility(dcNo);
                }

                AxActiveRowNo = tmpActiveRow;
                AxActiveDc = tmpActiveDc;
            }
            if (dcHasRows == 'yes')
                SetHdnRowCount(dcNo, calledFrom);
        }
        else {
            // below condition is for autogenerated fields , and dependence of auto generated field// displayAutoGenVal
            if (rid == 0 && fldName != undefined) {
                //if ((fldName == AxAutoGenFld) || ($j.inArray(fldName, AxAutoGenDeps) != -1)) {
                if (fldName == AxAutoGenFld) {//Refer Bug: HEA000077, Should not set auto value to autogen dependency fields. 
                    //Autogenerate field value.
                    var hdnAutogenerateFld = $j("#hdnShowAutoGenFldValue").val();
                    if (hdnAutogenerateFld.toLowerCase() == "true") {

                    }
                    else {
                        fldValue = "Auto";
                    }
                }
            }

            //Refer Bug: HEA000052, service should give proper values for non grid expression fields as well.. 
            ////If the get dependents is called on a grid field, ignore the non grid expression dependent field returned by the service.
            //if (calledFrom == "GetDep" && IsDcGrid(AxActiveDc) && !IsDcPopGrid(dcNo)) {
            //    var idx = $j.inArray(fldName, expDepArray);
            //    if (idx != -1) {
            //        NonGridExpDepFlds.push(expDepArray[idx]);//To evaluate non grid expression dependent field returned by the service                   
            //        continue;
            //    }
            //}

            //Code to clear the checklist which dint recieve any items from ASB in Get Dependents, and add a default disabled item 
            //Disabled item is added since all the field items are cleared the field will not be there in teh document
            if (calledFrom == "GetDep" && (prevFldType == "cl" && fldType != "dv" && comboFld != "")) {
                ClearChecklistOnGetDep(comboFld);
                comboFld = "";
                comboVal = "";
            }

            if (fldType == "dv") {
                fldName = comboFld;
            }
            else {
                if (fldName.toLowerCase() == "axpcurrencydec")
                    UpdateAxpCurrDec(fldValue, calledFrom);


                if (calledFrom == "PopGridCombos" && AxPopRowNo != "")
                    fldDbRowNo = AxPopRowNo
                if (calledFrom == "GetDep" && IsDcPopGrid(dcNo) && IsParentDc(axActiveDc)) {
                    var wsRowNo = fldDbRowNo;
                    var sIdx = -1;

                    if (dcOldHasData == "True" || wsRowNo != "1") {
                        sIdx = $j.inArray(wsRowNo, AxSubWsRows);
                        fldDbRowNo = GetSubDsRowNo(fldDbRowNo, dcNo);
                    }
                    if (sIdx == -1) {
                        AxActiveDc = dcNo;
                        AddRowAfterGetDep(fldDbRowNo, dcNo, dcOldHasData);
                        curRowNo = fldDbRowNo;
                    }
                }
                if (dcNo == "0")
                    dcNo = GetDcNo(fldName);

                fillParamId = $j.inArray("dc" + dcNo, FillParamDCs);
                if (fillParamId != "-1") {
                    fillCond = FillCondition[fillParamId];
                    if (fillCond == "APPEND") {
                        var recCount = $("#gridHd" + dcNo).data("fg-append-rec");
                        //if Fillgrid property is APPEND and grid has existing rows then increase fldDbRowNo by existing record count
                        if (recCount != undefined && calledFrom != "LoadData" && calledFrom != "Action" && calledFrom != "GetDep")
                            fldDbRowNo = parseInt(fldDbRowNo) + recCount;
                    }
                }

                fldName = ConstructFieldName(fldName, dcNo, fldDbRowNo);
                //RedrawField(comboFld, calledFrom, isPopGrid);
                //Code to set the default value to the dropdown for fields with autoselect as true
                comboFld = "";
            }

            if (fldName == "") {
                continue;
            }

            var fld = $j("#" + fldName);



            var fName = GetFieldsName(fldName);
            if ((typeof AutosaveDraft != "undefined" && AutosaveDraft == "true" && checkIsdraft == "false") || (typeof AutosaveDraft != "undefined" && (AutosaveDraft == "" || AutosaveDraft == "false") && checkIsdraft == "false")) {
                if (fName.indexOf("axp_gridattach_") != -1 || (fName.toLowerCase() == "dc" + dcNo + "_image") || fName.startsWith("axp_nga_") || fName.toLowerCase().startsWith("axpfile_")) {
                    if (!fName.startsWith("axp_nga_") && !fName.toLowerCase().startsWith("axpfile_"))
                        SetGridAttValue(fldName, fldValue);
                    if (!fldName.toLowerCase().startsWith("axpfile_"))
                        ConstructAttachHTML(fldValue, fldName);
                    else
                        ConstructAxpAttachHTML(fldValue, fldName);
                    showAttachmentPopover(); //on data load if any grid attachments exists then display all attachments in label count & clicking on it will displays list of files in popover
                }

                if ((fldName.toLowerCase().indexOf("dc" + dcNo + "_referimages") != -1)) {
                    SetGridRefValue(fldName, fldValue);
                }
            }
            if (calledFrom == "LoadData" && isDcFormatGrid) {

                var fIndx = fldName.lastIndexOf("F");
                // var fName = GetFieldsName(fldName);
                var fRNo = GetFieldsRowNo(fldName);

                if (dcKeyColumn == fName) {
                    if (recordid == "0") {
                        var oldKeyVal = $j("#" + fldName).val();
                        CallSetFieldValue(fldName, oldKeyVal);
                        continue;
                    }
                    else {
                        continue;
                    }
                }
            }

            if (fld.length > 0) {
                var fArrayIdx = -1;
                fArrayIdx = $j.inArray(GetFieldsName(fldName), FNames);


                if (fldType == "m") {

                    CallSetFieldValue(fldName, fldValue);
                }
                else if (fldType == "cl" || fldType == "rg") {
                    comboFld = fldName;
                    comboVal = fldValue;

                    isChkCleared = false;
                    CallSetFieldValue(fldName, fldValue);
                    //If this checklist is the last field in the json then it needs to be cleared here
                    if (calledFrom == "GetDep" && (i + 1) == dataJsonObj.length && (prevFldType == "cl" && fldType != "dv" && comboFld != "")) {
                        ClearChecklistOnGetDep(comboFld);
                        comboFld = "";
                        comboVal = "";
                    }
                    else if (calledFrom == "GetDep")
                        $("#" + comboFld).removeData("valuelist");
                }
                else if (fldType == "i") {
                    if (fldValue != "") {

                        if (fldValue.indexOf("//") != -1) {
                            $j("#" + fldName).attr("src", fldValue);
                        }
                        else {
                            var fileName = fldValue.split("\\\\");//.split("\\");
                            var hdnScriptsUrlPath = $j("#hdnScriptsUrlpath");
                            var fldValuePath = "";
                            if (fileName.length > 1) {
                                if (hdnScriptsUrlPath[0] != undefined)
                                    fldValuePath = hdnScriptsUrlPath.val() + "axpert/" + sid + "/" + fileName[fileName.length - 2] + "/" + fileName[fileName.length - 1];
                                else
                                    fldValuePath = "../scripts/axpert/" + sid + "/" + fileName[fileName.length - 2] + "/" + fileName[fileName.length - 1];
                            }
                            else {
                                if (hdnScriptsUrlPath[0] != undefined)
                                    fldValuePath = hdnScriptsUrlPath.val() + "axpert/" + sid + "/" + fileName[fileName.length - 1];
                                else
                                    fldValuePath = "../scripts/axpert/" + sid + "/" + fileName[fileName.length - 1];
                            }
                            GetDateTime();
                            $j("#" + fldName).attr("src", fldValuePath + "?" + imageSuffix);
                            $j("#" + fldName).parents(".image-input").find(".imageFileUpload").addClass("d-none");
                            $j("#" + fldName).parents(".image-input").find(".profile-pic").removeClass("d-none");
                        }
                    }
                    else {
                        $j("#" + fldName).hasClass("signaturePad") ? $j("#" + fldName).attr("src", "../AxpImages/signature.png") : $j("#" + fldName).parents(".image-input").find(".imageFileUpload").addClass("d-none"), $j("#" + fldName).parents(".image-input").find(".profile-pic").removeClass("d-none");//$j("#" + fldName).attr("src", "../AxpImages/upload.png");   
                    }
                }
                else if (fldType == "b") {

                    if (fldName.indexOf("axpbutton") != -1) {

                        var fIndx = fldName.lastIndexOf("F");
                        var uIndx = fldName.lastIndexOf("_");
                        fld.val(fldName.substring(uIndx + 1, fIndx - 3));
                    }
                }
                else if (fldType == "c") {

                    if (fld.attr("type") == "hidden") {
                        CallSetFieldValue(fldName, fldValue);
                        comboFld = "";
                    }
                    else if (fld.attr("type") == "checkbox") {
                        comboFld = "";
                        if (fldValue.toLowerCase() == "yes") {
                            fld.prop("checked", true);
                            fld.attr("checked", true);
                        }
                        else {
                            fld.prop("checked", false);
                            fld.attr("checked", false);
                        }
                    }
                    else {

                        comboFld = fldName;
                        comboVal = fldValue;
                        var fIndx = fldName.lastIndexOf("F");
                        var fName = GetFieldsName(fldName);
                        var fldIsAutoComp = false;
                        if ($j("#" + fldName).hasClass("fldFromSelect"))
                            fldIsAutoComp = true;
                        var fldIsMultiSelect = false;
                        if ($j("#" + fldName).hasClass("fldmultiSelect"))
                            fldIsMultiSelect = true;

                        if (!fldIsAutoComp && !fldIsMultiSelect)
                            ClearComboBox(fld, fName, fldValue);
                        if (dataJsonObj[i].dpm) {
                            var depFldsStr = dataJsonObj[i].dpm;
                            depFlds = depFldsStr.split(",");
                        }
                        if (masterRow != undefined && masterRow != 0) {
                            if (fldDbRowNo != "1" && calledFrom != "PopGridCombos") {
                                if (!fldIsAutoComp && !fldIsMultiSelect)
                                    CopyFromMasterRow(fldName, dcNo, masterRow, calledFrom, isPopGrid);
                            }
                            MasterRow.push(fName);
                            CallSetFieldValue(fldName, fldValue);
                        }
                        else if (fldIsAutoComp || fldIsMultiSelect)
                            CallSetFieldValue(fldName, fldValue);
                        //Update the field in the assignedFld array, as the combo may not have items.
                        UpdateAssignedFld(comboFld);
                        comboFld = "";
                    }
                }
                else if (fldType == "dv") {

                    if (comboFld != "") {
                        var comboField = $j("#" + comboFld);
                        if (comboField != undefined) {

                            if (comboField.prop("type") == "select-one") {
                                var comboItems = fldValue.split("~");
                                var depValue = fldValue;
                                var fldIdVal = "";
                                if (idCol == "yes") {
                                    fldIdVal = comboItems[0];
                                    fldValue = comboItems[1];
                                }
                                else
                                    fldValue = comboItems[0];
                                var optHtml = "";
                                var htmlFldVal = fldValue.replace(/ /g, "&nbsp;");
                                var tmpVal = fldValue.replace(/ /g, String.fromCharCode(160));
                                var comboFldnm = GetFieldsName(comboFld);
                                if (fldValue == comboVal || comboVal == tmpVal) {
                                    optHtml = "<option selected value='" + fldIdVal + "'>" + fldValue + "</option>";
                                    //UpdateAssignedFld(comboFld);
                                    comboField.append(optHtml);
                                    CallSetFieldValue(comboFld, fldValue, false, calledFrom);
                                    if (GetFieldsRowNo(comboFld) == "001" && calledFrom == "LoadData" && rid != "0" && $j.inArray(comboFldnm, MasterRow) > -1) {
                                        SetEditRowComboValues(comboFld, optHtml.replace('selected', ''), dcNo, comboFldnm);
                                    }
                                }
                                else {
                                    optHtml = "<option value='" + fldIdVal + "'>" + fldValue + "</option>";
                                    comboField.append(optHtml);
                                    if (GetFieldsRowNo(comboFld) == "001" && calledFrom == "LoadData" && rid != "0" && $j.inArray(comboFldnm, MasterRow) > -1) {
                                        SetEditRowComboValues(comboFld, optHtml, dcNo, comboFldnm);
                                    }
                                }

                                if (dataJsonObj[i].dp != null) {

                                    var dependentValues = dataJsonObj[i].dp.toString().split("¿");
                                    var tmpCmoboFld = GetFieldsName(comboFld);
                                    for (var cnt = 0; cnt < dependentValues.length; cnt++) {
                                        var strDepVals = dependentValues[cnt].split("~");
                                        for (var depInd = 0; depInd < strDepVals.length; depInd++) {
                                            ComboParentField.push(tmpCmoboFld);
                                            ComboParentValue.push(fldValue);
                                            ComboDepField.push(depFlds[depInd]);
                                            ComboDepValue.push(strDepVals[depInd]);
                                        }
                                    }
                                }
                            }
                            else if ((comboField.attr("type") == "checkbox" || comboField.data("type") == "checkbox" || comboField.attr("type") == "radio") && (typeof IsObjCustomHtml == "undefined" || IsObjCustomHtml == "False")) {

                                var spanClass = "";
                                var align = "";
                                var strChecked = "";
                                var fldClass = "";
                                var fldHint = "";

                                var IsChkList = comboField.attr("type") == "checkbox" || comboField.data("type") == "checkbox";
                                if (IsChkList) {
                                    spanClass = ".multiChkSpan";
                                    align = "<div class='clear'></div>";
                                    var chkValSep = GetChkSeparator(GetFieldsName(comboFld));
                                    var arrChkItems = comboVal.split(chkValSep);
                                    if ($j.inArray(fldValue, arrChkItems) != -1)
                                        strChecked = "checked=checked";

                                    if (isChkCleared == false) {
                                        if (!comboField.hasClass("multiFldChk")) {
                                            fldHint = ClearSqlChkList(comboFld);
                                            isChkCleared = true;
                                        }
                                    }
                                    fldClass = "type=checkbox class='multiFldChk'";

                                }
                                else {
                                    spanClass = ".multiRgrpSpan,.multiFldRdg";
                                    align = "&nbsp;&nbsp;&nbsp;&nbsp;";
                                    if (FldAlignType[fArrayIdx].toLowerCase() == "v")
                                        align = "<div class='clear'></div>";
                                    if (comboVal == fldValue)
                                        strChecked = "checked=checked";

                                    if (isChkCleared == false) {
                                        fldHint = ClearRadioGrp(comboFld);
                                        isChkCleared = true;
                                    }
                                    fldClass = "type=radio class='form-control p-0 form-check-input h-30px w-30px opacity-100 multiFldRdg'";
                                }

                                var tmpFld; var tmpID = "";
                                try {
                                    tmpFld = $j(spanClass + "[name=" + comboFld + "]")
                                    tmpID = tmpFld.attr("name");
                                } catch (ex) { }
                                let radioDisabled = "";
                                if (tmpFld != undefined && tmpFld.hasClass("flddis")) {
                                    fldClass = fldClass + " disabled";
                                    radioDisabled = " disabled=disabled";
                                }

                                var chkId = tmpID;
                                fldValue = CheckSpecialCharsInStr(fldValue);
                                if (fldValue != "") {
                                    fldValue = fldValue.replace(/&amp;/g, "&");
                                    fldValue = fldValue.replace("/&apos;/g", "'")
                                }
                                var fldclText = "", fldclValue = "";
                                if (idCol == "yes") {
                                    fldclValue = fldValue.split('~')[0];
                                    fldclText = fldValue.split('~')[1];
                                }
                                else {
                                    fldclValue = fldValue;
                                    fldclText = fldValue;
                                }
                                var chkHtml = "";

                                if (IsChkList)
                                    chkHtml = "<span><input " + fldClass + " id='" + (IsChkList ? chkId : fldName) + "' onchange='CallMainBlur(this)'  name='" + (IsChkList ? chkId : fldName) + "' title='" + fldHint + "' value='" + fldclValue + "' " + strChecked + " ></input>" + fldclText + align + "</span>";
                                else
                                    chkHtml = "<div class=\"agform form-check form-check-custom px-1 col-md-2 align-self-end\"><input " + fldClass + " id='" + (IsChkList ? chkId : fldName) + "' onchange='CallMainBlur(this)'  name='" + (IsChkList ? chkId : fldName) + "' title='" + fldHint + "' value='" + fldclValue + "' " + strChecked + radioDisabled + " /><label class=\"form-check-label form-label col-form-label pb-1 fw-boldest opacity-100\" for=\"" + (IsChkList ? chkId : fldName) + "\">" + fldclValue + "</label></div>";

                                if (IsDcGrid(dcNo) || comboField.attr("type") == "radio") {
                                    //tmpFld.append(chkHtml);
                                } else {
                                    var tokenData = $("#" + tmpID).data("valuelist");
                                    var tokens = [];
                                    if (typeof tokenData == "object") {
                                        tokens = tokenData;
                                    } else {
                                        tokens = $("#" + tmpID).data("valuelist").split($("#" + tmpID).data("separator")).map(function (data) { return { value: data, label: data } }).filter(function (data) { return data.value && data.label });
                                    }

                                    tokens.push({ value: fldclValue, label: fldclText });

                                    //tokens.push(fldclValue + "♣~♣" + fldclText);
                                    //debugger;
                                    tokens = [...new Set(tokens)];
                                    //$("#" + tmpID).data("valuelist", tokens.join($("#" + tmpID).data("separator")));
                                    $("#" + tmpID).data("valuelist", tokens);
                                    try {
                                        $("#" + tmpID).data('bs.tokenfield').$input.autocomplete({ source: tokens });
                                    } catch (ex) { }
                                }

                                if (IsChkList) {
                                    var chkAllObj = $j("#chkAll_" + chkId);
                                    if (!chkAllObj.hasClass("flddis"))
                                        chkAllObj.removeAttr("disabled");
                                    var hideAllObj = $j("#hideAll_" + chkId);
                                    hideAllObj.removeAttr("disabled");
                                    //if any of the item in cheklist is unchecked, uncheck the select all Or Set the Select all as checked
                                    if (chkAllObj.length > 0) {

                                        var itemLength = $j("input[name='" + chkId + "']").length;
                                        if (arrChkItems.length < itemLength) {
                                            chkAllObj.removeAttr("checked");
                                            chkAllObj.prop("checked", false);
                                        }
                                        else if (comboVal != "" && arrChkItems.length == itemLength) {
                                            chkAllObj.attr("checked", "checked");
                                            chkAllObj.prop("checked", true);
                                        }
                                    }
                                }
                                else {
                                    $j("div[id*='" + fName + "']").find("input[data-dummyradio=true]").remove();
                                    if (comboField.attr("type") == "radio")
                                        $j("#dv" + fName).find(".input-group").append(chkHtml);
                                    else
                                        $j("#dv" + fName).append(chkHtml);
                                }

                            }
                        }
                    }
                }

                if (fldType != "dc" && fldType != "dv") {
                    try {
                        if (fldName.toLowerCase().startsWith("axpfilepath_")) {
                            let prevafpval = GetFieldValue(fldName);
                            if (prevafpval != "")
                                axpfilepathold = GetFieldValue(fldName);
                        }
                    } catch (ex) { }
                    if (fldType == "s" || fldType == "m" || fldType == "cb" || fldType == "rg") {
                        CallSetFieldValue(fldName, fldValue, false, calledFrom);
                        let dwbfieldName = GetFieldsName(fldName);
                        let dwbfldInd = GetFieldIndex(dwbfieldName);
                        var fldDType = GetDWBFieldType(fldName, dwbfldInd);
                        if (fldName.startsWith("axptm_") || fldName.startsWith("axpdbtm_") || (fldDType != "" && fldDType.toLowerCase() == "time")) {
                            var glType = eval(callParent('gllangType'));
                            var dtpkrRTL = false;
                            if (glType == "ar")
                                dtpkrRTL = true;
                            else
                                dtpkrRTL = false;
                            var dvId = $("#" + fldName).parents("[id^='divDc']").attr("id");
                            TimePickerEvent("#" + dvId, dtpkrRTL);
                        }
                    }
                    if (calledFrom == "PopGridCombos" || calledFrom == "Action" || calledFrom == "GetDep" || (typeof isExcelImp != "undefined" && isExcelImp == true))
                        UpdateFieldArray(fldName, fldDbRowNo, fldValue, "parent");

                    var glCulture = eval(callParent('glCulture'));
                    if (glCulture != undefined && glCulture == "en-us") {
                        var fdName = GetFieldsName(fldName);
                        var fldDIndex = $j.inArray(fdName, FNames);
                        var fldDType = GetFieldType(fdName, fldDIndex);
                        if (fldDType != undefined && fldDType.toLowerCase() == "date/time") {
                            var fldDValue = DateDisplayFormat(fldValue);
                            CallSetFieldValue(fldName, fldDValue, false, calledFrom);
                        }
                    }
                    if (fldName.toLowerCase().startsWith("axpfilepath_")) {
                        AxpFilePathChange(fldName);
                    }
                }
            }
            var grfdName = GetFieldsName(fldName);
            if (!axInlineGridEdit && AxpGridForm == "form" && IsGridField(grfdName)) {
                formGridRowBlur($("#" + fldName));
            }
        }

        if (fldName.indexOf("axpvalid") != -1) {
            DoFormControlPrivilege(fldName, fldValue);
        }
        if (fldType != "dc" && fldType != "dv")
            UpdateOldValues(fldName, fldValue);

        prevFldType = fldType;
    }
    if (calledFrom == "LoadData" && recordid == "0" && AxAutoGenFld != undefined) {//Refer Bug: HEA000077,If Autogenerate field node is not there in the formload result needs to be set auto value the fielld. s 
        SetAutoGenerateValue(calledFrom);
    }

    if ((calledFrom == "LoadData" && recordid != "0") || IsDraftLoad == true) {
        UpdatePopGridInfo();
        GetHtmlForFormatGrids();
    }
    else if (calledFrom != "LoadData") {
        if (calledFrom == "GetDep") {
            AxActiveDc = axActiveDc;
        }
        AssignPopGridRows();
        ArrPopNewDcs = new Array();
        ArrPopNewRows = new Array();
    }

    if (calledFrom == "LoadData" && recordid != "0" && isGridFileUploadOnLoad == true) {
        isGridFileUploadOnLoad = false;
        for (var i = 0; i < DCName.length; i++) {
            let dvId = DCName[i];
            let dvDcNo = dvId.substr(2);
            if (IsDcGrid(dvDcNo)) {
                DropzoneInit("#divDc" + dvDcNo);
                DropzoneGridInit("#divDc" + dvDcNo);
            }
        }
    }
    CallEvalExpOnFormSkip();
    //ReAssignEvents();
}

function SetAutoGenerateValue(calledFrom) {
    var autoGendcNo = GetDcNo(AxAutoGenFld);
    var autoGenfldName = "";
    if (!IsDcGrid(autoGendcNo))
        autoGenfldName = ConstructFieldName(AxAutoGenFld, autoGendcNo, "000");
    else
        autoGenfldName = ConstructFieldName(AxAutoGenFld, autoGendcNo, "001");
    var hdnAutogenerateFld = $j("#hdnShowAutoGenFldValue").val();
    if (hdnAutogenerateFld.toLowerCase() == "false") {
        CallSetFieldValue(autoGenfldName, "Auto", false, calledFrom);
    }
}

function CallEvalExpOnFormSkip() {
    if (AxFormLoadSkipped) {
        AxFormLoadSkipped = false;
        for (var i = 0; i < FNames.length; i++) {
            var depFldIndx = GetFldNamesIndx(FNames[i])
            var expression = "";
            if (depFldIndx != -1) {
                expression = Expressions[depFldIndx].toString();
            }
            if (expression != "") {
                var fldId = "";
                if (IsGridField(FNames[i]))
                    fldId = FNames[i] + "001F" + FldFrameNo[i];
                else
                    fldId = FNames[i] + "000F" + FldFrameNo[i];

                EvaluateAxFunction(FNames[i], fldId);
                UpdateFieldArray(fldId, 1, GetFieldValue(fldId), "parent", "FormLoad");
                UpdateAllFieldValues(fldId, GetFieldValue(fldId));
            }
        }
    }
}


//If the record is loaded and has gris, then rowcount should be incremneted by 1 as edit mode also will have a row
function SetHdnRowCount(dcNo, calledFrom) {
    if (calledFrom == "GetTabData") {
        if ($j("#hdnRCntDc" + dcNo).length > 0) {
            var newRcnt = parseInt($j("#hdnRCntDc" + dcNo).val(), 10) + 1;
            $j("#hdnRCntDc" + dcNo).val(newRcnt);
            UpdateDcRowArrays(dcNo, GetRowNoHelper(newRcnt), "Add");
        }

    }
}
//Function to load the combo values in the edit mode of the grid when a record is loaded from listview for select fields with sql
function SetEditRowComboValues(combofld, optHtml, dcNo, fldNm) {
    var dcRCnt = GetDcRowCount(dcNo);
    var editRowNo = GetRowNoHelper(dcRCnt);
    var editFldId = "#" + fldNm + editRowNo + "F" + dcNo;
    $j(editFldId).append(optHtml);
}

function CallMainBlur(obj) {
    var objId = obj.id;
    MainBlur($j("#" + objId));
}


//Function to reassign events to the checkboxes and radio buttons that have been added dynamically.
//function ReAssignEvents() {

//    for (var i = 0; i < AxDynamicFlds.length; i++) {

//        var fldName = AxDynamicFlds[i].toString();
//        var fldValue = AxDynamicFldVal[i].toString();

//        $j("input:checkbox.multiFldChk").each(function () {
//            if ($j(this).attr("id") == fldName && $j(this).val().toLowerCase() == fldValue) {
//                $j(this).change(function () {
//                    MainBlur($j(this));
//                });
//            }
//        });

//        $j("input:radio.multiFldRdg").each(function () {
//            if ($j(this).attr("id") == fldName && $j(this).val().toLowerCase() == fldValue) {
//                $j(this).change(function () {
//                    MainBlur($j(this));
//                });
//            }
//        });
//    }
//}

function RedrawField(fld, calledFrom, isPopGrid) {
    if (fld != "") {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");
        if (msie > 0) {  // If Internet Explorer, return version number
            $j("#" + fld).css('background-color', 'white');
            $j("#" + fld).focus();
        }
        else
            $j("#" + fld).hide().show();

        if (calledFrom == "LoadData" && !IsDraftLoad && $j("#" + fld).length > 0) {
            if (isPopGrid)
                return;
            $j("#" + fld).width($j("#" + fld).width() + 2);
        }
    }
}

function GetHtmlForFormatGrids() {
    var result = $j("#dvFormatDc").html();
    $j("#dvFormatDc").html("");
    AssignHTML(result, "LoadData", "");
}


//Function to store the old values of fields in the arrays.
function UpdateOldValues(fieldName, fldValue) {
    var indx = $j.inArray(FldLoadedFields, fieldName);
    if (indx == -1) {
        FldLoadedFields.push(fieldName);
        FldLoadedValues.push(fldValue);
    }
    else {
        FldLoadedValues[indx] = fldValue;
    }
}

//Function to add newly added pop up grid rows from the service result.
function UpdateNewPopInfo(dcNo, rowNo) {

    var idx = $j.inArray(dcNo, ArrPopNewDcs);

    if (idx != -1) {

        if (ArrPopNewRows[idx] != "") {
            var pIdx = -1;
            pIdx = ArrPopNewRows[idx].indexOf(rowNo);
            if (pIdx == -1)
                ArrPopNewRows[idx] += "," + rowNo;
        }
        else
            ArrPopNewRows[idx] = ArrPopNewRows[idx];
    }
    else {
        ArrPopNewDcs.push(dcNo);
        ArrPopNewRows.push(rowNo);
    }
}

function AssignPopGridRows() {

    if (TstructHasPop) {
        //rowno ~ dcno
        for (var i = 0; i < ArrPopNewDcs.length; i++) {

            var popIdx = $j.inArray(ArrPopNewDcs[i], PopGridDCs);
            var dcNo = PopGridDCs[popIdx].toString();
            var parDcNo = PopParentDCs[popIdx].toString();

            var dcIdx = $j.inArray(parDcNo, DCFrameNo);
            //If the parent grid does not have rows, then do not assign sub grid rows.
            if (DCHasDataRows[dcIdx].toString().toLowerCase() == "false")
                continue;

            dcIdx = $j.inArray(ArrPopNewDcs[i], DCFrameNo);
            //If the sub grid does not have rows, then do not assign rows in arrays.
            if (DCHasDataRows[dcIdx].toString().toLowerCase() == "false")
                continue;

            var popNewRows = ArrPopNewRows[i].split(",");

            //PopParentFlds,PopParentDCs
            for (var j = 0; j < popNewRows.length; j++) {
                //var clientRowNo = GetClientRowNo(popNewRows[j], dcNo);
                var clientRowNo = popNewRows[j];
                var parFlds = PopParentFlds[popIdx].split(',');
                var parentStr = "";
                for (ind = 0; ind < parFlds.length; ind++) {
                    var parentFld = GetSubFieldId("sub" + dcNo + "_" + parFlds[ind], clientRowNo, dcNo);
                    var tmpParVal = GetFieldValue(parentFld);
                    if (tmpParVal.indexOf(",") != -1)
                        tmpParVal = removeCommas(tmpParVal);

                    if (parentStr == "")
                        parentStr = tmpParVal;
                    else
                        parentStr += "¿" + tmpParVal;
                }

                UpdateParentStr(parDcNo, dcNo, parentStr, clientRowNo);
            }
        }
    }
}

function ClearPopRowsArray() {
    for (var i = 0; i < PopRows.length; i++) {
        PopRows[i] = "";
    }
}

function UpdatePopGridInfo() {
    if (TstructHasPop) {
        ClearPopRowsArray();
        for (var i = 0; i < PopGridDCs.length; i++) {
            var dcNo = PopGridDCs[i].toString();
            var rowCnt = GetDcRowCount(dcNo);
            var parDcNo = PopParentDCs[i].toString();
            var parFlds = PopParentFlds[i].split(',');
            //PopParentFlds,PopParentDCs

            var dcIdx = $j.inArray(parDcNo, DCFrameNo);
            //If the parent grid does not have rows, then do not assign sub grid rows.
            if (DCHasDataRows[dcIdx].toString().toLowerCase() == "false")
                continue;

            dcIdx = $j.inArray(dcNo, DCFrameNo);
            //If the sub grid does not have rows, then do not assign rows in arrays.
            if (DCHasDataRows[dcIdx].toString().toLowerCase() == "false")
                continue;

            for (var j = 1; j <= rowCnt; j++) {
                var clientRowNo = GetClientRowNo(j, dcNo);
                var parentStr = "";
                for (ind = 0; ind < parFlds.length; ind++) {
                    var parentFld = GetSubFieldId("sub" + dcNo + "_" + parFlds[ind], clientRowNo, dcNo);
                    var tmpParVal = GetFieldValue(parentFld);

                    if (parentStr == "")
                        parentStr = tmpParVal;
                    else
                        parentStr += "¿" + tmpParVal;

                }

                UpdateParentStr(parDcNo, dcNo, parentStr, clientRowNo);
            }
        }
    }
}


function UpdateParentStr(parDcNo, popDcNo, parentStr, popRowNo) {

    for (var i = 0; i < ParentDcNo.length; i++) {

        var tmpParStr = PopParentsStr[i].toLowerCase();
        var tmpPopParStr = parentStr.toLowerCase();

        tmpParStr = ReplaceCharsInParStr(tmpParStr);
        tmpPopParStr = ReplaceCharsInParStr(tmpPopParStr);

        if (ParentDcNo[i] == parDcNo && PopGridDcNo[i] == popDcNo && tmpParStr == tmpPopParStr) {
            var popRows = PopRows[i].toString();
            if (popRows == "") {
                popRows = popRowNo;
            }
            else {
                var arrStr = popRows.split(",");
                var idx = $j.inArray(popRowNo, arrStr);
                if (idx == -1)
                    popRows += "," + popRowNo;
            }
            PopRows[i] = popRows;
            break;
        }
    }
}

//Function to replace the special characters in the parent string in the subgrid parent fields
function ReplaceCharsInParStr(parStr) {
    parStr = parStr.replace(/,/g, "");
    parStr = parStr.replace(/\./g, '');
    return parStr;
}

//Function to execute the attachments node in the json result .
function ExecAttachments(attJsonObj) {

    for (var i = 0; i < attJsonObj.length; i++) {

        var attach = attJsonObj[i].att;
        attach = attach.split(",");
        var responsemsgFlds = attach.length;
        var rid = $j("#recordid000F0").val();
        var hdnattachcount = "";

        for (var mm = 0; mm < responsemsgFlds; mm++) {
            if (fileonloadarray.indexOf(attach[mm].toString()) == -1) {
                fileonloadarray.push(attach[mm].toString());
            }
        }
        if (fileonloadarray.length > 0)
            $j("#attachment-overlay").removeClass("d-none");
    }
}

//Function to execute the workflow node in the json result.
function ExecWorkflow(wfJsonObj) {
    var isBtnDis = false;
    var htmlwf = "";
    var maxLevels = "";

    getComntWf(false);
    for (var i = 0; i < wfJsonObj.length; i++) {
        $j("#workflowoverlay").removeClass("d-none");
        if (wfJsonObj[i].btn) {
            var btn = wfJsonObj[i].btn;
            var btnarr = new Array();
            if (btn != "") {
                btnarr = btn.split("~");
                ReadonlyWfButtons();
                for (var k = 0; k < btnarr.length; k++) {
                    if (btnarr[k] == "a") {
                        $j("#btntabapprove").prop("disabled", false);
                        $j("#btntabapprove").removeClass("disablewfbuttons").addClass("enablewfbuttons");
                        $j("#selectbox").append("<div class=\"Selectboxlist menu-item px-3\" id=\"Approve\"><a href=\"javascript:void(0);\"  onclick=\"SlectBoxWrf('Approve')\" class=\"menu-link px-3\">Approve</a></div>");
                    }
                    else if (btnarr[k] == "r") {
                        $j("#btntabreject").prop("disabled", false);
                        $j("#btntabreject").removeClass("disablewfbuttons").addClass("enablewfbuttons");
                        $j("#selectbox").append("<div class=\"Selectboxlist menu-item px-3\" id=\"Reject\"><a href=\"javascript:void(0);\" onclick=\"SlectBoxWrf('Reject')\" class=\"menu-link px-3\">Reject</a></div>");
                    }
                    else if (btnarr[k] == "t") {
                        $j("#btntabreturn").prop("disabled", false);
                        $j("#btntabreturn").removeClass("disablewfbuttons").addClass("enablewfbuttons");
                        $j("#selectbox").append("<div class=\"Selectboxlist menu-item px-3\" id=\"Return\"><a href=\"javascript:void(0);\"  onclick=\"SlectBoxWrf('Return')\" class=\"menu-link px-3\">Return</a></div>");
                    }
                    else if (btnarr[k] == "v") {
                        $j("#btntabreview").prop("disabled", false);
                        $j("#btntabreview").removeClass("disablewfbuttons").addClass("enablewfbuttons");
                        $j("#selectbox").append("<div class=\"Selectboxlist menu-item px-3\" id=\"Review\"><a href=\"javascript:void(0);\" onclick=\"SlectBoxWrf('Review')\" class=\"menu-link px-3\">Review & Forward</a></div>");
                    }
                    isBtnDis = true;
                }
            }
            else {
                $("#selectbox").attr("disabled", "disabled");
                $(".wrkflwinline").addClass("hide");
                ReadonlyWfButtons();
            }
        }
        else {
            if (isBtnDis == false) {
                $("#selectbox").attr("disabled", "disabled");
                $(".wrkflwinline").addClass("hide");
                ReadonlyWfButtons();
            }
            else {
                var txtCom = $j("#txtCommentWF");
                if (txtCom.length > 0)
                    txtCom.prop("disabled", false);
            }
        }

        if (wfJsonObj[i].status) {
            $j("#lblStatus").text(wfJsonObj[i].status);
        }

        if (wfJsonObj[i].lno) {
            $j("#hdnWfLno").val(wfJsonObj[i].lno);
        }
        if (wfJsonObj[i].elno) {
            $j("#hdnWfELno").val(wfJsonObj[i].elno);
            var elno = wfJsonObj[i].elno;
        }
        if (wfJsonObj[i].appstatus) {

            appstatus = wfJsonObj[i].appstatus;
            if ((appstatus == "Approved" && AxOnApproveDisable == true) || (appstatus == "Rejected" && AxOnRejectDisable == true))
                Readonlyform();
        }
        if (wfJsonObj[i].readonlyform) {
            if (wfJsonObj[i].readonlyform == "true") {
                //AxOnApproveDisable = true;
                Readonlyform();
            }
        }
        if (wfJsonObj[i].allowcancel) {
            AxAllowCancel = wfJsonObj[i].allowcancel.toString().toLowerCase() == 'true';
        }
        if (wfJsonObj[i].maxlevel) {
            maxLevels = wfJsonObj[i].maxlevel;
        }
        if (wfJsonObj[i].pdcomments) {
            tstWFpdcomments = wfJsonObj[i].pdcomments;
        }
        if (wfJsonObj[i].wkid) {
            tstWorkFlowId = wfJsonObj[i].wkid;
        }
        if (wfJsonObj[i].levels) {
            var usernames = getWfUsrName(maxLevels, wfJsonObj[i].levels);
            var statusWrk = getWfStatus(maxLevels, wfJsonObj[i].levels);
            var lno = wfJsonObj[i].levels[0].lno;
            if ($.inArray("", usernames) == -1) {
                htmlwf = constructWrkHtml(maxLevels, usernames, statusWrk, elno, wfJsonObj[i].levels);
                $(htmlwf).insertAfter($(".icobtn"));
                $("#stratWrkf").after($(".workflowMsg").detach());
                if ($("#workflowdropdown").length != 0) {
                    $("#workflowdropdown").append($("#selectbox").detach());
                    $("#selectbox").removeClass("initialized");
                    if ($(".wfselectbox").hasClass("d-none"))
                        $(".wfselectbox").removeClass("d-none");
                    else
                        $(".wfselectbox").addClass("d-none");
                }
                else
                    $(".icobtn").append($(".dropbox").detach());
                popoverWrkFl();
            }
            else {
                getWfLevelUSsrs($.inArray("", usernames), maxLevels, usernames, statusWrk, elno, wfJsonObj[i].levels);
                if ($("#workflowdropdown").length != 0) {
                    $("#workflowdropdown").append($("#selectbox").detach());
                    $("#selectbox").removeClass("initialized");
                }
                if ($(".wfselectbox").hasClass("d-none"))
                    $(".wfselectbox").removeClass("d-none");
                else
                    $(".wfselectbox").addClass("d-none");
            }
            KTMenu?.init();
        }
    }
    if (elno > 0) {
        $(".wrkflwPending").addClass("wrkflwPendingCls");
        $(".downArr").addClass("workflowdropdownCls");
        $(".icobtn").addClass("iconbtnCls");
    }
    // adjustwin("100", window);

    //disable workflow status dropdown if tstruct is locked
    if (AxIsTstructLocked == "true") {
        $("#selectbox").attr("disabled", "disabled");
        $(".wrkflwinline").addClass("hide");
    }
}

//Function to execute the message node in the json result.
function ExecMessage(messageJsonObj, calledFrom) {


    for (var i = 0; i < messageJsonObj.length; i++) {

        var msgs = messageJsonObj[i].msg;

        if ((typeof $j("#middle1", parent.document).attr("src") != "undefined" && $j("#middle1", parent.document).attr("src").indexOf("tstruct.aspx") === 0) && (document.title.toLowerCase() != "iview" && IsPickListField(AxActDepFld)) && msgs.indexOf("Invalid selection") > -1 && calledFrom == "GetDep") {
            continue;
        }

        if (msgs.indexOf("recordid") > -1) {
            var msgsArray = msgs.split(',');
            msgs = "";
            for (var x = 0; x < msgsArray.length; x++) {
                if (msgsArray[x].indexOf("recordid=") == -1) {
                    if (x == msgsArray.length - 1)
                        msgs += msgsArray[x];
                    else
                        msgs += msgsArray[x] + ",";


                }
            }
        }
        //msgs = msgs.substring(0, msgs.lastIndexOf(",") - 1);

        if (msgs.indexOf("errfld") > -1)
            msgs = msgs.substring(0, msgs.lastIndexOf("errfld") - 2);

        msgs = msgs.split(",");
        var responsemsgFlds = msgs.length;
        var msg = "";

        for (var mm = 0; mm < responsemsgFlds; mm++) {

            msg += msgs[mm] + ",";
            var stPos = msg.indexOf("[");
            var endPos = msg.indexOf("]");
            var errFld = msg.substring(stPos + 1, endPos);
            if (errFld != "") {
                var nerr = msg.substring(stPos, endPos + 2);
                msg = msg.replace(nerr, "");
                alertType = "error";
            }
            var index = msg.indexOf("^^dq");
            while (index != -1) {
                msg = msg.replace("^^dq", '"');
                index = msg.indexOf("^^dq");
            }

        }
        if (msg != "") {
            if (calledFrom == "Action" && msg.indexOf("recordid") > 0)
                msg = msg.substr(0, msg.indexOf("recordid"));
            if (saveActRecSuccess == true) {
                alertType = "success";
                saveActRecSuccess = false;
            }

            if (msg == "Transaction has been canceled") {
                msg = eval(callParent('lcm[44]'));
                //msg = "Transaction has been cancelled";
                alertType = "error";
            }
            else if ((calledFrom == "Action" || calledFrom == "Iview") && msg.indexOf("`") != -1) {
                var alType = msg.split("`")[0].toLowerCase();
                if (alType.indexOf(",") > -1) {
                    alType = alType.split(",")[1];
                }
                if (alType == "simple" || alType == "")
                    alertType = "info";
                else if (alType == "warning")
                    alertType = "warning";
                else if (alType == "confirmation")
                    alertType = "success";
                else if (alType == "exceptions")
                    alertType = "error";
                msg = msg.split("`")[1].slice(0, -1);
            }
            else if (msg.toLowerCase().indexOf("invalid") != -1 || msg.indexOf("cannot be left empty") != -1) {
                alertType = "error";
            } else if (msg.toLowerCase().indexOf("is completed") != -1 || msg.toLowerCase().indexOf("saved successfully") != -1) {
                alertType = "success";
            }
            else {
                alertType = "info";
            }
            if (msg.indexOf("cannot be left empty") != -1) {
                var cutMsg = eval(callParent('lcm[45]'));
                msg = msg.replace('cannot be left empty', cutMsg);
            }



            blurDisabled = true;
            if (calledFrom == "GetDep" && IsPickListField(AxActDepFld) == true) {
                if (msg != "" && AxPickResult == "") {

                    AxActionSave ? (showAlertDialog(alertType, msg, "", "", "function~redirectOnSaveAction()"), disableBtnBeforeReload()) : showAlertDialog(alertType, msg);


                    errFrompickfld = msg;
                    if (AxActDepFld != "") {
                        var rowNo = GetClientRowNo(AxActiveRowNo, AxActiveDc);
                        var fldName = AxActDepFld + rowNo + "F" + AxActiveDc;
                        var focusFld = $j("#" + fldName);
                        if (focusFld.length > 0) {
                            focusFld.focus();
                        }
                    }
                }
                else {
                    currentPickList = AxActDepFld;
                    SuccGetSearchResult(AxPickResult);
                }
            }
            else {
                AxActionSave ? AxActiveAction == "New" ? showAlertDialog(alertType, msg) : (showAlertDialog(alertType, msg, "", "", "function~redirectOnSaveAction()"), disableBtnBeforeReload()) : showAlertDialog(alertType, msg);

                errFrompickfld = msg;
                if (AxActiveField != "") {
                    var rowNo = GetClientRowNo(AxActiveRowNo, AxActiveDc);
                    var fldName = AxActiveField + rowNo + "F" + AxActiveDc;
                    var focusFld = $j("#" + fldName);
                    if (focusFld.length > 0) {
                        focusFld.focus();
                    }
                }
            }
        }
    }
    let curFrame = $(window.frameElement);
    if (curFrame.attr("id") === "axpiframe" && axFramReload == false) {
        ReloadMiddleIframe();
    }
    if (axFramReload != false)
        axFramReload = false;
}

//Function to execute the formcontrol node in the json result.
function ExecFormControl(formControlJsonObj, calledFrom) {

    var frmlength = formControlJsonObj.length;
    // begin for formcontrol
    for (var m = 0; m < frmlength; m++) {

        if (formControlJsonObj[m].dc) {

            var dcName = ""; var dcVal = "";
            dcName = formControlJsonObj[m].dc;
            dcVal = formControlJsonObj[m].dcact;
            var dcNo = parseInt(dcName.substr(2, dcName.length));

            if (dcVal == "hide") {
                if (typeof isWizardTstruct != "undefined" && isWizardTstruct)
                    ToggleWizardDc(dcNo, "hide");
                else
                    ShowingDc(dcNo, "hide");
                var hideDcInd = $.inArray(dcNo.toString(), VisibleDCs);
                if (hideDcInd != -1)
                    VisibleDCs.splice(hideDcInd, 1);
            }
            else if (dcVal == "show") {
                if (typeof isWizardTstruct != "undefined" && isWizardTstruct)
                    ToggleWizardDc(dcNo, "show");
                else
                    ShowingDc(dcNo, "show");
                var showDcInd = $.inArray(dcNo.toString(), VisibleDCs);
                if (showDcInd == -1)
                    VisibleDCs.push(dcNo.toString());
            }
            else if (dcVal == "disable") {
                ShowingDc(dcNo, "Disable", calledFrom);
            }
            else {
                ShowingDc(dcNo, "Enable");
            }
        }

        if (formControlJsonObj[m].readonlytrans) {

            var readonly = formControlJsonObj[m].readonlytrans;
            if (readonly != "no") {
                var breadcrumb = document.getElementById("breadcrumb");
                if (breadcrumb) {
                    var brcrumbVal = breadcrumb.innerHTML;
                    brcrumbVal = brcrumbVal.substring(0, brcrumbVal.length - 11);
                    breadcrumb.innerHTML = brcrumbVal + " - Read Only</h3></div>";
                }
                tstReadOnly = true;
                Readonlyform();
            }
        }

        if (formControlJsonObj[m].btnname) {

            var btnName = ""; var btnVal = "";
            btnName = formControlJsonObj[m].btnname;
            btnVal = formControlJsonObj[m].btnact;
            var newBtnName = GetExactFieldName(btnName);
            var isobject = false;
            fld = null;

            if (btnName.indexOf(".") != -1)
                btnName.replace(".", "\\.");

            if (btnName.toLowerCase() == "remove")
                btnName = "delete";
            else if (btnName.toLowerCase() == "list view")
                btnName = "listview";
            else if (btnName.toLowerCase() == "new")
                btnName = "add";

            $j(":button").each(function () {

                if ($j(this).attr("id") == btnName || $j(this).attr("value") == btnName) {
                    isobject = true;
                    fld = $j(this);
                }
            });
            if (!isobject) {
                $j(".action img").each(function () {
                    if ($j(this).attr("id") == btnName) {
                        fld = $j(this);
                        isobject = true;
                        return false;
                    }
                });
            }

            if (!isobject) {
                $j(".axpBtn").each(function () {
                    if ($j(this).attr("id") == btnName) {
                        fld = $j(this);
                        isobject = true;
                        return false;
                    }
                });
            }
            if (!isobject) {
                $j(".axpBtnCustom").each(function () {
                    if ($j(this).attr("id") == btnName) {
                        fld = $j(this);
                        isobject = true;
                        return false;
                    }
                });
            }

            if (!isobject) {
                $j("#icons").find("a").each(function () {
                    if ($j(this).attr("class") == btnName.toLowerCase() || (typeof btnName !== 'undefined' && $j(this).text() == btnName)) {
                        fld = $j(this);
                        isobject = true;
                    }
                });
            }

            //condition to check prev and next button in list view header
            if (!isobject) {
                $j("#nextprevicons").find("a").each(function () {
                    if ($j(this).attr("class") == btnName.toLowerCase()) {
                        fld = $j(this);
                        isobject = true;
                    }
                });
            }

            if (!isobject) {
                $j("#icons").find("a").each(function () {
                    if (typeof $j(this).attr("title") != "undefined" && $j(this).attr("class") == btnName.toLowerCase() || (typeof btnName !== 'undefined' && $j(this).text() == btnName)) {
                        isobject = true;
                        fld = $j(this);
                        return false;
                    } else if (typeof $j(this).attr("title") != "undefined" && $j(this).attr("title").toLowerCase() == btnName.toLowerCase() || (typeof btnName !== 'undefined' && $j(this).text() == btnName)) {
                        isobject = true;
                        fld = $j(this);
                        return false;
                    }
                });
            }
            if (!isobject) {
                $j(".toolbarRightMenu").find("a").each(function () {
                    if (typeof $j(this).attr("title") != "undefined" && $j(this).attr("title").toLowerCase() == btnName.toLowerCase() || (typeof btnName !== 'undefined' && $j(this).text() == btnName)) {
                        isobject = true;
                        fld = $j(this);
                        return false;
                    }
                });
            }

            //condition to check prev and next button in list view header
            if (!isobject) {
                $j("#nextprevicons").find("a").each(function () {
                    if ($j(this).attr("class") == btnName.toLowerCase()) {
                        isobject = true;
                        fld = $j(this);
                        return false;
                    }
                });
            }
            if (!isobject) {
                $j(".tstructMainBottomFooter").find("a").each(function () {
                    if ($j(this).attr("id").toLowerCase() == btnName.toLowerCase()) {
                        isobject = true;
                        fld = $j(this);
                        return false;
                    }
                });
            }

            if (!isobject) {
                $(".toolbarRightMenu .menu-item a").each(function () {
                    if (typeof $j(this).attr("id") != "undefined" && ($j(this).attr("id").toLowerCase() == btnName.toLowerCase()) || (typeof $j(this).attr("title") != "undefined" && $j(this).attr("title").toLowerCase() == btnName.toLowerCase() || (typeof btnName !== 'undefined' && $j(this).text() == btnName))) {
                        isobject = true;
                        fld = $j(this);
                        return false;
                    }
                });
            }


            if (btnVal == "disable")
                CallProcessFormControl(btnName, "", "2", "");
            else if (btnVal == "enable")
                CallProcessFormControl(btnName, "", "1", "");
            else {

                if (fld != null && fld.length > 0) {
                    isobject = true;
                }
                else if ($j("#" + btnName.toLowerCase()).length > 0) {
                    isobject = true;
                    fld = $j("#" + btnName.toLowerCase());
                }
                else if (btnName == "Save") {
                    if ($j("#imgSaveTst")) {
                        isobject = true;
                        fld = $j("#imgSaveTst");
                    }
                }
                else {
                    fld = btnName + "000F0";
                    if ($j("#" + fld).length > 0) {
                        isobject = true;
                        fld = $j("#" + fld);
                    }


                }

                if (isobject && fld.length > 0) {

                    if (btnVal == "hide") {
                        if (fld.parent()[0].tagName.toLowerCase() == "li") {
                            fld.parent().css({ "display": "none" });
                        }
                        if (btnName == "add") {
                            if ($j("#New").length > 0)
                                $j("#New").css({ "display": "none" });
                        }
                        else if ((btnName.toLowerCase() == "reject" || btnName.toLowerCase() == "approve") && $j("#icons").find("a#actbtn_" + btnName).length > 0) {
                            $j("#icons").find("a#actbtn_" + btnName).parent().css({ "display": "none" });
                        }
                        fld.css({ "display": "none" });
                        fld.addClass("d-none");
                    }
                    else if (btnVal == "show") {
                        if (fld.parent()[0].tagName.toLowerCase() == "li") {
                            fld.parent().css({ "display": "inline-block" });
                        }
                        if (btnName == "add") {
                            if ($j("#New").length > 0)
                                $j("#New").css({ "display": "inline-block" });
                        }
                        fld.css({ "display": "block" });
                        fld.removeClass("d-none");
                    }
                    else if (btnVal == "disable") {

                        FadeImage(fld.attr("id"), 1);
                        fld.attr("disabled", "disabled");
                        fld.addClass('btndis');
                        SetAutoCompAccess("disabled", fld);

                        fld.prop("disabled", true);
                        fld.addClass('disabled');
                        fld.css("cursor", 'default');
                        if (fld.hasClass('menu-link'))
                            fld.addClass('btn');
                    }
                    else if (btnVal == "enable") {
                        fld.prop("disabled", false);
                        SetAutoCompAccess("enabled", fld);

                        fld.prop("disabled", false);
                        fld.removeClass('disabled');
                        fld.css("cursor", '');
                        fld.css("cursor", 'hand');
                        if (fld.hasClass('menu-link'))
                            fld.removeClass('btn');
                    }
                    isobject = false;
                }

            }
        }
        if (formControlJsonObj[m].fldname) {

            //TODO:need clarification on how to get the fieldID of the field on which formcontrol should be executed.
            //Construct the fieldname with the row no attribute in the new json.
            var fldName = ""; var fldVal = ""; var setCap = "";
            fldName = formControlJsonObj[m].fldname;
            fldVal = formControlJsonObj[m].fldact;
            setCap = formControlJsonObj[m].setcaption;
            var flens = 0; var poss = 0;
            var rFrameNo = GetFieldsRowFrameNo(fldName);
            var fName = GetFieldsName(fldName);
            var frmNo = rFrameNo.substring(4);
            if (rFrameNo == "000F0")
                fldName = fldName.substring(0, fldName.length - 1) + "1";

            if (setCap != undefined && rFrameNo == fldName) {
                var setFldDc = GetDcNo(fldName);
                if (!IsDcGrid(setFldDc))
                    fldName = fldName + "000F" + setFldDc;
                else
                    fldName = fldName + "001F" + setFldDc;
            }

            var fld = $j("#" + fldName);
            var isGridFld = false;
            if (setCap != undefined || fldVal != undefined) {
                if (setCap != undefined) {
                    var idx = $j.inArray(GetDcNo(GetFieldsName(fldName)) + "~" + GetFieldsName(fldName) + "~" + setCap, AxFormContSetCapFldsGrid);
                    if (idx == -1)
                        AxFormContSetCapFldsGrid.push(GetDcNo(GetFieldsName(fldName)) + "~" + GetFieldsName(fldName) + "~" + setCap);
                    SetCaptionFormControl(fldName, setCap);
                }
                if (fldVal == "setfocus") {
                    var idx = $j.inArray(GetDcNo(fldName) + "~" + fldName + "~" + fldVal, AxFormContFldSetFocus);
                    if (idx == -1)
                        AxFormContFldSetFocus.push(GetDcNo(fldName) + "~" + fldName + "~" + fldVal)
                }
                else if (fldVal != undefined) {
                    var idx = $j.inArray(GetDcNo(GetFieldsName(fldName)) + "~" + GetFieldsName(fldName) + "~" + fldVal, AxFormContSetFldActGrid);
                    if (idx == -1)
                        AxFormContSetFldActGrid.push(GetDcNo(GetFieldsName(fldName)) + "~" + GetFieldsName(fldName) + "~" + fldVal)
                }
            }
            else if (fld.length > 0) {

                if (IsDcGrid(frmNo))
                    isGridFld = true;

                if (fldVal == "hide") {
                    if (isGridFld) {
                        $j("#th-" + fName).hide();
                        fld.hide();
                        fld.parent().hide();
                    }
                    else {
                        fld.css("visibility", "hidden");
                        var fldNewName = GetFieldsName(fldName);
                        $j("#dv" + fldNewName).hide();
                    }
                }
                else {
                    if (isGridFld) {
                        $j("#th-" + fName).show();
                        fld.show();
                        fld.parent().show();
                    }
                    else {
                        fld.css("visibility", "visible");
                    }
                }

                if (fldVal == "disable")
                    ProcessFormControl(fldName, "2", "");
                else
                    ProcessFormControl(fldName, "1", "");
            }
            else {
                if (fldVal == "hide" || fldVal == "show") {
                    var idx = $j.inArray(fName + "~" + fldVal, AxFormContHiddenFlds);
                    if (idx == -1)
                        AxFormContHiddenFlds.push(fName + "~" + fldVal);
                }
                else if (setCap != undefined) {
                    var idx = $j.inArray(fldName + "~" + setCap, AxFormContSetCapFlds);
                    if (idx == -1)
                        AxFormContSetCapFlds.push(fldName + "~" + setCap);
                }
            }

        }
    }

    SetFormContFldActGrid("");
    // if (typeof isWizardTstruct != "undefined" && isWizardTstruct)
    //     CheckWizardSaveButton();
}

//Function to execute the form control for Design Mode.
function ExecFormControlDesignMode(formControlJsonObj, calledFrom) {
    var frmlength = formControlJsonObj.length;

    for (var m = 0; m < frmlength; m++) {
        if (formControlJsonObj[m].fldname) {
            var fldName = ""; var setCap = "";
            fldName = formControlJsonObj[m].fldname;
            setCap = formControlJsonObj[m].setcaption;

            //Only Set Caption has to be executed in case of Design Mode.
            if (setCap != undefined) {
                var rFrameNo = GetFieldsRowFrameNo(fldName);
                if (rFrameNo == "000F0")
                    fldName = fldName.substring(0, fldName.length - 1) + "1";

                if (setCap != undefined && rFrameNo == fldName) {
                    var setFldDc = GetDcNo(fldName);
                    if (!IsDcGrid(setFldDc))
                        fldName = fldName + "000F" + setFldDc;
                    else
                        fldName = fldName + "001F" + setFldDc;
                }

                var idx = $j.inArray(GetDcNo(GetFieldsName(fldName)) + "~" + GetFieldsName(fldName) + "~" + setCap, AxFormContSetCapFldsGrid);
                if (idx == -1)
                    AxFormContSetCapFldsGrid.push(GetDcNo(GetFieldsName(fldName)) + "~" + GetFieldsName(fldName) + "~" + setCap);
                SetCaptionFormControl(fldName, setCap);
            }
        }
    }
}


//Function to construct the parameter string from the json parameters.
function ConstructParams(params, values) {

    if (params.indexOf("###") != -1)
        params = params.replace(/###/g, "¿");

    if (values.indexOf("###") != -1)
        values = values.replace(/###/g, "¿");

    var params = params.split("¿");
    var pvals = values.split("¿");
    var paramsStr = "";
    var responseparamsFlds = params.length;

    if (responseparamsFlds != 0) {

        var paraName = ""; var paraVal = ""; var fres = "";
        for (var cmp = 0; cmp < responseparamsFlds; cmp++) {
            paraName = params[cmp];
            paraVal = pvals[cmp];
            paraVal = CheckUrlSpecialChars(paraVal);
            fres = paraName + "=" + paraVal;
            // fres = fres.replace(/&/g, "--.--");
            fres = fres.replace(/%26/g, "--.--");
            paramsStr = paramsStr + "&" + fres;
        }
    }
    return paramsStr;
}

function CheckUrlSpecialChars(value) {
    value = value.replace(/%/g, "%25");
    value = value.replace(/#/g, "%23");
    value = value.replace(/&/g, "%26");
    value = value.replace(/'/g, "%27");
    value = value.replace(/"/g, "%22");
    value = value.replace("+", "%2b");
    value = value.replace(/ /g, "%20");
    value = value.replace(/\\/g, "%5C");
    value = value.replace(/</g, "%3C");
    value = value.replace(/>/g, "%3E");
    return value;
}

function ReplaceUrlSpecialChars(value) {
    value = value.replace(/%25/g, "%");
    value = value.replace(/%26/g, "&");
    value = value.replace(/%27/g, "'");
    value = value.replace(/%23/g, "#");
    value = value.replace(/%22/g, "\"");
    value = value.replace(/%2b/g, "+");
    value = value.replace(/%20/g, " ");
    value = value.replace(/%5C/g, "\\");
    value = value.replace(/%3C/g, "<");
    value = value.replace(/%3E/g, ">");
    return value;
}

function closeRemodalwindow() {
    if ($j("#popupIframeRemodal", parent.document).attr("src") != undefined) {
        $j('.remodal-close', parent.document).click();
    }
}


//Function which executes the commands in the result json.
function ExecCommand(cmdJsonObj, actnName, axpConfigNavType) {
    actnName = typeof actnName != "undefined" ? actnName : "";
    var popup = "";
    var pgname = "";
    var cmdName = ""; var cmdVal = ""; var multipleDocs;
    var saveAction = false;
    var lockedBy = "";
    var parFrm = $j("#axpiframe", parent.document);
    var curFrame = $(window.frameElement);
    // cmdJsonObj = _.uniqWith(cmdJsonObj, _.isEqual);
    var openIviewCmdIndex = cmdJsonObj.reduce((arr, cmd, index) => { cmd.cmd == 'openiview' ? arr.push(index) : ""; return arr; }, []);

    var saveAndPopupExist = false;

    for (var i = 0; i < cmdJsonObj.length; i++) {

        try {
            saveAndPopupExist = cmdJsonObj[i].cmd == "action" && cmdJsonObj[i].cmdval == "save" && cmdJsonObj.findIndex(val => val.showin == "pop") > -1;
            if (saveAndPopupExist) {
                eval(callParent('isSuccessAlertInPopUp') + "= true");
            }
        } catch (ex) { }

        if ((cmdJsonObj[i].cmd == "printfile" && cmdName != "" && cmdVal != "" && cmdName == cmdJsonObj[i].cmd && cmdVal == cmdJsonObj[i].cmdval) || (cmdJsonObj[i].cmd == "openiview" && openIviewCmdIndex.length > 0 && openIviewCmdIndex[0] != i) || saveAndPopupExist) {
            continue;
        }

        cmdName = cmdJsonObj[i].cmd;
        cmdVal = cmdJsonObj[i].cmdval;
        multipleDocs = cmdJsonObj[i].multiprintdocs;

        if (cmdJsonObj[i].lockedby)
            lockedBy = cmdJsonObj[i].lockedby;

        if (cmdName == "openfile" || cmdName == "printfile") {
            UpdateExceptionMessageInET("Action printfile/openfile result. Command name:"+cmdName+" Command Val:"+cmdVal);
            var docID;
            var fldPath;
            var filepath = "";
            var compressValue = "";
            var dirName = "";

            cmdVal = CheckUrlSpecialChars(cmdVal);
            var fldPrintDirective = GetFieldValue("axp_printdirective000F1");
            if (fldPrintDirective != "") {
                fldPath = fldPrintDirective.split('~');
                compressValue = fldPath[0].toString();

                //If fldPath[1] is empty what happens
                docID = GetFieldValue(fldPath[1] + "000F1");
                if (docID = undefined)
                    docID = "";

                if (fldPath.length > 2) {
                    filepath = fldPath[2].toString();
                }
            }

            var left = (screen.width / 2) - 200;
            var top = (screen.height / 2) - 100;

            if(saveAction && (typeof cmdVal=="undefined" || cmdVal==""))
                {
                    setTimeout(function () {
                        showAlertDialog("warning","Transaction saved successfully and there is an error while print. kindly load record from listview and print again.");
                    },10);
                    continue;
                }

            if (multipleDocs == "yes") {
                dirName = cmdJsonObj[i].directory;
                var na = "./OpenFiles.aspx?fpath=" + cmdVal + "&compress=" + compressValue + "&path=" + filepath + "&docid=" + docID + "&dirName=" + dirName;
                try {
                    try {
                        /**
                         * @description : Customize Tstruct Print Url(if returns string url) Or Customization for Javascript Print Operartion(if return true)
                         * @author Prashik
                         * @date 2020-06-30
                         * @param {object} url : export url object
                         * @return {[string/bool]}:
                            * If returns string(custom url: na) then it will be considered an updated url
                            * If returns true then next operations will be stopped and it will be considered that export operation is already completed in the given function
                         */
                        var tempUrl = axSetTstructPrint({ obj: cmdJsonObj[i], url: na, multipleDocs, fileName: cmdVal, compressValue, filepath, docID, dirName, isAttPDF }) || na;
                        if (tempUrl === true) {
                            continue;
                        } else {
                            na = tempUrl;
                        }
                    } catch (ex) { }
                    var windobj = window.open(na, "_blank");
                    windobj.focus();
                    windobj.close();
                } catch (ex) {
                   UpdateExceptionMessageInET("openfile exception : "+ex.message);
                    showAlertDialog("warning", eval(callParent('lcm[356]')));
                }
            }
            else {
try{
                if (cmdVal.toLowerCase().indexOf("pdf") > -1) {
                    dirName = "PDF";
                    compressValue = compressValue || "";

                    var isAttPDF = "F";
                    isAttPDF = cmdJsonObj[i].isatt;

                    if (compressValue.toLowerCase() == "true") {
                        var na = "./openfile.aspx?fpath=" + cmdVal + "&compress=" + compressValue + "&path=" + filepath + "&docid=" + docID + "&dirName=" + dirName;
                        try {
                            try {
                                /**
                                 * @description : Customize Tstruct Print Url(if returns string url) Or Customization for Javascript Print Operartion(if return true)
                                 * @author Prashik
                                 * @date 2020-06-30
                                 * @param {object} url : export url object
                                 * @return {[string/bool]}:
                                    * If returns string(custom url: na) then it will be considered an updated url
                                    * If returns true then next operations will be stopped and it will be considered that export operation is already completed in the given function
                                */
                                var tempUrl = axSetTstructPrint({ obj: cmdJsonObj[i], url: na, multipleDocs, fileName: cmdVal, compressValue, filepath, docID, dirName, isAttPDF }) || na;
                                if (tempUrl === true) {
                                    continue;
                                } else {
                                    na = tempUrl;
                                }
                            } catch (ex) { }
                            var windobj = window.open(na, "_blank");
                            windobj.focus();
                        } catch (ex) {
UpdateExceptionMessageInET("openfile exception : "+ex.message);
                            showAlertDialog("warning", eval(callParent('lcm[356]')));
                        }
                    }
                    else if (isAttPDF == "T") {
                        isSelfOpened = true;
                        cmdVal == undefined ? cmdVal = "" : cmdVal; compressValue == undefined ? compressValue = "" : compressValue; filepath == undefined ? filepath = "" : filepath; docID == undefined ? docID = "" : docID; dirName == undefined ? dirName = "" : dirName;
                        var na = "./openfile.aspx?fpath=" + cmdVal + "&compress=" + compressValue + "&path=" + filepath + "&docid=" + docID + "&dirName=" + dirName + "&Imp=t";
                        var curWin;
                        try {
                            try {
                                /**
                                 * @description : Customize Tstruct Print Url(if returns string url) Or Customization for Javascript Print Operartion(if return true)
                                 * @author Prashik
                                 * @date 2020-06-30
                                 * @param {object} url : export url object
                                 * @return {[string/bool]}:
                                    * If returns string(custom url: na) then it will be considered an updated url
                                    * If returns true then next operations will be stopped and it will be considered that export operation is already completed in the given function
                                */
                                var tempUrl = axSetTstructPrint({ obj: cmdJsonObj[i], url: na, multipleDocs, fileName: cmdVal, compressValue, filepath, docID, dirName, isAttPDF }) || na;
                                if (tempUrl === true) {
                                    continue;
                                } else {
                                    na = tempUrl;
                                }
                            } catch (ex) { }
                            if (typeof fixUnloadOnWindowSelfDownloads == "function") {
                                fixUnloadOnWindowSelfDownloads(window);
                            }
                            curWin = window.open(na, "_self");
                        } catch (ex) {
 UpdateExceptionMessageInET("openfile exception : "+ex.message);
                            if (typeof BeforeWindowClose == "function") {
                                window.onbeforeunload = BeforeWindowClose;
                            }
                        }
                    }
                    else if (cmdJsonObj.length == 1) {
                        if (iframeindex > -1 && iframeindex != null) {
                            var na = "./openfile.aspx?fpath=" + cmdVal + "&compress=" + compressValue + "&path=" + filepath + "&docid=" + docID + "&dirName=" + dirName;
                            try {
                                try {
                                    /**
                                     * @description : Customize Tstruct Print Url(if returns string url) Or Customization for Javascript Print Operartion(if return true)
                                     * @author Prashik
                                     * @date 2020-06-30
                                     * @param {object} url : export url object
                                     * @return {[string/bool]}:
                                        * If returns string(custom url: na) then it will be considered an updated url
                                        * If returns true then next operations will be stopped and it will be considered that export operation is already completed in the given function
                                    */
                                    var tempUrl = axSetTstructPrint({ obj: cmdJsonObj[i], url: na, multipleDocs, fileName: cmdVal, compressValue, filepath, docID, dirName, isAttPDF }) || na;
                                    if (tempUrl === true) {
                                        continue;
                                    } else {
                                        na = tempUrl;
                                    }
                                } catch (ex) { }
                                var windobj = window.open(na, "axpiframe");
                                windobj.focus();
                                // window.parent.closeFrame();
                                callParentNew("closeFrame()", "function");

                            } catch (ex) {
 UpdateExceptionMessageInET("openfile exception : "+ex.message);
                                // window.parent.closeFrame();
                                callParentNew("closeFrame()", "function");
                                showAlertDialog("warning", eval(callParent("lcm[356]")));
                            }
                        }
                        else if (cmdJsonObj[0].cmd == "printfile")
                            OpenPdfFile(cmdVal, filepath, docID, dirName, saveAction);
                        else {
                            var na = "./openfile.aspx?fpath=" + cmdVal + "&compress=" + compressValue + "&path=" + filepath + "&docid=" + docID + "&dirName=" + dirName;
                            try {
                                var params = [
                                    'height=' + screen.height,
                                    'width=' + screen.width,
                                    'fullscreen=yes', // only works in IE
                                    'scrollbars=yes',
                                    'resizable=yes'
                                ].join(',');

                                var winobj = window.open(na, "", params);
                                winobj.moveTo(0, 0);
                                winobj.focus();
                            }
                            catch (ex) {
 UpdateExceptionMessageInET("openfile exception : "+ex.message);
                                showAlertDialog("warning", eval(callParent('lcm[356]')));
                            }
                        }
                    } else if (cmdJsonObj.filter(function (itm) { return itm.cmd === 'printfile' }).length > 0) {
                        OpenPdfFile(cmdVal, filepath, docID, dirName, saveAction);

                    } else if (cmdJsonObj.length == 3 && cmdJsonObj[0].cmd == "action" && cmdJsonObj[2].cmd == "openfile") {
                        OpenPdfFile(cmdVal, filepath, docID, dirName, saveAction);
                    }
                    else {
                        var na = "./openfile.aspx?fpath=" + cmdVal + "&compress=" + compressValue + "&path=" + filepath + "&docid=" + docID + "&dirName=" + dirName;
                        try {
                            try {
                                /**
                                 * @description : Customize Tstruct Print Url(if returns string url) Or Customization for Javascript Print Operartion(if return true)
                                 * @author Prashik
                                 * @date 2020-06-30
                                 * @param {object} url : export url object
                                 * @return {[string/bool]}:
                                    * If returns string(custom url: na) then it will be considered an updated url
                                    * If returns true then next operations will be stopped and it will be considered that export operation is already completed in the given function
                                */
                                var tempUrl = axSetTstructPrint({ obj: cmdJsonObj[i], url: na, multipleDocs, fileName: cmdVal, compressValue, filepath, docID, dirName, isAttPDF }) || na;
                                if (tempUrl === true) {
                                    continue;
                                } else {
                                    na = tempUrl;
                                }
                            } catch (ex) { }
                            var params = [
                                'height=' + screen.height,
                                'width=' + screen.width,
                                'fullscreen=yes', // only works in IE
                                'scrollbars=yes',
                                'resizable=yes'
                            ].join(',');

                            var winobj = window.open(na, "", params);
                            winobj.moveTo(0, 0);
                            winobj.focus();
                        }
                        catch (ex) {
UpdateExceptionMessageInET("openfile exception : "+ex.message);
                            showAlertDialog("warning", eval(callParent('lcm[356]')));
                        }
                    }
                }
                else {
                    isSelfOpened = true;
                    cmdVal == undefined ? cmdVal = "" : cmdVal; compressValue == undefined ? compressValue = "" : compressValue; filepath == undefined ? filepath = "" : filepath; docID == undefined ? docID = "" : docID; dirName == undefined ? dirName = "" : dirName;
                    var na = "./openfile.aspx?fpath=" + cmdVal + "&compress=" + compressValue + "&path=" + filepath + "&docid=" + docID + "&dirName=" + dirName + "&Imp=t";
                    //var windobj = window.open(na, "_self");
                    //if (windobj != null)
                    //    windobj.focus();
                    var curWin;
                    try {
                        try {
                            /**
                            * @description : Customize Tstruct Print Url(if returns string url) Or Customization for Javascript Print Operartion(if return true)
                            * @author Prashik
                            * @date 2020-06-30
                            * @param {object} url : export url object
                            * @return {[string/bool]}:
                               * If returns string(custom url: na) then it will be considered an updated url
                               * If returns true then next operations will be stopped and it will be considered that export operation is already completed in the given function
                            */
                            var tempUrl = axSetTstructPrint({ obj: cmdJsonObj[i], url: na, multipleDocs, fileName: cmdVal, compressValue, filepath, docID, dirName, isAttPDF }) || na;
                            if (tempUrl === true) {
                                continue;
                            } else {
                                na = tempUrl;
                            }
                        } catch (ex) { }
                        if (typeof fixUnloadOnWindowSelfDownloads == "function") {
                            fixUnloadOnWindowSelfDownloads(window);
                        }
                        curWin = window.open(na, "_self");
                    } catch (ex) {
 UpdateExceptionMessageInET("openfile exception : "+ex.message);
                        if (typeof BeforeWindowClose == "function") {
                            window.onbeforeunload = BeforeWindowClose;
                        }
                    }
                }
  }catch(ex)
                    {
                        UpdateExceptionMessageInET("openfile/printfile outer exception : "+ex.message);
                        if (saveAction == true) 
                            showAlertDialog("warning","Transaction saved successfully and there is an error while print. kindly load record from listview and print again."+ex.message );
                        else
                            showAlertDialog("warning",ex.message );
                        continue;
                    }
            }

        }
        else if (cmdName == "recordlocked") {
            AxIsTstructLocked = cmdVal;
            var cutMsg = eval(callParent('lcm[46]'));
            ShowInfoDialog(cutMsg + " - " + lockedBy);
            //if a user already opened a transaction and if admin opened the same transaction then admin can forcefully unlock the transaction
            if (user == "admin")
                $("#dvMessage table tr").append('<a href="javascript:void(0)" id="lnkUnlockTstruct" onclick="javascript:forceUnlockTstruct();" title="Unlock" class="handCur">Unlock</a>').find("td").width("100%");
        }
        else if (cmdName == "done") {
            showAlertDialog("success", 2026, "client");
        }
        else if (cmdName == "new") {
 try{
                    UpdateExceptionMessageInET("Action new result. Command name:"+cmdName+" Command Val:"+cmdVal);
            AxActiveAction = "New";
            GetFldSetCarryValue();
            if (SetCarryFlds.length > 0) {
                var querySCFld = "";
                SetCarryFlds.forEach(function (qscFld) {
                    let qscFldName = qscFld.split("♠")[0];
                    qscFldName = qscFldName.substring(0, qscFldName.lastIndexOf("F") - 3);
                    let qscFldVal = qscFld.split("♠")[1];
                    querySCFld += "&" + qscFldName + "=" + qscFldVal;
                });
                querySCFld += "&act=open";
                AvoidPostBackAfterSave("tstruct.aspx?transid=" + transid + querySCFld + `&openerIV=${typeof isListView != "undefined" ? iName : transid}&isIV=${typeof isListView != "undefined" ? !isListView : "false"}`);
            }
            else
                AvoidPostBackAfterSave("tstruct.aspx?transid=" + transid + `&openerIV=${typeof isListView != "undefined" ? iName : transid}&isIV=${typeof isListView != "undefined" ? !isListView : "false"}`);
            //window.document.location.href = 'tstruct.aspx?transid=' + transid;
 }catch(ex)
                {
                    UpdateExceptionMessageInET("Command new exception : "+ex.message);
                }
        }
        else if (cmdName == "close") {
            closeRemodalwindow();
        }
        else if (cmdName == "refreshpage") {
            try {

                var url = "./tstruct.aspx?&transid=" + tst + `&openerIV=${typeof isListView != "undefined" ? iName : tst}&isIV=${typeof isListView != "undefined" ? !isListView : "false"}`;
                window.document.location.href = url;
                if (curFrame.attr("id") === "axpiframe") {
                    axFramReload = true;
                    ReloadMiddleIframe();
                }
            }
            catch (ex) {
                window.document.location.href = window.document.location.href;

            }
        }
        else if (cmdName == "refreshparent") {
            window.opener.location.reload();
        }
        else if (cmdName == "refresh") {
            SetSession({
                key: "IsFromChildWindow",
                val: "true"
            })

            iViewRefresh = true;

            var localIviewName = findGetParameter("ivname", window.document.location.href);
            if (localIviewName != null) {
                try {
                    var historyIviewLink = callParentNew("appLinkHistory")[callParentNew("curPageIndex")];
                    var historyIviewName = findGetParameter("ivname", historyIviewLink);
                    if (historyIviewName != null && historyIviewName == localIviewName) {
                        window.document.location.href = historyIviewLink;
                    } else {
                        window.document.location.href = window.document.location.href;
                    }
                } catch (ex) {
                    window.document.location.href = window.document.location.href;
                }
            } else {
                window.document.location.href = window.document.location.href;
            }
        }
        else if (cmdName == "canceled") {

            if (cmdVal != "no") {

                var canReason = cmdJsonObj[i].reason;
                ShowInfoDialog(cancelMsg + " " + canReason);
                tstructCancelled = "Cancelled";
                Readonlyform();
                var imgSave = $j("#imgSaveTst");

                if (imgSave.length > 0) {
                    imgSave.prop("disabled", true);
                    imgSave.attr("disabled", "disabled");
                    imgSave.css("cursor", "default");
                }
                var btnSave = $j("#btnSaveTst");
                if (btnSave.length > 0)
                    btnSave.attr("disabled", "disabled");
            }
        }
        else if (cmdName == "opentstruct" || cmdName == "clear") {
            var tstid = cmdVal;
            if (cmdName == "clear") {
                tstid = transid;
            }
            var popname = "openPop" + tstid;
            popup = cmdJsonObj[i].showin;
            var tparams = "";

            if (cmdJsonObj[i].pname) {
                tparams = ConstructParams(cmdJsonObj[i].pname, cmdJsonObj[i].pvalue);
            }

            //if (tparams != "")
            //    tparams = tparams + "&IsFrmAct=true";
            var designParam = "";
            if (actnName.startsWith("axpdesign_")) {
                designParam = "&theMode=design";
            }
            if ((axpConfigNavType == undefined || axpConfigNavType == "") && parFrm.hasClass("frameSplited"))
                popup = "split";
            else if (axpConfigNavType && axpConfigNavType != "") {

                if (axpConfigNavType == "split") {
                    popup = "split";
                }
                else if (axpConfigNavType == "popup") {
                    popup = "pop";
                }
                else if (axpConfigNavType == "newpage") {
                    popup = "newpage"
                }
                else
                    popup = "";
            }

            if (popup == "pop") {
                tparams = tparams + "&AxPop=true";
                //var openpopup = window.open('tstruct.aspx?act=open&transid=' + tstid + tparams, popname, 'width=800,height=500,scrollbars=yes,resizable=yes');
                var openpopup = 'tstruct.aspx?act=open&transid=' + tstid + tparams + designParam + `&openerIV=${typeof isListView != "undefined" ? iName : tstid}&isIV=${typeof isListView != "undefined" ? !isListView : "false"}`;
                createPopup(openpopup, true);
            }
            else if (popup == "newpage") {
                popupFullPage("tstruct.aspx?act=open&transid=" + tstid + tparams + designParam + `&openerIV=${typeof isListView != "undefined" ? iName : tstid}&isIV=${typeof isListView != "undefined" ? !isListView : "false"}`);
            }
            else if (popup != "split") {
                var redirectionLink = "tstruct.aspx?act=open&transid=" + tstid + tparams + designParam + `&openerIV=${typeof isListView != "undefined" ? iName : tstid}&isIV=${typeof isListView != "undefined" ? !isListView : "false"}`;
                var customCalled = false;
                try {
                    customCalled = loadInMiddle1(redirectionLink);
                } catch (ex) { }
                if (!customCalled)
                    window.document.location.href = redirectionLink;
            }
            else if (popup == "split") {
                callParentNew(`OpenOnPropertyBase(${"tstruct.aspx?act=open&transid=" + tstid + tparams + designParam + `&openerIV=${typeof isListView != "undefined" ? iName : tstid}&isIV=${typeof isListView != "undefined" ? !isListView : "false"}`})`, 'function');
            }

        }
        else if (cmdName == "loadtstruct") {

            var tstid = cmdVal;
            var popname = "loadPop" + tstid;
            popup = cmdJsonObj[i].showin;
            var tparams = "";

            if (cmdJsonObj[i].pname) {
                tparams = ConstructParams(cmdJsonObj[i].pname, cmdJsonObj[i].pvalue);
            }
            if ((axpConfigNavType == undefined || axpConfigNavType == "") && parFrm.hasClass("frameSplited"))
                popup = "split";
            else if (axpConfigNavType && axpConfigNavType != "") {

                if (axpConfigNavType == "split") {
                    popup = "split";
                }
                else if (axpConfigNavType == "popup") {
                    popup = "pop";
                }
                else if (axpConfigNavType == "newpage") {
                    popup = "newpage"
                }
                else
                    popup = "";
            }

            if (popup == "pop") {
                tparams = tparams + "&AxPop=true";
                //var loadpopup = window.open('tstruct.aspx?act=load&transid=' + tstid + tparams, popname, 'width=900,height=500,scrollbars=yes,resizable=yes');
                var loadpopup = 'tstruct.aspx?act=load&transid=' + tstid + tparams + `&openerIV=${typeof isListView != "undefined" ? iName : tstid}&isIV=${typeof isListView != "undefined" ? !isListView : "false"}`;
                createPopup(loadpopup, true);
            }
            else if (popup == "newpage") {
                popupFullPage("tstruct.aspx?act=load&transid=" + tstid + tparams + `&openerIV=${typeof isListView != "undefined" ? iName : tstid}&isIV=${typeof isListView != "undefined" ? !isListView : "false"}`);
            }
            else if (popup != "split") {

                window.document.location.href = "tstruct.aspx?act=load&transid=" + tstid + tparams + `&openerIV=${typeof isListView != "undefined" ? iName : tstid}&isIV=${typeof isListView != "undefined" ? !isListView : "false"}`;
            }
            else if (popup == "split") {
                callParentNew(`OpenOnPropertyBase(${"tstruct.aspx?act=load&transid=" + tstid + tparams + `&openerIV=${typeof isListView != "undefined" ? iName : tstid}&isIV=${typeof isListView != "undefined" ? !isListView : "false"}`})`, 'function');
            }
        }
        else if (cmdName == "openiview") {

            var ivn = cmdJsonObj[i].cmdval;
            var popname = "ivewPop" + ivn;
            popup = cmdJsonObj[i].showin;
            var tparams = "";

            if (cmdJsonObj[i].pname) {
                try {
                    tparams = ConstructParams(cmdJsonObj[i].pname, cmdJsonObj[i].pvalue);
                } catch (ex) { }

                if (document.title != "Iview") {
                    //tparams = "AxOpenIvAction=true";
                    tparams += (tparams ? "&" : "") + "AxIvNav=true";
                }
            }
            if ($j("#axp_ivname000F1").length > 0)
                ivn = $j("#axp_ivname000F1").val();


            if ((axpConfigNavType == undefined || axpConfigNavType == "") && parFrm.hasClass("frameSplited"))
                popup = "split";
            else if (axpConfigNavType && axpConfigNavType != "") {

                if (axpConfigNavType == "split") {
                    popup = "split";
                }
                else if (axpConfigNavType == "popup") {
                    popup = "pop";
                }
                else if (axpConfigNavType == "newpage") {
                    popup = "newpage"
                }
                else
                    popup = "";
            }

            if (popup == "pop") {
                var pop = "true";
                tparams = tparams + "&AxIsPop=true";
                var loadpopup = 'ivtoivload.aspx?ivname=' + ivn + "&" + tparams, popname;
                createPopup(loadpopup, true);

            }
            else if (popup == "newpage") {
                popupFullPage("ivtoivload.aspx?ivname=" + ivn + "&" + tparams);
            }
            else if (popup != "split") {
                var loadMiddle1URL = "ivtoivload.aspx?ivname=" + ivn + "&" + tparams;
                try {
                    if (window.frameElement.id == "middle1") {
                        callParentNew("middle1URL=", loadMiddle1URL);
                    }
                } catch (ex) { }

                // callParentNew("updateAppLinkObj(" + loadMiddle1URL + ",1)", "function");

                var srcUrl = "ivtoivload.aspx?ivname=" + ivn + "&AxIvNav=true";
                var linkParams = tparams;
                linkParams = linkParams.replace(/~/g, "=");
                linkParams = linkParams.replace(/¿/g, "&");
                linkParams = ReplaceUrlSpecialChars(linkParams);
                if (linkParams != "") {
                    setIviewNavigationData(linkParams, ivn);
                    callParentNew("updateAppLinkObj")?.(srcUrl,1,window?.frameElement?.id == "axpiframe");
                }
                window.document.location.href = srcUrl;

            }
            else if (popup == "split") {
                callParentNew(`OpenOnPropertyBase(${"ivtoivload.aspx?ivname=" + ivn + "&" + tparams})`, 'function');

            }
        }
        else if (cmdName == "openpage") {

            pgname = cmdVal;
            var tparams = "";

            if (cmdJsonObj[i].pname) {
                tparams = ConstructParams(cmdJsonObj[i].pname, cmdJsonObj[i].pvalue);
            }
            //window.document.location.href = "Actionpage.aspx?hltype=open&name=" + pgname + tparams;
            if (pgname != "" && pgname.toLowerCase().startsWith("pagets")) {
                pgname = pgname.substring(6);
                window.document.location.href = "tstruct.aspx?act=open&transid=" + pgname + tparams + `&openerIV=${typeof isListView != "undefined" ? iName : pgname}&isIV=${typeof isListView != "undefined" ? !isListView : "false"}`;
            }
            else if (pgname != "" && pgname.toLowerCase().startsWith("pageiv")) {
                pgname = pgname.substring(6);
                window.document.location.href = "ivtoivload.aspx?ivname=" + pgname + "&" + tparams + `&openerIV=${typeof isListView != "undefined" ? iName : pgname}&isIV=${typeof isListView != "undefined" ? !isListView : "false"}`;
            }
        }
        else if (cmdName == "openpdf") {

            var pdfpath = cmdVal;
            var len = pdfpath.length;
            var filepos = InStrPath(pdfpath) + 1;
            pdfpath = pdfpath.substring(filepos, len);
            window.location.href = "../" + pdfpath;
        }
        else if (cmdName == "pageload" || cmdName == "loadpage") {

            pgname = cmdVal;
            var tparams = "";

            if (cmdJsonObj[i].pname) {
                tparams = ConstructParams(cmdJsonObj[i].pname, cmdJsonObj[i].pvalue);
            }
            //window.document.location.href = "Actionpage.aspx?hltype=load&name=" + pgname + tparams;
            if (pgname != "" && pgname.toLowerCase().startsWith("pagets")) {
                pgname = pgname.substring(6);
                window.document.location.href = "tstruct.aspx?act=load&transid=" + pgname + tparams + `&openerIV=${typeof isListView != "undefined" ? iName : pgname}&isIV=${typeof isListView != "undefined" ? !isListView : "false"}`;
            }
            else if (pgname != "" && pgname.toLowerCase().startsWith("pageiv")) {
                pgname = pgname.substring(6);
                window.document.location.href = "ivtoivload.aspx?ivname=" + pgname + "&" + tparams;
            }
        }
        else if (cmdName == "action" && cmdVal == "save") {
            saveAction = true;
            AxActionSave = true;//To know that save action happened we need to reload the page after every action is done
        }
        else if (cmdName == "recid") {
            if (saveAction == true) {
UpdateExceptionMessageInET("Action save result. Command Val:save RecordId:"+cmdVal);
                $j("#recordid000F0").val(cmdVal);
                var recIdVal = $j("#recordid000F0").val();
                if (recIdVal != "0") {
                    saveActRecSuccess = true;
                    eval(callParent('isSuccessAlertInPopUp') + "= true");

                    if (curFrame.attr("id") === "axpiframe") {
                        axFramReload = true;
                        ReloadMiddleIframe();
                    }
                }
            }
        }
        else if (cmdName == "newtrans") {
            $j("#recordid000F0").val("0");
            recordid = "0";
        }
        else if (cmdName == "filepath") {
            try {
                var curWin;
                try {
                    if (typeof fixUnloadOnWindowSelfDownloads == "function") {
                        fixUnloadOnWindowSelfDownloads(window);
                    }
                    curWin = window.open('download.aspx', '_self', 'width=400,height=300,scrollbars=yes,resizable=yes');
                } catch (ex) {
                    if (typeof BeforeWindowClose == "function") {
                        window.onbeforeunload = BeforeWindowClose;
                    }
                }
            } catch (ex) {
                showAlertDialog("warning", eval(callParent('lcm[356]')));
            }
        }
        else if (cmdName == "copytrans") {
            if (cmdVal == "true") {
                $j("#recordid000F0").val("0")
                recordid = "0";
                isCopyTrans = true;
                //try {
                //    DoScriptFormControl("", "On Form Load");
                //} catch (ex) { }

                //try {
                //    if (AxRulesDefScriptOnLoad == "true")
                //        AxRulesScriptsParser("scriptonload", "");

                //    if (AxRuesDefScriptFormcontrol == "true")
                //        AxRulesScriptsParser("formcontrol", "");
                //} catch (ex) { }
            }

        }
    }
}

//to unlock a locked transaction forcefully by admin
function forceUnlockTstruct() {
    var rid = $j("#recordid000F0").val();
    if (rid != "0" && AxIsTstructLocked && callParentNew("isLockOnRead")) {
        try {
            ASB.WebService.UnlockTStructRecord(tst, rid, true, successUnlockTstruct);
        }
        catch (ex) { }
        function successUnlockTstruct(result, eventArgs) {
            location.reload();
        }
    }
}

//If two tasks are defined on one button then we need to redirect after doing all the tasks for this we moved the function outside
function redirectOnSaveAction() {
    var recIdVal = $j("#recordid000F0").val();
    let axpframe = callParentNew("axpiframe", "id");
    var axSplit = "";
    if (typeof axpframe != "undefined")
        axSplit = "&AxSplit=true";
    if (findGetParameter("AxPop") == "true" || findGetParameter("AxIsPop") == "true") {
        axSplit += "&AxPop=true";
    }
    if (recIdVal == "" || recIdVal == "0") {
        GetProcessTime();
        window.location.href = "tstruct.aspx?act=load&transid=" + tst + axSplit + "&hdnbElapsTime=" + callParentNew("browserElapsTime") + `&openerIV=${typeof isListView != "undefined" ? iName : tst}&isIV=${typeof isListView != "undefined" ? !isListView : "false"}`;
    }
    else if (transid == "axcal") {
        callParentNew('isSuccessAlertInPopUp=', true);
        callParentNew("closeModalDialog()", "function");
    }
    else {
        saveActRecSuccess = true;
        if (AxIsTstructCached) {
            SaveInCache(recIdVal, "SaveAction");
        }
        else {
            GetProcessTime();
            window.location.href = "tstruct.aspx?act=load&transid=" + tst + "&recordid=" + recIdVal + axSplit + "&hdnbElapsTime=" + callParentNew("browserElapsTime") + `&openerIV=${typeof isListView != "undefined" ? iName : tst}&isIV=${typeof isListView != "undefined" ? !isListView : "false"}`;
        }
    }
}


//Function which adds or deletes the rows to the given dc to make it equal to the rowCount.
function SetRows(dcNo, rowCount, delRows, calledFrom, oldHasData, dcHasRows) {
    var noNewRow = false;
    AxActiveDc = dcNo;
    var currentRowCnt = GetDcRowCount(dcNo);
    rowCount = parseInt(rowCount, 10);
    var rCntBfrDeleteAll = $j(".wrapperForGridData" + dcNo + " tbody tr").length;
    var dcIsPop = false;
    if (TstructHasPop) {
        dcIsPop = IsDcPopGrid(dcNo);
        if (dcIsPop && calledFrom == "GetDep") {
            //Get the parent row on which the get dependents was called
            //Then get the sub grid rows for the given parent row, and delete the respective row
            var popRows = GetPopRows(AxActivePDc, GetClientRowNo(AxActivePRow, AxActivePDc), dcNo);
            var strRows = popRows.split(",");
            var arrRows = new Array();
            for (var j = 0; j < strRows.length; j++) {
                arrRows.push(strRows[j]);
            }
            arrRows.sort();
        }
    }

    if (delRows != "") {
        var strDelRows;

        strDelRows = delRows.split(",");

        for (var i = 0; i < strDelRows.length; i++) {
            //noNewRow = false;
            var firstChar = strDelRows[i].substring(0, 1);
            var rowNo = strDelRows[i].substring(1);
            if (firstChar == "d") {

                if (rowNo == "*") {
                    var dcRowCnt = GetDcRowCount(dcNo);
                    if (dcHasRows != "no")
                        SetRowsInDc(dcNo, currentRowCnt, calledFrom);
                }
                else {
                    DeleteDbRow(dcNo, rowNo, calledFrom);
                }
            }
            else {

                if (TstructHasPop) {

                    //GetDep will always return the sub grid rows starting from "1" for the active parent row.
                    //For e.g the cr attribute will always have "i1,i2...." Hence just adding at the end.
                    //if (strDelRows[i].toString() != "i1" || (dcIsPop && calledFrom == "GetDep" && GetDcRowCount(dcNo) > 1)) {

                    var dcIdx = $j.inArray(dcNo, DCFrameNo);
                    if ((calledFrom == "LoadData" || (calledFrom == "GetDep" && rCntBfrDeleteAll == 0)) && ($j("#recordid000F0").val() != "0" || DCHasDataRows[dcIdx] == "True")) {
                        if (dcHasRows != "no") {
                            if (axInlineGridEdit)
                                addNewInlineGridRow(dcNo, calledFrom);
                            else
                                AddNewRowInDc(dcNo, calledFrom);
                        }
                    }
                    else if (strDelRows[i].toString() != "i1" || (dcIsPop && calledFrom == "GetDep" && oldHasData == "True")) {
                        AddRow(dcNo, calledFrom);
                        AxDepRows.push(rowNo + "~" + GetDcRowCount(dcNo));
                    }
                    else {
                        //if dc is pop grid or parent grid update the pop rows array
                        AxDepRows.push(rowNo + "~" + "1");
                        if (dcIsPop == true) {
                            if (calledFrom != "LoadData") {
                                $j("#sp" + dcNo + "R" + "001" + "F" + dcNo).show();
                                UpdateNewPopInfo(dcNo, "001");
                                UpdatePopUpArrays(dcNo, "001", true, "Add");
                                UpdateDcRowArrays(dcNo, "001", "Add");
                            }
                        }
                        else {
                            UpdatePopUpArrays(dcNo, "001", false, "Add");
                            UpdateDcRowArrays(dcNo, "001", "Add");
                        }
                    }
                }
                else {
                    var dcIdx = $j.inArray(dcNo, DCFrameNo);
                    //if (delRows.indexOf("d*") != -1 && $j("#hdnRCntDc" + dcNo).length > 0 && (parseInt(currentRowCnt, 10) - 1) > 0) {
                    //    noNewRow = true;
                    //}

                    if ((calledFrom == "LoadData" || (calledFrom == "GetDep" && rCntBfrDeleteAll == 0)) && ($j("#recordid000F0").val() != "0" || DCHasDataRows[dcIdx] == "True")) {
                        if (calledFrom == "GetDep" && strDelRows[i].toString() == "i1" && delRows.indexOf("i2") == -1 && DCHasDataRows[dcIdx] == "False") {
                            //do nothing
                        }
                        else {
                            if (dcHasRows != "no") {
                                if (axInlineGridEdit)
                                    addNewInlineGridRow(dcNo, calledFrom);
                                else if (!axInlineGridEdit && AxpGridForm == "form")
                                    AddNewFormRowInDc(dcNo, calledFrom);
                                else
                                    AddNewRowInDc(dcNo, calledFrom);
                            }
                        }
                    }
                    else {
                        if ((strDelRows[i].toString() != "i1" && strDelRows[i].toString() != "") || (strDelRows[i].toString() == "i1" && delRows.indexOf("i2") != -1)) {
                            //AddRow(dcNo, calledFrom);
                            if (axInlineGridEdit)
                                addNewInlineGridRow(dcNo, calledFrom);
                            else if (!axInlineGridEdit && AxpGridForm == "form")
                                AddNewFormRowInDc(dcNo, calledFrom);
                            else
                                AddNewRowInDc(dcNo, calledFrom);
                            if((calledFrom == "GetDep" || calledFrom == "Action") && strDelRows[i].toString() == "i1" && delRows.indexOf("d*") != -1 && dcHasRows == "yes")
                            {
                                if (gridDummyRowVal.length > 0) {
                                    gridDummyRowVal.map(function (v) {
                                        if (v.split("~")[0] == dcNo)
                                            gridDummyRowVal.splice($.inArray(v, gridDummyRowVal), 1);
                                    });
                                }
                            }
                        }//In case of Getdep- if the cr attribute has "d*,i1" it was not adding the row
                        else if ((calledFrom == "GetDep" || calledFrom == "Action") && strDelRows[i].toString() == "i1" && delRows.indexOf("i2") == -1 && delRows.indexOf("d*") != -1 && dcHasRows == "yes") {
                            if (axInlineGridEdit)
                                addNewInlineGridRow(dcNo, calledFrom);
                            else if (!axInlineGridEdit && AxpGridForm == "form")
                                AddNewFormRowInDc(dcNo, calledFrom);
                            else
                                AddNewRowInDc(dcNo, calledFrom);

                            if (gridDummyRowVal.length > 0) {
                                gridDummyRowVal.map(function (v) {
                                    if (v.split("~")[0] == dcNo)
                                        gridDummyRowVal.splice($.inArray(v, gridDummyRowVal), 1);
                                });
                            }

                        }
                    }
                }
            }
        }

        ResetSerialNo(dcNo, "000F" + dcNo, rowCount, true);
        swicthCompressMode("#divDc" + dcNo);
    }
}

//Function to remove the row from the poprows array when the service is returning the row in cr attribute.
function DeletePopRows(dcNo, rowNo) {
    for (var i = 0; i < PopGridDcNo.length; i++) {
        if (PopGridDcNo[i] == dcNo) {
            var strRows = PopRows[i].toString().split(",");
            var newStr = "";
            for (var j = 0; j < strRows.length; j++) {
                if (strRows[j] != rowNo) {
                    if (newStr == "")
                        newStr = strRows[j];
                    else
                        newStr += "," + strRows[j];
                }
            }
            PopRows[i] = newStr;
        }
    }
}


function DeleteDbRow(dcNo, dbRowNo, calledFrom) {

    var clientRowNo = GetClientRowNo(dbRowNo, dcNo);
    var onlyRow = IsSingleRow(dcNo);
    if (!onlyRow) {
        UpdateChangedDbRow(dcNo, dbRowNo, "Delete");
        DeleteRowHtml(dcNo, clientRowNo);
        if (TstructHasPop) {
            var dcIsPop = IsDcPopGrid(dcNo);
            if (dcIsPop == true) {
                DeletePopRows(dcNo, clientRowNo);
                if (dbRowNo == "1")
                    UpdatePopUpArrays(dcNo, "001", true, "Delete");
            }
        }

        var dcRowCount = GetDcRowCount(dcNo);
        dcRowCount = parseInt(dcRowCount, 10) - 1;
        SetRowCount(dcNo, dcRowCount);
        //ResetSerialNo(dcNo, clientRowNo + "F" + dcNo, dcRowCount);
        var slNo = GetSerialNoCnt(dcNo);
        slNo = parseInt(slNo, 10) - 1;
        SetSerialNoCnt(dcNo, slNo);
    }
    else {
        if (calledFrom != "LoadData")
            ClearDeletedFields(dcNo, clientRowNo);
    }
}

function UpdateChangedDbRow(dcNo, dbRowNo, action, rowNo) {
    var found = false;
    var indx = -1;
    for (var i = 0; i < RowDcNo.length; i++) {

        if (RowDcNo[i] == dcNo && DbRowNo[i] == dbRowNo) {
            indx = i;
            found = true;
            break;
        }
    }

    if (action == "Delete") {
        if (found && indx != -1) {
            RowDcNo.splice(indx, 1);
            DbRowNo.splice(indx, 1);
            ClientRowNo.splice(indx, 1);
            ResetDbRowNo(dcNo, dbRowNo, action);
        }
    }
    else {
        if (found && indx != -1) {
            RowDcNo.insert(indx, dcNo);
            DbRowNo.insert(indx, dbRowNo);
            ClientRowNo.insert(indx, rowNo);
            ResetDbRowNo(dcNo, dbRowNo, action);
        }
    }
}

function DeleteRowHtml(dcNo, rowNo) {
    var rowId = "#sp" + dcNo + "R" + rowNo + "F" + dcNo;
    $j(rowId).remove();
}

//function SetRowsForFirmBind(dcNo, rowCount) {

//    var popRows = GetPopRows(AxActivePDc, AxActivePRow, dcNo);

//}

//Function to clear and add rows in the grid with the given rowcount.
function SetRowsInDc(dcNo, rowCount, calledFrom) {

    if ($j("#hdnRCntDc" + dcNo).length > 0) {
        //Rows sent by the service minus 1 because after clearing the rows there will be only one row in the grid.
        //AGI003505 - not reducing rowcount  for inline grid
        var addRows = 0;
        if (calledFrom == "LoadData" && rowCount > 0)
            addRows = parseInt(rowCount, 10);
        else
            addRows = axInlineGridEdit ? rowCount : parseInt(rowCount, 10) - 1;
        if (addRows > 0) {
            ClearRowsInGrid(dcNo, calledFrom);
            // return true;
        }
        else {
            var clientRowNo = GetClientRowNo("1", dcNo);
            ClearDeletedFields(dcNo, clientRowNo, "", true);
            // return false;
        }
    } else {
        // return false;
    }
}

//Function to clear all rows except the first row in the Grid.
function ClearRowsInGrid(gridDcNo, calledFrom) {

    var spanDc = document.getElementById("Frame" + gridDcNo);

    var rCount = 0;
    rCount = GetDcRowCount(gridDcNo);
    rCount = parseInt(rCount, 10);
    if (calledFrom == "LoadData")
        rCount = rCount + 1;
    else
        rCount = axInlineGridEdit ? rCount + 1 : rCount;
    if (rCount >= 1) {
        //If there are more than 1 row in the grid, add the extra rowno to DeletedDCRows.
        //Remove the entry of the fields in the extra rows from the field arrays.

        for (var i = rCount - 1; i >= 1; i--) {

            var rowNo = GetClientRowNo(i, gridDcNo);
            var rowFrmNo = rowNo + "F" + gridDcNo;
            var a = "sp" + gridDcNo + "R" + rowNo + "F" + gridDcNo;
            if ($j("tr#" + a).length > 0) {
                if ($j("tr#" + a).hasClass('inEditMode'))
                    $j("#editCancelButton" + gridDcNo).click();
                $j("tr#" + a).remove();
            } else if ($j("div#" + a).hasClass("editWrapTr")) {
                //changeEditLayoutIds(rowNo, gridDcNo, "d*");
            }
            UpdateDcRowArrays(gridDcNo, rowNo, "Delete");

            //The below loop will replace the edit row in the dc arrays to 001 row after delete all rows
            for (var ind = 0; ind < RowDcNo.length; ind++) {
                if (RowDcNo[ind] == gridDcNo && parseInt(ClientRowNo[ind], 10) == (i + 1)) {

                    if (i == rCount - 1 && IsRowDupInDcArray(gridDcNo, "001")) {
                        ClientRowNo[ind] = "001";
                        UpdateDcRowArrays(gridDcNo, ClientRowNo[ind], "Delete");
                    }
                    else if (i == rCount - 1)
                        ClientRowNo[ind] = "001";
                }
            }

            var flds = GetGridFields(gridDcNo);

            for (var j = 0; j < flds.length; j++) {
                var fld = flds[j] + rowFrmNo;
                RemoveDeletedFields(fld);
            }
        }

        //Below code is added to delete the wrapper row and add new as 001, some cases it was 004 and causing problem when further rows were added.
        //Refer bug no AGI003506
        var lastRowNo = GetClientRowNo("1", gridDcNo);
        UpdateDcRowArrays(gridDcNo, lastRowNo, "Delete");
        UpdateDcRowArrays(gridDcNo, "001", "Add");

        //clear the last row item fields
        var fields = GetGridFields(gridDcNo);
        for (var i = 0; i < fields.length; i++) {
            var fld = fields[i] + "001F" + gridDcNo;
            CallSetFieldValue(fld, "");
        }
    }
    changeEditLayoutIds(0, gridDcNo);
    SetRowCount(gridDcNo, "1", undefined, calledFrom);
    SetSerialNoCnt(gridDcNo, "1");
}

function IsRowDupInDcArray(dcNo, rowNo) {
    var cnt = 0;
    for (var ind = 0; ind < RowDcNo.length; ind++) {
        if (RowDcNo[ind] == dcNo && ClientRowNo[ind] == rowNo) {
            cnt++;
        }
    }
    if (cnt > 1)
        return true;
    else
        return false;
}

//Function which returns the component name of the field.
function ConstructFieldName(fldName, dcNo, dbRowNo) {

    var clientRowNo = GetClientRowNo(dbRowNo, dcNo);
    var fieldName = fldName + clientRowNo + "F" + dcNo;
    return fieldName;
}

//Function which returns the first row in the dc.
function GetFirstRow(dcNo) {

    var firstRow = "";
    var rows = new Array();

    rows = GetDcClientRows(dcNo);

    firstRow = rows.getMinVal();

    return firstRow;
}

//Function which copies the items to the field from the field in the first row of the given dcno.
function CopyFromMasterRow(fldId, dcNo, masterRow, calledFrom, keyColValue, isPopGrid) {
    var fldName = GetFieldsName(fldId);
    var srcFldName = "";
    if (IsDcGrid(dcNo)) {
        var rowNo = 0;

        var formatGridIdx = GetFormatGridIndex(dcNo);
        if (formatGridIdx != -1) {
            if (keyColValue && keyColValue != "") {
                var tableName = "gridDc" + dcNo;
                var hdrRowIndx = GetFormatRowIndex(tableName, dcNo, keyColValue, "header");
                var newRowId = $j('#' + tableName + ' tbody>tr:eq(' + (hdrRowIndx + 1) + ')').attr("id");
                var fIdx = newRowId.lastIndexOf("F");
                masterRow = newRowId.substring(fIdx - 3, fIdx);  //sp3R036F3
            }
        }
        else {

            masterRow = GetFirstRow(dcNo);
        }

        rowNo = GetRowNoHelper(masterRow);
        srcFldName = fldName + rowNo + "F" + dcNo;

        var cFld = $j("#" + fldId);
        if (cFld.attr("type") == "select-one" || cFld.prop("type") == "select-one") {

            if ($j("#" + fldId + " option").length > 0) {
                $j("#" + fldId + " option").remove();
            }

            $j("#" + srcFldName + " option").each(function () {
                var newOption = $j(this);
                $j("#" + fldId).append($j('<option>', {
                    value: newOption.val(),
                    text: newOption.text()
                }));
            });

            //Below code will set the selected item as first item if the fld has sql which returns only one item and autoselect is true
            var srcIdx = $j("#" + srcFldName)[0].selectedIndex;
            if ($j("#" + fldId + " option").length == 2) {
                var fIndex = $j.inArray(fldName, FNames);
                //&& FldIsSql[fIndex] == "True"
                if (FldAutoSelect[fIndex] == "True" && srcIdx == 1)
                    $j("#" + fldId)[0].selectedIndex = 1;
                else
                    $j("#" + fldId)[0].selectedIndex = 0;
            }
            else
                $j("#" + fldId)[0].selectedIndex = 0;
            if (isPopGrid == undefined)
                isPopGrid = IsDcPopGrid(dcNo);
            //RedrawField(fldId, calledFrom, isPopGrid);
        }
        else {
            if (!$j("#" + fldId).hasClass("fldFromSelect") && !$j("#" + fldId).hasClass("fldmultiSelect"))
                $j("#" + fldId).val($j("#" + srcFldName).val());
        }
    }
}

//Function to apply partial disabling of the grid rows.
function DoFormControlPrivilege(fldName, value) {
    if (appstatus == "Approved" || appstatus == "Rejected")
        return;
    var curFieldName = ""; var fIndx = 0; var rowNo; var dcNo;
    rowNo = GetFieldsRowNo(fldName);
    dcNo = GetFieldsDcNo(fldName);

    if (fldName != null && fldName != undefined) {
        //Check column header
        if (fldName.indexOf("axpvalid") != -1) {

            if (value != "" && value != undefined) {
                //B-Delete button disable
                var strValue = value.toString().toUpperCase();
                if (strValue == "B")
                    DisableDeleteBtn("grdchkItemTd" + rowNo + "F" + dcNo, strValue,dcNo);
                //A-Current row enable.
                else if (strValue == "A")
                    DisableDeleteBtn("grdchkItemTd" + rowNo + "F" + dcNo, strValue,dcNo);
                //C-Current Row disable
                else if (strValue == "C") {
                    //Get current img button and disabled here
                    DisableDeleteBtn("grdchkItemTd" + rowNo + "F" + dcNo, strValue,dcNo);

                    //Get current row controls and  disabled here
                    var flds = GetGridFields(dcNo);
                    for (var j = 0; j < flds.length; j++) {
                        var fldName = flds[j] + rowNo + "F" + dcNo;
                        var fld = $j("#" + fldName);
                        if (fld.length > 0) {
                            fld.prop("disabled", true);
                        }
                        $j("#sp" + dcNo + "R" + rowNo + "F" + dcNo).find(".pickimg").each(function () {
                            $j(this).prop("disabled", true);
                            $j(this).css('cursor', 'default');
                        });
                    }
                }
                  //D-Current Row disable and Delete button enabled.
                else if (strValue == "D") {
                    //Get current img button and enabled here
                    DisableDeleteBtn("grdchkItemTd" + rowNo + "F" + dcNo, strValue,dcNo);

                    //Get current row controls and  disabled here
                    var flds = GetGridFields(dcNo);
                    for (var j = 0; j < flds.length; j++) {
                        var fldName = flds[j] + rowNo + "F" + dcNo;
                        var fld = $j("#" + fldName);
                        if (fld.length > 0) {
                            fld.prop("disabled", true);
                        }
                        $j("#sp" + dcNo + "R" + rowNo + "F" + dcNo).find(".pickimg").each(function () {
                            $j(this).prop("disabled", true);
                            $j(this).css('cursor', 'default');
                        });
                    }
                }
                DisNewGridDelBtn(dcNo, rowNo, strValue);
            }
        }
    }
}

function DisNewGridDelBtn(dcNo, rowNo, strValue) {
    try {
        if (strValue == "B" || strValue == "C") {
            $("#sp" + dcNo + "R" + rowNo + "F" + dcNo + " td:first").find('.glyphicon.glyphicon-remove icon-arrows-remove').addClass('disabled').prop("disabled", true);
            $("#sp" + dcNo + "R" + rowNo + "F" + dcNo + " td:first").find('.glyphicon.glyphicon-trash').addClass('disabled').prop("disabled", true);
            if (strValue == "C")
                $("#sp" + dcNo + "R" + rowNo + "F" + dcNo + " td:first").find('.glyphicon.glyphicon-pencil.icon-software-pencil').addClass('disabled').prop("disabled", true);
       }else if (strValue == "D") {
                $("#sp" + dcNo + "R" + rowNo + "F" + dcNo + " td:first").find('.glyphicon.glyphicon-trash').removeClass('disabled').prop("disabled", false);
                $("#sp" + dcNo + "R" + rowNo + "F" + dcNo + " td:first").find('.glyphicon.glyphicon-trash').parent().removeClass('disabled').prop("disabled", false)
        }
    }
    catch (ex) { }
}

function DisableDeleteBtn(delBtnId, strValue,dcNo) {
    delImg = $j("#" + delBtnId);
    if (delImg.length > 0) {
        if (strValue == "C" || strValue == "B") {
            $j("#" + delBtnId).prop("disabled", true);
            $j("#" + delBtnId).unbind('click');
            $j("#chkallgridrow"+dcNo).prop("disabled", true);
            $j("#chkallgridrow"+dcNo).unbind('click');            
        }
        else {
            $j("#" + delBtnId).prop("disabled", false);
            $j("#" + delBtnId).bind('click');
            $j("#chkallgridrow"+dcNo).prop("disabled", false);
            $j("#chkallgridrow"+dcNo).bind('click');       
        }
    }
}
//-----------------Functions used in attachments---------------------------


//Function to attach the attachments to the tstruct. 
function AttachFiles() {
    if (tstReadOnly)
        return;
    // displayBootstrapModalDialog("File Upload", "xs", "147px", true, "./fileupload.aspx?act=attach")
    $j("#attachment-overlay").removeClass("d-none");
}

function callAfterFileAttach() {
    var fileupld = $j("#attachfname").val();
    SetFormDirty(true);
    var isduplicate = FindDuplicate(fileupld);
    if (isduplicate) {
        showAlertDialog("warning", 2027, "client");
        return;
    }
    filenamearray.push(fileupld);
    ConstructAttachments();
}

//Function to display the attachments attached to the tstruct. 
function ConstructAttachments() {

    var attachments = "";
    var hdnattachcounts = "";
    var attcount = 0;
    var rid = 0;


    if ($j("#recordid000F0").length > 0)
        rid = $j("#recordid000F0").val();

    if (fileonloadarray.length > 0) {

        for (var j = 0; j < fileonloadarray.length; j++) {

            var attachstr = '"' + fileonloadarray[j].toString() + '"';
            attcount = parseInt(j, 10) + 1;
            if (j == 0) {

                attachments += "<div class=\"row attachmentData\"><div class=\"col-md-4 col-sm-6\"><div class=\"attachments\"><a class='linkrem' alt='Remove File' onclick='javascript:RemoveFile(" + attachstr + "," + rid + ");'><img  class='close pull-right' src='../axpimages/icons/16x16/cross.png' alt='delete' /></a>&nbsp;<a id=loadattach" + attcount + " class=\"pull-left Attachlink flagcount\" style=\"cursor:pointer;\" onclick='javascript:OpenAttachment(" + attachstr + "," + rid + ");'>" + fileonloadarray[j].toString() + "</a></div></div>";
            } else {

                attachments += "<div class=\"col-md-4 col-sm-6\"><div class=\"attachments\"><a class='linkrem' alt='Remove File' onclick='javascript:RemoveFile(" + attachstr + "," + rid + ");'><img class='close pull-right' src='../axpimages/icons/16x16/cross.png' alt='delete' /></a>&nbsp;<a id=loadattach" + attcount + " class=\"pull-left Attachlink flagcount\" style=\"cursor:pointer;\" onclick='javascript:OpenAttachment(" + attachstr + "," + rid + ");'>" + fileonloadarray[j].toString() + "</a></div></div>";

            }
        }

    }

    if (filenamearray.length > 0) {

        for (var k = 0; k < filenamearray.length; k++) {

            var attachstr = filenamearray[k].toString();
            attachstr = CheckUrlSpecialChars(attachstr);
            var attachstr = '"' + attachstr + '"';

            if (attcount == 0) {
                attcount = 1;
                attachments += "<div class=\"row attachmentData\"><div class=\"col-md-4 col-sm-6\"><div class=\"attachments\"> <a class=\"pull-left Attachlink flagcount\"  id=loadattach\" + attcount + \" style=\"cursor:pointer;\" onclick='javascript:OpenAttachment(" + attachstr + "," + rid + (rid > 0 ? ",true" : "") + " );' >" + filenamearray[k].toString() + "</a> <a class=linkrem alt=Remove File onclick='javascript:RemoveNewFiles(" + attachstr + ");'> <img class=\"close pull-right\" src=\"../axpimages/icons/16x16/cross.png\"  alt=\"\"> </a><div class=\"clear\"></div></div></div>";

            }
            else {
                attcount = parseInt(attcount, 10) + 1;
                attachments += "<div class=\"col-md-4 col-sm-6\"><div class=\"attachments\"> <a class=\"pull-left Attachlink flagcount\"  id=loadattach\" + attcount + \" style=\"cursor:pointer;\"  onclick='javascript:OpenAttachment(" + attachstr + "," + rid + (rid > 0 ? ",true" : "") + ");' >" + filenamearray[k].toString() + "</a> <a class=linkrem alt=Remove File onclick='javascript:RemoveNewFiles(" + attachstr + ");'> <img class=\"close pull-right\" src=\"../axpimages/icons/16x16/cross.png\"  alt=\"\"> </a><div class=\"clear\"></div></div></div>";
            }
        }
        attachments += "</div>";
    }

    hdnattachcounts += "<input id=hdncount type=hidden value=" + attcount + ">";
    if(attcount>0)
    $j("#attachment-overlay").removeClass("d-none");
    if (GetFieldIndex("axp_attachedfiles") != -1) {
        var expAttField = GetActualFieldName("axp_attachedfiles");
        var attValue = filenamearray.join(',');
        var acFrNo = GetFieldsDcNo(expAttField);
        var rowNum = GetDbRowNo(GetFieldsRowNo(expAttField), acFrNo);
        var fldRowNo = GetFieldsRowNo(expAttField)
        UpdateFieldArray(expAttField, rowNum, attValue, "parent");
        CallSetFieldValue(expAttField, attValue);
    }
}

//Function to remove the files which is uploaded attachments. 
function RemoveNewFiles(filename) {

    filename = ReplaceUrlSpecialChars(filename);
    try {
        ASB.WebService.RemoveNewFiles(filename, sid);
    }
    catch (exp) {
        AxWaitCursor(false);
        showAlertDialog("error", ServerErrMsg);
    }
    RemoveArrVal(filename, filenamearray);
    var fld = $j("#attachment-overlay");
    fld.hide();
    ConstructAttachments();
    adjustwin("100", window);
}

var attFileName = "";
var delFiles="";
//Function to call the webservice to remove the uploaded attachments.
function RemoveFile(fname, rid,delFileObj) {
    if (typeof tstructCancelled != "undefined" && tstructCancelled.toLowerCase() === "cancelled") {
        showAlertDialog("warning", eval(callParent('lcm[303]')));
        return;
    }
    delFiles=delFileObj;
    attFileName = ReplaceUrlSpecialChars(fname);
    var cutMsg = eval(callParent('lcm[47]'));
    var glType = eval(callParent('gllangType'));
    var isRTL = false;
    if (glType == "ar")
        isRTL = true;
    else
        isRTL = false;
    var RemoveFileCB = $.confirm({
        theme: 'modern',
        title: eval(callParent('lcm[155]')),
        onContentReady: function () {
            disableBackDrop('bind');
        },
        backgroundDismiss: 'false',
        rtl: isRTL,
        escapeKey: 'buttonB',
        content: cutMsg,
        buttons: {
            buttonA: {
                text: eval(callParent('lcm[164]')),
                btnClass: 'btn btn-primary',
                action: function () {
                    RemoveFileCB.close();
                    RemoveFileAfterConfirm();
                }
            },
            buttonB: {
                text: eval(callParent('lcm[192]')),
                btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                action: function () {
                    disableBackDrop('destroy');
                    return;
                }
            }
        }
    });

    function RemoveFileAfterConfirm() {
        var sxml = '<root axpapp="' + proj + '"  sessionid="' + sid + '"  filename="' + fname + '" transid="' + tst + '"  recordid="' + rid + '"   trace="' + trace + '">';

        try {
            ASB.WebService.RemoveAttachment(sxml, tstDataId, SuccessRemAttFile);
        }
        catch (exp) {
            AxWaitCursor(false);
            showAlertDialog("error", ServerErrMsg);
        }
    }
}

//Callback function for RemoveAttachedFiles.
function SuccessRemAttFile(result, eventArgs) {
    if (CheckSessionTimeout(result))
        return;
    var myJSONObject = $j.parseJSON(result);
    if (myJSONObject.message) {
        var msg = myJSONObject.message[0].msg;
        if (msg == "done") {
            RemoveArrVal(attFileName, fileonloadarray);
            //RemoveArrVal(attFileName, filenamearray);
            const dropzone = document.querySelector("#attachment-overlay");
            var myDropzone = Dropzone.forElement(dropzone);
            myDropzone.removeFile(delFiles);
            SetFormDirty(true);
        }
        else {
            showAlertDialog("error", msg);
        }
    }
}

//Function to remove the file from the array , once removed from the path.
function RemoveArrVal(flname, arrayname) {

    for (var i = 0; i < arrayname.length; i++) {

        if (flname == arrayname[i]) {
            arrayname.splice(i, 1);
            break;
        }
    }
}

//Function to call the service to view the attachments.
function OpenAttachment(a, b, isNew) {
    a = ReplaceUrlSpecialChars(a);
    var ofXml = '<root axpapp="' + proj + '"  sessionid="' + sid + '"  filename="' + a + '" transid="' + tst + '"  recordid="' + b + '"   trace="♦♦GetAttachedFile♦">';

    try {
        var ic = $j(".attachmentData a").length / 2;
        if (b == 0 || b == "" || $j(".attachmentData .flagcount").length != ic || isNew) {
            var str = "{\"command\":[{\"cmd\":\"openfile\",\"cmdval\":";
            str = str + "\"" + a + "\",\"isatt\":\"T\"" + "}]}";
            SuccChoicesOpenAtt(str, null);
        }
        else
            ASB.WebService.ViewAttachment(ofXml, tstDataId, SuccChoicesOpenAtt);

    }
    catch (exp) {
        AxWaitCursor(false);
        showAlertDialog("error", ServerErrMsg);
    }
}

//Callback function for ViewAttachment service call.
function SuccChoicesOpenAtt(result, eventArgs) {
    if (CheckSessionTimeout(result))
        return;
    AssignLoadValues(result, "");
}

//Function to open a file which is attached newly. 
//function OpenNewFile(openFileName) {

//    var path = openFileName;

//    if (path != "") {
//        var na = "./openfile.aspx?fpath=" + path;
//        var left = (screen.width / 2) - (500 / 2);
//        var top = (screen.height / 2) - (400 / 2);
//        window.open(na, "_blank");
//    }
//}

//Function to clear the value from the html file control.
//function ClearInputFile() {

//    // to clear the input file data [ supports only for IE ]
//    var fileUploadCtrl = document.getElementById("filMyFile");
//    var fileUploadClone = fileUploadCtrl.cloneNode(false);
//    fileUploadClone.onchange = fileUploadCtrl.onchange;
//    fileUploadCtrl.parentNode.replaceChild(fileUploadClone, fileUploadCtrl);
//}

//Function to find the duplicate attachment.
function FindDuplicate(fileupld) {

    for (var j = 0; j < fileonloadarray.length; j++) {
        if (fileupld == fileonloadarray[j])
            return true;
    }
    for (var k = 0; k < filenamearray.length; k++) {
        if (fileupld == filenamearray[j])
            return true;
    }
    return false;
}

function EvalPrepared(fldName, rowNo, exprStr, exprType) {
    if (exprStr != "")
        exprStr = exprStr.replace(/♦/g, ",");
    var fName = GetFieldsName(fldName);
    wordlist = new Array();
    var fldIdx = $j.inArray(fName, FNames);
    var posStr = "";
    if (fldIdx != -1) {
        posStr = ExprPosArray[fldIdx];
    }

    //Add a function CheckEval to check for Eval() and return the expression
    var estr = CheckEval(exprStr, rowNo);
    if (estr != exprStr) {
        posStr = "";
    }
    exprStr = estr;

    if (posStr == "") {
        posStr = PrepareExpression(fName, exprStr, exprType);
        ExprPosArray[fldIdx] = posStr;
    }
    wordlist = new Array();
    var startPos = posStr.toString().substring(0, posStr.toString().indexOf(","));
    var endPos = posStr.toString().substring(posStr.toString().indexOf(",") + 1);

    startPos = parseInt(startPos, 10);
    endPos = parseInt(endPos, 10);

    for (var i = startPos; i <= endPos; i++) {
        var strExp = EWords[i];
        var ch = strExp.split('');
        var firstchar = ch[0];
        if (firstchar == 'v') {
            var fName = strExp.substring(1);
            var fldVal = PrepareField(fName, rowNo);
            strExp = fldVal;
        }
        else if (firstchar == 'c') {
            //if tstruct field name and defined expression field name are not matched(case sensitive) then take the fields as lower case
            var fName = strExp.substring(1);
            fName = GetExactFieldName(fName);
            strExp = 'c' + fName;
        }
        wordlist.push(strExp);
    }

    var fun = true;
    for (var i = 0; i < wordlist.length; i++) {
        if (wordlist[i] == "sFIELDCHANGED" || wordlist[i].toString().toLowerCase() == "sfieldchanged")
            fun = false;
    }
    if (fun) {
        EvalFun();
        var s = GetExprString();
        if (s == "")
            return "";
        try {
            var res = eval(s);
        }
        catch (ex) {

            try {
                var res = eval("'" + s + "'");
            }
            catch (exp) {
                res = "";
            }
        }
        if (res == "Infinity") res = 0;
        return res;
    }
    else {
        return true;
    }
}

function PrepareField(fldName, rowNo) {

    var fldVal = "";
    var templ = "";
    if (fldName.toString().toLowerCase() == "activerow") {
        fldVal = GetClientRowNo(AxActiveRowNo, AxActiveDc);
    }
    else if (fldName.toString().toLowerCase() == "activeprow") {
        fldVal = GetClientRowNo(AxActivePRow, AxActivePDc);
    }
    else {
        var dcNo = GetDcNo(fldName);
        fldName = GetExactFieldName(fldName);
        if (IsDcGrid(dcNo))
            templ = fldName + GetClientRowNo(rowNo, dcNo) + "F" + dcNo;
        else
            templ = fldName + "000F" + dcNo;
        if (document.getElementById(templ)) {
            chrstate = false;
            templ = templ;
        }
        else {
            chrstate = false;
            var dcNo = GetDcNo(fldName);
            var clientRow = "";
            if (IsDcPopGrid(dcNo)) {
                clientRow = GetClientRowNo(AxActiveRowNo, AxActiveDc);
                templ = fldName + clientRow + "F" + AxActiveDc;
            }
            else if (TstructHasPop && IsDcParentGrid(dcNo)) {
                if (AxActivePRow != "" && AxActivePDc != "") {
                    clientRow = GetClientRowNo(AxActivePRow, AxActivePDc);
                    templ = fldName + clientRow + "F" + AxActivePDc;
                }
                else {
                    clientRow = GetClientRowNo(AxActiveRowNo, AxActiveDc);
                    templ = fldName + clientRow + "F" + AxActiveDc;
                }
            }
            else if (IsDcGrid(dcNo) && rowNo == "000") {
                clientRow = GetClientRowNo(AxActiveRowNo, dcNo);
                templ = fldName + clientRow + "F" + dcNo;
            }
            else {
                templ = fldName + rowNo + "F" + dcNo;
            }

            if (document.getElementById(templ)) {
                templ = templ;
            }
            else {

                //This condition is for fields in the unopened tabs. In this case the field is not available. 
                //If the field is a tstruct field and is a unopened tab field assign empty value else assign fieldname as value.
                var fIdx = $j.inArray(fldName, FNames);
                if (fIdx != -1)
                    fldv = "";
                else
                    fldVal = fldName;
                // begin for

                for (var amk = 0; amk < axMemVarList.length; amk++) {
                    if (fldVal == axMemVarList[amk].toLowerCase()) {
                        chrstate = true;
                        fldVal = axMemVarValue[amk];
                        var dtlenth = fldVal.split('/');
                        if (dtlenth[0].length == 2 && (typeof dtlenth[1] != "undefined" && dtlenth[1].length == 2) && (typeof dtlenth[2] != "undefined" && dtlenth[2].length == 4)) {
                            fldVal = 'd' + fldVal;
                        }
                        else if (isNaN(fldVal)) {
                            fldVal = 's' + fldVal;
                        }
                        else {
                            if (fldVal == "") fldVal = 0;
                            fldVal = fldVal;
                            fldVal = 'n' + fldVal;
                            if (fldVal.length == 1)
                                fldVal = 'n' + 0;
                        }
                    }
                }

                if (!chrstate) {
                    for (var k = 0; k < varlist.length; k++) {
                        if (fldVal == varlist[k].toLowerCase()) {
                            chrstate = true;
                            fldVal = valuelist[k];
                            var dtlenth = fldVal.split('/');
                            //if (dtlenth[0].length == 2 && dtlenth[1].length == 2 && dtlenth[2].length == 4) {
                            if (dtlenth[0].length == 2 && (typeof dtlenth[1] != "undefined" && dtlenth[1].length == 2) && (typeof dtlenth[2] != "undefined" && dtlenth[2].length == 4)) {
                                fldVal = 'd' + fldVal;
                            }
                            else if (isNaN(fldVal)) {
                                fldVal = 's' + fldVal;
                            }
                            else {
                                if (fldVal == "") fldVal = 0;
                                fldVal = fldVal;
                                fldVal = 'n' + fldVal;
                                if (fldVal.length == 1)
                                    fldVal = 'n' + 0;
                            }
                        }
                    }
                }
            }
        }
        if (!chrstate) {
            if (document.getElementById(templ)) {
                fldVal = GetFieldValue(templ);
                if (fldName == AxAutoGenFld && fldVal == "Auto")// //Refer Bug: HEA000077, Expression is autogenerate field and value is "Auto" so expression value should be empty.  
                    fldVal = "";

                var fldIdx = $j.inArray(fldName, FNames);
                var fldDType = "";
                if (fldIdx != -1)
                    fldDType = FDataType[fldIdx].toString();

                if (fldDType != "") {
                    if (fldDType == "Date/Time") {
                        //var glCulture = eval(callParent('glCulture'));
                        //if (fldVal != "" && glCulture != undefined && glCulture == "en-us") {
                        //    fldVal = GetDateStr(fldVal, "mm/dd/yyyy", "dd/mm/yyyy");
                        //}
                        ////fldVal = "s" + fldVal;
                        fldVal = "d" + fldVal;
                    }
                    else if (fldDType == "Character" || fldDType == "Text") {
                        fldVal = "s" + fldVal;
                    }
                    else {
                        if (fldVal.length > 3) {
                            if (fldVal.indexOf(',') != -1)
                                fldVal = removeCommas(fldVal);
                        }

                        if (fldVal == "") fldVal = 0;
                        fldVal = 'n' + fldVal;
                        if (fldVal.length == 1)
                            fldVal = 'n' + 0;
                    }
                }
                else {
                    if (isNaN(fldVal)) {
                        fldVal = 's' + fldVal;
                    }
                    else {
                        if (fldVal.length > 3) {
                            if (fldVal.indexOf(',') != -1)
                                fldVal = removeCommas(fldVal);
                        }
                        if (fldVal == "") fldVal = 0;
                        fldVal = 'n' + fldVal;
                        if (fldVal.length == 1)
                            fldVal = 'n' + 0;
                    }
                }
            }
            else {
                templ = fldName;
                if (fldVal != "") {
                    if (isNaN(fldVal))
                        t = 's';
                    else
                        t = 'n';

                    fldVal = t + fldVal;
                }
            }
        }
    }

    for (var r = 0; r < funclist.length; r++) {
        if (templ.toLowerCase() == funclist[r].toString().toLowerCase()) {
            fldVal = 'f' + funclist[r];
            chrstate = true;
            break;
        }
    }
    return fldVal;
}

function CheckSpecialCharInGlobalVar(str) {
    str = str.replace(/;bkslh/g, "\\");
    return str;
}

function PrepareExpression(FieldName, Expstr, exprtype) {
    expressiontype = exprtype;
    var i = 0;
    var tem = '';
    varlist = new Array();
    valuelist = new Array();

    axMemVarList = new Array();
    axMemVarValue = new Array();

    wordlist = new Array();
    var w = 0;
    expFldname = FieldName;
    var trid = transid;
    var fIndx = FieldName.lastIndexOf("F");

    var expression = Expstr;
    if (Parameters.length > 1) {
        for (var pki = 0; pki < Parameters.length; pki++) {
            var list = Parameters[pki].toString();
            list = list.split("~");
            varlist[w] = list[0].toString();
            valuelist[w] = CheckSpecialCharInGlobalVar(list[1].toString());
            w++;
        }
    }

    varlist[w] = "activerow";
    valuelist[w] = AxActiveRowNo;

    if (AxMemParameters.length > 1) {
        for (var ami = 0; ami < AxMemParameters.length; ami++) {
            var list = AxMemParameters[ami].toString();
            list = list.split("~");
            axMemVarList[ami] = list[0].toString();
            axMemVarValue[ami] = list[1].toString().replace(/&quot;/g, '"')
        }
    }

    var tempvar = new Array();
    var tempval = new Array();
    var vi = 0;
    var ji = 0;
    var Isfound = false;
    var tempcount = 0;
    expression = TrimAll(expression);
    expression = expression + " ";
    var ch = expression.split('');
    for (var j = 0; j < ch.length; j++) {

        if (ch[j] == "{") {
            if (bcount > 0) {
                wordstring = wordstring + ch[j];
            }
            else {
                constword = true;
                wordstring = '';
            }
            bcount++;
            continue;
        }

        if (ch[j] == "}") {
            if (bcount == 1) {
                constword = false;
                s = "c" + wordstring;
                wordlist[i] = s;
                i++;
                bcount = 0;
                wordstring = '';
            }
            else {
                bcount--;
                wordstring = wordstring + ch[j];
            }
            continue;
        }

        if (constword) {
            wordstring = wordstring + ch[j];
            continue;
        }
        var t;

        //begin checking for what type of data it is
        if (isDelimiter(ch[j]) || isOperator(ch[j])) {
            if (wordstring != "") {
                wordstring = 'v' + wordstring;
                wordlist[i] = wordstring;
                i++;
            }
            wordstring = '';

        }
        if (ch[j] == "(") {
            if (wordlist.length > 0) {
                var fchar = wordlist[wordlist.length - 1];
                fchar = fchar.substr(0, 1);
                if (fchar == 'f' || fchar == 'v')
                    brackets = brackets + 'v';
                else
                    brackets = brackets + '(';
            }
            else {
                brackets = brackets + '(';
            }
            wordlist[i] = 'b(';
            i++;
            continue;
        }
        if (ch[j] == ")") {
            if (brackets.charAt(brackets.length - 1) == "(") {
                wordlist[i] = 'b)';
                i++;
            }
            else {
                wordlist[i] = 'e';
                i++;
            }
            brackets = brackets.slice(0, -1);
            continue;
        }

        if (isOperator(ch[j])) {
            wordlist[i] = 'o' + ch[j];
            i++;
            continue;
        }

        if (ch[j] == ' ')
            continue;

        if (ch[j] == ',') {
            wordlist[i] = 'l,';
            i++;
            wordstring = '';
            continue;
        }
        wordstring = wordstring + ch[j];
    }

    var startIdx = EWords.length;
    for (var eIdx = 0; eIdx < wordlist.length; eIdx++) {
        EWords.push(wordlist[eIdx]);
    }

    var endIdx = EWords.length - 1;
    return startIdx + "," + endIdx;
}

///Function to save the current tstruct as draft under the drafts folder. 
function SaveAsDraft() {
    // ShowDimmer(true);
    try {
        if (AxGlobalChange == true) {
            var strTabDCStatus = getTabDCStatus();
            ASB.WebService.SaveAsDraft(ChangedFields, ChangedFieldDbRowNo, ChangedFieldValues, DeletedDCRows, tst, tstDataId, strTabDCStatus, SuccessCallbackDrafts, OnSaveDraftException);
        }
    }
    catch (exp) {
        ShowDimmer(false);
        AxWaitCursor(false);
    }
}


function getTabDCStatus() {
    var text = "";
    for (i = 0; i < TabDCs.length; i++) {
        text += "DC" + TabDCs[i] + "-" + TabDCStatus[i] + ",";
    }
    return text.slice(0, -1);
}

function SuccessCallbackDrafts(result, eventArgs) {
    if (CheckSessionTimeout(result))
        return;
    ShowDimmer(false);
}

function OnSaveDraftException(result) {
    AxWaitCursor(false);
    ShowDimmer(false);

}
// function to get dependent array of auto generated field.BookingNo000F1substring(1)
function GetDependentArray() {
    var depArray = new Array();
    if (displayAutoGenVal != "true") {
        // Below code will handle one autogenerated field per transaction
        // if more than one autogenetated is present , needs to handle
        if ($j(".autogen").length > 0) {
            var fieldID = $j(".autogen")[0].id;
            var fieldName = GetFieldsName(fieldID);
            var fldIdx = GetFieldIndex(fieldName);
            var depStr = "";
            AxAutoGenFld = fieldName;
            if (fldIdx != -1)
                depStr = FldDependents[fldIdx].toString().substring(1);

            if (depStr != "")
                depArray = depStr.split(",");
        }
    }
    return depArray
}

function ClearImageSrc(delObj) {
    if (!IsFormDirty)
        SetFormDirty(true);
    var id = delObj.id;
    var imgId = id.replace("del-", "").trim();
    //if image control already has a image
    // $j("#" + imgId).hasClass("signaturePad") ? $j("#" + imgId).attr("src", "../AxpImages/signature.png") : "";//$j("#" + imgId).attr("src", "../AxpImages/upload.png");
    $("#" + imgId).parents(".image-input").find(".delete-button").addClass("d-none");
    $("#" + imgId).parents(".image-input").find(".imageFileUpload").removeClass("d-none");
    $("#" + imgId).parents(".image-input").find(".profile-pic").addClass("d-none");
    var rowNo = parseInt(GetFieldsRowNo(imgId), 10);
    UpdateFieldArray(imgId, rowNo, "", "parent", "");
    UpdateAllFieldValues(imgId, "");
}

function CheckAllListItems(obj) {
    //id = chkAll_ + chkid
    var id = obj.id;
    var checkAll = true;
    if ($j("#" + id).prop("checked"))
        checkAll = true;
    else
        checkAll = false;
    var compId = id.replace("chkAll_", "").trim();
    var showSelectedId = $j("#hideAll_" + compId);
    var selectAllId = $j("#chkAll_" + compId);

    var fldChkSep = GetChkSeparator(GetFieldsName(compId));
    if (checkAll) {
        var chkAllValue = '';
        $j("input:checkbox[id='" + compId + "']").each(function () {
            if ($j(this).prop("disabled") == false) {
                $j(this).attr("checked", "checked");
                $j(this).prop("checked", true);
                var chkValue = $j(this).val();
                if (chkAllValue == "")
                    chkAllValue = chkValue;
                else
                    chkAllValue += fldChkSep + chkValue;
            }
        });
        if (chkAllValue != '')
            UpdateAssignedFld(compId);
        //SetFieldValue(compId, chkAllValue, false, "SelectAll");
    }
    else {
        $j("input:checkbox[id='" + compId + "']").each(function () {
            $j(this).removeAttr("checked");
            $j(this).prop("checked", false);
        });
    }

    //when select all and show selected are checked show all the items in list
    if (selectAllId.prop("checked") && showSelectedId.prop("checked")) {
        ShowSelectedChkItems("hideAll_" + compId);
    }

    //when show selected is checked and uncheck the select all.
    //remove checked from show selected. 
    if ((!selectAllId.prop("checked")) && showSelectedId.prop("checked")) {
        showSelectedId.removeAttr("checked");
        showSelectedId.prop("checked", false);
    }

    try {
        AxAfterCheckAll();
    }
    catch (Ex) { }

    if (typeof wsPerfEnabled != "undefined" && wsPerfEnabled)
        CheckDependencyPerf(compId);
    else
        CheckDependency(compId);
}


function ShowSelectedChkItems(id) {
    if (id != undefined) {
        var checkAll = true;
        if ($j("#" + id).prop("checked"))
            checkAll = true;
        else
            checkAll = false;
        var compId = id.replace("hideAll_", "").trim();

        $j("input:checkbox[id='" + compId + "']").each(function () {
            if (checkAll) {
                if (!$j(this).attr('checked')) {
                    $j(this).parent().hide();

                }
                else {

                    $j(this).parent().show();
                }

            }
            else {
                $j(this).parent().show();
            }
        });
    }
}


function SetDcCaption(dcNo, caption) {
    //if (TabDCs.indexOf(dcNo) > -1) //indexof method does not support in IE8
    if ($j.inArray(dcNo, TabDCs) > -1)
        $j("#ank" + dcNo + " span.text").text(caption);
    else
        $j("#dcCaption" + dcNo).text(caption);
}

function SetDynamicDcCaptions(dcNo) {
    dcNo = dcNo || "";
    for (var i = 0; i < DCFrameNo.length; i++) {
        if (dcNo == "" || dcNo == DCFrameNo[i]) {
            var str = DCCaption[i].toString();
            if (str.indexOf("{") != -1) {
                var flds = GetWordsBetweenCurlies(str);
                for (var j = 0; j < flds.length; j++) {
                    //if (flds[j].trim() == "rowcount") {
                    //    str = str.replace("{" + flds[j] + "}", $j(".wrapperForGridData" + dcNo + " tbody tr").length);
                    //} else {
                    //    str = str.replace("{" + flds[j] + "}", "");
                    //}

                    var fldName = GetExactFieldName(flds[j]);
                    var fldIdx = GetFieldIndex(fldName);
                    var value = "";
                    if (fldIdx != -1) {
                        var fldDcNo = GetDcNo(fldName);
                        if (IsGridField(fldName))
                            value = GetFieldValue(fldName + GetRowNoHelper(AxActiveRowNo) + "F" + fldDcNo);
                        else
                            value = GetFieldValue(fldName + "000F" + fldDcNo);
                    }
                    else
                        value = CheckGlobalVars(fldName);
                    str = str.replace("{" + flds[j] + "}", value);
                }
                SetDcCaption(DCFrameNo[i], str);
            }
        }
    }
}

function GetWordsBetweenCurlies(str) {
    var results = [], re = /{([^}]+)}/g, text;

    while (text = re.exec(str)) {
        results.push(text[1]);
    }
    return results;
}

function EvaluateDcCaption(depfName, fieldID) {
    var depDcs = depfName.split(",");
    for (var idx = 0; idx < depDcs.length; idx++) {
        for (var i = 0; i < DCFrameNo.length; i++) {
            if (DCFrameNo[i].toString() == depfName) {
                var str = DCCaption[i].toString();
                if (str.indexOf("{") != -1) {
                    var flds = GetWordsBetweenCurlies(str);
                    for (var j = 0; j < flds.length; j++) {
                        var fldName = GetExactFieldName(flds[j]);
                        var fldIdx = GetFieldIndex(fldName);
                        var value = "";
                        if (fldIdx != -1) {
                            EvaluateAxFunction(fldName, fldName);
                            var fldDcNo = GetDcNo(fldName);
                            var value = GetFieldValue(fldName + GetRowNoHelper(AxActiveRowNo) + "F" + fldDcNo);
                        }
                        else {
                            value = CheckGlobalVars(fldName);
                        }
                        str = str.replace("{" + flds[j] + "}", value);
                    }
                    SetDcCaption(DCFrameNo[i], str);
                    break;
                }
            }
        }
    }
}

var arrGlobalVars = new Array();
var arrGlobalVarValues = new Array();
function CheckGlobalVars(fldName) {
    var pIndex = 0;
    if (Parameters.length > 1 && arrGlobalVars.length == 0) {
        for (var pki = 0; pki < Parameters.length; pki++) {
            var list = Parameters[pki].toString();
            list = list.split("~");
            arrGlobalVars[pIndex] = list[0].toString();
            arrGlobalVarValues[pIndex] = CheckSpecialCharInGlobalVar(list[1].toString());
            pIndex++;
        }
    }
    var idx = -1;
    idx = $j.inArray(fldName, arrGlobalVars);
    if (idx != -1)
        return arrGlobalVarValues[idx];
    else
        return fldName;
}


//Updates the currency value from axpcurrencydec to the client arrays
function UpdateAxpCurrDec(fieldValue, calledFrom) {

    var currFields = new Array(); var currDec = "";
    currFields = fieldValue.split(',');

    if (currFields.length > 0 && fieldValue != "") {
        currDec = currFields[0].toString();
        var fldIdx = -1;
        for (var idx = 1; idx < currFields.length; idx++) {

            var fName = currFields[idx];
            if (currFields[idx].indexOf("~") > -1)
                fName = currFields[idx].toString().substr(0, currFields[idx].indexOf('~'));

            fldIdx = $j.inArray(fName, FNames);
            //check this array
            FDecimal[fldIdx] = currDec;

            if (currFields[idx].indexOf("~") > -1)
                currDec = currFields[idx].toString().substring((currFields[idx].toString().lastIndexOf('~') + 1));

            //Refresh the fields in the axpcurrencydep to display the proper decimal values
            if (calledFrom == "GetDep") {
                currdecVal = "";
                if (parseInt(currDec, 10) > parseInt(FDupDecimals[fldIdx], 10)) {
                    showAlertDialog("warning", 2031, "client", FCaption[fldIdx]);
                    currdecVal = FCaption[fldIdx];
                    return;
                }
                var fldId = "";
                var dcNo = FldFrameNo[fldIdx];
                if (IsGridField(fName)) {
                    var rowCnt = 0;
                    rowCnt = parseInt(GetDcRowCount(dcNo), 10);

                    for (var i = 1; i <= rowCnt; i++) {
                        var rowNo = GetClientRowNo(i, dcNo);
                        fldId = fName + rowNo + "F" + dcNo;
                        var newValue = NumericFldOnBlur(GetFieldValue(fldId), fldIdx);
                        SetFieldValue(fldId, newValue);
                        UpdateFieldArray(fldId, i, newValue, "parent");
                    }
                }
                else {
                    fldId = fName + "000F" + dcNo;
                    var newValue = NumericFldOnBlur(GetFieldValue(fldId), fldIdx);
                    SetFieldValue(fldId, newValue);
                    var fRowNo = GetFieldsRowNo(fldId);
                    var dbRowNo = GetDbRowNo(fRowNo, dcNo);
                    UpdateFieldArray(fldId, dbRowNo, newValue, "parent", "");

                }
            }
        }
    }
}

//In grid attachment, if reference is there, expression will contain the filepath.
//So no need of evaluating the expression
function GetReferExpr(exprFldName, clientRowNo, expression) {

    var expr = expression;
    if (expression.indexOf("@") > -1) {
        expr = expression.substring(1, expression.indexOf("}"));
    }
    else if (expression.startsWith("{") > -1)
        expr = expression.substring(1, expression.indexOf("}"));
    else
        expr = Evaluate(exprFldName, clientRowNo, expression, "expr");
    return expr;
}

//var AxActiveAutoFld = "";
//function SetFastAutoComplete() {
//    $j(".axlist").keypress(function (e) {        
//        var id = $(this).attr("id");
//        var fldVal = GetFieldValue(id);
//        AxActiveAutoFld = id;
//        if (fldVal.length > 1) {
//            var fldName = GetFieldsName(id);           
//            try {
//                ASB.WebService.GetFastAjaxData(tstDataId, fldName, fldVal, SuccessFastAutoComp, OnException);
//            }
//            catch (exp) {
//                AxWaitCursor(false);
//                showAlertDialog("error", "Error: Name: " + exp.name + " Message: " + exp.message);
//            }
//        }
//    });
//}

//function SuccessFastAutoComp(result, eventArgs)
//{
//    if (result != "")
//    {
//        var fastItems = result.split("♣"); var i;
//        var dtList = $j("#axlist-" + AxActiveAutoFld);
//        for (i = 0;i<fastItems.length;i++)
//        {
//            var option = document.createElement('option');
//            option.value = fastItems[i];
//            dtList.append(option);
//        }
//    }
//}


function OpenPdfFile(cmdVal, filepath, docID, dirName, saveAction) {
    cmdVal = cmdVal || "", filepath = filepath || "", docID = docID || "", dirName = dirName || "";
    if (saveAction) {
        eval(callParent('isSaveAndPrintClick') + "= true");
        eval(callParent('isSavePrintValues') + ".push(cmdVal)");
        eval(callParent('isSavePrintValues') + ".push(filepath)");
        eval(callParent('isSavePrintValues') + ".push(docID)");
        eval(callParent('isSavePrintValues') + ".push(dirName)");
        return;
    }

    eval(callParent('isSaveAndPrintClick') + "= false");
    eval(callParent('isSavePrintValues') + "=[]");

    $j.ajax({
        url: 'openfile.aspx/GetPdfFile',
        type: 'POST',
        cache: false,
        async: false,
        data: JSON.stringify({ urfpath: cmdVal, urdocid: docID, urpath: filepath, dirName: dirName }),
        dataType: 'json',
        contentType: "application/json",
        beforeSend: function () {
            ShowDimmer(true);
        },
        success: function (data) {
            if (data.d != null || data.d != "") {
                if (data.d != "error") {
                    if (jQBrowser.chrome || jQBrowser.opera || jQBrowser.safari) {
                        try {
                            if (!isMobile) {
                                if (openFastReportInNewWindow) {
                                    var URL = data.d;
                                    var W;
                                    try {
                                        var params = [
                                            'height=' + screen.height,
                                            'width=' + screen.width,
                                            'fullscreen=yes', // only works in IE
                                            'scrollbars=yes',
                                            'resizable=yes'
                                        ].join(',');

                                        W = window.open(URL, "", params);
                                        W.moveTo(0, 0);
                                        W.window.focus();
                                    } catch (ex) {
UpdateExceptionMessageInET("printfile exception : "+ex.message);
                                        showAlertDialog("warning", eval(callParent('lcm[356]')));
                                    }
                                }
                                else {
                                    printJS(data.d);
                                }
                            }
                            else {
                                var URL = data.d;
                                var W;
                                try {
                                    var params = [
                                        'height=' + screen.height,
                                        'width=' + screen.width,
                                        'fullscreen=yes', // only works in IE
                                        'scrollbars=yes',
                                        'resizable=yes'
                                    ].join(',');

                                    W = window.open(URL, "", params);
                                    W.moveTo(0, 0);
                                    W.window.focus();
                                } catch (ex) {
UpdateExceptionMessageInET("printfile exception : "+ex.message);
                                    showAlertDialog("warning", eval(callParent('lcm[356]')));
                                }
                            }
                        } catch (ex) {
                            var URL = data.d;
                            var W;
                            try {
                                var params = [
                                    'height=' + screen.height,
                                    'width=' + screen.width,
                                    'fullscreen=yes', // only works in IE
                                    'scrollbars=yes',
                                    'resizable=yes'
                                ].join(',');

                                W = window.open(URL, "", params);
                                W.moveTo(0, 0);
                                W.window.focus();
                            } catch (ex) {
UpdateExceptionMessageInET("printfile exception : "+ex.message);
                                showAlertDialog("warning", eval(callParent('lcm[356]')));
                            }
                        }
                    }
                    else
                        if (jQBrowser.mozilla) {
                            var URL = data.d;
                            var W;
                            try {
                                var params = [
                                    'height=' + screen.height,
                                    'width=' + screen.width,
                                    'fullscreen=yes', // only works in IE
                                    'scrollbars=yes',
                                    'resizable=yes'
                                ].join(',');

                                W = window.open(URL, "", params);
                                W.moveTo(0, 0);
                                W.window.focus();
                            } catch (ex) {
  UpdateExceptionMessageInET("printfile exception : "+ex.message);
                                showAlertDialog("warning", eval(callParent('lcm[356]')));
                            }
                        }
                        else if (jQBrowser.msie) {
                            var URL = data.d;
                            var W;
                            try {
                                var params = [
                                    'height=' + screen.height,
                                    'width=' + screen.width,
                                    'fullscreen=yes', // only works in IE
                                    'scrollbars=yes',
                                    'resizable=yes'
                                ].join(',');

                                W = window.open(URL, "", params);
                                W.moveTo(0, 0);
                                W.window.focus();
                            } catch (ex) {
UpdateExceptionMessageInET("printfile exception : "+ex.message);
                                showAlertDialog("warning", eval(callParent('lcm[356]')));
                            }
                        }
                        else if (jQBrowser.msedge) {
                            var fileUrl = data.d;
                            var win;
                            try {
                                win = window.open("", "fasrreport", "width=600,height=400,menubar=yes,toolbar=yes,location=yes,status=yes,scrollbars=auto,resizable=yes");
                                win.location.href = fileUrl;
                                win.focus();
                                setTimeout(function () {
                                    win.print();
                                }, 5000);
                            } catch (ex) {
UpdateExceptionMessageInET("printfile exception : "+ex.message);
                                showAlertDialog("warning", eval(callParent('lcm[356]')));
                            }
                        }
                        else {
                            var URL = data.d;
                            var W;
                            try {
                                var params = [
                                    'height=' + screen.height,
                                    'width=' + screen.width,
                                    'fullscreen=yes', // only works in IE
                                    'scrollbars=yes',
                                    'resizable=yes'
                                ].join(',');

                                W = window.open(URL, "", params);
                                W.moveTo(0, 0);
                                W.window.focus();
                            } catch (ex) {
 UpdateExceptionMessageInET("printfile exception : "+ex.message);
                                showAlertDialog("warning", eval(callParent('lcm[356]')));
                            }
                        }
                    setTimeout(function () {
                        deletepdffile(data.d);
                    }, 1000);
                }
                else {
UpdateExceptionMessageInET("printfile exception : "+data.d);
                    ShowDimmer(false);
                    ShowDialog("warning", data.d);
                }
            }
            else {
 UpdateExceptionMessageInET("printfile exception : "+2022);
                ShowDimmer(false);
                ShowDialog("warning", 2022, "client");
            }
        },
        error: function (xhr, textStatus, errorThrown) {
 UpdateExceptionMessageInET("printfile exception : "+2022);
            ShowDimmer(false);
            ShowDialog("warning", 2022, "client");
        }
    });
}
function deletepdffile(filePath) {
    $j.ajax({
        url: 'openfile.aspx/DeletePrintPDF',
        type: 'POST',
        cache: false,
        data: JSON.stringify({ pdfPath: filePath }),
        async: false,
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            ShowDimmer(false);
        },
        error: function (xhr, textStatus, errorThrown) {
            ShowDimmer(false);
        }
    });
}

//Function to execute the Error message node in the json result.
function ExecErrorMsg(ErroMsgJsonObj, calledFrom) {

    for (var i = 0; i < ErroMsgJsonObj.length; i++) {
        var errMsg = ErroMsgJsonObj[i].msg;
        var errFld="";
        // if (ErroMsgJsonObj[i].errfld)
        //     errFld = ErroMsgJsonObj[i].errfld;

        var index = errMsg.indexOf("^^dq");
        while (index != -1) {
            errMsg = errMsg.replace("^^dq", '"');
            index = errMsg.indexOf("^^dq");
        }

        if (errMsg != null && errMsg != undefined && errMsg != "") {
            if (errMsg.indexOf("errfld") > -1) {
                let errfldInfo=errMsg.substring(errMsg.lastIndexOf("errfld"));
                errfldInfo=errfldInfo.split(":")[1];
                errFld=errfldInfo.replace("\"", "").trim();
                errMsg = errMsg.substring(0, errMsg.lastIndexOf("errfld") - 2);
                errMsg = errMsg.replace("\",", "").replace("\" ,", "");
            }
            UpdateExceptionMessageInET(calledFrom + " Error : " + errMsg);
            if (calledFrom == "Action") {
                GetProcessTime();
                GetTotalElapsTime();
            }
            showAlertDialog("error", errMsg);
            if (calledFrom == "CancelTrans")
                return;

            var focusFldId = "";
            if (errFld != "") {
                try {
                    var fldDetails = errFld.toString().split(",");
                    focusFldId = fldDetails[0];
                    let focusFldRowNo = fldDetails[1];
                    var dcNo = GetDcNo(focusFldId)
                    var rowNo = "000";// GetClientRowNo(fldDetails[1], dcNo);
                    if (IsGridField(focusFldId)) {
                        if (focusFldRowNo.length == 3)
                            rowNo = focusFldRowNo;
                        else if (focusFldRowNo.length == 2)
                            rowNo = "0" + focusFldRowNo;
                        else if (focusFldRowNo.length == 1)
                            rowNo = "00" + focusFldRowNo;
                        var fldName = focusFldId + rowNo + "F" + dcNo;
                        var focusFld = $j("#" + fldName);
                        if (focusFld.length > 0) {
                            if(IsTabDc(dcNo))
                            {
                                if(!$("#ank"+dcNo).hasClass('active'))
                                {
                                   let ankId= $("#ank"+dcNo).parents("ul#myTab").find("a.active").attr("id");
                                   $("#"+ankId).removeClass("active");
                                   let ackTabId=ankId.substr(3);
                                   $("#tab-"+ackTabId).removeClass('show active');
                                   $("#tab-"+dcNo).addClass('show active');
                                   $("#ank"+dcNo).addClass('active');
                                }
                            }

                            let focusFldIndex = focusFld.parents("td").index();
                            if ($("#gridHd" + dcNo + " tbody tr#sp" + dcNo + "R" + rowNo + "F" + dcNo).hasClass('inline-edit'))
                                focusFld.focus();
                            else
                                $("#gridHd" + dcNo + " tbody tr#sp" + dcNo + "R" + rowNo + "F" + dcNo + " td:eq(" + focusFldIndex + ")").click();
                        }
                    } else {
                        var fldName = focusFldId + rowNo + "F" + dcNo;
                        var focusFld = $j("#" + fldName);
                        if (focusFld.length > 0) {
                            focusFld.focus();
                        }
                    }
                } catch (ex) { }
            }
            else if (AxActiveField != "") {

                var rowNo = GetClientRowNo(AxActiveRowNo, AxActiveDc);
                var fldName = AxActiveField + rowNo + "F" + AxActiveDc;
                var focusFld = $j("#" + fldName);
                if (focusFld.length > 0) {
                    focusFld.focus();
                }
            }
        }
    }

}
function getComntWf(showPopup) {
    var recid = $j("#recordid000F0").val();
    $.ajax({
        url: 'tstruct.aspx/GetWrkFlwCmmt',
        type: 'POST',
        cache: false,
        async: true,
        data: JSON.stringify({ tid: tst, rid: recid }),
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            var jsonstr = JSON.parse(data.d);
            for (var k = 0; k < jsonstr.length; k++) {
                var a = jsonstr[k];
                for (var key in a) {
                    var temp = a[key];
                    delete a[key];
                    a[key.toLowerCase()] = temp;
                }
                jsonstr[k] = a;
            }
            var htmlTable = '<table class="table table-bordered firstble table-fixed"><thead><tr><th class="col-sm-4">Date</th><th class="col-sm-2">Status</th><th class="col-sm-4">Comments</th><th class="col-sm-2">User</th></tr></thead><tbody>'
            for (var i = 0; i < jsonstr.length; i++) {
                htmlTable += '<tr class="tblrowcolor" tabindex="0">';
                htmlTable += '<td class="col-sm-4"> ' + jsonstr[i].datetime + '</td>';
                htmlTable += '<td class="col-sm-2">' + (jsonstr[i].status == 'return' ? 'Returned' : jsonstr[i].status) + '</td>';
                htmlTable += '<td class="col-sm-4">' + jsonstr[i].comments + '</td>';
                htmlTable += '<td class="col-sm-2">' + jsonstr[i].username + '</td>';
                htmlTable += '</tr>';
            }
            htmlTable += '</tbody>';
            $("#tblWrk").addClass("d-none");
            $("#tblWrk").html(htmlTable);
            $("#collapseOneTable").html(htmlTable);
            $("#consumergoods2").addClass("d-none");
            $("#btnWrfSave").addClass("d-none");
            $("#btnWrfCancel").addClass("d-none");
            if (showPopup) {
                $("#tblWrk").removeClass("d-none");
                let myModal = new BSModal("modalIdWfHistory", "History", $("#tblWrk").html(), () => {
                    $("#tblWrk").addClass("d-none");
                }, () => {
                    //hide callback
                });
                myModal.changeSize("lg");
                myModal.hideFooter();
                myModal.scrollableDialog();
            }
        },
        error: function (data) {
            console.log(data);
        }
    });
    if (isWizardTstruct) {
        $("body").append($("#consumergoods").detach());
    }
}

function getWfUsrName(maxlevel, jsonStr) {
    var usernames = [];
    for (var i = 1; i < (parseInt(maxlevel) + 1); i++) {
        var temp = "";
        for (var j = 0; j < jsonStr.length; j++) {
            if (jsonStr[j].lno == i && $j("#hdnWfLno").val() != "-1") {
                if (temp == "")
                    temp += jsonStr[j].un;
                else
                    temp += ',' + jsonStr[j].un;
            } else if ($j("#hdnWfLno").val() == "-1") {
                if (temp == "")
                    try {
                        temp += jsonStr[$j("#hdnWfELno").val()].un;
                    } catch (ex) {
                        temp += jsonStr[j].un;
                    }
            }
        }
        usernames.push(temp);
    }
    return usernames;
}

function getWfStatus(maxlevel, jsonStr) {
    var userSt = [];
    var prevLabel = false;
    for (var i = 1; i < (parseInt(maxlevel) + 1); i++) {
        var temp = ""
        if (!prevLabel)
            temp = "Notapplicable";
        for (var j = 0; j < jsonStr.length; j++) {
            if (jsonStr[j].lno == i && $j("#hdnWfLno").val() != "-1") {
                if (!prevLabel)
                    temp = "";
                prevLabel = true;
                if (temp == "") {
                    if (jsonStr[j].st.toLowerCase() == 'forwarded')
                        temp += 'reviewed';
                    else
                        temp += jsonStr[j].st;
                }
                else {
                    if (jsonStr[j].st.toLowerCase() == 'forwarded')
                        temp += ',' + 'reviewed';
                    else
                        temp += ',' + jsonStr[j].st;
                }
            } else if ($j("#hdnWfLno").val() == "-1") {
                if (!prevLabel)
                    temp = "";
                prevLabel = true;
                if (temp == "") {
                    try {
                        if (jsonStr[$j("#hdnWfELno").val()].st.toLowerCase() == 'forwarded')
                            temp += 'reviewed';
                        else
                            temp += jsonStr[$j("#hdnWfELno").val()].st;
                    } catch (ex) {
                        if (jsonStr[j].st.toLowerCase() == 'forwarded')
                            temp += 'reviewed';
                        else
                            temp += jsonStr[j].st;
                    }
                }
            }
        }
        userSt.push(temp);
    }
    return userSt;
}

function getWfLevelUSsrs(lvlIdx, maxLevels, usernames, statusWrk, elno, levelJson) {
    WrkflFlag = true;
    ShowDimmer(true);
    var recid = $j("#recordid000F0").val();
    var htmlwrk = constructWrkHtml(maxLevels, usernames, statusWrk, elno, levelJson);
    $(htmlwrk).insertAfter($(".icobtn"));
    $("#stratWrkf").after($(".workflowMsg").detach());
    popoverWrkFl();
}

function constructWrkHtml(maxLevels, usernames, statusWrk, elno, levelJson) {
    var htmlwf = "";
    var htmlwfNew = "";
    var levelno = 0;
    for (var l = 0; l < parseInt(maxLevels); l++) {
        if (levelJson.length > levelno && $j("#hdnWfLno").val() == "-1") {
            if (elno != levelJson[levelno].lno) {
                levelno++;
            }
        }
        if (typeof levelJson[levelno] != "undefined" && levelJson[levelno].lno != (l + 1) && $j("#hdnWfLno").val() != "-1")
            continue;

        var status = statusWrk[l].toLowerCase();

        if (status.indexOf(',') > -1) {
            status = status.split(',');
            if (status.indexOf('pending') > -1)
                status = "pending";
            else
                status = status[status.length - 1];

        }
        if (status.toLowerCase() == 'forwarded')
            status = 'reviewed';
        if (status.indexOf('pending') > -1 || status == '')
            status = 'Pending';
        if (status.indexOf('rejected') > -1) {
            status = 'rejected';
        }

        if (statusWrk[l] == '') {
            status = "Pending";
            if (status.toLowerCase() == 'pending' && usernames[l] != "" && usernames[l] == user)
                htmlwfNew = "Approval pending with you. "
            else if (status.toLowerCase() == 'pending' && usernames[l] != "" && usernames[l] != user)
                htmlwfNew = "Approval pending with " + usernames[l] + " ";

        }
        else if (typeof levelJson[levelno] != "undefined" && levelJson[levelno].lno == elno && parseInt(elno) == (l + 1)) {
            var wfContent = $j("#lblStatus").text();
            var wfContentUsr = wfContent.match(/'([^']+)'/g);
            if (wfContentUsr != null) {
                wfContentUsr.forEach(function (wfcu) {
                    if (wfcu.indexOf(".") > -1) {
                        let replwfcu = wfcu.replace(/[.]/ig, '♣');
                        wfContent = wfContent.replace(wfcu, replwfcu);
                    }
                });
            }

            var lblst = wfContent.split('.');// $j("#lblStatus").text().split('.');
            let wfUser = user.replace(/[.]/ig, '♣');
            lblst.forEach(function (val) {
                if ((val.startsWith("Pending ") || val.startsWith(" Pending ")) && (val.indexOf("'" + wfUser + "'") > 0 || val.indexOf(" " + wfUser + "") > 0))
                    htmlwfNew = "Approval pending with you. ";
                else if (val.startsWith("Returned ") && (val.indexOf("'" + wfUser + "'") > 0 || val.indexOf(" " + wfUser + "") > 0))
                    htmlwfNew = val.replace(/'/g, "").replace(/♣/g, ".");
            });
        }
        else {
            if (status.toLowerCase() == 'pending' && usernames[l] == user)
                htmlwfNew = "Approval pending with you. "
            else if (status.toLowerCase() == 'pending' && usernames[l] != user) {
                if (usernames[l].indexOf(',') > -1)
                    htmlwfNew = "Approval pending with " + usernames[l] + " ";
                else
                    htmlwfNew = "Approval pending with " + usernames[l] + " ";
            }
            else if (status.toLowerCase() == 'approved' && usernames[l] == user) {
                var wfContent = $j("#lblStatus").text();
                var wfContentUsr = wfContent.match(/'([^']+)'/g);
                if (wfContentUsr != null) {
                    wfContentUsr.forEach(function (wfcu) {
                        if (wfcu.indexOf(".") > -1) {
                            let replwfcu = wfcu.replace(/[.]/ig, '♣');
                            wfContent = wfContent.replace(wfcu, replwfcu);
                        }
                    });
                }

                //var lblst = $j("#lblStatus").text().split('.');//
                var lblst = wfContent.split('.');
                let wfUser = user.replace(/[.]/ig, '♣');
                lblst.forEach(function (val) {
                    if (val.indexOf("'" + wfUser + "'") > 0)
                        htmlwfNew = val.replace(/'/g, "").replace(/♣/g, ".");;
                });
            }
            else if (status.toLowerCase() == 'approved' && usernames[l] != user) {
                htmlwfNew = $j("#lblStatus").text().replace(/'/g, "");
            }
            else if (status.toLowerCase() == 'rejected' && usernames[l] == user) {
                htmlwfNew = "Approval rejected by you. "
            }
            else if (status.toLowerCase() == 'rejected' && usernames[l] != user) {
                htmlwfNew = "Approval " + $j("#lblStatus").text().replace(/'/g, "");
            }
            else if (status.toLowerCase() == 'reviewed' && usernames[l] == user) {
                htmlwfNew = "Approval Forwarded by you. "
            }
            else if (status.toLowerCase() == 'reviewed' && usernames[l] != user) {
                htmlwfNew = "Approval " + $j("#lblStatus").text().replace(/'/g, "");
            }
            else if (status.toLowerCase() == 'autoforwarded' && usernames[l] == 'system')
                htmlwfNew = $j("#lblStatus").text().replace(/'/g, "");
        }

        if (status === "notapplicable")
            status = "NA";

        //htmlwfNew = '<div class="workflowMsg workflowdisplayinline" data-content="' + htmlwfNew + '" data-toggle="popoverone" data-trigger="hover" data-placement="bottom">' + htmlwfNew + '</div>';
        for (var j = 0; j < levelJson.length; j++) {
            if (levelJson[j].lno == elno && parseInt(elno) == (l + 1) && status == "Pending") {
                htmlwf += '<div class="downArr workflowdisplayinline" id="workflowdropdown"><span class="workflowOptions btn btn-sm btn-icon btn-active-light-primary shadow-sm menu-dropdown" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end" data-kt-menu-flip="top-end"><span class="workflowOptionAction material-icons material-icons-style">more_vert</span></span></div>';
                break;
            }
        }
        levelno++;
    }
    htmlwfNew = '<div class="workflowMsg workflowdisplayinline d-flex flex-row-auto px-4 py-2 fst-italic fst-bolder" data-content="' + htmlwfNew + '" data-toggle="popoverone" data-trigger="hover" data-placement="bottom">' + htmlwfNew + '</div>';
    return htmlwfNew + htmlwf;
}

function capitalizeFirstLetter(status) {
    return status.charAt(0).toUpperCase() + status.slice(1);
}

function popoverWrkFl() {
    $('[data-toggle="popoverone"]').popover();

    if ($("div[aria-expanded='false']")) {
        $('#togglearrow').attr('title', 'Expand');
    }
    else {
        $('#togglearrow').attr('title', 'Collapse');
    }
}

function LimtCharacters(txtMsg, CharLength, indicator) {
    chars = txtMsg.value.length;
    if ((CharLength - chars) < 0)
        document.getElementById(indicator).innerHTML = 0 + " " + "of 250";
    else
        document.getElementById(indicator).innerHTML = CharLength - chars + " " + "of 250";
    if (chars > CharLength) {
        txtMsg.value = txtMsg.value.substring(0, CharLength);
    }
}

function popupFullPage(NavigationURL) {
    callParentNew("splitfull()", 'function');
    var frm = $j("#middle1", parent.document);
    // frm.attr("src", NavigationURL);
    try {
        frm[0].contentWindow.location.href = NavigationURL;
    } catch (ex) {}
}

function setIviewNavigationData(paramsString, iviewName) {
    if (iviewName != "") {
        try {
            ASB.WebService.SetIviewNavigationData(paramsString, iviewName, function () { });
        } catch (ex) {
        }
    }
}

 function callExecuteScriptApi(type,btnName,apiInfo)
    {
        if (actionCallFlag == actionCallbackFlag) {
            actionCallFlag = Math.random();
            $("#icons,#btnSaveTst,.BottomToolbarBar a").css({ "pointer-events": "auto" });
        } else {
            $("#icons,#btnSaveTst,.BottomToolbarBar a").css({ "pointer-events": "none" });
            return;
        }
        AxWaitCursor(true);
        ShowDimmer(true);
        try {

            ASB.WebService.CallExecuteScriptAPI(type, tstDataId,btnName,apiInfo, SuccessCallbackExecuteScriptApi, OnException);
        }
        catch (exp) {
            actionCallbackFlag = actionCallFlag;
            $("#icons,#btnSaveTst,.BottomToolbarBar a,.wizardNextPrevWrapper").css({ "pointer-events": "auto" });
            AxWaitCursor(false);
            ShowDimmer(false);
            var execMess = exp.name + "^♠^" + exp.message;
            showAlertDialog("error", 2030, "client", execMess);
        }
    }

    function SuccessCallbackExecuteScriptApi(result, eventArgs) {
        actionCallbackFlag = actionCallFlag;
        $("#icons,#btnSaveTst,.BottomToolbarBar a,.wizardNextPrevWrapper").css({ "pointer-events": "auto" });
        if (CheckSessionTimeout(result)) {
            return;
        }
        let resJson=JSON.parse(result);
        if(typeof resJson.result[0].error!="undefined")
        {
            if(typeof resJson.result[0].error.msg!="undefined")
                showAlertDialog("error", resJson.result[0].error.msg);
            else
                showAlertDialog("error", resJson.result[0].error[0].msg);
        }else{           
            showAlertDialog("success", resJson.result[0].msg);
        }
        ArrActionLog = "";
        AxWaitCursor(false);
        ShowDimmer(false);
    }

function EvaluateDirectScript (dataString){
    return Evaluate("", "", dataString, "exp");
}

function ReadonlyformPeg() {
    tstReadOnlyPeg = true;
    $("[id^=DivFrame").find('input,textarea, img, select, a').attr('disabled', true);
    $("[id^=DivFrame").find('.gridIconBtns a').addClass('disabled');
    $("[id^=DivFrame").find('.gridIconBtns a').attr('disabled', true);
    $("[id^=DivFrame").find('.gridRowChk,.gridHdrChk').attr('disabled', true);
    $(".BottomToolbarBar").find('a').addClass('disabled');
    $(".BottomToolbarBar").find('a').attr('disabled', true);
    $(".toolbarRightMenu").find('a').addClass('disabled');
    $(".toolbarRightMenu").find('a').attr('disabled', true);
    $(".toolbarRightMenu").find('button').attr('disabled', true);
    $(".toolbarRightMenu").find('button').addClass('disabled');
    $(".tstructBottomLeftButton").find('.lnkPrev,.lnkNext,a').addClass('disabled');
    $(".tstructBottomLeftButton").find('.lnkPrev,.lnkNext,a').attr('disabled', true);  
    $(".dz-hidden-input").prop("disabled", true);
    $(".fldImageCamera").addClass('disabled');
    $(".fileuploadmore").prop("disabled", true);
}
