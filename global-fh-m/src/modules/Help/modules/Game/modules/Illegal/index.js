module.exports = {
  path: 'illegal',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Illegal'))
    })
  }

}
