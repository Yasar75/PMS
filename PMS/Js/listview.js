
function CloseTstructPopUp() {
    if (loadPop && !loadPop.closed) {        
            loadPop.close();
    }
}

function SetColumnName(columnName, dataRowIndex) {
    window.parent.dataRowIndex = dataRowIndex;
    window.parent.clickedColumn = columnName;
    window.parent.isParentIview = false;
}


function CallLViewFunctions() {
    if (document.title == "List IView") {
        window.parent.isParentIview = false;
        window.parent.isSessionCleared = false;
        $j("#txtViewName").on("keyup", function() {

            var a = this.value;

            if (this.value.charAt(0).match(/[0-9]/)) {
                this.value = this.value.replace(/[0-9]/, '');
            }

            if (this.value.match(/[^a-zA-Z0-9_]/g)) {
                this.value = this.value.replace(/[^a-zA-Z0-9]/g, '');
            }
        });


        $j(".tvRow").click(function(event) {
            var LstCust = $j(".ListCust");
            LstCust.hide();
            pos = this.id;
            var text = this.innerText;
            $j('#lblProperty')[0].innerText = text;


            showHide(pos);
            if (pos == "tr3")
                checkDc();

            else if (pos == "tr5") {
                bindSubtotalColmn();
                bindSubttlDrpdwn();
            }
        })



        $j('#rbtnStatus input').change(function() {
            // The one that fires the event is always the
            // checked one; you don't need to test for this
            //
            $j("#hdnStatus").val($j(this).val());
        });

        $(document).on("click", "#tblSubtotal tr", function () {

            var pos = this.id;
            var text = this.innerText;

            var value = $j(this).children().children('input[type=checkbox]')[0].value;

            var a = 0;

            var tblRow = $j('#tblSubtotlList tr > td:contains(' + value + ')');

            if ($j(this).children().children('input[type=checkbox]')[0].checked) {
                $j('#hdnCbValue').val(value);
            }

            tblRow.parent().each(function() {

                var b = tblRow.parent();

                $j("#txtHeader").val(tblRow.parent()[0].childNodes[1].innerText);
                $j("#txtFooter").val(tblRow.parent()[0].childNodes[2].innerText);
                $j("#ddlCaption").val(tblRow.parent()[0].childNodes[3].innerText);

                if (tblRow.parent()[0].childNodes[5].innerText == "false")
                    $j("#cbLineSpace").prop('checked', false);
                else
                    $j("#cbLineSpace").prop('checked', true);

                if (tblRow.parent()[0].childNodes[6].innerText == "false")
                    $j("#cbTtl").prop('checked', false);
                else
                    $j("#cbTtl").prop('checked', true);

                $j("#txtSubOrder").val(tblRow.parent()[0].childNodes[4].innerText);

            });
        });

        $j("#tblFilter select").on("change", function () {

                var sel = $j(this).attr('id');
                var indx = sel.substring(6);   //ddlOpr
                var con = $j(this).attr("value");
                var txt1 = "txtFilter" + indx;
                indx = "txtFillVal" + indx;

            if (sel.indexOf('ddlOpr') != -1) {
                if (con == 'between') {
                    $j("#" + indx).prop("disabled", false);
                    $j("#" + txt1).prop("disabled", false);
                }
                else if (con == "is null") {

                    $j("#" + indx).prop("disabled", true);
                    $j("#" + txt1).prop("disabled", true);
                }
                else {
                    $j("#" + indx).prop("disabled", true);
                    $j("#" + txt1).prop("disabled", false);
                }
                $j("#" + indx).val('');
                $j("#" + txt1).val('');
            }
        })


        $j(function() {

            $j("[id*=tvList] input[type=checkbox]").bind("click", function() {
                var table = $j(this).closest("table");
                if (table.next().length > 0 && table.next()[0].tagName == "DIV") {
                    //Is Parent CheckBox
                    var childDiv = table.next();
                    var isChecked = $j(this).is(":checked");

                    ValidateGridDc();
                    if (griddccnt > 1) {
                        $j(this).removeAttr("checked");
                        return;
                    }

                    validateChildDc();

                    var parentDIV = $j(this).closest("DIV");

                    if (childdccnt2 >= 2 && childdccnt1 >= 1) {
                        $j(this).removeAttr("checked");
                        return;
                    }

                    $j("input[type=checkbox]", childDiv).each(function() {
                        if (isChecked) {


                            $j(this).attr("checked", "checked");
                        } else {
                            $j(this).removeAttr("checked");
                        }
                    });
                } else {
                    //Is Child CheckBox

                    validateChildDc();

                    var parentDIV = $j(this).closest("DIV");

                    if (childdccnt2 >= 2 && childdccnt1 >= 1) {
                        $j(this).removeAttr("checked");
                        return;
                    }

                    if ($j("input[type=checkbox]", parentDIV).length == $j("input[type=checkbox]:checked", parentDIV).length) {
                        $j("input[type=checkbox]", parentDIV.prev()).attr("checked", "checked");
                    } else {
                        $j("input[type=checkbox]", parentDIV.prev()).removeAttr("checked");
                    }
                }
            });

        })
    }
    //if ($j("#chkall").length > 0 && window.document.title == "List IView")
    //    $j("#chkall").parent().width(60);
}
function AdjustLviewWinff() {
    var ua = ie_ver();
    var bodyHeight = $j(window.document.body).height();

    if (ua != 0 && ua != undefined) {
        bodyHeight = bodyHeight + 100;
    }

    adjustwin(bodyHeight, window);
}

function ChangeDir(dir) {
    $j("#form1").attr("dir", dir);
}

function ie_ver() {
    var iev = 0;
    var ieold = (/MSIE (\d+\.\d+);/.test(navigator.userAgent));
    var trident = !!navigator.userAgent.match(/Trident\/7.0/);
    var rv = navigator.userAgent.indexOf("rv:11.0");

    if (ieold) iev = new Number(RegExp.$1);
    if (navigator.appVersion.indexOf("MSIE 10") != -1) iev = 10;
    if (trident && rv != -1) iev = 11;

    return iev;
}
