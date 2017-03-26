# CronPicker

CronPicker is a javascript library that provides easy to use 
interface for generating CRON expressions.

TODO: add preview gif

## Features

1. Supports multiple CRON formats: crontab (StandardCronFormatter) 
and extended format used in Quartz Scheduler (QuartzCronFormatter)
2. Can be initialized with an existing CRON expression

## Installation

TODO: install jQuery and bootstrap using NPM, and reference them from index.html

TODO: add NPM and BOWER

## Usage

To attach CronPicker to an input field with id `#cron-picker`:

```javascript
$('#cron-picker').cronPicker();
```

You can also initialize CronPicker with existing cron expression. 
To do that, simply set value of the HTML input before attaching CronPicker.

For advanced usage, you can pass any of the following options:

```javascript
$('#cron-picker').cronPicker({
        // callback function called each time cron expression is updated
        onCronChanged: function (cron) {
            console.log(cron);
        }
    });
```
