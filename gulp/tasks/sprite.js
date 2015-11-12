var gulp = require('gulp'),
	fs = require('fs'),
	config = require('../config'),

	svgSprite = require("gulp-svg-sprite"),
	spritesmith = require('gulp.spritesmith');

//-----------------------------------------------------o 
// sprite

gulp.task('sprite-generate', ['setDevice'], function()
{
	return gulp.src(config.src + '/svg/*.svg')
		.pipe(svgSprite({
			// log: 'verbose',
			shape: {
				spacing: {
					padding: 2
				}
			},
			mode: {
				css: {
					dest: "./",
					dimensions: true,
					bust: false,
					prefix: ".icon--",
					common: "icon",
					render: {
						scss: {
							dest: '_sprites.scss'
						},
					},
					sprite: "../svg/sprite.svg",
				},
				symbol: false
			}
		}))
		.pipe(gulp.dest(config.bin + "svg"));
});

gulp.task('sprite', ["sprite-generate"], function()
{
	fs.rename(config.bin + 'svg/_sprites.scss', config.src + '/sass/utils/_sprites.scss');
});

gulp.task('spritesmith', function()
{
	var spriteData = gulp.src(config.src + config.device + 'bmp/*.png').pipe(spritesmith(
	{
		imgName: 'sprite-' + config.device + '.png',
		cssName: 'sprite-bmp.sass',
		cssFormat: 'css',
		// imgPath: '../imgs/particles.png'
	}));

	spriteData.img.pipe(gulp.dest(config.bin + '/img/'));
	spriteData.css.pipe(gulp.dest(config.device + 'sass/'));
});