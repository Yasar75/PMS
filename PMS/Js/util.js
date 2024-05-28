//-------------List of functions in this file----------------------------
//Mid(str, start, len) -Function which returns the substring of the str.
//InStrPath(strSearch) -Function which returns the position of the axpert string in the path.
//CheckNumeric(evt, val) -Function to check if the character is numeric.
//-----------------------------------------------------------------------
var glCultures = eval(callParent('glCulture'));
var dateString = glCultures == "en-us" ? "mm/dd/yyyy" : "dd/mm/yyyy";

//Function which returns the substring of the str.
function Mid(str, start, len) {

    // Make sure start and len are within proper bounds
    if (start < 0 || len < 0) return "";
    var iEnd, iLen = String(str).length;
    if (start + len > iLen)
        iEnd = iLen;
    else
        iEnd = start + len;
    return String(str).substring(start, iEnd);
}

//Function which returns the position of the axpert string in the path.
function InStrPath(strSearch) {

    var charSearchFor = "\\";
    strSearch = strSearch.toLowerCase();
    var ki = strSearch.indexOf("axpert");

    strSearch = strSearch.substring(0, ki);
    var sPos = new Array();
    var h = 1;

    for (i = 0; i < strSearch.length; i++) {

        if (charSearchFor == Mid(strSearch, i, 1)) {

            sPos[h] = i;
            h = h + 1;
        }
    }

    var fRes = 0;
    for (m = 1; m < h - 1; m++) {

        fRes = sPos[m];
    }
    return fRes;
}

Array.prototype.getMaxVal = function() {
    var max = 0, v, len = this.length, i = 0;
    var indx = 0;
    for (; i < len; ++i)
        if ((typeof (v = this[i]) == 'number' || v != "") && v != "***") {
        max = Math.max(max, v);
        indx = max;
    }
    return indx;
}
Array.prototype.getMinVal = function() {
    var min = 10000000, v, len = this.length, i = 0;
    var indx = 0;
    for (; i < len; ++i)
        if ((typeof (v = this[i]) == 'number' || v != "") && v != "***") {
        min = Math.min(min, v);
        indx = min;
    }

    return indx;
}

//Function to check if the character is numeric.
function CheckNumeric(evt, val) {

    var charCode = (evt.which) ? evt.which : event.keyCode;
    if (charCode >= 48 && charCode <= 57 || (charCode == 46 && val.indexOf(".") == -1) || (charCode == 45 && val.indexOf("-") == -1) || charCode == 8)
        return true;
    return false;
}
