'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function ($) {
    var CronPicker = function () {
        function CronPicker(wrapper, hostControl, settings) {
            _classCallCheck(this, CronPicker);

            this.wrapper = wrapper;
            this.hostControl = hostControl;
            this.settings = settings;

            this._buildControl();
            this._setRecurrenceType('Daily');
        }

        _createClass(CronPicker, [{
            key: '_buildControl',
            value: function _buildControl() {
                var container = $('<div>', {
                    class: 'cron-picker-container',
                    html: [this._buildRecurrenceTypes(), this._buildDaysOfWeeks(), this._buildTimePicker()]
                });

                this.wrapper.append(container);
            }
        }, {
            key: '_buildTimePicker',
            value: function _buildTimePicker() {
                var _this = this;

                var hours = $('<select>', {
                    html: this._buildOptions(24),
                    class: 'form-control cron-picker-hours'
                }).on('change', function () {
                    return _this._buildCronExpression();
                });

                var minutes = $('<select>', {
                    html: this._buildOptions(60),
                    class: 'form-control cron-picker-minutes'
                }).on('change', function () {
                    return _this._buildCronExpression();
                });

                return $('<div>', {
                    class: 'cron-picker-time',
                    html: ['Run at:', hours, '-', minutes]
                });
            }
        }, {
            key: '_buildOptions',
            value: function _buildOptions(max) {
                return [].concat(_toConsumableArray(Array(max).keys())).map(function (v) {
                    return '<option value="' + v + '">' + ("0" + v).slice(-2) + '</option>';
                }).join();
            }
        }, {
            key: '_buildRecurrenceTypes',
            value: function _buildRecurrenceTypes() {
                return $('<ul>', {
                    class: 'nav nav-pills cron-picker-recurrence-types',
                    html: [this._buildRecurrenceType('Daily'), this._buildRecurrenceType('Weekly')]
                });
            }
        }, {
            key: '_buildRecurrenceType',
            value: function _buildRecurrenceType(type) {
                var _this2 = this;

                return $('<li>', {
                    'data-type': type,
                    html: $('<a>', { text: type }).on('click', function () {
                        return _this2._setRecurrenceType(type);
                    })
                });
            }
        }, {
            key: '_buildDaysOfWeeks',
            value: function _buildDaysOfWeeks() {
                return $('<div>', {
                    class: 'cron-picker-dow',
                    html: [this._buildDayOfWeekButton('SUN'), this._buildDayOfWeekButton('MON'), this._buildDayOfWeekButton('TUE'), this._buildDayOfWeekButton('WED'), this._buildDayOfWeekButton('THU'), this._buildDayOfWeekButton('FRI'), this._buildDayOfWeekButton('SAT')]
                });
            }
        }, {
            key: '_buildDayOfWeekButton',
            value: function _buildDayOfWeekButton(text) {
                var self = this;
                return $('<button>', { type: 'button', class: 'btn btn-default btn-sm', text: text }).on('click', function () {
                    $(this).toggleClass('active');
                    self._buildCronExpression();
                });
            }
        }, {
            key: '_setRecurrenceType',
            value: function _setRecurrenceType(type) {
                this.wrapper.find('li').removeClass('active');
                this.wrapper.find('[data-type=' + type + ']').addClass('active');

                if (type == 'Weekly') {
                    this.wrapper.find('.cron-picker-dow').removeClass('hidden');
                } else {
                    this.wrapper.find('.cron-picker-dow').addClass('hidden');
                }

                this._buildCronExpression();
            }
        }, {
            key: '_buildCronExpression',
            value: function _buildCronExpression() {
                var results = "";
                var type = this.wrapper.find('[data-type].active').data('type');
                var hours = this.wrapper.find('.cron-picker-hours').val(),
                    minutes = this.wrapper.find('.cron-picker-minutes').val();
                switch (type) {
                    case "Daily":
                        results = '0 ' + minutes + ' ' + hours + ' 1 * ? *';
                        break;
                    case "Weekly":
                        var selected = this.wrapper.find('.cron-picker-dow > button.active');
                        var dow = [].map.call(selected, function (item) {
                            return item.innerText;
                        }).join(',');
                        results = '0 ' + minutes + ' ' + hours + ' ? * ' + dow + ' *';
                        break;
                    // case "Monthly":
                    //     switch ($("input:radio[name=MonthlyRadio]:checked").val()) {
                    //         case "1":
                    //             results = "0 " + Number($("#MonthlyMinutes").val()) + " " + Number($("#MonthlyHours").val()) + " " + $("#DayOfMOnthInput").val() + " 1/" + $("#MonthInput").val() + " ? *";
                    //             break;
                    //         case "2":
                    //             results = "0 " + Number($("#MonthlyMinutes").val()) + " " + Number($("#MonthlyHours").val()) + " ? 1/" + Number($("#EveryMonthInput").val()) + " " + $("#DayInWeekOrder").val() + "#" + $("#WeekDay").val() + " *";
                    //             break;
                    //     }
                    //     break;
                }
                console.log(results);
            }
        }]);

        return CronPicker;
    }();

    $.fn.cronPicker = function (options) {
        var defaults = {};
        var settings = $.extend({}, defaults, options);

        this.each(function (i, hostControl) {
            hostControl = $(hostControl);

            if (hostControl.data('cron-picker') === '1') return;

            var wrapper = $('\n                <div class="cron-picker">\n                </div>');

            hostControl.after(wrapper).hide().data('cron-picker', '1');
            return new CronPicker(wrapper, hostControl, settings);
        });
    };
})(jQuery);