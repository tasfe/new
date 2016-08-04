/**
 * Created by David Zhang on 2015/12/11.
 */
define(function (require, exports, module) {

  var operateCheckView = Base.ItemView.extend({

    template: require('text!saleCenter/templates/commissionCfg.html'),
    betAndRate_tpl: require('text!saleCenter/templates/commissionCfg-BetAndRateTpl.html'),

    events: {
      'click .js-sc-yc-addCommissionSet-btn': 'addCommissionSetHandler',
      'click .js-sc-delete-btn': 'delCommissionSetHandler',
      'change .js-sc-commissionType':'changeCommissionUnit',
      'click .js-sc-yc-submit': 'saveCommissionSetHandler',
      'click .js-sc-yc-cancel': 'cancelHandler'
    },

    initialize: function () {
    },
    findCommissionSetXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/activitymanage/commcfgdetail.json',
        data: data
      });
    },
    saveCommissionSetXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/activitymanage/savecommcfg.json',
        data: data,
        tradition: true
      });
    },
    onRender: function () {
      var self = this;
      new Global.Prefab.Timeset({
        el: this.$('.js-sc-timeset'),
        startTime: 'startTime',
        endTime: 'endTime',
        endDate: moment().add(10, 'year'),
        startValidate: 'required data-parsley-trigger="blur"',
        endValidate: 'required data-parsley-trigger="blur"'
      }).render();

      this.$container = this.$('.js-fc-gs-container');
      this.$beginTime = this.$('.js-start-time');
      this.$endTime = this.$('.js-end-time');
      this.$activityId = this.$('.js-sc-yc-activityId');

      this.findCommissionSetXhr()
        .fail(function(){
        }).done(function(res){
          if(res.result===0){
            self.generateCommissionSetTr(res.root.itemList);
            self.fillBaseInfo(res.root);
          }else{
            this.insertNotice('处理信息获取失败'+res.msg);
          }
        });
    },

    generateCommissionSetTr: function(itemList){
      var self = this;
      _(itemList).each(function(item){
        self.$container.append(_(self.betAndRate_tpl).template()({
          betAmount: _(item.salesVolume).formatDiv(10000),//要求是整数
          currentCommissionType_fix: item.curHigherComType == 'fix' ? 'selected':'',
          currentCommissionType_percent: item.curHigherComType == 'percent' ? 'selected':'',
          currentCommissionVal: item.curHigherComType == 'fix' ? _(item.curHigherComVal).convert2yuan():_(item.curHigherComVal).formatDiv(100),
          indirectCommissionType_fix: item.indirectHigherComType == 'fix' ? 'selected':'',
          indirectCommissionType_percent:item.indirectHigherComType == 'percent' ? 'selected':'',
          indirectCommissionVal: item.indirectHigherComType == 'fix' ? _(item.indirectHigherComVal).convert2yuan():_(item.indirectHigherComVal).formatDiv(100),
          currentCommissionUnit: item.curHigherComType == 'fix'?'元':'%',
          indirectCommissionUnit:item.indirectHigherComType == 'fix'?"元":'%'
        }));
      });
    },

    fillBaseInfo: function(root){
      this.$beginTime.val(_(root.fromDate).toTime());
      this.$endTime.val(_(root.endDate).toTime());
      this.$activityId.val(root.activityId);

    },

    addCommissionSetHandler: function () {
      this.$container.append(_(this.betAndRate_tpl).template()({
        betAmount:'',
        currentCommissionType_fix:'',
        currentCommissionType_percent: '',
        currentCommissionVal:'',
        indirectCommissionType_fix: '',
        indirectCommissionType_percent:'',
        indirectCommissionVal: '',
        currentCommissionUnit:'%',
        indirectCommissionUnit:'%'
      }));
    },

    delCommissionSetHandler: function (e) {
      $(e.currentTarget).closest('.js-sc-commissionSet').remove();
    },

    changeCommissionUnit:function(e){
      var $target = $(e.currentTarget);
      if($target.val() == 'percent'){
        $target.parent().next().next().text('%');
      }else{
        $target.parent().next().next().text('元');
      }
    },

    saveCommissionSetHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);
      $target.button('loading');
      var $form = this.$('.js-sc-yc-form');
      var clpValidate = $form.parsley().validate();
      if (clpValidate) {
        var commissionConf = this.getSetInfoArrFromContainer();
        //if(!this.checkCommissionConf(commissionConf)){
        //  $target.button('reset');
        //  this.insertNotice('新增的佣金比例和日投注额要比之前的数值大。');
        //  return ;
        //}else{
        //  this.$('.js-sc-yc-notice').html('');
        //}
        var data = {
          activityId:this.$('.js-sc-yc-activityId').val(),
          fromDate: this.$('.js-start-time').val(),
          endDate: this.$('.js-end-time').val(),
          itemList: commissionConf

        };
        this.saveCommissionSetXhr(data).always(function(){
          $target.button('reset');
        }).fail(function(){

        }).done(function(res){
          if (res.result === 0) {
            Global.ui.notification.show('操作成功。');
            self.render();
          } else {
            Global.ui.notification.show('操作失败。');
          }
        });
      }else{
        $target.button('reset');
      }
    },
    getSetInfoArrFromContainer: function () {
      var betAmountList = this.$container.find('.js-sc-betAmount');
      var currentCommissionTypeList = this.$container.find('.js-sc-currentCommissionType');
      var currentCommissionValList = this.$container.find('.js-sc-currentCommissionVal');
      var indirectCommissionTypeList = this.$container.find('.js-sc-indirectCommissionType');
      var indirectCommissionValList = this.$container.find('.js-sc-indirectCommissionVal');

      return _(betAmountList).map(function (item,index) {
        return  {
          salesVolume:$(item).val(),
          curHigherComType:$(currentCommissionTypeList[index]).val(),
          curHigherComVal:$(currentCommissionValList[index]).val(),
          indirectHigherComType:$(indirectCommissionTypeList[index]).val(),
          indirectHigherComVal: $(indirectCommissionValList[index]).val()
        };
      });
    },
    checkCommissionConf: function(confList){
      var flag = true;
      _(confList).each(function(conf,index,confList){
        if(index>0){
          if(conf.curHigherComType != confList[index-1].curHigherComType){
            if(conf.curHigherComType == 'percent'
              && (Number(conf.salesVolume)*Number(conf.curHigherComVal)/100) < Number(confList[index-1].curHigherComVal)){
              flag = false;
            }
            if(confList[index-1].curHigherComType == 'percent'
              &&  Number(conf.curHigherComVal) < (Number(confList[index-1].salesVolume)*Number(confList[index-1].curHigherComVal)/100)){
              flag = false;
            }
          }

          if(conf.indirectHigherComType != confList[index-1].indirectHigherComType){
            if(conf.indirectHigherComType == 'percent'
              && (Number(conf.salesVolume)*Number(conf.indirectHigherComVal)/100) < Number(confList[index-1].indirectHigherComVal)){
              flag = false;
            }
            if(confList[index-1].indirectHigherComType == 'percent'
              &&  Number(conf.indirectHigherComVal) < (Number(confList[index-1].salesVolume)*Number(confList[index-1].indirectHigherComVal)/100)){
              flag = false;
            }
          }
          if(flag == true && (Number(conf.salesVolume)<Number(confList[index-1].salesVolume)
              ||Number(conf.curHigherComVal)<Number(confList[index-1].curHigherComVal)
              ||Number(conf.indirectHigherComVal)<Number(confList[index-1].indirectHigherComVal))){
            flag = false;
          }
        }
      });
      return flag;
    },

    insertNotice: function (html) {
      this.$('.js-sc-yc-notice').html(this._getErrorMsg(html));
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