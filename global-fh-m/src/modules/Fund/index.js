module.exports = {
  path: 'fund',

  getChildRoutes (location, cb) {
    require.ensure([], require => {
      cb(null, [
        require('./modules/Recharge'),
        require('./modules/Withdraw')
      ])
    })
  }
}