module.exports = {
  path: 'quickzxh',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Quickzxh'))
    })
  }

}
