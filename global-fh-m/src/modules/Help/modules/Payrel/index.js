module.exports = {
  path: 'payrel',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Payrel'))
    })
  },

  getChildRoutes (location, cb) {
    require.ensure([], require => {
      cb(null, [
        require('./modules/Quickgh'),
        require('./modules/Quickjh'),
        require('./modules/Quicknh'),
        require('./modules/Quickzhongh'),
        require('./modules/Quickjiaoh'),
        require('./modules/Quickmsh'),
        require('./modules/Quickzxh'),
        require('./modules/Quickgfh'),
        require('./modules/Quickyzh'),
        require('./modules/Quickgdh'),
        require('./modules/Quickpah'),
        require('./modules/Quickpfh'),
        require('./modules/Quickxyh'),
        require('./modules/Quickzh')
      ])
    })
  }

}
