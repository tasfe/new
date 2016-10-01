module.exports = {
  path: 'llm',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./LowLevelManage'))
    })
  },

  getChildRoutes (location, cb) {
    require.ensure([], require => {
      cb(null, [
        require('./modules/Rebate'),
        require('./modules/MoneyTransfer')
      ])
    })
  }

}
