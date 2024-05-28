// JScript File
function adjustwin(ht, iframeWindow, height) {
    var framename = iframeWindow.name;
    framename = framename.toLowerCase();
    if ((framename.substring(0, 7) == "openpop") || (framename.substring(0, 7) == "loadpop") || (framename.substring(0, 7) == "ivewPop")) {
        framename = "MyPopUp";
    }
}


