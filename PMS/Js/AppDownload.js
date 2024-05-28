
$(document).ready(function () {
    $('input[name=versionSelection]').click(function () {
        if ($('input[name=versionSelection]:checked').val() != undefined)
            $(".dwnBtnWrapper").show();
        // alert($('input[name=versionSelection]:checked').val())
    })

    if ($(".radioBoxDwnloadWrapper .radio-inline  input").length == 1)
        OpenDownload($(".radioBoxDwnloadWrapper .radio-inline  input").val());

    checkSuccessAxpertMsg();
});
function OpenDownload(file1) {
    var files = "";
    if (file1 == undefined) {
        $.each($(".radioBoxDwnloadWrapper .radio-inline  input:checked"), function () {
            files += $(this).val() + "`";
        });
    }
    else
        files = file1;
    $("#hiddenfilenames").val(files);
    $("#btndwnload").click();

    panel1.style.display = "none";
    download.style.display = "block";
    var downloadButton = document.getElementById("timercount");
    var counter = 15;
    var newElement = document.createElement("p");
    var cutMsg = eval(callParent('lcm[1]'));
    newElement.innerHTML = cutMsg;
    var id;
    downloadButton.parentNode.replaceChild(newElement, downloadButton);

    id = setInterval(function () {
        counter--;
        if (counter < 0) {
            newElement.parentNode.replaceChild(downloadButton, newElement);
            clearInterval(id);
        } else {
            var cutMsgsec = eval(callParent('lcm[2]'));
            cutMsgsec = cutMsgsec.replace('{0}', counter.toString())
            newElement.innerHTML = cutMsgsec;
        }
    }, 1000);
    newElement.innerHTML = cutMsg;
}

//function BackToDownload() {
//    panel1.style.display = "block";
//    download.style.display = "none";

//}


