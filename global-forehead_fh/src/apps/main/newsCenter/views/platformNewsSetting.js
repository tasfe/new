"use strict";

var newsConfig = require('newsCenter/misc/newsConfig');

var PlatformNewsSettingView = Base.ItemView.extend({

  template: require('newsCenter/templates/platformNewsSetting.html'),

  startOnLoading: true,

  settingItemTpl: _(require('newsCenter/templates/platformNewsSetting-item.html')).template(),

  events: {
    'click .js-nc-smSetting-submit': 'saveSettingHandler',
    'click .js-nc-back': 'gobackHandler'
  },

  onRender: function() {
    var self = this;

    this.getPlatformNewsSettingItemXhr()
      .always(function() {
        self.loadingFinish();
      })
      .done(function(res) {
        if (res.result === 0) {
          var html = self.generateHtml(res.root.allConf);
          self.$('.js-nc-smSetting-container').html(html);
          self.selectItem(res.root.userConf);
        } else {
          Global.ui.notification.show('获取下级用户列表失败');
        }
      });
  },

  getPlatformNewsSettingItemXhr: function() {
    return Global.sync.ajax({
      url: '/acct/usernotice/getnoticeconf.json'
    });
  },

  generateHtml: function(confArr) {
    var length = confArr.length;
    var divHtmlArr = _.map(confArr, function(conf, num) {
      return this.settingItemTpl({
        typeName: conf.typeName,
        confList: conf.confList,
        name: newsConfig.get(conf.typeId).name
      });
    }, this);
    return divHtmlArr.join('');
  },

  selectItem: function(userConfArr) {
    _(userConfArr).each(function(userConf) {
      this.$('input[value=' + userConf + ']:checkbox').prop('checked', true);
    }, this);
  },

  saveSettingHandler: function() {
    return Global.sync.ajax({
      url: '/acct/usernotice/savenoticeconf.json',
      data: _(this.$('.js-nc-setting-form').serializeArray()).serializeObject(),
      tradition: true
    })
     .done(function(res) {
       if (res.result === 0) {
         Global.ui.notification.show('通知设置保存成功', {
           type: 'success'
         });
       } else {
         Global.ui.notification.show('通知设置保存失败');
       }
     }
    );
  },

  gobackHandler: function () {
    $('a[href="#jsNcPlatform"]').click();
    $('a[href="#jsNcPlatform"]').closest('li').addClass('active').removeClass('hidden');
    $('a[href="#jsNcPlatformSetting"]').closest('li').removeClass('active').addClass('hidden');
  }

});

module.exports = PlatformNewsSettingView;
