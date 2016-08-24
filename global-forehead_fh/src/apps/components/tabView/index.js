"use strict";

var TabView = Base.LayoutView.extend({

  _tabTemplate: require('./tab-view.html'),

  _tabViews: {},

  _renderTemplate: function() {
    _(this.options).defaults({
      tabClass: 'nav-tabs nav-tabs-border',
      loadingHeight: 490,
      tabs: [],
      menushow: true
    });

    var template = this._tabTemplate;

    this.menushow = this.options.menushow;
    this._tabViews = [];
    this.tabs = this.tabs || this.options.tabs;
    this.triggerTab = this.triggerTab || this.options.triggerTab;
    this.append = this.options.append || '';

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

    var html;
    var _html = compiledTpl({
      tabClass: this.options.tabClass,
      tabs: this.tabs,
      triggerTab: this.triggerTab,
      append: this.append,
      menushow: this.menushow
    });

    if (this.startOnLoading) {
      html = '<div class="' + this.uniqueId + ' hidden">' + _html + '</div>';
      html += this._getLoading();
    } else {
      html = _html;
      //html = '<div class="' + this.uniqueId + '">' + compiledTpl(data) + '</div>';
    }

    if (this.template) {
      compiledTpl = _.template(this.getTemplate());
      html = compiledTpl({
        tabHtml: html
      });
    }

    this.attachElContent(html);

    return this;
  },

  onRender: function() {
    var self = this;

    this._initTabs();
  },

  //common APIs
  updateTabs: function(tabs) {
    this.tabs = tabs;
    this._renderTemplate();
    this._initTabs();
  },

  _initTabs: function() {
    var self = this;
    var init = true;

    if (_.isEmpty(this.tabs)) {
      return false;
    }

    this.addRegions(_(this.tabs).reduce(function(regions, tab) {
      regions[tab.name] = '#' + tab.id;
      return regions;
    }, {}));

    this.$('a[data-toggle="tab"]').on('show', function(e) {
      var $target = $(e.currentTarget);
      var tabInfo = self.tabs[$target.data('index')];

      if (self.isDestroyed) {
        return;
      }

      tabInfo = _(tabInfo).defaults({
        toggleInit: true
      });

      if (tabInfo.view) {
        if (!self._tabViews[tabInfo.name]) {
          self._tabViews[tabInfo.name] = new tabInfo.view();
          self._tabViews[tabInfo.name]._parentView = self;

          //可能有bug
          _.extend(self._tabViews[tabInfo.name].options, self.options);
        }

        self[tabInfo.name].show(self._tabViews[tabInfo.name], {
          forceShow: tabInfo.toggleInit
        });
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
        if (!init) {
          Global.viewPool.replace({
            view: self,
            router: tabInfo.router
          });
        }
        Global.appRouter.navigate(tabInfo.router, {trigger: false, replace: true});
      }

      init = false;
    });

    if (this.options.triggerTab) {
      this.$('a[data-name=' + this.options.triggerTab + ']').trigger('show');
    } else {
      this.$('[href=#' + this.tabs[0].id + ']').trigger('show');
    }
  }
});

module.exports = TabView;
