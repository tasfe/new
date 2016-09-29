module.exports = {
  path: 'process',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Process'))
    })
  }

}
