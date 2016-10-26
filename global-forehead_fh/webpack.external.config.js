module.exports = {
  entry: {
    '1.activity': {
      entry: ['./src/apps/external/activity/index.js'],
      hot: true
    }
  },
  port: 3001,
  commonChunks: {
    'common.1': []
  },
  entries: {
    activity: {
      title: '繁华世界',
      template: './entry/package.html',
      chunks: ['common.1', '1.activity']
    }
  },
  output: {
    path: 'external',
    publicPath: '/'
  },
  resolve: {
    alias: {
      'packages': 'apps/packages',
      'com': 'apps/components',
      'uiCom': 'apps/uiComponents',
      'widgets': 'apps/widgets',
      'base': 'base',

      'skeleton': 'apps/main/skeleton',

      'snap': 'Snap.svg/dist/snap.svg',
      'bootstrap': 'vendor/scripts/bootstrap',
      'modernizr': 'vendor/scripts/modernizr'
    }
  },
  providePlugin: {
    'jQuery': 'jquery',
    '$': 'jquery',
    'window.jQuery': 'jquery',
    'bootstrap': 'bootstrap',
    '_': 'underscore',
    'slimScroll': 'jquery-slimscroll'
  },
  noParse: [
    /underscore.string/, /underscore/, /backbone/, /es5/, /^jquery$/, /moment/,
    /echarts/,
    /base\/scripts/,
    /html/
  ]
};