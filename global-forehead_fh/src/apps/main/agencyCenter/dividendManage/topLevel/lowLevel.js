"use strict";

var SearchGrid = require('com/searchGrid');

var grantConfig = require('./../grantConfig');

var DividendDetailView = require('./../dividendDetail');

var SignedView = require('../signed');

var LowLevelView = SearchGrid.extend({

  template: require('./lowLevel.html'),

  events: {
    'click .js-ac-grant': 'grantHandler',
    'click .js-ac-multi-grant': 'multiGrantHandler',
    'click .js-ac-dm-ll-detail': 'getAgentDetailHandler'
  },

  giveOutXhr: function(data) {
    return Global.sync.ajax({
      url: '/fund/divid/give.json',
      data: data
    });
  },

  getDividendDetailXhr: function(data) {
    return Global.sync.ajax({
      url: '/fund/divid/subdividdetail.json',
      data: data
    });
  },

  initialize: function() {
    _(this.options).extend({
      columns: [
        {
          name: '分红周期',
          width: '11%'
        },
        {
          name: '用户名',
          width: '11%'
        },
        {
          name: '周期总销量',
          width: '13%'
        },
        {
          name: '日均销量',
          width: '13%'
        },
        {
          name: '总盈亏',
          width: '13%'
        },
        {
          name: '分红比',
          width: '8%'
        },
        {
          name: '分红金额',
          width: '13%'
        },
        {
          name: '状态',
          width: '8%'
        },
        {
          name: '操作',
          width: '10%'
        }
      ],
      gridOps: {
        emptyTip: '没有发放记录'
      },
      ajaxOps: {
        url: '/fund/divid/subdivid.json'
      },
      checkable: false,
      listProp: 'root.dividList',
      //tip: '<span class="m-right-sm vertical-middle"><span class="js-pf-select-all cursor-pointer">全选</span> | ' +
      //'<span class="js-pf-inverse cursor-pointer">反选</span></span>' +
      //'<div class="btn-group"><button class="js-ac-multi-grant btn btn-sm btn-hot">发放</button></div>',
      height: 310
    });
  },

  serializeData: function() {
    return {
      grants: grantConfig
    };
  },

  onRender: function() {

    this.generateCycle();
    this.$('select[name=status]').append(_(grantConfig.getAll()).map(function(grant) {
      return '<option value="' + grant.id + '">' + grant.zhName + '</option>';
    }).join(''));

    //this.$('.js-pf-breadcrumb').before(
    //  '<div class="alert">' +
    //  '<i class="fa fa-exclamation-circle font-md text-hot pull-left"></i>' +
    //  '<div class="overflow-hidden">' +
    //  '提示：下级分红每月1号和16号结算，只保留上一次的记录，未按时下发分红给下级平台会强制发放。' +
    //  '</div>' +
    //  '</div>'
    //);

    SearchGrid.prototype.onRender.apply(this, arguments);
  },

  generateCycle: function(){
    var $cycle = this.$('.js-ac-dm-lowLeve-cycle');
    var options = [];
    var now = moment();
    var time1 = moment().set('date',1);
    var month1 = time1.month()+1;
    var cycle1 = time1.format('YYYY-MM-D');
    var time2 = moment().set('date',16);
    var cycle2 = time2.format('YYYY-MM-D');
    var cycles = [];
    if(now>=time2){
      cycles.push('<option value="'+cycle2+'">'+month1+'月下半月'+'</option>')
    }
    cycles.push('<option value="'+cycle1+'">'+month1+'月上半月'+'</option>');
    _(2).chain().range().each(function(item,index){
      var time3 = moment().subtract(item+1,'month').set('date',1);
      var time4 = moment().subtract(item+1,'month').set('date',16);
      var cycle3 = time3.format('YYYY-MM-D');
      var month3 = time3.month()+1;
      var cycle4 = time4.format('YYYY-MM-D');
      cycles.push('<option value="'+cycle4+'">'+month3+'月下半月'+'</option>');
      cycles.push('<option value="'+cycle3+'">'+month3+'月上半月'+'</option>');
    }).value();
    $cycle.html(cycles.join(''));

  },

  renderGrid: function(gridData) {
    var rowsData = _(gridData.dividList).map(function(info, index, list) {
      return {
        id: info.dividId,
        columnEls: this.formatRowData(info, index, list),
        dataAttr: info
      };
    }, this);

    this.grid.refreshRowData(rowsData, gridData.rowCount, {
      pageIndex: this.filterHelper.get('pageIndex'),
      initPagination: false
    });

    //加上统计行

    //this.grid.addFooterRows({
    //  trClass: 'tr-footer',
    //  columnEls: [
    //    '', '',
    //    _(gridData.dividTotal).convert2yuan(),
    //    '', ''
    //  ]
    //})
    //  .hideLoading();
    this.grid.hideLoading();
  },

  formatRowData: function(rowInfo) {
    var row = [];

    row.push('<button type="button" class="js-ac-dm-ll-detail btn btn-link btn-link-hot btn-sm" data-id="'+rowInfo.dividId+'"  data-name="'+rowInfo.username+'">'+rowInfo.cycle+'</button>');
    row.push(rowInfo.username);
    row.push('<span class="">' + _(rowInfo.betTotal).convert2yuan({fixed: 4, clear: false})+'</span>');
    row.push('<span class="">'+_(rowInfo.dailyBet).convert2yuan({fixed: 4, clear: false})+ '</span>');
    var profitSpan='<span class="text-hot">' + _(rowInfo.profitTotal).convert2yuan({fixed: 4, clear: false}) + '</span>';
    if(rowInfo.profitTotal>0){
      profitSpan='<span class="text-green">+' + _(rowInfo.profitTotal).convert2yuan({fixed: 4, clear: false}) + '</span>';
    }
    row.push(profitSpan);
    row.push('<span class="text-hot">' + _(rowInfo.divid).formatDiv(100,{fixed: 0, clear: true}) + '%</span>');
    row.push('<span class="text-hot">' + _(rowInfo.dividTotal).convert2yuan({fixed: 4, clear: false}) + '</span>');

    row.push(grantConfig.getZh(rowInfo.status));

    var operate = [];

    if (rowInfo.status === grantConfig.getByName('WAIT').id) {
      operate.push('<button class="js-ac-grant btn btn-link btn-link-hot ac-dm-ll-detail-btn">发放</button>');
    }

    row.push(operate.join(''));

    return row;
  },

  _giveOut: function($target, data) {
    var self = this;

    $(document).confirm({
      title: '提示',
      content: '确定将分红发放至下级？',
      agreeCallback: function() {
        $target.button('loading');
        self.giveOutXhr(data)
          .always(function() {
            $target.button('reset');
          })
          .done(function(res) {
            if (res && res.result === 0) {
              self._getGridXhr();
            } else {
              Global.ui.notification.show(res.msg || '');
            }
          });
      }
    });
  },

  //event handlers

  grantHandler: function(e) {
    var $target = $(e.currentTarget);
    var data = this.grid.getRowData($target);

    this._giveOut($target, {
      dividId: data.dividId
    });
  },

  multiGrantHandler: function(e) {
    var $target = $(e.currentTarget);
    var ids = this.grid.getChk().ids;

    if (!ids) {
      return false;
    }

    this._giveOut($target, {
      dividId: ids.join(',')
    });
  },

  getAgentDetailHandler: function(e){
    var self = this;
    var $target = $(e.currentTarget);
    var dividId = $target.data('id');
    var username  = $target.data('name');

    self.getDividendDetailXhr({
        dividId: dividId,
      })
      .always(function() {
      })
      .done(function(res) {
        if (res && res.result === 0) {

          var $dialog = Global.ui.dialog.show({
            title: '每日报表',
            size: 'modal-lg',
            body: '<div class="js-ac-detail"></div>',
            footer: ''
          });

          $dialog.on('hidden.modal', function() {
            $(this).remove();
          });

          var $detail = $dialog.find('.js-ac-detail');

          $detail.staticGrid({
            wrapperClass: 'm-top-md',
            height: '310',
            colModel: [
              {label: '日期', name: 'cycle', merge: false, width: 100},
              {label: '用户', name: 'username', merge: false, width: 100,formatter:function(val){
                return val;
              }},
              {label: '团队销量', name: 'betTotal', merge: false, width: 100},
              {label: '盈亏', name: 'profitTotal', width: 100},
              {label: '操作', name: 'username', width: 100,formatter:function(val){
                return '<a href="#ac/tpl?username=' + val + '" class="btn btn-link router ac-dm-ll-detail-btn" data-dismiss="modal">查看</a>';
              }}
            ],
            row: self.formatData((res.root && res.root.dividList)||[]),
            startOnLoading: false
          });
        }else{
          Global.ui.notification.show(res.msg)
        }
        //self.refresh();
      });
  },
  //格式化我的分红数据
  formatData: function(list){
    //金额负的红色，正的绿色
    return _(list).map(function(item){
      return {
        cycle: item.cycle,
        username: item.username,
        betTotal: _(item.betTotal).convert2yuan(),
        profitTotal: _(item.profitTotal).convert2yuan({clear: true,color0: '#3c993b',color1: '#ce010f'})
      }
    })

  }
});

module.exports = LowLevelView;
