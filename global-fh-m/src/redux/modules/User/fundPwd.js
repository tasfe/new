const SAVE = 'fundPwd/SAVE';
const SAVE_SUCCESS = 'fundPwd/SAVE_SUCCESS';
const SAVE_FAIL = 'fundPwd/SAVE_FAIL';

const CHECK = 'fundPwd/CHECK';
const CHECK_SUCCESS = 'fundPwd/CHECK_SUCCESS';
const CHECK_FAIL = 'fundPwd/CHECK_FAIL';

const VERIFY = 'fundPwd/VERIFY';
const VERIFY_SUCCESS = 'fundPwd/VERIFY_SUCCESS';
const VERIFY_FAIL = 'fundPwd/VERIFY_FAIL';

const initialState = {
  saving: true,
  saved: false,
  checking: true,
  checked: false,
  verifying: true,
  verified: false
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SAVE:
      return {
        ...state,
      };
    case SAVE_SUCCESS:
      return {
        ...state,
        saving: false,
        saved: true,
        saveSucc: action.result.root
      };
    case SAVE_FAIL:
      return {
        ...state,
        saving: false,
        saved: false,
        saveError: action.error
      };
    case CHECK:
      return {
        ...state,
      };
    case CHECK_SUCCESS:
      console.log(action)
      return {
        ...state,
        checking: false,
        checked: true,
        checkSucc: action.result.root
      };
    case CHECK_FAIL:
      console.log(action)
      return {
        ...state,
        checking: false,
        checked: false,
        checkError: action.error
      };
    case VERIFY:
      return {
        ...state,
      };
    case VERIFY_SUCCESS:
      return {
        ...state,
        verifying: false,
        verified: true,
        verifySucc: action.result,
      };
    case VERIFY_FAIL:
      return {
        ...state,
        verifying: false,
        verified: false,
        varifyError: action.error
      };

    default:
      return state;
  }
}

export function saveFundPwd (data) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    promise: () => ajax({url: '/fund/moneypd/savepaypwd.json', data: data})
  };
}

export function checkFundPwd () {
  return {
    types: [CHECK, CHECK_SUCCESS, CHECK_FAIL],
    promise: () => ajax({url: '/fund/moneypd/checkpaypwd.json'})
  };

}

export function verifyFundPwd (data) {
  return {
    types: [VERIFY, VERIFY_SUCCESS, VERIFY_FAIL],
    promise: () => ajax({url: '/fund/moneypd/verify.json', data: data})
  };
}