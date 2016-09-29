module.exports = {
  path: 'lp',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./LoginPwd'))
    })
  }

}
