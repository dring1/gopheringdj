var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var inject = require('gulp-inject');
var babel = require("gulp-babel");
var plumber = require("gulp-plumber");
var wiredep = require('wiredep').stream;

var paths = {
	es6: ['./src/es6/**/*.js'],
	sass: ['./scss/**/*.scss'],
  files: ['./www/**/*.js', './www/**/*.css']
};

gulp.task('default', ['babel', 'sass', 'injector']);

gulp.task("babel", function() {
	return gulp.src(paths.es6)
		.pipe(plumber())
		.pipe(babel())
		.pipe(gulp.dest("www/js"));
});

gulp.task('watch', function() {
	gulp.watch(paths.es6, ['babel']);
	gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.files, ['injector']);
});

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
	gulp.src('./scss/ionic.app.scss')
		.pipe(sass({
			errLogToConsole: true
		}))
		.pipe(gulp.dest('./www/css/'))
		.pipe(minifyCss({
			keepSpecialComments: 0
		}))
		.pipe(rename({
			extname: '.min.css'
		}))
		.pipe(gulp.dest('./www/css/'))
		.on('end', done);
});

gulp.task('watch', function() {
	gulp.watch(paths.sass, ['sass']);
});



gulp.task('injector', function() {
	return gulp.src('./www/index.html')
		.pipe(inject(gulp.src('./www/js/**/*.js', {
			read: false
		}), {
			relative: true
		}))
		.pipe(inject(gulp.src('./www/css/**/*.css', {
			read: false
		}), {
			relative: true
		}))
		.pipe(gulp.dest('./www'));
});

gulp.task('install', ['git-check'], function() {
	return bower.commands.install()
		.on('log', function(data) {
			gutil.log('bower', gutil.colors.cyan(data.id), data.message);
		});
});

gulp.task('bower', function () {
  gulp.src('./www/index.html')
    .pipe(wiredep())
    .pipe(gulp.dest('./www'));
});

gulp.task('git-check', function(done) {
	if (!sh.which('git')) {
		console.log(
			'  ' + gutil.colors.red('Git is not installed.'),
			'\n  Git, the version control system, is required to download Ionic.',
			'\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
			'\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
		);
		process.exit(1);
	}
	done();
});