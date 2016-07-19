
"use strict";
var OptionalBettingDetailView = Base.ItemView.extend({

  template: require('userCenter/templates/optionalBettingDetail.html'),

  startOnLoading: true,

  getOptionalBetDetailXhr: function (data) {
    return Global.sync.ajax({
      url: '/ticket/bet/rxdetail.json',
      data: data
    });
  },

  onRender: function () {
    var self = this;
    this.getOptionalBetDetailXhr({ticketBetPlayId: this.options.ticketBetPlayId})
      .always(function () {
        self.loadingFinish();
      })
      .done(function (res) {
        if(res.result===0){
        self._getTable(res.root.detailList,'js-ac-optionalBettingDetail-table');
        self.$('.js-ac-optionalBettingDetail-num').html(res.root.betNums.replace(/ /g,''));
        }else {
          Global.ui.notification.show('操作失败。');
        }
      });
  },

  _getTable: function (tableInfo, classValue) {
    this.$('.' + classValue).staticGrid({
      tableClass: 'table table-bordered table-center',
    //  wrapperClass: 'border-table-bottom',
      height: 148,
      colModel: [
        {label: '投注位置', name: 'position', merge: false, width: 225},
        {label: '中奖号码', name: 'hits', merge: false, width: 262,formatter:function(val){
          if(val===null){
            val =  '未中奖';
          }else{
            val = val.replace(/ /g,'');
          }
          return val;
        }},
        {label: '奖金（单倍）', name: 'prize', width: 194,formatter:function(val){
          if(_(Number(val)).isFinite()){
            val =  _(Number(val)).convert2yuan();
          }
          return val;
        }}
      ],
      row: tableInfo
    });
  }
});

module.exports = OptionalBettingDetailView;


