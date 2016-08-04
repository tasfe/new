var requirejs = require('requirejs');

module.exports = {
  concat: concat,
  requirejs: requirejs
};

function concat(gulp, plugins, config) {

  var sources = config.sources;
  var name = config.name;
  var version = config.version;
  var dest = config.dest;
  var IS_RELEASE_BUILD = config.IS_RELEASE_BUILD;
  var USE_CLOSURE = !!config.closureStart && !!config.closureEnd;

  return function() {
    gulp.src(sources)
      .pipe(plugins.if(IS_RELEASE_BUILD, plugins.stripDebug()))
      .pipe(plugins.concat(name + '-' + version + '.js'))
      .pipe(plugins.if(USE_CLOSURE, plugins.header(config.closureStart)))
      .pipe(plugins.if(USE_CLOSURE, plugins.footer(config.closureEnd)))
      .pipe(gulp.dest(dest))
      .pipe(plugins.if(IS_RELEASE_BUILD, plugins.uglify()))
      .pipe(plugins.if(IS_RELEASE_BUILD, plugins.rename({
        extname: '.min.js'
      })))
      .pipe(plugins.if(IS_RELEASE_BUILD, gulp.dest(dest)));
  };

}

function requirejs(gulp, plugins, config) {

}