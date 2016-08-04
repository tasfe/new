/**
 * Created by David Zhang on 2015/9/8.
 */
define(function (require, exports, module) {

  var VipLevelIntegralView = Base.ItemView.extend({

    template: require('text!vipCenter/vipLevelManagement/vipLevelIntegral.html'),

    events: {
      'click .js-li-btn-submit': 'formSubmitHandler',
      'click .js-li-btn-cancel': 'formCancelHandler'
    },

    initialize: function () {
    },
    _getVipLevelData: function (params) {
      return Global.sync.ajax({
        url: '/intra/vipmanager/integralcfgdetail.json',
        data: params
      });
    },
    onRender: function () {
      var self=this;
      this.$formContainer = this.$('.js-wd-form');
      this._loadPage( 'js-wd-constGrid');
    },
    _loadPage: function (classValue) {
      var self = this;
      this._getVipLevelData().done(function (res) {
        if (res.result === 0) {
          _(res.root.dataList).each(function (data) {
            self.formatRowData(data);
          });
        }else{
          Global.ui.notification.show('数据异常。');
        }
      }).fail(function(){
      });
    },
    formatRowData: function (rowInfo) {
      var row = [];
      if(rowInfo.type==1){
        row.push('<td style="width: 100px;"><span><input type="text" hidden name="itemList[0].type" value="'+rowInfo.type+'">晋级</span></td>');
        row.push('<td><div class="input-group"><span class="input-group-addon">≥</span><input type="text" class="form-control" name="itemList[0].v0Num" value="'+_(rowInfo.v0Num).formatDiv(10000, {fixed: 0})+'" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required></div></td>');
        row.push('<td><div class="input-group"><span class="input-group-addon">≥</span><input type="text" class="form-control" name="itemList[0].v1Num" value="'+_(rowInfo.v1Num).formatDiv(10000, {fixed: 0})+'" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required></div></td>');
        row.push('<td><div class="input-group"><span class="input-group-addon">≥</span><input type="text" class="form-control" name="itemList[0].v2Num" value="'+_(rowInfo.v2Num).formatDiv(10000, {fixed: 0})+'" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required></div></td>');
        row.push('<td><div class="input-group"><span class="input-group-addon">≥</span><input type="text" class="form-control" name="itemList[0].v3Num" value="'+_(rowInfo.v3Num).formatDiv(10000, {fixed: 0})+'" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required></div></td>');
        row.push('<td><div class="input-group"><span class="input-group-addon">≥</span><input type="text" class="form-control" name="itemList[0].v4Num" value="'+_(rowInfo.v4Num).formatDiv(10000, {fixed: 0})+'" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required></div></td>');
        row.push('<td><div class="input-group"><span class="input-group-addon">≥</span><input type="text" class="form-control" name="itemList[0].v5Num" value="'+_(rowInfo.v5Num).formatDiv(10000, {fixed: 0})+'" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required></div></td>');
        row.push('<td><div class="input-group"><span class="input-group-addon">≥</span><input type="text" class="form-control" name="itemList[0].v6Num" value="'+_(rowInfo.v6Num).formatDiv(10000, {fixed: 0})+'" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required></div></td>');
        this.$('.js-il-up').html(row.join(''))
      }else {
        row.push('<td style="width: 100px;"><input type="text" hidden name="itemList[1].type" value="'+rowInfo.type+'">衰减</td>');
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[1].v0Num" value="'+_(rowInfo.v0Num).formatDiv(10000, {fixed: 0})+'"></td>');
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[1].v1Num" value="'+_(rowInfo.v1Num).formatDiv(10000, {fixed: 0})+'" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required></div></td>');
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[1].v2Num" value="'+_(rowInfo.v2Num).formatDiv(10000, {fixed: 0})+'" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required></div></td>');
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[1].v3Num" value="'+_(rowInfo.v3Num).formatDiv(10000, {fixed: 0})+'" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required></div></td>');
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[1].v4Num" value="'+_(rowInfo.v4Num).formatDiv(10000, {fixed: 0})+'" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required></div></td>');
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[1].v5Num" value="'+_(rowInfo.v5Num).formatDiv(10000, {fixed: 0})+'" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required></div></td>');
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[1].v6Num" value="'+_(rowInfo.v6Num).formatDiv(10000, {fixed: 0})+'" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required></div></td>');
        this.$('.js-il-down').html(row.join(''))
      }

    },
    formSubmitHandler: function (e) {
      var self = this;
      var type = 1;
      var $target = $(e.currentTarget);
      $target.button('loading');
      var $currContainer = $('.js-li-form');
      var clpValidate = $currContainer.parsley().validate();
      if (clpValidate) {
        Global.sync.ajax({
          url: '/intra/vipmanager/saveintegralcfg.json',
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
                Global.appRouter.navigate(_('#vip/il').addHrefArgs({_t: _.now()}), {
                  trigger: true,
                  replace: false
                });
              } else {
                Global.ui.notification.show('操作失败。');
              }
            });
      }else{
        $target.button('reset');
      }
    },
    formCancelHandler: function (e) {
      var self = this;
      Global.appRouter.navigate(_('#vip/il').addHrefArgs({_t: _.now()}), {
        trigger: true,
        replace: false
      });
    }

  });

  module.exports = VipLevelIntegralView;
});