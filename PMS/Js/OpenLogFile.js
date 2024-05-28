$j(document).ready(function () {
    // ChangeTheme(window);
    checkSuccessAxpertMsg();
    closeRemodalPopupOnEsc();
    setTimeout(IFrameModalDialogTabEvents(""), 1000);
});

$(document).keydown(function (e) {
    if (e.which == 27) {
        if ($(parent.$('.modal .close') != undefined))
            $(parent.$('.modal .close')).click();
    }
})

function ifTraceNdf()
{
    var x = document.getElementById('gvLogfiles');
    x.innerHTML = "No data found";
    $('#gvLogfiles').css({ 'fontSize': 'initial', 'border': '0px', 'margin-top': '0px' });
}
  