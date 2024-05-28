var mainSqlCM;
$(document).ready(function () {
   if(document.referrer && (document.referrer.toLowerCase().indexOf("/dwb.aspx") == -1 && document.referrer.toLowerCase().indexOf("/axdbscript.aspx") == -1 )){
        $('#schemaBrwsr').addClass('hideMenu');
        $("#toggleScriptMenuLeft").find('span').text('navigate_next')
   }

    $('table').on('scroll resize', function () {
        $(this).children().width($(this).width() + $(this).scrollLeft())
        $(this).children().height($(this).height() + $(this).scrollTop())
    });
    mainSqlCM = CodeMirror.fromTextArea(txtEditor, {
        mode: 'text/x-sql',
        smartIndent: true,
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        autofocus: true,
        hintOptions: {
            tables: callParentNew("mainSqlHintObj")
        },
        theme: "elegant"
    });
    mainSqlCM.on('keyup', EditorAutoComplete);
    $("html").on("keydown",ExecuteShortcut);
    setInterval(function () {
        mainSqlCM.refresh();
    }, 500);

    $('#exeQuery').click(function () {
        var query;
        if (mainSqlCM.getSelection() != "") {
            query = mainSqlCM.getSelection();
        }
        else {
            query = mainSqlCM.getValue();
        }
        ShowDimmer(true);
        try {
            $.ajax({
                url: 'AxDBScript.aspx/callExecuteSQL',
                type: 'POST',
                cache: false,
                async: false,
                data: JSON.stringify({ queryString: query }),
                dataType: 'json',
                contentType: "application/json",
                success: function (msg) {
                    if (msg.d == "SESSION_TIMEOUT") {
                        parent.window.location.href = "../aspx/sess.aspx";
                    }
                    else if (msg.d != "") {
                        var tables = $.fn.dataTable.fnTables(true);
                        $(tables).each(function () {
                            $(this).dataTable().fnDestroy();
                            $(this).empty();
                        });
                        dataJSON = JSON.parse(msg.d);
                        if (typeof dataJSON.error != "undefined") {
                            $('#txtOutput').text(dataJSON.error["msg"]);
                            $('#txtOutput').show();
                            $('#tblOutput').hide();
                            $('#spnRowCnt').hide();
                        }
                        else {
                            if (typeof dataJSON["result"] != "object") {
                                $('#txtOutput').text(dataJSON.result);
                                $('#txtOutput').show();
                                $('#tblOutput').hide();
                                $('#spnRowCnt').hide()
                            }
                            else {
                                $('#txtOutput').hide();
                                $('#tblOutput').show();
                                $('#spnRowCnt').show();
                                createDatatableFromJson(dataJSON, $('#tblOutput'));
                            }
                        }
                    }
                    ShowDimmer(false);
                },
                error: function () {
                    showAlertDialog("error", "Error while executing the query.");
                    ShowDimmer(false);
                }
            });
        }
        catch (exp) {
            showAlertDialog("error", "Error while executing the query.");
            ShowDimmer(false);
        }
        return false;
    });
    $('#clrEdtr').click(function () {
        mainSqlCM.getDoc().setValue('');
        $('#txtOutput').html('').show();
        if ($.fn.DataTable.isDataTable($('#tblOutput'))) {
            $('#tblOutput').DataTable().destroy();
        }
        $('#tblOutput').empty().hide();
        $('#spnRowCnt').hide();
        return false;
    });

   
    $('#copyScript').click(function () {
        var dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = mainSqlCM.getValue();
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
        showAlertDialog("info","copied successfully")
    });
    $('#editScript').click(function () {
        openEditor();
    });
    createTreeView();
    $("input[name=search]").on("keyup", function (e) {
        var n,
            tree = $.ui.fancytree.getTree('#treeView'),
            filterFunc = tree.filterBranches,
            match = $(this).val();
        if (e && e.which === $.ui.keyCode.ESCAPE || $.trim(match) === "") {
            tree.clearFilter();
            return;
        }
        filterFunc.call(tree, match);
    });
    //  $('.DbNavTabs a[href="#QryEditor"]').tab('show');
    $(".DbNavTabs a[data-toggle=tab]").on('click', function (e) {
        var activeNode = $.ui.fancytree.getTree("#treeView").getActiveNode();
        var objType = activeNode.data.parent;
        var objName = activeNode.title;
        var objInfo = $(e.target).text();
        loadObjectInfo(objName, objType, objInfo);
    });
    $("#toggleScriptMenuLeft").on('click', function (e) {
        var value = $(this).find('span').text();
        $('#schemaBrwsr').toggleClass('hideMenu');
        $(this).find('span').text(value == 'navigate_next'?'navigate_before':'navigate_next');
        $($.fn.dataTable.tables(true)).DataTable()
            .columns.adjust();
    });
    $(".CodeMirror").resizable({
        handles: "s",
        resizeWidth: false,
        resize: function (event, ui) {
            setDataTableHeight();
        }
    });
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        $($.fn.dataTable.tables(true)).DataTable()
            .columns.adjust();
    });
    $("html").on("click",".lnkBlob",function(){
    var  data=$(this).data('value');
    var  title=$(this).data('title');
    var htmlToShow="";
    htmlToShow += ' <div class="form-group">';
    htmlToShow += '<textarea id="" name="txtScript" rows="12"  class="form-control" style="resize: none;" >' + decodeBase64(data) + '</textarea>';
    htmlToShow += '</div>';
        displayBootstrapModalDialog(title, "md", "", false, htmlToShow, "", "", "");
    })

});
function setDataTableHeight() {
    if ($.fn.DataTable.isDataTable($('#tblOutput'))) {
        var codeMirrorHight = $('.CodeMirror').outerHeight();
        var hightOfHead = $('.dvOutput .dataTables_scrollHead').outerHeight();
        var hightofRsltHeader = $('.rsltHeader').outerHeight();
        var splitWrapperHight = $('#splitWrapper').outerHeight();
        scrollBodyHeight = splitWrapperHight - (codeMirrorHight + hightofRsltHeader + hightOfHead)
        $('.dvOutput .dataTables_scrollBody').css({ 'height': '', 'max-height': scrollBodyHeight });
    }
}

function EditorAutoComplete(editor, event) {
    if (
        !(event.ctrlKey) &&
        (event.keyCode >= 65 && event.keyCode <= 90) ||
        (event.keyCode >= 97 && event.keyCode <= 122) ||
        (event.keyCode >= 46 && event.keyCode <= 57)
    ) {
        // type code and show autocomplete hint in the meanwhile
        CodeMirror.commands.autocomplete(editor, null, { completeSingle: false });
    }
}
function ExecuteShortcut(event) {
    if (event.ctrlKey && event.keyCode == 69) {
        $('#exeQuery').trigger('click'); 
         event.preventDefault();
         return false;
    }
}
function decodeBase64(base64) {
    const text = atob(base64);
    const length = text.length;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        bytes[i] = text.charCodeAt(i);
    }
    const decoder = new TextDecoder(); // default is utf-8
    return decoder.decode(bytes);
}
function createDatatableFromJson(dataJSON, table) {
    //var table = $('#tblOutput')
    if ($.fn.DataTable.isDataTable(table)) {
        table.DataTable().destroy();
        table.empty();
    }

    if (typeof dataJSON["result"]["row"] != "undefined" && dataJSON["result"]["row"].length != 0) {
        table.DataTable({
            data: dataJSON["result"]["row"],
            columns: Object.keys(dataJSON["result"]["row"][0]).map(function (item) {
            if( $.map(dataJSON["result"]["fields"],function(val,key) {
                    if(val["name"] == item) return val["datatype"];
                 }).toString() == "blob")
                 return { data: item, title: item,
                     render: function (data, type, row, meta) {
                   return "<a href='#' class='lnkBlob' data-value=" + data +" data-title=" + item +">Blob</a>";
                } }
                 else
                return { data: item, title: item }
            }),
            "autoWidth": false,
            "paging": false,
            "filter": false,
            "bInfo": false,
            "scrollX": true,
            "scrollY": "200px",
        });
        if (table.is($('#tblOutput'))) {
            var rowCnt = $('#tblOutput').DataTable().data().count();
            $('#spnRowCnt').text("No. of rows : " + rowCnt);
            setDataTableHeight();
        }
        else {
            $(".dataTables_scrollBody").css({ 'height': '', 'max-height': ' calc(100vh - 99px)' });
        }
        $('#noRecord').addClass('hide');

    }
    else {
        if (table.is($('#tblOutput'))) {
           // $('#txtOutput').text("No records found.")
            showAlertDialog("warning","No records found");
            $('#spnRowCnt').text("No. of rows : 0");
        }
        else {
            $('#noRecord').removeClass('hide');
        }
    }
}

function createTreeView() {
    if (DbObjData != "") {
        DbObjData = DbObjData.replace(/&apos;/g, "'");
        var xml = parseXml(DbObjData);
        DbObjDataJSON = JSON.parse(xml2json(xml, ""));
        // menujsonn=JSON.parse(menuJson);
    }
    var FinalSchemaJson = _parseTheJSONForTreeView(DbObjDataJSON.root);
    $('#treeView').fancytree({
        icon: true,
        source: FinalSchemaJson,
        extensions: ["glyph", "filter"],
        glyph: {
            preset: "material",
            // map:{}
            map: {
                _addClass: "material-icons",
                checkbox: { text: "check_box_outline_blank" },
                checkboxSelected: { text: "check_box" },
                checkboxUnknown: { text: "indeterminate_check_box" },
                dragHelper: { text: "play_arrow" },
                dropMarker: { text: "arrow-forward" },
                error: { text: "warning" },
                expanderClosed: { text: "chevron_right" },
                expanderLazy: { text: "last_page" },
                expanderOpen: { text: "expand_more" },
                loading: { text: "autorenew", addClass: "fancytree-helper-spin" },
                nodata: { text: "info" },
                noExpander: { text: "" },
                radio: { text: "radio_button_unchecked" },
                radioSelected: { text: "radio_button_checked" },
                // Default node icons.
                // (Use tree.options.icon callback to define custom icons based on node data)
                doc: { text: "web_asset" },
                docOpen: { text: "web_asset" },
                folder: { text: "folder" },
                folderOpen: { text: "folder_open" }
            }

        },
        filter: {
            autoExpand: true,
            hideExpandedCounter: false,
            mode: "hide",
            counter: false
        },
        click: function (event, data) {
            if (data.targetType == "expander")
                return true;
            var tree = $.ui.fancytree.getTree("#treeView");
            mainSqlCM.getDoc().setValue('');
            $('#noRecord').addClass('hide');
            $('table').each(function () {
                if ($.fn.DataTable.isDataTable($(this))) {
                    $(this).DataTable().destroy();
                    $(this).empty();
                }
            })
            $('#txtOutput').html('');
            $('#tblOutput').empty();
            // $('.DbNavTabs a[href="#QryEditor"]').tab('show')
            if (data.node == tree.getFirstChild()) {
                openEditor();
            }
            else if (data.targetType == "title" && data.node.folder == true) {
                $('.DbNavTabs').hide();
                $('.AxDBToolBar').hide();
                $('.dvOutput').hide();
                $('.tab-content').hide();
                $('#dvObjList').show();
                var objType = data.node.title;
                var objName = "";
                var objInfo = "allobjData";
                loadObjectInfo(objName, objType, objInfo)
            }
            else if (data.targetType == "title" && data.node.folder == false) {
                // $('.DbNavTabs a[href="#dvColumns"]').tab('show')
                showHideRespectiveNavtabs(data);
                // $('.CodeMirror').css("height", "450px");
                $(".CodeMirror").resizable("disable").height("100%");
                //$('.CodeMirror').addClass('openSource');
                mainSqlCM.setOption("readOnly", true);
                mainSqlCM.off('keyup', EditorAutoComplete);
                $("html").off("keydown",ExecuteShortcut);
                $('.DbNavTabs').show();
                $('.AxDBToolBar').hide();
                $('.dvOutput').hide()
                $('.tab-content').show();
                $('#dvObjList').hide();
                $("#ScriptToolBar").show();
                var objType = data.node.data.parent;
                var objName = data.node.title;
                var objInfo;
                if (objType == "Tables" || objType == "Views" || objType == "Indexes")
                    objInfo = "Columns";
                else if (objType == "Sequences")
                    objInfo = "Info";
                else
                    objInfo = "Script/Source";
                loadObjectInfo(objName, objType, objInfo)

            }
        },

    })

}
function openEditor() {
    $(".CodeMirror").resizable("enable").height("50%");
    mainSqlCM.setOption("readOnly", false);
    mainSqlCM.on('keyup', EditorAutoComplete);
    $("html").on("keydown",ExecuteShortcut);
    mainSqlCM.refresh();
    $('.DbNavTabs a[href="#QryEditor"]').tab('show')
    $('.DbNavTabs').hide();
    $('.AxDBToolBar').show();
    $('.dvOutput').show();
    $('.tab-content').show();
    $('#dvObjList').hide();
    $("#ScriptToolBar").hide();
}
function loadObjectInfo(objName, objType, objInfo) {
    ShowDimmer(true);
    try {
        $.ajax({
            url: 'AxDBScript.aspx/loadObjectInfo',
            type: 'POST',
            cache: false,
            async: false,
            data: JSON.stringify({ objName, objType, objInfo }),
            dataType: 'json',
            contentType: "application/json",
            success: function (msg) {
                var result = msg.d;
                if (msg.d == "SESSION_TIMEOUT") {
                    parent.window.location.href = "../aspx/sess.aspx";
                }
                else {
                    dataJSON = JSON.parse(msg.d);
                    parseObjInfoJSON(dataJSON, objInfo);

                }
                ShowDimmer(false);
            },
            error: function () {
                showAlertDialog("error", "Error while fetching the details.");
                ShowDimmer(false);
            }
        });
    }
    catch (exp) {
        showAlertDialog("error", "Error while fetching the details.");
        ShowDimmer(false);
    }
}
function _parseTheJSONForTreeView(treeJson) {

    let finalJSON = [];
    let { parent: mainParent } = treeJson;
    if (mainParent.length === undefined) {
        mainParent = [mainParent];
    }
    if (mainParent) {
        mainParent.forEach((element, parentIndex) => {
            const { row: childrens } = element;
            if (childrens) {
                let childData = [];
                let iconn = getTheIcon(element.title);
                if (childrens.length == undefined)
                    childData.push({ title: childrens.column1["#text"], tooltip: childrens.column1["#text"], parent: element.title, folder: false, icon: iconn });
                else
                    childrens.forEach((child, childIindex) => {
                        childData.push({ title: child.column1["#text"], tooltip: child.column1["#text"], parent: element.title, folder: false, icon: iconn });
                    });


                finalJSON.push({ title: element.title, folder: true, children: childData, icon: iconn });
            } else {
                // let { name, target, oname } = element;
                // let targetType = _getTheTargetType({ target });
                // targetType === "head" ? folder = true : folder = false;
                let iconn = getTheIcon(element.title);
                finalJSON.push({ title: element.title, folder: false, icon: iconn }); //icon:targetType+"-Image"
            }
        });
    }
    return finalJSON;
}
function getTheIcon(title) {
    switch (title) {
        case 'Editor':
            return { text: 'filter_frames', addClass: 'material-icons' };
        case 'Tables':
            return { text: 'table_chart', addClass: 'material-icons' };
        case 'Views':
            return { text: 'visibility', addClass: 'material-icons' };
        case 'Functions':
            return { text: 'functions', addClass: 'material-icons' };
        case 'Indexes':
            return { text: 'format_list_numbered', addClass: 'material-icons' };
        case 'Procedures':
            return { text: 'format_textdirection_l_to_r', addClass: 'material-icons' };
        case 'Triggers':
            return { text: 'swap_calls', addClass: 'material-icons' };
        case 'Sequences':
            return { text: 'linear_scale', addClass: 'material-icons' };

    }

}
// function parseObjInfoXml(dataxml) {
//     if ($(dataXML).find('source').length != 0) {
//         var source = $(dataXML).find('source')[0];
//         mainSqlCM.getDoc().setValue($(source).find('row column1').text());
//         mainSqlCM.refresh();
//     }
//     if ($(dataXML).find('columns').length != 0) {
//         var columns = $(dataXML).find('columns')[0];
//         createTableviewFromXML(columns, $('#tblColumns'));

//     }
//     if ($(dataXML).find('objdata').length != 0) {
//         var data = $(dataXML).find('objdata')[0];
//         createTableviewFromXML(data, $('#tblData'));
//     }
//     if ($(dataXML).find('indexes').length != 0) {
//         var indexes = $(dataXML).find('indexes')[0];
//         createTableviewFromXML(indexes, $('#tblIndexes'));
//     }
//     if ($(dataXML).find('triggers').length != 0) {
//         var triggers = $(dataXML).find('triggers')[0];
//         createTableviewFromXML(triggers, $('#tblTriggers'));
//     }
//     if ($(dataXML).find('objerrors').length != 0) {
//         var Error = $(dataXML).find('objerrors')[0];
//         // $('#dvError').text($('Error').find('row column1').text())
//         createTableviewFromXML(Error, $('#tblError'));
//     }
//     if ($(dataXML).find('objarguments').length != 0) {
//         var args = $(dataXML).find('objarguments')[0];
//         createTableviewFromXML(args, $('#tblArgs'));
//     }




// }
function parseObjInfoJSON(dataJSON, objInfo) {
    switch (objInfo) {
        case "Script/Source":
            $('#noRecord').addClass('hide');
            if (typeof dataJSON["result"]["row"] != "undefined" && dataJSON["result"]["row"].length != 0) {
                result = dataJSON["result"]["row"][0];
                var keys = Object.keys(dataJSON["result"]["row"][0]);
                mainSqlCM.getDoc().setValue(result[keys[0]]);
            }
            break;
        case "Columns":
            createDatatableFromJson(dataJSON, $('#tblColumns'));
            break;
        case "Indexes":
            createDatatableFromJson(dataJSON, $('#tblIndexes'));
            break;
        case "Triggers":
            createDatatableFromJson(dataJSON, $('#tblTriggers'));
            break;
        case "Data":
            createDatatableFromJson(dataJSON, $('#tblData'));
            break;
        case "Error":
            createDatatableFromJson(dataJSON, $('#tblError'));
            break;
        case "Argument":
            createDatatableFromJson(dataJSON, $('#tblArgs'));
            break;
        case "Info":
            createDatatableFromJson(dataJSON, $('#tblInfo'));
            break;
        case "allobjData":
            createDatatableFromJson(dataJSON, $('#tblObjList'));
            break;

    }
  
}
function showHideRespectiveNavtabs(data) {
    if (data.node.data.parent == "Tables" || data.node.data.parent == "Views" || data.node.title == "Tables" || data.node.title == "Views") {
        $('#tabSource').show();
        $('#tabColumns').show();
        $('#tabIndexes').show();
        $('#tabTriggers').show();
        $('#tabData').show();
        $('#tabErrors').hide();
        $('#tabArgs').hide();
        $('#tabInfo').hide();
        $('.DbNavTabs a[href="#dvColumns"]').tab('show')
    }
    else if (data.node.data.parent == "Procedures" || data.node.title == "Procedures" || data.node.data.parent == "Functions" || data.node.title == "Functions") {
        $('#tabSource').show();
        $('#tabColumns').hide();
        $('#tabIndexes').hide();
        $('#tabTriggers').hide();
        $('#tabData').hide();
        $('#tabErrors').show();
        $('#tabArgs').show();
        $('#tabInfo').hide();
        $('.DbNavTabs a[href="#QryEditor"]').tab('show');
    }
    else if (data.node.data.parent == "Indexes" || data.node.title == "Indexes") {
        $('#tabSource').show();
        $('#tabColumns').show();
        $('#tabIndexes').hide();
        $('#tabTriggers').hide();
        $('#tabData').hide();
        $('#tabErrors').hide();
        $('#tabArgs').hide();
        $('#tabInfo').hide();
        $('.DbNavTabs a[href="#dvColumns"]').tab('show')
    }
    else if (data.node.data.parent == "Triggers" || data.node.title == "Triggers") {
        $('#tabSource').show();
        $('#tabColumns').hide();
        $('#tabIndexes').hide();
        $('#tabTriggers').hide();
        $('#tabData').hide();
        $('#tabErrors').hide();
        $('#tabArgs').hide();
        $('#tabInfo').hide();
        $('.DbNavTabs a[href="#QryEditor"]').tab('show');
    }
    else if (data.node.data.parent == "Sequences" || data.node.title == "Sequences") {
        $('#tabSource').show();
        $('#tabColumns').hide();
        $('#tabIndexes').hide();
        $('#tabTriggers').hide();
        $('#tabData').hide();
        $('#tabErrors').hide();
        $('#tabArgs').hide();
        $('#tabInfo').show();
        $('.DbNavTabs a[href="#dvInfo"]').tab('show')

    }
}

function ShowDimmer(status) {

    DimmerCalled = true;
    var dv = $("#waitDiv");

    if (dv.length > 0 && dv != undefined) {
        if (status == true) {

            var currentfr = $("#middle1", parent.document);
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

            dv = $("#waitDiv", window.opener.document);
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

window.onerror = function (e) {
    showAlertDialog('error', e);
    ShowDimmer(false);
};
