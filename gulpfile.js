"use strict";

var gulp = require("gulp");
var run = require('gulp-run');
var merge = require('merge-stream');
var rename = require('gulp-rename');

gulp.task('bundle-js', function () {
    var cmd = new run.Command('jspm build src/main.js public/assets/js/build.js --minify --skip-source-maps');
    cmd.exec();
});

gulp.task('build-debug-js', function () {
    var cmd = new run.Command('jspm build src/main.js public/assets/js/build.js --skip-source-maps');
    cmd.exec();
});

gulp.task('uglify', function () {
    var cmd = new run.Command('uglifyjs public/assets/js/build.js > public/assets/js/build2.js --mangle --reserved \'Array,BigInteger,Boolean,Buffer,ECPair,Function,Number,Point\'');
    cmd.exec();
});

gulp.task('replace', function () {
    var cmd = new run.Command('mv public/assets/js/build2.js public/assets/js/build.js');
    cmd.exec();
});

gulp.task('copy-wiki-page', function () {
    var maps = [
        { from: 'privacy-policy.html', to: 'public/' },
        { from: 'contact.html', to: 'public/' },
        { from: 'support.html', to: 'public/' },
        { from: 'terms-of-service.html', to: 'public/' },
        { from: 'crowdsale.html', to: 'public/' }
    ];

    var tasks = maps.map((m) => {
        return gulp.src(m.from).pipe(gulp.dest(m.to));
    });

    merge(tasks);
});

gulp.task('copy-index', function () {
    var maps = [
        { from: 'index.html', to: 'public/' }
    ];

    var tasks = maps.map((m) => {
        return gulp.src(m.from).pipe(gulp.dest(m.to));
    });

    merge(tasks);
});

gulp.task('copy-html', function () {
    return gulp.src('index-production.html')
        .pipe(rename('home.html'))
        .pipe(gulp.dest('public'));
});

gulp.task('copy-html-mobile', function () {
    return gulp.src('index-production-mobile.html')
        .pipe(rename('index.html'))
        .pipe(gulp.dest('public'));
});

gulp.task('copy-favicon', function () {
    return gulp.src('assets/images/pages/coin.png')
        .pipe(rename('favicon.ico'))
        .pipe(gulp.dest('public'));
});

gulp.task('copy-css', function () {
    return gulp.src('assets/css/**/*')
        .pipe(gulp.dest('public/assets/css'));
});

gulp.task('copy-fonts', function () {
    return gulp.src('assets/fonts/**/*')
        .pipe(gulp.dest('public/assets/fonts'));
});

gulp.task('copy-docs', function () {
    return gulp.src('assets/docs/**/*')
        .pipe(gulp.dest('public/assets/docs'));
});

gulp.task('copy-sound', function () {
    return gulp.src('assets/sound/**/*')
        .pipe(gulp.dest('public/assets/sound'));
});

gulp.task('copy-images', function () {
    return gulp.src('assets/images/**/*')
        .pipe(gulp.dest('public/assets/images'));
});

gulp.task('copy-lib', function () {
    var maps = [
        { from: 'assets/lib/**/*', to: 'public/assets/lib/' }
    ];

    var tasks = maps.map((m) => {
        return gulp.src(m.from).pipe(gulp.dest(m.to));
    });

    merge(tasks);
});

gulp.task('copy-rs-mobile', ['copy-wiki-page', 'copy-html-mobile', 'copy-css', 'copy-images', 'copy-lib', 'copy-fonts', 'copy-sound', 'copy-favicon', 'copy-docs']);

gulp.task('copy-rs', ['copy-wiki-page', 'copy-index', 'copy-html', 'copy-css', 'copy-images', 'copy-lib', 'copy-fonts', 'copy-sound', 'copy-favicon', 'copy-docs']);

gulp.task('andaman', function () {
    var cmd = new run.Command('browserify src/services/andaman.js -o assets/lib/andaman/andaman-bundle.js --standalone AndamanService');
    cmd.exec();
});

gulp.task('build-debug-mobile', ['copy-rs-mobile', 'build-debug-js']);
gulp.task('build-debug', ['copy-rs', 'build-debug-js']);
gulp.task('default', ['copy-rs', 'bundle-js']);