var gulp = require('gulp');
var path = require('path');
var rsync = require('gulp-rsync');

gulp.task('rsync', function() {
  // console.log(gulp.src(path.resolve('./local_modules') + '/mockup/dev-proxy.js'));
  return gulp.src([path.resolve('./www/main/**')])
    .pipe(rsync({
      progress: true,
      root: path.resolve('./www/main'),
      shell: 'ssh -i C:/Users/Administrator/.ssh/id_rsa',
      hostname: '52.196.220.175',
      username: 'root',
      // relative: false,
      recursive: true,
      archive: true,
      // command: true,
      // relative: false,
      // include: ['*.png'],
      destination: '/data/test/'
    }));
});