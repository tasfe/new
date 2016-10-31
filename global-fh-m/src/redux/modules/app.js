const MAIN_STYLE = 'app/MAIN_STYLE';

const NORMAL = 'relative-main-container';
const OVERFLOW_HIDDEN = 'relative-main-container overflow-hidden'

const initialState = {
  mainStyle: 'relative-main-container'
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case MAIN_STYLE:
      return {
        ...state,
        mainStyle: action.mainStyle
      };
    default:
      return state;
  }
}

export function toggleMainStyle(style) {

  switch (style) {
    case 'overflow-hidden':
      style = OVERFLOW_HIDDEN
        break;
    default:
      style = NORMAL
        break;
  }

  return {
    type: MAIN_STYLE,
    mainStyle: style
  }
}
