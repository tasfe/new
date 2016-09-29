module.exports = {
  path: 'os',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Openservice'))
    })
  }

}
