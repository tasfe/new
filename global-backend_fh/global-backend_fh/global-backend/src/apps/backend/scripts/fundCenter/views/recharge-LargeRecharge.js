define(function (require, exports, module) {

  require('prefab/views/searchGrid');

  var AddOrEditUserView = require('fundCenter/views/recharge-LargeRecharge-addOrEditUser');


  var chargeListView = Base.Prefab.SearchGrid.extend({

    template: require('text!fundCenter/templates/recharge-LargeRecharge.html'),

    events: {
      'click .js-fc-recharge-largeRechargeUser-add': 'addLargeReUserHandler',
      'click .js-fc-largeRecharge-edit': 'editLargeReUserHandler',
      'click .js-fc-largeRecharge-delete': 'deleteLargeReUserHandler'
    },

    initialize: function () {
      _(this.options).extend({
        columns: [
          {
            name: '用户名',
            width: '7%'
          },
          {
            name: '有效期',
            width: '27%'
          },
          {
            name: '加入时间',
            width: '14%'
          },
          {
            name: '加入原因',
            width: '25%'
          },
          {
            name: '加入人',
            width: '7%'
          },
          {
            name: '状态',
            width: '8%'
          },
          {
            name: '操作',
            width: '12%'
          }
        ],
        gridOps: {
          emptyTip: '无记录'
        },
        ajaxOps: {
          url: '/intra/largeusermanage/list.json'
        }
      });
    },
    //添加人列表
    getCheckUserListXhr: function(){
      return Global.sync.ajax({
        url: '/intra/largeusermanage/checkerlist.json'
      });
    },

    addLargeRechargeUserXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/largeusermanage/add.json',
        data: data
      })
    }
    ,
    editLargeRechargeUserXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/largeusermanage/update.json',
        data: data
      })
    },
    deleteLargeRechargeUserXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/largeusermanage/del.json',
        data: data
      })
    }
    ,
    addLargeReUserHandler: function (e) {
      this.popLargeRechargeUserEditModel('add');
    }
    ,
    editLargeReUserHandler: function (e) {
      var largeUserId = $(e.currentTarget).data('type');
      this.popLargeRechargeUserEditModel('edit', largeUserId);
    }
    ,
    //todo 删除。。。
    deleteLargeReUserHandler: function (e) {
      var id = $(e.currentTarget).data('type');
      var data = {largeUserId: id};
      var self = this;
      var html = '<p>确定删除用户？</p>';
      var $dialog = Global.ui.dialog.show(
        {
          title: '提示',
          body: '<div class="js-fc-recharge-addUser-container"><p>确认删除此记录？</p><div class="js-fc-lrDeleteNotice"></div></div>',
          footer: '<button class="js-fc-lrDeleteRecord-confirm btn btn-primary" type="button">确定</button><button class="btn" data-dismiss="modal">取消</button>'
        }
      );

      $dialog.on('hidden.bs.modal', function () {
        $(this).remove();
      });

      $dialog.off('click.deleteRecord')
        .on('click.deleteRecord', '.js-fc-lrDeleteRecord-confirm', function (ev) {
          var $target = $(ev.currentTarget);
          $target.button('loading');
          self.deleteLargeRechargeUserXhr(data).always(function () {
            $target.button('reset');
          }).fail(function () {
          }).done(function (res) {
            if (res.result === 0) {
              Global.ui.notification.show("操作成功。");
              $dialog.modal('hide');
              self._getGridXhr();
            } else {
              Global.ui.notification.show("操作失败。");
              //self.insertNotice($dialog.find('.js-fc-lrDeleteNotice'), '服务器未响应，删除失败！');
            }

          });

        });

    }
    ,
    popLargeRechargeUserEditModel: function (type, largeUserId) {
      var self = this;
      var title;
      if (type === 'edit') {
        title = '编辑用户'
      } else {
        {
          title = '增加用户'
        }
      }
      var $dialog = Global.ui.dialog.show(
        {
          title: title,
          body: '<div class="js-fc-recharge-addUser-container"></div>',
          footer: ''
        }
      );
      var data = {
        type: type,
        largeUserId: largeUserId
      };


      var $addUserContainer = $dialog.find('.js-fc-recharge-addUser-container');

      var addOrEditUserView = new AddOrEditUserView(data);
      $addUserContainer.html(addOrEditUserView.render().el);

      $dialog.on('hidden.bs.modal', function () {
        $(this).remove();
      });

      $dialog.off('click.saveInfo')
        .on('click.saveInfo', '.js-fc-recharge-saveUser', function (ev) {
          var $target = $(ev.currentTarget);
          if(!$dialog.find('.js-fc-lr-tip').hasClass('hidden')){
            //window.confirm('请输入有效的用户名！');
            alert('请输入有效的用户名！');
            return  false;
          }
          $target.button('loading');
          var $currContainer = $dialog.find('.js-fc-largeRecharge-aoe-form');
          var clpValidate = $currContainer.parsley().validate();
          if (!clpValidate) {
            $target.button('reset');
            return false;
          }
          var $saveButton = $(ev.currentTarget);
          var type = $saveButton.data('type');
          if (type === 'edit') {
            self.editLargeUserInfo($dialog, $target,largeUserId);
          } else if (type === 'add') {
            self.addLargeUserInfo($dialog, $target);
          }
        });
    }
    ,
    editLargeUserInfo: function ($dialog, $target,largeUserId) {
      var self = this;
      var $notice = $dialog.find('.js-fc-lrAddOrEdit-notice');
      var data = {
        largeUserId: largeUserId,
        startTime: $dialog.find('.js-start-time').val(),
        endTime: $dialog.find('.js-end-time').val(),
        reason: $dialog.find('.js-fc-largeRecharge-reason').val()
      };
      this.editLargeRechargeUserXhr(data).always(function () {
        $target.button('reset');
      }).fail(function () {
      }).done(function (res) {
        if (res.result === 0) {
          $dialog.modal('hide');
          Global.ui.notification.show('操作成功。');
          self._getGridXhr();
        }
        else
          Global.ui.notification.show('操作失败。');
      });
    }
    ,
    addLargeUserInfo: function ($dialog, $target) {
      var $notice = $dialog.find('.js-fc-lrAddOrEdit-notice');
      var self = this;
      var data = {
        username: $dialog.find('.js-fc-largeRecharge-username').val(),
        startTime: $dialog.find('.js-start-time').val(),
        endTime: $dialog.find('.js-end-time').val(),
        reason: $dialog.find('.js-fc-largeRecharge-reason').val()
      };
      this.addLargeRechargeUserXhr(data).always(function () {
        $target.button('reset');
      }).fail(function () {
      }).done(function (res) {
        if (res.result === 0) {
          //$dialog.modal('hide');
          Global.ui.notification.show('操作成功。');
          self._getGridXhr();
          $dialog.find('.js-fc-largeRecharge-aoe-form').reset();
        }
        else
          Global.ui.notification.show('操作失败。');
      });

    },
    onRender: function () {
      var self = this;
      this.getCheckUserListXhr().fail(function(){
      }).done(function(res){
        if(res.result===0){
          var optionData = _(res.root.userList||[]).map(function(user){
            return {
              value: user.userId,
              text: user.username
            }
          });
          self.renderSelect(optionData,self.$('.js-fc-re-lr-operatorId'));
        }else{
          Global.ui.notification.show('操作失败。');
        }
      });
      Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
    }
    ,
    renderSelect:function(data,$select){
      var options = [];
      _(data).each(function(item){
        var option = '<option value="'+item.value+'">'+item.text+'</option>';
        options.push(option);
      });
      $select.append(options.join(''));
    },
    renderGrid: function (gridData) {
      var rowsData = _(gridData.userList).map(function (user, index, userList) {
        return {
          id: user.id,
          columnEls: this.formatRowData(user, index, userList),
          dataAttr: user
        };
      }, this);

      this.grid.refreshRowData(rowsData, gridData.rowCount, {
        pageIndex: this.filterHelper.get('pageIndex'),
        initPagination: true
      }).hideLoading();

    }
    ,

    formatRowData: function (user) {
      var row = [];

      row.push(user.userName);
      row.push(_(user.startTime).toTime() + ' - ' + _(user.endTime).toTime());
      row.push(_(user.createTime).toTime());
      row.push(user.reason);
      row.push(user.operator);
      //var status;
      //switch (user.status) {
      //  case 1:
      //    status = '未开始';
      //    break;
      //  case 2 :
      //    status = '进行中';
      //    break;
      //  case 3 :
      //    status = '已过期';
      //    break;
      //  case 4 :
      //    status = '已删除';
      //    break;
      //}
      row.push(user.status);
      var operate = '';
      if (Global.authority.fc && Global.authority.fc.lr && Global.authority.fc.lr.edit) {
        if(user.status != '已删除' &&　user.status != '已过期'){
          operate += '<input type="button" data-type="' + user.largeUserId + '" class="js-fc-largeRecharge-edit btn btn-link" value="编辑" >&nbsp;';
        }
      }
      if (Global.authority.fc && Global.authority.fc.lr && Global.authority.fc.lr.del) {
        if(user.status != '已删除' && user.status != '已过期') {
          operate += '<input type="button" data-type="' + user.largeUserId + '" class="js-fc-largeRecharge-delete btn btn-link" value="删除">';
        }
      }
      row.push(operate);

      return row;
    },
    insertNotice: function ($container, html) {
      $container.html(this._getErrorMsg(html));
    },
    //组装错误提示框
    _getErrorMsg: function (text) {
      return '<div class="alert alert-danger alert-dismissible" role="alert">' +
        '<button type="button" class="close" data-dismiss="alert">' +
        '<span aria-hidden="true">×</span>' +
        '</button>' +
        '<i class="fa fa-times-circle m-right-xs"></i>' +
        '<strong>提示！</strong> ' + text +
        '</div>';
    }
  });

  module.exports = chargeListView;
});