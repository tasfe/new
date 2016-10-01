const LOAD = 'table/LOAD'
const LOAD_SUCCESS = 'table/LOAD_SUCCESS'
const LOAD_FAIL = 'table/LOAD_FAIL'
const FILTER = 'table/filter'
const DESTROY = 'table/DESTROY'
const DESTROY_SUCCESS = 'table/DESTROY_SUCCESS'
const DESTROY_FAIL = 'table/DESTROY_FAIL'
const RESET = 'table/RESET'

const initialState = {
  loaded: false,
  tableData: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      }
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        tableData: action.result.root,
        tableId: action.id,
        filterId: 'used'
      }
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.result
      }
    case FILTER:
      return {
        ...state,
        filterData: action.data,
        filterId: action.id + '_' + window.keyGenerator(),
        localMode: action.locally
      }
    case DESTROY:
      return {
        ...state,
        destroying: true,
        destroyed: false
      }
    case DESTROY_SUCCESS:
      return {
        ...state,
        destroying: false,
        destroyed: true,
        tableData: action.result.root
      }
    case DESTROY_FAIL:
      return {
        ...state,
        destroying: false,
        destroyed: false,
        error: action.result
      }
    case RESET:
      return initialState
    default:
      return state
  }
}

export function filter (id, data) {
  let locally = 'local' === data
  return {
    type: FILTER,
    data: locally ? {} : data,
    locally: locally,
    id: id
  }
}

export function load (option, id) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: () => ajax(option),
    id: id
  }
}

export function destroy (option) {
  return {
    types: [DESTROY, DESTROY_SUCCESS, DESTROY_FAIL],
    promise: () => ajax(option)
  }
}

export function reset () {
  return {
    type: RESET
  }
}
