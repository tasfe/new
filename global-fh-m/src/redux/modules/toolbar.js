const SET_TITLE = 'toolbar/SET_TITLE';
const INIT_FORM = 'toolbar/INIT_FORM';
const LOAD = 'toolbar/LOAD';
const LOAD_SUCCESS = 'toolbar/LOAD_SUCCESS';
const LOAD_FAIL = 'toolbar/LOAD_FAIL';
const SET_LEFT_BUTTON = 'toolbar/set_left_button'
const SET_RIGHT_BUTTON = 'toolbar/set_right_button'
const SET_MIDDLE_BUTTON = 'toolbar/set_middle_button'
const RESET = 'toolbar/reset'

const initialState = {
  loaded: false,
  title: '首页'
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_TITLE:
      return {
        ...state,
        title: action.title
      };
    case INIT_FORM:
      return {
        ...state,
        formConfig: action.config
      };
    case SET_LEFT_BUTTON:
      return {
        ...state,
        leftButton: action.el
      }
    case SET_RIGHT_BUTTON:
      return {
        ...state,
        rightButton: action.el
      }
    case SET_MIDDLE_BUTTON:
      return {
        ...state,
        middleButton: action.el
      }
    case RESET:
      return {
        ...state,
        leftButton: null,
        rightButton: null,
        middleButton: null
      }
    default:
      return state;
  }
}

export function setTitle (newTitle) {
  return {
    type: SET_TITLE,
    title: newTitle
  }
}

export function initForm (config) {
  return {
    type: INIT_FORM,
    config: config
  }
}

export function setLeftButton (el) {
  return {
    type: SET_LEFT_BUTTON,
    el: el
  }
}

export function setRightButton (el) {
  return {
    type: SET_RIGHT_BUTTON,
    el: el
  }
}

export function setMiddleButton (el) {
  return {
    type: SET_MIDDLE_BUTTON,
    el: el
  }
}

export function reset () {
  return {
    type: RESET
  }
}

