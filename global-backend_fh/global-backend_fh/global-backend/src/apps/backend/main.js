require.config({
  baseUrl: './',
  locale: 'zh',
  paths: {
    'almond': '../../vendor/scripts/almond-0.3.0',
    'text': '../../vendor/scripts/text',
    'app': './scripts/app',
    'app.routers': './scripts/app.routers',
    'startup': './scripts/startup',
    'prefab': './scripts/prefab',
    'skeleton': './scripts/skeleton',
    'dashboard': './scripts/dashboard',
    'betCenter': './scripts/betCenter',
    'fundCenter': './scripts/fundCenter',
    'authorityCenter': './scripts/authorityCenter',
    'dataCenter': './scripts/dataCenter',
    'globalCenter': './scripts/globalCenter',
    'saleCenter': './scripts/saleCenter',
    'messageCenter': './scripts/messageCenter',
    'userCenter': './scripts/userCenter',
    'com':'./scripts/components',
    'vipCenter': './scripts/vipCenter',
    'agGame':'./scripts/agGame'
  },
  shim: {
  },
  deps: ['startup'],
  waitSeconds: 30
});