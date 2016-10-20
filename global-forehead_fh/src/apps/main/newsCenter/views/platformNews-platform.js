"use strict";

var FilterHelper = require('skeleton/misc/filterHelper');

var NewsSettingView = require('./platformNewsSetting');

var PlatformNewsPlatformView = Base.ItemView.extend({

  template: require('newsCenter/templates/platformNews-platform.html'),

  events: {
    'mouseover .js-nc-setting-dialog': 'inSettingHandler',
    'mouseout .js-nc-setting-dialog': 'outSettingHandler',
    'click .js-nc-setting-dialog': 'openSettingDialogHandler',
    'click .js-nc-read': 'readHandler',
    'click .js-nc-link': 'setReadHandler',
    'click .js-nc-del': 'deleteHandler'
  },

  deleteXhr: function(data) {
    return Global.sync.ajax({
      url: '/acct/usernotice/getnoticelist.json',
      tradition: true,
      data: {
        letterId: data
      }
    });
  },

  initialize: function() {
    _(this.options).extend({
      columns: [
        {
          width: '800px;'
        },
        {
          width: '200px;'
        }
      ],
      gridOps: {
        emptyTip: '没有消息'
      },
      tip: '<div class="custom-checkbox checkbox-small"> <input type="checkbox" id="<%=chkAllId %>" class="js-wt-select-all inbox-check"> <label for="<%=chkAllId %>"></label></div><span class="m-right-sm"><span class="js-pf-select-all cursor-pointer">全选</span> | ' +
      '<span class="js-pf-inverse cursor-pointer">反选</span></span>' +
      '<div class="btn-group"><button class="js-nc-read btn btn-xs text-amber full-radius">标记已读</button></div>' +
      '<div class="btn-group"><button class="js-nc-del btn btn-xs text-amber full-radius">删除选中</button></div>',
      ajaxOps: {
        url: '/acct/usernotice/getnoticelist.json'
      }
    });
  },

  onRender: function() {
    this.$grid = this.$('.js-nc-platform-grid');

    this.filterHelper = new FilterHelper();

    this.initGrid(this.$grid);

    this._getGridXhr();
  },

  initGrid: function($grid) {
    var self = this;
    $grid.grid({
      tableClass: 'table table-bottom-bordered no-margin',
      height: 470,
      checkable: true,
      checkableWidth: '40px',
      tip: this.options.tip,
      columnDefinitions: this.options.columns,
      //tip: this.options.tip,
      emptyTip: this.options.gridOps.emptyTip,
      onPaginationChange: function(index) {
        self.filterHelper.set('pageIndex', index);
        self._getGridXhr();
      }
    });

    this.grid = $grid.grid('instance');

    return this;
  },

  renderGrid: function(gridData) {
    var rowsData = _(gridData.noticeList).map(function(info, index, list) {
      return {
        id: info.noticeId,
        columnEls: this.formatRowData(info, index, list),
        dataAttr: info
      };
    }, this);

    if(gridData.noticeList && gridData.noticeList.length) {
      this.grid.hideEmpty();
    } else {
      this.grid.renderEmpty();
    }

    this.grid.refreshRowData(rowsData, gridData.rowCount, {
      pageIndex: this.filterHelper.get('pageIndex'),
      initPagination: false
    })
      .hideLoading();

    this.grid.$pagination.addClass('');
  },

  _getGridXhr: function() {
    var self = this;
    var filters = this.filterHelper.get();
    this.grid
      .clean()
      .showLoading();

    Global.sync.ajax({
      url: this.options.ajaxOps.url,
      data: _(filters).extend(this.options.reqData)
    })
      .fail(function(def, type) {
        if(type !== 'abort') {
          //Global.ui.notification.show('服务器异常，无法加载列表');
          self.grid.hideLoading();
        }
      })
      .done(function(res) {
        if(res && res.result === 0) {
          self.renderGrid(res.root, res);
          //Global.m.news.updateUnReadNum({unReadNotice:res.root.unReadNotice});
        }
      });

    return this;
  },

  formatRowData: function(rowInfo) {
    var row = [];

    //var textStyle = !rowInfo.isRead ? ' text-cool' : 'text-black';

    var title = [];

    title.push('<span>');

    switch(rowInfo.type) {
      case 0:
        if(rowInfo.isRead) {
          title.push('<i class="sfa sfa-mes-read font-md font-bold"></i><span class="np-message-des-read">' + rowInfo.title + '</span>');
        } else {
          title.push('<i class="sfa sfa-mes-unRead font-md font-bold"></i>' + rowInfo.title);
        }

        break;
      case 1:
        if(rowInfo.isRead) {
          title.push('<i class="sfa sfa-mes-read font-md font-bold"></i><span class="np-message-des-read">' + rowInfo.title + '</span>');
        } else {
          title.push('<i class="sfa sfa-mes-unRead font-md font-bold"></i>' + rowInfo.title);
        }

        break;
      case 2:
        if(rowInfo.isRead) {
          title.push('<i class="sfa sfa-mes-read font-md font-bold"></i><span class="np-message-des-read">' + rowInfo.title + '</span><a href="#as/ll" class="js-nc-link message-log-read router btn-link">登录日志</a>');
        } else {
          title.push('<i class="sfa sfa-mes-unRead font-md font-bold"></i><span>' + rowInfo.title + '</span><a href="#as/ll" class="js-nc-link message-log-unRead router btn-link">登录日志</a>');
        }

        break;
      default:
        title.push('<a href="nc/pn/detail/' + rowInfo.noticeId + '" class="js-nc-link router btn-link">' + rowInfo.title + '</a>');
    }

    title.push('</span>');

    /*row.push('<span class="sfa sfa-news-letter' + (!rowInfo.isRead ? '-active' : '') + '"></span>');*/

    row.push(title.join(''));

    row.push('<span class="pull-right">' + _(rowInfo.time).toTime() + '</span>');
    return row;
  },

  _setRead: function(idList) {
    var self = this;
    var model = Global.data.get('newsModel');
    var xhr = model.setReadNoticeXhr(idList);

    if(xhr) {
      xhr.done(function() {
        self._getGridXhr();
      });
    }
  },

  //event handlers

  readHandler: function(e) {
    var idList = this.grid.getChk().ids;

    if(_.isEmpty(idList)) {
      return false;
    }

    this._setRead(idList);
  },

  setReadHandler: function(e) {
    var $target = $(e.currentTarget);

    this._setRead([this.grid.getRowData($target).noticeId]);
  },

  deleteHandler: function(e) {
    var self = this;
    var idList = this.grid.getChk().ids;

    if(_.isEmpty(idList)) {
      return false;
    }

    var model = Global.data.get('newsModel');

    $(document).confirm({
      agreeCallback: function() {
        var xhr = model.deleteNoticeXhr(idList);

        if(xhr) {
          xhr.done(function() {
            self._getGridXhr();
          });
        }
      }
    });
  },
  inSettingHandler: function(e) {
    var $target = $(e.currentTarget);
    $target.find('.js-nc-setting-btn').addClass('fa-spin');
  },

  outSettingHandler: function(e) {
    var $target = $(e.currentTarget);
    $target.find('.js-nc-setting-btn').removeClass('fa-spin');
  },

  openSettingDialogHandler: function(e) {
    var self = this;
    var newsSettingView;

    // $('a[href="#jsNcPlatformSetting"]').click();
    // $('a[href="#jsNcPlatformSetting"]').closest('li').addClass('active').removeClass('hidden');
    // $('a[href="#jsNcPlatform"]').closest('li').removeClass('active').addClass('hidden');
    // return false;
    var $dialog = Global.ui.dialog.show({
      title: '定义通知类型',
      size: 'modal-lg',
      body: '<div class="js-nc-news-setting"></div>',
      bodyClass: 'no-padding',
      footer: '<div class="text-center control-confirm-special ">' +
      '<button type="button" class="js-nc-confirm btn btn-left " data-loading-text="保存中">保存</button>' +
      '</div>'
    });

    var $container = $dialog.find('.js-nc-news-setting');

    $dialog.on('hidden.modal', function() {
      $(this).remove();
      newsSettingView.destroy();
    });

    newsSettingView = new NewsSettingView({
      el: $container
      //functionId: this.model.get('functionId'),
      //ticketId: this.model.get('ticketId')
    }).render();

    $dialog.on('click', '.js-nc-confirm', function(e) {
      var $target = $(e.currentTarget);

      $target.button('loading');
      newsSettingView.saveSettingHandler()
        .always(function() {
          $target.button('reset');
        })
        .done(function(res) {
            if(res.result === 0) {
              Global.ui.notification.show('通知设置保存成功', {
                type: 'success'
              });
              $dialog.modal('hide');
            } else {
              Global.ui.notification.show('通知设置保存失败');
            }
          }
        );
    });

  }

});

module.exports = PlatformNewsPlatformView;
