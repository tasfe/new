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
      draggable: true,
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
    html.push('<div class="modal-content clearfix">');

    if (options.title) {
      html.push('<div class="modal-header">');
      html.push('<i class="fa fa-times-circle close"  aria-hidden="true" data-dismiss="modal"></i>');
      html.push('<h4 class="modal-title" id="' + id + 'Label">' +
        //'<span class="portlet-icon sfa sfa-sub-title-user vertical-sub"></span> ' +
        options.title + '</h4>');
      html.push('</div>');
    } else if (options.titleClose) {
      html.push('<div class="modal-header clearfix">');
      html.push('<i class="fa fa-times-circle close"  aria-hidden="true" data-dismiss="modal"></i>');
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

    var $currentDialog = $container.find('#' + options.id);

    if (options.draggable) {
      $currentDialog.find('.modal-dialog').draggable({
        handle: $currentDialog.find('.modal-header'),
        containment: $('html')
      });
    }

    return $container.find($currentDialog);
  },

  hide: function(id, targetEl) {
    var $container = targetEl ? $(targetEl) : $('body');
    $container.find('#' + id).modal('hide');
  }
});

module.exports = DialogModule;
