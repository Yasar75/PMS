"use strict";

// Class definition
var KTLayoutExplore = function() {
    // Private variables    
    var explore;

    // Private functions

    // Public methods
	return {
		init: function() {
            // Elements
            explore = document.querySelector('#kt_explore:not(.initialized)');

            if (!explore) {
                return;
            }      

            explore.classList.add("initialized");
		}
	};
}();

// On document ready
KTUtil.onDOMContentLoaded(function() {
    KTLayoutExplore.init();
});