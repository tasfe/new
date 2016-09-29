module.exports = {
  path: 'quickgfh',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Quickgfh'))
    })
  }

}
