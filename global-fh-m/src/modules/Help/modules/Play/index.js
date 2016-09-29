module.exports = {
  path: 'play',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Play'))
    })
  },

  getChildRoutes (location, cb) {
    require.ensure([], require => {
      cb(null, [
        require('./modules/Ssc'),
        require('./modules/Dpc'),
        require('./modules/Elcf')
      ])
    })
  }

}
