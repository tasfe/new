import Helper from './betting-helper'

const SET = 'betting/SET'
const RESET = 'betting/RESET'
const ADD = 'betting/ADD'
const REMOVE = 'betting/REMOVE'
const ORDER = 'betting/ORDER'
const MMC = 'betting/MMC'

const initialState = {
  maxBonus: 195000,
  unit: 10000,
  formatUnit: '元',
  statistics: 0,
  userRebate: 0,
  previewList: [],
  totalInfo: {}
}

const __helper = new Helper()

export default (state = initialState, action) => {
  switch (action.type) {
    case SET:
      __helper.with(state).process(action.data)
      return {
        ...state
      }
    case RESET:
      return initialState
    case ADD:
      return {
        ...state,
        adding: true
      }
    case REMOVE:
      __helper.with(state).remove(action.index)
      return {
        ...state
      }
    case ORDER:
      __helper.with(state).order(action.id, action.cb)
      return {
        ...state
      }
    case MMC:
      __helper.with(state).mmc(action.id, action.cb)
      return {
        ...state
      }
    default:
      return state
  }
}

export function set (data) {
  return {
    type: SET,
    data: data
  }
}

export function reset () {
  return {
    type: RESET
  }
}

export function add () {
  return {
    type: ADD
  }
}

export function remove (index) {
  return {
    type: REMOVE,
    index: index
  }
}

export function order (id, cb) {
  return {
    type: ORDER,
    id: id,
    cb: cb
  }
}

export function mmc (id, cb) {
  return {
    type: MMC,
    id: id,
    cb: cb
  }
}