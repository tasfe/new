"use strict";

var fs = require('fs');
var gutil = require('gulp-util');
var connect = require('connect');
var url = require('url');
var connectRoute = require('connect-route');
var proxyMiddleware = require('./proxy-middleware');

var app = connect();
exports.startProxy = function(options) {
  var port = options.port;
  var routeCfg = options.routeConfig || {};
  gutil.log(gutil.colors.green('routerCfg are ' + routeCfg));

  app.use(connectRoute(function(router) {
    //===================Put test data here=================================//
    Object.keys(routeCfg).forEach(function(path) {
      var file = routeCfg[path];
      console.log('config routing ' + path + ' to file ' + file);
      router.get(path, fromFile(file));
      router.post(path, fromFile(file));
    });

    router.get('/SomeOther/*', function(req, res, next) {
      //custom reponse
      res.end('');
    });
  }));

  //app.use('/', proxyMiddleware({
  //  ua: 'android', //android|ios|chrome|ie|android_tablet
  //  urlRules: [{
  //    pattern: '*', //proxy the static resources to localhost
  //    target: 'http://localhost:8080'
  //  }]
  //}));
  app.listen(port);
};


function fromFile(testFile) {
  return function(req, res, next) {
    setInterval(function() {
      fs.readFile(testFile, {
        encoding: 'UTF-8'
      }, function(err, data) {
        if (err) {
          console.log('failed to read ', err);
        }
        res.end(data);
      });
    }, 300);
  };
}