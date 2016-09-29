module.exports = {
  path: 'notopen',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Notopen'))
    })
  }

}
