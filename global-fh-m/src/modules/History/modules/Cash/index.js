module.exports = {
  path: 'cash',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Cash'))
    })
  }

}
