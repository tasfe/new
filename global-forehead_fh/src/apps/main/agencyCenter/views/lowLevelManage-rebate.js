"use strict";

var LowLevelRebateView = Base.ItemView.extend({

  template: require('agencyCenter/templates/lowLevelManage-rebate.html'),

  startOnLoading: true,

  events: {
    'click .js-ac-submitRebateInfo': 'submitRebateHandler',
    'blur .js-ac-subRebate': 'inputRebateHandler'
  },

  className: 'ac-lowLevel-rebate-view',

  onRender: function(){
    var self = this;
    //TODO 获取当前登陆用户的返点信息及配额信息（用于初始化最大返点值），
    //TODO 获取被编辑用户的级别、返点值（用于判断其返点编辑规则，判断是否可编辑，或者可查看,初始化最小返点值）

    var userName = _.getUrlParam('name');
    this.$limit = this.$('.js-ac-lowLevel-quota-container');

    this.$_parentEl.find('.js-ac-rebateUserName').html(userName);
    this.getSubAcctXhr()
      .always(function() {
        self.loadingFinish();
      })
      .done(function(res) {
        var data = res.root.seriesList;
        if (res && res.result === 0) {
          //从data中取出该值
          self.renderLimit(self.$limit,res.root.quotaList);
          self._getTable( _(data.ticketSeriesList).map(function(ticketSeries) {
            return {
              sericeName: ticketSeries.sericeName,
              maxBonus: _(ticketSeries.maxBonus).convert2yuan(),
              subAcctRebate: data.subRebateRange.subAcctRebate,
              maxRebate: data.subRebateRange.rebateMax,
              minRebate: data.subRebateRange.rebateMin
            };
          }));
        }
      });

  },
  getSubAcctXhr: function() {
    return Global.sync.ajax({
      url: '/acct/subaccount/getsubacctrebate.json',
      data:{
        subAcctId:this.options.userId
      }
    });
  },

  _getTable: function(tableInfo) {
    var self = this;
    this.$('.js-ac-rebate-edit-container').staticGrid({
      tableClass: 'table table-bordered table-center',
      colModel: [
        {label: '彩种系列', name: 'sericeName', width: 185},
        {label: '最高奖金', name: 'maxBonus', width: 315,formatter: function(val,index,info){
          return '<span class="js-ac-openAccount-maxBonus" data-maxBonus="'+val+'" data-name="'+info.sericeName+'">'
            +self.calculateMaxBonus(info.sericeName,_(info.subAcctRebate).formatDiv(10),val)+'</span>';
        }},
        {label: '下级返点', name: 'subAcctRebate', merge: true, formatter: function(val, index, info) {
          //val对应该行数据中与name同名的对应变量的值，此处具体为info.subAcctRebate的值，info表示此行的值
          return '<input type="text" class="js-ac-subRebate" value="' + _(val).formatDiv(10) + '" data-parsley-oneDecimal data-parsley-range="['+_(val).formatDiv(10) +','+_(info.maxRebate).formatDiv(10,{fixed:1})+']"> %<div class="text-center">可配置范围(' +
            _(val).formatDiv(10) +  '～' + _(info.maxRebate>128?128:info.maxRebate).formatDiv(10,{fixed:1}) + ')</div>';
        },width:229}
      ],
      row: tableInfo
    });
  },
  checkValueRangeHandler: function(e){
    var $target = $(e.currentTarget);
    var range = eval($target.data('parsley-range'));
    var rebate = Number($target.val());
    if(rebate!==''&& _(rebate).isFinite() && range.length==2){
      if(rebate<range[0]){
        $target.val(range[0]);
      }else if(rebate>range[1]){
        $target.val(range[1]);
      }
    }
  },
  submitRebateHandler: function(e){
    var $target = $(e.currentTarget);
    var self = this;
    $target.button('loading');
    Global.sync.ajax({
      url: '/acct/subaccount/modifySubAcctRebate.json',
      data: {
        subAcctId: this.options.userId,
        subAcctRebate:_(this.$('.js-ac-subRebate').val()).formatMul(10)
      }
    }).always(function(){
      $target.button('reset');
    }).fail(function(){
    //  Global.ui.notification.show(res.root);
    })
      .done(function(res) {
        if (res && res.result === 0) {
          Global.ui.notification.show('保存成功', {
            type: 'success'
          });
          self.render();
        } else {
          Global.ui.notification.show(res.msg);
        }
      });


  },
  inputRebateHandler: function(e){
    var self = this;
    var $target = $(e.currentTarget);
    var range = eval($target.data('parsley-range'));
    var rebate = Number($target.val());
    if(rebate!==''&& _(rebate).isFinite() && range.length==2){
      if(rebate<range[0]){
        $target.val(range[0]);
      }else if(rebate>range[1]){
        $target.val(range[1]);
      }
    }else{
      $target.val(range[0]);
    }
    rebate = Number($target.val());
    var $maxBonus = $target.parent().parent().parent().find('.js-ac-openAccount-maxBonus');
    _($maxBonus).each(function(item,index){
      var $item = $(item);
      var maxBonus = $item.data('maxbonus');
      var ticketName = $item.data('name');
      $item.html(self.calculateMaxBonus(ticketName,rebate,maxBonus));
    });
  },
  calculateMaxBonus: function(ticketName,rebate,maxBonus){
    var baseNum = 20;
    if(ticketName === '十一选五'){
      baseNum = 19.8;
    }
    return _(_(Number(maxBonus)).add(_(baseNum).formatMul(rebate,{fixed:4})).toFixed(4)).add(0);
  },

  renderLimit: function($limit,limitList) {
    var html = [];
    var flag = false;
    if (!_(limitList).isEmpty()) {
      _(limitList).each(function(limit) {
        if(limit.quotaLimit>0){
          flag = true;
        }
        html.push( _(limit.quotaLevel).formatDiv(10,{fixed:1})+'配额&nbsp;'+limit.quotaLimit + '&nbsp;个');
      });
      if(flag){
        $limit.find('.js-ac-open-limit').html(html.join('，') + '，此后奖金组配额无限制');
        $limit.removeClass('hidden');
      }
    }
  }

});

module.exports = LowLevelRebateView;
