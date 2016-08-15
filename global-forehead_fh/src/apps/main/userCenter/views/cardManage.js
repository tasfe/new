"use strict";

var bindBankConfig = require('../misc/bankConfig');
var lockPng = require('../misc/lock.png');
var deletePng = require('../misc/delete.png');

var BindCardView = require('userCenter/views/cardBinding');

var CardManageView = Base.ItemView.extend({

  template: require('userCenter/templates/cardManage.html'),

  //startOnLoading: true,
  itemTpl: _(require('userCenter/templates/cardManage-item.html')).template(),

  validateTpl: _(require('userCenter/templates/cardManage-validate.html')).template(),

  bindingCardTpl: _(require('userCenter/templates/cardBinding.html')).template(),

  className: 'uc-cardManage-view',

  events: {
    'click .js-uc-cmBindCard-btn': 'goToBingBankCardHandler',//绑定按钮
    'click .js-uc-cmLockCard-btn': 'lockBankCardHandler',//锁定按钮
    // 'click .js-uc-cmUpdateSingCard': 'updateSingCardHandler',//修改按钮
    'click .js-uc-cmDeleteSingCard': 'deleteSingCardHandler',//删除按钮
    //'click .js-uc-validatePayPwd': 'validatePayPwdHandler'//验证资金密码,
    'mouseover .js-uc-cm-option': 'toggleOptionClassHandler',
    'mouseout .js-uc-cm-option': 'toggleOptionClassHandler'

  },

  initialize: function() {
  },

  getBankCardListXhr: function() {
    return Global.sync.ajax({
      url: '/fund/bankcard/cardlist.json'
    });
  },

  verifyPayPwdXhr: function(data) {
    return Global.sync.ajax({
      url: '/fund/moneypd/verify.json',
      data:data
    });
  },
  checkPayPwdXhr: function() {
    return Global.sync.ajax({
      url: '/fund/moneypd/checkpaypwd.json'
    });
  },

  lockBankCardXhr: function() {
    return Global.sync.ajax({
      url: '/fund/bankcard/lockcard.json'
    });
  },

  deleteBankCardXhr: function(data) {
    return Global.sync.ajax({
      url: '/fund/bankcard/delcard.json',
      data: data
    });
  },

  verifyCardInfoXhr: function(data) {
    return Global.sync.ajax({
      url: '/fund/bankcard/verifycard.json',
      data:data
    });
  },

  onRender: function() {

    var self = this;
    this.$validateError = this.$('.js-uc-cmValPayPwdNotice');
    // this.hasBeenVerified = Global.memoryCache.get('hasBeenVerified');

    //if(!this.hasBeenVerified) {
    //  //判断是否设置资金密码
    //
    //} else {
    //  Global.memoryCache.clear('hasBeenVerified');
    this.initializeCardManagePage();
    this.loadingFinish();
    //}

  },

  //验证完毕后初始化管理页面
  initializeCardManagePage: function() {
    var self = this;
    //获取已有银行卡信息列表
    self.$('.js-uc-cm-notice-div').removeClass('hidden');
    this.getBankCardListXhr()
        .done(function(res) {
          if (res.result === 0) {
            self.locked = res.root.locked;
            var cardHtml = self.generateCardInfoHtml(res.root.cardList, res.root.locked);
            _(self.$('.js-uc-cmBindCard-btn').siblings()).each(function(item){
              $(item).remove();
            });
            self.$('.js-uc-cmCardManage-container').prepend(cardHtml);
            self.$('.js-uc-cmBtnContainer').removeClass('hidden');
            if(self.locked){
              self.$('.js-uc-cmBindCard-btn').prop('disabled',true);
              self.$('.js-uc-cmLockCard-btn').prop('disabled',true);
              self.$('.js-uc-addCard').remove();
              _(self.$('.js-uc-cmDeleteSingCard')).each(function(delBtn){
                $(delBtn).prop('disabled',true);
              });
            }
          } else {
            Global.ui.notification.show("获取银行卡列表失败，" + res.msg);
          }
        });
  },


  deleteSingCardHandler: function(e) {
    if (this.locked) {
      Global.ui.notification.show('银行卡已锁定，不能删除银行卡');
      return;
    }
    var pwdToken = this.$('.js-uc-pwdToken').val();
    var cardId = $(e.currentTarget).data("type");
    if(pwdToken && !(_(pwdToken).isEmpty())){
      this.propConfirmModel(cardId,pwdToken);
    } else {
      var type = "delBankCard";
      this.popValidateCardInfoModal(type,cardId);
    }
  },

  propConfirmModel: function(cardId, pwdToken) {
    //弹出窗口
    var self = this;
    var html = '<p>是否确认删除该银行卡？</p>';
    $(document).confirm({
      content: html,
      agreeCallback: function () {
        var data = {
          cardId: cardId,
          pwdToken: pwdToken
        };
        self.deleteBankCardXhr(data)
            .done(function(res){
              if (res.result === 0) {
                self.initializeCardManagePage();
                Global.ui.notification.show("删除银行卡成功。", {
                  type: 'success'
                });
              } else {
                Global.ui.notification.show("删除银行卡失败。");
              }
            });
      }
    });
  },

  lockBankCardHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);

    $(document).confirm({
      title: '安全提示',
      content: '请注意：银行卡锁定以后不能再增加和删除银行卡，解锁需要联系在线客服并提交资料审核',
      agreeCallback: function() {
        $target.button('loading');
        self.lockBankCardXhr()
            .always(function() {
              $target.button("reset");
            })
            .done(function(res) {
              if (res.result === 0) {
                self.initializeCardManagePage();
                Global.ui.notification.show("锁定银行卡成功。", {
                  type: 'success'
                });
              } else {
                if(res.msg!=='fail'){
                  Global.ui.notification.show("锁定银行卡失败。"+res.msg);
                }else{
                  Global.ui.notification.show("锁定银行卡失败。");
                }

              }
            });
      }
    });
  },

  //
  generateCardInfoHtml: function(cardList, locked) {
    var size = _(cardList).size();

    this.$('.js-uc-cmCardNum').val(size);

    if (size === 0) {
      return;
    }

    var cardInfoHtmlArr = _(cardList).map(function(card) {
      var bankInfo = bindBankConfig.get(card.bankId);

      if(bankInfo){
        card.pic = bankInfo.pic;
        card.lockPic = bankInfo.lockPic;
      }else{
        card.pic = '';
        card.lockPic = '';
      }

      return this.itemTpl({
        card: card,
        locked: locked,
        lockPng: lockPng,
        deletePng: deletePng
      });
    }, this);


    return cardInfoHtmlArr.join('');
  },

  //"#uc/cm/bind"
  //绑定按钮
  goToBingBankCardHandler: function(e) {

    var $target = $(e.currentTarget);
    var size = this.$('.js-uc-cmCardNum').val();
    if (this.locked) {

      Global.ui.notification.show('银行卡已锁定，不能增加银行卡。');

      return ;
    }
    if(size && Number(size) === 0){
      //直接跳转
      // Global.appRouter.navigate(_('#uc/cm/bind').addHrefArgs('_t', _.now()), {trigger: true, replace: false});
      this.propAddBankCardModal();
    }else{
      //弹出验证窗口
      var type = 'addBankCard';
      var token = this.$('.js-uc-pwdToken').val();
      //如果token存在
      if(token && !(_(token).isEmpty())){
        Global.appRouter.navigate(_('#uc/cm/bind').addHrefArgs({
          _t:_.now(),
          pwdToken:token
        }), {trigger: true, replace: false});
      }else{
        this.popValidateCardInfoModal(type);
      }
    }

  },
  propAddBankCardModal: function(token){
    var self = this;
    var bindCardView = new BindCardView({parentView:this,token:token});
    var $dialog = Global.ui.dialog.show({
      title: '绑定银行卡',
      body: '<div class="js-uc-cm-bindContainer uc-cm-bindContainer"></div>',
      bodyClass: 'no-padding uc-cm-bindDialog',
      size: 'modal-lg'
      //size: 'modal-md2'
    });

    $dialog.find('.js-uc-cm-bindContainer').html(bindCardView.render().el);

    $dialog.on('hidden.modal', function (e) {
      $(this).remove();
    });

    $dialog.off('click.bindCard')
        .on('click.bindCard', '.js-uc-cbCardBinding-check', function (e) {

          // bindCardView.checkCardBindingInfoHandler(e,$dialog);
          bindCardView.submitBankCard(e,$dialog);

        });

  },

  popValidateCardInfoModal: function(type, cardId) {
    var self = this;
    var title = '删除银行卡';
    if(type==='addBankCard'){
      title = '输入上一张银行卡信息';
    }
    var $dialog = Global.ui.dialog.show({
      title: title,
      body: this.validateTpl({type:type}),
      footer: ''
    });
    $dialog.on('hidden.modal', function () {
      $(this).remove();
    });

    $dialog.off('click.validateCardInfo')
        .on('click.validateCardInfo', '.js-uc-cmValidateCardInfo', function (ev) {
          var $valTarget = $(ev.currentTarget);
          var valType = $valTarget.data('type');

          //验证密码;
          var accountName = $dialog.find('.js-uc-cmAccountName').val();
          var cardNo = $dialog.find('.js-uc-cmCardNo').val();
          if(!accountName || accountName ===''){
            $dialog.find('.js-uc-cmValCardInfoNotice').html(self._getErrorEl('姓名不能为空'));
            return ;
          }
          if(!cardNo || cardNo ===''){
            $dialog.find('.js-uc-cmValCardInfoNotice').html(self._getErrorEl('卡号不能为空'));
            return ;
          }
          var data = {name:accountName,cardNo:cardNo};
          self.verifyCardInfoXhr(data)
              .done(function(res){
                if(res.result===0){
                  $dialog.modal('hide');
                  var token = res.root;
                  self.$('.js-uc-pwdToken').val(token);
                  //如果类型是绑定银行卡
                  if(valType==='addBankCard'){
                    self.propAddBankCardModal(token);
                  }else if ( valType==='delBankCard'){
                    self.propConfirmModel(cardId,token);
                  }

                }else{
                  if(_(res.root).isNull()){
                    $dialog.find('.js-uc-cmValCardInfoNotice').html(self._getErrorEl('验证失败,'+res.msg));
                  }else{
                    if(res.root!=null&&_(res.root).isNumber()) {
                      if(res.root>0){
                        $dialog.find('.js-uc-cmValCardInfoNotice').html(self._getErrorEl('验证失败,剩余' + res.root + '次机会。'));
                      }else{
                        $dialog.find('.js-uc-cmValCardInfoNotice').html(self._getErrorEl('验证失败,请一个小时后再验证！'));
                      }
                    }else{
                      $dialog.find('.js-uc-cmValCardInfoNotice').html(self._getErrorEl('验证失败,' + res.msg));
                    }
                  }
                }
              });
        });
  },

  renderError: function(text) {
    this.$validateError.closest('.control-group').removeClass('hidden');
    this.$validateError.html(text);
  },

  /**
   *
   */
  validatePayPwd: function () {
    //验证密码
    var self = this;
    var payPwd = this.$('.js-uc-cmPayPwd').val();
    if(!payPwd || payPwd === '') {
      this.$validateError.html('资金密码不能为空');
      return ;
    }

    var data = {
      payPwd: payPwd,
      type:'1'
    };

    self.verifyPayPwdXhr(data)
        .done(function(res) {
          if (res.result === 0) {
            //$dialog.modal('hide');
            //self.$('.js-uc-pwdToken').val(res.root);
            self.$('.js-uc-cm-fundPwdInput').addClass('hidden');
            self.initializeCardManagePage();
          } else {
            if(_(res.root).isNull()) {
              self.renderError('验证失败，' + res.msg);
            }else{
              if (res.root > 0) {
                self.renderError('验证失败，剩余' + res.root + '次机会');
              } else {
                self.renderError('验证失败，请一个小时后在验证！');
              }
            }
          }
        });
  },
  toggleOptionClassHandler: function(e){
    var $target = $(e.currentTarget);
    var $div = $target.find('.js-uc-binding-card-triangle');
    var $div2 = $target.find('.js-uc-binding-card-sign');
    if($div2.hasClass('binding-card-sign-checkMark')||$div2.hasClass('binding-card-sign-cross')){
      $div.toggleClass('binding-card-triangle-yellow');
      $div.toggleClass('binding-card-triangle-red');
      $div2.toggleClass('binding-card-sign-checkMark');
      $div2.toggleClass('binding-card-sign-cross');
      $target.toggleClass('js-uc-cmDeleteSingCard');
    }
  },
  _getErrorEl: function (text) {
    return '<div class="alert alert-danger alert-dismissible" role="alert">' +
        '<button type="button" class="close" data-dismiss="alert">' +
        '<span aria-hidden="true">×</span>' +
        '</button>' +
        '<i class="fa fa-times-circle m-right-xs"></i>' +
        '<strong>提示！</strong> ' + text +
        '</div>';
  },

});

module.exports = CardManageView;
