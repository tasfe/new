var gulp = require('gulp');
var gulpPlugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var argv = require('minimist')(process.argv.slice(2));

var requirejs = require('requirejs');

var GlobalBuildConfig = require('./build.config.js');
var vendorBuildConfig = require('./src/vendor/build.config');
var baseBuildConfig = require('./src/base/build.config');

var clean = require('./build/tasks/clean');
var script = require('./build/tasks/script');
var style = require('./build/tasks/style');
var copy = require('./build/tasks/copy');
var html = require('./build/tasks/html');
var proxy = require('./build/tasks/proxy');

var APP_MODULE = argv.module;
var CURRENT_ENV = argv.env;
var APP_BUILD_CONFIG = GlobalBuildConfig.app['backend'];
var PACKAGE_BUILD_CONFIG = GlobalBuildConfig.packages['backend'];

if (APP_MODULE) {
  APP_BUILD_CONFIG = GlobalBuildConfig.app[APP_MODULE];
  PACKAGE_BUILD_CONFIG = GlobalBuildConfig.packages[APP_MODULE];
}

if (CURRENT_ENV === 'dev') {
  APP_BUILD_CONFIG.html.scriptsPerFolder['**/index.build'].push({
    src: '../scripts/require.js',
    mimeType: 'data-main',
    main: 'main-dev',
    copy: false
  });
} else {
  APP_BUILD_CONFIG.html.scriptsPerFolder['**/index.build'].push({
    src: './scripts/wt.app-' + APP_BUILD_CONFIG.scripts.version + '.min.js',
    mimeType: 'text/javascript',
    copy: false
  });
}

// gulp server
//   --module=backend|... (默认为backend)
//   --env=uat|dev|prod (默认为uat)
gulp.task('server', proxy(gulp, gulpPlugins, {
  port: 9000,
  proxyPort: 8080,
  env: CURRENT_ENV || 'uat',
  module: APP_MODULE || 'backend',
  proxyRouters: GlobalBuildConfig.proxyRouters
}));

gulp.task('dest.app.docs', ['copy.www.apps.docs']);

// gulp build.app --module=backend --env=dev && gulp dest.app --module=backend

// gulp dest.app --module=backend
gulp.task('dest.app', ['copy.www.assets', 'copy.www.scripts', 'copy.www.styles', 'copy.www.images']);

// gulp build.app --module=backend --env=dev
// gulp build.app --module=backend
gulp.task('build.app', function(done) {
  runSequence(
    'clean.www.dest',
    'clean.app.dest',
    'clean.packages.dest',
    ['style.app', 'style.app.packages', 'script.app', 'script.app.packages', 'html.app'],
    done
  );
});

// ----------------------------------------------------------
// 用于构建第三方依赖资源
// gulp build.vendor
gulp.task('build.vendor', function(done) {
  runSequence(
    'clean.vendor.dest', ['script.vendor.core', 'script.vendor.ext', 'style.vendor'],
    done
  );
});

// 用于构建base框架
// gulp build.base
gulp.task('build.base', function(done) {
  runSequence(
    'clean.base.dest', ['script.base', 'style.base'],
    done
  );
});

// 用于构建base css 并移动到目录
// gulp build.base
gulp.task('dest.style', function(done) {
  runSequence(
    'style.base',
    'html.app',
    'copy.www.styles',
    done
  );
});

// ----------------------------------------------------------

// html 相关Task
// *************************************************************
gulp.task('html.app', html(gulp, gulpPlugins, APP_BUILD_CONFIG.html));
// *************************************************************

// script 相关Task
// *************************************************************
gulp.task('script.vendor.core', script.concat(gulp, gulpPlugins, {
  sources: vendorBuildConfig.scripts.core.sources,
  name: vendorBuildConfig.scripts.core.name,
  version: vendorBuildConfig.scripts.core.version,
  dest: vendorBuildConfig.scripts.dest,
  IS_RELEASE_BUILD: true
}));

gulp.task('script.vendor.ext', script.concat(gulp, gulpPlugins, {
  sources: vendorBuildConfig.scripts.ext.sources,
  name: vendorBuildConfig.scripts.ext.name,
  version: vendorBuildConfig.scripts.ext.version,
  dest: vendorBuildConfig.scripts.dest,
  IS_RELEASE_BUILD: true
}));

gulp.task('script.base', script.concat(gulp, gulpPlugins, {
  sources: baseBuildConfig.scripts.framework.sources,
  name: baseBuildConfig.scripts.framework.name,
  version: baseBuildConfig.scripts.framework.version,
  dest: baseBuildConfig.scripts.dest,
  IS_RELEASE_BUILD: true,
  closureStart: baseBuildConfig.closureStart,
  closureEnd: baseBuildConfig.closureEnd
}));

gulp.task('script.app', function(done) {

  var name = APP_BUILD_CONFIG.scripts.name;
  var version = APP_BUILD_CONFIG.scripts.version;
  return requirejs.optimize({
    baseUrl: 'src/apps/' + APP_MODULE,
    appdir: '.',
    out: APP_BUILD_CONFIG.dest + '/scripts/' + name + '-' + version + '.min.js',
    mainConfigFile: 'src/apps/' + APP_MODULE + '/main.js',
    include: ['almond'],
    //- "uglify": (default) uses UglifyJS to minify the code.
    //- "uglify2": in version 2.1.2+. Uses UglifyJS2.
    //- "none": no minification will be done.
    optimize: 'uglify',
    preserveLicenseComments: false
  });
});

gulp.task('script.app.packages', function(done) {

  return gulp.src(PACKAGE_BUILD_CONFIG.scripts.sources)
    //.pipe(gulpPlugins.stripDebug())
    .pipe(gulp.dest(PACKAGE_BUILD_CONFIG.dest + '/scripts'))
    .pipe(gulpPlugins.uglify())
    .pipe(gulpPlugins.rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest(PACKAGE_BUILD_CONFIG.dest + '/scripts'));
});
// *************************************************************


// style 相关Task
// *************************************************************
gulp.task('style.vendor', style.concat(gulp, gulpPlugins, {
  sources: vendorBuildConfig.styles.sources,
  name: vendorBuildConfig.styles.name,
  version: vendorBuildConfig.styles.version,
  dest: vendorBuildConfig.styles.dest,
  IS_RELEASE_BUILD: true
}));

gulp.task('style.base', style.compass(gulp, gulpPlugins, {
  sources: baseBuildConfig.styles.sources + '/*.scss',
  cssFolder: baseBuildConfig.styles.dest,
  sassFolder: baseBuildConfig.styles.sources,
  name: baseBuildConfig.styles.name,
  version: baseBuildConfig.styles.version,
  dest: baseBuildConfig.styles.dest,
  IS_RELEASE_BUILD: true
}));

gulp.task('style.app', style.compass(gulp, gulpPlugins, {
  sources: APP_BUILD_CONFIG.styles.sources + '/*.scss',
  cssFolder: APP_BUILD_CONFIG.styles.dest,
  sassFolder: APP_BUILD_CONFIG.styles.sources,
  name: APP_BUILD_CONFIG.styles.name,
  version: APP_BUILD_CONFIG.styles.version,
  dest: APP_BUILD_CONFIG.styles.dest,
  IS_RELEASE_BUILD: true
}));

gulp.task('style.app.packages', function(done) {

  return gulp.src(PACKAGE_BUILD_CONFIG.styles.sources)
    .pipe(gulpPlugins.compass({
      css: PACKAGE_BUILD_CONFIG.styles.cssFolder,
      sass: PACKAGE_BUILD_CONFIG.styles.sassFolder
    }))
    .pipe(gulp.dest(PACKAGE_BUILD_CONFIG.dest + '/styles'))
    .pipe(gulpPlugins.minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(gulpPlugins.rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest(PACKAGE_BUILD_CONFIG.dest + '/styles'));
});
// *************************************************************


// Clean 相关Task
// *************************************************************
gulp.task('clean.www.dest', clean(gulp, gulpPlugins, {
  path: './www/' + APP_MODULE
}));

gulp.task('clean.vendor.dest', clean(gulp, gulpPlugins, {
  path: vendorBuildConfig.dest
}));

gulp.task('clean.base.dest', clean(gulp, gulpPlugins, {
  path: baseBuildConfig.dest
}));

gulp.task('clean.app.dest', clean(gulp, gulpPlugins, {
  path: './src/apps/' + APP_MODULE + '/dist'
}));

gulp.task('clean.packages.dest', clean(gulp, gulpPlugins, {
  path: './src/apps/' + APP_MODULE + '/packages/dist'
}));
// *************************************************************

// Copy 相关Task
// *************************************************************
gulp.task('copy.www.assets', copy.copy(gulp, gulpPlugins, {
  src: [
    './src/vendor/assets/**/*.*'
  ],
  pipes: {},
  dest:  './www/' + APP_MODULE + '/assets'
}));

gulp.task('copy.www.scripts', copy.copy(gulp, gulpPlugins, APP_BUILD_CONFIG.copy.scripts));

gulp.task('copy.www.styles', copy.copy(gulp, gulpPlugins, APP_BUILD_CONFIG.copy.styles));

gulp.task('copy.www.images', copy.copy(gulp, gulpPlugins, APP_BUILD_CONFIG.copy.images));

gulp.task('copy.www.apps.docs', copy.copy(gulp, gulpPlugins, {
    src: [
        './src/apps/docs/**/*.*'
    ],
    pipes: {},
    dest: './www/docs'
}));
// *************************************************************
