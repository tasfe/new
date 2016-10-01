module.exports = {
  path: 'lotterylist',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Lotterylist'))
    })
  }

}
