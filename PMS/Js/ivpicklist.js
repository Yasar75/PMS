$j(document).ready(function () {    
    srchFld = $j("#srchFld").val();
    GetParams();
    checkSuccessAxpertMsg();
});

function GetParams() {
    if (window.opener != undefined) {

        var i = 0;
        var pValue = "";
        var parentArr = window.opener.parentArr;
        var paramType = window.opener.paramType;
        var ctrl;
        for (i = 0; i < parentArr.length; i++) {
            if (parentArr[i] == srchFld)
                break;

            var ctrl = $j("#" + parentArr[i], window.opener.document);
            if (ctrl.length) {
                var fldType = ctrl.prop("type");
                if (fldType == "select-one") {
                    var result = ctrl.find("option:selected").val();
                    pValue += parentArr[i] + "¿" + result + "###";
                }
                else if (fldType == "select-multiple") {
                    var cnt = 0;
                    var ft = "false";
                    var ctrl1 = window.opener.document.getElementById(parentArr[i]);
                    cnt = ctrl1.options.length;
                    for (j = 0; j < cnt; j++) {
                        if (ft == "false") {
                            if (ctrl1.options[j].selected == true) {
                                ft = "true";
                                pValue += parentArr[i] + "¿" + ctrl1.options[j].value + "###";
                            }
                        }
                    }
                }
                else {
                    var newval = ctrl.val();
                    if ((paramType[i] == "Date/Time") && (dtCulture.toLowerCase() == "en-us") && newval != "")
                        newval = GetDateStr(ctrl.val(), "mm/dd/yyyy", "dd/mm/yyyy");
                    pValue += parentArr[i] + "¿" + newval + "###";
                }
            }
        }

        $j("#paramXml").val(pValue);
        if (pValue != "" || (parentArr.length == 1 && parentArr[0] == srchFld))
            document.getElementById("btnTemp").click();

    }
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
        } else {
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
                } else {
                    $("body", window.opener.document).removeClass("page-loading");
                }
            }
        }
    }
    DimmerCalled = false;
}