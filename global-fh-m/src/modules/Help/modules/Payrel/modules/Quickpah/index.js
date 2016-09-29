module.exports = {
  path: 'quickpah',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Quickpah'))
    })
  }

}
