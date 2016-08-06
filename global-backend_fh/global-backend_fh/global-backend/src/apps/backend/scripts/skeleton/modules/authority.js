/**
 *
 * @description
 *
 * @api
 *
 * @example
 *
 * @author
 */
define(function (require, exports, module) {

  var _data = {};

  var _config = {
    dm: 'distribute',
    sym: 'supply.aa',
    ets: 'bc.cc.eTicket'
  };

  return window.Base.Module.extend({

    setup: function (data) {
      var self = this;
      self.generateObj(data);
      //this.extend();
      return this;
    },
    generateObj: function(data){
      var self = this;
      _(data).each(function (item) {
        if (item.identifier !== null) {
          var arr = item.identifier.split('.');
          if (_(arr).isArray()) {
            if (self[arr[0]]) {
              self.extendData(arr, self[arr[0]]);
            } else {
              self[arr[0]] = {};
              self.extendData(arr, self[arr[0]]);
            }
          } else {
            self[arr] = true;
          }
        }
        if(item.subFuncList!==null){
        self.generateObj(item.subFuncList);
        }
      });
    },

    extendData: function (arr, obj) {
      var self = this;
      if (_(arr).size() > 2) {
        var subArr = [];
        _(arr).map(function (item, index) {
          if (index != 0) {
            subArr.push(item);
          }
        });
        if (obj[arr[1]]) {

          this.extendData(subArr, obj[arr[1]]);
        } else {
          obj[arr[1]] = {};
          this.extendData(subArr, obj[arr[1]]);
        }
      } else {
        obj[arr[1]] = true;
      }
    },

    add: function (id) {
      this.update(id, true);

      return this;
    },

    remove: function (id) {
      this.update(id, false);

      return this;
    },

    update: function (id, access) {
      _data[id] = access || false;

      var funcName = _config[id] || id;
      this[funcName] = _data[id];

      return this;
    },

    extend: function () {
      var self = this;

      _.each(_config, function (value, key) {
        self[value] = _data[key] || false;
      });

      return this;
    }
  });
});
