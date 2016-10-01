module.exports = {
  path: 'sysnotice',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./SystemNotice'))
    })
  },

  getChildRoutes (location, cb) {
    require.ensure([], require => {
      cb(null, [
        require('./modules/NoticeDetail'),
        require('./modules/NoticeSet')
      ])
    })
  }

}
