module.exports = {
  path: 'help',

  getChildRoutes (location, cb) {
    require.ensure([], require => {
      cb(null, [
        require('./modules/Newcome'),
        require('./modules/Game'),
        require('./modules/Safe'),
        require('./modules/Payrel'),
        require('./modules/Accrel'),
        require('./modules/Play'),
        require('./modules/Paycash')
      ])
    })
  }

}