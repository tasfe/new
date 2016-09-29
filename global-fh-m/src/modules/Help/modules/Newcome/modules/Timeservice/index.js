module.exports = {
  path: 'ts',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Timeservice'))
    })
  }

}
