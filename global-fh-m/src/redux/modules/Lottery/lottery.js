import { localStore } from 'storeUtil'

const loadLooteryUrl = '/ticket/ticketmod/ticketinfo.json'
const loadPatternUrl = '/ticket/ticketmod/ticketplaylist.json'
const loadMMCLooteryUrl = 'ticket/ticketmod/ticketinfoMmc.json'

const LOAD = 'lottery/LOAD';
const LOAD_SUCCESS = 'lottery/LOAD_SUCCESS';
const LOAD_FAIL = 'lottery/LOAD_FAIL';
const LOAD_PATTERN = 'lottery/LOAD_PATTERN'
const LOAD_PATTERN_SUCCESS = 'lottery/LOAD_PATTERN_SUCCESS'
const LOAD_PATTERN_FAIL = 'lottery/LOAD_PATTERN_FAIL'

const LOADMMC = 'lottery/LOAD';
const LOADMMC_SUCCESS = 'lottery/LOAD_SUCCESS';
const LOADMMC_FAIL = 'lottery/LOAD_FAIL';

const RESET = 'lottery/RESET'
const SET = 'lottery/SET'

const initialState = {
  lottery: {
    lastOpenNum: '-,-,-,-,-',
    sale: true
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD:
      return {
        ...state
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        lottery: action.result.root
      };
    case LOAD_FAIL:
      return {
        ...state,
        error: action.error
      };
    case LOAD_PATTERN:
      return {
        ...state
      };
    case LOAD_PATTERN_SUCCESS:
      return {
        ...state,
        lotteryPatterns: action.result.root
      };
    case LOAD_PATTERN_FAIL:
      return {
        ...state,
        error: action.error
      };
    case RESET:
      return {
        ...initialState,
        lottery: state.lottery,
        lotteryConfig: state.lotteryConfig
      }
    case SET:
      return {
        ...state,
        ...action.data
      }
    case LOADMMC:
      return {
        ...state
      };
    case LOADMMC_SUCCESS:
      return {
        ...state,
        lottery: action.result.root
      };
    case LOADMMC_FAIL:
      return {
        ...state,
        error: action.error
      };
    default:
      return state
  }

}

export function loadLottery (option) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: () => ajax({url: loadLooteryUrl, ...option})
  }
}

export function loadLotteryPatterns (option) {
  return {
    types: [LOAD_PATTERN, LOAD_PATTERN_SUCCESS, LOAD_PATTERN_FAIL],
    promise: () => ajax({url: loadPatternUrl, ...option})
  }
}

export function reset () {
  return {
    type: RESET
  }
}

export function set(data) {
  return {
    type: SET,
    data: data
  }
}

export function loadMMCLottery (option) {
  return {
    types: [LOADMMC, LOADMMC_SUCCESS, LOADMMC_FAIL],
    promise: () => ajax({url: loadMMCLooteryUrl, ...option})
  }
}
