module.exports = {
  entry: {
    'vendor': {
      entry: [
        './src/vendor/build.core.js',
        './src/vendor/scripts/md5',
        './src/vendor/scripts/sha512',
      ]
    }
  },
  output: {
    path: 'dll',
    filename: '[name].js',
    library: '[name]_library',
    context: __dirname,
    publicPath: '/'
  },
  resolve: {
    alias: {
      'packages': 'apps/packages',
      'com': 'apps/components',
      'uiCom': 'apps/uiComponents',
      'widgets': 'apps/widgets',
      'bootstrap': 'vendor/scripts/bootstrap',
      'modernizr': 'vendor/scripts/modernizr'
    }
  },
  providePlugin: {
  'jQuery': 'jquery',
    '$': 'jquery',
    'window.jQuery': 'jquery',
  //   'bootstrap': 'bootstrap',
    '_': 'underscore'
  }
  // noParse: [
  //   /underscore.string/, /underscore/, /backbone/, /es5/, /^jquery$/, /moment/,
  //   /echarts/,
  //   /base\/scripts/,
  //   /html/
  // ]
};