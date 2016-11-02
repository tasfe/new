const LOAD = 'bonus/LOAD';
const LOAD_SUCCESS = 'bonus/LOAD_SUCCESS';
const LOAD_FAIL = 'bonus/LOAD_FAIL';

const initialState = {
  loaded: false,
  bonusData: {}
};

export default (state = initialState, action = {}) => {
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
            bonusData: action.result.root
          };
    case LOAD_FAIL:
          return {
            ...state,
            loading: false,
            loaded: false,
            error: action.error
      };
    default:
      return state;
  }
}

export function loadStaticsData(data) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: () => ajax({url: '/ticket/ticketmod/userticketbonus.json', data: data})
  };
}


