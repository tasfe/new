Base.SubscribePermissions = (function() {
  var permissionList = {};

  var permissions = {};

  permissions.init = function(permission) {
    _(permissionList).extend(permission);
  };

  permissions.validate = function(subscriber, channel) {
    var test = permissionList[channel][subscriber];
    return test === undefined ? false: test;
  };

  return permissions;
} ());
