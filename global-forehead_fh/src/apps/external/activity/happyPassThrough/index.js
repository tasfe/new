"use strict";


require('./index.scss');
require('./jQueryRotate.2.2');
require('widgets/staticGrid');
// var Disk = require('./disk');
var HappyPassThroughView = Base.ItemView.extend({

    template: require('./index.html'),

    events: {
        'click .prize-drawLottery-arrow':'rouletteClickHandler',
        'click .js-hp-receive': 'receiveHandler'
    },

    levelCfg : [
        {
            level:1,
            task:'完成绑定银行卡工作',
            href:'#uc/cm',
            btnText:'去绑定',
            promptText:'完成绑定银行卡'
        },
        {
            level:2,
            task:'完成在线充值工作',
            href:'',
            btnText:'去充值',
            promptText:'活动期间累积充值满200元'
        },
        {
            level:3,
            task:'完成有效投注工作',
            href:'#bc/10',
            btnText:'去投注',
            promptText:'活动期间累计有效投注达XXXX元 '
        },
        {
            level:4,
            task:'完成有效投注工作',
            href:'#bc/10',
            btnText:'去投注'
        },
        {
            level:5,
            task:'完成有效投注工作',
            href:'#bc/10',
            btnText:'去投注'
        },
        {
            level:6,
            task:'完成有效投注工作',
            href:'#bc/10',
            btnText:'去投注'
        },
        {
            level:7,
            task:'完成有效投注工作',
            href:'#bc/10',
            btnText:'去投注'
        },
        {
            level:8,
            task:'完成提现工作',
            href:'',
            btnText:'去提现'
        },
    ],

    getActivityDeatilXhr:function () {
        return Global.sync.ajax({
            url: '/info/happystageactivity/info.json'
        });
    },

    //领取奖金事件
    getReceiveXhr:function () {
        return Global.sync.ajax({
            url: '/info/happystageactivity/info.json',
            activityId:this.options.activityId
        });
    },

    initialize: function() {

    },
    onRender: function() {
        var self = this;
        this.$image = this.$('#imgs');
        this.$surplusMoney = this.$('.js-surplus-money');
        this.$surplusCheckpoint = this.$('.js-surplus-checkpoint');
        this.$surplusTask = this.$('.js-surplus-task');
        this.$surplusBtn = this.$('.js-receive-surplus-btn');

        this.getActivityDeatilXhr()
            .done(function (res) {
                if(res.result === 0 ){
                    var root = res.root;
                    self.$surplusMoney.html(_.formatDiv(root.noGetBonus,10000));
                    self.$surplusCheckpoint.html('第<span class="surplus-money">' + root.userStage + '</span>关');
                    var leveInfo = _(self.levelCfg).findWhere({level:root.userStage});
                    if(leveInfo){
                        self.$surplusTask.html(leveInfo.task);
                        self.$surplusBtn.text('>' + leveInfo.btnText);
                    }
                    //self._getCheckpointTable(root.cfg.bonusCfg);
                    self._getPrizeTable(root.cfg.lotteryCfg);
                }
            });
        this.start = false;

        //this.rotation(10000);
    },

    //格式化关卡信息表
    _getCheckpointTable:function (list) {
        var self = this;
        this.$('.js-happy-receive-table').staticGrid({
            tableClass: '',
            height: 165,
            colModel: [
                {label: '第一关', name: 'level1', width: '12.5%'},
                {label: '第二关', name: 'level2', width: '12.5%'},
                {label: '第三关', name: 'level3', width: '12.5%'},
                {label: '第四关', name: 'level4', width: '12.5%'},
                {label: '第五关', name: 'level5', width: '12.5%'},
                {label: '第六关', name: 'level6', width: '12.5%'},
                {label: '第七关', name: 'level7', width: '12.5%'},
                {label: '第八关', name: 'level8', width: '12.5%'},
            ],
            row: this._formatCheckpointTableData(list||[]),
            startOnLoading: false
        });
    },

    _formatCheckpointTableData:function (cfgs) {
        var self = this;
        return _(cfgs).map(function (cfg, index) {
                return {
                    'level1': '',
                    'level2': '',
                    'level3': '',
                    'level4':'',
                    'level5': '',
                    'level6': '',
                    'level7': '',
                    'level8':''
                }
            }
        );
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
        this.rotation(500);

        setTimeout(function () {
            self.$image.rotate(self.gift(8));
            self.start = false;
        },5000);
    },
    gift: function(money) {
        var gift;
        switch (money) {
            case 8:
                gift = 180;
                break;
            case 18:
                gift = 250;
                break;
            case 28:
                gift = 65;
                break;
            case 58:
                gift = 355;
                break;
            case 188:
                gift = 325;
                break;
            case 2188:
                gift = 145;
                break;
        }
        return gift;
    },

    popShow:function (body) {
        var $dialogShow = Global.ui.dialog.show({
            titleClose:true,
            modalClass: 'fc-hp-modal',
            bodyClass: 'js-hp-modal',
            body: '<div class="js-fc-hp-container"></div>'
        });
        $dialogShow.find('.js-fc-hp-container').html(body);
        $dialogShow.on('hidden.modal', function (e) {
            $(this).remove();
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
                    }else{
                        var textTop = '恭喜您获得<span class="special-text">"' + _.formatDiv(res.root.bonus,10000) + '"</span>元奖金';
                        var textbottom = '您额外获得3次抽大奖的机会！';
                    }
                    var body = '<div class="pop-main">' +
                        '<span class="pop-yes"></span>' +
                        '<div class="pop-text">' +
                        '<p class="font-md">' + textTop + '</p>' +
                        '<p>' + textbottom + '</p>' +
                        '</div>' +
                        '</div>'
                    self.popShow(body);
                    self.onRender();
                }else{
                    Global.ui.notification.show(res.msg);
                }
            });
    }

    




});

module.exports = HappyPassThroughView;
