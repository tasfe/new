module.exports = {
  path: 'quickgh',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Quickgh'))
    })
  }

}
