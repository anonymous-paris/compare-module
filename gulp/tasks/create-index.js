'use strict';

var gulp = require('gulp'),
	config = require('../config'),
	path = require('path'),
	fs = require('fs');

//-----------------------------------------------------o

var getClasses = function(directory, done)
{
	var results = [];

	fs.readdir(directory, function(err, files)
	{
		if (err) return done(err);
	
		var pending = files.length;
	
		if (!pending) return done(null, results);
	
		files.forEach(function(_file)
		{
			var file = path.resolve(directory, _file);
			fs.stat(file, function(err, stat)
			{
				if (err) return done(err);
				if (stat && stat.isDirectory())
				{
					getClasses(file, function(err, res)
					{
						if (err) return done(err);
						results = results.concat(res);
						if (!--pending) done(null, results);
					});
				} else {
					if(! /^\..*/.test(_file))
						results.push(file);
					
					if (!--pending) done(null, results);
				}
			});
		});
	});
};

gulp.task('createIndex', function()
{
	getClasses(config.src + 'js/lib', function(err, results)
	{
		if (err) throw err;

		var file = fs.createWriteStream('index.js');
		file.on('error', function(err) { throw err; });
		results.forEach(function(_line)
		{
			var line = 'exports.' + path.basename(_line, path.extname(_line)) + ' = ' + "require('./"+path.relative(process.cwd(), _line)+"');";
			file.write(line + '\n'); });
		file.end();
	});
});