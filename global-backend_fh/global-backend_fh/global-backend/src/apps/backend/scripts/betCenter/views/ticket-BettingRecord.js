/**
 * Created by David Zhang on 2015/9/13.
 */
define(function (require, exports, module) {
  require('prefab/views/searchGrid');
  var betStatusConfig = require('betCenter/misc/betStatusConfig');
  var BettingRecordView = Base.Prefab.SearchGrid.extend({

    template: require('text!betCenter/templates/ticket-BettingRecord.html'),

    events: {
      'click .js-bc-sysCancelBet':'sysCancelBetHandler'
    },

    initialize: function () {
      _(this.options).extend({
        title: '投注记录',
        columns: [
          {
            name: '订单编号',
            width: '10%'
          },
          {
            name: '彩种名称',
            width: '10%'
          },
          {
            name: '投注奖期',
            width: '12%'
          },
          {
            name: '用户名',
            width: '10%'
          },
          {
            name: '开奖号码',
            width: '12%'
          },
          {
            name: '投注金额',
            width: '10%'
          },
          {
            name: '订单状态',
            width: '8%'
          },
          {
            name: '是否追号',
            width: '5%'
          },
          {
            name: '投注时间',
            width: '15%'
          },
          {
            name: '终端类型',
            width: '5%'
          }
        ],
        gridOps: {
          emptyTip: '无记录'
        },
        ajaxOps: {
          url: '/intra/betmng/betlist.json'
        },
        exportOps: {
          url: '/intra/betmng/download'
        }
      });
    },

    onRender: function() {
      //初始化时间选择
      this.timeset = new Global.Prefab.Timeset({
        el: this.$('.js-bc-timeset'),
        startTime: 'startTime',
        endTime: 'endTime',
        showToday: true
      }).render();

      var self = this;
      //初始化时间选择控件
      this.$btnGroup = this.$('.js-ac-btnGroup');
      this.timeset.$startDate.on('dp.change', function() {
        if (self.btnGroup) {
          self.btnGroup.clearSelect();
        }
      });

      this.timeset.$endDate.on('dp.change', function() {
        if (self.btnGroup) {
          self.btnGroup.clearSelect();
        }
      });

      this.btnGroup = new Global.Prefab.BtnGroup({
        el: this.$btnGroup,
        onBtnClick: function(offset) {
          self.timeset.$startDate.data("DateTimePicker").date(moment().add(offset, 'days').startOf('day'));
          self.timeset.$endDate.data("DateTimePicker").date(moment().add(offset < 0 ? -1 : 0, 'days').endOf('day'));
        },
        btnGroup: [
          {
            title: '今日',
            value: 0,
            active: true
          },
          {
            title: '昨日',
            value: -1
          },
          {
            title: '过去7天',
            value: -7
          },
          {
            title: '过去30天',
            value: -30
          }
        ]
      }).render();



      this.$('select[name=betStatus]').html(_(betStatusConfig.get()).map(function(betStatus) {
        return '<option value="' + betStatus.id + '">' + betStatus.zhName + '</option>';
      }).join(''));

      //初始化彩种选择
      new Global.Prefab.TicketSelectGroup({
        el: this.$('.js-uc-ticket-select-group')
      });

      Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
    },


    renderGrid: function(gridData) {
      var self = this;
      var rowsData = _(gridData.betList).map(function(order,index) {
        return {
          columnEls: this.formatRowData(order, index),
          dataAttr: order
        };
      }, this);

      this.grid.refreshRowData(rowsData, gridData.rowCount, {
        pageIndex: this.filterHelper.get('pageIndex'),
        initPagination: true
      });

      this.grid.addRows({
        columnEls: [
          '<strong>所有页总计</strong>',
          {
            colspan: 4
          },
          '￥' + _(gridData.betMoneyTotal).fixedConvert2yuan(),
          '￥' + _(gridData.prizeMoneyTotal).convert2yuan(),
          {
            colspan: 3
          }
        ]
      })
          .hideLoading();
    },

    formatRowData: function(rowInfo) {
      var row = [];
      if(Global.authority.bc && Global.authority.bc.br && Global.authority.bc.br.bettingRecordDetail){
        row.push("<a href='" + _.getUrl('/detail/' + rowInfo.ticketTradeNo) + "' class='router btn btn-link'>"+rowInfo.ticketTradeNo+"</a>");
      }else{
        row.push(rowInfo.ticketTradeNo);
      }

      row.push(rowInfo.ticketName);
      if(rowInfo.ticketName.indexOf('秒秒彩') != -1){
        row.push("/");
      }else{
        row.push(rowInfo.ticketPlanId);
      }
      row.push(rowInfo.userName);
      row.push(rowInfo.ticketResult);
      row.push('￥'+_(rowInfo.betTotalMoney).fixedConvert2yuan());

      var ticketBetStatus;
      if(rowInfo.ticketName.indexOf('秒秒彩') != -1){
        ticketBetStatus = "未中奖";
        if(rowInfo.prizeTotalMoney != 0){
          ticketBetStatus = '<p class="text-danger">￥'+_(rowInfo.prizeTotalMoney).convert2yuan()+'</p>';
        }
      }else{
        if(rowInfo.ticketBetStatus==2){
          ticketBetStatus = '用户撤单';
        }else if(rowInfo.ticketBetStatus==3){
          ticketBetStatus = '<a class="js-bc-sysCancelBet" id="jsBCSysCancelBet'+rowInfo.ticketBetId+'">系统撤单</a>';
        }else if (rowInfo.hasException) {
          ticketBetStatus = '等待开奖';
        }else if(rowInfo.prizeTotalMoney != 0){
          ticketBetStatus = '<p class="text-danger">￥'+_(rowInfo.prizeTotalMoney).convert2yuan()+'</p>';
        }else if(rowInfo.ticketResult == null){
          if(rowInfo.ticketOpenStatus>0){
            ticketBetStatus = '未中奖';
          }else {
            ticketBetStatus = '等待开奖';
          }
        }else{
          ticketBetStatus = '未中奖';
        }
      }
      row.push(ticketBetStatus);
      row.push(rowInfo.chaseId == null ? '否':'是');
      row.push(_(rowInfo.betTime).toTime());
      var betDevice;
      if(rowInfo.betDevice==0){
        betDevice = 'PC网页';
      }else if(rowInfo.betDevice==1){
        betDevice = 'Android';
      }else if(rowInfo.betDevice==2){
        betDevice = 'IOS';
      }else if(rowInfo.betDevice==3){
        betDevice = 'H5';
      }
      row.push(betDevice);
      //checkStatus = "<a href='" + _.getUrl('/detail/' + rowInfo.ticketResultId) + "' class='router btn btn-link'>"+checkStatus+"</a>"
      return row;
    },

    // 系统撤单原因
    getSysCancelBetReason: function (datas) {

      return Global.sync.ajax({
        url: '/intra/betmng/betcanceldetail.json',
        data: datas
      });
    },

    // 系统撤单详情
    sysCancelBetHandler: function(e) {
      var $target = $(e.currentTarget);
      var reqParams = {ticketBetId:$target.attr('id').substring(16,$target.attr('id').length)};
      this.getSysCancelBetReason(reqParams).always(function () {
      })
          .fail(function () {
            // 处理失败
          })
          .done(function (res) {
            if (res && res.result === 0) {
              var html = '<strong>'+_(res.root.cancelTime).toTime()+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+res.root.username+'</strong><br>';
              html += '<div class="panel panel-default no-m-bottom "><div class="panel-body  no-m-bottom "><p>'+res.root.remark+'</p></div></div>';
              var $dialog = Global.ui.dialog.show(
                  {
                    title:  '系统撤单原因',
                    body: '<div>'+html+'</div>',
                    footer: ''
                  }
              );
              $dialog.on('hidden.bs.modal', function () {
                $(this).remove();
              });
            } else {
              Global.ui.notification.show('彩种接口设置获取失败');
            }
          });
    },

  });

  module.exports = BettingRecordView;
});
