module.exports = {
  path: 'usl',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./UnactiveSubLevel'))
    })
  }

}
