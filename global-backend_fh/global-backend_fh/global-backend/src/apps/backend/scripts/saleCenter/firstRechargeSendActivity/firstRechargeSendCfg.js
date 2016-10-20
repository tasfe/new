/**
 * Created by David Zhang on 2015/12/11.
 */
define(function (require, exports, module) {

  var rbacActivityConfView = Base.ItemView.extend({

    template: require('text!saleCenter/firstRechargeSendActivity/firstRechargeSendCfg.html'),

    events: {
      'submit .js-sc-rbac-form': 'saveSetHandler',
      'click .js-sc-rbac-cancel': 'cancelHandler',
      'click .js-sc-del': 'delHandler',
      'click .js-sc-add': 'addHandler'
    },

    initialize: function () {
      this.lastIndex=0;
    },
    findSetXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/newrechact/conf.json',
        data: data
      });
    },
    saveSetXhr: function(data) {
      return Global.sync.ajax({
        url: '/intra/newrechact/saveconf.json',
        data: _(data).extend({
          activityId: 38
        })
      })
    },
    onRender: function () {
      var self = this;
      new Global.Prefab.Timeset({
        el: this.$('.js-sc-rbac-timeset'),
        startTime: 'fromDate',
        endTime: 'endDate',
        endDate: moment().add(10, 'year'),
        startValidate: 'required data-parsley-trigger="blur"',
        endValidate: 'required data-parsley-trigger="blur"'
      }).render();
      this.$conditionContainer = this.$('.js-fc-condition-container');

      this.findSetXhr()
        .fail(function(){
        }).done(function(res){
        if(res.result===0){
          self.fillBaseInfo(res,res.root, 'js-sc-cfgDetail');
        }else{
          this.insertNotice('处理信息获取失败'+res.msg);
        }
      });
    },

    fillBaseInfo: function(res,root,classValue){
      if (res.result === 0&&res.root!=null) {
        this.$('.js-start-time').val(_(root.fromDate).toTime());
        this.$('.js-end-time').val(_(root.endDate).toTime());
        this.$('.js-sc-rbac-activityId').val(root.activityId);
        if (root.userType == 0) {
          this.$('input[type="radio"][name="userType"][value="0"]').prop('checked', true);
        } else if (root.userType == 1) {
          this.$('input[type="radio"][name="userType"][value="1"]').prop('checked', true);
        }
        this.$('.js-sc-rbac-count').val(root.count);
        this._getTable(this._formatCfgData(res.root.itemList, res.root), classValue);
      }else {
        self.staticGrid =self.$('.' + classValue).staticGrid({
          colModel: [
            {label: '存款金额', name: 'recharge', width: 100},
            {label: '奖金', name: 'bonus', width: 100},
            {label: '所需流水', name: 'bet', width: 100}
          ],
          emptyTip: false,
          row: []
        }).staticGrid('instance');
        Global.ui.notification.show(res.msg);
      }
    },

//获取表格
    _getTable: function (tableInfo, classValue) {
      this.staticGrid =this.$('.' + classValue).staticGrid({
        colModel: [
          {label: '存款金额', name: 'recharge', width: 100},
          {label: '奖金', name: 'bonus', width: 100},
          {label: '所需流水', name: 'bet', width: 100}
        ],
        emptyTip: false,
        row: tableInfo
      }).staticGrid('instance');
    },
    //格式化数据
    _formatCfgData: function (cfgs,msg) {
      if(msg!=null){
        this.lastIndex = cfgs.length;
      }
      return _(cfgs).chain().map(function (cfg, index) {
            return {
              'recharge': '<div><input type="text" name="itemList[' + index + '].recharge" class="form-control" required style="width:150px;" value="' + _(cfg.recharge).formatDiv(10000, {fixed: 0}) + '" data-parsley-range="[0, 99999999]" data-parsley-type="integer" required><label class="control-label m-right-sm" style="margin-left: 20px;">元</label></div>',
              'bonus': '<div><input type="text" name="itemList[' + index + '].bonus" class="form-control" required style="width:150px;" value="' + _(cfg.bonus).formatDiv(10000, {fixed: 0}) + '" data-parsley-range="[0, 99999999]" data-parsley-type="integer" required><label class="control-label m-right-sm" style="margin-left: 20px;">元</label></div>',
              'bet': '<div><input type="text" name="itemList[' + index + '].bet" class="form-control" required style="width:150px;" value="' + _(cfg.bet).formatDiv(10000, {fixed: 0}) + '" data-parsley-range="[0, 99999999]" data-parsley-type="integer" required><label class="control-label m-right-sm" style="margin-left: 20px;">元</label><button class="js-sc-del btn btn-danger btn-sm pull-right"><i class="fa fa-minus"></i> </button></div>'
            }
          }
      ).flatten().value();
    },
    saveSetHandler: function(e) {
      var self = this;
      var $target = $(e.currentTarget);
      $target.button('loading');
      var $currContainer = $('.js-sc-rbac-form');
      var clpValidate = $currContainer.parsley().validate();
      if (clpValidate) {
        Global.sync.ajax({
          url: '/intra/newrechact/saveconf.json',
          data: _($currContainer.serializeArray()).serializeObject()
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
                Global.appRouter.navigate(_('#sc/fs/conf').addHrefArgs({_t: _.now()}), {
                  trigger: true,
                  replace: false
                });
              } else {
                Global.ui.notification.show('操作失败。');
              }
            });
      } else {
        $target.button('reset');
      }
    },
    delHandler: function(e) {
      var $target = $(e.currentTarget);
      this.staticGrid.delRow($target);
    },
    addHandler: function() {
      this.staticGrid.addRows([{
        'recharge': '<div><input type="text" name="itemList[' + this.lastIndex + '].recharge" class="form-control" required style="width:150px;" data-parsley-range="[0, 99999999]" data-parsley-type="integer" required><label class="control-label m-right-sm" style="margin-left: 20px;">元</label></div>',
        'bonus': '<div><input type="text" name="itemList[' + this.lastIndex + '].bonus" class="form-control" required style="width:150px;" data-parsley-range="[0, 99999999]" data-parsley-type="integer" required><label class="control-label m-right-sm" style="margin-left: 20px;">元</label></div>',
        'bet': '<div><input type="text" name="itemList[' + this.lastIndex + '].bet" class="form-control" required style="width:150px;"  data-parsley-range="[0, 99999999]" data-parsley-type="integer" required><label class="control-label m-right-sm" style="margin-left: 20px;">元</label><button class="js-sc-del btn btn-danger btn-sm pull-right"><i class="fa fa-minus"></i> </button></div>'
      }], {
        eq: -1
      });
      this.lastIndex++;
    },
    cancelHandler: function(){
      this.render();
    }

  });

  module.exports = rbacActivityConfView;
});