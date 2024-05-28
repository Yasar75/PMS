
$j(document).ready(function () {
    BindEventFirefox();
    checkSuccessAxpertMsg();
});
function countRolesChecked() {
    var count = $j("#grdRoLstRoles input[type=radio]:checked").length;
    if (count == 0) {
        var cutMsg = eval(callParent('lcm[50]'));
        ShowInfoMsg(cutMsg);
        return false;
    }
    else if (count != 1) {
        var cutMsg = eval(callParent('lcm[51]'));
        ShowErrorMsg(cutMsg);
        return false;
    }
    else {
        ShowBackgroundFade();
        SetGoCall('Copy'); adjustwin(window, 600);
        return true;
    }
}

function EndRequestHandler(sender, args) {
    if (args.get_error() == undefined) {
        var hdn = $j("#hdnIsSearched").val();
        var ErrMessageToDisplay = $j("#roleErr");
        var SuccessMessageToDisplay = $j("#roleSuccess");
        if (hdn == "Edit") {
            displayEditWindow('dvEditRole', 'Add/Edit Roles', 'show', 'Role');
        }
        else if (hdn == "Copy") {
            displayEditWindow('dvEditRole', 'Add/Edit Roles', 'show', 'Role');
            if (ErrMessageToDisplay.val() != undefined && ErrMessageToDisplay.val() != "") {
                ShowErrorMsg(ErrMessageToDisplay.val());
                HideBackgroundFade();
            }
            if (SuccessMessageToDisplay.val() != undefined && SuccessMessageToDisplay.val() != "") {
                ShowSuccessMsg(SuccessMessageToDisplay.val());
                $j("input.msgButton").click(function (e) {
                    e.preventDefault();
                    hiddenFloatingDiv('dvEditRole', 'close', 'success');
                });
            }
        }
        else if (hdn == "Delete") {
            displayEditWindow('', '', '', '');
            if (ErrMessageToDisplay.val() != undefined && ErrMessageToDisplay.val() != "") {
                ShowErrorMsg(ErrMessageToDisplay.val());
                HideBackgroundFade();
            }
            if (SuccessMessageToDisplay.val() != undefined && SuccessMessageToDisplay.val() != "") {
                ShowSuccessMsg(SuccessMessageToDisplay.val());
                $j("input.msgButton").click(function (e) {
                    e.preventDefault();
                    hiddenFloatingDiv('dvEditRole', 'close', 'success');
                });
            }
        }
        else if (hdn == "UpdateRole") {
            displayEditWindow('', '', '', '');
            document.body.style.cursor = 'default';
            if (ErrMessageToDisplay.val() != undefined && ErrMessageToDisplay.val() != "") {
                if (!$j("#dvEditRole").is(':visible'))
                    displayEditWindow('', '', '', '');
                ShowErrorMsg(ErrMessageToDisplay.val());
            }
            if (SuccessMessageToDisplay.val() != undefined && SuccessMessageToDisplay.val() != "") {
                ShowSuccessMsg(SuccessMessageToDisplay.val());
                $j("input.msgButton").click(function (e) {
                    e.preventDefault();
                    hiddenFloatingDiv('dvEditRole', 'close', 'success');
                });
            }
        }
        else if (hdn == "Search") {
            if (!$j("#dvEditRole").is(':visible'))
                hiddenFloatingDiv('dvEditRole', 'close', 'success');
            if (ErrMessageToDisplay.val() != undefined && ErrMessageToDisplay.val() != "")
                ShowErrorMsg(ErrMessageToDisplay.val());
            if (SuccessMessageToDisplay.val() != undefined && SuccessMessageToDisplay.val() != "") {
                ShowSuccessMsg(SuccessMessageToDisplay.val());
                $j("input.msgButton").click(function (e) {
                    e.preventDefault();
                    hiddenFloatingDiv('dvEditRole', 'close', 'success');
                });
            }
        }
        $j("input.msgButton").click(function (e) {
            e.preventDefault();
            if (!$j("#dvEditRole").is(':visible'))
                hiddenFloatingDiv('dvEditRole', 'close', 'success');
        });
        ShowDimmer(false);
        $j("#roleSuccess").val('');
        $j("#roleErr").val('');
        $j("#hdnIsSearched").val('');
        document.body.style.cursor = 'default';
    }
    else {
        document.body.style.cursor = 'default';
        window.location.href = window.location.href;
    }
}
function load() {
    Sys.WebForms.PageRequestManager.getInstance().add_endRequest(EndRequestHandler);
}



