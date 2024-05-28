var expression_config = {
    "function": {
        "Abs": {
            "selectText": "Abs(Num:Numeric)"
        },
        "Total": {
            "selectText": "Total(FieldName: string)"
        },
        "Sum": {
            "selectText": "Sum(FieldName, FieldValue, CumulateField : string)"
        },
        "SumTill": {
            "selectText": "SumTill(FieldName, FieldValue, CumulateField, RowNo)"
        },
        "GetMax": {
            "selectText": "GetMax(FieldName)"
        },
        "GetValue": {
            "selectText": "GetValue(Fieldname: character; RowNo: numeric)"
        },
        "GetId": {
            "selectText": "GetId(FieldName: string; RowNo: numeric)"
        },
        "GetRow": {
            "selectText": "GetRow(FieldName, Fieldvalue: string)"
        },
        "GetRowCount": {
            "selectText": "GetRowCount(FieldName: string)"
        },
        "GetOld": {
            "selectText": "GetOld(FieldName, RowNo)"
        },
        "Cell": {
            "selectText": "Cell(col, row:numeric)"
        },
        "AddRow": {
            "selectText": "AddRow(FrameName: string)"
        },
        "DeleteRow": {
            "selectText": "DeleteRow(FrameName:string; rowno:integer)"
        },
        "FieldChanged": {
            "selectText": "FieldChanged(FieldName, RowNo)"
        },
        "SetValue": {
            "selectText": "SetValue(FieldName: string; Rowno: integer;Value: String)"
        },
        "GetSQLValue": {
            "selectText": "GetSQLValue(SQLText, ColumnName: String)"
        },
        "SetProperty": {
            "selectText": "SetProperty(fName, propertyname, value: String)"
        },
        "SetSequence": {
            "selectText": "SetSequence(FieldName, Prefix:String)"
        },
        "ResetActivecomp": {
            "selectText": "ResetActivecomp()"
        },
        "LoadTempFile": {
            "selectText": "LoadTempFile(FileName)"
        },
        "DeleteTempFile": {
            "selectText": "DeleteTempFile(FileName)"
        },
        "ActivateField": {
            "selectText": "ActivateField(Fieldname, RowNo)"
        },
        "AllowFrameChange": {
            "selectText": "AllowFrameChange(FrameNo, Allow)"
        },
        "AllowFieldChange": {
            "selectText": "AllowFieldChange(FieldName, Allow)"
        },
        "ExecuteOption": {
            "selectText": "ExecuteOption(Caption)"
        },
        "RefreshField": {
            "selectText": "RefreshField(FieldName)"
        },
        "RefreshFrame": {
            "selectText": "RefreshFrame(FrameNo)"
        },
        "InitGrid": {
            "selectText": "InitGrid(FrameNo)"
        },
        "GetOldId": {
            "selectText": "GetOldId(FieldName, Rowno)"
        },
        "SQLRegVar": {
            "selectText": "SQLRegVar(SQLText)"
        },
        "CheckStock": {
            "selectText": "CheckStock(ItemId, OldItemId, DocDate, OldDocDate, PlusOrMinus, Qty, OldQty)"
        },
        "EnableButton": {
            "selectText": "EnableButton(caption, flag)"
        },
        "GetSubTotal": {
            "selectText": "GetSubTotal(FieldName, ParentRow)"
        },
        "RoudedDiff": {
            "selectText": "RoudedDiff(FieldName, RowNo, RoundTo)"
        },
        "SetSystemVar": {
            "selectText": "SetSystemVar(Varname, Value)"
        },
        "TrimVal": {
            "selectText": "TrimVal(Value: string)"
        },
        "Getinteger": {
            "selectText": "Getinteger(Value :numeric)"
        },
        "GetLength": {
            "selectText": "GetLength(value : string)"
        },
        "FindAndReplace": {
            "selectText": "FindAndReplace(S, FindWhat, ReplaceWith: String)"
        },
        "FormatAmount": {
            "selectText": "FormatAmount(Value,DecLen:numeric,withComma,MillionRep,NegativeRep,PositiveRep : String)"
        },
        "Function FormatAccAmount": {
            "selectText": "Function FormatAccAmount(Value,DecLen:numeric, withComma, MillionRep, ALIE, Rep :String)"
        },
        "LeftPad": {
            "selectText": "LeftPad(S: String; MaxLength: integer; c: Char)"
        },
        "Pad": {
            "selectText": "Pad(S: String; MaxLength: integer; c: Char)"
        },
        "Upper": {
            "selectText": "Upper(Str : String)"
        },
        "Lower": {
            "selectText": "Lower(Str : String)"
        },
        "DTOC": {
            "selectText": "DTOC(PDate : TDateTime)"
        },
        "CTOD": {
            "selectText": "CTOD(PDate : String)"
        },
        "CMonthYear": {
            "selectText": "CMonthYear(Dt : TDateTime)"
        },
        "Rnd": {
            "selectText": "Rnd(Amount, RoundTo : Numeric)"
        },
        "Stuff": {
            "selectText": "Stuff(Str1,Str2 : String; P : Numeric)"
        },
        "Round": {
            "selectText": "Round(Num , Decimals:Numeric)"
        },
        "IIF": {
            "selectText": "IIF(Expression, True_Result, False_Result : String)"
        },
        "AmtWord": {
            "selectText": "AmtWord(Amount : Numeric)"
        },
        "CurrAmtWord": {
            "selectText": "CurrAmtWord(Amount : Numeric, Currency, SubCurrency, InMillions: string, Decimals :integer)"
        },
        "Val": {
            "selectText": "Val(Num:String)"
        },
        "Str": {
            "selectText": "Str(Num :Numeric)"
        },
        "SubStr": {
            "selectText": "SubStr(S:string;posn,Num:numeric)"
        },
        "AddToDate": {
            "selectText": "AddToDate(Dt:Date;Num:numeric)"
        },
        "Encode": {
            "selectText": "Encode(Num:Extended;StrCode:String)"
        },
        "HashChar": {
            "selectText": "HashChar(S:String)"
        },
        "DaysElapsed": {
            "selectText": "DaysElapsed(D1,D2:Date)"
        },
        "TimeElapsed": {
            "selectText": "TimeElapsed(T1,T2:String)"
        },
        "AddToTime": {
            "selectText": "AddToTime(TimeVar:String; Num:Numeric)"
        },
        "AddToMonth": {
            "selectText": "AddToMonth(D:Date; N:numeric)"
        },
        "LastDayOfMonth": {
            "selectText": "LastDayOfMonth(D:Date)"
        },
        "MakeDate": {
            "selectText": "MakeDate(d, m, y)"
        },
        "ValidEncodeDate": {
            "selectText": "ValidEncodeDate(year, month, day:numeric)"
        },
        "IsEmptyValue": {
            "selectText": "IsEmptyValue(Value, DataType:String)"
        },
        "Eval": {
            "selectText": "Eval(Expr:String)"
        },
        "Lpad": {
            "selectText": "Lpad(S: String;Width: integer;padChar: Char)"
        },
        "Rpad": {
            "selectText": "Rpad(S: String;Width: integer;padChar: Char)"
        },
        "Power": {
            "selectText": "Power(Num, Power:Numeric)"
        },
        "GetMod": {
            "selectText": "GetMod(Num, Divisor : Numeric)"
        },
        "ISEmpty": {
            "selectText": "ISEmpty(Value)"
        },
        "Date": {
            "selectText": "Date()"
        },
        "Time": {
            "selectText": "Time()"
        },
        "Dayofdate": {
            "selectText": "Dayofdate(date)"
        },
        "Monthofdate": {
            "selectText": "Monthofdate(date)"
        },
        "Yearofdate": {
            "selectText": "Yearofdate(date)"
        },
        "Gen_id": {
            "selectText": "Gen_id(S, N)"
        },
        "FormatDateTime": {
            "selectText": "FormatDateTime(FormatString, DateTime)"
        },
        "Trim": {
            "selectText": "Trim(S:String)"
        },
        "FindRecord": {
            "selectText": "FindRecord(SQLName, SearchColumn, SearchValue)"
        },
        "SQLGet": {
            "selectText": "SQLGet(SQLName, ColumnName)"
        },
        "DPImport": {
            "selectText": "DPImport(FileName)"
        },
        "DPExport": {
            "selectText": "DPExport(DefName, FileName, ExpType, SiteNo)"
        },
        "FixTree": {
            "selectText": "FixTree(TransId)"
        },
        "PostMDMap": {
            "selectText": "PostMDMap(Transid)"
        },
        "Repost": {
            "selectText": "Repost(Transid, Condstr)"
        },
        "Regenerate": {
            "selectText": "Regenerate(Transid)"
        },
        "PostGenMap": {
            "selectText": "PostGenMap(Transid, GenMaps, ConditionString)"
        },
        "Gettransid": {
            "selectText": "Gettransid(TransDesc)"
        },
        "GetDelimitedStr": {
            "selectText": "GetDelimitedStr(SQLResult, FieldName, Delimiter)"
        },
        "GetStockValue": {
            "selectText": "GetStockValue(ItemId:numeric, DocDate : Date, IssueQty: numeric, VMethod:Char)"
        },
        "GetCell": {
            "selectText": "GetCell(ColName, RColName, Rvalue: string)"
        },
        "GetRCell": {
            "selectText": "GetRCell(ColName: string; RowNo: integer)"
        },
        "GetColNo": {
            "selectText": "GetColNo(Colname: string)"
        },
        "GetRowno": {
            "selectText": "GetRowno(colno: integer; Rvalue: string)"
        },
        "ComputePost": {
            "selectText": "ComputePost(ColName: String; RowNo: integer;Exprn: String)"
        },
        "Includes": {
            "selectText": "Includes(FieldName, FieldValue :String )"
        },
        "Excludes": {
            "selectText": "Excludes(FieldName, FieldValue :String )"
        },
        "Childof": {
            "selectText": "Childof(Tablename,FieldName,FieldLevel,FieldValue :String )"
        },
        "SetTotalValue": {
            "selectText": "SetTotalValue(TotalOrder: Numeric;ColumnName,Value :String)"
        },
        "SetCellFont": {
            "selectText": "SetCellFont(ColumnName, FontString)"
        },
        "SortIView": {
            "selectText": "SortIView(ColumnName, AscendingOrDescending)"
        },
        "Filter": {
            "selectText": "Filter(FilterExpression)"
        },
        "GroupBy": {
            "selectText": "GroupBy(ColumnName)"
        },
        "HideColumn": {
            "selectText": "HideColumn(ColumnName)"
        },
        "UnHideColumn": {
            "selectText": "UnHideColumn(ColumnName)"
        },
        "SetExtSequence": {
            "selectText": "SetExtSequence(Transid, FieldName, Prefix)"
        },
        "AddOption": {
            "selectText": "AddOption(Caption)"
        },
        "EditColumn": {
            "selectText": "EditColumn(Transid, ColumnName, Prompt)"
        },
        "PostRecord": {
            "selectText": "PostRecord(Transid:string; RecordId:Extended)"
        },
        "SetColumnValue": {
            "selectText": "SetColumnValue(ColumnName, Value)"
        },
        "RefreshIView": {
            "selectText": "RefreshIView()"
        },
        "RefreshView": {
            "selectText": "RefreshView()"
        },
        "GetStockAge": {
            "selectText": "GetStockAge(Itemid, Date, PeriodStr)"
        },
        "OpenTransForm": {
            "selectText": "OpenTransForm(Transcaption, Top, Left, Heigh, Width)"
        },
        "SendEMail": {
            "selectText": "SendEMail(EmailDefName:String)"
        },
        "AxPrint": {
            "selectText": "AxPrint(AxPrintDefName:String)"
        },
        "AxImport": {
            "selectText": "AxImport(AxImpDefName, SourceFilePathAndName, AxImpUserName: String)"
        },
        "AxExecuteAPI": {
            "selectText": "AxExecuteAPI(ExecAPIDefName:String)"
        },
        "OpenTstruct": {
            "selectText": "OpenTstruct(pName,pShowin,pVisible:string; pFieldValues:String='')"
        },
        "OpenIview": {
            "selectText": "OpenIview(pName,pShowin,pVisible:string; pFieldValues:String='')"
        },
        "Save": {
            "selectText": "Save(tname:String)"
        },
        "pdf": {
            "selectText": "pdf(Source,formname,pdffilename : String; showpdf : String = ''; dsign : String = ''; printpdf : String = ''; savetodb : String = '')"
        },
        "ShowMessage": {
            "selectText": "ShowMessage(msg : String; conresult : String = '')"
        },
        "PrintForm": {
            "selectText": "PrintForm(Source,PrintFormName : String)"
        },
        "PreviewForm": {
            "selectText": "PreviewForm(Source,PreviewFormName,PFormFileName : String; SavetoDB : String = '')"
        },
        "CancelTransaction": {
            "selectText": "CancelTransaction(tstructname,Recordid,CancelRemarks : String)"
        },
        "DeleteTransaction": {
            "selectText": "DeleteTransaction(TStructName,RecordID : String)"
        },
        "LoadTransaction": {
            "selectText": "LoadTransaction(pName,pShowin,pVisible,pFieldValues : String)"
        },
        "ViewAttachment": {
            "selectText": "ViewAttachment(AttachmentFormName : String)"
        },
        "ImportIntoGrid": {
            "selectText": "ImportIntoGrid(ImpTsName,FieldValues,Separator,MapinFile : String)"
        },
        "CSVImporting": {
            "selectText": "CSVImporting(name,primaryfield,groupfield,fieldvalues,mapinfile,separator : String)"
        },
        "Post": {
            "selectText": "Post(name,groupcol,FieldValue : String)"
        },
        "SQLNext": {
            "selectText": "SQLNext(SQLName: String)"
        },
        "SQLRecCount": {
            "selectText": "SQLRecCount(SQLName: String): Integer"
        },
        "SQLBof": {
            "selectText": "SQLBof(SQLName: String): String"
        },
        "SQLEof": {
            "selectText": "SQLEof(SQLName: String): String"
        },
        "SQLFirst": {
            "selectText": "SQLFirst(SQLName: String)"
        },
        "SQLLast": {
            "selectText": "SQLLast(SQLName: String)"
        },
        "SQLPrior": {
            "selectText": "SQLPrior(SQLName: String)"
        },
        "FileDownLoad": {
            "selectText": "FileDownLoad(URL,TargetDir,FileNames: String)"
        },
        "FileUpLoad": {
            "selectText": "FileUpLoad(URL,TargetDir,FileNamesWithPath : String)"
        },
        "AxHideControls": {
            "selectText": "AxHideControls(ElementName(Ex: FieldName,DCName,ButtonName):String)"
        },
        "AxUnhideControls": {
            "selectText": "AxUnhideControls(ElementName(Ex: FieldName,DCName,ButtonName):String)"
        },
        "AxEnableControls": {
            "selectText": "AxEnableControls(ElementName(Ex: FieldName,DCName,ButtonName):String)"
        },
        "AxDisableControls": {
            "selectText": "AxDisableControls(ElementName(Ex: FieldName,DCName,ButtonName):String)"
        },
        "LoadForm": {
            "selectText": "LoadForm(Transid,Params,DisplayMode,RefreshOnClose:String)"
        },
        "LoadFormAndData": {
            "selectText": "LoadFormAndData(Transid,Params,DisplayMode,RefreshOnClose:String)"
        },
        "LoadPage": {
            "selectText": "LoadPage(PageName,Params,DisplayMode,RefreshOnClose:String)"
        },
        "LoadIView": {
            "selectText": "LoadIView(IViewName,Params,DisplayMode,IsPopupRefreshParent:String)"
        },
        "OpenPage": {
            "selectText": "OpenPage(PageName,Params,DisplayMode,RefreshOnClose:String)"
        },
        "SQLPost": {
            "selectText": "SQLPost(SQLText,TargetTransid,GroupField,PrimaryField,SQLName:String)"
        },
        "SetFieldCaption": {
            "selectText": "SetFieldCaption(Name, Caption:String)"
        },
        "AxDcCollapse": {
            "selectText": "AxDcCollapse(ElementName(Ex: DCName):String)"
        },
        "AxDcExpand": {
            "selectText": "AxDcExpand(ElementName(Ex: DCName):String)"
        },
        "StringPOS": {
            "selectText": "StringPOS(str,substr:String; separator : String = '')"
        },
        "GetDcState": {
            "selectText": "GetDcState(DCName:String)"
        },
        "AxAllowEmpty": {
            "selectText": "AxAllowEmpty(FieldName,value(Ex.T/F):String)"
        },
        "AxReadOnly": {
            "selectText": "AxReadOnly()"
        },
        "ClearCache": {
            "selectText": "ClearCache(type~name(Ex.t~transid,i~ivname):String)"
        },
        "AxMask": {
            "selectText": "AxMask(FieldName,MaskChar,All/Few Characters:String)"
        },
        "SetToRedis": {
            "selectText": "SetToRedis(ConnectionName,KeyName,KeyValue:String)"
        },
        "AxDisableGridCell": {
            "selectText": "AxDisableGridCell(FieldName,RowNo)"
        },
        "AxEnableGridCell": {
            "selectText": "AxEnableGridCell(FieldName,RowNo)"
        }
    },
    "keyword": ["PrintDocNames", "AllowedUserNames", "DisplayTotal ", "LastTotal ", "Tot<ColumnName>", "Group<ColumnName>"]
}
