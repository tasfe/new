module.exports = {
  path: 'mrag',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./MoneyRecordAG'))
    })
  }

}
