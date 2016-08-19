"use strict";

var SearchGrid = require('com/searchGrid');

var userManageConfig = require('./userManageConfig');

var SignedView = require('./../signed');

var UserManageView = SearchGrid.extend({

  template: require('./userManage.html'),

  events: {
    'click .js-ac-modify': 'modifyHandler',
    'click .js-ac-break-off': 'breakOffHandler',
    'click .js-select-content': 'selectContent',
    'click .js-select-log': 'selectLog'
  },

  initialize: function() {
    _(this.options).extend({
      columns: [
        {
          name: '账号',
          width: '10%'
        },
        {
          name: '协议内容',
          width: '10%'
        },
        {
          name: '签约时间',
          width: '10%'
        },
        {
          name: '协议生效时间',
          width: '10%'
        },
        {
          name: '签约日志',
          width: '10%'
        },
        {
          name: '操作',
          width: '20%'
        }
      ],
      gridOps: {
        emptyTip: '没有信息'
      },
      ajaxOps: {
        url: '/fund/divid/sublist.json'
      },
      height: 290
    });
  },

  selectLog: function (e) {
    var self = this;
    var $target = $(e.currentTarget);

    var $dialog = Global.ui.dialog.show({
      title: '签约日志',
      body: '<div class="js-select-log-html margin20-0"></div>',
      size: 'modal-lg-julien',
      footer: ''
    });

    this.signInfo($target.parent().parent().data('user-id'))
    .done(function(res) {
      if (res && res.result === 0) {
        var strContent = '<div class="julien-title"></div>';
        strContent += '<div class="julien-div-table-title">';
        strContent += '<table class="table table-bordered table-no-lr table-center no-margin"><colgroup><col width="50%"><col width="50%"></colgroup><thead><tr><th>操作</th><th>时间</th></tr></thead></table>';
        strContent += '</div>';

        strContent += '<table class="table table-center no-margin julien-table-content"><colgroup><col width="50%"><col width="50%"></colgroup>';

        for (var i = 0; i < res.root.length; i++) {
          var statusName = '';
          if (res.root[i].status == 1) {
            statusName = '申请签约';
          }
          if (res.root[i].status == 2) {
            statusName = '签约成功';
          }
          if (res.root[i].status == 3) {
            statusName = '签约失败';
          }
          if (res.root[i].status == 4) {
            statusName = '修改签约';
          }
          if (res.root[i].status == 5) {
            statusName = '签约修改成功';
          }
          if (res.root[i].status == 6) {
            statusName = '签约修改失败';
          }
          if (res.root[i].status == 7) {
            statusName = '申请解约';
          }
          if (res.root[i].status == 8) {
            statusName = '解约成功';
          }
          if (res.root[i].status == 9) {
            statusName = '解约失败';
          }
          strContent += '<thead><tr><td>' + statusName + '</td><td>' + _(res.root[i].createTime).toTime() + '</td></tr></thead>';
        }
        strContent += '</table>';
        
        $('.js-select-log-html').html(strContent);
      } else {
        Global.ui.notification.show(res.msg || '');
      }
    });
  },

  selectContent: function (e) {
    var self = this;
    var $target = $(e.currentTarget);
    
    
    var strContent = '<div class="julien-title">下级：' + $target.parent().parent().data('username') + ' 自愿达成以下分红协议</div>';
    strContent += '<div class="julien-div-table-title">';
    strContent += '<table class="table table-bordered table-no-lr table-center no-margin"><colgroup><col width="50%"><col width="50%"></colgroup><thead><tr><th>半月销量</th><th>分红比例</th></tr></thead></table>';
    strContent += '</div>';

    strContent += '<table class="table table-center no-margin julien-table-content"><colgroup><col width="50%"><col width="50%"></colgroup>';
    
    var data = $target.data('content').split(' ');
    var obj = {};
    for (var i = 0; i < data.length - 1; i++) {
      obj = eval('(' + data[i] + ')');
      strContent += '<thead><tr><td>' + obj.betTotal/10000 + '</td><td>' + obj.divid/100 + '%</td></tr></thead>';
    }
    strContent += '</table>';

    var $dialog = Global.ui.dialog.show({
      title: '协议内容',
      body: strContent,
      size: 'modal-lg-julien',
      footer: ''
    });
  },

  breakOffXhr: function(data) {
    return Global.sync.ajax({
      url: '/fund/divid/sublist.json',
      data: data
    });
  },

  signInfo: function(userId) {
    return Global.sync.ajax({
      url: '/fund/divid/signinfo.json',
      data: {
        userId:userId
      }
    });
  },

  onRender: function() {
    SearchGrid.prototype.onRender.apply(this, arguments);
  },

  renderGrid: function(gridData) {
    $('.js-ac-leftQuota').text(gridData.leftQuota);
    $('.js-ac-usedQuota').text(gridData.usedQuota);

    var rowsData = _(gridData.usbUserList).map(function(info, index, list) {
      return {
        id: info.dividId,
        columnEls: this.formatRowData(info, index, list),
        dataAttr: info
      };
    }, this);

    this.grid.refreshRowData(rowsData, gridData.rowCount, {
      pageIndex: this.filterHelper.get('pageIndex'),
      initPagination: false
    }).hideLoading();
  },

  formatRowData: function(rowInfo) {


    var row = [];

    var strItemList = '';

    for (var i = 0; i < rowInfo.itemList.length; i++) {
      strItemList += '{betTotal:"' + rowInfo.itemList[i].betTotal + '",divid:"' + rowInfo.itemList[0].divid + '"} ';
    }

    row.push(rowInfo.username);
    row.push('<span class="a js-select-content" data-content=\'' + strItemList + '\'>查看协议内容</span>');
    row.push(_(rowInfo.agreeDate).toTime());
    row.push(_(rowInfo.agreeDate).toDate());
    row.push('<span class="a js-select-log">查看签约日志</span>');

    if (rowInfo.status == 1) {
      row.push('<span class="dm-table-update js-ac-add-user"  data-content=\'' + strItemList + '\'>修改协议</span> <span class="js-ac-break-off dm-table-off">申请解约</span>');
    }
    else if (rowInfo.status == 0) {
      row.push('<span class="dm-table-no">等待下级同意签约</span>');
    }

    return row;
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
      '<p>请说明原因：</p><textarea class="js-ac-remark julien-remark" required maxlength="200"></textarea>' +
      '<div class="controls control-confirm text-center">' +
      '<button class="js-ac-break-confirm julien-button2">确定</button>' +
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
