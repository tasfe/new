"use strict";

var swfUrl = require('vendor/assets/ZeroClipboard.swf');
var ZeroClipboard = require('vendor/scripts/ZeroClipboard');

ZeroClipboard.config({swfPath: swfUrl});

var OpenAccountManageView = Base.ItemView.extend({

  template: require('./manual.html'),

  startOnLoading: true,

  events: {
    'click .js-ac-submitOpenAccountInfo': 'submitOpenAccountInfoHandler',
    'blur .js-ac-userName': 'checkUserExistHandler',
    // 'click .js-ac-ticket-link': 'ticketPriceViewHandler',
    'blur .js-ac-manual-rebate': 'inputRebateHandler'
  },

  getSubAcctXhr: function() {
    return Global.sync.ajax({
      url: '/acct/subaccount/getsubacct.json',
      abort: false
    });
  },

  checkUserExistXhr: function(data) {
    return Global.sync.ajax({
      url: '/acct/userinfo/userexist.json',
      data: data
    });
  },

  initialize: function() {
    // this.subSubAcctXhr = this.getSubAcctXhr();
    
  },

  onRender: function() {
    var self = this;
	
    this.$rebate = this.$('.js-ac-manual-rebate');
    this.$limit = this.$('.js-ac-quota-container');
    this.acctInfo = Global.memoryCache.get('acctInfo');
		
    this.getSubAcctXhr()
      .always(function() {
        self.loadingFinish();
      })
      .done(function(res) {
        var data = res.root.seriesList;

        if (res && res.result === 0) {

          if(self.acctInfo.userGroupLevel === 2) {
            self.$rebate.attr('data-parsley-range', '[' + _(data.subRebateRange.rebateMin).formatDiv(10, {fixed: 1}) + ', ' + _(127).formatDiv(10, {fixed: 1}) + ']');
          } else {
            self.$rebate.attr('data-parsley-range', '[' + _(data.subRebateRange.rebateMin).formatDiv(10, {fixed: 1}) + ', ' + _(data.subRebateRange.rebateMax).formatDiv(10, {fixed: 1}) + ']');
          }

          self._getTable(_(data.ticketSeriesList).chain().filter(function(ticketSeries) {
            if (_(['时时彩', '十一选五', '低频彩', '快乐彩']).contains(ticketSeries.sericeName)) {
              return true;
            }
          }).map(function(ticketSeries) {
            return {
              sericeName: ticketSeries.sericeName,
              maxBonus: _(ticketSeries.maxBonus).convert2yuan(),
              subAcctRebate: data.subRebateRange.subAcctRebate,
              maxRebate: data.subRebateRange.rebateMax,
              minRebate: data.subRebateRange.rebateMin
            };
          }).value());
          
          self.$rebate.val(Global.localCache.get('ac.openAccountRebate') || '').trigger('blur');
          
          if(self.acctInfo.userGroupLevel==2){
            self._parentView.renderSuperLimit(self.$limit, res.root.quotaList);
          }else {
            self._parentView.renderLimit(self.$limit, res.root.quotaList);
          }
        }
      });
  },

  _getTable: function(tableInfo) {
    var self = this;

    this.$('.js-ac-rebate-set-container').staticGrid({
      tableClass: 'table table-bordered table-center',
      colModel: [
        {
          label: '游戏', name: 'sericeName', width: '30%', formatter: function(val) {
          var ticket = '';
          if (val === '时时彩') {
            ticket = 'constant';
          } else if (val === '十一选五') {
            val = '11选5';
            ticket = 'elev';
          } else if (val === '低频彩') {
            ticket = 'low';
          }else if(val==='快乐彩') {
            ticket = 'happy';
          }
          return val;
          // return '<a class="js-ac-ticket-link btn-link text-hot" data-ticket="' + ticket + '">' + val + '</a>';
        }
        },
        {
          label: '玩法', name: 'maxBonus', width: '30%', formatter: function(val, index, info) {
          return '所有玩法';
        }},
        {
          label: '奖金', name: 'maxBonus', width: '30%', formatter: function(val, index, info) {
          return '<span class="js-ac-openAccount-maxBonus" data-maxBonus="' + val + '" data-name="' + info.sericeName + '">' +
            self.calculateMaxBonus(info.sericeName, _(info.subAcctRebate).formatDiv(10), val) + '</span>';
        }
        }
      ],
      row: tableInfo
    });
  },

  submitOpenAccountInfoHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);
    var $cardBindingForm = this.$('.js-ac-openAccountManual-form');
    var clpValidate = $cardBindingForm.parsley().validate();
		
		console.log(self);
		
    if (clpValidate) {
      $target.button('loading');
      var rebate =  _(this.$('.js-ac-manual-rebate').val()).formatMul(10);
      var data = {
        userName: _(this.$('.js-ac-userName').val()).trim(),
        loginPwd: 'fh12345',
        rebate: rebate,
        type: 2
      };

      Global.sync.ajax({
        url: '/acct/subaccount/savesubacct.json',
        data: data,
        tradition: true
      }).always(function() {
        $target.button('reset');
      })
        .done(function(res) {
          if (res && res.result === 0) {
          	Global.localCache.set('ac.openAccountRebate',self.$('.js-ac-manual-rebate').val());
            self.showCopyDailog(data);
            self.render();
          } else {
            Global.ui.notification.show('保存失败，' + res.msg);
          }
        });

    }
  },
  checkUserExistHandler: function(e) {
    var self = this;
    var data = {
      username: _($(e.currentTarget).val()).trim()
    };
    if ($(e.currentTarget).val() == '') {
      self.$('.js-ac-tip').removeClass('hidden').html("请输入用户名");
      return;
    }
    this.checkUserExistXhr(data).fail(function() {
    }).done(function(res) {
      if (res.result === 0) {
        self.$('.js-ac-tip').addClass('hidden');
      } else {
        self.$('.js-ac-tip').removeClass('hidden').html(res.msg);
      }
    });

  },
  ticketPriceViewHandler: function(e) {
    var $target = $(e.currentTarget);
    var ticket = $target.data('ticket');
    var rebate = Number(this.$('.js-ac-manual-rebate').val());
    if (_(rebate).isNumber() && _(rebate).isFinite()) {
      Global.appRouter.navigate('#ac/oam/pd/' + ticket + '?rebate=' + rebate, {trigger: true, replace: false});
    } else {
      Global.ui.notification.show('请输入有效的返点值。');
    }
  },
  inputRebateHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);
    var range = eval($target.data('parsley-range'));
    var rebate = Number($target.val());
    if (rebate !== '' && _(rebate).isFinite() && range.length == 2) {
      if (rebate < range[0]) {
        $target.val(range[0]);
      } else if (rebate > range[1]) {
        $target.val(range[1]);
      }
      var rebateArr = $target.val().split('.');
      if(rebateArr && rebateArr.length>1){
        $target.val(($target.val()).substring(0,rebateArr[0].length+2));
      }

    } else {
      $target.val(range[0]);
    }
    rebate = Number($target.val());
    var $maxBonus = $target.parent().parent().parent().find('.js-ac-openAccount-maxBonus');
    _($maxBonus).each(function(item, index) {
      var $item = $(item);
      var maxBonus = $item.data('maxbonus');
      var ticketName = $item.data('name');
      $item.html(self.calculateMaxBonus(ticketName, rebate, maxBonus));
    });
  },
  calculateMaxBonus: function(ticketName, rebate, maxBonus) {
    var baseNum = 20;
    if (ticketName === '十一选五') {
      baseNum = 19.8;
    }
    return _(_(Number(maxBonus)).add(_(baseNum).formatMul(rebate, {fixed: 4})).toFixed(4)).add(0);
  },
  showCopyDailog: function(data) {
    var $dialog = Global.ui.dialog.show({
      title: '开户成功',
      size: 'modal-sm',
      body: '<form><div class="width-smd m-center text-center">' +
      '<div class="control-group"><label class="text-left">账号:&nbsp;&nbsp;' + data.userName + '</label></div>' +
      '<div class="control-group"><label class="text-left">密码:&nbsp;&nbsp;' + data.loginPwd + '</label></div>' +
      '<div class="control-group m-bottom-md"><label class="text-left">返点:&nbsp;&nbsp;' + _(data.rebate).formatDiv(10, {fixed: 1}) + '</label></div>' +
      '<button type="button" class="js-ac-ocm-copy btn btn-pink btn-linear" data-dismiss="modal">复制并关闭</button></div></form>'
    });

    $dialog.on('hidden.modal', function() {
      $(this).remove();
      //chaseView.destroy();
    });
    //
    $dialog.find('.js-ac-ocm-copy').textCopy({
      text: '账号：' + data.userName +
      '\n密码：' + data.loginPwd +
      '\n返点：' + _(data.rebate).formatDiv(10, {fixed: 1}) +
      '\n网址：' + _('/login.html').toLink(),
      notShowToolTip: true
    });

  }
});

module.exports = OpenAccountManageView;
