"use strict";

var userManageConfig = require('./userManageConfig');

var SignedView = require('./../signed');

var SearchGrid = require('com/searchGrid');

var UserManageView = SearchGrid.extend({

  template: require('./userManage.html'),

  events: {
    'click .js-ac-modify': 'updateConfigHander',
    'click .js-ac-break-off': 'breakOffHandler',
    'click .js-search': 'getSubUser',
    'click .js-ac-dm-um-agreement': 'seeConfigHander',
  },

  initialize: function() {
    _(this.options).extend({
      columns: [
        {
          name: '账号',
          width: '11%'
        },
        {
          name: '协议内容',
          width: '11%'
        },
        {
          name: '签约时间',
          width: '13%'
        },
        {
          name: '协议生效时间',
          width: '13%'
        },
        {
          name: '签约日志',
          width: '8%'
        },
        {
          name: '操作',
          width: '10%'
        }
      ],
      gridOps: {
        emptyTip: '没有记录'
      },
      ajaxOps: {
        url: '/fund/divid/sublist.json'
      },
      listProp: 'root.dividList',
      headTip: '<div class="table-head-tip"><span class="ac-dm-sm-notice">温馨提示：</span>您还剩余可签约名额 <span class="js-ac-leftQuota ">0</span> 个，已签约用户：<span class="js-ac-usedQuota ">0</span> 个</div>',
      height: 310
    });
  },

  breakOffXhr: function (data) {
    return Global.sync.ajax({
      url: '/fund/divid/cancel.json',
      data: data
    });
  },

  getDividConfXhr: function (data) {
    return Global.sync.ajax({
      url: '/fund/divid/info.json',///fund/divid/info1.json
      data: data
    });
  },

  getSubUserListXhr: function (data) {
    return Global.sync.ajax({
      url: '/fund/divid/sublist.json',
      data: data
    });
  },
  //签约、修改
  signAgreementXhr: function (data) {
    return Global.sync.ajax({
      url: '/fund/divid/sign.json',
      data: data,
      tradition: true
    });
  },
  //搜索
  getSubUser: function () {
    var username = this.$(".username").val();
    var status = Number(this.$(".status").val());
    this.initGrid({ 'userName': username, 'status': status, pageSize: 100 })
  },

  onRender: function () {
    var self = this;
    this.$usedQuota = this.$('.js-ac-usedQuota');
    this.$leftQuota = this.$('.js-ac-leftQuota');
    this.$grid = this.$('.js-ac-user-grid');
    this.grid = null;
    this.$usedQuota.html(this._parentView.dividConf.quotaLimit - this._parentView.dividConf.quotaLeft);
    this.$leftQuota.html(this._parentView.dividConf.quotaLeft);
    // this.initGrid({ pageSize: 100 });
    SearchGrid.prototype.onRender.apply(this, arguments);
  },

  renderGrid: function(gridData) {
    this.userList = gridData.subUserList;
    var rowsData = _(gridData.subUserList).map(function(info, index, list) {
      return {
        id: info.dividId,
        columnEls: this.formatRowData(info, index, list),
        dataAttr: info
      };
    }, this);

    this.grid.refreshRowData(rowsData, gridData.rowCount, {
      pageIndex: this.filterHelper.get('pageIndex'),
      initPagination: false
    });
    this.grid.hideLoading();
  },

  formatRowData: function(rowInfo) {
    var row = [];

    row.push(rowInfo.username);
    var see = '<button class="js-ac-dm-um-agreement btn btn-link btn-link-hot">点击查看</button>';
    if (rowInfo.status == 2) {
      see =   '<span class="red">未签约</span>';
    }
    row.push(see);
    row.push(_(rowInfo.agreeDate).toTime());
    row.push(rowInfo.effectDay);
    // var status = '';
    // if (rowInfo.status == 0) {
    //   status =  '<span class="green">待确认</span>';
    // }
    // else if (rowInfo.status == 1) {
    //   status =   '<span>已签约</span>';
    // }
    // else if (rowInfo.status == 2) {
    //   status =   '<span class="red">未签约</span>';
    // }
    // row.push(status);

    var log = '<button class="js-ac-dm-um-log btn btn-link btn-link-hot">点击查看</button>';
    if (rowInfo.status == 2) {
      log =   '<span class="red">未签约</span>';
    }
    row.push(log);
    row.push(userManageConfig.getZh(rowInfo.status));
    return row;
  },

  // 查看签约
  seeConfigHander: function (e) {
    var self = this;
    var $target = $(e.currentTarget);
    var $tr = $target.closest('tr');
    var userId = $tr.data('userId');
    var userList = _(self.userList).find(function (item) {
      return item.userId === userId;
    });
    var username = $tr.data('username');
    var config = userList.itemList;
    //格式化
    config = _(config).map(function (item) {
      return {
        betTotal: _(item.betTotal).convert2yuan({ fixed: 0 }),
        divid: _(item.divid).formatDiv(100, { fixed: 0 })
      }});
    var $dialog = Global.ui.dialog.show({
      title: '查看签约',
      body: '<div class="js-ac-add-container"></div>',
      modalClass: 'ten',
      size: 'modal',
      footer: ''
    }).on('hidden.modal', function () {
      self.getSubUser();
      $(this).remove()
    });
    var $container = $dialog.find('.js-ac-add-container');
    console.log('查看签约');
    console.log(config);
    $container.staticGrid({
      colModel: [
        {
          label: '日量标准', name: 'betTotal', width: 120
        },
        {
          label: '分红标准', name: 'divid', width: 180, formatter: function (val) {
                return val+'%';
              }
        },
      ],
      height: 300,
      row: config,
      startOnLoading: false,
    }).staticGrid('instance');
  },
  //event handlers
  updateConfigHander: function (e) {
    var self = this;
    var $target = $(e.currentTarget);
    var $tr = $target.closest('tr');
    var userId = $tr.data('userId');
    //var agreeId =  $tr.data('agreeId');

    var userList = _(self.userList).find(function (item) {
      return item.userId === userId;
    });
    var username = $tr.data('username');

    var config = userList.itemList;
    //格式化
    config = _(config).map(function (item) {
      return {
        betTotal: _(item.betTotal).convert2yuan({ fixed: 0 }),
        divid: _(item.divid).formatDiv(100, { fixed: 0 })
      }


    });
    var $dialog = Global.ui.dialog.show({
      title: '设置下级账号：<span style="color:#f1c112">' + username + '</span>的签约分红',
      body: '<div class="js-ac-add-container"></div>',
      modalClass: 'ten',
      size: 'modal-lg',
      footer: ''
    }).on('hidden.modal', function () {
      self.getSubUser();
      //self.$grid.staticGrid('update');
      // self.render();
      $(this).remove()
    });

    var $container = $dialog.find('.js-ac-add-container');

    var signedView = new SignedView({
      el: $container,
      agreementList: config,
      username: username
    })
      .render()
      .on('hide', function () {
        $dialog.modal('hide');
      });

    $dialog.on('hidden.modal', function () {
      $(this).remove();
      signedView.destroy();
    });
    $dialog.find('.js-ac-next').on('click', function () {
      var conf = signedView.getConfigDataFormTable();

      if (conf) {
        var VL = conf.itemList
        console.log(VL)
        // 如果大于一条数据就判断
        if (VL.length > 1) {
          for (var i = 0; i < VL.length - 1; i++) {
            if (Number(VL[i + 1].betTotal) <= Number(VL[i].betTotal) || Number(VL[i + 1].divid) <= Number(VL[i].divid)) {
              console.log("同一列的填写数值，第二行必须大于第一行")
              return Global.ui.notification.show('同一列的填写数值，第二行必须大于第一行！');
            }
          }
        }
        self.signAgreementXhr(conf).done(function (res) {
          if (res.result == 0) {
            Global.ui.notification.show('操作成功！');
            $dialog.modal('hide');
          } else {
            Global.ui.notification.show('操作失败！' + res.msg);
          }
        }).fail(function (res) {
          Global.ui.notification.show('请求失败！');
        });
      }
    });
  },

  breakOffHandler: function (e) {
    var self = this;
    var $target = $(e.currentTarget);
    var data = this.grid.getRowData($target);

    var $dialog = Global.ui.dialog.show({
      title: '提示',
      body: '<form class="js-ac-break-off ac-break-off no-margin" action="javascript:void(0)">' +
      '<p class="js-ac-detail text-bold-hot">您确定要解约与' + data.username + '的分红关系？' +
      '请确保您的余额可以完成本次分红，否则会解约失败。</p><div class="dot-divider dot-divider-md"></div>' +
      '<p>请说明原因：</p><textarea class="js-ac-remark" required maxlength="200"></textarea>' +
      '<div class="text-center m-TB-sm">' +
      '<button class="js-ac-break-confirm btn btn-hot btn-lg">确定</button>' +
      '</div>' +
      '</form>',
      footer: ''
    });

    var $remark = $dialog.find('.js-ac-remark');
    var $btnConfirm = $dialog.find('.js-ac-break-confirm');

    $dialog.find('.js-ac-break-off').parsley();

    $dialog.on('hidden.modal', function () {
      self.render();
      $(this).remove();
    });

    $dialog.on('submit', '.js-ac-break-off', function (e) {
      var $target = $(e.currentTarget);

      $btnConfirm.button('loading');

      self.breakOffXhr({
        userId: data.userId,
        remark: _($remark.val()).escape()
      })
        .always(function () {
          $btnConfirm.button('reset');
        })
        .done(function (res) {
          if (res && res.result === 0) {
            Global.ui.notification.show('操作成功！等待审核。');
            self.getSubUser();
            // self.$grid.staticGrid('update');
            $dialog.modal('hide');
          } else {
            Global.ui.notification.show(res.msg || '');
          }
        });
    });
  }
});

module.exports = UserManageView;
