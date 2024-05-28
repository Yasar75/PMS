//<Module>  IFrames Handler </Module>
//<Author>  Prashik  </Author>
//<Description> Do operartions like assignment/execute function/check/return parent even if iFrame heirarchy is unknown </Description>

var lastFrame = false;
var returnData = false;

function doParentOpInIframe(opName, opType, opData, selIFrame) {
    if (typeof selIFrame === "undefined" || $(selIFrame).is($(window.parent))) {
        returnData = false;
    }
    //pass opName, opType, opData only
    opType == undefined ? opType = "" : opType;
    opData == undefined ? opData = "" : opData;
    selIFrame == undefined ? selIFrame = false : selIFrame;
    var allData = "";
    if (typeof opData === "string"){
        allData = opData.split('~');
    }
    var paramString = "";
    selIFrame = getFrameParent(selIFrame);
    try {

        if (selIFrame) {
            if (opType == "var") {
                if (eval("typeof selIFrame" + "." + opName + " !== 'undefined'")) {
                    if (opName.indexOf("[") > -1 && opName.indexOf("]") > -1 && opName.split("[").length == 2) {
                        var partialVar = opName.substring(0, opName.lastIndexOf("["));
                        var partailVarIndex = opName.substring(opName.lastIndexOf("[") + 1, opName.lastIndexOf("]"));
                        selIFrame[partialVar][partailVarIndex] = opData;
                    }else{
                        eval("selIFrame" + "." + "opName = opData");
                    }
                } else {
                    doParentOpInIframe(opName, opType, opData, selIFrame);
                    returnData = true;
                    return returnData;
                }
            } else if (opType == "fun") {
                if (opData != "") {
                    for (i = 0; i < allData.length; i++) {
                        paramString += allData[i];
                        if (i != allData.length - 1) {
                            paramString += ",";
                        }
                    }
                }
                returnData = eval("selIFrame" + "." + opName + "(" + paramString + ")");
               // lastFrame = true;
                return returnData;
            } else if (opType == "chk") {
                if(eval("selIFrame" + "." + opName) == opData != false){
                    returnData = true;
                   // lastFrame = true;
                    return returnData;
                } else {
                    doParentOpInIframe(opName, opType, opData, selIFrame);
                }
            } else if (opType == "rtn") {
                if (opData != "") {
                    if ($(opData, selIFrame.document).length < 1) {
                        doParentOpInIframe(opName, opType, opData, selIFrame);
                    } else {
                        returnData = eval("selIFrame" + "." + opName);
                       // lastFrame = true;
                        return returnData;
                    }
                } else {
                    if (typeof eval("selIFrame" + "." + opName) === "undefined" || eval("selIFrame" + "." + opName).length < 1) {
                        doParentOpInIframe(opName, opType, opData, selIFrame);
                    } else {
                        returnData = eval("selIFrame" + "." + opName);
                       // lastFrame = true;
                        return returnData;
                    }
                }
            } else {
                returnData = selIFrame;
               // lastFrame = true;
                return returnData;
            }
        } 
            //if (lastFrame) {
                return returnData;
            //}
    } catch (ex) {
        doParentOpInIframe(opName, opType, opData, selIFrame);
    }
}

function getFrameParent(selIFrame) {
    if (selIFrame == top) {
        lastFrame = true;
        return false;
    } else {
        lastFrame = false;
    }
    if (selIFrame == false) {
        return window.parent;
    } else {
        return eval(selIFrame = selIFrame.parent);
    }
}

function closeRemodalFrame() {
    if (remodalExist()) {
        $(".remodal-close", doParentOpInIframe("document", "rtn", ".remodal-close")).click();
    }
}

function remodalExist() {
    if ($("#axpertPopupWrapper", doParentOpInIframe("document", "rtn", "#axpertPopupWrapper")).length > 0) {
        return true;
    } else {
        return false;
    }
}