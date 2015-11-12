var gulp = require('gulp'),
	gutil = require('gulp-util'),
	filter = require('gulp-filter'),
	config = require('../config'),

	sass = require('gulp-ruby-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload,
	autoprefixer = require('gulp-autoprefixer');
	// autoprefixer = require('autoprefixer');

// var postscss = require('postscss');

//-----------------------------------------------------o 
// sass

gulp.task('sass', ['setDevice'], function()
{
	return sass(config.src + '/sass/style.scss',
		{ 
			style: config.env !== "prod" ? "nested" : "compressed",
			sourcemap: config.env !== "prod",
			quiet: true,
		})
		.pipe(autoprefixer({
            browsers: config.browsersSupport
        }))
		.pipe(sourcemaps.write("./"))
		.pipe(gulp.dest(config.bin + 'css'))
		.pipe(filter('**/*.css'))
		.pipe(reload({stream: true}))
		.on('end', function() {gutil.log(gutil.colors.green("Sass compiled"));});
});

// gulp.task('sass', ['setDevice'], function()
// {
// 	return postscss([autoprefixer({browsers: config.browsersSupport})]).process({
// 	    from: config.src + config.device + '/sass/style.' + config.device + '.scss',
// 	    to: config.bin + 'css/style.' + config.device + '.css'
// 	})
// 	.then(function() {
// 		gulp.src(config.bin + 'css/style.' + config.device + '.css')
// 		.pipe(reload({stream: true}));
// 	    gutil.log(gutil.colors.green("Sass compiled"));
// 	});
// });