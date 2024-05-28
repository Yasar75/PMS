var Username ="";
//var axapplication = $("#axSelectProj").val();

$j(document).ready(function () {
    //Code to set the focus in Forgot Password Page
    if ($j('#axSelectProj').is(':visible') && $j('#axSelectProj').val() == "")
        $j('#axSelectProj').focus();

    else {
        $j("#txtName").focus();
        $("#txtMl").attr('readonly', 'false');
    }
});

$(document).on("focusout", "#txtName", function () {
    Username = $("#txtName").val();
    if (Username != "")
    CallWebservice();
});;

function AddProjs()
{
    var axProj = $j("#hdnProj").val();
    var axProjs = new Array();
    axProjs = axProj.split(",");

    if (axProjs.length < 2) {
        $j("#selectProj").hide();
    }
    else if (axProjs.length == 2) {
        $j('#axSelectProj').append('<option selected="selected" value="' + axProjs[1] + '">' + axProjs[1] + '</option>');
        $j("#selectProj").hide();
    }
    else {
        for (k in axProjs) {
            $j('#axSelectProj').append('<option value="' + axProjs[k] + '">' + axProjs[k] + '</option>');
        }

        var selectedProj = $j('#axSelectProj :selected').val();

        var regex = new RegExp("^[a-zA-Z0-9]+$");
        if (regex.test(selectedProj)) {
            if (selectedProj)
                $j('#hdnProj').val(selectedProj);
        }

    }
}

function SetProj()
{
    try {
        $j("#hdnProj").val($j('#axSelectProj :selected').val());
    }
    catch (ex)
    { }
}


function OpenSigninPage() {
    var projSelected = $j('#axSelectProj').val();
    window.document.location.href = "Signin.aspx?" + projSelected + "";
    //window.document.location.href = "Signin.aspx?proj=" + projSelected + "";
}

function OpenSigninPagetimeset() {
    setTimeout(function () {
        var projSelected = $j('#axSelectProj').val();
        window.document.location.href = "Signin.aspx?" + projSelected + "";
        //window.document.location.href = "Signin.aspx?proj=" + projSelected + "";
    }, 3000);
}

function CallWebservice() {
    var projectname = "";
    var jsonData = "";
    jsonData = {
        "getchoices": {
            "axpapp": $j("#hdnProj").val(),// $("#axSelectProj").val(),
            "direct" :"true",
           
        }
    }
   // ShowDimmer(true);
    callParentNew("ShowDimmer(true)", "function");
    projectname = $j("#hdnProj").val();
    try {
        ASB.WebService.CallRestGetChoice(JSON.stringify(jsonData), projectname, Username, SuccessCallbackActionGC, OnException);
    }
    catch (exp) {
        callParentNew("ShowDimmer('false')", "function");
    }

    function SuccessCallbackActionGC(result, eventArgs) {

        callParentNew("ShowDimmer('false')", "function");
        try {
            var emailid = "";
            var json = $.parseJSON(result);
            
            if (json["result"][0].result.row != "")
                emailid = json["result"][0].result.row[0].email;
            
            $("#txtMl").focus();
            if (emailid != "") {
                $("#txtMl").val(emailid);
                $("#txtMl").attr('readonly', 'true');
            }
            else {
                $("#txtMl").val(emailid);
                $("#txtMl").prop('readonly', false);
            }

        }
        catch (ex) {
            callParentNew("ShowDimmer('false')", "function");
        }
    }
function OnException(result) {
    callParentNew("ShowDimmer('false')", "function");
    }
}
