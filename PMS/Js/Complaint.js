$(document).ready(function () {
    
    $('.contact100-form-btn').click(function () {
        if (validateField()) {
            let Subject = $("#subject").val();
            let mailcontent = $("#content").val();
            let project = callParentNew("mainProject");
            let username = callParentNew("mainUserName");
            let cloudAPI = $("#CloudAPI").val();
            let emailID = $("#UserName").val();
            try {
                $.ajax({
                    url: cloudAPI + "contactus",
                    type: "POST",
                    data: {
                        name: encodeURIComponent(username),
                        email: encodeURIComponent(emailID),
                        phonenumber: "",
                        company: "",
                        project: encodeURIComponent(project),
                        username: encodeURIComponent(emailID),
                        subject: encodeURIComponent(Subject),
                        comments: encodeURIComponent(mailcontent),
                        fromweb: 1
                    }
                }).then(function (resp) {
                    if (resp.status === 200) {
                        showAlertDialog("success", "Successfully Registered");
                        $("#subject").val("");
                        $("#content").val("");
                    }

                }).catch(function (error) {
                    console.log(error);
                });

            } catch (exp) {
                console.log("Exception:" + exp);
            }
        }
        })

});


function validateField() {
    let subjectValue = $("#subject").val().length;
    let contentValue = $("#content").val().length;
    if (subjectValue <= 0) {
        showAlertDialog("info", "Please Enter Subject");
        $("#subject").focus();
        return false;
    }
    else if (contentValue <= 0) {
        showAlertDialog("info", "Please Enter Content");
        $("#content").focus();
        return false;
    }
        
    return true;
}

