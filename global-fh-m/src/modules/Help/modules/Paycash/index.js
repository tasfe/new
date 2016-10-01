module.exports = {
  path: 'paycash',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Paycash'))
    })
  },

  getChildRoutes (location, cb) {
    require.ensure([], require => {
      cb(null, [
        require('./modules/Payway'),
        require('./modules/Bankproblem'),
        require('./modules/Winfo'),
        require('./modules/Unlockcard'),
        require('./modules/Withdrawproblem'),
        require('./modules/Withdraw')
      ])
    })
  }

}
