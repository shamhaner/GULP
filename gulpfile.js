// To write scripts to a line, add " inline" after the specified file path to the closing scripts tag.

const		gulp				= require('gulp');
            browserSync			= require('browser-sync');
            sass				= require('gulp-sass');
            autoprefixer		= require('gulp-autoprefixer');
            concat				= require('gulp-concat');
            cleanCSS			= require('gulp-clean-css');
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


siteRoot = './build/';

htmlFiles = [
    './src/*.html'
];

cssFiles = [
    './src/sass/**/*.sass'
];

SW = [
	'./src/serviceWorker.js',
	'./src/sw.js'
];

jsFiles = [
	'./node_modules/jquery/dist/jquery.min.js',
	'./src/libs/**/*.js',
    './src/_lazy.js',
    './src/animation.js',
    './src/main.js'    
];



// Local Server
gulp.task('browser-sync', () => {
	browserSync({
		server: {
			baseDir: siteRoot
		},
		notify: false,
		// online: false, // Work offline without internet connection
		// tunnel: true, tunnel: 'project', // Demonstration page: http://project.localtunnel.me
	})
});
function bsReload(done) { browserSync.reload(); done(); };

// Custom Styles
gulp.task('CSS', () => {
	return gulp.src(cssFiles)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(concat('main.css'))
		.pipe(autoprefixer({
			grid: true,
			overrideBrowserslist: ['last 10 versions']
		}))
        .pipe(sourcemaps.write('./maps'))
		.pipe(cleanCSS({level:2}))
		.pipe(purge({
			trim : true,
			shorten : true,
			verbose : true
    }))        
		.pipe(gulp.dest('./src'))
		.pipe(browserSync.reload({ stream: true }));
});

gulp.task('copy', () => {
	return gulp.src('./src/main.css')
		.pipe(gulp.dest('./build'))
		.pipe(browserSync.reload({ stream: true }));
});

gulp.task('styles', gulp.series('CSS', 'copy'));


// Scripts & JS Libraries
gulp.task('JS', () => {
	return gulp.src(jsFiles)
	.pipe(sourcemaps.init())
	.pipe(concat('main.js'))
	.pipe(babel({
		presets: ['@babel/env']
	}))
	.pipe(uglify())	
	.pipe(sourcemaps.write('./maps'))
	.pipe(gulp.dest('./build'))
	.pipe(browserSync.stream())
});

gulp.task('SW', () => {
    return gulp.src(SW)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./build'))
        .pipe(browserSync.stream());
});

gulp.task('scripts', gulp.series('JS', 'SW'));

// Responsive Images
var quality = 95; // Responsive images quality

// Produce @1x images
gulp.task('img-responsive-1x', async () => {
	return gulp.src('src/img/_src/**/*.{png,jpg,jpeg,webp,raw}')
		.pipe(newer('src/img/@1x'))
		.pipe(responsive({
			'**/*': { width: '50%', quality: quality }
		})).on('error', function (e) { console.log(e) })
		.pipe(imagemin(
			[imagemin.gifsicle({interlaced: true}),
			imagemin.jpegtran({progressive: true}),
			imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({plugins: [{removeViewBox: true},{cleanupIDs: false}]})])) 
		.pipe(rename(function (path) {path.extname = path.extname.replace('jpeg', 'jpg')}))
		.pipe(gulp.dest('build/img/@1x'))
});
// Produce @2x images
gulp.task('img-responsive-2x', async () => {
	return gulp.src('src/img/_src/**/*.{png,jpg,jpeg,webp,raw}')
		.pipe(newer('src/img/@2x'))
		.pipe(responsive({
			'**/*': { width: '100%', quality: quality }
		})).on('error', function (e) { console.log(e) })
		.pipe(imagemin(
			[imagemin.gifsicle({interlaced: true}),
			imagemin.jpegtran({progressive: true}),
			imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({plugins: [{removeViewBox: true},{cleanupIDs: false}]})]))
		.pipe(rename(function (path) {path.extname = path.extname.replace('jpeg', 'jpg')}))
		.pipe(gulp.dest('build/img/@2x'))
});
gulp.task('img', gulp.series('img-responsive-1x', 'img-responsive-2x', bsReload));

// Code & Reload
gulp.task('code', () => {
	return gulp.src(htmlFiles)
	.pipe(inlineCss())
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
	.pipe(inlinesource())
    .pipe(gulp.dest('build/'))
	.pipe(browserSync.stream())
});

//Fonts

gulp.task('fontsA', () => {
	return gulp.src('./node_modules/@fortawesome/fontawesome-free/webfonts/*')
		.pipe(gulp.dest('./build/fonts/webfonts'))
		.pipe(browserSync.stream());
});

gulp.task('fontsC', () => {
	return gulp.src('./src/fonts/**/*.*')
		.pipe(gulp.dest('./build/fonts'))
		.pipe(browserSync.stream());
});

gulp.task('fonts', gulp.series('fontsA', 'fontsC'));

// Cleaning

gulp.task('cleaning', function() {
	return del(['./src/main.css','./src/maps/','./src/img/@1x','./src/img/@2x','./build'], { force:true })
});

// Deploy
gulp.task('rsync', () => {
	return gulp.src(siteRoot)
	.pipe(rsync({
		root: siteRoot,
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

gulp.task('watch', () => {
	gulp.watch('./src/sass/**/*.sass', gulp.series('styles','code'));
	gulp.watch([
		'./src/serviceWorker.js',
		'./src/sw.js',
		'./node_modules/jquery/dist/jquery.min.js',
		'./src/libs/**/*.js',
		'./src/_lazy.js',
		'./src/animation.js',
		'./src/main.js' 
	], 
	gulp.series('scripts','code'));
	gulp.watch('./src/*.html', gulp.parallel('code'));
	gulp.watch('./src/img/**/*', gulp.series('img','code'));
});
gulp.task('default', gulp.series('cleaning','fonts','img', 'styles', 'scripts', 'code', gulp.parallel('browser-sync', 'watch')));
gulp.task('d', gulp.series('cleaning'));