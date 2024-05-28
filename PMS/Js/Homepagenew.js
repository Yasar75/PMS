// Top Button //
document.addEventListener("DOMContentLoaded", function () {
    var mybutton = document.getElementById("myBtn");
    window.onscroll = function () {
        scrollFunction();
    };
    function scrollFunction() {
        if (
            document.body.scrollTop > 50 ||
            document.documentElement.scrollTop > 50
        ) {
            mybutton.style.display = "block";
        } else {
            mybutton.style.display = "none";
        }
    }
});
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}


//Mobile Number Validation//
function validateMobileNumber(input) {
    const mobileNumber = input.value;

    if (mobileNumber.trim() === '') {
        document.getElementById("mobileNumberError").textContent = ""; // Clear error message if mobile number is empty
        return true;
    }

    if (mobileNumber.length !== 10 || !/^\d+$/.test(mobileNumber)) {
        document.getElementById("mobileNumberError").textContent =
            "Please enter a valid 10-digit mobile number.";
    } else {
        document.getElementById("mobileNumberError").textContent = "";
    }
}

// Email ID Validation//
function validateEmail(input) {
    const email = input.value;
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // Regex pattern for email validation

    if (email.trim() === '') {
        document.getElementById("emailError").textContent = ""; // Clear error message if email id is empty
        return true;
    }

    if (!emailRegex.test(email)) {
        document.getElementById("emailError").textContent =
            "Please enter a valid email address.";
    } else {
        document.getElementById("emailError").textContent = "";
    }
}

// Darshan Booking Modal //
function openRegistrationModal() {
    $("#registration").modal("show");
    // Hide the loading animation when the response is received
    document.getElementById("loadingAnimation").style.display = "none";
}

function closeRegistrationModal() {
    $("#registration").modal("hide");
}


// Date Format //
$(document).ready(function () {
    $("#dob").datepicker({
        dateFormat: 'dd/mm/yy',
        maxDate: new Date(),
        minDate: new Date("1920-01-01")
    });
});

// Age Calculation //
function findage() {
    var PresentDay = new Date();
    var dateOfBirth = new Date(document.getElementById("dob").value);
    var months =
        PresentDay.getMonth() -
        dateOfBirth.getMonth() +
        12 * (PresentDay.getFullYear() - dateOfBirth.getFullYear());
    document.getElementById("age").value = Math.round(months / 12);
}

// Save Validation //
$(document).ready(function () {
    $('#save').click(function () {
        if (validateForm()) {
            saveData();
        }
    });
});


function validateForm() {
    var dob = $('#dob').val();
    var category = $('#category').val();
    var gender = $('input[name="gender"]:checked').val();
    var ssoid = $('#ssoid').val();
    var mob = $('#mob').val();
    var name = $('#name').val();

    if (ssoid === '' || name === '' || category === 'Select Category' || !gender || mob === '' || dob === '') {
        console.log("Error: Could not find element.");
        document.getElementById("registrationModalLabel").textContent = "Validation Error";
        document.getElementById("registrationModal").getElementsByClassName("modal-body")[0].textContent = "Please fill in all required fields.";
        $('#registrationModal').modal('show');
        return false;
    }
    // All required fields are filled, allow form submission
    return true;
}

// Function to send an SMS message using Twilio API
function sendSMS(mobileNumber, message) {
    $.ajax({
        type: "POST",
        url: "../Homepagenew.aspx/SendSMS", // Replace YourPageName with the name of your ASP.NET Web Forms page
        data: JSON.stringify({ mobileNumber: mobileNumber, message: message }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            console.log("SMS sent successfully.");
            // Handle the response here, if needed
        },
        error: function (xhr, status, error) {
            console.error("Error sending SMS:", error);
            // Handle the error here, if needed
        }
    });
}


// Calling WebMethod //
function saveData() {
    var uemail = $('#email').val();
    var dob = $('#dob').val();
    var category = $('#category').val();
    var ugender = $('input[name="gender"]:checked').val();
    var ssoid = $('#ssoid').val();
    var mob = $('#mob').val();
    var ename = $('#name').val();

    // Disable the "Save" button to prevent multiple clicks
    $('#save').prop('disabled', true);

    $.ajax({
        url: '../CustomWebservice.asmx/SaveData',
        type: 'POST',
        cache: false,
        data: JSON.stringify({ uemail: uemail, dob: dob, category: category, ugender: ugender, ssoid: ssoid, mob: mob, ename: ename }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (response) {
            // Handle the response here
            console.log(response.d);

            var jsonData = JSON.parse(response.d);

            if (jsonData) {
                // Show the loading animation while waiting for the response
                document.getElementById("loadingAnimation").style.display = "block";
                if (jsonData.result[0].error) {
                    // Display an error message in the modal
                    var errorMsg = jsonData.result[0].error.msg;
                    document.getElementById("registrationModalLabel").textContent = "Error";
                    document.getElementById("registrationModalBody").textContent = "Error Message: " + errorMsg;


                } else if (jsonData.result[0].message) {
                    // Display a success message in the modal
                    var successMsg = jsonData.result[0].message[0].msg;
                    document.getElementById("registrationModalLabel").textContent = "User Registration";
                    document.getElementById("registrationModalBody").textContent = "Success Message: " + successMsg;
                    // Send SMS to the provided mobile number
                    var sso = $('#ssoid').val(); 
                    var password = '12345'; // Fixed password

                    // Get mobile number from the 'mob' field
                    var mobileNumber = $('#mob').val();

                    // Create the SMS message
                    var smsMessage = 'Your SSO: ' + sso + ', Your Password: ' + password;

                    // Send the SMS
                    sendSMS(mobileNumber, smsMessage);

                    // Clear form fields on success
                    $('#email').val('');
                    $('#dob').val('');
                    $('#category').val('Select Category');
                    $('input[name="gender"]').prop('checked', false);
                    $('#ssoid').val('');
                    $('#mob').val('');
                    $('#name').val('');
                }
            } else {
                // Handle the case when the response does not have the expected structure
                document.getElementById("registrationModalLabel").textContent = "Error";
                document.getElementById("registrationModalBody").textContent = "An unexpected error occurred.";
            }
            $("#registrationModal").modal("show");

        },
        complete: function () {
            // Hide the loading animation when the response is received
            document.getElementById("loadingAnimation").style.display = "none";
            // Re-enable the "Save" button
            $('#save').prop('disabled', false);
        }
    });
}

