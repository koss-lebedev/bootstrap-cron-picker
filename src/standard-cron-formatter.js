class StandardCronFormatter {

    parseCronExpression(cron) {
        const state = {};
        const parts = cron.split(' ');
        if (parts.length !== 6) {
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

                // if (parts[5] === '?') {
                    state.dayFilter = 'day';
                    state.dayNumber = parts[2];
                // } else {
                //     state.dayFilter = 'weekday';
                //     state.dayOfWeek = parts[5].substr(0, 3);
                //     state.ordCondition = parts[5].substr(3);
                // }

            }
        }
        return state;
    }

    buildCronExpression(state) {
        switch (state.type) {
            case "Daily":
                return `${state.minutes} ${state.hours} 1/1 * * *`;
            case "Weekly":
                const dow = state.daysOfWeek.join(',');
                return `${state.minutes} ${state.hours} * ${dow} * *`;
            case "Monthly":
                if (state.dayFilter === 'day') {
                    return `${state.minutes} ${state.hours} ${state.dayNumber} 1/${state.monthRepeater} * *`;
                } else if (state.dayFilter == 'weekday') {
                    // M H DM  MY DW Y
                    // 0 9 1-7 *  1  *                       First Monday of each month, at 9 a.m.
                    return 'nope';
                    // return `${state.minutes} ${state.hours} ? 1/${state.monthRepeater} ${state.dayOfWeek}${state.ordCondition} *`;
                }
        }
    }

}