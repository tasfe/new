"use strict";

var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minfyCss = require('gulp-minify-css');
var path = require('path');
var del = require('del');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var cache = require('gulp-cache');
var Fontmin = require('fontmin');
var svgo = require('imagemin-svgo');
var fs = require('fs');
var rsync = require('./local_modules/rsync');

var _ = require('underscore');

var mockup = require('./local_modules/mockup/index');
var mockupConfig = require('./mockup.config');

var runSequence = require('run-sequence');

//css sprite
var spritesmith = require('gulp.spritesmith');

var webpack = require('webpack');
var WebpackDevServer = require("webpack-dev-server");
var rename = require('gulp-rename');

var argv = require('minimist')(process.argv.slice(2));

var devFactory = require('./webpack.dev.factory');
var productionFactory = require('./webpack.production.factory');

var mainConfig = require('./webpack.main.config');
var externalConfig = require('./webpack.external.config');
var dllConfig = require('./webpack.dll.config');

var fontConfig = require('./font-config.json');

var serverIP = 'http://forehead.highborn.cn';

var packageConfig;
var projectPath;

switch (argv.package)  {
  case 'main':
    packageConfig = mainConfig;
    projectPath = 'main';
    break;
  case 'external':
    packageConfig = externalConfig;
    projectPath = 'external';
    break;
  default :
    packageConfig = mainConfig;
    projectPath = 'main';
    break;
}

if (argv.env === 'uat') {
  serverIP = 'http://52.69.95.127/';
}

gulp.task('server', function (callback) {
  runSequence(
    ['server.webpack', 'server.mockup']
  );
});

// Start a webpack-dev-server
gulp.task("server.webpack", function(callback) {
  console.log(serverIP);
  var devConfig = devFactory({
    appConfig: packageConfig
  });

  var proxy = [
    {
      path: '*.json',
      target: serverIP,
      changeOrigin: true
    },
    {
      path: 'mock/*.json',
      target: 'http://localhost:7070/'
    },
    {
      path: '*',
      target: serverIP,
      changeOrigin: true
    }
  ];

  if (argv.mockup) {
    proxy = _(mockupConfig.routers).map(function(val, path) {
      return {
        path: path,
        target: 'http://localhost:7070/'
      };
    }).concat(proxy);
  }

  new WebpackDevServer(webpack(devConfig), {
    publicPath: devConfig.output.publicPath,
    hot: true,
    historyApiFallback: true,
    proxy: proxy,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    headers: {'X-Custom-Header': 'no'},
    stats: {
      colors: true,
      // reasons: DEBUG,
      hash: true,
      version: true,
      timings: true,
      chunks: false,
      chunkModules: true,
      cached: true,
      cachedAssets: true,
      assets: false
      // chunkModules: false
    }
  }).listen(devConfig.port, function(err, result) {
      if (err) {
        console.log(err);
      }

      console.log('Listening at localhost:' + devConfig.port);
    });

});

//启动mockup服务器
gulp.task('server.mockup', function(callback) {
  if (argv.mockup) {
    mockup(gulp, {
      port: 7070,
      proxyRouters: mockupConfig
    })();
  } else {
    console.log("mockup server doesn't running");
    callback();
  }
});

gulp.task('release', function(callback) {
  runSequence(
    'release.clean',
    'release.build',
    ['release.js', 'release.css', 'release.assets', 'release.html', 'release.compatible'],
    callback
  );
});

gulp.task('release.rsync', function(callback) {
  runSequence(
    'release',
    'rsync',
    callback
  );
});

gulp.task("webpack", function(callback) {
  var productionConfig = productionFactory({
    appConfig: packageConfig
  });

  webpack(productionConfig, function(err, stats) {
    if(err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      // output options
    }));

    fs.writeFileSync('./stats.json', JSON.stringify(stats.toJson()));
    // gulp.pipe(stats.toJson())
    //   .dest('./stats.json');

    callback();
  });
});

//图片压缩
gulp.task('image.min', function() {
  del('./minImages');
  gulp.src('./src/**/*.{png,jpg,ico}')
    .pipe(cache(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant({
        //quality: '70-80'
      })]
    })))
    .pipe(gulp.dest('./src/'));
});

//字体提取格式转换，原生字体推荐ttf原生格式
gulp.task('font.min', function(callback) {
  runSequence(
    'font.minimal',
    'font.dest',
    callback
  );
});

gulp.task('font.minimal', function(cb) {
  _(fontConfig).each(function(fontConfig) {
    var fontmin = new Fontmin()
      .src('./src/base/fonts/origins/' + fontConfig.font)
      .use(Fontmin.glyph({
        text: fontConfig.text,
        hinting: false
      }));

    if (_(fontConfig.targets).contains('eot')) {
      fontmin.use(Fontmin.ttf2eot());
    }

    if (_(fontConfig.targets).contains('woff')) {
      fontmin.use(Fontmin.ttf2woff({
        deflate: true           // deflate woff. default = false
      }));
    }

    if (_(fontConfig.targets).contains('svg')) {
      fontmin.use(Fontmin.ttf2svg())
        .use(svgo());
    }

    fontmin.use(Fontmin.css({
      fontPath: '~base/fonts/',         // location of font file
      // base64: true,           // inject base64 data:application/x-font-ttf; (gzip font with css).
      //                         default = false
      // glyph: true,            // generate class for each glyph. default = false
      // iconPrefix: 'my-icon',  // class prefix, only work when glyph is `true`. default to "icon"
      // fontFamily: 'myfont',   // custom fontFamily, default to filename or get from analysed ttf file
      asFileName: true,      // rewrite fontFamily as filename force. default = false
      local: true             // boolean to add local font. default = false
    }))
      .dest('./src/base/fonts');

    fontmin.run(function (err, files) {
      if (err) {
        throw err;
      }
      console.log(files[0]);

      //此处有bug
      cb();
      // => { contents: <Buffer 00 01 00 ...> }
    });
  });

});

gulp.task('font.dest', function(callback) {
   var imports = [];
  _(fontConfig).each(function(fontConfig) {
    gulp.src('./src/base/fonts/' + fontConfig.target + '.css')
      .pipe(rename(fontConfig.target + '.scss'))
      .pipe(gulp.dest('./src/base/styles/fonts'));

    del(['./src/base/fonts/' + fontConfig.target + '.css']);
    console.log('./src/base/fonts/' + fontConfig.target + '.css');

    imports.push('"fonts/' + fontConfig.target + '"');
  });

  fs.writeFile('./src/base/styles/_fonts.scss', '@charset "UTF-8";\n@import\n' + imports.join(',\n') + ';', callback);
});

gulp.task('build.sprite', function(callback) {
  var spriteData =
    gulp.src(['./src/base/images/sprites/*.png', './src/base/images/sprites/*/*'])
      .pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: '_sprite.scss',
        cssFormat: 'scss',
        imgPath: '~base/images/sprite.png',
        algorithm: 'binary-tree',
        cssVarMap: function(sprite) {
          sprite.name = 'sfa-' + sprite.name;
        }
      }));

  var imgStream = spriteData.img
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant({
        //quality: '70-80'
      })]
    }))
    .pipe(gulp.dest('./src/base/images'));
  spriteData.css.pipe(gulp.dest('./src/base/styles'));
  callback();
});

//清理dist
gulp.task('release.clean', function(callback) {
  del.sync([
    './dist/' + projectPath + '/*',
    './www/' + projectPath + '/*'
  ]);
  callback();
});

//编译dll
gulp.task('dll:prepare', function(callback) {
  del('./src/dist/dll/*');
  global.DLL = 1;

  var dllWebpackConfig = require('./webpack-config-factory')({
    appConfig: dllConfig
  });

  webpack(dllWebpackConfig, function(err, stats) {
    if(err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      // output options
    }));
    callback();
  });
});

//编译生产版本
gulp.task("release.build", function(callback) {
  var productionConfig = productionFactory({
    appConfig: packageConfig
  });

  webpack(productionConfig, function(err, stats) {
    if(err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      // output options
    }));
    callback();
  });
});

//压缩转移js
gulp.task('release.js', function() {
  return gulp.src([
    './dist/' + projectPath + '/*.js',
    './src/dll/*.js'
  ])
    .pipe(uglify())
    .pipe(gulp.dest(path.join('./www/', packageConfig.output.path + packageConfig.output.publicPath)));
});

//压缩转移css
gulp.task('release.css', function() {
  return gulp.src([
    './dist/' + projectPath + '/*.css',
    './src/dll/*.css'
  ])
    .pipe(minfyCss({
      compatibility: 'ie8'
    }))
    .pipe(gulp.dest(path.join('./www/', packageConfig.output.path + packageConfig.output.publicPath)));
});

//压缩转移其它资源 assets
gulp.task('release.assets', function() {
  return gulp.src([
    './dist/' + projectPath + '/*.+(jpg|png|gif|eot|woff|svg|tff|eot|woff2|swf|ico)',
    './src/dll/*.+(jpg|png|gif|eot|woff|svg|tff|eot|woff2|swf|ico)'
  ])
    .pipe(gulp.dest(path.join('./www/', packageConfig.output.path + packageConfig.output.publicPath)));
});

//压缩转移兼容性文件
gulp.task('release.compatible', function() {
  return gulp.src([
    './bower_components/es5-shim/es5-sham.min.js',
    './bower_components/es5-shim/es5-shim.min.js',
    './bower_components/json2/json2.js'
  ])
    .pipe(uglify())
    .pipe(gulp.dest('./www/' + packageConfig.output.path + '/compatible'));
});

//压缩转移css
gulp.task('release.html', function() {
  return gulp.src(['./dist/' + projectPath + '/*.html'])
    .pipe(gulp.dest(path.join('./www/' + packageConfig.output.path + '/')));
});
