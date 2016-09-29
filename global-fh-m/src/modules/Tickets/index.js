module.exports = {
  path: 'tc',

  getChildRoutes (location, cb) {
    require.ensure([], require => {
      cb(null, [
        require('./modules/TicketList'),
        require('./modules/TicketSet')
      ])
    })
  }
}