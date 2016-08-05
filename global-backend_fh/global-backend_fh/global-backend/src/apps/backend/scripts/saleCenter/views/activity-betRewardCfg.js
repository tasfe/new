define(function (require, exports, module) {
    var UserLoginCfgView = Base.ItemView.extend({

        template: require('text!saleCenter/templates/activity-betRewardCfg.html'),

        events: {
            'click .js-br-add': 'addHandler',
            'click .js-br-del': 'delHandler',
            'click .js-br-btn-submit': 'saveBetRewardCfgHandler',
            'click .js-br-btn-reset':'resetBetRewardCfgHandler'
        },

        initialize: function () {
        },
        //发送请求
        _getRedCfgData: function (params) {
            return Global.sync.ajax({
                url: '/intra/activitymanage/betrewardcfgdetail.json',
                data: params
            });
        },
        onRender: function () {
            var self = this;
            //初始化时间选择
            new Global.Prefab.Timeset({
                el: this.$('.js-br-timeset'),
                startTime: 'fromDate',
                endTime: 'endDate',
                endDate: moment().add(10, 'year'),
                startValidate: 'required data-parsley-trigger="blur"',
                endValidate: 'required data-parsley-trigger="blur"'
            }).render();

            var activityId = 21;
            var params = {activityId: activityId};
            this._loadPage(params, 'js-br-cfgDetail');
            self.$('.js-br-activityId').val(activityId);

        },
        _loadPage: function (params, classValue) {
            var self = this;
            this._getRedCfgData(params).done(function (res) {
                if (res.result === 0 ) {
                    if(res.root){
                        self.$('.js-start-time').val(_(res.root.fromDate).toTime());
                        self.$('.js-end-time').val(_(res.root.endDate).toTime());
                        self.$('.js-br-cycleDays').val(_(res.root.cycleDays));
                        self.$('.js-bd-activityId').val(res.root.activityId);
                        self._getTable(self._formatCfgData(res.root.itemList), classValue);
                    }else{
                        self.lastIndex=0;
                        self._getTable([], classValue);
                    }
                } else {
                    Global.ui.notification.show(res.msg);
                }
            }).fail(function () {
            });
        },
        //获取表格
        _getTable: function (tableInfo, classValue) {
            this.staticGrid =this.$('.' + classValue).staticGrid({
                colModel: [
                    {label: '周期', name: 'cycle', width: 120},
                    {label: '任务条件', name: 'amount', width: 120},
                    {label: '奖金', name: 'bonus', width: 120}
                ],
                emptyTip: false,
                row: tableInfo
            }).staticGrid('instance');
        },
        //格式化数据
        _formatCfgData: function (cfgs) {
            this.lastIndex = cfgs.length;
            return _(cfgs).chain().map(function (cfg, index) {
                    return {
                        cycle: '<div><label class="control-label" style="margin-right: 20px;">第</label><input type="text" name="itemList[' + index + '].cycle" class="form-control" required style="width:50px;" value="' + cfg.cycle + '" data-parsley-range="[0, 99999999]" data-parsley-type="integer" required><label class="control-label m-right-sm" style="margin-left: 20px;">天</label></div>',
                        amount: '<input type="text" name="itemList[' + index + '].amount" class="form-control" required style="width:150px;" value="' + _(cfg.amount).formatDiv(10000) + '" data-parsley-range="[0, 99999999]" data-parsley-type="integer" required><label class="control-label m-right-sm" style="margin-left: 10px;">元</label>',
                        bonus: '<input type="text" name="itemList[' + index + '].bonus" class="form-control" required style="width:150px;" value="' + _(cfg.bonus).formatDiv(10000) + '" data-parsley-range="[0, 99999999]" data-parsley-type="integer" required><label class="control-label m-right-sm" style="margin-left: 10px;">元</label>'+
                        '<button class="js-br-del btn btn-danger btn-sm pull-right"><i class="fa fa-minus"></i> </button>'
                    }
                }
            ).flatten().value();
        },
        //组装错误提示框
        _getErrorMsg: function (text) {
            return '<div class="alert alert-danger alert-dismissible" role="alert">' +
                '<button type="button" class="close" data-dismiss="alert">' +
                '<span aria-hidden="true">×</span>' +
                '</button>' +
                '<i class="fa fa-times-circle m-right-xs"></i>' +
                '<strong>提示！</strong> ' + text +
                '</div>';
        },
        saveBetRewardCfgHandler: function (e) {
            var self = this;
            var $target = $(e.currentTarget);
            $target.button('loading');
            var $currContainer = $('.js-br-userLoginCfg-form');
            var clpValidate = $currContainer.parsley().validate();
            if (clpValidate) {
                Global.sync.ajax({
                        url: '/intra/activitymanage/savebetrewardcfg.json',
                        data: _($currContainer.serializeArray()).serializeObject()
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
                            Global.appRouter.navigate(_('#sc/br/conf').addHrefArgs({_t: _.now()}), {
                                trigger: true,
                                replace: false
                            });} else {
                            Global.ui.notification.show('操作失败。');
                        }
                    });
            } else {
                $target.button('reset');
            }
        },
        addHandler: function() {
            this.staticGrid.addRows([{
                cycle: '<div><label class="control-label" style="margin-right: 10px;">第</label><input type="text" name="itemList[' + this.lastIndex + '].cycle" class="form-control" data-parsley-range="[1, 7]" data-parsley-type="integer" required style="width:40px;"><label class="control-label m-right-sm" style="margin-left: 10px;">天</label></div>',
                amount: '<div><input type="text" name="itemList[' + this.lastIndex + '].amount" class="form-control" data-parsley-range="[0, 99999999]" data-parsley-type="integer" required style="width:150px;"><label class="control-label" style="margin-left: 10px;">元</label></div>',
                bonus: '<input type="text" name="itemList[' + this.lastIndex + '].bonus" class="form-control" data-parsley-range="[0, 99999999]" data-parsley-type="integer" required style="width:150px;"><label class="control-label" style="margin-left: 10px;">元</label>'+
                '<button class="js-br-del btn btn-danger btn-sm pull-right"><i class="fa fa-minus"></i> </button>'

            }], {
                eq: -1
            });
            this.lastIndex++;
        },
        delHandler: function(e) {
            var $target = $(e.currentTarget);
            this.staticGrid.delRow($target);
        },
        resetBetRewardCfgHandler:function(e){
            this.render();
        }
    });
    module.exports = UserLoginCfgView;
});