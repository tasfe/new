module.exports = {
  path: 'bp',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./BetPer'))
    })
  }

}
