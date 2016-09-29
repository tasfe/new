module.exports = {
  path: 'betitem',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./BetItem'))
    })
  }

}
