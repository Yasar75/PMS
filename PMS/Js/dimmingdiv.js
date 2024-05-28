
// global variables
var isMozilla;
var objDiv = null;
var originalDivHTML = "";
var DivID = "";
var over = false;
var Title = "";
var titleId = "";
var HideShow = "";
var calledFrm = "";
var BackgroundIsShown = false;
var allUsersSrcWin;
var isUserEditMode = false;

//
// dinamically add a div to 
// dim all the page
//
function buildDimmerDiv() {
    var title = document.title;
    if (title == "List IView") {
        document.write('<div id="dimmer" class="dimmer hide" style="width:90%; height:100%"></div>');
    }
    else {
        document.write('<div id="dimmer" class="dimmer hide" style="width:99%; height:100%"></div>');
    }

}

function displayEditWindow(divId, title, hideOrShow, Caldfrom) {
    if ($j('#chkLstRoEd_0').is(':checked')) {
        $j('#dvResList :checkbox').attr('disabled', true);
    }
    $j('#chkLstRoEd_0').attr('disabled', false);
    //To disable the form when dialog box is open
    ShowBackgroundFade();
    document.body.style.cursor = 'wait';
    var isEmptyCall = false;
    if (divId == "" && title == "" && hideOrShow == "" && Caldfrom == "")
        isEmptyCall = true;
    if (divId == "") {
        divId = DivID;
    }
    else {
        DivID = divId;
    }

    if (Caldfrom == "") {
        Caldfrom = calledFrm;
        if (divId == "dvEditResp") {

            var errorMsg = document.getElementById("lblDisErrMsg");
            var panel2 = document.getElementById("Panel2");
            var treeEditRes = document.getElementById("dvTreeEditRes");

            if (errorMsg.innerText == "") {
                panel2.style.height = "360px";
                treeEditRes.style.height = "305px";
            }
            else {
                panel2.style.height = "335px";
                treeEditRes.style.height = "285px";
            }
        } else if (divId == "dvEditRole") {
            var errorMsg = document.getElementById("lblDisErrMsg");
            var panel2 = document.getElementById("Panel2");
            var dvResList = document.getElementById("dvResList");

            if (errorMsg.innerText == "") {
                panel2.style.height = "330px";
                dvResList.style.height = "310px";
            }
            else {
                panel2.style.height = "305px";
                dvResList.style.height = "285px";

            }
        } else if (divId == "dvAddEditUser") {
            isUserEditMode = true;
            var usrRoles = document.getElementById("divUsRoles");
            var errorMsg = document.getElementById("lblDisErrMsg");
            var errMsg = "";
            if (errorMsg.innerText == undefined)
                errMsg = errorMsg.innerHTML;
            else
                errMsg = errorMsg.innerText;
            if (errMsg == "")
                usrRoles.style.height = "110px";
            else
                usrRoles.style.height = "140px";
        }

    }
    else {
        calledFrm = Caldfrom;
    }

    if (title == "") {
        title = Title;
    }
    else {
        Title = title;
    }

    var w, h, l, t;
    /*added the condition "Enableoldtheme" css to incraese the height of userpopup based on old and new css*/
    if ((calledFrm == "Role") || (calledFrm == "User")) {
        if (divId == "dvAddEditUser") {
            isUserEditMode = true;
            if (Enableoldtheme == "true") {
                w = 450;
                h = 515;
            }
            else {

                w = 450;
                h = 555;
            }

        }
        else {
            w = 500;
            h = 550;
        }
    }
    else {
        w = 450;
        h = 550;
    }

    l = screen.width / 4;

    if (Y != null) {
        t = Y;
    }
    else {
        t = (screen.height / 4) - 180;
    }

    if (HideShow != "" && hideOrShow == "")
        hideOrShow = HideShow;

    if (hideOrShow != undefined) {
        HideShow = hideOrShow;

    }
    if (divId != "") {
        document.getElementById('dimmer').style.visibility = "visible";
        var dv = document.getElementById(divId);

        dv.style.width = w + 'px';
        dv.style.height = h + 'px';
        dv.style.left = l + 'px';
        dv.style.top = t + 'px';

        var addHeader;

        originalDivHTML = dv.innerHTML;

        if (Caldfrom == "Resp" && isEmptyCall == true) {
            addHeader = '<table style="width:' + w + 'px" class="dvadminheader">' +
	            '<tr><td ondblclick="void(0);" onmouseover="over=true;" class="dvadminsubheader" onmouseout="over=false;" style="cursor:move;height:18px;">' + title + '</td>' +
	            '<td style="width:18px" align="right"><a href="javascript:hiddenFloatingDiv(\'' + divId + '\',\'close\');SetAutoComplete();void(0);adjustwin(window,600);">' +
	            '<img alt="Close" title="Close" src="../AxpImages/icons/close-button.png" border="0"></a></td></tr></table>';
        }
        else if (Caldfrom == "Resp" && isEmptyCall == false) {
            addHeader = '<table style="width:' + w + 'px" class="dvadminheader">' +
	            '<tr><td ondblclick="void(0);" onmouseover="over=true;" class="dvadminsubheader" onmouseout="over=false;" style="cursor:move;height:18px;">' + title + '</td>' +
	            '<td style="width:18px" align="right"><a href="javascript:hiddenFloatingDiv(\'' + divId + '\',\'close\');SetAutoComplete();void(0);adjustwin(window,600);">' +
	            '<img alt="Close" disabled=true title="Close" src="../AxpImages/icons/close-button.png" border="0"></a></td></tr></table>';

        }
        else {
            dv.style.top = '0px';
            addHeader = '<table style="width:' + w + 'px" class="dvadminheader">' +
	            '<tr><td ondblclick="void(0);" onmouseover="over=true;" class="dvadminsubheader" onmouseout="over=false;" style="cursor:move;height:18px">' + title + '</td>' +
	            '<td style="width:18px" align="right"><a href="javascript:hiddenFloatingDiv(\'' + divId + '\',\'close\');SetAutoComplete();void(0);adjustwin(window,600);">' +
	            '<img alt="Close" title="Close" src="../AxpImages/icons/close-button.png" border="0"></a></td></tr></table>';
        }

        // add to your div an header
        dv.innerHTML = addHeader + originalDivHTML;
        dv.className = 'dimming';
        dv.style.visibility = "visible";

        document.body.style.cursor = 'default';
    }
}

//function displayLviewWin(divid, title) {
//    var w, h, l, t;
//    w = 400;
//    h = 400;
//    if (X != null) {
//        l = X;
//    }
//    else {
//        l = screen.width / 2;
//    }

//    if (Y != null) {
//        t = Y;
//    }
//    else {
//        t = (screen.height / 2) - 150;
//    }
//    var newTitle = "";
//    if (title == "") {
//        title = Title;
//        newTitle = title;
//    }
//    else {
//        newTitle = title;
//    }

//    if (divid == "") {
//        divid = DivID;
//    }


//    // with title
//    displayFloatingDiv(divid, newTitle, w, h, l, t, "lstview");


//}


//
//function displayFloatingDiv(divId, title, width, height, left, top, frm) {
//    DivID = divId;
//    Title = title;
//    document.getElementById('dimmer').style.visibility = "visible";

//    document.getElementById(divId).style.width = width + 'px';
//    document.getElementById(divId).style.height = height + 'px';
//    document.getElementById(divId).style.left = left + 'px';
//    document.getElementById(divId).style.top = top + 'px';

//    var addHeader;

//    originalDivHTML = document.getElementById(divId).innerHTML;
//    if (frm != undefined && frm == "lstview") {
//        addHeader = '<table style="width:' + width + 'px" class="GridHead">' +
//	            '<tr><td ondblclick="void(0);" onmouseover="over=true;" onmouseout="over=false;" style="cursor:move;height:18px">' + title + '</td>' +
//	            '<td style="width:18px" align="right"><a href="javascript:hiddenFloatingDiv(\'' + divId + '\');void(0);">' +
//	            '<img alt="Close" title="Close" src="../AxpImages/icons/close-button.png" border="0"></a></td></tr></table>';
//    }
//    else {
//        addHeader = '<table style="width:' + width + 'px" class="GridHead">' +
//	            '<tr><td ondblclick="void(0);" onmouseover="over=true;" onmouseout="over=false;" style="cursor:move;height:18px">' + title + '</td>' +
//	            '<td style="width:18px" align="right"><a href="javascript:hiddenFloatingDiv(\'' + divId + '\');SetAutoComplete();void(0);">' +
//	            '<img alt="Close" title="Close" src="../AxpImages/icons/close-button.png" border="0"></a></td></tr></table>';
//    }

//    // add to your div an header	
//    document.getElementById(divId).innerHTML = addHeader + originalDivHTML;


//    document.getElementById(divId).className = 'dimming';
//    document.getElementById(divId).style.visibility = "visible";
//}


function HideDimmer() {

    document.getElementById('dimmer').style.visibility = 'hidden';

}


//
function MouseDown(e) {
    if (over) {
        if (isMozilla) {
            objDiv = document.getElementById(DivID);
            X = e.layerX;
            Y = e.layerY;
            return false;
        }
        else {
            objDiv = document.getElementById(DivID);
            if (objDiv != null) {
                objDiv = objDiv.style;
                X = event.offsetX;
                Y = event.offsetY;
            }
            return false;
        }
    }
}


//
function MouseMove(e) {
    if (objDiv) {
        if (isMozilla) {
            objDiv.style.top = (e.pageY - Y) + 'px';
            objDiv.style.left = (e.pageX - X) + 'px';
            return false;
        }
        else {
            objDiv.pixelLeft = event.clientX - X + document.body.scrollLeft;
            objDiv.pixelTop = event.clientY - Y + document.body.scrollTop;
            if (objDiv.pixelLeft < 0) {
                objDiv.pixelLeft = 10;
            }
            if (objDiv.pixelTop < 0) {
                objDiv.pixelTop = 15;
            }
            var ScrnWdt = screen.width * 0.8;

            if ((objDiv.pixelLeft) > (ScrnWdt - objDiv.pixelWidth)) {
                var pW1 = ScrnWdt - objDiv.pixelLeft;
                var pW2 = objDiv.pixelWidth - pW1;
                objDiv.pixelLeft = (objDiv.pixelLeft - pW2);
            }
            return false;
        }
    }
}

//
function MouseUp() {
    if (objDiv != null) {
        if (objDiv.pixelLeft < 0) {
            objDiv.pixelLeft = 10;
        }
        if (objDiv.pixelTop < 0) {
            objDiv.pixelTop = 15;
        }
        var ScrnWdt = screen.width * 0.8;

        if ((objDiv.pixelLeft) > (ScrnWdt - objDiv.pixelWidth)) {
            var pW1 = ScrnWdt - objDiv.pixelLeft;
            var pW2 = objDiv.pixelWidth - pW1;
            objDiv.pixelLeft = (objDiv.pixelLeft - pW2);
        }
        objDiv = null;
    }
}


//
function init() {
    // check browser
    isMozilla = (document.all) ? 0 : 1;


    if (isMozilla) {
        document.captureEvents(Event.MOUSEDOWN | Event.MOUSEMOVE | Event.MOUSEUP);
    }

    document.onmousedown = MouseDown;
    document.onmousemove = MouseMove;
    document.onmouseup = MouseUp;

    // add the div
    // used to dim the page
    buildDimmerDiv();

}

// call init
init();

function ShowBackgroundFade() {
    if (!BackgroundIsShown) {
        BackgroundIsShown = true;
        var divMsgBoxBackGroundId = "CoverBackGround";
        var divBackGround = "<div id=" + divMsgBoxBackGroundId + " class=\"coverBackGround\"></div>";
        var divMsgBoxBackGround;
        $j("html").append(divBackGround);
        divMsgBoxBackGround = $j("#" + divMsgBoxBackGroundId);
        divMsgBoxBackGround.css({ "width": $j(document).width(), "height": 1.5 * $j(document).height(), "margin-top": -200, "opacity": 0, "z-index": 0 });
        $j(divMsgBoxBackGroundId).fadeIn(0);
    }
}

function OpenPickList(ddlid, ddlBn, fname) {
    var left = (screen.width / 2) - (700 / 2);
    var top = (screen.height / 2) - (400 / 2);
    var na = "./srchComponent.aspx?search= &fldname=" + fname + "&transid= &fldxml=&pagename=workflow";
    try {
        allUsersSrcWin = window.open(na, "SaveWindow", "width=800,height=530,scrollbars=no,resizable=yes,top=" + top + ",left=" + left + "");
        window.parent.childWindowHandler.push(allUsersSrcWin);
    } catch (ex) {
        showAlertDialog("warning", eval(callParent('lcm[356]')));
    }
}

function SetSrcFromUserValue() {
    document.getElementById("hdnSrcUser").value = document.getElementById("SrcUser000F0").value;
    return true;
}
