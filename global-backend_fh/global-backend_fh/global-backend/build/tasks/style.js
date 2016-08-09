module.exports = {
  concat: concat,
  compass: compass
};

function concat(gulp, plugins, config) {

  var sources = config.sources;
  var name = config.name;
  var version = config.version;
  var dest = config.dest;
  var IS_RELEASE_BUILD = config.IS_RELEASE_BUILD;

  return function() {
    gulp.src(sources)
      .pipe(plugins.concat(name + '-' + version + '.css'))
      .pipe(gulp.dest(dest))
      .pipe(plugins.if(IS_RELEASE_BUILD, plugins.minifyCss({
        keepSpecialComments: 0
      })))
      .pipe(plugins.if(IS_RELEASE_BUILD, plugins.rename({
        extname: '.min.css'
      })))
      .pipe(plugins.if(IS_RELEASE_BUILD, gulp.dest(dest)));
  };

}

function compass(gulp, plugins, config) {

  var sources = config.sources;
  var cssFolder = config.cssFolder;
  var sassFolder = config.sassFolder;
  var name = config.name;
  var version = config.version;
  var dest = config.dest;
  var IS_RELEASE_BUILD = config.IS_RELEASE_BUILD;

  return function() {
    gulp.src(sources)
      .pipe(plugins.compass({
        css: cssFolder,
        sass: sassFolder
      }))
      .pipe(plugins.rename(name + '-' + version + '.css'))
      .pipe(gulp.dest(dest))
      .pipe(plugins.if(IS_RELEASE_BUILD, plugins.minifyCss({
        keepSpecialComments: 0
      })))
      .pipe(plugins.if(IS_RELEASE_BUILD, plugins.rename({
        extname: '.min.css'
      })))
      .pipe(plugins.if(IS_RELEASE_BUILD, gulp.dest(dest)));
  };
}