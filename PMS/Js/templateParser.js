/////////////////////////
// By MANIKANTA        //
// Believe in yourself //
/////////////////////////


(function($) {

    // function initializeTheTemplate (templateObj) {

    // }

    let imagePath = "../images/builder/";

    let animationSetTimeout;
    let defaultTitleHtmlLayout = "#TITLE_ICON# #TITLE_NAME#";

    function getPanelHtml({
        templateObj,
        idx,
        type,
        title,
        target,
        isFirstTime = "",
        scenaRio,
        targetType = { t: "", tg: "" },
        isExpanding = false,
        calledFrom,
        isMyPage,
        isWidgetHidden = false,
        liveWidgetId = "",
        isRefreshableWidget = false,
        paginationButtons = false,//new
        flipCard = false,//iview//new
        widgetSearch = false,
        breadCrumb = false,//new
        hid,
        }) {
        var totalCards = templateObj.cc || 1;
    totalCards = parseInt(totalCards);
    let { repeatLastWidget } = templateObj
    idx = idx + 1;
    let templateIdx = idx;
    if (repeatLastWidget) {
        if (templateIdx > totalCards) {
            templateIdx = totalCards;
        }
    } else {
        while (templateIdx > totalCards) {
            templateIdx = templateIdx - totalCards;
        }
    }
    var presCardTemplate = templateObj.cf[templateIdx - 1];
    var heightOfCard = presCardTemplate.ht || "300px";
    var widthOfTheCard = presCardTemplate.wd || "m3 l3"
    var brRadius = presCardTemplate.br || "4px";
    var ttrPosition = presCardTemplate.tr.p || "top";
    var menuStyle = presCardTemplate.ms || "classic";

    // menuStyle = "modern";


    var finalHtml = "";
    var iconClass = "icon-paper-plane";
    var statusIndicatorIcon = "";
    var statusIndicatorColorClass = "";
    var toolTip = "";
    var statusIndicator = "";
    var classToAdd = "";
    var cardClickClass = "";
    if (presBuiildMode === "homeBuild") {
        iconClass = _getDefaultIcons(type);
        var { statusIndicatorIcon, statusIndicatorColorClass, toolTip, statusIndicator } = _getStatusIndicator(scenaRio); //es6
    } else if (presBuiildMode === "homeRun") {
        cardClickClass = "cardClick";
        if (type != "widget" && type != "Custom__mytsk")
            classToAdd = "pointerMe";
    }

    if ((isRefreshableWidget || paginationButtons || flipCard || widgetSearch) && !enableSlick) {
        classToAdd += " showButtonsOnHover";
    }


    var menuTargetType = "";
    var menuTarget = "";
    var showMenu = false;
    var htmlToReturn = "";


    // var contentHtml = "";

    //htmlToReturn += '<div data-widthclass = "' + widthOfTheCard + '" data-cardidx =' + (idx - 1) + ' id="' + target + 'Wrapper" data-target="' + target + '" data-type="' + type + '" class="col ' + widthOfTheCard + ' ' + isFirstTime + " " + classToAdd + ' ui-state-default">';
    htmlToReturn += '<div data-widthclass = "' + widthOfTheCard + '" data-cardidx =' + (idx - 1) + ' id="' + target + 'Wrapper" data-target="' + target + '" data-type="' + type + '" class="col ' + (widthOfTheCard.indexOf("s") > -1 ? "" : " s12 ") + widthOfTheCard + ' ' + isFirstTime + " " + classToAdd + ' ui-state-default">';
    htmlToReturn += `<div style="border-radius:${brRadius};" class="card hoverable ${isWidgetHidden ? "hidden" : ""} ${(enableSlick ? "enableSlick" : "")} widgetStatus-${statusIndicatorColorClass}">`;

    if (!liveWidgetId) {
        if (menuStyle === "modern") {
            htmlToReturn += '<button class="modernCardMenu waves-effect waves-light btn-flat"><span class="icon-ellipsis"></span></button>';
        }
        if (presBuiildMode === "homeBuild") {
            //in homebuild if is my tab then instead of delete button need to show view hide button
            if (isMyPage) {
                htmlToReturn += '<div class="hideTheWidget"></div>'
                htmlToReturn += `<button type="button" title="${isWidgetHidden ? "Show Widget" : "Hide Widget"}" class="cardTitleClear widgetFloatingBtn saveHideBtn red waves-effect btn-floating right"><i class="${isWidgetHidden ? "icon-eye-crossed" : "icon-eye"}"></i></button>`;
            } else {
                htmlToReturn += '<button type="button" title="Delete Widget" class="cardTitleClear widgetFloatingBtn titleLessCardTitleClear  red waves-effect btn-floating right"><i class="icon-cross2"></i></button>';
                htmlToReturn += '<span class="widgetStatusIndicator">' + statusIndicator + '</span>';
            }



        } else if (presBuiildMode === "homeRun") {
            if (isExpanding && !enableSlick) {
                htmlToReturn += '<button title="Expand" type="button" onclick="zoomInTheWidget(\'' + target + 'Wrapper\',\'' + isExpanding + '\');" class="cardTitleClear titleLessCardTitleClear  red waves-effect btn-floating right"><i class="icon-expand"></i></button>';
            }


            //footer buttons section ~start
                
            let footerBtnsHTML = "";

            if (isRefreshableWidget && !enableSlick) {
                let onclickAction = `ajaxCallObj.getAxpertWidgetDetails({ tId:'${target}', widgetId:${target.substr(6)}, refreshWidget:true, cacheWidget:true, calledFrom:'refreshWidget',wgHid:'${hid}'})`;
                if (type === "Custom__sql" || type==="Custom__mytsk") {
                    onclickAction = `ajaxCallObj.fireMySql('', '${target}Wrapper','','refreshWidget','${hid}');`;
                }
                else if(type==="iview")
                    onclickAction=`ajaxCallObj.getIviewDataNew({ target:'${target}',calledFrom:'refreshWidget',customParams:'',isPagination:false,page:'undefined',ivHid:'${hid}' });`;

                footerBtnsHTML += `
                                <button title="Refresh Widget" onclick="${onclickAction}" class="hoverButton waves-effect waves-light btn-flat">
                                    <i class="icon-refresh"></i>
                                </button>
                            `;
            } 

                
            if (flipCard && !enableSlick) {
                footerBtnsHTML += `
                                <button title="Filters" onclick="flipAndshowFlitersInWidget({target:'${target}'})" class="hoverButton  waves-effect flipNShowParams waves-light btn">
                                    <i class="icon-funnel"></i>
                                </button>
                            `;
            }

            if (widgetSearch) {
                footerBtnsHTML += `
                                <button title="Search" onclick="createInlineWidgetSearch({target:'${target}'})" class="hoverButton  waves-effect waves-light btn">
                                    <i class="icon-magnifier"></i>
                                </button>
                            `;
            }

            if (paginationButtons) {

                //footerBtnsHTML += `<div class="prevNextBtnWrapper">
                //                <button title="Previous" onclick="ajaxCallObj.getIviewDataNew({target:'${target}', isPagination:true,page:'prev'})" class="hoverButton prevButton waves-effect waves-light btn">
                //                    <i class="icon-chevron-left"></i>
                //                </button>
                //                <button title="Next" onclick="ajaxCallObj.getIviewDataNew({target:'${target}', isPagination:true,page:'next'})" class="hoverButton nextButton waves-effect waves-light btn">
                //                    <i class="icon-chevron-right"></i>
                //                </button>
                //                </div>
                //            `;
                footerBtnsHTML += `<div class="prevNextBtnWrapper">
                                <button title="Previous" class="hoverButton prevButton waves-effect waves-light btn">
                                    <i class="icon-chevron-left"></i>
                                </button>
                                <button title="Next" class="hoverButton nextButton waves-effect waves-light btn">
                                    <i class="icon-chevron-right"></i>
                                </button>
                                </div>
                            `;
            }

            let showHoverButtons = true;
            if (type === "Custom__dynamic") {
                showHoverButtons = false;
            }

            htmlToReturn += `<div class="${!showHoverButtons ? 'hide' : ''} widgetFooterHoverButtons">${footerBtnsHTML}</div>`;


            //footer buttons section ~END


        }
    }
    if (liveWidgetId && isExpanding && !enableSlick) {
        htmlToReturn += '<button title="Expand" type="button" onclick="zoomInTheWidget(\'' + target + 'Wrapper\',\'' + isExpanding + '\');" class="cardTitleClear titleLessCardTitleClear  red waves-effect btn-floating right"><i class="icon-expand"></i></button>';
    }

    if (ttrPosition === "top") {
        htmlToReturn += _getTitleRegion({
            iconClass: iconClass,
            title: title,
            templateObj: presCardTemplate
        });
    }

    if (presBuiildMode === "homeRun" && breadCrumb) {
        htmlToReturn += `
                        <div class="widgetBreadCrumb">
                            <span class="bCrumb">cars</span>
                            <span class="bCrumb">Bike Sales</span>
                            <span class="bCrumb">Transactions</span>
                            <span class="bCrumb">Reports</span>
                            <span class="bCrumb">Iview</span>
                        </div>
                    `;
    }





    let cardContentMainWrapper = '<div style="height:' + heightOfCard + ';border-bottom-left-radius:' + brRadius + ';border-bottom-right-radius:' + brRadius + ';" class="heightOfcardContentMainWrapper cardContentMainWrapper">';


    // htmlToReturn += 

    if (liveWidgetId) {
        let url = "";
        if (type === "tstruct") {
            url = "tstruct.aspx?transid=" + liveWidgetId;
        } else if (type === "iview") {
            url = "ivtoivload.aspx?ivname=" + liveWidgetId;
        }
        cardContentMainWrapper += `<iframe id="homePageFrame${(idx - 1)}" name="middle1" frameborder="0" scrolling="no" class="" allowtransparency="True" height="100%" width="100%" src="${url}"></iframe>`;
    }


    if (type.indexOf("Custom__") !== -1) {
        menuTargetType = targetType.t;
        menuTarget = targetType.tg;
    } else {
        menuTargetType = type;
        menuTarget = targetType.tg;
    }





    if (!liveWidgetId) {

        if (menuStyle == "modern") {
            cardContentMainWrapper += _getMenuHtml({
                calledFrom: calledFrom,
                targetType: menuTargetType,
                target: menuTarget,
                menuStyle: menuStyle,
                title: title
            })
        }

        if (type == "tstruct") {

            cardContentMainWrapper += `<div class="card-image ${cardClickClass}">`;
            cardContentMainWrapper += `<img src="${imagePath}/sample.png">`;
            cardContentMainWrapper += '</div>';
            cardContentMainWrapper += `<div class="card-content ${cardClickClass} imgCard">`;
            cardContentMainWrapper += '<p>' + title + '</p>';
            cardContentMainWrapper += '</div>';

        } else if (type == "iview" || type == "widget") {
            cardContentMainWrapper += `<div class="${cardClickClass} card-content ${type}">`;
            cardContentMainWrapper += '<div class="cardContentData">';
            cardContentMainWrapper += '</div>';
            cardContentMainWrapper += '<div class="cardContentLoader valign-wrapper">';
            cardContentMainWrapper += '<div class="preloader-wrapper small active">';
            cardContentMainWrapper += '<div class="spinner-layer themeBorderColor spinner-green-only">';
            cardContentMainWrapper += '<div class="circle-clipper left">';
            cardContentMainWrapper += '<div class="circle"></div>';
            cardContentMainWrapper += '</div>';
            cardContentMainWrapper += '<div class="gap-patch">';
            cardContentMainWrapper += '<div class="circle"></div>';
            cardContentMainWrapper += '</div>';
            cardContentMainWrapper += '<div class="circle-clipper right">';
            cardContentMainWrapper += '<div class="circle"></div>';
            cardContentMainWrapper += '</div>';
            cardContentMainWrapper += '</div>';
            cardContentMainWrapper += '</div>';
            cardContentMainWrapper += '</div>';
            cardContentMainWrapper += '</div>';

        } else if (type.indexOf("Custom__") !== -1) {
            var customType = type.substring(8) // " Custom__ " is 8 letters
            if (customType == "html")
                cardContentMainWrapper += '<div class="card-content"><div class="htmlContentCard"></div>';
            else if (customType == "img")
                cardContentMainWrapper += `<div class="card-content cardClick card-image imageCard"><img src="${imagePath}/sample.png" />`; //card-image
            else if (customType == "sql")
                cardContentMainWrapper += '<div class="card-content cardClick"><div class="sqlContentCard"></div>';
            else if (customType == "mytsk")
                cardContentMainWrapper += '<div class="card-content mtskContentCard"><div class="carousel carousel-slider center corusalAdded sqlContentCard" data-indicators="true"></div>';
            else if (customType == "rss")
                cardContentMainWrapper += '<div class="card-content rssFeedCard"><div class="carousel carousel-slider center" data-indicators="true"></div>';
            else if (customType == "dynamic")
                cardContentMainWrapper += '<div class="card-content dynamicCard noScroll cardClick"><div class="dynamicContentCard"></div>';
            else
                cardContentMainWrapper += '<div class="card-content cardClick">';
            if (customType == "txt")
                cardContentMainWrapper += '<p></p>';

            cardContentMainWrapper += '</div>';
            if (customType != "rss" && customType != "mytsk" && customType != "html") {}

        }
    }


    cardContentMainWrapper += '</div>'; //cardContentMainWrapper~closing div


    if (flipCard && !enableSlick) {
        let flipCardHtml = "";
        flipCardHtml += `<div style="height:${heightOfCard};border-bottom-left-radius:${brRadius};border-bottom-right-radius:${brRadius};" class="flip-container heightOfcardContentMainWrapper" ontouchstart="this.classList.toggle('hover');">
                                <div class="flipper">
                                    <div class="flipper-front">
                                        ${cardContentMainWrapper}
                                    </div>
                                    <div class="flipper-back">
                                       
                                    </div>
                                </div> 
                            </div>`;

        htmlToReturn += flipCardHtml;

    } else {
        htmlToReturn += cardContentMainWrapper;
    }




    if (ttrPosition === "bottom") {
        htmlToReturn += _getTitleRegion({
            iconClass: iconClass,
            title: title,
            templateObj: presCardTemplate
        });
    }

    if (!liveWidgetId) {
        if (menuStyle == "classic") {
            if(type!="Custom__img")
            {
                htmlToReturn += _getMenuHtml({
                    calledFrom: calledFrom,
                    targetType: menuTargetType,
                    target: menuTarget,
                    menuStyle: menuStyle,
                    title: title
                })
            }
            else if(typeof eval(callParent('ShowImaWidActionBtn')) !="undefined" && eval(callParent('ShowImaWidActionBtn'))=="true" && type=="Custom__img")
            {
                htmlToReturn += _getMenuHtml({
                    calledFrom: calledFrom,
                    targetType: menuTargetType,
                    target: menuTarget,
                    menuStyle: menuStyle,
                    title: title
                })
            }
        }
    }

    htmlToReturn += '</div>';
    htmlToReturn += '</div>';
    return htmlToReturn;

}


function _getDefaultIcons(type) {
    var iconClass = "icon-paper-plane";
    switch (type) {
        case "tstruct":
            iconClass = "icon-register";
            break;
        case "iview":
            iconClass = "icon-clipboard-user";
            break;
        case "widget":
            iconClass = "icon-cube"
            break;
        case "Custom__html":
            iconClass = "icon-pencil5";
            break;
        case "Custom__sql":
            iconClass = "icon-cloud-database";
            break;
        case "Custom__rss":
            iconClass = "icon-wifi";
            break;
        case "Custom__txt":
            iconClass = "icon-feather3";
            break;
        case "Custom__img":
            iconClass = "icon-picture2";
            break;
        case "Custom__mytsk":
            iconClass = "icon-envelope-open";
            break;
        default:
            iconClass = "icon-paper-plane";
            break;
    }
    return iconClass;

}


function _getStatusIndicator(scenaRio) {
    /*
    save - icon-check - #8fd692 
    Saving Failed - icon-warning - #f3c241 
    Yet to be saved - icon-notification-circle - #ff9109
    Published - icon-cloud-check - #4caf50
    Private - icon-cloud-lock - #4caf50
    */

    var statusIndicatorIcon = "";
    var statusIndicatorColorClass = "";
    var toolTip = "";
    var statusIndicator = ""
    if (scenaRio) {
        switch (scenaRio) {
            case "save":
                statusIndicatorIcon = "icon-check";
                toolTip = "Widget Saved. Not published";
                break;
            case "saveFailed":
                statusIndicatorIcon = "icon-warning";
                toolTip = "Widget saving failed.";
                break;
            case "notSaved":
                statusIndicatorIcon = "icon-notification-circle";
                toolTip = "Widget not yet saved.";
                break;
            case "published":
                statusIndicatorIcon = "icon-cloud-check";
                toolTip = "Widget published.";
                break;
            case "private":
                statusIndicatorIcon = "icon-cloud-lock";
                toolTip = "Private widget published.";
                break;
        }
        statusIndicatorColorClass = scenaRio;
        statusIndicator = '<span title="' + toolTip + '" class="widgetStatusSpn widgetStatus-' + statusIndicatorColorClass + '"><i class="' + statusIndicatorIcon + '"></i></span>';
    }

    return {
        toolTip: toolTip,
        statusIndicatorIcon: statusIndicatorIcon,
        statusIndicatorColorClass: statusIndicatorColorClass,
        statusIndicator: statusIndicator
    }
}


function _getMenuHtml({
    calledFrom,
    targetType,
    target,
    menuStyle = "classic",
    title = " "
}) {
        var htmlToReturn = "";
var ulClass = "";
var liClass = "";
if (targetType !== "widget" && ((presBuiildMode === "homeBuild") || (targetType && targetType !== "none"))) {
    if (menuStyle === "classic") {
        htmlToReturn += '<div class="fixed-action-btn runtimeActionWrapper vertical click-to-toggle">';
        htmlToReturn += '<a title="Actions" class="btn-floating runtimeActionBtn halfway-fab waves-effect waves-light"> <i class="icon-plus"></i></a>';
        ulClass = "floatingBtnMenu";
        liClass = "cutsomColorbtn btn-floating waves-effect waves-light btn";
    } else {
        htmlToReturn += '<div style="display:none;" class="modernMenuBg"></div>';
        htmlToReturn += '<div style="display:none;" class="modernMenuItems">';
    }

    if (presBuiildMode === "homeRun" && targetType != "url" && targetType != "none") {
        htmlToReturn += '<ul class="' + ulClass + '">';
        if (targetType == "tstruct") {
            if(typeof localLangFile["listview"]=="undefined")
                handleLanguageSupprt();
            htmlToReturn += '<li><a onclick="performDirectAction(\'tstruct\',\'' + target.substr(1) + '\')" class="' + liClass + '"><span class="icon-pencil5"></span><span class="directAtnBtn">New</span></a></li>';
            htmlToReturn += '<li><a onclick="performDirectAction(\'listiview\',\'' + target.substr(1) + '\',\'' + title + '\')" class="' + liClass + '"><span class="icon-menu3"></span><span class="directAtnBtn">' + localLangFile.listview + '</span></a></li>';
        } else if (targetType == "iview") {
            if(typeof localLangFile["print"]=="undefined")
                handleLanguageSupprt();
            htmlToReturn += '<li><a title="' + localLangFile["print"] + '" onclick="performDirectAction(\'iview-print\',\'' + target.substr(1) + '\')" class="' + liClass + '"><span class="icon-printer"></span><span class="directAtnBtn">' + localLangFile["print"] + '</span></a></li>';
            htmlToReturn += '<li><a title="' + localLangFile["pdf"] + '" onclick="performDirectAction(\'iview-pdf\',\'' + target.substr(1) + '\')" class="' + liClass + '"><span class="icon-document"></span><span class="directAtnBtn">' + localLangFile["pdf"] + '</span></a></li>';
            htmlToReturn += '<li><a title="' + localLangFile["excel"] + '" onclick="performDirectAction(\'iview-excel\',\'' + target.substr(1) + '\')" class="' + liClass + '"><span class="icon-grid"></span><span class="directAtnBtn">' + localLangFile["excel"] + '</span></a></li>';
        }
        htmlToReturn += '</ul>';
    }
    htmlToReturn += '</div>';
}
return htmlToReturn;

}

function _getTitleRegion({
    iconClass,
    title,
    templateObj
}) {

    var cardTtlHeight = templateObj.tr.h || "35px";
    var cardTtlHtml = templateObj.tr.html || defaultTitleHtmlLayout;

    var htmlToReturn = "";
    htmlToReturn += '<div style="height:' + cardTtlHeight + '" class="cardTitleWrapper">';

        

    let replaceHTML = cardTtlHtml.replace('#TITLE_ICON#', '<i class="' + iconClass + '"></i>').replace('#TITLE_NAME#', '<span class="cardTitle" title="'+ title +'">' + title + '</span>');

    // widgetSearchProperties
    // if (widgetSearch) {
    //     replaceHTML = replaceHTML.replace('#WIDGET_SEARCH#', `<button type="button" style="padding:0;height:30px;line-height:30px;" class="waves-effect waves-light btn-flat"><i class="${searchIcon}"></i>`);
    // }else{
    //     replaceHTML = replaceHTML.replace('#WIDGET_SEARCH#', '');
    // }

    htmlToReturn += replaceHTML;

        


    // htmlToReturn += '<i class="' + iconClass + '"></i>';
    // htmlToReturn += '<span class="cardTitle">' + title + '</span>';
    htmlToReturn += '<div class="clear"></div>';
    htmlToReturn += '</div>';
    return htmlToReturn;
}


function changePanelLayout({
    templateObj,
    panel,
    toIdx
}) {
    var totalCards = templateObj.cc || 1;
    let { repeatLastWidget } = templateObj;
    let originalToIdx = toIdx;
    if (repeatLastWidget) {
        if (toIdx >= totalCards) {
            toIdx = totalCards - 1;
        }
    } else {
        while (toIdx >= totalCards) {
            toIdx = toIdx - totalCards;
        }
    }

    var presCardTemplate = templateObj.cf[toIdx];
    var heightOfCard = presCardTemplate.ht || "300px";
    var widthOfTheCard = presCardTemplate.wd || "m3 l3";
    var brRadius = presCardTemplate.br || "4px";
    panel = $(panel);
    //need to find a way to handle below props
    // const titleRgn = _getTitleRegion({iconClass:"icon-register",title:"mani",templateObj:presCardTemplate});


    var cardTtlHtml = presCardTemplate.tr.html || defaultTitleHtmlLayout;
    var oldIcon = panel.find('.cardTitleWrapper i[class^="icon-"]').attr('class');
    var oldTtl = panel.find('.cardTitleWrapper .cardTitle').text()

    var cardTtlHeight = presCardTemplate.tr.h || "35px";
    var ttrPosition = presCardTemplate.tr.p || "top";
    var menuStyle = presCardTemplate.ms || "classic";

    heightOfCard = panel.find('.card-content.titleRemoved').length != 0 ? (parseInt(heightOfCard) + parseInt(cardTtlHeight)) + "px" : heightOfCard;

    var titleHtml = cardTtlHtml.replace('#TITLE_ICON#', '<i class="' + oldIcon + '"></i>').replace('#TITLE_NAME#', '<span class="cardTitle">' + oldTtl + '</span>');
    panel.find('.cardTitleWrapper').html(titleHtml).css('height', cardTtlHeight);

    var oldClasses = panel.attr('class');
    panel.attr('class', oldClasses.replace(panel.data('widthclass'), widthOfTheCard)).data('cardidx', originalToIdx).data('widthclass', widthOfTheCard);

    panel.find('.heightOfcardContentMainWrapper').css({
        height: heightOfCard
    });
    panel.find('.hoverable').css("border-radius", brRadius);
}

function rearrangePanelsBeforeDeleteNadd({ elem, templateObj, task }) {
    elem.nextAll().each(function(index, el) {
        var presElem = $(this);
        var toIdx = task === "add" ? presElem.index() : presElem.index() - 1;
        changePanelLayout({
            templateObj: templateObj,
            panel: presElem,
            toIdx: toIdx
        });
        _changeStatusAfterDrag(presElem);
    });
}

function _changeStatusAfterDrag(elem) {
    var presElem = elem;
    var presId = presElem.attr("id");
    changeWidgetStatus("notSaved", presId);
    homeJsonObj.updateDataInJson(presId, "isU", "Y");
}


function changeToNewTemplate({templateObj,afterTemplateChange}) {
    if (animationSetTimeout) {
        clearTimeout(animationSetTimeout);
    }

    $("#hpbDsgnrcnvsWrapper").addClass('animateElements');
    const totalCards = parseInt(templateObj.cc || 1);
    let { repeatLastWidget } = templateObj;
    $("#hpbDsgnrcnvsWrapper #sortable .ui-state-default").each(function(index, el) {
        idx = index;
        if (repeatLastWidget) {
            if (idx >= totalCards) {
                idx = totalCards;
            }
        } else {
            while (idx >= totalCards) {
                idx = idx - totalCards;
            }
        }
        var presPanel = $(this);
        changePanelLayout({
            templateObj: templateObj,
            panel: presPanel,
            toIdx: idx
        })
    });

        

    // setTimeout(function() {
            
    // }, 1000)

    animationSetTimeout = setTimeout(function() {
        //since animation time is set to one for animateElements in builder.css(need to change time if css changed)
        if (typeof afterTemplateChange === "function") {
            afterTemplateChange();
        }
        $("#hpbDsgnrcnvsWrapper").removeClass('animateElements');
    }, 1100)

}


window.getPanelHtml = getPanelHtml;
window.changePanelLayout = changePanelLayout;
window.rearrangePanelsBeforeDeleteNadd = rearrangePanelsBeforeDeleteNadd;
window.changeToNewTemplate = changeToNewTemplate;

})(jQuery)



$(document).on('click', '.modernCardMenu ', function(e) {
    var presElem = $(this).parent();
    if (presElem.find('.modernMenuItems').is(':visible')) {
        presElem.find('.modernMenuBg').fadeOut();
        presElem.find('.modernMenuItems').slideUp();

    } else {
        presElem.find('.modernMenuBg').fadeIn();
        presElem.find('.modernMenuItems').slideDown();
    }

});
