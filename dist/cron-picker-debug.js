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
            this.state = {
                type: 'Daily',
                hours: 0,
                minutes: 0,
                daysOfWeek: [],
                dayFilter: 'day'
            };

            this._buildControl();
            this.setCronExpression(this.hostControl.val());
        }

        _createClass(CronPicker, [{
            key: 'setCronExpression',
            value: function setCronExpression(cronExpression) {
                if (cronExpression.length > 0) {
                    this._parseCronExpression(cronExpression);
                }
                this._updateUI();
            }
        }, {
            key: '_setDayFilter',
            value: function _setDayFilter(type) {
                this.wrapper.find('.cron-picker-day-filter > button').removeClass('active');
                this.wrapper.find('[data-day-filter=' + type + ']').addClass('active');
            }
        }, {
            key: '_buildControl',
            value: function _buildControl() {
                var container = $('<div>', {
                    class: 'cron-picker-container',
                    html: [this._buildRecurrenceTypes(), this._buildDaysOfWeeks(), this._buildMonthlyFilter(), this._buildTimePicker()]
                });

                this.wrapper.append(container);
            }
        }, {
            key: '_buildMonthlyFilter',
            value: function _buildMonthlyFilter() {
                return $('<div>', {
                    class: 'btn-group btn-group-sm cron-picker-day-filter',
                    html: [$('<button>', { type: 'button', class: 'btn btn-default', text: 'DAY', 'data-day-filter': 'day' }), $('<button>', { type: 'button', class: 'btn btn-default', text: 'WEEKDAY', 'data-day-filter': 'weekday' })]
                });
            }
        }, {
            key: '_buildTimePicker',
            value: function _buildTimePicker() {
                var self = this;

                var hours = $('<select>', {
                    html: CronPicker._buildOptions(24),
                    class: 'form-control cron-picker-hours'
                }).on('change', function () {
                    self.state.hours = this.value;
                    self._buildCronExpression();
                });

                var minutes = $('<select>', {
                    html: CronPicker._buildOptions(60),
                    class: 'form-control cron-picker-minutes'
                }).on('change', function () {
                    self.state.minutes = this.value;
                    self._buildCronExpression();
                });

                return $('<div>', {
                    class: 'cron-picker-time',
                    html: ['Run at:', hours, '-', minutes]
                });
            }
        }, {
            key: '_buildRecurrenceTypes',
            value: function _buildRecurrenceTypes() {
                return $('<ul>', {
                    class: 'nav nav-pills cron-picker-recurrence-types',
                    html: [this._buildRecurrenceType('Daily'), this._buildRecurrenceType('Weekly'), this._buildRecurrenceType('Monthly')]
                });
            }
        }, {
            key: '_buildRecurrenceType',
            value: function _buildRecurrenceType(type) {
                var self = this;
                return $('<li>', {
                    'data-type': type,
                    html: $('<a>', { text: type }).on('click', function () {
                        self.state.type = this.parentNode.getAttribute('data-type');
                        self._buildCronExpression();
                        self._updateUI();
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
                    var index = self.state.daysOfWeek.indexOf(this.innerText);
                    if (index === -1) {
                        self.state.daysOfWeek.push(this.innerText);
                    } else {
                        self.state.daysOfWeek.splice(index, 1);
                    }
                    self._buildCronExpression();
                    self._updateUI();
                });
            }
        }, {
            key: '_parseCronExpression',
            value: function _parseCronExpression(cron) {
                var components = cron.split(' ');
                if (components.length !== 7) {
                    console.warn('Invalid cron expression. Skip parsing...');
                } else {
                    this.state.hours = components[2];
                    this.state.minutes = components[1];

                    if (components[5] !== '?') {
                        this.state.type = 'Weekly';
                        this.state.daysOfWeek = components[5].split(',');
                    } else if (components[4] !== '*') {
                        this.state.type = 'Monthly';
                    } else {
                        this.state.type = 'Daily';
                    }
                }
            }
        }, {
            key: '_updateUI',
            value: function _updateUI() {
                var _this = this;

                this.wrapper.find('.cron-picker-minutes').val(this.state.minutes);
                this.wrapper.find('.cron-picker-hours').val(this.state.hours);

                this.wrapper.find('li').removeClass('active');
                this.wrapper.find('[data-type=' + this.state.type + ']').addClass('active');

                if (this.state.type == 'Weekly') {
                    this.wrapper.find('.cron-picker-dow').removeClass('hidden');
                    this.wrapper.find('.cron-picker-dow > button.active').removeClass('active');
                    this.state.daysOfWeek.forEach(function (dow) {
                        _this.wrapper.find('.cron-picker-dow > button:contains(\'' + dow + '\')').addClass('active');
                    });
                } else {
                    this.wrapper.find('.cron-picker-dow').addClass('hidden');
                }

                if (this.state.type == 'Monthly') {
                    this.wrapper.find('.cron-picker-day-filter').removeClass('hidden');
                } else {
                    this.wrapper.find('.cron-picker-day-filter').addClass('hidden');
                }

                this._setDayFilter(this.state.dayFilter);
            }
        }, {
            key: '_buildCronExpression',
            value: function _buildCronExpression() {
                var results = "";
                switch (this.state.type) {
                    case "Daily":
                        results = '0 ' + this.state.minutes + ' ' + this.state.hours + ' 1 * ? *';
                        break;
                    case "Weekly":
                        var dow = this.state.daysOfWeek;
                        results = '0 ' + this.state.minutes + ' ' + this.state.hours + ' ? * ' + (dow.length > 0 ? dow.join(',') : '?') + ' *';
                        break;
                    case "Monthly":
                        //     switch ($("input:radio[name=MonthlyRadio]:checked").val()) {
                        //         case "1":
                        //             results = "0 " + Number($("#MonthlyMinutes").val()) + " " + Number($("#MonthlyHours").val()) + " " + $("#DayOfMOnthInput").val() + " 1/" + $("#MonthInput").val() + " ? *";
                        //             break;
                        //         case "2":
                        //             results = "0 " + Number($("#MonthlyMinutes").val()) + " " + Number($("#MonthlyHours").val()) + " ? 1/" + Number($("#EveryMonthInput").val()) + " " + $("#DayInWeekOrder").val() + "#" + $("#WeekDay").val() + " *";
                        //             break;
                        //     }
                        break;
                }
                console.log(results);
                this.hostControl.val(results);
            }
        }], [{
            key: '_buildOptions',
            value: function _buildOptions(max) {
                return [].concat(_toConsumableArray(Array(max).keys())).map(function (v) {
                    return '<option value="' + v + '">' + ("0" + v).slice(-2) + '</option>';
                }).join();
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