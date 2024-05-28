var appSettings = {};
(function () {
    //making an ajaxcall to get the object appSettings;
    $j.ajax({
        type: "POST",
        url: "Configuration.aspx/LoadUserAppSettings",
        async: false,
        data: "",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var res = response.d;
            //$(x).find('USERAPPSETTINGS').html()
            var $xmlDoc = $.parseXML(res),
            $xml = $($xmlDoc),
            $appSettingsString = $($xml).find('APPSETTINGS').html();
            if ($appSettingsString)
                appSettings = JSON.parse($appSettingsString);
        },
        failure: function (response) {
            alert(response.d);
        }
    });
})();
var oldAppSettings = jQuery.extend(true, {}, appSettings);
$(document).ready(function () {
    //window.parent.closeFrame();
    eval(callParent("closeFrame()", "function"));
    // ChangeTheme();
    checkForAppSettings();
    $(".appSettingsChkBx").change(function (e) {
        createAppSettingObject(e.target.id, e.target.checked);
    });
    $("#appSettingSlct").change(function () {
        $(this).find("option:selected").each(function () {
            var optionValue = $(this).attr("value");
            if (optionValue) {
                $(".box").not("." + optionValue).hide();
                $("." + optionValue).show();
            } else {
                $(".box").hide();
            }
        });
    }).change();


});



function createAppSettingObject(idOfChkBox, isChecked) {
    //if (appSettings.size == undefined) {
    //    appSettings.size = 0;
    //}
    //if (eval("appSettings." + idOfChkBox) == undefined) {
    //    eval("appSettings." + idOfChkBox + " = " + isChecked);
    //    appSettings.size = appSettings.size + 1;
    //} else {
    //    eval("appSettings." + idOfChkBox + " = " + isChecked);
    //}
    eval("appSettings." + idOfChkBox + " = " + isChecked);
}

function checkForAppSettings() {
    //appSettings
    var appSetObjKeys = Object.keys(appSettings);
    if (appSetObjKeys.length > 0) {
        for (var i = 0; i < appSetObjKeys.length; i++) {
            $("#" + appSetObjKeys[i]).prop('checked', eval("appSettings." + appSetObjKeys[i]));
        }
    }
}

function saveAppSettings() {
    $j("#hdnUserSettings").val(JSON.stringify(appSettings));
    //need to make an ajaxcall by sending the object appSettings;
    //$j.ajax({
    //    type: "POST",
    //    url: "Configuration.aspx/SaveUserAppSettings",
    //    async: false,
    //    data: JSON.stringify({ ress: JSON.stringify(appSettings) }),
    //    contentType: "application/json; charset=utf-8",
    //    dataType: "json",
    //    success: function (response) {
    //        return true;
    //    },
    //    failure: function (response) {
    //        alert(response.d);
    //        showAlertDialog("failure", "Configurations saved successfully. But, something went wrong in User Settings save. Please try again!");
    //        return false;
    //    }
    //});
}

function cancelAppSettings() {
    //need to revert the changes of appSettings object and redirect back
    //appSettings = Object.assign({}, oldAppSettings);
    $.extend(appSettings, oldAppSettings);
    //window.document.location.href = "./HomePage.aspx";
}
function ChangeTheme() {
    var theme = "";
    theme = window.parent.currentThemeColor;
    if (theme != "") {
        $j("#themecss").attr('href', "../App_Themes/" + theme + "/Stylesheet.min.css?v=23");
    }
    else {
        var themeref = "";
        if (window.opener) {
            themeref = $j("#themecss", window.opener.document).attr("href");
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
