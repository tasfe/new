"use strict";

var SearchGrid = require('com/searchGrid');

var Timeset = require('com/timeset');
var BtnGroup = require('com/btnGroup');
var SignedView = require('./signed');
var MySalaryView = require('./mySalaryDetail');
var AgreeView = require('./agree');
var dividendConfig = require('./salaryConfig');

var SalaryManageView = SearchGrid.extend({

  template: require('./index.html'),

  events: {
    //'click .js-ac-state': 'stateHandler',
    'click .js-ac-daily-salary-payout': 'payoutSalaryHandler',
    'click .js-ac-sm-watch': 'checkMySalaryHandler',
    'click .js-ac-sm-add-user': 'addUserHandler',
    'click .js-ac-sm-set': 'updateConfigHander',
    'click .js-ac-sm-pay-all': 'payoutAllHandler'

  },

  //查询我的日薪
  getMySalaryXhr: function(data){
    return Global.sync.ajax({
      url: '/info/dailysalary/list.json',
      data: _(data).extend({subUser:0})
    });
  },
  //发放日薪
  payoutSalaryXhr: function(data){
    return Global.sync.ajax({
      url: '/info/dailysalary/send.json',
      data: data
    });
  },

  //查询日薪签约信息
  getSalaryConfXhr: function(data){
    return Global.sync.ajax({
      url: '/info/dailysalary/info.json',
      data: data
    });
  },

  //签约、修改
  signAgreementXhr: function(data){
    return Global.sync.ajax({
      url: '/info/dailysalary/sign.json',
      data: data,
      tradition: true
    });
  },

  initialize: function () {
    _(this.options).extend({
      height: 330,
      title: '报表查询',
      columns: [
        {
          name: '结算日期',
          width: '15%'
        },
        {
          name: '用户名',
          width: '12%'
        },
        {
          name: '返点',
          width: '11%'
        },
        {
          name: '销量',
          width: '15%'
        },
        {
          name: '日薪',
          width: '15%'
        },
        {
          name: '状态',
          width: '12%'
        },
        {
          name: '操作',
          width: '20%'
        }
      ],
      gridOps: {
        emptyTip: '没有发放记录'
      },
      ajaxOps: {
        url: '/info/dailysalary/list.json'
//        ,abort: false
      },
      reqData: {
        subUser: 1 //0代表自己，1表示下级
      },
      listProp: 'root.dataList',
      tip: '<div class="m-left-md">注意:日薪记录只保留最近35天数据。</div>',
      
    });
  },


  onRender: function() {

    var acctInfo = Global.memoryCache.get('acctInfo');

    if (acctInfo.salaryStatus === dividendConfig.getByName('APPLYING').id) {//APPLYING
      //申请中
      this.$el.html(new AgreeView().render().$el);
    } else if (acctInfo.salaryStatus === dividendConfig.getByName('APPLIED').id) {
      //初始化时间选择
      //new Timeset({
      //  el: this.$('.js-pf-timeset'),
      //  startDefaultDate: this.options.reqData.startTime?this.options.reqData.startTime:_(moment().startOf('day')).toTime(),
      //  endDefaultDate: this.options.reqData.endTime?this.options.reqData.endTime:_(moment().endOf('day')).toTime()
      //}).render();
      var self = this;
      this.$btnGroup = this.$('.js-ac-btnGroup');
      this.$timeset = this.$('.js-ac-timeset');
      //初始化时间选择
      this.timeset = new Timeset({
        el: this.$timeset,
        prevClass: 'js-pf',
        startDefaultDate: _(moment().startOf('day')).toTime(),
        endDefaultDate: _(moment().endOf('day')).toTime()
      }).render();
      

      this.firstTime = true;
      this.btnGroup = new BtnGroup({
        el: this.$btnGroup,
        prevClass: 'js',
        styleClass: 'btnGroup-gray',
        onBtnClick: function(offset) {
          self.timeset.$startDate.data("DateTimePicker").date(moment().add(offset, 'days').startOf('day'));
          self.timeset.$endDate.data("DateTimePicker").date(moment().add(offset === -1 ? -1 : 0, 'days').endOf('day'));
          self.search();
          return false;
        }
      }).render();
      this.firstTime = false;

      self.timeset.$startDate.data("DateTimePicker").date(moment().add(-1, 'days').startOf('day'));
      self.timeset.$endDate.data("DateTimePicker").date(moment().add(-1, 'days').endOf('day'));
      this.$btnGroup.find('button').removeClass('active');

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
      SearchGrid.prototype.onRender.apply(this, arguments);
      //this.SalaryConfigRequest = this.getSalaryConfXhr();
    }

  },

  renderGrid: function(gridData) {
    var rowsData = _(gridData.dataList).map(function(info, index, list) {
      return {
        columnEls: this.formatRowData(info, index, list),
        dataAttr: info
      };
    }, this);

    this.grid.refreshRowData(rowsData, gridData.rowCount, {
      pageIndex: this.filterHelper.get('pageIndex'),
      initPagination: true
    }).hideEmpty();

    //加上统计行

    this.grid.addFooterRows({
        trClass: 'tr-footer',
        columnEls: [
          {

            content: '<div class="font-sm">所有页总计</div>'
          },'','',
          _(gridData.saleAmountTotal).convert2yuan() ,
          _(gridData.salaryAmountTotal).convert2yuan() ,
          {
            colspan: 2,
            content: '<div><button class="js-ac-sm-pay-all font-sm ac-sm-pay-all">一键全派发</button></div>'
          }
        ]
      })
      .hideLoading();
  },

  formatRowData: function(rowInfo) {
    var row = [];

    row.push(_(rowInfo.salaryDate).toDate());
    row.push(rowInfo.userName);
    row.push(_(rowInfo.userRebate).formatDiv(10));
    row.push(rowInfo.saleAmount/10000);
    row.push(rowInfo.salaryAmount/10000);
    //row.push(rowInfo.status);
    var statusDes = '';
    var operate = '';
    switch (rowInfo.status) {
      case 0:
        statusDes = '未发放';
        operate = '<a class="js-ac-daily-salary-payout btn btn-link margin-sm" data-id="' + rowInfo.salaryId + '">派发日薪</a>';
        break;
      case 1:
        statusDes = '已发放';
        break;
      default:
        statusDes = '';
    }
    operate = operate + '<a class="js-ac-sm-set btn btn-link" data-name="'+rowInfo.userName+'" data-id="'+rowInfo.userId+'">设置</a>'
    row.push(statusDes);
    row.push(operate);
    return row;
  },

  //stateHandler: function(e) {
  //  var self = this;
  //  var $target = $(e.currentTarget);
  //
  //  $.when(this.SalaryConfigRequest).done(function(res){
  //    if(res.result===0){
  //      var confList = res.root.itemList;
  //      var str = _(self.des_template).template()({confList:confList,size:_(confList).size()});
  //      var $dialog = Global.ui.dialog.show({
  //        title: '平台日工资规则',
  //        body: str,
  //        modalClass: 'ten',
  //        size: 'modal-lg',
  //        footer: ''
  //      }).on('hidden.modal', function() {
  //        $(this).remove();
  //      });
  //    }else{
  //      Global.ui.notification.show('配置信息获取失败。')
  //    }
  //
  //  });
  //
  //},

  //派发日薪
  payoutSalaryHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);
    var salaryId = $target.data('id');
    this.payoutSalaryXhr({salaryId: salaryId}).done(function(res) {
      if(res.result===0){
        self.render();
        Global.ui.notification.show('操作成功！');
      }else{
        Global.ui.notification.show('请求失败。')
      }
    });
  },

  checkMySalaryHandler: function(e){
    var self = this;
    var $target = $(e.currentTarget);

    var $dialog = Global.ui.dialog.show({
      title: '我的日薪',
      body: '<div class="js-ac-add-container"></div>',
      modalClass: 'ten',
      size: 'modal-lg',
      footer: ''
    }).on('hidden.modal', function () {
      $(this).remove()
    });

    var $container = $dialog.find('.js-ac-add-container');

    var mySalaryView = new MySalaryView({
      el: $container,
    })
      .render()
      .on('hide', function() {
        self.render();
        $dialog.modal('hide');
      });

    $dialog.on('hidden.modal', function() {
      $(this).remove();
      mySalaryView.destroy();
    });

  },


  updateConfigHander: function(e){
    var self = this;
    var $target = $(e.currentTarget);
    var username = $target.data('name');
    var userId = $target.data('id');
    this.getSalaryConfXhr({userId: userId, username: username}).done(function(res){
      if(res.result===0){
        var config = res.root;
        //格式化
        config = _(config).map(function(item){
          return {
            saleAmount : _(item.saleAmount).convert2yuan({fixed:0}),
            salaryAmount : _(item.salaryAmount).convert2yuan({fixed:0}),
            lossLimit : _(item.lossLimit).convert2yuan({fixed:0}),
            needLoss: item.needLoss
          }


        });
        var $dialog = Global.ui.dialog.show({
          title: '设置下级账号：<span style="color:#f1c112">'+username+'</span>的签约日薪',
          body: '<div class="js-ac-add-container"></div>',
          modalClass: 'ten',
          size: 'modal-lg',
          footer: ''
        }).on('hidden.modal', function () {
          self.render();
          $(this).remove()
        });

        var $container = $dialog.find('.js-ac-add-container');

        var List = res.root;
        var salaryType = (config &&  List[0].salarySpan>0 && '1')||'0';

        var signedView = new SignedView({
          el: $container,
          agreementList: (salaryType==='0' && config) || [],
          username: username,
          userId: userId,
          salaryType:  salaryType,
          minSales: (config && config[0].salaryAmount)||0,
          minSalary:  (config && config[0].salaryAmount)||0,
          salesSpan:  (List &&  _(List[0].saleSpan).convert2yuan({fixed:0}) )||0,
          salarySpan:  (List &&  _(List[0].salarySpan).convert2yuan({fixed:0}) )||0,
          maxSalary:  (List &&  _(List[0].maxSalary).convert2yuan({fixed:0}))||0,
          needLoss: (List && List[0].needLoss && '1')||'0'
        })
          .render()
          .on('hide', function() {
            //self.refresh();
            $dialog.modal('hide');
          });

        $dialog.on('hidden.modal', function() {
          $(this).remove();
          signedView.destroy();
        });
        $dialog.find('.js-ac-next').on('click',function(){
          var conf = signedView.getConfigDataFormTable();
          if(conf){
            self.signAgreementXhr(conf).done(function(res){
              if(res.result==0){
                Global.ui.notification.show('操作成功！');
                $dialog.modal('hide');
              }else{
                Global.ui.notification.show('操作失败！'+res.msg);
              }
            }).fail(function(res){
              Global.ui.notification.show('请求失败！');
            });
          }
        });

      }
    })
  },
  payoutAllHandler: function(e){
    var self = this;
    var $target = $(e.currentTarget);
    var salaryId = $target.data('id');
    this.payoutSalaryXhr({salaryId: -1}).done(function(res) {
      if(res.result===0){
        self.render();
        Global.ui.notification.show('操作成功！');
      }else{
        Global.ui.notification.show('操作失败。')
      }
    });
  }

});

module.exports = SalaryManageView;