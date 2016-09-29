define(function (require, exports, module) {

    var NewLevelsView = Base.ItemView.extend({

        template: require('text!agGame/amountManagement/ag-rechargeLevelSet.html'),

        events: {
            'click .js-ag-recharge-level-btn-submit': 'rechargeLevelHandler',
            'click .js-ag-recharge-level-btn-cancel': 'formCancelHandler'
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
                    self.$('.js-ag-min').val(_(res.root.minAmount).formatDiv(10000));
                    self.$('.js-ag-max').val(_(res.root.maxAmount).formatDiv(10000));
                } else {
                    Global.ui.notification.show('数据异常。');
                }

            });
        },
        rechargeLevelHandler: function (e) {
            var self = this;
            var type = 0;
            var $target = $(e.currentTarget);
            $target.button('loading');
            var $currContainer = $('.js-ag-recharge-levels-form');
            var clpValidate = $currContainer.parsley().validate();
            if (clpValidate) {
                Global.sync.ajax({
                    url: '/intra/agmanager/savetransferconf.json',
                    data: {
                        minAmount: this.$('.js-ag-min').val(),
                        maxAmount: this.$('.js-ag-max').val(),
                        agTransferTimes: '',
                        ticketTransferTimes: ''

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

    module.exports = NewLevelsView;
});