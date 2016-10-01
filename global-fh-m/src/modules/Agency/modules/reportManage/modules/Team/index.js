module.exports = {
  path: 'tm',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Team'))
    })
  }

}
