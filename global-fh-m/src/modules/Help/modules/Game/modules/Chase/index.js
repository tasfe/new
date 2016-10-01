module.exports = {
  path: 'chase',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Chase'))
    })
  }

}
