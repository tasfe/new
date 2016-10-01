import { combineReducers } from 'redux'
import { routeReducer } from 'react-router-redux'

import auth from './modules/auth';
import toolbar from './modules/toolbar'
import form from './modules/form'
import table from './modules/table'
import profile from './modules/User/profile'
import bankCard from './modules/User/bankCard'
import fundPwd from './modules/User/fundPwd'
import bonus from './modules/User/bonus'

import lottery from './modules/Lottery/lottery'
import betting from './modules/Lottery/betting'
import chase from './modules/Lottery/chase'

import teamDynamic from './modules/Agency/teamDynamic'
import divisionManage from './modules/Agency/divisionManage'
import oplottery from './modules/History/oplottery'

module.exports = combineReducers({
  routing: routeReducer,
  auth,
  toolbar,
  form,
  table,
  lottery,
  teamDynamic,
  profile,
  bankCard,
  fundPwd,
  bonus,
  oplottery,
  betting,
  chase,
  divisionManage
})