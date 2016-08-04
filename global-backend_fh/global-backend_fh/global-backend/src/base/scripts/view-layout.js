/**
 * `LayoutView`适用场景，一个Entity(Collection或Model)以及一些列的`Region`对象，
 * 可以使用layoutView以及Regions创建复杂的应用
 *
 * 一个 `LayoutView` 渲染 `an area of HTML`，然后将若干`Region`实例`attach`到HTML上
 */
Base.LayoutView = Base.ItemView.extend({

  regionClass: Base.Region,

  // 确保在`initialize`方法执行的时候，`regions`可用
  constructor: function(options) {
    options = options || {};

    this._firstRender = true;
    this._initializeRegions(options);

    Base.ItemView.call(this, options);
  },

  render: function() {
    this._ensureViewIsIntact();

    if (this._firstRender) {
      this._firstRender = false;
    } else {
      // 如果`render`不是第一次执行，需要 `re-initialize`每一个region的`el`
      this._reInitializeRegions();
    }

    return Base.ItemView.prototype.render.apply(this, arguments);
  },

  /**
   * 销毁regions，然后销毁view本身
   */
  destroy: function() {
    if (this.isDestroyed) {
      return this;
    }

    this.regionManager.destroy();
    return Base.ItemView.prototype.destroy.apply(this, arguments);
  },

  /**
   * 在view中添加region
   */
  addRegion: function(name, definition) {
    var regions = {};
    regions[name] = definition;
    return this._buildRegions(regions)[name];
  },

  /**
   * 在view中添加多个region
   */
  addRegions: function(regions) {
    this.regions = _.extend({}, this.regions, regions);
    return this._buildRegions(regions);
  },

  /**
   * 在view中移除region
   */
  removeRegion: function(name) {
    delete this.regions[name];
    return this.regionManager.removeRegion(name);
  },

  /**
   * 在view中获取region
   */
  getRegion: function(region) {
    return this.regionManager.get(region);
  },

  /**
   * 在view中获取多个region
   */
  getRegions: function() {
    return this.regionManager.getRegions();
  },

  _buildRegions: function(regions) {
    var defaults = {
      regionClass: this.getOption('regionClass'),
      parentEl: _.partial(_.result, this, 'el')
    };

    return this.regionManager.addRegions(regions, defaults);
  },

  _initializeRegions: function(options) {
    var regions;
    this._initRegionManager();

    regions = Base._getValue(this.regions, this, [options]) || {};

    var regionOptions = this.getOption.call(options, 'regions');

    regionOptions = Base._getValue(regionOptions, this, [options]);

    _.extend(regions, regionOptions);

    this.addRegions(regions);
  },

  _reInitializeRegions: function() {
    this.regionManager.invoke('reset');
  },

  getRegionManager: function() {
    return new Base.RegionManager();
  },

  // 初始化 region manger 以及所有的 regions
  _initRegionManager: function() {
    this.regionManager = this.getRegionManager();
    this.regionManager._parent = this;

    this.listenTo(this.regionManager, 'before:add:region', function(name) {
      this.triggerMethod('before:add:region', name);
    });

    this.listenTo(this.regionManager, 'add:region', function(name, region) {
      this[name] = region;
      this.triggerMethod('add:region', name, region);
    });

    this.listenTo(this.regionManager, 'before:remove:region', function(name) {
      this.triggerMethod('before:remove:region', name);
    });

    this.listenTo(this.regionManager, 'remove:region', function(name, region) {
      delete this[name];
      this.triggerMethod('remove:region', name, region);
    });
  },

  _getImmediateChildren: function() {
    return _.chain(this.regionManager.getRegions())
      .pluck('currentView')
      .compact()
      .value();
  }

});