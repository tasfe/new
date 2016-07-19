"use strict";

var factory = require('bettingCenter/misc/betRulesFactory');
var algorithm = require('bettingCenter/misc/betRulesAlgorithm');

function _create(ticketId) {

    //三星
    function addThreeRules(rules) {
        //复式
        factory.addRule(rules[0].ids, {
            algorithm: algorithm.mulAll,
            list: factory.createList(rules[0].list),
            create: algorithm.getCreateFunc(3, {
                repeat: true,
                matching: true
            })
        });

        //单式
        factory.addRule(rules[1].ids, {
            type: 'input',
            validate: algorithm.getValidateFunc(3),
            create: algorithm.getCreateFunc(3, {
                slice: [2],
                repeat: true,
                innerSort: false
            })
        });

        //直选和值
        factory.addRule(rules[2].ids, {
            algorithm: algorithm.statistics,
            algorithmProps: {
                selectCount: 3
            },
            list: factory.createList([''], {
                items: _.range(28),
                operate: 'none'
            }),
            create: algorithm.getCreateFunc(1, {
                range: _.range(28)
            })
        });

        //跨度
        factory.addRule(rules[3].ids, {
            algorithm: algorithm.fromConfig,
            algorithmProps: {
                config: [10, 54, 96, 126, 144, 150, 144, 126, 96, 54]
            },
            list: factory.createList(['']),
            create: algorithm.getCreateFunc(1)
        });

        //组三
        factory.addRule(rules[4].ids, {
            algorithm: algorithm.factorial,
            algorithmProps: {
                mainRow: 0,
                cTimes: 2
            },
            list: factory.createList(['']),
            create: algorithm.getCreateFunc(2, {
                outerSort: true
            })
        });
        //组六
        factory.addRule(rules[5].ids, {
            algorithm: algorithm.group,
            algorithmProps: {
                mainRow: 0,
                cTimes: 3
            },
            list: factory.createList(['']),
            create: algorithm.getCreateFunc(3, {
                outerSort: true
            })
        });

        //组选和值
        factory.addRule(rules[6].ids, {
            algorithm: algorithm.fromConfig,
            algorithmProps: {
                config: [null, 1, 2, 2, 4, 5, 6, 8, 10, 11, 13, 14, 14, 15, 15, 14, 14, 13, 11, 10, 8, 6, 5, 4, 2, 2, 1]
            },
            list: factory.createList([''], {
                items: _.range(1, 27),
                operate: 'none'
            }),
            create: algorithm.getCreateFunc(1, {
                range: _.range(1, 27)
            })
        });

        //组选包胆
        factory.addRule(rules[7].ids, {
            algorithm: algorithm.staticVal,
            algorithmProps: {
                val: 54
            },
            list: factory.createList([''], {
                operate: 'none',
                limits: [
                    {
                        name: 'conflict-x',
                        data: {
                            num: 1
                        }
                    }
                ]
            }),
            create: algorithm.getCreateFunc(1)
        });

        //混合组选
        factory.addRule(rules[8].ids, {
            type: 'input',
            validate: algorithm.getValidateFunc(3, {
                acceptRepeat: 1,
                maxRepeat: 2,
                minRepeat: 1,
                innerSort: true
            }),
            create: algorithm.getCreateFunc(3, {
                outerSort: true,
                slice: [2]
            })
        });

        ////组三单式
        //factory.addRule(rules[9].ids, {
        //  type: 'input',
        //  validate: getValidateFunc(3, {
        //    acceptRepeat: 1,
        //    maxRepeat: 2,
        //    minRepeat: 2,
        //    innerSort: true
        //  }),
        //  create: getCreateFunc(3, {
        //    acceptRepeat: 1,
        //    minRepeat: 2,
        //    maxRepeat: 2,
        //    slice: [2]
        //  })
        //});
        ////组六单式
        //factory.addRule(rules[10].ids, {
        //  type: 'input',
        //  validate: getValidateFunc(3, {
        //    acceptRepeat: 0,
        //    innerSort: true
        //  }),
        //  create: getCreateFunc(3, {
        //    //outerSort: true,
        //    slice: [2]
        //  })
        //});

        //一码不定位
        factory.addRule(rules[11].ids, {
            algorithm: algorithm.group,
            algorithmProps: {
                mainRow: 0,
                cTimes: 1
            },
            list: factory.createList(['']),
            create: algorithm.getCreateFunc(1)
        });

        //二码不定位
        factory.addRule(rules[12].ids, {
            algorithm: algorithm.group,
            algorithmProps: {
                mainRow: 0,
                cTimes: 2
            },
            list: factory.createList(['']),
            create: algorithm.getCreateFunc(2, {
                outerSort: true
            })
        });
    }

    //==================================================
    //后三

    addThreeRules([
        {
            ids: [ticketId, '120101'],
            list: [null, null, '百位', '十位', '个位']
        },
        {ids: [ticketId, '120102']},
        {ids: [ticketId, '120103']},
        {ids: [ticketId, '120104']},
        {ids: [ticketId, '120201']},
        {ids: [ticketId, '120202']},
        {ids: [ticketId, '120203']},
        {ids: [ticketId, '120204']},
        {ids: [ticketId, '120205']},
        {ids: [55]},
        {ids: [56]},
        {ids: [ticketId, '150101']},
        {ids: [ticketId, '150102']}
    ]);

    //==================================================
    //二星

    function addTwoRules(rules) {
        //直选复式
        factory.addRule(rules[0].ids, {
            algorithm: algorithm.mulAll,
            list: factory.createList(rules[0].list),
            create: algorithm.getCreateFunc(2, {
                repeat: true,
                matching: true
            })
        });
        //直选单式
        factory.addRule(rules[1].ids, {
            type: 'input',
            validate: algorithm.getValidateFunc(2),
            create: algorithm.getCreateFunc(2, {
                slice: [1],
                repeat: true,
                innerSort: false
            })
        });

        //直选和值
        factory.addRule(rules[2].ids, {
            algorithm: algorithm.statistics,
            algorithmProps: {
                selectCount: 2
            },
            list: factory.createList([''], {
                items: _.range(19),
                operate: 'none'
            }),
            create: algorithm.getCreateFunc(1, {
                range: _.range(19)
            })
        });
        //跨度
        factory.addRule(rules[3].ids, {
            algorithm: algorithm.fromConfig,
            algorithmProps: {
                config: [10, 18, 16, 14, 12, 10, 8, 6, 4, 2]
            },
            list: factory.createList(['']),
            create: algorithm.getCreateFunc(1)
        });
        //组选复式
        factory.addRule(rules[4].ids, {
            algorithm: algorithm.group,
            algorithmProps: {
                mainRow: 0,
                cTimes: 2
            },
            list: factory.createList(['']),
            create: algorithm.getCreateFunc(2, {
                outerSort: true
            })
        });
        //组选单式
        factory.addRule(rules[5].ids, {
            type: 'input',
            validate: algorithm.getValidateFunc(2, {
                acceptRepeat: 0,
                innerSort: true
            }),
            create: algorithm.getCreateFunc(2, {
                slice: [1],
                outerSort: true
            })
        });

        //组选和值
        factory.addRule(rules[6].ids, {
            algorithm: algorithm.fromConfig,
            algorithmProps: {
                config: [null, 1, 1, 2, 2, 3, 3, 4, 4, 5, 4, 4, 3, 3, 2, 2, 1, 1]
            },
            list: factory.createList([''], {
                items: _.range(1, 18),
                operate: 'none'
            }),
            create: algorithm.getCreateFunc(1, {
                range: _.range(1, 18)
            })
        });

        //组选包胆
        factory.addRule(rules[7].ids, {
            algorithm: algorithm.staticVal,
            algorithmProps: {
                val: 9
            },
            list: factory.createList([''], {
                operate: 'none',
                limits: [
                    {
                        name: 'conflict-x',
                        data: {
                            num: 1
                        }
                    }
                ]
            }),
            create: algorithm.getCreateFunc(1)
        });
    }

    //==================================================
    //后二

    addTwoRules([
        {
            ids: [ticketId, '130101'],
            list: [null, null, null, '十位', '个位']
        },
        {ids: [ticketId, '130102']},
        {ids: [ticketId, '130103']},
        {ids: [ticketId, '130104']},
        {ids: [ticketId, '130201']},
        {ids: [ticketId, '130202']},
        {ids: [ticketId, '130203']},
        {ids: [ticketId, '130204']}
    ]);

    //==================================================
    //一星

    factory.addRule([ticketId, '140101'], {
        algorithm: algorithm.addAll,
        list: factory.createList(['万位', '千位', '百位', '十位', '个位']),
        create: algorithm.getCreateFunc(1, {
            matching: true
        })
    });

    //==================================================

}

module.exports = {
    install: function(ticketId) {
        _create(ticketId);
    }
};