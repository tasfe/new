module.exports = {
  path: 'openl',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./OpenLottery'))
    })
  },

  getChildRoutes (location, cb) {
    require.ensure([], require => {
      cb(null, [
        require('./modules/Trend')
      ])
    })
  }

}
