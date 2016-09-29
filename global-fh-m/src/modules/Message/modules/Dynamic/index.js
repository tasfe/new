module.exports = {
  path: 'dynamic',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Dynamic'))
    })
  },

  getChildRoutes (location, cb) {
    require.ensure([], require => {
      cb(null, [
        require('./modules/DynamicDetail')
      ])
    })
  }

}
