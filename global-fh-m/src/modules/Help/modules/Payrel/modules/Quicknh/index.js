module.exports = {
  path: 'quicknh',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Quicknh'))
    })
  }

}
