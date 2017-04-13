'use strict';

function StandardCronFormatter() {}

StandardCronFormatter.parse = function (cron) {
    var state = {};
    var parts = cron.split(' ');
    if (parts.length !== 5 && parts.length !== 6) {
        console.warn('Invalid cron expression. Skip parsing...');
    } else {
        state.hours = parts[1];
        state.minutes = parts[0];

        if (parts[3] === '*' && parts[4] === '*' && parts[5] === '*') {

            // daily
            state.type = 'Daily';
        } else if (parts[3] == '*' && parts[4] !== '*') {

            // weekly
            state.type = 'Weekly';
            state.daysOfWeek = parts[4] === '' ? [] : parts[4].split(',');
        } else if (parts[3] !== '*') {

            // monthly
            state.type = 'Monthly';
            state.monthRepeater = parts[3].split('/')[1];
            state.dayFilter = 'day';
            state.dayNumber = parts[2];
        }
    }
    return state;
};

StandardCronFormatter.build = function (state) {
    switch (state.type) {
        case "Daily":
            return state.minutes + ' ' + state.hours + ' * * *';
        case "Weekly":
            var dow = state.daysOfWeek.sort().join(',');
            return state.minutes + ' ' + state.hours + ' * * ' + dow;
        case "Monthly":
            return state.minutes + ' ' + state.hours + ' ' + state.dayNumber + ' */' + state.monthRepeater + ' *';
    }
};
'use strict';

function QuartzCronFormatter() {}

QuartzCronFormatter.parse = function (cron) {
    var state = {};
    var parts = cron.split(' ');
    if (parts.length !== 7) {
        console.warn('Invalid cron expression. Skip parsing...');
    } else {
        state.hours = parts[2];
        state.minutes = parts[1];

        if (parts[4] === '*' && parts[5] === '?' && parts[6] === '*') {

            // daily
            state.type = 'Daily';
        } else if (parts[4] == '*' && parts[5] !== '?') {

            // weekly
            state.type = 'Weekly';
            state.daysOfWeek = parts[5] === '' ? [] : parts[5].split(',');
        } else if (parts[4] !== '*') {

            // monthly
            state.type = 'Monthly';
            state.monthRepeater = parts[4].split('/')[1];

            if (parts[5] === '?') {
                state.dayFilter = 'day';
                state.dayNumber = parts[3];
            } else {
                state.dayFilter = 'weekday';
                state.dayOfWeek = parts[5].substr(0, 3);
                state.ordCondition = parts[5].substr(3);
            }
        }
    }
    return state;
};

QuartzCronFormatter.build = function (state) {
    switch (state.type) {
        case "Daily":
            return '0 ' + state.minutes + ' ' + state.hours + ' 1/1 * ? *';
        case "Weekly":
            var dow = state.daysOfWeek.sort().join(',');
            return '0 ' + state.minutes + ' ' + state.hours + ' ? * ' + dow + ' *';
        case "Monthly":
            if (state.dayFilter === 'day') {
                return '0 ' + state.minutes + ' ' + state.hours + ' ' + state.dayNumber + ' 1/' + state.monthRepeater + ' ? *';
            } else if (state.dayFilter == 'weekday') {
                return '0 ' + state.minutes + ' ' + state.hours + ' ? 1/' + state.monthRepeater + ' ' + state.dayOfWeek + state.ordCondition + ' *';
            }
    }
};
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function ($) {
    var CronPicker = function () {
        function CronPicker(wrapper, hostControl, options) {
            _classCallCheck(this, CronPicker);

            this.wrapper = wrapper;
            this.hostControl = hostControl;
            var defaults = {
                format: '24',
                cronFormatter: StandardCronFormatter
            };
            this.settings = $.extend({}, defaults, options);

            this.state = {
                type: 'Daily',
                hours: 0,
                minutes: 0,
                dayNumber: 1,
                monthRepeater: 1,
                ordCondition: '#1',
                daysOfWeek: [],
                dayFilter: 'day',
                dayOfWeek: 1
            };

            this._buildControl();
            this.setCronExpression(this.hostControl.val());
        }

        _createClass(CronPicker, [{
            key: 'setCronExpression',
            value: function setCronExpression(cronExpression) {
                if (cronExpression.length > 0) {
                    this._parseCronExpression(cronExpression);
                } else {
                    this._buildCronExpression();
                }
                this._updateUI();
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
                var self = this;
                var dayButton = this._buildFilterButton('day');
                var weekDayButton = this._buildFilterButton('weekday');

                var daySelect = $('<select>', {
                    html: CronPicker._buildOptions(31, 1),
                    class: 'form-control cron-picker-day-number'
                }).on('change', function () {
                    self.state.dayNumber = this.value;
                    self._buildCronExpression();
                });

                var monthRepeaterSelect = $('<select>', {
                    html: CronPicker._buildOptions(12, 1),
                    class: 'form-control cron-picker-month-repeater'
                }).on('change', function () {
                    self.state.monthRepeater = this.value;
                    self._buildCronExpression();
                });

                var buttonContainer = $('<div>', {
                    class: 'btn-group',
                    html: [] // TODO: [dayButton, weekDayButton]
                });

                var dayFilterContainer = $('<div>', {
                    class: 'cron-picker-day-type-filter',
                    html: [daySelect, 'day&nbsp;']
                });

                var ordinalitySelect = $('<select>', {
                    class: 'form-control cron-picker-ord-select',
                    html: this._buildOrdinalityOptions()
                }).on('change', function () {
                    self.state.ordCondition = this.value;
                    self._buildCronExpression();
                });

                var dayOfWeekSelect = $('<select>', {
                    class: 'form-control cron-picker-dow-select',
                    html: this._buildDaysOfWeekOptions()
                }).on('change', function () {
                    self.state.dayOfWeek = this.value;
                    self._buildCronExpression();
                });

                var weekdayFilterContainer = $('<div>', {
                    class: 'cron-picker-weekday-type-filter',
                    html: [ordinalitySelect, dayOfWeekSelect]
                });

                return $('<div>', {
                    class: 'cron-picker-day-filter',
                    html: [buttonContainer, dayFilterContainer, weekdayFilterContainer, 'of every', monthRepeaterSelect, 'month(s)']
                });
            }
        }, {
            key: '_buildOrdinalityOptions',
            value: function _buildOrdinalityOptions() {
                return [['First', '#1'], ['Second', '#2'], ['Third', '#3'], ['Last', 'L']].map(function (pair) {
                    return $('<option>', { value: pair[1], text: pair[0] });
                });
            }
        }, {
            key: '_buildDaysOfWeekOptions',
            value: function _buildDaysOfWeekOptions() {
                return [['Monday', 1], ['Tuesday', 2], ['Wednesday', 3], ['Thurdsay', 4], ['Friday', 5], ['Saturday', 6], ['Sunday', 7]].map(function (pair) {
                    return $('<option>', { value: pair[1], text: pair[0] });
                });
            }
        }, {
            key: '_buildFilterButton',
            value: function _buildFilterButton(type) {
                var self = this;
                return $('<button>', {
                    type: 'button',
                    class: 'btn btn-default',
                    text: type.toUpperCase(),
                    'data-day-filter': type
                }).on('click', function () {
                    self.state.dayFilter = this.getAttribute('data-day-filter');
                    self._buildCronExpression();
                    self._updateUI();
                });
            }
        }, {
            key: '_buildTimePicker',
            value: function _buildTimePicker() {
                return $('<div>', {
                    class: 'cron-picker-time',
                    html: ['Run at:', this._buildHourPicker(), '-', this._buildMinutesPicker(), this._buildAMPMPicker()]
                });
            }
        }, {
            key: '_buildHourPicker',
            value: function _buildHourPicker() {
                var self = this;
                if (self.settings.format === '24') {
                    return $('<select>', {
                        html: CronPicker._buildOptions(24),
                        class: 'form-control cron-picker-hours'
                    }).on('change', function () {
                        self._setHours();
                        self._buildCronExpression();
                    });
                } else {
                    return $('<select>', {
                        html: CronPicker._buildOptions(12, 1),
                        class: 'form-control cron-picker-hours'
                    }).on('change', function () {
                        self._setHours();
                        self._buildCronExpression();
                    });
                }
            }
        }, {
            key: '_setHours',
            value: function _setHours() {
                var hours = parseInt(this.wrapper.find('.cron-picker-hours').val());
                if (this.settings.format == '12') {
                    var ampm = this.wrapper.find('.cron-picker-ampm').val();
                    if (ampm == "PM" && hours < 12) hours = hours + 12;
                    if (ampm == "AM" && hours == 12) hours = hours - 12;
                }
                this.state.hours = hours;
            }
        }, {
            key: '_buildAMPMPicker',
            value: function _buildAMPMPicker() {
                var self = this;
                if (self.settings.format === '12') {
                    return $('<select>', {
                        html: ["<option value='AM'>AM</option>", "<option value='PM'>PM</option>"],
                        class: 'form-control cron-picker-ampm'
                    }).on('change', function () {
                        self._setHours();
                        self._buildCronExpression();
                    });
                }
            }
        }, {
            key: '_buildMinutesPicker',
            value: function _buildMinutesPicker() {
                var self = this;

                return $('<select>', {
                    html: CronPicker._buildOptions(60),
                    class: 'form-control cron-picker-minutes'
                }).on('change', function () {
                    self.state.minutes = this.value;
                    self._buildCronExpression();
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
                var _this = this;

                return $('<div>', {
                    class: 'cron-picker-dow',
                    html: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(function (item, index) {
                        return _this._buildDayOfWeekButton(item, index + 1);
                    })
                });
            }
        }, {
            key: '_buildDayOfWeekButton',
            value: function _buildDayOfWeekButton(text, value) {
                var self = this;
                return $('<button>', { type: 'button', class: 'btn btn-default', text: text, 'data-dow': value }).on('click', function () {
                    var value = this.getAttribute('data-dow');
                    var index = self.state.daysOfWeek.indexOf(value);
                    if (index === -1) {
                        self.state.daysOfWeek.push(value);
                    } else {
                        self.state.daysOfWeek.splice(index, 1);
                    }
                    self._buildCronExpression();
                    self._updateUI();
                });
            }
        }, {
            key: '_formatHours',
            value: function _formatHours(hours) {
                if (this.settings.format == '24') {
                    return [hours, null];
                } else {
                    return [hours % 12 || 12, hours < 12 ? "AM" : "PM"];
                }
            }
        }, {
            key: '_parseCronExpression',
            value: function _parseCronExpression(cron) {
                var newState = this.settings.cronFormatter.parse(cron);
                $.extend(this.state, newState);
            }
        }, {
            key: '_updateUI',
            value: function _updateUI() {
                var _this2 = this;

                // Set controls value based on current state

                this.wrapper.find('li').removeClass('active');
                this.wrapper.find('[data-type=' + this.state.type + ']').addClass('active');

                this.wrapper.find('[data-day-filter]').removeClass('active');
                this.wrapper.find('[data-day-filter=' + this.state.dayFilter + ']').addClass('active');

                this.wrapper.find('.cron-picker-dow > button.active').removeClass('active');
                this.state.daysOfWeek.forEach(function (dow) {
                    _this2.wrapper.find('.cron-picker-dow > button[data-dow=' + dow + ']').addClass('active');
                });

                this.wrapper.find('.cron-picker-minutes').val(this.state.minutes);

                var formatted = this._formatHours(this.state.hours);
                this.wrapper.find('.cron-picker-hours').val(formatted[0]);
                this.wrapper.find('.cron-picker-ampm').val(formatted[1]);

                this.wrapper.find('.cron-picker-dow-select').val(this.state.dayOfWeek);
                this.wrapper.find('.cron-picker-month-repeater').val(this.state.monthRepeater);
                this.wrapper.find('.cron-picker-ord-select').val(this.state.ordCondition);
                this.wrapper.find('.cron-picker-day-number').val(this.state.dayNumber);

                // Set controls visibility

                if (this.state.type == 'Weekly') {
                    this.wrapper.find('.cron-picker-dow').removeClass('hidden');
                } else {
                    this.wrapper.find('.cron-picker-dow').addClass('hidden');
                }

                if (this.state.type == 'Monthly') {
                    this.wrapper.find('.cron-picker-day-filter').removeClass('hidden');
                } else {
                    this.wrapper.find('.cron-picker-day-filter').addClass('hidden');
                }

                if (this.state.dayFilter == 'day') {
                    this.wrapper.find('.cron-picker-day-type-filter').removeClass('hidden');
                    this.wrapper.find('.cron-picker-weekday-type-filter').addClass('hidden');
                } else {
                    this.wrapper.find('.cron-picker-day-type-filter').addClass('hidden');
                    this.wrapper.find('.cron-picker-weekday-type-filter').removeClass('hidden');
                }
            }
        }, {
            key: '_buildCronExpression',
            value: function _buildCronExpression() {
                var cronExpression = this.settings.cronFormatter.build(this.state);
                this.hostControl.val(cronExpression);
                if (typeof this.settings.onCronChanged === "function") {
                    this.settings.onCronChanged(cronExpression);
                }
            }
        }], [{
            key: '_buildOptions',
            value: function _buildOptions(max, offset) {
                offset = offset || 0;
                return [].concat(_toConsumableArray(Array(max).keys())).map(function (v) {
                    return '<option value="' + (v + offset) + '">' + ("0" + (v + offset)).slice(-2) + '</option>';
                }).join();
            }
        }]);

        return CronPicker;
    }();

    $.fn.cronPicker = function (options) {
        var defaults = {
            onCronChanged: null
        };
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