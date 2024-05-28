var isiOS = (/iPad|iPhone|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) && !window.MSStream;

var isiPad = isiOS && !/iPhone|iPod/i.test(navigator.userAgent);

var appGlobalVarsObject = undefined;

iframeScrollFix();

CheckSuccCallBackValidate();

function CheckSuccCallBackValidate() {
    var returnValue = false;
    var pervsid = eval(callParent('hdnpsid'));
    if (typeof pervsid != "undefined" && pervsid != "") {
        getSession("nsessionid", function (data) {
            if (data.d != undefined && data.d != pervsid) {
                var cllMainPage = callParentNew("", "getParent");
                if (cllMainPage.location.href.toLowerCase().indexOf("/aspx/axmain.aspx") > -1)
                    cllMainPage.location.href = "../aspx/axmain.aspx";
                else
                    cllMainPage.location.href = "../aspx/mainnew.aspx";
                returnValue = true;
            }
        });
    }
    return returnValue;
}

function SuccCallBackValidate(result) {
    if (typeof result != "undefined" && result == "Duplicate session") {
        CheckSuccCallBackValidate();
        return true;
    }
    return false;
}

try {
    var mainPageUrl = "";
    var isMainPage = true;
    var linkHref = window.location.href;
    if (!callParentNew("isDWB")){
        if (linkHref.toLowerCase().indexOf("/aspx/tstruct.aspx") != -1 || linkHref.toLowerCase().indexOf("/aspx/iview.aspx") != -1 || linkHref.toLowerCase().indexOf("/aspx/ivtoivload.aspx") != -1 || linkHref.toLowerCase().indexOf("/aspx/ivtstload.aspx") != -1) {
            var parentPage = callParentNew("", "getParent");
            if (parentPage != undefined && parentPage.document != undefined)
                mainPageUrl = parentPage.document.URL;

            if (mainPageUrl == undefined || mainPageUrl == "" || mainPageUrl.toLowerCase().indexOf("/aspx/mainnew.aspx") == -1) {
                isMainPage = false;
                mainPageUrl = GetMainPageUrl();
            }

            if (!isMainPage && (mainPageUrl.toLowerCase().indexOf("/aspx/mainnew.aspx") > -1 || mainPageUrl.toLowerCase().indexOf("/aspx/axmain.aspx") > -1)) {
                LoadMainPage(mainPageUrl, linkHref);
            }
        }
    }
} catch (ex) {
    console.warn("Error in GetMainPageUrl call : " + ex.message);
}

function LoadMainPage(mainPageUrl, linkHref) {
    try {
        //local storage for new tab pageload is not used since it is loading duplicate pages when multiple new tabs are opened simultaneously.
        var useLocalStorage = false;
        if (useLocalStorage && typeof (Storage) !== "undefined") {

            if (localStorage["PageToLoad_" + projName] == undefined || localStorage["PageToLoad_" + projName] == "")
                localStorage["PageToLoad_" + projName] = linkHref;
            else
                localStorage["PageToLoad_" + projName] = localStorage["PageToLoad_" + projName] + "♠" + linkHref;
            mainPageUrl += "#url=local";
        } else {
            SetSession({
                key: "PageToLoad",
                val: linkHref,
                appendVal: true,
                async: true,
                delimiter: "♠",
                cb: function (data) {
                    mainPageUrl += "#url=sess";
                    window.location.href = mainPageUrl;
                }
            })
        }
    } catch (ex) {
        console.warn("Error in LoadMainPage call : " + ex.message);
    }
}

function GetMainPageUrl() {
    var mainPageUrl = "";
    try {
        var useLocalStorage = false;
        if (useLocalStorage && typeof (Storage) !== "undefined") {
            mainPageUrl = localStorage["MainPageUrl_" + projName];
        } else {
            var appUrl = window.location.href;
            if (appUrl.indexOf("/aspx/") !== -1 && appUrl.toLowerCase().indexOf("/aspx/mainnew.aspx") !== -1) {
                appUrl = appUrl.substring(0, appUrl.indexOf("/aspx/") + 6);
                mainPageUrl = appUrl + "Mainnew.aspx";
            } else if (appUrl.indexOf("/aspx/") !== -1 && appUrl.toLowerCase().indexOf("/aspx/axmain.aspx") !== -1) {
                appUrl = appUrl.substring(0, appUrl.indexOf("/aspx/") + 6);
                mainPageUrl = appUrl + "AxMain.aspx";
            }
        }
    } catch (ex) {
        console.warn("Error in GetMainPageUrl call : " + ex.message);
    }
    return mainPageUrl;
}

function ClearRedisKeys(rsKeys) {
    var clearrsKeys = rsKeys.split("*");
    var settings = redisNodeApiSettings();
    settings.url = eval(callParent('nodeApi')) + "clearkeys";
    settings.data.rKey = JSON.stringify(clearrsKeys); //keys to clear
    settings.data.rUtl = eval(callParent('redisUtl')); //reddis utl
    $.ajax(settings).done(function (response) {
        if (response.status == true) { }
    });
}

function PeriodicRefreshCache() {
    var settings = redisNodeApiSettings();
    settings.url = eval(callParent('nodeApi')) + "periodicrefresh";
    settings.data.utl = eval(callParent('utl'));
    settings.data.rUtl = eval(callParent('redisUtl'));
    $.ajax(settings).done(function (response) {
        if (response.status == true) { }
    });
}

var redisNodeApiSettings = function () {
    return {
        "async": true,
        "crossDomain": true,
        "method": "POST",
        "headers": {
            "content-type": "application/x-www-form-urlencoded"
        },
        "data": {}
    }
}

var initReadyComplete = false;
function commonReadyTasks() {
    if (!initReadyComplete) {
        if (typeof appGlobalVarsObject == "undefined") {
            appGlobalVarsObject = callParentNew("appGlobalVarsObject");
        }

        closeParentFrame();
        ShowDimmer("false");
        checkSuccessAxpertMsg();

        try {
            if (window.frameElement.id == "middle1") {
                callParentNew("middle1URL=", window.location.href);
            }
        } catch (ex) { }

        resetMainPageUI();
        initReadyComplete = true;
    } else {
        ShowDimmer("false");
    }
}

/**
 * @description
 * @author Prashik + Aarti
 * @date 2021-06-30
 */
function iframeScrollFix(){
    let iframeList = [
        "iview.aspx",
        "tstruct.aspx",
        "ExportNew.aspx",
        "ImportNew.aspx",
        "adminconsole.aspx",
        "WorkflowNew.aspx"
    ];

    if(iframeList.filter(list => window.location.href.toLowerCase().indexOf(`/${list.toLowerCase()}`) > -1).length > 0){
        $("html").addClass("iframeScrollFix");
    }
}

/**
 * @description: common main page reset functionality
 * @author Prashik
 * @date 2019-10-18
 */
function resetMainPageUI() {
    try {
        $(callParentNew(appGlobalVarsObject._CONSTANTS.search.staging.div.substr(1), "id")).val("");
        $(callParentNew(appGlobalVarsObject._CONSTANTS.search.staging.divparent.substr(1), "class")).removeClass("open");
    } catch (ex) { }

    try {

        var homePageBody = $(callParentNew("homePageBody", "class"));
        if (homePageBody && !homePageBody.hasClass("enableExpandCollapse")) {
            homePageBody.removeClass("overlay-open");
            homePageBody.find(".overlay").fadeOut();
        }
    } catch (ex) { }
}

function validateFilesize() {
    var attachement = document.getElementById('filMyFile');
    attachement.onchange = function () {
        var fileType = "File";
        var attachmentSizeMB = callParentNew("axAttachmentSize", "axAttachmentSize") == undefined ? 1 : callParentNew("axAttachmentSize", "axAttachmentSize");
        var fileUploadLimit = attachmentSizeMB * 1024 * 1024;
        if ($j("#imgUploadLimit").length)
            fileType = "Image";
        for (var i = 0; i < attachement.files.length; i++) {
            var file = attachement.files[i];
            if (file == null || file.size > fileUploadLimit) {
                if (file == null) {
                    if (fileType == "File") $("#fileuploadsts").text("[" + eval(callParent('lcm[80]')).replace("{0}", attachmentSizeMB) + "]");
                    else $("#fileuploadsts").text("[" + eval(callParent('lcm[81]')).replace("{0}", attachmentSizeMB) + "]");
                } else {
                    if (fileType == "File") $("#fileuploadsts").text("[" + eval(callParent('lcm[82]')).replace("{0}", attachmentSizeMB) + "]");
                    else $("#fileuploadsts").text("[" + eval(callParent('lcm[83]')).replace("{0}", attachmentSizeMB) + "]");
                }
                ResetFileUploadProperties();
            } else {
                var fileName = file.name;
                if (fileName.indexOf("+") > -1) {
                    $("#fileuploadsts").text("[FileName should not contain '+' character.]");
                    ResetFileUploadProperties();
                } else if (fileName.indexOf(".") == -1) {
                    $("#fileuploadsts").text(eval(callParent('lcm[362]')));
                    ResetFileUploadProperties();
                }


                else {
                    if (fileType == "File") $("#fileuploadsts").text("[Click 'Attach' button]");
                    else $("#fileuploadsts").text("[Click 'Upload' button]");
                    $("#fileuploadsts").css('color', 'Green');
                    $(".file-upload.active .file-select .file-select-button").css({ "background": "#3fa46a" });
                    $(".file-upload.active .file-select").css({ "border-color": "#3fa46a" });
                }
            }
        }
    }
}

function ValidateFileExtension(filename, fileType, CustomList) {

    try {
        /**
         * @description change parameters hook for ValidateFileExtension function
         * @author Prashik
         * @date 27/05/2021
         * @param {string} filename: name of file
         * @param {string} fileType: category of file
         * @param {string[]} CustomList: custom category array
         * @return {Object{filename, fileType, CustomList} / fileType}  
         */        
        let paramObj = ax_changeValidateFileExtensionParams(filename, fileType, CustomList);
        
        if(typeof paramObj == "object"){
            if(typeof paramObj.filename != "undefined"){
                filename = paramObj.filename;
            }
            if(typeof paramObj.fileType != "undefined"){
                fileType = paramObj.fileType;
            }
            if(typeof paramObj.CustomList != "undefined"){
                CustomList = paramObj.CustomList;
            }
        }else if(typeof paramObj == "string"){
            fileType = paramObj;
        }
    } catch (ex) {
        
    }

    var fileExtensionImage = ['gif', 'png', 'jpg', 'jpeg', 'bmp', 'tiff', 'tif', 'heic', 'jfif'];
    //var filename = $("#filMyFile").val();
    var fileExtension = ['bmp', 'jpg', 'jpeg', 'pjpeg', 'png', 'doc', 'gif', 'docx', 'xml', 'xls', 'ppt', 'pdf', 'txt', 'xlsx', 'pwd', 'tiff', 'tif', 'dib', 'jfif', 'heic', 'xlxs', 'csv', 'html', 'css', 'js', 'htm','eml','msg','pptx'];
    var ext = filename.split('.').pop().toLowerCase();

    if (fileType == "image") {
        if ($.inArray(ext, fileExtensionImage) == -1)
            return false;
        else
            return true;
    }
    if (fileType == "file") {

        if ($.inArray(ext, fileExtension) == -1)
            return false;
        else
            return true;
    }
    if (fileType == "CustomList") {

        if ($.inArray(ext, CustomList == -1))
            return false;
        else
            return true;
    }
}

function ResetFileUploadProperties() {
    $("#fileuploadsts").css('color', '#DB2222');
    $("#filMyFile")[0].value = "";
    $("#noFile")[0].textContent = eval(callParent('lcm[66]'));
    $(".file-upload.active .file-select .file-select-button").css({ "background": "grey" });
    $(".file-upload.active .file-select").css({ "border-color": "grey" });
}

function checkSuccessAxpertMsg() {
    // window.content.localStorage["axpertSuccessMessage"];
    var SuccessMsg = window.localStorage.getItem("axpertSuccessMessage");
    if (SuccessMsg) {
        showAlertDialog('success', SuccessMsg)
        valoutput = window.localStorage.removeItem("axpertSuccessMessage");
    }
}


$(document).click(function (e) {
    if (document.URL.indexOf("aspx/mainnew.aspx") === -1) {
        callParentNew("createMobileQRcode(destroy)", "function")
    }


    var container = $('#menuContentWrapper', window.parent.document);
    var btnContainer = $('#hamburgerMenuIcon', window.parent.document);
    //var themeContainer = $(".panel-control,#customizer", window.parent.document);

    // if the target of the click isn't the container nor a descendant of the container
    if (!$(e.target).hasClass('menuName') && !$(e.target).hasClass('hasSubChildIcon') && !$(e.target).hasClass('menuBgIcon') && !$(e.target).hasClass('hasSubChild') && !$(e.target).hasClass('hirarchy') && $(e.target).attr("id") != "menuContentWrapper" && $(e.target).attr("id") != "hamburgerMenuIcon" && $(e.target).parents("#hamburgerMenuIcon").length === 0 && $(e.target).parents("#menuContentWrapper").length === 0 && $(e.target).parents('.mnuPagination').length === 0) {
        if (btnContainer.hasClass('is-active')) {
            //container.hide();
            btnContainer.find('button').click();
            return;
        }
    }

    // if the target of the click isn't the container nor a descendant of the container
    try {
        if (window["currentThemeColor"] === undefined) {
            var themeContainer = $(".panel-control,#customizer", window.parent.document);
            if (!themeContainer.is(e.target) && themeContainer.has(e.target).length === 0) {
                if ($('#customizer', window.parent.document).hasClass('panel-open')) {
                    $('#customizer', window.parent.document).removeClass('panel-open');
                }
            };
        } else if (window["currentThemeColor"]) {
            var themeContainer = $(".panel-control,#customizer");
            if (!themeContainer.is(e.target) && themeContainer.has(e.target).length === 0) {
                if ($('#customizer').hasClass('panel-open')) {
                    $('#customizer').removeClass('panel-open');
                }
            };
        }
    } catch (ex) {
        console.log(ex.message);
    }
});

document.addEventListener('keydown', (e) => {
    e = e || window.event;
    if(e.keyCode == 116 || (e.keyCode == 82 && e.ctrlKey)){
        e.preventDefault();
        e.stopPropagation();
    }
});

//disabling backdrop for jquery confirm boxes//
function disableBackDrop(task, disESCKey) {
    if (task == "destroy") {
        jQuery(document).unbind("keyup.cnfrmPopupKU");
        jQuery(document).unbind("keydown.cnfrmPopupKD")
        return;
    }

    jQuery(document).bind("keyup.cnfrmPopupKU", function (event) { });
    jQuery(document).bind("keydown.cnfrmPopupKD", function (event) {
        var elemntsToCheck = 'button[tabindex!="-1"],a[tabindex!="-1"],input[tabindex!="-1"],select[tabindex!="-1"],textarea[tabindex!="-1"]';
        if (!event.shiftKey && event.keyCode == 9) {
            //tab key
            if ($(document.activeElement)[0] == $(".jconfirm-buttons button:last")[0]) {
                event.preventDefault()
                $(".jconfirm-box").find(elemntsToCheck).first().focus();
            }
        } else if (event.shiftKey && event.keyCode == 9) {
            if ($(document.activeElement)[0] == $(".jconfirm-box").find(elemntsToCheck).first()[0]) {
                event.preventDefault();
                $(".jconfirm-box").find(elemntsToCheck).last().focus();
            }
        } else if (event.keyCode == 27) {
            event.preventDefault();
            if (disESCKey)
                $(".jconfirm-box .jconfirm-buttons .coldbtn").click();
        }

    })
    $(".jconfirm-buttons button").each(function () {
        var txt = $(this).text();
        $(this).prop('title', txt.charAt(0).toUpperCase() + txt.slice(1))
    });
    $(".jconfirm-buttons .hotbtn").focus();

}



function callParent(name, type) {
    var hirarchy = "window";
    try {
        if (typeof eval(name) === "undefined") {
            hirarchy = hirarchy + ".parent";
        }
    } catch (ex) {
        hirarchy = hirarchy + ".parent";
    }
    var maxParentToCheck = 10;
    var reachedCntPlcHlder = false;

    for (var i = 0; i < maxParentToCheck; i++) {
        try {
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
                    //var fParams = name.substr(name.indexOf('(') + 1, name.indexOf(')')).slice(0, -1);
                    var fParams = name.substr(name.indexOf('(') + 1, name.lastIndexOf(')')).slice(0, -1);
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
        } catch (ex) {
            hirarchy = hirarchy + ".parent";
            continue;
            //console.log(ex.message);
        }
    }


}

function checkForCntPlcHldrFrame(hirarchy) {
    return eval(hirarchy + ".leftMenuWrapper") != undefined ? true : false;
}

//Author - ManiKanta
//changes 
//if type=id,class then instead of hirarchy elem will be returned ===> $("#mani",callParentNew("mani","id")) -> $(callParentNew("mani","id"));
//to set the value to a variable need to call as callParentNew("varName=","value"); first parameter need to end with '='
//@usage
//-->@function<-- type needs to be function ==> callParentNew("funcNam(withParams)","function") ==>@returns the executed value of the function
//-->@elem/class<-- type need to be class ==> callParentNew("className","class") ==>@returns the *JAVASCRIPT* object
//-->@elem/id<-- type need to be id ==> callParentNew("ID","id") ==>@returns the *JAVASCRIPT* object **To user both and class as JQUERY object need to call as $(callParentNew("idClassName","id/class"));
//-->@variable<-- need to pass type ==> callParentNew("variableName") ==>@returns value of the variable



function callParentNew(name = "", type) {
    var hirarchy = window;
    //verifying if name ends with equalto
    let isAssigningValue = false;
    name = name.trim();
    if (name.substr(name.length - 1) === "=") {
        name = name.slice(0, -1);
        name = name.trim();
        isAssigningValue = true;
    }

    try {
        if (typeof window[name] === "undefined") {
            hirarchy = window.parent;
        }
    } catch (ex) {
        hirarchy = window.parent;
    }
    var maxParentToCheck = 10;
    var reachedCntPlcHlder = false;

    for (var i = 0; i < maxParentToCheck; i++) {
        try {
            if (!reachedCntPlcHlder && checkForCntPlcHldrFrameNew(hirarchy)) {
                reachedCntPlcHlder = true;
            } else if (reachedCntPlcHlder) {
                break;
                return false;
            }
            if (type == "id" || type == "class") {
                var byName = type == "id" ? "ById" : "sByClassName";
                var elem = hirarchy.document["getElement" + byName](name);
                if (elem == null) {
                    hirarchy = hirarchy.parent;
                    continue;
                } else {
                    return elem;
                    break;
                }
            } else {
                if (type == 'function') {
                    //var fParams = name.substr(name.indexOf('(') + 1, name.last(')')).slice(0, -1);
                    var fParams = name.substr(name.indexOf('(') + 1, name.lastIndexOf(')')).slice(0, -1);
                    var checkName = name.substr(0, name.indexOf('('));
                    //tst.substr(tst.indexOf('(') + 1, tst.indexOf(')')).slice(0, -1)

                } else if (type == 'getParent') {
                    checkName = name || 'leftMenuWrapper';
                } else {
                    checkName = name;
                }

                if (typeof hirarchy[checkName] === "undefined") {
                    hirarchy = hirarchy.parent;
                    continue;
                } else {
                    if (type == 'function') {
                        return hirarchy[checkName].apply(this, fParams.split(','));//This = > presetn context
                    } else {
                        if (type === 'getParent') {
                            return hirarchy;
                        }
                        if (isAssigningValue) {
                            hirarchy[name] = type;
                            return true;
                        }
                        return hirarchy[name];
                    }
                }
            }
        } catch (ex) {
            hirarchy = hirarchy.parent;
            continue;
            //console.log(ex.message);
        }
    }


}

    function checkForCntPlcHldrFrameNew(hirarchy) {
        return hirarchy.leftMenuWrapper != undefined ? true : false;
    }

    function chooseFileUpload(event) {
        if (event.keyCode == 13)
            $('#filMyFile').click();
    };




    function valSessByApi(response) {
        //if (response.statusCode == "401")
        //    parent.location.href = "sess.aspx";
        if ((response.statusCode === 401 && response.errMsg.toLowerCase() == "not a valid session") || response.statusCode === 403) {
            //for 403 access forbidden will come
            parent.location.href = "sess.aspx";
        }
    }

    function closeRemodalPopupOnEsc() {
        if ($j("#popupIframeRemodal", parent.document).attr("src") != undefined) {
            $j(document).keyup(function (e) {
                if (e.keyCode === 27) {
                    $j('.remodal-close', parent.document).click();
                }
            });
        }

    }

    function IFrameModalDialogTabEvents(inputFirst) {
        var elemntsToCheck = 'button[tabindex!="-1"],a[tabindex!="-1"],input[tabindex!="-1"],select[tabindex!="-1"],radio[tabindex!="-1"]';
        var inputs = $('#form1').find(elemntsToCheck).filter(':visible').not(':disabled');
        firstInput = inputs.first();
        lastInput = inputs.last();
        if (inputFirst != "")
            $("." + inputFirst).addClass("firstFocusable");
        else
            firstInput.addClass("firstFocusable");
        lastInput.addClass("lastFocusable");
        $(".firstFocusable").focus();

        $(".lastFocusable").on('keydown.tabRot', function (e) {
            if ((e.which === 9 && !e.shiftKey)) {
                e.preventDefault();
                $(".firstFocusable").focus();
            }
        });
        $(".firstFocusable").on('keydown.tabRot', function (e) {
            if ((e.which === 9 && e.shiftKey)) {
                e.preventDefault();
                $(".lastFocusable").focus();
            }
        });
        $('.file-select').on("keydown", function (event) {
            if (event.which == 13) {
                $('#filMyFile').click();
            }
        })

    }

    //-------------
    //To display an IFrame/HTML content in a Bootstrap modal dialog
    //parameters
    //-------------
    //header: header of the dialog
    //modalType: modal size - large(lg), medium(md), small(sm), extra small(xs) - optional - default: md
    //height: height of the modal(px or %) - optional - default: 250px
    //isIFrame: iframe or html content - true if it is iframe, false otherwise
    //htmlContentOriFrameUrl: iFrame url or html content
    //requiredConfirm: confirm option when click on cancel - true or false - optional - default: false
    //dialogLoadEvent:  load event, triggers once the dialog loaded completely - optional
    //dialogUnloadEvent: unload event, triggers before the dialog closes - optional
    //-------------
    //example: displayBootstrapModalDialog("Change Password", "md","250px", true, "../aspx/cpwd.aspx?remark=chpwd")
    var dialogWindow = "";

    function displayBootstrapModalDialog(header, modalType, height, isIFrame, htmlContentOriFrameUrl, requiredConfirm, dialogLoadEvent, dialogUnloadEvent) {

        height = height == "" || height == undefined ? "250px" : height;
        modalType = modalType == "" || modalType == undefined ? "md" : modalType;
        requiredConfirm = requiredConfirm == "" || requiredConfirm == undefined ? false : true;
        closeIcon = requiredConfirm ? "confirm-modal-close" : "modal";
        langAlignment = eval(callParent('gllangType')) === "en" ? "right" : "left"; // modal close icon alignment - English(right) & Arabic(left)

        var modalId = "divModal" + header.split(" ").join("");
        var iFrameId = "iFrame" + header.split(" ").join("");
        if ($("#" + modalId).next().hasClass("modal-backdrop"))
            $("#" + modalId).next().remove();
        $("#" + modalId).remove();

        var modalHtml = '';
        setTimeout(function () {
            modalHtml += '<div class="custom-dialog modal fade" id="' + modalId + '" role="dialog" data-iframe-src="' + (isIFrame ? htmlContentOriFrameUrl : '') + '"  data-keyboard="false" data-confirm-leave="' + requiredConfirm + '" data-iframe-id="' + iFrameId + '"><div class="modal-dialog modal-' + modalType + '"><div class="modal-content"><div class="modal-header"><h4 class="modal-title" id="divModalHeader">' + header + '</h4></div><div class="modal-body">';
           // <button id="btnModalClose" type="button" class="close material-icons cardStyle" title="' + eval(callParent('lcm[249]')) + '" data-dismiss=' + closeIcon + ' style="float:' + langAlignment + '">close</button>

            if (isIFrame)
                modalHtml += '<iframe src="' + htmlContentOriFrameUrl + '" style="width: 100%;height: ' + height + ';border: none;" id="' + iFrameId + '"></iframe>';
            else
                modalHtml += '<div id="htmlContentOriFrameUrl" style="height:' + height + '">' + (typeof htmlContentOriFrameUrl == "string" ? htmlContentOriFrameUrl : "") + '</div>';
            $("body").append(modalHtml);
            typeof htmlContentOriFrameUrl == "object" ? $("#htmlContentOriFrameUrl").append(htmlContentOriFrameUrl) : "";
            //call back function for modal load event 
            $("#" + modalId).on("shown.bs.modal", function () {
                if (dialogLoadEvent)
                    dialogLoadEvent(); //triggers once the dialog is loaded
            });

            //call back function for modal unload event
            $("#" + modalId).on("hide.bs.modal", function () {
                if (dialogUnloadEvent)
                    dialogUnloadEvent(); //triggers before dialog closes
            });

            //for any reason if the iframe modal dialog is not opened then remove disabled option for utilities & settings menu after 10 sec
            setTimeout(function () {
                removeUnclickableMenuCssClass();
                $("#btnModalClose").addClass("d-none");
            }, 10000)

            if (isIFrame) {
                iframe = eval(callParent(iFrameId, "id") + ".getElementById('" + iFrameId + "')");
                if (iframe != null) {
                    iframe.onload = function () { //activate events once iframe modal is loaded
                        $("#" + modalId).modal("show");
                        removeUnclickableMenuCssClass();

                        //if any error occurs in form then it will redirect to err.aspx page, to avoid go back option from modal dialog we are hiding goback button. otherwise it will go bcak to previous opened forms in modal dialog itself
                        var mdlIframeSrc = $("#" + modalId).attr("data-iframe-src");
                        var curIframeSrc = $(iframe).contents().find("#form1").attr("action");
                        if (typeof curIframeSrc != "undefined" && mdlIframeSrc.indexOf(curIframeSrc.substr(1)) < 0) {
                            $(iframe).contents().find("#goback").hide();
                        }

                        dialogWindow = document.getElementById(iFrameId);

                        $(iframe.contentWindow.document).keydown(function (e) {
                            if (e.which == 27) { //close popup on click of escape key
                                var requiredConfirm = $('.modal').filter(".in").attr("data-confirm-leave") === "true";
                                var iFrameId = $('.modal').filter(".in").attr("data-iframe-id");
                                if (requiredConfirm && dialogWindow != undefined && dialogWindow.contentWindow.checkIfFormChanges != undefined && dialogWindow.contentWindow.checkIfFormChanges()) { //if required confirm dialog displays it, otherwise close current dialog
                                    dialogWindow.contentWindow.ConfirmLeave();
                                } else
                                    closeModalDialog();
                            }
                        });

                        if (requiredConfirm) {
                            $("#" + modalId).on('shown.bs.modal', function () {
                                //display confirm dialog if user clicks on modal close icon
                                $("[data-dismiss='confirm-modal-close']").unbind('click').bind('click', function () {
                                    if (dialogWindow != undefined && dialogWindow.contentWindow.checkIfFormChanges != undefined && dialogWindow.contentWindow.checkIfFormChanges())
                                        dialogWindow.contentWindow.ConfirmLeave();
                                    else
                                        closeModalDialog();
                                    actionsClicked = ""
                                });

                                if ($('.modal.in').length > 0) {
                                    $(".navbar-inner").unbind('click').bind('click', function (e) { //display confirm dialog if user clicks on header menu 
                                        //$(e.target)[0].id != "settingdropdown" &&
                                        if ($(e.target)[0].id != "Li1") {
                                            if (dialogWindow != undefined && dialogWindow.contentWindow.checkIfFormChanges != undefined && dialogWindow.contentWindow.checkIfFormChanges())
                                                if ($(e.target).closest('li').length > 0 && $(e.target).closest('li')[0].id == "li_Logout") {
                                                    dialogWindow.contentWindow.removeConfirmDialog();
                                                }
                                                else
                                                    dialogWindow.contentWindow.ConfirmLeave();
                                            else
                                                closeModalDialog();
                                        }
                                    });
                                }

                                $("body :not(.modal-header)").find(".modal").unbind('click').bind('click', function (e) {
                                    //display confirm dialog if user clicks on outside but not Modal header
                                    if ($(e.target)[0].id == modalId && dialogWindow != undefined && dialogWindow.contentWindow.checkIfFormChanges != undefined && dialogWindow.contentWindow.checkIfFormChanges())
                                        dialogWindow.contentWindow.checkIfFormChanges();
                                    else
                                        closeModalDialog();
                                    actionsClicked = ""
                                });

                                $("body").find(".modal").unbind('click').bind('click', function (e) {
                                    //if form is still loading, prevent if user clicks on outside the dialog
                                    if ($(e.target).hasClass("fade") && $(e.target).hasClass("in") && dialogWindow != undefined && dialogWindow.contentWindow.waitDialogUntilFormLoad != undefined && dialogWindow.contentWindow.waitDialogUntilFormLoad) {
                                        return;
                                    }
                                    //display confirm dialog if user clicks on modal outside
                                    if ($(e.target).hasClass("fade") && $(e.target).hasClass("in") && dialogWindow != undefined && dialogWindow.contentWindow.checkIfFormChanges != undefined && dialogWindow.contentWindow.checkIfFormChanges())
                                        dialogWindow.contentWindow.ConfirmLeave();
                                    else if ($(e.target).hasClass("fade") && $(e.target).hasClass("in"))
                                        closeModalDialog();
                                    actionsClicked = ""
                                });
                            });
                        } else { //close modal dialog if user clicks on modal outside
                            $("#" + modalId).on('shown.bs.modal', function () {
                                $(".navbar-inner").unbind('click').bind('click', function () {
                                    $(".navbar-inner").unbind('click');
                                    if ($('.modal.in').length > 0) {
                                        closeModalDialog();
                                    }
                                })
                            }).on("hidden.bs.modal", function () {
                                $(".navbar-inner").unbind('click');
                                closeModalDialog();

                            }).on("hide.bs.modal", function () {
                                $(".navbar-inner").unbind('click');

                                if ($("#" + modalId).next().hasClass("modal-backdrop"))
                                    $("#" + modalId).next().remove();
                                setTimeout(function () {
                                    $("#" + modalId).remove();
                                }, 300)
                            });
                        }
                    };
                }
            } else {
                $("#" + modalId).modal("show");
                //.draggable({
                //    handle: ".modal-header"
                //});

                $("body").keydown(function (e) {
                    if (e.which == 27) {
                        closeModalDialog();
                        e.stopPropagation();
                    }
                });
            }
        }, 200);
    }

    function BootstrapDialogAppParamsShow(url){
        let myModal = new BSModal("ApplicationParams", "Application Params", "<iframe src=\"" + url + "\" class='d-flex w-100 h-100'></iframe>", () => {
            //shown callback
            $(".btn-close").focus();
            // $("#btnClose").hide()
        }, () => {
            //hide callback
        });

        myModal.changeSize("fullscreen");
        myModal.hideFooter();
        myModal.modalBody.classList.add("p-0", "overflow-hidden");
        myModal.close();
    }

    //To close the Bootstrap modal dialog
    function closeModalDialog() {
        if ($(".jconfirm-box").length) {
            $(".jconfirm-box .jconfirm-buttons .coldbtn").click();
            return;
        }

        var count = 0;
        $(".modal").each(function () {
            count++;
        });
        //to remove active modal dialog
        if ($($(".modal")[count - 1]).next().hasClass("modal-backdrop"))
            $($(".modal")[count - 1]).next().remove();
        $($(".modal")[count - 1]).modal("hide");

        setTimeout(function () {
            $($(".modal")[count - 1]).remove();
            //if multiple popup's are opened, if any dialog is closed then make the current dialog as iframeid
            iFrameId = $(".custom-dialog").attr("data-iframe-id");
            dialogWindow = document.getElementById(iFrameId);
        }, 300)
        removeUnclickableMenuCssClass();
    }

    /**
     * generic LoadEvent Callback to remove headers from IView and TStruct.
     * @author Prashik
     * @Date   2019-06-27T11:45:39+0530
     */
    function removePageHeaders() {
        var glType = gllangType;
        var isRTL = false;
        var styleObj = {};
        if (glType == "ar") {
            isRTL = true;
            // styleObj = {
            //     "color": "rgb(255, 255, 255)",
            //     "opacity": "1",
            //     "position": "absolute",
            //     "top": "4px",
            //     "left": "20px",
            //     "background-color": "rgb(173, 167, 167)",
            //     "width": "25px",
            //     "height": "25px",
            //     "border-radius": "25px"
            // };
            styleObj = {
                "opacity": "1",
                "position": "absolute",
                "background-color": "rgb(255 255 255)",
                "height": "33px",
                "width": "33px",
                "cursor": "pointer",
                "-webkit-transition": "color .2s",
                "transition": "color .2s",
                "color": "#95979c",
                "border-radius": "50%",
                "font-size": "20px",
                "top": "2px",
                "right": "4px"
            };
        }
        else {
            isRTL = false;
            // styleObj = {
            //     "color": "rgb(255, 255, 255)",
            //     "opacity": "1",
            //     "position": "absolute",
            //     "top": "4px",
            //     "right": "20px",
            //     "background-color": "rgb(173, 167, 167)",
            //     "width": "25px",
            //     "height": "25px",
            //     "border-radius": "25px"
            // };
            styleObj = {
                "opacity": "1",
                "position": "absolute",
                "background-color": "rgb(255 255 255)",
                "height": "33px",
                "width": "33px",
                "cursor": "pointer",
                "-webkit-transition": "color .2s",
                "transition": "color .2s",
                "color": "#95979c",
                "border-radius": "50%",
                "font-size": "20px",
                "top": "2px",
                "right": "4px"
            };
        }

        var divId = $(".custom-dialog.modal[id^=divModal]:eq(0)").attr("id");
        var divIframeId = $(".custom-dialog.modal[id^=divModal]:eq(0)").data("iframeId");

        $("#" + divId + " .modal-content .modal-body").css({ "padding": "0px" });
        $("#" + divId + " .modal-content .modal-header").hide();
        $("#" + divId + " .modal-content .modal-body").prepend($("#" + divId + " .modal-content #btnModalClose").detach());
        $("#" + divId + " .modal-content #btnModalClose").css(styleObj);

        $("#" + divId + " .modal-dialog").css({ "margin": "0px auto" }).parent().css({ "top": "25px" });
    }

    $(document).ready(function () {
        if (typeof appGlobalVarsObject == "undefined") {
            appGlobalVarsObject = callParentNew("appGlobalVarsObject");
        }
        (appGlobalVarsObject?._CONSTANTS?.window || window).toastr.clear();
        setHybridLocations();

        // $("div").scroll(function () {
        //     $('#ui-datepicker-div, .ui-widget-content.acOpen').hide();
        // });

        //var parFrame = $("#axpiframe", parent.document);
        //var midFrm = $("#middle1", parent.document);    
        //if(parFrame.length > 0 && !eval(callParent('IsContentAxpIframe'))){
        //    parFrame[0].style.display = "none";
        //    parFrame[0].src = "";
        //    if(midFrm.length > 0)
        //        midFrm[0].style.width = "100%";
        //}

        //if Import data, Export data, Config app, Fast data utility menu drop down clicked then make the settings dropdown unclickable until the dialog opens
        $(".modal-dialog-events, .modal-dialog-events-settings").click(function () {
            $("#settingdropdown, #ExportImportCogIcon").addClass("menu-not-allowed");
        });

        ////if Change password/Trace file log menu drop down clicked then make the utilities dropdown unclickable until the dialog opens
        //$(".modal-dialog-events-settings").click(function () {
        //    $("#ExportImportCogIcon").addClass("menu-not-allowed");
        //})

        if(findGetParameter("AxPop") == "true" || findGetParameter("AxIsPop") == "true" || (typeof isIviewPopup != "undefined" && isIviewPopup)){
            iframePopupLoadOptsNew();
        }

        if (isMobileDevice()) {
            document.oncontextmenu = function () {
                return false;
            }
        }

        appGlobalVarsObject && appGlobalVarsObject._CONSTANTS.isHybridAddressBarVisible && $("body").addClass("isHybridAddressBarVisible");

    });

    $(window).bind("load", function () {
        if ($(window.frameElement).hasClass('bootStrapModal')) return false;
        if (window && window.frameElement && window.frameElement.id == "popupIframeRemodal") return false;
        // if (window && window.frameElement && window.frameElement.id == "axpiframeac") return false;     
        if (window && window.frameElement && window.frameElement.id.indexOf('iFrame') === 0) return false;
        if(typeof window.location.href!="undefined" && window.location.href.indexOf("adminconsole.aspx?")>0)return false;
        var newLoadUrl = window.location.href;
        callParentNew("updateAppLinkObj")?.(newLoadUrl,0,window?.frameElement?.id == "axpiframe");
    });

    //when settings dropdown option & utilities down option clicks on same time 2 popup's will appear at a time, to avoid this once click on one dropdown making other dropdown unclickable, once the first popup is loaded successfully then remove that dropdown unclickable class
    function removeUnclickableMenuCssClass() {
        $("#settingdropdown, #ExportImportCogIcon").removeClass("menu-not-allowed");
    }


    function getSession(key, cb) {
        $.ajax({
            type: "POST",
            url: "../WebService.asmx/GetSession",
            cache: false,
            async: false,
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({ key: key }),
            dataType: "json",
            success: function (data) {
                if (typeof cb == "function") {
                    cb(data);
                }
            },
        });
    }

    function SetSession({ key, val, async = true, cb = () => { }, appendVal = false, delimiter = "" }) {
    try {
        $.ajax({
            type: "POST",
            url: "../WebService.asmx/SetSession",
            cache: false,
            async,
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({ key: key, val: val, appendVal: appendVal, delimiter: delimiter }),
            dataType: "json",
            success: function (data) {
                if (typeof cb == "function") {
                    cb(data);
                }
            },
        });
} catch (ex) {
    console.warn("Error in SetSession Ajax call : " + ex.message);
}
}

function GetNewTabPageSess({ key, cb }) {
    try {
        $.ajax({
            type: "POST",
            url: "../WebService.asmx/GetNewTabPageSess",
            cache: false,
            async: true,
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({ key: key }),
            dataType: "json",
            success: function (data) {
                if (typeof cb == "function") {
                    cb(data);
                }
            },
        });
    } catch (e) {
        console.warn("Error in GetNewTabPageSess Ajax call : " + ex.message);
    }
}

//Moved this function from CommonBuilder.js to here.
function tabFocusEventHandler(task, parentId, loopInsideParent, enableForParentOnly, exceptions) {
    if (task === "unbind") {
        $(document).off("keydown.loopingInsideParent" + parentId);
        return;
    }

    var allFocusableElems = "a:visible,input:enabled,select:enabled,button:enabled,textarea:enabled";
    var parentElem = $("#" + parentId);
    var allFocusableElemsList = parentElem.find(allFocusableElems).not("[tabindex='-1']");
    allFocusableElemsList.first().focus();
    if (loopInsideParent) {
        var firstFocusableElem = allFocusableElemsList.first();
        var lastFocusableElem = allFocusableElemsList.last();
        $(document).off("keydown.loopingInsideParent" + parentId);

        var docToEnable;
        if (enableForParentOnly != undefined && enableForParentOnly)
            docToEnable = parentElem;
        else
            docToEnable = $(document);

        docToEnable.on("keydown.loopingInsideParent" + parentId, function (event) {
            if (!event.shiftKey && event.keyCode == 9) {
                //tab key
                if ($(document.activeElement)[0] == lastFocusableElem[0]) {
                    event.preventDefault()
                    firstFocusableElem.focus();
                }
            } else if (event.shiftKey && event.keyCode == 9) {
                //tab key + shift
                if ($(document.activeElement)[0] == firstFocusableElem[0]) {
                    event.preventDefault();
                    lastFocusableElem.focus();
                }
            }
        })
    }
}

function UnlockConfigApp({ forceUnlock = false, cb }) {
    try {
        $.ajax({
            type: "POST",
            url: "../WebService.asmx/UnlockConfigApp",
            data: JSON.stringify({ forceUnlock: forceUnlock }),
            cache: false,
            async: true,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (typeof cb == "function") {
                    cb(data);
                }
            },
        });
    }
    catch (ex) {
        console.warn("Error in UnlockConfigApp : " + ex.message);
    }
}
var AxClColors = {
    //clNone: "#1FFFFFFF",
    clNone: "transparent",
    clAqua: "#00FFFF",
    clBlack: "#000000",
    clBlue: "#0000FF",
    clCream: "#FFFBF0",
    clDkGray: "#808080",
    clFuchsia: "#FF00FF",
    clGray: "#808080",
    clGreen: "#008000",
    clLime: "#00FF00",
    clLtGray: "#C0C0C0",
    clMaroon: "#800000",
    clMedGray: "#A0A0A4",
    clMoneyGreen: "#C0DCC0",
    clNavy: "#000080",
    clOlive: "#808000",
    clPurple: "#800080",
    clRed: "#FF0000",
    clSilver: "#C0C0C0",
    clSkyBlue: "#A6CAF0",
    clTeal: "#008080",
    clWhite: "#FFFFFF",
    clYellow: "#FFFF00",
    clWindowText: "",
    Clwindow: "#FFFFFF"
};


function CheckSpecialChars(str) {
    if (str == undefined || str == null)
        return "";

    str = str.replace(/&/g, '&amp;');
    str = str.replace(/</g, '&lt;');
    str = str.replace(/>/g, '&gt;');
    str = str.replace(/'/g, '&apos;');
    str = str.replace(/"/g, '&quot;');
    return str;
}

function ReverseCheckSpecialChars(str) {

    if (str == undefined || str == null)
        return "";

    str = str.replace(/&amp;/g, '&');
    str = str.replace(/&lt;/g, '<');
    str = str.replace(/&gt;/g, '>');
    str = str.replace(/&apos;/g, '\'');
    str = str.replace(/&quot;/g, '"');
    str = str.replace(/&nbsp;/g, ' ');
    str = str.replace(/;bkslh/g, '\\');
    return str;
}


function ReverseCheckSpecialCharsInQuery(str) {
    if (str == undefined || str == null)
        return "";

    str = str.replace(/&amp;/g, '&');
    str = str.replace(/&lt;/g, '<');
    str = str.replace(/&gt;/g, '>');
    str = str.replace(/&apos;/g, '\'');
    str = str.replace(/&quot;/g, '"');
    return str;
}


function CheckUrlSpecialChars(str) {
    if (str == undefined || str == null)
        return "";
    str = str.replace(/%/g, '%25');
    str = str.replace(/#/g, '%23');
    str = str.replace(/&/g, '%26');
    str = str.replace(/'/g, '%27');
    str = str.replace(/\"/g, '%22');
    str = str.replace(/\+/g, '%2b');
    str = str.replace(/</g, '%3C');
    str = str.replace(/\\/g, '%5C');
    str = str.replace(/ /g, '%20');
    return str;
}

function findGetParameter(parameterName, locationData = location.search) {
    var result = null,
        tmp = [];
    locationData = locationData || "";
    locationData
        .substr(locationData.indexOf("?") + 1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0].toLowerCase() === parameterName.toLowerCase()) result = decodeURIComponent(tmp[1]);
        });
    return result;
}
    function isMobileDevice() {
        return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('Mobile') !== -1) || isiOS;
    }

    function getCaseInSensitiveJsonProperty(obj, propertyName) {
        let reg = new RegExp(`^${propertyName}$`, "i");
        return Object.keys(obj).reduce((result, key) => {
            if (reg.test(key)) result.push(obj[key]);
            return result;
        }, []);
    }

    /**
     * @description : Load Css and Js files dynamically and execute callback on completion
     * @author Prashik
     * @date 2019-08-28
     * @function loadAndCall
     */
    const loadAndCall = (function (_opts) {
        var _options = {
            files: {
                css: [],// ["/Css/file.css", "/Css/file.css"]
                js: []// ["/Js/file.js", "/Js/file2.js"]
            },
            callBack: "",
            mapCustomPath: false,
            win: window
        }
        $.extend(_options, _opts);
        var _callBackValidator = 0
        var _allFilesLoadedValidator = function (_fileType) {
            if (_fileType == "css" && _options.files[_fileType].length == 0) {
                _fileType = "js";
            }

            var _folderPath = `..${(_options.mapCustomPath ? ("/" + callParentNew("thmProj")) : "")}`;
            if (_fileType && _options.files && _options.files[_fileType] && _options.files[_fileType].length > 0) {
                var filePath = _options.files[_fileType].splice(0, 1);
                var fileFullPath = (filePath[0].indexOf("://") > -1 ? "" : _folderPath) + filePath;
                
                if (_fileType == "css") {
                    if(!_options.win.document.getElementsByTagName("head")[0].querySelectorAll(`link[href='${fileFullPath}']`).length){
                        var _link = _options.win.document.createElement("link")
                        _link.rel = "stylesheet";
                        _addFilesAndEvents(_link, fileFullPath, "css");
                    } else {
                        _allFilesLoadedValidator(_fileType);
                    }
                }else if (_fileType == "js"){
                        if(!_options.win.document.getElementsByTagName("head")[0].querySelectorAll(`script[src='${fileFullPath}']`).length){
                        var _script = _options.win.document.createElement("script")
                        _script.type = "text/javascript";
                        _addFilesAndEvents(_script, fileFullPath, "js");
                    } else {
                        _allFilesLoadedValidator(_fileType);
                    }
                }
            } else {
                _options.callBack();
            }
        }
        var _addFilesAndEvents = function (_addedFile, _pathUrl, _fileType) {
            _addedFile.onload = function () {
                _allFilesLoadedValidator(_fileType);
            };
            _addedFile.onerror = function () {
                _allFilesLoadedValidator(_fileType);
            };

            if (_fileType == "css") {
                _addedFile.href = _pathUrl;
            } else if (_fileType == "js") {
                _addedFile.src = _pathUrl;
            }
            _options.win.document.getElementsByTagName("head")[0].appendChild(_addedFile);
        }
        var fileTypeToLoad = "";

        if (_options.files.css && _options.files.css.length > 0) {
            fileTypeToLoad = "css";
        } else if (_options.files.js && _options.files.js.length > 0) {
            fileTypeToLoad = "js";
        }

        _allFilesLoadedValidator(fileTypeToLoad);
    });

    /**
     * @description : Render an templete dynamically on demand in templetes exact container
     * @author Prashik
     * @date 2019-08-28
     * @function loadAndCall
     */
    const renderTemplete = function (templateContent) {
        const template = document.querySelector(templateContent);
        if (template) {
            let templateContent = null;
            if(template.content){
                templateContent = template.content

                try {
                    templateContent.children[0].classList.add("templateRendered");
                } catch (ex) {}
            }else{
                templateContent = createElementFromHTML(template.innerHTML);

                try {
                    templateContent.classList.add("templateRendered");
                } catch (ex) {}
            }

            if(templateContent){

                const node = document.importNode(templateContent, true);
                if (node) {
                    // node.classList.add("renderTemplete");
                    var temp = template.parentElement.insertBefore(node, template);
                }
            }
        }
    }

    function createElementFromHTML(htmlString) {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild;
    }

    /**
     * @description: Get class starting with from class list
     * @author Prashik
     * @date 2020-02-05
     * @param {*} classString: full list of classes
     * @param {*} matchClass: searching class start index
     * @returns 
     */
    function getClassStartingWith(classString, matchClass) {
        return $.grep(classString.split(" "), function (v, i) {
            return v.indexOf(matchClass) === 0;
        }).join()
    }

    function getRedisString(key, id, user = "ALL") {
        var result = "";
        $.ajax({
            type: "POST",
            url: "../WebService.asmx/GetRedisString",
            cache: false,
            async: false,
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                key, id, user
            }),
            dataType: "json",
            success: function (data) {
                if (data.d != null)
                    result = data.d;
            },
        });
        return result;
    }

    function setHybridLocations() {
        if (appGlobalVarsObject && appGlobalVarsObject._CONSTANTS.isHybrid) {
            navigator.geolocation.getCurrentPositionOld = navigator.geolocation.getCurrentPosition;
            navigator.geolocation.getCurrentPosition = function (callback) {
                var returnData;
                try {
                    returnData = JSON.parse(getRedisString("hybridinfo", callParentNew("hybridGUID"))).location;
                } catch (ex) { }
                if (returnData) {
                    return callback(returnData);
                } else {
                    return navigator.geolocation.getCurrentPositionOld(callback);
                }
            }
        }
    }

    /**
     * @description: To check scrollbar exists or not for an element
     * @author Prashik
     * @date 2020-04-06
     */
    $ && ($.fn.hasScrollBar = function () {
        return this.get(0).scrollHeight > this.height();
    })

    function UpdateExceptionMessageInET(strMsg){  
        try{
            let appSUrl = top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/"));
            if(typeof localStorage["ExecutionLogText-"+appSUrl]=="undefined")
                localStorage.setItem("ExecutionLogText-" + appSUrl, strMsg);
            else
            {
                let ExecutionLogText =localStorage["ExecutionLogText-" + appSUrl];
                localStorage.setItem("ExecutionLogText-" + appSUrl,ExecutionLogText + strMsg+"♦");
            }
        }catch(ex){
            if(ex.message.indexOf('exceeded the quota')>-1){
                callParentNew("ExecutionTraceExceededQuota("+strMsg+")", "function");                
            }
        }
    }

    function GetProcessTime(){    
        try{
            let appSUrl = top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/"));
            let bst = localStorage["BST-" + appSUrl];
            let bsttime = new Date(bst.split('-')[2].split(' ')[0], bst.split('-')[1] - 1, bst.split('-')[0], bst.split(':')[0].split(' ')[1], bst.split(':')[1], bst.split(':')[2], bst.split('.')[1]).getTime();
            let ct= localStorage["ProcessBlockTime-" + appSUrl];
            let cttime = new Date(ct.split('-')[2].split(' ')[0], ct.split('-')[1] - 1, ct.split('-')[0], ct.split(':')[0].split(' ')[1], ct.split(':')[1], ct.split(':')[2], ct.split('.')[1]).getTime();

            let currentTime = new Date().getTime(); 
            let ptDiff=(currentTime-cttime).toFixed(4);
            var strMsg="Preparing request in client, "+ptDiff +" ms ♦ ";
            localStorage.setItem("ProcessBlockTimeTaken-"+appSUrl,ptDiff);
            if(typeof localStorage["ExecutionLogText-"+appSUrl]=="undefined")
                localStorage.setItem("ExecutionLogText-" + appSUrl, strMsg);
            else
            {
                let ExecutionLogText =localStorage["ExecutionLogText-" + appSUrl];
                localStorage.setItem("ExecutionLogText-" + appSUrl,ExecutionLogText + strMsg);
            }
            let brcurrentTime = new Date().getTime(); 
            callParentNew("browserElapsTime=", (brcurrentTime-bsttime));
        }catch(ex){
            if(ex.message.indexOf('exceeded the quota')>-1){
                callParentNew("ExecutionTraceExceededQuota('')", "function");                
            }
        }
    }

    function WireElapsTime(serverprocesstime,requestProcess_logtime,ajaxReqRep=false)
        {
            try{
                let appSUrl = top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/"));
                let ExecutionLogText =localStorage["ExecutionLogText-" + appSUrl];
                localStorage.setItem("ExecutionLogText-" + appSUrl,ExecutionLogText + requestProcess_logtime);

                //let pst = localStorage["ProcessStartTime-" + appSUrl];
                let pst = localStorage["ProcessBlockTime-" + appSUrl];        
                let psttime = new Date(pst.split('-')[2].split(' ')[0], pst.split('-')[1] - 1, pst.split('-')[0], pst.split(':')[0].split(' ')[1], pst.split(':')[1], pst.split(':')[2], pst.split('.')[1]).getTime();
               
                let crtDt = new Date();
                let currentTime = crtDt.getTime();        
                var clientWireTime=(currentTime-psttime);
                clientWireTime=clientWireTime-parseFloat(serverprocesstime);

                let pbtt = localStorage["ProcessBlockTimeTaken-" + appSUrl];     
                clientWireTime=clientWireTime-pbtt;

                clientWireTime=clientWireTime.toFixed(4);

                //var strMsg=ExecutionLogText + requestProcess_logtime+ "Response received in client, wire transfer time "+clientWireTime +" ms ♦ ";

                var strMsg='';
                if(ajaxReqRep)
                    strMsg= ExecutionLogText + requestProcess_logtime+ "Request and Response wire transfer time "+clientWireTime +" ms ♦ ";
                else
                    strMsg= ExecutionLogText + requestProcess_logtime+ "Response received in client, wire transfer time "+clientWireTime +" ms ♦ ";

                localStorage.setItem("ExecutionLogText-" + appSUrl,strMsg);     
                var ct = new Date();
                var ctTime = ct.getDate() + "-" + (ct.getMonth() + 1) + "-" + ct.getFullYear() + " " + ct.getHours() + ":" + ct.getMinutes() + ":" + ct.getSeconds() + "." + ct.getMilliseconds();
                localStorage.setItem("ProcessBlockTime-" + appSUrl,ctTime);
                //return ctTime;
            }catch(ex){
                if(ex.message.indexOf('exceeded the quota')>-1){
                    callParentNew("ExecutionTraceExceededQuota("+requestProcess_logtime+")", "function");                
                }
            }
        }

        function GetCurrentTime(strVar)
        {
            try{
                let appSUrl = top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/"));   
                var ct = new Date();
                var ctTime = ct.getDate() + "-" + (ct.getMonth() + 1) + "-" + ct.getFullYear() + " " + ct.getHours() + ":" + ct.getMinutes() + ":" + ct.getSeconds() + "." + ct.getMilliseconds();
                localStorage.setItem("ProcessStartTime-" + appSUrl,ctTime);
                localStorage.setItem("ProcessBlockTime-" + appSUrl,ctTime);
                localStorage.setItem("ExecutionLogText-" + appSUrl,strVar+" process started at "+ ctTime+" ♦♦ ");
            }catch(ex){
                if(ex.message.indexOf('exceeded the quota')>-1){
                    callParentNew("ExecutionTraceExceededQuota("+strVar+")", "function");                
                }
            }
        }

        function GetTotalElapsTime()
        {
            try{
                let appSUrl = top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/"));      
                let psTime= localStorage["ProcessStartTime-" + appSUrl];
                let ProcessStartTime = new Date(psTime.split('-')[2].split(' ')[0], psTime.split('-')[1] - 1, psTime.split('-')[0], psTime.split(':')[0].split(' ')[1], psTime.split(':')[1], psTime.split(':')[2], psTime.split('.')[1]).getTime();
                let currentTime = new Date().getTime(); 
                var et = new Date();
                var etTime = et.getDate() + "-" + (et.getMonth() + 1) + "-" + et.getFullYear() + " " + et.getHours() + ":" + et.getMinutes() + ":" + et.getSeconds() + "." + et.getMilliseconds();

                var TotalElp=currentTime-ProcessStartTime;

                let ExecutionLogText =localStorage["ExecutionLogText-" + appSUrl];
                ExecutionLogText+=" ♦ Total time elapsed "+TotalElp +" ms ♦ ";
                ExecutionLogText+="Process ended at "+etTime+" ♦";
                localStorage.setItem("ExecutionLogText-" + appSUrl,ExecutionLogText);     

                if(typeof localStorage["ExecutionLogText-"+appSUrl]!="undefined"){
                    let ExecutionEndText =localStorage["ExecutionLogText-" + appSUrl];
                    if(typeof localStorage["ExecutionFullLog-"+appSUrl]=="undefined")
                        localStorage.setItem("ExecutionFullLog-" + appSUrl, ExecutionEndText);
                    else
                    {
                        let ExecutionLongText =localStorage["ExecutionFullLog-" + appSUrl];
                        localStorage.setItem("ExecutionFullLog-" + appSUrl,ExecutionLongText + " ♦♦ "+ExecutionEndText);
                    }
                }
            }catch(ex){
                if(ex.message.indexOf('exceeded the quota')>-1){
                    callParentNew("ExecutionTraceExceededQuota('')", "function");                
                }
            }
        }


        function AdditionalRunTimeMsg(strRuntimemsg){     
            try{
                let appSUrl = top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/")); 
                if(typeof localStorage["ExecutionLogText-"+appSUrl]=="undefined")
                    localStorage.setItem("ExecutionLogText-" + appSUrl, strRuntimemsg+" ♦ ");
                else
                {
                    let ExecutionLogText =localStorage["ExecutionLogText-" + appSUrl];
                    localStorage.setItem("ExecutionLogText-" + appSUrl,ExecutionLogText + " ♦ "+strRuntimemsg+" ♦ ");
                }
            }catch(ex){
                if(ex.message.indexOf('exceeded the quota')>-1){
                    callParentNew("ExecutionTraceExceededQuota("+strRuntimemsg+")", "function");                
                }
            }
        }

function iframePopupLoadOpts(dialogWindow){
    if (dialogWindow[0].contentWindow.$) {
        dialogWindow.contents().find("head")
            .append($(`
            <style>
                html {
                    overflow: hidden;
                }
                #backforwrdbuttons {
                    display: none;
                }
                a[onclick^="javascript:CallListView("] {
                    display: none !important;
                }
                #new,.ftbtn_iNewLi {
                    display: none !important;
                }
                #dvGoBack {
                    display: none !important;
                }
                #ivInSearch {
                    right: 30px;
                    top:0px;
                }

                .toolbarRightMenu{
                    position: relative;
                    right: 50px !important;
                }

                .requestJSON #ivInSearch {
                    position: absolute;
                }
                .requestJSON.isMobile #ivInSearch {
                    right: 40px;
                }
                .requestJSON.requestJsonOldUi #ivInSearch {
                    top:5px;
                }
                .btextDir-rtl #ivInSearch {
                    left: 25px;
                    right: auto;
                }
                .btextDir-rtl.requestJsonOldUi #ivInSearch{
                    left:40px;
                    top:4px;
                }
                .btextDir-rtl.requestJSON:not(.requestJsonOldUi).isMobile #ivInSearch{
                    left: 26px;
                }
                .requestJSON.isMobile #ivInSearch ul#iconsUl,
                .requestJSON.isMobile #ivInSearch ul#iconsExportUl,
                .requestJSON.isMobile #ivInSearch ul.dropDownButton__list.dropdown-menu {
                    right: -23px !important;
                }
                .btextDir-rtl.requestJSON.isMobile #ivInSearch ul#iconsUl,
                .btextDir-rtl.requestJSON.isMobile #ivInSearch ul#iconsExportUl,
                .btextDir-rtl.requestJSON.isMobile #ivInSearch ul.dropDownButton__list.dropdown-menu {
                    left: -12px !important;
                    right: auto !important;
                }
                .requestJSON.isMobile div#searchBar #iconsNew .searchBoxChildContainer {
                    right: -17px !important;
                }
                .btextDir-rtl.requestJSON.isMobile div#searchBar #iconsNew .searchBoxChildContainer {
                    left: 0px !important;
                    right: auto !important;
                }
                .btextDir-rtl div#searchBar {
                    right: -16px !important;
                }
            </style>
            `));
        dialogWindow.contents().find("head")
            .append($(`
            <script>
                $(document).ready(function () {
                    if ($('[id^=gridToggleBtn]').length > 0 && recordid != '0') {
                        $($('[id^=gridToggleBtn]')).each(function (index) {
                            toggleTheEditLayout($('[id^=gridToggleBtn]')[index].id.substr($('[id^=gridToggleBtn]')[index].id.indexOf('gridToggleBtn') + 13));
                        });
                    }
                });
                window['isAxpertPopup'] = true;
            </script>
            `));
        // hiding popup struct buttons except save
    }
}

function iframePopupLoadOptsNew(){
    if ($) {
        $("head")
            .append($(`
            <style>
                html {
                    overflow: hidden;
                }
                #backforwrdbuttons {
                    display: none;
                }
                a[onclick^="javascript:CallListView("] {
                    display: none !important;
                }
                #new,.ftbtn_iNewLi {
                    display: none !important;
                }
                #dvGoBack {
                    display: none !important;
                }
                #ivInSearch {
                    right: 30px;
                    top:0px;
                }

                .toolbarRightMenu{
                    position: relative;
                    right: 50px !important;
                }

                .requestJSON #ivInSearch {
                    position: absolute;
                }
                .requestJSON.isMobile #ivInSearch {
                    right: 40px;
                }
                .requestJSON.requestJsonOldUi #ivInSearch {
                    top:5px;
                }
                .btextDir-rtl #ivInSearch {
                    left: 25px;
                    right: auto;
                }
                .btextDir-rtl.requestJsonOldUi #ivInSearch{
                    left:40px;
                    top:4px;
                }
                .btextDir-rtl.requestJSON:not(.requestJsonOldUi).isMobile #ivInSearch{
                    left: 26px;
                }
                .requestJSON.isMobile #ivInSearch ul#iconsUl,
                .requestJSON.isMobile #ivInSearch ul#iconsExportUl,
                .requestJSON.isMobile #ivInSearch ul.dropDownButton__list.dropdown-menu {
                    right: -23px !important;
                }
                .btextDir-rtl.requestJSON.isMobile #ivInSearch ul#iconsUl,
                .btextDir-rtl.requestJSON.isMobile #ivInSearch ul#iconsExportUl,
                .btextDir-rtl.requestJSON.isMobile #ivInSearch ul.dropDownButton__list.dropdown-menu {
                    left: -12px !important;
                    right: auto !important;
                }
                .requestJSON.isMobile div#searchBar #iconsNew .searchBoxChildContainer {
                    right: -17px !important;
                }
                .btextDir-rtl.requestJSON.isMobile div#searchBar #iconsNew .searchBoxChildContainer {
                    left: 0px !important;
                    right: auto !important;
                }
                .btextDir-rtl div#searchBar {
                    right: -16px !important;
                }
            </style>
            `));
        $("head")
            .append($(`
            <script>
                $(document).ready(function () {
                    if ($('[id^=gridToggleBtn]').length > 0 && recordid != '0') {
                        $($('[id^=gridToggleBtn]')).each(function (index) {
                            toggleTheEditLayout($('[id^=gridToggleBtn]')[index].id.substr($('[id^=gridToggleBtn]')[index].id.indexOf('gridToggleBtn') + 13));
                        });
                    }
                });
                window['isAxpertPopup'] = true;
            </script>
            `));
        // hiding popup struct buttons except save
    }
}

function getProjectAppLogo(proj, async = false, success=(data)=>{}, error=(err)=>{}){
    var returnData = "";
    $.ajax({
        type: "POST",
        url: "../WebService.asmx/GetProjectAppLogo",
        cache: false,
        data:  JSON.stringify({projName: proj}),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async,
        success(data){
            if(async){
                success(data);
            }else{
                returnData = data.d;
            }
        },
        error(err)
        {
            if(async){
                error(err);
            }else{
                returnData = data;
            }
        },
        failure(err)
        {
            if(async){
                error(err);
            }else{
                returnData = data;
            }
        }
    });
    return returnData;
}

function createPopup (modalBodyLink, delayLoad = false) {

    try {
        var modalId = "loadPopUpPage";

        var iFrameModalBody = `<iframe id="${modalId}" name="${modalId}" class="col-12 flex-column-fluid w-100 h-100 p-0 my-n1" src="${delayLoad ? "" : modalBodyLink}" frameborder="0" allowtransparency="True"></iframe>`;

        let myModal = new BSModal(modalId, "", iFrameModalBody,
        (opening) => {
            if(delayLoad){
                try {
                    myModal.modalBody.querySelector(`#${modalId}`).contentWindow.location.href = modalBodyLink;
                } catch (ex) {}
            }
        },
        (closing) => {
            /**
             * @description nested child popup closing logic
             * @author Prashik 
             */
            try {                
                if(closingModal = $((function getClosingModal(frame) {
                    if(innerFrame = frame.contentDocument?.getElementById(myModal.elementId)?.querySelectorAll(`iframe[name=${myModal.elementId}]`)?.[0]) {
                        return getClosingModal(innerFrame);
                    }
                    else {
                        return frame;
                    }
                })(myModal.modal._element.querySelectorAll(`iframe[name=${myModal.elementId}]`)?.[0])).parents(".modal")){
                    if(!$((myModal.modal._element.querySelectorAll(`iframe[name=${myModal.elementId}]`)?.[0])).parents(".modal").is(closingModal)){
                        closingModal?.[0].dispatchEvent(new CustomEvent("close"));
                        closing.preventDefault();
                        return;
                    }
                }
            } catch (ex) {}

            var isAxPop = modalBodyLink.indexOf("AxPop=true") > -1;

            if (isAxPop && (window.document.title == "Iview" || window.document.title == "Listview")) {
                if(eval(callParent('isSuccessAlertInPopUp'))){
                    eval(callParent('isSuccessAlertInPopUp') + "= false");
                    try {
                        callParentNew("updateSessionVar")('IsFromChildWindow', 'true')
                    } catch (ex) {}
                    // if (eval(callParent('isRefreshParentOnClose'))) {
                    //     eval(callParent('isRefreshParentOnClose') + "= false");
                    //     window.location.href = window.location.href;
                    // }
                    //else if(isRefresh){
                    //    window.location.href = window.location.href;
                    //}
                    window.location.href = window.location.href;
                } else {
                    try {
                        scrollToLastKnownDrilldown();
                    } catch (ex) {}
                }
                
            }
        }
        );
        
        myModal.changeSize("fullscreen");
        myModal.hideHeader();
        myModal.hideFooter();        
        myModal.showFloatingClose();
        myModal.modalBody.classList.add("p-0", "overflow-hidden");
    } catch (error) {
        showAlertDialog("error", error.message);
    }    
}

/**
 * @description A helper function to check whether the file exists or not in the "fileUrl" provided
 * @date 2022-07-01
 * @param {string} fileUrl => provide full file path
 * @returns true if file exists else false
 */
function UrlExists(fileUrl)
{
    var http = new XMLHttpRequest();
    http.open('HEAD', fileUrl, false);
    http.send();
    return http.status != 404;
}

function callRuntimeStudio(additionalInfo){
    try {
        $.ajax({
            type: "POST",
            url: "../WebService.asmx/GetAxpertCunfigInfo",
            data: JSON.stringify({ additionalInfo }),
            cache: false,
            async: false,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data.d != "") {
                    callParentNew(`showWorkBench(` + data.d + `)`, `function`);
                }
            },
        });

    } catch (ex) { }
}

function callAxpertConfigStudio(configType, sourceTransId, sourceCaption) {
    try {
        if (configType == "addform") {
            sourceTransId = document.getElementById("addFormTransId").value;
            sourceCaption = document.getElementById("addFormCaption").value;
            if (sourceTransId == "" || sourceCaption == "") {
                return showAlertDialog("warning", "Please fill the fields");
            } else if (sourceTransId.length > 5) {
                return showAlertDialog("warning", "Form Name cannot be greater than 5 characters");
            }
            callParentNew("axpstudioaddform", "id").dispatchEvent(new CustomEvent("close"));
        }
        configType = configType + "~" + sourceTransId + "~" + sourceCaption;

        callRuntimeStudio(configType);
    } catch (ex) { }
}

/**
 *  @description : A modal for Axpert Studio's get "Add New Form" input*/
function getAxpertStudioAddFormData() {
    var addFormDetailsHTML = `
    <div class="col-12">
        <label for="addFormId" class="form-label fw-boldest required">Form Name</label>
        <input type="text" class="form-control" id="addFormTransId" placeholder="(Trans ID)">
    </div>
    <div class="col-12">
        <label for="addFormCaption" class="form-label fw-boldest required">Form Caption</label>
        <input type="text" class="form-control" id="addFormCaption" placeholder="Axpert Form">
    </div>
    `;
    let myModal = new BSModal("axpstudioaddform", "Add Form", addFormDetailsHTML, () => {
        //shown callback
    }, () => {
        //hide callback
    });

    myModal.okBtn.removeAttribute("data-bs-dismiss");
    myModal.okBtn.setAttribute(`onClick`, `return callAxpertConfigStudio("addform", "", "")`);
}

/**
 * @description: get css property for specified classes
 * @author Prashik
 * @date 14/12/2022
 * @param {*} attrName: attribute name
 * @param {*} attrValue: classes seperated by comma
 * @param {*} cssProperty: css property to get value of
 * @return {*}  
 */
function getCssByAttr(attrName = "class", attrValue, cssProperty){
    var cssValue = "";

    var dummyDiv;
    
    $("body").append(dummyDiv = $(`<div ${attrName}="${attrValue}" />`));

    try {
        cssValue = dummyDiv.css(cssProperty);
    } catch (ex) {}

    try {
        dummyDiv.remove();
    } catch (ex) {}

    return cssValue;
}



function rgbToHex(rgb) {
    var rgbRegex = /^rgb\(\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*\)$/;
    var result, r, g, b, hex = "";
    if ( (result = rgbRegex.exec(rgb)) ) {
        r = componentFromStr(result[1], result[2]);
        g = componentFromStr(result[3], result[4]);
        b = componentFromStr(result[5], result[6]);

        hex = "#" + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    return hex;

    function componentFromStr(numStr, percent) {
        var num = Math.max(0, parseInt(numStr, 10));
        return percent ?
            Math.floor(255 * Math.min(100, num) / 100) : Math.min(255, num);
    }
}

function getInternalSSOToken(_thisProj) {
    $.ajax({
        type: "POST",
        url: "../WebService.asmx/GetInternalSSOToken",
        cache: false,
        async: false,
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({ _thisProj: _thisProj }),
        dataType: "json",
        success: function (data) {
            if (data.d != "") {
                window.open(data.d);
            }
        },
    });
}