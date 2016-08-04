define(function (require, exports, module) {

var RewardDetailView = Base.ItemView.extend({

    template: '',

    options: {
        url: '/intra/sprintactivity/consumptionList.json'
    },

    render: function() {
        var self = this;

        return this.$el.staticGrid({
            tableClass: 'table table-bordered table-hover table-center',
            height: 369,
            colModel: [
                {label: '日期', name: 'countDate', width: '10%',formatter: function(val){
                    return _(val).toDate();
                }},
                {label: '用户名', name: 'username', width: '10%'},
                {label: '消费金额', name: 'consumptionAmount', width: '10%', formatter: function(val) {
                    return _(val).formatDiv(10000, {fixed: 4});
                }}
            ],
            emptyTip:false,
            dataProp: 'root.consumptionDetailList',
            url: this.options.url,
            data: {
                username: this.options.username,
                startDay: this.options.startDay,
                endDay:this.options.endDay
            }
        })
          .on('update:done', function(e, data) {
              if (!data) {
                  return;
              }
              self.$el.staticGrid('addRows', [{
                  rowType: 'string',
                  countDate: '日均投注额',
                  username: '',
                  consumptionAmount: _(_(data.totalAmount).formatDiv(10000, {fixed: 4})).formatDiv(moment(self.options.endDay,'YYYY-MM-DD').diff(moment(self.options.startDay,'YYYY-MM-DD'),'days')+1,{fixed: 4})
              }]);
          });
    }
});

module.exports = RewardDetailView;
});