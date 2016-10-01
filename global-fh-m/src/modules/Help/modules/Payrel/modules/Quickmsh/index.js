module.exports = {
  path: 'quickmsh',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Quickmsh'))
    })
  }

}
