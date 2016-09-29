import NormalHelper from './chase-normal-helper'
import ProfitHelper from './chase-profit-helper'

const LOAD = 'chase/LOAD';
const LOAD_SUCCESS = 'chase/LOAD_SUCCESS';
const LOAD_FAIL = 'chase/LOAD_FAIL';
const CHASE = 'chase/CHASE';
const CHASE_SUCCESS = 'chase/CHASE_SUCCESS';
const CHASE_FAIL = 'chase/CHASE_FAIL';
const SET = 'chase/SET'
const SET_HELPER = 'chase/SET_HELPER'
const RESET = 'chase/RESET'
const CREATE = 'chase/CREATE'

const initialState = {
  loaded: false,
  plans: [],
  chasePlans: 5,
  startMultiple: 1,
  gaps: 1,
  incMultiple: 1
}

let __helper = null
const helperConstructors = {
  normal: NormalHelper,
  profit: ProfitHelper
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        plans: action.result.root
      }
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case CHASE:
      return {
        ...state,
        loading: true
      };
    case CHASE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        chased: true
      }
    case CHASE_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        chaseError: action.error
      };
    case SET:
      return {
        ...state,
        ...action.data
      }
    case SET_HELPER:
      __helper = new helperConstructors[action.name](state)
      return state
    case CREATE:
      __helper.with(state).create(action.data)
      return {
        ...state
      }
    case RESET:
      return initialState
    default:
      return state
  }
}

export function load (id, cb) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: () => ajax({
      url: '/ticket/chase/chaseinfo.json',
      data: {
        ticketId: id
      }
    }, cb, cb)
  }
}

export function set (data) {
  return {
    type: SET,
    data: data
  }
}

export function setHelper (name) {
  return {
    type: SET_HELPER,
    name: name
  }
}

export function reset () {
  return {
    type: RESET
  }
}

export function create (data) {
  _.defaults(data, {
    startMultiple: 1,
    gaps: 1,
    incMultiple: 1,
  })

  return {
    type: CREATE,
    data: data
  }
}

const format = data => {
  let d = {}

  d.play = _(data.previewList).reduce(function(list, item) {
    list.push({
      betNum: item.bettingNumber,
      playId: item.playId,
      betMultiple: item.multiple,
      moneyMethod: item.unit,
      //0 高奖金 1 有返点
      betMethod: item.betMethod
    })

    return list
  }, [])

  d.plan = data.chasePlanList
  d.suspend = data.suspend

  return d
}

export function chase (data, cb) {
  return {
    types: [CHASE, CHASE_SUCCESS, CHASE_FAIL],
    promise: () => ajax({
      url: '/ticket/chase/chase.json',
      tradition: true,
      device: 3,
      data: format(data)
    }, cb, resp => {
      cb && cb(false, resp)
    })
  }
}