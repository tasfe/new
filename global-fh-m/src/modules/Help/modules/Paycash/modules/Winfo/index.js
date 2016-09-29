module.exports = {
  path: 'winfo',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Winfo'))
    })
  }

}
