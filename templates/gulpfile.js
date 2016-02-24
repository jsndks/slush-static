'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var jshint = require('gulp-jshint');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var del = require('del');
var browserify = require('gulp-browserify');

// /////////////////////////////////////////////////////////////
// Styles
// /////////////////////////////////////////////////////////////
gulp.task('styles', function() {
    return gulp.src('./src/assets/scss/**/*.scss')
        // SASS //
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dest/assets/styles'))

        // AUTOPREFIXER //
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./dest/assets/styles/'))
        .pipe(browserSync.stream({match: '**/*.css'}));
});

// /////////////////////////////////////////////////////////////
// Markup
// /////////////////////////////////////////////////////////////
gulp.task('markup', function() {
    del(['./dest/*.html']);
    gulp.src('./src/*.html')
       .pipe(gulp.dest('./dest/'))
       .pipe(browserSync.stream({match: '**/*.html'}));
});

// /////////////////////////////////////////////////////////////
// JavaScript
// /////////////////////////////////////////////////////////////
gulp.task('lint', function() {
  return gulp.src('./src/assets/scripts/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('scripts', ['lint'], function() {
    // Single entry point to browserify
    gulp.src('./src/assets/scripts/app.js')
        .pipe(browserify({
            insertGlobals : true,
            debug : !gulp.env.production
        }))
        .pipe(gulp.dest('./dest/assets/scripts'))
        .pipe(browserSync.stream());
});

// /////////////////////////////////////////////////////////////
// Server
// /////////////////////////////////////////////////////////////
gulp.task('serve', ['markup', 'styles', 'scripts'], function() {
    browserSync.init({
        injectChanges: true,
        server: {
            baseDir: "./dest"
        }
    });

    gulp.watch("./src/assets/scss/**/*.scss", ['styles']);
    gulp.watch("./src/*.html", ['markup']);
    gulp.watch("./src/assets/scripts/**/*.js", ['scripts']);
});