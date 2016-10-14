const LOAD = 'teamDynamic/LOAD';
const LOAD_SUCCESS = 'teamDynamic/LOAD_SUCCESS';
const LOAD_FAIL = 'teamDynamic/LOAD_FAIL';

const initialState = {
  loaded: false,
  teamDynamicData: {}
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
        teamDynamicData: action.result.root
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
    promise: () => ajax({url: '/info/teamreport/subuserstat.json', data: data})
  };
}


