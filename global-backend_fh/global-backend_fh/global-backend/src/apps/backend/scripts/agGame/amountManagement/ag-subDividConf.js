define(function (require, exports, module) {

  var AgSubDividConfView = Base.ItemView.extend({

    template: require('text!agGame/amountManagement/ag-subDividConf.html'),
    amountAndRate_tpl: require('text!agGame/amountManagement/ag-subDivid-AmountAndRateTpl.html'),

    events: {
      'click .js-ag-sub-addSet-btn': 'addSetHandler',
      'click .js-ag-sub-del': 'delSetHandler',
      'click .js-ag-sub-submit': 'saveSetHandler',
      'click .js-ag-sub-cancel': 'cancelHandler'
    },

    initialize: function () {
    },
    findSetXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/agmanager/agdividconf.json',
        data: data
      });
    },
    saveSetXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/agmanager/saveagdividconf.json',
        data: data,
        tradition: true
      });
    },
    onRender: function () {
      var self = this;
      this.$container = this.$('.js-ag-divid-container');

      this.findSetXhr()
        .fail(function(){
        }).done(function(res){
        if(res.result===0){
          self.generateBonusSetTr(res.root.confList);
        }else{
          this.insertNotice('处理信息获取失败'+res.msg);
        }
      });
    },

    generateBonusSetTr: function(confList){
      var self = this;
      _(confList).each(function(item){
        self.$container.append(_(self.amountAndRate_tpl).template()({
          amount: _(item.profit).formatDiv(10000,{fixed:0}),
          rate: _(item.rate).formatDiv(10000,{fixed:3}),
          active:item.valid
        }));
      });

    },
    addSetHandler: function () {
      this.$container.append(_(this.amountAndRate_tpl).template()({
        amount: '',
        rate: '',
        active:''
      }));
    },
    delSetHandler: function (e) {
      $(e.currentTarget).closest('.js-ag-sub-Set').remove();
    },
    saveSetHandler: function (e) {
      var $target = $(e.currentTarget);
      $target.button('loading');
      var $form = this.$('.js-ag-sub-divid-form');
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
          paramList: dividConf
        };
        this.saveSetXhr(data).always(function(){
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
    getSetInfoArrFromContainer: function () {
      var rebateList = this.$container.find('.js-ag-sub-dividendRate');
      var betAmountList = this.$container.find('.js-ag-sub-betAmount');
      var subList = this.$container.find('.js-ag-sub-active');
      return _(rebateList).map(function (item,index) {
        return  {
          profit: $(betAmountList[index]).val(),
          rate:  $(item).val(),
          valid:$(subList[index]).val()

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

  module.exports = AgSubDividConfView;
});