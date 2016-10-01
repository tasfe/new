module.exports = {
  path: 'cfg',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./ConfigQuestion'))
    })
  }

}
