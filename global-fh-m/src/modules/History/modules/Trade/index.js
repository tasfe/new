module.exports = {
  path: 'trade',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Trade'))
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
