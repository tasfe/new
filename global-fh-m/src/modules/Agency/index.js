module.exports = {
  path: 'agency',

  getChildRoutes (location, cb) {
    require.ensure([], require => {
      cb(null, [
        require('./modules/OpenAccount'),
        require('./modules/LowLevelManage'),
        require('./modules/TeamDynamic'),
        require('./modules/Commission'),
        require('./modules/ReportManage'),
        require('./modules/DivisionManage')
      ])
    })
  }

}