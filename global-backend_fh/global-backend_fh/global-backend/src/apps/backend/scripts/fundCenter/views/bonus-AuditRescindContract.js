define(function (require, exports, module) {

  require('prefab/views/searchGrid');


  var DividendAuditView = require('fundCenter/views/bonus-AuditRescindContract-Audit');
  var fundStatusConfig = require('fundCenter/misc/fundStateTDConfig');

  var operateCheckView = Base.Prefab.SearchGrid.extend({

    template: require('text!fundCenter/templates/bonus-AuditRescindContract.html'),
    status_template: require('text!fundCenter/templates/fund-StatusTD-Temp.html'),

    events: {
      'click .js-fc-ac-deal': 'dealWithdrawHandler',
      'click .js-fc-ac-notDeal': 'notDealWithdrawHandler',
      'click .js-fc-ac-log': 'checkRescindDetailHandler'
    },

    initialize: function () {
      _(this.options).extend({
        tableClass: '',
        checkable: true,
        columns: [
          {
            name: '签约时间',
            width: '15%'
          },
          {
            name: '总代用户名',
            width: '10%'
          },
          {
            name: '一代用户名',
            width: '10%'
          },
          {
            name: '分红比例',
            width: '10%'
          },
          {
            name: '协议内容',
            width: '10%'
          },
          {
            name: '申请原因',
            width: '15%'
          },
          {
            name: '签约预计失效时间',
            width: '10%'
          },
          {
            name: '状态',
            width: '10%'
          },
          {
            name: '操作',
            width: '10%'
          }
        ],
        gridOps: {
          emptyTip: '无记录'
        },
        ajaxOps: {
          url: '/intra/dividmng/cancellist.json'
        }
      });
    },

    getCheckUserListXhr: function(){
      return Global.sync.ajax({
        url: '/intra/dividmng/canceloperator.json '
      });
    },
    dealRescindXhr: function(data){
      return Global.sync.ajax({
        url: '/intra/dividmng/cancelapprove.json ',
        data:data
      });
    },

    onRender: function(){
      var self = this;
      this.getCheckUserListXhr() .fail(function(){
      }).done(function(res){
        if(res.result===0){
          var optionData = _(res.root.userList||[]).map(function(user){
            return {
              value: user.userId,
              text: user.username
            }
          });
          self.renderSelect(optionData,self.$('.js-fc-ac-operatorId'))
        }else{
          Global.ui.notification.show('操作失败。');
        }
      });
      Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
    },
    renderSelect:function(data,$select){
      var options = [];
      _(data).each(function(item){
        var option = '<option value="'+item.value+'">'+item.text+'</option>';
        options.push(option);
      });
      $select.append(options.join(''));
    },
    renderGrid: function (gridData) {
      var rowsData = _(gridData.cancelList).map(function (dividend, index) {
        return {
          columnEls: this.formatRowData(dividend, index),
          dataAttr: dividend,
          needCheck: dividend.status===0
        };
      }, this);

      this.grid.refreshRowData(rowsData, gridData.rowCount, {
        pageIndex: this.filterHelper.get('pageIndex'),
        initPagination: true
      });
      this.bindPopoverHandler(gridData.cancelList);

      //加上统计行
      this.grid.hideLoading();
    },

    formatRowData: function(dividend){
      var row = [];
      row.push(_(dividend.agreeDate).formatTime());
      row.push(dividend.username);
      row.push(dividend.subUsername);
      row.push( _(dividend.divid).formatDiv(100,{fixed:2})+'%');
      row.push('<a class="js-fc-su-agreement btn btn-link">点击查看</a>');
      row.push(dividend.remark);
      row.push(dividend.effectDate);
      var status = '';
      switch(dividend.status){
        case 0: status='待审核';break;
        case 1: status='已通过';break;
        case 2: status='不通过';break;
      }
      row.push(_(this.status_template).template()({code:fundStatusConfig.getCodeByStatus(status),status:status}));
      if(dividend.status===1 || dividend.status===2){
        row.push( '<a class="js-fc-ac-log btn btn-link no-padding" >日志</a>');
      }else{
        row.push( '');
      }
      //不通过 -1全部，0待审核，1已通过，2不通过

      return row;
    },
    dealWithdrawHandler: function(e){
      var data = this.getCheckedData();
      this.propDividendDealModel('allow',data);
    },
    notDealWithdrawHandler: function() {
      var data = this.getCheckedData();
      this.propDividendDealModel('prevent',data);
    },
    getCheckedData: function(){
      var checkedData = this.grid.getChk();
      var cancelIdList = [];
      var usernameList = [];

      _(checkedData.$rows).each(function(row,index,$rows){
        cancelIdList.push($(row).data('cancelid'));
        usernameList.push($(row).data('subusername'));
      });
      return {
        cancelIdList: cancelIdList,
        usernameList: usernameList
      }
    },
    //弹出处理窗口
    propDividendDealModel: function (type,data) {
      var self = this;
      if(_(data.cancelIdList).size()===0){
        Global.ui.notification.show('请先选择需要处理的数据。');
        return false;
      }
      var $dialog = Global.ui.dialog.show(
        {
          title:  '提示',
          body: '<div class="js-fc-ac-Check-container"></div>',
          footer: ''
        }
      );
      _(data).extend({
        type: type
      });
      var $checkDividendContainer = $dialog.find('.js-fc-ac-Check-container');
      var dividendAuditView = new DividendAuditView(data);
      $checkDividendContainer.html(dividendAuditView.render().el);

      $dialog.on('hidden.bs.modal', function () {
        $(this).remove();
      });
      var $notice = $dialog.find('.js-fc-ac-deal-notice');
      $dialog.off('click.saveInfo')
        .on('click.saveInfo', '.js-fc-ac-audit-submit', function (ev) {
          var $target = $(ev.currentTarget);
          $target.button('loading');

          var clpValidate = $dialog.find('.js-fc-ac-deal-form').parsley().validate();
          if (clpValidate) {
            //var type = $(ev.currentTarget).data('type');
            var status;
            if (type === 'allow') {
              status = '1';
            } else if (type === 'prevent') {
              status = '2';
            }
            var data2 = {
              status: status,
              cancelId: data.cancelIdList.join(','),
              remark: $dialog.find('.js-fc-ac-deal-remark').val()
            };
            self.dealRescindXhr(data2).always(function () {
              $target.button('reset');
            }).fail(function () {

            }).done(function (res) {
              if (res.result === 0) {
                $dialog.modal('hide');
                Global.ui.notification.show('操作成功。');
                self._getGridXhr();
              } else {
                Global.ui.notification.show('操作失败。');
              }
            });
          }else{
            $target.button('reset');
          }

        });
    },
    bindPopoverHandler: function(cancelList){
      var self = this;
      _(cancelList).each(function(agree,index){
        var agreementLink = self.$('.js-fc-su-agreement');
        if(_(agreementLink).size()>=index){
          $(agreementLink[index]).popover({
            title: '协议内容',
            trigger: 'click',
            html: true,
            container: 'body',
            content: '<div class="js-pf-popover"><span class="word-break">'+ agree.agreement +'</span></div>',
            placement: 'right'
          });
        }
      });
    },
    checkRescindDetailHandler: function(e){
      var self = this;
      var $target = $(e.currentTarget);
      //var agreeId = $target.closest('tr').data('agreeid');
      //this.getRescindDetailXhr({
      //  agreeId: agreeId
      //}).done(function(res){
      //  if(res.result===0){
      //    self.propupRescindDetail(res.root);
      //  }else{
      //    Global.ui.notification.show('操作失败。');
      //  }
      //});

      var cancelDate = $target.closest('tr').data('operatetime');
      var operator = $target.closest('tr').data('operator');
      var remarks = $target.closest('tr').data('rejectremark');
      remarks = (_(remarks).isUndefined()||_(remarks).isNull())?'': remarks;

      self.propupRescindDetail({
        cancelDate:cancelDate,
        operator:operator,
        remarks:remarks
      });
    },
    propupRescindDetail: function(detail){
      var $dialog = Global.ui.dialog.show(
        {
          title:  '查看',
          body: '<div class="js-fc-gm-Check-container margin-sm">' +
          '<div class="margin-sm inline-block">解约时间：'+_(detail.cancelDate).formatTime()+
          '</div><div class="margin-sm m-left-lg inline-block">'+detail.operator+'</div>'+
          ( (detail.remarks==='')? '':( '<div class="border-all margin-sm padding-sm">'+detail.remarks+'</div>'))+
          '</div>',
          footer: ''
        }
      );
      $dialog.on('hidden.bs.modal', function () {
        $(this).remove();
      });
    }

  });

  module.exports = operateCheckView;
});