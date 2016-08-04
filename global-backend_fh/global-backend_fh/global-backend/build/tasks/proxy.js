var gutil = require('gulp-util');
var connect = require('connect');
var rewriteModule = require('http-rewrite-middleware');
var open = require('open');

var proxyMapping = {
  'dev': require('../../config/proxy/dev-proxy'),
  'uat': require('../../config/proxy/uat-proxy'),
  'prod': require('../../config/proxy/prod-proxy')
};

module.exports = function(gulp, plugins, config) {

  var port = config.port;
  var proxyPort = config.proxyPort;
  var currentEnv = config.env;
  var proxyRouters = config.proxyRouters;
  var module = config.module;

  var app = connect();

  return function() {

    app.use(rewriteModule.getMiddleware([{
      from: '^/apps/(.*)$',
      to: '/$1'
    }, {
      from: '^/www/(.*)$',
      to: '/$1'
    }]));

    app.use(connect.static('./www'));
    app.use(connect.static('./src/apps'));
    app.use(connect.static('./src/vendor'));

    app.listen(port);
    gutil.log(gutil.colors.green('Server started on ' + port + ' port'));

    gutil.log(gutil.colors.green('Current env is ' + currentEnv));
    proxyMapping[currentEnv].startProxy({
      port: proxyPort,
      routeConfig: proxyRouters
    });
    gutil.log(gutil.colors.green('Proxy Server started on ' + proxyPort + ' port'));

    open('http://localhost:' + proxyPort + '/apps/' + module + '/index.html', 'chrome');

  };
  
};