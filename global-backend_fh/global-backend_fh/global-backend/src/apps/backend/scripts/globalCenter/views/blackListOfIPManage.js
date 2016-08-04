define(function (require, exports, module) {
  var NewBlackIpView = require('globalCenter/views/newBlackIp');
  require('prefab/views/searchGrid');
  var BlackListOfIPManageView = Base.Prefab.SearchGrid.extend({

    template: require('text!globalCenter/templates/blackListOfIPManage.html'),

    events: {
      'click .js-bl-del': 'delIpHandler',
      'click .js-bl-add-ip': 'newBlackIpHandler'
    },

    initialize: function () {
      _(this.options).extend({
        title: 'IP黑名单管理',
        columns: [
          {
            name: 'IP',
            width: '6%'
          },
          {
            name: '分类',
            width: '10%'
          },
          {
            name: '操作人',
            width: '6%'
          },
          {
            name: '增加时间',
            width: '6%'
          },
          {
            name: '操作',
            width: '6%'
          }
        ],
        gridOps: {
          emptyTip: '无记录'
        },
        ajaxOps: {
          url: '/intra/ipblacklist/getipblacklist.json'
        }
      });
    },
    onRender: function () {

      Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
      //判断是否已根据操作人查询
      this.creater = 0;
    },

    renderGrid: function (gridData) {
      var rowsData = _(gridData.ipList).map(function (word, index) {
        return {
          columnEls: this.formatRowData(word, index),
          dataAttr: word
        };
      }, this);

      this.grid.refreshRowData(rowsData, gridData.rowCount, {
        pageIndex: this.filterHelper.get('pageIndex'),
        initPagination: true
      })
          .hideLoading();
      var userData = _(gridData.manager).map(function (sUser) {
        return '<option value="' + sUser.creater + '">' + sUser.createrName + '</option>';
      });
      if (this.creater === 0) {
        self.$('.js-bl-creator').html('<option value="">全部</option>' + userData.join(''));
        this.creater = 1;
      }
    },

    formatRowData: function (rowInfo) {
      var row = [];

      row.push(rowInfo.ip);

      if (rowInfo.type) {
        if (rowInfo.type == 1) {
          row.push("恶意攻击");
        }
        if (rowInfo.type == 2) {
          row.push("恶意举报");
        }
      }
      row.push(rowInfo.createrName);
      row.push(_(rowInfo.createTime).toTime());

      row.push(this._formatOperation(rowInfo));

      return row;
    },

    _formatOperation: function (rowInfo) {
      var cell = [];
      cell.push('<button  type="edit" data-type="' + rowInfo.ipblackId + '" class="js-bl-del btn btn-link">删除</button>');
      return cell.join('');
    },

    delIpHandler: function (e) {
      var self=this;
      var $target = $(e.currentTarget);
      var id = this.$('.js-bl-del').data("type");
      var html = '<p>确定删除？</p>';
      var $dialog = Global.ui.dialog.show(
        {
          title: '提示',
          body: '<div class="js-bl-deleteRecord-container text-center"><p>确认删除此记录？</p><div class="js-bl-deleteRecordNotice"></div></div>',
          footer: '<button class="js-bl-deleteRecord-confirm btn btn-primary" style="width: 100px;margin-right: 20px;" type="button">确定</button><button style="width: 100px;" class="btn" data-dismiss="modal">取消</button>'
        }
      );

      $dialog.on('hidden.bs.modal', function () {
        $(this).remove();
      });

      $dialog.off('click.deleteRecord')
        .on('click.deleteRecord', '.js-bl-deleteRecord-confirm', function (ev) {
          var $target = $(ev.currentTarget);
          $target.button('loading');
          if (id) {
            Global.sync.ajax({
              url: '/intra/ipblacklist/delip.json',
              data: {ipId: id}
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
                  $dialog.modal('hide');
                  self._getGridXhr();
                } else {
                  Global.ui.notification.show('操作失败。');
                }
              });
          }
        });
    },
    //增加IP黑名单
    newBlackIpHandler: function (e) {
      var self = this;

      var $target = $(e.currentTarget);
      var $dialog = Global.ui.dialog.show(
          {
            title: '增加IP黑名单',
            body: '<div class="js-bl-new-blackIp"></div>',
            footer: '<button class="js-bl-newIp-confirm btn btn-primary" style="width: 100px;margin-right: 20px;" type="commit" data-loading-text="保存中">确定</button><button style="width: 100px;" class="btn" data-dismiss="modal">取消</button>'
          }
      );

      var $selectContainer = $dialog.find('.js-bl-new-blackIp');

      var newBlackIpView = new NewBlackIpView();
      $selectContainer.html(newBlackIpView.render().el);

      $dialog.on('hidden.bs.modal', function (e) {
        $(this).remove();
        newBlackIpView.destroy();
      });

      $dialog.off('click.newWord')
          .on('click.newWord', '.js-bl-newIp-confirm', function (ev) {
            var $target2 = $(ev.currentTarget);
          if(!$dialog.find('.js-bl-tip').hasClass('hidden')){
            //window.confirm('请输入有效的用户名！');
            alert('请输入有效的IP！');
            return  false;
          }
            var clpValidate = $dialog.find('.js-bl-ip-form').parsley().validate();
            if (clpValidate) {
              $target2.button('loading');
              //var checkType =  _.map(_.range($dialog.find('.js-bl-type:checked').length), function(num){
              //  return $dialog.find('.js-bl-type:checked').eq(num).val();
              //}).join(',');
              Global.sync.ajax({
                url: '/intra/ipblacklist/saveblackip.json',
                data: {
                  Ip: $dialog.find('.js-bl-title').val(),
                  type: $dialog.find('.js-bl-type:checked').val()
                },
                tradition: true


              })
                  .always(function () {
                    $target2.button('reset');
                  })
                  .fail(function () {
                    // 处理失败
                  })
                  .done(function (res) {
                    if (res && res.result === 0) {
                      $dialog.find('.js-bl-title').val('');
                      Global.ui.notification.show('操作成功。');
                      self._getGridXhr();
                     // $dialog.modal('hide');
                    } else {
                      Global.ui.notification.show('操作失败。');
                    }
                  });
            }
          });

    }
  });

  module.exports = BlackListOfIPManageView;
});