"use strict";
var SearchGrid = require('com/searchGrid');

var userManageConfig = require('./userManageConfig');
var SalaryConfView = require('./../salaryConf');

var SignedView = require('./../signed');

var UserManageView = SearchGrid.extend({

  template: require('./index.html'),

  events: {
    'click .js-ac-sponsor': 'sponsorConfigHander',
    'click .js-ac-modify': 'updateConfigHander',
    'click .js-ac-sm-watch': 'watchMySalarayConfHandler'
  },

  getSubUserListXhr: function(data){
    return Global.sync.ajax({
      url: '/info/dailysalary/sublist.json',
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

  //查询日薪签约信息
  getSalaryConfXhr: function(data){
    return Global.sync.ajax({
      url: '/info/dailysalary/info.json',
      data: data
    });
  },
  initialize: function () {
    _(this.options).extend({
      height: 310,
      title: '报表查询',
      columns: [

        {
          name: '用户名',
          width: '18%'
        },
        {
          name: '首次签约时间',
          width: '20%'
        },
        {
          name: '最后签约时间',
          width: '20%'
        },

        {
          name: '状态',
          width: '17%'
        },
        {
          name: '操作',
          width: '25%'
        }
      ],
      gridOps: {
        emptyTip: '没有签约记录'
      },
      ajaxOps: {
        url: '/info/dailysalary/sublist.json'
//        ,abort: false
      },
      reqData: {
        subUser: 1 //0代表自己，1表示下级
      },
      listProp: 'root.dataList',

    });
  },

  onRender: function() {
    var self = this;

    SearchGrid.prototype.onRender.apply(this, arguments);
  },

  renderGrid: function(gridData) {
    this.gridDate = gridData;
    var rowsData = _(gridData.dataList).map(function(info, index, list) {
      return {
        columnEls: this.formatRowData(info, index, list),
        dataAttr: info
      };
    }, this);

    this.grid.refreshRowData(rowsData, gridData.rowCount, {
      pageIndex: this.filterHelper.get('pageIndex'),
      initPagination: true
    }).hideEmpty().hideLoading();
    //加上统计行

  },

  formatRowData: function(rowInfo) {
    return  {
      username: rowInfo.userName,
      agreeDate:  _(rowInfo.createDate).toTime(),
      effectDay: _(rowInfo.agreeDate).toTime(),
      status: userManageConfig.getZh(rowInfo.status),
      operate: userManageConfig.getOperate(rowInfo.status,rowInfo.agreeId)
    }
  },

  //event handlers
  sponsorConfigHander:function (e) {
    var self = this;
    var $target = $(e.currentTarget);
    var $tr = $target.closest('tr');
    var username = $tr.data('userName');
    var userId = $tr.data('userId');
    var id = $tr.data('agreeId');

    var rowInfo = _(this.gridDate.dataList).find(function(item){
      return item.agreeId == id;
    });
    var config = rowInfo.itemList;

    //格式化
    // config = _(config).map(function(item){
    //   return {
    //     saleAmount : _(item.saleAmount).convert2yuan({fixed:0}),
    //     salaryAmount : _(item.salaryAmount).convert2yuan({fixed:0}),
    //     lossLimit : _(item.lossLimit).convert2yuan({fixed:0}),
    //     needLoss: item.needLoss
    //   }
    // });

    // config = _(config).map(function(item){
    //   return {
    //     saleAmount : _(0).convert2yuan({fixed:0}),
    //     salaryAmount : _(0).convert2yuan({fixed:0}),
    //     lossLimit : _(0).convert2yuan({fixed:0}),
    //     needLoss: 0
    //   }
    // });

    var $dialog = Global.ui.dialog.show({
      title: '设置下级账号：<span style="color:#f1c112">'+username+'</span>的签约日薪',
      body: '<div class="js-ac-add-container"></div>',
      modalClass: 'ten',
      size: 'modal-lg',
      footer: ''
    }).on('hidden.modal', function () {
      //self.render();
      $(this).remove()
    });

    var $container = $dialog.find('.js-ac-add-container');

    var List = rowInfo.itemList;

    var signedView = new SignedView({
      el: $container,
      agreementList: [],
      username: username,
      userId: userId,
      salaryType:  '0',
      minSales: 0,
      minSalary:  0,
      salesSpan:  (List &&  _(List[0].saleSpan).convert2yuan({fixed:0}) )||0,
      salarySpan:  (List &&  _(List[0].salarySpan).convert2yuan({fixed:0}) )||0,
      maxSalary:  (List &&  _(List[0].maxSalary).convert2yuan({fixed:0}))||0,
      needLoss: (List && List[0].needLoss && '1')||'0'
    })
        .render()
        .on('hide', function() {
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
            self.render();
          }else{
            Global.ui.notification.show('操作失败！'+res.msg);
          }
        }).fail(function(res){
          Global.ui.notification.show('请求失败！');
        });
      }
    });
  },
  updateConfigHander: function(e){
    var self = this;
    var $target = $(e.currentTarget);
    var $tr = $target.closest('tr');
    var username = $tr.data('userName');
    var userId = $tr.data('userId');
    //this.getSalaryConfXhr({userId: userId, username: username}).done(function(res){
    //
    //
    //  if(res.result===0){

        var id = $tr.data('agreeId');
        var rowInfo = _(this.gridDate.dataList).find(function(item){
          return item.agreeId == id;
        });
        var config = rowInfo.itemList;
        //var config = res.root;
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
          //self.render();
          $(this).remove()
        });

        var $container = $dialog.find('.js-ac-add-container');

        //var List = res.root;
        var List = rowInfo.itemList;
        var salaryType = (config &&  List[0].salarySpan>0 && '1')||'0';

        var signedView = new SignedView({
          el: $container,
          agreementList: (salaryType==='0' && config) || [],
          username: username,
          userId: userId,
          salaryType:  salaryType,
          minSales: (config && config[0].saleAmount)||0,
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
                self.render();
              }else{
                Global.ui.notification.show('操作失败！'+res.msg);
              }
            }).fail(function(res){
              Global.ui.notification.show('请求失败！');
            });
          }
        });
    //
    //  }
    //})
  },
  watchMySalarayConfHandler: function(e) {

    var id = $(e.currentTarget).closest('tr').data('agreeId');
    var rowInfo = _(this.gridDate.dataList).find(function(item){
      return item.agreeId == id;
    });
    var agreement = rowInfo.itemList;
    var $dialog = Global.ui.dialog.show({
      title: '查看签约',
      body: '<div class="js-ac-add-container"></div>',
      modalClass: 'ten',
      size: 'modal-lg',
      footer: ''
    }).on('hidden.modal', function () {
      $(this).remove()
    });

    var $container = $dialog.find('.js-ac-add-container');

    var salaryConfView = new SalaryConfView({
      el: $container,
      agreement: agreement
    }).render();

    $dialog.on('hidden.modal', function () {
      $(this).remove();
      salaryConfView.destroy();
    });
  }


});

module.exports = UserManageView;
