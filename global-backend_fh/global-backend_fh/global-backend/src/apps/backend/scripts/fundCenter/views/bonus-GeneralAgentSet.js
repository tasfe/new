define(function (require, exports, module) {

  var operateCheckView = Base.ItemView.extend({

    template: require('text!fundCenter/templates/bonus-GeneralAgentSet.html'),
    amountAndRate_tpl: require('text!fundCenter/templates/bonus-GeneralAgentSet-AmountAndRateTpl.html'),

    events: {
      'click .js-fc-gs-add1960BonusSet-btn': 'add1960BonusSetHandler',
      'click .js-fc-gs-add1956BonusSet-btn': 'add1956BonusSetHandler',
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
      //初始化时间选择
      this.timeset = new Global.Prefab.Timeset({
        el: this.$('.js-fc-timeset'),
        startTime: 'fromTime',
        endTime: 'endTime',
        showToday: true
      }).render();

      this.$1960container = this.$('.js-fc-gs-1960container');
      this.$1956container = this.$('.js-fc-gs-1956container');
      //this.$bonusRateMin = this.$('.js-fc-gs-rateRange-min');
      //this.$bonusRateMax = this.$('.js-fc-gs-rateRange-max');
      //this.$signNum = this.$('.js-fc-gs-signNum');
      //this.$signRebate = this.$('.js-fc-gs-signRebate');

      this.findBonusSetXhr()
        .fail(function(){
        }).done(function(res){
          if(res.result===0){
            self.$('.js-start-time').val(_(res.root.dailyCfg.fromTime).toTime());
            self.$('.js-end-time').val(_(res.root.dailyCfg.endTime).toTime());
            self.$('.js-fc-rebate').val(_(res.root.dailyCfg.rebate).formatDiv(10));
            self.$('.js-fc-profit').val(_(res.root.dailyCfg.profitAmount).formatDiv(10000));
            self.$('.js-fc-dividRate').val(_(res.root.dailyCfg.dividRate).formatDiv(10000));
            self.$('.js-fc-maxAmount').val(_(res.root.dailyCfg.maxAmount).formatDiv(10000));

            self.generateBonusSetTr(_(_(res.root.dividBetCfgMap).pick('130')).values()||[],self.$1960container);
            self.generateBonusSetTr(_(_(res.root.dividBetCfgMap).pick('128')).values()||[],self.$1956container);
            //self.fillBaseInfo(res.root);
          }else{
            this.insertNotice('处理信息获取失败'+res.msg);
          }
        });
    },
    fillBaseInfo: function(root){
      this.$bonusRateMin.val(_(root.subDividMin).formatDiv(100));
      this.$bonusRateMax.val(_(root.subDividMax).formatDiv(100));
      this.$signNum.val(root.quotaLimit);
      this.$signRebate.val(_(root.rebateLimit).formatDiv(10));
    },

    generateBonusSetTr: function(bonusSetLists,$container){
      var self = this;
      if(bonusSetLists.length>0){
        _(bonusSetLists[0]).each(function(item){
          $container.append(_(self.amountAndRate_tpl).template()({
            amount: _(item.betTotal).fixedConvert2yuan(),
            rate: _(item.divid).formatDiv(100)
          }));
        });
      }
    },
    add1960BonusSetHandler: function () {
      this.$1960container.append(_(this.amountAndRate_tpl).template()({
        amount: '',
        rate: ''
      }));
    },
    add1956BonusSetHandler: function () {
      this.$1956container.append(_(this.amountAndRate_tpl).template()({
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
        var divid1960Conf = this.getSetInfoArrFromContainer(this.$1960container,130);
        var divid1956Conf = this.getSetInfoArrFromContainer(this.$1956container,128);
        if(!this.checkDividConf(divid1960Conf)){
          $target.button('reset');
          this.insertNotice('新增的1960分红比例和月销量要比之前的数值大。');
          return ;
        }else{
          this.$('.js-fc-gs-notice').html('');
        }
        if(!this.checkDividConf(divid1956Conf)){
          $target.button('reset');
          this.insertNotice('新增的1956分红比例和月销量要比之前的数值大。');
          return ;
        }else{
          this.$('.js-fc-gs-notice').html('');
        }
        var data = {
          dividConf: _(divid1960Conf).union(divid1956Conf),
          'dailyCfg.fromTime':this.$('.js-start-time').val(),
          'dailyCfg.endTime':this.$('.js-end-time').val(),
          'dailyCfg.rebate':this.$('.js-fc-rebate').val(),
          'dailyCfg.profit':this.$('.js-fc-profit').val(),
          'dailyCfg.dividRate':this.$('.js-fc-dividRate').val(),
          'dailyCfg.maxAmount':this.$('.js-fc-maxAmount').val()
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
    getSetInfoArrFromContainer: function ($container,rebate) {
      var rebateList = $container.find('.js-fc-gs-dividendRate');
      var betAmountList = $container.find('.js-fc-gs-betAmount');
      return _(rebateList).map(function (item,index) {
        return  {
          betTotal: $(betAmountList[index]).val(),
          divid:  $(item).val(),
          rebate: rebate
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