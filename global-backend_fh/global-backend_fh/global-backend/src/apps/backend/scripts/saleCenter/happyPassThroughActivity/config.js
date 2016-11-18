define(function (require, exports, module) {
    require('prefab/views/tabView');

    // var LotterySetView = require('saleCenter/happyPassThroughActivity/lotterySet');
    // var DirectRewardSetView = require('saleCenter/happyPassThroughActivity/DirectRewardSet');
    var BonusSetView = require('saleCenter/happyPassThroughActivity/bonusSet');
    var happyPassThroughView = Base.Prefab.TabView.extend({
        initialize: function() {
            _(this.options).extend({
                tabs: [
                    {
                        label: '闯关奖金配置',
                        name: 'Levels',
                        id: 'jsSPLevels',
                        view: BonusSetView
                    }
                    // {
                    //     label: '抽奖设置',
                    //     name: 'Num',
                    //     id: 'jsSpNum',
                    //     view: LotterySetView
                    // },
                    // {
                    //     label: '直属奖励设置',
                    //     name: 'bet',
                    //     id: 'jsSpBet',
                    //     view: DirectRewardSetView
                    // }
                ]
            });
        },

        renderLimit: function($limit) {
            var self = this;

        }

    });

    module.exports = happyPassThroughView;
});