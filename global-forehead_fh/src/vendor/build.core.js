"use strict";

require('./styles/normalize-3.0.2.css');
require("font-awesome-webpack");
require('./styles/animate.css');
require('./scripts/modernizr');

//from bower
var s = require('underscore.string/index');

_.mixin(s.exports());

require('./scripts/jquery.steps');
require('./scripts/bootstrap-datetimepicker');
require('./scripts/jquery.countdown');

require('parsleyjs');
require('parsleyjs/dist/parsley.remote');
require('parsleyjs/src/i18n/zh_cn');

window.Backbone = require('backbone');
//
// var MD5 = require('vendor/scripts/md5');
// var SHA512 = require('vendor/scripts/sha512');
