module.exports = {
  path: 'quickjiaoh',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Quickjiaoh'))
    })
  }

}
