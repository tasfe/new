var path = require('path');
var ternaryStream = require('ternary-stream');
var minimatch = require('minimatch');
var glob = require('glob');

module.exports = {
  multicopy: multicopy,
  copy: copy
};

function subDirs(dir) {
  return [].slice.call(glob.sync('*/', {
    cwd: dir
  }));
}

function createCopyPipe(gulp, plugins, config) {
  var pipe = gulp.src(config.src);
  Object.keys(config.pipes).forEach(function(pattern) {
    pipe = pipe.pipe(ternaryStream(function(file) {
      return minimatch(file.relative, pattern);
    }, config.pipes[pattern]));
  });
  return pipe;
}

function copy(gulp, plugins, config) {
  return function() {
    return createCopyPipe(gulp, plugins, config)
      .pipe(gulp.dest(config.dest));
  }
}

function multicopy(gulp, plugins, config) {
  return function() {
    var pipe = createCopyPipe(gulp, plugins, config);
    var modules = subDirs('modules');
    if (config.exclude) {
      modules = modules.filter(function(module) {
        return config.exclude.indexOf(module) === -1;
      });
    }
    modules.map(function(module) {
      pipe = pipe.pipe(gulp.dest(path.join(config.dest, module)));
    });
    return pipe;
  };
}