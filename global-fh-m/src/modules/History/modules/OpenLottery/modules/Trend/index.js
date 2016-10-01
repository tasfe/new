module.exports = {
  path: 'trend/:id',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Trend'))
    })
  }

}
