function StandardCronFormatter() { }

StandardCronFormatter.parse = function (cron) {
    const state = {};
    const parts = cron.split(' ');
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
            return `${state.minutes} ${state.hours} * * *`;
        case "Weekly":
            const dow = state.daysOfWeek.sort().join(',');
            return `${state.minutes} ${state.hours} * * ${dow}`;
        case "Monthly":
            return `${state.minutes} ${state.hours} ${state.dayNumber} */${state.monthRepeater} *`;
    }
};