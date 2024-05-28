

function FilterHTML(str) {
    nohtml = /\<|>/g; // remove "<" and ">" from comments box
    return str.replace(nohtml, "");
}
        
// max number of characters allowed in the textbox

function CheckMaxInput(form) {
    if (form.comments.value.length > maxLen) {
        form.comments.value = form.comments.value.substring(0, maxLen);
        form.remLen.value = 0;
    }
    else
        form.remLen.value = maxLen - form.comments.value.length;
}

$(document).ready(function () {
    checkSuccessAxpertMsg();
});
