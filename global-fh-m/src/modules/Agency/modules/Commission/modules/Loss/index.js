module.exports = {
  path: 'loss',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Loss'))
    })
  }

}
