"use strict";

var LoginLogView = Base.ItemView.extend({

  template: require('accountCenter/templates/loginLog.html'),

  className: 'as-loginLog',

  events: {},

  onRender: function () {
    var self = this;

    this.$("#jsACLLjqGrid").staticGrid({
      tableClass: 'table table-bordered table-hover table-center',
      wrapperClass: 'login-table',

      colModel: [
        {label: '操作时间  ', name: 'loginTime', key: true, width: 150, formatter: function(val) {
          return _(val).toTime();
        }},
        {label: '操作', name: 'logType', width: 150},
        //{label: 'IP', name: 'loginIp', width: 150},
        //{label: '地区', name: 'loginAddress', width: 150}
        {label: '备注', name: 'remark', width: 300}
      ],
      height: 370,
      url: '/acct/login/loginhistory.json'
    });
  }
});

module.exports = LoginLogView;
