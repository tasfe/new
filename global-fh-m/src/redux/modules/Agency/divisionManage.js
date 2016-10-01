const LOAD = 'divisionManage/LOAD';
const LOAD_SUCCESS = 'divisionManage/LOAD_SUCCESS';
const LOAD_FAIL = 'divisionManage/LOAD_FAIL';

const initialState = {
  loaded: false,
  divisionManageData: {}
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
        divisionManageData: action.result.root
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

export function loadStaticsData() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: () => ajax({url: '/fund/divid/info.json'})
  };
}


