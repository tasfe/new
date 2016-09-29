module.exports = {
  path: 'bankcard',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Bankcard'))
    })
  },

  getChildRoutes (location, cb) {
    require.ensure([], require => {
      cb(null, [
        require('./modules/BankcardAdd')
      ])
    })
  }

}
