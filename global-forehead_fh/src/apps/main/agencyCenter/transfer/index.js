"use strict";

var TransferView = Base.ItemView.extend({
  template: require('./index.html'),

  lowLevelTpl: _(require('./transfer-item.html')).template(),

  startOnLoading: true,
  className: 'ac-lowLevel-transfer-view',

  events: {
    //切换转账方式
    'click .js-ac-type-change': 'changeTypeStyleHandler',

    'click .js-ac-add-lowLevel': 'addLowLevelHandler',//添加单个下级
    'click .js-ac-lm-tf-del': 'deleteLowLevelHandler',//删除单个下级
    //统一转账金额
    'click .js-ac-lm-tf-check': 'changeUnimoneyStyleHandler',
    'keyup .js-ac-lm-tf-union-amount': 'setUnitAmountHandler', //统一金额改变触发此函数
    // 'keypress .js-ac-lm-tf-union-amount': 'setUnitAmountHandler', //统一金额改变触发此函数

    'keyup .js-ac-lm-tf-amount': 'calculateAmountHandler',//单个金额改变
    // 'keypress .js-ac-lm-tf-amount': 'calculateAmountHandler',//单个金额改变



    // 下一步方法
    'click .go-verify': 'goVerify',
    'click .go-sub': 'goSub',
    'click .go-affirm': 'goAffirm',

    'click .js-ac-submitTransferInfo': 'submitTransferHandler',


  },

  getInfoXhr: function () {
    return Global.sync.ajax({
      url: '/acct/subacctinfo/gettradeinfo.json',
      abort: false
    });
  },
  getUserXhr: function () {
    return Global.sync.ajax({
      url: '/acct/subacctinfo/getuserrelation.json',
      abort: false
    });
  },
  verifyXhr: function (data) {
    return Global.sync.ajax({
      url: '/fund/divid/valid.json',
      data: data
    });
  },
  checkQC: function (securityId, answer) {
    return Global.sync.ajax({
      url: '/fund/transfer/valsec.json',
      data: {
        securityId: securityId,
        answer: answer
      }
    });
  },

  getSubLevelXhr: function (subAcctId) {
    return Global.sync.ajax({
      url: '/acct/subacctinfo/getsubacctnamebyid.json',
      data: {
        subAcctId: subAcctId
      }
    });
  },

  initialize: function (options) {

  },

  onRender: function () {
    var self = this;
    this.$form = this.$('.js-fc-tf-form');
    this.$TransferRow = this.$('.js-ac-lm-tf-row');
    this.$balance = this.$('.js-ac-tf-balance');
    this.$question = this.$('.js-ac-tf-sq');
    this.$questionId = this.$('.js-ac-tf-securityId');
    this.$total = this.$('.js-ac-lm-tf-total');
    this.$leftMoney = this.$('.js-leftMoney');
    this.$addRowBtm = this.$('.js-ac-add-lowLevel');
    this.$UnionSet = this.$('.js-ac-lm-tf-check');
    this.$UnionAmount = this.$('.js-ac-lm-tf-union-amount');
    this.$UnionAmountContainer = this.$('.js-ac-lm-tf-union-amount-container');

    var getInfoXhr = this.getInfoXhr()
      .always(function () {
        self.loadingFinish();
      })
      .done(function (res) {
        console.log(res);
        if (res && res.result === 0 && res.root) {
          self.$form.removeClass('hidden');
          // if (res.root.pStatus === 1 && res.root.sStatus === 1) {
          //   self.$form.html('<div class="text-center m-top-lg">非常抱歉，平台转账功能目前已经关闭，如有疑问请联系在线客服。</div>');
          //   return false;
          // }
          self.Balance = res.root.balance;
          self.$balance.html(_(res.root.balance).convert2yuan());
          self.$question.html(res.root.question);
          self.$leftMoney.text(res.root.leftMoney==-1 ? 0: res.root.leftMoney / 10000);
          self.$questionId.val(res.root.securityId);
          self.SecurityId = res.root.securityId;
          self.minMoney = res.root.minMoney / 10000;
          self.maxMoney = res.root.maxMoney / 10000;
          self.$(".js-ac-lm-tf-amount").attr("data-parsley-range", "[" + self.minMoney + "," + self.maxMoney + "]");
          self.$(".js-maxMoney").text(self.maxMoney);
          self.$(".js-minMoney").text(self.minMoney);
        } else {
          Global.ui.notification.show('获取转账相关信息失败。');
        }
      });

    // this.parsley = this.$form.parsley();

    var getSubLevelXhr = this.getSubLevelXhr(Global.memoryCache.get('acctInfo').userId).done(function (res) {
      if (res && res.result === 0) {
        self.userList = res.root || [];
        _(self.userList).each(function (userInfo) {
          userInfo.selected = false;
        });
      }
    });

    $.when(getInfoXhr, getSubLevelXhr)
      .done(function () {
        //默认添加一行下级
        self.addLowLevelHandler(self.options.username, true);
      });

  },

  addLowLevelHandler: function (user, firstInitialize) {
    var length = this.$('.js-ac-lm-tf-row').length;
    var user = (typeof (user) == "string" ? user : '');

    var amount = 0;
    var isUnimoney = this.$UnionSet.prop('checked');
    if (isUnimoney) {
      amount = this.$UnionAmount.val();
    }

    var $row = $(this.lowLevelTpl({
      index: length ,
      amount: amount,
      subUser: user,
      minMoney: this.minMoney,
      maxMoney: this.maxMoney
    }));
    if (isUnimoney) {
      $row.find('.js-ac-lm-tf-amount').attr('readonly', true);
    }

    var $select = $row.find('.js-ac-lm-tf-username');

    //初始化选择转账用户
    $select.selectize({
      labelField: 'subAcctName',
      valueField: 'subAcctName',
      searchField: ['subAcctName'],
      options: this.userList,
      onChange: function () {
        onSelectChange.apply(this);
      }
    });

    var selectize = $select[0].selectize

    if (firstInitialize) {
      selectize.setValue(this.options.username);
    }

    this.$addRowBtm.before($row);
    if (length === 6) {
      this.$addRowBtm.addClass('hidden');
    }
    this._calculateAmount();


    function onSelectChange() {
      //todo 可以进行去重处理
//			var subAcctId = this.getValue();
//			if (subAcctId !== '') {
//				subAcctId = Number(subAcctId);
//	    		var preSubAcctId = $select.data('preSubAcctId');
//	    		$select.data('preSubAcctId', subAcctId);
//	    		//标记选中
//	    		var item = _(self.userList).findWhere({
//	    			subAcctId : subAcctId
//	    		});
//	    		item.selected = true;
//	    		//去除上一次选中
//	    		if (preSubAcctId) {
//	    			var item = _(self.userList).findWhere({
//		    			subAcctId : preSubAcctId
//		    		});
//		    		item.selected = false;
//	    		}
//			}
    }

  },

  deleteLowLevelHandler: function (e) {
    var $row = this.$(".js-ac-lm-tf-row");
    if ($row.length == 1) {
      Global.ui.notification.show('至少需要一个转账用户！');
      return;
    }
    var $target = $(e.currentTarget);
    $target.closest('.js-ac-lm-tf-row').remove();
    if ($row.length <= 7) {
      this.$addRowBtm.removeClass('hidden');
    }
    this._calculateAmount();

  },

  setUnitAmountHandler: function (e) {
    this.$form.parsley();//验证
    var $moneyList = this.$('.js-ac-lm-tf-amount');
    var unitAmount = this.$UnionAmount.val();
    _($moneyList).map(function (amount) {
      $(amount).val(unitAmount);
    });
    this._calculateAmount();
  },

  _calculateAmount: function () {
    var $moneyList = this.$('.js-ac-lm-tf-amount');
    var total = 0;
    _($moneyList).each(function (amount) {
      total += Number($(amount).val());
    });
    this.$total.html(total);
  },
  calculateAmountHandler: function (e) {
    this.$form.parsley();//验证
    this._calculateAmount();
  },

  submitTransferHandler: function (e) {
    var self = this;
    var $target = $(e.currentTarget);
    var clpValidate = this.$form.parsley().validate();
    var totalAmount = Number(this.$total.text());
    var userCount = this.$('.js-ac-lm-tf-row').length;
    if (totalAmount > _(this.Balance).convert2yuan()) {
      Global.ui.notification.show('转账总金额不能超过当前可转账余额！');
      return false;
    }
    if (totalAmount > this.maxMoney) {
      Global.ui.notification.show('转账总金额不能超过' + self.maxMoney + '元！');
      return false;
    }
    var data = this.getFormData();

    if (clpValidate) {
      $target.button('loading');
      Global.sync.ajax({
        url: '/fund/transfer/transfer.json',
        data: data,
        tradition: true
      }).always(function(){
        $target.button('reset');
      }).done(function (res) {
        if (res.result == 0) {
          $(".modal,.modal-backdrop").remove();
          Global.ui.notification.show('转账成功' + userCount + '笔，共' + totalAmount + '元', {
            type: 'success'
          });
          self.$(".U-cancel").hide();
        } else {
          Global.ui.notification.show('转账失败,' + (res.msg || res.root || ''));
          self.$(".U-cancel").hide();
        }
      });
    }

  },
  getFormData: function(){
    var $userList = this.$('.js-ac-lm-tf-username');
    var $amountList = this.$('.js-ac-lm-tf-amount');
    var sub =  _($userList).map(function(item,index){
      return {
        userName: $(item).val(),
        amount: $amountList.eq(index).val()
      }
    });

    return {
      sub: sub,
      type: this.$('.js-ac-type-change.active').data('type'),
      answer: this.$('.js-ac-lm-tf-answer').val(),
      securityId: this.SecurityId,
    }
  },

  changeTypeStyleHandler: function (e) {
    var $target = $(e.currentTarget);
    $target.addClass('active');
    $target.siblings('li').removeClass('active');
  },
  changeUnimoneyStyleHandler: function (e) {
    var $target = $(e.currentTarget);
    var amount = this.$UnionAmount.val();


    if ($target.prop("checked")) {
      this.$UnionAmountContainer.removeClass("hidden");
      this.$('.js-ac-lm-tf-amount').attr('readonly', true);
    }
    else {
      this.$UnionAmountContainer.addClass("hidden").val('');
      this.$('.js-ac-lm-tf-amount').attr('readonly', false);
    }
  },

  goVerify: function () {
    var self = this;
    this.$form.parsley();
    var total = this.$total.text();
    // console.log(total);

    if (total > self.maxMoney) {
      return Global.ui.notification.show('每次转账总金额不超过' + self.maxMoney + '元。');
    }
    if (this.$form.parsley().validate()) {
      self.$('.js-ac-lm-tf-amount').removeClass('parsley-success');
      // var $tranferUsers = self.$('select.js-ac-lm-tf-username');
      // var userNoList = _($tranferUsers).map(function (user) {
      //   return $(user).val();
      // });

//  	if (_(userNoList).union().length !== $tranferUsers.length) {
//  		Global.ui.notification.show('转账用户名不可重复！');
//  	} else {
      this.$(".js-ac-lm-tf-step-2").show();
      this.$(".js-ac-lm-tf-step-1,.js-ac-lm-tf-step-3").hide();
//  	}
    }
  },

  goSub: function () {
    this.$(".js-ac-lm-tf-step-1").show();
    this.$(".js-ac-lm-tf-step-2,.js-ac-lm-tf-step-3").hide();
  },
  goAffirm: function () {
    var securityId = this.$('.js-ac-tf-securityId').val();
    var answer = this.$('.js-ac-lm-tf-answer').val();
    var self = this;
    this.checkQC(securityId, answer).done(function (res) {
      if (res && res.result == 0) {
        self.$(".js-tranMan").text($("select.js-ac-lm-tf-username").length);
        self.$(".js-ac-lm-tf-step-3").show();
        self.$(".js-ac-lm-tf-step-1,.js-ac-lm-tf-step-2").hide();
      } else {
        return Global.ui.notification.show(res.msg);
      }
    });

  },

});

module.exports = TransferView;