module.exports = {
  path: 'game',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Game'))
    })
  },

  getChildRoutes (location, cb) {
    require.ensure([], require => {
      cb(null, [
        require('./modules/Notopen'),
        require('./modules/Chot'),
        require('./modules/Chase'),
        require('./modules/Chaseinfo'),
        require('./modules/Illegal')
      ])
    })
  }

}
