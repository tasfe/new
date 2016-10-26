var gulp = require('gulp');
var path = require('path');
var rsync = require('gulp-rsync');

gulp.task('rsync', function() {

  process.env.PATH += ';' + path.resolve('./local_modules/rsync/cwRsync/bin');

  return gulp.src([path.resolve('./www/main/')])
    .pipe(rsync({
      progress: true,
      root: path.resolve('./www/main'),
      shell: 'ssh -i C:/Users/Administrator/.ssh/env_test_fh',
      hostname: '52.196.220.175',
      username: 'root',
      // relative: false,
      time: true,
      recursive: true,
      // archive: true,
      chmod: '644',
      chown: 'root:root',
      // command: true,
      // relative: false,
      destination: '/data/html/www/forehead'
    }));
});