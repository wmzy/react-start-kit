'use strict';

import 'babel-polyfill';
import gulp from 'gulp';
import gUtil from 'gulp-util';
import del from 'del';
import runSequence from 'run-sequence';
import browserSync from 'browser-sync';
import webpack from 'webpack';
import webpackConfig from './webpack.config.js';
import gulpLoadPlugins from 'gulp-load-plugins';
import WebpackDevServer from 'webpack-dev-server';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('bundle', function () {
  const compiler = webpack(webpackConfig);
  compiler.run((err, stats) => {
    if (err) gUtil.log(err);
    console.log(stats);
  })
});

gulp.task('dev-server', function (callback) {
	const compiler = webpack(webpackConfig);

	new WebpackDevServer(compiler, webpackConfig.devServer).listen(webpackConfig.devServer.port, function (err) {
		if (err) throw new gUtil.PluginError('webpack-dev-server', err);
		// Server listening
		gUtil.log('[webpack-dev-server]', `http://localhost:${webpackConfig.devServer.port}`);

		// keep the server alive or continue?
		// callback();
	});
});

gulp.task('dev', ['dev-server'], () => {
});

// Lint JavaScript
gulp.task('lint', () =>
	gulp.src('src/**/*.js')
		.pipe($.eslint())
		.pipe($.eslint.format())
		.pipe($.if(!browserSync.active, $.eslint.failOnError()))
);


// Copy all files at the root level (app)
gulp.task('copy', () =>
	gulp.src([
		'app/*',
		'!app/*.html',
		'node_modules/apache-server-configs/dist/.htaccess'
	], {
		dot: true
	}).pipe(gulp.dest('dist'))
		.pipe($.size({title: 'copy'}))
);

// Clean output directory
gulp.task('clean', () => del(['.tmp', 'dist/*', '!dist/.git'], {dot: true}));

// Watch files for changes & reload
gulp.task('serve', ['scripts', 'styles'], () => {
	browserSync({
		notify: false,
		// Customize the Browsersync console logging prefix
		logPrefix: 'WSK',
		// Allow scroll syncing across breakpoints
		scrollElementMapping: ['main', '.mdl-layout'],
		// Run as an https by uncommenting 'https: true'
		// Note: this uses an unsigned certificate which on first access
		//       will present a certificate warning in the browser.
		// https: true,
		server: ['.tmp', 'app'],
		port: 3000
	});

	gulp.watch(['app/**/*.html'], reload);
	gulp.watch(['app/styles/**/*.{scss,css}'], ['styles', reload]);
	gulp.watch(['app/scripts/**/*.js'], ['lint', 'scripts']);
	gulp.watch(['app/images/**/*'], reload);
});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], () => browserSync({
	notify: false,
	logPrefix: 'WSK',
	// Allow scroll syncing across breakpoints
	scrollElementMapping: ['main', '.mdl-layout'],
	// Run as an https by uncommenting 'https: true'
	// Note: this uses an unsigned certificate which on first access
	//       will present a certificate warning in the browser.
	// https: true,
	server: 'dist',
	port: 3001
}));

// Build production files, the default task
gulp.task('default', ['clean'], cb =>
	runSequence(
		'styles',
		['lint', 'html', 'scripts', 'images', 'copy'],
		'generate-service-worker',
		cb
	)
);


// Load custom tasks from the `tasks` directory
// Run: `npm install --save-dev require-dir` from the command-line
// try { require('require-dir')('tasks'); } catch (err) { console.error(err); }
