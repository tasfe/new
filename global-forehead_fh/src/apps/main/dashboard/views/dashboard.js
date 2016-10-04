"use strict";

require('./../misc/index.scss');

var bannerConfig = require('../misc/bannerConfig');
var ticketConfig = require('skeleton/misc/ticketConfig');

var LotteryTypeListView = require('dashboard/views/lotteryTypeList');

var DashboardView = Base.ItemView.extend({

  template: require('dashboard/templates/dashboard.html'),

  bannerTpl: _(require('dashboard/templates/banner.html')).template(),

  rollTpl: _(require('dashboard/templates/dashboard-roll.html')).template(),

  dynamicTpl: _(require('dashboard/templates/dashboard-dynamic.html')).template(),

  itemTpl:_.template(require('dynamicCenter/templates/noticeBoard-item.html')),

  AfficheTpl:_.template(require('dynamicCenter/templates/noticeDetail.html')),

  ticketListTpl: _(require('dashboard/templates/dashboard-ticketList.html')).template(),

  events: {
    'click .js-db-ticket-bread-item': 'ticketBreadHandler',
    'click .js-db-ticket-scroll': 'ticketScrollHandler',
    'click .js-dynamic-itemShow': 'dynamicItemShowHandler',
    // 'click .js-g2-a': 'afficShowHandler',
    'click .js-lottery': 'lottertyEnterHandler',
    'click .js-comingsoon': 'comeingsoonHandler',
    'mouseover .js-athena_st_07': 'tempMouseover',
    'mouseover .js-athena_st_08': 'tempMouseover',
    'mouseover .js-athena_st_09': 'tempMouseover',
    'mouseover .js-athena_st_10': 'tempMouseover',

    'mouseout .js-athena_st_07': 'tempMouseOut',
    'mouseout .js-athena_st_08': 'tempMouseOut',
    'mouseout .js-athena_st_09': 'tempMouseOut',
    'mouseout .js-athena_st_10': 'tempMouseOut',

    'mousedown  .js-athena_st_07': 'tempClick',
    'mousedown  .js-athena_st_08': 'tempClick',
    'mousedown  .js-athena_st_09': 'tempClick',
    'mousedown  .js-athena_st_10': 'tempClick',
  },

  dynamicItemShowHandler:function (e) {

    this.$afficheIndex = $(e.currentTarget).data('bulletionid');
    this.afficShowHandler();

  },
  afficShowHandler: function() {

    var self = this;
    var html = '<div class="affiche-body-back">'+
        '<div class="affiche-body-leftBody">' +
        '<div class="affiche-body-lefthead">公告列表</div>'+
        '<div class="js-affiche-list affiche-body-list"></div>'+
        '</div>' +
        '<div class="affiche-body-detail">' +
        '<div  class="affiche-body-righthead">平台公告<span class="affiche-body-close sfa sfa-dialog-close close js-no-lock" data-dismiss="modal"></span></div>' +
        '<div class="js-affiche-detail affiche-detail-content"></div>'+
        '</div>'+
        '</div>';

    var $dialog = Global.ui.dialog.show({
      size: 'modal-lg',
      body: html,
      bodyClass: 'ac-affiche-dialog'
    });

    $dialog.find('.ac-affiche-dialog').removeClass('modal-body');
    this.$grid = $dialog.find('.js-affiche-list');
    this.$gridDetail = $dialog.find('.js-affiche-detail');

    $dialog.on('hidden.modal', function () {
      $(this).remove();
    });

    self.startLoadAfficheList();

    $dialog.find('.js-affiche-list').on('click','.js-board-Affiche',function (e) {
      var $target = $(e.currentTarget);
      $dialog.find('.affiche-list-active').removeClass('affiche-list-active');
      $target.addClass('affiche-list-active');
      var afficheId = $target.data('affiche');
      self.startLoadAfficheDetail(afficheId);
    });

  },

  startLoadAfficheDetail:function (afficheId) {
    var self = this;
    Global.sync.ajax({
          url: '/info/activitylist/userGetbulletindetail.json',
          data: {
            bulletinId: afficheId
          }
        })
        .always(function() {
          self.loadingFinish();
        })
        .done(function(res) {
          if (res && res.result === 0) {
            self.renderAfficheDetail(res.root);
          } else {
            Global.ui.notification.show('通知详情获取失败');
          }
        });

  },
  renderAfficheDetail:function (rootInfo) {
    this.$gridDetail.html(this.AfficheTpl());
    this.$gridDetail.find('.js-nc-noticeDetailTitle').html(rootInfo.title);
    this.$gridDetail.find('.js-nc-noticeDetailDate').html(_(rootInfo.time).toTime());
    this.$gridDetail.find('.js-nc-noticeDetailContext').html(rootInfo.content);
  },

  startLoadAfficheList:function () {
    var self = this;
    Global.sync.ajax({
      url: '/info/activitylist/getbulletinlist.json',
      data: {
        'pageSize': 20,
        'pageIndex': 0
      }
    }).always(function(){
          //开始加
        })
        .done(function(res) {
          var data = res.root || {};
          if (res && res.result === 0) {
            self.renderGrid(data.buList);
          } else {
            Global.ui.notification.show('加载失败，请稍后再试');
          }
        })
        .fail(function () {
          Global.ui.notification.show('网络报错！');
        });
  },

  renderGrid: function(rowList) {
    var self = this;
    self.startLoadAfficheDetail(this.$afficheIndex);

    if (_.isEmpty(rowList)) {
      this.$grid.html(this.getEmptyHtml('暂时没有动态'));
    } else {
      this.$grid.html(_(rowList).map(function(rowInfo) {
        var date = new Date(rowInfo.time);
        return this.itemTpl({
          title: rowInfo.title,
          date: date.getFullYear() +
          '-' + (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) +
          '-' + (date.getDate() < 10 ? '0'+ date.getDate() : date.getDate()) ,
          afficheId: rowInfo.bulletionId,
          desc: rowInfo.desc
        });
      }, this));
    }
  },

  getEmptyHtml: function(emptyTip) {
    var html = [];
    if (emptyTip) {
      html.push('<div class="js-wt-empty-container empty-container text-center">');
      html.push('<div class="empty-container-main">');
      html.push('<div class="sfa-grid-empty"></div>');
      html.push(emptyTip);
      html.push('</div>');
      html.push('</div>');
    }
    return html.join('');
  },


  tempMouseover:function(e){
    //this.clearClick();

    var $target = $(e.currentTarget);
    var index = $target.data('index');
    var self = this;
    //alert(index);
    if(index==7) {
     if(! self.$('.js-athena_st_07').hasClass('athnea-education_03')) {
        self.$('.js-athena_st_07').removeClass('athnea-education_01').removeClass('athnea-education_02').removeClass('athnea-education_03');
        self.$('.js-athena_st_07').addClass('athnea-education_02');
      }
    };
    if(index==8) {
     if(! self.$('.js-athena_st_08').hasClass('athnea-tiger_03')) {
       self.$('.js-athena_st_08').removeClass('athnea-tiger_01').removeClass('athnea-tiger_02').removeClass('athnea-tiger_03');
        self.$('.js-athena_st_08').addClass('athnea-tiger_02');
      }
    };
    if(index==9) {
      if(! self.$('.js-athena_st_09').hasClass('athnea-Reality_03')) {
        self.$('.js-athena_st_09').removeClass('athnea-Reality_01').removeClass('athnea-Reality_02').removeClass('athnea-Reality_03');
        self.$('.js-athena_st_09').addClass('athnea-Reality_02');
      }
    };
    if(index==10) {
      if(! self.$('.js-athena_st_10').hasClass('athnea-ticket_03')) {
        self.$('.js-athena_st_10').removeClass('athnea-ticket_01').removeClass('athnea-ticket_02').removeClass('athnea-ticket_03');
        self.$('.js-athena_st_10').addClass('athnea-ticket_02');
     }
    };
    },

  tempMouseOut:function(e){
    //this.clearClick();
    var $target = $(e.currentTarget);
    //$(e.currentTarget).mouseover(function(){
    //      alert(index);
    //})
    var index = $target.data('index');
    var self = this;
    // alert(index);

    if(index==7) {
     //if(! self.$('.js-athena_st_07').hasClass('athnea-education_03')) {
        self.$('.js-athena_st_07').removeClass('athnea-education_01').removeClass('athnea-education_02').removeClass('athnea-education_03');
        self.$('.js-athena_st_07').addClass('athnea-education_01');
      }
    //};
    if(index==8) {
      //if(! self.$('.js-athena_st_08').hasClass('athnea-tiger_03')) {
        self.$('.js-athena_st_08').removeClass('athnea-tiger_01').removeClass('athnea-tiger_02').removeClass('athnea-tiger_03');
        self.$('.js-athena_st_08').addClass('athnea-tiger_01');
      //}
    };
   if(index==9) {
      //if(! self.$('.js-athena_st_09').hasClass('athnea-Reality_03')) {
        self.$('.js-athena_st_09').removeClass('athnea-Reality_01').removeClass('athnea-Reality_02').removeClass('athnea-Reality_03');
        self.$('.js-athena_st_09').addClass('athnea-Reality_01');
      //}
    };
    if(index==10) {
     //if(! self.$('.js-athena_st_10').hasClass('athnea-ticket_03')) {
        self.$('.js-athena_st_10').removeClass('athnea-ticket_01').removeClass('athnea-ticket_02').removeClass('athnea-ticket_03');
        self.$('.js-athena_st_10').addClass('athnea-ticket_01');
     //}
   };
  },

  tempClick:function(e) {

    this.clearClick();
    var $target = $(e.currentTarget);
    //$(e.currentTarget).mouseover(function(){
    //      alert(index);
    //})
    var index = $target.data('index');
     //alert(index);

    if(index==7) {
      this.$('.js-athena_st_07').removeClass('athnea-education_01').removeClass('athnea-education_02').removeClass('athnea-education_03');
      $('.js-athena_st_07').addClass('athnea-education_03');
    };
    if(index==8) {
     this.$('.js-athena_st_08').removeClass('athnea-tiger_01').removeClass('athnea-tiger_02').removeClass('athnea-tiger_03');
      $('.js-athena_st_08').addClass('athnea-tiger_03');
    };
    if(index==9) {
     this.$('.js-athena_st_09').removeClass('athnea-Reality_01').removeClass('athnea-Reality_02').removeClass('athnea-Reality_03');
      $('.js-athena_st_09').addClass('athnea-Reality_03');
      $('.js-athena_st_03').removeClass('athnea-zr_01').removeClass('athnea-zr_02').removeClass('athnea-zr_03');
      $('.js-athena_st_03').addClass('athnea-zr_03');
      $('.js-athena_st_01').removeClass('athnea-st_01').removeClass('athnea-st_02').removeClass('athnea-st_03');
      $('.js-athena_st_01').addClass('athnea-st_01');
    };
    if(index==10) {
      this.$('.js-athena_st_10').removeClass('athnea-ticket_01').removeClass('athnea-ticket_02').removeClass('athnea-ticket_03');
      $('.js-athena_st_10').addClass('athnea-ticket_03');
    };
  },

  clearClick:function () {
    $('.js-athena_st_07').removeClass('athnea-education_01').removeClass('athnea-education_02').removeClass('athnea-education_03');
    $('.js-athena_st_08').removeClass('athnea-tiger_01').removeClass('athnea-tiger_02').removeClass('athnea-tiger_03');
    $('.js-athena_st_09').removeClass('athnea-Reality_01').removeClass('athnea-Reality_02').removeClass('athnea-Reality_03');
    $('.js-athena_st_10').removeClass('athnea-ticket_01').removeClass('athnea-ticket_02').removeClass('athnea-ticket_03');

    $('.js-athena_st_07').addClass('athnea-education_01');
    $('.js-athena_st_08').addClass('athnea-tiger_01');
    $('.js-athena_st_09').addClass('athnea-Reality_01');
    $('.js-athena_st_10').addClass('athnea-ticket_01');

  },



  comeingsoonHandler: function() {
      var self = this;

      var $dialogRe = Global.ui.dialog.show({
        id: _.now(),
        title: '敬请期待',
        size: 'modal-lg',
        body: '<div class="comingsoon-pic"></div>'
      });
  },

  lottertyEnterHandler: function() {

    var self = this;

    var $dialogRe = Global.ui.dialog.show({
      id: _.now(),
      title: '彩票游戏',
      size: 'modal-lg',
      body: '<div class="js-fc-quick-lottery active-container-header"></div>'
    });

    var lotteryTypeListView = new LotteryTypeListView({parentView: self});
    lotteryTypeListView.onRender();

    $dialogRe.on('click', '.js-list-active1', function(e) {
      $('.list-active').removeClass('list-active');
      var $target = $(e.currentTarget);
      $target.addClass('list-active');

      var currentIndex = $target.data('index');
      $('.js-lotteryList-0').addClass('hidden');
      $('.js-lotteryList-1').addClass('hidden');
      $('.js-lotteryList-2').addClass('hidden');
      $('.js-lotteryList-3').addClass('hidden');
      $('.js-lotteryList-4').addClass('hidden');
      $('.js-lotteryList-'+currentIndex).removeClass('hidden');


    });

    $dialogRe.on('click', '.js-list-close1', function(e) {
      $dialogRe.modal('hide');
    });

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

  //获取排行榜
  getRankListXhr: function() {
    return Global.sync.ajax({
      url: '/ticket/bethistory/prizehistory.json'
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
    this.$rolllist = this.$(".db-slogan");
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

    this.renderRankList();
  },

  renderMainBannerAD: function() {
    var self = this;
    this.getBannerADXhr().done(function(res) {
      //console.log("renderMainBannerAD res"+JSON.stringify(res));
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
          //console.log("renderDynamicList res:" + res);
          self.generateDynamicList(res.root);
          self.generateRollList(res.root);//添加首页滚动公告信息
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

  renderRankList: function() {
    var self = this;
    this.getRankListXhr()
      .done(function(res) {
       // console.log("renderRankList res"+res);
        if (res.result === 0) {
          var htmStr= "";
          _(res.root).each(function(info) {
            var timeInfo = _.compareTime(info.curTime, info.prizeTime);
            htmStr += '<p>恭喜'+info.userName.slice(0,6)+'在'+info.ticketName+'中'+info.bonus/10000+'元<span>'+timeInfo.data+timeInfo.unit+'前</span></p>';
          });
          self.$('.js-rank-list marquee').append(htmStr);
          setTimeout(function() {
            self.renderRankList();
          }, 60000);
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
      //data = bannerConfig;
      data = "";
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
    
    if (sessionStorage.getItem('adOk') == 1) {
    }
    else{
      sessionStorage.setItem('adOk', 1);
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
    }

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

  },
  //首页滚动公告信息
  generateRollList:function(data){
    var self = this;
    this.$rolllist.html(this.rollTpl({
          data: data
        })
    );
    self.rollSetInterval();

    clearInterval(self.timer22);
    var w = 0;
    var w2 = 0;
    var w3 = 1130;
    var next=0;
    var childLength = this.$('.db-slogan .g2').children().length;
    this.$rollListItem = this.$('.db-slogan .g2 a');
    this.$currentRollingItem = this.$('.db-slogan .g2 .on');
    w = this.$currentRollingItem.width();
    w2 = w;

    self.timer22 = setInterval(function() {
      if(w2 + w <= 0){
        next += 1;
        self.$rollListItem.css('left',"1130px");
        self.$rollListItem.removeClass("on");
        self.$rollListItem.eq(next).addClass("on");
        self.$currentRollingItem=self.$rollListItem.eq(next);
       // console.log(next);
        if(next == childLength-1){
          next=-1;
        }

        w2 = w3;
      }
      else{
        w2 -= 1;
      }

      self.$currentRollingItem.css('left',w2);
    }, 20);
  },
  //定时获取公告数据 5分钟
  rollSetInterval:function(){
    var self = this;
    var data = {
      pageSize: 5,
      pageIndex: 0
    };
    clearInterval(self.rollTime);
    self.rollTime=setInterval(function(){
      self.renderDynamicList(data);
    },300000);
  }
});

module.exports = DashboardView;
