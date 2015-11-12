'use strict';

var gulp = require('gulp'),
	gutil = require('gulp-util'),
	config = require('../config'),
	webpack = require('webpack');

//-----------------------------------------------------o

var logger = function(err, stats)
{
	if(err) throw new gutil.PluginError('webpack', err);

	if(stats.compilation.errors.length > 0)
	{
		stats.compilation.errors.forEach(function(error)
		{
			gutil.log(gutil.colors.red(error.toString().split(': ').join(':\n')));
		});
	}
	else
	{
		gutil.log(gutil.colors.green('JS built in ' + (stats.endTime - stats.startTime) + 'ms'));
	}
};

//-----------------------------------------------------o

gulp.task('webpack', ['setDevice'], function(callback)
{
	var built = false;
	// var filename = 'scripts.' + config.device + '.js';
	var filename = 'scripts.js';

	var webpackConfig = config.webpack;
	webpackConfig.entry = config.src + '/js/Main.es6';
	webpackConfig.output = 
	{
		path: config.bin +  "/js", 
		filename: filename
	};

	webpackConfig.resolve.root = 
	[
		// process.cwd() + '/node_modules/core-js',
		config.src + 'shared/js/',
		config.src + config.device + '/js/'
	];

	if(config.env === 'prod')
	{
		webpackConfig.devtool = undefined;
		webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin(
		{
			minimize: true,
			output: {comments: false}
		}));
	}

	if(global.isWatching)
	{
		webpack(webpackConfig).watch(200, function(err, stats)
		{
			logger(err, stats);
			// browserSync.reload();
			// On the initial compile, let gulp know the task is done
			if(!built)
			{
				built = true;
				callback();
			}
		});
	}
	else
	{
		webpack(webpackConfig, function(err, stats)
		{
			logger(err, stats);
			callback();
		});
	}
});
