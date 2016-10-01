module.exports = {
  path: 'tickets',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Tickets'))
    })
  }

}
