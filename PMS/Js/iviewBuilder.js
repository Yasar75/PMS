; $(function () {
    try {
        new IviewBuilder(structureJSON, isMobileDevice());
    } catch (ex) {
        console.error(ex);
        if (showAlertDialog) { 
            showAlertDialog("error", ex.message);
        } else {
            alert(ex.message)
        }
     }
});

//Iview Builder Singleton Factory
class IviewBuilder {
    constructor(obj, isMobile) {
        if (IviewBuilder.exists) {
            return IviewBuilder.instance;
        }

        IviewBuilder.instance = this;
        IviewBuilder.exists = true;

        this.structureJSON = { ...obj };

        this.shadowStructure = { ...obj };

        this.isMobile = isMobile;

        this.columns = {};
        this.columns.isChkBox = "false";

        // this.actions = {};

        // this.data = [];

        this.stage = new Stages();

        this._processIView();

        return this;
    }
    get actions() {
        let _this = this;
        return _.pickBy(_.filter(_this.shadowStructure.root, (o) => o["@cat"] == "actions")[0], (v, k) => k !== '@cat')
    }
    get hyperlinks() {
        let _this = this;
        return _.pickBy(_.filter(_this.shadowStructure.root, (o) => o["@cat"] == "hyperlinks")[0], (v, k) => k !== '@cat');
    }
    _getColumn() {
        return this.columns;
    }
    _getStages() {
        return this.stage;
    }
    _processIView() {
        this._preInit();
        this._processColumnObj();
        this._processCoreObj();
        // this._getFieldName();
        // this._initHtml();
        this._plotDataTable();
    }
    _preInit() {
        // debugger;
        let _this = this;
        _this.isMobile && $(_this.stage.body).addClass("isMobile");
        
        switch (_this.stage.propertySheet.type) {
            case "div":
                $(_this.stage.body).addClass("isNavPropDiv");
                break;
            case "popup":
                $(_this.stage.body).addClass("isPropPopUp");
                break;
        }
    }
    _processColumnObj() {
        let _this = this;

        let colIndex = 0;
        _this.shadowStructure.root = _.map(_this.shadowStructure.root, (o) => {
            if (o["@cat"] == "querycol" || o["@cat"] == "column") {
                o["@seq"] = ++colIndex;//for rowno
                return o;
            } else {
                return o;
            }
        })

        this.columns.raw = _.filter(_this.shadowStructure.root, (o) => { return o["@cat"] == "querycol" || o["@cat"] == "column" });
        this.columns.FieldName = ["rowno", ...this.columns.raw.map((o) => { return o && o.a2 })];
        this.columns.HeaderText = ["rowno", ...this.columns.raw.map((o) => { return o && o.a3 })];
        this.columns.ColumnType = ["c", ...this.columns.raw.map((o) => { return o && o.a4 && o.a4.length > 0 && o.a4.toLowerCase()[0] })];
        this.columns.HideColumn = ["false", ...this.columns.raw.map((o) => { return o && o.a21 && o.a21.toLowerCase() })];
        this.columns.ColumnWidth = ["", ...this.columns.raw.map((o) => { return o && o.a17 })];
        this.columns.rowTypeExist = this.columns.FieldName.filter(function (a) { return a == "axrowtype" }).length > 0;
        this.columns.filteredColumns = this.columns.FieldName.filter(function (a, b, c) {
            return _this.columns.HideColumn[b] == "false" && (_this.columns.FieldName[b] != "rowno" && _this.columns.FieldName[b] != "axrowtype");
        });
        this.columns.hiddenColumnIndex = this.columns.FieldName.map(function (a, b, c) {
            return _this.columns.FieldName[b] == "rowno" || _this.columns.FieldName[b] == "axrowtype" ? "" : (_this.columns.HideColumn[b] == "true" ? b - (_this.columns.rowTypeExist ? 1 : 0) : "")
        }).filter(function (a) { return a !== "" });
        if (this.columns.isChkBox == "true") {
            this.columns.filteredColumns = ["", ...this.columns.filteredColumns];
        } else {
            this.columns.hiddenColumnIndex = [0, ...this.columns.hiddenColumnIndex];
        }
    }
    _processCoreObj() {
        //_.pickBy
        //_.omitBy
        let _this = this;
        // debugger;
        // _this.actions = _.pickBy(_.filter(_this.shadowStructure.root, (o) => o["@cat"] == "actions")[0], (v, k) => k !== '@cat')
        // _this.hyperlinks = _.pickBy(_.filter(_this.shadowStructure.root, (o) => o["@cat"] == "hyperlinks")[0], (v, k) => k !== '@cat')
    }
    _plotDataTable() {
        this._drawTable();
        this._initDatatable();
        this.ShowDimmer(false);
        this.ShowLoader(false);
    }
    _drawTable() {
        let _this = this;
        let minCellWidth = 15;
        let listViewCheckBoxSize = 40;
        let tableWidth = 0;
        tableWidth += (findGetParameter("tstcaption") == null ? minCellWidth : listViewCheckBoxSize);//for checkbox column
        let thMenuTemplete = `<button title="Actions Menu" class="hide noBg pull-right rightClickMenuIcn" type="button"><span class="fa fa-ellipsis-v " aria-hidden="true"></span></button>`;
        $(this.stage.table.stage).html($(`
        <table class="gridData ivirMainGrid iviewBuilder stripe row-border hover order-column table" rules="all" border="1" id="${this.stage.table.tableId}" style="" data-row>
            <thead>
                <tr>
                    <th id="GridView1_ctl01_rowno" scope="col"><input name="chkall" id="chkall" onclick="javascript:CheckAll();" style="width:${findGetParameter("tstcaption") == null ? minCellWidth : listViewCheckBoxSize}px; height:12px;" type="checkbox">${thMenuTemplete}</th>
                    ${_this.columns.HeaderText.map(function (a, b, c) {
                        if ((_this.columns.FieldName[b] != "rowno")) {
                            let width = _this.columns.ColumnWidth[b] || minCellWidth;
                            (_this.columns.HideColumn[b].toString() || "true") == "false" ? tableWidth += parseInt(width, 10) : "";
                            return `<th id="GridView1_ctl01_${_this.columns.FieldName[b]}" scope="col" style="width:${width}px;">${a.replace(/~/g, "<br />")}${thMenuTemplete}</th>`;
                        }
                    }).join("")}
                </tr>
            </thead>
            <tfoot>
                <tr>
                    <td></td>
                    ${_this.columns.HeaderText.map(function (a, b, c) {
                        if ((_this.columns.FieldName[b] != "rowno")) {
                            return `<td></td>`;
                        }
                    }).join("")}
                </tr>
            </tfoot>
        </table>
        `).css({ "width": `${tableWidth}px` }).removeAttr('cellspacing rules border style').addClass('ivirMainGrid stripe row-border hover order-column table'));
    }
    _generateData() {
        let _this = this;
        return [_this.columns.FieldName.map((f, i) => {
            switch (_this.stage.propertySheet.type) { 
                case "div":
                    return `
                    <a class="btn btn-default dropdown-toggle fa fa-ellipsis-h col-xs-12 col-sm-12 col-md-12 col-lg-12" data-toggle="dropdown" href="#" title=" Open ${_this.columns.HeaderText[i]} Properties" data-toggle="tooltip"data-field="${f}" onclick="${this.stage.propertySheet.call[this.stage.propertySheet.type].create}">
                    </a>
                    `;
                case "popup":
                    return `
                    <div class="dropdown">
                        <span class="btn btn-default dropdown-toggle fa fa-ellipsis-v" data-toggle="dropdown">
                        </span>
                        <ul class="dropdown-menu" role="menu" aria-labelledby="menu1">
                            ${
                                (f != "rowno")
                                ?
                                    _this.stage.propertySheet.sheets.filter((o) => o.propertyIs == "column").map((o, oi) => {
                                        return `
                                        <li role="presentation">
                                            <a role="menuitem" class="${o.icon}" tabindex="-1" href="#" title="${o.title}" data-toggle="tooltip" data-type="${o.type}" data-field="${f}" data-property-is="${o.propertyIs}" onclick="${o.function}">
                                                ${o.title}
                                            </a>
                                        </li>
                                        <!--<a href="#" class="btn btn-default ${o.icon}" aria-label="Left Align" title="${o.title}" data-toggle="tooltip" data-type="${o.type}" data-field="${f}" data-property-is="${o.propertyIs}" onclick="${o.function}">
                                        </a>
                                        <br />
                                        <span>${o.title}</span>-->
                                    `;
                                    }).join("")
                                :
                                    ""
                            }
                        </ul>
                    </div>
                    `;
            }
        })];
    }
    _initDatatable() {
        $.fn.dataTableExt.ofnSearch['alt-status'] = function (sData) {
            //console.log(sData);
            //return sData.replace(/\n/g, " ").replace(/<.*?>/g, "");
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

        let _datatableObj = new DataTableObj();

        this.dataTableApi = $("#" + this.stage.table.tableId).DataTable(_datatableObj);

    }

    ShowDimmer(status) {

        let DimmerCalled = true;
        var dv = $(this.stage.dimmer);

        if (dv.length > 0 && dv != undefined) {
            if (status == true) {

                var currentfr = $(this.stage.mainIframe, parent.document);
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

                dv = $(this.stage.dimmer, window.opener.document);
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
    ShowLoader(status) {
        status ? $(this.stage.table.loader).show() : $(this.stage.table.loader).hide()
    }
    // _getFieldName() {
    //     this.columns.FieldName = this.columns;
    //     debugger;
    // }
    AxClColors = AxClColors;
    showAlertDialog = showAlertDialog;
    callParentNew = callParentNew;
    displayBootstrapModalDialog = displayBootstrapModalDialog;
    closeModalDialog = closeModalDialog;
    createTheEditor = createTheEditor;
    lcm = this.callParentNew("lcm");
}

class Stages {
    constructor() {
        let _this = this;
        this.body = "body";
        this.table = {
            stageWrapper: ".iviewTableWrapper",
            stage: "#GridView2Wrapper",
            tableId: "GridView1",
            loader: ".animationLoading"
        };
        this.AxClColors = new IviewBuilder().AxClColors;
        this.dimmer = "#waitDiv";
        this.mainIframe = "#middle1";
        this.colorPicker = {
            icon: "fa fa-ellipsis-h",
            title: "Color Picker",
            containerClass: "colorPickerInput",
            call: {
                // toggle: "new PropertySheet().toggleColorPicker($(this));"
            }
        };
        this.fontPicker = {
            icon: "fa fa-ellipsis-h",
            title: "Font",
            modalTitle: "Font Picker",
            stage: "body",
            containerId: "fontPickerContainer",
            fontPickerSampleId: "fontPickerSampleText",
            call: {
                generate: "new PropertySheet().generateFontPicker($(this));",
                generatePreview: "new PropertySheet()._generateFontPickerPreview($(this));",
                save: "new PropertySheet().saveFontPicker($(this));",
                // close: "new PropertySheet().closeFontPicker($(this));"
            },
            objects: {
                fontFamily: "fontFamily",
                fontSize: "fontSize",
                fontEffects: "fontEffects",
                fontColor: "fontColor",
                fontScript: "fontScript"
            },
            fontFamily: [
                { value: "Arial", caption: "Arial", cssProp: "font-family", cssValue: "Arial,Helvetica,sans-serif" },
                { value: "Arial Black", caption: "Arial Black", cssProp: "font-family", cssValue: "Arial Black,Gadget,sans-serif" },
                { value: "Comic Sans MS", caption: "Comic Sans MS", cssProp: "font-family", cssValue: "Comic Sans MS,cursive" },
                { value: "Courier New", caption: "Courier New", cssProp: "font-family", cssValue: "Courier New,Courier,monospace" },
                { value: "Georgia", caption: "Georgia", cssProp: "font-family", cssValue: "Georgia,serif" },
                { value: "Impact", caption: "Impact", cssProp: "font-family", cssValue: "Impact,Charcoal,sans-serif" },
                { value: "Lucida Console", caption: "Lucida Console", cssProp: "font-family", cssValue: "Lucida Console,Monaco,monospace" },
                { value: "Lucida Sans Unicode", caption: "Lucida Sans Unicode", cssProp: "font-family", cssValue: "Lucida Sans Unicode,Lucida Grande,sans-serif" },
                { value: "Palatino Linotype", caption: "Palatino Linotype", cssProp: "font-family", cssValue: "Palatino Linotype,Book Antiqua,Palatino,serif" },
                { value: "Tahoma", caption: "Tahoma", cssProp: "font-family", cssValue: "Tahoma,Geneva,sans-serif" },
                { value: "Times New Roman", caption: "Times New Roman", cssProp: "font-family", cssValue: "Times New Roman,Times,serif" },
                { value: "Trebuchet MS", caption: "Trebuchet MS", cssProp: "font-family", cssValue: "Trebuchet MS,Helvetica,sans-serif" },
                { value: "Verdana", caption: "Verdana", cssProp: "font-family", cssValue: "Verdana,Geneva,sans-serif" },
                { value: "Gill Sans", caption: "Gill Sans", cssProp: "font-family", cssValue: "Gill Sans,Geneva,sans-serif" }
            ],
            fontSize: [
                { value: "8", caption: "8pt", cssProp: "font-size", cssValue: "10.67px" },
                { value: "9", caption: "9pt", cssProp: "font-size", cssValue: "12px" },
                { value: "10", caption: "10pt", cssProp: "font-size", cssValue: "13.34px" },
                { value: "11", caption: "11pt", cssProp: "font-size", cssValue: "14.66px" },
                { value: "12", caption: "12pt", cssProp: "font-size", cssValue: "16px" },
                { value: "14", caption: "14pt", cssProp: "font-size", cssValue: "18.66px" },
                { value: "16", caption: "16pt", cssProp: "font-size", cssValue: "21.32px" },
                { value: "18", caption: "18pt", cssProp: "font-size", cssValue: "24px" },
                { value: "20", caption: "20pt", cssProp: "font-size", cssValue: "26.68px" },
                { value: "22", caption: "22pt", cssProp: "font-size", cssValue: "29.32px" },
                { value: "24", caption: "24pt", cssProp: "font-size", cssValue: "32px" },
                { value: "26", caption: "26pt", cssProp: "font-size", cssValue: "34.64px" },
                { value: "28", caption: "28pt", cssProp: "font-size", cssValue: "37.36px" },
                { value: "36", caption: "36pt", cssProp: "font-size", cssValue: "48px" },
                { value: "48", caption: "48pt", cssProp: "font-size", cssValue: "64px" },
                { value: "72", caption: "72pt", cssProp: "font-size", cssValue: "96px" },
            ],
            fontEffects: [
                { caption: "Bold", cssProp: "font-weight", cssValue: "bold", selectedValue: { checked: "True", unchecked: "False" } },
                { caption: "Italic", cssProp: "font-style", cssValue: "italic", selectedValue: { checked: "True", unchecked: "False" } },
                { caption: "Underline", cssProp: "text-decoration", cssValue: "underline", selectedValue: { checked: "True", unchecked: "False" } },
                { caption: "Strikeout", cssProp: "text-decoration", cssValue: "line-through", selectedValue: { checked: "True", unchecked: "False" } },
            ],
            fontColor: [
                { value: "clBlack", caption: "Black", cssProp: "color", cssValue: this.AxClColors["clBlack"] },
                { value: "clMaroon", caption: "Maroon", cssProp: "color", cssValue: this.AxClColors["clMaroon"] },
                { value: "clGreen", caption: "Green", cssProp: "color", cssValue: this.AxClColors["clGreen"] },
                { value: "clOlive", caption: "Olive", cssProp: "color", cssValue: this.AxClColors["clOlive"] },
                { value: "clNavy", caption: "Navy", cssProp: "color", cssValue: this.AxClColors["clNavy"] },
                { value: "clPurple", caption: "Purple", cssProp: "color", cssValue: this.AxClColors["clPurple"] },
                { value: "clTeal", caption: "Teal", cssProp: "color", cssValue: this.AxClColors["clTeal"] },
                { value: "clGray", caption: "Gray", cssProp: "color", cssValue: this.AxClColors["clGray"] },
                { value: "clSilver", caption: "Silver", cssProp: "color", cssValue: this.AxClColors["clSilver"] },
                { value: "clRed", caption: "Red", cssProp: "color", cssValue: this.AxClColors["clRed"] },
                { value: "clLime", caption: "Lime", cssProp: "color", cssValue: this.AxClColors["clLime"] },
                { value: "clYellow", caption: "Yellow", cssProp: "color", cssValue: this.AxClColors["clYellow"] },
                { value: "clBlue", caption: "Blue", cssProp: "color", cssValue: this.AxClColors["clBlue"] },
                { value: "clFuchsia", caption: "Fuchsia", cssProp: "color", cssValue: this.AxClColors["clFuchsia"] },
                { value: "clAqua", caption: "Aqua", cssProp: "color", cssValue: this.AxClColors["clAqua"] },
                { value: "clWhite", caption: "White", cssProp: "color", cssValue: this.AxClColors["clWhite"] },
                { value: "clWindowText", caption: "Custom", cssProp: "color", cssValue: this.AxClColors["clWindowText"] }
            ],
            fontScript: [

            ]
        }
        this.expressionBuilder = {
            icon: "fa fa-ellipsis-h",
            title: "Expression",
            modalTitle: "Expression Builder",
            stage: "body",
            containerId: "expressionBuilderContainer",
            // fontPickerSampleId: "fontPickerSampleText",
            call: {
                generate: "new PropertySheet().generateExpressionBuilder($(this));",
                // generatePreview: "new PropertySheet()._generateFontPickerPreview($(this));",
                save: "new PropertySheet().saveExpressionBuilder($(this));",
                // close: "new PropertySheet().closeFontPicker($(this));"
            },
            // objects: {
            //     fontFamily: "fontFamily",
            //     fontSize: "fontSize",
            //     fontEffects: "fontEffects",
            //     fontColor: "fontColor",
            //     fontScript: "fontScript"
            // }
        }
        this.propertySheet = {
            parent: "#form1",
            containerId: "Wrapperpropsheet",
            propTableContentId: "propTableContent",
            type: "div",//popup/div
            call: {
                div: {
                    create: "new PropertySheet()._generatePropSheetAsNavDiv($(this));",
                },
                popup: {
                    save: "new PropertySheet().save($(this));",
                    close: "new PropertySheet().close($(this));"
                }
            },
            sheets: [
                {
                    name: "addedPsProperties",
                    type: "properties",
                    title: "Properties",
                    icon: "fa fa-edit",
                    propertyIs: "column",
                    function: "new PropertySheet().show($(this));",
                    sheetMap: [
                        {
                            name: "colPropName",
                            caption: "Name",
                            disabled: true,
                            mandatory: true,
                            type: "text",
                            map: "a2",
                            value(sheet, propColumn, propColumnBuildObj) {
                                return new PropertySheet()._getPropertyInputValues(sheet, propColumn, propColumnBuildObj)
                            },
                        },
                        {
                            name: "colPropCaption",
                            caption: "Caption",
                            disabled: false,
                            mandatory: true,
                            type: "text",
                            map: "a3",
                            value(sheet, propColumn, propColumnBuildObj) {
                                return new PropertySheet()._getPropertyInputValues(sheet, propColumn, propColumnBuildObj)
                            },
                        },
                        {
                            name: "colPropDecimals",
                            caption: "Decimals",
                            disabled: false,
                            mandatory: false,
                            type: "number",
                            map: "a5",
                            value(sheet, propColumn, propColumnBuildObj) {
                                return new PropertySheet()._getPropertyInputValues(sheet, propColumn, propColumnBuildObj)
                            },
                        },
                        {
                            name: "colPropDataType",
                            caption: "Data Type",
                            disabled: false,
                            mandatory: true,
                            type: "dropdown",
                            dropdownOptions: [
                                { value: "Character", caption: "Character" },
                                { value: "Numeric", caption: "Numeric" },
                                { value: "Date/Time", caption: "Date/Time" }
                            ],
                            map: "a4",
                            value(sheet, propColumn, propColumnBuildObj) {
                                return new PropertySheet()._getPropertyInputValues(sheet, propColumn, propColumnBuildObj)
                            },
                        },
                        {
                            name: "colPropExpression",
                            caption: "Expression",
                            disabled: false,
                            mandatory: false,
                            type: "expression",
                            map: "a6",
                            value(sheet, propColumn, propColumnBuildObj) {
                                return new PropertySheet()._getPropertyInputValues(sheet, propColumn, propColumnBuildObj)
                            },
                        },
                        {
                            name: "colPropWidth",
                            caption: "Column Width",
                            disabled: true,
                            mandatory: true,
                            type: "number",
                            map: "a17",
                            value(sheet, propColumn, propColumnBuildObj) {
                                return new PropertySheet()._getPropertyInputValues(sheet, propColumn, propColumnBuildObj)
                            },
                        },
                        {
                            name: "colPropAlignment",
                            caption: "Alignment",
                            disabled: false,
                            type: "dropdown",
                            mandatory: true,
                            dropdownOptions: [
                                { value: "Left", caption: "Left" },
                                { value: "Right", caption: "Right" },
                                { value: "Center", caption: "Center" }
                            ],
                            map: "a14",
                            value(sheet, propColumn, propColumnBuildObj) {
                                return new PropertySheet()._getPropertyInputValues(sheet, propColumn, propColumnBuildObj)
                            },
                        },
                        {
                            name: "colPropRunningTotal",
                            caption: "Running Total",
                            disabled: false,
                            mandatory: false,
                            type: "checkbox",
                            map: "a7",
                            defaultValue: false,
                            value(sheet, propColumn, propColumnBuildObj) {
                                return new PropertySheet()._getPropertyInputValues(sheet, propColumn, propColumnBuildObj)
                            },
                        },
                        {
                            name: "colPropDisplayTotal",
                            caption: "Display Total",
                            disabled: false,
                            mandatory: false,
                            type: "checkbox",
                            map: "a8",
                            defaultValue: true,
                            value(sheet, propColumn, propColumnBuildObj) {
                                return new PropertySheet()._getPropertyInputValues(sheet, propColumn, propColumnBuildObj)
                            },
                        },
                        {
                            name: "colPropApplyComma",
                            caption: "Apply Comma",
                            disabled: false,
                            mandatory: false,
                            type: "checkbox",
                            map: "a10",
                            defaultValue: true,
                            value(sheet, propColumn, propColumnBuildObj) {
                                return new PropertySheet()._getPropertyInputValues(sheet, propColumn, propColumnBuildObj)
                            },
                        },
                        {
                            name: "colPropNoRepeat",
                            caption: "No Repeat",
                            disabled: false,
                            mandatory: false,
                            type: "checkbox",
                            map: "a13",
                            defaultValue: false,
                            value(sheet, propColumn, propColumnBuildObj) {
                                return new PropertySheet()._getPropertyInputValues(sheet, propColumn, propColumnBuildObj)
                            },
                        },
                        {
                            name: "colPropZeroOff",
                            caption: "Zero Off",
                            disabled: false,
                            mandatory: false,
                            type: "checkbox",
                            map: "a16",
                            defaultValue: false,
                            value(sheet, propColumn, propColumnBuildObj) {
                                return new PropertySheet()._getPropertyInputValues(sheet, propColumn, propColumnBuildObj)
                            },
                        },
                        {
                            name: "colPropHidden",
                            caption: "Hidden",
                            disabled: false,
                            mandatory: false,
                            type: "checkbox",
                            map: "a21",
                            defaultValue: false,
                            value(sheet, propColumn, propColumnBuildObj) {
                                return new PropertySheet()._getPropertyInputValues(sheet, propColumn, propColumnBuildObj)
                            },
                        },
                        {
                            name: "colPropFont",
                            caption: "Font",
                            disabled: false,
                            mandatory: false,
                            fontPickerType: "properties",
                            type: "fontpicker",
                            map: "a9",
                            value(sheet, propColumn, propColumnBuildObj) {
                                return new PropertySheet()._getPropertyInputValues(sheet, propColumn, propColumnBuildObj)
                            },
                        },
                        {
                            name: "colPropBackColor",
                            caption: "Background Color",
                            disabled: false,
                            mandatory: false,
                            colorPickerType: "properties",
                            type: "colorpicker",
                            map: "a12",
                            value(sheet, propColumn, propColumnBuildObj) {
                                return new PropertySheet()._getPropertyInputValues(sheet, propColumn, propColumnBuildObj)
                            },
                            events:[
                                {
                                    eventAttribute: "onfocus",
                                    eventFunction(sheet, propColumn, propColumnBuildObj) {
                                        return `blur();`
                                        //return `new PropertySheet()._getHyperlinkInfo($(this).val(), '', '${sheet.dependent.structure}')`
                                    }
                                }
                            ],
                        },
                        // {
                        //     name: "colPropUseDefaultColor",
                        //     caption: "Use Default Color",
                        //     disabled: false,
                        //     mandatory: false,
                        //     type: "checkbox",
                        //     map: "???",
                        //     value: (new PropertySheet()._getPropertyInputValues)
                        // }
                        {
                            name: "colPropHyperlinkAction",
                            caption: "Hyperlink Action",
                            disabled: false,
                            type: "dropdown",
                            mandatory: false,
                            dropdownOptions(sheet, propColumn, propColumnBuildObj) {
                                let actions = new IviewBuilder().actions;

                                let returnOptions = [];

                                if (actions && !_.isEmpty(actions)) {
                                    returnOptions = _.map(new IviewBuilder().actions, (o, k) => {
                                        return { "value": k, "caption": (o["@cap"] || "") };
                                    });
                                }
                                
                                return returnOptions;
                            },
                            map: "a55",
                            value(sheet, propColumn, propColumnBuildObj) {
                                return new PropertySheet()._getPropertyInputValues(sheet, propColumn, propColumnBuildObj)
                            },
                        },
                    ],
                    sheetInit(sheet) {
                        // debugger;
                        // $(`.${_this.colorPicker.containerClass}`).spectrum({
                        //     showPaletteOnly: true,
                        //     togglePaletteOnly: true,
                        //     togglePaletteMoreText: 'more',
                        //     togglePaletteLessText: 'less',
                        //     // color: 'blanchedalmond',
                        //     palette: [
                        //         ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
                        //         ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
                        //         ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
                        //         ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
                        //         ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
                        //         ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
                        //         ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
                        //         ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
                        //     ]
                        // });

                        $(`.${_this.colorPicker.containerClass}`).spectrum({
                            showInput: true,
                            className: "full-spectrum",
                            showInitial: true,
                            showPalette: true,
                            showSelectionPalette: true,
                            maxSelectionSize: 10,
                            preferredFormat: "hex",
                            localStorageKey: "spectrum.agile",
                            // color: "#01579b",,
                            chooseText: "Apply",
                            cancelText: "Close",
                            clickoutFiresChange: false,

                            type: _this.propertySheet.type == "div" ? "text" : "color",
                            showAlpha: false,
                            togglePaletteOnly: true,
                            hideAfterPaletteSelect: true,
                            allowEmpty: true,
                            // showPaletteOnly: "true",
                            move: function (color) {
                                if (!color) {
                                    //isReset
                                    $(this).spectrum("set", new PropertySheet()._parseHexAndDelphiColors("", true));
                                    //new IviewBuilder().showAlertDialog("info", new PropertySheet()._parseHexAndDelphiColors($(this).val(), false));
                                }
                            },
                            show: function (color) {
                            
                            },
                            beforeShow: function (color) {
                            
                            },
                            hide: function (color) {
                                // debugger;
                                // if (color) {
                                //     if ($(this).val().toUpperCase() == "#FFFFFF" && $(this).val() != color.toHexString().toUpperCase()) {
                                //         $(this).spectrum("set", new PropertySheet()._parseHexAndDelphiColors("", true));
                                //         new IviewBuilder().showAlertDialog("info", new PropertySheet()._parseHexAndDelphiColors($(this).val(), false));
                                //     }
                                // }
                            },
                            change: function (color) {
                                if (color) {
                                    // $(this).spectrum("set", color.toHexString());
                                    new IviewBuilder().showAlertDialog("info", new PropertySheet()._parseHexAndDelphiColors(color.toHexString(), false));
                                }
                                // else {
                                //     $(this).spectrum("set", new PropertySheet()._parseHexAndDelphiColors("", true));
                                //     new IviewBuilder().showAlertDialog("info", new PropertySheet()._parseHexAndDelphiColors($(this).val(), false));
                                // }
                            },
                            palette: [
                                ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
                                ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
                                ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
                                ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
                                ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
                                ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
                                ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
                                ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
                            ]
                        });
        
                        // $(".colorPicker").spectrum({
                        //     color: "#01579b",
                        //     chooseText: "Apply",
                        //     clickoutFiresChange: false,
                        //     change(color) {
                        //         $(this).prev().val(color.toHexString());
                        //         var type = $(this).data('type');
                        //         var colr = color.toHexString(); // #ff0000
                        //         // homeJsonObj.updateDataInJson($(this).parents('#propertySheet').data('target'), type, colr);
                        //         new IviewBuilder().showAlertDialog("info", colr);
                        //     },
                        //     move(color) {
                        //         var elem = $(this);
                        //         var targetElem = elem.parents('#propertySheet').data('target');
                        //         var type = $(this).data('type');
                        //         var colr = color.toHexString(); // #ff0000
                    
                        //         // assignColorToPanel(targetElem, type, colr)
                        //         new IviewBuilder().showAlertDialog("info", colr);
                        //     },
                        //     hide(color) {
                        //         var elem = $(this);
                        //         var targetElem = elem.parents('#propertySheet').data('target');
                        //         var type = $(this).data('type');
                        //         var colr = color.toHexString(); // #ff0000
                                
                        //         // assignColorToPanel(targetElem, type, colr)
                        //         new IviewBuilder().showAlertDialog("info", colr);
                        //     }
                    
                        // });
                    }
                },
                {
                    name: "addedPsHyperlink",
                    type: "hyperlink",
                    title: "Hyperlink",
                    icon: "fa fa-external-link",
                    propertyIs: "column",
                    map: "@source",
                    function: "new PropertySheet().show($(this));",
                    sheetMap: [
                        {
                            name: "colHyperlinkName",
                            caption: "Name",
                            disabled: false,
                            mandatory: true,
                            type: "text",
                            map(hyperlink) {
                                if (hyperlink) {
                                    return hyperlink;
                                } else {
                                    return ``;
                                }
                            },
                            value(sheet, propColumn, propColumnBuildObj) {
                                return new PropertySheet()._getPropertyInputValues(sheet, propColumn, propColumnBuildObj)
                            },
                        },
                        {
                            name: "colHyperlinkType",
                            caption: "Hyperlink Type",
                            disabled: false,
                            mandatory: false,
                            type: "dropdown",
                            dependent: {
                                structure: "#colHyperlinkStructure"
                            },
                            tempValue: "",
                            dropdownOptions: [
                                { value: "i", caption: "Report" },
                                { value: "t", caption: "Form" },
                                // { value: "page", caption: "Page" }
                            ],
                            map(hyperlink) {
                                if (hyperlink) {
                                    this.tempValue = new IviewBuilder().hyperlinks[hyperlink]["@sname"][0];
                                    return this.tempValue;
                                } else {
                                    return ``;
                                }
                            },
                            events:[
                                {
                                    eventAttribute: "onchange",
                                    eventFunction(sheet, propColumn, propColumnBuildObj) {
                                        return `new PropertySheet()._getHyperlinkInfo($(this).val(), '', '${sheet.dependent.structure}')`
                                    }
                                }
                            ],
                            value(sheet, propColumn, propColumnBuildObj) {
                                return new PropertySheet()._getPropertyInputValues(sheet, propColumn, propColumnBuildObj)
                            },
                        },
                        {
                            name: "colHyperlinkStructure",
                            caption: "Structure Name",
                            disabled: false,
                            mandatory: false,
                            type: "dropdown",
                            dependent: {
                                tablerows: "#colHyperlinkParamFieldMap tbody tr"
                            },
                            parentDependent: {
                                type: "#colHyperlinkType"
                            },
                            dropdownOptions(sheet, propColumn, propColumnBuildObj) {
                                let parentValue = "";
                                if (sheet.parentDependent.type && (parentValue = propColumnBuildObj.sheetMap.filter(s => s.name == sheet.parentDependent.type.substr(1))[0].tempValue)) {
                                    try {
                                        return new PropertySheet()._ajaxGetHyperlinkData(parentValue);
                                    } catch (ex) { 
                                        return [];
                                    }
                                } else {
                                    return [];
                                }
                                /*
                                getHyperlinkInfo(type, ivTstName, dependentField = "") {
                                let _this = this;

                                if (!type) {
                                    $(`${dependentField}`).html(_this._generateSelectOptions(
                                        [], $(`${dependentField}`).data("mandatory"), ""
                                    )).trigger("change");
                                    return;
                                } else {
                                    $(`${dependentField}`).html(_this._generateSelectOptions(
                                        _this._ajaxGetHyperlinkData(type, ivTstName)
                                            // .map(r => {
                                            //     return { value: r.name, caption: r.caption }
                                            // })
                                                , $(`${dependentField}`).data("mandatory"), ""
                                    )).trigger("change");
                                }

                                
                            }
                            */
                            },
                            map(hyperlink) {
                                if (hyperlink) {
                                    return new IviewBuilder().hyperlinks[hyperlink]["@sname"].substr(1);
                                } else {
                                    return ``;
                                }
                            },
                            events:[
                                {
                                    eventAttribute: "onchange",
                                    eventFunction(sheet, propColumn, propColumnBuildObj) {
                                        return `new PropertySheet()._clearParamFieldMap('${sheet.dependent.tablerows}')`
                                    }
                                }
                            ],
                            value(sheet, propColumn, propColumnBuildObj) {
                                return new PropertySheet()._getPropertyInputValues(sheet, propColumn, propColumnBuildObj)
                            },
                        },
                        {
                            name: "colHyperlinkLoadOpen",
                            caption: "Load/Open Structure",
                            disabled: false,
                            type: "dropdown",
                            mandatory: true,
                            dropdownOptions: [
                                { value: "True", caption: "Load", selected: true },
                                { value: "False", caption: "Open" }
                            ],
                            map: "@load",
                            value(sheet, propColumn, propColumnBuildObj) {
                                return new PropertySheet()._getPropertyInputValues(sheet, propColumn, propColumnBuildObj)
                            },
                        },
                        {
                            name: "colHyperlinkPopup",
                            caption: "Popup Structure",
                            disabled: false,
                            mandatory: false,
                            type: "checkbox",
                            map(hyperlink) {
                                // debugger;
                                if (hyperlink) {
                                    return JSON.parse(new IviewBuilder().hyperlinks[hyperlink]["@pop"].toLowerCase()) || this.defaultValue;
                                } else {
                                    return this.defaultValue;
                                }
                            },
                            defaultValue: false,
                            value(sheet, propColumn, propColumnBuildObj) {
                                return new PropertySheet()._getPropertyInputValues(sheet, propColumn, propColumnBuildObj)
                            },
                        },
                        {
                            name: "colHyperlinkRefreshParent",
                            caption: "Refresh parent on close",
                            disabled: false,
                            mandatory: false,
                            type: "checkbox",
                            map(hyperlink) {
                                // debugger;
                                if (hyperlink) {
                                    return JSON.parse(new IviewBuilder().hyperlinks[hyperlink]["@refresh"].toLowerCase()) || this.defaultValue;
                                } else {
                                    return this.defaultValue;
                                }
                            },
                            defaultValue: false,
                            value(sheet, propColumn, propColumnBuildObj) {
                                return new PropertySheet()._getPropertyInputValues(sheet, propColumn, propColumnBuildObj)
                            },
                        },
                        {
                            name: "colHyperlinkParamFieldMap",
                            caption: "Param/Field Map",
                            type: "table",
                            parentDependent: {
                                type: "#colHyperlinkType",
                                structure: "#colHyperlinkStructure"
                            },
                            parentDependentError: "Structure type and Structure is mandatory.",
                            hasCheckbox: true,
                            buttons: [
                                {
                                    name: "colHyperlinkMapAdd",
                                    caption: "Add",
                                    icon: "fa fa-plus",
                                    function: "new PropertySheet()._addTableFields($(this));",
                                    style: "color: grey;"
                                },
                                {
                                    name: "colHyperlinkMapDelete",
                                    caption: "Delete",
                                    icon: "fa fa-minus",
                                    function: "new PropertySheet()._deleteSelectedTableFields($(this));",
                                    style: "color: grey;"
                                },
                                {
                                    name: "colHyperlinkMapClear",
                                    caption: "Delete Hyperlink",
                                    icon: "fa fa-close",
                                    function: "new PropertySheet()._clearTableFields($(this));",
                                    style: "color: red;"
                                }
                            ],
                            columns: [
                                {
                                    name: "colHypParFldName",
                                    caption: "Name",
                                    type: "dropdown",
                                    mandatory: false,
                                    parentDependent: {
                                        type: "#colHyperlinkType",
                                        structure: "#colHyperlinkStructure"
                                    },
                                    class: "colHypParFldName",
                                    dropdownOptions(sheet, propColumn, propColumnBuildObj) {
                                        if($(sheet.parentDependent.type).val() && $(sheet.parentDependent.structure).val()){
                                            return new PropertySheet()._ajaxGetHyperlinkData($(sheet.parentDependent.type).val(), $(sheet.parentDependent.structure).val());
                                            // .map(r => {
                                            //     return { value: r.name, caption: r.caption }
                                            // });
                                        } else {
                                            return [];
                                        }
                                    }
                                    // dropdownOptions: [
                                    //     { value: "True", caption: "n1" },
                                    //     { value: "False", caption: "n2" }
                                    // ],
                                },
                                {
                                    name: "colHypParFldValue",
                                    caption: "Value",
                                    type: "dropdown",
                                    mandatory: false,
                                    class: "colHypParFldName",
                                    dropdownOptions(sheet, propColumn, propColumnBuildObj) {
                                        return new IviewBuilder().columns.FieldName.filter(f => f != "rowno").map(f => {
                                            return { value: `:${f}`, caption: `:${f}` }
                                        });
                                    }
                                }
                            ],
                            map(hyperlink) {
                                // debugger;
                                if (hyperlink) {
                                    return _.filter(new IviewBuilder().hyperlinks[hyperlink], (h, k) => k.indexOf("@") != "0");
                                }
                            },
                            value(sheet, propColumn, propColumnBuildObj) {
                                // debugger;
                                // return new IviewBuilder().hyperlinks;

                                //_.filter(new IviewBuilder().hyperlinks, (o, k) => k == "")
                                let hyperlink = new PropertySheet()._getPropertyInputValues(sheet, propColumn, propColumnBuildObj);

                                if (hyperlink) {
                                    return hyperlink;
                                } else {
                                    return [];
                                }
                            },
                            valueHTML(sheet, propColumn, propColumnBuildObj) {
                                //new PropertySheet()._addTableFields($(this));
                                debugger;
                                return new PropertySheet()._addTableFields($(`<div></div>`).data({table: sheet.name, propSheet: propColumnBuildObj.type}), true);
                                return ``;
                            }
                        }
                    ],
                    sheetInit() {
                        
                    }
                },
                {
                    name: "addedPsCondFormat",
                    type: "condFormat",
                    title: "Conditional Format",
                    icon: "fa fa-paint-brush",
                    propertyIs: "column",
                    function: "new PropertySheet().show($(this));",
                    sheetMap: [
                        {
                            name: "colCondFormat",
                            caption: "Conditional Format",
                            type: "table",
                            // parentDependent: {
                            //     type: "#colHyperlinkType",
                            //     structure: "#colHyperlinkStructure"
                            // },
                            hasCheckbox: true,
                            buttons: [
                                {
                                    name: "colCondFormatAdd",
                                    caption: "Add",
                                    icon: "fa fa-plus",
                                    function: "new PropertySheet()._addTableFields($(this));",
                                    style: "color: grey;"
                                },
                                {
                                    name: "colCondFormatDelete",
                                    caption: "Delete",
                                    icon: "fa fa-minus",
                                    function: "new PropertySheet()._deleteSelectedTableFields($(this));",
                                    style: "color: grey;"
                                },
                                // {
                                //     name: "colCondFormatClear",
                                //     caption: "Delete Hyperlink",
                                //     icon: "fa fa-close",
                                    // function: "new PropertySheet()._clearTableFields($(this));",
                                //     style: "color: red;"
                                // }
                            ],
                            columns: [
                                {
                                    name: "colCondFormatExpression",
                                    caption: "Expression",
                                    type: "expression",
                                    mandatory: false,
                                    // parentDependent: {
                                    //     type: "#colHyperlinkType",
                                    //     structure: "#colHyperlinkStructure"
                                    // },
                                    class: "colCondFormatExpression",
                                    // dropdownOptions(sheet, propColumn, propColumnBuildObj) {
                                        // if($(sheet.parentDependent.type).val() && $(sheet.parentDependent.structure).val()){
                                        //     return new PropertySheet()._ajaxGetHyperlinkData($(sheet.parentDependent.type).val(), $(sheet.parentDependent.structure).val());
                                        // } else {
                                        //     return [];
                                        // }
                                    // }
                                },
                                {
                                    name: "colCondFormatFont",
                                    caption: "Font Settings",
                                    type: "fontpicker",
                                    mandatory: false,
                                    class: "colCondFormatFont",
                                    // dropdownOptions(sheet, propColumn, propColumnBuildObj) {
                                    //     return new IviewBuilder().columns.FieldName.filter(f => f != "rowno").map(f => {
                                    //         return { value: `:${f}`, caption: `:${f}` }
                                    //     });
                                    // }
                                }
                            ]
                        }
                    ],
                    sheetInit() {
                        
                    }
                }
            ],
            allSheetInit() {
                // var PropSheetHTML = "";
                // var propTitle = $("#" + curDivID).data("title") || "Property";
                // var saveEnabled = $("#" + curDivID).data("save") == false ? false : true;
                // $("#Wrapperpropsheet #propertySheet .hpbHeaderTitle span.title").text(propTitle);
                // if (saveEnabled) {
                //     $("#Wrapperpropsheet #propertySheet .hpbHeaderTitle #updateWidget").show();
                // } else {
                //     $("#Wrapperpropsheet #propertySheet .hpbHeaderTitle #updateWidget").hide();
                // }
                // var currentProp = null;
                // if ($("#Wrapperpropsheet table").length > 0) {
                //     currentProp = $("#Wrapperpropsheet table");
                //     //$()
                // }
                // if (currentProp != null) {
                //         if (currentProp.prop("id") != curDivID) {
                //             var parentDiv = currentProp.data("parent");
                //             $("#" + parentDiv).append(currentProp.hide().detach());
                //             $("#Wrapperpropsheet #propTableContent").append($("#" + curDivID).show().detach());
                //         }
                // } else {
                //     $("#Wrapperpropsheet #propTableContent").append($("#" + curDivID).show().detach());
                // }

                // if ($("#" + curDivID).find("select#seldc").length > 0 && $("select#seldc option").length <= 0) {


                //         let propShtDcSelectHtml = "";
                //         DCCaption.forEach((caption, i) => {
                //             propShtDcSelectHtml += `<option value="${DCName[i]}">${caption}</option>`;
                //         });
                //         $('#seldc').html(propShtDcSelectHtml);

                // }

                $("#propertySearchFld").on('keyup', function (e) {
                    var elem = $(this);
                    var enteredVal = elem.val().toLowerCase();
                    var nodata = '<tr class="noDatFoundTr"><td colspan="2" class="center">No data found</td></tr>';
                    $("#propTableContent table tbody .noDatFoundTr").remove();
                    $("#propTableContent table tr:not('.notSearchable')").each(function (index, el) {
                        var presTr = $(this);
                        var childTd = presTr.find('td:first');
                        if (enteredVal != "" && childTd.hasClass('subHeading')) {
                            presTr.hide();
                            return;
                        }
                        childTd.text().toLowerCase().indexOf(enteredVal) === -1 ? presTr.hide() : presTr.show();
                    });
                    if (elem.val() != "" && $("#propTableContent table tr:visible").length == 0) {

                        $("#propTableContent table tbody").append(nodata);
                    }
                });
                $("#propTableContent .propShtDataToggleIcon").on('click', function (e) {
                    var elem = $(this);
                    var target = elem.data('target');
                    $("#propTableContent table tr[data-group='" + target + "']:not('.notSearchable')").toggle();
                    if (elem.hasClass('icon-arrows-up')) {
                        elem.removeClass('icon-arrows-up').addClass('icon-arrows-down');
                    }
                    else if (elem.hasClass('icon-arrows-down')) {
                        elem.removeClass('icon-arrows-down').addClass('icon-arrows-up');
                    }
                    /* Act on the event */
                });
                // $(document).on("keydown", ".customError", function (e) {
                //     $(this).removeClass("customError");
                // });
                // $("#seldataType").on("change", function (e) {
                //     if ($("#seldataType").val() == "Numeric") {
                //         $(".decimalFld").removeClass('notSearchable').show()
                //     }
                //     else {
                //         $(".decimalFld").addClass('notSearchable').hide()
                //         $("#fldDecimal").val(0);
                //     }
                // });
            }
        }
    }
}

class DataTableObj {
    constructor() {
        let _this = this;

        let columns = new IviewBuilder()._getColumn();
        let stage = new IviewBuilder()._getStages();

        this.data = new IviewBuilder()._generateData();

        // this.scrollY = $(stage.table.stageWrapper)[0].offsetHeight + "px";
        // this.scrollX = true;//to be enabled
        // this.scrollX = "100%";
        this.dom = "R<'#ivirCustomContainer.container-fluid'<'row'<'#pillsWrapper.col-md-6 col-sm-6'><'col-md-6 col-sm-6 pull-right'l>>><'#ivirMainDataTableWrapper'<'iviewPreTableCustom'>t<'iviewPostTableCustom'>>";
        this.ordering = false;
        // this.scrollCollapse = true;
        // this.colReorder = false;
        // this.language = {
        //     search: "_INPUT_",
        //     searchPlaceholder: "Search...",
        //     lengthMenu: "Show _MENU_ rows",
        //     paginate: {
        //         next: '<i class="glyphicon glyphicon-arrow-left icon-arrows-right"></i>',
        //         previous: '<i class="glyphicon glyphicon-arrow-left icon-arrows-left"></i>'
        //     },
        // }
        // this.lengthMenu = [10, 25, 50, 75, 100, 250, 500];
        this.lengthChange = false;
        // dataTblObj.select = {
        //     style: "multi"
        // };
        // dataTblObj.paging = true;
        // dataTblObj.pageLength = pageLength = -1;
        // dataTblObj.aaSorting = [];
        // dataTblObj.orderClasses = false;
        this.initComplete = function (settings, json) {
            // $('[data-toggle="tooltip"]').tooltip();
            // /**
            //  * datatable 1st time initialization complete pre call back hook
            //  * @author Prashik
            //  * @Date   2020-05-20T12:08:56+0530
            //  */
            // try {
            //     axDatatablePreInitComplete(settings, json);
            // } catch (ex) { };
            // //enableMobileCards();

            // $("[id=dvSelectedFilters]").removeClass("hide");
            // $("#ivirCButtonsWrapper").removeClass("hide");

            // if (appGlobalVarsObject._CONSTANTS.compressedMode && !callParentNew("isDWB")) {
            //     // $("body").addClass("compressedModeUI");
            //     appGlobalVarsObject.methods.toggleCompressModeUI($('body'));
            // }

            // $(".animationLoading").hide();

            // var scrollExist = $(".dataTables_scrollBody").hasScrollBar();
            // if ($.isEmptyObject(advFiltersObjectToApply) || advFiltersObjectToApply.somedummyfilterjsobjectkey) {
            //     if (scrollExist)
            //         $("#requestNextRecords").hide();
            //     else
            //         $("#requestNextRecords").show();
            // }

            // var specialRowCnt = getSpecialRowCount();

            // if (getAjaxIviewData && (dtDbTotalRecords > nxtScrollSize || specialRowCnt > 0 ? ivDatas.length > nxtScrollSize : false))
            //     appendRowsAfterLoad(); //appends remaining records(except default record count - nxtScrollSize) to the grid after datatable initilization
            // //console.log(new Date() + ': end time');

            // autoSplitChecker();


            // try {
            //     recordsExist = this.fnSettings().fnRecordsTotal() > 0;
            // } catch (ex) { }

            // /**
            //  * datatable 1st time initialization complete post call back hook
            //  * @author Prashik
            //  * @Date   2020-05-20T12:08:56+0530
            //  */
            // try {
            //     axDatatablePostInitComplete(settings, json);
            // } catch (ex) { };

            // setTimeout(function () {
            //     $(window).trigger("resize");
            // }, 0);
        };
        // dataTblObj.preDrawCallback = function (settings) {
        //     scrollTopPosition = Math.round($(".dataTables_scrollBody").scrollTop())
        // };
        // dataTblObj.drawCallback = function (settings) {
        //     /**
        //      * datatable pre in drawCallback hook
        //      * @author Prashik
        //      * @Date   2020-05-20T12:08:56+0530
        //      */
        //     try {
        //         axDatatablePreInDrawCallBack(settings);
        //     } catch (ex) { };

        //     enableMobileCards();
        //     expandCollapseCardsLogic();

        //     drawCallbackPaginationLogic();

        //     /**
        //      * datatable post in drawCallback hook
        //      * @author Prashik
        //      * @Date   2020-05-20T12:08:56+0530
        //      */
        //     try {
        //         axDatatablePostInDrawCallBack(settings);
        //     } catch (ex) { };
        // }
        if (columns.isChkBox == "true") {
            this.columnDefs = [{
                "targets": 0,
                "orderable": false
            }];
        } else {
            this.columnDefs = [];
        }
        // if (task == undefined) {
        //     getAllNumericColumns();
        //     dataTblObj.columnDefs.push({ className: "dt-right", "targets": numericColumns });
        // }

        // this.columnDefs.push({
        //     targets: "_all",
        //     createdCell(elem, cellData, rowData, row, col) {
        //         let colID = columns.FieldName[col];
        //         var rowDataAccess = _this._getPropertyAccess(colID);
        //         if(colID != "rowno"){
        //         // switch (row.toString()) {
        //         //     case "0":
        //         //         $(elem).html("1");
        //         //         break;
        //         //     case "1":
        //         //         $(elem).html("2");
        //         //         break;
        //         //     case "2":
        //         //         $(elem).html("3");
        //         //         break;
        //         //     case "3":
        //         //         $(elem).html("4");
        //         //         break;
        //         //     }
        //         }
        //     }
        // });

        // debugger;
        // dataTblObj.createdRow = (row, data, dataIndex) => {
        //     try {
        //         if (cardTemplatingHTML) {
        //             renderRowTemplete(cardTemplatingHTML, row, data, dataIndex);
        //             return;
        //         }
        //     }catch(ex){}

        //     if (data[getPropertyAccess("axrowtype")] && (data[getPropertyAccess("axrowtype")] == "stot" || data[getPropertyAccess("axrowtype")] == "subhead" || data[getPropertyAccess("axrowtype")] == "gtot")) {
        //         $(row).addClass("specialRow");
        //     }
        //     /**
        //      * Expand/Collapse TreeMethod
        //      * @author Prashik
        //      * @Date   2019-04-11T12:17:31+0530
        //      */
        //     if (cellHeaderConf.root_class_index) {
        //         $(row).addClass((data[getPropertyAccess(cellHeaderConf.root_class_index)] ? data[getPropertyAccess(cellHeaderConf.root_class_index)].toString() : ""));
        //     }

        //     try {
        //         createdRowEndCustom(row, data, dataIndex);
        //     } catch (ex) { };
        // }
        // tableWidth = 0;
        // /**
        //  * smartviews column properties initialization
        //  * @author Prashik
        //  * @Date   2019-04-11T12:18:30+0530
        //  */
        // dataTblObj.columns = FieldName.map((fld, ind) => {
        //     //return {"data": fld, "title": HeaderText[ind]}
        //     //return {"data": getPropertyAccess(fld)}
        //     //return {"data": getPropertyAccess(fld), "type": colTypes[ivHeadRows[fld]["@type"] || (fld == "rowno" ? "n" : "c")]}
        //     var width = ivHeadRows[fld]["@width"] || (isListView && ind == 0 ? listViewCheckBoxSize : minCellWidth);
        //     (ivHeadRows[fld]["@hide"].toString() || "true") == "false" ? tableWidth += parseInt(width, 10) : "";
        //     //tableWidth += parseInt(width, 10);
        //     return { "data": getPropertyAccess(fld), "name": getPropertyAccess(fld), "width": `${width}px`, "className": colAlign[ivHeadRows[fld]["@align"] || (fld == "rowno" && !enableCardsUi ? "Center" : "Left")] }
        // });

        // $(ivirTable).css({ "width": `${tableWidth}px` });
        // //$(ivirTable).outerWidth(tableWidth);
        // /**
        //  * smartviews 1st page data initialization
        //  * @author Prashik
        //  * @Date   2019-04-11T12:18:30+0530
        //  */
        //dataTblObj.data = ivDatas.length != undefined ? ivDatas.slice(0, nxtScrollSize) : ivDatas;

        this.columnDefs.push({ targets: columns.hiddenColumnIndex, visible: false, searchable: false });
        this.columnDefs.push({ targets: 0, searchable: false });

        // dataTblObj.deferRender = true;   
        // return this;
    }
    _getPropertyAccess(property) {
        return !property.startsWith("@") ? "@" + property.toUpperCase() : property;
    }
}

class PropertySheet {
    constructor() {
        if (PropertySheet.exists) {
            return PropertySheet.instance;
        }

        PropertySheet.instance = this;
        PropertySheet.exists = true;

        this.propSheet = "";//type of property sheet
        this.propColumn = "";//column namae of opening property sheet

        this.columns = new IviewBuilder()._getColumn();
        this.stage = new IviewBuilder()._getStages();

        this.fontPickerObj = {};

        this._initPropSheetContainer();

        return this;
    }
    _initPropSheetContainer() {
        let _this = this;
        switch (this.stage.propertySheet.type) {
            case "div":
                _this._initPropSheetAsNavDiv();
                break;
            case "popup":
                _this._initPropSheetAsPopUp();
                break;
        }
    }
    _initPropSheetAsNavDiv() {
        // debugger;
        // $(this.stage.body).addClass("isNavPropDiv");
        // $(this.stage.propertySheet.parent).append(`Prashik`);
        // alert();
    }
    
    _generatePropSheetAsNavDiv(elem) {
        // let tempPropSheet = elem.data("type");
        let tempPropColumn = elem.data("field");

        if (/*this.propSheet == tempPropSheet && */this.propColumn == tempPropColumn) {
            // show existing propertysheet and return
            // return;

        } else {
            // this.propSheet = tempPropSheet;

            this.propColumn = tempPropColumn;

        }

        let columnnCaption = "";

        if (this.propColumn) {
            try {
                columnnCaption = this.columns.HeaderText.filter((f, i) => { if (this.columns.FieldName[i] == this.propColumn) { return true } })[0];
            } catch (ex) { }

            if (!columnnCaption) {
                columnnCaption = this.propColumn;
            }
        }

        // alert();
        // $(this.stage.propertySheet.parent).append(`Prashik`);
        $(`#${this.stage.propertySheet.containerId}`).remove();
        $(this.stage.propertySheet.parent).append(`
        <div id="${this.stage.propertySheet.containerId}" class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div id="${this.stage.propertySheet.propTableContentId}Navigation" style="padding: 10px; background: #fdfdfd; border-radius: 3px; margin: 5px 0px; border: 1px solid #f0f0f0;">
            <strong>{{${columnnCaption}}}</strong> - ${this.stage.propertySheet.sheets.map(s => {
                return `<a href="#${s.name}" class="btn btn-default"><span class="${s.icon}"></span> ${s.title}</a>`
            }).join(" ")}
            </div>
            <div id="${this.stage.propertySheet.propTableContentId}">
            </div>
        </div>
        `);

        let propColumnBuildObj;

        $(`#${this.stage.propertySheet.propTableContentId}`).html(`
        ${this.stage.propertySheet.sheets.map(s => {
            return `
            <div id="${s.name}">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title"><span class="${s.icon}"></span> ${columnnCaption} - ${s.title}</h3>
                    </div>
                    <div class="panel-body">
                        <p>
                            ${
                ((propColumnBuildObj = this.stage.propertySheet.sheets.filter((opt) => opt.type == s.type && opt.propertyIs == "column")) && propColumnBuildObj.length > 0 && setTimeout(function () {s.sheetInit(s);}, 0)) && //{
                                    //$(`#${this.stage.propertySheet.propTableContentId}`).html(
                                    `
                                    <div id="${propColumnBuildObj[0].name}" class='bordered row' data-parent="addedPsWrapper" data-title="Add Property Sheet" data-prop-column="${this.propColumn}" data-prop-sheet="${this.propSheet}" style="min-width: 350px;">
                                        ${propColumnBuildObj[0].sheetMap.map((sheet) => {
                                        return `
                                            <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4" data-group='general'>
                                            ${
                                            sheet.type != "table"
                                            ?
                                            `
                                            <div class="form-group ${sheet.type == "checkbox" || sheet.type == "expression" || sheet.type == "fontpicker" || sheet.type == "colorpicker" ? `rowx` : ``}">
                                                <div ${sheet.type == "checkbox" || sheet.type == "expression" || sheet.type == "fontpicker" || sheet.type == "colorpicker" ? `class="col-form-label fw-boldest"` : ``}>${sheet.caption}${sheet.mandatory ? `<sup>*</sup>` : ``}</div>
                                                <div>
                                                    ${this._generatePropertyInput(sheet, this.propColumn, propColumnBuildObj[0])}
                                                </div>
                                            </div>
                                            `
                                            :
                                            `
                                            <div class="form-group">
                                                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                                    ${this._generatePropertyInput(sheet, this.propColumn, propColumnBuildObj[0])}
                                                </div>
                                            </div>
                                            `
                                            }
                                            </div>
                                            `;
                                    }).join("")}
                                    </div>
                                    `
                                    //);
                        
                                    //propColumnBuildObj[0].sheetInit();
                                // }
                            }
                        </p>
                    </div>
                </div>
            </div>
            `;
        }).join(" ")}
        `).css(this._getPropSheetAsNavDivCss());
        // this.stage.propertySheet.sheets.forEach(s => { 
        //     propColumnBuildObj = this.stage.propertySheet.sheets.filter((opt) => opt.type == s.type && opt.propertyIs == "column");
        //     propColumnBuildObj && propColumnBuildObj.length > 0 && propColumnBuildObj[0].sheetInit();
        // });
    }
    _getPropSheetAsNavDivCss() {
        var tableHeight = 0;
        try {
            $(`${this.stage.table.stageWrapper}`).length ? tableHeight = $(`${this.stage.table.stageWrapper}`).outerHeight(true) : "";
        } catch (ex) { }

        var propNavigationHeight = 0;
        try {
            $(`#${this.stage.propertySheet.propTableContentId}Navigation`).length ? propNavigationHeight = $(`#${this.stage.propertySheet.propTableContentId}Navigation`).outerHeight(true) : "";
        } catch (ex) { }

        return { height: `calc(100vh - ${tableHeight + propNavigationHeight}px)`, overflow: `auto` };
    }
    _initPropSheetAsPopUp() {
        // $(this.body).addClass("isPropPopUp");
        $(this.stage.propertySheet.parent).append(`
        <div id="${this.stage.propertySheet.containerId}" style="display: block;">
            <div class='col s3 card hoverable scale-transition scale-out' id='propertySheet'>
                <div class='hpbHeaderTitle'>
                    <span class='icon-paint-roller'></span>
                    <span class='title'>Property Sheet</span>
                    <button title='Close' type='button' id='propertySrchCls' onclick='${this.stage.propertySheet.call[this.stage.propertySheet.type].close}' class='btn-flat waves-effect btn-floating pull-right'><i class='icon-arrows-remove'></i></button>
                    <button title='Save' type='button' onclick='${this.stage.propertySheet.call[this.stage.propertySheet.type].save}' id='updateWidget' class='btn-flat waves-effect btn-floating pull-right '><span class='icon-arrows-check'></span></button>
                    <div class='clear'></div>
                </div>
                <div id='propertySheetDataWrapper'>
                    <div class='clear'></div>
                    <div id='propertySearch'>
                        <input placeholder='Search...' type='text' id='propertySearchFld' class='normalFld searchFld'>
                        <span class='srchIcn icon-magnifier'></span>
                    </div>
                    <div class='posr' id='${this.stage.propertySheet.propTableContentId}'>
                        <!--My Name is Prashik-->
                    </div>
                </div>
            </div>
        </div>
        `);
    }
    _generatePropertySheet() {

        let propMainTitle = "";

        try {
            propMainTitle = this.stage.propertySheet.sheets.filter((opt) => opt.type == this.propSheet)[0].title;
        } catch (ex) { }

        if (!propMainTitle) {
            propMainTitle = this.propSheet;
        }

        let columnnCaption = "";

        if (this.propColumn) {
            try {
                columnnCaption = this.columns.HeaderText.filter((f, i) => { if (this.columns.FieldName[i] == this.propColumn) { return true } })[0];
            } catch (ex) { }

            if (!columnnCaption) {
                columnnCaption = this.propColumn;
            }
        }

        $("#Wrapperpropsheet #propertySheet .hpbHeaderTitle span.title").text(`${propMainTitle}${this.propColumn ? ` - ${columnnCaption}` : ``}`);


        let propColumnBuildObj = this.stage.propertySheet.sheets.filter((opt) => opt.type == this.propSheet && opt.propertyIs == "column");

        if (propColumnBuildObj && propColumnBuildObj.length > 0) {
            $(`#${this.stage.propertySheet.propTableContentId}`).html(`
            <table id="${propColumnBuildObj[0].name}" class='bordered' data-parent="addedPsWrapper" data-title="Add Property Sheet" data-prop-column="${this.propColumn}" data-prop-sheet="${this.propSheet}" style="min-width: 350px;">
                ${propColumnBuildObj[0].sheetMap.map((sheet) => {
                return `
                    <tr data-group='general'>
                    ${
                    sheet.type != "table"
                    ?
                    `
                        <td>${sheet.caption}${sheet.mandatory ? `<sup>*</sup>` : ``}</td>
                        <td>
                            ${this._generatePropertyInput(sheet, this.propColumn, propColumnBuildObj[0])}
                        </td>
                    `
                    :
                    `
                        <td colspan="2">
                            ${this._generatePropertyInput(sheet, this.propColumn, propColumnBuildObj[0])}
                        </td>
                    `
                    }
                    </tr>
                    `;
            }).join("")}
            </table>
            `);

            propColumnBuildObj[0].sheetInit();
        }

        this.stage.propertySheet.allSheetInit();
        
    }
    _generatePropertyInput(sheet, propColumn, propColumnBuildObj) {
        //text/number/checkbox/dropdown/expression/fontpicker/colorpicker/fieldmapper/addformat/deleteformat/deletehyperlink

        // debugger;

        let val = typeof sheet.value == "function" ? sheet.value(sheet, propColumn, propColumnBuildObj) : sheet.value;

        typeof val == "undefined" ? val = `` : ``;

        switch (sheet.type) {
            case "text":
            default:
                // let val = "";
                // debugger;
                return `<input id='${sheet.name}' class='form-control' type='text' ${sheet.disabled ? ` disabled='disabled' ` : ``} value="${val}" />`;
            case "number":
                return `<input id='${sheet.name}' class='form-control' type='number' ${sheet.disabled ? ` disabled='disabled' ` : ``} value="${val}" />`;
            case "checkbox":
                return `
                <div class="switch ${this.stage.propertySheet.type != "popup" ? `form-control` : ``}" onclick="return true;toggleCompressedMode('s');" ${this.stage.propertySheet.type != "popup" ? `style="float: none; padding: 0px 8px; position: relative; top: 5px; border: 1px solid transparent; box-shadow: none;"` : ``}>
                    <a href="javascript:void(0)" class="swtchDummyAnchr">
                        <input class="tgl tgl-ios" name="opt${sheet.name}" id="${sheet.name}" type="checkbox" ${val.toString().toLowerCase() == "true" ? ` checked="checked" ` : ``} />
                        <label class="tgl-btn togglecustom toggle_btn" for="${sheet.name}" id="lbl${sheet.name}"></label>
                    </a>
                </div>
                `;
            case "dropdown":
                let processingDropdownOptions;
                (typeof sheet.dropdownOptions == "function") ? (processingDropdownOptions = [...sheet.dropdownOptions(sheet, propColumn, propColumnBuildObj)]) : (processingDropdownOptions = [...sheet.dropdownOptions]);

                // if (!sheet.mandatory) {
                //     processingDropdownOptions = [{ value: "", caption: new IviewBuilder().lcm[441] }, ...processingDropdownOptions];
                // }
                            /*events:
                            [
                                {
                                    eventAttribute: "onchange",
                                    eventFunction: "new PropertySheet()._getHyperlinkInfo($(this).val(), '', '#colHyperlinkStructure')"
                                }
                            ],*/
                return `
                <select class="form-control ${sheet.class ? sheet.class : ``}" id="${sheet.name}" ${sheet.mandatory ? ` data-mandatory="true" ` : ` data-mandatory="false" `} ${
                    sheet.events && sheet.events.length > 0
                    ?
                    sheet.events.map(e => { 
                        return `${e.eventAttribute}="${typeof e.eventFunction == "function" ? e.eventFunction(sheet, propColumn, propColumnBuildObj) : e.eventFunction}"`;
                    }).join(" ")
                    :
                    ``
                } >
                    ${
                        this._generateSelectOptions(processingDropdownOptions, sheet.mandatory, val)
                    }
                </select>
                `;
            case "expression":
                // border: 0px solid transparent;
                // box-shadow: none;
                // padding-left: 3px;
                let { expressionBuilder } = this.stage;
                return `
                <div class="${this.stage.propertySheet.type != "popup" ? `form-control` : ``}" style="${this.stage.propertySheet.type == "popup" ? `float: right;` : `border: 1px solid transparent; box-shadow: none; padding-left: 3px;`}">
                    <a href="#" class="btn btn-default ${expressionBuilder.icon}" aria-label="Right Align" title="${expressionBuilder.title}" data-toggle="tooltip" data-expression-builder-type="${sheet.expressionBuilderType}" data-value="${val}" onclick="${expressionBuilder.call.generate}">
                    </a>
                </div>
                `;
            case "fontpicker":
                let { fontPicker } = this.stage;
                return `
                <div class="${this.stage.propertySheet.type != "popup" ? `form-control` : ``}" style="${this.stage.propertySheet.type == "popup" ? `float: right;` : `border: 1px solid transparent; box-shadow: none; padding-left: 3px;`}">
                    <a href="#" class="btn btn-default ${fontPicker.icon}" aria-label="Right Align" title="${fontPicker.title}" data-toggle="tooltip" data-font-picker-type="${sheet.fontPickerType}" data-value="${val}" onclick="${fontPicker.call.generate}">
                    </a>
                </div>
                `;
            case "colorpicker":
                let { colorPicker } = this.stage;
                let colorValue = "";
                // colorValue = "#01579b";

                colorValue = this._parseHexAndDelphiColors(val, true);

                return `
                <div class="" style="${this.stage.propertySheet.type == "popup" ? `float: right;` : ``}">
                    <!--<a href="#" class="btn btn-default ${colorPicker.icon}" aria-label="Right Align" title="${colorPicker.title}" data-toggle="tooltip" data-id="${sheet.name}" data-font-picker-type="${sheet.colorPickerType}" onclick="${colorPicker.call.toggle}">
                    </a>
                    <div class="hide">-->
                        <input type="text" id="${sheet.name}" class="${colorPicker.containerClass} 
                        ${this.stage.propertySheet.type != "popup" ? `form-control` : ``}" value="${colorValue}" style="cursor: pointer;" ${
                            sheet.events && sheet.events.length > 0
                            ?
                            sheet.events.map(e => { 
                                return `${e.eventAttribute}="${typeof e.eventFunction == "function" ? e.eventFunction(sheet, propColumn, propColumnBuildObj) : e.eventFunction}"`;
                            }).join(" ")
                            :
                            ``
                        } />
                    <!--</div>-->
                </div>
                `;
            case "fieldmapper":
                return ``;
            case "addformat":
                return ``;
            case "deleteformat":
                return ``;
            case "deletehyperlink":
                return ``;
            case "table":
                return `
                <table id="${sheet.name}" class="table" width="100%">
                    <thead>
                        <tr>
                            <td colspan="${(sheet.hasCheckbox ? 1 : 0) + sheet.columns.length}">
                            <b>${sheet.caption}</b>
                            ${
                            sheet.buttons && sheet.buttons.length
                            ?
                            `<div style="float:right;">
                                <div class="btn-group" role="group" aria-label="...">
                                    ${
                                    sheet.buttons.map((b) => {
                                        return `<a class="btn btn-default ${b.icon}" title="${b.caption}" style="${b.style}" onclick="${b.function}" data-table="${sheet.name}" data-prop-sheet="${propColumnBuildObj.type}"></a>`;
                                    }).join("")
                                    }
                                </div>
                            </div>`
                            :
                            ``
                            }
                            </td>
                        </tr>
                        <tr>
                        ${
                            sheet.hasCheckbox
                            ?
                            `
                            <td align="center">
                                <input class="hide" type="checkbox" />
                            </td>
                            `
                            :
                            ``
                            }
                            ${
                            sheet.columns.map(s => {
                                return `
                                    <td>
                                        <b>${s.caption}</b>
                                    </td>
                                    `
                            }).join("")
                            }
                        </tr>
                    </thead>
                    <tbody>
                    ${typeof sheet.valueHTML == "function"
                    ?
                    sheet.valueHTML(sheet, propColumn, propColumnBuildObj)
                    :
                    ``
                    }
                    </tbody>
                </table>
                `;
            /*
            name: "colHyperlinkParamFieldMap",
                            caption: "Param/Field Map",
                            type: "table",
                            columns: [
                                {
                                    name: "colHypParFldName",
                                    type: "dropdown",
                                    dropdownOptions: [
                                        { value: "True", caption: "n1" },
                                        { value: "False", caption: "n2" }
                                    ],
                                },
                                {
                                    name: "colHypParFldValue",
                                    type: "dropdown",
                                    dropdownOptions: [
                                        { value: "True", caption: "v1" },
                                        { value: "False", caption: "v2" }
                                    ],
                                }
                            ]
            */
        }
    }
    _clearPropertyInput(sheet, propColumn, propColumnBuildObj) {
        //text/number/checkbox/dropdown/expression/fontpicker/colorpicker/fieldmapper/addformat/deleteformat/deletehyperlink

        // let val = typeof sheet.value == "function" ? sheet.value(sheet, propColumn, propColumnBuildObj) : sheet.value;

        // typeof val == "undefined" ? val = `` : ``;
        // debugger;
        switch (sheet.type) {
            case "text":
            default:
                $(`#${sheet.name}`).val(``);
                break;
            case "number":
                $(`#${sheet.name}`).val(``);
                break;
            case "checkbox":
                $(`#${sheet.name}`).prop(`checked`, sheet.defaultValue || false);
                break;
            case "dropdown":
                let selectedValue = "";
                let selectedOption =  typeof sheet.dropdownOptions == "object" && sheet.dropdownOptions.filter(d => d.selected)[0] || "";
                selectedValue = selectedOption.value || "";
                $(`#${sheet.name}`).val(selectedValue);
                break;
            case "expression":
                $(`#${sheet.name}`).val(``);
                break;
            case "fontpicker":
                $(`#${sheet.name}`).val(``);
                break;
            case "colorpicker":
                break;
            case "fieldmapper":
                break;
            case "addformat":
                break;
            case "deleteformat":
                break;
            case "deletehyperlink":
                break;
            case "table":
                $(`#${sheet.name}`).find("tbody tr").remove();
                break;
        }
    }
    generateFontPicker(elem) {
        let _this = this;
        let { fontPicker } = this.stage;

        let previousValue = ``;
        // previousValue = `[Comic Sans MS,24,clNavy,,True,True,True,False]`;

        previousValue = elem.data("value");

        previousValue = previousValue.replace(/~/g, "");

        let previosValueArray = [];
        if (elem.data("fontPickerType") == "properties") {
            previousValue.split(",").length == 8 ? (previosValueArray = previousValue.slice(1, previousValue.length - 1).split(",")) : "";

            _this.fontPickerObj = {
                fontFamily: previosValueArray[0] || fontPicker[fontPicker.objects.fontFamily][0].value,
                fontSize: previosValueArray[1] || fontPicker[fontPicker.objects.fontSize][1].value,
                fontColor: previosValueArray[2] || fontPicker[fontPicker.objects.fontColor][0].value,
                unknown: previosValueArray[3] || "",
                Bold: previosValueArray[4] || fontPicker[fontPicker.objects.fontEffects][0].selectedValue.unchecked,
                Italic: previosValueArray[5] || fontPicker[fontPicker.objects.fontEffects][1].selectedValue.unchecked,
                Underline: previosValueArray[6] || fontPicker[fontPicker.objects.fontEffects][2].selectedValue.unchecked,
                Strikeout: previosValueArray[7] || fontPicker[fontPicker.objects.fontEffects][3].selectedValue.unchecked,
            };
        } else {
            previousValue.split(",").length == 7 ? (previosValueArray = previousValue.split(",")) : "";

            _this.fontPickerObj = {
                fontFamily: previosValueArray[0] || fontPicker[fontPicker.objects.fontFamily][0].value,
                fontSize: previosValueArray[6] || fontPicker[fontPicker.objects.fontSize][1].value,
                fontColor: previosValueArray[4] || fontPicker[fontPicker.objects.fontColor][0].value,
                unknown: previosValueArray[7] || "",
                Bold: previosValueArray[1] || fontPicker[fontPicker.objects.fontEffects][0].selectedValue.unchecked,
                Italic: previosValueArray[2] || fontPicker[fontPicker.objects.fontEffects][1].selectedValue.unchecked,
                Underline: previosValueArray[3] || fontPicker[fontPicker.objects.fontEffects][2].selectedValue.unchecked,
                Strikeout: previosValueArray[5] || fontPicker[fontPicker.objects.fontEffects][3].selectedValue.unchecked,
            };
        }

        


        let fontPickerHTML = `
        <div class="bodyAndFooter-cont">
            <div class="body-cont" data-pillindex="XXXXXXXXXXXXX">
                <div id="${fontPicker.containerId}" class="">
                    <div class="row rowNoMargin fontPickerSeperation">
                        <select class="col-md-6 col-sm-6 col-xs-6 windowsUI" data-font-picker="${fontPicker.objects.fontFamily}" onchange="${fontPicker.call.generatePreview}">
                            ${
                                //{ value: "Arial", caption: "Arial", cssProp: "font-family", cssValue: "Arial,Helvetica,sans-serif" },
                                fontPicker[fontPicker.objects.fontFamily].map(ff => {
                                    return `
                                        <option value="${ff.value}" style="${ff.cssProp}:${ff.cssValue};" ${_this.fontPickerObj[fontPicker.objects.fontFamily] == ff.value ? `selected="selected"` : ``}>${ff.caption}</option>
                                    `;
                                }).join("")
                            }
                        </select>
                        <select class="col-md-3 col-sm-3 col-xs-3 windowsUI" data-font-picker="${fontPicker.objects.fontSize}" onchange="${fontPicker.call.generatePreview}">
                            ${
                                //{ value: "8", caption: "8pt", cssProp: "font-size", cssValue: "11px" },
                                fontPicker[fontPicker.objects.fontSize].map(fs => {
                                    return `
                                        <option value="${fs.value}" data-style="${fs.cssProp}:${fs.cssValue};" ${_this.fontPickerObj[fontPicker.objects.fontSize] == fs.value ? `selected="selected"` : ``}>${fs.caption}</option>
                                    `;
                                }).join("")
                            }
                        </select>
                        <select class="col-md-3 col-sm-3 col-xs-3 windowsUI" data-font-picker="${fontPicker.objects.fontColor}" onchange="${fontPicker.call.generatePreview}">
                            ${
                                //{ value: "clBlack", caption: "Black", cssProp: "color", cssValue: this.AxClColors["clBlack"] },
                                fontPicker[fontPicker.objects.fontColor].map(fc => {
                                    return `
                                        <option value="${fc.value}" data-style="${fc.cssProp}:${fc.cssValue};" ${_this.fontPickerObj[fontPicker.objects.fontColor] == fc.value ? `selected="selected"` : ``}>${fc.caption}</option>
                                    `;
                                }).join("")
                            }
                        </select>
                    </div>
                    
                    <div id="fontEffectsDiv" class="row rowNoMargin windowsUI fontEffectsDiv fontPickerSeperation">
                        ${
                            //{ caption: "Bold", cssProp: "font-weight", cssValue: "bold", selectedValue: { checked: "True", unchecked: "False" } },
                            fontPicker[fontPicker.objects.fontEffects].map(fe => {
                                
                                return `
                                    <div class="fontEffectsDivSingle col-md-3 col-sm-3 col-xs-3 rowNoMargin">
                                        <div class="switch" onclick="return true;">
                                            <a href="javascript:void(0)" class="swtchDummyAnchr">
                                                <input class="tgl tgl-ios" name="fe${fe.caption}" id="fe${fe.caption}" type="checkbox"  data-font-picker="${fe.caption}" data-font-picker-parent="${fontPicker.objects.fontEffects}" onchange="${fontPicker.call.generatePreview}"  ${_this.fontPickerObj[fe.caption] == fe.selectedValue.checked ? `checked="checked"` : ``}>
                                                <label class="tgl-btn togglecustom toggle_btn" for="fe${fe.caption}" id="lbl${fe.caption}"></label>
                                            </a>
                                        </div>
                                        <label for="fe${fe.caption}">${fe.caption}</label>
                                        <!--<input id="fe${fe.caption}" type="checkbox" name="fe${fe.caption}" value="${fe.cssValue}" />
                                        <label for="fe${fe.caption}">${fe.caption}</label>-->
                                    </div>
                                `;
                            }).join("")
                        }
                    </div>
                    <!--<div class="row rowNoMargin fontPickerSeperation">-->
                        <!--<div class="col-md-2 col-sm-2 col-xs-2 windowsUI fontColorDiv">-->
                            <!--Color-->
                        <!--</div>-->
                        
                        <!--<select class="col-md-5 col-sm-5 col-xs-5 windowsUI">
                            <option value="Western">Western</option>
                        </select>-->
                    <!--</div>-->
                    <fieldset class="fontPickerSample col-md-12 col-sm-12 col-xs-12" style="border-radius: 4px;
                    border: 1px solid #cecece;">
                        <legend class="fontPickerSampleLegend windowsUI">Sample</legend>
                        <div id="${fontPicker.fontPickerSampleId}" class="${fontPicker.fontPickerSampleId}">Axpert Web</div>
                    </fieldset>
                </div>
            </div>
            <div class="footer-cont">
                <div class="pull-right" id="filterBtn">
                    <!--<input type="button" name="btnFilterApply" value="Cancel" onclick="" id="btnFilterApply" title="Cancel}" class="normalbtn btn handCursor allow-enter-key"/>-->
                    <input type="button" name="btnFilter" value="Ok" data-font-picker-type="${elem.data("fontPickerType")}" onclick="${fontPicker.call.save}" id="btnFilter" title="Ok" class="hotbtn btn handCursor allow-enter-key" />
                </div>
            </div>
        </div>
        `;

        new PropertySheet().close();
        new IviewBuilder().displayBootstrapModalDialog(fontPicker.modalTitle, "md", "330px", false, fontPickerHTML, "",
            function () {
                $(".bodyAndFooter-cont .body-cont").css({ "height": "calc(100% - 30px)" });
                
                $("input:checkbox, select", ".bodyAndFooter-cont .body-cont").trigger("change");

                // $(".modal-backdrop.in").css({"opacity": "0"});
            },
            function () { 
                _this.fontPickerObj = {};
                _this.unhide();
            }
        );
    }
    _generateFontPickerPreview(elem) {
        let _this = this;
        let { fontPicker } = this.stage;
        // debugger;
        switch (elem.data("fontPicker")) {
            case "fontFamily": {
                let _thisObj = fontPicker[elem.data("fontPicker")].filter((effect) => effect.value == elem.val())[0];

                // elem.css(_thisObj.cssProp, _thisObj.cssValue);

                $("#" + fontPicker.fontPickerSampleId).css(_thisObj.cssProp, _thisObj.cssValue);

                _this.fontPickerObj[elem.data("fontPicker")] = _thisObj.value;
            }
                break;
            case "fontSize": {
                let _thisObj = fontPicker[elem.data("fontPicker")].filter((effect) => effect.value == elem.val())[0];

                $("#" + fontPicker.fontPickerSampleId).css(_thisObj.cssProp, _thisObj.cssValue);

                _this.fontPickerObj[elem.data("fontPicker")] = _thisObj.value;
            }
                break;
            case "fontColor": {
                let _thisObj = fontPicker[elem.data("fontPicker")].filter((effect) => effect.value == elem.val())[0];

                $("#" + fontPicker.fontPickerSampleId).css(_thisObj.cssProp, _thisObj.cssValue);

                _this.fontPickerObj[elem.data("fontPicker")] = _thisObj.value;
            }
                break;
            case "unknown":
                break;
            case "Bold": {
                let _thisObj = fontPicker[elem.data("fontPickerParent")].filter((effect) => effect.caption == elem.data("fontPicker"))[0];
                
                $("#" + fontPicker.fontPickerSampleId).css(_thisObj.cssProp, (elem.prop("checked") ? _thisObj.cssValue : ""));
                
                _this.fontPickerObj[elem.data("fontPicker")] = _thisObj.selectedValue[elem.prop("checked") ? "checked" : "unchecked"];
            }
                break;
            case "Italic": {
                let _thisObj = fontPicker[elem.data("fontPickerParent")].filter((effect) => effect.caption == elem.data("fontPicker"))[0];

                $("#" + fontPicker.fontPickerSampleId).css(_thisObj.cssProp, (elem.prop("checked") ? _thisObj.cssValue : ""));

                _this.fontPickerObj[elem.data("fontPicker")] = _thisObj.selectedValue[elem.prop("checked") ? "checked" : "unchecked"];
            }
                break;
            case "Underline": {
                let _thisObj = fontPicker[elem.data("fontPickerParent")].filter((effect) => effect.caption == elem.data("fontPicker"))[0];

                let existingCssPropVal = $("#" + fontPicker.fontPickerSampleId).css(_thisObj.cssProp).split(" ").filter(prop => (prop == "line-through" || prop == " underline")).join(" ");

                let newCssPropVal = (elem.prop("checked") ? [...new Set([_thisObj.cssValue, ...existingCssPropVal.split(" ")])].join(" ") : existingCssPropVal.split(" ").filter(prop => prop != _thisObj.cssValue).join(" "));

                $("#" + fontPicker.fontPickerSampleId).css(_thisObj.cssProp, newCssPropVal);

                _this.fontPickerObj[elem.data("fontPicker")] = _thisObj.selectedValue[elem.prop("checked") ? "checked" : "unchecked"];
            }
                break;
            case "Strikeout": {
                let _thisObj = fontPicker[elem.data("fontPickerParent")].filter((effect) => effect.caption == elem.data("fontPicker"))[0];

                let existingCssPropVal = $("#" + fontPicker.fontPickerSampleId).css(_thisObj.cssProp).split(" ").filter(prop => (prop == "line-through" || prop == "underline")).join(" ");

                let newCssPropVal = (elem.prop("checked") ? [...new Set([_thisObj.cssValue, ...existingCssPropVal.split(" ")])].join(" ") : existingCssPropVal.split(" ").filter(prop => prop != _thisObj.cssValue).join(" "));

                $("#" + fontPicker.fontPickerSampleId).css(_thisObj.cssProp, newCssPropVal);

                _this.fontPickerObj[elem.data("fontPicker")] = _thisObj.selectedValue[elem.prop("checked") ? "checked" : "unchecked"];
            }
                break;
        }
    }
    saveFontPicker(elem) {
        let { fontPickerObj } = this;

        let finalValue = ``;
        
        if (elem.data("fontPickerType") == "properties") {
            finalValue = `[${fontPickerObj.fontFamily},${fontPickerObj.fontSize},${fontPickerObj.fontColor},${fontPickerObj.unknown},${fontPickerObj.Bold},${fontPickerObj.Italic},${fontPickerObj.Underline},${fontPickerObj.Strikeout}]`;
        } else {
            finalValue = `[${fontPickerObj.fontFamily},${fontPickerObj.Bold},${fontPickerObj.Italic},${fontPickerObj.Underline},${fontPickerObj.fontColor},${fontPickerObj.Strikeout},${fontPickerObj.fontSize}]`;
        }

        // alert(finalValue);
        new IviewBuilder().showAlertDialog("info", finalValue);

        this.fontPickerObj = {};
        new IviewBuilder().closeModalDialog();
    }
    // closeFontPicker(elem) {
    //     new IviewBuilder().closeModalDialog();
    // }
    generateExpressionBuilder(elem) {
        let _this = this;
        let { expressionBuilder } = this.stage;

        let previousValue = ``;
        // previousValue = `[Comic Sans MS,24,clNavy,,True,True,True,False]`;

        let expressionBuilderHTML = `
        <div class="bodyAndFooter-cont">
            <div class="body-cont" data-pillindex="XXXXXXXXXXXXX">
                <div class="">
                    <textarea id="${expressionBuilder.containerId}" class="hide">${previousValue}</textarea>
                </div>
            </div>
            <div class="footer-cont">
                <div class="pull-right" id="filterBtn">
                    <!--<input type="button" name="btnFilterApply" value="Cancel" onclick="" id="btnFilterApply" title="Cancel}" class="normalbtn btn handCursor allow-enter-key"/>-->
                    <input type="button" name="btnFilter" value="Ok" data-expression-builder-type="${elem.data("expressionBuilderType")}" onclick="${expressionBuilder.call.save}" id="btnFilter" title="Ok" class="hotbtn btn handCursor allow-enter-key" />
                </div>
            </div>
        </div>
        `;

        new PropertySheet().close();
        new IviewBuilder().displayBootstrapModalDialog(expressionBuilder.modalTitle, "md", "330px", false, expressionBuilderHTML, "",
            function () {
                $(".bodyAndFooter-cont .body-cont").css({ "height": "calc(100% - 30px)" });
                
                $("input:checkbox, select", ".bodyAndFooter-cont .body-cont").trigger("change");
                
                new IviewBuilder().createTheEditor({ type: "expression", textarea: expressionBuilder.containerId });
                // $("#" + expressionBuilder.containerId).data("myeditor").setValue(previousValue);
                // $(".modal-backdrop.in").css({"opacity": "0"});
            },
            function () { 
                // _this.fontPickerObj = {};
                _this.unhide();
            }
        );
    }
    saveExpressionBuilder(elem) { 
        let { expressionBuilder } = this.stage;

        let finalValue = ``;
        
        finalValue = $("#" + expressionBuilder.containerId).data("myeditor").getValue();

        if(finalValue){
            new IviewBuilder().showAlertDialog("info", finalValue);
        }

        new IviewBuilder().closeModalDialog();
    }
    // toggleColorPicker(elem) {
    //     setTimeout(function () { $(`#${elem.data("id")}`).spectrum("toggle"); }, 0);
    //     return false;
    // }
    _parseHexAndDelphiColors(color = "", delphitoHex = false) {
        let _this = this;
        if (delphitoHex) {
            if (!color) {
                color = "$00FFFFFF"
            }
            color = color.replace(/~/g, "");
            if (_this.stage.AxClColors[color]) {
                return _this.stage.AxClColors[color];
            } else if (color.indexOf("$") == 0 && color.length == 9) {
                return "#" + [color[7], color[8], color[5], color[6], color[3], color[4]].join("").toUpperCase();
            } else {
                return color;
            }
        } else {
            if (!color) {
                color = "#FFFFFF"
            }
            if (color.indexOf("#") == 0 && color.length == 7) {
                return "$" + ["0", "0", color[5], color[6], color[3], color[4], color[1], color[2]].join("").toUpperCase();
            } else {
                return color;
            }
        }
        
    }
    _getPropertyInputValues(sheet, propColumn, propColumnBuildObj) {
        // 
        // debugger;
        switch (propColumnBuildObj.type) {
            case "properties":
                let column = new IviewBuilder().columns.raw.filter(c => c["a2"] == propColumn);

                if (column && column.length > 0) {
                    return typeof sheet.map == "function" ? (sheet.map(column[0]) || "")  : column[0][sheet.map];
                } else {
                    return ``;
                }
                break;
            case "hyperlink":
                // debugger;
                let hyperlink = _.map(new IviewBuilder().hyperlinks, (h, k) => h["@source"] == propColumn ? k : "").filter((v) => v)[0];

                if (hyperlink) {
                    if (sheet.map) {
                        return typeof sheet.map == "function" ? (sheet.map(hyperlink) || "") : new IviewBuilder().hyperlinks[hyperlink][sheet.map];
                    } else {
                        return hyperlink;
                    }
                } else {
                    return ``;
                }
                break;
                break;
            case "condFormat":
                break;
        }
        

        switch (sheet.type) {
            case "text":
                return ``;
            default:
                return ``;
            case "number":
                return ``;
            case "checkbox":
                return `
                `;
            case "dropdown":
                return `
                `;
            case "expression":
                let { expressionBuilder } = this.stage;
                return `
                `;
            case "fontpicker":
                let { fontPicker } = this.stage;
                return `
                `;
            case "colorpicker":
                let { colorPicker } = this.stage;
                let colorValue = "";
                return `
                `;
            case "fieldmapper":
                return ``;
            case "addformat":
                return ``;
            case "deleteformat":
                return ``;
            case "deletehyperlink":
                return ``;
        }
    }
    _generateSelectOptions(obj, mandatory, val) {
        if (!mandatory) {
            obj = [{ value: "", caption: new IviewBuilder().lcm[441] }, ...obj];
        }
        return obj.map((option) => {
            return `
            <option value="${option.value}" ${val == option.value ? ` selected="selected" ` : ``}>${option.caption || option.value}</option>
            `;
        }).join("");
    }
    _getHyperlinkInfo(type, ivTstName, dependentField = "") {
        let _this = this;

        if (!type) {
            $(`${dependentField}`).html(_this._generateSelectOptions(
                [], $(`${dependentField}`).data("mandatory"), ""
            )).trigger("change");
            return;
        } else {
            $(`${dependentField}`).html(_this._generateSelectOptions(
                _this._ajaxGetHyperlinkData(type, ivTstName)
                    // .map(r => {
                    //     return { value: r.name, caption: r.caption }
                    // })
                        , $(`${dependentField}`).data("mandatory"), ""
            )).trigger("change");
        }

        
    }
    _clearParamFieldMap(rows, selectedRows = "") {
        $(`${rows}`).remove();
    }
    _ajaxGetHyperlinkData(type, ivTstName = "") {
        let obj = [];
        new IviewBuilder().ShowDimmer(true);
        try {
            $.ajax({
                url: 'iviewBuilder.aspx/getHyperlinkInfo',
                type: 'POST',
                cache: false,
                async: false,
                data: JSON.stringify({ type, ivTstName }),
                dataType: 'json',
                contentType: "application/json",
                success: function (msg) {
                    // debugger;
                    if (msg.d == "SESSION_TIMEOUT") {
                        parent.window.location.href = "../aspx/sess.aspx";
                    }
                    else if (msg.d != "") {
                        let dataJSON = JSON.parse(msg.d);
                        if (typeof dataJSON.error != "undefined") {
                            // $('#txtOutput').text(dataJSON.error["msg"]);
                            // $('#txtOutput').show();
                            // $('#tblOutput').hide();
                            // $('#spnRowCnt').hide();
                        }
                        else {
                            if (typeof dataJSON["result"] == "object" && dataJSON.result.row) {
                                obj = dataJSON.result.row;
                                if (typeof obj.length == "undefined") {
                                    obj = [obj];
                                }
                            }
                            // if (typeof dataJSON["result"] != "object") {
                            //     $('#txtOutput').text(dataJSON.result);
                            //     $('#txtOutput').show();
                            //     $('#tblOutput').hide();
                            //     $('#spnRowCnt').hide()
                            // }
                            // else {
                            //     createDatatableFromJson(dataJSON, $('#tblOutput'));
                            //     $('#txtOutput').hide();
                            //     $('#tblOutput').show();
                            //     $('#spnRowCnt').show();
                            // }
                        }
                    }
                    new IviewBuilder().ShowDimmer(false);
                    return obj;
                },
                error: function (msg) {
                    new IviewBuilder().showAlertDialog("error", "Error while executing the query.");
                    new IviewBuilder().ShowDimmer(false);
                    return obj;
                }
            });
        }
        catch (exp) {
            new IviewBuilder().showAlertDialog("error", "Error while executing the query.");
            new IviewBuilder().ShowDimmer(false);
            return obj;
        }
        return obj;
    }
    _addTableFields(elem, returnHTML = false) {
        let _this = this;
        let table = $(`#${elem.data("table")}`);
        // let parentTable = table.parents("table");

        _this.propSheet = elem.data("propSheet");

        let propColumnBuildObj = _this.stage.propertySheet.sheets.filter((opt) => opt.type == _this.propSheet && opt.propertyIs == "column");
        if (propColumnBuildObj && propColumnBuildObj.length > 0) {
            let mapObject = propColumnBuildObj[0].sheetMap.filter(s => s.name == elem.data("table"))[0];
            // debugger;


            let createCondition = true;

            if(mapObject.parentDependent){
                createCondition = Object.keys(mapObject.parentDependent).map(d => {
                    if (returnHTML) {
                        let tempSheet = propColumnBuildObj[0].sheetMap.filter(s => s.name == mapObject.parentDependent[d].substr(1))[0];
                        return tempSheet.value(tempSheet, this.propColumn, propColumnBuildObj[0])
                    }else{
                        return $(`${mapObject.parentDependent[d]}`).val()
                    }
                }).reduce((f, d) => {
                    if (d) {
                        f++;
                    }
                    return f;
                }, 0) == Object.keys(mapObject.parentDependent).length;
            }

            if (createCondition) {
                let tempReturnHTML = `
                <tr>
                    ${
                    mapObject.hasCheckbox
                        ?
                        `
                    <td align="center">
                        <input type="checkbox" />
                    </td>
                    `
                        :
                        ``
                    }
                    ${
                    mapObject.columns.map(sheet => {
                        return `
                            <td>
                                ${_this._generatePropertyInput(sheet, _this.propColumn, propColumnBuildObj[0])}
                            </td>
                            `
                    }).join("")
                    }
                </tr>
                `;
                if (returnHTML) {
                    return tempReturnHTML;
                } else {
                    table.find("tbody").append(tempReturnHTML);   
                }
            } else if(mapObject.parentDependentError) {
                new IviewBuilder().showAlertDialog("error", mapObject.parentDependentError);
            }
        }
    }
    _deleteSelectedTableFields(elem) {
        let table = $(`#${elem.data("table")}`);
        let tbody = $("tbody", table);
        tbody.find($.map(tbody.find("input:checkbox"), ((elem, index) => { if ($(elem).is(":checked")) { return `tr:eq(${index})`; } else { return "" } })).filter((i) => i !== "").join(", ")).remove();
    }
    _clearTableFields(elem) {
        let _this = this;
        // let table = $(`#${elem.data("table")}`);
        // let parentTable = table.parents("table");

        let propColumnBuildObj = _this.stage.propertySheet.sheets.filter((opt) => opt.type == _this.propSheet && opt.propertyIs == "column");
        
        if (propColumnBuildObj && propColumnBuildObj.length > 0) {
            // debugger;
            
            propColumnBuildObj[0].sheetMap.forEach(sheet => { 
                _this._clearPropertyInput(sheet, _this.propColumn, propColumnBuildObj);
            });

            
            
        }

        
    }
    _addCondFormat(elem) {
        
    }
    _deleteCondFormat(elem) {
        
    }
    _showPropertySheet() {
        $("#Wrapperpropsheet").css("display", "block");
        $("#updateWidget").prop('title', 'Save');
        $("#propertySrchCls").prop('title', 'Cancel');
        // $("#propTableContent input").val("");
        // $("#propTableContent select").each(
        //     function () {
        //         if (!$(this).data("noClear")) {
        //             $(this).removeAttr('selected');
        //             $(this).find('option:first').prop('selected', true);
        //         }
        //     }
        // );
        // $("#fldWidth").val(10);
        // if ($("#seldataType").val() != "Numeric") {
        //     $(".decimalFld").addClass('notSearchable').hide()
        //     $("#fldDecimal").val(0);
        // }

        setTimeout(function () {
            $("#propertySheet").removeClass('scale-out').addClass('scale-in');
            $("#propertySheet").draggable({
                containment: "body"
            });
        }, 50);

        // $("#fldName").focus();
    }
    show(elem) {
        // _this = this;
        let tempPropSheet = elem.data("type");
        let tempPropColumn = elem.data("field");

        if (this.propSheet == tempPropSheet && this.propColumn == tempPropColumn) {
            // show existing propertysheet and return
            // return;

        } else {
            this.propSheet = tempPropSheet;

            this.propColumn = tempPropColumn;

        }
        this._generatePropertySheet();
        this._showPropertySheet();
        // debugger;
    }
    _update() {
        // _this = this;
    }
    save() {
        this._update();
        this.close();
    }
    close() {
        if ($("#propertySheet").hasClass('scale-out'))
            return true;

        // var target = $("#propertySheet").data('target');

        $("#propertySheet").data('target', "").removeClass('scale-in').addClass('scale-out');
    }
    unhide() {
        $("#propertySheet").addClass('scale-in').removeClass('scale-out');
    }
}
