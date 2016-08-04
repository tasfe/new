define(function (require, exports, module) {

  var TransferRangeSetView = Base.ItemView.extend({

    template: require('text!fundCenter/templates/transfer-TransferAccountSet.html'),

    events: {
      'click .js-fc-TransferSet-submit': 'TransferSetSubmitHandler',
      'click .js-fc-TransferSet-cancel': 'TransferSetSubmitHandler',
      'click .js-fc-transferSet-downTransferOpen':'OperationSwitch',
      'click .js-fc-transferSet-upTransferOpen':'OperationSwitch'
    },

    initialize: function () {

    },
    findTransferRangeXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/transfermanage/cfgdetail.json',
        data: data
      });
    },
    saveTransferSetXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/transfermanage/savecfg.json',
        data: data,
        tradition: true
      });
    },

    onRender: function () {
      var self = this;
      var data = {};

      self.findTransferRangeXhr(data).fail(function () {
      }).done(function (res) {
        if (res.result === 0) {
          self.fillFormInfo(res.root);
        } else {
          self.insertNotice('获取配置信息失败，' + res.msg);
        }
      });

    },
    TransferSetSubmitHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);

      //todo 校验添加
      var $currContainer = $('.js-fc-transferSet-form');
      var clpValidate = $currContainer.parsley().validate();
      if (clpValidate) {
        self.$('input[name=downTransferList]').removeAttr('disabled');
        self.$('input[name=upTransferList]').removeAttr('disabled');
        var downTransferList = _(this.$('input[name=downTransferList]:checked')).map(function(downTransfer,index){
          return $(downTransfer).val();
        });
        var upTransferList = _(this.$('input[name=upTransferList]:checked')).map(function(upTransfer,index){
          return $(upTransfer).val();
        });

        var data = {
          downTransferOpen: this.$('.js-fc-transferSet-downTransferOpen').prop('checked')?true:false,
          downTransferList: downTransferList,
          upTransferOpen: this.$('.js-fc-transferSet-upTransferOpen').prop('checked')?true:false,
          upTransferList: upTransferList,
          timesLimit: this.$('.js-fc-TAS-timesLimit').val(),
          minMoneyLimit:this.$('.js-fc-TAS-minMoneyLimit').val(),
          maxMoneyLimit: this.$('.js-fc-TAS-maxMoneyLimit').val()
        };
        $target.button('loading');
        this.saveTransferSetXhr(data).always(function () {
          $target.button('reset');
        }).fail(function () {
        }).done(function (res) {
          if (res.result === 0) {
            Global.ui.notification.show('操作成功。');
            Global.appRouter.navigate(_('#fc/ta').addHrefArgs({
              _t:_.now(),
            }), {trigger: true, replace: false});
          } else {
            Global.ui.notification.show('操作失败。');
          }
        });
      }

    },

    getSetInfoListFromContainer: function ($container,name) {
      var idList = $container.find('.js-fc-rechargeSet-id');
      //var feeTypeList = $container.find('input[type=radio].');
      var percentList = $container.find('.js-fc-rechargeSet-returnFee-rate');
      var moneyList = $container.find('.js-fc-rechargeSet-returnFee-amount');

      var setInfoList = _(idList).map(function (id, index, inList) {
        return {
          bankId: $(id).data('type'),
          feeType:$container.find('input[type=radio][name='+name+index+']').val(),
          percent: $(percentList[index]).val(),
          money: $(moneyList[index]).val()
        }
      });
      return setInfoList;
    },


    fillFormInfo: function (root) {
      var self = this;

      if (root.downTransferOpen) {
        self.$('.js-fc-transferSet-downTransferOpen').prop('checked', true).data('status',false);
        self.$('.js-fc-transferSet-downTransferOpen').click();
      }
      _(root.downTransferList).each(function(downTransfer,index,downTransferList){
        self.$('input[name=downTransferList][value='+downTransfer+']').prop('checked', true);
      });
      if (root.upTransferOpen) {
        self.$('.js-fc-transferSet-upTransferOpen').prop('checked', true).data('status',false);
        self.$('.js-fc-transferSet-upTransferOpen').click();
      }
      _(root.upTransferList).each(function(upTransfer,index,downTransferList){
        self.$('input[name=upTransferList][value='+upTransfer+']').prop('checked', true);
      });
      this.$('.js-fc-TAS-timesLimit').val(root.timesLimit);
      this.$('.js-fc-TAS-minMoneyLimit').val(_(root.minMoneyLimit).convert2yuan());
      this.$('.js-fc-TAS-maxMoneyLimit').val(_(root.maxMoneyLimit).convert2yuan());

    },

    OperationSwitch:function(e){
      var self = this;
      var $target = $(e.currentTarget);

      if($target.val() == 0){
        if($target.data('status') == true){
          $target.prop('checked', false);
          $target.data('status',false);
          self.$('input[name=downTransferList]').attr('disabled', 'disabled');
        }else if($target.data('status') == false){
          $target.prop('checked', true);
          $target.data('status',true);
          self.$('input[name=downTransferList]').removeAttr('disabled');
        }
      }else if($target.val() == 1){
        if($target.data('status') == true){
          $target.prop('checked', false);
          $target.data('status',false);
          self.$('input[name=upTransferList]').attr('disabled', 'disabled');
        }else if($target.data('status') == false){
          $target.prop('checked', true);
          $target.data('status',true);
          self.$('input[name=upTransferList]').removeAttr('disabled');
        }
      }
    },


    insertNotice: function (html) {
      this.$('.js-fc-TransferRangeSet-notice').html(this._getErrorMsg(html));
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

  module.exports = TransferRangeSetView;
});