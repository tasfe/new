module.exports = {
  path: 'fi',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./FindPwd'))
    })
  }

}
