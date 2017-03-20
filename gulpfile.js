var gulp = require('gulp'),
    minify = require('gulp-minify'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    babel = require('gulp-babel');

gulp.task('default', [ 'minify-js', 'minify-css' ]);

gulp.task('minify-js', function() {
    gulp.src(['src/standard-cron-formatter.js', 'src/quartz-cron-formatter.js', 'src/cron-picker.js'])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('cron-picker.js'))
        .pipe(minify({
            ext:{
                src:'-debug.js',
                min:'.js'
            }
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('minify-css', function () {
    return gulp.src('src/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('dist'));
});