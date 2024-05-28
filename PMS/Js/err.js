
$j(document).ready(function() {
    // adjustwin(window);
    SetBackForwardButtonProp(enableForwardButton, enableBackButton);
    callParentNew("closeFrame()", "function");
    checkSuccessAxpertMsg();
    $("#globalSearchinp", window?.parent?.document)?.val("");
});

