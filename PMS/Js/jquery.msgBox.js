/*
jQuery.msgBox plugin 
Copyright 2011, Halil İbrahim Kalyoncu
License: BSD
modified by Oliver Kopp, 2012.
 * added support for configurable image paths
 * a new msgBox can be shown within an existing msgBox
*/

/*
contact :

halil@ibrahimkalyoncu.com
koppdev@googlemail.com

*/

// users may change this variable to fit their needs
var msgBoxImagePath = "../axpimages/";
var divMsgBox;
var ShowDimmer;
jQuery.msgBox = msg;
function msg(options, posY, cWidth, cHeight) {
    var isShown = false;
    var typeOfValue = typeof options;
    var defaults = {
        content: (typeOfValue == "string" ? options : "Message"),
        title: "Warning",
        type: "alert",
        autoClose: false,
        timeOut: 0,
        showButtons: true,
        buttons: [{ value: "Ok" }],
        inputs: [{ type: "text", name: "userName", header: "User Name" }, { type: "password", name: "password", header: "Password" }],
        success: function (result) { },
        beforeShow: function () { },
        afterShow: function () { },
        beforeClose: function () { },
        afterClose: function () { },
        opacity: 0.1
    };
    options = typeOfValue == "string" ? defaults : options;
    if (options.type != null) {
        switch (options.type) {
            case "alert":
                options.title = options.title == null ? "" : options.title;
                break;
            case "info":
                options.title = options.title == null ? "" : options.title;
                break;
            case "success":
                options.title = options.title == null ? "" : options.title;
                break;
            case "error":
                options.title = options.title == null ? "" : options.title;
                break;
            case "confirm":
                options.title = options.title == null ? "Confirmation" : options.title;
                options.buttons = options.buttons == null ? [{ value: "Yes" }, { value: "No" }, { value: "Cancel" }] : options.buttons;
                break;
            case "prompt":
                options.title = options.title == null ? "Log In" : options.title;
                options.buttons = options.buttons == null ? [{ value: "Login" }, { value: "Cancel" }] : options.buttons;
                break;
            default:
                image = "alert.png";
        }
    }
    options.timeOut = options.timeOut == null ? (options.content == null ? 500 : options.content.length * 70) : options.timeOut;
    options = $j.extend(defaults, options);
    if (options.autoClose) {
        setTimeout(hide, options.timeOut);
    }
    var image = "";
    switch (options.type) {
        case "alert":
            image = "alert.png";
            break;
        case "success":
            image = "success.png";
            break;
        case "info":
            image = "info.png";
            break;
        case "error":
            image = "error.png";
            break;
        case "confirm":
            image = "confirm.png";
            break;
        default:
            image = "alert.png";
    }

    var divId = "msgBox" + new Date().getTime();

    var divMsgBoxId = divId;
    var divMsgBoxContentId = divId + "Content";
    var divMsgBoxImageId = divId + "Image";
    var divMsgBoxButtonsId = divId + "Buttons";
    var divMsgBoxBackGroundId = divId + "BackGround";

    var buttons = "";
    $j(options.buttons).each(function (index, button) {
        if (button.value == "Close") {
            buttons += "<input class=\"msgButton coldbtn btn\" type=\"button\" name=\"" + button.value + "\" value=\"" + button.value + "\" />";
        }
        else {
            buttons += "<input class=\"msgButton hotbtn btn\" type=\"button\" name=\"" + button.value + "\" value=\"" + button.value + "\" />";
        }
    });

    var inputs = "";
    $j(options.inputs).each(function (index, input) {
        var type = input.type;
        if (type != undefined) {
            if (type == "checkbox" || type == "radiobutton") {
                inputs += "<div class=\"msgInput\">" +
                "<input type=\"" + input.type + "\" name=\"" + input.name + "\" " + (input.checked == null ? "" : "checked ='" + input.checked + "'") + " value=\"" + (typeof input.value == "undefined" ? "" : input.value) + "\" />" +
                "<text>" + input.header + "</text>" +
                "</div>";
            }
            else if (type == "label") {
                inputs += "<div>" +
               "<label style=\"color: red;margin-left:-105px;margin-top:0px;\">" + input.header + "</div>";
            }
            else if (type == "textarea") {
                inputs += "<div class=\"msgInput\">" +
                "<span class=\"msgInputHeader\">" + input.header + "<span>" +
                "<textarea\ id=\"cancelrem\" onKeyUp=\"CheckMaxInput(this)\" name=\"" + input.name + "\" value=\"" + (typeof input.value == "undefined" ? "" : input.value) + "\" ></textarea>" +
                "</div>";
            }
            else if (type == "readonly") {
                inputs += "<div class=\"msgInput\">" +
               "<span>" + input.header +
               "<input id=\"charcount\" readonly=\"readonly\" type=\"text" + "\" name=\"" + input.name + "\" value=\"" + (typeof input.value == "undefined" ? "" : input.value) + "\" />" +
               "</div>";
            }
            else {
                inputs += "<div class=\"msgInput\">" +
                "<span class=\"msgInputHeader\">" + input.header + "<span>" +
                "<input type=\"" + input.type + "\" name=\"" + input.name + "\" value=\"" + (typeof input.value == "undefined" ? "" : input.value) + "\" />" +
                "</div>";
            }
        }
    });

    var divBackGround = "<div id=" + divMsgBoxBackGroundId + " class=\"msgBoxBackGround\"></div>";
    var divTitle = "";
    if (options.title != undefined && options.title != '') {
        divTitle = "<div class=\"msgBoxTitle\">" + options.title + "</div>";
    }

    var divContainer = "";
    if(cWidth != undefined)
        divContainer = "<div class=\"msgBoxContainer\"><div id=" + divMsgBoxImageId + " class=\"msgBoxImage\"><img src=\"" + msgBoxImagePath + image + "\"/></div><div id=" + divMsgBoxContentId + " style=\"width: 100%;height:400px;overflow:auto\" class=\"msgBoxContent\"><p><span style=\"margin-top:35px;\">" + options.content + "</span></p></div></div>";
    else
         divContainer = "<div class=\"msgBoxContainer\"><div id=" + divMsgBoxImageId + " class=\"msgBoxImage\"><img src=\"" + msgBoxImagePath + image + "\"/></div><div id=" + divMsgBoxContentId + " class=\"msgBoxContent\"><p><span style=\"margin-top:35px;\">" + options.content + "</span></p></div></div>";
    var divButtons = "<div id=" + divMsgBoxButtonsId + " class=\"msgBoxButtons\">" + buttons + "</div>";
    var divInputs = "<div class=\"msgBoxInputs\">" + inputs + "</div>";

   
    var divMsgBoxContent;
    var divMsgBoxImage;
    var divMsgBoxButtons;
    var divMsgBoxBackGround;

   

    if (options.type == "prompt") {
        

        $j("html").append(divBackGround + "<div id=" + divMsgBoxId + "  class=\"msgBox\" >" + divTitle + "<div>" + divContainer + (options.showButtons ? divButtons + "</div>" : "</div>") + "</div>");
        divMsgBox = $j("#" + divMsgBoxId);
        divMsgBoxContent = $j("#" + divMsgBoxContentId);
        divMsgBoxImage = $j("#" + divMsgBoxImageId);
        divMsgBoxButtons = $j("#" + divMsgBoxButtonsId);
        divMsgBoxBackGround = $j("#" + divMsgBoxBackGroundId);
        divMsgBoxImage.remove();
        divMsgBoxButtons.css({ "text-align": "center"});
        divMsgBoxContent.css({ "width": "100%", "height": "100%" });
        divMsgBoxContent.html(divInputs);
    }
    else {
        if(cWidth != undefined)
            $j("html").append(divBackGround + "<div id=" + divMsgBoxId + " style=\"width:" + cWidth + ";\" class=\"msgBox\" >" + divTitle + "<div >" + divContainer + (options.showButtons ? divButtons + "</div>" : "</div>") + "</div>");
        else
            $j("html").append(divBackGround + "<div id=" + divMsgBoxId + " class=\"msgBox\" >" + divTitle + "<div>" + divContainer + (options.showButtons ? divButtons + "</div>" : "</div>") + "</div>");
        divMsgBox = $j("#" + divMsgBoxId);
        divMsgBoxContent = $j("#" + divMsgBoxContentId);
        divMsgBoxImage = $j("#" + divMsgBoxImageId);
        divMsgBoxButtons = $j("#" + divMsgBoxButtonsId);
        divMsgBoxBackGround = $j("#" + divMsgBoxBackGroundId);
    }

    var width = divMsgBox.width();
    var height = divMsgBox.height();
    var windowHeight = $j(window).height();
    var windowWidth = $j(window).width();

    var top = windowHeight / 2 - height / 2;
    var left = windowWidth / 2 - width / 2;

    if (posY != undefined) {

        top = posY ;
    }
    if (cWidth != undefined)
    {
        width = cWidth;
    }
    if (cHeight != undefined) {
        height = cHeight;
    }
    show();

    function show() {
        if (isShown) {
            return;
        }
        divMsgBox.css({ opacity: 1});
        divMsgBox.css("background-image", "url('" + msgBoxImagePath + "msgBoxBackGround.png')");
        divMsgBoxBackGround.css({ opacity: options.opacity });
        options.beforeShow();
        divMsgBoxBackGround.css({ "width": $j(document).width(), "height": getDocHeight() });
        $j(divMsgBoxId + "," + divMsgBoxBackGroundId).fadeIn(0);
        divMsgBox.animate({ opacity: 1}, 200);
        setTimeout(options.afterShow, 200);
        isShown = true;
        $j(window).bind("resize", function (e) {
            var width = divMsgBox.width();
            var height = divMsgBox.height();
            var windowHeight = $j(window).height();
            var windowWidth = $j(window).width();

            var top = windowHeight / 2 - height / 2;
            var left = windowWidth / 2 - width / 2;
            
            //divMsgBox.css({ "left": left });

        });
        if (windowHeight < height + top) {
            top = top - (windowHeight - height);
            divMsgBox.css({ "top": top });
        }
        else
            divMsgBox.css({ "top": top });
    }

    function hide() {
        if (!isShown) {
            return;
        }
        options.beforeClose();
        divMsgBox.animate({ opacity: 0}, 200);
        divMsgBoxBackGround.fadeOut(300);
        setTimeout(function () { divMsgBox.remove(); divMsgBoxBackGround.remove(); }, 300);
        setTimeout(options.afterClose, 300);
        isShown = false;
    }

    function getDocHeight() {
        var D = document;
        return Math.max(
        Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
        Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
        Math.max(D.body.clientHeight, D.documentElement.clientHeight));
    }

    function getFocus() {
        divMsgBox.fadeOut(200).fadeIn(200);
    }

    $j("input.msgButton").click(function (e) {
        e.preventDefault();
        var value = $j(this).val();
        if (options.type != "prompt") {
            options.success(value);
        }
        else {
            var inputValues = [];
            $j("div.msgInput input").each(function (index, domEle) {
                var name = $j(this).attr("name");
                var value = $j(this).val();
                var type = $j(this).attr("type");
                if ($j(".msgInput").find('textarea').length>0) {
                    value = $j("#cancelrem").val();
                    type = "textarea";
                }
                if (type == "checkbox" || type == "radiobutton") {
                    inputValues.push({ name: name, value: value, checked: $j(this).attr("checked") });
                }
                else {
                    inputValues.push({ name: name, value: value });
                }
            });
            options.success(value, inputValues);
        }
        hide();
    });

    divMsgBoxBackGround.click(function (e) {
        if (!options.showButtons || options.autoClose) {
            hide();
        }
        else {
            getFocus();
        }
    });
};


function ShowSuccessMsg(message) {
    if (ShowDimmer != undefined)
        ShowDimmer(false);
    $j.msgBox({
        content: message,
        type: "success",
        buttons: [{ value: "Ok" }]
    });
}
function ShowInfoMsg(message) {
    if (ShowDimmer != undefined)
        ShowDimmer(false);
    $j.msgBox({
        content: message,
        type: "info",
        buttons: [{ value: "Ok" }]
    });
}
function ShowErrorMsg(message) {
    if(ShowDimmer!=undefined)
        ShowDimmer(false);
    $j.msgBox({
        content: message,
        type: "error",
        buttons: [{ value: "Ok" }]
        // afterShow: function (result) { alert("Message has been shown!"); }
    });
}
//function ShowConfirmMsg(message) {
//    $j.msgBox({
//        content: message,
//        type: "confirm",
//        buttons: [{ value: "Yes" }, { value: "No" }]
//    });
//}

function CheckMaxInput(form) {
    var maxLen = 150;
    if (form.value.length > maxLen) {
        form.value = form.value.substring(0, maxLen);
        $j("#charcount").val(0);
    }
    else
        $j("#charcount").val(maxLen - form.value.length);
}
