"use strict";

var PersonalManageView = Base.ItemView.extend({

  template: require('./index.html'),

  completeTpl: _.template(require('../templates/completePage.html')),

  startOnLoading: true,

  events: {
    'click .js-uc-gender' : 'updateGenderHandler',
    'submit .js-uc-personalInfo-form': 'updatePersonalInfoHandler',
    'click .js-pm-confirm': 'refreshPageHandler'
  },

  onRender: function() {
    var self = this;
    this._renderbirthday();

    Global.sync.ajax({
      url: '/acct/userinfo/userdetail.json',
      data: {}
    })
      .always(function() {
        self.loadingFinish();
      })
      .done(function (res) {
        var data;
        if (res && res.result === 0) {
          data = res.root;
          self.$('.js-uc-userName').html(data.userName);
          self.$('.js-uc-gender-val-res').val(data.userSex);
          data.userSex ? self.$('.js-uc-gender-female').addClass('selected') : self.$('.js-uc-gender-male').addClass('selected') ;
          data.memberLevel ? self.$('.js-uc-memberLevel').html('<span class="sfa sfa-vip-'+ data.memberLevel +'"></span>') : self.$('.js-uc-memberLevel').html('<span class="sfa sfa-vip-0"></span>') ;
          self.$('.js-uc-integral').html(data.integral);
          data.userQq && self.$('.js-uc-userQq-val-res').removeClass('hidden').html(data.userQq) && self.$('.js-uc-userQq').addClass('hidden').prop('disabled', true);
          data.userCellphone && self.$('.js-uc-userCellphone-val-res').removeClass('hidden').html(data.userCellphone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')) && self.$('.js-uc-userCellphone').addClass('hidden').prop('disabled', true);
          data.userBithday && self.$('.js-uc-userBithday-val-res').html(data.userBithday).removeClass('hidden') && self.$('.js-uc-select-userBithday-month').addClass('hidden') && self.$('.js-uc-select-userBithday-day').addClass('hidden') && self.$('.js-uc-helpBlock').addClass('hidden');
        } else {
          Global.ui.notification.show('获取用户个人信息失败');
        }
      });

    this.$form = this.$('.js-uc-personalInfo-form');
    this.$btnConfirm = this.$('.js-uc-confirm');

    this.parsley = this.$form.parsley(Global.validator.getInlineErrorConfig());
    // window.ParsleyExtend.addAsyncValidator('checkusername', function(xhr) {
    //   return xhr.responseJSON.result === 0;
    // }, '/acct/userinfo/checkuname.json');
  },
  _renderbirthday: function () {
    var month = _(_.range(1,13)).map(function (num) {
      return '<option value="'+ (num<10? ('0'+ num) : num) +'">' + (num<10? ('0'+ num) : num) + '</option>';
    });
    var day = _(_.range(1,32)).map(function (num) {
      return '<option value="'+ (num<10? ('0'+ num) : num) +'">' + (num<10? ('0'+ num) : num) + '</option>';
    });
    this.$('.js-uc-select-userBithday-month').append(month.join(''));
    this.$('.js-uc-select-userBithday-day').append(day.join(''));
  },

  updatePersonalInfoHandler: function(e) {
    var self = this;
    this.$btnConfirm.button('loading');
    if($('.js-uc-userBithday-val-res').text() === ''){
      if((this.$('.js-uc-select-userBithday-month').val() === '' && this.$('.js-uc-select-userBithday-day').val() === '') || (this.$('.js-uc-select-userBithday-month').val() != '' && this.$('.js-uc-select-userBithday-day').val() != '')){
        var canSubmint = true;
      }else{
        var canSubmint = false;
      }
    }else{
      var canSubmint = true;
    }

    var reqData = {
      userSex: this.$('.js-uc-gender-val-res').val(),
      userQqNum: this.$('.js-uc-userQq').val(),
      userCellphone: this.$('.js-uc-userCellphone').val(),
      userBirthday: this.$('.js-uc-userBithday-val-res').text() || ((this.$('.js-uc-select-userBithday-month').val() && this.$('.js-uc-select-userBithday-day').val()) ? this.$('.js-uc-select-userBithday-month').val() + '-' + this.$('.js-uc-select-userBithday-day').val() : null),
    };

    reqData = _(reqData).pick(_.identity);

    if(canSubmint){
      Global.sync.ajax({
        url: '/acct/userinfo/saveuser.json',
        data: reqData
      })
          .always(function() {
            self.$btnConfirm.button('reset');
          })
          .done(function(res) {
            if (res && res.result === 0) {
              self.$el.html(self.completeTpl({
                title: '设置成功',
                content: '个人资料信息设置成功'
              }));
              Global.m.states.fetch();
              // Global.ui.notification.show('修改个人信息成功', {
              //   type: 'success'
              // });
              // self.render();
            } else {
              Global.ui.notification.show('修改个人信息失败');
            }
          });
    }else {
      self.$btnConfirm.button('reset');
      Global.ui.notification.show('请补全生日信息');
    }

  },

  updateGenderHandler: function (e) {
    var $target = $(e.currentTarget);
    this.$selectedGender = this.$('.js-uc-gender.selected');
    this.$selectedGender.removeClass('selected');
    $target.addClass('selected');
    this.$('.js-uc-gender-val-res').val($target.data('sex'));
  },

  refreshPageHandler: function () {
    this.render();
  }
});

module.exports = PersonalManageView;
