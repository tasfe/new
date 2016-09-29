module.exports = {
  path: 'ticket',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./TicketList'))
    })
  }

}
