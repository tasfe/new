module.exports = {
  ua: 'android', //android|ios|chrome|ie|android_tablet
  urlRules: [{
    pattern: '/apps/*', //proxy the static resources to localhost
    target: 'http://localhost:9000'
  }, {
    pattern: '/www/*', //proxy the static resources to localhost
    target: 'http://localhost:9000'
  }, {
    pattern: '*',
    target: 'http://backend.highborn.cn/'
  }]
};