/**
 * Created by David Zhang on 2015/9/8.
 */
define(function (require, exports, module) {

  var VipLevelWelfareView = Base.ItemView.extend({

    template: require('text!vipCenter/vipLevelManagement/vipLevelWelfare.html'),

    events: {
      'click .js-we-btn-submit': 'formSubmitHandler',
      'click .js-we-btn-cancel': 'formCancelHandler'
    },

    initialize: function () {
    },
    _getVipLevelData: function (params) {
      return Global.sync.ajax({
        url: '/intra/vipmanager/welfarecfgdetail.json',
        data: params
      });
    },
    onRender: function () {
      var self = this;
      new Global.Prefab.Timeset({
        prevClass: 'js-time',
        el: this.$('.js-we-time'),
        startTime: 'fromTime',
        endTime: 'endTime',
        endDate: moment().add(100, 'year'),
        widthHolder: 'width:80px;',
        startOps: {
          format: 'H:mm:ss'
        },
        endOps: {
          format: 'H:mm:ss'
        }
      }).render();
      this.$formContainer = this.$('.js-we-form');
      this._loadPage('js-we-constGrid');
    },
    _loadPage: function (classValue) {
      var self = this;
      this._getVipLevelData().done(function (res) {
        if (res.result === 0) {
          _(res.root.itemList).each(function (data) {
            self.formatRowData(data);
          });
          var iNum = 0;
          _(res.root.timeList).each(function (data) {
            self.formatTimeData(data, iNum);
            iNum = iNum + 1;
          });
        } else {
          Global.ui.notification.show('数据异常。');
        }
      }).fail(function () {
      });
    },
    formatTimeData: function (rowInfo, iNum) {
      this.$('.js-we-t' + rowInfo.week).find('input[type=checkbox]').prop('checked', true);
      this.$('.js-we-t' + rowInfo.week).find('.js-time-start-time').val(rowInfo.fromTime);
      this.$('.js-we-t' + rowInfo.week).find('.js-time-end-time').val(rowInfo.endTime);
      //this.$('.js-we-t'+rowInfo.week).find('.js-time-start-time').attr('name','timeList['+iNum+'].fromTime');
      //this.$('.js-we-t'+rowInfo.week).find('.js-time-end-time').attr('name','timeList['+iNum+'].endTime');
      this.$('.js-we-t' + rowInfo.week).find('.js-time-start-time').attr('name', 'fromTime');
      this.$('.js-we-t' + rowInfo.week).find('.js-time-end-time').attr('name', 'endTime');
    },

    formatRowData: function (rowInfo) {
      var row = [];
      if (rowInfo.type == 1) {
        row.push('<td style="width: 150px;"><span><input type="text" hidden name="itemList[0].type" value="' + rowInfo.type + '">晋级礼金（元）</span></td>');
        if (rowInfo.status == 1) {
          row.push('<td><div class="input-group"><select class="form-control" name="itemList[0].status" style="width: 100px;"><option value="1" selected>开启</option><option value="0">关闭</option></select></div></td>');
        } else if (rowInfo.status == 0) {
          row.push('<td><div class="input-group"><select class="form-control" name="itemList[0].status" style="width: 100px;"><option value="1" >开启</option><option value="0" selected>关闭</option></select></div></td>');
        }
        row.push('<td><div class="input-group"></div><input type="text" class="form-control" name="itemList[0].v0Num" value="' + _(rowInfo.v0Num).formatDiv(10000) + '" data-parsley-range="[0, 9990000]" data-parsley-type="integer"></div></td>');
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[0].v1Num" value="' + _(rowInfo.v1Num).formatDiv(10000) + '" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required></div></td>');
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[0].v2Num" value="' + _(rowInfo.v2Num).formatDiv(10000) + '" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required></div></td>');
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[0].v3Num" value="' + _(rowInfo.v3Num).formatDiv(10000) + '" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required></div></td>');
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[0].v4Num" value="' + _(rowInfo.v4Num).formatDiv(10000) + '" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required></div></td>');
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[0].v5Num" value="' + _(rowInfo.v5Num).formatDiv(10000) + '" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required></div></td>');
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[0].v6Num" value="' + _(rowInfo.v6Num).formatDiv(10000) + '" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required></div></td>');
        this.$('.js-we-up').html(row.join(''))
      } else if (rowInfo.type == 2) {
        row.push('<td style="width: 150px;"><input type="text" hidden name="itemList[1].type" value="' + rowInfo.type + '">保级礼金（元）</td>');
        if (rowInfo.status == 1) {
          row.push('<td><div class="input-group"><select class="form-control" name="itemList[1].status" style="width: 100px;"><option value="1" selected>开启</option><option value="0">关闭</option></select></div></td>');
        } else if (rowInfo.status == 0) {
          row.push('<td><div class="input-group"><select class="form-control" name="itemList[1].status" style="width: 100px;"><option value="1">开启</option><option value="0" selected>关闭</option></select></div></td>');
        }
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[1].v0Num" value="' + _(rowInfo.v0Num).formatDiv(10000) + '" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required></div></td>');
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[1].v1Num" value="' + _(rowInfo.v1Num).formatDiv(10000) + '" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required></div></td>');
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[1].v2Num" value="' + _(rowInfo.v2Num).formatDiv(10000) + '" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required></div></td>');
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[1].v3Num" value="' + _(rowInfo.v3Num).formatDiv(10000) + '" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required></div></td>');
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[1].v4Num" value="' + _(rowInfo.v4Num).formatDiv(10000) + '" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required></div></td>');
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[1].v5Num" value="' + _(rowInfo.v5Num).formatDiv(10000) + '" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required></div></td>');
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[1].v6Num" value="' + _(rowInfo.v6Num).formatDiv(10000) + '" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required></div></td>');
        this.$('.js-we-down').html(row.join(''))
      } else if (rowInfo.type == 3) {
        row.push('<td style="width: 150px;"><input type="text" hidden name="itemList[2].type" value="' + rowInfo.type + '">生日礼金（元）</td>');
        if (rowInfo.status == 1) {
          row.push('<td><div class="input-group"><select class="form-control" name="itemList[2].status" style="width: 100px;"><option value="1" selected>开启</option><option value="0">关闭</option></select></div></td>');
        } else if (rowInfo.status == 0) {
          row.push('<td><div class="input-group"><select class="form-control" name="itemList[2].status" style="width: 100px;"><option value="1">开启</option><option value="0" selected>关闭</option></select></div></td>');
        }
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[2].v0Num" value="' + _(rowInfo.v0Num).formatDiv(10000) + '" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required></div></td>');
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[2].v1Num" value="' + _(rowInfo.v1Num).formatDiv(10000) + '" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required> </div></td>');
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[2].v2Num" value="' + _(rowInfo.v2Num).formatDiv(10000) + '" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required></div></td>');
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[2].v3Num" value="' + _(rowInfo.v3Num).formatDiv(10000) + '" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required></div></td>');
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[2].v4Num" value="' + _(rowInfo.v4Num).formatDiv(10000) + '" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required></div></td>');
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[2].v5Num" value="' + _(rowInfo.v5Num).formatDiv(10000) + '" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required></div></td>');
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[2].v6Num" value="' + _(rowInfo.v6Num).formatDiv(10000) + '" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required></div></td>');
        this.$('.js-we-birth').html(row.join(''))
      } else if (rowInfo.type == 4) {
        row.push('<td style="width: 150px;"><input type="text" hidden name="itemList[3].type" value="' + rowInfo.type + '">分红礼金（元）</td>');
        if (rowInfo.status == 1) {
          row.push('<td><div class="input-group"><select class="form-control" name="itemList[3].status" style="width: 100px;"><option value="1" selected>开启</option><option value="0">关闭</option></select></div></td>');
        } else if (rowInfo.status == 0) {
          row.push('<td><div class="input-group"><select class="form-control" name="itemList[3].status" style="width: 100px;"><option value="1">开启</option><option value="0" selected>关闭</option></select></div></td>');
        }
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[3].v0Num" value="' + _(rowInfo.v0Num).formatDiv(10000) + '" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required></div></td>');
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[3].v1Num" value="' + _(rowInfo.v1Num).formatDiv(10000) + '" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required></div></td>');
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[3].v2Num" value="' + _(rowInfo.v2Num).formatDiv(10000) + '" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required></div></td>');
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[3].v3Num" value="' + _(rowInfo.v3Num).formatDiv(10000) + '" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required></div></td>');
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[3].v4Num" value="' + _(rowInfo.v4Num).formatDiv(10000) + '" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required></div></td>');
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[3].v5Num" value="' + _(rowInfo.v5Num).formatDiv(10000) + '" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required></div></td>');
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[3].v6Num" value="' + _(rowInfo.v6Num).formatDiv(10000) + '" data-parsley-range="[0, 9990000]" data-parsley-type="integer" required></div></td>');
        this.$('.js-we-divid').html(row.join(''))
      } else if (rowInfo.type == 5) {
        row.push('<td style="width: 150px;"><input type="text" hidden name="itemList[4].type" value="' + rowInfo.type + '">中奖加奖（百分比）</td>');
        if (rowInfo.status == 1) {
          row.push('<td><div class="input-group"><select class="form-control" name="itemList[4].status" style="width: 100px;"><option value="1" selected>开启</option><option value="0">关闭</option></select></div></td>');
        } else if (rowInfo.status == 0) {
          row.push('<td><div class="input-group"><select class="form-control" name="itemList[4].status" style="width: 100px;"><option value="1">开启</option><option value="0" selected>关闭</option></select></div></td>');
        }
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[4].v0Num" value="' + _(rowInfo.v0Num).formatDiv(10000) + '" data-parsley-range="[0, 100]" data-parsley-oneDecimal required><span class="input-group-addon">%</span></div></td>');
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[4].v1Num" value="' + _(rowInfo.v1Num).formatDiv(10000) + '" data-parsley-range="[0, 100]" data-parsley-oneDecimal required><span class="input-group-addon">%</span></div></td>');
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[4].v2Num" value="' + _(rowInfo.v2Num).formatDiv(10000) + '" data-parsley-range="[0, 100]" data-parsley-oneDecimal required><span class="input-group-addon">%</span></div></td>');
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[4].v3Num" value="' + _(rowInfo.v3Num).formatDiv(10000) + '" data-parsley-range="[0, 100]" data-parsley-oneDecimal required><span class="input-group-addon">%</span></div></td>');
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[4].v4Num" value="' + _(rowInfo.v4Num).formatDiv(10000) + '" data-parsley-range="[0, 100]" data-parsley-oneDecimal required><span class="input-group-addon">%</span></div></td>');
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[4].v5Num" value="' + _(rowInfo.v5Num).formatDiv(10000) + '" data-parsley-range="[0, 100]" data-parsley-oneDecimal required><span class="input-group-addon">%</span></div></td>');
        row.push('<td><div class="input-group"><input type="text" class="form-control" name="itemList[4].v6Num" value="' + _(rowInfo.v6Num).formatDiv(10000) + '" data-parsley-range="[0, 100]" data-parsley-oneDecimal required><span class="input-group-addon">%</span></div></td>');
        this.$('.js-we-award').html(row.join(''))
      }
    },
    getAddAwardTimeSet: function () {
      var checkedItems = this.$('.js-we-date').find('input[type=checkbox]');
      var startTimes = this.$('.js-time-start-time');
      var endTimes = this.$('.js-time-end-time');
      var addAwardArr = [];
      _(checkedItems).each(function(item,index){
        if($(item).prop('checked')){
          addAwardArr.push({
            week: $(item).val(),
            fromTime: $(startTimes[index]).val(),
            endTime:  $(endTimes[index]).val()
          })
        }
      });
      return addAwardArr;
    },

    formSubmitHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);
      $target.button('loading');
      var $currContainer = $('.js-we-form');
      var clpValidate = $currContainer.parsley().validate();
      var data = _($currContainer.serializeArray()).serializeObject();
      var addTime = this.getAddAwardTimeSet();
      data = _(data).extend({timeList:addTime});
      if (clpValidate) {
        Global.sync.ajax({
            url: '/intra/vipmanager/savewelfarecfg.json',
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
              Global.appRouter.navigate(_('#vip/we').addHrefArgs({_t: _.now()}), {
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
    formCancelHandler: function (e) {
      var self = this;
      Global.appRouter.navigate(_('#vip/we').addHrefArgs({_t: _.now()}), {
        trigger: true,
        replace: false
      });
    }

  });

  module.exports = VipLevelWelfareView;
});