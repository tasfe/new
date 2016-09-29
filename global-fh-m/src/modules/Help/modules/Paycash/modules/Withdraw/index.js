module.exports = {
  path: 'withdraw',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Withdraw'))
    })
  }

}
