"use strict";


require('./index.scss');
require('./jQueryRotate.2.2');
require('widgets/staticGrid');
var HappyPassThroughView = Base.ItemView.extend({

    template: require('./index.html'),

    events: {
        'click .prize-drawLottery-arrow':'rouletteClickHandler',
        'click .js-hp-receive': 'receiveHandler',
        'click .js-receive-surplus-btn':'taskClickHandler'
    },

    nowStageLimit:0,

    auto: true,

    levelCfg : [
        {
            level:1,
            task:'完成绑定银行卡工作',
            href:'#uc/cm',//
            btnText:'去绑定',
            promptText:'完成绑定银行卡'
        },
        {
            level:2,
            task:'完成在线充值工作',
            href:'充值',
            btnText:'去充值',
            promptText:'活动期间累积充值满200元'
        },
        {
            level:3,
            task:'完成有效投注工作',
            href:'#bc/10',
            btnText:'去投注',
            promptText:'活动期间累计有效投注达'+ this.nowStageLimit +'元 '
        },
        {
            level:4,
            task:'完成有效投注工作',
            href:'#bc/10',
            btnText:'去投注',
            promptText:'活动期间累计有效投注达'+ this.nowStageLimit +'元 '
        },
        {
            level:5,
            task:'完成有效投注工作',
            href:'#bc/10',
            btnText:'去投注',
            promptText:'活动期间累计有效投注达'+ this.nowStageLimit +'元 '
        },
        {
            level:6,
            task:'完成有效投注工作',
            href:'#bc/10',
            btnText:'去投注',
            promptText:'活动期间累计有效投注达'+ this.nowStageLimit +'元 '
        },
        {
            level:7,
            task:'完成有效投注工作',
            href:'#bc/10',
            btnText:'去投注',
            promptText:'活动期间累计有效投注达'+ this.nowStageLimit +'元 '
        },
        {
            level:8,
            task:'完成提现工作',
            href:'提现',
            btnText:'去提现',
            promptText:'活动期间累计有效投注达'+ this.nowStageLimit +'元 '
        },
    ],
    //获取活动详情
    getActivityDeatilXhr:function () {
        return Global.sync.ajax({
            url: '/info/happystageactivity/info.json'
        });
    },

    //领取奖金事件
    getReceiveXhr:function () {
        return Global.sync.ajax({
            url: '/info/happystageactivity/doget.json',
            data: {
                activityId: this.options.activityId
            }
        });
    },

    //抽奖
    getLotteryXhr:function () {
        return Global.sync.ajax({
            url: '/info/happystageactivity/lottery.json',
            data: {
                activityId: this.options.activityId
            }
        });
    },

    onRender: function() {
        var self = this;
        this.$image = this.$('#imgs');
        this.$surplusMoney = this.$('.js-surplus-money');
        this.$surplusCheckpoint = this.$('.js-surplus-checkpoint');
        this.$surplusTask = this.$('.js-surplus-task');
        this.$surplusBtn = this.$('.js-receive-surplus-btn');
        this.start = false;
        this.getActivityDeatilXhr()
            .done(function (res) {
                if(res.result === 0 ){
                    var root = res.root;
                    self.$surplusMoney.html(_.formatDiv(root.noGetBonus,10000));
                    self.userStage = root.userStage;
                    if(root.userStage === 9){
                        self.$surplusCheckpoint.html('<span class="surplus-money">已完成通关</span>');
                        self.$surplusTask.html('已完成全部任务');
                        self.$surplusBtn.addClass('hidden');
                    }else{
                        self.$surplusCheckpoint.html('第<span class="surplus-money">' + root.userStage + '</span>关');
                        self.nowStageLimit = _(root.cfg.bonusCfg).findWhere({stage:self.userStage}).limit;
                        var leveInfo = _(self.levelCfg).findWhere({level:root.userStage});
                        if(leveInfo){
                            self.$surplusTask.html(leveInfo.task);
                            self.$surplusBtn.text('>' + leveInfo.btnText);
                        }
                    }

                    self.getCheckpointTable(root.cfg.bonusCfg);
                    self._getPrizeTable(root.cfg.lotteryCfg);
                }else{
                    Global.ui.notification.show(res.msg);
                    //window.location.href = window.location.hash + 'index.html';
                }
            });


        //this.rotation(10000);
    },

    //格式化关卡信息表
    getCheckpointTable:function (list) {
        var self = this;
        var limitList = '';
        var bonList = '';
        var btnList = '';
        _(list).each(function (cfg,index) {
            switch(index){
                case 0:
                    var limitText = '绑卡有奖';
                    break;
                case 1:
                    var limitText = '充值有奖';
                    break;
                case 2:
                    var limitText = '消费满'+ _(cfg.limit).convert2yuan() + '元';
                    break;
                case 3:
                    var limitText = '消费满'+ _(cfg.limit).convert2yuan() + '元';
                    break;
                case 4:
                    var limitText = '消费满'+ _(cfg.limit).convert2yuan() + '元';
                    break;
                case 5:
                    var limitText = '消费满'+ _(cfg.limit).convert2yuan() + '元';
                    break;
                case 6:
                    var limitText = '消费满'+ _(cfg.limit).convert2yuan() + '元';
                    break;
                case 7:
                    var limitText = '提现有奖';
                    break;
            }

            limitList += '<td>'+ limitText +'</td>';
            bonList += '<td>' + _(cfg.bonus).convert2yuan() + '</td>';
            if(cfg.stage === self.userStage){
                var disable = '';
            }else{
                var disable = 'disabled';
            }
            btnList += '<td><button class="btn btn-sm btn-active js-hp-receive" ' + disable + '>领取</button></td>'
        });
        this.$('.receive-table-limit').html(limitList);
        this.$('.receive-table-bon').html(bonList);
        this.$('.receive-table-btnList').html(btnList);
    },

    //格式化奖品列表
    _getPrizeTable:function (row) {
        var self = this;
        this.$('.js-happy-prize-table').staticGrid({
            tableClass: '',
            colModel: [
                {label: '奖级', name: 'prizeLevel', width: '33%'},
                {label: '奖品', name: 'prize', width: '34%'},
                {label: '折现', name: 'money', width: '33%'},
            ],
            row: this._formatPrizeTableData(row||[]),
            startOnLoading: false
        });
    },

    _formatPrizeTableData:function (prizeList) {
        var self = this;
        return _(prizeList).map(function (cfg, index) {
                switch (cfg.index){
                    case 1:
                        var levelName='一等奖';
                        break;
                    case 2:
                        var levelName='二等奖';
                        break;
                    case 3:
                        var levelName='三等奖';
                        break;
                    case 4:
                        var levelName='四等奖';
                        break;
                    case 5:
                        var levelName='五等奖';
                        break;
                    case 6:
                        var levelName='六等奖';
                        break;
                };
                return {
                    'prizeLevel': levelName,
                    'prize': cfg.lotteryName,
                    'money': _.formatDiv(cfg.bonus,10000)
                }
            }
        );
    },

    rotation: function(duration) {
        var self = this;

        if (!this.auto) {
            return;
        }
        this.$image.rotate({
            angle:0,
            animateTo:470,
            duration: duration,
            callback: function() {
                self.rotation(duration);
            },
            easing: function (x,t,b,c,d) {
                // t: current time, b: begInnIng value, c: change In value, d: duration
                return c*(t/d)+b;
            }
        });
    },

    rouletteClickHandler: function () {
        var self = this;
        if(this.start){
            return false;
        }
        this.start = true;

        this.getLotteryXhr()
            .done(function (res) {
                if(res.result === 0){
                    self.rotation(500);
                    window.setTimeout(function() {
                        var data = res.root;
                        self.auto = false;

                        self.$image.rotate(self.gift(data.index));
                        if(data.lotteryTimes === 0){
                            var body = '<div class="pop-main">' +
                                '<p class="text-center m-top-lg">感谢您的参与</p>' +
                                '<p class="text-center font-30 special-text m-bottom-lg">敬请期待我们更多给力的活动</p>' +
                                '<hr class="m-top-md">' +
                                '<p class="text-center">繁华世界·把精彩留给自己</p>' +
                                '</div>';
                        }else{
                            if(data.index === 6){
                                var body = '<div class="pop-main">' +
                                    '<p class="text-center m-top-lg">谢谢参与</p>' +
                                    '<p class="text-center font-30 special-text m-bottom-lg">不要灰心！再接再厉！</p>' +
                                    '<hr class="m-top-md">' +
                                    '<div class="m-top-md m-bottom-md text-center"><button class="btn btn-pink btn-linear" data-dismiss="modal">确定</button></div>' +
                                    '</div>';
                            }else{
                                var body = '<div class="pop-main">' +
                                    '<p class="text-center">恭喜您抽到</p>' +
                                    '<p class="text-center font-30 special-text">'+ data.lotteryName+'</p>' +
                                    '<hr class="m-top-md">' +
                                    '<p class="text-center">您可以选择</p>' +

                                    '<div class="m-top-md" style="width: 225px; overflow: hidden; margin: 0 auto;">' +
                                    '<span class="choice">领取实物物品</span>' +
                                    '<span class="choice m-left-md">折现至平台账户余额</span>' +
                                    '</div>' +

                                    '<div class="m-top-md m-bottom-md text-center">联系 "<a href="javascript:void(0);"  onclick="newwin = window.open("<%= _.getCustomerServiceUrl() %>","service","width=800,height=680");newwin.moveTo(100,50);" class="special-text" data-dismiss="modal">在线客服</a>" 告知您的选择</div>' +
                                    '</div>';
                            }
                        }
                        self.popShow(body);

                        setTimeout(function() {
                            self.start = false;
                        }, 200);
                    }, 1000);
                }else{
                    if(res.msg === '未通关'){
                        var textTop = '未完成通关';
                        var textBottom = '当前没有抽奖机会可以使用';
                    }else{
                        var textTop = res.msg;
                        var textBottom = '';
                    }
                    var body = '<div class="pop-main">' +
                        '<p class="font-lg text-center m-top-lg">' + textTop + '</p>' +
                        '<p class="text-center">'+ textBottom +'</p>' +
                        '<div class="m-top-md m-bottom-md text-center"><button class="btn btn-pink btn-linear" data-dismiss="modal">确定</button></div>' +
                        '</div>';
                    self.popShow(body);
                    self.start = false;
                }
            });
    },
    gift: function(money) {
        var gift;
        switch (money) {
            case 1:
                gift = 60;
                break;
            case 2:
                gift = 120;
                break;
            case 3:
                gift = 240;
                break;
            case 4:
                gift = 180;
                break;
            case 5:
                gift = 300;
                break;
            case 6:
                gift = 0;
                break;
        }
        return gift;
    },

    popShow:function (body) {
        var self = this;
        var $dialogShow = Global.ui.dialog.show({
            titleClose:true,
            modalClass: 'fc-hp-modal',
            bodyClass: 'js-hp-modal',
            body: '<div class="js-fc-hp-container"></div>'
        });
        $dialogShow.find('.js-fc-hp-container').html(body);
        $dialogShow.on('hidden.modal', function (e) {
            $(this).remove();
            self.auto = true;
            self.onRender();
        });
        $dialogShow.off('click.makeTask')
            .on('click.makeTask', '.js-task-btn', function(e) {
                self.taskBtnClickHandler(e);
            });
    },

    receiveHandler:function (e) {
        var self = this;
        this.getReceiveXhr()
            .done(function (res) {
                if(res.result === 0){
                    if(res.root.userStage === 8){
                        var textTop = '<span class="special-text">任务通关！</span>恭喜您获得<span class="special-text">"' + _.formatDiv(res.root.bonus,10000) + '"</span>元奖金';
                        var textbottom = '您额外获得3次抽大奖的机会！';
                        var btnText = '';
                    }else{
                        var textTop = '恭喜您获得<span class="special-text">"' + _.formatDiv(res.root.bonus,10000) + '"</span>元奖金';
                        var textbottom = '完成通关，更有3次抽大奖的机会哦！';
                        var btnText = '<hr class="m-top-lg"><div class="m-top-md text-center"><button class="btn btn-pink btn-linear" data-dismiss="modal">确定</button></div>';
                    }
                    var body = '<div class="pop-main">' +
                        '<span class="pop-yes"></span>' +
                        '<div class="pop-text">' +
                        '<p class="font-md">' + textTop + '</p>' +
                        '<p>' + textbottom + '</p>' +
                        '</div>' +
                        btnText +
                        '</div>'
                    self.popShow(body);
                    self.onRender();
                }else{
                    if(res.msg === '未达标'){
                        var text = '您为达到领取要求';
                    }else{
                        var text = res.msg;
                    }
                    var body = '<div class="pop-main">' +
                        '<p class="font-lg text-center m-top-lg">' + text + '</p>' +
                        '<div class="m-top-md m-bottom-md text-center"><button class="btn btn-pink btn-linear" data-dismiss="modal">确定</button></div>' +
                        '</div>'
                    self.popShow(body);
                    //Global.ui.notification.show(res.msg = '未达标' ? '您为达到领取要求' : res.msg);
                }
            });
    },

    taskClickHandler:function () {
        var self = this;
        var textInfo = _(this.levelCfg).findWhere({level:this.userStage});
        if(textInfo){
            var text = textInfo.promptText;
            var btnHref = textInfo.href;
            var btnText = textInfo.btnText;
            var body = '<div class="m-top-md m-bottom-md text-center"><span class="font-lg">' + text + '</span><button class="btn btn-sm btn-link m-left-xs font-md js-task-btn" data-href="'+ btnHref +'" data-dismiss="modal">>>'+ btnText +'</button></div>';
            this.popShow(body);
        }

    },

    taskBtnClickHandler:function (e) {
        var $target = $(e.target);
        var hrefInfo = $target.attr('data-href');
        if(hrefInfo.indexOf("#") > -1){
            window.location.href = window.location.hash + 'index.html'+ hrefInfo;
        }else{
            if(hrefInfo === '充值'){
                window.location.href = window.location.hash + 'index.html?act=recharge';
            }else if(hrefInfo === '提现'){
                window.location.href = window.location.hash + 'index.html?act=withdraw';
            }
        }
    }

});

module.exports = HappyPassThroughView;
