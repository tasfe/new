/**
 * Created by Administrator on 2016/6/6.
 */
define(function (require, exports, module) {
    var GiftPacksCfgView = Base.ItemView.extend({

        template: require('text!saleCenter/templates/activity-giftPacksCfg.html'),

        events: {
            'click .js-gp-btn-submit': 'saveGiftPacksCfgHandler',
            'click .js-gp-btn-reset':'resetGiftPacksCfgHandler'
        },

        initialize: function () {
        },
        //发送请求
        _getRedCfgData: function (params) {
            return Global.sync.ajax({
                url: '/intra/activitymanage/giftpackscfgdetail.json',
                data: params
            });
        },
        onRender: function () {
            var self = this;
            //初始化时间选择
            new Global.Prefab.Timeset({
                el: this.$('.js-gp-timeset'),
                startTime: 'fromDate',
                endTime: 'endDate',
                endDate: moment().add(10, 'year'),
                startValidate: 'required data-parsley-trigger="blur"',
                endValidate: 'required data-parsley-trigger="blur"'
            }).render();

            var activityId = 20;
            var params = {activityId: activityId};
            this._loadPage(params, 'js-gp-cfgDetail');
            self.$('.js-gp-activityId').val(activityId);
        },
        _loadPage: function (params, classValue) {
            var self = this;
            this._getRedCfgData(params).done(function (res) {
                if (res.result === 0) {
                    if(res.root){
                        self.$('.js-start-time').val(_(res.root.fromDate).toTime());
                        self.$('.js-end-time').val(_(res.root.endDate).toTime());
                        self.$('.js-gp-totalPacks').val(res.root.totalPacks);
                        self.$('.js-gp-activityId').val(res.root.activityId);
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
                    {label: '奖励项目', name: 'packType', width: 100},
                    {label: '任务条件', name: 'amount', width: 100},
                    {label: '奖金', name: 'bonus', width: 100}
                ],
                emptyTip: false,
                row: tableInfo
            }).staticGrid('instance');
        },
        //格式化数据
        _formatCfgData: function (cfgs) {
            this.lastIndex = cfgs.length;
            packTypeArr = ['首充奖励','首投奖励','提现奖励'];
            return _(cfgs).chain().map(function (cfg, index) {
                    return {
                        packType:'<input type="text" name="itemList[' + index + '].packType"  class="form-control hidden" hidden style="width:150px;" value="'+cfg.packType+'">'+packTypeArr[index]+'</input>',
                        amount: '<div><input type="text" name="itemList[' + index + '].amount" class="form-control" required style="width:150px;" value="' + _(cfg.amount).formatDiv(10000) + '" data-parsley-range="[0, 99999999]" data-parsley-type="integer" required><label class="control-label m-right-sm" style="margin-left: 20px;">元</label></div>',
                        bonus: '<input type="text" name="itemList[' + index + '].bonus" class="form-control" required style="width:150px;" value="' + _(cfg.bonus).formatDiv(10000) + '" data-parsley-range="[0, 99999999]" data-parsley-type="integer" required><label class="control-label m-right-sm" style="margin-left: 20px;">元</label>'
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
        saveGiftPacksCfgHandler: function (e) {
            var self = this;
            var $target = $(e.currentTarget);
            $target.button('loading');
            var $currContainer = $('.js-gp-giftPacksCfg-form');
            var clpValidate = $currContainer.parsley().validate();
            if (clpValidate) {
                Global.sync.ajax({
                        url: '/intra/activitymanage/savegiftpackscfg.json',
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
                            Global.appRouter.navigate(_('#sc/gp/conf').addHrefArgs({_t: _.now()}), {
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
        resetGiftPacksCfgHandler:function(e){
            this.render();
        }

    });
    module.exports = GiftPacksCfgView;
});