var introProfile = introJs();
    introProfile.setOptions({
    tooltipPosition : 'top',
    steps: [
        {
            element: '#HPBToolBox',
            intro: eval(callParent('lcm[116]')),
            position: 'right'
        },
        {
            element: '#saveDesign',
            intro: eval(callParent('lcm[117]')),
            position: 'left'
        },
        {
            element: '#publishDesign',
            intro: eval(callParent('lcm[118]')),
            position: 'left'
        }

    ]
});
introProfile.oncomplete(function () {
    ;
});
introProfile.onexit(function () {
    ;
});
introProfile.onchange(function (targetElement) {
    ; //add change bits here
});
introProfile.onafterchange(function (targetElement) {
    ;
});
introProfile.onbeforechange(function (targetElement) {
    ; // add change bits here
});
introProfile.start();
