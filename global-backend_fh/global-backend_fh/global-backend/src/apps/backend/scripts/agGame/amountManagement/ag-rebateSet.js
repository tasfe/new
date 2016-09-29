define(function (require, exports, module) {

    var AgRebateSetView = Base.ItemView.extend({

        template: require('text!agGame/amountManagement/ag-rebateSet.html'),

        events: {
            'click .js-ag-btn-submit': 'formSubmitHandler'
        },
        getRebateSetConfXhr: function () {
            return Global.sync.ajax({
                url: '/intra/agmanager/agbonusconf.json'
            });
        },
        onRender: function () {
            var self = this;
            self.getRebateSetConfXhr().always(function () {
            }).fail(function () {
                // 处理失败
            }).done(function (res) {
                if (res && res.result === 0) {
                    self.$('.js-ag-rebate').html('<label class="control-label">'+_(res.root.userBonusRate+res.root.highBonusRate+res.root.agentBonusRate).formatDiv(10000)+'</label><label class="control-label" style="margin-left: 5px;">%</label>');
                    self.$('.js-ag-user-rebate').val(_(res.root.userBonusRate).formatDiv(10000));
                    self.$('.js-ag-up-rebate').val(_(res.root.highBonusRate).formatDiv(10000));
                    self.$('.js-ag-down-rebate').val(_(res.root.agentBonusRate).formatDiv(10000));
                    //self.$('.js-rl-ie-type[value=' + res.root.isMultipleIe + ']').prop('checked', true);
                } else {
                    Global.ui.notification.show('数据异常。');
                }


            });
        },
        formSubmitHandler: function (e) {
            var $target = $(e.currentTarget);
            $target.button('loading');
            var clpValidate = this.$('.js-ag-rebate-set-form').parsley().validate();
            if (clpValidate) {
                return Global.sync.ajax({
                    url: '/intra/agmanager/saveagbonusconf.json',
                    data: {
                        userRate:this.$('.js-ag-user-rebate').val(),
                        highRate:this.$('.js-ag-up-rebate').val(),
                        agentRate:this.$('.js-ag-down-rebate').val()
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
                            Global.appRouter.navigate(_('#ag/fcr').addHrefArgs({_t: _.now()}), {
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

    });

    module.exports = AgRebateSetView;
});