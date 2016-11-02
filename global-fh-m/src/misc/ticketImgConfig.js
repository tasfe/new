define(function(require, exports, module) {


  var ticketConfig = [
    {
      ticketId: 1,
      ticketName: '重庆时时彩',
      img: require('images/fh-ticket-cqssc.png')
    }, {
      ticketId: 10,
      ticketName: '繁华分分彩',
      img: require('images/fh-ticket-ffc.png')
    /*}, {
      ticketId: 13,
      ticketName: '繁华三分彩',
      img: require('images/fh-ticket-3fc.png')
    }, {
      ticketId: 20,
      ticketName: '老虎机秒秒彩',
      img: require('images/fh-ticket-lhjmmc.png')
    }, {
      ticketId: 16,
      ticketName: '3D分分彩',
      img: require('images/fh-ticket-3D-ffc.png')*/
    },{
      ticketId: 21,
      ticketName: "韩国1.5分彩",
      img: require('images/fh-ticket-hg.png')
    /*}, {
      ticketId: 3,
      ticketName: '新疆时时彩',
      img: require('images/fh-ticket-xjssc.png')
    }, {
      ticketId: 8,
      ticketName: '天津时时彩',
      img: require('images/fh-ticket-tjssc.png')
    }, {
      ticketId: 9,
      ticketName: '黑龙江时时彩',
      img: require('images/fh-ticket-hljssc.png')*/
    }, {
      ticketId: 12,
      ticketName: '繁华五分彩',
      img: require('images/fh-ticket-5fc.png')
    }, {
      ticketId: 5,
      ticketName: '山东11选5',
      img: require('images/fh-ticket-sd115.png')
    /*}, {
      ticketId: 4,
      ticketName: '广东11选5',
      img: require('images/fh-ticket-gd115.png')
    }, {
      ticketId: 11,
      ticketName: '江西11选5',
      img: require('images/fh-ticket-jx115.png')*/
    }, {
      ticketId: 6,
      ticketName: '3D',
      img: require('images/fh-ticket-3D.png')
    /*}, {
      ticketId: 7,
      ticketName: 'P5/P3',
      img: require('images/fh-ticket-P5.png')*/
    },{
      ticketId: 18,
      ticketName: "北京PK10",
      img: require('images/fh-ticket-pk10.png')
    },{
      ticketId: 19,
      ticketName: "秒秒彩",
      img: require('images/fh-ticket-mmc.png')
    },{
      ticketId: 14,
      ticketName: "11选5分分彩",
      img: require('images/fh-ticket-ffc115.png')
    }];

  return {
    get: function(tid) {
      var ticketImg = _.findWhere(ticketConfig, {
        ticketId: tid
      });
      return ticketImg;
    },
    getByName: function(name) {
      var ticketImg = _.findWhere(ticketConfig, {
        ticketName: name
      });
      return ticketImg;
    }

  };
});