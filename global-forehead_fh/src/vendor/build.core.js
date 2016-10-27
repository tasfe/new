"use strict";

require("font-awesome-webpack");
require('./styles/animate.css');
require('./scripts/modernizr');

window.Backbone = require('backbone');
//
// var MD5 = require('vendor/scripts/md5');
// var SHA512 = require('vendor/scripts/sha512');

require('jquery-ui/ui/core');
require('jquery-ui/ui/widget');
require('jquery-ui/ui/mouse');
require('jquery-ui/ui/position');
require('jquery-ui/ui/button');
require('jquery-ui/ui/slider');
require('jquery-ui/ui/draggable');
require('jquery-ui/ui/sortable');
require('./scripts/spinner');

$.widget.bridge('uiButton', $.ui.button);

require('./scripts/bootstrap');
require('./scripts/jquery.mousewheel.min');
require('./scripts/icheck.min');
require('selectize/dist/js/selectize.js');

window.moment = require('moment');
require('moment/locale/zh-cn');
window.moment.locale('zh-cn');

//from bower
var s = require('underscore.string/index');

_.mixin(s.exports());

require('./scripts/jquery.steps');
require('./scripts/bootstrap-datetimepicker');
require('./scripts/jquery.countdown');
require('jquery-slimscroll');

require('parsleyjs');
require('parsleyjs/dist/parsley.remote');
require('parsleyjs/src/i18n/zh_cn');

require('./styles/normalize-3.0.2.css');


var swfUrl = require('./assets/ZeroClipboard.swf');
var ZeroClipboard = require('./scripts/ZeroClipboard');

ZeroClipboard.config({swfPath: swfUrl});


var core = require('mathjs/core');
var math = core.create();

math.import(require('mathjs/lib/function/arithmetic/add'));
math.import(require('mathjs/lib/function/arithmetic/subtract'));
math.import(require('mathjs/lib/function/arithmetic/multiply'));
math.import(require('mathjs/lib/function/arithmetic/divide'));
math.import(require('mathjs/lib/function/arithmetic/floor'));
math.import(require('mathjs/lib/function/arithmetic/mod'));
