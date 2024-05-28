function GetSelValue() {
        document.getElementById("ivtype").value = document.getElementById("cb_saveas").value;
    }
function OpenHtml() {
    var left = (screen.width / 2) - (350 / 2);
    var top = (screen.height / 2) - (150 / 2);
    var hlpPath = "../aspx/htmliv.aspx";
    try{
    wOpen = window.open(hlpPath, "HelpFile", "width=350,height=150,resizable=yes,scrollbars=yes,top=" + top + ",left=" + left + "");
    wOpen.focus();
    wOpen.moveTo(0, 0);
    wOpen.resizeTo(screen.availWidth, screen.availHeight);
    return wOpen;
    } catch (ex) {
        showAlertDialog("warning", eval(callParent('lcm[356]')));
        return "";
    }
}

$j(document).ready(function () {
    checkSuccessAxpertMsg();
});
