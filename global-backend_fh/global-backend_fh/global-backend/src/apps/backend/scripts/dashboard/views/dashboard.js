define(function (require, exports, module) {

    var RechargeTotalChartView = require('dashboard/views/rechargeTotalChart');
    var BetRealTimeChartView = require('dashboard/views/betRealTimeChart');
    var UserRealTimeChatView = require('dashboard/views/userRealTimeChat');
    var ActivityUserChat = require('dashboard/views/activityUserChat');

    var LoginUserRealTimeChatView  = require('dashboard/views/loginUserTotalChart');
    var OnlineUserRealTimeChatView  = require('dashboard/views/onlineUserTotalChart');
    var TicketPlayChartView =  require('dashboard/views/ticketPlayChart');

    var DashboardView = Base.ItemView.extend({

        template: require('text!dashboard/templates/dashboard.html'),

        events: {},

        initialize: function () {
        },
        getTotalInfoXhr: function () {
            return Global.sync.ajax({
                url: '/intra/dashboard/gettotalinfo.json'
            });
        },
        getTicketPlayXhr: function () {
            return Global.sync.ajax({
                url: '/intra/dashboard/ticketplay.json'
            });
        },
        getLoginUserXhr: function () {
            return Global.sync.ajax({
                url: '/intra/dashboard/getloginuser.json'
            });
        },
        getOnlineUserXhr: function () {
            return Global.sync.ajax({
                url: '/intra/dashboard/getonlineuser.json'
            });
        },
        getRegUserXhr: function () {
            return Global.sync.ajax({
                url: '/intra/dashboard/getreguser.json'
            });
        },
        getActivityUserXhr: function () {
            return Global.sync.ajax({
                url: '/intra/dashboard/getactivityuser.json'
            });
        },
        getBetInfoXhr: function () {
            return Global.sync.ajax({
                url: '/intra/dashboard/getbetinfo.json'
            });
        },
        getRechargeInfoXhr: function () {
            return Global.sync.ajax({
                url: '/intra/dashboard/getrechargeinfo.json'
            });
        },
        onRender: function () {
            var self = this;
            var acctInfo = Global.memoryCache.get('acctInfo');
            self.$('.js-dashboard-name').html('Welcome Back,'+acctInfo.username);

            if(!Global.authority.db || !Global.authority.db.page ){
                this.$('.js-dashboard-page').addClass("hidden");
                return ;
            }
            self.getTotalInfoXhr().always(function () {
            }).fail(function () {
                // 处理失败
            }).done(function (res) {
                if (res && res.result === 0) {
                    self.$('.js-dashboard-access').html(res.root.loginNum);
                    self.$('.js-dashboard-recharge').html(_(res.root.recharge).convert2yuan({fixed: 0}));
                    self.$('.js-dashboard-bet').html(_(res.root.bet).convert2yuan({fixed: 0}));
                    self.$('.js-dashboard-profit').html(_(res.root.profit).convert2yuan({fixed: 0}));
                } else {
                    Global.ui.notification.show('数据异常。');
                }
            });
            this.subscribe('acct', 'acct:updating', function () {
                self.renderAcctInfoView();
            });

            this.$ticketPlayChart = this.$('.js-db-ticket-play-chart');
            this.$loginUserTotolChart = this.$('.js-db-loginUser-total-chart');
            this.$onlineUserTotolChart = this.$('.js-db-onlineUser-total-chart');
            this.$rechargeTotolChart = this.$('.js-db-recharge-total-chart');
            this.$betTotolChart = this.$('.js-db-bet-chart');
            this.$regUserTotolChart = this.$('.js-db-regUser-total-chart');
            this.$userTotolChart = this.$('.js-db-activityUser-chart');

            var ticketPlayOption = this.TicketPlayOption();
            var loginUserTotalOption = this.LoginUserOption();
            var onlineUserTotalOption = this.OnlineUserOption();
            var rechargeTotalOption = this.RechargeOption();
            var betRealTimeOption = this.BetRealTimeOption();
            var userRealTimeOption = this.UserRealTimeOption();
            var activityUserOptionOption= this.ActivityUserOption();

            //玩彩情况
            self.getTicketPlayXhr().always(function () {
            }).fail(function () {
                // 处理失败
            }).done(function (res) {
                if (res && res.result === 0) {
                    data = res.root;
                    if (!_.isEmpty(data)) {
                        var ticketOrder = ['分分彩','重庆时时彩','江西时时彩','新疆时时彩','天津时时彩','黑龙江时时彩','山东11选5','广东11选5','江西11选5','福彩3D','P5/P3'];
                        data = _(data).sortBy(function(item){
                            return _(ticketOrder).indexOf(item.ticketName);
                        });
                        ticketPlayOption.xAxis[0].data = _(data).pluck('ticketName');
                        ticketPlayOption.series[0].data = _(data).pluck('count');
                    } else {
                        ticketPlayOption.series[0] = {};
                    }

                    new TicketPlayChartView({
                        el: self.$ticketPlayChart
                    }).render().renderChart(ticketPlayOption);
                } else {
                    Global.ui.notification.show('数据异常。');
                }
            });
            //访问人数
            self.getLoginUserXhr().always(function () {
            }).fail(function () {
                // 处理失败
            }).done(function (res) {
                if (res && res.result === 0) {
                    loginUserTotalOption.xAxis[0].data= res.root.dateList;
                    loginUserTotalOption.series[0].data = res.root.numList;

                    new LoginUserRealTimeChatView({
                        el: self.$loginUserTotolChart
                    }).render().renderChart(loginUserTotalOption);
                } else {
                    Global.ui.notification.show('数据异常。');
                }
            });

            //在线用户
            self.getOnlineUserXhr().always(function () {
            }).fail(function () {
                // 处理失败
            }).done(function (res) {
                if (res && res.result === 0) {

                    onlineUserTotalOption.xAxis[0].data= res.root.dateList;
                    onlineUserTotalOption.series[0].data = res.root.numList;
            //var root = {
            //    "dateList":["2016-03-02 00:00:00","2016-03-02 08:00:00","2016-03-02 16:00:00","2016-03-03 00:00:00","2016-03-03 08:00:00","2016-03-03 16:00:00"],
            //    "numList":[5,9,4,20,9,6]
            //}
            //onlineUserTotalOption.xAxis[0].data= root.dateList;
            //onlineUserTotalOption.series[0].data = root.numList;

                    new OnlineUserRealTimeChatView({
                        el: self.$onlineUserTotolChart
                    }).render().renderChart(onlineUserTotalOption);
                } else {
                    Global.ui.notification.show('数据异常。');
                }
            });

            self.getRegUserXhr().always(function () {
            }).fail(function () {
                // 处理失败
            }).done(function (res) {
                if (res && res.result === 0) {
                    userRealTimeOption.xAxis[0].data= res.root.dateList;
                    userRealTimeOption.series[0].data = res.root.numList;

                    new UserRealTimeChatView({
                        el: self.$regUserTotolChart
                    }).render().renderChart(userRealTimeOption);
                } else {
                    Global.ui.notification.show('数据异常。');
                }
            });

            self.getActivityUserXhr().always(function () {
            }).fail(function () {
                // 处理失败
            }).done(function (res) {
                if (res && res.result === 0) {
                    activityUserOptionOption.xAxis[0].data= res.root.dateList;
                    activityUserOptionOption.series[0].data = res.root.numList;
                    new ActivityUserChat({
                        el: self.$userTotolChart
                    }).render().renderChart(activityUserOptionOption);
                } else {
                    Global.ui.notification.show('数据异常。');
                }
            });
            self.getBetInfoXhr().always(function () {
            }).fail(function () {
                // 处理失败
            }).done(function (res) {
                if (res && res.result === 0) {
                    betRealTimeOption.xAxis[0].data= res.root.dateList;
                    betRealTimeOption.series[0].data = _(res.root.moneyList).map(function(money){
                        return parseInt(_(money).formatDiv(10000,{fixed:0}));
                    });
                    new BetRealTimeChartView({
                        el: self.$betTotolChart
                    }).render().renderChart(betRealTimeOption);
                } else {
                    Global.ui.notification.show('数据异常。');
                }
            });
            self.getRechargeInfoXhr().always(function () {
            }).fail(function () {
                // 处理失败
            }).done(function (res) {
                if (res && res.result === 0) {
                    rechargeTotalOption.xAxis[0].data= res.root.dateList;

                    rechargeTotalOption.series[0].data = _(res.root.moneyList).map(function(money){
                        return parseInt(_(money).formatDiv(10000,{fixed:0}));
                    });

                    new RechargeTotalChartView({
                        el: self.$rechargeTotolChart
                    }).render().renderChart(rechargeTotalOption);

                } else {
                    Global.ui.notification.show('数据异常。');
                }
            });
        },
        TicketPlayOption:function () {
            return {
                tooltip: {
                    trigger: 'axis'
                },
                //  show : true,
                //  color : ['#fff','#fff','#fff','#fff'],
                //  feature : {
                //    magicType: {show: true, type: ['line', 'bar']},
                //    restore : {show: true},
                //    saveAsImage : {show: true}
                //  }
                //},
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: true,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#2a2a2a'
                            },
                            interval: 0,
                            rotate: 15
                        },
                        axisLine: {    // 轴线
                            show: true,
                            lineStyle: {
                                color: '#8c8d8d',
                                type: 'solid',
                                width: 0.5
                            }
                        },
                        axisTick: {    // 轴标记
                            show: false
                            //length: 10,
                            //lineStyle: {
                            //  color: '#25bccc',
                            //  type: 'solid',
                            //  width: 2
                            //}
                        },
                        splitLine: {
                            show: false,
                            lineStyle: {
                                color: '#8c8d8d',
                                type: 'solid',
                                width: 1
                            }
                        },
                        data: ['重庆时时彩', '江西时时彩', '繁华分分彩', '山东十一选五', '广东十一选五', '3D', '排列3/5']
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        position: 'left',
                        //  boundaryGap: [0, 0.1],
                        axisLabel: {
                            formatter: '{value} ',
                            show: true,
                            textStyle: {
                                color: '#8c8d8d'
                            }
                        },
                        axisLine: {    // 轴线
                            show: false,
                            //onZero: true,
                            lineStyle: {
                                color: '#8c8d8d',
                                type: 'solid',
                                width: 2
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#8c8d8d',
                                type: 'solid',
                                width: 0.5
                            }
                        }
                    }
                    //{
                    //  type: 'value',
                    //  position: 'right',
                    //  axisLine: {    // 轴线
                    //    show: true,
                    //    //onZero: true,
                    //    lineStyle: {
                    //      color: '#25bccc',
                    //      type: 'solid',
                    //      width: 1
                    //    }
                    //  }
                    //}
                ]
                ,
                series: [
                    {
                        name: '玩彩人数',
                        type: 'bar',
                        barMinHeight: 1,
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    position: 'top',
                                    color: '#2a2a2a'
                                },
                                color: '#e8675d'
                            }
                        },
                        data: [0, 0, 0, 0, 0, 0, 0]
                    }
                ]
            };
        },

        LoginUserOption:function () {
            return {
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:[]
                },
                toolbox: {
                    show : true,
                    feature : {
                        dataZoom : {show: true},
                        dataView : {show: true},
                        magicType : {show: true, type: ['line', 'bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                dataZoom : {
                    show : true,
                    realtime : true,
                    start : 75,
                    end : 100
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data :[]
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        axisLabel : {
                            formatter: '{value} 人'
                        }
                    }
                ],
                series : [
                    {
                        name:'最高',
                        type:'line',
                        data:[],
                        markLine : {
                            data : [
                                {type : 'average', name: '平均值'}
                            ]
                        }
                    }
                ]
            }
        },
        OnlineUserOption: function () {
            return {
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:[]
                },
                toolbox: {
                    show : true,
                    feature : {
                        dataZoom : {show: true},
                        dataView : {show: true},
                        magicType : {show: true, type: ['line', 'bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                dataZoom : {
                    show : true,
                    realtime : true,
                    start : 92,
                    end : 100
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data :[],
                        splitNumber: 1,
                        axisLabel: {
                            interval: 23,
                            formatter: function(val){
                                var str = val.substring(0,10);
                                return  str;
                            }
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        axisLabel : {
                            formatter: '{value} 人'
                        }
                    }
                ],
                series : [
                    {
                        name:'最高',
                        type:'line',
                        data:[],
                        markLine : {
                            data : [
                                {type : 'average', name: '平均值'}
                            ]
                        }
                    }
                ]
            }
        },
        RechargeOption: function () {
            return {
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:[]
                },
                toolbox: {
                    show : true,
                    feature : {
                        dataZoom : {show: true},
                        dataView : {show: true},
                        magicType : {show: true, type: ['line', 'bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                dataZoom : {
                    show : true,
                    realtime : true,
                    start : 75,
                    end : 100
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data :[]
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        axisLabel : {
                            formatter: '{value} 元'
                        }
                    }
                ],
                series : [
                    {
                        name:'最高',
                        type:'line',
                        data:[],
                        markLine : {
                            data : [
                                {type : 'average', name: '平均值'}
                            ]
                        }
                    }
                ]
            }
        },
        BetRealTimeOption: function () {
            return {
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:[]
                },
                toolbox: {
                    show : true,
                    feature : {
                        dataZoom : {show: true},
                        dataView : {show: true},
                        magicType : {show: true, type: ['line', 'bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                dataZoom : {
                    show : true,
                    realtime : true,
                    start : 75,
                    end : 100
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data :[]
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        axisLabel : {
                            formatter: '{value} 元'
                        }
                    }
                ],
                series : [
                    {
                        name:'最高',
                        type:'line',
                        data:[],
                        markLine : {
                            data : [
                                {type : 'average', name: '平均值'}
                            ]
                        }
                    }
                ]
            }
        },
        UserRealTimeOption: function () {
            return {
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:[]
                },
                toolbox: {
                    show : true,
                    feature : {
                        dataZoom : {show: true},
                        dataView : {show: true},
                        magicType : {show: true, type: ['line', 'bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                dataZoom : {
                    show : true,
                    realtime : true,
                    start : 75,
                    end : 100
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data :[]
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'注册人数',
                        type:'line',
                        data:[],
                        markPoint : {
                            data : [
                                {type : 'max', name: '最大值'},
                                {type : 'min', name: '最小值'}
                            ]
                        },
                        markLine : {
                            data : [
                                {type : 'average', name: '平均值'}
                            ]
                        }
                    }
                ]
            }
        },
        ActivityUserOption: function () {
            return {
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:[]
                },
                toolbox: {
                    show : true,
                    feature : {
                        dataZoom : {show: true},
                        dataView : {show: true},
                        magicType : {show: true, type: ['line', 'bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                dataZoom : {
                    show : true,
                    realtime : true,
                    start : 75,
                    end : 100
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data :[]
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'活跃人数',
                        type:'line',
                        data:[],
                        markPoint : {
                            data : [
                                {type : 'max', name: '最大值'},
                                {type : 'min', name: '最小值'}
                            ]
                        },
                        markLine : {
                            data : [
                                {type : 'average', name: '平均值'}
                            ]
                        }
                    }
                ]
            }
        },
        renderAcctInfoView: function () {
            var acctInfo = Global.memoryCache.get('acctInfo');
        }
    });

    module.exports = DashboardView;
});