$j(document).ready(function () {
    bindCustomHTMLSections();
    try {
        AxCustomAfterPageLoad();
    }
    catch (ex) { }
});

function bindCustomHTMLSections() {
    for (var dataIndex = 0; dataIndex < $(targetIds).length; dataIndex++) {
        // if (enumerateSections[dataIndex] == "true") {
        if (typeof $(targetIds[dataIndex]).attr("data-filter-col") != "undefined") {
            $(targetIds[dataIndex]).each(function () {
                var filterCol = $(this).attr("data-filter-col");
                var filterVal = $(this).attr("data-filter-val");
                var templateHtml = $(this).html();
                $(this).empty();
                $(this).append(constructFilteredSectionHTML(templateHtml, dataIndex, filterCol, filterVal));

            });
        }
        else {
            var templateHtml = $(targetIds[dataIndex]).html();
            $(targetIds[dataIndex]).empty();
            $(targetIds[dataIndex]).append(constructSectionHTML(templateHtml, dataIndex));
        }
        // }
        // else {
        //     $(targetIds[dataIndex]).empty();
        //     $(targetIds[dataIndex]).append(htmlData[dataIndex]);
        // }
    }

}

function constructSectionHTML(templateHtml, dataIndex) {
    var strSecHTML = "";
    var jsonData = JSON.parse(sqlData[dataIndex]);
    for (var i = 0; i < jsonData.length; i++) {
        var tempHTML = templateHtml;
        for (var key in jsonData[i]) {
            if (jsonData[i].hasOwnProperty(key)) {
                tempHTML = tempHTML.replace(new RegExp("{{" + key + "}}", "g"), jsonData[i][key]);
            }
        }
        strSecHTML += tempHTML;
    }
    strSecHTML += "";

    return strSecHTML;
}

function constructFilteredSectionHTML(templateHtml, dataIndex, filterCol, filterVal) {
    var strSecHTML = "";
    var jsonData = JSON.parse(sqlData[dataIndex]);
    for (var i = 0; i < jsonData.length; i++) {
        if (jsonData[i][filterCol].toString().toLowerCase() == filterVal.toLowerCase()) {
            var tempHTML = templateHtml;
            for (var key in jsonData[i]) {
                if (jsonData[i].hasOwnProperty(key)) {
                    tempHTML = tempHTML.replace(new RegExp("{{" + key + "}}", "g"), jsonData[i][key]);
                }
            }
            strSecHTML += tempHTML;
        }
    }
    strSecHTML += "";

    return strSecHTML;
}