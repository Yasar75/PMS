/**
 * Material HomePage and Cards
 * @author Prashik
 * @Date   2019-08-04T13:21:51+0530
 */
; (function ($, win) {
    //class axpertUI {
    $_this = this;
    function axpertUI() {
        options = {
            leftSideBar: {
                // scrollColor: 'rgba(255,255,255,0.7)',
                // scrollWidth: '4px',
                //scrollAlwaysVisible: false,
                // scrollAlwaysVisible: true,
                // scrollBorderRadius: '0',
                // scrollBorderRadius: '10px',
                // scrollRailBorderRadius: '0',
                // scrollRailBorderRadius: '10',
                // scrollActiveItemWhenPageLoad: true,
                // breakpointWidth: 1170,
                // enableExpandCollapse: true,
                menuConfiguration: {
                    menuJson: {},
                    listviewAsDefault: [],
                    alignment: "vertical",//just for info
                    staging: {
                        div: "",
                        divParent: ""
                    },
                    menuTemplete: {
                        menuUl: {
                            opener: `<div class="menu-sub menu-sub-accordion menu-active-bg">`,
                            closer: `</div>`
                        }, menuLi: {
                            opener: `<div data-kt-menu-trigger="click" class="menu-item menu-accordion">`,
                            closer: `</div>`,
                            anchorGenerator: function (childObj) {
                                let iconClass = "";
                                let iconText = "";

                                if (!childObj.icon) {
                                    return `
                                    <span class="menu-link" title="${childObj.name}">
                                        <span class="menu-icon">
                                            <span class="material-icons material-icons-style">
                                                folder
                                            </span>
                                        </span>
                                        <span class="menu-title">${childObj.name}</span>
                                        <span class="menu-arrow"></span>
                                    </span>`;
                                }
                                else {
                                    if (typeof childObj.icon == "object") {
                                        iconClass = childObj.icon.addClass;
                                        iconText = childObj.icon.text;
                                    }
                                    else if (childObj.icon.indexOf("/") != -1) {
                                        return `
                                        <span class="menu-link" title="${childObj.name}">
                                            <span class="menu-icon">
                                                <img src="${childObj.icon}" class="mw-25px mh-25px" />
                                            </span>
                                            <span class="menu-title">${childObj.name}</span>
                                            <span class="menu-arrow"></span>
                                         </span>`;
                                    }
                                    else {
                                        iconClass = childObj.icon.addClass;
                                        iconText = childObj.icon.text;
                                    }
                                    return `
                                    <span class="menu-link" title="${childObj.name}">
                                        <span class="menu-icon">
                                            <span class="${iconClass} ${iconClass.indexOf("material-icons") > -1 ? `material-icons-style` : ``}">
                                                ${iconText}
                                            </span>
                                        </span>
                                        <span class="menu-title">${childObj.name}</span>
                                        <span class="menu-arrow"></span>
                                    </span>`;
                                }
                            }
                        }, functionalLi: {
                            opener: `<div class="menu-item">`,
                            closer: `</div>`,
                            anchorGenerator: function (childObj, listviewAsDefault) {
                                let iconClass = "";
                                let iconText = "";
                                try {
                                    iconClass = AxCustomIcon(childObj)
                                }
                                catch (ex) { }

                                let isListView = false;

                                try {
                                    if(childObj.target && childObj.target.indexOf("tstruct.aspx") > -1){
                                        if(listviewAsDefault.length > 0){
                                            if(openListviewConf = listviewAsDefault.filter(list => list.structname == findGetParameter("transid", childObj.target))?.[0]){
                                            }else if(openListviewConf = listviewAsDefault.filter(list => list.structname == "ALL Forms")?.[0]){
                                            }

                                            if(openListviewConf?.propsval == "true"){
                                                childObj.target = `${childObj.target.replace("tstruct.aspx?transid=", "iview.aspx?ivname=")}&tstcaption=${(childObj.name || findGetParameter("transid", childObj.target))}`;

                                                isListView = true;
                                            }else{
                                                childObj.target += `&openerIV=${findGetParameter("transid", childObj.target)}&isIV=false`;
                                            }
                                        }else{
                                            childObj.target += `&openerIV=${findGetParameter("transid", childObj.target)}&isIV=false`;
                                        }
                                    }
                                } catch (ex) {}

                                if (iconClass === "") {
                                    if (!childObj.icon) {
                                        iconClass = "material-icons";
                                        if (childObj.target != undefined && childObj.target != "") {
                                            if (childObj.target.indexOf("tstruct.aspx") > -1) {
                                                iconText = "assignment";
                                            } else if (childObj.target.indexOf("iview.aspx") > -1 || childObj.target.indexOf("iviewInteractive.aspx") > -1) {
                                                if(!isListView){
                                                    iconText = "view_list";
                                                }else{
                                                    iconText = "format_list_bulleted";
                                                }
                                            }
                                            else {
                                                iconText = "insert_drive_file";
                                            }
                                        } 
                                        else if (childObj.target == "" && childObj.oname.indexOf("Head") > -1) {
                                            iconText = "folder";
                                        }
                                        else {
                                            iconText = "insert_drive_file";
                                        }
                                        return `
                                        <a class="menu-link" href="javascript:void(0);" title="${childObj.name}" ${childObj.target != "" ? `onclick="LoadIframe('${childObj.target}')"` : ""} >
                                            <span class="menu-icon">
                                                <span class="${iconClass} ${iconClass.indexOf("material-icons") > -1 ? `material-icons-style` : ``}">
                                                    ${iconText}
                                                </span>
                                            </span>
                                            <span class="menu-title">${childObj.name}</span>
                                        </a>`;
                                    } else {
                                        if (typeof childObj.icon == "object") {
                                            iconClass = childObj.icon.addClass;
                                            iconText = childObj.icon.text;
                                        }
                                        else if (childObj.icon.indexOf("/") != -1) {
                                            return `
                                            <a class="menu-link" href="javascript:void(0);" title="${childObj.name}" onclick="LoadIframe('${childObj.target}')">
                                                <span class="menu-icon">
                                                    <img src="${childObj.icon}" class="mw-25px mh-25px" />
                                                </span>
                                                <span class="menu-title">${childObj.name}</span>
                                            </a>`;
                                        }
                                        else {
                                            iconClass = "material-icons";
                                            iconText = childObj.icon;
                                        }
                                        return `
                                        <a class="menu-link" href="javascript:void(0);" title="${childObj.name}" onclick="LoadIframe('${childObj.target}')">
                                            <span class="menu-icon">
                                                <span class="${iconClass} ${iconClass.indexOf("material-icons") > -1 ? `material-icons-style` : ``}">
                                                    ${iconText}
                                                </span>
                                            </span>
                                            <span class="menu-title">${childObj.name}</span>
                                        </a>`;
                                    }
                                }
                                return `
                                <a class="menu-link" href="javascript:void(0);" title="${childObj.name}" onclick="LoadIframe('${childObj.target}')">
                                    <span class="menu-icon">
                                        <span class="material-icons material-icons-style">
                                            ${iconClass}
                                        </span>
                                    </span>
                                    <span class="menu-title">${childObj.name}</span>
                                </a>`;
                            }
                        }
                    },
                    homePage: {
                        url: "",
                        icon: "home"
                    }
                }
            },
            dropdownMenu: {
                effectIn: 'fadeIn',
                effectOut: 'fadeOut'
            },
            loader: {
                div: '.page-loader',
                subDiv: '.loader-box-wrapper',
                textDiv: '.page-loader-text',
                parent: '.page-loading',
                stayClass: 'stay-page-loading',
                inAnimationClass: 'animation animation-fade-in',
                outAnimationClass: 'animation animation-fade-out',
                radialGradientClass: 'bg-radial-gradient',
                loaderWrapClass: 'bg-white p-20 shadow rounded'
            },
            navBarDiv: 'nav.navbar',
            search: {
                staging: {
                    div: '#globalSearchinp',
                    divParent: '.search-bar'
                }
            },
            history: {
                staging: {
                    div: "#historyData .setting-list",
                    divParent: ""
                }
            },
            frameDiv: '.splitter-wrapper',
            dirLeft: true,
            axpertUserSettings: {},
            rightSideBar: {},
            cardsPage: {
                setCards: false,
                cards: [],
                totalColumns: 12,
                designChanged: false,
                design: [],
                enableMasonry: false,
                html: {
                    wrapper: `
                    <div class="widget-main">
                        <div class="container-fluid">
                            <div class="kpi-main">
                                <div class="row innerCardsPageWrapper">
                                </div>
                            </div>
                        </div>
                    </div>
                    `,
                    loader: `
                    <div class="demo-preloader">
                        <div class="preloader pl-size-sm">
                            <div class="spinner-layer">
                                <div class="circle-clipper left">
                                    <div class="circle"></div>
                                </div>
                                <div class="circle-clipper right">
                                    <div class="circle"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `,
                    kpi: `
                    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 mt-6 widgetWrapper kpiWrapper">
                        <div class="card shadow-sm h-100">
                            <!--begin::Card header-->
                            <div class="card-header border-0">
                                <!--begin::Card title-->
                                <div class="card-title">
                                    <div class="symbol symbol-35px me-2 mainIcon">
                                        <div class="symbol-label">
                                            <span class="material-icons material-icons-style">
                                                <iconContent></iconContent>
                                            </span>
                                        </div>
                                    </div>
                                    <h4 class="fw-bolder mainHeading">
                                        <headerContent></headerContent>
                                    </h4>
                                </div>
                                <!--end::Card title-->
                                <!--begin::Card toolbar-->
                                <div class="card-toolbar d-none">
                                    <a href="javascript:void(0);" class="btn btn-sm btn-flex btn-light-primary">
                                        <statusContent></statusContent>
                                    </a>
                                </div>
                                <!--end::Card toolbar-->
                            </div>
                            <!--end::Card header-->
                            <!--begin::Card body-->
                            <div class="card-body heightControl pt-0">
                                <div class="fw-bolder fs-2">
                                    <div class="">
                                        <bodyContent>No Data Found</bodyContent>
                                    </div>
                                </div>
                            </div>
                            <!--end::Card body-->
                            <div class="card-footer border-0">
                                <div class="fs-7 fw-normal text-muted">
                                    <footerContent></footerContent>
                                </div>
                            </div>
                        </div>
                    </div>
                    `,
                    chart: `
                    <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 mt-6 widgetWrapper chartWrapper">
                        <div class="card h-100 shadow-sm">
                            <div class="card-header border-0---">
                                <div class="card-title">
                                    <div class="symbol symbol-35px me-2 mainIcon">
                                        <div class="symbol-label">
                                            <span class="material-icons material-icons-style">
                                                <iconContent></iconContent>
                                            </span>
                                        </div>
                                    </div>
                                    <h4 class="fw-bolder mainHeading">
                                        <headerContent></headerContent>
                                    </h4>
                                </div>
                                <div class="card-toolbar">
                                    <a href="javascript:void(0);" class="d-none btn btn-sm btn-icon btn-icon-primary btn-active-light-primary me-n3" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end" data-kt-menu-flip="top-end">
                                        <span class="material-icons material-icons-style">
                                            more_vert
                                        </span>
                                    </a>
                                    <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bolder w-200px" data-kt-menu="true" style="">
                                        <div class="menu-item px-3">
                                            <div class="menu-content fs-6 text-dark fw-boldest px-3 py-4">Quick Actions</div>
                                        </div>
                                        <div class="separator mb-3 opacity-75"></div>
                                        <div class="menu-item px-3">
                                            <a href="javascript:void(0);" class="menu-link px-3">New Ticket</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body min-h-300px heightControl pt-0---">
                                <bodyContent>No Data Found</bodyContent>
                            </div>
                        </div>
                    </div>
                    `,
                    list: `
                    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 mt-6 widgetWrapper listWrapper">
                        <div class="card h-100 shadow-sm">
                            <div class="card-header border-0---">
                                <div class="card-title">
                                    <div class="symbol symbol-35px me-2 mainIcon">
                                        <div class="symbol-label">
                                            <span class="material-icons material-icons-style">
                                                <iconContent></iconContent>
                                            </span>
                                        </div>
                                    </div>
                                    <h4 class="fw-bolder mainHeading">
                                        <headerContent></headerContent>
                                    </h4>
                                </div>
                            </div>
                            <div class="card-body min-h-300px h-300px heightControl pt-0---">
                                <bodyContent>No Data Found</bodyContent>
                            </div>
                        </div>
                    </div>
                    `,
                    menu: `
                    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 mt-6 widgetWrapper menuWrapper">
                        <div class="card h-100 shadow-sm">
                            <div class="card-header border-0---">
                                <div class="card-title">
                                    <div class="symbol symbol-35px me-2 mainIcon">
                                        <div class="symbol-label">
                                            <span class="material-icons material-icons-style">
                                                <iconContent></iconContent>
                                            </span>
                                        </div>
                                    </div>
                                    <h4 class="fw-bolder mainHeading">
                                        <headerContent></headerContent>
                                    </h4>
                                </div>
                            </div>
                            <div class="card-body heightControl pt-0---">
                                <descriptionContent>
                                    <div class="description pb-5" title="menu">
                                        No Description
                                    </div>
                                </descriptionContent>
                                <bodyContent>No Data Found</bodyContent>
                            </div>
                        </div>
                    </div>
                    `,
                    "modern menu":`
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 widgetWrapper modernMenuWrapper">
                        <modernMenuContent></modernMenuContent>
                    </div>
                    `,
                    modernMenuContent:`
                    <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 mt-6">
                        <div class="card h-100 shadow-sm">
                            <div class="card-body cursor-pointer">
                                <div class="text text-center header---">
                                    <iconContent></iconContent>
                                    <span class="fw-bolder fs-5 modernMenuName">
                                        <bodyContent></bodyContent>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    `,
                    "image card": `
                    <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 mt-6 widgetWrapper imageWrapper">
                        <div class="card h-100 shadow-sm">
                            <div class="h-400px heightControl">
                                <imageContent></imageContent>
                            </div>

                            <div class="card-img-overlay p-0 h-100" style="background: rgba(0,0,0,.4);">
                                <div class="card bg-transparent h-100">
                                    <div class="card-header bg-transparent border-0">
                                        <div class="card-title d-flex">
                                            <div class="symbol symbol-35px me-2 mainIcon">
                                                <div class="symbol-label">
                                                    <span class="material-icons material-icons-style">
                                                        <iconContent></iconContent>
                                                    </span>
                                                </div>
                                            </div>
                                            <h4 class="mt-1 fs-1 fw-bolder text-white mainHeading">
                                                <headerContent></headerContent>
                                            </h4>
                                        </div>
                                    </div>

                                    <div class="card-body pt-0">
                                        <div class="fs-3">
                                            <div class="text-white">
                                                <bodyContent>No Data Found</bodyContent>
                                            </div>
                                            
                                        </div>
                                    </div>

                                    <div class="card-footer bg-transparent border-0">
                                        <div class="fs-7 fw-normal text-white text-muted">
                                            <footerContent></footerContent>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                    </div>
                    `,
                    calendar: `
                    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 mt-6 widgetWrapper calendarWrapper">
                        <div class="card h-100 shadow-sm">
                            <div class="card-header border-0---">
                                <div class="card-title">
                                    <div class="symbol symbol-35px me-2 mainIcon">
                                        <div class="symbol-label">
                                            <span class="material-icons material-icons-style">
                                                <iconContent></iconContent>
                                            </span>
                                        </div>
                                    </div>
                                    <h4 class="fw-bolder mainHeading">
                                        <headerContent></headerContent>
                                    </h4>
                                </div>
                                <div class="d-none card-toolbar">
                                    <a href="javascript:void(0);" class="btn btn-sm btn-icon btn-icon-primary btn-active-light-primary me-n3" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end" data-kt-menu-flip="top-end">
                                        <span class="material-icons material-icons-style">
                                            more_vert
                                        </span>
                                    </a>
                                    <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bolder w-200px" data-kt-menu="true" style="">
                                        <div class="menu-item px-3">
                                            <div class="menu-content fs-6 text-dark fw-boldest px-3 py-4">Quick Actions</div>
                                        </div>
                                        <div class="separator mb-3 opacity-75"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body min-h-600px h-600px heightControl pt-0---">
                                <bodyContent>No Data Found</bodyContent>
                            </div>
                            <div class="card-footer py-2 border-0--- d-flex justify-content-evenly d-none">
                                <div class="fs-7 fw-normal text-white text-muted">
                                    <footerContent></footerContent>
                                </div>
                            </div>
                        </div>
                    </div>
                    `,
                    "html": `
                    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 mt-6 widgetWrapper htmlDomWrapper">
                        <div class="card h-100 shadow-sm">
                            <div class="d-none card-header border-0---">
                                <div class="card-title">
                                    <div class="symbol symbol-35px me-2 mainIcon">
                                        <div class="symbol-label">
                                            <span class="material-icons material-icons-style">
                                                <iconContent></iconContent>
                                            </span>
                                        </div>
                                    </div>
                                    <h4 class="fw-bolder mainHeading">
                                        <headerContent></headerContent>
                                    </h4>
                                </div>
                            </div>
                            <div class="card-body p-0 min-h-300px heightControl pt-0---">
                                <bodyContent>No Data Found</bodyContent>
                            </div>
                        </div>
                    </div>
                    `,
                    masonryWidth: `
                    <div class="grid-sizer col-lg-1 col-md-1 col-sm-12 col-xs-12"></div><div class="clearfix"></div>
                    `,
                    break: `
                    <div class="clearfix"></div>
                    `
                }
            },
            notificationbar:{},
            navigation: {
                backButton: {
                    div: ".appBackBtn"
                }
            },
            isHybrid: false,
            isMobile: false,
            showMenu: true
        }
        /* Left Sidebar - Function =================================================================================================
        *  You can manage the left sidebar menu options
        *
        */
        leftSideBar = {
            activate: function (options, isMobile) {
                var _this = this;
                _this.options = options;
                _this.isMobile = isMobile;
                _this.drawMenu();
            },
            setMenuHeight: function (isFirstTime) {
            },
            checkStatusForResize: function (firstTime) {
            },
            isOpen: function () {
            },
            drawMenu: function () {
                var _this = this;
                var $body = $('body');

                typeof createNewLeftMenu != "undefined" && createNewLeftMenu(_this.options.menuConfiguration);

                if (!$.axpertUI.options.showMenu) {
                    $body.attr("data-kt-aside-minimize", "on").data("ktAsideMinimize", "on")
                }
            }
        };

        // notificationbar
        notificationbar = {
            activate: function (options) {
                var _this = this;
                var $sidebar = $('#notificationbar');
                var $panel = $("#notificationPanel");
                _this.options = options;

                if (typeof _this.options.notificationTimeout != "undefined" && _this.options.notificationTimeout != "" && !isNaN(+(_this.options.notificationTimeout))) {
                    var notifytimeoutms = +(_this.options.notificationTimeout) * 60000;

                    setInterval(CheckNotificiationStringinRedis, notifytimeoutms);

                    $(_this.options.divParent).attr("title", _this.options.staging.options.notification.title).find(_this.options.staging.options.notification.div).text(_this.options.staging.options.notification.title);

                    $('.right-notificationbar').on('click', function () {
                        setTimeout(() => {
                            _this.notifyCount();
                        }, 0);
                    });
                    $("#Clearnotify").on('click', function () {
                        $sidebar.find(".demo-settings").empty();

                        setTimeout(() => {
                            _this.notifyCount();
                        }, 0);

                        try {
                            $.ajax({
                                url: 'mainnew.aspx/delALLNotificiationKeyfromRedis',
                                type: 'POST',
                                cache: false,
                                async: true,
                                data: JSON.stringify({
                                    key: true,
                                }),
                                dataType: 'json',
                                contentType: "application/json",
                                success: function (data) {

                                },
                                error: function (error) {

                                }
                            });
                        }
                        catch (exp) {

                        }
                    });

                }
                else{
                    $panel.addClass("d-none");
                }


            },
            isOpen: function () {
                
            },
            notifyCount: function () {
                var $panel = $("#notificationPanel");
                var notifyCount = $("#notifycount .settingsGeneral").length;
                if (notifyCount > 0){
                    $panel?.find(".blinker")?.removeClass("d-none");
                }else{
                    $panel?.find(".blinker")?.addClass("d-none");
                }
            }


        };

        //==========================================================================================================================
        /* Right Sidebar - Function ================================================================================================
    *  You can manage the right sidebar menu options
    *
    */
        rightSideBar = {
            activate: function (options) {
                var _this = this;
                var $sidebar = $('#rightsidebar');
                var $overlay = $('.overlay');
                _this.options = options;
            },
            isOpen: function () {
            },
            switchLanguage(elm){
                var _this = this;

                let newLanguage = $(elm).data("language");
                if(gllangauge != newLanguage){
                    if (typeof (Storage) !== "undefined") {
                        let appUrl = top.window.location.href.toLowerCase().substring("0", top.window.location.href.indexOf("/aspx/"));

                        localStorage["langInfo-" + appUrl] = newLanguage;
                    }

                    _this.callSwitchLanguageWS(newLanguage);

                    $j("#btnSetParams").click();
                    
                }
            },
            callSwitchLanguageWS(newLanguage){
                $.ajax({
                    type: "POST",
                    url: "../WebService.asmx/switchLanguage",
                    cache: false,
                    async: false,
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify({ lang: newLanguage }),
                    dataType: "json",
                    success: function (data) { 
                        if (data.d != "done"){
                            showAlertDialog("error", data.d);
                        }
                    },
                });
            }
        }
        //==========================================================================================================================

        /* cardsPage - Function ================================================================================================
        *  You can manage the cards page here
        *
        */
        cardsPage = {
            activate(options) {
                let _this = this;
                if (options == "loadhomepage") {
                    _this.options.cards = _this._refreshData() || _this.options.cards;
                    _this.options = _this.options;                   
                } else if(options) {
                    _this.options = options;
                } else {
                    _this.options = _this.options;
                }
                _this.currentColumnWidth = 0;
                _this.firstTime = true;
                _this._checkSetCardsAndInit();

                _this._showCardsFrame(_this.options.setCards);

                if (_this.options.setCards) {
                    _this._sortCardsObject();
                    _this._drawCardsLayout();
                }
                delete _this.currentColumnWidth;

                _this.firstTime = false;
            },
            _refreshData(axp_cardsid, singleLoad = false) {
                let _this = this;
                let result = "";
                $.ajax({
                    url: 'mainnew.aspx/refreshCards',
                    type: 'POST',
                    cache: false,
                    async: false,
                    data: JSON.stringify({
                        json: (axp_cardsid || _this.options.cards.map(card=>card["axp_cardsid"]).join(",") || ""),
                        isJSON: false,
                        singleLoad
                    }),
                    dataType: 'json',
                    contentType: "application/json",
                    success: function (data) {
                        if (data && data.d) {
                            try {
                                result = JSON.parse(data.d !== "" ? data.d : "[]",
                                    function(k, v) { 
                                        try {
                                            return (typeof v === "object" || isNaN(v) || v.toString().trim() === "") ? v : (typeof v == "string" && (v.startsWith("0") || v.startsWith("-")) ? parseFloat(v, 10) : JSON.parse(v)); 
                                        } catch (ex) {
                                            return v;
                                        }
                                    }
                                );
                            } catch (ex) {}
                        }
                    },
                    error: function (error) {

                    }
                });
                return result;
            },
            _checkSetCardsAndInit() {
                let _this = this;
                let showEditButton = _this.options.cards.length > 0;
                if (!showEditButton) {
                    $(_this.options.staging.cardsFrame.editSaveButton).addClass("d-none");
                }
            },
            _showCardsFrame(showCards) {
                let _this = this;
                setTimeout(() => {
                    if (showCards && _this.options.setCards) {
                        $(_this.options.staging.iframes).addClass("d-none");
                        $(_this.options.staging.cardsFrame.div).removeClass("d-none");

                        _this.editSaveCardDesignToggle(true);
                    } else {
                        $(_this.options.staging.iframes).removeClass("d-none");
                        $(_this.options.staging.cardsFrame.div).addClass("d-none");
                    }
                    // if(typeof closeFrame!="undefined")
                    //     closeFrame();
                }, 0);
            },
            editSaveCardDesignToggle(reset = false) {
                let _this = this;
                let isEdit = $(_this.options.staging.cardsFrame.cardsDesigner).hasClass("d-none");
                if (!reset && isEdit) {
                    $(_this.options.staging.cardsFrame.cardsDiv).addClass("d-none");
                    $(_this.options.staging.cardsFrame.cardsDesigner).removeClass("d-none");
                    $(_this.options.staging.cardsFrame.editSaveButton).removeClass("btn-default").addClass("btn-primary");
                    $(_this.options.staging.cardsFrame.editSaveButton + " " + _this.options.staging.cardsFrame.icon).text("save");
                } else {
                    $(_this.options.staging.cardsFrame.cardsDiv).removeClass("d-none");
                    $(_this.options.staging.cardsFrame.cardsDesigner).addClass("d-none");
                    $(_this.options.staging.cardsFrame.editSaveButton).addClass("btn-default").removeClass("btn-primary");
                    $(_this.options.staging.cardsFrame.editSaveButton + " " + _this.options.staging.cardsFrame.icon).text("edit");

                    if (!reset && _this.options.designChanged) {
                        _this.options.design = _this._generateCardsDesign();
                        if ((saveMsg = _this._saveCardDesign()) == "true") {
                            _this.options.designChanged = false;
                            showAlertDialog("success", "Cards Design Saved Successfully");
                            _this.activate();
                        } else {
                            try {
                                saveMsg = JSON.parse(saveMsg)["error"]["msg"];
                            } catch (ex) {}
                            showAlertDialog("error", saveMsg);
                            if (saveMsg == "Session Authentication failed...") {
                                setTimeout(() => {
                                    parent.window.location.href = "../aspx/sess.aspx";
                                }, 1000);   
                            }
                        }
                    } else if(!_this.options.designChanged) {
                    }
                }
            },
            _generateCardsDesign() {
                let _this = this;
                return $(`${_this.options.staging.cardsFrame.cardsDesigner} li input:checkbox`).map((index, elem) => {
                    return {axp_cardsid: $(elem).data("cardId"), visible: $(elem).prop("checked"), orderno: index+ 1 }
                }).toArray();
            },
            _saveCardDesign() {
                let _this = this;
                let result = "";
                $.ajax({
                    url: 'mainnew.aspx/saveCardsDesign',
                    type: 'POST',
                    cache: false,
                    async: false,
                    data: JSON.stringify({
                        design: JSON.stringify(_this.options.design)
                    }),
                    dataType: 'json',
                    contentType: "application/json",
                    success: function (data) {
                        if (data && data.d) {
                            result = data.d;
                        }
                    },
                    error: function (error) {

                    }
                });
                return result;
            },
            _sortCardsObject(cards) {
                let _this = this;

                if(_this.options.cards.length > 0){
                    _this.options.cards =  _.values(_.merge(_.keyBy(_this.options.cards, 'axp_cardsid'), _.keyBy(_this.options.design, 'axp_cardsid'))).map((card => {
                        if(card["cardtype"]){
                            typeof card["visible"] != "undefined" ? delete card.visible : "";
                            return card;
                        }else{
                            return false;
                        }
                    })).filter((card=>card));
                }

                _this.options.cards = _.sortBy(_this.options.cards, (card)=>parseInt(card.orderno))
            },
            _drawCardsLayout() {
                let _this = this;
                $(_this.options.staging.cardsFrame.div + " " + _this.options.staging.cardsFrame.cardsDiv).html(``);
                $(_this.options.staging.cardsFrame.div + " " + _this.options.staging.cardsFrame.cardsDesigner).html(``);

                if (_this.options.enableMasonry) {
                    $(_this.options.staging.cardsFrame.div + " " + _this.options.staging.cardsFrame.cardsDiv).html(_this.options.html.masonryWidth);   
                }

                try {
                    callParentNew("updateAppLinkObj")?.("loadhomepage");
                } catch (ex) {
                    
                }

                _this.options.cards.forEach((card, index) => {
                    let cardType = card["cardtype"];
                    if (cardType) {
                        if(["chart", "kpi", "list", "menu", "modern menu", "image card", "calendar", "html"].indexOf(cardType) == -1){
                            return;
                        }

                        let cardData = _this._getCardData(card);

                        let cardId = card["axp_cardsid"];

                        let design = _this.options.design.filter((dsign) => dsign.axp_cardsid == cardId)[0];

                        let cardVisible = design && typeof design["visible"] != "undefined" ? JSON.parse(design["visible"]) : true;

                        $(_this.options.staging.cardsFrame.cardsDesigner).append(`
                        <li class="d-flex list-group-item ui-state-default">
                            <span class="material-icons dragIcon cursor-pointer my-auto">drag_indicator</span>

                            <div class="agform form-check form-check-custom form-check-solid px-1 align-self-end">
                                <input id="chkBox${cardId}" class="showHideChkBox form-check-input h-20px w-20px" type="checkbox" ${cardVisible ? `checked="checked"` : ``} data-card-id="${cardId}" />
                                <label class="form-check-label form-label fw-boldest my-2" for="chkBox${cardId}" >
                                    <span class="dragName">${card["cardname"]} (${cardType})</span>
                                </label>
                            </div>
                        </li>
                        `);

                        if (!cardVisible) {
                            return cardVisible;
                        }

                        let cardFormattedData = [];
                        
                        cardFormattedData = _this._formatOutput(cardData);
                        
                        let cardElement = $(_this.options.html[cardType]).attr("card-index", index).data("card-index", index);

                        $(_this.options.staging.cardsFrame.cardsDiv).append(cardElement);

                        switch (cardType) {
                            case "kpi":
                                _this._addCardHeight(cardElement, card, "");
                                _this._addCardWidth(cardElement, card, "3");
                                
                                _this._addCardIcon(cardElement, card);
                                _this._addCardHeader(cardElement, card);
                                if (typeof cardData != "string" && cardData.length > 0) {
                                    try {
                                        _this._setKpiInfo(cardElement, cardData, cardFormattedData);
                                    } catch (ex) {}
                                }
                                
                                _this._addCardBackground(cardElement,card);
                                break;
                            case "image card":
                                _this._addCardHeight(cardElement, card, "");
                                _this._addCardWidth(cardElement, card, "4");
                                
                                _this._addCardIcon(cardElement, card);
                                _this._addCardHeader(cardElement, card);
                                
                                try {
                                    _this._setImageCardInfo(cardElement, cardData, card);
                                } catch (ex) {}

                                _this._addCardBackground(cardElement,card);
                                break;
                            case "chart":
                                _this._addCardHeight(cardElement, card, "");
                                _this._addCardWidth(cardElement, card, "4");
                                
                                _this._addCardIcon(cardElement, card);
                                _this._addCardHeader(cardElement, card);

                                if (typeof cardData != "string" && cardData.length > 0) {
                                    setTimeout(() => {
                                        let body = cardElement.find("bodyContent").parent();
                                        try {
                                            AxPlotHighChartWidgets(card["charttype"], body, cardFormattedData.rows, cardFormattedData.metaData, (_this._getChartJsonProps(card, "attributes") || {}), (_this._getChartJsonProps(card, "attributes.enableSlick") || false));
                                            setTimeout(() => {
                                                body.find(".highcharts-button.highcharts-contextbutton, .highcharts-button.highcharts-contextbutton *").hide();
                                            }, 0);
                                        } catch (ex) {}
                                    }, 0);
                                }
                                break;
                            case "list":
                                _this._addCardHeight(cardElement, card, "");
                                _this._addCardWidth(cardElement, card, "6");
                                
                                _this._addCardIcon(cardElement, card);
                                _this._addCardHeader(cardElement, card);
                                if (typeof cardData != "string" && cardData.length > 0) {
                                    setTimeout(() => {
                                        try {
                                            _this._generateDatatable(cardElement.find("bodyContent").parent(), card, cardData, cardFormattedData);

                                            _this._addCardBackground(cardElement,card);
                                        } catch (ex) {}
                                    }, 0);
                                }
                                break;
                            case "menu":
                                _this._addCardHeight(cardElement, card, "");
                                _this._addCardWidth(cardElement, card, "6");
                                
                                _this._addCardIcon(cardElement, card);
                                _this._addCardHeader(cardElement, card);

                                try{
                                    _this._setMenuInfo(cardElement, cardData, card);
                                } catch (ex) {}

                                _this._addCardBackground(cardElement,card);
                                break;
                            case "modern menu":
                                _this._addCardWidth(cardElement, {...card, width: "col-md-12"}, "12");

                                // _this.currentColumnWidth = 0;

                                try {
                                    _this._setModernMenuInfo(cardElement, cardData, card);
                                } catch (ex) {}
                                break;
                            case "calendar":
                                _this._addCardWidth(cardElement, card, "12");
                                _this._addCardHeight(cardElement, card, "");
                                
                                _this._addCardIcon(cardElement, card);
                                _this._addCardHeader(cardElement, card);

                                try {
                                    _this._setCalendar(cardElement, cardData, card);
                                } catch (ex) {}
                                break;
                            case "html":
                                _this._addCardHeight(cardElement, card, "");                                
                                _this._addCardWidth(cardElement, card, "4");

                                _this._addCardIcon(cardElement, card);
                                _this._addCardHeader(cardElement, card);
                                
                                try {
                                    _this._setHtmlData(cardElement, card);
                                } catch (ex) {}

                                _this._addCardBackground(cardElement,card);
                                break;
                            case "break":
                                break;
                        }
                    }
                });
                _this._cardsWidthPostProcessor($(_this.options.staging.cardsFrame.cardsDiv));
                _this._registerPlugins();
            },
            _getCardData(card){
                let cardData = card.cardsql.row || card.cardsql["@value"] || "";
                if (typeof cardData.length == "undefined") {
                    cardData = [cardData];
                }

                return cardData;
            },
            _addCardIcon(cardElement, card) {
                let iconDiv = cardElement.find("iconContent").parents(".mainIcon");

                let icon = card["cardicon"] ? (card["cardicon"] != "*" ? card["cardicon"].toString() : "") : "";

                cardElement.find("iconContent").replaceWith(icon);

                if (icon) {
                    iconDiv.addClass("iconAdded");
                } else {
                    iconDiv.addClass("d-none");
                }
            },
            _addCardHeader(cardElement, card) {
                cardElement.find(".mainHeading").attr("title", (card["cardname"] || "")).find("headerContent").replaceWith(card["cardname"] || "");
            },
            _addCardBackground(cardElement, card){ 
                cardElement.find(".card-body a:not(.dropdown a)").addClass("border-bottom");
                
                if(card["axpfile_imgcard"] && card["cardtype"] == "image card") {
                    cardElement.find("imageContent").replaceWith($(`<img class="w-100 h-100 card-img img-fluid" style="object-fit: cover;" />`).attr("src", `../${thmProj}/ImageCard/${card["axpfile_imgcard"].split(",")[0]}`));
                }
                
                if(card["cardbgclr"]) {
                    cardElement.find(".card, table, a:not(.dropdown a)").addClass("cardbg-" + card["cardbgclr"]);

                    cardElement.find(".symbol .symbol-label, button").addClass("cardbg-inverse-" + card["cardbgclr"]);
                }                
            },
            _addCardWidth(cardElement, card, defaultWidth) {
                let _this = this;
                if (_this._getSetCardWidth(cardElement, card, defaultWidth)) {
                    if(_this.options.enableMasonry){
                        $(_this._getClearFix()).insertBefore(cardElement);
                    }else{
                        $(cardElement.prevAll(":not(.row)").toArray().reverse()).wrapAll(`<div class="row" />`);
                    }
                }
            },
            _addCardHeight(cardElement, card, defaultHeight) {
                let _this = this;
                if(cardElement.find(".heightControl").length > 0){
                    _this._getSetCardHeight(cardElement.find(".heightControl"), card, defaultHeight);
                }
            },
            _formatOutput(result){
                let mt = [], row = [], rowset = [];
                for(i=0;i<result.length;i++){
                    row = [];
                    for( attr in result[i]){
                        if(i==0){
                            mt.push({'name':attr});
                        }
                        row.push(result[i][attr]);
                    }
                    rowset[i] = row;
                }
                return {"metaData": mt, "rows": rowset};
            },
            _generateDatatable(elem, card, cardData, cardFormattedData) {
                let _this = this;
                let hiddenColumns = [];
                
                var parsedHyperLink = parseHyperLink(cardFormattedData.metaData, cardFormattedData.rows[0]);

                if (cardData.length > 0) {
                    let tableHTML = `
                    <table class="table" cellspacing="0" width="100%">
                        <thead>
                            <tr>
                                ${Object.keys(cardData[0]).map((col, ind) => {
                                    if (col.toLowerCase() == "link" || col.toLowerCase().endsWith("_ui") || col.toLowerCase().startsWith("axphide_")) {
                                        hiddenColumns.push(ind);
                                    }
                                    return `<th>${col}</th>`;
                                }).join('')}
                            </tr>
                        </thead>
                    </table>
                    `;
                    elem.html(tableHTML);
                    elem.find("table").DataTable({
                        data: cardData,
                        columns: Object.keys(cardData[0]).map((col) => {
                            return {data: col}
                        }),
                        dom: "t",
                        // order: [],
                        columnDefs: [
                            {
                                targets: hiddenColumns,
                                visible: false
                            },
                            {
                                targets: "_all",
                                createdCell(elem, cellData, rowData, row, col) {
                                    if (Object.keys(rowData)[col].toLowerCase().startsWith("axphidec_")) {
                                        $(elem).html("");
                                        return;
                                    }
                                    var hyperLinkCol = parsedHyperLink ? parsedHyperLink.i : false;
        
                                    if (hyperLinkCol !== false) {
                                        cellData = getTheHyperLink(cardFormattedData.rows[row][hyperLinkCol], parsedHyperLink, customizeData(cardFormattedData.rows[row][col]), col);

                                        $(elem).html(cellData);
                                    }

                                    if (styleString = rowData[`${Object.keys(rowData)[col]}_ui`]) {
                                        $(elem).html(_this._SetAxFontCondition($(`<div><div>${cellData}</div></div>`).find("div"), styleString).css({"border-radius": "10px"}).parent().html());
                                    }
                                }
                            }
                        ],
                        "bLengthChange": false,
                        "bPaginate": false,
                        "pageLength": 20,
                        initComplete(settings, json) {
                            $(this).css({ "height": (elem.height()) + "px", "overflow": "auto", "display": "block" });
                        }
                    });
                }
            },
            _setKpiInfo(cardElement, cardData, cardFormattedData) {
                if (cardData && cardData[0] && cardData[0]["status"]) {
                    let statusContent = cardElement.find("statusContent");

                    statusContent.parents("card-toolbar").removeClass("d-none");

                    statusContent.replaceWith($("<div>" + cardData[0]["status"] + "</div>").attr("title", `${(cardData[0]["status"]) || ""}`) || "");
                }

                if (cardData && cardData[0] && cardData[0]["footer"]) {
                    cardElement.find("footerContent").replaceWith($("<div>" + cardData[0]["footer"] + "</div>").attr("title", `${(cardData[0]["footer"]) || ""}`) || "");
                }else{
                    cardElement.find("footerContent").parents(".card-footer").addClass("d-none");
                }

                var plotName = ((thisdata = cardData[0][Object.keys(cardData[0])[0]]) || (typeof thisdata != "undefined" ? thisdata : ""));

                var data = "";
                try {
                    var parsedHyperLink = parseHyperLink(cardFormattedData.metaData, cardFormattedData.rows[0]);

                    var hyperLinkCol = parsedHyperLink ? parsedHyperLink.i : false;

                    if (hyperLinkCol !== false) {
                        data = getTheHyperLink(cardFormattedData.rows[0][hyperLinkCol], parsedHyperLink, customizeData(plotName), parseInt(Object.keys(parsedHyperLink.data)[0].replace("col", "")) - 1);   
                    }else{
                        data = customizeData(plotName);
                    }
                } catch (ex) {
                    data = customizeData(plotName);
                }

                cardElement.find("bodyContent").replaceWith($(`<div class="fs-2qx---">${data}</div>`).attr("title", `${(cardData[0][Object.keys(cardData[0])[0]]) || ""}`) || "");
            },
            _setImageCardInfo(cardElement, cardData, card) {
                var data = "";
                data = card.pagedesc || "";

                if(data){
                    cardElement.find("bodyContent").replaceWith($(`<div>${data}</div>`).attr("title", `${(data) || ""}`) || "");
                }

                if (card.htransid && card.htype) {
                    let linkStr = "";
                    if (card["htype"].toLowerCase() === "iview") {
                        linkStr = "ivtoivload.aspx?ivname=" + card.htransid;
                    } else if (card["htype"].toLowerCase() === "tstruct") {
                        linkStr = "tstruct.aspx?transid=" + card.htransid + `&openerIV=${card.htransid}&isIV=false`;
                    }

                    let footerHyperLink = `AxLoadUrl('${linkStr}');`;
                            
                    cardElement.find("footerContent").replaceWith($("<a class='imgCardHyperlink' href='javascript:void(0);'>" + (card.hcaption || "Link") + "</a>").attr("onclick", `${footerHyperLink || ""}`) || "");
                }else{
                    cardElement.find("footerContent").parents(".card-footer").addClass("d-none");
                }
            },
            _setMenuInfo(cardElement, cardData, card) {
                var data = "";
                data = card["pagedesc"] || card["cardname"] || "";

                cardElement.find("descriptionContent").replaceWith($(`<div class="description pb-5">${data}</div>`).attr("title", `${data}`) || "");

                var pageName = "";
                pageName = card["pagename"] || "";

                let menuArray = [];
                if (pageName) {
                    var pageObj = _.findDeep(
                        menuJson,
                        (value, key, parent) => {
                            if (key == 'oname' && value == pageName) return true;
                        }
                    )?.parent;
                    if (pageObj) {
                        if (!pageObj.target) {
                            menuArray = pageObj.child || [];
                        } else {
                            menuArray = pageObj;
                        }
                        if (typeof menuArray.length == "undefined") {
                            menuArray = [menuArray];
                        }
                    }
                }

                if (menuArray.length > 0) {
                    let menuOptions = menuArray.map(menu => {

                        if (!menu.target) {
                            return ``;
                        }

                        let iconString = ``;
                        
                        if (typeof menu.icon == "object") {
                            iconString = `<span class="menu-icon material-icons material-icons-style menuIconFont">${menu.icon.text}</span>`;
                        }
                        else if (menu.icon && menu.icon.indexOf("/") != -1) {
                            iconString = `<img src="${menu.icon}" class="menu-icon menuIcon" />`;
                        }
                        else if (menu.target != undefined && menu.target != "") {
                            if (menu.target.indexOf("tstruct.aspx") > -1) {
                                iconString = `<span class="menu-icon material-icons material-icons-style material-icons-2 menuIconFont">assignment</span>`;
                            } else if (menu.target.indexOf("iview.aspx") > -1 || menu.target.indexOf("iviewInteractive.aspx") > -1) {
                                iconString = `<span class="menu-icon material-icons material-icons-style material-icons-2 menuIconFont">view_list</span>`;
                            }
                            else {
                                iconString = `<span class="menu-icon material-icons material-icons-style material-icons-2 menuIconFont">insert_drive_file</span>`;
                            }
                        }
                        else if (menu.target == "" && menu.oname.indexOf("Head") > -1) {
                            iconString = `<span class="menu-icon material-icons material-icons-style material-icons-2 menuIconFont">folder</span>`;
                        }
                        else {
                            iconString = `<span class="menu-icon material-icons material-icons-style material-icons-2 menuIconFont">insert_drive_file</span>`;
                        }
                    
                        return `
                        <li class="menu-item">
                            <a href="javascript:void(0);" class="dropdown-item menu-link" title="${menu.name}" onclick="AxLoadUrl('${menu.target}')">
                                ${iconString}
                                <span>${menu.name}</span>
                            </a>
                        </li>
                        `;
                    }).join("");
                    
                    let menuHTML = `
                    <div class="dropdown" id="dropdownMenuButton1">
                        <button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                            Menu
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            ${menuOptions}
                        </ul>
                    </div>
                    `;

                    if (menuHTML && menuOptions) {
                        cardElement.find("bodyContent").replaceWith($(`<div class="">${menuHTML}</div>`) || "");
                    }
                }
            },
            _setModernMenuInfo(cardElement, cardData, card) {
                let _this = this;
                
                var pageName = "";
                pageName = card["pagename"] || "";

                let menuArray = [];
                if (pageName) {
                    var pageObj = _.findDeep(
                        menuJson,
                        (value, key, parent) => {
                            if (key == 'oname' && value == pageName) return true;
                        }
                    )?.parent;
                    if (pageObj) {
                        if (!pageObj.target) {
                            menuArray = pageObj.child || [];
                        } else {
                            menuArray = pageObj;
                        }
                        if (typeof menuArray.length == "undefined") {
                            menuArray = [menuArray];
                        }
                    }
                }

                if (menuArray.length > 0) {
                    let menuOptions = menuArray.map(menu => {

                        if (!menu.target) {
                            return ``;
                        }

                        let iconString = ``;
                        
                        if (typeof menu.icon == "object") {
                            iconString = `<span class="material-icons material-icons-style material-icons-3x text-primary menuIconFont">${menu.icon.text}</span>`;
                        }
                        else if (menu.icon && menu.icon.indexOf("/") != -1) {
                            iconString = `<img src="${menu.icon}" class="menuIcon" />`;
                        }
                        else if (menu.target != undefined && menu.target != "") {
                            if (menu.target.indexOf("tstruct.aspx") > -1) {
                                iconString = `<span class="material-icons material-icons-style material-icons-3x text-primary menuIconFont">assignment</span>`;
                            } else if (menu.target.indexOf("iview.aspx") > -1 || menu.target.indexOf("iviewInteractive.aspx") > -1) {
                                iconString = `<span class="material-icons material-icons-style material-icons-3x text-primary menuIconFont">view_list</span>`;
                            }
                            else {
                                iconString = `<span class="material-icons material-icons-style material-icons-3x text-primary menuIconFont">insert_drive_file</span>`;
                            }
                        }
                        else if (menu.target == "" && menu.oname.indexOf("Head") > -1) {
                            iconString = `<span class="material-icons material-icons-style material-icons-3x text-primary menuIconFont">folder</span>`;
                        }
                        else {
                            iconString = `<span class="material-icons material-icons-style material-icons-3x text-primary menuIconFont">insert_drive_file</span>`;
                        }

                        let tempMenu = $(_this.options.html["modernMenuContent"]);

                        tempMenu.find("bodyContent").replaceWith($(`<div class="pt-2 modernMenuNameText" title="${menu.name}">${menu.name}</div>`) || "");

                        tempMenu.find("iconContent").replaceWith($(`<div class="">${iconString}</div>`) || "");

                        tempMenu.attr("onclick", `AxLoadUrl('${menu.target}')`);

                        return tempMenu.get(0).outerHTML;
                    }).join("");

                    if (menuOptions) {
                        cardElement.find("modernMenuContent").replaceWith($(`<div class="row">${menuOptions}</div>`) || "");
                    }
                }
            },
            _setCalendar(cardElement, cardData, card){
                let _this = this;

                let body = cardElement.find("bodyContent").parent();
                
                body.find("bodyContent").hide();

                if(!body.data("height")){
                    body.data("height", body.css("height"));
                }

                body.css("height", body.data("height"));

                let bodyHeight = $(body).height();

                try {
                    if(card["obj"]){

                        let ind = cardElement.data("cardIndex");

                        _this.options.cards[ind] = card;

                        cardData = _this._getCardData(card);

                        card["obj"].destroy();
                    }                    
                } catch (ex) {}

                let headerOptions = [
                    {
                        icon: "calendar_view_month",
                        href: "javascript:void(0);",
                        caption: "Month View",
                        onclick: `$.axpertUI.cardsPage.options.cards[${cardElement.data("cardIndex")}].obj.changeView('dayGridMonth');`
                    },
                    {
                        icon: "calendar_view_week",
                        href: "javascript:void(0);",
                        caption: "Week View",
                        onclick: `$.axpertUI.cardsPage.options.cards[${cardElement.data("cardIndex")}].obj.changeView('dayGridWeek');`
                    },
                    {
                        icon: "calendar_view_day",
                        href: "javascript:void(0);",
                        caption: "Day View",
                        onclick: `$.axpertUI.cardsPage.options.cards[${cardElement.data("cardIndex")}].obj.changeView('timeGridDay');`
                    },
                    {
                        icon: "add",
                        href: "javascript:void(0);",
                        caption: "Add Event",
                        onclick: `$.axpertUI.cardsPage._calendarEventClick('', ${cardElement.data("cardIndex")});`
                    }
                ];

                cardElement.find(".card-toolbar").removeClass("d-none");
                cardElement.find(".card-toolbar .menu.menu-sub.menu-sub-dropdown .separator + .menu-item").remove();
                cardElement.find(".card-toolbar .menu.menu-sub.menu-sub-dropdown .menu-item.dynamic-item").remove();
                headerOptions.forEach((opt)=>{
                    cardElement.find(".card-toolbar .menu.menu-sub.menu-sub-dropdown").append(`
                    <div class="menu-item px-3 dynamic-item">
                        <a href="${opt.href}" onclick="${opt.onclick}" class="menu-link px-3">
                            <i class="menu-icon material-icons material-icons-style material-icons-2">${opt.icon}</i>
                            <span>${opt.caption}</span>
                        </a>
                    </div>
                    `);
                });

                var calendar = new FullCalendar.Calendar($(body)[0], {
                    initialView: 'dayGridMonth',
                    dayMaxEventRows: true,
                    views: {
                        timeGrid: {
                            dayMaxEventRows: true
                        }
                    },
                    height: bodyHeight,
                    headerToolbar: {
                        start: 'title',
                        center: '',
                        end: 'addEvent today,prev,next'
                    },
                    buttonText:{
                        today: "today",
                        dayGridMonth: "calendar_view_month",
                        timeGridDay: "calendar_view_day",
                        prev: "navigate_before",
                        next: "navigate_next"
                    },
                    customButtons: {
                        addEvent: {
                            text: 'add',
                            click(e){
                                _this._calendarEventClick(e);
                            }
                        }
                    },
                    events: _this._calendarEventData(cardElement, cardData, card),
                    eventClick(info) {

                        $(".popover.in, .popover.show, .fc-popover").remove();

                        let {recordid} = info?.event?._def?.extendedProps;
                        _this._calendarEventClick(recordid, cardElement.data("cardIndex"));
                    },
                    dateClick: function(info) {
                        $(".popover.in, .popover.show, .fc-popover").remove();

                        _this._calendarEventClick(``, cardElement.data("cardIndex"), (info.dateStr ? `${moment(info.dateStr).format("DD/MM/YYYY")}`: ``));
                    },
                    eventDidMount(info) {
                        $(info.el).find(".fc-event-title").addClass("fw-boldest");
 
                        let eventColor;                   
                        if (info.event && (eventColor = info?.event?._def?.extendedProps?.statusColor)) {
                            // info.el.insertAdjacentHTML("afterBegin", `<p style="color:${eventColor}">•</p>`);
                            $(info.el).find(".fc-event-main-frame").prepend(`<span style="background-color:${eventColor}" class="bullet border mx-1 mt-2 w-7px h-7px"></span>`);
                        }

                        $(info.el).popover({
                            get title(){
                                let {title} = info?.event?._def;

                                let {type} = info?.event?._def?.extendedProps;

                                return `${title ? (`${title} (${type || ""})`) : ""}`
                            },
                            get content(){
                                let finalContent = "";

                                let {description, status, location} = info?.event?._def?.extendedProps;

                                typeof description != "undefined" && description != "" && (finalContent += ((finalContent ? "<br />" : "") + `<div class="menu-item"><div class="menu-link px-0 py-1"><span class="menu-icon material-icons material-icons-style material-icons-1 calendarPopoverSpan">description</span><span class="position-relative" style="top: -5px;">${description}</span></div></div>`));

                                typeof status != "undefined" && status != "" && (finalContent += ((finalContent ? "<!--<br />-->" : "") + `<div class="menu-item"><div class="menu-link px-0 py-1"><span class="menu-icon material-icons material-icons-style material-icons-1 calendarPopoverSpan">analytics</span><span class="position-relative" style="top: -5px;">${status}</span></div></div>`));

                                typeof location != "undefined" && location != "" && (finalContent += ((finalContent ? "<!--<br />-->" : "") + `<div class="menu-item"><div class="menu-link px-0 py-1"><span class="menu-icon material-icons material-icons-style material-icons-1 calendarPopoverSpan">location_on</span><span class="position-relative" style="top: -5px;">${location}</span></div></div>`));

                                return finalContent || "";
                            },
                            trigger: 'hover',
                            placement: 'top',
                            container: 'body',
                            html: true,
                            animation: false,
                            delay: { show: 0, hide: 0 }
                        }).on("shown.bs.popover", function(){
                            setTimeout(() => {
                                $(".popover.show").css("z-index", 9999);
                            }, 0);
                        });
                    }
                });

                setTimeout(() => {
                    let _this = $.axpertUI.cardsPage;

                    calendar.render();
                    card["obj"] = calendar;

                    _this._generateCalendarLegend(body, card);
                }, 0);
            },
            _generateCalendarLegend(body, card){
                let _this = $.axpertUI.cardsPage;

                let footer = body.next();
                let legendObj = [...new Set(card.cardsql.row.map((row)=>{return JSON.stringify({type: row.eventtype, color: row.eventcolor})}))].map(legend=>JSON.parse(legend)) || [];

                if(legendObj.length > 0){
                    footer.removeClass("d-none");
                    footer.find(".dynamic-item").remove();
                    footer.append($(legendObj.map(leg=>`
                    <span class="d-flex dynamic-item">
                        <span style="background-color:${leg.color}" class="bullet border mx-1 w-20px h-20px">
                        </span>
                        <span class="fw-boldest">
                            ${leg.type}
                        </span>
                    </span>
                    `).join("") || `<span></span>`));
                }
            },
            _calendarEventClick(recordObj = "", ind = "", date = "") {
                let _this = $.axpertUI.cardsPage;

                let recordid = "";

                let cardElement;
                let card;
                let cardData;

                let transid;

                if(typeof recordObj == "object"){
                    cardElement = $(recordObj.currentTarget).parents(".widgetWrapper");

                    ind = cardElement.data("cardIndex");

                    card = _this.options.cards[ind];

                    cardData = _this._getCardData(card);

                    // recordid = card["axp_cardsid"];
                }else{
                    cardElement = $(`.widgetWrapper[card-index=${ind}]`);

                    card = _this.options.cards[ind]
                    
                    cardData = _this._getCardData(card);

                    recordid = recordObj;
                }

                transid = card.calendarstransid || "axcal";

                let popTitle = "Calendar Events";

                try {
                    var modalId = "loadPopUpPage";//"iFrame" + popTitle.split(" ").join("");
                    var modalBodyLink = "";

                    // if(transid == "axcal"){
                        modalBodyLink = `tstruct.aspx?transid=${transid}${typeof recordid != "undefined" && recordid != "" ? `&recordid=${recordid}` : ``}${typeof date == "string" && date != "" ? `&startdate=${date}` : ``}&AxPop=true&act=open`
                    // }else{
                    //     modalBodyLink = `tstruct.aspx?transid=${transid}${typeof recordid != "undefined" && recordid != "" ? `&recordid=${recordid}` : ``}&AxPop=true${typeof recordid != "undefined" && recordid != "" ? `&act=load` : `&act=open`}`
                    // }

                    var iFrameModalBody = `<iframe id="${modalId}" name="${modalId}" class="col-12 flex-column-fluid w-100 h-100 p-0 my-n1" src="${""}" frameborder="0" allowtransparency="True"></iframe>`;
            
                    let myModal = new BSModal(modalId, "", iFrameModalBody,
                    (opening) => {
                        // if(delayLoad){
                        try {
                            myModal.modalBody.querySelector(`#${modalId}`).contentWindow.location.href = modalBodyLink;
                        } catch (ex) {}
                        // }
                    },
                    (closing) => {
                        var isAxPop = modalBodyLink.indexOf("AxPop=true") > -1;
            
                        if (isAxPop && eval(callParent('isSuccessAlertInPopUp'))) {
                            eval(callParent('isSuccessAlertInPopUp') + "= false");
                            try {
                                // callParentNew("updateSessionVar")('IsFromChildWindow', 'true')

                                let obj = card["obj"];

                                card = _this._refreshData(card["axp_cardsid"], true).filter(c=>c["axp_cardsid"] == card["axp_cardsid"])[0];

                                cardData = _this._getCardData(card);

                                card["obj"] = obj;

                                _this._setCalendar(cardElement, cardData, card);
                            } catch (ex) {}
                            // if (eval(callParent('isRefreshParentOnClose'))) {
                            //     eval(callParent('isRefreshParentOnClose') + "= false");
                            //     window.location.href = window.location.href;
                            // }
                        }
                    }
                    );
                    
                    myModal.changeSize("lg");
                    myModal.scrollableDialog();
                    // myModal.verticallyCentered();
                    myModal.hideHeader();
                    myModal.hideFooter();        
                    myModal.showFloatingClose();
                    myModal.modalBody.classList.add(...["bg-light", "overflow-hidden"]);
                    myModal.modalContent.classList.add("h-100");
                } catch (error) {
                    // showAlertDialog("error", error.message);
                }
            },
            _calendarEventData(cardElement, cardData, card){
                let _this = this;

                let returnData = [];

                cardData = cardData || [];

                try {
                    if(cardData){
                        returnData = cardData.map(d=>{
                            return {
                                id: d.axcalendarid || "",
                                title: d.eventname || "",
                                get start(){
                                    let returnString = "";

                                    if(d.startdate){
                                        let {date, format} =_this._getDateAndFormatBasedOnCulture(d.startdate);
                                        
                                        if(date && format){
                                            d.axptm_starttime = d.axptm_starttime || "00:00";
                                            
                                            date = `${date} ${d.axptm_starttime}`;
                                            format = `${format} hh:mm`;

                                            try {
                                                returnString = moment(date, format).toISOString();
                                            } catch (ex) {}
                                        }
                                    }

                                    return returnString;
                                },
                                get end(){
                                    let returnString = "";

                                    d.enddate = d.enddate || d.startdate;

                                    if(d.enddate){
                                        let {date, format} =_this._getDateAndFormatBasedOnCulture(d.enddate);
                                        
                                        if(date && format){
                                            d.axptm_endtime = d.axptm_endtime || "23:59";

                                            date = `${date} ${d.axptm_endtime}`;
                                            format = `${format} hh:mm`;

                                            try {
                                                returnString = moment(date, format).toISOString();
                                            } catch (ex) {}
                                        }
                                    }

                                    return returnString;
                                },
                                get allDay(){
                                    return (d.startdate == d.enddate && d.axptm_starttime == "00:00" && d.axptm_endtime == "23:59") || (moment(this.end).diff(moment(this.start), 'days') == 1 && d.axptm_starttime == "00:00" && d.axptm_endtime == "00:00");
                                },
                                type: d.eventtype || "",
                                description: d.messagetext || "",
                                get status(){
                                    if(d.eventstatus){
                                        return d.eventstatus;
                                    }else{
                                        switch(d.status){
                                            case 0:
                                                return "New event";
                                            case 1:
                                                return "Accepted";
                                            case 2:
                                                return "Rejected";
                                            case 3:
                                                return "Reschedule request";
                                            case 4:
                                                return "Cancel";
                                            default:
                                                return "";
                                        }
                                    }
                                },
                                get statusColor(){
                                    if(d.eventstatcolor){
                                        return rgbToHex(getCssByAttr("style", `color: ${d.eventstatcolor}`, "color"))
                                    }else{
                                        return "";
                                    }
                                },
                                location: d.location || "",
                                get classNames(){
                                    switch(this.type.toLowerCase()){
                                        // case "personal":
                                        //     return "cardbg-cyan";
                                        // case "meeting":
                                        //     return "cardbg-pink";
                                        // case "online meet":
                                        //     return "cardbg-purple";
                                        // case "leave":
                                        //     return "cardbg-red";
                                        default:
                                            return "";
                                    }
                                },
                                get color(){
                                    switch(this.type.toLowerCase()){
                                        // case "":
                                        //     return "";
                                        // case "personal":
                                        // case "meeting":
                                        // case "online meet":
                                        // case "leave":
                                        //     return "";
                                        default:
                                            {
                                                if(d.eventcolor){
                                                    return rgbToHex(getCssByAttr("style", `color: ${d.eventcolor}`, "color"));
                                                }else{
                                                    return ""
                                                }
                                            }
                                    }
                                },
                                get textColor(){
                                    switch(this.type.toLowerCase()){
                                        // case "personal":
                                        // case "meeting":
                                        // case "online meet":
                                        // case "leave":
                                        //     return "#ffffff";
                                        default:
                                            {
                                                if(d.eventcolor){
                                                    return invert(this.color, {...appGlobalVarsObject._CONSTANTS.colors, threshold: 0.2});
                                                }else{
                                                    return ""
                                                }
                                            }
                                    }
                                },
                                get borderColor(){
                                    return this.textColor;
                                },
                                
                                get recordid(){
                                    if(card.calendarstransid){
                                        return d.recordid;
                                    }else{
                                        return d.axcalendarid;
                                    }
                                },
                                display: "block",
                                url: `javascript:void(0);`
                            };
                        }) || [];
                    }    
                } catch (ex) {}
                
                return returnData;
            },
            _setHtmlData(cardElement, card){                

                cardElement.find("bodyContent").replaceWith(`<div class="body-content"></div>`);
                var shadowDomEle = $(cardElement.find(".body-content"))[0];
                var shadowAtt = shadowDomEle.attachShadow({mode: 'open'});
                card.shadow = shadowAtt;
                if (card["html_editor_card"]) {
                    let cardHTML = card["html_editor_card"];
                    // cardHTML = `
                    
                    // `;


                    let objCardHTML = $(cardHTML);

                    if(objCardHTML.data("theme")){
                        cardHTML = bundleCss.map(file=>`<link rel="stylesheet" href="${file}" />`).join("") + cardHTML;
                    }

                    if(objCardHTML.data("handlebars")){
                        let sourceApiName = objCardHTML.data("sourceApiName");
                        let sourceApiType = objCardHTML.data("sourceApiType");

                        if(sourceApiName && sourceApiType == "menu"){
                            let menuData = AxGetMenus(sourceApiName);
                            // menuData = menuData.length == 1 ?  [...menuData[0]] : menuData;
                            menuData = Object.keys(menuData).length == 1 ?  menuData[Object.keys(menuData)] : menuData;

                            card.axRenderProject = thmProj;
                            card.apiData = menuData;

                            try {
                                cardHTML = Handlebars.compile(cardHTML)(card);
                            } catch (error) {
                                console.error("Card HTML Templete", "menu", error);
                            }

                            shadowAtt.innerHTML = cardHTML;
                        }else if(sourceApiName && (sourceApiType == "sql" || sourceApiType == "axpert")){
                            AxAsyncGetApiData(sourceApiName, sourceApiType, 
                                [{
                                    "id": card.axp_cardsid,
                                    "cachedata": card.cachedata,
                                    "cachedTime": String(card.cachedTime).padStart(12, '0'),
                                    "autorefresh": card.autorefresh
                                }],
                                (succ) => {
                                    var apiData = JSON.parse(succ);
                                    apiData = Object.keys(apiData).length == 1 ?  apiData[Object.keys(apiData)] : apiData;

                                    card.axRenderProject = thmProj;
                                    card.apiData = apiData;
                                    
                                    try {
                                        cardHTML = Handlebars.compile(cardHTML)(card);
                                    } catch (error) {
                                        console.error("Card HTML Templete", sourceApiType, error);
                                    }

                                    shadowAtt.innerHTML = cardHTML;
                                },
                                (err) => {
                                }
                            );
                        }
                    }
                    else                    
                    {
                        shadowAtt.innerHTML = cardHTML;                        
                    }
                    
                    // shadowAtt.innerHTML = card["html_editor_card"];
                    // shadowAtt.appendChild($(`<template>${card["html_editor_card"]}</template>`)[0].content )

                    // for executing javascript
                    // $(card["html_editor_card"]).toArray().filter((domElm) => {
                    //     return domElm.tagName?.toLowerCase() == "script"
                    // }).forEach((domElm) => {
                    //     var scriptWrapper = document.createElement( 'script-wrapper' )
                    //     var script = document.createElement( 'script' )
                    //     script.textContent = domElm?.text || "";
                    //     scriptWrapper.appendChild(script);
                    //     shadowAtt.appendChild(scriptWrapper);
                    // });
                }  
            },
            _getDateAndFormatBasedOnCulture(dateStr) {
                if (dateStr != "") {
                    dateStr = dateStr.split(" ")[0];
                    if (glCulture == "en-us") {
                        var splittedDate = dateStr.split("/");
                        if (splittedDate.length > 2) {
                            dateStr = splittedDate[1] + "/" + splittedDate[0] + "/" + splittedDate[2];
                        }
                    }
                }
                return {date: dateStr, format: (glCulture == "en-us" ? "MM/DD/YYYY" : "DD/MM/YYYY")};
            },
            _SetAxFontCondition(thisFld, applyStyle) {
                let _this = this;
                if (applyStyle != "") {
                    _this._ResetAxFont(thisFld);
                    applyStyle = applyStyle.split(',');
                    for (var y = 0; y < applyStyle.length; y++) {
                        var currentStyle = applyStyle[y].split('=');
                        switch (currentStyle[0].toLowerCase()) {
                            case "fontname":
                                thisFld.css("font-family", currentStyle[1]);
                                break;
                            case "fontsize":
                                thisFld.css("font-size", currentStyle[1] + "pt");
                                break;
                            case "fontstyle":
                                for (var z = 0; z < currentStyle[1].toLowerCase().length; z++) {
                                    switch (currentStyle[1].toLowerCase()[z]) {
                                        case "b":
                                            thisFld.css('font-weight', 'bold');
                                            break;
                                        case "i":
                                            thisFld.css('font-style', 'italic');
                                            break;
                                        case "u":
                                            if (thisFld.css("text-decoration") == "line-through") {
                                                thisFld.css("text-decoration", "line-through underline");
                                            } else {
                                                thisFld.css("text-decoration", "underline");
                                            }
                                            break;
                                        case "s":
                                            if (thisFld.css("text-decoration") == "underline") {
                                                thisFld.css("text-decoration", "underline line-through");
                                            } else {
                                                thisFld.css("text-decoration", "line-through");
                                            }
                                            break;
                                    }
                                }
                                break;
                            case "fontcolor":
                                if (AxClColors[currentStyle[1]]) {
                                    thisFld.css("color", AxClColors[currentStyle[1]]);
                                } else if (currentStyle[1].indexOf("#") == 0) {
                                    thisFld.css("color", currentStyle[1]);
                                } else {
                                    thisFld.css("color", currentStyle[1]);
                                }
                                break;
                            case "backcolor":
                                if (AxClColors[currentStyle[1]]) {
                                    thisFld.css("background", AxClColors[currentStyle[1]]);
                                } else if (currentStyle[1].indexOf("#") == 0) {
                                    thisFld.css("background", currentStyle[1]);
                                } else {
                                    thisFld.css("background", currentStyle[1]);
                                }
                                break;
                            default:
                                thisFld.css(currentStyle[0], currentStyle[1]);
                                break;
                        }
                    }
                } else {
                    _this._ResetAxFont(thisFld);
                }
                return thisFld;
            },
            _ResetAxFont(thisFld) {
                let _this = this;
                thisFld.css("font-family", "");
                thisFld.css('font-weight', "");
                thisFld.css('font-style', "");
                thisFld.css("text-decoration", "");
                thisFld.css("color", "");
                thisFld.css("background", "");
            },
            _getSetCardWidth(elem, card, defaultVal, returnValue = false) {
                let _this = this;
                let cardWidth = "";
                //cardWidth = _this._getChartJsonProps(card, "width").toString();
                cardWidth = card["width"] || $(elem)[0].className;
                if (!cardWidth) {
                    if (defaultVal) {
                        cardWidth = defaultVal.toString();
                    }
                }
                if (cardWidth) {
                    cardWidth = cardWidth.split(" ").filter(col => col.indexOf("col-") == 0).reverse().join(" ").toString();
                    if (cardWidth.indexOf("col-") == 0 || !isNaN(+cardWidth)) {
                        if (cardWidth.indexOf("col-") == 0) {
                            cardWidth = cardWidth.split("-")[cardWidth.split("-").length - 1];
                        }

                        if (!cardWidth) {
                            if (defaultVal) {
                                cardWidth = defaultVal.toString();
                            }
                        }

                        if (cardWidth) {
                            if(returnValue){
                                return +cardWidth;
                            }

                            elem.removeClass(function (index, className) {
                                return (className.match (/(^|\s)col-\S+/g) || []).join(' ');
                            });

                            elem.addClass(`col-lg-${cardWidth} col-md-${cardWidth} col-sm-12 col-xs-12`);   

                            if(cardWidth == "12" && (heightControl = elem.find(".heightControl")) && heightControl.length > 0 && (setHeight = heightControl.data("height"))){
                                heightControl.css({
                                    "height": `${setHeight}`
                                });

                                heightControl.removeClass(heightControl.attr("class").split(" ").filter(className => className.startsWith("h-") || className.startsWith("mh-") || className.startsWith("min-h-")).join(" "));


                            }
                        }else if(returnValue){
                            return +cardWidth;
                        }
                    } else {
                        cardWidth = "";

                        if(returnValue){
                            return +cardWidth;
                        }
                    }
                }else if(returnValue){
                    return +cardWidth;
                }
                // return cardWidth;
                if (cardWidth !== "") {
                    cardWidth = +cardWidth;
                    if (_this.currentColumnWidth + cardWidth > _this.options.totalColumns || cardWidth >= _this.options.totalColumns) {
                        if (_this.currentColumnWidth + cardWidth > _this.options.totalColumns) {
                            _this.currentColumnWidth = cardWidth;
                        }
                        else {
                            _this.currentColumnWidth = 0;
                        }
                        return true;
                    }
                    else {
                        _this.currentColumnWidth += cardWidth;
                        return false;
                    }
                }
            },
            _getSetCardHeight(elem, card, defaultVal) {
                let _this = this;
                let cardHeight = "";
                //cardHeight = _this._getChartJsonProps(card, "height");
                cardHeight = card["height"];
                if (!cardHeight) {
                    if (defaultVal) {
                        cardHeight = defaultVal;
                    }
                }
                if (cardHeight) {
                    cardHeight = cardHeight.toString();
                    if (cardHeight.indexOf("px") == cardHeight.length - 2) {
                        // elem.removeClass(function (index, className) {
                        //     return (className.match (/(^|\s)col-\S+/g) || []).join(' ');
                        // });
                        let cardHeightRaw = cardHeight.substring(0, cardHeight.length - 2);

                        cardHeight = cardHeightRaw + "px";

                        if (cardHeight != "0px" && +cardHeightRaw > -1) {
                            elem.data("height", cardHeight);
                        }
                        //elem.addClass(`col-lg-${cardHeight} col-md-${cardHeight} col-sm-${cardHeight} col-xs-${cardHeight}`);
                    } else {
                        cardHeight = "";
                    }
                } else {
                    cardHeight = "";
                }
                // return cardWidth;
            },
            _getChartJsonProps(card, prop) {
                if (card["chartjson"] && card["chartjson"] != "*")
                {
                    let chartJsonProps = {};
                    if (typeof card["chartjson"] == "string") {
                        try {
                            chartJsonProps = JSON.parse(card["chartjson"]);
                        } catch (ex) {}
                    } else {
                        chartJsonProps = card["chartjson"];
                    }

                    if (typeof prop != "undefined") {
                        if (typeof _.get(chartJsonProps, prop) != "undefined") {
                            return _.get(chartJsonProps, prop);
                        } else {
                            return "";
                        }
                    } else {
                        return chartJsonProps;
                    }

                } else {
                    return "";
                }
            },
            _cardsWidthPostProcessor(cardsStage){
                let _this = this;
                if(!_this.options.enableMasonry){
                    cardsStage.children(":not(.row)").wrapAll(`<div class="row" />`);

                    cardsStage.children().toArray().forEach(row => {
                        const totalChildWidth =  $(row).children().toArray().reduce((totalWidth, card) => {
                            return _this._getSetCardWidth($(card), "", "", true) + totalWidth;
                        }, 0) || 0;

                        if(totalChildWidth < 12){
                            const lastCard = $(row).children(":last")[0];

                            const newLastColumnWidth = _this._getSetCardWidth($(lastCard), "", "", true) + (12 - totalChildWidth);

                            _this._getSetCardWidth($(lastCard), {"width": `col-${newLastColumnWidth}`});
                        }
                    });
                }
            },
            _registerPlugins() {
                let _this = this;

                KTMenu && KTMenu.init();

                $(_this.options.staging.cardsFrame.cardsDesigner).sortable({
                    cursor: "move",
                    update: function (event, ui) {
                        _this.options.designChanged = true;
                    },
                });
                $(`${_this.options.staging.cardsFrame.cardsDesigner} li input:checkbox`).off("change.design").on("change.design", () => {
                    _this.options.designChanged = true;
                });

                $(window).off("resize.cards").on("resize.cards", (e) => {
                    // debugger;
                    $(".widgetWrapper.chartWrapper .highcharts-container").each((ind, elem) => {
                        try {
                            let chartObj = Highcharts.charts[$(elem).parent(".card-body").data("highchartsChart")];
                            setTimeout(() => {
                                chartObj.reflow();
                            }, 1000);
                        } catch (ex) { }
                    });
                    $(".widgetWrapper.listWrapper table.dataTable").each((ind, elem) => {
                        try {
                            setTimeout(() => {
                                $(elem).css("display", "");
                                $(elem).css({ "height": ($(elem).parents(".card-body").height()) + "px", "overflow": "auto", "display": "block" });
                            }, 0);
                        } catch (ex) { }
                    });
                    $(".widgetWrapper.calendarWrapper").each((ind, elem) => {
                        try {
                            let calendarObj = _this.options.cards[$(elem).data("cardIndex")].obj;
                            setTimeout(() => {
                                calendarObj.render();
                            }, 1000);
                        } catch (ex) { }
                    });
                });

                //ppn $(".cardsPageWrapper").on("resize", function(e) {
                //     e;
                //     this;
                //     debugger;
                // });

                if (_this.options.enableMasonry) {
                    setTimeout(() => {
                        if ($(_this.options.staging.cardsFrame.cardsDiv).data("masonry")) {
                            $(_this.options.staging.cardsFrame.cardsDiv).masonry('destroy');
                        }
                        $(_this.options.staging.cardsFrame.div + " " + _this.options.staging.cardsFrame.cardsDiv)
                            .masonry({
                                itemSelector: '.widgetWrapper',
                                columnWidth: '.grid-sizer',
                                percentPosition: true
                            });
                    }, 0);
                }
            },
            _getClearFix() {
                return `<div class="clearfix"></div>`;
            }
        }


        /* Searchbar - Function ================================================================================================
        *  You can manage the search bar
        *
        */

        search = {
            activate: function (options) {
                var _this = this;
                _this.options = options;

                KTLayoutSearch.getData = _this.getAjaxData;
                $(_this.options.staging.divParent).find(_this.options.staging.options.startsWith.div).attr("title", _this.options.staging.options.startsWith.title).text(_this.options.staging.options.startsWith.title);
                $(_this.options.staging.divParent).find(_this.options.staging.div).attr("placeholder", this.options.staging.placeholder);
            },
            searchModeContains: function (contains = true) {
                var _this = this;
                if (contains) {
                    GlobalSrchCondition = 'Contains';
                } else {
                    GlobalSrchCondition = 'StartsWith';
                }
                var searchElem = $(_this.options.staging.div)
                searchElem.val() && searchElem.val().length > 1 && searchElem.focus().autocomplete("search", searchElem.val());
            },
            hideKTSearch(){
                var _this = this;

                _this.searchObj.hide();
            },
            getAjaxData(searchObj){
                var _this = $.axpertUI.search;

                _this.searchObj = searchObj;
                var txtInput = searchObj.getQuery() || "";
                var gbSearch = [];
                var srchResult = "";

                $.ajax({
                    url: 'mainnew.aspx/getGlobalSearchData',
                    type: 'POST',
                    cache: false,
                    async: true,
                    data: JSON.stringify({ keyword: txtInput, cond: GlobalSrchCondition }),
                    dataType: 'json',
                    contentType: "application/json",
                    success: function (data) {
                        gloSrchPageNo = 0;
                        if (data.d.indexOf("*♦*") != -1) {
                            var srchData = data.d.split("*♦*");
                            gloSrchLimit = srchData[0];
                            console.log("GlobalSearch RowCount-" + srchData[0]);
                            if (srchData.length > 1)
                                srchResult = srchData[1];
                        }
                        else
                            srchResult = data.d;
                        if (srchResult == "Session Expired")
                            window.location = "../aspx/sess.aspx";


                        if (srchResult != "getting exception in code" && srchResult != "")
                            tblSearchData = $.parseJSON(srchResult);
                        else {
                            tblSearchData = [];
                        }

                        gbSearch = GetGLoSrchItems(tblSearchData) || [];

                        if (gbSearch.length != 0) {
                            _this.processAjaxData($.map(gbSearch.slice(0, 100), function (item) {
                                var itemDts = item.split('♣');
                                return {
                                    label: itemDts[0],
                                    link: itemDts[1]
                                }
                            }) || [], searchObj)
                        }
                        else {
                            _this.processAjaxData([], searchObj);
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        _this.processAjaxData([], searchObj);
                    }
                });
            },
            processAjaxData(datas, searchObj){
                var _this = this;

                $(searchObj.resultsElement).find("div:first").empty();

                if(datas.length > 0){

                    datas.forEach(data=>{
                        var searchType = data.link.split('♦')[0];
                        let tsivName=data.link.split('♦')[1];
                        let srcDtls = tsivName.split('*♠*');
                        var toolTip = data.label;
                        itemText = toolTip;
                        
        
                        if (itemText.length > 100)
                            itemText = itemText.substr(0, 100) + "...";

                        itemText = CheckSpCharsForXml(itemText);
                        searchType = searchType.toLowerCase();
                        var tsLvLoad=false;
                        var icon = "";
                        if (searchType == "iview" || searchType == "iviewinteractive") {
                            icon = "view_list";
                        } else if (searchType == "tstruct") {
                            if(typeof appGlobalVarsObject._CONSTANTS.search.listviewLoadSearch!="undefined" && appGlobalVarsObject._CONSTANTS.search.listviewLoadSearch.length > 0){
                                var listviewLoadSearch= appGlobalVarsObject._CONSTANTS.search.listviewLoadSearch;
                                if(openListviewSearchConf = listviewLoadSearch.filter(list => list.structname == srcDtls[0])?.[0]){                                   
                                }else if(openListviewSearchConf = listviewLoadSearch.filter(list => list.structname == "ALL Forms")?.[0]){
                                }
                                    if(openListviewSearchConf?.propsval == "true")
                                       tsLvLoad=true;
                            }
                            if(tsLvLoad)
                                icon="format_list_bulleted";
                            else
                                icon = "assignment";                            
                        } else if (searchType == "page" || searchType == "htmlpages" || searchType == "standardpage") {
                            icon = "insert_drive_file";
                        } else if (searchType == "help") {
                            icon = "live_help";
                        }
                        else {
                            icon = "search";
                        }
                        if(tsLvLoad){
                            searchType="listview";
                            var qstr ="";
                            if(srcDtls[1]!="null" && srcDtls[1]!="")
                                qstr= GetGloSrchQueryString(srcDtls[1]);
                            loadurl = `iview.aspx?ivname=${srcDtls[0]}&tstcaption=${(itemText || srcDtls[0])+qstr}`;
                        }
                        else
                            var loadurl = searchLoadIframe(searchType, data.link.split('♦')[1], true);
                        if (loadurl != "") {
                            if(loadurl.startsWith("help.aspx")){
                                loadurl = `javascript:window.open(\"${loadurl}\", \"_blank\");`;
                            }
                            else {
                                loadurl = `javascript:LoadIframe(\"${loadurl}\");`;
                            }
                        }

                        $(searchObj.resultsElement).find("div:first").append(`
                        <a href='javascript:void(0);' class="d-flex text-dark text-hover-primary align-items-center mb-5" title="${toolTip}" onclick='$.axpertUI.search.hideKTSearch();${loadurl}'>
                            <div class="symbol symbol-40px me-4">
                                <span class="symbol-label bg-light">
                                    <span class="material-icons material-icons-style material-icons-2 material-icons-primary">${icon}</span>
                                </span>
                            </div>
                            <div class="d-flex flex-column justify-content-start fw-bold">
                                <span class="fs-6 fw-bold">${itemText}</span>
                                <span class="fs-7 fw-bold text-muted">
                                ${function(searchType){
                                    switch(searchType){
                                        case "iview":
                                            return "Report";
                                        case "listview":
                                            return "ListView";
                                        case "tstruct":
                                            return "Form";
                                        default:
                                            return searchType;
                                    }
                                }(searchType)}
                                </span>
                            </div>
                        </a>
                        `);
                    });
                }
                else{
                    KTEventHandler.trigger(searchObj.element, 'kt.search.clear', searchObj);
                }
            }
        }
        //==========================================================================================================================

        /* Navbar - Function =======================================================================================================
        *  You can manage the navbar
        *
        */
        navbar = {
            activate: function () {
                var $body = $('body');
                var $overlay = $('.overlay');
                var $navbarCollapse = $('.navbar-collapse');
                //Open left sidebar panel
                $('.bars').on('click', function () {
                    if ($.axpertUI.options.cardsPage.setCards && $($.axpertUI.options.cardsPage.staging.cardsFrame.div).is(":visible")) {
                        setTimeout(() => {
                            $(window).trigger("resize.cards");
                        }, 0);
                    }

                });

                //Close collapse bar on click event
                $('.nav [data-close="true"]').on('click', function () {
                    if ($('.navbar-toggle').is(':visible')) {
                        $navbarCollapse.slideUp(function () {
                            $navbarCollapse.removeClass('in').removeAttr('style');
                        });
                    }
                });
            }
        }
        //==========================================================================================================================

        /* Input - Function ========================================================================================================
        *  You can manage the inputs(also textareas) with name of class 'form-control'
        *
        */
        input = {
            activate: function ($parentSelector) {
                $parentSelector = $parentSelector || $('body');

                //On focus event
                $parentSelector.find('.form-control').focus(function () {
                    $(this).closest('.form-line').addClass('focused');
                });

                //On focusout event
                $parentSelector.find('.form-control').focusout(function () {
                    var $this = $(this);
                    if ($this.parents('.form-group').hasClass('form-float')) {
                        if ($this.val() == '') { $this.parents('.form-line').removeClass('focused'); }
                    }
                    else {
                        $this.parents('.form-line').removeClass('focused');
                    }
                });

                //On label click
                $parentSelector.on('click', '.form-float .form-line .form-label', function () {
                    $(this).parent().find('input').focus();
                });

                //Not blank form
                $parentSelector.find('.form-control').each(function () {
                    if ($(this).val() !== '') {
                        $(this).parents('.form-line').addClass('focused');
                    }
                });
            }
        }
        //==========================================================================================================================

        /* Form - Select - Function ================================================================================================
        *  You can manage the 'select' of form elements
        *
        */
        select = {
            activate: function () {
                if ($.fn.selectpicker) { $('select:not(.ms)').selectpicker(); }
            }
        }
        //==========================================================================================================================

        /* DropdownMenu - Function =================================================================================================
        *  You can manage the dropdown menu
        *
        */

        dropdownMenu = {
            activate: function () {
                var _this = this;
            },
            dropdownEffect: function (target) {
                var effectIn = $.axpertUI.options.dropdownMenu.effectIn, effectOut = $.axpertUI.options.dropdownMenu.effectOut;
                var dropdown = $(target), dropdownMenu = $('.dropdown-menu', target);

                if (dropdown.length > 0) {
                    var udEffectIn = dropdown.data('effect-in');
                    var udEffectOut = dropdown.data('effect-out');
                    if (udEffectIn !== undefined) { effectIn = udEffectIn; }
                    if (udEffectOut !== undefined) { effectOut = udEffectOut; }
                }

                return {
                    target: target,
                    dropdown: dropdown,
                    dropdownMenu: dropdownMenu,
                    effectIn: effectIn,
                    effectOut: effectOut
                };
            },
            dropdownEffectStart: function (data, effectToStart) {
                if (effectToStart) {
                    data.dropdown.addClass('dropdown-animating');
                    data.dropdownMenu.addClass('animated dropdown-animated');
                    data.dropdownMenu.addClass(effectToStart);
                }
            },
            dropdownEffectEnd: function (data, callback) {
                var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
                data.dropdown.one(animationEnd, function () {
                    data.dropdown.removeClass('dropdown-animating');
                    data.dropdownMenu.removeClass('animated dropdown-animated');
                    data.dropdownMenu.removeClass(data.effectIn);
                    data.dropdownMenu.removeClass(data.effectOut);

                    if (typeof callback == 'function') {
                        callback();
                    }
                });
            }
        }

        tooltipsPopovers = {
            activate: function () {
                //Tooltip
                $('[data-toggle="tooltip"]').tooltip({
                    container: 'body'
                });

                //Popover
                $('[data-toggle="popover"]').popover()
                .on('shown.bs.modal', ()=>{
                    alert();
                });
            }
        }



        //==========================================================================================================================

        /* Browser - Function ======================================================================================================
        *  You can manage browser
        *
        */

        browser = {
            activate: function (isHybrid) {
                var _this = this;
                _this.isHybrid = isHybrid;

                _this.browsers = {
                    edge: 'Microsoft Edge',
                    edgeLegacy: 'Microsoft Edge Legacy',
                    ie10: 'Internet Explorer 10',
                    ie11: 'Internet Explorer 11',
                    opera: 'Opera',
                    firefox: 'Mozilla Firefox',
                    chrome: 'Google Chrome',
                    safari: 'Safari',
                }

                var className = _this.getClassName();

                if (className !== '') $('html').addClass(className);

                typeof isiOS && isiOS ? $("body").addClass("iOS") : "";

                _this.isHybrid ? $("body").addClass("isHybrid") : "";
            },
            getBrowser: function () {
                var _this = this;
                var userAgent = navigator.userAgent.toLowerCase();

                if (/edge/i.test(userAgent)) {
                    return _this.browsers.edgeLegacy;
                } else if (/edg/i.test(userAgent)) {
                    return _this.browsers.edge;
                } else if (/rv:11/i.test(userAgent)) {
                    return _this.browsers.ie11;
                } else if (/msie 10/i.test(userAgent)) {
                    return _this.browsers.ie10;
                } else if (/opr/i.test(userAgent)) {
                    return _this.browsers.opera;
                } else if (/chrome/i.test(userAgent)) {
                    return _this.browsers.chrome;
                } else if (/firefox/i.test(userAgent)) {
                    return _this.browsers.firefox;
                } else if (!!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)) {
                    return _this.browsers.safari;
                }

                return undefined;
            },
            getClassName: function () {
                var _this = this;
                var browser = this.getBrowser();

                if (browser === _this.browsers.edge) {
                    return 'edge';
                } else if (browser === _this.browsers.edgeLegacy) {
                    return 'edgeLegacy';
                } else if (browser === _this.browsers.ie11) {
                    return 'ie11';
                } else if (browser === _this.browsers.ie10) {
                    return 'ie10';
                } else if (browser === _this.browsers.opera) {
                    return 'opera';
                } else if (browser === _this.browsers.chrome) {
                    return 'chrome';
                } else if (browser === _this.browsers.firefox) {
                    return 'firefox';
                } else if (browser === _this.browsers.safari) {
                    return 'safari';
                } else {
                    return '';
                }
            }
        }

        setUserOptions = {
            activate: function (options,compressedMode) {
                var _this = this;
                _this.options = options;
                _this.compressedMode=compressedMode;
                _this.initHeader();
                _this.initProfile();
                _this.initSettings();
                _this.initUtilities();
            },
            initHeader: function () {
                var _this = this.options.settings.axUserOptions;
                var _thisStag = this.options.staging;
                if (_this.splitIcon) {
                    $(_thisStag.splitIcon.div).attr("style", "display:" + _this.splitIcon.display);
                    $(_thisStag.splitIcon.div).find("i:first").attr("title", _thisStag.splitIcon.title);
                    $(_thisStag.splitIcon.div).find(_thisStag.splitIcon.options.horizontalSplit.div).attr("title", _thisStag.splitIcon.options.horizontalSplit.title).find("span").attr("title", _thisStag.splitIcon.options.horizontalSplit.title).text(_thisStag.splitIcon.options.horizontalSplit.title);
                    $(_thisStag.splitIcon.div).find(_thisStag.splitIcon.options.verticalSplit.div).attr("title", _thisStag.splitIcon.options.verticalSplit.title).find("span").attr("title", _thisStag.splitIcon.options.verticalSplit.title).text(_thisStag.splitIcon.options.verticalSplit.title)
                    $(_thisStag.splitIcon.div).find(_thisStag.splitIcon.options.clearSplit.div).attr("title", _thisStag.splitIcon.options.clearSplit.title).find("span").attr("title", _thisStag.splitIcon.options.clearSplit.title).text(_thisStag.splitIcon.options.clearSplit.title);
                }
                if (_this.compressedMode) {
                    $(_thisStag.uiSelector.div).attr("style", "display:" + _this.compressedMode.display);
                    $(_thisStag.uiSelector.div).find("i:first").attr("title", _thisStag.uiSelector.title);
                }

                $(_thisStag.optionsPanel.div).find("i:first").attr("title", _thisStag.optionsPanel.title);
                if (_this.LicInfo) {
                    if(_this.LicInfo.display == "none"){
                        $(_thisStag.LicInfo.div).addClass("d-none");
                    }else{
                        $(_thisStag.LicInfo.div).removeClass("d-none");
                    }
                    
                    $(_thisStag.LicInfo.div).find(_thisStag.LicInfo.divClick).attr("onclick", _this.LicInfo.onclick);
                    $(_thisStag.LicInfo.div).find(_thisStag.LicInfo.divTitle).attr("title", _this.LicInfo.title);
                }
            },
            initProfile: function () {
                var _this = this.options.settings.axUserOptions;
                var _thisStag = this.options.staging;
                
                if (_this.AxNickName) {
                    $(_thisStag.AxNickName.div).append("<span>" + _this.AxNickName.NickName + "</span>");
                    $(_thisStag.userProfile.div).find(_thisStag.userProfile.options.userName.icon).text(_this.AxNickName.NickName.trim().charAt(0).toUpperCase());
                }

                if (_this.axAppName) {
                    $(_thisStag.AxAppLogo.web.divParent).attr("onclick", _this.axAppName.onclick).attr("title",_this.axAppName.appName);
                    $(_thisStag.AxAppLogo.mobile.divParent).attr("onclick", _this.axAppName.onclick).attr("title",_this.axAppName.appName);

                    $(_thisStag.AxAppLogo.web.divParent).find(_thisStag.AxAppLogo.web.divTitle).text(_this.axAppName.appName).addClass(_thisStag.AxAppLogo.web.showTitle ? "" : "d-none");
                    $(_thisStag.AxAppLogo.mobile.divParent).find(_thisStag.AxAppLogo.mobile.divTitle).text(_this.axAppName.appName).addClass(_thisStag.AxAppLogo.mobile.showTitle ? "" : "d-none");
                }

                if (_this.AxAppLogo){
                    $(_thisStag.AxAppLogo.web.divParent).find(_thisStag.AxAppLogo.web.div).attr("src", _this.AxAppLogo.imgSrc);
                    $(_thisStag.AxAppLogo.mobile.divParent).find(_thisStag.AxAppLogo.mobile.div).attr("src", _this.AxAppLogo.imgSrc);
                }

                if (_this.AxUserEmail) {
                    $(_thisStag.AxUserEmail.div).attr("style", "display:" + _this.AxUserEmail.display);
                    $(_thisStag.AxUserEmail.div).append("<span>" + _this.AxUserEmail.email + "</span>");
                }
                if (_thisStag.GlobalParams) {
                    $(_thisStag.GlobalParams.div).attr("style", "display:" + _thisStag.GlobalParams.display);
                    
                    $(_thisStag.GlobalParams.div).find(_thisStag.GlobalParams.divClick).attr("title", _thisStag.GlobalParams.title);

                    let gloParamsHTML = $(_thisStag.GlobalParams.divData).html().trim();

                    if(!gloParamsHTML){
                        gloParamsHTML = `<span class="mx-10 material-icons material-icons-style material-icons-2">edit</span>`;
                    }

                    $(_thisStag.GlobalParams.div).find(_thisStag.GlobalParams.divTitle).html(gloParamsHTML);
                }
                if (_this.GlobalParamsonclick)
                    $(_thisStag.GlobalParams.div).find(_thisStag.GlobalParams.divTitle).attr("onclick", _this.GlobalParamsonclick.onclick);
                if(_this.Refresh){
                    $(_thisStag.refreshMenu.div).attr("onclick", _this.Refresh.onclick);
                    $(_thisStag.refreshMenu.div).find("a").attr("title", _thisStag.refreshMenu.title).text(_thisStag.refreshMenu.title);
                }
                if(_this.RefreshParams){
                    $(_thisStag.refreshVarParam.div).attr("onclick", _this.RefreshParams.onclick);
                    $(_thisStag.refreshVarParam.div).find("a").attr("title", _thisStag.refreshVarParam.title).text(_thisStag.refreshVarParam.title);
                }
                if (_this.Logout){
                    $(_thisStag.Logout.div).find(_thisStag.Logout.divTitle).attr("onclick", _this.Logout.onclick).attr("title", _thisStag.Logout.title).text(_thisStag.Logout.title);
                }
            },
            initSettings: function () {
                var _this = this.options.settings.axUserOptions;
                var _thisStag = this.options.staging;
                if (_this.About) {
                    $(_thisStag.About.div).attr("onclick", _this.About.onclick);
                    $(_thisStag.About.div).attr("title", _thisStag.About.title).find("a").text(_thisStag.About.title);
                }
                if(_this.Language){
                    if(_this.Language.options.split(",").length > 1){
                        let currentLoginLanguage = gllangauge;

                        $(_thisStag.Language.div).attr("title", _thisStag.Language.title).find(_thisStag.Language.divTitle).text(_thisStag.Language.title);

                        $(_thisStag.Language.div).find(_thisStag.Language.divOptions).html(`
                            ${_this.Language.options.split(",").map(opt=>{
                                opt = opt.match(/[a-z]+/gi).map(function (word) {
                                  return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
                                }).join('');

                                let isActive = opt.toLowerCase() == currentLoginLanguage.toLowerCase();

                                if(isActive){
                                    $(_thisStag.Language.div).find(_thisStag.Language.badge).text(opt);
                                }

                                return `
                                <div class="menu-item px-3">
                                    <a href="javascript:void(0);" onclick="${_this.Language.onclick}" data-language="${opt}" class="menu-link d-flex px-5 ${isActive ? `active` : ``}">
                                        <span>
                                            ${opt}
                                        </span>
                                    </a>
                                </div>
                                `
                            }).join("")}
                        `);
                    }else{
                        $(_thisStag.Language.div).addClass("d-none");
                    }
                }
                if (_this.showLog) {
                    $(_thisStag.showLog.div).attr("style", "display:" + _this.showLog.display);
                    $(_thisStag.showLog.div).find(_thisStag.showLog.divClick).attr("onclick", _this.showLog.onclick);
                    $(_thisStag.showLog.div).attr("title", _thisStag.showLog.title).find("span:first").text(_thisStag.showLog.title);
                }

                if (_this.traceValue) {
                    if (_this.traceValue.traceVal == "True") {
                        $(_thisStag.traceValue.div).find(_thisStag.traceValue.divControl).attr("checked", "checked");
                        $(_thisStag.traceValue.div).find(_thisStag.traceValue.divspan).attr("title", _thisStag.traceValue.title.on);
                    }
                    else {
                        $(_thisStag.traceValue.div).find(_thisStag.traceValue.divControl).removeAttr("checked");
                        $(_thisStag.traceValue.div).find(_thisStag.traceValue.divspan).attr("title", _thisStag.traceValue.title.off);
                    }
                    $(_thisStag.traceValue.div).find(_thisStag.traceValue.divClick).attr("onclick", _this.traceValue.onclick);
                }

                if (_this.executionLog) {
                    $(_thisStag.executionLog.div).attr("style", "display:" + _this.executionLog.display);
                    $(_thisStag.executionLog.div).find(_thisStag.executionLog.divClick).attr("onclick", _this.executionLog.onclick);
                    $(_thisStag.executionLog.div).find(_thisStag.showLog.divClick).attr("title", _thisStag.executionLog.title).text(_thisStag.executionLog.title);
                }    
                
                if(_this.uiSelector){
                    $(_thisStag.uiSelector.div).attr("style", "display:" + _this.uiSelector.display);
                    $(_thisStag.uiSelector.div).find(_thisStag.uiSelector.divClick).attr("onclick", _this.uiSelector.onclick);
                    $(_thisStag.uiSelector.div).attr("title", _thisStag.uiSelector.title).find("span:first").text(_thisStag.uiSelector.title);
                }
                if (_this.modernUiValue) {
                    if (this.compressedMode) {
                        $(_thisStag.modernUiValue.div).find('input').prop("checked", true);
                        $(_thisStag.modernUiValue.div).find(_thisStag.modernUiValue.divSpan).attr("title", _thisStag.modernUiValue.title.on);
                    }
                    else {
                        $(_thisStag.modernUiValue.div).find('input').prop("checked", false);
                        $(_thisStag.modernUiValue.div).find(_thisStag.modernUiValue.divSpan).attr("title", _thisStag.modernUiValue.title.off);
                    }
                    $(".setting-panel").css({ "height": "calc(100vh - " + Math.round($(".tab-content").offset().top) + "px", "overflow": "auto" });
                    $($(_thisStag.modernUiValue.div).find('input')).click(function(e){
                        if(!$(_thisStag.modernUiValue.div).find('input').is(":checked"))
                        {
                            $(_thisStag.modernUiValue.div).find(_thisStag.modernUiValue.divSpan).attr("title", _thisStag.modernUiValue.title.on);
                            window[_this.modernUiValue.onclick](false);
                        }
                        else{
                            $(_thisStag.modernUiValue.div).find(_thisStag.modernUiValue.divSpan).attr("title", _thisStag.modernUiValue.title.off);
                            window[_this.modernUiValue.onclick](true);
                        }
                        setTimeout(function(){
                            $(".setting-panel").css({ "height": "calc(100vh - " + Math.round($(".tab-content").offset().top) + "px", "overflow": "auto" });
                        }, 500);
                    })
                }
                if (_this.globalsettings) {
                    $(_thisStag.globalsettings.div).attr("style", "display:" + _this.globalsettings.display);
                    $(_thisStag.globalsettings.div).attr("onclick", _this.globalsettings.onclick);
                    $(_thisStag.globalsettings.div).attr("title", _thisStag.globalsettings.title).find("span").text(_thisStag.globalsettings.title);
                }
                if(_thisStag.Adminconsole)
                {
                    $(_thisStag.Adminconsole.div).attr("style", "display:" +_this.Adminconsole.display);
                    $(_thisStag.Adminconsole.div).attr("onclick", _this.Adminconsole.onclick);

                    $(_thisStag.Adminconsole.div).find(_thisStag.Adminconsole.title.div).attr("title", _thisStag.Adminconsole.title.title).text(_thisStag.Adminconsole.title.title);

                    $(_thisStag.Adminconsole.div).find(_thisStag.Adminconsole.subTitle.div).attr("title", _thisStag.Adminconsole.subTitle.title).text(_thisStag.Adminconsole.subTitle.title);
                }
                
                if(_thisStag.developerworkbench)
                {
                    $(_thisStag.developerworkbench.div).attr("style", "display:" +_this.developerworkbench.display);
                    $(_thisStag.developerworkbench.div).attr("onclick", _this.developerworkbench.onclick);

                    $(_thisStag.developerworkbench.div).find(_thisStag.developerworkbench.title.div).attr("title", _thisStag.developerworkbench.title.title).text(_thisStag.developerworkbench.title.title);

                    $(_thisStag.developerworkbench.div).find(_thisStag.developerworkbench.subTitle.div).attr("title", _thisStag.developerworkbench.subTitle.title).text(_thisStag.developerworkbench.subTitle.title);
                }
                if(_thisStag.configurationStudio)
                {
                    $(_thisStag.configurationStudio.div).attr("style", "display:" +_this.configurationStudio.display);
                    $(_thisStag.configurationStudio.div).attr("onclick", _this.configurationStudio.onclick);

                    $(_thisStag.configurationStudio.div).find(_thisStag.configurationStudio.title.div).attr("title", _thisStag.configurationStudio.title.title).text(_thisStag.configurationStudio.title.title);

                    $(_thisStag.configurationStudio.div).find(_thisStag.configurationStudio.subTitle.div).attr("title", _thisStag.configurationStudio.subTitle.title).text(_thisStag.configurationStudio.subTitle.title);
                }
                if (_this.AppConfig) {
                    $(_thisStag.AppConfig.div).attr("style", "display:" + _this.AppConfig.display);
                    $(_thisStag.AppConfig.div).attr("onclick", _this.AppConfig.onclick);
                    $(_thisStag.AppConfig.div).attr("title", _thisStag.AppConfig.title).find("span").text(_thisStag.AppConfig.title);
                }
                if (_this.ChangePassword) {
                    $(_thisStag.ChangePassword.div).attr("style", "display:" + _this.ChangePassword.display);
                    $(_thisStag.ChangePassword.div).find(_thisStag.ChangePassword.divTitle).attr("onclick", _this.ChangePassword.onclick).attr("title", _thisStag.ChangePassword.title).text(_thisStag.ChangePassword.title);
                }
                if (_this.userManual) {
                    $(_thisStag.userManual.div).attr("style", "display:" + _this.userManual.display);
                    $(_thisStag.userManual.div).attr("onclick", _this.userManual.onclick);
                    $(_thisStag.userManual.div).attr("title", _thisStag.userManual.title).find("span").text(_thisStag.userManual.title);
                }

                $(".setting-panel").css({ "height": "calc(100vh - " + Math.round($(".tab-content").offset().top) + "px", "overflow": "auto" });
            },
            initUtilities: function () {
                var _this = this.options.settings.axUserOptions;
                var _thisStag = this.options.staging;
                if (_this.qrCodeBtnWrapper) {
                    $(_thisStag.qrCodeBtnWrapper.div).attr("style", "display:" + _this.qrCodeBtnWrapper.display);
                    $(_thisStag.qrCodeBtnWrapper.div).find(_thisStag.qrCodeBtnWrapper.divTitle).attr("title", _thisStag.qrCodeBtnWrapper.title).text(_thisStag.qrCodeBtnWrapper.title);

                    let qrDiv = $(_thisStag.qrCodeBtnWrapper.div).find(_thisStag.qrCodeBtnWrapper.divPlaceholder);

                    try {
                        if(qrDiv.length > 0){
                            var qrcode = new QRCode(qrDiv[0], {
                                text: `{"spath":"${encodeURI(mainRestDllPath.slice(0, -1))}","pname":"${mainProject}","notify_URI":"${encodeURI(nodeApi.substr(0, nodeApi.length - 5))}","p_url":"${encodeURI(mainPageUrl = window.location.href.toLowerCase()) && (webUrl = mainPageUrl.substr(0, mainPageUrl.indexOf("/aspx")))}"}`,
                                width: 250,
                                height: 250,
                                colorDark: "#000000",
                                colorLight: "#ffffff",
                                correctLevel: QRCode.CorrectLevel.H
                            });
                        }
                    } catch (ex) { }
                }
                if (_this.WidgetBuilder) {
                    $(_thisStag.WidgetBuilder.div).attr("style", "display:" + _this.WidgetBuilder.display);
                    $(_thisStag.WidgetBuilder.div).attr("onclick", _this.WidgetBuilder.onclick);
                    $(_thisStag.WidgetBuilder.div).attr("title", _thisStag.WidgetBuilder.title).find("span").text(_thisStag.WidgetBuilder.title);
                }
                if (_this.pageBuilderBtn) {
                    $(_thisStag.pageBuilderBtn.div).attr("style", "display:" + _this.pageBuilderBtn.display);
                    $(_thisStag.pageBuilderBtn.div).attr("onclick", _this.pageBuilderBtn.onclick);
                    $(_thisStag.pageBuilderBtn.div).attr("title", _thisStag.pageBuilderBtn.title).find("span").text(_thisStag.pageBuilderBtn.title);
                }
                if (_this.Dashboard) {
                    $(_thisStag.Dashboard.div).attr("style", "display:" + _this.Dashboard.display);
                    $(_thisStag.Dashboard.div).attr("onclick", _this.Dashboard.onclick);
                    $(_thisStag.Dashboard.div).attr("title", _thisStag.Dashboard.title).find("span").text(_thisStag.Dashboard.title);
                }
                if (_this.Responsibilities) {
                    $(_thisStag.Responsibilities.div).attr("style", "display:" + _this.Responsibilities.display);
                    $(_thisStag.Responsibilities.div).attr("onclick", _this.Responsibilities.onclick);
                    $(_thisStag.Responsibilities.div).attr("title", _thisStag.Responsibilities.title).find("span").text(_thisStag.Responsibilities.title);
                }
                if (_this.ExportData) {
                    $(_thisStag.ExportData.div).attr("style", "display:" + _this.ExportData.display);
                    $(_thisStag.ExportData.div).attr("onclick", _this.ExportData.onclick);
                    $(_thisStag.ExportData.div).find(_thisStag.ExportData.title.div).attr("title", _thisStag.ExportData.title.title).text(_thisStag.ExportData.title.title);

                    $(_thisStag.ExportData.div).find(_thisStag.ExportData.subTitle.div).attr("title", _thisStag.ExportData.subTitle.title).text(_thisStag.ExportData.subTitle.title);
                }
                if (_this.ImportData) {
                    $(_thisStag.ImportData.div).attr("style", "display:" + _this.ImportData.display);
                    $(_thisStag.ImportData.div).attr("onclick", _this.ImportData.onclick);
                    $(_thisStag.ImportData.div).find(_thisStag.ImportData.title.div).attr("title", _thisStag.ImportData.title.title).text(_thisStag.ImportData.title.title);

                    $(_thisStag.ImportData.div).find(_thisStag.ImportData.subTitle.div).attr("title", _thisStag.ImportData.subTitle.title).text(_thisStag.ImportData.subTitle.title);
                }
                if (_this.ImportHistory) {
                    $(_thisStag.ImportHistory.div).attr("style", "display:" + _this.ImportHistory.display);
                    $(_thisStag.ImportHistory.div).attr("onclick", _this.ImportHistory.onclick);
                    $(_thisStag.ImportHistory.div).attr("title", _thisStag.ImportHistory.title).find("span").text(_thisStag.ImportHistory.title);
                }
                if (_this.WorkFlow) {
                    $(_thisStag.WorkFlow.div).attr("style", "display:" + _this.WorkFlow.display);
                    $(_thisStag.WorkFlow.div).attr("onclick", _this.WorkFlow.onclick);
                    $(_thisStag.WorkFlow.div).attr("title", _thisStag.WorkFlow.title).find("span").text(_thisStag.WorkFlow.title);
                }
            }
        }

        init = function (initOptions) {
            this.options = $.extend(true, {}, this.options, initOptions);

            if (!this.options.dirLeft) {
                $(".navbar-right").removeClass("navbar-right").addClass("navbar-left");
                $(".pull-right:not(.dropdown-menu)").removeClass("pull-right").addClass("pull-left");
                $("[data-placement=right").attr("data-placement", "left");
            }

            browser.activate(this.options.isHybrid);
            setUserOptions.activate(this.options.axpertUserSettings,this.options.compressedMode);
            leftSideBar.activate(this.options.leftSideBar, this.options.isMobile);
            rightSideBar.activate(this.options.rightSideBar);
            cardsPage.activate(this.options.cardsPage);
            notificationbar.activate(this.options.notificationbar);
            navbar.activate();
            dropdownMenu.activate();
            input.activate();
            select.activate();
            search.activate(this.options.search);
            tooltipsPopovers.activate();
            $(this.options.navigation.backButton.div).hide();

            setTimeout(() => {
                
                $(this.options.loader.div).addClass(this.options.loader.outAnimationClass);
                setTimeout(() => {
                    $(this.options.loader.textDiv).addClass("d-none");
                    $(this.options.loader.parent).removeClass(this.options.loader.parent.substr(1)).removeClass(this.options.loader.stayClass);
                    $(this.options.loader.div).removeClass(this.options.loader.outAnimationClass).addClass(this.options.loader.radialGradientClass);
                    $(this.options.loader.subDiv).addClass(this.options.loader.loaderWrapClass);
                }, 0);
                
            }, 50);

            return this.options;
        }
        //==========================================================================================================================
        return { options, leftSideBar, rightSideBar, cardsPage, notificationbar, search, navbar, input, select, dropdownMenu, browser, init }
    }
    $.axpertUI = new axpertUI();
})(jQuery, window);



$(function () {
    if (window.location.href.indexOf(".html") > -1) {
        $.axpertUI.init({
            leftSideBar: {
                menuConfiguration: {
                    menuJson: menuJsonData,
                    staging: {
                        div: "#leftsidebar .menu ul.list"
                    },
                    menuTemplete: {
                    }
                }
            }
        });
    }
});
