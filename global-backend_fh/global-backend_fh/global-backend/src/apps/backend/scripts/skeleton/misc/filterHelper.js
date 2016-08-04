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

  var FilterHelper = function(filters, options) {
    if (!(this instanceof FilterHelper)) return new FilterHelper(filters, options);

    this._filters = filters || {};

    options = _.extend({

    }, options);

    if (options.form) {
      this.setForm(options.form);
    }
    if(options.sameNameFormat){
      this._sameNameFormat = options.sameNameFormat;
    }
  };

  var proto = FilterHelper.prototype;

  proto.setForm = function(form) {
    this._$form = $(form);

    return this;
  };

  proto.get = function(prop) {
    return prop ? this._filters[prop] : this._filters;
  };

  proto.set = function(prop, val, options) {
    var filters = {};
    if (_.isObject(prop)) {
      filters = prop;
      options = val;
    } else {
      filters[prop] = val;
    }

    if (arguments.length === 0 || (options && options.clear)) {
      this._filters = {};
    }

    if (options && options.cleanPage) {
      delete this._filters.pageIndex;
    }

    if (options && options.reset) {
      this._filters = filters;
      return this;
    }
    this._filters = _.pick(_.extend(this._filters, filters), function(val) {
      return !(val === '' || _(val).isUndefined());
    });

    return this;
  };

  proto.serializeObject = function(options, form) {
    var filters = (this._$form || $(form)).serializeArray();

    options = _.extend({
      set: true
    }, options);

    if(this._sameNameFormat){
      filters =  _.reduce(filters, function(searchFilter, formData) {
       if (!_(searchFilter[formData.name]).isUndefined()) {
          searchFilter[formData.name] =  searchFilter[formData.name] +','+$.trim(formData.value);
        }else{
         searchFilter[formData.name] =  $.trim(formData.value);
       }
        return searchFilter;
      }, {});
    }else {
      filters = _(filters).chain().serializeObject().pick(_.identity).value();
    }
    //filters =  _.reduce(filters, function(searchFilter, formData) {
    //  if (formData.value !== '') {
    //    searchFilter[formData.name] = $.trim(formData.value);
    //  }
    //  return searchFilter;
    //}, {});

    if (options.set) {
      this.set(filters, options);
    }

    return filters;
  };

  proto.clear = function() {
    this._filters = {};

    return this;
  };

  proto.unset = function(attr, options) {
    return this.set(attr, void 0, _.extend({}, options));
  };

  //private methods

  return FilterHelper;
});
