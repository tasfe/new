module.exports = {
  path: 'transfer/:id',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./MoneyTransfer'))
    })
  }

}
