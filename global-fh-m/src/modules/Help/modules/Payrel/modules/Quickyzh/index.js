module.exports = {
  path: 'quickyzh',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Quickyzh'))
    })
  }

}
