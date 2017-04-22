# CronPicker

[![npm version](https://badge.fury.io/js/bootstrap-duration-picker.svg)](https://badge.fury.io/js/bootstrap-cron-picker)
[![Bower version](https://badge.fury.io/bo/bootstrap-duration-picker.svg)](https://badge.fury.io/bo/bootstrap-cron-picker)

CronPicker is a javascript library that provides easy to use 
interface for generating CRON expressions.

TODO: add preview gif

## Features

1. Supports multiple CRON formats: crontab (StandardCronFormatter) 
and extended format used in Quartz Scheduler (QuartzCronFormatter)
2. Can be initialized with an existing CRON expression

## Installation

    npm install bootstrap-cron-picker

Using Bower:

    bower install bootstrap-cron-picker

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
        // time format, either 12 hours or 24 hours (default)
        format: '24',
        
        // available formatters:
        //   - StandardCronFormatter (crontab specification)
        //   - QuartzCronFormatter (quartz.net specification)
        cronFormatter: StandardCronFormatter,
    
        // callback function called each time cron expression is updated
        onCronChanged: function (cron) {
            console.log(cron);
        }
    });
```
