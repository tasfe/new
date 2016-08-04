define(function(require, exports, module) {

  Base.Prefab.TabView = Base.LayoutView.extend({

    template: require('text!prefab/templates/view-tab.html'),

    _tabViews: {},

    options: {
      tabs: [
        //{
        //  label: '手动开户',
        //  name: 'manual',
        //  id: 'jsAcManualAccount',
        // router: '',
        //  template: require('text!agencyCenter/templates/openAccountManage-manual.html')
        //}
      ]
    },

    _renderTemplate: function() {
      var template = this.getTemplate();

      this._tabViews = [];
      this.tabs = this.tabs || this.options.tabs;
      this.triggerTab = this.triggerTab || this.options.triggerTab;

      if (template === false) {
        return;
      }

      if (!template) {
        throw new Base.Error({
          name: 'UndefinedTemplateError',
          message: 'template为空，不能渲染。'
        });
      }

      var compiledTpl = _.template(template);
      var html = compiledTpl({
        tabs: this.tabs,
        triggerTab: this.triggerTab
      });

      this.attachElContent(html);

      return this;
    },

    onRender: function() {
      var self = this;

      this.addRegions(_(this.tabs).reduce(function(regions, tab) {
        regions[tab.name] = '#' + tab.id;
        return regions;
      }, {}));

      this.$('a[data-toggle="tab"]').on('show.bs.tab', function(e) {
        var $target = $(e.currentTarget);
        var tabInfo = self.tabs[$target.data('index')];

        if (tabInfo.view) {
          var view = new tabInfo.view(tabInfo.options);
          view._parentView = self;
          self[tabInfo.name].show(view);
        } else {

          var staticView = Base.ItemView.extend({
            template: tabInfo.template
          });

          self[tabInfo.name].show(new staticView());
          //self.$('#' + tabInfo.id).html(_(tabInfo.template).template());
          //调用onRender方法
          self['on' + _($target.data('name')).ucFirst() + 'Render']();
        }

        if (tabInfo.router) {
          Global.appRouter.navigate(_(tabInfo.router).addHrefArgs('_t', _.now()), {trigger: false, replace: false});
        }
      });

      if (this.options.triggerTab) {
        this.$('a[data-name=' + this.options.triggerTab + ']').trigger('show');
      } else {
        this.$('[href=#' + this.tabs[0].id + ']').trigger('show');
      }
    }
  });
});
