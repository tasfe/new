"use strict";

require('./styles/animate.css');
require('./scripts/modernizr');
require('./styles/normalize-3.0.2.css');

//from bower
var s = require('underscore.string/index');

_.mixin(s.exports());

require('./scripts/jquery.steps');
require('./scripts/bootstrap-datetimepicker');
require('./scripts/jquery.countdown');

require('parsleyjs');
require('parsleyjs/dist/parsley.remote');
require('parsleyjs/src/i18n/zh_cn');
