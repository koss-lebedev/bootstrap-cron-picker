(function ($) {

    class CronPicker {

        constructor(wrapper, hostControl, settings) {
            this.wrapper = wrapper;
            this.hostControl = hostControl;
            this.settings = settings;

            this._buildControl();
            this._setRecurrenceType('Daily');
        }

        _buildControl() {
            const container = $('<div>', {
                class: 'cron-picker-container',
                html: [
                    this._buildRecurrenceTypes(),
                    this._buildDaysOfWeeks(),
                    this._buildTimePicker()
                ]
            });

            this.wrapper.append(container);
        }

        _buildTimePicker() {
            const hours = $('<select>', {
                html: this._buildOptions(24),
                class: 'form-control cron-picker-hours'
            }).on('change', () => this._buildCronExpression());

            const minutes = $('<select>', {
                html: this._buildOptions(60),
                class: 'form-control cron-picker-minutes'
            }).on('change', () => this._buildCronExpression());

            return $('<div>', {
                class: 'cron-picker-time',
                html: [ 'Run at:', hours, '-', minutes ]
            });
        }

        _buildOptions(max) {
            return [...Array(max).keys()].map((v) => `<option value="${v}">${("0"+v).slice(-2)}</option>`).join();
        }

        _buildRecurrenceTypes() {
            return $('<ul>', {
                class: 'nav nav-pills cron-picker-recurrence-types',
                html: [
                    this._buildRecurrenceType('Daily'),
                    this._buildRecurrenceType('Weekly'),
                    // this._buildRecurrenceType('Monthly')
                ]
            });
        }

        _buildRecurrenceType(type) {
            return $('<li>', {
                'data-type': type,
                html: $('<a>', { text: type }).on('click', () => this._setRecurrenceType(type))
            });
        }

        _buildDaysOfWeeks() {
            return $('<div>', {
                class: 'cron-picker-dow',
                html: [
                    this._buildDayOfWeekButton('SUN'),
                    this._buildDayOfWeekButton('MON'),
                    this._buildDayOfWeekButton('TUE'),
                    this._buildDayOfWeekButton('WED'),
                    this._buildDayOfWeekButton('THU'),
                    this._buildDayOfWeekButton('FRI'),
                    this._buildDayOfWeekButton('SAT')
                ]
            })
        }

        _buildDayOfWeekButton(text) {
            const self = this;
            return $('<button>', { type: 'button', class: 'btn btn-default btn-sm', text: text })
                .on('click', function () {
                    $(this).toggleClass('active');
                    self._buildCronExpression();
                });
        }

        _setRecurrenceType(type) {
            this.wrapper.find('li').removeClass('active');
            this.wrapper.find(`[data-type=${type}]`).addClass('active');

            if (type == 'Weekly') {
                this.wrapper.find('.cron-picker-dow').removeClass('hidden');
            } else {
                this.wrapper.find('.cron-picker-dow').addClass('hidden');
            }

            this._buildCronExpression();
        }

        _buildCronExpression() {
            let results = "";
            const type = this.wrapper.find('[data-type].active').data('type');
            const hours = this.wrapper.find('.cron-picker-hours').val(),
                minutes = this.wrapper.find('.cron-picker-minutes').val();
            switch (type) {
                case "Daily":
                    results = `0 ${minutes} ${hours} 1 * ? *`;
                    break;
                case "Weekly":
                    const selected = this.wrapper.find('.cron-picker-dow > button.active');
                    const dow = [].map.call(selected, item => item.innerText).join(',');
                    results = `0 ${minutes} ${hours} ? * ${dow} *`;
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

    }

    $.fn.cronPicker = function (options) {
        const defaults = {

        };
        const settings = $.extend({}, defaults, options);

        this.each((i, hostControl) => {
            hostControl = $(hostControl);

            if (hostControl.data('cron-picker') === '1')
                return;

            const wrapper = $(`
                <div class="cron-picker">
                </div>`
            );

            hostControl.after(wrapper).hide().data('cron-picker', '1');
            return  new CronPicker(wrapper, hostControl, settings);
        });
    };

}(jQuery));