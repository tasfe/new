module.exports = {
  path: 'quickxyh',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Quickxyh'))
    })
  }

}
