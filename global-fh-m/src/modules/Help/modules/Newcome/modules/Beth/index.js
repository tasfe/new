module.exports = {
  path: 'beth',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Beth'))
    })
  }

}
