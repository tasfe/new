define(function(require, exports, module) {

  var DialogModule = Base.Module.extend({

    startWithParent: false,

    show: function(options, targetEl) {

      var $container = targetEl ? $(targetEl) : $('body');

      _.defaults(options || {}, {
        show: true
      });

      if (!options.id) {
        options.id = 'js-mo-' + _.uniqueId();
      }

      if (options.id && ($container.find('#' + options.id).size() > 0)) {
        $container.find('#' + options.id).modal('show');
        return $container.find('#' + options.id);
      }

      var html = [],
        options = options || {},
        id = options.id || ('dialog' + _.now());

      html.push('<div class="modal fade" id="');
      html.push(id);
      html.push('" tabindex="-1" role="dialog" aria-labelledby="' + id + 'Label" aria-hidden="true">');
      html.push('<div class="modal-dialog ' + (options.size || '') + '">');
      html.push('<div class="modal-content" style=" ' + (options.bStyle || '') + '">');

      if (options.title) {
        html.push('<div class="modal-header">');
        html.push('<button type="button" class="close" data-dismiss="modal">');
        html.push('<span aria-hidden="true">&times;</span>');
        html.push('</button>');
        html.push('<h4 class="modal-title" id="' + id + 'Label">' + options.title + '</h4>');
        html.push('</div>');
      }

      if (options.body) {
        html.push('<div class="modal-body overflow-auto max-height-lg">' + options.body + '</div>');
      }

      if (options.footer) {
        html.push('<div class="modal-footer bg-grey"><div class="text-center">' + options.footer + '</div></div>');
      }

      html.push('</div>');
      html.push('</div>');
      html.push('</div>');

      $container.append(html.join(''));
      if (options.show) {
        $container.find('#' + options.id).modal({
          backdrop: 'static'
        });
      }

      return $container.find('#' + options.id);

    },

    hide: function(id, targetEl) {
      var $container = targetEl ? $(targetEl) : $('body');
      $container.find('#' + id).modal('hide');
    }

  });

  module.exports = DialogModule;

});