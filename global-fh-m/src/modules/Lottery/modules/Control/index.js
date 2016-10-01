module.exports = {
  path: 'control',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Control'))
    })
  }

}
