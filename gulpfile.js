'use strict';
// generated on 2014-06-18 using generator-gulp-webapp 0.1.0

var gulp = require('gulp');
var debug = false;
var gutil = require('gulp-util');
// load plugins
var $ = require('gulp-load-plugins')();


gulp.task('less', function () {   
    var path = require('path');
    return gulp.src(['app/less/reset.less', 'app/less/main.less'])
        .pipe($.concat('bundle.css'))
        .pipe($.less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(gulp.dest('./.tmp/styles'))
        .pipe($.size());
});

gulp.task('scripts', function () {
    return gulp.src('app/scripts/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')))
        .pipe($.concat('bundle.js'))
        .pipe(gulp.dest('./.tmp/scripts'))
        .pipe($.size());
});

gulp.task('libs', function () {
    return gulp.src('app/bower_components/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')))
        .pipe($.size());
});

gulp.task('html', ['less', 'scripts'], function () {
    
    gulp.src(['app/bower_components/jquery/dist/jquery.min.js', 'app/bower_components/handlebars/handlebars.min.js'])
        .pipe($.concat('libs.js'))
        .pipe(gulp.dest('dist/scripts'))
        .pipe($.size());

    gulp.src('app/scripts/**/*.js')
        .pipe($.uglify())
        .pipe($.concat('bundle.js'))
        .pipe(gulp.dest('dist/scripts'))
        .pipe($.size());

    gulp.src('.tmp/styles/**/*.css')
        .pipe($.csso())
        .pipe(gulp.dest('dist/styles'))
        .pipe($.size());

    return gulp.src('app/index.html')
        .pipe($.htmlReplace({
            'js': 'scripts/libs.js'
        }))
        .pipe(gulp.dest('dist'))
        .pipe($.size());
});

gulp.task('images', function () {
    return gulp.src('app/images/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe($.size());
});

gulp.task('fonts', function () {
    return $.bowerFiles()
        .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
        .pipe($.flatten())
        .pipe(gulp.dest('dist/fonts'))
        .pipe($.size());
});

gulp.task('extras', function () {
    return gulp.src(['app/*.*', '!app/*.html'], { dot: true })
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
    return gulp.src(['.tmp', 'dist'], { read: false }).pipe($.clean());
});

gulp.task('build', ['html', 'images', 'fonts', 'extras']);

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

gulp.task('connect', function () {
    var connect = require('connect');
    var app = connect()
        .use(require('connect-livereload')({ port: 35729 }))
        .use(connect.static('app'))
        .use(connect.static('.tmp'))
        .use(connect.directory('app'));

    require('http').createServer(app)
        .listen(9000)
        .on('listening', function () {
            console.log('Started connect web server on http://localhost:9000');
        });
});

gulp.task('serve', ['connect'], function () {
    require('opn')('http://localhost:9000');
});

// inject bower components
gulp.task('bower', function () {
    var wiredep = require('wiredep').stream;

    gulp.src('app/*.html')
        .pipe(wiredep({
            directory: 'app/bower_components'
        }))
        .pipe(gulp.dest('app'));
});

gulp.task('watch', ['bower', 'less', 'scripts', 'connect', 'serve'], function () {
    var server = $.livereload();
    // watch for changes

    gulp.watch([
        'app/*.html',
        '.tmp/styles/**/*.css',
        'app/scripts/**/*.js',
        'app/images/**/*'
    ]).on('change', function (file) {
        server.changed(file.path);
    });

    gulp.watch('app/less/**/*.less', ['less']);
    gulp.watch('app/scripts/**/*.js', ['scripts']);
    gulp.watch('app/images/**/*', ['images']);

});