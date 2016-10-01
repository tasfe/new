module.exports = {
  path: 'forloginpwd',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Forloginpwd'))
    })
  }

}
