import getConmmonConfig from './webpack/common.config'
import getAppConfig from './webpack/app.config'
import getDLLConfig from './webpack/dll.config'

let WATCH = process.env.NODE_ENV === 'production' ? false : global.WATCH;
const DEBUG = process.env.NODE_ENV !== 'production';
const VERBOSE = process.argv.includes('verbose');

//
// Common configuration chunk to be used for both
// client-side (app.js) and server-side (server.js) bundles
// -----------------------------------------------------------------------------

const config = getConmmonConfig(DEBUG, VERBOSE)

//
// Configuration for the client-side bundle (app.js)
// -----------------------------------------------------------------------------

const appConfig = getAppConfig(config ,WATCH, DEBUG, VERBOSE)

//
// Configuration for the server-side bundle (server.js)
// -----------------------------------------------------------------------------

const dllConfig = getDLLConfig(config)

export default [appConfig, dllConfig];
