var gutil = require('gulp-util');
var connect = require('connect');

var proxyMapping = {
  dev: require('./dev-proxy')
};

module.exports = function(gulp, config) {

  var port = config.port;
  var proxyRouters = config.proxyRouters;

  return function() {

    proxyMapping.dev.startProxy({
      port: port,
      routeConfig: proxyRouters.routers
    });
    gutil.log(gutil.colors.green('mockup Server started on ' + port + ' port'));

  };
  
};