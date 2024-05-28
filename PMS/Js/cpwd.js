
$j(document).ready(function () {
    checkSuccessAxpertMsg();
    $("#btnModalClose").hide();
    var chpdRemark = (new URL(location.href)).searchParams.get('remark');
    if (chpdRemark == "1")
        showAlertDialog("error", "You are logging in for the first time. You need to change the password.");
    else if (chpdRemark == "2")
        showAlertDialog("error", "Your password is expired. You need to change the password.");
    else if (chpdRemark == "3")
        showAlertDialog("error", "Your password has been reset. You need to change your password.");
    
    setTimeout(function () {
        if (cpwdRemark == "chpwd") {
            //to set modal dialog header dynamically based on language selection
            modalHeader = eval(callParent("divModalHeader", "id") + ".getElementById('divModalHeader')");
            modalHeader.innerText = eval(callParent('lcm[252]'));
            $("#btnClose").prop("title", eval(callParent('lcm[192]'))).text(eval(callParent('lcm[192]')));
            $j("#main_body").css("background","");
            $("#btnModalClose").addClass("d-none")
            //$("#iFrameChangePassword").height("366px");
            tabFocusEvent();//for focusing tab within the page
        }
        else {
            $("#spnCpwdHeading").text(eval(callParent('lcm[252]')));
            //$("#existingPwd").attr("placeholder", eval(callParent('lcm[295]')));
            //$("#newPwd").attr("placeholder", eval(callParent('lcm[296]')));
            //$("#confirmPwd").attr("placeholder", eval(callParent('lcm[297]')));
        }
        $("#btnSumit").prop({ "title": eval(callParent('lcm[200]')), "value": eval(callParent('lcm[200]')) });
    },100)

    $j("#breadcrumb-panel").css("display", "none");
    b();
    // ChangeTheme(window);
    // DefaultTheme();
    
    $("#confirmPwd").keypress(function (e) {
        if (e.which == 13) {
            $("#npwdHidden").val(this.value);
            $("#swc000F0").val(md5authNew(this.value));
       
        }
    });



    if ($j("#axpertVer").length > 0) {
        AddVerion();
    }

    setTimeout(function () {
        $("#existingPwd").focus();
    }, 500)
    $(".field-wrapper .field-placeholder").on("click", function () {
        $(this).closest(".field-wrapper").find("input").focus();
    });
    $(".field-wrapper input").on("click", function () {
        $(this).closest(".field-wrapper").addClass('hasValue')
    });

    $("#confirmPwd, #newPwd, #existingPwd").on('keyup', function () {
        var value = $.trim($(this).val());
        if (value) {
            $(this).closest(".field-wrapper").addClass("hasValue");
        } else {
            $(this).closest(".field-wrapper").removeClass("hasValue");
        }
        if ($j('#axSelectProj').is(':visible') && $j('#axSelectProj').val() != "")
            $j('#axSelectProj').closest(".field-wrapper").addClass("hasValue");
        if ($j('#language').is(':visible') && $j('#language').val() != "")
            $j('#language').closest(".field-wrapper").addClass("hasValue");
    });

    $(".field-wrapper input").each(function () {
        var value = $.trim($(this).val());
        if (value) {
            $(this).closest(".field-wrapper").addClass("hasValue");
        } else {
            $(this).closest(".field-wrapper").removeClass("hasValue");
        }
    });
    setProjectImages(proj);
});

function LoadParentHome() {
    url = window.parent.location;
    if (url.toString().toLowerCase().indexOf("cpwd.aspx") == -1)
        window.parent.loadHome();
}

//once password is changed successfully, close the dialog & display success msg, signout of the application after 3 sec
function closeDialog(result, url) {
    parent.$("#divModalChangePassword, #divModalChangePassword+.modal-backdrop").hide(); //hide modal dialog
    parent.showAlertDialog('success', result);
    setTimeout(function () {
        parent.window.location.href = url; //signout & redirect page to signin page
    }, 3000);
}

var myVersionJSON;
var versionInfoFile = "../versionInfo.json";
function AddVerion() {


    //Caching in local storage.
    try {
        if (typeof (Storage) !== "undefined") {
            if (localStorage["versionInfo-" + appUrl]) {
                var data = JSON.parse(localStorage["versionInfo-" + appUrl])
                if (Date.parse(data.expiry) > new Date()) {
                    myVersionJSON = data.value;
                } else {
                    getVersionDetails();
                    location.reload(true);
                }
            } else {
                getVersionDetails();
            }
        } else {
            getVersionDetails();
        }
    } catch (e) {
        getVersionDetails();
    }


    if (typeof myVersionJSON != "undefined") {
        setVersionInfo();
    }
}

function getVersionDetails() {
    $.ajax({
        url: versionInfoFile,
        type: "GET",
        statusCode: {
            404: function () {
                $.getJSON(versionInfoFile, function (json) {
                    //If File Dont Exist
                });
            }
        },
        success: function (json) {
            var expiry = addDays(new Date(), 0.3);
            var data = { value: json, expiry: expiry };
            try {
                if (typeof (Storage) !== "undefined") {
                    localStorage["versionInfo-" + appUrl] = JSON.stringify(data);
                }
            } catch (e) {
                //console.log("LocalStorage not Suported");
            }
            myVersionJSON = data.value;
            setVersionInfo();
        }
    });
}

function addDays(theDate, days) {
    return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
}

function setVersionInfo() {
    var currentVerion = "10.0.0.0";
    var subVersion = "";
    currentVerion = myVersionJSON.version;
    if (myVersionJSON.subVersion) {
        subVersion = "_" + myVersionJSON.subVersion.toString();
    }
    var finalVersion = "";
    finalVersion = "Version " + currentVerion + subVersion;
    $j("#axpertVer").text(finalVersion);
}

//for focusing tab within the page including Modal close icon
function tabFocusEvent() {
    modalButton = eval(callParent("btnModalClose", "id") + ".getElementById('btnModalClose')");
    if (modalButton.className.indexOf("firstFocusable") == -1)
        modalButton.className += " firstFocusable";
    $("#btnClose").addClass("lastFocusable").focus();
    $(".lastFocusable").on('keydown.tabRot', function (e) {
        if ((e.which === 9 && !e.shiftKey)) {
            e.preventDefault();
            modalButton.focus();
        }
    });
    modalButton.addEventListener('keydown', function (e) {
        if ((e.which === 9 && e.shiftKey)) {
            e.preventDefault();
            $(".lastFocusable").focus();
        }
    });
}

function displayAlertMsgOnParent() {
    $(".shortMessageWrapper").appendTo(parent.$("#divModalChangePassword .modal-body"));
    setTimeout(function () {
        parent.hideAlertDialog("")
    }, 3000)
}

function setProjectImages(proj){
    let logoImage = `../images/loginlogo.png`;
    let webBgImage = `../AxpImages/login-img.png`;
    let mobBgImage = `../AxpImages/login-img.png`;

    let logoImageDiv = $('.form-title img');
    let webBgImageDiv = $("body");
    let mobBgImageDiv = $("body");

    if(proj){
        getProjectAppLogo(proj, async = true, 
            (success) => {
                if(success?.d){
                    let {logo, webbg, mobbg} = JSON.parse(success.d);
                    
                    if(webbg && !mobbg){
                        mobbg = webbg
                    }

                    logoImageDiv.prop("src", logo ? `${logo}?v=${(new Date().getTime())}` : logoImage);
                    if(!isMobile){
                        webBgImageDiv.css("background", `url(${webbg ? (`${webbg}?v=${(new Date().getTime())}`) : webBgImage}) ${webbg ? `no-repeat center center fixed` : `no-repeat fixed bottom`}`).css("background-size", "cover");
                    }else{
                        mobBgImageDiv.css("background", `url(${mobbg ? (`${mobbg}?v=${(new Date().getTime())}`) : mobBgImage}?v=${(new Date().getTime())}) ${mobbg ? `no-repeat center center fixed` : `no-repeat fixed bottom`}`).css("background-size", "cover");
                    }                      
                }else{
                    logoImageDiv.prop("src", logoImage);
                    if(!isMobile){
                        webBgImageDiv.css("background", `url(${webBgImage}) no-repeat fixed bottom`).css("background-size", "cover");
                    }else{
                        mobBgImageDiv.css("background", `url(${mobBgImage}?v=${(new Date().getTime())}) no-repeat fixed bottom `).css("background-size", "cover");
                    }
                }
            }, 
            (error) => {
                logoImageDiv.prop("src", logoImage);
                if(!isMobile){
                    webBgImageDiv.css("background", `url(${webBgImage}) no-repeat fixed bottom`).css("background-size", "cover");
                }else{
                    mobBgImageDiv.css("background", `url(${mobBgImage}?v=${(new Date().getTime())}) no-repeat fixed bottom`).css("background-size", "cover");
                }
            }
        );
    }else{
        logoImageDiv.prop("src", logoImage);
        if(!isMobile){
            webBgImageDiv.css("background", `url(${webBgImage}) no-repeat fixed bottom`).css("background-size", "cover");
        }else{
            mobBgImageDiv.css("background", `url(${mobBgImage}?v=${(new Date().getTime())}) no-repeat fixed bottom`).css("background-size", "cover");
        }
    }
}