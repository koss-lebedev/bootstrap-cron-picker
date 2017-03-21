function QuartzCronFormatter() { }

QuartzCronFormatter.parse = function (cron) {
    const state = {};
    const parts = cron.split(' ');
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
            return `0 ${state.minutes} ${state.hours} 1/1 * ? *`;
        case "Weekly":
            const dow = state.daysOfWeek.sort().join(',');
            return `0 ${state.minutes} ${state.hours} ? * ${dow} *`;
        case "Monthly":
            if (state.dayFilter === 'day') {
                return `0 ${state.minutes} ${state.hours} ${state.dayNumber} 1/${state.monthRepeater} ? *`;
            } else if (state.dayFilter == 'weekday') {
                return `0 ${state.minutes} ${state.hours} ? 1/${state.monthRepeater} ${state.dayOfWeek}${state.ordCondition} *`;
            }
    }
};