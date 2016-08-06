define(function(require, exports, module) {
  require('prefab/views/searchGrid');


  var InjectBonusView = Base.Prefab.SearchGrid.extend({

    template: require('text!betCenter/templates/species-TicketList-mmcSpecifyUser.html'),

    events: {
      'click .js-bc-show': 'showSpecifyHandler',
      'click .js-bc-del': 'delSpecifyHandler'
    },

    initialize: function() {
      _(this.options).extend({
        columns: [
          {
            name: '交易流水号',
            width: '10%'
          },
          {
            name: '用户名',
            width: '10%'
          },
          {
            name: '获奖时间',
            width: '10%'
          },
          {
            name: '获得金额',
            width: '10%'
          },
          {
            name: '奖项',
            width: '10%'
          },
          {
            name: '是否执行',
            width: '10%'
          },
          {
            name: '操作',
            width: '10%'
          },

        ],
        gridOps: {
          emptyTip: '无记录'
        },
        ajaxOps: {
          url: '/intra/ticketmng/specifyuserlist.json'
        }
      });
    },
    onRender: function() {
      var self = this;
      Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
    },
    renderGrid: function(gridData) {
      var rowsData = _(gridData.dataList).map(function(dataInfo, index) {
        return {
          columnEls: this.formatRowData(dataInfo, index),
          dataAttr: dataInfo
        };
      }, this);

      this.grid.refreshRowData(rowsData, gridData.rowCount, {
          pageIndex: this.filterHelper.get('pageIndex'),
          initPagination: true
        })
        .hideLoading();
    },

    showSpecifyXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/ticketmng/specifyuserdetail.json',
        data: data
      });
    },

    formatRowData: function(rowInfo) {
      var row = [];

      row.push(rowInfo.tradeNo);
      row.push(rowInfo.userName);
      row.push(_(rowInfo.getTime).toTime());
      if(rowInfo.bonus == null){
        row.push('');
      }else{
        row.push(_(rowInfo.bonus).convert2yuan());
      }

      var bonusName;
      if(rowInfo.type == 1){
        bonusName = '皇冠奖池';
      }else if(rowInfo.type == 2){
        bonusName = '钻石奖池';
      }else if(rowInfo.type == 3){
        bonusName = '黄金奖池';
      }else if(rowInfo.type == 4){
        bonusName = '金蛋奖池';
      }
      row.push(bonusName);

      if(rowInfo.status == 1){
        status = '否';
      }else if(rowInfo.status == 2){
        status = '是';
      }
      row.push(status);
      row.push(this._formatOperation(rowInfo));
      return row;
    },

    _formatOperation: function (rowInfo) {
      var cell = [];
      ////if(Global.authority.uc && Global.authority.uc.ul && Global.authority.uc.ul.detail) {
      //  cell.push('<a href="' + _.getUrl('/detail/' + rowInfo.userId, {'name': rowInfo.username,'rightTag': '1'}) + '" class="router btn btn-link">详情</a>');
      ////}

      //if (Global.authority.mc && Global.authority.mc.nw && Global.authority.mc.nw.view) {
        cell.push('<button data-type="' + rowInfo.id + '" class="js-bc-show btn btn-link">查看</button>');
      //}
      //if (Global.authority.mc && Global.authority.mc.nw && Global.authority.mc.nw.edit) {
        var params = rowInfo.id+"_"+rowInfo.userName;
        cell.push('<button  type="delete" data-type="' + params + '" class="js-bc-del btn btn-link">删除</button>');
      //}
      return cell.join('');
    },

    //删除指定记录
    delSpecifyHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);
      $target.button('loading');
      var params = $target.data("type").split("_");
      id = params[0];

      if (id) {

        var self = this;
        var $dialog = Global.ui.dialog.show(
          {
            title: '提示',
            body: '<div class="text-center" ><p>确认删除'+params[1]+'的奖励？</p></div>',
            footer: '<button class="js-bc-delSpecify-confirm btn btn-primary" style="width: 100px;margin-right: 20px;" type="button">确定</button><button style="width: 100px;" class="btn" data-dismiss="modal">取消</button>'
          }
        );
        $target.button('reset');

        $dialog.on('hidden.bs.modal', function () {
          $(this).remove();
        });

        $dialog.off('click.deleteRecord')
          .on('click.deleteRecord', '.js-bc-delSpecify-confirm', function (ev) {
            var $target = $(ev.currentTarget);
            $target.button('loading');
            Global.sync.ajax({
                url: '/intra/ticketmng/delspecifyuser.json',
                data: {id: id}
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
                  self._getGridXhr();
                  $dialog.modal('hide');
                } else {
                  Global.ui.notification.show('操作失败。');
                }
              });
          });
      }else{
        $target.button('reset');
      }
    },

    //查看指定详情
    showSpecifyHandler: function (e) {
      var $target = $(e.currentTarget);
      var id = $target.data("type");
      this.showSpecifyXhr({id: id}).done(function (res) {
        if (res && res.result === 0) {
          var html = '<div><div class="pull-left"><strong>' + _(res.root.createTime).toTime() + '</strong></div><div class="pull-right"><strong>' + res.root.userName + '</strong></div><br><div class="panel panel-default no-m-bottom" style="margin-top: 20px;">';
          html += '<div class="panel-body  no-m-bottom "><p>' + res.root.remark + '</p></div></div></div>';
          var $dialog = Global.ui.dialog.show(
            {
              title: '操作日志',
              body: '<div>' + html + '</div>',
              footer: ''
            }
          );

          $dialog.on('hidden.bs.modal', function () {
            $(this).remove();
          });
        }
      })
    },

  });
  module.exports = InjectBonusView;
});