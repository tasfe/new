module.exports = {
  path: 'newcome',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Newcome'))
    })
  },

  getChildRoutes (location, cb) {
    require.ensure([], require => {
      cb(null, [
        require('./modules/Aboutus'),
        require('./modules/Openservice'),
        require('./modules/Timeservice'),
        require('./modules/Beth'),
        require('./modules/Process'),
        require('./modules/Tickets')
      ])
    })
  }

}
