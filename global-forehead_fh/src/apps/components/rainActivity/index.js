"use strict";

require('./index.scss');

var redbags;

var RainActivity = Base.ItemView.extend({
  template: '<div class="modal-backdrop fade in"></div><div class="js-rain rain"></div>' +
  '<i class="js-rain-close rain-close fa fa-times-circle"></i>',

  className: '',

  itemTpl: _(require('./item.html')).template(),

  events: {
    'mousedown .js-co-raindrop': 'getRedbagHandler',
    'click. .js-rain-close': 'rainCloseHandler'
  },

  getRedbagXhr: function() {
    return Global.sync.ajax({
      url: '/info/rainactivity/doget.json',
      data: {
        activityId: 3
      }
    });
  },

  onRender: function() {
    var self = this;
    this.$rain = this.$('.js-rain');

    //if (moment().isBetween('2015/12/31 18:00:00', '2016/1/1 23:59:00')) {
    //  redbags = [
    //    //require('./redbag-1.png'),
    //    //require('./redbag-2.png'),
    //    //require('./redbag-3.png')
    //    require('./redbag-4.png')
    //  ];
    //} else {
      redbags = [
        require('./redbag.png')
      ];
    //}

    var $redbags = _(redbags).map(function(png) {
      return $(self.itemTpl({
        redbag: png
      }));
    });

    this.timer = setInterval(function() {
      var $redbag = _($redbags).sample();
      var $clone = $redbag.clone();
      self.$rain.append($clone);

      setTimeout(function() {
        var top = _.random(120, 180);
        var left = _.random(-20, 140);
        var angle = - Math.atan((left - 40) / (top + 50)) * 180 / Math.PI;
        $clone.css({
          top:  top + '%',
          left: left + '%',
          'transform': 'rotate(' + angle + 'deg)'
        });
      }, 10);

      setTimeout(function() {
        $clone.remove();
      }, 12010);
    }, 1000 / 5);

    this.countdownStop();

    Global.ui.notification.setPrevent(true);
  },

  countdownStop: function() {
    var self = this;
    _.delay(function() {
      self.destroy();
    }, this.options.duration * 1000);
  },

  rainBack: function() {
    this.$rain.addClass('rain-back');
  },

  rainContinue: function() {
    this.$rain.removeClass('rain-back');
  },

  //event handlers

  getRedbagHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);
    this.rainBack();
    this.getRedbagXhr()
      .done(function(res) {
        var type = 'info';
        var data;
        var msg;
        if (res && res.result === 0) {
          data = res.root[0];

          if (data.resultType === 0) {
            msg = '亲，您的红包被别人抢走啦';
          } else if (data.resultType === 1) {
            msg = '恭喜您，获得' + _(data.result).convert2yuan() + '元红包！';
            type = 'success';
          }
          Global.ui.notification.show(msg, {
            id: 'rain',
            force: true,
            type: type,
            event: function() {
              self.rainContinue();
            }
          });
        } else {
          var notice = '您与其他伙伴共享同一个IP，且TA也领过了。';
          if(res.msg.indexOf('300')>=0){
            notice = res.msg;
          }
          Global.ui.notification.show('<div class="text-left"><p>红包飞走了，下次再接再厉。</p>' +
            '<div><div class="text-sun">'+notice+'</div>' +
            '</div></div>', {
            id: 'rain',
            force: true,
            type: type,
            event: function() {
              Global.m.rainActivity.skip();
              self.destroy();
            }
          });
        }
      });
  },

  rainCloseHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);

    $target.remove();
    this.rainBack();
    Global.ui.notification.show('您跳过了本次抢红包<div>（下一轮还可以继续参与）</div>', {
      id: 'rain',
      force: true,
      event: function() {
        Global.m.rainActivity.skip();
        self.destroy();
      }
    });
  },

  onDestroy: function() {
    clearInterval(this.timer);
    Global.ui.notification.setPrevent(false);
  }
});

module.exports = RainActivity;
