module.exports = {
  path: 'consum',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Consum'))
    })
  }

}
