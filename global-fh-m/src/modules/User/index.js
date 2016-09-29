module.exports = {
  path: 'user',

  getChildRoutes (location, cb) {
    require.ensure([], require => {
      cb(null, [
        require('./modules/Profile'),
        require('./modules/Bankcard'),
        require('./modules/PasswordManage'),
        require('./modules/SecurityQuestion'),
        require('./modules/BonusDetail'),
        require('./modules/Setting'),
        require('./modules/SecurityManage'),
        require('./modules/OperationLog'),
        require('./modules/InsideLetter')
      ])
    })
  }
}