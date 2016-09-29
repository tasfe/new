module.exports = {
  path: 'bg',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./BetGroup'))
    })
  }

}
