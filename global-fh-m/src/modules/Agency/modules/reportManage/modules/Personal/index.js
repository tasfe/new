module.exports = {
  path: 'pl',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Personal'))
    })
  }

}
