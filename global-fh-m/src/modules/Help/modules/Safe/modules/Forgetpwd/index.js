module.exports = {
  path: 'forgetpwd',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Forgetpwd'))
    })
  }

}
