module.exports = {
  entry: {
    '1.main': {
      entry: ['./src/apps/main/index.js'],
      hot: true
    },
    '1.login': {
      entry: ['./src/apps/packages/login/login.js'],
      //hot: true
    },
    '1.emailverify': {
      entry: ['./src/apps/packages/emailVerify/index.js'],
      //hot: true
    },
    '1.register': {
      entry: ['./src/apps/packages/register/register.js'],
      //hot: true
    },
    '1.trend': {
      entry: ['./src/apps/packages/trend/index.js'],
      //hot: true
    },
    '1.resetPassword': {
      entry: ['./src/apps/packages/resetPassword/resetPassword.js'],
      //hot: true
    },
    '1.updateUserInfo': {
      entry: ['./src/apps/packages/updateUserInfo/updateUserInfo.js'],
      //hot: true
    },
    '1.gengxin': {
      entry: ['./src/apps/packages/update/update.js'],
      //hot: true
    },
    '1.client': {
      entry: ['./src/apps/packages/client/index.js'],
      hot: true
    },
    '1.download': {
      entry: ['./src/apps/packages/download/index.js'],
      hot: true
    },
    //'1.super3000': {
    //    entry: ['./src/apps/packages/super3000/index.js'],
    //    hot: true
    //  },
    //'1.vip': {
    //  entry: ['./src/apps/packages/vip/index.js'],
    //  hot: true
    //},
    //'1.mmc': {
    //  entry: ['./src/apps/packages/mmc/index.js'],
    //  hot: true
    //},
    '1.404': {
      entry: ['./src/apps/packages/404/index.js'],
    //  //hot: true
    },
    '1.charge': {
      entry: ['./src/apps/packages/charge/index.js'],
      //hot: true
    },
    '4.base': {
      entry: ['./src/base/build.base.js'],
      //hot: true
    },
    '2.vendor': {
      entry: ['./src/vendor/build.core.js']
    }
  },
  port: 3001,
  commonChunks: {
    'common.1': []
  },
  entries: {
    index: {
      title: '繁华娱乐在线娱乐',
      template: './entry/index.html',
      chunks: ['common.1', '2.vendor', '4.base', '1.main']
    },
    login: {
      title: '繁华娱乐在线娱乐',
      template: './entry/package.html',
      chunks: ['common.1', '2.vendor', '4.base', '1.login']
    },
    emailverify: {
      title: '繁华娱乐在线娱乐',
      template: './entry/package.html',
      chunks: ['common.1', '2.vendor', '4.base', '1.emailverify']
    },
    register: {
      title: '繁华娱乐在线娱乐',
      template: './entry/package.html',
      chunks: ['common.1', '2.vendor', '4.base', '1.register']
    },
    trend: {
      title: '繁华娱乐在线娱乐',
      template: './entry/package.html',
      chunks: ['common.1', '2.vendor', '4.base', '1.trend']
    },
    gengxin: {
      title: '繁华娱乐在线娱乐',
      template: './entry/package.html',
      chunks: ['common.1', '2.vendor', '4.base',  '1.gengxin']
    },
    charge: {
      title: '充值结果',
      template: './entry/package.html',
      chunks: ['common.1', '2.vendor', '4.base', '1.charge']
    },
    client: {
      title: '繁华娱乐在线娱乐',
      template: './entry/package.html',
      chunks: ['common.1', '2.vendor', '4.base', '1.client','1.download']
    },
    download: {
      title: '繁华娱乐在线娱乐',
      template: './entry/package.html',
      chunks: ['common.1', '2.vendor', '4.base','1.download']
    },
    //super3000: {
    //    title: '繁华娱乐在线娱乐',
    //    template: './entry/package.html',
    //    chunks: ['common.1', '2.vendor', '4.base','1.super3000']
    //  },
    //vip: {
    //  title: '繁华娱乐在线娱乐',
    //  template: './entry/package.html',
    //  chunks: ['common.1', '2.vendor', '4.base','1.vip']
    //},
    //mmc: {
    //  title: '繁华娱乐在线娱乐',
    //  template: './entry/package.html',
    //  chunks: ['common.1', '2.vendor', '4.base','1.mmc']
    //},
    resetPassword: {
      title: '繁华娱乐在线娱乐',
      template: './entry/package.html',
      chunks: ['common.1', '2.vendor', '4.base', '1.resetPassword']
    },
    updateUserInfo: {
      title: '繁华娱乐在线娱乐',
      template: './entry/package.html',
      chunks: ['common.1', '2.vendor', '4.base', '1.updateUserInfo']
    },
    404: {
      title: '繁华娱乐在线娱乐',
      template: './entry/package.html',
      chunks: ['common.1', '4.base', '1.404']
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