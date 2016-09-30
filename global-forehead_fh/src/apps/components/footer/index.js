"use strict";

require('./index.scss');

var FooterView = Base.ItemView.extend({

  template: require('./index.html'),

  render: function() {
    this.$el.html(_(this.template).template()(this.options));

    // this.$('.footer-title-wechat').popover({
    //   trigger: 'click',
    //   html: true,
    //   container: '.footer-wechat-main',
    //   content: '<div class="js-gl-popover footer-popover"><img src="'+ require('./wechat-qrcode.png')+'"></div>',
    //   placement: 'top'
    // });

  }
});

module.exports = FooterView;
