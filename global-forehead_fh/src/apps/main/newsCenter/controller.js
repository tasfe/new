"use script";

require('./misc/index.scss');

var RouterController = require('skeleton/controllers/router');

var PlatformNewsPlatformView = require('newsCenter/views/platformNews-platform');
var PlatformNewsSettingView = require('newsCenter/views/platformNewsSetting');

var NewsCenterController = RouterController.extend({

  platformNews: function() {
    this.changeMainReginView(new PlatformNewsPlatformView(), {
      main: {
        title: '系统通知',
        titleType: 'nav'
      }
      // sidebar: 'nc'
    });
  },

  platformNewsSetting: function(){
   this.changeMainReginView(new PlatformNewsSettingView(), {
     main: {
       title: '通知设置',
       titleType: 'nav',
       subReturn: true
     },
     parentRouter: 'nc/pn'
   });
  }
});

module.exports = NewsCenterController;
