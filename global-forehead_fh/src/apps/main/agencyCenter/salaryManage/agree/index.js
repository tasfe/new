"use strict";
var Countdown = require('com/countdown');

var SignedView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'click .js-ac-next': 'approveHandler'
  },

  approveXhr: function(data) {
    return Global.sync.ajax({
      url: '/info/dailysalary/approve.json',
      data: data
    });
  },

  //查询日薪签约信息
  getSalaryConfXhr: function(data){
    return Global.sync.ajax({
      url: '/info/dailysalary/reqinfo.json',
      data: data
    });
  },

  onRender: function() {

    var self = this;

    this.$countdown = this.$('.js-ac-sm-fg-countdown');
    this.$btnApprove = this.$('.js-as-approve');

    this.$table = this.$('.js-ac-sm-agree-table');
    this.$tableSpecial = this.$('.js-ac-sm-agree-table-special');
    this.$form = this.$('.js-ac-signed-form');
    this.$username = this.$('.ja-ac-sm-sign-username');
    this.$username.val(this.options.username);

    var acctInfo = Global.memoryCache.get('acctInfo');
    this.getSalaryConfXhr({username: acctInfo.username,userId:acctInfo.userId}).done(function(res){
      if(res.result===0){

        self.countdown = new Countdown({
          el: self.$countdown,
          color: 'red',
          size: 'sm'
        })
          .render(res.root.leftSeconds * 1000)
          .on('finish.countdown', function(e) {
            Global.ui.notification.show('您未在协议有效期内签署，当前协议已失效。', {
              event: function() {
                Global.m.oauth.check();
                Global.router.goTo('');
              }
            });
          });
        var list = res.root.agreement;
        var salarySpan = list[0].salarySpan;
        if(salarySpan>0){
          self.$('.js-ac-sm-agree-table-special-container').removeClass('hidden');
          self.$table.addClass('hidden');
        }else{
          self.$table.removeClass('hidden');
          self.$('.js-ac-sm-agree-table-special-container').addClass('hidden');
        }

        self.$table.staticGrid({
          colModel: [
            {label: '日薪等级', name: 'level', key: true, width: '20%', formatter: function(val,index) {
              return index+1;
            }},
            {label: '日量要求', name: 'saleAmount', width: '20%', formatter: function(val,index,rowInfo) {
              return '≥'+_(val).convert2yuan({fixed:0});
            }},
            {label: '是否需要亏损', name: 'needLoss', width: '20%', formatter: function(val,index,rowInfo) {
              return val?'是':'否';
            }},
            {label: '亏损要求', name: 'lossLimit', width: '20%', formatter: function(val,index,rowInfo) {

              return rowInfo.needLoss?'≥'+_(val).convert2yuan({fixed:0}):'/';
            }},
            {label: '日薪标准', name: 'salaryAmount', width: '20%', formatter: function(val,index,rowInfo) {
              return _(val).convert2yuan({fixed:0});
            }},
          ],
          height: 270,
          row: list||[],
          startOnLoading: false
        });

        self.$tableSpecial.staticGrid({
          colModel: [
            {label: '日量要求基础值', name: 'saleAmount', key: true, width: '15%', formatter: function(val,index) {
              return '≥'+_(val).convert2yuan({fixed:0});
            }},
            {label: '日薪发放基础值', name: 'salaryAmount', width: '15%', formatter: function(val,index,rowInfo) {
              return _(val).convert2yuan({fixed:0});
            }},
            {label: '日量要求跨度值', name: 'saleSpan', width: '15%', formatter: function(val,index,rowInfo) {
              return _(val).convert2yuan({fixed:0});
            }},
            {label: '日薪发放跨度值', name: 'salarySpan', width: '15%', formatter: function(val,index,rowInfo) {
              return _(val).convert2yuan({fixed:0});
            }},
            {label: '日薪最高值', name: 'maxSalary', width: '15%', formatter: function(val,index,rowInfo) {
              return _(val).convert2yuan({fixed:0});
            }},
            {label: '是否需要亏损', name: 'needLoss', width: '25%', formatter: function(val,index,rowInfo) {
              return val?'是':'否';
            }},
          ],
          height: 37,
          row: list||[],
          startOnLoading: false
        });
      }
    });
  },
  approveHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);
    var status = $target.data('status');

    this.$btnApprove.button('loading');

    this.approveXhr({
        status: status
      })
      .always(function() {
        self.$btnApprove.button('reset');
      })
      .done(function(res) {
        if (res && res.result === 0) {
          Global.m.oauth.check()
            .done(function(res) {
              if (res && res.result === 0) {
                if (status === 1) {
                  Global.ui.notification.show('签署日薪协议成功。', {
                    event: function() {
                      Global.m.oauth.check();
                      Global.router.goTo('ac/sm');
                    }
                  });
                } else {
                  Global.ui.notification.show('拒绝日薪协议成功。', {
                    event: function() {
                      Global.m.oauth.check();
                      Global.router.goTo('');
                    }
                  });
                }
              }
            });
        } else {
          Global.ui.notification.show(res.msg || '');
        }
      });
  }

});

module.exports = SignedView;
