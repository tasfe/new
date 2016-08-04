var _ = require('underscore');
var fs = require('fs');
var os = require('os');
var urlUtil = require('url');
var cookieUtil = require('cookie');
var regexQuote = require('regexp-quote');

var urlPattern = require('url-pattern');

var cookieStore = {};
var urlRules = [];
var ua = '';
var log = console.log;
module.exports = function(options) {
  // console.log('options: ', options);
  console.log('-----: ', os.tmpdir() + '/mobileProxyCookie');
  fs.readFile(os.tmpdir() + '/mobileProxyCookie', function(err, data) {
    if (err) {
      console.log('Not found cookie persistence.');
      return;
    }
    cookieStore = JSON.parse(data);
  });

  if (options.ua) {
    switch (options.ua) {
      case 'android':
        ua = 'Mozilla/5.0 (Linux; U; Android 4.0.2; en-us; Galaxy Nexus Build/ICL53F) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30';
        break;
      case 'ios':
        ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3';
        break;
      default:
        ua = '';
    }
  }
  urlRules = options.urlRules;
  return function(req, resp, next) {

    // console.log('making request');

    var matchedConfig = matchReqByConfig(req);
    if (!matchedConfig) {
      next();
    }
    var target = matchedConfig.target;

    var opts = urlUtil.parse(target);
    //https://uat.citivelocity.com/ ->
    //{protocol:,path:,pathname:,}
    var httpLib = opts.protocol === 'https:' ? 'https' : 'http';
    var request = require(httpLib).request;
    opts.path = req.url;
    opts.method = req.method;
    opts.headers = opts.headers ? _.extend(req.headers, opts.headers) : req.headers;
    Object.keys(cookieStore).forEach(function(key) {
      if (!req.headers.Cookie) {
        req.headers.Cookie = '';
      }
      var val = cookieStore[key];
      if (key && val) {
        req.headers.Cookie += key + '=' + val + ';';
      }
    });
    if (ua) {
      opts.headers['User-Agent'] = ua;
    }
    delete opts.headers['host'];

    //TODO Organize with Q promise.
    var myReq = request(opts, function(myRes) {

      var statusCode = myRes.statusCode,
        headers = myRes.headers,
        location = headers.location;
      // console.log('location ', location);
      // console.log('href ', opts.href);
      // Fix the location
      if (statusCode > 300 && statusCode < 304 && location.indexOf(opts.href) > -1) {
        // absoulte path
        console.log('302 ', location);
        headers.location = location.replace(opts.href, '/');
      }
      // console.log(myRes.headers);
      var cookies = myRes.headers['set-cookie'] || [];

      // console.log('cookies: ', cookies);
      cookies.forEach(function(cookie) {
        var oCookie = cookieUtil.parse(cookie);
        var key = Object.keys(oCookie)[0];
        var val = oCookie[key];
        cookieStore[key] = val;
      });
      if (myRes.headers['set-cookie']) {
        fs.writeFile(os.tmpdir() + '/mobileProxyCookie', JSON.stringify(cookieStore));
        log('Persist cookies to file.');
      }

      resp.writeHead(myRes.statusCode, myRes.headers);
      myRes.on('error', function(err) {
        next(err);
      });
      myRes.pipe(resp);
    });
    myReq.on('error', function(err) {
      next(err);
    });
    if (!req.readable) {
      myReq.end();
    } else {
      req.pipe(myReq);
    }
  };
};

/**
 * Match path by patterns one by one, check if method match
 * @param req
 * @return matched config or false
 */

function matchReqByConfig(req) {
  if (!urlRules) {
    return;
  }
  var matchedConfig = _.find(urlRules, function(oConfig) {
    var pattern = oConfig.pattern;
    if (urlPattern.newPattern(pattern).match(req.url)) {
      if (!oConfig.method) { //match all methods
        return true;
      } else {
        return oConfig.method.toLowerCase() === req.method.toLowerCase();
      }
    }
  });
  if (matchedConfig) {
    log('url ', req.url, ' matched: ', matchedConfig.pattern, ' method: ', matchedConfig.method);
    return matchedConfig;
  }
  return false;
}