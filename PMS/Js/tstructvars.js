
//Axpert global variables
var AxActiveRowNo = "";
var AxActiveField = "";
var AxActivePRow = "";
var AxActiveFieldIndex = "";
var AxActiveDc = "";
var AxActivePDc = "";
var AxIsPopActive = false;
var AxOldValue = "";
var FldOldValue = "";
var AxDoBlur = true;
var AxExecFormControl = false;
var AxFldFormControl = "";
var AxFromAssociated = false;
var AxBlurAction = "Default";
var AxActiveAction = "";
var AxFromLstFlds = "";
var AxPopRowNo = "";
var AxDepFields = new Array();
var AxGlobalChange = false;
var AxPickResult = "";
var AxIsTstructCached = false;
var AxDepRows = new Array();
var IsFormDirty = false;
var IsDcPopGridCleared = false;

var gllangType = eval(callParent('gllangType'));

//Global variables for workflow configuration
var AxOnApproveDisable = false;
var AxOnRejectDisable = false;
var AxOnReturnSave = false;
var AxOnRejectSave = false;
var AxAllowCancel = true; //to check if cancel is allowed in workflow

var GridDispHead = false;
var ServerErrMsg = eval(callParent('lcm[63]'));
var cancelMsg = eval(callParent('lcm[64]'));
var transid = '';
var IsFunction = "";
var IsService = false;
var TotalDCs = 0;
var IsTaskBtnCliked = false;
var LoadResult = '';
var TstructHasPop = false;
//Validation variables
var erorField = "";
var errorFlag = false;
var CurrTabNo;
var DimmerCalled = false;
var DepFldName = "";
var IsWFApproved = "";
var appstatus = "";
var fldSrc = "";
var gl_language = "";
//Dependency arrays.
var DArray = new Array();
var PArray = new Array();
var CArray = new Array();
var FldsAssigned = new Array();
var FldLoadedFields = new Array();
var FldLoadedValues = new Array();

//add deleted row information arrays
var DeletedDCs = new Array();
var DeletedRows = new Array();

//Used in setting the title in showdialog and hidedialog function
var msgType = "";
var AxActDepFld = "";
var AxActDepFldVal = "";

var DispCaption = new Array();
var DispFldName = new Array();
var ChangedFields = new Array();
var ChangedFieldDbRowNo = new Array();
var ChangedFieldOldValues = new Array();
var ChangedFieldValues = new Array();
var DeletedDCRows = new Array();
var ChangedDcs = new Array();
var ChangedDcRows = new Array();
var NonGridExpDepFlds = new Array();
var DeletedFieldValue = new Array();
var RegVarFldList = new Array();
var AcceptExpressionFlds = new Array();

var AllFieldNames = new Array();
var AllFieldValues = new Array();
var ScriptMaskFields = new Array();

//add row no arrays
var RowDcNo = new Array();
var DbRowNo = new Array();
var ClientRowNo = new Array();

//add combo filling arrays
var ComboParentField = new Array();
var ComboParentValue = new Array();
var ComboDepField = new Array();
var ComboDepValue = new Array();
var MasterRow = new Array();

//variables used in fillgrid.js
var fillDcname = "";
var ErrLength = 7;
var ErrStr = "<error>";
var FillGridFillRows = 0;
var FillGridCurrentDC = 0;
var IsFillGridCall = false;

//variables used in file upload functions.
var confrm = false;
var gActionname = "";
var gConfirmmsg = "";

//variables for attachments
var attachments = "";
var filepatharray = new Array();
var filenamearray = new Array();
var fileonloadarray = new Array();

//temp variables for dependency
var fExdefList = new Array();
var ffillList = new Array();
var fDefList = new Array();
var fSfList = new Array();
var DCExpDeps = new Array();
var IsTabDisabled = false;
var traceSplitChar = "♦";
var traceSplitStr = "♦♦";

//Arrays for Pre Processing
var EWords = new Array();

var ArrPopNewDcs = new Array();
var ArrPopNewRows = new Array();

var IsAddRowCalled = false;
var IsDraftLoad = false;
var DisabledDcs = new Array();
var AxFormContHiddenFlds = new Array();
var AxFormContSetCapFlds = new Array();
var AxFormContSetCapFldsGrid = new Array();
var AxFormContSetFldActGrid = new Array();
var AxFormContFldSetFocus = new Array();
var AxFormContSetGridCell = new Array();
var changeFillGridDc = 0;
var ArrActionLog = "";
var FromSave = false;


// fields defined for auto generated fields
var AxAutoGenFld;
var displayAutoGenVal;
var AxAutoGenDeps = new Array();

var AxParStrFromDep = "";
var AxSubGridRows = "";
var AxSubWsRows = new Array();
var AxSubDsRows = new Array();

var AxFormContDisableFlds = new Array();
var AxDynamicFlds = new Array();
var AxDynamicFldVal = new Array();

/*5 variables used for logging timetaken*/
var ASBTotal = "";
var ASBDbTime = "";
var AxStartTime = 0;
var AxTimeBefSerCall = 0;
var AxLogTimeTaken = "false";
var AxIsTstructLocked = false;
var AxTabStartTime = 0;

//Variables for footer custom buttons
var axSaveRecId = "";
var btnSaveContVal = "";
var btnSaveSendVal = "";


//Variables for Dc dependency
var arrRefreshDcs = [];
var arrRefreshFlds = [];
var arrRefreshFldDirty = [];

//variable for axpcurrenccydec
var currdecVal = "";
//variable for TStruct custom Actions

var axCustomTstAction = "";
var AxPopup = "";
var blurNextPreventElement = new Object();
var blurNextPreventId = "";
var blurNextPreventOnClickFunction = "";
var isPKItemSelected = false;
var isSelfOpened = false;

//variable to check dependency for load master data(+ add button)
var depAddCheck = false;

//var AxClColors = {
//    //clNone: "#1FFFFFFF",
//    clNone: "transparent",
//    clAqua: "#00FFFF",
//    clBlack: "#000000",
//    clBlue: "#0000FF",
//    clCream: "#FFFBF0",
//    clDkGray: "#808080",
//    clFuchsia: "#FF00FF",
//    clGray: "#808080",
//    clGreen: "#008000",
//    clLime: "#00FF00",
//    clLtGray: "#C0C0C0",
//    clMaroon: "#800000",
//    clMedGray: "#A0A0A4",
//    clMoneyGreen: "#C0DCC0",
//    clNavy: "#000080",
//    clOlive: "#808000",
//    clPurple: "#800080",
//    clRed: "#FF0000",
//    clSilver: "#C0C0C0",
//    clSkyBlue: "#A6CAF0",
//    clTeal: "#008080",
//    clWhite: "#FFFFFF",
//    clYellow: "#FFFF00",
//};

var axpIsRowValid = "axp__isGrdVld";
var pickListRowCount = -1;


var currentCK = "";

//global variable for pick list 
var initialSrchVal = "";
//global variable for ck editor
var isReadyCK = false;
var currentPickList = "";

var applyFontListView = false;

var designGridOptions = {
    float: true,
    disableDrag: false,
    disableResize: false,
    width: 36,
    //cellHeight: 70,
    draggable: { handle: '.grid-stack-item-content', scroll: true, appendTo: 'body' },
    resizable: { autoHide: true, handles: gllangType == "ar" ? 'sw' : 'se' },
    //rtl : false,
    minWidth: 768,
};
var renderGridOptions = {
    float: true,
    disableDrag: true,
    disableResize: true,
    width: 36,
    //cellHeight: 70,
    draggable: { handle: '.grid-stack-item-content', scroll: true, appendTo: 'body' },
    resizable: { autoHide: true, handles: gllangType == "ar" ? 'sw' : 'se' },
    //rtl: false,
    minWidth: 768,
};

var theMode = "render";//design/render

var compressedMode = false;

var gsConf = {
    normalMode: {
        get cellHeight() {
            return this.labelHeight + this.controlHeight;
        },
        verticalMargin: 5,
        controlHeight: 38,
        labelHeight: 32.5
    },
    compressedMode: {
        get cellHeight() {
            return this.labelHeight + this.controlHeight;
        },
        verticalMargin: 1,
        controlHeight: 34.4,
        labelHeight: 21
    }
};

var autoArrangeFillGap = false;

var selectedDesignObject = {};

var jsonText = "";

var designObj = {};

var staticRunMode = false;

var performFastSearch = true;

var curRowNoo = "";
var globalClickTheEditRow = "";

var actionCallFlag = Math.random();
var actionCallbackFlag = actionCallFlag;
var globalOnlySave = false;
var navValidator = true;
var gridEditValidator = true;
var lvNavDetails = "";
var callBackFunDtls = "";
var wizardObj;
var SavedId;
var PublishId;
var isFormChange = false;

//for UpdateRowInDataObj
var IsUpdateRowcalled = false;
var iframeindex = -1;
//To track autocomplete field fill fields 
// var AutoFillFlds = {};
var StartTime = 0;

var tableValues = {};
// var isAutoComSelected = true;
// var isAutoComSelWithTab = false
var isSumTillGrid = false;
var isEvalGrid = false;
var isLoadDataCall = false;
var isTstPostBackVal = "";
var isMobileGridRowEdit = false;
var SetCarryFlds = new Array();
var isMobile = isMobileDevice();

var multiSelectflds = new Array();
var multiSelFldParents = new Array();
var multiSelFldResult = new Array();
var multiSelectLoadVals = new Array();

var ChangedTblFields = new Array();
var ChangedTblFieldVals = new Array();

var fldSourceAcMetaJson = "";
var sourceAcMetaJsonFlds = new Array();

try {
    (typeof CKEDITOR != "undefined") && (CKEDITOR.basePath = `${encodeURI(mainPageUrl = window.location.href.toLowerCase()) && (webUrl = mainPageUrl.substr(0, mainPageUrl.indexOf("/aspx")))}/Js/ckeditor/`);
} catch (error) { }

var draftSetTimeoutObj;
var checkIsdraft = "false";
var wizardSaveActionBtn = "FormSubmit()";
var htmlCodeMirror = $();
var toolbarPinArr = [];
var tstWFpdcomments = "false";
var tstWorkFlowId = "";
var tstReadOnly = false;
var axpFileSavedPath = "";
var isScriptFCAddClick = false;
var AxOldValueOnChange = "";
var axGridAttSavedPath = "";
var lastChangedField = "";
var focusAfterSaveOnLoad = "";
var evalExpOnSaveDraftLoad = false;
Dropzone.autoDiscover = false;
var clickedButtonCaption = "";
var FormControlSameFormLoad = false;
var AxFocusedFld = "";
var AxRulesFlds = new Array();
var tstReadOnlyPeg = false;
var AxFormControlList = new Array();
var isCopyTrans = false;
var TstCopyTransRes = "";
