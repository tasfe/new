module.exports = {
  path: 'safe',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Safe'))
    })
  },

  getChildRoutes (location, cb) {
    require.ensure([], require => {
      cb(null, [
        require('./modules/Protect'),
        require('./modules/Pwdbrief'),
        require('./modules/Forgetpwd'),
        require('./modules/Pwd')
      ])
    })
  }

}
