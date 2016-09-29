module.exports = {
  path: 'accrel',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Accrel'))
    })
  },

  getChildRoutes (location, cb) {
    require.ensure([], require => {
      cb(null, [
        require('./modules/Forloginpwd'),
        require('./modules/Findip')
      ])
    })
  }

}
