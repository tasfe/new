var gulp = require('gulp');
var path = require('path');
var rsync = require('gulp-rsync');

gulp.task('rsync', function() {
  return gulp.src(path.resolve('./local_modules'))
    .pipe(rsync({
      progress: true,
      root: '/',
      hostname: '52.196.220.175',
      destination: 'data/test'
    }));
});