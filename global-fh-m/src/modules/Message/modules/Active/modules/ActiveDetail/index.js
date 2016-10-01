module.exports = {
  path: 'actdetail',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./ActiveDetail'))
    })
  }

}
