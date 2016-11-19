define(function (require, exports, module) {

    var BonusSetView = Base.ItemView.extend({

        template: require('text!saleCenter/happyPassThroughActivity/bonusSet.html'),

        events: {
            'click .js-hp-btn-submit':'submitHandler',
            'click .js-hp-btn-reset':'resetHandler'
        },

        conditionCfg:[
            {
                condition:'绑卡奖金:',
                stage:1
            },
            {
                condition:'充值奖金:',
                stage:2
            },
            {
                condition:'消费奖金:',
                stage:3
            },
            {
                condition:'消费奖金:',
                stage:4
            },
            {
                condition:'消费奖金:',
                stage:5
            },
            {
                condition:'消费奖金:',
                stage:6
            },
            {
                condition:'消费奖金:',
                stage:7
            },
            {
                condition:'提现奖金:',
                stage:8
            },
        ],

        getBonusConfigXhr:function () {
            return Global.sync.ajax({
                url: '/intra/activitymanage/happystagecfgdetail.json'
            });
        },

        saveBonusConfigXhr:function (data) {
            return Global.sync.ajax({
                url: '/intra/activitymanage/savehappystagecfg.json',
                tradition: true,
                data:data
            });
        },

        onRender: function () {
            var self = this;
            //初始化时间选择
            this.timeset = new Global.Prefab.Timeset({
                el: this.$('.js-hp-timeset'),
                startTime: 'fromDate',
                endTime: 'endDate',
                endDate: moment().add(1, 'year')
            }).render();
            this.$error = this.$('.js-hp-error-notice');
            this.$startTime = this.$('.js-start-time');
            this.$endTime = this.$('.js-end-time');
            this.$newUser = this.$('.js-hp-newUser');
            this.$oldUser = this.$('.js-hp-oldUser');
            this.$directSet = this.$('.js-hp-directSet');

            this.getBonusConfigXhr()
                .done(function (res) {
                    if(res.result === 0){
                        var configRoot = res.root;
                        self.$startTime.val(_(configRoot.fromDate).toTime());
                        self.$endTime.val(_(configRoot.endDate).toTime());
                        if(configRoot.userType.length > 0){
                            _(configRoot.userType).each(function (type,index) {
                                $("input[type='checkbox'][name='user'][value='"+type+"']").attr("checked", "checked");
                            });
                        }
                        self.$directSet.val(_.formatDiv(configRoot.superBonus,10000));
                        self._getTable(configRoot.bonusCfg);
                        if(configRoot.lotteryCfg.length > 1){
                            self._getLottertTable(configRoot.lotteryCfg);
                        }

                    }else{
                        self._getTable()
                    }
                });

        },

        //格式化闯关奖金表
        _getTable: function (List) {
            this.staticGrid = this.$('.js-hp-bomus-table').staticGrid({
                colModel: [
                    {label: '任务关卡', name: 'taskLevel', width: 100},
                    {label: '任务条件', name: 'taskCondition', width: 220},
                    {label: '任务奖励', name: 'taskReward', width: 100},
                    {label: '奖金份额（份）', name: 'bonusShare', width: 100}
                ],
                emptyTip: false,
                row: this._formatBagData(List||[])
            }).staticGrid('instance');
        },

        //格式化数据
        _formatBagData: function (cfgs) {
            var self = this;
            this.lastIndex = cfgs.length ;
            var disable = '';
            if(cfgs.length > 7){
                return _(cfgs).map(function (cfg, index) {

                        if(index === 0 || index === 7){
                            disable = 'disabled';
                        }else{
                            disable = '';
                        }
                        return {
                            'taskLevel': '<div class="js-hp-bon-level">' + cfg.stage + '</div>',
                            'taskCondition': self.conditionCfg[index].condition+'<input type="text" name="" '+ disable +' class="js-hp-bon-condition form-control" ' +
                            'style="width:150px;" required value="'+_.formatDiv(cfg.limit,10000)+'"  data-parsley-range="[0, 1000000]" data-parsley-type="integer">',
                            'taskReward': '<input type="text"  name=""  class="js-hp-bon-reward form-control" ' +
                            'style="width:150px;" required value="'+_.formatDiv(cfg.bonus,10000)+'" data-parsley-range="[0, 100]" data-parsley-type="integer">',
                            'bonusShare':'<input type="text"  name=""  class="js-hp-bon-share form-control" ' +
                            'style="width:150px;" required value="'+cfg.count+'" data-parsley-range="[0, 100000]" data-parsley-type="integer">'
                        }
                    }
                );
            }else{
                return _(this.conditionCfg).map(function (cfg, index) {
                        if(index === 0 || index === 7){
                            disable = 'disabled';
                        }else{
                            disable = '';
                        }
                        return {
                            'taskLevel': '<div class="js-hp-bon-level">' + cfg.stage + '</div>',
                            'taskCondition': cfg.condition+'<input type="text"  name="" '+ disable +' class="js-hp-bon-condition form-control" ' +
                            'style="width:150px;" required value=""  data-parsley-range="[0, 1000000]" data-parsley-type="integer">',
                            'taskReward': '<input type="text"  name=""  class="js-hp-bon-reward form-control" ' +
                            'style="width:150px;" required value="" data-parsley-range="[0, 100]" data-parsley-type="integer">',
                            'bonusShare':'<input type="text"  name=""  class="js-hp-bon-share form-control" ' +
                            'style="width:150px;" required value="" data-parsley-range="[0, 100000]" data-parsley-type="integer">'
                        }
                    }
                );
            }
        },

        //格式化抽奖设置表
        _getLottertTable:function (lotteryCfg) {
            this.staticGrid = this.$('.js-hp-lottery-table').staticGrid({
                colModel: [
                    {label: '奖品', name: 'prize', width: 100},
                    {label: '中奖概率', name: 'probability', width: 100},
                    {label: '折现价值', name: 'cost', width: 100}
                ],
                emptyTip: false,
                row: this._formatLrtteryTable(lotteryCfg||[])
            }).staticGrid('instance');
        },

        //组装抽奖表数据
        _formatLrtteryTable:function (lotteyCfgs) {
            var self = this;
            if(lotteyCfgs.length > 1){
                return _(lotteyCfgs).map(function (cfg, index) {
                        return {
                            'prize': '<input type="text"  name=""  class="js-hp-lottery-name form-control" style="width:150px;" ' +
                                'required value="' + cfg.lotteryName + '" >',
                            'probability': '<input type="text"  name=""  class="js-hp-lottery-probability form-control" style="width:150px;" ' +
                            'required value="' + _.formatDiv(cfg.lotteryRate,10000) + '" >%',
                            'cost': '<input type="text"  name=""  class="js-hp-lottery-cost form-control" style="width:150px;" ' +
                                'required value="' + _.formatDiv(cfg.bonus,10000) + '" data-parsley-range="[0, 100000]" >'
                        }
                    }
                );
            }
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


        submitHandler:function () {
            var self = this;
            var startTime = this.$startTime.val();
            var endTime = this.$endTime.val();
            if(startTime != '' && endTime != ''){
                if(this.$newUser.is(':checked') || this.$oldUser.is(":checked")){
                    var formStatus = this.$('.js-hp-bonusSet-form').parsley().validate();
                    if(formStatus){
                        var userList = [];
                        _($("input[name='user']:checked")).each(function (list,index) {
                            userList.push(list.value);
                        });
                        var bonusCfg = [];
                        _($('.js-hp-bon-level')).each(function (item,index) {
                            bonusCfg.push({
                                stage:$(item).html(),
                                limit:$($('.js-hp-bon-condition')[index]).val(),
                                bonus:$($('.js-hp-bon-reward')[index]).val(),
                                count:$($('.js-hp-bon-share')[index]).val()
                            });
                        });
                        var lotteryCfg = [];
                        _($('.js-hp-lottery-name')).each(function (item,index) {
                            lotteryCfg.push({
                                index:index+1,
                                lotteryName:$($('.js-hp-lottery-name')[index]).val(),
                                lotteryRate:$($('.js-hp-lottery-probability')[index]).val(),
                                bonus:$($('.js-hp-lottery-cost')[index]).val()
                            });
                        });
                        var data = {
                            activityId : 40,
                            fromDate : this.$startTime.val(),
                            endDate : this.$endTime.val(),
                            userType : userList,
                            superBonus : this.$directSet.val(),
                            bonusCfg : bonusCfg,
                            lotteryCfg : lotteryCfg
                        };
                        console.log(data);
                        this.saveBonusConfigXhr(data)
                            .done(function (res) {
                                if(res.result === 0){
                                    console.log(res);
                                    self.onRender();
                                }
                            });

                    }
                }else {
                    this.$error.html(this._getErrorMsg('请选择用户范围'));
                }
            }else{
                this.$error.html(this._getErrorMsg('请填写活动时间'));
            }
        }



    });

    module.exports = BonusSetView;
});