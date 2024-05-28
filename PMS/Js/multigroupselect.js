(function ($) {
    'use strict';

    function noop() { }

    function throttle(func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        if (!options) options = {};
        var later = function () {
            previous = options.leading === false ? 0 : new Date().getTime();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        };
        return function () {
            var now = new Date().getTime();
            if (!previous && options.leading === false) previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                clearTimeout(timeout);
                timeout = null;
                previous = now;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    }

    var isSafari = function () {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf('safari') !== -1) {
            return ua.indexOf('chrome') > -1 ? false : true;
        }
    }();

    var settings = {
        readonly: false,
        minCount: 0,
        minCountErrorMessage: '',
        limitCount: Infinity,
        limitCountErrorMessage: '',
        input: '<input type="text" maxLength="20" placeholder="" class="fldmultiSelectInput" ' + (isMobile ? " onfocus=\"blur()\" " : "") + '>',
        data: [],
        searchable: true,
        searchNoData: '<li style="color:#ddd">No Results.</li>',
        init: noop,
        choice: noop,
        extendProps: []
    };

    var KEY_CODE = {
        up: 38,
        down: 40,
        enter: 13
    };

    var EVENT_SPACE = {
        click: 'click.iui-dropdown',
        focus: 'focus.iui-dropdown',
        keydown: 'keydown.iui-dropdown',
        keyup: 'keyup.iui-dropdown'
    };

    var ALERT_TIMEOUT_PERIOD = 1000;
    function createTemplate() {
        var isLabelMode = this.isLabelMode;
        var searchable = this.config.searchable;
        var templateSearch = searchable ? '<span class="dropdown-search">' + this.config.input + '</span>' : '';

        return isLabelMode ? '<div class="dropdown-display-label"><div class="dropdown-chose-list">' + templateSearch + '</div></div><div class="dropdown-main">{{ul}}</div>' : '<a href="javascript:;" class="dropdown-display" tabindex="0"><span class="dropdown-chose-list"></span><a href="javascript:;"  class="dropdown-clear-all" tabindex="0">\xD7</a></a><div class="dropdown-main">' + templateSearch + '{{ul}}</div>';
    }
    function minItemsAlert() {
        var _dropdown = this;
        var _config = _dropdown.config;
        var $el = _dropdown.$el;
        var $alert = $el.find('.dropdown-minItem-alert');
        var alertMessage = _config.minCountErrorMessage;
        clearTimeout(_dropdown.itemCountAlertTimer);

        if ($alert.length === 0) {
            if (!alertMessage) {
                alertMessage = _config.minCount;// '\u6700\u4f4e\u9009\u62e9' + _config.minCount + '\u4E2A';
            }
            $alert = $('<div class="dropdown-minItem-alert">' + alertMessage + '</div>');
        }

        $el.append($alert);
        _dropdown.itemCountAlertTimer = setTimeout(function () {
            $el.find('.dropdown-minItem-alert').remove();
        }, ALERT_TIMEOUT_PERIOD);
    }
    function maxItemAlert() {
        var _dropdown = this;
        var _config = _dropdown.config;
        var $el = _dropdown.$el;
        var $alert = $el.find('.dropdown-maxItem-alert');
        var alertMessage = _config.limitCountErrorMessage;
        clearTimeout(_dropdown.itemLimitAlertTimer);

        if ($alert.length === 0) {
            if (!alertMessage) {
                alertMessage = _config.limitCount;// '\u6700\u591A\u53EF\u9009\u62E9' + _config.limitCount + '\u4E2A';
            }
            $alert = $('<div class="dropdown-maxItem-alert">' + alertMessage + '</div>');
        }

        $el.append($alert);
        _dropdown.itemLimitAlertTimer = setTimeout(function () {
            $el.find('.dropdown-maxItem-alert').remove();
        }, ALERT_TIMEOUT_PERIOD);
    }

    function selectToDiv(str, groupLength) {
        var result = str || '';
        result = result.replace(/<select[^>]*>/gi, '').replace('</select>', '');
        result = result.replace(/<\/optgroup>/gi, '');
        var glNo = ((12 / groupLength)).toString().split(".")[0]
        var DivCol = '<div class="col-sm-' + glNo + '">';
        var DivColClose = '</div>';
        result = result.replace(/<optgroup[^>]*>/gi, function (matcher) {
            var groupName = /label="(.[^"]*)"(\s|>)/.exec(matcher);
            var groupId = /data\-group\-id="(.[^"]*)"(\s|>)/.exec(matcher);
            var liHtml = "";
            if (groupId[1] == 1) {
                liHtml = DivCol;
                liHtml += '<li class="dropdown-group" data-group-id="' + (groupId ? groupId[1] : '') + '">' + (groupName ? groupName[1] : '') + '</li>';
            }
            else {
                liHtml = DivColClose + DivCol;
                liHtml += '<li class="dropdown-group" data-group-id="' + (groupId ? groupId[1] : '') + '">' + (groupName ? groupName[1] : '') + '</li>';
            }
            return liHtml;
        });
        if (result != '')
            result += DivColClose;
        result = result.replace(/<option(.*?)<\/option>/gi, function (matcher) {
            var value = $(matcher).val();
            var name = />(.*)<\//.exec(matcher);
            var isSelected = matcher.indexOf('selected') > -1 ? true : false;
            var isDisabled = matcher.indexOf('disabled') > -1 ? true : false;
            var extendAttr = ''
            var extendProps = matcher.replace(/data-(\w+)="?(.[^"]+)"?/g, function ($1) {
                extendAttr += $1 + ' '
            });
            return '<li ' + (isDisabled ? ' disabled' : ' tabindex="0"') + ' data-value="' + (value || '') + '" class="dropdown-option ' + (isSelected ? 'dropdown-chose' : '') + '" ' + extendAttr + '>' + (name ? name[1] : '') + '</li>';
        });

        return result;
    }

    function objectToSelect(data) {
        var dropdown = this;
        var map = {};
        var result = '';
        var name = [];
        var selectAmount = 0;
        var extendProps = dropdown.config.extendProps;

        if (!data || !data.length) {
            return false;
        }

        $.each(data, function (index, val) {
            var hasGroup = val.grouporder;
            var isDisabled = val.disabled ? ' disabled' : '';
            var isSelected = (val.selected.toString() == "true" ? true : false) && !isDisabled ? ' selected' : '';
            var extendAttr = ''
            $.each(extendProps, function (index, value) {
                //if (val[value]) {
                if (val.mslist == value) {
                    extendAttr += 'data-' + value + '="' + val.mslist + '" '
                }
            })
            var temp = '<option' + isDisabled + isSelected + ' value="' + val.mslist + '" ' + extendAttr + '>' + val.mslist + '</option>';
            if (isSelected) {
                name.push('<span class="dropdown-selected">' + val.mslist + '<i class="del" data-id="' + val.mslist + '"></i></span>');
                selectAmount++;
            }
            if (hasGroup) {
                if (map[val.grouporder]) {
                    map[val.grouporder] += temp;
                } else {
                    map[val.grouporder] = val.groupby + '♦*♦' + temp;
                }
            } else {
                map[index] = temp;
            }
        });

        $.each(map, function (index, val) {
            var option = val.split('♦*♦');
            if (option.length === 2) {
                var groupName = option[0];
                var items = option[1];
                result += '<optgroup label="' + groupName + '" data-group-id="' + index + '">' + items + '</optgroup>';
            } else {
                result += val;
            }
        });

        return [result, name, selectAmount];
    }

    function selectToObject(el) {
        var $select = el;
        var result = [];

        function readOption(key, el) {
            var $option = $(el);
            this.id = $option.prop('value');
            this.name = $option.text();
            this.disabled = $option.prop('disabled');
            this.selected = $option.prop('selected');
        }

        $.each($select.children(), function (key, el) {
            var tmp = {};
            var tmpGroup = {};
            var $el = $(el);
            if (el.nodeName === 'OPTGROUP') {
                tmpGroup.grouporder = $el.data('groupId');
                tmpGroup.groupby = $el.attr('label');
                $.each($el.children(), $.proxy(readOption, tmp));
                $.extend(tmp, tmpGroup);
            } else {
                $.each($el, $.proxy(readOption, tmp));
            }
            result.push(tmp);
        });

        return result;
    }

    var action = {
        show: function (event) {
            event.stopPropagation();
            var _dropdown = this;
            $(document).trigger('click.dropdown');
            _dropdown.$el.addClass('active');
        },
        search: throttle(function (event) {
            var _dropdown = this;
            var _config = _dropdown.config;
            var $el = _dropdown.$el;
            var $input = $(event.target);
            var intputValue = $input.val();
            var data = _dropdown.config.data;
            var result = [];
            if (event.keyCode > 36 && event.keyCode < 41) {
                return;
            }
            $.each(data, function (key, value) {
                if ((value.groupby && value.groupby.toLowerCase().indexOf(intputValue.toLowerCase()) > -1) || value.mslist.toLowerCase().indexOf(intputValue.toLowerCase()) > -1 || '' + value.mslist === '' + intputValue) {
                    result.push(value);
                }
            });
            var $groupLength = $("select#" + $el.find("select").attr("id") + " optgroup").length;
            $el.find('ul').html(selectToDiv(objectToSelect.call(_dropdown, result)[0], $groupLength) || _config.searchNoData);
        }, 300),
        control: function (event) {
            var keyCode = event.keyCode;
            var KC = KEY_CODE;
            var index = 0;
            var direct;
            var itemIndex;
            var $items;
            if (keyCode === KC.down || keyCode === KC.up) {
                direct = keyCode === KC.up ? -1 : 1;
                $items = this.$el.find('[tabindex]');
                itemIndex = $items.index($(document.activeElement));
                if (itemIndex === -1) {
                    index = direct + 1 ? -1 : 0;
                } else {
                    index = itemIndex;
                }
                index = index + direct;
                if (index === $items.length) {
                    index = 0;
                }
                $items.eq(index).focus();
                event.preventDefault();
            }
        },
        multiChoose: function (event, status) {
            var _dropdown = this;
            var _config = _dropdown.config;
            var $select = _dropdown.$select;
            var $target = $(event.target);
            var value = $target.attr('data-value');
            var hasSelected = $target.hasClass('dropdown-chose');
            var selectedName = [];
            var selectedProp;

            if ($target.hasClass('dropdown-display')) {
                return false;
            }

            if (hasSelected) {
                $target.removeClass('dropdown-chose');
                _dropdown.selectAmount--;
            } else {
                if (_dropdown.selectAmount < _config.limitCount) {
                    $target.addClass('dropdown-chose');
                    _dropdown.selectAmount++;
                } else {
                    //maxItemAlert.call(_dropdown);
                    return false;
                }
            }

            _dropdown.name = [];

            $.each(_config.data, function (key, item) {
                if ('' + item.mslist === '' + value) {
                    selectedProp = item;
                    item.selected = hasSelected ? false : true;
                }
                else
                    item.selected = item.selected.toString() == "true" ? true : false;
                if (item.selected) {
                    selectedName.push(item.mslist);
                    _dropdown.name.push('<span class="dropdown-selected">' + item.mslist + '<i class="del" data-id="' + item.mslist + '"></i></span>');
                }
            });

            $select.find('option[value="' + value + '"]').prop('selected', hasSelected ? false : true);

            if (hasSelected && _dropdown.selectAmount < _config.minCount) {
                minItemsAlert.call(_dropdown);
            }

            _dropdown.$choseList.find('.dropdown-selected').remove();
            _dropdown.$choseList.prepend(_dropdown.name.join(''));
            _dropdown.$el.find('.dropdown-display').attr('title', selectedName.join(','));
            _config.choice.call(_dropdown, event, selectedProp);
        },
        singleChoose: function (event) {
            var _dropdown = this;
            var _config = _dropdown.config;
            var $el = _dropdown.$el;
            var $select = _dropdown.$select;
            var $target = $(event.target);
            var value = $target.attr('data-value');
            var hasSelected = $target.hasClass('dropdown-chose');

            if ($target.hasClass('dropdown-chose') || $target.hasClass('dropdown-display')) {
                return false;
            }

            _dropdown.name = [];


            $el.removeClass('active').find('li').not($target).removeClass('dropdown-chose');

            $target.toggleClass('dropdown-chose');
            $.each(_config.data, function (key, item) {
                item.selected = false;
                if ('' + item.id === '' + value) {
                    item.selected = hasSelected ? 0 : 1;
                    if (item.selected) {
                        _dropdown.name.push('<span class="dropdown-selected">' + item.name + '<i class="del" data-id="' + item.id + '"></i></span>');
                    }
                }
            });

            $select.find('option[value="' + value + '"]').prop('selected', true);

            _dropdown.name.push('<span class="placeholder">' + _dropdown.placeholder + '</span>');
            _dropdown.$choseList.html(_dropdown.name.join(''));
            _config.choice.call(_dropdown, event);
        },
        del: function (event) {
            var _dropdown = this;
            var _config = _dropdown.config;
            var $target = $(event.target);
            var id = $target.data('id');
            $.each(_dropdown.name, function (key, value) {
                if (value.indexOf('data-id="' + id + '"') !== -1) {
                    _dropdown.name.splice(key, 1);
                    return false;
                }
            });

            $.each(_dropdown.config.data, function (key, item) {
                if ('' + item.mslist == '' + id) {
                    item.selected = false;
                    return false;
                }
            });

            _dropdown.selectAmount--;
            _dropdown.$el.find('[data-value="' + id + '"]').removeClass('dropdown-chose');
            _dropdown.$el.find('[value="' + id + '"]').prop('selected', false).removeAttr('selected');
            $target.closest('.dropdown-selected').remove();
            _config.choice.call(_dropdown, event);

            return false;
        },
        clearAll: function (event) {
            var _dropdown = this;
            var _config = _dropdown.config;
            event && event.preventDefault();
            console.log(this)
            this.$choseList.find('.del').each(function (index, el) {
                $(el).trigger('click');
            });

            if (_config.minCount > 0) {
                minItemsAlert.call(_dropdown);
            }

            this.$el.find('.dropdown-display').removeAttr('title');
            return false;
        }
    };

    function Dropdown(options, el) {
        this.$el = $(el);
        this.$select = this.$el.find('select');
        this.placeholder = this.$select.attr('placeholder');
        this.config = options;
        this.name = [];
        this.isSingleSelect = !this.$select.prop('multiple');
        this.selectAmount = 0;
        this.itemLimitAlertTimer = null;
        this.isLabelMode = this.config.multipleMode === 'label';
        this.init();
    }

    Dropdown.prototype = {
        init: function () {
            var _this = this;
            var _config = _this.config;
            var $el = _this.$el;
            _this.$select.hide();
            $el.addClass(_this.isSingleSelect ? 'dropdown-single' : _this.isLabelMode ? 'dropdown-multiple-label' : 'dropdown-multiple');

            if (_config.data.length === 0) {
                _config.data = selectToObject(_this.$select);
            }

            var processResult = objectToSelect.call(_this, _config.data);

            _this.name = processResult[1];
            _this.selectAmount = processResult[2];
            _this.$select.html(processResult[0]);
            _this.renderSelect();
            _this.changeStatus(_config.disabled ? 'disabled' : _config.readonly ? 'readonly' : false);

            _this.config.init();
        },
        renderSelect: function (isUpdate, isCover) {
            var _this = this;
            var $el = _this.$el;
            var $select = _this.$select;
            let $fldId = $select.attr("id");
            var $groupLength = $("select#" + $fldId + " optgroup").length;
            var elemLi = selectToDiv($select.prop('outerHTML'), $groupLength);
            var template;

            if (isUpdate) {
                $el.find('ul')[isCover ? 'html' : 'append'](elemLi);
            } else {
                template = createTemplate.call(_this).replace('{{ul}}', '<ul>' + elemLi + '</ul>');
                $el.append(template).find('ul').removeAttr('style class');
            }

            if (isCover) {
                _this.name = [];
                _this.$el.find('.dropdown-selected').remove();
                _this.$select.val('');
            }

            _this.$choseList = $el.find('.dropdown-chose-list');

            if (!_this.isLabelMode) {
                _this.$choseList.html($('<span class="placeholder"></span>').text(_this.placeholder));
            }

            _this.$choseList.prepend(_this.name ? _this.name.join('') : []);
        },
        bindEvent: function () {
            var _this = this;
            var $el = _this.$el;
            var openHandle = isSafari ? EVENT_SPACE.click : EVENT_SPACE.focus;

            $el.on(EVENT_SPACE.click, function (event) {
                event.stopPropagation();
            });

            $el.on(EVENT_SPACE.click, '.del', $.proxy(action.del, _this));

            // show
            if (_this.isLabelMode) {
                $el.on(EVENT_SPACE.click, '.dropdown-display-label', function () {
                    $el.find('input').focus();
                });
                if (_this.config.searchable) {
                    $el.on(EVENT_SPACE.focus, 'input', $.proxy(action.show, _this));
                } else {
                    $el.on(EVENT_SPACE.click, $.proxy(action.show, _this));
                }
                $el.on(EVENT_SPACE.keydown, 'input', function (event) {
                    if (event.keyCode === 8 && this.value === '' && _this.name.length) {
                        $el.find('.del').eq(-1).trigger('click');
                    }
                });
            } else {
                $el.on(openHandle, '.dropdown-display', $.proxy(action.show, _this));
                $el.on(openHandle, '.dropdown-clear-all', $.proxy(action.clearAll, _this));
            }
            $el.on(EVENT_SPACE.keyup, 'input', $.proxy(action.search, _this));
            $el.on(EVENT_SPACE.keyup, function (event) {
                var keyCode = event.keyCode;
                var KC = KEY_CODE;
                if (keyCode === KC.enter) {
                    $.proxy(_this.isSingleSelect ? action.singleChoose : action.multiChoose, _this, event)();
                }
            });
            $el.on(EVENT_SPACE.keydown, $.proxy(action.control, _this));

            $el.on(EVENT_SPACE.click, 'li[tabindex]', $.proxy(_this.isSingleSelect ? action.singleChoose : action.multiChoose, _this));
        },
        unbindEvent: function () {
            var _this = this;
            var $el = _this.$el;
            var openHandle = isSafari ? EVENT_SPACE.click : EVENT_SPACE.focus;

            $el.off(EVENT_SPACE.click);
            $el.off(EVENT_SPACE.click, '.del');

            // show
            if (_this.isLabelMode) {
                $el.off(EVENT_SPACE.click, '.dropdown-display-label');
                $el.off(EVENT_SPACE.focus, 'input');
                $el.off(EVENT_SPACE.keydown, 'input');
            } else {
                $el.off(openHandle, '.dropdown-display');
                $el.off(openHandle, '.dropdown-clear-all');
            }
            $el.off(EVENT_SPACE.keyup, 'input');
            // $el.off(EVENT_SPACE.keyup);
            // $el.off(EVENT_SPACE.keydown);
            // $el.off(EVENT_SPACE.keydown);
            $el.off(EVENT_SPACE.click, '[tabindex]');
        },
        changeStatus: function (status) {
            var _this = this;
            if (status === 'readonly') {
                _this.unbindEvent();
            } else if (status === 'disabled') {
                _this.$select.prop('disabled', true);
                _this.unbindEvent();
            } else {
                _this.$select.prop('disabled', false);
                _this.bindEvent();
            }
        },
        update: function (data, isCover) {
            var _this = this;
            var _config = _this.config;
            var $el = _this.$el;
            var _isCover = isCover || false;

            //if (Object.prototype.toString.call(data) !== '[object Array]') {
            //    return;
            //}

            _config.data = _isCover ? data.slice(0) : _config.data.concat(data);

            var processResult = objectToSelect.call(_this, _config.data);

            _this.name = processResult[1];
            _this.selectAmount = processResult[2];
            _this.$select.html(processResult[0]);
            _this.renderSelect(true, false);
        },
        destroy: function () {
            this.unbindEvent();
            this.$el.children().not('select').remove();
            this.$el.removeClass('dropdown-single dropdown-multiple-label dropdown-multiple');
            this.$select.show();
        },
        choose: function (values, status) {
            var valArr = Object.prototype.toString.call(values) === '[object Array]' ? values : [values];
            var _this = this;
            var _status = status !== void 0 ? !!status : true
            $.each(valArr, function (index, value) {
                var $target = _this.$el.find('[data-value="' + value + '"]');
                var targetStatus = $target.hasClass('dropdown-chose');
                if (targetStatus !== _status) {
                    $target.trigger(EVENT_SPACE.click, status || true)
                }
            });
        },
        reset: function () {
            action.clearAll.call(this)
        }
    };

    $(document).on('click.dropdown', function (el) {
        $('.dropdown-single,.dropdown-multiple,.dropdown-multiple-label').removeClass('active');
    });

    $.fn.dropdown = function (options) {
        this.each(function (index, el) {
            $(el).data('dropdown', new Dropdown($.extend(true, {}, settings, options), el));
        });
        return this;
    }

})(jQuery);


function GetMultiSelectValues(msfldId, parentFldVal) {
    var msData = "";
    var refreshMs = false
    var fldNameMs = $(msfldId).find("select").attr('id');
    var isrefreshsave = $(msfldId).find("select").hasClass('isrefreshsave');
    var fieldName = fldNameMs.substring(0, fldNameMs.lastIndexOf("F") - 3);
    //var parentFldVal = "";
    //if (typeof wsPerfEnabled != "undefined" && wsPerfEnabled)
    //    parentFldVal = ISBoundAutoCom(fieldName, fldNameAc);
    //else
    //    parentFldVal = ISBoundNew(fieldName, fldNameAc);
    var pageData = GetMultiSelectPageData(fldNameMs, "", 1, AutPageSize);
    $.ajax({
        url: 'tstruct.aspx/GetMultiSelectValues',
        type: 'POST',
        cache: false,
        async: false,
        data: JSON.stringify({
            tstDataId: tstDataId, FldName: fieldName, ChangedFields: ChangedFields, ChangedFieldDbRowNo: ChangedFieldDbRowNo,
            ChangedFieldValues: ChangedFieldValues, DeletedDCRows: DeletedDCRows, fldNameMs: fldNameMs, refreshMs: refreshMs,
            parentsFlds: parentFldVal, rfSave: isrefreshsave, pageData: pageData
        }),
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            var result = data.d.toString().replace(new RegExp("\\n", "g"), "");
            if (CheckSessionTimeout(result))
                return;
            result = result.toString().replace(new RegExp("\\t", "g"), "&#9;");
            ChangedFields = new Array();
            ChangedFieldDbRowNo = new Array();
            ChangedFieldValues = new Array();
            DeletedDCRows = new Array();
            if (result.toLowerCase().indexOf("access violation") === -1) {
                var serResult = $.parseJSON(result);
                if (serResult.error) {
                    ExecErrorMsg(serResult.error, "autocomplete");
                    return;
                }
                msData = serResult.multiselectdata[3].data;
            }
        },
        error: function (error) {
        }
    });
    return msData;
}

function GetMultiSelectPageData(fldNameMs, value, curPageNo, AutPageSize) {
    var includeDcs = "";
    if (arrRefreshDcs.length > 0) {
        for (var i = 0; i < arrRefreshDcs.length; i++) {
            var arrDcNos = arrRefreshDcs[i].split(':');
            includeDcs = arrDcNos[1].replace("dc", "") + ',' + arrDcNos[0].replace("dc", "");
        }
    }
    value = CheckSpecialCharsInStr(value);
    var fldDcNo = GetFieldsDcNo(fldNameMs);

    AxActiveRowNo = parseInt(GetFieldsRowNo(fldNameMs), 10);
    AxActiveRowNo = GetDbRowNo(AxActiveRowNo, fldDcNo);
    var activeRow = AxActiveRowNo;

    var parStr = "";
    if (AxActivePRow != "" && AxActivePDc != "")
        parStr = AxActivePDc + "♠" + AxActivePRow;

    var subStr = "";
    if (IsParentField(fldNameMs, fldDcNo))
        subStr = GetSubGridInfoForParent(fldDcNo, AxActiveRowNo);
    return curPageNo.toString() + "~" + AutPageSize.toString() + "~" + fldDcNo + "~" + activeRow + "~" + parStr + "~" + subStr + "~" + includeDcs;
}
