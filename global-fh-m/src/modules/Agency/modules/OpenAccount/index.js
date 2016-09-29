module.exports = {
  path: 'oa',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./OpenAccount'))
    })
  },

  getChildRoutes (location, cb) {
    require.ensure([], require => {
      cb(null, [
        require('./modules/LinkQrcode'),
      ])
    })
  }

}
