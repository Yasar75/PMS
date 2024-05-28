var targetElemClicked;
function WizardComp(options) {
    var obj = this;
    obj.options = options || {};
    obj.chartWizard = {
        steps: 5,
        ids: ["chartSelData", "queryData", "hlinkData", "appearanceData", "roleSelctionData"],
        stepNames: ["Chart Type", "Source", "Links", "Attributes", "Authorization"],
        validateKeys: ["chtType", "query", "hpLink", "cmz", "rl"]
    }
    obj.createWizard = function (widget) {
        $("#wizarTypeSel").hide();
        $("#wizardWrappper").show();
        var wizardHeaderHtml = "";
        var presentObj = obj[widget];
        var totalSteps = presentObj.steps;
        var stepNames = presentObj.stepNames;
        var ids = presentObj.ids;
        const progressType = obj.options.progress_bar || "";
        for (var i = 0; i < totalSteps; i++) {
            let stepName = RepSpecialCharsInHTML(stepNames[i]);
            var targetId = ids[i];
            if (i == 0)
                wizardHeaderHtml += `<div data-objtype="${widget}" data-id=${i} data-target="${targetId}" class="step in-progress active ${progressType}">`;
            else
                wizardHeaderHtml += `<div data-objtype="${widget}" data-id=${i} data-target="${targetId}" class="step ${progressType}">`;
            wizardHeaderHtml += '<a title="' + stepName + '" class="stepName" href="javascript:void(0)">' + stepName + '</a>';
            if (obj.options.progress_bar !== "flat") {
                wizardHeaderHtml += '<div title="' + stepName + '" class="node"></div>';
            }
            wizardHeaderHtml += '</div>';
        }
        $("#wizardHeader").html('<div class="wizard-progress">' + wizardHeaderHtml + '</div>');
        if (progressType === "vertical") {
            $("#wizardWrappper").addClass('progress_vertical');
        } else if (progressType === "flat") {
            $("#wizardWrappper").addClass('progress_flat');
        }
        obj.showActiveData(ids[0])
        $("#wizardNextbtn").show();
        obj.assignEvents();
        obj.onWizardCreate();
    }
    obj.completeCurrentStep = function () {
        var presentStep = $("#wizardHeader .step.in-progress");
        var target = presentStep.next().data('target');
        presentStep.removeClass('in-progress active').addClass('complete');
        presentStep.next().addClass('in-progress active');
        obj.showActiveData(target);
    }

    obj.assignEvents = function () {
        $("#wizardHeader .node,#wizardHeader a.stepName").on('click', function (event) {
            event.preventDefault();
            var elem = $(this);
            obj.checkClick(elem);
        });
        if (obj.options.rtl) {
            $("#wizardHeader .wizard-progress,#wizardBodyContent").addClass('wizardRtl');
        }

    }
    obj.checkClick = function (elem, type) {

        if (type == "prev" || type == "next") {
            var parentElem = $("#wizardHeader .step.active");
            var validateKey = parentElem.data('id');
            var validateObj = parentElem.data('objtype');
            if (type == "next")
                var validationResult = obj.validateTheKey(validateObj, validateKey);
            else if (type == "prev")
                var validationResult = true;
            if (validationResult === true) {
                if (type == "next") {
                    var nextparentelem = parentElem.next();
                    if (!parentElem.hasClass('complete')) {
                        parentElem.addClass('complete').removeClass('in-progress active');
                        nextparentelem.addClass('in-progress active');
                    } else {
                        parentElem.removeClass('active');
                        nextparentelem.addClass('active');
                    }
                    var targetObj = nextparentelem.data('objtype');
                    var targetId = obj[targetObj].ids[nextparentelem.data('id')];
                    obj.showActiveData(targetId)
                    obj.checkNxtPrevBtns();
                } else {
                    parentElem.removeClass('active');
                    var prevParentElem = parentElem.prev();
                    prevParentElem.addClass('active');
                    var targetObj = prevParentElem.data('objtype');
                    var targetId = obj[targetObj].ids[prevParentElem.data('id')];
                    obj.showActiveData(targetId)
                    obj.checkNxtPrevBtns();
                }

            } else {
                if (validationResult !== undefined && validationResult != "")
                    showAlertDialog("warning", validationResult);
            }

        } else {
            var parentElem = elem.parents('.step');
            var goingStep = parentElem.data('id');
            var validateObj = parentElem.data('objtype');
            var curStep = $("#wizardHeader .step.active").data('id');

            if (curStep === goingStep || (!parentElem.hasClass('in-progress') && !parentElem.hasClass('complete'))) return;


            targetElemClicked = elem;
            var isValid = true;
            // var isValid = (goingStep > curStep) ? obj.validateTheKey(validateObj, curStep) : true;
            if (goingStep > curStep) {
                for (var i = curStep; i < goingStep; i++) {
                    // Things[i]
                    var presValidation = obj.validateTheKey(validateObj, i);
                    if (presValidation !== true) {
                        if (presValidation !== undefined) $("#wizardHeader .step[data-id=" + i + "] a").click();
                        isValid = presValidation;
                        break;
                    }
                }
            }

            if (isValid === true && !parentElem.hasClass('active') && (parentElem.hasClass('complete') || parentElem.hasClass('in-progress'))) {
                targetElemClicked = "";
                $("#wizardHeader .step.active").removeClass('active')
                var target = parentElem.addClass('active').data('target');
                obj.showActiveData(target);
                obj.checkNxtPrevBtns();
            } else if (isValid !== undefined && isValid != "") {
                showAlertDialog("warning", isValid);
            }
        }
    }

    obj.showActiveData = function (target) {
        $(".wizardContainer").hide();
        $("#" + target).show();
        obj.onPageShow(target);
        obj.focusTheFirstFld(target);
    }

    obj.onPageShow = function (target) {
        //hook to add extra code after page show
    }
    obj.onWizardCreate = function () {
        //hook to add extra code after wizard is created
    }

    obj.focusTheFirstFld = function (target) {
        $("#" + target).find('a,input:visible,button:visible,textarea:visible,select:visible').not(':disabled').first().focus();
    }


    obj.checkNxtPrevBtns = function () {
        var totalSteps = $("#wizardHeader .step").length;
        var curStep = $("#wizardHeader .step.active").data('id');
        if (curStep == 0) {
            $("#wizardPrevbtn").hide();
            $("#wizardNextbtn").show().html("Next &gt;");
        } else if (curStep == (totalSteps - 1)) {
            $("#wizardPrevbtn").show();
            $("#wizardNextbtn").show().html("Finish");
        } else {
            $("#wizardPrevbtn").show();
            $("#wizardNextbtn").show().html("Next &gt;");
        }
    }

    obj.validateTheKey = function (objct, key) {
        var presentObj = obj[objct];
        var validateKeys = presentObj.validateKeys;
        var validateKeyName = validateKeys[key];
        if (validateKeyName != "") {
            if (validateKeyName == "chtType") {
                if ($("#chartSelData").data("isCompleted") != true)
                    return "Please select chart type.";
            }
            return true;
        } else {
            return true;
        }
    }

    obj.resetTheWizard = function () {
        $("#wizarTypeSel").show();
        $("#wizardWrappper").hide();
        $("#wizardHeader").html("");
        $(".wizardPrevNxtBtns").hide();
        obj.onWizardClose();
    }
    obj.onWizardClose = function () {
        // hook when wizard close
    }

}
