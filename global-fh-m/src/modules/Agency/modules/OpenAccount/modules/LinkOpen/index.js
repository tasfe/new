module.exports = {
  path: 'lo',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./LinkOpen'))
    })
  }
}
