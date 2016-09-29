import React from 'react'
import { render } from 'react-dom'
import Router from 'react-router/lib/Router'
import Route from 'react-router/lib/Route'
import hashHistory from 'react-router/lib/hashHistory'
import Register from './containers/Register'
import sthGlobal from 'sthGlobal'
import math from '_mixins'
import Alert from 'components/Alert'

render(
  <Router history={hashHistory}>
    <Route path="/" component={Register}></Route>
  </Router>,
  document.getElementById('app')
)
