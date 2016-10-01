module.exports = {
  path: 'message',

  getChildRoutes (location, cb) {
    require.ensure([], require => {
      cb(null, [
        require('./modules/SystemNotice'),
        require('./modules/Active'),
        require('./modules/Dynamic')
      ])
    })
  }

}