module.exports = {
  path: 'lottery/:id',

  getComponent (location, cb) {
    require.ensure([], require => {
      cb(null, require('./Lottery'))
    })
  },

  getChildRoutes (location, cb) {
    require.ensure([], require => {
      cb(null, [
        require('./modules/Lotterylist'),
        require('./modules/Openhistroy'),
        require('./modules/Bethistroy'),
        require('./modules/Control'),
        require('./modules/Chase'),
      ])
    })
  }

}
