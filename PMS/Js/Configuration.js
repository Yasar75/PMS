var addRowsCount;
var enableAutoCom, actionBtnPos;
var arrAppResp = [];
var isFormDirty = false;
function disableElements() {
    $j('.Config-contBX').find('input').attr('disabled', 'true');
    $j('.Config-contBX').find('textarea').attr('disabled', 'true');
    $j("#btnSave").attr('disabled', 'true');
}

//function loadDefaultValues() {
//    var cutMsg = eval(callParent('lcm[75]'));
//    if (confirm(cutMsg)) {
//        window.location.href = "Configuration.aspx?reStoreDefault=true";
//    }
//}

//tab foucus method for individual wizard tab by passing first & last focus ids once tab is loaded
function navTabFocus(firstFocusId, lastFocusId, tabDivContentId) {
   // modalButton = eval(callParent("btnModalClose", "id") + ".getElementById('btnModalClose')");
    //if (modalButton.className.indexOf("firstFocusable") == -1)
    //    modalButton.className += " firstFocusable";
    $(".lastFocusable").removeClass("lastFocusable");
    if (firstFocusId == "menu6Header")
        lastFocusId = "btnSave";
    $("#" + lastFocusId).addClass("lastFocusable").focus();
    $(".lastFocusable").on('keydown.tabRot', function (e) {
        if ((e.which === 9 && !e.shiftKey)) {
            e.preventDefault();
           // modalButton.focus();
        }
    });

    //modalButton.addEventListener('keydown', function (e) {
    //    if ((e.which === 9 && e.shiftKey)) {
    //        e.preventDefault();
    //        $(".lastFocusable").focus();
    //    }
    //});
    setTimeout(function () {
        var elemntsToCheck = 'button[tabindex!="-1"],input[tabindex!="-1"],select[tabindex!="-1"],radio[tabindex!="-1"], ul, .swtchDummyAnchr';
        var inputs = $('#' + tabDivContentId).find(elemntsToCheck).filter(':visible').not(':disabled');
        firstInput = inputs.first();
        firstInput.focus();
    }, 300)
}

//to check if the form is dirty before closing
function checkIfFormChanges() {
    $('input[type="text"], input[type="radio"], input[type="checkbox"], select').each(function (key) {
        if (!isFormDirty && $(this).hasClass('dirty')) {
            isFormDirty = true;
        }
    });
    return isFormDirty;
}

//to display confirm dialog while unloading the form only if form inputs changes
function ConfirmLeave() {
    if ($(".jconfirm").length > 0) {
        $(".jconfirm").remove();
    }
    else {
        var glType = eval(callParent('gllangType'));
        var isRTL = false;
        if (glType == "ar")
            isRTL = true;
        else
            isRTL = false;
        var ConfirmSaveCB = $.confirm({
            theme: 'modern',
            title: eval(callParent('lcm[155]')),
            animation: 'scale',
            closeAnimation: 'scale',
            animateFromElement: false,
            onContentReady: function () {
                disableBackDrop('bind');
                //to display tooltips for Confirm & Cancel buttons
                $(".jconfirm-buttons button").each(function () {
                    var txt = $(this).text();
                    $(this).prop('title', txt.charAt(0).toUpperCase() + txt.slice(1))
                });
                $(".jconfirm-buttons .hotbtn").focus(); //to focus on Confirm button once dialog is opened
            },
            backgroundDismiss: 'false',
            escapeKey: 'cancel',
            rtl: isRTL,
            content: eval(callParent('lcm[292]')),
            buttons: {
                confirm: {
                    text: eval(callParent('lcm[164]')),
                    btnClass: 'btn btn-primary',
                    action: function () {
                        ConfirmSaveCB.close();
                       // parent.closeModalDialog();
                        parent.checkIfAnyActionPerformed();
                        cancelAppSettings();
                    }
                },
                cancel: {
                    text: eval(callParent('lcm[192]')),
                    btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                    action: function () {
                       // disableBackDrop('destroy');
                        parent.actionsClicked = "";
                    },
                }
            }
        });
    }
}

function EnableEdit() {
    $j('.Config-contBX').find('input').removeAttr('disabled');
    $j('.Config-contBX').find('textarea').removeAttr('disabled');
    $j("#btnSave").removeAttr('disabled');
}
function showSuccess() {
    //window.status = eval(callParent('lcm[79]'));;
    ////$j.msgBox({
    ////    title: "Save",
    ////    content: "Configuration Details Added Successfully.Please re-login to the application .",
    ////    type: "info"
    ////},50);
    showAlertDialog("success", 1038, "client");
}

function AddRoles() {
    try {
        ASB.WebService.GetRoles(OnSuccessRoles);
    }
    catch (e) { }
}

function OnSuccessRoles(response) {
    var xmlDoc = $j.parseXML(response);
    var tblRowCount = 16;
    $j("#imgAdd").css('display', 'none');
    AddTableRows(xmlDoc, tblRowCount);

}

function AddTableRows(xmlDoc, tblRowCount) {
    var tbl = document.getElementById("tblGeneral");
    var row = tbl.insertRow(tblRowCount);
    var option = "option";
    addRowsCount = 1;
    row.id = "AddRow";
    var elemAdd = "<img src='../AxpImages/icons/16x16/Add.png' id='imgAddPage' class='handCursor' onclick='AddPage();'>";
    var elemDelete = "<img src='../AxpImages/icons/16x16/delete.png' id='imgDelete' class='handCursor' onclick='DeleteLandingPage();'>";
    var cell1 = row.insertCell(0);
    var elem2 = "Role : ";
    var cell2 = row.insertCell(1);
    var elem3 = document.createElement("select");
    elem3.id = "selectRole";
    elem3.className = "cnt-Roles";

    for (idx = 0; idx < $j(xmlDoc).find("res").length; idx++) {
        if ($j(xmlDoc).find("res")[idx].innerHTML == undefined)
            sRoles = $j(xmlDoc).find("res")[idx].textContent;
        else
            sRoles = $j(xmlDoc).find("res")[idx].innerHTML;

        var elem4 = "Page Name : ";
        cell1.innerHTML = "<span class='cnt-Rolelabel'>" + elemAdd + " " + elemDelete + " " + elem2 + " ";

        var options = option + idx;
        options = document.createElement("option");
        options.text = sRoles;
        elem3.appendChild(options);

    }
    cell1.appendChild(elem3);
    var txtelem1 = '<input type ="text" runat ="server" width = "300px" id ="txtRoleLandPage" onchange="GetPageName();"/>';
    cell2.innerHTML = "<div class= 'cnt-Select'>" + elem4 + txtelem1 + "(Tstruct/Iview/DashBoard)</div>";

}
function DeleteLandingPage() {

    var imgDelBtn = document.getElementById("imgDelete");
    $j(imgDelBtn).closest('tr').remove();
    addRowsCount--;
    if (addRowsCount <= 0) {
        $j("#imgAdd").css('display', 'block');
        $j("#imgAdd").css('margin-left', '320px');
        $j("#imgAdd").css('margin-top', '-10px');
    }

}
function AddPage() {

    var imgAddBtn = document.getElementById("imgAddPage");
    $j(imgAddBtn).closest('tr').clone(true).insertAfter("#AddRow");
    addRowsCount++;

}
function GetPageName() {
    var lndPage = $j('#txtRoleLandPage').val();
    var hdnPage = $j("#hdnLandingPages").val();
    var hdnRole = $j("#hdnRoleName").val();
    if ($j("#hdnLandingPages").val() != "")
        $j("#hdnLandingPages").val(hdnPage + "~" + lndPage);
    else
        $j("#hdnLandingPages").val(lndPage);
    var selectedRole = $j('#selectRole').find("option:selected").text();
    if (hdnRole != "")
        $j("#hdnRoleName").val(hdnRole + "~" + selectedRole);
    else
        $j("#hdnRoleName").val(selectedRole);
}

var waitDialogUntilFormLoad = true;
$(document).ready(function () {
    
    
   
    
    var lang = capitalizeFirstLetter($j("#hdnLanguage").val());
    if ($j("#hdnAxLangSrc").val() != "")
    var otherLang = capitalizeFirstLetter($j("#hdnAxLangSrc").val());
    var arrLangs = [];
    arrLangs.push(lang);
    if ($j("#hdnAxLangSrc").val() != "")
    arrLangs.push(otherLang);
   // arrLangs = [capitalizeFirstLetter(arrLangs)];
    //arrLangs.push(lang);
    $("#langSelect").select2({
        data: arrLangs
    });
    if (lang.toLowerCase() == 'english' && $j("#hdnAxLangSrc").val() == "")
        $("#langSelect").attr('disabled', 'true');
    PopulateLangConfigs();
    //to set dialog header dynamically based on language selection
    // modalHeader = eval(callParent("divModalHeader", "id") + ".getElementById('divModalHeader')");
    // modalHeader.innerText = eval(callParent('lcm[258]'));
    $(".swtchDummyAnchr").on("keydown", function (e) {
        if (e.keyCode === 13 || e.keyCode === 32) {
            $(this).find('input.tgl').click();
        }
    })
    //enable error message check
    $("#enableErrorMsgText").change(function () {
        var selected = $(this).is(":checked");
        if (selected) {
            $("#divErrorTimeOut").show();

        }
        else
            $("#divErrorTimeOut").hide();
    });


    //add text & title properties for the Save & Restore buttons
    $("#btnSave").prop({ 'value': eval(callParent('lcm[200]')), 'title': eval(callParent('lcm[200]')) });
    $("#btnRestore").prop({ 'value': eval(callParent('lcm[246]')), 'title': eval(callParent('lcm[246]')) });
    $("#btnUnlock").prop({ 'value': eval(callParent('lcm[386]')), 'title': eval(callParent('lcm[386]')) });

    //to set title properties for the tab menus(Applications, Forms, Menus, Reports...)
    $(".confignav li").each(function () {
        $(this).prop("title", ($(this).find("span").text()));
    }).click(function () {
        //input focus elements for indivisual tab inputs
        $(".confignav li").each(function () {
            $(this).removeClass("firstFocusable");
        });
        navTabFocus($(this).attr("data-menu-id"), "btnRestore", $(this).attr("data-div-id")); // set tab focus events for indivisual tab menu's
    })

    //GetIviewRowCount this configuration is made default and is overridden in iview.aspx.cs and forcefully making it false until required
    //if ($("#chkGetIviewRowCount").prop("checked") == true) {
    //    $("#txtIviewDataWSRows").parents(".form-group").hide();
    //    $("#txtMaxRowsToPrint").parents(".form-group").show();
    //} else {
    //    $("#txtIviewDataWSRows").parents(".form-group").show();
    //    $("#txtMaxRowsToPrint").parents(".form-group").hide();
    //}
    //$("#chkGetIviewRowCount").on("change", function () {

    //    if ($("#chkGetIviewRowCount").prop("checked") == true) {
    //        $("#txtIviewDataWSRows").parents(".form-group").hide();
    //        $("#txtMaxRowsToPrint").parents(".form-group").show();
    //    } else {
    //        $("#txtIviewDataWSRows").parents(".form-group").show();
    //        $("#txtMaxRowsToPrint").parents(".form-group").hide();
    //    }
    //});

    SetLangFromAxLangSrc();

    navTabFocus("menu1Header", "btnRestore", "home");

    $(window).keydown(function (event) {
        if ($(event.target).closest("a").length == 0)
            if (event.keyCode == 13) {
                //if any confirm dialog is opened then allow user to press enter key on Confirm/Cancel buttons
                if ($(".jconfirm").length > 0) {
                    return true;
                }
                else {
                    //we are preventing enter key on the window, if user clicks on Save/Restore Defaults buttons then this button should allow click action - doing it manually
                    if ($(event.target).hasClass("allow-enter-key")) //added 'allow-enter-key' only to Save/Restore Defaults buttons
                        $(event.target).click();
                    event.preventDefault();
                    return false;
                }
            }
    });


    //$('[data-toggle=popover]').each(function () {
    //    // hide any open popovers when the anywhere else in the body is clicked
    //    if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
    //        $(this).popover('hide');
    //    }
    //});

    //if any change make it field dirty
    $('input[type="text"], input[type="radio"], input[type="checkbox"], select').each(function (key) {
        $(this).change(function () {
            $(this).addClass('dirty');
        });
    });

    checkSuccessAxpertMsg();
    //if (parent.gllangType === "ar") {
    if (callParentNew("gllangType") === "ar") {
        $('head').append('<link rel="stylesheet" href="../ThirdParty/bootstrap_rtl.min.css" type="text/css" />');
        $('[data-toggle=popover]').each(function () {
            $(this).data('placement', 'left');
        });
    }
    // ChangeTheme();

    //Node service not using in 11 version
    //if (callParentNew("nodeApi")) {
    //    var GetAxResponsibilities = {
    //        "async": true,
    //        "crossDomain": true,
    //        "url": AxApiUrl + "getallresponsibilities",
    //        "method": "POST",
    //        "headers": {
    //            "content-type": "application/x-www-form-urlencoded"
    //        },
    //        "data": {
    //            "session_id": callParentNew("mainSessionId"),// parent.mainSessionId,
    //            "utl": callParentNew("utl"),// parent.utl,
    //            "username": callParentNew("mainUserName"),// parent.mainUserName,
    //            "authorization": callParentNew('nodeAccessToken'),
    //            "appSKey": appsessionKey
    //        }
    //    }
    //    $.ajax(GetAxResponsibilities).done(function (response) {
    //        SuccessGetAxResponsibilities(response);
    //    }).fail(function (jqXHR, textStatus, errorThrown) {
    //        showAlertDialog("error", 1000, "client");
    //    });
    //} else {
    //    $("#liDeveloper").hide();
    //}

    SetConfigVals();

    $('body').on('click', function (e) {
        $('[data-toggle=popover]').each(function () {
            // hide any open popovers when the anywhere else in the body is clicked
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                $(this).popover('hide');
            }
        });
    });

    $("[data-toggle=popover]").mousedown(function () {
        // toggle popover when link is clicked
        $(this).popover('toggle');
    });

    //$("[data-toggle=popover]").draggable({
    //    stop: function () {
    //        // show popover when drag stops
    //        $(this).popover('show');
    //    }
    //});

    $j("ul.nav-tabs li a").click(function () {
        if (!CheckRequiredFields()) return false;

        if ($(this).attr("href") == "#menu5") {
            $j("#btnRestore").css("display", "none");
        } else {
            $j("#btnRestore").removeAttr("style");
        }
    });

    $j("ul.nav-tabs li a#tabGlobe").click(function () {
        PopulateLangConfigs();
    });

    $("#langSelect").on("change", function () {
        PopulateLangConfigs()
    });

    $("#langSelect").on('focus', function () {
        var langCode = this.value.toUpperCase().substring(0, 3);
        SetLangConfigs(langCode);
    });

    enableAutoCom = $('#hdnIsPerfCode').val();
    actionBtnPos = $('#showSubmitCancel').val();

    //menu related stuff
    $("#axMenuStyleSel").change(function () {
        if ($(this).val() === "custom") {
            //axCustomMenuInfo
            $("#axCustomMenuInfo").find("input").prop("disabled", false);
            $("#axCustomMenuInfo").find("select").prop("disabled", false);
            $("#axCustomMenuInfo").find("#lblaxMenuWrapText").removeClass('tglSwtchdisabled');
        } else {
            $("#axCustomMenuInfo").find("input").prop("disabled", true);
            $("#axCustomMenuInfo").find("select").prop("disabled", true);
            $("#axCustomMenuInfo").find("#axMenuColCount").val("3")
            $("#axCustomMenuInfo").find("#axMenusubCntPerView").val(6).prop("disabled", true);
            $("#axCustomMenuInfo").find("#axMenuWrapText").prop({ "disabled": true, "checked": true });
            $("input[name='axMenuSubmenuCnt']:eq(1)").prop("checked", true)
            $("input[name='axMenuSubmenuCnt']:eq(1)").parents(".radio").find(".menuInlineInpFld").val(4)
            $("input[name='axMenuDirSubmenuCnt']:eq(1)").prop("checked", true)
            $("input[name='axMenuDirSubmenuCnt']:eq(1)").parents(".radio").find(".menuInlineInpFld").val(6);
            $("#axCustomMenuInfo").find("#lblaxMenuWrapText").addClass("tglSwtchdisabled");
            $j("#axMenuWrapText").prop('checked', false);
        }


    })
    $("#axMenuColCount").change(function () {
        $("#axMenusubCntPerView").val($(this).val() * 2);

    })
    $("input[name='axMenuDirSubmenuCnt'],input[name='axMenuSubmenuCnt']").change(function () {
        var elem = $(this);
        if (elem.val() === "all") {
            elem.parents(".radio").next().find("input.menuInlineInpFld").prop("disabled", true);
        } else {
            elem.parents(".radio").find("input.menuInlineInpFld").prop("disabled", false);
        }

    })
    //Setting Default for Menu 
    if ($("#axMenuStyleSel").val() !== "custom") {
        //$("#axMenuStyleSel").val("default").change();
        $("#axCustomMenuInfo").find("input").prop("disabled", true);
        $("#axCustomMenuInfo").find("select").prop("disabled", true);
        $("#axCustomMenuInfo").find("#axMenuColCount").val("3")
        $("#axCustomMenuInfo").find("#axMenusubCntPerView").val(6).prop("disabled", true);
        $("#axCustomMenuInfo").find("#axMenuWrapText").prop({ "disabled": true, "checked": true });
        $("input[name='axMenuSubmenuCnt']:eq(1)").prop("checked", true)
        $("input[name='axMenuSubmenuCnt']:eq(1)").parents(".radio").find(".menuInlineInpFld").val(4)
        $("input[name='axMenuDirSubmenuCnt']:eq(1)").prop("checked", true)
        $("input[name='axMenuDirSubmenuCnt']:eq(1)").parents(".radio").find(".menuInlineInpFld").val(6);
        $("#axCustomMenuInfo").find("#lblaxMenuWrapText").addClass("tglSwtchdisabled");
        $j("#axMenuWrapText").prop('checked', false);
    }
    $("#axMenusubCntPerView").blur(function () {
        var axMenusubCntPerView = $('#axMenusubCntPerView').val();
        if (axMenusubCntPerView <= 1 || axMenusubCntPerView > 99) {
            $('#axMenusubCntPerView').val('');
            $('#axMenusubCntPerView').val($("#axMenuColCount").val() * 2)
        }
    });
    $("#txtDirSubMenuCnt").blur(function () {
        var txtDirSubMenuCnt = $('#txtDirSubMenuCnt').val();
        if (txtDirSubMenuCnt < 1 || txtDirSubMenuCnt > 99) {
            $("#txtDirSubMenuCnt").val(10);
        }
    });
    $("#txtSubMenuCnt").blur(function () {
        var txtSubMenuCnt = $('#txtSubMenuCnt').val();
        if (txtSubMenuCnt < 1 || txtSubMenuCnt > 99) {
            $("#txtSubMenuCnt").val(10);
        }
    });
    $(".panel-title a").click(function () {
        var expand = $(this).attr('aria-expanded');
        if (expand === "true") {
            $(this).attr("title", "Expand")
        }
        else {
            $(this).attr("title", "Hide")
        }
    });
    $('#UploadAppImg').change(function () {
        var Filename = $('#UploadAppImg');
        var filesize = Filename["0"].files["0"].size / 1024 / 1024;
        var ext = $('#UploadAppImg').val().split('.').pop().toLowerCase();
        if (ext == "mp4" || ext == "webm") {
            if (filesize > 10) {
                showAlertDialog("warning", eval(callParent('lcm[306]')));
                $('#UploadAppImg').val("");
            }
            else {
                $('#lblnofile').text(Filename[0].value);
                //$('#lblnofile').val(Filename[0].value);
            }
        }
        else
            if (filesize > 5) {
                showAlertDialog("warning", eval(callParent('lcm[304]')));
                $('#UploadAppImg').val("");
            } else {
                if ($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg', 'mp4']) == -1) {
                    showAlertDialog("warning", eval(callParent('lcm[305]')));
                    $('#UploadAppImg').val("");
                } else {
                    $('#lblnofile').text(Filename[0].value);
                    //$('#lblnofile')[0].textContent = Filename[0].value;
                    //$('#lblnofile').val(Filename[0].value);
                }
            }
    });
    $('#UploadAppLogoImg').change(function () {
        var File = $('#UploadAppLogoImg');
        var size = File[0].files["0"].size / 1024 / 1024;
        var ext = $('#UploadAppLogoImg').val().split('.').pop().toLowerCase();
        if (size > 1) {
            showAlertDialog("warning", eval(callParent('lcm[82]')));
            $('#UploadAppLogoImg').val("");
        } else {
            if ($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg']) == -1) {
                showAlertDialog("warning", eval(callParent('lcm[305]')));
                $('#UploadAppLogoImg').val("");
            } else {
                $('#lblnofile3').text(File[0].value);
                //$('#lblnofile3')[0].textContent = File[0].value;
                //$('#lblnofile3').val(File[0].value);
            }
        }
    });
    $('#UploadAppMobImg').change(function () {
        var File = $('#UploadAppMobImg');
        var size = File[0].files["0"].size / 1024 / 1024;
        var ext = $('#UploadAppMobImg').val().split('.').pop().toLowerCase();
        if (size > 1) {
            showAlertDialog("warning", eval(callParent('lcm[82]')));
            $('#UploadAppMobImg').val("");
        } else {
            if ($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg']) == -1) {
                showAlertDialog("warning", eval(callParent('lcm[305]')));
                $('#UploadAppMobImg').val("");
            } else {
                $('#lblnofile2').text(File[0].value);
                //$('#lblnofile2')[0].textContent = File[0].value;
                //$('#lblnofile2').val(File[0].value);
            }
        }
    });

    //Not allow First character as space
    $("#txtCopyRightText").on("keypress", function (e) {
        if (e.which === 32 && !this.value.length)
            e.preventDefault();
        var copyRightTxt = $("#txtCopyRightText").val();
        if (copyRightTxt[0] == " ") {
            $("#txtCopyRightText").val($.trim($("#txtCopyRightText").val()));
        }
    });

    setTimeout(function () {
        waitDialogUntilFormLoad = false;
    }, 250)


    $('[data-toggle=popover]').popover({
        trigger: 'manual',
    });
    $('[data-toggle=popover]').on('mouseenter', function (e) {
        $(this).popover('show');
    });
    //$('[data-toggle=popover]').on('mouseleave', function (e) {
    //    $('[data-toggle=popover]').popover("destroy");
    //});

    if (lockPage != undefined && lockPage.toLowerCase() == "true")
        LockConfigPage();

    $("#enableErrorMsgText").change(function () {
        var selected = $(this).is(":checked");
        if (selected) {
            $("#divErrorTimeOut").show();
            $("#txtErrorTimeout").focus();

        }
        else
            $("#divErrorTimeOut").hide();
    })

});

function SetLangFromAxLangSrc() {
    var axLangSrc = $j("#hdnAxLangSrc").val();
    if (axLangSrc.length > 0) {

        var langHTML = ""
        var i = 0;
        var arrLangSrc = axLangSrc.split(",");

        for (i = 0; i < arrLangSrc.length; i++) {
            langHTML += `<div class="form-group form-switch form-check form-check-custom form-check-solid col-md-6">
                <span class="form-check-label form-label col-form-label pb-1 fw-boldest ms-0">${capitalizeFirstLetter(arrLangSrc[i])}</span>
                <a href="javascript:void(0);" class="form-check form-switch form-check-solid ms-auto m-0 ps-0 py-4">
                    <input type="checkbox" class="form-check-input ms-3 w-40px h-25px" name="optLang" value="${arrLangSrc[i].toLowerCase()}" />
                </a>
            </div>`;
            
            // langHTML += "<div class='checkbox my-3 form-check form-switch form-check-solid ms-auto m-0 ps-0 py-4'><a><span class='form-check-label form-label col-form-label pb-1 fw-boldest ms-0'>" + capitalizeFirstLetter(arrLangSrc[i]) + "</span><input type='checkbox' class='form-check-input ms-3 w-40px h-25px' name='optLang' value='" + arrLangSrc[i].toLowerCase() + "'></a></div>";
        }
        $j("#dvLangs").append(langHTML);
    }
    else {
        $('input[name=optLang]').filter('[value="english"]').prop("checked", true).attr("disabled", true);
    }
}

function SetLangConfigs(langCode) {
    if (langCode != "" && $j("input[name=" + langCode + "]").length == 3) {
        $j("input[name=" + langCode + "]")[0].value = $j("#txtAppTitle").val();
        $j("input[name=" + langCode + "]")[1].value = $j("#txtCopyRightText").val();
        $j("input[name=" + langCode + "]")[2].value = $j("#txtPrintTitle").val();
    }
}

function ConstructLangVals() {
    var langVals = "";
    $j('#dvLangInputs').children('input').each(function () {
        var elem = $j(this);
        if (langVals == "")
            langVals = elem.attr('id') + ":" + elem.val();
        else
            langVals += "♦" + elem.attr('id') + ":" + elem.val();
    });
    $j("#hdnLangVals").val(langVals);
}

function PopulateLangConfigs() {
    ConstructLangInputs();

    var strLang = $j("#langSelect").find("option:selected").val();
    var langCode = strLang.toUpperCase().substring(0, 3);
    if (langCode != "") {
        $j("#txtAppTitle").val($j("input[name=" + langCode + "]")[0].value);
        $j("#txtCopyRightText").val($j("input[name=" + langCode + "]")[1].value);
        $j("#txtPrintTitle").val($j("input[name=" + langCode + "]")[2].value);
    }
}

function ConstructLangInputs() {
    var strChkLang = GetSelectedLang().toString();
    var arrKeys = $j("#hdnLangKeys").val().split('♦');
    var langHTML = ""
    var idx = 0, i = 0;
    for (idx = 0; idx < strChkLang.split(',').length; idx++) {
        langCode = strChkLang.split(',')[idx].toUpperCase().slice(0, 3);
        for (i = 0; i < arrKeys.length; i++) {
            var keyID = arrKeys[i].split(':')[0].toString() + "_" + langCode;
            var keyVal = arrKeys[i].split(':')[1].toString();
            if (!$j("input#" + keyID).length)
                langHTML += "<input type='hidden' id='" + keyID + "' name='" + langCode + "' value='" + keyVal + "' />"
        }
    }
    $j("#dvLangInputs").append(langHTML);
}

function SetMenuVal() {
    $('#rdoMenu').val($('input[name=optMenu]:checked').val());
}

function GetSelectedLang() {
    var selLangs = "";
    $('input[name=optLang]:checked').each(function () {
        if (selLangs == "")
            selLangs = $(this).val();
        else
            selLangs += "," + $(this).val();
    });
    return selLangs;
}

function GetSelectedLangText() {
    var selLangsText = "";
    $('input[name=optLang]:checked').each(function () {
        if (selLangsText == "")
            selLangsText = capitalizeFirstLetter($(this).val());
        else
            selLangsText += "," + capitalizeFirstLetter($(this).val());
    });
    return selLangsText;
}

function GetConfigVals() {
    ShowDimmer(true);
    TrimWhiteSpaces();
    try {
        $('#hdnTrace').val($('input[name=optTrace]:checked').val());
        $('#hdnMenu').val($('input[name=optMenu]:checked').val());
        //$('#hdnBreadcrumb').val($('input[name=optBcrum]:checked').val());
        $j("#hdnBreadcrumb").val($j("#optBcrum").prop("checked").toString());

        if ($j("#enableCardsText").prop("checked") == true) {
            $j("#hdnEnableCards").val("true");
            // $("#lblenableCardsText").addClass("toggelcustom");
        }
        else {
            $j("#hdnEnableCards").val("false");
            //$("#lblenableCardsText").removeClass("toggelcustom");
        }
        // error message value 
        if ($j("#enableErrorMsgText").prop("checked") == true) {
            $j("#hdnEnableErrorMsg").val("true");
        }
        else {
            $j("#hdnEnableErrorMsg").val("false");
            $("#txtErrorTimeout").val(0);
        }
        //to show buttons
        if ($j("#showSubmitCancel1").prop("checked") == true) {
            $j("#showSubmitCancel").val("true");
        }
        else {
            $j("#showSubmitCancel").val("false");

        }

        if ($j("#ckbEnabledDraft").prop("checked") == true) {
            $j("#hdnEnableDrafts").val("true");
        }
        else {
            $j("#hdnEnableDrafts").val("false");
        }

        if ($j("#ckbAutoPurge").prop("checked") == true) {
            $j("#hdnAutoPurge").val("true");
        }
        else {
            $j("#hdnAutoPurge").val("false");
        }

        if ($j("#chkAutoSavePublish").prop("checked") == true) {
            $j("#hdnAutoSavePublish").val("true");
        }
        else {
            $j("#hdnAutoSavePublish").val("false");
        }

        //$('#hdnTallyExport').val($('input[name=optTally]:checked').val());
        if ($j("#enabletallyText").prop("checked") == true)
            $j("#hdnTallyExport").val("true");
        else
            $j("#hdnTallyExport").val("false");
        //$('#hdnCPOFL').val($('input[name=optCPWD]:checked').val());
        if ($j("#enablelblcpwdText").prop("checked") == true)
            $j("#hdnCPOFL").val("true");
        else
            $j("#hdnCPOFL").val("false");
        //$('#hdnSessExt').val($('input[name=optSessExt]:checked').val());
        if ($j("#enablelblsessText").prop("checked") == true)
            $j("#hdnSessExt").val("true");
        else
            $j("#hdnSessExt").val("false");

        if ($j("#allowTimezone").prop("checked") == true)
            $j("#hdnAllowTimeZone").val("true");
        else
            $j("#hdnAllowTimeZone").val("false");

        $("#enablelSplit").prop("checked") ? $j("#hdnDisableSplit").val("true") : $j("#hdnDisableSplit").val("false");

        $('#hdnActSess').val($('input[name=optActSess]:checked').val());
        $('#hdnLanguage').val(GetSelectedLang());

        $("#optUserLang").prop("checked") ? $j("#hdnUserLevelLang").val("true") : $j("#hdnUserLevelLang").val("false");

        $('#hdnCulture').val($('input[name=optCulture]:checked').val());
        if ($j("#enableDevInstance").prop("checked") == true)
            $j("#hdnDevInstance").val("true");
        else
            $j("#hdnDevInstance").val("false");
        //$('#hdnAutoGen').val($('input[name=optAutoGen]:checked').val());
        if ($j("#enableautognrText").prop("checked") == true)
            $j("#hdnAutoGen").val("true");
        else
            $j("#hdnAutoGen").val("false");
        //$('#hdnIsPerfCode').val($('input[name=optPerf]:checked').val());
        if ($j("#enablelblslctText").prop("checked") == true)
            $j("#hdnIsPerfCode").val("true");
        else
            $j("#hdnIsPerfCode").val("false");
        //$('#hdnDcGridOnSave').val($('input[name=optDcGrid]:checked').val());
        if ($j("#enableoptdcgridText").prop("checked") == true)
            $j("#hdnDcGridOnSave").val("true");
        else
            $j("#hdnDcGridOnSave").val("false");
        $('#hdnIsPrintExe').val($('input[name=optexe]:checked').val());
        //$('#hdnTextWrap').val($('input[name=optWrap]:checked').val());
        if ($j("#enabletextwrapc5Text").prop("checked") == true)
            $j("#hdnTextWrap").val("true");
        else
            $j("#hdnTextWrap").val("false");
        $('#hdnDbPagination').val($('input[name=optDbP]:checked').val());
        //$('#hdnShowAppTitle').val($('input[name=optTitlePrint]:checked').val());
        if ($j("#enabletitledwn").prop("checked") == true)
            $j("#hdnShowAppTitle").val("true");
        else
            $j("#hdnShowAppTitle").val("false");
        if ($j("#enablestripedreport").prop("checked") == true)
            $j("#hdnShowstripedreport").val("true");
        else
            $j("#hdnShowstripedreport").val("false");
        //GetIviewRowCount this configuration is made default and is overridden in iview.aspx.cs and forcefully making it false until required
        //if ($j("#chkGetIviewRowCount").prop("checked") == true)
        //    $j("#hdnGetIviewRowCount").val("true");
        //else
        //    $j("#hdnGetIviewRowCount").val("false");

        $('#hdnPrintMargins').val($('#pmleft').val() + ',' + $('#pmright').val() + ',' + $('#pmtop').val() + ',' + $('#pmbottom').val());

        var selDesignerResp = "";
        $j('#ms-designerResp .ms-elem-selection.ms-selected').each(function () {
            if (selDesignerResp == "")
                selDesignerResp = $(this).find("span")[0].innerHTML.trim();
            else
                selDesignerResp += "," + $(this).find("span")[0].innerHTML.trim();;
        });
        $('#hdnDesignerResp').val(selDesignerResp);

        var selHomeBuildResp = "";
        $j('#ms-homeBuildResp .ms-elem-selection.ms-selected').each(function () {
            if (selHomeBuildResp == "")
                selHomeBuildResp = $(this).find("span")[0].innerHTML.trim();
            else
                selHomeBuildResp += "," + $(this).find("span")[0].innerHTML.trim();;
        });
        $('#hdnHomeBuildResp').val(selHomeBuildResp);
        GetMenuVals();

        if (enableAutoCom != $('#hdnIsPerfCode').val() || actionBtnPos != $('#showSubmitCancel').val())
            FlushRedisKeys();
    }
    catch (ex) {
        console.log(ex.message);
    }
}

function GetMenuVals() {
    var subMenuVal = $('input[name=axMenuSubmenuCnt]:checked').val();
    if (subMenuVal == "all")
        $j("#hdnSubMenuCount").val("all");
    else
        $j("#hdnSubMenuCount").val($j("#txtSubMenuCnt").val());

    var dirSubMenuVal = $('input[name=axMenuDirSubmenuCnt]:checked').val();
    if (dirSubMenuVal == "all")
        $j("#hdnDirSubMenuCount").val("all");
    else
        $j("#hdnDirSubMenuCount").val($j("#txtDirSubMenuCnt").val());

    var wrap = $j("#axMenuWrapText").prop("checked");
    if (wrap == true)
        $j("#hdnMenuWrapText").val("true");
    else
        $j("#hdnMenuWrapText").val("false");
}

function SetConfigVals() {
    try {
        $('input[name=optTrace]').filter('[value="' + $('#hdnTrace').val() + '"]').prop('checked', true);
        $('input[name=optMenu]').filter('[value="' + $('#hdnMenu').val() + '"]').prop('checked', true);
        //$('input[name=optBcrum]').filter('[value="' + $('#hdnBreadcrumb').val() + '"]').prop('checked', true);
        // $('input[name=optCards]').filter('[value="' + $('#hdnEnableCards').val() + '"]').prop('checked', true);

        $j("#optBcrum").prop('checked', $("#hdnBreadcrumb").val() == "true");

        if ($("#hdnEnableCards").val() == "true") {
            $j("#enableCardsText").prop('checked', true);
            // $("#lblenableCardsText").addClass("toggelcustom");
        }
        else {
            $j("#enableCardsText").prop('checked', false);
            //$("#lblenableCardsText").removeClass("toggelcustom");
        }
        if ($("#hdnEnableErrorMsg").val() == "true") {
            $j("#enableErrorMsgText").prop('checked', true);
            $j("#divErrorTimeOut").show();
        }
        else {
            $j("#enableErrorMsgText").prop('checked', false);
            $j("#divErrorTimeOut").hide();
        }
        if ($("#showSubmitCancel").val() == "true") {
            $j("#showSubmitCancel1").prop('checked', true);

        }
        else {
            $j("#showSubmitCancel1").prop('checked', false);

        }
        if ($("#hdnEnableDrafts").val() == "true") {
            $j("#ckbEnabledDraft").prop('checked', true);
            // $("#lblenableCardsText").addClass("toggelcustom");
        }
        else {
            $j("#ckbEnabledDraft").prop('checked', false);
            //$("#lblenableCardsText").removeClass("toggelcustom");
        }

        if ($("#hdnAutoPurge").val() == "true") {
            $j("#ckbAutoPurge").prop('checked', true);
            // $("#lblenableCardsText").addClass("toggelcustom");
        }
        else {
            $j("#ckbAutoPurge").prop('checked', false);
            //$("#lblenableCardsText").removeClass("toggelcustom");
        }

        if ($("#hdnAutoSavePublish").val() == "true") {
            $j("#chkAutoSavePublish").prop('checked', true);
        }
        else {
            $j("#chkAutoSavePublish").prop('checked', false);
        }

        //$('input[name=optTally]').filter('[value="' + $('#hdnTallyExport').val() + '"]').prop('checked', true);
        if ($j("#hdnTallyExport").val() == "true")
            $j("#enabletallyText").prop('checked', true);
        else
            $j("#enabletallyText").prop('checked', false);
        //$('input[name=optCPWD]').filter('[value="' + $('#hdnCPOFL').val() + '"]').prop('checked', true);
        if ($j("#hdnCPOFL").val() == "true")
            $j("#enablelblcpwdText").prop('checked', true);
        else
            $j("#enablelblcpwdText").prop('checked', false);
        //$('input[name=optSessExt]').filter('[value="' + $('#hdnSessExt').val() + '"]').prop('checked', true);
        if ($j("#hdnSessExt").val() == "true")
            $j("#enablelblsessText").prop('checked', true);
        else
            $j("#enablelblsessText").prop('checked', false);

        if ($j("#hdnAllowTimeZone").val() == "true")
            $j("#allowTimezone").prop('checked', true);
        else
            $j("#allowTimezone").prop('checked', false);

        $("#hdnDisableSplit").val() == "true" ? $j("#enablelSplit").prop('checked', true) : $j("#enablelSplit").prop('checked', false);

        $('input[name=optActSess]').filter('[value="' + $('#hdnActSess').val() + '"]').prop('checked', true);
        var strLang = $('#hdnLanguage').val();
        if (strLang != undefined && strLang != "") {
            var strLangs = strLang.split(",");
            for (var i = 0; i < strLangs.length; i++) {
                $('input[name=optLang]').filter('[value="' + strLangs[i] + '"]').prop('checked', true);
            }
        }

        $("#hdnUserLevelLang").val() == "true" ? $('#optUserLang').prop("checked", true) : $('#optUserLang').prop("checked", false);

        $('input[name=optCulture]').filter('[value="' + $('#hdnCulture').val() + '"]').prop('checked', true);
        if ($j("#hdnDevInstance").val() == "true")
            $j("#enableDevInstance").prop('checked', true);
        else
            $j("#enableDevInstance").prop('checked', false);
        //$('input[name=optAutoGen]').filter('[value="' + $('#hdnAutoGen').val() + '"]').prop('checked', true);
        if ($j("#hdnAutoGen").val() == "true")
            $j("#enableautognrText").prop('checked', true);
        else
            $j("#enableautognrText").prop('checked', false);
        //$('input[name=optPerf]').filter('[value="' + $('#hdnIsPerfCode').val() + '"]').prop('checked', true);
        if ($j("#hdnIsPerfCode").val() == "true")
            $j("#enablelblslctText").prop('checked', true);
        else
            $j("#enablelblslctText").prop('checked', false);
        //$('input[name=optDcGrid]').filter('[value="' + $('#hdnDcGridOnSave').val() + '"]').prop('checked', true);
        if ($j("#hdnDcGridOnSave").val() == "true")
            $j("#enableoptdcgridText").prop('checked', true);
        else
            $j("#enableoptdcgridText").prop('checked', false);
        $('input[name=optexe]').filter('[value="' + $('#hdnIsPrintExe').val() + '"]').prop('checked', true);
        //$('input[name=optWrap]').filter('[value="' + $('#hdnTextWrap').val() + '"]').prop('checked', true);
        if ($j("#hdnTextWrap").val() == "true")
            $j("#enabletextwrapc5Text").prop('checked', true);
        else
            $j("#enabletextwrapc5Text").prop('checked', false);
        $('input[name=optDbP]').filter('[value="' + $('#hdnDbPagination').val() + '"]').prop('checked', true);
        //$('input[name=optTitlePrint]').filter('[value="' + $('#hdnShowAppTitle').val() + '"]').prop('checked', true);
        if ($j("#hdnShowAppTitle").val() == "true")
            $j("#enabletitledwn").prop('checked', true);
        else
            $j("#enabletitledwn").prop('checked', false);
        if ($j("#hdnShowstripedreport").val() == "true")
            $j("#enablestripedreport").prop('checked', true);
        else
            $j("#enablestripedreport").prop('checked', false);
        //GetIviewRowCount this configuration is made default and is overridden in iview.aspx.cs and forcefully making it false until required
        //if ($j("#hdnGetIviewRowCount").val() == "true") {
        //    $j("#chkGetIviewRowCount").prop('checked', true);
        //    $("#txtIviewDataWSRows").parents(".form-group").hide();
        //    $("#txtMaxRowsToPrint").parents(".form-group").show();
        //}
        //else {
        //    $j("#chkGetIviewRowCount").prop('checked', false);
        //    $("#txtIviewDataWSRows").parents(".form-group").show();
        //    $("#txtMaxRowsToPrint").parents(".form-group").hide();
        //}
        var PrintMargins = "";
        if ($('#hdnPrintMargins').val() != "") {
            try {
                PrintMargins = $('#hdnPrintMargins').val().split(",");
                $('#pmleft').val(PrintMargins[0]);
                $('#pmright').val(PrintMargins[1]);
                $('#pmtop').val(PrintMargins[2]);
                $('#pmbottom').val(PrintMargins[3]);
            } catch (ex) { }

        }

        ShowDesignerResp();
        ShowHomeBuildResp();
        SetLangKeys();
        SetMenuVals();
    }
    catch (ex) {
        console.log(ex.message);
    }
}

function SetMenuVals() {
    var subMenuCnt = $j("#hdnSubMenuCount").val();
    if (isNaN(subMenuCnt)) {
        $('input[name=axMenuSubmenuCnt]').filter('[value="all"]').prop('checked', true);
    }
    else {
        $('input[name=axMenuSubmenuCnt]').filter('[value="lim"]').prop('checked', true);
        $j("#txtSubMenuCnt").val(subMenuCnt);
    }

    var dirSubMenuCnt = $j("#hdnDirSubMenuCount").val();
    if (isNaN(dirSubMenuCnt)) {
        $('input[name=axMenuDirSubmenuCnt]').filter('[value="all"]').prop('checked', true);
    }
    else {
        $('input[name=axMenuDirSubmenuCnt]').filter('[value="lim"]').prop('checked', true);
        $j("#txtDirSubMenuCnt").val(dirSubMenuCnt);
    }

    var wrap = $j("#hdnMenuWrapText").val();
    if (wrap == "true")
        $j("#axMenuWrapText").prop('checked', true);
    else
        $j("#axMenuWrapText").prop('checked', false);
}

function SetLangKeys() {
    var arrLangKeys = $j("#hdnLangVals").val().split('♦');
    var langCode = "";
    var langHTML = "";
    var i = 0;
    for (i = 0; i < arrLangKeys.length; i++) {
        if (arrLangKeys[i].toString() != "") {
            var keyID = arrLangKeys[i].split(':')[0].toString();
            var keyVal = arrLangKeys[i].split(':')[1].toString();
            langCode = keyID.slice(keyID.length - 3, keyID.length);
            if (!$j("input#" + keyID).length)
                langHTML += "<input type='hidden' id='" + keyID + "' name='" + langCode + "' value='" + keyVal + "' />"
        }
    }
    $j("#dvLangInputs").append(langHTML);
}

function ChangeTheme() {
    var theme = "";
    theme = eval(callParent('currentThemeColor'));;
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

function ValidateNumeric(elem) {
    var num = $j(elem).val();
    if (num != "") {
        if (!$j.isNumeric(num) || num < 1) {
            showAlertDialog("error", 1039, "client");
            $j(elem).val("");
            $j(elem).focus();
            return false;
        }
        $j(elem).val(Math.round(Number(num)));
    }
    return true;
}

function TrimWhiteSpaces() {
    $j("#txtAppTitle").val($j("#txtAppTitle").val().trim());
    $j("#txtCopyRightText").val($j("#txtCopyRightText").val().trim());
    $j("#txtPrintTitle").val($j("#txtPrintTitle").val().trim());
    $j("#txtMaxRowsToPrint").val($j("#txtMaxRowsToPrint").val().trim());
    $j("#txtPageRowCount").val($j("#txtPageRowCount").val().trim());
    $j("#txtAlertTimeout").val($j("#txtAlertTimeout").val().trim());
    $j("#txtGlobalSrchLimit").val($j("#txtGlobalSrchLimit").val().trim());
    $j("#txtImpEmpTmpPath").val($j("#txtImpEmpTmpPath").val().trim());
    $j("#txtIviewDataWSRows").val($j("#txtIviewDataWSRows").val().trim());
    //$j("#txtImagePath").val($j("#txtImagePath").val().trim());
    //$j("#txtAttachPath").val($j("#txtAttachPath").val().trim());
    //$j("#txtGridAttachPath").val($j("#txtGridAttachPath").val().trim());
    $j("#txtMaxDraftsCount").val($j("#txtMaxDraftsCount").val().trim());
    $j("#txtExePath").val($j("#txtExePath").val().trim());
    $j("#txtPrintPath").val($j("#txtPrintPath").val().trim());
    $j("#txtMaxNumOfWidgets").val($j("#txtMaxNumOfWidgets").val().trim());
}

function ShowDimmer(status) {

    DimmerCalled = true;
    var dv = $j("#waitDiv");

    if (dv.length > 0 && dv != undefined) {
        if (status == true) {

            var currentfr = $j("#middle1", parent.document);
            if (currentfr) {
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

function FlushRedisKeys() {
    $.ajax({
        type: "POST",
        url: "../aspx/FastDataUtility.aspx/FlushAll",
        contentType: "application/json;charset=utf-8",
        data: '{}',
        dataType: "json",
        failure: function (response) {
            console.log(response.d + "failure");
        },
        error: function (response) {
            console.log(response.d + "error");
        }
    });
}

function CheckRequiredFields() {
    var isValid = true;

    if ($j("ul.nav-tabs li.active").length && $j("ul.nav-tabs li.active").length == 1) {
        if ($j("ul.nav-tabs li.active").attr("id") == "liReports") {
            $j("input#txtMaxRowsToPrint, input#txtPageRowCount, input#txtIviewDataWSRows").each(function () {
                var num = $(this).val();
                if (!$j.isNumeric(num) || num == "" || num < 1) {
                    showAlertDialog("error", 1039, "client");
                    $(this).val("");
                    isValid = false;
                } else if ($(this).attr("id") == "txtIviewDataWSRows" && num < 1000) {
                    showAlertDialog("error", callParentNew("lcm")[384]);
                    $(this).val(1000);
                    isValid = false;
                } else if ($(this).attr("id") == "txtPageRowCount" && Math.floor($("#txtIviewDataWSRows").val() / 2) < num) {
                    showAlertDialog("error", callParentNew("lcm")[385]);
                    $(this).val(30);
                    isValid = false;
                }
                if (!isValid) {
                    $j("div#headingfive").addClass("active");
                    $j("div#collapsefive").addClass("in");
                    $(this).focus();
                    return false;
                }
            });

        }
        else if ($j("ul.nav-tabs li.active").attr("id") == "liForms") {
            $j("input#pmtop, input#pmright, input#pmbottom, input#pmleft").each(function () {
                var num = $(this).val();
                if (!$j.isNumeric(num) || num == "" || num < 1) {
                    showAlertDialog("error", 1039, "client");
                    $j("div#headingfour").addClass("active");
                    $j("div#collapsefour").addClass("in");
                    $(this).val("");
                    $(this).focus();
                    isValid = false;
                    return false;
                }
            });
        }
        else if ($j("ul.nav-tabs li.active").attr("id") == "liApplication") {
            if ($j('input[name=optLang]:checked').length == 0) {
                showAlertDialog("error", 1009, "client");
                $j("div#headingTwo").addClass("active");
                $j("div#collapseTwo").addClass("in");
                $('input[name=optLang]')[0].focus();
                isValid = false;
            }
            var txtalert = parseInt($("#txtAlertTimeout").val());
            var txtalertmsg = ($("#txtAlertTimeout").val());
            if (txtalertmsg < 1 || txtalertmsg > 10) {
                showAlertDialog("error", callParentNew("lcm")[388]);
                $("#txtAlertTimeout").focus();
                isValid = false;
                return false;
            }

            if ($j("#enableErrorMsgText").prop("checked") == true) {
                var txtErrTimeout = parseInt($("#txtErrorTimeout").val());
                var txterrortmt = ($("#txtErrorTimeout").val());
                if (txterrortmt == 0 || txterrortmt == "") {
                    ($("#txtErrorTimeout").val(0));
                }
                if (txterrortmt < 1 || txterrortmt > 10) {
                    showAlertDialog("error", callParentNew("lcm")[388]);
                    $("#txtErrorTimeout").focus();
                    isValid = false;
                    return false;
                }
            }
            var globalsearch = ($("#txtGlobalSrchLimit").val());
            if (globalsearch < 10 || globalsearch > 10000) {
                showAlertDialog("error", callParentNew("lcm")[391]);
                $("#txtGlobalSrchLimit").focus();
                isValid = false;
                return false;
            }
        }
        else if ($j("ul.nav-tabs li.active").attr("id") == "liDeveloper") {
            $j("input#txtMaxNumOfWidgets").each(function () {
                var num = $(this).val();
                if (!$j.isNumeric(num) || num == "" || num < 1) {
                    showAlertDialog("error", 1039, "client");
                    $j("div#headingsix").addClass("active");
                    $j("div#collapsesix").addClass("in");
                    $(this).val("");
                    $(this).focus();
                    isValid = false;
                    return false;
                }
                else if (num > 100) {
                    showAlertDialog("error", 1040, "client");
                    $j("div#headingsix").addClass("active");
                    $j("div#collapsesix").addClass("in");
                    $j(this).val("");
                    $j(this).focus();
                    isValid = false;
                    return false;
                }
            });
        }
    }
    if (isValid) {
        ConstructLangSel();

        var strLang = $j("#langSelect").find("option:selected").val();
        var langCode = strLang.toUpperCase().substring(0, 3);
        SetLangConfigs(langCode);
        ConstructLangVals();
    }

    return isValid;
}

function ConstructLangSel() {
    var strChkLang = GetSelectedLang().toString();
    var strChkText = GetSelectedLangText().toString();
    var strSelLang = "";
    $("#langSelect").children('option').each(function () {
        if (strSelLang == "")
            strSelLang = $(this).val();
        else
            strSelLang += "," + $(this).val();
    })
    var arrLang = strChkLang.split(',');
    var arrLangText = strChkText.split(',');
    if (arrLang.length === 1 || (lockPage != undefined && lockPage.toLowerCase() == "true")) {
        $("#langSelect").attr("disabled", true);
    }
    else {
        $("#langSelect").attr("disabled", false);
    }
    if (arrLang.length != $("#langSelect").children('option').length || strChkLang.toUpperCase() != strSelLang.toUpperCase()) {
        var langHTML = "";
        var langCode = "";
        for (var i = 0; i < arrLang.length; i++) {
            langCode = arrLang[i].toString().slice(arrLang[i].toString().length - 3, arrLang[i].toString().length);
            langHTML += " <option value='" + arrLang[i].toString() + "' >" + arrLangText[i].toString() + "</option>";
            SetLangConfigs(langCode);
        }
        $("#langSelect").html('');
        $("#langSelect").append(langHTML);
        PopulateLangConfigs();
    }
}

function loadDefaultValues() {
    //if (confirm('Default values will be loaded...')) {
    //    window.location.href = "Configuration.aspx?reStoreDefault=true";
    //}
    var cutMsg = eval(callParent('lcm[75]'));
    var glType = eval(callParent('gllangType'));
    var isRTL = false;
    if (glType == "ar")
        isRTL = true;
    else
        isRTL = false;
    var loadDefaultValuesCB = $.confirm({
        theme: 'modern',
        closeIcon: false,
        title: eval(callParent('lcm[155]')),
        onContentReady: function () {
            disableBackDrop('bind');
            //to display tooltips for Confirm & Cancel buttons
            $(".jconfirm-buttons button").each(function () {
                var txt = $(this).text();
                $(this).prop('title', txt.charAt(0).toUpperCase() + txt.slice(1))
            });
            $(".jconfirm-buttons .hotbtn").focus(); //to focus on Confirm button once dialog is opened
        },
        rtl: isRTL,
        backgroundDismiss: true,
        escapeKey: 'buttonB',
        content: cutMsg,
        buttons: {
            buttonA: {
                text: eval(callParent('lcm[164]')),
                btnClass: 'btn btn-primary',
                action: function () {

                    window.location.href = "Configuration.aspx?reStoreDefault=true";
                }
            },
            buttonB: {
                text: eval(callParent('lcm[192]')),
                btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                action: function () {
                    //disableBackDrop('destroy');

                }
            }
        }
    });
}


//var navAction = "";
////to navigate page by page on back and forward button click
//function BackForwardButtonClicked(buttonName) {
//    if (enableBackButton.toString().toUpperCase() == "FALSE" && buttonName == "back")
//        return;
//    if (enableForwardButton.toString().toUpperCase() == "FALSE" && buttonName == "forward")
//        return;
//    navAction = buttonName;
//    ShowDimmer(true);
//    try {
//        //  ASB.WebService.NavigateBackForwardButton(buttonName, SuccessButtonClicked, OnNavException);
//        $j.ajax({
//            type: "POST",
//            url: "../WebService.asmx/NavigateBackForwardButton",
//            contentType: "application/json;charset=utf-8",
//            data: '{buttonName: "' + buttonName + '"}',
//            dataType: "json",
//            success: function (data) {
//                SuccessButtonClicked(data.d);
//            },
//            failure: function (response) {
//                OnNavException(data.d);
//            },
//            error: function (response) {
//                OnNavException(data.d);
//            }
//        });
//    } catch (ex) {
//        OnNavException("Failure during the process");
//        ShowDimmer(true);
//    }
//}
function SuccessButtonClicked(result) {

    if (result != "") {
        window.location = result;
        return false;  //return false will force the page to load
    }
}

function OnNavException(result) {
    ShowDimmer(false);
    showAlertDialog("error", result._message);
}



function SuccessGetAxResponsibilities(response) {
    if (response.status == true) {
        var appResp = response.data;
        if (appResp != undefined && appResp.length > 0) {
            for (var i = 0; i < appResp.length; i++) {
                var resp = appResp[i].toString().split(",");
                if (resp != "" && resp.length > 0) {
                    for (var j = 0; j < resp.length; j++) {
                        if ($.inArray(resp[j], arrAppResp) < 0) arrAppResp.push(resp[j]);
                    }
                }
            }
        }

        arrAppResp.sort(function (respA, respB) {
            if (respA.toLowerCase() < respB.toLowerCase()) return -1;
            if (respA.toLowerCase() > respB.toLowerCase()) return 1;
            return 0;
        });

        ConstructResponsibilityFields();
    }
    else {
        showAlertDialog("error", response.errMsg);
        console.log(response);
        valSessByApi(response);
    }
}

function ConstructResponsibilityFields() {
    if (arrAppResp != undefined && arrAppResp.length > 0) {

        var respHTML = "";
        for (var i = 0; i < arrAppResp.length; i++) {
            respHTML += " <option value='" + arrAppResp[i].toString() + "' >" + arrAppResp[i].toString() + "</option>";
        }
        if (respHTML != "") {
            $("#homeBuildResp").append(respHTML);
            $("#designerResp").append(respHTML);
        }

        $("#homeBuildResp").multiSelect('refresh');
        $("#designerResp").multiSelect('refresh');

        ShowDesignerResp();
        ShowHomeBuildResp();
    }
}
function ShowDesignerResp() {
    var strResp = $('#hdnDesignerResp').val();
    if (strResp != undefined && strResp != "") {

        $j('#ms-designerResp .ms-elem-selection').each(function () {
            var strResp = $('#hdnDesignerResp').val().split(",");
            for (var i = 0; i < strResp.length; i++) {
                if ($j(this).find("span")[0].innerHTML.trim() == strResp[i].trim()) {
                    $j(this).addClass("ms-selected");
                    $j(this).removeAttr("style");
                    break;
                }
            }
        });

        $j('#ms-designerResp .ms-elem-selectable').each(function () {
            var strResp = $('#hdnDesignerResp').val().split(",");
            for (var i = 0; i < strResp.length; i++) {
                if ($j(this).find("span")[0].innerHTML.trim() == strResp[i].trim()) {
                    $j(this).addClass("ms-selected");
                    $j(this).css("display", "none");
                    break;
                }
            }
        });
    }
}
function ShowHomeBuildResp() {
    var strResp = $('#hdnHomeBuildResp').val();
    if (strResp != undefined && strResp != "") {

        $j('#ms-homeBuildResp .ms-elem-selection').each(function () {
            var strResp = $('#hdnHomeBuildResp').val().split(",");
            for (var i = 0; i < strResp.length; i++) {
                if ($j(this).find("span")[0].innerHTML.trim() == strResp[i].trim()) {
                    $j(this).addClass("ms-selected");
                    $j(this).removeAttr("style");
                    break;
                }
            }
        });

        $j('#ms-homeBuildResp .ms-elem-selectable').each(function () {
            var strResp = $('#hdnHomeBuildResp').val().split(",");
            for (var i = 0; i < strResp.length; i++) {
                if ($j(this).find("span")[0].innerHTML.trim() == strResp[i].trim()) {
                    $j(this).addClass("ms-selected");
                    $j(this).css("display", "none");
                    break;
                }
            }
        });
    }
}

function createSrcAutoComp() {
    var datadropdownfill = [];
    ddlLanguage = $j('#ddlLanguage').val()
    if (ddlLanguage != "") {
        $("#ddlSource").autocomplete({
            minLength: 0,
            selectFirst: true,
            autoFocus: true,
            source: function (request, response) {
                $.ajax({
                    type: "POST",
                    url: "../WebService.asmx/FormAutoComplete",
                    cache: false,
                    async: false,
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify({ FldValue: "", fltValue: request.term, ddlLanguage: ddlLanguage }),
                    dataType: "json",
                    success: function (data) {
                        var result = $.parseJSON(data.d);
                        datadropdownfill = [];
                        $(result).each(function (iIndex, sElement) {
                            datadropdownfill.push(sElement.item + "~" + sElement.status);
                        });
                        response($.map(datadropdownfill.slice(0, 50), function (item) {
                            return {
                                label: item.split('~')[0], value: item.split('~')[0], link: item.split('~')[1]
                            }
                        }))
                    },
                });
            },
            appendTo: '#lblddlsource',
            open: function (event, ui) {

                var dialog = $(this).closest('.ui-dialog');
                if (dialog.length > 0) {
                    $('.ui-autocomplete.ui-front').zIndex(dialog.zIndex() + 1);
                }
                if (($(this).offset().top + 200) > ($(".scrolldiv").outerHeight() + $(".scrolldiv").scrollTop())) {
                    $('.scrolldiv').scrollTop($(this).offset().top);
                }
            },
            select: function (event, ui) {
                var prev = $('#ddlSource').val();
                var current = ui.item.value;
                var prevlang = $('#ddlLanguage').val();
                var datavalue = [];
                for (n = 0; n < datadropdownfill.length; n++) {
                    var dataarr = datadropdownfill[n].split('~');
                    datavalue.push(dataarr[0]);
                }
                if ($.inArray(prev, datavalue) > -1) {
                    GetTextsdata(prev, prevlang);
                }
                gethtmldiv(current, prevlang);
                // $('.scrolldiv').scrollTop(0)
            },
        }).data("ui-autocomplete")._renderItem = function (ul, item) {
            var inner_html = '';
            var type = item.link;
            if (type == "yes") {
                inner_html = '<div><span><img  class="customtransicon" src="../axpimages/ico_translate.png" /></span>' + item.label + '</div>';
            }
            else {
                inner_html = '<div><span><img class="customtransicon" src="../axpimages/failure icon.png"/></span>' + item.label + '</div>';
            }

            return $("<li></li>")
                .data("ui-autocomplete-item", item)
                .append(inner_html)
                .appendTo(ul);
        };
        if ($("#ddlSource").data("uiAutocomplete")) {
            $("#ddlSource").focus().autocomplete("search", "");
        } else {
            createSrcAutoComp();
        }
    } else {
        $("#ddlLanguage").focus();
    }
}
function createLangAutoComp() {
    var language = [];
    $("#ddlLanguage").autocomplete({
        minLength: 0,
        selectFirst: true,
        autoFocus: true,
        source: function (request, response) {
            var axLang = $('#hdnAxLangSrc').val();
            language = axLang.toLowerCase().split(",");
            if (language.length != 0) {
                response($.map(language, function (item) {
                    item = item.toLowerCase().replace(/\b[a-z]/g, function (letter) {
                        return letter.toUpperCase();
                    });
                    return {
                        label: item, value: item
                    }
                }))
            }
        },
        appendTo: '#lblddlLanguage',
        open: function (event, ui) {
            var dialog = $(this).closest('.ui-dialog');
            if (dialog.length > 0) {
                $('.ui-autocomplete.ui-front').zIndex(dialog.zIndex() + 1);
            }
            $('.scrolldiv').scrollTop(300);
        },
        select: function (event, ui) {
            var prevlang = $('#ddlLanguage').val();
            var currentlang = ui.item.value;
            var prev = $('#ddlSource').val();
            if ($.inArray(prevlang, language) > -1) {
                GetTextsdata(prev, prevlang);
            }
            if (validate()) {
                gethtmldiv(prev, currentlang);
            }
            //$('.scrolldiv').scrollTop(0)
        }
    })
    if ($("#ddlLanguage").data("uiAutocomplete")) {
        $("#ddlLanguage").focus().autocomplete("search", $('#ddlLanguage').val());
    } else {
        createLangAutoComp();
    }

}
function gethtmldiv(current, currentlang) {
    $.ajax({
        type: "POST",
        url: "../WebService.asmx/FileXml",
        data: '{ddlsource:"' + current + '" ,ddlLanguage: "' + currentlang + '" }',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: OnSuccess,
        failure: function (response) {
            showAlertDialog("error", response.d);
        }
    });
}
function OnSuccess(response) {
    var result = "";
    result = response.d;
    if (result != "") {
        $("#dvContent").empty();
        $("#dvContent").append(result);

    }
}
function validate() {

    if ($j('#ddlSource').val() == "") {
        $("#ddlLanguage").focus();
        return false;
    } else {
        return true;
    }
}
function savefile(prev, prevlang, textvalue) {
    $.ajax({
        type: "POST",
        url: "../WebService.asmx/SaveLanFileData",
        dataType: "json",
        data:
        {
            ddlSource: prev.toString(),
            ddlLanguage: prevlang.toString(),
            textvalue: textvalue.toString()
        },
        success: function (data) {
        },
        error: function (response) {
        }
    });
}
function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function GetTextsdata(prev, prevlang) {
    if (prev == "" && prevlang == "") {
        prev = $('#ddlSource').val();
        prevlang = $('#ddlLanguage').val();
    }
    var textvalue = [];
    for (idx = 0; idx < $('#dvContent textarea[id^=txt]').length; idx++) {
        textvalue = textvalue + ($('#dvContent textarea[id^=txt]')[idx].value) + "♠";
    }
    if (validate() && textvalue.length > 0)
        savefile(prev, prevlang, htmlEntities(textvalue));
}

function capitalizeFirstLetter(status) {
    return status.charAt(0).toUpperCase() + status.toLowerCase().slice(1);
}

function handleChange(input) {
    if (input.value < 1) input.value = 1;
    if (input.value > 99) input.value = 99;
}

//Set the page in readonly mode
function LockConfigPage() {
    $('#form1 input').prop("disabled", true);
    $(".ms-list li").prop('disabled', true);

    $(".form-group select").prop('disabled', true);
    $(".form-group label.tgl-btn").css("cssText", 'background:#eee !important');

    $(".file-upload .file-select").css("border", "2px solid #ddd8d8");
    $(".file-upload .file-select .file-select-button").css("background", "#b1b1b1");

    //if (typeof parent.mainUserName != "undefined" && parent.mainUserName == "admin") {
    if (typeof callParentNew("mainUserName") != "undefined" && callParentNew("mainUserName") == "admin") {
        $("#btnUnlock").prop('disabled', false).css("display", "block");
        $("#btnRestore").css("display", "none");
        $("#btnSave").css("display", "none");
    }
}

function UnlockPage() {
    UnlockConfigApp({
        forceUnlock: true, cb: function () {
            ReloadPage();
        }
    });
}


function ReloadPage() {
    var page = parent.$('#iFrameGlobalSettings');
    page.attr("src", page.attr("src"));
}

