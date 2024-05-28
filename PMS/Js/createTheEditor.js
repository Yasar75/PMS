/////////////////////////////////////////////////////////////////////////////////////////////
//MANIKANTA                                                                                //
//                                                                                         //
//When 99% of people doubt your idea, you're either gravely wrong or about to make history //
/////////////////////////////////////////////////////////////////////////////////////////////


(function () {
    /**
     * Basic configuration for the component to work
     * @type {Object}
     */
    ///////////////////////////////////////////////////////////////////////////
    // NOTE                                                                  //
    // getExternalAPI need to be an get requset which will send all the data //
    // Of the table data or else need to tell where axpert node is running   //
    // since axpert have prebuilt api to get all the table data it will hit  //
    // that api and get the data                                             //
    ///////////////////////////////////////////////////////////////////////////

    const configuration = {
        _node: {
            // getExternalAPI: "http://localhost:3015/api/getAllTstructs",
            // 
            apiBase: callParentNew("nodeApi"),
            utl: callParentNew("utl"),
            session_id: callParentNew("mainSessionId"),
            username: callParentNew("mainUserName"),
            authorization: callParentNew("nodeAccessToken"),
            ApiCalled: false,
            //appSKey: callParentNew("mainSessionId")
        },
        expression: {
            dependencies: {
                css: ["../ThirdParty/codemirror/codemirror.css", "../ThirdParty/codemirror/addon/hint/show-hint.css", "../Css/expression_editor.min.css"],
                js: "../Js/expression_editor_bundle.min.js?v=11"
            },
        },
        sql: {
            validateOnBlur: true,
            dependencies: {
                css: ["../ThirdParty/codemirror/codemirror.css", "../ThirdParty/codemirror/addon/hint/show-hint.css"],
                js: "../Js/sql_editor_bundle.min.js?v=7"
            },
        }
    }

    let loadedSqlHintObj = {};

    /**
     * The main function keeping on window object to create the editor
     * @author ManiKanta
     * @Date   2018-05-31T15:08:12+0530
     * @param  {String}                 options.type                        Type of editor sql/expression
     * @param  {Boolean}                options.dynamicallyLoadDependencies To load dependencies dynamycally or already loaded
     * @param  {String/Object}          options.textarea                    Either ID of the text area or javascript object of it
     * @param  {Boolean}                options.loadSqlHintObj              To load sql hint object using node
     * @param  {Boolean}                options.sqlHintObj                  predifined sql hint obj to avoid the node call
     * @return {}
     */
    const createTheEditor = function ({ type = "sql", dynamicallyLoadDependencies = true, textarea, loadSqlHintObj = false, sqlHintObj, customValidationFn }) {
        sqlHintObj = loadSqlHintObj ? "load" : (sqlHintObj ? sqlHintObj : {});
        if (dynamicallyLoadDependencies) {
            _checkForDependenciesAndLoad(type, textarea, sqlHintObj, customValidationFn);
        } else {
            _createTheFinalEditor(type, textarea, sqlHintObj, customValidationFn);
        }
    }


    /**
     * To check for dependencies required for particular editor and load them dynamically
     * @author ManiKanta
     * @Date   2018-05-31T15:11:06+0530
     * @param  {String}                 type        Type of editor sql/expression
     * @param  {String/Object}          textarea    To load dependencies dynamycally or already loaded
     * @param  {String/Object}          sqlHintObj  Sql hint data if value is load need to be loaded from node server
     * @return {}                          
     */
    const _checkForDependenciesAndLoad = function (type, textarea, sqlHintObj, customValidationFn) {
        const { css: cssDependencies, js: jsDependencies } = configuration[type].dependencies;

        cssDependencies.forEach(cssPath => {
            if (!$(`link[href='${cssPath}']`).length)
                $(`<link href="${cssPath}" rel="stylesheet">`).appendTo("head");
        });
        // jsDependencies.forEach(jsPath => {
        //     if (!$(`script[src='${jsPath}']`).length){
        //      jsPromises.push(loadScript(jsPath));   
        //     }
        // });


        if (jsDependencies) {
            try {
                loadScript(jsDependencies, function () {
                    _createTheFinalEditor(type, textarea, sqlHintObj, customValidationFn);
                })
            } catch (e) {
                console.warn(e);
            }
        } else {
            _createTheFinalEditor(type, textarea, sqlHintObj, customValidationFn);
        }

    }

    var waitForTstructObj = [];

    /**
     * Once dependencies are loaded will call the particular editor method and create
     * @author ManiKanta
     * @Date   2018-05-31T15:13:50+0530
     * @param  {String}                 type        Type of editor sql/expression
     * @param  {String/Object}          textarea    To load dependencies dynamycally or already loaded
     * @param  {String/Object}          sqlHintObj  Sql hint data if value is load need to be loaded from node server
     * @return {}
     */
    const _createTheFinalEditor = (type, textarea, sqlHintObj, customValidationFn) => {
        if (type === "sql") {
            if ($.isEmptyObject(sqlHintObj) || sqlHintObj === "load") {
                getSqlTableHintsForCodeMirror(type, textarea, customValidationFn);
                waitForTstructObj.push([type, textarea, customValidationFn]);
            } else {
                createSQLeditor({ textarea, SQLhintObj: sqlHintObj, validateOnBlur: configuration.sql.validateOnBlur, nodeConfig: configuration._node, customValidationFn });
            }
        } else {
            createExpressionEditor({ textarea, customValidationFn });
        }
    }


    /**
     * To get the table information to show the hints
     * @author ManiKanta
     * @Date   2018-05-31T18:24:33+0530
     * @param  {[type]}                 type     [description]
     * @param  {[type]}                 textarea [description]
     * @return {[type]}                          [description]
     */
    const getSqlTableHintsForCodeMirror = function (type, textarea, customValidationFn) {
        const { _node } = configuration;

        if (_node.getExternalAPI) {
            $.get(_node.getUrl, function (data) {
                if (data) {
                    loadedSqlHintObj = data.data || {};
                }
                _createTheFinalEditor(type, textarea, loadedSqlHintObj, customValidationFn);

            })
                .fail(function (err) {
                    _createTheFinalEditor(type, textarea, loadedSqlHintObj, customValidationFn);
                    console.log(err);
                })

            return;
        }

        if (!_node.ApiCalled) {
            _node.ApiCalled = true;
            var settings = {
                "async": true,
                "crossDomain": true,
                "method": "POST",
                "url": _node.apiBase + "getTstructs",
                "headers": {
                    "content-type": "application/x-www-form-urlencoded"
                },
                "data": {
                    "session_id": _node.session_id,
                    "utl": _node.utl,
                    "username": _node.username,
                    "authorization": _node.authorization,
                    "appSKey": _node.appSKey
                }
            }

            $.ajax(settings).done(function (response) {
                if (response.status == true) {
                    var data = response.data;
                    if (data) {
                        data.forEach(presData => {
                            const [key, value] = presData;
                            if (!loadedSqlHintObj[key]) {
                                loadedSqlHintObj[key] = [];
                            }
                            loadedSqlHintObj[key].push(value);
                        });
                        callParentNew("mainSQLhintObj=", loadedSqlHintObj);
                        _createTheFinalEditor(type, textarea, loadedSqlHintObj, customValidationFn);
                        var waitCount = waitForTstructObj.length;
                        for (var i = 0; i < waitCount; i++) {
                            if (waitForTstructObj[i][1] != textarea)
                                _createTheFinalEditor(waitForTstructObj[i][0], waitForTstructObj[i][1], loadedSqlHintObj, waitForTstructObj[i][2]);
                        }
                    }
                } else {
                    console.warn(response);
                    _createTheFinalEditor(type, textarea, {}, customValidationFn);
                }
                // console.log(response);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                _createTheFinalEditor(type, textarea, {}, customValidationFn);
                console.warn("Unable to connect to node server");
            });
        }
    }




    /**
     * To load the script file dynamically which return a Promise
     * @author ManiKanta
     * @Date   2018-05-31T15:18:18+0530
     * @param  {String}                 url Script file path
     * @return {Object/PROMISE}          
     */
    const loadScript = function (url, cb) {
        var script = document.createElement("script")
        script.type = "text/javascript";
        if (script.readyState) { //IE
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" ||
                    script.readyState == "complete") {
                    script.onreadystatechange = null;
                    if (typeof cb === "function") {
                        cb();
                    }
                }
            };
        } else { //Others
            script.onload = function () {
                if (typeof cb === "function") {
                    cb();
                }
            };
        }

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }





    window.createTheEditor = createTheEditor;
    window.getSqlTableHintsForCodeMirror = getSqlTableHintsForCodeMirror;

})();
