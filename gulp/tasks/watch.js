var gulp = require('gulp'),
	config = require('../config');

//-----------------------------------------------------o 
// watcher

gulp.task('setWatch', function() 
{
	global.isWatching = 1;
});

gulp.task('watch', ['setDevice', 'setWatch', 'webpack', 'browser-sync'], function() 
{
	gulp.watch(config.src + '**/*.scss', ['sass']);
	gulp.watch(config.device + 'sass/**/*.scss', ['sass']);
	gulp.watch(config.bin + '../**/*.twig', ['reload']);
	gulp.watch(config.src + '**/*.twig', ['twig']);
	gulp.watch(config.device + 'twig/**/*.twig', ['twig']);
});