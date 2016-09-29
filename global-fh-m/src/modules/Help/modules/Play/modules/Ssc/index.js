module.exports = {
  path: 'ssc',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Ssc'))
    })
  }

}
