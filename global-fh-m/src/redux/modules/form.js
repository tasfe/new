const LOAD = 'form/LOAD';
const LOAD_SUCCESS = 'form/LOAD_SUCCESS';
const LOAD_FAIL = 'form/LOAD_FAIL';
const SAVE = 'form/SAVE';
const SAVE_SUCCESS = 'form/SAVE_SUCCESS';
const SAVE_FAIL = 'form/SAVE_FAIL';
const RESET = 'form/RESET'

const initialState = {
  loaded: false,
  formData: {}
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case RESET:
      return initialState
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
        saved: false,
        formData: action.result.root
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case SAVE:
      return {
        ...state,
        saving: true
      };
    case SAVE_SUCCESS:
      return {
        ...state,
        saving: false,
        saved: true
      };
    case SAVE_FAIL:
      return {
        ...state,
        saving: false,
        error: action.error
      };
    default:
      return state;
  }
}

export function load (option) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: () => ajax(option)
  }
}

export function save (option) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    promise: () => ajax(option)
  }
}

export function reset () {
  return {
    type: RESET
  }
}

