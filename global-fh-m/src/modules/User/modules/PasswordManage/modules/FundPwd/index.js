module.exports = {
  path: 'fp',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./FundPwd'))
    })
  }

}
