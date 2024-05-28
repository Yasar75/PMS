function OpenPickList(ddlid, ddlBn, fname) {
    // var ddl = document.getElementById(ddlid);
    // var ddlvalue = ddl.options[ddl.selectedIndex].value;
    //ddlvalue = ddlvalue.replace(new RegExp("&", "g"), "amp;");
    //var ddlBN = document.getElementById(ddlBn);
    //var ddlBNvalue = ddlBN.options[ddlBN.selectedIndex].value;
    // ddlBNvalue = ddlBNvalue.replace(new RegExp("&", "g"), "amp;");
    var calledfrom = "workflow";
    var left = (screen.width / 2) - (700 / 2);
    var top = (screen.height / 2) - (400 / 2);
    var na = "./srchComponent.aspx?search= &fldname=" + fname + "&transid= &fldxml=&pagename=workflow";
    window.open(na, "SaveWindow", "width=800,height=530,scrollbars=no,resizable=yes,top=" + top + ",left=" + left + "").focus();
}

function SetSrcFromUserValue() {
    document.getElementById("hdnSrcUser").value = document.getElementById("SrcUser000F0").value;
    return true;
}

function SetDesUserValue() {
    document.getElementById("hdnDesUser").value = document.getElementById("DesUser000F0").value;
    return true;
}

function CheckAll() {

    grdView = window.document.getElementById('<%=grdTasks.ClientID %>');

    chkBox = window.document.getElementById('chkAll');

    if (chkBox.checked) {
        var checkBoxes = window.document.getElementsByName('chkSelect');
        var SelectedValue = "";

        for (i = 0; i <= checkBoxes.length - 1; i++) {
            SelectedValue += (i + 1) + ",";
            checkBoxes[i].checked = true;
        }
        SelectedValue = SelectedValue.substring(0, SelectedValue.length - 1);
        window.document.getElementById('<%=hdnSelectedValues.ClientID %>').value = SelectedValue;
    }
    else {
        var checkBoxes = window.document.getElementsByName('chkSelect');

        for (i = 0; i <= checkBoxes.length - 1; i++) {
            checkBoxes[i].checked = false;
        }
        window.document.getElementById('<%=hdnSelectedValues.ClientID %>').value = "";
    }

}

function GetSelectedRecordValues() {
    grdView = window.document.getElementById('<%=grdTasks.ClientID %>');
    var checkBoxes = window.document.getElementsByName('chkSelect');
    var SelectedValue = "";
    var nCnt = 0;

    for (i = 0; i <= checkBoxes.length - 1; i++) {
        if (checkBoxes[i].checked) {
            nCnt += 1;
            SelectedValue += (i + 1) + ",";
        }
    }
    SelectedValue = SelectedValue.substring(0, SelectedValue.length - 1);
    window.document.getElementById('<%=hdnSelectedValues.ClientID %>').value = SelectedValue;

    if (nCnt == checkBoxes.length) {

        window.document.getElementById('chkAll').checked = true;
    }
    else {

        window.document.getElementById('chkAll').checked = false;
    }
}

function ClearUserInfo() {
    document.getElementById("hdnDesUser").value = "";
    document.getElementById("DesUser000F0").value = document.getElementById("hdnDesUser").value;
}

function ClearGrdData() {

    var pnl = document.getElementById('<%=pnlGrd.ClientID %>');
    var hdnTasks = document.getElementById('<%=hdnSelectedValues.ClientID %>');
    var hdnUser = document.getElementById('<%=hdnSrcUser.ClientID %>');

    hdnTasks.value = "";
    hdnUser.value = "";
    document.getElementById("SrcUser000F0").value = "";
}

function ValidateDupTasks() {
    var isDesUserEmpty = SetDesUserValue();
    var hdnUser = document.getElementById("DesUser000F0");
    var i = 0;
    var grd = document.getElementById('<%=grdTasks.ClientID %>');
    var checkBoxes = window.document.getElementsByName('chkSelect');
    var SelectedValue = "";
    var nCnt = 0;
    var toUser = document.getElementById("DesUser000F0");
    var isDup = false;
    for (i = 0; i <= checkBoxes.length - 1; i++) {
        if (checkBoxes[i].checked) {
            nCnt += 1;
            if (grd.rows[i + 1].cells[2].childNodes[0].innerText == toUser.value) {
                grd.rows[i + 1].cells[0].childNodes[0].checked = false;
                isDup = true;
            }
        }
    }
    if (isDup == true || isDesUserEmpty == false) {
        if (isDup == true) {
            chkBox = window.document.getElementById('chkAll');
            chkBox.checked = false;
            hdnUser.value = "";
            document.getElementById("hdnDesUser").value = "";
            showAlertDialog("error", 1026, "client");
        }
        return false;
    }
    else {
        return true;
    }
}

function LoadPopPage(poppath) {
    var loadPop;
    try{
        loadPop = window.open(poppath, "LoadPop", "width=800,height=600,resizable=1,scrollbars=yes");
    } catch (ex) {
        showAlertDialog("warning", eval(callParent('lcm[356]')));
    }
}
$j(document).ready(function () {
    checkSuccessAxpertMsg();
});
