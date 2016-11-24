module.exports = {
  path: 'rmag',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./ReportManageAG'))
    })
  },

  getChildRoutes (location, cb) {
    require.ensure([], require => {
      cb(null, [
        require('./modules/MoneyRecordAG')
      ])
    })
  }

}
