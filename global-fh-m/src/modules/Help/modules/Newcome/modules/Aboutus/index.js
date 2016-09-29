module.exports = {
  path: 'aboutus',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Aboutus'))
    })
  }

}
