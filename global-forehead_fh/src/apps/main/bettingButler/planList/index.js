"use strict";

var BtnGroup = require('com/btnGroup');

var PlanDetailView = require('./planDetail');

var PlanListView = Base.ItemView.extend({
  template: require('./index.html'),

  events: {
    'click .js-bb-plan-stop': 'stopPlanHandler',
    'click .js-bb-plan-detail': 'planDetailHandler'

  },

  getListXhr: function(type) {
    return Global.sync.ajax({
      url: '/ticket/betManager/projectlist.json',
      data: {
        type: type
      }
    });
  },

  stopPlanXhr: function(data) {
    return Global.sync.ajax({
      url: '/ticket/betManager/stopproject.json',
      data: data
    });
  },

  onRender: function() {
    var self = this;
    this.$typeGroup = this.$('.js-bb-type-group');
    this.$planList = this.$('.js-bb-plan-list');

    this.btnGroup = new BtnGroup({
      el: this.$typeGroup,
      btnStyle: 'btn-group-pink btn-xs btn-circle btn-xs-long-p m-right-xs',
      btnGroup: [
        {
          title: '进行中',
          value: 1,
          active: true
        },
        {
          title: '已结束',
          value: 2
        }
      ],
      onBtnClick: function(offset) {
        self.renderGrid(offset);
        // self.timeset.$startDate.data("DateTimePicker").date(moment().add(offset, 'days').startOf('day'));
        // self.timeset.$endDate.data("DateTimePicker").date(moment().add(offset === -1 ? -1 : 0, 'days').endOf('day'));
        // (self.$('.js-ac-search-form') && !self.firstTime) && self.$('.js-ac-search-form').trigger('submit');
        // return false;
      }
    }).render();
  },

  renderGrid: function(type) {
    var self = this;

    if (!this.$planList.staticGrid('instance')) {
      this.$planList.staticGrid({
        tableClass: 'table table-bordered table-center',
        wrapperClass: '',
        // height: this.options.height,
        colModel: [
          {label: '计划号', name: '', width: '5%', formatter: function(val, index) {
            return index + 1;
          }},
          {label: '投注彩种', name: 'ticketName', width: '10%'},
          {label: '投注开始时间', name: 'startTime', width: '15%'},
          {label: '已追/总期数', name: 'ticketChaseAllPeriods', width: '10%', formatter: function(val, index, info) {
            return info.finishPeriods + '/' + info.ticketChaseAllPeriods;
          }},
          {label: '已投/总轮', name: 'bonusMax', width: '10%', formatter: function(val, index, info) {
            return info.finishTimes + '/' + (info.times + 1);
          }},
          {label: '已中奖金额', name: 'prizeTotal', width: '10%', formatter: function(val, index, info) {
            return _(val).convert2yuan();
          }},
          {label: '当前状态', name: 'status', width: '10%', formatter: function(val, index, info) {
            switch(val) {
              case 0:
                val = '未开始';
                break;
              case 1:
                val = '进行中';
                break;
              case 2:
                val = '已完成';
                break;
              default:
                val = '未开始';
                break;
            }
            return val;
          }},
          {label: '操作', name: 'status', width: '20%', formatter: function(val, index, info) {
            var html = [];
            html.push('<a href="#gr/tr/detail/' + info.ticketChaseNum + '" class="btn btn-link">查看投注</a>');
            html.push('<a href="javascript:void(0)" class="js-bb-plan-detail btn btn-link">计划详情</a>');
            if (val !== 2) {
              html.push('<a href="javascript:void(0)" class="js-bb-plan-stop btn btn-link">中止计划</a>');
            }
            return html.join('');
          }}
        ]
      });
    }
    self.$planList.staticGrid('clean');

    this.getListXhr(type)
      .done(function(res) {
        if (res && res.result === 0) {
          self.$planList.staticGrid('renderRow', res.root || []);
        } else {
          Global.ui.notification.show('获取列表失败！错误原因：' + res.msg || '');
        }
      });
  },

  //event handlers

  planDetailHandler: function(e) {
    var $target = $(e.currentTarget);

    var rowData = this.$planList.staticGrid('getRowData', $target);

    var $planDetail;
    var planDetail;

    var $dialog = Global.ui.dialog.show({
      title: '查看计划',
      modalClass: 'modal-lg',
      body: '<div class="js-detail"></div>'
    });

    $planDetail = $dialog.find('.js-detail');
    planDetail = new PlanDetailView({
      el: $planDetail,
      planInfo: rowData
    }).render();

    $dialog.on('hidden.modal', function() {
      $(this).remove();
      planDetail.destroy();
    });
  },

  stopPlanHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);
    var data = this.$planList.staticGrid('getRowData', $target);

    var html = '<div class="text-center"><p><span class="circle-icon"><i class="fa fa-commenting"></i></span></p><p class="font-md">请问您是否需要终止该计划方案？</p></div>';
    $(document).confirm({
      title: '提示',
      content: html,
      agreeCallback: function() {
        $target.button('loading');
        self.stopPlanXhr({
          chaseId: data.ticketChaseId,
          type: data.type
        })
          .always(function() {
            $target.button('reset');
          })
          .done(function(res) {
            if (res && res.result === 0) {
              Global.ui.notification.show('终止成功');
            } else {
              Global.ui.notification.show('终止计划失败！错误原因：' + res.msg || '');
            }
          });
      }
    });
  }
});

module.exports = PlanListView;