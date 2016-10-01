import App from './containers/App'
import Login from './containers/Login'
import Register from './containers/Register'
import ResetPassword from './containers/ResetPassword'
import SetpsdFirst from './containers/SetpsdFirst'
import { isLoaded as isAuthLoaded, load as loadAuth } from './redux/modules/auth'
import { reset as resetAjax } from './ajax/ajax'
import { reset as resetToolbar } from './redux/modules/toolbar'

export default store => {
  const routes = [{
    path: '/',
    component: App,
    childRoutes: [
      require('./modules/User'),
      require('./modules/Message'),
      require('./modules/History'),
      require('./modules/Agency'),
      //require('./modules/Help'),
      require('./modules/Lottery'),
      require('./modules/Tickets'),
      require('./modules/Fund')
    ],
    onChange () {
      resetAjax()
      store.dispatch(resetToolbar())
    },
    onEnter (nextState, replace, cb) {
      const checkAuth = () => {
        const {auth: { user }} = store.getState()

        if (!user) {
          replace('/login')
        }

        cb()
      }

      if (!isAuthLoaded(store.getState())) {
       store.dispatch(loadAuth()).then(checkAuth)
      } else {
       checkAuth()
        store.dispatch(loadAuth()).then(checkAuth)
      }
      //cb()
    }
  }, {
    path: '/login',
    component: Login
  }, {
    path: '/reg/:id',
    component: Register
  }, {
    path: '/setpsd',
    component: SetpsdFirst
  }, {
    path: '/resetPassword',
    component: ResetPassword
  }]

  return routes
}