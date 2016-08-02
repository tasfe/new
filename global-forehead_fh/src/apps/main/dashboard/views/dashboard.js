"use strict";

require('./../misc/index.scss');

var bannerConfig = require('../misc/bannerConfig');
var ticketConfig = require('skeleton/misc/ticketConfig');

var DashboardView = Base.ItemView.extend({

  template: require('dashboard/templates/dashboard.html'),

  bannerTpl: _(require('dashboard/templates/banner.html')).template(),

  dynamicTpl: _(require('dashboard/templates/dashboard-dynamic.html')).template(),

  ticketListTpl: _(require('dashboard/templates/dashboard-ticketList.html')).template(),

  events: {
    'click .js-db-ticket-bread-item': 'ticketBreadHandler',
    'click .js-db-ticket-scroll': 'ticketScrollHandler'
    //'click .js-db-prev': 'prevPageHandler',
    //'click .js-db-next': 'nextPageHandler'
  },

  serializeData: function() {
    return {
      loading: Global.ui.loader.get()
    };
  },

  //获取平台动态
  getDynamicXhr: function(data) {
    return Global.sync.ajax({
      url: '/info/activitylist/getbulletinlist.json',
      data: data
    });
  },
  getBannerADXhr: function() {
    return Global.sync.ajax({
      url: '/acct/usernotice/getdashboardadvertise.json'
    });
  },

  onRender: function() {
    var self = this;

    this.$('#jsDbCarousel').carousel({
      interval: 5000
    });

    this.$ticketMain = this.$('.js-db-ticketList');
    this.$dynamicList = this.$('.js-db-dynamic-list');
    this.$navigationLiList = this.$('.js-db-mb-na');
    this.$imgList = this.$('.js-db-mb-item');
    this.$pageSize = this.$('.js-db-pageSize');
    this.$pageIndex = this.$('.js-db-pageIndex');
    this.$rowCount = this.$('.js-db-rowCount');
    //this.$prevPage = this.$('.js-db-prev');
    //this.$nextPage = this.$('.js-db-next');

    this.subscribe('acct', 'acct:updating', function() {
      self.renderAcctInfoView();
    });

    var data = {
      pageSize: 5,
      pageIndex: 0
    };

    this.renderTicketList();

    this.renderDynamicList(data);
    this.renderMainBannerAD();

  },

  renderMainBannerAD: function() {
    var self = this;
    this.getBannerADXhr().done(function(res) {
      if (res.result === 0) {
        self.generateBannerAD(res.root);
      }
    });
  },

  renderDynamicList: function(data) {
    var self = this;
    this.getDynamicXhr(data)
      .done(function(res) {
        if (res.result === 0) {
          self.generateDynamicList(res.root);
          self.$pageIndex.val(data.pageIndex);
          self.$rowCount.val(res.root.rowCount);
          //self.$prevPage.toggleClass('disabled', data.pageIndex < 1);

          var pageSize = Number(self.$pageSize.val());
          var rowCount = Number(res.root.rowCount);
          if (_(pageSize).isNumber() && _(pageSize).isFinite() && _(rowCount).isNumber() && _(rowCount).isFinite()) {
            if (data.pageIndex >= Math.ceil(rowCount / pageSize) - 1) {
              //self.$nextPage.addClass('disabled');
            } else {
              //self.$nextPage.removeClass('disabled');
            }
          }
        }
      });
  },

  renderTicketList: function() {
    this.$('.js-db-ticketList').html(this.ticketListTpl({
      ticketList: ticketConfig.getCompleteAll()
    }));
    var $fiveHtml = this.$('.js-db-ticketList').find('.js-db-ticketList-item-12');
    var $cqHtml = this.$('.js-db-ticketList').find('.js-db-ticketList-item-1')
    this.exchange($fiveHtml,$cqHtml);
  },
  exchange: function(a,b){
    var n = a.prev();
    var p = b.next();
    b.insertAfter(n);
    a.insertBefore(p);
  },

  renderAcctInfoView: function() {
    var acctInfo = Global.memoryCache.get('acctInfo');

    this.$('.js-db-nickName').html(acctInfo.uName || acctInfo.username);
    this.$('.js-db-balance').html(acctInfo.fBalance);
    this.$('.js-db-lastLoginTime').html(acctInfo.fLastLoginTime);
    this.$('.js-db-curtIp').html(acctInfo.loginIp);

    if (acctInfo.loginIp !== acctInfo.lastLoginIp) {
      this.$('.js-db-diff-ip').removeClass('hidden');
    }
  },

  //event handlers

  ticketBreadHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);

    if (this.$slideNav.hasClass('slide-animate')) {
      return false;
    }

    var index = $target.index();
    var currentIndex = this.$breads.filter('.active').index();
    var $currentPanel = this.$slideNav.find('.js-db-slide-panel').filter('.active');
    var $targetPanel = this.$slideNav.find('.js-db-slide-panel').eq(index);

    $target.addClass('active').siblings().removeClass('active');

    $targetPanel.addClass('active');

    if (index === currentIndex) {
      return false;
    }

    if (index > currentIndex) {
      this.$slideNav.addClass('slide-animate').css('left', -this.$ticketMain.width());
    } else {
      this.$slideNav.css('left', -this.$ticketMain.width());
      _.delay(function() {
        self.$slideNav.addClass('slide-animate').css('left', 0);
      }, 1);
    }

    _.delay(function() {
      self.$slideNav.removeClass('slide-animate');
      $currentPanel.removeClass('active');
      $targetPanel.addClass('active');
      self.$slideNav.css('left', 0);
    }, 500);
  },

  //event handlers
  ticketScrollHandler: function(e) {
    var $target = $(e.currentTarget);
    var top = 0;

    if ($target.hasClass('down')) {
      this.$ticketMain.css('top', '');
    } else {
      top += Global.noticeRegin.currentView.isShow() ? 0 : 30;

      this.$ticketMain.css('top', top);
    }

    $target.toggleClass('down');
  },

  generateDynamicList: function(data) {
    this.$dynamicList.html(_(data.buList).map(function(item) {
      var date = moment(item.time);
      var day = date.date();
      var month = date.month() + 1;
      return this.dynamicTpl({
        day: day,
        month: month,
        desc: item.desc,
        title: item.title,
        bulletionId: item.bulletionId
      });
    }, this).join(''));
  },

  generateBannerAD: function(data) {
    var liList = [];

    if (_(data).isEmpty()) {
      data = bannerConfig;
    }

    //_(data).each(function(item, index) {
    //  liList.push('<li data-target="#jsDbCarousel" data-slide-to="' + index + (index === 0 ? '" class="active"' : '"') + '></li>');
    //});

    if(_(liList).size()>0){
      this.$navigationLiList.html(liList.join(''));
    }

    this.$imgList.html(this.bannerTpl({
      data: data
    }));

    var currentNum = 0;
    
    var adTime = setInterval(function () {
      var num = $('.js-db-dynamic-list li').length;
      if (num == currentNum + 1) {
        currentNum = 0;
        $(".js-db-dynamic-list").animate({marginTop:0});
      }
      else{
        currentNum++;
        $(".js-db-dynamic-list").animate({marginTop:currentNum * 40 * -1});
      }
    },5000);

    $('.js-preInfo').on('click',function () {
      var num = $('.js-db-dynamic-list li').length;
      if (currentNum == 0) {
        currentNum = num -1;
        $(".js-db-dynamic-list").animate({marginTop:currentNum * 40 * -1});
      }
      else{
        currentNum--;
        $(".js-db-dynamic-list").animate({marginTop:currentNum * 40 * -1});
      }
    })

    $('.js-nextInfo').on('click',function () {
      var num = $('.js-db-dynamic-list li').length;
      if (num == currentNum + 1) {
        currentNum = 0;
        $(".js-db-dynamic-list").animate({marginTop:0});
      }
      else{
        currentNum++;
        $(".js-db-dynamic-list").animate({marginTop:currentNum * 40 * -1});
      }
    })

  }
});

module.exports = DashboardView;
