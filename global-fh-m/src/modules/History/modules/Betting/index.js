module.exports = {
  path: 'betting',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Betting'))
    })
  },
  getChildRoutes (location, cb) {
    require.ensure([], require => {
      cb(null, [
        require('./modules/Detail')
      ])
    })
  }

}
