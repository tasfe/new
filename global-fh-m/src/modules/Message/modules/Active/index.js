module.exports = {
  path: 'act',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Active'))
    })
  },

  getChildRoutes (location, cb) {
    require.ensure([], require => {
      cb(null, [
        require('./modules/ActiveDetail')
      ])
    })
  }

}
