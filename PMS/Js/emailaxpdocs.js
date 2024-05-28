
function subValues() {
    var b = document.form1.elements.length;
    var eleval = "";
    for (i = 0; i < b; i++) {
        if (document.form1.elements[i].type == "checkbox") {
            if (document.form1.elements[i].checked) {
                if (eleval == "")
                { eleval = document.form1.elements[i].value; }
                else
                { eleval = eleval + ';' + document.form1.elements[i].value; }
            }
        }
    }

    window.opener.document.f1.reldocs.value = eleval;
    window.close();
}

$(document).ready(function () {
    checkSuccessAxpertMsg();
});
