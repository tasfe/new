"use strict";

var PlanCollection = require('../collections/PlanCollection');

var MyCollectionsView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'change .js-bb-ticket-list': 'getCollectionHandler',
    'change .js-bb-collection-list': 'changePlanDetailsHandler',
    'click .js-bb-scheme-name-change': 'changeSchemeNameHandler',
    'click .js-bb-plan-delete': 'deleteSchemeHandler'
  },

  initialize: function() {
    this.collection = new PlanCollection();

    this.maxLength = 20;
  },

  getTicketListxhr: function() {
    return Global.sync.ajax({
      url: '/ticket/ticketmod/bmticketlist.json'
    });
  },

  onRender: function() {
    var self = this;

    this.$ticketList = this.$('.js-bb-ticket-list');
    this.$planDetails = this.$('.js-bb-plan-details');
    this.$collectionStauts = this.$('.js-bb-collection-status');
    this.$collectionList = this.$('.js-bb-collection-list');
    this.$planGridContainer = this.$('.js-bb-plan-grid-container');
    this.$planGrid = this.$('.js-bb-plan-grid');


    this.getTicketListxhr()
      .done(function(res) {
        if (res && res.result === 0) {
          self.$ticketList.html('<option>请选择</option>' + _(res.root).map(function(ticketInfo) {
            return '<option value="' + ticketInfo.ticketId + '">' + ticketInfo.ticketName + '</option>';
          }).join(''));
        }
      });
  },

  renderCurrentList: function(model) {
    var self = this;
    var info = model.toJSON();
    this.$collectionStauts.text(info.used + '/' + info.total);
    this.$collectionList.html(_(info.dateList).map(function(collectionInfo) {
      return '<option value="' + collectionInfo.schemeId + '" ' + (collectionInfo.schemeId === self.schemeId ? 'selected' : '') + '>' + collectionInfo.schemeName + '</option>';
    })).trigger('change');

    this.$planDetails.removeClass('hidden');
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
        {label: '收藏备注', name: 'schemeName', width: '10%', merge: true, formatter: function(val) {
          return '<a type="button" class="js-bb-scheme-name-change btn btn-link"><i class="fa fa-share-square-o vertical-middle"></i>' + val + '</a>';
        }},
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
        }},
        {label: '操作', name: '', width: '10%', formatter: function(val, index, thisRow) {
          return '<button type="button" class="js-bb-plan-delete btn btn-link">删除</button>';
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

  changeSchemeNameHandler: function(e) {
    var self = this;
    var model = this.currentPlanModel;
    var schemeDetail = this.currentPlanModel.getCurrentPlan(this.schemeId);

    var $dialog = Global.ui.dialog.show({
      title: '编辑方案名',
      modalClass: 'modal-sm',
      body: '<form class="js-form form-horizontal" action="javascript:void(0)">' +
      '<div class="control-group">' +
      '<label class="control-label">方案名称：</label>' +
      '<div class=" controls">' +
      '<input class="" type="text" name="schemeName" value="' + schemeDetail.schemeName + '" data-parsley-required data-parsley-zhlength="[0, 20]" autocomplete="off" />' +
      '<input type="hidden" name="schemeId" value="' + schemeDetail.schemeId + '" />' +
      '</div>' +
      '</div>' +
      '<div class="control-group">' +
      '<div class="controls"><button class="js-submit btn btn-linear btn-pink" data-loading-text="确定">确定</button></div>' +
      '</form>'
    });

    $dialog.on('hidden.modal', function() {
      $(this).remove();
    }).on('submit', '.js-form', function(e) {
      var $form = $(e.currentTarget);
      var $submit = $form.find('.js-submit');
      var parsley = $form.parsley();

      if (!parsley.validate()) {
        return false;
      }

      var reqData = _($form.serializeArray()).serializeObject();

      $submit.button('loading');

      model.updateSchemeXhr(reqData)
        .always(function() {
          $submit.button('loading');
        })
        .done(function(res) {
          if(res && res.result === 0) {
            Global.ui.notification.show('修改成功');
            $dialog.modal('hide');
          } else {
            Global.ui.notification.show('修改失败！错误原因：' + res.msg || '');
          }
        });
    });
  },

  deleteSchemeHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);
    var model = this.currentPlanModel;
    var schemeDetail = model.getCurrentPlan(this.schemeId);
    var rowData = this.$planGrid.staticGrid('getRowData', $target);

    var html = '<div class="text-center"><p><span class="circle-icon"><i class="fa fa-commenting"></i></span></p><p class="font-md">请问您是否需要删除“' + schemeDetail.schemeName + '”收藏记录？</p></div>';
    $(document).confirm({
      content: html,
      agreeCallback: function() {
        model.deleteSchemePlayXhr({
          schemeId: self.schemeId,
          schemePlayId: rowData.schemePlayId
        })
          .done(function(res) {
            if (res && res.result === 0) {
              Global.ui.notification.show('删除成功');
            } else {
              Global.ui.notification.show('删除失败！错误原因：' + res.msg || '');
            }
          });
      }
    });
  }
});

module.exports = MyCollectionsView;