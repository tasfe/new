const LOAD_L1 = 'oplottery/LOAD_L1';
const LOAD_L1_SUCCESS = 'oplottery/LOAD_L1_SUCCESS';
const LOAD_L1_FAIL = 'oplottery/LOAD_L1_FAIL';

const initialState = {
  loaded: false,
  openData: {}
  //openData5: {},
  //openData6: {},
  //openData10: {}
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case LOAD_L1:
      return {
        ...state,
        loading: true
      };
    case LOAD_L1_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        openData: action.result.root
      };
    case LOAD_L1_FAIL:
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

export function loadData(data) {
  return {
    types: [LOAD_L1, LOAD_L1_SUCCESS, LOAD_L1_FAIL],
    promise: () => ajax({url: '/ticket/ticketmod/lastopen.json'})
  };
}

//export function loadL5Data(data) {
//  return {
//    types: [LOAD_L5, LOAD_L5_SUCCESS, LOAD_L5_FAIL],
//    promise: () => ajax({url: '/ticket/ticketmod/openhistory.json', data: data})
//  };
//}
//
//export function loadL6Data(data) {
//  return {
//    types: [LOAD_L6, LOAD_L6_SUCCESS, LOAD_L6_FAIL],
//    promise: () => ajax({url: '/ticket/ticketmod/openhistory.json', data: data})
//  };
//}
//
//
//export function loadL10Data(data) {
//  return {
//    types: [LOAD_L10, LOAD_L10_SUCCESS, LOAD_L10_FAIL],
//    promise: () => ajax({url: '/ticket/ticketmod/openhistory.json', data: data})
//  };
//}

