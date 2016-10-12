"use strict";

var userManageConfig = require('./userManageConfig');

var SignedView = require('./../signed');

var UserManageView = Base.ItemView.extend({

  template: require('./userManage.html'),

  events: {
    'click .js-ac-modify': 'updateConfigHander',
    'click .js-ac-break-off': 'breakOffHandler',
    'click .js-search': 'getSubUser',
    'click .js-ac-see': 'seeConfigHander',
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
  // 表格填充
  initGrid: function (data) {
    console.log(data)
    var self = this;
    this.getSubUserListXhr(data).done(function (res) {
      console.log(res)
      if (res.result == 0) {
        if (self.grid) {
          console.log("destroy staticGrid")
          self.$grid.staticGrid("destroy");
        }
        self.userList = res.root.usbUserList;
        self.grid = self.$grid.staticGrid({
          colModel: [
            { label: '用户名', name: 'username', width: 120 },
            {
              label: '签约时间', name: 'agreeDate', width: 180, formatter: function (val) {
                return _(val).toTime();
              }
            },
            { label: '最近生效时间', name: 'effectDay', width: 125 },
            {
              label: '状态', name: 'status', width: 125, formatter: function (val) {
                if (val == 0) {
                  return '<span class="green">待确认</span>';
                }
                else if (val == 1) {
                  return '<span>已签约</span>';
                }
                else if (val == 2) {
                  return '<span class="red">未签约</span>';
                }

              }
            },
            {
              label: '操作', name: 'status', width: 195, formatter: function (val) {
                return userManageConfig.getZh(val);
              }
            }
          ],
          height: 434,
          row: self.userList,
          startOnLoading: false,
        }).staticGrid('instance');
      }else{

      }
      // var acctInfo = Global.memoryCache.get('acctInfo');
      // this.userGroupLevel = acctInfo.userGroupLevel;
      // if (this.userGroupLevel <= 1) {
      //   // self.$('.js-ac-modify').addClass('hidden');
      //   // self.$('.js-ac-break-off').addClass('hidden');
      // }
    });
  },
  onRender: function () {
    var self = this;
    this.$usedQuota = this.$('.js-ac-usedQuota');
    this.$leftQuota = this.$('.js-ac-leftQuota');
    this.$grid = this.$('.js-ac-user-grid');
    this.grid = null;
    this.$usedQuota.html(this._parentView.dividConf.quotaLimit - this._parentView.dividConf.quotaLeft);
    this.$leftQuota.html(this._parentView.dividConf.quotaLeft);
    this.initGrid({ pageSize: 100 });
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
