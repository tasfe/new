module.exports = {
  path: 'co',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Commission'))
    })
  }


}
