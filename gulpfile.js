var gulp = require("gulp"),
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
