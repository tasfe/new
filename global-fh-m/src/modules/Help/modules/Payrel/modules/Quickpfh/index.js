module.exports = {
  path: 'quickpfh',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Quickpfh'))
    })
  }

}
