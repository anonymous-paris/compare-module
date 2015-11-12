var gulp = require('gulp'),
	browserSync = require('browser-sync'),
	config = require('../config');

//-----------------------------------------------------o 
// live reload

gulp.task('browser-sync', function() 
{
	var options = 
	{
		proxy: config.proxy,
		open: false,
		notify: false,
		https: false,
		ui: false,
		ghostMode: false
	};

	browserSync(options);
});

gulp.task('reload', function() 
{
    browserSync.reload();
});