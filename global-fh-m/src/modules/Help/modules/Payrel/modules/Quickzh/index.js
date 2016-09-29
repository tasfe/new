module.exports = {
  path: 'quickzh',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Quickzh'))
    })
  }

}
