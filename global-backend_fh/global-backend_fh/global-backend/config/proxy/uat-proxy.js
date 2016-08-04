var fs = require('fs');
var connect = require('connect');
var url = require('url');
var request = require('request');
var connectRoute = require('connect-route');
var proxyMiddleware = require('./proxy-middleware');
var proxyConfigs = require('./uat-proxy-conf');


var app = connect();
exports.startProxy = function(options) {
  var port = options.port;
  var routeCfg = options.routeConfig || {};
  console.log('routerCfg are ', routeCfg);
  app.use(connectRoute(function(router) {
    //===================Put test data here=================================//
    Object.keys(routeCfg).forEach(function(path) {
      var file = routeCfg[path];
      console.log('confing routing ' + path + ' to file ' + file);
      router.get(path, fromFile(file));
      router.post(path, fromFile(file));
    });

    router.get('/SomeOther/*', function(req, res, next) {
      //custom reponse
      res.end('');
    });
  }));

  app.use('/', proxyMiddleware(proxyConfigs));
  app.listen(port);
};


function fromFile(testFile) {
  return function(req, res, next) {
    fs.readFile(testFile, {
      encoding: 'UTF-8'
    }, function(err, data) {
      if (err) {
        console.log('failed to read ', err);
      }
      res.end(data);
    });
  };
}