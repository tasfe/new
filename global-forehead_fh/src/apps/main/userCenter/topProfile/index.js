"use strict";

require('./index.scss');

var TopProfileView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'click .js-editUName': 'editUName',//修改昵称
    'click .js-editIcons': 'editIcons',//修改头像
  },

  initialize: function() {
  },

  onRender: function() {
    this.checkState();
  },

  editIcons: function () {
    var self = this;
    $(document).editIcons();
  },

  editUName: function () {
    var self = this;
    $(document).editUName();
  },

  checkState: function(){

    function add0(m){return m<10?'0'+m:m }
    var acctInfo = Global.memoryCache.get('acctInfo');

    this.$('.uc-info dt b').html(acctInfo.uName);
    this.$('.uc-info dd').eq(0).html('上次登录时间：' + _(acctInfo.lastLoginTime).toTime());
    this.$('.uc-info dd').eq(1).html('上次登录地点：' + acctInfo.loginIp + ' ' + acctInfo.loginAdd);
    this.$('.uc-info dd').eq(2).html('注  册  时  间：' + _(acctInfo.registerTime).toTime());
    this.$('.uc-info div span').html('您当前VIP等级：VIP' + acctInfo.memberLevel + '级');
    this.$('.uc-info div b').html('VIP' + acctInfo.memberLevel);

    this.$('.js-editIcons span').addClass('iconsImage' + acctInfo.headId);
  }
});

module.exports = TopProfileView;
