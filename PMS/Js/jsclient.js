

//<Description> Function to call the appropriate function from the function List </Description>
//<Return> Returns the result evaluated by the function </Return>
//c - Constant
//n - number
//d - date
//s - string
//f - function
//e - end of function
//o - operator
//b - bracket
//l - delimiter
var expressiontype = "";
var prerow = "";
var frmno = "";
var expFldname = "";
var rno = 0;
var rowno = "";
var constword = false;
var wordstring = '';
var wordtype = 'c';
var brackets = '';
var bcount = 0;
var wordlist = new Array();
var p = 0;
var z = 0;
var params = new Array();
var pos;
var varlist = new Array();
var valuelist = new Array();
var axMemVarList = new Array();
var axMemVarValue = new Array();
var funclist = new Array();
var forceBreak = false;
funclist.push("abs", "addtodate", "addtomonth", "amtword");
funclist.push("checkemail", "chkuniqchar", "cmonthyear", "convertmd5", "ctod", "curramtword");
funclist.push("date", "datediff", "dayofdate", "dayselapsed", "daysinmonth", "decode", "dtoc");
funclist.push("encode", "evaluatepower", "extractnum");
funclist.push("findandreplace", "findcharpos", "formataccamount", "formatamount", "formatval");
funclist.push("getallvalues", "getinteger", "getlength", "getmax", "getmin", "getmod", "getnthstring", "getrow", "getrowcount", "getseperatorcount", "getsubtotal", "getold", "getvalue", "getvarvalue");
funclist.push("iif", "infixtopostfix", "inputprecedence", "insertcommas", "isempty", "isemptyvalue", "isoperator", "isvarempty");
funclist.push("lastdayofmonth", "leftpad", "length", "lower", "lowercase");
funclist.push("makedate", "mods", "monthofdate");
funclist.push("pad", "postfixeval", "postfixtoinfix");
funclist.push("regvar", "removecommas", "rightpad", "rnd", "round", "roundoff");
funclist.push("setfont", "stackprecedence", "str", "stuff", "substr", "sum", "sumtill");
funclist.push("time", "timeelapsed", "trim", "trimall", "triminbetwnspaces", "total");
funclist.push("upper", "uppercase");
funclist.push("val", "validencodedate");
funclist.push("yearofdate");
funclist.push("floor", "ceil", "networkdays", "days360", "axpfloor", "axpceil");
funclist.push("axhidecontrols", "axunhidecontrols", "axenablecontrols", "axdisablecontrols", "setvalue", "axvalueexits", "axaddrow", "loadform", "loadformanddata", "loadiview", "loadpage", "openpage", "setfieldcaption", "doformdesign", "canceltransaction", "getaxvalue", "stringpos", "axdccollapse", "axdcexpand", "getdcstate", "axallowempty", "axreadonly", "axmask", "axnomask", "axdisablegridcell", "axenablegridcell");


function CallFunction(functionname, params) {

    if ((functionname == "length") || (functionname == "getlength"))
        result = 'n' + Length(params[0]);
    else if (functionname == "substr")
        result = 's' + SubStr(params[0], params[1], params[2]);
    else if (functionname == "abs")
        result = 'n' + PAbs(params[0]);
    else if (functionname == "iif") {
        let IfFunVal = IfFun(params[0], params[1], params[2]);
        result = isNaN(parseInt(IfFunVal)) ? 's' + IfFunVal : 'n' + IfFunVal;
    }
    else if (functionname == "findcharpos")
        result = 'n' + FindCharPos(params[0], params[1]);
    else if (functionname == "chkuniqchar")
        result = 's' + ChkUniqChar(params[0]);
    else if (functionname == "trimall" || functionname == "trim")
        result = 's' + TrimAll(params[0]);
    else if (functionname == "extractnum")
        result = 'n' + ExtractNum(params[0]);
    else if (functionname == "mods")
        result = 'n' + Mods(params[0], params[1]);
    else if (functionname == "lastdayofmonth")
        result = 'd' + LastDayOfMonth(params[0]);
    else if (functionname == "daysinmonth")
        result = 'n' + DaysInMonth(params[0], params[1]);
    else if (functionname == "validencodedate")
        result = 'd' + ValidEncodeDate(params[0], params[1], params[2]);
    else if (functionname == "getinteger")
        result = 'n' + GetInteger(params[0]);
    else if (functionname == "addtomonth")
        result = 'd' + AddToMonth(params[0], params[1]); //result = 's' + AddToMonth(params[0], params[1]);
    else if (functionname == "addtodate")
        result = 'd' + AddToDate(params[0], params[1]);//result = 's' + AddToDate(params[0], params[1]);
    else if (functionname == "timeelapsed")
        result = 's' + TimeElapsed(params[0], params[1]);
    else if (functionname == "dayselapsed")
        result = 'n' + DaysElapsed(params[0], params[1]);
    else if (functionname == "mandy")
        result = 's' + MandY(params[0]);
    else if (functionname == "findandreplace")
        result = 's' + FindAndReplace(params[0], params[1], params[2]);
    else if (functionname == "removecommas")
        result = 's' + removeCommas(params[0]);
    else if (functionname == "getnthstring")
        result = 's' + GetNthString(params[0], params[1]);
    else if ((functionname == "roundoff") || (functionname == "round"))
        result = 'n' + RoundOff(params[0], params[1]);
    else if (functionname == "insertcommas")
        result = 'n' + InsertCommas(params[0]);
    else if (functionname == "leftpad")
        result = 's' + LeftPad(params[0], params[1], params[2]);
    else if (functionname == "rightpad")
        result = 's' + RightPad(params[0], params[1], params[2]);
    else if (functionname == "pad")
        result = 's' + Pad(params[0], params[1], params[2]);
    else if (functionname == "getseperatorcount")
        result = 'n' + GetSeperatorCount(params[0], params[1]);
    else if (functionname == "val")
        result = 'n' + Val(params[0]);
    else if (functionname == "str")
        result = 's' + Str(params[0]);
    else if ((functionname == "uppercase") || (functionname == "upper"))
        result = 's' + UpperCase(params[0]);
    else if ((functionname == "lowercase") || (functionname == "lower"))
        result = 's' + LowerCase(params[0]);
    else if (functionname == "isvarempty")
        result = 's' + IsVarEmpty(params[0]);
    else if (functionname == "getvarvalue")
        result = 's' + GetVarValue(params[0]);
    else if (functionname == "amtword")
        result = 's' + Amt_Word(params[0]);
    else if (functionname == "evaluatepower")
        result = 'n' + EvaluatePower(params[0], params[1]);
    else if (functionname == "infixtopostfix")
        result = 's' + InfixToPostfix(params[0]);
    else if (functionname == "postfixtoinfix")
        result = 's' + PostfixToInfix(params[0]);
    else if (functionname == "postfixeval")
        result = 'n' + PostfixEval(params[0]);
    else if (functionname == "inputprecedence")
        result = 'n' + InputPrecedence(params[0]);
    else if (functionname == "stackprecedence")
        result = 'n' + StackPrecedence(params[0]);
    else if (functionname == "isoperator")
        result = 's' + ISOperator(params[0]);
    else if (functionname == "encode")
        result = 's' + Encode(params[0]);
    else if (functionname == "decode")
        result = 's' + Decode(params[0]);
    else if (functionname == "dtoc")
        result = 's' + DTOC(params[0]);
    else if (functionname == "ctod")
        result = 'd' + CTOD(params[0]);
    else if (functionname == "cmonthyear")
        result = 'd' + CMonthYear(params[0]);
    else if (functionname == "stuff")
        result = 's' + Stuff(params[0], params[1], params[2]);
    else if (functionname == "rnd")
        result = 'n' + Rnd(params[0], params[1]);
    else if (functionname == "isemptyvalue")
        result = 's' + IsEmptyValue(params[0], params[1]);
    else if (functionname == "formatval")
        result = 'n' + FormatVal(params[0], params[1]);
    else if (functionname == "formataccamount")
        result = 'n' + FormatAccAmount(params[0], params[1], params[2], params[3], params[4]);
    else if (functionname == "formatamount")
        result = 'n' + FormatAmount(params[0], params[1], params[2], params[3], params[4]);
    else if (functionname == "triminbetwnspaces")
        result = 's' + TrimInbetwnSpaces(params[0]);
    else if (functionname == "date")
        result = 'd' + TodaysDate();
    else if (functionname == "time")
        result = 's' + Time();
    else if (functionname == "isempty")
        result = 's' + ISEMPTY(params[0]);
    else if (functionname == "datediff")
        result = 'n' + DateDiff(params[0], params[1]);
    else if (functionname == "checkemail")
        result = 's' + CheckEmail(params[0]);
    else if (functionname == "convertmd5")
        result = 's' + MD5(params[0]);
    else if (functionname == "total")
        result = 'n' + Total(params[0]);
    else if (functionname == "curramtword")
        result = 's' + CurrAmtWord(params[0], params[1], params[2], params[3], params[4]);
    else if (functionname == "str")
        result = 's' + str(params[0]);
    else if (functionname == "getvalue") {
        let isActual = typeof params[2] != "undefined" ? params[2] : false;
        result = GetGridCellValue(params[0], params[1], isActual);
    }
    else if (functionname == "makedate")
        result = 'd' + makedate(params[0], params[1], params[2]);//result = 's' + makedate(params[0], params[1], params[2]);
    else if (functionname == "getallvalues")
        result = 's' + GetAllValues(params[0], params[1]);
    else if (functionname == "dayofdate")
        result = 'n' + DayOfDate(params[0]);
    else if (functionname == "yearofdate")
        result = 'n' + YearOfDate(params[0]);
    else if (functionname == "monthofdate")
        result = 'n' + MonthOfDate(params[0]);
    else if (functionname == "getmin")
        result = 'n' + GetMinValue(params[0]);
    else if (functionname == "getmax")
        result = 'n' + GetMaxValue(params[0]);
    else if (functionname == "getrowcount")
        result = 'n' + GetRowCount(params[0]);
    else if (functionname == "sumtill") {
        if (isSumTillGrid != undefined)
            isSumTillGrid = true;//Refer: HEA000101
        result = 'n' + SumTill(params[0], params[1], params[2], params[3], params[4]);
    }
    else if (functionname == "sum")
        result = 'n' + Sum(params[0], params[1], params[2]);
    else if (functionname == "regvar")
        result = 's' + RegisterVariables(params[0], params[1], params[2]);
    else if (functionname == "getrow")
        result = 'n' + GetRow(params[0], params[1], params[2]);
    else if (functionname == "getsubtotal")
        result = 'n' + SubTotal(params[0], params[1]);
    else if (functionname == "getmod")
        result = 'n' + GetMod(params[0], params[1]);
    else if (functionname == "getold")
        result = 's' + GetOld(params[0], params[1]);
    else if (functionname == "ceil" || functionname == "axpceil")
        result = 'n' + AxCeil(params[0]);
    else if (functionname == "floor" || functionname == "axpfloor")
        result = 'n' + AxFloor(params[0]);
    else if (functionname == "networkdays")
        result = 'n' + NetworkDays(params[0], params[1], params[2]);
    else if (functionname == "days360")
        result = 'n' + Days360(params[0], params[1], params[2]);
    else if (functionname == "setfont")
        result = 's' + SetAxFont(params[0], params[1], params[2], params[3]);
    //else if (functionname == "randomno")
    //result = 'n' + RandomNo();
    else if (functionname == "axhidecontrols")
        result = 's' + AxHideControls(params[0]);
    else if (functionname == "axunhidecontrols")
        result = 's' + AxUnhideControls(params[0]);
    else if (functionname == "axenablecontrols")
        result = 's' + AxEnableControls(params[0]);
    else if (functionname == "axdisablecontrols")
        result = 's' + AxDisableControls(params[0]);
    else if (functionname == "setvalue")
        result = 's' + AxSetValue(params[0], params[1], params[2]);
    else if (functionname == "axvalueexits")
        result = 'n' + AxValueExits(params[0], params[1], params[2], params[3]);
    else if (functionname == "axaddrow")
        result = 's' + AxAddRow(params[0]);
    else if (functionname == "loadform")
        result = "s" + LoadForm(params[0], params[1], params[2], params[3]);
    else if (functionname == "loadformanddata")
        result = "s" + LoadFormAndData(params[0], params[1], params[2], params[3]);
    else if (functionname == "loadiview")
        result = "s" + LoadIView(params[0], params[1], params[2], params[3]);
    else if (functionname == "loadpage")
        result = "s" + LoadPage(params[0], params[1], params[2], params[3]);
    else if (functionname == "openpage")
        result = "s" + OpenPage(params[0], params[1], params[2], params[3]);
    else if (functionname == "setfieldcaption")
        result = "s" + SetFieldCaption(params[0], params[1]);
    else if (functionname == "doformdesign")
        result = "s" + DoFormDesign(params[0], params[1]);
    else if (functionname == "canceltransaction")
        result = "s" + CancelTransaction(params[0], params[1], params[2]);
    else if (functionname == "getaxvalue")
        result = "s" + GetAxValue(params[0], params[1], params[2]);
    else if (functionname == "stringpos")
        result = "n" + GetStringpos(params[0], params[1], params[2]);
    else if (functionname == "axdccollapse")
        result = "s" + AxDcCollapse(params[0]);
    else if (functionname == "axdcexpand")
        result = "s" + AxDcExpand(params[0]);
    else if (functionname == "getdcstate")
        result = "s" + GetDcState(params[0]);
    else if (functionname == "axallowempty")
        result = "s" + AxAllowEmpty(params[0], params[1]);
    else if (functionname == "axreadonly")
        result = "s" + AxReadOnly();
    else if (functionname == "axmask")
        result = "s" + AxMask(params[0], params[1], params[2]);
    else if (functionname == "axnomask")
        result = "s" + AxNoMask(params[0]);
    else if (functionname == "axdisablegridcell")
        result = "s" + AxDisableGridCell(params[0], params[1]);
    else if (functionname == "axenablegridcell")
        result = "s" + AxEnableGridCell(params[0], params[1]);
    return result;
}

function SetAxFont(fldName, cond, truestyle, falsestyle) {
    var dcno = 0;
    var thisFldId = "";
    dcno = GetDcNo(fldName);
    if (parseInt(dcno, 10) > 0) {
        var rowNo = "";
        if (DCIsGrid[dcno - 1].toLowerCase() == "true") {
            var rcount = parseInt(GetDcRowCount(dcno), 10);
            if (rcount > 0) {
                if (applyFontListView) {
                    for (var k = 0; k < rcount; k++) {
                        rowNo = GetClientRowNo(k + 1, dcno);
                        thisFldId = fldName + rowNo + "F" + dcno;
                        if (cond) {
                            SetAxFontCondition($("#" + thisFldId), truestyle);
                        } else {
                            SetAxFontCondition($("#" + thisFldId), falsestyle);
                        }
                    }
                } else {
                    rowNo = GetRowNoHelper(AxActiveRowNo);
                    thisFldId = fldName + rowNo + "F" + dcno;
                    if (cond) {
                        SetAxFontCondition($("#" + thisFldId), truestyle);
                    } else {
                        SetAxFontCondition($("#" + thisFldId), falsestyle);
                    }
                }
            }

        }
        else {
            rowNo = "000";
            thisFldId = fldName + rowNo + "F" + dcno;
            if (cond) {
                SetAxFontCondition($("#" + thisFldId), truestyle);
            } else {
                SetAxFontCondition($("#" + thisFldId), falsestyle);
            }
        }
    }
    return "MessageSetAxFont";
}

function SetAxFontCondition(thisFld, applyStyle) {
    if (applyStyle != "") {
        ResetAxFont(thisFld);
        applyStyle = applyStyle.split(',');
        for (var y = 0; y < applyStyle.length; y++) {
            var currentStyle = applyStyle[y].split('=');
            switch (currentStyle[0].toLowerCase()) {
                case "fontname":
                    thisFld.css("font-family", currentStyle[1]);
                    break;
                case "fontsize":
                    thisFld.css("font-size", currentStyle[1] + "pt");
                    break;
                case "fontstyle":
                    for (var z = 0; z < currentStyle[1].toLowerCase().length; z++) {
                        switch (currentStyle[1].toLowerCase()[z]) {
                            case "b":
                                thisFld.css('font-weight', 'bold');
                                break;
                            case "i":
                                thisFld.css('font-style', 'italic');
                                break;
                            case "u":
                                if (thisFld.css("text-decoration") == "line-through") {
                                    thisFld.css("text-decoration", "line-through underline");
                                } else {
                                    thisFld.css("text-decoration", "underline");
                                }
                                break;
                            case "s":
                                if (thisFld.css("text-decoration") == "underline") {
                                    thisFld.css("text-decoration", "underline line-through");
                                } else {
                                    thisFld.css("text-decoration", "line-through");
                                }
                                break;
                        }
                    }
                    break;
                case "fontcolor":
                    if (typeof isSpecialRow != "undefined" && isSpecialRow) {
                        thisFld.css("color", currentStyle[1]);
                    } else {
                        thisFld.css("color", AxClColors[currentStyle[1]]);
                    }
                    break;
                case "backcolor":
                    if (AxClColors[currentStyle[1]]) {
                        thisFld.css("background", AxClColors[currentStyle[1]]);
                    } else if (currentStyle[1].indexOf("#") == 0) {
                        thisFld.css("background", currentStyle[1]);
                    } else {
                        thisFld.css("background", "");
                    }
                    break;
            }
        }
    } else {
        ResetAxFont(thisFld);
    }
}

function ResetAxFont(thisFld) {
    thisFld.css("font-family", "");
    thisFld.css('font-weight', "");
    thisFld.css('font-style', "");
    thisFld.css("text-decoration", "");
    thisFld.css("color", "");
    thisFld.css("background", "");
}

function GetOld(fieldName, rowNo) {
    var oldValue = "";
    var dcNo = GetDcNo(fieldName);
    var fldId = fieldName + GetRowNoHelper(rowNo) + "F" + dcNo;
    var indx = $j.inArray(fldId, FldLoadedFields);
    if (indx != -1)
        oldValue = FldLoadedValues[indx];

    return oldValue;
}

function CheckEval(exprStr, rowNo) {
    var strEval = exprStr.substring(0, 5);
    if (strEval.toLowerCase() == "eval(") {
        isEvalGrid = true;
        var fldName = exprStr.substring(5, exprStr.indexOf(")"));
        var fldIndx = "";
        fldIndx = GetFieldIndex(fldName);
        if (fldIndx != -1)
            fldName = FNames[fldIndx].toString();

        var dcNo = GetDcNo(fldName);
        fldName = fldName + rowNo + "F" + dcNo;

        if (document.getElementById(fldName)) {
            if (document.getElementById(fldName).type == "select-one") {
                var IndexValue = document.getElementById(fldName).selectedIndex;
                return document.getElementById(fldName).options[IndexValue].value;
            }
            else {
                return document.getElementById(fldName).value;
            }
        }
        else {
            return "";
        }
    }
    else
        return exprStr;
}

function Evaluate(a, b, Expstr, exprtype, fromIview) {
    if (Expstr != "")
        Expstr = Expstr.replace(/♦/g, ",");
    expressiontype = exprtype;
    prerow = b;
    var i = 0;
    var tem = '';
    varlist = new Array();
    valuelist = new Array();

    axMemVarList = new Array();
    axMemVarValue = new Array();

    wordlist = new Array();
    var w = 0;
    expFldname = a;
    var trid = transid;
    var fIndx = a.lastIndexOf("F");
    if (fIndx != -1)
        rowno = a.substring(fIndx - 3, a.length);
    else
        rowno = "";
    var curActiveRowNo = 0;
    if (typeof (AxActiveRowNo) != "undefined")
        curActiveRowNo = parseInt(AxActiveRowNo);//Refer: HEA000101
    var activerowno = curActiveRowNo == 0 ? parseInt(a.substring(fIndx - 3, fIndx), 10) : curActiveRowNo;  //parseInt(GetActiveRow(expFldname),10) + 1;

    rno = rowno.substring(0, 3);
    rno = parseInt(rno);
    frmno = rowno.substring(rowno.length - 1, rowno.length);
    Expstr = CheckEval(Expstr, b);
    var expression = Expstr;
    if (Parameters.length > 1) {
        for (var pki = 0; pki < Parameters.length; pki++) {
            var list = Parameters[pki].toString();
            list = list.split("~");
            varlist[w] = list[0].toString();
            valuelist[w] = list[1].toString();
            w++;
        }
    }

    varlist[w] = "activerow";
    valuelist[w] = activerowno;

    if (AxMemParameters.length > 1) {
        for (var ami = 0; ami < AxMemParameters.length; ami++) {
            var list = AxMemParameters[ami].toString();
            list = list.split("~");
            axMemVarList[ami] = list[0].toString();
            axMemVarValue[ami] = list[1].toString().replace(/&quot;/g, '"');
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

        if ((isDelimiter(ch[j])) || (isOperator(ch[j]))) {
            var chrstate = false;
            tem = wordstring;
            tem = tem.toLowerCase();


            var temp2 = "";
            if ((tem != "") && (isNaN(tem))) {
                var templ = "";
                if (isNaN(rowno.substring(rowno.length - 1, rowno.length)) || (tem == "activerow" || tem.toString() == "activeprow")) {

                    if (tem == "activerow") {
                        //templ = GetClientRowNo(AxActiveRowNo, AxActiveDc);
                        //wordlist[i] = "n" + templ.replace(/^0+/, ''); //Removing the leading zeros, since it is changing to Octal literal. Eg. Eval(010) is = to 8, not 10.
                        templ = activerowno;//Refer: HEA000101
                        wordlist[i] = "n" + templ;
                        i++;
                        wordstring = "";
                    }
                    else if (tem == "activeprow") {
                        templ = GetClientRowNo(AxActivePRow, AxActivePDc);
                        wordlist[i] = "n" + templ.replace(/^0+/, ''); //Removing the leading zeros, since it is changing to Octal literal. Eg. Eval(010) is = to 8, not 10.
                        i++;
                        wordstring = "";
                    }
                    else {
                        templ = wordstring;
                    }
                }
                else {
                    var dcNo = GetDcNo(wordstring);
                    if (fromIview == undefined)
                        wordstring = GetExactFieldName(wordstring);
                    templ = wordstring + "000F" + dcNo;
                    temp2 = wordstring;
                    if (document.getElementById(templ)) {
                        templ = templ;
                    }
                    else {

                        var dcNo = GetDcNo(wordstring);
                        var clientRow = "";
                        if (IsDcPopGrid(dcNo)) {
                            clientRow = GetClientRowNo(AxActiveRowNo, AxActiveDc);
                            templ = wordstring + clientRow + "F" + AxActiveDc;
                        }
                        else if (TstructHasPop) {
                            if (IsDcParentGrid(dcNo)) {

                                if (AxActivePRow != "" && AxActivePDc != "") {
                                    clientRow = GetClientRowNo(AxActivePRow, AxActivePDc);
                                    templ = wordstring + clientRow + "F" + AxActivePDc;
                                }
                                else {
                                    clientRow = GetClientRowNo(AxActiveRowNo, AxActiveDc);
                                    templ = wordstring + clientRow + "F" + AxActiveDc;
                                }
                            }
                            else {
                                templ = wordstring + rowno;
                            }
                        }
                        else {
                            templ = wordstring + rowno;
                        }

                        if (document.getElementById(templ)) {
                            templ = templ;
                        }
                        else {
                            if (document.title != "Iview" && (typeof fromIview == "undefined" || fromIview != "table")) {
                                if (wordstring != "" && b == "") {
                                    try {
                                        let dcNo = GetDcNo(wordstring);
                                        if (dcNo != "" && IsDcGrid(dcNo) && AxActiveRowNo.toString() != "" && AxActiveRowNo.toString() != "0") {
                                            let rNo = GetClientRowNo(AxActiveRowNo, AxActiveDc);
                                            templ = wordstring + rNo + "F" + AxActiveDc;
                                        } else
                                            templ = wordstring + "000F" + AxActiveDc;
                                    } catch (ex) {
                                        templ = wordstring + b + "F" + AxActiveDc;
                                    }
                                }
                                else
                                    templ = wordstring + b + "F" + AxActiveDc;
                            }
                        }
                    }
                }

                var elevalue = "";
                if (document.getElementById(templ) && tem != "activerow") {
                    chrstate = true;
                    if (fromIview != undefined)
                        elevalue = document.getElementById(templ).value;
                    else
                        elevalue = GetFieldValue(templ);
                    if (document.getElementById(templ).type == "select-one") {
                        var fldValSplit = elevalue.split(",,");
                        elevalue = fldValSplit[0];
                    }
                    else if (document.getElementById(templ).type == "checkbox") {
                        var isGrid = IsGridField(temp2);
                        var chkboxValues = document.getElementById(templ).alt;
                        var chkboxVal = chkboxValues.split(",");
                        chkboxVal = $j.grep(chkboxVal, function (n) {     //Removing empty string
                            return (n);
                        });
                        if (document.getElementById(templ).checked) {
                            if (chkboxVal.length > 1) {
                                if (isGrid == true)
                                    elevalue = chkboxVal[0].toString();
                                else
                                    elevalue = "T";
                            }

                            else {
                                if (isGrid == true)
                                    elevalue = chkboxVal[1].toString();
                                else {
                                    if (document.getElementById(templ).value != "" && document.getElementById(templ).value == "T")
                                        elevalue = "T";
                                    else
                                        elevalue = "F";
                                }
                            }
                        }
                    }
                    elevalue = elevalue + "";

                    var fldInd = $j.inArray(wordstring, FNames);
                    var fldDType = "";
                    if (fldInd != -1)
                        fldDType = FDataType[fldInd].toString();

                    if (fldDType != "") {
                        if (fldDType == "Date/Time") {
                            s = "d" + elevalue;
                        }
                        else if (fldDType == "Character" || fldDType == "Text") {
                            s = "s" + elevalue;
                        }
                        else {
                            if (fldDType == "Numeric") {
                                if (elevalue.length > 3) {
                                    if (elevalue.indexOf(',') != -1)
                                        elevalue = removeCommas(document.getElementById(templ).value);
                                }
                            }
                            if (elevalue == "") elevalue = 0;
                            s = 'n' + elevalue;
                            if (s.length == 1)
                                s = 'n' + 0;
                        }
                    }
                    else {
                        if (isNaN(elevalue)) {
                            s = 's' + elevalue;
                        }
                        else {

                            if (elevalue == "") elevalue = 0;
                            elevalue = elevalue;
                            s = 'n' + elevalue;
                            if (s.length == 1)
                                s = 'n' + 0;
                        }
                    }
                    wordlist[i] = s;
                    i++;
                }
                else if (typeof ChangedTblFields != "undefined" && $j.inArray(templ, ChangedTblFields) != -1) {
                    chrstate = true;
                    var fldTblIndex = $j.inArray(templ, ChangedTblFields);
                    var tblVal = ChangedTblFieldVals[fldTblIndex].split('~');
                    tblVal = tblVal[b];
                    if (typeof tblVal == "undefined")
                        tblVal = "";
                    if (tblVal.indexOf('/') != -1)
                        s = "d" + tblVal;
                    else if (isNaN(tblVal) || tblVal == "")
                        s = "s" + tblVal;
                    else
                        s = 'n' + tblVal;
                    wordlist[i] = s;
                    i++;
                }
                else {

                    templ = wordstring;

                    for (var amk = 0; amk < axMemVarList.length; amk++) {

                        if (templ == axMemVarList[amk].toLowerCase()) {
                            chrstate = true;
                            elevalue = axMemVarValue[amk];
                            var dtlenth = elevalue.split('/');
                            if (dtlenth[0].length == 2 && (typeof dtlenth[1] != "undefined" && dtlenth[1].length == 2) && (typeof dtlenth[2] != "undefined" && dtlenth[2].length == 4)) {
                                s = 'd' + elevalue;
                            }
                            else if (isNaN(elevalue)) {
                                s = 's' + elevalue;
                            }
                            else {
                                if (elevalue == "") elevalue = 0;
                                elevalue = elevalue;
                                s = 'n' + elevalue;
                                if (s.length == 1)
                                    s = 'n' + 0;
                            }
                            wordlist[i] = s;
                            i++;
                            break;
                        }
                    }

                    if (!chrstate) {
                        for (var k = 0; k < varlist.length; k++) {

                            if (templ == varlist[k].toLowerCase()) {
                                chrstate = true;
                                elevalue = valuelist[k];
                                var dtlenth = elevalue.split('/');
                                if (dtlenth[0].length == 2 && (typeof dtlenth[1] != "undefined" && dtlenth[1].length == 2) && (typeof dtlenth[2] != "undefined" && dtlenth[2].length == 4)) {
                                    s = 'd' + elevalue;
                                }
                                else if (isNaN(elevalue)) {
                                    s = 's' + elevalue;
                                }
                                else {
                                    if (elevalue == "") elevalue = 0;
                                    elevalue = elevalue;
                                    s = 'n' + elevalue;
                                    if (s.length == 1)
                                        s = 'n' + 0;
                                }
                                wordlist[i] = s;
                                i++;
                                break;
                            }
                        }
                    }
                    if (!chrstate && typeof RegVarFldList != "undefined" && RegVarFldList.length > 0) {//regvar function registered values Evaluate in client in case dependency call not there.
                        $.each(RegVarFldList, function (key, value) {
                            if (value.startsWith(templ + ":")) {
                                chrstate = true;
                                wordlist[i] = value.split(':')[1] + value.split(':')[2];
                                i++;
                                return;
                            }
                        });
                    }

                    if (!chrstate && typeof paramValuesArray != "undefined" && Object.keys(paramValuesArray).length > 0) {
                        // let valueStr = paramValuesArray[Object.keys(paramValuesArray)[Object.keys(paramValuesArray).indexOf(templ.toLowerCase())]];
                        let valueArr = getCaseInSensitiveJsonProperty(paramValuesArray, templ);
                        // if(valueStr !== "" && typeof valueStr != "undefined"){
                        if (valueArr.length > 0) {
                            chrstate = true;
                            // elevalue = valueStr;
                            elevalue = valueArr[0];

                            var dtlenth = elevalue.split('/');
                            if (dtlenth[0].length == 2 && (typeof dtlenth[1] != "undefined" && dtlenth[1].length == 2) && (typeof dtlenth[2] != "undefined" && dtlenth[2].length == 4)) {
                                s = 'd' + elevalue;
                            }
                            else if (isNaN(elevalue)) {
                                s = 's' + elevalue;
                            }
                            else {
                                if (elevalue == "") elevalue = 0;
                                elevalue = elevalue;
                                s = 'n' + elevalue;
                                if (s.length == 1)
                                    s = 'n' + 0;
                            }
                            wordlist[i] = s;

                            i++;
                        }
                    }
                } // end if 2
            }

            //TODO:The code needs to be re-factored          
            for (var r = 0; r < funclist.length; r++) {
                if (wordstring.toLowerCase() == funclist[r].toString().toLowerCase()) {
                    chrstate = true;
                    s = 'f' + funclist[r];
                    wordlist[i] = s;
                    i++;
                    break;
                }
            }
            if (!chrstate) {
                if (wordstring != "") {
                    if (isNaN(wordstring))
                        t = 's';
                    else
                        t = 'n';

                    wordlist[i] = t + wordstring;
                    i++;
                }
            }
            wordstring = '';
        }
        if (ch[j] == "(") {
            if (wordlist.length > 0) {
                var fchar = wordlist[wordlist.length - 1];
                fchar = fchar.substr(0, 1);
                if (fchar == 'f')
                    brackets = brackets + 'f';
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
function EvalFun() {
    // Begin For Loop
    for (var i = wordlist.length - 1; i >= 0; i--) {
        ch = wordlist[i];
        var strch = ch;
        ch = ch.split('');
        var firstchar = ch[0];
        var EvalString = ''; var EvalType = ''; var ExtEvalString = ''; var EvalResult = ''; var ParamIndx = 0; var bracketClose = ""; var bracketOpen = "";
        if (firstchar == 'f') {

            delete wordlist[i + 1];
            j = i + 2;
            exprEvalFun = '';

            functionname = strch.substr(1, strch.length);
            functionname = functionname.toLowerCase();

            while (wordlist[j] != 'e') {
                var value = '';
                if ((wordlist[j] != "") && (wordlist[j] != null)) {
                    ch = wordlist[j];
                    strch = ch;
                    ch = ch.split('');
                    firstchar = ch[0];
                    value = strch.substr(1, strch.length);

                    if (wordlist[j] == 'b(') {
                        //EvalString += '(';
                        bracketOpen += '(';
                        EvalType = '';
                    }
                    else if (wordlist[j] == 'b)') {
                        //ExtEvalString = ExtEvalString + EvalString + ')';
                        //EvalString = '';
                        //EvalType = '';
                        bracketClose += ')';
                    }
                    else if (wordlist[j] == 'o<' || wordlist[j] == 'o>' || wordlist[j] == 'o=' || wordlist[j] == 'o#') {
                        var op = ch[1];
                        if (op == '=')
                            op = '==';
                        else if (op == '#')
                            op = '!=';
                        EvalString = EvalString + op
                    }
                    else if (wordlist[j] == 'o+' || wordlist[j] == 'o-' || wordlist[j] == 'o*' || wordlist[j] == 'o/') {
                        var op = ch[1];
                        if (EvalString != '')
                            EvalString = EvalString + op;
                        else if (ExtEvalString != '')
                            ExtEvalString = ExtEvalString + op;
                    }
                    else if (firstchar == 'o') {
                        var op = ch[1];
                        EvalResult = GetEvalResult(EvalString, EvalType);
                        ExtEvalString = ExtEvalString + bracketOpen + EvalResult + bracketClose + op + op;
                        bracketClose = '';
                        bracketOpen = '';
                        EvalString = '';
                        EvalType = '';
                    }
                    else if (wordlist[j] == 'l,') {
                        EvalResult = GetEvalResult(EvalString, EvalType);
                        if (EvalResult != '') {
                            if (EvalType == 'd')
                                ExtEvalString = ExtEvalString + bracketOpen + '"' + EvalResult + '"' + bracketClose;
                            else if (EvalType == 's' && EvalResult.toString().substr(0, 1) != '"')
                                ExtEvalString = ExtEvalString + bracketOpen + '"' + EvalResult + '"' + bracketClose;// ExtEvalString + '"' + EvalResult + '"';
                            else
                                ExtEvalString = ExtEvalString + bracketOpen + EvalResult + bracketClose;// ExtEvalString + '"' + EvalResult + '"';
                            EvalResult = GetEvalResult(ExtEvalString, EvalType);
                        }
                        else if (EvalResult != null) {
                            ExtEvalString = ExtEvalString + bracketOpen + EvalResult + bracketClose;
                            EvalResult = GetEvalResult(ExtEvalString, EvalType);
                        }
                        params[ParamIndx] = EvalResult;
                        ParamIndx++;
                        bracketClose = '';
                        bracketOpen = '';
                        EvalResult = '';
                        EvalType = '';
                        EvalString = '';
                        ExtEvalString = '';
                    }
                    else {
                        if (firstchar == 'n') {
                            if (value == null || value == '')
                                value = 0;
                            EvalString = EvalString + value;
                            EvalType = 'n';
                        }
                        else if (firstchar == 'd') {
                            EvalType = 'd';
                            if (value == "")
                                value = "01/01/1900";
                            EvalString = EvalString + '"' + value + '"';
                        }
                        else if (firstchar == 's') {
                            if ((value.indexOf("/") != -1 && value.split('/').length == 3) || EvalType == 'd') {
                                value = value.replace(/\"/g, "");
                                var dtlenth = value.split('/');
                                if (dtlenth[0].length == 2 && dtlenth[1].length == 2 && dtlenth[2].length == 4) {
                                    EvalType = 'd';
                                    EvalString = EvalString + '"' + value + '"';
                                }
                                else if (value.substr(0, 1) != '"') {
                                    EvalType = 's';
                                    EvalString = EvalString + '"' + value + '"';
                                }
                                else {
                                    EvalType = 's';
                                    EvalString = EvalString + value;
                                }
                            }
                            else if (value.substr(0, 1) != '"') {
                                EvalType = 's';
                                EvalString = EvalString + '"' + value + '"';
                            }
                            else {
                                EvalType = 's';
                                EvalString = EvalString + value;
                            }
                        }
                        else if (firstchar == 'c') {
                            if (value.indexOf("/") != -1 && value.split('/').length == 3) {
                                var dtlenth = value.split('/');
                                if (dtlenth[0].length == 2 && dtlenth[1].length == 2 && dtlenth[2].length == 4) {
                                    EvalType = 'd';
                                    EvalString = EvalString + '"' + value + '"';
                                }
                                else if (value.substr(0, 1) != '"')
                                    EvalString = EvalString + '"' + value + '"';
                                else
                                    EvalString = EvalString + value;
                            }
                            else if (value.substr(0, 1) != '"')
                                EvalString = EvalString + '"' + value + '"';
                            else
                                EvalString = EvalString + value;
                        }
                        params[ParamIndx] = EvalString;
                    }
                }
                delete wordlist[j];
                j++;
                if (wordlist[j] == "e") {
                    try {
                        if (EvalString != '')
                            params[ParamIndx] = eval(EvalString);
                        else if (ExtEvalString != '')
                            params[ParamIndx] = eval(ExtEvalString);
                    }
                    catch (expFldname) {
                        params[ParamIndx] = EvalString;
                    }
                    if (params[ParamIndx] == "Infinity" || params[ParamIndx] == "NaN") {
                        params[ParamIndx] = 0;
                    }
                }
            }
            delete wordlist[j];
            wordlist[i] = CallFunction(functionname, params);
            params = new Array();
            ParamIndx = 0;
            z = 0;
        }
    }
    // End For Loop
}

function GetEvalResult(EvalString, EvalType) {
    var Result = "";
    if (EvalType == 'd') {
        if (EvalString.indexOf('<') != -1 || EvalString.indexOf('>') != -1 || EvalString.indexOf('==') != -1 || EvalString.indexOf('!=') != -1 || EvalString.indexOf('-') != -1) {
            var Operator = EvalString.indexOf('<') != -1 ? '<' : EvalString.indexOf('>') != -1 ? '>' : EvalString.indexOf('==') != -1 ? '==' : EvalString.indexOf('!=') != -1 ? '!=' : EvalString.indexOf('-') != -1 ? '-' : '';
            var Date1 = EvalString.split(Operator)[0];
            var Date2 = EvalString.split(Operator)[1];
            Date1 = Date1.replace(new RegExp('"', "gi"), '');
            Date2 = Date2.replace(new RegExp('"', "gi"), '');
            Operator = Operator == "==" ? '=' : Operator;
            if (Operator == "-")
                Result = SubtractDate(Date1, Date2, Operator);
            else
                Result = CompareDate(Date1, Date2, Operator);
        }
        else {
            try {
                Result = eval(EvalString);
            }
            catch (expFldname) {
                Result = EvalString;
            }
        }
    }
    else {
        try {
            var orgString = "";
            var EvalStringNew = EvalString;
            if (typeof EvalStringNew.length != "undefined" && EvalStringNew.length == 1) {
                orgString = EvalStringNew;
                EvalStringNew = EvalStringNew.toLowerCase();
            }

            Result = eval(EvalStringNew);

            if (orgString != "")
                Result = orgString;
        }
        catch (expFldname) {
            Result = EvalString;
        }
    }
    if (Result == "Infinity" || Result == "NaN") {
        Result = 0;
    }
    if (Result == undefined)
        Result = EvalString;
    return Result;
}


function GetExprString() {

    var s = '';
    var variable = '';
    for (var i = 0; i < wordlist.length; i++) {
        if ((wordlist[i] != "") && (wordlist[i] != null)) {
            ch = wordlist[i];
            var strch = ch;
            ch = ch.split('');
            var firstchar = ch[0];
            if (firstchar == "e") {
                variable = ")";
            }
            else if ((firstchar == "s") || (firstchar == "c")) {

                if ((ch[1] != '"'))// && (isNaN(strch.substr(1, strch.length)))
                    variable = '"' + strch.substr(1, strch.length) + '"';
                else if (strch.substr(1, strch.length) == "")
                    variable = '"' + strch.substr(1, strch.length) + '"';
                else
                    variable = strch.substr(1, strch.length);
            }
            else if (firstchar == "d") {

                variable = '"' + strch.substr(1, strch.length) + '"';
            }
            else {
                if (firstchar == "n") {
                    variable = strch.substr(1, strch.length);
                    if (parseInt(variable) < 0) variable = "(" + variable + ")";
                }
                else {
                    variable = strch.substr(1, strch.length);
                }
            }
            s = s + variable;
        }
    }
    return s;
}


function isOperator(who) {

    return ((who == "+" || who == "-" || who == "*" || who == "/" || who == "^" || who == "=" || who == ">" || who == "<" || who == "#" || who == "&" || who == "|" || who == "$") ? true : false);
}
function isDelimiter(who) {

    return ((who == " " || who == "(" || who == ")" || who == ",") ? true : false);
}

function ReturnDMYOfDate(dt, src) {
    if (IsValidDate(dt) == 0) {
        var day = "";
        dt = dt.toString();
        var arrdt = new Array();
        arrdt = dt.split("/");
        var result = 0;
        if (dateString == "dd/mm/yyyy") {
            if (src == "day")
                result = parseInt(arrdt[0], 10);
            else if (src == "month")
                result = parseInt(arrdt[1], 10);
            else if (src == "year")
                result = parseInt(arrdt[2], 10);
        }
        else {

            if (src == "day")
                result = parseInt(arrdt[1], 10);
            else if (src == "month")
                result = parseInt(arrdt[0], 10);
            else if (src == "year")
                result = parseInt(arrdt[2], 10);
        }
        return result;
    }
    else
        return 0;
}

function MonthOfDate(dt) {
    return ReturnDMYOfDate(dt, "month");
}


function YearOfDate(dt) {
    return ReturnDMYOfDate(dt, "year");
}

function IsValidDate(dtStr) {

    if (dtStr != "" && dtStr != dateString) {

        var daysInMonth = DaysArray(12);
        var pos1 = dtStr.indexOf(dtCh);
        var pos2 = dtStr.indexOf(dtCh, pos1 + 1);
        var strDay = 0; var strMonth = 0;
        var glCulture = eval(callParent('glCulture'));
        if (glCulture != undefined && glCulture == "en-us") {
            strMonth = dtStr.substring(0, pos1);
            strDay = dtStr.substring(pos1 + 1, pos2);
        }
        else {
            strDay = dtStr.substring(0, pos1);
            strMonth = dtStr.substring(pos1 + 1, pos2);
        }
        var strYear = dtStr.substring(pos2 + 1);
        strYr = strYear;

        if (strDay.charAt(0) == "0" && strDay.length > 1) strDay = strDay.substring(1);
        if (strMonth.charAt(0) == "0" && strMonth.length > 1) strMonth = strMonth.substring(1);

        for (var i = 1; i <= 3; i++) {
            if (strYr.charAt(0) == "0" && strYr.length > 1) strYr = strYr.substring(1);
        }

        var month = parseInt(strMonth, 10);
        var day = parseInt(strDay, 10);
        var year = parseInt(strYr, 10);

        if (pos1 == -1 || pos2 == -1) {
            return 1;
        }
        else if (strMonth.length < 1 || month < 1 || month > 12) {
            return 2;
        }
        else if (strDay.length < 1 || day < 1 || day > 31 || (month == 2 && day > daysInFebruary(year)) || day > daysInMonth[month]) {
            return 3;
        }
        else if (strYear.length != 4 || year == 0 || year < minYear || year > maxYear) {
            return 4;
        }
        else if (dtStr.indexOf(dtCh, pos2 + 1) != -1 || isInteger(stripCharsInBag(dtStr, dtCh)) == false) {
            return 5;
        }
        else
            return 0;
    }
    else
        return -1;
}

function DayOfDate(dt) {
    return ReturnDMYOfDate(dt, "day");
}

function IfFun(val1, val2, val3) {

    var result = '';
    if (val1) {
        if (!isNaN(val2))
            result = val2;
        else
            result = '"' + val2 + '"';
    }
    else {
        if (!isNaN(val3))
            result = val3;
        else
            result = '"' + val3 + '"';
        //result = val3;
        //if (expressiontype == "vexpr") {


        //}
    }
    return result;
}

function Length(str) {

    var length;
    length = str.toString().length;
    return length;
}

function SubStr(str, start, len) {

    if (start == 0 || start == "0")
        start = 0;
    else
        start = start - 1;

    len = start + len;
    if ((str != "") && (str != 0))
        str = str.toString().substring(start, len);
    return str;
}

function PAbs(x) {

    var abs = Math.abs(x);
    return abs;
}

function FindCharPos(my_str, my_char) {

    var pos = my_str.indexOf(my_char);
    if (pos == -1)
        showAlertDialog("error", 2033, "client");
    else
        return pos;
}

function ChkUniqChar(str) {

    var i, j, l;
    var vstr = new Array();
    var l = str.length;
    var count = 0;
    for (i = 0; i < l; i++) {
        for (j = i + 1; j < l; j++) {
            if (str.charAt(i) == str.charAt(j)) {
                count++;
            }
        }
    }
    if (count > 0)
        return true;
    else
        return false;
}

function TrimAll(sString) {

    while (sString.substring(0, 1) == ' ') {
        sString = sString.substring(1, sString.length);
    }
    while (sString.substring(sString.length - 1, sString.length) == ' ') {
        sString = sString.substring(0, sString.length - 1);
    }
    return sString;
}

function ExtractNum(str) {

    return (str.replace(/\D/g, ''));
}

function Mods(v1, v2) {

    var x = v1 % v2;
    return x;
}

function LastDayOfMonth(dateStr) {
    try {
        if (dateStr != "") {
            var dtStr = dateStr.toString().split("/");
            var month = ""; var year = ""; var day = "";
            if (dateString == "dd/mm/yyyy") {
                day = dtStr[0].toString();
                month = dtStr[1].toString();
                year = dtStr[2].toString();
            }
            else {
                day = dtStr[1].toString();
                month = dtStr[0].toString();
                year = dtStr[2].toString();
            }

            var newDate = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
            var lastDay = "31";
            month = parseInt(month, 10);
            lastDay = DaysInMonth(year, month);
            newDate = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(lastDay, 10));
            newDate = ConstructDate(newDate);
            return newDate;
        }
        else
            return "";
    } catch (e) {
        return "";
    }

}

function IsLeapYear(yr) {
    return new Date(yr, 2 - 1, 29).getDate() == 29;
}

function ConstructDate(dateObj) {

    if (dateString == "dd/mm/yyyy") {
        resultDate = ("0" + dateObj.getDate()).slice(-2) + "/" + ("0" + (dateObj.getMonth() + 1)).slice(-2) + "/" + dateObj.getFullYear();
    }
    else {
        resultDate = ("0" + (dateObj.getMonth() + 1)).slice(-2) + "/" + ("0" + dateObj.getDate()).slice(-2) + "/" + dateObj.getFullYear();
    }
    return resultDate;
}


function DaysInMonth(year, month) {

    month = parseInt(month, 10);
    var noOfDays = 0;
    if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12)
        noOfDays = 31;
    else if (month == 4 || month == 6 || month == 9 || month == 11)
        noOfDays = 30;
    else {
        if (IsLeapYear(parseInt(year, 10)))
            noOfDays = 29;
        else
            noOfDays = 28;
    }
    return noOfDays;
}


function ValidEncodeDate(y, m, d) {

    var dt = new Date(y, m - 1, d);
    return dt;
}


function GetInteger(real) {

    var x = 0;
    if (!isNaN(real))
        x = parseInt(real);
    return x;
}


function AddToMonth(dateTime, i) {
    if (dateTime != "" && dateTime != "0") {
        var newDate = GetDateObj(dateTime);
        if (newDate != null) {
            newDate.setMonth(newDate.getMonth() + parseInt(i, 10));
            var resultDate = ConstructDate(newDate);
            return resultDate;
        }
    }
    return 0;
}


function AddToDate(dateTime, i) {
    if (dateTime != "") {
        var newDate = GetDateObj(dateTime);
        if (newDate != null) {
            newDate.setDate(newDate.getDate() + parseInt(i, 10));
            var resultDate = ConstructDate(newDate);
            return resultDate;
        }
    }
    return 0;
}


function Time() {
    var dt = new Date();
    var time = dt.toTimeString();
    return time;
}

//Returns the date object from the given date string.
function GetDateObj(dateStr) {
    if (dateStr != "" && dateStr.toString().indexOf("/") != -1) {
        var dtStr = dateStr.toString().split("/");
        var month = ""; var year = ""; var day = ""; var resultDate = "";
        if (dateString == "dd/mm/yyyy") {
            day = dtStr[0].toString();
            month = dtStr[1].toString();
            year = dtStr[2].toString();
        }
        else {
            day = dtStr[1].toString();
            month = dtStr[0].toString();
            year = dtStr[2].toString();
        }
        if ((isNaN(day) || isNaN(month) || isNaN(year)))
            return null;
        resultDate = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
        return resultDate;
    }
    else
        return "";
}

function TimeElapsed(d1, d2) {

    if (d1 != "" && d2 != "") {
        date1 = GetDateObj(d1);
        var date2 = GetDateObj(d2);
        if (date1 != null && date2 != null) {
            var sec = date2.getTime() - date1.getTime();
            var second = 1000, minute = 60 * second, hour = 60 * minute, day = 24 * hour;
            var hr = trunc(sec / hour);
            var min = trunc(sec / minute);
            var secs = trunc(sec / second);
            var days = Math.floor(sec / day);
            //sec -= days * day;
            sec = days * day;
            var hours = Math.floor(sec / hour);
            //sec -= hours * hour;
            sec = hours * hour;
            var minutes = Math.floor(sec / minute);
            //sec -= minutes * minute;
            sec = minutes * minute;
            var seconds = Math.floor(sec / second);
            var time = days + " day" + (days != 1 ? "s" : "") + ", " + hours + " hour" + (hours != 1 ? "s" : "") + ", " + minutes + " minute" + (minutes != 1 ? "s" : "") + ", " + seconds + " second" + (seconds != 1 ? "s" : "");
            return time;
        }
        else
            return "";
    }
    return "";
}

function trunc(n) {
    return Math[n > 0 ? "floor" : "ceil"](n);
}

function DaysElapsed(d1, d2) {

    try {
        if (d1 == "01/01/1900")
            d1 = "";
        if (d2 == "01/01/1900")
            d2 = "";

        if (d1 != "" && d2 != "") {
            var stdt = GetDateObj(d1);
            var endt = GetDateObj(d2);

            if (stdt != null && endt != null) {

                var stdtUTC = new Date(Date.UTC(stdt.getUTCFullYear(), stdt.getUTCMonth(), stdt.getUTCDate(), 0, 0, 0));
                var endtUTC = new Date(Date.UTC(endt.getUTCFullYear(), endt.getUTCMonth(), endt.getUTCDate(), 0, 0, 0));

                if (endtUTC > stdtUTC)
                    return Math.floor((endtUTC - stdtUTC) / 8.64e7);
                else if (endtUTC == stdtUTC)
                    return 0;
                else
                    return Math.floor((stdtUTC - endtUTC) / 8.64e7);
            }
        }
        return 0;
    } catch (e) {
        return "";
    }

}

function MandY(dateTime) {

    if (dateTime != 0 && dateTime != "") {
        var newDate = GetDateObj(dateTime);
        if (newDate != null) {
            var mon = newDate.getMonth() + 1;
            mon = PrefixZero(mon);
            var year = newDate.getFullYear();
            return (year + "" + mon);
        }
    }
    return "";
}

function FindAndReplace(strText, findstr, repstr) {

    strReplaceAll = strText.replace(new RegExp(findstr, "gi"), repstr);
    return (strReplaceAll);
}

function removeCommas(aNum) {

    if (aNum == undefined || (aNum == ""))
        return "0";
    aNum = aNum.toString();
    aNum = aNum.replace(/,/g, "");
    return aNum;
}

function GetNthString(str, pos) {

    str = str.substring(pos);
    return str;
}

function RoundOff(str, dig) {

    var x = Math.pow(10, dig);
    var Result = Math.round(str * x) / x;
    return Result;
}

function InsertCommas(amount) {

    var i = parseFloat(amount);
    if (isNaN(i)) { i = 0.00; }
    var minus = '';
    if (i < 0) { minus = '-'; }
    i = Math.abs(i);
    i = parseInt((i + .005) * 100);
    i = i / 100;
    s = new String(i);
    if (s.indexOf('.') < 0) { s += '.00'; }
    if (s.indexOf('.') == (s.length - 2)) { s += '0'; }
    s = minus + s;
    var formattedamt = CommaFormatted(s);

    return formattedamt;
}

function CommaFormatted(amount) {
    var delimiter = ","; // replace comma if desired
    var a = "";
    if (amount.toString().indexOf(".") == -1)
        amount = amount + ".";

    a = amount.split('.');
    var d = "";
    if (a.length > 1)
        d = a[1].toString();
    var i = parseInt(a[0]);
    if (isNaN(i)) { return ''; }
    var minus = '';
    if (amount < 0) { minus = '-'; }
    i = Math.abs(i);
    var n = new String(i);
    var a = [];
    while (n.length > 3) {
        var nn = n.substr(n.length - 3);
        a.unshift(nn);
        n = n.substr(0, n.length - 3);
    }
    if (n.length > 0) { a.unshift(n); }
    n = a.join(delimiter);
    if (d.length < 1) { amount = n; }
    else { amount = n + '.' + d; }
    amount = minus + amount;
    return amount;
}

function LeftPad(text, size, ch) {

    var out = String(text);
    if (!ch) ch = '0';
    while (out.length < size) {
        if (out.length == size)
            out += ch;
        else
            out = ch + out;
    }
    return out;
}

function RightPad(text, size, ch) {

    var out = String(text);
    if (!ch) ch = '0';
    while (out.length < size) {
        if (out.length == size)
            out = ch + out;
        else
            out += ch;
    }
    return out;
}

function Pad(text, size, ch) {

    var out = String(text);
    if (!ch) ch = '0';
    while (out.length < size) {
        out = ch + out;
        if (out.length < size)
            out += ch;
    }
    return out;
}

function GetSeperatorCount(srcstr, separator) {

    var str = srcstr.toString();
    var strArray = str.split(separator);
    return (strArray.length - 1);
}

function Val(fldValue) {

    var num = fldValue.toString();
    if (num.indexOf("{") != -1 || num.indexOf("}") != -1) {
        var x = num.replace(/^\{?([^\}])/, "");
        x = x.split(')');
        num = x[0];
    }
    num = removeCommas(num);
    return parseFloat(num);
}

function Str(Number) {

    var x = '';
    if (isNaN(Number))
        showAlertDialog("error", 2034, "client");
    else
        x = Number.toString();
    return x;
}

function UpperCase(Strparam) {

    var str = Strparam.toString();
    if (str == "0") { str = ""; return str; }
    else { return str.toUpperCase(); }
}

function LowerCase(Strparam) {

    var str = Strparam.toString();
    return str.toLowerCase();
}

function IsVarEmpty(Strparam) {

    var str = Strparam.toString();
    if (str == "")
        return true;
    else
        return false;
}

function GetVarValue(Strparam) {

    return Strparam.valueOf();
}

function Amt_Word(num) {

    var Inwords = "";
    if (num != undefined) {
        if ((num.length == 0)) {
            showAlertDialog('warning', 2035, "client");
            return true;
        }
        else {
            Inwords = toWords(num);
        }
    }

    return Inwords;
}

function ValidateAmount(s) {
    var junkVal = s;
    junkVal = Math.floor(junkVal);
    var obStr = new String(junkVal);
    numReversed = obStr.split("");
    actnumber = numReversed.reverse();

    if (Number(junkVal) >= 0) {
        //do nothing
    }
    else {
        //showAlertDialog('error', 2036, "client");
        return false;
    }

    if (Number(junkVal) == 0) {
        return '';
    }
    if (actnumber.length > 9) {
        showAlertDialog('warning', 2037, "client");
        return false;
    }

    var iWords = ["Zero", "One", "Two", "Three", "Four", "Five", " Six", " Seven", " Eight", "Nine"];
    var ePlace = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    var tensPlace = ['dummy', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    var iWordsLength = numReversed.length;
    var totalWords = "";
    var inWords = new Array();
    var finalWord = "";
    j = 0;
    for (i = 0; i < iWordsLength; i++) {
        switch (i) {
            case 0:
                if (actnumber[i] == 0 || actnumber[i + 1] == 1) {
                    inWords[j] = '';
                }
                else {
                    inWords[j] = iWords[actnumber[i]];
                }
                inWords[j] = inWords[j];
                break;
            case 1:
                tens_complication();
                break;
            case 2:
                if (actnumber[i] == 0) {
                    inWords[j] = '';
                }
                else if (actnumber[i - 1] != 0 && actnumber[i - 2] != 0) {
                    inWords[j] = iWords[actnumber[i]] + ' Hundred and';
                }
                else {
                    inWords[j] = iWords[actnumber[i]] + ' Hundred';
                }
                break;
            case 3:
                if (actnumber[i] == 0 || actnumber[i + 1] == 1) {
                    inWords[j] = '';
                }
                else {
                    inWords[j] = iWords[actnumber[i]];
                }
                if (actnumber[i + 1] != 0 || actnumber[i] > 0) { //here
                    inWords[j] = inWords[j] + " Thousand";
                }
                break;
            case 4:
                tens_complication();
                break;
            case 5:
                if (actnumber[i] == "0" || actnumber[i + 1] == 1) {
                    inWords[j] = '';
                }
                else {
                    inWords[j] = iWords[actnumber[i]];
                }
                if (actnumber[i + 1] != 0 || actnumber[i] > 0) {   //here
                    inWords[j] = inWords[j] + " Lakh";
                }

                break;
            case 6:
                tens_complication();
                break;
            case 7:
                if (actnumber[i] == "0" || actnumber[i + 1] == 1) {
                    inWords[j] = '';
                }
                else {
                    inWords[j] = iWords[actnumber[i]];
                }
                if (actnumber[i + 1] != 0 || actnumber[i] > 0) { // changed here
                    inWords[j] = inWords[j] + " Crore";
                }
                break;
            case 8:
                tens_complication();
                break;
            default:
                break;
        }
        j++;
    }

    function tens_complication() {
        if (actnumber[i] == 0) {
            inWords[j] = '';
        }
        else if (actnumber[i] == 1) {
            inWords[j] = ePlace[actnumber[i - 1]];
        }
        else {
            inWords[j] = tensPlace[actnumber[i]];
        }
    }
    inWords.reverse();
    for (i = 0; i < inWords.length; i++) {
        if (inWords[i] != "")
            finalWord += ' ' + inWords[i];
        else
            finalWord += '' + inWords[i];
    }
    return finalWord;
}

function toWords(s) {
    var finalWord1 = ValidateAmount(s);
    var finalWord2 = "";

    var val = s;
    var actual_val = s;
    s = val;
    val = val.toString();

    var idx = val.indexOf('.');
    if (idx != -1) {
        val = val.substring(idx + 1, val.length);
        if (val.length == 0 || val == "00") {
            finalWord2 = "Zero paisa Only";
        }
        else {
            s = val;
            finalWord2 = ValidateAmount(s) + " paisa Only";
        }
        if (finalWord1 == "")
            return finalWord2;
        else
            return (" Rupees" + finalWord1 + " and " + finalWord2);
    }
    else {
        return (" Rupees" + finalWord1 + " Only");
    }
}

function curtoWords(s) {
    var finalWord1 = ValidateAmount(s);
    var finalWord2 = "";

    var val = s;
    var actual_val = s;
    s = val;
    val = val.toString();

    var idx = val.indexOf('.');
    if (idx != -1) {
        val = val.substring(idx + 1, val.length);
        if (val.length == 0 || val == "00") {
            finalWord2 = "Zero paisa";
        }
        else {
            s = val;
            finalWord2 = ValidateAmount(s) + " paisa";
        }
        if (finalWord1 == "")
            return finalWord2;
        else
            return (finalWord1 + " and " + finalWord2);
    }
    else {
        return (finalWord1);
    }
}

function EvaluatePower(base, Strparam) {

    var power = Strparam.value;
    var exp = Math.pow(base, power);
    return exp;
}
function push_stack(stackArr, ele) {

    stackArr[stackArr.length] = ele;
}
function pop_stack(stackArr) {

    var _temp = stackArr[stackArr.length - 1];
    delete stackArr[stackArr.length - 1];
    stackArr.length--;
    return (_temp);
}
function isOperand(who) {

    return ((!isOperator(who) && (who != "(") && (who != ")")) ? true : false);
}
function topStack(stackArr) {

    return (stackArr[stackArr.length - 1]);
}
function isEmpty(stackArr) {

    return ((stackArr.length == 0) ? true : false);
}
function prcd(who) {

    if (who == "^")
        return (5);
    if ((who == "*") || (who == "/"))
        return (4);
    if ((who == "+") || (who == "-"))
        return (3);
    if (who == "(")
        return (2);
    if (who == ")")
        return (1);
}
function InfixToPostfix(infixStr) {

    var postfixStr = new Array();
    var stackArr = new Array();
    var postfixPtr = 0;
    infixStr = infixStr.split('');
    for (var i = 0; i < infixStr.length; i++) {
        if (isOperand(infixStr[i])) {
            postfixStr[postfixPtr] = infixStr[i];
            postfixPtr++;
        }
        if (isOperator(infixStr[i])) {
            if (infixStr[i] != "^") {
                while ((!isEmpty(stackArr)) && (prcd(infixStr[i]) <= prcd(topStack(stackArr)))) {
                    postfixStr[postfixPtr] = topStack(stackArr);
                    pop_stack(stackArr);
                    postfixPtr++;
                }
            }
            else {
                while ((!isEmpty(stackArr)) && (prcd(infixStr[i]) < prcd(topStack(stackArr)))) {
                    postfixStr[postfixPtr] = topStack(stackArr);
                    pop_stack(stackArr);
                    postfixPtr++;
                }
            }
            push_stack(stackArr, infixStr[i]);
        }
        if (infixStr[i] == "(") {
            push_stack(stackArr, infixStr[i]);
        }
        if (infixStr[i] == ")") {
            while (topStack(stackArr) != "(") {
                postfixStr[postfixPtr] = pop_stack(stackArr);
                postfixPtr++;
            }
            pop_stack(stackArr);
        }
    }
    while (!isEmpty(stackArr)) {
        if (topStack(stackArr) == "(")
            pop_stack(stackArr)
        else
            postfixStr[postfixStr.length] = pop_stack(stackArr);
    }
    var returnVal = '';
    for (var i = 0; i < postfixStr.length; i++) {
        returnVal += postfixStr[i];
    }
    return (returnVal);
}
function PostfixToInfix(postfixStr) {

    var stackArr = new Array();
    postfixStr = postfixStr.split('');
    for (var i = 0; i < postfixStr.length; i++) {
        if (isOperand(postfixStr[i])) {
            push_stack(stackArr, postfixStr[i]);
        }
        else {
            var temp = topStack(stackArr);
            pop_stack(stackArr);
            var pushVal = topStack(stackArr) + postfixStr[i] + temp;
            pop_stack(stackArr);
            push_stack(stackArr, pushVal);
        }
    }
    return (topStack(stackArr));
}

function PostfixSubEval(num1, num2, sym) {

    var returnVal;
    if (sym == "+")
        returnVal = num1 + num2;
    if (sym == "-")
        returnVal = num1 - num2;
    if (sym == "*")
        returnVal = num1 * num2;
    if (sym == "/")
        returnVal = num1 / num2;
    if (sym == "^")
        returnVal = Math.pow(num1, num2);
    return (returnVal);
}


function PostfixEval(postfixStr) {

    var stackArr = new Array();
    postfixStr = postfixStr.split('');
    for (var i = 0; i < postfixStr.length; i++) {
        if (isOperand(postfixStr[i])) {
            push_stack(stackArr, postfixStr[i]);
        }
        else {
            var temp = parseFloat(topStack(stackArr));
            pop_stack(stackArr);
            var pushVal = PostfixSubEval(parseFloat(topStack(stackArr)), temp, postfixStr[i]);
            pop_stack(stackArr);
            push_stack(stackArr, pushVal);
        }
    }
    return (topStack(stackArr));
}

function InputPrecedence(Precedence) {

    var result = 11;
    result = parseInt(result);
    if (Precedence == ')') { result = 0; return result; }
    else if (Precedence == '|') { result = 1; return result; }
    else if (Precedence == '&') { result = 3; return result; }
    else if ((Precedence == '+') || (Precedence == '-')) { result = 5; return result; }
    else if ((Precedence == '*') || (Precedence == '/')) { result = 7; return result; }
    else if ((Precedence == '^') || (Precedence == '>') || (Precedence == '<') || (Precedence == '#') || (Precedence == '$')) { result = 10; return result; }
    else if (Precedence == '(') { result = 13; return result; }
    else { return result; }
}

function StackPrecedence(Precedence) {

    var result = 12;
    result = parseInt(result);
    if (Precedence == '(') { result = 0; return result; }
    else if (Precedence == '|') { result = 2; return result; }
    else if (Precedence == '&') {
        result = 4; return result;
    }
    else if ((Precedence == '+') || (Precedence == '-')) { result = 6; return result; }
    else if (Precedence == '*' || Precedence == '/') {
        result = 8; return result;
    } else if (Precedence == '^' || Precedence == '>' || Precedence == '=' || Precedence == '<' || Precedence == '#' || Precedence == '$') { result = 9; return result; }
    else { return result; }
}

function ISOperator(operator) {

    if (operator == '+' || operator == '-' || operator == '*' || operator == '/' || operator == '<' || operator == '>' || operator == '=' || operator == '#' || operator == '&' || operator == '|' || operator == '$')
        return true;
    else
        return false;
}

var enc64List, dec64List;
function initBase64() {

    enc64List = new Array();
    dec64List = new Array();
    var i;
    for (i = 0; i < 26; i++) {
        enc64List[enc64List.length] = String.fromCharCode(65 + i);
    }
    for (i = 0; i < 26; i++) {
        enc64List[enc64List.length] = String.fromCharCode(97 + i);
    }
    for (i = 0; i < 10; i++) {
        enc64List[enc64List.length] = String.fromCharCode(48 + i);
    }
    enc64List[enc64List.length] = "+";
    enc64List[enc64List.length] = "/";
    for (i = 0; i < 128; i++) {
        dec64List[dec64List.length] = -1;
    }
    for (i = 0; i < 64; i++) {
        dec64List[enc64List[i].charCodeAt(0)] = i;
    }
}

function Encode(str) {

    var c, d, e, end = 0;
    var u, v, w, x;
    var ptr = -1;
    var input = str.split("");
    var output = "";
    while (end == 0) {
        c = (typeof input[++ptr] != "undefined") ? input[ptr].charCodeAt(0) :
            ((end = 1) ? 0 : 0);
        d = (typeof input[++ptr] != "undefined") ? input[ptr].charCodeAt(0) :
            ((end += 1) ? 0 : 0);
        e = (typeof input[++ptr] != "undefined") ? input[ptr].charCodeAt(0) :
            ((end += 1) ? 0 : 0);
        u = enc64List[c >> 2];
        v = enc64List[(0x00000003 & c) << 4 | d >> 4];
        w = enc64List[(0x0000000F & d) << 2 | e >> 6];
        x = enc64List[e & 0x0000003F];

        if (end >= 1) { x = "="; }
        if (end == 2) { w = "="; }

        if (end < 3) { output += u + v + w + x; }
    }
    var formattedOutput = "";
    var lineLength = 76;
    while (output.length > lineLength) {
        formattedOutput += output.substring(0, lineLength) + "\n";
        output = output.substring(lineLength);
    }
    formattedOutput += output;
    return formattedOutput;
}

function Decode(str) {

    var c = 0, d = 0, e = 0, f = 0, i = 0, n = 0;
    var input = str.split("");
    var output = "";
    var ptr = 0;
    do {
        f = input[ptr++].charCodeAt(0);
        i = dec64List[f];
        if (f >= 0 && f < 128 && i != -1) {
            if (n % 4 == 0) {
                c = i << 2;
            } else if (n % 4 == 1) {
                c = c | (i >> 4);
                d = (i & 0x0000000F) << 4;
            } else if (n % 4 == 2) {
                d = d | (i >> 2);
                e = (i & 0x00000003) << 6;
            } else {
                e = e | i;
            }
            n++;
            if (n % 4 == 0) {
                output += String.fromCharCode(c) +
                    String.fromCharCode(d) +
                    String.fromCharCode(e);
            }
        }
    }
    while (typeof input[ptr] != "undefined");
    output += (n % 4 == 3) ? String.fromCharCode(c) + String.fromCharCode(d) :
        ((n % 4 == 2) ? String.fromCharCode(c) : "");
    return output;
}

initBase64();

function PrefixZero(dayOrMonth) {
    if (dayOrMonth.toString().length == 1)
        dayOrMonth = "0" + dayOrMonth;
    return dayOrMonth;
}

function DTOC(dateTimeparam) {
    if (dateTimeparam != "" && dateTimeparam != undefined && dateTimeparam != "01/01/1900") {

        var dd = GetDateObj(dateTimeparam);
        if (dd != null) {
            var mon = dd.getMonth() + 1;
            mon = PrefixZero(mon);
            var year = dd.getFullYear();
            var date = dd.getDate();
            date = PrefixZero(date);
            if (dateString == "dd/mm/yyyy")
                resultDate = date + "/" + mon + "/" + year;
            else
                resultDate = mon + "/" + date + "/" + year;

            return resultDate.toString();
        }
    }
    return "";
}

function CTOD(strDateparam) {
    return DTOC(strDateparam);
}

function CMonthYear(dateTimeparam) {
    try {
        if (dateTimeparam != "" && dateTimeparam != "0") {
            var dd = GetDateObj(dateTimeparam);
            if (dd != null) {
                var val = dd.valueOf();
                var mon = dd.getMonth();
                var year = dd.getFullYear();
                var monthNames = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
                mon = monthNames[mon];
                return (mon + " " + year);
            }
        }
        return "";
    } catch (e) {
        return "";
    }

}

function Stuff(str1, str2, pos) {

    var datatype = typeof (str1);
    var str = str1.toString();
    if (IsEmptyValue(str, datatype) == "T")
        showAlertDialog("error", 2038, "client");
    var lstr = str.substring(0, pos);
    var Rstr = str.substring(parseInt(pos));
    str = lstr + str2 + Rstr;
    return str;
}

function Rnd(strReal, strInt) {

    var amt;
    var nval = parseFloat(strReal);
    var x = parseInt(strInt);
    var m = parseInt(nval * 100);
    var h = parseInt(x / 2);
    var d = m - x * parseInt(m / x);
    if (d >= h)
        amt = m + x - d;
    else
        amt = m - d;
    var result = amt / 100.00;

    if (isNaN(result))
        return 0;
    else
        return result;
}

function IsEmptyValue(val, datatype) {

    var Result = "F";
    if (val == "01/01/1900")
        val = "";
    if ((val == "") || (val == null))
        Result = "T";
    else if ((datatype == "object") && (isNaN(val)))
        Result = "T";
    else if (datatype == "d" && (val == "dd/mm/yyyy" || val == "01/01/1900"))
        Result = "T";
    else if (datatype == "n" && parseFloat(val) == "0")
        Result = "T";
    GetVarValue(Result);
    return Result;
}

function FormatVal(amount, declen) {

    if (declen > 0)
        declen = Math.pow(10, declen);
    else
        declen = Math.pow(10, 2);
    var i = parseFloat(amount);
    if (isNaN(i)) { i = 0.00; }
    var minus = '';
    if (i < 0) { minus = '-'; }
    i = Math.abs(i);
    i = parseInt((i + .005) * declen);
    i = i / declen;
    s = new String(i);
    if (s.indexOf('.') < 0) { s += '.00'; }
    if (s.indexOf('.') == (s.length - 2)) { s += '0'; }
    s = minus + s;
    CommaFormatted(s);
}

function FormatAccAmount(amount, declen, MillionRep, Malie, Rep) {

    var amt = 0;
    if (amount < 0)
        amt = parseFloat(amount) * -1;
    else
        amt = amount;
    var Result = 0;
    var alie = Malie.toString();
    var Rp = Rep.toString();
    alie.toLowerCase();
    alie = TrimAll(alie);
    Rp.toLowerCase();
    if (declen > 0)
        declen = Math.pow(10, declen);
    else
        declen = Math.pow(10, 2);
    var i = parseFloat(amt);
    if (isNaN(i)) { i = 0.00; }
    var minus = '';
    if (i < 0) { minus = '-'; }
    i = Math.abs(i);
    i = parseInt((i + .005) * declen);
    i = i / declen;
    s = new String(i);
    if (s.indexOf('.') < 0) { s += '.00'; }
    if (s.indexOf('.') == (s.length - 2)) { s += '0'; }
    s = minus + s;

    if (MillionRep == "true")
        Result = CommaFormatted(s);
    else
        Result = addCommas(s);
    if ((alie == "a") || (alie == "e")) {
        if ((amount < 0) && (Rp == "br"))
            Result = "(" + Result + ")";
        else
            if (amount < 0)
                Result = Result + " " + Rp;
    }
    else
        if ((alie == "l") || (alie == "i")) {
            if ((amount > 0) && (Rp == "br"))
                Result = "(" + Result + ")";
            else
                if (amount > 0)
                    Result = Result + " " + Rp;
        }
    return Result;
}

function FormatAmount(amount, declen, MillionRep, NRep, PRep) {

    var amt = 0;
    if (amount < 0)
        amt = parseFloat(amount) * -1;
    else
        amt = amount;
    var Result = 0;
    if (declen > 0)
        declen = Math.pow(10, declen);
    else
        declen = Math.pow(10, 2);
    var i = parseFloat(amt);
    if (isNaN(i)) { i = 0.00; }
    var minus = '';
    if (i < 0) { minus = '-'; }
    i = Math.abs(i);
    i = parseInt((i + .005) * declen);
    i = i / declen;
    s = new String(i);
    if (s.indexOf('.') < 0) { s += '.00'; }
    if (s.indexOf('.') == (s.length - 2)) { s += '0'; }
    s = minus + s;
    if (MillionRep == "true")
        Result = CommaFormatted(s);
    else
        Result = addCommas(s);

    if ((NRep == "br") || (PRep == "br")) {
        if (amount < 0)
            Result = '(' + Result + ')';
    }
    else {
        if (amount < 0)
            Result = Result + " " + NRep;
        else
            Result = Result + " " + PRep;
    }
    Result = TrimAll(Result);
    return Result;
}

function TrimInbetwnSpaces(aNum) {

    aNum = aNum.replace(/\s/g, "");

    return aNum;
}

function TodaysDate() {

    var dd = new Date();
    var mon = dd.getMonth() + 1;
    mon = PrefixZero(mon);
    var year = dd.getFullYear();
    var date = dd.getDate();
    date = PrefixZero(date);
    var sdt = (date + "/" + mon + "/" + year);
    var glCulture = callParentNew('glCulture');
    if (glCulture != undefined && glCulture == "en-us")
        sdt = GetDateStr(sdt, "mm/dd/yyyy", "dd/mm/yyyy");
    return sdt;
}

function ISEMPTY(fldVar) {

    var output = '';
    if (fldVar == "" || fldVar == "dd/mm/yyyy" || fldVar == "01/01/1900")
        output = "T";
    else
        output = "F";
    return output;
}

//<Description> Function to Round off the value </Description>
//<Return> Rounded value </Return>
function Round(daysVal) {

    return Math.round(daysVal);
}

function DateDiff(dt1, dt2) {

    return DaysElapsed(dt1, dt2);
}

function ReplaceSpecialCharInDate(dt) {
    if (dt.indexOf("(") != -1)
        dt = dt.replace(/\(/g, "");
    if (dt.indexOf(")") != -1)
        dt = dt.replace(/\)/g, "");
    return dt;
}

function CompareDate(dt1, dt2, operator) {
    dt1 = ReplaceSpecialCharInDate(dt1);
    dt2 = ReplaceSpecialCharInDate(dt2);
    if (operator == "!=") {
        if (dt1 == "")
            dt1 = "01/01/1900";
        if (dt2 == "")
            dt2 = "01/01/1900";
        return dt1 != dt2 ? true : false;
    }
    if (dt1 != "" && dt2 != "") {
        var startdt1 = GetDateObj(dt1);
        var enddt2 = GetDateObj(dt2);
        if (startdt1 != null && enddt2 != null) {
            if (operator == "<")
                return startdt1 < enddt2 ? true : false;
            else if (operator == ">")
                return startdt1 > enddt2 ? true : false;
            else if (operator == "=")
                return startdt1.toDateString() == enddt2.toDateString() ? true : false;
        }
    }
    return "";
}

function SubtractDate(dt1, dt2, operator) {
    dt1 = ReplaceSpecialCharInDate(dt1);
    dt2 = ReplaceSpecialCharInDate(dt2);
    var days = 0;
    if (dt1 != "" && dt2 != "") {
        var startdt1 = GetDateObj(dt1);
        var enddt2 = GetDateObj(dt2);
        if (startdt1 != null && enddt2 != null) {
            var diff = new Date(startdt1 - enddt2)
            days = diff / 1000 / 60 / 60 / 24;
        }
    }
    return days;
}

function CheckEmail(email) {

    var emailReg = "^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+.[a-zA-Z]{2,4}$";
    var regex = new RegExp(emailReg);
    var output = regex.test(email);
    if (!output)
        showAlertDialog("warning", 2039, "client");
    else
        return output;
}


function Total(fldName) {
    var sum = 0;
    var dcno = 0;
    dcno = GetDcNo(fldName);
    if (parseInt(dcno, 10) > 0) {
        var rcount = parseInt(GetDcRowCount(dcno), 10);
        for (var nt = 1; nt <= rcount; nt++) {
            var rowNo = GetClientRowNo(nt, dcno);
            expFldname = fldName + rowNo + "F" + dcno;
            if ($("#" + expFldname).hasClass("labelInp") || $("textarea[id='EDIT~" + expFldname + "']").length === 1 || $("#" + expFldname).length === 1) {
                if (document.getElementById(expFldname)) {
                    var val = 0;
                    if (document.getElementById(expFldname).value != "" && document.getElementById(expFldname).value != "***") {
                        if ((document.getElementById(expFldname).value.length > 3) && (document.getElementById(expFldname).value.indexOf(',') != -1))
                            val = removeCommas(document.getElementById(expFldname).value);
                        else
                            val = document.getElementById(expFldname).value;
                        if (val != "")
                            sum += parseFloat(val);
                    }
                }
            }
        }
    }
    return sum;
}


function CurrAmtWord(val1, val2, val3, val4, val5) {
    if (typeof val1 == "undefined") {
        return;
    }
    val1 = val1 + '';
    var valSplit = val1.split('.');
    var amt = curtoWords(valSplit[0]);
    if (valSplit[1] != undefined) {
        if (valSplit[1].length < val5) {
            for (var j = valSplit[1].length; j < val5; j++)
                valSplit[1] = valSplit[1] + "0";
        }
        var amtdec = curtoWords(parseInt(valSplit[1], 10));
        if (amt != "")
            return val2 + "" + amt + ' and ' + val3 + ' ' + amtdec + ' only';
        else
            return val3 + ' ' + amtdec + ' only';
    }
    else {
        return val2 + "" + amt + ' only';
    }
}

function str(param) {

    if (isNaN(param)) {
        var fresult = "";
        var fldnm = param + rowno;
        if (document.getElementById(fldnm)) {
            fresult = document.getElementById(fldnm).value;
        }

        if (fresult != "")
            return fresult;
    }
}

function makedate(dd, mon, yy) {
    dd = PrefixZero(dd);
    mon = PrefixZero(mon);
    var resultDate = "";
    if (dateString == "dd/mm/yyyy")
        resultDate = dd + "/" + mon + "/" + yy;
    else
        resultDate = mon + "/" + dd + "/" + yy;
    return resultDate;
}


var dtCh = "/";
//var minYear = 1900;
//var maxYear = 2100;
var curDate = new Date();
var cYear = curDate.getFullYear();
var minYear = cYear - 100;
var maxYear = cYear + 100;

function isInteger(s) {
    var i;
    for (i = 0; i < s.length; i++) {
        var c = s.charAt(i);
        if (((c < "0") || (c > "9"))) return false;
    }
    return true;
}

function stripCharsInBag(s, bag) {
    var i;
    var returnString = "";
    for (i = 0; i < s.length; i++) {
        var c = s.charAt(i);
        if (bag.indexOf(c) == -1) returnString += c;
    }
    return returnString;
}

function daysInFebruary(year) {
    return (((year % 4 == 0) && ((!(year % 100 == 0)) || (year % 400 == 0))) ? 29 : 28);
}
function DaysArray(n) {
    for (var i = 1; i <= n; i++) {
        this[i] = 31
        if (i == 4 || i == 6 || i == 9 || i == 11) { this[i] = 30 }
        if (i == 2) { this[i] = 29 }
    }
    return this
}

function isDate(dtStr) {

    var errCode = IsValidDate(dtStr);
    if (errCode == 1) {
        showAlertDialog("warning", 2040, "client");
        return false;
    }
    else if (errCode == 2) {
        showAlertDialog("warning", 2041, "client");
        return false;
    }
    else if (errCode == 3) {
        showAlertDialog("warning", 2042, "client");
        return false;
    }
    else if (errCode == 4) {
        showAlertDialog("warning", 2043, "client");
        return false;
    }
    else if (errCode == 5) {
        showAlertDialog("warning", 2044, "client");
        return false;
    }
    return true;
}

function SubSumTill(criFld, criFldVal, sumFld, rowNo, prowNo) {

    if (rowNo == "-1" || prowNo == "-1") return 0;
    var dcno = 0; var sumVal = 0.0;
    dcno = GetDcNo(criFld);
    var subGridRows = GetPopRows(AxActivePDc, prowNo, dcno);
    var popRows = subGridRows.split(",");
    if (subGridRows == "" || popRows.length == 0) return 0;
    var rno = 1;
    while (rno <= rowNo) {
        var actualRow = popRows[rno - 1];
        var criFldname = criFld + actualRow + "F" + dcno;
        var newSumFld = sumFld + actualRow + "F" + dcno;
        var criItemVal = "";
        var newSumFldVal = "";
        criItemVal = GetFieldValue(criFldname);
        newSumFldVal = GetFieldValue(newSumFld);
        if (newSumFldVal != "") {
            newSumFldVal = removeCommas(newSumFldVal);
            sumVal += parseFloat(newSumFldVal);
        }
        rno++;
    }
    return sumVal;
}

function SumTill(criFld, criFldVal, sumFld, rowNo, prowNo) {

    if (prowNo != undefined) {
        return SubSumTill(criFld, criFldVal, sumFld, rowNo, prowNo);
    }

    var sumVal = 0.0;
    var dcno = 0;
    dcno = GetDcNo(criFld);

    var rNo = parseInt(rowNo, 10);

    var rcount = parseInt(GetDcRowCount(dcno), 10);
    for (var i = 1; i <= rcount; i++) {

        if (i > rNo) break;
        var newRowNo = GetClientRowNo(i, dcno);
        var criFldname = criFld + newRowNo + "F" + dcno;
        var newSumFld = sumFld + newRowNo + "F" + dcno;
        var criItemVal = "";
        if (document.getElementById(criFldname)) {
            criItemVal = GetFieldValue(criFldname);

            var rnewNo = rowNo - 1;
            if (criFldVal == "") {
                var criFldparent = criFld + rnewNo + "F" + dcno;
                criFldVal = GetFieldValue(criFldparent);
            }

            if (criItemVal == criFldVal) {
                var newValue = GetFieldValue(newSumFld);
                if (newValue != "") {
                    newValue = removeCommas(newValue);
                    sumVal += parseFloat(newValue);
                }
            }
        }
    }
    return sumVal;
}

function Sum(criFld, criFldVal, sumFld) {
    var sumVal = 0.0;
    var dcno = 0;
    dcno = GetDcNo(criFld);

    var rcount = parseInt(GetDcRowCount(dcno), 10);
    for (var i = 1; i <= rcount; i++) {
        var newRowNo = GetClientRowNo(i, dcno);
        var criFldname = criFld + newRowNo + "F" + dcno;
        var newSumFld = sumFld + newRowNo + "F" + dcno;
        var criItemVal = GetFieldValue(criFldname);
        if (criItemVal == criFldVal) {
            var sumFldVal = document.getElementById(newSumFld);
            if (sumFldVal) {
                var sum = GetFieldValue(newSumFld);
                sumFldVal = removeCommas(sum);
                if (sumFldVal != "***")
                    sumVal += eval(sumFldVal);
            }
        }
    }
    return sumVal;
}

function AxCeil(n) {
    return Math.ceil(n);
}

function AxFloor(n) {
    return Math.floor(n);
}


function NetworkDays(st, en, holidays) {

    var stDate = new GetDateObj(st);
    var enDate = new GetDateObj(en);

    if (stDate > enDate)
        return -1;

    var days = 0;

    while (stDate <= enDate) {

        if (stDate.getDay() != 0 && stDate.getDay() != 6)
            days++;

        stDate.setDate(stDate.getDate() + 1);
    }

    if (!holidays || holidays == undefined || holidays == "")
        holidays = 0;

    return days - holidays;
}

function Days360(st, en, method) {

    var stDate = GetDateObj(st);
    var enDate = GetDateObj(en);
    var res = "";
    if (stDate != "" && enDate != "") {

        if (method) {

            if (stDate.getDate() == 31)
                stDate.setDate(30);

            if (enDate.getDate() == 31)
                enDate.setDate(30);
        }
        else {
            var start = new Date(st);
            var lastDate = new Date(start.getFullYear(), start.getMonth() + 1, 0);
            if (stDate.getDate() == lastDate.getDate())
                stDate.setDate(30);

            if (enDate.getDate() == lastDate.getDate() && stDate.getDate() < 30)
                enDate.setDate(30);
        }

        res = (((enDate.getFullYear() - stDate.getFullYear()) * 12) + (enDate.getMonth() - stDate.getMonth())) * 30 + enDate.getDate() - stDate.getDate();
    }

    return res;
}

function GetAllValues(fld, F) {

    var roles = "";
    var roles1 = "";
    var count = 0;
    var dcno = 0;
    dcno = GetDcNo(fld);

    var rcount = parseInt(GetDcRowCount(dcno), 10);
    for (var nt = 0; nt <= rcount; nt++) {
        var newprevrow = GetClientRowNo(nt, dcno);
        expFldname = fld + newprevrow + "F" + dcno;
        if (document.getElementById(expFldname)) {
            if (count == 0) {
                roles = document.getElementById(expFldname).value;
                if ((roles != "***") && (roles != "")) {
                    var rl = roles.split(',,');
                    roles = rl[0].toString();
                    count++;
                }
            }
            else {
                roles1 = document.getElementById(expFldname).value;
                if ((roles1 != "***") && (roles1 != "")) {
                    var rl = roles1.split(',,');
                    roles += "," + rl[0].toString();
                }
            }
        }
    }
    return roles;
}

Array.prototype.getMax = function () {
    var max = 10, v, len = this.length, i = 1;
    var indx = 0;
    for (; i < len; ++i)
        if ((typeof (v = this[i]) == 'number' || v != "") && v != "***") {
            max = Math.max(max, v);
            indx = max;
        }
    return indx;
}
Array.prototype.getMin = function () {
    var min = 10000000, v, len = this.length, i = 1;
    var indx = 0;
    for (; i < len; ++i)
        if ((typeof (v = this[i]) == 'number' || v != "") && v != "***") {
            min = Math.min(min, v);
            indx = min;
        }

    return indx;
}

function GetMinValue(fldname) {
    var dcno = 0;
    dcno = GetDcNo(fldname);
    var i = "";
    var rcount = parseInt(GetDcRowCount(dcno), 10);
    var arrValues = new Array();
    for (var nt = 1; nt <= rcount; nt++) {
        var newprevrow = GetClientRowNo(nt, dcno);
        expFldname = fldname + newprevrow + "F" + dcno;
        arrValues[nt] = document.getElementById(expFldname).value;
    }
    i = arrValues.getMin();
    for (var j = 1; j < arrValues.length; j++) {
        if (arrValues[j] == i) {
            i = j;
            break;
        }
    }
    return i;
}

function GetMaxValue(fldname) {

    var dcno = 0;
    dcno = GetDcNo(fldname);
    var i = "";

    var rcount = parseInt(GetDcRowCount(dcno), 10);
    var arrValues = new Array();

    for (var nt = 1; nt <= rcount; nt++) {
        var newprevrow = GetClientRowNo(nt, dcno);
        expFldname = fldname + newprevrow + "F" + dcno;
        arrValues[nt - 1] = document.getElementById(expFldname).value;
    }
    i = Math.max.apply(Math, arrValues);
    for (var j = 1; j < arrValues.length; j++) {
        if (arrValues[j] == i) {
            i = j;
            break;
        }
    }
    return i;
}

function GetRowCount(fldname) {
    var dcno = 0;
    dcno = GetDcNo(fldname);
    var rcnt = 0;
    if (isMobile && !axInlineGridEdit)
        rcnt = (parseInt(GetDcRowCount(dcno), 10)) - 1;
    else
        rcnt = parseInt(GetDcRowCount(dcno), 10);
    return rcnt;
}

function GetGridCellValue(fldname, ActiveRow, isActual) {
    var dcno = 0;
    var fldIndx = ""; var fldType = "";
    fldIndx = GetFieldIndex(fldname);
    fldType = FDataType[fldIndx];
    dcno = GetDcNo(fldname);
    if (!isActual)
        ActiveRow = GetClientRowNo(ActiveRow, dcno);
    var newrow = GetRowNoHelper(ActiveRow);
    if (!IsDcGrid(dcno) && ActiveRow == "1")
        newrow = "000";

    var newFldName = fldname + newrow + "F" + dcno;
    var newFldVal = "";
    if (newrow != "") {
        if (document.getElementById(newFldName)) {
            newFldVal = GetFieldValue(newFldName);// $j("#" + newFldName).val();
            if (fldType.toLowerCase() == "numeric")
                newFldVal = removeCommas(newFldVal);
            else
                newFldVal = newFldVal;
        }
    }
    if (newFldVal == "" && fldType.toLowerCase() == "numeric")
        newFldVal = "0";

    if (fldType.toLowerCase() == "numeric")
        newFldVal = 'n' + newFldVal;
    else
        newFldVal = 's' + newFldVal;
    return newFldVal;
}


function RegisterVariables(varName, varType, varValue) {
    isEvalGrid = true;
    var isAlreadyFound = false;
    if (varName != "") {
        for (var x = 0; x < varlist.length; x++) {
            if (varlist[x] == varName) {
                valuelist[x] = varValue;

                isAlreadyFound = true; // the field name is already found and updated.
                break;
            }
        }

        if (!isAlreadyFound) {
            varlist.push(varName);
            valuelist.push(varValue);
        }
        var isext = false;
        $.each(RegVarFldList, function (key, value) {
            if (value.startsWith(varName + ":")) {
                RegVarFldList[key] = varName + ":" + varType + ":" + varValue;
                isext = true;
                return;
            }
        });
        if (isext == false)
            RegVarFldList.push(varName + ":" + varType + ":" + varValue);
    }

    return "";
}


function GetActiveRow(fieldname) {

    var frameno = 0;
    var actualCurrRno = 0;
    var virtualCurrRno = 0;
    if (fieldname != "") {
        var index = fieldname.toString().lastIndexOf("F");
        if (parseInt(index, 10) != -1) {

            var fldRowNum = fieldname.toString().substring(0, index);
            frameno = fieldname.toString().substring(index + 1);
            virtualCurrRno = parseInt(fldRowNum.toString().substring(fldRowNum.toString().length - 3), 10);
            for (var prev = virtualCurrRno - 1; prev > 0; prev--) {
                var newprev = GetRowNoHelper(prev);
                var fIndx = fieldname.toString().lastIndexOf("F");
                var fld = fieldname.substring(0, fIndx - 3) + newprev + "F" + frameno;

                if (document.getElementById(fld)) {
                    if (document.getElementById(fld).value != "***") {
                        actualCurrRno++;
                    }
                }
            }
        }
    }

    return actualCurrRno;
}



function GetRow(fldName, fldValue, activeProw) {
    var fldIndx = "";
    fldIndx = GetFieldIndex(fldName);
    var htmlFldName = "";

    var frmNo = GetDcNo(fldName);

    var rowCnt = parseInt(GetDcRowCount(frmNo), 10);
    var i = 0; var newRowNo = "";

    for (i = 1; i <= rowCnt; i++) {

        newRowNo = GetClientRowNo(i, frmNo);
        newRowNo = GetRowNoHelper(newRowNo);

        if (activeProw != undefined) {

            activeProw = GetClientRowNo(AxActivePRow, AxActivePDc);
            activeProw = activeProw.substring(0, activeProw.indexOf("F"));
            var subGridRows = GetPopRows(AxActivePDc, activeProw, frmNo);
            subGridRows = subGridRows.split(",");
            for (var rCnt = 0; rCnt < subGridRows.length; rCnt++) {
                if (newRowNo == subGridRows[rCnt]) {
                    htmlFldName = fldName + newRowNo + "F" + frmNo;
                    var fldVal = "";
                    fldVal = GetFieldValue(htmlFldName);
                    if (fldVal == fldValue)
                        return parseInt(newRowNo, 10);
                    else
                        continue;
                }
                else
                    continue;
            }
        }
        else {
            htmlFldName = fldName + newRowNo + "F" + frmNo;
            var fldVal = "";
            fldVal = GetFieldValue(htmlFldName);
            if (fldVal == fldValue) {

                return GetDbRowNo(parseInt(newRowNo, 10), frmNo);
            }
            else
                continue;
        }
    }
    return -1;
}

function SubTotal(popFldName, parentRowNo) {

    var popDcNo = GetDcNo(popFldName);
    var totalVal = 0;
    var subGridRows = GetPopRows(AxActivePDc, parentRowNo, popDcNo);
    subGridRows = subGridRows.split(",");

    for (var i = 0; i < subGridRows.length; i++) {
        var fld = popFldName + subGridRows[i] + "F" + popDcNo;
        totalVal += parseFloat(removeCommas(GetFieldValue(fld)));
    }

    return totalVal;
}

function GetMod(fld1, fld2) {

    if (fld2 == 0)
        return 0;

    return fld1 % fld2;
}

function IsPopGridField(fldName) {
    var fIndx = ""; var pIndx = -1;
    fIndx = fldName.lastIndexOf("F"); var isPopField = false;
    var title = document.title;
    //The popGridDCs array is defined in tstruct.aspx, and if evaluate function is called from iview it should return -1.
    if (title.toLowerCase().indexOf("tstruct") != -1) {
        var FrmNo = fldName.substring(fIndx + 1, fldName.length);
        if (FrmNo != undefined || FrmNo != "") {
            for (var Indx = 0; Indx < PopGridDCs.length; Indx++) {
                if (PopGridDCs[Indx] == FrmNo) {
                    pIndx = Indx;
                }
            }
        }
    }
    return pIndx;
}


function GetActiveParentRow(popGridfldName, PIndex) {

    var fIndex = popGridfldName.lastIndexOf("F");
    var popRowNo = popGridfldName.substring(fIndex - 3, fIndex);
    var popGridDc = popGridfldName.substring(fIndex + 1);
    var parentGridDc = PopParentDCs[PIndex];
    var parentFields = PopParentFlds[PIndex].toString().split(",");
    var pFields = new Array();
    var pValues = new Array();
    var pField = ""; var pValue = "";
    for (var i = 0; i < parentFields.length; i++) {
        pFields[i] = parentFields[i].toString().trim();
        pField = GetSubFieldId("sub" + popGridDc + "_" + parentFields[i].toString(), popRowNo, popGridDc);
        pValue = GetFieldValue(pField);
        pValues[i] = pValue;

    }
    var frow = "row" + parentGridDc + "temF0";
    var PRcnt = 0; var parentIndex = -1;
    if (document.getElementById(frow)) {
        PRcnt = document.getElementById(frow).value;
        PRcnt = parseInt(PRcnt, 10);
    }
    else
        PRcnt = 2;
    for (var j = 1; j < PRcnt; j++) {
        var found = true;
        var parentRNo = GetRowNoHelper(j);
        for (var pCnt = 0; pCnt < pFields.length; pCnt++) {
            pField = pFields[pCnt] + parentRNo + "F" + parentGridDc;
            pValue = GetFieldValue(pField);
            if (pValue != pValues[pCnt]) {
                found = false;
                break;
            }
        }
        if (found) {
            parentIndex = j;
            break;
        }
    }
    return parentIndex;
}

function RandomNo() {
    var minm = 1000000000;
    var maxm = 9999999999;
    var rnumber = Math.floor(Math.random() * (maxm - minm + 1)) + minm;
    return rnumber;
}

function AxHideControls(sfcFldNames) {
    AxFormControlList.push("hide~" + sfcFldNames);
    return "hide~" + sfcFldNames;
}

function AxUnhideControls(sfcFldNames) {
    AxFormControlList.push("show~" + sfcFldNames);
    return "show~" + sfcFldNames;
}

function AxEnableControls(sfcFldNames) {
    AxFormControlList.push("enable~" + sfcFldNames);
    return "enable~" + sfcFldNames;
}

function AxDisableControls(sfcFldNames) {
    AxFormControlList.push("disable~" + sfcFldNames);
    return "disable~" + sfcFldNames;
}

function AxSetValue(sfcFldNames, sfcRowNo, sfcFldValue) {
    AxFormControlList.push("setvalue~" + sfcFldNames + "♦" + sfcFldValue + "♦" + sfcRowNo);
    return "setvalue~" + sfcFldNames + "♦" + sfcFldValue + "♦" + sfcRowNo;
}

function AxValueExits(sDcNo, sFldName, tDcNo, tFldName) {
    var isGridDc = IsGridField(sFldName);
    let sFulFldName = "";
    if (isGridDc == false)
        sFulFldName = sFldName + "000F" + sDcNo;
    else {
        var nrno = AxActiveRowNo;
        if (nrno == "")
            nrno = "001";
        sFulFldName = sFldName + nrno + "F" + sDcNo;
    }
    let fldVal = GetFieldValueNew(sFulFldName);
    let scanRow = "0";
    if (fldVal != "") {
        $("#gridHd" + tDcNo + " tbody tr").each(function (index, el) {
            if (!isMobile && fldVal == $j(this).find('textarea[id^=' + tFldName + ']').val()) {
                scanRow = GetFieldsRowNo($j(this).find('textarea[id^=' + tFldName + ']').attr("id"));
                scanRow = parseInt(scanRow);
                return false;
            }
            else if (isMobile && fldVal == $j(this).find('textarea[id^=gr' + tFldName + ']').val()) {
                scanRow = GetFieldsRowNo($j(this).find('textarea[id^=gr' + tFldName + ']').attr("id"));
                scanRow = parseInt(scanRow);
                return false;
            }
        });
    }
    else
        scanRow = "-1";
    if (AxOldValue == "")
        AxOldValueOnChange = fldVal;
    else
        AxOldValueOnChange = AxOldValue;
    return scanRow;
}

function AxAddRow(sDcNo) {
    forceBreak = true;
    return "axaddrow~dc" + sDcNo;
}

function EvalExprSet(exprset) {
    forceBreak = false;
    var resVal = "";
    var i = 0, p = 0;
    var s, v, cond, cmd, op;
    if (exprset != "") {
        var cresult = true, skip = false, breakflag = false;
        try {
            var loops = new Array();
            var loopcond = new Array();
            while (i < exprset.length) {
                s = exprset[i];
                cmd = s.trimStart();
                if (s == "" || cmd.startsWith("//")) {
                    i++;
                    continue;
                }
                op = cmd.split(' ')[0];
                if (breakflag && op.toLowerCase() != 'endloop') {
                    i++;
                    continue;
                }

                if (op.toLowerCase() == 'if') {
                    cmd = cmd.substr(2);
                    cond = cmd.trim();
                    cond = "IIF(" + cond + ",{T},{F})";
                    var Value = Evaluate("", "", cond, "vexpr");
                    Value = Value == "T" ? true : false;
                    cresult = Value;
                    skip = cresult;
                }
                else if (op.toLowerCase() == 'elseif') {
                    if (skip)
                        cresult = false;
                    else
                        cresult = cresult == true ? false : true;
                    if (cresult) {
                        cmd = cmd.substr(6);
                        cond = cmd.trim();
                        cond = "IIF(" + cond + ",{T},{F})";
                        var Value = Evaluate("", "", cond, "vexpr");
                        Value = Value == "T" ? true : false;
                        cresult = Value;
                        skip = cresult;
                    }
                }
                else if (op.toLowerCase() == 'else') {
                    if (skip)
                        cresult = false;
                    else {
                        cresult = cresult == true ? false : true;
                        skip = cresult;
                    }
                }
                else if (op.toLowerCase() == 'end') {
                    cresult = true;
                    skip = false;
                }
                else if (op.toLowerCase() == 'endloop') {
                    if (breakflag) {
                        breakflag = false;
                        loopcond.splice(0, loops.length);
                        loops.splice(0, loops.length);
                    }
                    else {
                        cond = loopcond[loops.length - 1];
                        cond = "IIF(" + cond + ",{T},{F})";
                        var Value = Evaluate("", "", cond, "vexpr");
                        Value = Value == "T" ? true : false;
                        if (Value) {
                            i = loops[loops.length - 1];
                        }
                        else {
                            loopcond.splice(0, loops.length);
                            loops.splice(0, loops.length);
                        }
                    }
                }
                else if (op.toLowerCase() == "while") {
                    cmd = cmd.substr(5);
                    cond = cmd.trim();
                    var expcond = "IIF(" + cond + ",{T},{F})";
                    var Value = Evaluate("", "", expcond, "vexpr");
                    Value = Value == "T" ? true : false;
                    if (Value) {
                        loops.push(parseInt(i));
                        loopcond.push(cond);
                    }
                    else {
                        breakflag = true;
                        cresult = cresult == true ? false : true;
                        skip = false;
                    }
                }
                else if (op.toLowerCase() == "break") {
                    breakflag = true;
                    cresult = true;
                    skip = false;
                }
                else if (cresult) {
                    p = s.indexOf(":=");
                    v = '';
                    if (p > -1) {
                        v = s.substr(0, p);//s.substr(1, p - 1);
                        v = v.trim();
                        s = s.substr(p + 2, s.length);
                    }
                    if (v != '') {
                        var Value = Evaluate("", "", s, "vexpr");
                        var rtype = "n";
                        if (isNaN(Value))
                            rtype = "c";
                        var registervar = "regvar({" + v + "},{" + rtype + "},{" + Value + "})";
                        Evaluate("", "", registervar, "vexpr");
                    }
                    else {
                        resVal = Evaluate("", "", s, "vexpr");
                        //break;//Loop is not continuing after function execute.
                        if (forceBreak)//For some of functions loop is breaking and continuing those functions functionality 
                            break;
                    }
                }
                i++;
            }
        } catch (ex) { }
    }
    return resVal;
}

function LoadForm(Transid, Params, DisplayMode, RefreshOnClose) {
    forceBreak = true;
    Params = ParseParamValues(Params);
    return "LoadForm♠" + Transid + "♠" + Params + "♠" + DisplayMode + "♠" + RefreshOnClose;
}

function LoadFormAndData(Transid, Params, DisplayMode, RefreshOnClose) {
    forceBreak = true;
    Params = ParseParamValues(Params);
    return "LoadFormAndData♠" + Transid + "♠" + Params + "♠" + DisplayMode + "♠" + RefreshOnClose;
}

function LoadIView(Ivname, Params, DisplayMode, RefreshOnClose) {
    forceBreak = true;
    Params = ParseParamValues(Params, "LoadIView");
    return "LoadIView♠" + Ivname + "♠" + Params + "♠" + DisplayMode + "♠" + RefreshOnClose;
}

function LoadPage(PageId, Params, DisplayMode, RefreshOnClose) {
    forceBreak = true;
    Params = ParseParamValues(Params);
    return "LoadPage♠" + PageId + "♠" + Params + "♠" + DisplayMode + "♠" + RefreshOnClose;
}

function OpenPage(PageId, Params, DisplayMode, RefreshOnClose) {
    forceBreak = true;
    Params = ParseParamValues(Params);
    return "OpenPage♠" + PageId + "♠" + Params + "♠" + DisplayMode + "♠" + RefreshOnClose;
}

function ParseParamValues(Params, calledFrom = "") {
    var ParamValue = Params.replace(/~/g, "♦");
    if (ParamValue != "") {
        if (ParamValue.indexOf(":") > -1) {
            let repParamVal = "";
            var paramsList = ParamValue.split('♦');
            paramsList.forEach(item => {
                repParamVal += item.split("=")[0];
                let srFldName = item.split("=")[1];
                if (srFldName != "" && srFldName.indexOf(":") > -1)
                    srFldName = srFldName.trimStart().trimEnd();
                srFldName = srFldName.substring(1);
                var fldInd = GetFieldIndex(srFldName);
                if (fldInd > -1) {
                    let thisFldVal = "";
                    var thisDc = GetDcNo(srFldName);
                    if (IsDcGrid(thisDc))
                        thisFldVal = GetFieldValue(srFldName + "001F" + thisDc);
                    else
                        thisFldVal = GetFieldValue(srFldName + "000F" + thisDc);
                    repParamVal += "=" + thisFldVal + "&";
                } else {
                    let glbParamVal = Parameters.filter(word => word.startsWith(srFldName + "~"))[0];
                    if (typeof glbParamVal != "undefined") {
                        repParamVal += "=" + glbParamVal.split("~")[1] + "&";
                    }
                }
            });
            if (repParamVal != "")
                repParamVal = repParamVal.slice(0, -1)
            return repParamVal;
        } else
            return ParamValue;
    }
    return "";
}

function SetFieldCaption(fldName, fldCaption) {
    AxFormControlList.push("setfieldcaption~" + fldName + "^" + fldCaption);
    return "setfieldcaption~" + fldName + "^" + fldCaption;
}

function DoFormDesign(name, caption) {
    return JSON.stringify([...arguments] || []);
}

function CancelTransaction(tname, recId, remarks) {
    return remarks;
}

function GetAxValue(rule, variable, code) {
    let configParamsDataObj = {};
    var isdcFlExist = false;
    var axCdFlVarList = new Array();
    var axCdFlVarValue = new Array();
    if (typeof AxCdParameters != "undefined" && AxCdParameters.length > 0) {
        for (var cdi = 0; cdi < AxCdParameters.length; cdi++) {
            let list = AxCdParameters[cdi].toString();
            list = list.split("♠");
            axCdFlVarList[cdi] = list[0].toString();
            axCdFlVarValue[cdi] = list[1].toString();
        }
    }

    if (axCdFlVarList.length > 0) {
        for (var k = 0; k < axCdFlVarList.length; k++) {
            if (rule.toLowerCase() == axCdFlVarList[k].toLowerCase()) {
                isdcFlExist = true;
                let cdvalue = axCdFlVarValue[k];
                try {
                    configParamsDataObj[axCdFlVarList[k]] = cdvalue == "" ? "" : JSON.parse(cdvalue.replace(/(?:\r\n|\r|\n|&lt;br&gt;)/g, '').replace(/&quot;/g, '"'));
                } catch (ex) { }
                break;
            }
        }
    }

    if (!isdcFlExist) {
        for (var k = 0; k < axMemVarList.length; k++) {
            if (rule.toLowerCase() == axMemVarList[k].toLowerCase()) {
                isdcFlExist = true;
                let cdvalue = axMemVarValue[k];
                try {
                    configParamsDataObj[axMemVarList[k]] = cdvalue == "" ? "" : JSON.parse(cdvalue.replace(/(?:\r\n|\r|\n|&lt;br&gt;)/g, '').replace(/&quot;/g, '"'));
                } catch (ex) { }
                break;
            }
        }
    }

    if (!isdcFlExist) {
        for (var k = 0; k < varlist.length; k++) {
            if (rule.toLowerCase() == varlist[k].toLowerCase()) {
                let cdvalue = valuelist[k];
                try {
                    configParamsDataObj[varlist[k]] = cdvalue == "" ? "" : JSON.parse(cdvalue.replace(/(?:\r\n|\r|\n|&lt;br&gt;)/g, '').replace(/&quot;/g, '"'));
                } catch (ex) { }
                break;
            }
        }
    }

    if (Object.keys(configParamsDataObj).length) {
        let axVars = configParamsDataObj.vars;
        if (typeof configParamsDataObj[rule] == "undefined") {
            return "";
        }

        var ruleData;
        if (typeof code != "undefined" && typeof configParamsDataObj[rule][code] != "undefined") {
            ruleData = configParamsDataObj[rule][code];
        }
        else {
            ruleData = configParamsDataObj[rule];
        }

        var result;
        if (typeof ruleData["variations"] != "undefined") {
            let variationDetails = ruleData["variations"];
            let vType = variationDetails.split("~")[0];
            let vName = variationDetails.split("~")[1];

            let variation;
            let fldName = vName;
            let fldIdx = GetFieldIndex(fldName);
            if (fldIdx != -1) {

                let dcNo = GetDcNo(fldName);
                if (IsDcGrid(dcNo)) {
                    if (AxActiveRowNo != '') {
                        let fldId = fldName + GetRowNoHelper(AxActiveRowNo) + "F" + dcNo;
                        if ($("#" + fldId).length) {
                            variation = GetFieldValue(fldId);
                        }
                    }
                }
                else {
                    let fldId = fldName + "000F" + dcNo;
                    if ($("#" + fldId).length) {
                        variation = GetFieldValue(fldId);
                    }
                }
            }

            if (typeof variation == "undefined") {
                let varIdx = varlist.indexOf(vName)
                if (varIdx > -1) {
                    variation = valuelist[varIdx];
                }
            }

            if (typeof variation != "undefined" && typeof ruleData[vName][variation] != "undefined") {
                result = ruleData[vName][variation][variable];
            }
        }

        if (typeof result == "undefined") {
            result = ruleData[variable];
        }

        if (typeof result == "undefined") {
            result = configParamsDataObj[rule][variable];
        }

        if (typeof result != "undefined") {
            return result;
        }
    }
    return "";
}

function GetStringpos(str, subStr, separator) {
    if (typeof separator == "undefined" || separator == "")
        separator = ",";
    if (str != "") {
        var strArray = str.split(separator);
        var indx = $j.inArray(subStr, strArray);
        if (indx != -1)
            return strArray[indx];
        else
            return "";
    } else
        return "";
}

function AxDcCollapse(sfcDcNo) {
    AxFormControlList.push("collapse~" + sfcDcNo);
    return "collapse~" + sfcDcNo;
}

function AxDcExpand(sfcDcNo) {
    AxFormControlList.push("expand~" + sfcDcNo);
    return "expand~" + sfcDcNo;
}

function GetDcState(dcName) {
    var isNotCollaapse = "T";
    if (dcName != "") {
        let _thisDicId = parseInt(dcName.substr(2, dcName.length), 10);
        if ($("#dcBlean" + _thisDicId).length == 0 || $("#dcBlean" + _thisDicId).is(":checked"))
            isNotCollaapse = "T";
        else
            isNotCollaapse = "F";
    }
    return isNotCollaapse;
}

function AxAllowEmpty(fldNames, flagVal) {
    if (fldNames != "") {
        let fNames = fldNames.split(',');
        fNames.forEach(function (val) {
            let _IndVal = AxAllowEmptyFlds.filter(vals => vals.startsWith(val + "~"));
            if (_IndVal.length > 0) {
                let _ind = $.inArray(_IndVal[0], AxAllowEmptyFlds);
                AxAllowEmptyFlds[_ind] = val + "~" + flagVal;
            }
            else
                AxAllowEmptyFlds.push(val + "~" + flagVal);
            var isGridDc = IsGridField(val);
            var dcno = GetDcNo(val);
            if (isGridDc == false) {
                let _thisFldId = val + "000F" + dcno;
                if (flagVal == "F" && !$("#" + _thisFldId).parents(".agform").find(".fld-wrap3").hasClass("required"))
                    $("#" + _thisFldId).parents(".agform").find(".fld-wrap3").addClass("required");
                else if (flagVal == "T")
                    $("#" + _thisFldId).parents(".agform").find(".fld-wrap3").removeClass("required");
            }
            else {
                if (flagVal == "F" && !$("#gridHd" + dcno + " thead th#th-" + val + " .thhead").hasClass("required"))
                    $("#gridHd" + dcno + " thead th#th-" + val + " .thhead").addClass("required");
                else if (flagVal == "T")
                    $("#gridHd" + dcno + " thead th#th-" + val + " .thhead").removeClass("required");
            }

        });
    }
    return fldNames + "~" + flagVal;
}

function AxReadOnly() {
    $("[id^=DivFrame]").find('input,textarea, img, select, a').attr('disabled', true);
    $("[id^=DivFrame]").find('.gridIconBtns a').addClass('disabled');
    $("[id^=DivFrame]").find('.gridIconBtns a').attr('disabled', true);
    $("[id^=DivFrame]").find('.gridRowChk,.gridHdrChk').addClass('disabled').attr('disabled', true);
    $(".dz-hidden-input").prop("disabled", true);
    $(".fldImageCamera").addClass('disabled');
    $(".fileuploadmore").prop("disabled", true);
}

function AxMask(fldNames, maskChar, applyType) {
    applyType = applyType.replace(/~/g, "♠");
    AxFormControlList.push("mask~" + fldNames + "♦" + maskChar + "♦" + applyType);
    return "mask~" + fldNames + "♦" + maskChar + "♦" + applyType;
}

function AxNoMask(fldNames) {
    AxFormControlList.push("nomask~" + fldNames);
    return "nomask~" + fldNames;
}

function AxDisableGridCell(fldNames, gcRowNo) {
    AxFormControlList.push("gridcelldisable~" + fldNames + "♦" + gcRowNo);
    return "gridcelldisable~" + fldNames + "♦" + gcRowNo;
}

function AxEnableGridCell(fldNames, gcRowNo) {
    AxFormControlList.push("gridcellenable~" + fldNames + "♦" + gcRowNo);
    return "gridcellenable~" + fldNames + "♦" + gcRowNo;
}