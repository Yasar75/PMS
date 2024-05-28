var pageCaption = "", cssFileNameArr = [], jsFileNameArr = [], pageNo, validateHtmlPage = true;
// to publish the uploaded html page in the menu
function SaveNPublishHTML() {
    if (transid == "sect") {
        var htmlString = htmlCodeMirror.getValue();
        var cssString = [];
        var jsString = [];
        $(".formGridRow").each(function () {
            var fileName = $(this).find("[id^='filename']").val();
            var fileExt = $(this).find("[id^='filetype']").val();
            var content = $(this).find("textarea[id^='css_js_src']").val();
            if (fileExt.toLowerCase() == "css") {
                cssFileNameArr.push(fileName + pageNo + "." + fileExt.toLowerCase());
                cssString.push(content)
            }
            else if (fileExt.toLowerCase() == "js") {
                jsFileNameArr.push(fileName + pageNo + "." + fileExt.toLowerCase());
                jsString.push(content);
            }
        });

        pageCaption = GetFieldValue("caption000F1");
        var addToMenu = GetFieldValue("addtomenu000F1");
        try {
            $.ajax({
                type: "POST",
                url: "tstruct.aspx/htmlPagePublish",
                data: JSON.stringify({
                    htmlString, cssFileNameArr, cssString, jsFileNameArr, jsString, pageCaption, addToMenu, pageNo
                }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response.d == "done") {
                        ShowDialog("success", "HTML Pages Saved");
                        SetFormDirty(false);
                    }
                    else {
                        ShowDialog("success", "HTML Pages Saved");
                        SetFormDirty(false);
                    }
                },
                error: function (error) {
                    ShowDialog("error", "Error while publishing");
                }
            });
        }
        catch (e) {
            ShowDialog("error", "Error while publishing");
        }
    }
    else {
        ShowDialog("success", "HTML Pages Saved");
        SetFormDirty(false);
    }
}

function AxAfterTstLoad() {
    if (callParentNew("isDWB") && transid == "sect") {
        $("#searchBar").hide();
        $("#wBdr").addClass("htmlPagesCls");
        ToggleWizardDc("3", "hide");

        var btnRemove = `<button class="hpCustBtns" onclick="javascript:DeleteTstruct();" type="button" title="Delete Tstruct">Remove</button>
    <button class="hpCustBtns" type="button" id="htmlPagesPreview" title="Preview">Preview</button>
    <button class="hpCustBtns" type="button" id="addCssRow" title="Add Css">Add Css</button>
    <button class="hpCustBtns" type="button" id="addJsRow" title="Add Js">Add Js</button>
    <button class="hpCustBtns" onclick="javascript:CallListView('sect');" type="button" title="Close">Close</button>`;
        $(".wizardNextPrevWrapper").append(btnRemove);
        $("#addCssRow, #addJsRow, #htmlPagesPreview").hide();

        if (recordid != "0") {
            loadcontentsFromFile();
        }
        else if (recordid == "0") {
            $("#pageno000F1").val()
            pageNo = "_" + Date.now().toString();
            SetFieldValue("pageno000F1", pageNo);
            UpdateFieldArray("pageno000F1", GetFieldsRowNo("pageno000F1"), pageNo, "parent");
        }

        $("#wizardBodyFooterWrapper").on("click", "#htmlPagesPreview", function () {
            displayBootstrapModalDialog("HTML Preview", "xxl", "400px", false, $('<iframe id="previewIframe"/>'), "", loadPriviewIframe);
        });

        $("#wizardBodyFooterWrapper").on("click", "#addCssRow,#addJsRow", function () {
            var type = $(this).attr("id");
            var textAreaObj, formRowId;
            if (!$("#DivFrame3").is(":visible")) {
                if (recordid != "0" && DCHasDataRows[2].toLowerCase() == "false") {
                    $("[id^=gridAddBtn]").trigger("click");
                }
                $("#DivFrame3").show();
                formRowId = "gridrowWrap3-001";
            }
            else {
                $("[id^=gridAddBtnAdd]").trigger("click");
                var curDcNo = $("[id^=gridAddBtnAdd]").attr("onclick").split(",")[1];
                var nxtRowNo = $("[id^=gridAddBtnAdd]").attr("onclick").split(",")[2];
                nxtRowNo = ("00" + nxtRowNo).slice(-3);
                formRowId = "gridrowWrap" + curDcNo + "-" + nxtRowNo;
            }

            textAreaObj = $("#" + formRowId).find('textarea[id^="css_js"]');
            if (!$(textAreaObj).hasClass("CodeMirrorApplied")) {
                if (type == "addCssRow") {
                    $("#" + formRowId).find('label[for^="css_js"]').text("Css");
                    $("#" + formRowId).find("[id^='filetype']").val("Css");
                    var typeID = $("#" + formRowId).find("input[id^='filetype']").attr("id");
                    SetFieldValue(typeID, "Css");
                    UpdateFieldArray(typeID, GetFieldsRowNo(typeID), "Css", "parent");
                    applyCodeMirror(textAreaObj, "css");
                }
                else if (type == "addJsRow") {
                    $("#" + formRowId).find('label[for^="css_js"]').text("Js");
                    $("#" + formRowId).find("[id^=filetype]").val("Js");
                    var typeID = $("#" + formRowId).find("input[id^='filetype']").attr("id");
                    SetFieldValue(typeID, "Js");
                    UpdateFieldArray(typeID, GetFieldsRowNo(typeID), "Js", "parent");
                    applyCodeMirror(textAreaObj, "js");
                }
            }

            $("html").on("blur", "[id^='filename']", function () {
                var name = $(this).val();
                var regex = /^[0-9a-zA-Z\_]+$/;
                if (!regex.test(name)) {
                    ShowDialog("error", "FileName is invalid");
                    validateHtmlPage = false;
                }
                else
                    validateHtmlPage = true;
            });
            $("#dvhtml_editor_htmlsrc").css({ "height": "calc(100vh - 10px)" });
            $("#wizardBodyFooterWrapper .wizardBodyContent").scrollTop($("#wizardBodyFooterWrapper .wizardBodyContent")[0].scrollHeight);
        });
    }
}

function applyCodeMirror(textAreaObj, type) {
    var editorId = textAreaObj.attr("id");
    if (type.toLowerCase() == "css") {
        var cssCodeMirror = CodeMirror.fromTextArea(textAreaObj[0], {
            mode: 'text/css',
            smartIndent: true,
            lineNumbers: true,
            matchBrackets: true,
            autoCloseBrackets: true,
            autoRefresh: true,
            foldGutter: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            extraKeys: { "Alt-F": "findPersistent" }
        });
        cssCodeMirror.on("blur", function () {
            SetFieldValue(editorId, cssCodeMirror.getValue());
            UpdateFieldArray(editorId, GetFieldsRowNo(editorId), $("#" + editorId).val(), "parent");
        });
        cssCodeMirror.on("keyup", function (editor, event) {
            if (
                !(event.ctrlKey) &&
                (event.keyCode >= 65 && event.keyCode <= 90) ||
                (event.keyCode >= 97 && event.keyCode <= 122) ||
                (event.keyCode >= 46 && event.keyCode <= 57)
            ) {
                CodeMirror.commands.autocomplete(editor, null, { completeSingle: false });
            }
        });
        textAreaObj.addClass("CodeMirrorApplied");
    }

    if (type.toLowerCase() == "js") {
        var jsCodeMirror = CodeMirror.fromTextArea(textAreaObj[0], {
            mode: 'text/javascript',
            smartIndent: true,
            lineNumbers: true,
            matchBrackets: true,
            autoCloseBrackets: true,
            autoRefresh: true,
            foldGutter: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            extraKeys: { "Alt-F": "findPersistent" }
        });
        jsCodeMirror.on("blur", function () {
            SetFieldValue(editorId, jsCodeMirror.getValue());
            UpdateFieldArray(editorId, GetFieldsRowNo(editorId), $("#" + editorId).val(), "parent");
        });
        jsCodeMirror.on("keyup", function (editor, event) {
            if (
                !(event.ctrlKey) &&
                (event.keyCode >= 65 && event.keyCode <= 90) ||
                (event.keyCode >= 97 && event.keyCode <= 122) ||
                (event.keyCode >= 46 && event.keyCode <= 57)
            ) {
                CodeMirror.commands.autocomplete(editor, null, { completeSingle: false });
            }
        });
        textAreaObj.addClass("CodeMirrorApplied");
    }
}

function loadPriviewIframe() {
    $("#previewIframe").css({ "border": "none" });
    $("#previewIframe")[0].contentWindow.document.open();
    if (htmlCodeMirror.getValue() != "") {
        $("#previewIframe")[0].contentWindow.document.write(htmlCodeMirror.getValue());
        var styleObj = $("<style>").prop("type", "text/css");
        var scriptObj = $("<script>");
        $(".formGridRow").each(function () {
            var fileExt = $(this).find("[id^='filetype']").val();
            var content = $(this).find("textarea[id^='css_js_src']").val();
            if (fileExt.toLowerCase() == "css") {
                styleObj.append(content);
            }
            else if (fileExt.toLowerCase() == "js") {
                scriptObj.append(content);
            }
        });
        $("#previewIframe").contents().find("head").append(styleObj[0]);
        $("#previewIframe").contents().find("body").append(scriptObj[0]);
    }
    else {
        $("#previewIframe")[0].contentWindow.document.write("No Preview...!");
    }
    $("#previewIframe")[0].contentWindow.document.close();
}

function addCSSnJSEditorWRTdata() {
    $.each($(".formGridRow"), function () {
        var type = $(this).find("[id^='filetype']").val();
        var textAreaObj = $(this).find('textarea[id^="css_js"]');
        var editorId = textAreaObj.attr('id');

        if (type.toLowerCase() == "css") {
            $(this).find('label[for^="css_js"]').text("Css");
            var cssCodeMirror = CodeMirror.fromTextArea(textAreaObj[0], {
                mode: 'text/css',
                smartIndent: true,
                lineNumbers: true,
                matchBrackets: true,
                autoCloseBrackets: true,
                autoRefresh: true,
                foldGutter: true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                extraKeys: { "Alt-F": "findPersistent" }
            });
            cssCodeMirror.on("blur", function () {
                SetFieldValue(editorId, cssCodeMirror.getValue());
                UpdateFieldArray(editorId, GetFieldsRowNo(editorId), $("#" + editorId).val(), "parent");
            });
            cssCodeMirror.on("keyup", function (editor, event) {
                if (
                    !(event.ctrlKey) &&
                    (event.keyCode >= 65 && event.keyCode <= 90) ||
                    (event.keyCode >= 97 && event.keyCode <= 122) ||
                    (event.keyCode >= 46 && event.keyCode <= 57)
                ) {
                    CodeMirror.commands.autocomplete(editor, null, { completeSingle: false });
                }
            });
            cssCodeMirror.getDoc().setValue(textAreaObj.val());
        }

        if (type.toLowerCase() == "js") {
            $(this).find('label[for^="css_js"]').text("Js");
            var jsCodeMirror = CodeMirror.fromTextArea(textAreaObj[0], {
                mode: 'text/javascript',
                smartIndent: true,
                lineNumbers: true,
                matchBrackets: true,
                autoCloseBrackets: true,
                autoRefresh: true,
                foldGutter: true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                extraKeys: { "Alt-F": "findPersistent" }
            });
            jsCodeMirror.on("blur", function () {
                SetFieldValue(editorId, jsCodeMirror.getValue());
                UpdateFieldArray(editorId, GetFieldsRowNo(editorId), $("#" + editorId).val(), "parent");
            });
            jsCodeMirror.on("keyup", function (editor, event) {
                if (
                    !(event.ctrlKey) &&
                    (event.keyCode >= 65 && event.keyCode <= 90) ||
                    (event.keyCode >= 97 && event.keyCode <= 122) ||
                    (event.keyCode >= 46 && event.keyCode <= 57)
                ) {
                    CodeMirror.commands.autocomplete(editor, null, { completeSingle: false });
                }
            });
            jsCodeMirror.getDoc().setValue(textAreaObj.val());
        }
    });
}

function loadcontentsFromFile() {
    pageCaption = GetFieldValue("caption000F1");
    pageNo = GetFieldValue("pageno000F1");
    var tempSubDirectoryArray = window.location.pathname.toLowerCase().split("/");
    var tempSubDirectory = (tempSubDirectoryArray.slice(0, (tempSubDirectoryArray.indexOf("aspx") > -1 ? tempSubDirectoryArray.indexOf("aspx") : tempSubDirectoryArray.length)).reduce(function (joined, val) {
        if (val && joined == "")
            return joined + val;
        else
            return joined;
    }, "") || "");

    var finalBasePath = window.location.origin + "/" + tempSubDirectory;
    var htmlFilepath = finalBasePath + "/" + proj + "/HTMLPages/" + pageCaption.replace(/ /g, '') + pageNo + ".html";
    jQuery.get(htmlFilepath, function (data) {
        $("#html_editor_htmlsrc000F2").val(data);
    });

    $('.formGridRow').each(function () {
        var jsfilepath = "";
        var Cssfilepath = "";
        var fileName = $(this).find("[id^='filename']").val();
        var fileExt = $(this).find("[id^='filetype']").val();
        var editorid = $(this).find("textarea[id^='css_js_src']").attr('id');
        if (fileExt.toLowerCase() == "css") {
            Cssfilepath = finalBasePath + "/" + proj + "/HTMLPages/Css/" + fileName + pageNo + ".css"
            jQuery.get(Cssfilepath, function (data) {
                $("#" + editorid).val(data);
                if ($("#" + editorid).next(".CodeMirror").length > 0)
                    $("#" + editorid).next(".CodeMirror")[0].CodeMirror.setValue(data);
            });
        }
        else if (fileExt.toLowerCase() == "js") {
            jsfilepath = finalBasePath + "/" + proj + "/HTMLPages/Js/" + fileName + pageNo + ".js"
            jQuery.get(jsfilepath, function (data) {
                $("#" + editorid).val(data);
                if ($("#" + editorid).next(".CodeMirror").length > 0)
                    $("#" + editorid).next(".CodeMirror")[0].CodeMirror.setValue(data);
            });
        }
    });

}

function createHtmlEditor(editorId) {
    var opts = {
        mode: 'htmlmixed',
        htmlMode: true,
        smartIndent: true,
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        lineNumbers: true,
        autoRefresh: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        extraKeys: { "Alt-F": "findPersistent" }
    };

    loadAndCall({
        files: {
            css: ["/Css/codemirror.css",
                "/ThirdParty/codemirror/addon/hint/show-hint.css",
                "/ThirdParty/codemirror/addon/fold/foldgutter.css",
                "/ThirdParty/codemirror/addon/dialog/dialog.css",
                "/ThirdParty/codemirror/addon/search/matchesonscrollbar.css"
            ],
            js: [
                "/Js/codemirror/mode/htmlmixed.js",
                "/Js/codemirror/mode/css.js",
                "/Js/codemirror/mode/javascript.js",
                "/Js/codemirror/mode/xml.js",
                "/ThirdParty/codemirror/addon/edit/matchbrackets.js",
                "/ThirdParty/codemirror/addon/edit/closebrackets.js",
                "/ThirdParty/codemirror/addon/hint/show-hint.js",
                "/ThirdParty/codemirror/addon/hint/html-hint.js",
                "/ThirdParty/codemirror/addon/hint/css-hint.js",
                "/ThirdParty/codemirror/addon/hint/javascript-hint.js",
                "/ThirdParty/codemirror/addon/hint/xml-hint.js",
                "/ThirdParty/codemirror/addon/fold/foldgutter.js",
                "/ThirdParty/codemirror/addon/fold/foldcode.js",
                "/ThirdParty/codemirror/addon/display/autorefresh.js",
                "/ThirdParty/codemirror/addon/dialog/dialog.js",
                "/ThirdParty/codemirror/addon/search/searchcursor.js",
                "/ThirdParty/codemirror/addon/search/search.js",
                "/ThirdParty/codemirror/addon/search/matchesonscrollbar.js",
                "/ThirdParty/codemirror/addon/search/match-highlighter.js",
                "/ThirdParty/codemirror/addon/search/jump-to-line.js",
                //"/ThirdParty/codemirror/addon/scroll/annotatescrollbar.js",
                ]
        },
        callBack() {
            htmlCodeMirror = CodeMirror.fromTextArea(document.getElementById(editorId), opts);
            htmlCodeMirror.on("blur", function () {
                SetFieldValue(editorId, htmlCodeMirror.getValue());
                UpdateFieldArray(editorId, "000", $("#" + editorId).val(), "parent");
            });

            htmlCodeMirror.on('keyup', function (editor, event) {
                if (
                    !(event.ctrlKey) &&
                    (event.keyCode >= 65 && event.keyCode <= 90) ||
                    (event.keyCode >= 97 && event.keyCode <= 122) ||
                    (event.keyCode >= 46 && event.keyCode <= 57)
                ) {
                    CodeMirror.commands.autocomplete(editor, null, { completeSingle: false });
                }
            });
            htmlCodeMirror.getDoc().setValue($("#" + editorId).val());
            if (recordid != "0") {
                addCSSnJSEditorWRTdata();
            }
        }
    });

}

function AxAfterLoadTab(CurrTabNo) {
    if (callParentNew("isDWB") && transid == "sect") {
        if (CurrTabNo == 1) {
            $("#addCssRow, #addJsRow").hide();
        }
        if (CurrTabNo == 2) {
            //var curDcNo = $("[id^=gridAddBtnAdd]").attr("onclick").split(",")[1];
            $("#wizardBodyContent").append($("#DivFrame3").detach());
            $("#addCssRow, #addJsRow, #htmlPagesPreview").show();
            if (recordid == "0" || (recordid != "0" && DCHasDataRows[2].toLowerCase() == "false")) {
                $("#DivFrame3").hide();
            }
        }
    }
}

function AxBeforeSave() {
    if (callParentNew("isDWB") && transid == "sect") {
        return validateHtmlPage;
    }
}