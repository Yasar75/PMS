//<Module>  CK Editor on TextAreas  </Module>
//<Author>  Prashik  </Author>
//<Description> New CK Editor module with Normal(rtf_) and Minimal(rtfm_) Rich Text Box input support </Description>

function allRtfTextAreas() {
    var A = document.getElementsByTagName('textarea');
    var url = location.origin + location.pathname.substr(0, location.pathname.indexOf('aspx'));
    for (var B = 0; B < A.length; B++) {
        if (A[B].id.startsWith("rtf_") || GetDWBFieldType(GetFieldsName(A[B].id)) == "Rich Text") {
            CKEDITOR.replace(A[B], {
                toolbar:
                    [
                        { name: 'document', items: ['Source'] },
                        { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
                        { name: 'editing', items: ['SpellChecker', 'Scayt'] },
                        { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Subscript', 'Superscript', '-', 'RemoveFormat'] },
                        { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-',] },
                        { name: 'insert', items: ['Table', 'HorizontalRule', 'SpecialChar',] }, '/',
                        { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
                        { name: 'colors', items: ['TextColor'] },
                        { name: 'tools', items: ['Maximize', 'Image'] }
                    ], removeDialogTabs: 'image:advanced;link:advanced',
                filebrowserUploadUrl: url + '/ckImgUpload.ashx',
                filebrowserImageUploadUrl: url + '/ckImgUpload.ashx?transId=' + transid + '&fldName=' + A[B].id + '',
                filebrowserFlashUploadUrl: url + '/ckImgUpload.ashx',
                enterMode: CKEDITOR.ENTER_BR,
                image_previewText: ' ',
                tabSpaces: 0,
                width: '100%'
            }).on("blur", function () { ShowdivContentCK(this, true) });
        }
        else if (A[B].id.startsWith("rtfm_")) {
            CKEDITOR.replace(A[B], {
                toolbar:
                    [
                        { name: 'document', items: ['Source', '-', 'NewPage', 'Preview', '-', 'Templates'] },
                        ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'],
                        '/',
                        { name: 'basicstyles', items: ['Bold', 'Italic'] }
                    ], enterMode: CKEDITOR.ENTER_BR,
                tabSpaces: 0,
                width: '100%'
            }).on("blur", function () { ShowdivContentCK(this, true) });
        }
        else if (A[B].id.startsWith("fr_rtf_")) {
            CKEDITOR.replace(A[B], {
                toolbar: [
                    { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript'] },
                    { name: 'colors', items: ['TextColor'] }, ['Cut', 'Copy', 'Paste', '-', 'Undo', 'Redo'], { name: 'document', items: ['NewPage', 'Preview', '-', 'Source'] }
                ], enterMode: CKEDITOR.ENTER_BR,
                coreStyles_bold: { element: 'b', overrides: 'strong' },
                coreStyles_strike: { element: 'strike', overrides: 's' },
                coreStyles_italic: { element: 'i', overrides: 'em' },
                colorButton_foreStyle: { element: 'font', attributes: { 'color': '#(color)' } },
                autoParagraph: false,
                entities: false,
                basicEntities: false,
                tabSpaces: 0,
                width: '100%'
            }).on("blur", function () { ShowdivContentCK(this, true) });
        }
    }
}


// Same function but it will called only for tabbed DC's
function allRtfTextAreasTab(tabNo) {
    var divID = "divDc" + tabNo;
    if (document.getElementById(divID) != null) {
        var url = location.origin + location.pathname.substr(0, location.pathname.indexOf('aspx'));
        var A = document.getElementById(divID).getElementsByTagName('textarea');
        for (var B = 0; B < A.length; B++) {
            if (A[B].id.startsWith("rtf_") || GetDWBFieldType(GetFieldsName(A[B].id)) == "Rich Text") {
                CKEDITOR.replace(A[B], {
                    toolbar:
                        [
                            { name: 'document', items: ['Source'] },
                            { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
                            { name: 'editing', items: ['SpellChecker', 'Scayt'] },
                            { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Subscript', 'Superscript', '-', 'RemoveFormat'] },
                            { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-',] },
                            { name: 'insert', items: ['Table', 'HorizontalRule', 'SpecialChar',] }, '/',
                            { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
                            { name: 'colors', items: ['TextColor'] },
                            { name: 'tools', items: ['Maximize', 'Image'] }
                        ], removeDialogTabs: 'image:advanced;link:advanced',
                    filebrowserUploadUrl: url + '/ckImgUpload.ashx',
                    filebrowserImageUploadUrl: url + '/ckImgUpload.ashx?transId=' + transid + '&fldName=' + A[B].id + '',
                    filebrowserFlashUploadUrl: url + '/ckImgUpload.ashx',
                    enterMode: CKEDITOR.ENTER_BR,
                    image_previewText: ' ',
                    tabSpaces: 0,
                    width: '100%'
                }).on("blur", function () { ShowdivContentCK(this, true) });
            }
            else if (A[B].id.startsWith("rtfm_")) {
                CKEDITOR.replace(A[B], {
                    toolbar:
                        [
                            { name: 'document', items: ['Source', '-', 'NewPage', 'Preview', '-', 'Templates'] },
                            ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'],
                            '/',
                            { name: 'basicstyles', items: ['Bold', 'Italic'] }
                        ], enterMode: CKEDITOR.ENTER_BR,
                    tabSpaces: 0,
                    width: '100%'
                }).on("blur", function () { ShowdivContentCK(this, true) });
            }
            else if (A[B].id.startsWith("fr_rtf_")) {
                CKEDITOR.replace(A[B], {
                    toolbar: [
                        { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript'] },
                        { name: 'colors', items: ['TextColor'] }, ['Cut', 'Copy', 'Paste', '-', 'Undo', 'Redo'], { name: 'document', items: ['NewPage', 'Preview', '-', 'Source'] }
                    ],
                    enterMode: CKEDITOR.ENTER_BR,
                    coreStyles_bold: { element: 'b', overrides: 'strong' },
                    coreStyles_strike: { element: 'strike', overrides: 's' },
                    coreStyles_italic: { element: 'i', overrides: 'em' },
                    colorButton_foreStyle: { element: 'font', attributes: { 'color': '#(color)' } },
                    autoParagraph: false,
                    entities: false,
                    basicEntities: false,
                    tabSpaces: 0,
                    width: '100%'
                }).on("blur", function () { ShowdivContentCK(this, true) });
            }
        }
    }
}