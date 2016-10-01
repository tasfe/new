module.exports = {
  path: 'sq',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./SecurityQuestion'))
    })
  }

}
