"use strict";

var bannerConfig = require('dynamicCenter/misc/bannerConfig');

var LowLevelSelectView = require('newsCenter/views/lowLevelSelect');

var InsideLetterSendView = Base.ItemView.extend({

  template: require('newsCenter/templates/insideLetterSend.html'),

  bannerTpl: _(require('dashboard/templates/banner.html')).template(),

  className: 'nc-letter-send nc-panel-wrapper',

  events: {
    'click input[name=sendTo]': 'selectSendToHandler',
    'click .js-nc-ilSelectSub-btn': 'openSelectHandler',
    'click .js-nc-ilSend-submit': 'ilSendHandler'
  },

  //发送信件
  sendLetterXhr: function(data) {
    return Global.sync.ajax({
      url: '/acct/usernotice/savestationletter.json',
      data: data,
      tradition: true
    });
  },

  getAdXhr: function() {
    return Global.sync.ajax({
      url: '/acct/usernotice/getletteradvertise.json',
      data: {
        pageSize: 1
      }
    });
  },

  onRender: function () {
    var self = this;

    this.selectedList = [];//记录用户选中的接收者
    this.$sendUsers = this.$('.js-nc-ilSendUsers');
    this.$ad = this.$('.js-nc-ad');
    this.$ol = this.$('.js-nc-ol');


    this.$sendToSuperiorSpan = this.$('.js-nc-inside-letter-send-to-superior-span');
    this.$sendToSubSpan = this.$('.js-nc-inside-letter-send-to-sub-span');

    this.$sendToSuperior = this.$('.js-nc-ilSendToSuperior');
    this.$sendToSub = this.$('.js-nc-ilSendToSub');
    this.initRequestParams();//初始化其他页面传来的参数到当前页面
    this.initStatistics();

    this.getAdXhr()
      .done(function(res) {
        var data;
        if (res && res.result === 0) {
          data = res.root ? res.root : bannerConfig;

          self.$ad.html(self.bannerTpl({
            data: data
          }));

          self.$ol.html(_(data).map(function(info, index) {
            return '<li data-target="#jsCarousel" data-slide-to="' + index + '" ' +
              (index ? '' : 'class="active"') + '></li>';
          }).join(''));
        }
      });
  },

  initRequestParams: function(){
    if(this.options.reqData) {
      var userId = this.options.reqData.userId;
      if (!_(userId).isUndefined() && userId !== '') {
        this.selectedList = [{userId: userId, username: this.options.reqData.username}];
        this.$('#jsIlSendTo2').trigger('click');
        this.renderSendUsers(this.selectedList);
      }
    }
  },

  initStatistics: function() {
    this.$('.js-nc-il-statistics').statistics({
      targetEl: this.$('.js-nc-ilContent'),
      onChange: function(count, flag) {

      }
    });
  },

  //选择发送给谁的radio的事件
  selectSendToHandler: function (e) {
    var $target = $(e.currentTarget);

    if ($target.val() === '1') {
      this.$sendToSuperior.removeClass("hidden");
      this.$sendToSub.addClass("hidden");
      this.$sendUsers.html('');
    } else {
      this.$sendToSub.removeClass("hidden");
      this.$sendToSuperior.addClass("hidden");
    }

  },

  //event handlers

  openSelectHandler: function() {
    var self = this;
    var $dialog = Global.ui.dialog.show({
      title: '选择下级',
      body: '<div class="js-il-select-user"></div>',
      bodyClass: 'no-padding'
    });

    var $selectContainer = $dialog.find('.js-il-select-user');

    var lowLevelSelect = new LowLevelSelectView({selectedList:self.selectedList});
    $selectContainer.html(lowLevelSelect.render().el);

    $dialog.on('hidden.modal', function (e) {
      $(this).remove();
    });

    $dialog.off('click.selectUser')
      .on('click.selectUser', '.js-il-select-confirm', function () {
        self.selectedList = lowLevelSelect.getSelected();//获取用户选择的接受者

        self.renderSendUsers(self.selectedList);

        $dialog.modal('hide');
      });
  },

  renderSendUsers: function(selectedList) {
    this.$sendUsers.html(_(selectedList).map(function(select) {
      return '<span class="label label-info m-right-sm">' + select.username + '</span>';
    }).join(''));
  },

  //保存按钮
  ilSendHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);
    var clpValidate = this.$('.js-nc-ilSendForm').parsley().validate();
    var sendTo = this.$('input[name="sendTo"]:checked').val();
    if(((sendTo==='2' && this.selectedList && this.selectedList.length > 0) || sendTo==='1') && clpValidate){
      $target.button("loading");

      var data = {
        sendType: sendTo,
        title: this.$('.js-nc-ilTitle').val(),
        content: this.$('.js-nc-ilContent').val(),
        sub: []
      };

      if(sendTo === '2') {
        data.sub = _(this.selectedList).map(function(selected,index) {
          return selected.userId;
        });
      }

      this.sendLetterXhr(data).always(function(){
        $target.button("reset");
      })
        .done(function(res){
        if(res.result===0){
          Global.ui.notification.show('发送成功', {
            type: 'success'
          });
          window.location.href = '#nc/il';
        }else{
          Global.ui.notification.show('发送失败');
         // self.render();
        }
      });
    }else if(clpValidate){
      Global.ui.notification.show('请先选择收信人！');
    }
  }

});

module.exports = InsideLetterSendView;
