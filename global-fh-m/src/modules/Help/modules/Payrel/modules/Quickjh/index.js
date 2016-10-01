module.exports = {
  path: 'quickjh',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Quickjh'))
    })
  }

}
