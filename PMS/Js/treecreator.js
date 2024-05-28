(function() {
    var isRootSelected = false;    

    function createTheTreeView({menuJSON,treeContainer,nodeCreatorInput}) {
        treeContainer = $(treeContainer);
        nodeCreatorInput = $(nodeCreatorInput);
        var FinalmenuJson = _parseTheMenuJsonForTreeView(menuJSON.root);
        treeContainer.fancytree({
            extensions: ["edit", "filter"],
            source: FinalmenuJson,
            icon: function(event, data) {
                var node = data.node;

            },
            init: function(event, data) {
                data.tree.rootNode.children[0].setActive();
            },
            beforeActive: function(event, data) {
                // A node is about to be selected: prevent this for folders:
                if (data.node.isFolder()) {
                    return false;
                }
            },
            activate: function(event, data) {
                let parentNode = data.node.key;
                parentNode = parentNode === "root_1" ? "" : parentNode;
                treeContainer.data("parentnodename", parentNode);
                isRootSelected = true;
                var tree = treeContainer.fancytree("getTree");
                node = tree.getActiveNode();
                if (!node.parent.folder)
                    tree.expandAll(false);
                node.setExpanded(true);
            },

        });

        nodeCreatorInput.off('keyup.treeName');
        nodeCreatorInput.on('keyup.treeName', function(e) {
            const inpFld = $(this);
            var tree = treeContainer.fancytree("getTree");
            node = tree.getActiveNode();
            if (node == null) {
                e.preventDefault();
                showAlertDialog("warning","Please select a node");
                // alert("Please select node")
                return;
            }
            if (inpFld.val() !== "") {
                if (isRootSelected) {
                    tree.visit(function(node) {
                        if (node.extraClasses === "newlyAddedNode") {
                            node.remove();
                        }
                    });
                    isRootSelected = false;
                    newData = { title: inpFld.val() };
                    let newSibling;
                    if (node.folder)
                        newSibling = node.addChildren(newData);
                    else
                        newSibling = node.appendSibling(newData);
                    newSibling.addClass("newlyAddedNode");

                } else {

                    var newnode;
                    if (node.folder)
                        newnode = node.getLastChild();
                    else
                        newnode = node.getNextSibling();
                    if (newnode.extraClasses === "newlyAddedNode") {
                        newnode.setTitle(inpFld.val());
                        newnode.setSelected(false);
                    }
                }
            } else {
                tree.visit(function(node) {
                    if (node.extraClasses === "newlyAddedNode") {
                        node.remove();
                        isRootSelected = true;
                    }
                });
            }
        });
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

                    if (Object.prototype.toString.call(childrens) === "[object Object]") {
                        childData.push(_parseTheMenuJsonForTreeView({ parent: [childrens] }));
                    } else {

                        childrens.forEach((child, childIindex) => {
                            childData.push(_parseTheMenuJsonForTreeView({ parent: [child] }));
                        });
                    }
                    finalJSON.push({ title: element.name, key: element.oname, folder: true, children: childData });
                } else {
                    let { name, target, oname } = element;
                    let targetType = _getTheTargetType({ target });
                    targetType === "head" ? folder = true : folder = false;
                    finalJSON.push({ title: name, key: oname, folder: folder, icon: targetType + "-Image" }); //icon:targetType+"-Image"
                }
            });
        }
        return finalJSON.length === 1 ? finalJSON[0] : finalJSON;
    }

    function _getTheTargetType({ target }) {
        let type = "head";
        if (target.indexOf("tstruct.aspx") === 0) {
            type = "tstruct";
        } else if (target.indexOf("iview.aspx") === 0 || target.indexOf("iviewInteractive.aspx") === 0) {
            type = "iview";
        }
        return type;
    }

    window.createTheTreeView = createTheTreeView;
})();
