function dwbTstructFieldsInit(){
   
   if(callParentNew("isDWB") && iName == "mainrepo"){
    //$("span.clsDCChild").parents("tr").addClass("hide");

    $("button.clsDCToggle").on("click", function () {
        var dcparent = $(this).parents("tr").find("span.clsDCParent").text();
        var dcchildtr = $("span[parent=" + dcparent + "]").parents("tr");

        $(dcchildtr).each(function (index) {
            $(dcchildtr[index]).toggleClass('hide');
        });
        return false;
    });

    splitNSeparateFormEleDetails();
}
}

function splitNSeparateFormEleDetails() {
    var originalText = $(".clsDetails p:contains(Hidden:True)");
    $(originalText).each(function (index) {
        $(originalText[index]).parents("tr").addClass("hiddenInputField");
    });
}