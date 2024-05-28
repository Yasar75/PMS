var cameraFound = false, canvas = "", video = "", context = "";
var w, h, ratio;
var isMobile;
$j(document).ready(function () {
    isMobile = callParentNew("isMobileDevice()", "function");
    if (isMobile)
        $("#flip-btn").css("display", "inline-block");
    else
        $("#flip-btn").css("display", "none");
    //$j("#dvCam").hide();
    if (typeof callParentNew("flipCamera") != "undefined" && callParentNew("flipCamera") != false) {
        callParentNew("flipCamera=", false);
        $j("#rdbImgRadio").removeClass("firsFocusable");
        $j("#rdbImgCamera").addClass("firstFocusable").focus();
        $('input:radio[id=rdbImgCamera]').checked = true;
        canvasvideo();
        $j(".rowbor").children().prop('disabled', true);
        $j("#dvCam").show();
    }
    canvasvideo();
    $j(".rowbor").children().prop('disabled', true);

    //$j('input[type="radio"]').click(function () {
    //    if ($j(this).attr("data-rdb-value") == "Camera") {
    //        canvasvideo();
    //        //$j("#dvCam").children().prop('disabled', false);
    //        $j(".rowbor").children().prop('disabled', true);
    //        $j("#dvCam").show();
    //    }
    //});

    //$("#filMyFile").change(function () {
    //    var uploadControl = $('#filMyFile')[0].files;
    //    if (uploadControl.length > 0)
    //        $("#lblnofilename").text(uploadControl[0].name);
    //    if (ValidateFileExtension($('#filMyFile').val(), "image") == true) {
    //        $('#fileuploadsts').val();
    //        $(".file-upload").addClass('active');
    //        $("#noFile").text($('#filMyFile').val().replace("C:\\fakepath\\", ""));
    //    }
    //});

    // ChangeTheme(window);
    setTimeout(function () { IFrameModalDialogTabEvents(""); }, 500);
    checkSuccessAxpertMsg();
    closeRemodalPopupOnEsc();


    // Get handles on the video and canvas elements
    video = document.querySelector("#videoElement");
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
    if ($j('input[type="radio"]').attr("data-rdb-value") == "Camera") {
        if (navigator.getUserMedia) {
            navigator.getUserMedia({ video: true }, handleVideo, videoError);
        }
    }

    canvas = document.querySelector('canvas');
    // Get a handle on the 2d context of the canvas element
    context = canvas.getContext('2d');
    // Define some vars required later
    // Add a listener to wait for the 'loadedmetadata' state so the video's dimensions can be read
    video.addEventListener('loadedmetadata', function () {
        // Calculate the ratio of the video's width to height
        ratio = video.videoWidth / video.videoHeight;
        // Define the required width as 100 pixels smaller than the actual video's width
        w = video.videoWidth - 100;
        // Calculate the height based on the video's width and the ratio
        h = parseInt(w / ratio, 10);
        // Set the canvas width and height to the values just calculated
        canvas.width = w;
        canvas.height = h;
    }, false);

    validateFilesize();
});

function CloseWindow(a) {
    var res = $('#fname').val();
    var fpath = $('#filepathna').val();
    var image_logo = $("#" + a, window.parent.document);
    if (res != "" && fpath != "") {
        image_logo.val(res);
        image_logo.attr('src', fpath);
        parent.navValidator = false;
        parent.IsFormDirty = true;
        parent.AxGlobalChange = true;
        $(callParentNew(a, "id")).parents(".image-input").find(".imageFileUpload").addClass("d-none");
        $(callParentNew(a, "id")).parents(".image-input").find(".profile-pic").removeClass("d-none");
        $(callParentNew(a, "id")).parents(".image-input").find(".delete-button").removeClass("d-none");
    }
    UpdateArray(a, res);

    //setTimeout(function () {parent.closeModalDialog(); })
    setTimeout(function () {
        closeUploadDialog();
    }, 500);
    //if (res != "" && fpath != "") // change
    //    closeRemodalFrame();
}

function UpdateArray(fieldNameArray, fieldValueArray) {

    var isAlreadyFound = false;
    for (var x = 0; x < parent.ChangedFields.length; x++) {

        var fldName = parent.ChangedFields[x].toString();
        if (fldName == fieldNameArray) {
            if (fieldValueArray == "***") {
                parent.ChangedFields.splice(x, 1);
                parent.ChangedFieldDbRowNo.splice(x, 1);
                parent.ChangedFieldValues.splice(x, 1);
                parent.ChangedFieldOldValues.splice(x, 1);
            }

            else {
                parent.ChangedFieldOldValues[x] = parent.ChangedFieldValues[x].toString();
                parent.ChangedFieldDbRowNo[x] = parent.ChangedFieldDbRowNo[x];
                parent.ChangedFieldValues[x] = fieldValueArray;
            }
            isAlreadyFound = true; // the field name is already found and updated.
            break;
        }
    }

    if ((!isAlreadyFound) && (fieldValueArray != "***")) {
        var fIndx = fieldNameArray.lastIndexOf("F");
        var rowNo = fieldNameArray.substring(fIndx - 3, fIndx);
        var dcNo = fieldNameArray.substring(fIndx + 1);
        var dbRowNo = parseInt(rowNo, 10);
        parent.ChangedFields.push(fieldNameArray);
        parent.ChangedFieldDbRowNo.push(dbRowNo);
        parent.ChangedFieldValues.push(fieldValueArray);
        parent.ChangedFieldOldValues.push("");
    }
}
$(document).keydown(function (e) {
    if (e.which == 27) {
        if ($(parent.$('.modal .close') != undefined))
            $(parent.$('.modal .close')).click();
    }
})

function closeUploadDialog() {
    //if ($(parent.$('.modal')) != undefined && $(parent.$('.modal')).length > 0) {
    //    $(parent).focus();
    //    if ($(parent.$('.modal .close')) != undefined && $(parent.$('.modal .close')).length > 0) {
    //        //$(parent.$('.modal .close'))[$(parent.$('.modal .close')).length - 1].click();
    //        modalButton = eval(callParent("btnModalClose", "id") + ".getElementById('btnModalClose')");
    //        modalButton.click();
    //    }
    //    setTimeout(function () {
    //        $(parent.$('.modal'))[$(parent.$('.modal')).length - 1].remove();
    //    }, 300);
    //}
    callParentNew("modalIdCaptureImage", "id").dispatchEvent(new CustomEvent("close"));
}

function handleVideo(stream) {
    video.src = window.URL.createObjectURL(stream);
    $("#btnCapture").removeAttr("disabled");
    //iframe = eval(callParent("iFrameImageUpload", "id") + ".getElementById('iFrameImageUpload')");
    //if (iframe != null && iframe != undefined)
    //    iframe.style.height = "304px"
}

function videoError(e) {
    cameraFound = false;
    dvCam.innerHTML = "<h2>No Camera Found</h2>";
    $("#btnCapture").prop("disabled");
    parent.showAlertDialog("warning", eval(callParent('lcm[294]')));
}


// Takes a snapshot of the video
function snap() {
    // Define the size of the rectangle that will be filled (basically the entire element)
    context.fillRect(0, 0, w, h);
    // Grab the image from the video
    context.drawImage(video, 0, 0, w, h);
    convertCanvasToImage();
}

function convertCanvasToImage() {
    var dataURL = canvas.toDataURL("image/jpg"); // save canvas image as data url (png format by default)
    // set canvasImg image src to dataURL
    // so it can be saved as an image
    document.getElementById("mydata").value = dataURL;
    document.getElementById('imgCanvas').src = dataURL;
}

function canvasvideo() {
    var shouldFaceUser = callParentNew("shouldFaceUser");
    var constraints = isMobile == true ? { audio: false, video: { facingMode: shouldFaceUser ? { exact: 'environment' } : { exact: 'user' } } } : { audio: true, video: { width: 1280, height: 720 } };
    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (mediaStream) {
            var video = document.querySelector('video');
            video.srcObject = mediaStream;
            video.onloadedmetadata = function (e) {
                $("#btnCapture").removeAttr("disabled");
                // iframe = eval(callParent("iFrameImageUpload", "id") + ".getElementById('iFrameImageUpload')");
                // if (iframe != null && iframe != undefined)
                //     iframe.style.height = "304px"
            };
        })
        .catch(function (err) {
            videoError();
        }); // always check for errors at the end
}


$(document).on("click", "#flip-btn", function () {
    if (callParentNew("shouldFaceUser"))
        callParentNew("shouldFaceUser=", false);
    else
        callParentNew("shouldFaceUser=", true);
    callParentNew("flipCamera=", true);
    var cHREF = window.location.href;
    window.location.href = cHREF;
});
