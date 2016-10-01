module.exports = {
  path: 'rebate/:id',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Rebate'))
    })
  }

}
