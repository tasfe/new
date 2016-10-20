"use strict";

var PlanCollection = require('../collections/PlanCollection');

var BtnGroup = require('com/btnGroup');

var ticketConfig = require('skeleton/misc/ticketConfig');

var PlanSettingView = Base.ItemView.extend({

  template: require('./index.html'),

  cycleAddTpl: _(require('./cycleAdd.html')).template(),

  confirmTpl: _(require('./confirm.html')).template(),

  events: {
    'change .js-bb-ticket-list': 'getCollectionHandler',
    'change .js-bb-collection-list': 'changePlanDetailsHandler',
    'change .js-bb-times-switch': 'switchTimesHandler',
    'change .js-bb-cycle-select': 'cycleSelectHandler',

    'click .js-bb-plan-cycle-add': 'cycleAddHandler',
    'submit .js-bb-form': 'submitFormHandler'
  },

  getTicketListXhr: function() {
    return Global.sync.ajax({
      url: '/ticket/ticketmod/bmticketlist.json'
    });
  },

  getLastTimeXhr: function() {
    return Global.sync.ajax({
      url: '/ticket/betManager/systemtime.json'
    });
  },

  getChasePlanXhr: function(ticketId) {
    return Global.sync.ajax({
      url: '/ticket/chase/chaseinfo.json',
      data: {
        ticketId: ticketId
      }
    });
  },

  confirmMoneyXhr: function(data) {

    return Global.sync.ajax({
      url: '/ticket/betManager/projectconfirm.json',
      data: data,
      tradition: true
    });
  },

  submitPlanXhr: function(data) {

    data.play = _(data.play).map(function(playInfo) {
      return {
        playId: playInfo.playId,
        betNum: playInfo.betNum,
        moneyMethod: playInfo.method,
        betMethod: playInfo.modes,
        betMultiple: playInfo.times
      };
    });

    return Global.sync.ajax({
      url: this.isCycle ? '/ticket/betManager/project1.json' : '/ticket/betManager/project0.json',
      data: data,
      tradition: true
    });
  },

  getCycleListXhr: function() {
    return Global.sync.ajax({
      url: '/ticket/betManager/cyclelist.json'
    });
  },

  createCycleXhr: function(data) {
    return Global.sync.ajax({
      url: '/ticket/betManager/newcycle.json',
      data: data
    });
  },

  initialize: function() {
    this.collection = new PlanCollection();
  },

  updateTime: function() {
    var self = this;
    this.getLastTimeXhr()
      .done(function(res) {
        if(res && res.result === 0) {
          self.lastTime = (moment(res.root) || moment()).add(5, 'minutes');
          self.$startTime.data('DateTimePicker').minDate(self.lastTime);
          if(self.lastTime.isAfter(self.$startTime.data('DateTimePicker').date())) {
            self.$startTime.data('DateTimePicker').date(self.lastTime);
          }
        }
      });
  },

  onRender: function() {
    var self = this;

    this.$ticketList = this.$('.js-bb-ticket-list');
    this.$typeGroup = this.$('.js-ac-type-group');
    this.$collectionList = this.$('.js-bb-collection-list');
    this.$planGridContainer = this.$('.js-bb-plan-grid-container');
    this.$planGrid = this.$('.js-bb-plan-grid');
    this.$planDetails = this.$('.js-bb-plan-details');
    this.$chasePlans = this.$('.js-bb-periods');
    this.$form = this.$('.js-bb-form');
    this.$submit = this.$('.js-bb-submit');
    this.$times = this.$('.js-bb-times');

    //期数方式
    this.$startTime = this.$('.js-bb-start-time');
    this.$startTimeContainer = this.$('.js-bb-start-time-container');

    //周期方式
    this.$cycleSelect = this.$('.js-bb-cycle-select');
    this.$cycleSelectContainer = this.$('.js-bb-cycle-select-container');
    this.$cycleDetail = this.$('.js-bb-plan-cycle-detail');
    this.$cycleDetailInner = this.$('.js-bb-plan-cycle-detail-inner');

    this.btnGroup = new BtnGroup({
      el: this.$typeGroup,
      btnStyle: 'btn-group-pink btn-xs btn-circle btn-xs-long-p m-right-xs',
      btnGroup: [
        {
          title: '期数方式',
          value: 0,
          active: true
        },
        {
          title: '周期方式',
          value: 1
        }
      ],
      onBtnClick: function(offset) {
        self.isCycle = offset = !!offset;

        self.$startTime.prop('disabled', offset);
        self.$startTimeContainer.toggleClass('hidden', offset);

        //周期方式
        self.$cycleSelect.prop('disabled', !offset);
        self.$cycleSelectContainer.toggleClass('hidden', !offset);
        self.$cycleDetail.toggleClass('hidden', !offset);
      }
    }).render();

    this.getTicketListXhr()
      .done(function(res) {
        if(res && res.result === 0) {
          self.$ticketList.html('<option value="">请选择</option>' + _(res.root).map(function(ticketInfo) {
              return '<option value="' + ticketInfo.ticketId + '" data-data=\'' + JSON.stringify(ticketInfo) + '\'>' + ticketInfo.ticketName + '</option>';
            }).join(''));
        }
      });


    this.$startTime.datetimepicker({
      format: 'YYYY-MM-DD HH:mm:ss',
      useCurrent: false,
      minDate: moment().add(-1, 'days').startOf('day').toDate(),
      maxDate: moment().add(7, 'days').startOf('day').toDate()
    });

    this.updateTime();
    this.updateTimer = setInterval(function() {
      self.updateTime();
    }, 60000);

    this.renderCycleList();
  },

  renderCycleList: function() {
    var self = this;
    var currentValue = self.$cycleSelect.val();
    this.getCycleListXhr()
      .done(function(res) {
        var dataList;
        if(res && res.result === 0) {
          dataList = res.root && res.root.dataList;
          self.$cycleSelect.html('<option>请选择计划</option>' + _(dataList).map(function(cycleInfo) {
            return '<option value="' + cycleInfo.cycleId + '" data-data=\'' + JSON.stringify(cycleInfo) + '\'>' + cycleInfo.cycleName + '</option>';
          }));

          if (currentValue) {
            self.$cycleSelect.val(currentValue);
          }
          self.$cycleSelect.trigger('change');
        } else {
          Global.ui.notification.show('获取周期计划失败！错误原因：' + res.msg || '');
        }
      });
  },

  renderCurrentList: function(model) {
    var self = this;
    var info = model.toJSON();

    this.$collectionList.html(_(info.dateList).map(function(collectionInfo) {
      return '<option value="' + collectionInfo.schemeId + '" ' + (collectionInfo.schemeId === self.schemeId ? 'selected' : '') + '>' + collectionInfo.schemeName + '</option>';
    })).trigger('change');

    this.$planDetails.removeClass('hidden');
  },

  changePlanDetailsHandler: function(e) {
    var $target = $(e.currentTarget);
    this.schemeId = Number($target.val());

    var schemeDetail = this.currentPlanModel.getCurrentPlan(this.schemeId);
    // var planList = this.currentPlanModel.get('dateList');
    // var schemeDetail = _(planList).findWhere({
    //   schemeId: this.schemeId
    // });
    if(!_(schemeDetail && schemeDetail.playList).isEmpty()) {
      this.renderPlanGrid(schemeDetail);
      this.$planGridContainer.removeClass('hidden');

    } else {
      this.$planGridContainer.addClass('hidden');
    }
  },

  renderPlanGrid: function(schemeDetail) {
    var self = this;
    var is11xuan5 = schemeDetail.schemeName.indexOf('11选5') !== -1;

    if(this.$planGrid.staticGrid('instance')) {
      this.$planGrid.staticGrid('destroy');
    }

    this.$planGrid.staticGrid({
      tableClass: 'table table-bordered table-center',
      height: 280,
      colModel: [
        {label: '收藏备注', name: 'schemeName', width: '10%', merge: true},
        {label: '玩法名', name: 'playName', width: '10%', merge: true},
        {
          label: '投注内容', name: 'betNum', width: '15%', formatter: function(val, index, thisRow) {
          var html = is11xuan5 ? val : val.replace(/ /g, '');
          if(thisRow.rx) {
            html = '<a class="js-uc-betDetail-optional-betNum btn-link btn-link-hot" data-id="' + thisRow.ticketBetPlayId + '"">详细号码</a>';
          } else if(html.length > self.maxLength) {
            html = '<a class="js-uc-betDetail-betNum btn-link btn-link-hot">详细号码</a>';
          }
          return html;
        }
        },
        {label: '倍数', name: 'times', width: '8%'},
        {
          label: '投注模式', name: 'method', width: '10%', formatter: function(val) {
          return val === 10000 ? '元' : val === 1000 ? '角' : val === 100 ? '分' : '厘';
        }
        }
      ],
      row: _(schemeDetail.playList).map(function(playInfo) {
        playInfo.schemeName = schemeDetail.schemeName;
        return playInfo;
      })
    });

    var no = 0;

    _(schemeDetail.playList).each(function(item) {
      var betNum = is11xuan5 ? item.betNum : item.betNum.replace(/ /g, '');
      if(betNum.length > self.maxLength && !item.rx) {
        $(self.$('.js-uc-betDetail-betNum')[no++]).popover({
          title: '详细号码',
          trigger: 'manual',
          html: true,
          container: this.$el,
          content: '<div class="js-pf-popover"><span class="word-break">' + betNum + '</span></div>',
          placement: 'right'
        }).on("click", function(e) {
          var _this = this;
          $(this).popover("toggle");
          e.stopPropagation();
        });
      }
    }, this);
  },

  //event handlers

  getCollectionHandler: function(e) {
    var self = this;

    var $target = $(e.currentTarget);
    var ticketId = Number($target.val());

    if(!ticketId) {
      this.$planDetails.addClass('hidden');
      return false;
    }

    var planModel = this.collection.add({
      ticketId: ticketId
    });

    if(this.currentPlanModel) {
      this.currentPlanModel.off();
    }

    this.currentPlanModel = planModel;
    this.currentPlanModel.on('getList:complete getList:change', this.renderCurrentList, this);
    this.currentPlanModel.on('currentList:empty', function() {
      this.schemeId = null;
      this.renderCurrentList.apply(this, arguments);
    }, this);

    this.currentPlanModel.getList();

    //更新期数限制
    this.getChasePlanXhr(ticketId)
      .done(function(res) {
        if(res && res.result === 0) {
          self.$chasePlans.data('monitorRange', [1, res.root.length]).trigger('keyup');
        }
      });

    // //更新时间限制
    // var ticketInfo = $target.find(':selected').data('data');
    // this.$startTime.data('DateTimePicker').maxDate(moment(ticketInfo.endTime));
    // console.log(moment(ticketInfo.endTime));
  },

  switchTimesHandler: function(e) {
    var $target = $(e.currentTarget);
    this.$times.prop('disabled', !$target.prop('checked'));
  },

  cycleSelectHandler: function(e) {
    var $target = $(e.currentTarget);
    var data = $target.find(':checked').data('data');
    var html = [];

    if (data) {
      html.push('<span class="m-right-sm">计划开始时间：' + data.startTime + '</span>');
      html.push('<span class="m-right-sm">重复计划：');

      _(data.content).each(function(day) {
        var zhDay;
        switch(day) {
          case 1:
            zhDay = '周一';
            break;
          case 2:
            zhDay = '周二';
            break;
          case 3:
            zhDay = '周三';
            break;
          case 4:
            zhDay = '周四';
            break;
          case 5:
            zhDay = '周五';
            break;
          case 6:
            zhDay = '周六';
            break;
          case 7:
            zhDay = '周日';
            break;
          default:
            zhDay = day;
        }
        html.push(zhDay + ' ');
      });

      html.push('</span>');
      html.push('<span><button class="js-bb-plan-cycle-delete btn btn-linear btn-blue btn-circle">删除</button></span>');
    }

    this.$cycleDetailInner.html(html.join(''));
  },

  cycleAddHandler: function(e) {
    var self = this;
    var $dialog = Global.ui.dialog.show({
      title: '新建计划',
      body: this.cycleAddTpl()
    });

    var $form = $dialog.find('.js-bb-form');
    $form.parsley();

    var $startTime = $dialog.find('.js-bb-start-time');
    var $submit = $dialog.find('.js-bb-submit');

    $startTime.datetimepicker({
      format: 'HH:mm:ss'
    });

    $dialog.on('submit', '.js-bb-form', function() {
      $submit.button('loading');
      self.createCycleXhr(_($form.serializeArray()).serializeObject())
        .done(function(res) {
          if(res && res.result === 0) {
            Global.ui.notification.show('创建计划成功！');
            $dialog.modal('hide');
            self.renderCycleList();
          } else {
            Global.ui.notification.show('创建计划失败！错误原因：' + res.msg || '');
          }
        });
    });

    $dialog.on('hidden.modal', function() {
      $(this).remove();
    });
  },

  submitFormHandler: function(e) {
    var self = this;

    if (!this.$form.parsley().validate()) {
      return false;
    }

    var data = _(this.$form.serializeArray())
      .chain()
      .serializeObject()
      .extend({
        play: this.currentPlanModel.getCurrentPlan(this.schemeId).playList
      })
      .value();

    data.suspend = !!data.suspend;
    data.times = Number(data.times) || 0;

    data.play = _(data.play).map(function(playInfo) {
      return {
        playId: playInfo.playId,
        betNum: playInfo.betNum,
        moneyMethod: playInfo.method,
        betMethod: playInfo.modes,
        betMultiple: playInfo.times
      };
    });

    var ticketInfo = ticketConfig.getComplete(data.ticketId);

    //周期投注
    if (this.isCycle) {
      var cycleData = this.$cycleSelect.find(':selected').data('data');
      data.startTime = cycleData.startTime;
      data.cycle = cycleData.content.join(',');
    }

    this.confirmMoneyXhr(data)
      .done(function(res) {
        if(res && res.result === 0) {
          $(document).confirm({
            title: '确认计划',
            content: self.confirmTpl({
              ticketInfo: ticketInfo,
              ticketName: ticketInfo.info.zhName,
              singleTimeMoney: res.root || 0,
              data: data
            }),
            agreeCallback: function() {
              self.$submit.button('loading');
              self.confirmPlan(data)
                .always(function() {
                  self.$submit.button('reset');
                });
            }
          });
        } else {
          Global.ui.notification.show('取得计划信息失败！错误原因：' + res.msg || '');
        }
      })
  },

  confirmPlan: function(data) {
    return this.submitPlanXhr(data)
      .done(function(res) {
        if(res && res.result === 0) {
          var html = '<div class="text-center">' +
            '<p><span class="circle-icon"><i class="fa fa-check"></i></span></p>' +
            '<p class="font-md">恭喜您，计划投注成功！</p>' +
            '<p>您可以通过<a href="bb/pl" class="router btn btn-link text-hot" data-dismiss="modal">进行中的计划</a>查询您的投注记录！</p>' +
            '<div class="text-center"><button class="btn btn-pink btn-linear" data-dismiss="modal">确定</button></div>' +
            '</div>';

          var $dialog = Global.ui.dialog.show({
            title: '编辑方案名',
            body: html
          });

          $dialog.on('hidden.modal', function() {
            $(this).remove();
          });

        } else {
          Global.ui.notification.show('开始计划失败！错误原因：' + res.msg || '');
        }
      });
  },

  destroy: function() {
    clearInterval(this.updateTimer);
    Base.ItemView.prototype.destroy.apply(this, arguments);
  }
});

module.exports = PlanSettingView;