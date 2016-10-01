module.exports = {
  path: 'set',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./TicketSet'))
    })
  }

}
