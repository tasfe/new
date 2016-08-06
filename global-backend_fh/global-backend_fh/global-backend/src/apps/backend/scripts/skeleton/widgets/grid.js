define(function(require, exports, module) {

  $.widget('gl.grid', {

    template: _.template('<div class="smart-grid table-responsive">' +
      '<table class="table table-bordered <%=tableClass %>">' +
      '<colgroup>' +
      '<% if (checkable) { %>' +
      '<col>' +
      '<% } %>' +
      '<% _.each(columnDefinitions, function(columnDefinition) { %>' +
      '<col width="<%=columnDefinition.width || "" %>">' +
      '<% }) %>' +
      '</colgroup>' +
      '<thead>' +
      '<tr>' +
      '<% if (checkable) { %>' +
      '<th class="text-center">' +
      '<div class="custom-checkbox checkbox-small">' +
      '<input type="checkbox" id="<%=chkAllId %>">' +
      '<label for="<%=chkAllId %>"></label>' +
      '</div>' +
      '</th>' +
      '<% } %>' +
      '<% _.each(columnDefinitions, function(columnDefinition) { %>' +
      '<th data-id="<%=columnDefinition.id || "" %>">'+
      '<% if(columnDefinition.sortable) { %>' +
      '<a href="javascript:void(0);" class="btn-sm no-padding sortable-grid-col-header">' +
      '<%=columnDefinition.name %><i class="js-wt-sort fa <%=columnDefinition.sortable.defaultDir ? ("fa-sort-" + columnDefinition.sortable.defaultDir) : "fa-sort" %>"></i>' +
      '</a>' +
      '<% } else { %>' +
      '<%=columnDefinition.name %>' +
      '<% } %>' +
      '</th>' +
      '<% }); %>' +
      '</tr>' +
      '</thead>' +
      '<tbody>' +
      '</tbody>' +
      '</table>' +
      '<div class="loader-container">' +
      '<div class="loader spinner4">' +
      '<div class="dot1"></div>' +
      '<div class="dot2"></div>' +
      '<div class="bounce1"></div>' +
      '<div class="bounce2"></div>' +
      '<div class="bounce3"></div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<div class="js-wt-pagination"></div>'),

    options: {
      checkable: true,
      chkAllId: 'chkAll',
      namespace: 'glGrid',
      tableClass: '',
      columnDefinitions: [],
      emptyTip: '无记录',
      onRowItemClick: _.noop,
      onRowCheckboxClick: _.noop,
      onSelectAll: _.noop,
      onSort: _.noop,
      rowData: null,

      //pagination
      pagination: true,
      pageIndex: 0,
      pageSize: 10,
      maxPaginationNum: 6,
      totalSize: 0,
      onPaginationChange: _.noop
    },

    _create: function() {
      this.options.chkAllId = _.uniqueId('chk_');

      this._data = [];

      if (!this._formatColumnDefinitions()) {
        window.WemartApp.ui.notification.show('Table 列定义信息不足');
        return false;
      }

      var html = this.template({
        checkable: this.options.checkable,
        chkAllId: this.options.chkAllId,
        tableClass: this.options.tableClass,
        columnDefinitions: this.options.columnDefinitions
      });

      this.element.html(html);

      if (this.options.rowData) {
        this.refreshRowData(this.options.rowData);
      }

      if (this.options.pagination) {
        this.$pagination = this.element.find('.js-wt-pagination');

        this.$pagination.pagination(_.pick(this.options,
            'pageIndex',
            'pageSize',
            'maxPaginationNum',
            'onPaginationChange',
            'totalSize'
        ));
        this.pagination = this.$pagination.pagination('instance');
      }

      this._bindEvents();
    },

    _bindEvents: function() {
      var events = {
        'click tbody>tr': this.clickRowHandler,
        'click .sortable-grid-col-header': this.sortGridHandler
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

      this.options.columnDefinitions =  _.map(definitions, function(define) {
        return ($.isPlainObject(define)) ? define : {name: define};
      });

      return true;
    },

    //common APIs

    refreshRowData: function(rows, totalSize, options) {
      var html = '',
        self = this;

      if (_.isArray(rows)) {
        this._data = rows;
        _.each(rows, function(row) {
          html += self._getSingleRowEl(row);
        });
      }

      this.element.find('tbody').html(html);

      //插入extRow
      this._addExtRows(rows);

      this.element.find('.smart-grid .smart-grid-nodata').remove();
      if (!html) {
        this.element.find('.smart-grid').append(this._getNoDataInfoEl());
      }

      if (this.options.pagination) {
        this.pagination.update(totalSize, options.pageIndex, options);
      }

      return this;
    },


    setPageSize: function(pageSize) {
      this.option('pageSize', pageSize);
      this.pagination.option('pageSize', Number(pageSize));
    },

    addRows: function(rows, toTopPosition) {

      var html = '',
        self = this;

      if (_.isArray(rows)) {
        _.each(rows, function(row) {
          html += self._getSingleRowEl(row);
        });
      } else {
        html = this._getSingleRowEl(rows);
      }

      if (toTopPosition) {
        this.element.find('tbody').prepend(html);
        this._data.unshift(rows);
      } else {
        this.element.find('tbody').append(html);
        this._data.push(rows);
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
      this.element.find('tbody').empty();
      this.element.find('.smart-grid .smart-grid-nodata').remove();

      if (this.options.pagination) {
        this.pagination.clean();
      }
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

    showLoading: function() {
      this.element.find('.loader-container').removeClass('hide');
      return this;
    },

    getRowData: function($el) {
      var $row = $($el).closest('tr');
      return $row.data();
    },

    hideLoading: function(callback) {
      this.element.find('.loader-container').addClass('hide');
      if(callback && _.isFunction(callback)) {
        callback();
      }
      return this;
    },

    sortReset: function() {
      this.element.find('.sortable-grid-col-header .js-wt-sort').filter('.fa-sort-asc, .fa-sort-desc')
        .attr('class', 'js-wt-sort fa fa-sort');

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

    _getSingleRowEl: function(rowData) {
      var html = [],
        id = rowData.id || _.uniqueId(this.options.namespace + 'chk'),
        columnEls = rowData.columnEls || [],
        dataAttr = rowData.dataAttr || {},
        needCheck = rowData.needCheck,
        i;

      html.push('<tr');

      if (rowData.trClass) {
        html.push(' class="' + rowData.trClass + '"');
      }

      _.each(dataAttr, function(value, key) {
        html.push(' data-' + key + '="' + value + '"');
      });

      html.push('>');

      if (this.options.checkable) {
        if(_(needCheck).isBoolean()) {
          if (needCheck) {
            html.push('<td class="text-center">');
            html.push('<div class="custom-checkbox checkbox-small">');
            html.push('<input type="checkbox" id="' + id + '" class="inbox-check">');
            html.push('<label class="checkbox-label" for="' + id + '"></label>');
            html.push('</div>');
            html.push('</td>');
          } else {
            html.push('<td class="text-center">');
            html.push('</td>');
          }
        }else{
          html.push('<td class="text-center">');
          html.push('<div class="custom-checkbox checkbox-small">');
          html.push('<input type="checkbox" id="' + id + '" class="inbox-check">');
          html.push('<label class="checkbox-label" for="' + id + '"></label>');
          html.push('</div>');
          html.push('</td>');
        }

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

    _getNoDataInfoEl: function() {
      var html = [];
      html.push('<div class="smart-grid-nodata alert alert-warning alert-custom alert-dismissible" role="alert">');
      html.push('<button type="button" class="close" data-dismiss="alert"></button>');
      html.push('<i class="fa fa-exclamation-circle m-right-xs"></i> ' + this.options.emptyTip + '</div>');

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
      if ($(e.currentTarget).prop('checked')) {
        this.element.find('.inbox-check').prop('checked', true);
        this.element.find('.inbox-check').closest('tr').addClass('active');
      } else {
        this.element.find('.inbox-check').prop('checked', false);
        this.element.find('.inbox-check').closest('tr').removeClass('active');
      }

      this.options.onSelectAll(e);
    },

    sortGridHandler: function(e) {
      var $target = $(e.currentTarget);
      $i = $target.find('.js-wt-sort');
      var iClass = $i.attr('class');

      this.sortReset();

      var sortDir = ((-1 === iClass.indexOf('fa-sort-desc')) ? 'desc' : 'asc');

      $i.attr('class', 'js-wt-sort fa fa-sort-' + sortDir);

      this.options.onSort(e, sortDir);
    }
  });

  module.exports = $.gl.grid;

});
