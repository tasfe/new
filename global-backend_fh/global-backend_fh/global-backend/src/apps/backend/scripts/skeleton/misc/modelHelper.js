/**
 * 简介
 *
 * @description
 *
 * @api
 *
 * @example
 *
 * @author
 *   xiami
 */

define(function(require, module, exports) {

  var ModelHelper = function(model, options) {
    if (!(this instanceof ModelHelper)) return new ModelHelper(model, options);
    this._model = model;

    this.options = _.extend({
      prev: 'format'
    }, options);
  };

  var proto = ModelHelper.prototype;

  proto.formatTime = function(prop, format, options) {
    options = _.extend({}, {
      silent: true
    }, this.options, options);

    this._setFormat(prop, moment(this._get(prop)).format(format || 'YYYY-MM-DD H:mm:ss'), options);

    return this;
  };

  proto.formatDiv = function(prop, ratio, options) {
    var val = this._get(prop);
    var format;

    options = _.extend({}, {
      fixed: 2
    }, this.options, options);

    if (!_.isUndefined(val)) {

      format = _(val).div(ratio || this._get('moneyInfo').ratio);

      if (options.fixed) {
        format  = format.toFixed(options.fixed);
      }

      this._setFormat(prop, format, options);
    }
    return this;
  };

  proto.formatRatio2Show = function(prop, options) {
    options = _.extend({}, {
      fixed: 2
    }, this.options, options);

    this.formatDiv(prop, options.ratio, options);

    return this;
  };

  proto.formatMul = proto.formatRatio2Send = function(prop, ratio, options) {
    var val = this._get(prop);
    if (!_(val).isUndefined()) {
      this._setFormat(prop, _(val).mul(ratio || this._get('moneyInfo').ratio), options);
    }

    return this;
  };

  proto.formatStatus = function(prop, func, options) {
    options = _.extend({}, {
      silent: true
    }, this.options, options);

    this._setFormat(prop, func(this._get(prop)) || '', options);

    return this;
  };


  proto.formatAddr = function(prop, regExp, options) {
    var val = this._get(prop);

    if (!_(val).isUndefined()) {
      this._setFormat(prop, this._get(prop).replace(regExp || /%/g, ' ') || '', options);
    }

    return this;
  };

  proto.setMoneyInfo = function(options) {
    options = _.extend({}, {
      moneyUnit: this._get('moneyUnit') || Global.memoryCache.get('shopBasicInfo').moneyUnit
    }, this.options, options);

    this._set('moneyInfo', Global.money.getMoneyInfo(options.moneyUnit), options);

    return this;
  };

  //private methods

  proto._get = function() {
    return this._model.get ? this._model.get.apply(this._model, arguments) : this._model[arguments[0]];
  };

  proto._set = function() {
    this._model.set ? this._model.set.apply(this._model, arguments) : this._model[arguments[0]] = arguments[1];
  };

  proto._setFormat = function(prop, val, options) {
    this._set(this.options.prev + _(prop).ucFirst(), val, options);
  };

  return ModelHelper;
});
