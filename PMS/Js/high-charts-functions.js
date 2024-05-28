var heightOfChart = 300;
var colors = ['#93F9B9', '#EB3349', '#008ee4', '#33bdda', '#6baa01', '#583e78'];
// dont change below key names **Dont add key name as **default** and dont change variable name
var customChartColors = {
    "pallet1": ['#93F9B9', '#EB3349', '#008ee4', '#33bdda', '#6baa01', '#583e78'],
    "pallet2": ['#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce', '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a'],
    "pallet3": ['#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE', '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92'],
    "pallet4": ["#7cb5ec", "#434348", "#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"],
    "avacado": ['#F3E796', '#95C471', '#35729E', '#251735'],

    "darkGreen": ['#DDDF0D', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
    "grid": ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
    "sand": ['#f45b5b', '#8085e9', '#8d4654', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
    "skies": ['#514F78', '#42A07B', '#9B5E4A', '#72727F', '#1F949A', '#82914E', '#86777F', '#42A07B'],
    "sunset": ['#FDD089', '#FF7F79', '#A0446E', '#251535']

}
var agileChartsObj = new AgileCharts();

var glType = eval(callParent('gllangType'));
function createAgileChart(initObj) {
    try {
        var data = initObj.data;
        var type = initObj.type;
        var target = initObj.target;
        var dataLength = data.length;
        var xAxis = [];
        var names = [];
        var tmpDataObj = {};
        var dataObj = {};
        var metaInfo = {};
        var validMetaArray = ["data_label", "x_axis", "link", "value", "group_column", "x_axis_data", "y_axis_data", "z_axis_data"];
        var finalDataObj = [];
        var metaData = initObj.metaData;
        var chartHght = initObj.height || heightOfChart;
        var isValidMeta = false;
        if (metaData) {
            var isValid = true;
            for (var i = 0; i < metaData.length; i++) {
                var presentData = metaData[i].name.toLowerCase();
                if ($.inArray(presentData, validMetaArray) === -1) {
                    isValid = false;
                    break;
                } else {
                    metaInfo[presentData] = i;
                }

            }
            isValidMeta = isValid;
        }
        if (type == "line" || type == 'bar' || type == 'stacked-bar' || type == 'column' || type == 'stacked-column' || type == "stacked-percentage-column" || type == "area") {
            if (!isValidMeta) {
                metaInfo = {};
                metaInfo["data_label"] = 0;
                metaInfo["x_axis"] = 1;
                metaInfo["value"] = 2;
                metaInfo["link"] = 3;
            }
            for (var i = 0; i < dataLength; i++) {
                var presentArray = data[i];
                var presentname = presentArray[metaInfo["data_label"]];
                var presentXaxis = presentArray[metaInfo["x_axis"]];
                var currentValue = presentArray[metaInfo["value"]] || 0;
                if ($.inArray(presentname, names) === -1) names.push(presentname);
                if ($.inArray(presentXaxis, xAxis) === -1) xAxis.push(presentXaxis);

                if (tmpDataObj[presentname]) {
                    var presVal = tmpDataObj[presentname][presentXaxis];
                    if (presVal)
                        tmpDataObj[presentname][presentXaxis] = presVal + currentValue;
                    else
                        tmpDataObj[presentname][presentXaxis] = currentValue;
                } else {
                    tmpDataObj[presentname] = {}
                    tmpDataObj[presentname][presentXaxis] = currentValue;
                }
                if (!tmpDataObj.link)
                    tmpDataObj.link = {}
                tmpDataObj.link[presentname + presentXaxis] = presentArray[metaInfo["link"]];
            }
            for (var i = 0; i < names.length; i++) {
                var presentname = names[i];
                for (var j = 0; j < xAxis.length; j++) {
                    var presentxAxis = xAxis[j];
                    var valToPush = tmpDataObj[presentname][presentxAxis] || 0;
                    var link = tmpDataObj.link[presentname + presentxAxis] || "";
                    dataObj[presentname] ? dataObj[presentname].push(valToPush) : dataObj[presentname] = [valToPush];
                    dataObj[presentname + "Link"] ? dataObj[presentname + "Link"].push(link) : dataObj[presentname + "Link"] = [link];
                }
                finalDataObj.push({ name: presentname, data: dataObj[presentname], link: dataObj[presentname + "Link"] });
            }
            var chartInitObj = {
                initObj: initObj,
                xAxis: xAxis,
                names: names,
                data: finalDataObj,
                height: chartHght,
            }
            if (type == "stacked-bar" || type == "stacked-column")
                chartInitObj.stackedChart = true;
            else if (type == "stacked-percentage-column")
                chartInitObj.percentageColumn = true;
            if (type == "bar" || type == "stacked-bar")
                chartInitObj.chartCat = "bar";
            else if (type == "column" || type == "stacked-column" || type == "stacked-percentage-column")
                chartInitObj.chartCat = "column";

            if (type == "line")
                agileChartsObj.lineChart(chartInitObj);
            else if (type == "bar" || type == "stacked-bar" || type == "column" || type == "stacked-column" || type == "stacked-percentage-column")
                agileChartsObj.barColChart(chartInitObj);
            else if (type == "area")
                agileChartsObj.areaChart(chartInitObj);
        } else if (type == "pie" || type == "semi-donut" || type == "donut") {
            if (!isValidMeta) {
                metaInfo = {};
                metaInfo["data_label"] = 0;
                metaInfo["value"] = 1;
                metaInfo["link"] = 2;
            }

            for (var i = 0; i < dataLength; i++) {
                var presentData = data[i];
                finalDataObj.push({ name: presentData[metaInfo["data_label"]], y: presentData[metaInfo["value"]], link: presentData[metaInfo["link"]] });
            }
            var chartInitObj = {
                initObj: initObj,
                data: finalDataObj,
                height: chartHght
            }
            if (type === "pie" || type === "donut") {
                agileChartsObj.pieChart(chartInitObj)
            } else { agileChartsObj.semiCircleDonut(chartInitObj); }
        } else if (type === "stacked-group-column") {
            if (!isValidMeta) {
                metaInfo = {};
                metaInfo["data_label"] = 0;
                metaInfo["x_axis"] = 1;
                metaInfo["group_column"] = 2;
                metaInfo["value"] = 3;
                metaInfo["link"] = 4;
            }
            var stacks = [];
            for (var i = 0; i < dataLength; i++) {
                var presentArray = data[i];
                var presentGroupName = presentArray[metaInfo["data_label"]] + "$" + presentArray[metaInfo["group_column"]];
                var presentXaxis = presentArray[metaInfo["x_axis"]];
                if ($.inArray(presentXaxis, xAxis) === -1) xAxis.push(presentXaxis);
                if ($.inArray(presentArray[metaInfo["group_column"]], stacks) === -1) stacks.push(presentArray[metaInfo["group_column"]]);
                if ($.inArray(presentGroupName, names) === -1) names.push(presentGroupName);
                if (tmpDataObj[presentGroupName]) {
                    var presObj = tmpDataObj[presentGroupName][presentXaxis];
                    if (presObj)
                        tmpDataObj[presentGroupName][presentXaxis] = presObj + presentArray[metaInfo["value"]]
                    else
                        tmpDataObj[presentGroupName][presentXaxis] = presentArray[metaInfo["value"]]
                } else {
                    tmpDataObj[presentGroupName] = {};
                    tmpDataObj[presentGroupName][presentXaxis] = presentArray[metaInfo["value"]];
                }

                if (!tmpDataObj.link)
                    tmpDataObj.link = {};

                tmpDataObj.link[presentGroupName + presentXaxis] = presentArray[metaInfo["link"]];

            }
            for (var i = 0; i < names.length; i++) {
                var presentname = names[i];
                for (var j = 0; j < xAxis.length; j++) {
                    var presentxAxis = xAxis[j];
                    var valToPush = tmpDataObj[presentname][presentxAxis] || 0;
                    var link = tmpDataObj.link[presentname + presentxAxis] || "";
                    dataObj[presentname] ? dataObj[presentname].push(valToPush) : dataObj[presentname] = [valToPush];
                    dataObj[presentname + "Link"] ? dataObj[presentname + "Link"].push(link) : dataObj[presentname + "Link"] = [link];
                }
                var splittedName = presentname.split("$")
                finalDataObj.push({ name: splittedName[0], data: dataObj[presentname], stack: splittedName[1], link: dataObj[presentname + "Link"] });
            }
            var chartInitObj = {
                initObj: initObj,
                xAxis: xAxis,
                data: finalDataObj,
                height: chartHght
            }
            agileChartsObj.stackedColChart(chartInitObj);
        } else if (type === "scatter-plot" || type === "scatter-plot-3D") {
            if (!isValidMeta) {
                metaInfo = {};
                metaInfo["data_label"] = 0;
                metaInfo["x_axis_data"] = 1;
                metaInfo["y_axis_data"] = 2;
                metaInfo["z_axis_data"] = 3;
            }

            var tmpLabelObj = {};
            var tempDataObj = [];
            var dLIndex = metaInfo["data_label"]
            var xDataIndex = metaInfo["x_axis_data"]
            var yDataIndex = metaInfo["y_axis_data"]
            var zDataIndex = metaInfo["z_axis_data"]
            for (var i = 0; i < dataLength; i++) {
                var presentData = data[i];
                var presLbl = presentData[dLIndex];
                var presTmpLblIndx = tmpLabelObj[presLbl];
                if (presTmpLblIndx === undefined) {
                    // means first time
                    if (type === "scatter-plot") {
                        tempDataObj.push([
                            [presentData[xDataIndex], presentData[yDataIndex]]
                        ]);
                    } else {
                        tempDataObj.push([
                            [presentData[xDataIndex], presentData[yDataIndex], presentData[zDataIndex]]
                        ]);
                    }

                    tmpLabelObj[presLbl] = tempDataObj.length - 1;
                } else {
                    if (type === "scatter-plot") {
                        tempDataObj[presTmpLblIndx].push([presentData[xDataIndex], presentData[yDataIndex]]);
                    } else {
                        tempDataObj[presTmpLblIndx].push([presentData[xDataIndex], presentData[yDataIndex], presentData[zDataIndex]]);
                    }
                }
            }

            for (var name in tmpLabelObj) {
                var index = tmpLabelObj[name];
                if (type === "scatter-plot")
                    finalDataObj.push({ name: name, data: tempDataObj[index] })
                else
                    finalDataObj.push({ name: name, colorByPoint: true, data: tempDataObj[index] })
            }

            var chartInitObj = {
                initObj: initObj,
                xAxis: xAxis,
                data: finalDataObj,
                height: chartHght
            }
            if (type === "scatter-plot") {
                agileChartsObj.scatteredChart(chartInitObj);
            } else {
                agileChartsObj.scatter3Dchart(chartInitObj);
            }
        } else if (type === "funnel") {
            let isDataInOrder = false;
            if (!isValidMeta) {
                metaInfo = {};
                metaInfo["data_label"] = 0;
                metaInfo["value"] = 1;
            } else {
                if (metaData[0].name.toLowerCase() === "data_label" && metaData[1].name.toLowerCase() === "value") {
                    isDataInOrder = true;
                }
            }

            let finalDataObj = data;
            if (!isDataInOrder) {
                finalDataObj = [];
                for (var i = 0; i < dataLength; i++) {
                    debugger
                    var presentArray = data[i];
                    finalDataObj.push([presentArray[metaInfo["data_label"]], presentArray[metaInfo["value"]]])
                }
            }

            finalDataObj = [{ data: finalDataObj }]

            var chartInitObj = {
                initObj: initObj,
                xAxis: xAxis,
                data: finalDataObj,
                height: chartHght
            }
            agileChartsObj.funnelChart(chartInitObj);
        }
    } catch (e) {
        console.log(e);
    }
}



function AgileCharts(mode) {
    this.mode = mode;
    this.mainSettings = {};
    //since liscence is purchased removing highcharts.com
    this.mainSettings.credits = {
        enabled: false
    }
    this.mainSettings.colors = colors;
    this.mainSettings.legend = {
        enabled: true,
        align: 'center',
        verticalAlign: 'bottom',
        rtl: (glType == "ar" || false),
        y: 0,
        padding: 0,
        itemMarginTop: 0,
        itemMarginBottom: 0,
        itemStyle: {
            fontSize: '10px',
            fontWeight: 'normal'
        }
    };
    if (this.mode === "build") {
        this.mainSettings.exporting = { enabled: false }
    }
    this.mainSettings.plotOptions = {
        series: {
            dataLabels: {
                allowOverlap: true,
                style: {
                    fontSize: '10px',
                    textOutline: false,
                    fontWeight: 'normal'
                }
            }
        }
    }

    Highcharts.setOptions(this.mainSettings);

    this.radialGradient = function(clrs) {
        clrs = clrs || Highcharts.getOptions().colors;
        return Highcharts.map(clrs, function(color) {
            return {
                radialGradient: {
                    cx: 0.5,
                    cy: 0.3,
                    r: 0.7
                },
                stops: [
                    [0, color],
                    [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
                ]
            };
        });
    }

    this.getDetails = function(type, presObjAttrs) {
        if (type === "colors") {
            var isGradient = (presObjAttrs.gradClrChart && (presObjAttrs.gradClrChart == "true" || presObjAttrs.gradClrChart == true))
            var colorCode = presObjAttrs.cck;
            var colors = "";
            if (colorCode) {
                if (colorCode === "custom") {
                    colors = presObjAttrs.cccv;
                    colors = colors.split(",");
                } else {
                    colors = customChartColors[colorCode];
                }
            } else {
                colors = customChartColors["pallet1"];
            }
            if (isGradient) {
                colors = this.radialGradient(colors);
            }
            return colors;
        }
    }

    this.getCommonChartData = function(chartInitObj) {
        var initalObj = chartInitObj.initObj;
        var presMode = this.mode;
        var title = initalObj.title;
        var downLoadFileName = title;
        var presObjAttrs = initalObj.attr || {};
        var xAxisL = presObjAttrs.xAxisL || "";
        var yAxisL = presObjAttrs.yAxisL || "";
        var shwLgnd = presObjAttrs.shwLgnd ? true : false;
        var shwDataLabel = presObjAttrs.shwChartVal ? true : false;
        var threeD = presObjAttrs.threeD === "create" ? { enabled: true } : { enabled: false }
        var colorsToShow = this.getDetails("colors", presObjAttrs)
        if (initalObj.isCompressed) {
            title = "";
            xAxisL = "";
            yAxisL = "";
        }
        var chartData = {
            colors: colorsToShow,
            chart: {
                options3d: threeD,
                height: chartInitObj.height,
                events: {
                    beforePrint: function() {
                        this.setTitle({
                            text: downLoadFileName
                        })
                        this.exportSVGElements[0].hide();
                        this.oldhasUserSize = this.hasUserSize;
                        this.resetParams = [this.chartWidth, this.chartHeight, false];
                        this.setSize(600, 400, false);

                    },
                    afterPrint: function() {
                        this.setSize.apply(this, this.resetParams);
                        this.hasUserSize = this.oldhasUserSize;
                        this.exportSVGElements[0].show();
                        this.setTitle({
                            text: ""
                        })

                    }
                }
            },
            title: {
                text: ""
            },
            exporting: {
                chartOptions: {
                    title: {
                        text: downLoadFileName
                    }
                },
                filename: downLoadFileName
            },
            yAxis: {
               
                title: {
                    text: yAxisL
                },
                labels:{
                    enabled: !enableSlick
                }
            },
            legend: {
                enabled: shwLgnd,
                rtl: (glType == "ar" || false)
            },
            xAxis: {
                reversed:(glType == "ar" || false),
                title: {
                    enabled: true,
                    text: xAxisL
                },
                labels:{
                    enabled: !enableSlick
                }
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: shwDataLabel,
                        align: 'top',
                        y: 10,
                    },
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function(event) {
                                chartLinkClick({ hyperLinkObj: chartInitObj.initObj.hyperLink, linkData: event.point.series.userOptions.link[this.x], event });
                            }
                        }
                    }
                }
            }
        }
        if (enableSlick) {
            chartData && chartData.exporting && (chartData.exporting.enabled = false)
        }
        return chartData;
    }


    this.lineChart = function(chartInitObj) {
        var initalObj = chartInitObj.initObj;
        var chrtOptions = this.getCommonChartData(chartInitObj);
        chrtOptions.tooltip={};
        chrtOptions.tooltip = {
            //rtl: glType == "ar" || false,
            formatter: function () {
                //return 'The value for <b>' + this.x +
                //'</b> is <b>' + this.y + '</b>';
                var xColor = "black";
                var yColor = "black";
                if(this.point && this.point.color && this.point.color.stops && this.point.color.stops.length > 1){
                    try{
                        xColor = this.point.color.stops[0][1] || xColor;
                        yColor = this.point.color.stops[1][1] || yColor;
                    }catch(ex){}
                }
                return (glType != "ar" ? ('<span style="color:' + xColor + '">●</span>') : '') + this.x +  + this.y + '</span>' + (glType == "ar" ? ('<span style="color:' + xColor + '">●</span>') : '');
            }
        }
        chrtOptions.xAxis.categories = chartInitObj.xAxis;
        chrtOptions.series = chartInitObj.data;
        $(initalObj.target).highcharts(chrtOptions);
    }

    this.pieChart = function(chartInitObj) {
        var initalObj = chartInitObj.initObj;
        var presObjAttrs = initalObj.attr || {};
        var cirInnerSize = initalObj.type === "donut" ? 50 : 0;
        var shwDataLabel = presObjAttrs.shwChartVal ? true : false;
        var pinterFrmt = presObjAttrs.shwVal ? '<b>{point.y}</b>' : '<b>{point.percentage:.1f}%</b>';
        var chrtOptions = this.getCommonChartData(chartInitObj);
        chrtOptions.chart.options3d.alpha = 45;
        chrtOptions.chart.options3d.beta = 0;
        chrtOptions.chart.type = 'pie';
        chrtOptions.tooltip = {
            pointFormat: pinterFrmt,
            useHTML: true,
           
        };
        chrtOptions.plotOptions.pie = {
            innerSize: cirInnerSize,
            allowPointSelect: true,
            depth: 35,
            showInLegend: true
        }
        chrtOptions.plotOptions.series.dataLabels = {
            verticalAlign: 'top',
            enabled: shwDataLabel,
            color: '#000000',
            connectorWidth: 1,
            distance: 10,
            inside: true,
            connectorColor: '#a5a5a5',
            formatter: function() {
                return this.y;
            }
        };
        chrtOptions.plotOptions.series.point.events = {
            click: function(event) {
                chartLinkClick({ hyperLinkObj: chartInitObj.initObj.hyperLink, linkData: this.link, event });
            }
        }
        chrtOptions.series = [{
            colorByPoint: true,
            data: chartInitObj.data
        }]
        $(initalObj.target).highcharts(chrtOptions);
    }

    this.semiCircleDonut = function(chartInitObj) {
        var initalObj = chartInitObj.initObj;
        var presObjAttrs = initalObj.attr || {};
        var shwDataLabel = presObjAttrs.shwChartVal ? true : false;
        var pinterFrmt = presObjAttrs.shwVal ? '<b>{point.y}</b>' : '<b>{point.percentage:.1f}%</b>';
        var chrtOptions = this.getCommonChartData(chartInitObj);
        chrtOptions.chart.marginBottom = 0;
        chrtOptions.chart.type = 'pie';
        chrtOptions.tooltip = {
            pointFormat: pinterFrmt,
            rtl: (glType == "ar" || false),
           // pointFormat: pinterFrmt,
            useHTML: true,    
        };
        chrtOptions.plotOptions.pie = {
            startAngle: -90,
            endAngle: 90,
            center: ['50%', '75%'],
            showInLegend: true,
        };
        chrtOptions.plotOptions.series.dataLabels = {
            verticalAlign: 'top',
            enabled: shwDataLabel,
            color: '#000000',
            connectorWidth: 1,
            distance: 10,
            inside: true,
            connectorColor: '#a5a5a5',
            formatter: function() {
                return this.y;
            }
        };
        chrtOptions.plotOptions.series.point.events = {
            click: function(event) {
                chartLinkClick({ hyperLinkObj: chartInitObj.initObj.hyperLink, linkData: this.link, event });
            }
        }
        chrtOptions.series = [{
            type: 'pie',
            innerSize: '50%',
            data: chartInitObj.data
        }]
        $(initalObj.target).highcharts(chrtOptions);
    }

    this.barColChart = function(chartInitObj) {

        var initalObj = chartInitObj.initObj;
        var presObjAttrs = initalObj.attr || {};
        var shwDataLabel = presObjAttrs.shwChartVal ? true : false;
        var plotOptions = (chartInitObj.stackedChart) ? { series: { stacking: 'normal', } } : (chartInitObj.percentageColumn) ? { series: { stacking: 'percent' } } : { bar: { dataLabels: { enabled: true } } };

        if (!plotOptions.series)
            plotOptions.series = {};
        plotOptions.series.cursor = 'pointer';
        plotOptions.series.dataLabels = {
            enabled: shwDataLabel,
        };
        plotOptions.series.point = {
            events: {
                click: function(event) {
                    chartLinkClick({ hyperLinkObj: chartInitObj.initObj.hyperLink, linkData: event.point.series.userOptions.link[this.x], event });
                }
            }
        };
        var chrtOptions = this.getCommonChartData(chartInitObj);
        chrtOptions.tooltip={};
        chrtOptions.tooltip = {
            //rtl: glType == "ar" || false,
            formatter: function () {
                //return 'The value for <b>' + this.x +
                //'</b> is <b>' + this.y + '</b>';
                var xColor = "black";
                var yColor = "black";
                if(this.point && this.point.color && this.point.color.stops && this.point.color.stops.length > 1){
                    try{
                        xColor = this.point.color.stops[0][1] || xColor;
                        yColor = this.point.color.stops[1][1] || yColor;
                    }catch(ex){}
                }
                return (glType != "ar" ? ('<span style="color:' + xColor + '">●</span>') : '') + this.x +  + this.y + '</span>' + (glType == "ar" ? ('<span style="color:' + xColor + '">●</span>') : '');
            }
        }
        chrtOptions.chart.options3d.alpha = 15;
        chrtOptions.chart.options3d.beta = 15;
        chrtOptions.chart.options3d.depth = 50;
        chrtOptions.chart.options3d.viewDistance = 25;
        chrtOptions.chart.type = chartInitObj.chartCat;
        chrtOptions.xAxis.categories = chartInitObj.xAxis;
        chrtOptions.plotOptions = plotOptions;
        chrtOptions.series = chartInitObj.data;
        $(initalObj.target).highcharts(chrtOptions);
    }

    this.areaChart = function(chartInitObj) {
        var initalObj = chartInitObj.initObj;
        chrtOptions.tooltip={};
        chrtOptions.tooltip = {
            //rtl: glType == "ar" || false,
            formatter: function () {
                //return 'The value for <b>' + this.x +
                //'</b> is <b>' + this.y + '</b>';
                var xColor = "black";
                var yColor = "black";
                if(this.point && this.point.color && this.point.color.stops && this.point.color.stops.length > 1){
                    try{
                        xColor = this.point.color.stops[0][1] || xColor;
                        yColor = this.point.color.stops[1][1] || yColor;
                    }catch(ex){}
                }
                return (glType != "ar" ? ('<span style="color:' + xColor + '">●</span>') : '') + this.x + ' <br/><b>' + this.y + '</b></span>' + (glType == "ar" ? ('<span style="color:' + xColor + '">●</span>') : '');
            }
        }
        var presObjAttrs = initalObj.attr || {};
        var chrtOptions = this.getCommonChartData(chartInitObj);
        chrtOptions.chart.type = 'area';
        chrtOptions.xAxis.categories = chartInitObj.xAxis;
        chrtOptions.plotOptions.area = {
            marker: {
                enabled: false,
                symbol: 'circle',
                radius: 2,
                states: {
                    hover: {
                        enabled: true
                    }
                }
            }
        };
        chrtOptions.plotOptions.series.dataLabels.align = 'left';
        chrtOptions.series = chartInitObj.data;
        $(initalObj.target).highcharts(chrtOptions);
    }

    this.stackedColChart = function(chartInitObj) {
        var initalObj = chartInitObj.initObj;
        var title = chartInitObj.title;
        var presObjAttrs = initalObj.attr || {};
        var xAxisL = presObjAttrs.xAxisL || "";
        var yAxisL = presObjAttrs.yAxisL || "";
        var shwLgnd = presObjAttrs.shwLgnd ? true : false;
        var shwDataLabel = presObjAttrs.shwChartVal ? true : false;
        var threeD = presObjAttrs.threeD === "create" ? { enabled: true, alpha: 15, beta: 15, depth: 50, viewDistance: 25 } : { enabled: false }
        var colorsToShow = this.getDetails("colors", presObjAttrs);
        if (chartInitObj.isCompressed) {
            title,
            xAxisL,
            yAxisL = "";
        }

        var chrtOptions = this.getCommonChartData(chartInitObj);
        chrtOptions.tooltip={};
        chrtOptions.tooltip = {
            //rtl: glType == "ar" || false,
            formatter: function () {
                //return 'The value for <b>' + this.x +
                //'</b> is <b>' + this.y + '</b>';
                var xColor = "black";
                var yColor = "black";
                if(this.point && this.point.color && this.point.color.stops && this.point.color.stops.length > 1){
                    try{
                        xColor = this.point.color.stops[0][1] || xColor;
                        yColor = this.point.color.stops[1][1] || yColor;
                    }catch(ex){}
                }
                return (glType != "ar" ? ('<span style="color:' + xColor + '">●</span>') : '') + this.x +  + this.y + '</span>' + (glType == "ar" ? ('<span style="color:' + xColor + '">●</span>') : '');
            }
        }
        chrtOptions.chart.type = 'column';
        chrtOptions.chart.options3d.alpha = 15;
        chrtOptions.chart.options3d.beta = 15;
        chrtOptions.chart.options3d.depth = 50;
        chrtOptions.chart.options3d.viewDistance = 25;
        chrtOptions.xAxis.categories = chartInitObj.xAxis;
        chrtOptions.column = {
            stacking: 'normal'
        }
        chrtOptions.plotOptions.series.dataLabels.align = 'top';
        chrtOptions.plotOptions.series.dataLabels.verticalAlign = 'top';
        chrtOptions.series = chartInitObj.data;
        $(initalObj.target).highcharts(chrtOptions);
    }

    this.scatteredChart = function(chartInitObj) {
        var initalObj = chartInitObj.initObj;
        var title = chartInitObj.title;
        var presObjAttrs = initalObj.attr || {};
        var xAxisL = presObjAttrs.xAxisL || "";
        var yAxisL = presObjAttrs.yAxisL || "";
        var shwLgnd = presObjAttrs.shwLgnd ? true : false;
        var shwDataLabel = presObjAttrs.shwChartVal ? true : false;
        var threeD = presObjAttrs.threeD === "create" ? { enabled: true, alpha: 15, beta: 15, depth: 50, viewDistance: 25 } : { enabled: false }
        var colorsToShow = this.getDetails("colors", presObjAttrs);
        if (chartInitObj.isCompressed) {
            title,
            xAxisL,
            yAxisL = "";
        }

        $(initalObj.target).highcharts({
            colors: colorsToShow,
            chart: {
                type: 'scatter',
                zoomType: 'xy',
                options3d: threeD,
                height: chartInitObj.height
            },
            title: {
                text: title
            },
            exporting: {
                filename: title,
                enabled: !enableSlick
            },
            xAxis: {
                title: {
                    text: xAxisL
                },
                startOnTick: true,
                endOnTick: true,
                showLastLabel: true,
                labels:{
                    enabled: !enableSlick
                }
            },
            yAxis: {
                title: {
                    text: yAxisL
                },
                labels:{
                    enabled: !enableSlick
                }
            },
            legend: {
                enabled: shwLgnd,
            },
            plotOptions: {
                scatter: {
                    marker: {
                        radius: 5,
                        states: {
                            hover: {
                                enabled: true,
                                lineColor: 'rgb(100,100,100)'
                            }
                        }
                    },
                    states: {
                        hover: {
                            marker: {
                                enabled: false
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '<b>{series.name}</b><br>',
                        pointFormat: '{point.x} : {point.y} '
                    }
                }
            },
            series: chartInitObj.data
        });
    }

    this.scatter3Dchart = function(chartInitObj) {
        var initalObj = chartInitObj.initObj;
        var title = chartInitObj.title;
        var presObjAttrs = initalObj.attr || {};
        var xAxisL = presObjAttrs.xAxisL || "";
        var yAxisL = presObjAttrs.yAxisL || "";
        var shwLgnd = presObjAttrs.shwLgnd ? true : false;
        var shwDataLabel = presObjAttrs.shwChartVal ? true : false;
        var threeD = presObjAttrs.threeD === "create" ? { enabled: true, alpha: 15, beta: 15, depth: 50, viewDistance: 25 } : { enabled: false }
        var colorsToShow = this.getDetails("colors", presObjAttrs);
        if (chartInitObj.isCompressed) {
            title,
            xAxisL,
            yAxisL = "";
        }

        const scatter3Dchart = new Highcharts.Chart({
            colors: colorsToShow,
            chart: {
                renderTo: $(initalObj.target)[0],
                height: chartInitObj.height,
                marginBottom: 100,
                margin: [10, 10, 100, 70],
                type: 'scatter3d',
                options3d: {
                    enabled: true,
                    alpha: 10,
                    beta: 30,
                    depth: 250,
                    viewDistance: 5,
                    fitToPlot: false,
                    frame: {
                        bottom: { size: 1, color: 'rgba(0,0,0,0.02)' },
                        back: { size: 1, color: 'rgba(0,0,0,0.04)' },
                        side: { size: 1, color: 'rgba(0,0,0,0.06)' }
                    }
                }
            },

            title: {
                text: title
            },
            exporting: {
                filename: title,
                enabled: !enableSlick
            },

            yAxis: {
                title: {
                    text: yAxisL
                },
                title: null,
                labels:{
                    enabled: !enableSlick
                }
            },
            xAxis: {
                title: {
                    text: xAxisL
                },
                gridLineWidth: 1,
                labels:{
                    enabled: !enableSlick
                }
            },
            zAxis: {
                showFirstLabel: false,
                labels:{
                    enabled: !enableSlick
                }
            },
            legend: {
                enabled: shwLgnd,
            },
            plotOptions: {
                scatter: {
                    width: 10,
                    height: 10,
                    depth: 10
                }
            },

            series: chartInitObj.data
        });


        this.addScatter3dChartDragEvents(scatter3Dchart);
    }

    this.funnelChart = (chartInitObj) => {
        var initalObj = chartInitObj.initObj;
        var title = chartInitObj.title;
        var presObjAttrs = initalObj.attr || {};
        var xAxisL = presObjAttrs.xAxisL || "";
        var yAxisL = presObjAttrs.yAxisL || "";
        var shwLgnd = presObjAttrs.shwLgnd ? true : false;
        var shwDataLabel = presObjAttrs.shwChartVal ? true : false;
        var threeD = presObjAttrs.threeD === "create" ? { enabled: true, alpha: 15, beta: 15, depth: 50, viewDistance: 25 } : { enabled: false }
        var colorsToShow = this.getDetails("colors", presObjAttrs);
        if (chartInitObj.isCompressed) {
            title,
            xAxisL,
            yAxisL = "";
        }

        $(initalObj.target).highcharts({
            colors: colorsToShow,
            chart: {
                type: 'funnel',
                options3d: threeD,
                height: chartInitObj.height
            },
            title: {
                text: title
            },
            exporting: {
                filename: title,
                enabled: !enableSlick
            },
            xAxis: {
                title: {
                    text: xAxisL
                },
                labels:{
                    enabled: !enableSlick
                }
            },
            yAxis: {
                title: {
                    text: yAxisL
                },
                labels:{
                    enabled: !enableSlick
                }
            },
            legend: {
                enabled: shwLgnd,
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b> ({point.y:,.0f})',
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                        softConnector: true
                    },
                    center: ['40%', '50%'],
                    neckWidth: '30%',
                    neckHeight: '25%',
                    width: '80%'
                }
            },
            series: chartInitObj.data


        });
    }




    ///////////////////////
    // helper functions  //
    ///////////////////////

    this.addScatter3dChartDragEvents = (chart) => {
        // Add mouse events for rotation
        $(chart.container).on('mousedown.hc touchstart.hc', function(eStart) {
            eStart = chart.pointer.normalize(eStart);

            var posX = eStart.chartX,
                posY = eStart.chartY,
                alpha = chart.options.chart.options3d.alpha,
                beta = chart.options.chart.options3d.beta,
                newAlpha,
                newBeta,
                sensitivity = 5; // lower is more sensitive

            $(document).on({
                'mousemove.hc touchmove.hc': function(e) {
                    // Run beta
                    e = chart.pointer.normalize(e);
                    newBeta = beta + (posX - e.chartX) / sensitivity;
                    chart.options.chart.options3d.beta = newBeta;

                    // Run alpha
                    newAlpha = alpha + (e.chartY - posY) / sensitivity;
                    chart.options.chart.options3d.alpha = newAlpha;

                    chart.redraw(false);
                },
                'mouseup touchend': function() {
                    $(document).off('.hc');
                }
            });
        });
    }

    this.makeChartThreeD = function(task, index) {
        var chart = Highcharts.charts[index];
        var chartType = chart.options.chart.type;
        if (task === "create") {
            var tdOpts = {
                enabled: true,
                alpha: 15,
                beta: 15,
                depth: 50,
                viewDistance: 25
            }

            if (chartType !== "column" && chartType !== "bar") {
                var tdOpts = {
                    enabled: true,
                    alpha: 45,
                    beta: 0
                }
            }
            chart.update({
                chart: {
                    options3d: tdOpts,

                },
            });
        } else if (task === "remove") {
            chart.update({
                chart: {
                    options3d: {
                        enabled: false
                    }
                }
            });
        }
    }
    this.toggleLgnds = function(status, index) {
        var chart = Highcharts.charts[index];
        chart.update({
            legend: {
                enabled: status,
            }
        });
    }
    this.updateColors = function(index, colorsArr, isGradient) {
        var chart = Highcharts.charts[index];
        if (colorsArr === "") {
            //means call is from gradient so colors need to be existed colors
            colorsArr = chart.options.colors;
        }
        if (isGradient) {
            colorsArr = this.radialGradient(colorsArr);
        }
        chart.update({ colors: colorsArr });
    }
    this.toggleShowValues = function(status, index) {
        var chart = Highcharts.charts[index];
        var series = chart.series;
        var seriesLth = series.length;
        for (var i = 0; i < seriesLth; i++) {
            var presSerOpt = series[i].options;
            presSerOpt.dataLabels.enabled = status;
            chart.series[i].update(presSerOpt);
        }
    }

    this.resizeTheChart = function({index,height = heightOfChart}){
        const chart = Highcharts.charts[index];
        chart.setSize(null,height)
    }

}

function chartLinkClick({ hyperLinkObj, linkData, target, event }) {
    if (presBuiildMode === "homeBuild") {
        //in design page links should not work
        return;
    }
    if (hyperLinkObj) {
        var linkObjData = hyperLinkObj.data["col" + 1];
        var params = linkObjData.isParams;
        var paramStr = "";
        if (params !== false) {
            paramStr = linkData.substring(linkData.indexOf("(") + 1, linkData.lastIndexOf(")"));
            paramStr = paramStr.replace(/\^/g, "&");
            var url = linkObjData.url;
            if (paramStr === "")
                url = url.slice(0, -1)

            if (typeof isPageBuilder !== "undefined" && isPageBuilder && presBuiildMode === "homeRun" && linkData.toLowerCase().indexOf('$target=inline') > 0) {
                //then link should open in dynamic widget for pagebuilder
                let widgetTarget = $(event.currentTarget).parents('.ui-state-default').data("target");
                openHyperLinkInDynamicWidget({ url: url + paramStr, calledFrom: 'widgetLink',clickedWidgetTarget:widgetTarget });
            } else {
                if(linkObjData.isPop && createPopup){
                    createPopup(url + paramStr);
                }else{
                    parent.LoadIframe(url + paramStr);
                }
            }
        }
    } else {
        if (typeof isPageBuilder !== "undefined" && isPageBuilder && presBuiildMode === "homeRun") {
            if (typeof globalVarsKeyValueObject !== "undefined") {
                const widgetTargetId = $(event.currentTarget).parents(".ui-state-default").data("target");
                const widgetProperties = homeJsonObj.jsonContent.jsonData[widgetTargetId + "Wrapper"] || {};
                const widgetDependencyProperties = widgetProperties.dep;
                if (widgetDependencyProperties && widgetDependencyProperties.length) {
                    const chartType = event.point.series.type;
                    let changedParams = [];
                    widgetDependencyProperties.forEach(dependency => {
                        const [key, chartKey] = dependency;
                        globalVarsKeyValueObject[key] = getTheValueOfThePoint({ type: chartType, key: chartKey, event })
                        changedParams.push(key);
                    });
                    paramChangedUpdateWidget(changedParams);
                }
            }
        }
    }
}

function getTheValueOfThePoint({ type, key = "", event }) {
    var value = "";
    key = key.toLowerCase();
    if (type === "pie") {
        switch (key) {
            case "data_label":
            case "xaxis label":
                value = event.point.options.name;
                break;
            case "value":
                value = event.point.options.y;
                break;
        }
    } else if (type === "column") {
        switch (key) {
            case "data label":
                value = event.point.series.name;
                break;
            case "x-axis label":
                value = event.point.category;
                break;
            case "value":
                value = event.point.y;
                break;
        }
    }
    return value;
}
