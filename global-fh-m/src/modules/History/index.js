module.exports = {
  path: 'history',

  getChildRoutes (location, cb) {
    require.ensure([], require => {
      cb(null, [require('./modules/OpenLottery'),
        require('./modules/Betting'),
        require('./modules/Trade'),
        require('./modules/Recharge'),
        require('./modules/Cash'),
        require('./modules/Account')
      ])
    })
  }
}
