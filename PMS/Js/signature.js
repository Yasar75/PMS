var saveSignInfo = {
  fieldName: "",
  imgSrc: "",
  isAxpImagePath: "false",

};

function signatuePadCallBack(signFld) {
  var wrapper = $(".modal-body ").find("#modal_" + signFld)[0];
  var clearButton = wrapper.querySelector("[data-action=clear]");
  var changeColorButton = wrapper.querySelector("[data-action=change-color]");
  var undoButton = wrapper.querySelector("[data-action=undo]");
  var savePNGButton = wrapper.querySelector("[data-action=save-png]");
  var saveJPGButton = wrapper.querySelector("[data-action=save-jpg]");
  var saveSVGButton = wrapper.querySelector("[data-action=save-svg]");
  var saveSignButton = wrapper.querySelector("[data-action=save-sign]");
  var closeSignButton = wrapper.querySelector("[data-action=close-sign]");
  var canvas = wrapper.querySelector("canvas");
  var signaturePad = new SignaturePad(canvas, {
    // It's Necessary to use an opaque color when saving image as JPEG;
    // this option can be omitted if only saving as PNG or SVG
    backgroundColor: 'rgb(255, 255, 255)'
  });

  $('.color-picker').spectrum({
    type: "color",
    togglePaletteOnly: true,
    hideAfterPaletteSelect: true,
    showInput: !isMobile,
    showPalette: !isMobile,
    change: function (color) {
      if (color) {
        signaturePad.penColor = $(this).spectrum("get").toRgbString();
      }
    },
  });
  $(".sp-replacer").addClass("opacity-0");

  // Adjust canvas coordinate space taking into account pixel ratio,
  // to make it look crisp on mobile devices.
  // This also causes canvas to be cleared.
  function resizeCanvas() {
    // When zoomed out to less than 100%, for some very strange reason,
    // some browsers report devicePixelRatio as less than 1
    // and only part of the canvas is cleared then.
    var ratio = Math.max(window.devicePixelRatio || 1, 1);

    // This part causes the canvas to be cleared
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);

    // This library does not listen for canvas changes, so after the canvas is automatically
    // cleared by the browser, SignaturePad#isEmpty might still return false, even though the
    // canvas looks empty, because the internal data of this library wasn't cleared. To make sure
    // that the state of this library is consistent with visual state of the canvas, you
    // have to clear it manually.
    signaturePad.clear();
  }

  // On mobile devices it might make more sense to listen to orientation change,
  // rather than window resize events.
  window.onresize = resizeCanvas;
  resizeCanvas();

  function download(dataURL, filename) {
    if (navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") === -1) {
      window.open(dataURL);
    } else {
      var blob = dataURLToBlob(dataURL);
      var url = window.URL.createObjectURL(blob);

      var a = document.createElement("a");
      a.style = "display: none";
      a.href = url;
      a.download = filename;

      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
    }
  }

  // One could simply use Canvas#toBlob method instead, but it's just to show
  // that it can be done using result of SignaturePad#toDataURL.
  function dataURLToBlob(dataURL) {
    // Code taken from https://github.com/ebidel/filer.js
    var parts = dataURL.split(';base64,');
    var contentType = parts[0].split(":")[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;
    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  }

  clearButton.addEventListener("click", function (event) {
    signaturePad.clear();
  });

  undoButton.addEventListener("click", function (event) {
    var data = signaturePad.toData();

    if (data) {
      data.pop(); // remove the last dot or line
      signaturePad.fromData(data);
    }
  });

  changeColorButton.addEventListener("click", function (event) {
    // var r = Math.round(Math.random() * 255);
    // var g = Math.round(Math.random() * 255);
    // var b = Math.round(Math.random() * 255);
    // var color = "rgb(" + r + "," + g + "," + b + ")";
    // signaturePad.penColor = $('#color-picker').val();

    setTimeout(() => {
      $('.color-picker').spectrum("show");
    }, 0);

  });

  savePNGButton.addEventListener("click", function (event) {
    if (signaturePad.isEmpty()) {
      showAlertDialog("warning", "Please provide a signature first.");
    } else {
      var dataURL = signaturePad.toDataURL();
      download(dataURL, "signature.png");
    }
  });

  saveJPGButton.addEventListener("click", function (event) {
    if (signaturePad.isEmpty()) {
      showAlertDialog("warning", "Please provide a signature first.");
    } else {
      var dataURL = signaturePad.toDataURL("image/jpeg");
      download(dataURL, "signature.jpg");
    }
  });

  saveSVGButton.addEventListener("click", function (event) {
    if (signaturePad.isEmpty()) {
      showAlertDialog("warning", "Please provide a signature first.");
    } else {
      var dataURL = signaturePad.toDataURL('image/svg+xml');
      download(dataURL, "signature.svg");
    }
  });

  /**
  * @description Update and upload the signature to the non-grid fiels as .PNG image
  */

  saveSignButton.addEventListener("click", function (event) {
    if (signaturePad.isEmpty()) {
      showAlertDialog("warning", "Please provide a signature first.");
    } else {
      saveSignInfo.fieldName = signFld;
      saveSignInfo.imgSrc = signaturePad.toDataURL();
      saveSignInfo.isAxpImagePath = $("#isAxpImagePathHidden").val();
      saveSignInfo = JSON.stringify(saveSignInfo);

      try {
        $.ajax({
          type: "POST",
          url: "tstruct.aspx/signatureUpload",
          data: JSON.stringify({
            saveSignInfo
          }),
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function (response) {
            if (response.d.msg == "done") {
              CloseWindow(signFld, response.d.imageName, response.d.imgURL);
              saveSignInfo = {};
            }
            else {
              showAlertDialog("error", response.d.msg);
            }
          },
          error: function (error) {
            showAlertDialog("error", error.responseJSON.Message);
          }
        });
      }
      catch (ex) {
        showAlertDialog("error", ex.message);
      }

    }
  });

  closeSignButton.addEventListener("click", function (event) {
    closeModalDialog();
  });

}

function CloseWindow(signFld, imageName, imagePath) {
  if (imageName != "" && imagePath != "") {
    $("#" + signFld).val(imageName);
    $("#" + signFld).attr("src", imagePath);
    $("#" + signFld).removeClass("d-none");
    $("#" + signFld).parents(".image-input").find(".delete-button").removeClass("d-none");
    navValidator = false;
    IsFormDirty = true;
    AxGlobalChange = true;
  }
  UpdateArray(signFld, imageName);

  setTimeout(function () {
    closeModalDialog();
  }, 500);
}

function UpdateArray(fieldNameArray, fieldValueArray) {

  var isAlreadyFound = false;
  for (var x = 0; x < ChangedFields.length; x++) {

    var fldName = ChangedFields[x].toString();
    if (fldName == fieldNameArray) {
      if (fieldValueArray == "***") {
        ChangedFieldDbRowNo.splice(x, 1);
        ChangedFieldValues.splice(x, 1);
        ChangedFieldOldValues.splice(x, 1);
        ChangedFields.splice(x, 1);
      }

      else {
        ChangedFieldOldValues[x] = ChangedFieldValues[x].toString();
        ChangedFieldDbRowNo[x] = ChangedFieldDbRowNo[x];
        ChangedFieldValues[x] = fieldValueArray;
      }
      isAlreadyFound = true; // the field name is already found and updated.
      break;
    }
  }

  if ((!isAlreadyFound) && (fieldValueArray != "***")) {
    var fIndx = fieldNameArray.lastIndexOf("F");
    var rowNo = fieldNameArray.substring(fIndx - 3, fIndx);
    var dbRowNo = parseInt(rowNo, 10);
    ChangedFields.push(fieldNameArray);
    ChangedFieldDbRowNo.push(dbRowNo);
    ChangedFieldValues.push(fieldValueArray);
    ChangedFieldOldValues.push("");
  }
}