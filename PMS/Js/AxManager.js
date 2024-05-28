

$j(document).ready(function () {
    $j("#projName").focus();
    FillAxManager();
    HandelLoad();
    checkSuccessAxpertMsg();
});
function HandelLoad() {
    Sys.WebForms.PageRequestManager.getInstance().add_endRequest(FillAxManager);
}
