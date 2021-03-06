var argv = require('yargs').argv;

var gulp = require('gulp');

// Plugins.
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var sass = require('gulp-sass');

var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var rename = require('gulp-rename');
var gulpif = require('gulp-if');
var jsonlint = require("gulp-jsonlint");

var header = require('gulp-header');
var pkg = require('./version.json');
var banner = ['/**',
  ' * @name <%= pkg.name %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.link %>',
  ' */',
  ''].join('\n');

// We only want to process our own non-processed JavaScript files.
var jsPath = ['./js/search.js', './js/*/*.js', '!./js/assets/*'];
var jsAssets = ['./js/assets/*.min.js', '!./js/assets/angular.js', '!./js/assets/angular.min.js'];
var sassPath = './scss/*.scss';
var jsonPath = [ './version.json' ]

var buildDir = './build';

/**
 * Run Javascript through JSHint.
 */
gulp.task('jshint', function() {
  return gulp.src(jsPath)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

/**
 * Process SCSS using libsass
 */
gulp.task('sass', function () {
  gulp.src(sassPath)
    .pipe(sourcemaps.init())
      .pipe(sass({
        outputStyle: 'compressed',
        includePaths: [
          'bower_components/compass-mixins/lib',
          'bower_components/foundation/scss'
        ]
      }).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./stylesheets'));
});

/**
 * Watch files for changes and run tasks.
 */
gulp.task('watch', function() {
  gulp.watch(jsPath, ['jshint']);
  gulp.watch(sassPath, ['sass']);
  gulp.watch(jsonPath, ['json']);
});

/**
 * Watch javascript files for changes.
 */
gulp.task('js-watch', function() {
  gulp.watch(jsPath, ['jshint']);
});

/**
 * Build single app.js file.
 */
gulp.task('appJs', function () {
  gulp.src(jsPath)
    .pipe(sourcemaps.init())
      .pipe(concat('search.js'))
      .pipe(ngAnnotate())
      .pipe(gulpif(argv.production, uglify()))
    .pipe(sourcemaps.write('/maps'))
    .pipe(gulpif(argv.production, rename({extname: ".min.js"})))
    .pipe(header(banner, { pkg : pkg } ))
    .pipe(gulp.dest(buildDir))
});

/**
 * Build single app.js file.
 */
gulp.task('assetsJs', function () {
  gulp.src(jsAssets)
    .pipe(concat('assets.js'))
    .pipe(gulpif(argv.production, rename({extname: ".min.js"})))
    .pipe(gulp.dest(buildDir))
});

/**
 * Check json files.
 */
gulp.task('json', function() {
  gulp.src(jsonPath)
    .pipe(jsonlint())
    .pipe(jsonlint.reporter());
});

// Tasks to compile sass and watch js file.
gulp.task('default', ['sass', 'watch']);

gulp.task('build', ['appJs', 'assetsJs', 'sass']);
