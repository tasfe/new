var gulp = require('gulp');
var path = require('path');
var rsync = require('gulp-rsync');

gulp.task('rsync', function() {
  // console.log(gulp.src(path.resolve('./local_modules') + '/mockup/dev-proxy.js'));
  return gulp.src(path.resolve('./local_modules') + '/mockup/dev-proxy.js')
    .pipe(rsync({
      progress: true,
      root: path.resolve('./local_modules/mockup'),
      hostname: '52.196.220.175',
      username: 'root',
      destination: '/data/test/'
    }));
});