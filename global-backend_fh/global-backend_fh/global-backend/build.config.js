var backendAppBuildConfig = require('./src/apps/backend/build.config');
var backendPackageBuildConfig = require('./src/apps/backend/packages/build.config');

module.exports = {

  app: {
    backend: backendAppBuildConfig
  },
  packages: {
    backend: backendPackageBuildConfig
  },

  proxyRouters: {
    //'/intra/ticketmng/riskdetail.json': 'config/mockup/riskdetail.json',
    '/intra/ticketmng/riskdata.json': 'config/mockup/riskdata.json',
    //'/intra/ticketmng/riskdetail.json': 'config/mockup/riskdetail.json',
    //'/intra/ticketmng/saverisk.json': 'config/mockup/success.json'
  }
};
