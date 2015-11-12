// var webpack = require("webpack");

module.exports = {

	src: process.cwd() + "/src/",
	bin: process.cwd() + "/example/",

	device: null,

	proxy: 'auditoire.dev',

	browsersSupport: ['last 2 versions', '> 5%'],

	webpack: {
		cache: true,
		devtool: 'cheap-module-eval-source-map',
		module: {
			loaders: [
				{ test: /\.es6$/, loader: 'babel-loader'}
			],
			noParse: [
				/lib\/three\/three/,
				/lib\/tweenLite/,
				/lib\/zepto/,
			]
		},
		resolve: {
			root: undefined, // to be specified with the use of moduleSrc task
	  		extensions: ['', '.js', '.es6'],
	  		alias:
			{
				Emitter: process.cwd() + "/node_modules/component-emitter/index.js",
			}
		},
		plugins: [
			// new webpack.ProvidePlugin(
			// {
			// 	$: 'lib/zepto/zepto'
			// })
		]
	},

};