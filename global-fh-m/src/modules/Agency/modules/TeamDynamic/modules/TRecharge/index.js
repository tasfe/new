module.exports = {
  path: 'tr',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./TRecharge'))
    })
  }

}
