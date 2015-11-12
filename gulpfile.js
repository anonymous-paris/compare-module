var path = require('path'),
	fs = require('fs');

var gulp = require('gulp'),
	gutil = require('gulp-util'),
	runSequence = require('run-sequence').use(gulp),
	argv = require('yargs').argv,
	config = require('./gulp/config'),
	browserSync = require('browser-sync');

fs.readdirSync('./gulp/tasks/').forEach(function(task) 
{
	if (path.extname(task) === '.js')
		require('./gulp/tasks/' + task);
});

//-----------------------------------------------------o
// generic tasks

gulp.task('setDevice', function()
{
	config.device = argv.device || "desktop";
});


gulp.task('dist', function()
{
	runSequence('createIndex');
});

gulp.task('reload', function () 
{
    browserSync.reload();
});

gulp.task('default', ['sass', 'twig', 'watch']);