"use strict";

var slimscroll = require('jquery-slimscroll');

$.widget('gl.staticGrid', {

  template: require('./index.html'),

  options: {
    tableClass: 'table table-bordered ',
    height: 0,
    emptyTip: '暂无数据',
    colModel: [],
    row: [],
    url: '',
    showHeader: true,
    initRemote: true,
    startOnLoading: true,
    abort: true,
    data: {},
    dataProp: 'root'
  },

  _create: function(gridOps) {
    this.options = gridOps ? _(this.options).extend(gridOps) : this.options;
    this.options.hasBorder = this.options.tableClass.indexOf('table-bordered') > -1;

    this.element.html(_(this.template).template()(_({
      loading: Global.ui.loader.get({
        wrapperClass: 'js-wt-loader-container hidden'
      }),
      emptyTip: this.getEmptyHtml()
    }).extend(_(this.options).pick(
      'tableClass',
      'colModel',
      'showHeader',
      'hasBorder',
      'wrapperClass'
    ))));

    this.$bodyDiv = this.element.find('.js-wt-body-main');
    this.$tbody = this.element.find('.js-wt-tbody');
    this.$footerDiv = this.element.find('.js-wt-footer-main');
    this.$footerBody = this.$footerDiv.find('tbody');
    this.$loaderContainer = this.element.find('.js-wt-loader-container');
    this.$emptyContainer = this.element.find('.js-wt-empty-container');

    if (this.options.height > 0) {
      this.$bodyDiv.slimScroll({
        height: this.options.height
      });
    }

    if (this.options.url && this.options.initRemote) {
      this.getDataXhr();
    } else if (_.isEmpty(this.options.row)) {
      if (this.options.startOnLoading) {
        this.renderLoading();
      } else {
        this.renderEmpty();
      }
    } else {
      this.renderRow(this.options.row);
    }
  },

  //common APIs

  scrollBottom: function() {
    this.$bodyDiv.slimScroll({
      scrollTo: this.$tbody.height()
    });
  },

  update: function() {
    this.getDataXhr();
  },

  getDataXhr: function() {
    var self = this;

    this.clean()
      .renderLoading();

    Global.sync.ajax({
      url: this.options.url,
      abort: this.options.abort,
      data: this.options.data
    })
      .always(function() {
        self.hideLoading();
      })
      .fail(function(xhr, type) {
        if (type !== 'abort') {
          self.renderFail();
        }
      })
      .done(function(res) {
        if (res && res.result === 0) {
          self.currentData = _(self.options.dataProp.split('.')).reduce(function(res, prop) {
            var data = res[prop];
            if (!data) {
              data = [];
            }
            return data;
          }, res);
          self.renderRow(self.currentData);
          self.element.trigger('update:done', res.root, res);
        } else {
          self.renderFail();
        }
      });
  },

  formatRow: function(rows) {
    var html = [];
    var formatRows = [];

    if (_.isArray(rows)) {
      formatRows = _.map(rows, function(row, index, data) {
        return this.formatRowData(row, index, data);
      }, this);

      
      if (formatRows.length) {
        _(formatRows).each(function(info, index) {
          html.push('<tr class="js-gl-static-tr"');
          _.each(rows[index], function(value, key) {
            html.push(' data-' + _(key).toDataStyle() + '="' + _(value).escape() + '"');
          });
          html.push('>');
          _(info).each(function(cell) {
            html.push(cell);
          });

          html.push('</tr>');
        });
      }
    } else {
      html.push('<tr class="js-gl-static-tr ' + rows.trClass + '">');
      _(rows.columnEls).each(function(cell) {
        html.push('<td>' + cell + '</td>');
      });
      html.push('</tr>');
    }


    return html.join('');
  },

  formatRowData: function(row, index, data) {
    var self = this;
    //合并行
    _(self.options.colModel).each(function(colInfo) {
      if (colInfo.merge) {
        _(data).reduceRight(function(repeat, info) {
          if (!_(repeat.val).isUndefined() && info[colInfo.name] === repeat.val) {
            ++repeat.num;
          } else {
            repeat.val = info[colInfo.name];
            repeat.num = 0;
          }
          info[colInfo.name + 'Rowspan'] = repeat.num + 1;

          return repeat;
        }, {
          val: null,
          num: 0
        });
      }
    });

    return _(self.options.colModel).reduce(function(formatRow, colInfo) {
      var cell = [];
      var cellContent = '';

      if (colInfo.merge && index > 0 && row[colInfo.name] === data[index - 1][colInfo.name]) {

      } else {
        cell.push('<td  rowspan="' + (row[colInfo.name + 'Rowspan'] || 1) + '">');

        cellContent = colInfo.formatter ? colInfo.formatter(row[colInfo.name], index, row) :
          (row[colInfo.name] || row[colInfo.name]==0)  ? row[colInfo.name] : '';

        cell.push(cellContent);

        cell.push('</td>');
      }

      formatRow.push(cell.join(''));

      return formatRow;
    }, []);
  },

  getRowData: function($el) {
    var $row = $($el).closest('tr');
    return $row.data();
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

  //common APIs

  height: function() {
    return this.element.find('table').height();
  },

  clean: function() {
    this.$tbody.empty();
    this.$footerBody.empty();

    return this;
  },

  addRows: function(rows, options) {
    options = options || {};
    var $rows = $(this.formatRow(rows));

    this.hideLoading();
    this.hideEmpty();

    if (_.isUndefined(options.prepend)) {
      this.$tbody.append($rows);
    } else {
      this.$tbody.prepend($rows);
    }
    return $rows;
  },

  addFooterRows: function(rows, options) {
    options = options || {};

    var $rows = $(this.formatRow(rows));

    this.hideLoading();
    this.hideEmpty();

    if (_.isUndefined(options.prepend)) {
      this.$footerBody.append($rows);
    } else {
      this.$footerBody.prepend($rows);
    }
    return $rows;
  },

  delRow: function(index) {
    this.$tbody.find('.js-gl-static-tr').eq(index).remove();
  },

  renderRow: function(row) {
    var $rows = $();

    if (row.length) {
      this.hideLoading();
      this.hideEmpty();

      $rows = $(this.formatRow(row));
      this.$tbody.html($rows);
    } else {
      this.$tbody.empty();
      this.renderEmpty();
    }

    return $rows;
  },

  reformat: function(gridOps) {
    if (this.currentData) {
      if (gridOps) {
        this._create(_(gridOps).extend({
          initRemote: false,
          row: this.currentData
        }));
      }
      // this.renderRow();
    }
  },

  renderEmpty: function() {
    this.$emptyContainer.removeClass('hidden');

    return this;
  },

  hideEmpty: function() {
    this.$emptyContainer.addClass('hidden');

    return this;
  },

  renderLoading: function() {
    this.$loaderContainer.removeClass('hidden');
    return this;
  },

  hideLoading: function() {
    this.$loaderContainer.addClass('hidden');
    return this;
  },

  renderFail: function() {
    this.hideEmpty();
    this.$tbody.html('<tr><td class="text-center" colspan="' + this.options.colModel.length + '">加载数据失败</td></tr>');
  }
});

module.exports = $.gl.staticGrid;
