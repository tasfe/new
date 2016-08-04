define(function (require, exports, module) {

  var TicketListView = Base.ItemView.extend({

    template: require('text!betCenter/templates/species-TicketList.html'),

    events: {},

    initialize: function () {
    },

    onRender: function () {
      var self = this;
      this._loadPage('js-bc-ticketListGrid');
    },

    //发送请求
    _getTicketList: function (datas) {
      return Global.sync.ajax({
        url: '/intra/ticketmng/ticketlist.json',
        data: datas
      });
    },

    _loadPage: function (classValue) {
      var self = this;
      this._getTicketList().done(function (res) {
        if (res.result === 0) {
          self._getTable(self._formatSeriesData(res.root.series), classValue);
        }else{
          Global.ui.notification.show('数据异常。');
        }
      }).fail(function(){
      });
    },

    //获取表格
    _getTable: function (tableInfo, classValue) {
      this.$('.' + classValue).staticGrid({
        colModel: [
          {label: '系列', name: 'seriesName', merge: true, width: 100},
          {label: '彩种', name: 'ticketName', width: 100},
          {label: '上线时间', name: 'onlineTime', width: 150},
          {label: '修改时间', name: 'modifyTime', width: 150},
          {label: '状态', name: 'status', width: 100},
          {label: '操作', name: 'operate', width: 300}
        ],
        row: tableInfo
      });
    },

    //格式化数据
    _formatSeriesData: function (series) {
      return _(series).chain().map(function (serie) {
        var seriesName = serie.seriesName;
        var types = serie.types;
        return _(types).map(function (type) {
          var operate = [];
          if(Global.authority.bc && Global.authority.bc.tl && Global.authority.bc.tl.planRule){
            operate.push('<a href="'+_.getUrl('/planRules/' + type.ticketId)+'">奖期规则</a> ');
          }
          if(Global.authority.bc && Global.authority.bc.tl && Global.authority.bc.tl.bonusSet){
            operate.push( '<a href="'+_.getUrl('/bonus/' + type.ticketId)+'">奖金设置</a> ' );
          }
          if(Global.authority.bc && Global.authority.bc.tl && Global.authority.bc.tl.betLimit){
            operate.push( '<a href="'+_.getUrl('/betLimit/' + type.ticketId)+'">投注限制</a> ' );
          }
          if(Global.authority.bc && Global.authority.bc.tl && Global.authority.bc.tl.playDetail){
            operate.push('<a href="'+_.getUrl('/playDetail/' + type.ticketId)+'">玩法说明</a> ');
          }
          if(Global.authority.bc && Global.authority.bc.tl && Global.authority.bc.tl.playStatus){
            operate.push( '<a href="'+_.getUrl('/playStatus/' + type.ticketId)+'">销售状态</a> ');
          }
          if(Global.authority.bc && Global.authority.bc.tl && Global.authority.bc.tl.paramsSet){
            if(type.ticketId == 20){
              operate.push('<a href="'+_.getUrl('/mmcParams/' + type.ticketId,'ticketName',type.ticketName)+'">参数设置</a>');
            }else{
              operate.push('<a href="'+_.getUrl('/params/' + type.ticketId,'ticketName',type.ticketName)+'">参数设置</a>');
            }

          }
          return {
            'seriesName': seriesName,
            'ticketName': type.ticketName,
            'onlineTime': _(type.onlineTime).toTime(),
            'modifyTime': _(type.modifyTime).toTime(),
            'status': type.status==0?'在售' : type.status==1?'停售':'即将上线',
            'operate': operate.join('')
          };
        });
      }).flatten().value();
    }
  });

  module.exports = TicketListView;
});