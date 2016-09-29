module.exports = {
  path: 'elcf',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Elcf'))
    })
  }

}
