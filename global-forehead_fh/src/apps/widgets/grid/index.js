"use strict";

var slimscroll = require('jquery-slimscroll');

$.widget('gl.grid', {
  template: require('./index.html'),

  options: {
    checkable: true,
    chkAllId: 'chkAll',
    namespace: 'glGrid',
    tableClass: 'table table-bordered ',
    footerClass: '',
    height: 300,
    columnDefinitions: [],
    tip: '',
    emptyTip: '暂无数据',
    onRowItemClick: _.noop,
    onRowCheckboxClick: _.noop,
    onSelectAll: _.noop,
    onSort: _.noop,
    rowData: null,
    'showHead': true,
    divStyle: '',

    //pagination
    pageIndex: 0,
    pageSize: 10,
    maxPaginationNum: 6,
    totalSize: 0,
    onPaginationChange: _.noop
  },

  _create: function() {
    this.options.chkAllId = _.uniqueId('chk_');
    this.options.hasBorder = this.options.tableClass.indexOf('table-bordered') > -1;

    this._data = [];

    if (this.options.tip == 'juliencs') {
      this.options.tip = '';
      this.options.divStyle = 'marginlr20 tableNoBorder';
    }

    if (!this._formatColumnDefinitions()) {
      window.WemartApp.ui.notification.show('Table 列定义信息不足');
      return false;
    }

    var html = _(this.template).template()(_({
      loading: Global.ui.loader.get({
        wrapperClass: 'loader-container hidden'
      }),
      tip: this.options.tip,
      emptyTip: this.getEmptyHtml()
    }).extend(_(this.options).pick(
      'checkable',
      'chkAllId',
      'tableClass',
      'footerClass',
      'columnDefinitions',
      'hasBorder',
      'checkableWidth',
      'showHead',
      'divStyle'
    )));

    this.element.html(html);

    this.$bodyDiv = this.element.find('.js-wt-body-main');
    this.$body = this.$bodyDiv.find('tbody');

    this.$footerDiv = this.element.find('.js-wt-footer-main');
    this.$footerBody = this.$footerDiv.find('tbody');

    this.$tip = this.element.find('.js-wt-tip');
    this.$pagination = this.element.find('.js-wt-pagination');

    this.$emptyContainer = this.element.find('.js-wt-empty-container');

    if (this.options.height > 0) {
      this.$bodyDiv.slimScroll({
        height: this.options.height
      });
    }

    if (this.options.rowData) {
      this.refreshRowData(this.options.rowData);
    }

    this.$pagination.pagination(_.pick(this.options,
      'pageIndex',
      'pageSize',
      'maxPaginationNum',
      'onPaginationChange',
      'totalSize'
    ));

    this.pagination = this.$pagination.pagination('instance');

    this._bindEvents();
  },

  _bindEvents: function() {
    var events = {
      'click tbody>tr': this.clickRowHandler,
      'click .sortable-grid-col-header': this.sortGridHandler,
      'click .js-pf-select-all': this.selectAllHandler,
      'click .js-pf-inverse': this.inverseHandler
    };

    if (this.options.checkable) {
      _.extend(events, {
        'click .inbox-check': this.selectRowHandler
      });

      events['click #' + this.options.chkAllId] = this.selectAllRowHandler;
    }

    this._on(events);
  },

  _formatColumnDefinitions: function() {
    var definitions = this.options.columnDefinitions;
    if (!_.isArray(definitions)) {
      return false;
    }

    this.options.columnDefinitions =  _(definitions).map(function(define) {
      return ($.isPlainObject(define)) ? define : {name: define};
    });

    return true;
  },

  //common APIs

  refreshRowData: function(rows, totalSize, options) {
    var html = '',
      self = this;

    this.resetChkAll();

    if(_(rows).size()===0){
      this.renderEmpty();
    }

    if (_.isArray(rows)) {
      this._data = rows;
      _.each(rows, function(row) {
        html += self._getSingleRowEl(row);
      });
    }

    this.$body.html(html);

    //插入extRow
    this._addExtRows(rows);

    //this.element.find('.smart-grid .smart-grid-nodata').remove();

    //if (!html) {
    //  this.element.find('.smart-grid').append(this._getNoDataInfoEl());
    //}

    this.$tip.removeClass('hidden');
    this.pagination.update(totalSize, options.pageIndex, options);

    return this;
  },

  height: function(height) {
    this.$bodyDiv.nextAll('.slimScrollRail,.slimScrollBar').remove();

    this.$bodyDiv.slimScroll({
      destroy: true
    });

    this.$bodyDiv.slimScroll({
      height: height
    });
  },

  setPageSize: function(pageSize) {
    this.pagination.option('pageSize', Number(pageSize));
  },

  addRows: function(rows, toTopPosition) {

    var html = '',
      self = this;

    if (_.isArray(rows)) {
      _.each(rows, function(row) {
        html += self._getSingleRowEl(row, 'body');
      });
    } else {
      html = this._getSingleRowEl(rows, 'body');
    }

    if (toTopPosition) {
      this.$body.prepend(html);
      this._data.unshift(rows);
    } else {
      this.$body.append(html);
      this._data.push(rows);
    }

    return this;
  },

  addFooterRows: function(rows, toTopPosition) {
    var html = '',
      self = this;

    if (_.isArray(rows)) {
      _.each(rows, function(row) {
        html += self._getSingleRowEl(row, 'footer');
      });
    } else {
      html = this._getSingleRowEl(rows, 'footer');
    }

    if (toTopPosition) {
      this.$footerBody.prepend(html);
    } else {
      this.$footerBody.append(html);
    }

    return this;
  },

  addFooterRows2: function(rows) {
    $('.js-julien-floot').remove();
    if (rows.iIs == 1) {
      var html = '<table class="table table-bordered table-no-lr table-center js-julien-floot ' + rows.trClass + '" >';

      html += '<colgroup><col width="10%"><col width="10%"><col width="10%"><col width="10%"></colgroup>';
      html += '<tbody><tr class="tr-footer"><td class="brw"></td><td class="brw"></td><td><span>' + rows.columnEls[0] + '</span></td><td class="price">' + rows.columnEls[1] + '</td></tr></tbody></table>'

      this.$bodyDiv.append(html);
    }
    return this;
  },

  addFooterRows3: function(rows) {
    $('.js-julien-floot').remove();
    if (rows.iIs == 1) {
      var html = '<table class="table table-bordered table-no-lr table-center js-julien-floot ' + rows.trClass + '" >';

      html += '<colgroup><col width="15%"><col width="15%"><col width="15%"><col width="15%"><col width="15%"><col width="25%"></colgroup>';
      html += '<tbody><tr class="tr-footer"><td>' + rows.columnEls[0] + '</td><td class="price2">' + rows.columnEls[1] + '</td><td></td><td></td><td class="price">' + rows.columnEls[2] + '</td><td></td></tr></tbody></table>'

      this.$bodyDiv.append(html);
    }
    return this;
  },

  addFooterRows4: function(rows) {
    $('.js-julien-floot').remove();
    if (rows.iIs == 1) {
      var html = '<table class="table table-bordered table-no-lr table-center js-julien-floot ' + rows.trClass + '" >';

      html += '<colgroup><col><col width="12%"><col width="12%"><col width="15%"><col width="15%"><col width="6%"><col width="12%"><col width="12%"><col width="12%"></colgroup>';
      html += '<tbody><tr class="tr-footer"><td></td><td>' + rows.columnEls[0] + '</td><td></td><td></td><td></td><td></td><td class="price">' + rows.columnEls[1] + '</td><td></td><td></td></tr></tbody></table>'

      this.$bodyDiv.append(html);
    }
    return this;
  },

  _addExtRows: function(row) {
    var self = this;

    var $trs = this.element.find('tbody tr');

    $trs.each(function(index, tr) {
      if (row[index] && row[index].extRow) {
        var $extTr = $('<tr><td class="bg-grey no-padding" colspan="' + self.options.columnDefinitions.length + '"></td></tr>');
        $extTr.find('td').append(row[index].extRow);
        $(tr).after($extTr);
      }
    });
  },

  clean: function() {
    this.$body.empty();
    this.$footerBody.empty();

    this.$tip.addClass('hidden');
    // this.pagination.clean();

    return this;
  },

  resetChkAll: function() {
    this.element.find('#' + this.options.chkAllId ).prop('checked', false);
    return this;
  },

  getChk: function() {
    var chkData = {};
    var $trs = this.element.find('tbody tr.active');
    var ids;

    if ($trs.length) {
      ids = _($trs.find('.inbox-check')).map(function(checkbox) {
        return $(checkbox).attr('id');
      });
      chkData.ids = ids;
      chkData.$rows = $trs;
    }

    return chkData;
  },

  getSelectedRows: function() {
    var selectedRowsData = [],
      $selectedRows = this.element.find('.inbox-check:checked');
    $selectedRows.each(function() {
      var $container = $(this).closest('tr');
      selectedRowsData.push($container.data() || {});
    });

    return selectedRowsData;
  },

  getEmptyHtml: function() {
    var html = [];
    if (this.options.emptyTip) {
      html.push('<div class="js-wt-empty-container empty-container text-center hidden">');
      html.push('<div class="empty-container-main">');
      html.push('<div class="sfa-grid-empty"></div>');
      html.push(this.options.emptyTip);
      html.push('</div>');
      html.push('</div>');
    }

    return html.join('');
  },


  selectAll: function() {
    this._selectAll(true);
  },

  selectInverse: function() {
    this.element.find('.inbox-check').each(function(index, checkbox) {
      var $checkbox = $(checkbox);
      $checkbox.prop('checked', !$checkbox.prop('checked'));
    });
  },

  renderEmpty: function() {
    this.$emptyContainer.removeClass('hidden');

    return this;
  },

  hideEmpty: function() {
    this.$emptyContainer.addClass('hidden');

    return this;
  },

  showLoading: function() {
    this.element.find('.loader-container').removeClass('hidden');
    return this;
  },

  hideLoading: function() {
    this.element.find('.loader-container').addClass('hidden');
    return this;
  },

  getRowData: function($el) {
    var $row = $($el).closest('tr');
    return $row.data();
  },

  sortReset: function() {
    this.element.find('.sortable-grid-col-header i').filter('.fa-sort-asc, .fa-sort-desc').attr('class', 'fa fa-sort');

    return this;
  },

  getSingleRowHtml: function(data) {
    return this._getSingleRowEl(data);
  },

  /**
   * 私有方法
   * rowData:
   *   id (字符串，可选) 作为这一行的唯一标识符
   *   columnEls (数组，每个Item可以HTML字符串) 指定一行中，每一列具体要显示的样式
   *   dataAttr (对象) 绑定在`tr`元素上，便于其他操作对于数据的调用
   * example:
   * {
   *    id: 'checkbox-1',
   *    dataAttr: {
   *      name: 'test',
   *      no: 12
   *    },
   *    columnEls: ['test', '<div><p>line 1</p><p>line 2</p></div>', {
   *    colspan: 2,
   *    cell: 'test',
   *    }]
   *    collapse: false, //默认 false，展开
   *    extRow: ''
   *    }
   * }
   */

  _getSingleRowEl: function(rowData, rowType) {
    var html = [],
      id = rowData.id || _.uniqueId(this.options.namespace + 'chk'),
      columnEls = rowData.columnEls || [],
      dataAttr = rowData.dataAttr || {},
      i;

    html.push('<tr');

    if (rowData.trClass) {
      html.push(' class="' + rowData.trClass + '"');
    }

    _.each(dataAttr, function(value, key) {
      html.push(' data-' + _(key).toDataStyle() + '="' + _(value).escape() + '"');
    });

    html.push('>');

    if (this.options.checkable) {
      html.push('<td>');

      if (rowType !== 'footer') {
        html.push('<div class="custom-checkbox">');
        html.push('<input type="checkbox" id="' + id + '" class="inbox-check">');
        html.push('<label class="checkbox-label" for="' + id + '"></label>');
        html.push('</div>');
      }

      html.push('</td>');
    }

    _(columnEls).each(function(column) {
        if (_(column).isObject()) {
          html.push('<td colspan="' + (column.colspan || 1) + '">');
          html.push(column.content);
        } else {
          html.push('<td>');
          html.push(column);
        }
        html.push('</td>');
    });

    html.push('</tr>');

    return html.join('');
  },

  //event handlers

  clickRowHandler: function(e) {
    var $rowItem = $(e.currentTarget),
      data = $rowItem.data() || {};

    this.options.onRowItemClick(data);
  },

  selectRowHandler: function(e) {
    var $checkbox = $(e.currentTarget),
      $activeRow = $checkbox.parent().parent().parent();

    $activeRow.toggleClass('active');

    if (!$checkbox.prop('checked')) {
      this.element.find('#' + this.options.chkAllId ).prop('checked', false);
    }

    this.options.onRowCheckboxClick(e);

    e.stopPropagation();
  },

  selectAllRowHandler: function(e) {
    this._selectAll($(e.currentTarget).prop('checked'));
  },

  _selectAll: function(flag) {
    if (flag) {
      this.element.find('.inbox-check').prop('checked', true);
      this.element.find('.inbox-check').parent().parent().parent().addClass('active');
    } else {
      this.element.find('.inbox-check').prop('checked', false);
      this.element.find('.inbox-check').parent().parent().parent().removeClass('active');
    }

    this.options.onSelectAll();
  },

  sortGridHandler: function(e) {
    var $target = $(e.currentTarget);
    var $i = $target.find('.fa-sort');
    var iClass = $i.attr('class');

    this.sortReset();

    var sortDir = ((-1 === iClass.indexOf('fa-sort-desc')) ? 'desc' : 'asc');

    $i.attr('class', 'table-sort fa fa-sort fa-sort-' + sortDir);

    this.options.onSort(e, sortDir);
  },

  selectAllHandler: function() {
    this.selectAll();
  },

  inverseHandler: function() {
    this.selectInverse();
  }
});

module.exports = $.gl.grid;
