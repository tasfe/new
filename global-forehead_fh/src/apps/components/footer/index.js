"use strict";

require('./index.scss');

var FooterView = Base.ItemView.extend({

  template: require('./index.html'),
  events: {
    'mouseover .js-footer-qrcode': 'showBigQrcode',
    'mouseout .js-footer-qrcode': 'hideBigQrcode'

  },

  render: function() {
    this.$el.html(_(this.template).template()(this.options));
    this.$qrcodebig = this.$(".js-qrcode-big");
    // this.$('.footer-title-wechat').popover({
    //   trigger: 'click',
    //   html: true,
    //   container: '.footer-wechat-main',
    //   content: '<div class="js-gl-popover footer-popover"><img src="'+ require('./wechat-qrcode.png')+'"></div>',
    //   placement: 'top'
    // });

  },
  showBigQrcode: function(){
    this.$qrcodebig.removeClass("hidden");
  },
  hideBigQrcode: function(){
    this.$qrcodebig.addClass("hidden");
  }
});

module.exports = FooterView;
