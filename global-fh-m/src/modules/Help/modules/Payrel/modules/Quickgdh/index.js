module.exports = {
  path: 'quickgdh',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Quickgdh'))
    })
  }

}
