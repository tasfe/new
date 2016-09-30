"use strict";

require('./index.scss');

var DialogModule = Base.Module.extend({

  startWithParent: false,

  show: function(options, targetEl) {

    var $container = targetEl ? $(targetEl) : $('body');

    _.defaults(options || {}, {
      show: true,
      bodyClass: '',
      modalClass: '',
      size: '',
      backdrop: 'static'
    });

    if (!options.id) {
      options.id = 'js-mo-' + _.uniqueId();
    }

    if (options.id && ($container.find('#' + options.id).size() > 0)) {
      $container.find('#' + options.id).next('.modal-backdrop').remove().end().remove();
    }

    var html = [],
      id = options.id || ('dialog' + _.now());

    html.push('<div class="modal fade ' + options.modalClass + ' ' + options.size + '" id="');
    html.push(id);
    html.push('" tabindex="-1" role="dialog" aria-labelledby="' + id + 'Label"  aria-hidden="true">');
    html.push('<div class="modal-dialog">');
    html.push('<div class="modal-content">');

    if (options.title) {
      if (options.size == 'modal-info-julien') {
        $('body').addClass('overflow-hidden');

        html.push('<div class="modal-header-left">消息管理</div>');
      }
      html.push('<div class="modal-header">');
      html.push('<i class="fa fa-times-circle close js-no-lock  icon-remove-sign"  aria-hidden="true" data-dismiss="modal">');
      //html.push('<span aria-hidden="true">&times;</span>');
      html.push('</i>');
      html.push('<h4 class="modal-title" id="' + id + 'Label">' +
        //'<span class="portlet-icon sfa sfa-sub-title-user vertical-sub"></span> ' +
        options.title + '</h4>');
      html.push('</div>');
    }

    if (options.body) {
      html.push('<div class="modal-body ' + options.bodyClass + '">' + options.body + '</div>');
    }

    if (options.footer) {
      html.push('<div class="modal-footer"><div class="text-center">' + options.footer + '</div></div>');
    }

    html.push('</div>');
    html.push('</div>');
    html.push('</div>');

    $container.append(html.join(''));
    if (options.show) {
      $container.find('#' + options.id).modal({
        backdrop: options.backdrop
      });
    }
    if (options.size == 'modal-info-julien') {
      $('.js-no-lock').on('click',function () {
        $('body').removeClass('overflow-hidden')
      })
    }

    return $container.find('#' + options.id);

  },

  hide: function(id, targetEl) {
    var $container = targetEl ? $(targetEl) : $('body');
    $container.find('#' + id).modal('hide');
  }

});

module.exports = DialogModule;
