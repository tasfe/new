define(function (require, exports, module) {
  var MoneyTreeCfgView = Base.ItemView.extend({

    template: require('text!saleCenter/templates/games-moneyTreeConfig.html'),

    events: {
      'click .js-sc-mt-add': 'addHandler',
      'click .js-sc-mt-del': 'delHandler',
      'click .js-sc-mt-btn-submit': 'saveRainCfgHandler',
      'click .js-sc-mt-btn-reset':'resetRainCfgHandler'
    },

    initialize: function () {
    },
  //发送请求
    _getRedCfgData: function (params) {
      return Global.sync.ajax({
        url: '/intra/activitymanage/moneytreecfgdetail.json',
        data: params
      });
    },
    onRender: function () {
      var self = this;
      //初始化时间选择
      new Global.Prefab.Timeset({
        el: this.$('.js-sc-mt-timeset'),
        startTime: 'fromDate',
        endTime: 'endDate',
        endDate: moment().add(10, 'year'),
        startValidate: 'required data-parsley-trigger="blur"',
        endValidate: 'required data-parsley-trigger="blur"'
      }).render();

      var activityId = 9;
      var params = {activityId: activityId};
      this._loadPage(params);
    },
    _loadPage: function (params) {
      var self = this;
      this._getRedCfgData(params).done(function (res) {
        if (res.result === 0) {
          if(res.root){
            self.$('.js-start-time').val(res.root.fromDate?_(res.root.fromDate).toTime():'');
            self.$('.js-end-time').val(res.root.endDate?_(res.root.endDate).toTime():'');
            self.$('.js-sc-mt-monetary').val(_(res.root.limit).formatDiv(10000));
            self.$('.js-sc-mt-activityId').val(res.root.type);
            self._getTable(res.root.moneyList);
            self.initGoldBarBonus(res.root.goldList);
          }else{
            self._getTable();
          }

        } else {
          Global.ui.notification.show(res.msg);
        }
      }).fail(function () {
      });
    },
    //获取表格
      _getTable: function (moneyList) {
      this.staticGrid = this.$('.js-sc-mt-bagBonus').staticGrid({
        colModel: [
          {label: '奖励金额（元）', name: 'formatAmount', width: 100},
          {label: '奖励份额（份）', name: 'formatCount', width: 120},
         {label: '中奖概率%', name: 'formatRate', width: 120}
        ],
        emptyTip: false,
        row: this._formatBagData(moneyList||[])
      }).staticGrid('instance');
    },
    initGoldBarBonus: function(goldList){
      _(goldList).each(function(goldItem){
        if(goldItem.amount===1){
          this.$('.js-sc-mt-goldBrick-rate').val(_(goldItem.odds).formatDiv(100,{fixed:2}));
          this.$('.js-sc-mt-goldBrick-count').val(goldItem.count);
          return;
        }
        if(goldItem.amount===2){
          this.$('.js-sc-mt-goldIngot-rate').val(_(goldItem.odds).formatDiv(100,{fixed:2}));
          this.$('.js-sc-mt-goldIngot-count').val(goldItem.count);
          return;
        }
        if(goldItem.amount===3){
          this.$('.js-sc-mt-goldBar-rate').val(_(goldItem.odds).formatDiv(100,{fixed:2}));
          this.$('.js-sc-mt-goldBar-count').val(goldItem.count);
          return;
        }
      });

    },
    //格式化数据
    _formatBagData: function (cfgs) {
      this.lastIndex = cfgs.length ;
      return _(cfgs).map(function (cfg, index) {
          return {
            count: cfg.count,
            'formatAmount': '<div><input type="text" name="moneyList[' + index + '].amount" class="js-sc-mt-amount form-control" required style="width:150px;" value="' + _(cfg.amount).formatDiv(10000, {fixed: 0}) + '" data-parsley-range="[0, 1000000]" data-parsley-type="integer" required><label class="control-label m-right-sm" style="margin-left: 20px;">元</label></div>',
            'formatCount': '<input type="text" name="moneyList[' + index + '].count" class="js-sc-mt-count form-control" style="width:150px;" required value="'
            + cfg.count + '" data-parsley-range="[0, 1000000]" data-parsley-type="integer" required><label class="control-label m-right-sm" style="margin-left: 20px;">个</label>',
            'formatRate': '<input type="text" name="moneyList[' + index + '].odds" class="js-sc-mt-rate form-control" style="width:150px;" required value="'
            + _(cfg.odds).formatDiv(100,{fixed:2}) + '" data-parsley-range="[0, 100]" data-parsley-twoDecimal required><label class="control-label m-right-sm" style="margin-left: 20px;">%</label>' +
            '<button class="js-sc-mt-del btn btn-danger btn-sm pull-right"><i class="fa fa-minus"></i> </button>'
          }
        }
      );

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

    addHandler: function() {
      this.staticGrid.addRows([{
        'formatAmount': '<div><input type="text" name="moneyList[' + this.lastIndex + '].amount" class="js-sc-mt-amount form-control" required style="width:150px;" data-parsley-range="[0, 1000000]" data-parsley-type="integer" required><label class="control-label m-right-sm" style="margin-left: 20px;">元</label></div>',
        'formatCount': '<input type="text" name="moneyList[' + this.lastIndex + '].count" class="js-sc-mt-count form-control" style="width:150px;" required value="" data-parsley-range="[0, 1000000]" data-parsley-type="integer" required><label class="control-label m-right-sm" style="margin-left: 20px;">个</label>',
        'formatRate': '<input type="text" name="moneyList[' + this.lastIndex + '].odds" class="js-sc-mt-rate form-control" style="width:150px;" required value="" data-parsley-range="[0, 100]" data-parsley-twoDecimal required><label class="control-label m-right-sm" style="margin-left: 20px;">%</label>' +
        '<button class="js-sc-mt-del btn btn-danger btn-sm pull-right"><i class="fa fa-minus"></i> </button>'
      }], {
        eq: -2
      });
      this.lastIndex++;
    },

    delHandler: function(e) {
      var $target = $(e.currentTarget);
      this.staticGrid.delRow($target);
    },
    saveRainCfgHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);
      $target.button('loading');
      var $currContainer = $('.js-sc-mt-rainCfg-form');
      var clpValidate = $currContainer.parsley().validate();
      if (clpValidate) {
        var moneyList = []
        _($('.js-sc-mt-amount')).each(function(item,index){
          moneyList.push({
            amount: $(item).val(),
            count: $($('.js-sc-mt-count')[index]).val(),
            odds: $($('.js-sc-mt-rate')[index]).val()
          });
        });
        var data = {
          fromDate:  $('.js-start-time').val(),
          endDate:  $('.js-end-time').val(),
          limit:  $('.js-sc-mt-monetary').val(),
          moneyList:moneyList,
          goldList:[
            {
              amount: 1,
              odds: $('.js-sc-mt-goldBrick-rate').val(),
              count: $('.js-sc-mt-goldBrick-count').val()
            },
            {
              amount: 2,
              odds: $('.js-sc-mt-goldIngot-rate').val(),
              count: $('.js-sc-mt-goldIngot-count').val()
            },
            {
              amount: 3,
              odds: $('.js-sc-mt-goldBar-rate').val(),
              count: $('.js-sc-mt-goldBar-count').val()
            }
          ],
          activityId:9
        }
        //_($currContainer.serializeArray()).serializeObject(),
        Global.sync.ajax({
          url: '/intra/activitymanage/savemoneytreecfg.json',
          data: data,
          tradition: true
        })
          .always(function () {
            $target.button('reset');
          })
          .fail(function () {
            // 处理失败
          })
          .done(function (res) {
            if (res && res.result === 0) {
              Global.ui.notification.show('操作成功。');
              self.render();
            } else {
              Global.ui.notification.show('操作失败。');
            }
          });
      } else {
        $target.button('reset');
      }
    },
    resetRainCfgHandler:function(e){
    this.render();
    }


  });
  module.exports = MoneyTreeCfgView;
});