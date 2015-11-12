var gulp = require('gulp'),
	gutil = require('gulp-util'),
	config = require('../config'),
	twig = require('gulp-twig');

//-----------------------------------------------------o
// twig

gulp.task('twig', ['setDevice'], function()
{
	return gulp.src(config.src + 'twig/index.twig')
		.pipe(twig({
			data: {
				version: '1'
			}
		}))
		.pipe(gulp.dest(config.bin))
		.on('end', function() {gutil.log(gutil.colors.green("Twig compiled"));});
});