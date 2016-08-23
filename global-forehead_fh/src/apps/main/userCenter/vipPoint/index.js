"use strict";

require('./style.scss');
var SearchGrid = require('com/searchGrid');
var FilterHelper = require('skeleton/misc/filterHelper');

var VipPointView = Base.ItemView.extend({

  template: require('userCenter/vipPoint/index.html'),

  events: {},

  initialize: function () {
    _(this.options).extend({
      columns: [
        {
          name: ' ',
          width: '23%'
        },
        {
          name: 'V0',
          width: '11%'
        },
        {
          name: 'V1',
          width: '11%'
        },
        {
          name: 'V2',
          width: '11%'
        },
        {
          name: 'V3',
          width: '11%'
        },
        {
          name: 'V4',
          width: '11%'
        },
        {
          name: 'V5',
          width: '11%'
        },
        {
          name: 'V6',
          width: '11%'
        }
      ],
      gridOps: {
        emptyTip: ''
      },
      ajaxOps: {
        url: 'acct/vip/vipIntegral.json'
      },
      //reqData:{
      //  token:""
      //},
      //tip: '<div class="m-left-md"><span>提示：</span> 只保留最近35天的记录。</div>',
      height: 500,
      showHead: 'hidden'
    });
  },


  onRender: function() {
    var self = this;

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

        self._getGridXhr();
      })


    this.filterHelper = new FilterHelper();
    this.$grid = this.$('.js-nc-platform-grid');
    this.initGrid(this.$grid);



  },

  _getGridXhr: function() {
    var self = this;
    var filters = this.filterHelper.get();
    this.grid
      .clean()
      .showLoading();

    Global.sync.ajax({
      url: this.options.ajaxOps.url,
      data: _(filters).extend(this.options.reqData)
    })
      .fail(function(def, type) {
        if (type !== 'abort') {
          //Global.ui.notification.show('服务器异常，无法加载列表');
          self.grid.hideLoading();
        }
      })
      .done(function(res) {
        console.log(res)
        if (res && res.result === 0) {
          self.renderGrid(res.root, res);
          //Global.m.news.updateUnReadNum({unReadNotice:res.root.unReadNotice});
        }
      });

    return this;
  },


  initGrid: function($grid) {
    var self = this;
    $grid.grid({
      tableClass: 'table table-unbordered  no-margin' ,
      height:500,
      checkable: false,
      columnDefinitions: this.options.columns,
      emptyTip: this.options.gridOps.emptyTip,
      showHead: this.options.showHead
    });

    this.grid = $grid.grid('instance');

    return this;
  },

  renderGrid: function(gridData) {
    var rowsData = _(gridData.dataList).map(function(info, index, list) {
      return {
        id: info.noticeId,
        columnEls: this.formatRowData(info, index, list),
        dataAttr: info
      };
    }, this);

    if (gridData && gridData.length) {
      this.grid.hideEmpty();
    } else {
      this.grid.renderEmpty();
    }

    this.grid.refreshRowData(rowsData, 35, {
      pageIndex: this.filterHelper.get('pageIndex'),
      initPagination: false
    })
      .hideLoading();

    this.grid.$pagination.addClass('hidden');
  },

  getConfigInfoXhr: function() {
    return Global.sync.ajax({
      url: '/acct/vip/queryVipIntegralCfg.json'
    });
  },

  formatRowData: function(rowInfo) {


    var currentDate = rowInfo.currentDate; //"2016-06-10";//当前日期
    var integral = rowInfo.integral/10000; //"100" ; //用户积分

    var row = [];
    row.push('<span class="pull-left">' + currentDate + '</span>');
    var v0 = $('.js-vip0').html();
    var v1 = $('.js-vip1').html();
    var v2 = $('.js-vip2').html();
    var v3 = $('.js-vip3').html();
    var v4 = $('.js-vip4').html();
    var v5 = $('.js-vip5').html();
    var v6 = $('.js-vip6').html();
    var pointLevels = [v0,v1,v2,v3,v4,v5,v6];
    var tempValue = 0;
    var tempIndex = 0;
    var tempNext = 0;
    for(var i=1; i<pointLevels.length;i++) {
      if(pointLevels[i] >= integral) {
          tempValue = pointLevels[i-1];
          tempIndex = i-1;
          tempNext = pointLevels[i];
           break;
      }
    }
    var cvalue = 14.2857;
    var withValue = tempIndex* cvalue + ( (integral-tempValue)/(tempNext - tempValue))*cvalue ;

    var vippoints = '<div class="progressbar_1" >'+
                    '<div class="bar" style="width: '+withValue+'%">'+'</div>'+
                     '<span style="margin-top:15px;position: absolute; margin-left: '+withValue+'% " >'+integral+'</span>'+
                    '</div>';
    row.push(vippoints);

    return row;
  }
});


module.exports = VipPointView;
