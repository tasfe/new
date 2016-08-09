define(function (require, exports, module) {
  var OptionalBettingDetailView = Base.ItemView.extend({

    template: require('text!betCenter/templates/ticket-BettingRecord-optional-detail.html'),

    getOptionalBetDetailXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/betmng/rxbetdetail.json',
        data: data
      });
    },

    onRender: function () {
      var self = this;
      this.getOptionalBetDetailXhr({ticketBetPlayId: this.options.ticketBetPlayId})
        .always(function () {
        })
        .done(function (res) {
          if (res.result === 0) {
            self.$('.js-ac-optionalBettingDetail-openNum').html(self.options.openNum);
            self._getTable(res.root.detailList, 'js-ac-optionalBettingDetail-table');
            self.$('.js-ac-optionalBettingDetail-num').html(res.root.betNums.replace(/ /g,''));
          } else {
            Global.ui.notification.show('操作失败。');
          }
        });
      //self._getTable([], 'js-ac-optionalBettingDetail-table');
      //self.$('.js-ac-optionalBettingDetail-num').html('1221312312.123123123123');
    },

    _getTable: function (tableInfo, classValue) {
      this.$('.' + classValue).staticGrid({
        tableClass: 'table table-bordered table-center no-m-bottom',
        //wrapperClass: 'border-table-bottom',
        height: 148,
        colModel: [
          {label: '投注位置', name: 'position',  width: 225},
          {label: '中奖号码', name: 'hits',width: 262,formatter:function(val){
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

});
