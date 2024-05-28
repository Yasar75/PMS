var fancyTreeObj;
// var arrAction = ["attach","new","remove","pdf","print","priview","regenerate packets","save","search","view history","cancel","clearform"];
$(document).ready(function () {
    try{
    var toolbarJSON=JSON.parse(toolbarData);
    var finalToolbarJSON =toolbarJSON.result.row;
    }
    catch(ex){

    }
    
    $("#buttonTree").fancytree({
        checkbox: true,
        selectMode: 2,
        icon: true,
        extensions: ["dnd5", "edit","glyph"],
        source:  finalToolbarJSON ,
        dnd5: {
            autoExpandMS: 400,
            focusOnClick: true,
            preventVoidMoves: true, // Prevent dropping nodes 'before self', etc.
            preventRecursion: true, // Prevent dropping nodes on own descendants
            dragStart: function (node, data) {
                return true;
            },
            dragEnter: function (node, data) {
                if (!node.isFolder()) {
                    return ["before"];
                }
                return true;
            },

            dragDrop: function (node, data) {
                /** This function MUST be defined to enable dropping of items on
                 *  the tree.
                 */
                data.otherNode.moveTo(node, data.hitMode);
            },
            dragEnd: function (node, data) {
                node.data.level = (node.getLevel() - 1).toString()
            }

        },
        edit: {
            adjustWidthOfs: null,
            triggerStart: ["clickActive", "dblclick", "f2", "mac+enter", "shift+click", "active", "focus"],
            beforeEdit: function (event, data) {

            },
            edit: function (event, data) {
                $(data.input).attr("maxlength", "20");
            }
          // beforeClose: function () { return false; }
        },
        glyph: {

            preset: "material",
            ///map:{}
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
                doc: { text: "radio_button_checked" },
                docOpen: { text: "web_asset" },
                folder: { text: "group_work" },
                folderOpen: { text: "lens" }
            }
        },
        activate: function (event, data) {
            //        alert("activate " + data.node);
        }
    });
    fancyTreeObj = $.ui.fancytree.getTree("#buttonTree");
    $('#btnEdit,#btnAdd').on('click', function () {
        if ($(this).data("value") == "Edit") {
            if (fancyTreeObj.getSelectedNodes().length < 1) {
                showAlertDialog("warning", "select at least one button");
                return false;
            }
            if (fancyTreeObj.getSelectedNodes().length > 1) {
                showAlertDialog("warning", "select only one node at a time");
                return false;
            }
            if (fancyTreeObj.getSelectedNodes()[0].isFolder()) {
                showAlertDialog("warning", "you can ony edit a button by this option. To edit a group double click on on the group node");
                return false;
            }
        }
        showEditNaddbtnDialog($(this).data("value"));
    });
    $('#AddGrp').on('click', function () {
        fancyTreeObj.getRootNode().editCreateNode("child", {
            key: "grp" + Date.now().toString(),
            title: "New group",
            folder: true
        });
    });

    $('html').on('click', '#dialogSubmit', function () {
        if (validateEditNaddbtnDialog($(this).data("dtype"))) {
            if ($(this).data("dtype") == 'Edit') {
                var node = $.ui.fancytree.getTree("#buttonTree").getSelectedNodes();
                node[0].setTitle($("#txtCaption").val());
               // node[0].data.action = $("#ddAction option:selected").val();
                node[0].data.action =$("#txtAction").val();
                node[0].data.task =$("#txtTask").val();
                node[0].data.script = $("#txtScript").val();
                node[0].renderTitle();
            }
            else {

                fancyTreeObj.getRootNode().addChildren({
                    key: $("#txtID").val(),
                    title: $("#txtCaption").val(),
                    // action: $("#ddAction option:selected").val(),
                    action: $("#txtAction").val(),
                    task:$("#txtTask").val(),
                    script: $("#txtScript").val()
                });
            }
            closeModalDialog();
        }


    })
    $('#chngicon').on('click',function() {
        var activeNode = fancyTreeObj.getSelectedNodes();
        if (!activeNode.length) {
            showAlertDialog('warning', 'Please select atleast one node.');
            return false;
        }
        createIconPopup('uploadIcon','hdnUserIconList',$('#hdnIconPath').val());
    })
   
    $(document).off('click').on("click", '.modal-content #iconWrapperData  span', function (event) {
        // toggleIcons("destroy");
        if ($(event.target).is($('.DltIcnBtn')))
            return true;
        var activeNode = fancyTreeObj.getSelectedNodes();
            if ($(this).find('img').length) {
                var filename = $(this).find('img').attr('src');
                for (var i = 0; i < activeNode.length; i++) {
                    activeNode[i].icon = filename;
                    activeNode[i].renderTitle();
                }
            }
            else {
                icon = $(this).text();
                for (var i = 0; i < activeNode.length; i++) {
                    activeNode[i].icon = { text: icon, addClass: 'material-icons' };
                    activeNode[i].renderTitle();
                }
            }
    });

    $(document).on('click', ".DltIcnBtn", function () {
        var fileName = $(this).data('caption');
        var _this = this;
        deleteCnfrmBx = $.confirm({
            theme: 'modern',
            title: "Confirm",
            onContentReady: function () {
                disableBackDrop('bind');
            },
            onOpen: function () { $('.cnfrmBxHotBtn').focus(); },
            escapeKey: 'buttonB',
            //rtl: isRtl,
            content: "Do you realy want to delete ?",
            //columnClass: 'col s6 offset-s3',
            buttons: {
                buttonA: {
                    text: "Yes",
                    btnClass: 'btn btn-primary',
                    action: function () {
                        $.ajax({
                            url: "ToolbarManager.aspx/deleteIconImage",
                            type: "POST",
                            data: JSON.stringify({ fileName }),
                            dataType: 'json',
                            contentType: "application/json",
                            success: function (data) {
                                var result = data.d;
                                if (result == "Success") {
                                    $(_this).parent('span').remove();
                                    var fileArray = $('#hdnUserIconList').val().split(',');
                                    var index = fileArray.indexOf(fileName);
                                    fileArray.splice(index, 1);
                                    $('#hdnUserIconList').val(fileArray.join());
                                    showAlertDialog("success", "Icon deleted successfully");
                                }
                                else {
                                    showAlertDialog("error", "Error while Deleting");
                                }
                            },
                            failure: function () {
                                showAlertDialog("error", "Error while Deleting");
                            },
                            error: function () {
                                showAlertDialog("error", "Error while Deleting");
                            }
                        });
                        deleteCnfrmBx = "";
                    }
                },
                buttonB: {
                    text: "Cancel",
                    btnClass: 'btn btn-bg-light btn-color-danger btn-active-light-danger',
                    action: function () {
                        disableBackDrop('destroy');
                        deleteCnfrmBx = "";
                    }
                },
            }
        });


    });
    $('#btnDelete').on('click', function () {
       // var tree = $.ui.fancytree.getTree("#arrangeMenu");
        selNodes = fancyTreeObj.getSelectedNodes();
        if (selNodes.length == 0) {
            showAlertDialog('warning', 'Please select atleast one node.');
            return false;
        }
        selNodes.forEach(function (node) {
            // if (!node.folder) {           //This condition restrict user to remove folders only.
            //     return false;
            // }
            while (node.hasChildren()) {
                node.getFirstChild().moveTo(node.parent, "child");
            }
            node.remove();
        });
        return false;
    });
    $('#btnSave').on('click', function () {
       // var tree=$.ui.fancytree.getTree("#arrangeMenu");
       
            
            var treeJSON = ParseTreeJsonToOrignalformat({ TreeJSON: fancyTreeObj.toDict() });
            var toolbarJSON =JSON.stringify(treeJSON);
           // ShowDimmer(true);
            $.ajax({
                url: "ToolbarManager.aspx/callSaveToolbarWS",
                type: "POST",
                cache: false,
                async: true,
                data: JSON.stringify({
                    structType,structName,toolbarJSON
                }),
                contentType: "application/json",
                success: function (data) {
                    var result = data.d;
                    if (result.status == "success") {
                        showAlertDialog("success", "Data saved successfully");
                        location.reload();
                    }
                    else {
                        if (result.msg == "SESSION_TIMEOUT")
                            parent.window.location.href = "../aspx/sess.aspx";
                        else
                            showAlertDialog("error", result.msg);
                    }
                  //  ShowDimmer(false)
                },
                failure: function () {
                    showAlertDialog("error", "Error while saving.");
                 //  ShowDimmer(false)
                },
                error: function () {
                    showAlertDialog("error", "Error while saving.");
                   // ShowDimmer(false)
                }
            });
    });

});

function oncontentLoad() {

}

function showEditNaddbtnDialog(dialogeType) {
    var htmlToShow = "";
    var height = 20;
    htmlToShow += '<div class="col-sm-6 col-md-6">'
    htmlToShow += ' <div class="form-group">';
    htmlToShow += '<label for="txtID">ID</label>';
    htmlToShow += '<span class="red">*</span>';
    htmlToShow += '<input required id="txtID" type="text" class="form-control fldNme dialogInptFld" >';
    htmlToShow += '</div>';
    htmlToShow += '</div>';
    htmlToShow += '<div class="col-sm-6 col-md-6">'
    htmlToShow += ' <div class="form-group">';
    htmlToShow += '<label for="txtCaption">Caption</label>';
    htmlToShow += '<span class="red">*</span>';
    htmlToShow += '<input required id="txtCaption" type="text" class="form-control fldNme dialogInptFld" >';
    htmlToShow += '</div>';
    htmlToShow += '</div>';

    // htmlToShow += ' <div class="form-group">';
    // htmlToShow += '<label for="ddAction">Action</label>';
    // htmlToShow += '<select class="form-control dialogSlctFld" id="ddAction">';
    // htmlToShow += '<option value="true">--select--</option>';
    // $.each(arrAction,function(i,e){
    //     htmlToShow += '<option value="'+ e +'">'+ e +'</option>';
    // });
    // htmlToShow += ' </select>';
    // htmlToShow += '</div>';
    htmlToShow += '<div class="col-sm-6 col-md-6">'
    htmlToShow += ' <div class="form-group">';
    htmlToShow += '<label for="txtAction">Action</label>';
    htmlToShow += '<input required id="txtAction" type="text" class="form-control dialogInptFld" >';
    htmlToShow += '</div>';
    htmlToShow += '</div>';
    htmlToShow += '<div class="col-sm-6 col-md-6">'
    htmlToShow += ' <div class="form-group">';
    htmlToShow += '<label for="txtTask">Task</label>';
    htmlToShow += '<input required id="txtTask" type="text" class="form-control dialogInptFld" >';
    htmlToShow += '</div>';
    htmlToShow += '</div>';
    htmlToShow += '<div class="col-sm-12 col-md-12">'
    htmlToShow += ' <div class="form-group">';
    htmlToShow += '<label for="txtScript">Script</label>';
    htmlToShow += '<textarea id="txtScript" name="txtScript"  class="form-control" ></textarea>';
    htmlToShow += '</div>';
    htmlToShow += '</div>';
    htmlToShow += '<input type="submit" name="Submit" value="Submit" data-dtype="' + dialogeType + '" id="dialogSubmit" class="btn btn-primary"  style="margin: 0px auto;display: block;">';
    if (dialogeType == "Edit") {
        displayBootstrapModalDialog("Button", "md", "290px", false, htmlToShow, "", loadDataonEditDialog, "");
    }
    else {
        displayBootstrapModalDialog("Button", "md", "290px", false, htmlToShow, "", onAddDialogueContentLoad, "");
    }

}
function loadDataonEditDialog() {
    createTheEditor({ type: "expression", textarea: $('#txtScript')[0] })
    var node = fancyTreeObj.getSelectedNodes()[0];
    $("#txtID").val(node.key).prop("readonly", true);;
    $("#txtCaption").val(node.title);
    $("#txtAction").val(node.data.action);
    $("#txtTask").val(node.data.task);
    //$("#ddAction option[value='" + node.data.action + "']").attr('selected', 'selected');
    $("#txtScript").val(node.data.script);
}
function validateEditNaddbtnDialog(dialogeType) {
    if (dialogeType == "Add") {
        if ($("#txtID").val() == "") {
            showAlertDialog("warning", "ID field can not be empty.");
            return false;
        }

        if (fancyTreeObj.getNodeByKey($("#txtID").val())) {
            showAlertDialog("warning", "Button ID alredy exists.");
            return false;
        }
    }

    if ($("#txtCaption").val() == "") {
        showAlertDialog("warning", "Button Caption can not be empty.");
        return false;
    }

    // if ($("#ddAction option:selected").index() == 0 && $("#txtScript").val() == "") {
    //     showAlertDialog("warning", "give a button Action or script");
    //     return false;
    // }
    return true;
}

function validateFile(sender, args) {
    var filename = args.get_fileName();
    var filext = filename.substring(filename.lastIndexOf(".") + 1);
    var size = args._length;
    if ($('#hdnUserIconList').val().indexOf(filename) != -1) {
        var err = new Error();
        err.name = 'Duplicate File';
        err.message = 'Selected file alredy exists';
        throw (err);
        return false;
    }
    if (filext != "jpg" && filext != "jpeg" && filext != "png" && filext != "JPG" && filext != "PNG") {
        var err = new Error();
        err.name = 'File Format';
        err.message = 'Selected file is not supported, please select .jpg, .gif, .png file only';
        throw (err);
        return false;
    }
    if (size > 515785) {
        var err = new Error();
        err.name = 'Max Size';
        err.message = 'Max. icon upload size is 500 KB';
        throw (err);
        return false;
    }


}
function uploadError(sender, args) {
    showAlertDialog('error', args.get_errorMessage());
    $.each($('#uploadIcon input'), function () { //clear the value of hidden file upload control.
        $(this).val("");
    });
}
function SetNodeIcon(sender, e) {
    $('#hdnUserIconList').val($('#hdnUserIconList').val() + e.get_fileName() + ',');
    $('.userIcons').append('<span><img src="' + $('#hdnIconPath').val() + e.get_fileName() + '"><a  href="javascript:void(0)" title="Delete" data-caption=' + e.get_fileName() + ' class="icon-arrows-remove DltIcnBtn"></a></span>');
    $('#lblFileInf').text(e.get_fileName());
    $.each($('#uploadIcon input'), function () { //clear the value of hidden file upload control.
        $(this).val("");
    });
}

function onAddDialogueContentLoad() {
    createTheEditor({ type: "expression", textarea: $('#txtScript')[0] })
}
function ParseTreeJsonToOrignalformat({ TreeJSON }) {
    let JsonToSave = [];
    TreeJSON.forEach((element, parentIndex) => {
        const { data: attr, children: childrens, title: title, key: key } = element;
        delete element.children;
        delete element.data;
        if (childrens) {
            let childData = [];

            if (typeof childrens.length == "undefined") {
                childData.push(ParseTreeJsonToOrignalformat({ TreeJSON: [childrens] }));
            } else {

                childrens.forEach((child, childIindex) => {
                    childData.push(ParseTreeJsonToOrignalformat({ TreeJSON: [child] }));
                });
            }
            if (attr) {
                JsonToSave.push(Object.assign(element, attr, { child: childData }));
            }
            else
                JsonToSave.push(Object.assign(element, { child: childData }));

        } else {
            if (attr)
                JsonToSave.push(Object.assign(element, attr, { name: title, oname: key }));
            else
                JsonToSave.push(element);
        }

    });
    return JsonToSave;
}

// var script = "var toolbarBtnJSON = "+ toolbarBtnJSON;
// modalObj.$modal.find('#popupIframeRemodal').contents().find('body').append($('<script>').html(script))