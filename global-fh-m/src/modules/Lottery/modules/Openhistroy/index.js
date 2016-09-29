module.exports = {
  path: 'oh',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Openhistroy'))
    })
  }

}
