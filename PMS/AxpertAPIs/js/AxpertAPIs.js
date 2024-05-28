/**
 * @description : Get SQL Data Synchronously
 * @param {*} apiPublicKey : API Secret Key
 * @param {*} sqlParams={} : key value pairs of SQL params to be passed from client side
 * @Example
 *  var apiResult = AxCallSqlDataAPI("publickey1", { "param1" : "value1", "param2" : "value2" });
 */
function AxCallSqlDataAPI(apiPublicKey, sqlParams = {}) {
    if (typeof sqlParams == "undefined" || sqlParams == "")
        sqlParams = {};

    var jsonVal = "";
    $.ajax({
        url: top.window.location.href.toLowerCase().substring("0", top.window.location.href.toLowerCase().indexOf("/aspx/")) + '/AxpertAPIs/aspx/AxpertAPIs.aspx/CallDataSourceAPI',
        type: 'POST',
        cache: false,
        async: false,
        data: JSON.stringify({
            apiPublicKey,
            sqlParams
        }),
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            jsonVal = data.d;
        },
        error: function (error) {
            jsonVal = error;
        }
    });
    return jsonVal;
}

/**
 * @description : Get SQL Data ASynchronously
 * @param {*} apiPublicKey : API Secret Key
 * @param {*} sqlParams={} : key value pairs of SQL params to be passed from client side
 * @Example
 * AxCallSqlDataAPIAsync("publickey1", { "param1" : "value1", "param2" : "value2" }, function(data){ successlogics()}, function(data){ errorlogics()});
 */
function AxCallSqlDataAPIAsync(apiPublicKey, sqlParams = {}, successCB = () => { }, errorCB = () => { }) {
    if (typeof sqlParams == "undefined" || sqlParams == "")
        sqlParams = {};

    var jsonVal = "";
    $.ajax({
        url: top.window.location.href.toLowerCase().substring("0", top.window.location.href.toLowerCase().indexOf("/aspx/")) + '/AxpertAPIs/aspx/AxpertAPIs.aspx/CallDataSourceAPI',
        type: 'POST',
        cache: false,
        async: true,
        data: JSON.stringify({
            apiPublicKey,
            sqlParams
        }),
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            if (successCB && typeof successCB == "function") {
                successCB(data.d || data);
            }
        },
        error: function (error) {
            if (errorCB && typeof successCB == "function") {
                errorCB(error);
            }
        }
    });
}

/**
 * @description : Set Field Value Synchronously to Submit API
 * @Example
 *  var apiResult = AxSetValue("key1", "employee_name", "1", "1", "John");
 */
function AxSetValue(apiPublicKey, fieldName, dcNo, rowNo, value) {
    var jsonVal = "";
    $.ajax({
        url: top.window.location.href.toLowerCase().substring("0", top.window.location.href.toLowerCase().indexOf("/aspx/")) + '/AxpertAPIs/aspx/AxpertAPIs.aspx/AxSetValue',
        type: 'POST',
        cache: false,
        async: false,
        data: JSON.stringify({
            apiPublicKey, fieldName, dcNo, rowNo, value
        }),
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            jsonVal = data.d;
        },
        error: function (error) {
            jsonVal = error;
        }
    });
    return jsonVal;
}

/**
 * @description : Call Submit Data API Synchronously
 * @Example
 *  var apiResult = AxSetValue("key1", "0");
 */
function AxCallSubmitDataAPI(apiPublicKey, recordId) {
    var jsonVal = "";
    $.ajax({
        url: top.window.location.href.toLowerCase().substring("0", top.window.location.href.toLowerCase().indexOf("/aspx/")) + '/AxpertAPIs/aspx/AxpertAPIs.aspx/CallSubmitDataAPI',
        type: 'POST',
        cache: false,
        async: false,
        data: JSON.stringify({
            apiPublicKey, recordId
        }),
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            jsonVal = data.d;
        },
        error: function (error) {
            jsonVal = error;
        }
    });
    return jsonVal;
}
