define(function (require, exports, module) {

    var AgSysSetView = Base.ItemView.extend({

        template: require('text!agGame/agSetManagement/ag-systemSet.html'),

        events: {
            'click .js-ag-btn-submit': 'formSubmitHandler'
        },
        getLoginConfXhr: function () {
            return Global.sync.ajax({
                url: '/intra/agmanager/agdefendconf.json'
            });
        },
        onRender: function () {
            var self = this;
            new Global.Prefab.Timeset({
                el: this.$('.js-ag-sys-timeset'),
                startTime: 'startTime',
                endTime: 'endTime',
                endDate:moment().add(1, 'year'),
                startValidate: 'required data-parsley-trigger="blur"',
                endValidate: 'required data-parsley-trigger="blur"'
            }).render();
            self.getLoginConfXhr().always(function () {
            }).fail(function () {
                // 处理失败
            }).done(function (res) {
                if (res && res.result === 0) {
                    self.$('.js-start-time').val(_(res.root.startTime).toTime());
                    self.$('.js-end-time').val(_(res.root.endTime).toTime());
                    self.$('.js-ag-sys-set[value=' + res.root.open + ']').prop('checked', true);
                    //self.$('.js-rl-ie-type[value=' + res.root.isMultipleIe + ']').prop('checked', true);
                } else {
                    Global.ui.notification.show('数据异常。');
                }


            });
        },
        formSubmitHandler: function (e) {
            var $target = $(e.currentTarget);
            $target.button('loading');
            var clpValidate = this.$('.js-ag-sys-set-form').parsley().validate();
            if (clpValidate) {
                return Global.sync.ajax({
                    url: '/intra/agmanager/saveagdefendconf.json',
                    data: {
                        open:this.$('.js-ag-sys-set:checked').val(),
                        startTime:this.$('.js-start-time').val(),
                        endTime:this.$('.js-end-time').val()
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
                            Global.appRouter.navigate(_('#ag/st').addHrefArgs({_t: _.now()}), {
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

    module.exports = AgSysSetView;
});