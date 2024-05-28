/*let aspSaveJSON = {
    "properties": {
        "caption": "",
        // "addToMenu": true,
        "accessString": "default"
    },
    "params": "",
    // "iFrame": "sections.body.panel.middle",
    "files": {
        "css": [""],
        "js": [""]
    },
    "sections": {
        "header": {
            "visible": true,
            "dataSource": "header",
            "template": "{{content}}"
        },
        "body": {
            "panel": { //in future if top/middle/bottom panels are introduced then this section will become top panel
                "left": {
                    "visible": true,
                    "header": {
                        "visible": true,
                        "dataSource": "",
                        "template": "{{content}}"
                    },
                    "body": {
                        "visible": true,
                        "dataSource": "leftbody",
                        "template": "<div class=\"card border border-secondary w-100 my-2\">\n    <div class=\"card-body px-5\">\n        <h5 class=\"card-title d-flex flex-row\">\n            {{#is icon}}\n            <div class=\"symbol symbol-35px me-2 mainIcon\">\n                <div class=\"symbol-label\">\n                    <span class=\"material-icons material-icons-style\">\n                        {{icon}}\n                    </span>\n                </div>\n            </div>\n            {{/is}}\n            {{#is title}}\n            <span class=\"d-flex align-items-center\">\n                {{title}}\n            </span>\n            {{/is}}\n            {{#is axrowoptions}}\n            <div class=\"ms-auto\">\n                <button type=\"button\" class=\"btn btn-sm btn-icon btn-icon-primary btn-active-light-primary dropdown-toggle--- material-icons material-icons-style material-icons-4 p-5\"\n                    data-bs-toggle=\"dropdown\" aria-expanded=\"false\">\n                    more_vert\n                </button>\n                <ul class=\"dropdown-menu dropdown-menu-end\">\n                    {{#each (split axrowoptions '~')}}\n                    <li><a class=\"dropdown-item\" href=\"javascript:void(0);\" onclick=\"spObject.iFramePanelObj.div.querySelector('[contentholder] iframe').contentWindow.location.href = 'tstruct.aspx?transid={{split this ',' '2'}}&recordid={{split this ',' '3'}}';\">\n                        <i class=\"material-icons\" style=\"margin-right: 5px;\">{{split this ',' '4'}}</i>\n                        {{split this ',' '1'}}</a></li>\n                    {{/each}}\n                </ul>\n            </div>\n            {{/is}}\n        </h5>\n        {{#is content}}\n        <a href=\"javascript:void(0);\"\n            onclick=\"spObject.iFramePanelObj.div.querySelector('[contentholder] iframe').contentWindow.location.href = 'tstruct.aspx?transid={{transid}}&recordid={{recordid}}';\"\n            class=\"card-text mb-2\">\n            {{content}}\n        </a>\n        {{/is}}\n        {{#is footer}}\n        <p class=\"card-text border-top mt-1 pt-1\">\n            {{footer}}\n        </p>\n        {{/is}}\n    </div>\n</div>"
                    },
                    "footer": {
                        "visible": true,
                        "dataSource": "",
                        "template": "{{content}}"
                    }
                },
                "middle": {
                    "visible": true,
                    "dataSource": ""//,
                    // "template": ""
                },
                "right": {
                    "visible": true,
                    "header": {
                        "visible": true,
                        "dataSource": "",
                        "template": "{{content}}"
                    },
                    "body": {
                        "visible": true,
                        "dataSource": "",
                        "template": "<div class=\"card border border-secondary w-100 my-2\">\n    <div class=\"card-body px-5\">\n        <h5 class=\"card-title d-flex flex-row\">\n            {{#is icon}}\n            <div class=\"symbol symbol-35px me-2 mainIcon\">\n                <div class=\"symbol-label\">\n                    <span class=\"material-icons material-icons-style\">\n                        {{icon}}\n                    </span>\n                </div>\n            </div>\n            {{/is}}\n            {{#is title}}\n            <span class=\"d-flex align-items-center\">\n                {{title}}\n            </span>\n            {{/is}}\n            {{#is axrowoptions}}\n            <div class=\"ms-auto\">\n                <button type=\"button\" class=\"btn btn-sm btn-icon btn-icon-primary btn-active-light-primary dropdown-toggle--- material-icons material-icons-style material-icons-4 p-5\"\n                    data-bs-toggle=\"dropdown\" aria-expanded=\"false\">\n                    more_vert\n                </button>\n                <ul class=\"dropdown-menu dropdown-menu-end\">\n                    {{#each (split axrowoptions '~')}}\n                    <li><a class=\"dropdown-item\" href=\"javascript:void(0);\" onclick=\"spObject.iFramePanelObj.div.querySelector('[contentholder] iframe').contentWindow.location.href = 'tstruct.aspx?transid={{split this ',' '2'}}&recordid={{split this ',' '3'}}';\">\n                        <i class=\"material-icons\" style=\"margin-right: 5px;\">{{split this ',' '4'}}</i>\n                        {{split this ',' '1'}}</a></li>\n                    {{/each}}\n                </ul>\n            </div>\n            {{/is}}\n        </h5>\n        {{#is content}}\n        <a href=\"javascript:void(0);\"\n            onclick=\"spObject.iFramePanelObj.div.querySelector('[contentholder] iframe').contentWindow.location.href = 'tstruct.aspx?transid={{transid}}&recordid={{recordid}}';\"\n            class=\"card-text mb-2\">\n            {{content}}\n        </a>\n        {{/is}}\n        {{#is footer}}\n        <p class=\"card-text border-top mt-1 pt-1\">\n            {{footer}}\n        </p>\n        {{/is}}\n    </div>\n</div>"
                    },
                    "footer": {
                        "visible": true,
                        "dataSource": "",
                        "template": "{{content}}"
                    }
                }
            }
        },
        "footer": {
            "visible": true,
            "dataSource": "footer",
            "template": "{{content}}"
        }
    }
};*/

let spObject;

document.onreadystatechange = function () {
    if (document.readyState === "interactive") {
        var pageId = findGetParameter("pageid");
        
        try {
            $.ajax({
                url: 'standardPage.aspx/GetStandardPages',
                type: 'POST',
                cache: false,
                async: true,
                data: JSON.stringify({ name: pageId }),
                dataType: 'json',
                contentType: "application/json",
                success(data) {
                    let dataContent = data.d;

                    if(dataContent?.status == "success"){
                        dataContent = JSON.parse(dataContent?.result);

                        spObject = new initObject(JSON.parse(dataContent.result.row?.[0]?.spsavejson || "{}"));

                        spObject.setPageCaption();
                        spObject.setPanelVisibility();
                        spObject.getSetData();

                        spObject.injectCode();
                    }else{
                        showAlertDialog("error", dataContent.result);
                    }                  
                },
                error(err){

                }
            });
        } catch (ex) {
        }
    }
};

class initObject {
    constructor(aspSaveJSON) {
        this.properties = this.getSelector(aspSaveJSON, "properties")?.[0] || {};
        this.files = this.getSelector(aspSaveJSON, "files")?.[0] || {};
        this.caption = {
            div: document.getElementById("sp-caption"),
            content: this.getSelector(this.properties, "caption") || ""
        }
        this.params = this.getSelector(aspSaveJSON, "params")?.[0] || "";
        this.sections = this.getSelector(aspSaveJSON, "sections")?.[0] || {};

        this.headerPanelObj = {
            div: document.getElementById("sp-header"),
            obj: this.getSelector(this.sections, "header")?.[0] || {}
        };
        this.footerPanelObj = {
            div: document.getElementById("sp-footer"),
            obj: this.getSelector(this.sections, "footer")?.[0] || {}
        };
        this.bodyPanelObj = {
            div: document.getElementById("sp-body"),
            obj: this.getSelector(this.sections, "body")?.[0] || {}
        };

        this.leftPanelObj = {
            div: document.getElementById("sp-left"),
            obj: this.getSelector(this.bodyPanelObj.obj, "panel.left")?.[0] || {}
        };
        this.leftHeaderPanelObj = {
            div: document.getElementById("sp-leftHeader"),
            obj: this.getSelector(this.leftPanelObj.obj, "header")?.[0] || {}
        };
        this.leftBodyPanelObj = {
            div: document.getElementById("sp-leftBody"),
            obj: this.getSelector(this.leftPanelObj.obj, "body")?.[0] || {}
        };
        this.leftFooterPanelObj = {
            div: document.getElementById("sp-leftFooter"),
            obj: this.getSelector(this.leftPanelObj.obj, "footer")?.[0] || {}
        };

        this.rightPanelObj = {
            div: document.getElementById("sp-right"),
            obj: this.getSelector(this.bodyPanelObj.obj, "panel.right")?.[0] || {}
        };
        this.rightHeaderPanelObj = {
            div: document.getElementById("sp-rightHeader"),
            obj: this.getSelector(this.rightPanelObj.obj, "header")?.[0] || {}
        };
        this.rightBodyPanelObj = {
            div: document.getElementById("sp-rightBody"),
            obj: this.getSelector(this.rightPanelObj.obj, "body")?.[0] || {}
        };
        this.rightFooterPanelObj = {
            div: document.getElementById("sp-rightFooter"),
            obj: this.getSelector(this.rightPanelObj.obj, "footer")?.[0] || {}
        };

        this.iFramePanelObj = {
            div: document.getElementById("sp-iFrame"),
            obj: this.getSelector(this.bodyPanelObj.obj, "panel.middle")?.[0] || {}
        };
    }

    getSelector(from, ...selectors) {
        return [...selectors].map(selector =>
            selector
                .replace(/\[([^\[\]]*)\]/g, '.$1.')
                .split('.')
                .filter(t => t !== '')
                .reduce((prev, cur) => prev && prev[cur], from)
        )
    };

    setPageCaption(){
        if(this.caption.content){
            this.caption.div.innerHTML = this.caption.content;
        }
    }

    setPanelVisibility() {
        Object.keys(this)
            .filter(obj => typeof this?.[obj]?.obj?.visible != "undefined")
            .map(obj => this[obj])
            .forEach(obj => {
                !obj.obj.visible && obj.div.classList.add("d-none");
            });
    }

    getSetData() {
        let _this = this;

        ShowDimmer(true);

        const processingObj = Object.keys(this)
            .filter(obj => typeof this?.[obj]?.obj?.visible != "undefined")
            .map(obj => this[obj]);

        const panelWithoutSources = processingObj.filter(obj => typeof obj?.obj?.dataSource != "undefined" && !obj.obj.dataSource && obj.div.id != "sp-iFrame");
        panelWithoutSources.forEach(obj => {
            obj.div.classList.add("d-none");
        });

        const panelWithSources = processingObj.filter(obj => obj.obj.dataSource);

        AxAsyncGetSqlData(panelWithSources.map(obj => obj.obj.dataSource).join(), "",
            (succ) => {
                var resp = JSON.parse(succ);
                if (resp.error) {
                    const errorMessage = resp?.error?.error?.[0]?.msg;

                    if (errorMessage) {
                        showAlertDialog("error", errorMessage);
                    }
                }
                
                panelWithSources.forEach(panel => {
                    const thisResult = resp[panel.obj.dataSource];

                    let thisDiv = panel.div;
                    if (!thisDiv.hasAttribute("contentholder")) {
                        thisDiv = thisDiv.querySelectorAll("[contentholder]")?.[0]
                    }

                    if (!thisDiv || !thisResult) {
                        panel.div.classList.add("d-none");
                        return;
                    }

                    if ((thisResult?.data?.length || 0) > 0) {
                        switch (panel?.div?.id) {
                            case "sp-header":
                            case "sp-footer":
                            case "sp-leftHeader":
                            case "sp-leftFooter":
                            case "sp-rightHeader":
                            case "sp-rightFooter":
                                // {
                                //     const applyData = thisResult?.data?.[0]?.[0] || "";

                                //     if (applyData) {
                                //         thisDiv.textContent = applyData;
                                //     }else{
                                //         panel.div.classList.add("d-none");
                                //     }
                                // }
                                // break;
                            case "sp-leftBody":
                            case "sp-rightBody":
                                {
                                    const metaData = thisResult.sqlmetaData.reduce((array, { name }) => [...array, name.toLowerCase()], []);

                                    const applyData = thisResult.data.reduce((array, row) => {
                                        array.push(metaData.reduce((obj, data, index) => {
                                            obj[data] = row[index];
                                            return obj;
                                        }, {}));
                                        return array;
                                    }, []);
                                    if (applyData.length > 0) {
                                        try {
                                            applyData.forEach(data => {
                                                const compiledTemplate = Handlebars.compile(panel.obj?.template || "{{content}}")(data);
    
                                                if(compiledTemplate){
                                                    thisDiv.innerHTML += compiledTemplate;
                                                }else{
                                                    panel.div.classList.add("d-none");
                                                }
                                            });
                                        } catch (ex) {
                                            showAlertDialog("error", ex.message);
                                        }
                                    }else{
                                        panel.div.classList.add("d-none");
                                    }
                                }
                                break;
                            default:
                                panel.div.classList.add("d-none");
                                break;
                        }
                    }
                });

                _this.doExtras();

                ShowDimmer(false);
            },
            (err) => {
                let _this = this;
                _this.doExtras();

                ShowDimmer(false);
            }
        );
    }

    doExtras(){
        if([...this.leftPanelObj.div.querySelectorAll("[contentholder]")].filter(el => el.offsetParent !== null).length == 0){
            this.leftPanelObj.div.classList.add("d-none");
        }

        if([...this.rightPanelObj.div.querySelectorAll("[contentholder]")].filter(el => el.offsetParent !== null).length == 0){
            this.rightPanelObj.div.classList.add("d-none");
        }

        setTimeout(() => {
            [...document.querySelectorAll('a,button')]?.filter(link => !link.classList.contains("dropdown-item"))?.[0]?.click();
        }, 0);
    }

    injectCode(){
        this.loadStyles();
        this.loadScripts();
    }

    loadStyles(){
        (this.files?.css || []).forEach(css => {
            if(css){
                var style = document.createElement("style");

                var head = document.head || document.querySelectorAll("head")[0] || document.documentElement;

                // style.innerText = "body{background:red!important;}";
                style.innerText = css;

                head.insertBefore( style, head.firstChild );
            }
        });
    }

    loadScripts(){
        (this.files?.js || []).forEach(js => {
            if(js){
                var script = document.createElement("script");
                script.async = true;

                var head = document.head || document.querySelectorAll("head")[0] || document.documentElement;

                // script.innerText = "$(document).ready(()=>{alert();})";
                script.innerText = js;

                head.insertBefore( script, head.firstChild );
            }
        });
    }
}

function ShowDimmer(status) {

    DimmerCalled = true;
    var dv = $("#waitDiv");

    if (dv.length > 0 && dv != undefined) {
        if (status == true) {
            closeParentFrame();
            $("body").addClass("page-loading");
            document.onkeydown = function EatKeyPress() {
                return false;
            }
        } else {
            $("body").removeClass("page-loading");
            document.onkeydown = function EatKeyPress() {
                if (DimmerCalled == true) {
                    return true;
                }
            }
        }
    } else {

        //TODO:Needs to be tested
        if (window.opener != undefined) {

            dv = $("#waitDiv", window.opener.document);
            if (dv.length > 0) {
                if (status == true) {
                    $("body", window.opener.document).addClass("page-loading");
                } else {
                    $("body", window.opener.document).removeClass("page-loading");
                }
            }
        }
    }
    DimmerCalled = false;
}

function closeParentFrame() {
    try {
        eval(callParent('closeFrame()', 'function'));
    } catch (ex) {
        console.log("Error in CloseParentFrame -" + ex.message);
    }
}