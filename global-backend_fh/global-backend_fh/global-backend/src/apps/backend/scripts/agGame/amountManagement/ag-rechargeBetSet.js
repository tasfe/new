define(function (require, exports, module) {

    var NewBetView = Base.ItemView.extend({

        template: require('text!agGame/amountManagement/ag-rechargeBetSet.html'),

        events: {
            'click .js-ag-recharge-bet-btn-submit': 'rechargeBetHandler',
            'click .js-ag-recharge-bet-btn-cancel': 'formCancelHandler'
        },
        getLevelConfXhr: function () {
            return Global.sync.ajax({
                url: '/intra/agmanager/agtransferconf.json'
            });
        },
        onRender: function () {
            var self = this;
            self.getLevelConfXhr().always(function () {
            }).fail(function () {
                // 处理失败
            }).done(function (res) {
                if (res && res.result === 0) {
                    self.$('.js-ag-withdrawLimit').val(res.root.withdrawLimit);
                } else {
                    Global.ui.notification.show('数据异常。');
                }

            });
        },
        rechargeBetHandler: function (e) {
            var self = this;
            var $target = $(e.currentTarget);
            $target.button('loading');
            var $currContainer = $('.js-ag-recharge-bet-form');
            var clpValidate = $currContainer.parsley().validate();
            if (clpValidate) {
                Global.sync.ajax({
                    url: '/intra/agmanager/savetransferconf.json',
                    data: {
                        minAmount: '',
                        maxAmount: '',
                        agTransferTimes: '',
                        ticketTransferTimes: '',
                        withdrawLimit: this.$('.js-ag-withdrawLimit').val()
                    }
                })
                    .always(function () {
                        $target.button('reset');
                    })
                    .fail(function () {
                        // 处理失败
                    })
                    .done(function (res) {
                        if (res && res.result === 0) {
                            Global.ui.notification.show('操作成功。');
                            Global.appRouter.navigate(_('#ag/fcs').addHrefArgs({_t: _.now()}), {
                                trigger: true,
                                replace: false

                            });
                        } else {
                            Global.ui.notification.show('操作失败。');
                        }
                    });
            }else{
                $target.button('reset');
            }
        },
        formCancelHandler: function (e) {
            this.render();
        }

    });

    module.exports = NewBetView;
});