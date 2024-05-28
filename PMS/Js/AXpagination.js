/*

BY MANIKANTA
03/10/2017

*/


(function ($, window, document, undefined) {

    'use strict';

    var AXPAGINATION = function (elem, options, methodToCall) {
        //need to do some validations
        this.axPage = 1;
        if (methodToCall) {
            this.options = options;
            this.elem = elem;
            this.target = this.options.target;

            if (methodToCall != "rearrange") {
                this[methodToCall]();
                return this;
            } else {
                this.axPage = elem.find('button.pageNumberBtn.active').data('page') || 1;
                //some times its the last widget deleted in that page then need to take the last page
                if (this.axPage > 1 && $(`#AXpage${this.axPage} .${this.options.itemClass}`).length === 0) {
                    this.axPage = this.axPage - 1;
                }

                this.destroy();
            }
        }

        this.options = $.extend({}, $.fn.createAxPagination.defaults, options);
        this.elem = elem;
        this.target = this.options.target;
        //checking first target and elems are existed
        if (this.target === "") {
            var cutMsg = eval(callParent('lcm[3]'));
            throw new Error(cutMsg);
        }
        else if ($(this.target).length === 0) {
            var cutMsg = eval(callParent('lcm[4]'));
            throw new Error(cutMsg);
        }

        //need to have more validations for page total and all ~~~~~~~~~~~~~pending

        this.itemsPerPage = this.options.itemsPerPage;
        this.itemElems = $("." + this.options.itemClass + ":visible");
        this.itemElemsConunt = this.itemElems.length;
        this.totalPages = Math.ceil(this.itemElemsConunt / this.itemsPerPage);
        this.morePages = this.totalPages > this.options.morePages;
        this.paginationHtml = '<div class="AXpaginationWrapper">';
        if (this.options.prevIcnClass)
            this.paginationHtml += '<button title="Previous" type="button" data-task = "prev" class="iconBtn nextPrevBtn prevBtn ' + this.options.prevIcnClass + '"></button>';
        else
            this.paginationHtml += '<button title="Previous" type="button" data-task = "prev" class="nextPrevBtn prevBtn">' + this.options.prev + '</button>';

        this.paginationHtml += "<div class='axPaginationOnlyPages'>"
        for (var i = 1; i <= this.totalPages; i++) {
            var start = (i - 1) * this.itemsPerPage;
            var end = start + this.itemsPerPage;
            var presentDataSet = this.itemElems.slice(start, end);
            presentDataSet.wrapAll("<div class='AXpagination' id='AXpage" + i + "' />");

            if (this.morePages) {
                var setsInMorePages = this.options.setsInMorePages;
                if (i <= setsInMorePages)
                    this.paginationHtml += '<button type="button" data-page = ' + i + ' class="pageNumberBtn">' + i + '</button>';
                else if (i == this.totalPages)
                    this.paginationHtml += '<button type="button" data-page = ' + i + ' class="pageNumberBtn">' + i + '</button>';
                else if (i == setsInMorePages + 1)
                    this.paginationHtml += '<button type="button" tabindex="-1" class="threeDotBtn">...</button>';
            } else {
                this.paginationHtml += '<button type="button" data-page = ' + i + ' class="pageNumberBtn">' + i + '</button>';
            }


        }
        this.paginationHtml += "</div>"

        if (this.options.nextIcnClass)
            this.paginationHtml += '<button title="Next" type="button" data-task = "next" class="iconBtn nextPrevBtn nxtBtn ' + this.options.nextIcnClass + '"></button>';
        else
            this.paginationHtml += '<button title="Next" type="button" data-task = "next" class="nextPrevBtn nxtBtn">' + this.options.next + '</button>';
        this.paginationHtml += '</div>';
        $(this.elem).html(this.paginationHtml);
        $(this.target + " .AXpagination").not("#AXpage" + this.axPage).hide();
        this.initializeEvents();
        $(this.elem).find('button.pageNumberBtn[data-page=' + this.axPage + ']').addClass('active');
        this.adjustNextPrev();
        return this;
    }

    AXPAGINATION.prototype = {
        initializeEvents: function(task) {
            var self = this;
            self.elem.find('button.pageNumberBtn').on("click", function(event) {
                if (self.onPageClick(this) === false) return false;
                var curBtn = $(this);
                if (curBtn.hasClass('active')) return;
                var pageToShow = curBtn.data('page');
                self.elem.find('button.pageNumberBtn.active').removeClass('active');
                self.elem.find('button.pageNumberBtn[data-page=' + pageToShow + ']').addClass('active')
                $(".AXpagination").hide();
                $("#AXpage" + pageToShow).show();
                self.adjustNextPrev();
            });
            if (task !== "onlyNumbers") {
                self.elem.find('button.nextPrevBtn ').on("click", function(event) {
                    if (self.onPageClick(this) === false) return false;
                    var curBtn = $(this);
                    if (curBtn.hasClass('disabled')) return;
                    var activePage = self.elem.find('button.pageNumberBtn.active').data('page');
                    var task = curBtn.data('task');
                    var pageToShow = (task === 'next' ? activePage + 1 : activePage - 1);
                    self.elem.find('button.pageNumberBtn.active').removeClass('active');
                    self.elem.find('button.pageNumberBtn[data-page=' + pageToShow + ']').addClass('active')
                    $(".AXpagination").hide();
                    $("#AXpage" + pageToShow).show();
                    self.adjustNextPrev();
                });
            }
        },

        onPageClick: function(elem) {
            var fn = this.options.onPageClick || "";
            if (fn !== "") return fn(this.activePage, elem);
            else return true;
        },

        adjustNextPrev: function() {
            var self = this;
            self.elem.find('button.nextPrevBtn').removeClass('disabled').prop('disabled', false)
            var activePage = self.elem.find('button.pageNumberBtn.active').data('page');
            var totalPages = self.totalPages;

            self.rearrangePageNumbers();

            if (activePage === 1)
                self.elem.find('button.nextPrevBtn.prevBtn').addClass('disabled').prop('disabled', true)
            if (activePage === totalPages)
                self.elem.find('button.nextPrevBtn.nxtBtn').addClass('disabled').prop('disabled', true)
            var fn = self.options.afterPageShow || "";
            self.afterPageShow(activePage, fn);
        },

        rearrangePageNumbers: function() {
            var self = this;
            var activePage = self.elem.find('button.pageNumberBtn.active').data('page');
            var setsInMorePages = self.options.setsInMorePages;
                    var cirumferance = Math.floor(setsInMorePages / 2);
            var leftMargin = activePage - cirumferance;
            var rightMargin = activePage + cirumferance;
            if (leftMargin < 1) {
               leftMargin = Math.abs(leftMargin) + 1;
            }else{
                leftMargin = 0;
            }
            if (rightMargin > self.totalPages) {
                rightMargin = rightMargin - self.totalPages;
            }else{
                rightMargin = 0;
            }

            var paginationBtnHtml = "";
            if (self.morePages) {
                for (var i = 1; i <= self.totalPages; i++) {

                    // if ((activePage - cirumferance) > 2) {
                        if (i === 1 || (i >= (activePage - (cirumferance + rightMargin)) && i <= (activePage + cirumferance + leftMargin)) || (i == (self.totalPages))   ) {
                            paginationBtnHtml += '<button type="button" data-page = ' + i + ' class="pageNumberBtn">' + i + '</button>';
                        } else if (i == (self.totalPages - 1) || i == 2) {
                            paginationBtnHtml += '<button type="button" tabindex="-1" class="threeDotBtn">...</button>';
                        }
                    // }


                    // if (i <= setsInMorePages)
                    //     paginationBtnHtml += '<button type="button" data-page = ' + i + ' class="pageNumberBtn">' + i + '</button>';
                    // else if (i == self.totalPages - 1)
                    //     paginationBtnHtml += '<button type="button" data-page = ' + i + ' class="pageNumberBtn">' + i + '</button>';
                    // else if (i == setsInMorePages + 1)
                    //     paginationBtnHtml += '<button type="button" tabindex="-1" class="threeDotBtn">...</button>';

                }
                if (paginationBtnHtml !== "") {
                    $(".axPaginationOnlyPages").html(paginationBtnHtml);
                    self.elem.find('button.pageNumberBtn[data-page=' + activePage + ']').addClass('active');
                    this.initializeEvents("onlyNumbers");
                }

            }


            if (activePage <= 2) {

            }
        },

        destroy: function() {
            var self = this;
            self.elem.html("");
            $(self.target + " .AXpagination ." + self.options.itemClass).unwrap();
        },
        afterPageShow: function(page, fn) {
            if (fn != "") fn(page);
            this.activePage = page;
        }
    }

    // PLUGIN DEFINITION

    $.fn.createAxPagination = function(options) {
        try {
            var paginationWrapper = $(this);
            if (typeof options === "string") {
                var prevOptions = paginationWrapper.data('AXPAGINATION');
                var axPageSettings = new AXPAGINATION(paginationWrapper, prevOptions, options);
            } else {
                var axPageSettings = new AXPAGINATION(paginationWrapper, options);
                paginationWrapper.data('AXPAGINATION', options);
            }
        } catch (e) {
            // statements
            console.log("Axpagination Plugin issue:" + e);
        }
    };

    $.fn.createAxPagination.defaults = {
        itemsPerPage: 10,
        morePages: 6,
        setsInMorePages: 5,//for best output try odd numbers
        next: 'Next',
        prev: 'Prev'
    }
    $.fn.createAxPagination.Constructor = AXPAGINATION;

})(window.jQuery, window, document);
