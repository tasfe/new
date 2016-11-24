module.exports = {
  path: 'rm',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./ReportManage'))
    })
  },

  getChildRoutes (location, cb) {
    require.ensure([], require => {
      cb(null, [
        require('./modules/MoneyRecord'),
      ])
    })
  }

}
