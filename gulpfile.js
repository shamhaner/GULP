// To write scripts to a line, add " inline" after the specified file path to the closing scripts tag.

const		gulp				= require('gulp');
            browserSync			= require('browser-sync');
            sass				= require('gulp-sass');
            autoprefixer		= require('gulp-autoprefixer');
            concat				= require('gulp-concat');
            cleancss			= require('gulp-clean-css');
            purge				= require('gulp-css-purge');
            sourcemaps          = require('gulp-sourcemaps');
            babel 				= require('gulp-babel');
            uglify				= require('gulp-uglify');
            inlineCss           = require('gulp-inline-css');
            htmlmin				= require('gulp-htmlmin');
            inlinesource 		= require('gulp-inline-source');
            rsync               = require('gulp-rsync');
            del 				= require('del');
            cache				= require('gulp-cache');
            gutil               = require('gulp-util');
            child               = require('child_process');
            responsive          = require('gulp-responsive');
            newer               = require('gulp-newer');
            rename              = require('gulp-rename');
            imagemin			= require('gulp-imagemin');


// siteRoot = './build/';

// htmlFiles = [
//     './src/*.html'
// ];

// cssFiles = [
//     './src/sass/main.sass'
// ];

// jsFiles = [
//     './node_modules/jquery/dist/jquery.min.js',
//     './src/_lazy.js',
//     './src/animation.js',
//     './src/main.js'  
    
// ];


// Local Server
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'build'
		},
		notify: false,
		// online: false, // Work offline without internet connection
		// tunnel: true, tunnel: 'project', // Demonstration page: http://project.localtunnel.me
	})
});
function bsReload(done) { browserSync.reload(); done(); };

// Custom Styles
gulp.task('styles', function() {
	return gulp.src('src/sass/**/*.sass')
	.pipe(sass({ outputStyle: 'expanded' }))
	.pipe(concat('main.css'))
	.pipe(autoprefixer({
		grid: true,
		overrideBrowserslist: ['last 10 versions']
	}))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Optional. Comment out when debugging
	.pipe(gulp.dest('build/'))
	.pipe(browserSync.stream())
});

// Scripts & JS Libraries
gulp.task('scripts', function() {
	return gulp.src([
		// 'node_modules/jquery/dist/jquery.min.js', // Optional jQuery plug-in (npm i --save-dev jquery)
		'src/_lazy.js', // JS library plug-in example
		'src/animation.js', // JS library plug-in example
		'src/main.js', // Custom scripts. Always at the end
		'src/sw.js', // Custom scripts. Always at the end
		'src/serviceWorker.js', // Custom scripts. Always at the end
		])
	.pipe(concat('main.js'))
	// .pipe(uglify()) // Minify js (opt.)
	.pipe(gulp.dest('build'))
	.pipe(browserSync.stream())
});

// Responsive Images
var quality = 95; // Responsive images quality

// Produce @1x images
gulp.task('img-responsive-1x', async function() {
	return gulp.src('src/img/_src/**/*.{png,jpg,jpeg,webp,raw}')
		.pipe(newer('src/img/@1x'))
		.pipe(responsive({
			'**/*': { width: '50%', quality: quality }
		})).on('error', function (e) { console.log(e) })
		.pipe(rename(function (path) {path.extname = path.extname.replace('jpeg', 'jpg')}))
		.pipe(gulp.dest('build/img/@1x'))
});
// Produce @2x images
gulp.task('img-responsive-2x', async function() {
	return gulp.src('src/img/_src/**/*.{png,jpg,jpeg,webp,raw}')
		.pipe(newer('src/img/@2x'))
		.pipe(responsive({
			'**/*': { width: '100%', quality: quality }
		})).on('error', function (e) { console.log(e) })
		.pipe(rename(function (path) {path.extname = path.extname.replace('jpeg', 'jpg')}))
		.pipe(gulp.dest('build/img/@2x'))
});
gulp.task('img', gulp.series('img-responsive-1x', 'img-responsive-2x', bsReload));

// Clean @*x IMG's
gulp.task('cleanimg', function() {
	return del(['src/img/@*'], { force: true })
});

// Code & Reload
gulp.task('code', function() {
    return gulp.src('src/**/*.html')
    .pipe(gulp.dest('build/'))
	// .pipe(browserSync.reload({ stream: true }))
	.pipe(browserSync.stream())
});

//Fonts
gulp.task('fontsA', () => {
	return gulp.src('./node_modules/@fortawesome/fontawesome-free/webfonts/*')
		.pipe(gulp.dest('./build/fonts/webfonts'))
		.pipe(browserSync.reload({ stream: true }));
});

gulp.task('fontsC', () => {
	return gulp.src('./src/fonts/**/*.*')
		.pipe(gulp.dest('./build/fonts'))
		.pipe(browserSync.reload({ stream: true }));
});

gulp.task('fonts', gulp.series('fontsA', 'fontsC'));

// Deploy
gulp.task('rsync', function() {
	return gulp.src('build/')
	.pipe(rsync({
		root: 'build/',
		hostname: 'username@yousite.com',
		destination: 'yousite/public_html/',
		// include: ['*.htaccess'], // Included files
		exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excluded files
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}))
});

gulp.task('watch', function() {
	gulp.watch('src/sass/**/*.sass', gulp.parallel('styles'));
	gulp.watch(['libs/**/*.js', 'src/js/_custom.js'], gulp.parallel('scripts'));
	gulp.watch('src/*.html', gulp.parallel('code'));
	gulp.watch('src/img/_src/**/*', gulp.parallel('img'));
});

gulp.task('default', gulp.series('code','fonts','img', 'styles', 'scripts', gulp.parallel('browser-sync', 'watch')));





















// gulp.task('browser-sync', function() {
// 	browserSync({
// 		server: {
// 			baseDir: 'build'
// 		},
// 		port: 3000,
//         notify: false,
//         // open: false,
//         // online: false,
//         // tunnel: true, 
//         // tunnel: "prospection", // Demonstration page: https://prospection.localtunnel.me
// 	})
// });
// function bsReload(done) { browserSync.reload(); done(); };

// gulp.task('fontsA', () => {
// 	return gulp.src('./node_modules/@fortawesome/fontawesome-free/webfonts/*')
// 		.pipe(gulp.dest('./build/fonts/webfonts'))
// 		.pipe(browserSync.reload({ stream: true }));
// });

// gulp.task('fontsC', () => {
// 	return gulp.src('./src/fonts/**/*.*')
// 		.pipe(gulp.dest('./build/fonts'))
// 		.pipe(browserSync.reload({ stream: true }));
// });

// gulp.task('fonts', gulp.series('fontsA', 'fontsC'));

// gulp.task('css', () => {
//     return gulp.src(cssFiles)
//         .pipe(sourcemaps.init())
//         .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
//         .pipe(concat('main.css'))
//         .pipe(sourcemaps.write('./maps'))
// 		.pipe(cleanCSS({level:2}))
// 		.pipe(purge({
// 			trim : true,
// 			shorten : true,
// 			verbose : true
//     }))        
// 	    .pipe(gulp.dest('./build'))
// 		.pipe(browserSync.reload({ stream: true }));
// });

// gulp.task('main_js', () => {
//     return gulp.src(jsFiles)
//         .pipe(sourcemaps.init())
//         .pipe(concat('main.js'))
//         .pipe(babel({
//             presets: ['@babel/env']
//         }))
//         .pipe(uglify())
//         .pipe(sourcemaps.write('./maps'))
//         .pipe(gulp.dest('./build'))
//         .pipe(browserSync.reload({ stream: true }));
// });

// gulp.task('sw_js', () => {
//     return gulp.src(['./src/serviceWorker.js','./src/sw.js'])
//         .pipe(sourcemaps.init())
//         .pipe(babel({
//             presets: ['@babel/env']
//         }))
//         .pipe(uglify())
//         .pipe(sourcemaps.write('./maps'))
//         .pipe(gulp.dest('./build'))
//         .pipe(browserSync.reload({ stream: true }));
// });

// gulp.task('js', gulp.series('main_js', 'sw_js'));

// // Responsive Images
// var quality = 95; // Responsive images quality

// // Produce @1x images
// gulp.task('img-responsive-1x', async () => {
// 	return gulp.src('./src/img/_src/**/*.{png,jpg,jpeg,webp,raw}')
//         .pipe(responsive({
//             '**/*': { width: '50%', quality: quality }
//         })).on('error', (e) => { console.log(e) })
//         .pipe(imagemin(
// 			[imagemin.gifsicle({interlaced: true}),
// 			imagemin.jpegtran({progressive: true}),
// 			imagemin.optipng({optimizationLevel: 5}),
//             imagemin.svgo({plugins: [{removeViewBox: true},{cleanupIDs: false}]})]))        
// 		.pipe(rename((path) => {path.extname = path.extname.replace('jpeg', 'jpg')}))
// 		.pipe(gulp.dest('./build/img/@1x'))
// });
// // Produce @2x images
// gulp.task('img-responsive-2x', async () => {
// 	return gulp.src('./src/img/_src/**/*.{png,jpg,jpeg,webp,raw}')
//         .pipe(responsive({
//             '**/*': { width: '100%', quality: quality }
//         })).on('error', (e) => { console.log(e) })
//         .pipe(imagemin(
// 			[imagemin.gifsicle({interlaced: true}),
// 			imagemin.jpegtran({progressive: true}),
// 			imagemin.optipng({optimizationLevel: 5}),
//             imagemin.svgo({plugins: [{removeViewBox: true},{cleanupIDs: false}]})]))        
// 		.pipe(rename((path) => {path.extname = path.extname.replace('jpeg', 'jpg')}))
// 		.pipe(gulp.dest('./build/img/@2x'))
// });

// gulp.task('img', gulp.series('img-responsive-1x', 'img-responsive-2x', bsReload));

// // Clean @*x IMG's
// gulp.task('cleanimg', () => {
// 	return del(['src/img/@*'], { force: true })
// });

// gulp.task('html', () => {
//     return gulp.src(htmlFiles)
//         .pipe(gulp.dest('./src'))
// 		// .pipe(inlineCss())
//         // .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
//         // .pipe(inlinesource())			
//         // .pipe(browserSync.reload({ stream: true }))
//         .pipe(gulp.dest('./build'))
// });

// gulp.task('cleaning', () => {
// 	return del('./build', { force:true })
// });


// gulp.task('rsync', () => {
// 	return gulp.src('build/**')
// 		.pipe(rsync({
// 			root: 'build/',
// 			hostname: 'username@yousite.com',
// 			destination: 'yousite/public_html/',
// 			// include: ['*.htaccess'], // Includes files to deploy
// 			exclude: ['**/Thumbs.db', '**   /*.DS_Store'], // Excludes files from deploy
// 			recursive: true,
// 			archive: true,
// 			silent: false,
// 			compress: true
// 	}));
// });

// gulp.task('watch', () => {
// 	gulp.watch('src/sass/**/*.*', gulp.series('css'));
// 	gulp.watch(jsFiles, gulp.series('js'));
// 	gulp.watch('src/*.html', gulp.series('html'));
// 	gulp.watch('src/img/**/*', gulp.series('img'));
// });

// gulp.task('default', gulp.series('cleaning', 'fonts', 'css', 'js', 'html', 'img', gulp.parallel('browser-sync', 'watch')));
