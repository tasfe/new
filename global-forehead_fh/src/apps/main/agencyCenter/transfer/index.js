"use strict";

var TransferView = Base.ItemView.extend({
  template: require('./index.html'),

  lowLevelTpl: _('<div class="Multi low-level-row">' +
    '<input type="checkbox" name="checkbox" value="">' +
    '<div class="U-l js-lowLevel-con-<%=index %> lowLevel-cont">' +
    '<select data-placeholder="请选择转账用户 " class="js-ac-sm-sign-username" value="<%=subUser %>" name="sub[<%=index %>].userName" data-parsley-required data-parsley-errors-container=".js-lowLevel-con-<%=index %>"></select>' +
    '</div>' +
    '<span class="uninput"><input type="text" class="U-cm js-ac-transfer-amount ac-transfer-amount" placeholder="输入金额" data-parsley-type="integer" data-parsley-max-message="您申请的金额超出可转账金额" required  data-parsley-range="[<%=minMoney %>,<%=maxMoney %>]"  value="<%=amount %>" name="sub[<%=index %>].amount"></span><span style="margin-left:20px;">元</span>' +
    '<span class="js-ac-cancel-lowLevel btn-del-lowLevel" data-btn-index="<%=index %>">删除</span>' +
    '</div>').template(),
  startOnLoading: true,

  events: {
    'click .js-ac-add-lowLevel': 'addLowLevelHandler',//添加单个下级
    'click .js-ac-cancel-lowLevel': 'deleteLowLevelHandler',//删除单个下级
    'keyup .js-ac-transfer-amount': 'calculateAmountHandler',//单个金额改变
    'keypress .js-ac-transfer-amount': 'calculateAmountHandler',//单个金额改变
    'click .js-ac-submitTransferInfo': 'submitTransferHandler',
    'click .js-unimoney': 'setUniMoney',//点击统一金额隐显
    'keyup .js-fc-tf-amount': 'setUnitAmountHandler', //统一金额改变触发此函数
    'keypress .js-fc-tf-amount': 'setUnitAmountHandler', //统一金额改变触发此函数

    // 下一步方法
    'click .go-verify': 'goVerify',
    'click .go-sub': 'goSub',
    'click .go-affirm': 'goAffirm',

    //切换转账方式
    'click .js-ac-type-change': 'changeTypeStyleHandler',
    //统一转账金额
    'click .js-ac-unimoney': 'changeUnimoneyStyleHandler',
  },
  goVerify: function () {
    var self = this;
    this.$form.parsley();
    var total = this.$total.text();
    console.log(total);

    if (total > self.maxMoney) {
      return Global.ui.notification.show('每次转账总金额不超过' + self.maxMoney + '元。');
    }
    if (this.$form.parsley().validate()) {
      self.$('.js-ac-transfer-amount').removeClass('parsley-success');
      var $tranferUsers = self.$('select.js-ac-sm-sign-username');
      var userNoList = _($tranferUsers).map(function (user) {
        return $(user).val();
      });

//  	if (_(userNoList).union().length !== $tranferUsers.length) {
//  		Global.ui.notification.show('转账用户名不可重复！');
//  	} else {
      this.$(".U-Verify").show();
      this.$("#Sub-none,.U-affirm").hide();
//  	}
    }
  },

  goSub: function () {
    this.$("#Sub-none").show();
    this.$(".U-Verify,.U-affirm").hide();
  },
  goAffirm: function () {
    var securityId = this.$('.js-ac-transfer-securityId').val();
    var answer = this.$('.answer').val();
    var self = this;
    this.checkQC(securityId, answer).done(function (res) {
      if (res && res.result == 0) {
        self.$(".js-tranMan").text($("select.js-ac-sm-sign-username").length);
        self.$(".U-affirm").show();
        self.$(".U-Verify,#Sub-none").hide();
      } else {
        return Global.ui.notification.show(res.msg);
      }
    });

  },
  setUniMoney: function (e) {
    var elm = this.$(".js-unimoney");
    if (elm.prop("checked")) {
      this.$(".Multi input[type=checkbox]").prop("checked", true)
      this.$(".js-uninput").removeClass("hidden")
    }
    else {
      this.$(".Multi input[type=checkbox]").prop("checked", false)
      this.$(".js-uninput").addClass("hidden")
    }
  },
  className: 'ac-lowLevel-transfer-view',

  initialize: function (options) {

  },

  onRender: function () {
    var self = this;
    this.$form = this.$('.js-fc-transfer-form');
    this.$lowLevelContainer = this.$('.js-ac-lowLevel-container');
    this.$balance = this.$('.js-ac-transfer-balance');
    this.$question = this.$('.js-ac-transfer-sq');
    this.$questionId = this.$('.js-ac-transfer-securityId');
    this.$lowLevelAdd = this.$('.js-ac-transfer-lowLevel-add');
    this.$total = this.$('.js-ac-transfer-total');
    this.$leftMoney = this.$('.js-leftMoney');

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
          self.$leftMoney.text(res.root.leftMoney / 10000);
          self.$questionId.val(res.root.securityId);
          self.minMoney = res.root.minMoney / 10000;
          self.maxMoney = res.root.maxMoney / 10000;
          self.$(".js-fc-tf-amount").attr("data-parsley-range", "[" + self.minMoney + "," + self.maxMoney + "]");
          self.$(".js-maxMoney").text(self.maxMoney);
          self.$(".js-minMoney").text(self.minMoney);
        } else {
          Global.ui.notification.show('获取转账相关信息失败。');
        }
      });

    this.parsley = this.$form.parsley();


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
  blurSeach: function () {
    //配置模糊搜索
    var self = this;
    this.$username = this.$('.js-ac-sm-sign-username');
    this.$username.each(function (i, d) {
      self.$(this).typeahead({
        source: function (query, process) {
          self.verifyXhr({username: query}).done(function (res) {
            if (res.result === 0) {
              self.ValidUser = res.root;
              var users = [];
              _(res.root).each(function (item, index) {
                users.push(item.userName);
              })
              return process(users);
            }
          });
        },
        items: 5,
        minlength: 1,
        matcher: function (item) {
          if (item && item.toLowerCase().indexOf(this.query.trim().toLowerCase()) != -1) {
            return true;
          }
        },
        updater: function (item) {
          setTimeout(500, self.$form.parsley());
          if (self.ValidUser) {
            var user = _(self.ValidUser).find(function (userItem) {
              return userItem.userName == item;
            });
            // self.$('.js-ac-sm-sign-userid').val(user.userId);
          }
          return item;
        }
      });
    })
  },

  getSubLevelXhr: function (subAcctId) {
    return Global.sync.ajax({
      url: '/acct/subacctinfo/getsubacctnamebyid.json',
      data: {
        subAcctId: subAcctId
      }
    });
  },

  checkSubLevelXhr: function (username) {
    return Global.sync.ajax({
      url: '/acct/subaccount/isdirectsub.json',
      data: {
        username: username
      }
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
  addLowLevelHandler: function (user, firstInitialize) {
    var self = this;
    var index = this.$('.Multi').length;
    var user = (typeof (user) == "string" ? user : '');

    var amount = 0;
    var isUnimoney = self.$('.js-unimoney').is(':checked');
    if (isUnimoney) {
      amount = this.$('.js-fc-tf-amount').val();
    }

    var $row = $(this.lowLevelTpl({
      index: index,
      amount: amount,
      subUser: user,
      minMoney: this.minMoney,
      maxMoney: this.maxMoney
    }));
    if (isUnimoney) {
      $row.find('.js-ac-transfer-amount').attr('readonly', true);
    }

    var $select = $row.find('.js-ac-sm-sign-username');


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

    self.$lowLevelContainer.append($row);
    if (index === 7) {
      self.$('.js-ac-add-lowLevel').addClass('hidden');
    }
    self._calculateAmount();


    function onSelectChange() {
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
    if (this.$(".low-level-row").length == 1) {
      Global.ui.notification.show('至少需要一个转账用户！');
      return;
    }
    var $target = $(e.currentTarget);
    var index = $target.data('btn-index');
    $target.closest('.Multi').remove();
    if (this.$(".low-level-row").length < 6) {
      this.$('.js-ac-add-lowLevel').removeClass('hidden');
    }
    this._calculateAmount();

  },

  setUnitAmountHandler: function (e) {
    this.$form.parsley();//验证
    var $moneyList = this.$('.js-ac-transfer-amount');
    var unitAmount = this.$('.js-fc-tf-amount').val();
    _($moneyList).map(function (amount) {
      $(amount).val(unitAmount);
    });
    this._calculateAmount();
  },

  _calculateAmount: function () {
    var $moneyList = this.$('.js-ac-transfer-amount');
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
    var userCount = this.$('select.js-ac-sm-sign-username').length;
    if (totalAmount > _(this.Balance).convert2yuan()) {
      Global.ui.notification.show('转账总金额不能超过当前可转账余额！');
      return false;
    }

    if (totalAmount > self.maxMoney) {
      Global.ui.notification.show('转账总金额不能超过' + self.maxMoney + '元！');
      return false;
    }

    var self = this;

    if (clpValidate) {
      $target.button('loading');
      Global.sync.ajax({
        url: '/fund/transfer/transfer.json',
        data: _(this.$form.serializeArray()).serializeObject(),
        tradition: true
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

  changeTypeStyleHandler: function (e) {
    var $target = $(e.currentTarget);
    $target.addClass('active');
    $target.siblings('span').removeClass('active');
  },
  changeUnimoneyStyleHandler: function (e) {
    var $target = $(e.currentTarget);
    var self = this;
    var unimoney = self.$('.js-fc-tf-amount').val();
    console.log(unimoney);
    if ($target.hasClass('unimoney-on')) {
      $target.removeClass('unimoney-on');
      self.$('.js-ac-transfer-amount').attr('readonly', false);
    } else {
      $target.addClass('unimoney-on');
      self.$('.js-ac-transfer-amount').val(unimoney);
      self.$('.js-ac-transfer-amount').attr('readonly', true);
    }
  }

});

module.exports = TransferView;