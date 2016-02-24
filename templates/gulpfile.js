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
// General
// /////////////////////////////////////////////////////////////
gulp.task('clean', function() {
  return del(['./dest/*.html']);
});

// /////////////////////////////////////////////////////////////
// Styles
// /////////////////////////////////////////////////////////////
gulp.task('sass', function () {
    return gulp.src('./src/assets/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dest/assets/styles'))
        .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('autoprefixer', function () {
    return gulp.src('./dest/assets/styles/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./dest/assets/styles/'));
});

gulp.task('styles', ['sass', 'autoprefixer']);

// /////////////////////////////////////////////////////////////
// Markup
// /////////////////////////////////////////////////////////////
gulp.task('copy', function() {
   gulp.src('./src/*.html')
   .pipe(gulp.dest('./dest/'));
});

function markupWatch() {
    del(['./dest/*.html']);
    gulp.src('./src/*.html')
       .pipe(gulp.dest('./dest/'));

   browserSync.reload();
};

gulp.task('markup', ['copy']);

// /////////////////////////////////////////////////////////////
// JavaScript
// /////////////////////////////////////////////////////////////
// gulp.task('copyjs', function() {
//    gulp.src('./src/assets/scripts/')
//    .pipe(gulp.dest('./dest/assets/'));
// });

// gulp.task('lint', function() {
//   return gulp.src('./src/assets/scripts/**/*.js')
//     .pipe(jshint())
//     .pipe(jshint.reporter('default'));
// });

gulp.task('scripts', function() {
    // Single entry point to browserify
    gulp.src('./src/assets/scripts/app.js')
        .pipe(browserify({
            insertGlobals : true,
            debug : !gulp.env.production
        }))
        .pipe(gulp.dest('./dest/assets/scripts'));

    browserSync.reload();
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
    gulp.watch("./src/*.html", markupWatch);
    gulp.watch("./src/assets/scripts/**/*.js", ['scripts']);
});