const gulp = require('gulp');
const gulpif = require('gulp-if');
const cleanCss = require('gulp-clean-css');
const sassGlob = require('gulp-sass-glob');
const sourceMaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();

const isSync = process.argv.indexOf('--sync') !== -1;
const isDev = process.argv.indexOf('--dev') !== -1;

let pth = {
	pbl: {
		root: './',
		css: './css/',
	},
	src: {
		css: './sass/style.scss',
	},
	wtch: {
		html: './**/*.html',
		js: ['./js/**/*.js'],
		css: ['./sass/**/*.scss'],
		img: './img/**/*.*',
		fnts: './fonts/**/*.*'
	}
};

function swallowError (error) {
	console.log(error.toString());
	this.emit('end');
}

function styles() {
	return gulp.src(pth.src.css)
		.pipe(gulpif(isDev, sourceMaps.init()))
		.pipe(sassGlob())
		.pipe(sass())
		.on('error', swallowError)
		.pipe(autoprefixer({ 
			overrideBrowserslist: [ "last 4 version" ],
			cascade: false, 
			grid: true 
		}))
		.pipe(gulpif(!isDev, cleanCss({ level: 2 })))
		.pipe(gulpif(isDev, sourceMaps.write()))
		.pipe(gulp.dest(pth.pbl.css))
		.pipe(gulpif(isSync, browserSync.stream()));
}

function watch() {
	if(isSync) {
		browserSync.init({
			server: { baseDir: pth.pbl.root }
		});
	}

	gulp.watch(pth.wtch.css, styles);
	gulp.watch(pth.wtch.js).on('change', browserSync.reload);
	gulp.watch(pth.wtch.html).on('change', browserSync.reload);
	gulp.watch(pth.wtch.img).on('change', browserSync.reload);
	gulp.watch(pth.wtch.fnts).on('change', browserSync.reload);
}

exports.build = styles;
exports.watch = gulp.series(styles, watch);