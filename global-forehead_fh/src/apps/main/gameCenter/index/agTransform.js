"use strict";

require('./index.scss');


var AgTransferView = Base.ItemView.extend({

    template: require('./agTransform.html'),

    //startOnLoading: true,

    events: {
        'click .js-ag-submitTransfer': 'submitTransferHandler'
    },

    onRender: function() {
        var self = this;

        this.$lotteryBalance = this.$('.js-cp-balance');
        this.$agBalance = this.$('.js-ag-balance');


        //self.executeTransfer();
        
    },
    executeTransfer:function () {
        var self = this;
        Global.sync.ajax({
            url: '/fund/transfer/agTransfer.json',
            data: {
                'agTransfer': 1,
                'tradeMoney': 0
            }
        }).always(function(){
                self.loadingFinish();

            })
            .done(function(res) {
                var data = res.root || {};
                if (res && res.result === 0) {


                } else {
                    Global.ui.notification.show('加载失败，请稍后再试');
                }
            })
            .fail(function () {
                Global.ui.notification.show('网络报错！');
            });
    },
    submitTransferHandler:function (e) {
        alert(e);
    }




});

module.exports = AgTransferView;
