module.exports = {
  path: 'pm',

  /*getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./PasswordManage'))
    })
  },*/
  getChildRoutes (location, cb) {
    require.ensure([], require => {
      cb(null, [
        require('./modules/FundPwd'),
        require('./modules/LoginPwd')
      ])
    })
  }
}
