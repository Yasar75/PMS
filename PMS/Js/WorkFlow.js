
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
            showAlertDialog("error", 1018, "client");
        }
        return false;
    }
    else {
        return true;
    }
}

function LoadPopPage(poppath) {
    var loadPop;
    try {
        loadPop = window.open(poppath, "LoadPop", "width=800,height=600,resizable=1,scrollbars=yes");
    } catch (ex) {
        showAlertDialog("warning", eval(callParent('lcm[356]')));
    }
}

function OpenCondPopUp() {
    $j("#dvCondition").dialog({ title: "Add Condition", height: 300, width: 810, position: 'top', modal: true, buttons: { "Ok": function () { SaveCondition($j(this)); } } });
}

function EditCondPopUp() {
    if ($j("#hdnCondTxt").val() != "") {
        SetWFCondition($j("#hdnCondTxt").val());
    }
    OpenCondPopUp();
}

function ClearCond() {
    $j("#hdnCondTxt").val("");
    $j("#hdnDisplayCond").val("");
    $j("#hdnSubTypeCond").val("");
}

function SaveCondition(dialogObj) {
    var length = $j("#tblFilter tr").length;
    for (var row = 0; row * 2 <= length * 2; row++) {
        var nxtIndx = parseInt(row) * 2;
        if (!ValidatePreviousCondition(nxtIndx)) {
            var rowCount = parseInt(row) + 1;
            showAlertDialog("warning", 1019, "client", rowCount);
            return;
        }
    }
    SaveWFCondition();
    //hide the dvAddCond
    $j("#dvAddCond").hide();

    //show the dvDispCond
    $j("#dvDispCond").show();
    //set the condition to lblCond
    $j("#lblCond").text($j("#hdnDisplayCond").val());
    if (dialogObj != undefined)
        dialogObj.dialog("close");
}

function ShowNewRole() {
    //dvAddRole
    $j("#dvShowRoles").hide();

    var intCounter = 0;
    var chkBox = $j("#ChkMandatory");
    for (var i = 0; i < $j("#ddlRole")[0].length; i++) {
        if ($j("#ddlRole")[0].options[i].selected == true)
            intCounter = intCounter + 1;
    }
    if (intCounter > 1) {
        chkBox.attr("disabled", false);
        chkBox.parent().attr("disabled", false);
    }
    else {
        chkBox.attr("disabled", true);
        chkBox.parent().attr("disabled", true);
        chkBox.attr("checked", false);
    }
    $j("#dvAddRole").show();
    $j("#hdnDisplayCond").val($j("#lblCond").text());
    adjustwin(window);
}

function SaveRole(dialogObj) {
    if (dialogObj != undefined)
        dialogObj.dialog("close");
    $j("#btnCreateWF").click();
}

function ActionChanged() {
    var drpDown = $j("#gvWorkFlow").find('select')[2];
    var selectedAction = $j("#" + drpDown.id).val();
    $j("#ActionSelectedValue").val(selectedAction);
}
$j(document).ready(function () {
    checkSuccessAxpertMsg();

    //$('#chkpredefinedcomments').click(function () {
    //    if ($(this).is(':checked')) {
    //        var curFrame = $(window.frameElement);
    //        var wfurl = curFrame[0].src;
    //        var wfName = workflowId;
    //        if (typeof wfName != "undefined" && wfName != "" && wfTransid != "") {
    //            curFrame[0].src = "tstruct.aspx?transid=axpwf&stransid=" + wfTransid + "&wfid=" + wfName;
    //        }
    //        else {
    //            showAlertDialog("error", "Workflow name should be nt empty.");
    //            $(this).prop('checked', false);
    //        }
    //    }
    //});
});

function AddPreComments() {
    if ($('#chkpredefinedcomments').is(':checked')) {
        var curFrame = $(window.frameElement);
        var wfurl = curFrame[0].src;
        var wfName = workflowId;
        if (typeof wfName != "undefined" && wfName != "" && wfTransid != "") {
            curFrame[0].src = "tstruct.aspx?act=open&transid=axpwf&stransid=" + wfTransid + "&wfid=" + wfName;
        }
        else {
            showAlertDialog("error", "Workflow name should not empty.");
            $(this).prop('checked', false);
        }
    }
    else
        showAlertDialog("warning", "Please select the checkbox.");
}


