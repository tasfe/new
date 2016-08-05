define(function(require, exports, module) {

  $.widget('gl.staticGrid', {

    options: {
      namespace: 'staticGrid',
      tableClass: 'table table-bordered ',
      colModel: [],
      row: [],
      url: '',
      emptyTip: '暂无数据',
      checkable: false,
      chkAllId: 'chkAll',
      dataProp: 'root',
      onRowCheckboxClick: _.noop,
      onSelectAll: _.noop
    },

    _create: function() {
      var self = this;

      var html = [];

      if (this.element.is('table')) {
        this.element.addClass(this.options.tableClass);
      } else {
        html.push('<table class="' + this.options.tableClass + '">');
      }

      html.push('<colgroup>');

      if (this.options.checkable) {
        html.push('<col>');
      }

      _(this.options.colModel).each(function(headInfo) {
        html.push('<col width="' + (headInfo.width || '') + '">');
      });
      html.push('</colgroup>');

      html.push('<thead>');
      html.push('<tr>');

      if (this.options.checkable) {
        html.push('<th class="text-center">');
        html.push('<div class="custom-checkbox checkbox-small">');
        html.push('<input type="checkbox" id="' + this.options.chkAllId + '">');
        html.push('<label for="' + this.options.chkAllId + '"></label>');
        html.push('</div>');
        html.push('</th>');
      }

      _(this.options.colModel).each(function(headInfo) {
        html.push('<th>' + headInfo.label + '</th>');
      });

      html.push('</tr>');
      html.push('</thead>');

      html.push('<tbody class="js-wt-tbody"  style=" height: 148px;overflow:scroll">');

      html.push('</tbody>');

      if (!this.element.is('table')) {
        html.push('</table>');
      }

      this.element.html(html.join(' '));

      this.$tbody = this.element.find('.js-wt-tbody');

      if (this.options.url) {
        this.renderLoading();

        Global.sync.ajax({
          url: this.options.url,
          data: this.options.data
        })
          .fail(function() {
            self.renderFail();
          })
          .done(function(res) {
            if (res && res.result === 0) {
              self.renderRow(_(self.options.dataProp.split('.')).reduce(function(res, prop) {
                var data = res[prop];
                if (!data) {
                  data = [];
                }
                return data;
              }, res));
              self.element.trigger('update:done', res.root, res);
            } else {
              self.renderFail();
            }
          })
      } else if (_.isEmpty(this.options.row)) {
        this.renderEmpty();
      } else {
        this.renderRow(this.options.row);
      }

      this._bindEvents();
    },

    _bindEvents: function() {
      var events = {
      };

      if (this.options.checkable) {
        _.extend(events, {
          'click .inbox-check': this.selectRowHandler
        });

        events['click #' + this.options.chkAllId] = this.selectAllRowHandler;
      }

      this._on(events);
    },

    formatRow: function(data) {
      var html = [];

      row = this.formatData(data);

      if (row.length) {

        _(row).each(function(info, index) {

          html.push('<tr class="js-gl-static-tr ' + data[index].trClass + '">');

          if (this.options.checkable) {
            var id = data[index].id || _.uniqueId(this.options.namespace + 'chk');
            html.push('<td class="text-center">');
            html.push('<div class="custom-checkbox checkbox-small">');
            html.push('<input type="checkbox" id="' + id + '" class="inbox-check">');
            html.push('<label class="checkbox-label" for="' + id + '"></label>');
            html.push('</div>');
            html.push('</td>');
          }

          _(info).each(function(cell) {
            html.push(cell);
          });

          html.push('</tr>');
        }, this);
      } else {
        html.push(this.getEmptyHtml());
      }

      return html.join(' ');
    },

    addRows: function(rows, options) {
      options = options || {};
      var $rows = $(this.formatRow(rows));

      if (options.eq) {
        var $tr = this.$tbody.find('tr').eq(options.eq);
        $tr.length ? $tr.after($rows) : this.$tbody.prepend($rows);
        return $rows;
      }
      if (_.isUndefined(options.prepend)) {
        this.$tbody.append($rows);
      } else {
        this.$tbody.prepend($rows);
      }
      return $rows;
    },

    delRow: function(el) {
      $(el).closest('tr').remove();
    },

    formatData: function(data) {
      var self = this;

      return _(data).map(function(info, index, data) {

        //合并行
        _(self.options.colModel).each(function(colInfo, index) {
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

        return _(self.options.colModel).reduce(function(row, colInfo) {
          var cell = [];
          var cellContent = '';
          //if (!_.isUndefined(info[colInfo.name])) {
          if (info.rowType === 'string') {
            cell.push('<td>' + info[colInfo.name] + '</td>');
          } else {
            if (colInfo.merge && index > 0 && info[colInfo.name] === data[index - 1][colInfo.name]) {

            } else {
              cell.push('<td rowspan="' + (info[colInfo.name + 'Rowspan'] || 1) + '">');

              cellContent = colInfo.formatter ? colInfo.formatter(info[colInfo.name], info) :
                (info[colInfo.name] || info[colInfo.name]==0)  ? info[colInfo.name] : '';

              cell.push(cellContent);

              cell.push('</td>');
            }
          }

          //}

          row.push(cell.join(''));

          return row;
        }, []);
      });
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

    getEmptyHtml: function() {
      if (this.options.emptyTip) {
        return '<tr><td class="text-center" colspan="' + this.options.colModel.length + '">' + this.options.emptyTip + '</td></tr>';
      } else {
        return '';
      }
    },

    renderRow: function(row) {
      this.$tbody.html(this.formatRow(row));
    },

    renderEmpty: function() {
      this.$tbody.html(this.getEmptyHtml());
    },

    renderLoading: function() {
      this.$tbody.push('<tr><td class="text-center" colspan="' + this.options.colModel.length + '">加载中...</td></tr>');
    },

    renderFail: function() {
      this.$tbody.html('<tr><td class="text-center" colspan="' + this.options.colModel.length + '">加载数据失败</td></tr>');
    },

    //event handlers

    selectAllRowHandler: function(e) {
      if ($(e.currentTarget).prop('checked')) {
        this.element.find('.inbox-check').prop('checked', true);
        this.element.find('.inbox-check').parent().parent().parent().addClass('active');
      } else {
        this.element.find('.inbox-check').prop('checked', false);
        this.element.find('.inbox-check').parent().parent().parent().removeClass('active');
      }

      this.options.onSelectAll(e);
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
    }
  });

  module.exports = $.gl.staticGrid;
});
