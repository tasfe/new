module.exports = {
  path: 'ho',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./HandOpen'))
    })
  }

}
