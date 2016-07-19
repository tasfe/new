"use strict";

require('./index.scss');

var FooterView = Base.ItemView.extend({

  template: require('./index.html'),


  render: function() {
    this.$el.html(_(this.template).template()(this.options));

    this.$('.footer-title-android').popover({
      trigger: 'click',
      html: true,
      container: '.footer-android-main',
      content: '<div class="js-gl-popover footer-popover"><img src="'+ require('./android-qrcode.png')+'"</div>',
      placement: 'top'
    });

    this.$('.footer-title-apple').popover({
      trigger: 'click',
      html: true,
      container: '.footer-apple-main',
      content: '<div class="js-gl-popover footer-popover"><img src="'+ require('./ios-qrcode.png')+'"</div>',
      placement: 'top'
    });

    this.$('.footer-title-h5').popover({
      trigger: 'click',
      html: true,
      container: '.footer-h5-main',
      content: '<div class="js-gl-popover footer-popover"><img src="'+ require('./h5-qrcode.png')+'"</div>',
      placement: 'top'
    });


    this.$('.footer-title-wechat').popover({
      trigger: 'click',
      html: true,
      container: '.footer-wechat-main',
      content: '<div class="js-gl-popover footer-popover"><img src="'+ require('./wechat-qrcode.png')+'"></div>',
      placement: 'top'
    });

  }
});

module.exports = FooterView;
