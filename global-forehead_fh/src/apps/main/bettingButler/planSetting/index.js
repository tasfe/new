"use strict";

var PlanCollection = require('../collections/PlanCollection');

var BtnGroup = require('com/btnGroup');

var ticketConfig = require('skeleton/misc/ticketConfig');

var PlanSettingView = Base.ItemView.extend({

  template: require('./index.html'),

  confirmTpl: _(require('./confirm.html')).template(),

  events: {
    'change .js-bb-ticket-list': 'getCollectionHandler',
    'change .js-bb-collection-list': 'changePlanDetailsHandler',
    'change .js-bb-times-switch': 'switchTimesHandler',
    'submit .js-bb-form': 'submitFormHandler'
  },

  getTicketListxhr: function() {
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
      url: '/ticket/betManager/project0.json',
      data: data,
      tradition: true
    });
  },

  initialize: function() {
    var self = this;

    this.collection = new PlanCollection();

    this.updateTime();
    this.updateTimer = setInterval(function() {
      self.updateTime();
    }, 60000);
  },

  updateTime: function() {
    var self = this;
    this.getLastTimeXhr()
      .done(function(res) {
        if (res && res.result === 0) {
          self.lastTime = (moment(res.root) || moment()).add(5, 'minutes');
          self.$startTime.data('DateTimePicker').minDate(self.lastTime);
          if (self.lastTime.isAfter(self.$startTime.data('DateTimePicker').date())) {
            self.$startTime.data('DateTimePicker').date(self.lastTime);
          }
        }
      });
  },

  onRender: function() {
    var self = this;

    this.$ticketList = this.$('.js-bb-ticket-list');
    this.$startTime = this.$('.js-bb-start-time');
    this.$typeGroup = this.$('.js-ac-type-group');
    this.$collectionList = this.$('.js-bb-collection-list');
    this.$planGridContainer = this.$('.js-bb-plan-grid-container');
    this.$planGrid = this.$('.js-bb-plan-grid');
    this.$planDetails = this.$('.js-bb-plan-details');
    this.$chasePlans = this.$('.js-bb-periods');
    this.$form = this.$('.js-bb-form');
    this.$submit = this.$('.js-bb-submit');
    this.$times = this.$('.js-bb-times');

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
        // self.timeset.$startDate.data("DateTimePicker").date(moment().add(offset, 'days').startOf('day'));
        // self.timeset.$endDate.data("DateTimePicker").date(moment().add(offset === -1 ? -1 : 0, 'days').endOf('day'));
        // (self.$('.js-ac-search-form') && !self.firstTime) && self.$('.js-ac-search-form').trigger('submit');
        // return false;
      }
    }).render();

    this.getTicketListxhr()
      .done(function(res) {
        if (res && res.result === 0) {
          self.$ticketList.html('<option>请选择</option>' + _(res.root).map(function(ticketInfo) {
              return '<option value="' + ticketInfo.ticketId + '">' + ticketInfo.ticketName + '</option>';
            }).join(''));
        }
      });


    this.$startTime.datetimepicker({
      format: 'YYYY-MM-DD HH:mm:ss',
      useCurrent: false,
      maxDate: moment().add(7, 'days').startOf('day').toDate(),
      keepInvalid: false
    });

    this.$form.parsley();
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
    if (!_(schemeDetail && schemeDetail.playList).isEmpty()) {
      this.renderPlanGrid(schemeDetail);
      this.$planGridContainer.removeClass('hidden');

    } else {
      this.$planGridContainer.addClass('hidden');
    }
  },

  renderPlanGrid: function(schemeDetail) {
    var self = this;
    var is11xuan5 = schemeDetail.schemeName.indexOf('11选5') !== -1;

    if (this.$planGrid.staticGrid('instance')) {
      this.$planGrid.staticGrid('destroy');
    }

    this.$planGrid.staticGrid({
      tableClass: 'table table-bordered table-center',
      height: 280,
      colModel: [
        {label: '收藏备注', name: 'schemeName', width: '10%', merge: true},
        {label: '玩法名', name: 'playName', width: '10%', merge: true},
        {label: '投注内容', name: 'betNum', width: '15%', formatter: function(val, index, thisRow) {
          var html =  is11xuan5 ? val : val.replace(/ /g,'');
          if (thisRow.rx) {
            html  = '<a class="js-uc-betDetail-optional-betNum btn-link btn-link-hot" data-id="'+thisRow.ticketBetPlayId+'"">详细号码</a>';
          }else if(html.length>self.maxLength ){
            html  = '<a class="js-uc-betDetail-betNum btn-link btn-link-hot">详细号码</a>';
          }
          return html;
        }},
        {label: '倍数', name: 'times', width: '8%'},
        {label: '投注模式', name: 'method', width: '10%', formatter: function(val) {
          return val === 10000 ? '元' : val === 1000 ? '角' : val === 100 ?  '分' : '厘';
        }}
      ],
      row: _(schemeDetail.playList).map(function(playInfo) {
        playInfo.schemeName = schemeDetail.schemeName;
        return playInfo;
      })
    });

    var no = 0;

    _(schemeDetail.playList).each(function(item){
      item.betNum = is11xuan5 ? item.betNum : item.betNum.replace(/ /g,'');
      if(item.betNum.length>self.maxLength && !item.rx){
        $(self.$('.js-uc-betDetail-betNum')[no++]).popover({
          title: '详细号码',
          trigger: 'manual',
          html: true,
          container: this.$el,
          content: '<div class="js-pf-popover"><span class="word-break">'+ item.betNum +'</span></div>',
          placement: 'right'
        }).on("click", function (e) {
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

    if (!ticketId) {
      this.$planDetails.addClass('hidden');
      return false;
    }

    var planModel = this.collection.add({
      ticketId: ticketId
    });

    if (this.currentPlanModel) {
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
        if (res && res.result === 0) {
          self.$chasePlans.data('monitorRange', [1, res.root.length]).trigger('keyup');
        }
      });
  },

  switchTimesHandler: function(e) {
    var $target = $(e.currentTarget);
    this.$times.prop('disabled', !$target.prop('checked'));
  },

  submitFormHandler: function(e) {
    var self = this;

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

    this.confirmMoneyXhr(data)
      .done(function(res) {
        if (res && res.result === 0) {
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
        if (res && res.result === 0) {
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