//var servers = require('skeleton/misc/servers');

require('./index.scss');
require('./../misc/common-init.js');

$.widget('gl.changeUrl', {

  template: require('./index.html'),

  getServerListXhr:function () {
    return Global.sync.ajax({
      url: '/info/urls/list.json'
    });
  },
  getBannerADXhr: function () {
     return Global.sync.ajax({
          url: '/acct/usernotice/getroadadvertise.json'
     });
  },


  _create: function () {
    var self =this;
    this.element.html(_(this.template).template()({
      time: moment().format('M月DD日 ddd'),
      remember: Global.localCache.get('account.remember')
    }));
      $('#jsDbCarouselChangeUrl').carousel({
          interval: 5000
      });
    this.getBannerADXhr()
        .done(function (res) {
            console.log(JSON.stringify(res));
            if(res.result === 0){
                var datainfo = res.root;
                var html = '';
                _(datainfo).each(function (bannerinfo,index,list) {
                    if(index === 0){
                        var className = 'active';
                    }else{
                        var className = '';
                    }
                    if (bannerinfo.advUrl) {
                        var href = bannerinfo.advUrl;
                    }else{
                        var href = 'javascript:void(0)';
                    }
                    html += '<div class="item '+className+'">' +
                        '<a href="'+href+'" target="_blank">' +
                        '<img src="'+bannerinfo.picUrl+'" alt="'+bannerinfo.advName+'" >' +
                        '</a>' +
                        '</div>';
                });
                $(".js-db-mb-item").html(html);
            }else{
                //数据请求失败
                $(".banner").addClass("banner-defult");
            }

        });

    this._connectTest();

    $('.js-downloadList li').on('click',function () {
      $('.js-downloadList li').removeClass('sd');
      $('.js-downloadList li').eq( $(this).data('id') ).addClass('sd');
      $('.js-right div').addClass('hidden');
      $('.js-right div').eq( $(this).data('id') ).removeClass('hidden');
    });

    $('.js-refresh').on('click',function () {
      //$('.js-cu-List').empty();
      self._connectTest();
    });

    $('.js-collect').on('click',function () {
      var url = 'http://www.baidu.com/';
      var title = '繁华世界在线娱乐';

      if(window.external && 'addFavorite' in window.external){ // IE
          window.external.addFavorite(url, title);
      } else if(window.sidebar && window.sidebar.addPanel) { // Firefox23后被弃用
          window.sidebar.addPanel(url, title);
      } else if(window.opera && window.print) { // rel=sidebar，读取a链接的href，title 注：opera也转战webkit内核了
          this.title = title;
          return true;
      } else { // webkit - safari/chrome
          alert('请点击 ' + (navigator.userAgent.toLowerCase().indexOf('mac') != - 1 ? 'Command/Cmd' : 'CTRL') + ' + D 收藏该页面');
      }
    })
  },

  _connectTest: function() {
    var self = this;
    var showIndex = 0;
    var linList = [];

    this.getServerListXhr()
        .done(function (res) {
          if(res.result === 0){
            var servers = res.root;

            var defer = $.Deferred()
                .done(function() {
                  self.append(linList);
                });

            var contentCount = 0;

            _(servers).each(function(serverInfo, index, list) {
              var start = Date.now();
                serverInfo = serverInfo.indexOf('http://') > -1 ? serverInfo : 'http://'+serverInfo;
              $.ajax({
                url: serverInfo + '/connect-test.json',
                dataType: 'jsonp',
                jsonpCallback: 'abc',
                timeout: 2000
              })
                  .always(function(res) {
                    //self.element.find('.js-connect-server-' + index).addClass('connect-speeds-tested connect-speeds-' + Math.floor((Date.now() - start) / 200));
                    var serverAddress = serverInfo;
                    var timems = Math.floor((Date.now() - start));
                    linList.push({time:timems,server:serverAddress});
                    if (++contentCount === list.length) {
                      defer.resolve();
                    }
                  });

            });
          }else{
            Global.ui.notification.show('数据请求失败');
          }
        });

  },

  append: function(linList) {
    linList.sort(function (a, b) {
      return (a.time > b.time) ? 1 : -1;
    });

    this._cuListAppend(linList);
  },

  _cuListAppend:function (linList) {

    var html = '';
    _(linList).each(function (info,index) {
      if(index > -1 && index <2){
        var className = '';
      }else if(index >= 2 && index <= 3){
        var className = 'color2';
      }else{
        var className = 'color3';
      }
      html += ('<li>' +
          '<span class="k1 '+className+'">'+info.time+'ms</span>' +
          '<span class="k2">></span>' +
          '<span class="k3">'+info.server+'</span>' +
          '<a href="'+info.server+'">进入网站</a>' +
          '</li>');
    });
    $('.js-cu-List').html(html);

  }
});

$(document).ready(function() {
  $('.js-package').changeUrl();
});
