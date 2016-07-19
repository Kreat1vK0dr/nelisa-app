    var gulp = require('gulp'),
        sourcemaps = require('gulp-sourcemaps'),
        concat = require('gulp-concat'),
        uglify = require('gulp-uglify'),
        sass = require('gulp-sass'),
        cleanCSS = require('gulp-clean-css'),
        autoprefixer = require('gulp-autoprefixer'),
        gzip = require('gulp-gzip'),
        imagemin = require('gulp-imagemin'),
        rename = require('gulp-rename'),
        nodemon = require('gulp-nodemon'),
        // watch = require('gulp-watch'),
        mocha = require("gulp-mocha"),
        shell = require("gulp-shell");


gulp.task('db_setup', function(cb){
  shell.task([
  'bash ./database_setup/db_setup'
]);
cb();
});

  gulp.task('mocha', ['db_setup'], function () {
  	return gulp.src('./test/dataTest.js', {read: false})
  		// gulp-mocha needs filepaths so you can't have any plugins before it
  		.pipe(mocha());
      process.exit(0);
  });

  // MUST RUN $ sudo gulp nodemon


  // Optimize Images task
  // gulp.task('compress-images', function () {
  //     return gulp.src('./public/assets/img/**/*.{gif,jpg,png}')
  //         .pipe(imagemin({
  //             progressive: true,
  //             interlaced: true,
  //             svgoPlugins: [{
  //                 removeViewBox: false
  //             }, {
  //                 removeUselessStrokeAndFill: false
  //             }]
  //         }))
  //         .pipe(gulp.dest('./public/assets/img'))
  // });

  //OR THIS
  // gulp.task('bundle-sass', function () {
  //     gulp.src('./dev/sass/main.sass')
  //         .pipe(sourcemaps.init())
  //         .pipe(sass({
  //             includePaths: ['./dev/sass'],
  //             indentedSyntax: true,
  //             outputStyle: 'expanded',
  //             data: 'file'
  //         }).on('error', sass.logError))
  //         .pipe(sourcemaps.write('./maps'))
  //         .pipe(gulp.dest('./public/css'));
  // });

  gulp.task('minify-css', function () {
      gulp.src('./public/css/main.css')
          .pipe(sourcemaps.init())
          .pipe(autoprefixer({
              browsers: ['last 2 versions'],
              cascade: false
          }))
          .pipe(cleanCSS({
              compatibility: 'ie8'
          }))
          .pipe(rename('main.min.css'))
          .pipe(sourcemaps.write('./maps'))
          .pipe(gulp.dest('./public/css'));
  });

  gulp.task('compress-css', function () {
      gulp.src('./public/css/main.min.css')
          .pipe(sourcemaps.init())
          .pipe(gzip())
          .pipe(sourcemaps.write('./maps'))
          .pipe(gulp.dest('./public/css'));
  });
  //
  // gulp.task('bundle-scripts', function () {
  //     gulp.src('./dev/js/*.js')
  //         .pipe(sourcemaps.init())
  //         .pipe(concat('main.js'))
  //         .pipe(sourcemaps.write('./maps'))
  //         .pipe(gulp.dest('./public/js'));
  // });

  gulp.task('minify-js', function () {
      gulp.src('./public/js/*.js')
          .pipe(sourcemaps.init())
          .pipe(uglify())
          .pipe(rename({suffix:'.min'}))
          .pipe(sourcemaps.write('./min/maps'))
          .pipe(gulp.dest('./public/js/min'));
  });

  gulp.task('compress-js', function () {
      gulp.src('./public/js/min/*.min.js')
          .pipe(sourcemaps.init())
          .pipe(gzip())
          .pipe(rename({suffix: '.gzip'}))
          .pipe(sourcemaps.write('../gzip/maps'))
          .pipe(gulp.dest('./public/js/gzip'));
  });

  gulp.task('watch', function () {
      gulp.watch('./dev/sass/*.sass', ['minify-css', 'compress-css']);
      // gulp.watch('./dev/sass/*.sass', ['bundle-sass', 'minify-css', 'compress-css']);
      gulp.watch('./dev/js/*.js', ['minify-js', 'compress-js']);
      // gulp.watch('./dev/js/*.js', ['bundle-scripts', 'minify-js', 'compress-js']);
      // gulp.watch('./public/assets/images/**/*.{gif,jpg,png}', ['compress-images']);
  });

  gulp.task('nodemon', function () {
      nodemon({
              script: 'app.js'
          })
          .on('start', ['minify-css', 'compress-css', 'minify-js', 'compress-js', 'watch'], function () {
              console.log('start!');
          })
          .on('change', ['watch'], function () {
              console.log('changed!');
          })
          .on('restart', function () {
              console.log('restarted!');
          });
  })
