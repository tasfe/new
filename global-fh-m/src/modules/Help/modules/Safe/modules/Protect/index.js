module.exports = {
  path: 'protect',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Protect'))
    })
  }

}
