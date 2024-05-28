var applstJson = "";
let handlerType = "";
var redislstJson = "";
$j(document).ready(function () {
    $("#lstconnection").select2();
    $("#lstRconnection").select2();
    $("#ddldbtype").select2();
    // $(".axSelectProj").select2();
    $("#ddldbversion").select2();
    $("#lstconnection").val(selProj).trigger('change');

    $("#btnaddcon").click(function () {
        $("#lstconnection").val("").trigger('change');
        $("#ddldbtype").val("").trigger('change');
        $("#ddldbversion").val("").trigger('change');

    })
    //$("#axSelectProj").select2().select2('val',localStorageProj);

    if (IsLicExist == "false") {
        //$("#btnRefresh").attr('disabled', 'disabled').addClass("disabledButton");
        //$("#btnActivate").removeAttr("disabled").removeClass("disabledButton");
        //$("#btnTrial").removeAttr("disabled").removeClass("disabledButton");
        $("#dvlicmessage").show();
        $("#btnRefresh").hide();
        $("#btnActivate").show();
        $("#btnTrial").show();
        $(".licActOptions").show();
        $("#dvdbConnection").addClass("disabledDiv");
    }
    else {
        $("#dvlicmessage").hide();
        $(".licActOptions").hide();
        $("#btnRefresh").show();
        $("#btnActivate").hide();
        $("#btnTrial").hide();
        $("#dvdbConnection").removeClass("disabledDiv");
    }

    redislist = ReverseCheckSpecialChars(redislist);
    if (redislist != "") {
        var rxml = parseXml(redislist)
        redislstJson = JSON.parse(xml2json(rxml, ""));
        if (redislstJson != "") {
            let fstValue = $("#lstRconnection option:first").val();
            if (typeof fstValue != "undefined") {
                var rhost = redislstJson.axp_rconn[fstValue].host;
                var rport = redislstJson.axp_rconn[fstValue].port;
                var rpwd = redislstJson.axp_rconn[fstValue].pwd;
                $("#txtrhotname").val(rhost);
                $("#txtrport").val(rport);
                $("#txtrpwd").val("");
                $('#lstRconnection').val(fstValue); // Select the option with a value of '1'
                $('#lstRconnection').trigger('change');
            }
        }
    }

    // $("#btndelete").hide(); // hide class is added in asp button    
    $("#ddldbversion").val(version).prop("disabled", true);
    applist = ReverseCheckSpecialChars(applist);
    if (applist != "") {
        var xml = parseXml(applist)
        applstJson = JSON.parse(xml2json(xml, ""));
        if (selProj != "" && applstJson != "") {
            $("#lstconnection").val(selProj).focus();
            // setProjectImages(selProj);
            var db = applstJson.connections[selProj].db;
            var dbcon = applstJson.connections[selProj].dbcon;
            var dbuser = applstJson.connections[selProj].dbuser;
            var version = applstJson.connections[selProj].version == null ? "" : applstJson.connections[selProj].version;
            var driver = applstJson.connections[selProj].driver;

            $("#lblconname").text(selProj);
            $("#ddldbtype").val(db).trigger('change');
            if (db.toString() != "MS SQL")
                $(".databasever").addClass("d-none");
            // $("#ddldbtype").val(db);
            if (version != "")
                $("#ddldbversion").val(version).prop("disabled", false);
            else
                $("#ddldbversion").val(version).prop("disabled", true);
            $("#txtccname").val(dbcon);
            $("#txtusername").val(dbuser);
            $("#ddldriver").val(driver);
        }
        else if (applstJson != "") {
            var fstValue = $("#lstconnection option:first").val();
            if (typeof fstValue != "undefined") {
                $("#lstconnection").val(fstValue).focus();
                // setProjectImages(fstValue);
                var db = applstJson.connections[fstValue].db;
                var dbcon = applstJson.connections[fstValue].dbcon;
                var dbuser = applstJson.connections[fstValue].dbuser;
                var version = applstJson.connections[fstValue].version == null ? "" : applstJson.connections[fstValue].version;
                var driver = applstJson.connections[fstValue].driver;

                $("#lblconname").text(fstValue);
                $("#ddldbtype").val(db).trigger('change');
                // $("#ddldbtype").val(db);
                if (version != "")
                    $("#ddldbversion").val(version).prop("disabled", false);
                else
                    $("#ddldbversion").val(version).prop("disabled", true);
                $("#txtccname").val(dbcon);
                $("#txtusername").val(dbuser);
                $("#ddldriver").val(driver);
            }
        }
    }
    $(document).on('click', ".upload-button", function (e) {
        try {
            if ($("#axSelectProj").val() == "") {
                showAlertDialog("warning", "Please Select UI Configuration Project");
                $("#axSelectProj").focus();
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            handlerType = "upload";
            $(e.currentTarget).nextAll(".file-upload").trigger("click");
        } catch (ex) { }
    });

    $(document).on('click', ".delete-button", function (e) {
        try {
            if ($("#axSelectProj").val() == "") {
                showAlertDialog("warning", "Please Select UI Configuration Project");
                $("#axSelectProj").focus();
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            handlerType = "delete";
            $(e.currentTarget).parent().find(".file-upload").trigger("change");
        } catch (ex) { }
    });

    $(document).on('change', ".file-upload", function (e) {
        uploadLogo(e);
    });

    $("#ddlIsNewConnection").val('new');
    $("#txtNewConName").val('');

    $("#ddlIsRedisNewConnection").val('new');
    $("#txtRedisNewConn").val('');

    $("#demo").on("hide.bs.collapse", function () {
        $(".licInfoAccordion").html('<span class="material-icons">expand_more</span>');
    });
    $("#demo").on("show.bs.collapse", function () {
        $(".licInfoAccordion").html('<span class="material-icons">expand_less</span>');
    });
    if (IsLicExist == "false") {
        $("#demo").addClass("in");
        $(".licInfoAccordion").html('<span class="material-icons">expand_less</span>');
    }


    $('#filMyFile').bind({
        change: function () {
            var filename = $("#filMyFile").val();
            if (/^\s*$/.test(filename)) {
                $(".file-upload").removeClass('active');
                $("#lblfuerror").text("No file chosen...");
            }
            else
                $(".file-upload").addClass('active');
            var fileExtension = ['lic'];
            var ext = filename.split('.').pop().toLowerCase();
            if ($.inArray(ext, fileExtension) == -1) {
                $('#btnFileUpload').prop('disabled', true);
                $("#lblfuerror").text("Invalid file format.");
            }
            else {
                $('#btnFileUpload').prop('disabled', false);
                $("#lblfuerror").text("");
            }
            var uploadControl = $('#filMyFile')[0].files;
            if (uploadControl.length > 0)
                $("#lblnofilename").text(uploadControl[0].name);
        }
    });

    if (authPopup == "true")
        $("#myModalAuth").show();

    initUiPanel();
});

$j(document).on("click", "#lstconnection option", function (e) {
    var lvalue = $(this).val();
    if (applstJson != "") {
        var db = applstJson.connections[lvalue].db;
        var dbcon = applstJson.connections[lvalue].dbcon;
        var dbuser = applstJson.connections[lvalue].dbuser;
        var version = applstJson.connections[lvalue].version == null ? "" : applstJson.connections[lvalue].version;
        var driver = applstJson.connections[lvalue].driver;

        $("#lblconname").text(lvalue);
        $("#ddldbtype").val(db);
        if (db != "")
            $("#ddldbtype").val(db).trigger('change');


        if (version != "") {
            $("#ddldbversion").val(version).prop("disabled", false);
            $("#ddldbversion").val(version).trigger('change');
        }
        else
            $("#ddldbversion").val(version).prop("disabled", true);
        $("#txtccname").val(dbcon);
        $("#txtusername").val(dbuser);
        $("#ddldriver").val(driver);
    }
});

$j(document).on("change", "#lstconnection", function (e) {
    var lvalue = $(this).val();
    if (applstJson != "") {
        var db = applstJson.connections[lvalue].db;
        var dbcon = applstJson.connections[lvalue].dbcon;
        var dbuser = applstJson.connections[lvalue].dbuser;
        var version = applstJson.connections[lvalue].version == null ? "" : applstJson.connections[lvalue].version;
        var driver = applstJson.connections[lvalue].driver;

        $("#lblconname").text(lvalue);
        $("#ddldbtype").val(db);
        $('#ddldbtype').trigger('change');
        if (db != "")
            $("#ddldbtype").val(db).trigger('change');
        if (db.toString().toLowerCase() != "ms sql") {
            $("#ddldbversion").val("").trigger('change');
            $(".databasever").addClass("d-none");
        }//'MS SQL'
        else
            $(".databasever").removeClass("d-none");
        if (version != "") {
            $("#ddldbversion").val(version).prop("disabled", false);
            $("#ddldbversion").val(version).trigger('change');
        }
        else {
            $("#ddldbversion").val(version).prop("disabled", true);

        }
        $("#txtccname").val(dbcon);
        $("#txtusername").val(dbuser);
        $("#ddldriver").val(driver);

        // setProjectImages(lvalue);
    }
});

$j(document).on("click", "#btnApply", function (e) {
    if ($("#lstconnection").val() == null || $("#lstconnection").val() == "") {
        $("#ddlIsNewConnection").val('new');
        //         let myModal = new BSModal('myModal', 'New CONNECTION', '<div class="configRightFormFields row g-3 align-items-center"><div class="col-md-4 col-sm-12"><label id="lblpopname" class ="form-label fw-boldest text-dark fs-6 mb-0" runat="server">Name</label></div><div class="col-md-8 col-sm-12"><input id="txtNewConName" runat="server" autocomplete="off" class="m-wrap placeholder-no-fix form-control"/></div></div>', () => {
        //             //shown callback
        //         }, () => {
        //             //hide callback
        //         });
        //         myModal.okBtn.addEventListener("click", ()=>{
        //             $("#newConclick").click();
        //            // applyconnection(); //optional click event
        //         });

        // myModal.changeSize("xl");



        $('#myModal').modal("show");
    }
    else {
        $("#ddlIsNewConnection").val('old');
        $("#txtNewConName").val($("#lstconnection").val());
        $("#btnok").click();
    }
});

$j(document).on("click", "#btnChangePassword", function (e) {
    $('#myModaldbpassword').modal("show");
});

$j(document).on("click", "#btnCancel", function (e) {
    window.document.location.href = "signin.aspx";
});

$j(document).on("click", "#btnaddcon", function (e) {
    $("#ddldbtype").prop('selectedIndex', 0);
    $("#ddldbversion").prop('selectedIndex', 0).prop("disabled", true);
    $(".databasever").removeClass("d-none");
    $("#ddldriver").prop('selectedIndex', 0);
    $("#lblconname").text("");
    $("#txtccname").val("");
    $("#txtusername").val("");
    $("#lstconnection").val("");
    $("#txtPassword").val("");
    $("#txtNewPassword").val("");
    $("#txtConfirmPassword").val("");
});

$j(document).on("click", "#btncdelete", function (e) {
    var conDelete = $.confirm({
        closeIcon: false,
        title: 'Confirm',
        escapeKey: 'buttonB',
        theme: 'modern',
        onContentReady: function () {
            disableBackDrop('bind');
        },
        content: eval(callParent('lcm[512]')),
        buttons: {
            buttonA: {
                text: eval(callParent('lcm[279]')),
                btnClass: 'btn btn-primary',
                action: function () {
                    $j("#btndelete").click();
                }
            },
            buttonB: {
                text: eval(callParent('lcm[280]')),
                btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                action: function () {
                    disableBackDrop('destroy');
                }
            }
        }
    });
})

$j(document).on("change", "#ddldbtype", function (e) {
    var dbtype = $(this).val();
    if (dbtype == "MS SQL") {
        $("#ddldbversion").prop("disabled", false);
        $("#ddldriver").val("ado");
    }
    else {
        $("#ddldbversion").val("").prop("disabled", true);
        $("#ddldriver").val("dbx");
    }
});

function OpenSignIn() {
    window.document.location.href = "Signin.aspx";
}

$j(document).on("click", "#btnlicactivation", function (e) {

    //displayBootstrapModalDialog("License Activation", "xs", "156px", true, "./licactivation.aspx", "", "", CallbackFunctionBootstrap)

    //function CallbackFunctionBootstrap() {

    //}
    window.document.location.href = "licactivation.aspx";
});

function TestConnection() {
    let dbtype = $("#ddldbtype").val();
    if (dbtype == "") {
        $("#ddldbtype").focus();
        showAlertDialog("error", "Database name should not be left empty.");
        return false;
    }
    let dbverno = $("#ddldbversion").val();
    if (dbtype.toLowerCase() == "ms sql" && dbverno == "") {
        $("#ddldbversion").focus();
        showAlertDialog("error", "Database verion should not be left empty.");
        return false;
    }

    let txtccname = $("#txtccname").val();
    if (txtccname == "") {
        $("#txtccname").focus();
        showAlertDialog("error", "Connection name should not be left empty.");
        return false;
    }

    let txtusername = $("#txtusername").val();
    if (txtusername == "") {
        $("#txtusername").focus();
        showAlertDialog("error", "User name should not be left empty.");
        return false;
    }

    let txtPassword = $("#txtPassword").val();
    if (txtPassword == "") {
        $("#txtPassword").focus();
        showAlertDialog("error", "Password should not be left empty.");
        return false;
    }

    TestConnectionWs();
    // return true;
}

function TestConnectionWs() {
    $.ajax({
        url: 'Config.aspx/AppTestConnection',
        type: 'POST',
        cache: false,
        async: true,
        data: JSON.stringify({
            ddldbtype: $("#ddldbtype").val(), ddldbversion: $("#ddldbversion").val(), ddldriver: $("#ddldriver").val(), txtccname: $("#txtccname").val(), txtusername: $("#txtusername").val(), txtPassword: $("#txtPassword").val()
        }),
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            if (data.d != "") {
                var response = $.parseJSON(data.d)
                if (response.result[0].result == "true") {
                    showAlertDialog("success", "Test Connection was Successful.");
                    EnableApplyConnection();
                }
                else
                    showAlertDialog("error", response.result[0].error.msg);
            }
            else
                showAlertDialog("error", data.d);
        }, error: function (error) {
            showAlertDialog("error", error);
        }
    });
}

function EnableApplyConnection() {
    $("#btnApply").removeAttr("disabled").removeClass("btndisable");
    $("#btnChangePassword").removeAttr("disabled").removeClass("btndisable");
}


function applyconnection() {
    let txtNewConName = $("#txtNewConName").val();
    if (txtNewConName == "") {
        $("#txtNewConName").focus();
        showAlertDialog("error", "Connection name should not be left empty.");
        return false;
    }
    var regex = new RegExp("^[a-zA-Z0-9]+$");
    if (!regex.test(txtNewConName)) {
        $("#txtNewConName").focus();
        showAlertDialog("error", "Invalid Name - Special characters not allowed.");
        return false;
    }
    return true;
}

function applydbpwdconnection() {
    let txtNewConName = $("#txtNewPassword").val();
    if (txtNewConName == "") {
        $("#txtNewPassword").focus();
        showAlertDialog("error", "Password can not be empty.");
        return false;
    }
    let txtConfirmPassword = $("#txtConfirmPassword").val();
    if (txtConfirmPassword == "") {
        $("#txtConfirmPassword").focus();
        showAlertDialog("error", "Confirm Password can not be empty.");
        return false;
    }

    if (txtNewConName != txtConfirmPassword) {
        $("#txtNewPassword").focus();
        showAlertDialog("error", "The password you entered did not match.");
        return false;
    }
    return true;
}

$j(document).on("click", "#btnnewcancel,#myModalclose", function (e) {
    $('#myModal').hide();
    $("#btnApply").attr("disabled", true).addClass("btndisable");
    $("#btnChangePassword").attr("disabled", true).addClass("btndisable");
});

$j(document).on("click", "#btndbpwdcancel,#myModaldbpasswordclose", function (e) {
    $('#myModaldbpassword').hide();
    $("#btnApply").attr("disabled", true).addClass("btndisable");
    $("#btnChangePassword").attr("disabled", true).addClass("btndisable");
});

function SuccApplyConnection(isSucc, newConnection) {
    if (isSucc == "success") {
        showAlertDialog("success", "Connection is created successful.");
    }
    else {
        showAlertDialog("error", "Connection Name already exists.");
    }
}

function SuccPasswordChange(isSucc, succMsg) {
    if (isSucc == "success") {
        showAlertDialog("success", succMsg);
    }
    else {
        showAlertDialog("error", succMsg);
    }
}

function setProjectImages(proj) {
    let logoImage = `../images/loginlogo.png`;
    let webBgImage = `../AxpImages/login-img.png`;
    let mobBgImage = `../AxpImages/login-img.png`;

    let logoImageDiv = $(".file-upload[data-type=logo]").parent().parent().find(".profile-pic");
    let webBgImageDiv = $(".file-upload[data-type=webbg]").parent().parent().find(".profile-pic");
    let mobBgImageDiv = $(".file-upload[data-type=mobbg]").parent().parent().find(".profile-pic")//$(".file-upload[data-type=mobbg]").prevAll(".profile-pic");

    if (proj) {
        getProjectAppLogo(proj, async = true,
            (success) => {
                if (success?.d) {
                    let { logo, webbg, mobbg } = JSON.parse(success.d);

                    let updateMobileBG = false;

                    if (webbg && !mobbg) {
                        mobbg = webbg;
                        updateMobileBG = true;
                    }

                    logoImageDiv.prop("src", logo ? `${logo}?v=${(new Date().getTime())}` : logoImage);
                    webBgImageDiv.prop("src", webbg ? webbg : webBgImage);
                    mobBgImageDiv.prop("src", mobbg ? mobbg : mobBgImage);

                    if (logo) {
                        logoImageDiv.parent().find(".delete-button").removeClass("d-none");
                    } else {
                        logoImageDiv.parent().find(".delete-button").addClass("d-none");
                    }

                    if (webbg) {
                        webBgImageDiv.parent().find(".delete-button").removeClass("d-none");
                    } else {
                        webBgImageDiv.parent().find(".delete-button").addClass("d-none");
                    }

                    if (mobbg && !updateMobileBG) {
                        mobBgImageDiv.parent().find(".delete-button").removeClass("d-none");
                    } else {
                        mobBgImageDiv.parent().find(".delete-button").addClass("d-none");
                    }
                } else {
                    logoImageDiv.prop("src", logoImage);
                    webBgImageDiv.prop("src", webBgImage);
                    mobBgImageDiv.prop("src", mobBgImage);

                    logoImageDiv.parent().find(".delete-button").addClass("d-none");
                    webBgImageDiv.parent().find(".delete-button").addClass("d-none");
                    mobBgImageDiv.parent().find(".delete-button").addClass("d-none");
                }
            },
            (error) => {
                logoImageDiv.prop("src", logoImage);
                webBgImageDiv.prop("src", webBgImage);
                mobBgImageDiv.prop("src", mobBgImage);

                logoImageDiv.parent().find(".delete-button").addClass("d-none");
                webBgImageDiv.parent().find(".delete-button").addClass("d-none");
                mobBgImageDiv.parent().find(".delete-button").addClass("d-none");
            }
        );
    } else {
        logoImageDiv.prop("src", logoImage);
        webBgImageDiv.prop("src", webBgImage);
        mobBgImageDiv.prop("src", mobBgImage);

        logoImageDiv.nextAll(".delete-button").addClass("hide");
        webBgImageDiv.nextAll(".delete-button").addClass("hide");
        mobBgImageDiv.nextAll(".delete-button").addClass("hide");
    }
}

$j(document).on("click", "#btnUpload", function (e) {
    $("#myModalLicUpload").show();
});

function licActivateCheck() {
    if (!$("#btnActivate").hasClass("disabledButton")) {
        let txtlicappkey = $("#txtlicappkey").val();
        if (txtlicappkey == "") {
            $("#txtlicappkey").focus();
            showAlertDialog("error", "Please enter license key provided by Agile Labs...");
        }
        else {
            $("#btnActivateasp").trigger("click");
        }
    }
}

function licRefreshCheck() {
    if (!$("#btnRefresh").hasClass("disabledButton")) {
        $("#btnRefreshasp").trigger("click");
    }
}

function licTrialCheck() {
    if (!$("#btnTrial").hasClass("disabledButton")) {
        $("#btnTrialasp").trigger("click");
    }
}

function offlinelicDownload() {
    let txtlicofflinekey = $("#txtlicofflinekey").val();
    if (txtlicofflinekey == "") {
        $("#txtlicofflinekey").focus();
        showAlertDialog("error", "Please enter license key provided by Agile Labs...");
    }
    else {
        $("#btnDownloadasp").trigger("click");
    }
}

function LicActivationSucc(mdgtype, msg) {
    if (mdgtype == "success") {
        showAlertDialog("success", msg);
        setTimeout(function () {
            var qstr = window.document.location.href;
            window.document.location.href = qstr;
        }, 300);
    }
    else {
        showAlertDialog("error", msg);
    }
}

function LicDownloadSucc(mdgtype, msg) {
    if (mdgtype == "success") {
        showAlertDialog("success", msg);
        $("#btndownloadfile").trigger("click");
        //$('#rbllictype input').val('online');
    }
    else {
        showAlertDialog("error", msg);
    }
}

function closeUploadDialog() {
    $('#btnFileUpload').prop('disabled', false);
    $("#filMyFile").val('');
    $("#lblnofilename").text('');
    $("#myModalLicUpload").hide();
}

$j(document).on("change", "#rbllictype input", function (e) {
    switch ($(this).val()) {
        case 'offline':
            $("#dvOffline").show();
            $("#dvOnline").hide();
            break;
        default:
            $("#dvOffline").hide();
            $("#dvOnline").show();
            break;
    }
});

function uploadLogo(e) {

    // var fileUpload = $("#UploadAppLogoImg").get(0);
    var fileUpload = e.target;
    var files = fileUpload.files;

    var data = new FormData();
    for (var i = 0; i < files.length; i++) {
        data.append(files[i].name, files[i]);
    }

    var url = location.origin + location.pathname.substr(0, location.pathname.indexOf('aspx'));

    if ($("#axSelectProj").val()) {
        $.ajax({
            url: url + `ProjectImageUploadHandler.ashx?proj=${$("#axSelectProj").val()}&type=${fileUpload?.dataset?.type || ""}&handlertype=${handlerType}`,
            type: "POST",
            data: data,
            contentType: false,
            processData: false,
            success(result) {
                handlerType = "upload";
                if (result.indexOf("success") > -1) {
                    setProjectImages($("#axSelectProj").val());
                    showAlertDialog("success", result);
                } else if (result.indexOf("size") > -1 || result.indexOf("select")) {
                    showAlertDialog("warning", result);
                } else if (result.indexOf("error") > -1) {
                    showAlertDialog("error", result);
                } else {
                    showAlertDialog("error", result);
                }
                $(fileUpload).val("");
            },
            error(err) {
                handlerType = "upload";
                showAlertDialog("error", err.statusText);
                $(fileUpload).val("");
            }
        });
    } else {
        handlerType = "upload";
        showAlertDialog("error", "Project Name should be selected");
    }
}

function AuthenticateUser() {
    let txtAuthUsername = $("#txtAuthUsername").val();
    if (txtAuthUsername == "") {
        $("#txtAuthUsername").focus();
        showAlertDialog("error", "User name should not be left empty.");
        return false;
    }

    let txtAuthPwd = $("#txtAuthPwd").val();
    if (txtAuthPwd == "") {
        $("#txtAuthPwd").focus();
        showAlertDialog("error", "Password should not be left empty.");
        return false;
    }

    $.ajax({
        url: 'Config.aspx/UserAuthentication',
        type: 'POST',
        cache: false,
        async: true,
        data: JSON.stringify({
            AuthUsername: $("#txtAuthUsername").val(), AuthPwd: $("#txtAuthPwd").val()
        }),
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            $('#configbody').removeClass('m-auto');

            $('#main_body').removeAttr("style")
            if (data.d != "") {
                var qstr = window.document.location.href;
                if (qstr.indexOf("?") > -1) {
                    var qsAuth = qstr.split("?")[1];
                    if (qsAuth.indexOf("auth=") > -1) {
                        var varAuth = "";
                        qsAuth.split("&").forEach(function (elem) {
                            if (elem.indexOf("auth=") == -1)
                                varAuth += elem + "&";
                        });
                        window.document.location.href = "config.aspx?" + varAuth + "auth=" + data.d;
                    }
                    else
                        window.document.location.href = qstr + "&auth=" + data.d;
                }
                else
                    window.document.location.href = "config.aspx?auth=" + data.d;
            }
            else
                showAlertDialog("error", "Incorrect credentials. please try again!");
        }, error: function (error) {
            showAlertDialog("error", error);
        }
    });
}

$j(document).on("click", "#btnAuthCancel,#myModalAuthClose", function (e) {
    window.document.location.href = "signin.aspx";
});

function initUiPanel() {
    // if(selProj){
    $("#axSelectProj").val(selProj);

    setProjectImages(selProj);
    // }
    var newArr = $("#lstconnection option").toArray().map((opt) => {
        return { label: opt.value, value: opt.value, link: "" };
    });
    $("#axSelectProj").select2({
        data: applstJson
    })

    //$("#axSelectProj").autocomplete({
    //    minLength: 0,
    //    selectFirst: true,
    //    autoFocus: true,
    //    source: function (request, response) {
    //        response($("#lstconnection option").toArray().map((opt)=>{
    //            return { label: opt.value, value: opt.value, link: "" };
    //        }));
    //    },
    //    open: function (event, ui) {
    //        // var dialog = $(this).closest('.ui-dialog');
    //        // if (dialog.length > 0) {
    //        //     $('.ui-autocomplete.ui-front').zIndex(dialog.zIndex() + 1);
    //        // }
    //    },
    //    select: function (event, ui) {

    //        // if (ui.item.label == lcm[0]) {
    //        //     $(this).val('');
    //        //     return false;
    //        // }
    //        // else {
    //        //     $(this).val(ui.item.label);
    //        // }
    //        // setProjectNeeds(ui.item.label);
    //        // HideErrorMsg();
    //        hideAlertDialog('', 'error');

    //        setProjectImages(ui.item.value);
    //    },
    //    forceChange(){
    //        // setProjectNeeds($(this).val());
    //    }
    //});
}

function applyRedisconnection() {
    let txtrhotname = $("#txtrhotname").val();
    if (txtrhotname == "") {
        $("#txtrhotname").focus();
        showAlertDialog("error", "Host name should not be left empty.");
        return false;
    }

    let txtrport = $("#txtrport").val();
    if (txtrport == "") {
        $("#txtrport").focus();
        showAlertDialog("error", "Port should not be left empty.");
        return false;
    }

    let txtrpwd = $("#txtrpwd").val();
    if (txtrpwd == "") {
        $("#txtrpwd").focus();
        showAlertDialog("error", "Password should not be left empty.");
        return false;
    }
    TestRedisConnectionWs();
    //$("#btnRedisTestConnection").click();
}

$j(document).on("click", "#btnRedisApply", function (e) {
    if ($("#lstRconnection").val() == null || $("#lstRconnection").val() == "") {
        $("#ddlIsRedisNewConnection").val('new');
        $('#myModalRedis').modal("show");
    }
    else {
        $("#ddlIsRedisNewConnection").val('old');
        $("#txtRedisNewConn").val($("#lstRconnection").val());
        $("#btnRedisOk").click();
    }
});

function EnableRedisApplyConnection() {
    $("#btnRedisApply").removeAttr("disabled").removeClass("btndisable");
}

function SuccRedisConnection(msgType) {
    if (msgType == "success") {
        showAlertDialog("success", "Connection is created successful.");
    }
    else {
        showAlertDialog("error", "Connection Name already exists.");
    }
}

function TestRedisConnectionWs() {
    $.ajax({
        url: 'Config.aspx/RedisTestConnection',
        type: 'POST',
        cache: false,
        async: true,
        data: JSON.stringify({
            rHost: $("#txtrhotname").val(), rPort: $("#txtrport").val(), rPwd: $("#txtrpwd").val()
        }),
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            if (data.d != "") {
                if (data.d == "true") {
                    showAlertDialog("success", "Test Connection was Successful.");
                    EnableRedisApplyConnection();
                }
                else {
                    showAlertDialog("error", "Test Connection failed.");
                    $("#btnRedisApply").attr("disabled", "true").addClass("btndisable");
                }
            }
            else {
                showAlertDialog("error", "Test Connection failed.");
                $("#btnRedisApply").attr("disabled", "true").addClass("btndisable");
            }
        }, error: function (error) {
            showAlertDialog("error", error);
        }
    });
}

function CreateRedisConnection() {
    let txtNewConName = $("#txtRedisNewConn").val();
    if (txtNewConName == "") {
        $("#txtRedisNewConn").focus();
        showAlertDialog("error", "Connection name should not be left empty.");
        return false;
    }
    var regex = new RegExp("^[a-zA-Z0-9]+$");
    if (!regex.test(txtNewConName)) {
        $("#txtRedisNewConn").focus();
        showAlertDialog("error", "Invalid Name - Special characters not allowed.");
        return false;
    }
}

$j(document).on("click", "#lstRconnection option", function (e) {
    var rlvalue = $(this).val();
    if (redislstJson != "") {
        var rhost = redislstJson.axp_rconn[rlvalue].host;
        var rport = redislstJson.axp_rconn[rlvalue].port;
        var rpwd = redislstJson.axp_rconn[rlvalue].pwd;
        $("#txtrhotname").val(rhost);
        $("#txtrport").val(rport);
        $("#txtrpwd").val("");
    }
});

$j(document).on("change", "#lstRconnection", function (e) {
    var rlvalue = $(this).val();
    if (redislstJson != "" && rlvalue != null) {
        var rhost = redislstJson.axp_rconn[rlvalue].host;
        var rport = redislstJson.axp_rconn[rlvalue].port;
        var rpwd = redislstJson.axp_rconn[rlvalue].pwd;
        $("#txtrhotname").val(rhost);
        $("#txtrport").val(rport);
        $("#txtrpwd").val("");
    }
});

$j(document).on("click", "#btnRedisAdd", function (e) {
    $("#txtrhotname").val("");
    $("#txtrport").val("");
    $("#txtrpwd").val("");
    $("#lstRconnection").val("").trigger('change');
});

$j(document).on("click", "#btnRcdelete", function (e) {
    var conDelete = $.confirm({
        closeIcon: false,
        title: 'Confirm',
        escapeKey: 'buttonB',
        theme: 'modern',
        onContentReady: function () {
            disableBackDrop('bind');
        },
        content: eval(callParent('lcm[522]')),
        buttons: {
            buttonA: {
                text: eval(callParent('lcm[279]')),
                btnClass: 'btn btn-primary',
                action: function () {
                    $j("#btnRedisdelete").click();
                }
            },
            buttonB: {
                text: eval(callParent('lcm[280]')),
                btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                action: function () {
                    disableBackDrop('destroy');
                }
            }
        }
    });
});

$j(document).on("click", "#btnrnewcancel,#myModalRedisclose", function (e) {
    $('#myModalRedis').modal("hide");
});