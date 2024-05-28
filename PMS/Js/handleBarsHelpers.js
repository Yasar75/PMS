/**
 * @description : Handlebars template split helper
 * @author Prashik
 * @date 2020-01-16
 * @defaultSplitter ","
 * @implementationExample:
     * {{#each (split splittableStringByComma ',')}}
     *   <p>{{this}}</p>
     * {{/each}}
 */
 Handlebars.registerHelper('split', function (...args) {
    var opts = args.pop();
    var stringData = typeof args[0] != "undefined" ? args[0] : "";
    var splitter = typeof args[1] != "undefined" ? args[1] : ",";
    var index = typeof args[2] != "undefined" ? args[2] : "";
      
    splitter = typeof splitter == "string" ? splitter : ",";

    if(index !== ""){
        return stringData.split(splitter)[index] || "";
    }else{
        return stringData.split(splitter);
    }
});


/**
 * @description : Handlebars is comparison helper
 * @author Prashik
 * @date 2020-06-20
 * @defaultOperation "is"
 * @operators supported operators are listed in operations variable
 * @implementationExample
     * {{#is authorName '==' 'Prashik'}}
     *   <h1>{{authorName}}</h1>
     * {{else}}
     *   <h1>Anonymous Author</h1>
     * {{/is}}
 */
Handlebars.registerHelper('is', function (...args) {
    var opts = args.pop();
    var a = typeof args[0] != "undefined" ? args[0] : "";
    var operator = typeof args[1] != "undefined" ? args[1] : "is";
    var b = typeof args[2] != "undefined" ? args[2] : "";

    var operations = {
        '==': (a, b) => { return a == b; },
        '===': (a, b) => { return a === b; },
        '!=': (a, b) => { return a != b; },
        '!==': (a, b) => { return a !== b; },
        '<': (a, b) => { return a < b; },
        '<=': (a, b) => { return a <= b; },
        '>': (a, b) => { return a > b; },
        '>=': (a, b) => { return a >= b; },
        'contains': (a, b) => { return a.toString().indexOf(b) > -1; },
        'toUpper': (a, b) => { return a.toString().toUpperCase() === b; },
        'toLower': (a, b) => { return a.toString().toLowerCase() === b; },
        'undefined': (a, b) => { return typeof a == "undefined"; },
        'defined': (a, b) => { return typeof a != "undefined"; },
        'false': (a, b) => { return false; },
        'is': (a, b) => { return a; },
    }

    var evaluation = false;
    try {
        evaluation = (operations[operator] || operations["false"])(a, b);
    } catch (ex) { }

    if (evaluation) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});

Handlebars.registerHelper("math", function(lvalue, operator, rvalue, options) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);
        
    return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
    }[operator];
});