// var ivColDesignJSON = callParentNew("ivColDesignJSON");
var dwbiName = "";
let tableColumnWidth = 0;
let visibleTableColumnWidth = 0;
let minCellWidth = 15;
let listViewCheckBoxSize = 40;
// let iName = callParentNew("iName");
function axDevIvDrawTable(ivDatas, dwbIvDefName) {
    headerText = ["", ...ivDatas.map(col => col.f_caption)];
    fieldName = ["rowno", ...ivDatas.map(col => col.f_name)];
    colWidth = ["10", ...ivDatas.map(col => col.column_width)];
    hideColumn = ["true", ...ivDatas.map((col) => {
        // return false;
        if (col.hidden == "T")
            return true
        else if (col.hidden == "F")
            return false
        else return col.hidden;
    })];
    recordIds = ["0", ...ivDatas.map(col => col.recordid)];
    queryCol = [true, ...ivDatas.map((col) => {
        if (col.isquerycol == "*")
            return true
        else if (col.isquerycol.toString().toLowerCase() == "f")
            return false
        else return col.isquerycol;
    })];
    hyperlinkid = ["0", ...ivDatas.map(col => col.hyperrecid)];
    dwbiName = dwbIvDefName;
    let _this = this;
    
    tableColumnWidth = 0;
    visibleTableColumnWidth = 0;

    tableColumnWidth += ((findGetParameter("tstcaption") == null ? minCellWidth : listViewCheckBoxSize));//for checkbox column
    // visibleTableColumnWidth += (findGetParameter("tstcaption") == null ? minCellWidth : listViewCheckBoxSize);//for checkbox column

    $("#GridView1Wrapper").hide();
	$("#GridView2Wrapper").empty();  
    $("#GridView2Wrapper").show();

    $("#GridView2Wrapper").append($(`
    <table class="gridData ivirMainGrid iviewBuilder stripe row-border hover order-column table dataTable" rules="all" border="1" id="GridView1Dnd" data-row>
        <thead>
            <tr>
                <th id="GridView1Dnd_ctl01_rowno" data-column-name="rowno" style="width:${findGetParameter("tstcaption") == null ? minCellWidth : listViewCheckBoxSize}px;" scope="col"><input name="chkall" id="chkall" onclick="javascript:CheckAll();" style="height:12px;" type="checkbox"></th>
                ${headerText.map(function (a, b, c) {
        if ((fieldName[b] != "rowno")) {
            let width = colWidth[b] || minCellWidth;
            (typeof hideColumn[b] != "undefined" ? hideColumn[b].toString() : "true") == "false" ? tableColumnWidth += parseInt(width, 10) : "";

            let removeColumnBtn = !queryCol[b] ? `<a class="dropdown-item" href="javascript:void(0);" onclick="delNonQueryElem(${recordIds[b]},'ad_ic','${dwbiName}');"><i class="fa fa-trash"></i>Delete Column</a>` : "";
            
            return `<th id="GridView1Dnd_ctl01_${fieldName[b]}" scope="col" data-column-name="${fieldName[b]}"  style="width:${width}px;">
            <a href="javascript:void(0);" onclick="${generateHyperlink(recordIds[b])}">${a.replace(/~/g, "<br />")}</a>
            <div class="three-dot">
                <div class="btn-group dropdown">
                    <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fa fa-ellipsis-v"></i>
                    </button>
                    <div class="dropdown-menu">
                        <a class="dropdown-item" href="javascript:void(0);" onclick="${openHyperlinkPopUp(fieldName[b], hyperlinkid[b])}"><i class="fa fa-link"></i>HyperLink</a>
                        <a class="dropdown-item" href="javascript:void(0);" onclick="LoadIframeDwb('tstruct.aspx?act=open&transid=ad_ic&iName=${dwbiName}');return false;"><i class="fa fa-plus"></i>Add Column</a>
                        ${removeColumnBtn}          
                    </div>
                </div>
            </div>
            </th>`;
        }
    }).join("")}
            </tr>
        </thead>
    </table>
    `).css({ "width": `${tableColumnWidth}px` }).removeAttr('cellspacing rules border style').addClass('ivirMainGrid stripe row-border hover order-column table'));

    axDevIvInitDatatable(headerText, fieldName, colWidth, hideColumn, recordIds, queryCol, hyperlinkid);
}

function axDevIvInitDatatable(headerText, fieldName, colWidth, hideColumn, recordIds, queryCol, hyperlinkid) {
    $.fn.dataTableExt.ofnSearch['alt-status'] = function (sData) {
    };
    $.fn.dataTable.moment('DD/MM/YYYY');
    $.fn.dataTable.ext.errMode = 'none';
    $.fn.dataTable.Api.register('order.neutral()', function () {
        return this.iterator('table', function (s) {
            s.aaSorting.length = 0;
            s.aiDisplay.sort(function (a, b) {
                return a - b;
            });
            s.aiDisplayMaster.sort(function (a, b) {
                return a - b;
            });
        });
    });

    let _datatableObj = new DataTableObj(headerText, fieldName, colWidth, hideColumn, recordIds, queryCol, hyperlinkid);
    ivirDataTableApi2 = $(".ivirMainGrid.iviewBuilder").DataTable(_datatableObj);

    $(".ivirMainGrid.iviewBuilder").on('column-resize.dt.mouseup', function (event, oSettings) {
        saveIvColDesign();
    }).on('column-reorder.dt.mouseup', function (event, oSettings) {
        saveIvColDesign();
    });
}

class DataTableObj {
    constructor(headerText, fieldName, colWidth, hideColumn, recordIds, queryCol, hyperlinkid) {
        let _this = this;
        let isChkBox = "false";
        let indexOfRowNo = -1;
        indexOfRowNo = fieldName.indexOf("rowno");
        if (indexOfRowNo >= 0) {
            isChkBox = (hideColumn[indexOfRowNo].toString() == "false").toString();
        }

        // let rowTypeExist = fieldName.filter(function (a) { return a == "axrowtype" }).length > 0;
        var hiddenColumnIndex = fieldName.map(function (a, b, c) {
            return (hideColumn[b] == "true" ? b : "")
        }).filter(function (a) { return a !== "" });

        tableColumnWidth = 0;
        visibleTableColumnWidth = 0;
        
        let widthIncrement = 0;

        // if($("#GridView1Dnd").width() > $("#GridView2Wrapper").width()){
            try {
                // horizontalScrollExist = true;
                widthIncrement = $("#GridView1Dnd thead tr th:eq(0)").outerWidth() - $("#GridView1Dnd thead tr th:eq(0)").width() || 0;
            } catch (ex) {
                widthIncrement = 0;
            }
        // }

        tableColumnWidth += (findGetParameter("tstcaption") == null ? minCellWidth : listViewCheckBoxSize);

        var designObj = callParentNew("ivirMainObj");

        this.columns = fieldName.map((fld, ind) => {
            let width = colWidth[ind] || minCellWidth;
            (typeof hideColumn[ind] != "undefined" ? hideColumn[ind].toString() : "true") == "false" ? visibleTableColumnWidth += (parseInt(width, 10) + widthIncrement) : "";
           
            tableColumnWidth += (parseInt(width, 10) + widthIncrement);

            $("#GridView1Dnd").css({ "width": `${visibleTableColumnWidth || tableColumnWidth}px` }).parent().css({ "width": `${visibleTableColumnWidth || tableColumnWidth}px` });

            let returnData = { "data": fld, "name": fld, "width": `${colWidth[ind]}px` };

            var designIndex = -1;
            if (!callParentNew("pivotCreated") && (designIndex = designObj?.design?.findIndex(col => col.name == fld)) >= 0) {
                returnData.order = designIndex + 1;

                designIndex = -1;
            }

            return returnData;
        });

        

        if (!callParentNew("pivotCreated") && designObj?.design) {
            designObj?.design.forEach((col, ind) =>$(`table#GridView1Dnd thead th[data-column-name=${col.name}]`)?.attr("data-order", ind + 1)?.data("order", ind + 1));

            $(`table#GridView1Dnd thead th[data-column-name=rowno]`)?.attr("data-order", 0)?.data("order", 0);

            var orderedColumns = $("table#GridView1Dnd thead th").detach();

            orderedColumns = [...orderedColumns].sort((a, b) => {
                var dataA, dataB;
                const contentA = !isNaN(dataA = parseInt($(a).data('order'))) ? dataA : +"1".repeat(7);
                const contentB = !isNaN(dataB = parseInt($(b).data('order'))) ? dataB : +"1".repeat(7);
                return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
            });

            $("table#GridView1Dnd thead tr").append(orderedColumns);

            try {
                this.columns.filter(col => col.name == "rowno")[0].order = 0;
            } catch (ex) { }

            this.columns = _.sortBy(this.columns, ['order']);

            if(hiddenColumnIndex){
                hiddenColumnIndex = hiddenColumnIndex.map(col=>{
                    return this.columns.findIndex(dtCol=>dtCol.name==fieldName[col]);
                });
            }
        }

        this.data = [[fieldName.reduce((result, fld ) => {result[fld] = ``; return result;},{})],[fieldName.reduce((result, fld ) => {result[fld] = ``; return result;},{})],[fieldName.reduce((result, fld ) => {result[fld] = ``; return result;},{})]];
        this.scrollX = true;
        this.dom = "t";
        this.colReorder = {
            resizeCallback() {
            },
            allowReorder: !callParentNew("pivotCreated")
        };
        this.ordering = false;
        this.lengthChange = false;
        this.autoWidth = false;
        this.fixedHeader = false;
        this.initComplete = function (settings, json) {
            $(".gridData").css({ "width": `${visibleTableColumnWidth}px` });

            $("#GridView1Dnd_wrapper").parent().css({ "width": `` });

            $('.dataTables_scrollBody table').on('scroll', function () {
                $('.dataTables_scrollHeadInner table').scrollLeft($(this).scrollLeft());
            });

            $(".dataTables_scrollBody").closest('.dataTables_scroll').width($(".dataTables_scrollBody").closest('.dataTables_scroll').find('.dataTables_scrollHead table thead').width());
            $(".dataTables_scrollBody").closest('.dataTables_scroll').find('.dataTables_scrollHead table thead th:eq(0)').css('cursor', 'col-resize');
            // var e = document.createEvent("MouseEvents");
            // e.initMouseEvent("mousedown", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
            // $(".dataTables_scrollBody").closest('.dataTables_scroll').find('.dataTables_scrollHead table thead th:eq(0)')[0].dispatchEvent(e);
            // e.initMouseEvent("mouseup", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
            // $(".dataTables_scrollBody").closest('.dataTables_scroll').find('.dataTables_scrollHead table thead th:eq(0)')[0].dispatchEvent(e);
            // $(".dataTables_scrollBody").closest('.dataTables_scroll').find('.dataTables_scrollHead table thead th:eq(0)').css('cursor', 'auto');
        };

        if (isChkBox == "true") {
            this.columnDefs = [{
                "targets": 0,
                "orderable": false
            }];
        } else {
            this.columnDefs = [];
        }

        this.columnDefs.push({ targets: hiddenColumnIndex, visible: false, searchable: false });
        this.columnDefs.push({ targets: 0, searchable: false });

        // this.headerCallback = function ( thead, data, start, end, display ) {
        //     $(thead).find('th').each((ind, elm) => {
        //         $(elm).attr("onclick", $(elm).find("a").attr("onclick"));
        //         $(elm).find("a").removeAttr("onclick");
        //     });
        // }
    }
}

function generateHyperlink(recID) {
    if (recID != "") {
        return `LoadIframeDwb('tstruct.aspx?transid=ad_ic&amp;recordid=${recID}');`
    } else {
        return ``;
    }
}

function openHyperlinkPopUp(colID, hyperlinkID) {
        if (hyperlinkID == 0)
            return `createPopupdesign('tstruct.aspx?act=open&amp;transid=ad_ih&amp;hypsource=${colID}&amp;iName=${dwbiName}&amp;AxPop=true');return false;`
        else
            return `createPopupdesign('tstruct.aspx?act=load&amp;transid=ad_ih&amp;recordid=${hyperlinkID}&amp;AxPop=true');return false;`    
}

function saveIvColDesign() {
    var localIvColDesignJSON = [];
    $.each($(".dataTables_scrollHead .ivirMainGrid.iviewBuilder thead tr th"), function (ele, ind) {
        var columnJson = {};
        columnJson["name"] = $(this).data("column-name");
        columnJson["width"] = $(this).width();
        // columnJson["Savestr"] = $(this).data("column-name") + '=' + Math.ceil($(this).width());
        localIvColDesignJSON.push(columnJson);
    });
    callParentNew("ivColDesignJSON=", localIvColDesignJSON);

    try {
        // console.log(ivColDesignJSON?.[iName]?.[0]?.width)
    } catch (error) {
        
    }
}
