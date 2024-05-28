var dtCulture = eval(callParent('glCulture'));
var dtFormat = "";


var dateLocale = new Array();
var dateFormat = new Array();

dateLocale[0] = "en-us";
dateFormat[0] = "m/d/Y";
dateLocale[1] = "en-gb";
dateFormat[1] = "d/m/Y";


function GetDateFormat(culture) {
    var dtStrFormat = "";
    var ind = $j.inArray(culture.toLowerCase(), dateLocale);
    if (ind != -1) {
        dtStrFormat = dateFormat[ind];
    } else {
        dtStrFormat = "d/m/Y";
    }
    return dtStrFormat;
}

function GetDateStr(date, oldFormat, newFormat) {
    if (oldFormat == newFormat)
        return date;
        
    var dd = "";
    var mm = "";
    var yy = "";
    var dtStr = date.split("/");
    var newDt = "";
    
    if (oldFormat == "d/m/Y") {
        dd = dtStr[0];
        mm = dtStr[1];
        yy = dtStr[2];
    }
    else {
        dd = dtStr[1];
        mm = dtStr[0];
        yy = dtStr[2];
    }

    if (newFormat == "d/m/Y") {
        newDt = dd + "/" + mm + "/" + yy;
    }
    else {
        newDt = mm + "/" + dd + "/" + yy;
    }

    return newDt;
}

//Destination format is d/m/Y.
//function DateSaveFormat(date) {
//    if (dtCulture.toLowerCase() == "en-gb")
//        return date;
//    else if (dtCulture.toLowerCase() == "en-us") {
//        var newDt = GetDateStr(date, "m/d/Y", "d/m/Y");
//        return newDt;
//    }
//    else {
//        //needs to be handled
//    }
//}

//source date string is always in the d/m/Y format.
function DateDisplayFormat(date) {
    if (date == "")
        return date;
    if (dtCulture.toLowerCase() == "en-gb")
        return date;
    else if (dtCulture.toLowerCase() == "en-us") {
        //convert from d/m/Y to m/d/Y       
        var newDt = GetDateStr(date, "d/m/Y", "m/d/Y");
        return newDt;
    }
    else {
        //needs to be handled
    }
}

