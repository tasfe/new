var minimatch = require('minimatch');
var through2 = require('through2');
var path = require('path');
var fs = require('fs');
var VinylFile = require('vinyl');

module.exports = function(gulp, plugins, config) {

  return function() {
    return gulp.src(config.src)
      .pipe(through2.obj(function(file, enc, done) {
        var fileName = file.relative;
        var self = this;
        var scripts = filterByFile(config.scriptsPerFolder, fileName).map(function(script) {
          var scriptTag;
          var scriptSrc = script.src;
          if (script.copy || script.copyOnly) {
            scriptSrc = path.basename(script.src);
            self.push(new VinylFile({
              cwd: file.cwd,
              base: file.base,
              path: path.join(path.dirname(file.path), scriptSrc),
              contents: fs.readFileSync(script.src)
            }));
          };
          if (script.copyOnly) {
            return '';
          }
          if (scriptSrc) {
            if (script.mimeType === 'data-main') {
              scriptTag = '<script data-main="' + script.main + '" src="' + scriptSrc + '"></script>';
            } else {
              scriptTag = '<script src="' + scriptSrc + '" type="' + script.mimeType + '"></script>';
            }
          } else {
            scriptTag = '<script type="' + script.mimeType + '">' + script.inline + '</script>';
          }
          return scriptTag;
        }).join('\n');

        var styles = filterByFile(config.stylesPerFolder, fileName).map(function(style) {

          var styleTag;
          var styleHref = style.href;
          if (style.copy || style.copyOnly) {
            styleHref = path.basename(style.href);
            self.push(new VinylFile({
              cwd: file.cwd,
              base: file.base,
              path: path.join(path.dirname(file.path), styleHref),
              contents: fs.readFileSync(style.href)
            }));
          };
          if (style.copyOnly) {
            return '';
          }
          if (styleHref) {
            styleTag = '<link rel="' + style.mimeType + '" href="' + styleHref + '">';
          } else {
            styleTag = '<style type="' + style.mimeType + '">' + style.inline + '</style>';
          }
          return styleTag;

        }).join('\n');

        file.contents = new Buffer(file.contents.toString().replace('$SCRIPTS$', scripts).replace('$STYLES$', styles));
        this.push(file);
        done();
      }))
      .pipe(plugins.rename({extname: '.html'}))
      .pipe(gulp.dest(config.dest));
  };
};

function filterByFile(pathMapping, folder) {
  var folderParts = folder.split(path.sep);
  var match;
  var lastPattern;
  for (var pattern in pathMapping) {
    if (minimatch(folder, pattern)) {
      if (!lastPattern || lastPattern.length < pattern.length) {
        match = pathMapping[pattern];
        lastPattern = pattern;
      }
    }
  }
  if (match !== undefined) {
    return match;
  } else {
    throw new Error('No entry for folder ' + folder + ' found in ' + JSON.stringify(pathMapping));
  }
}