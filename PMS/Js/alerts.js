//<Module>  Custom ALerts </Module>
//<Author>  Prashik  </Author>
//<Description> Modern Alerts instead of using alert() we use showAlertDialog(title, message, functionality) with title success/failure/info/warning </Description>

function showAlertDialog(title, message, messageType, messageVars, functionality, hold, isLandingPageSuccess) {
    var alertsTimeout = parseInt(callParentNew("alertsTimeout"), 10) || 3000;
    // to enable error timeout
    var errorEnable = JSON.parse(callParentNew("errorEnable") || false);
    var errorTimeout = parseInt(callParentNew("errorTimeout"), 10) || 0;
    try {
        if (messageType == "client") {
            if (typeof LoadglLangauge === "undefined")
                message = eval(callParent("LoadglLangauge(" + message + ")", "function"));
            else
                message = LoadglLangauge(message);
        }
        if (messageVars != undefined && messageVars != "") {
            var messageVarArray = messageVars.split("^♠^");
            for (var i = 0; i < messageVarArray.length; i++) {
                message = message.replace("{" + i + "}", messageVarArray[i]);
            }
        }
    }
    catch (ex) {
    }

    functionality == undefined ? functionality = "" : "";

    var shMessage = "";
    var wrapperClassForApp = "";
    try {
        if (parent.document.location.href.indexOf("mainnew.aspx") != -1 && typeof isCloudApp != "undefined") {
            wrapperClassForApp = "shortMessageWrapperInApp";
        }
    } catch (Exception) {

    }
    shMessage = "<div class='shortMessageWrapper " + wrapperClassForApp + " animated pulse'>";
    if (isLandingPageSuccess) {
        title = "loadSuccess";
    }
    else if (title == "success" && (functionality.indexOf("load~") != -1 || functionality.indexOf("reload") != -1)) {
        title = "loadSuccess";
    }
    switch (title) {
        case "success":
            shMessage += '<div class="alert agc-alert-wrapper alert-success agc-alert-success">';
            if (hold == true || hold == "True")
                shMessage += '<a href="javascript:void(0)" id="btnMsgClose" class="close agc-close-btn" data-dismiss="alert" aria-label="close"  onclick="hideAlertDialog(\'' + functionality + '\');">&times;</a>';
            shMessage += '<span class="fa fa-check agc-alert-icon-wrapper"></span>';
            break;
        case "warning":
            if (typeof actionCallbackFlag != "undefined") {
                actionCallbackFlag = actionCallFlag;
                $("#icons,#btnSaveTst,.BottomToolbarBar a,.wizardNextPrevWrapper").css({ "pointer-events": "auto" });
            }
            shMessage += '<div class="alert agc-alert-wrapper alert-warning agc-alert-warning">';
            if (hold == true || hold == "True")
                shMessage += '<a href="javascript:void(0)" id="btnMsgClose" class="close agc-close-btn" data-dismiss="alert" aria-label="close"  onclick="hideAlertDialog(\'' + functionality + '\');">&times;</a>';
            shMessage += '<span class="fa fa-exclamation-triangle agc-alert-icon-wrapper"></span>';
            break;
        default:
        case "error":
        case "failure":
            if (typeof actionCallbackFlag != "undefined") {
                actionCallbackFlag = actionCallFlag;
                $("#icons,#btnSaveTst,.BottomToolbarBar a,.wizardNextPrevWrapper").css({ "pointer-events": "auto" });
            }
            shMessage += '<div class="alert agc-alert-wrapper alert-danger agc-alert-error">';
            shMessage += '<a href="javascript:void(0)" id="btnMsgClose" class="close agc-close-btn" data-dismiss="alert" aria-label="close"  onclick="hideAlertDialog(\'' + functionality + '\',\'Error\');">&times;</a>';
            shMessage += '<span class="fa fa-remove agc-alert-icon-wrapper"></span>';
            if (hold == undefined) {
                hold = true;
            }
            break;
        case "info":
            shMessage += '<div class="alert agc-alert-wrapper alert-info agc-alert-info">';
            shMessage += '<a href="javascript:void(0)" id="btnMsgClose" class="close agc-close-btn" data-dismiss="alert" aria-label="close"  onclick="hideAlertDialog(\'' + functionality + '\');">&times;</a>';
            shMessage += '<span class="fa fa-info agc-alert-icon-wrapper"></span>';
            break;
            return;
    }

    if (title == "loadSuccess") {
        var keyinput = "axpertSuccessMessage";
        if (typeof (window.localStorage) != 'undefined') {
            window.localStorage.setItem(keyinput, message);
        }
        else {
            throw "window.localStorage, not defined";
        }
    }

    shMessage += message;
    shMessage += "</div>";
    shMessage += "</div>";
    if (title != "loadSuccess") {
        try {
            try {
                if((appGlobalVarsObject?._CONSTANTS?.window || window).$("#toast-container .toast:last").is(".toast-error")) {
                    (appGlobalVarsObject?._CONSTANTS?.window || window).toastr.clear((appGlobalVarsObject?._CONSTANTS?.window || window).$("#toast-container .toast:last"))
               }
            } catch (error) {
                
            }
            (appGlobalVarsObject?._CONSTANTS?.window || window).toastr[["success", "warning", "info"].indexOf(title) > -1 ? title : "error"](
                message,
                '',
                {
                    tapToDismiss: false,
                    newestOnTop: false,
                    preventDuplicates: true,
                    positionClass: "toast-top-center",
                    get timeOut(){
                        if (title == "failure" || title == "error") {
                            if (errorEnable == true && errorTimeout > 0) {
                                return errorTimeout;
                            }
                        }
                        else if (hold == false || hold == 'False' || hold == undefined) {
                            return alertsTimeout;
                        }
                        return 0;
                    },
                    get extendedTimeOut(){
                        return this.timeOut;
                    },
                    get closeButton (){
                        if(["success", "warning"].indexOf(title) > -1){
                            if(hold == true || hold == "True"){
                                return true;
                            }else{
                                return false;
                            }
                        }else{
                            return true;
                        }
                    },
                    onHidden(){
                        if (!((title == "failure" || title == "error") && (errorEnable != true || !(errorTimeout > 0)))){
                            if (functionality != "") {
                                var functionalityCategory = functionality.split("~");
                                if (functionalityCategory[0] == "load") {
                                    window.location.href = functionalityCategory[1];
                                } else if (functionalityCategory[0] == "reload") {
                                    window.location.href = window.location.href;
                                } else if (functionalityCategory[0] == "function") {
                                    window.eval(functionalityCategory[1]);
                                }
                            }
                        }
                    }
                }
            );
            return;
        } catch (ex) {}

        clearThePreviousAlert();

        if ($("#middle1").length > 0 && $("#middle1").is(":visible"))
            $("#middle1").contents().find('body').append(shMessage);
        else
            $("body").append(shMessage);
        //to enable error timeout after desired seconds
        if (title == "failure" || title == "error") {
            if (errorEnable == true && errorTimeout > 0) {
                setTimeout(function () {
                    $(".shortMessageWrapper").find(".alert-danger").parent().removeClass('animated pulse').fadeOut({
                        complete: function () {
                            $(".shortMessageWrapper").find(".alert-success, .alert-warning").parent().remove();
                        }
                    });
                    hideAlertDialog(functionality, "Error");
                }, errorTimeout);
            }
        }
        else if (hold == false || hold == 'False' || hold == undefined) {
            setTimeout(function () {
                $(".shortMessageWrapper").find(".alert-success, .alert-info .alert-warning").parent().removeClass('animated pulse').fadeOut({
                    complete: function () {
                        $(".shortMessageWrapper").find(".alert-success, .alert-warning .alert-info").parent().remove();
                    }
                });
                //$(".shortMessageWrapper").removeClass('animated pulse').addClass('animated fadeOut');
                hideAlertDialog(functionality);
            }, alertsTimeout);
        }
        else {
            hideAlertDialog(functionality);
        }
    }
}


function clearThePreviousAlert() {
    if ($(".shortMessageWrapper").length > 0) {
        $(".shortMessageWrapper").each(function () {
            $(this).find("a").click();
            $(this).hide();
        })
    }
}

function hideAlertDialog(funcionalityToDo, calledFrom) {
    var errorEnable = JSON.parse(callParentNew("errorEnable") || false);
    var errorTimeout = parseInt(callParentNew("errorTimeout"), 10) || 0;
    var alertsTimeout = parseInt(callParentNew(calledFrom == "Error" ? "errorTimeout" : "alertsTimeout"), 10) || 3000;
    if (calledFrom == undefined)
        $(".shortMessageWrapper").find(".alert-success, .alert-warning , .alert-info").parent().removeClass('animated pulse').fadeOut({
            complete: function () {
                $(".shortMessageWrapper").find(".alert-success, .alert-warning, .alert-info").parent().remove();
            }
        });
    else {
        $(".shortMessageWrapper").find(".alert-danger").parent().removeClass('animated pulse').fadeOut({
            complete: function () {
                $(".shortMessageWrapper").find(".alert-success, .alert-warning, .alert-info").parent().remove();
            }
        });
        if (calledFrom == "Error" && (errorEnable != true || !(errorTimeout > 0)))
            return;
    }
        setTimeout(function () {
            if ($(".fadeOut").length) $(".shortMessageWrapper").find(".alert-danger .err-msg").remove();
            if (funcionalityToDo != "") {
                var functionalityCategory = funcionalityToDo.split("~");
                if (functionalityCategory[0] == "load") {
                    window.location.href = functionalityCategory[1];
                } else if (functionalityCategory[0] == "reload") {
                    location.href = location.href;
                } else if (functionalityCategory[0] == "function") {
                    eval(functionalityCategory[1]);
                }
            }
        }, alertsTimeout);
   
}


//This function will be called in the *app code only* in page load (where ever we are calling the function IsValidSession()), 
//if the multi user logged in the Cloud then this function will be called
//if any similar generic function will be written that is supposed to be used in all the pages then create a new file and move this function to same file
function CloudSignout() {
    var parentUrl = window.parent.document.referrer;
    if (parentUrl.lastIndexOf("/") == parentUrl.length) {
        parentUrl = parentUrl.slice(0, -1);

    }
    var lastIndex = parentUrl.lastIndexOf("/");
    if (lastIndex != parentUrl.length) {
        parentUrl = parentUrl.substr(0, lastIndex);
    }
    window.top.location.href = parentUrl;
}
