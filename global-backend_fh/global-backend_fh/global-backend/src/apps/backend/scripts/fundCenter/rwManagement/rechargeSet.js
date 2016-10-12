define(function (require, exports, module) {

  var RechargeSetView = Base.ItemView.extend({

    template: require('text!./rechargeSet.html'),

    events: {

    },

    initialize: function () {
    },
    getAmountXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/rechargemanage/conf.json',
        data: data
      });
    },

    onRender: function(){
      var self = this;
      self.getAmountXhr({paymentType: self.options.paymentType,type:self.options.type}).done(function (res) {
        if (res && res.result === 0) {

          if(res.root.feeOpen){
            self.$('.js-tp-status').html('<select class="js-tp-status-option form-control"> <option value="true">开启</option> <option value="false">关闭</option> </select>');
          }else{
            self.$('.js-tp-status').html('<select class="js-tp-status-option form-control"> <option value="false">关闭</option> <option value="true">开启</option> </select>');
          }
          self.$('.js-fc-each-recharge-fei').val(_(res.root.minFeeLimit).formatDiv(100));
          self.$('.js-fc-each-recharge-fei').val(_(res.root.minFeeLimit).formatDiv(100));
          self.$('.js-fc-each-recharge-max').val(_(res.root.maxFeeLimit).formatDiv(10000));
          self.$('.js-fc-min-money').val(_(res.root.minMoneyLimit).formatDiv(10000));
          self.$('.js-fc-max-money').val(_(res.root.maxMoneyLimit).formatDiv(10000));
          var num=6;
          var length=res.root.amount.length;
          var index=-1;
          var sHtml='';
          var fHtml='';
          _(res.root.amount).map(function (amount){
            index=index+1;
            sHtml+= '<div class="col-sm-4 input-group" style="margin-right:20px;margin-top: 10px;;"> <input type="text" name="'+index+'" class="js-fc-amount form-control" data-parsley-range="[0, 9990000]" value="'+amount+'" data-parsley-type="integer" >' +
              ' <div class="input-group-addon">元</div> </div>';

          });
          for(var i=0;i<num-length;i++){
            index=index+1;
            fHtml=fHtml+'<div class="col-sm-4 input-group" style="margin-right:20px;margin-top: 10px;;"> <input type="text" name="'+index+'" class="js-fc-amount form-control" data-parsley-range="[0, 9990000]" data-parsley-type="integer" >' +
                ' <div class="input-group-addon">元</div> </div>';

          }
          self.$('.js-tp-set').html(sHtml+fHtml);

        } else {
          Global.ui.notification.show('数据异常。');
        }
      })

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
    }

  });

  module.exports = RechargeSetView;
});