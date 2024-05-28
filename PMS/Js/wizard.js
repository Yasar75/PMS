$(document).ready(function () {
    // ChangeTheme();
    //Initialize tooltips
    $('.nav-tabs > li a[title]').tooltip();
    
    //Wizard
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {

        var $target = $(e.target);
        var tabId = $target[0].id.slice(1);
        if(tabId != '')
            $("#" + tabId).find('input,select').filter(':visible:first').focus();
    });
    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {

        var $target = $(e.target);
        if ($target.hasClass('fromExportStep3')) {
            if (!$target.parent().hasClass('disabled')) {
                var activeTab = $("#ulExportTab li.active a").attr("id");
                var resultFromSave = SaveCondition();
                if (!resultFromSave) {
                    if (activeTab == "astep1") {
                        $("#Expli2 a").click();
                        prevDataFilter();
                    }
                    return false;
                }                  
            }                      
        }
        if ($target.hasClass('fromExportComplete')) {
            if (!$target.parent().hasClass('disabled'))
            {
                var resultFromSaveCond = SaveCondition();           
            if (resultFromSaveCond)
            {               
                var resultFromSave = ForIconClickComplete();
                if (!resultFromSave) {
                    $("#Expli3 a").click();
                    return false;
                }               
            }
            else {
                $("#Expli2 a").click();
                return false;
            }
         }
        }

        if ($target.hasClass('fromImportComplete')) {
            var resultFromSave = clickOnIcon();
            if (!resultFromSave) {
                var activeTab = $("#ulImportTab li.active a").attr("id");
                if (activeTab == "ImportStep1") {
                    $("#li2 a").click();                 
                } 
                    return false;                             
            }
        }
        if ($target.hasClass('FromImportEdit')) {
            $("#filMyFile").val("");
            $("#noFile").text("No file chosen...");
            $(".fileUploadErrorMessage").text("");
            $("#UploadButton").attr('disabled', true);
        }
        if ($target.parent().hasClass('disabled')) {
            return false;
        }
    });

    $(".next-step").click(function (e) {
        var $active = $('.wizard .nav-tabs li.active');
        $active.next().removeClass('disabled');
        $active.next().find('span').removeClass("disabled").prop("disabled", false);
        nextTab($active);

    });
    $(".prev-step").click(function (e) {
        var $active = $('.wizard .nav-tabs li.active');
        prevTab($active);

    });
});

function nextTab(elem) {
    $(elem).next().find('a[data-toggle="tab"]').click();
}
function prevTab(elem) {
    $(elem).prev().find('a[data-toggle="tab"]').click();
    if ($(elem).prev().attr("id") == "Expli1")
        prevDataSearch();
    if ($(elem).prev().attr("id") == "Expli2")
        prevDataFilter();
    if ($(elem).prev().attr("id") == "Expli3")
        preFileType();
}
//Function to show the dimmer on the background.
function ShowDimmer(status) {

    DimmerCalled = true;
    var dv = $j("#waitDiv");

    if (dv.length > 0 && dv != undefined) {
        if (status == true) {

            var currentfr = $j("#middle1", parent.document);
            if (currentfr) {
                //  dv.height(currentfr.height());
                dv.width(currentfr.width());
            }
            dv.show();
            document.onkeydown = function EatKeyPress() { return false; }
        }
        else {
            dv.hide();
            document.onkeydown = function EatKeyPress() { if (DimmerCalled == true) { return true; } }
        }
    }
    else {
        //TODO:Needs to be tested
        if (window.opener != undefined) {
            dv = $j("#waitDiv", window.opener.document);
            if (dv.length > 0) {
                if (status == true)
                    dv.show();
                else
                    dv.hide();
            }
        }
    }
    DimmerCalled = false;
}

function closeParentFrame() {
    try {
        eval(callParent('closeFrame()', 'function'));
    }
    catch (ex) {
        console.log("Error in CloseParentFrame -" + ex.message);
    }
}

function callParent(name, type) {
    var hirarchy = "window.parent";
    var maxParentToCheck = 10;
    var reachedCntPlcHlder = false;
    try {
        for (var i = 0; i < maxParentToCheck; i++) {
            if (!reachedCntPlcHlder && checkForCntPlcHldrFrame(hirarchy)) {
                reachedCntPlcHlder = true;
            } else if (reachedCntPlcHlder) {
                break;
                return false;
            }
            if (type == "id" || type == "class") {
                var byName = "";
                type == "id" ? byName = "Id" : byName = "sByClassName";
                if (eval(hirarchy + ".document.getElementBy" + byName + "('" + name + "')") == null) {
                    hirarchy = hirarchy + ".parent";
                    continue;
                } else {
                    return hirarchy + ".document";
                    break;
                }
            } else {
                if (type == 'function') {
                    var fParams = name.substr(name.indexOf('(') + 1, name.indexOf(')')).slice(0, -1);
                    var checkName = name.substr(0, name.indexOf('('));
                    //tst.substr(tst.indexOf('(') + 1, tst.indexOf(')')).slice(0, -1)

                } else {
                    checkName = name;
                }
                if (typeof eval(hirarchy + "." + checkName) == 'undefined') {
                    hirarchy = hirarchy + ".parent";
                    continue;
                } else {
                    if (type == 'function') {
                        return fParams == "" ? hirarchy + "." + checkName + "()" : hirarchy + "." + checkName + "('" + fParams + "')";
                    } else {
                        return hirarchy + "." + name;
                    }
                }
            }
        }
    } catch (ex) {
        console.log(ex.message);
    }

}

function checkForCntPlcHldrFrame(hirarchy) {
    return eval(hirarchy + ".leftMenuWrapper") != undefined ? true : false;
}
function ChangeTheme() {
    var theme = "";
    theme = eval(callParent('currentThemeColor'));
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