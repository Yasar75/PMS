
      function validate(obj1, obj2, obj3, obj4, obj5) {

    var err = "";
    if (obj1[obj1.selectedIndex].value == 0)
        err += eval(callParent('lcm[141]'));

    if (obj2[obj2.selectedIndex].value == 0)
        err += eval(callParent('lcm[142]'));

    if (obj3[obj3.selectedIndex].value == 0)
        err += eval(callParent('lcm[143]'));;

    if (obj4[obj4.selectedIndex].value == 0)
        err += eval(callParent('lcm[144]'));;

    if (obj5[obj5.selectedIndex].value == 0)
        err += eval(callParent('lcm[141]'));;

    if (err != "")
        showAlertDialog("warning", err);
}

function CheckNumeric(evt, val) {

    var charCode = (evt.which) ? evt.which : event.keyCode
    var sLen = val.length;
    if ((charCode == 46) && (sLen > 0)) { charCode = 49; }
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}

function OpenPickList(ddlid, fname) {
    var ddl = document.getElementById(ddlid);
    var ddlvalue = ddl.options[ddl.selectedIndex].value;
    var calledfrom = "workflow";
    var left = (screen.width / 2) - (700 / 2);
    var top = (screen.height / 2) - (400 / 2);
    var na = "../aspx/srchComponent.aspx?search= &fldname=" + fname + "&transid= &fldxml=&unit=" + ddlvalue + "&pagename=workflow";
    window.open(na, "SaveWindow", "width=800,height=530,scrollbars=no,resizable=yes,top=" + top + ",left=" + left + "").focus();
}

function GetSrcUserValue() {
    if (document.getElementById("txtSrcUser").value != "") {
        document.getElementById("SrcUser").value = document.getElementById("txtSrcUser").value;
    }
}

function SetSrcUserValue() {
    if (document.getElementById("SrcUser").value == "") {
        showAlertDialog("warning", 1020, "client");
        return false;
    }
    else {
        document.getElementById("txtSrcUser").value = document.getElementById("SrcUser").value;
        return true;
    }
}

function SetDesUserValue() {
    if (document.getElementById("DestUser").value == "") {
        showAlertDialog("warning", 1020, "client");
        return false;
    }
    else {
        document.getElementById("hdnDestUser").value = document.getElementById("DestUser").value;
        return true;
    }

}

function GetDestUserValue() {
    if (document.getElementById("hdnDestUser").value != "") {
        document.getElementById("DestUser").value = document.getElementById("hdnDestUser").value;
    }
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
    document.getElementById("hdnDestUser").value = "";
    document.getElementById("DestUser").value = document.getElementById("hdnDestUser").value;
}

function ClearGrdData() {

    var pnl = document.getElementById('<%=pnlGrd.ClientID %>');
    var hdnTasks = document.getElementById('<%=hdnSelectedValues.ClientID %>');
    var hdnUser = document.getElementById('<%=txtSrcUser.ClientID %>');

    if (pnl != null) {
        pnl.style.display = "none";
    }
    hdnTasks.value = "";
    hdnUser.value = "";
    document.getElementById("SrcUser").value = "";
}


function ValidateChanges() {
    var nCnt = 0;
    grdView = window.document.getElementById('<%=grdTasks.ClientID %>');
    var checkBoxes = window.document.getElementsByName('chkSelect');
    for (i = 0; i <= checkBoxes.length - 1; i++) {
        if (checkBoxes[i].checked) {
            nCnt += 1;
        }
    }

    if (nCnt > 0) {
        return confirm("Unsaved Data Exists.Are you sure you want to Navigate?");
    }
    else {
        return true;
    }
}

function ValidateDupTasks() {
    var isDesUserEmpty = SetDesUserValue();
    var hdnUser = document.getElementById("DestUser");
    var i = 0;
    var grd = document.getElementById('<%=grdTasks.ClientID %>');
    var checkBoxes = window.document.getElementsByName('chkSelect');
    var SelectedValue = "";
    var nCnt = 0;
    var toUser = document.getElementById("DestUser");
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
            document.getElementById("hdnDestUser").value = "";
            showAlertDialog("error", 1021, "client");
        }
        return false;
    }
    else {
        return true;
    }
}

function DisplaySelectedRows() {
    var i = 0;
    var selectedRows = document.getElementById('<%=hdnSelectedValues.ClientID %>').value;
    var grd = document.getElementById('<%=grdTasks.ClientID %>');
    if (selectedRows != "") {
        var selArray = selectedRows.split(",");
        for (i = 0; i < selArray.length; i++) {
            grd.rows[selArray[i]].cells[0].childNodes[0].checked = true;
        }
    }
}

$j(document).ready(function () {
    checkSuccessAxpertMsg();
});

