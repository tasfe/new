import { createStore as _createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import ajaxMiddleware from './middleware/ajaxMiddleware'

export default function createStore(history, data) {
  // Sync dispatched route actions to the history
  const reduxRouterMiddleware = routerMiddleware(history)

  const middleware = [ajaxMiddleware, reduxRouterMiddleware]

  const store = _createStore(
    require('./reducer'),
    data,
    applyMiddleware(...middleware)
  )

  if (module.hot) {
    module.hot.accept('./reducer', () => {
      store.replaceReducer(require('./reducer'))
    })
  }

  return store
}