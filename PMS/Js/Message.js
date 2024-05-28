$j(document).ready(function () {
    // ChangeTheme(window);
    setDocht();
    SetBackForwardButtonProp(enableForwardButton, enableBackButton);
    commonReadyTasks();
});

function ChangeDir(dir) {
    $j("#form1").attr("dir", dir);
}
