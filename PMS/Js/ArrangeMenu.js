var menuJSON;
$(document).ready(function (event) {
    if (menuData) {
        menuData = menuData.replace(/&apos;/g, "'");
        var xml = parseXml(menuData);
        menuJSON = JSON.parse(xml2json(xml, ""));
        // menujsonn=JSON.parse(menuJson);
    }

    createTheTreeView({ menuJSON, treeContainer: "#arrangeMenu" });
    $.ui.fancytree.getTree("#arrangeMenu").selectAll(false);
    $("#arrangeMenu").fancytree("getRootNode").visit(function (node) {
        node.setExpanded(false);
    });
    // $(document).off(".fancytree-edit").on("mousedown.fancytree-edit", function(e) {
    //     var node = $.ui.fancytree.getTree("#arrangeMenu").getActiveNode();
    //     if (!$(event.target).hasClass("fancytree-edit-input")) {
    //         node.editEnd(false, event);
    //     }
    //     e.preventDefault();
    //         e.stopPropagation();
    // });
    $('#btnDelete').on('click', function () {

        var tree = $.ui.fancytree.getTree("#arrangeMenu");
        selNodes = tree.getSelectedNodes();
        if(selNodes.length == 0){
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
    $('#btnAdd').on('click', function () {
        // var node = $.ui.fancytree.getTree("#arrangeMenu").getActiveNode();
        // if (node) {
        //     node.editCreateNode("after", {
        //         title: "Node title",
        //         folder: true
        //     });
        // }
        // else {
        $.ui.fancytree.getTree("#arrangeMenu").getRootNode().editCreateNode("child", {
            key: "H" + Date.now().toString(),
            title: "New Folder",
            folder: true,
            level: "0",
        });

        // }
        return false;
    });
    $('#btnSave').on('click', function () {
        var tree=$.ui.fancytree.getTree("#arrangeMenu");
    //     tree.selectAll(false);
    // $("#arrangeMenu").fancytree("getRootNode").visit(function (node) {
    //     node.setExpanded(false);
    // });
        var treeJson = tree.toDict();
        menuJSON.root.parent = ParseTreeJsonToOrignalformat({ TreeJSON: treeJson });
        var MenuXML = OBJtoXML(menuJSON);
        ShowDimmer(true);
        $.ajax({
            url: "ArrangeMenu.aspx/SaveTreeView",
            type: "POST",
            cache: false,
            async: true,
            data: JSON.stringify({
                key: MenuXML
            }),
            contentType: "application/json",
            success: function (data) {
                var result = data.d;
                if (result.status == "success") {
                    showAlertDialog("success", "Data saved successfully");
                }
                else {
                    if (result.msg == "SESSION_TIMEOUT")
                        parent.window.location.href = "../aspx/sess.aspx";
                    else
                        showAlertDialog("error", result.msg);
                }
                ShowDimmer(false)
            },
            failure: function () {
                showAlertDialog("error", "Error while saving.");
               ShowDimmer(false)
            },
            error: function () {
                showAlertDialog("error", "Error while saving.");
                ShowDimmer(false)
            }
        });
    });
    $("#lnkChngIcon").on('click', function () {
        var activeNode = $.ui.fancytree.getTree("#arrangeMenu").getSelectedNodes();
        if (!activeNode.length) {
            showAlertDialog('warning', 'Please select atleast one node.');
            return false;
        }
      createIconPopup('uploadIcon','hdnUserIconList',$('#hdnIconPath').val())
        return false;
    });
  

    $(document).off('click').on("click", '.modal-content #iconWrapperData  span', function (event) {
        // toggleIcons("destroy");
        if ($(event.target).is($('.DltIcnBtn')))
            return true;
        var activeNode = $.ui.fancytree.getTree("#arrangeMenu").getSelectedNodes();
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

    $('body').on("keyup", "#srchIcon", function () {
        var value = $(this).val().toLowerCase();
        $("#iconWrapperData span").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    $(document).on('click', ".DltIcnBtn", function () {
        var fileName = $(this).data('caption');
        var _this = this;
        deleteCnfrmBx = $.confirm({
            theme: 'modern',
            title: "Confirm!",
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
                            url: "ArrangeMenu.aspx/deleteIconImage",
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
                    btnClass: 'coldbtn',
                    action: function () {
                        disableBackDrop('destroy');
                        deleteCnfrmBx = "";
                    }
                },
            }
        });


    });


});
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
    if (filext != "jpg" && filext != "jpeg" && filext != "png"  && filext != "JPG"  && filext != "PNG") {
        var err = new Error();
        err.name = 'File Format';
        err.message = 'Selected file is not supported, please select .jpg, .jpeg, .png file only';
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
    $('.userIcons').append('<span><img src="' + $('#hdnIconPath').val() + e.get_fileName() + '"><a  href="javascript:void(0)" title="Delete" data-caption="' + e.get_fileName() + '" class="icon-arrows-remove DltIcnBtn"></a></span>');
    $('#lblFileInf').text(e.get_fileName());
    $.each($('#uploadIcon input'), function () { //clear the value of hidden file upload control.
        $(this).val("");
    });
}
function OBJtoXML(obj) {
    var xml = "";
    for (var prop in obj) {
        xml += obj[prop] instanceof Array ? '' : "<" + prop + ">";
        if (obj[prop] instanceof Array) {
            for (var array in obj[prop]) {
                xml += "<" + prop + ">";
                xml += OBJtoXML(new Object(obj[prop][array]));
                xml += "</" + prop + ">";
            }
        } else if (typeof obj[prop] == "object") {
            xml += OBJtoXML(new Object(obj[prop]));
        } else {
            xml += obj[prop];
        }
        xml += obj[prop] instanceof Array ? '' : "</" + prop + ">";
    }
    var xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
    return xml
}
(function () {
    var isRootSelected = false;

    function createTheTreeView({ menuJSON, treeContainer }) {
        treeContainer = $(treeContainer);
        //nodeCreatorInput = $(nodeCreatorInput);
        var FinalmenuJson = _parseTheMenuJsonForTreeView(menuJSON.root);
        treeContainer.fancytree({
            checkbox: true,
            selectMode: 2,
            icon: true,
            autoCollapse: true,
            defaultKey: function () {
                return "Head" + Date.now().toString();
            },
            // focusOnSelect: true,
            extensions: ["dnd5", "edit", "glyph"],
            source: FinalmenuJson,//menuJSON,
            dnd5: {
                autoExpandMS: 400,
                focusOnClick: true,
                preventVoidMoves: true, // Prevent dropping nodes 'before self', etc.
                preventRecursion: true, // Prevent dropping nodes on own descendants
                dragStart: function (node, data) {
                    /** This function MUST be defined to enable dragging for the tree.
                     *  Return false to cancel dragging of node.
                     */
                    return true;
                },
                dragEnter: function (node, data) {
                    /** data.otherNode may be null for non-fancytree droppables.
                     *  Return false to disallow dropping on node. In this case
                     *  dragOver and dragLeave are not called.
                     *  Return 'over', 'before, or 'after' to force a hitMode.
                     *  Return ['before', 'after'] to restrict available hitModes.
                     *  Any other return value will calc the hitMode from the cursor position.
                     */
                    // Prevent dropping a parent below another parent (only sort
                    // nodes under the same parent)
                    /*           if(node.parent !== data.otherNode.parent){
                                return false;
                              }
                              // Don't allow dropping *over* a node (would create a child)
                              return ["before", "after"];
                    */
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
                    if (!data.node.folder) {           //This condition restrict user to edit the folder name only.
                        return false;
                    }
                },
                edit: function (event, data) {
                    $(data.input).attr("maxlength", "50");
                }

            },
            // createNode: function(node,data){
            //       node.title= node.title + Date.now().toString();
            // },
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

            //     dragEnd: function(node, data) {
            //     node.debug( "T1: dragEnd: " + "data: " + data.dropEffect + "/" + data.effectAllowed +
            //       ", dataTransfer: " + data.dataTransfer.dropEffect + "/" + data.dataTransfer.effectAllowed, data);
            //       alert("T1: dragEnd")
            //   },
            // icon: function(event, data) {
            //     var node = data.node; preventRecursion

            // },
            activate: function (event, data) {
                //        alert("activate " + data.node);
            },
            lazyLoad: function (event, data) {
                data.result = { FinalmenuJson }
            }


        });
        $(".drag").draggable();

    }


    function _parseTheMenuJsonForTreeView(menuJson) {

        let finalJSON = [];
        let { parent: mainParent } = menuJson;
        if (mainParent.length === undefined) {
            mainParent = [mainParent];
        }
        if (mainParent) {
            mainParent.forEach((element, parentIndex) => {
                const { child: childrens } = element;
                if (childrens) {
                    let childData = [];

                    // if (Object.prototype.toString.call(childrens) === "[object Object]") {
                    //     childData.push(_parseTheMenuJsonForTreeView({ parent: [childrens] }));
                    // } else {

                    //     childrens.forEach((child, childIindex) => {
                    //         childData.push(_parseTheMenuJsonForTreeView({ parent: [child] }));
                    //     });
                    // }

                    if (typeof childrens.length == "undefined") {
                        childData.push(_parseTheMenuJsonForTreeView({ parent: [childrens] }));
                    } else {

                        childrens.forEach((child, childIindex) => {
                            childData.push(_parseTheMenuJsonForTreeView({ parent: [child] }));
                        });
                    }

                    delete element.child;
                    Object.assign(element, { title: element.name, key: element.oname, folder: true, children: childData });
                    finalJSON.push(element);
                } else {
                    let { name, target, oname, icon } = element;
                    let { targetType, iconn } = _getTheTargetType({ target, icon });
                    targetType === "folder" ? folder = true : folder = false;
                    Object.assign(element, { title: name, key: oname, folder: folder, icon: iconn });
                    finalJSON.push(element);
                }
            });
        }
        return finalJSON.length === 1 ? finalJSON[0] : finalJSON;
    }

    function _getTheTargetType({ target, icon }) {
        let targetType = "folder";
        let iconn = "folder";
        if (target) {
            if (target.indexOf("tstruct.aspx") === 0 || target.indexOf("iview.aspx") === 0 || target.indexOf("iviewInteractive.aspx") === 0)
                targetType = 'item';
            if (icon == undefined) {
                if (target.indexOf("tstruct.aspx") === 0) {
                    iconn = "assignment";
                } else if (target.indexOf("iview.aspx") === 0 || target.indexOf("iviewInteractive.aspx") === 0) {
                    iconn = "view_list";
                }
                else if (target.indexOf("page.aspx") == 0) {
                    iconn = "insert_drive_file";
                }
                return { targetType: targetType, iconn: { text: iconn, addClass: 'material-icons' } };
            }
        }

        return { targetType: targetType, iconn: icon };

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
                    JsonToSave.push(Object.assign(element, attr, { name: title, oname: key }, { child: childData }));
                }
                else
                    JsonToSave.push(Object.assign(element, { name: title, oname: key }, { child: childData }));

            } else {
                if (attr)
                    JsonToSave.push(Object.assign(element, attr, { name: title, oname: key }));
                else
                    JsonToSave.push(Object.assign(element, { name: title, oname: key }));
            }

        });
        return JsonToSave;
    }


    window.createTheTreeView = createTheTreeView;
    window.ParseTreeJsonToOrignalformat = ParseTreeJsonToOrignalformat;
})();

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
