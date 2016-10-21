"use strict";

var SearchGrid = require('com/searchGrid');


var PointsListView = SearchGrid.extend({

  template: require('agencyCenter/templates/pointsList.html'),

  events: {
    'click .js-allSelect': 'selectAllHandler'
  },

  selectAllHandler:function() {
    var hasChk = $('.js-allSelect').prop('checked');
    $("input[type='checkbox']").prop("checked",hasChk);

  },

  initialize: function () {
    _(this.options).extend({
      columns: [
        {
          name: ' ',
          width: '8.5%'
        },
        {
          name: ' ',
          width: '8.5%'
        },
        {
          name: ' ',
          width: '84%'
        }
      ],
      gridOps: {
        emptyTip: '没有记录'
      },
      ajaxOps: {
        url: '/acct/vip/totalUserIntegral.json'
        //url: '/ticket/bethistory/userbethistory.json?_t=1'
        //,abort: true
      },
      viewType: 'team',
      reqData: {
        subUser: 1
      },
      listProp: 'root.dataList',
      //listProp: 'root.betList',
      height: 345
      ,showHead: 'hidden'
    });

  },

  onRender: function() {

    var  self = this;


    this.getConfigInfoXhr()
      .done(function(res) {
        var v0 = res.root.v0num/10000;
        var v1 = res.root.v1num/10000;
        var v2 = res.root.v2num/10000;
        var v3 = res.root.v3num/10000;
        var v4 = res.root.v4num/10000;
        var v5 = res.root.v5num/10000;
        var v6 = res.root.v6num/10000;

        self.$('.js-points').html('<span class="js-vip0">'+v0+'</span>'+
          '<span class="js-vip1">'+v1+'</span>'+
          '<span class="js-vip2">'+v2+'</span>'+
          '<span class="js-vip3">'+v3+'</span>'+
          '<span class="js-vip4">'+v4+'</span>'+
          '<span class="js-vip5">'+v5+'</span>'+
          '<span class="js-vip6">'+v6+'</span>');

        if(self.options.reqData.username){
          self.$('input[name="username"]').val(self.options.reqData.username);
        }

        SearchGrid.prototype.onRender.apply(self, arguments);
      })




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
    });

    //加上统计行

    this.grid.addFooterRows({

    })
      .hideLoading();
  },

  getConfigInfoXhr: function() {
    return Global.sync.ajax({
      url: '/acct/vip/queryVipIntegralCfg.json'
    });
  },

  formatRowData: function(rowInfo) {
    var userName =  rowInfo.userName; //"2016-06-10";//当前日期
    var memberLevel = rowInfo.memberLevel;
    var integral =  rowInfo.integral/10000; //"100" ; //用户积分

    //var userName =  'test';//当前日期
    //var memberLevel = 'v3';
    //var integral =  '100'; //"100" ; //用户积分

    var pointLevels = [0,100 ,1500, 3000, 5000, 15000, 30000];

    var row = [];
    row.push('<span class="pull-center">' + userName + '</span>');

    row.push('<span class="pull-center">' + memberLevel + '</span>');


    var v0 = $('.js-vip0').html();
    var v1 = $('.js-vip1').html();
    var v2 = $('.js-vip2').html();
    var v3 = $('.js-vip3').html();
    var v4 = $('.js-vip4').html();
    var v5 = $('.js-vip5').html();
    var v6 = $('.js-vip6').html();
    var cvalue = 14.2857;
    var tempValue = 0;
    var tempIndex = 0;
    var tempNext = 0;
    pointLevels = [v0,v1,v2,v3,v4,v5,v6];

    for(var i=1; i<pointLevels.length;i++) {
      if(pointLevels[i] >= integral) {

        tempValue = pointLevels[i-1];
        tempIndex = i-1;
        tempNext = pointLevels[i];
        break;
      }
    }
    var withValue = tempIndex*cvalue + ( (integral-tempValue)/(tempNext - tempValue))*cvalue ;



    var vippoints = '<div class="progressbar_1"  style="text-align: left">'+
      '<div class="bar" style="width: '+withValue+'%;"></div><span style="margin-left: '+withValue+'%">'+integral+
      '</span></div>';
    row.push(vippoints);

    return row;
  }
});

module.exports = PointsListView;
