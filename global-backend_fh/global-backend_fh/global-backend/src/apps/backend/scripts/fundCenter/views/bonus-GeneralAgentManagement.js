define(function (require, exports, module) {

  require('prefab/views/searchGrid');

  var DividendAuditView = require('fundCenter/views/bonus-GeneralAgentManagement-Audit');
  var fundStatusConfig = require('fundCenter/misc/fundStateTDConfig');

  var operateCheckView = Base.Prefab.SearchGrid.extend({

    template: require('text!fundCenter/templates/bonus-GeneralAgentManagement.html'),
    status_template: require('text!fundCenter/templates/fund-StatusTD-Temp.html'),

    events: {
      'click .js-fc-gm-deal': 'dealWithdrawHandler',
      'click .js-fc-gm-notDeal': 'notDealWithdrawHandler',
      'click .js-fc-gm-account':'userAccountHandler',
      'change .js-fc-gm-dr': 'settleDateChangeHandler',
      'click .js-fc-gm-log':'checkLogHandler'
    },

    initialize: function () {
      _(this.options).extend({
        tableClass: '',
        checkable: true,
        columns: [
          {
            name: '流水号',
            width: '15%'
          },
          {
            name: '结算日期',
            width: '15%'
          },
          {
            name: '用户名',
            width: '10%'
          },
          {
            name: '所属招商号',
            width: '10%'
          },
          {
            name: '团队投注金额',
            width: '10%'
          },
          {
            name: '团队盈亏',
            width: '10%'
          },
          {
            name: '分红比例',
            width: '5%'
          },
          {
            name: '分红金额',
            width: '5%'
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
          url: '/intra/dividmng/list.json'
        }
      });
    },

    getCheckUserListXhr: function(){
      return Global.sync.ajax({
        url: '/intra/dividmng/genoperator.json '
      });
    },
    dealDividendXhr: function(data){
      return Global.sync.ajax({
        url: '/intra/dividmng/approve.json ',
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
          self.renderSelect(optionData,self.$('.js-fc-gm-operatorId'))
        }else{
          Global.ui.notification.show('操作失败。');
        }
      });
      this.generateSettlementOption(this.$('.js-fc-gm-dr'));
      this.$('.js-fc-gm-dr').trigger('change');
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
      var rowsData = _(gridData.dividList).map(function (dividend, index) {
        return {
          columnEls: this.formatRowData(dividend, index),
          dataAttr: dividend,
          needCheck: dividend.status===3
        };
      }, this);

      this.grid.refreshRowData(rowsData, gridData.rowCount, {
        pageIndex: this.filterHelper.get('pageIndex'),
        initPagination: true
      });
      //加上统计行
      this.grid.hideLoading();
    },
    formatRowData: function(dividend){
      var row = [];
      if(dividend.tradeNo){
        if(Global.authority.fc && Global.authority.fc.ad && Global.authority.fc.ad.page ) {
          row.push('<button data-id="' + dividend.tradeNo + '" class="js-fc-gm-account btn btn-link">'+dividend.tradeNo+'</button>');
        }else{
          row.push(dividend.tradeNo);
        }
      }else{
        row.push('');
      }
      row.push(dividend.cycle);
      row.push(dividend.subUsername || '');
      row.push(dividend.username);
      row.push(_(dividend.betTotal).fixedConvert2yuan());
      row.push( _(dividend.profitTotal).convert2yuan());
      row.push(_(dividend.divid).formatDiv(100, {fixed: 0}));
      row.push(_(dividend.dividTotal).convert2yuan());
      //status:0 // 状态：0待发放，1已发放，2不发放，3未申请
      var status = '';
      switch(dividend.status){
        case 0: status='未申请';break;
        case 1: status='已发放';break;
        case 2: status='不发放';break;
        case 3: status='待审核';break;
        case 9: status='统计中';break;
      }
      row.push(_(this.status_template).template()({code:fundStatusConfig.getCodeByStatus(status),status:status}));
      if(dividend.status===2 || dividend.status===1){
        row.push( '<a class="js-fc-gm-log btn btn-link no-padding" >日志</a>');
      }else{
        row.push( '');
      }

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
      var dividIdList = [];
      var usernameList = [];

      _(checkedData.$rows).each(function(row,index,$rows){
        dividIdList.push($(row).data('dividid'));
        usernameList.push($(row).data('subusername'));
      });
      return {
        dividIdList: dividIdList,
        usernameList: usernameList
      }
    },
    //弹出处理窗口
    propDividendDealModel: function (type,data) {
      var self = this;
      if(_(data.dividIdList).size()===0){
        Global.ui.notification.show('请先选择需要处理的数据。');
        return false;
      }
      var $dialog = Global.ui.dialog.show(
        {
          title:  '提示',
          body: '<div class="js-fc-gm-Check-container"></div>',
          footer: ''
        }
      );
      _(data).extend({
        type: type
      });
      var $checkDividendContainer = $dialog.find('.js-fc-gm-Check-container');
      var dividendAuditView = new DividendAuditView(data);
      $checkDividendContainer.html(dividendAuditView.render().el);

      $dialog.on('hidden.bs.modal', function () {
        $(this).remove();
      });
      var $notice = $dialog.find('.js-fc-gm-deal-notice');
      $dialog.off('click.saveInfo')
        .on('click.saveInfo', '.js-fc-gm-audit-submit', function (ev) {
          var $target = $(ev.currentTarget);
          $target.button('loading');
          var clpValidate = $dialog.find('.js-fc-gm-deal-form').parsley().validate();
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
              dividId: data.dividIdList.join(','),
              remark: $dialog.find('.js-fc-gm-deal-remark').val()
            };
            self.dealDividendXhr(data2).always(function () {
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
    userAccountHandler:function(e){
      var $target = $(e.currentTarget);
      Global.appRouter.navigate(_('#fc/ad').addHrefArgs({
        _t:_.now(),
        tradeNo:$target.data('id')
      }), {trigger: true, replace: false});
    },

    generateSettlementOption: function($target){
      var now = moment().format('YYYY-MM-DD');
      var size = 12;
      var optionArr = [];
      _(size).times(function(n){
        var newData = moment(now).subtract(n,'month');
        var newFirstDay = moment(newData).startOf('month');
        var newMidEndDate = moment(newFirstDay).add(14,'day');
        var newMidStartDate = moment(newFirstDay).add(15,'day');
        var newEndDay = moment(newData).endOf('month');
        var range1 = newMidStartDate.format('YYYY/MM/DD') + '-' + newEndDay.format('YYYY/MM/DD');
        var range2 = newFirstDay.format('YYYY/MM/DD')+'-'+newMidEndDate.format('YYYY/MM/DD');
        if((n===0 && moment(now).isAfter(newMidEndDate.format('YYYY-MM-DD')))|| n!==0) {
          optionArr.push('<option value="'+range1+'">' + range1 + '</option>');
        }
        optionArr.push('<option value="'+range2+'">'+range2+'</option>');
      });
      $target.html(optionArr.join(''));
    },
    settleDateChangeHandler: function(e){
      var dateArr = $(e.currentTarget).val().split('-');
      if(_(dateArr).size()===2){
        var start = moment(dateArr[0],'YYYY/MM/DD').format('YYYY-MM-DD');
        var end = moment(dateArr[1],'YYYY/MM/DD').format('YYYY-MM-DD');
        this.$('.js-fc-gm-sd').val(start);
        this.$('.js-fc-gm-ed').val(end);
      }else{
        this.$('.js-fc-gm-sd').val('');
        this.$('.js-fc-gm-ed').val('');
      }
    },
    checkLogHandler: function(e){
      var self = this;
      var $target = $(e.currentTarget);
      var effectDate = $target.closest('tr').data('givetime');
      var operator = $target.closest('tr').data('operator');
      var remarks = $target.closest('tr').data('remarks');
      remarks = (_(remarks).isUndefined()||_(remarks).isNull())?'': remarks;

      self.propupRescindDetail({
        effectDate:effectDate,
        operator:operator,
        remarks:remarks
      });

    },
    propupRescindDetail: function(detail){
      //cancelDate:121313131, // 解约时间
      //  remark:"",		// 解约原因
      //  operator:""		// 操作人
      var $dialog = Global.ui.dialog.show(
        {
          title:  '查看',
          body: '<div class="js-fc-gm-Check-container margin-sm">' +
          '<div class="margin-sm inline-block">操作时间：'+_(detail.effectDate).formatTime()+
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