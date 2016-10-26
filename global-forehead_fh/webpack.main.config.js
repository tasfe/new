module.exports = {
  entry: {
    'main': {
      entry: ['./src/apps/main/index.js'],
      hot: true
    },
    'login': {
      entry: ['./src/apps/packages/login/login.js'],
      //hot: true
    },
    'emailverify': {
      entry: ['./src/apps/packages/emailVerify/index.js'],
      //hot: true
    },
    'register': {
      entry: ['./src/apps/packages/register/register.js'],
      //hot: true
    },
    'trend': {
      entry: ['./src/apps/packages/trend/index.js'],
      //hot: true
    },
    'resetPassword': {
      entry: ['./src/apps/packages/resetPassword/resetPassword.js'],
      //hot: true
    },

    'download': {
      entry: ['./src/apps/packages/download/index.js'],
      hot: true
    },

    '404': {
      entry: ['./src/apps/packages/404/index.js'],
    //  //hot: true
    },
    'charge': {
      entry: ['./src/apps/packages/charge/index.js'],
      //hot: true
    },
    'changeUrl': {
      entry: ['./src/apps/packages/changeUrl/index.js'],
      //hot: true
    },
    'investment': {
      entry: ['./src/apps/packages/investment2/index.js'],
      //hot: true
    },
    'base': {
      entry: ['./src/base/build.base.js'],
      //hot: true
    }
  },
  port: 3001,
  commonChunks: {
    'common': []
  },
  entries: {
    index: {
      title: '繁华娱乐在线娱乐',
      template: './entry/index.html',
      chunks: ['base', 'main', 'common']
    },
    login: {
      title: '繁华娱乐在线娱乐',
      template: './entry/package.html',
      chunks: ['common', 'vendor', 'base', 'login']
    },
    emailverify: {
      title: '繁华娱乐在线娱乐',
      template: './entry/package.html',
      chunks: ['common', 'vendor', 'base', 'emailverify']
    },
    register: {
      title: '繁华娱乐在线娱乐',
      template: './entry/package.html',
      chunks: ['common', 'vendor', 'base', 'register']
    },
    trend: {
      title: '繁华娱乐在线娱乐',
      template: './entry/package.html',
      chunks: ['common', 'vendor', 'base', 'trend']
    },
    charge: {
      title: '充值结果',
      template: './entry/package.html',
      chunks: ['common', 'vendor', 'base', 'charge']
    },

    download: {
      title: '繁华娱乐在线娱乐',
      template: './entry/package.html',
      chunks: ['common', 'vendor', 'base','download']
    },
    resetPassword: {
      title: '繁华娱乐在线娱乐',
      template: './entry/package.html',
      chunks: ['common', 'vendor', 'base', 'resetPassword']
    },
    404: {
      title: '繁华娱乐在线娱乐',
      template: './entry/package.html',
      chunks: ['common', 'base', '404']
    },
    changeUrl: {
      title: '繁华娱乐在线娱乐',
      template: './entry/package.html',
      chunks: ['common', 'vendor', 'base', 'changeUrl']
    },
    investment: {
      title: '繁华娱乐在线娱乐',
      template: './entry/package.html',
      chunks: ['common', 'vendor', 'base', 'investment']
    }
  },
  output: {
    path: 'main',
    publicPath: '/'
  },
  resolve: {
    alias: {
      'packages': 'apps/packages',
      'com': 'apps/components',
      'uiCom': 'apps/uiComponents',
      'widgets': 'apps/widgets',

      'skeleton': 'apps/main/skeleton',
      'dashboard': 'apps/main/dashboard',
      'userCenter': 'apps/main/userCenter',
      'agencyCenter':'apps/main/agencyCenter',
      'fundCenter':'apps/main/fundCenter',
      'accountCenter': 'apps/main/accountCenter',
      'activeCenter':'apps/main/activeCenter',
      'bettingCenter': 'apps/main/bettingCenter',
      'newsCenter': 'apps/main/newsCenter',
      'dynamicCenter': 'apps/main/dynamicCenter',
      'helpCenter': 'apps/main/helpCenter',
      'gameCenter': 'apps/main/gameCenter',
      'bettingButler': 'apps/main/bettingButler',
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