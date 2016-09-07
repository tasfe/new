define(function (require, exports, module) {

  var operateCheckView = Base.ItemView.extend({

    template: require('text!fundCenter/templates/bonus-GeneralAgentSet.html'),
    amountAndRate_tpl: require('text!fundCenter/templates/bonus-GeneralAgentSet-AmountAndRateTpl.html'),

    events: {
      'click .js-fc-gs-addBonusSet-btn': 'addBonusSetHandler',
      'click .js-fc-gs-del': 'delBonusSetHandler',
      'click .js-fc-gs-submit': 'saveBonusSetHandler',
      'click .js-fc-gs-cancel': 'cancelHandler'
    },

    initialize: function () {
    },
    findBonusSetXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/dividmng/conf.json',
        data: data
      });
    },
    saveBonusSetXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/dividmng/confsave.json',
        data: data,
        tradition: true
      });
    },
    onRender: function () {
      var self = this;
      this.$container = this.$('.js-fc-gs-container');
      this.$bonusRateMin = this.$('.js-fc-gs-rateRange-min');
      this.$bonusRateMax = this.$('.js-fc-gs-rateRange-max');
      this.$signNum = this.$('.js-fc-gs-signNum');
      this.$signRebate = this.$('.js-fc-gs-signRebate');

      this.findBonusSetXhr()
        .fail(function(){
        }).done(function(res){
        if(res.result===0){
          self.generateBonusSetTr(res.root.dividBetCfgList);
          self.fillBaseInfo(res.root);
        }else{
          this.insertNotice('处理信息获取失败'+res.msg);
        }
      });
    },
    fillBaseInfo: function(root){
      this.$bonusRateMin.val(_(root.subDividMin).formatDiv(100));
      this.$bonusRateMax.val(_(root.subDividMax).formatDiv(100));
      $(this.$signNum[0]).val(root.quotaLimit0);
      $(this.$signNum[1]).val(root.quotaLimit1);
      $(this.$signNum[2]).val(root.quotaLimit2);
      this.$signRebate.val(_(root.rebateLimit).formatDiv(10));
    },

    generateBonusSetTr: function(bonusSetLists){
      var self = this;
      _(bonusSetLists).each(function(item){
        self.$container.append(_(self.amountAndRate_tpl).template()({
          amount: _(item.betTotal).fixedConvert2yuan(),
          rate: _(item.divid).formatDiv(100)
        }));
      });

    },
    addBonusSetHandler: function () {
      this.$container.append(_(this.amountAndRate_tpl).template()({
        amount: '',
        rate: ''
      }));
    },
    delBonusSetHandler: function (e) {
      $(e.currentTarget).closest('.js-fc-gs-bonusSet').remove();
    },
    saveBonusSetHandler: function (e) {
      var $target = $(e.currentTarget);
      $target.button('loading');
      var $form = this.$('.js-fc-gs-form');
      var clpValidate = $form.parsley().validate();
      if (clpValidate) {
        var dividConf = this.getSetInfoArrFromContainer();
        if(!this.checkDividConf(dividConf)){
          $target.button('reset');
          this.insertNotice('新增的分红比例和月销量要比之前的数值大。');
          return ;
        }else{
          this.$('.js-fc-gs-notice').html('');
        }
        var data = {
          dividConf: dividConf,
          dividMin: this.$bonusRateMin.val(),
          dividMax: this.$bonusRateMax.val(),
          quotaLimit0: $(this.$signNum[0]).val(),
          quotaLimit1: $(this.$signNum[1]).val(),
          quotaLimit2: $(this.$signNum[2]).val(),
          rebateLimit: this.$signRebate.val()
        };
        this.saveBonusSetXhr(data).always(function(){
          $target.button('reset');
        }).fail(function(){

        }).done(function(res){
          if (res.result === 0) {
            Global.ui.notification.show('操作成功。');
          } else {
            Global.ui.notification.show('操作失败。');
          }
        });
      }else{
        $target.button('reset');
      }
    },
    getAmountInfoArrFromContainer: function () {
      var betAmountList = this.$container.find('.js-fc-gs-betAmount');
      return _(betAmountList).map(function (item) {
        return  $(item).val();
      });
    },
    getRateInfoArrFromContainer: function () {
      var rebateList = this.$container.find('.js-fc-gs-dividendRate');
      return _(rebateList).map(function (item) {
        return  $(item).val();
      });
    },
    getSetInfoArrFromContainer: function () {
      var rebateList = this.$container.find('.js-fc-gs-dividendRate');
      var betAmountList = this.$container.find('.js-fc-gs-betAmount');
      return _(rebateList).map(function (item,index) {
        return  {
          betTotal: $(betAmountList[index]).val(),
          divid:  $(item).val()
        };
      });
    },
    checkDividConf: function(confList){
      var flag = true;
      _(confList).each(function(conf,index,confList){
        if(index>0){
          if(Number(conf.betTotal)<Number(confList[index-1].betTotal)||Number(conf.divid)<Number(confList[index-1].divid)){
            flag = false;
          }
        }
      });
      return flag;
    },

    insertNotice: function (html) {
      this.$('.js-fc-gs-notice').html(this._getErrorMsg(html));
    },
    //组装错误提示框
    _getErrorMsg: function (text) {
      return '<div class="alert alert-danger alert-dismissible" role="alert">' +
        '<button type="button" class="close" data-dismiss="alert">' +
        '<span aria-hidden="true">×</span>' +
        '</button>' +
        '<i class="fa fa-times-circle m-right-xs"></i>' +
        '<strong>提示！</strong> ' + text +
        '</div>';
    },
    cancelHandler: function(){
      this.render();
    }

  });

  module.exports = operateCheckView;
});