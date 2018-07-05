/* eslint-env node */
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
	entry: __dirname + '/src/canopy-sofe-extensions.js',
	output: {
		filename: 'canopy-sofe-extensions.js',
		// libraryTarget: 'amd',
		path: __dirname + '/lib',
	},
	module: {
		rules: [
			{
				test: /\.js?$/,
				exclude: [path.resolve(__dirname, 'node_modules')],
				loader: 'babel-loader',
			},
		],
	},
	resolve: {
		modules: [
			__dirname,
			'node_modules',
		],
	},
	plugins: [
		new CleanWebpackPlugin(['lib']),
	],
	devtool: 'source-map',
	externals: [
		/^sofe$/,
	],
};
