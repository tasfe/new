module.exports = {
  path: 'cp',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./CashPer'))
    })
  }

}
