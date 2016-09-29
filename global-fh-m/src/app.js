import React from 'react'
import { render } from 'react-dom'
import Router from 'react-router/lib/Router'
import hashHistory from 'react-router/lib/hashHistory'
import { Provider } from 'react-redux'
import createStore from './redux/create'
import getRoutes from './routes'
import sthGlobal from 'sthGlobal'
import math from '_mixins'
import Alert from 'components/Alert'

const store = createStore(hashHistory)

render(
  <Provider store={store} key="provider">
    <Router
      history={hashHistory}
      routes={getRoutes(store)}
    />
  </Provider>,
  document.getElementById('app')
)
