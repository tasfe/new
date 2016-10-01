var servers = require('skeleton/misc/servers');

require('./index.scss');
require('./../misc/common-init.js');

$.widget('gl.changeUrl', {

  template: require('./index.html'),

  _create: function () {
    this.element.html(_(this.template).template()({
      time: moment().format('M月DD日 ddd'),
      remember: Global.localCache.get('account.remember')
    }));
    this._connectTest();

    $('.js-downloadList li').on('click',function () {
      $('.js-downloadList li').removeClass('sd');
      $('.js-downloadList li').eq( $(this).data('id') ).addClass('sd');
      $('.js-right div').addClass('hidden');
      $('.js-right div').eq( $(this).data('id') ).removeClass('hidden');
    })

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

    console.log(servers);

    _(servers).each(function(serverInfo, index) {
      var start = Date.now();

      $.ajax({
        url: serverInfo.server + '/connect-test.json',
        dataType: 'jsonp',
        jsonpCallback: 'abc',
        timeout: 2000
      })
      .always(function(res) {
          //self.element.find('.js-connect-server-' + index).addClass('connect-speeds-tested connect-speeds-' + Math.floor((Date.now() - start) / 200));
      });
    });
  }
});

$(document).ready(function() {
  $('.js-package').changeUrl();
});
