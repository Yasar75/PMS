//fileupload.aspx



$j(document).ready(function (e) {
    $('#filMyFile').bind({
        change: function () {
            var filename = $("#filMyFile").val();
            var uploadControl = $('#filMyFile')[0].files;
            if (uploadControl.length > 0)
                $("#lblnofilename").text(uploadControl[0].name);
           
            if (/^\s*$/.test(filename)) {
                $(".file-upload").removeClass('active');
                var cutMsg = eval(callParent('lcm[66]'));
                $("#noFile").text(cutMsg);
            }
            else {
                $(".file-upload").addClass('active');
                $("#noFile").text(filename.replace("C:\\fakepath\\", ""));
            }
            if (ValidateFileExtension(filename, "file") == true) {
                $('#fileuploadsts').val();
                $('#cmdSend').prop('disabled', false);
                $(".file-upload").addClass('active');
                $("#noFile").text(filename.replace("C:\\fakepath\\", ""));
            }
            else {
                $("#fileuploadsts").text("[" + eval(callParent('lcm[305]')) + "]");
                $('#cmdSend').prop('disabled', true);
                ResetFileUploadProperties();
            }

        }
    }
    )
    
    // ChangeTheme();
    checkSuccessAxpertMsg();
    closeRemodalPopupOnEsc();
    validateFilesize();
    setTimeout(function () {
        IFrameModalDialogTabEvents("file-select");
    }, 500);
        $("#filMyFile").focus();
});

//window.onunload = function (e) {
//    DoClientFunction();
//};

function DoClientFunction() {
    var fn = $j("#fname");
    var filename = fn.val();
    var upl = $j("#upsts");
    var succ = upl.val();
    var act = $("#hdnAction")[0];
    if (succ == "Uploaded Successfully") {

        if (act.value == "attach") {
            parent.document.getElementById("attachfname").value = filename;
            parent.document.getElementById("afterfattach").click();
            setTimeout(function () { closeUploadDialog(); }, 300);
        }
        else {
            parent.document.getElementById("cb_sactbu").value = filename;
            parent.document.getElementById("cafterfload").click();
            setTimeout(function () { closeUploadDialog(); }, 300);
        }
    }
    else {
        closeUploadDialog();
    }
}

function CloseClick() {
    parent.closeModalDialog();
}

function ChangeTheme() {
    //var theme = $j("#DropDownList1 option:selected", window.parent.document).text();

    theme = parent.parent.currentThemeColor;


    if (theme != "") {
        $j("#themecss").attr('href', "../App_Themes/" + theme + "/Stylesheet.min.css?v=23");
    }
    else {
        var themeref = "";
        if (parent) {
            themeref = $j("#themecss", parent.document).attr("href");
            if (themeref != "") {
                $j("#themecss").attr("href", themeref);
            }
        }
        if (parent.parent.document) {
            themeref = $j("#themecss", parent.parent.document).attr("href");
            if (themeref != "") {
                $j("#themecss").attr("href", themeref);
            }
        }
        if (themeref == "" || themeref == undefined) {
            themeref = "../App_Themes/" + axTheme + "/Stylesheet.min.css?v=23";
            $j("#themecss").attr("href", themeref);
        }
    }
}

$(document).keydown(function (e) {
    if (e.which == 27) {
        if ($(parent.$('.modal .close') != undefined))
            $(parent.$('.modal .close')).click();
    }
})
    
function closeUploadDialog() {
    if ($(parent.$('.modal .close') != undefined) && $(parent.$('.modal .close')).length)
        $(parent.$('.modal .close')).click();
    else {
        try{
            window.parent.closeRemodalPopup();
        }catch(ex){}
    }
}