"use strict";

var userManageConfig = require('./userManageConfig');

var SignedView = require('./../signed');

var UserManageView = Base.ItemView.extend({

  template: require('./userManage.html'),

  events: {
    'click .js-ac-modify': 'modifyHandler',
    'click .js-ac-break-off': 'breakOffHandler'
  },

  breakOffXhr: function(data) {
    return Global.sync.ajax({
      url: '/fund/divid/cancel.json',
      data: data
    });
  },

  onRender: function() {
    var self = this;

    this.$usedQuota = this.$('.js-ac-usedQuota');
    this.$leftQuota = this.$('.js-ac-leftQuota');
    this.$grid = this.$('.js-ac-user-grid');

    this.grid = this.$grid.staticGrid({
      tableClass: 'table table-bordered table-center',
      colModel: [
        {label: '用户名', name: 'username', width: 120},
        {label: '分红比例', name: 'divid', width: 100, formatter: function(val, index, info) {
          var cell = _(val).formatDiv(100) + '%<button class="js-ac-modify btn btn-link btn-link-cool" ';
          if (_([0, 3, 4]).contains(info.status)) {
            cell += 'disabled';
          }
          cell += '>修改</button>';
          return cell;
        }},
        {label: '签约时间', name: 'agreeDate', width: 180, formatter: function(val) {
          return _(val).toTime();
        }},
        {label: '协议生效日期', name: 'effectDay', width: 125},
        {label: '协议内容', name: 'agreement', width: 125, formatter: function(val) {
          return '<button class="js-ac-check btn btn-link btn-link-cool" data-content="' + val + '">点击查看</button>';
        }},
        {label: '操作', name: 'status', width: 195,  formatter: function(val) {
          return userManageConfig.getZh(val);
        }}
      ],
      height: 400,
      url: '/fund/divid/sublist.json',
      dataProp: 'root.usbUserList',
      pageSize: 100
    })
      .on('update:done', function(e, data) {
        self.$usedQuota.text(data.usedQuota);
        self.$leftQuota.text(data.leftQuota);

        $(this).find('.js-ac-check').each(function(index, check) {
          $(check).popover({
            title: '协议内容',
            trigger: 'click',
            html: true,
            container: '.js-gl-main',
            content: '<div class="js-pf-popover">'+ data.usbUserList[index].agreement + '</div>',
            placement: 'top'
          });
        });
      })
      .staticGrid('instance');
  },

  //event handlers

  modifyHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);
    var data = this.grid.getRowData($target);

    var $dialog = Global.ui.dialog.show({
      title: '修改签约分红',
      body: '<div class="js-ac-add-container"></div>',
      size: 'modal-lg',
      footer: ''
    });

    var $container = $dialog.find('.js-ac-add-container');

    var signedView = new SignedView({
      el: $container,
      dividConf: this._parentView.dividConf,
      userData: data
    })
      .render()
      .on('hide', function() {
        self.$grid.staticGrid('update');
        $dialog.modal('hide');
      });

    $dialog.on('hidden.modal', function() {
      $(this).remove();
      signedView.destroy();
    });
  },

  breakOffHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);
    var data = this.grid.getRowData($target);

    var $dialog = Global.ui.dialog.show({
      title: '提示',
      body: '<form class="js-ac-break-off ac-break-off no-margin" action="javascript:void(0)">' +
      '<p class="js-ac-detail text-bold-pleasant">您确定要解约与' + data.username + '的分红关系？' +
      '请确保您的余额可以完成本次分红，否则会解约失败。</p><div class="dot-divider dot-divider-md"></div>' +
      '<p>请说明原因：</p><textarea class="js-ac-remark" required maxlength="200"></textarea>' +
      '<div class="controls control-confirm text-center">' +
      '<button class="js-ac-break-confirm btn btn-pleasant">确定</button>' +
      '</div>' +
      '</form>',
      footer: ''
    });

    var $remark = $dialog.find('.js-ac-remark');
    var $btnConfirm = $dialog.find('.js-ac-break-confirm');

    $dialog.find('.js-ac-break-off').parsley();

    $dialog.on('hidden.modal', function() {
      $(this).remove();
    });

    $dialog.on('submit', '.js-ac-break-off', function(e) {
      var $target = $(e.currentTarget);

      $btnConfirm.button('loading');

      self.breakOffXhr({
        userId: data.userId,
        remark: _($remark.val()).escape()
      })
        .always(function() {
          $btnConfirm.button('reset');
        })
        .done(function(res) {
          if (res && res.result === 0) {
            Global.ui.notification.show('操作成功！等待审核。');
            self.$grid.staticGrid('update');
            $dialog.modal('hide');
          } else {
            Global.ui.notification.show(res.msg || '');
          }
        });
    });
  }
});

module.exports = UserManageView;
